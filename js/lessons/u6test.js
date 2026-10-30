/* Math 15 · Unit 6 Test (RF3) — Characteristics of Linear Relations: Pythagoras, length, distance, midpoint and slope.
 * Built the way the Math 10C Unit 6 Test was built (Beginning / Progressing / Mastery boxes, mostly typed answers and
 * answers read off graphs, keys built from the generated numbers, `bad` answers with u6t- codes, worked solutions and
 * hints) but pitched at Math 15 and NOT based on the Math 15 multiple-choice paper tests. One 75-minute class,
 * scientific calculator allowed; one outcome (RF3, as Ryan tags every Unit 6 question); 19 questions / 31 parts:
 * Beginning 7 questions / 10 parts, Progressing 7 / 13, Mastery 5 / 8.
 *
 * How each box is pitched (numbers come from Ryan's Math 15 Lessons 1–10, assignments, extra practice and exit slips;
 * their numbers and situations are possible values):
 *   Beginning  — each lesson's core skill as first taught: name the hypotenuse of a right triangle and find it from two
 *                legs (L1); lengths of a horizontal and a vertical segment from coordinates (L2); run, rise and length of
 *                a segment drawn on a grid (L3, the right triangle under it); the midpoint of two points with small
 *                positive coordinates (L4); rise, run and slope counted off a grid and the type of four slopes from the
 *                picture (L6, L7); a ramp / trail / road / staircase slope in lowest terms (L6 Ex 5); parallel,
 *                perpendicular or neither from two given slopes (L9 #5).
 *   Progressing — the typical assignment question: distance (to the nearest tenth), midpoint and simplified slope of one
 *                segment with negative coordinates (L3, L4, L6, L10 #6–14); a missing endpoint from a midpoint (L5 #1–2 —
 *                Ryan's own exit slips tag this PRG); slope as a rate of change from a two-column table, with units, and
 *                a prediction from it (L6, EP06 #8–10); zero vs undefined from coordinates and from y = k / x = k
 *                (L7 #4–7, #9); slopes of two segments then parallel / perpendicular / neither (L9 #14); the slope test
 *                for three points (L8 #3–5); the slope of a segment on a grid and of a line perpendicular to it (L9,
 *                Ryan's L9 exit slip).
 *   Mastery    — Math 15's hardest assignment / extra-practice items, clearly easier than the 10C Mastery box: a trail
 *                with its trailhead and midpoint bench — the far end, then the whole length in metres (L5 #11, Ryan's L5
 *                slip); the missing coordinate that makes three points collinear (L8 #7, Ryan's L8 slip); the missing
 *                coordinate that makes two segments perpendicular or parallel, with the slopes as scaffolding (L9 #12,
 *                L10 #26); a triangle classified with slopes (right angle) and lengths (isosceles?) (L9 #11, L10 #24);
 *                naming two students' slope errors and giving the correct slope (EP06 #12–13).
 * Coverage: L1 Q1 · L2 Q2 · L3 Q3, Q8a, Q15b, Q18b · L4 Q4, Q8b · L5 Q9, Q15 · L6 Q5a, Q6, Q8c, Q10, Q19 ·
 *           L7 Q5b, Q11 · L8 Q13, Q16 · L9 Q7, Q12, Q14, Q17, Q18a · L10 (review) Q8, Q17, Q18.
 * Answers: lengths take the exact radical (any form) or a decimal rounded to the tenth; slopes take equivalent fractions
 * and decimals ("in lowest terms" only where the question says so); "undefined" for a vertical segment (the undef. key).
 * Conversions to online: "identify the hypotenuse" → type its two letters; "explain whether collinear / parallel /
 * perpendicular" → the slopes in boxes, then a choice whose options each carry a reason (Progressing only); "show the
 * triangle has a right angle" → the two slopes and their product in boxes; "explain the student's mistake" → a table that
 * names each student's error, then the correct slope (as the 10C test does it). */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, Ln = HW.lines, F = HW.fmt;

  HW.addCodes({
    'u6t-hyp-leg': 'Named a leg as the hypotenuse', 'u6t-pyth-add': 'Added the legs instead of using a² + b² = c²', 'u6t-no-root': 'Gave the square (did not take the square root)',
    'u6t-pyth-sub': 'Subtracted the squares instead of adding', 'u6t-len-neg': 'Length given as a negative number', 'u6t-len-signs': 'Length: lost a negative coordinate (subtracted or added the sizes)',
    'u6t-mid-sub': 'Midpoint: subtracted the coordinates instead of adding', 'u6t-mid-nohalf': 'Midpoint: added the coordinates but did not divide by 2',
    'u6t-rr-swap': 'Rise and run swapped', 'u6t-rr-sign': 'Rise / run with the wrong sign', 'u6t-rr-count': 'Miscounted the rise or the run',
    'u6t-row-one': 'One row of the table wrong', 'u6t-rows': 'Several rows of the table wrong', 'u6t-one-entry': 'One box wrong (the rest right)',
    'u6t-d-legs': 'Distance: added the run and the rise', 'u6t-d-added': 'Distance: added the coordinates instead of subtracting', 'u6t-d-sign': 'Distance: sign slip subtracting a negative',
    'u6t-end-avg': 'Missing endpoint: averaged the endpoint and the midpoint', 'u6t-end-step': 'Missing endpoint: gave the step from the endpoint to the midpoint',
    'u6t-end-sign': 'Missing endpoint: added the known endpoint instead of subtracting', 'u6t-end-sum': 'Missing endpoint: added the endpoint and the midpoint',
    'u6t-end-double': 'Missing endpoint: doubled the midpoint but did not subtract', 'u6t-double-neg': 'Slope: sign slip subtracting a negative coordinate',
    'u6t-no-run': 'Gave the change in the quantity (did not divide by the change in time)', 'u6t-rate-flip': 'Rate upside down (change in time over change in amount)',
    'u6t-rate-point': 'Divided one column’s values instead of the changes', 'u6t-rate-sign': 'Rate of change with the wrong sign',
    'u6t-pred-nostart': 'Prediction: rate × time only (no starting amount)', 'u6t-pred-from0': 'Prediction: used the whole time instead of the time after the table',
    'u6t-pred-sign': 'Prediction: changed the amount the wrong way', 'u6t-pred-col': 'Prediction: started from the wrong column',
    'u6t-zero-und': 'Mixed up zero and undefined slope (one segment)', 'u6t-zero-und-all': 'Mixed up zero and undefined slope (both)',
    'u6t-perp-same': 'Gave the same slope for a perpendicular', 'u6t-perp-recip': 'Perpendicular slope: took the reciprocal but kept the sign',
    'u6t-perp-noflip': 'Perpendicular slope: changed the sign without taking the reciprocal', 'u6t-par-perp': 'Gave the perpendicular slope for a parallel line',
    'u6t-half': 'Gave half the length (endpoint to midpoint)', 'u6t-no-scale': 'Length left in grid units (scale not used)', 'u6t-half-noscale': 'Half the length, in grid units',
    'u6t-k-flip': 'Solved for the coordinate with run over rise', 'u6t-k-sign': 'Sign slip solving for the coordinate', 'u6t-k-no-start': 'Gave the rise or run, not the coordinate',
    'u6t-k-rel': 'Used the other relationship (parallel ↔ perpendicular)', 'u6t-k-nosign': 'Used the reciprocal slope without changing the sign', 'u6t-k-noflip': 'Changed the sign of the slope without taking the reciprocal',
    'u6t-prod-sign': 'Product of the slopes with the wrong sign', 'u6t-iso': 'Wrong isosceles decision', 'u6t-copied': 'Gave a student’s wrong answer', 'u6t-err-one': 'Named one student’s error wrongly',
    'u6t-yesno-form': 'Not a yes/no answer', 'u6t-side-form': 'Not a side name'
  });
  HW.addPartial({
    'u6t-hyp-leg': 'n', 'u6t-pyth-add': 'n', 'u6t-no-root': 'b', 'u6t-pyth-sub': 'n', 'u6t-len-neg': 's', 'u6t-len-signs': 'b', 'u6t-mid-sub': 'n', 'u6t-mid-nohalf': 'b',
    'u6t-rr-swap': 'b', 'u6t-rr-sign': 's', 'u6t-rr-count': 's', 'u6t-row-one': 's', 'u6t-rows': 'n', 'u6t-one-entry': 's', 'u6t-d-legs': 'n', 'u6t-d-added': 'n', 'u6t-d-sign': 's',
    'u6t-end-avg': 'n', 'u6t-end-step': 'b', 'u6t-end-sign': 's', 'u6t-end-sum': 'n', 'u6t-end-double': 'b', 'u6t-double-neg': 's', 'u6t-no-run': 'b', 'u6t-rate-flip': 'b',
    'u6t-rate-point': 'b', 'u6t-rate-sign': 's', 'u6t-pred-nostart': 'n', 'u6t-pred-from0': 'b', 'u6t-pred-sign': 's', 'u6t-pred-col': 'b', 'u6t-zero-und': 'b', 'u6t-zero-und-all': 'n',
    'u6t-perp-same': 'n', 'u6t-perp-recip': 'b', 'u6t-perp-noflip': 'b', 'u6t-par-perp': 'n', 'u6t-half': 'b', 'u6t-no-scale': 'b', 'u6t-half-noscale': 'n',
    'u6t-k-flip': 'b', 'u6t-k-sign': 's', 'u6t-k-no-start': 'b', 'u6t-k-rel': 'n', 'u6t-k-nosign': 'b', 'u6t-k-noflip': 'b', 'u6t-prod-sign': 's', 'u6t-iso': 'b', 'u6t-copied': 'n', 'u6t-err-one': 'b'
  });

  /* ================= numbers and LaTeX (as in the 10C Unit 6 test and exit slips) ================= */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function red(p, q) { if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function near(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nz(a, b) { return range(a, b).filter(function (x) { return x !== 0; }); }
  function frT(p, q) { return Ln.frT(p, q); }
  function sT(s) { return s == null ? '\\text{undefined}' : frT(s[0], s[1]); }
  function sP(s) { var x = sT(s); return s && s[0] < 0 ? '\\left(' + x + '\\right)' : x; }
  function sV(s) { return s == null ? null : s[0] / s[1]; }
  function vT(v) { var f = Ln.toFr(v); return frT(f[0], f[1]); }
  function dT(x) { return F(cl(x)); }
  function nb(x) { return x < 0 ? '(' + x + ')' : String(x); }
  function ptT(p) { return '(' + p[0] + ',\\ ' + p[1] + ')'; }
  function ptKey(p) { return '(' + cl(p[0]) + ', ' + cl(p[1]) + ')'; }
  function nP(n, p) { return t(n + ptT(p)); }
  function slopeOf(A, B) { var dx = B[0] - A[0], dy = B[1] - A[1]; return dx === 0 ? null : red(dy, dx); }
  function sEq(a, b) { if (a == null || b == null) return a == null && b == null; return a[0] * b[1] === a[1] * b[0]; }
  function perpOf(s) { if (s == null) return [0, 1]; if (s[0] === 0) return null; return red(-s[1], s[0]); }
  function find(gen, test, fb) { for (var i = 0; i < 1500; i++) { var v = gen(); if (v != null && test(v)) return v; } return fb; }
  function inBox(p, b) { return Math.abs(p[0]) <= b && Math.abs(p[1]) <= b; }
  function samePt(a, b) { return near(a[0], b[0]) && near(a[1], b[1]); }
  function mid(a, b) { return [cl((a[0] + b[0]) / 2), cl((a[1] + b[1]) / 2)]; }
  function add(a, b) { return [cl(a[0] + b[0]), cl(a[1] + b[1])]; }
  function sub(a, b) { return [cl(a[0] - b[0]), cl(a[1] - b[1])]; }
  function scl(a, k) { return [cl(a[0] * k), cl(a[1] * k)]; }
  function d2Of(a, b) { return (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]); }
  function simp(n) { var k = 1, m = n; for (var f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; } return [k, m]; }
  function radT(n) { var s = simp(n); return s[1] === 1 ? String(s[0]) : (s[0] === 1 ? '' : s[0]) + '\\sqrt{' + s[1] + '}'; }
  function r1(x) { return K.roundTo(x, 1); }
  function lenAns(d2) { var s = simp(d2); return s[1] === 1 ? String(s[0]) : radT(d2) + '\\approx ' + dT(r1(Math.sqrt(d2))); }
  function lenKey(d2) { var s = simp(d2); return s[1] === 1 ? String(s[0]) : String(r1(Math.sqrt(d2))); }
  function money(x) { x = cl(x); return Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : x.toFixed(2); }
  /* m = (y2 − y1)/(x2 − x1) = dy/dx = reduced */
  function calc(A, B, nm) {
    var dy = B[1] - A[1], dx = B[0] - A[0];
    var s = (nm ? 'm_{' + nm + '}=' : '') + '\\frac{' + B[1] + '-' + nb(A[1]) + '}{' + B[0] + '-' + nb(A[0]) + '}=\\frac{' + dy + '}{' + dx + '}';
    if (dx === 0) return s + ',\\ \\text{undefined}';
    var f = sT(red(dy, dx)); return f === '\\frac{' + dy + '}{' + dx + '}' ? s : s + '=' + f;
  }
  function dLine(p, q, name) {
    var dx = q[0] - p[0], dy = q[1] - p[1], d2 = dx * dx + dy * dy, s = simp(d2);
    var out = (name ? name + '=' : '') + '\\sqrt{(' + q[0] + '-' + nb(p[0]) + ')^{2}+(' + q[1] + '-' + nb(p[1]) + ')^{2}}=\\sqrt{' + nb(dx) + '^{2}+' + nb(dy) + '^{2}}=\\sqrt{' + (dx * dx) + '+' + (dy * dy) + '}=\\sqrt{' + d2 + '}';
    if (s[1] === 1) return out + '=' + s[0];
    return out + (s[0] > 1 ? '=' + radT(d2) : '') + '\\approx ' + dT(r1(Math.sqrt(d2)));
  }
  function mLine(p, q, name) {
    return (name ? name + '=' : '') + '\\left(\\dfrac{' + p[0] + '+' + nb(q[0]) + '}{2},\\ \\dfrac{' + p[1] + '+' + nb(q[1]) + '}{2}\\right)=\\left(\\dfrac{' + (p[0] + q[0]) + '}{2},\\ \\dfrac{' + (p[1] + q[1]) + '}{2}\\right)=' + ptT(mid(p, q));
  }
  var SLOPE_HINT = 'Slope ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + ': subtract in the <b>same order</b> on the top and the bottom.';
  var FIELDHELP = 'Type <b>undefined</b> (the <b>undef.</b> key) for a vertical segment.';
  var HD = ['Distance formula: ' + t('d=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}') + '. Find the run and the rise, square each, add, then take the square root.', 'Watch the signs: subtracting a negative coordinate means adding, e.g. ' + t('3-(-4)=7') + '.'];
  var HM = ['Midpoint formula: ' + t('M\\left(\\dfrac{x_1+x_2}{2},\\ \\dfrac{y_1+y_2}{2}\\right)') + ' — average the ' + t('x') + '-coordinates and average the ' + t('y') + '-coordinates.', 'Add the coordinates (don’t subtract), then divide each sum by ' + t('2') + '.'];
  var HE = ['If ' + t('M') + ' is the midpoint, the step from the endpoint you have to ' + t('M') + ' is the same as the step from ' + t('M') + ' to the missing endpoint.', 'Or: double the midpoint, then subtract the endpoint you have — for the ' + t('x') + '-coordinates and for the ' + t('y') + '-coordinates.'];

  /* ================= checkers ================= */
  /* one number (an integer, a decimal or a fraction); alts = [[value, code, hint], …] known wrong values */
  function numChk(target, alts) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/^\s*\\?\$\s*/, '').replace(/^\s*[a-zA-Z]\s*=\s*(?=[-−+.\d\\])/, '').trim(), pn = HW.parse.number(s), v;
      if (pn.ok) v = pn.value;
      else {
        if (pn.code === 'empty') return form('empty', 'Type your answer first.');
        var r0 = K.number(target)(s); if (r0.v === 'form' && r0.code === 'units') return r0;
        var a = K.read(s); if (a.res) return a.res; v = a.val;
        if (!isFinite(v)) return form('notnumber', 'Enter a single number.');
      }
      if (near(v, target)) return ok();
      for (var i = 0; i < (alts || []).length; i++) { var w = alts[i]; if (w[0] != null && isFinite(w[0]) && !near(w[0], target) && (w[3] ? Math.abs(v - w[0]) < w[3] : near(v, w[0]))) return wrong(w[1], w[2]); }
      return wrong('value', null);
    };
  }
  /* alts may carry a tolerance (4th entry) for a wrong value that is a rounded decimal */
  function altBad(target, alts) { var seen = []; return (alts || []).filter(function (w) { if (w[0] == null || !isFinite(w[0]) || near(w[0], target) || seen.some(function (x) { return near(x, w[0]); })) return false; seen.push(w[0]); return true; }).slice(0, 4).map(function (w) { return w[3] ? String(r1(w[0])) : vT(w[0]); }); }
  function numPart(prompt, target, alts, sol, hints, text, inp) {
    inp = inp || {};
    var p = P.math(prompt, numChk(target, alts), vT(target), sol, hints, text, { keys: 'fraction', before: inp.before, after: inp.after, placeholder: inp.placeholder || 'a number' });
    p.answer = t((inp.beforeAns || '') + (inp.ansTex || dT(target))) + (inp.unitAns ? ' ' + inp.unitAns : '');
    p.key = String(cl(target));
    p.bad = altBad(target, alts);
    return p;
  }
  /* a slope; lowest: false accepts an equivalent unreduced fraction */
  function slopeChk(s, diag, lowest) {
    var c = K.slope(s, { diag: diag, lowest: lowest });
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
  /* the slope of a line parallel ('par') or perpendicular ('perp') to a line of slope m */
  function relChk(m, rel) {
    var T = rel === 'perp' ? perpOf(m) : m, base = slopeChk(T, null, false);
    return function (resp) {
      var r0 = base(resp); if (r0.v !== 'wrong') return r0;
      var R = readSlope(resp);
      if (R && R.v != null && m != null && m[0] !== 0) {
        var mv = sV(m);
        if (rel === 'perp') {
          if (near(R.v, mv)) return wrong('u6t-perp-same', 'That is the slope itself — a line with that slope is <b>parallel</b>. Perpendicular slopes are <b>negative reciprocals</b>: flip the fraction and change the sign.');
          if (near(R.v, 1 / mv)) return wrong('u6t-perp-recip', 'You flipped the fraction — now change the sign too. Perpendicular slopes have opposite signs (their product is ' + t('-1') + ').');
          if (near(R.v, -mv)) return wrong('u6t-perp-noflip', 'You changed the sign — now flip the fraction too. The product of the two slopes must be ' + t('-1') + '.');
        } else if (near(R.v, -1 / mv)) return wrong('u6t-par-perp', 'That is the negative reciprocal — the slope of a <b>perpendicular</b> line. Parallel lines have <b>equal</b> slopes.');
      }
      return r0;
    };
  }
  function slopeKeyBad(s) {
    var bad = [];
    if (s && s[0] !== 0) { bad.push(sT([-s[0], s[1]])); bad.push(sT(red(s[1], s[0]))); } else if (s) bad.push('\\text{undefined}'); else bad.push('0');
    return bad.filter(function (b) { return b !== sT(s); });
  }
  function slopeAns(prompt, s, chk, sol, hints, text, before) {
    var p = P.math(prompt, chk || slopeChk(s), sT(s), sol, hints, text, { keys: 'slope', before: before || t('m='), placeholder: 'e.g. -2/3 or undefined' });
    p.bad = slopeKeyBad(s);
    return p;
  }
  function sField(nm, lab) { return { name: lab || 'Slope of ' + nm, label: t('m_{' + nm + '}='), mode: 'math', keys: 'slope', placeholder: 'e.g. -2/3' }; }
  /* several boxes; oneSlip: with 3 or more boxes, one plain wrong value (the rest right) is a small mistake — a box with a
     diagnosed mistake keeps its own code */
  var PLAIN = { value: 1, slope: 1, pt: 1, 'u6t-rr-count': 1 };
  function fieldsChk(checkers, names, oneSlip) {
    return function (resp) {
      resp = resp || []; var firstForm = null, wrongs = [];
      checkers.forEach(function (c, i) {
        var r = c(resp[i] == null ? '' : resp[i]); if (r.v === 'correct') return;
        var out = { v: r.v, code: r.code, hint: (names[i] ? '<b>' + names[i] + ':</b> ' : '') + (r.hint || 'Check this one again.') };
        if (r.v === 'form') { if (!firstForm) firstForm = out; } else wrongs.push(out);
      });
      if (wrongs.length === 1 && oneSlip && checkers.length >= 3 && !firstForm && PLAIN[wrongs[0].code]) return { v: 'wrong', code: 'u6t-one-entry', hint: wrongs[0].hint };
      return wrongs[0] || firstForm || ok();
    };
  }
  function fieldsPart(prompt, fields, checkers, keys, answer, sol, hints, text, oneSlip) {
    var p = P.fields(prompt, fields, checkers, keys, answer, sol, hints, text);
    p.check = fieldsChk(checkers, fields.map(function (f) { return f.name || ''; }), oneSlip);
    return p;
  }
  /* a choice table; one wrong row is oneCode (default a small mistake), more than one is no credit */
  function gridPart(prompt, rows, cols, want, why, sol, hints, text, rowHead, oneCode) {
    var p = P.grid(prompt, rows, cols, want, { rowHead: rowHead }, sol, hints, text);
    p.check = function (resp) {
      resp = resp || {};
      var ids = Object.keys(want), miss = ids.filter(function (k) { return resp[k] == null; });
      if (miss.length === ids.length) return form('empty', 'Fill in the table first.');
      if (miss.length) return form('incomplete', 'Finish every row (' + (ids.length - miss.length) + ' of ' + ids.length + ' done).');
      var bad = ids.filter(function (k) { return resp[k] !== want[k]; });
      if (!bad.length) return ok();
      var h = why ? why(bad[0], resp[bad[0]]) : null;
      return wrong(bad.length === 1 ? (oneCode || 'u6t-row-one') : 'u6t-rows', (h || 'Check that row again.') + (bad.length > 1 ? ' (' + bad.length + ' rows aren’t right yet.)' : ''));
    };
    var cids = cols.map(function (c) { return c.id; }), ids = Object.keys(want);
    p.bad = [ids.reduce(function (o, k, i) { o[k] = i === 0 ? cids[(cids.indexOf(want[k]) + 1) % cids.length] : want[k]; return o; }, {})];
    return p;
  }
  function ynChk(want, code, hint) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').trim().toLowerCase().replace(/[.!]+$/, '');
      if (!s) return form('empty', 'Type <b>yes</b> or <b>no</b>.');
      var y = /^(y|yes|yep|yeah|true)$/.test(s), n = /^(n|no|nope|false)$/.test(s);
      if (!y && !n) return form('u6t-yesno-form', 'Type <b>yes</b> or <b>no</b>.');
      return y === (want === 'yes') ? ok() : wrong(code, hint);
    };
  }
  function ynField(name, label) { return { name: name, label: label, mode: 'text', placeholder: 'yes/no' }; }
  /* a length: the exact radical in any form, or a decimal to the nearest tenth (more decimals are fine) */
  function lenChk(d2, diag) {
    var s = simp(d2), L = Math.sqrt(d2), base = K.radical({ k: s[0], n: 2, m: s[1] }, 'any');
    return function (resp) {
      var str = String(resp == null ? '' : resp).replace(/^\s*[A-Za-z]{1,2}\s*=\s*/, ''), pn = HW.parse.number(str);
      if (pn.ok) {
        var v = pn.value;
        if (Math.abs(v - L) < 0.051) return ok();
        if (diag) { var h = diag(v); if (h) return wrong(h.code, h.hint); }
        if (near(v, Math.trunc(L * 10) / 10) && !near(v, r1(L))) return wrong('truncate', 'Round, don’t chop: ' + t('\\sqrt{' + d2 + '}\\approx ' + dT(Math.round(L * 1000) / 1000)) + ', so look at the next digit.');
        return wrong('value', null);
      }
      if (!String(str).trim()) return form('empty', 'Type your answer first.');
      var r = base(str);
      if (r.v === 'correct' || r.v === 'form') return ok();
      var a = K.read(str);
      if (!a.res && diag) { var h2 = diag(a.val); if (h2) return wrong(h2.code, h2.hint); }
      return r;
    };
  }
  /* known wrong distances between p and q */
  function dCands(p, q) {
    var dx = q[0] - p[0], dy = q[1] - p[1], D = Math.sqrt(dx * dx + dy * dy), out = [];
    function put(v, code, hint) { if (!isFinite(v) || v <= 0 || Math.abs(v - D) < 0.06 || out.some(function (o) { return Math.abs(o[0] - v) < 1e-6; })) return; out.push([v, code, hint]); }
    put(dx * dx + dy * dy, 'u6t-no-root', 'That is ' + t('d^{2}') + ' — the last step of the distance formula is to take the <b>square root</b>.');
    put(Math.abs(dx) + Math.abs(dy), 'u6t-d-legs', 'You added the run and the rise. The segment is the <b>hypotenuse</b> of a right triangle: square the run and the rise, add, then take the square root.');
    var sx = q[0] + p[0], sy = q[1] + p[1];
    put(Math.sqrt(sx * sx + sy * sy), 'u6t-d-added', 'The distance formula <b>subtracts</b> the coordinates (' + t('x_2-x_1') + ' and ' + t('y_2-y_1') + ') — it doesn’t add them.');
    var sh = 'Check your subtraction — subtracting a negative coordinate means adding.';
    put(Math.sqrt(sx * sx + dy * dy), 'u6t-d-sign', sh); put(Math.sqrt(dx * dx + sy * sy), 'u6t-d-sign', sh);
    return out;
  }
  function dDiag(cands) { return function (v) { for (var i = 0; i < cands.length; i++) if (Math.abs(v - cands[i][0]) < 0.051) return { code: cands[i][1], hint: cands[i][2] }; return null; }; }
  function lenBad(d2, cands) { return cands.slice(0, 3).map(function (c) { return String(r1(c[0])); }); }

  /* ================= points (adapted from the 10C Unit 6 exit slips) ================= */
  function stripP(s) {
    return String(s == null ? '' : s).replace(/\\(left|right)\b\.?/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\[,;!: ]/g, '')
      .replace(/\\\{|\\\}|\\lbrace|\\rbrace/g, ' ').replace(/\\text\{\s*and\s*\}/g, ',').trim();
  }
  function simpleNum(ast) { var sh = ex.shape(ast); if (sh.bare) return true; var pf = ex.plainFraction(ast); return !!(pf && pf[1] > 1 && gcd(pf[0], pf[1]) === 1 && !sh.decimals); }
  function coordPair(str) {
    var xy = str.split(','); if (xy.length !== 2 || !xy[0].trim() || !xy[1].trim()) return null;
    var a = ex.parse(xy[0].trim()), b = ex.parse(xy[1].trim()); if (!a.ok || !b.ok) return null;
    var va = ex.value(a.ast), vb = ex.value(b.ast); if (!isFinite(va) || !isFinite(vb)) return null;
    return { x: va, y: vb, simple: simpleNum(a.ast) && simpleNum(b.ast) };
  }
  function readPts(resp) {
    var s = stripP(resp).replace(/^\s*(?:[A-Za-z]\s*=|[A-Z])\s*(?=\()/, '');
    if (/^\{[\s\S]*\}$/.test(s) && !/^\{[^{}]*\}\{/.test(s)) s = s.slice(1, -1).trim();
    if (!s) return { empty: true };
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) { var c = coordPair(m[1]); if (!c) return { bad: true }; out.push(c); }
    if (!out.length) {
      var c2 = coordPair(s); if (c2) return { pts: [c2], noParen: true };
      var one = ex.parse(s); if (one.ok && isFinite(ex.value(one.ast))) return { single: true };
      return { bad: true };
    }
    if (s.replace(re, '').replace(/[,;\s]|and/g, '').length) return { bad: true };
    return { pts: out };
  }
  function ptCheck(W, cands) {
    return function (resp) {
      var L = readPts(resp);
      if (L.empty) return form('empty', 'Type your answer first.');
      if (L.single) return form('pt-not-pair', 'A point needs two coordinates: write it as an ordered pair ' + t('(x,\\ y)') + '.');
      if (L.bad) return form('unreadable', 'Write the point as an ordered pair in brackets, e.g. ' + t('(3,\\ -2)') + ' (press <b>( )</b>, type x, comma, y).');
      if (L.pts.length !== 1) return form('pt-many', 'Give just one point.');
      var p = L.pts[0], Q = [p.x, p.y];
      if (samePt(Q, W)) {
        if (!p.simple) return form('simplify', 'Right point — now simplify each coordinate to a single number (for example ' + t('\\frac{12}{2}=6') + ').');
        return ok();
      }
      for (var i = 0; i < (cands || []).length; i++) if (cands[i][0] && samePt(Q, cands[i][0])) return wrong(cands[i][1], cands[i][2]);
      if (near(Q[0], W[0])) return wrong('pt-y', 'Your ' + t('x') + '-coordinate is right — check the ' + (near(Q[1], -W[1]) ? '<b>sign</b> of the ' : '') + t('y') + '-coordinate.');
      if (near(Q[1], W[1])) return wrong('pt-x', 'Your ' + t('y') + '-coordinate is right — check the ' + (near(Q[0], -W[0]) ? '<b>sign</b> of the ' : '') + t('x') + '-coordinate.');
      return wrong('value', null);
    };
  }
  function ptPart(prompt, W, cands, before, name, sol, hints, text) {
    var bad = [];
    (cands || []).forEach(function (c) { var q = c[0]; if (q && !samePt(q, W) && bad.indexOf(ptKey(q)) < 0) bad.push(ptKey(q)); });
    return { prompt: prompt, input: { type: 'math', keys: 'pairs', before: before, placeholder: 'e.g. (3, -2)' }, check: ptCheck(W, cands), key: ptKey(W), answer: t((name || '') + ptT(W)),
      solution: sol, hints: hints || HM, text: text, good: ['\\left(' + cl(W[0]) + ',' + cl(W[1]) + '\\right)'], bad: bad.slice(0, 4) };
  }
  function midCands(a, b) {
    var h = [cl((b[0] - a[0]) / 2), cl((b[1] - a[1]) / 2)], hs = 'You subtracted the coordinates. The midpoint formula <b>adds</b> them and divides by ' + t('2') + ' — it averages each coordinate.';
    return [[h, 'u6t-mid-sub', hs], [scl(h, -1), 'u6t-mid-sub', hs], [add(a, b), 'u6t-mid-nohalf', 'You added the coordinates — now divide each sum by ' + t('2') + '.']];
  }
  function endCands(a, m) {
    return [[mid(a, m), 'u6t-end-avg', 'You averaged the endpoint and the midpoint — that gives the point halfway between them. The missing endpoint is <i>past</i> the midpoint: double the midpoint, then subtract the endpoint you have.'],
      [sub(m, a), 'u6t-end-step', 'That is the step from the endpoint to the midpoint. Take the same step again, starting from the midpoint.'],
      [add(scl(m, 2), a), 'u6t-end-sign', 'Double the midpoint, then <b>subtract</b> the endpoint you have — watch the signs.'],
      [add(m, a), 'u6t-end-sum', 'Double the midpoint first, then subtract the endpoint you have: ' + t('x=2x_M-x_1') + '.'],
      [scl(m, 2), 'u6t-end-double', 'You doubled the midpoint — now subtract the endpoint you have.']];
  }

  /* ================= figures ================= */
  function distSeg(p, a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy, u = L2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2)) : 0; return Math.hypot(p[0] - a[0] - u * dx, p[1] - a[1] - u * dy); }
  function segsCross(s, u) {
    function o(a, b, c) { var v = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); return v > 0 ? 1 : v < 0 ? -1 : 0; }
    return o(s[0], s[1], u[0]) * o(s[0], s[1], u[1]) <= 0 && o(u[0], u[1], s[0]) * o(u[0], u[1], s[1]) <= 0;
  }
  /* place segments (types: {rise, run}, run >= 0) with integer endpoints in [-lim, lim], apart and off each other */
  function placeSegs(r, types, lim) {
    for (var tries = 0; tries < 6000; tries++) {
      var segs = [], bad = false;
      types.forEach(function (ty) {
        var xlo = -lim, xhi = lim - ty.run, ylo = Math.max(-lim, -lim - ty.rise), yhi = Math.min(lim, lim - ty.rise);
        if (xhi < xlo || yhi < ylo) { bad = true; return; }
        var A = [r.int(xlo, xhi), r.int(ylo, yhi)]; segs.push([A, [A[0] + ty.run, A[1] + ty.rise]]);
      });
      if (bad) continue;
      var ends = []; segs.forEach(function (s) { ends.push(s[0], s[1]); });
      for (var i = 0; i < ends.length && !bad; i++) { if (ends[i][0] === 0 || ends[i][1] === 0) bad = true; for (var j = 0; j < i; j++) if (Math.hypot(ends[i][0] - ends[j][0], ends[i][1] - ends[j][1]) < 2) { bad = true; break; } }
      for (var k = 0; k < segs.length && !bad; k++) for (var e = 0; e < ends.length; e++) if (Math.floor(e / 2) !== k && distSeg(ends[e], segs[k][0], segs[k][1]) < 0.9) { bad = true; break; }
      for (var a = 0; a < segs.length && !bad; a++) for (var b = 0; b < a; b++) if (segsCross(segs[a], segs[b])) { bad = true; break; }
      if (!bad) return segs;
    }
    return null;
  }
  /* segments on a grid, each endpoint labelled beyond its end of the segment */
  function segGraph(segs, names, lim, aria) {
    var svg = HW.graph({ x: [-lim - 1, lim + 1], y: [-lim - 1, lim + 1], labels: 2, segs: segs.map(function (s) { return { pts: [s[0], s[1]], start: 'closed', end: 'closed' }; }), max: 360, aria: aria || 'line segments on a grid' });
    var L = HW.graph.last, extra = '';
    segs.forEach(function (s, i) {
      [0, 1].forEach(function (e) {
        var A = s[e], O = s[1 - e], ax = L.X(A[0]), ay = L.Y(A[1]), dx = ax - L.X(O[0]), dy = ay - L.Y(O[1]), len = Math.hypot(dx, dy) || 1;
        var x = Math.max(9, Math.min(L.W - 9, ax + dx / len * 14)), y = Math.max(9, Math.min(L.H - 9, ay + dy / len * 14));
        extra += '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="14" font-weight="700" font-style="italic" text-anchor="middle" dominant-baseline="central" fill="#2b3340" paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round">' + names[i].charAt(e) + '</text>';
      });
    });
    return '<div class="fig">' + svg.replace(/<\/svg>$/, extra + '</svg>') + '</div>';
  }
  /* a right triangle (right angle at V[0]), turned by rot degrees and maybe mirrored; letters outside the vertices */
  function triFig(nm, a, b, rot, mir) {
    var th = rot * Math.PI / 180, cs = Math.cos(th), sn = Math.sin(th);
    var raw = [[0, 0], [a * (mir ? -1 : 1), 0], [0, b]].map(function (p) { return [p[0] * cs - p[1] * sn, p[0] * sn + p[1] * cs]; });
    var xs = raw.map(function (p) { return p[0]; }), ys = raw.map(function (p) { return p[1]; });
    var W = 300, H = 210, pad = 30, sc = Math.min((W - 2 * pad) / (Math.max.apply(null, xs) - Math.min.apply(null, xs)), (H - 2 * pad) / (Math.max.apply(null, ys) - Math.min.apply(null, ys)));
    var x0 = Math.min.apply(null, xs), y1 = Math.max.apply(null, ys), wUsed = (Math.max.apply(null, xs) - x0) * sc, hUsed = (y1 - Math.min.apply(null, ys)) * sc;
    var V = raw.map(function (p) { return [(W - wUsed) / 2 + (p[0] - x0) * sc, (H - hUsed) / 2 + (y1 - p[1]) * sc]; });
    var cx = (V[0][0] + V[1][0] + V[2][0]) / 3, cy = (V[0][1] + V[1][1] + V[2][1]) / 3, ink = '#2b3340';
    var u1 = [V[1][0] - V[0][0], V[1][1] - V[0][1]], u2 = [V[2][0] - V[0][0], V[2][1] - V[0][1]], l1 = Math.hypot(u1[0], u1[1]), l2 = Math.hypot(u2[0], u2[1]), q = 13;
    var c1 = [V[0][0] + u1[0] / l1 * q, V[0][1] + u1[1] / l1 * q], c2 = [V[0][0] + u2[0] / l2 * q, V[0][1] + u2[1] / l2 * q], c3 = [c1[0] + u2[0] / l2 * q, c1[1] + u2[1] / l2 * q];
    var s = '<path d="M' + V.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L') + ' Z" fill="#eef2f8" stroke="' + ink + '" stroke-width="2"/>';
    s += '<path d="M' + c1[0].toFixed(1) + ' ' + c1[1].toFixed(1) + ' L' + c3[0].toFixed(1) + ' ' + c3[1].toFixed(1) + ' L' + c2[0].toFixed(1) + ' ' + c2[1].toFixed(1) + '" fill="none" stroke="' + ink + '" stroke-width="1.3"/>';
    V.forEach(function (p, i) { var dx = p[0] - cx, dy = p[1] - cy, L = Math.hypot(dx, dy) || 1; s += '<text x="' + (p[0] + dx / L * 16).toFixed(1) + '" y="' + (p[1] + dy / L * 16).toFixed(1) + '" font-size="17" font-style="italic" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="' + ink + '">' + nm[i] + '</text>'; });
    return '<div class="fig"><svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:320px;display:block" role="img" aria-label="right triangle ' + nm.join('') + ' with the right angle at ' + nm[0] + '" font-family="KaTeX_Main, \'Times New Roman\', serif">' + s + '</svg></div>';
  }
  function tbl(xh, yh, xs, ys) { return '<div class="fig">' + HW.valueTable([[xh].concat(xs), [yh].concat(ys)]) + '</div>'; }

  /* ======================= Q1: a right triangle (L1) ======================= */
  var TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [10, 24, 26], [15, 20, 25], [20, 21, 29], [18, 24, 30], [12, 35, 37]];
  var TRIN = [['A', 'B', 'C'], ['P', 'Q', 'R'], ['D', 'E', 'F'], ['J', 'K', 'L'], ['X', 'Y', 'Z'], ['M', 'N', 'P']];
  function sideOk(s, two) { s = String(s || '').replace(/\\overline\{([^}]*)\}|\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, '$1$2$3').replace(/[\s{}\\]/g, '').toUpperCase(); return s === two || s === two.split('').reverse().join(''); }

  /* ======================= Q5: four segments on a grid (L6, L7) ======================= */
  var KIND = { pos: 'positive', neg: 'negative', zero: 'zero', und: 'undefined' };
  var Q5N = ['AB', 'CD', 'EF', 'GH'];

  /* ======================= Q6: slope in a context (L6) ======================= */
  var Q6C = [
    { k: 'ramp', fr: [[1, 12], [1, 10], [1, 8], [1, 15], [2, 25], [1, 16]], ks: [5, 6, 8, 10], u: 'cm', txt: function (h, w) { return 'A wheelchair ramp rises ' + t(h) + ' cm over a horizontal run of ' + t(F(w)) + ' cm.'; } },
    { k: 'trail', fr: [[3, 20], [1, 4], [2, 25], [1, 5], [3, 25], [1, 6], [2, 15]], ks: [5, 10, 15, 20], u: 'm', txt: function (h, w) { return 'A hiking trail climbs from the trailhead at ' + t('(0,\\ 0)') + ' to a lookout at ' + t('(' + w + ',\\ ' + h + ')') + ', where each unit is ' + t('1') + ' m.'; } },
    { k: 'road', fr: [[1, 5], [1, 10], [3, 20], [1, 8], [2, 25]], ks: [10, 25, 50], u: 'm', txt: function (h, w) { return 'A road climbs ' + t(h) + ' m over a horizontal distance of ' + t(F(w)) + ' m.'; } },
    { k: 'stairs', fr: [[4, 5], [3, 4], [2, 3], [5, 6], [7, 10], [5, 7]], ks: [3, 4, 5, 6], u: 'cm', txt: function (h, w) { return 'Each step of a staircase has a rise of ' + t(h) + ' cm and a run of ' + t(w) + ' cm. What is the slope of the line joining the front edges of the steps?'; } }];

  /* ======================= Q10: a rate of change from a table (L6, EP06) ======================= */
  var Q10C = [
    { k: 'tank', intro: 'A tank is draining at a constant rate. The table shows the volume of water in the tank.', xh: 'Time (min)', yh: 'Volume (L)', rs: [-8, -10, -12, -15, -20, -25], unit: '\\text{L/min}', uw: 'L', xw: 'minute', xs: 'minutes', ask: function (x) { return 'At this rate, how much water will be in the tank at ' + t(x) + ' minutes?'; } },
    { k: 'bike', intro: 'A cyclist rides away from a marker at a constant speed. The table shows her distance from the marker.', xh: 'Time (s)', yh: 'Distance (m)', rs: [3, 4, 5, 6, 7, 8], unit: '\\text{m/s}', uw: 'm', xw: 'second', xs: 'seconds', ask: function (x) { return 'At this speed, how far from the marker will she be at ' + t(x) + ' seconds?'; } },
    { k: 'print', intro: 'A print shop charges a set-up fee plus a price for each poster. The table shows the cost of two orders.', xh: 'Posters', yh: 'Cost ($)', rs: [6, 7.5, 8, 9, 10.5, 12], unit: '\\text{\\$/poster}', uw: 'dollars', xw: 'poster', xs: 'posters', money: true, ask: function (x) { return 'At this rate, what is the cost of an order of ' + t(x) + ' posters?'; } },
    { k: 'phone', intro: 'A phone’s battery runs down at a constant rate while a video plays. The table shows the charge left.', xh: 'Time (h)', yh: 'Charge (%)', rs: [-4, -5, -6, -8, -10, -12], unit: '\\%\\text{/h}', uw: '%', xw: 'hour', xs: 'hours', pct: true, ask: function (x) { return 'At this rate, how much charge will be left at ' + t(x) + ' hours?'; } }];
  function q10Shared(r) {
    return find(function () {
      var c = r.pick(Q10C), rt = r.pick(c.rs), x1, x2, x3, y1;
      if (c.k === 'tank') { x1 = r.int(2, 6); x2 = x1 + r.pick([4, 5, 6, 8, 10]); x3 = x2 + r.pick([2, 3, 4, 5]); y1 = r.int(-rt * (x3 - x1) / 5 + 4, 70) * 5; }
      else if (c.k === 'bike') { x1 = r.int(2, 5); x2 = x1 + r.int(4, 8); x3 = x2 + r.int(3, 6); y1 = r.int(6, 20); }
      else if (c.k === 'print') { x1 = r.int(3, 6); x2 = x1 + r.int(4, 8); x3 = x2 + r.int(4, 8); y1 = r.pick([10, 12, 15, 20, 25, 30]) + rt * x1; }
      else { x1 = r.int(1, 3); x2 = x1 + r.int(3, 5); x3 = x2 + r.int(1, 2); y1 = 100 + rt * (x1 - r.pick([0, 0, 1])); }
      var y2 = cl(y1 + rt * (x2 - x1)), y3 = cl(y2 + rt * (x3 - x2));
      return { c: c, r: rt, x: [x1, x2, x3], y: [y1, y2, y3] };
    }, function (v) { return v.y[2] >= 5 && v.y[0] <= (v.c.pct ? 100 : 400) && v.y[0] > 0; }, { c: Q10C[0], r: -15, x: [5, 20, 25], y: [340, 115, 40] });
  }
  function q10Val(c, v) { return c.money ? '\\$' + money(v) : dT(v); }

  /* ======================= Q12 / Q7: parallel or perpendicular ======================= */
  function relKind(a, b) { if (sEq(a, b)) return 'par'; if (a && b && a[0] * b[0] === -a[1] * b[1]) return 'perp'; return 'nei'; }
  function relWhy(a, b, kind) {
    var recip = a && b && a[0] * b[0] === a[1] * b[1];
    return {
      par: { perp: 'Perpendicular slopes multiply to ' + t('-1') + '. Reduce both fractions first — are they equal?', nei: 'Reduce both fractions to lowest terms first, then compare them.' },
      perp: { par: 'Parallel slopes are equal — these aren’t. Multiply them: what do you get?', nei: 'Multiply the two slopes. A product of ' + t('-1') + ' means perpendicular.' },
      nei: { par: 'Parallel slopes are equal (after reducing) — these aren’t.', perp: recip ? 'They are reciprocals, but with the <b>same sign</b>: the product is ' + t('+1') + ', not ' + t('-1') + '. Perpendicular slopes have opposite signs.' : 'Multiply them: the product isn’t ' + t('-1') + ', so they aren’t perpendicular.' }
    }[kind];
  }
  function relSol(a, b) {
    var kind = relKind(a, b);
    if (kind === 'par') return t(sT(a)) + ' and ' + t(sT(b)) + ': equal slopes, so <b>parallel</b>.';
    var pr = red(a[0] * b[0], a[1] * b[1]);
    if (kind === 'perp') return t(sT(a) + '\\times ' + sP(b) + '=' + frT(pr[0], pr[1])) + ', so <b>perpendicular</b>.';
    return 'The slopes are not equal, and ' + t(sT(a) + '\\times ' + sP(b) + '=' + frT(pr[0], pr[1]) + '\\ne -1') + ': <b>neither</b>.';
  }
  var REL_COLS = [{ id: 'par', html: 'Parallel', label: 'Parallel' }, { id: 'perp', html: 'Perpendicular', label: 'Perpendicular' }, { id: 'nei', html: 'Neither', label: 'Neither' }];
  var NICE = [[1, 2], [2, 3], [3, 2], [1, 3], [3, 4], [4, 3], [2, 5], [1, 4], [3, 5], [5, 2], [2, 1], [3, 1], [5, 8], [4, 9], [3, 7], [5, 6]];

  /* ======================= Q19: two students' slope errors (EP06 #12–13) ======================= */
  var STUD = [['Priya', 'Marcus'], ['Amara', 'Ben'], ['Sofia', 'Dev'], ['Lena', 'Omar'], ['Jas', 'Kai'], ['Maya', 'Liam']];
  var PAIRN = [['A', 'B'], ['J', 'K'], ['E', 'F'], ['M', 'N'], ['S', 'T'], ['P', 'Q']];

  /* ======================= the questions (written by lesson; defineTest orders them Beginning → Progressing → Mastery) ======================= */
  var QUESTIONS = [
    /* ---------------- Beginning ---------------- */
    { num: '1', outcome: 'RF3',
      shared: function (r) {
        var tr = r.pick(TRIPLES), sw = r.chance(0.5), nm = r.pick(TRIN).slice(), i0 = r.int(0, 2), order = [nm[i0]].concat(nm.filter(function (x, i) { return i !== i0; }));
        if (r.chance(0.5)) order = [order[0], order[2], order[1]];
        return { a: sw ? tr[1] : tr[0], b: sw ? tr[0] : tr[1], c: tr[2], nm: nm, V: order, rot: r.pick([0, 0, 15, 30, 45, 60, 90, 120, 150, 180, 210, 270, 300, 330]), mir: r.chance(0.5), u: r.pick(['cm', 'm', 'cm']) };
      },
      stem: function (s) { return 'Triangle ' + t(s.nm.join('')) + ' has a right angle at ' + t(s.V[0]) + '.' + triFig(s.V, s.a, s.b, s.rot, s.mir); },
      parts: [
        { id: '1a', outcome: 'RF3', level: 'BEG', make: function (r, s) {
          var hyp = [s.V[1], s.V[2]].sort().join(''), legs = [[s.V[0], s.V[1]].sort().join(''), [s.V[0], s.V[2]].sort().join('')];
          var chk = function (resp) {
            var v = String(resp == null ? '' : resp).trim(); if (!v) return form('empty', 'Type the name of a side, e.g. ' + t(legs[0]) + '.');
            if (sideOk(v, hyp)) return ok();
            if (sideOk(v, legs[0]) || sideOk(v, legs[1])) return wrong('u6t-hyp-leg', 'That side touches the right angle at ' + t(s.V[0]) + ', so it is a <b>leg</b>. The hypotenuse is the side <b>across from</b> the right angle (the longest side).');
            return form('u6t-side-form', 'Name a side of the triangle with its two letters, e.g. ' + t(legs[0]) + '.');
          };
          var p = fieldsPart('Name the <b>hypotenuse</b> of the triangle.', [{ name: 'Hypotenuse', label: 'Hypotenuse:', mode: 'text', placeholder: 'letters' }], [chk], [hyp], t(hyp),
            'The hypotenuse is the side across from the right angle. The right angle is at ' + t(s.V[0]) + ', so the hypotenuse is the side that does not touch ' + t(s.V[0]) + ': <b>' + t(hyp) + '</b>. (' + t(legs[0]) + ' and ' + t(legs[1]) + ' are the legs.)',
            ['The hypotenuse is across from the right angle (the little square).', 'It is the side that does not touch the vertex with the right angle.'], 'name the hypotenuse');
          p.bad = [[legs[0]], [legs[1]]];
          return p;
        } },
        { id: '1b', outcome: 'RF3', level: 'BEG', make: function (r, s) {
          var a = s.a, b = s.b, c = s.c;
          return numPart('The two legs of the triangle are ' + t(a) + ' ' + s.u + ' and ' + t(b) + ' ' + s.u + ' long. Find the length of the hypotenuse.', c,
            [[a + b, 'u6t-pyth-add', 'Square the legs before you add them: ' + t('c^{2}=a^{2}+b^{2}') + '.'], [a * a + b * b, 'u6t-no-root', 'That is ' + t('c^{2}') + ' — take the square root to find ' + t('c') + '.'], [Math.sqrt(Math.abs(b * b - a * a)), 'u6t-pyth-sub', 'To find the hypotenuse, <b>add</b> the squares of the legs (subtract only when you are finding a leg).', 0.051]],
            t('c^{2}=a^{2}+b^{2}=' + a + '^{2}+' + b + '^{2}=' + (a * a) + '+' + (b * b) + '=' + (c * c)) + ', so ' + t('c=\\sqrt{' + (c * c) + '}=' + c) + ' ' + s.u + '.',
            ['Pythagorean theorem: ' + t('a^{2}+b^{2}=c^{2}') + ', where ' + t('c') + ' is the hypotenuse.', 'Square each leg, add, then take the square root.'], 'hypotenuse from two legs', { before: t('c='), after: s.u, beforeAns: 'c=', unitAns: s.u });
        } }] },
    { num: '2', outcome: 'RF3',
      shared: function (r) {
        function span(lo, hi) {
          var kind = r.pick(['pos', 'cross', 'cross', 'neg']), a, b;
          if (kind === 'pos') { a = r.int(1, 8); b = a + r.int(3, 9); } else if (kind === 'neg') { b = -r.int(1, 7); a = b - r.int(3, 9); } else { a = -r.int(2, 9); b = r.int(2, 9); }
          return r.chance(0.5) ? [a, b] : [b, a];
        }
        var h = span(), v = span(), hy = r.pick(nz(-9, 9)), vx = r.pick(nz(-9, 9)), nm = r.shuffle([['A', 'B'], ['C', 'D'], ['E', 'F'], ['P', 'Q'], ['R', 'S']]);
        return { H: [[h[0], hy], [h[1], hy]], V: [[vx, v[0]], [vx, v[1]]], nh: nm[0], nv: nm[1] };
      },
      stem: 'Find the length of each segment.',
      parts: [
        { id: '2a', outcome: 'RF3', level: 'BEG', make: function (r, s) { return lenHV(s.H, s.nh, 0); } },
        { id: '2b', outcome: 'RF3', level: 'BEG', make: function (r, s) { return lenHV(s.V, s.nv, 1); } }] },
    { num: '3', outcome: 'RF3',
      shared: function (r) {
        return find(function () {
          var tr = r.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]), sx = r.chance(0.5) ? 1 : -1, sy = r.chance(0.5) ? 1 : -1, A = [r.int(-7, 7), r.int(-7, 7)];
          return { A: A, B: [A[0] + sx * tr[0], A[1] + sy * tr[1]], run: tr[0], rise: tr[1], nm: r.pick([['A', 'B'], ['P', 'Q'], ['C', 'D'], ['E', 'F']]) };
        }, function (v) { return inBox(v.A, 6) && inBox(v.B, 6) && v.A[0] && v.A[1] && v.B[0] && v.B[1]; }, { A: [-3, -2], B: [1, 1], run: 4, rise: 3, nm: ['A', 'B'] });
      },
      stem: function (s) { return 'Segment ' + t(s.nm.join('')) + ' is drawn on the grid. Picture the right triangle under it, with a horizontal leg (the run) and a vertical leg (the rise).' + segGraph([[s.A, s.B]], [s.nm.join('')], 6, 'a segment on a grid'); },
      parts: [
        { id: '3', outcome: 'RF3', level: 'BEG', make: function (r, s) {
          var nm = s.nm.join(''), run = s.run, rise = s.rise, c = Math.sqrt(run * run + rise * rise);
          var sizeChk = function (want, other, w) {
            return function (resp) {
              var pn = HW.parse.number(String(resp == null ? '' : resp).replace(/^\s*\+/, ''));
              if (!pn.ok) return form(String(resp || '').trim() ? 'notnumber' : 'empty', 'Type the number of grid squares.');
              var v = Math.abs(pn.value); if (near(v, want)) return ok();
              if (near(v, other)) return wrong('u6t-rr-swap', 'Rise and run are swapped: the <b>run</b> is the horizontal change (across), the <b>rise</b> is the vertical change (up or down).');
              return wrong('u6t-rr-count', 'Count the squares ' + (w === 'run' ? 'across' : 'up or down') + ' from ' + t(s.nm[0]) + ' to ' + t(s.nm[1]) + ' again.');
            };
          };
          var cands = dCands(s.A, s.B);
          var p = fieldsPart('Find the run, the rise and the length of ' + t(nm) + '.', [{ name: 'Run', label: 'Run:' }, { name: 'Rise', label: 'Rise:' }, { name: 'Length', label: t(nm + '='), mode: 'math', keys: 'radical', placeholder: 'a number' }],
            [sizeChk(run, rise, 'run'), sizeChk(rise, run, 'rise'), lenChk(run * run + rise * rise, dDiag(cands))], [String(run), String(rise), String(c)],
            'Run ' + t(run) + ', rise ' + t(rise) + ', ' + t(nm + '=' + c),
            'From ' + t(s.nm[0]) + ' to ' + t(s.nm[1]) + ': ' + t(run) + ' squares across (the run) and ' + t(rise) + ' squares ' + (s.B[1] > s.A[1] ? 'up' : 'down') + ' (the rise).<br>The segment is the hypotenuse of the right triangle: ' + t(nm + '^{2}=' + run + '^{2}+' + rise + '^{2}=' + (run * run) + '+' + (rise * rise) + '=' + (c * c)) + ', so ' + t(nm + '=\\sqrt{' + (c * c) + '}=' + c) + '.',
            ['Count the squares across (run) and up or down (rise) between the endpoints.', 'The segment is the hypotenuse: ' + t('c^{2}=\\text{run}^{2}+\\text{rise}^{2}') + '.'], 'run, rise and length on a grid', true);
          p.bad = [[String(rise), String(run), String(c)], [String(run), String(rise), String(run + rise)], [String(run), String(rise), String(c * c)]];
          return p;
        } }] },
    { num: '4', outcome: 'RF3', parts: [
      { id: '4', outcome: 'RF3', level: 'BEG', make: function (r) {
        var v = find(function () { var A = [r.int(0, 14), r.int(0, 14)], B = [r.int(0, 14), r.int(0, 14)]; return { A: A, B: B }; },
          function (v) { return (v.A[0] + v.B[0]) % 2 === 0 && (v.A[1] + v.B[1]) % 2 === 0 && Math.abs(v.A[0] - v.B[0]) >= 2 && Math.abs(v.A[1] - v.B[1]) >= 2; }, { A: [3, 5], B: [9, 11] });
        var nm = r.pick([['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['P', 'Q']]), M = mid(v.A, v.B);
        return ptPart('Find the midpoint of the segment joining ' + nP(nm[0], v.A) + ' and ' + nP(nm[1], v.B) + '.', M, midCands(v.A, v.B), t('M='), 'M', t(mLine(v.A, v.B, 'M')) + '.', HM, 'midpoint, small positive coordinates');
      } }] },
    { num: '5', outcome: 'RF3',
      shared: function (r) {
        var kinds = r.shuffle(['pos', 'neg', 'zero', 'und']), posAt = kinds.indexOf('pos');
        kinds.splice(posAt, 1); kinds.unshift('pos');   // AB is the positive one (5a counts it)
        var types = kinds.map(function (k) {
          if (k === 'zero') return { run: r.int(3, 5), rise: 0 };
          if (k === 'und') return { run: 0, rise: -r.int(3, 5) };
          var run = r.int(2, 5), rise = find(function () { return r.int(2, 6); }, function (x) { return x !== run; }, 4);
          return { run: run, rise: k === 'pos' ? rise : -rise };
        });
        var segs = placeSegs(r, types, 5);
        if (!segs) { kinds = ['pos', 'neg', 'zero', 'und']; segs = [[[-5, -1], [-2, 5]], [[1, 5], [4, 1]], [[-5, -4], [-1, -4]], [[3, -1], [3, -5]]]; }
        var order = [0].concat(r.shuffle([1, 2, 3]));   // AB first; the others in a random order
        return { kinds: order.map(function (i) { return kinds[i]; }), segs: order.map(function (i) { return segs[i]; }) };
      },
      stem: function (s) { return 'The grid shows four line segments.' + segGraph(s.segs, Q5N, 5, 'four line segments AB, CD, EF and GH on a grid'); },
      parts: [
        { id: '5a', outcome: 'RF3', level: 'BEG', make: function (r, s) {
          var A = s.segs[0][0], B = s.segs[0][1], rise = B[1] - A[1], run = B[0] - A[0], sl = slopeOf(A, B), slc = K.slope(sl, { lowest: false });
          var check = function (resp) {
            resp = resp || [];
            var plus = function (v) { return String(v == null ? '' : v).replace(/^\s*\+/, ''); }, pr = HW.parse.number(plus(resp[0])), pn = HW.parse.number(plus(resp[1]));
            if (!pr.ok || !pn.ok) return form('rr-blank', 'Fill in the <b>rise</b> and the <b>run</b> as numbers (with a minus sign for down or left).');
            var R = cl(pr.value), N = cl(pn.value);
            if (!((R === rise && N === run) || (R === -rise && N === -run))) {
              if (Math.abs(R) === Math.abs(run) && Math.abs(N) === Math.abs(rise)) return wrong('u6t-rr-swap', 'Rise and run are swapped: the <b>rise</b> is the vertical change (up or down), the <b>run</b> is the horizontal change (across).');
              if (Math.abs(R) === Math.abs(rise) && Math.abs(N) === Math.abs(run)) return wrong('u6t-rr-sign', 'Right sizes — check the signs. From ' + t('A') + ' to ' + t('B') + ' you go up and to the right: both are positive.');
              return wrong('u6t-rr-count', Math.abs(R) !== Math.abs(rise) ? '<b>Rise:</b> count the squares up from ' + t('A') + ' to the level of ' + t('B') + ' again.' : '<b>Run:</b> count the squares across from ' + t('A') + ' to ' + t('B') + ' again.');
            }
            var c = slc(resp[2] == null ? '' : resp[2]);
            if (c.v !== 'correct') return { v: c.v, code: c.code, hint: '<b>Slope:</b> ' + (c.hint || 'divide the rise by the run: ' + t('\\frac{\\text{rise}}{\\text{run}}=\\frac{' + rise + '}{' + run + '}') + '.') };
            return ok();
          };
          var fields = [{ label: 'Rise:', name: 'Rise' }, { label: 'Run:', name: 'Run' }, { label: t('m_{AB}='), name: 'Slope', mode: 'math', keys: 'slope', placeholder: 'e.g. 2/3' }];
          return { prompt: 'For segment ' + t('AB') + ', count the rise and the run from ' + t('A') + ' to ' + t('B') + ', then write its slope.', input: { type: 'fields', fields: fields }, check: check, key: [String(rise), String(run), sT(sl)],
            answer: 'Rise ' + t(rise) + ', run ' + t(run) + ', ' + t('m_{AB}=' + sT(sl)), text: 'rise, run and slope of AB on a grid',
            solution: 'From ' + t('A' + ptT(A)) + ' to ' + t('B' + ptT(B)) + ': ' + t(rise) + ' squares up (rise ' + t(rise) + ') and ' + t(run) + ' squares right (run ' + t(run) + ').<br>' + t('m_{AB}=\\frac{\\text{rise}}{\\text{run}}=\\frac{' + rise + '}{' + run + '}' + (sT(sl) !== '\\frac{' + rise + '}{' + run + '}' ? '=' + sT(sl) : '')) + '.',
            hints: ['Start at ' + t('A') + '. Count the squares up to the level of ' + t('B') + ' (the rise), then the squares right to ' + t('B') + ' (the run).', 'Slope ' + t('=\\frac{\\text{rise}}{\\text{run}}') + ' — rise on top.'],
            good: [[String(-rise), String(-run), sT(sl)]], bad: [[String(run), String(rise), sT(red(run, rise))], [String(rise), String(-run), sT(sl)], [String(rise), String(run), sT(red(run, rise))]] };
        } },
        { id: '5b', outcome: 'RF3', level: 'BEG', make: function (r, s) {
          var want = {}; Q5N.forEach(function (nm, i) { want[nm] = s.kinds[i]; });
          var why = function (row, got) {
            var k = want[row];
            if (k === 'und') return t(row) + ' is vertical: the run is ' + t('0') + ' and you can’t divide by ' + t('0') + ', so its slope is <b>undefined</b>' + (got === 'zero' ? ' (a slope of ' + t('0') + ' is a horizontal segment).' : '.');
            if (k === 'zero') return t(row) + ' is horizontal: the rise is ' + t('0') + ', so its slope is ' + t('0') + (got === 'und' ? ' — zero, not undefined.' : '.');
            return t(row) + ' goes ' + (k === 'pos' ? 'up' : 'down') + ' from left to right, so its slope is ' + KIND[k] + '.';
          };
          return gridPart('Classify the slope of each segment.', Q5N.map(function (nm) { return { id: nm, html: t(nm), label: nm }; }),
            ['pos', 'neg', 'zero', 'und'].map(function (k) { return { id: k, html: KIND[k], label: KIND[k] }; }), want, why,
            Q5N.map(function (nm, i) { var k = s.kinds[i]; return t(nm) + ': <b>' + KIND[k] + '</b> (' + (k === 'und' ? 'vertical' : k === 'zero' ? 'horizontal' : 'it goes ' + (k === 'pos' ? 'up' : 'down') + ' from left to right') + ').'; }).join('<br>'),
            ['Up from left to right: positive. Down from left to right: negative.', 'Horizontal: slope ' + t('0') + '. Vertical: slope undefined.'], 'classify four slopes', 'Segment');
        } }] },
    { num: '6', outcome: 'RF3', parts: [
      { id: '6', outcome: 'RF3', level: 'BEG', make: function (r) {
        var c = r.pick(Q6C), f = r.pick(c.fr), k = r.pick(c.ks), h = f[0] * k, w = f[1] * k;
        var p = P.fraction(c.txt(h, w) + (c.k === 'stairs' ? ' Give it in lowest terms.' : ' Find the slope as a fraction in lowest terms.'), [f[0], f[1]], { decimalOk: true, before: t('m=') },
          t('m=\\frac{\\text{rise}}{\\text{run}}=\\frac{' + h + '}{' + w + '}=' + frT(f[0], f[1])) + (k > 1 ? ' (divide the top and the bottom by ' + t(gcd(h, w)) + ').' : '.'),
          ['Slope ' + t('=\\frac{\\text{rise}}{\\text{run}}') + ': the vertical climb over the horizontal distance.', 'Reduce the fraction: divide the top and the bottom by the same number.'], 'slope in context: ' + c.k);
        p.answer = t('m=' + frT(f[0], f[1]));
        p.bad = [frT(f[1], f[0]), '\\frac{' + h + '}{' + w + '}'].filter(function (b) { return b !== frT(f[0], f[1]); });
        return p;
      } }] },
    { num: '7', outcome: 'RF3', parts: [
      { id: '7', outcome: 'RF3', level: 'BEG', make: function (r) {
        var fr = function (p, q) { return (p < 0 ? '-' : '') + (q === 1 ? Math.abs(p) : '\\dfrac{' + Math.abs(p) + '}{' + q + '}'); };
        var a = r.pick(NICE), sa = r.chance(0.5) ? -1 : 1;
        var par = [[sa * a[0], a[1]], [sa * a[0], a[1]]];
        var b = find(function () { return r.chance(0.3) ? [r.int(2, 6), 1] : r.pick(NICE); }, function (x) { return x.join() !== a.join(); }, [4, 1]), sb = r.chance(0.5) ? -1 : 1, bp = red(-sb * b[1], b[0]);
        var perp = r.chance(0.5) ? [[sb * b[0], b[1]], bp] : [bp, [sb * b[0], b[1]]];
        var c = find(function () { return r.pick(NICE); }, function (x) { return x[0] !== x[1] && x.join() !== a.join() && x.join() !== b.join(); }, [5, 6]), sc = r.chance(0.5) ? -1 : 1;
        var recip = [[sc * c[0], c[1]], red(sc * c[1], c[0])];
        var d = find(function () { return r.pick(NICE); }, function (x) { return x.join() !== c.join() && x.join() !== a.join(); }, [3, 5]), sd = r.chance(0.5) ? -1 : 1;
        var opp = [[sd * d[0], d[1]], [-sd * d[0], d[1]]];
        var rows = r.shuffle([{ k: 'par', s: par }, { k: 'perp', s: perp }, { k: 'nei', s: recip }, { k: 'nei', s: opp }]);
        var want = {}, by = {}; rows.forEach(function (x, i) { x.id = 'r' + (i + 1); x.tex = 'm_1=' + fr(x.s[0][0], x.s[0][1]) + ',\\ \\ m_2=' + fr(x.s[1][0], x.s[1][1]); want[x.id] = x.k; by[x.id] = x; });
        return gridPart('Each row gives the slopes of two lines. Are the lines parallel, perpendicular or neither?', rows.map(function (x) { return { id: x.id, html: t(x.tex), label: x.tex }; }), REL_COLS, want,
          function (id, got) { var x = by[id]; return t(x.tex) + ': ' + (relWhy(x.s[0], x.s[1], x.k)[got] || ''); },
          rows.map(function (x) { return t(x.tex) + ': ' + relSol(x.s[0], x.s[1]); }).join('<br>'),
          ['Parallel: equal slopes. Perpendicular: negative reciprocals — flip the fraction and change the sign (the product is ' + t('-1') + ').', 'Reciprocals with the same sign, or the same number with opposite signs, are <b>neither</b>.'], 'parallel / perpendicular / neither table', 'Slopes');
      } }] },

    /* ---------------- Progressing ---------------- */
    { num: '8', outcome: 'RF3',
      shared: function (r) {
        return find(function () {
          var a = r.pick(nz(-6, 6)), b = r.pick(nz(-6, 6)), A = [r.int(-9, 9), r.int(-9, 9)];
          return { A: A, B: [A[0] + 2 * a, A[1] + 2 * b], nm: r.pick([['A', 'B'], ['P', 'Q'], ['C', 'D'], ['R', 'S'], ['J', 'K']]) };
        }, function (v) {
          var all = v.A.concat(v.B), negs = all.filter(function (x) { return x < 0; }).length, dx = v.B[0] - v.A[0], dy = v.B[1] - v.A[1];
          return inBox(v.B, 10) && negs >= 2 && all.every(function (x) { return x !== 0; }) && Math.abs(dx) !== Math.abs(dy) && Math.abs(dx) + Math.abs(dy) >= 8 && !(v.A[0] + v.B[0] === 0 && v.A[1] + v.B[1] === 0);
        }, { A: [-4, 3], B: [6, -5], nm: ['A', 'B'] });
      },
      stem: function (s) { return 'Segment ' + t(s.nm.join('')) + ' joins ' + nP(s.nm[0], s.A) + ' and ' + nP(s.nm[1], s.B) + '.'; },
      parts: [
        { id: '8a', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var nm = s.nm.join(''), d2 = d2Of(s.A, s.B), cands = dCands(s.A, s.B);
          var p = P.math('Find the length of ' + t(nm) + ', to the nearest tenth (or exactly, as a radical).', lenChk(d2, dDiag(cands)), lenKey(d2), t(dLine(s.A, s.B, nm)) + '.', HD, 'distance with negatives', { keys: 'radical', before: t(nm + '='), placeholder: 'exact or decimal' });
          p.answer = t(nm + '=' + lenAns(d2)); p.bad = lenBad(d2, cands);
          return p;
        } },
        { id: '8b', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var M = mid(s.A, s.B);
          return ptPart('Find the midpoint of ' + t(s.nm.join('')) + '.', M, midCands(s.A, s.B), t('M='), 'M', t(mLine(s.A, s.B, 'M')) + '.', HM, 'midpoint with negatives');
        } },
        { id: '8c', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var A = s.A, B = s.B, sl = slopeOf(A, B), dx = B[0] - A[0];
          var diag = function (x) { if ((dx && near(x, (B[1] + A[1]) / dx)) || (B[0] + A[0] && near(x, (B[1] - A[1]) / (B[0] + A[0])))) return { code: 'u6t-double-neg', hint: 'Careful with the negatives: subtracting a negative coordinate means adding, e.g. ' + t('5-(-3)=5+3=8') + '.' }; return null; };
          return slopeAns('Find the slope of ' + t(s.nm.join('')) + '. Give it in lowest terms.', sl, slopeChk(sl, diag), t(calc(A, B, s.nm.join(''))), [SLOPE_HINT, 'Reduce the fraction and keep the sign in front.'], 'slope with negatives', t('m_{' + s.nm.join('') + '}='));
        } }] },
    { num: '9', outcome: 'RF3', parts: [
      { id: '9', outcome: 'RF3', level: 'PRG', make: function (r) {
        var v = find(function () { var A = [r.int(-9, 9), r.int(-9, 9)], M = [r.int(-8, 8), r.int(-8, 8)]; return { A: A, M: M, B: [2 * M[0] - A[0], 2 * M[1] - A[1]] }; },
          function (v) { var all = v.A.concat(v.M, v.B); return Math.abs(v.M[0] - v.A[0]) >= 2 && Math.abs(v.M[1] - v.A[1]) >= 2 && inBox(v.B, 16) && all.some(function (x) { return x < 0; }) && v.A[0] && v.A[1]; }, { A: [-8, 6], M: [-2, -1], B: [4, -8] });
        var nm = r.pick([['P', 'Q'], ['A', 'B'], ['C', 'D'], ['E', 'F'], ['R', 'S']]), A = v.A, M = v.M, B = v.B, n0 = nm[0], n1 = nm[1];
        return ptPart(t('M' + ptT(M)) + ' is the midpoint of ' + t('\\overline{' + n0 + n1 + '}') + '. One endpoint is ' + nP(n0, A) + '. Find the other endpoint, ' + t(n1) + '.', B, endCands(A, M), t(n1 + '='), n1,
          'The step from ' + t(n0) + ' to ' + t('M') + ' is ' + t('(' + nb(M[0]) + '-' + nb(A[0]) + ',\\ ' + nb(M[1]) + '-' + nb(A[1]) + ')=' + ptT(sub(M, A))) + '. Take the same step from ' + t('M') + ': ' + t(n1 + '=(' + M[0] + '+' + nb(M[0] - A[0]) + ',\\ ' + M[1] + '+' + nb(M[1] - A[1]) + ')=' + ptT(B)) + '.<br>(Or: ' + t('x=2(' + M[0] + ')-' + nb(A[0]) + '=' + B[0]) + ', ' + t('y=2(' + M[1] + ')-' + nb(A[1]) + '=' + B[1]) + '.) Check: ' + t(mLine(A, B)) + ' ✓',
          HE, 'missing endpoint');
      } }] },
    { num: '10', outcome: 'RF3', shared: q10Shared,
      stem: function (s) { var c = s.c; return c.intro + tbl(c.xh, c.yh, [s.x[0], s.x[1]], [c.money ? money(s.y[0]) : s.y[0], c.money ? money(s.y[1]) : s.y[1]]); },
      parts: [
        { id: '10a', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var c = s.c, R = s.r, x = s.x, y = s.y, dy = cl(y[1] - y[0]), dx = x[1] - x[0];
          return numPart('Find the rate of change (the slope), in ' + t(c.unit) + '.', R,
            [[-R, 'u6t-rate-sign', 'Check the sign: the ' + (c.k === 'print' ? 'cost' : c.k === 'bike' ? 'distance' : c.k === 'tank' ? 'volume' : 'charge') + ' ' + (R < 0 ? 'goes down' : 'goes up') + ', so the rate is ' + (R < 0 ? 'negative' : 'positive') + '.'], [dy, 'u6t-no-run', 'That is the change in the ' + c.yh.replace(/ \(.*$/, '').toLowerCase() + '. Divide it by the change in ' + c.xh.replace(/ \(.*$/, '').toLowerCase() + ', ' + t(dx) + '.'],
              [dx / dy, 'u6t-rate-flip', 'Rate of change ' + t('=\\frac{\\text{change in } y}{\\text{change in } x}') + ' — the ' + c.yh.replace(/ \(.*$/, '').toLowerCase() + ' goes on top.'], [y[1] / x[1], 'u6t-rate-point', 'Use the <b>changes</b> between the two columns, not one column’s values.'], [y[0] / x[0], 'u6t-rate-point', 'Use the <b>changes</b> between the two columns, not one column’s values.']],
            t('m=\\frac{' + q10Val(c, y[1]).replace(/^\\\$/, '') + '-' + nb(y[0]) + '}{' + x[1] + '-' + x[0] + '}=\\frac{' + dT(dy) + '}{' + dx + '}=' + dT(R)) + ' ' + t(c.unit) + ': the ' + c.yh.replace(/ \(.*$/, '').toLowerCase() + ' ' + (R < 0 ? 'goes down' : 'goes up') + ' by ' + t(c.money ? '\\$' + money(Math.abs(R)) : dT(Math.abs(R))) + (c.money ? '' : ' ' + c.uw) + ' every ' + c.xw + '.',
            ['Rate of change ' + t('=\\frac{\\text{change in } y}{\\text{change in } x}') + ' between the two columns.', 'A quantity that goes down has a negative rate.'], 'rate from a table: ' + c.k, { before: t('m='), after: t(c.unit), beforeAns: 'm=', unitAns: t(c.unit), placeholder: 'a number' });
        } },
        { id: '10b', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var c = s.c, R = s.r, x = s.x, y = s.y, ans = y[2], gap = x[2] - x[1];
          return numPart(c.ask(x[2]), ans,
            [[cl(R * x[2]), 'u6t-pred-nostart', 'Start from the amount in the table, then add the change: ' + t(dT(y[1]) + (R < 0 ? '-' : '+') + dT(Math.abs(R)) + '\\times ' + gap) + '.'], [cl(y[1] + R * x[2]), 'u6t-pred-from0', 'From the last column, only ' + t(x[2] + '-' + x[1] + '=' + gap) + ' ' + c.xs + ' pass — multiply the rate by ' + t(gap) + '.'],
              [cl(y[1] - R * gap), 'u6t-pred-sign', 'The ' + c.yh.replace(/ \(.*$/, '').toLowerCase() + ' ' + (R < 0 ? 'goes down' : 'goes up') + ': ' + (R < 0 ? 'subtract' : 'add') + ' the change.'], [cl(y[0] + R * gap), 'u6t-pred-col', 'Start from the column at ' + t(x[1]) + ', the one just before ' + t(x[2]) + '.']],
            'From ' + t(x[1]) + ' to ' + t(x[2]) + ' is ' + t(gap) + ' ' + c.xs + '. Change: ' + t(dT(R) + '\\times ' + gap + '=' + dT(R * gap)) + '.<br>' + t(dT(y[1]) + (R < 0 ? '' : '+') + dT(R * gap) + '=' + dT(ans)) + (c.money ? ': <b>' + t('\\$' + money(ans)) + '</b>.' : ' ' + c.uw + '.'),
            ['How many ' + c.xs + ' after the last column is ' + t(x[2]) + '?', 'Change ' + t('=') + ' rate × time. Add it to the last value in the table.'], 'predict with the rate: ' + c.k, { before: c.money ? t('\\$') : '', after: c.money ? '' : c.uw, beforeAns: c.money ? '\\$' : '', ansTex: c.money ? money(ans) : dT(ans), unitAns: c.money ? '' : c.uw, placeholder: 'a number' });
        } }] },
    { num: '11', outcome: 'RF3',
      shared: function (r) {
        var v = find(function () {
          var hy = r.pick(nz(-8, 8)), hx = r.int(-8, 2), hw = r.int(3, 9), vx = r.pick(nz(-8, 8)), vy = r.int(-8, 1), vh = r.int(3, 9);
          var pq = r.pick(NICE.filter(function (x) { return x[0] !== x[1]; })), j = r.int(1, 2), A = [r.int(-8, 3), r.int(-2, 8)], dx = pq[1] * j, dy = -pq[0] * j;
          var H = r.chance(0.5) ? [[hx, hy], [hx + hw, hy]] : [[hx + hw, hy], [hx, hy]], V = r.chance(0.5) ? [[vx, vy], [vx, vy + vh]] : [[vx, vy + vh], [vx, vy]];
          var S = r.chance(0.5) ? [A, [A[0] + dx, A[1] + dy]] : [[A[0] + dx, A[1] + dy], A];
          return { segs: { zero: H, und: V, neg: S } };
        }, function (v) { return [v.segs.zero, v.segs.und, v.segs.neg].every(function (sg) { return sg.every(function (p) { return inBox(p, 9) && p[0] && p[1]; }); }); }, { segs: { zero: [[-4, -1], [3, -1]], und: [[2, 4], [2, -4]], neg: [[-2, 3], [4, -3]] } });
        var names = r.shuffle([['E', 'F'], ['G', 'H'], ['J', 'K']]), kinds = r.shuffle(['zero', 'und', 'neg']);
        return { rows: kinds.map(function (k, i) { var sg = v.segs[k]; return { k: k, nm: names[i], A: sg[0], B: sg[1], sl: slopeOf(sg[0], sg[1]) }; }).sort(function (a, b) { return a.nm[0] < b.nm[0] ? -1 : 1; }),
          eqs: r.shuffle([{ v: 'y', k: r.pick(nz(-9, 9)) }, { v: 'x', k: r.pick(nz(-9, 9)) }, r.chance(0.5) ? { v: 'y', k: r.pick(nz(-9, 9)) } : { v: 'x', k: r.chance(0.3) ? 0 : r.pick(nz(-9, 9)) }]) };
      },
      stem: function (s) { return 'Three segments: ' + s.rows.map(function (x) { return '<span class="nw">' + t(x.nm.join('')) + ' joins ' + nP(x.nm[0], x.A) + ' and ' + nP(x.nm[1], x.B) + '</span>'; }).join(';&nbsp; ') + '.'; },
      parts: [
        { id: '11a', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var rows = s.rows, chks = rows.map(function (x) { return slopeChk(x.sl, null, false); });
          var check = function (resp) {
            resp = resp || [];
            var mix = rows.filter(function (x, i) { var R = readSlope(resp[i]); return R && ((x.k === 'zero' && R.und) || (x.k === 'und' && R.v === 0)); }).length;
            var base = fieldsChk(chks, rows.map(function (x) { return 'Slope of ' + x.nm.join(''); }), true)(resp);
            if (base.v === 'wrong' && mix) {
              var others = rows.filter(function (x, i) { var R = readSlope(resp[i]); return !(R && ((x.k === 'zero' && R.und) || (x.k === 'und' && R.v === 0))) && chks[i](resp[i]).v !== 'correct'; }).length;
              if (!others) return wrong(mix === 1 ? 'u6t-zero-und' : 'u6t-zero-und-all', 'A <b>horizontal</b> segment has a rise of ' + t('0') + ': its slope is ' + t('\\frac{0}{\\text{run}}=0') + '. A <b>vertical</b> segment has a run of ' + t('0') + ': you can’t divide by ' + t('0') + ', so its slope is <b>undefined</b>.');
            }
            return base;
          };
          var p = fieldsPart('Find the slope of each segment. ' + FIELDHELP, rows.map(function (x) { return sField(x.nm.join('')); }), chks, rows.map(function (x) { return sT(x.sl); }),
            t(rows.map(function (x) { return 'm_{' + x.nm.join('') + '}=' + sT(x.sl); }).join(',\\quad ')),
            rows.map(function (x) { return t(calc(x.A, x.B, x.nm.join(''))) + (x.k === 'zero' ? ': the rise is ' + t('0') + ', a <b>horizontal</b> segment, slope ' + t('0') + '.' : x.k === 'und' ? ': the run is ' + t('0') + ' and you can’t divide by ' + t('0') + ' — a <b>vertical</b> segment, slope <b>undefined</b>.' : ': <b>negative</b>.'); }).join('<br>'),
            [SLOPE_HINT, 'Zero on the top gives a slope of ' + t('0') + '. Zero on the bottom: the slope is undefined.'], 'zero, undefined and negative slopes', true);
          p.check = check;
          p.bad = [rows.map(function (x) { return x.k === 'zero' ? '\\text{undefined}' : x.k === 'und' ? '0' : sT(x.sl); }), rows.map(function (x) { return x.k === 'zero' ? '\\text{undefined}' : sT(x.sl); })];
          return p;
        } },
        { id: '11b', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var want = {}, rows = s.eqs.map(function (e, i) { var id = 'e' + i; want[id] = e.v === 'y' ? 'h' : 'v'; return { id: id, html: t(e.v + '=' + e.k), label: e.v + '=' + e.k, e: e }; });
          var by = {}; rows.forEach(function (x) { by[x.id] = x; });
          var cols = [{ id: 'h', html: 'Horizontal, slope ' + t('0'), label: 'horizontal, slope 0' }, { id: 'v', html: 'Vertical, slope undefined', label: 'vertical, slope undefined' }];
          return gridPart('Each equation describes a line. Is the line horizontal (slope ' + t('0') + ') or vertical (slope undefined)?', rows, cols, want,
            function (id) { var e = by[id].e; return t(e.v + '=' + e.k) + ': every point has ' + t(e.v) + '-coordinate ' + t(e.k) + (e.v === 'y' ? ', so the line goes straight across: <b>horizontal</b>, slope ' + t('0') + '.' : ', so the line goes straight up and down: <b>vertical</b>, slope undefined.'); },
            rows.map(function (x) { var e = x.e; return t(e.v + '=' + e.k) + ': every point has ' + t(e.v + '=' + e.k) + ' — ' + (e.v === 'y' ? '<b>horizontal</b>, slope ' + t('0') : '<b>vertical</b>, slope <b>undefined</b>') + (e.v === 'x' && e.k === 0 ? ' (it is the ' + t('y') + '-axis)' : '') + '.'; }).join('<br>'),
            ['In ' + t('y=k') + ' the ' + t('y') + '-value never changes: the line goes across.', 'In ' + t('x=k') + ' the ' + t('x') + '-value never changes: the line goes up and down.'], 'y = k / x = k: type of line', 'Equation');
        } }] },
    { num: '12', outcome: 'RF3',
      shared: function (r) {
        return find(function () {
          var pq = r.pick(NICE.filter(function (x) { return x[0] !== x[1] && x[0] + x[1] <= 7; })), sg = r.chance(0.5) ? -1 : 1, rel = r.pick(['par', 'perp', 'perp', 'nei']), m1 = [sg * pq[0], pq[1]];
          var m2 = rel === 'par' ? m1 : rel === 'perp' ? red(-m1[1], m1[0]) : r.chance(0.5) ? [-m1[0], m1[1]] : red(m1[1], m1[0]);
          var j1 = r.int(1, 2), j2 = r.int(1, 2), A = [r.int(-7, 2), r.int(-6, 6)], B = [A[0] + m1[1] * j1, A[1] + m1[0] * j1], d2 = r.chance(0.4) ? -1 : 1, C = [r.int(-6, 6), r.int(-6, 6)], D = [C[0] + d2 * m2[1] * j2, C[1] + d2 * m2[0] * j2];
          return { A: A, B: B, C: C, D: D, rel: rel, m1: m1, m2: m2 };
        }, function (v) { return [v.A, v.B, v.C, v.D].every(function (p) { return inBox(p, 9) && p[0] && p[1]; }) && Math.abs(v.B[0] - v.A[0]) + Math.abs(v.B[1] - v.A[1]) >= 4 && Math.abs(v.D[0] - v.C[0]) + Math.abs(v.D[1] - v.C[1]) >= 4 && !sEq(slopeOf(v.A, v.C), v.m1); }, { A: [-3, 1], B: [1, 4], C: [2, 5], D: [5, 1], rel: 'perp', m1: [3, 4], m2: [-4, 3] });
      },
      stem: function (s) { return 'Segment ' + t('AB') + ' joins ' + nP('A', s.A) + ' and ' + nP('B', s.B) + '. Segment ' + t('CD') + ' joins ' + nP('C', s.C) + ' and ' + nP('D', s.D) + '.'; },
      parts: [
        { id: '12a', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var p = fieldsPart('Find the slope of each segment.', [sField('AB'), sField('CD')], [slopeChk(s.m1, null, false), slopeChk(s.m2, null, false)], [sT(s.m1), sT(s.m2)], t('m_{AB}=' + sT(s.m1) + ',\\quad m_{CD}=' + sT(s.m2)),
            t(calc(s.A, s.B, 'AB')) + '<br>' + t(calc(s.C, s.D, 'CD')), [SLOPE_HINT], 'two slopes from coordinates');
          p.bad = [[sT([-s.m1[0], s.m1[1]]), sT(s.m2)], [sT(red(s.m1[1], s.m1[0])), sT(s.m2)]];
          return p;
        } },
        { id: '12b', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var kind = relKind(s.m1, s.m2), w = relWhy(s.m1, s.m2, kind);
          var opts = REL_COLS.map(function (o) { return { html: '<b>' + o.html + '</b>' + (o.id === 'par' ? ': the slopes are equal' : o.id === 'perp' ? ': the slopes multiply to ' + t('-1') : ': the slopes are not equal and their product is not ' + t('-1')), right: o.id === kind, why: o.id === kind ? null : w[o.id], code: 'said-' + o.id }; });
          return P.mc(r, 'Are the segments parallel, perpendicular or neither? Choose the answer with the right reason.', opts, t('m_{AB}=' + sT(s.m1)) + ' and ' + t('m_{CD}=' + sT(s.m2)) + '. ' + relSol(s.m1, s.m2), ['Parallel: equal slopes. Perpendicular: product ' + t('-1') + ' (negative reciprocals).'], 'parallel/perpendicular from coordinates');
        } }] },
    { num: '13', outcome: 'RF3',
      shared: function (r) {
        return find(function () {
          var pq = r.pick([[1, 1], [2, 1], [3, 1], [1, 2], [2, 3], [3, 2], [3, 4], [4, 3], [1, 3]]), sg = r.chance(0.6) ? 1 : -1, col = r.chance(0.55), j1 = r.int(1, 3), j2 = r.int(1, 3);
          var Pp = [r.int(-7, 1), r.int(-8, 6)], Q = [Pp[0] + pq[1] * j1, Pp[1] + sg * pq[0] * j1], R = [Q[0] + pq[1] * j2, Q[1] + sg * pq[0] * j2];
          if (!col) R = [R[0] + r.pick([-1, 1]), R[1] + r.pick([-1, 1, 2])];
          return { P: Pp, Q: Q, R: R, col: col, nm: r.pick([['P', 'Q', 'R'], ['A', 'B', 'C'], ['D', 'E', 'F'], ['K', 'L', 'M']]) };
        }, function (v) { var a = slopeOf(v.P, v.Q), b = slopeOf(v.Q, v.R); return [v.P, v.Q, v.R].every(function (p) { return inBox(p, 12); }) && v.P.concat(v.Q, v.R).some(function (x) { return x < 0; }) && a && b && b[0] !== 0 && sEq(a, b) === v.col && Math.abs(v.R[0] - v.Q[0]) >= 2; }, { P: [-6, -5], Q: [-2, -1], R: [2, 3], col: true, nm: ['P', 'Q', 'R'] });
      },
      stem: function (s) { var n = s.nm; return 'Use the slope test: are the points ' + nP(n[0], s.P) + ', ' + nP(n[1], s.Q) + ' and ' + nP(n[2], s.R) + ' collinear?'; },
      parts: [
        { id: '13a', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var n = s.nm, a = slopeOf(s.P, s.Q), b = slopeOf(s.Q, s.R), n1 = n[0] + n[1], n2 = n[1] + n[2];
          var p = fieldsPart('Find ' + t('m_{' + n1 + '}') + ' and ' + t('m_{' + n2 + '}') + '.', [sField(n1), sField(n2)], [slopeChk(a, null, false), slopeChk(b, null, false)], [sT(a), sT(b)], t('m_{' + n1 + '}=' + sT(a) + ',\\quad m_{' + n2 + '}=' + sT(b)),
            t(calc(s.P, s.Q, n1)) + '<br>' + t(calc(s.Q, s.R, n2)), [SLOPE_HINT, 'Reduce both fractions so you can compare them.'], 'collinear: two slopes');
          p.bad = [[sT([-a[0], a[1]]), sT(b)]];
          return p;
        } },
        { id: '13b', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var n = s.nm, a = slopeOf(s.P, s.Q), b = slopeOf(s.Q, s.R), col = s.col, n1 = n[0] + n[1], n2 = n[1] + n[2];
          return P.mc(r, 'Are ' + t(n[0]) + ', ' + t(n[1]) + ' and ' + t(n[2]) + ' collinear? Choose the answer with the right reason.', [
            { html: '<b>Collinear</b>: ' + t('m_{' + n1 + '}=m_{' + n2 + '}') + ', and the two segments share the point ' + t(n[1]) + ', so they lie on one line.', right: col, why: col ? null : 'Reduce both slopes: ' + t(sT(a) + '\\ne ' + sT(b)) + '.' },
            { html: '<b>Not collinear</b>: ' + t('m_{' + n1 + '}\\ne m_{' + n2 + '}') + ', so the path bends at ' + t(n[1]) + '.', right: !col, why: col ? 'Reduce both slopes: ' + t(sT(a) + '=' + sT(b)) + '.' : null },
            { html: '<b>' + (col ? 'Collinear' : 'Not collinear') + '</b>: ' + t(n1) + ' and ' + t(n2) + ' have ' + (col ? 'the same' : 'different') + ' lengths.', why: 'Lengths don’t decide it: points on one line can be any distance apart. Compare the <b>slopes</b>.' },
            { html: '<b>Collinear</b>: the slopes are both ' + (a[0] > 0 ? 'positive' : 'negative') + ', so the points all go the same way.', why: 'Having the same sign isn’t enough: the slopes must be <b>equal</b>' + (col ? ' (here they are — and the segments share ' + t(n[1]) + ')' : ', and ' + t(sT(a) + '\\ne ' + sT(b))) + '.' }],
            t('m_{' + n1 + '}=' + sT(a)) + ', ' + t('m_{' + n2 + '}=' + sT(b)) + '. ' + (col ? 'The slopes are equal and the segments share the point ' + t(n[1]) + ', so the points are <b>collinear</b>.' : 'The slopes are different, so the points are <b>not collinear</b>.'),
            ['Two segments with equal slopes that share a point lie on the same line.'], 'collinear conclusion');
        } }] },
    { num: '14', outcome: 'RF3',
      shared: function (r) {
        var v = find(function () { var pq = r.pick(NICE.filter(function (x) { return x[0] !== x[1] && x[0] <= 5 && x[1] <= 5; })), sg = r.chance(0.5) ? -1 : 1, j = r.pick([1, 1, 2]), A = [r.int(-5, 3), r.int(-5, 5)]; return { A: A, B: [A[0] + pq[1] * j, A[1] + sg * pq[0] * j], m: [sg * pq[0], pq[1]] }; },
          function (v) { return inBox(v.B, 5) && v.A[0] && v.A[1] && v.B[0] && v.B[1] && Math.abs(v.B[0] - v.A[0]) + Math.abs(v.B[1] - v.A[1]) >= 4; }, { A: [-3, -2], B: [1, 4], m: [3, 2] });
        return v;
      },
      stem: function (s) { return 'Segment ' + t('AB') + ' is drawn on the grid.' + segGraph([[s.A, s.B]], ['AB'], 5, 'segment AB on a grid'); },
      parts: [
        { id: '14', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var m = s.m, pm = perpOf(m), A = s.A, B = s.B;
          var p = fieldsPart('Find the slope of ' + t('AB') + ' from the grid. Then give the slope of a line <b>perpendicular</b> to <span class="nw">' + t('AB') + '.</span>', [sField('AB'), { name: 'Perpendicular slope', label: 'Perpendicular slope: ' + t('m='), mode: 'math', keys: 'slope', placeholder: 'e.g. -2/3' }],
            [slopeChk(m, null, false), relChk(m, 'perp')], [sT(m), sT(pm)], t('m_{AB}=' + sT(m)) + '; perpendicular: ' + t('m=' + sT(pm)),
            'From ' + t('A' + ptT(A)) + ' to ' + t('B' + ptT(B)) + ': rise ' + t(B[1] - A[1]) + ', run ' + t(B[0] - A[0]) + ', so ' + t('m_{AB}=\\frac{' + (B[1] - A[1]) + '}{' + (B[0] - A[0]) + '}' + (sT(m) !== '\\frac{' + (B[1] - A[1]) + '}{' + (B[0] - A[0]) + '}' ? '=' + sT(m) : '')) + '.<br>Perpendicular: flip it and change the sign, ' + t('m=' + sT(pm)) + '. Check: ' + t(sT(m) + '\\times ' + sP(pm) + '=-1') + ' ✓',
            ['Count the rise and the run from ' + t('A') + ' to ' + t('B') + ' (down or left is negative).', 'Perpendicular slopes are negative reciprocals: flip the fraction and change the sign.'], 'slope from a grid and its perpendicular');
          p.bad = [[sT(m), sT(m)], [sT(m), sT(red(m[1], m[0]))], [sT(m), sT([-m[0], m[1]])]];
          return p;
        } }] },

    /* ---------------- Mastery ---------------- */
    { num: '15', outcome: 'RF3',
      shared: function (r) {
        var C = r.pick([
          { k: 'trail', intro: function (A, M, s) { return 'A straight hiking trail starts at the trailhead ' + t('A' + ptT(A)) + '. A rest bench sits at the trail’s midpoint, ' + t('M' + ptT(M)) + '. On the map, each grid unit represents ' + t(s) + ' m.'; }, end: 'B', endW: 'the far end of the trail', whole: 'the whole trail' },
          { k: 'pipe', intro: function (A, M, s) { return 'A straight pipeline runs from a pumping station at ' + t('P' + ptT(A)) + ' to a storage tank ' + t('T') + '. A shut-off valve sits at the pipeline’s midpoint, ' + t('M' + ptT(M)) + '. Each grid unit represents ' + t(s) + ' m.'; }, end: 'T', endW: 'the storage tank', whole: 'the pipeline' },
          { k: 'zip', intro: function (A, M, s) { return 'A straight zip line starts at a tower at ' + t('S' + ptT(A)) + '. Its midpoint, ' + t('M' + ptT(M)) + ', is right above a pond. Each grid unit represents ' + t(s) + ' m.'; }, end: 'E', endW: 'the end of the zip line', whole: 'the zip line' }]);
        return find(function () {
          var tr = r.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13]]), sx = r.chance(0.6) ? 1 : -1, sy = r.chance(0.5) ? 1 : -1, A = [r.int(-8, 8), r.int(-8, 8)];
          var M = [A[0] + sx * tr[0], A[1] + sy * tr[1]];
          return { C: C, A: A, M: M, B: [2 * M[0] - A[0], 2 * M[1] - A[1]], c: tr[2], s: r.pick(tr[2] === 13 ? [10, 20, 50] : [10, 20, 25, 40, 50, 100]) };
        }, function (v) { return inBox(v.B, 20) && v.A[0] && v.A[1] && v.A.concat(v.M, v.B).some(function (x) { return x < 0; }); }, { C: C, A: [3, 2], M: [6, 6], B: [9, 10], c: 5, s: 40 });
      },
      stem: function (s) { return s.C.intro(s.A, s.M, s.s); },
      parts: [
        { id: '15a', outcome: 'RF3', level: 'MAS', make: function (r, s) {
          var A = s.A, M = s.M, B = s.B, e = s.C.end;
          return ptPart('Find the coordinates of ' + s.C.endW + ', ' + t(e) + '.', B, endCands(A, M), t(e + '='), e,
            'The step from the start to ' + t('M') + ' is ' + t(ptT(sub(M, A))) + '. Take the same step from ' + t('M') + ': ' + t(e + '=(' + M[0] + '+' + nb(M[0] - A[0]) + ',\\ ' + M[1] + '+' + nb(M[1] - A[1]) + ')=' + ptT(B)) + '.',
            HE, 'context: missing endpoint');
        } },
        { id: '15b', outcome: 'RF3', level: 'MAS', make: function (r, s) {
          var A = s.A, M = s.M, B = s.B, c = s.c, sc = s.s, L = 2 * c * sc, dx = Math.abs(B[0] - A[0]), dy = Math.abs(B[1] - A[1]);
          return numPart('Find the length of ' + s.C.whole + ', in metres.', L,
            [[c * sc, 'u6t-half', 'That is the distance from the start to the midpoint — only <b>half</b> of ' + s.C.whole + '.'], [2 * c, 'u6t-no-scale', 'That is the length in grid units. Each unit is ' + t(sc) + ' m: multiply.'], [c, 'u6t-half-noscale', 'That is half the length, in grid units. Double it, then use the scale.'], [(dx + dy) * sc, 'u6t-d-legs', 'Use the distance formula — don’t just add the run and the rise.'], [(dx * dx + dy * dy) * sc, 'u6t-no-root', 'Take the square root in the distance formula.']],
            'From ' + t(ptT(A)) + ' to ' + t(ptT(B)) + ': ' + t('d=\\sqrt{' + dx + '^{2}+' + dy + '^{2}}=\\sqrt{' + (dx * dx + dy * dy) + '}=' + (2 * c)) + ' grid units.<br>' + t(2 * c + '\\times ' + sc + '=' + F(L)) + ' m. (Or: the start to ' + t('M') + ' is ' + t(c) + ' units, so the whole length is ' + t('2\\times ' + c + '\\times ' + sc + '=' + F(L)) + ' m.)',
            ['Use the distance formula on the two ends (or on the start and the midpoint, then double it).', 'Then change grid units to metres with the scale.'], 'context: length with a scale', { after: 'm', unitAns: 'm', placeholder: 'a number' });
        } }] },
    { num: '16', outcome: 'RF3', parts: [
      { id: '16', outcome: 'RF3', level: 'MAS', make: function (r) {
        var v = find(function () {
          var pq = r.pick([[1, 1], [2, 1], [3, 1], [1, 2], [2, 3], [3, 2], [4, 3], [3, 4], [5, 2]]), sg = r.chance(0.65) ? 1 : -1, j1 = r.int(1, 3), j2 = r.int(1, 3);
          var J = [r.int(-6, 5), r.int(-6, 6)], Kp = [J[0] + pq[1] * j1, J[1] + sg * pq[0] * j1], Lx = Kp[0] + pq[1] * j2, k = Kp[1] + sg * pq[0] * j2;
          return { J: J, K: Kp, Lx: Lx, k: k, m: [sg * pq[0], pq[1]], run: pq[1] * j2, rise: sg * pq[0] * j2 };
        }, function (v) { return Math.abs(v.Lx) <= 14 && Math.abs(v.k) <= 16 && v.k !== 0 && v.J.concat(v.K).some(function (x) { return x < 0; }) && v.J[1] !== v.K[1]; }, { J: [-2, -1], K: [1, 1], Lx: 7, k: 5, m: [2, 3], run: 6, rise: 4 });
        var nm = r.pick([['J', 'K', 'L'], ['P', 'Q', 'R'], ['A', 'B', 'C'], ['E', 'F', 'G']]), m = v.m, mv = sV(m), Kp = v.K;
        return numPart('The points ' + nP(nm[0], v.J) + ', ' + nP(nm[1], Kp) + ' and ' + t(nm[2] + '(' + v.Lx + ',\\ k)') + ' are collinear. Find ' + t('k') + '.', v.k,
          [[Kp[1] + v.run / mv, 'u6t-k-flip', 'Slope is rise over run: the rise from ' + t(nm[1]) + ' to ' + t(nm[2]) + ' is the slope <b>times</b> the run.'], [Kp[1] - v.rise, 'u6t-k-sign', 'Check the sign: the slope is ' + (mv > 0 ? 'positive' : 'negative') + ' and the run is positive, so ' + t('k') + ' is ' + (mv > 0 ? 'above' : 'below') + ' ' + t(Kp[1]) + '.'], [v.rise, 'u6t-k-no-start', 'That is the rise from ' + t(nm[1]) + ' to ' + t(nm[2]) + '. ' + t('k') + ' is the ' + t('y') + '-coordinate: start from ' + t(Kp[1]) + ' and add the rise.'],
            [v.J[1] + v.rise, 'u6t-k-sign', 'Start from the ' + t('y') + '-coordinate of ' + t(nm[1]) + ' (the run ' + t(v.run) + ' is measured from ' + t(nm[1]) + ').']],
          t(calc(v.J, Kp, nm[0] + nm[1])) + '. Collinear points: ' + t(nm[1] + nm[2]) + ' has the same slope.<br>' + t('\\frac{k-' + nb(Kp[1]) + '}{' + v.Lx + '-' + nb(Kp[0]) + '}=' + sT(m) + '\\ \\Rightarrow\\ \\frac{k-' + nb(Kp[1]) + '}{' + v.run + '}=' + sT(m) + '\\ \\Rightarrow\\ k-' + nb(Kp[1]) + '=' + sT(m) + '\\times ' + v.run + '=' + v.rise + '\\ \\Rightarrow\\ k=' + v.k) + '<br>Check: ' + t(calc(Kp, [v.Lx, v.k])) + ' ✓',
          ['Find the slope of ' + t(nm[0] + nm[1]) + '. For collinear points, ' + t(nm[1] + nm[2]) + ' has the same slope.', 'Write the slope of ' + t(nm[1] + nm[2]) + ' with ' + t('k') + ' on top, set it equal, and solve.'], 'collinear: find k', { before: t('k='), beforeAns: 'k=' });
      } }] },
    { num: '17', outcome: 'RF3',
      shared: function (r) {
        return find(function () {
          var pq = r.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [3, 4], [4, 3], [1, 4]]), sg = r.chance(0.5) ? -1 : 1, rel = r.chance(0.65) ? 'perp' : 'par', m = [sg * pq[0], pq[1]];
          var Pp = [r.int(-6, 4), r.int(-6, 6)], j = r.pick([1, 2]), Q = [Pp[0] + pq[1] * j, Pp[1] + sg * pq[0] * j];
          var T = rel === 'perp' ? red(-m[1], m[0]) : m, i = r.pick([1, 2, 3]), U = [r.int(-6, 3), r.int(-6, 6)], run = T[1] * i;
          return { P: Pp, Q: Q, U: U, Vx: U[0] + run, k: U[1] + T[0] * i, run: run, rise: T[0] * i, m: m, T: T, rel: rel };
        }, function (v) { return inBox(v.Q, 9) && Math.abs(v.Vx) <= 12 && v.k !== 0 && Math.abs(v.k) <= 18 && v.run >= 3 && v.U[0] && v.U[1] && v.P.concat(v.Q).every(function (x) { return x !== 0; }); }, { P: [1, 5], Q: [5, 3], U: [-2, 3], Vx: 6, k: 19, run: 8, rise: 16, m: [-1, 2], T: [2, 1], rel: 'perp' });
      },
      stem: function (s) { return 'Segment ' + t('PQ') + ' joins ' + nP('P', s.P) + ' and ' + nP('Q', s.Q) + '. Segment ' + t('UV') + ' joins ' + nP('U', s.U) + ' and ' + t('V(' + s.Vx + ',\\ k)') + '. The segments are <b>' + (s.rel === 'perp' ? 'perpendicular' : 'parallel') + '</b>.'; },
      parts: [
        { id: '17', outcome: 'RF3', level: 'MAS', make: function (r, s) {
          var m = s.m, T = s.T, U = s.U, mv = sV(m), kFor = function (sl) { return U[1] + sl * s.run; };
          var alts = s.rel === 'perp' ? [[kFor(mv), 'u6t-k-rel', 'That makes ' + t('UV') + ' <b>parallel</b> to ' + t('PQ') + '. Perpendicular segments need the <b>negative reciprocal</b> slope.'], [kFor(1 / mv), 'u6t-k-nosign', 'Perpendicular slopes also have <b>opposite signs</b>: flip the fraction and change the sign.'], [kFor(-mv), 'u6t-k-noflip', 'You changed the sign — also flip the fraction (take the reciprocal).']]
            : [[kFor(-1 / mv), 'u6t-k-rel', 'That makes ' + t('UV') + ' <b>perpendicular</b> to ' + t('PQ') + '. Parallel segments have <b>equal</b> slopes.'], [kFor(1 / mv), 'u6t-k-flip', 'Parallel segments have equal slopes — don’t flip the fraction.'], [kFor(-mv), 'u6t-k-sign', 'Equal slopes have the same sign.']];
          alts.push([U[1] - s.rise, 'u6t-k-sign', 'Check the sign when you solve for ' + t('k') + ': ' + t('k=' + U[1] + '+\\text{rise}') + '.'], [s.rise, 'u6t-k-no-start', 'That is the rise from ' + t('U') + ' to ' + t('V') + '. Add it to the ' + t('y') + '-coordinate of ' + t('U') + '.']);
          var kc = numChk(s.k, alts);
          var sol = t(calc(s.P, s.Q, 'PQ')) + '.<br>' + (s.rel === 'perp' ? 'Perpendicular: ' + t('m_{UV}') + ' is the negative reciprocal, ' + t(sT(T)) + '.' : 'Parallel: ' + t('m_{UV}') + ' is the same, ' + t(sT(T)) + '.') + '<br>' +
            t('\\frac{k-' + nb(U[1]) + '}{' + s.Vx + '-' + nb(U[0]) + '}=' + sT(T) + '\\ \\Rightarrow\\ \\frac{k-' + nb(U[1]) + '}{' + s.run + '}=' + sT(T) + '\\ \\Rightarrow\\ k-' + nb(U[1]) + '=' + sT(T) + '\\times ' + s.run + '=' + s.rise + '\\ \\Rightarrow\\ k=' + s.k) + '<br>Check: ' + t(calc(U, [s.Vx, s.k], 'UV')) + ' ✓';
          var p = fieldsPart('Find the slope of ' + t('PQ') + ', the slope ' + t('UV') + ' must have, and ' + t('k') + '.', [sField('PQ'), sField('UV', 'Slope UV must have'), { name: 'k', label: t('k='), mode: 'math', keys: 'slope', placeholder: 'a number' }],
            [slopeChk(m, null, false), relChk(m, s.rel), kc], [sT(m), sT(T), String(s.k)], t('m_{PQ}=' + sT(m) + ',\\ m_{UV}=' + sT(T) + ',\\ k=' + s.k), sol,
            [(s.rel === 'perp' ? 'Perpendicular segments: negative reciprocal slopes.' : 'Parallel segments: equal slopes.'), 'Write the slope of ' + t('UV') + ' with ' + t('k') + ' on top, set it equal to the slope it must have, and solve.'], 'k for ' + s.rel);
          p.bad = [[sT(m), sT(m), String(cl(kFor(mv)))], [sT(m), sT(T), String(cl(U[1] - s.rise))]].filter(function (b) { return p.check(b).v !== 'correct'; });
          return p;
        } }] },
    { num: '18', outcome: 'RF3',
      shared: function (r) {
        return find(function () {
          var d = r.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 1]]), sx = r.chance(0.5) ? 1 : -1, sy = r.chance(0.5) ? 1 : -1, iso = r.chance(0.45);
          var k1 = r.int(1, 3), k2 = iso ? k1 : r.pick([1, 2, 3].filter(function (x) { return x !== k1; })), u = [sx * d[0] * k1, sy * d[1] * k1], w = [-sy * d[1] * k2, sx * d[0] * k2];
          if (r.chance(0.5)) w = [-w[0], -w[1]];
          var B = [r.int(-5, 5), r.int(-5, 5)], A = [B[0] - u[0], B[1] - u[1]], C = [B[0] + w[0], B[1] + w[1]];
          if (Math.abs(u[0]) + Math.abs(u[1]) < 4 || Math.abs(w[0]) + Math.abs(w[1]) < 4) return null;
          return { A: A, B: B, C: C, iso: iso, nm: r.pick([['A', 'B', 'C'], ['D', 'E', 'F'], ['P', 'Q', 'R'], ['X', 'Y', 'Z']]) };
        }, function (v) { return [v.A, v.B, v.C].every(function (p) { return inBox(p, 9); }) && v.A.concat(v.B, v.C).some(function (x) { return x < 0; }) && slopeOf(v.A, v.B) && slopeOf(v.B, v.C) && slopeOf(v.A, v.B)[0] !== 0 && slopeOf(v.B, v.C)[0] !== 0; }, { A: [-3, -5], B: [3, 3], C: [-5, 9], iso: true, nm: ['A', 'B', 'C'] });
      },
      stem: function (s) { var n = s.nm; return 'Triangle ' + t(n.join('')) + ' has vertices ' + nP(n[0], s.A) + ', ' + nP(n[1], s.B) + ' and ' + nP(n[2], s.C) + '.'; },
      parts: [
        { id: '18a', outcome: 'RF3', level: 'MAS', make: function (r, s) {
          var n = s.nm, n1 = n[0] + n[1], n2 = n[1] + n[2], a = slopeOf(s.A, s.B), b = slopeOf(s.B, s.C), pr = red(a[0] * b[0], a[1] * b[1]);
          var pc = numChk(-1, [[1, 'u6t-prod-sign', 'Check the signs: one slope is positive and the other is negative, so the product is negative.']]);
          var p = fieldsPart('Use slopes to show that the triangle has a right angle at ' + t(n[1]) + ': find the two slopes and multiply them.', [sField(n1), sField(n2), { name: 'Product', label: t('m_{' + n1 + '}\\times m_{' + n2 + '}='), mode: 'math', keys: 'slope', placeholder: 'a number' }],
            [slopeChk(a, null, false), slopeChk(b, null, false), pc], [sT(a), sT(b), '-1'], t('m_{' + n1 + '}=' + sT(a) + ',\\ m_{' + n2 + '}=' + sT(b) + ',\\ m_{' + n1 + '}\\times m_{' + n2 + '}=-1'),
            t(calc(s.A, s.B, n1)) + '<br>' + t(calc(s.B, s.C, n2)) + '<br>' + t(sT(a) + '\\times ' + sP(b) + '=' + frT(pr[0], pr[1])) + ': the slopes are negative reciprocals, so ' + t(n1 + '\\perp ' + n2) + ' and the angle at ' + t(n[1]) + ' is ' + t('90^{\\circ}') + '.',
            ['The angle at ' + t(n[1]) + ' is between ' + t(n1) + ' and ' + t(n2) + '.', 'Perpendicular slopes multiply to ' + t('-1') + '.'], 'right angle by slopes', true);
          p.bad = [[sT(a), sT(b), '1'], [sT([-a[0], a[1]]), sT(b), '1']];
          return p;
        } },
        { id: '18b', outcome: 'RF3', level: 'MAS', make: function (r, s) {
          var n = s.nm, n1 = n[0] + n[1], n2 = n[1] + n[2], A = s.A, B = s.B, C = s.C, ab = d2Of(A, B), bc = d2Of(B, C);
          var lc = function (d2, P0, Q0) { return lenChk(d2, dDiag(dCands(P0, Q0))); };
          var p = fieldsPart('Find the lengths of ' + t(n1) + ' and ' + t(n2) + ' (exact, or to the nearest tenth). Is the triangle isosceles?', [{ name: n1, label: t(n1 + '='), mode: 'math', keys: 'radical', placeholder: 'exact or decimal' }, { name: n2, label: t(n2 + '='), mode: 'math', keys: 'radical', placeholder: 'exact or decimal' }, ynField('Isosceles?', 'Is it isosceles?')],
            [lc(ab, A, B), lc(bc, B, C), ynChk(s.iso ? 'yes' : 'no', 'u6t-iso', s.iso ? 'An isosceles triangle has two equal sides — ' + t(n1) + ' and ' + t(n2) + ' are equal.' : 'Isosceles means two equal sides: compare ' + t(n1) + ' and ' + t(n2) + '.')],
            [lenKey(ab), lenKey(bc), s.iso ? 'yes' : 'no'], t(n1 + '=' + lenAns(ab) + ',\\ ' + n2 + '=' + lenAns(bc)) + '; <b>' + (s.iso ? 'yes' : 'no') + '</b>',
            t(dLine(A, B, n1)) + '<br>' + t(dLine(B, C, n2)) + '<br>' + (s.iso ? 'The two legs are equal, so the triangle is a <b>right isosceles</b> triangle: <b>yes</b>.' : 'The two legs are different (and the hypotenuse ' + t(n[0] + n[2]) + ' is longer than both), so it is <b>not</b> isosceles: a right <b>scalene</b> triangle.'),
            ['Distance formula: ' + t('d=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}') + '.', 'Isosceles: two sides the same length. In a right triangle, the hypotenuse is always the longest side.'], 'triangle: lengths and isosceles');
          p.bad = [[String(ab), lenKey(bc), s.iso ? 'yes' : 'no'], [lenKey(ab), lenKey(bc), s.iso ? 'no' : 'yes']];
          return p;
        } }] },
    { num: '19', outcome: 'RF3',
      shared: function (r) {
        var v = find(function () {
          var pq = r.pick(NICE.filter(function (x) { return x[0] !== x[1] && x[0] <= 5 && x[1] <= 5; })), sg = r.chance(0.5) ? -1 : 1, j = r.int(1, 3), A = [r.int(-6, 2), r.int(-6, 6)];
          return { A: A, B: [A[0] + pq[1] * j, A[1] + sg * pq[0] * j] };
        }, function (v) { var dx = v.B[0] - v.A[0], dy = v.B[1] - v.A[1]; return inBox(v.B, 8) && Math.abs(dx) >= 3 && Math.abs(dy) >= 3 && Math.abs(dx) !== Math.abs(dy) && v.A[0] && v.A[1] && v.B[0] && v.B[1] && v.A.concat(v.B).some(function (x) { return x < 0; }); }, { A: [-2, 1], B: [6, 7] });
        return { A: v.A, B: v.B, nm: r.pick(PAIRN), st: r.pick(STUD), orderFirst: r.chance(0.5) };
      },
      stem: function (s) {
        var A = s.A, B = s.B, w1 = '\\frac{' + B[1] + '-' + nb(A[1]) + '}{' + A[0] + '-' + nb(B[0]) + '}=\\frac{' + (B[1] - A[1]) + '}{' + (A[0] - B[0]) + '}=' + sT(red(B[1] - A[1], A[0] - B[0])),
          w2 = '\\frac{' + B[0] + '-' + nb(A[0]) + '}{' + B[1] + '-' + nb(A[1]) + '}=\\frac{' + (B[0] - A[0]) + '}{' + (B[1] - A[1]) + '}=' + sT(red(B[0] - A[0], B[1] - A[1]));
        var a = s.orderFirst ? w1 : w2, b = s.orderFirst ? w2 : w1;
        return s.st[0] + ' and ' + s.st[1] + ' each found the slope of the segment joining ' + nP(s.nm[0], A) + ' and ' + nP(s.nm[1], B) + '. Both made a mistake.' +
          '<div style="margin:.5em 0 .2em"><b>' + s.st[0] + ':</b>&nbsp; ' + t('\\displaystyle m=' + a) + '</div><div style="margin:.4em 0"><b>' + s.st[1] + ':</b>&nbsp; ' + t('\\displaystyle m=' + b) + '</div>';
      },
      parts: [
        { id: '19a', outcome: 'RF3', level: 'MAS', make: function (r, s) {
          var want = {}; want.s0 = s.orderFirst ? 'order' : 'flip'; want.s1 = s.orderFirst ? 'flip' : 'order';
          var nmOf = { s0: s.st[0], s1: s.st[1] };
          var why = function (row) { var w = want[row]; return w === 'order' ? 'Look at ' + nmOf[row] + '’s top and bottom: the top starts with ' + t(s.nm[1]) + '’s coordinate but the bottom starts with ' + t(s.nm[0]) + '’s.' : 'Look at what ' + nmOf[row] + ' put on top: the change in ' + t('x') + ' (the run) is on top, so it is run over rise.'; };
          return gridPart('What mistake did each student make?', [{ id: 's0', html: '<b>' + s.st[0] + '</b>', label: s.st[0] }, { id: 's1', html: '<b>' + s.st[1] + '</b>', label: s.st[1] }],
            [{ id: 'order', html: 'Subtracted in different orders on the top and the bottom', label: 'order' }, { id: 'flip', html: 'Put the run over the rise', label: 'run over rise' }, { id: 'neg', html: 'Subtracted a negative number wrongly', label: 'negative' }], want, why,
            (s.orderFirst ? s.st[0] : s.st[1]) + ' subtracted in different orders: ' + t(s.nm[1] + '-' + s.nm[0]) + ' on the top, but ' + t(s.nm[0] + '-' + s.nm[1]) + ' on the bottom.<br>' + (s.orderFirst ? s.st[1] : s.st[0]) + ' put the run (change in ' + t('x') + ') over the rise (change in ' + t('y') + ').',
            ['Check that each student subtracts in the same order on the top and the bottom.', 'Slope is rise (change in ' + t('y') + ') over run (change in ' + t('x') + ').'], 'name the two slope mistakes', 'Student', 'u6t-err-one');
        } },
        { id: '19b', outcome: 'RF3', level: 'MAS', make: function (r, s) {
          var m = slopeOf(s.A, s.B), dy = s.B[1] - s.A[1], dx = s.B[0] - s.A[0], wo = red(dy, -dx), wf = red(dx, dy), ord = s.orderFirst ? s.st[0] : s.st[1], fl = s.orderFirst ? s.st[1] : s.st[0];
          var diag = function (v) { if (near(v, sV(wo))) return { code: 'u6t-copied', hint: 'That is ' + ord + '’s answer. Subtract in the same order on the top and the bottom.' }; if (near(v, sV(wf))) return { code: 'u6t-copied', hint: 'That is ' + fl + '’s answer: it is run over rise.' }; return null; };
          var p = slopeAns('Find the correct slope of ' + t(s.nm[0] + s.nm[1]) + '.', m, slopeChk(m, diag, false), t(calc(s.A, s.B, s.nm[0] + s.nm[1])) + ': ' + t(s.nm[1] + '-' + s.nm[0]) + ' on the top <b>and</b> the bottom, rise over run.',
            [SLOPE_HINT], 'correct slope after the error analysis', t('m_{' + s.nm[0] + s.nm[1] + '}='));
          p.bad = [sT(wo), sT(wf)];
          return p;
        } }] }
  ];

  /* Q2: the length of a horizontal (axis 0) or vertical (axis 1) segment */
  function lenHV(seg, nm, axis) {
    var a = seg[0][axis], b = seg[1][axis], L = Math.abs(b - a), v = axis === 0 ? 'x' : 'y', o = axis === 0 ? 'y' : 'x', n = nm.join(''), hv = axis === 0 ? 'horizontal' : 'vertical';
    var alts = [[a - b < 0 ? a - b : b - a, 'u6t-len-neg', 'A length is never negative: subtract the smaller ' + t(v) + '-coordinate from the larger one (or take the absolute value).']];
    if (a * b < 0) alts.push([Math.abs(Math.abs(b) - Math.abs(a)), 'u6t-len-signs', 'One endpoint is on each side of ' + t(v + '=0') + ': count ' + t(Math.abs(a)) + ' and ' + t(Math.abs(b)) + ' units and <b>add</b> them — or subtract with the signs, ' + t(Math.max(a, b) + '-' + nb(Math.min(a, b)) + '=' + L) + '.']);
    else if (a < 0) alts.push([Math.abs(a) + Math.abs(b), 'u6t-len-signs', 'Both endpoints are on the same side of ' + t(v + '=0') + ': subtract with the signs, ' + t(Math.max(a, b) + '-' + nb(Math.min(a, b)) + '=' + L) + '.']);
    var p = numPart('Segment ' + t(n) + ' joins ' + nP(nm[0], seg[0]) + ' and ' + nP(nm[1], seg[1]) + '.', L, alts,
      'The ' + t(o) + '-coordinates are the same, so ' + t(n) + ' is ' + hv + '. Its length is the difference of the ' + t(v) + '-coordinates: ' + t(n + '=' + Math.max(a, b) + '-' + nb(Math.min(a, b)) + '=' + L) + ' units.',
      ['The ' + t(o) + '-coordinates match, so the segment is ' + hv + ': only the ' + t(v) + '-coordinates change.', 'Length ' + t('=') + ' larger ' + t(v) + ' ' + t('-') + ' smaller ' + t(v) + ' (watch the negatives). A length is never negative.'], hv + ' length', { before: t(n + '='), after: 'units', beforeAns: n + '=', unitAns: 'units' });
    return p;
  }

  HW.defineTest({
    id: 'u6test', unit: 6, title: 'Unit 6 Test', outcome: 'RF3', calc: true,
    blurb: 'The Unit 6 outcomes-based test on RF3: the Pythagorean theorem, lengths of segments, the distance and midpoint formulas, a missing endpoint, slope (from a grid, from two points, as a rate of change), zero and undefined slope, collinear points, and parallel and perpendicular lines — in Beginning, Progressing and Mastery boxes. Scientific calculator allowed.',
    questions: QUESTIONS
  });
})(window);
