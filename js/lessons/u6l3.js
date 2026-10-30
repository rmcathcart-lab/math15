/* Math 15 · Unit 6 · Lesson 3 — Measuring the Length of a Line Segment: Diagonal Segments and the Distance Formula
 * (RF3 on every part). Assignment 3 (u6_L03.tex, Questions 1–15) and the Lesson 3 Extra Practice (u6_EP03.tex, Questions 1–18).
 * Every part is a generator: the run and rise come from Pythagorean triples when the booklet's length is a whole number,
 * and from leg pairs with (or without) a perfect-square factor when it is a radical; the booklet's own points are among
 * the possible versions.
 * Model: Math 10C u6l1.js (exact-length checker and its diagnoses, rounded lengths, sums of radicals, "both values" answers,
 * ordered-pair answers) and Math 15 u6l1.js / u6l2.js (keypads, lettered grids).
 * Conversions: "build a right triangle under the segment" -> tap the right-angle vertex on the graph pad (either corner
 * of the run/rise rectangle is accepted); "explain / name the triangle / which pairs match" -> multiple choice whose
 * options are reasons; "show using squared lengths" -> one box per side of the comparison.
 * Lengths: exact = simplest mixed radical (or whole number); "rounded to the nearest tenth" accepts the exact radical too,
 * as the brief asks; "exact and decimal" asks for both.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 18(a) (the point on the x-axis equidistant from two points). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ---------- keypads: radicals; one ordered pair ---------- */
  var RADK = 'u6l3rad', PTK = 'u6l3pt', Wd = HW.widgets;
  if (Wd && Wd.KEYSETS) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' },
      right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' }, enter: { label: 'Check ↵', fn: 'enter', wide: true },
      sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' }, plus: { label: '+', tex: '+', plain: '+' }, minus: { label: '−', tex: '-', plain: '-' },
      dot: { label: '.', tex: '.', plain: '.' }, par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Ordered pair: type x, y inside' }, comma: { label: ',', tex: ',', plain: ', ' } };
    if (!Wd.KEYSETS[RADK]) Wd.KEYSETS[RADK] = [[dk(7), dk(8), dk(9), KY.sqrt, KY.plus, KY.del], [dk(4), dk(5), dk(6), KY.minus, KY.clear], [dk(1), dk(2), dk(3), KY.dot, KY.left, KY.right], [dk(0), KY.enter]];
    if (!Wd.KEYSETS[PTK]) Wd.KEYSETS[PTK] = [[dk(7), dk(8), dk(9), KY.par, KY.del], [dk(4), dk(5), dk(6), KY.minus, KY.clear], [dk(1), dk(2), dk(3), KY.comma, KY.left, KY.right], [dk(0), KY.dot, KY.enter]];
    if (Wd.KEYHELP) {
      if (!Wd.KEYHELP[RADK]) Wd.KEYHELP[RADK] = ['Type the number in front first, then <b>√</b>, e.g. 2 then √ then 13 for ' + HW.k('2\\sqrt{13}') + '. Press <b>▶</b> to step out of the root. Decimals use <b>.</b>; a sum uses <b>+</b>.', 'Type a root as <code>2sqrt(13)</code>; a sum as <code>2sqrt(10) + 3sqrt(5)</code>; a decimal as <code>7.2</code>.'];
      if (!Wd.KEYHELP[PTK]) Wd.KEYHELP[PTK] = ['Press <b>( )</b>, type the two coordinates with <b>,</b> between them, then <b>▶</b> to step out.', 'Type a point as <code>(3, -2)</code>.'];
    }
  }

  HW.addCodes({
    'neg-length': 'Gave a negative length', 'no-root': 'Gave the squared length (no square root)', 'add-legs': 'Added the run and rise instead of using the Pythagorean theorem',
    'no-square': 'Didn’t square the run and rise', 'sub-squares': 'Subtracted the squares', count: 'Run/rise off by one (counted lines, not spaces)', 'neg-sub': 'Subtracting a negative (should add)',
    'diff-order': 'Subtracted in the other order', scale: 'Ignored the grid scale', 'not-collected': 'Like radicals not collected', 'add-whole': 'Whole numbers not added', 'round-first': 'Rounded before adding',
    'pt-form': 'Point not written as (x, y)', 'pt-x': 'Wrong x-coordinate', 'pt-y': 'Wrong y-coordinate', pt: 'Wrong point', 'pairs-flip': 'Ordered pairs backwards', 'perim-side': 'Left a side out of the perimeter',
    'graph-points': 'Plotted a point in the wrong place', 'sol-missing': 'Missed a solution', 'sol-extra': 'Extra solution', 'sol-sign': 'Solutions with the wrong sign',
    'u6l3-vertex': 'Right-angle vertex not at a corner of the run and rise', 'u6l3-run-rise': 'Run and rise swapped', 'u6l3-coord-sum': 'Added the coordinates instead of subtracting them',
    'u6l3-scale-div': 'Divided by the map scale instead of multiplying', 'u6l3-scale-twice': 'Applied the scale to the run and rise and again to the distance', 'u6l3-one-k': 'Found only one value of k',
    'u6l3-k-shift': 'Took ± of the leg but forgot to add the known coordinate', 'u6l3-k-sign': 'Moved the wrong way from the known coordinate', 'u6l3-xaxis-y': 'Point on the x-axis given a non-zero y',
    'u6l3-mid': 'Gave the midpoint of the segment instead', 'u6l3-dist-sq': 'Gave the squared distance', 'u6l3-perim-sq': 'Added the squared lengths for the perimeter'
  });
  HW.addPartial({ 'u6l3-vertex': 'n', 'u6l3-run-rise': 's', 'u6l3-coord-sum': 'n', 'u6l3-scale-div': 'b', 'u6l3-scale-twice': 'b', 'u6l3-one-k': 'b', 'u6l3-k-shift': 'b', 'u6l3-k-sign': 's',
    'u6l3-xaxis-y': 'n', 'u6l3-mid': 'n', 'u6l3-dist-sq': 's', 'u6l3-perim-sq': 'n' });

  /* ---------- number helpers ---------- */
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 1e-7 : e); }
  function isSq(n) { var q = Math.round(Math.sqrt(n)); return q * q === n; }
  function simp(N) { var k = 1, m = N; for (var f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; } return { k: k, m: m }; }
  function rt(N) { var s = simp(N); return s.m === 1 ? String(s.k) : (s.k === 1 ? '' : s.k) + '\\sqrt{' + s.m + '}'; }
  function rtPlain(N) { var s = simp(N); return s.m === 1 ? String(s.k) : (s.k === 1 ? '' : s.k) + 'sqrt(' + s.m + ')'; }
  function rtSteps(N) { var s = simp(N); if (s.m === 1) return '\\sqrt{' + N + '}=' + s.k; if (s.k === 1) return '\\sqrt{' + N + '}'; return '\\sqrt{' + N + '}=\\sqrt{' + (s.k * s.k) + '\\times ' + s.m + '}=' + s.k + '\\sqrt{' + s.m + '}'; }
  function dec(x, dp) { return K.roundTo(x, dp).toFixed(dp); }
  function hasSqF(N) { var s = simp(N); return s.m > 1 && s.k > 1; }
  function sqFree(N) { return simp(N).k === 1 && N > 1 && !isSq(N); }
  function halfway(x, dp) { var s = Math.pow(10, dp), f = x * s - Math.floor(x * s); return Math.abs(f - 0.5) < 0.02; }
  function P2(p) { return '(' + F(p[0]) + ',\\ ' + F(p[1]) + ')'; }
  function pt(p) { return '(' + p[0] + ', ' + p[1] + ')'; }
  function pr(v) { return v < 0 ? '(' + F(v) + ')' : F(v); }
  function sub(a, b) { return F(a) + '-' + pr(b); }
  function sgn(r) { return r.chance(0.5) ? 1 : -1; }
  function d2(A, B) { return (B[0] - A[0]) * (B[0] - A[0]) + (B[1] - A[1]) * (B[1] - A[1]); }
  function legPairs(lo, hi, test) { var out = []; for (var a = lo; a <= hi; a++) for (var b = lo; b <= hi; b++) if (test(a * a + b * b, a, b)) out.push([a, b]); return out; }
  var TRI = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [15, 8], [9, 12], [12, 9], [7, 24], [24, 7]];
  function within(list, aLo, aHi, bLo, bHi) { return list.filter(function (p) { return p[0] >= aLo && p[0] <= aHi && p[1] >= bLo && p[1] <= bHi; }); }
  /* a segment from A with run/rise vector (dx, dy) (signs chosen), both endpoints in the box, optionally with a negative coordinate */
  function seg(r, ab, box, needNeg) {
    for (var i = 0; i < 300; i++) {
      var v = [sgn(r) * ab[0], sgn(r) * ab[1]], A = [r.int(box[0], box[1]), r.int(box[0], box[1])], B = [A[0] + v[0], A[1] + v[1]];
      if (B[0] < box[0] || B[0] > box[1] || B[1] < box[0] || B[1] > box[1]) continue;
      if (needNeg && !(A.concat(B).some(function (c) { return c < 0; }))) continue;
      return [A, B];
    }
    return [[0, 0], ab.slice()];
  }

  /* ---------- distance diagnoses and solutions ---------- */
  function distDiag(dx, dy) {
    var a = Math.abs(dx), b = Math.abs(dy), N = a * a + b * b;
    return function (v, tol) {
      tol = tol || 1e-6; if (!isFinite(v)) return null;
      if (N > 1 && near(v, N, tol)) return { code: 'no-root', hint: t(a + '^{2}+' + b + '^{2}=' + N) + ' is the <b>square</b> of the distance. Take its square root to finish.' };
      if (near(v, a + b, tol)) return { code: 'add-legs', hint: 'You added the run and the rise. The segment is the hypotenuse of a right triangle, so its length is ' + t('\\sqrt{\\text{run}^{2}+\\text{rise}^{2}}') + ', which is less than run + rise.' };
      if (near(v, Math.sqrt(a + b), tol)) return { code: 'no-square', hint: 'Square the run and the rise <b>before</b> you add them: ' + t('d=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}') + '.' };
      if (a !== b && near(v, Math.sqrt(Math.abs(a * a - b * b)), tol)) return { code: 'sub-squares', hint: 'The segment is the hypotenuse, so <b>add</b> the two squares.' };
      var offs = [[a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]];
      for (var i = 0; i < offs.length; i++) if (offs[i][0] >= 0 && offs[i][1] >= 0 && near(v, Math.hypot(offs[i][0], offs[i][1]), tol)) return { code: 'count', hint: 'Check your run and rise: subtract the coordinates carefully (subtracting a negative adds), or count the grid <b>spaces</b>.' };
      return null;
    };
  }
  function signDiag(A, B) { // differences worked out with a sign slip
    var dg = distDiag(B[0] - A[0], B[1] - A[1]), sx = Math.abs(B[0] + A[0]), sy = Math.abs(B[1] + A[1]);
    return function (v, tol) {
      var h = dg(v, tol); if (h) return h;
      if ((sx !== Math.abs(B[0] - A[0]) || sy !== Math.abs(B[1] - A[1])) && (near(v, Math.hypot(sx, B[1] - A[1]), tol) || near(v, Math.hypot(B[0] - A[0], sy), tol) || near(v, Math.hypot(sx, sy), tol)))
        return { code: 'neg-sub', hint: 'Watch the signs: subtracting a negative coordinate <b>adds</b>, e.g. ' + t('3-(-4)=7') + '.' };
      return null;
    };
  }
  function distSol(name, A, B, dp) {
    var dx = B[0] - A[0], dy = B[1] - A[1], N = dx * dx + dy * dy;
    return t(name + '=\\sqrt{(' + sub(B[0], A[0]) + ')^{2}+(' + sub(B[1], A[1]) + ')^{2}}=\\sqrt{' + pr(dx) + '^{2}+' + pr(dy) + '^{2}}=\\sqrt{' + dx * dx + '+' + dy * dy + '}=' + rtSteps(N) + (dp && !isSq(N) ? '\\approx ' + dec(Math.sqrt(N), dp) : '')) + (isSq(N) ? '' : simp(N).k === 1 ? ' (' + t(N) + ' has no perfect-square factor).' : '.');
  }

  /* ---------- checkers ---------- */
  function exactChk(N, dg) {
    var s = simp(N), d = function (v) { return dg ? dg(v, 1e-6) : null; };
    if (s.m !== 1) return K.radical({ k: s.k, n: 2, m: s.m }, 'mixed', { diag: function (v) { return d(v); } });
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (near(a.val, s.k, 1e-9)) return (sh.roots || sh.ops || sh.muls || sh.divs || sh.pow) ? form('simplify', 'Right value — ' + t(N) + ' is a perfect square, so simplify it all the way to a whole number.') : ok();
      if (sh.decimals && !sh.roots && near(a.val, s.k, 0.06)) return form('decimal', 'Give the exact value.');
      var h = d(a.val); if (h) return wrong(h.code, h.hint);
      if (near(a.val, -s.k)) return wrong('neg-length', 'A length can’t be negative.');
      return wrong('value', null);
    };
  }
  function approxChk(N, dp, dg) {
    var x = Math.sqrt(N);
    if (isSq(N)) return function (resp) {
      var p = HW.parse.number(resp); if (!p.ok) { var a = K.read(resp); if (a.res) return a.res; return form('decimal', 'Type the length as a number.'); }
      if (near(p.value, x, 1e-9)) return ok();
      var h = dg ? dg(p.value, 0.051) : null; if (h) return wrong(h.code, h.hint);
      return wrong('value', null);
    };
    return K.approx(x, dp, { diag: dg ? function (v) { return dg(v, 0.5 * Math.pow(10, -dp) + 0.001); } : null });
  }
  function eitherChk(N, dp, dg) {
    var x = Math.sqrt(N), exact = exactChk(N, dg), tol = 0.5 * Math.pow(10, -dp) + 1e-9;
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (sh.roots || !sh.decimals && isSq(N) || sh.ops || sh.muls || sh.pow) return exact(resp);
      if (Math.abs(a.val - x) <= tol) return ok();
      if (!sh.decimals && near(a.val, Math.round(x), 1e-9)) return form('places', 'Round to the nearest tenth — or give the exact value with the <b>√</b> key.');
      var h = dg ? dg(a.val, 0.051) : null; if (h) return wrong(h.code, h.hint);
      return wrong('value', null);
    };
  }
  /* an exact sum of radicals (10C sumChk) */
  function topTerms(s) { var out = [], depth = 0, cur = ''; for (var i = 0; i < s.length; i++) { var c = s[i]; if (c === '{' || c === '(') depth++; if (c === '}' || c === ')') depth--; if (c === '+' && depth === 0) { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out.map(function (x) { return x.trim(); }).filter(Boolean); }
  function sumChk(val, diag) {
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var sh = ex.shape(a.ast), s = String(resp).replace(/\\left|\\right/g, '');
      if (near(a.val, val, 1e-7)) {
        if (sh.decimals) return form('decimal', 'Right value, but give the <b>exact</b> value — keep the radicals (use the √ key), no decimals.');
        var re = /\\sqrt\{(\d+)\}|sqrt\((\d+)\)/g, m, seen = {}, ints = 0;
        while ((m = re.exec(s))) { var R = +(m[1] || m[2]); if (simp(R).k > 1) return form('not-simplest', 'Right value — now simplify ' + t('\\sqrt{' + R + '}') + ': ' + t(R) + ' has a perfect-square factor.'); if (seen[R]) return form('not-collected', 'Right value — now collect the like radicals (the terms with the same ' + t('\\sqrt{' + R + '}') + ').'); seen[R] = 1; }
        topTerms(s).forEach(function (x) { if (/^\d+(\.\d+)?$/.test(x)) ints++; });
        if (ints > 1) return form('add-whole', 'Right value — now add the whole numbers together.');
        return ok();
      }
      if (sh.decimals && !sh.roots && near(a.val, val, 0.06)) return form('decimal', 'That’s a decimal approximation. Give the <b>exact</b> value — keep the radicals (use the √ key).');
      var h = diag ? diag(a.val) : null; if (h) return wrong(h.code, h.hint);
      return wrong('value', null);
    };
  }
  /* one point "(x, y)" */
  function splitPt(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\[,;:! ]/g, ' ').replace(/\\lbrace|\\rbrace|\\\{|\\\}/g, '').trim();
    if (s.charAt(0) === '{' && s.charAt(s.length - 1) === '}') s = s.slice(1, -1).trim();
    s = s.replace(/^[A-Za-z]'?\s*=?\s*(?=\()/, '');
    if (!s) return { empty: true };
    var m = /^\((.*)\)$/.exec(s); if (!m) return { bad: true };
    var body = m[1], depth = 0, cut = -1;
    for (var i = 0; i < body.length; i++) { var c = body[i]; if (c === '{' || c === '(' || c === '[') depth++; else if (c === '}' || c === ')' || c === ']') depth--; else if (c === ',' && depth === 0) { if (cut >= 0) return { bad: true }; cut = i; } }
    if (cut < 0) return { bad: true };
    return { x: body.slice(0, cut).trim(), y: body.slice(cut + 1).trim() };
  }
  function valOf(s) { var p = ex.parse(s); return p.ok ? ex.value(p.ast) : NaN; }
  function ptChk(T, opt) {
    opt = opt || {};
    return function (resp) {
      var S = splitPt(resp);
      if (S.empty) return form('empty', 'Type the point first.');
      if (S.bad || !S.x || !S.y) return form('pt-form', 'Write one ordered pair in brackets, ' + t('(x,\\ y)') + ': press <b>( )</b> and type the two coordinates with a comma between them.');
      var vx = valOf(S.x), vy = valOf(S.y);
      if (!isFinite(vx) || !isFinite(vy)) return form('pt-form', 'Use numbers for both coordinates.');
      if (near(vx, T[0], 1e-9) && near(vy, T[1], 1e-9)) return ok();
      if (opt.diag) { var h = opt.diag([vx, vy]); if (h) return wrong(h.code || 'pt', h.hint); }
      if (near(vx, T[1]) && near(vy, T[0]) && !near(T[0], T[1])) return wrong('pairs-flip', 'You swapped the coordinates: an ordered pair is ' + t('(x,\\ y)') + '.');
      if (near(vx, T[0])) return wrong('pt-y', 'Your ' + t('x') + '-coordinate is right — check the ' + t('y') + '-coordinate.');
      if (near(vy, T[1])) return wrong('pt-x', 'Your ' + t('y') + '-coordinate is right — check the ' + t('x') + '-coordinate.');
      return wrong('pt', null);
    };
  }

  /* ---------- part builders ---------- */
  function mcP(r, prompt, opts, sol, hints, text, keepOrder) { return KP.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  function numField(label, name, after) { return { label: label, name: name, after: after }; }
  function radField(label, name, after) { return { label: label, name: name, mode: 'math', keys: RADK, placeholder: 'e.g. 2sqrt(13)', after: after }; }
  function ptField(name) { return { label: t(name) + ':', name: name, mode: 'math', keys: PTK, placeholder: 'e.g. (3, -2)' }; }
  function numPart(prompt, ans, dg, sol, hints, text, after, bad) {
    var p = KP.number(prompt, ans, dg ? function (v) { return dg(v, 0.051); } : null, sol, hints, text, after ? { after: after } : null);
    if (after) p.answer = t(F(ans)) + ' ' + after;
    p.bad = (bad || []).filter(function (b) { return Number(b) !== ans; }).map(String);
    return p;
  }
  function exactPart(prompt, N, dg, sol, hints, text, after) {
    var p = KP.math(prompt, exactChk(N, dg), rt(N), sol, hints, text, { keys: RADK, after: after, placeholder: 'e.g. 3sqrt(5)' });
    if (after) p.answer = t(rt(N)) + ' ' + after;
    p.good = isSq(N) ? [] : [rtPlain(N)];
    p.bad = [String(N), dec(Math.sqrt(N), 1)].concat(hasSqF(N) ? ['\\sqrt{' + N + '}'] : []).filter(function (b) { return !(isSq(N) && b === dec(Math.sqrt(N), 1)); });
    return p;
  }
  function eitherPart(prompt, N, dp, dg, sol, hints, text, after) {
    var p = KP.math(prompt, eitherChk(N, dp, dg), rt(N), sol, hints, text, { keys: RADK, after: after, placeholder: 'to the nearest tenth (or exact)' });
    p.key = dec(Math.sqrt(N), dp); p.answer = t(rt(N) + '\\approx ' + dec(Math.sqrt(N), dp)) + (after ? ' ' + after : '');
    p.good = [rt(N), rtPlain(N)]; p.bad = [String(N), dec(Math.sqrt(N) + 0.1, dp)];
    return p;
  }
  function lenFields(prompt, N, dg, sol, hints, text, after, nm) {
    nm = nm || 'Length';
    var p = KP.fields(prompt, [radField('Exact:', nm + ' exact', after), numField('≈', nm + ' to the nearest tenth', after)], [exactChk(N, dg), approxChk(N, 1, dg)],
      [rt(N), isSq(N) ? String(Math.sqrt(N)) : dec(Math.sqrt(N), 1)], t(rt(N) + (isSq(N) ? '' : '\\approx ' + dec(Math.sqrt(N), 1))) + (after ? ' ' + after : '') + (isSq(N) ? ' (a whole number)' : ''), sol, hints, text);
    p.bad = [[String(N), dec(N, 1)]];
    if (!isSq(N)) p.good = [[rtPlain(N), dec(Math.sqrt(N), 1)]];
    return p;
  }
  /* the exact lengths of several sides: sides = [[name, A, B], …] */
  function sidesPart(prompt, sides, text, hints) {
    var fields = [], chks = [], keys = [], sol = [];
    sides.forEach(function (s) { var N = d2(s[1], s[2]); fields.push(radField(t(s[0]) + ' =', s[0])); chks.push(exactChk(N, signDiag(s[1], s[2]))); keys.push(rt(N)); sol.push(distSol(s[0], s[1], s[2])); });
    var p = KP.fields(prompt, fields, chks, keys, sides.map(function (s, i) { return t(s[0] + '=' + keys[i]); }).join(', '), sol.join('<br>'),
      hints || ['For each side, use ' + t('d=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}') + '.', 'Write each length in simplest radical form (or as a whole number).'], text);
    var bd = sides.map(function (s) { var dx = Math.abs(s[2][0] - s[1][0]), dy = Math.abs(s[2][1] - s[1][1]); return String(dx + dy); });
    p.bad = bd.some(function (b, i) { return near(Number(b), Math.sqrt(d2(sides[i][1], sides[i][2]))); }) ? [keys.map(function (k) { return k + '+1'; })] : [bd];
    return p;
  }
  var HINT_D = ['Subtract to get the run ' + t('x_2-x_1') + ' and the rise ' + t('y_2-y_1') + '.', 'Then ' + t('d=\\sqrt{\\text{run}^{2}+\\text{rise}^{2}}') + '; simplify the radical.'];

  /* ---------- figures ---------- */
  function labelledGraph(spec, pts) {
    spec.points = (spec.points || []).concat(pts.map(function (p) { return { x: p.x, y: p.y }; }));
    var svg = HW.graph(spec), L = HW.graph.last, X = L.X, Y = L.Y, obs = [], out = '';
    var hit = function (a, b) { return a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]; };
    var x0 = Math.max(L.xr[0], Math.min(L.xr[1], 0)), y0 = Math.max(L.yr[0], Math.min(L.yr[1], 0)), lx = spec.labelsX || spec.labels || 2, ly = spec.labelsY || spec.labels || 2;
    pts.forEach(function (p) { obs.push([X(p.x) - 5, Y(p.y) - 5, X(p.x) + 5, Y(p.y) + 5]); });
    (spec.segs || []).forEach(function (sg) { for (var i = 0; i + 1 < sg.pts.length; i++) { var a = sg.pts[i], b = sg.pts[i + 1], n = 6; for (var k = 1; k < n; k++) { var px = X(a[0] + (b[0] - a[0]) * k / n), py = Y(a[1] + (b[1] - a[1]) * k / n); obs.push([px - 3, py - 3, px + 3, py + 3]); } } });
    obs.push([X(L.xr[0]), Y(y0) - 1.5, X(L.xr[1]) + 8, Y(y0) + 1.5]); obs.push([X(x0) - 1.5, Y(L.yr[1]) - 8, X(x0) + 1.5, Y(L.yr[0])]);
    for (var tx = Math.ceil(L.xr[0] / lx) * lx; tx < L.xr[1]; tx += lx) if (tx) obs.push([X(tx) - 9, Y(y0) + 3, X(tx) + 9, Y(y0) + 16]);
    for (var ty = Math.ceil(L.yr[0] / ly) * ly; ty < L.yr[1]; ty += ly) if (ty) obs.push([X(x0) - 19, Y(ty) - 6, X(x0) - 2, Y(ty) + 6]);
    var cand = [[5, -16], [-14, -16], [5, 4], [-14, 4], [7, -6], [-16, -6], [-4, -19], [-4, 7]];
    pts.forEach(function (p) {
      var px = X(p.x), py = Y(p.y), best = null;
      for (var i = 0; i < cand.length && !best; i++) { var b = [px + cand[i][0], py + cand[i][1], px + cand[i][0] + 10, py + cand[i][1] + 13]; if (b[0] >= 0 && b[1] >= 0 && b[2] <= L.W && b[3] <= L.H && !obs.some(function (o) { return hit(b, o); })) best = b; }
      if (!best) best = [px + 5, py - 16, px + 15, py - 3];
      obs.push(best);
      out += '<text x="' + (best[0] + 5).toFixed(1) + '" y="' + (best[1] + 11).toFixed(1) + '" font-size="13" font-weight="600" text-anchor="middle" fill="#2b3340">' + p.label + '</text>';
    });
    return svg.replace(/<\/svg>$/, out + '</svg>');
  }
  function segFig(win, segs, names, max) {
    var pts = []; segs.forEach(function (s, i) { pts.push({ x: s[0][0], y: s[0][1], label: names[i][0] }, { x: s[1][0], y: s[1][1], label: names[i][1] }); });
    return '<div class="fig">' + labelledGraph({ x: win.x, y: win.y, labels: 2, max: max || 300, segs: segs.map(function (s) { return { pts: s, start: 'none', end: 'none' }; }) }, pts) + '</div>';
  }
  function padWin(pts, extra) { var xs = pts.map(function (p) { return p[0]; }).concat([0]), ys = pts.map(function (p) { return p[1]; }).concat([0]), e = extra == null ? 1 : extra; return { x: [Math.min.apply(null, xs) - e, Math.max.apply(null, xs) + e], y: [Math.min.apply(null, ys) - e, Math.max.apply(null, ys) + e] }; }
  /* tap the right-angle vertex of the triangle built under segment AB (either corner of the run/rise box is accepted) */
  function vertexPart(prompt, A, B, names, text) {
    var C1 = [B[0], A[1]], C2 = [A[0], B[1]], win = padWin([A, B], 1);
    var inp = { x: win.x, y: win.y, labels: win.x[1] - win.x[0] > 12 ? 2 : 1, mode: 'points', bg: { segs: [{ pts: [A, B], start: 'closed', end: 'closed' }], points: [{ x: A[0], y: A[1], label: names[0] }, { x: B[0], y: B[1], label: names[1] }] } };
    var p = KP.points(prompt, inp, [C1], 'The right angle is where the horizontal leg (the run) meets the vertical leg (the rise): ' + t(names[2] + P2(C1)) + ', with ' + t(names[1]) + '’s ' + t('x') + '-coordinate and ' + t(names[0]) + '’s ' + t('y') + '-coordinate. (' + t(P2(C2)) + ', on the other side of the segment, also makes a right triangle.)',
      ['Go straight across from one endpoint and straight up or down from the other: the right angle is where those two lines meet.'], text, { what: 'right-angle vertex' });
    var base1 = K.graphPoints([C1]), base2 = K.graphPoints([C2]);
    p.check = function (resp) {
      var r1 = base1(resp); if (r1.v === 'correct' || r1.v === 'form') return r1;
      if (base2(resp).v === 'correct') return ok();
      var v = HW.draw.norm(resp);
      if (v.pts.length === 1) { var q = v.pts[0]; if ((near(q[0], A[0]) && near(q[1], A[1])) || (near(q[0], B[0]) && near(q[1], B[1]))) return wrong('u6l3-vertex', 'That is an endpoint of the segment. The right angle is at the third corner: straight across from one endpoint and straight up or down from the other.'); return wrong('u6l3-vertex', t(P2(q)) + ' isn’t where the run and the rise meet. It shares its ' + t('x') + '-coordinate with one endpoint and its ' + t('y') + '-coordinate with the other.'); }
      if (v.pts.length > 1) return wrong('u6l3-vertex', 'Tap just <b>one</b> point: the vertex of the right angle.');
      return r1;
    };
    p.good = [{ pts: [C2], pieces: [] }];
    p.bad = [{ pts: [A], pieces: [] }, { pts: [[C1[0] + 1, C1[1]]], pieces: [] }];
    return p;
  }

  /* ======================== Assignment ======================== */
  function rrPart(r, nm, A, B, text, prompt) {
    var dx = B[0] - A[0], dy = B[1] - A[1], N = dx * dx + dy * dy, L = Math.sqrt(N);
    var p = KP.fields(prompt || 'Determine the run, the rise, and the exact length of ' + t(nm) + '.', [numField('Run:', 'run'), numField('Rise:', 'rise'), numField(t(nm) + ' =', nm, 'units')],
      [K.number(dx, function (v) { if (v === dy) return { code: 'u6l3-run-rise', hint: 'The run is the <b>horizontal</b> change: subtract the ' + t('x') + '-coordinates.' }; if (v === B[0] + A[0]) return { code: 'u6l3-coord-sum', hint: 'Subtract the ' + t('x') + '-coordinates: ' + t(sub(B[0], A[0])) + '.' }; return null; }),
        K.number(dy, function (v) { if (v === dx) return { code: 'u6l3-run-rise', hint: 'The rise is the <b>vertical</b> change: subtract the ' + t('y') + '-coordinates.' }; if (v === B[1] + A[1]) return { code: 'u6l3-coord-sum', hint: 'Subtract the ' + t('y') + '-coordinates: ' + t(sub(B[1], A[1])) + '.' }; return null; }),
        K.number(L, function (v) { var h = distDiag(dx, dy)(v, 0.051); return h; })],
      [String(dx), String(dy), String(L)], 'run ' + t(dx) + ', rise ' + t(dy) + ', ' + t(nm + '=' + L),
      'Run ' + t('=' + sub(B[0], A[0]) + '=' + dx) + ', rise ' + t('=' + sub(B[1], A[1]) + '=' + dy) + '.<br>' + t(nm) + ' is the hypotenuse: ' + t(nm + '=\\sqrt{' + pr(dx) + '^{2}+' + pr(dy) + '^{2}}=\\sqrt{' + dx * dx + '+' + dy * dy + '}=\\sqrt{' + N + '}=' + L) + ' units.',
      ['The run is the change in ' + t('x') + ' and the rise is the change in ' + t('y') + ' (second point minus first).', 'The segment is the hypotenuse: ' + t('\\sqrt{\\text{run}^{2}+\\text{rise}^{2}}') + '.'], text);
    p.bad = [[String(dy), String(dx), String(L)], [String(dx), String(dy), String(Math.abs(dx) + Math.abs(dy))]].filter(function (b) { return b[0] !== String(dx) || b[2] !== String(L); });
    return p;
  }
  function upRight(r, list, box, fix) { // a segment going right and up, inside box = [xlo, xhi, ylo, yhi]
    if (fix) return fix;
    for (var i = 0; i < 200; i++) { var ab = r.pick(list), A = [r.int(box[0], box[1]), r.int(box[2], box[3])], B = [A[0] + ab[0], A[1] + ab[1]]; if (B[0] <= box[1] + ab[0] && B[0] <= 12 && B[1] <= 12) return [A, B]; }
    return [[2, -1], [5, 3]];
  }
  function exactSeg(r, prompt, nm, A, B, text) {
    var N = d2(A, B);
    return exactPart(prompt, N, signDiag(A, B), distSol(nm, A, B), HINT_D, text, 'units');
  }

  var Q = [
    { num: '1', section: 'Part A — Building the Right Triangle', stem: function (sh) { return t('AB') + ' with ' + t('A' + P2(sh.A)) + ' and ' + t('B' + P2(sh.B)) + '.'; },
      shared: function (r) { var s = upRight(r, [[3, 4], [4, 3]], [0, 4, -2, 4], r.chance(0.2) ? [[2, -1], [5, 3]] : null); return { A: s[0], B: s[1] }; }, parts: [
        { id: '1tri', sub: 'triangle', level: 'BEG', make: function (r, sh) { return vertexPart('Build a right triangle under ' + t('AB') + ': tap the vertex ' + t('C') + ' of its right angle.', sh.A, sh.B, ['A', 'B', 'C'], 'right-angle vertex AB'); } },
        { id: '1', sub: 'length', level: 'BEG', make: function (r, sh) { return rrPart(r, 'AB', sh.A, sh.B, 'run rise AB'); } }] },
    { num: '2', stem: 'Determine the run, the rise, and the exact length of each segment.', parts: [
      { id: '2', level: 'BEG', make: function (r) { var s = upRight(r, [[6, 8], [8, 6], [5, 12], [12, 5], [3, 4], [4, 3]], [0, 5, 0, 5], r.chance(0.2) ? [[2, 3], [10, 9]] : null); return rrPart(r, 'CD', s[0], s[1], 'run rise CD', t('CD') + ' with ' + t('C' + P2(s[0])) + ' and ' + t('D' + P2(s[1])) + '.'); } }] },
    { num: '3', stem: 'Determine the run, the rise, and the exact length of each segment.', parts: [
      { id: '3', level: 'BEG', make: function (r) { var s = upRight(r, [[3, 4], [4, 3], [6, 8], [8, 6]], [-6, -1, -3, 3], r.chance(0.2) ? [[-2, 1], [1, 5]] : null); return rrPart(r, 'EF', s[0], s[1], 'run rise EF', t('EF') + ' with ' + t('E' + P2(s[0])) + ' and ' + t('F' + P2(s[1])) + ' (watch the negative).'); } }] },
    { num: '4', section: 'Part B — The Distance Formula', stem: 'Use the distance formula to determine the exact length of each segment.', parts: [
      { id: '4', level: 'BEG', make: function (r) { var ab = r.chance(0.2) ? [8, 15] : r.pick(TRI), B = [ab[0], ab[1]]; if (r.chance(0.25)) B = [-B[0], B[1]]; return exactSeg(r, t('G(0,\\ 0)') + ' to ' + t('H' + P2(B)), 'GH', [0, 0], B, 'GH from origin'); } }] },
    { num: '5', stem: 'Use the distance formula to determine the exact length of each segment.', parts: [
      { id: '5', level: 'EMG', make: function (r) {
        var I, J;
        if (r.chance(0.2)) { I = [-4, -3]; J = [4, 3]; }
        else if (r.chance(0.5)) { var h = r.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [15, 8]]), s = sgn(r); J = [h[0], s * h[1]]; I = [-J[0], -J[1]]; }
        else { var s2 = seg(r, r.pick([[6, 8], [8, 6], [5, 12], [12, 5], [3, 4], [4, 3], [9, 12], [12, 9]]), [-9, 9], true); I = s2[0]; J = s2[1]; if (I[0] * J[0] > 0 && I[1] * J[1] > 0) { I = [-Math.abs(I[0]) || -1, I[1]]; J = [I[0] + Math.abs(s2[1][0] - s2[0][0]), J[1]]; } }
        return exactSeg(r, t('I' + P2(I)) + ' to ' + t('J' + P2(J)), 'IJ', I, J, 'IJ negatives');
      } }] },
    { num: '6', stem: 'Use the distance formula. Give your answer as a mixed radical in simplest form.', parts: [
      { id: '6', level: 'EMG', make: function (r) { var s = r.chance(0.2) ? [[1, 2], [4, 8]] : upRight(r, legPairs(1, 8, function (N, a, b) { return hasSqF(N) && a !== b; }), [0, 5, 0, 5]); return exactSeg(r, t('K' + P2(s[0])) + ' to ' + t('L' + P2(s[1])), 'KL', s[0], s[1], 'KL radical'); } }] },
    { num: '7', stem: 'Use the distance formula. Give your answer as a mixed radical in simplest form.', parts: [
      { id: '7', level: 'PRG', make: function (r) { var s = r.chance(0.2) ? [[-1, 3], [3, -1]] : seg(r, r.pick(legPairs(2, 8, function (N) { return hasSqF(N); })), [-8, 8], true); return exactSeg(r, t('M' + P2(s[0])) + ' to ' + t('N' + P2(s[1])), 'MN', s[0], s[1], 'MN radical'); } }] },
    { num: '8', stem: '', parts: [
      { id: '8', level: 'BEG', make: function (r) {
        var ab = r.chance(0.2) ? [5, 3] : r.pick(legPairs(1, 9, function (N) { return !isSq(N) && !halfway(Math.sqrt(N), 1); })), N = ab[0] * ab[0] + ab[1] * ab[1];
        return eitherPart('Use the distance formula to determine the length of the segment from ' + t('P(0,\\ 0)') + ' to ' + t('Q' + P2(ab)) + '. Give your answer as a decimal, rounded to the nearest tenth.', N, 1, distDiag(ab[0], ab[1]), distSol('PQ', [0, 0], ab, 1), HINT_D, 'PQ decimal', 'units');
      } }] },
    { num: '9', stem: '', parts: [
      { id: '9', level: 'BEG', make: function (r) {
        var ab = r.pick([[3, 4], [6, 8], [5, 12], [4, 3]]);
        return mcP(r, 'How do the run and the rise used in the distance formula relate to the right triangle formed under a diagonal segment? (Think of a segment with a run of ' + t(ab[0]) + ' and a rise of ' + t(ab[1]) + '.)', [
          { html: 'The run ' + t('x_2-x_1') + ' is the horizontal leg and the rise ' + t('y_2-y_1') + ' is the vertical leg; the segment is the hypotenuse, so ' + t('d=\\sqrt{\\text{run}^{2}+\\text{rise}^{2}}') + ' is just ' + t('c=\\sqrt{a^{2}+b^{2}}') + '.', right: true },
          { html: 'The run and the rise are the two endpoints of the hypotenuse.', why: 'The run and rise are <b>lengths</b> (differences of coordinates), not points. They are the legs.', code: 'pts' },
          { html: 'The run is the hypotenuse and the rise is a leg.', why: 'The run is horizontal and the rise is vertical — they meet at the right angle, so both are legs.', code: 'hyp' },
          { html: 'The segment’s length is the run plus the rise.', why: 'Adding the legs gives ' + t(ab[0] + ab[1]) + ', but the hypotenuse is ' + t(Math.hypot(ab[0], ab[1])) + ': square, add, then take the root.', code: 'add' }],
          'The horizontal leg is the run, ' + t('x_2-x_1') + ', and the vertical leg is the rise, ' + t('y_2-y_1') + '. The segment is the hypotenuse, so the distance formula is the Pythagorean theorem with the run and rise as ' + t('a') + ' and ' + t('b') + '. (Run ' + t(ab[0]) + ', rise ' + t(ab[1]) + ': ' + t('d=\\sqrt{' + ab[0] * ab[0] + '+' + ab[1] * ab[1] + '}=' + Math.hypot(ab[0], ab[1])) + '.)', ['Which sides of a right triangle meet at the right angle?'], 'run rise legs');
      } }] },
    { num: '10', section: 'Part C — Figures, Maps, and Applications', stem: function (sh) { return 'A triangle has vertices ' + t('X' + P2(sh.X)) + ', ' + t('Y' + P2(sh.Y)) + ' and ' + t('Z' + P2(sh.Z)) + '.'; },
      shared: function (r) {
        if (r.chance(0.2)) return { X: [1, 1], Y: [7, 1], Z: [4, 5] };
        var kh = r.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [4, 3], [3, 4]]), k = kh[0], h = kh[1] * (r.chance(0.3) ? -1 : 1), a = r.int(-6, 3), b = r.int(-5, 3);
        var X = [a, b], Y = [a + 2 * k, b], Z = [a + k, b + h];
        if (r.chance(0.3)) { X = [b, a]; Y = [b, a + 2 * k]; Z = [b + h, a + k]; }
        return { X: X, Y: Y, Z: Z };
      }, parts: [
        { id: '10a', level: 'EMG', make: function (r, sh) { return sidesPart('Determine the length of each side of the triangle.', [['XY', sh.X, sh.Y], ['XZ', sh.X, sh.Z], ['YZ', sh.Y, sh.Z]], 'triangle sides'); } },
        { id: '10b', level: 'EMG', make: function (r, sh) {
          var a = Math.sqrt(d2(sh.X, sh.Y)), b = Math.sqrt(d2(sh.X, sh.Z)), c = Math.sqrt(d2(sh.Y, sh.Z)), P = a + b + c;
          return numPart('Determine the perimeter of the triangle.', P, function (v) { if (near(v, d2(sh.X, sh.Y) + d2(sh.X, sh.Z) + d2(sh.Y, sh.Z))) return { code: 'u6l3-perim-sq', hint: 'Add the side <b>lengths</b>, not their squares.' }; if (near(v, a + b) || near(v, b + c) || near(v, a + c)) return { code: 'perim-side', hint: 'The perimeter includes all <b>three</b> sides.' }; return null; },
            t('P=' + a + '+' + b + '+' + c + '=' + P) + ' units.', ['Add the three side lengths from part (a).'], 'triangle perimeter', 'units', [a + b]);
        } }] },
    { num: '11', stem: '', parts: [
      { id: '11', level: 'EMG', make: function (r) {
        var ab = r.chance(0.2) ? [15, 8] : r.pick([[15, 8], [8, 15], [12, 5], [5, 12], [24, 7], [7, 24], [12, 9], [9, 12], [21, 20], [20, 21], [16, 12], [12, 16], [30, 16], [16, 30], [24, 10], [10, 24], [40, 9], [9, 40], [35, 12], [12, 35], [20, 15], [15, 20]]), N = ab[0] * ab[0] + ab[1] * ab[1];
        return exactPart('A rectangular field has corners at ' + t('(0,\\ 0)') + ' and ' + t(P2(ab)) + ', measured in metres. Determine the exact length of the diagonal path across the field, from one corner to the opposite corner.', N, distDiag(ab[0], ab[1]),
          'The opposite corners are ' + t('(0,\\ 0)') + ' and ' + t(P2(ab)) + ': ' + distSol('d', [0, 0], ab) + ' m.', ['The diagonal joins ' + t('(0,\\ 0)') + ' to the opposite corner. Use the distance formula.'], 'field diagonal', 'm');
      } }] },
    { num: '12', stem: 'Use the distance formula to determine the exact length of each segment.', parts: [
      { id: '12a', level: 'EMG', make: function (r) { var s = r.chance(0.2) ? [[-5, -1], [1, 7]] : seg(r, r.pick(TRI.slice(0, 8)), [-9, 9], true); return exactSeg(r, t('R' + P2(s[0])) + ' to ' + t('S' + P2(s[1])), 'RS', s[0], s[1], 'RS exact'); } },
      { id: '12b', level: 'PRG', make: function (r) {
        var s = r.chance(0.2) ? [[3, -4], [-3, 5]] : seg(r, r.pick(legPairs(2, 9, function (N) { return hasSqF(N) && !halfway(Math.sqrt(N), 1); })), [-9, 9], true), N = d2(s[0], s[1]);
        return lenFields(t('T' + P2(s[0])) + ' to ' + t('U' + P2(s[1])) + ': give the exact length and the length rounded to the nearest tenth.', N, signDiag(s[0], s[1]), distSol('TU', s[0], s[1], 1), HINT_D, 'TU exact and tenth', 'units', 'TU');
      } }] },
    { num: '13', stem: function (sh) { return 'A town places a coordinate grid over a city map. The ' + sh.a + ' is located at ' + t(P2(sh.A)) + ' and the ' + sh.b + ' is located at ' + t(P2(sh.B)) + ', where each grid unit represents ' + t(F(sh.s)) + '&nbsp;km.'; },
      shared: function (r) {
        if (r.chance(0.2)) return { A: [2, 3], B: [10, 9], s: 2, a: 'school', b: 'library' };
        var nm = r.pick([['school', 'library'], ['arena', 'hospital'], ['fire hall', 'park'], ['mall', 'airport'], ['train station', 'museum']]), sg = seg(r, r.pick(TRI.slice(0, 10)), [-6, 14], false);
        return { A: sg[0], B: sg[1], s: r.pick([2, 3, 4, 5, 0.5, 1.5, 2.5]), a: nm[0], b: nm[1] };
      }, parts: [
        { id: '13a', level: 'EMG', make: function (r, sh) { var L = Math.sqrt(d2(sh.A, sh.B)); return numPart('Determine the distance between the ' + sh.a + ' and the ' + sh.b + ', in grid units.', L, signDiag(sh.A, sh.B), distSol('d', sh.A, sh.B) + ' grid units.', HINT_D, 'map grid units', 'grid units', [L * sh.s]); } },
        { id: '13b', level: 'PRG', make: function (r, sh) {
          var L = Math.sqrt(d2(sh.A, sh.B)), km = L * sh.s;
          return numPart('Determine the actual distance between the ' + sh.a + ' and the ' + sh.b + ', in kilometres.', km, function (v) {
            if (near(v, L) && sh.s !== 1) return { code: 'scale', hint: 'That is the distance in grid units. Each grid unit is ' + t(F(sh.s)) + ' km: multiply.' };
            if (near(v, L / sh.s)) return { code: 'u6l3-scale-div', hint: 'Each grid unit stands for ' + t(F(sh.s)) + ' km, so <b>multiply</b> by ' + t(F(sh.s)) + '.' };
            if (near(v, L * sh.s * sh.s)) return { code: 'u6l3-scale-twice', hint: 'Multiply by the scale only once.' };
            return null;
          }, t('d=' + L) + ' grid units, so the actual distance is ' + t(L + '\\times ' + F(sh.s) + '=' + F(km)) + ' km.', ['Find the distance in grid units first (part a), then multiply by the scale.'], 'map km', 'km', [L]);
        } }] },
    { num: '14', stem: '', parts: [
      { id: '14', level: 'PRG', make: function (r) {
        var s = r.chance(0.2) ? [[-5, 3], [2, -5]] : (function () { for (var i = 0; i < 100; i++) { var q = seg(r, r.pick(legPairs(4, 10, function (N) { return !isSq(N) && !halfway(Math.sqrt(N), 1); })), [-9, 9], true); if (q[0][0] * q[1][0] < 0 || q[0][1] * q[1][1] < 0) return q; } return [[-5, 3], [2, -5]]; })(), N = d2(s[0], s[1]);
        return eitherPart('A delivery app places a coordinate grid over a city, with each grid unit representing ' + t('1') + '&nbsp;km. The warehouse is located at ' + t(P2(s[0])) + ' and a customer’s house is located at ' + t(P2(s[1])) + '. Determine the straight-line distance between the warehouse and the customer’s house, to the nearest tenth of a kilometre.', N, 1, signDiag(s[0], s[1]), distSol('d', s[0], s[1], 1) + ' km.', HINT_D, 'delivery', 'km');
      } }] },
    { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '15', level: 'LIM', make: function (r) {
        return mcP(r, 'Which of the following statements about the distance formula ' + t('d=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}') + ' is true?', [
          { html: 'It can only be used when the segment is horizontal.', why: 'It works for any segment — that is what it was built for (diagonal segments).', code: 'hor' },
          { html: 'It can only be used when the segment is vertical.', why: 'It works for any segment, diagonal ones included.', code: 'ver' },
          { html: 'It can be used for any segment, including diagonal ones, since a horizontal or vertical segment is just a special case where one of the differences is zero.', right: true },
          { html: 'It cannot be used when a coordinate is negative.', why: 'Negative coordinates are fine: the differences are squared, so their signs disappear.', code: 'neg' }],
          'The formula works for every segment. For a horizontal segment ' + t('y_2-y_1=0') + ' and it reduces to ' + t('|x_2-x_1|') + '; negative coordinates are fine because the differences are squared.', ['Try it on a horizontal segment: what happens to the second bracket?'], 'formula true', true);
      } }] }
  ];

  /* ======================== Extra Practice ======================== */
  function e1seg(r, test, fix) {
    if (fix && r.chance(0.2)) return fix;
    var ab = r.pick(legPairs(1, 9, function (N, a, b) { return test(N) && !halfway(Math.sqrt(N), 1); }));
    return seg(r, ab, [-8, 8], true);
  }
  function e1part(r, nm, s, text) { var N = d2(s[0], s[1]); return lenFields(t(nm[0] + P2(s[0])) + ' to ' + t(nm[1] + P2(s[1])), N, signDiag(s[0], s[1]), distSol(nm.join(''), s[0], s[1], 1), HINT_D, text); }
  /* Extra 3: two graphed segments */
  var W3 = { x: [-7, 7], y: [-7, 7] };
  function e3Shared(r) {
    if (r.chance(0.2)) return { PQ: [[-5, -4], [3, 2]], RS: [[-2, 5], [4, -1]] };
    var a = seg(r, r.pick(TRI.slice(0, 4).concat([[6, 8], [8, 6]])), [-6, 6], true), b = seg(r, r.pick([[6, 6], [4, 4], [5, 5], [3, 3], [2, 4], [4, 2], [3, 6], [6, 3], [2, 6], [6, 2]]), [-6, 6], true);
    return { PQ: a, RS: b };
  }
  /* Extra 4: four segments, two matching pairs */
  function e4Shared(r) {
    if (r.chance(0.2)) return { segs: [[[-4, 1], [2, 5]], [[-3, -5], [1, 1]], [[0, -4], [5, 2]], [[-6, 2], [-1, -4]]], pairs: [[0, 1], [2, 3]] };
    for (var i = 0; i < 200; i++) {
      var p1 = r.pick(legPairs(2, 7, function (N, a, b) { return !isSq(N) && a !== b; })), p2 = r.pick(legPairs(2, 7, function (N, a, b) { return !isSq(N) && a !== b; }));
      var N1 = p1[0] * p1[0] + p1[1] * p1[1], N2 = p2[0] * p2[0] + p2[1] * p2[1]; if (N1 === N2) continue;
      var segs = [seg(r, p1, [-7, 7], true), seg(r, [p1[1], p1[0]], [-7, 7], true), seg(r, p2, [-7, 7], true), seg(r, r.chance(0.5) ? [p2[1], p2[0]] : p2, [-7, 7], true)];
      var order = r.shuffle([0, 1, 2, 3]), out = order.map(function (k) { return segs[k]; });
      var pa = [order.indexOf(0), order.indexOf(1)].sort(), pb = [order.indexOf(2), order.indexOf(3)].sort();
      return { segs: out, pairs: pa[0] < pb[0] ? [pa, pb] : [pb, pa] };
    }
    return { segs: [[[-4, 1], [2, 5]], [[-3, -5], [1, 1]], [[0, -4], [5, 2]], [[-6, 2], [-1, -4]]], pairs: [[0, 1], [2, 3]] };
  }
  var ROM = ['I', 'II', 'III', 'IV'];
  /* Extra 5: three points and T; one shares a coordinate with T */
  function e5Shared(r) {
    if (r.chance(0.2)) return { T: [1, -1], P: [-4, 3], Q: [5, -2], R: [1, 6], hor: false };
    for (var i = 0; i < 300; i++) {
      var T = [r.int(-3, 3), r.int(-3, 3)], P = [T[0] + sgn(r) * r.int(2, 6), T[1] + sgn(r) * r.int(2, 6)], Q = [T[0] + sgn(r) * r.int(1, 6), T[1] + sgn(r) * r.int(1, 6)], hor = r.chance(0.4), k = sgn(r) * r.int(4, 8), R = hor ? [T[0] + k, T[1]] : [T[0], T[1] + k];
      var a = d2(T, P), b = d2(T, Q), c = d2(T, R); if (isSq(a) || isSq(b) || a === b || a === c || b === c) continue;
      if ([P, Q, R].some(function (p) { return Math.abs(p[0]) > 9 || Math.abs(p[1]) > 9; })) continue;
      return { T: T, P: P, Q: Q, R: R, hor: hor };
    }
    return { T: [1, -1], P: [-4, 3], Q: [5, -2], R: [1, 6], hor: false };
  }
  /* Extra 6–8: triangles */
  function rot90(v, s) { return s > 0 ? [-v[1], v[0]] : [v[1], -v[0]]; }
  function e6Shared(r) { var o = e6Shared0(r); if (o.fix) return o; var L = r.shuffle(['A', 'B', 'C']), ks = ['A', 'B', 'C'], out = {}; ks.forEach(function (k, i) { out[L[i]] = o[k]; }); return out; }
  function e6Shared0(r) { // isosceles right, right angle at B
    if (r.chance(0.2)) return { A: [-2, -1], B: [2, 1], C: [0, 5], fix: 1 };
    for (var i = 0; i < 200; i++) { var p = sgn(r) * r.int(1, 4), q = sgn(r) * r.int(1, 4); if (Math.abs(p) === Math.abs(q)) continue; var B = [r.int(-3, 3), r.int(-3, 3)], u = [p, q], A = [B[0] + u[0], B[1] + u[1]], v = rot90(u, sgn(r)), C = [B[0] + v[0], B[1] + v[1]]; if ([A, C].some(function (z) { return Math.abs(z[0]) > 7 || Math.abs(z[1]) > 7; })) continue; return { A: A, B: B, C: C }; }
    return { A: [-2, -1], B: [2, 1], C: [0, 5] };
  }
  function e7Shared(r) { var o = e7Shared0(r); if (o.fix) return o; var L = r.shuffle(['P', 'Q', 'R']), ks = ['P', 'Q', 'R'], out = {}; ks.forEach(function (k, i) { out[L[i]] = o[k]; }); return out; }
  function e7Shared0(r) { // scalene right, right angle at Q
    if (r.chance(0.2)) return { P: [-5, 1], Q: [-1, -2], R: [5, 6], fix: 1 };
    for (var i = 0; i < 300; i++) { var u = r.pick([[4, 3], [3, 4], [1, 2], [2, 1], [2, 3], [3, 2], [1, 3], [3, 1]]).map(function (c) { return sgn(r) * c; }), k = r.pick([2, 2, 3]), v = rot90(u, sgn(r)).map(function (c) { return k * c; }), Q = [r.int(-4, 4), r.int(-4, 4)], P = [Q[0] + u[0], Q[1] + u[1]], R = [Q[0] + v[0], Q[1] + v[1]];
      if ([P, R].some(function (z) { return Math.abs(z[0]) > 9 || Math.abs(z[1]) > 9; })) continue; if (r.chance(0.5)) return { P: P, Q: Q, R: R }; return { P: R, Q: Q, R: P }; }
    return { P: [-5, 1], Q: [-1, -2], R: [5, 6] };
  }
  function e8Shared(r) { var o = e8Shared0(r); if (o.fix) return o; var L = r.shuffle(['D', 'E', 'F']), ks = ['D', 'E', 'F'], out = {}; ks.forEach(function (k, i) { out[L[i]] = o[k]; }); return out; }
  function e8Shared0(r) { // isosceles, not right; DF horizontal and longest
    if (r.chance(0.2)) return { D: [-5, 2], E: [-1, -4], F: [3, 2], fix: 1 };
    for (var i = 0; i < 200; i++) { var a = r.int(2, 5), b = sgn(r) * r.int(1, 7); if (a === Math.abs(b) || b * b >= 3 * a * a) continue; var E = [r.int(-3, 3), r.int(-4, 4)], D = [E[0] - a, E[1] + b], F = [E[0] + a, E[1] + b]; if ([D, F].some(function (z) { return Math.abs(z[0]) > 8 || Math.abs(z[1]) > 8; })) continue; return { D: D, E: E, F: F }; }
    return { D: [-5, 2], E: [-1, -4], F: [3, 2] };
  }
  function triStem(names, V) { return 'A triangle has vertices ' + names.map(function (n, i) { return t(n + P2(V[i])); }).join(', ') + '.'; }
  function triParts(prefix, names, get, kind) { // kind: 'isoR' | 'scaR' | 'isoN'
    var sidesOf = function (sh) { var V = get(sh); return [[names[0] + names[1], V[0], V[1]], [names[1] + names[2], V[1], V[2]], [names[0] + names[2], V[0], V[2]]]; };
    var parts = [
      { id: prefix + 'a', level: 'EMG', make: function (r, sh) { return sidesPart('Determine the exact length of all three sides.', sidesOf(sh), 'triangle sides'); } },
      { id: prefix + 'b', level: 'BEG', make: function (r, sh) {
        var S = sidesOf(sh).map(function (s) { return d2(s[1], s[2]); }), iso = S[0] === S[1] || S[1] === S[2] || S[0] === S[2], eqp = sidesOf(sh).filter(function (s, i) { return S.filter(function (x) { return x === S[i]; }).length > 1; }).map(function (s) { return t(s[0]); });
        return mcP(r, 'Is the triangle scalene or isosceles?', [
          { html: '<b>Isosceles</b> — two sides are equal', right: iso, why: iso ? null : 'All three lengths are different: ' + sidesOf(sh).map(function (s, i) { return t(s[0] + '=' + rt(S[i])); }).join(', ') + '.', code: 'iso' },
          { html: '<b>Scalene</b> — all three sides are different', right: !iso, why: !iso ? null : eqp.join(' and ') + ' are equal.', code: 'sca' },
          { html: '<b>Equilateral</b> — all three sides are equal', why: 'Not all three lengths are the same: ' + sidesOf(sh).map(function (s, i) { return t(s[0] + '=' + rt(S[i])); }).join(', ') + '.', code: 'equi' }],
          sidesOf(sh).map(function (s, i) { return t(s[0] + '=' + rt(S[i])); }).join(', ') + '. ' + (iso ? 'Two sides are equal (' + eqp.join(' and ') + '), so it is <b>isosceles</b>.' : 'All three are different, so it is <b>scalene</b>.'), ['Compare your three lengths from part (a).'], 'iso or scalene', true);
      } },
      kind === 'isoN' ? { id: prefix + 'c', level: 'PRG', make: function (r, sh) {
        var Ss = sidesOf(sh).map(function (s) { return [d2(s[1], s[2]), s[0]]; }).sort(function (a, b) { return a[0] - b[0]; }), sum = Ss[0][0] + Ss[1][0], big = Ss[2][0];
        var p = KP.fields('Show, using the squared lengths, that this triangle is <b>not</b> right-angled.', [numField('Sum of the squares of the two shorter sides =', 'shorter squares'), numField('Square of the longest side =', 'longest square')],
          [K.number(sum, function (v) { if (v === Ss[0][0] + Ss[2][0] || v === Ss[1][0] + Ss[2][0]) return { code: 'u6l3-dist-sq', hint: 'Add the squares of the two <b>shorter</b> sides; the longest side is compared on its own.' }; return null; }), K.number(big)],
          [String(sum), String(big)], t(sum + '\\neq ' + big),
          'Squared lengths: ' + Ss.map(function (s) { return t(s[1] + '^{2}=' + s[0]); }).join(', ') + '. The two shorter sides give ' + t(Ss[0][0] + '+' + Ss[1][0] + '=' + sum) + ', but the longest side squared is ' + t(big) + '. Since ' + t(sum + '\\neq ' + big) + ', the converse fails: the triangle is not right-angled.',
          ['Square each side (that is just the number under the root before simplifying).', 'A right triangle needs (shorter)² + (shorter)² = (longest)².'], 'not right squares');
        p.bad = [[String(big), String(sum)]]; return p;
      } } : { id: prefix + 'c', level: 'PRG', make: function (r, sh) {
        var V = get(sh), Ss = [[d2(V[1], V[2]), names[0]], [d2(V[0], V[2]), names[1]], [d2(V[0], V[1]), names[2]]], srt = Ss.slice().sort(function (a, b) { return a[0] - b[0]; }), right = srt[0][0] + srt[1][0] === srt[2][0], at = srt[2][1];
        var opts = names.map(function (n) { return { html: '<b>Yes</b>, with the right angle at ' + t(n), right: right && n === at, why: right && n !== at ? 'The right angle is <b>opposite the longest side</b>. The longest side is the one across from ' + t(at) + '.' : (!right ? 'Check the squares: ' + t(srt[0][0] + '+' + srt[1][0] + '\\neq ' + srt[2][0]) + '.' : null), code: 'at' + n }; });
        opts.push({ html: '<b>No</b>, it is not right-angled', right: !right, why: right ? 'Check: ' + t(srt[0][0] + '+' + srt[1][0] + '=' + srt[2][0]) + ' — the converse holds.' : null, code: 'no' });
        return mcP(r, 'Use the converse of the Pythagorean theorem on the squared lengths. Is the triangle right-angled? If so, where is the right angle?', opts,
          'Squared lengths: ' + srt.map(function (s) { var o = names.filter(function (n) { return n !== s[1]; }).join(''); return t(o + '^{2}=' + s[0]); }).join(', ') + '. ' + t(srt[0][0] + '+' + srt[1][0] + (right ? '=' : '\\neq ') + srt[2][0]) + (right ? ', so it is right-angled, with the right angle at ' + t(at) + ' (opposite the longest side).' : ', so it is not right-angled.'),
          ['Add the two smaller squared lengths and compare with the largest.', 'The right angle is across from the longest side.'], 'right where', true);
      } },
      { id: prefix + 'd', level: 'PRG', make: function (r, sh) {
        var want = { isoR: 0, scaR: 1, isoN: 2 }[kind];
        var opts = ['an <b>isosceles right</b> triangle', 'a <b>scalene right</b> triangle', 'an <b>isosceles</b> triangle that is <b>not</b> right-angled', 'a <b>scalene</b> triangle that is <b>not</b> right-angled'].map(function (h, i) {
          return { html: h.charAt(0).toUpperCase() + h.slice(1), right: i === want, why: i === want ? null : (i % 2 !== want % 2 && want < 2 && i < 2 ? 'Check the side lengths again: are two of them equal?' : 'Put your answers to (b) and (c) together.'), code: 'name' + i };
        });
        return mcP(r, 'Name the triangle as completely as you can.', opts, 'From (b) it is ' + (kind === 'scaR' ? 'scalene' : 'isosceles') + ', and from (c) it is ' + (kind === 'isoN' ? '<b>not</b> right-angled' : 'right-angled') + ': ' + ['an isosceles right triangle', 'a scalene right triangle', 'an isosceles triangle that is not right-angled'][want] + '.',
          ['Combine the side type from (b) with the angle result from (c).'], 'name triangle', true);
      } }];
    return parts;
  }
  /* Extra 9: a triangle with only diagonal sides */
  function e9Shared(r) {
    if (r.chance(0.2)) return { A: [-4, -3], B: [2, -1], C: [-1, 5] };
    for (var i = 0; i < 2000; i++) {
      var A = [r.int(-6, 6), r.int(-6, 6)], B = [r.int(-6, 6), r.int(-6, 6)], C = [r.int(-6, 6), r.int(-6, 6)];
      var S = [d2(A, B), d2(B, C), d2(A, C)];
      if ([[A, B], [B, C], [A, C]].some(function (p) { return p[0][0] === p[1][0] || p[0][1] === p[1][1]; })) continue;
      if (S.some(isSq) || S.some(function (x) { return x > 130; })) continue;
      var ms = S.map(function (x) { return simp(x).m; }); if (ms[0] === ms[1] || ms[1] === ms[2] || ms[0] === ms[2]) continue;
      var area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])); if (area < 16) continue;
      var per = S.reduce(function (s, x) { return s + Math.sqrt(x); }, 0); if (halfway(per, 1)) continue;
      if (K.roundTo(S.reduce(function (s, x) { return s + K.roundTo(Math.sqrt(x), 1); }, 0), 1) === K.roundTo(per, 1) && r.chance(0.5)) continue;
      return { A: A, B: B, C: C };
    }
    return { A: [-4, -3], B: [2, -1], C: [-1, 5] };
  }
  /* Extra 10: rhombus; Extra 11: parallelogram that is not a rhombus */
  function quad(A, u, v) { var B = [A[0] + u[0], A[1] + u[1]], C = [B[0] + v[0], B[1] + v[1]], D = [A[0] + v[0], A[1] + v[1]]; return [A, B, C, D]; }
  function e10Shared(r) {
    if (r.chance(0.2)) return { V: [[-5, -4], [-1, -1], [2, 3], [-2, 0]] };
    for (var i = 0; i < 300; i++) {
      var base = r.pick([[4, 3], [1, 2], [1, 3], [2, 3], [3, 4], [2, 1], [3, 1], [3, 2]]), u = [base[0], base[1]], cands = [[u[1], u[0]], [u[0], -u[1]], [-u[0], u[1]], [-u[1], -u[0]]], v = r.pick(cands);
      if (u[0] * v[0] + u[1] * v[1] === 0 || u[0] * v[1] - u[1] * v[0] === 0) continue;
      if (r.chance(0.5)) u = [-u[0], -u[1]];
      var A = [r.int(-6, 2), r.int(-6, 2)], V = quad(A, u, v);
      if (V.some(function (z) { return Math.abs(z[0]) > 8 || Math.abs(z[1]) > 8; })) continue;
      return { V: V };
    }
    return { V: [[-5, -4], [-1, -1], [2, 3], [-2, 0]] };
  }
  function e11Shared(r) {
    if (r.chance(0.2)) return { V: [[-5, -2], [-1, 1], [4, 0], [0, -3]] };
    for (var i = 0; i < 300; i++) {
      var u = r.pick([[4, 3], [3, 4], [1, 2], [2, 1], [3, 1], [1, 3], [2, 3]]).map(function (c) { return sgn(r) * c; }), v = [sgn(r) * r.int(1, 6), sgn(r) * r.int(1, 5)];
      if (u[0] * u[0] + u[1] * u[1] === v[0] * v[0] + v[1] * v[1] || u[0] * v[1] - u[1] * v[0] === 0 || u[0] * v[0] + u[1] * v[1] === 0 || v[0] === 0 || v[1] === 0) continue;
      var A = [r.int(-6, 2), r.int(-6, 2)], V = quad(A, u, v);
      if (V.some(function (z) { return Math.abs(z[0]) > 8 || Math.abs(z[1]) > 8; })) continue;
      return { V: V };
    }
    return { V: [[-5, -2], [-1, 1], [4, 0], [0, -3]] };
  }
  function quadStem(V) { return 'A quadrilateral has vertices ' + ['A', 'B', 'C', 'D'].map(function (n, i) { return t(n + P2(V[i])); }).join(', ') + ', listed in order.'; }
  function quadSides(V) { return [['AB', V[0], V[1]], ['BC', V[1], V[2]], ['CD', V[2], V[3]], ['DA', V[3], V[0]]]; }
  /* Extra 12/13: the missing coordinate (two answers) */
  function kPart(r, unknownX, fix) {
    var c = fix || (function () { var T = r.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]); return { P: [r.int(-6, 6), r.int(-6, 6)], known: T[1] * sgn(r), leg: T[0], d: Math.hypot(T[0], T[1]) }; })();
    var P = c.P, i = unknownX ? 0 : 1, k1 = P[i] + c.leg, k2 = P[i] - c.leg, kn = P[1 - i] + c.known;
    var Qtx = unknownX ? '(k,\\ ' + F(kn) + ')' : '(' + F(kn) + ',\\ k)', kt = F(P[i]);
    var p = KP.valueSet('The distance from ' + t(P2(P)) + ' to ' + t(Qtx) + ' is ' + t(c.d) + '. Determine <b>both</b> possible values of ' + t('k') + '.', [k1, k2], { v: 'k', diag: function (A) {
      if (A.length === 1 && (near(A[0], k1) || near(A[0], k2))) return { code: 'u6l3-one-k', hint: 'There is a second value: a square equal to ' + t(c.leg * c.leg) + ' has two roots, ' + t('\\pm' + c.leg) + '.' };
      if (A.length === 2 && A.some(function (x) { return near(x, c.leg); }) && A.some(function (x) { return near(x, -c.leg); })) return { code: 'u6l3-k-shift', hint: t('k-' + pr(P[i]) + '=\\pm' + c.leg) + ' — now add ' + t(kt) + ' to both values.' };
      if (A.length === 2 && A.some(function (x) { return near(x, -P[i] + c.leg); }) && A.some(function (x) { return near(x, -P[i] - c.leg); })) return { code: 'u6l3-k-sign', hint: 'Check the sign when you undo the bracket: ' + t('k=' + kt + '\\pm' + c.leg) + '.' };
      return null;
    } }, t('(k-' + pr(P[i]) + ')^{2}+(' + sub(kn, P[1 - i]) + ')^{2}=' + c.d + '^{2}') + ', so ' + t('(k-' + pr(P[i]) + ')^{2}+' + c.known * c.known + '=' + c.d * c.d) + ' and ' + t('(k-' + pr(P[i]) + ')^{2}=' + c.leg * c.leg) + '.<br>' + t('k-' + pr(P[i]) + '=\\pm' + c.leg) + ', so ' + t('k=' + F(k1)) + ' or ' + t('k=' + F(k2)) + '. Check: both give run and rise ' + t(c.leg) + ' and ' + t(Math.abs(c.known)) + ', and ' + t('\\sqrt{' + c.leg * c.leg + '+' + c.known * c.known + '}=' + c.d) + '.',
      ['Substitute into ' + t('d^{2}=(x_2-x_1)^{2}+(y_2-y_1)^{2}') + ' and work out the bracket you know.', 'A square equal to a positive number has two square roots, ' + t('\\pm') + '.'], 'two k values');
    p.answer = t('k=' + F(k1)) + ' or ' + t('k=' + F(k2)); p.good = [F(k1) + ', ' + F(k2), 'k=' + k2 + ', k=' + k1].map(function (s) { return s.replace(/−/g, '-'); });
    p.bad = ['k=' + k1, 'k=' + c.leg + ', k=' + (-c.leg)].filter(function (b, j) { return j === 0 || Math.abs(c.leg) !== Math.abs(k1) || Math.abs(c.leg) !== Math.abs(k2); }); return p;
  }
  /* Extra 17: the perpendicular bisector */
  function e17Shared(r) {
    if (r.chance(0.2)) return { A: [-4, -1], B: [2, 3], P: [1, -2], Q: [3, -5], M: [-1, 1] };
    for (var i = 0; i < 300; i++) {
      var h = [sgn(r) * r.int(1, 4), sgn(r) * r.int(1, 4)], M = [r.int(-3, 3), r.int(-3, 3)], g = (function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; })(h[0], h[1]);
      var w = [-h[1] / g, h[0] / g], s1 = sgn(r) * r.int(1, 2), s2 = s1 + sgn(r) * r.int(1, 2); if (s2 === 0) continue;
      var A = [M[0] - h[0], M[1] - h[1]], B = [M[0] + h[0], M[1] + h[1]], P = [M[0] + s1 * w[0], M[1] + s1 * w[1]], Q = [M[0] + s2 * w[0], M[1] + s2 * w[1]];
      if ([A, B, P, Q].some(function (z) { return Math.abs(z[0]) > 9 || Math.abs(z[1]) > 9; })) continue;
      if (isSq(d2(P, A)) && isSq(d2(Q, A))) continue;
      return { A: A, B: B, P: P, Q: Q, M: M };
    }
    return { A: [-4, -1], B: [2, 3], P: [1, -2], Q: [3, -5], M: [-1, 1] };
  }
  /* Extra 18: the point on the x-axis that is equally far from A and B */
  function e18Shared(r) {
    if (r.chance(0.2)) return { A: [-4, 2], B: [2, 4], x0: 0 };
    var vecs = []; for (var a = -6; a <= 6; a++) for (var b = 1; b <= 6; b++) vecs.push([a, b]);
    for (var i = 0; i < 400; i++) {
      var u = r.pick(vecs), L = u[0] * u[0] + u[1] * u[1], same = vecs.filter(function (v) { return v[0] * v[0] + v[1] * v[1] === L && v[0] !== u[0]; });
      if (!same.length) continue;
      var v = r.pick(same), x0 = r.int(-3, 3), A = [x0 + u[0], u[1]], B = [x0 + v[0], v[1]];
      if (A[0] === B[0] || (A[1] === B[1] && A[0] === -B[0] + 2 * x0)) continue;
      if (Math.abs(A[0]) > 8 || Math.abs(B[0]) > 8) continue;
      if (r.chance(0.3)) { A = [A[0], -A[1]]; }
      if (r.chance(0.3)) { B = [B[0], -B[1]]; }
      return { A: A, B: B, x0: x0 };
    }
    return { A: [-4, 2], B: [2, 4], x0: 0 };
  }

  var X = [
    /* ---------- Part A ---------- */
    { num: '1', section: 'Part A — Exact Lengths in Simplest Radical Form', stem: 'Give each length <b>twice</b>: as an exact value (a mixed radical in simplest form, or a whole number) and as a decimal to the nearest <b>tenth</b>.', parts: [
      { id: 'e1a', level: 'EMG', make: function (r) { var s = e1seg(r, hasSqF, [[-3, -2], [1, 4]]); return e1part(r, ['A', 'B'], s, 'EP1a'); } },
      { id: 'e1b', level: 'BEG', make: function (r) { var s = e1seg(r, sqFree, [[-5, 3], [2, -1]]); return e1part(r, ['C', 'D'], s, 'EP1b'); } },
      { id: 'e1c', level: 'BEG', make: function (r) { var s = r.chance(0.2) ? [[-6, 3], [0, -5]] : seg(r, r.pick(TRI.slice(0, 8)), [-9, 9], true); return e1part(r, ['E', 'F'], s, 'EP1c'); } }] },
    { num: '2', stem: 'Determine the exact length of each segment, then a decimal to the nearest tenth.', parts: [
      { id: 'e2a', level: 'EMG', make: function (r) { var s = e1seg(r, hasSqF, [[-3, 5], [1, -3]]); return e1part(r, ['G', 'H'], s, 'EP2a'); } },
      { id: 'e2b', level: 'EMG', make: function (r) { var s = r.chance(0.2) ? [[-4, -6], [1, -1]] : seg(r, (function () { var k = r.int(2, 7); return [k, k]; })(), [-8, 8], true); return e1part(r, ['J', 'K'], s, 'EP2b'); } },
      { id: 'e2c', level: 'EMG', make: function (r) { var s = e1seg(r, function (N) { return hasSqF(N) && simp(N).k >= 3; }, [[-4, -3], [5, 3]]); return e1part(r, ['L', 'M'], s, 'EP2c'); } }] },
    { num: '3', stem: function (sh) { return 'Two segments are graphed below. Each grid square is ' + t('1') + ' unit.' + segFig(W3, [sh.PQ], [['P', 'Q']], 270) + segFig(W3, [sh.RS], [['R', 'S']], 270); }, shared: e3Shared, parts: [
      { id: 'e3a', sub: 'a endpoints', level: 'BEG', make: function (r, sh) {
        var p = KP.fields('Segment ' + t('PQ') + ': state the coordinates of its endpoints.', [ptField('P'), ptField('Q')], [ptChk(sh.PQ[0]), ptChk(sh.PQ[1])], [pt(sh.PQ[0]), pt(sh.PQ[1])], t('P' + P2(sh.PQ[0])) + ', ' + t('Q' + P2(sh.PQ[1])),
          'Across to the ' + t('x') + '-coordinate, then up or down to the ' + t('y') + '-coordinate: ' + t('P' + P2(sh.PQ[0])) + ' and ' + t('Q' + P2(sh.PQ[1])) + '.', ['Start at the origin: count across first, then up or down.'], 'PQ endpoints');
        p.bad = [['(' + sh.PQ[0][1] + ', ' + sh.PQ[0][0] + ')', '(' + sh.PQ[1][1] + ', ' + sh.PQ[1][0] + ')']]; return p;
      } },
      { id: 'e3b', sub: 'a triangle', level: 'BEG', make: function (r, sh) { return vertexPart('Sketch in the right triangle under ' + t('PQ') + ': tap the vertex of its right angle.', sh.PQ[0], sh.PQ[1], ['P', 'Q', 'C'], 'vertex PQ'); } },
      { id: 'e3c', sub: 'a length', level: 'EMG', make: function (r, sh) { return exactSeg(r, 'Determine the exact length of ' + t('PQ') + '.', 'PQ', sh.PQ[0], sh.PQ[1], 'PQ exact'); } },
      { id: 'e3d', sub: 'b', level: 'EMG', make: function (r, sh) {
        var R = sh.RS[0], S = sh.RS[1], N = d2(R, S);
        var p = KP.fields('Segment ' + t('RS') + ': state the coordinates of its endpoints and its exact length.', [ptField('R'), ptField('S'), radField(t('RS') + ' =', 'RS', 'units')], [ptChk(R), ptChk(S), exactChk(N, signDiag(R, S))], [pt(R), pt(S), rt(N)],
          t('R' + P2(R)) + ', ' + t('S' + P2(S)) + ', ' + t('RS=' + rt(N)), 'Reading the grid: ' + t('R' + P2(R)) + ' and ' + t('S' + P2(S)) + '.<br>' + distSol('RS', R, S), ['Read the endpoints first.', HINT_D[1]], 'RS endpoints and length');
        p.bad = [[pt(R), pt(S), String(N)]]; return p;
      } }] },
    { num: '4', stem: function (sh) { return 'Four segments are listed below. Two of them have the same length, and the other two also have the same length as each other.<br>' + sh.segs.map(function (s, i) { return ROM[i] + ': ' + t(P2(s[0])) + ' to ' + t(P2(s[1])); }).join('<br>'); }, shared: e4Shared, parts: [
      { id: 'e4a', level: 'EMG', make: function (r, sh) { return sidesPart('Find the exact length of each segment.', sh.segs.map(function (s, i) { return ['\\text{' + ROM[i] + '}', s[0], s[1]]; }), 'four lengths'); } },
      { id: 'e4b', level: 'PRG', make: function (r, sh) {
        var all = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]], key = JSON.stringify(sh.pairs), Ns = sh.segs.map(function (s) { return d2(s[0], s[1]); });
        var txt = function (pp) { return ROM[pp[0][0]] + ' with ' + ROM[pp[0][1]] + ', and ' + ROM[pp[1][0]] + ' with ' + ROM[pp[1][1]]; };
        return mcP(r, 'Which are the two matching pairs?', all.map(function (pp) { var right = JSON.stringify(pp) === key; return { html: txt(pp), right: right, why: right ? null : 'Compare the exact lengths: ' + Ns.map(function (N, i) { return ROM[i] + ' ' + t('=' + rt(N)); }).join(', ') + '.', code: 'pair' }; }),
          Ns.map(function (N, i) { return ROM[i] + ': ' + t(rt(N)); }).join(', ') + '. The matching pairs are ' + txt(sh.pairs) + '.', ['Use your exact lengths from part (a): equal radicals mean equal lengths.'], 'matching pairs', true);
      } }] },
    { num: '5', stem: function (sh) { return 'Three points are given: ' + t('P' + P2(sh.P)) + ', ' + t('Q' + P2(sh.Q)) + ' and ' + t('R' + P2(sh.R)) + '.'; }, shared: e5Shared, parts: [
      { id: 'e5a', level: 'EMG', make: function (r, sh) { return sidesPart('Determine the exact distance from each point to ' + t('T' + P2(sh.T)) + '.', [['TP', sh.T, sh.P], ['TQ', sh.T, sh.Q], ['TR', sh.T, sh.R]], 'distances to T'); } },
      { id: 'e5b', level: 'EMG', make: function (r, sh) {
        var D = { P: d2(sh.T, sh.P), Q: d2(sh.T, sh.Q), R: d2(sh.T, sh.R) }, best = Object.keys(D).sort(function (a, b) { return D[a] - D[b]; })[0];
        return mcP(r, 'Which point is <b>closest</b> to ' + t('T') + '?', ['P', 'Q', 'R'].map(function (n) { return { html: t(n) + ' &nbsp;(' + t('T' + n + '=' + rt(D[n])) + ')', right: n === best, why: n === best ? null : 'Compare the squared distances: ' + ['P', 'Q', 'R'].map(function (m) { return t('T' + m + '^{2}=' + D[m]); }).join(', ') + '. The smallest is the closest.', code: 'cl' + n }; }),
          'Compare the squared distances: ' + ['P', 'Q', 'R'].map(function (m) { return t('T' + m + '^{2}=' + D[m]); }).join(', ') + '. The smallest is ' + t('T' + best + '^{2}=' + D[best]) + ', so ' + t(best) + ' is closest.', ['A smaller number under the root means a shorter distance.'], 'closest', true);
      } },
      { id: 'e5c', level: 'PRG', make: function (r, sh) {
        var c = sh.hor ? 'y' : 'x', o = sh.hor ? 'x' : 'y', L = Math.sqrt(d2(sh.T, sh.R));
        return mcP(r, 'One of the three distances comes out to a whole number. Why?', [
          { html: t('T') + ' and ' + t('R') + ' share the ' + t(c) + '-coordinate ' + t(F(sh.T[sh.hor ? 1 : 0])) + ', so the segment is ' + (sh.hor ? 'horizontal' : 'vertical') + ' (one difference is ' + t('0') + '): the distance is just the difference in ' + t(o) + ', ' + t(L) + '.', right: true },
          { html: t('R') + ' is the closest point to ' + t('T') + '.', why: 'Being close has nothing to do with being a whole number. Look at the coordinates of ' + t('T') + ' and ' + t('R') + '.', code: 'close' },
          { html: 'The run and the rise from ' + t('T') + ' to ' + t('R') + ' are equal.', why: 'Equal run and rise give ' + t('k\\sqrt{2}') + ', not a whole number. Here one of them is ' + t('0') + '.', code: 'eq' },
          { html: 'All of ' + t('R') + '’s coordinates are positive.', why: 'Signs don’t matter after squaring. What matters is that ' + t('T') + ' and ' + t('R') + ' share a coordinate.', code: 'pos' }],
          t('T') + ' and ' + t('R') + ' have the same ' + t(c) + '-coordinate, so the run (or rise) is ' + t('0') + ' and ' + t('TR=\\sqrt{0^{2}+' + L + '^{2}}=' + L) + '.', ['Look at the coordinates of ' + t('T') + ' and ' + t('R') + '. What do they share?'], 'why whole');
      } }] },

    /* ---------- Part B ---------- */
    { num: '6', section: 'Part B — Classifying Triangles and Quadrilaterals', stem: function (sh) { return triStem(['A', 'B', 'C'], [sh.A, sh.B, sh.C]) + ' (To test for a right angle, use the <b>converse</b> of the Pythagorean theorem on the <b>squared</b> lengths; the right angle sits opposite the longest side.)'; }, shared: e6Shared,
      parts: triParts('e6', ['A', 'B', 'C'], function (sh) { return [sh.A, sh.B, sh.C]; }, 'isoR') },
    { num: '7', stem: function (sh) { return triStem(['P', 'Q', 'R'], [sh.P, sh.Q, sh.R]); }, shared: e7Shared, parts: triParts('e7', ['P', 'Q', 'R'], function (sh) { return [sh.P, sh.Q, sh.R]; }, 'scaR') },
    { num: '8', stem: function (sh) { return triStem(['D', 'E', 'F'], [sh.D, sh.E, sh.F]); }, shared: e8Shared, parts: triParts('e8', ['D', 'E', 'F'], function (sh) { return [sh.D, sh.E, sh.F]; }, 'isoN') },
    { num: '9', stem: function (sh) { return triStem(['A', 'B', 'C'], [sh.A, sh.B, sh.C]) + ' Every side is diagonal.'; }, shared: e9Shared, parts: [
      { id: 'e9a', level: 'EMG', make: function (r, sh) { return sidesPart('Determine the exact length of each side, as a mixed radical in simplest form.', [['AB', sh.A, sh.B], ['BC', sh.B, sh.C], ['AC', sh.A, sh.C]], 'diag triangle sides'); } },
      { id: 'e9b', level: 'PRG', make: function (r, sh) {
        var S = [d2(sh.A, sh.B), d2(sh.B, sh.C), d2(sh.A, sh.C)], P = S.reduce(function (s, x) { return s + Math.sqrt(x); }, 0), tex = S.map(rt).join('+');
        var p = KP.math('Write the exact perimeter as a sum of radicals.', sumChk(P, function (v) { if (near(v, S[0] + S[1] + S[2])) return { code: 'u6l3-perim-sq', hint: 'Add the side lengths (the radicals), not their squares.' }; if (near(v, Math.sqrt(S[0] + S[1] + S[2]))) return { code: 'u6l3-perim-sq', hint: 'You can’t add the numbers under the roots: ' + t('\\sqrt{a}+\\sqrt{b}\\neq\\sqrt{a+b}') + '. Leave the perimeter as a sum.' }; return null; }), tex,
          t('P=' + tex) + ' units. (The radicands are all different, so nothing combines.)', ['Add your three exact lengths from part (a). Unlike radicals can’t be combined.'], 'exact perimeter', { keys: RADK, after: 'units', placeholder: 'e.g. 2sqrt(3) + sqrt(7) + 5sqrt(2)' });
        p.good = [S.map(rtPlain).join(' + '), S.map(rt).reverse().join('+')]; p.bad = [String(S[0] + S[1] + S[2]), dec(P, 1)]; return p;
      } },
      { id: 'e9c', level: 'PRG', make: function (r, sh) {
        var S = [d2(sh.A, sh.B), d2(sh.B, sh.C), d2(sh.A, sh.C)], P = S.reduce(function (s, x) { return s + Math.sqrt(x); }, 0), Pr = S.reduce(function (s, x) { return s + K.roundTo(Math.sqrt(x), 1); }, 0);
        var p = KP.approx('Determine the perimeter to the nearest tenth.', P, 1, { after: 'units', diag: function (v) { if (near(v, Pr, 0.001) && !near(K.roundTo(Pr, 1), K.roundTo(P, 1))) return { code: 'round-first', hint: 'Rounding each side first makes the total slightly off. Add the unrounded lengths, then round once at the end.' }; if (near(v, Math.sqrt(S[0] + S[1] + S[2]), 0.06)) return { code: 'u6l3-perim-sq', hint: t('\\sqrt{a}+\\sqrt{b}+\\sqrt{c}') + ' is not ' + t('\\sqrt{a+b+c}') + '. Find each length, then add.' }; return null; } },
          t('P=' + S.map(rt).join('+') + '\\approx ' + S.map(function (x) { return dec(Math.sqrt(x), 3); }).join('+') + '\\approx ' + dec(P, 3) + '\\approx ' + dec(P, 1)) + ' units.', ['Add the three lengths, keeping several decimal places, then round to one place at the end.'], 'perimeter tenth');
        p.bad = [dec(P + 0.1, 1)]; return p;
      } }] },
    { num: '10', stem: function (sh) { return quadStem(sh.V); }, shared: e10Shared, parts: [
      { id: 'e10a', level: 'EMG', make: function (r, sh) { return sidesPart('Determine the length of all four sides.', quadSides(sh.V), 'rhombus sides'); } },
      { id: 'e10b', level: 'EMG', make: function (r, sh) {
        var s = rt(d2(sh.V[0], sh.V[1]));
        return mcP(r, 'Why must ' + t('ABCD') + ' be a <b>rhombus</b>?', [
          { html: 'All four sides are equal (each ' + t(s) + '), which is the definition of a rhombus.', right: true },
          { html: 'Its opposite sides are parallel.', why: 'That only makes it a parallelogram. A rhombus needs all four sides equal.', code: 'par' },
          { html: 'It has four right angles.', why: 'Four right angles would make a rectangle. The side lengths decide that it is a rhombus.', code: 'right' },
          { html: 'Its diagonals are equal.', why: 'Its diagonals are not equal (see part c). A rhombus is about all four <b>sides</b> being equal.', code: 'diag' }],
          t('AB=BC=CD=DA=' + s) + ': all four sides are equal, so ' + t('ABCD') + ' is a rhombus.', ['Look at your four lengths from part (a).'], 'why rhombus');
      } },
      { id: 'e10c', level: 'EMG', make: function (r, sh) { return sidesPart('Determine the exact lengths of the two diagonals ' + t('AC') + ' and ' + t('BD') + '.', [['AC', sh.V[0], sh.V[2]], ['BD', sh.V[1], sh.V[3]]], 'rhombus diagonals'); } },
      { id: 'e10d', level: 'PRG', make: function (r, sh) {
        var a = rt(d2(sh.V[0], sh.V[2])), b = rt(d2(sh.V[1], sh.V[3]));
        return mcP(r, 'The diagonals are not equal. Why does that mean ' + t('ABCD') + ' is <b>not</b> a square?', [
          { html: 'A square is a rhombus whose diagonals are equal (it has right angles). Here ' + t('AC=' + a) + ' and ' + t('BD=' + b) + ' are different, so the rhombus is “squashed”, not a square.', right: true },
          { html: 'A square has unequal diagonals, so ' + t('ABCD') + ' could be a square.', why: 'A square’s two diagonals are always equal.', code: 'sq' },
          { html: 'A square must have sides that are whole numbers.', why: 'A square can have any side length, e.g. ' + t('\\sqrt{2}') + '. Compare the diagonals.', code: 'whole' },
          { html: 'Because a rhombus can never be a square.', why: 'A square <b>is</b> a special rhombus — the one with equal diagonals.', code: 'never' }],
          t('AC=' + a) + ' but ' + t('BD=' + b) + '. A square’s diagonals are equal, so this rhombus is not a square.', ['What do you know about the two diagonals of a square?'], 'not a square');
      } }] },
    { num: '11', stem: function (sh) { return quadStem(sh.V); }, shared: e11Shared, parts: [
      { id: 'e11a', level: 'EMG', make: function (r, sh) { return sidesPart('Determine the length of all four sides.', quadSides(sh.V), 'parallelogram sides'); } },
      { id: 'e11b', level: 'PRG', make: function (r, sh) {
        var a = rt(d2(sh.V[0], sh.V[1])), b = rt(d2(sh.V[1], sh.V[2]));
        return mcP(r, 'Why is this figure a <b>parallelogram</b> but <b>not</b> a rhombus?', [
          { html: 'Both pairs of <b>opposite</b> sides are equal (' + t('AB=CD=' + a) + ' and ' + t('BC=DA=' + b) + '), so it is a parallelogram; but ' + t(a + '\\neq ' + b) + ', so the four sides are not all equal.', right: true },
          { html: 'All four sides are equal, so it is a parallelogram.', why: 'Compare ' + t('AB=' + a) + ' and ' + t('BC=' + b) + ': they are not equal.', code: 'all' },
          { html: '<b>Adjacent</b> sides are equal (' + t('AB=BC') + ').', why: t('AB=' + a) + ' and ' + t('BC=' + b) + ' are different. It is the <b>opposite</b> sides that match.', code: 'adj' },
          { html: 'It has a right angle, so it can’t be a rhombus.', why: 'Right angles don’t decide whether a shape is a rhombus. The four side lengths do.', code: 'right' }],
          t('AB=' + a) + ', ' + t('BC=' + b) + ', ' + t('CD=' + a) + ', ' + t('DA=' + b) + '. Opposite sides are equal → parallelogram. Adjacent sides differ → not a rhombus.', ['Compare opposite sides, then adjacent sides.'], 'parallelogram not rhombus');
      } }] },

    /* ---------- Part C ---------- */
    { num: '12', section: 'Part C — Working Backwards, Errors, and Reasoning', stem: 'The distance is known but one coordinate is missing. Substitute into the distance formula, square both sides to clear the radical, and solve. There are <b>two</b> answers.', parts: [
      { id: 'e12', level: 'ADV', make: function (r) { return kPart(r, true, r.chance(0.2) ? { P: [1, 2], known: 4, leg: 3, d: 5 } : null); } }] },
    { num: '13', stem: 'The distance is known but one coordinate is missing. There are <b>two</b> answers.', parts: [
      { id: 'e13', level: 'ADV', make: function (r) { return kPart(r, false, r.chance(0.2) ? { P: [-2, 3], known: 6, leg: 8, d: 10 } : null); } }] },
    { num: '14', stem: function (sh) { var A = sh.A, B = sh.B; return '<b>Error analysis.</b> Asked for the distance from ' + t('A' + P2(A)) + ' to ' + t('B' + P2(B)) + ', Dmitri wrote ' + t('d=(' + sub(B[0], A[0]) + ')+(' + sub(B[1], A[1]) + ')=' + (B[0] - A[0]) + '+' + (B[1] - A[1]) + '=' + (B[0] - A[0] + B[1] - A[1])) + '.'; },
      shared: function (r) { if (r.chance(0.2)) return { A: [-2, -3], B: [4, 5] }; for (var i = 0; i < 100; i++) { var ab = r.pick([[6, 8], [8, 6], [3, 4], [4, 3], [5, 12], [12, 5], [9, 12], [12, 9]]), A = [r.int(-8, 0), r.int(-8, 0)], B = [A[0] + ab[0], A[1] + ab[1]]; if (B[0] <= 9 && B[1] <= 9 && (A[0] < 0 || A[1] < 0)) return { A: A, B: B }; } return { A: [-2, -3], B: [4, 5] }; }, parts: [
        { id: 'e14a', level: 'PRG', make: function (r, sh) {
          var dx = sh.B[0] - sh.A[0], dy = sh.B[1] - sh.A[1];
          return mcP(r, 'What did Dmitri do instead of using the distance formula?', [
            { html: 'He added the run and the rise instead of squaring them, adding, and taking the square root. His ' + t(dx + dy) + ' is the “staircase” path: ' + t(dx) + ' across, then ' + t(dy) + ' up.', right: true },
            { html: 'He subtracted the coordinates in the wrong order.', why: 'His differences ' + t(dx) + ' and ' + t(dy) + ' are fine. The problem is what he did with them next.', code: 'order' },
            { html: 'He forgot to take the square root at the end.', why: 'He never squared anything, so there was no root to take. He simply added the run and the rise.', code: 'root' },
            { html: 'Nothing — the distance is the run plus the rise.', why: 'The straight segment is the hypotenuse of the right triangle, which is shorter than the two legs together.', code: 'none' }],
            'Dmitri added the legs of the right triangle. ' + t(dx + dy) + ' is the length of the path that goes ' + t(dx) + ' across and then ' + t(dy) + ' up — not the straight-line distance.', ['Compare what he wrote with ' + t('d=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}') + '.'], 'Dmitri error');
        } },
        { id: 'e14b', level: 'EMG', make: function (r, sh) { var L = Math.sqrt(d2(sh.A, sh.B)); return numPart('Find the correct distance.', L, signDiag(sh.A, sh.B), distSol('d', sh.A, sh.B), HINT_D, 'Dmitri correct', 'units', [Math.abs(sh.B[0] - sh.A[0]) + Math.abs(sh.B[1] - sh.A[1])]); } }] },
    { num: '15', stem: function (sh) { var P = sh.P, Q = sh.Q, dx = Q[0] - P[0], dy = Q[1] - P[1]; return '<b>Error analysis.</b> Asked for the distance from ' + t('P' + P2(P)) + ' to ' + t('Q' + P2(Q)) + ', Lucia wrote ' + t('d=(' + sub(Q[0], P[0]) + ')^{2}+(' + sub(Q[1], P[1]) + ')^{2}=' + dx * dx + '+' + dy * dy + '=' + (dx * dx + dy * dy)) + '.'; },
      shared: function (r) { if (r.chance(0.2)) return { P: [-6, 2], Q: [-1, -4] }; var s = seg(r, r.pick(legPairs(2, 8, function (N) { return sqFree(N) && !halfway(Math.sqrt(N), 1); })), [-8, 8], true); return { P: s[0], Q: s[1] }; }, parts: [
        { id: 'e15a', level: 'BEG', make: function (r, sh) {
          var N = d2(sh.P, sh.Q);
          return mcP(r, 'Which step did Lucia leave out?', [
            { html: 'She never took the square root: ' + t(N) + ' is ' + t('d^{2}') + ', not ' + t('d') + '.', right: true },
            { html: 'She forgot to square the differences.', why: 'She did square them (' + t(N) + ' is the sum of the squares). Something is missing at the end.', code: 'sq' },
            { html: 'She should have subtracted the squares instead of adding them.', why: 'Adding the squares is right. The last step is missing.', code: 'sub' },
            { html: 'She subtracted the coordinates in the wrong order.', why: 'The order doesn’t matter: the differences are squared.', code: 'order' }],
            t(N) + ' is the square of the distance. The distance is ' + t('d=\\sqrt{' + N + '}') + '.', ['Look at the distance formula: what is the very last operation?'], 'Lucia error');
        } },
        { id: 'e15b', level: 'EMG', make: function (r, sh) { var N = d2(sh.P, sh.Q); return lenFields('State the correct exact distance and the distance to the nearest tenth.', N, signDiag(sh.P, sh.Q), distSol('d', sh.P, sh.Q, 1), ['Take the square root of Lucia’s answer.'], 'Lucia correct', 'units', 'd'); } }] },
    { num: '16', stem: function (sh) { return '<b>Reasoning.</b> Does it matter which point you call ' + t('(x_1,\\ y_1)') + ' and which you call ' + t('(x_2,\\ y_2)') + '? Compute the distance from ' + t('A' + P2(sh.A)) + ' to ' + t('B' + P2(sh.B)) + ' both ways.'; },
      shared: function (r) { if (r.chance(0.2)) return { A: [-4, 5], B: [2, -3] }; var s = seg(r, r.pick([[6, 8], [8, 6], [3, 4], [4, 3], [5, 12], [12, 5]]), [-9, 9], true); if ((s[1][0] - s[0][0]) * (s[1][1] - s[0][1]) > 0) s = [[s[0][0], s[1][1]], [s[1][0], s[0][1]]]; return { A: s[0], B: s[1] }; }, parts: [
        { id: 'e16a', level: 'EMG', make: function (r, sh) {
          var A = sh.A, B = sh.B, dx = B[0] - A[0], dy = B[1] - A[1], L = Math.sqrt(dx * dx + dy * dy);
          var od = function (want, txt) { return K.number(want, function (v) { if (v === -want) return { code: 'diff-order', hint: 'Order matters for the signs here: ' + txt + '.' }; return null; }); };
          var p = KP.fields('Find the run and the rise with ' + t('A') + ' first and with ' + t('B') + ' first (second point minus first point), then the distance.',
            [numField(t('A') + ' first, run ' + t('=x_B-x_A='), 'run (A first)'), numField(t('A') + ' first, rise ' + t('=y_B-y_A='), 'rise (A first)'), numField(t('B') + ' first, run ' + t('=x_A-x_B='), 'run (B first)'), numField(t('B') + ' first, rise ' + t('=y_A-y_B='), 'rise (B first)'), numField(t('d='), 'd', 'units')],
            [od(dx, t('x_B-x_A')), od(dy, t('y_B-y_A')), od(-dx, t('x_A-x_B')), od(-dy, t('y_A-y_B')), K.number(L, function (v) { return distDiag(dx, dy)(v, 0.051); })],
            [String(dx), String(dy), String(-dx), String(-dy), String(L)], 'A first: run ' + t(dx) + ', rise ' + t(dy) + '; B first: run ' + t(-dx) + ', rise ' + t(-dy) + '; ' + t('d=' + L) + ' both ways',
            t('A') + ' first: run ' + t('=' + sub(B[0], A[0]) + '=' + dx) + ', rise ' + t('=' + sub(B[1], A[1]) + '=' + dy) + ', ' + t('d=\\sqrt{' + dx * dx + '+' + dy * dy + '}=' + L) + '.<br>' + t('B') + ' first: run ' + t('=' + sub(A[0], B[0]) + '=' + (-dx)) + ', rise ' + t('=' + sub(A[1], B[1]) + '=' + (-dy)) + ', ' + t('d=\\sqrt{' + dx * dx + '+' + dy * dy + '}=' + L) + '.',
            ['Subtract in the order shown. Subtracting a negative adds.', 'Square each difference: the signs disappear.'], 'both orders');
          p.bad = [[String(-dx), String(-dy), String(dx), String(dy), String(L)]]; return p;
        } },
        { id: 'e16b', level: 'PRG', make: function (r, sh) {
          return mcP(r, 'Why must the two calculations always agree?', [
            { html: 'Reversing the order only flips the sign of each difference, and a number and its opposite have the same square.', right: true },
            { html: 'They don’t always agree; it only worked for these points.', why: 'Try another pair of points: reversing always flips both signs, and squaring removes them.', code: 'no' },
            { html: 'Because the run and the rise are always positive.', why: 'They can be negative (you found some). It is the squaring that makes the order not matter.', code: 'pos' },
            { html: 'Because you add the run and the rise.', why: 'The run and the rise are squared, then added — and the squaring is what removes the signs.', code: 'add' }],
            'Swapping the points changes each difference to its opposite, e.g. ' + t('-6') + ' instead of ' + t('6') + '. Since ' + t('(-6)^{2}=6^{2}=36') + ', the squares — and the distance — are the same.', ['What happens to the signs when you square?'], 'why order irrelevant');
        } }] },
    { num: '17', stem: function (sh) { return '<b>Stretch — the perpendicular bisector.</b> The <b>perpendicular bisector</b> of a segment ' + t('AB') + ' is the line of <b>all</b> points that are the same distance from ' + t('A') + ' as from ' + t('B') + '. Let ' + t('A' + P2(sh.A)) + ' and ' + t('B' + P2(sh.B)) + '.'; }, shared: e17Shared, parts: [
      { id: 'e17a', level: 'PRG', make: function (r, sh) { return sidesPart('Show that ' + t('P' + P2(sh.P)) + ' is the same distance from ' + t('A') + ' as from ' + t('B') + ', by computing both exact distances.', [['PA', sh.P, sh.A], ['PB', sh.P, sh.B]], 'PA PB'); } },
      { id: 'e17b', level: 'PRG', make: function (r, sh) { return sidesPart('Show that ' + t('Q' + P2(sh.Q)) + ' is also the same distance from ' + t('A') + ' as from ' + t('B') + '.', [['QA', sh.Q, sh.A], ['QB', sh.Q, sh.B]], 'QA QB'); } },
      { id: 'e17c', level: 'PRG', make: function (r, sh) {
        return mcP(r, 'The midpoint of ' + t('AB') + ' is ' + t(P2(sh.M)) + '. Why must ' + t(P2(sh.M)) + ', ' + t('P') + ' and ' + t('Q') + ' all lie on one straight line, and which line is it?', [
          { html: 'All three are the same distance from ' + t('A') + ' as from ' + t('B') + ', and the set of all such points is one straight line: the perpendicular bisector of ' + t('AB') + '.', right: true },
          { html: 'They all have whole-number coordinates, so they line up on the line through ' + t('A') + ' and ' + t('B') + '.', why: 'Whole-number coordinates don’t make points line up. And ' + t('P') + ' and ' + t('Q') + ' are not on line ' + t('AB') + '.', code: 'ab' },
          { html: 'They are all the same distance from the origin.', why: 'Check: their distances from ' + t('(0,\\ 0)') + ' are different. What they share is being equally far from ' + t('A') + ' and ' + t('B') + '.', code: 'origin' },
          { html: 'They don’t have to be on one line; it is a coincidence.', why: 'Every point equally far from ' + t('A') + ' and ' + t('B') + ' lies on the perpendicular bisector — no coincidence.', code: 'coin' }],
          'The midpoint is equally far from ' + t('A') + ' and ' + t('B') + ' (half of ' + t('AB') + ' each way), and so are ' + t('P') + ' and ' + t('Q') + ' (parts a and b). The points equidistant from ' + t('A') + ' and ' + t('B') + ' form one line — the perpendicular bisector of ' + t('AB') + ' — so all three lie on it.', ['Reread the definition at the top of the question.'], 'perp bisector');
      } }] },
    { num: '18', stem: function (sh) { return '<b>Stretch.</b> A point on the ' + t('x') + '-axis has the form ' + t('(x,\\ 0)') + '. Find the point on the ' + t('x') + '-axis that is the same distance from ' + t('A' + P2(sh.A)) + ' as it is from ' + t('B' + P2(sh.B)) + '. <i>Hint:</i> write both squared distances in terms of ' + t('x') + ', set them equal, and solve; the ' + t('x^{2}') + ' terms cancel.'; }, shared: e18Shared, parts: [
      { id: 'e18a', level: 'MAS', make: function (r, sh) {
        var A = sh.A, B = sh.B, x0 = sh.x0, T = [x0, 0], c1 = A[0] * A[0] + A[1] * A[1], c2 = B[0] * B[0] + B[1] * B[1];
        var mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
        var p = KP.math('The point is:', ptChk(T, { diag: function (q) {
          if (!near(q[1], 0)) { if (near(q[0], mid[0]) && near(q[1], mid[1])) return { code: 'u6l3-mid', hint: 'The midpoint of ' + t('AB') + ' is equally far from ' + t('A') + ' and ' + t('B') + ', but it isn’t on the ' + t('x') + '-axis. The point you want has ' + t('y=0') + '.' }; return { code: 'u6l3-xaxis-y', hint: 'A point on the ' + t('x') + '-axis has ' + t('y=0') + ': ' + t('(x,\\ 0)') + '.' }; }
          if (near(q[0], mid[0])) return { code: 'u6l3-mid', hint: 'Halfway across isn’t enough: the two points are at different heights. Set ' + t('(x-' + pr(A[0]) + ')^{2}+' + pr(A[1]) + '^{2}') + ' equal to ' + t('(x-' + pr(B[0]) + ')^{2}+' + pr(B[1]) + '^{2}') + '.' };
          if (near(q[0], -x0) && x0 !== 0) return { code: 'pt-x', hint: 'Check the sign when you solve for ' + t('x') + '.' };
          return null; } }), '(' + x0 + ',\\ 0)',
          t('(x-' + pr(A[0]) + ')^{2}+(0-' + pr(A[1]) + ')^{2}=(x-' + pr(B[0]) + ')^{2}+(0-' + pr(B[1]) + ')^{2}') + '<br>' + t('x^{2}' + (A[0] ? (-2 * A[0] > 0 ? '+' : '') + (-2 * A[0]) + 'x' : '') + '+' + c1 + '=x^{2}' + (B[0] ? (-2 * B[0] > 0 ? '+' : '') + (-2 * B[0]) + 'x' : '') + '+' + c2) + '<br>' + t((2 * (B[0] - A[0])) + 'x=' + (c2 - c1)) + ', so ' + t('x=' + x0) + '. The point is ' + t(P2(T)) + '.',
          ['Write the squared distance from ' + t('(x,\\ 0)') + ' to ' + t('A') + ' and to ' + t('B') + '.', 'Expand both sides; the ' + t('x^{2}') + ' terms cancel, leaving a simple equation for ' + t('x') + '.'], 'x-axis equidistant', { keys: PTK, placeholder: 'e.g. (3, 0)' });
        p.answer = t(P2(T)); p.good = ['(' + x0 + ', 0)']; p.bad = ['(0, ' + x0 + ')', '(' + mid[0] + ', ' + mid[1] + ')'].filter(function (b) { return b !== '(' + x0 + ', 0)'; }); return p;
      } },
      { id: 'e18b', level: 'ADV', make: function (r, sh) {
        var T = [sh.x0, 0], N = d2(T, sh.A);
        return exactPart('State the common distance from that point to ' + t('A') + ' and to ' + t('B') + ', as an exact value.', N, signDiag(T, sh.A), distSol('d', T, sh.A) + ' (and the same to ' + t('B') + ': ' + t('\\sqrt{' + d2(T, sh.B) + '}') + ').', ['Use the point from (a) and either ' + t('A') + ' or ' + t('B') + '.'], 'common distance', 'units');
      } }] }
  ];

  HW.defineLesson({
    id: 'u6l3', unit: 6, num: '3', title: 'Measuring the Length of a Line Segment: Diagonal Segments and the Distance Formula', outcome: 'RF3',
    blurb: 'Turning any diagonal segment into a right triangle, then Pythagoras becomes the distance formula.',
    questions: Q, extra: X
  });
})(window);
