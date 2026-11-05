/* Math 15 · Unit 1 · Lesson 2 — Review: Operations with Fractions and Decimals (REV: Grade 9 review)
 * Assignment 2 (u1_L02.tex, Questions 1–16) and the Lesson 2 Extra Practice (u1_EP02.tex, Questions 1–21).
 * Every part is a generator: the same kind of fractions (denominator a multiple of the other, coprime denominators,
 * an answer that reduces, a mixed number, regrouping, a negative fraction), the same operations and bracket placement
 * as the booklet item, new numbers (the booklet's own numbers are among the possible values). No calculator.
 * Expressions are read by a small exact (rational) parser that writes the worked solution one step per line
 * (mixed → improper, ÷ → × reciprocal, rewrite with the LCD, combine, reduce) and works out the typical wrong values
 * (tops and bottoms added straight across, no reciprocal, left to right instead of BEDMAS, the whole number of a
 * mixed number kept aside) so each gets its own hint.
 * Answers: a fraction answer is accepted as a fraction in lowest terms or as a mixed number (both are typed with the
 * keypad's two fraction keys); "in lowest terms" items nudge an unreduced fraction (no try used); "as a mixed number"
 * items nudge an improper fraction. Decimal answers must be decimals.
 * Conversions: "does he have enough?" and "explain" → multiple choice whose options are reasons; "order these" → tap in
 * order; "find a fraction between" → any fraction strictly between is accepted. Outcome REV (Grade 9 review).
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ---------- a fraction keypad with a second key for mixed numbers ---------- */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.mixed) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.mixed = [
      [dk(7), dk(8), dk(9), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction: type the top number first' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: 'n<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#?}{#?}', plain: ' ', title: 'Mixed number: type the whole number first' }, { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '−', tex: '-', plain: '-' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (to the next box)' }],
      [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.mixed = ['Fraction: type the top number, press <b><sup>a</sup>⁄<sub>b</sub></b>, then type the bottom number. Mixed number: type the whole number, press <b>n<sup>a</sup>⁄<sub>b</sub></b>, then type the top and bottom numbers. Press <b>▶</b> to move to the next box.',
      'Type a fraction as <code>3/4</code> and a mixed number as <code>2 3/4</code> (a space between the whole number and the fraction).'];
  }

  /* ================= exact fractions ================= */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function R(p, q) { if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function radd(a, b) { return R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function rsub(a, b) { return R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
  function rmul(a, b) { return R(a[0] * b[0], a[1] * b[1]); }
  function rdiv(a, b) { return R(a[0] * b[1], a[1] * b[0]); }
  function rv(a) { return a[0] / a[1]; }
  function req(a, b) { return a[0] * b[1] === b[0] * a[1]; }
  function fT(a) { return a[1] === 1 ? String(a[0]) : (a[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(a[0]) + '}{' + a[1] + '}'; }      // LaTeX, improper
  function mT(a) { var p = Math.abs(a[0]), q = a[1]; if (q === 1 || p < q) return fT(a); return (a[0] < 0 ? '-' : '') + Math.floor(p / q) + (p % q ? '\\frac{' + (p % q) + '}{' + q + '}' : ''); } // LaTeX, mixed
  function bothT(a) { return Math.abs(a[0]) > a[1] && a[1] !== 1 ? fT(a) + '=' + mT(a) : fT(a); }
  function decStr(a) { return K.decTex(a); }
  function isTerm(q) { while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; }
  /* source tokens: "3|4" a fraction, "2_1|4" a mixed number, "0.25" a decimal, "5" a whole number */
  function S(p, q) { return q === 1 ? String(p) : p + '|' + q; }
  function Sm(w, p, q) { return w + '_' + p + '|' + q; }
  function SN(p, q) { return '(-' + S(p, q) + ')'; }   // a bracketed negative fraction

  function lex(s) {
    var out = [], i = 0, m;
    while (i < s.length) {
      var c = s.charAt(i), rest = s.slice(i);
      if (/\s/.test(c)) { i++; continue; }
      if ((m = /^(\d+)_(\d+)\|(\d+)/.exec(rest))) { var w = +m[1], a = +m[2], b = +m[3]; out.push({ t: 'num', v: R(w * b + a, b), k: 'mixed', w: w, a: a, b: b }); i += m[0].length; continue; }
      if ((m = /^(\d+)\|(\d+)/.exec(rest))) { out.push({ t: 'num', v: R(+m[1], +m[2]), k: 'frac', a: +m[1], b: +m[2] }); i += m[0].length; continue; }
      if ((m = /^\d+\.\d+/.exec(rest))) { var dp = m[0].split('.')[1].length; out.push({ t: 'num', v: R(Math.round(Number(m[0]) * Math.pow(10, dp)), Math.pow(10, dp)), k: 'dec', s: m[0] }); i += m[0].length; continue; }
      if ((m = /^\d+/.exec(rest))) { out.push({ t: 'num', v: [+m[0], 1], k: 'int' }); i += m[0].length; continue; }
      if ('+-*/()'.indexOf(c) >= 0) { out.push({ t: c }); i++; continue; }
      return null;
    }
    return out;
  }
  function negNum(n) { var o = {}; Object.keys(n).forEach(function (k) { o[k] = n[k]; }); o.v = [-n.v[0], n.v[1]]; if (o.s) o.s = o.s[0] === '-' ? o.s.slice(1) : '-' + o.s; return o; }
  function parseF(src, ltr) {
    var T = lex(String(src)); if (!T || !T.length) return null;
    var p = 0, OPS = { '+': 'add', '-': 'sub', '*': 'mul', '/': 'div' };
    function pk() { return T[p] ? T[p].t : null; }
    function bad() { throw new Error('parse'); }
    function atom() {
      var x = T[p]; if (!x) bad();
      if (x.t === 'num') { p++; return x; }
      if (x.t === '(') { p++; var e = EXPR(); if (pk() !== ')') bad(); p++; return { t: 'par', a: e }; }
      bad();
    }
    function unary() { if (pk() === '-') { p++; var u = unary(); return u.t === 'num' ? negNum(u) : { t: 'neg', a: u }; } return atom(); }
    function term() { var a = unary(); while (pk() === '*' || pk() === '/') { var k = T[p++].t; a = { t: OPS[k], a: a, b: unary() }; } return a; }
    function exprN() { var a = term(); while (pk() === '+' || pk() === '-') { var k = T[p++].t; a = { t: OPS[k], a: a, b: term() }; } return a; }
    function exprL() { var a = unary(); while (pk() && OPS[pk()]) { var k = T[p++].t; a = { t: OPS[k], a: a, b: unary() }; } return a; }
    var EXPR = ltr ? exprL : exprN;
    try { var tr = EXPR(); return p < T.length ? null : tr; } catch (e) { return null; }
  }
  /* m: across (add/sub tops and bottoms straight across), noflip (÷ done as ×), flipfirst (reciprocal of the first), mixw (a mixed number's whole part kept aside in × and ÷) */
  function shown(n) { return n.t === 'num' && (n.k === 'frac' || n.k === 'mixed') ? [n.k === 'mixed' ? n.w * n.b + n.a : n.a, n.b] : null; }
  function evalF(n, m) {
    m = m || {};
    switch (n.t) {
      case 'num': return n.v;
      case 'par': return evalF(n.a, m);
      case 'neg': return [-evalF(n.a, m)[0], evalF(n.a, m)[1]];
      case 'add': case 'sub':
        var A = shown(n.a), B = shown(n.b);
        if (m.across && A && B && n.a.k === 'frac' && n.b.k === 'frac' && A[1] !== B[1]) { var sa = n.a.v[0] < 0 ? -1 : 1, sb = n.b.v[0] < 0 ? -1 : 1, top = n.t === 'add' ? sa * A[0] + sb * B[0] : sa * A[0] - sb * B[0], bot = n.t === 'add' ? A[1] + B[1] : A[1] - B[1]; return bot ? R(top, bot) : [NaN, 1]; }
        return n.t === 'add' ? radd(evalF(n.a, m), evalF(n.b, m)) : rsub(evalF(n.a, m), evalF(n.b, m));
      case 'mul': case 'div':
        if (m.mixw && n.a.t === 'num' && n.a.k === 'mixed') { var fpart = R(n.a.a, n.a.b), rest = n.t === 'mul' ? rmul(fpart, evalF(n.b, m)) : rdiv(fpart, evalF(n.b, m)); return radd([n.a.w * (n.a.v[0] < 0 ? -1 : 1), 1], rest); }
        var x = evalF(n.a, m), y = evalF(n.b, m);
        if (n.t === 'mul') return rmul(x, y);
        if (m.noflip) return rmul(x, y);
        if (m.flipfirst) return rmul(R(x[1], x[0]), y);
        return y[0] === 0 ? [NaN, 1] : rdiv(x, y);
    }
    return [NaN, 1];
  }
  function valF(src) { return evalF(parseF(src)); }
  function numT(n) {
    var neg = n.v[0] < 0, s;
    if (n.tex) s = n.tex;
    else if (n.k === 'dec' || n.k === 'decres') s = n.s != null ? n.s.replace(/^-/, '') : decStr([Math.abs(n.v[0]), n.v[1]]);
    else if (n.k === 'mixed') s = n.w + '\\frac{' + n.a + '}{' + n.b + '}';
    else if (n.k === 'frac' && n.a != null) s = '\\frac{' + n.a + '}{' + n.b + '}';
    else s = n.v[1] === 1 ? String(Math.abs(n.v[0])) : '\\frac{' + Math.abs(n.v[0]) + '}{' + n.v[1] + '}';
    return { neg: neg, s: s };
  }
  function texF(n, first) {
    switch (n.t) {
      case 'num': var q = numT(n); if (!q.neg) return q.s; return first ? '-' + q.s : '\\left(-' + q.s + '\\right)';
      case 'par': return '\\left(' + texF(n.a, true) + '\\right)';
      case 'neg': return '-' + texF(n.a, false);
      case 'add': return texF(n.a, first) + '+' + texF(n.b, false);
      case 'sub': return texF(n.a, first) + '-' + texF(n.b, false);
      case 'mul': return texF(n.a, first) + '\\times ' + texF(n.b, false);
      case 'div': return texF(n.a, first) + '\\div ' + texF(n.b, false);
    }
    return '?';
  }
  function txF(src) { return texF(parseF(src), true); }
  /* ---- one step at a time ---- */
  function isN(n) { return n.t === 'num' || (n.t === 'par' && n.a.t === 'num'); }
  function nn(n) { return n.t === 'num' ? n : n.a; }
  function withKid(n, k, c) { var o = {}; Object.keys(n).forEach(function (x) { o[x] = n[x]; }); o[k] = c; return o; }
  function isFr(n) { n = nn(n); return n.k === 'frac' || n.k === 'mixed' || (n.k === 'res' && n.v[1] !== 1); }
  function anyDec(n) { n = nn(n); return n.k === 'dec'; }
  function result(v, a, b) { // the node for an operation's result
    a = nn(a); b = nn(b);
    if ((a.k === 'dec' || a.k === 'int' || a.k === 'decres') && (b.k === 'dec' || b.k === 'int' || b.k === 'decres') && (a.k !== 'int' || b.k !== 'int') && isTerm(v[1])) return { t: 'num', v: v, k: 'decres' };
    return { t: 'num', v: v, k: 'res' };
  }
  function walkFind(n, test) { if (!n || typeof n !== 'object') return false; if (test(n)) return true; return walkFind(n.a, test) || walkFind(n.b, test); }
  function mapNums(n, f) { if (n.t === 'num') return f(n); var o = withKid(n, 'a', mapNums(n.a, f)); if (n.b) o.b = mapNums(n.b, f); return o; }
  function stepReduce(n) { // a result left unreduced → reduced
    var hit = false;
    var out = mapNums(n, function (x) { if (!hit && x.unred) { hit = true; return { t: 'num', v: x.v, k: x.v[1] === 1 ? 'int' : 'res' }; } return x; });
    return hit ? out : null;
  }
  function stepMixed(n) { // every mixed number → improper fraction (only when there is more than one number)
    if (n.t === 'num' || !walkFind(n, function (x) { return x.t === 'num' && x.k === 'mixed'; })) return null;
    return mapNums(n, function (x) { if (x.k !== 'mixed') return x; var neg = x.v[0] < 0; return { t: 'num', v: x.v, k: 'frac', a: x.w * x.b + x.a, b: x.b }; });
  }
  function stepPar(n) {
    if (n.t === 'num') return null;
    if (n.t === 'par') { if (isN(n)) return null; var inner = stepF(n.a); return inner.t === 'num' ? inner : { t: 'par', a: inner }; }
    var ka = n.a ? stepPar(n.a) : null; if (ka) return withKid(n, 'a', ka);
    var kb = n.b ? stepPar(n.b) : null; if (kb) return withKid(n, 'b', kb);
    return null;
  }
  function den(n) { n = nn(n); return n.k === 'frac' ? n.b : n.v[1]; }
  function topOf(n) { n = nn(n); return n.k === 'frac' ? n.a * (n.v[0] < 0 ? -1 : 1) : n.v[0]; }
  function doOp(n) {
    var a = n.a, b = n.b, x = nn(a).v, y = nn(b).v;
    if (n.t === 'neg') return { t: 'num', v: [-x[0], x[1]], k: nn(a).k === 'dec' ? 'decres' : 'res' };
    if (n.t === 'div' && (isFr(a) || isFr(b) || (!anyDec(a) && !anyDec(b) && y[0] !== 0 && x[0] % y[0] !== 0))) {
      // ÷ → × reciprocal
      var rb = { t: 'num', v: R(y[1], y[0]), k: 'frac', a: Math.abs(y[1]), b: Math.abs(y[0]) };
      if (y[0] < 0) rb.v = [-Math.abs(rb.v[0]), rb.v[1]];
      if (rb.b === 1) rb = { t: 'num', v: rb.v, k: 'int' };
      return { t: 'mul', a: a, b: rb };
    }
    if ((n.t === 'add' || n.t === 'sub') && (isFr(a) || isFr(b)) && den(a) !== den(b)) {
      var L = lcm(den(a), den(b));
      var re = function (z) { var q = nn(z), v = q.v, top = v[0] * (L / v[1]); return { t: 'num', v: v, k: 'frac', a: Math.abs(top), b: L, lcd: 1 }; };
      return withKid(withKid(n, 'a', re(a)), 'b', re(b));
    }
    var v = n.t === 'add' ? radd(x, y) : n.t === 'sub' ? rsub(x, y) : n.t === 'mul' ? rmul(x, y) : rdiv(x, y);
    var res = result(v, a, b);
    if ((n.t === 'add' || n.t === 'sub') && (isFr(a) || isFr(b))) { // combine over the common denominator, reduce in the next step
      var D = den(a), top = n.t === 'add' ? topOf(a) + topOf(b) : topOf(a) - topOf(b);
      if (gcd(top, D) > 1 && top !== 0) { res = { t: 'num', v: v, k: 'frac', a: Math.abs(top), b: D, unred: 1 }; }
    }
    if (n.t === 'mul' && (isFr(a) || isFr(b))) { var tp = Math.abs(x[0] * y[0]), bt = x[1] * y[1]; if (gcd(tp, bt) > 1 && tp !== 0) res = { t: 'num', v: v, k: 'frac', a: tp, b: bt, unred: 1 }; }
    return res;
  }
  function stepOp(n, ops) {
    if (n.t === 'num' || isN(n)) return null;
    if (n.t === 'par') { var c = stepOp(n.a, ops); return c ? { t: 'par', a: c } : null; }
    var ka = n.a ? stepOp(n.a, ops) : null; if (ka) return withKid(n, 'a', ka);
    if (ops.indexOf(n.t) >= 0 && isN(n.a) && (!n.b || isN(n.b))) return doOp(n);
    var kb = n.b ? stepOp(n.b, ops) : null; if (kb) return withKid(n, 'b', kb);
    return null;
  }
  function stepF(n) { return stepReduce(n) || stepMixed(n) || stepPar(n) || stepOp(n, ['neg']) || stepOp(n, ['mul', 'div']) || stepOp(n, ['add', 'sub']) || n; }
  function stepLines(src, mixedEnd) {
    var n = parseF(src), lines = [texF(n, true)];
    for (var g = 0; g < 40 && !(n.t === 'num' && !n.unred && n.k !== 'mixed'); g++) { var n2 = stepF(n); if (n2 === n) break; n = n2; var s = texF(n, true); if (s !== lines[lines.length - 1]) lines.push(s); }
    if (n.t === 'num' && mixedEnd && Math.abs(n.v[0]) > n.v[1] && n.v[1] !== 1 && n.k !== 'decres') lines.push(mT(n.v));
    return lines;
  }
  function stepsTex(src, mixedEnd) {
    var L = stepLines(src, mixedEnd);
    if (L.length === 1) return '\\[' + L[0] + '\\]';
    return '\\[\\begin{aligned}' + L[0] + '&=' + L.slice(1).join('\\\\&=') + '\\end{aligned}\\]';
  }

  /* ================= checking a fraction answer ================= */
  function readF(resp) {
    var raw = String(resp == null ? '' : resp), m = /^\s*([-−])?\s*(\d+)\s+(\d+)\s*\/\s*(\d+)\s*$/.exec(raw);
    if (m) raw = (m[1] ? '-' : '') + m[2] + '\\frac{' + m[3] + '}{' + m[4] + '}';
    return K.read(raw);
  }
  function mixedParts(ast) {
    var s = 1, a = ast;
    while (a.t === 'neg' || a.t === 'paren') { if (a.t === 'neg') s = -s; a = a.a; }
    if (a.t === 'mul' && a.imp && a.a.t === 'neg' && a.a.a.t === 'num') { s = -s; a = { t: 'mul', imp: true, a: a.a.a, b: a.b }; }
    if (a.t !== 'mul' || !a.imp || a.a.t !== 'num' || a.a.dec || a.b.t !== 'div' || !a.b.frac) return null;
    var n = a.b.a, d = a.b.b; if (n.t !== 'num' || d.t !== 'num' || n.dec || d.dec || !d.v) return null;
    return { s: s, w: a.a.v, n: n.v, d: d.v };
  }
  /* o.lowest (default true), o.form: 'any' | 'mixed' | 'improper', o.decimalOk, o.diag(value) -> {code, hint} */
  function fracChk(T, o) {
    o = o || {}; var Tv = rv(T), lowest = o.lowest !== false;
    function diagV(v) {
      var h = o.diag ? o.diag(v) : null; if (h) return wrong(h.code || 'value', h.hint);
      if (T[0] !== 0 && ex.eq(v, 1 / Tv)) return wrong('flip', 'Your fraction is upside down — check which number goes on top.');
      if (T[0] !== 0 && ex.eq(v, -Tv)) return wrong('sign', 'Check the sign of your answer.');
      return wrong('value', null);
    }
    return function (resp) {
      var a = readF(resp); if (a.res) return a.res;
      var mp = mixedParts(a.ast);
      if (mp) {
        var mv = mp.s * (mp.w + mp.n / mp.d);
        if (mp.n >= mp.d) return ex.eq(mv, Tv) || ex.eq(a.val, Tv) ? form('u1l2-mixed-improper', 'In a mixed number the fraction part must be less than ' + t('1') + ' — take another whole out of it.') : wrong('value', null);
        if (ex.eq(mv, Tv)) {
          if (o.form === 'improper') return form('mixed-num', 'Right value! Write it as an improper fraction (for example ' + t('2\\tfrac{1}{3}=\\frac{7}{3}') + '), not a mixed number.');
          if (lowest && gcd(mp.n, mp.d) > 1) return form('lowest', 'Right value — now reduce the fraction part to lowest terms (divide its top and bottom by ' + t(gcd(mp.n, mp.d)) + ').');
          return ok();
        }
        return diagV(mv);
      }
      var pf = ex.plainFraction(a.ast), sh = ex.shape(a.ast), v = a.val;
      if (ex.eq(v, Tv)) {
        if (sh.decimals && !pf) { if (o.decimalOk && !sh.rep) return ok(); return form('decimal', 'Right value — now write it as a fraction instead of a decimal.'); }
        if (!pf) return form('simplify', 'That has the right value, but work it out to a single fraction.');
        if (lowest && gcd(pf[0], pf[1]) > 1) return form('lowest', 'Right value — now reduce it to lowest terms (divide the top and bottom by ' + t(gcd(pf[0], pf[1])) + ').');
        if (o.form === 'mixed' && Math.abs(pf[0]) > pf[1] && pf[1] !== 1) return form('u1l2-want-mixed', 'Right value — now write it as a <b>mixed number</b>: ' + t(fT(R(pf[0], pf[1])) + '=' + mT(R(pf[0], pf[1]))) + '.');
        return ok();
      }
      if (sh.decimals && !pf && Math.abs(v - Tv) < 0.01) return form('decimal-rounded', 'That decimal is close but not exact. Give the exact answer as a fraction.');
      return diagV(v);
    };
  }
  /* a decimal answer */
  function decChk(T, diag, o) {
    o = o || {}; var Tv = typeof T === 'number' ? T : rv(T), base = K.number(Tv, diag);
    return function (resp) {
      var raw = String(resp == null ? '' : resp).replace(/\\\$|\$/g, '').trim(), p = HW.parse.number(raw);
      if (!p.ok) { var a = readF(raw); if (!a.res && ex.eq(a.val, Tv)) return o.fracOk ? ok() : form('u1l2-as-decimal', 'Right value — now write it as a <b>decimal</b>.'); }
      return base(raw);
    };
  }
  function fracInput(before) { return { type: 'math', keys: 'mixed', before: before == null ? t('=') : before }; }

  /* ---- typical mistakes for an expression ---- */
  function mistakes(src, ans) {
    var tr = parseF(src), out = [], seen = [ans];
    function add(code, v, hint) { if (!v || !isFinite(v[0]) || !isFinite(v[1]) || !v[1]) return; for (var i = 0; i < seen.length; i++) if (req(seen[i], v)) return; seen.push(v); out.push({ code: code, v: v, hint: hint }); }
    add('u1l2-across', evalF(tr, { across: true }), 'You can’t add or subtract the tops and the bottoms straight across. Rewrite the fractions with a <b>common denominator</b> first, then combine only the numerators.');
    add('u1l2-no-flip', evalF(tr, { noflip: true }), 'To divide by a fraction, multiply by its <b>reciprocal</b>: flip the second fraction, then multiply.');
    add('u1l2-flip-first', evalF(tr, { flipfirst: true }), 'Flip the <b>second</b> fraction (the one you divide by), not the first.');
    add('u1l2-ltr', evalF(parseF(src, true)), 'It looks like you worked from left to right. Follow BEDMAS: brackets first, then × and ÷, then + and −.');
    add('u1l2-mixed-whole', evalF(tr, { mixw: true }), 'Change each mixed number to an improper fraction <b>before</b> you multiply or divide — the whole number can’t be kept aside.');
    if (ans[0] !== 0) add('sign', [-ans[0], ans[1]], 'Check the sign of your answer.');
    return out;
  }
  function diagOf(ms, extra) {
    return function (v) {
      if (extra) { var h = extra(v); if (h) return h; }
      for (var i = 0; i < ms.length; i++) if (ex.eq(v, rv(ms[i].v))) return { code: ms[i].code, hint: ms[i].hint };
      return null;
    };
  }
  function hintsF(src) {
    var s = String(src), h = [];
    if (/_/.test(s)) h.push('Change each mixed number to an improper fraction first.');
    if (/\(/.test(s.replace(/\(-[\d|_.]+\)/g, ''))) h.push('Work inside the brackets first.');
    if (/[*\/]/.test(s.replace(/\d\|\d/g, '')) && /[+]|\d-|\)-/.test(s.replace(/^-/, ''))) h.push('Do × and ÷ before + and −.');
    if (/\//.test(s.replace(/(\d)\|(\d)/g, '$1$2'))) h.push('To divide, multiply by the reciprocal of the second fraction.');
    if (/[+]|\d-|\)-/.test(s.replace(/^-/, '')) && /\|/.test(s)) h.push('To add or subtract, rewrite the fractions with a common denominator.');
    if (/\|/.test(s) && /\*/.test(s) && h.length < 2) h.push('To multiply, multiply the tops and multiply the bottoms. Cancel common factors first to keep the numbers small.');
    if (!h.length) h.push('Line up the decimal points to add or subtract; count decimal places to multiply.');
    return h.slice(0, 2);
  }
  /* evaluate a fraction expression; o.form 'any' | 'mixed', o.dec (a decimal answer) */
  function fPart(src, o) {
    o = o || {};
    var ans = valF(src), ms = mistakes(src, ans), dg = diagOf(ms, o.diag);
    var sol = (o.pre || '') + stepsTex(src, o.form !== 'improper') + (o.post || '');
    var p;
    if (o.dec) p = { prompt: o.prompt || t(txF(src)), input: { type: 'number', before: o.before || t('=') }, check: decChk(ans, dg), key: decStr(ans), answer: t(decStr(ans)), solution: sol, hints: o.hints || hintsF(src), text: o.text || 'evaluate ' + src };
    else p = { prompt: o.prompt || t(txF(src)), input: fracInput(o.before), check: fracChk(ans, { form: o.form, diag: dg, lowest: o.lowest }), key: o.form === 'mixed' ? mT(ans) : fT(ans), answer: t(bothT(ans)), solution: sol, hints: o.hints || hintsF(src), text: o.text || 'evaluate ' + src };
    p.bad = ms.map(function (m) { return o.dec ? decStr(m.v) : fT(m.v); });
    if (!o.dec && Math.abs(ans[0]) > ans[1] && ans[1] !== 1) p.good = [o.form === 'mixed' ? mT(ans) : mT(ans), plainMixed(ans)].concat(o.form === 'mixed' ? [] : [fT(ans)]);
    return p;
  }
  function plainMixed(a) { var p = Math.abs(a[0]), q = a[1]; return (a[0] < 0 ? '-' : '') + Math.floor(p / q) + ' ' + (p % q) + '/' + q; }

  HW.addCodes({
    'u1l2-across': 'Added/subtracted tops and bottoms straight across', 'u1l2-not-scaled': 'Changed the denominator but not the numerator', 'u1l2-no-flip': 'Divided without the reciprocal',
    'u1l2-flip-first': 'Flipped the first fraction instead of the second', 'u1l2-ltr': 'Worked left to right instead of BEDMAS', 'u1l2-mixed-whole': 'Kept the whole number aside when multiplying/dividing',
    'u1l2-equiv-add': 'Equivalent fraction: added instead of multiplied', 'u1l2-equiv-mult': 'Equivalent fraction: gave the multiplier', 'u1l2-half-reduce': 'Divided only the top or only the bottom',
    'u1l2-dec-digits': 'Wrote the digits of the fraction as a decimal', 'u1l2-place-value': 'Wrong place value (tenths/hundredths)', 'u1l2-dec-place': 'Decimal point in the wrong place',
    'u1l2-wrong-op': 'Used the wrong operation', 'u1l2-tip-missing': 'Left out the tip', 'u1l2-tip-once': 'Split the tip as well as the bill', 'u1l2-want-mixed': 'Improper fraction instead of a mixed number',
    'u1l2-mixed-improper': 'Mixed number with an improper fraction part', 'u1l2-as-decimal': 'Fraction instead of a decimal', 'u1l2-borrow': 'Subtracted the fraction parts the wrong way round (no regrouping)',
    'u1l2-whole-only': 'Combined only the whole numbers', 'u1l2-rep-as-term': 'Treated a repeating decimal as terminating', 'u1l2-rep-99': 'Repeating decimal: wrong denominator (9 or 99)',
    'u1l2-not-between': 'Fraction not between the two', 'u1l2-endpoint': 'Gave one of the two fractions', 'u1l2-added-discounts': 'Added the two discounts', 'u1l2-used-fraction': 'Gave the fraction instead of the amount',
    'u1l2-number-fraction': 'Multiplied instead of working backwards', 'u1l2-short-wrong': 'Wrong amount short / left over', 'u1l2-one-discount': 'Applied only the first discount'
  });
  HW.addPartial({
    'u1l2-across': 'n', 'u1l2-not-scaled': 'b', 'u1l2-no-flip': 'n', 'u1l2-flip-first': 'b', 'u1l2-ltr': 'n', 'u1l2-mixed-whole': 'b', 'u1l2-equiv-add': 'n', 'u1l2-equiv-mult': 'b',
    'u1l2-half-reduce': 'b', 'u1l2-dec-digits': 'n', 'u1l2-place-value': 'b', 'u1l2-dec-place': 's', 'u1l2-wrong-op': 'n', 'u1l2-tip-missing': 's', 'u1l2-tip-once': 's', 'u1l2-borrow': 'b',
    'u1l2-whole-only': 'b', 'u1l2-rep-as-term': 'n', 'u1l2-rep-99': 'b', 'u1l2-not-between': 'n', 'u1l2-endpoint': 'n', 'u1l2-added-discounts': 'b', 'u1l2-used-fraction': 's', 'u1l2-number-fraction': 'n', 'u1l2-short-wrong': 's', 'u1l2-one-discount': 's'
  });

  /* ---------- generators ---------- */
  function find(gen, test, fallback) { for (var i = 0; i < 600; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function proper(r, dens) { var q = r.pick(dens), p = r.int(1, q - 1); while (gcd(p, q) > 1) p = r.int(1, q - 1); return [p, q]; }
  function nlist(a) { return a.length === 2 ? a[0] + ' and ' + a[1] : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }

  /* Q1: missing numerator */
  function equivPart(r, dens, unit) {
    var f = unit ? [1, r.pick(dens)] : proper(r, dens), k = r.int(2, 6), N = f[1] * k, ans = f[0] * k;
    var p = P.number(t('\\frac{' + f[0] + '}{' + f[1] + '}=\\frac{\\square}{' + N + '}'), ans, function (v) {
      if (v === f[0] + (N - f[1])) return { code: 'u1l2-equiv-add', hint: 'The denominator was <b>multiplied</b> by ' + t(k) + ' (' + t(f[1] + '\\times ' + k + '=' + N) + '), so multiply the numerator by ' + t(k) + ' too — don’t add.' };
      if (v === k) return { code: 'u1l2-equiv-mult', hint: t(k) + ' is what the denominator was multiplied by. Multiply the numerator by it as well.' };
      return null;
    }, t(N + '\\div ' + f[1] + '=' + k) + ', so multiply the top by ' + t(k) + ' too: ' + t('\\frac{' + f[0] + '}{' + f[1] + '}=\\frac{' + f[0] + '\\times ' + k + '}{' + f[1] + '\\times ' + k + '}=\\frac{' + ans + '}{' + N + '}') + '.',
    ['What was the denominator multiplied by to get ' + t(N) + '?', 'Multiply the numerator by the same number.'], 'equivalent ' + f.join('/') + ' over ' + N, { before: t('\\square=') });
    p.bad = [String(f[0] + N - f[1]), String(k)].filter(function (s) { return Number(s) !== ans; });
    return p;
  }
  /* Q2: simplify */
  function simplifyPart(r, dens, gs) {
    var f = proper(r, dens), g = r.pick(gs), a = f[0] * g, b = f[1] * g;
    var p = { prompt: t('\\frac{' + a + '}{' + b + '}'), input: fracInput(), check: fracChk(f, { diag: function (v) { if (ex.eq(v, f[0] / b) || ex.eq(v, a / f[1])) return { code: 'u1l2-half-reduce', hint: 'Divide the top <b>and</b> the bottom by the same number.' }; return null; } }),
      key: fT(f), answer: t(fT(f)), text: 'simplify ' + a + '/' + b,
      solution: 'GCF' + t('(' + a + ',' + b + ')=' + g) + ', so divide the top and bottom by ' + t(g) + ': ' + t('\\frac{' + a + '}{' + b + '}=\\frac{' + a + '\\div ' + g + '}{' + b + '\\div ' + g + '}=' + fT(f)) + '.',
      hints: ['Find the greatest common factor of ' + t(a) + ' and ' + t(b) + '.', 'Divide the top and the bottom by it.'] };
    p.bad = ['\\frac{' + f[0] + '}{' + b + '}', '\\frac{' + (f[0] + 1) + '}{' + f[1] + '}'];
    return p;
  }
  /* add/subtract two fractions with the not-scaled mistake added */
  function addFracPart(a, op, b) {
    var src = S(a[0], a[1]) + op + S(b[0], b[1]), L = lcm(a[1], b[1]);
    var ns = op === '+' ? R(a[0] + b[0], L) : R(a[0] - b[0], L);
    var p = fPart(src, { pre: 'LCD ' + t('=' + L) + '.', diag: function (v) { if (!req(ns, valF(src)) && ex.eq(v, rv(ns))) return { code: 'u1l2-not-scaled', hint: 'When you change a denominator to ' + t(L) + ', multiply its numerator by the same number.' }; return null; } });
    if (!req(ns, valF(src))) p.bad.push(fT(ns));
    return p;
  }
  /* mixed numbers: add or subtract, wholes and fractions separately */
  function mixedAddSub(m1, op, m2, o) {
    o = o || {};
    var A = R(m1[0] * m1[2] + m1[1], m1[2]), B = R(m2[0] * m2[2] + m2[1], m2[2]), ans = op === '+' ? radd(A, B) : rsub(A, B), L = lcm(m1[2], m2[2]);
    var f1 = m1[1] * L / m1[2], f2 = m2[1] * L / m2[2], W = op === '+' ? m1[0] + m2[0] : m1[0] - m2[0], src = Sm(m1[0], m1[1], m1[2]) + op + Sm(m2[0], m2[1], m2[2]);
    var sol;
    if (op === '+') {
      var fs = f1 + f2;
      sol = 'Wholes: ' + t(m1[0] + '+' + m2[0] + '=' + W) + '. Fractions (LCD ' + t(L) + '): ' + t('\\frac{' + f1 + '}{' + L + '}+\\frac{' + f2 + '}{' + L + '}=\\frac{' + fs + '}{' + L + '}' + (gcd(fs, L) > 1 || fs >= L ? '=' + mT(R(fs, L)) : '')) + '.<br>Together: ' + t(mT(ans)) + '.';
    } else if (f1 >= f2) {
      sol = 'Wholes: ' + t(m1[0] + '-' + m2[0] + '=' + W) + '. Fractions (LCD ' + t(L) + '): ' + t('\\frac{' + f1 + '}{' + L + '}-\\frac{' + f2 + '}{' + L + '}=\\frac{' + (f1 - f2) + '}{' + L + '}' + (gcd(f1 - f2, L) > 1 && f1 !== f2 ? '=' + fT(R(f1 - f2, L)) : '')) + '.<br>Together: ' + t(mT(ans)) + '.';
    } else {
      sol = 'LCD ' + t(L) + ': ' + t(m1[0] + '\\frac{' + f1 + '}{' + L + '}-' + m2[0] + '\\frac{' + f2 + '}{' + L + '}') + '. The fraction being taken away is bigger, so <b>regroup</b>: ' + t(m1[0] + '\\frac{' + f1 + '}{' + L + '}=' + (m1[0] - 1) + '\\frac{' + (f1 + L) + '}{' + L + '}') + '.<br>' +
        t((m1[0] - 1) + '\\frac{' + (f1 + L) + '}{' + L + '}-' + m2[0] + '\\frac{' + f2 + '}{' + L + '}=' + (m1[0] - 1 - m2[0]) + '\\frac{' + (f1 + L - f2) + '}{' + L + '}' + (gcd(f1 + L - f2, L) > 1 ? '=' + mT(ans) : '')) + '.<br>(Or use improper fractions:' + stepsTex(src, true) + ')';
    }
    var borrowV = op === '-' && f1 < f2 ? R(W * L + (f2 - f1), L) : null, wholeV = [W, 1];
    var p = fPart(src, { form: o.form, diag: function (v) {
      if (borrowV && ex.eq(v, rv(borrowV))) return { code: 'u1l2-borrow', hint: 'You subtracted the smaller fraction from the larger one. Since ' + t('\\frac{' + f1 + '}{' + L + '}') + ' is less than ' + t('\\frac{' + f2 + '}{' + L + '}') + ', regroup: borrow ' + t('1') + ' from the whole number first (or change both to improper fractions).' };
      if (ex.eq(v, W)) return { code: 'u1l2-whole-only', hint: 'Don’t forget the fraction parts.' };
      return null;
    }, hints: ['Work with the whole numbers and the fraction parts separately (common denominator for the fractions).', op === '-' && f1 < f2 ? 'The second fraction part is bigger — regroup: borrow ' + t('1') + ' from the first whole number.' : 'Then put the whole number and the fraction back together.'] });
    p.solution = sol;
    if (borrowV) p.bad.push(fT(borrowV));
    return p;
  }
  /* Q8: fraction → decimal */
  function toDecPart(f) {
    var ans = decStr(f);
    var p = { prompt: t('\\frac{' + f[0] + '}{' + f[1] + '}'), input: { type: 'number', before: t('=') }, check: decChk(f, function (v) {
      if (ex.eq(v, Number(f[0] + '.' + f[1])) || ex.eq(v, Number('0.' + f[0] + f[1])) || ex.eq(v, Number('0.' + f[1]))) return { code: 'u1l2-dec-digits', hint: 'A fraction isn’t turned into a decimal by writing its digits. Divide: ' + t(f[0] + '\\div ' + f[1]) + '.' };
      if (ex.eq(v, f[1] / f[0])) return { code: 'flip', hint: 'Divide the <b>top</b> by the bottom: ' + t(f[0] + '\\div ' + f[1]) + '.' };
      return null;
    }), key: ans, answer: t(ans), text: 'to decimal ' + f.join('/'),
      solution: 'Divide the top by the bottom: ' + t(f[0] + '\\div ' + f[1] + '=' + ans) + '.' + (100 % f[1] === 0 ? ' (Or: ' + t('\\frac{' + f[0] + '}{' + f[1] + '}=\\frac{' + f[0] * 100 / f[1] + '}{100}=' + ans) + '.)' : ''),
      hints: ['Divide the numerator by the denominator.', 100 % f[1] === 0 ? 'Or build an equivalent fraction over ' + t('100') + '.' : 'Use long division: ' + t(f[0] + '.000\\div ' + f[1]) + '.'] };
    p.bad = [f[0] + '.' + f[1]];
    return p;
  }
  /* Q9: decimal → fraction */
  function toFracPart(f) {
    var d = decStr(f), places = (d.split('.')[1] || '').length, D = Math.pow(10, places), N = Math.round(rv(f) * D);
    var p = { prompt: t(d), input: fracInput(), check: fracChk(f, { diag: function (v) {
      if (ex.eq(v, N / (D === 10 ? 100 : 10))) return { code: 'u1l2-place-value', hint: 'The last digit is in the ' + (places === 1 ? '<b>tenths</b>' : '<b>hundredths</b>') + ' place, so the denominator is ' + t(D) + '.' };
      if (ex.eq(v, 1 / N) || ex.eq(v, D / N)) return { code: 'flip', hint: 'Your fraction is upside down: the digits go on top, the place value on the bottom.' };
      return null;
    } }), key: fT(f), answer: t(fT(f)), text: 'to fraction ' + d,
      solution: 'The last digit is in the ' + (places === 1 ? 'tenths' : 'hundredths') + ' place: ' + t(d + '=\\frac{' + N + '}{' + D + '}' + (gcd(N, D) > 1 ? '=' + fT(f) : '')) + (gcd(N, D) > 1 ? ' (divide the top and bottom by ' + t(gcd(N, D)) + ')' : '') + '.',
      hints: ['Use the place value of the last digit as the denominator (tenths → ' + t('10') + ', hundredths → ' + t('100') + ').', 'Then reduce to lowest terms.'] };
    p.bad = ['\\frac{' + N + '}{' + (D === 10 ? 100 : 10) + '}'];
    return p;
  }
  /* Q10 / EP11: terminates or repeats (Q10 explains by dividing; EP11 by the denominator's prime factors) */
  function repRem(f) { var seen = {}, x = f[0] % f[1]; while (!seen[x]) { seen[x] = 1; x = x * 10 % f[1]; } return x; }
  function termPart(r, f, shownF) {
    var g = shownF || f, term = isTerm(f[1]), red = shownF && (shownF[0] !== f[0] || shownF[1] !== f[1]);
    var p = P.mc(r, t('\\frac{' + g[0] + '}{' + g[1] + '}'), [
      { html: '<b>terminates</b>', right: term, why: term ? null : 'Divide it out: ' + t('\\frac{' + f[0] + '}{' + f[1] + '}=' + decStr(f)) + '. The digits never stop.', code: 'said-term' },
      { html: '<b>repeats</b>', right: !term, why: term ? 'Divide it out: ' + t(f[0] + '\\div ' + f[1] + '=' + decStr(f)) + ' — it stops.' : null, code: 'said-rep' }],
      !shownF ? t(f[0] + '\\div ' + f[1] + '=' + decStr(f)) + (term ? ': it comes out even, so it <b>terminates</b>.' : ': the remainder ' + t(repRem(f)) + ' comes back, so the same digits come back forever. It <b>repeats</b>.') :
      (red ? 'Lowest terms first: ' + t('\\frac{' + g[0] + '}{' + g[1] + '}=' + fT(f)) + '. ' : '') + t(fT(f) + '=' + decStr(f)) + ' ' + (term ? '<b>terminates</b>' : '<b>repeats</b>') + '. ' + (term ? 'In lowest terms the denominator ' + t(f[1]) + (f[1] === 1 ? '' : '=' + K.fac(f[1])) + ' is built from 2s and 5s only.' : 'In lowest terms the denominator ' + t(f[1]) + ' has a prime factor other than 2 and 5.'),
      !shownF ? ['Divide: if the division comes out even it terminates; if a remainder comes back, the digits repeat.'] : [red ? 'Write the fraction in lowest terms first.' : 'Divide the numerator by the denominator and see whether the digits stop.', 'A decimal stops only when the denominator (in lowest terms) is built from 2s and 5s.'], 'terminate/repeat ' + g.join('/'), true);
    p.input.columns = 2; p.tries = 1;
    return p;
  }

  HW.defineLesson({
    id: 'u1l2', unit: 1, num: '2', title: 'Review: Operations with Fractions and Decimals', outcome: 'REV',
    blurb: 'Building, simplifying and computing with fractions, then converting to and from decimals.',
    questions: [
      { num: '1', section: 'Part A — Equivalent Fractions and Simplifying', stem: 'Fill in the missing numerator to make an equivalent fraction.', parts: [
        { id: '1a', level: 'LIM', make: function (r) { return equivPart(r, [2, 3, 4, 5, 6], true); } },
        { id: '1b', level: 'BEG', make: function (r) { return equivPart(r, [3, 4, 5, 6], false); } },
        { id: '1c', level: 'BEG', make: function (r) { return equivPart(r, [5, 6, 7, 8, 9], false); } }] },
      { num: '2', stem: 'Simplify each fraction to lowest terms.', parts: [
        { id: '2a', level: 'LIM', make: function (r) { return simplifyPart(r, [3, 4, 5, 7], [2, 3]); } },
        { id: '2b', level: 'BEG', make: function (r) { return simplifyPart(r, [3, 4, 5, 7], [3, 4, 5]); } },
        { id: '2c', level: 'BEG', make: function (r) { return simplifyPart(r, [3, 4, 5, 7], [5, 6, 7]); } },
        { id: '2d', level: 'BEG', make: function (r) { return simplifyPart(r, [5, 6, 7, 8], [3, 4, 5]); } }] },
      { num: '3', section: 'Part B — Operations with Fractions and Mixed Numbers', stem: 'Add or subtract. Give your answer in lowest terms.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var v = find(function () { var b = r.pick([2, 3, 4, 5]), k = r.pick([2, 3]); return [proper(r, [b]), proper(r, [b * k])]; }, function (v) { return v[0][1] !== v[1][1] && rv(v[0]) + rv(v[1]) < 1; }, [[1, 3], [1, 6]]); return addFracPart(v[0], '+', v[1]); } },
        { id: '3b', level: 'BEG', make: function (r) { var v = find(function () { var b = r.pick([2, 3, 4, 5]), k = r.pick([2, 3]); return [proper(r, [b]), proper(r, [b * k])]; }, function (v) { return v[0][1] !== v[1][1] && rv(v[0]) > rv(v[1]); }, [[3, 4], [1, 8]]); return addFracPart(v[0], '-', v[1]); } },
        { id: '3c', level: 'BEG', make: function (r) { var v = find(function () { return [proper(r, [2, 3, 4, 5, 7]), proper(r, [2, 3, 5, 7])]; }, function (v) { return gcd(v[0][1], v[1][1]) === 1 && rv(v[0]) + rv(v[1]) < 1; }, [[2, 5], [1, 2]]); return addFracPart(v[0], '+', v[1]); } },
        { id: '3d', level: 'EMG', make: function (r) { var v = find(function () { var b = r.pick([3, 4, 5, 6]), k = r.pick([2, 3, 4]); return [proper(r, [b * k]), proper(r, [b])]; }, function (v) { var L = lcm(v[0][1], v[1][1]), n = v[0][0] * L / v[0][1] - v[1][0] * L / v[1][1]; return n > 0 && gcd(n, L) > 1; }, [[5, 6], [1, 3]]); return addFracPart(v[0], '-', v[1]); } }] },
      { num: '4', stem: 'Add or subtract these mixed numbers.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { var v = find(function () { var f = proper(r, [2, 3, 4]), g = proper(r, [2, 4, 6, 8]); return [[r.int(1, 4), f[0], f[1]], [r.int(1, 4), g[0], g[1]]]; }, function (v) { return v[0][2] !== v[1][2] && v[0][1] / v[0][2] + v[1][1] / v[1][2] < 1; }, [[1, 1, 2], [2, 1, 4]]); return mixedAddSub(v[0], '+', v[1]); } },
        { id: '4b', level: 'EMG', make: function (r) { var v = find(function () { var f = proper(r, [2, 3, 4, 5]), g = proper(r, [4, 6, 8, 10]); return [[r.int(2, 5), f[0], f[1]], [r.int(1, 3), g[0], g[1]]]; }, function (v) { return v[0][2] !== v[1][2] && v[0][0] > v[1][0] && v[0][1] / v[0][2] > v[1][1] / v[1][2]; }, [[3, 1, 3], [1, 1, 6]]); return mixedAddSub(v[0], '-', v[1]); } }] },
      { num: '5', stem: 'Multiply. Simplify your answer.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var a = [1, r.pick([2, 3, 4])], b = proper(r, [3, 5, 7, 9]); if (b[0] === 1) b[0] = r.pick([2]); b = R(b[0], b[1]); if (b[1] === 1) b = [2, 5]; return fPart(S(a[0], a[1]) + '*' + S(b[0], b[1])); } },
        { id: '5b', level: 'BEG', make: function (r) { var v = find(function () { return [proper(r, [3, 4, 5, 6]), proper(r, [5, 7, 9, 8, 10])]; }, function (v) { return v[0][1] === v[1][0] || gcd(v[0][0], v[1][1]) > 1; }, [[3, 4], [4, 9]]); return fPart(S(v[0][0], v[0][1]) + '*' + S(v[1][0], v[1][1])); } },
        { id: '5c', level: 'BEG', make: function (r) { var v = find(function () { return [proper(r, [4, 5, 6, 8]), proper(r, [9, 10, 12, 14, 15])]; }, function (v) { return gcd(v[0][0], v[1][1]) > 1 && gcd(v[1][0], v[0][1]) > 1; }, [[5, 6], [3, 10]]); return fPart(S(v[0][0], v[0][1]) + '*' + S(v[1][0], v[1][1]), { diag: function (x) { return ex.eq(x, v[0][0] * v[1][1] / (v[0][1] * v[1][0])) ? { code: 'u1l2-wrong-op', hint: 'Multiply straight across (top × top, bottom × bottom) — don’t cross-multiply.' } : null; } }); } }] },
      { num: '6', stem: 'Divide. Simplify your answer.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { var v = find(function () { return [proper(r, [2, 3, 4, 5]), proper(r, [3, 5, 7])]; }, function (v) { var q = rdiv(v[0], v[1]); return q[1] !== 1 && rv(q) < 1 && v[0][1] !== v[1][1]; }, [[1, 3], [2, 5]]); return fPart(S(v[0][0], v[0][1]) + '/' + S(v[1][0], v[1][1])); } },
        { id: '6b', level: 'BEG', make: function (r) { var v = find(function () { return [proper(r, [3, 4, 5, 6, 7, 8]), [1, r.pick([2, 3, 4, 5])]]; }, function (v) { var q = rdiv(v[0], v[1]); return q[1] !== 1 && rv(q) > 1 && rv(q) < 4; }, [[3, 4], [1, 2]]); return fPart(S(v[0][0], v[0][1]) + '/' + S(v[1][0], v[1][1])); } },
        { id: '6c', level: 'BEG', make: function (r) { var q = r.pick([5, 7, 9, 11]), a = r.int(1, q - 2), b = r.int(a + 1, q - 1); return fPart(S(a, q) + '/' + S(b, q)); } }] },
      { num: '7', stem: 'Multiply or divide these mixed numbers. (Convert to improper fractions first.)', parts: [
        { id: '7a', level: 'EMG', make: function (r) { var v = find(function () { var b = r.pick([2, 3, 4, 5]); return [[r.int(1, 3), r.int(1, b - 1), b], proper(r, [2, 3, 4, 5, 6, 7, 8, 9])]; }, function (v) { var A = R(v[0][0] * v[0][2] + v[0][1], v[0][2]), x = rmul(A, v[1]); return gcd(v[0][1], v[0][2]) === 1 && x[1] <= 4 && rv(x) <= 6; }, [[1, 1, 2], [2, 3]]); return fPart(Sm(v[0][0], v[0][1], v[0][2]) + '*' + S(v[1][0], v[1][1])); } },
        { id: '7b', level: 'EMG', make: function (r) { var v = find(function () { var b = r.pick([2, 3, 4, 5, 6]); return [[r.int(1, 3), r.int(1, b - 1), b], proper(r, [2, 3, 4, 5, 6, 8])]; }, function (v) { var A = R(v[0][0] * v[0][2] + v[0][1], v[0][2]), x = rdiv(A, v[1]); return gcd(v[0][1], v[0][2]) === 1 && x[1] <= 3 && rv(x) <= 8; }, [[2, 1, 4], [3, 4]]); return fPart(Sm(v[0][0], v[0][1], v[0][2]) + '/' + S(v[1][0], v[1][1])); } }] },
      { num: '8', section: 'Part C — Fractions and Decimals', stem: 'Convert each fraction to a decimal.', parts: [
        { id: '8a', level: 'LIM', make: function (r) { return toDecPart(r.pick([[1, 4], [3, 4], [1, 2], [1, 5], [2, 5], [4, 5], [1, 20], [3, 20], [7, 20], [9, 20], [1, 25], [3, 25], [6, 25], [1, 50], [7, 50], [3, 50], [11, 20], [13, 20], [17, 20], [19, 20], [11, 25]])); } },
        { id: '8b', level: 'LIM', make: function (r) { return toDecPart(r.pick([[3, 5], [1, 5], [2, 5], [4, 5], [1, 2], [7, 10], [3, 10], [9, 10], [1, 10], [11, 50], [13, 25], [9, 25], [21, 50], [17, 25], [23, 50], [8, 25], [19, 25], [1, 4], [3, 4], [27, 50], [7, 25]])); } },
        { id: '8c', level: 'LIM', make: function (r) { return toDecPart(r.pick([[7, 10], [3, 10], [9, 10], [1, 10], [7, 100], [13, 100], [29, 100], [47, 100], [3, 100], [91, 100], [11, 10], [17, 100], [51, 100], [83, 100], [9, 100], [33, 100], [61, 100], [77, 100], [1, 100], [99, 100], [39, 100]])); } },
        { id: '8d', level: 'BEG', make: function (r) { return toDecPart(r.pick([[5, 8], [1, 8], [3, 8], [7, 8], [1, 16], [3, 16], [5, 16], [9, 16], [1, 40], [3, 40], [7, 40], [9, 40], [11, 40], [13, 40], [1, 125], [3, 125], [7, 16], [11, 16], [17, 40], [19, 40], [21, 40]])); } }] },
      { num: '9', stem: 'Convert each decimal to a fraction in lowest terms.', parts: [
        { id: '9a', level: 'LIM', make: function (r) { return r.chance(0.4) ? toFracPart(R(r.pick([1, 3, 7, 9, 5, 2, 4, 6, 8]), 10)) : toFracPart(R(r.pick([5, 15, 35, 45, 55, 65, 85, 95, 50, 25, 75]), 100)); } },
        { id: '9b', level: 'BEG', make: function (r) { return toFracPart(R(r.pick([25, 15, 35, 45, 55, 65, 85, 95, 12, 16, 24, 28, 32, 36, 44, 48, 52, 56, 64, 68, 72, 76, 84, 88, 92, 96]), 100)); } },
        { id: '9c', level: 'BEG', make: function (r) { return toFracPart(R(r.pick([35, 25, 5, 65, 85, 22, 18, 14, 26, 34, 38, 42, 46, 54, 58, 62, 66, 74, 78, 82, 86, 94, 98]), 100)); } },
        { id: '9d', level: 'LIM', make: function (r) { return toFracPart(R(r.pick([4, 2, 6, 8, 5]), 10)); } }] },
      { num: '10', stem: 'For each fraction, state whether its decimal form <i>terminates</i> or <i>repeats</i>.', parts: ['a', 'b', 'c', 'd'].map(function (L, i) {
        return { id: '10' + L, level: 'BEG', make: function (r) {
          var term = r.chance(0.5) ? i % 2 === 0 : i % 2 === 1;
          var f = term ? R.apply(null, find(function () { var q = r.pick([2, 4, 5, 8, 10, 16, 20, 25]); return [r.int(1, q - 1), q]; }, function (v) { return gcd(v[0], v[1]) === 1; }, [1, 4])) : R.apply(null, find(function () { var q = r.pick([9, 6, 7, 11, 12, 15]); return [r.int(1, q - 1), q]; }, function (v) { return gcd(v[0], v[1]) === 1; }, [4, 9]));
          return termPart(r, f);
        } };
      }) },
      { num: '11', section: 'Part D — Order of Operations and Applications', stem: 'Evaluate using the correct order of operations. Give your answer in lowest terms.', parts: [
        { id: '11a', level: 'EMG', make: function (r) { var v = find(function () { return [proper(r, [2, 3, 4, 5]), proper(r, [2, 3, 4, 5]), proper(r, [3, 4, 5, 6])]; }, function (v) { var x = rmul(v[1], v[2]), s = radd(v[0], x); return x[1] <= 12 && s[1] <= 12 && rv(s) < 1.5 && !req(s, rmul(radd(v[0], v[1]), v[2])); }, [[1, 2], [1, 3], [3, 4]]); return fPart(S(v[0][0], v[0][1]) + '+' + S(v[1][0], v[1][1]) + '*' + S(v[2][0], v[2][1])); } },
        { id: '11b', level: 'EMG', make: function (r) { var v = find(function () { return [proper(r, [2, 3, 4, 5, 6]), proper(r, [2, 3, 4]), proper(r, [2, 3, 4, 5])]; }, function (v) { var x = rmul(v[1], v[2]), s = rsub(v[0], x); return s[0] > 0 && x[1] <= 12 && s[1] <= 12 && !req(s, rmul(rsub(v[0], v[1]), v[2])); }, [[5, 6], [1, 4], [2, 3]]); return fPart(S(v[0][0], v[0][1]) + '-' + S(v[1][0], v[1][1]) + '*' + S(v[2][0], v[2][1])); } }] },
      { num: '12', stem: 'Evaluate using the correct order of operations.', parts: [
        { id: '12a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(15, 60) / 10, r.int(1, 9) / 10, r.int(2, 6)]; }, function (v) { return v[0] - v[1] * v[2] > 0; }, [3.2, 0.5, 4]); return fPart(v[0].toFixed(1) + '-' + v[1].toFixed(1) + '*' + v[2], { dec: true }); } },
        { id: '12b', level: 'BEG', make: function (r) { var a = r.int(5, 35) / 10, b = r.int(1, 9) / 10; return fPart('(' + a.toFixed(1) + '+' + b.toFixed(1) + ')*' + r.int(2, 5), { dec: true }); } }] },
      { num: '13', stem: '', parts: [
        { id: '13', level: 'EMG', make: function (r) {
          var v = find(function () { return [proper(r, [2, 3, 4, 5, 8]), r.pick([[1, 2], [1, 3], [1, 4], [2, 3], [3, 4]])]; }, function (v) { var x = rmul(v[0], v[1]); return x[1] <= 16 && !req(v[0], v[1]); }, [[3, 4], [1, 3]]);
          var item = r.pick([['pancake', 'milk', 'Priya'], ['muffin', 'sugar', 'Jordan'], ['cookie', 'butter', 'Mateo'], ['bread', 'water', 'Ava']]), amt = v[0], part = v[1], ans = rmul(amt, part);
          var src = S(amt[0], amt[1]) + '*' + S(part[0], part[1]);
          var p = fPart(src, { prompt: 'A ' + item[0] + ' recipe calls for ' + t(fT(amt)) + ' cup of ' + item[1] + ' to make one full batch. ' + item[2] + ' wants to make only ' + t(fT(part)) + ' of the recipe. How much ' + item[1] + ' should ' + (item[2] === 'Priya' || item[2] === 'Ava' ? 'she' : 'he') + ' use?',
            before: '', pre: '“' + t(fT(part)) + ' of” means ' + t('\\times ' + fT(part)) + ':', post: t(fT(ans)) + ' cup of ' + item[1] + '.',
            diag: function (x) { if (ex.eq(x, rv(rdiv(amt, part))) || ex.eq(x, rv(radd(amt, part))) || ex.eq(x, Math.abs(rv(rsub(amt, part))))) return { code: 'u1l2-wrong-op', hint: '“' + t(fT(part)) + ' of” the recipe means <b>multiply</b> by ' + t(fT(part)) + '.' }; return null; },
            hints: ['“' + t(fT(part)) + ' of” means multiply by ' + t(fT(part)) + '.'], text: 'recipe ' + src });
          p.input.after = 'cup'; p.input.before = '';
          return p;
        } }] },
      { num: '14', stem: '', parts: [
        { id: '14', level: 'EMG', make: function (r) {
          var n = r.pick([2, 3, 4, 5]), share = r.pick([7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) + r.pick([0, 0.25, 0.5, 0.75, 0.2, 0.4, 0.6, 0.8]), total = Math.round(share * n * 100) / 100, tip = r.pick([1, 1.5, 2, 2.5, 3]), ans = Math.round((share + tip) * 100) / 100;
          var word = ['', '', 'Two', 'Three', 'Four', 'Five'][n];
          var p = { prompt: word + ' friends go out for lunch. The total bill, including tax, is ' + t('\\$' + total.toFixed(2)) + '. They split the bill evenly, and each friend also leaves a ' + t('\\$' + tip.toFixed(2)) + ' tip. How much does each friend pay in total?',
            input: { type: 'number', before: '$' }, key: ans.toFixed(2), answer: t('\\$' + ans.toFixed(2)), text: 'lunch ' + total + '/' + n + '+' + tip,
            check: decChk(ans, function (x) {
              if (ex.eq(x, share)) return { code: 'u1l2-tip-missing', hint: 'That’s each friend’s share of the bill. Each friend also leaves a ' + t('\\$' + tip.toFixed(2)) + ' tip.' };
              if (ex.eq(x, share + tip / n)) return { code: 'u1l2-tip-once', hint: '<b>Each</b> friend leaves a ' + t('\\$' + tip.toFixed(2)) + ' tip — it isn’t split.' };
              if (ex.eq(x, total + tip)) return { code: 'u1l2-wrong-op', hint: 'Split the bill first: divide it by ' + t(n) + '.' };
              return null;
            }),
            solution: 'Split the bill: ' + t('\\$' + total.toFixed(2) + '\\div ' + n + '=\\$' + share.toFixed(2)) + '. Add the tip: ' + t('\\$' + share.toFixed(2) + '+\\$' + tip.toFixed(2) + '=\\$' + ans.toFixed(2)) + '.',
            hints: ['First find each friend’s share of the bill.', 'Then add one tip.'] };
          p.bad = [share.toFixed(2), (share + tip / n).toFixed(4)].filter(function (s) { return Math.abs(Number(s) - ans) > 1e-9; });
          return p;
        } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'BEG', make: function (r) {
          var f = proper(r, [3, 4, 5, 6, 7, 8, 9]), k = r.int(2, 4), D = f[1] * k, right = f[0] * k;
          var nums = find(function () { return r.sample([right - f[0], right + f[0], right + 1, right - 1, right + 2 * f[0], f[0] + k, D, f[0] * (k + 1)].filter(function (x) { return x > 0 && x !== right && x <= D; }), 3); }, function (a) { return a.length === 3 && a[0] !== a[1] && a[1] !== a[2] && a[0] !== a[2]; }, [right + 1, right + 2, D]);
          var opts = nums.concat([right]).sort(function (a, b) { return a - b; }).map(function (x) { return { html: t('\\frac{' + x + '}{' + D + '}'), right: x === right, why: x === right ? null : t('\\frac{' + x + '}{' + D + '}') + ' reduces to ' + t(fT(R(x, D))) + ', not ' + t(fT(f)) + '. The denominator was multiplied by ' + t(k) + ' — what must the numerator be?' }; });
          return P.mc(r, 'Which fraction below is equivalent to ' + t(fT(f)) + '?', opts, t(D + '\\div ' + f[1] + '=' + k) + ', so multiply the top and bottom by ' + t(k) + ': ' + t('\\frac{' + f[0] + '\\times ' + k + '}{' + f[1] + '\\times ' + k + '}=\\frac{' + right + '}{' + D + '}') + '.', ['All the options have denominator ' + t(D) + '. What was ' + t(f[1]) + ' multiplied by?'], 'MC equivalent ' + f.join('/'), true);
        } }] },
      { num: '16', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var v = find(function () { var b = r.int(1, 5) / 10, q = r.int(2, 6), a = Math.round(b * q * 10) / 10, c = r.int(1, 25) / 10; return [a, b, c]; }, function (v) { return v[0] < 10 && String(Math.round((v[0] / v[1] + v[2]) * 10) / 10).length <= 4; }, [0.6, 0.2, 1.5]);
          var src = v[0].toFixed(1) + '/' + v[1].toFixed(1) + '+' + v[2].toFixed(1), ans = valF(src), ms = mistakes(src, ans);
          var p = { prompt: 'Evaluate ' + t(txF(src)) + '. &nbsp; The answer is ________.', input: { type: 'number', nr: true }, check: K.number(rv(ans), function (x) {
            if (ex.eq(x, v[0] * v[1] + v[2])) return { code: 'u1l2-wrong-op', hint: 'That’s ' + t(v[0].toFixed(1) + '\\times ' + v[1].toFixed(1)) + '. Divide instead.' };
            if (ex.eq(x, v[0] / v[1] / 10 + v[2]) || ex.eq(x, v[0] / v[1] * 10 + v[2])) return { code: 'u1l2-dec-place', hint: 'Check the division ' + t(v[0].toFixed(1) + '\\div ' + v[1].toFixed(1)) + ': multiply both by ' + t('10') + ' first, ' + t(Math.round(v[0] * 10) + '\\div ' + Math.round(v[1] * 10)) + '.' };
            for (var i = 0; i < ms.length; i++) if (ex.eq(x, rv(ms[i].v))) return { code: ms[i].code, hint: ms[i].hint };
            return null;
          }, { nr: true }), key: decStr(ans), answer: t(decStr(ans)), text: 'NR ' + src,
            solution: 'Divide first: ' + t(v[0].toFixed(1) + '\\div ' + v[1].toFixed(1) + '=' + Math.round(v[0] * 10) + '\\div ' + Math.round(v[1] * 10) + '=' + Math.round(v[0] / v[1])) + '. Then add:' + stepsTex(src),
            hints: ['Division before addition.', 'To divide by ' + t(v[1].toFixed(1)) + ', multiply both numbers by ' + t('10') + ' first.'] };
          p.bad = [String(Math.round((v[0] * v[1] + v[2]) * 1000) / 1000)];
          return p;
        } }] }
    ],
    extra: [
      { num: '1', section: 'Extra practice A — Order of operations with three or more terms', stem: 'Evaluate. Remember that multiplication and division come before addition and subtraction. Give each answer in lowest terms.', parts: [
        { id: 'e1a', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [3, 4, 5]), proper(r, [2, 3, 4]), proper(r, [3, 4, 5, 6])]; }, function (v) { var s = radd(v[0], rmul(v[1], v[2])); return s[1] <= 30 && !req(s, rmul(radd(v[0], v[1]), v[2])); }, [[2, 3], [1, 4], [4, 5]]); return fPart(S(v[0][0], v[0][1]) + '+' + S(v[1][0], v[1][1]) + '*' + S(v[2][0], v[2][1])); } },
        { id: 'e1b', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [2, 3, 4, 6]), proper(r, [2, 3, 4, 5]), proper(r, [3, 4, 5, 9])]; }, function (v) { var s = rsub(v[0], rdiv(v[1], v[2])); return s[1] <= 24 && s[0] > 0; }, [[5, 6], [1, 3], [4, 9]]); return fPart(S(v[0][0], v[0][1]) + '-' + S(v[1][0], v[1][1]) + '/' + S(v[2][0], v[2][1])); } },
        { id: 'e1c', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [3, 4, 5]), proper(r, [5, 8, 9, 10]), proper(r, [2, 3, 6, 4])]; }, function (v) { var s = radd(rmul(v[0], v[1]), v[2]); return s[1] <= 24 && rmul(v[0], v[1])[1] <= 12; }, [[3, 4], [8, 9], [1, 6]]); return fPart(S(v[0][0], v[0][1]) + '*' + S(v[1][0], v[1][1]) + '+' + S(v[2][0], v[2][1])); } }] },
      { num: '2', stem: 'Evaluate. Brackets first.', parts: [
        { id: 'e2a', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [2, 3, 4]), proper(r, [3, 4, 5, 6]), proper(r, [4, 5, 6, 8])]; }, function (v) { var s = rdiv(radd(v[0], v[1]), v[2]); return s[1] <= 6 && rv(s) <= 4 && v[0][1] !== v[1][1]; }, [[1, 2], [1, 3], [5, 6]]); return fPart('(' + S(v[0][0], v[0][1]) + '+' + S(v[1][0], v[1][1]) + ')/' + S(v[2][0], v[2][1])); } },
        { id: 'e2b', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [6, 8, 9, 10, 12]), proper(r, [2, 3, 4, 5]), proper(r, [3, 4, 5, 6])]; }, function (v) { var s = rsub(v[0], radd(v[1], v[2])); return s[0] > 0 && s[1] <= 30 && v[1][1] !== v[2][1]; }, [[7, 8], [1, 4], [1, 3]]); return fPart(S(v[0][0], v[0][1]) + '-(' + S(v[1][0], v[1][1]) + '+' + S(v[2][0], v[2][1]) + ')'); } },
        { id: 'e2c', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [3, 4, 5, 7]), proper(r, [3, 4, 5, 6]), proper(r, [2, 3, 4])]; }, function (v) { var d = rsub(v[1], v[2]); return d[0] > 0 && rmul(v[0], d)[1] <= 30 && v[1][1] !== v[2][1]; }, [[2, 5], [3, 4], [1, 2]]); return fPart(S(v[0][0], v[0][1]) + '*(' + S(v[1][0], v[1][1]) + '-' + S(v[2][0], v[2][1]) + ')'); } }] },
      { num: '3', stem: 'Evaluate. These use decimals instead of fractions, but the order of operations does not change.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var a = r.int(1, 9) / 10, b = r.pick([0.25, 0.5, 0.75, 0.2, 0.4, 0.3]), c = r.pick([1.2, 0.8, 1.6, 2.4, 0.4, 1.5, 2]); return fPart(a.toFixed(1) + '+' + String(b) + '*' + String(c), { dec: true }); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var c = r.pick([0.5, 0.2, 0.4, 0.3, 0.6]), q = r.int(2, 8), d = r.int(1, 15) / 10, a = Math.round((c * q + d) * 10) / 10; return fPart('(' + a.toFixed(1) + '-' + d.toFixed(1) + ')/' + String(c), { dec: true }); } },
        { id: 'e3c', level: 'EMG', make: function (r) { var a = r.pick([1.5, 2.5, 0.5, 1.2, 2.4, 0.8]), b = r.pick([0.4, 0.2, 0.6, 3]), d = r.pick([0.2, 0.3, 0.4, 0.5]), c = Math.round(d * r.int(2, 6) * 10) / 10; return fPart(String(a) + '*' + String(b) + '+' + c.toFixed(1) + '/' + String(d), { dec: true }); } }] },
      { num: '4', section: 'Extra practice B — Mixed numbers and complex fractions', stem: 'Subtract. The fraction being taken away is larger than the fraction it is taken from, so <b>regroup</b> (borrow ' + t('1') + ' from the whole number) or convert to improper fractions first. Write each answer as a mixed number in lowest terms.', parts: ['a', 'b', 'c'].map(function (L, i) {
        return { id: 'e4' + L, level: 'PRG', make: function (r) {
          var v = find(function () { var f = proper(r, [[6, 3, 5][i], [3, 4, 2][i], 4, 5, 6]), g = proper(r, [[4, 6, 10][i], 6, 8, 10, 12]); return [[r.int(3, 7), f[0], f[1]], [r.int(1, 3), g[0], g[1]]]; }, function (v) { return v[0][2] !== v[1][2] && v[0][0] - v[1][0] >= 2 && v[0][1] / v[0][2] < v[1][1] / v[1][2] && lcm(v[0][2], v[1][2]) <= 24; }, [[5, 1, 6], [2, 3, 4]]);
          return mixedAddSub(v[0], '-', v[1], { form: 'mixed' });
        } };
      }) },
      { num: '5', stem: 'Multiply or divide. Convert every mixed number to an improper fraction first.', parts: [
        { id: 'e5a', level: 'PRG', make: function (r) { var v = mm(r, 'mul'); return fPart(Sm.apply(null, v[0]) + '*' + Sm.apply(null, v[1])); } },
        { id: 'e5b', level: 'PRG', make: function (r) { var v = mm(r, 'div'); return fPart(Sm.apply(null, v[0]) + '/' + Sm.apply(null, v[1])); } },
        { id: 'e5c', level: 'PRG', make: function (r) { var v = mm(r, 'mul'); return fPart(Sm.apply(null, v[0]) + '*' + Sm.apply(null, v[1])); } }] },
      { num: '6', stem: 'A <b>complex fraction</b> is a fraction whose numerator and denominator are themselves fractions. The main fraction bar still means “divide”, so rewrite each one as a division and multiply by the reciprocal.', parts: [
        { id: 'e6a', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [3, 4, 5]), proper(r, [2, 3, 4, 5])]; }, function (v) { var q = rdiv(v[0], v[1]); return q[1] <= 12 && v[0][1] !== v[1][1]; }, [[3, 4], [2, 3]]); return complexPart(v[0], v[1], null); } },
        { id: 'e6b', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [4, 6, 8, 9]), proper(r, [7, 9, 10, 12])]; }, function (v) { var q = rdiv(v[0], v[1]); return v[1][0] > v[1][1] - 3 && q[1] <= 12 && gcd(v[0][1], v[1][1]) > 1 && v[0][1] !== v[1][1]; }, [[5, 6], [9, 10]]); if (r.chance(0.5)) v[1] = [v[1][1] + r.int(1, 3), v[1][1]]; v[1] = R(v[1][0], v[1][1]); if (v[1][1] === 1) v[1] = [10, 9]; return complexPart(v[0], v[1], null); } },
        { id: 'e6c', level: 'PRG', make: function (r) { var v = find(function () { var b = r.pick([2, 3, 4]); return [[r.int(1, 3), r.int(1, b - 1), b], proper(r, [3, 4, 5, 8])]; }, function (v) { var A = R(v[0][0] * v[0][2] + v[0][1], v[0][2]), q = rdiv(A, v[1]); return gcd(v[0][1], v[0][2]) === 1 && q[1] <= 4 && rv(q) <= 12; }, [[2, 1, 4], [3, 8]]); return complexPart(null, v[1], v[0]); } }] },
      { num: '7', section: 'Extra practice C — Negative fractions', stem: 'Add or subtract. The integer sign rules from Lesson 1 apply to the numerators.', parts: [
        { id: 'e7a', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [3, 4, 5]), proper(r, [2, 3, 6, 8])]; }, function (v) { return rv(v[0]) > rv(v[1]) && v[0][1] !== v[1][1] && lcm(v[0][1], v[1][1]) <= 24; }, [[3, 4], [1, 6]]); return fPart('-' + S(v[0][0], v[0][1]) + '+' + S(v[1][0], v[1][1])); } },
        { id: 'e7b', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [3, 4, 5]), proper(r, [2, 3, 4, 6])]; }, function (v) { return v[0][1] !== v[1][1] && lcm(v[0][1], v[1][1]) <= 20; }, [[2, 5], [1, 3]]); return fPart(S(v[0][0], v[0][1]) + '-' + SN(v[1][0], v[1][1])); } },
        { id: 'e7c', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [4, 5, 6, 8, 10]), proper(r, [2, 3, 4, 5])]; }, function (v) { return v[0][1] !== v[1][1] && rv(v[0]) + rv(v[1]) > 1 && lcm(v[0][1], v[1][1]) <= 12; }, [[5, 8], [3, 4]]); return fPart('-' + S(v[0][0], v[0][1]) + '-' + S(v[1][0], v[1][1])); } }] },
      { num: '8', stem: 'Multiply or divide. Decide the sign of the answer before you start.', parts: [
        { id: 'e8a', level: 'EMG', make: function (r) { var v = find(function () { return [proper(r, [3, 4, 5]), proper(r, [8, 9, 10])]; }, function (v) { return gcd(v[0][1], v[1][0]) > 1 || gcd(v[0][0], v[1][1]) > 1; }, [[2, 3], [9, 10]]); return fPart(SN(v[0][0], v[0][1]) + '*' + SN(v[1][0], v[1][1])); } },
        { id: 'e8b', level: 'EMG', make: function (r) { var v = find(function () { return [proper(r, [3, 4, 5, 6]), [r.int(1, 3), r.pick([9, 10, 12, 15, 8])]]; }, function (v) { var q = rdiv(v[0], v[1]); return gcd(v[1][0], v[1][1]) === 1 && q[1] === 1; }, [[4, 5], [2, 15]]); return fPart('-' + S(v[0][0], v[0][1]) + '/' + S(v[1][0], v[1][1])); } },
        { id: 'e8c', level: 'EMG', make: function (r) { var v = find(function () { return [proper(r, [4, 5, 8]), proper(r, [8, 10, 16, 12])]; }, function (v) { var q = rdiv(v[0], v[1]); return q[1] <= 6 && v[0][1] !== v[1][1]; }, [[3, 8], [9, 16]]); return fPart(SN(v[0][0], v[0][1]) + '/' + SN(v[1][0], v[1][1])); } }] },
      { num: '9', stem: 'Evaluate using the correct order of operations.', parts: [
        { id: 'e9a', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [2, 3, 4]), proper(r, [2, 3, 4]), proper(r, [3, 4, 5])]; }, function (v) { var s = radd([-v[0][0], v[0][1]], rmul([-v[1][0], v[1][1]], v[2])); return s[1] <= 20 && s[0] !== 0; }, [[1, 2], [1, 3], [3, 5]]); return fPart('-' + S(v[0][0], v[0][1]) + '+' + SN(v[1][0], v[1][1]) + '*' + S(v[2][0], v[2][1])); } },
        { id: 'e9b', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [2, 3, 4, 5]), proper(r, [2, 3, 4]), proper(r, [2, 3, 4])]; }, function (v) { var s = rsub([-v[0][0], v[0][1]], rdiv([-v[1][0], v[1][1]], v[2])); return s[1] <= 24; }, [[3, 4], [1, 2], [2, 3]]); return fPart('-' + S(v[0][0], v[0][1]) + '-' + SN(v[1][0], v[1][1]) + '/' + S(v[2][0], v[2][1])); } },
        { id: 'e9c', level: 'PRG', make: function (r) { var v = find(function () { return [proper(r, [3, 5, 4]), proper(r, [5, 6, 8]), proper(r, [2, 3, 4, 6])]; }, function (v) { var s = rsub(rmul(v[0], v[1]), v[2]); return s[1] <= 24 && s[0] !== 0 && rmul(v[0], v[1])[1] <= 12; }, [[2, 5], [5, 6], [1, 4]]); return fPart(SN(v[0][0], v[0][1]) + '*' + SN(v[1][0], v[1][1]) + '-' + S(v[2][0], v[2][1])); } }] },
      { num: '10', section: 'Extra practice D — Repeating decimals, terminating decimals and ordering', stem: 'A bar over a digit means that digit repeats forever, so ' + t('0.\\overline{6}=0.666\\ldots') + '. A single repeating digit can be written over ' + t('9') + ', and a repeating <i>pair</i> of digits over ' + t('99') + '. Convert each repeating decimal to a fraction in lowest terms.', parts: [
        { id: 'e10a', level: 'EMG', make: function (r) { return repPart(r.pick([1, 2, 3, 4, 5, 6, 7, 8]), 1); } },
        { id: 'e10b', level: 'EMG', make: function (r) { return repPart(r.pick([1, 2, 3, 4, 5, 6, 7, 8]), 1); } },
        { id: 'e10c', level: 'EMG', make: function (r) { return repPart(r.pick([27, 18, 36, 45, 54, 63, 72, 81, 12, 15, 21, 24, 33, 42, 48, 51, 57, 66, 69, 75, 78, 84, 87, 93, 96]), 2); } },
        { id: 'e10d', level: 'EMG', make: function (r) { return repPart(r.pick([18, 27, 9, 13, 17, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 7, 11]), 2); } }] },
      { num: '11', stem: '<b>Without dividing</b>, state whether each decimal form terminates or repeats. First simplify the fraction to lowest terms, then look at the prime factors of the denominator.', parts: ['a', 'b', 'c', 'd', 'e'].map(function (L, i) {
        return { id: 'e11' + L, level: i >= 3 ? 'PRG' : 'EMG', make: function (r) {
          var f, g;
          if (i === 0) { f = R.apply(null, find(function () { var q = r.pick([16, 8, 32, 40, 25, 50, 80]); return [r.int(1, q - 1), q]; }, function (v) { return gcd(v[0], v[1]) === 1; }, [3, 16])); g = f; }
          else if (i === 1) { f = R.apply(null, find(function () { var q = r.pick([12, 15, 18, 14, 21, 24, 30]); return [r.int(1, q - 1), q]; }, function (v) { return gcd(v[0], v[1]) === 1; }, [7, 12])); g = f; }
          else if (i === 2) { f = R.apply(null, find(function () { var q = r.pick([20, 40, 25, 125, 50, 8]); return [r.int(1, q - 1), q]; }, function (v) { return gcd(v[0], v[1]) === 1; }, [9, 20])); g = f; }
          else if (i === 3) { var v3 = find(function () { var q = r.pick([8, 16, 20, 40, 5, 4]), k = r.pick([3, 6, 9]), p = r.int(1, q - 1); return [p, q, k]; }, function (v) { return gcd(v[0], v[1]) === 1; }, [5, 8, 3]); f = [v3[0], v3[1]]; g = [v3[0] * v3[2], v3[1] * v3[2]]; }
          else { var v4 = find(function () { var q = r.pick([3, 9, 6, 7, 11]), k = r.pick([7, 2, 5, 4, 3]), p = r.int(1, q - 1); return [p, q, k]; }, function (v) { return gcd(v[0], v[1]) === 1 && v[1] * v[2] <= 60; }, [2, 3, 7]); f = [v4[0], v4[1]]; g = [v4[0] * v4[2], v4[1] * v4[2]]; }
          return termPart(r, f, g);
        } };
      }) },
      { num: '12', stem: '', parts: [
        { id: 'e12', level: 'PRG', make: function (r) {
          var a = r.pick([3, 6, 7, 9, 11, 12]), b = r.pick([4, 5, 8, 16, 20, 25]);
          return P.mc(r, '<b>Explain</b> why ' + t('\\frac{1}{' + a + '}') + ' gives a repeating decimal but ' + t('\\frac{1}{' + b + '}') + ' gives a terminating one.', [
            { html: 'We count in base ten, and ' + t('10=2\\times 5') + '. ' + t(b + (b === 4 || b === 8 || b === 16 || b === 25 ? '=' + K.fac(b) : b === 5 ? '' : '=' + K.fac(b))) + ' is built from 2s and 5s, so ' + t('\\frac{1}{' + b + '}') + ' can be rewritten over ' + t('10') + ', ' + t('100') + ', ' + t('1000') + ', …; ' + t(a) + ' has a prime factor other than 2 or 5, so no power of ten is a multiple of it.', right: true },
            { html: 'Odd denominators always give repeating decimals and even ones give terminating decimals.', why: t('\\frac{1}{5}=0.2') + ' terminates (odd denominator) and ' + t('\\frac{1}{6}=0.1\\overline{6}') + ' repeats (even denominator).' },
            { html: 'Larger denominators give repeating decimals; small ones give terminating decimals.', why: t('\\frac{1}{3}') + ' repeats but ' + t('\\frac{1}{16}=0.0625') + ' terminates. Size isn’t the reason.' },
            { html: 'Calculators only show a few digits, so some decimals look like they repeat.', why: 'The repeating is real: the long division gets back to a remainder it has seen before. Think about what our number system counts in.' }],
            'Our number system is base ten and ' + t('10=2\\times 5') + '. A fraction in lowest terms can be rewritten with a denominator of ' + t('10, 100, 1000,\\ldots') + ' exactly when its denominator is built from 2s and 5s only. ' + t('\\frac{1}{' + b + '}=' + decStr([1, b])) + ' terminates; ' + t('\\frac{1}{' + a + '}=' + decStr([1, a])) + ' repeats.',
            ['What are the prime factors of ' + t('10') + '? Of ' + t(a) + '? Of ' + t(b) + '?'], 'why repeat 1/' + a + ' vs 1/' + b);
        } }] },
      { num: '13', stem: 'Arrange from <b>least to greatest</b>. Converting everything to a decimal is the fastest way to compare.', parts: [
        { id: 'e13', level: 'PRG', make: function (r) { return orderPart(r, false); } }] },
      { num: '14', stem: 'Arrange from <b>least to greatest</b>. Be careful — with negatives, the number farthest from zero is the <i>smallest</i>.', parts: [
        { id: 'e14', level: 'PRG', make: function (r) { return orderPart(r, true); } }] },
      { num: '15', section: 'Extra practice E — Working backwards and applications', stem: 'Work backwards to find each unknown number.', parts: [
        { id: 'e15a', level: 'EMG', make: function (r) { return ofNumberPart(r, [3, 4, 5, 6], [2, 3, 4]); } },
        { id: 'e15b', level: 'PRG', make: function (r) {
          var v = find(function () { var a = proper(r, [4, 6, 8, 3]), w = r.int(1, 2), f = proper(r, [2, 3, 4, 6]); return [a, [w, f[0], f[1]]]; }, function (v) { var T = R(v[1][0] * v[1][2] + v[1][1], v[1][2]), d = rsub(T, v[0]); return d[0] > 0 && v[0][1] !== v[1][2] && lcm(v[0][1], v[1][2]) <= 12; }, [[5, 8], [1, 1, 4]]);
          var a = v[0], m = v[1], T = R(m[0] * m[2] + m[1], m[2]), ans = rsub(T, a);
          var p = fPart(Sm(m[0], m[1], m[2]) + '-' + S(a[0], a[1]), { prompt: 'What must be added to ' + t(fT(a)) + ' to make ' + t(mT(T)) + '?', before: '', pre: 'Undo the addition by subtracting: ',
            diag: function (x) { return ex.eq(x, rv(radd(T, a))) ? { code: 'u1l2-wrong-op', hint: 'Work backwards: the missing amount is the <b>difference</b> ' + t(mT(T) + '-' + fT(a)) + '.' } : null; }, text: 'add to ' + a.join('/') + ' to make ' + T.join('/') });
          p.bad.push(fT(radd(T, a)));
          return p;
        } },
        { id: 'e15c', level: 'EMG', make: function (r) { return ofNumberPart(r, [5, 7, 8, 9], [2, 3, 4, 5]); } },
        { id: 'e15d', level: 'ADV', make: function (r) {
          var v = find(function () { var a = proper(r, [3, 4, 5]), x = [r.int(3, 12), r.pick([2, 3, 4, 5])]; return [a, R(x[0], x[1])]; }, function (v) { var T = rmul(v[0], v[1]); return v[1][1] !== 1 && rv(v[1]) > 1 && rv(T) > 1 && T[1] !== 1 && T[1] <= 12; }, [[2, 3], [9, 5]]);
          var a = v[0], x = v[1], T = rmul(a, x);
          var p = fPart(Sm(Math.floor(T[0] / T[1]), T[0] % T[1], T[1]) + '/' + S(a[0], a[1]), { prompt: 'A number multiplied by ' + t(fT(a)) + ' gives ' + t(mT(T)) + '. Find the number.', before: '', pre: 'Undo the multiplication by dividing by ' + t(fT(a)) + ':',
            diag: function (y) { return ex.eq(y, rv(rmul(T, a))) ? { code: 'u1l2-number-fraction', hint: 'Work backwards: to undo “multiplied by ' + t(fT(a)) + '”, <b>divide</b> by ' + t(fT(a)) + '.' } : null; }, text: 'n × ' + a.join('/') + ' = ' + T.join('/') });
          p.bad.push(fT(rmul(T, a)));
          return p;
        } }] },
      { num: '16', stem: function (sh) { return 'One loaf of bread uses ' + t(mT(sh.a)) + ' cups of flour. Mateo wants to bake ' + t(mT(sh.b)) + ' loaves.'; },
        shared: function (r) {
          return find(function () { var a = R(r.int(2, 4) * 4 + r.pick([1, 3]), 4), b = R(r.int(1, 3) * 2 + 1, 2); if (r.chance(0.5)) { a = R(r.int(2, 3) * 3 + r.pick([1, 2]), 3); b = R(r.int(1, 2) * 2 + 1, 2); } var need = rmul(a, b), h = r.chance(0.6) ? Math.floor(rv(need)) : Math.ceil(rv(need)); return { a: a, b: b, need: need, has: h }; },
            function (s) { return s.need[1] !== 1 && s.has > 0; }, { a: [13, 4], b: [5, 2], need: [65, 8], has: 8 });
        },
        parts: [
          { id: 'e16a', level: 'PRG', make: function (r, sh) { var p = fPart(Sm(Math.floor(sh.a[0] / sh.a[1]), sh.a[0] % sh.a[1], sh.a[1]) + '*' + Sm(Math.floor(sh.b[0] / sh.b[1]), sh.b[0] % sh.b[1], sh.b[1]), { prompt: 'How much flour does he need?', before: '' }); p.input.after = 'cups'; return p; } },
          { id: 'e16b', level: 'PRG', make: function (r, sh) {
            var diff = rsub([sh.has, 1], sh.need), enough = diff[0] >= 0, amt = [Math.abs(diff[0]), diff[1]], wrongAmt = R(amt[0] + amt[1], amt[1]);
            return P.mc(r, 'He has ' + t(sh.has) + ' cups of flour. Does he have enough?', [
              { html: 'Yes — he has ' + t(mT(amt)) + ' cup' + (rv(amt) > 1 ? 's' : '') + ' left over.', right: enough, why: enough ? null : 'Compare: he needs ' + t(mT(sh.need)) + ' cups, which is <b>more</b> than ' + t(sh.has) + '.', code: 'yes' },
              { html: 'No — he is ' + t(mT(amt)) + ' cup' + (rv(amt) > 1 ? 's' : '') + ' short.', right: !enough, why: enough ? 'He needs ' + t(mT(sh.need)) + ' cups, which is less than ' + t(sh.has) + '.' : null, code: 'no' },
              { html: (enough ? 'Yes — he has ' : 'No — he is ') + t(mT(wrongAmt)) + ' cups ' + (enough ? 'left over.' : 'short.'), why: 'Check the difference between ' + t(sh.has) + ' and ' + t(mT(sh.need)) + '.', code: 'u1l2-short-wrong' }],
              'He needs ' + t(fT(sh.a) + '\\times ' + fT(sh.b) + '=' + bothT(sh.need)) + ' cups. ' + (enough ? t(sh.has + '-' + mT(sh.need) + '=' + mT(amt)) + ', so <b>yes</b>, with ' + t(mT(amt)) + ' cup' + (rv(amt) > 1 ? 's' : '') + ' left over.' : t(mT(sh.need) + '-' + sh.has + '=' + mT(amt)) + ', so <b>no</b> — he is ' + t(mT(amt)) + ' cup' + (rv(amt) > 1 ? 's' : '') + ' short.'),
              ['Compare your answer to (a) with ' + t(sh.has) + ' cups.'], 'flour enough', true);
          } }] },
      { num: '17', stem: function (sh) { return sh.name + '’s fuel tank holds ' + t(sh.C) + ' L when full. The gauge reads ' + t(fT(sh.s)) + ' full at the start of a trip and ' + t(fT(sh.e)) + ' full at the end.'; },
        shared: function (r) {
          return find(function () { var s = proper(r, [3, 4, 5, 8]), e = proper(r, [3, 4, 6, 8]), C = r.pick([40, 48, 50, 60, 72, 80]); return { s: s, e: e, C: C, name: r.pick(['Dana', 'Kai', 'Maya', 'Leo']) }; },
            function (v) { var d = rsub(v.s, v.e), L = rmul([v.C, 1], d); return d[0] > 0 && v.s[1] !== v.e[1] && (L[1] === 1 || L[1] === 2) && lcm(v.s[1], v.e[1]) <= 24; }, { s: [3, 8], e: [1, 6], C: 60, name: 'Dana' });
        },
        parts: [
          { id: 'e17a', level: 'PRG', make: function (r, sh) { var p = fPart(S(sh.s[0], sh.s[1]) + '-' + S(sh.e[0], sh.e[1]), { prompt: 'What fraction of a full tank did ' + (sh.name === 'Kai' || sh.name === 'Leo' ? 'he' : 'she') + ' use?', before: '' }); p.input.after = 'of a tank'; return p; } },
          { id: 'e17b', level: 'PRG', make: function (r, sh) {
            var d = rsub(sh.s, sh.e), L = rmul([sh.C, 1], d);
            var p = { prompt: 'How many litres is that?', input: { type: 'number', after: 'L' }, key: decStr(L), answer: t(decStr(L) + '\\text{ L}'), text: 'litres used',
              check: decChk(L, function (x) { if (ex.eq(x, rv(d))) return { code: 'u1l2-used-fraction', hint: 'That’s the fraction of a tank. Multiply it by the ' + t(sh.C) + ' L the tank holds.' }; if (ex.eq(x, sh.C * rv(sh.s))) return { code: 'u1l2-wrong-op', hint: 'That’s how much was in the tank at the start. Use the fraction that was <b>used</b>.' }; return null; }, { fracOk: true }),
              solution: t(fT(d) + '\\text{ of }' + sh.C + '\\text{ L}=' + fT(d) + '\\times ' + sh.C + '=' + decStr(L) + '\\text{ L}') + '.', hints: ['Multiply the fraction you used by the full-tank amount.'] };
            p.bad = [decStr(d)];
            return p;
          } }] },
      { num: '18', stem: function (sh) { return 'A jacket regularly costs ' + t('\\$' + sh.P) + '. It is marked down by ' + t(fT(sh.d1)) + ', and then a coupon takes a further ' + t(fT(sh.d2)) + ' off the <i>sale</i> price.'; },
        shared: function (r) { return find(function () { var d1 = [1, r.pick([2, 3, 4, 5])], d2 = [1, r.pick([2, 3, 4, 5, 6])], P0 = r.int(3, 20) * 12; return { d1: d1, d2: d2, P: P0 }; }, function (v) { var f = rmul(rsub([1, 1], v.d1), rsub([1, 1], v.d2)), k1 = rsub([1, 1], v.d1); return v.d1[1] !== v.d2[1] && (v.P * f[0]) % f[1] === 0 && (v.P * k1[0]) % k1[1] === 0 && v.P <= 200 && rsub([1, 1], radd(v.d1, v.d2))[0] > 0; }, { d1: [1, 3], d2: [1, 4], P: 84 }); },
        parts: [
          { id: 'e18a', level: 'PRG', make: function (r, sh) {
            var k1 = rsub([1, 1], sh.d1), sale = sh.P * k1[0] / k1[1], k2 = rsub([1, 1], sh.d2), fin = sale * k2[0] / k2[1], wrongV = sh.P * rv(rsub([1, 1], radd(sh.d1, sh.d2)));
            var p = P.number('What is the final price?', fin, function (x) {
              if (ex.eq(x, wrongV)) return { code: 'u1l2-added-discounts', hint: 'The coupon takes ' + t(fT(sh.d2)) + ' off the <b>sale</b> price, not the original price — so the two fractions can’t just be added.' };
              if (ex.eq(x, sale)) return { code: 'u1l2-one-discount', hint: 'That’s the sale price. Now take the coupon’s ' + t(fT(sh.d2)) + ' off it.' };
              if (ex.eq(x, sh.P * rv(sh.d1) * rv(sh.d2))) return { code: 'u1l2-wrong-op', hint: 'That’s a discount amount. The question asks for the price the customer pays.' };
              return null;
            }, 'Sale price: ' + t(fT(sh.d1) + '\\text{ off}') + ' leaves ' + t(fT(k1)) + ': ' + t(fT(k1) + '\\times ' + sh.P + '=' + sale) + ' dollars.<br>Coupon: ' + t(fT(sh.d2) + '\\text{ off}') + ' leaves ' + t(fT(k2)) + ': ' + t(fT(k2) + '\\times ' + sale + '=' + fin) + ' dollars.<br>Final price: ' + t('\\$' + fin) + '.',
            ['Find the sale price first.', 'Then take the coupon fraction off the <b>sale</b> price.'], 'jacket ' + sh.P, { before: '$' });
            if (!ex.eq(wrongV, fin)) p.bad = [String(wrongV)];
            return p;
          } },
          { id: 'e18b', level: 'ADV', make: function (r, sh) {
            var k1 = rsub([1, 1], sh.d1), k2 = rsub([1, 1], sh.d2), f = rmul(k1, k2), wrongF = rsub([1, 1], radd(sh.d1, sh.d2));
            var p = { prompt: 'What single fraction of the original price does the customer actually pay?', input: fracInput(''), check: fracChk(f, { diag: function (x) {
              if (ex.eq(x, rv(wrongF))) return { code: 'u1l2-added-discounts', hint: 'The second discount is a fraction of the <b>sale</b> price. Multiply the fractions that are left: ' + t(fT(k1) + '\\times ' + fT(k2)) + '.' };
              if (ex.eq(x, rv(rmul(sh.d1, sh.d2))) || ex.eq(x, 1 - rv(f))) return { code: 'u1l2-used-fraction', hint: 'That’s the fraction taken <b>off</b>. The question asks for the fraction paid.' };
              return null;
            } }), key: fT(f), answer: t(fT(f)), text: 'single fraction paid',
              solution: 'After the markdown the customer pays ' + t(fT(k1)) + ' of the price; the coupon leaves ' + t(fT(k2)) + ' of that. ' + t(fT(k1) + '\\times ' + fT(k2) + '=' + fT(f)) + ' of the original price. (Check: ' + t(fT(f) + '\\times ' + sh.P + '=' + sh.P * f[0] / f[1]) + '.)',
              hints: ['What fraction is left after each discount?', 'A fraction of a fraction: multiply.'] };
            if (!req(wrongF, f)) p.bad = [fT(wrongF)];
            return p;
          } }] },
      { num: '19', stem: function (sh) { return '<b>Stretch.</b> Find a fraction that is strictly between ' + t(fT(sh.a)) + ' and ' + t(fT(sh.b)) + ' — bigger than one, smaller than the other.'; },
        shared: function (r) { return find(function () { return { a: proper(r, [3, 4, 5, 6, 7]), b: proper(r, [3, 4, 5, 6, 7, 8]) }; }, function (v) { var d = rv(v.b) - rv(v.a); return d > 0 && d <= 0.12 && v.a[1] !== v.b[1]; }, { a: [1, 3], b: [2, 5] }); },
        parts: [
          { id: 'e19a', level: 'MAS', make: function (r, sh) {
            var a = sh.a, b = sh.b, mid = R(a[0] * b[1] + b[0] * a[1], 2 * a[1] * b[1]);
            var chk = function (resp) {
              var x = readF(resp); if (x.res) return x.res;
              var pf = ex.plainFraction(x.ast), mp = mixedParts(x.ast), sh2 = ex.shape(x.ast), v = mp ? mp.s * (mp.w + mp.n / mp.d) : x.val;
              if (!isFinite(v)) return wrong('value', null);
              if (ex.eq(v, rv(a)) || ex.eq(v, rv(b))) return wrong('u1l2-endpoint', 'That’s equal to one of the two fractions. You need one strictly <b>between</b> them.');
              if (!(v > rv(a) && v < rv(b))) return wrong('u1l2-not-between', 'Your number is ' + (v <= rv(a) ? 'smaller than ' + t(fT(a)) : 'bigger than ' + t(fT(b))) + '. Rewrite both with a common denominator, then make the denominator bigger until a numerator fits between.');
              if (sh2.decimals && !pf) return form('decimal', 'That number is between them — now write it as a <b>fraction</b>.');
              if (!pf && !mp) return form('simplify', 'Write it as a single fraction.');
              return ok();
            };
            var L = lcm(a[1], b[1]), A = a[0] * L / a[1], B = b[0] * L / b[1];
            var p = { prompt: 'Give one such fraction.', input: fracInput(''), check: chk, key: fT(mid), answer: t(fT(mid)) + ' (one of many)', text: 'between ' + a.join('/') + ' and ' + b.join('/'),
              solution: 'Common denominator ' + t(L) + ': ' + t(fT(a) + '=\\frac{' + A + '}{' + L + '}') + ' and ' + t(fT(b) + '=\\frac{' + B + '}{' + L + '}') + '. ' + (B - A > 1 ? t('\\frac{' + (A + 1) + '}{' + L + '}') + ' is between them.' : 'There is no whole number between ' + t(A) + ' and ' + t(B) + ', so double the denominator: ' + t('\\frac{' + 2 * A + '}{' + 2 * L + '}') + ' and ' + t('\\frac{' + 2 * B + '}{' + 2 * L + '}') + '. Now ' + t('\\frac{' + (2 * A + 1) + '}{' + 2 * L + '}' + (gcd(2 * A + 1, 2 * L) > 1 ? '=' + fT(R(2 * A + 1, 2 * L)) : '')) + ' fits between.') + ' Any fraction strictly between them is correct.',
              hints: ['Rewrite both fractions with a common denominator.', 'If no numerator fits between, double (or triple) the denominator and try again.'] };
            p.bad = [fT(a), fT(b), fT(R(b[0] + 1, b[1]))];
            return p;
          } },
          { id: 'e19b', level: 'PRG', make: function (r, sh) {
            return P.mc(r, 'Which explanation of a method shows it will <b>always</b> work for any two different fractions?', [
              { html: 'Rewrite both with a common denominator; if no whole number fits between the numerators, double the denominator (which doubles the gap between the numerators) until one does.', right: true },
              { html: 'Add the two numerators and add the two denominators.', why: 'That happens to give a number between them, but it doesn’t explain <b>why</b> — and it isn’t how fractions are added. Think about common denominators.' },
              { html: 'Halve both fractions and take the larger one.', why: 'Halving makes both smaller: half of ' + t(fT(sh.b)) + ' is less than ' + t(fT(sh.a)) + '.' },
              { html: 'There may be no fraction between two fractions that are very close.', why: 'There is always another fraction between two different fractions — the doubling method shows it.' }],
              'With a common denominator the fractions are “numerator over the same number”. Doubling the denominator doubles both numerators, so the gap between them grows: once the gap is more than ' + t('1') + ', a whole-number numerator fits between. So there is always another fraction between any two different fractions.',
              ['What happens to the gap between the numerators when you double the common denominator?'], 'why between works');
          } }] },
      { num: '20', section: 'Extra practice F — Review challenge', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e20', level: 'EMG', make: function (r) {
          var v = find(function () { return [proper(r, [3, 4, 5, 6]), proper(r, [2, 3, 4, 5])]; }, function (v) { if (req(v[0], v[1]) || rv(v[0]) <= rv(v[1])) return false; var vals = [rv(rmul(v[0], v[1])), rv(rdiv(v[0], v[1])), rv(rsub(v[0], v[1])), rv(radd(v[0], v[1]))], mx = Math.max.apply(null, vals); return vals.filter(function (x) { return x === mx; }).length === 1; }, [[3, 4], [2, 3]]);
          var a = v[0], b = v[1], E = [['\\times', rmul(a, b)], ['\\div', rdiv(a, b)], ['-', rsub(a, b)], ['+', radd(a, b)]], mx = Math.max.apply(null, E.map(function (e) { return rv(e[1]); }));
          var opts = E.map(function (e) { var right = rv(e[1]) === mx; return { html: t(fT(a) + e[0] + fT(b)), right: right, why: right ? null : t(fT(a) + e[0] + fT(b) + '=' + fT(e[1])) + '. Work out all four and compare.' }; });
          return P.mc(r, 'Which expression with ' + t(fT(a)) + ' and ' + t(fT(b)) + ' has the <b>greatest</b> value?', opts, E.map(function (e) { return t(fT(a) + e[0] + fT(b) + '=' + fT(e[1])); }).join('<br>') + '<br>The greatest is ' + t(fT(E.filter(function (e) { return rv(e[1]) === mx; })[0][1])) + '.', ['Work out all four values. Multiplying by a fraction less than 1 makes a number smaller; dividing by it makes the number bigger.'], 'greatest of ops ' + a.join('/') + ', ' + b.join('/'), true);
        } }] },
      { num: '21', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e21', level: 'EMG', make: function (r) {
          var v = find(function () { return [[1, r.pick([2, 3, 4])], [1, r.pick([4, 6, 8])], [1, r.pick([6, 8, 12, 16, 24])]]; }, function (v) { var q = rdiv(radd(v[0], v[1]), v[2]); return q[1] === 1 && v[0][1] !== v[1][1] && q[0] <= 99; }, [[1, 2], [1, 4], [1, 8]]);
          var src = '(' + S(v[0][0], v[0][1]) + '+' + S(v[1][0], v[1][1]) + ')/' + S(v[2][0], v[2][1]), ans = valF(src), ms = mistakes(src, ans);
          var p = { prompt: 'Evaluate ' + t(txF(src)) + '. &nbsp; The answer is ________.', input: { type: 'number', nr: true }, check: K.number(ans[0], diagOf(ms), { nr: true }), key: String(ans[0]), answer: t(ans[0]), text: 'NR ' + src, solution: stepsTex(src), hints: hintsF(src) };
          p.bad = ms.filter(function (m) { return m.v[1] === 1; }).map(function (m) { return String(m.v[0]); });
          return p;
        } }] },
      { num: '22', section: 'Mastery challenge', stem: '', parts: [
        { id: 'e22', level: 'MAS', make: function (r) {
          var v = find(function () { var a = [r.int(1, 3), r.pick([2, 3, 4])], b = proper(r, [3, 4, 5, 6]), c = proper(r, [2, 3, 4, 6]); return [R(a[0], a[1]), b, c]; }, function (v) { var x = radd(rmul(v[0], v[1]), v[2]); return v[0][1] !== 1 && rv(v[0]) < 1 && x[1] <= 24 && x[1] !== 1 && v[1][1] !== v[2][1]; }, [[2, 3], [3, 4], [1, 6]]);
          var a = v[0], b = v[1], c = v[2], T = radd(rmul(a, b), c);
          var ans = b, wrongs = [rmul(rsub(T, c), a), rdiv(T, a), rsub(rdiv(T, a), c)];
          var p = { prompt: 'Find the missing fraction: ' + t(fT(a) + '\\times\\square+' + fT(c) + '=' + bothT(T)), input: fracInput(t('\\square=')), check: fracChk(ans, { diag: function (x) {
            if (ex.eq(x, rv(wrongs[0]))) return { code: 'u1l2-number-fraction', hint: 'To undo “' + t('\\times ' + fT(a)) + '”, <b>divide</b> by ' + t(fT(a)) + ' (multiply by ' + t(fT(R(a[1], a[0]))) + ').' };
            if (ex.eq(x, rv(wrongs[1])) || ex.eq(x, rv(wrongs[2]))) return { code: 'u1l2-ltr', hint: 'Work backwards in reverse order: undo the ' + t('+' + fT(c)) + ' <b>first</b>, then undo the ' + t('\\times ' + fT(a)) + '.' };
            return null;
          } }), key: fT(ans), answer: t(fT(ans)), text: 'missing fraction ' + a.join('/') + ' ' + c.join('/'),
            solution: 'Undo the steps in reverse order.<br>Subtract ' + t(fT(c)) + ': ' + t(fT(a) + '\\times\\square=' + fT(T) + '-' + fT(c) + '=' + fT(rsub(T, c))) + '.<br>Divide by ' + t(fT(a)) + ': ' + t('\\square=' + fT(rsub(T, c)) + '\\div ' + fT(a) + '=' + fT(rsub(T, c)) + '\\times ' + fT(R(a[1], a[0])) + '=' + fT(ans)) + '.<br>Check: ' + t(fT(a) + '\\times ' + fT(ans) + '+' + fT(c) + '=' + fT(rmul(a, ans)) + '+' + fT(c) + '=' + fT(T)) + ' ✓',
            hints: ['Work backwards: what was added last? Undo that first.', 'Then undo the multiplication by dividing.'] };
          p.bad = wrongs.filter(function (w) { return !req(w, ans) && isFinite(w[0]); }).map(fT);
          return p;
        } }] }
    ]
  });

  /* ---------- part makers that need the helpers above ---------- */
  function mm(r, op) {
    return find(function () { var b1 = r.pick([2, 3, 4, 5]), b2 = r.pick([2, 3, 4, 5]); return [[r.int(1, 3), r.int(1, b1 - 1), b1], [r.int(1, 2), r.int(1, b2 - 1), b2]]; }, function (v) {
      if (gcd(v[0][1], v[0][2]) > 1 || gcd(v[1][1], v[1][2]) > 1) return false;
      var A = R(v[0][0] * v[0][2] + v[0][1], v[0][2]), B = R(v[1][0] * v[1][2] + v[1][1], v[1][2]), x = op === 'mul' ? rmul(A, B) : rdiv(A, B);
      return x[1] <= 4 && rv(x) <= 12 && rv(x) >= 1;
    }, op === 'mul' ? [[2, 1, 2], [1, 3, 5]] : [[3, 3, 4], [1, 1, 2]]);
  }
  function complexPart(a, b, m) {
    var topT = m ? m[0] + '\\frac{' + m[1] + '}{' + m[2] + '}' : '\\frac{' + a[0] + '}{' + a[1] + '}', src = (m ? Sm(m[0], m[1], m[2]) : S(a[0], a[1])) + '/' + S(b[0], b[1]);
    var p = fPart(src, { prompt: t('\\dfrac{\\ ' + topT + '\\ }{\\ \\frac{' + b[0] + '}{' + b[1] + '}\\ }'), pre: 'The main fraction bar means divide:' });
    return p;
  }
  function repPart(d, len) {
    var D = len === 1 ? 9 : 99, f = R(d, D), dec = '0.\\overline{' + (len === 2 && d < 10 ? '0' + d : d) + '}';
    var p = { prompt: t(dec), input: fracInput(), check: fracChk(f, { diag: function (x) {
      if (ex.eq(x, d / Math.pow(10, len))) return { code: 'u1l2-rep-as-term', hint: 'The digits never stop, so this isn’t ' + t('\\frac{' + d + '}{' + Math.pow(10, len) + '}') + '. A repeating ' + (len === 1 ? 'digit goes over ' + t('9') : 'pair goes over ' + t('99')) + '.' };
      if (ex.eq(x, d / (len === 1 ? 99 : 9))) return { code: 'u1l2-rep-99', hint: 'A single repeating digit goes over ' + t('9') + '; a repeating pair goes over ' + t('99') + '.' };
      return null;
    } }), key: fT(f), answer: t(fT(f)), text: 'repeating ' + dec,
      solution: 'The repeating block has ' + len + ' digit' + (len > 1 ? 's' : '') + ', so it goes over ' + t(D) + ': ' + t(dec + '=\\frac{' + d + '}{' + D + '}' + (gcd(d, D) > 1 ? '=' + fT(f) : '')) + (gcd(d, D) > 1 ? ' (divide the top and bottom by ' + t(gcd(d, D)) + ')' : '') + '.',
      hints: ['Put the repeating block over ' + t(D) + '.', 'Then reduce to lowest terms.'] };
    p.bad = ['\\frac{' + d + '}{' + Math.pow(10, len) + '}'];
    return p;
  }
  function ofNumberPart(r, dens, ks) {
    var a = proper(r, dens), k = r.int(2, 9), N = a[0] * k, ans = a[1] * k;
    var p = P.number(t(fT(a)) + ' of a number is ' + t(N) + '. What is the number?', ans, function (x) {
      if (ex.eq(x, N * a[0] / a[1])) return { code: 'u1l2-number-fraction', hint: 'That’s ' + t(fT(a)) + ' <b>of</b> ' + t(N) + '. Work backwards: ' + t(N) + ' is ' + t(fT(a)) + ' of the number, so divide ' + t(N) + ' by ' + t(fT(a)) + '.' };
      if (x === k) return { code: 'u1l2-wrong-op', hint: t(k) + ' is ' + t('\\frac{1}{' + a[1] + '}') + ' of the number. The whole number is ' + t(a[1]) + ' of those.' };
      return null;
    }, t(fT(a) + '\\times\\square=' + N) + ', so ' + t('\\square=' + N + '\\div ' + fT(a) + '=' + N + '\\times ' + fT(R(a[1], a[0])) + '=' + ans) + '. (Check: ' + t(fT(a) + '\\text{ of }' + ans + '=' + N) + ' ✓)',
    ['If ' + t(fT(a)) + ' of the number is ' + t(N) + ', then ' + t('\\frac{1}{' + a[1] + '}') + ' of it is ' + t(N + '\\div ' + a[0]) + '.', 'Or: divide ' + t(N) + ' by ' + t(fT(a)) + '.'], 'fraction of number ' + a.join('/') + ' is ' + N);
    if (a[0] > 1) p.bad = [String(Math.round(N * a[0] / a[1] * 1000) / 1000)];
    return p;
  }
  function orderPart(r, negs) {
    var v = find(function () {
      var c = negs ? r.int(35, 60) / 100 : r.int(30, 75) / 100, fr = [], seen = {};
      for (var q = 2; q <= 12; q++) for (var p = 1; p < q; p++) if (gcd(p, q) === 1 && Math.abs(p / q - c) <= 0.09) fr.push([p, q]);
      if (fr.length < 3) return null;
      var fs = r.sample(fr, 3), dd = Math.round((c + (r.next() - 0.5) * 0.12) * 100) / 100, rd = r.int(1, 8), rep = [rd, 9];
      if (Math.abs(rd / 9 - c) > 0.12) { rd = Math.round(c * 9); rep = [rd, 9]; }
      var items = fs.map(function (f) { return { id: 'f' + f.join('_'), v: f[0] / f[1], tex: '\\frac{' + f[0] + '}{' + f[1] + '}', dec: decStr(f) }; });
      items.push({ id: 'd' + dd, v: dd, tex: String(dd), dec: String(dd) });
      items.push({ id: 'r' + rd, v: rd / 9, tex: '0.\\overline{' + rd + '}', dec: '0.\\overline{' + rd + '}' });
      if (negs) items.forEach(function (it) { it.v = -it.v; it.tex = '-' + it.tex; it.dec = '-' + it.dec; });
      return items;
    }, function (items) {
      if (!items) return false;
      var vs = items.map(function (x) { return x.v; }).sort(function (a, b) { return a - b; });
      for (var i = 1; i < vs.length; i++) if (vs[i] - vs[i - 1] < 0.006) return false;
      return items.every(function (x) { return Math.abs(x.v) > 0.05 && Math.abs(x.v) < 0.95; });
    }, null);
    if (!v) v = (negs ? [[-0.6, '-0.6', '-0.6'], [-1 / 2, '-\\frac{1}{2}', '-0.5'], [-0.45, '-0.45', '-0.45'], [-5 / 12, '-\\frac{5}{12}', '-0.41\\overline{6}'], [-3 / 8, '-\\frac{3}{8}', '-0.375']] : [[0.58, '0.58', '0.58'], [7 / 12, '\\frac{7}{12}', '0.58\\overline{3}'], [0.6, '\\frac{3}{5}', '0.6'], [0.625, '\\frac{5}{8}', '0.625'], [2 / 3, '0.\\overline{6}', '0.\\overline{6}']]).map(function (x, i) { return { id: 'x' + i, v: x[0], tex: x[1], dec: x[2] }; });
    var items = v.slice().sort(function (a, b) { return a.v - b.v; });
    return P.order(r, t(v.map(function (x) { return x.tex; }).join(',\\quad ')), items.map(function (x) { return { id: x.id, tex: x.tex }; }), {},
      'As decimals: ' + items.map(function (x) { return t(x.tex + (x.tex !== x.dec ? '=' + x.dec : '')); }).join(', ') + '.<br>Order: ' + t(items.map(function (x) { return x.tex; }).join('<')) + '.',
      ['Change each fraction to a decimal (divide the top by the bottom), then compare.' + (negs ? ' With negatives, the number farthest from zero is the smallest.' : '')], 'order ' + (negs ? 'negatives' : 'positives'));
  }
})(window);
