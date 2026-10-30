/* Math 15 · Unit 6 · Lesson 9 — Parallel and Perpendicular Lines (RF3)
 * Assignment 9 (u6_L09.tex, Questions 1–15) and the Lesson 9 Extra Practice (u6_EP09.tex, Questions 1–19).
 * Every part is a generator: same structure and idea as the booklet question (which kind of pair, signs, near misses,
 * where the unknown sits), new numbers from the seed; the booklet's own numbers are among the possible versions.
 * Model: Math 10C u6l3.js (parallel / perpendicular / neither, negative reciprocals, solving for a variable, the
 * horizontal–vertical exception, right triangles and rectangles).
 * Conversions: "calculate both slopes and state whether …" -> the slopes (and, for perpendicular, their product) in a
 * fields box, then the verdicts in a table; "classify" -> Parallel / Perpendicular / Neither; "explain / describe /
 * name" -> multiple choice whose options are reasons; "list every pair" -> tap the true statements.
 * Slopes accept equivalent fractions (6/4 = 3/2 = 1.5) and "undefined"; Extra Practice Part A asks for lowest terms
 * (a nudge, not a wrong answer). Lengths accept the exact radical or a decimal to the nearest tenth.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 8(a) (every k with k/a ∥ b/k). */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, Ln = HW.lines;

  HW.addCodes({
    'double-neg': 'Double negative slip in the slope formula', 'perp-same': 'Gave the original slope for a perpendicular',
    'perp-nosign': 'Reciprocal without changing the sign', 'perp-noflip': 'Changed the sign without taking the reciprocal', 'par-perp': 'Gave the perpendicular slope for a parallel line',
    'k-sign': 'Sign slip solving for k', 'k-no-start': 'Forgot the starting coordinate', 'k-flip': 'Used run over rise when solving for k',
    'k-par-perp': 'Used parallel (equal) slopes instead of perpendicular', 'k-perp-par': 'Used the perpendicular slope instead of an equal one',
    'k-divide': 'Divided instead of multiplying', 'k-multiply': 'Multiplied instead of dividing', 'len-no-root': 'Forgot the square root', 'sum-sq': 'Added instead of squaring',
    'sel-rel': 'Picked a pair with the other relationship', 'sel-none': 'Picked an unrelated pair', 'sel-missing': 'Missed a pair', 'sol-missing': 'Missed a solution', 'sol-extra': 'Extra solution', 'sol-sign': 'Solutions with the wrong sign',
    'u6l9-prod-sign': 'Product of the slopes with the wrong sign', 'u6l9-prod-add': 'Added the slopes instead of multiplying', 'u6l9-zero-und': 'Mixed up slope 0 and undefined',
    'u6l9-perim-half': 'Added only two sides for the perimeter', 'u6l9-4th-vertex': 'Fourth vertex from the wrong pair of sides', 'u6l9-sq-root': 'Gave a length instead of its square'
  });
  HW.addPartial({ 'perp-same': 'n', 'perp-noflip': 'b', 'par-perp': 'n', 'k-par-perp': 'n', 'k-perp-par': 'n', 'k-divide': 'b', 'k-multiply': 'b', 'sel-rel': 'n', 'sel-none': 'n',
    'u6l9-prod-sign': 's', 'u6l9-prod-add': 'n', 'u6l9-zero-und': 'b', 'u6l9-perim-half': 'b', 'u6l9-4th-vertex': 'n', 'u6l9-sq-root': 's' });

  /* ---------------- numbers and LaTeX ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function red(p, q) { if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function frT(p, q) { return Ln.frT(p, q); }
  function cl(x) { return Math.round(x * 1e6) / 1e6; }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }
  function nT(x) { return String(cl(x)); }
  function nb(x) { x = cl(x); return x < 0 ? '(' + x + ')' : String(x); }
  function ptT(P) { return '(' + nT(P[0]) + ',\\ ' + nT(P[1]) + ')'; }
  function nP(n, P) { return t(n + ptT(P)); }
  function gen(r, f, fb) { for (var i = 0; i < 900; i++) { var v = f(r); if (v) return v; } return fb; }
  function inBox(P, b) { return Math.abs(P[0]) <= b && Math.abs(P[1]) <= b; }
  function add(P, v, k) { k = k == null ? 1 : k; return [P[0] + k * v[0], P[1] + k * v[1]]; }
  function sameP(P, Q) { return P[0] === Q[0] && P[1] === Q[1]; }
  function distinct(arr) { for (var i = 0; i < arr.length; i++) for (var j = i + 1; j < arr.length; j++) if (sameP(arr[i], arr[j])) return false; return true; }
  function d2(A, P) { return (P[0] - A[0]) * (P[0] - A[0]) + (P[1] - A[1]) * (P[1] - A[1]); }
  function isSq(n) { var q = Math.round(Math.sqrt(n)); return q * q === n; }
  function simp(n) { var k = 1, m = n; for (var f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; } return [k, m]; }
  function lenT(A, P) { var s = simp(d2(A, P)); return s[1] === 1 ? String(s[0]) : (s[0] === 1 ? '' : s[0]) + '\\sqrt{' + s[1] + '}'; }
  function cross3(A, P, C) { return (P[0] - A[0]) * (C[1] - A[1]) - (P[1] - A[1]) * (C[0] - A[0]); }
  function segsCross(S, T) { var d1 = cross3(S[0], S[1], T[0]), d2_ = cross3(S[0], S[1], T[1]), d3 = cross3(T[0], T[1], S[0]), d4 = cross3(T[0], T[1], S[1]); return d1 * d2_ <= 0 && d3 * d4 <= 0; }
  function ptSegDist(X, S) { var A = S[0], Bq = S[1], dx = Bq[0] - A[0], dy = Bq[1] - A[1], L2 = dx * dx + dy * dy, u = Math.max(0, Math.min(1, ((X[0] - A[0]) * dx + (X[1] - A[1]) * dy) / L2)); return Math.hypot(X[0] - A[0] - u * dx, X[1] - A[1] - u * dy); }
  function onLine(A, P, C) { return (P[0] - A[0]) * (C[1] - A[1]) - (P[1] - A[1]) * (C[0] - A[0]) === 0; }

  /* slopes as [p, q] (lowest terms, q > 0), null = undefined */
  function slopeOf(A, P) { var dx = P[0] - A[0], dy = P[1] - A[1]; return dx === 0 ? null : red(dy, dx); }
  function sT(s) { return s == null ? '\\text{undefined}' : frT(s[0], s[1]); }
  function sP(s) { var x = sT(s); return s && s[0] < 0 ? '\\left(' + x + '\\right)' : x; }
  function sV(s) { return s == null ? null : s[0] / s[1]; }
  function sEq(a, b) { if (a == null || b == null) return a == null && b == null; return a[0] * b[1] === a[1] * b[0]; }
  function perpOf(s) { if (s == null) return [0, 1]; if (s[0] === 0) return null; return red(-s[1], s[0]); }
  function prod(a, b) { return red(a[0] * b[0], a[1] * b[1]); }
  function prodT(a, b) { var pr = prod(a, b); return sT(a) + '\\times ' + sP(b) + '=' + frT(pr[0], pr[1]); }
  function calc(A, P, nm) {
    var dy = P[1] - A[1], dx = P[0] - A[0];
    var s = (nm ? 'm_{' + nm + '}=' : '') + '\\frac{' + nT(P[1]) + '-' + nb(A[1]) + '}{' + nT(P[0]) + '-' + nb(A[0]) + '}=\\frac{' + nT(dy) + '}{' + nT(dx) + '}';
    if (dx === 0) return s + ',\\ \\text{undefined}';
    var f = sT(red(dy, dx)); return f === '\\frac{' + dy + '}{' + dx + '}' ? s : s + '=' + f;
  }
  var SLOPE_HINT = 'Slope ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + ' — subtract in the <b>same order</b> on the top and the bottom.';
  var NEG_HINT = 'Careful with negatives: subtracting a negative means adding, e.g. ' + t('3-(-2)=3+2=5') + '.';
  var REL_HINT = 'Parallel: equal slopes. Perpendicular: the slopes multiply to ' + t('-1') + ' (or one is horizontal and the other vertical).';

  /* ---------------- checkers ---------------- */
  function dnDiag(A, P) {
    var dx = P[0] - A[0], dy = P[1] - A[1], cand = [];
    if (dx) cand.push((P[1] + A[1]) / dx);
    if (P[0] + A[0]) { cand.push(dy / (P[0] + A[0])); cand.push((P[1] + A[1]) / (P[0] + A[0])); }
    return function (v) { for (var i = 0; i < cand.length; i++) if (near(v, cand[i])) return { code: 'double-neg', hint: NEG_HINT }; return null; };
  }
  function slopeChk(s, diag, lowest) {
    var c = K.slope(s, { diag: diag, lowest: !!lowest });
    return function (resp) {
      var r = c(resp);
      if (r.v === 'wrong' && r.code === 'slope-sign') return wrong('slope-sign', 'Check the sign. Subtract in the <b>same order</b> on the top and the bottom, ' + t('\\frac{y_2-y_1}{x_2-x_1}') + ', and watch the double negatives.');
      return r;
    };
  }
  function readSlope(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/^\s*m[^=]*=\s*/, '').trim();
    if (/undef/i.test(s)) return { und: true };
    var a = ex.parse(s); if (!a.ok) return null; var v = ex.value(a.ast); return isFinite(v) ? { v: v } : null;
  }
  /* the slope of a line parallel ('par') or perpendicular ('perp') to a line of slope m (m may be 0 or undefined) */
  function relChk(m, rel) {
    var T = rel === 'perp' ? perpOf(m) : m, base = slopeChk(T);
    return function (resp) {
      var r0 = base(resp); if (r0.v !== 'wrong') return r0;
      var R = readSlope(resp);
      if (R && m != null && m[0] !== 0 && R.v != null) {
        var mv = sV(m);
        if (rel === 'perp') {
          if (near(R.v, mv)) return wrong('perp-same', 'That is the slope itself — a line with that slope would be <b>parallel</b>. Perpendicular slopes are <b>negative reciprocals</b>: flip the fraction and change the sign.');
          if (near(R.v, 1 / mv)) return wrong('perp-nosign', 'You flipped it — now change the sign too. Perpendicular slopes have opposite signs (their product is ' + t('-1') + ').');
          if (near(R.v, -mv)) return wrong('perp-noflip', 'You changed the sign — now flip the fraction too. Check: the product of the two slopes must be ' + t('-1') + '.');
        } else if (near(R.v, -1 / mv)) return wrong('par-perp', 'That is the negative reciprocal — the slope of a <b>perpendicular</b> line. Parallel lines have <b>equal</b> slopes.');
      }
      if (R && (m == null || m[0] === 0)) {
        if (rel === 'perp' && m && m[0] === 0 && R.v === 0) return wrong('u6l9-zero-und', 'A slope of ' + t('0') + ' is a horizontal line. The line perpendicular to it is <b>vertical</b>, so its slope is undefined.');
        if (rel === 'perp' && m == null && R.und) return wrong('u6l9-zero-und', 'Undefined is a vertical line. The line perpendicular to it is <b>horizontal</b>: slope ' + t('0') + '.');
        if (rel === 'par' && m && m[0] === 0 && R.und) return wrong('u6l9-zero-und', 'A line parallel to a horizontal line is also horizontal: slope ' + t('0') + ' (undefined is vertical).');
        if (rel === 'par' && m == null && R.v === 0) return wrong('u6l9-zero-und', 'A line parallel to a vertical line is also vertical: its slope is undefined (' + t('0') + ' is horizontal).');
      }
      return r0;
    };
  }
  function slopeAns(prompt, s, chk, sol, hints, text, before) {
    var p = B.math(prompt, chk || slopeChk(s), sT(s), sol, hints, text, { keys: 'slope', before: before || t('m='), placeholder: 'e.g. -2/3 or undefined' });
    var bad = [];
    if (s && s[0] !== 0) { bad.push(sT([-s[0], s[1]])); if (Math.abs(s[0]) !== s[1]) bad.push(sT(red(s[1], s[0]))); } else if (s) bad.push('\\text{undefined}'); else bad.push('0');
    p.bad = bad.filter(function (b) { return b !== sT(s); }); return p;
  }
  function prodChk(a, b) {
    var P = prod(a, b), v = P[0] / P[1];
    return K.value(v, { diag: function (x) { if (near(x, -v) && v !== 0) return { code: 'u6l9-prod-sign', hint: 'Check the sign: ' + (a[0] * b[0] < 0 ? 'one slope is positive and one is negative, so the product is negative.' : 'both slopes have the same sign, so the product is positive.') }; if (near(x, sV(a) + sV(b))) return { code: 'u6l9-prod-add', hint: '<b>Multiply</b> the two slopes: top × top, bottom × bottom.' }; return null; } });
  }
  /* items: [{ nm, A, B }] -> the slopes; opt.prod: add a product box m₁ × m₂; opt.lowest */
  function slopeFields(prompt, items, sol, hints, text, opt) {
    opt = opt || {};
    items.forEach(function (it) { it.s = slopeOf(it.A, it.B); });
    var fields = items.map(function (it) { return { label: t('m_{' + it.nm + '}='), mode: 'math', keys: 'slope', placeholder: 'e.g. -2/3' }; });
    var chks = items.map(function (it) { return slopeChk(it.s, dnDiag(it.A, it.B), opt.lowest); }), keys = items.map(function (it) { return sT(it.s); });
    var ans = items.map(function (it) { return 'm_{' + it.nm + '}=' + sT(it.s); });
    if (opt.prod) { var a = items[0].s, b = items[1].s, P = prod(a, b); fields.push({ label: t('m_{' + items[0].nm + '}\\times m_{' + items[1].nm + '}='), mode: 'math', keys: 'slope', placeholder: 'e.g. -1' }); chks.push(prodChk(a, b)); keys.push(frT(P[0], P[1])); ans.push('\\text{product }' + frT(P[0], P[1])); }
    var p = B.fields(prompt, fields, chks, keys, t(ans.join(',\\quad ')), sol || items.map(function (it) { return t(calc(it.A, it.B, it.nm)); }).join('<br>'), hints || [SLOPE_HINT], text);
    p.bad = [keys.map(function (k, i) { var s = items[i] ? items[i].s : null; return s && s[0] ? sT([-s[0], s[1]]) : '5'; })];
    return p;
  }
  function dg(list, target) {
    return function (v) { for (var i = 0; i < list.length; i++) if (list[i][0] != null && isFinite(list[i][0]) && !near(list[i][0], target) && near(v, list[i][0])) return { code: list[i][1], hint: list[i][2] }; return null; };
  }
  function stripVar(chk) { return function (resp) { return chk(String(resp == null ? '' : resp).replace(/^\s*[a-zA-Z](_\{?\w+\}?)?\s*=\s*/, '')); }; }
  function numAns(prompt, val, list, sol, hints, text, before, after) {   // val number or [p, q]
    var fr = Array.isArray(val) ? red(val[0], val[1]) : [val, 1], tv = fr[0] / fr[1];
    var p = fr[1] === 1 ? B.number(prompt, fr[0], dg(list, tv), sol, hints, text, { before: before, after: after }) : B.fraction(prompt, fr, { diag: dg(list, tv), before: before, decimalOk: true }, sol, hints, text);
    p.check = stripVar(p.check);
    p.bad = list.filter(function (x) { return x[0] != null && isFinite(x[0]) && !near(x[0], tv); }).slice(0, 3).map(function (x) { var f = Ln.toFr(x[0]); return fr[1] === 1 ? String(cl(x[0])) : frT(f[0], f[1]); });
    return p;
  }
  function ptChk(T, list) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Type your answer first.');
      var r = Ln.readPoint(s);
      if (r.empty) return form('empty', 'Type your answer first.');
      if (r.kind !== 'pt') return form('unreadable', 'Write the point as an ordered pair, e.g. ' + t('(3,\\ -2)') + '.');
      if (!r.brackets && !r.named) return form('pt-brackets', 'Write the point in brackets: ' + t('(x,\\ y)') + '.');
      var P = [r.p[0].v, r.p[1].v];
      if (near(P[0], T[0]) && near(P[1], T[1])) return ok();
      for (var i = 0; i < (list || []).length; i++) if (near(P[0], list[i][0][0]) && near(P[1], list[i][0][1])) return wrong(list[i][1], list[i][2]);
      if (near(P[0], T[1]) && near(P[1], T[0])) return wrong('pt-swap', 'Your coordinates are in the wrong order: the ' + t('x') + '-coordinate comes first.');
      if (near(P[0], T[0])) return wrong('pt-y', 'Your ' + t('x') + '-coordinate is right — check the ' + t('y') + '-coordinate.');
      if (near(P[1], T[1])) return wrong('pt-x', 'Your ' + t('y') + '-coordinate is right — check the ' + t('x') + '-coordinate.');
      return wrong('pt', null);
    };
  }
  /* a length: the exact radical (any form) or a decimal to the nearest tenth */
  function lenChk(n) {
    var s = simp(n), L = Math.sqrt(n), base = K.radical({ k: s[0], n: 2, m: s[1] }, 'any');
    var diag = function (v) { if (near(v, n)) return { code: 'len-no-root', hint: 'That is ' + t('d^{2}') + ' — take the square root.' }; return null; };
    return function (resp) {
      var str = String(resp == null ? '' : resp).replace(/^\s*[A-Za-z]{1,2}\s*=\s*/, ''), pn = HW.parse.number(str);
      if (pn.ok) {
        if (Math.abs(pn.value - L) < 0.051) return ok();
        var h = diag(pn.value); if (h) return wrong(h.code, h.hint);
        return wrong('value', null);
      }
      if (!str.trim()) return form('empty', 'Type your answer first.');
      if (s[1] === 1) { var a0 = K.read(str); if (a0.res) return a0.res; if (near(a0.val, L)) return ok(); return wrong('value', null); }
      var rr = base(str);
      if (rr.v === 'correct' || rr.v === 'form') return ok();
      var a = K.read(str); if (!a.res) { var h2 = diag(a.val); if (h2) return wrong(h2.code, h2.hint); }
      return rr;
    };
  }

  /* ---------------- parallel / perpendicular / neither ---------------- */
  function relKind(a, b) {
    if (sEq(a, b)) return 'par';
    if ((a == null && b && b[0] === 0) || (b == null && a && a[0] === 0)) return 'perp';
    if (a && b && a[0] * b[0] === -a[1] * b[1]) return 'perp';
    return 'nei';
  }
  var REL = { par: 'parallel', perp: 'perpendicular', nei: 'neither' };
  function relWhy(a, b, kind) {
    var recip = a && b && a[0] * b[0] === a[1] * b[1];
    return {
      par: { perp: 'Perpendicular slopes multiply to ' + t('-1') + '. Reduce both fractions first — are they simply equal?', nei: 'Reduce both fractions to lowest terms, then compare them: they are equal.' },
      perp: { par: 'Parallel slopes are equal — these aren’t. Multiply them: what do you get?', nei: (a == null || b == null) ? 'A slope of ' + t('0') + ' is a horizontal line and an undefined slope is a vertical line — they meet at right angles.' : 'Multiply the two slopes. A product of ' + t('-1') + ' means perpendicular.' },
      nei: { par: 'Parallel slopes are equal (after reducing) — these aren’t.', perp: recip ? 'They are reciprocals, but with the <b>same sign</b>: the product is ' + t('+1') + ', not ' + t('-1') + '. Perpendicular slopes have opposite signs.' : (a == null || b == null) ? 'A vertical segment is perpendicular only to a horizontal one (slope ' + t('0') + ').' : (a[0] === 0 || b[0] === 0) ? 'A horizontal segment is perpendicular only to a vertical one (undefined slope).' : 'Multiply them: the product isn’t ' + t('-1') + ', so they aren’t perpendicular.' }
    }[kind];
  }
  function relSol(a, b, A, Bt) {
    var kind = relKind(a, b), x = A || sT(a), y = Bt || sT(b);
    if (a == null || b == null) {
      if (kind === 'par') return 'Both slopes are undefined: both segments are vertical, so they are <b>parallel</b>.';
      if (kind === 'perp') return 'One slope is ' + t('0') + ' (horizontal) and the other is undefined (vertical): horizontal meets vertical at a right angle, so they are <b>perpendicular</b> — the special case where the slopes can’t be multiplied.';
      return 'One segment is vertical (undefined slope) but the other is not horizontal: <b>neither</b>.';
    }
    if (kind === 'par') return (x !== sT(a) ? t(x + '=' + sT(a)) + ' and ' + t(y + '=' + sT(b)) + ': equal' : 'Equal') + ' slopes, so the segments are <b>parallel</b>.';
    if (a[0] === 0 && b[0] === 0) return 'Both slopes are ' + t('0') + ': <b>parallel</b>.';
    var pr = prod(a, b);
    if (kind === 'perp') return t(sT(a) + '\\times ' + sP(b) + '=' + frT(pr[0], pr[1])) + ', so the segments are <b>perpendicular</b>.';
    return 'The slopes are not equal' + (a[0] === 0 || b[0] === 0 ? ', and a horizontal segment is perpendicular only to a vertical one' : ', and ' + t(sT(a) + '\\times ' + sP(b) + '=' + frT(pr[0], pr[1]) + '\\ne -1')) + ': <b>neither</b>.';
  }
  function relMC(r, prompt, a, b, sol, text, hints) {
    var kind = relKind(a, b), w = relWhy(a, b, kind);
    var opts = [{ id: 'par', html: '<b>Parallel</b>' }, { id: 'perp', html: '<b>Perpendicular</b>' }, { id: 'nei', html: '<b>Neither</b>' }].map(function (o) { return { html: o.html, right: o.id === kind, why: o.id === kind ? null : w[o.id], code: 'said-' + o.id }; });
    return B.mc(r, prompt, opts, sol || relSol(a, b), hints || [REL_HINT], text, true);
  }
  HW.addCodes({ 'mc-said-par': 'Said parallel', 'mc-said-perp': 'Said perpendicular', 'mc-said-nei': 'Said neither' });
  /* a table of verdicts: sets [{ id, label, a, b }]; cols: which relationships are offered */
  function relGrid(prompt, sets, mode, sol, text) {
    var cols = mode === 'par' ? [{ id: 'y', html: 'Parallel' }, { id: 'n', html: 'Not parallel' }] : mode === 'perp' ? [{ id: 'y', html: 'Perpendicular' }, { id: 'n', html: 'Not perpendicular' }] : [{ id: 'par', html: 'Parallel' }, { id: 'perp', html: 'Perpendicular' }, { id: 'nei', html: 'Neither' }];
    var want = {}, byId = {};
    sets.forEach(function (st) { var k = relKind(st.a, st.b); want[st.id] = mode === 'all' ? k : (k === mode ? 'y' : 'n'); byId[st.id] = st; });
    return B.grid(prompt, sets.map(function (st) { return { id: st.id, html: st.label }; }), cols, want, { why: function (row) { var st = byId[row]; return 'Look at (' + row + ') again: ' + t(sT(st.a)) + ' and ' + t(sT(st.b)) + '. ' + REL_HINT; } },
      sol || sets.map(function (st) { return '(' + st.id + ') ' + relSol(st.a, st.b); }).join('<br>'), [REL_HINT], text);
  }

  /* ---------------- generators ---------------- */
  var SL_POOL = [[1, 2], [2, 1], [2, 3], [3, 2], [3, 4], [4, 3], [1, 3], [3, 1], [2, 5], [5, 2], [3, 5], [1, 4], [4, 1], [1, 1]];
  function randSlope(r, o) { o = o || {}; var s = r.pick(o.pool || SL_POOL); var sg = o.sign || (r.chance(0.5) ? 1 : -1); return red(sg * s[0], s[1]); }
  /* a segment with slope s (null = vertical) */
  function segWith(r, s, box, avoid) {
    return gen(r, function (r) {
      var v = s == null ? [0, 1] : [s[1], s[0]], j = s == null || s[0] === 0 ? r.int(3, 9) : r.int(1, Math.max(1, Math.floor(10 / Math.max(Math.abs(v[0]), Math.abs(v[1])))));
      var P = [r.int(-box, box), r.int(-box, box)], Q = add(P, v, j);
      if (!inBox(Q, box) || d2(P, Q) < 9) return null;
      if (avoid && (avoid.some(function (X) { return sameP(X, P) || sameP(X, Q); }) || (avoid.length >= 2 && onLine(avoid[0], avoid[1], P) && onLine(avoid[0], avoid[1], Q)))) return null;
      if (r.chance(0.5) && s && s[0] !== 0) return [Q, P];
      return [P, Q];
    }, null);
  }
  /* the second slope of a pair of the given kind (nei: a classic near miss) */
  function partner(r, a, kind) {
    if (kind === 'par') return a;
    if (kind === 'perp') return perpOf(a);
    var opts = [];
    if (Math.abs(a[0]) !== a[1]) opts.push(red(a[1] * (a[0] < 0 ? -1 : 1), Math.abs(a[0])));   // reciprocal, same sign
    opts.push([-a[0], a[1]]);                                                                  // opposite sign
    var p = perpOf(a); opts.push(red(p[0] + (p[0] < 0 ? -1 : 1), p[1]));                       // near perpendicular
    if (p[1] > 1) opts.push(red(p[0], p[1] + 1));
    var c = r.pick(opts); return relKind(a, c) === 'nei' ? c : [-a[0], a[1]];
  }
  function pairOf(r, kind, box, pool) {
    return gen(r, function (r) {
      var a = randSlope(r, { pool: pool }), b = partner(r, a, kind); if (Math.abs(b[0]) > 9 || b[1] > 9) return null;
      var S1 = segWith(r, a, box); if (!S1) return null; var S2 = segWith(r, b, box, S1); if (!S2) return null;
      return { P: [S1[0], S1[1], S2[0], S2[1]], a: a, b: b, kind: kind };
    }, null);
  }
  function fbPair(P) { var a = slopeOf(P[0], P[1]), b = slopeOf(P[2], P[3]); return { P: P, a: a, b: b, kind: relKind(a, b) }; }
  function pairLabel(N, P) { return nP(N[0], P[0]) + ', ' + nP(N[1], P[1]) + ' and ' + nP(N[2], P[2]) + ', ' + nP(N[3], P[3]); }
  function pairFields(prompt, st, text, opt) {
    var N = st.N, P = st.P, n1 = N[0] + N[1], n2 = N[2] + N[3];
    return slopeFields(prompt, [{ nm: n1, A: P[0], B: P[1] }, { nm: n2, A: P[2], B: P[3] }],
      t(calc(P[0], P[1], n1)) + '<br>' + t(calc(P[2], P[3], n2)) + (opt && opt.prod ? '<br>' + t('m_{' + n1 + '}\\times m_{' + n2 + '}=' + prodT(st.a, st.b)) : '') + '<br>' + relSol(st.a, st.b),
      [SLOPE_HINT, opt && opt.prod ? 'Multiply the two slopes: top × top and bottom × bottom.' : 'Reduce both fractions before you compare them.'], text, opt);
  }
  function patterns(r, book, kinds) { return r.chance(0.4) ? book : r.shuffle(kinds.slice()); }

  /* ---------------- figures ---------------- */
  function lbl(P, name) { return { x: P[0], y: P[1], label: name }; }
  function graphOf(spec) { return '<div class="fig">' + HW.graph(spec) + '</div>'; }

  /* ---------------- solving for a variable ---------------- */
  function solveSol(eqT, steps) { return t(eqT) + (steps ? '<br>' + t(steps) : ''); }

  /* =============================== ASSIGNMENT =============================== */
  var QUESTIONS = [
    /* ---------------- Q1 ---------------- */
    { num: '1', section: 'Part A — Slope Review and Parallel Segments', stem: 'Use the slope formula to calculate the slope of the segment with the given endpoints.', parts: (function () {
      function mk(id, level, g, names, text) {
        return { id: id, level: level, make: function (r) {
          var P = g(r), s = slopeOf(P[0], P[1]);
          var sol = t(calc(P[0], P[1], names)) + (s == null ? '<br>Both points have ' + t('x=' + P[0][0]) + ': the run is ' + t('0') + ', so the segment is vertical and its slope is <b>undefined</b>.' : s[0] === 0 ? '<br>Both points have ' + t('y=' + P[0][1]) + ': the rise is ' + t('0') + ', so the segment is horizontal (slope ' + t('0') + ').' : '');
          return slopeAns('(' + id.slice(1) + ') ' + nP(names[0], P[0]) + ', ' + nP(names[1], P[1]), s, slopeChk(s, dnDiag(P[0], P[1])), sol, s == null || s[0] === 0 ? ['Compare the coordinates first: which one is the same for both points?', SLOPE_HINT] : [SLOPE_HINT, 'Reduce the fraction.'], text, t('m_{' + names + '}='));
        } };
      }
      return [
        mk('1a', 'BEG', function (r) { return gen(r, function (r) { var m = r.int(2, 4), q = r.int(2, 4), A = [r.int(1, 4), r.int(1, 6)]; return [A, add(A, [q, m * q])]; }, [[2, 5], [6, 13]]); }, 'AB', 'slope, positive integer'),
        mk('1b', 'BEG', function (r) { return gen(r, function (r) { var m = -r.int(1, 3), q = r.pick([4, 6, 8]), A = [-r.int(1, 4), r.int(1, 5)], Q = add(A, [q, m * q]); if (Q[0] <= 0 || Q[1] >= 0) return null; return [A, Q]; }, [[-3, 4], [5, -4]]); }, 'CD', 'slope, negative integer'),
        mk('1c', 'BEG', function (r) { var x = -r.int(2, 8), y = -r.int(1, 4); return [[x, y], [x, y + r.int(5, 11)]]; }, 'EF', 'vertical: undefined'),
        mk('1d', 'BEG', function (r) { var y = r.int(1, 6), x = -r.int(4, 9); return [[x, y], [x + r.int(8, 18), y]]; }, 'GH', 'horizontal: zero')];
    })() },
    /* ---------------- Q2 ---------------- */
    { num: '2', shared: function (r) {
        var pat = patterns(r, ['par', 'nei', 'par'], [r.pick(['par', 'nei']), 'par', 'nei']), N = [['J', 'K', 'L', 'M'], ['N', 'P', 'Q', 'R'], ['S', 'T', 'U', 'V']], fb = [[[1, 1], [4, 7], [-2, -3], [1, 3]], [[-5, 6], [3, 2], [-1, 5], [3, -3]], [[-4, -5], [2, 7], [0, -6], [3, 0]]];
        return pat.map(function (k, i) { var st = pairOf(r, k, 8) || fbPair(fb[i]); st.N = N[i]; st.id = 'abc'.charAt(i); st.label = '(' + st.id + ') ' + pairLabel(st.N, st.P); return st; });
      },
      stem: 'For each pair of segments, calculate both slopes and state whether the segments are parallel.',
      parts: [0, 1, 2].map(function (i) { return { id: '2' + 'abc'.charAt(i), level: 'BEG', make: function (r, s) { var st = s[i]; return pairFields('(' + st.id + ') ' + pairLabel(st.N, st.P) + ': find both slopes.', st, 'parallel? two slopes'); } }; }).concat([
        { id: '2v', sub: 'verdict', level: 'BEG', make: function (r, s) { return relGrid('Are the segments parallel?', s, 'par', null, 'parallel verdicts'); } }]) },
    /* ---------------- Q3 ---------------- */
    { num: '3', section: 'Part B — Perpendicular Segments and Negative Reciprocals', shared: function (r) {
        var pat = patterns(r, ['perp', 'nei', 'perp'], [r.pick(['perp', 'nei']), 'perp', 'nei']), N = [['W', 'X', 'Y', 'Z'], ['A_1', 'B_1', 'C_1', 'D_1'], ['E_1', 'F_1', 'G_1', 'H_1']], fb = [[[-3, 1], [1, 4], [2, 5], [5, 1]], [[-2, -3], [4, 1], [0, 2], [3, -2]], [[-5, 0], [0, 3], [1, -4], [4, -9]]];
        return pat.map(function (k, i) { var st = pairOf(r, k, 9) || fbPair(fb[i]); if (k === 'nei' && st.kind === 'nei' && r.chance(0.6)) { var p = perpOf(st.a); var b2 = red(p[0] * (p[0] < 0 ? 1 : 1) + (p[0] < 0 ? -1 : 1), p[1]); if (relKind(st.a, b2) === 'nei') { var S2 = segWith(r, b2, 9, [st.P[0], st.P[1]]); if (S2) { st.P = [st.P[0], st.P[1], S2[0], S2[1]]; st.b = b2; } } } st.N = N[i]; st.id = 'abc'.charAt(i); st.label = '(' + st.id + ') ' + pairLabel(st.N, st.P); return st; });
      },
      stem: 'For each pair of segments, calculate both slopes, multiply them, and state whether the segments are perpendicular.',
      parts: [0, 1, 2].map(function (i) { return { id: '3' + 'abc'.charAt(i), level: 'BEG', make: function (r, s) { var st = s[i]; return pairFields('(' + st.id + ') ' + pairLabel(st.N, st.P) + ': find both slopes and their product.', st, 'perpendicular? slopes and product', { prod: true }); } }; }).concat([
        { id: '3v', sub: 'verdict', level: 'BEG', make: function (r, s) { return relGrid('Are the segments perpendicular?', s, 'perp', null, 'perpendicular verdicts'); } }]) },
    /* ---------------- Q4 ---------------- */
    { num: '4', stem: 'For each slope, use “flip it, and change the sign” to state the slope of a <b>perpendicular</b> line. Also state the slope of a <b>parallel</b> line.', parts: (function () {
      function mk(id, level, g) {
        return { id: id, level: level, make: function (r) {
          var m = g(r), pp = perpOf(m);
          var p = B.fields('(' + id.slice(1) + ') ' + t('m=' + sT(m)), [{ label: 'Perpendicular: ' + t('m_{\\perp}='), mode: 'math', keys: 'slope', placeholder: 'e.g. -3/2' }, { label: 'Parallel: ' + t('m_{\\parallel}='), mode: 'math', keys: 'slope', placeholder: 'e.g. 2/3' }],
            [relChk(m, 'perp'), relChk(m, 'par')], [sT(pp), sT(m)], t('m_{\\perp}=' + sT(pp) + ',\\quad m_{\\parallel}=' + sT(m)),
            'Perpendicular: flip ' + t(m[1] === 1 ? sT(m) + '=' + frT(m[0], 1).replace(/^(-?)(\d+)$/, '$1\\frac{$2}{1}') : sT(m)) + ' and change the sign: ' + t(sT(pp)) + ' (check: ' + t(prodT(m, pp)) + ').<br>Parallel: the same slope, ' + t(sT(m)) + '.',
            ['Perpendicular: flip the fraction and change the sign. Write a whole number over 1 first.', 'Parallel lines have equal slopes.'], 'perpendicular and parallel slopes');
          p.bad = [[sT(red(m[1] * (m[0] < 0 ? -1 : 1), Math.abs(m[0]))), sT(m)], [sT(pp), sT(pp)]].filter(function (b) { return b[0] !== sT(pp) || b[1] !== sT(m); });
          return p;
        } };
      }
      function prop(r, sg, minP) { return gen(r, function (r) { var q = r.int(3, 10), p = r.int(minP || 1, q - 1); return gcd(p, q) === 1 ? [sg * p, q] : null; }, [sg * 2, 3]); }
      return [mk('4a', 'BEG', function (r) { return prop(r, 1, 2); }), mk('4b', 'EMG', function (r) { return [r.int(2, 12) * (r.chance(0.8) ? -1 : 1), 1]; }),
        mk('4c', 'BEG', function (r) { return prop(r, 1, 2); }), mk('4d', 'EMG', function (r) { return prop(r, -1, 2); })];
    })() },
    /* ---------------- Q5 ---------------- */
    { num: '5', stem: 'Determine whether each pair of slopes describes parallel lines, perpendicular lines, or neither.', parts: (function () {
      function fr(r, maxQ) { return gen(r, function (r) { var q = r.int(2, maxQ || 9), p = r.int(1, (maxQ || 9) + 1); if (gcd(p, q) !== 1 || p === q) return null; return [p, q]; }, [5, 8]); }
      function mk(id, level, g, text) { return { id: id, level: level, make: function (r) { var v = g(r), a = v[0], b = v[1]; return relMC(r, '(' + id.slice(1) + ') ' + t('m_1=' + sT(a) + ',\\quad m_2=' + sT(b)), a, b, relSol(a, b), text); } }; }
      return [
        mk('5a', 'BEG', function (r) { var f = fr(r); return [f, f]; }, 'equal: parallel'),
        mk('5b', 'BEG', function (r) { var f = fr(r, 7), a = [-f[0], f[1]]; return [a, perpOf(a)]; }, 'negative reciprocals: perpendicular'),
        mk('5c', 'EMG', function (r) { var n = r.int(2, 12), sg = r.chance(0.7) ? 1 : -1; return [[sg * n, 1], [-sg, n]]; }, 'integer and −1/n: perpendicular'),
        mk('5d', 'EMG', function (r) { var f = fr(r, 11); return [f, [f[1], f[0]]]; }, 'reciprocals, same sign: neither'),
        mk('5e', 'BEG', function (r) { var f = r.chance(0.5) ? [r.int(2, 12), 1] : fr(r, 9); return [[-f[0], f[1]], [-f[0], f[1]]]; }, 'equal negatives: parallel'),
        mk('5f', 'EMG', function (r) { var f = fr(r, 7); return [f, [-f[0], f[1]]]; }, 'opposite sign: neither')];
    })() },
    /* ---------------- Q6 ---------------- */
    { num: '6', section: 'Part C — Solving for an Unknown Slope', stem: 'The slopes of two <b>parallel</b> lines are given. Determine the value of the variable.', parts: [
      { id: '6a', level: 'EMG', make: function (r) { var a = r.int(2, 9), d = r.int(2, 6), k = a * d;
        return numAns('(a) ' + t(a + ',\\ \\frac{k}{' + d + '}'), k, [[a / d, 'k-divide', 'Undo “divide by ' + t(d) + '” by <b>multiplying</b> both sides by ' + t(d) + '.'], [-d / a, 'k-perp-par', 'These lines are <b>parallel</b>, so the slopes are equal — no reciprocal needed.'], [-k, 'k-sign', 'Check the sign.'], [a + d, 'k-divide', 'Multiply, don’t add: ' + t('k=' + a + '\\times ' + d) + '.']],
          'Parallel lines have equal slopes: ' + t('\\frac{k}{' + d + '}=' + a + '\\ \\Rightarrow\\ k=' + a + '\\times ' + d + '=' + k) + '.', ['Set the two slopes equal.', 'Multiply both sides by ' + t(d) + '.'], 'parallel: k/d = a', t('k=')); } },
      { id: '6b', level: 'EMG', make: function (r) { var a = r.int(2, 6), d = r.int(2, 7), n = -a * d;
        return numAns('(b) ' + t('-' + a + ',\\ \\frac{n}{' + d + '}'), n, [[-n, 'k-sign', 'The slope is negative, so ' + t('n') + ' must be negative.'], [d / a, 'k-perp-par', 'Parallel: set the slopes <b>equal</b> — no reciprocal.'], [-a / d, 'k-divide', 'Multiply both sides by ' + t(d) + '.']],
          t('\\frac{n}{' + d + '}=-' + a + '\\ \\Rightarrow\\ n=-' + a + '\\times ' + d + '=' + n), ['Set the slopes equal, then multiply both sides by ' + t(d) + '.'], 'parallel: n/d = -a', t('n=')); } },
      { id: '6c', level: 'EMG', make: function (r) { var f = gen(r, function (r) { var q = r.int(3, 7), p = r.int(1, q - 1), c = r.int(2, 3); if (gcd(p, q) !== 1) return null; return [p, q, c]; }, [3, 4, 2]), p = f[0], q = f[1], d = q * f[2], x = p * f[2];
        return numAns('(c) ' + t('\\frac{' + p + '}{' + q + '},\\ \\frac{p}{' + d + '}'), x, [[p * d / q / f[2] / f[2], 'k-divide', 'Multiply both sides by ' + t(d) + ': ' + t('p=\\frac{' + p + '}{' + q + '}\\times ' + d) + '.'], [-q * d / p, 'k-perp-par', 'Parallel: set the slopes <b>equal</b>.'], [d / p * q === x ? null : d * q / p, 'k-flip', 'Keep the fraction the right way up: ' + t('\\frac{p}{' + d + '}=\\frac{' + p + '}{' + q + '}') + '.']],
          t('\\frac{p}{' + d + '}=\\frac{' + p + '}{' + q + '}\\ \\Rightarrow\\ p=\\frac{' + p + '}{' + q + '}\\times ' + d + '=' + x) + ' (equivalent fractions: ' + t('\\frac{' + p + '}{' + q + '}=\\frac{' + x + '}{' + d + '}') + ').', ['Set the slopes equal. What do you multiply ' + t(q) + ' by to get ' + t(d) + '?'], 'parallel: p/d = a/b', t('p=')); } },
      { id: '6d', level: 'PRG', make: function (r) { var f = gen(r, function (r) { var q = r.int(3, 8), p = r.int(1, q - 1), c = r.int(2, 3); if (gcd(p, q) !== 1) return null; return [p, q, c]; }, [5, 6, 2]), p = f[0], q = f[1], d = q * f[2], w = p * f[2];
        return numAns('(d) ' + t('-\\frac{' + p + '}{' + q + '},\\ -\\frac{w}{' + d + '}'), w, [[-w, 'k-sign', 'Both slopes already have a minus sign in front: ' + t('-\\frac{w}{' + d + '}=-\\frac{' + p + '}{' + q + '}') + ' means ' + t('\\frac{w}{' + d + '}=\\frac{' + p + '}{' + q + '}') + ', so ' + t('w') + ' is positive.'], [-q * d / p, 'k-perp-par', 'Parallel: set the slopes <b>equal</b>.']],
          t('-\\frac{w}{' + d + '}=-\\frac{' + p + '}{' + q + '}\\ \\Rightarrow\\ \\frac{w}{' + d + '}=\\frac{' + p + '}{' + q + '}\\ \\Rightarrow\\ w=' + w), ['Set the slopes equal. Both have a minus sign in front, so the minus signs match.'], 'parallel: -w/d = -p/q', t('w=')); } }] },
    /* ---------------- Q7 ---------------- */
    { num: '7', stem: 'The slopes of two <b>perpendicular</b> lines are given. Determine the value of the variable.', parts: [
      { id: '7a', level: 'EMG', make: function (r) { var n = r.int(2, 9), c = r.pick([n, n, n, 1].concat([2, 3].filter(function (x) { return n % x === 0; }))), h = red(-n, c);
        return numAns('(a) ' + t('\\frac{1}{' + n + '},\\ ' + (c === 1 ? '' : c) + 'h'), h, [[1 / (n * c), 'k-perp-par', 'Perpendicular, not parallel: ' + t((c === 1 ? '' : c) + 'h') + ' must be the <b>negative reciprocal</b> of ' + t('\\frac{1}{' + n + '}') + ', which is ' + t('-' + n) + '.'], [n / c, 'perp-nosign', 'Change the sign too: the negative reciprocal of ' + t('\\frac{1}{' + n + '}') + ' is ' + t('-' + n) + '.'], [-n * c, 'k-multiply', 'Solve ' + t(c + 'h=-' + n) + ' by <b>dividing</b> by ' + t(c) + '.']],
          'The negative reciprocal of ' + t('\\frac{1}{' + n + '}') + ' is ' + t('-' + n) + ': ' + t((c === 1 ? '' : c) + 'h=-' + n + '\\ \\Rightarrow\\ h=' + sT(h)) + '. Check: ' + t('\\frac{1}{' + n + '}\\times(-' + n + ')=-1') + '.', ['The product of perpendicular slopes is ' + t('-1') + ': the second slope must be the negative reciprocal of the first.'], 'perpendicular: 1/n and ch', t('h=')); } },
      { id: '7b', level: 'PRG', make: function (r) { var a = r.int(2, 6), c = r.int(2, 9), p = -a * c;
        return numAns('(b) ' + t(a + ',\\ \\frac{' + c + '}{p}'), p, [[c / a, 'k-perp-par', 'That makes the slopes equal (parallel). For perpendicular, ' + t('\\frac{' + c + '}{p}') + ' must equal ' + t('-\\frac{1}{' + a + '}') + '.'], [-p, 'k-sign', 'Check the sign: the product must be ' + t('-1') + ', so ' + t('p') + ' is negative.'], [-c / a, 'k-flip', 'From ' + t('\\frac{' + c + '}{p}=-\\frac{1}{' + a + '}') + ', cross-multiply: ' + t('p=-' + a + '\\times ' + c) + '.']],
          'The second slope must be ' + t('-\\frac{1}{' + a + '}') + ': ' + t('\\frac{' + c + '}{p}=-\\frac{1}{' + a + '}\\ \\Rightarrow\\ p=-' + a + '\\times ' + c + '=' + p) + '. Check: ' + t(a + '\\times\\frac{' + c + '}{' + p + '}=-1') + '.', ['The negative reciprocal of ' + t(a) + ' is ' + t('-\\frac{1}{' + a + '}') + '. Set ' + t('\\frac{' + c + '}{p}') + ' equal to it and cross-multiply.'], 'perpendicular: a and c/p', t('p=')); } },
      { id: '7c', level: 'PRG', make: function (r) { var a = r.int(2, 7), j = r.int(1, 4), d = a * j;
        return numAns('(c) ' + t('-' + a + ',\\ \\frac{s}{' + d + '}'), j, [[-a * d, 'k-perp-par', 'That makes the slopes equal (parallel). Perpendicular: ' + t('\\frac{s}{' + d + '}') + ' must be ' + t('\\frac{1}{' + a + '}') + '.'], [-j, 'k-sign', 'The negative reciprocal of ' + t('-' + a) + ' is <b>positive</b>: ' + t('\\frac{1}{' + a + '}') + '.']],
          'The negative reciprocal of ' + t('-' + a) + ' is ' + t('\\frac{1}{' + a + '}') + ': ' + t('\\frac{s}{' + d + '}=\\frac{1}{' + a + '}\\ \\Rightarrow\\ s=\\frac{' + d + '}{' + a + '}=' + j) + '.', ['Flip ' + t('-' + a) + ' and change the sign, then set ' + t('\\frac{s}{' + d + '}') + ' equal to it.'], 'perpendicular: -a and s/d', t('s=')); } },
      { id: '7d', level: 'ADV', make: function (r) { var f = gen(r, function (r) { var p = r.int(2, 5), q = r.int(3, 7), j = r.int(2, 4); if (gcd(p, q) !== 1) return null; return [p, q, p * j]; }, [3, 4, 12]), p = f[0], q = f[1], d = f[2], w = -q * d / p;
        return numAns('(d) ' + t('-\\frac{' + p + '}{' + q + '},\\ -\\frac{w}{' + d + '}'), w, [[p * d / q, 'k-perp-par', 'That makes the slopes equal (parallel). The second slope must be the negative reciprocal, ' + t('\\frac{' + q + '}{' + p + '}') + '.'], [-w, 'k-sign', 'The second slope must be <b>positive</b> (' + t('\\frac{' + q + '}{' + p + '}') + '), and it is written ' + t('-\\frac{w}{' + d + '}') + ' — so ' + t('w') + ' is negative.']],
          'The negative reciprocal of ' + t('-\\frac{' + p + '}{' + q + '}') + ' is ' + t('\\frac{' + q + '}{' + p + '}') + ':<br>' + t('-\\frac{w}{' + d + '}=\\frac{' + q + '}{' + p + '}\\ \\Rightarrow\\ -' + p + 'w=' + q * d + '\\ \\Rightarrow\\ w=' + w), ['Find the negative reciprocal of ' + t('-\\frac{' + p + '}{' + q + '}') + ' first.', 'Set ' + t('-\\frac{w}{' + d + '}') + ' equal to it and cross-multiply. Watch the signs.'], 'perpendicular: -p/q and -w/d', t('w=')); } }] },
    /* ---------------- Q8 ---------------- */
    { num: '8', section: 'Part D — Applications and Mixed Practice', shared: function (r) {
        var kind = r.chance(0.7) ? 'par' : 'nei';
        var st = gen(r, function (r) { var a = randSlope(r, { pool: [[3, 2], [4, 3], [5, 4], [2, 3], [3, 4], [5, 2]], sign: 1 }), b = kind === 'par' ? a : red(a[0] + r.pick([-1, 1]) * 1, a[1]); if (b[0] <= 0 || sEq(a, b)) b = kind === 'par' ? a : null; if (!b) return null;
          var P = [r.int(0, 4), r.int(0, 5)], j = r.int(2, 4), Q = add(P, [a[1], a[0]], j), C = [-r.int(1, 4), -r.int(0, 3)], c = r.int(2, 4), D = add(C, [b[1], b[0]], c); if (!inBox(Q, 20) || !inBox(D, 20) || onLine(P, Q, C) && onLine(P, Q, D)) return null; return { P: [P, Q, C, D], a: a, b: b, kind: relKind(a, b) }; }, fbPair([[2, 4], [10, 16], [-3, -2], [5, 10]]));
        st.N = ['T_1', '', 'T_2', '']; return st;
      },
      stem: function (s) { return 'A resort’s trail map shows two ski trails. Trail 1 runs from ' + t(ptT(s.P[0])) + ' to ' + t(ptT(s.P[1])) + '. Trail 2 runs from ' + t(ptT(s.P[2])) + ' to ' + t(ptT(s.P[3])) + ', where each grid unit represents ' + t('100') + ' m. Are the two trails parallel?'; },
      parts: [
        { id: '8', sub: 'i', level: 'EMG', make: function (r, s) { return slopeFields('Find the slope of each trail.', [{ nm: '1', A: s.P[0], B: s.P[1] }, { nm: '2', A: s.P[2], B: s.P[3] }], t(calc(s.P[0], s.P[1], '1')) + '<br>' + t(calc(s.P[2], s.P[3], '2')), [SLOPE_HINT], 'trail slopes'); } },
        { id: '8v', sub: 'ii', level: 'BEG', make: function (r, s) { var par = s.kind === 'par';
          return B.mc(r, 'Are the two trails parallel?', [
            { html: '<b>Yes</b> — the slopes are equal.', right: par, why: par ? null : 'Compare the slopes after reducing: ' + t(sT(s.a)) + ' and ' + t(sT(s.b)) + ' are not equal.' },
            { html: '<b>No</b> — the slopes are different.', right: !par, why: par ? 'Reduce both fractions: they are equal.' : null },
            { html: '<b>Yes</b> — both trails go uphill.', why: 'Rising together isn’t enough: parallel needs <b>equal</b> slopes.' },
            { html: '<b>No</b> — the trails have different lengths.', why: 'Length doesn’t matter for parallel; only the slopes do.' }],
            t('m_1=' + sT(s.a)) + ' and ' + t('m_2=' + sT(s.b)) + (par ? ': equal slopes, so the trails are <b>parallel</b>.' : ': different slopes, so the trails are <b>not parallel</b>.'), [REL_HINT], 'trails parallel?'); } }] },
    /* ---------------- Q9 ---------------- */
    { num: '9', parts: [
      { id: '9', level: 'EMG', make: function (r) {
        var g = gen(r, function (r) { var m = r.int(2, 5) * (r.chance(0.7) ? 1 : -1), A = [r.int(-3, 3), r.int(-4, 4)], q = r.int(1, 4), Q = add(A, [q, m * q]); if (!inBox(Q, 16)) return null; return { A: A, B: Q, m: m }; }, { A: [1, 2], B: [5, 10], m: 2 });
        var s = [g.m, 1], ps = perpOf(s);
        return B.mc(r, '<i>(Multiple choice)</i> A segment passes through ' + t(ptT(g.A)) + ' and ' + t(ptT(g.B)) + '. A line perpendicular to this segment has slope', [
          { html: t(sT(ps)), right: true }, { html: t(sT(s)), why: 'That is the slope of the segment itself (a parallel line). Take the negative reciprocal.' },
          { html: t(sT([-s[0], 1])), why: 'You changed the sign but didn’t flip it. Negative reciprocal: both.' }, { html: t(sT(red(1, g.m))), why: 'You flipped it but kept the sign. Perpendicular slopes have opposite signs.' }],
          t(calc(g.A, g.B)) + '. The negative reciprocal is ' + t(sT(ps)) + ' (check: ' + t(prodT(s, ps)) + ').', ['Find the slope of the segment, then flip it and change its sign.'], 'MC perpendicular slope');
      } }] },
    { num: '10', parts: [
      { id: '10', level: 'BEG', make: function (r) {
        var g = gen(r, function (r) { var m = r.int(1, 4) * (r.chance(0.7) ? 1 : -1), A = [-r.int(1, 5), -r.int(0, 4)], q = r.int(3, 6), Q = add(A, [q, m * q]); if (!inBox(Q, 16)) return null; return { A: A, B: Q, m: m, rise: m * q, run: q }; }, { A: [-4, -1], B: [2, 5], m: 1, rise: 6, run: 6 });
        var seen = {}, opts = [{ html: t(String(g.m)), right: true }]; seen[g.m] = 1;
        [[-g.m, 'The sign is wrong — the segment ' + (g.m > 0 ? 'rises' : 'falls') + ' from left to right. A parallel line has the <b>same</b> slope.'], [sV(perpOf([g.m, 1])), 'That is the negative reciprocal: the slope of a <b>perpendicular</b> line.'], [g.rise, 'That is just the rise. Divide it by the run.'], [0, 'A slope of ' + t('0') + ' is horizontal. This segment isn’t horizontal.']].forEach(function (o) { if (opts.length < 4 && !seen[o[0]]) { seen[o[0]] = 1; var f = Ln.toFr(o[0]); opts.push({ html: t(frT(f[0], f[1])), why: o[1] }); } });
        return B.mc(r, '<i>(Multiple choice)</i> A segment passes through ' + t(ptT(g.A)) + ' and ' + t(ptT(g.B)) + '. A line parallel to this segment has slope', opts,
          t(calc(g.A, g.B)) + '. Parallel lines have equal slopes, so the answer is ' + t(g.m) + '.', ['Find the slope of the segment. A parallel line has the same slope.'], 'MC parallel slope');
      } }] },
    /* ---------------- Q11 ---------------- */
    { num: '11', shared: function (r) {
        var right = r.chance(0.7);
        return gen(r, function (r) { var a = r.int(1, 4), b = r.int(1, 4), s = r.int(1, 2), u = r.int(1, 2); if (gcd(a, b) !== 1) return null; var Y = [r.int(-3, 3), r.int(0, 4)], X = add(Y, [-a * s, -b * s]), Z = add(Y, [b * u, -a * u]); if (!right) Z = [Z[0], Z[1] + r.pick([-1, 1])];
          if (!inBox(X, 9) || !inBox(Z, 9) || onLine(X, Y, Z)) return null; var s1 = slopeOf(X, Y), s2 = slopeOf(Y, Z); if (!s1 || !s2 || s2[0] === 0) return null; if (!right && relKind(s1, s2) === 'perp') return null; return { X: X, Y: Y, Z: Z, s1: s1, s2: s2, right: relKind(s1, s2) === 'perp' }; }, { X: [-2, -1], Y: [2, 3], Z: [6, -1], s1: [1, 1], s2: [-1, 1], right: true });
      },
      stem: function (s) { return 'Triangle ' + t('XYZ') + ' has vertices ' + nP('X', s.X) + ', ' + nP('Y', s.Y) + ' and ' + nP('Z', s.Z) + '. Use slopes to determine whether the triangle is right-angled at ' + t('Y') + '.'; },
      parts: [
        { id: '11', sub: 'i', level: 'EMG', make: function (r, s) { var st = { N: ['X', 'Y', 'Y', 'Z'], P: [s.X, s.Y, s.Y, s.Z], a: s.s1, b: s.s2 }; return pairFields('Find ' + t('m_{XY}') + ', ' + t('m_{YZ}') + ' and their product.', st, 'right angle at Y: slopes', { prod: true }); } },
        { id: '11v', sub: 'ii', level: 'BEG', make: function (r, s) {
          return B.mc(r, 'Is triangle ' + t('XYZ') + ' right-angled at ' + t('Y') + '?', [
            { html: '<b>Yes</b> — ' + t('m_{XY}\\times m_{YZ}=-1') + ', so ' + t('XY\\perp YZ') + '.', right: s.right, why: s.right ? null : 'Multiply the slopes again: the product is ' + t(frT(prod(s.s1, s.s2)[0], prod(s.s1, s.s2)[1])) + ', not ' + t('-1') + '.' },
            { html: '<b>No</b> — the product of the slopes is not ' + t('-1') + '.', right: !s.right, why: s.right ? 'Multiply the two slopes carefully: the product is exactly ' + t('-1') + '.' : null },
            { html: '<b>Yes</b> — one slope is positive and the other is negative.', why: 'Opposite signs aren’t enough: the product must be exactly ' + t('-1') + '.' },
            { html: '<b>No</b> — the slopes are not equal.', why: 'Equal slopes would mean parallel. A right angle needs slopes that multiply to ' + t('-1') + '.' }],
            t(prodT(s.s1, s.s2)) + (s.right ? ': ' + t('XY\\perp YZ') + ', so the triangle <b>is</b> right-angled at ' + t('Y') + '.' : ', not ' + t('-1') + ': <b>no</b> right angle at ' + t('Y') + '.'), ['The two sides that meet at ' + t('Y') + ' are ' + t('XY') + ' and ' + t('YZ') + '.'], 'right angle at Y?');
        } }] },
    /* ---------------- Q12 ---------------- */
    { num: '12', parts: [
      { id: '12', level: 'PRG', make: function (r) {
        var g = gen(r, function (r) { var a = r.pick([[-1, 2], [-1, 3], [-2, 3], [1, 2], [-3, 2], [2, 3], [-1, 4], [1, 3]]), ps = perpOf(a); var P = [r.int(-2, 3), r.int(1, 6)], Q = add(P, [a[1], a[0]], r.int(1, 2)); var U = [-r.int(1, 4), r.int(-3, 4)], run = ps[1] * r.int(2, 4), xV = U[0] + run, k = U[1] + ps[0] * run / ps[1]; if (Math.abs(k) > 30 || xV > 12) return null; return { P: P, Q: Q, U: U, xV: xV, k: k, a: a, ps: ps, run: run }; }, { P: [1, 5], Q: [5, 3], U: [-2, 3], xV: 6, k: 19, a: [-1, 2], ps: [2, 1], run: 8 });
        var rise = g.k - g.U[1], kPar = g.U[1] + sV(g.a) * g.run;
        return numAns('Segment ' + t('UV') + ' has endpoints ' + nP('U', g.U) + ' and ' + t('V(' + g.xV + ',\\ k)') + '. Segment ' + t('PQ') + ' has endpoints ' + nP('P', g.P) + ' and ' + nP('Q', g.Q) + '. If ' + t('UV') + ' is perpendicular to ' + t('PQ') + ', find the value of ' + t('k') + '.', g.k,
          [[kPar, 'k-par-perp', 'That makes ' + t('UV') + ' <b>parallel</b> to ' + t('PQ') + '. Use the negative reciprocal of ' + t('m_{PQ}') + '.'], [g.U[1] - rise, 'k-sign', 'Check the sign when you solve for ' + t('k') + '.'], [rise, 'k-no-start', 'That is the rise from ' + t('U') + ' to ' + t('V') + ' — add the height of ' + t('U') + ', ' + t(g.U[1]) + '.']],
          t(calc(g.P, g.Q, 'PQ')) + ', so ' + t('m_{UV}=' + sT(g.ps)) + '.<br>' + t('\\frac{k-' + nb(g.U[1]) + '}{' + g.xV + '-' + nb(g.U[0]) + '}=' + sT(g.ps) + '\\ \\Rightarrow\\ \\frac{k-' + nb(g.U[1]) + '}{' + g.run + '}=' + sT(g.ps) + '\\ \\Rightarrow\\ k-' + nb(g.U[1]) + '=' + rise + '\\ \\Rightarrow\\ k=' + g.k) + '.',
          ['Find ' + t('m_{PQ}') + ' and its negative reciprocal: that is the slope of ' + t('UV') + '.', 'Write ' + t('m_{UV}') + ' with ' + t('k') + ' in it, set it equal, and multiply both sides by the run.'], 'perpendicular: find k', t('k='));
      } }] },
    /* ---------------- Q13 ---------------- */
    { num: '13', shared: function (r) {
        var perp = r.chance(0.7);
        return gen(r, function (r) { var a = r.pick([[-1, 1], [-2, 1], [-1, 2], [-3, 2], [-2, 3], [-3, 4]]), b = perp ? perpOf(a) : r.pick([[a[1] + 1, Math.abs(a[0])], [a[1], Math.abs(a[0]) + 1], [Math.abs(a[0]), a[1]]]); b = red(b[0], b[1]); if (!perp && relKind(a, b) === 'perp') return null;
          var A1 = [r.int(0, 2), r.int(8, 12)], j = r.int(2, 8), A2 = add(A1, [a[1], a[0]], j); var B1 = [r.int(1, 3), r.int(0, 2)], c = r.int(2, 5), B2 = add(B1, [b[1], b[0]], c); if (A2[1] < 0 || A2[0] > 14 || B2[1] > 14 || B2[0] > 14 || !(Math.abs(a[0]) * j <= 12)) return null;
          return { P: [A1, A2, B1, B2], a: a, b: b, kind: relKind(a, b) }; }, fbPair([[0, 10], [8, 2], [2, 1], [6, 5]]));
      },
      stem: function (s) { return 'Two zip-lines are set up in a park. Zip-line ' + t('A') + ' runs from ' + t(ptT(s.P[0])) + ' to ' + t(ptT(s.P[1])) + '. Zip-line ' + t('B') + ' runs from ' + t(ptT(s.P[2])) + ' to ' + t(ptT(s.P[3])) + ', where each unit represents ' + t('1') + ' m. Are the two zip-lines perpendicular?'; },
      parts: [
        { id: '13', sub: 'i', level: 'EMG', make: function (r, s) { var st = { N: ['A', '', 'B', ''], P: s.P, a: s.a, b: s.b }; return pairFields('Find the slope of each zip-line and the product of the slopes.', st, 'zip-lines: slopes and product', { prod: true }); } },
        { id: '13v', sub: 'ii', level: 'BEG', make: function (r, s) { var pp = s.kind === 'perp', pr = prod(s.a, s.b);
          return B.mc(r, 'Are the two zip-lines perpendicular?', [
            { html: '<b>Yes</b> — the product of the slopes is ' + t('-1') + '.', right: pp, why: pp ? null : 'The product is ' + t(frT(pr[0], pr[1])) + ', not ' + t('-1') + '.' },
            { html: '<b>No</b> — the product of the slopes is not ' + t('-1') + '.', right: !pp, why: pp ? 'Multiply again: ' + t(prodT(s.a, s.b)) + '.' : null },
            { html: '<b>Yes</b> — one goes down and the other goes up.', why: 'Opposite directions aren’t enough: the product of the slopes must be exactly ' + t('-1') + '.' }],
            t(prodT(s.a, s.b)) + (pp ? ': the zip-lines <b>are</b> perpendicular.' : ': <b>not</b> perpendicular.'), [REL_HINT], 'zip-lines perpendicular?'); } }] },
    /* ---------------- Q14 ---------------- */
    { num: '14', shared: function (r) {
        var pat = patterns(r, ['par', 'perp', 'nei'], ['par', 'perp', 'nei']), N = [['A', 'B', 'C', 'D'], ['E', 'F', 'G', 'H'], ['I', 'J', 'K', 'L']], fb = [[[-6, 2], [-2, 5], [1, -3], [5, 0]], [[-4, -3], [0, 5], [2, 4], [6, 2]], [[-5, -1], [3, 3], [-2, 4], [2, 0]]];
        return pat.map(function (k, i) { var st = pairOf(r, k, 8) || fbPair(fb[i]); st.N = N[i]; st.id = 'abc'.charAt(i); st.label = '(' + st.id + ') ' + pairLabel(st.N, st.P); return st; });
      },
      stem: 'For each pair of segments, calculate both slopes and state whether the segments are parallel, perpendicular, or neither.',
      parts: [0, 1, 2].map(function (i) { return { id: '14' + 'abc'.charAt(i), level: 'BEG', make: function (r, s) { var st = s[i]; return pairFields('(' + st.id + ') ' + pairLabel(st.N, st.P) + ': find both slopes.', st, 'two slopes'); } }; }).concat([
        { id: '14v', sub: 'verdict', level: 'EMG', make: function (r, s) { return relGrid('Parallel, perpendicular, or neither?', s, 'all', null, 'three relationships'); } }]) },
    /* ---------------- Q15 ---------------- */
    { num: '15', parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var f = gen(r, function (r) { var p = r.int(2, 9), q = r.int(2, 9); return gcd(p, q) === 1 && p !== q ? [p, q] : null; }, [5, 9]);
        var right = r.chance(0.5) ? [[-r.int(2, 6), 1]] : [[-f[0], f[1]]]; right = [right[0], perpOf(right[0])];
        var g = gen(r, function (r) { var p = r.int(2, 7), q = r.int(2, 7); return gcd(p, q) === 1 && p !== q ? [p, q] : null; }, [3, 5]), h = gen(r, function (r) { var p = r.int(2, 9), q = r.int(2, 9); return gcd(p, q) === 1 && p !== q ? [p, q] : null; }, [2, 7]);
        var pairs = [{ v: right, right: true }, { v: [g, g], why: 'Equal slopes: those lines are <b>parallel</b>.' }, { v: [h, [h[1], h[0]]], why: 'Reciprocals with the <b>same sign</b>: the product is ' + t('+1') + ', not ' + t('-1') + '.' }, { v: [f, [f[1], f[0]]].map(function (x, i) { return i ? [x[0], x[1]] : x; }), why: 'Flipped but no sign change: the product is ' + t('+1') + '.' }];
        if (sEq(pairs[3].v[0], pairs[2].v[0])) pairs[3] = { v: [f, [-f[0], f[1]]], why: 'Opposite signs but not flipped: the product is ' + t(frT(-f[0] * f[0], f[1] * f[1])) + ', not ' + t('-1') + '.' };
        return B.mc(r, '<i>(Multiple choice)</i> Which pair of slopes represents <b>perpendicular</b> lines?', pairs.map(function (o) { return { html: t(sT(o.v[0]) + ',\\ ' + sT(o.v[1])), right: !!o.right, why: o.why }; }),
          t(prodT(right[0], right[1])) + ', so ' + t(sT(right[0]) + ',\\ ' + sT(right[1])) + ' is the perpendicular pair.', ['Multiply each pair: perpendicular slopes give ' + t('-1') + '.'], 'MC which pair is perpendicular');
      } }] }
  ];

  /* =============================== EXTRA PRACTICE =============================== */
  function nearPairs(r, book, N, fb) {
    var pat = r.chance(0.5) ? book : r.shuffle(book.slice());
    return pat.map(function (k, i) {
      var st = gen(r, function (r) { var s = pairOf(r, k === 'near' ? 'nei' : k, 8, [[1, 2], [3, 4], [2, 3], [3, 2], [4, 3], [2, 5], [5, 4], [3, 5]]); if (!s) return null;
        if (k === 'near') { var p = perpOf(s.a); var b2 = red(p[0] + (p[0] < 0 ? -1 : 1), p[1]); if (Math.abs(b2[0]) > 9) return null; var S2 = segWith(r, b2, 8, [s.P[0], s.P[1]]); if (!S2) return null; s.P = [s.P[0], s.P[1], S2[0], S2[1]]; s.b = b2; s.kind = relKind(s.a, b2); }
        if (k === 'opp') { var b3 = [-s.a[0], s.a[1]], S3 = segWith(r, b3, 8, [s.P[0], s.P[1]]); if (!S3) return null; s.P = [s.P[0], s.P[1], S3[0], S3[1]]; s.b = b3; s.kind = 'nei'; }
        return s; }, null) || fbPair(fb[i]);
      st.N = N[i]; st.id = 'abc'.charAt(i); st.label = '(' + st.id + ') ' + pairLabel(st.N, st.P); return st;
    });
  }
  function nearQ(num, sec, book, N, fb) {
    var q = { num: num, shared: function (r) { return nearPairs(r, book, N, fb); }, stem: 'For each pair, calculate both slopes as exact fractions in lowest terms, multiply them, and state the relationship.', parts: [0, 1, 2].map(function (i) {
      return { id: 'e' + num + 'abc'.charAt(i), level: 'EMG', make: function (r, s) { var st = s[i]; return pairFields('(' + st.id + ') ' + pairLabel(st.N, st.P) + ': both slopes and their product.', st, 'slopes and product', { prod: true, lowest: true }); } };
    }).concat([{ id: 'e' + num + 'v', sub: 'verdict', level: 'EMG', make: function (r, s) { return relGrid('State each relationship.', s, 'all', null, 'relationships (near misses)'); } }]) };
    if (sec) q.section = sec;
    return q;
  }
  function solveVar(id, level, o) {   // o(r) -> { prompt, val, list, sol, hints, text, v }
    return { id: id, level: level, make: function (r) { var g = o(r); return numAns(g.prompt, g.val, g.list, g.sol, g.hints, g.text, t(g.v + '=')); } };
  }
  function rectGen(r, square) {
    return gen(r, function (r) {
      var base = r.pick([[4, 3], [3, 4], [1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]), a = square ? 1 : r.int(1, 2), b = square ? 1 : r.int(1, 3);
      if (!square && a === b) return null; if (isSq(base[0] * base[0] + base[1] * base[1]) === false && r.chance(0.6)) return null;
      var u = [base[0] * a, base[1] * a], w = [-base[1] * b, base[0] * b]; if (r.chance(0.5)) u = [u[0], u[1]];
      var A = [r.int(-8, -3), r.int(-6, 0)], Bp = add(A, u), C = add(Bp, w), D = add(A, w);
      if (![A, Bp, C, D].every(function (P) { return inBox(P, 10); })) return null;
      if ([slopeOf(A, Bp), slopeOf(Bp, C)].some(function (s) { return !s || s[0] === 0; })) return null;
      return { V: [A, Bp, C, D], sq: !!square };
    }, null);
  }

  var EXTRA = [
    nearQ('1', 'Extra Practice A — Deciding from Two Pairs of Points', ['perp', 'par', 'near'], [['A', 'B', 'C', 'D'], ['E', 'F', 'G', 'H'], ['J', 'K', 'L', 'M']], [[[-7, -4], [5, 2], [-3, 6], [1, -2]], [[-6, 5], [2, -1], [-4, -6], [4, -12]], [[-5, -2], [3, 4], [-2, 7], [5, -1]]]),
    nearQ('2', null, ['par', 'opp', 'perp'], [['P', 'Q', 'R', 'S'], ['T', 'U', 'V', 'W'], ['X', 'Y', 'Z', 'N']], [[[-8, 3], [-2, -1], [1, -5], [7, -9]], [[-6, -5], [2, 1], [-1, 4], [7, -2]], [[-4, 6], [2, -4], [-5, -3], [5, 3]]]),
    /* ---------------- EP3 ---------------- */
    { num: '3', shared: function (r) {
        var x0 = r.int(-3, 4), y0 = r.int(-2, 4);
        var a = [[r.int(-7, -4), y0], [r.int(3, 6), y0], [x0, r.int(-6, -3)], [x0, r.int(5, 8)]];
        var bVert = r.chance(0.7), x1 = r.int(-5, -2), x2 = r.int(3, 7), b = bVert ? [[x1, r.int(-5, -2)], [x1, r.int(4, 7)], [x2, r.int(-4, -1)], [x2, r.int(5, 8)]] : [[r.int(-6, -3), x1], [r.int(2, 6), x1], [r.int(-5, -1), x2], [r.int(3, 7), x2]];
        var s3 = r.pick([[1, 2], [-1, 2], [1, 3], [2, 3], [-2, 3], [3, 4]]), y3 = r.int(-2, 4), L = [r.int(-5, -3), r.int(-6, -3)], c = [[r.int(-6, -4), y3], [r.int(2, 4), y3], L, add(L, [s3[1], s3[0]], 2)];
        var order = r.chance(0.5) ? [0, 1, 2] : r.shuffle([0, 1, 2]), sets = [a, b, c], N = [['A', 'B', 'C', 'D'], ['E', 'F', 'G', 'H'], ['J', 'K', 'L', 'M']];
        return order.map(function (k, i) { var P = sets[k], st = { P: P, a: slopeOf(P[0], P[1]), b: slopeOf(P[2], P[3]) }; st.kind = relKind(st.a, st.b); st.N = N[i]; st.id = 'abc'.charAt(i); st.label = '(' + st.id + ') ' + pairLabel(st.N, P); st.rule = st.a != null && st.b != null; return st; });
      },
      stem: 'These pairs include horizontal and vertical segments.',
      parts: [
        { id: 'e3a', level: 'EMG', make: function (r, s) { return relGrid('Decide the relationship for each pair.', s, 'all', s.map(function (st) { return '(' + st.id + ') ' + t('m_{' + st.N[0] + st.N[1] + '}=' + sT(st.a) + ',\\ m_{' + st.N[2] + st.N[3] + '}=' + sT(st.b)) + ': ' + relSol(st.a, st.b); }).join('<br>'), 'relationships with 0 / undefined'); } },
        { id: 'e3b', level: 'EMG', make: function (r, s) {
          var rows = s.map(function (st) { return { id: st.id, html: st.label }; }), want = {}; s.forEach(function (st) { want[st.id] = st.rule ? 'y' : 'n'; });
          return B.grid('For each pair, could the rule ' + t('m_1\\times m_2=-1') + ' be used (both slopes are numbers you can multiply)?', rows, [{ id: 'y', html: 'Yes, it can be used' }, { id: 'n', html: 'No, it can’t' }], want, { why: function (row) { var st = s['abc'.indexOf(row)]; return st.rule ? 'In (' + row + ') both slopes are numbers (' + t(sT(st.a)) + ' and ' + t(sT(st.b)) + '), so the product can be calculated — it just isn’t ' + t('-1') + '.' : 'In (' + row + ') a slope is undefined — that isn’t a number, so there is nothing to multiply.'; } },
            s.map(function (st) { return '(' + st.id + ') ' + (st.rule ? 'Both slopes are numbers: ' + t(prodT(st.a, st.b)) + ' — a legal calculation (and ' + t('\\ne -1') + ').' : 'An undefined slope is not a number, so the product rule can’t be used; decide from the picture (vertical/horizontal).'); }).join('<br>'), ['The rule needs two slopes that are numbers. Is either slope undefined?'], 'can the product rule be used');
        } }] },
    /* ---------------- EP4 ---------------- */
    { num: '4', section: 'Extra Practice B — Negative Reciprocals, Including the Two Special Cases', stem: 'For each slope ' + t('m') + ', state the slope of a line <b>perpendicular</b> to it and the slope of a line <b>parallel</b> to it.', parts: (function () {
      function mk(id, level, g) {
        return { id: id, level: level, make: function (r) {
          var m = g(r), pp = perpOf(m), sub = id.slice(2);
          var mT = m == null ? t('m') + ' is undefined' : t('m=' + sT(m));
          var sol = m == null ? 'An undefined slope is a <b>vertical</b> line. Perpendicular to it: a horizontal line, slope ' + t('0') + '. Parallel to it: another vertical line, slope undefined.' : m[0] === 0 ? 'Slope ' + t('0') + ' is a <b>horizontal</b> line. “Flip it” would give ' + t('\\frac{1}{0}') + ', which is not a number — instead, the perpendicular line is vertical: slope <b>undefined</b>. Parallel: slope ' + t('0') + '.' :
            'Perpendicular: flip ' + t(sT(m)) + ' and change the sign: ' + t(sT(pp)) + ' (check: ' + t(prodT(m, pp)) + '). Parallel: ' + t(sT(m)) + '.';
          var p = B.fields('(' + sub + ') ' + mT, [{ label: 'Perpendicular: ' + t('m_{\\perp}='), mode: 'math', keys: 'slope', placeholder: 'e.g. -3/2 or undefined' }, { label: 'Parallel: ' + t('m_{\\parallel}='), mode: 'math', keys: 'slope', placeholder: 'e.g. 2/3' }],
            [relChk(m, 'perp'), relChk(m, 'par')], [sT(pp), sT(m)], t('m_{\\perp}=' + sT(pp) + ',\\quad m_{\\parallel}=' + sT(m)), sol,
            m == null || m[0] === 0 ? ['Picture the line: is it horizontal or vertical? What is perpendicular to it?'] : ['Flip the fraction and change the sign. A whole number is the number over 1.'], 'perpendicular and parallel slopes');
          p.bad = [[sT(m), sT(m)]];
          return p;
        } };
      }
      function fr(r, sg, big) { return gen(r, function (r) { var q = r.int(2, 9), p = big ? r.int(q + 1, 12) : r.int(1, q - 1); return gcd(p, q) === 1 ? [sg * p, q] : null; }, big ? [sg * 7, 5] : [sg * 2, 3]); }
      return [mk('e4a', 'BEG', function (r) { return fr(r, 1); }), mk('e4b', 'BEG', function (r) { return [r.int(2, 20) * (r.chance(0.8) ? -1 : 1), 1]; }), mk('e4c', 'BEG', function (r) { return r.chance(0.3) ? [1, 1] : [r.int(1, 20), 1]; }),
        mk('e4d', 'EMG', function (r) { return [r.chance(0.75) ? -1 : 1, r.int(2, 15)]; }), mk('e4e', 'BEG', function (r) { return fr(r, 1, true); }), mk('e4f', 'EMG', function (r) { return fr(r, -1, true); }),
        mk('e4g', 'PRG', function () { return [0, 1]; }), mk('e4h', 'PRG', function () { return null; })];
    })() },
    /* ---------------- EP5 ---------------- */
    { num: '5', stem: 'Look again at parts (g) and (h) of question 4.', parts: [
      { id: 'e5a', level: 'EMG', make: function (r) {
        return B.mc(r, '(a) Why must a horizontal line and a vertical line be perpendicular, even though you can’t multiply their slopes to get ' + t('-1') + '?', [
          { html: 'A horizontal line runs flat and a vertical line runs straight up and down, so they cross at exactly ' + t('90^{\\circ}') + ' — the algebra breaks (' + t('\\frac{1}{0}') + ' isn’t a number) but the geometry doesn’t.', right: true },
          { html: 'Because ' + t('0\\times\\text{undefined}=-1') + '.', why: 'An undefined slope isn’t a number, so the product doesn’t exist. The reason is the picture: flat meets upright.' },
          { html: 'They aren’t perpendicular — the product rule fails.', why: 'Picture them: a flat line and an upright line make a square corner. The rule simply doesn’t apply to an undefined slope.' },
          { html: 'Because both of them have no slope.', why: 'A horizontal line has slope ' + t('0') + ' (a number); only the vertical line’s slope is undefined.' }],
          'Flat meets upright at ' + t('90^{\\circ}') + '. “Flip it” turns ' + t('\\frac{0}{1}') + ' into ' + t('\\frac{1}{0}') + ', a division by zero, so the product rule can’t be used — but the right angle is still there.', ['Draw the two lines.'], 'why horizontal ⊥ vertical');
      } },
      { id: 'e5b', level: 'EMG', make: function (r) {
        return B.mc(r, '(b) A student says “a slope of ' + t('0') + ' and an undefined slope are the same thing — both mean there is no slope.” What is wrong with this?', [
          { html: 'They are opposites: slope ' + t('0') + ' is a real number and describes a flat horizontal line (' + t('y=c') + '); an undefined slope is not a number and describes a vertical line (' + t('x=c') + ').', right: true },
          { html: 'Nothing — both lines are flat.', why: 'Only the slope-' + t('0') + ' line is flat. An undefined slope belongs to an upright (vertical) line.' },
          { html: 'Slope ' + t('0') + ' is vertical and an undefined slope is horizontal.', why: 'The other way round: rise ' + t('0') + ' (flat) gives slope ' + t('0') + '; run ' + t('0') + ' (upright) gives an undefined slope.' },
          { html: 'They differ only in sign.', why: 'Undefined isn’t a number at all, so it has no sign.' }],
          'They are opposites, not the same. Slope ' + t('0') + ' is a genuine number (rise ' + t('0') + '): a flat horizontal line, ' + t('y=c') + '. An undefined slope is not a number (run ' + t('0') + '): a vertical line, ' + t('x=c') + '.', ['Which line has rise ' + t('0') + '? Which has run ' + t('0') + '?'], '0 vs undefined');
      } }] },
    /* ---------------- EP6 ---------------- */
    { num: '6', stem: 'The two slopes given describe <b>parallel</b> lines. Solve for the variable.', parts: [
      solveVar('e6a', 'EMG', function (r) { var f = gen(r, function (r) { var q = r.int(3, 9), p = r.int(1, q - 1), c = r.int(2, 4); if (gcd(p, q) !== 1) return null; return [p, q, c]; }, [5, 6, 3]), p = f[0], q = f[1], d = q * f[2], k = p * f[2];
        return { prompt: '(a) ' + t('\\frac{' + p + '}{' + q + '}') + ' and ' + t('\\frac{k}{' + d + '}'), val: k, v: 'k', list: [[-q * d / p, 'k-perp-par', 'Parallel: set the slopes <b>equal</b>.'], [d * q / p, 'k-flip', 'Keep the fractions the right way up.']], sol: t('\\frac{k}{' + d + '}=\\frac{' + p + '}{' + q + '}\\ \\Rightarrow\\ k=\\frac{' + p + '}{' + q + '}\\times ' + d + '=' + k), hints: ['Set the slopes equal. ' + t(q) + ' times what is ' + t(d) + '?'], text: 'parallel: k/d = p/q' }; }),
      solveVar('e6b', 'PRG', function (r) { var f = gen(r, function (r) { var q = r.int(2, 6), p = r.int(q + 1, 9), c = r.int(2, 4); if (gcd(p, q) !== 1) return null; return [p, q, c]; }, [7, 4, 3]), p = f[0], q = f[1], n = p * f[2], w = q * f[2];
        return { prompt: '(b) ' + t('-\\frac{' + p + '}{' + q + '}') + ' and ' + t('-\\frac{' + n + '}{w}'), val: w, v: 'w', list: [[-w, 'k-sign', 'Both slopes have a minus sign in front, so they match: ' + t('w') + ' is positive.'], [n * p / q, 'k-flip', 'The unknown is on the bottom: cross-multiply, ' + t(p + 'w=' + n + '\\times ' + q) + '.']], sol: t('-\\frac{' + n + '}{w}=-\\frac{' + p + '}{' + q + '}\\ \\Rightarrow\\ ' + p + 'w=' + n + '\\times ' + q + '\\ \\Rightarrow\\ w=' + w), hints: ['Set the slopes equal and cross-multiply.', t('w') + ' is in the denominator: ' + t(p) + ' times what is ' + t(n) + '?'], text: 'parallel: unknown in the denominator' }; }),
      solveVar('e6c', 'EMG', function (r) { var a = r.int(2, 6), d = r.int(2, 6), n = -a * d;
        return { prompt: '(c) ' + t('-' + a) + ' and ' + t('\\frac{n}{' + d + '}'), val: n, v: 'n', list: [[-n, 'k-sign', 'The slope is negative, so ' + t('n') + ' is negative.'], [d / a, 'k-perp-par', 'Parallel: set the slopes <b>equal</b>.']], sol: t('\\frac{n}{' + d + '}=-' + a + '\\ \\Rightarrow\\ n=' + n), hints: ['Set the slopes equal and multiply both sides by ' + t(d) + '.'], text: 'parallel: n/d = -a' }; }),
      solveVar('e6d', 'PRG', function (r) { var f = gen(r, function (r) { var q = r.int(3, 9), p = r.int(1, q - 1), c = r.int(2, 5); if (gcd(p, q) !== 1) return null; return [p, q, c]; }, [2, 5, 4]), p = f[0], q = f[1], n = p * f[2], k = q * f[2];
        return { prompt: '(d) ' + t('\\frac{' + n + '}{k}') + ' and ' + t('\\frac{' + p + '}{' + q + '}'), val: k, v: 'k', list: [[n * p / q, 'k-flip', 'The unknown is on the bottom: cross-multiply, ' + t(p + 'k=' + n + '\\times ' + q) + '.'], [-k, 'k-sign', 'Both slopes are positive.']], sol: t('\\frac{' + n + '}{k}=\\frac{' + p + '}{' + q + '}\\ \\Rightarrow\\ ' + p + 'k=' + n * q + '\\ \\Rightarrow\\ k=' + k), hints: ['Cross-multiply: ' + t(n + '\\times ' + q + '=' + p + '\\times k') + '.'], text: 'parallel: n/k = p/q' }; })] },
    /* ---------------- EP7 ---------------- */
    { num: '7', stem: 'The two slopes given describe <b>perpendicular</b> lines. Solve for the variable.', parts: [
      solveVar('e7a', 'PRG', function (r) { var f = gen(r, function (r) { var p = r.int(1, 5), q = r.int(p + 1, 9), c = r.int(2, 3); if (gcd(p, q) !== 1) return null; return [p, q, c]; }, [3, 8, 2]), p = f[0], q = f[1], n = q * f[2], k = p * f[2];
        return { prompt: '(a) ' + t('\\frac{' + p + '}{' + q + '}') + ' and ' + t('-\\frac{' + n + '}{k}'), val: k, v: 'k', list: [[-k, 'k-sign', 'The negative reciprocal of ' + t('\\frac{' + p + '}{' + q + '}') + ' is ' + t('-\\frac{' + q + '}{' + p + '}') + ': the minus sign is already in front, so ' + t('k') + ' is positive.'], [n * q / p, 'k-par-perp', 'That makes the slopes equal in size. For perpendicular, ' + t('-\\frac{' + n + '}{k}') + ' must equal ' + t('-\\frac{' + q + '}{' + p + '}') + '.']], sol: 'Negative reciprocal of ' + t('\\frac{' + p + '}{' + q + '}') + ': ' + t('-\\frac{' + q + '}{' + p + '}') + '.<br>' + t('-\\frac{' + n + '}{k}=-\\frac{' + q + '}{' + p + '}\\ \\Rightarrow\\ ' + q + 'k=' + n * p + '\\ \\Rightarrow\\ k=' + k), hints: ['Flip ' + t('\\frac{' + p + '}{' + q + '}') + ' and change the sign, then set the second slope equal to it.'], text: 'perpendicular: -n/k' }; }),
      solveVar('e7b', 'PRG', function (r) { var f = gen(r, function (r) { var p = r.int(1, 5), q = r.int(2, 9), c = r.int(1, 2); if (gcd(p, q) !== 1 || p === q) return null; return [p, q, c]; }, [2, 5, 1]), p = f[0], q = f[1], d = p * f[2], tt = q * f[2];
        return { prompt: '(b) ' + t('-\\frac{' + p + '}{' + q + '}') + ' and ' + t('\\frac{t}{' + d + '}'), val: tt, v: 't', list: [[-tt, 'k-sign', 'The negative reciprocal of a negative slope is <b>positive</b>.'], [-p * d / q, 'k-par-perp', 'That makes the slopes equal (parallel). Use the negative reciprocal, ' + t('\\frac{' + q + '}{' + p + '}') + '.']], sol: 'Negative reciprocal: ' + t('\\frac{' + q + '}{' + p + '}') + '. ' + t('\\frac{t}{' + d + '}=\\frac{' + q + '}{' + p + '}\\ \\Rightarrow\\ t=' + tt), hints: ['Flip and change the sign, then set ' + t('\\frac{t}{' + d + '}') + ' equal to it.'], text: 'perpendicular: t/d' }; }),
      solveVar('e7c', 'EMG', function (r) { var a = r.int(2, 9), j = r.int(1, 3), d = a * j;
        return { prompt: '(c) ' + t(a) + ' and ' + t('\\frac{w}{' + d + '}'), val: -j, v: 'w', list: [[j, 'k-sign', 'The negative reciprocal of ' + t(a) + ' is ' + t('-\\frac{1}{' + a + '}') + ' — negative.'], [a * d, 'k-par-perp', 'That makes the slopes equal (parallel).']], sol: t('\\frac{w}{' + d + '}=-\\frac{1}{' + a + '}\\ \\Rightarrow\\ w=-\\frac{' + d + '}{' + a + '}=' + (-j)), hints: ['The negative reciprocal of ' + t(a) + ' is ' + t('-\\frac{1}{' + a + '}') + '.'], text: 'perpendicular: w/d' }; }),
      solveVar('e7d', 'PRG', function (r) { var f = gen(r, function (r) { var p = r.int(2, 7), q = r.int(2, 9), c = r.int(2, 5); if (gcd(p, q) !== 1 || p === q) return null; return [p, q, c]; }, [5, 9, 5]), p = f[0], q = f[1], n = q * f[2], nn = p * f[2];
        return { prompt: '(d) ' + t('-\\frac{' + p + '}{' + q + '}') + ' and ' + t('\\frac{' + n + '}{n}'), val: nn, v: 'n', list: [[-nn, 'k-sign', 'The negative reciprocal of a negative slope is positive.'], [-n * q / p, 'k-par-perp', 'That makes the slopes equal (parallel).']], sol: 'Negative reciprocal: ' + t('\\frac{' + q + '}{' + p + '}') + '. ' + t('\\frac{' + n + '}{n}=\\frac{' + q + '}{' + p + '}\\ \\Rightarrow\\ ' + q + 'n=' + n * p + '\\ \\Rightarrow\\ n=' + nn), hints: ['Flip and change the sign. Then cross-multiply: ' + t('n') + ' is on the bottom.'], text: 'perpendicular: n in the denominator' }; })] },
    /* ---------------- EP8 ---------------- */
    { num: '8', shared: function (r) { return gen(r, function (r) { var a = r.int(1, 25), b = r.int(1, 25); if (a === b) return null; var k = Math.round(Math.sqrt(a * b)); if (k * k !== a * b || k > 15) return null; return { a: a, b: b, k: k }; }, { a: 4, b: 9, k: 6 }); },
      stem: function (s) { return '<b>Stretch.</b> Line ' + t('\\ell_1') + ' has slope ' + t('\\dfrac{k}{' + s.a + '}') + ' and line ' + t('\\ell_2') + ' has slope ' + t('\\dfrac{' + s.b + '}{k}') + ', where ' + t('k\\ne 0') + '.'; },
      parts: [
        { id: 'e8a', level: 'MAS', make: function (r, s) {
          var p = B.valueSet('(a) Find every value of ' + t('k') + ' for which ' + t('\\ell_1\\parallel\\ell_2') + '. There is more than one answer.', [s.k, -s.k], { v: 'k' },
            'Parallel: ' + t('\\frac{k}{' + s.a + '}=\\frac{' + s.b + '}{k}\\ \\Rightarrow\\ k^{2}=' + s.a * s.b + '\\ \\Rightarrow\\ k=' + s.k + '\\ \\text{or}\\ k=-' + s.k) + '.<br>Check ' + t('k=' + s.k) + ': both slopes are ' + t(sT(red(s.k, s.a))) + '. Check ' + t('k=-' + s.k) + ': both are ' + t(sT(red(-s.k, s.a))) + ' ✓',
            ['Set the slopes equal and cross-multiply.', t('k^{2}') + ' has two square roots.'], 'parallel: k squared');
          p.bad = ['k=' + s.k, 'k=' + (-s.k)]; p.good = ['k=-' + s.k + ', k=' + s.k, '\\pm ' + s.k]; return p;
        } },
        { id: 'e8b', level: 'PRG', make: function (r, s) {
          var pr = red(s.b, s.a);
          return B.mc(r, '(b) Why does no value of ' + t('k') + ' make ' + t('\\ell_1\\perp\\ell_2') + '?', [
            { html: t('\\frac{k}{' + s.a + '}\\times\\frac{' + s.b + '}{k}=' + sT(pr)) + ' for every ' + t('k\\ne 0') + ' — the ' + t('k') + '’s cancel — and ' + t(sT(pr)) + ' is never ' + t('-1') + '.', right: true },
            { html: 'Because ' + t('k') + ' would have to be ' + t('0') + '.', why: 'Simplify the product first: ' + t('k') + ' cancels completely, leaving ' + t(sT(pr)) + '.' },
            { html: 'Because ' + t('k^{2}=-' + s.a * s.b) + ' has the solutions ' + t('\\pm' + s.k) + '.', why: 'No real number squared is negative, but look even earlier: the product simplifies to ' + t(sT(pr)) + ', which is positive.' },
            { html: 'Because perpendicular lines can’t have fractions as slopes.', why: 'They can (e.g. ' + t('\\frac{2}{3}') + ' and ' + t('-\\frac{3}{2}') + '). The product here is always ' + t(sT(pr)) + '.' }],
            t('m_1\\times m_2=\\frac{k}{' + s.a + '}\\times\\frac{' + s.b + '}{k}=\\frac{' + s.b + 'k}{' + s.a + 'k}=' + sT(pr)) + ' for every ' + t('k\\ne 0') + '. It is always positive, never ' + t('-1') + ', so no value of ' + t('k') + ' works.', ['Simplify the product of the two slopes before you solve anything.'], 'no k is perpendicular');
        } }] },
    /* ---------------- EP9 ---------------- */
    { num: '9', section: 'Extra Practice C — Finding a Missing Coordinate', shared: function (r) {
        return gen(r, function (r) { var p = r.int(1, 4), q = r.int(2, 5); if (gcd(p, q) !== 1 || p === q) return null; var sg = r.chance(0.75) ? -1 : 1, s = [sg * p, q], ps = perpOf(s);
          var C = [r.int(-3, 0), r.int(1, 5)], D = add(C, [q, sg * p], 2); var run = p * q * (p * q < 6 ? 2 : 1), A = [r.int(-4, -1), r.int(-3, 1)];
          var kPar = A[1] + sV(s) * run, kPerp = A[1] + sV(ps) * run; if (!Number.isInteger(kPar) || !Number.isInteger(kPerp) || Math.abs(kPar) > 25 || Math.abs(kPerp) > 25 || !inBox(D, 12)) return null;
          return { A: A, xB: A[0] + run, C: C, D: D, s: s, ps: ps, run: run, kPar: kPar, kPerp: kPerp }; }, { A: [-3, -2], xB: 9, C: [-1, 4], D: [7, -2], s: [-3, 4], ps: [4, 3], run: 12, kPar: -11, kPerp: 14 });
      },
      stem: function (s) { return 'Segment ' + t('AB') + ' joins ' + nP('A', s.A) + ' and ' + t('B(' + s.xB + ',\\ k)') + '. Segment ' + t('CD') + ' joins ' + nP('C', s.C) + ' and ' + nP('D', s.D) + '.'; },
      parts: [
        { id: 'e9a', level: 'PRG', make: function (r, s) { var rise = s.kPar - s.A[1];
          return numAns('(a) Find ' + t('k') + ' so that ' + t('AB\\parallel CD') + '.', s.kPar, [[s.kPerp, 'k-perp-par', 'That makes ' + t('AB') + ' <b>perpendicular</b> to ' + t('CD') + '. Parallel needs the <b>same</b> slope.'], [rise, 'k-no-start', 'That is the rise — add the height of ' + t('A') + ', ' + t(s.A[1]) + '.'], [s.A[1] - rise, 'k-sign', 'Check the sign as you solve.']],
            t(calc(s.C, s.D, 'CD')) + '.<br>' + t('\\frac{k-' + nb(s.A[1]) + '}{' + s.xB + '-' + nb(s.A[0]) + '}=' + sT(s.s) + '\\ \\Rightarrow\\ \\frac{k-' + nb(s.A[1]) + '}{' + s.run + '}=' + sT(s.s) + '\\ \\Rightarrow\\ k-' + nb(s.A[1]) + '=' + rise + '\\ \\Rightarrow\\ k=' + s.kPar) + '.', ['Find ' + t('m_{CD}') + ' first (the complete segment). Then set ' + t('m_{AB}') + ' equal to it.'], 'parallel: find k', t('k=')); } },
        { id: 'e9b', level: 'PRG', make: function (r, s) { var rise = s.kPerp - s.A[1];
          return numAns('(b) Find ' + t('k') + ' so that ' + t('AB\\perp CD') + '.', s.kPerp, [[s.kPar, 'k-par-perp', 'That makes ' + t('AB') + ' <b>parallel</b> to ' + t('CD') + '. Use the negative reciprocal of ' + t('m_{CD}') + '.'], [rise, 'k-no-start', 'That is the rise — add the height of ' + t('A') + ', ' + t(s.A[1]) + '.'], [s.A[1] - rise, 'k-sign', 'Check the sign: the perpendicular slope is ' + t(sT(s.ps)) + '.']],
            t('m_{CD}=' + sT(s.s)) + ', so ' + t('m_{AB}=' + sT(s.ps)) + '.<br>' + t('\\frac{k-' + nb(s.A[1]) + '}{' + s.run + '}=' + sT(s.ps) + '\\ \\Rightarrow\\ k-' + nb(s.A[1]) + '=' + rise + '\\ \\Rightarrow\\ k=' + s.kPerp) + '.', ['Take the negative reciprocal of ' + t('m_{CD}') + ', then solve as in (a).'], 'perpendicular: find k', t('k=')); } },
        { id: 'e9c', level: 'EMG', make: function (r, s) { var r1 = s.kPar - s.A[1], r2 = s.kPerp - s.A[1];
          return B.mc(r, '(c) The run of ' + t('AB') + ' was ' + t(s.run) + ' in both parts. Why are the two values of ' + t('k') + ' (' + t(s.kPar) + ' and ' + t(s.kPerp) + ') so far apart?', [
            { html: 'Over the same run, the parallel segment ' + (r1 < 0 ? 'falls ' + t(-r1) : 'rises ' + t(r1)) + ' while the perpendicular one ' + (r2 < 0 ? 'falls ' + t(-r2) : 'rises ' + t(r2)) + ': opposite directions and different steepness.', right: true },
            { html: 'Because one of the answers must be wrong — the same run should give the same ' + t('k') + '.', why: 'Different slopes over the same run give different rises. Both answers check out.' },
            { html: 'Because the perpendicular slope is the same size as the parallel one, just negative.', why: 'The perpendicular slope is the negative <b>reciprocal</b> (' + t(sT(s.ps)) + '), not just the negative.' }],
            'Over the run ' + t(s.run) + ': parallel slope ' + t(sT(s.s)) + ' gives a rise of ' + t(r1) + '; perpendicular slope ' + t(sT(s.ps)) + ' gives a rise of ' + t(r2) + '. One goes down, the other up, with different steepness — a gap of ' + t(Math.abs(s.kPerp - s.kPar)) + ' in ' + t('k') + '.', ['Compare the rises the two slopes give over the same run.'], 'why the two k values differ');
        } }] },
    /* ---------------- EP10 ---------------- */
    { num: '10', shared: function (r) {
        return gen(r, function (r) { var n = r.int(2, 4), sg = r.chance(0.75) ? -1 : 1, m = sg * n, R = [r.int(-7, -4), r.int(0, 5)], S = add(R, [1, m], r.int(2, 4)); var P = [r.int(-5, -2), r.int(2, 6)], d = -n * r.int(2, 4) * (r.chance(0.8) ? 1 : -1), runPar = d / m, runPerp = -m * d;
          if (!inBox(S, 12) || Math.abs(P[0] + runPerp) > 30) return null; return { R: R, S: S, P: P, yQ: P[1] + d, m: m, kPar: P[0] + runPar, kPerp: P[0] + runPerp, d: d }; }, { R: [-6, 3], S: [-2, -5], P: [-4, 5], yQ: -3, m: -2, kPar: 0, kPerp: -20, d: -8 });
      },
      stem: function (s) { return 'Now the unknown is an ' + t('x') + '-coordinate. Segment ' + t('PQ') + ' joins ' + nP('P', s.P) + ' and ' + t('Q(k,\\ ' + s.yQ + ')') + '. Segment ' + t('RS') + ' joins ' + nP('R', s.R) + ' and ' + nP('S', s.S) + '.'; },
      parts: [
        { id: 'e10a', level: 'PRG', make: function (r, s) { var run = s.kPar - s.P[0];
          return numAns('(a) Find ' + t('k') + ' so that ' + t('PQ\\parallel RS') + '.', s.kPar, [[s.kPerp, 'k-perp-par', 'That makes the segments perpendicular. Parallel: the <b>same</b> slope.'], [run, 'k-no-start', 'That is the run — the run is ' + t('k-' + nb(s.P[0])) + ', so add ' + t(s.P[0]) + '.'], [s.P[0] - run, 'k-sign', 'Check the sign as you solve.'], [s.P[0] + s.d * s.m, 'k-flip', 'The run is rise ÷ slope.']],
            t(calc(s.R, s.S, 'RS')) + '.<br>' + t('\\frac{' + s.yQ + '-' + nb(s.P[1]) + '}{k-' + nb(s.P[0]) + '}=' + s.m + '\\ \\Rightarrow\\ \\frac{' + s.d + '}{k-' + nb(s.P[0]) + '}=' + s.m + '\\ \\Rightarrow\\ k-' + nb(s.P[0]) + '=' + run + '\\ \\Rightarrow\\ k=' + s.kPar) + '.', ['Find ' + t('m_{RS}') + '. The unknown is in the run of ' + t('PQ') + ': cross-multiply.'], 'parallel: unknown x', t('k=')); } },
        { id: 'e10b', level: 'PRG', make: function (r, s) { var run = s.kPerp - s.P[0], ps = perpOf([s.m, 1]);
          return numAns('(b) Find ' + t('k') + ' so that ' + t('PQ\\perp RS') + '.', s.kPerp, [[s.kPar, 'k-par-perp', 'That makes the segments parallel. Use the negative reciprocal of ' + t('m_{RS}') + '.'], [run, 'k-no-start', 'That is the run — add ' + t(s.P[0]) + '.'], [s.P[0] - run, 'k-sign', 'Check the sign: the perpendicular slope is ' + t(sT(ps)) + '.']],
            t('m_{RS}=' + s.m) + ', so ' + t('m_{PQ}=' + sT(ps)) + '.<br>' + t('\\frac{' + s.d + '}{k-' + nb(s.P[0]) + '}=' + sT(ps) + '\\ \\Rightarrow\\ k-' + nb(s.P[0]) + '=' + run + '\\ \\Rightarrow\\ k=' + s.kPerp) + '.', ['Use the negative reciprocal of ' + t('m_{RS}') + ', then cross-multiply.'], 'perpendicular: unknown x', t('k=')); } }] },
    /* ---------------- EP11 ---------------- */
    { num: '11', section: 'Extra Practice D — Proving a Figure Is What It Claims to Be', shared: function (r) {
        var g = rectGen(r, r.chance(0.2)); return g || { V: [[-5, -3], [3, 3], [0, 7], [-8, 1]], sq: false };
      },
      stem: function (s) { return 'Quadrilateral ' + t('ABCD') + ' has vertices ' + ['A', 'B', 'C', 'D'].map(function (n, i) { return nP(n, s.V[i]); }).join(', ') + ', joined in that order.'; },
      parts: [
        { id: 'e11a', level: 'EMG', make: function (r, s) { var V = s.V, nm = ['AB', 'BC', 'CD', 'DA']; return slopeFields('(a) Find the slope of each of the four sides.', nm.map(function (x, i) { return { nm: x, A: V[i], B: V[(i + 1) % 4] }; }), null, [SLOPE_HINT], 'rectangle: four slopes'); } },
        { id: 'e11b', sub: 'b, c', level: 'EMG', make: function (r, s) {
          var V = s.V, sl = [0, 1, 2, 3].map(function (i) { return slopeOf(V[i], V[(i + 1) % 4]); }), nm = ['AB', 'BC', 'CD', 'DA'];
          var sets = [[0, 2], [1, 3], [0, 1], [2, 3]].map(function (x, i) { return { id: 'pqrs'.charAt(i), label: t(nm[x[0]]) + ' and ' + t(nm[x[1]]), a: sl[x[0]], b: sl[x[1]] }; });
          var g = relGrid('Use your slopes: for each pair of sides, are they parallel, perpendicular, or neither?', sets, 'all', sets.map(function (st) { return st.label + ': ' + relSol(st.a, st.b); }).join('<br>'), 'rectangle: sides parallel / perpendicular');
          return g;
        } },
        { id: 'e11d', sub: 'd', level: 'EMG', make: function (r, s) {
          var V = s.V, nm = ['AB', 'BC', 'CD', 'DA'], L = [0, 1, 2, 3].map(function (i) { return d2(V[i], V[(i + 1) % 4]); });
          var p = B.fields('(d) Find the length of each side (exact, or to the nearest tenth).', nm.map(function (x) { return { label: t(x + '='), mode: 'math', keys: 'radical', placeholder: 'e.g. 5 or 2√5' }; }), L.map(function (n) { return lenChk(n); }), nm.map(function (x, i) { return lenT(V[i], V[(i + 1) % 4]); }),
            t(nm.map(function (x, i) { return x + '=' + lenT(V[i], V[(i + 1) % 4]); }).join(',\\ ')), nm.map(function (x, i) { var a = V[i], b = V[(i + 1) % 4]; return t(x + '=\\sqrt{' + nb(b[0] - a[0]) + '^{2}+' + nb(b[1] - a[1]) + '^{2}}=\\sqrt{' + L[i] + '}' + (lenT(a, b) === '\\sqrt{' + L[i] + '}' ? '' : '=' + lenT(a, b))); }).join('<br>'),
            ['Distance formula for each side: ' + t('d=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}') + '.'], 'rectangle: side lengths');
          p.bad = [L.map(String)]; return p;
        } },
        { id: 'e11e', sub: 'e i', level: 'BEG', make: function (r, s) {
          var V = s.V, a = lenT(V[0], V[1]), b = lenT(V[1], V[2]);
          return B.mc(r, 'With ' + t('AB=' + a) + ' and ' + t('BC=' + b) + ' (and the slopes from (b) and (c)), what is the most precise name for ' + t('ABCD') + '?', [
            { html: '<b>Rectangle</b> (not a square)', right: !s.sq, why: s.sq ? 'All four sides are equal <b>and</b> there are right angles.' : null }, { html: '<b>Square</b>', right: s.sq, why: s.sq ? null : 'A square needs all four sides equal: ' + t('AB=' + a) + ' but ' + t('BC=' + b) + '.' },
            { html: '<b>Parallelogram</b> (not a rectangle)', why: 'The adjacent sides are perpendicular, so it has right angles — more precise than “parallelogram”.' }, { html: '<b>Rhombus</b>', why: s.sq ? 'It has right angles too, so “square” is more precise.' : 'A rhombus needs four equal sides.' }],
            'Both pairs of opposite sides are parallel and the adjacent sides are perpendicular: a rectangle. ' + (s.sq ? 'All four sides are equal (' + t(a) + '), so it is a <b>square</b>.' : 'Adjacent sides are unequal (' + t(a + '\\ne ' + b) + '), so it is a <b>rectangle</b>, not a square.'), ['Right angles? Equal sides?'], 'name the quadrilateral', true);
        } },
        { id: 'e11f', sub: 'e ii', level: 'EMG', make: function (r, s) {
          var V = s.V, a2 = d2(V[0], V[1]), b2 = d2(V[1], V[2]), exact = isSq(a2) && isSq(b2), P = 2 * Math.sqrt(a2) + 2 * Math.sqrt(b2), a = lenT(V[0], V[1]), b = lenT(V[1], V[2]);
          var half = Math.sqrt(a2) + Math.sqrt(b2);
          var p = exact ? numAns('Find the perimeter of ' + t('ABCD') + '.', P, [[half, 'u6l9-perim-half', 'That is only two sides. A rectangle has two of each: ' + t('2(' + a + ')+2(' + b + ')') + '.']], t('P=2(' + a + ')+2(' + b + ')=' + P), ['Opposite sides of a rectangle are equal: add all four.'], 'perimeter', null)
            : B.approx('Find the perimeter of ' + t('ABCD') + ', to the nearest tenth.', P, 1, { diag: function (v) { if (Math.abs(v - half) < 0.06) return { code: 'u6l9-perim-half', hint: 'That is only two sides — add all four.' }; return null; } }, t('P=2(' + a + ')+2(' + b + ')\\approx ' + K.roundTo(P, 1).toFixed(1)), ['Opposite sides of a rectangle are equal: add all four.'], 'perimeter');
          return p;
        } },
        { id: 'e11g', sub: 'f', level: 'PRG', make: function (r) {
          return B.mc(r, '(f) Which single one of parts (b) and (c) would you have to drop to leave yourself with only a parallelogram?', [
            { html: 'Part (c), the perpendicular sides: without a right angle, the two pairs of parallel sides prove only a parallelogram.', right: true },
            { html: 'Part (b), the parallel sides.', why: 'Without (b) you wouldn’t even know it is a parallelogram. (c) is what turns a parallelogram into a rectangle.' },
            { html: 'Neither — both are needed for a parallelogram.', why: 'A parallelogram needs only the parallel pairs (b).' }],
            'Drop part (c). The two pairs of parallel sides (b) prove a parallelogram; the right angle (c) is what makes it a rectangle.', ['What does a rectangle have that a parallelogram doesn’t?'], 'parallelogram vs rectangle');
        } }] },
    /* ---------------- EP12 ---------------- */
    { num: '12', shared: function (r) {
        return gen(r, function (r) { var a = r.int(1, 3), b = r.int(1, 3); if (gcd(a, b) !== 1 || a === b) return null; var s = r.int(1, 2), u = r.int(1, 2), V = [r.int(-7, -2), r.int(-4, 0)], P = add(V, [b * s * 3 / 3, a * s]), Q = add(V, [-a * u, b * u]); if (r.chance(0.5)) { P = add(V, [b * s, a * s]); Q = add(V, [-a * u * 1, b * u]); }
          if (!inBox(P, 9) || !inBox(Q, 9)) return null; var pts = [V, P, Q], at = r.int(0, 2); var order = at === 0 ? [V, P, Q] : at === 1 ? [P, V, Q] : [P, Q, V];
          var sl = [slopeOf(order[0], order[1]), slopeOf(order[1], order[2]), slopeOf(order[0], order[2])]; if (sl.some(function (x) { return !x || x[0] === 0; })) return null; void pts;
          return { pts: order, at: at }; }, { pts: [[-6, -2], [0, 2], [-8, 1]], at: 0 });
      },
      stem: function (s) { return 'Triangle ' + t('PQR') + ' has vertices ' + ['P', 'Q', 'R'].map(function (n, i) { return nP(n, s.pts[i]); }).join(', ') + '.'; },
      parts: (function () {
        var N = ['P', 'Q', 'R'], SIDE = [['PQ', 0, 1], ['QR', 1, 2], ['PR', 0, 2]];
        return [
          { id: 'e12a', sub: 'a i', level: 'EMG', make: function (r, s) { return slopeFields('Use <b>slopes only</b>: find the slopes of the three sides.', SIDE.map(function (x) { return { nm: x[0], A: s.pts[x[1]], B: s.pts[x[2]] }; }), null, [SLOPE_HINT], 'triangle: three slopes'); } },
          { id: 'e12a2', sub: 'a ii', level: 'EMG', make: function (r, s) {
            var sl = SIDE.map(function (x) { return slopeOf(s.pts[x[1]], s.pts[x[2]]); }), at = [[0, 2], [0, 1], [1, 2]];   // sides meeting at P, Q, R
            var sol = at.map(function (pr, i) { return t(prodT(sl[pr[0]], sl[pr[1]])) + ' (sides at ' + t(N[i]) + ')'; }).join('<br>') + '<br>The right angle is at <b>' + t(N[s.at]) + '</b>.';
            return B.mc(r, 'The triangle has a right angle. At which vertex?', N.map(function (n, i) { return { html: 'At ' + t(n), right: i === s.at, why: i === s.at ? null : 'The two sides that meet at ' + t(n) + ' don’t have slopes that multiply to ' + t('-1') + '.' }; }), sol, ['A right angle at a vertex: the two sides that meet there have slopes with product ' + t('-1') + '.'], 'right angle at which vertex', true);
          } },
          { id: 'e12b', sub: 'b', level: 'EMG', make: function (r, s) {
            var L = SIDE.map(function (x) { return d2(s.pts[x[1]], s.pts[x[2]]); }), hyp = L.indexOf(Math.max.apply(null, L));
            var p = B.fields('(b) Now use the distance formula and the Pythagorean theorem: find the three <b>squared</b> lengths.', SIDE.map(function (x) { return { label: t(x[0] + '^{2}=') }; }), L.map(function (n) { return K.number(n, function (v) { if (near(v * v, n)) return { code: 'u6l9-sq-root', hint: 'Give the <b>square</b> of the length (no square root needed here).' }; return null; }); }), L.map(String),
              t(SIDE.map(function (x, i) { return x[0] + '^{2}=' + L[i]; }).join(',\\ ')), SIDE.map(function (x, i) { var a = s.pts[x[1]], b = s.pts[x[2]]; return t(x[0] + '^{2}=' + nb(b[0] - a[0]) + '^{2}+' + nb(b[1] - a[1]) + '^{2}=' + L[i]); }).join('<br>') + '<br>' + t(L.filter(function (v, i) { return i !== hyp; }).join('+') + '=' + L[hyp]) + ': the Pythagorean theorem holds, so the triangle is right-angled, with ' + t(SIDE[hyp][0]) + ' as the hypotenuse — the same right angle at ' + t(N[s.at]) + '.',
              ['Squared length: ' + t('(x_2-x_1)^{2}+(y_2-y_1)^{2}') + ' — no square root.'], 'Pythagorean check');
            p.bad = [L.map(function (v, i) { return i === hyp ? String(v + 1) : String(v); })]; return p;
          } },
          { id: 'e12c', sub: 'c', level: 'BEG', make: function (r) {
            return B.mc(r, '(c) Which method took less work here, and when would the other method be the better choice?', [
              { html: 'Slopes were faster (subtractions, divisions and one multiplication, no squares or roots). Distances are better when you also need the side lengths, e.g. for a perimeter.', right: true },
              { html: 'Distances were faster, because the Pythagorean theorem is one equation.', why: 'You needed three squared lengths, each with two squares and a sum. Slopes need less.' },
              { html: 'They are the same amount of work, so it never matters.', why: 'Count the steps — and think about what each method tells you (lengths vs right angles).' }],
              'Slopes were faster: two subtractions and a division each, then one multiplication. Distances are the better choice when you also need the side lengths (perimeter, classifying by sides).', ['Count the steps in each method.'], 'which method is less work');
          } }];
      })() },
    /* ---------------- EP13 ---------------- */
    { num: '13', shared: function (r) {
        return gen(r, function (r) { var base = r.pick([[3, 1], [1, 3], [2, 1], [1, 2], [3, 2], [2, 3]]), a = r.int(1, 2), b = r.int(1, 2), sgn = r.chance(0.5) ? 1 : -1; var u = [base[0] * a, sgn * base[1] * a], w = [-u[1] / a * b, u[0] / a * b]; if (w[1] < 0) w = [-w[0], -w[1]];
          var A = [r.int(-7, -3), r.int(-3, 1)], Bp = add(A, u), C = add(Bp, w), D = add(A, w); if (![A, Bp, C, D].every(function (P) { return inBox(P, 9); })) return null;
          var s1 = slopeOf(A, Bp), s2 = slopeOf(Bp, C); if (!s1 || !s2 || s1[0] === 0 || s2[0] === 0) return null; return { A: A, B: Bp, C: C, D: D, sq: a === b }; }, { A: [-5, -1], B: [1, 1], C: [0, 4], D: [-6, 2], sq: false });
      },
      stem: function (s) { return '<b>Stretch.</b> Three vertices of a rectangle are ' + nP('A', s.A) + ', ' + nP('B', s.B) + ' and ' + nP('C', s.C) + ', joined in that order.'; },
      parts: [
        { id: 'e13a', level: 'EMG', make: function (r, s) { var st = { N: ['A', 'B', 'B', 'C'], P: [s.A, s.B, s.B, s.C], a: slopeOf(s.A, s.B), b: slopeOf(s.B, s.C) }; return pairFields('(a) Verify that ' + t('AB\\perp BC') + ': find both slopes and their product.', st, 'right angle at B', { prod: true }); } },
        { id: 'e13b', level: 'ADV', make: function (r, s) {
          var D = s.D, w1 = [s.A[0] + s.B[0] - s.C[0], s.A[1] + s.B[1] - s.C[1]], w2 = [s.B[0] + s.C[0] - s.A[0], s.B[1] + s.C[1] - s.A[1]];
          var p = B.math('(b) Find the coordinates of the fourth vertex ' + t('D') + '.', ptChk(D, [[w1, 'u6l9-4th-vertex', 'That point makes ' + t('ACBD') + ' a parallelogram, not ' + t('ABCD') + '. Go from ' + t('C') + ' the same way as from ' + t('B') + ' to ' + t('A') + '.'], [w2, 'u6l9-4th-vertex', 'That point is opposite ' + t('A') + ', not next to ' + t('C') + ' and ' + t('A') + '. Go from ' + t('A') + ' the same way as from ' + t('B') + ' to ' + t('C') + '.']]), '(' + D[0] + ', ' + D[1] + ')',
            'From ' + t('B') + ' to ' + t('C') + ': ' + t('(' + nb(s.C[0] - s.B[0]) + ',\\ ' + nb(s.C[1] - s.B[1]) + ')') + '. Do the same from ' + t('A') + ': ' + t('D=' + ptT(D)) + '.<br>Check: ' + t(calc(s.C, D, 'CD')) + ' ' + t('=m_{AB}') + ' and ' + t(calc(D, s.A, 'DA')) + ' ' + t('=m_{BC}') + ' ✓',
            ['Opposite sides of a rectangle are parallel and equal: the move from ' + t('A') + ' to ' + t('D') + ' is the same as the move from ' + t('B') + ' to ' + t('C') + '.'], 'fourth vertex', { keys: 'pairs', placeholder: 'e.g. (3, -2)' });
          p.bad = ['(' + w1[0] + ', ' + w1[1] + ')', '(' + w2[0] + ', ' + w2[1] + ')']; return p;
        } },
        { id: 'e13c', sub: 'c i', level: 'EMG', make: function (r, s) {
          var n1 = d2(s.A, s.B), n2 = d2(s.B, s.C);
          var p = B.fields('Find the side lengths ' + t('AB') + ' and ' + t('BC') + ' (exact, or to the nearest tenth).', [{ label: t('AB='), mode: 'math', keys: 'radical', placeholder: 'e.g. 2√10' }, { label: t('BC='), mode: 'math', keys: 'radical', placeholder: 'e.g. √10' }], [lenChk(n1), lenChk(n2)], [lenT(s.A, s.B), lenT(s.B, s.C)],
            t('AB=CD=' + lenT(s.A, s.B) + ',\\ BC=DA=' + lenT(s.B, s.C)), t('AB=\\sqrt{' + n1 + '}' + (lenT(s.A, s.B) === '\\sqrt{' + n1 + '}' ? '' : '=' + lenT(s.A, s.B)) + ',\\quad BC=\\sqrt{' + n2 + '}' + (lenT(s.B, s.C) === '\\sqrt{' + n2 + '}' ? '' : '=' + lenT(s.B, s.C))) + '. Opposite sides are equal: ' + t('CD=AB') + ' and ' + t('DA=BC') + '.',
            ['Distance formula for each side.'], 'rectangle: two side lengths');
          p.bad = [[String(n1), String(n2)]]; return p;
        } },
        { id: 'e13d', sub: 'c ii', level: 'BEG', make: function (r, s) {
          var a = lenT(s.A, s.B), b = lenT(s.B, s.C);
          return B.mc(r, 'With ' + t('AB=' + a) + ' and ' + t('BC=' + b) + ', is the rectangle a square?', [
            { html: '<b>Yes</b> — adjacent sides are equal.', right: s.sq, why: s.sq ? null : t(a + '\\ne ' + b) + ': adjacent sides are unequal.' },
            { html: '<b>No</b> — adjacent sides are not equal.', right: !s.sq, why: s.sq ? 'Compare again: ' + t(a + '=' + b) + '.' : null },
            { html: '<b>Yes</b> — it has four right angles.', why: 'Every rectangle has four right angles. A square also needs four <b>equal</b> sides.' }],
            s.sq ? t('AB=BC=' + a) + ': all four sides are equal, so it <b>is</b> a square.' : t(a + '\\ne ' + b) + ': not a square.', ['A square is a rectangle with all four sides equal.'], 'is it a square');
        } }] },
    /* ---------------- EP14 ---------------- */
    { num: '14', section: 'Extra Practice E — Reading the Relationships off a Diagram', shared: function (r) {
        var fbA = { segs: { AB: [[-5, 4], [-1, -2]], CD: [[-4, -5], [2, -1]], EF: [[1, 5], [5, -1]], GH: [[2, -4], [6, -1]] } };
        var a = gen(r, function (r) {
          var s = randSlope(r, { pool: [[3, 2], [2, 3], [1, 2], [2, 1], [3, 4], [4, 3]] }), ps = perpOf(s), o = gen(r, function (r) { var x = randSlope(r); return relKind(x, s) === 'nei' && relKind(x, ps) === 'nei' ? x : null; }, [3, 4]);
          var roles = r.shuffle(['AB', 'CD', 'EF', 'GH']), want = {}; want[roles[0]] = s; want[roles[1]] = s; want[roles[2]] = ps; want[roles[3]] = o;
          var segs = {}, used = [];
          for (var i = 0; i < 4; i++) { var nm = ['AB', 'CD', 'EF', 'GH'][i], S = gen(r, function (r) { var g = segWith(r, want[nm], 5); if (!g) return null; if (used.some(function (X) { return segsCross(X, g) || ptSegDist(g[0], X) < 1.2 || ptSegDist(g[1], X) < 1.2 || ptSegDist(X[0], g) < 1.2 || ptSegDist(X[1], g) < 1.2; })) return null; return g; }, null); if (!S) return null; segs[nm] = S; used.push(S); }
          return { segs: segs };
        }, fbA);
        var b = gen(r, function (r) { var rect = r.chance(0.3), u = r.pick([[3, 4], [4, 3], [2, 3], [3, 2], [4, 2], [2, 4], [3, 1], [1, 3], [4, 1]]), w = [-u[1], u[0]];
          if (r.chance(0.5)) { u = [u[0], -u[1]]; w = [-u[1], u[0]]; }
          if (!rect) { var e = r.pick([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]]); w = [w[0] + e[0], w[1] + e[1]]; var cs = (u[0] * w[0] + u[1] * w[1]) / Math.hypot(u[0], u[1]) / Math.hypot(w[0], w[1]); if (Math.abs(cs) < 0.08 || Math.abs(cs) > 0.4) return null; }
          if (Math.hypot(w[0], w[1]) < 2.5) return null;
          var P = [r.int(-6, 6), r.int(-6, 6)], Q = add(P, u), R = add(Q, w), S = add(P, w); if (![P, Q, R, S].every(function (X) { return inBox(X, 5); })) return null;
          var sl = [slopeOf(P, Q), slopeOf(Q, R)]; if (sl.some(function (x) { return !x || x[0] === 0; })) return null; if ((relKind(sl[0], sl[1]) === 'perp') !== rect) return null; return { V: [P, Q, R, S], rect: rect }; }, { V: [[-2, -5], [1, -1], [-3, 1], [-6, -3]], rect: false });
        return { a: a, b: b };
      },
      stem: 'Read the endpoints off each grid.',
      parts: (function () {
        var NM = ['AB', 'CD', 'EF', 'GH'];
        function figA(s) { var cols = { AB: '#2b55a0', CD: '#c4532a', EF: '#2b55a0', GH: '#2f7d4f' }, pts = [];
          NM.forEach(function (nm) { pts.push(lbl(s.a.segs[nm][0], nm[0])); pts.push(lbl(s.a.segs[nm][1], nm[1])); });
          return graphOf({ x: [-6, 6], y: [-6, 6], grid: 1, labels: 2, max: 330, segs: NM.map(function (nm) { return { pts: s.a.segs[nm], color: cols[nm] }; }), points: pts, aria: 'four segments' }); }
        function figB(s) { var V = s.b.V; return graphOf({ x: [-6, 6], y: [-6, 6], grid: 1, labels: 2, max: 330, segs: [{ pts: V.concat([V[0]]) }], points: V.map(function (P, i) { return lbl(P, 'PQRS'.charAt(i)); }), aria: 'quadrilateral PQRS' }); }
        return [
          { id: 'e14a', sub: 'a i', level: 'EMG', make: function (r, s) { return slopeFields('Find the slope of each segment.' + figA(s), NM.map(function (nm) { return { nm: nm, A: s.a.segs[nm][0], B: s.a.segs[nm][1] }; }), null, [SLOPE_HINT, 'Read each endpoint carefully: count the grid squares from the axes.'], 'four segments: slopes'); } },
          { id: 'e14a2', sub: 'a ii', level: 'PRG', make: function (r, s) {
            var sl = {}; NM.forEach(function (nm) { sl[nm] = slopeOf(s.a.segs[nm][0], s.a.segs[nm][1]); });
            var opts = [], want = [], all = [];
            for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) { var k = relKind(sl[NM[i]], sl[NM[j]]); all.push({ a: NM[i], b: NM[j], k: k }); ['par', 'perp'].forEach(function (rel) { var v = NM[i] + (rel === 'par' ? '∥' : '⊥') + NM[j]; opts.push({ value: v, html: t(NM[i] + (rel === 'par' ? '\\parallel ' : '\\perp ') + NM[j]) }); if (k === rel) want.push(v); }); }
            var byV = {}; all.forEach(function (p) { byV[p.a + '∥' + p.b] = p; byV[p.a + '⊥' + p.b] = p; });
            var diag = function (extra, missing) { if (extra.length) { var p = byV[extra[0]]; return { code: p.k === 'nei' ? 'sel-none' : 'sel-rel', hint: t('m_{' + p.a + '}=' + sT(sl[p.a])) + ' and ' + t('m_{' + p.b + '}=' + sT(sl[p.b])) + (p.k === 'par' ? ' are equal: that pair is parallel.' : p.k === 'perp' ? ' multiply to ' + t('-1') + ': that pair is perpendicular.' : ': neither equal nor multiplying to ' + t('-1') + '.') }; } return { code: 'sel-missing', hint: 'Correct so far — but there ' + (missing.length === 1 ? 'is one more true statement' : 'are ' + missing.length + ' more') + '. A segment can be in more than one pair.' }; };
            var sol = 'Slopes: ' + NM.map(function (nm) { return t('m_{' + nm + '}=' + sT(sl[nm])); }).join(', ') + '.<br>' + all.map(function (p) { return t(p.a) + ' and ' + t(p.b) + ': ' + (p.k === 'par' ? 'parallel' : p.k === 'perp' ? 'perpendicular (' + t(prodT(sl[p.a], sl[p.b])) + ')' : 'neither'); }).join('<br>');
            return { prompt: 'List every pair of the four segments that is parallel, and every pair that is perpendicular: select every true statement.' + figA(s), input: { type: 'select', options: opts }, check: K.selectSet(want, diag), key: want,
              answer: want.map(function (v) { return t(v.replace('∥', '\\parallel ').replace('⊥', '\\perp ')); }).join(', '), solution: sol, hints: ['Use your slopes from (a i): equal slopes are parallel; slopes that multiply to ' + t('-1') + ' are perpendicular.', 'Some segments belong to no pair at all.'], text: 'list the parallel and perpendicular pairs',
              bad: [want.slice(1), want.concat([opts.map(function (o) { return o.value; }).filter(function (v) { return want.indexOf(v) < 0; })[0]])] };
          } },
          { id: 'e14b', sub: 'b i', level: 'EMG', make: function (r, s) { var V = s.b.V, nm = ['PQ', 'QR', 'RS', 'SP']; return slopeFields('Quadrilateral ' + t('PQRS') + ' looks like a rectangle. Find all four slopes.' + figB(s), nm.map(function (x, i) { return { nm: x, A: V[i], B: V[(i + 1) % 4] }; }), null, [SLOPE_HINT], 'quadrilateral: four slopes'); } },
          { id: 'e14b2', sub: 'b ii', level: 'PRG', make: function (r, s) {
            var V = s.b.V, sl = [0, 1, 2, 3].map(function (i) { return slopeOf(V[i], V[(i + 1) % 4]); }), pr = prod(sl[0], sl[1]), rect = s.b.rect;
            return B.mc(r, 'Is ' + t('PQRS') + ' really a rectangle? Name it as precisely as you can.' + figB(s), [
              { html: '<b>Rectangle</b> — opposite sides parallel and adjacent sides perpendicular.', right: rect, why: rect ? null : 'Multiply two adjacent slopes: ' + t(prodT(sl[0], sl[1])) + ', not ' + t('-1') + '. No square corners.' },
              { html: '<b>Parallelogram</b>, not a rectangle — opposite sides parallel, but no right angles.', right: !rect, why: rect ? 'Multiply two adjacent slopes: ' + t(prodT(sl[0], sl[1])) + ' — it does have right angles.' : null },
              { html: '<b>Trapezoid</b> — only one pair of parallel sides.', why: 'Compare the opposite slopes: both pairs are equal.' },
              { html: 'You can’t tell without measuring the angles with a protractor.', why: 'Slopes settle it: equal slopes for parallel sides, a product of ' + t('-1') + ' for right angles.' }],
              t('m_{PQ}=m_{RS}=' + sT(sl[0])) + ' and ' + t('m_{QR}=m_{SP}=' + sT(sl[1])) + ': both pairs of opposite sides are parallel. ' + t(prodT(sl[0], sl[1])) + (rect ? ': adjacent sides are perpendicular, so it <b>is</b> a rectangle.' : ', not ' + t('-1') + ': no corner is square, so it is a <b>parallelogram</b>, not a rectangle.'), ['Both pairs of opposite sides parallel? Then check one corner with the product rule.'], 'rectangle or parallelogram');
          } }];
      })() },
    /* ---------------- EP15 ---------------- */
    { num: '15', section: 'Extra Practice F — Error Analysis, Reasoning, and an Application', shared: function (r) { return gen(r, function (r) { var p = r.int(1, 9), q = r.int(2, 9); if (gcd(p, q) !== 1 || p === q) return null; return [p, q]; }, [5, 8]); },
      stem: function (m) { return 'Dmitri is asked for the slope of a line perpendicular to a line of slope ' + t(sT(m)) + '. He writes ' + t(sT(red(m[1], m[0]))) + ', saying “perpendicular means flip the fraction.”'; },
      parts: [
        { id: 'e15a', sub: 'i', level: 'EMG', make: function (r, m) {
          var his = red(m[1], m[0]), pp = perpOf(m);
          var p = B.fields('Multiply his two slopes, and state the correct answer.', [{ label: t(sT(m) + '\\times ' + sT(his) + '='), mode: 'math', keys: 'slope', placeholder: 'e.g. 1' }, { label: 'Correct slope: ' + t('m_{\\perp}='), mode: 'math', keys: 'slope', placeholder: 'e.g. -8/5' }],
            [prodChk(m, his), relChk(m, 'perp')], ['1', sT(pp)], t(sT(m) + '\\times ' + sT(his) + '=1,\\quad m_{\\perp}=' + sT(pp)),
            t(sT(m) + '\\times ' + sT(his) + '=1') + ', not ' + t('-1') + ', so his slope is not perpendicular. The correct slope is ' + t(sT(pp)) + ' (check: ' + t(prodT(m, pp)) + ').', ['Multiply top × top and bottom × bottom.', 'Perpendicular: flip it <b>and</b> change the sign.'], 'Dmitri: product and correct slope');
          p.bad = [['-1', sT(his)]]; return p;
        } },
        { id: 'e15b', sub: 'ii', level: 'BEG', make: function (r) {
          return B.mc(r, 'Describe Dmitri’s mistake in one sentence.', [
            { html: 'He flipped the fraction but forgot to change the sign — the reciprocal alone gives a product of ' + t('+1') + '.', right: true },
            { html: 'He changed the sign but forgot to flip.', why: 'Look at his answer: it is flipped, and the sign is unchanged.' },
            { html: 'He should have kept the same slope.', why: 'The same slope would be <b>parallel</b>.' },
            { html: 'Nothing — flipping is all you need.', why: 'Multiply his slopes: the product is ' + t('+1') + ', not ' + t('-1') + '.' }],
            'He flipped the fraction but did not change the sign; perpendicular slopes are negative reciprocals (product ' + t('-1') + ').', ['Compare his answer with the negative reciprocal.'], 'Dmitri’s mistake');
        } }] },
    /* ---------------- EP16 ---------------- */
    { num: '16', shared: function (r) { return r.chance(0.5) ? [r.int(2, 12), 1] : gen(r, function (r) { var p = r.int(1, 9), q = r.int(2, 9); return gcd(p, q) === 1 && p !== q ? [p, q] : null; }, [3, 4]); },
      stem: function (m) { return 'Priya claims the lines with slopes ' + t(sT(m)) + ' and ' + t(sT([-m[0], m[1]])) + ' are perpendicular “because one is the negative of the other.”'; },
      parts: [
        { id: 'e16a', sub: 'i', level: 'EMG', make: function (r, m) {
          var ng = [-m[0], m[1]], pr = prod(m, ng), pp = perpOf(m);
          var p = B.fields('Multiply the slopes, and give the slope that really is perpendicular to ' + t(sT(m)) + '.', [{ label: t(sT(m) + '\\times' + sP(ng) + '='), mode: 'math', keys: 'slope', placeholder: 'e.g. -9' }, { label: 'Perpendicular to ' + t(sT(m)) + ': ' + t('m_{\\perp}='), mode: 'math', keys: 'slope', placeholder: 'e.g. -1/3' }],
            [prodChk(m, ng), relChk(m, 'perp')], [frT(pr[0], pr[1]), sT(pp)], t(sT(m) + '\\times' + sP(ng) + '=' + frT(pr[0], pr[1]) + ',\\quad m_{\\perp}=' + sT(pp)),
            t(prodT(m, ng) + '\\ne -1') + ', so they are not perpendicular. The perpendicular slope is ' + t(sT(pp)) + ' (check: ' + t(prodT(m, pp)) + ').', ['Multiply the two slopes.', 'Perpendicular: flip ' + t(sT(m)) + ' and change the sign.'], 'Priya: product and perpendicular slope');
          p.bad = [['-1', sT(ng)]]; return p;
        } },
        { id: 'e16b', sub: 'ii', level: 'EMG', make: function (r, m) {
          var ng = [-m[0], m[1]], pr = prod(m, ng);
          return B.mc(r, 'What is the relationship between slopes ' + t(sT(m)) + ' and ' + t(sT(ng)) + ' really?', [
            { html: 'They are mirror images: equally steep, one rising and one falling (like the two sides of a roof) — but the angle between them isn’t ' + t('90^{\\circ}') + '.', right: true },
            { html: 'They are parallel.', why: 'Parallel slopes are equal. These have opposite signs.' },
            { html: 'They are perpendicular after all.', why: 'Their product is ' + t(frT(pr[0], pr[1])) + ', not ' + t('-1') + '.' }],
            'Slopes ' + t(sT(m)) + ' and ' + t(sT(ng)) + ' are equally steep, one rising and one falling — mirror images in a vertical line. They cross, but not at ' + t('90^{\\circ}') + '.', ['Sketch a line of slope ' + t(sT(m)) + ' and one of slope ' + t(sT(ng)) + '.'], 'mirror-image slopes');
        } }] },
    /* ---------------- EP17 ---------------- */
    { num: '17', stem: 'Can two lines that both have <b>positive</b> slope ever be perpendicular?', parts: [
      { id: 'e17a', level: 'EMG', make: function (r) {
        return B.mc(r, '(a) Answer and justify using the product ' + t('m_1\\times m_2') + '.', [
          { html: '<b>No</b> — a positive number times a positive number is positive, and a positive number can never equal ' + t('-1') + '.', right: true },
          { html: '<b>Yes</b> — if the slopes are reciprocals, like ' + t('2') + ' and ' + t('\\frac{1}{2}') + '.', why: t('2\\times\\frac{1}{2}=+1') + ', not ' + t('-1') + '.' },
          { html: '<b>Yes</b> — if one is very steep and the other very flat.', why: 'Steep and flat isn’t enough: the product of two positives is still positive.' }],
          'No. If ' + t('m_1>0') + ' and ' + t('m_2>0') + ' then ' + t('m_1\\times m_2>0') + ', and a positive number can never equal ' + t('-1') + '.', ['What sign does the product of two positive numbers have?'], 'two positive slopes: product');
      } },
      { id: 'e17b', level: 'EMG', make: function (r) {
        return B.mc(r, '(b) Explain the same thing by describing how the two lines would look on a grid.', [
          { html: 'Both lines rise to the right. To turn one of them a quarter-turn, you must tip it past vertical so it starts falling — then its slope is negative.', right: true },
          { html: 'Lines with positive slope never cross, so they can’t be perpendicular.', why: 'Lines with different positive slopes do cross — just never at ' + t('90^{\\circ}') + '.' },
          { html: 'Two rising lines are always parallel.', why: 'Only if their slopes are equal.' }],
          'Both lines rise as you move right. A quarter-turn of a rising line tips it past vertical, so it falls — a negative slope. So two rising lines can’t meet at ' + t('90^{\\circ}') + '.', ['Turn a rising line a quarter-turn. Which way does it go now?'], 'two positive slopes: picture');
      } }] },
    /* ---------------- EP18 ---------------- */
    { num: '18', stem: 'A student writes the rule “if two lines are perpendicular, one slope is positive and the other is negative.” The rule is <i>almost</i> right.', parts: [
      { id: 'e18a', level: 'EMG', make: function (r) {
        return B.mc(r, '(a) For which perpendicular pair does the rule fail?', [
          { html: 'A horizontal line and a vertical line: slope ' + t('0') + ' is neither positive nor negative, and the other slope is undefined.', right: true },
          { html: 'Two lines with slopes ' + t('1') + ' and ' + t('-1') + '.', why: 'Those fit the rule: one positive, one negative.' },
          { html: 'Two vertical lines.', why: 'Two vertical lines are parallel, not perpendicular.' },
          { html: 'Lines with slopes ' + t('2') + ' and ' + t('\\frac{1}{2}') + '.', why: 'Those aren’t perpendicular (product ' + t('+1') + ').' }],
          'A horizontal line (slope ' + t('0') + ', neither positive nor negative) and a vertical line (slope undefined) are perpendicular, yet neither slope is positive or negative.', ['Which perpendicular pair has a slope that isn’t positive or negative?'], 'where the sign rule fails');
      } },
      { id: 'e18b', level: 'PRG', make: function (r) {
        return B.mc(r, '(b) Which restatement is always true?', [
          { html: 'If two perpendicular lines both have defined, non-zero slopes, one is positive and the other negative; the only other perpendicular pair is a horizontal line with a vertical line.', right: true },
          { html: 'If one slope is positive and the other negative, the lines are perpendicular.', why: 'That is the converse, and it’s false: ' + t('2') + ' and ' + t('-2') + ' aren’t perpendicular.' },
          { html: 'Perpendicular lines always have slopes that multiply to ' + t('-1') + '.', why: 'That misses the horizontal–vertical pair, where one slope is undefined.' },
          { html: 'Perpendicular lines always have one positive slope.', why: 'Not when one is horizontal (slope ' + t('0') + ') and the other vertical.' }],
          'Always true: “if two perpendicular lines both have defined, non-zero slopes, one slope is positive and the other negative; the only other perpendicular pair is a horizontal line with a vertical line.”', ['The rule needs an exception for the horizontal–vertical pair.'], 'corrected sign rule');
      } }] },
    /* ---------------- EP19 ---------------- */
    { num: '19', shared: function (r) {
        var fb = { pts: { Elm: [[-8, 5], [4, -1]], Birch: [[-3, -6], [3, 6]], Cedar: [[0, 7], [10, 2]] }, perp: 'Birch' };
        return gen(r, function (r) { var s = randSlope(r, { pool: [[1, 2], [1, 3], [2, 3], [3, 4], [1, 4]], sign: -1 }), ps = perpOf(s), names = ['Elm', 'Birch', 'Cedar'], perp = r.chance(0.5) ? 'Birch' : r.pick(names), pts = {};
          for (var i = 0; i < 3; i++) { var nm = names[i], g = segWith(r, nm === perp ? ps : s, 10, i ? pts[names[0]] : null); if (!g) return null; if (g[0][0] > g[1][0]) g = [g[1], g[0]]; pts[nm] = g; }
          var par = names.filter(function (n) { return n !== perp; }); if (onLine(pts[par[0]][0], pts[par[0]][1], pts[par[1]][0]) && onLine(pts[par[0]][0], pts[par[0]][1], pts[par[1]][1])) return null;
          return { pts: pts, perp: perp }; }, fb);
      },
      stem: function (s) { return 'A town’s street grid is drawn on coordinate axes. ' + ['Elm', 'Birch', 'Cedar'].map(function (n) { return n + ' Street runs through ' + t(ptT(s.pts[n][0])) + ' and ' + t(ptT(s.pts[n][1])); }).join('; ') + '.'; },
      parts: [
        { id: 'e19a', level: 'BEG', make: function (r, s) { return slopeFields('(a) Find the slope of each street.', ['Elm', 'Birch', 'Cedar'].map(function (n) { return { nm: '\\text{' + n + '}', A: s.pts[n][0], B: s.pts[n][1] }; }), null, [SLOPE_HINT], 'three street slopes'); } },
        { id: 'e19b', level: 'EMG', make: function (r, s) {
          var sl = {}; ['Elm', 'Birch', 'Cedar'].forEach(function (n) { sl[n] = slopeOf(s.pts[n][0], s.pts[n][1]); });
          var sets = [['Elm', 'Birch'], ['Elm', 'Cedar'], ['Birch', 'Cedar']].map(function (x, i) { return { id: 'pqr'.charAt(i), label: x[0] + ' and ' + x[1], a: sl[x[0]], b: sl[x[1]], x: x }; });
          var want = {}; sets.forEach(function (st) { want[st.id] = relKind(st.a, st.b); });
          return B.grid('(b) For each pair of streets: do they meet at a right angle, never meet, or meet at some other angle?', sets.map(function (st) { return { id: st.id, html: st.label }; }), [{ id: 'perp', html: 'Right angle' }, { id: 'par', html: 'Never meet' }, { id: 'nei', html: 'Other angle' }], want,
            { why: function (row) { var st = sets['pqr'.indexOf(row)]; return st.label + ': slopes ' + t(sT(st.a)) + ' and ' + t(sT(st.b)) + '. ' + REL_HINT; } },
            sets.map(function (st) { return st.label + ': ' + (want[st.id] === 'perp' ? t(prodT(st.a, st.b)) + ' — they meet at a right angle.' : want[st.id] === 'par' ? 'equal slopes, different streets — they never meet (parallel).' : 'neither.'); }).join('<br>'), [REL_HINT, 'Parallel streets never meet.'], 'which streets meet at right angles');
        } },
        { id: 'e19c', sub: 'c i', level: 'BEG', make: function (r, s) { var sb = slopeOf(s.pts.Birch[0], s.pts.Birch[1]); return slopeAns('A fourth street must be parallel to Birch Street. What slope must it have?', sb, relChk(sb, 'par'), 'Parallel to Birch: the same slope, ' + t(sT(sb)) + '.', ['Parallel lines have equal slopes.'], 'parallel to Birch'); } },
        { id: 'e19d', sub: 'c ii', level: 'PRG', make: function (r, s) {
          var se = slopeOf(s.pts.Elm[0], s.pts.Elm[1]), sb = slopeOf(s.pts.Birch[0], s.pts.Birch[1]), par = sEq(se, sb);
          return B.mc(r, 'Could this fourth street ever cross Elm Street?', [
            { html: '<b>Yes</b> — its slope ' + t(sT(sb)) + ' is different from Elm’s ' + t(sT(se)) + ', so the two lines must cross exactly once.', right: !par, why: par ? 'Elm has the same slope as Birch, so a street parallel to Birch is parallel to Elm too.' : null },
            { html: '<b>No</b> — it is parallel to Elm.', right: par, why: par ? null : 'It is parallel to <b>Birch</b>. Its slope ' + t(sT(sb)) + ' is not Elm’s slope ' + t(sT(se)) + '.' },
            { html: '<b>No</b> — parallel streets never cross anything.', why: 'It never crosses Birch (or streets parallel to Birch). Lines with different slopes always cross.' }],
            par ? 'Elm has the same slope as Birch, so the new street is parallel to Elm: <b>no</b>, it never crosses Elm.' : 'The new street has slope ' + t(sT(sb)) + ' and Elm has slope ' + t(sT(se)) + ': different slopes, so the lines cross exactly once — <b>yes</b>.' + (relKind(se, sb) === 'perp' ? ' (In fact it crosses Elm at a right angle, as Birch does.)' : ''), ['Two lines with different slopes always cross once.'], 'does the new street cross Elm');
        } }] }
  ];

  HW.defineLesson({
    id: 'u6l9', unit: 6, num: '9', title: 'Parallel and Perpendicular Lines', outcome: 'RF3',
    blurb: 'Comparing the slopes of two segments: equal slopes mean parallel, negative reciprocals (product −1) mean perpendicular — plus the horizontal–vertical exception, solving for an unknown, and proving right angles and rectangles.',
    questions: QUESTIONS, extra: EXTRA
  });
})(window);
