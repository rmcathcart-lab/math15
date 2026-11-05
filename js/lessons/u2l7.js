/* Math 15 · Unit 2 · Lesson 7 — Combining Zero, Negative and Positive Exponents (AN3)
 * Assignment 7 (u2_L07.tex, Questions 1–16) and the Lesson 7 Extra Practice (u2_EP07.tex, Questions 1–22).
 * Every part is a generator: same structure, idea and difficulty as the booklet question, new numbers from the seed (the
 * booklet's own numbers are among the possible values).
 * Expressions are built as small trees (mo = monomial, pr = product, qu = quotient, pw = power) so the prompt, the key
 * (positive-exponent form, K.expo) and the worked solution (the lesson's three-step checklist: brackets, combine, clear
 * zero/negative exponents) all come from the same tree. Typical wrong answers are found by evaluating the same tree with
 * one classic mistake switched on (coefficient not raised, coefficient raised to the positive power, negative outer power
 * ignored, exponents added instead of multiplied, a sign slip with a negative exponent, x⁰ read as x) — each is a
 * diagnosis with its own hint, and a "bad" answer the tests check is rejected.
 * Conversions: "explain / which step is wrong" → multiple choice whose options are reasons; "substitute and compare" →
 * labelled boxes for the two values; "arrange in order" → the ordering input (Q16 accepts the two equal values either way).
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Every part is AN3. */
(function (root) {
  'use strict';
  var HW = root.HW, F = HW.fmt, K = HW.kit, ex = HW.ex, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'coef-not-raised': 'Didn’t raise the coefficient to the power', 'coef-pos-power': 'Raised the coefficient to the positive power instead of the negative one',
    'no-flip': 'Didn’t take the reciprocal (negative exponent)', 'add-exp': 'Added exponents instead of multiplying (power of a power)',
    'sign-exp': 'Sign slip when combining exponents', 'zero-base': 'Took a⁰ to be a', 'zero-power': 'Took a zero exponent to give 0',
    'zero-coef': 'Applied a zero exponent to the variable only, not the whole bracket', 'coef-zeroed': 'Applied the zero exponent to the coefficient too',
    'mult-exp': 'Multiplied exponents instead of adding (product law)', opposite: 'Treated a negative exponent as a negative sign (opposite instead of reciprocal)',
    'flip-back': 'Didn’t move the negative power up from the denominator', 'coef-side': 'Number on the wrong side of the fraction bar (moved one with no negative exponent, or left one that has one)',
    'repeat-error': 'Repeated the error in the worked line', 'u2l7-outer': 'Didn’t apply the outside power to the unknown exponent',
    'u2l7-claim': 'Evaluated the claimed answer instead of the original expression'
  });
  HW.addPartial({ 'zero-base': 'b', 'repeat-error': 'n', 'u2l7-outer': 'b', 'u2l7-claim': 'n' });

  /* ---------- rationals ---------- */
  function R(p, q) { return ex.norm(p, q == null ? 1 : q); }
  function rm(a, b) { return R(a[0] * b[0], a[1] * b[1]); }
  function rinv(a) { return R(a[1], a[0]); }
  function rpow(a, n) { if (n < 0) { a = rinv(a); n = -n; } return R(Math.pow(a[0], n), Math.pow(a[1], n)); }
  function near(x, y) { return ex.eq(x, y, 1e-9); }
  function frTex(a) { return a[1] === 1 ? F(a[0]) : (a[0] < 0 ? '-' : '') + '\\frac{' + F(Math.abs(a[0])) + '}{' + F(a[1]) + '}'; }
  function gcd(a, b) { return ex.gcd(a, b); }
  function pickWhere(gen, test) { for (var i = 0; i < 2000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u2l7: no value found'); }
  function cop(r, lo, hi, o) { o = o || {}; return pickWhere(function () { return [r.int(lo, hi), r.int(lo, hi)]; }, function (pq) { return pq[0] !== pq[1] && gcd(pq[0], pq[1]) === 1 && (!o.lt || pq[0] < pq[1]) && (!o.gt || pq[0] > pq[1]); }); }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }

  /* ---------- monomials: { c: [p, q], v: { x: e, … } } (insertion order = display order) ---------- */
  function M(c, v) { return { c: typeof c === 'number' ? [c, 1] : c, v: v || {} }; }
  function V() { var o = {}; for (var i = 0; i + 1 < arguments.length; i += 2) o[arguments[i]] = arguments[i + 1]; return o; }
  function mm(a, b) { var v = {}; Object.keys(a.v).forEach(function (k) { v[k] = a.v[k]; }); Object.keys(b.v).forEach(function (k) { v[k] = (v[k] || 0) + b.v[k]; }); return { c: rm(a.c, b.c), v: v }; }
  function minv(a) { var v = {}; Object.keys(a.v).forEach(function (k) { v[k] = -a.v[k]; }); return { c: rinv(a.c), v: v }; }
  function md(a, b) { return mm(a, minv(b)); }
  function mp(a, n) { var v = {}; Object.keys(a.v).forEach(function (k) { v[k] = a.v[k] * n; }); return { c: rpow(a.c, n), v: v }; }
  function meq(a, b) {
    if (a.c[0] * b.c[1] !== b.c[0] * a.c[1]) return false;
    var ks = uniq(Object.keys(a.v).concat(Object.keys(b.v)));
    return ks.every(function (k) { return (a.v[k] || 0) === (b.v[k] || 0); });
  }
  function vt(x, e) { return e === 1 ? x : x + '^{' + e + '}'; }
  function cTex(c, alone) {
    if (c[1] === 1) return alone ? F(c[0]) : c[0] === 1 ? '' : c[0] === -1 ? '-' : F(c[0]);
    return (c[0] < 0 ? '-' : '') + '\\frac{' + F(Math.abs(c[0])) + '}{' + F(c[1]) + '}';
  }
  /* positive-exponent form, the way the answer key writes it: \frac{x^{4}}{16y} */
  function posTex(m) {
    var c = m.c, up = '', dn = '';
    Object.keys(m.v).forEach(function (x) { var e = m.v[x]; if (e > 0) up += vt(x, e); else if (e < 0) dn += vt(x, -e); });
    var top = (Math.abs(c[0]) === 1 && up ? '' : F(Math.abs(c[0]))) + up, bot = (c[1] === 1 ? '' : F(c[1])) + dn;
    return (c[0] < 0 ? '-' : '') + (bot ? '\\frac{' + top + '}{' + bot + '}' : top);
  }
  /* one line with negative exponents still showing (worked solutions) */
  function rawTex(m) { var vs = Object.keys(m.v).filter(function (x) { return m.v[x] !== 0; }).map(function (x) { return vt(x, m.v[x]); }).join(''); return cTex(m.c, !vs) + vs; }
  function tt(c, pairs) { c = typeof c === 'number' ? [c, 1] : c; var vs = pairs.map(function (pe) { return vt(pe[0], pe[1]); }).join(''); return cTex(c, !vs) + vs; }
  function fin(m) { var a = rawTex(m), b = posTex(m); return a === b ? b : a + '=' + b; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }

  /* ---------- expression trees ---------- */
  function mo(c, pairs) { return { k: 'm', c: typeof c === 'number' ? [c, 1] : c, v: pairs || [] }; }
  function pr(items, sep) { return { k: '*', items: items, sep: sep }; }
  function qu(a, b, inline) { return { k: '/', num: a, den: b, inline: !!inline }; }
  function pw(b, n) { return { k: '^', base: b, n: n }; }
  function tx(n) {
    if (n.k === 'm') return tt(n.c, n.v);
    if (n.k === '*') return n.items.map(function (x) { return tx(x); }).join(n.sep == null ? '\\times ' : n.sep);
    if (n.k === '/') return n.inline ? tx(n.num) + '\\div ' + tx(n.den) : '\\dfrac{' + tx(n.num) + '}{' + tx(n.den) + '}';
    return n.base.k === 'm' ? '(' + tx(n.base) + ')^{' + n.n + '}' : '\\left(' + tx(n.base) + '\\right)^{' + n.n + '}';
  }
  function plain(s) { return s.replace(/\\left|\\right/g, '').replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)').replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\cdot/g, '·').replace(/[{}\\]/g, '').replace(/\s+/g, ''); }
  /* evaluate a tree; bug switches on one classic mistake */
  function ev(n, bug) {
    if (n.k === 'm') { var v = {}; n.v.forEach(function (pe) { var e = pe[1]; if (bug === 'zero-base' && e === 0) e = 1; v[pe[0]] = (v[pe[0]] || 0) + e; }); return { c: n.c, v: v }; }
    if (n.k === '*') return n.items.reduce(function (acc, x) { return mm(acc, ev(x, bug)); }, M(1));
    if (n.k === '/') {
      var a = ev(n.num, bug), b = ev(n.den, bug);
      if (bug === 'sign-sub') { var b2 = { c: b.c, v: {} }; Object.keys(b.v).forEach(function (k) { b2.v[k] = Math.abs(b.v[k]); }); b = b2; }
      return md(a, b);
    }
    var B = ev(n.base, bug), N = n.n;
    if (bug === 'no-flip' && N < 0) return mp(B, -N);
    var out = { c: rpow(B.c, N), v: {} };
    if (bug === 'coef-not-raised') out.c = B.c;
    if (bug === 'coef-pos-power' && N < 0) out.c = rpow(B.c, -N);
    Object.keys(B.v).forEach(function (k) { var e = B.v[k]; out.v[k] = bug === 'add-exp' ? (e ? e + N : 0) : bug === 'sign-mult' && e < 0 && N < 0 ? -(e * N) : e * N; });
    return out;
  }
  var BUGS = [
    ['coef-not-raised', 'coef-not-raised', 'The power outside a bracket applies to the <b>number</b> inside it too: ' + t('(2x^{3})^{2}=2^{2}x^{6}=4x^{6}') + '.'],
    ['coef-pos-power', 'coef-pos-power', 'With a <b>negative</b> outside power, the number in the bracket is raised to that negative power, so it ends up in the denominator: ' + t('(3x)^{-2}=3^{-2}x^{-2}=\\frac{1}{9x^{2}}') + '.'],
    ['no-flip', 'no-flip', 'The outside power is <b>negative</b>, so the bracket flips: ' + t('(\\ldots)^{-n}=\\frac{1}{(\\ldots)^{n}}') + '. Your answer used the positive power.'],
    ['add-exp', 'add-exp', 'Power of a power: <b>multiply</b> each exponent inside the bracket by the outside power — don’t add them.'],
    ['sign-sub', 'sign-exp', 'Watch the signs when you divide: subtracting a negative exponent <b>adds</b>, e.g. ' + t('x^{2}\\div x^{-3}=x^{2-(-3)}=x^{5}') + '.'],
    ['sign-mult', 'sign-exp', 'Watch the signs in the power of a power: a negative times a negative is <b>positive</b>, e.g. ' + t('(x^{-2})^{-3}=x^{6}') + '.'],
    ['zero-base', 'zero-base', 'Anything (except 0) to the power ' + t('0') + ' is ' + t('1') + ': ' + t('x^{0}=1') + ', not ' + t('x') + '.']
  ];
  /* the wrong monomials this tree can produce, [mono, code, hint] (none equal to the right answer, first one kept) */
  function bugAlts(node, m) {
    var out = [];
    BUGS.forEach(function (b) {
      var w = ev(node, b[0]);
      if (meq(w, m) || out.some(function (o) { return meq(o[0], w); })) return;
      out.push([w, b[1], b[2]]);
    });
    return out;
  }
  /* student's analysed answer equals monomial m? */
  function anIs(an, m) {
    if (!an || !an.coef || an.flags.nested || an.flags.complex) return false;
    if (an.coef[0] * m.c[1] !== m.c[0] * an.coef[1]) return false;
    var ks = uniq(Object.keys(an.vars).concat(Object.keys(m.v)));
    return ks.every(function (k) { var y = an.vars[k] ? an.vars[k][0] / an.vars[k][1] : 0; return y === (m.v[k] || 0); });
  }

  /* ---------- worked solution from the tree: brackets, combine, positive exponents ---------- */
  function zeroNote(n) {
    var z = []; (function w(x) { if (x.k === 'm') x.v.forEach(function (pe) { if (pe[1] === 0 && z.indexOf(pe[0]) < 0) z.push(pe[0]); }); else if (x.k === '*') x.items.forEach(w); else if (x.k === '/') { w(x.num); w(x.den); } else w(x.base); })(n);
    return z.length ? 'Zero exponents: ' + z.map(function (x) { return t(x + '^{0}=1'); }).join(', ') + '.' : '';
  }
  function flat(n, s, out) {
    if (n.k === '*') n.items.forEach(function (x) { flat(x, s, out); });
    else if (n.k === '/') { flat(n.num, s, out); flat(n.den, -s, out); }
    else out.push({ n: n, s: s, m: ev(n) });
    return out;
  }
  function powLine(n) {
    if (n.base.k === 'm') {
      var b = ev(n.base), pre = '(' + tx(n.base) + ')^{' + n.n + '}', mid = Object.keys(b.v).filter(function (k) { return b.v[k] !== 0; }).length || b.c[0] !== 1 || b.c[1] !== 1
        ? (b.c[0] === 1 && b.c[1] === 1 ? '' : (b.c[1] === 1 ? F(b.c[0]) : '\\left(' + frTex(b.c) + '\\right)') + '^{' + n.n + '}') + Object.keys(b.v).filter(function (k) { return b.v[k] !== 0; }).map(function (k) { return k + '^{' + par(b.v[k]) + '\\times' + par(n.n) + '}'; }).join('') : '';
      return t(pre + (mid ? '=' + mid : '') + '=' + rawTex(ev(n)));
    }
    var inner = ev(n.base);
    return 'Inside the bracket first: ' + t(tx(n.base) + '=' + rawTex(inner)) + '. Then ' + t('\\left(' + rawTex(inner) + '\\right)^{' + n.n + '}=' + rawTex(ev(n)));
  }
  function combineLine(leaves) {
    if (leaves.length < 2) return '';
    var nc = leaves.filter(function (l) { return l.s > 0 && (l.m.c[0] !== 1 || l.m.c[1] !== 1); }).map(function (l) { return frTex(l.m.c); });
    var dc = leaves.filter(function (l) { return l.s < 0 && (l.m.c[0] !== 1 || l.m.c[1] !== 1); }).map(function (l) { return frTex(l.m.c); });
    var tot = leaves.reduce(function (acc, l) { return l.s > 0 ? rm(acc, l.m.c) : rm(acc, rinv(l.m.c)); }, [1, 1]);
    var parts = [];
    if (nc.length + dc.length > 1) parts.push('numbers ' + t((dc.length ? '\\frac{' + (nc.join('\\times ') || '1') + '}{' + dc.join('\\times ') + '}' : nc.join('\\times ')) + '=' + frTex(tot)));
    var vars = []; leaves.forEach(function (l) { Object.keys(l.m.v).forEach(function (k) { if (vars.indexOf(k) < 0) vars.push(k); }); });
    vars.forEach(function (k) {
      var terms = leaves.filter(function (l) { return l.m.v[k]; });
      if (!terms.length) return;
      var sum = 0, s = terms.map(function (l, i) { var e = l.m.v[k]; sum += l.s * e; return i === 0 ? (l.s > 0 ? String(e) : '-' + par(e)) : (l.s > 0 ? '+' + par(e) : '-' + par(e)); }).join('');
      parts.push(t(k + '^{' + s + '}=' + vt(k, sum).replace(/^([a-z])$/, '$1^{1}')));
    });
    return parts.length ? 'Combine matching bases: ' + parts.join(', ') + '.' : '';
  }
  function solve(node) {
    var lines = [], z = zeroNote(node); if (z) lines.push(z);
    var m = ev(node);
    if (node.k === '^' && node.base.k !== 'm') {
      var leaves0 = flat(node.base, 1, []);
      leaves0.forEach(function (l) { if (l.n.k === '^') lines.push('Bracket: ' + powLine(l.n) + '.'); });
      var cl = combineLine(leaves0); if (cl) lines.push('Inside the bracket: ' + cl.replace(/^Combine matching bases: /, ''));
      var inner = ev(node.base);
      lines.push('Apply the outside power ' + t(node.n) + ' to every factor: ' + t('\\left(' + rawTex(inner) + '\\right)^{' + node.n + '}=' + rawTex(m)) + '.');
    } else {
      var leaves = flat(node, 1, []);
      leaves.forEach(function (l) { if (l.n.k === '^') lines.push('Brackets first: ' + powLine(l.n) + '.'); });
      var c2 = combineLine(leaves); if (c2) lines.push(c2);
    }
    var a = rawTex(m), b = posTex(m);
    lines.push(a === b ? 'Answer: ' + t(b) + '.' : 'Positive exponents: ' + t(a + '=' + b) + '.');
    return lines.join('<br>');
  }

  /* ---------- hints ---------- */
  var H = {
    prod: 'Product law: same base, so <b>add</b> the exponents (keep their signs): ' + t('x^{m}\\times x^{n}=x^{m+n}') + '.',
    quot: 'Quotient law: same base, so <b>subtract</b> the exponents (top minus bottom): ' + t('x^{m}\\div x^{n}=x^{m-n}') + '.',
    pow: 'Power of a power: <b>multiply</b> the exponents: ' + t('(x^{m})^{n}=x^{mn}') + '.',
    neg: 'Finish with positive exponents: ' + t('x^{-n}=\\frac{1}{x^{n}}') + ' and ' + t('\\frac{1}{x^{-n}}=x^{n}') + '.',
    zero: 'Anything (except 0) to the power ' + t('0') + ' is ' + t('1') + '. Check what the exponent ' + t('0') + ' is attached to.',
    br: 'Brackets first: raise the number <b>and</b> every variable inside the bracket to the outside power.',
    steps: 'Use the checklist: (1) brackets first, (2) combine matching bases — the numbers and each letter separately, (3) clear zero and negative exponents last.',
    coef: 'Work with the numbers and each letter separately: multiply or divide the numbers, add or subtract the exponents.',
    inside: 'Simplify inside the bracket first, then apply the outside power to every factor.',
    flip: 'A fraction to a negative power flips: ' + t('\\left(\\frac{a}{b}\\right)^{-n}=\\left(\\frac{b}{a}\\right)^{n}') + '.',
    signs: 'Careful with signs: subtracting a negative adds, and a negative times a negative is positive.'
  };
  var OPP = 'A negative exponent doesn’t make anything negative — it means <b>reciprocal</b>: ' + t('a^{-n}=\\frac{1}{a^{n}}') + '.';

  /* ---------- checkers / part builders ---------- */
  function cmp(an, m) {
    var keys = Object.keys(m.v).filter(function (k) { return m.v[k] !== 0; }); Object.keys(an.vars).forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); });
    var same = true, mixed = true, negd = 0;
    keys.forEach(function (k) { var x = m.v[k] || 0, y = an.vars[k] ? an.vars[k][0] / an.vars[k][1] : 0; if (y !== x) { same = false; if (y === -x) negd++; else mixed = false; } });
    var tc = m.c, sc = an.coef;
    return { same: same, negOnly: !same && mixed && negd > 0, sc: sc,
      coefEq: !!sc && sc[0] * tc[1] === tc[0] * sc[1], coefNeg: !!sc && sc[0] * tc[1] === -tc[0] * sc[1], coefRecip: !!sc && sc[0] * tc[0] === sc[1] * tc[1],
      coefIs: function (c) { c = typeof c === 'number' ? [c, 1] : c; return !!sc && sc[0] * c[1] === c[0] * sc[1]; } };
  }
  function gdiag(m, extra) {
    return function (an, ast) {
      if (!an.coef) return extra ? extra(an, ast, null) : null;
      var c = cmp(an, m);
      if (extra) { var h = extra(an, ast, c); if (h) return h; }
      if (c.coefNeg && c.negOnly) return { code: 'opposite', hint: OPP };
      if (c.coefNeg && c.same) return { code: 'sign', hint: 'Your variables are right — check the <b>sign</b>. A negative exponent never makes anything negative.' };
      if (c.same && c.coefRecip && !(Math.abs(m.c[0]) === 1 && m.c[1] === 1)) return { code: 'coef-side', hint: 'Your variables are right, but the number is on the wrong side of the fraction bar. A number crosses the bar only if it carries a negative exponent itself.' };
      return null;
    };
  }
  /* exponent-law answer (positive exponents) for the monomial m */
  function X(prompt, m, sol, hints, text, o) {
    o = o || {};
    var p = P.expo(prompt, posTex(m), { diag: gdiag(m, o.diag), vars: o.vars }, sol, hints, text);
    if (o.bad) p.bad = o.bad;
    return p;
  }
  /* exponent-law answer from a tree. o: { alts: [[mono, code, hint]], hints, sol, vars, prompt, bad } */
  function XT(node, o) {
    o = o || {};
    var m = ev(node), key = posTex(m);
    var alts = (o.alts || []).filter(function (a) { return !meq(a[0], m); }).concat(bugAlts(node, m));
    var p = X(o.prompt || t(tx(node)), m, o.sol || solve(node), o.hints || [H.steps], o.text || plain(tx(node)), {
      vars: o.vars, diag: function (an, ast, c) {
        if (o.diag) { var h = o.diag(an, ast, c); if (h) return h; }
        for (var i = 0; i < alts.length; i++) if (anIs(an, alts[i][0])) return { code: alts[i][1], hint: alts[i][2] };
        return null;
      } });
    p.bad = uniq(alts.map(function (a) { return posTex(a[0]); }).concat(o.bad || [])).filter(function (s) { return s !== key; });
    return p;
  }
  /* a checker (for fields) built the same way */
  function XTchk(node, alts) {
    var m = ev(node), all = (alts || []).filter(function (a) { return !meq(a[0], m); }).concat(bugAlts(node, m));
    return K.expo(posTex(m), { diag: gdiag(m, function (an) { for (var i = 0; i < all.length; i++) if (anIs(an, all[i][0])) return { code: all[i][1], hint: all[i][2] }; return null; }) });
  }
  /* an exact value (integer or fraction in lowest terms) */
  function exactChk(fr, diag) {
    var T = fr[0] / fr[1];
    var base = K.fraction(fr, { diag: function (val, ast) {
      var h = diag ? diag(val, ast) : null; if (h) return h;
      if (T !== 0 && Math.abs(T) !== 1 && near(val, -1 / T)) return { code: 'opposite', hint: OPP };
      return null;
    } });
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (near(a.val, T)) {
        var an = ex.analyze(a.ast);
        if (an.flags.negExp) return form('neg-exp', 'Right value — now evaluate it: rewrite the negative exponent as a reciprocal and work out the power.');
        if (ex.shape(a.ast).pow) return form('evaluate', 'Right value — now work out the power(s) and give a single number' + (fr[1] !== 1 ? ' or fraction' : '') + '.');
      }
      return base(resp);
    };
  }
  function exP(prompt, fr, diag, sol, hints, text, o) {
    o = o || {}; fr = R(fr[0], fr[1]);
    var p = P.math(prompt, exactChk(fr, diag), frTex(fr), sol, hints, text, { keys: 'fraction', before: o.before });
    if (o.bad) p.bad = o.bad.filter(function (b) { var q = ex.parse(b); return q.ok && !near(ex.value(q.ast), fr[0] / fr[1]); });
    return p;
  }
  /* evaluate (p/q)^{-n} */
  function fracBasePart(p, q, n) {
    var b = R(p, q), ans = rpow(b, -n), bt = '\\left(\\dfrac{' + p + '}{' + q + '}\\right)^{-' + n + '}';
    return exP(t(bt), ans, function (v) {
      if (near(v, rpow(b, n)[0] / rpow(b, n)[1])) return { code: 'no-flip', hint: 'You raised the fraction to the power ' + t(n) + ' but didn’t flip it. The negative exponent means: flip the fraction, then use the positive exponent.' };
      if (n > 1 && near(v, rinv(b)[0] / rinv(b)[1])) return { code: 'no-power', hint: 'Good flip — now raise the flipped fraction to the power ' + t(n) + ': ' + (n === 2 ? 'square' : 'cube') + ' the top and the bottom.' };
      return null;
    }, 'Invert, then raise to the power: ' + t(bt + '=\\left(\\frac{' + q + '}{' + p + '}\\right)^{' + n + '}=\\frac{' + q + '^{' + n + '}}{' + p + '^{' + n + '}}=' + frTex(ans)) + '.', [H.flip], 'evaluate (' + p + '/' + q + ')^-' + n,
    { bad: [frTex(rpow(b, n)), frTex(rinv(b))] });
  }
  /* put numbers in for letters (not inside \commands) */
  function subst(tex, env) { return tex.split(/(\\[a-zA-Z]+)/).map(function (s, i) { return i % 2 ? s : s.replace(/[a-z]/g, function (c) { return env[c] != null ? '(' + env[c] + ')' : c; }); }).join(''); }
  HW.addCodes({ 'no-power': 'Flipped the fraction but didn’t raise it to the power', reversed: 'Put the list in the opposite order' });

  var LET1 = ['x', 'x', 'a', 'b', 'm', 'n', 'y', 'p', 'k', 't', 'w', 'z'];
  var PAIRS = [['x', 'y'], ['x', 'y'], ['a', 'b'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['r', 's'], ['h', 'k']];

  /* a part that simplifies one tree. gen(r) returns the tree (or [tree, opts]) */
  function S(level, id, gen, hints, extraOpts) {
    return { id: id, level: level, make: function (r, sh) {
      var g = gen(r, sh), node = g.k ? g : g[0], o = g.k ? {} : g[1] || {};
      Object.keys(extraOpts || {}).forEach(function (k) { if (o[k] == null) o[k] = extraOpts[k]; });
      if (!o.hints) o.hints = hints;
      return XT(node, o);
    } };
  }

  /* ---------- Assignment 7 ---------- */
  var questions = [
    { num: '1', section: 'Part A — Warm-up: one law at a time', stem: 'Simplify each expression using just <b>one</b> law. Write the answer with positive exponents.', parts: [
      S('BEG', '1a', function (r) {
        var x = r.pick(LET1), a = r.int(2, 7), b = r.int(a + 1, 11);
        return [pr([mo(1, [[x, a]]), mo(1, [[x, -b]])]), { alts: [[M(1, V(x, a + b)), 'sign-exp', 'Keep the sign of the negative exponent: ' + t(a + '+(-' + b + ')=' + (a - b)) + '.'], [M(1, V(x, -a * b)), 'mult-exp', 'Product law: <b>add</b> the exponents, don’t multiply them.']] }];
      }, [H.prod, H.neg]),
      S('BEG', '1b', function (r) {
        var x = r.pick(['y', 'y', 'x', 'a', 'b', 'm', 'n', 'p', 'k']), a = r.int(2, 7), b = r.int(2, 7);
        return [pr([mo(1, [[x, -a]]), mo(1, [[x, -b]])]), { alts: [[M(1, V(x, a + b)), 'sign-exp', t('-' + a + '+(-' + b + ')=-' + (a + b)) + ': the exponent is negative, so the power ends up in the denominator.'], [M(1, V(x, a * b)), 'mult-exp', 'Product law: <b>add</b> the exponents, don’t multiply them.'], [M(1, V(x, -a * b)), 'mult-exp', 'Product law: <b>add</b> the exponents, don’t multiply them.']] }];
      }, [H.prod, H.neg]),
      S('BEG', '1c', function (r) {
        var x = r.pick(['a', 'a', 'x', 'y', 'b', 'm', 'n', 'p', 'k', 'z']), a = r.int(2, 5), n = r.int(2, 4);
        return [pw(mo(1, [[x, -a]]), n), { alts: [[M(1, V(x, a * n)), 'sign-exp', 'A negative times a positive is negative: ' + t('(-' + a + ')\\times ' + n + '=-' + a * n) + '.']] }];
      }, [H.pow, H.neg]),
      S('LIM', '1d', function (r) {
        var x = r.pick(['b', 'b', 'x', 'y', 'a', 'm', 'n', 'p', 'k', 'z']), n = r.int(2, 9);
        return [pr([mo(1, [[x, 0]]), mo(1, [[x, n]])]), { alts: [[M(0), 'zero-power', t(x + '^{0}=1') + ', not ' + t('0') + ' — and multiplying by ' + t('1') + ' changes nothing.']] }];
      }, [H.prod, H.zero])] },
    { num: '2', stem: 'Simplify using the quotient law. Write the answer with positive exponents.', parts: [
      S('BEG', '2a', function (r) {
        var x = r.pick(LET1), a = r.int(1, 6), b = r.int(a + 2, 12);
        return qu(mo(1, [[x, a]]), mo(1, [[x, b]]), true);
      }, [H.quot, H.neg]),
      S('EMG', '2b', function (r) {
        var x = r.pick(['a', 'a', 'x', 'y', 'b', 'm', 'n', 'p', 'k']), c = r.int(2, 6), k = r.int(2, 6), a = r.int(1, 4), b = r.int(1, 5);
        return [qu(mo(c * k, [[x, -a]]), mo(k, [[x, b]]), true), { alts: [[M(c, V(x, b - a)), 'sign-exp', 'Top minus bottom: ' + t('-' + a + '-' + b + '=-' + (a + b)) + '.']] }];
      }, [H.coef, H.quot])] },
    { num: '3', stem: 'Evaluate. Watch carefully what the exponent ' + t('0') + ' is actually attached to.', parts: [
      { id: '3a', level: 'BEG', make: function (r) {
        var x = r.pick(LET1), k = r.int(2, 12), n = r.int(2, 9), node = pw(mo(k, [[x, n]]), 0);
        return XT(node, { alts: [[M(k), 'zero-coef', 'The exponent ' + t('0') + ' is on the <b>whole bracket</b> — the ' + t(k) + ' is inside it too. So the whole bracket is ' + t('1') + '.'], [M(0), 'zero-power', 'Anything (except 0) to the power ' + t('0') + ' is ' + t('1') + ', not ' + t('0') + '.'], [M(k, V(x, n)), 'zero-power', 'The power ' + t('0') + ' changes the value: anything (except 0) to the power ' + t('0') + ' is ' + t('1') + '.']],
          sol: 'The bracket is the base, so the exponent ' + t('0') + ' applies to all of it: ' + t(tx(node) + '=1') + '.', hints: [H.zero] });
      } },
      { id: '3b', level: 'BEG', make: function (r) {
        var x = r.pick(LET1), k = r.int(2, 12), node = mo(k, [[x, 0]]);
        return XT(node, { alts: [[M(1), 'coef-zeroed', 'There is no bracket, so the exponent ' + t('0') + ' belongs to ' + t(x) + ' only: ' + t(k + x + '^{0}=' + k + '\\times 1') + '.'], [M(0), 'zero-power', t(x + '^{0}=1') + ', not ' + t('0') + '.']],
          sol: 'Only ' + t(x) + ' has the exponent ' + t('0') + ': ' + t(k + x + '^{0}=' + k + '\\times 1=' + k) + '.', hints: [H.zero] });
      } }] },
    { num: '4', stem: 'Rewrite each expression with positive exponents only.', parts: [
      S('LIM', '4a', function (r) { var x = r.pick(LET1), n = r.int(2, 9); return [mo(1, [[x, -n]]), { alts: [[M(-1, V(x, n)), 'opposite', OPP]] }]; }, [H.neg]),
      S('BEG', '4b', function (r) {
        var x = r.pick(LET1), k = r.int(2, 12), n = r.int(2, 9);
        return [mo(k, [[x, -n]]), { alts: [[M([1, k], V(x, -n)), 'coef-side', 'The exponent ' + t(-n) + ' belongs to ' + t(x) + ' only, so only ' + t(vt(x, -n)) + ' moves below the bar; the ' + t(k) + ' stays on top.']] }];
      }, ['An exponent belongs only to the base it touches: in ' + t('5a^{-2}') + ' the ' + t('-2') + ' is on ' + t('a') + ' only.', H.neg]),
      S('EMG', '4c', function (r) {
        var x = r.pick(LET1), k = r.int(2, 9), n = k <= 4 ? r.pick([2, 2, 3]) : 2;
        return [pw(mo(k, [[x, 1]]), -n), { alts: [[M([1, k], V(x, -n)), 'coef-not-raised', 'Right side of the bar — but the ' + t(k) + ' is inside the bracket, so it is raised to the power ' + t(n) + ' as well: ' + t('(' + k + x + ')^{' + n + '}=' + Math.pow(k, n) + vt(x, n)) + '.']] }];
      }, [H.br, H.neg]),
      S('BEG', '4d', function (r) {
        var x = r.pick(['c', 'c', 'x', 'a', 'b', 'm', 'n', 'y', 'k']), n = r.int(2, 9);
        return [qu(mo(1, []), mo(1, [[x, -n]])), { alts: [[M(1, V(x, -n)), 'flip-back', 'The power with the negative exponent is in the <b>denominator</b>, so it moves up and its exponent becomes positive: ' + t('\\frac{1}{a^{-n}}=a^{n}') + '.']],
          sol: t('\\dfrac{1}{' + vt(x, -n) + '}') + ': the power with the negative exponent moves up to the numerator and its exponent becomes positive: ' + t('\\dfrac{1}{' + vt(x, -n) + '}=' + vt(x, n)) + '.' }];
      }, [H.neg])] },
    { num: '5', section: 'Part B — Two or more laws together', stem: 'Simplify. Apply the power law first, then the product law. Write the answer with positive exponents.', parts: [
      S('EMG', '5a', function (r) {
        var g = pickWhere(function () { var k = r.pick([2, 2, 3]), n = k === 2 ? r.pick([2, 3]) : r.pick([2, 3]), a = r.int(1, 3); return [k, n, a, r.int(1, a * n - 1)]; }, function (g) { return g[2] * g[1] >= 2 && Math.pow(g[0], g[1]) <= 27; });
        var x = r.pick(LET1);
        return pr([pw(mo(g[0], [[x, g[2]]]), g[1]), mo(1, [[x, -g[3]]])]);
      }, [H.br, H.prod]),
      S('EMG', '5b', function (r) {
        var x = r.pick(['a', 'a', 'x', 'y', 'b', 'm', 'n', 'p']), k = r.int(2, 5), a = r.int(1, 3), p = r.int(2 * a + 1, 2 * a + 4);
        return pr([pw(mo(k, [[x, -a]]), 2), mo(1, [[x, p]])]);
      }, [H.br, H.prod])] },
    { num: '6', stem: 'Simplify. Apply the power law first, then the quotient law. Write the answer with positive exponents.', parts: [
      S('EMG', '6a', function (r) {
        var x = r.pick(LET1), k = r.int(2, 6), a = r.int(1, 4), b = r.int(2 * a + 1, 2 * a + 4);
        return qu(pw(mo(k, [[x, a]]), 2), mo(1, [[x, b]]));
      }, [H.br, H.quot]),
      S('PRG', '6b', function (r) {
        var g = pickWhere(function () { var k = r.pick([2, 3, 4, 4, 6]), m = r.pick([2, 3, 4, 8, 9]); return [k, m]; }, function (g) { return (g[0] * g[0]) % g[1] === 0 && g[0] * g[0] > g[1]; });
        var x = r.pick(['y', 'y', 'x', 'a', 'b', 'm', 'n', 'k']), a = r.pick([1, 1, 2]), b = r.int(1, 5);
        return qu(pw(mo(g[0], [[x, -a]]), 2), mo(g[1], [[x, b]]));
      }, [H.br, H.quot])] },
    { num: '7', stem: 'Simplify. Each expression has two variable bases. Write the answer with positive exponents.', parts: [
      S('EMG', '7a', function (r) {
        var L = r.pick(PAIRS), p = r.int(1, 6), q = r.int(1, 6), s = r.int(1, 6), u = r.int(1, 6);
        return qu(mo(1, [[L[0], p], [L[1], -q]]), mo(1, [[L[0], -s], [L[1], u]]));
      }, [H.quot, H.signs]),
      S('EMG', '7b', function (r) {
        var L = r.pick(PAIRS), p = r.int(1, 5), q = r.int(1, 5), a = r.int(p + 1, p + 5), b = r.int(q + 1, q + 5);
        return pr([mo(1, [[L[0], -p], [L[1], q]]), mo(1, [[L[0], a], [L[1], -b]])]);
      }, [H.prod, H.neg])] },
    { num: '8', stem: 'Simplify inside the brackets first, then apply the outer power. Write the answer with positive exponents.', parts: [
      S('EMG', '8a', function (r) {
        var g = pickWhere(function () { var q = r.int(1, 4); return [q + r.int(1, 4), q, r.pick([2, 2, 3])]; }, function (g) { return (g[0] - g[1]) * g[2] <= 15; });
        var x = r.pick(LET1);
        return pw(qu(mo(1, [[x, g[0]]]), mo(1, [[x, g[1]]])), -g[2]);
      }, [H.inside, H.neg]),
      S('PRG', '8b', function (r) {
        var x = r.pick(['a', 'a', 'x', 'y', 'b', 'm', 'n', 'p']), c = r.int(2, 5), d = r.int(2, 5), q = r.pick([1, 1, 2]), p = r.int(q + 1, q + 5);
        return pw(qu(mo(c * d, [[x, p]]), mo(d, [[x, q]])), -1);
      }, [H.inside, 'A power of ' + t('-1') + ' just flips the simplified bracket: ' + t('(3a^{3})^{-1}=\\frac{1}{3a^{3}}') + '.'])] },
    { num: '9', stem: 'Simplify. These combine all three steps of the checklist. Write the answer with positive exponents.', parts: [
      S('PRG', '9a', function (r) {
        var g = pickWhere(function () { var k = r.pick([2, 2, 3]), n = r.pick([2, 3]), a = r.int(1, 3), b = r.int(1, 3), m = r.pick([2, 3, 4, 6, 8, 9]), c = r.int(1, 5); return { k: k, n: n, a: a, b: b, m: m, c: c }; },
          function (g) { var kn = Math.pow(g.k, g.n), e = g.a * g.n - g.b - g.c; return kn <= 27 && kn % g.m === 0 && kn > g.m && e >= 1 && e <= 6; });
        var x = r.pick(LET1);
        return qu(pr([pw(mo(g.k, [[x, g.a]]), g.n), mo(1, [[x, -g.b]])]), mo(g.m, [[x, g.c]]));
      }, [H.steps, H.br]),
      S('PRG', '9b', function (r) {
        var L = r.pick(PAIRS), k = r.int(2, 5), p = r.int(2, 4), q = r.int(1, 2 * p - 1), s = r.int(1, 4);
        return qu(pw(mo(k, [[L[0], p], [L[1], 1]]), 2), mo(k * k, [[L[0], q], [L[1], -s]]));
      }, [H.steps, H.br])] },
    { num: '10', stem: 'Evaluate without a calculator.', parts: [
      { id: '10a', level: 'EMG', make: function (r) { var pq = cop(r, 2, 7, { lt: true }); return fracBasePart(pq[0], pq[1], pq[1] <= 4 ? r.pick([2, 2, 3]) : 2); } },
      S('EMG', '10b', function (r) {
        var x = r.pick(LET1), k = r.int(2, 12);
        return [pw(qu(mo(1, [[x, 1]]), mo(k, [])), -1), { sol: 'A power of ' + t('-1') + ' flips the fraction: ' + t('\\left(\\dfrac{' + x + '}{' + k + '}\\right)^{-1}=\\dfrac{' + k + '}{' + x + '}') + '.' }];
      }, [H.flip])] },
    { num: '11', stem: 'Simplify inside the brackets first, then apply the outer power. Write the answer with positive exponents.', parts: [
      S('ADV', '11a', function (r) {
        var x = r.pick(['a', 'a', 'x', 'y', 'b', 'm', 'n']), k = r.pick([2, 2, 3, 5]), n = k === 2 ? r.pick([2, 2, 3]) : 2, p = r.int(2, 4), q = r.int(1, 3);
        return pw(qu(mo(1, [[x, p]]), mo(k, [[x, -q]])), -n);
      }, [H.inside, H.flip]),
      S('PRG', '11b', function (r) {
        var g = pickWhere(function () { return { p: r.int(1, 3), n: r.pick([2, 3]), q: r.int(1, 6), m: r.int(1, 2) }; }, function (g) { return -g.p * g.n + g.q < 0 && g.n - g.m >= 1; });
        var L = r.pick(PAIRS);
        return qu(pw(mo(1, [[L[0], -g.p], [L[1], 1]]), g.n), mo(1, [[L[0], -g.q], [L[1], g.m]]));
      }, [H.br, H.quot])] },
    { num: '12', stem: '', parts: [
      S('ADV', '12', function (r) {
        var g = pickWhere(function () { return { k: r.pick([2, 3, 3, 4]), d: r.pick([2, 2, 3]), v: r.pick([1, 1, 2]), a: r.int(1, 3), b: r.int(2, 6), c: r.int(1, 4) }; }, function (g) { return g.b > g.a && g.b - g.a + g.c <= 9; });
        var L = r.pick(PAIRS), x = L[0], y = L[1];
        var node = qu(pr([pw(mo(g.k, [[x, g.a], [y, 0]]), -1), mo(g.k * g.d * g.v, [[x, g.b]])]), mo(g.d, [[x, -g.c]]));
        return [node, { prompt: 'Simplify ' + t(tx(node)) + '. Write the answer with positive exponents.' }];
      }, [H.steps, H.zero])] },
    { num: '13', section: 'Part C — Mixed practice test', stem: 'Simplify. Write the answer with positive exponents.', parts: [
      S('PRG', '13', function (r) {
        var L = r.pick(PAIRS), k = r.int(2, 4), p = r.int(1, 4), q = r.int(1, 3), s = r.int(1, 3), u = r.int(1, 4);
        return qu(pw(mo(k, [[L[0], p], [L[1], -q]]), 2), mo(k * k, [[L[0], -s], [L[1], u]]));
      }, [H.steps, H.signs])] },
    { num: '14', stem: 'Simplify. Write the answer with positive exponents.', parts: [
      S('PRG', '14', function (r) {
        var L = r.pick(PAIRS), p = r.int(1, 4), q = r.int(1, 3), u = r.int(1, 5), s = r.int(1, 6);
        return pr([pw(mo(1, [[L[0], -p], [L[1], q]]), -2), qu(mo(1, [[L[0], u]]), mo(1, [[L[1], s]]))]);
      }, [H.steps, H.signs])] },
    { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var x = r.pick(['x', 'x', 'a', 'y', 'm', 'n']), k = r.int(2, 6), a = r.int(1, 4), b = r.int(1, 5), s = a + b, tex = '\\dfrac{(' + k + vt(x, a) + ')^{-1}}{' + vt(x, b) + '}';
        return P.mc(r, 'The simplified form of ' + t(tex) + ' is', [
          { html: t(k + vt(x, s)), why: 'The power ' + t('-1') + ' flips the bracket: ' + t('(' + k + vt(x, a) + ')^{-1}=\\frac{1}{' + k + vt(x, a) + '}') + ', so the ' + t(k) + ' and the ' + t(x) + ' end up in the denominator.' },
          { html: t('\\dfrac{1}{' + k + vt(x, s) + '}'), right: true },
          { html: t('\\dfrac{1}{' + k + vt(x, -s) + '}'), why: 'This still has a negative exponent. Dividing by ' + t(vt(x, b)) + ' puts it in the denominator: the exponents there add to ' + t(s) + '.' },
          { html: t('-' + k + vt(x, s)), why: 'A negative exponent never makes a value negative — it means reciprocal.' }],
          t('(' + k + vt(x, a) + ')^{-1}=\\dfrac{1}{' + k + vt(x, a) + '}') + ', so the expression is ' + t('\\dfrac{1}{' + k + vt(x, a) + '\\cdot ' + vt(x, b) + '}=\\dfrac{1}{' + k + vt(x, s) + '}') + '.', [H.br, H.neg], 'MC ' + plain(tex), true);
      } }] },
    { num: '16', stem: '<i>(Evaluate)</i>', parts: [
      { id: '16', level: 'EMG', make: function (r) {
        var g = pickWhere(function () { return [r.int(2, 6), r.int(1, 4), r.int(2, 7)]; }, function (g) { var d = g[2] - g[1]; return d >= 1 && d <= 3 && Math.pow(g[0], d) <= 125; });
        var b = g[0], p = g[1], q = g[2], d = q - p, v = Math.pow(b, d), tex = '\\dfrac{' + b + '^{-' + p + '}\\times ' + b + '^{' + q + '}}{' + b + '^{0}}';
        return exP('Evaluate ' + t(tex) + ' without using a calculator.', [v, 1], function (x) {
          if (near(x, Math.pow(b, p + q))) return { code: 'sign-exp', hint: 'Keep the sign: ' + t('-' + p + '+' + q + '=' + d) + '.' };
          if (near(x, v / b)) return { code: 'zero-base', hint: t(b + '^{0}=1') + ', not ' + t(b) + '.' };
          if (near(x, Math.pow(b, -p * q))) return { code: 'mult-exp', hint: 'Product law: <b>add</b> the exponents.' };
          return null;
        }, 'Top: ' + t(b + '^{-' + p + '+' + q + '}=' + b + '^{' + d + '}') + '. Bottom: ' + t(b + '^{0}=1') + '.<br>' + t('\\dfrac{' + b + '^{' + d + '}}{1}=' + v) + '.', [H.prod, H.zero], 'evaluate ' + plain(tex), { bad: [String(Math.pow(b, p + q)), String(v / b)] });
      } }] }
  ];

  /* ---------- Extra practice 7 ---------- */
  /* simplify-and-check-at-a-point boxes */
  function valField(name, pt) { return { name: name, label: name + ' at ' + t(pt) + ':', mode: 'math', keys: 'fraction' }; }
  function evalAt(m, env) { var v = m.c[0] / m.c[1]; Object.keys(m.v).forEach(function (k) { v *= Math.pow(env[k], m.v[k]); }); return v; }
  function frOf(v) { for (var q = 1; q <= 5000; q++) { var p = Math.round(v * q); if (Math.abs(p / q - v) < 1e-9 * Math.max(1, Math.abs(v))) return R(p, q); } return null; }

  var extra = [
    { num: '1', section: 'Extra practice A — Full simplifications: every law in one expression', stem: 'Run the three-step checklist once, in order: brackets first, then combine matching bases, then clear the zero and negative exponents. Assume every variable is non-zero, and write every final answer with <b>positive exponents only</b>.', parts: [
      S('PRG', 'e1a', function (r) {
        var L = r.pick(PAIRS), k = r.pick([2, 2, 3]), a = r.int(1, 3), b = r.int(1, 4), m = r.pick([2, 4, 4, 3]), c = pickWhere(function () { return r.int(1, 7); }, function (c) { return c !== 2 * b; });
        return qu(pw(mo(k, [[L[0], -a], [L[1], b]]), -2), mo(m, [[L[0], 0], [L[1], -c]]));
      }, [H.steps, H.br]),
      S('PRG', 'e1b', function (r) {
        var g = pickWhere(function () { return { k: r.pick([2, 3, 3]), m: r.pick([2, 3, 4, 9, 8]) }; }, function (g) { var k3 = g.k * g.k * g.k; return k3 % g.m === 0 && k3 > g.m; });
        var L = r.pick(PAIRS), a = r.int(1, 3), b = r.int(1, 3), p = r.int(1, 4), q = r.int(1, 3);
        return qu(pw(mo(g.k, [[L[0], -a], [L[1], b]]), 3), mo(g.m, [[L[0], p], [L[1], -q]]));
      }, [H.steps, H.br]),
      S('PRG', 'e1c', function (r) {
        var L = r.pick([['m', 'n'], ['m', 'n'], ['a', 'b'], ['x', 'y'], ['p', 'q']]), k = r.pick([2, 2, 3]), v = r.int(1, 3), a = r.int(1, 4), c = r.int(1, 2 * a - 1);
        return pr([pw(mo(k, [[L[0], 0], [L[1], -a]]), -2), mo(k * k * v, [[L[1], -c]])]);
      }, [H.steps, H.zero])] },
    { num: '2', stem: 'Simplify. Here <b>both</b> the numerator and the denominator carry an outer power.', parts: [
      S('ADV', 'e2a', function (r) {
        var kj = r.pick([[4, 2], [4, 2], [2, 2], [3, 3], [8, 4], [4, 4], [6, 2]]), L = r.pick(PAIRS), a = r.int(1, 4), b = r.int(1, 2), c = r.int(1, 2), d = r.int(1, 3);
        return qu(pw(mo(kj[0], [[L[0], a], [L[1], -b]]), 2), pw(mo(kj[1], [[L[0], -c], [L[1], d]]), 3));
      }, [H.steps, H.br]),
      S('ADV', 'e2b', function (r) {
        var g = pickWhere(function () { return { k: r.int(2, 7), p: r.int(1, 4), q: r.int(2, 5), s: r.int(1, 4) }; }, function (g) { return -g.p + 2 * g.s !== 0 && g.q - 2 !== 0; });
        var L = r.pick(PAIRS);
        return qu(pw(mo(g.k, [[L[0], g.p], [L[1], -g.q]]), -1), pw(mo(1, [[L[0], -g.s], [L[1], 1]]), 2));
      }, [H.steps, H.br])] },
    { num: '3', stem: 'Simplify. Take these one bracket at a time and keep the coefficients separate from the variables.', parts: [
      S('ADV', 'e3a', function (r) {
        var g = pickWhere(function () { return { k: r.pick([2, 3, 3]), j: r.pick([2, 2, 3]), m: r.int(2, 6), a: r.int(1, 3), b: r.int(1, 4) }; }, function (g) { var c = R(g.j * g.j, g.k * g.k * g.m); return c[1] <= 60; });
        var L = r.pick(PAIRS);
        return qu(pr([pw(mo(g.k, [[L[0], -g.a]]), -2), pw(mo(g.j, [[L[0], g.b], [L[1], 1]]), 2)]), mo(g.m, [[L[0], 0], [L[1], -1]]));
      }, [H.steps, H.br]),
      S('ADV', 'e3b', function (r) {
        var g = pickWhere(function () { return { k: r.pick([2, 2, 3]), j: r.pick([2, 3, 4]), p: r.int(2, 4), q: r.int(1, 3), s: r.int(1, 5) }; }, function (g) { var e = 3 * g.p - 2 * g.q + g.s; return e >= 1 && e <= 15; });
        var L = r.pick(PAIRS);
        return qu(pw(mo(g.k, [[L[0], g.p], [L[1], -1]]), 3), pr([pw(mo(g.j, [[L[0], g.q], [L[1], 0]]), 2), mo(1, [[L[0], -g.s]])]));
      }, [H.steps, H.br])] },
    { num: '4', stem: 'Simplify. Watch for the zero exponents — decide carefully what each one is attached to.', parts: [
      S('PRG', 'e4a', function (r) {
        var g = pickWhere(function () { return { a: r.int(1, 4), b: r.int(1, 5), c: r.int(1, 4), d: r.int(1, 3), e: r.int(1, 4) }; }, function (g) { return g.b + g.d - g.e !== 0; });
        var L = r.pick(PAIRS);
        return pr([qu(mo(1, [[L[0], -g.a], [L[1], g.b]]), mo(1, [[L[0], g.c], [L[1], -g.d]])), mo(1, [[L[0], 0], [L[1], -g.e]])]);
      }, [H.steps, H.zero]),
      S('PRG', 'e4b', function (r) {
        var g = pickWhere(function () { return { k: r.pick([2, 2, 3]), m: r.pick([2, 4, 4, 3, 9]), a: r.int(1, 2), c: r.int(1, 5) }; }, function (g) { return g.c !== 3; });
        var L = r.pick([['p', 'q'], ['p', 'q'], ['a', 'b'], ['x', 'y'], ['m', 'n']]);
        return pr([pw(mo(g.k, [[L[0], -g.a], [L[1], 1]]), -3), mo(g.m, [[L[0], 0], [L[1], g.c]])]);
      }, [H.steps, H.zero]),
      S('PRG', 'e4c', function (r) {
        var g = pickWhere(function () { return { a: r.int(1, 3), b: r.int(1, 6) }; }, function (g) { return g.b - 3 * g.a !== 0; });
        var L = r.pick([['m', 'n'], ['m', 'n'], ['a', 'b'], ['x', 'y'], ['p', 'q']]);
        return qu(pw(mo(1, [[L[0], g.a], [L[1], -1]]), -3), mo(1, [[L[0], -g.b], [L[1], 0]]));
      }, [H.steps, H.zero])] },
    { num: '5', section: 'Extra practice B — Brackets raised to a negative power', stem: 'A negative power on a bracket multiplies through to <b>every</b> factor inside — the coefficient included. On a fraction it also flips: ' + t('\\left(\\frac{a}{b}\\right)^{-n}=\\left(\\frac{b}{a}\\right)^{n}') + '. Simplify, with positive exponents in every final answer.', parts: [
      S('PRG', 'e5a', function (r) { var L = r.pick(PAIRS), k = r.int(2, 5), a = r.int(1, 4), b = r.int(1, 3); return pw(qu(mo(k, [[L[0], a]]), mo(1, [[L[1], -b]])), -2); }, [H.flip, H.br]),
      S('PRG', 'e5b', function (r) { var L = r.pick(PAIRS), k = r.pick([2, 3, 3, 4]), n = k === 4 ? 2 : r.pick([2, 3]), p = r.int(1, 3); return pw(qu(mo(1, [[L[0], -p]]), mo(k, [[L[1], 1]])), -n); }, [H.flip, H.br]),
      S('EMG', 'e5c', function (r) { var L = r.pick([['m', 'n'], ['m', 'n'], ['a', 'b'], ['x', 'y'], ['p', 'q']]), k = r.int(2, 9), p = r.int(1, 5); return pw(qu(mo(k, [[L[0], 0]]), mo(1, [[L[1], p]])), -1); }, [H.flip, H.zero])] },
    { num: '6', stem: 'Simplify inside the bracket first, then apply the outer power.', parts: [
      S('ADV', 'e6a', function (r) { var L = r.pick(PAIRS), d = r.int(2, 3), k = r.pick([2, 3, 3]), p = r.int(1, 4), s = r.int(1, 2), q = r.int(1, 2), u = r.int(1, 2); return pw(qu(mo(d * k, [[L[0], p], [L[1], -q]]), mo(d, [[L[0], -s], [L[1], u]])), -2); }, [H.inside, H.br]),
      S('ADV', 'e6b', function (r) { var L = r.pick(PAIRS), c = r.int(2, 5), k = r.pick([2, 2, 3]), p = r.int(1, 3), s = r.int(1, 3), q = r.int(1, 3), u = r.int(1, 2); return pw(qu(mo(c, [[L[0], -p], [L[1], q]]), mo(c * k, [[L[0], s], [L[1], -u]])), -1); }, [H.inside, H.flip])] },
    { num: '7', section: '', stem: function (sh) { return '<b>Two routes, one answer.</b> Consider ' + t(tx(sh.node)) + '. Simplify it twice, by two different routes, and compare.'; },
      shared: function (r) {
        var x = r.pick(['x', 'x', 'a', 'y', 'm']), d = r.pick([2, 2, 3]), k = r.pick([2, 3, 4, 4, 5]), q = r.int(1, 3), p = q + r.int(2, 4);
        return { x: x, d: d, k: k, p: p, q: q, node: pw(qu(mo(d * k, [[x, p]]), mo(d, [[x, q]])), -2) };
      },
      parts: [
        { id: 'e7a', level: 'EMG', make: function (r, sh) {
          var x = sh.x, inner = M(sh.k, V(x, sh.p - sh.q)), res = mp(inner, -2);
          var p = P.fields('<b>Route 1:</b> simplify inside the bracket first, then apply the outer ' + t('-2') + '.', [
            { name: 'Inside', label: 'Inside the bracket:', before: t('\\dfrac{' + tt(sh.d * sh.k, [[x, sh.p]]) + '}{' + tt(sh.d, [[x, sh.q]]) + '}='), mode: 'math', keys: 'expo', vars: [x] },
            { name: 'Answer', label: 'Answer:', before: t('(' + rawTex(inner) + ')^{-2}='), mode: 'math', keys: 'expo', vars: [x] }],
            [K.expo(rawTex(inner), {}), XTchk(pw(mo(sh.k, [[x, sh.p - sh.q]]), -2))], [rawTex(inner), posTex(res)], t(rawTex(inner)) + ', then ' + t(posTex(res)),
            'Inside: ' + t((sh.d * sh.k) + '\\div ' + sh.d + '=' + sh.k) + ' and ' + t(x + '^{' + sh.p + '-' + sh.q + '}=' + vt(x, sh.p - sh.q)) + ', so the bracket is ' + t(rawTex(inner)) + '.<br>' + t('(' + rawTex(inner) + ')^{-2}=' + sh.k + '^{-2}' + x + '^{' + (-2 * (sh.p - sh.q)) + '}=' + posTex(res)) + '.', [H.inside, H.br], 'two routes: route 1');
          p.bad = [[rawTex(inner), posTex(M(sh.k * sh.k, V(x, 2 * (sh.p - sh.q))))], [rawTex(M(sh.d * sh.k, V(x, sh.p - sh.q))), posTex(res)]];
          return p;
        } },
        { id: 'e7b', level: 'PRG', make: function (r, sh) {
          var x = sh.x, c = sh.d * sh.k, top = pw(mo(c, [[x, sh.p]]), -2), bot = pw(mo(sh.d, [[x, sh.q]]), -2), res = ev(sh.node);
          var p = P.fields('<b>Route 2:</b> apply the outer ' + t('-2') + ' to the numerator and to the denominator first, then simplify.', [
            { name: 'Numerator', label: 'Numerator:', before: t('(' + tt(c, [[x, sh.p]]) + ')^{-2}='), mode: 'math', keys: 'expo', vars: [x] },
            { name: 'Denominator', label: 'Denominator:', before: t('(' + tt(sh.d, [[x, sh.q]]) + ')^{-2}='), mode: 'math', keys: 'expo', vars: [x] },
            { name: 'Answer', label: 'Answer:', before: t('\\dfrac{(' + tt(c, [[x, sh.p]]) + ')^{-2}}{(' + tt(sh.d, [[x, sh.q]]) + ')^{-2}}='), mode: 'math', keys: 'expo', vars: [x] }],
            [XTchk(top), XTchk(bot), XTchk(qu(top, bot))], [posTex(ev(top)), posTex(ev(bot)), posTex(res)], t(posTex(ev(top))) + ', ' + t(posTex(ev(bot))) + ', ' + t(posTex(res)),
            t('(' + tt(c, [[x, sh.p]]) + ')^{-2}=' + posTex(ev(top))) + ' and ' + t('(' + tt(sh.d, [[x, sh.q]]) + ')^{-2}=' + posTex(ev(bot))) + '.<br>Divide: ' + t('\\dfrac{' + posTex(ev(top)) + '}{' + posTex(ev(bot)) + '}=\\dfrac{' + tt(sh.d * sh.d, [[x, 2 * sh.q]]) + '}{' + tt(c * c, [[x, 2 * sh.p]]) + '}=' + posTex(res)) + ' — the same answer as Route 1.', [H.br, H.quot], 'two routes: route 2');
          p.bad = [[posTex(M(c * c, V(x, 2 * sh.p))), posTex(ev(bot)), posTex(res)], [posTex(ev(top)), posTex(ev(bot)), posTex(M(sh.k * sh.k, V(x, 2 * (sh.p - sh.q))))]];
          return p;
        } },
        { id: 'e7c', level: 'EMG', make: function (r, sh) {
          var c = sh.d * sh.k;
          return P.mc(r, 'Do the two routes agree? Which route involved smaller numbers, and why?', [
            { html: 'They agree. Route 1 kept the numbers smaller, because ' + t(c + '\\div ' + sh.d + '=' + sh.k) + ' was reduced <b>before</b> it was squared, instead of squaring ' + t(c) + ' and ' + t(sh.d) + ' separately.', right: true },
            { html: 'They agree. Route 2 kept the numbers smaller, because applying the power first removes the fraction.', why: 'Route 2 squares ' + t(c) + ' and ' + t(sh.d) + ' separately (' + t(c * c) + ' and ' + t(sh.d * sh.d) + ') — bigger numbers than Route 1’s ' + t(sh.k * sh.k) + '.' },
            { html: 'They don’t agree: Route 2 gives a different answer, because the power can’t be applied to the top and bottom separately.', why: 'Simplify both routes completely: they give the same answer. A power of a quotient may be applied to the top and the bottom separately.' },
            { html: 'They agree, and both routes use exactly the same numbers.', why: 'Compare the numbers in the working: Route 2 squares ' + t(c) + ' to get ' + t(c * c) + '; Route 1 only squares ' + t(sh.k) + '.' }],
            'Both routes give ' + t(posTex(ev(sh.node))) + '. Route 1 reduces ' + t(c + '\\div ' + sh.d + '=' + sh.k) + ' first, so it only squares ' + t(sh.k) + '; Route 2 squares ' + t(c) + ' (' + t(c * c) + ') and ' + t(sh.d) + ' (' + t(sh.d * sh.d) + ') and then has to reduce ' + t('\\frac{' + sh.d * sh.d + '}{' + c * c + '}') + '.', ['Look at the biggest number each route had to work with.'], 'two routes: compare');
        } }] },
    { num: '8', stem: 'Simplify. Each of these has a bracket with a negative outer power <b>and</b> a factor sitting outside it.', parts: [
      S('ADV', 'e8a', function (r) {
        var g = pickWhere(function () { return { k: r.pick([2, 3, 3]), a: r.int(1, 2), c: r.int(1, 2), b: r.int(1, 2), d: r.int(1, 2), u: r.int(1, 3), v: r.pick([1, 1, 2]) }; }, function (g) { return g.u - 2 * (g.b + g.d) !== 0; });
        var L = r.pick(PAIRS);
        return pr([pw(qu(mo(g.k, [[L[0], -g.a], [L[1], g.b]]), mo(1, [[L[0], g.c], [L[1], -g.d]])), -2), mo(g.k * g.k * g.v, [[L[0], 0], [L[1], g.u]])]);
      }, [H.inside, H.br]),
      S('ADV', 'e8b', function (r) {
        var L = r.pick(PAIRS), k = r.pick([2, 2, 3]), p = r.int(1, 3), q = r.int(1, 3), m = k === 2 ? r.pick([2, 4]) : r.pick([3, 9]), u = r.chance(0.6) ? 3 * q : 3 * q + r.pick([-2, -1, 1, 2]);
        return pr([pw(qu(mo(k, [[L[0], p]]), mo(1, [[L[1], -q]])), -3), mo(m, [[L[0], 0], [L[1], u]])]);
      }, [H.flip, H.br], { vars: [] })] },
    { num: '9', section: 'Extra practice C — Collapsing, checking, and finding the error', stem: 'Each expression below collapses to a <b>constant</b> — every variable cancels out. Simplify each one fully and give the number that remains.', parts: [
      { id: 'e9a', level: 'EMG', make: function (r) {
        var x = r.pick(LET1), k = r.int(2, 5), d = r.int(2, 5), v = r.int(2, 5), n = r.int(2, 5), node = qu(pr([pw(mo(k, [[x, 1]]), 0), mo(d * v, [[x, n]])], '\\cdot '), mo(d, [[x, n]]));
        return XT(node, { alts: [[M(k * v), 'zero-coef', 'The exponent ' + t('0') + ' is on the whole bracket ' + t('(' + k + x + ')') + ', so the bracket is ' + t('1') + ' — the ' + t(k) + ' goes too.'], [M(0), 'zero-power', t('(' + k + x + ')^{0}=1') + ', not ' + t('0') + '.']], hints: [H.zero, H.coef], vars: [x] });
      } },
      S('PRG', 'e9b', function (r) { var x = r.pick(LET1), k = r.int(2, 6), p = r.int(1, 4); return [qu(pr([pw(mo(k, [[x, -p]]), 2), mo(1, [[x, 2 * p]])]), mo(k * k, [[x, 0]])), { vars: [x] }]; }, [H.br, H.coef]),
      S('PRG', 'e9c', function (r) { var x = r.pick(LET1), k = r.int(2, 5), d = r.pick([2, 2, 3]), p = r.int(1, 4), q = p + r.int(1, 3); return [qu(pr([pw(mo(k, [[x, p]]), -1), mo(k * d, [[x, q]])]), mo(d, [[x, q - p]])), { vars: [x] }]; }, [H.br, H.coef])] },
    { num: '10', stem: function (sh) { return '<b>Numerical spot-check.</b> Consider ' + t(tx(sh.node)) + '.'; },
      shared: function (r) {
        var g = pickWhere(function () { return { k: r.pick([2, 2, 3]), a: r.int(1, 3), b: r.int(1, 2), m: r.pick([2, 4, 8, 6, 3]), c: r.int(3, 6), pt: r.pick([[2, 1], [2, 1], [1, 2], [3, 1]]) }; },
          function (g) { var cc = R(g.k * g.k, g.m), v = evalAt(M(cc, { x: 4 * g.a, y: g.c - 2 * g.b }), { x: g.pt[0], y: g.pt[1] }), top = g.k * Math.pow(g.pt[0], 2 * g.a) / Math.pow(g.pt[1], g.b); return cc[0] <= 9 && g.c - 2 * g.b !== 0 && Math.abs(v - Math.round(v)) < 1e-9 && v <= 100 && top * top <= 400; });
        var L = r.pick([['x', 'y'], ['x', 'y'], ['a', 'b'], ['m', 'n']]);
        return { L: L, pt: g.pt, node: qu(pw(mo(g.k, [[L[0], 2 * g.a], [L[1], -g.b]]), 2), mo(g.m, [[L[0], 0], [L[1], -g.c]])) };
      },
      parts: [
        S('PRG', 'e10a', function (r, sh) { return [sh.node, { prompt: 'Simplify ' + t(tx(sh.node)) + '. Write the answer with positive exponents.' }]; }, [H.steps, H.zero]),
        { id: 'e10b', level: 'EMG', make: function (r, sh) {
          var m = ev(sh.node), env = {}; env[sh.L[0]] = sh.pt[0]; env[sh.L[1]] = sh.pt[1];
          var v = frOf(evalAt(m, env)), ptT = sh.L[0] + '=' + sh.pt[0] + ',\\ ' + sh.L[1] + '=' + sh.pt[1];
          var subOrig = subst(tx(sh.node), env);
          var p = P.fields('Substitute ' + t(ptT) + ' into <b>both</b> the original expression and your simplified form. The two values must match.', [valField('Original', ptT), valField('Simplified', ptT)],
            [exactChk(v), exactChk(v)], [frTex(v), frTex(v)], t(frTex(v)) + ' and ' + t(frTex(v)),
            'Simplified form: ' + t(posTex(m)) + '.<br>Original at ' + t(ptT) + ': ' + t(subOrig + '=' + frTex(v)) + '.<br>Simplified at ' + t(ptT) + ': ' + t(subst(posTex(m), env) + '=' + frTex(v)) + '. They agree ✓',
            ['Work the original one bracket at a time: put the numbers in, then use the exponent rules on the numbers.', 'Use your answer to part (a) for the second box.'], 'spot-check values');
          p.bad = [[frTex(v), String(v[0] + 1)]];
          return p;
        } }] },
    { num: '11', stem: function (sh) { return 'Kalvin simplifies ' + t(tx(sh.node)) + ' and claims the answer is ' + t(vt(sh.x, sh.claim)) + '.'; },
      shared: function (r) {
        var g = pickWhere(function () { return { k: r.int(2, 5), a: r.int(1, 2), b: r.int(3, 7) }; }, function (g) { return g.b - 2 * g.a >= 1 && 2 * g.a + g.b <= 10 && g.b - 2 * g.a <= 4; });
        var x = r.pick(['x', 'x', 'a', 'm', 'n', 'y']);
        return { x: x, g: g, claim: 2 * g.a + g.b, node: qu(pw(mo(g.k, [[x, -g.a]]), 2), mo(g.k * g.k, [[x, -g.b]])) };
      },
      parts: [
        { id: 'e11a', level: 'EMG', make: function (r, sh) {
          var x = sh.x, e = sh.g.b - 2 * sh.g.a, vo = Math.pow(2, e), vc = Math.pow(2, sh.claim);
          var p = P.fields('Substitute ' + t(x + '=2') + ' into the original expression and into ' + t(vt(x, sh.claim)) + ' to show that his claim is wrong.', [
            { name: 'Original', label: 'Original at ' + t(x + '=2') + ':', mode: 'math', keys: 'fraction' }, { name: 'Claim', label: t(vt(x, sh.claim)) + ' at ' + t(x + '=2') + ':', mode: 'math', keys: 'fraction' }],
            [exactChk([vo, 1], function (v) { if (near(v, vc)) return { code: 'u2l7-claim', hint: 'That’s the value of Kalvin’s answer. Substitute into the <b>original</b> expression instead.' }; return null; }), exactChk([vc, 1])],
            [String(vo), String(vc)], t(F(vo)) + ' and ' + t(F(vc)),
            'Original: ' + t(subst(tx(sh.node), V(x, 2))) + ' — the top is ' + t('\\left(\\frac{' + sh.g.k + '}{' + Math.pow(2, sh.g.a) + '}\\right)^{2}') + ' and the bottom is ' + t('\\frac{' + sh.g.k * sh.g.k + '}{' + Math.pow(2, sh.g.b) + '}') + ', so the value is ' + t(F(vo)) + '.<br>Claim: ' + t('2^{' + sh.claim + '}=' + F(vc)) + '.<br>' + t(F(vo) + '\\ne ' + F(vc)) + ', so the claim is wrong.',
            ['Put ' + t('2') + ' in for ' + t(x) + ' everywhere, then use the exponent rules on the numbers.', t('2^{-n}=\\frac{1}{2^{n}}') + '.'], 'Kalvin x=2');
          p.bad = [[String(vc), String(vc)]];
          return p;
        } },
        S('PRG', 'e11b', function (r, sh) { return [sh.node, { prompt: 'Simplify ' + t(tx(sh.node)) + ' correctly. Write the answer with positive exponents.', alts: [[M(1, V(sh.x, sh.claim)), 'repeat-error', 'That’s Kalvin’s answer — the substitution showed it’s wrong. Watch the signs: ' + t('-' + 2 * sh.g.a + '-(-' + sh.g.b + ')') + '.']] }]; }, [H.steps, H.signs])] },
    { num: '12', stem: function (sh) {
        var a = sh, top = tx(a.node.num), bot = tx(a.node.den), s1 = rawTex(M(a.k, V(a.x, 2 * a.a, a.y, -2))), dev = M(R(a.k, a.m), V(a.x, 2 * a.a, a.y, a.b - 2));
        return '<b>Error analysis.</b> Deven simplified ' + t(tx(a.node)) + ' like this. Exactly <b>one</b> step is wrong.\\[\\begin{array}{ll}\\text{Step 1:}&' + top + '=' + s1 + '\\\\[4pt]\\text{Step 2:}&\\dfrac{' + s1 + '}{' + bot + '}\\\\[8pt]\\text{Step 3:}&=' + posTex(dev) + '\\end{array}\\]';
      },
      shared: function (r) {
        var g = pickWhere(function () { return { k: r.pick([2, 2, 3]), a: r.int(2, 4), m: r.pick([2, 4, 4, 3]), b: r.int(3, 6) }; }, function (g) { return g.k !== g.m; });
        var L = r.pick(PAIRS);
        g.x = L[0]; g.y = L[1]; g.node = qu(pw(mo(g.k, [[L[0], -g.a], [L[1], 1]]), -2), mo(g.m, [[L[0], 0], [L[1], -g.b]]));
        return g;
      },
      parts: [
        { id: 'e12a', level: 'PRG', make: function (r, sh) {
          var k = sh.k, a = sh.a;
          return P.mc(r, 'Which step is wrong, and what did Deven do wrong?', [
            { html: 'Step 1: the outer ' + t('-2') + ' must be applied to the coefficient ' + t(k) + ' as well, giving ' + t(k + '^{-2}=\\frac{1}{' + k * k + '}') + ', not ' + t(k) + '.', right: true },
            { html: 'Step 1: ' + t('(-' + a + ')(-2)') + ' should be ' + t(-2 * a) + ', so it should be ' + t(sh.x + '^{' + (-2 * a) + '}') + '.', why: 'A negative times a negative is positive: ' + t('(-' + a + ')(-2)=' + 2 * a) + '. That part of Step 1 is right.' },
            { html: 'Step 2: ' + t(sh.x + '^{0}') + ' is ' + t('0') + ', so the denominator should be ' + t('0') + '.', why: t(sh.x + '^{0}=1') + ', so it simply disappears. Step 2 just rewrites the fraction.' },
            { html: 'Step 3: dividing ' + t(sh.y + '^{-2}') + ' by ' + t(sh.y + '^{-' + sh.b + '}') + ' should give ' + t(sh.y + '^{' + (-2 - sh.b) + '}') + '.', why: 'Quotient law: ' + t('-2-(-' + sh.b + ')=' + (sh.b - 2)) + '. Subtracting a negative adds.' }],
            'Step 1 is wrong: a power outside a bracket applies to <b>every</b> factor inside, including the coefficient. ' + t('(' + tt(k, [[sh.x, -a], [sh.y, 1]]) + ')^{-2}=' + k + '^{-2}' + sh.x + '^{' + 2 * a + '}' + sh.y + '^{-2}=' + posTex(M([1, k * k], V(sh.x, 2 * a, sh.y, -2)))) + '. Steps 2 and 3 are right in method.', [H.br], 'Deven which step');
        } },
        S('ADV', 'e12b', function (r, sh) { return [sh.node, { prompt: 'Give the correct simplified answer for ' + t(tx(sh.node)) + '.', alts: [[M(R(sh.k, sh.m), V(sh.x, 2 * sh.a, sh.y, sh.b - 2)), 'repeat-error', 'That’s Deven’s answer. Fix Step 1 first: the ' + t(sh.k) + ' is raised to the power ' + t('-2') + ' too.']] }]; }, [H.br, H.steps])] },
    { num: '13', stem: function (sh) {
        var x = sh.x, s = sh.p + sh.q, n = sh.n;
        return '<b>Error analysis.</b> Priya simplified ' + t(tx(sh.node)) + ' like this. Again, exactly one step is wrong.\\[\\begin{array}{ll}\\text{Step 1:}&\\dfrac{' + vt(x, sh.p) + '}{' + sh.k + vt(x, -sh.q) + '}=\\dfrac{' + vt(x, s) + '}{' + sh.k + '}\\\\[8pt]\\text{Step 2:}&\\left(\\dfrac{' + vt(x, s) + '}{' + sh.k + '}\\right)^{-' + n + '}=\\dfrac{' + vt(x, -s * n) + '}{' + sh.k + '^{-' + n + '}}\\\\[8pt]\\text{Step 3:}&=\\dfrac{1}{' + Math.pow(sh.k, n) + vt(x, s * n) + '}\\end{array}\\]';
      },
      shared: function (r) {
        var x = r.pick(['a', 'a', 'x', 'y', 'm', 'b']), k = r.pick([2, 2, 3, 5]), n = k === 2 ? r.pick([2, 3]) : 2, p = r.int(2, 5), q = r.int(1, 3);
        return { x: x, k: k, n: n, p: p, q: q, node: pw(qu(mo(1, [[x, p]]), mo(k, [[x, -q]])), -n) };
      },
      parts: [
        { id: 'e13a', level: 'PRG', make: function (r, sh) {
          var k = sh.k, n = sh.n, kn = Math.pow(k, n), x = sh.x;
          return P.mc(r, 'Which step is wrong, and what is the mistake?', [
            { html: 'Step 3: ' + t(k + '^{-' + n + '}') + ' in the <b>denominator</b> means dividing by ' + t('\\frac{1}{' + kn + '}') + ', which multiplies by ' + t(kn) + ' — so ' + t(kn) + ' belongs in the numerator.', right: true },
            { html: 'Step 1: ' + t(vt(x, sh.p) + '\\div ' + vt(x, -sh.q)) + ' should be ' + t(vt(x, sh.p - sh.q)) + '.', why: 'Subtracting a negative adds: ' + t(sh.p + '-(-' + sh.q + ')=' + (sh.p + sh.q)) + '. Step 1 is right.' },
            { html: 'Step 2: the outer ' + t('-' + n) + ' should not be applied to the ' + t(k) + '.', why: 'The outer power applies to every factor of the fraction, the ' + t(k) + ' included. Step 2 is right.' },
            { html: 'Step 2: ' + t('(' + (sh.p + sh.q) + ')(-' + n + ')') + ' should be positive.', why: 'A positive times a negative is negative: ' + t('(' + (sh.p + sh.q) + ')(-' + n + ')=' + (-(sh.p + sh.q) * n)) + '. Step 2 is right.' }],
            'Step 3 is wrong. Each power with a negative exponent crosses the fraction bar: ' + t(vt(x, -(sh.p + sh.q) * n)) + ' moves down and ' + t(k + '^{-' + n + '}') + ' moves <b>up</b>: ' + t('\\dfrac{' + vt(x, -(sh.p + sh.q) * n) + '}{' + k + '^{-' + n + '}}=\\dfrac{' + kn + '}{' + vt(x, (sh.p + sh.q) * n) + '}') + '.', [H.neg], 'Priya which step');
        } },
        S('ADV', 'e13b', function (r, sh) { return [sh.node, { prompt: 'Give the correct answer for ' + t(tx(sh.node)) + '.', alts: [[M([1, Math.pow(sh.k, sh.n)], V(sh.x, -(sh.p + sh.q) * sh.n)), 'repeat-error', 'That’s Priya’s answer. ' + t(sh.k + '^{-' + sh.n + '}') + ' is in the denominator, so it moves <b>up</b> as ' + t(Math.pow(sh.k, sh.n)) + '.']] }]; }, [H.flip, H.neg])] },
    { num: '14', section: 'Extra practice D — Working backwards, ordering, and a stretch', stem: '<b>Work backwards.</b> Determine the value of the unknown exponent in each equation.', parts: [
      { id: 'e14a', level: 'EMG', make: function (r) {
        var x = r.pick(['x', 'x', 'y', 'm', 'b']), a = r.int(2, 9), b = r.int(1, 6), T = a + b;
        return P.number(t('\\dfrac{' + x + '^{a}}{' + vt(x, -b) + '}=' + vt(x, T)), a, function (v) { if (v === T + b) return { code: 'sign-exp', hint: 'Quotient law: ' + t('a-(-' + b + ')=a+' + b) + '. So ' + t('a+' + b + '=' + T) + '.' }; return null; },
          'Quotient law: ' + t('a-(-' + b + ')=' + T) + ', so ' + t('a+' + b + '=' + T) + ' and ' + t('a=' + a) + '.', ['Write the left side as one power of ' + t(x) + ' using the quotient law, then match the exponents.'], 'x^a/x^-' + b + '=x^' + T, { before: t('a=') });
      } },
      { id: 'e14b', level: 'ADV', make: function (r) {
        var x = r.pick(['x', 'x', 'y', 'm', 'b']), k = r.pick([2, 2, 3, 4, 5]), n = k === 2 ? r.pick([2, 3]) : 2, a = r.int(2, 5), kn = Math.pow(k, n);
        return P.number(t('(' + k + x + '^{-a})^{-' + n + '}=\\dfrac{' + vt(x, a * n) + '}{' + kn + '}'), a, function (v) {
          if (v === -a) return { code: 'sign-exp', hint: 'A negative times a negative is positive: ' + t('(-a)(-' + n + ')=' + n + 'a') + '. So ' + t(n + 'a=' + a * n) + '.' };
          if (v === a * n) return { code: 'u2l7-outer', hint: 'The exponent of ' + t(x) + ' on the left is ' + t('(-a)(-' + n + ')=' + n + 'a') + ', so ' + t(n + 'a=' + a * n) + ' — divide by ' + t(n) + '.' };
          return null;
        }, t('(' + k + x + '^{-a})^{-' + n + '}=' + k + '^{-' + n + '}' + x + '^{' + n + 'a}=\\dfrac{' + x + '^{' + n + 'a}}{' + kn + '}') + '. Match the exponents: ' + t(n + 'a=' + a * n) + ', so ' + t('a=' + a) + '.', [H.br, 'Multiply ' + t('-a') + ' by the outside power, then match it with the exponent on the right.'], '(kx^-a)^-n', { before: t('a=') });
      } },
      { id: 'e14c', level: 'ADV', make: function (r) {
        var y = r.pick(['y', 'y', 'x', 'a', 'm']), m = r.int(1, 4), p = r.pick([2, 3, 3]), n = m + r.int(1, 4), T = (n - m) * p;
        return P.number(t('\\left(\\dfrac{' + y + '^{n}}{' + vt(y, m) + '}\\right)^{-' + p + '}=\\dfrac{1}{' + vt(y, T) + '}'), n, function (v) {
          if (v === m - T / p) return { code: 'sign-exp', hint: 'The right side is ' + t(y + '^{-' + T + '}') + ', so ' + t('(n-' + m + ')(-' + p + ')=-' + T) + ' and ' + t('n-' + m + '=' + T / p) + '.' };
          if (v === T / p) return { code: 'value', hint: 'You found ' + t('n-' + m + '=' + T / p) + ' — now add the ' + t(m) + ' back.' };
          if (v === m + T) return { code: 'u2l7-outer', hint: 'The outside power multiplies the exponent: ' + t('(n-' + m + ')(-' + p + ')=-' + T) + ', so divide by ' + t(p) + ' first.' };
          return null;
        }, 'Inside: ' + t(y + '^{n-' + m + '}') + '. Outer power: ' + t(y + '^{(n-' + m + ')(-' + p + ')}') + '. The right side is ' + t(y + '^{-' + T + '}') + ', so ' + t('(n-' + m + ')(-' + p + ')=-' + T) + ', ' + t('n-' + m + '=' + T / p) + ' and ' + t('n=' + n) + '.', [H.inside, 'Write the right side with a negative exponent: ' + t('\\frac{1}{' + vt(y, T) + '}=' + y + '^{-' + T + '}') + '.'], '(y^n/y^m)^-p', { before: t('n=') });
      } }] },
    { num: '15', stem: '<b>Work backwards with coefficients.</b> Determine the value of each unknown.', parts: [
      { id: 'e15a', level: 'ADV', make: function (r) {
        var a = r.pick(['a', 'a', 'x', 'y', 'm']), k = r.int(2, 9), n = r.int(1, 4);
        return P.number(t('(k' + vt(a, -n) + ')^{-1}=\\dfrac{' + vt(a, n) + '}{' + k + '}'), k, function (v) { if (near(v, 1 / k)) return { code: 'coef-pos-power', hint: t('k^{-1}=\\frac{1}{k}') + ': the ' + t('k') + ' ends up in the denominator, where the ' + t(k) + ' is.' }; if (v === -k) return { code: 'opposite', hint: OPP }; return null; },
          t('(k' + vt(a, -n) + ')^{-1}=k^{-1}' + vt(a, n) + '=\\dfrac{' + vt(a, n) + '}{k}') + ', so ' + t('k=' + k) + '.', [H.br, 'Simplify the left side with ' + t('k') + ' still in it, then compare with the right side.'], '(k a^-n)^-1', { before: t('k=') });
      } },
      { id: 'e15b', level: 'ADV', make: function (r) {
        var x = r.pick(['x', 'x', 'y', 'a', 'n']), k = r.int(2, 5), m = r.int(1, 5), b = r.int(1, 5), T = 2 * m + b;
        return P.number(t('\\dfrac{(' + k + x + '^{m})^{2}}{' + k * k + vt(x, -b) + '}=' + vt(x, T)), m, function (v) {
          if (v === (T + b) / 2) return { code: 'sign-exp', hint: 'Dividing by ' + t(vt(x, -b)) + ' <b>adds</b> ' + t(b) + ' to the exponent: ' + t('2m+' + b + '=' + T) + '.' };
          if (v === T - b) return { code: 'u2l7-outer', hint: 'The power ' + t('2') + ' doubles the unknown exponent: ' + t('(' + x + '^{m})^{2}=' + x + '^{2m}') + '. So ' + t('2m+' + b + '=' + T) + '.' };
          return null;
        }, 'Top: ' + t(k * k + x + '^{2m}') + '. Divide: ' + t(x + '^{2m-(-' + b + ')}=' + x + '^{2m+' + b + '}') + ' (the ' + t(k * k) + '’s cancel). So ' + t('2m+' + b + '=' + T) + ', ' + t('2m=' + 2 * m) + ' and ' + t('m=' + m) + '.', [H.br, H.quot], '(kx^m)^2/(k^2x^-b)', { before: t('m=') });
      } }] },
    { num: '16', stem: function (sh) { return '<b>Ordering.</b> Without a calculator, consider ' + sh.items.map(function (it) { return t(it.tex); }).join(', ') + '. Two of them are equal.'; },
      shared: function (r) {
        var g = pickWhere(function () { return { b: r.pick([2, 2, 3, 4, 5]), n: r.int(2, 3), c: r.int(2, 6), m: r.int(2, 3), d: r.int(2, 12) }; },
          function (g) { var A = Math.pow(g.b, g.n), B = Math.pow(g.c, g.m); return A <= 125 && B <= 125 && A !== B && g.d !== A && g.d !== B && g.c !== g.b && g.d !== g.b; });
        var A = Math.pow(g.b, g.n), B = Math.pow(g.c, g.m);
        var items = r.shuffle([{ id: 'p1', tex: g.b + '^{-' + g.n + '}', v: A }, { id: 'q', tex: g.c + '^{-' + g.m + '}', v: B }, { id: 'p2', tex: '\\left(\\frac{1}{' + g.b + '}\\right)^{' + g.n + '}', v: A }, { id: 'd', tex: g.d + '^{-1}', v: g.d }]);
        return { g: g, items: items };
      },
      parts: [
        { id: 'e16a', level: 'BEG', make: function (r, sh) {
          var it = sh.items;
          var p = P.fields('Write each one as a fraction.', it.map(function (x) { return { name: x.tex.replace(/\\left|\\right|\\frac|[{}\\]/g, ''), before: t(x.tex + '='), mode: 'math', keys: 'fraction' }; }),
            it.map(function (x) { return exactChk([1, x.v], function (v) { if (x.id !== 'p2' && near(v, -x.v)) return { code: 'opposite', hint: OPP }; return null; }); }), it.map(function (x) { return '\\frac{1}{' + x.v + '}'; }),
            it.map(function (x) { return t(x.tex + '=\\frac{1}{' + x.v + '}'); }).join(', '), it.map(function (x) { return t(x.tex + '=\\frac{1}{' + x.v + '}'); }).join('<br>'), [H.neg, t('\\left(\\frac{1}{2}\\right)^{3}=\\frac{1^{3}}{2^{3}}') + '.'], 'ordering: as fractions');
          p.bad = [it.map(function (x) { return '-' + x.v; })];
          return p;
        } },
        { id: 'e16b', level: 'EMG', make: function (r, sh) {
          var sorted = sh.items.slice().sort(function (a, b) { return b.v - a.v; }), vOf = {}; sh.items.forEach(function (x) { vOf[x.id] = x.v; });
          var p = P.order(r, 'Arrange them from <b>least to greatest</b>. (The two equal ones can go in either order.)', sorted.map(function (x) { return { id: x.id, tex: x.tex }; }), {},
            'As fractions: ' + sh.items.map(function (x) { return t(x.tex + '=\\frac{1}{' + x.v + '}'); }).join(', ') + '. A bigger denominator means a smaller fraction, so from least to greatest: ' + t(sorted.map(function (x) { return x.tex; }).join('\\le ')) + '.',
            ['Write each as a fraction with ' + t('1') + ' on top first.', 'With the same numerator, the fraction with the <b>bigger</b> denominator is <b>smaller</b>.'], 'order 1/n values');
          var texOf = {}; sh.items.forEach(function (x) { texOf[x.id] = x.tex; });
          p.check = function (resp) {
            if (!resp || resp.length < sorted.length) return form('incomplete', 'Tap every item to place it in order (' + (resp ? resp.length : 0) + ' of ' + sorted.length + ' placed).');
            for (var j = 0; j + 1 < resp.length; j++) if (1 / vOf[resp[j]] > 1 / vOf[resp[j + 1]] + 1e-12) {
              var allRev = resp.every(function (id, i) { return i === 0 || 1 / vOf[resp[i - 1]] >= 1 / vOf[id] - 1e-12; });
              return wrong(allRev ? 'reversed' : 'order', allRev ? 'That’s greatest to least. The question asks for <b>least</b> first.' : t(texOf[resp[j]]) + ' is bigger than ' + t(texOf[resp[j + 1]]) + ' — compare their denominators.');
            }
            return ok();
          };
          var alt = p.key.slice(), i1 = alt.indexOf('p1'), i2 = alt.indexOf('p2'); alt[i1] = 'p2'; alt[i2] = 'p1';
          p.good = [alt];
          return p;
        } },
        { id: 'e16c', level: 'PRG', make: function (r, sh) {
          var g = sh.g, A = Math.pow(g.b, g.n);
          return P.mc(r, 'Which two are equal, and why?', [
            { html: t(g.b + '^{-' + g.n + '}') + ' and ' + t('\\left(\\frac{1}{' + g.b + '}\\right)^{' + g.n + '}') + ', because a negative exponent means the reciprocal of the power: ' + t(g.b + '^{-' + g.n + '}=\\frac{1}{' + g.b + '^{' + g.n + '}}=\\left(\\frac{1}{' + g.b + '}\\right)^{' + g.n + '}') + '.', right: true },
            { html: t(g.b + '^{-' + g.n + '}') + ' and ' + t(g.c + '^{-' + g.m + '}') + ', because both have a negative exponent.', why: 'Write them as fractions: ' + t('\\frac{1}{' + A + '}') + ' and ' + t('\\frac{1}{' + Math.pow(g.c, g.m) + '}') + ' are different.' },
            { html: t('\\left(\\frac{1}{' + g.b + '}\\right)^{' + g.n + '}') + ' and ' + t(g.d + '^{-1}') + ', because both are fractions with ' + t('1') + ' on top.', why: t('\\frac{1}{' + A + '}\\ne\\frac{1}{' + g.d + '}') + ' — the denominators differ.' },
            { html: 'None of them is equal: ' + t(g.b + '^{-' + g.n + '}') + ' is negative and ' + t('\\left(\\frac{1}{' + g.b + '}\\right)^{' + g.n + '}') + ' is positive.', why: OPP }],
            t(g.b + '^{-' + g.n + '}=\\frac{1}{' + g.b + '^{' + g.n + '}}=\\frac{1}{' + A + '}') + ' and ' + t('\\left(\\frac{1}{' + g.b + '}\\right)^{' + g.n + '}=\\frac{1}{' + A + '}') + ': a negative exponent is the same as raising the reciprocal to the positive power.', [H.neg], 'which two equal');
        } }] },
    { num: '17', stem: 'Compare these four values using exact fractions — no decimals, no calculator.', shared: function (r) {
        var g = pickWhere(function () { var pq = cop(r, 2, 5, { lt: true }); return { c: r.int(2, 5), p: pq[0], q: pq[1], d: r.int(2, 4), f: r.int(3, 6) }; },
          function (g) { var vs = [1 / g.c, g.q * g.q / (g.p * g.p), 1 / (g.d * g.d), 1 / (g.f * g.f)]; return vs.every(function (v, i) { return vs.indexOf(v) === i; }); });
        return { g: g, items: [{ id: 'a', tex: g.c + '^{-1}', v: R(1, g.c) }, { id: 'b', tex: '\\left(\\frac{' + g.p + '}{' + g.q + '}\\right)^{-2}', v: R(g.q * g.q, g.p * g.p) }, { id: 'c', tex: g.d + '^{-2}', v: R(1, g.d * g.d) }, { id: 'e', tex: '\\left(\\frac{1}{' + g.f + '}\\right)^{2}', v: R(1, g.f * g.f) }] };
      },
      parts: [
        { id: 'e17a', level: 'PRG', make: function (r, sh) {
          var sorted = sh.items.slice().sort(function (a, b) { return b.v[0] / b.v[1] - a.v[0] / a.v[1]; });
          return P.order(r, 'Arrange from <b>greatest to least</b>: ' + sh.items.map(function (x) { return t(x.tex); }).join(', ') + '.', sorted.map(function (x) { return { id: x.id, tex: x.tex }; }), { first: 'greatest', last: 'least' },
            'As fractions: ' + sh.items.map(function (x) { return t(x.tex + '=' + frTex(x.v)); }).join(', ') + '.<br>Greatest to least: ' + t(sorted.map(function (x) { return x.tex; }).join('>')) + '.', [H.neg, H.flip], 'order greatest to least');
        } },
        { id: 'e17b', level: 'PRG', make: function (r, sh) {
          var g = sh.g;
          return P.mc(r, 'Why does a negative exponent on a number <b>greater</b> than ' + t('1') + ' (like ' + t(g.c + '^{-1}') + ') give a result less than ' + t('1') + ', while a negative exponent on a proper fraction (like ' + t('\\left(\\frac{' + g.p + '}{' + g.q + '}\\right)^{-2}') + ') gives a result greater than ' + t('1') + '?', [
            { html: 'A negative exponent gives the <b>reciprocal</b> of a power. A base greater than ' + t('1') + ' has a power greater than ' + t('1') + ', whose reciprocal is less than ' + t('1') + '; a proper fraction has a power less than ' + t('1') + ', whose reciprocal is greater than ' + t('1') + '.', right: true },
            { html: 'A negative exponent makes the number negative, and every negative number is less than ' + t('1') + '.', why: OPP + ' Neither value is negative.' },
            { html: 'A negative exponent divides the base by the exponent, so it always makes the number smaller.', why: 'Check ' + t('\\left(\\frac{' + g.p + '}{' + g.q + '}\\right)^{-2}=' + frTex(R(g.q * g.q, g.p * g.p))) + ': it got <b>bigger</b>, not smaller.' },
            { html: 'Fractions always get bigger when they are raised to any power.', why: 'Try ' + t('\\left(\\frac{1}{2}\\right)^{2}=\\frac{1}{4}') + ': a proper fraction gets <b>smaller</b> with a positive power. It is the reciprocal that makes it bigger.' }],
            t(g.c + '^{-1}=\\frac{1}{' + g.c + '}<1') + ' because ' + t(g.c + '>1') + '. ' + t('\\left(\\frac{' + g.p + '}{' + g.q + '}\\right)^{-2}=\\left(\\frac{' + g.q + '}{' + g.p + '}\\right)^{2}=' + frTex(R(g.q * g.q, g.p * g.p)) + '>1') + ' because flipping a proper fraction gives a number bigger than ' + t('1') + '.', ['What does a negative exponent do — make the number negative, or take a reciprocal?'], 'why reciprocal size');
        } }] },
    { num: '18', stem: 'Evaluate without a calculator. Give an exact whole number or fraction.', parts: [
      { id: 'e18a', level: 'EMG', make: function (r) {
        var g = pickWhere(function () { return [r.int(2, 5), r.int(1, 4), r.int(2, 7)]; }, function (g) { var d = g[2] - g[1]; return d >= 1 && d <= 3 && Math.pow(g[0], d) <= 125; });
        var b = g[0], p = g[1], q = g[2], d = q - p, v = Math.pow(b, d), tex = '\\dfrac{' + b + '^{-' + p + '}\\times ' + b + '^{' + q + '}}{' + b + '^{0}}';
        return exP(t(tex), [v, 1], function (x) { if (near(x, Math.pow(b, p + q))) return { code: 'sign-exp', hint: 'Keep the sign: ' + t('-' + p + '+' + q + '=' + d) + '.' }; if (near(x, v / b)) return { code: 'zero-base', hint: t(b + '^{0}=1') + '.' }; return null; },
          t(tex + '=\\dfrac{' + b + '^{' + d + '}}{1}=' + v) + '.', [H.prod, H.zero], plain(tex), { bad: [String(Math.pow(b, p + q))] });
      } },
      { id: 'e18b', level: 'PRG', make: function (r) {
        var g = pickWhere(function () { return [r.int(2, 5), r.int(1, 4), r.int(2, 7)]; }, function (g) { var d = g[2] - g[1]; return d >= 1 && d <= 3 && Math.pow(g[0], d) <= 125; });
        var b = g[0], p = g[1], q = g[2], d = q - p, v = Math.pow(b, d), tex = '\\left(\\dfrac{' + b + '^{-' + p + '}}{' + b + '^{-' + q + '}}\\right)^{-1}';
        return exP(t(tex), [1, v], function (x) { if (near(x, v)) return { code: 'no-flip', hint: 'Inside is ' + t(b + '^{' + d + '}') + ' — then the outer ' + t('-1') + ' flips it.' }; if (near(x, Math.pow(b, p + q)) || near(x, Math.pow(b, -(p + q)))) return { code: 'sign-exp', hint: 'Inside: ' + t('-' + p + '-(-' + q + ')=' + d) + '.' }; return null; },
          'Inside: ' + t(b + '^{-' + p + '-(-' + q + ')}=' + b + '^{' + d + '}') + '. Then ' + t('(' + b + '^{' + d + '})^{-1}=\\frac{1}{' + b + '^{' + d + '}}=\\frac{1}{' + v + '}') + '.', [H.inside, H.quot], plain(tex), { bad: [String(v)] });
      } },
      { id: 'e18c', level: 'EMG', make: function (r) {
        var g = pickWhere(function () { return [r.int(2, 5), r.int(1, 3), r.int(2, 7)]; }, function (g) { var d = g[2] - g[1]; return d >= 1 && d <= 3 && Math.pow(g[0], d) <= 125; });
        var b = g[0], p = g[1], q = g[2], d = q - p, v = Math.pow(b, d), tex = '\\dfrac{(' + b + '^{' + p + '})^{-1}\\times ' + b + '^{' + q + '}}{' + b + '^{0}}';
        return exP(t(tex), [v, 1], function (x) { if (near(x, Math.pow(b, q + p))) return { code: 'no-flip', hint: t('(' + b + '^{' + p + '})^{-1}=' + b + '^{-' + p + '}') + '.' }; if (near(x, v / b)) return { code: 'zero-base', hint: t(b + '^{0}=1') + '.' }; return null; },
          t('(' + b + '^{' + p + '})^{-1}=' + b + '^{-' + p + '}') + ', so the top is ' + t(b + '^{-' + p + '+' + q + '}=' + b + '^{' + d + '}') + ' and the bottom is ' + t(b + '^{0}=1') + ': ' + t(v) + '.', [H.pow, H.zero], plain(tex), { bad: [String(Math.pow(b, q + p))] });
      } }] },
    { num: '19', stem: function (sh) { return '<b>Stretch.</b> Consider ' + t(tx(sh.node)) + '.'; },
      shared: function (r) {
        var g = { k: r.pick([3, 3, 2]), j: r.pick([2, 2, 3]), a: r.int(1, 2), p: r.int(1, 3) };
        var L = r.pick([['x', 'y'], ['x', 'y'], ['a', 'b'], ['m', 'n']]);
        return { L: L, g: g, node: qu(pr([pw(mo(g.k, [[L[0], -g.a], [L[1], g.p]]), 2), pw(mo(g.j, [[L[0], 1], [L[1], 0]]), -2)]), mo(g.k * g.k, [[L[0], 0], [L[1], -1]])) };
      },
      parts: [
        S('MAS', 'e19a', function (r, sh) { return [sh.node, { prompt: 'Simplify ' + t(tx(sh.node)) + ' in three clear steps — brackets, then combine, then clear the negatives. Write the answer with positive exponents.' }]; }, [H.steps, H.br]),
        { id: 'e19b', level: 'PRG', make: function (r, sh) {
          var m = ev(sh.node), env = {}; env[sh.L[0]] = 1; env[sh.L[1]] = 2; var v = frOf(evalAt(m, env)), ptT = sh.L[0] + '=1,\\ ' + sh.L[1] + '=2';
          var p = P.fields('Check your answer: substitute ' + t(ptT) + ' into both the original expression and your simplified form.', [valField('Original', ptT), valField('Simplified', ptT)],
            [exactChk(v), exactChk(v)], [frTex(v), frTex(v)], t(frTex(v)) + ' and ' + t(frTex(v)),
            'Simplified: ' + t(posTex(m)) + ', which gives ' + t(frTex(v)) + ' at ' + t(ptT) + '. The original gives the same: ' + t('(' + sh.g.k + '\\cdot 1\\cdot 2^{' + sh.g.p + '})^{2}=' + Math.pow(sh.g.k * Math.pow(2, sh.g.p), 2)) + ', ' + t('(' + sh.g.j + '\\cdot 1\\cdot 1)^{-2}=\\frac{1}{' + sh.g.j * sh.g.j + '}') + ' and the bottom is ' + t(sh.g.k * sh.g.k + '\\cdot 2^{-1}=' + frTex(R(sh.g.k * sh.g.k, 2))) + ', so ' + t('\\dfrac{' + Math.pow(sh.g.k * Math.pow(2, sh.g.p), 2) + '\\times\\frac{1}{' + sh.g.j * sh.g.j + '}}{' + frTex(R(sh.g.k * sh.g.k, 2)) + '}=' + frTex(v)) + ' ✓',
            ['Put the numbers in first, then work one bracket at a time.', t('2^{-1}=\\frac{1}{2}') + ', and ' + t('1') + ' to any power is ' + t('1') + '.'], 'stretch check values');
          p.bad = [[frTex(v), String(Math.round(v[0] / v[1]) + 1)]];
          return p;
        } }] },
    { num: '20', stem: '<i>(Multiple Choice)</i> Choose the correct simplified form.', parts: [
      { id: 'e20a', level: 'EMG', make: function (r) {
        var x = r.pick(['x', 'x', 'a', 'y', 'm']), k = r.int(2, 6), a = r.int(1, 4), b = pickWhere(function () { return r.int(2, 7); }, function (b) { return b !== a; }), s = a + b, tex = '\\dfrac{(' + k + vt(x, -a) + ')^{-1}}{' + vt(x, -b) + '}';
        return P.mc(r, t(tex) + ' is', [
          { html: t(k + vt(x, s)), why: t('(' + k + ')^{-1}=\\frac{1}{' + k + '}') + ': the ' + t(k) + ' ends up in the denominator.' },
          { html: t('\\dfrac{' + vt(x, s) + '}{' + k + '}'), right: true },
          { html: t('\\dfrac{' + k + '}{' + vt(x, s) + '}'), why: 'Both ' + t(vt(x, a)) + ' (from the bracket) and ' + t(vt(x, b)) + ' (from dividing by ' + t(vt(x, -b)) + ') end up on <b>top</b>.' },
          { html: t('\\dfrac{1}{' + k + vt(x, Math.abs(b - a)) + '}'), why: 'Dividing by ' + t(vt(x, -b)) + ' <b>adds</b> ' + t(b) + ' to the exponent: ' + t(a + '-(-' + b + ')=' + s) + '.' }],
          t('(' + k + vt(x, -a) + ')^{-1}=\\frac{' + vt(x, a) + '}{' + k + '}') + ', and dividing by ' + t(vt(x, -b)) + ' gives ' + t('\\frac{' + vt(x, a + b) + '}{' + k + '}') + '.', [H.br, H.quot], 'MC ' + plain(tex), true);
      } },
      { id: 'e20b', level: 'PRG', make: function (r) {
        var x = r.pick(['x', 'x', 'a', 'y', 'm']), k = r.int(2, 5), p = r.pick([1, 1, 2]), n = k <= 3 ? r.pick([2, 3, 3]) : 2, kn = Math.pow(k, n), tex = '\\left(\\dfrac{' + k + '}{' + vt(x, -p) + '}\\right)^{-' + n + '}';
        return P.mc(r, t(tex) + ' is', [
          { html: t('\\dfrac{1}{' + kn + vt(x, p * n) + '}'), right: true },
          { html: t(kn + vt(x, p * n)), why: 'The outer power is <b>negative</b>, so the bracket flips.' },
          { html: t('\\dfrac{' + vt(x, p * n) + '}{' + kn + '}'), why: 'Inside, ' + t('\\frac{' + k + '}{' + vt(x, -p) + '}=' + k + vt(x, p)) + ' — both factors are on top, so both go to the bottom when the bracket flips.' },
          { html: t('-' + kn + vt(x, p * n)), why: OPP }],
          'Inside: ' + t('\\frac{' + k + '}{' + vt(x, -p) + '}=' + k + vt(x, p)) + '. Then ' + t('(' + k + vt(x, p) + ')^{-' + n + '}=\\frac{1}{' + kn + vt(x, p * n) + '}') + '.', [H.inside, H.flip], 'MC ' + plain(tex), true);
      } }] },
    { num: '21', stem: 'The shortcut ' + t('\\left(\\dfrac{a}{b}\\right)^{-n}=\\left(\\dfrac{b}{a}\\right)^{n}') + ' comes from the definition ' + t('a^{-n}=\\dfrac{1}{a^{n}}') + ' and the law ' + t('\\left(\\dfrac{a}{b}\\right)^{n}=\\dfrac{a^{n}}{b^{n}}') + '.', parts: [
      { id: 'e21a', level: 'PRG', make: function (r) {
        var pq = cop(r, 2, 7, { lt: r.chance(0.5) }), p = pq[0], q = pq[1], n = r.pick([2, 2, 3]), f = '\\left(\\frac{' + p + '}{' + q + '}\\right)';
        return P.mc(r, 'Which chain of steps correctly explains why ' + t(f + '^{-' + n + '}=\\left(\\frac{' + q + '}{' + p + '}\\right)^{' + n + '}') + '?', [
          { html: t(f + '^{-' + n + '}=\\dfrac{1}{' + f + '^{' + n + '}}=\\dfrac{1}{\\frac{' + p + '^{' + n + '}}{' + q + '^{' + n + '}}}=\\dfrac{' + q + '^{' + n + '}}{' + p + '^{' + n + '}}=\\left(\\frac{' + q + '}{' + p + '}\\right)^{' + n + '}'), right: true },
          { html: t(f + '^{-' + n + '}=-' + f + '^{' + n + '}=-\\dfrac{' + p + '^{' + n + '}}{' + q + '^{' + n + '}}=\\left(\\frac{' + q + '}{' + p + '}\\right)^{' + n + '}'), why: 'The first step treats the negative exponent as a negative sign. ' + OPP },
          { html: t(f + '^{-' + n + '}=\\dfrac{' + p + '-' + n + '}{' + q + '-' + n + '}=\\left(\\frac{' + q + '}{' + p + '}\\right)^{' + n + '}'), why: 'An exponent is not subtracted from the top and the bottom. Start from the definition: ' + t('a^{-n}=\\frac{1}{a^{n}}') + '.' },
          { html: t(f + '^{-' + n + '}=\\dfrac{' + q + '}{' + p + '}\\times(-' + n + ')=\\left(\\frac{' + q + '}{' + p + '}\\right)^{' + n + '}'), why: 'An exponent is not a multiplier. Use the definition ' + t('a^{-n}=\\frac{1}{a^{n}}') + ' with the whole fraction as the base.' }],
          'Use the definition with the whole fraction as the base, then the power-of-a-quotient law, then divide by a fraction (multiply by its reciprocal): ' + t(f + '^{-' + n + '}=\\frac{1}{' + f + '^{' + n + '}}=\\frac{1}{' + p + '^{' + n + '}/' + q + '^{' + n + '}}=\\frac{' + q + '^{' + n + '}}{' + p + '^{' + n + '}}=\\left(\\frac{' + q + '}{' + p + '}\\right)^{' + n + '}') + '.', ['Start with ' + t('a^{-n}=\\frac{1}{a^{n}}') + ', using the whole fraction as the base ' + t('a') + '.'], 'why (a/b)^-n');
      } },
      S('PRG', 'e21b', function (r) {
        var L = r.pick(PAIRS), k = r.int(2, 5), j = pickWhere(function () { return r.int(2, 5); }, function (j) { return gcd(j, k) === 1; }), a = r.int(1, 3), b = r.int(1, 2);
        var node = pw(qu(mo(k, [[L[0], a]]), mo(j, [[L[1], b]])), -2);
        return [node, { prompt: 'Use the shortcut to simplify ' + t(tx(node)) + ' in a single step. Write the answer with positive exponents.',
          sol: 'Flip the fraction and make the exponent positive: ' + t(tx(node) + '=\\left(\\dfrac{' + tt(j, [[L[1], b]]) + '}{' + tt(k, [[L[0], a]]) + '}\\right)^{2}=' + posTex(ev(node))) + '.' }];
      }, [H.flip, H.br])] },
    { num: '22', stem: '<b>Stretch — find the missing value.</b>', parts: [
      { id: 'e22a', level: 'MAS', make: function (r) {
        var g = pickWhere(function () { return { k: r.int(2, 6), d: r.pick([2, 3, 4, 8, 9]), a: r.int(1, 3), e: r.int(1, 5) }; }, function (g) { return (g.k * g.k) % g.d === 0 && g.k * g.k / g.d >= 1 && g.k * g.k !== g.d; });
        var x = r.pick(['x', 'x', 'y', 'a', 'm']), c = g.k * g.k / g.d, b = g.e + 2 * g.a, cTx = c === 1 ? '' : String(c);
        return P.number('Determine the positive value of ' + t('k') + ' for which ' + t('\\dfrac{(k' + vt(x, -g.a) + ')^{2}}{' + g.d + vt(x, -b) + '}') + ' simplifies to ' + t(cTx + vt(x, g.e)) + '.', g.k, function (v) {
          if (v === -g.k) return { code: 'sign', hint: 'Both ' + t(g.k) + ' and ' + t(-g.k) + ' square to ' + t(g.k * g.k) + ' — the question asks for the <b>positive</b> value.' };
          if (v === c * g.d) return { code: 'coef-not-raised', hint: 'The ' + t('k') + ' is inside the bracket, so it is squared: ' + t('\\frac{k^{2}}{' + g.d + '}=' + c) + ' gives ' + t('k^{2}=' + c * g.d) + '.' };
          return null;
        }, 'Top: ' + t('(k' + vt(x, -g.a) + ')^{2}=k^{2}' + x + '^{' + (-2 * g.a) + '}') + '. Divide: ' + t('\\dfrac{k^{2}' + x + '^{' + (-2 * g.a) + '}}{' + g.d + vt(x, -b) + '}=\\dfrac{k^{2}}{' + g.d + '}' + x + '^{' + (-2 * g.a) + '-(-' + b + ')}=\\dfrac{k^{2}}{' + g.d + '}' + vt(x, g.e)) + '.<br>So ' + t('\\frac{k^{2}}{' + g.d + '}=' + c) + ', ' + t('k^{2}=' + g.k * g.k) + ' and ' + t('k=' + g.k) + ' (the positive value).', [H.br, 'Simplify the left side with ' + t('k') + ' still in it, then match the numbers.'], 'find k', { before: t('k=') });
      } },
      { id: 'e22b', level: 'MAS', make: function (r) {
        var x = r.pick(['x', 'x', 'y', 'a', 'm']), q = r.int(1, 3), p = r.pick([2, 3, 3]), n = r.int(1, 4), T = (n + q) * p;
        return P.number('Determine the value of ' + t('n') + ' for which ' + t('\\left(\\dfrac{' + x + '^{n}}{' + vt(x, -q) + '}\\right)^{-' + p + '}=\\dfrac{1}{' + vt(x, T) + '}') + '.', n, function (v) {
          if (v === T / p + q) return { code: 'sign-exp', hint: 'Inside the bracket, dividing by ' + t(vt(x, -q)) + ' <b>adds</b> ' + t(q) + ': ' + t(x + '^{n+' + q + '}') + '.' };
          if (v === T - q) return { code: 'u2l7-outer', hint: 'The outside power multiplies the exponent: ' + t('(n+' + q + ')(-' + p + ')=-' + T) + ', so divide by ' + t(p) + ' first.' };
          return null;
        }, 'Inside: ' + t(x + '^{n-(-' + q + ')}=' + x + '^{n+' + q + '}') + '. Outer power: ' + t(x + '^{-' + p + '(n+' + q + ')}') + '. The right side is ' + t(x + '^{-' + T + '}') + ', so ' + t(p + '(n+' + q + ')=' + T) + ', ' + t('n+' + q + '=' + T / p) + ' and ' + t('n=' + n) + '.', [H.inside, 'Write the right side with a negative exponent, then match the exponents.'], 'find n', { before: t('n=') });
      } }] }
  ];

  HW.defineLesson({
    id: 'u2l7', unit: 2, num: '7', title: 'Combining Zero, Negative and Positive Exponents', outcome: 'AN3',
    blurb: 'No new rule — every exponent law working together in one expression: brackets first, then combine matching bases, then clear zero and negative exponents.',
    questions: questions, extra: extra
  });
})(window);
