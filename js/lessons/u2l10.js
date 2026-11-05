/* Math 15 · Unit 2 · Lesson 10 — Unit Review: Exponents (AN3)
 * Assignment 10 (u2_L10.tex, questions 1–25) and the Lesson 10 Extra Practice (u2_EP10.tex, questions 1–20).
 * Twin of Math 10C u2l6 (the unit review). Evaluating rational-exponent powers and power → radical conversions reuse the
 * 10C u2l4 machinery (EV, genRad …); scientific notation reuses the 10C u2l6 helpers (sciPart, stdChk, anyNum).
 * Every simplification is built as a small expression tree (leaf monomials; power, product and quotient nodes) so the
 * question, its key, its step-by-step worked solution and its wrong answers all come from the same numbers:
 * EVT(tree, mode) re-evaluates the tree with one classic misconception applied everywhere (added the exponents in a
 * power of a power, didn't raise / multiplied the coefficient by the exponent, multiplied exponents in a product, added
 * coefficients, added exponents in a quotient, subtracted coefficients) and lawPart turns each into a diagnosis.
 * Math 15 pitch: no calculator except where the booklet's item needs one (Extra 9 and 15(b), marked); small numbers.
 * Levels: BEG one law; EMG two laws / zero exponent / coefficient traps; PRG negative exponents, quotient brackets,
 * scientific notation in context; ADV multi-law with negative exponents, working backwards; MAS extra 3, 13(c), 19. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  var SHARED = {   // codes other Unit 2 lessons use too: same meaning as in Math 10C; don't relabel them if already set
    'neg-exp-sign': 'Read a negative exponent as a negative answer', 'no-recip': 'Forgot the reciprocal (negative exponent)',
    'times-exp': 'Multiplied the base by the exponent', swap: 'Swapped the root index and the power', 'root-only': 'Took the root but not the power',
    'no-root': 'Forgot the root (used the numerator only)', 'square-root': 'Used a square root for every denominator',
    'add-exp': 'Added exponents (should multiply)', 'coef-added': 'Added coefficients instead of multiplying', 'coef-not-raised': 'Didn’t raise the coefficient',
    'coef-sub': 'Subtracted coefficients instead of dividing', 'coef-zeroed': 'Applied the zero exponent to the coefficient too', 'div-exp': 'Divided exponents (should subtract)',
    'mult-exp': 'Multiplied exponents (should add)', 'num-only': 'Raised only the numerator', 'sub-wrong': 'Added exponents (should subtract)',
    'zero-is-0': 'Thought a⁰ = 0', 'zero-is-base': 'Thought a⁰ = a', 'x-one': 'Forgot the factor x = x¹', 'coef-times': 'Multiplied the coefficient by the exponent',
    'coef-side': 'Number on the wrong side of the fraction bar (moved one with no negative exponent, or left one that has one)',
    opposite: 'Treated a negative exponent as a negative sign (opposite instead of reciprocal)', 'neg-power': 'Treated a negative exponent as a negative number',
    'bases-mult': 'Multiplied the bases', standard: 'Not in standard form', renorm: 'Didn’t renormalize the coefficient', 'missed-factor': 'Didn’t apply the power to every factor',
    'repeat-error': 'Repeated the error in the question', backwards: 'Subtracted the exponents in the wrong order', 'missed-power': 'Forgot the outside exponent', exponent: 'Used a different exponent'
  };
  HW.addCodes(Object.keys(SHARED).reduce(function (o, k) { if (!(HW.CODES && HW.CODES[k])) o[k] = SHARED[k]; return o; }, {}));
  HW.addCodes({
    'u2l10-zero-part': 'Applied the zero exponent to only part of the bracket', 'u2l10-odd-root-sign': 'Sign of an odd root of a negative number',
    'u2l10-count': 'Divided the wrong way (how many fit)', 'u2l10-mult-back': 'Solved for the unknown exponent with the wrong operation', 'u2l10-only-one': 'Only one of the two values right',
    'u2l10-factor': 'Wrong scale factor (didn’t cube)', 'u2l10-forward': 'Moved forward in time instead of back'
  });
  HW.addPartial({ 'u2l10-zero-part': 'b', 'u2l10-odd-root-sign': 's', 'u2l10-count': 'n', 'u2l10-mult-back': 'n', 'u2l10-only-one': 's', 'u2l10-factor': 'n', 'u2l10-forward': 'n' });

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

  /* ---------- scientific notation helpers ---------- */
  // exact decimal string for an integer × 10^e (e may be negative)
  function decStr(n, e) {
    var neg = n < 0, s = String(Math.abs(n));
    if (e >= 0) s = s + new Array(e + 1).join('0');
    else { var k = -e; if (s.length <= k) s = '0.' + new Array(k - s.length + 1).join('0') + s; else s = s.slice(0, s.length - k) + '.' + s.slice(s.length - k); s = s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, ''); }
    return (neg ? '-' : '') + s;
  }
  function stdTex(n, e) { var s = decStr(n, e); if (s.indexOf('.') < 0) return F(Number(s)); var p = s.split('.'); return p[0] + '.' + p[1].replace(/(\d{3})(?=\d)/g, '$1\\,'); }
  function sciT(x, sig) { return K.sciTex(x, sig); }
  // K.sci compares with an absolute tolerance for very small values; re-check the value relatively
  function sciChk(x, opt) {
    opt = opt || {}; var base = K.sci(x, opt);
    return function (resp) { var res = base(resp); if (res.v === 'correct' && !opt.sig) { var a = K.read(resp); if (a.ast && !releq(a.val, x)) return wrong('value', null); } return res; };
  }
  function sciPart(prompt, x, opt, sol, hints, text) { var p = P.sci(prompt, x, opt, sol, hints, text); p.check = sciChk(x, opt); return p; }
  function stdChk(x) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim(); if (!s) return form('empty', 'Type your answer first.');
      var pn = HW.parse.number(s);
      if (!pn.ok) { var a = K.read(s); if (a.res) return a.res; if (releq(a.val, x)) return form('standard', 'Right value — now write it in <b>standard (decimal) form</b>, with no power of ' + t('10') + '.'); return wrong('value', null); }
      if (releq(pn.value, x)) return ok();
      var lg = Math.log10(Math.abs(pn.value / x));
      if (isFinite(lg) && Math.abs(lg - Math.round(lg)) < 1e-9 && Math.round(lg) !== 0) { var d = Math.abs(Math.round(lg)); return wrong('power-off', 'The digits are right, but the decimal point is ' + d + ' place' + (d > 1 ? 's' : '') + ' off. Count the places again.'); }
      return wrong('value', null);
    };
  }
  // any exact form (standard or scientific) of a value
  function anyNum(x) {
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (releq(a.val, x)) return ok();
      var lg = Math.log10(Math.abs(a.val / x));
      if (isFinite(lg) && Math.abs(lg - Math.round(lg)) < 1e-9 && Math.round(lg) !== 0) return wrong('power-off', 'The digits are right, but the size is off by a factor of ' + t('10^{' + Math.abs(Math.round(lg)) + '}') + '.');
      return wrong('value', null);
    };
  }
  function num1(x) { return Number(x.toFixed(6)); } // tidy decimals like 2.4*5.5

  function releq(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b)); }

  /* ================= expression trees ================= */
  function Lf(c, v, tex) { return { m: M(c, v), tex: tex }; }
  function Pw(n, r) { return { pow: n, r: Q(r) }; }
  function Mu() { return { mul: Array.prototype.slice.call(arguments) }; }
  function Dv(a, b) { return { div: [a, b] }; }
  function TT(n) {
    if (n.m) return n.tex || rawTex(n.m);
    if (n.pow) { var inner = n.pow.div ? '\\dfrac{' + TT(n.pow.div[0]) + '}{' + TT(n.pow.div[1]) + '}' : TT(n.pow); return '\\left(' + inner + '\\right)^{' + eS(n.r) + '}'; }
    if (n.mul) return n.mul.map(TT).join('\\times ');
    return '\\dfrac{' + TT(n.div[0]) + '}{' + TT(n.div[1]) + '}';
  }
  function lettersOf(n, acc) { acc = acc || {}; if (n.m) Object.keys(n.m.v).forEach(function (k) { acc[k] = 1; }); else if (n.pow) lettersOf(n.pow, acc); else (n.mul || n.div).forEach(function (x) { lettersOf(x, acc); }); return acc; }
  /* value of the tree, optionally with one misconception applied everywhere */
  function EVT(n, mode) {
    if (n.m) return n.m;
    var A, B;
    if (n.pow) {
      A = EVT(n.pow, mode); if (!A) return null;
      var r = n.r, v = {}, c;
      Object.keys(A.v).forEach(function (k) { v[k] = mode === 'add-exp' ? (A.v[k][0] ? qadd(A.v[k], r) : A.v[k]) : qmul(A.v[k], r); });
      c = mode === 'coef-not-raised' ? A.c : mode === 'coef-times' ? qmul(A.c, r) : qpow(A.c, r);
      return c ? { c: c, v: v } : null;
    }
    if (n.mul) {
      var parts = n.mul.map(function (x) { return EVT(x, mode); }); if (parts.some(function (x) { return !x; })) return null;
      if (mode === 'mult-exp' || mode === 'coef-added') {
        var c0 = mode === 'coef-added' ? [0, 1] : [1, 1], v0 = {};
        parts.forEach(function (X) { c0 = mode === 'coef-added' ? (qeq(X.c, 1) ? c0 : qadd(c0, X.c)) : qmul(c0, X.c); Object.keys(X.v).forEach(function (k) { if (!X.v[k][0]) return; v0[k] = v0[k] ? (mode === 'mult-exp' ? qmul(v0[k], X.v[k]) : qadd(v0[k], X.v[k])) : X.v[k]; }); });
        if (c0[0] === 0) c0 = [1, 1];
        return { c: c0, v: v0 };
      }
      return parts.reduce(mmul);
    }
    A = EVT(n.div[0], mode); B = EVT(n.div[1], mode); if (!A || !B) return null;
    if (mode === 'sub-wrong') return mmul(A, { c: qdiv(1, B.c), v: B.v });
    if (mode === 'coef-sub') { var R = mdiv(A, B); R.c = qsub(A.c, B.c); return R.c[0] ? R : null; }
    return mdiv(A, B);
  }
  var MODES = {
    'add-exp': 'A power of a power: <b>multiply</b> the exponents — don’t add them.',
    'coef-not-raised': 'The outside exponent applies to the <b>number</b> in the bracket too, e.g. ' + t('(3t^{2})^{2}=3^{2}t^{4}=9t^{4}') + '.',
    'coef-times': 'A number to a power is repeated multiplication: ' + t('3^{2}=3\\times 3=9') + ', not ' + t('3\\times 2') + '.',
    'mult-exp': 'Multiplying powers with the same base: <b>add</b> the exponents (product law) — don’t multiply them.',
    'coef-added': 'Coefficients <b>multiply</b> — don’t add them.',
    'sub-wrong': 'Dividing powers with the same base: <b>subtract</b> the exponents (quotient law).',
    'coef-sub': 'Coefficients <b>divide</b> — don’t subtract them.'
  };
  function hasNode(n, type) { if (n.m) return false; if (n[type]) return true; if (n.pow) return hasNode(n.pow, type); return (n.mul || n.div).some(function (x) { return hasNode(x, type); }); }
  function treeWrongs(tree, A) {
    var out = [];
    Object.keys(MODES).forEach(function (mode) {
      if ((mode === 'add-exp' || mode === 'coef-not-raised' || mode === 'coef-times') && !hasNode(tree, 'pow')) return;
      if ((mode === 'mult-exp' || mode === 'coef-added') && !hasNode(tree, 'mul')) return;
      if ((mode === 'sub-wrong' || mode === 'coef-sub') && !hasNode(tree, 'div')) return;
      var W = EVT(tree, mode); if (W) out.push([W, mode, MODES[mode]]);
    });
    if (!(A.c[0] === 1 && A.c[1] === 1) && A.c[0] > 0) out.push([{ c: Q(A.c[1], A.c[0]), v: A.v }, 'coef-side', 'Your letters are right, but the number is on the wrong side of the fraction bar. A number moves across the bar only if <i>it</i> has a negative exponent.']);
    return out;
  }
  /* worked solution: inside out */
  function cW(c) { c = Q(c); var s = cTex(c, false); return c[0] < 0 || c[1] !== 1 ? br(s) : s; }
  function opE(a, b, op) { var bs = eS(b); return eS(a) + op + (Q(b)[0] < 0 ? '(' + bs + ')' : bs); }
  function SOLV(n, lines) {
    if (n.m) { if (n.zero) lines.push(t(n.zero + '=1') + ' (any nonzero base to the power ' + t('0') + ' is ' + t('1') + ').'); return n.m; }
    var A, B, R;
    if (n.pow) {
      A = SOLV(n.pow, lines); R = mpow(A, n.r);
      var ks = Object.keys(A.v).filter(function (k) { return A.v[k][0]; });
      var w = (qeq(A.c, 1) ? '' : cW(A.c) + '^{' + eS(n.r) + '}') + ks.map(function (k) { return k + '^{' + (qeq(A.v[k], 1) ? '' : eS(A.v[k]) + '\\times ') + (Q(n.r)[0] < 0 ? '(' + eS(n.r) + ')' : eS(n.r)) + '}'; }).join('');
      lines.push((n.pow.div ? 'Power of a quotient' : ks.length + (qeq(A.c, 1) ? 0 : 1) > 1 ? 'Power of a product' : 'Power of a power') + ' — every factor gets the exponent ' + t(eS(n.r)) + ', and exponents <b>multiply</b>: ' + t(br(rawTex(A)) + '^{' + eS(n.r) + '}=' + w + '=' + rawTex(R)));
      return R;
    }
    if (n.mul) {
      var parts = n.mul.map(function (x) { return SOLV(x, lines); }); R = parts.reduce(mmul);
      var cs = parts.filter(function (X) { return !qeq(X.c, 1); }), keys = Object.keys(R.v).concat(parts.reduce(function (acc, X) { return acc.concat(Object.keys(X.v)); }, [])).filter(function (k, i, arr) { return arr.indexOf(k) === i; });
      var cw = cs.length > 1 ? '\\left(' + cs.map(function (X) { return cTex(X.c, false); }).join('\\times ') + '\\right)' : cs.length ? cW(cs[0].c) : '';
      var vw = keys.map(function (k) { var es = parts.filter(function (X) { return X.v[k] && X.v[k][0]; }).map(function (X) { return X.v[k]; }); if (!es.length) return ''; return es.length === 1 ? pw(k, es[0]) : k + '^{' + es.map(function (e, i) { return i && e[0] < 0 ? '(' + eS(e) + ')' : eS(e); }).join('+') + '}'; }).join('');
      lines.push('Product law — multiply the numbers and <b>add</b> the exponents: ' + t(parts.map(function (X) { return br(rawTex(X)); }).join('') + '=' + cw + vw + '=' + rawTex(R)));
      return R;
    }
    A = SOLV(n.div[0], lines); B = SOLV(n.div[1], lines); R = mdiv(A, B);
    var keys2 = Object.keys(A.v).concat(Object.keys(B.v)).filter(function (k, i, arr) { return arr.indexOf(k) === i && ((A.v[k] && A.v[k][0]) || (B.v[k] && B.v[k][0])); });
    var cw2 = qeq(B.c, 1) ? (qeq(A.c, 1) ? '' : cW(A.c)) : '\\left(' + cTex(A.c, false) + '\\div ' + cW(B.c) + '\\right)';
    var vw2 = keys2.map(function (k) { var a = A.v[k] || [0, 1], b = B.v[k] || [0, 1]; if (!b[0]) return pw(k, a); return k + '^{' + opE(a, b, '-') + '}'; }).join('');
    lines.push('Quotient law — divide the numbers and <b>subtract</b> the exponents: ' + t('\\dfrac{' + rawTex(A) + '}{' + rawTex(B) + '}=' + cw2 + vw2 + '=' + rawTex(R)));
    return R;
  }
  function treeSol(tree) { var lines = []; var R = SOLV(tree, lines); var a = rawTex(R), b = posTex(R); if (a !== b) lines.push('Positive exponents only: ' + t(a + '=' + b) + '.'); return lines.join('<br>'); }
  function treePart(tree, opt) {
    opt = opt || {};
    var A = EVT(tree), pr = TT(tree);
    return lawPart((opt.pre || '') + t(pr), A, (opt.wrongs || []).concat(treeWrongs(tree, A)), treeSol(tree), opt.hints || TREEH, 'simplify ' + pr, { vars: Object.keys(lettersOf(tree)), ord: opt.ord });
  }
  var TREEH = ['Work from the inside out: brackets first (every factor gets the outside exponent), then combine powers of the same base.', 'Product law: add exponents. Quotient law: subtract. Power of a power: multiply. Finish with positive exponents: ' + t('x^{-n}=\\frac{1}{x^{n}}') + '.'];

  /* ================= numbers ================= */
  /* a number answer, or (allowPow) a single power of the base with that value */
  function numOrPow(V, allowPow, rows) {
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (releq(a.val, V)) {
        var top = strip(a.ast);
        if (top.t === 'num' || (top.t === 'neg' && strip(top.a).t === 'num')) return ok();
        if (top.t === 'div' && ex.plainFraction(top)) { var pf = ex.plainFraction(top); return gcd(pf[0], pf[1]) > 1 ? form('lowest', 'Right value — now reduce the fraction to lowest terms.') : ok(); }
        if (allowPow && top.t === 'pow' && strip(top.a).t === 'num') { var e = ex.rat(top.b); if (e && e[1] === 1) return ok(); }
        return form('evaluate', 'Right value — now work it out to a single number' + (allowPow ? ' (or one power)' : '') + '.');
      }
      for (var i = 0; i < (rows || []).length; i++) if (rows[i] && releq(a.val, rows[i][0]) && !releq(rows[i][0], V)) return wrong(rows[i][1], rows[i][2]);
      if (releq(a.val, -V)) return wrong('sign', 'Check the sign.');
      return wrong('value', null);
    };
  }
  function numPart(prompt, V, allowPow, rows, sol, hints, text, keyTex) {
    var p = P.math(prompt, numOrPow(V, allowPow, rows), keyTex || ex.texRat(Q(V * 1e6 % 1 === 0 ? V : V, 1)), sol, hints, text, { keys: 'expo', vars: [] });
    p.bad = (rows || []).filter(function (x) { return x && isFinite(x[0]) && !releq(x[0], V); }).map(function (x) { return String(Math.round(x[0] * 1e9) / 1e9); });
    return p;
  }
  function fracKey(fr) { return ex.texRat(Q(fr)); }

  /* ================= Assignment 10 ================= */
  function q1(r) {
    var g = r.pick([[5, 2, 2], [2, 3, 4], [3, 2, 3], [2, 2, 5], [10, 2, 3], [4, 2, 2], [2, 4, 4], [6, 1, 2], [3, 3, 2], [2, 5, 3], [10, 3, 3], [7, 1, 2], [3, 1, 4], [4, 1, 3], [9, 1, 2], [2, 6, 4], [5, 1, 3], [2, 3, 3], [3, 2, 2], [10, 1, 5]]);
    if (r.chance(0.5)) g = [g[0], g[2], g[1]];
    var b = g[0], m = g[1], n = g[2], V = Math.pow(b, m + n), pr = pw(String(b), m) + '\\times ' + pw(String(b), n);
    return numPart(t(pr), V, false, [[Math.pow(b, m * n), 'mult-exp', MODES['mult-exp']], [Math.pow(b * b, m + n), 'bases-mult', 'Keep the base the same — only the exponents change: ' + t(b + '^{' + m + '}\\times ' + b + '^{' + n + '}=' + b + '^{' + (m + n) + '}') + '.'], [b * (m + n), 'times-exp', t(b + '^{' + (m + n) + '}') + ' means ' + t(b) + ' multiplied by itself ' + (m + n) + ' times.']],
      'Product law: ' + t(pr + '=' + b + '^{' + m + '+' + n + '}=' + b + '^{' + (m + n) + '}=' + F(V)) + '.', ['Same base: add the exponents, then evaluate.'], 'evaluate ' + pr, F(V));
  }
  function q4a(r) {
    var g = r.pick([[9, 6, 4], [2, 9, 4], [3, 7, 3], [5, 6, 3], [10, 8, 5], [4, 7, 4], [7, 5, 3], [6, 5, 3], [2, 12, 5], [3, 8, 4], [8, 7, 5], [11, 5, 3], [10, 9, 6], [2, 10, 3]]), b = g[0], m = g[1], n = g[2], V = Math.pow(b, m - n);
    var pr = '\\dfrac{' + b + '^{' + m + '}}{' + b + '^{' + n + '}}';
    var p = numPart(t(pr), V, true, [[Math.pow(b, m + n), 'sub-wrong', MODES['sub-wrong']], [m % n === 0 ? Math.pow(b, m / n) : NaN, 'div-exp', 'Subtract the exponents — don’t divide them.'], [m - n === 1 ? NaN : b * (m - n), 'times-exp', t(b + '^{' + (m - n) + '}') + ' means ' + t(b) + ' multiplied by itself ' + (m - n) + ' times.']],
      'Quotient law: ' + t(pr + '=' + b + '^{' + m + '-' + n + '}=' + b + '^{' + (m - n) + '}=' + F(V)) + '.', ['Same base: subtract the exponents.'], 'quotient ' + b + '^' + m + '/' + b + '^' + n, F(V));
    p.good = [b + '^{' + (m - n) + '}'];
    return p;
  }
  function q5a(r) {
    var g = r.pick([[3, 2, 3], [2, 3, 2], [2, 2, 4], [5, 2, 2], [10, 2, 3], [2, 5, 2], [4, 3, 2], [3, 3, 2], [2, 2, 3], [6, 1, 3], [2, 3, 3], [10, 3, 2], [7, 2, 1], [9, 1, 3]]), b = g[0], m = g[1], n = g[2], V = Math.pow(b, m * n);
    var pr = '\\left(' + b + '^{' + m + '}\\right)^{' + n + '}';
    var p = numPart(t(pr), V, true, [[m + n !== m * n ? Math.pow(b, m + n) : NaN, 'add-exp', MODES['add-exp']], [Math.pow(b, m) * n, 'coef-times', 'Raise ' + t(b + '^{' + m + '}') + ' to the power ' + t(n) + ' — don’t multiply it by ' + t(n) + '.']],
      'Power of a power: ' + t(pr + '=' + b + '^{' + m + '\\times ' + n + '}=' + b + '^{' + m * n + '}=' + F(V)) + '.', ['Multiply the exponents.'], 'power ' + pr, F(V));
    p.good = [b + '^{' + m * n + '}'];
    return p;
  }
  function q12(r, neg) {
    var b = r.int(2, 12), bt = neg ? '(-' + b + ')^{0}' : b + '^{0}';
    return P.number(t(bt), 1, function (v) { if (v === 0) return { code: 'zero-is-0', hint: 'The exponent ' + t('0') + ' doesn’t make the answer ' + t('0') + ': any nonzero base to the power ' + t('0') + ' is ' + t('1') + '.' }; if (Math.abs(v) === b) return { code: 'zero-is-base', hint: 'An exponent of ' + t('0') + ' means the answer is ' + t('1') + ', whatever the (nonzero) base.' }; if (v === -1) return { code: 'sign', hint: 'The brackets make ' + t('-' + b) + ' the whole base, and any nonzero base to the power ' + t('0') + ' is ' + t('+1') + '.' }; return null; },
      t(bt + '=1') + ': any nonzero base to the power ' + t('0') + ' is ' + t('1') + (neg ? ' — and the brackets make the whole of ' + t('-' + b) + ' the base.' : '.'), ['What is any nonzero number to the power ' + t('0') + '?'], 'zero exponent ' + bt);
  }
  function q13(r, br0) {
    var c = r.int(2, 12), v = r.pick(['g', 'g', 'x', 'k', 'm']), A = M(br0 ? 1 : c, {});
    var pr = br0 ? '(' + c + v + ')^{0}' : c + v + '^{0}';
    var W = br0 ? [[M(c, {}), 'u2l10-zero-part', 'The exponent ' + t('0') + ' belongs to the whole bracket ' + t('(' + c + v + ')') + ', so the whole thing becomes ' + t('1') + '.'], [M(c, mono(v, 1).v), 'zero-is-base', 'Anything (nonzero) to the power ' + t('0') + ' is ' + t('1') + '.']]
      : [[M(1, {}), 'coef-zeroed', 'The exponent ' + t('0') + ' belongs to ' + t(v) + ' only — the ' + t(c) + ' isn’t raised to the power ' + t('0') + '.'], [M(c, mono(v, 1).v), 'zero-is-base', t(v + '^{0}=1') + ', not ' + t(v) + '.']];
    var p = lawPart(t(pr), A, W, br0 ? 'The whole bracket is the base: ' + t(pr + '=1') + '.' : 'Only ' + t(v) + ' has the exponent ' + t('0') + ': ' + t(pr + '=' + c + '\\times 1=' + c) + '.', ['What is the exponent ' + t('0') + ' attached to: just the letter, or the whole bracket?'], 'zero ' + pr, { vars: [v] });
    p.bad.push('0');
    return p;
  }
  function q14a(r) {
    var g = r.pick([[6, 2], [2, 3], [3, 2], [4, 2], [5, 2], [2, 4], [2, 5], [10, 2], [3, 3], [7, 2], [8, 2], [9, 2], [10, 3], [4, 3], [12, 2]]), b = g[0], k = g[1], d = Math.pow(b, k);
    return P.fraction(t(b + '^{-' + k + '}'), [1, d], { diag: function (v) { if (releq(v, -d)) return { code: 'neg-power', hint: 'A negative exponent means <b>reciprocal</b>, not a negative number: ' + t('a^{-n}=\\frac{1}{a^{n}}') + '.' }; if (releq(v, d)) return { code: 'no-recip', hint: 'The exponent is negative, so take the <b>reciprocal</b>: ' + t('\\frac{1}{' + d + '}') + '.' }; if (releq(v, -1 / d)) return { code: 'neg-power', hint: 'A negative exponent never makes the answer negative.' }; if (releq(v, 1 / (b * k)) || releq(v, -b * k)) return { code: 'times-exp', hint: t(b + '^{' + k + '}') + ' means ' + t(b) + ' multiplied by itself ' + k + ' times.' }; return null; } },
      t(b + '^{-' + k + '}=\\frac{1}{' + b + '^{' + k + '}}=\\frac{1}{' + d + '}'), ['A negative exponent means reciprocal: ' + t('a^{-n}=\\frac{1}{a^{n}}') + '.'], 'evaluate ' + b + '^-' + k);
  }
  function q14b(r) {
    var g = r.pick([[4, 3], [2, 3], [3, 2], [5, 2], [2, 5], [10, 3], [3, 3], [6, 2], [2, 4], [7, 2], [9, 2], [4, 2]]), b = g[0], k = g[1], d = Math.pow(b, k);
    return P.fraction(t('\\dfrac{1}{' + b + '^{-' + k + '}}'), [d, 1], { diag: function (v) { if (releq(v, 1 / d)) return { code: 'no-recip', hint: t('\\frac{1}{' + b + '^{-' + k + '}}') + ': the power with the negative exponent moves to the <b>numerator</b> and its exponent becomes positive.' }; if (releq(v, -d) || releq(v, -1 / d)) return { code: 'neg-power', hint: 'A negative exponent means reciprocal — it doesn’t make anything negative.' }; return null; } },
      t('\\frac{1}{' + b + '^{-' + k + '}}=' + b + '^{' + k + '}=' + d) + ' (a power with a negative exponent in the denominator moves up and its exponent becomes positive).', ['Moving a power across the fraction bar changes the sign of its exponent.'], 'evaluate 1/' + b + '^-' + k);
  }
  function q15a(r) {
    var c = r.int(2, 12), k = r.int(2, 6), v = r.pick(['t', 't', 'x', 'p', 'm']), A = M(c, mono(v, -k).v);
    return lawPart(t(c + v + '^{-' + k + '}'), A, [[M(Q(1, c), mono(v, -k).v), 'coef-side', 'Only ' + t(v) + ' has the negative exponent, so only ' + t(v + '^{' + k + '}') + ' moves to the denominator. The ' + t(c) + ' stays on top.'], [M(-c, mono(v, k).v), 'neg-power', 'A negative exponent means reciprocal, not a negative value.'], [M(c, mono(v, k).v), 'no-recip', 'The exponent is negative: ' + t(v + '^{-' + k + '}=\\frac{1}{' + v + '^{' + k + '}}') + '.']],
      'Only ' + t(v) + ' has the exponent ' + t('-' + k) + ': ' + t(c + v + '^{-' + k + '}=' + c + '\\times\\frac{1}{' + v + '^{' + k + '}}=\\frac{' + c + '}{' + v + '^{' + k + '}}') + '.', ['Which base does the exponent ' + t('-' + k) + ' belong to?'], 'positive exp ' + c + v + '^-' + k);
  }
  function q15b(r) {
    var c = r.int(2, 12), k = r.int(2, 6), v = r.pick(['k', 'k', 'y', 'w', 'n']), A = M(c, mono(v, k).v);
    return lawPart(t('\\dfrac{' + c + '}{' + v + '^{-' + k + '}}'), A, [[M(c, mono(v, -k).v), 'no-recip', 'The power ' + t(v + '^{-' + k + '}') + ' is in the denominator: move it to the numerator and make the exponent positive.'], [M(Q(1, c), mono(v, k).v), 'coef-side', 'The ' + t(c) + ' has no negative exponent, so it stays on top.'], [M(-c, mono(v, k).v), 'neg-power', 'A negative exponent doesn’t make anything negative.']],
      t('\\frac{' + c + '}{' + v + '^{-' + k + '}}=' + c + '\\times ' + v + '^{' + k + '}=' + c + v + '^{' + k + '}') + ' (a power with a negative exponent moves across the fraction bar and its exponent becomes positive).', ['Moving a power across the fraction bar changes the sign of its exponent.'], 'positive exp ' + c + '/' + v + '^-' + k);
  }
  /* scientific notation */
  function q18a(r) { var a = r.int(11, 99), k = r.int(3, 6); if (a % 10 === 0) a++; var x = a * Math.pow(10, k - 1), m = a / 10; return sciPart(t(F(x)), x, {}, 'Move the decimal point ' + k + ' places left so the coefficient is between ' + t('1') + ' and ' + t('10') + ': ' + t(F(x) + '=' + m + '\\times 10^{' + k + '}') + '.', ['The coefficient must be at least 1 and less than 10.', 'A large number has a positive power of 10.'], 'sci ' + x); }
  function q18b(r) { var a = r.int(11, 99), k = r.int(2, 5); if (a % 10 === 0) a++; var x = Number((a * Math.pow(10, -k - 1)).toFixed(k + 2)), m = a / 10; return sciPart(t(stdTex(a, -k - 1)), x, {}, 'Move the decimal point ' + (k) + ' places right so the coefficient is between ' + t('1') + ' and ' + t('10') + ': ' + t(stdTex(a, -k - 1) + '=' + m + '\\times 10^{-' + k + '}') + '.', ['A number between 0 and 1 has a negative power of 10.'], 'sci ' + x); }
  function q19(r, neg) {
    var a = neg ? r.int(1, 9) : r.int(11, 99), k = neg ? r.int(3, 6) : r.int(3, 6), m = neg ? String(a) : String(a / 10), e = neg ? -k : k, x = neg ? Number((a * Math.pow(10, -k)).toFixed(k + 1)) : a * Math.pow(10, k - 1);
    var st = neg ? stdTex(a, -k) : stdTex(a, k - 1);
    var p = P.math(t(m + '\\times 10^{' + e + '}'), stdChk(x), st, (neg ? 'A negative power of 10 makes the number small: move the decimal point ' + k + ' places <b>left</b>: ' : 'Move the decimal point ' + k + ' places <b>right</b>: ') + t(m + '\\times 10^{' + e + '}=' + st) + '.', ['The exponent tells you how many places to move the decimal point.'], 'standard ' + m + 'e' + e, { keys: 'decimal' });
    p.bad = [String(x * 10), String(x / 10)];
    return p;
  }
  var TINY = [{ what: 'A dust mite', who: 'dust mites', a: [2, 3], k: 4 }, { what: 'A grain of pollen', who: 'pollen grains', a: [2.5, 2, 4, 5], k: 5 }, { what: 'A grain of fine sand', who: 'grains of sand', a: [2, 3, 4], k: 4 },
    { what: 'A bacterium', who: 'bacteria', a: [2, 4, 5], k: 6 }, { what: 'A human hair', who: 'hairs, side by side,', a: [5, 8, 6], k: 5 }, { what: 'A red blood cell', who: 'red blood cells', a: [8, 7.5, 6], k: 6 }];
  function q20(r) {
    var o = r.pick(TINY), a = r.pick(o.a), mult = r.pick([2, 3, 4, 5, 6]), base = a * mult, D = Number((base / 10).toPrecision(6)), N = mult * Math.pow(10, o.k - 1), L = a * Math.pow(10, -o.k);
    var Dt = String(D), at = a % 1 ? String(a) : a + '.0', lt = at + '\\times 10^{-' + o.k + '}';
    var p = P.math(o.what + ' is about ' + t(lt) + ' m long. About how many ' + o.who + ' laid end to end would span a length of ' + t(Dt) + ' m?', anyNumDiag(N, [[L / D, 'u2l10-count', 'Divide the total length by the length of one: ' + t('\\frac{' + Dt + '}{' + lt + '}') + '.'], [D * L, 'u2l10-count', 'Divide (how many lengths fit), don’t multiply.']]), F(N),
      'Number that fit ' + t('=\\dfrac{\\text{total length}}{\\text{one length}}=\\dfrac{' + Dt + '}{' + lt + '}') + '. Write ' + t(Dt + '=' + sciTexOf(D)) + ', then divide the coefficients and subtract the exponents: ' + t('\\dfrac{' + sciTexOf(D) + '}{' + lt + '}=' + sciTexOf(N) + '=' + F(N)) + '.',
      ['How many times does one length fit into the total? Divide.', 'Write both in scientific notation, then use the quotient law on the powers of 10.'], 'how many ' + Dt + '/' + lt, { keys: 'sci' });
    p.good = [sciTexOf(N)]; p.bad = [String(N * 10), String(N / 10)];
    return p;
  }
  function sciTexOf(x) { var p = K.sciParts(x); return p.a + '\\times 10^{' + p.n + '}'; }
  function anyNumDiag(x, rows) { var base = anyNum(x); return function (resp) { var res = base(resp); if (res.v === 'correct') return res; var a = K.read(resp); if (a.ast) for (var i = 0; i < rows.length; i++) if (releq(a.val, rows[i][0])) return wrong(rows[i][1], rows[i][2]); return res; }; }
  function q22(r) {
    var a = r.int(2, 10), c = r.pick([2, 2, 3, 4, 5, 5, 10]), p = a * a, q = -c * c * c, V = Q(a * a * a * c * c - 1, c * c), term = Q(1, c * c);
    var dec = c !== 3, keyTex = dec ? String(Number((qv(V)).toFixed(6))) : ex.texRat(V);
    var p2 = P.math('If ' + t('p=' + p) + ' and ' + t('q=' + q) + ', determine the exact value of ' + t('p^{3/2}-q^{-2/3}') + '.', K.fraction(V, { decimalOk: true, diag: function (v) {
      if (releq(v, a * a * a + qv(term))) return { code: 'u2l10-odd-root-sign', hint: t('(' + q + ')^{-2/3}=\\dfrac{1}{\\left(' + rootTex(3, q) + '\\right)^{2}}=\\dfrac{1}{(-' + c + ')^{2}}=+\\dfrac{1}{' + c * c + '}') + ': the square makes it positive, and it is subtracted.' };
      if (releq(v, a * a * a - c * c) || releq(v, a * a * a + c * c)) return { code: 'no-recip', hint: 'The exponent on ' + t('q') + ' is negative: take the <b>reciprocal</b>, ' + t('q^{-2/3}=\\frac{1}{q^{2/3}}') + '.' };
      if (releq(v, Math.pow(a, 3))) return { code: 'value', hint: 'You have ' + t('p^{3/2}') + '. Now subtract ' + t('q^{-2/3}') + '.' };
      return null;
    } }), keyTex,
      t('p^{3/2}=' + p + '^{3/2}=\\left(\\sqrt{' + p + '}\\right)^{3}=' + a + '^{3}=' + a * a * a) + '<br>' + t('q^{-2/3}=(' + q + ')^{-2/3}=\\dfrac{1}{\\left(' + rootTex(3, String(q)) + '\\right)^{2}}=\\dfrac{1}{(-' + c + ')^{2}}=\\dfrac{1}{' + c * c + '}') + ' (the cube root of a negative number is negative; squaring makes it positive)<br>' + t(a * a * a + '-\\dfrac{1}{' + c * c + '}=' + ex.texRat(V) + (dec ? '=' + keyTex : '')),
      ['Substitute, then evaluate each power root first. A negative exponent means reciprocal.', 'The cube root of a negative number is negative: ' + t(rootTex(3, '-8') + '=-2') + '.'], 'p^3/2-q^-2/3 at ' + p + ',' + q, { keys: 'fraction' });
    p2.good = [ex.texRat(V)]; p2.bad = [String(Number((a * a * a + qv(term)).toFixed(6)))];
    return p2;
  }
  function q24shared(r) { var e = r.pick([[7, -3, 4], [5, -2, 3], [9, -5, 4], [3, -1, 2], [8, -3, 5], [5, -3, 2], [7, -4, 3], [11, -7, 4]]), s = pickWhere(r, function () { return r.int(11, 99) * Math.pow(10, r.int(2, 5)); }, function (x) { return String(x).replace(/0+$/, '').length === 2; }) || 810000; return { a: [e[0], e[2]], b: [e[1], e[2]], s: s, v: r.pick(['s', 's', 'x', 'k']) }; }
  function q25shared(r) {
    return pickWhere(r, function () { var a = r.pick([2, 3, 4, 5, 6, 8]), k = r.pick([1, 2, 3]), R = r.pick([128, 64, 250, 400, 120, 32, 75, 160, 48, 200, 25, 80, 36]); return { a: a, k: k, R: R, A: a * a * Math.pow(10, 2 * k), N: R * a * a * Math.pow(10, 2 * k), what: r.pick(['transistors', 'transistors', 'sensors', 'memory cells']) }; },
      function (o) { var s = String(K.sciParts(o.N).a); return s.replace('.', '').length <= 3 && o.N < 1e12; }) || { a: 5, k: 2, R: 128, A: 250000, N: 3.2e7, what: 'transistors' };
  }

  /* ================= Extra Practice 10 ================= */
  function e1a(r) { // ((c x^p)^k · x^{-q}) / (d x^0)
    var g = pickWhere(r, function () { var c = r.pick([2, 3]), k = r.pick([2, 3]), p = r.pick([2, 3]); var ck = Math.pow(c, k), ds = [2, 3, 4, 6, 8, 9, 12, 16, 18, 27].filter(function (d) { return ck % d === 0 && d < ck; }); return { c: c, k: k, p: p, q: r.int(1, p * k - 1), d: ds.length ? r.pick(ds) : 0 }; }, function (o) { return o.d > 0 && o.q !== o.p; }) || { c: 3, k: 3, p: 2, q: 4, d: 9 };
    var x = r.pick(['x', 'x', 'y', 'a']), tree = Dv(Mu(Pw(Lf(g.c, mono(x, g.p).v), g.k), Lf(1, mono(x, -g.q).v)), Lf(g.d, {}, g.d + x + '^{0}'));
    tree.div[1].zero = x + '^{0}';
    return treePart(tree);
  }
  function e1b(r) { // (c a^{-s} b^{t})^{-2} / (d a^0 b^{-u})
    var g = pickWhere(r, function () { return { c: r.pick([2, 3]), s: r.int(1, 3), t: r.int(1, 3), u: r.int(1, 6), d: r.pick([2, 3, 4, 5, 8]) }; }, function (o) { return o.u - 2 * o.t !== 0 && Math.pow(o.c, 2) * o.d <= 50; }) || { c: 2, s: 3, t: 2, u: 5, d: 8 };
    var L = r.pick([['a', 'b'], ['a', 'b'], ['x', 'y'], ['m', 'n']]), v1 = {}, v2 = {}; v1[L[0]] = -g.s; v1[L[1]] = g.t; v2[L[1]] = -g.u;
    var den = Lf(g.d, v2, g.d + L[0] + '^{0}' + L[1] + '^{-' + g.u + '}'); den.zero = L[0] + '^{0}';
    return treePart(Dv(Pw(Lf(g.c, v1), -2), den), { ord: L });
  }
  function e1c(r) { // (c m^p / m^{-q})^{-2} × d m^w
    var g = pickWhere(r, function () { return { c: r.pick([2, 3, 4]), p: r.int(2, 5), q: r.int(1, 2), d: r.pick([8, 16, 32, 18, 27, 64, 48, 9]), w: r.int(2, 8) }; }, function (o) { var cc = o.c * o.c; return o.d % cc === 0 && o.d !== cc && o.w !== 2 * (o.p + o.q); }) || { c: 4, p: 5, q: 1, d: 32, w: 6 };
    var m = r.pick(['m', 'm', 'k', 'z']);
    return treePart(Mu(Pw(Dv(Lf(g.c, mono(m, g.p).v), Lf(1, mono(m, -g.q).v)), -2), Lf(g.d, mono(m, g.w).v)));
  }
  function e2(r, which) {
    var x = r.pick(['x', 'y', 't', 'w']);
    if (which === 'a') { var g = r.pick([[[1, 2], 4, -3], [[1, 3], 6, -3], [[1, 2], 6, -4], [[2, 3], 3, -1], [[1, 4], 8, -3], [[3, 2], 2, -4], [[1, 3], 3, -2]]); return treePart(Mu(Pw(Lf(1, mono(x, g[0]).v), g[1]), Lf(1, mono(x, g[2]).v))); }
    if (which === 'b') { var h = r.pick([[[3, 4], [-1, 4], -1], [[2, 3], [-1, 3], -1], [[5, 6], [-1, 6], -2], [[3, 4], [1, 4], -1], [[1, 2], [-3, 2], -2], [[4, 5], [-2, 5], -1]]); return treePart(Dv(Mu(Lf(1, mono(x, h[0]).v), Lf(1, mono(x, h[1]).v)), Lf(1, mono(x, h[2]).v))); }
    var k = r.pick([[[-2, 3], -6, 5], [[-3, 4], -4, 4], [[-1, 2], -6, 4], [[-2, 5], -10, 5], [[-1, 3], -9, 4], [[-3, 2], -2, 4]]);
    return treePart(Dv(Pw(Lf(1, mono(x, k[0]).v), k[1]), Lf(1, mono(x, k[2]).v)));
  }
  function e3(r, which) {
    var L = which === 'a' ? r.pick([['x', 'y'], ['x', 'y'], ['a', 'b']]) : r.pick([['a', 'b'], ['a', 'b'], ['m', 'n']]);
    var tree, n = which === 'a' ? 3 : 4, pq = which === 'a' ? r.pick([[27, 8], [8, 27], [64, 27], [27, 64], [8, 125], [125, 8], [1, 8], [64, 1]]) : r.pick([[16, 81], [81, 16], [1, 16], [16, 1], [81, 1]]);
    var e = which === 'a' ? Q(-2, 3) : Q(-3, 4);
    if (which === 'a') { var k1 = 3 * r.pick([1, 1, 2]), k2 = 3 * r.pick([1, 2]), k3 = 3 * r.pick([1, 2]), v1 = {}, v2 = {}; v1[L[0]] = -k1; v1[L[1]] = k2; v2[L[0]] = k3; tree = Pw(Dv(Lf(pq[0], v1), Lf(pq[1], v2)), e); }
    else { var j1 = 4 * r.pick([1, 2]), j2 = 4 * r.pick([1, 1, 2]), w1 = {}, w2 = {}; w1[L[0]] = j1; w2[L[1]] = -j2; tree = Pw(Dv(Lf(pq[0], w1), Lf(pq[1], w2)), e); }
    return treePart(tree, { ord: L, hints: ['Simplify inside the bracket first. A negative outside exponent: flip the fraction, then make the exponent positive.', 'Then the denominator of the exponent is a root and the numerator a power — apply both to every factor (numbers too).'] });
  }
  function e4a(r) { var b = r.pick([2, 3, 5, 10]), g = pickWhere(r, function () { return [r.int(2, 7), -r.int(1, 5)]; }, function (x) { var s = x[0] + x[1]; return s >= 1 && s <= (b === 2 ? 5 : b === 3 ? 3 : 2); }) || [5, -3], e = g[0] + g[1], V = Math.pow(b, e), pr = '\\dfrac{' + b + '^{' + g[0] + '}\\times ' + b + '^{' + g[1] + '}}{' + b + '^{0}}';
    return numPart(t(pr), V, false, [[Math.pow(b, g[0] - g[1]), 'neg-power', 'Adding a negative exponent: ' + t(g[0] + '+(' + g[1] + ')=' + e) + '.'], [0, 'zero-is-0', t(b + '^{0}=1') + ', so dividing by it changes nothing.'], [Math.pow(b, g[0] * g[1]), 'mult-exp', MODES['mult-exp']]],
      'Product and quotient laws on the exponents: ' + t(pr + '=' + b + '^{' + g[0] + '+(' + g[1] + ')-0}=' + b + '^{' + e + '}=' + V) + '.', ['Combine the exponents first, then evaluate.'], 'evaluate ' + pr, String(V)); }
  function e4d(r) { var b = r.pick([3, 2, 5, 10]), g = pickWhere(r, function () { return [-r.int(1, 3), r.int(2, 5), r.int(1, 4)]; }, function (x) { var s = x[0] + x[1] - x[2]; return s === -1 || (s === -2 && b < 5); }) || [-2, 4, 3], e = g[0] + g[1] - g[2], V = Q(1, Math.pow(b, -e));
    var pr = '\\dfrac{' + b + '^{' + g[0] + '}\\times ' + b + '^{' + g[1] + '}}{' + b + '^{0}\\times ' + b + '^{' + g[2] + '}}';
    return P.fraction(t(pr), V, { diag: function (v) { if (releq(v, Math.pow(b, -e))) return { code: 'no-recip', hint: 'The total exponent is ' + t(e) + ' (negative): take the reciprocal.' }; if (releq(v, -Math.pow(b, -e)) || releq(v, -qv(V))) return { code: 'neg-power', hint: 'A negative exponent means reciprocal, not a negative number.' }; return null; } },
      t(pr + '=' + b + '^{' + g[0] + '+' + g[1] + '-0-' + g[2] + '}=' + b + '^{' + e + '}=\\frac{1}{' + Math.pow(b, -e) + '}'), ['Add the exponents on top, subtract the ones on the bottom; ' + t(b + '^{0}=1') + '.'], 'evaluate ' + pr); }
  function e5c(r) { var g = r.pick([[25, 2], [9, 2], [16, 2], [4, 2], [36, 2], [100, 2], [8, 3], [27, 3]]), B = g[0], n = g[1], pr = B + '^{1/' + n + '}\\times ' + B + '^{-' + (n + 1) + '/' + n + '}';
    return P.fraction(t(pr), [1, B], { diag: function (v) { if (releq(v, B)) return { code: 'no-recip', hint: 'The total exponent is ' + t('-1') + ': ' + t(B + '^{-1}=\\frac{1}{' + B + '}') + '.' }; if (releq(v, -B) || releq(v, -1 / B)) return { code: 'neg-power', hint: 'A negative exponent means reciprocal, not negative.' }; return null; } },
      'Product law first: ' + t(pr + '=' + B + '^{\\frac{1}{' + n + '}-\\frac{' + (n + 1) + '}{' + n + '}}=' + B + '^{-1}=\\frac{1}{' + B + '}') + '.', ['Add the exponents before evaluating.'], 'evaluate ' + pr); }
  function e5d(r) { var b = r.pick([2, 2, 3, 10]), k = r.pick([2, 3, 4]), j = r.int(1, 3), e = k - j, pr = '\\dfrac{\\left(' + b + '^{-1}\\right)^{-' + k + '}}{' + b + '^{' + j + '}\\times ' + b + '^{0}}';
    if (e <= 0) { k = j + 2; e = 2; pr = '\\dfrac{\\left(' + b + '^{-1}\\right)^{-' + k + '}}{' + b + '^{' + j + '}\\times ' + b + '^{0}}'; }
    var V = Math.pow(b, e);
    return numPart(t(pr), V, false, [[Math.pow(b, -k - j), 'neg-power', t('(-1)\\times(-' + k + ')=+' + k) + ': two negatives multiply to a positive.'], [Math.pow(b, k + j), 'sub-wrong', MODES['sub-wrong']], [0, 'zero-is-0', t(b + '^{0}=1') + '.']],
      t(pr + '=\\dfrac{' + b + '^{' + k + '}}{' + b + '^{' + j + '}\\times 1}=' + b + '^{' + k + '-' + j + '}=' + b + '^{' + e + '}=' + V) + '.', ['Power of a power: ' + t('(-1)\\times(-' + k + ')') + '.'], 'evaluate ' + pr, String(V)); }
  function e6shared(r) { return { p: r.pick([16, 16, 81, 625, 16]), q: -r.pick([8, 27, 27, 64, 125]), rr: r.int(2, 9) }; }
  function e6stem(sh) { return 'Let ' + t('p=' + sh.p) + ', ' + t('q=' + sh.q) + ' and ' + t('r=' + sh.rr) + '. Evaluate each expression exactly.'; }
  function e6b(r, sh) { var c = iroot(-sh.q, 3), V = c * c + 1;
    return P.number(t('q^{2/3}+r^{0}'), V, function (v) { if (v === -c * c + 1) return { code: 'u2l10-odd-root-sign', hint: t(rootTex(3, sh.q) + '=-' + c) + ', and ' + t('(-' + c + ')^{2}=' + c * c) + ' is positive.' }; if (v === c * c + sh.rr || v === c * c) return { code: 'zero-is-base', hint: t('r^{0}=1') + ' for any nonzero ' + t('r') + '.' }; return null; },
      t('q^{2/3}=\\left(' + rootTex(3, String(sh.q)) + '\\right)^{2}=(-' + c + ')^{2}=' + c * c) + ' and ' + t('r^{0}=' + sh.rr + '^{0}=1') + ', so the sum is ' + t(V) + '.', ['The cube root of a negative number is negative; then square it.'], 'q^2/3+r^0 q=' + sh.q); }
  function e6c(r, sh) { var a = iroot(sh.p, 2) || Math.sqrt(sh.p), c = iroot(-sh.q, 3), V = Q(-a, c);
    return P.fraction(t('p^{1/2}\\cdot q^{-1/3}'), V, { diag: function (v) { if (releq(v, a / c)) return { code: 'u2l10-odd-root-sign', hint: t(rootTex(3, String(sh.q)) + '=-' + c) + ': the cube root of a negative number is negative, so the answer is negative.' }; if (releq(v, -a * c)) return { code: 'no-recip', hint: t('q^{-1/3}=\\frac{1}{q^{1/3}}') + ': take the reciprocal.' }; return null; } },
      t('p^{1/2}=\\sqrt{' + sh.p + '}=' + a) + ' and ' + t('q^{-1/3}=\\frac{1}{' + rootTex(3, String(sh.q)) + '}=\\frac{1}{-' + c + '}=-\\frac{1}{' + c + '}') + ', so ' + t(a + '\\times\\left(-\\frac{1}{' + c + '}\\right)=' + ex.texRat(V)) + '.', ['Evaluate each power, then multiply.'], 'p^1/2 q^-1/3'); }
  function sciVal(a, e) { return Number((a * Math.pow(10, e)).toPrecision(12)); }
  function e7a(r) { var g = r.pick([[4, 8], [6, 9], [2, 2], [3, 9], [4, 2], [8, 4], [6, 4], [3, 3], [5, 5], [9, 3]]), a = g[0], d = g[1], m = r.int(3, 7), n = r.int(2, 5), num = a * a, res = num / d, e = 2 * m + n, x = sciVal(res, e);
    var pr = '\\dfrac{\\left(' + a + '\\times 10^{' + m + '}\\right)^{2}}{' + d + '\\times 10^{-' + n + '}}';
    return sciPart(t(pr), x, { diag: function (v) { if (releq(v, sciVal(res, m + 2 + n)) || releq(v, sciVal(res, 2 * m - n))) return { code: 'exp', hint: 'Check the power of 10: squaring doubles ' + t(m) + ', and dividing by ' + t('10^{-' + n + '}') + ' <b>adds</b> ' + t(n) + '.' }; if (releq(v, sciVal(2 * a / d, e))) return { code: 'coef-not-raised', hint: 'Square the ' + t(a) + ' too: ' + t(a + '^{2}=' + num) + '.' }; return null; } },
      'Numerator: ' + t('\\left(' + a + '\\times 10^{' + m + '}\\right)^{2}=' + num + '\\times 10^{' + 2 * m + '}') + '.<br>Divide: ' + t('\\dfrac{' + num + '}{' + d + '}\\times 10^{' + 2 * m + '-(-' + n + ')}=' + res + '\\times 10^{' + e + '}' + (res >= 10 || res < 1 ? '=' + sciTexOf(x) : '')) + '.', ['Power of a product on the top, then divide the coefficients and subtract the exponents of 10.', 'Make sure the final coefficient is between 1 and 10.'], 'sci ' + pr); }
  function e7b(r) { var a = r.pick([2, 3, 4, 5]), m = r.int(2, 5), d = r.pick([2, 3, 4, 5, 6, 8]), n = r.int(1, 3), cu = a * a * a, prod = cu * d, e = -3 * m + n, x = sciVal(prod, e);
    var pr = '\\dfrac{\\left(' + a + '\\times 10^{-' + m + '}\\right)^{3}}{\\left(' + d + '\\times 10^{' + n + '}\\right)^{-1}}';
    return sciPart(t(pr), x, { diag: function (v) { if (releq(v, sciVal(cu / d, -3 * m - n))) return { code: 'no-recip', hint: 'Dividing by ' + t('(\\ldots)^{-1}') + ' is the same as <b>multiplying</b> by the bracket: ' + t('\\frac{1}{u^{-1}}=u') + '.' }; return null; } },
      'Top: ' + t('\\left(' + a + '\\times 10^{-' + m + '}\\right)^{3}=' + cu + '\\times 10^{-' + 3 * m + '}') + '. Dividing by ' + t('\\left(' + d + '\\times 10^{' + n + '}\\right)^{-1}') + ' means multiplying by ' + t(d + '\\times 10^{' + n + '}') + '.<br>' + t(cu + '\\times ' + d + '\\times 10^{-' + 3 * m + '+' + n + '}=' + prod + '\\times 10^{' + e + '}=' + sciTexOf(x)) + '.', ['A power with exponent ' + t('-1') + ' in the denominator moves up to the numerator.', 'Renormalize so the coefficient is between 1 and 10.'], 'sci ' + pr); }
  function e8a(r) { var g = r.pick([[2.5, '0.16', 0.16], [2, '0.25', 0.25], [4, '0.0625', 0.0625], [5, '0.04', 0.04], [8, '0.015625', 0.015625], [1.25, '0.64', 0.64]]), k = r.int(2, 5), x = sciVal(g[2], 2 * k), mt = g[0] % 1 ? String(g[0]) : String(g[0]);
    var pr = '\\left(' + mt + '\\times 10^{-' + k + '}\\right)^{-2}';
    return sciPart(t(pr), x, { diag: function (v) { if (releq(v, sciVal(g[0] * g[0], -2 * k))) return { code: 'no-recip', hint: 'The exponent is ' + t('-2') + ': square, then take the <b>reciprocal</b>.' }; if (releq(v, sciVal(1 / (g[0] * g[0]), -2 * k))) return { code: 'exp', hint: 'The power of 10 also flips: ' + t('\\left(10^{-' + k + '}\\right)^{-2}=10^{' + 2 * k + '}') + '.' }; return null; } },
      t(pr + '=\\dfrac{1}{\\left(' + mt + '\\times 10^{-' + k + '}\\right)^{2}}=\\dfrac{1}{' + Number((g[0] * g[0]).toFixed(6)) + '\\times 10^{-' + 2 * k + '}}=' + g[1] + '\\times 10^{' + 2 * k + '}=' + sciTexOf(x)) + '.', ['Negative exponent → reciprocal. Square the coefficient and the power of 10.', 'Renormalize the coefficient.'], 'sci ' + pr); }
  function e8b(r) { var s = r.int(2, 9), j = r.int(2, 5), odd = s > 3 && r.chance(0.5), inner = odd ? Number((s * s / 10).toFixed(2)) : s * s, ie = odd ? -2 * j + 1 : -2 * j, x = sciVal(s, -j);
    var pr = '\\sqrt{' + inner + '\\times 10^{' + ie + '}}';
    return sciPart(t(pr), x, { diag: function (v) { if (releq(v, sciVal(s, ie))) return { code: 'root-only', hint: 'Take the square root of the power of 10 too: ' + t('\\left(10^{' + (odd ? -2 * j : ie) + '}\\right)^{1/2}=10^{' + (-j) + '}') + '.' }; return null; } },
      'Write the root as the exponent ' + t('\\frac{1}{2}') + (odd ? ' and make the exponent of 10 even first: ' + t(inner + '\\times 10^{' + ie + '}=' + s * s + '\\times 10^{' + (-2 * j) + '}') : '') + '.<br>' + t('\\left(' + s * s + '\\times 10^{' + (-2 * j) + '}\\right)^{1/2}=' + s + '\\times 10^{' + (-j) + '}') + '.', ['A square root is the power ' + t('\\frac{1}{2}') + ': halve the exponent of 10.'], 'sci ' + pr); }
  var MASS = [{ big: 'A proton', bm: [1.67, -27], small: 'an electron', sm: [9.11, -31] }, { big: 'A neutron', bm: [1.68, -27], small: 'an electron', sm: [9.11, -31] }, { big: 'Earth', bm: [5.97, 24], small: 'the Moon', sm: [7.35, 22] }, { big: 'The Sun', bm: [1.99, 30], small: 'Earth', sm: [5.97, 24] }, { big: 'Jupiter', bm: [1.9, 27], small: 'Earth', sm: [5.97, 24] }, { big: 'Saturn', bm: [5.68, 26], small: 'Earth', sm: [5.97, 24] }];
  function e9(r) { var o = r.pick(MASS), x = o.bm[0] / o.sm[0] * Math.pow(10, o.bm[1] - o.sm[1]), bt = o.bm[0] + '\\times 10^{' + o.bm[1] + '}', st = o.sm[0] + '\\times 10^{' + o.sm[1] + '}';
    var p = sciPart(o.big + ' has a mass of about ' + t(bt) + ' kg, and ' + o.small + ' about ' + t(st) + ' kg. How many times more massive is ' + o.big.charAt(0).toLowerCase() + o.big.slice(1) + ' than ' + o.small + '? Give your answer in scientific notation, rounded to three significant digits. <i>(You may use a calculator for the division.)</i>', x, { sig: 3 },
      'Divide: ' + t('\\dfrac{' + bt + '}{' + st + '}=\\dfrac{' + o.bm[0] + '}{' + o.sm[0] + '}\\times 10^{' + o.bm[1] + '-(' + o.sm[1] + ')}\\approx ' + Number((o.bm[0] / o.sm[0]).toPrecision(4)) + '\\times 10^{' + (o.bm[1] - o.sm[1]) + '}\\approx ' + K.sciTex(x, 3)) + '.', ['Divide the coefficients (calculator) and subtract the exponents of 10.', 'Renormalize if the coefficient is less than 1.'], 'ratio ' + o.big);
    return p; }

  var EXTRA = [
    { num: '1', section: 'Extra practice A — Multi-law simplification', stem: 'Simplify. Clear the brackets first, then combine matching bases, and clean up zero and negative exponents last. Positive exponents only.', parts: [
      { id: 'e1a', level: 'PRG', make: e1a }, { id: 'e1b', level: 'ADV', make: e1b }, { id: 'e1c', level: 'ADV', make: e1c }] },
    { num: '2', stem: 'Simplify. Here the rational exponents meet the product, quotient and power laws. Positive exponents only.', parts: [
      { id: 'e2a', level: 'PRG', make: function (r) { return e2(r, 'a'); } }, { id: 'e2b', level: 'PRG', make: function (r) { return e2(r, 'b'); } }, { id: 'e2c', level: 'PRG', make: function (r) { return e2(r, 'c'); } }] },
    { num: '3', stem: '<b>Stretch.</b> A negative <i>rational</i> exponent outside a quotient: simplify inside, flip the fraction, then apply the root and the power to every factor.', parts: [
      { id: 'e3a', level: 'MAS', make: function (r) { return e3(r, 'a'); } }, { id: 'e3b', level: 'MAS', make: function (r) { return e3(r, 'b'); } }] },
    { num: '4', section: 'Extra practice B — Evaluating: several laws, one number', stem: 'Evaluate. Collapse the powers with the laws <b>before</b> you reach for arithmetic.', parts: [
      { id: 'e4a', level: 'EMG', make: e4a },
      { id: 'e4b', level: 'PRG', make: function (r) { var ab = r.pick(coprimePairs(1, 5)); return EV({ base: [Math.pow(ab[0], 3), Math.pow(ab[1], 3)], m: -2, n: 3 }); } },
      { id: 'e4c', level: 'PRG', make: function (r) { var cm = r.pick([[2, 3], [3, 3], [2, 1], [3, 1], [2, 5], [10, 3]]); return EV({ base: [Math.pow(cm[0], 4), 1], m: -cm[1], n: 4 }); } },
      { id: 'e4d', level: 'PRG', make: e4d }] },
    { num: '5', stem: 'Evaluate. Watch the negative bases and the reciprocals.', parts: [
      { id: 'e5a', level: 'PRG', make: function (r) { var cm = r.pick([[2, 2], [3, 2], [4, 2], [5, 2], [2, 1], [3, 1], [2, 4], [10, 2]]); return EV({ base: [-Math.pow(cm[0], 3), 1], m: -cm[1], n: 3 }); } },
      { id: 'e5b', level: 'PRG', make: function (r) { var g = r.pick([[4, 2, 3], [9, 2, 3], [4, 2, 5], [25, 2, 3], [8, 3, 2], [27, 3, 2], [16, 4, 3], [16, 2, 3]]); return EV({ base: [1, g[0]], m: -g[2], n: g[1] }); } },
      { id: 'e5c', level: 'PRG', make: e5c },
      { id: 'e5d', level: 'PRG', make: e5d }] },
    { num: '6', stem: e6stem, shared: e6shared, parts: [
      { id: 'e6a', level: 'PRG', make: function (r, sh) { var n = sh.p === 16 ? 4 : 4, c = iroot(sh.p, 4), m = r.pick([3, 1, 3]); return EV({ base: [sh.p, 1], m: -m, n: 4, prompt: 'p^{-' + m + '/4}', sbtex: String(sh.p) }); } },
      { id: 'e6b', level: 'PRG', make: e6b }, { id: 'e6c', level: 'ADV', make: e6c }] },
    { num: '7', section: 'Extra practice C — Scientific notation meets the laws', stem: 'Evaluate, giving each answer in <b>proper</b> scientific notation (no calculator).', parts: [
      { id: 'e7a', level: 'PRG', make: e7a }, { id: 'e7b', level: 'ADV', make: e7b }] },
    { num: '8', stem: 'Evaluate, giving each answer in proper scientific notation. In part (b), rewrite the root as a rational exponent first.', parts: [
      { id: 'e8a', level: 'ADV', make: e8a }, { id: 'e8b', level: 'PRG', make: e8b }] },
    { num: '9', stem: '', parts: [{ id: 'e9', level: 'PRG', make: e9 }] },
    { num: '10', section: 'Extra practice D — Reasoning and error analysis', stem: function (sh) { return 'A student simplified ' + t(sh.expr) + ' as shown below. <b>Exactly one step is wrong.</b>\\[\\begin{array}{ll}\\text{Step 1:}&' + sh.s1 + '\\\\[2pt]\\text{Step 2:}&' + sh.s2 + '\\\\[2pt]\\text{Step 3:}&' + sh.s3 + '\\end{array}\\]'; },
      shared: function (r) {
        var g = r.pick([[2, 3, 2, 4], [2, 3, 3, 2], [3, 2, 2, 3], [2, 2, 2, 4], [3, 3, 1, 3], [2, 3, 1, 2], [3, 2, 1, 2], [2, 2, 3, 2]]), c = g[0], p = g[1], k = g[2], e = g[3], d = c * c * k, q = 2 * p - 1, x = r.pick(['x', 'x', 'a', 'y']);
        var kk = Q(k, e), s2v = ex.texRat(Q(k, 1));
        return { c: c, p: p, k: k, e: e, d: d, q: q, x: x, ans: kk, expr: '\\dfrac{\\left(' + c + x + '^{' + p + '}\\right)^{-2}\\times ' + d + x + '^{' + q + '}}{' + e + x + '^{-1}}',
          s1: '\\left(' + c + x + '^{' + p + '}\\right)^{-2}=' + c + '^{-2}' + x + '^{-' + 2 * p + '}=\\frac{1}{' + c * c + x + '^{' + 2 * p + '}}',
          s2: '\\frac{1}{' + c * c + x + '^{' + 2 * p + '}}\\times ' + d + x + '^{' + q + '}=\\frac{' + d + x + '^{' + q + '}}{' + c * c + x + '^{' + 2 * p + '}}=\\frac{' + s2v + '}{' + x + '}',
          s3: '\\frac{' + s2v + '}{' + x + '}\\div ' + e + x + '^{-1}=\\frac{' + s2v + '}{' + x + '}\\times\\frac{1}{' + e + x + '}=\\frac{' + k + '}{' + e + x + '^{2}}' + (gcd(k, e) > 1 ? '=' + posTex(M(Q(k, e), mono(x, -2).v)) : '') };
      },
      parts: [
        { id: 'e10a', level: 'PRG', make: function (r, sh) {
          return mc(r, 'Which step is wrong, and why?', [
            { html: '<b>Step 3:</b> dividing by ' + t(sh.e + sh.x + '^{-1}') + ' means multiplying by ' + t('\\frac{' + sh.x + '}{' + sh.e + '}') + ' — the ' + t(sh.x + '^{-1}') + ' is already a reciprocal, so ' + t(sh.x) + ' moves to the <b>top</b>.', right: true },
            { html: '<b>Step 1:</b> ' + t('\\left(' + sh.c + sh.x + '^{' + sh.p + '}\\right)^{-2}') + ' should be ' + t('-' + sh.c * sh.c + sh.x + '^{' + 2 * sh.p + '}') + '.', why: 'A negative exponent means reciprocal, not a negative value — Step 1 is right.' },
            { html: '<b>Step 2:</b> the exponents should be multiplied: ' + t(sh.x + '^{' + sh.q + '\\times ' + 2 * sh.p + '}') + '.', why: 'Dividing powers of the same base subtracts the exponents: ' + t(sh.x + '^{' + sh.q + '-' + 2 * sh.p + '}=' + sh.x + '^{-1}') + '. Step 2 is right.' },
            { html: '<b>Step 1:</b> the ' + t(sh.c) + ' shouldn’t be raised to the power ' + t('-2') + '.', why: 'Every factor inside the bracket gets the exponent, numbers too. Step 1 is right.' }],
            '<b>Step 3</b> is wrong. ' + t(sh.e + sh.x + '^{-1}=\\frac{' + sh.e + '}{' + sh.x + '}') + ', and dividing by ' + t('\\frac{' + sh.e + '}{' + sh.x + '}') + ' means multiplying by ' + t('\\frac{' + sh.x + '}{' + sh.e + '}') + ', not by ' + t('\\frac{1}{' + sh.e + sh.x + '}') + '.', ['Rewrite ' + t(sh.e + sh.x + '^{-1}') + ' with a positive exponent first.'], 'which step wrong');
        } },
        { id: 'e10b', level: 'ADV', make: function (r, sh) {
          var A = M(sh.ans, {});
          return lawPart('Give the correct final answer.', A, [[M(sh.ans, mono(sh.x, -2).v), 'repeat-error', 'That’s the student’s answer. Fix Step 3: dividing by ' + t(sh.e + sh.x + '^{-1}') + ' is multiplying by ' + t('\\frac{' + sh.x + '}{' + sh.e + '}') + '.']],
            t('\\frac{' + sh.k + '}{' + sh.x + '}\\div ' + sh.e + sh.x + '^{-1}=\\frac{' + sh.k + '}{' + sh.x + '}\\times\\frac{' + sh.x + '}{' + sh.e + '}=' + ex.texRat(sh.ans)) + ' — the ' + t(sh.x) + ' cancels completely.', ['Redo Step 3 only: ' + t('\\div\\frac{' + sh.e + '}{' + sh.x + '}=\\times\\frac{' + sh.x + '}{' + sh.e + '}') + '.'], 'correct answer', { vars: [sh.x] });
        } }] },
    { num: '11', stem: 'Each student below made a single mistake.', shared: function (r) { var v = r.pick([[2, 4, 3], [3, 4, 3], [2, 3, 2], [3, 3, 2], [2, 5, 3], [5, 3, 2], [4, 3, 2], [2, 3, 4], [2, 4, 5], [10, 3, 2]]); return { c: v[0], n: v[1], m: v[2], B: Math.pow(v[0], v[1]), k: r.int(2, 9), e: r.int(2, 5), x: r.pick(['x', 'x', 'y', 'm']) }; },
      parts: [
        { id: 'e11a', level: 'EMG', make: function (r, sh) {
          var B = sh.B, n = sh.n, m = sh.m;
          return mc(r, 'Mira wrote ' + t(B + '^{' + m + '/' + n + '}=' + rootTex(m, B + '^{' + n + '}')) + '. What is her mistake?', [
            { html: 'She swapped the index and the power: the <b>denominator</b> ' + t(n) + ' is the index, so it should be ' + t(rootTex(n, B + '^{' + m + '}')) + '.', right: true },
            { html: 'She should have multiplied: ' + t(B + '^{' + m + '/' + n + '}=' + B + '\\times\\frac{' + m + '}{' + n + '}') + '.', why: 'An exponent is never a multiplier. The denominator is a root, the numerator a power.' },
            { html: 'Nothing — both forms are equal.', why: 'Check: ' + t(rootTex(m, B + '^{' + n + '}') + '=' + B + '^{' + n + '/' + m + '}') + ', a different exponent.' },
            { html: 'The root must always be a square root.', why: 'The index of the root is the denominator ' + t(n) + ', so it’s a ' + rootName(n) + ' root.' }],
            'In ' + t('a^{m/n}') + ' the <b>denominator</b> is the index: ' + t(B + '^{' + m + '/' + n + '}=' + rootTex(n, B + '^{' + m + '}') + '=\\left(' + rootTex(n, B) + '\\right)^{' + m + '}') + '. Mira used ' + t(m) + ' as the index and ' + t(n) + ' as the power.', ['Which part of the exponent is the index of the root?'], 'Mira swap');
        } },
        { id: 'e11b', level: 'EMG', make: function (r, sh) { return EV({ base: [sh.B, 1], m: sh.m, n: sh.n, ask: function (e) { return 'Give the correct value of ' + t(e) + '.'; } }); } },
        { id: 'e11c', level: 'EMG', make: function (r, sh) {
          var k = sh.k, e = sh.e, x = sh.x;
          return mc(r, 'Owen wrote ' + t(k + x + '^{-' + e + '}=\\dfrac{1}{' + k + x + '^{' + e + '}}') + '. What is his mistake?', [
            { html: 'The exponent ' + t('-' + e) + ' belongs to ' + t(x) + ' only, so the ' + t(k) + ' stays on top: ' + t('\\frac{' + k + '}{' + x + '^{' + e + '}}') + '.', right: true },
            { html: 'A negative exponent makes the answer negative: ' + t('-' + k + x + '^{' + e + '}') + '.', why: 'A negative exponent means reciprocal — never a negative value.' },
            { html: 'Nothing — that is correct.', why: 'Substitute ' + t(x + '=1') + ': the left side is ' + t(k) + ' but Owen’s right side is ' + t('\\frac{1}{' + k + '}') + '.' },
            { html: 'He should have written ' + t(k + x + '^{' + e + '}') + '.', why: 'The negative exponent still means reciprocal for ' + t(x) + '.' }],
            'An exponent belongs only to the base it touches. Here the base is ' + t(x) + ', not ' + t(k + x) + ': ' + t(k + x + '^{-' + e + '}=' + k + '\\times\\frac{1}{' + x + '^{' + e + '}}=\\frac{' + k + '}{' + x + '^{' + e + '}}') + '.', ['What base does the exponent ' + t('-' + e) + ' touch?'], 'Owen coefficient');
        } },
        { id: 'e11d', level: 'EMG', make: function (r, sh) { var k = sh.k, e = sh.e, x = sh.x; return lawPart('Give the correct simplified form of ' + t(k + x + '^{-' + e + '}') + ' with a positive exponent.', M(k, mono(x, -e).v), [[M(Q(1, k), mono(x, -e).v), 'coef-side', 'That’s Owen’s answer: the ' + t(k) + ' has no negative exponent, so it stays on top.']], t(k + x + '^{-' + e + '}=\\frac{' + k + '}{' + x + '^{' + e + '}}'), ['Only ' + t(x) + ' moves.'], 'Owen fix'); } }] },
    { num: '12', stem: 'Decide whether each statement is <b>true</b> or <b>false</b>. Choose the answer with the right reason (a counterexample and the correct version if it is false).', parts: [
      { id: 'e12a', level: 'PRG', make: function (r) {
        var n = r.pick([2, 2, 3]), s = r.pick(['+', '+', '-']), lhs = '(a' + s + 'b)^{' + n + '}', rhs = 'a^{' + n + '}' + s + 'b^{' + n + '}', ab = s === '+' ? [1, 1] : [3, 1], L = Math.pow(ab[0] + (s === '+' ? 1 : -1) * ab[1], n), R0 = Math.pow(ab[0], n) + (s === '+' ? 1 : -1) * Math.pow(ab[1], n);
        var correct = n === 2 ? 'a^{2}' + s + '2ab+b^{2}' : 'a^{3}' + s + '3a^{2}b+3ab^{2}' + s + 'b^{3}';
        return mc(r, t(lhs + '=' + rhs) + ' for all values of ' + t('a') + ' and ' + t('b') + '.', [
          { html: '<b>False.</b> With ' + t('a=' + ab[0]) + ', ' + t('b=' + ab[1]) + ': ' + t(lhs.replace('a', ab[0]).replace('b', ab[1]) + '=' + L) + ' but ' + t(rhs.replace('a', ab[0]).replace('b', ab[1]) + '=' + R0) + '. Correctly ' + t(lhs + '=' + correct) + '.', right: true },
          { html: '<b>True</b>, by the power of a product law.', why: 'The power of a product law is about a <b>product</b> ' + t('(ab)^{n}') + ', not a sum. Try ' + t('a=' + ab[0] + ',\\ b=' + ab[1]) + '.' },
          { html: '<b>True</b> for positive ' + t('a') + ' and ' + t('b') + '.', why: 'Try ' + t('a=' + ab[0] + ',\\ b=' + ab[1]) + ': the two sides are ' + t(L) + ' and ' + t(R0) + '.' },
          { html: '<b>False</b>, because exponents can’t be applied to brackets.', why: 'They can — but a sum has to be multiplied out: ' + t(lhs + '=' + correct) + '.' }],
          'False. ' + t(lhs) + ' means ' + (n === 2 ? t('(a' + s + 'b)(a' + s + 'b)') : t('(a' + s + 'b)(a' + s + 'b)(a' + s + 'b)')) + ', which gives ' + t(correct) + '. With ' + t('a=' + ab[0] + ',\\ b=' + ab[1]) + ' the two sides are ' + t(L) + ' and ' + t(R0) + '.', ['Try small numbers for ' + t('a') + ' and ' + t('b') + '.'], 'T/F ' + lhs);
      } },
      { id: 'e12b', level: 'PRG', make: function (r) {
        var k = r.pick([1, 1, 2]), c = r.pick([2, 3, 4, 5]), ex1 = k === 1 ? 'a^{-1}' : 'a^{-2}', means = k === 1 ? 'the opposite of ' + t('a') : t('-a^{2}');
        return mc(r, t(ex1) + ' means ' + means + '.', [
          { html: '<b>False.</b> ' + t(c + '^{-' + k + '}=\\frac{1}{' + Math.pow(c, k) + '}') + ', not ' + t('-' + Math.pow(c, k)) + '. A negative exponent means the <b>reciprocal</b>: ' + t(ex1 + '=\\frac{1}{a' + (k === 1 ? '' : '^{2}') + '}') + '.', right: true },
          { html: '<b>True.</b> The minus sign in the exponent makes the value negative.', why: 'Test it: ' + t(c + '^{-' + k + '}=\\frac{1}{' + Math.pow(c, k) + '}') + ', which is positive.' },
          { html: '<b>False.</b> ' + t(ex1) + ' means ' + t('a\\times(-' + k + ')') + '.', why: 'An exponent is never a multiplier; a negative exponent means reciprocal.' },
          { html: '<b>True</b> only when ' + t('a') + ' is negative.', why: 'Try ' + t('a=' + c) + ': ' + t(c + '^{-' + k + '}=\\frac{1}{' + Math.pow(c, k) + '}') + '.' }],
          'False: ' + t(ex1 + '=\\frac{1}{a' + (k === 1 ? '' : '^{2}') + '}') + ' (reciprocal). For example ' + t(c + '^{-' + k + '}=\\frac{1}{' + Math.pow(c, k) + '}') + ', not ' + t('-' + Math.pow(c, k)) + '.', ['Try ' + t('a=' + c) + '.'], 'T/F negative exponent');
      } },
      { id: 'e12c', level: 'PRG', make: function (r) {
        var p = r.int(1, 4), q = r.int(2, 5), ex1 = '\\left(a^{' + p + '}b^{' + q + '}\\right)^{0}';
        return mc(r, t(ex1 + '=1') + ' for <i>all</i> values of ' + t('a') + ' and ' + t('b') + '.', [
          { html: '<b>False.</b> If ' + t('a=0') + ' (or ' + t('b=0') + '), the base is ' + t('0') + ' and ' + t('0^{0}') + ' is undefined. It is true for all <b>nonzero</b> ' + t('a') + ' and ' + t('b') + '.', right: true },
          { html: '<b>True.</b> Anything to the power ' + t('0') + ' is ' + t('1') + '.', why: 'Not <i>anything</i>: the base must be nonzero. What happens when ' + t('a=0') + '?' },
          { html: '<b>False.</b> It equals ' + t('a^{' + p + '}b^{' + q + '}') + '.', why: 'For nonzero ' + t('a') + ' and ' + t('b') + ' the zero exponent does give ' + t('1') + '.' },
          { html: '<b>False.</b> It equals ' + t('0') + '.', why: 'A zero exponent gives ' + t('1') + ' (for a nonzero base), not ' + t('0') + '.' }],
          'False: the zero-exponent law needs a <b>nonzero</b> base. With ' + t('a=0') + ' the base is ' + t('0') + ', and ' + t('0^{0}') + ' is undefined. Correct version: ' + t(ex1 + '=1') + ' for all nonzero ' + t('a') + ' and ' + t('b') + '.', ['Look for a value of ' + t('a') + ' that breaks the rule.'], 'T/F zero exponent');
      } },
      { id: 'e12d', level: 'PRG', make: function (r) {
        var kind = r.pick(['t2', 't3', 'f']), st = kind === 't2' ? 'a^{1/2}\\cdot a^{1/2}=a' : kind === 't3' ? 'a^{1/3}\\cdot a^{1/3}\\cdot a^{1/3}=a' : 'a^{1/2}+a^{1/2}=a';
        var right = kind !== 'f';
        return mc(r, t(st) + ' for every ' + t('a\\ge 0') + '.', right ? [
          { html: '<b>True.</b> Product law: ' + t(kind === 't2' ? 'a^{\\frac12+\\frac12}=a^{1}=a' : 'a^{\\frac13+\\frac13+\\frac13}=a^{1}=a') + '.', right: true },
          { html: '<b>False.</b> It equals ' + t(kind === 't2' ? 'a^{1/4}' : 'a^{1/27}') + '.', why: 'Multiplying powers of the same base <b>adds</b> the exponents.' },
          { html: '<b>False.</b> Try ' + t('a=4') + ': it gives ' + t('8') + '.', why: t(kind === 't2' ? '4^{1/2}\\cdot 4^{1/2}=2\\times 2=4' : '8^{1/3}\\cdot 8^{1/3}\\cdot 8^{1/3}=2\\times 2\\times 2=8') + ' — equal to ' + t('a') + '.' },
          { html: '<b>True</b> only for ' + t('a=1') + '.', why: 'Try ' + t('a=4') + ' or ' + t('a=9') + ': it works for every ' + t('a\\ge 0') + '.' }] : [
          { html: '<b>False.</b> With ' + t('a=4') + ': ' + t('4^{1/2}+4^{1/2}=2+2=4') + '… but with ' + t('a=9') + ': ' + t('3+3=6\\ne 9') + '. Correctly ' + t('a^{1/2}+a^{1/2}=2a^{1/2}') + ' (it is ' + t('a^{1/2}\\cdot a^{1/2}') + ' that equals ' + t('a') + ').', right: true },
          { html: '<b>True.</b> Product law: add the exponents, ' + t('\\frac12+\\frac12=1') + '.', why: 'The product law is for <b>multiplying</b> powers. This is a sum: ' + t('a^{1/2}+a^{1/2}=2a^{1/2}') + '.' },
          { html: '<b>True</b> for every perfect square ' + t('a') + '.', why: 'Try ' + t('a=9') + ': ' + t('3+3=6') + ', not ' + t('9') + '.' },
          { html: '<b>False.</b> It equals ' + t('a^{1/4}') + '.', why: 'Adding like terms: ' + t('a^{1/2}+a^{1/2}=2a^{1/2}') + '.' }],
          right ? 'True: ' + t(st) + ' by the product law (add the exponents to get ' + t('1') + ').' : 'False: a sum of like terms, ' + t('a^{1/2}+a^{1/2}=2a^{1/2}') + '. Counterexample ' + t('a=9') + ': ' + t('3+3=6\\ne 9') + '.', ['Test a value such as ' + t('a=9') + '.'], 'T/F ' + kind);
      } }] },
    { num: '13', section: 'Extra practice E — Working backwards', stem: 'Determine the value of the unknown exponent that makes each statement true.', parts: [
      { id: 'e13a', level: 'ADV', make: function (r) {
        var a = r.int(3, 9), b = r.int(1, 4), want = r.int(1, 6), n = want - a - b, x = r.pick(['x', 'x', 'y']), pr = '\\dfrac{' + x + '^{' + a + '}\\cdot ' + x + '^{n}}{' + x + '^{-' + b + '}}=' + x + '^{' + want + '}';
        return P.number(t(pr), n, function (v) { if (v === want - a + b) return { code: 'sub-wrong', hint: 'Dividing by ' + t(x + '^{-' + b + '}') + ' <b>subtracts</b> ' + t('-' + b) + ', i.e. adds ' + t(b) + ': ' + t(a + '+n-(-' + b + ')=' + want) + '.' }; if (v === -n) return { code: 'sign', hint: 'Check the sign when you solve ' + t((a + b) + '+n=' + want) + '.' }; return null; },
          'Combine the exponents on the left: ' + t(a + '+n-(-' + b + ')=' + (a + b) + '+n') + '. Set equal: ' + t((a + b) + '+n=' + want) + ', so ' + t('n=' + n) + '.', ['Write the left side as one power of ' + t(x) + ' with an exponent containing ' + t('n') + '.'], 'solve exponent ' + pr, { before: t('n=') });
      } },
      { id: 'e13b', level: 'ADV', make: function (r) {
        var b = r.pick([2, 2, 3, 5]), m = r.int(1, 3), k = r.pick([2, 3]), d = Math.pow(b, m * k);
        if (d > 1000) { m = 1; d = Math.pow(b, k); }
        var pr = '\\left(' + b + '^{m}\\right)^{-' + k + '}=\\dfrac{1}{' + F(d) + '}';
        return P.number(t(pr), m, function (v) { if (v === -m) return { code: 'no-recip', hint: 'The ' + t('-' + k) + ' already makes it a reciprocal: ' + t(b + '^{-' + k + 'm}=' + b + '^{-' + m * k + '}') + '.' }; if (v === m * k) return { code: 'u2l10-mult-back', hint: 'Solve ' + t('-' + k + 'm=-' + m * k) + ': <b>divide</b> by ' + t('-' + k) + '.' }; return null; },
          t('\\left(' + b + '^{m}\\right)^{-' + k + '}=' + b + '^{-' + k + 'm}') + ' and ' + t('\\frac{1}{' + F(d) + '}=' + b + '^{-' + m * k + '}') + '. So ' + t('-' + k + 'm=-' + m * k) + ' and ' + t('m=' + m) + '.', ['Write ' + t('\\frac{1}{' + F(d) + '}') + ' as a power of ' + t(b) + ' with a negative exponent.'], 'solve ' + pr, { before: t('m=') });
      } },
      { id: 'e13c', level: 'MAS', make: function (r) { var g = r.pick([[2, 3, 2], [2, 3, 1], [2, 2, 3], [3, 2, 1], [3, 3, 2], [2, 4, 3], [2, 5, 2], [3, 4, 1], [5, 2, 1], [2, 4, 1], [5, 3, 2], [2, 6, 4]]), c = g[0], k = g[1], j = g[2], b = Math.pow(c, k), d = Math.pow(c, j), ans = Q(-j, k);
        var p = P.fraction(t(b + '^{k}=\\dfrac{1}{' + d + '}'), ans, { before: t('k='), diag: function (v) { if (releq(v, j / k)) return { code: 'no-recip', hint: t('\\frac{1}{' + d + '}=' + c + '^{-' + j + '}') + ': the exponent is negative.' }; if (releq(v, -k / j) || releq(v, k / j)) return { code: 'swap', hint: t(b + '=' + c + '^{' + k + '}') + ', so ' + t(c + '^{' + k + 'k}=' + c + '^{-' + j + '}') + ' and ' + t(k + 'k=-' + j) + '.' }; return null; } },
          'Write both sides as powers of ' + t(c) + ': ' + t(b + '^{k}=' + c + '^{' + k + 'k}') + ' and ' + t('\\frac{1}{' + d + '}=' + c + '^{-' + j + '}') + '. So ' + t(k + 'k=-' + j) + ' and ' + t('k=' + eF(ans)) + '.', ['Write both sides as powers of the same base.'], 'solve ' + b + '^k=1/' + d);
        p.bad = [eS(Q(j, k))]; return p; } }] },
    { num: '14', stem: 'Determine the value of the unknown that makes each statement true.', parts: [
      { id: 'e14a', level: 'ADV', make: function (r) { var a = r.int(-2, 5), b = r.int(2, 6), k = r.pick([2, 3]); if (a === b) a = b - 1; var rhs = k * (a - b), x = r.pick(['x', 'x', 'y']), pr = '\\left(\\dfrac{' + x + '^{a}}{' + x + '^{' + b + '}}\\right)^{' + k + '}=' + x + '^{' + rhs + '}';
        return P.number(t(pr), a, function (v) { if (v === rhs / k - b) return { code: 'sign', hint: 'Solve ' + t('a-' + b + '=' + rhs / k) + ': add ' + t(b) + ' to both sides.' }; if (v === rhs + b) return { code: 'missed-power', hint: 'Don’t forget the outside exponent ' + t(k) + ': ' + t(k + '(a-' + b + ')=' + rhs) + '.' }; return null; },
          'Quotient law inside, power of a power outside: ' + t(k + '(a-' + b + ')=' + rhs) + ', so ' + t('a-' + b + '=' + rhs / k) + ' and ' + t('a=' + a) + '.', ['Write the left side as one power of ' + t(x) + '.'], 'solve ' + pr, { before: t('a=') }); } },
      { id: 'e14b', level: 'ADV', make: function (r) { var c = r.pick([2, 3, 4, 5, 6, 7, 8, 9]), n = -r.int(1, 6) * (r.chance(0.3) ? -1 : 1), k = 2, pr = '\\left(' + c + '\\times 10^{n}\\right)^{2}=' + c * c + '\\times 10^{' + 2 * n + '}';
        if (c * c >= 10) pr = '\\left(' + c + '\\times 10^{n}\\right)^{2}=' + (c * c / 10) + '\\times 10^{' + (2 * n + 1) + '}';
        return P.number(t(pr), n, function (v) { if (v === 2 * n || v === 2 * n + 1) return { code: 'u2l10-mult-back', hint: 'Squaring <b>doubles</b> the exponent: ' + t('\\left(10^{n}\\right)^{2}=10^{2n}') + '. Halve to undo it.' }; return null; },
          (c * c >= 10 ? 'Renormalize the right side first: ' + t((c * c / 10) + '\\times 10^{' + (2 * n + 1) + '}=' + c * c + '\\times 10^{' + 2 * n + '}') + '. ' : '') + t('\\left(' + c + '\\times 10^{n}\\right)^{2}=' + c * c + '\\times 10^{2n}') + ', so ' + t('2n=' + 2 * n) + ' and ' + t('n=' + n) + '.', ['Power of a product: square the ' + t(c) + ' and double the exponent of 10.'], 'solve ' + pr, { before: t('n=') }); } },
      { id: 'e14c', level: 'ADV', make: function (r) { var g = r.pick([[3, 4, 3], [2, 4, 3], [2, 3, 2], [3, 2, 3], [2, 2, 3], [5, 2, 3], [2, 6, 4], [3, 3, 2], [2, 5, 3], [3, 4, 2]]), c = g[0], k = g[1], j = g[2], b = Math.pow(c, k), d = Math.pow(c, j), ans = Q(j, k);
        var p = P.fraction(t(b + '^{p}=' + d), ans, { before: t('p='), diag: function (v) { if (releq(v, k / j)) return { code: 'swap', hint: t(b + '=' + c + '^{' + k + '}') + ' and ' + t(d + '=' + c + '^{' + j + '}') + ', so ' + t(k + 'p=' + j) + '.' }; if (releq(v, d / b)) return { code: 'u2l10-mult-back', hint: 'Write both sides as powers of ' + t(c) + ' and match the exponents.' }; return null; } },
          t(b + '^{p}=' + c + '^{' + k + 'p}') + ' and ' + t(d + '=' + c + '^{' + j + '}') + ', so ' + t(k + 'p=' + j) + ' and ' + t('p=' + eF(ans)) + '.', ['Write both sides as powers of ' + t(c) + '.'], 'solve ' + b + '^p=' + d); p.bad = [eS(Q(k, j))]; return p; } }] },
    { num: '15', section: 'Extra practice F — Applications', stem: function (sh) { return 'An investment grows according to ' + t('P=' + F(sh.P0) + '(' + sh.g + ')^{t}') + ', where ' + t('P') + ' is the value in dollars and ' + t('t') + ' is the time in years since the investment was made.'; },
      shared: function (r) { return { P0: r.pick([1000, 1500, 2000, 2500, 3000, 4000, 5000]), g: r.pick(['1.02', '1.03', '1.04', '1.05', '1.06']), y: r.pick([2, 3, 4, 5]) }; },
      parts: [
        { id: 'e15a', level: 'EMG', make: function (r, sh) { return P.number('Find ' + t('P') + ' when ' + t('t=0') + '.', sh.P0, function (v) { if (v === 0) return { code: 'zero-is-0', hint: t('(' + sh.g + ')^{0}=1') + ', not ' + t('0') + '.' }; if (releq(v, sh.P0 * Number(sh.g))) return { code: 'zero-is-base', hint: t('(' + sh.g + ')^{0}=1') + ', not ' + t(sh.g) + '.' }; return null; }, t('P=' + F(sh.P0) + '(' + sh.g + ')^{0}=' + F(sh.P0) + '(1)=' + F(sh.P0)) + ' dollars: at ' + t('t=0') + ' the value is just the amount invested.', ['What is any nonzero number to the power 0?'], 'P at t=0', { before: '$' }); } },
        { id: 'e15b', level: 'EMG', make: function (r, sh) { return mc(r, 'Which exponent law makes that calculation immediate?', [{ html: 'The <b>zero exponent law</b>: ' + t('a^{0}=1') + ' for ' + t('a\\ne 0') + '.', right: true }, { html: 'The <b>product law</b>.', why: 'Nothing is being multiplied as powers here; the key fact is ' + t('(' + sh.g + ')^{0}=1') + '.' }, { html: 'The <b>negative exponent law</b>.', why: 'The exponent is ' + t('0') + ', not negative.' }, { html: 'The <b>power of a power law</b>.', why: 'There is only one exponent, ' + t('0') + '.' }], t('(' + sh.g + ')^{0}=1') + ' by the zero exponent law.', ['What is special about the exponent ' + t('0') + '?'], 'which law t=0'); } },
        { id: 'e15c', level: 'PRG', make: function (r, sh) { var x = sh.P0 * Math.pow(Number(sh.g), -sh.y), fwd = sh.P0 * Math.pow(Number(sh.g), sh.y);
          return P.approx('Write an expression with a negative exponent for the value ' + t(sh.y) + ' years <b>before</b> the investment was made, and evaluate it to the nearest cent. <i>(Calculator.)</i>', x, 2, { before: '$', diag: function (v) { if (Math.abs(v - fwd) < 0.01) return { code: 'u2l10-forward', hint: 'That’s ' + t(sh.y) + ' years <b>after</b>. Before the investment, ' + t('t=-' + sh.y) + '.' }; if (Math.abs(v + x) < 0.01) return { code: 'neg-power', hint: 'A negative exponent means reciprocal, not a negative amount.' }; return null; } },
            t('t=-' + sh.y) + ': ' + t('P=' + F(sh.P0) + '(' + sh.g + ')^{-' + sh.y + '}=\\dfrac{' + F(sh.P0) + '}{(' + sh.g + ')^{' + sh.y + '}}\\approx ' + K.roundTo(x, 2).toFixed(2)) + ' dollars.', ['Before the investment, ' + t('t') + ' is negative.', 'A negative exponent means divide: ' + t('a^{-n}=\\frac{1}{a^{n}}') + '.'], 'P at t=-' + sh.y); } }] },
    { num: '16', stem: function (sh) { return 'A cube has an edge length of ' + t(sh.edge) + ' centimetres.'; }, shared: function (r) { var c = r.pick([2, 3]), p = r.int(1, 2), q = r.int(1, 3), L = r.pick([['x', 'y'], ['x', 'y'], ['a', 'b']]), f = r.pick([2, 2, 3, 4]); var v = {}; v[L[0]] = -p; v[L[1]] = q; var A = M(c, v); return { A: A, L: L, f: f, edge: rawTex(A, L) }; },
      parts: [
        { id: 'e16a', level: 'PRG', make: function (r, sh) { return treePart(Pw({ m: sh.A, tex: sh.edge }, 3), { pre: 'Determine the volume of the cube, ' + t('V=(\\text{edge})^{3}') + ', with positive exponents: ', ord: sh.L }); } },
        { id: 'e16b', level: 'PRG', make: function (r, sh) { var f = sh.f, F3 = f * f * f, nm = f === 2 ? 'doubled' : f === 3 ? 'tripled' : 'multiplied by 4';
          return P.number('The edge length is ' + nm + '. By what factor does the volume change?', F3, function (v) { if (v === f) return { code: 'u2l10-factor', hint: 'The volume uses the edge <b>cubed</b>: ' + t('(' + f + 'e)^{3}=' + f + '^{3}e^{3}') + '.' }; if (v === f * 3) return { code: 'coef-times', hint: t(f + '^{3}') + ' means ' + t(f + '\\times ' + f + '\\times ' + f) + ', not ' + t(f + '\\times 3') + '.' }; return null; },
            'Power of a product: ' + t('(' + f + 'e)^{3}=' + f + '^{3}e^{3}=' + F3 + 'e^{3}') + ', so the volume is multiplied by ' + t(F3) + '.', ['New volume = ' + t('(' + f + '\\times\\text{edge})^{3}') + '. Use the power of a product law.'], 'factor ' + f + '^3', { before: '×' }); } }] },
    { num: '17', stem: 'Compare each pair of measurements: divide, and give each answer in proper scientific notation.', parts: [
      { id: 'e17a', level: 'PRG', make: function (r) { var g = r.pick([[7, 2.8], [6, 2.4], [9, 3.6], [8, 3.2], [6, 1.5], [9, 4.5], [7.5, 2.5], [8.4, 2.1], [4.8, 1.2], [5, 2]]), m = r.int(4, 7), n = r.int(8, 11), x = sciVal(g[0] / g[1], -m + n);
        var o = r.pick([['A red blood cell is about', 'm wide; a water molecule is about', 'm wide. How many times wider is the cell?'], ['A bacterium is about', 'm long; a virus is about', 'm long. How many times longer is the bacterium?'], ['A grain of pollen is about', 'm wide; an atom is about', 'm wide. How many times wider is the pollen grain?']]);
        return sciPart(o[0] + ' ' + t(g[0] + '\\times 10^{-' + m + '}') + ' ' + o[1] + ' ' + t(g[1] + '\\times 10^{-' + n + '}') + ' ' + o[2], x, { diag: function (v) { if (releq(v, sciVal(g[0] / g[1], -m - n))) return { code: 'exp', hint: 'Subtract the exponents of 10: ' + t('-' + m + '-(-' + n + ')=' + (n - m)) + '.' }; if (releq(v, 1 / x)) return { code: 'flip', hint: 'Divide the bigger by the smaller (the cell by the molecule).' }; return null; } },
          t('\\dfrac{' + g[0] + '\\times 10^{-' + m + '}}{' + g[1] + '\\times 10^{-' + n + '}}=' + Number((g[0] / g[1]).toFixed(6)) + '\\times 10^{-' + m + '-(-' + n + ')}=' + Number((g[0] / g[1]).toFixed(6)) + '\\times 10^{' + (n - m) + '}' + (g[0] / g[1] < 1 ? '=' + sciTexOf(x) : '')) + ' times.', ['Divide the coefficients and subtract the exponents of 10.'], 'compare ' + g[0] + '/' + g[1]); } },
      { id: 'e17b', level: 'PRG', make: function (r) { var g = r.pick([[2, 30, 6, 24, 'The Sun', 'Earth', 'Earths'], [1.9, 27, 6, 24, 'Jupiter', 'Earth', 'Earths'], [6, 24, 7.5, 22, 'Earth', 'the Moon', 'Moons'], [2, 30, 1.9, 27, 'The Sun', 'Jupiter', 'Jupiters'], [5.7, 26, 6, 24, 'Saturn', 'Earth', 'Earths']]), x = g[0] / g[2] * Math.pow(10, g[1] - g[3]);
        return sciPart(g[4] + ' has a mass of about ' + t(g[0] + '\\times 10^{' + g[1] + '}') + ' kg and ' + g[5] + ' about ' + t(g[2] + '\\times 10^{' + g[3] + '}') + ' kg. How many ' + g[6] + ' would it take to match ' + (g[4] === 'The Sun' ? 'the Sun' : g[4]) + '’s mass? Round the coefficient to two significant digits.', x, { sig: 2 },
          t('\\dfrac{' + g[0] + '\\times 10^{' + g[1] + '}}{' + g[2] + '\\times 10^{' + g[3] + '}}=' + Number((g[0] / g[2]).toPrecision(4)) + '\\ldots\\times 10^{' + (g[1] - g[3]) + '}\\approx ' + K.sciTex(x, 2)) + '.', ['Divide the coefficients, subtract the exponents, then renormalize.'], 'how many ' + g[6]); } }] },
    { num: '18', section: 'Extra practice G — Challenge', stem: function (sh) { return 'Without a calculator, decide which is larger: ' + t(sh.A) + ' or ' + t(sh.B) + '.'; },
      shared: function (r) { var g = r.pick([[2, 10, 10, 3, 1024, 1000], [5, 3, 2, 7, 125, 128], [3, 5, 2, 8, 243, 256], [3, 2, 2, 3, 9, 8], [2, 5, 3, 3, 32, 27], [2, 7, 5, 3, 128, 125]]), k = r.pick([10, 10, 20, 5, 6, 8, 12, 15]); if (r.chance(0.5)) g = [g[2], g[3], g[0], g[1], g[5], g[4]]; return { b1: g[0], e1: g[1], b2: g[2], e2: g[3], v1: g[4], v2: g[5], k: k, A: g[0] + '^{' + g[1] * k + '}', B: g[2] + '^{' + g[3] * k + '}' }; },
      parts: [
        { id: 'e18a', level: 'ADV', make: function (r, sh) {
          var p = P.fields('Rewrite both with the same exponent ' + t(sh.k) + ': fill in the bases.', [{ name: 'First base', label: t(sh.A + '=\\left(' + sh.b1 + '^{' + sh.e1 + '}\\right)^{' + sh.k + '}=') + ' (', after: ')' + t('^{' + sh.k + '}'), mode: 'number' }, { name: 'Second base', label: t(sh.B + '=\\left(' + sh.b2 + '^{' + sh.e2 + '}\\right)^{' + sh.k + '}=') + ' (', after: ')' + t('^{' + sh.k + '}'), mode: 'number' }],
            [K.number(sh.v1, function (v) { return v === sh.b1 * sh.e1 ? { code: 'times-exp', hint: t(sh.b1 + '^{' + sh.e1 + '}') + ' is repeated multiplication.' } : null; }), K.number(sh.v2, function (v) { return v === sh.b2 * sh.e2 ? { code: 'times-exp', hint: t(sh.b2 + '^{' + sh.e2 + '}') + ' is repeated multiplication.' } : null; })],
            [String(sh.v1), String(sh.v2)], t(sh.A + '=' + sh.v1 + '^{' + sh.k + '}') + ', ' + t(sh.B + '=' + sh.v2 + '^{' + sh.k + '}'),
            'Power of a power in reverse: ' + t(sh.A + '=\\left(' + sh.b1 + '^{' + sh.e1 + '}\\right)^{' + sh.k + '}=' + sh.v1 + '^{' + sh.k + '}') + ' and ' + t(sh.B + '=\\left(' + sh.b2 + '^{' + sh.e2 + '}\\right)^{' + sh.k + '}=' + sh.v2 + '^{' + sh.k + '}') + '.', ['Work out ' + t(sh.b1 + '^{' + sh.e1 + '}') + ' and ' + t(sh.b2 + '^{' + sh.e2 + '}') + '.'], 'same exponent ' + sh.A + ' ' + sh.B);
          p.bad = [[String(sh.v2), String(sh.v1)]]; return p;
        } },
        { id: 'e18b', level: 'PRG', make: function (r, sh) {
          var big = sh.v1 > sh.v2 ? sh.A : sh.B, sm = big === sh.A ? sh.B : sh.A, bv = Math.max(sh.v1, sh.v2), sv = Math.min(sh.v1, sh.v2);
          return mc(r, 'So which is larger?', [
            { html: t(big) + ', because it equals ' + t(bv + '^{' + sh.k + '}') + ' and ' + t(sm + '=' + sv + '^{' + sh.k + '}') + ': same exponent, bigger base.', right: true },
            { html: t(sm) + ', because its base is bigger.', why: 'Compare after rewriting with the same exponent: ' + t(bv + '^{' + sh.k + '}') + ' vs ' + t(sv + '^{' + sh.k + '}') + '.' },
            { html: t(sm) + ', because its exponent is bigger.', why: 'Base and exponent both matter. With the same exponent ' + t(sh.k) + ' the bases are ' + t(bv) + ' and ' + t(sv) + '.' },
            { html: 'They are equal.', why: t(bv) + ' and ' + t(sv) + ' are not equal, so the powers aren’t either.' }],
            'Both have exponent ' + t(sh.k) + ' after rewriting; ' + t(bv + '>' + sv) + ', so ' + t(big) + ' is larger.', ['With the same exponent, the bigger base gives the bigger power.'], 'which larger');
        } }] },
    { num: '19', stem: 'Simplify completely. Write each answer with positive exponents.', parts: [
      { id: 'e19a', level: 'MAS', make: function (r) { var g = r.pick([[[-1, 2], 2, [3, 2], -2, -3, -6], [[-1, 2], 1, [1, 2], -1, -2, -2], [[-1, 3], 2, [2, 3], -1, -3, -3], [[1, 2], 3, [3, 2], 1, -2, 2], [[-1, 4], 1, [3, 4], -2, -2, -2], [[-1, 2], 3, [1, 2], -1, -3, -3]]);
        var L = r.pick([['x', 'y'], ['x', 'y'], ['a', 'b']]), X = L[0], Y = L[1], v1 = {}, v2 = {}; v1[X] = g[0]; v1[Y] = g[1]; v2[X] = g[2]; v2[Y] = g[3];
        return treePart(Mu(Pw(Dv(Lf(1, v1), Lf(1, v2)), g[4]), Lf(1, mono(X, g[5]).v)), { ord: L }); } },
      { id: 'e19b', level: 'MAS', make: function (r) { var g = r.pick([[8, 6, [2, 3], -5, 4, -2, [-1, 2]], [27, 3, [2, 3], -3, 9, -4, [-1, 2]], [8, 3, [2, 3], -4, 16, -4, [-1, 4]], [4, 4, [1, 2], -3, 8, -3, [-1, 3]], [16, 4, [3, 4], -4, 9, -2, [-1, 2]], [27, 6, [1, 3], -3, 4, -2, [-1, 2]]]);
        var a = r.pick(['a', 'a', 'b', 'k']);
        return treePart(Dv(Mu(Pw(Lf(g[0], mono(a, g[1]).v), g[2]), Lf(1, mono(a, g[3]).v)), Pw(Lf(g[4], mono(a, g[5]).v), g[6]))); } }] },
    { num: '20', stem: 'Compare without a calculator, writing every power with the same base first.', parts: [
      { id: 'e20a', level: 'ADV', make: function (r) { var g = r.pick([[2, 10, 4, 6], [2, 8, 4, 5], [3, 6, 9, 4], [2, 12, 8, 3], [3, 8, 27, 2], [2, 9, 4, 6], [5, 4, 25, 3], [2, 6, 8, 3]]), b = g[0], k = g[1], B = g[2], e = g[3], j = Math.round(Math.log(B) / Math.log(b)), e2 = j * e, A = '\\left(\\tfrac{1}{' + b + '}\\right)^{-' + k + '}', C = B + '^{' + e + '}';
        var bigE = Math.max(k, e2), smE = Math.min(k, e2), f = Math.pow(b, bigE - smE);
        var p = P.fields('Which is greater, ' + t(A) + ' or ' + t(C) + '? By what factor? Write each as a power of ' + t(b) + ' first.', [{ name: 'First', label: t(A + '=' + b + '^{\\,?}') + ' exponent', mode: 'number' }, { name: 'Second', label: t(C + '=' + b + '^{\\,?}') + ' exponent', mode: 'number' }, { name: 'Factor', label: 'the greater one is larger by a factor of', mode: 'number' }],
          [K.number(k, function (v) { return v === -k ? { code: 'no-recip', hint: t(A + '=' + b + '^{' + k + '}') + ': flipping ' + t('\\frac{1}{' + b + '}') + ' makes the exponent positive.' } : null; }), K.number(e2, function (v) { return v === j + e ? { code: 'add-exp', hint: MODES['add-exp'] } : null; }), K.number(f, function (v) { return v === bigE - smE ? { code: 'exponent', hint: 'The factor is ' + t(b + '^{' + (bigE - smE) + '}') + ', not the exponent ' + t(bigE - smE) + '.' } : null; })],
          [String(k), String(e2), String(f)], t(A + '=' + b + '^{' + k + '}') + ', ' + t(C + '=' + b + '^{' + e2 + '}') + '; factor ' + t(f),
          t(A + '=' + b + '^{' + k + '}') + ' and ' + t(C + '=\\left(' + b + '^{' + j + '}\\right)^{' + e + '}=' + b + '^{' + e2 + '}') + '.<br>' + (k === e2 ? 'They are equal.' : t((k > e2 ? A : C)) + ' is greater, by a factor of ' + t(b + '^{' + bigE + '-' + smE + '}=' + b + '^{' + (bigE - smE) + '}=' + f) + '.'), ['A negative exponent on a fraction flips it.', 'Dividing the two powers gives the factor.'], 'compare ' + A + ' ' + C);
          p.bad = [[String(-k), String(e2), String(f)]]; return p; } },
      { id: 'e20b', level: 'ADV', make: function (r) {
        var pool = [['9^{-1/2}', Q(1, 3)], ['27^{-2/3}', Q(1, 9)], ['\\left(\\tfrac{1}{81}\\right)^{1/4}', Q(1, 3)], ['8^{-1/3}', Q(1, 2)], ['16^{-3/4}', Q(1, 8)], ['\\left(\\tfrac{1}{4}\\right)^{1/2}', Q(1, 2)], ['4^{-3/2}', Q(1, 8)], ['\\left(\\tfrac{1}{27}\\right)^{1/3}', Q(1, 3)], ['81^{-1/4}', Q(1, 3)], ['64^{-1/2}', Q(1, 8)], ['32^{-1/5}', Q(1, 2)], ['\\left(\\tfrac{1}{16}\\right)^{1/4}', Q(1, 2)], ['25^{-1/2}', Q(1, 5)], ['125^{-1/3}', Q(1, 5)], ['9^{-1}', Q(1, 9)], ['8^{-2/3}', Q(1, 4)]];
        var s = pickWhere(r, function () { return r.sample(pool, 3); }, function (x) { var v = x.map(function (y) { return qv(y[1]); }); return (v[0] === v[1]) + (v[0] === v[2]) + (v[1] === v[2]) === 1; }) || [pool[0], pool[1], pool[2]];
        var it = s.map(function (x, i) { return { id: 'o' + i, tex: x[0], v: qv(x[1]), vt: ex.texRat(x[1]) }; }), sorted = it.slice().sort(function (a, b) { return a.v - b.v; });
        var p = P.order(r, 'Arrange from <b>least to greatest</b>. Two of them are equal — put those next to each other (either order).', sorted, {}, sorted.map(function (x) { return t(x.tex + '=' + x.vt); }).join(', ') + '.<br>So ' + t(sorted.map(function (x, i) { return x.tex + (i < 2 ? (x.v === sorted[i + 1].v ? '=' : '<') : ''); }).join('')) + '.', ['Evaluate each one: a negative exponent flips the base; the denominator is a root.'], 'order ' + it.map(function (x) { return x.tex; }).join(', '));
        var byId = {}; it.forEach(function (x) { byId[x.id] = x; });
        p.check = function (resp) { if (!resp || resp.length < it.length) return form('incomplete', 'Tap every item to place it in order (' + (resp ? resp.length : 0) + ' of ' + it.length + ' placed).'); for (var j = 0; j + 1 < resp.length; j++) { var a = byId[resp[j]], b = byId[resp[j + 1]]; if (!a || !b) return wrong('order', null); if (a.v > b.v + 1e-12) return wrong('order', t(a.tex) + ' and ' + t(b.tex) + ' are in the wrong order: ' + t(a.tex + '=' + a.vt) + ' and ' + t(b.tex + '=' + b.vt) + '.'); } return ok(); };
        var eq = [0, 1].filter(function (i) { return sorted[i].v === sorted[i + 1].v; })[0], alt = sorted.map(function (x) { return x.id; }), tmp = alt[eq]; alt[eq] = alt[eq + 1]; alt[eq + 1] = tmp; p.good = [alt];
        return p; } }] }
  ];

  HW.defineLesson({
    id: 'u2l10', unit: 2, num: '10', title: 'Unit Review: Exponents', outcome: 'AN3',
    blurb: 'One last pass over the unit: every exponent law, zero and negative exponents, scientific notation, and rational exponents and radicals — then mixed questions like the unit test.',
    questions: [
      { num: '1', section: 'Part A — The Exponent Laws', stem: 'Evaluate using the product law.', parts: [{ id: '1a', level: 'BEG', make: q1 }, { id: '1b', level: 'BEG', make: q1 }] },
      { num: '2', stem: 'Simplify.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var v = r.pick(LETS), c = r.int(2, 12), m = r.int(2, 7), n = r.int(2, 7); return treePart(Mu(Lf(c, mono(v, m).v), Lf(1, mono(v, n).v))); } },
        { id: '2b', level: 'BEG', make: function (r) { var v = r.pick(LETS), a = r.int(2, 6), b = r.int(2, 6), tree = Mu(Lf(1, mono(v, a).v), Lf(1, mono(v, 1).v), Lf(1, mono(v, b).v)); return treePart(tree, { wrongs: [[mono(v, a + b), 'x-one', 'Don’t lose the middle factor: ' + t(v + '=' + v + '^{1}') + ', so add ' + t('1') + ' as well.']] }); } }] },
      { num: '3', stem: 'Simplify.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var v = r.pick(LETS), c1 = r.int(2, 9), c2 = r.int(2, 9), m = r.int(2, 6), n = r.int(2, 6); if (c1 + c2 === c1 * c2) c2++; return treePart(Mu(Lf(c1, mono(v, m).v), Lf(c2, mono(v, n).v))); } },
        { id: '3b', level: 'BEG', make: function (r) { var v = r.pick(LETS), c1 = r.int(2, 9), c2 = r.int(2, 9), n = r.int(2, 7); if (c1 + c2 === c1 * c2) c2++; return treePart(Mu(Lf(c1, mono(v, 1).v), Lf(c2, mono(v, n).v)), { wrongs: [[mono(v, n, c1 * c2), 'x-one', t(v + '=' + v + '^{1}') + ': add ' + t('1') + ' to the exponent.']] }); } }] },
      { num: '4', stem: 'Simplify using the quotient law.', parts: [
        { id: '4a', level: 'BEG', make: q4a },
        { id: '4b', level: 'BEG', make: function (r) { var v = r.pick(LETS), m = r.int(7, 15), n = r.int(2, m - 2); return treePart(Dv(Lf(1, mono(v, m).v), Lf(1, mono(v, n).v))); } }] },
      { num: '5', stem: 'Simplify using the power of a power law.', parts: [
        { id: '5a', level: 'BEG', make: q5a },
        { id: '5b', level: 'BEG', make: function (r) { var v = r.pick(LETS), m = r.int(2, 6), n = r.int(2, 5); if (m === 2 && n === 2) n = 3; return treePart(Pw(Lf(1, mono(v, m).v), n)); } }] },
      { num: '6', stem: 'Simplify, using both the power of a power law and the quotient law.', parts: [
        { id: '6', level: 'EMG', make: function (r) { var v = r.pick(LETS), m = r.int(2, 5), n = r.int(2, 4), k = r.int(2, m * n - 1); if (m === 2 && n === 2) n = 3; return treePart(Dv(Pw(Lf(1, mono(v, m).v), n), Lf(1, mono(v, k).v))); } }] },
      { num: '7', stem: 'Simplify.', parts: [
        { id: '7a', level: 'BEG', make: function (r) { var v = r.pick(LETS), c = r.int(2, 9); return treePart(Pw(Lf(c, mono(v, 1).v), 2)); } },
        { id: '7b', level: 'BEG', make: function (r) { var v = r.pick(LETS), g = r.pick([[2, 4], [2, 3], [3, 3], [2, 5], [3, 4], [4, 3], [5, 3], [10, 3], [2, 6]]); return treePart(Pw(Lf(g[0], mono(v, 1).v), g[1])); } }] },
      { num: '8', stem: 'Simplify.', parts: [
        { id: '8a', level: 'EMG', make: function (r) { var v = r.pick(LETS), c = r.int(2, 9), n = r.pick([2, 2, 3]); if (n === 3 && c > 5) c = r.int(2, 5); return treePart(Pw({ m: M(Q(1, c), mono(v, 1).v), tex: '\\dfrac{' + v + '}{' + c + '}' }, n), { wrongs: [[M(Q(1, c), mono(v, n).v), 'num-only', 'The exponent applies to the denominator too: ' + t('\\left(\\frac{a}{b}\\right)^{n}=\\frac{a^{n}}{b^{n}}') + '.']] }); } },
        { id: '8b', level: 'EMG', make: function (r) { var v = r.pick(LETS), c = r.int(2, 5), n = r.pick([3, 3, 2, 4]); if (n === 4) c = r.pick([2, 3]); return treePart(Pw({ m: M(c, mono(v, -1).v), tex: '\\dfrac{' + c + '}{' + v + '}' }, n), { wrongs: [[M(c, mono(v, -n).v), 'coef-not-raised', 'The exponent applies to the numerator ' + t(c) + ' too.'], [M(Math.pow(c, n), mono(v, -1).v), 'num-only', 'The exponent applies to the denominator ' + t(v) + ' too.']] }); } }] },
      { num: '9', stem: 'Simplify.', parts: [
        { id: '9a', level: 'EMG', make: function (r) { var v = r.pick(LETS), c = r.int(2, 9), n = r.pick([2, 2, 4]); if (n === 4) c = r.pick([2, 3]); return treePart(Pw({ m: M(-c, mono(v, 1).v), tex: '-' + c + v }, n), { wrongs: [[M(-Math.pow(c, n), mono(v, n).v), 'sign', 'An even power of a negative number is positive: ' + t('(-' + c + ')^{' + n + '}=' + Math.pow(c, n)) + '.']] }); } },
        { id: '9b', level: 'EMG', make: function (r) { var L = r.pick([['e', 'f'], ['a', 'b'], ['x', 'y'], ['m', 'n'], ['p', 'q']]), c = r.pick([2, 2, 3, 4, 5]), n = c > 3 ? 2 : r.pick([2, 3]), v = {}; v[L[0]] = 1; v[L[1]] = 1; var mf = {}; mf[L[0]] = n; mf[L[1]] = 1;
          return treePart(Pw(Lf(c, v), n), { ord: L, wrongs: [[M(Math.pow(c, n), mf), 'missed-factor', 'Every factor in the bracket gets the exponent — ' + t(L[1]) + ' too.']] }); } }] },
      { num: '10', section: 'Part B — Combining Laws, Zero and Negative Exponents', stem: 'Simplify.', parts: [
        { id: '10', level: 'EMG', make: function (r) { var v = r.pick(LETS), c = r.int(2, 5), p = r.int(2, 4), n = r.pick([2, 2, 3]), q = r.int(2, 6); if (n === 3 && c > 3) c = 2; return treePart(Mu(Pw(Lf(c, mono(v, p).v), n), Lf(1, mono(v, q).v))); } }] },
      { num: '11', stem: 'Simplify.', parts: [
        { id: '11', level: 'PRG', make: function (r) { var g = pickWhere(r, function () { return { c: r.pick([2, 2, 3]), p: r.int(2, 4), n: r.pick([2, 3]), q: r.int(2, 8), d: r.pick([2, 3, 4, 6, 9]) }; }, function (o) { var cn = Math.pow(o.c, o.n); return cn % o.d === 0 && cn !== o.d && o.p * o.n > o.q; }) || { c: 2, p: 3, n: 3, q: 5, d: 4 }; var v = r.pick(LETS); return treePart(Dv(Pw(Lf(g.c, mono(v, g.p).v), g.n), Lf(g.d, mono(v, g.q).v))); } }] },
      { num: '12', stem: 'Evaluate.', parts: [{ id: '12a', level: 'BEG', make: function (r) { return q12(r, false); } }, { id: '12b', level: 'BEG', make: function (r) { return q12(r, true); } }] },
      { num: '13', stem: 'Simplify.', parts: [{ id: '13a', level: 'EMG', make: function (r) { return q13(r, false); } }, { id: '13b', level: 'EMG', make: function (r) { return q13(r, true); } }] },
      { num: '14', stem: 'Evaluate.', parts: [{ id: '14a', level: 'EMG', make: q14a }, { id: '14b', level: 'EMG', make: q14b }] },
      { num: '15', stem: 'Simplify, writing each answer with a positive exponent.', parts: [{ id: '15a', level: 'EMG', make: q15a }, { id: '15b', level: 'PRG', make: q15b }] },
      { num: '16', stem: 'Simplify. Write the answer with a positive exponent.', parts: [
        { id: '16', level: 'PRG', make: function (r) { var v = r.pick(LETS), d = r.int(2, 6), k = r.int(2, 6), a = r.int(1, 5), b = r.int(1, 5); return treePart(Dv(Lf(d * k, mono(v, -a).v), Lf(d, mono(v, b).v))); } }] },
      { num: '17', stem: 'Simplify. Write the answer with a positive exponent.', parts: [
        { id: '17', level: 'PRG', make: function (r) { var v = r.pick(LETS), c = r.pick([2, 2, 3]), p = r.int(1, 3), n = c === 3 ? 2 : r.pick([2, 3]), q = pickWhere(r, function () { return r.int(1, 8); }, function (x) { return x < p * n; }) || 1; return treePart(Mu(Pw(Lf(c, mono(v, -p).v), n), Lf(1, mono(v, q).v))); } }] },
      { num: '18', section: 'Part C — Scientific Notation and Rational Exponents', stem: 'Write each number in scientific notation.', parts: [{ id: '18a', level: 'BEG', make: q18a }, { id: '18b', level: 'BEG', make: q18b }] },
      { num: '19', stem: 'Write each number in standard notation.', parts: [{ id: '19a', level: 'BEG', make: function (r) { return q19(r, false); } }, { id: '19b', level: 'BEG', make: function (r) { return q19(r, true); } }] },
      { num: '20', stem: '', parts: [{ id: '20', level: 'PRG', make: q20 }] },
      { num: '21', stem: 'Express each power in radical form.', parts: [
        { id: '21a', level: 'EMG', make: function (r) { var mn = r.pick([[2, 5], [2, 3], [3, 4], [3, 5], [4, 5], [2, 7], [3, 7]]); return genRad(r.pick(['t', 't', 'x', 'a']), mn[0], mn[1], 'entire'); } },
        { id: '21b', level: 'EMG', make: function (r) { var mn = r.pick([[5, 6], [5, 8], [3, 8], [7, 8], [4, 9], [5, 7]]); return genRad(r.pick(['g', 'g', 'y', 'k']), mn[0], mn[1], 'entire'); } }] },
      { num: '22', stem: '', parts: [{ id: '22', level: 'ADV', make: q22 }] },
      { num: '23', section: 'Part D — Mixed Challenge', stem: 'Simplify, expressing your answer with a positive exponent.', parts: [
        { id: '23', level: 'ADV', make: function (r) { var g = pickWhere(r, function () { return { c: r.pick([2, 3]), p: r.int(1, 3), d: r.pick([4, 6, 8, 12, 18]), q: r.int(3, 7), e: r.pick([2, 3]), f: r.int(1, 2) }; }, function (o) { var k = o.d / (o.c * o.e); return k === Math.round(k) && k >= 1 && (o.q - o.p + o.f) !== 0; }) || { c: 3, p: 2, d: 6, q: 5, e: 2, f: 1 }; var v = r.pick(LETS);
          return treePart(Dv(Mu(Pw(Lf(g.c, mono(v, g.p).v), -1), Lf(g.d, mono(v, g.q).v)), Lf(g.e, mono(v, -g.f).v))); } }] },
      { num: '24', stem: function (sh) { return 'Consider ' + t(pw(sh.v, sh.a) + '\\times ' + pw(sh.v, sh.b)) + '.'; }, shared: q24shared, parts: [
        { id: '24a', level: 'PRG', make: function (r, sh) { return prodPart(sh.v, sh.a, sh.b); } },
        { id: '24b', level: 'PRG', make: function (r, sh) { var x = sh.s; return sciPart('If ' + t(sh.v + '=' + F(x)) + ', express the numeric value of the result in scientific notation.', x, {}, 'The expression simplifies to ' + t(sh.v) + ', so its value is ' + t(F(x) + '=' + sciTexOf(x)) + '.', ['Use your simplified answer from part (a).'], 'sci of ' + x); } }] },
      { num: '25', stem: function (sh) { return '<i>(Written Response)</i> A rectangular data-storage chip has an area of ' + t('\\left(' + sh.a + '\\times 10^{' + sh.k + '}\\right)^{2}') + ' mm' + t('^{2}') + '.'; }, shared: q25shared, parts: [
        { id: '25a', level: 'EMG', make: function (r, sh) { var x = sh.A; return sciPart('Express the area of the chip in proper scientific notation.', x, { diag: function (v) { if (releq(v, sciVal(2 * sh.a, 2 * sh.k))) return { code: 'coef-times', hint: 'Square the ' + t(sh.a) + ': ' + t(sh.a + '^{2}=' + sh.a * sh.a) + '.' }; if (releq(v, sciVal(sh.a * sh.a, sh.k + 2))) return { code: 'add-exp', hint: MODES['add-exp'] }; return null; } },
          t('\\left(' + sh.a + '\\times 10^{' + sh.k + '}\\right)^{2}=' + sh.a + '^{2}\\times 10^{' + sh.k + '\\times 2}=' + sh.a * sh.a + '\\times 10^{' + 2 * sh.k + '}' + (sh.a * sh.a >= 10 ? '=' + sciTexOf(x) : '')) + ' mm².', ['Power of a product: square the number and double the exponent of 10.', 'Renormalize so the coefficient is between 1 and 10.'], 'chip area'); } },
        { id: '25b', level: 'PRG', make: function (r, sh) { var Nt = K.sciTex(sh.N), At = sciTexOf(sh.A);
          return P.number('The chip contains ' + t(Nt) + ' ' + sh.what + ', spread evenly over its surface. Determine, to the nearest whole number, how many ' + sh.what + ' there are per square millimetre.', sh.R, function (v) { if (releq(v, sh.A / sh.N) || releq(v, Math.round(sh.A / sh.N))) return { code: 'u2l10-count', hint: 'Per square millimetre: divide the number of ' + sh.what + ' by the area.' }; var lg = Math.log10(v / sh.R); if (isFinite(lg) && Math.abs(lg - Math.round(lg)) < 1e-9 && Math.round(lg) !== 0) return { code: 'power-off', hint: 'The digits are right but the power of 10 is off. Subtract the exponents carefully.' }; return null; },
            t('\\dfrac{' + Nt + '}{' + At + '}=' + Number((K.sciParts(sh.N).a / K.sciParts(sh.A).a).toFixed(6)) + '\\times 10^{' + (K.sciParts(sh.N).n - K.sciParts(sh.A).n) + '}=' + sh.R) + ' ' + sh.what + ' per mm².', ['Divide the count by the area: divide the coefficients and subtract the exponents of 10.'], 'per mm2'); } }] }
    ],
    extra: EXTRA
  });
})(window);
