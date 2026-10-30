/* Math 15 · Unit 6 · Lesson 10 — Unit Review: Coordinate Geometry (RF3)
 * Assignment 10 (u6_L10.tex, Questions 1–26) and the Lesson 10 Extra Practice (u6_EP10.tex, Questions 1–20): mixed
 * RF3 items from the whole unit — the Pythagorean theorem, horizontal/vertical lengths, the distance formula, midpoints
 * and missing endpoints, slope and types of slope, collinearity, parallel and perpendicular segments, right triangles
 * and quadrilaterals. Every part is a generator (same structure as the booklet item, new numbers; the booklet's own
 * numbers are among the versions). Model: Math 10C u6l5.js (review) plus the Math 15 Unit 6 lessons 8–9 helpers.
 * "Exact" lengths require a simplified radical (a decimal gets a nudge); other lengths accept the exact radical or a
 * decimal to the nearest tenth. Multi-answer items use labelled boxes with one shared keypad; "explain / name / classify"
 * items are multiple choice or a table of choices. Figures 1 and 2 (Extra 8, 9) are drawn and read off the grid.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 19 (point on the x-axis equidistant from A and B) and
 * Extra 20 (all three fourth vertices of a parallelogram). */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, Ln = HW.lines;

  HW.addCodes({
    'double-neg': 'Double negative slip in the slope formula', 'perp-same': 'Gave the original slope for a perpendicular', 'perp-nosign': 'Reciprocal without changing the sign',
    'perp-noflip': 'Changed the sign without taking the reciprocal', 'par-perp': 'Gave the perpendicular slope for a parallel line', 'k-sign': 'Sign slip solving for k', 'k-no-start': 'Forgot the starting coordinate',
    'k-flip': 'Used run over rise when solving for k', 'k-par-perp': 'Used parallel (equal) slopes instead of perpendicular', 'k-perp-par': 'Used the perpendicular slope instead of an equal one',
    'len-no-root': 'Forgot the square root', 'sum-sq': 'Added instead of squaring', 'mid-sub': 'Subtracted coordinates for a midpoint', 'mid-half': 'Didn’t halve the sums (midpoint)',
    'u6l9-prod-sign': 'Product of the slopes with the wrong sign', 'u6l9-prod-add': 'Added the slopes instead of multiplying', 'u6l9-zero-und': 'Mixed up slope 0 and undefined', 'u6l9-4th-vertex': 'Fourth vertex from the wrong pair of sides',
    'u6l10-sub-sq': 'Subtracted the squares (distance / hypotenuse)', 'u6l10-leg-add': 'Added the squares to find a leg', 'u6l10-end-avg': 'Averaged the endpoint and the midpoint',
    'u6l10-end-diff': 'Gave only the step from the endpoint to the midpoint', 'u6l10-end-way': 'Went the wrong way from the midpoint', 'u6l10-scale': 'Forgot the map scale (grid units)',
    'u6l10-whole': 'Gave the whole distance instead of the part asked for', 'u6l10-half-run': 'Used half the run/rise (to the midpoint) as the whole', 'u6l10-pct': 'Slope as a percent, not a decimal',
    'u6l10-midpoint': 'Gave the midpoint instead of the point on the axis'
  });
  HW.addPartial({ 'perp-same': 'n', 'perp-noflip': 'b', 'par-perp': 'n', 'k-par-perp': 'n', 'k-perp-par': 'n', 'mid-sub': 'n', 'u6l9-prod-sign': 's', 'u6l9-prod-add': 'n', 'u6l9-zero-und': 'b', 'u6l9-4th-vertex': 'n',
    'u6l10-sub-sq': 'b', 'u6l10-leg-add': 'b', 'u6l10-end-avg': 'n', 'u6l10-end-diff': 'b', 'u6l10-end-way': 'b', 'u6l10-scale': 's', 'u6l10-whole': 'b', 'u6l10-half-run': 'b', 'u6l10-pct': 's', 'u6l10-midpoint': 'n' });

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

  /* ---------------- Lesson 10 extras: lengths, midpoints, mixed boxes ---------------- */
  var TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [15, 20, 25], [10, 24, 26], [20, 21, 29], [12, 35, 37], [9, 40, 41], [18, 24, 30], [16, 30, 34]];
  function radT(n) { var s = simp(n); return s[1] === 1 ? String(s[0]) : (s[0] === 1 ? '' : s[0]) + '\\sqrt{' + s[1] + '}'; }
  function distSteps(A, P, nm) { var n = d2(A, P); return t((nm ? nm + '=' : '') + '\\sqrt{(' + nT(P[0]) + '-' + nb(A[0]) + ')^{2}+(' + nT(P[1]) + '-' + nb(A[1]) + ')^{2}}=\\sqrt{' + nb(P[0] - A[0]) + '^{2}+' + nb(P[1] - A[1]) + '^{2}}=\\sqrt{' + n + '}' + (radT(n) === '\\sqrt{' + n + '}' ? '' : '=' + radT(n))); }
  /* distance diagnoses for A to P */
  function distDiag(A, P) {
    var dx = P[0] - A[0], dy = P[1] - A[1], n = dx * dx + dy * dy, out = [[n, 'len-no-root', 'That is ' + t('d^{2}') + ' — take the square root.'], [Math.abs(dx) + Math.abs(dy), 'sum-sq', 'You added the run and the rise. Square each, add, then take the square root.']];
    if (dx * dx !== dy * dy) out.push([Math.sqrt(Math.abs(dx * dx - dy * dy)), 'u6l10-sub-sq', 'The squares are <b>added</b> in the distance formula, not subtracted.']);
    var sx = P[0] + A[0], sy = P[1] + A[1]; out.push([Math.sqrt(sx * sx + dy * dy), 'double-neg', NEG_HINT]); out.push([Math.sqrt(dx * dx + sy * sy), 'double-neg', NEG_HINT]);
    return function (v) { for (var i = 0; i < out.length; i++) if (!near(out[i][0], Math.sqrt(n)) && Math.abs(v - out[i][0]) < 0.051) return { code: out[i][1], hint: out[i][2] }; return null; };
  }
  /* exact length (simplified radical or whole number); a decimal gets a nudge */
  function exactChk(n, diag) {
    var s = simp(n);
    if (s[1] !== 1) return K.radical({ k: s[0], n: 2, m: s[1] }, 'mixed', { diag: function (v) { return diag ? diag(v) : null; } });
    return function (resp) {
      var a = K.read(String(resp == null ? '' : resp).replace(/^\s*[A-Za-z]{1,2}\s*=\s*/, '')); if (a.res) return a.res;
      if (near(a.val, s[0])) { var sh = ex.shape(a.ast); return (sh.roots || sh.ops || sh.muls || sh.divs || sh.pow) ? form('simplify', 'Right value — ' + t(n) + ' is a perfect square, so simplify it to a whole number.') : ok(); }
      var h = diag ? diag(a.val) : null; if (h) return wrong(h.code, h.hint);
      return wrong('value', null);
    };
  }
  /* length: exact or a decimal to the nearest tenth */
  function anyLenChk(n, diag) {
    var base = lenChk(n);
    return function (resp) { var r0 = base(resp); if (r0.v !== 'wrong' || !diag) return r0; var a = K.read(String(resp == null ? '' : resp)); if (a.res) return r0; var h = diag(a.val); return h ? wrong(h.code, h.hint) : r0; };
  }
  function midOf(P, Q) { return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; }
  function pT(P) { return '(' + nT(P[0]) + ', ' + nT(P[1]) + ')'; }
  function midChk(P, Q) {
    return ptChk(midOf(P, Q), [[[P[0] + Q[0], P[1] + Q[1]], 'mid-half', 'You added the coordinates — now divide each sum by ' + t('2') + '.'],
      [[(Q[0] - P[0]) / 2, (Q[1] - P[1]) / 2], 'mid-sub', 'For a midpoint, <b>add</b> the coordinates, then halve: ' + t('\\left(\\frac{x_1+x_2}{2},\\ \\frac{y_1+y_2}{2}\\right)') + '.'],
      [[(P[0] - Q[0]) / 2, (P[1] - Q[1]) / 2], 'mid-sub', 'For a midpoint, <b>add</b> the coordinates, then halve.']]);
  }
  function midSol(P, Q, nm) { var M = midOf(P, Q); return t((nm ? nm + '=' : '') + '\\left(\\frac{' + nT(P[0]) + '+' + nb(Q[0]) + '}{2},\\ \\frac{' + nT(P[1]) + '+' + nb(Q[1]) + '}{2}\\right)=' + ptT(M)); }
  /* the other endpoint B of a segment with endpoint A and midpoint M */
  function endChk(A, M) {
    var Bq = [2 * M[0] - A[0], 2 * M[1] - A[1]];
    return ptChk(Bq, [[midOf(A, M), 'u6l10-end-avg', 'That is halfway between ' + t('A') + ' and the midpoint. The midpoint is <b>halfway</b> to the other end: go the same distance again past ' + t('M') + '.'],
      [[M[0] - A[0], M[1] - A[1]], 'u6l10-end-diff', 'That is only the step from the endpoint to the midpoint. Add that step to the midpoint.'], [[2 * A[0] - M[0], 2 * A[1] - M[1]], 'u6l10-end-way', 'You went the wrong way — the other endpoint is past the <b>midpoint</b>, not past the given endpoint.']]);
  }
  /* boxes: [{ label, keys, chk, key, ans }] */
  function multi(prompt, boxes, sol, hints, text, bad) {
    var allSlope = boxes.every(function (b) { return b.keys === 'slope'; }), PH = { slope: 'e.g. -2/3', radical: 'e.g. 2√13 or 7.2', pairs: 'e.g. (3, -2)' };
    var p = B.fields(prompt, boxes.map(function (b) { return { label: b.label, mode: 'math', keys: allSlope ? 'slope' : boxes.every(function (x) { return x.keys === 'radical'; }) ? 'radical' : 'pairs', placeholder: b.ph || PH[b.keys] || '' }; }), boxes.map(function (b) { return b.chk; }), boxes.map(function (b) { return b.key; }),
      boxes.map(function (b) { return b.ans || (b.label + ' ' + t(b.key)); }).join(', '), sol, hints, text);
    p.bad = bad || [boxes.map(function () { return '987654'; })];
    return p;
  }
  function lenBox(nm, A, P, exact) { var n = d2(A, P); return { label: t(nm + '='), keys: 'radical', ph: 'e.g. 2√13', chk: exact ? exactChk(n, distDiag(A, P)) : anyLenChk(n, distDiag(A, P)), key: radT(n), ans: t(nm + '=' + radT(n)) }; }
  function slopeBox(nm, A, P) { var s = slopeOf(A, P); return { label: t('m_{' + nm + '}='), keys: 'slope', ph: 'e.g. -2/3', chk: slopeChk(s, dnDiag(A, P)), key: sT(s), ans: t('m_{' + nm + '}=' + sT(s)) }; }
  function ptBox(lab, P, chk) { return { label: lab, keys: 'pairs', ph: 'e.g. (3, -2)', chk: chk || ptChk(P), key: pT(P), ans: lab + ' ' + t(ptT(P)) }; }
  function numBox(lab, v, list, after) { return { label: lab, keys: 'radical', ph: 'e.g. 12', chk: stripVar(K.value(v, { diag: dg(list || [], v) })), key: nT(v), ans: lab + ' ' + t(nT(v)) + (after || '') }; }
  function kindMC(r, prompt, s, sol, text) {
    var k = s == null ? 'und' : s[0] === 0 ? 'zero' : s[0] > 0 ? 'pos' : 'neg', why = { pos: 'Going left to right it goes up: positive.', neg: 'Going left to right it goes down: negative.', zero: 'Same ' + t('y') + '-coordinates: horizontal, slope ' + t('0') + '.', und: 'Same ' + t('x') + '-coordinates: vertical, the run is ' + t('0') + ' — undefined.' };
    var opts = [['pos', 'Positive'], ['neg', 'Negative'], ['zero', 'Zero'], ['und', 'Undefined']].map(function (o) { return { html: '<b>' + o[1] + '</b>', right: o[0] === k, why: o[0] === k ? null : 'Look again. ' + (k === 'zero' || k === 'und' ? 'Compare the coordinates: which one is the same for both points?' : 'Does the segment go up or down from left to right?') }; });
    return B.mc(r, prompt, opts, sol + ' ' + why[k], ['Compare the coordinates first. Then: up from left to right is positive, down is negative.'], text, true);
  }
  function quadName(V) {
    var sl = [0, 1, 2, 3].map(function (i) { return slopeOf(V[i], V[(i + 1) % 4]); }), L = [0, 1, 2, 3].map(function (i) { return d2(V[i], V[(i + 1) % 4]); });
    var par = sEq(sl[0], sl[2]) && sEq(sl[1], sl[3]), right = relKind(sl[0], sl[1]) === 'perp', eq = L[0] === L[1];
    return !par ? 'other' : right ? (eq ? 'sq' : 'rect') : (eq ? 'rhom' : 'para');
  }
  var QN = { sq: 'Square', rect: 'Rectangle', rhom: 'Rhombus', para: 'Parallelogram' };
  function nameMC(r, prompt, V, N, text) {
    var ty = quadName(V), sl = [0, 1, 2, 3].map(function (i) { return slopeOf(V[i], V[(i + 1) % 4]); }), L = [0, 1, 2, 3].map(function (i) { return radT(d2(V[i], V[(i + 1) % 4])); });
    var sd = [0, 1, 2, 3].map(function (i) { return N[i] + N[(i + 1) % 4]; });
    var why = { sq: 'A square needs right angles <b>and</b> four equal sides.', rect: 'A rectangle needs right angles (adjacent slopes multiply to ' + t('-1') + ').', rhom: 'A rhombus needs four equal sides.', para: 'Check for right angles and equal sides — a more precise name may fit.' };
    var sol = t(sd.map(function (x, i) { return 'm_{' + x + '}=' + sT(sl[i]); }).join(',\\ ')) + '<br>' + t(sd.map(function (x, i) { return x + '=' + L[i]; }).join(',\\ ')) + '<br>Opposite sides parallel; ' + (relKind(sl[0], sl[1]) === 'perp' ? 'adjacent sides perpendicular (' + t(prodT(sl[0], sl[1])) + ')' : 'adjacent sides not perpendicular (' + t(prodT(sl[0], sl[1]) + '\\ne -1') + ')') + '; ' + (L[0] === L[1] ? 'all four sides equal' : 'adjacent sides unequal') + ': a <b>' + QN[ty].toLowerCase() + '</b>.';
    return B.mc(r, prompt, ['sq', 'rect', 'rhom', 'para'].map(function (k) { return { html: '<b>' + QN[k] + '</b>', right: k === ty, why: k === ty ? null : why[k] }; }), sol, ['Slopes: parallel sides and right angles. Lengths: equal sides.'], text, true);
  }
  function quadGen(r, ty, box) {
    return gen(r, function (r) {
      var u = r.pick([[2, 4], [4, 2], [3, 4], [4, 3], [1, 3], [3, 1], [2, 3], [3, 2], [1, 2], [2, 1]]), w;
      if (r.chance(0.5)) u = [u[0], -u[1]];
      if (ty === 'sq') w = [-u[1], u[0]]; else if (ty === 'rect') { var c = r.pick([2, 0.5]); w = [-u[1] * c, u[0] * c]; if (!Number.isInteger(w[0]) || !Number.isInteger(w[1])) return null; }
      else if (ty === 'rhom') { w = r.chance(0.5) ? [u[1], u[0]] : [-u[0], u[1]]; if (w[0] * u[0] + w[1] * u[1] === 0) return null; }
      else { w = [r.int(-4, 4), r.int(2, 5)]; }
      if (u[0] * w[1] - u[1] * w[0] === 0) return null;
      var A = [r.int(-box, box), r.int(-box, box)], V = [A, add(A, u), add(add(A, u), w), add(A, w)];
      if (!V.every(function (P) { return inBox(P, box); })) return null;
      if (V.some(function (P, i) { var s = slopeOf(P, V[(i + 1) % 4]); return !s || s[0] === 0; })) return null;
      if (quadName(V) !== ty) return null;
      return V;
    }, null);
  }

  /* =============================== ASSIGNMENT =============================== */
  var QUESTIONS = [
    { num: '1', section: 'Part A — Pythagorean Theorem and Segment Lengths', parts: [
      { id: '1', level: 'BEG', make: function (r) { var tr = r.chance(0.2) ? [18, 24, 30] : (function () { var b = r.pick(TRIPLES), k = r.pick([1, 1, 2, 3, 4]), sw = r.chance(0.5); b = sw ? [b[1], b[0], b[2]] : b; return b[2] * k > 80 ? b : b.map(function (x) { return x * k; }); })(), a = tr[0], b = tr[1], c = tr[2];
        return numAns('Determine the length of the hypotenuse of a right triangle with legs ' + t(a) + ' and ' + t(b) + '.', c, [[a * a + b * b, 'len-no-root', 'That is ' + t('c^{2}') + ' — take the square root.'], [a + b, 'sum-sq', 'Square the legs before adding: ' + t('c^{2}=a^{2}+b^{2}') + '.']],
          t('c^{2}=' + a + '^{2}+' + b + '^{2}=' + a * a + '+' + b * b + '=' + c * c + '\\ \\Rightarrow\\ c=\\sqrt{' + c * c + '}=' + c), ['The hypotenuse: ' + t('c^{2}=a^{2}+b^{2}') + '.'], 'hypotenuse from legs', t('c=')); } }] },
    { num: '2', parts: [
      { id: '2', level: 'BEG', make: function (r) { var tr = r.chance(0.2) ? [12, 35, 37] : r.pick(TRIPLES), sw = r.chance(0.5), a = sw ? tr[0] : tr[1], b = sw ? tr[1] : tr[0], c = tr[2];
        return numAns('Determine the length of the missing leg of a right triangle with hypotenuse ' + t(c) + ' and one leg ' + t(b) + '.', a, [[Math.sqrt(c * c + b * b), 'u6l10-leg-add', 'For a <b>leg</b>, subtract: ' + t('a^{2}=c^{2}-b^{2}') + '.'], [c * c - b * b, 'len-no-root', 'That is ' + t('a^{2}') + ' — take the square root.'], [c - b, 'sum-sq', 'Square first: ' + t('a^{2}=' + c + '^{2}-' + b + '^{2}') + '.']],
          t('a^{2}=' + c + '^{2}-' + b + '^{2}=' + c * c + '-' + b * b + '=' + a * a + '\\ \\Rightarrow\\ a=' + a), ['The hypotenuse is given, so the missing side is a leg: ' + t('a^{2}=c^{2}-b^{2}') + '.'], 'missing leg', t('a=')); } }] },
    { num: '3', parts: [
      { id: '3', level: 'EMG', make: function (r) { var g = gen(r, function (r) { var h = r.int(12, 40), d = r.int(5, 15); if (isSq(h * h + d * d)) return null; return [h, d]; }, [20, 9]), h = g[0], d = g[1], L = Math.sqrt(h * h + d * d);
        return B.approx('A guy-wire anchors a ' + t(h) + ' m radio tower to the ground at a point ' + t(d) + ' m from the base. Determine the length of the guy-wire, to the nearest tenth of a metre.', L, 1, { after: ' m', diag: function (v) { if (Math.abs(v - (h * h + d * d)) < 0.06) return { code: 'len-no-root', hint: 'That is the square of the length — take the square root.' }; if (Math.abs(v - Math.sqrt(h * h - d * d)) < 0.06) return { code: 'u6l10-sub-sq', hint: 'The wire is the hypotenuse: <b>add</b> the squares.' }; if (near(v, h + d)) return { code: 'sum-sq', hint: 'Square the two legs before adding.' }; return null; } },
          'The tower, the ground and the wire make a right triangle; the wire is the hypotenuse:<br>' + t('c=\\sqrt{' + h + '^{2}+' + d + '^{2}}=\\sqrt{' + (h * h + d * d) + '}\\approx ' + K.roundTo(L, 1).toFixed(1)) + ' m.', ['Sketch it: the wire is the hypotenuse of a right triangle with legs ' + t(h) + ' and ' + t(d) + '.'], 'guy-wire'); } }] },
    { num: '4', parts: [
      { id: '4', level: 'BEG', make: function (r) { var y = -r.int(1, 6), x1 = -r.int(3, 12), x2 = r.int(2, 12), E = [x1, y], F = [x2, y];
        return numAns('Determine the length of the horizontal segment joining ' + nP('E', E) + ' and ' + nP('F', F) + '.', x2 - x1, [[x2 + x1, 'double-neg', 'Subtract the ' + t('x') + '-coordinates: ' + t(x2 + '-(' + x1 + ')=' + x2 + '+' + (-x1)) + '.'], [Math.abs(x1 + x2), 'double-neg', NEG_HINT]],
          'Horizontal: subtract the ' + t('x') + '-coordinates. ' + t('EF=|' + x2 + '-(' + x1 + ')|=' + (x2 - x1)) + '.', ['On a horizontal segment only ' + t('x') + ' changes: length ' + t('=|x_2-x_1|') + '.'], 'horizontal length', t('EF=')); } }] },
    { num: '5', parts: [
      { id: '5', level: 'BEG', make: function (r) { var x = -r.int(1, 8), y1 = r.int(3, 12), y2 = -r.int(2, 9), G = [x, y1], H = [x, y2];
        return numAns('Determine the length of the vertical segment joining ' + nP('G', G) + ' and ' + nP('H', H) + '.', y1 - y2, [[y1 + y2, 'double-neg', 'Subtract the ' + t('y') + '-coordinates: ' + t(y1 + '-(' + y2 + ')=' + y1 + '+' + (-y2)) + '.']],
          'Vertical: subtract the ' + t('y') + '-coordinates. ' + t('GH=|' + y1 + '-(' + y2 + ')|=' + (y1 - y2)) + '.', ['On a vertical segment only ' + t('y') + ' changes.'], 'vertical length', t('GH=')); } }] },
    { num: '6', section: 'Part B — The Distance Formula', parts: [
      { id: '6', level: 'BEG', make: function (r) { var g = gen(r, function (r) { var tr = r.pick(TRIPLES.slice(0, 5)), v = r.chance(0.5) ? [tr[0], tr[1]] : [tr[1], tr[0]], A = [r.int(-4, 4), r.int(-4, 3)], Bq = add(A, v); if (!inBox(Bq, 16)) return null; return [A, Bq]; }, [[2, 1], [7, 13]]);
        var p = B.math('Determine the exact distance between ' + nP('A', g[0]) + ' and ' + nP('B', g[1]) + '.', exactChk(d2(g[0], g[1]), distDiag(g[0], g[1])), radT(d2(g[0], g[1])), distSteps(g[0], g[1], 'AB'), ['Distance formula: ' + t('d=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}') + '.'], 'exact distance (whole number)', { keys: 'radical', before: t('AB=') });
        p.bad = [String(d2(g[0], g[1]))]; return p; } }] },
    { num: '7', parts: [
      { id: '7', level: 'EMG', make: function (r) { var g = gen(r, function (r) { var v = [r.int(2, 8) * (r.chance(0.5) ? 1 : -1), r.int(2, 8) * (r.chance(0.5) ? 1 : -1)], n = v[0] * v[0] + v[1] * v[1], s = simp(n); if (s[0] === 1 || s[1] === 1) return null; var C = [r.int(-7, -1), r.int(-3, 5)], D = add(C, v); if (!inBox(D, 12)) return null; return [C, D]; }, [[-6, 2], [0, -4]]), n = d2(g[0], g[1]);
        var p = B.math('Determine the exact distance, as a simplified mixed radical, between ' + nP('C', g[0]) + ' and ' + nP('D', g[1]) + '.', exactChk(n, distDiag(g[0], g[1])), radT(n), distSteps(g[0], g[1], 'CD'), ['Distance formula, then simplify: take the largest perfect square out of the radical.'], 'distance as a mixed radical', { keys: 'radical', before: t('CD=') });
        p.bad = ['\\sqrt{' + n + '}', String(n)]; return p; } }] },
    { num: '8', parts: [
      { id: '8', level: 'EMG', make: function (r) { var g = gen(r, function (r) { var tr = r.pick(TRIPLES.slice(0, 6)), v = r.chance(0.5) ? [tr[0], tr[1]] : [tr[1], tr[0]], A = [-r.int(1, 6), r.int(-4, 4)], Bq = add(A, v); if (!inBox(Bq, 20)) return null; return { A: A, B: Bq, d: tr[2] }; }, { A: [-3, 2], B: [9, 11], d: 15 }), sc = r.pick([100, 100, 50, 10, 200]);
        return numAns('A delivery drone flies from a warehouse at ' + t(ptT(g.A)) + ' to a depot at ' + t(ptT(g.B)) + ' on a city grid, where each grid unit represents ' + t(sc) + ' m. Determine the real-world distance from the warehouse to the depot.', g.d * sc, [[g.d, 'u6l10-scale', 'That is the distance in grid units — multiply by ' + t(sc) + ' m per unit.'], [d2(g.A, g.B) * sc, 'len-no-root', 'Take the square root before scaling.']],
          distSteps(g.A, g.B, 'd') + ' units, so the drone flies ' + t(g.d + '\\times ' + sc + '=' + g.d * sc) + ' m.', ['Find the distance in grid units, then multiply by the scale.'], 'drone distance', null, ' m'); } }] },
    { num: '9', section: 'Part C — Midpoint, Missing Endpoints, and Slope', parts: [
      { id: '9', level: 'BEG', make: function (r) { var g = gen(r, function (r) { var J = [-r.int(2, 9), r.int(1, 8)], Kq = [r.int(2, 10), -r.int(2, 12)]; if ((J[0] + Kq[0]) % 2 || (J[1] + Kq[1]) % 2) return null; return [J, Kq]; }, [[-7, 4], [9, -10]]);
        var p = B.math('Determine the coordinates of the midpoint of the segment joining ' + nP('J', g[0]) + ' and ' + nP('K', g[1]) + '.', midChk(g[0], g[1]), pT(midOf(g[0], g[1])), midSol(g[0], g[1], 'M'), ['Average the ' + t('x') + '-coordinates and average the ' + t('y') + '-coordinates.'], 'midpoint', { keys: 'pairs', placeholder: 'e.g. (3, -2)' });
        p.bad = sameP([g[0][0] + g[1][0], g[0][1] + g[1][1]], midOf(g[0], g[1])) ? [] : [pT([g[0][0] + g[1][0], g[0][1] + g[1][1]])]; return p; } }] },
    { num: '10', parts: [
      { id: '10', level: 'EMG', make: function (r) { var g = gen(r, function (r) { var L = [r.int(10, 60) / 10, -r.int(10, 50) / 10], N = [r.int(40, 99) / 10, r.int(20, 90) / 10]; var M = midOf(L, N); if (!Number.isInteger(Math.round(M[0] * 100)) || Math.abs(M[0] * 10 - Math.round(M[0] * 10)) > 1e-9 || Math.abs(M[1] * 10 - Math.round(M[1] * 10)) > 1e-9) return null; return [L, N]; }, [[3.4, -2.6], [8.6, 7.4]]);
        var p = B.math('Determine the coordinates of the midpoint of the segment joining ' + nP('L', g[0]) + ' and ' + nP('N', g[1]) + '.', midChk(g[0], g[1]), pT(midOf(g[0], g[1])), midSol(g[0], g[1], 'M'), ['Average the ' + t('x') + '-coordinates and average the ' + t('y') + '-coordinates. Decimals work the same way.'], 'midpoint with decimals', { keys: 'pairs', placeholder: 'e.g. (3, -2.5)' });
        p.bad = [pT([cl(g[0][0] + g[1][0]), cl(g[0][1] + g[1][1])])]; return p; } }] },
    { num: '11', parts: [
      { id: '11', level: 'PRG', make: function (r) { var g = gen(r, function (r) { var P = [-r.int(3, 10), r.int(-4, 3)], M = [r.int(-3, 2), r.int(2, 8)], Q = [2 * M[0] - P[0], 2 * M[1] - P[1]]; if (!inBox(Q, 14) || sameP(P, M)) return null; return { P: P, M: M, Q: Q }; }, { P: [-9, 1], M: [-2, 6], Q: [5, 11] });
        var p = B.math(nP('M', g.M) + ' is the midpoint of segment ' + t('\\overline{PQ}') + '. If ' + nP('P', g.P) + ', determine the coordinates of ' + t('Q') + '.', endChk(g.P, g.M), pT(g.Q),
          'From ' + t('P') + ' to ' + t('M') + ': ' + t('x') + ' changes by ' + t(g.M[0] - g.P[0]) + ' and ' + t('y') + ' by ' + t(g.M[1] - g.P[1]) + '. Do the same again from ' + t('M') + ': ' + t('Q=(' + g.M[0] + '+' + nb(g.M[0] - g.P[0]) + ',\\ ' + g.M[1] + '+' + nb(g.M[1] - g.P[1]) + ')=' + ptT(g.Q)) + '.', ['The midpoint is halfway: the step from ' + t('P') + ' to ' + t('M') + ' is repeated from ' + t('M') + ' to ' + t('Q') + '.'], 'missing endpoint', { keys: 'pairs', placeholder: 'e.g. (3, -2)' });
        p.bad = [pT(midOf(g.P, g.M)), pT([g.M[0] - g.P[0], g.M[1] - g.P[1]])]; return p; } }] },
    { num: '12', parts: [
      { id: '12', level: 'PRG', make: function (r) { var g = gen(r, function (r) { var A = [-r.int(2, 8), r.int(4, 12)], Bq = [r.int(10, 24), -r.int(2, 10)]; if ((A[0] + Bq[0]) % 2 || (A[1] + Bq[1]) % 2) return null; return [A, Bq]; }, [[-4, 10], [22, -6]]), sc = r.pick([20, 20, 10, 50]), M = midOf(g[0], g[1]), east = (M[0] - g[0][0]) * sc, south = (g[0][1] - M[1]) * sc;
        return multi('Two community centres are located at ' + t(ptT(g[0])) + ' and ' + t(ptT(g[1])) + ' on a town-planning grid, where each grid unit represents ' + t(sc) + ' m. A new playground will be built exactly halfway between them. Determine the coordinates of the playground, and how far east and how far south it is from the first community centre (in metres).',
          [ptBox('Playground:', M, midChk(g[0], g[1])), numBox('East (m):', east, [[east / sc, 'u6l10-scale', 'That is in grid units — multiply by ' + t(sc) + ' m.'], [2 * east, 'u6l10-whole', 'That is the whole way to the second centre. The playground is halfway.']]), numBox('South (m):', south, [[south / sc, 'u6l10-scale', 'That is in grid units — multiply by ' + t(sc) + ' m.'], [2 * south, 'u6l10-whole', 'That is the whole way. The playground is halfway.']])],
          midSol(g[0], g[1], 'M') + '<br>East: ' + t(nT(M[0]) + '-' + nb(g[0][0]) + '=' + (M[0] - g[0][0])) + ' units ' + t('=' + east) + ' m. South: ' + t(g[0][1] + '-' + nb(M[1]) + '=' + (g[0][1] - M[1])) + ' units ' + t('=' + south) + ' m.', ['Midpoint first. Then compare it with the first centre: the change in ' + t('x') + ' is east, the drop in ' + t('y') + ' is south.', 'Multiply grid units by ' + t(sc) + ' m.'], 'playground midpoint and directions',
          [[pT(M), String(east / sc), String(south / sc)]]); } }] },
    { num: '13', parts: [
      { id: '13', level: 'BEG', make: function (r) { var g = gen(r, function (r) { var q = r.int(2, 4), p = r.int(1, 3); if (gcd(p, q) !== 1 || p >= q) return null; var P = [-r.int(2, 6), -r.int(2, 5)], j = r.int(2, 4), Q = add(P, [q * j, p * j]); return inBox(Q, 12) ? [P, Q] : null; }, [[-5, -4], [7, 2]]), s = slopeOf(g[0], g[1]);
        return slopeAns('Determine the slope of the segment joining ' + nP('P', g[0]) + ' and ' + nP('Q', g[1]) + '.', s, slopeChk(s, dnDiag(g[0], g[1])), t(calc(g[0], g[1], 'PQ')), [SLOPE_HINT, NEG_HINT], 'slope', t('m_{PQ}=')); } }] },
    { num: '14', parts: [
      { id: '14', level: 'EMG', make: function (r) { var g = gen(r, function (r) { var m = r.int(2, 4) * (r.chance(0.8) ? 1 : -1), R = [r.int(2, 6), r.int(3, 10)], q = r.int(2, 4), S = add(R, [-q * 2, -m * q * 2]); if (!inBox(S, 12) || S[0] >= 0) return null; return [R, S]; }, [[4, 9], [-2, -3]]), s = slopeOf(g[0], g[1]);
        return slopeAns('Determine the slope of the segment joining ' + nP('R', g[0]) + ' and ' + nP('S', g[1]) + '.', s, slopeChk(s, dnDiag(g[0], g[1])), t(calc(g[0], g[1], 'RS')) + ' (two negatives divide to a positive' + (sV(s) < 0 ? '; here only one is negative' : '') + ').', [SLOPE_HINT, 'Subtracting in the order ' + t('S-R') + ' on both the top and the bottom works too.'], 'slope, listed right to left', t('m_{RS}=')); } }] },
    { num: '15', parts: [
      { id: '15', level: 'BEG', make: function (r) { var g = gen(r, function (r) { var x = r.pick([[1.2, 9.6], [0.5, 6], [0.9, 7.2], [0.6, 4.8], [1.5, 12], [0.8, 10], [1, 12.5], [0.75, 6], [1.1, 8.8], [0.4, 5], [0.3, 2.4], [0.7, 5.6], [1.4, 11.2], [0.6, 7.5], [0.9, 11.25], [1.2, 15], [0.45, 3.6], [0.5, 4], [1.6, 12.8], [0.36, 4.5], [0.25, 2], [0.6, 8], [0.9, 6], [1.8, 14.4], [0.42, 5.6]]); var q = x[0] / x[1]; return Math.abs(q * 10000 - Math.round(q * 10000)) < 1e-6 ? x : null; }, [1.2, 9.6]), m = Math.round(g[0] / g[1] * 100000) / 100000;
        return B.number('A wheelchair ramp rises ' + t(g[0]) + ' m over a horizontal run of ' + t(g[1]) + ' m. Determine the slope of the ramp as a decimal.', m, function (v) { if (Math.abs(v - g[1] / g[0]) < 1e-6) return { code: 'slope-flip', hint: 'Slope is rise ÷ run, not run ÷ rise.' }; if (Math.abs(v * 100 - m * 100) < 1e-6 || Math.abs(v - m * 100) < 1e-6) return { code: 'u6l10-pct', hint: 'Give the slope as a decimal, not a percent.' }; return null; },
          t('m=\\frac{\\text{rise}}{\\text{run}}=\\frac{' + g[0] + '}{' + g[1] + '}=' + m), ['Slope = rise ÷ run.'], 'ramp slope as a decimal', { before: t('m=') }); } }] },
    { num: '16', section: 'Part D — Types of Slope, Collinearity, Parallel and Perpendicular', stem: 'Classify the slope of the segment as positive, negative, zero, or undefined.', parts: [
      { id: '16', level: 'LIM', make: function (r) { var A = [-r.int(2, 8), r.int(-3, 5)], Bq = [r.int(1, 8), 0]; Bq[1] = A[1] + r.int(2, 8) * (r.chance(0.6) ? 1 : -1); return kindMC(r, nP('A', A) + ' and ' + nP('B', Bq), slopeOf(A, Bq), t(calc(A, Bq, 'AB')) + '.', 'type of slope'); } }] },
    { num: '17', stem: 'Classify the slope of the segment as positive, negative, zero, or undefined.', parts: [
      { id: '17', level: 'LIM', make: function (r) { var y = r.int(-8, 8), C = [-r.int(1, 8), y], D = [r.int(1, 9), y]; return kindMC(r, nP('C', C) + ' and ' + nP('D', D), [0, 1], t(calc(C, D, 'CD')) + '.', 'zero slope'); } }] },
    { num: '18', stem: 'Classify the slope of the segment as positive, negative, zero, or undefined.', parts: [
      { id: '18', level: 'LIM', make: function (r) { var x = r.int(-9, 9), E = [x, r.int(1, 8)], F = [x, -r.int(1, 9)]; return kindMC(r, nP('E', E) + ' and ' + nP('F', F), null, t(calc(E, F, 'EF')) + '.', 'undefined slope'); } }] },
    { num: '19', shared: function (r) {
        var coll = r.chance(0.7);
        return gen(r, function (r) { var q = r.int(2, 6), p = r.int(1, 7); if (gcd(p, q) !== 1 || p === q) return null; var G = [-r.int(4, 8), -r.int(4, 8)], H = add(G, [q, p]), c = r.int(2, 3), I = add(H, [q * c, p * c]); if (!coll) I = [I[0], I[1] + r.pick([-1, 1])]; if (!inBox(I, 16) || H[0] > 3) return null; return { P: [G, H, I], coll: coll }; }, { P: [[-6, -7], [-1, -1], [9, 11]], coll: true });
      },
      stem: function (s) { return 'Determine whether the points ' + nP('G', s.P[0]) + ', ' + nP('H', s.P[1]) + ' and ' + nP('I', s.P[2]) + ' are collinear.'; },
      parts: [
        { id: '19', sub: 'i', level: 'EMG', make: function (r, s) { return slopeFields('Find ' + t('m_{GH}') + ' and ' + t('m_{HI}') + '.', [{ nm: 'GH', A: s.P[0], B: s.P[1] }, { nm: 'HI', A: s.P[1], B: s.P[2] }], null, [SLOPE_HINT], 'collinear test'); } },
        { id: '19v', sub: 'ii', level: 'BEG', make: function (r, s) { var a = slopeOf(s.P[0], s.P[1]), b = slopeOf(s.P[1], s.P[2]);
          return B.mc(r, 'Are ' + t('G') + ', ' + t('H') + ' and ' + t('I') + ' collinear?', [
            { html: '<b>Collinear</b> — ' + t('m_{GH}=m_{HI}') + ' and the segments share ' + t('H') + '.', right: s.coll, why: s.coll ? null : t(sT(a) + '\\ne ' + sT(b)) + ': the path bends at ' + t('H') + '.' },
            { html: '<b>Not collinear</b> — the slopes are different.', right: !s.coll, why: s.coll ? 'Reduce both slopes: they are equal.' : null },
            { html: '<b>Collinear</b> — the slopes are very close.', why: 'Close isn’t equal.' }],
            t('m_{GH}=' + sT(a)) + ', ' + t('m_{HI}=' + sT(b)) + (s.coll ? ': equal, sharing ' + t('H') + ' — <b>collinear</b>.' : ': not equal — <b>not collinear</b>.'), ['Equal slopes through a shared point: collinear.'], 'collinear verdict'); } }] },
    { num: '20', parts: [
      { id: '20', level: 'EMG', make: function (r) { var g = gen(r, function (r) { var q = r.int(2, 5), p = r.int(1, 4) * (r.chance(0.8) ? 1 : -1); if (gcd(Math.abs(p), q) !== 1) return null; var J = [-r.int(1, 5), r.int(-2, 4)], Kp = add(J, [q, p]), c = r.int(2, 3), L = add(Kp, [q * c, p * c]); return inBox(L, 16) ? { J: J, K: Kp, L: L, s: red(p, q), c: c } : null; }, { J: [-3, 2], K: [1, 5], L: [9, 11], s: [3, 4], c: 2 }), rise = g.L[1] - g.K[1], run = g.L[0] - g.K[0];
        return numAns('The points ' + nP('J', g.J) + ', ' + nP('K', g.K) + ' and ' + t('L(' + g.L[0] + ',\\ q)') + ' are collinear. Determine the value of ' + t('q') + '.', g.L[1], [[rise, 'k-no-start', 'That is the rise from ' + t('K') + ' to ' + t('L') + ' — add the height of ' + t('K') + '.'], [g.K[1] - rise, 'k-sign', 'Check the sign as you solve.'], [g.K[1] + run, 'k-flip', 'The rise is slope × run.']],
          t(calc(g.J, g.K, 'JK')) + '; ' + t('\\frac{q-' + nb(g.K[1]) + '}{' + run + '}=' + sT(g.s) + '\\ \\Rightarrow\\ q-' + nb(g.K[1]) + '=' + rise + '\\ \\Rightarrow\\ q=' + g.L[1]) + '.', ['Find ' + t('m_{JK}') + '; then ' + t('m_{KL}') + ' must equal it.'], 'collinear: find q', t('q=')); } }] },
    { num: '21', shared: function (r) {
        var k = r.chance(0.5) ? 'par' : r.pick(['perp', 'nei', 'par']);
        var a = gen(r, function (r) { var s = r.pick([[1, 1], [1, 2], [2, 1], [-1, 1], [2, 3], [-3, 2], [3, 4]]), b = k === 'par' ? s : k === 'perp' ? perpOf(s) : red(s[1], s[0]); if (relKind(s, b) !== k) return null; var A = [r.int(-6, -2), r.int(-5, 0)], P1 = add(A, [s[1], s[0]], r.int(2, 4)), C = [r.int(-3, 1), r.int(3, 7)], P2 = add(C, [b[1], b[0]], r.int(2, 4)); if (!inBox(P1, 14) || !inBox(P2, 16) || onLine(A, P1, C)) return null; return { P: [A, P1, C, P2], a: s, b: b }; }, { P: [[-5, -3], [3, 5], [-2, 6], [6, 14]], a: [1, 1], b: [1, 1] });
        return a;
      },
      stem: function (s) { return 'Segment ' + t('AB') + ' joins ' + nP('A', s.P[0]) + ' and ' + nP('B', s.P[1]) + '. Segment ' + t('CD') + ' joins ' + nP('C', s.P[2]) + ' and ' + nP('D', s.P[3]) + '. Are ' + t('AB') + ' and ' + t('CD') + ' parallel, perpendicular, or neither?'; },
      parts: [
        { id: '21', sub: 'i', level: 'BEG', make: function (r, s) { return slopeFields('Find both slopes.', [{ nm: 'AB', A: s.P[0], B: s.P[1] }, { nm: 'CD', A: s.P[2], B: s.P[3] }], null, [SLOPE_HINT], 'two slopes'); } },
        { id: '21v', sub: 'ii', level: 'BEG', make: function (r, s) { return relMC(r, 'Parallel, perpendicular, or neither?', s.a, s.b, relSol(s.a, s.b), 'classify the pair'); } }] },
    { num: '22', shared: function (r) {
        var perp = r.chance(0.7);
        return gen(r, function (r) { var s = r.pick([[-4, 3], [-3, 4], [-2, 3], [-3, 2], [-1, 2], [-5, 2]]), b = perp ? perpOf(s) : red(-s[1] + 1, s[0] < 0 ? -s[0] : s[0]); if (!perp && relKind(s, b) === 'perp') return null; var E = [-r.int(2, 6), r.int(2, 6)], F = add(E, [s[1], s[0]], r.int(1, 2)), G = [-r.int(0, 3), -r.int(1, 5)], H = add(G, [b[1], b[0]], r.int(1, 2)); if (!inBox(F, 12) || !inBox(H, 12) || b[0] === 0) return null; return { P: [E, F, G, H], a: s, b: b, perp: perp }; }, { P: [[-4, 5], [2, -3], [-1, -2], [7, 4]], a: [-4, 3], b: [3, 4], perp: true });
      },
      stem: function (s) { return 'Segment ' + t('EF') + ' joins ' + nP('E', s.P[0]) + ' and ' + nP('F', s.P[1]) + '. Segment ' + t('GH') + ' joins ' + nP('G', s.P[2]) + ' and ' + nP('H', s.P[3]) + '. Are ' + t('EF') + ' and ' + t('GH') + ' perpendicular?'; },
      parts: [
        { id: '22', sub: 'i', level: 'EMG', make: function (r, s) { return slopeFields('Find both slopes and their product.', [{ nm: 'EF', A: s.P[0], B: s.P[1] }, { nm: 'GH', A: s.P[2], B: s.P[3] }], null, [SLOPE_HINT, 'Multiply: top × top, bottom × bottom.'], 'slopes and product', { prod: true }); } },
        { id: '22v', sub: 'ii', level: 'BEG', make: function (r, s) { var pp = relKind(s.a, s.b) === 'perp';
          return B.mc(r, 'Are ' + t('EF') + ' and ' + t('GH') + ' perpendicular?', [{ html: '<b>Yes</b> — the product of the slopes is ' + t('-1') + '.', right: pp, why: pp ? null : 'The product is ' + t(frT(prod(s.a, s.b)[0], prod(s.a, s.b)[1])) + ', not ' + t('-1') + '.' }, { html: '<b>No</b> — the product is not ' + t('-1') + '.', right: !pp, why: pp ? 'Multiply again: ' + t(prodT(s.a, s.b)) + '.' : null }, { html: '<b>Yes</b> — one slope is positive and the other negative.', why: 'Opposite signs aren’t enough: the product must be exactly ' + t('-1') + '.' }],
            t(prodT(s.a, s.b)) + (pp ? ': <b>perpendicular</b>.' : ': <b>not</b> perpendicular.'), [REL_HINT], 'perpendicular verdict'); } }] },
    { num: '23', parts: [
      { id: '23', level: 'BEG', make: function (r) { var m = gen(r, function (r) { var p = r.int(1, 8), q = r.int(2, 9); return gcd(p, q) === 1 && p !== q ? [r.chance(0.7) ? -p : p, q] : null; }, [-2, 7]), pp = perpOf(m);
        return slopeAns('Determine the slope of a line that is perpendicular to a segment with slope ' + t(sT(m)) + '.', pp, relChk(m, 'perp'), 'Flip ' + t(sT(m)) + ' and change the sign: ' + t(sT(pp)) + ' (check: ' + t(prodT(m, pp)) + ').', ['Perpendicular: the negative reciprocal — flip it and change the sign.'], 'perpendicular slope', t('m_{\\perp}=')); } }] },
    /* ---------------- Q24 ---------------- */
    { num: '24', section: 'Part E — Mixed Review', shared: function (r) {
        return gen(r, function (r) { var u = r.pick([[3, 4], [4, 3], [6, 8], [2, 1], [1, 2], [3, 1], [1, 3], [2, 3], [3, 2]]), s = r.int(1, 2), tt = r.chance(0.6) ? s : r.int(1, 2); if (u[0] > 4 && (s > 1 || tt > 1)) return null; var Bv = [r.int(-2, 4), r.int(-2, 4)], A = add(Bv, [-u[0] * s, -u[1] * s]), C = add(Bv, [-u[1] * tt, u[0] * tt]); if (!inBox(A, 10) || !inBox(C, 10) || (A[0] + C[0]) % 2 || (A[1] + C[1]) % 2) return null; return { A: A, B: Bv, C: C }; }, { A: [-3, -5], B: [3, 3], C: [-5, 9] });
      },
      stem: function (s) { return 'Triangle ' + t('ABC') + ' has vertices ' + nP('A', s.A) + ', ' + nP('B', s.B) + ' and ' + nP('C', s.C) + '.'; },
      parts: [
        { id: '24a', level: 'EMG', make: function (r, s) { return slopeFields('(a) Find the slope of ' + t('AB') + ' and of ' + t('BC') + ', and their product, to show that angle ' + t('B') + ' is a right angle.', [{ nm: 'AB', A: s.A, B: s.B }, { nm: 'BC', A: s.B, B: s.C }], t(calc(s.A, s.B, 'AB')) + '<br>' + t(calc(s.B, s.C, 'BC')) + '<br>' + t(prodT(slopeOf(s.A, s.B), slopeOf(s.B, s.C))) + ', so ' + t('AB\\perp BC') + ': ' + t('\\angle B=90^{\\circ}') + '.', [SLOPE_HINT], 'right angle at B', { prod: true }); } },
        { id: '24b', level: 'EMG', make: function (r, s) { return multi('(b) Determine the length of each side of the triangle using the distance formula (exact values).', [lenBox('AB', s.A, s.B, true), lenBox('BC', s.B, s.C, true), lenBox('AC', s.A, s.C, true)], [distSteps(s.A, s.B, 'AB'), distSteps(s.B, s.C, 'BC'), distSteps(s.A, s.C, 'AC')].join('<br>'), ['Distance formula for each side, then simplify.'], 'three side lengths', [[String(d2(s.A, s.B)), String(d2(s.B, s.C)), String(d2(s.A, s.C))]]); } },
        { id: '24c', level: 'EMG', make: function (r, s) { var p = B.math('(c) Determine the midpoint of the hypotenuse, ' + t('AC') + '.', midChk(s.A, s.C), pT(midOf(s.A, s.C)), midSol(s.A, s.C, 'M') + ' (' + t('AC') + ' is the hypotenuse: it is opposite the right angle at ' + t('B') + ').', ['The hypotenuse is opposite the right angle. Average its endpoints.'], 'midpoint of the hypotenuse', { keys: 'pairs', placeholder: 'e.g. (3, -2)' }); p.bad = [pT(midOf(s.A, s.B))]; return p; } }] },
    /* ---------------- Q25 ---------------- */
    { num: '25', shared: function (r) {
        var ty = r.chance(0.4) ? 'sq' : r.pick(['rect', 'rhom', 'para', 'sq']); return quadGen(r, ty, 8) || [[-7, -3], [-3, 5], [5, 1], [1, -7]];
      },
      stem: function (V) { return 'Quadrilateral ' + t('EFGH') + ' has vertices ' + ['E', 'F', 'G', 'H'].map(function (n, i) { return nP(n, V[i]); }).join(', ') + '. Determine the slope and length of each side, and identify the most precise name for ' + t('EFGH') + '.'; },
      parts: [
        { id: '25a', sub: 'slopes', level: 'EMG', make: function (r, V) { var nm = ['EF', 'FG', 'GH', 'HE']; return slopeFields('Find the slope of each side.', nm.map(function (x, i) { return { nm: x, A: V[i], B: V[(i + 1) % 4] }; }), null, [SLOPE_HINT], 'four slopes'); } },
        { id: '25b', sub: 'lengths', level: 'EMG', make: function (r, V) { var nm = ['EF', 'FG', 'GH', 'HE']; return multi('Find the length of each side (exact, or to the nearest tenth).', nm.map(function (x, i) { return lenBox(x, V[i], V[(i + 1) % 4], false); }), nm.map(function (x, i) { return distSteps(V[i], V[(i + 1) % 4], x); }).join('<br>'), ['Distance formula for each side.'], 'four lengths', [nm.map(function (x, i) { return String(d2(V[i], V[(i + 1) % 4])); })]); } },
        { id: '25c', sub: 'name', level: 'PRG', make: function (r, V) { return nameMC(r, 'What is the most precise name for ' + t('EFGH') + '?', V, ['E', 'F', 'G', 'H'], 'name the quadrilateral'); } }] },
    /* ---------------- Q26 ---------------- */
    { num: '26', shared: function (r) {
        return gen(r, function (r) { var s = r.pick([[-3, 2], [-2, 3], [3, 2], [-4, 3], [2, 5], [-5, 2], [3, 4]]), L = [-r.int(2, 6), r.int(1, 8)], M = add(L, [s[1], s[0]], 2 * (s[1] < 3 ? 2 : 1)); var J = [-r.int(3, 7), r.int(-4, 2)], run = s[1] * r.int(2, 5), K0 = J[0] + run, q = J[1] + s[0] * run / s[1]; if (!inBox(M, 14) || Math.abs(q) > 25 || K0 > 12) return null; return { J: J, x: K0, q: q, L: L, M: M, s: s }; }, { J: [-6, -2], x: 4, q: -17, L: [-5, 7], M: [3, -5], s: [-3, 2] });
      },
      stem: function (s) { return 'Segment ' + t('JK') + ' joins ' + nP('J', s.J) + ' and ' + t('K(' + s.x + ',\\ q)') + '. Segment ' + t('LM') + ' joins ' + nP('L', s.L) + ' and ' + nP('M', s.M) + '.'; },
      parts: [
        { id: '26a', level: 'PRG', make: function (r, s) { var run = s.x - s.J[0], rise = s.q - s.J[1];
          return numAns('(a) Determine the value of ' + t('q') + ' so that ' + t('JK\\parallel LM') + '.', s.q, [[s.J[1] + sV(perpOf(s.s)) * run, 'k-perp-par', 'That makes ' + t('JK') + ' perpendicular. Parallel: the <b>same</b> slope.'], [rise, 'k-no-start', 'That is the rise — add the height of ' + t('J') + '.'], [s.J[1] - rise, 'k-sign', 'Check the sign.']],
            t(calc(s.L, s.M, 'LM')) + '; ' + t('\\frac{q-' + nb(s.J[1]) + '}{' + s.x + '-' + nb(s.J[0]) + '}=' + sT(s.s) + '\\ \\Rightarrow\\ q-' + nb(s.J[1]) + '=' + sT(s.s) + '\\times ' + run + '=' + rise + '\\ \\Rightarrow\\ q=' + s.q) + '.', ['Find ' + t('m_{LM}') + '; parallel means ' + t('m_{JK}') + ' is the same.'], 'parallel: find q', t('q=')); } },
        { id: '26b', level: 'EMG', make: function (r, s) { var K2 = [s.x, s.q], n = d2(s.J, K2);
          var p = B.math('(b) With ' + t('K(' + s.x + ',\\ ' + s.q + ')') + ', determine the exact length of ' + t('JK') + '.', exactChk(n, distDiag(s.J, K2)), radT(n), distSteps(s.J, K2, 'JK'), ['Distance formula, then simplify the radical.'], 'exact length JK', { keys: 'radical', before: t('JK=') });
          p.bad = [String(n)]; return p; } }] }
  ];

  /* =============================== EXTRA PRACTICE =============================== */
  function vecGen(r, o) { return gen(r, function (r) { var q = r.int(1, o.q || 5), p = r.int(1, o.p || 5) * (r.chance(o.neg || 0.4) ? -1 : 1); if (gcd(Math.abs(p), q) !== 1) return null; return [q, p]; }, [3, 2]); }
  function figQuad(V, N, color) { return graphOf({ x: [-6, 6], y: [-6, 6], grid: 1, labels: 2, max: 320, segs: [{ pts: V.concat([V[0]]), color: color }], points: V.map(function (P, i) { return lbl(P, N[i]); }), aria: 'quadrilateral' }); }
  function figPath(V, N) { return graphOf({ x: [-6, 6], y: [-6, 6], grid: 1, labels: 2, max: 320, segs: [{ pts: V, color: '#c4532a' }], points: V.map(function (P, i) { return lbl(P, N[i]); }), aria: 'three vertices' }); }
  function tfGrid(prompt, rows, sol, hints, text) {
    var want = {}; rows.forEach(function (x) { want[x.id] = x.truth ? 't' : 'f'; });
    return B.grid(prompt, rows.map(function (x) { return { id: x.id, html: '(' + x.id + ') ' + x.html }; }), [{ id: 't', html: 'True' }, { id: 'f', html: 'False' }], want, { why: function (row) { return rows.filter(function (x) { return x.id === row; })[0].why; } }, sol, hints, text);
  }

  var EXTRA = [
    /* ---------------- EP1 ---------------- */
    { num: '1', section: 'Extra Practice A — Lengths and Midpoints', shared: function (r) {
        return gen(r, function (r) { var tr = r.pick([[4, 3], [3, 4], [8, 6], [6, 8], [12, 5], [4, 2], [6, 3], [2, 4]]), sg = r.chance(0.7) ? 1 : -1, j = r.int(1, 2), run = tr[0] * 2 * j, rise = sg * tr[1] * 2 * j; if (run > 20 || Math.abs(rise) > 20) return null; var M = [r.int(-3, 4), r.int(-3, 5)], A = [M[0] - run / 2, M[1] - rise / 2], Bq = [M[0] + run / 2, M[1] + rise / 2]; return { M: M, A: A, B: Bq, s: red(rise, run), run: run, rise: rise }; }, { M: [2, 3], A: [-6, -3], B: [10, 9], s: [3, 4], run: 16, rise: 12 });
      },
      stem: function (s) { return '<b>Working backwards.</b> The midpoint of segment ' + t('AB') + ' is ' + nP('M', s.M) + '. The slope of ' + t('AB') + ' is ' + t(sT(s.s)) + ', and the ' + t('x') + '-coordinate of ' + t('A') + ' is ' + t(s.A[0]) + '.'; },
      parts: [
        { id: 'e1a', level: 'PRG', make: function (r, s) { return multi('(a) Use the midpoint formula to find the ' + t('x') + '-coordinate of ' + t('B') + ', and state the run of ' + t('AB') + '.', [numBox(t('x_B='), s.B[0], [[s.M[0] - s.A[0], 'u6l10-end-diff', 'That is only the step from ' + t('A') + ' to ' + t('M') + '. Add it again past ' + t('M') + '.'], [(s.M[0] + s.A[0]) / 2, 'u6l10-end-avg', 'The midpoint is halfway: ' + t('\\frac{x_A+x_B}{2}=' + s.M[0]) + ', so ' + t('x_B=2(' + s.M[0] + ')-(' + s.A[0] + ')') + '.']]), numBox('Run:', s.run, [[s.run / 2, 'u6l10-half-run', 'That is the run from ' + t('A') + ' to ' + t('M') + ' — the run of ' + t('AB') + ' is twice that.']])],
          t('\\frac{' + s.A[0] + '+x_B}{2}=' + s.M[0] + '\\ \\Rightarrow\\ x_B=2(' + s.M[0] + ')-' + nb(s.A[0]) + '=' + s.B[0]) + '; run ' + t('=' + s.B[0] + '-' + nb(s.A[0]) + '=' + s.run) + '.', ['The midpoint’s ' + t('x') + ' is the average of ' + t('x_A') + ' and ' + t('x_B') + '.'], 'x_B and the run'); } },
        { id: 'e1b', level: 'ADV', make: function (r, s) { return multi('(b) Use the slope to find the rise, then find the two ' + t('y') + '-coordinates. (They must average to ' + t(s.M[1]) + '.)', [numBox(t('y_A='), s.A[1], [[s.M[1] - s.rise, 'u6l10-half-run', 'From ' + t('A') + ' to ' + t('M') + ' is only <b>half</b> the rise.']]), numBox(t('y_B='), s.B[1], [[s.M[1] + s.rise, 'u6l10-half-run', 'From ' + t('M') + ' to ' + t('B') + ' is only <b>half</b> the rise.']])],
          'Rise ' + t('=' + sT(s.s) + '\\times ' + s.run + '=' + s.rise) + '. Half of it on each side of ' + t('M') + ': ' + t('y_A=' + s.M[1] + '-' + nb(s.rise / 2) + '=' + s.A[1]) + ', ' + t('y_B=' + s.M[1] + '+' + nb(s.rise / 2) + '=' + s.B[1]) + ' (average ' + t(s.M[1]) + ' ✓).', ['Rise = slope × run. ' + t('M') + ' is halfway, so half the rise is on each side of it.'], 'y-coordinates from the slope'); } },
        { id: 'e1c', level: 'EMG', make: function (r, s) { var n = d2(s.A, s.B); var p = B.math('(c) With ' + nP('A', s.A) + ' and ' + nP('B', s.B) + ', find the exact length of ' + t('AB') + '.', exactChk(n, distDiag(s.A, s.B)), radT(n), distSteps(s.A, s.B, 'AB'), ['Distance formula.'], 'length AB', { keys: 'radical', before: t('AB=') }); p.bad = [String(n)]; return p; } }] },
    /* ---------------- EP2 ---------------- */
    { num: '2', shared: function (r) { return gen(r, function (r) { var v = vecGen(r, { q: 6, p: 5, neg: 0.7 }), j = r.int(1, 2), A = [-r.int(2, 6), r.int(-1, 5)], M = add(A, v, j), Bq = add(M, v, j); if (!inBox(Bq, 12) || isSq(d2(A, M)) || simp(d2(A, M))[0] === 1 && r.chance(0.5)) return null; return { A: A, M: M, B: Bq }; }, { A: [-4, 3], M: [2, -1], B: [8, -5] }); },
      stem: function (s) { return nP('M', s.M) + ' is the midpoint of segment ' + t('AB') + ', and ' + t('A') + ' is the point ' + t(ptT(s.A)) + '.'; },
      parts: [
        { id: 'e2a', level: 'EMG', make: function (r, s) { var sl = slopeOf(s.A, s.B); return multi('(a) Find the coordinates of ' + t('B') + ' and the slope of ' + t('AB') + '.', [ptBox(t('B='), s.B, endChk(s.A, s.M)), { label: t('m_{AB}='), keys: 'slope', chk: slopeChk(sl, dnDiag(s.A, s.B)), key: sT(sl), ans: t('m_{AB}=' + sT(sl)) }],
          t('B=(2(' + s.M[0] + ')-' + nb(s.A[0]) + ',\\ 2(' + s.M[1] + ')-' + nb(s.A[1]) + ')=' + ptT(s.B)) + '<br>' + t(calc(s.A, s.B, 'AB')), ['The step from ' + t('A') + ' to ' + t('M') + ' repeats from ' + t('M') + ' to ' + t('B') + '.'], 'endpoint and slope'); } },
        { id: 'e2b', level: 'EMG', make: function (r, s) { return multi('(b) Find the exact lengths of ' + t('AB') + ' and of ' + t('AM') + '.', [lenBox('AB', s.A, s.B, true), lenBox('AM', s.A, s.M, true)], distSteps(s.A, s.B, 'AB') + '<br>' + distSteps(s.A, s.M, 'AM'), ['Distance formula, then simplify each radical.'], 'two exact lengths', [[String(d2(s.A, s.B)), String(d2(s.A, s.M))]]); } },
        { id: 'e2c', level: 'BEG', make: function (r, s) { var ab = radT(d2(s.A, s.B)), am = radT(d2(s.A, s.M));
          return B.mc(r, '(c) ' + t('AB=' + ab) + ' and ' + t('AM=' + am) + '. Which statement shows that ' + t('AM') + ' is exactly half of ' + t('AB') + '?', [
            { html: t('2\\times ' + am + '=' + ab) + ', so ' + t('AM=\\tfrac{1}{2}AB') + '.', right: true },
            { html: 'The radicands: ' + t(d2(s.A, s.M) + '\\times 2=' + 2 * d2(s.A, s.M)) + '.', why: 'Doubling the number under the root doesn’t double the length (' + t('\\sqrt{2n}\\ne 2\\sqrt{n}') + '). Double the whole radical.' },
            { html: 'It can only be checked with decimals.', why: 'Radicals can be compared exactly: double ' + t(am) + '.' }],
            t('2\\times ' + am + '=' + ab + '=AB') + ': ' + t('AM') + ' is exactly half of ' + t('AB') + ', as a midpoint should be.', ['Double the radical: multiply the number in front by 2.'], 'AM is half of AB'); } }] },
    /* ---------------- EP3 ---------------- */
    { num: '3', shared: function (r) {
        return gen(r, function (r) { var v = vecGen(r, { q: 5, p: 4, neg: 0.3 }), A = [-r.int(3, 6), -r.int(1, 4)], Bq = add(A, v, 2); var M = midOf(A, Bq), pp = perpOf(slopeOf(A, Bq)); var j = r.int(1, 2) * (r.chance(0.5) ? 1 : -1), P = add(M, [pp[1], pp[0]], j); if (!inBox(Bq, 10) || !inBox(P, 10)) return null; return { A: A, B: Bq, M: M, P: P }; }, { A: [-5, -2], B: [3, 4], M: [-1, 1], P: [2, -3] });
      },
      stem: function (s) { return '<b>The perpendicular bisector.</b> Segment ' + t('AB') + ' joins ' + nP('A', s.A) + ' and ' + nP('B', s.B) + '.'; },
      parts: [
        { id: 'e3a', level: 'BEG', make: function (r, s) { var sl = slopeOf(s.A, s.B); return multi('(a) Find the midpoint ' + t('M') + ' of ' + t('AB') + ' and the slope of ' + t('AB') + '.', [ptBox(t('M='), s.M, midChk(s.A, s.B)), { label: t('m_{AB}='), keys: 'slope', chk: slopeChk(sl, dnDiag(s.A, s.B)), key: sT(sl), ans: t('m_{AB}=' + sT(sl)) }], midSol(s.A, s.B, 'M') + '<br>' + t(calc(s.A, s.B, 'AB')), ['Midpoint: average the coordinates. Slope: rise over run.'], 'midpoint and slope'); } },
        { id: 'e3b', level: 'EMG', make: function (r, s) { var sl = slopeOf(s.A, s.B), pp = perpOf(sl), sMP = slopeOf(s.M, s.P);
          return multi('(b) State the slope of the line through ' + t('M') + ' perpendicular to ' + t('AB') + ', and find the slope from ' + t('M') + ' to ' + nP('P', s.P) + '.', [{ label: t('m_{\\perp}='), keys: 'slope', chk: relChk(sl, 'perp'), key: sT(pp), ans: t('m_{\\perp}=' + sT(pp)) }, { label: t('m_{MP}='), keys: 'slope', chk: slopeChk(sMP, dnDiag(s.M, s.P)), key: sT(sMP), ans: t('m_{MP}=' + sT(sMP)) }],
            'Perpendicular: ' + t(sT(pp)) + '. ' + t(calc(s.M, s.P, 'MP')) + ' — the same slope, so ' + t('P') + ' lies on the perpendicular line through ' + t('M') + '.', ['Flip and change the sign of ' + t('m_{AB}') + '.'], 'perpendicular bisector slope'); } },
        { id: 'e3c', level: 'EMG', make: function (r, s) { return multi('(c) Use the distance formula: find ' + t('PA') + ' and ' + t('PB') + ' (exact).', [lenBox('PA', s.P, s.A, true), lenBox('PB', s.P, s.B, true)], distSteps(s.P, s.A, 'PA') + '<br>' + distSteps(s.P, s.B, 'PB') + '<br>Equal: ' + t('P') + ' is the same distance from ' + t('A') + ' and ' + t('B') + ' — every point on the perpendicular bisector is.', ['Distance formula twice.'], 'P equidistant', [[String(d2(s.P, s.A)), String(d2(s.P, s.B))]]); } }] },
    /* ---------------- EP4 ---------------- */
    { num: '4', section: 'Extra Practice B — Slope and Direction', shared: function (r) {
        return gen(r, function (r) { var v = vecGen(r, { q: 4, p: 3, neg: 0.2 }), a = r.int(2, 3), c = r.int(3, 4); if (a === c) return null; var P = [-r.int(6, 9), -r.int(3, 6)], Q = add(P, v, a), R = add(Q, v, c); if (!inBox(R, 12) || simp(v[0] * v[0] + v[1] * v[1])[1] === 1) return null; return { P: P, Q: Q, R: R, a: a, c: c }; }, { P: [-9, -5], Q: [-3, -1], R: [6, 5], a: 2, c: 3 });
      },
      stem: function (s) { return 'The points ' + nP('P', s.P) + ', ' + nP('Q', s.Q) + ' and ' + nP('R', s.R) + ' are plotted on a grid.'; },
      parts: [
        { id: 'e4a', level: 'BEG', make: function (r, s) { return slopeFields('(a) Use slopes to show the three points are collinear: find ' + t('m_{PQ}') + ' and ' + t('m_{QR}') + '.', [{ nm: 'PQ', A: s.P, B: s.Q }, { nm: 'QR', A: s.Q, B: s.R }], null, [SLOPE_HINT], 'collinear by slopes'); } },
        { id: 'e4b', level: 'EMG', make: function (r, s) { return multi('(b) Find the exact lengths ' + t('PQ') + ', ' + t('QR') + ' and ' + t('PR') + '.', [lenBox('PQ', s.P, s.Q, true), lenBox('QR', s.Q, s.R, true), lenBox('PR', s.P, s.R, true)], [distSteps(s.P, s.Q, 'PQ'), distSteps(s.Q, s.R, 'QR'), distSteps(s.P, s.R, 'PR')].join('<br>'), ['Distance formula, then simplify — the radicals should all have the same number under the root.'], 'three exact lengths', [[String(d2(s.P, s.Q)), String(d2(s.Q, s.R)), String(d2(s.P, s.R))]]); } },
        { id: 'e4c', level: 'EMG', make: function (r, s) { var a = radT(d2(s.P, s.Q)), b = radT(d2(s.Q, s.R)), c = radT(d2(s.P, s.R));
          return B.mc(r, '(c) ' + t(a + '+' + b + '=' + c) + ', so ' + t('PQ+QR=PR') + '. Why is that a second proof of collinearity?', [
            { html: 'Going ' + t('P\\to Q\\to R') + ' covers exactly the direct distance from ' + t('P') + ' to ' + t('R') + ', so there is no detour: ' + t('Q') + ' must be on segment ' + t('PR') + '.', right: true },
            { html: 'Because the three lengths have the same radicand.', why: 'That only makes them easy to add. The point is that the two shorter pieces add up to the long one.' },
            { html: 'Because ' + t('PQ=QR') + '.', why: 'They aren’t equal here — and equal lengths wouldn’t prove collinear anyway.' }],
            'If ' + t('Q') + ' were off the line, the path ' + t('P\\to Q\\to R') + ' would bend and be longer than ' + t('PR') + '. Equal means no bend: collinear.', ['A detour is always longer than the straight path.'], 'distance proof of collinearity'); } },
        { id: 'e4d', sub: 'd i', level: 'EMG', make: function (r, s) { var p = B.math('Find the midpoint of ' + t('PR') + '.', midChk(s.P, s.R), pT(midOf(s.P, s.R)), midSol(s.P, s.R, 'M'), ['Average the coordinates of ' + t('P') + ' and ' + t('R') + '.'], 'midpoint of PR', { keys: 'pairs', placeholder: 'e.g. (-1.5, 0)' }); p.bad = [pT(s.Q)]; return p; } },
        { id: 'e4e', sub: 'd ii', level: 'PRG', make: function (r, s) { var M = midOf(s.P, s.R), fr = red(s.a, s.a + s.c);
          return B.mc(r, 'Is ' + t('Q') + ' the midpoint of ' + t('PR') + '?', [
            { html: '<b>No</b> — the midpoint is ' + t(ptT(M)) + '; ' + t('Q') + ' is only ' + t(sT(fr)) + ' of the way from ' + t('P') + ' to ' + t('R') + ' (' + t('PQ\\ne QR') + ').', right: true },
            { html: '<b>Yes</b> — ' + t('Q') + ' is on segment ' + t('PR') + '.', why: 'Being on the segment isn’t enough: the midpoint must split it into two <b>equal</b> halves. Compare ' + t('PQ') + ' and ' + t('QR') + '.' },
            { html: '<b>Yes</b> — ' + t('PQ+QR=PR') + '.', why: 'That shows ' + t('Q') + ' is on the segment, not that it is in the middle.' }],
            'Midpoint of ' + t('PR') + ': ' + t(ptT(M)) + ', not ' + t('Q') + '. ' + t('PQ=' + radT(d2(s.P, s.Q))) + ' is ' + t(s.a) + ' parts of ' + t(s.a + s.c) + ': ' + t('Q') + ' is ' + t(sT(fr)) + ' of the way along.', ['Compare the midpoint with ' + t('Q') + ', or compare ' + t('PQ') + ' with ' + t('QR') + '.'], 'is Q the midpoint'); } }] },
    /* ---------------- EP5 ---------------- */
    { num: '5', shared: function (r) {
        return gen(r, function (r) { var v = vecGen(r, { q: 4, p: 3, neg: 0.2 }), A = [-r.int(6, 9), -r.int(4, 8)], Bq = add(A, v, 2), C = add(Bq, v, r.int(2, 3)); if (!inBox(C, 12) || ((A[0] + C[0]) % 2 === 0 && r.chance(0.5))) return null; return { A: A, B: Bq, C: C }; }, { A: [-8, -7], B: [-2, -3], C: [7, 3] });
      },
      stem: function (s) { return 'The points ' + nP('A', s.A) + ', ' + nP('B', s.B) + ' and ' + t('C(k,\\ ' + s.C[1] + ')') + ' are collinear.'; },
      parts: [
        { id: 'e5a', level: 'PRG', make: function (r, s) { var sl = slopeOf(s.A, s.B), rise = s.C[1] - s.B[1], run = s.C[0] - s.B[0];
          return numAns('(a) Find the value of ' + t('k') + '.', s.C[0], [[run, 'k-no-start', 'That is the run from ' + t('B') + ' — add ' + t(s.B[0]) + '.'], [s.B[0] - run, 'k-sign', 'Check the sign as you solve.'], [s.B[0] + rise * sV(sl), 'k-flip', 'The run is rise ÷ slope.']],
            t(calc(s.A, s.B, 'AB')) + '; ' + t('\\frac{' + s.C[1] + '-' + nb(s.B[1]) + '}{k-' + nb(s.B[0]) + '}=' + sT(sl) + '\\ \\Rightarrow\\ k-' + nb(s.B[0]) + '=' + run + '\\ \\Rightarrow\\ k=' + s.C[0]), ['Find ' + t('m_{AB}') + '. The unknown is in the run of ' + t('BC') + ': cross-multiply.'], 'collinear: find k', t('k=')); } },
        { id: 'e5b', level: 'EMG', make: function (r, s) { var n = d2(s.A, s.C); var p = B.math('(b) Using ' + t('C(' + s.C[0] + ',\\ ' + s.C[1] + ')') + ', find the exact length of ' + t('AC') + '.', exactChk(n, distDiag(s.A, s.C)), radT(n), distSteps(s.A, s.C, 'AC'), ['Distance formula, then simplify.'], 'length AC', { keys: 'radical', before: t('AC=') }); p.bad = [String(n)]; return p; } },
        { id: 'e5c', level: 'EMG', make: function (r, s) { var M = midOf(s.A, s.C); var p = B.math('(c) Find the midpoint of ' + t('AC') + '.', midChk(s.A, s.C), pT(M), midSol(s.A, s.C, 'M') + '. Check: the slope from ' + t('A') + ' to ' + t('M') + ' is ' + t('\\frac{' + nT(M[1] - s.A[1]) + '}{' + nT(M[0] - s.A[0]) + '}=' + sT(slopeOf(s.A, s.B))) + ' — on the same line ✓', ['Average the coordinates.'], 'midpoint of AC', { keys: 'pairs', placeholder: 'e.g. (-0.5, -2)' }); p.bad = sameP([s.A[0] + s.C[0], s.A[1] + s.C[1]], M) ? [] : [pT([s.A[0] + s.C[0], s.A[1] + s.C[1]])]; return p; } }] },
    /* ---------------- EP6 ---------------- */
    { num: '6', shared: function (r) { var y1 = r.int(3, 7), x1 = -r.int(3, 6), cx = r.int(1, 5), y3 = -r.int(3, 6), x3 = -r.int(5, 7); return { A: [x1, y1], B: [x1 + r.int(6, 10), y1], C: [cx, -r.int(1, 3)], D: [cx, r.int(5, 8)], E: [x3, y3], F: [x3 + r.int(3, 6), y3] }; },
      stem: function (s) { return 'Segment ' + t('AB') + ' joins ' + nP('A', s.A) + ' and ' + nP('B', s.B) + '; segment ' + t('CD') + ' joins ' + nP('C', s.C) + ' and ' + nP('D', s.D) + '; segment ' + t('EF') + ' joins ' + nP('E', s.E) + ' and ' + nP('F', s.F) + '.'; },
      parts: [
        { id: 'e6a', level: 'BEG', make: function (r, s) { var rows = [['AB', 'zero'], ['CD', 'und'], ['EF', 'zero']].map(function (x) { return { id: x[0], html: t(x[0]) }; }), want = { AB: 'zero', CD: 'und', EF: 'zero' };
          return B.grid('(a) Classify the slope of each segment.', rows, [{ id: 'pos', html: 'Positive' }, { id: 'neg', html: 'Negative' }, { id: 'zero', html: 'Zero' }, { id: 'und', html: 'Undefined' }], want, { why: function (row) { return row === 'CD' ? t('C') + ' and ' + t('D') + ' share an ' + t('x') + '-coordinate: vertical, undefined.' : 'Its endpoints share a ' + t('y') + '-coordinate: horizontal, slope ' + t('0') + '.'; } },
            t('AB') + ' and ' + t('EF') + ' are horizontal (same ' + t('y') + '): slope ' + t('0') + '. ' + t('CD') + ' is vertical (same ' + t('x') + '): undefined.', ['Which coordinate stays the same along each segment?'], 'classify 0 / undefined'); } },
        { id: 'e6b', level: 'BEG', make: function (r, s) { var L = [s.B[0] - s.A[0], s.D[1] - s.C[1], s.F[0] - s.E[0]];
          return multi('(b) Find the length of each segment without the distance formula.', [numBox(t('AB='), L[0]), numBox(t('CD='), L[1]), numBox(t('EF='), L[2])], t('AB=|' + s.B[0] + '-' + nb(s.A[0]) + '|=' + L[0] + ',\\ CD=|' + s.D[1] + '-' + nb(s.C[1]) + '|=' + L[1] + ',\\ EF=|' + s.F[0] + '-' + nb(s.E[0]) + '|=' + L[2]) + '. Horizontal and vertical segments: only one coordinate changes, so the length is that change.', ['Horizontal: subtract the ' + t('x') + '’s. Vertical: subtract the ' + t('y') + '’s.'], 'horizontal / vertical lengths', [[String(s.B[0] + s.A[0]), String(L[1]), String(L[2])]]); } },
        { id: 'e6c', level: 'EMG', make: function (r, s) { var sets = [['AB', 'EF'], ['AB', 'CD'], ['CD', 'EF']].map(function (x, i) { return { id: 'pqr'.charAt(i), label: t(x[0]) + ' and ' + t(x[1]), a: slopeOf(s[x[0][0]], s[x[0][1]]), b: slopeOf(s[x[1][0]], s[x[1][1]]) }; });
          return relGrid('(c) Which pairs are parallel and which are perpendicular? (The rule ' + t('m_1\\times m_2=-1') + ' can’t be used here: an undefined slope isn’t a number.)', sets, 'all', sets.map(function (st) { return st.label + ': ' + relSol(st.a, st.b); }).join('<br>'), 'horizontal and vertical pairs'); } }] },
    /* ---------------- EP7 ---------------- */
    { num: '7', shared: function (r) {
        return gen(r, function (r) { var p = r.int(1, 4), q = r.int(2, 5); if (gcd(p, q) !== 1 || p === q) return null; var sg = r.chance(0.7) ? -1 : 1, s = [sg * p, q], ps = perpOf(s); var J = [-r.int(1, 4), -r.int(2, 5)], K2 = add(J, [q, sg * p], 2); var G = [-r.int(3, 6), r.int(-2, 3)], d = p * q * (p * q < 4 ? 2 : 1) * (r.chance(0.8) ? 1 : -1); var kPar = G[0] + d / sV(s), kPerp = G[0] + d / sV(ps); if (!Number.isInteger(kPar) || !Number.isInteger(kPerp) || Math.abs(kPar) > 20 || Math.abs(kPerp) > 20 || !inBox(K2, 12)) return null; return { G: G, yH: G[1] + d, J: J, K: K2, s: s, ps: ps, kPar: kPar, kPerp: kPerp, d: d }; }, { G: [-5, 1], yH: 7, J: [-2, -4], K: [4, -8], s: [-2, 3], ps: [3, 2], kPar: -14, kPerp: -1, d: 6 });
      },
      stem: function (s) { return 'Segment ' + t('GH') + ' joins ' + nP('G', s.G) + ' and ' + t('H(k,\\ ' + s.yH + ')') + '. Segment ' + t('JK') + ' joins ' + nP('J', s.J) + ' and ' + nP('K', s.K) + '.'; },
      parts: [
        { id: 'e7a', level: 'PRG', make: function (r, s) { var run = s.kPar - s.G[0];
          return numAns('(a) Find ' + t('k') + ' so that ' + t('GH\\parallel JK') + '.', s.kPar, [[s.kPerp, 'k-perp-par', 'That makes the segments perpendicular. Parallel: the <b>same</b> slope.'], [run, 'k-no-start', 'That is the run — add ' + t(s.G[0]) + '.'], [s.G[0] - run, 'k-sign', 'Check the sign.']],
            t(calc(s.J, s.K, 'JK')) + '; ' + t('\\frac{' + s.yH + '-' + nb(s.G[1]) + '}{k-' + nb(s.G[0]) + '}=' + sT(s.s) + '\\ \\Rightarrow\\ k-' + nb(s.G[0]) + '=' + run + '\\ \\Rightarrow\\ k=' + s.kPar), ['Find ' + t('m_{JK}') + '. The unknown is in the run: cross-multiply.'], 'parallel: unknown x', t('k=')); } },
        { id: 'e7b', level: 'PRG', make: function (r, s) { var run = s.kPerp - s.G[0];
          return numAns('(b) Find ' + t('k') + ' so that ' + t('GH\\perp JK') + '.', s.kPerp, [[s.kPar, 'k-par-perp', 'That makes the segments parallel. Use the negative reciprocal of ' + t('m_{JK}') + '.'], [run, 'k-no-start', 'That is the run — add ' + t(s.G[0]) + '.'], [s.G[0] - run, 'k-sign', 'Check the sign.']],
            t('m_{GH}=' + sT(s.ps)) + ': ' + t('\\frac{' + s.d + '}{k-' + nb(s.G[0]) + '}=' + sT(s.ps) + '\\ \\Rightarrow\\ k-' + nb(s.G[0]) + '=' + run + '\\ \\Rightarrow\\ k=' + s.kPerp), ['Negative reciprocal of ' + t('m_{JK}') + ', then cross-multiply.'], 'perpendicular: unknown x', t('k=')); } },
        { id: 'e7c', level: 'EMG', make: function (r, s) { var H = [s.kPerp, s.yH], n = d2(s.G, H); var p = B.math('(c) Using ' + t('H(' + s.kPerp + ',\\ ' + s.yH + ')') + ' from (b), find the exact length of ' + t('GH') + '.', exactChk(n, distDiag(s.G, H)), radT(n), distSteps(s.G, H, 'GH'), ['Distance formula, then simplify.'], 'length GH', { keys: 'radical', before: t('GH=') }); p.bad = [String(n)]; return p; } }] },
    /* ---------------- EP8 (Figure 1) ---------------- */
    { num: '8', section: 'Extra Practice C — Classifying Figures', shared: function (r) {
        return gen(r, function (r) { var sq = r.chance(0.2), a = r.int(2, 5), b = sq ? a : r.int(2, 4); if (!sq && a === b) return null; var O = [r.int(-5 + a, 5 - a), r.int(-5 + b, 5 - b)]; var V = [[O[0] - a, O[1]], [O[0], O[1] - b], [O[0] + a, O[1]], [O[0], O[1] + b]]; if (V.some(function (X) { return X[0] === 0 || X[1] === 0; })) return null; return { V: V, sq: sq }; }, { V: [[-6, 1], [-2, -2], [2, 1], [-2, 4]], sq: false });
      },
      stem: function (s) { return 'Quadrilateral ' + t('ABCD') + ' (Figure 1). Read every coordinate off the grid.' + figQuad(s.V, ['A', 'B', 'C', 'D']); },
      parts: (function () {
        var N = ['A', 'B', 'C', 'D'], SD = ['AB', 'BC', 'CD', 'DA'];
        return [
          { id: 'e8a', level: 'EMG', make: function (r, s) { return slopeFields('(a) Find the slope of each of the four sides.', SD.map(function (x, i) { return { nm: x, A: s.V[i], B: s.V[(i + 1) % 4] }; }), null, [SLOPE_HINT, 'Read each vertex off the grid first.'], 'rhombus: four slopes'); } },
          { id: 'e8b', level: 'EMG', make: function (r, s) { var L = SD.map(function (x, i) { return Math.sqrt(d2(s.V[i], s.V[(i + 1) % 4])); }), per = L.reduce(function (a, b) { return a + b; }, 0), exact = isSq(d2(s.V[0], s.V[1]));
            return multi('(b) Find the length of each side (exact, or to the nearest tenth), and the perimeter.', SD.map(function (x, i) { return lenBox(x, s.V[i], s.V[(i + 1) % 4], false); }).concat([{ label: 'Perimeter:', keys: 'radical', chk: exact ? stripVar(K.value(per)) : anyLenChk(per * per), key: exact ? String(per) : radT(16 * d2(s.V[0], s.V[1])), ans: 'perimeter ' + t(exact ? per : radT(16 * d2(s.V[0], s.V[1]))) }]),
              SD.map(function (x, i) { return distSteps(s.V[i], s.V[(i + 1) % 4], x); }).join('<br>') + '<br>Perimeter ' + t('=4\\times ' + radT(d2(s.V[0], s.V[1])) + (exact ? '=' + per : '=' + radT(16 * d2(s.V[0], s.V[1])) + '\\approx ' + per.toFixed(1))) + '.', ['Distance formula for each side.'], 'four sides and perimeter'); } },
          { id: 'e8c', level: 'EMG', make: function (r, s) { var sl = SD.map(function (x, i) { return slopeOf(s.V[i], s.V[(i + 1) % 4]); }); var sets = [[0, 2], [1, 3], [0, 1], [1, 2]].map(function (x, i) { return { id: 'pqrs'.charAt(i), label: t(SD[x[0]]) + ' and ' + t(SD[x[1]]), a: sl[x[0]], b: sl[x[1]] }; });
            return relGrid('(c) For each pair of sides: parallel, perpendicular, or neither?', sets, 'all', sets.map(function (st) { return st.label + ': ' + relSol(st.a, st.b); }).join('<br>'), 'rhombus: side relationships'); } },
          { id: 'e8d', level: 'EMG', make: function (r, s) { var M1 = midOf(s.V[0], s.V[2]), M2 = midOf(s.V[1], s.V[3]); return multi('(d) Find the midpoint of diagonal ' + t('AC') + ' and of diagonal ' + t('BD') + '.', [ptBox('Midpoint of ' + t('AC') + ':', M1, midChk(s.V[0], s.V[2])), ptBox('Midpoint of ' + t('BD') + ':', M2, midChk(s.V[1], s.V[3]))], midSol(s.V[0], s.V[2], 'M_{AC}') + '<br>' + midSol(s.V[1], s.V[3], 'M_{BD}') + '<br>The same point: the diagonals bisect each other.', ['Average the coordinates of each diagonal’s endpoints.'], 'diagonal midpoints'); } },
          { id: 'e8e', level: 'EMG', make: function (r, s) { var A = s.V[0], Bq = s.V[1], C = s.V[2], D = s.V[3]; return multi('(e) Find the slope and the length of each diagonal.', [slopeBox('AC', A, C), slopeBox('BD', Bq, D), lenBox('AC', A, C, false), lenBox('BD', Bq, D, false)], t(calc(A, C, 'AC')) + ' (horizontal), ' + t(calc(Bq, D, 'BD')) + ' (vertical): perpendicular. ' + t('AC=' + radT(d2(A, C)) + ',\\ BD=' + radT(d2(Bq, D))) + (d2(A, C) === d2(Bq, D) ? ': equal.' : ': not equal.'), ['A diagonal joins opposite vertices.'], 'diagonals: slopes and lengths'); } },
          { id: 'e8f', level: 'PRG', make: function (r, s) { var sq = s.sq;
            return B.mc(r, '(f) Give the most precise name for ' + t('ABCD') + '.', [
              { html: '<b>Rhombus</b> (not a square): four equal sides, but no right angles and unequal diagonals.', right: !sq, why: sq ? 'Its adjacent sides are perpendicular and the diagonals are equal: more than a rhombus.' : null },
              { html: '<b>Square</b>: four equal sides and perpendicular diagonals.', right: sq, why: sq ? null : 'Perpendicular diagonals and equal sides make a rhombus. A square also needs right angles — the products in (c) aren’t ' + t('-1') + ' — and equal diagonals.' },
              { html: '<b>Rectangle</b>', why: 'A rectangle needs right angles. Check (c).' },
              { html: '<b>Parallelogram</b> only', why: 'All four sides are equal (b), so a more precise name fits.' }],
              sq ? 'Four equal sides, adjacent sides perpendicular, equal diagonals: a <b>square</b>.' : 'Four equal sides (b), opposite sides parallel (c), perpendicular diagonals (e): a <b>rhombus</b>. “Square” is ruled out because no corner is a right angle (c) and the diagonals are unequal (e).', ['Equal sides? Right angles? Equal diagonals?'], 'rhombus or square', true); } }];
      })() },
    /* ---------------- EP9 (Figure 2) ---------------- */
    { num: '9', shared: function (r) {
        return gen(r, function (r) { var u = r.pick([[6, 2], [2, 6], [4, 2], [2, 4], [3, 1], [1, 3], [4, 3], [3, 4], [6, 3], [5, 2]]); if (r.chance(0.5)) u = [u[0], -u[1]]; var W = [r.int(-5, 0), r.int(-5, 0)], X = add(W, u), Y = add(X, [-u[1], u[0]]), Z = add(W, [-u[1], u[0]]); if (![W, X, Y, Z].every(function (P) { return inBox(P, 6) && P[0] !== 0 && P[1] !== 0; })) return null; if (u[1] === 0) return null; return { W: W, X: X, Y: Y, Z: Z }; }, { W: [-3, -4], X: [3, -2], Y: [1, 4], Z: [-5, 2] });
      },
      stem: function (s) { return 'In Figure 2, ' + t('W') + ', ' + t('X') + ' and ' + t('Y') + ' are three vertices of a square ' + t('WXYZ') + ', named in order. Read the coordinates off the grid.' + figPath([s.W, s.X, s.Y], ['W', 'X', 'Y']); },
      parts: [
        { id: 'e9a', level: 'EMG', make: function (r, s) { return multi('(a) Show that ' + t('WX\\perp XY') + ' and ' + t('WX=XY') + ': find both slopes and both lengths.', [slopeBox('WX', s.W, s.X), slopeBox('XY', s.X, s.Y), lenBox('WX', s.W, s.X, false), lenBox('XY', s.X, s.Y, false)], t(calc(s.W, s.X, 'WX')) + ', ' + t(calc(s.X, s.Y, 'XY')) + ': ' + t(prodT(slopeOf(s.W, s.X), slopeOf(s.X, s.Y))) + ', perpendicular.<br>' + distSteps(s.W, s.X, 'WX') + '<br>' + distSteps(s.X, s.Y, 'XY') + ': equal.', [SLOPE_HINT], 'right angle and equal sides'); } },
        { id: 'e9b', level: 'ADV', make: function (r, s) { var w1 = [s.W[0] + s.Y[0] - s.X[0] + 2 * (s.X[0] - s.W[0]), s.W[1] + s.Y[1] - s.X[1] + 2 * (s.X[1] - s.W[1])], w2 = [s.X[0] + s.Y[0] - s.W[0], s.X[1] + s.Y[1] - s.W[1]];
          var p = B.math('(b) Find the fourth vertex ' + t('Z') + '.', ptChk(s.Z, [[w2, 'u6l9-4th-vertex', 'That point is past ' + t('Y') + ', not next to ' + t('W') + '. From ' + t('W') + ', make the same move as from ' + t('X') + ' to ' + t('Y') + '.']]), pT(s.Z),
            'From ' + t('X') + ' to ' + t('Y') + ': ' + t('(' + nb(s.Y[0] - s.X[0]) + ',\\ ' + nb(s.Y[1] - s.X[1]) + ')') + '. The same move from ' + t('W') + ': ' + t('Z=' + ptT(s.Z)) + '. Check: ' + t('m_{YZ}=' + sT(slopeOf(s.Y, s.Z)) + '=m_{WX}') + ' and ' + t('m_{ZW}=' + sT(slopeOf(s.Z, s.W)) + '=m_{XY}') + ' ✓', ['Opposite sides of a square are parallel and equal: ' + t('W\\to Z') + ' is the same move as ' + t('X\\to Y') + '.'], 'fourth vertex of the square', { keys: 'pairs', placeholder: 'e.g. (3, -2)' }); p.bad = [pT(w2)]; void w1; return p; } },
        { id: 'e9c', level: 'EMG', make: function (r, s) { return multi('(c) Find the length and the midpoint of each diagonal, ' + t('WY') + ' and ' + t('XZ') + '.', [lenBox('WY', s.W, s.Y, false), lenBox('XZ', s.X, s.Z, false), ptBox('Midpoint of ' + t('WY') + ':', midOf(s.W, s.Y), midChk(s.W, s.Y)), ptBox('Midpoint of ' + t('XZ') + ':', midOf(s.X, s.Z), midChk(s.X, s.Z))], distSteps(s.W, s.Y, 'WY') + '<br>' + distSteps(s.X, s.Z, 'XZ') + '<br>' + midSol(s.W, s.Y) + ' for both: equal diagonals that bisect each other.', ['A diagonal joins opposite vertices.'], 'square diagonals'); } },
        { id: 'e9d', level: 'PRG', make: function (r) {
          return B.mc(r, '(d) Which three facts together prove ' + t('WXYZ') + ' is a square?', [
            { html: 'All four sides are equal; adjacent sides are perpendicular; the diagonals are equal and bisect each other.', right: true },
            { html: 'Opposite sides are parallel; the figure has four sides; ' + t('W') + ' is the lowest point.', why: 'Parallel opposite sides only prove a parallelogram, and position on the grid proves nothing.' },
            { html: 'Two sides are equal; one diagonal is horizontal; the area is positive.', why: 'None of these pins down a square: you need equal sides <b>and</b> right angles.' }],
            'Equal sides (rhombus) + a right angle (rectangle) = square; equal, bisecting diagonals confirm it.', ['A square is both a rhombus and a rectangle.'], 'facts that prove a square'); } }] },
    /* ---------------- EP10 ---------------- */
    { num: '10', shared: function (r) { return quadGen(r, 'para', 8) || [[-7, -4], [-3, 2], [5, 4], [1, -2]]; },
      stem: function (V) { return 'Quadrilateral ' + t('EFGH') + ' has vertices ' + ['E', 'F', 'G', 'H'].map(function (n, i) { return nP(n, V[i]); }).join(', ') + '.'; },
      parts: [
        { id: 'e10a', sub: 'a i', level: 'EMG', make: function (r, V) { var nm = ['EF', 'FG', 'GH', 'HE']; return slopeFields('Find the slope of each of the four sides.', nm.map(function (x, i) { return { nm: x, A: V[i], B: V[(i + 1) % 4] }; }), null, [SLOPE_HINT], 'four slopes'); } },
        { id: 'e10a2', sub: 'a ii', level: 'EMG', make: function (r, V) { var nm = ['EF', 'FG', 'GH', 'HE']; return multi('Find the exact length of each side.', nm.map(function (x, i) { return lenBox(x, V[i], V[(i + 1) % 4], true); }), nm.map(function (x, i) { return distSteps(V[i], V[(i + 1) % 4], x); }).join('<br>'), ['Distance formula, then simplify.'], 'four exact lengths', [nm.map(function (x, i) { return String(d2(V[i], V[(i + 1) % 4])); })]); } },
        { id: 'e10b', sub: 'b', level: 'EMG', make: function (r, V) { return multi('(b) Find the midpoint and the exact length of each diagonal.', [ptBox('Midpoint of ' + t('EG') + ':', midOf(V[0], V[2]), midChk(V[0], V[2])), lenBox('EG', V[0], V[2], true), ptBox('Midpoint of ' + t('FH') + ':', midOf(V[1], V[3]), midChk(V[1], V[3])), lenBox('FH', V[1], V[3], true)], midSol(V[0], V[2], 'M_{EG}') + ', ' + midSol(V[1], V[3], 'M_{FH}') + '<br>' + distSteps(V[0], V[2], 'EG') + '<br>' + distSteps(V[1], V[3], 'FH'), ['Diagonals: ' + t('EG') + ' and ' + t('FH') + '.'], 'diagonals: midpoints and lengths'); } },
        { id: 'e10c', sub: 'c', level: 'PRG', make: function (r, V) { return nameMC(r, '(c) What is the most precise name for ' + t('EFGH') + '?', V, ['E', 'F', 'G', 'H'], 'name EFGH'); } },
        { id: 'e10d', sub: 'd', level: 'PRG', make: function (r, V) { var a = radT(d2(V[0], V[2])), b = radT(d2(V[1], V[3]));
          return B.mc(r, '(d) Tomas says “the diagonals bisect each other, so it is a rectangle.” What is his error?', [
            { html: 'Bisecting diagonals prove only a parallelogram. A rectangle also needs equal diagonals (here ' + t(a + '\\ne ' + b) + ') — equivalently a right angle, and no corner is square.', right: true },
            { html: 'The diagonals don’t really bisect each other.', why: 'Check (b): both diagonals have the same midpoint. His fact is right; his conclusion isn’t.' },
            { html: 'Nothing — bisecting diagonals do make a rectangle.', why: 'Every parallelogram has bisecting diagonals, including ones with no right angles.' }],
            'Bisecting diagonals prove a parallelogram and nothing more. A rectangle needs equal diagonals: ' + t('EG=' + a) + ' but ' + t('FH=' + b) + '. (Also, adjacent slopes don’t multiply to ' + t('-1') + '.)', ['What do bisecting diagonals prove? What extra does a rectangle need?'], 'Tomas’s error'); } }] },
    /* ---------------- EP11 ---------------- */
    { num: '11', shared: function (r) {
        return gen(r, function (r) { var u = r.pick([[3, -2], [2, -3], [3, -1], [1, -2], [2, -1], [4, -3]]), s = r.int(2, 2), tt = r.int(2, 4); if (s === tt && r.chance(0.7)) return null; var A = [-r.int(4, 7), -r.int(2, 5)], Bq = add(A, u, s), C = add(A, [-u[1], u[0]], tt); if (!inBox(Bq, 10) || !inBox(C, 10) || (Bq[0] + C[0]) % 2 || (Bq[1] + C[1]) % 2 || (A[0] + Bq[0]) % 2) return null; return { A: A, B: Bq, C: C }; }, { A: [-6, -4], B: [0, -8], C: [2, 8] });
      },
      stem: function (s) { return 'Triangle ' + t('ABC') + ' has vertices ' + nP('A', s.A) + ', ' + nP('B', s.B) + ' and ' + nP('C', s.C) + '.'; },
      parts: [
        { id: 'e11a', level: 'EMG', make: function (r, s) { return multi('(a) Find the midpoint of each side.', [ptBox('Midpoint of ' + t('AB') + ':', midOf(s.A, s.B), midChk(s.A, s.B)), ptBox('Midpoint of ' + t('AC') + ':', midOf(s.A, s.C), midChk(s.A, s.C)), ptBox('Midpoint of ' + t('BC') + ':', midOf(s.B, s.C), midChk(s.B, s.C))], [midSol(s.A, s.B), midSol(s.A, s.C), midSol(s.B, s.C)].join('<br>'), ['Average the coordinates of each side’s endpoints.'], 'three midpoints'); } },
        { id: 'e11b', level: 'EMG', make: function (r, s) { return multi('(b) Find the exact length of each side.', [lenBox('AB', s.A, s.B, true), lenBox('AC', s.A, s.C, true), lenBox('BC', s.B, s.C, true)], [distSteps(s.A, s.B, 'AB'), distSteps(s.A, s.C, 'AC'), distSteps(s.B, s.C, 'BC')].join('<br>'), ['Distance formula, then simplify.'], 'three exact lengths', [[String(d2(s.A, s.B)), String(d2(s.A, s.C)), String(d2(s.B, s.C))]]); } },
        { id: 'e11c', level: 'EMG', make: function (r, s) { var L = [d2(s.A, s.B), d2(s.A, s.C), d2(s.B, s.C)], ty = L[0] === L[1] || L[1] === L[2] || L[0] === L[2] ? 'iso' : 'sca', sAB = slopeOf(s.A, s.B), sAC = slopeOf(s.A, s.C);
          var lab = { sca: 'Scalene right triangle (right angle at ' + t('A') + ')', iso: 'Isosceles right triangle (right angle at ' + t('A') + ')' };
          return B.mc(r, '(c) Classify the triangle by its sides and by its angles.', [
            { html: lab[ty], right: true }, { html: lab[ty === 'sca' ? 'iso' : 'sca'], why: ty === 'sca' ? 'All three lengths in (b) are different: scalene.' : 'Two lengths in (b) are equal: isosceles.' },
            { html: (ty === 'sca' ? 'Scalene' : 'Isosceles') + ' acute triangle (no right angle)', why: 'Multiply ' + t('m_{AB}') + ' and ' + t('m_{AC}') + ': ' + t(prodT(sAB, sAC)) + '.' },
            { html: (ty === 'sca' ? 'Scalene' : 'Isosceles') + ' right triangle (right angle at ' + t('B') + ')', why: 'The right angle is where the two perpendicular sides meet: ' + t('AB') + ' and ' + t('AC') + ' meet at ' + t('A') + '.' }],
            'Sides: ' + t('AB^{2}=' + L[0] + ',\\ AC^{2}=' + L[1] + ',\\ BC^{2}=' + L[2]) + ' — ' + (ty === 'sca' ? 'all different, scalene' : 'two equal, isosceles') + '. Slopes: ' + t(prodT(sAB, sAC)) + ', right angle at ' + t('A') + '. Pythagoras agrees: ' + t(L[0] + '+' + L[1] + '=' + L[2]) + '.', ['Compare the lengths; multiply the slopes of the sides that meet at each vertex.'], 'classify the triangle'); } },
        { id: 'e11d', level: 'PRG', make: function (r, s) { var Mbc = midOf(s.B, s.C), n = (Mbc[0] - s.A[0]) * (Mbc[0] - s.A[0]) + (Mbc[1] - s.A[1]) * (Mbc[1] - s.A[1]), half = d2(s.B, s.C) / 4;
          return multi('(d) Find the exact length of the median from ' + t('A') + ' to the midpoint of ' + t('BC') + ', and half of ' + t('BC') + '.', [{ label: 'Median:', keys: 'radical', chk: exactChk(n), key: radT(n), ans: 'median ' + t(radT(n)) }, { label: t('\\tfrac{1}{2}BC='), keys: 'radical', chk: exactChk(half), key: radT(half), ans: t('\\tfrac{1}{2}BC=' + radT(half)) }],
            'Midpoint of ' + t('BC') + ': ' + t(ptT(Mbc)) + '. Median ' + t('=\\sqrt{' + nb(Mbc[0] - s.A[0]) + '^{2}+' + nb(Mbc[1] - s.A[1]) + '^{2}}=' + radT(n)) + '; half of ' + t('BC=' + radT(d2(s.B, s.C))) + ' is ' + t(radT(half)) + ' — the same. In a right triangle, the median from the right angle is half the hypotenuse.', ['The median joins ' + t('A') + ' to the midpoint of ' + t('BC') + '.'], 'median and half the hypotenuse', [[String(n), String(half)]]); } }] },
    /* ---------------- EP12 ---------------- */
    { num: '12', section: 'Extra Practice D — Reasoning and Error Analysis', shared: function (r) {
        return gen(r, function (r) { var tr = r.pick([[12, 5], [5, 12], [8, 6], [6, 8], [15, 8], [9, 12], [4, 3]]), A = [-r.int(2, 6), r.int(1, 5)], Bq = [A[0] + tr[0], A[1] - tr[1]]; if (!inBox(Bq, 12) || Bq[0] === 0) return null; return { A: A, B: Bq }; }, { A: [-5, 3], B: [7, -2] });
      },
      stem: function (s) { var dx = s.B[0] - s.A[0], dy = s.B[1] - s.A[1]; return 'For the points ' + nP('A', s.A) + ' and ' + nP('B', s.B) + ', a student submitted this work. Each formula is wrong in a different way.\\[d=\\sqrt{(' + s.B[0] + '-' + nb(s.A[0]) + ')^{2}-(' + s.B[1] + '-' + nb(s.A[1]) + ')^{2}}\\]\\[=\\sqrt{' + dx * dx + '-' + dy * dy + '}=\\sqrt{' + (dx * dx - dy * dy) + '}\\]\\[M=\\left(\\frac{' + s.B[0] + '-' + nb(s.A[0]) + '}{2},\\ \\frac{' + s.B[1] + '-' + nb(s.A[1]) + '}{2}\\right)\\]\\[=' + ptT([dx / 2, dy / 2]) + '\\]\\[m=\\frac{' + s.B[0] + '-' + nb(s.A[0]) + '}{' + s.B[1] + '-' + nb(s.A[1]) + '}=' + sT(red(dx, dy)) + '\\]'; },
      parts: [
        { id: 'e12a', level: 'EMG', make: function (r, s) {
          var rows = [{ id: 'd', html: t('d') }, { id: 'm', html: t('M') }, { id: 's', html: t('m') }];
          return B.grid('(a) Name the mistake in each calculation.', rows, [{ id: 'd', html: 'Subtracted the squares' }, { id: 'm', html: 'Subtracted the coordinates' }, { id: 's', html: 'Run over rise' }], { d: 'd', m: 'm', s: 's' }, { why: function (row) { return { d: 'Distance: the squares must be <b>added</b>.', m: 'Midpoint: the coordinates must be <b>added</b> (averaged).', s: 'Slope: his fraction has the ' + t('x') + '’s on top.' }[row]; } },
            'Distance: the two squares must be added, not subtracted. Midpoint: averages <b>add</b> the coordinates. Slope: written upside down (run over rise).', ['Compare each line with its formula.'], 'name the three mistakes'); } },
        { id: 'e12b', level: 'EMG', make: function (r, s) { var dx = s.B[0] - s.A[0], dy = s.B[1] - s.A[1], M = midOf(s.A, s.B), sl = slopeOf(s.A, s.B);
          return multi('(b) Redo all three correctly.', [{ label: t('d='), keys: 'radical', chk: exactChk(d2(s.A, s.B), distDiag(s.A, s.B)), key: radT(d2(s.A, s.B)), ans: t('d=' + radT(d2(s.A, s.B))) }, ptBox(t('M='), M, midChk(s.A, s.B)), { label: t('m='), keys: 'slope', chk: slopeChk(sl, function (v) { return near(v, dx / dy) ? { code: 'slope-flip', hint: 'Still upside down: rise over run.' } : null; }), key: sT(sl), ans: t('m=' + sT(sl)) }],
            t('d=\\sqrt{' + dx * dx + '+' + dy * dy + '}=\\sqrt{' + d2(s.A, s.B) + '}=' + radT(d2(s.A, s.B))) + '<br>' + midSol(s.A, s.B, 'M') + '<br>' + t(calc(s.A, s.B, 'm').replace('m_{m}=', 'm=')), ['Distance: add the squares. Midpoint: add, then halve. Slope: rise over run.'], 'redo the three formulas', [[String(Math.sqrt(Math.abs(dx * dx - dy * dy))), pT([dx / 2, dy / 2]), sT(red(dx, dy))]]); } },
        { id: 'e12c', level: 'PRG', make: function (r, s) {
          return B.mc(r, '(c) Which two of the three errors give answers that are not even close to correct?', [
            { html: 'The midpoint and the slope (the midpoint isn’t even between ' + t('A') + ' and ' + t('B') + '; the slope is far too steep).', right: true },
            { html: 'The distance and the midpoint.', why: 'Compare the wrong distance with the correct one: it is in the right neighbourhood, which is why that error is easy to miss.' },
            { html: 'The distance and the slope.', why: 'The wrong distance is close-ish to the right one. The wrong midpoint isn’t even between ' + t('A') + ' and ' + t('B') + '.' }],
            'The midpoint (not between the endpoints) and the slope (reciprocal, much too steep or too shallow) are badly off; the wrong distance lands nearer the right value, so that error is the easiest to miss.', ['Compare each wrong answer with your corrected one.'], 'which errors are far off'); } }] },
    /* ---------------- EP13 ---------------- */
    { num: '13', parts: [
      { id: 'e13', level: 'EMG', make: function () {
        var rows = [
          { id: 'a', html: 'Two segments with the same length must have the same slope.', truth: false, why: 'Counterexample: ' + t('(0,0)') + ' to ' + t('(5,0)') + ' and ' + t('(0,0)') + ' to ' + t('(0,5)') + ' both have length ' + t('5') + ', with slopes ' + t('0') + ' and undefined.' },
          { id: 'b', html: 'Two different segments can have the same midpoint.', truth: true, why: 'True: ' + t('(-3,0)') + ' to ' + t('(3,0)') + ' and ' + t('(0,-4)') + ' to ' + t('(0,4)') + ' are both centred at ' + t('(0,0)') + '.' },
          { id: 'c', html: 'If ' + t('m_{AB}=m_{BC}') + ', then ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ' are collinear.', truth: true, why: 'True: equal slopes through the shared point ' + t('B') + ' put ' + t('C') + ' on line ' + t('AB') + '.' },
          { id: 'd', html: 'A segment whose slope is undefined has length ' + t('|y_2-y_1|') + '.', truth: true, why: 'True: undefined slope means the run is ' + t('0') + ' (vertical), so the length is the change in ' + t('y') + '.' },
          { id: 'e', html: 'If two slopes have opposite signs, the lines are perpendicular.', truth: false, why: 'Counterexample: ' + t('\\frac{3}{4}') + ' and ' + t('-\\frac{1}{2}') + ': the product is ' + t('-\\frac{3}{8}\\ne -1') + '.' },
          { id: 'f', html: 'A quadrilateral with four equal sides must be a square.', truth: false, why: 'Counterexample: a rhombus such as ' + t('(-6,1),(-2,-2),(2,1),(-2,4)') + ' has four sides of length ' + t('5') + ' and no right angle.' }];
        return tfGrid('State whether each claim is true or false.', rows, rows.map(function (x) { return '(' + x.id + ') ' + x.why; }).join('<br>'), ['For each “false”, try to think of a specific counterexample.'], 'true or false claims');
      } }] },
    /* ---------------- EP14 ---------------- */
    { num: '14', stem: 'Name the most precise quadrilateral that must result from each set of diagonal properties.', parts: [
      { id: 'e14', level: 'PRG', make: function () {
        var rows = [{ id: 'a', html: '(a) The diagonals bisect each other.' }, { id: 'b', html: '(b) They bisect each other and are equal in length.' }, { id: 'c', html: '(c) They bisect each other and are perpendicular.' }, { id: 'd', html: '(d) They bisect each other, are equal, and are perpendicular.' }];
        return B.grid('Choose a name for each.', rows, [{ id: 'para', html: 'Parallelogram' }, { id: 'rect', html: 'Rectangle' }, { id: 'rhom', html: 'Rhombus' }, { id: 'sq', html: 'Square' }], { a: 'para', b: 'rect', c: 'rhom', d: 'sq' }, { why: function (row) { return { a: 'Bisecting diagonals alone: a parallelogram.', b: 'Equal diagonals add right angles: a rectangle.', c: 'Perpendicular diagonals add equal sides: a rhombus.', d: 'Both extras: a square.' }[row]; } },
          '(a) parallelogram, (b) rectangle (equal diagonals), (c) rhombus (perpendicular diagonals), (d) square (both).', ['Start from a parallelogram (bisecting diagonals) and add one property at a time.'], 'diagonal properties');
      } }] },
    /* ---------------- EP15 ---------------- */
    { num: '15', section: 'Extra Practice E — Applications', shared: function (r) {
        return gen(r, function (r) { var tr = r.pick([[12, 5], [5, 12], [3, 4], [4, 3], [8, 6], [6, 8]]), k = r.chance(0.5) ? 1 : 1, S = [-r.int(6, 9), -r.int(2, 5)], L = add(S, [tr[0] * k, tr[1] * k]), A = add(L, [tr[1], -tr[0]]); if (!inBox(L, 12) || !inBox(A, 14) || (S[0] + A[0]) % 1) return null; return { S: S, L: L, A: A }; }, { S: [-8, -4], L: [4, 1], A: [9, -11] });
      },
      stem: function (s) { return 'A town map is drawn on coordinate axes with one grid unit equal to ' + t('100') + ' m. The school is at ' + nP('S', s.S) + ', the library at ' + nP('L', s.L) + ' and the arena at ' + nP('A', s.A) + '.'; },
      parts: [
        { id: 'e15a', level: 'EMG', make: function (r, s) { var a = Math.sqrt(d2(s.S, s.L)) * 100, b = Math.sqrt(d2(s.L, s.A)) * 100; return multi('(a) Find the distance from the school to the library, and from the library to the arena, in metres.', [numBox(t('SL='), a, [[a / 100, 'u6l10-scale', 'That is in grid units — multiply by ' + t('100') + ' m.']], ' m'), numBox(t('LA='), b, [[b / 100, 'u6l10-scale', 'That is in grid units — multiply by ' + t('100') + ' m.']], ' m')], distSteps(s.S, s.L, 'SL') + ' units ' + t('=' + a) + ' m<br>' + distSteps(s.L, s.A, 'LA') + ' units ' + t('=' + b) + ' m', ['Distance in grid units, then × 100 m.'], 'distances in metres', [[String(a / 100), String(b / 100)]]); } },
        { id: 'e15b', level: 'EMG', make: function (r, s) { return slopeFields('(b) Find the slopes of ' + t('SL') + ' and ' + t('LA') + ' and their product. Does the route turn a square corner at the library?', [{ nm: 'SL', A: s.S, B: s.L }, { nm: 'LA', A: s.L, B: s.A }], t(calc(s.S, s.L, 'SL')) + '<br>' + t(calc(s.L, s.A, 'LA')) + '<br>' + t(prodT(slopeOf(s.S, s.L), slopeOf(s.L, s.A))) + ': yes, a square corner at the library.', [SLOPE_HINT], 'square corner?', { prod: true }); } },
        { id: 'e15c', level: 'EMG', make: function (r, s) { var p = B.math('(c) A bus shelter goes exactly halfway between the school and the arena. Give its coordinates.', midChk(s.S, s.A), pT(midOf(s.S, s.A)), midSol(s.S, s.A, 'M'), ['Midpoint of ' + t('SA') + '.'], 'bus shelter midpoint', { keys: 'pairs', placeholder: 'e.g. (0.5, -7.5)' }); p.bad = [pT(midOf(s.S, s.L))]; return p; } },
        { id: 'e15d', level: 'PRG', make: function (r, s) { var d = Math.sqrt(d2(s.S, s.A)) * 100, route = (Math.sqrt(d2(s.S, s.L)) + Math.sqrt(d2(s.L, s.A))) * 100, dR = Math.round(d);
          return multi('(d) Find the direct distance from the school to the arena, to the nearest metre, and how much farther the route through the library is.', [{ label: t('SA\\approx'), keys: 'radical', chk: K.approx(d, 0, { diag: function (v) { if (Math.abs(v - d / 100) < 0.6) return { code: 'u6l10-scale', hint: 'Multiply the grid distance by ' + t('100') + ' m.' }; return null; } }), key: String(dR), ans: t('SA\\approx ' + dR) + ' m' }, { label: 'Farther by:', keys: 'radical', chk: function (resp) { var p0 = HW.parse.number(String(resp == null ? '' : resp)); if (!p0.ok) return form('notnumber', 'Enter a number of metres.'); return Math.abs(p0.value - (route - d)) <= 1.01 ? ok() : Math.abs(p0.value - route) < 1.01 ? wrong('u6l10-whole', 'That is the whole route. Subtract the direct distance.') : wrong('value', null); }, key: String(Math.round(route - d)), ans: 'about ' + t(Math.round(route - d)) + ' m farther' }],
            distSteps(s.S, s.A, 'SA') + t('\\approx ' + (d / 100).toFixed(3)) + ' units ' + t('\\approx ' + dR) + ' m.<br>Route: ' + t(route + '-' + d.toFixed(1) + '\\approx ' + Math.round(route - d)) + ' m farther.', ['Distance formula for ' + t('SA') + ', × 100. Then subtract it from the route ' + t('SL+LA') + '.'], 'direct vs route', [[String(Math.round(d / 100)), String(route)]]); } }] },
    /* ---------------- EP16 ---------------- */
    { num: '16', shared: function (r) {
        return gen(r, function (r) { var tr = r.pick([[4, 3], [3, 4], [12, 5], [8, 6], [6, 8]]), u = [tr[0], tr[1]], a = r.int(2, 3), b = r.int(1, 2); if (a === b) return null; var sc = r.pick([50, 50, 100, 20]), P0 = [-r.int(8, 11), -r.int(4, 7)], u1 = [u[0] * a / (tr[0] > 6 ? 2 : 1), u[1] * a / (tr[0] > 6 ? 2 : 1)], C = add(P0, u1), E = add(C, [u1[0] / a * b, u1[1] / a * b]); if (![C, E].every(function (X) { return Number.isInteger(X[0]) && Number.isInteger(X[1]) && inBox(X, 14); })) return null; return { P: P0, C: C, E: E, sc: sc, a: a, b: b }; }, { P: [-10, -6], C: [2, 3], E: [10, 9], sc: 50, a: 3, b: 2 });
      },
      stem: function (s) { return 'A drone launches at ' + t(ptT(s.P)) + ', passes a checkpoint at ' + t(ptT(s.C)) + ', and lands at ' + t(ptT(s.E)) + ' on a map where one unit is ' + t(s.sc) + ' m.'; },
      parts: [
        { id: 'e16a', level: 'BEG', make: function (r, s) { return slopeFields('(a) Use slopes to decide whether the drone flew in a straight line: find the slope of each stage.', [{ nm: '1', A: s.P, B: s.C }, { nm: '2', A: s.C, B: s.E }], t(calc(s.P, s.C, '1')) + '<br>' + t(calc(s.C, s.E, '2')) + '<br>Equal slopes through the checkpoint: one straight line.', [SLOPE_HINT], 'straight flight?'); } },
        { id: 'e16b', level: 'EMG', make: function (r, s) { var d1 = Math.sqrt(d2(s.P, s.C)) * s.sc, d2b = Math.sqrt(d2(s.C, s.E)) * s.sc; return multi('(b) Find the distance flown in each stage and in total, in metres.', [numBox('Stage 1 (m):', d1, [[d1 / s.sc, 'u6l10-scale', 'Multiply by ' + t(s.sc) + ' m per unit.']]), numBox('Stage 2 (m):', d2b, [[d2b / s.sc, 'u6l10-scale', 'Multiply by ' + t(s.sc) + ' m per unit.']]), numBox('Total (m):', d1 + d2b, [[(d1 + d2b) / s.sc, 'u6l10-scale', 'Multiply by ' + t(s.sc) + ' m per unit.']])], distSteps(s.P, s.C, 'd_1') + ' units ' + t('=' + d1) + ' m<br>' + distSteps(s.C, s.E, 'd_2') + ' units ' + t('=' + d2b) + ' m<br>Total ' + t(d1 + d2b) + ' m (the same as the direct distance, since the flight is straight).', ['Distance in units, then × ' + t(s.sc) + '.'], 'stage distances', [[String(d1 / s.sc), String(d2b / s.sc), String((d1 + d2b) / s.sc)]]); } },
        { id: 'e16c', level: 'PRG', make: function (r, s) { var M = midOf(s.P, s.E), f = red(s.a, s.a + s.b); return multi('(c) Was the checkpoint halfway? Find the midpoint of launch and landing, and the fraction of the trip the checkpoint actually was.', [ptBox('Midpoint:', M, midChk(s.P, s.E)), { label: 'Fraction of the trip:', keys: 'slope', chk: K.value(sV(f)), key: sT(f), ans: t(sT(f)) }], midSol(s.P, s.E, 'M') + ' — not the checkpoint. The checkpoint is ' + t(s.a) + ' parts of ' + t(s.a + s.b) + ' along (stage 1 ÷ total distance): ' + t(sT(f)) + ' of the trip.', ['Fraction = stage-1 distance ÷ total distance.'], 'midpoint and fraction', [[pT(s.C), '\\frac{1}{2}']]); } }] },
    /* ---------------- EP17 ---------------- */
    { num: '17', shared: function (r) {
        return gen(r, function (r) { var tr = r.pick([[15, 8, 17], [8, 15, 17], [12, 5, 13], [4, 3, 5], [12, 9, 15], [6, 8, 10]]), A = [-r.int(4, 7), -r.int(1, 4)], Bq = add(A, [tr[0], tr[1]]); if (!inBox(Bq, 14)) return null; var s = slopeOf(A, Bq), ps = perpOf(s), P = [-r.int(2, 5), r.int(3, 7)], j = r.int(1, 2) * (r.chance(0.5) ? 1 : -1), par = r.chance(0.7), dirv = par ? [ps[1], ps[0]] : [ps[1] + 1, ps[0]], Q = add(P, dirv, j); if (!inBox(Q, 14)) return null; return { A: A, B: Bq, L: tr[2], P: P, Q: Q, par: par && sEq(slopeOf(P, Q), ps) }; }, { A: [-6, -2], B: [9, 6], L: 17, P: [-4, 5], Q: [4, -10], par: true });
      },
      stem: function (s) { return 'A straight section of highway runs from ' + t(ptT(s.A)) + ' to ' + t(ptT(s.B)) + ' on a map where one unit is ' + t('1') + ' km.'; },
      parts: [
        { id: 'e17a', level: 'EMG', make: function (r, s) { var sl = slopeOf(s.A, s.B); return multi('(a) Find the length of the highway and its slope.', [{ label: 'Length (km):', keys: 'radical', chk: exactChk(d2(s.A, s.B), distDiag(s.A, s.B)), key: String(s.L), ans: t(s.L) + ' km' }, { label: t('m='), keys: 'slope', chk: slopeChk(sl, dnDiag(s.A, s.B)), key: sT(sl), ans: t('m=' + sT(sl)) }], distSteps(s.A, s.B, 'd') + ' km; ' + t(calc(s.A, s.B, 'm').replace('m_{m}=', 'm=')), ['Distance formula and slope formula.'], 'highway length and slope'); } },
        { id: 'e17b', level: 'EMG', make: function (r, s) { var sl = slopeOf(s.A, s.B), M = midOf(s.A, s.B); return multi('(b) A service road leaves the highway at its midpoint, at right angles to it. Give the midpoint and the slope of the service road.', [ptBox('Midpoint:', M, midChk(s.A, s.B)), { label: t('m_{\\perp}='), keys: 'slope', chk: relChk(sl, 'perp'), key: sT(perpOf(sl)), ans: t('m_{\\perp}=' + sT(perpOf(sl))) }], midSol(s.A, s.B, 'M') + '; at right angles: the negative reciprocal, ' + t(sT(perpOf(sl))) + '.', ['Midpoint formula; negative reciprocal.'], 'service road'); } },
        { id: 'e17c', level: 'EMG', make: function (r, s) { var sq = slopeOf(s.P, s.Q), ps = perpOf(slopeOf(s.A, s.B));
          return B.mc(r, '(c) A second road runs from ' + t(ptT(s.P)) + ' to ' + t(ptT(s.Q)) + '. Is it parallel to the service road?', [
            { html: '<b>Yes</b> — its slope is ' + t(sT(sq)) + ', the same as the service road.', right: s.par, why: s.par ? null : 'Its slope is ' + t(sT(sq)) + ', but the service road’s is ' + t(sT(ps)) + '.' },
            { html: '<b>No</b> — its slope ' + t(sT(sq)) + ' is not ' + t(sT(ps)) + '.', right: !s.par, why: s.par ? 'Compare again: ' + t(sT(sq)) + ' is the service road’s slope.' : null },
            { html: '<b>No</b> — it is perpendicular to the highway, so it can’t be parallel to anything.', why: 'A line perpendicular to the highway is parallel to every other line perpendicular to the highway.' }],
            t(calc(s.P, s.Q)) + (s.par ? ': the same as the service road, so <b>parallel</b> (and perpendicular to the highway).' : ': not ' + t(sT(ps)) + ', so <b>not</b> parallel.'), ['Find the slope of the second road and compare.'], 'parallel to the service road?'); } }] },
    /* ---------------- EP18 ---------------- */
    { num: '18', section: 'Extra Practice F — Challenge', shared: function (r) {
        return gen(r, function (r) { var tr = r.pick([[6, 8, 10], [8, 6, 10], [3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [9, 12, 15]]), A = [tr[0] * (r.chance(0.8) ? 1 : -1), r.int(-4, 3)]; return { A: A, d: tr[2], ys: [A[1] + tr[1], A[1] - tr[1]], h: tr[1] }; }, { A: [6, -2], d: 10, ys: [6, -10], h: 8 });
      },
      stem: function (s) { return '<b>Two answers.</b> Point ' + t('A') + ' is ' + t(ptT(s.A)) + '.'; },
      parts: [
        { id: 'e18a', level: 'ADV', make: function (r, s) { var P1 = [0, s.ys[0]], P2 = [0, s.ys[1]];
          var p = B.math('(a) Find <b>both</b> points on the ' + t('y') + '-axis that are exactly ' + t(s.d) + ' units from ' + t('A') + '. (The points are ' + t('(0,\\ y)') + '.)', K.pairs([P1, P2]), '\\{' + pT(P1) + ', ' + pT(P2) + '\\}',
            t('\\sqrt{(0-' + nb(s.A[0]) + ')^{2}+(y-' + nb(s.A[1]) + ')^{2}}=' + s.d + '\\ \\Rightarrow\\ ' + s.A[0] * s.A[0] + '+(y-' + nb(s.A[1]) + ')^{2}=' + s.d * s.d + '\\ \\Rightarrow\\ (y-' + nb(s.A[1]) + ')^{2}=' + s.h * s.h + '\\ \\Rightarrow\\ y-' + nb(s.A[1]) + '=\\pm ' + s.h) + ': ' + t(ptT(P1)) + ' and ' + t(ptT(P2)) + '.', ['Put ' + t('(0,\\ y)') + ' into the distance formula, square both sides and solve.', 'A square has two square roots: ' + t('\\pm') + '.'], 'two points at a distance', { keys: 'pairs', placeholder: 'e.g. {(0, 6), (0, -10)}' });
          p.bad = [pT(P1)].concat(s.A[1] ? ['\\{' + pT([0, s.h]) + ', ' + pT([0, -s.h]) + '\\}'] : []); return p; } },
        { id: 'e18b', level: 'EMG', make: function (r, s) { var P1 = [0, s.ys[0]], P2 = [0, s.ys[1]]; return slopeFields('(b) Find the slope of the segment from ' + t('A') + ' to each point, ' + nP('P', P1) + ' and ' + nP('Q', P2) + '.', [{ nm: 'AP', A: s.A, B: P1 }, { nm: 'AQ', A: s.A, B: P2 }], t(calc(s.A, P1, 'AP')) + '<br>' + t(calc(s.A, P2, 'AQ')) + '<br>Same steepness, opposite signs: one segment falls to the right, the other rises.', [SLOPE_HINT], 'two slopes'); } },
        { id: 'e18c', level: 'EMG', make: function (r, s) { var a = slopeOf(s.A, [0, s.ys[0]]), b = slopeOf(s.A, [0, s.ys[1]]), pp = relKind(a, b) === 'perp';
          return B.mc(r, '(c) With slopes ' + t(sT(a)) + ' and ' + t(sT(b)) + ', are the two segments perpendicular?', [
            { html: '<b>No</b> — the product is ' + t(frT(prod(a, b)[0], prod(a, b)[1])) + ', not ' + t('-1') + '.', right: !pp, why: pp ? 'Multiply again.' : null },
            { html: '<b>Yes</b> — the slopes have opposite signs.', why: 'Opposite signs aren’t enough: the product must be exactly ' + t('-1') + '.' },
            { html: '<b>Yes</b> — the product is ' + t('-1') + '.', right: pp, why: pp ? null : 'Multiply: ' + t(prodT(a, b)) + '.' }],
            t(prodT(a, b)) + (pp ? ': perpendicular.' : ': <b>not</b> perpendicular — opposite signs are not enough.'), ['Multiply the two slopes.'], 'perpendicular?'); } }] },
    /* ---------------- EP19 ---------------- */
    { num: '19', parts: [
      { id: 'e19', level: 'MAS', make: function (r) {
        var g = gen(r, function (r) { var A = [-r.int(2, 8), r.int(1, 6)], Bq = [r.int(0, 6), -r.int(1, 7)]; var num = (Bq[0] * Bq[0] + Bq[1] * Bq[1]) - (A[0] * A[0] + A[1] * A[1]), den = 2 * (Bq[0] - A[0]); if (!den || num % den) return null; var x = num / den; if (Math.abs(x) > 10 || A[1] + Bq[1] === 0) return null; return { A: A, B: Bq, x: x }; }, { A: [-6, 3], B: [2, -5], x: -1 });
        var X = [g.x, 0], M = midOf(g.A, g.B), dA = d2(X, g.A);
        var p = B.math('Find the point on the ' + t('x') + '-axis that is the same distance from ' + nP('A', g.A) + ' as it is from ' + nP('B', g.B) + '.', ptChk(X, [[M, 'u6l10-midpoint', 'That is the midpoint of ' + t('AB') + ' — it is equidistant, but it isn’t on the ' + t('x') + '-axis. Use ' + t('(x,\\ 0)') + '.'], [[0, g.x], 'pt-swap', 'A point on the ' + t('x') + '-axis is ' + t('(x,\\ 0)') + '.']]), pT(X),
          'Let the point be ' + t('(x,\\ 0)') + ': ' + t('(x-' + nb(g.A[0]) + ')^{2}+' + nb(-g.A[1]) + '^{2}=(x-' + nb(g.B[0]) + ')^{2}+' + nb(-g.B[1]) + '^{2}') + '. Expanding, the ' + t('x^{2}') + ' terms cancel: ' + t('x=' + g.x) + '. Check: both distances are ' + t('\\sqrt{' + dA + '}') + '.<br>Or: it lies on the perpendicular bisector of ' + t('AB') + ' (through ' + t(ptT(M)) + ', slope ' + t(sT(perpOf(slopeOf(g.A, g.B)))) + '), which crosses the ' + t('x') + '-axis at ' + t(ptT(X)) + '.',
          ['The point is ' + t('(x,\\ 0)') + '. Set the two squared distances equal; the ' + t('x^{2}') + ' terms cancel.', 'Or: walk along the perpendicular bisector of ' + t('AB') + ' from its midpoint to the ' + t('x') + '-axis.'], 'equidistant point on the x-axis', { keys: 'pairs', placeholder: 'e.g. (-1, 0)' });
        p.bad = [pT(M), pT([0, g.x === 0 ? 1 : g.x])]; return p;
      } }] },
    /* ---------------- EP20 ---------------- */
    { num: '20', parts: [
      { id: 'e20', level: 'MAS', make: function (r) {
        var g = gen(r, function (r) { var A = [-r.int(4, 7), -r.int(1, 4)], Bq = [r.int(-2, 1), r.int(0, 3)], C = [r.int(3, 6), -r.int(0, 3)]; if (onLine(A, Bq, C)) return null; return { A: A, B: Bq, C: C }; }, { A: [-7, -3], B: [-1, 1], C: [5, -2] });
        var D1 = [g.A[0] + g.C[0] - g.B[0], g.A[1] + g.C[1] - g.B[1]], D2 = [g.A[0] + g.B[0] - g.C[0], g.A[1] + g.B[1] - g.C[1]], D3 = [g.B[0] + g.C[0] - g.A[0], g.B[1] + g.C[1] - g.A[1]];
        var p = B.math('Three vertices of a parallelogram are ' + nP('A', g.A) + ', ' + nP('B', g.B) + ' and ' + nP('C', g.C) + '. There are <b>three</b> different points ' + t('D') + ' that complete a parallelogram (one for each choice of which two points form a diagonal). Find all three.', K.pairs([D1, D2, D3], {}), '\\{' + [D1, D2, D3].map(pT).join(', ') + '\\}',
          t('AC') + ' a diagonal: ' + t('D=A+C-B=' + ptT(D1)) + '.<br>' + t('AB') + ' a diagonal: ' + t('D=A+B-C=' + ptT(D2)) + '.<br>' + t('BC') + ' a diagonal: ' + t('D=B+C-A=' + ptT(D3)) + '.<br>In each case the two diagonals share a midpoint, e.g. ' + t('AC') + ' and ' + t('BD') + ' are both centred at ' + t(ptT(midOf(g.A, g.C))) + '.',
          ['The diagonals of a parallelogram bisect each other: if ' + t('AC') + ' is a diagonal, ' + t('D') + ' is the point with the same midpoint as ' + t('AC') + ' when joined to ' + t('B') + '.', 'Try each pair of points as the diagonal: ' + t('D=A+C-B') + ', and so on.'], 'three fourth vertices', { keys: 'pairs', placeholder: 'e.g. {(1, 2), (3, 4), (5, 6)}' });
        p.bad = [pT(D1), '\\{' + pT(D1) + ', ' + pT(D2) + '\\}']; return p;
      } }] }
  ];

  function lbl(P, name) { return { x: P[0], y: P[1], label: name }; }
  function graphOf(spec) { return '<div class="fig">' + HW.graph(spec) + '</div>'; }

  HW.defineLesson({
    id: 'u6l10', unit: 6, num: '10', title: 'Unit Review: Coordinate Geometry', outcome: 'RF3',
    blurb: 'Mixed review of the whole unit: the Pythagorean theorem, lengths and the distance formula, midpoints and missing endpoints, slope, collinearity, parallel and perpendicular segments, right triangles and quadrilaterals.',
    questions: QUESTIONS, extra: EXTRA
  });
})(window);
