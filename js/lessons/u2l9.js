/* Math 15 · Unit 2 · Lesson 9 — Rational Exponents and Radical Form (AN3)
 * Assignment 9 (u2_L09.tex, questions 1–16) and the Lesson 9 Extra Practice (u2_EP09.tex, questions 1–22).
 * Twin of Math 10C u2l4 (evaluating, converting both ways, the cube problems) and u2l5 (the exponent laws with rational
 * exponents). The evaluating / converting machinery (EV, convCheck, genRad, toPowPart, asPowerPart, powOfCheck,
 * solvePart …) is copied from 10C u2l4 unchanged; the law questions use a small monomial engine with rational exponents
 * (lawPart: K.expo plus "which wrong law gives the student's answer" diagnoses: multiplied instead of adding, added the
 * numerators and the denominators, added instead of subtracting / multiplying, subtracted backwards, coefficient not
 * raised / multiplied by the exponent / only rooted).
 * Math 15 pitch: no calculator, small perfect powers, positive bases only (the booklet restricts a^(1/n) to a ≥ 0).
 * Levels: BEG unit-fraction exponents and one-step conversions; EMG root-then-power, unlike denominators;
 * PRG negative exponents, fraction bases, coefficients; ADV multi-step / working backwards; MAS extra 14, 17(d), 22(a). */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'neg-exp-sign': 'Read a negative exponent as a negative answer', 'no-recip': 'Forgot the reciprocal (negative exponent)',
    'times-exp': 'Multiplied the base by the exponent', swap: 'Swapped the root index and the power', 'root-only': 'Took the root but not the power',
    'no-root': 'Forgot the root (used the numerator only)', 'square-root': 'Used a square root for every denominator',
    entire: 'Not written as an entire radical', 'root-first': 'Not written root-first', 'coef-inside': 'Moved the coefficient under the radical',
    'coef-outside': 'Left the bracketed coefficient outside the radical', 'coef-not-powered': 'Didn’t raise the coefficient to the power', 'coef-times': 'Multiplied the coefficient by the exponent',
    'coef-flipped': 'Moved the coefficient to the denominator too', 'same-base': 'Used the number itself as the base',
    exponent: 'Used a different exponent', 'six-faces': 'Forgot the cube has 6 faces', 'not-squared': 'Didn’t square the edge for the area',
    'same-power': 'Raised both sides to the same power instead of the reciprocal', 'all-faces': 'Gave all six faces instead of one', misread: 'Mixed up the two values',
    'law-added': 'Added exponents where the law multiplies or subtracts', 'law-divided': 'Divided the exponents instead of subtracting', mult: 'Multiplied exponents instead of adding',
    'add-den': 'Added numerators and denominators of the exponents', backwards: 'Subtracted the exponents in the wrong order',
    'coef-raise': 'Didn’t raise the coefficient to the power', 'coef-added': 'Added the coefficients', 'missed-power': 'Forgot the outside exponent',
    'u2l9-sq-terms': 'Squared each term of a sum (lost the middle term)', 'u2l9-mid-sign': 'Middle term with the wrong sign', 'u2l9-mid-term': 'Middle term wrong (2ab)',
    'u2l9-expand': 'Not expanded', 'u2l9-divided': 'Divided the two numbers instead of matching powers', 'u2l9-no-square': 'Forgot the final square',
    'u2l9-one-sa': 'One of the two surface areas wrong'
  });
  HW.addPartial({ 'u2l9-sq-terms': 'n', 'u2l9-mid-sign': 's', 'u2l9-mid-term': 'b', 'u2l9-divided': 'n', 'u2l9-no-square': 'b', 'u2l9-one-sa': 's' });

  /* ---------- exact arithmetic ---------- */
  function iroot(v, n) { // exact integer nth root of v (negative allowed for odd n), else null
    if (v < 0) { if (n % 2 === 0) return null; var q = iroot(-v, n); return q == null ? null : -q; }
    var c0 = Math.round(Math.pow(v, 1 / n));
    for (var c = Math.max(0, c0 - 1); c <= c0 + 1; c++) if (Math.pow(c, n) === v) return c;
    return null;
  }
  function ratRoot(fr, n) { var a = iroot(fr[0], n), b = iroot(fr[1], n); return a == null || b == null ? null : [a, b]; }
  function ratPow(fr, k) { var pp = Math.pow(fr[0], Math.abs(k)), qq = Math.pow(fr[1], Math.abs(k)); return k < 0 ? ex.norm(qq, pp) : ex.norm(pp, qq); }
  function rv(fr) { return fr[0] / fr[1]; }
  function rpow(b, m, n) { // real value of b^(m/n); NaN when it has no real value
    var g = ex.gcd(m, n) || 1; m /= g; n /= g; if (n < 0) { m = -m; n = -n; }
    if (b < 0) { if (n % 2 === 0) return NaN; return Math.pow(-Math.pow(-b, 1 / n), m); }
    return Math.pow(b, m / n);
  }
  function near(a, b) { return isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b)); }

  /* ---------- LaTeX ---------- */
  function ratTex(fr) { return fr[1] === 1 ? F(fr[0]) : (fr[0] < 0 ? '-' : '') + '\\frac{' + F(Math.abs(fr[0])) + '}{' + F(fr[1]) + '}'; }
  function numTex(fr, dec) { return dec ? K.decTex(fr) : ratTex(fr); }
  function baseTex(fr, dec) { var s = numTex(fr, dec); return fr[0] < 0 || dec || fr[1] !== 1 ? '\\left(' + s + '\\right)' : s; }
  function expTex(m, n) { var g = ex.gcd(m, n) || 1; m /= g; n /= g; if (n < 0) { m = -m; n = -n; } return n === 1 ? String(m) : (m < 0 ? '-' : '') + Math.abs(m) + '/' + n; }
  function rootTex(n, inner) { return ex.texRoot(n, inner); }
  function rootName(n) { return K.rootName(n); }
  function nth(n) { return n === 2 ? 'square' : n === 3 ? 'cube' : n + 'th'; }
  function powName(n) { return n === 2 ? 'square' : n === 3 ? 'cube' : n + 'th power'; }
  function dedupe(arr) { return arr.filter(function (x, i) { return i === 0 || x !== arr[i - 1]; }); }
  function decStr(x) { return String(K.roundTo(x, 2).toFixed(2)); }
  function numOr(x) { var r = Math.round(x); return Math.abs(r - x) < 1e-9 ? F(r) : (Math.round(x * 10000) / 10000).toString(); }
  function sgn(x) { return x < 0 ? -1 : 1; }

  /* ---------- evaluate b^(m/n) exactly (b a rational, possibly negative or a decimal) ----------
   * o: { base:[p,q], m, n, outer (±1), dec (show decimals), btex (base TeX in the prompt), etex (exponent TeX in the prompt),
   *      prompt (whole expression TeX), sbtex (base TeX in the solution), pre (first solution line), extra (more diagnoses),
   *      ask (prompt wrapper), text } */
  function EV(o) {
    o.outer = o.outer || 1;
    var n = o.n, m = o.m, rt = ratRoot(o.base, n);
    if (!rt) throw new Error('no exact root: ' + o.base + ' index ' + n);
    var core = ratPow(rt, m), val = o.outer < 0 ? [-core[0], core[1]] : core;
    var bt = o.btex || baseTex(o.base, o.dec), et = o.etex || expTex(m, n);
    var expr = o.prompt || ((o.outer < 0 ? '-' : '') + bt + '^{' + et + '}');
    var cands = evalCands(o, rt, rv(val)).concat(o.extra || []);
    var check = K.fraction(val, { decimalOk: !!o.dec, diag: function (v) {
      for (var i = 0; i < cands.length; i++) if (near(v, cands[i].v)) return { code: cands[i].code, hint: cands[i].hint };
      return null;
    } });
    var keyTex = o.dec ? K.decTex(val) : ex.texRat(val);
    var hints = ['The denominator ' + t(n) + ' is the index of the root and the numerator ' + t(Math.abs(m)) + ' is the power. Take the root first to keep the numbers small.'];
    if (m < 0) hints.push('A negative exponent means <b>reciprocal</b>: ' + t('a^{-k}=\\frac{1}{a^{k}}') + '. It doesn’t make the answer negative.');
    else if (o.base[0] < 0) hints.push('An odd root of a negative number is negative, e.g. ' + t('\\sqrt[3]{-8}=-2') + '.');
    else if (o.outer < 0) hints.push('The minus sign in front isn’t part of the base: work out the power, then take the opposite.');
    var p = P.math(o.ask ? o.ask(expr) : t(expr), check, keyTex, evalSol(o, rt, core, val), hints, o.text || 'evaluate ' + expr.replace(/\\left|\\right/g, ''), { keys: o.dec ? 'decimal' : 'fraction' });
    p.answer = t(numTex(val, o.dec));
    p.expr = expr;
    p.good = [val[1] === 1 ? String(val[0]) : val[0] + '/' + val[1]];
    if (o.dec) p.good.push(K.decTex(val));
    p.bad = cands.map(function (c) { return String(c.v); });
    return p;
  }
  function evalSol(o, rt, core, val) {
    var n = o.n, k = Math.abs(o.m), dec = o.dec;
    var B = o.sbtex || o.btex || baseTex(o.base, dec), E = expTex(o.m, n);
    var inner = numTex(o.base, dec), rad = rootTex(n, inner);
    var radk = k === 1 ? rad : '\\left(' + rad + '\\right)^{' + k + '}';
    var Rk = k === 1 ? numTex(rt, dec) : baseTex(rt, dec) + '^{' + k + '}';
    var PK = numTex(ratPow(rt, k), dec);
    var chain = [B + '^{' + E + '}'];
    if (o.m > 0) chain.push(radk, Rk, PK);
    else chain.push('\\frac{1}{' + radk + '}', '\\frac{1}{' + Rk + '}', '\\frac{1}{' + PK + '}', numTex(core, dec));
    chain = dedupe(chain);
    var lines = [];
    if (o.pre) lines.push(o.pre);
    lines.push('The denominator ' + t(n) + ' is the index: take the ' + rootName(n) + ' root' + (k > 1 ? ', then raise it to the power ' + t(k) : '') + (o.m < 0 ? '. The negative exponent means reciprocal.' : '.')
      + (o.base[0] < 0 ? ' The index ' + t(n) + ' is odd, so the root of the negative base exists' + (k > 1 ? (k % 2 ? ' (and an odd power keeps it negative)' : ' (and the even power makes it positive)') : '') + '.' : ''));
    lines.push(t(chain.join('=')));
    if (o.outer < 0) lines.push('The minus sign in front is applied last: ' + t('-\\left(' + numTex(core, dec) + '\\right)=' + numTex(val, dec)) + '.');
    return lines.join('<br>');
  }
  function evalCands(o, rt, T) {
    var b = rv(o.base), m = o.m, n = o.n, k = Math.abs(m), s = o.outer || 1, out = [];
    var B = o.sbtex || o.btex || baseTex(o.base, o.dec), inner = numTex(o.base, o.dec);
    function add(v, code, hint) { if (isFinite(v) && !near(v, T) && !out.some(function (c) { return near(c.v, v); })) out.push({ v: v, code: code, hint: hint }); }
    if (s < 0) add(-T, 'sign', 'Check the minus sign in front: it isn’t part of the base. Work out the power first, then take the opposite.');
    if (m < 0) add(-s * rpow(b, k, n), 'neg-exp-sign', 'A negative exponent means <b>reciprocal</b>, not a negative answer: ' + t('a^{-k}=\\frac{1}{a^{k}}') + '.');
    if (m < 0) add(s * rpow(b, k, n), 'no-recip', 'You found ' + t(B + '^{' + expTex(k, n) + '}') + '. The exponent is negative, so take the <b>reciprocal</b>' + (o.base[1] !== 1 ? ' (flip the fraction)' : '') + '.');
    if (b < 0 && s > 0) add(-T, 'sign', k % 2 === 0 ? 'The ' + rootName(n) + ' root of a negative number is negative, but the even power ' + t(k) + ' makes the result positive.' : 'The ' + rootName(n) + ' root of ' + t(inner) + ' is negative, and an odd power keeps it negative.');
    if (k > 1) add(s * rpow(b, sgn(m) * n, k), 'swap', 'It looks like the root and the power are swapped. The <b>denominator</b> ' + t(n) + ' is the index of the root; the <b>numerator</b> ' + t(k) + ' is the power.');
    if (k > 1) add(s * rpow(b, sgn(m), n), 'root-only', 'You took the ' + rootName(n) + ' root. Now raise it to the power ' + t(k) + ' — that’s what the numerator says.');
    add(s * Math.pow(b, m), 'no-root', 'Don’t forget the root: the denominator ' + t(n) + ' means take the ' + rootName(n) + ' root.');
    if (n !== 2) add(s * rpow(b, m, 2), 'square-root', 'The denominator is ' + t(n) + ', so this is a <b>' + rootName(n) + '</b> root, not a square root.');
    add(s * b * m / n, 'times-exp', 'The exponent isn’t a multiplier: ' + t(B + '^{' + expTex(m, n) + '}') + ' doesn’t mean ' + t(B + '\\times ' + (m < 0 ? '\\left(' + expTex(m, n) + '\\right)' : expTex(m, n))) + '. Denominator = index of the root, numerator = power.');
    if (o.dec) { var w = rv(rt) / 10; add(s * Math.pow(w, m), 'dec-root', 'Check your ' + rootName(n) + ' root of ' + t(inner) + ': raise it to the power ' + t(n) + ' and see whether you get ' + t(inner) + ' back. Count the decimal places.'); }
    return out;
  }

  /* ---------- reading the structure of a typed answer ---------- */
  function strip(x) { while (x && x.t === 'paren') x = x.a; return x; }
  function kids(x) { return ['a', 'b', 'n'].filter(function (k) { return x[k] && typeof x[k] === 'object'; }).map(function (k) { return x[k]; }); }
  function varsOf(ast) { var acc = {}; (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'var') acc[x.n] = 1; kids(x).forEach(w); })(ast); return Object.keys(acc); }
  function hasDiv(x) { if (!x || typeof x !== 'object') return false; if (x.t === 'div' || (x.t === 'num' && x.dec)) return true; return kids(x).some(hasDiv); }
  function hasNum(x) { x = strip(x); if (!x) return false; if (x.t === 'num') return true; if (x.t === 'mul' || x.t === 'neg') return kids(x).some(hasNum); return false; }
  function shapeOf(ast) {
    var f = { roots: 0, ratExp: false, negExp: false, powOfRoot: false, unexpanded: false, idx: [] };
    (function w(x, inRoot) {
      if (!x || typeof x !== 'object') return;
      if (x.t === 'root') { f.roots++; var ir = ex.rat(x.n); f.idx.push(ir && ir[1] === 1 ? ir[0] : null); }
      if (x.t === 'pow') {
        if (hasDiv(x.b)) f.ratExp = true;
        var e = strip(x.b), er = ex.rat(x.b);
        if (e.t === 'neg' || (er && er[0] < 0)) f.negExp = true;
        var bs = strip(x.a);
        if (bs.t === 'root') f.powOfRoot = true;
        if (inRoot && (bs.t === 'num' || (bs.t === 'mul' && hasNum(bs)))) f.unexpanded = true;
      }
      kids(x).forEach(function (c) { w(c, inRoot || x.t === 'root'); });
    })(ast, false);
    return f;
  }
  function sampleEnv(vars, i, neg) {
    var env = {}; vars.forEach(function (v, j) { var s = 0.37 + 1.13 * ((i * 7 + j * 3) % 11) / 5 + j * 0.21; env[v] = neg && neg.indexOf(v) >= 0 ? -s : s; }); return env;
  }
  function equivAt(a, b, vars, neg) {
    for (var i = 0; i < 5; i++) { var env = sampleEnv(vars, i, neg); if (!near(ex.value(a, env), ex.value(b, env))) return false; }
    return true;
  }
  function nanAt(a, vars, neg) { for (var i = 0; i < 3; i++) if (isFinite(ex.value(a, sampleEnv(vars, i, neg)))) return false; return true; }

  /* ---------- converting: an answer equal to target, in radical form or as a power ----------
   * opt: form 'radical' | 'power'; entire (one root, power inside); rootFirst ((ⁿ√a)^m); expand (number powers worked out
   * under the root); index (required index); single (one base, one exponent: give a TeX example); needRat (a rational
   * exponent must appear); neg (letters that are negative); cands [[tex, code, hint]]; nanHint */
  function convCheck(target, opt) {
    opt = opt || {};
    var tp = ex.parse(target); if (!tp.ok) throw new Error('bad target ' + target);
    var tv = varsOf(tp.ast), cands = (opt.cands || []).map(function (c) { var q = ex.parse(c[0]); if (!q.ok) throw new Error('bad cand ' + c[0]); return { ast: q.ast, code: c[1], hint: c[2] }; });
    var T = tv.length ? null : ex.value(tp.ast);
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var sv = varsOf(a.ast), extra = sv.filter(function (v) { return tv.indexOf(v) < 0; });
      if (extra.length) return wrong('var', 'Your answer has a letter ' + t(extra[0]) + ' that isn’t in the question.');
      var f = shapeOf(a.ast);
      if (equivAt(a.ast, tp.ast, tv, opt.neg)) {
        if (opt.form === 'radical') {
          if (f.ratExp) return form('not-radical', 'Right value — now write it in <b>radical form</b> (use the root key; no fractional exponents).');
          if (!f.roots) return form('not-radical', 'Right value — but write it with a radical sign, as the question asks.');
          if (opt.index && f.idx.some(function (i) { return i !== opt.index; })) return form('index', 'Right value, but use a ' + rootName(opt.index) + ' root (index ' + t(opt.index) + '), as the exponent says.');
          if (f.negExp) return form('neg-exp', 'Right value — now write it without a negative exponent: a negative exponent puts the radical in the <b>denominator</b>.');
          if (opt.entire && f.powOfRoot) return form('entire', 'Right value — now write it as an <b>entire radical</b>, with the power inside the root: ' + t('\\left(\\sqrt[n]{a}\\right)^{m}=\\sqrt[n]{a^{m}}') + '.');
          if (opt.rootFirst && !f.powOfRoot) return form('root-first', 'Right value — the question asks for the root taken <b>first</b>: write it as ' + t('\\left(\\sqrt[n]{a}\\right)^{m}') + '.');
          if (opt.expand && f.unexpanded) return form('evaluate', 'Right value — now work out the number power under the root, e.g. ' + t('(2a)^{5}=32a^{5}') + '.');
          return ok();
        }
        if (opt.form === 'power') {
          if (f.roots) return form('not-power', 'Right value — now write it as a <b>power</b> with a rational exponent (no radical sign).');
          if (opt.single && strip(a.ast).t !== 'pow') return form('single-power', 'Right value — now write it as a <b>single power</b> ' + t(opt.single) + ' (one base, one exponent).');
          if (opt.needRat && !f.ratExp) return form('not-power', 'Right value — but write it with a <b>rational exponent</b>, as the question asks.');
          return ok();
        }
        return ok();
      }
      for (var i = 0; i < cands.length; i++) if (equivAt(a.ast, cands[i].ast, tv, opt.neg)) return wrong(cands[i].code, cands[i].hint);
      if (tv.length && nanAt(a.ast, tv, opt.neg)) return wrong('undefined', opt.nanHint || 'Your expression has no real value here (an even root of a negative number). Check where the minus sign goes.');
      if (T != null && isFinite(a.val) && !f.roots && !f.ratExp && Math.abs(a.val - T) < 0.01 * Math.abs(T)) return form('decimal', 'That’s a decimal approximation. Give the <b>exact</b> form the question asks for.');
      return wrong('value', null);
    };
  }
  function convPart(promptHtml, target, opt, sol, hints, text, extraVars) {
    var vs = varsOf(ex.parse(target).ast).concat(extraVars || []).filter(function (v, i, arr) { return arr.indexOf(v) === i; }).sort();
    var p = P.math(promptHtml, convCheck(target, opt), target, sol, hints, text, { keys: 'expo', vars: vs.length ? vs : ['x'], before: opt.before });
    p.bad = (opt.cands || []).map(function (c) { return c[0]; });
    return p;
  }
  /* x^(m/n) as radicals: style 'entire' ⁿ√(x^m) or 'rootFirst' (ⁿ√x)^m; coefficient c outside */
  function radOf(v, m, n, style, c) {
    var k = Math.abs(m), entire = rootTex(n, k === 1 ? v : v + '^{' + k + '}'), rf = k === 1 ? rootTex(n, v) : '\\left(' + rootTex(n, v) + '\\right)^{' + k + '}';
    var r = style === 'rootFirst' ? rf : entire, cc = c && c !== 1 ? String(c) : '';
    return m < 0 ? '\\frac{' + (cc || '1') + '}{' + r + '}' : cc + r;
  }
  function radCands(v, m, n, style, c) { // the classic slips for x^(m/n) -> radical
    var k = Math.abs(m), s = sgn(m), out = [];
    if (k > 1) out.push([radOf(v, s * n, k, style, c), 'swap', 'The <b>denominator</b> ' + t(n) + ' is the index of the root and the <b>numerator</b> ' + t(k) + ' is the power — you have them the other way round.']);
    if (m < 0) out.push(['-' + radOf(v, k, n, style, c), 'neg-exp-sign', 'A negative exponent doesn’t make the expression negative — it means <b>reciprocal</b>: the radical goes in the denominator.']);
    if (m < 0) out.push([radOf(v, k, n, style, c), 'no-recip', 'The exponent is negative, so the radical belongs in the <b>denominator</b>: ' + t('x^{-a}=\\frac{1}{x^{a}}') + '.']);
    if (k > 1) out.push([radOf(v, s, n, style, c), 'root-only', 'You have the root, but the numerator ' + t(k) + ' is a power that still has to appear.']);
    out.push([(c && c !== 1 ? c : '') + v + '^{' + m + '}', 'no-root', 'The denominator ' + t(n) + ' means a ' + rootName(n) + ' root — your answer has no root.']);
    if (n !== 2) out.push([radOf(v, m, 2, style, c), 'square-root', 'The denominator is ' + t(n) + ', so use a <b>' + rootName(n) + '</b> root (index ' + t(n) + '), not a square root.']);
    return out;
  }
  function radSol(promptTex, v, m, n, ans) {
    var k = Math.abs(m);
    return 'Denominator ' + t(n) + ' → index of the root; numerator ' + t(k) + ' → the power' + (m < 0 ? '; the negative sign → reciprocal (the radical goes in the denominator)' : '') + '.<br>' + t(promptTex + '=' + ans);
  }
  var convHints = ['The denominator of the exponent is the index of the root; the numerator is the power: ' + t('x^{m/n}=\\sqrt[n]{x^{m}}=\\left(\\sqrt[n]{x}\\right)^{m}') + '.',
    'A negative exponent puts the power in the denominator: ' + t('x^{-m/n}=\\frac{1}{\\sqrt[n]{x^{m}}}') + '.'];
  /* radical -> power z^(m/n) */
  function toPowPart(v, m, n, radTexStr, sol, text, more) {
    var tgt = v + '^{' + expTex(m, n) + '}', k = Math.abs(m), s = sgn(m), cands = (more || []).slice();
    if (k > 1 || n > 1) cands.push([v + '^{' + expTex(s * n, k) + '}', 'swap', 'The <b>index</b> of the root becomes the <b>denominator</b> of the exponent, and the power inside becomes the numerator.']);
    cands.push([v + '^{' + expTex(-m, n) + '}', m < 0 ? 'no-recip' : 'flip-exp', m < 0 ? 'The radical is in the <b>denominator</b>, so the exponent is <b>negative</b>.' : 'Check the sign of the exponent: the radical is in the numerator, so the exponent is positive.']);
    if (n !== 1) cands.push([v + '^{' + m * n + '}', 'times-exp', 'A root divides the exponent: the index ' + t(n) + ' goes in the <b>denominator</b>, ' + t(v + '^{' + expTex(m, n) + '}') + '.']);
    var p = convPart(t(radTexStr), tgt, { form: 'power', single: v + '^{n}', cands: cands }, sol || 'Index ' + t(n) + ' → denominator; power ' + t(k) + ' → numerator' + (m < 0 ? '; in the denominator → negative exponent' : '') + '.<br>' + t(radTexStr + '=' + tgt), convHints, text || 'radical to power ' + radTexStr);
    p.good = [v + '^(' + (m < 0 ? '-' : '') + k + '/' + n + ')'];
    return p;
  }

  /* ---------- write a number as a power with a given exponent ---------- */
  function asPowerPart(V, e, B, sol, hints, text, words) { // V (rational [p,q]) = B^(e) ; e = [p,q]
    var eTex = e[1] === 1 ? String(e[0]) : (e[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(e[0]) + '}{' + e[1] + '}', Vv = rv(V), Bt = baseTex(B), keyTex = Bt + '^{' + expTex(e[0], e[1]) + '}';
    var check = function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (varsOf(a.ast).length) return wrong('var', 'Use numbers only.');
      var top = strip(a.ast), veq = near(a.val, Vv);
      if (top.t === 'neg' && strip(top.a).t === 'pow' && veq) return form('brackets', 'Right value, but a minus sign in front isn’t part of the base: ' + t('-a^{n}') + ' means ' + t('-\\left(a^{n}\\right)') + '. Put the negative base in brackets: ' + t('\\left(-a\\right)^{' + eTex + '}') + '.');
      if (top.t !== 'pow') { if (veq) return form('single-power', 'Right value — now write it as a <b>power</b> with exponent ' + t(eTex) + ', like ' + t('b^{' + eTex + '}') + '.'); return wrong('value', 'Write it as one power: a base with the exponent ' + t(eTex) + '.'); }
      var er = ex.rat(top.b);
      if (!er || er[0] * e[1] !== e[0] * er[1]) { if (veq) return form('exponent', 'Right value, but use the exponent the question gives: ' + t(eTex) + '.'); return wrong('exponent', 'Use the exponent the question gives: ' + t(eTex) + '.'); }
      if (veq) return ok();
      var bv = ex.value(top.a);
      if (near(bv, Vv)) return wrong('same-base', t(baseTex(V) + '^{' + eTex + '}') + ' isn’t ' + t(ratTex(V)) + '. Which base, raised to the exponent ' + t(eTex) + ', <i>gives</i> ' + t(ratTex(V)) + '? Undo the exponent: raise ' + t(ratTex(V)) + ' to the reciprocal power.');
      if (near(a.val, 1 / Vv)) return wrong('flip', 'Your power equals ' + t(ratTex(ex.norm(V[1], V[0]))) + ', the reciprocal. With a negative exponent the base must be the <b>reciprocal</b> of what you’d use for a positive one.');
      if (near(a.val, -Vv)) return wrong('sign', 'Your power equals ' + t(ratTex([-V[0], V[1]])) + '. Check the sign of the base.');
      if (!isFinite(a.val)) return wrong('undefined', 'Your power has no real value — an even root of a negative number.');
      return wrong('value', 'Check: your power works out to about ' + t(numOr(a.val)) + ', not ' + t(ratTex(V)) + '.');
    };
    var p = P.math(words || ('Write ' + t(ratTex(V)) + ' as a power with an exponent of ' + t(eTex) + '.'), check, keyTex, sol, hints, text, { keys: 'expo', vars: [] });
    p.input.vars = ['x']; p.input.keys = 'expo';
    p.bad = [ratTex(V) + '^{' + expTex(e[0], e[1]) + '}', ex.texRat(ex.norm(V[1], V[0]))];
    return p;
  }

  /* ---------- an expression that uses V with a rational exponent and equals target ---------- */
  function usesPowOf(ast, V) {
    var found = false;
    (function w(x) { if (!x || typeof x !== 'object' || found) return; if (x.t === 'pow' && hasDiv(x.b) && near(ex.value(strip(x.a)), V)) found = true; kids(x).forEach(w); })(ast);
    return found;
  }
  function powOfCheck(V, target, cands, later) {
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (varsOf(a.ast).length) return wrong('var', 'Use numbers only.');
      if (near(a.val, target)) {
        if (!usesPowOf(a.ast, V)) return form('not-power', 'Right value — but the question asks for an expression using a <b>power of ' + t(F(V)) + '</b> with a rational exponent' + (later ? ' (you calculate it in part (c))' : '') + '.');
        return ok();
      }
      for (var i = 0; i < cands.length; i++) if (near(a.val, cands[i].v)) return wrong(cands[i].code, cands[i].hint);
      return wrong('value', null);
    };
  }

  /* ---------- multiple choice ---------- */
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return P.mc(r, prompt, opts, sol, hints, text, keepOrder); }

  /* ---------- generators ---------- */
  function coprimePairs(lo, hi) { var out = []; for (var a = lo; a <= hi; a++) for (var b = lo; b <= hi; b++) if (a !== b && ex.gcd(a, b) === 1) out.push([a, b]); return out; }
  function pickWhere(r, gen, okf, tries) { for (var i = 0; i < (tries || 300); i++) { var v = gen(); if (okf(v)) return v; } return null; }
  function coprimeMN(r, mList, nList) { return pickWhere(r, function () { return [r.pick(mList), r.pick(nList)]; }, function (v) { return ex.gcd(v[0], v[1]) === 1 && v[0] !== v[1]; }); }

  /* ---------- power -> radical part makers ---------- */
  function genRad(v, m, n, style, opt) { // v^(m/n) -> radical; style: how the answer is displayed ('entire' or 'rootFirst')
    opt = opt || {};
    var pr = v + '^{' + expTex(m, n) + '}', tgt = radOf(v, m, n, style);
    return convPart(t(pr), tgt, { form: 'radical', index: n, entire: opt.entire, rootFirst: opt.rootFirst, cands: radCands(v, m, n, style) }, radSol(pr, v, m, n, tgt), convHints, 'power to radical ' + pr);
  }
  function coefRad(v, c, m, n, opt) { // c·v^(m/n): the coefficient stays outside
    opt = opt || {};
    var pr = c + v + '^{' + expTex(m, n) + '}', tgt = radOf(v, m, n, 'entire', c), k = Math.abs(m);
    var inside = 'The exponent belongs to ' + t(v) + ' only — the ' + t(c) + ' isn’t under the power, so it stays <b>outside</b> the radical.';
    var cands = [[rootTex(n, c + v + (k === 1 ? '' : '^{' + k + '}')), 'coef-inside', inside], [rootTex(n, Math.pow(c, k) + v + (k === 1 ? '' : '^{' + k + '}')), 'coef-inside', inside]];
    if (m < 0) cands.unshift(['\\frac{1}{' + c + radOf(v, k, n, 'entire') + '}', 'coef-flipped', 'Only ' + t(v) + ' has the negative exponent, so only its radical moves to the denominator. The ' + t(c) + ' stays on top: ' + t(tgt) + '.']);
    return convPart(t(pr), tgt, { form: 'radical', index: n, entire: opt.entire, cands: cands.concat(radCands(v, m, n, 'entire', c)) },
      'The exponent applies to ' + t(v) + ' only; the coefficient ' + t(c) + ' stays where it is' + (m < 0 ? ' (on top)' : '') + '.<br>' + t(pr + '=' + tgt), convHints.concat(['Ask: what is the base of the power? Here it is just ' + t(v) + '.']), 'power to radical ' + pr);
  }
  function bracketRad(v, c, m, n, opt) { // (c·v)^(m/n): the coefficient goes under the root and is raised to the power
    opt = opt || {};
    var k = Math.abs(m), ck = Math.pow(c, k), pr = '\\left(' + c + v + '\\right)^{' + expTex(m, n) + '}';
    var inner = F(ck) + v + (k === 1 ? '' : '^{' + k + '}'), body = opt.rootFirst ? (k === 1 ? rootTex(n, c + v) : '\\left(' + rootTex(n, c + v) + '\\right)^{' + k + '}') : rootTex(n, inner);
    var tgt = m < 0 ? '\\frac{1}{' + body + '}' : body;
    function wrapM(s) { return m < 0 ? '\\frac{1}{' + s + '}' : s; }
    var cands = [[wrapM(c + radOf(v, k, n, 'entire')), 'coef-outside', 'Here the base is ' + t('(' + c + v + ')') + ': the ' + t(c) + ' is inside the brackets, so it goes under the root ' + (k > 1 ? 'and is raised to the power ' + t(k) + ' too.' : 'too.')]];
    if (k > 1) cands.push([wrapM(rootTex(n, c + v + '^{' + k + '}')), 'coef-not-powered', 'The power ' + t(k) + ' applies to the ' + t(c) + ' as well: ' + t('(' + c + v + ')^{' + k + '}=' + F(ck) + v + '^{' + k + '}') + '.']);
    if (k > 1 && c * k !== ck) cands.push([wrapM(rootTex(n, c * k + v + '^{' + k + '}')), 'coef-times', t(c + '^{' + k + '}') + ' means ' + t(c) + ' multiplied by itself ' + k + ' times — not ' + t(c + '\\times ' + k) + '.']);
    if (m < 0) cands.push([body, 'no-recip', 'The exponent is negative, so the radical goes in the <b>denominator</b>.'], ['-' + body, 'neg-exp-sign', 'A negative exponent means reciprocal, not a negative value.']);
    if (k > 1) cands.push([wrapM(rootTex(k, Math.pow(c, n) + v + '^{' + n + '}')), 'swap', 'The <b>denominator</b> ' + t(n) + ' is the index of the root; the <b>numerator</b> ' + t(k) + ' is the power.']);
    var sol = opt.rootFirst ? 'The base is the whole bracket ' + t('(' + c + v + ')') + ', so the ' + t(c) + ' goes under the root with ' + t(v) + '. Take the ' + rootName(n) + ' root first, then the power ' + t(k) + (m < 0 ? '; the negative exponent puts it in the denominator' : '') + '.<br>' + t(pr + '=' + tgt)
      : 'The base is the whole bracket ' + t('(' + c + v + ')') + ', so the ' + t(c) + ' goes under the root too' + (k > 1 ? ' and is raised to the power ' + t(k) + ': ' + t('(' + c + v + ')^{' + k + '}=' + F(ck) + v + '^{' + k + '}') : '') + '.<br>' + t(pr + '=' + (k > 1 ? wrapM(rootTex(n, '(' + c + v + ')^{' + k + '}')) + '=' : '') + tgt);
    return convPart(t(pr), tgt, { form: 'radical', index: n, expand: !opt.rootFirst && !opt.noExpand, rootFirst: opt.rootFirst, entire: opt.entire, cands: cands }, sol,
      convHints.concat(['Everything inside the brackets is the base — the number too.']), 'power to radical ' + pr);
  }

  /* ---------- solving x^(a/b) = v (Extra 22) ---------- */
  function solvePart(a, b, c) { // x^(a/b) = c^a, so x = c^b (a may be -1)
    var x = Math.pow(c, b), v = ratPow([c, 1], a), vt = ratTex(v), e1 = expTex(a, b), rec = expTex(b, a);
    var cands = [
      { v: rpow(rv(v), a, b), code: 'same-power', hint: 'Raising both sides to ' + t(e1) + ' again doesn’t undo it. Raise both sides to the <b>reciprocal</b> exponent ' + t(rec) + '.' },
      { v: rpow(rv(v), 1, Math.abs(a)), code: 'root-only', hint: 'That undoes only part of the exponent. Raise both sides to ' + t(rec) + ': ' + t('\\left(x^{' + e1 + '}\\right)^{' + rec + '}=x^{1}') + '.' },
      { v: 1 / x, code: 'flip', hint: 'Check by substituting your answer: does it give ' + t(vt) + '? Watch the sign of the exponent.' },
      { v: rv(v) * b / a, code: 'times-exp', hint: 'The exponent isn’t a multiplier: undo it with the reciprocal power ' + t(rec) + ', not by dividing.' }].filter(function (q) { return isFinite(q.v) && !near(q.v, x); });
    var step = a > 0 ? '\\left(' + rootTex(a, vt) + '\\right)^{' + b + '}=' + c + '^{' + b + '}=' + F(x) : '\\left(' + vt + '\\right)^{-' + b + '}=' + c + '^{' + b + '}=' + F(x);
    var chk = a > 0 ? '\\left(' + rootTex(b, F(x)) + '\\right)^{' + a + '}=' + c + '^{' + a + '}=' + vt : '\\frac{1}{' + rootTex(b, F(x)) + '}=' + vt;
    var p = P.math(t('x^{' + e1 + '}=' + vt), K.fraction([x, 1], { diag: function (val) { for (var i = 0; i < cands.length; i++) if (near(val, cands[i].v)) return { code: cands[i].code, hint: cands[i].hint }; return null; } }), String(x),
      'Raise both sides to the reciprocal power ' + t(rec) + ': ' + t('\\left(x^{' + e1 + '}\\right)^{' + rec + '}=x') + ', so ' + t('x=' + baseTex(v) + '^{' + rec + '}') + '.<br>' + t(step) + '<br>Check: ' + t(F(x) + '^{' + e1 + '}=' + chk) + ' ✓',
      ['Raise both sides to the reciprocal of ' + t(e1) + ', which is ' + t(rec) + '.', 'Check your answer by substituting it back.'], 'solve x^' + e1 + '=' + vt, { keys: 'fraction', before: t('x=') });
    p.bad = cands.map(function (q) { return String(q.v); });
    return p;
  }

  /* ================= rationals and monomials with rational exponents ================= */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function Q(p, q) { if (Array.isArray(p)) { q = p[1]; p = p[0]; } q = q == null ? 1 : q; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function qadd(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qsub(a, b) { b = Q(b); return qadd(a, [-b[0], b[1]]); }
  function qmul(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[0], a[1] * b[1]); }
  function qdiv(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[1], a[1] * b[0]); }
  function qeq(a, b) { a = Q(a); b = Q(b); return a[0] === b[0] && a[1] === b[1]; }
  function qpow(c, e) { c = Q(c); e = Q(e); var a = iroot(c[0], e[1]), b = iroot(c[1], e[1]); if (a == null || b == null) return null; var m = Math.abs(e[0]), res = Q(Math.pow(a, m), Math.pow(b, m)); return e[0] < 0 ? Q(res[1], res[0]) : res; }
  function eS(e) { e = Q(e); return e[1] === 1 ? String(e[0]) : e[0] + '/' + e[1]; }
  function eF(e) { e = Q(e); return e[1] === 1 ? String(e[0]) : (e[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(e[0]) + '}{' + e[1] + '}'; }
  function eP(e) { e = Q(e); return e[0] < 0 ? '\\left(' + eF(e) + '\\right)' : eF(e); }
  function pw(b, e) { e = Q(e); return e[0] === 1 && e[1] === 1 ? b : b + '^{' + eS(e) + '}'; }
  function M(c, v) { var o = {}; Object.keys(v || {}).forEach(function (k) { o[k] = Q(v[k]); }); return { c: Q(c), v: o }; }
  function mono(x, e, c) { var v = {}; v[x] = e; return M(c == null ? 1 : c, v); }
  function mmul(A, B) { var v = {}; [A, B].forEach(function (X) { Object.keys(X.v).forEach(function (k) { v[k] = v[k] ? qadd(v[k], X.v[k]) : X.v[k]; }); }); return { c: qmul(A.c, B.c), v: v }; }
  function minv(A) { var v = {}; Object.keys(A.v).forEach(function (k) { v[k] = qmul(A.v[k], -1); }); return { c: qdiv(1, A.c), v: v }; }
  function mdiv(A, B) { return mmul(A, minv(B)); }
  function mpow(A, r) { var c = qpow(A.c, r); if (!c) return null; var v = {}; Object.keys(A.v).forEach(function (k) { v[k] = qmul(A.v[k], r); }); return { c: c, v: v }; }
  function cTex(c, hasVars) { c = Q(c); if (c[1] === 1) return hasVars && c[0] === 1 ? '' : hasVars && c[0] === -1 ? '-' : F(c[0]); return (c[0] < 0 ? '-' : '') + '\\frac{' + F(Math.abs(c[0])) + '}{' + F(c[1]) + '}'; }
  function vks(A, ord) { return (ord || Object.keys(A.v)).filter(function (k) { return A.v[k] && A.v[k][0] !== 0; }); }
  function rawTex(A, ord) { var vs = vks(A, ord).map(function (k) { return pw(k, A.v[k]); }).join(''); return cTex(A.c, !!vs) + vs; }
  function posTex(A, ord) {
    var c = Q(A.c), neg = c[0] < 0, cn = Math.abs(c[0]), cd = c[1], k = vks(A, ord);
    var nv = k.filter(function (x) { return A.v[x][0] > 0; }).map(function (x) { return pw(x, A.v[x]); }).join('');
    var dv = k.filter(function (x) { return A.v[x][0] < 0; }).map(function (x) { return pw(x, qmul(A.v[x], -1)); }).join('');
    var num = (cn !== 1 || !nv ? F(cn) : '') + nv, den = (cd !== 1 ? F(cd) : '') + dv;
    return (neg ? '-' : '') + (den ? '\\frac{' + num + '}{' + den + '}' : num);
  }
  function fin(A, ord) { var a = rawTex(A, ord), b = posTex(A, ord); return a === b ? a : a + '=' + b; }
  function monoEq(A, B) { if (!qeq(A.c, B.c)) return false; return Object.keys(A.v).concat(Object.keys(B.v)).every(function (k) { return qeq(A.v[k] || [0, 1], B.v[k] || [0, 1]); }); }
  function anIs(an, A) { if (!an || !an.coef) return false; var v = {}; Object.keys(an.vars || {}).forEach(function (k) { v[k] = Q(an.vars[k][0], an.vars[k][1]); }); return monoEq({ c: Q(an.coef[0], an.coef[1]), v: v }, A); }
  function br(s) { return '\\left(' + s + '\\right)'; }
  /* exponent arithmetic, step by step: ['\frac13+\frac16', '\frac26+\frac16', '\frac36', '\frac12'] */
  function expSum(a, b, op) {
    a = Q(a); b = Q(b);
    var L = lcm(a[1], b[1]), A0 = a[0] * L / a[1], B0 = b[0] * L / b[1], s = op === '-' ? A0 - B0 : A0 + B0;
    function fr(n) { return L === 1 ? String(n) : (n < 0 ? '-' : '') + '\\frac{' + Math.abs(n) + '}{' + L + '}'; }
    function frp(n) { return n < 0 ? '\\left(' + fr(n) + '\\right)' : fr(n); }
    var out = [eF(a) + op + eP(b)], s2 = fr(A0) + op + frp(B0);
    if (s2 !== out[0]) out.push(s2);
    var raw = fr(s); out.push(raw);
    var f2 = eF(Q(s, L)); if (f2 !== raw) out.push(f2);
    return out;
  }
  function chainTex(v, ch, e) { var s = ch.map(function (x) { return v + '^{' + x + '}'; }).join('='); e = Q(e); if (e[0] === 1 && e[1] === 1) s += '=' + v; else if (e[0] < 0) s += '=' + posTex(mono(v, e)); return s; }
  var LAWH = ['Product law: <b>add</b> the exponents. Quotient law: <b>subtract</b>. Power of a power: <b>multiply</b>. To add or subtract fractions, use a common denominator.',
    'Leave the answer as a power with a positive exponent: ' + t('x^{-n}=\\frac{1}{x^{n}}') + '.'];
  /* one exponent-law answer: K.expo, plus "which wrong law gives this?" diagnoses. wrongs: [[monomial, code, hint]] */
  function lawPart(prompt, A, wrongs, sol, hints, text, opt) {
    opt = opt || {};
    var T = posTex(A, opt.ord), seen = [A], W = [];
    (wrongs || []).forEach(function (w) { if (!w || !w[0]) return; if (seen.some(function (s) { return monoEq(s, w[0]); })) return; seen.push(w[0]); W.push(w); });
    var p = P.expo(prompt, T, { vars: opt.vars, form: opt.form, diag: function (an) { for (var i = 0; i < W.length; i++) if (anIs(an, W[i][0])) return { code: W[i][1], hint: W[i][2] }; return null; } }, sol, hints || LAWH, text);
    p.bad = W.map(function (w) { return posTex(w[0], opt.ord); });
    if (opt.good) p.good = opt.good;
    return p;
  }
  var H_MULT = 'Multiplying powers with the same base: <b>add</b> the exponents (product law) — don’t multiply them.';
  function hAddDen(a, b) { return 'Fractions don’t add top-to-top and bottom-to-bottom. Use a common denominator: ' + t(eF(a) + '+' + eP(b) + '=' + expSum(a, b, '+').slice(1).join('=')) + '.'; }
  /* v^a × v^b */
  function prodPart(v, a, b) {
    a = Q(a); b = Q(b); var e = qadd(a, b), ch = expSum(a, b, '+'), pr = pw(v, a) + '\\times ' + pw(v, b);
    return lawPart(t(pr), mono(v, e), [[mono(v, qmul(a, b)), 'mult', H_MULT], [mono(v, Q(a[0] + b[0], a[1] + b[1])), 'add-den', hAddDen(a, b)],
      [mono(v, Q(a[0] + b[0], Math.max(a[1], b[1]))), 'add-den', hAddDen(a, b)]],
      'Same base, so <b>add</b> the exponents (product law)' + (a[1] !== b[1] ? ', over a common denominator' : '') + ':<br>' + t(pr + '=' + chainTex(v, ch, e)), null, 'product ' + pr);
  }
  /* v^a ÷ v^b */
  function quotPart(v, a, b, frac) {
    a = Q(a); b = Q(b); var e = qsub(a, b), ch = expSum(a, b, '-'), pr = frac ? '\\dfrac{' + pw(v, a) + '}{' + pw(v, b) + '}' : pw(v, a) + '\\div ' + pw(v, b);
    return lawPart(t(pr), mono(v, e), [[mono(v, qadd(a, b)), 'law-added', 'Dividing powers with the same base: <b>subtract</b> the exponents (quotient law).'],
      [mono(v, qdiv(a, b)), 'law-divided', 'Subtract the exponents — don’t divide them.'],
      [mono(v, qsub(b, a)), 'backwards', 'Subtract in order: the exponent on top (first) minus the exponent on the bottom (second), ' + t(eF(a) + '-' + eP(b)) + '.' + (e[0] < 0 ? ' The result is negative, so the power ends up in the denominator.' : '')]],
      'Same base, so <b>subtract</b> the exponents (quotient law):<br>' + t(pr + '=' + chainTex(v, ch, e)) + (e[0] < 0 ? '<br>A negative exponent means reciprocal: the power goes in the denominator.' : ''), null, 'quotient ' + pr);
  }
  /* (c·v^a)^r */
  function powPart(c, v, a, r) {
    a = Q(a); r = Q(r); var A0 = mono(v, a, c), A = mpow(A0, r), pr = br(rawTex(A0)) + '^{' + eS(r) + '}', W = [];
    W.push([mono(v, qadd(a, r), A.c), 'law-added', 'A power of a power: <b>multiply</b> the exponents, ' + t(eF(a) + '\\times ' + eP(r)) + '.']);
    if (c !== 1) {
      var cr = Q(c), ct = qmul(cr, r);
      W.push([mono(v, A.v[v], cr), 'coef-raise', 'The outside exponent applies to the number ' + t(F(c)) + ' as well: ' + t(F(c) + '^{' + eS(r) + '}') + '.']);
      if (ct[1] === 1) W.push([mono(v, A.v[v], ct), 'coef-times', t(F(c) + '^{' + eS(r) + '}') + ' isn’t ' + t(F(c) + '\\times ' + eP(r)) + '. ' + (r[1] === 1 ? 'Multiply ' + t(F(c)) + ' by itself ' + r[0] + ' times.' : 'Take the root first, then the power.')]);
      if (r[1] !== 1) { var rt = qpow(cr, [1, r[1]]); if (rt) W.push([mono(v, A.v[v], rt), 'root-only', 'You took the ' + rootName(r[1]) + ' root of ' + t(F(c)) + '. Now raise it to the power ' + t(r[0]) + '.']); var pp = qpow(cr, [r[0], 1]); if (pp) W.push([mono(v, A.v[v], pp), 'no-root', 'The denominator ' + t(r[1]) + ' of the exponent means a ' + rootName(r[1]) + ' root of ' + t(F(c)) + ' too.']); }
    }
    var cl = c === 1 ? '' : t(F(c) + '^{' + eS(r) + '}=' + (r[1] === 1 ? F(qv(A.c)) : (r[0] === 1 ? rootTex(r[1], F(c)) : br(rootTex(r[1], F(c))) + '^{' + r[0] + '}') + '=' + F(qv(A.c)))) + ' and ';
    return lawPart(t(pr), A, W, 'Every factor gets the outside exponent; for a power of a power, <b>multiply</b> the exponents:<br>' + cl + t(v + '^{' + eF(a) + '\\times ' + eP(r) + '}=' + pw(v, A.v[v])) + ', so ' + t(pr + '=' + posTex(A)) + '.', null, 'power ' + pr);
  }
  function qv(a) { a = Q(a); return a[0] / a[1]; }
  var LETS = ['m', 'n', 'p', 'q', 'x', 'a', 'b', 'k', 'w', 'y', 'c', 'd', 'h', 'r', 's', 't'];
  function cops(q) { var o = []; for (var a = 1; a < q; a++) if (gcd(a, q) === 1) o.push(a); return o; }

  /* ================= Assignment 9 ================= */
  function cubeShared(r) {
    var s = r.pick([2, 3, 3, 4, 5, 6, 7, 8, 9, 10]), u = r.pick(['cm', 'cm', 'm', 'mm']), o = r.pick(['A cube', 'A cube', 'A cube-shaped box', 'A cube-shaped tank', 'A storage cube', 'A cube of ice']);
    return { s: s, V: s * s * s, u: u, o: o };
  }
  function q9a(r, sh) {
    var V = sh.V, VT = F(V);
    var p = P.math('Write a power that represents the edge length of the cube.', powOfCheck(V, sh.s, [
      { v: Math.sqrt(V), code: 'square-root', hint: 'The volume of a cube is ' + t('(\\text{edge})^{3}') + ', so the edge is the <b>cube</b> root: use the exponent ' + t('\\frac{1}{3}') + '.' },
      { v: V / 3, code: 'times-exp', hint: 'Dividing by 3 doesn’t undo cubing. The edge is the cube root of the volume.' },
      { v: Math.pow(V, 3), code: 'no-root', hint: 'That cubes the volume. The edge is the cube <b>root</b> of the volume.' }], true), VT + '^{1/3}',
      t('V=(\\text{edge})^{3}') + ', so the edge is the cube root of the volume: ' + t('\\text{edge}=' + VT + '^{1/3}') + ' ' + sh.u + '.', ['Volume of a cube = ' + t('(\\text{edge})^{3}') + '. Which exponent undoes cubing?'], 'cube edge power, V=' + V, { keys: 'expo', vars: [], before: t('\\text{edge}=') });
    p.good = [V + '^(1/3)']; p.bad = [String(sh.s), V + '^{1/2}'];
    return p;
  }
  function q9b(r, sh) {
    var V = sh.V, VT = F(V), SA = 6 * sh.s * sh.s;
    var p = P.math('Write a power that represents the surface area of the cube.', powOfCheck(V, SA, [
      { v: sh.s * sh.s, code: 'six-faces', hint: 'That’s the area of <b>one</b> face. A cube has ' + t('6') + ' faces.' },
      { v: 6 * sh.s, code: 'not-squared', hint: 'Each face is a square with area ' + t('(\\text{edge})^{2}') + ': square the edge before multiplying by ' + t('6') + '.' },
      { v: 4 * sh.s * sh.s, code: 'six-faces', hint: 'Count the faces of a cube: there are ' + t('6') + '.' },
      { v: 6 * Math.pow(V, 1.5), code: 'swap', hint: 'Each face has area ' + t('\\left(' + VT + '^{1/3}\\right)^{2}=' + VT + '^{2/3}') + ' — check your exponent.' }], true), '6\\left(' + VT + '^{1/3}\\right)^{2}',
      'Six square faces, each of area ' + t('(\\text{edge})^{2}') + ':<br>' + t('\\text{SA}=6\\left(' + VT + '^{1/3}\\right)^{2}=6\\cdot ' + VT + '^{2/3}') + ' ' + sh.u + '².', ['A cube has 6 square faces. Write the edge as a power first, then square it.'], 'cube SA power, V=' + V, { keys: 'expo', vars: [], before: t('\\text{SA}=') });
    p.good = ['6*' + V + '^(2/3)', '6(' + V + '^(1/3))^2']; p.bad = [String(SA), V + '^{2/3}', '6\\cdot ' + V + '^{1/3}'];
    return p;
  }
  function q9c(r, sh) {
    var s = sh.s, V = sh.V, VT = F(V), SA = 6 * s * s;
    var p = P.fields('Calculate the exact edge length and surface area of the cube.', [{ name: 'Edge', label: 'edge', before: t('='), after: sh.u }, { name: 'Surface area', label: 'surface area', before: t('='), after: sh.u + '²' }],
      [K.number(s, function (v) { return near(v, Math.sqrt(V)) || near(v, K.roundTo(Math.sqrt(V), 2)) ? { code: 'square-root', hint: 'Use the <b>cube</b> root: ' + t(VT + '^{1/3}=' + rootTex(3, VT)) + '.' } : v === V / 3 ? { code: 'times-exp', hint: 'The cube root isn’t dividing by 3. Which number cubed gives ' + t(VT) + '?' } : null; }),
        K.number(SA, function (v) { return v === s * s ? { code: 'six-faces', hint: 'That’s one face. A cube has ' + t('6') + ' faces.' } : v === 6 * s ? { code: 'not-squared', hint: 'Each face has area ' + t('(\\text{edge})^{2}') + '.' } : v === 4 * s * s ? { code: 'six-faces', hint: 'A cube has ' + t('6') + ' faces, not 4.' } : null; })],
      [String(s), String(SA)], 'edge ' + t(s) + ' ' + sh.u + ', surface area ' + t(F(SA)) + ' ' + sh.u + '²',
      t('\\text{edge}=' + VT + '^{1/3}=' + rootTex(3, VT) + '=' + s) + ' ' + sh.u + ' (' + t(s + '^{3}=' + VT) + ').<br>' + t(VT + '^{2/3}=' + s + '^{2}=' + s * s) + ', so ' + t('\\text{SA}=6(' + s * s + ')=' + F(SA)) + ' ' + sh.u + '².',
      ['Which whole number cubed gives ' + t(VT) + '?', 'Surface area = ' + t('6\\times(\\text{edge})^{2}') + '.'], 'cube edge and SA, V=' + V);
    p.bad = [[String(s), String(s * s)], [String(s + 1), String(SA)]];
    return p;
  }
  function q10a(r, sh) {
    var L = sh.L, pw0 = L + '^{1/3}', rd = rootTex(3, L);
    var p = P.fields('Write a power <b>and</b> a radical that represent the edge length of the cube.', [{ name: 'Power', label: 'power: edge', before: t('='), mode: 'math', keys: 'expo', vars: [L] }, { name: 'Radical', label: 'radical: edge', before: t('='), mode: 'math', keys: 'expo', vars: [L] }],
      [convCheck(pw0, { form: 'power', single: L + '^{n}', needRat: true, cands: [[L + '^{1/2}', 'square-root', 'Volume = ' + t('(\\text{edge})^{3}') + ', so the edge is a <b>cube</b> root: exponent ' + t('\\frac{1}{3}') + '.'], ['\\frac{' + L + '}{3}', 'times-exp', 'Dividing by 3 doesn’t undo cubing — use the exponent ' + t('\\frac{1}{3}') + '.'], [L + '^{3}', 'no-root', 'That cubes the volume. The edge is the cube <b>root</b>.']] }),
        convCheck(rd, { form: 'radical', index: 3, cands: [['\\sqrt{' + L + '}', 'square-root', 'Use a <b>cube</b> root (index 3): ' + t(rootTex(3, L)) + '.'], ['\\frac{' + L + '}{3}', 'times-exp', 'The cube root isn’t dividing by 3.']] })],
      [pw0, rd], 'edge ' + t('=' + pw0 + '=' + rd), t('V=(\\text{edge})^{3}') + ', so ' + t('\\text{edge}=' + pw0 + '=' + rd) + '.', ['Volume = ' + t('(\\text{edge})^{3}') + '. Which exponent undoes cubing?'], 'edge of cube volume ' + L);
    p.bad = [[L + '^{1/2}', rd], [pw0, '\\sqrt{' + L + '}']];
    return p;
  }
  function q10b(r, sh) {
    var L = sh.L, pw0 = L + '^{2/3}', rd = '\\left(' + rootTex(3, L) + '\\right)^{2}';
    var c1 = [[L + '^{3/2}', 'swap', 'Edge ' + t('=' + L + '^{1/3}') + '; one face is the edge <b>squared</b>: ' + t('\\left(' + L + '^{1/3}\\right)^{2}') + '. Multiply the exponents.'], ['6' + L + '^{2/3}', 'all-faces', 'That’s all six faces. The question asks for the area of <b>one</b> face.'], [L + '^{1/3}', 'not-squared', 'That’s the edge. A face is a square: square the edge.'], [L + '^{2}', 'no-root', 'The edge is ' + t(L + '^{1/3}') + ', not ' + t(L) + '. Square the edge.']];
    var c2 = [[rootTex(2, L + '^{3}'), 'swap', 'Edge ' + t('=' + rootTex(3, L)) + '; square it: ' + t('\\left(' + rootTex(3, L) + '\\right)^{2}') + '.'], ['6\\left(' + rootTex(3, L) + '\\right)^{2}', 'all-faces', 'That’s all six faces — the question asks for one face.'], [rootTex(3, L), 'not-squared', 'That’s the edge. Square it for the area of a face.']];
    var p = P.fields('Write a power <b>and</b> a radical that represent the area of one face of the cube.', [{ name: 'Power', label: 'power: area', before: t('='), mode: 'math', keys: 'expo', vars: [L] }, { name: 'Radical', label: 'radical: area', before: t('='), mode: 'math', keys: 'expo', vars: [L] }],
      [convCheck(pw0, { form: 'power', single: L + '^{n}', needRat: true, cands: c1 }), convCheck(rd, { form: 'radical', index: 3, cands: c2 })],
      [pw0, rd], 'area ' + t('=' + pw0 + '=' + rd + '=' + rootTex(3, L + '^{2}')), 'One face is a square with side ' + t(L + '^{1/3}') + ':<br>' + t('\\text{area}=\\left(' + L + '^{1/3}\\right)^{2}=' + pw0 + '=' + rd) + ' (or ' + t(rootTex(3, L + '^{2}')) + ').',
      ['A face is a square whose side is the edge. Find the edge length as a power of ' + t(L) + ', then square it.'], 'face area of cube volume ' + L);
    p.bad = [[L + '^{3/2}', rd], [pw0, rootTex(3, L)]];
    return p;
  }
  function q12(r) {
    var ab = r.pick(coprimePairs(2, 8)), a = ab[0], b = ab[1], A = a * a, B = b * b;
    var bt = '\\left(\\frac{' + A + '}{' + B + '}\\right)^{-1/2}';
    return mc(r, t(bt) + ' is equal to', [
      { html: t('\\frac{' + b + '}{' + a + '}'), right: true },
      { html: t('\\frac{' + a + '}{' + b + '}'), why: 'The exponent is <b>negative</b>: flip the fraction first.' },
      { html: t('\\frac{' + B + '}{' + A + '}'), why: 'You flipped the fraction, but the denominator ' + t('2') + ' of the exponent also means a <b>square root</b>.' },
      { html: t('-\\frac{' + b + '}{' + a + '}'), why: 'A negative exponent means reciprocal — it never makes the answer negative.' }],
      t(bt + '=\\left(\\frac{' + B + '}{' + A + '}\\right)^{1/2}=\\frac{\\sqrt{' + B + '}}{\\sqrt{' + A + '}}=\\frac{' + b + '}{' + a + '}'), ['Negative exponent → flip the fraction. Denominator 2 → square root.'], 'MC ' + bt);
  }
  function q13(r) {
    var v = r.pick(['x', 'x', 'a', 'y', 'm']), mn = r.pick([[3, 4], [5, 4], [1, 4], [5, 6], [7, 4], [3, 8], [7, 6], [5, 8]]), m = mn[0], n = mn[1], h = Q(m, n / 2);
    var x = v, pr = x + '^{' + m + '/' + n + '}';
    return mc(r, '<i>(Multiple Choice)</i> Which expression is <b>not</b> equivalent to ' + t(pr) + '?', [
      { html: t(rootTex(m, x + '^{' + n + '}')), right: true },
      { html: t(rootTex(n, m === 1 ? x : x + '^{' + m + '}')), why: 'That one <i>is</i> equivalent: index ' + t(n) + ' (the denominator), power ' + t(m) + ' (the numerator).' },
      { html: t(m === 1 ? rootTex(n, x) : br(rootTex(n, x)) + '^{' + m + '}'), why: 'That one <i>is</i> equivalent: root first, then the power — same value.' },
      { html: t(br('\\sqrt{' + x + '}') + '^{' + eS(h) + '}'), why: 'That one <i>is</i> equivalent: ' + t('\\sqrt{' + x + '}=' + x + '^{1/2}') + ', and ' + t('\\left(' + x + '^{1/2}\\right)^{' + eS(h) + '}=' + x + '^{\\frac{1}{2}\\times ' + eF(h) + '}=' + pr) + '.' }],
      'The denominator ' + t(n) + ' is the index and the numerator ' + t(m) + ' is the power: ' + t(pr + '=' + rootTex(n, m === 1 ? x : x + '^{' + m + '}') + '=' + (m === 1 ? rootTex(n, x) : br(rootTex(n, x)) + '^{' + m + '}')) + '.<br>' + t(rootTex(m, x + '^{' + n + '}') + '=' + x + '^{' + n + '/' + m + '}') + ' has the index and the power swapped, so it is <b>not</b> equivalent.',
      ['Rewrite each choice as a power of ' + t(x) + ': ' + t('\\sqrt[n]{' + x + '^{m}}=' + x + '^{m/n}') + '.'], 'MC not equivalent to ' + pr);
  }
  function q14(r) {
    var g = pickWhere(r, function () { return [r.int(2, 12), r.int(2, 5)]; }, function (v) { return Math.pow(v[0] + v[1] * v[1], 2) <= 9999; }) || [4, 2];
    var a = g[0], b = g[1], X = a * a, Y = b * b * b, s = a + b * b, ans = s * s;
    var expr = '\\left(x^{1/2}+y^{2/3}\\right)^{2}';
    return P.nr('<i>(Numerical Response)</i> Find the exact value of ' + t(expr) + ' when ' + t('x=' + X) + ' and ' + t('y=' + Y) + '.', ans, function (v) {
      if (v === s) return { code: 'u2l9-no-square', hint: 'You have the value inside the brackets. Now square it — the outside exponent is ' + t('2') + '.' };
      if (v === X + Math.pow(b, 4)) return { code: 'u2l9-sq-terms', hint: 'Squaring a sum isn’t squaring each term. Work out the brackets first (' + t(a + '+' + b * b) + '), then square.' };
      if (v === Math.pow(a + b, 2)) return { code: 'root-only', hint: 'Check ' + t(Y + '^{2/3}') + ': the cube root is ' + t(b) + ', and then the numerator ' + t('2') + ' squares it.' };
      return null;
    }, t('x^{1/2}=' + X + '^{1/2}=\\sqrt{' + X + '}=' + a) + ' and ' + t('y^{2/3}=\\left(' + rootTex(3, Y) + '\\right)^{2}=' + b + '^{2}=' + b * b) + '.<br>' + t('\\left(' + a + '+' + b * b + '\\right)^{2}=' + s + '^{2}=' + ans) + '.',
      ['Substitute, then evaluate each power root first. Add inside the brackets before squaring.'], 'NR (x^1/2+y^2/3)^2 at ' + X + ',' + Y);
  }
  function q16(r) {
    var v = r.pick(['b', 'b', 'x', 'a', 'm', 'y', 'k']);
    var g = pickWhere(r, function () { return [r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [1, 5]]), r.pick([[1, 2], [1, 3], [1, 4], [1, 6], [1, 5], [2, 5], [3, 4]]), r.int(2, 5), r.int(2, 5)]; },
      function (x) { var e = qadd(x[0], x[1]); return x[0][1] !== x[1][1] && e[1] > 1 && e[0] < e[1] && x[2] + x[3] !== x[2] * x[3]; }) || [[1, 2], [1, 4], 2, 3];
    var a = Q(g[0]), b = Q(g[1]), c1 = g[2], c2 = g[3], C = c1 * c2, e = qadd(a, b), m = e[0], n = e[1];
    var pr = c1 + pw(v, a) + '\\times ' + c2 + pw(v, b), powT = C + pw(v, e), radT = C + rootTex(n, m === 1 ? v : v + '^{' + m + '}');
    var pchk = K.expo(powT, { form: 'power', diag: function (an) {
      if (anIs(an, mono(v, e, c1 + c2))) return { code: 'coef-added', hint: 'Multiply the coefficients: ' + t(c1 + '\\times ' + c2 + '=' + C) + '. (Only the exponents add.)' };
      if (anIs(an, mono(v, qmul(a, b), C))) return { code: 'mult', hint: H_MULT };
      if (anIs(an, mono(v, Q(a[0] + b[0], a[1] + b[1]), C))) return { code: 'add-den', hint: hAddDen(a, b) };
      return null;
    } });
    var rchk = convCheck(radT, { form: 'radical', index: n, cands: [[C + rootTex(m, v + '^{' + n + '}'), 'swap', 'The <b>denominator</b> ' + t(n) + ' is the index of the root and the <b>numerator</b> ' + t(m) + ' is the power.'], [(c1 + c2) + rootTex(n, m === 1 ? v : v + '^{' + m + '}'), 'coef-added', 'Multiply the coefficients: ' + t(c1 + '\\times ' + c2 + '=' + C) + '.'], [rootTex(n, C + (m === 1 ? v : v + '^{' + m + '}')), 'coef-inside', 'The exponent belongs to ' + t(v) + ' only, so ' + t(C) + ' stays <b>outside</b> the radical.']] });
    var p = P.fields(t(pr), [{ name: 'Power', label: 'power', before: t('='), mode: 'math', keys: 'expo', vars: [v] }, { name: 'Radical form', label: 'radical form', before: t('='), mode: 'math', keys: 'expo', vars: [v] }], [pchk, rchk], [powT, radT],
      t(pr + '=' + powT + '=' + radT),
      'Multiply the coefficients and <b>add</b> the exponents (product law):<br>' + t(pr + '=(' + c1 + '\\times ' + c2 + ')' + v + '^{' + expSum(a, b, '+').join('=') + '}') + ', so the power is ' + t(powT) + '.<br>Radical form — the denominator ' + t(n) + ' is the index, the numerator ' + t(m) + ' the power, and the ' + t(C) + ' stays outside: ' + t(powT + '=' + radT) + '.',
      ['Coefficients multiply; exponents add (common denominator).', 'In ' + t('x^{m/n}') + ' the denominator ' + t('n') + ' is the index of the root and ' + t('m') + ' is the power.'], '2-form product ' + pr);
    p.bad = [[(c1 + c2) + pw(v, e), radT], [powT, C + rootTex(m, v + '^{' + n + '}')]];
    return p;
  }

  /* ================= Extra Practice 9 ================= */
  function e9a(r, sh) {
    var c = sh.c, n = sh.n, m = sh.m, B = sh.B, v = Math.pow(c, m);
    var p = P.fields('Root first: ' + t(br(rootTex(n, F(B))) + '^{' + m + '}') + '. Fill in each step.', [{ name: 'Root', label: t(rootTex(n, F(B)) + '='), mode: 'number' }, { name: 'Power', label: 'then ' + t(br('\\ \\ ') + '^{' + m + '}='), mode: 'number' }],
      [K.number(c, function (x) { return near(x, B / n) ? { code: 'times-exp', hint: 'A ' + rootName(n) + ' root isn’t dividing by ' + t(n) + '. Which number, multiplied by itself ' + n + ' times, gives ' + t(F(B)) + '?' } : null; }),
        K.number(v, function (x) { return x === c * m ? { code: 'times-exp', hint: t(c + '^{' + m + '}') + ' means ' + t(c) + ' multiplied by itself ' + m + ' times, not ' + t(c + '\\times ' + m) + '.' } : null; })],
      [String(c), String(v)], t(rootTex(n, F(B)) + '=' + c) + ', then ' + t(c + '^{' + m + '}=' + F(v)),
      t(B + '^{' + m + '/' + n + '}=\\left(' + rootTex(n, F(B)) + '\\right)^{' + m + '}=' + c + '^{' + m + '}=' + F(v)) + '. Every number along the way is small.',
      ['Which number, raised to the power ' + t(n) + ', gives ' + t(F(B)) + '?'], 'root first ' + B + '^' + m + '/' + n);
    p.bad = [[String(c + 1), String(v)]].concat(c * m !== v ? [[String(c), String(c * m)]] : []);
    return p;
  }
  function e9b(r, sh) {
    var c = sh.c, n = sh.n, m = sh.m, B = sh.B, v = Math.pow(c, m), Bm = Math.pow(B, m);
    return mc(r, 'Power first means working out ' + t(rootTex(n, F(B) + '^{' + m + '}') + '=' + rootTex(n, F(Bm))) + '. It gives the same answer, ' + t(F(v)) + '. Why is rooting first the sensible habit?', [
      { html: 'Rooting first keeps every number small (' + t(c) + ' and ' + t(F(v)) + '), so it can be done in your head; power first needs the ' + rootName(n) + ' root of ' + t(F(Bm)) + '.', right: true },
      { html: 'Rooting first gives a more exact answer.', why: 'Both routes are exact and give ' + t(F(v)) + '. The difference is the size of the numbers.' },
      { html: 'Power first is not allowed: the root must always come first.', why: 'Both orders are allowed: ' + t('a^{m/n}=\\left(\\sqrt[n]{a}\\right)^{m}=\\sqrt[n]{a^{m}}') + '.' },
      { html: 'The root comes first because the denominator is written first.', why: 'The order you read the fraction in doesn’t matter. Root first is chosen because it keeps the numbers small.' }],
      'Both routes give ' + t(F(v)) + ', but root first uses only ' + t(rootTex(n, F(B)) + '=' + c) + ' and ' + t(c + '^{' + m + '}=' + F(v)) + '. Power first means finding the ' + rootName(n) + ' root of ' + t(F(Bm)) + ' — a much bigger number.', ['Compare the sizes of the numbers in the two routes.'], 'why root first ' + B + '^' + m + '/' + n);
  }
  function e15a(r, sh) {
    var B = sh.B, m = sh.m, n = sh.n, wv = ex.texRat(Q(Math.pow(B, m), n));
    return mc(r, 'What has Jamil confused?', [
      { html: 'He used the denominator ' + t(n) + ' as a <b>divisor</b>. In an exponent the denominator is the <b>index of a root</b>: ' + t(B + '^{' + m + '/' + n + '}=\\left(' + rootTex(n, B) + '\\right)^{' + m + '}') + '.', right: true },
      { html: 'He should have divided first and then raised to the power: ' + t('\\left(\\frac{' + B + '}{' + n + '}\\right)^{' + m + '}') + '.', why: 'There is no division at all in ' + t(B + '^{' + m + '/' + n + '}') + ': the ' + t(n) + ' means a ' + rootName(n) + ' root.' },
      { html: 'He raised ' + t(B) + ' to the wrong power: it should be ' + t(B + '^{' + n + '}') + ', not ' + t(B + '^{' + m + '}') + '.', why: 'The numerator ' + t(m) + ' is the power, so ' + t(B + '^{' + m + '}') + ' was fine. The problem is what he did with the ' + t(n) + '.' },
      { html: 'Nothing — ' + t(B + '^{' + m + '/' + n + '}=' + wv) + '.', why: 'Check: ' + t(B + '^{' + m + '/' + n + '}') + ' should be a whole number, since ' + t(rootTex(n, B) + '=' + sh.c) + '.' }],
      'The denominator of a rational exponent is the <b>index of a root</b>, not a divisor: ' + t(B + '^{' + m + '/' + n + '}=\\left(' + rootTex(n, B) + '\\right)^{' + m + '}=' + sh.c + '^{' + m + '}=' + Math.pow(sh.c, m)) + ', not ' + t(wv) + '.', ['In ' + t('a^{m/n}') + ', what does the denominator ' + t('n') + ' tell you to do?'], 'Jamil error ' + B + '^' + m + '/' + n);
  }
  function e16a(r, sh) {
    var c = sh.c, n = sh.n, m = sh.m, B = Math.pow(c, n), PP = Math.pow(B, m), v = Math.pow(c, m);
    return P.number('Finish Priya’s method: ' + t(rootTex(n, F(PP)) + '=\\,?') + ' (Hint: try raising small numbers to the power ' + t(n) + '.)', v, function (x) {
      if (near(x, PP / n)) return { code: 'times-exp', hint: 'A ' + rootName(n) + ' root isn’t dividing by ' + t(n) + '. Which number, raised to the power ' + t(n) + ', gives ' + t(F(PP)) + '?' };
      if (x === c) return { code: 'root-only', hint: t(c + '^{' + n + '}=' + F(B)) + ', not ' + t(F(PP)) + '. Try a bigger number.' };
      return null;
    }, t(F(v) + '^{' + n + '}=' + F(PP)) + ', so ' + t(rootTex(n, F(PP)) + '=' + F(v)) + '. Her method works — it just needs big numbers.', ['Since ' + t(F(PP) + '=' + F(B) + '^{' + m + '}=\\left(' + c + '^{' + n + '}\\right)^{' + m + '}=' + c + '^{' + n * m + '}') + ', the ' + rootName(n) + ' root is ' + t(c + '^{' + m + '}') + '.'], 'Priya ' + rootName(n) + ' root of ' + PP, { before: t(rootTex(n, F(PP)) + '=') });
  }
  function e16b(r, sh) {
    var c = sh.c, n = sh.n, m = sh.m, B = Math.pow(c, n), v = Math.pow(c, m);
    var p = P.fields('Now redo ' + t(F(B) + '^{' + m + '/' + n + '}') + ' the short way: root first.', [{ name: 'Root', label: t(rootTex(n, F(B)) + '='), mode: 'number' }, { name: 'Power', label: 'then ' + t(br('\\ \\ ') + '^{' + m + '}='), mode: 'number' }],
      [K.number(c, function (x) { return near(x, B / n) ? { code: 'times-exp', hint: 'A ' + rootName(n) + ' root isn’t dividing by ' + t(n) + '.' } : null; }), K.number(v, function (x) { return x === c * m ? { code: 'times-exp', hint: t(c + '^{' + m + '}') + ' means ' + t(c) + ' multiplied by itself ' + m + ' times.' } : null; })],
      [String(c), String(v)], t(rootTex(n, F(B)) + '=' + c) + ', then ' + t(c + '^{' + m + '}=' + F(v)), t(F(B) + '^{' + m + '/' + n + '}=\\left(' + rootTex(n, F(B)) + '\\right)^{' + m + '}=' + c + '^{' + m + '}=' + F(v)) + ' — the same answer, with no large numbers.',
      ['What number raised to the power ' + t(n) + ' gives ' + t(F(B)) + '?'], 'Priya short way ' + B + '^' + m + '/' + n);
    p.bad = c * m !== v ? [[String(c), String(c * m)]] : [[String(c + 1), String(v)]];
    return p;
  }
  /* 17(a): x^a = ⁿ√(x^m) */
  function e17a(r) {
    var mn = r.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [3, 7], [5, 8], [3, 8], [4, 7], [5, 3], [7, 4], [5, 2], [7, 2]]), m = mn[0], n = mn[1], v = r.pick(['x', 'x', 'y', 'm']);
    var rad = rootTex(n, v + '^{' + m + '}');
    var p = P.fraction(t(v + '^{a}=' + rad), [m, n], { before: t('a='), diag: function (x) {
      if (near(x, n / m)) return { code: 'swap', hint: 'The <b>index</b> ' + t(n) + ' becomes the <b>denominator</b> of the exponent; the power ' + t(m) + ' inside becomes the numerator.' };
      if (near(x, m * n)) return { code: 'times-exp', hint: 'A root divides the exponent: ' + t(rootTex(n, v + '^{' + m + '}') + '=' + v + '^{' + m + '/' + n + '}') + '.' };
      if (near(x, m)) return { code: 'no-root', hint: 'Don’t forget the root: the index ' + t(n) + ' goes in the denominator.' };
      return null;
    } }, 'Index → denominator, power → numerator: ' + t(rad + '=' + v + '^{' + m + '/' + n + '}') + ', so ' + t('a=\\frac{' + m + '}{' + n + '}') + '.', convHints.slice(0, 1), 'x^a = root ' + m + '/' + n);
    p.bad = [n + '/' + m, String(m)];
    return p;
  }
  /* 17(b)/(d): b^n = value, b and value powers of one base c */
  function e17bd(r, neg) {
    var pool = neg ? [[3, 3, 1], [2, 3, 1], [2, 4, 1], [2, 4, 3], [2, 3, 2], [2, 5, 1], [2, 5, 2], [2, 5, 3], [3, 4, 1], [3, 4, 3], [3, 2, 1], [3, 2, 3], [5, 2, 1], [5, 3, 1], [5, 3, 2], [2, 2, 3], [2, 6, 2], [2, 6, 1]]
      : [[2, 4, 3], [2, 3, 2], [2, 2, 3], [3, 2, 3], [3, 3, 2], [2, 5, 3], [2, 3, 5], [3, 4, 3], [2, 4, 5], [5, 2, 3], [5, 3, 2], [2, 6, 4], [2, 4, 6], [3, 4, 2], [2, 6, 3]];
    var g = r.pick(pool), c = g[0], k = g[1], j = g[2], b = Math.pow(c, k), val = neg ? [1, Math.pow(c, j)] : [Math.pow(c, j), 1], ans = Q(neg ? -j : j, k);
    var vt = neg ? '\\dfrac{1}{' + Math.pow(c, j) + '}' : String(Math.pow(c, j));
    var p = P.fraction(t(b + '^{n}=' + vt), ans, { before: t('n='), diag: function (x) {
      if (neg && near(x, -qv(ans))) return { code: 'no-recip', hint: 'The answer is a fraction ' + t('\\frac{1}{' + Math.pow(c, j) + '}') + ', so the exponent must be <b>negative</b>.' };
      if (near(x, k / j) || near(x, -k / j)) return { code: 'swap', hint: 'Write both as powers of ' + t(c) + ': ' + t(b + '=' + c + '^{' + k + '}') + '. Then ' + t('\\left(' + c + '^{' + k + '}\\right)^{n}=' + c + '^{' + (neg ? '-' : '') + j + '}') + ', so ' + t(k + 'n=' + (neg ? '-' : '') + j) + '.' };
      if (near(x, qv(val) / b)) return { code: 'u2l9-divided', hint: 'The exponent isn’t found by dividing the numbers. Write both sides as powers of ' + t(c) + ' and match the exponents.' };
      return null;
    } }, 'Write both sides as powers of ' + t(c) + ': ' + t(b + '=' + c + '^{' + k + '}') + ' and ' + t(vt + '=' + c + '^{' + (neg ? '-' : '') + j + '}') + '.<br>' + t('\\left(' + c + '^{' + k + '}\\right)^{n}=' + c + '^{' + k + 'n}') + ', so ' + t(k + 'n=' + (neg ? '-' : '') + j) + ' and ' + t('n=' + eF(ans)) + '.<br>Check: ' + t(b + '^{' + eS(ans) + '}=' + (neg ? '\\frac{1}{' + br(rootTex(k, b)) + '^{' + j + '}}=\\frac{1}{' + c + '^{' + j + '}}=' + vt : br(rootTex(k, b)) + '^{' + j + '}=' + c + '^{' + j + '}=' + vt)) + ' ✓',
      ['Write ' + t(b) + ' and ' + t(vt) + ' as powers of the same base.', neg ? 'A fraction ' + t('\\frac{1}{c^{j}}') + ' is ' + t('c^{-j}') + ': the exponent is negative.' : 'The denominator of ' + t('n') + ' undoes the power in the base; the numerator builds the answer.'], 'solve ' + b + '^n=' + (neg ? '1/' : '') + Math.pow(c, j));
    p.bad = [eS(Q(k, j)), String(qv(val) / b)];
    return p;
  }
  var ORD = [['9^{1/2}', 3], ['27^{2/3}', 9], ['16^{3/4}', 8], ['81^{1/4}', 3], ['8^{2/3}', 4], ['4^{3/2}', 8], ['32^{2/5}', 4], ['16^{1/2}', 4], ['64^{1/3}', 4], ['25^{1/2}', 5], ['125^{2/3}', 25], ['27^{1/3}', 3],
    ['32^{3/5}', 8], ['64^{1/2}', 8], ['8^{1/3}', 2], ['16^{1/4}', 2], ['4^{1/2}', 2], ['81^{3/4}', 27], ['9^{3/2}', 27], ['64^{2/3}', 16], ['16^{5/4}', 32], ['4^{5/2}', 32], ['36^{1/2}', 6], ['8^{4/3}', 16], ['125^{1/3}', 5]];
  function ordWork(s) { var m = /^(\d+)\^\{(\d+)\/(\d+)\}$/.exec(s[0]), B = +m[1], k = +m[2], n = +m[3], c = iroot(B, n); return s[0] + '=' + (k === 1 ? rootTex(n, B) : br(rootTex(n, B)) + '^{' + k + '}' + '=' + c + '^{' + k + '}') + '=' + s[1]; }
  function ordShared(r) {
    return pickWhere(r, function () { return r.sample(ORD, 4); }, function (s) { var v = s.map(function (x) { return x[1]; }), d = v.filter(function (x, i) { return v.indexOf(x) === i; }); return d.length === 3; }) || [ORD[0], ORD[1], ORD[2], ORD[3]];
  }
  function e18b(r, sh) {
    var it = sh.items;
    var p = P.fields('Evaluate each power.', it.map(function (x, i) { return { name: t(x[0]), label: t(x[0] + '='), mode: 'number' }; }),
      it.map(function (x) { var m = /^(\d+)\^\{(\d+)\/(\d+)\}$/.exec(x[0]), B = +m[1], k = +m[2], n = +m[3]; return K.number(x[1], function (y) { return near(y, B * k / n) ? { code: 'times-exp', hint: 'The exponent isn’t a multiplier: in ' + t(x[0]) + ' the denominator is the index of the root and the numerator the power.' } : (k > 1 && y === iroot(B, n)) ? { code: 'root-only', hint: 'In ' + t(x[0]) + ' you took the root; now raise it to the power ' + t(k) + '.' } : null; }); }),
      it.map(function (x) { return String(x[1]); }), it.map(function (x) { return t(x[0] + '=' + x[1]); }).join(', '), it.map(function (x) { return t(ordWork(x)); }).join('<br>'),
      ['Root first (the denominator), then the power (the numerator).'], 'evaluate ' + it.map(function (x) { return x[0]; }).join(', '));
    p.bad = [it.map(function (x) { return String(x[1] + 1); })];
    return p;
  }
  function e18c(r, sh) {
    var it = sh.items.map(function (x, i) { return { id: 'o' + i, tex: x[0], v: x[1] }; }), sorted = it.slice().sort(function (a, b) { return a.v - b.v; });
    var p = P.order(r, 'Now arrange the four powers from <b>least to greatest</b>. Two of them are equal — put those two next to each other (either order).', sorted, {}, sorted.map(function (x) { return t(x.tex + '=' + x.v); }).join(', ') + '.<br>So ' + t(sorted.map(function (x, i) { return x.tex + (i < 3 ? (x.v === sorted[i + 1].v ? '=' : '<') : ''); }).join('')) + '.',
      ['Evaluate each power first, then compare the values.'], 'order ' + it.map(function (x) { return x.tex; }).join(', '));
    var byId = {}; it.forEach(function (x) { byId[x.id] = x; });
    p.check = function (resp) {
      if (!resp || resp.length < it.length) return form('incomplete', 'Tap every item to place it in order (' + (resp ? resp.length : 0) + ' of ' + it.length + ' placed).');
      for (var j = 0; j + 1 < resp.length; j++) { var a = byId[resp[j]], b = byId[resp[j + 1]]; if (!a || !b) return wrong('order', null); if (a.v > b.v) return wrong('order', t(a.tex) + ' and ' + t(b.tex) + ' are in the wrong order. Evaluate both: ' + t(a.tex + '=' + a.v) + ' and ' + t(b.tex + '=' + b.v) + '.'); }
      return ok();
    };
    var eqs = sorted.map(function (x, i) { return i; }).filter(function (i) { return i < 3 && sorted[i].v === sorted[i + 1].v; })[0];
    var alt = sorted.map(function (x) { return x.id; }); var tmp = alt[eqs]; alt[eqs] = alt[eqs + 1]; alt[eqs + 1] = tmp;
    p.good = [alt];
    return p;
  }
  function e19a(r) {
    var pr = pickWhere(r, function () { return r.sample(ORD, 2); }, function (s) { return s[0][1] !== s[1][1] && s[0][0].split('^')[0] !== s[1][0].split('^')[0]; }) || [ORD[4], ORD[5]];
    var A = pr[0], B = pr[1], big = A[1] > B[1] ? A : B, sm = big === A ? B : A;
    return mc(r, 'Without a calculator, which is greater: ' + t(A[0]) + ' or ' + t(B[0]) + '?', [
      { html: t(big[0]) + ' is greater: ' + t(big[0] + '=' + big[1]) + ' and ' + t(sm[0] + '=' + sm[1]) + '.', right: true },
      { html: t(sm[0]) + ' is greater, because its base is ' + (+sm[0].split('^')[0] > +big[0].split('^')[0] ? 'bigger.' : 'smaller.'), why: 'Evaluate both: ' + t(sm[0] + '=' + sm[1]) + ' and ' + t(big[0] + '=' + big[1]) + '. The base alone doesn’t decide it.' },
      { html: 'They are equal.', why: 'Evaluate both, root first: ' + t(A[0] + '=' + A[1]) + ' and ' + t(B[0] + '=' + B[1]) + '.' },
      { html: 'You can’t tell without a calculator.', why: 'Both are perfect powers: take the root first, then the power. ' + t(A[0] + '=' + A[1]) + ', ' + t(B[0] + '=' + B[1]) + '.' }],
      t(ordWork(A)) + '<br>' + t(ordWork(B)) + '<br>So ' + t(big[0]) + ' is greater.', ['Evaluate each one root first.'], 'compare ' + A[0] + ' and ' + B[0]);
  }
  function e19b(r) {
    var g = r.pick([[2, 2, [5, 6]], [2, 2, [3, 4]], [2, 3, [2, 9]], [3, 2, [3, 4]], [2, 2, [1, 6]], [2, 3, [5, 6]], [3, 2, [5, 6]], [2, 4, [3, 8]], [5, 2, [3, 4]], [2, 2, [7, 6]], [3, 3, [2, 9]], [2, 3, [4, 9]], [2, 4, [5, 12]], [3, 2, [1, 4]]]);
    var c = g[0], k = g[1], e = Q(g[2]), B = Math.pow(c, k), want = qmul(k, e);
    var p = P.fraction('Show that ' + t(c + '^{' + eS(want) + '}') + ' and ' + t(B + '^{' + eS(e) + '}') + ' are equal: write ' + t(B + '^{' + eS(e) + '}') + ' as a power of ' + t(c) + ', ' + t(B + '^{' + eS(e) + '}=' + c + '^{n}') + '. What is ' + t('n') + '?', want, { before: t('n='), diag: function (x) {
      if (near(x, qv(e))) return { code: 'exponent', hint: 'The base changed from ' + t(B) + ' to ' + t(c) + ', so the exponent must change too: ' + t(B + '=' + c + '^{' + k + '}') + '.' };
      if (near(x, k + qv(e))) return { code: 'law-added', hint: 'A power of a power: <b>multiply</b> the exponents, ' + t(k + '\\times ' + eF(e)) + '.' };
      return null;
    } }, t(B + '^{' + eS(e) + '}=\\left(' + c + '^{' + k + '}\\right)^{' + eS(e) + '}=' + c + '^{' + k + '\\times ' + eF(e) + '}=' + c + '^{' + eF(qmul(k, e)) + '}') + ', which is ' + t(c + '^{' + eS(want) + '}') + '. They are equal.', ['Write ' + t(B) + ' as a power of ' + t(c) + ', then use the power of a power law.'], B + '^' + eS(e) + ' as power of ' + c);
    p.bad = [eS(e)];
    return p;
  }
  function e20(r) {
    var mn = r.pick([[5, 3], [4, 3], [7, 4], [5, 4], [7, 3], [5, 2], [7, 2], [9, 4], [8, 3], [7, 5]]), m = mn[0], n = mn[1], v = r.pick(['a', 'a', 'x', 'm']), pr = v + '^{' + m + '/' + n + '}', rest = Q(m - n, n);
    return mc(r, '<i>(Multiple Choice)</i> Which expression is <b>not</b> equivalent to ' + t(pr) + '?', [
      { html: t(br(rootTex(m, v)) + '^{' + n + '}'), right: true },
      { html: t(rootTex(n, v + '^{' + m + '}')), why: 'That one <i>is</i> equivalent: index ' + t(n) + ', power ' + t(m) + '.' },
      { html: t(br(rootTex(n, v)) + '^{' + m + '}'), why: 'That one <i>is</i> equivalent: root first, then the power.' },
      { html: t(v + '\\times ' + pw(v, rest)), why: 'That one <i>is</i> equivalent: ' + t(v + '^{1}\\times ' + pw(v, rest) + '=' + v + '^{' + expSum([1, 1], rest, '+').slice(-1)[0] + '}') + '.' }],
      t(br(rootTex(m, v)) + '^{' + n + '}=' + v + '^{' + n + '/' + m + '}') + ' — the index and the power are swapped, so it is <b>not</b> equivalent to ' + t(pr) + '.', ['Rewrite each choice as a power of ' + t(v) + '.'], 'MC not equivalent to ' + pr);
  }
  function e21c(r, sh) {
    var pair = r.sample([2, 3, 4, 5, 6, 7, 8, 9, 10], 2).sort(function (a, b) { return a - b; }), s1 = pair[0], s2 = pair[1], V1 = s1 * s1 * s1, V2 = s2 * s2 * s2;
    function ck(s, V) { return K.number(6 * s * s, function (x) { return x === s * s ? { code: 'six-faces', hint: 'That’s one face: ' + t(V + '^{2/3}=' + s * s) + '. Multiply by ' + t(6) + '.' } : x === 6 * s ? { code: 'not-squared', hint: 'The formula has ' + t('V^{2/3}') + ', which is the edge <b>squared</b>.' } : near(x, 6 * Math.pow(V, 1.5)) ? { code: 'swap', hint: 'It’s ' + t('V^{2/3}') + ' — cube root, then square.' } : null; }); }
    var p = P.fields('Use your formula to find the surface area when ' + t('V=' + F(V1)) + ' and when ' + t('V=' + F(V2)) + '.', [{ name: 'V = ' + V1, label: 'when ' + t('V=' + F(V1)) + ', ' + t('S='), after: 'cm²', mode: 'number' }, { name: 'V = ' + V2, label: 'when ' + t('V=' + F(V2)) + ', ' + t('S='), after: 'cm²', mode: 'number' }],
      [ck(s1, V1), ck(s2, V2)], [String(6 * s1 * s1), String(6 * s2 * s2)], t(F(6 * s1 * s1)) + ' cm² and ' + t(F(6 * s2 * s2)) + ' cm²',
      t('S=6V^{2/3}') + '.<br>' + t('V=' + F(V1) + ':\\ S=6\\left(' + rootTex(3, F(V1)) + '\\right)^{2}=6(' + s1 + '^{2})=6(' + s1 * s1 + ')=' + F(6 * s1 * s1)) + ' cm²<br>' + t('V=' + F(V2) + ':\\ S=6\\left(' + rootTex(3, F(V2)) + '\\right)^{2}=6(' + s2 + '^{2})=6(' + s2 * s2 + ')=' + F(6 * s2 * s2)) + ' cm²',
      ['Cube root first, then square, then multiply by 6.'], 'cube SA from V=' + V1 + ',' + V2);
    p.bad = [[String(s1 * s1), String(s2 * s2)], [String(6 * s1), String(6 * s2)]];
    return p;
  }
  /* 22: (a x^{1/2} ± b x^{-1/2})^2 */
  function e22shared(r) { var a = r.pick([1, 1, 1, 2, 3]), b = r.pick([1, 1, 2, 3]), s = r.pick([1, 1, -1]); return { a: a, b: b, s: s, x: r.pick([4, 9, 16, 25, 36, 49, 64, 100]) }; }
  function e22stem(sh) { return 'Let ' + t('x>0') + ' and consider ' + t(e22tex(sh)) + '.'; }
  function cf(k, v) { return (k === 1 ? '' : k) + v; }
  function e22tex(sh) { return '\\left(' + cf(sh.a, 'x^{1/2}') + (sh.s < 0 ? '-' : '+') + cf(sh.b, 'x^{-1/2}') + '\\right)^{2}'; }
  function e22a(r, sh) {
    var a = sh.a, b = sh.b, s = sh.s, A2 = a * a, B2 = b * b, mid = 2 * a * b * s;
    var tgt = cf(A2, 'x') + (mid < 0 ? '-' : '+') + Math.abs(mid) + '+\\frac{' + B2 + '}{x}', tp = ex.parse(tgt).ast;
    var W = [[cf(A2, 'x') + '+\\frac{' + B2 + '}{x}', 'u2l9-sq-terms', 'Squaring a sum isn’t squaring each term: ' + t('(p+q)^{2}=p^{2}+2pq+q^{2}') + '. The middle term ' + t('2pq') + ' is missing.'],
      [cf(A2, 'x') + (mid < 0 ? '+' : '-') + Math.abs(mid) + '+\\frac{' + B2 + '}{x}', 'u2l9-mid-sign', 'Check the sign of the middle term ' + t('2pq') + '.'],
      [cf(A2, 'x') + (mid < 0 ? '-' : '+') + Math.abs(mid / 2) + '+\\frac{' + B2 + '}{x}', 'u2l9-mid-term', 'The middle term is ' + t('2pq') + ' — don’t forget the ' + t('2') + '.'],
      [cf(A2, 'x') + (mid < 0 ? '-' : '+') + Math.abs(mid) + 'x+\\frac{' + B2 + '}{x}', 'u2l9-mid-term', 'Simplify the middle term: ' + t('x^{1/2}\\cdot x^{-1/2}=x^{0}=1') + '.']]
      .map(function (w) { return { tex: w[0], ast: ex.parse(w[0]).ast, code: w[1], hint: w[2] }; });
    var check = function (resp) {
      var A = K.read(resp); if (A.res) return A.res;
      var sv = varsOf(A.ast).filter(function (v) { return v !== 'x'; }); if (sv.length) return wrong('var', 'Your answer has a letter ' + t(sv[0]) + ' that isn’t in the question.');
      if (ex.equiv(A.ast, tp, ['x'], 6)) {
        var bad = null;
        (function w(x) { if (!x || typeof x !== 'object' || bad) return; if (x.t === 'pow') { var b0 = strip(x.a); if (b0.t === 'add' || b0.t === 'sub') bad = 'u2l9-expand'; else { var e = ex.rat(x.b); if (!e) bad = 'exp-form'; else if (e[1] !== 1) bad = 'exp-form'; else if (e[0] <= 0) bad = 'neg-exp'; } } kids(x).forEach(w); })(A.ast);
        if (bad === 'u2l9-expand') return form('u2l9-expand', 'Right value — now expand the brackets: ' + t('(p+q)^{2}=p^{2}+2pq+q^{2}') + '.');
        if (bad === 'exp-form') return form('exp-form', 'Right value — now simplify each term so no fractional exponents are left, e.g. ' + t('\\left(x^{1/2}\\right)^{2}=x') + '.');
        if (bad === 'neg-exp') return form('neg-exp', 'Right value — write the last term with a positive exponent: ' + t('x^{-1}=\\frac{1}{x}') + '.');
        var n = 0; (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'add' || x.t === 'sub') { n++; } kids(x).forEach(w); })(strip(A.ast));
        if (n > 2) return form('simplify', 'Right value — now collect the terms into three: an ' + t('x') + ' term, a number and a ' + t('\\frac{1}{x}') + ' term.');
        return ok();
      }
      for (var i = 0; i < W.length; i++) if (ex.equiv(A.ast, W[i].ast, ['x'], 6)) return wrong(W[i].code, W[i].hint);
      return wrong('value', null);
    };
    var pT = cf(a, 'x^{1/2}'), qT = (s < 0 ? '-' : '') + cf(b, 'x^{-1/2}');
    var p = P.math('Expand ' + t(e22tex(sh)) + ' and simplify, with positive exponents only.', check, tgt,
      'Use ' + t('(p+q)^{2}=p^{2}+2pq+q^{2}') + ' with ' + t('p=' + pT) + ' and ' + t('q=' + qT) + ':<br>' + t('p^{2}=' + (a === 1 ? '' : a + '^{2}') + '\\left(x^{1/2}\\right)^{2}=' + cf(A2, 'x')) + '<br>' + t('2pq=2(' + pT + ')(' + qT + ')=' + mid + 'x^{0}=' + mid) + '<br>' + t('q^{2}=' + (b === 1 ? '' : b + '^{2}') + '\\left(x^{-1/2}\\right)^{2}=' + cf(B2, 'x^{-1}') + '=\\frac{' + B2 + '}{x}') + '<br>So ' + t(e22tex(sh) + '=' + tgt) + '.',
      ['Write it as ' + t('(p+q)(p+q)') + ' or use ' + t('(p+q)^{2}=p^{2}+2pq+q^{2}') + '.', 'Power of a power: ' + t('\\left(x^{1/2}\\right)^{2}=x') + '. Product law: ' + t('x^{1/2}\\cdot x^{-1/2}=x^{0}=1') + '.'], 'expand ' + e22tex(sh), { keys: 'expo', vars: ['x'] });
    p.bad = W.map(function (w) { return w.tex; }).concat([e22tex(sh)]);
    return p;
  }
  function e22b(r, sh) {
    var a = sh.a, b = sh.b, s = sh.s, x = sh.x, rx = Math.sqrt(x), inner = Q(a * rx * rx + s * b, rx), val = qmul(inner, inner);
    var lin = Q(a * a * x * x + 2 * a * b * s * x + b * b, x);
    return P.fraction('Evaluate ' + t(e22tex(sh)) + ' when ' + t('x=' + x) + '. (Use part (a), or substitute into the brackets first — both give the same answer.)', val, { diag: function (v) {
      if (near(v, qv(inner))) return { code: 'u2l9-no-square', hint: 'That’s the value inside the brackets. Square it.' };
      if (near(v, a * a * x + b * b / x)) return { code: 'u2l9-sq-terms', hint: 'Don’t lose the middle term ' + t('2pq') + '.' };
      return null;
    } }, 'Part (a): ' + t(cf(a * a, 'x') + (s < 0 ? '-' : '+') + 2 * a * b + '+\\frac{' + b * b + '}{x}') + ' at ' + t('x=' + x) + ': ' + t(a * a * x + (s < 0 ? '-' : '+') + 2 * a * b + '+\\frac{' + b * b + '}{' + x + '}=' + eF(lin)) + '.<br>Check, brackets first: ' + t(cf(a, x + '^{1/2}') + (s < 0 ? '-' : '+') + cf(b, x + '^{-1/2}') + '=' + (a === 1 ? '' : a + '\\cdot ') + rx + (s < 0 ? '-' : '+') + '\\frac{' + b + '}{' + rx + '}=' + eF(inner)) + ', and ' + t('\\left(' + eF(inner) + '\\right)^{2}=' + eF(val)) + ' ✓',
      ['Substitute into the simplified form from part (a).', t('x^{-1/2}=\\frac{1}{\\sqrt{x}}') + '.'], 'evaluate at x=' + x);
  }

  var EXTRA = [
    { num: '1', section: 'Extra practice A — Converting both ways', stem: 'Assume every variable represents a positive number. Write each power as an equivalent radical. Every numerator here is larger than ' + t('1') + '.', parts: [
      { id: 'e1a', level: 'EMG', make: function (r) { var mn = r.pick([[3, 4], [2, 3], [3, 5], [2, 5], [4, 5], [5, 6], [3, 8]]); return genRad(r.pick(['x', 'x', 'a', 'z']), mn[0], mn[1], 'entire'); } },
      { id: 'e1b', level: 'EMG', make: function (r) { return genRad(r.pick(['y', 'y', 'b', 'h']), r.pick([3, 5, 7, 9]), 2, 'entire'); } },
      { id: 'e1c', level: 'EMG', make: function (r) { var mn = r.pick([[4, 7], [2, 7], [3, 7], [5, 7], [6, 7], [4, 9], [2, 9]]); return genRad(r.pick(['m', 'm', 'k', 'p']), mn[0], mn[1], 'entire'); } },
      { id: 'e1d', level: 'EMG', make: function (r) { var mn = r.pick([[7, 3], [5, 3], [4, 3], [5, 4], [7, 4], [6, 5], [7, 5]]); return genRad(r.pick(['n', 'n', 'q', 'w']), mn[0], mn[1], 'entire'); } }] },
    { num: '2', stem: 'Write each radical as a power with a rational exponent.', parts: [
      { id: 'e2a', level: 'EMG', make: function (r) { var mn = r.pick([[2, 5], [3, 5], [4, 5], [2, 3], [3, 4], [2, 7]]), v = r.pick(['a', 'a', 'x', 'p']); return toPowPart(v, mn[0], mn[1], rootTex(mn[1], v + '^{' + mn[0] + '}')); } },
      { id: 'e2b', level: 'EMG', make: function (r) { var mn = r.pick([[7, 3], [5, 3], [4, 3], [8, 3], [5, 4], [7, 4]]), v = r.pick(['b', 'b', 'y', 'q']); return toPowPart(v, mn[0], mn[1], rootTex(mn[1], v + '^{' + mn[0] + '}')); } },
      { id: 'e2c', level: 'EMG', make: function (r) { var mn = r.pick([[5, 8], [3, 8], [7, 8], [5, 6], [3, 7], [5, 9]]), v = r.pick(['c', 'c', 'm', 'z']); return toPowPart(v, mn[0], mn[1], rootTex(mn[1], v + '^{' + mn[0] + '}')); } },
      { id: 'e2d', level: 'EMG', make: function (r) { var m = r.pick([3, 5, 7, 9, 11]), v = r.pick(['d', 'd', 'k', 'w']); return toPowPart(v, m, 2, '\\sqrt{' + v + '^{' + m + '}}'); } }] },
    { num: '3', stem: 'Convert each expression to the other form. A negative exponent still means “reciprocal”, exactly as in Lesson 6.', parts: [
      { id: 'e3a', level: 'PRG', make: function (r) { var mn = r.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 3], [5, 3]]); return genRad(r.pick(['p', 'p', 'x', 'm']), -mn[0], mn[1], 'entire'); } },
      { id: 'e3b', level: 'PRG', make: function (r) { var mn = r.pick([[5, 4], [7, 4], [3, 2], [5, 2], [7, 3], [5, 3]]); return genRad(r.pick(['q', 'q', 'y', 'n']), -mn[0], mn[1], 'entire'); } },
      { id: 'e3c', level: 'PRG', make: function (r) { var mn = r.pick([[3, 4], [2, 3], [2, 5], [4, 5], [3, 5]]), v = r.pick(['r', 'r', 'a', 'k']); return toPowPart(v, -mn[0], mn[1], '\\dfrac{1}{' + rootTex(mn[1], v + '^{' + mn[0] + '}') + '}'); } },
      { id: 'e3d', level: 'PRG', make: function (r) { var mn = r.pick([[5, 6], [5, 7], [3, 7], [7, 8], [5, 8]]), v = r.pick(['s', 's', 'b', 'w']); return toPowPart(v, -mn[0], mn[1], '\\dfrac{1}{' + rootTex(mn[1], v + '^{' + mn[0] + '}') + '}'); } }] },
    { num: '4', stem: 'Write each power as a radical. Watch carefully whether the coefficient is <b>inside</b> the base or not.', parts: [
      { id: 'e4a', level: 'PRG', make: function (r) { return coefRad(r.pick(['x', 'x', 'y']), r.int(2, 9), 1, r.pick([2, 3, 4, 5])); } },
      { id: 'e4b', level: 'PRG', make: function (r) { return bracketRad(r.pick(['x', 'x', 'y']), r.int(2, 9), 1, r.pick([2, 3, 4, 5]), { noExpand: true }); } },
      { id: 'e4c', level: 'PRG', make: function (r) { var mn = r.pick([[3, 5], [2, 3], [3, 4], [2, 5], [4, 5]]); return coefRad(r.pick(['w', 'w', 'm']), r.int(2, 7), mn[0], mn[1]); } },
      { id: 'e4d', level: 'PRG', make: function (r) { var v = r.pick([[2, 3, 5], [2, 2, 3], [3, 2, 3], [2, 3, 4], [5, 2, 3], [3, 2, 5], [2, 4, 5], [4, 2, 3]]); return bracketRad(r.pick(['w', 'w', 'm']), v[0], v[1], v[2], { noExpand: true }); } }] },
    { num: '5', section: 'Extra practice B — Evaluating: root first, then power', stem: 'Evaluate without a calculator. Take the root first — the numbers stay small.', parts: [
      { id: 'e5a', level: 'EMG', make: function (r) { var c = r.int(2, 10); return EV({ base: [c * c * c, 1], m: 2, n: 3 }); } },
      { id: 'e5b', level: 'EMG', make: function (r) { var cm = r.pick([[2, 3], [3, 3], [2, 5], [10, 3], [5, 3], [2, 7]]); return EV({ base: [Math.pow(cm[0], 4), 1], m: cm[1], n: 4 }); } },
      { id: 'e5c', level: 'EMG', make: function (r) { var cm = r.pick([[2, 2], [2, 3], [3, 2], [2, 4], [10, 2]]); return EV({ base: [Math.pow(cm[0], 5), 1], m: cm[1], n: 5 }); } },
      { id: 'e5d', level: 'EMG', make: function (r) { var cm = r.pick([[3, 3], [2, 3], [2, 5], [5, 3], [3, 5]]); return EV({ base: [Math.pow(cm[0], 4), 1], m: cm[1], n: 4 }); } }] },
    { num: '6', stem: 'Evaluate without a calculator.', parts: [
      { id: 'e6a', level: 'PRG', make: function (r) { var cm = r.pick([[5, 4], [2, 4], [3, 4], [2, 5], [4, 4], [3, 5], [2, 7], [10, 4], [6, 4], [4, 5], [2, 8]]); return EV({ base: [Math.pow(cm[0], 3), 1], m: cm[1], n: 3 }); } },
      { id: 'e6b', level: 'PRG', make: function (r) { var cm = r.pick([[2, 5], [2, 1], [2, 7], [3, 1], [2, 3], [3, 5]]); return EV({ base: [Math.pow(cm[0], 6), 1], m: cm[1], n: 6 }); } },
      { id: 'e6c', level: 'PRG', make: function (r) { var cm = r.pick([[3, 3], [3, 2], [2, 3], [2, 4], [3, 4], [2, 6]]); return EV({ base: [Math.pow(cm[0], 5), 1], m: cm[1], n: 5 }); } },
      { id: 'e6d', level: 'EMG', make: function (r) { var c = r.pick([4, 5, 6, 7, 8, 9, 10, 11, 12]); return EV({ base: [c * c, 1], m: 3, n: 2 }); } }] },
    { num: '7', stem: 'Evaluate without a calculator. Deal with the negative sign first: take the reciprocal, then the root, then the power.', parts: [
      { id: 'e7a', level: 'PRG', make: function (r) { var cm = r.pick([[2, 3], [3, 3], [2, 5], [2, 1], [3, 1], [10, 3]]); return EV({ base: [Math.pow(cm[0], 4), 1], m: -cm[1], n: 4 }); } },
      { id: 'e7b', level: 'PRG', make: function (r) { var c = r.int(2, 10); return EV({ base: [c * c * c, 1], m: -2, n: 3 }); } },
      { id: 'e7c', level: 'PRG', make: function (r) { var cm = r.pick([[2, 3], [2, 2], [3, 2], [2, 4], [3, 3]]); return EV({ base: [Math.pow(cm[0], 5), 1], m: -cm[1], n: 5 }); } },
      { id: 'e7d', level: 'PRG', make: function (r) { var c = r.int(2, 10); return EV({ base: [c * c, 1], m: -3, n: 2 }); } }] },
    { num: '8', stem: 'Evaluate without a calculator. Apply the exponent to the numerator and the denominator separately. Give each answer as a fraction in lowest terms (or a whole number).', parts: [
      { id: 'e8a', level: 'PRG', make: function (r) { var ab = r.pick(coprimePairs(1, 5)); return EV({ base: [Math.pow(ab[0], 3), Math.pow(ab[1], 3)], m: 2, n: 3 }); } },
      { id: 'e8b', level: 'PRG', make: function (r) { var ab = r.pick([[2, 3], [3, 2], [1, 2], [1, 3], [2, 1], [3, 1]]); return EV({ base: [Math.pow(ab[0], 4), Math.pow(ab[1], 4)], m: -3, n: 4 }); } },
      { id: 'e8c', level: 'PRG', make: function (r) { var ab = r.pick(coprimePairs(1, 6).filter(function (x) { return x[0] * x[1] <= 20; })); return EV({ base: [ab[0] * ab[0], ab[1] * ab[1]], m: -3, n: 2 }); } },
      { id: 'e8d', level: 'PRG', make: function (r) { var ab = r.pick(coprimePairs(1, 5)); return EV({ base: [Math.pow(ab[0], 3), Math.pow(ab[1], 3)], m: -2, n: 3 }); } }] },
    { num: '9', stem: function (sh) { return '<b>Which order is easier?</b> Evaluate ' + t(F(sh.B) + '^{' + sh.m + '/' + sh.n + '}') + '.'; },
      shared: function (r) { var v = r.pick([[2, 6, 5], [2, 4, 3], [3, 4, 3], [2, 3, 4], [3, 3, 4], [5, 3, 2], [2, 5, 3], [4, 3, 2], [3, 2, 5], [2, 6, 5], [10, 3, 2], [2, 5, 4]]); return { c: v[0], n: v[1], m: v[2], B: Math.pow(v[0], v[1]) }; },
      parts: [{ id: 'e9a', level: 'EMG', make: e9a }, { id: 'e9b', level: 'PRG', make: e9b }] },
    { num: '10', section: 'Extra practice C — The exponent laws still apply', stem: 'Simplify using the product law. Leave every answer as a power with a <b>positive</b> exponent.', parts: [
      { id: 'e10a', level: 'EMG', make: function (r) { var ab = r.pick([[[1, 2], [1, 3]], [[1, 2], [1, 4]], [[1, 3], [1, 4]], [[1, 2], [1, 5]], [[1, 3], [1, 5]], [[1, 4], [1, 6]], [[1, 2], [1, 6]]]); if (r.chance(0.5)) ab = [ab[1], ab[0]]; return prodPart(r.pick(['x', 'x', 'y', 'm', 'k']), ab[0], ab[1]); } },
      { id: 'e10b', level: 'PRG', make: function (r) { var ab = r.pick([[[2, 3], [3, 4]], [[3, 4], [1, 3]], [[2, 5], [1, 2]], [[3, 5], [2, 3]], [[1, 4], [5, 6]], [[3, 4], [2, 5]], [[2, 3], [1, 4]], [[1, 6], [3, 4]]]); return prodPart(r.pick(['a', 'a', 'b', 'p']), ab[0], ab[1]); } },
      { id: 'e10c', level: 'PRG', make: function (r) { var ab = r.pick([[[5, 6], [-1, 3]], [[3, 4], [-1, 2]], [[2, 3], [-1, 6]], [[7, 8], [-1, 4]], [[5, 4], [-1, 2]], [[4, 3], [-1, 6]], [[1, 2], [-1, 6]]]); return prodPart(r.pick(['m', 'm', 'n', 'w']), ab[0], ab[1]); } }] },
    { num: '11', stem: 'Simplify using the quotient law. Leave every answer as a power with a <b>positive</b> exponent.', parts: [
      { id: 'e11a', level: 'EMG', make: function (r) { var q = r.pick([4, 6, 8, 10, 12]), g = pickWhere(r, function () { return [r.pick(cops(q)), r.pick(cops(q))]; }, function (x) { return x[0] > x[1] && gcd(x[0] - x[1], q) > 1; }) || [3, 1]; return quotPart(r.pick(['x', 'x', 'y', 'h']), [g[0], q], [g[1], q], true); } },
      { id: 'e11b', level: 'PRG', make: function (r) { var ab = r.pick([[[1, 2], [5, 6]], [[1, 3], [5, 6]], [[1, 4], [3, 4]], [[1, 2], [3, 4]], [[2, 5], [7, 10]], [[1, 3], [2, 3]], [[1, 4], [7, 12]]]); return quotPart(r.pick(['b', 'b', 'c', 'k']), ab[0], ab[1], true); } },
      { id: 'e11c', level: 'PRG', make: function (r) { var ab = r.pick([[[7, 10], [-1, 5]], [[1, 2], [-1, 4]], [[2, 3], [-1, 6]], [[3, 4], [-1, 8]], [[1, 3], [-1, 6]], [[3, 5], [-1, 10]]]); return quotPart(r.pick(['c', 'c', 'd', 'n']), ab[0], ab[1], true); } }] },
    { num: '12', stem: 'Simplify using the power of a power and power of a product laws. Positive exponents only.', parts: [
      { id: 'e12a', level: 'EMG', make: function (r) { var g = r.pick([[[2, 3], 6], [[3, 4], 8], [[1, 2], 6], [[2, 5], 10], [[3, 2], 4], [[1, 3], 6], [[5, 6], 12], [[3, 4], 4]]); return powPart(1, r.pick(['x', 'x', 'z', 'm']), g[0], g[1]); } },
      { id: 'e12b', level: 'PRG', make: function (r) { var g = r.pick([[16, 4, [3, 4]], [81, 4, [3, 4]], [8, 6, [2, 3]], [27, 3, [2, 3]], [16, 8, [1, 4]], [9, 4, [3, 2]], [4, 6, [3, 2]], [25, 2, [3, 2]], [64, 6, [1, 3]], [32, 10, [2, 5]]]); return powPart(g[0], r.pick(['y', 'y', 'a', 'p']), g[1], g[2]); } },
      { id: 'e12c', level: 'ADV', make: function (r) { return e12c(r); } }] },
    { num: '13', stem: 'Simplify. Each of these needs <b>two</b> laws. Positive exponents only.', parts: [
      { id: 'e13a', level: 'PRG', make: function (r) { return e13a(r); } },
      { id: 'e13b', level: 'PRG', make: function (r) { return e13b(r); } },
      { id: 'e13c', level: 'ADV', make: function (r) { return e13c(r); } }] },
    { num: '14', stem: '<b>Stretch.</b> Simplify, leaving your answer with positive exponents only.', parts: [
      { id: 'e14', level: 'MAS', make: function (r) { return e14(r); } }] },
    { num: '15', section: 'Extra practice D — Errors, reversals and ordering', stem: function (sh) { return 'Jamil writes ' + t(sh.B + '^{' + sh.m + '/' + sh.n + '}=\\dfrac{' + sh.B + '^{' + sh.m + '}}{' + sh.n + '}=' + ex.texRat(Q(Math.pow(sh.B, sh.m), sh.n))) + '.'; },
      shared: function (r) { var v = r.pick([[2, 3, 2], [3, 3, 2], [4, 3, 2], [5, 3, 2], [10, 3, 2], [2, 2, 3], [3, 2, 3], [5, 2, 3], [2, 4, 3], [2, 3, 4], [6, 2, 3], [4, 2, 3]]); return { c: v[0], n: v[1], m: v[2], B: Math.pow(v[0], v[1]) }; },
      parts: [{ id: 'e15a', level: 'EMG', make: e15a },
        { id: 'e15b', level: 'EMG', make: function (r, sh) { return EV({ base: [sh.B, 1], m: sh.m, n: sh.n, ask: function (e) { return 'Evaluate ' + t(e) + ' correctly.'; } }); } }] },
    { num: '16', stem: function (sh) { var B = Math.pow(sh.c, sh.n); return 'Priya evaluates ' + t(F(B) + '^{' + sh.m + '/' + sh.n + '}') + ' by raising to the power first: she gets ' + t(F(B) + '^{' + sh.m + '}=' + F(Math.pow(B, sh.m))) + ' and then cannot find ' + t(rootTex(sh.n, F(Math.pow(B, sh.m)))) + ' in her head.'; },
      shared: function (r) { var v = r.pick([[2, 4, 3], [2, 3, 2], [3, 3, 2], [2, 2, 3], [3, 2, 3], [5, 2, 3], [2, 3, 4], [4, 2, 3], [2, 5, 2], [4, 3, 2], [5, 3, 2], [3, 4, 3], [2, 2, 5], [6, 2, 3]]); return { c: v[0], n: v[1], m: v[2] }; },
      parts: [{ id: 'e16a', level: 'PRG', make: e16a }, { id: 'e16b', level: 'EMG', make: e16b }] },
    { num: '17', stem: '<b>Work backwards.</b> Find the missing exponent or base.', parts: [
      { id: 'e17a', level: 'EMG', make: e17a },
      { id: 'e17b', level: 'ADV', make: function (r) { return e17bd(r, false); } },
      { id: 'e17c', level: 'ADV', make: function (r) { var v = r.pick([[5, 2, 2], [3, 2, 2], [3, 2, 3], [3, 2, 4], [3, 2, 5], [5, 2, 3], [3, 4, 2], [5, 4, 2], [3, 4, 3], [7, 2, 2], [3, 2, 10]]); return solvePart(v[0], v[1], v[2]); } },
      { id: 'e17d', level: 'MAS', make: function (r) { return e17bd(r, true); } }] },
    { num: '18', stem: '<b>Ordering.</b>', shared: function (r) { return { c: r.pick([2, 2, 3, 5, 10]), items: ordShared(r) }; }, parts: [
      { id: 'e18a', level: 'EMG', make: function (r, sh) {
        var c = sh.c, its = [[c * c, 2], [c * c * c, 3], [Math.pow(c, 4), 4]];
        var p = P.fields('Evaluate each of ' + its.map(function (x) { return t(F(x[0]) + '^{1/' + x[1] + '}'); }).join(', ') + ' and ' + t(c + '^{1}') + '.', its.map(function (x) { return { name: t(F(x[0]) + '^{1/' + x[1] + '}'), label: t(F(x[0]) + '^{1/' + x[1] + '}='), mode: 'number' }; }),
          its.map(function (x) { return K.number(c, function (y) { return near(y, x[0] / x[1]) ? { code: 'times-exp', hint: t(F(x[0]) + '^{1/' + x[1] + '}') + ' is a ' + rootName(x[1]) + ' root, not ' + t(F(x[0]) + '\\div ' + x[1]) + '.' } : null; }); }),
          [String(c), String(c), String(c)], 'all equal ' + t(c), its.map(function (x) { return t(F(x[0]) + '^{1/' + x[1] + '}=' + rootTex(x[1], F(x[0])) + '=' + c); }).join(', ') + ' — all four equal ' + t(c) + '.', ['Which number, raised to the index, gives the base?'], 'all equal ' + c);
        p.bad = [[String(c), String(c), String(c + 1)]];
        return p;
      } },
      { id: 'e18b', level: 'PRG', make: function (r, sh) {
        var c = sh.c;
        return mc(r, 'All four equal ' + t(c) + '. Which explanation shows why?', [
          { html: 'Write each base as a power of ' + t(c) + ': e.g. ' + t(F(c * c * c) + '^{1/3}=\\left(' + c + '^{3}\\right)^{1/3}=' + c + '^{3\\times\\frac{1}{3}}=' + c + '^{1}') + '. Each time the power in the base cancels the denominator of the exponent.', right: true },
          { html: 'The bases get bigger while the exponents get smaller, so they balance out.', why: 'That’s a description, not a reason — and “balancing” doesn’t always give equal values (try ' + t('9^{1/3}') + '). Write each base as a power of ' + t(c) + '.' },
          { html: 'Any number to a fractional exponent is the same.', why: 'Not true: ' + t('4^{1/2}=2') + ' but ' + t('9^{1/2}=3') + '. Write each base as a power of ' + t(c) + '.' },
          { html: 'The exponents ' + t('\\frac{1}{2}') + ', ' + t('\\frac{1}{3}') + ', ' + t('\\frac{1}{4}') + ' add up to about ' + t('1') + '.', why: 'They don’t (their sum is ' + t('\\frac{13}{12}') + '), and adding exponents only happens when multiplying powers. Write each base as a power of ' + t(c) + '.' }],
          'Power of a power: ' + t('\\left(' + c + '^{2}\\right)^{1/2}=' + c + '^{1}') + ', ' + t('\\left(' + c + '^{3}\\right)^{1/3}=' + c + '^{1}') + ', ' + t('\\left(' + c + '^{4}\\right)^{1/4}=' + c + '^{1}') + '. The power of ' + t(c) + ' in the base cancels the denominator of the exponent.', ['Write ' + t(F(c * c)) + ', ' + t(F(c * c * c)) + ' and ' + t(F(Math.pow(c, 4))) + ' as powers of ' + t(c) + '.'], 'why all equal ' + c);
      } },
      { id: 'e18c', level: 'PRG', make: e18b },
      { id: 'e18d', level: 'PRG', make: e18c }] },
    { num: '19', stem: 'Comparing without a calculator.', parts: [
      { id: 'e19a', level: 'PRG', make: e19a },
      { id: 'e19b', level: 'ADV', make: e19b }] },
    { num: '20', stem: '<i>(Multiple Choice)</i>', parts: [{ id: 'e20', level: 'PRG', make: e20 }] },
    { num: '21', stem: function (sh) { return 'A cube has a volume of ' + t(sh.L) + ' cubic centimetres.'; }, shared: function (r) { return { L: r.pick(['V', 'V', 'W', 'k']) }; }, parts: [
      { id: 'e21a', level: 'EMG', make: function (r, sh) { var L = sh.L, pw0 = L + '^{1/3}'; var p = convPart('Write a power in ' + t(L) + ' for the edge length.', pw0, { form: 'power', single: L + '^{n}', needRat: true, before: t('\\text{edge}='), cands: [[L + '^{1/2}', 'square-root', 'Volume = ' + t('(\\text{edge})^{3}') + ', so the edge is a <b>cube</b> root: exponent ' + t('\\frac{1}{3}') + '.'], ['\\frac{' + L + '}{3}', 'times-exp', 'Dividing by 3 doesn’t undo cubing.'], [L + '^{3}', 'no-root', 'The edge is the cube <b>root</b> of the volume.']] }, t('V=(\\text{edge})^{3}') + ', so ' + t('\\text{edge}=' + pw0) + '.', ['Which exponent undoes cubing?'], 'edge from volume ' + L); p.good = [L + '^(1/3)']; return p; } },
      { id: 'e21b', level: 'PRG', make: function (r, sh) { var L = sh.L, tg = '6' + L + '^{2/3}'; var p = convPart('Write a power in ' + t(L) + ' for the total surface area of the cube.', tg, { form: 'power', needRat: true, before: t('S='), cands: [[L + '^{2/3}', 'six-faces', 'That’s one face. A cube has ' + t('6') + ' faces.'], ['6' + L + '^{1/3}', 'not-squared', 'Each face has area ' + t('(\\text{edge})^{2}=\\left(' + L + '^{1/3}\\right)^{2}') + '.'], ['6' + L + '^{3/2}', 'swap', t('\\left(' + L + '^{1/3}\\right)^{2}=' + L + '^{2/3}') + ' — multiply the exponents.'], ['4' + L + '^{2/3}', 'six-faces', 'A cube has ' + t('6') + ' faces, not 4.']] }, 'Edge ' + t('=' + L + '^{1/3}') + '; each face has area ' + t('\\left(' + L + '^{1/3}\\right)^{2}=' + L + '^{2/3}') + ', and there are 6 faces: ' + t('S=6' + L + '^{2/3}') + '.', ['Find the area of one face (edge squared), then multiply by 6.'], 'SA from volume ' + L); p.good = ['6\\left(' + L + '^{1/3}\\right)^{2}']; return p; } },
      { id: 'e21c', level: 'PRG', make: e21c }] },
    { num: '22', stem: e22stem, shared: e22shared, parts: [
      { id: 'e22a', level: 'MAS', make: e22a },
      { id: 'e22b', level: 'ADV', make: e22b }] }
  ];
  /* Extra 12(c): (c a^{p} b^{-q})^{r} */
  function e12c(r) {
    var g = r.pick([[8, 3, [2, 3]], [27, 3, [2, 3]], [8, 3, [1, 3]], [16, 4, [3, 4]], [4, 2, [3, 2]], [9, 2, [3, 2]], [16, 4, [1, 4]], [25, 2, [1, 2]]]), C = g[0], d = g[1], e = Q(g[2]);
    var L = r.pick([['a', 'b'], ['a', 'b'], ['x', 'y'], ['m', 'n']]), ka = d * r.pick([1, 2]), kb = d * r.pick([1, 1, 2]);
    var A0 = M(C, {}); A0.v[L[0]] = ka; A0.v[L[1]] = -kb; var A = mpow(A0, e), pr = br(rawTex(A0, L)) + '^{' + eS(e) + '}';
    var W = [[M(C, (function () { var v = {}; v[L[0]] = A.v[L[0]]; v[L[1]] = A.v[L[1]]; return v; })()), 'coef-raise', 'The exponent applies to the ' + t(C) + ' too: ' + t(C + '^{' + eS(e) + '}') + '.'],
      [M(A.c, (function () { var v = {}; v[L[0]] = A.v[L[0]]; v[L[1]] = qmul(A.v[L[1]], -1); return v; })()), 'flip-exp', 'Check ' + t(L[1]) + ': its exponent is negative, so it ends up in the <b>denominator</b>.'],
      [M(A.c, (function () { var v = {}; v[L[0]] = qadd(ka, e); v[L[1]] = qadd(-kb, e); return v; })()), 'law-added', 'Power of a power: <b>multiply</b> the exponents.']];
    var cRoot = qpow(C, [1, e[1]]);
    return lawPart(t(pr), A, W, 'Raise every factor to the power ' + t(eS(e)) + ' and multiply the exponents:<br>' + t(C + '^{' + eS(e) + '}=' + (e[0] === 1 ? rootTex(e[1], C) : br(rootTex(e[1], C)) + '^{' + e[0] + '}=' + cRoot[0] + '^{' + e[0] + '}') + '=' + F(qv(A.c))) + ', ' + t(L[0] + '^{' + ka + '\\times ' + eF(e) + '}=' + pw(L[0], A.v[L[0]])) + ', ' + t(L[1] + '^{-' + kb + '\\times ' + eF(e) + '}=' + pw(L[1], A.v[L[1]])) + '.<br>' + t(pr + '=' + fin(A, L)) + '.', null, 'power ' + pr, { ord: L });
  }
  /* Extra 13: two laws each */
  function e13a(r) { // x^a x^b / x^c
    var g = pickWhere(r, function () { var q = r.pick([4, 6, 8, 12]); return [r.int(1, q - 1), r.int(1, q - 1), r.int(1, q - 1), q]; }, function (x) { var s = x[0] + x[1] - x[2]; return s > 0 && x[0] !== x[2] && x[1] !== x[2] && gcd(x[0], x[3]) * gcd(x[1], x[3]) * gcd(x[2], x[3]) < 8; }) || [2, 3, 1, 4];
    var q = g[3], a = Q(g[0], q), b = Q(g[1], q), c = Q(g[2], q), v = r.pick(['x', 'x', 'y', 'k']), e = qsub(qadd(a, b), c), pr = '\\dfrac{' + pw(v, a) + '\\times ' + pw(v, b) + '}{' + pw(v, c) + '}';
    return lawPart(t(pr), mono(v, e), [[mono(v, qadd(qadd(a, b), c)), 'law-added', 'The power in the denominator is <b>subtracted</b> (quotient law).'], [mono(v, qsub(qmul(a, b), c)), 'mult', H_MULT], [mono(v, qdiv(qadd(a, b), c)), 'law-divided', 'Subtract the bottom exponent — don’t divide by it.']],
      'Product law on top, then quotient law:<br>' + t(pr + '=' + v + '^{' + eF(a) + '+' + eF(b) + '-' + eF(c) + '}=' + v + '^{' + eF(e) + '}' + (e[0] === e[1] ? '=' + v : '')) + '.', null, 'two laws ' + pr);
  }
  function e13b(r) { // (a^p / a^q)^k
    var g = r.pick([[[2, 3], [1, 6], 4], [[3, 4], [1, 4], 4], [[5, 6], [1, 3], 2], [[3, 4], [1, 2], 8], [[2, 3], [1, 3], 6], [[5, 6], [1, 2], 3], [[7, 8], [3, 8], 4], [[4, 5], [2, 5], 5]]);
    var a = Q(g[0]), b = Q(g[1]), k = g[2], v = r.pick(['a', 'a', 'b', 'w']), inner = qsub(a, b), e = qmul(inner, k), pr = '\\left(\\dfrac{' + pw(v, a) + '}{' + pw(v, b) + '}\\right)^{' + k + '}';
    return lawPart(t(pr), mono(v, e), [[mono(v, qmul(qadd(a, b), k)), 'law-added', 'Inside the bracket it’s a quotient: <b>subtract</b> the exponents.'], [mono(v, qadd(inner, k)), 'law-added', 'Power of a power: <b>multiply</b> by the outside exponent ' + t(k) + '.'], [mono(v, inner), 'missed-power', 'Don’t forget the outside exponent ' + t(k) + '.']],
      'Quotient law inside the bracket, then power of a power:<br>' + t(pr + '=\\left(' + v + '^{' + expSum(a, b, '-').join('=') + '}\\right)^{' + k + '}=' + v + '^{' + eF(inner) + '\\times ' + k + '}=' + pw(v, e)) + '.', null, 'two laws ' + pr);
  }
  function e13c(r) { // (C m^{p})^{1/2} × m^{q}
    var g = r.pick([[25, [1, 2], [1, 2], [3, 4]], [9, [1, 2], [1, 2], [3, 4]], [16, [1, 2], [1, 2], [1, 4]], [36, [1, 2], [1, 2], [3, 4]], [8, [1, 3], [1, 3], [2, 3]], [27, [1, 3], [1, 2], [5, 6]], [49, [1, 2], [1, 3], [5, 6]], [4, [1, 2], [2, 3], [2, 3]], [64, [1, 3], [1, 2], [1, 3]]]);
    var C = g[0], r1 = Q(g[1]), p = Q(g[2]), q = Q(g[3]), v = r.pick(['m', 'm', 'n', 'z']), A0 = mono(v, p, C), A1 = mpow(A0, r1), A = mmul(A1, mono(v, q));
    var pr = br(rawTex(A0)) + '^{' + eS(r1) + '}\\times ' + pw(v, q);
    return lawPart(t(pr), A, [[mmul(mono(v, A1.v[v], C), mono(v, q)), 'coef-raise', 'The exponent ' + t(eS(r1)) + ' applies to the ' + t(C) + ' too: ' + t(C + '^{' + eS(r1) + '}=' + rootTex(r1[1], C) + '=' + F(qv(A1.c))) + '.'], [mmul(mono(v, qadd(p, r1), A1.c), mono(v, q)), 'law-added', 'Power of a power: <b>multiply</b> ' + t(eF(p) + '\\times ' + eF(r1)) + '.'], [mono(v, qmul(A1.v[v], q), A1.c), 'mult', H_MULT]],
      'Power of a product first, then the product law:<br>' + t(pr + '=' + C + '^{' + eS(r1) + '}' + v + '^{' + eF(p) + '\\times ' + eF(r1) + '}\\times ' + pw(v, q) + '=' + rawTex(A1) + '\\times ' + pw(v, q) + '=' + F(qv(A.c)) + v + '^{' + expSum(A1.v[v], q, '+').join('=') + '}' + (qeq(A.v[v], 1) ? '=' + posTex(A) : '')) + '.', null, 'two laws ' + pr);
  }
  function e14(r) { // ((x^{a} y^{-b}) / x^{-c})^k
    var g = r.pick([[[1, 2], [1, 3], [1, 4], 12], [[1, 3], [1, 2], [1, 6], 6], [[1, 2], [1, 4], [1, 4], 8], [[2, 3], [1, 2], [1, 3], 6], [[1, 4], [1, 3], [1, 2], 12], [[1, 2], [2, 3], [1, 6], 6], [[3, 4], [1, 2], [1, 4], 4], [[1, 3], [1, 4], [1, 6], 12]]);
    var a = Q(g[0]), b = Q(g[1]), c = Q(g[2]), k = g[3], L = r.pick([['x', 'y'], ['x', 'y'], ['a', 'b'], ['m', 'n']]), X = L[0], Y = L[1];
    var inX = qadd(a, c), A = M(1, {}); A.v[X] = qmul(inX, k); A.v[Y] = qmul(Q(-b[0], b[1]), k);
    var pr = '\\left(\\dfrac{' + pw(X, a) + pw(Y, Q(-b[0], b[1])) + '}{' + pw(X, Q(-c[0], c[1])) + '}\\right)^{' + k + '}';
    var W1 = M(1, {}); W1.v[X] = qmul(qsub(a, c), k); W1.v[Y] = A.v[Y];
    var W2 = M(1, {}); W2.v[X] = A.v[X]; W2.v[Y] = qmul(A.v[Y], -1);
    var W3 = M(1, {}); W3.v[X] = qadd(inX, k); W3.v[Y] = qadd(Q(-b[0], b[1]), k);
    return lawPart(t(pr), A, [[W1, 'backwards', 'Dividing by ' + t(pw(X, Q(-c[0], c[1]))) + ' means subtracting a <b>negative</b> exponent: ' + t(eF(a) + '-\\left(-' + eF(c) + '\\right)=' + eF(a) + '+' + eF(c)) + '.'], [W2, 'flip-exp', 'Check ' + t(Y) + ': its exponent is negative, so it belongs in the <b>denominator</b>.'], [W3, 'law-added', 'Power of a power: <b>multiply</b> by ' + t(k) + ', don’t add.']],
      'Inside first (quotient law on ' + t(X) + '): ' + t(X + '^{' + eF(a) + '-\\left(-' + eF(c) + '\\right)}=' + X + '^{' + expSum(a, c, '+').join('=') + '}') + '.<br>Then raise to the power ' + t(k) + ' (multiply every exponent): ' + t(X + '^{' + eF(inX) + '\\times ' + k + '}' + Y + '^{-' + eF(b) + '\\times ' + k + '}=' + rawTex(A, L) + '=' + posTex(A, L)) + '.', null, 'stretch ' + pr, { ord: L });
  }

  HW.defineLesson({
    id: 'u2l9', unit: 2, num: '9', title: 'Rational Exponents and Radical Form', outcome: 'AN3',
    blurb: 'Fractional exponents are radicals in disguise: evaluating powers like 27^(2/3) root first, converting both ways between powers and radicals, and using the exponent laws with rational exponents.',
    questions: [
      { num: '1', section: 'Part A — Evaluating Rational-Exponent Powers', stem: 'Evaluate without using a calculator.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { var c = r.int(2, 10); return EV({ base: [c * c, 1], m: 1, n: 2 }); } },
        { id: '1b', level: 'BEG', make: function (r) { var c = r.pick([11, 12, 13, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100]); return EV({ base: [c * c, 1], m: 1, n: 2 }); } },
        { id: '1c', level: 'BEG', make: function (r) { var c = r.int(2, 10); return EV({ base: [c * c * c, 1], m: 1, n: 3 }); } },
        { id: '1d', level: 'BEG', make: function (r) { var c = r.pick([10, 10, 20, 30, 40, 50, 60, 100]); return EV({ base: [c * c * c, 1], m: 1, n: 3 }); } },
        { id: '1e', level: 'EMG', make: function (r) { var c = r.pick([2, 3, 4, 5, 10]); return EV({ base: [Math.pow(c, 4), 1], m: 1, n: 4 }); } },
        { id: '1f', level: 'EMG', make: function (r) { var c = r.pick([2, 3, 4, 10]); return EV({ base: [Math.pow(c, 5), 1], m: 1, n: 5 }); } }] },
      { num: '2', stem: 'Evaluate without using a calculator. Take the root first to keep the numbers small.', parts: [
        { id: '2a', level: 'EMG', make: function (r) { var cm = r.pick([[2, 4], [2, 2], [2, 5], [3, 2], [4, 2], [5, 2], [3, 4], [10, 2], [6, 2]]); return EV({ base: [Math.pow(cm[0], 3), 1], m: cm[1], n: 3 }); } },
        { id: '2b', level: 'EMG', make: function (r) { var cm = r.pick([[3, 5], [2, 5], [4, 3], [5, 3], [6, 3], [7, 3], [3, 3], [10, 3], [2, 7]]); return EV({ base: [cm[0] * cm[0], 1], m: cm[1], n: 2 }); } },
        { id: '2c', level: 'EMG', make: function (r) { var c = r.int(2, 10); return EV({ base: [c * c, 1], m: 3, n: 2 }); } },
        { id: '2d', level: 'EMG', make: function (r) { var cm = r.pick([[2, 5], [2, 3], [3, 3], [2, 7], [3, 5], [10, 3], [5, 3]]); return EV({ base: [Math.pow(cm[0], 4), 1], m: cm[1], n: 4 }); } },
        { id: '2e', level: 'EMG', make: function (r) { var c = r.int(2, 10); return EV({ base: [c * c * c, 1], m: 2, n: 3 }); } },
        { id: '2f', level: 'EMG', make: function (r) { var cm = r.pick([[2, 7], [2, 5], [2, 9], [3, 5], [2, 3], [4, 5], [3, 7], [2, 11]]); return EV({ base: [cm[0] * cm[0], 1], m: cm[1], n: 2 }); } }] },
      { num: '3', stem: 'Evaluate without using a calculator. Give each answer as a fraction in lowest terms.', parts: [
        { id: '3a', level: 'EMG', make: function (r) { var ab = r.pick(coprimePairs(1, 10).filter(function (x) { return x[0] !== 1 || x[1] < 9; })); return EV({ base: [ab[0] * ab[0], ab[1] * ab[1]], m: 1, n: 2 }); } },
        { id: '3b', level: 'EMG', make: function (r) { var ab = r.pick(coprimePairs(1, 6)); return EV({ base: [Math.pow(ab[0], 3), Math.pow(ab[1], 3)], m: 1, n: 3 }); } },
        { id: '3c', level: 'PRG', make: function (r) { if (r.chance(0.6)) { var ab = r.pick([[2, 3], [3, 2], [1, 2], [1, 3], [2, 5], [1, 4]]); return EV({ base: [Math.pow(ab[0], 4), Math.pow(ab[1], 4)], m: 3, n: 4 }); } var cd = r.pick(coprimePairs(1, 5)); return EV({ base: [Math.pow(cd[0], 3), Math.pow(cd[1], 3)], m: 2, n: 3 }); } }] },
      { num: '4', section: 'Part B — Converting Between Radicals and Rational Exponents', stem: 'Write an equivalent expression using radicals.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { return genRad(r.pick(['p', 'p', 'x', 'a', 'k']), 1, r.pick([3, 4, 5, 6, 7, 8, 9]), 'entire'); } },
        { id: '4b', level: 'BEG', make: function (r) { return genRad(r.pick(['q', 'q', 'y', 'b', 'm']), 1, r.pick([3, 4, 5, 6, 7, 8, 10]), 'entire'); } },
        { id: '4c', level: 'EMG', make: function (r) { var mn = r.pick([[2, 5], [2, 3], [3, 4], [3, 5], [4, 5], [2, 7], [5, 6]]); return genRad(r.pick(['r', 'r', 'z', 'c']), mn[0], mn[1], 'entire'); } },
        { id: '4d', level: 'EMG', make: function (r) { var mn = r.pick([[3, 8], [5, 8], [4, 7], [5, 9], [3, 7], [7, 8], [2, 9]]); return genRad(r.pick(['s', 's', 'w', 'n']), mn[0], mn[1], 'entire'); } },
        { id: '4e', level: 'EMG', make: function (r) { return genRad(r.pick(['t', 't', 'x', 'h']), -1, r.pick([2, 3, 4, 5, 6, 7]), 'entire'); } },
        { id: '4f', level: 'PRG', make: function (r) { var mn = r.pick([[3, 4], [2, 3], [2, 5], [3, 5], [4, 5], [5, 6]]); return genRad(r.pick(['u', 'u', 'y', 'm']), -mn[0], mn[1], 'entire'); } }] },
      { num: '5', stem: 'Write each radical as a power in the form ' + t('k^{n}') + ', where ' + t('n\\in\\mathbb{Q}') + '.', parts: [
        { id: '5a', level: 'EMG', make: function (r) { var mn = r.pick([[3, 4], [2, 3], [2, 5], [3, 5], [4, 5], [5, 6], [3, 7]]), v = r.pick(['p', 'p', 'x', 'k']); return toPowPart(v, mn[0], mn[1], rootTex(mn[1], v + '^{' + mn[0] + '}')); } },
        { id: '5b', level: 'EMG', make: function (r) { var mn = r.pick([[2, 5], [3, 5], [2, 7], [4, 7], [5, 8], [4, 9]]), v = r.pick(['q', 'q', 'y', 'a']); return toPowPart(v, mn[0], mn[1], rootTex(mn[1], v + '^{' + mn[0] + '}')); } },
        { id: '5c', level: 'EMG', make: function (r) { var m = r.pick([3, 5, 7, 9, 11]), v = r.pick(['r', 'r', 'z', 'b']); return toPowPart(v, m, 2, '\\sqrt{' + v + '^{' + m + '}}'); } },
        { id: '5d', level: 'BEG', make: function (r) { var n = r.pick([3, 4, 5, 6, 7, 8]), v = r.pick(['s', 's', 'w', 'c']); return toPowPart(v, 1, n, rootTex(n, v)); } },
        { id: '5e', level: 'PRG', make: function (r) { var mn = r.pick([[5, 6], [2, 3], [3, 4], [2, 5], [3, 5], [4, 5]]), v = r.pick(['t', 't', 'm', 'h']); return toPowPart(v, -mn[0], mn[1], '\\dfrac{1}{' + rootTex(mn[1], v + '^{' + mn[0] + '}') + '}'); } },
        { id: '5f', level: 'PRG', make: function (r) { var m = r.pick([3, 5, 7, 1]), v = r.pick(['u', 'u', 'n', 'd']); return toPowPart(v, -m, 2, '\\dfrac{1}{\\sqrt{' + (m === 1 ? v : v + '^{' + m + '}') + '}}'); } }] },
      { num: '6', section: 'Part C — Exponent Laws with Rational Exponents', stem: 'Simplify. Leave your answer as a power with a positive exponent. (Product law.)', parts: [
        { id: '6a', level: 'EMG', make: function (r) { var d = r.pick([[3, 6], [2, 4], [2, 6], [4, 8], [2, 8], [5, 10], [3, 12], [4, 12], [3, 9]]), g = pickWhere(r, function () { return [r.pick(cops(d[0])), r.pick(cops(d[1]))]; }, function (x) { var e = qadd([x[0], d[0]], [x[1], d[1]]); return e[1] > 1 && qv(e) < 2; }) || [1, 1]; var ab = [[g[0], d[0]], [g[1], d[1]]]; if (r.chance(0.4)) ab.reverse(); return prodPart(r.pick(LETS), ab[0], ab[1]); } },
        { id: '6b', level: 'BEG', make: function (r) { var q = r.pick([5, 7, 8, 9, 11]), g = pickWhere(r, function () { return [r.int(1, q - 2), r.int(1, q - 2)]; }, function (x) { return x[0] + x[1] < q && gcd(x[0], q) === 1 && gcd(x[1], q) === 1 && gcd(x[0] + x[1], q) === 1; }) || [2, 1]; return prodPart(r.pick(LETS), [g[0], q], [g[1], q]); } },
        { id: '6c', level: 'BEG', make: function (r) { var q = r.pick([3, 4, 5, 6, 7, 8]), a = r.pick(cops(q)); return prodPart(r.pick(LETS), [a, q], [q - a, q]); } },
        { id: '6d', level: 'BEG', make: function (r) { var ab = r.pick([[1, 1], [1, 1], [3, 1], [1, 3], [5, 1], [3, 3], [1, 5]]); return prodPart(r.pick(LETS), [ab[0], 2], [ab[1], 2]); } }] },
      { num: '7', stem: 'Simplify. Leave your answer as a power with a positive exponent. (Quotient law.)', parts: [
        { id: '7a', level: 'EMG', make: function (r) { var q = r.pick([6, 8, 9, 10, 12]), g = pickWhere(r, function () { return [r.pick(cops(q)), r.pick(cops(q))]; }, function (x) { return x[0] > x[1] && gcd(x[0] - x[1], q) > 1; }) || [5, 1]; return quotPart(r.pick(LETS), [g[0], q], [g[1], q]); } },
        { id: '7b', level: 'EMG', make: function (r) { var q = r.pick([4, 6, 8]), g = pickWhere(r, function () { return [r.pick(cops(q)), r.pick(cops(q))]; }, function (x) { return x[0] > x[1]; }) || [3, 1]; return quotPart(r.pick(LETS), [g[0], q], [g[1], q]); } },
        { id: '7c', level: 'EMG', make: function (r) { var q = r.pick([5, 7, 8, 9]), g = pickWhere(r, function () { return [r.pick(cops(q)), r.pick(cops(q))]; }, function (x) { return x[0] > x[1]; }) || [7, 3]; return quotPart(r.pick(LETS), [g[0], q], [g[1], q]); } },
        { id: '7d', level: 'PRG', make: function (r) { var q = r.pick([2, 2, 3, 4, 5]), g = pickWhere(r, function () { return [r.int(1, 2 * q), r.int(1, 2 * q)]; }, function (x) { return x[0] < x[1] && gcd(x[0], q) === 1 && gcd(x[1], q) === 1; }) || [1, 3]; return quotPart(r.pick(LETS), [g[0], q], [g[1], q]); } }] },
      { num: '8', stem: 'Simplify. Leave your answer as a power with a positive exponent. (Power of a power, power of a product.)', parts: [
        { id: '8a', level: 'BEG', make: function (r) { var q = r.pick([2, 2, 4]), a = r.pick(cops(q)), k = q * r.pick([1, 2, 3]); return powPart(1, r.pick(LETS), [a, q], k); } },
        { id: '8b', level: 'BEG', make: function (r) { var q = r.pick([3, 3, 5, 6]), a = r.pick(cops(q).filter(function (x) { return x < 4; })), k = q * r.pick([1, 2, 3]); return powPart(1, r.pick(LETS), [a, q], k); } },
        { id: '8c', level: 'EMG', make: function (r) { var q = r.pick([2, 2, 3]), c = q === 2 ? r.int(2, 9) : r.int(2, 5), a = r.pick(cops(q)); return powPart(c, r.pick(LETS), [a, q], q); } },
        { id: '8d', level: 'PRG', make: function (r) { var g = r.pick([[9, [2, 3], [3, 2]], [4, [2, 3], [3, 2]], [16, [2, 3], [3, 2]], [25, [2, 3], [3, 2]], [8, [3, 2], [2, 3]], [27, [3, 2], [2, 3]], [64, [3, 2], [2, 3]], [4, [4, 3], [3, 2]], [9, [4, 3], [3, 2]], [8, [3, 4], [4, 3]], [36, [2, 3], [3, 2]], [125, [3, 2], [2, 3]]]); return powPart(g[0], r.pick(LETS), g[1], g[2]); } }] },
      { num: '9', section: 'Part D — Applications and Extensions', stem: function (sh) { return sh.o + ' has a volume of ' + t(F(sh.V)) + ' ' + sh.u + t('^{3}') + '.'; }, shared: cubeShared,
        parts: [{ id: '9a', level: 'EMG', make: q9a }, { id: '9b', level: 'PRG', make: q9b }, { id: '9c', level: 'EMG', make: q9c }] },
      { num: '10', stem: function (sh) { return 'A cube has a volume of ' + t(sh.L + '\\text{ cm}^{3}') + '.'; }, shared: function (r) { return { L: r.pick(['W', 'W', 'V', 'k', 'Q']) }; },
        parts: [{ id: '10a', level: 'PRG', make: q10a }, { id: '10b', level: 'ADV', make: q10b }] },
      { num: '11', stem: 'In each case, write the given number as a power with the given exponent.', parts: [
        { id: '11a', level: 'EMG', make: function (r) { var v = r.int(2, 12), B = v * v; return asPowerPart([v, 1], [1, 2], [B, 1], 'A square root undoes squaring: ' + t(v + '^{2}=' + B) + ', so ' + t(B + '^{1/2}=\\sqrt{' + B + '}=' + v) + '.<br>' + t(v + '=' + B + '^{1/2}'), ['Which number has a square root of ' + t(v) + '?'], v + ' as a power with exponent 1/2'); } },
        { id: '11b', level: 'PRG', make: function (r) { var v = r.pick([2, 3, 4, 5, 10]), n = r.pick([4, 4, 5]); if (n === 5 && v > 3) v = r.pick([2, 3]); var B = Math.pow(v, n); return asPowerPart([v, 1], [1, n], [B, 1], t(v + '^{' + n + '}=' + F(B)) + ', so ' + t(F(B) + '^{1/' + n + '}=' + rootTex(n, F(B)) + '=' + v) + '.<br>' + t(v + '=' + F(B) + '^{1/' + n + '}'), ['Which number has a ' + rootName(n) + ' root of ' + t(v) + '? Raise ' + t(v) + ' to the power ' + t(n) + '.'], v + ' as a power with exponent 1/' + n); } },
        { id: '11c', level: 'PRG', make: function (r) { var v = r.pick([2, 3, 4, 5, 6, 10]), B = v * v * v; return asPowerPart([v, 1], [1, 3], [B, 1], t(v + '^{3}=' + F(B)) + ', so ' + t(F(B) + '^{1/3}=' + rootTex(3, F(B)) + '=' + v) + '.<br>' + t(v + '=' + F(B) + '^{1/3}'), ['Which number has a cube root of ' + t(v) + '? Cube ' + t(v) + '.'], v + ' as a power with exponent 1/3'); } },
        { id: '11d', level: 'ADV', make: function (r) { var v = r.int(2, 10), B = v * v; return asPowerPart([1, v], [-1, 2], [B, 1], 'We need ' + t('b^{-1/2}=\\frac{1}{' + v + '}') + ', i.e. ' + t('\\frac{1}{\\sqrt{b}}=\\frac{1}{' + v + '}') + ', so ' + t('\\sqrt{b}=' + v) + ' and ' + t('b=' + B) + '.<br>' + t('\\frac{1}{' + v + '}=' + B + '^{-1/2}') + ' (check: ' + t('\\frac{1}{\\sqrt{' + B + '}}=\\frac{1}{' + v + '}') + ' ✓)', ['A negative exponent means reciprocal: ' + t('b^{-1/2}=\\frac{1}{\\sqrt{b}}') + '. What must ' + t('\\sqrt{b}') + ' be?'], '1/' + v + ' as a power with exponent -1/2'); } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [{ id: '12', level: 'PRG', make: q12 }] },
      { num: '13', stem: '', parts: [{ id: '13', level: 'PRG', make: q13 }] },
      { num: '14', stem: '', parts: [{ id: '14', level: 'ADV', make: q14 }] },
      { num: '15', stem: 'Simplify. Leave your answer as a power with a positive exponent.', parts: [
        { id: '15', level: 'PRG', make: function (r) { var ab = pickWhere(r, function () { return [r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5]]), r.pick([[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 3]])]; }, function (x) { return x[0][1] !== x[1][1] && gcd(x[0][1], x[1][1]) === 1 && qadd(x[0], x[1])[1] > 1; }) || [[1, 2], [1, 3]]; return prodPart(r.pick(LETS), ab[0], ab[1]); } }] },
      { num: '16', stem: 'Simplify. Write your answer as a power with a positive exponent, and then in radical form.', parts: [{ id: '16', level: 'ADV', make: q16 }] }
    ],
    extra: EXTRA
  });
})(window);
