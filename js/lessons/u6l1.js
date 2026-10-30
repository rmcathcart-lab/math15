/* Math 15 · Unit 6 · Lesson 1 — Review: The Pythagorean Theorem (RF3 on every part)
 * Assignment 1 (u6_L01.tex, Questions 1–15) and the Lesson 1 Extra Practice (u6_EP01.tex, Questions 1–19).
 * Every part is a generator: same structure, idea and difficulty as the booklet question (the booklet's own triangle is
 * one of the possible versions); the side lengths come from Pythagorean triples (and their multiples) when the booklet's
 * answer is a whole number, and from leg pairs with a non-square sum when it is a radical.
 * Model: Math 10C u6l1.js (radical keypad, exact/decimal length checkers and their diagnoses) and u9l1.js (side naming).
 * Conversions: "identify the legs" -> tap the side lengths; "explain / state which and why" -> multiple choice whose
 * options are reasons; "show both sides of the equation" -> one box for each side; "is it a right triangle?" -> the two
 * squared sides in boxes, then the verdict; "which triple, what multiplier" -> a table, then boxes.
 * Lengths: a whole-number answer goes in a number box; a radical answer is exact (simplest mixed radical) when the
 * booklet asks for exact form, and otherwise accepts the exact radical or a decimal to one decimal place (± 0.05).
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 12(b) (space diagonal through a non-whole base diagonal,
 * keeping d²). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ---------- keypad: radicals and decimals ---------- */
  var RADK = 'u6l1rad', Wd = HW.widgets;
  if (Wd && Wd.KEYSETS) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' },
      right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' }, enter: { label: 'Check ↵', fn: 'enter', wide: true },
      sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(', title: 'Square root' }, plus: { label: '+', tex: '+', plain: '+' }, minus: { label: '−', tex: '-', plain: '-' },
      dot: { label: '.', tex: '.', plain: '.' } };
    if (!Wd.KEYSETS[RADK]) Wd.KEYSETS[RADK] = [[dk(7), dk(8), dk(9), KY.sqrt, KY.del], [dk(4), dk(5), dk(6), KY.minus, KY.clear], [dk(1), dk(2), dk(3), KY.dot, KY.left, KY.right], [dk(0), KY.enter]];
    if (Wd.KEYHELP && !Wd.KEYHELP[RADK]) Wd.KEYHELP[RADK] = ['Type the number in front first, then <b>√</b>, e.g. 3 then √ then 5 for ' + HW.k('3\\sqrt{5}') + '. Press <b>▶</b> to step out of the root. Decimals use <b>.</b>', 'Type a root as <code>3sqrt(5)</code>; a decimal as <code>6.7</code>.'];
  }

  HW.addCodes({
    'no-root': 'Gave the squared length (no square root)', 'no-square': 'Didn’t square the sides', 'pyth-nosq': 'Pythagoras: added/subtracted the sides without squaring',
    'pyth-op': 'Pythagoras: added the squares instead of subtracting (or the reverse)', 'hyp-wrong': 'Hypotenuse misidentified (a leg used as the hypotenuse)', 'neg-length': 'Gave a negative length',
    'u6l1-doubled': 'Doubled a side instead of squaring it', 'u6l1-square-sum': 'Squared the sum of the legs instead of adding the squares', 'u6l1-one-leg': 'Picked only one of the two legs',
    'u6l1-not-longest': 'Tested the converse with a side that isn’t the longest as c', 'u6l1-verdict': 'Wrong verdict from the squared sides', 'u6l1-unscaled': 'Gave the basic triple’s side without scaling it',
    'u6l1-scale-other': 'Scaled the wrong member of the triple', 'u6l1-triple': 'Matched the wrong Pythagorean triple', 'u6l1-multiplier': 'Wrong multiplier for the triple',
    'u6l1-rect-perim': 'Used the diagonal in the rectangle’s perimeter', 'u6l1-tri-area': 'Halved the rectangle’s area (triangle formula)', 'u6l1-height-first': 'Gave a height instead of the drop',
    'u6l1-base-diag': 'Gave the base diagonal instead of the space diagonal', 'u6l1-d-rounded': 'Rounded the base diagonal before the second stage', 'u6l1-three-edges': 'Added the three edges instead of using the theorem twice',
    'u6l1-one-stage': 'Used the theorem only once (skipped a stage)', 'u6l1-add-km': 'Added a length that isn’t part of the triangle', units: 'Typed a unit in the box'
  });
  HW.addPartial({ 'u6l1-doubled': 'b', 'u6l1-square-sum': 'b', 'u6l1-one-leg': 's', 'u6l1-not-longest': 'b', 'u6l1-verdict': 'n', 'u6l1-unscaled': 'b', 'u6l1-scale-other': 'n',
    'u6l1-triple': 'n', 'u6l1-multiplier': 's', 'u6l1-rect-perim': 'b', 'u6l1-tri-area': 's', 'u6l1-height-first': 'b', 'u6l1-base-diag': 'b', 'u6l1-d-rounded': 's',
    'u6l1-three-edges': 'n', 'u6l1-one-stage': 'b', 'u6l1-add-km': 'n' });

  /* ---------- number helpers ---------- */
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 1e-7 : e); }
  function isSq(n) { var q = Math.round(Math.sqrt(n)); return q * q === n; }
  function simp(N) { var k = 1, m = N; for (var f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; } return { k: k, m: m }; }
  function rt(N) { var s = simp(N); return s.m === 1 ? String(s.k) : (s.k === 1 ? '' : s.k) + '\\sqrt{' + s.m + '}'; }
  function rtPlain(N) { var s = simp(N); return s.m === 1 ? String(s.k) : (s.k === 1 ? '' : s.k) + 'sqrt(' + s.m + ')'; }
  function rtSteps(N) { var s = simp(N); if (s.m === 1) return '\\sqrt{' + N + '}=' + s.k; if (s.k === 1) return '\\sqrt{' + N + '}'; return '\\sqrt{' + N + '}=\\sqrt{' + (s.k * s.k) + '\\times ' + s.m + '}=' + s.k + '\\sqrt{' + s.m + '}'; }
  function dec(x, dp) { return K.roundTo(x, dp).toFixed(dp); }
  function hasSqF(N) { var s = simp(N); return s.m > 1 && s.k > 1; }
  function sqFree(N) { return simp(N).k === 1 && N > 1; }
  function halfway(x, dp) { var s = Math.pow(10, dp), f = x * s - Math.floor(x * s); return Math.abs(f - 0.5) < 0.02; } // too close to a rounding boundary
  var BASE = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37]];
  /* every multiple of a basic triple with the hypotenuse in [lo, hi]: [leg, leg, hyp, basic triple, multiplier] */
  function triples(lo, hi, basics) {
    var out = []; (basics || BASE).forEach(function (b) { for (var k = 1; b[2] * k <= hi; k++) if (b[2] * k >= lo) out.push([b[0] * k, b[1] * k, b[2] * k, b, k]); });
    return out;
  }
  function legPairs(lo, hi, test) { var out = []; for (var a = lo; a <= hi; a++) for (var b = a; b <= hi; b++) if (test(a * a + b * b, a, b)) out.push([a, b]); return out; }
  function legHyp(cLo, cHi, test) { var out = []; for (var c = cLo; c <= cHi; c++) for (var b = 1; b < c; b++) if (test(c * c - b * b, c, b)) out.push([c, b]); return out; }
  function sw(r, p) { return r.chance(0.5) ? [p[0], p[1]] : [p[1], p[0]]; }

  /* ---------- diagnoses: v is the student's value, tol the tolerance (exact 1e-6, decimals 0.051) ---------- */
  function hypDiag(a, b) { // the hypotenuse from legs a and b
    return function (v, tol) {
      tol = tol || 1e-6; var N = a * a + b * b;
      if (!isFinite(v)) return null;
      if (near(v, N, tol)) return { code: 'no-root', hint: t(a + '^{2}+' + b + '^{2}=' + N) + ' is ' + t('c^{2}') + ', the <b>square</b> of the hypotenuse. Take the square root to finish.' };
      if (near(v, a + b, tol)) return { code: 'pyth-nosq', hint: 'You added the two legs. The hypotenuse is shorter than that: square each leg, add the squares, then take the square root.' };
      if (near(v, Math.sqrt(a + b), tol)) return { code: 'no-square', hint: 'Square each leg <b>before</b> you add: ' + t('c=\\sqrt{a^{2}+b^{2}}') + '.' };
      if (near(v, Math.sqrt(2 * a + 2 * b), tol) || near(v, 2 * a + 2 * b, tol)) return { code: 'u6l1-doubled', hint: 'Squaring means multiplying a number by <b>itself</b>: ' + t(a + '^{2}=' + a + '\\times ' + a + '=' + a * a) + ', not ' + t(a + '\\times 2') + '.' };
      if (a !== b && near(v, Math.sqrt(Math.abs(b * b - a * a)), tol)) return { code: 'pyth-op', hint: 'You subtracted. The missing side is the <b>hypotenuse</b> (across from the right angle), so <b>add</b> the squares of the legs.' };
      return null;
    };
  }
  function legDiag(c, b) { // the missing leg from hypotenuse c and leg b
    return function (v, tol) {
      tol = tol || 1e-6; var N = c * c - b * b;
      if (!isFinite(v)) return null;
      if (near(v, N, tol)) return { code: 'no-root', hint: t(c + '^{2}-' + b + '^{2}=' + N) + ' is the <b>square</b> of the missing leg. Take the square root to finish.' };
      if (near(v, Math.sqrt(c * c + b * b), tol)) return { code: 'pyth-op', hint: 'You added the squares, which gives a side longer than the hypotenuse — impossible. The missing side is a <b>leg</b>, so subtract: ' + t('b^{2}=c^{2}-a^{2}') + '.' };
      if (near(v, c - b, tol) || near(v, c + b, tol)) return { code: 'pyth-nosq', hint: 'Square the sides first: ' + t('b^{2}=' + c + '^{2}-' + b + '^{2}') + ', then take the square root.' };
      if (near(v, Math.sqrt(c - b), tol)) return { code: 'no-square', hint: 'Square each side <b>before</b> you subtract: ' + t('\\sqrt{' + c + '^{2}-' + b + '^{2}}') + '.' };
      if (near(v, Math.sqrt(Math.abs(2 * c - 2 * b)), tol)) return { code: 'u6l1-doubled', hint: 'Squaring means multiplying a number by <b>itself</b>: ' + t(c + '^{2}=' + c + '\\times ' + c + '=' + c * c) + '.' };
      return null;
    };
  }
  function legsTex(a, b) { return t(a) + ' and ' + t(b); }
  function hypSol(a, b, dp) {
    var N = a * a + b * b;
    return 'The missing side is the hypotenuse, so add the squares of the legs:<br>' + t('c^{2}=' + a + '^{2}+' + b + '^{2}=' + a * a + '+' + b * b + '=' + N) + '<br>' +
      t('c=' + rtSteps(N) + (dp != null && !isSq(N) ? '\\approx ' + dec(Math.sqrt(N), dp) : '')) + (isSq(N) ? ' (' + t(N) + ' is a perfect square).' : simp(N).k === 1 ? ' (' + t(N) + ' has no perfect-square factor, so ' + t('\\sqrt{' + N + '}') + ' is already simplest).' : '.');
  }
  function legSol(c, b, dp) {
    var N = c * c - b * b;
    return 'The missing side is a leg, so subtract the square of the known leg from the square of the hypotenuse:<br>' + t('b^{2}=' + c + '^{2}-' + b + '^{2}=' + c * c + '-' + b * b + '=' + N) + '<br>' +
      t('b=' + rtSteps(N) + (dp != null && !isSq(N) ? '\\approx ' + dec(Math.sqrt(N), dp) : '')) + (isSq(N) ? ' (' + t(N) + ' is a perfect square).' : simp(N).k === 1 ? ' (' + t(N) + ' has no perfect-square factor).' : '.');
  }
  var HINT_HYP = ['The two given sides are the legs, so the missing side is the hypotenuse: ' + t('c^{2}=a^{2}+b^{2}') + '.', 'Square each leg, add, then take the square root.'];
  var HINT_LEG = ['The hypotenuse is given, so the missing side is a leg: ' + t('b^{2}=c^{2}-a^{2}') + '.', 'Square both numbers, subtract the smaller square from the larger, then take the square root.'];

  /* ---------- checkers ---------- */
  /* the exact length √N in simplest form (a whole number when N is a perfect square) */
  function exactChk(N, dg) {
    var s = simp(N), d = function (v) { return dg ? dg(v, 1e-6) : null; };
    if (s.m !== 1) return K.radical({ k: s.k, n: 2, m: s.m }, 'mixed', { diag: function (v) { return d(v); } });
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (near(a.val, s.k, 1e-9)) return (sh.roots || sh.ops || sh.muls || sh.divs || sh.pow) ? form('simplify', 'Right value — ' + t(N) + ' is a perfect square, so simplify it all the way to a whole number.') : ok();
      var h = d(a.val); if (h) return wrong(h.code, h.hint);
      if (near(a.val, -s.k)) return wrong('neg-length', 'A length can’t be negative.');
      return wrong('value', null);
    };
  }
  /* the length rounded to dp places (a whole number may be typed with or without .0) */
  function approxChk(N, dp, dg) {
    var x = Math.sqrt(N);
    if (isSq(N)) return function (resp) {
      var p = HW.parse.number(resp); if (!p.ok) { var a = K.read(resp); if (a.res) return a.res; return form('decimal', 'Type the length as a number.'); }
      if (near(p.value, x, 1e-9)) return ok();
      var h = dg ? dg(p.value, 0.051) : null; if (h) return wrong(h.code, h.hint);
      return wrong('value', null);
    };
    return K.approx(x, dp, { diag: dg ? function (v) { return dg(v, 0.051); } : null });
  }
  /* either the exact simplest radical or a decimal to dp places (± half a unit in the last place) */
  function eitherChk(N, dp, dg) {
    var x = Math.sqrt(N), exact = exactChk(N, dg), tol = 0.5 * Math.pow(10, -dp) + 1e-9;
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (sh.roots || !sh.decimals && isSq(N) || sh.ops || sh.muls || sh.pow) return exact(resp);
      if (Math.abs(a.val - x) <= tol) return ok();
      if (!sh.decimals && near(a.val, Math.round(x), 1e-9)) return form('places', 'Round to one decimal place — or give the exact value with the <b>√</b> key.');
      var h = dg ? dg(a.val, 0.051) : null; if (h) return wrong(h.code, h.hint);
      if (near(a.val, -x, 0.06)) return wrong('neg-length', 'A length can’t be negative.');
      return wrong('value', null);
    };
  }

  /* ---------- part builders ---------- */
  function numPart(prompt, ans, dg, sol, hints, text, after, bad) {
    var p = KP.number(prompt, ans, dg ? function (v) { return dg(v, 0.051); } : null, sol, hints, text, after ? { after: after } : null);
    if (after) p.answer = t(F(ans)) + ' ' + after;
    p.bad = (bad || []).filter(function (b) { return Number(b) !== ans; }).map(String);
    return p;
  }
  function exactPart(prompt, N, dg, sol, hints, text, after, bad) {
    var p = KP.math(prompt, exactChk(N, dg), rt(N), sol, hints, text, { keys: RADK, after: after, placeholder: 'e.g. 3sqrt(5)' });
    if (after) p.answer = t(rt(N)) + ' ' + after;
    p.good = isSq(N) ? [] : [rtPlain(N)];
    p.bad = [String(N), dec(Math.sqrt(N), 1)].concat(isSq(N) ? [] : ['\\sqrt{' + N + '}']).concat(bad || []).filter(function (b) { return !(isSq(N) && b === String(Math.sqrt(N))); });
    if (simp(N).k === 1) p.bad = p.bad.filter(function (b) { return b !== '\\sqrt{' + N + '}'; });
    return p;
  }
  function eitherPart(prompt, N, dp, dg, sol, hints, text, after, bad) {
    var p = KP.math(prompt, eitherChk(N, dp, dg), rt(N), sol, hints, text, { keys: RADK, after: after, placeholder: 'exact (√) or ' + (dp === 1 ? 'to one decimal place' : dp + ' decimal places') });
    p.answer = t(rt(N) + (isSq(N) ? '' : '\\approx ' + dec(Math.sqrt(N), dp))) + (after ? ' ' + after : '');
    p.good = isSq(N) ? [] : [dec(Math.sqrt(N), dp), rtPlain(N)];
    p.bad = [String(N)].concat(bad || []);
    return p;
  }
  function radField(label, name, after) { return { label: label, name: name, mode: 'math', keys: RADK, placeholder: 'e.g. 3sqrt(5)', after: after }; }
  function decField(label, name, after) { return { label: label, name: name, after: after }; }
  function numField(label, name, after) { return { label: label, name: name, after: after }; }
  /* exact + one-decimal-place boxes for the length √N */
  function lenFields(prompt, N, dg, sol, hints, text, after, nm) {
    nm = nm || 'Length';
    var p = KP.fields(prompt, [radField('Exact:', nm + ' exact', after), decField('≈', nm + ' to one decimal place', after)], [exactChk(N, dg), approxChk(N, 1, dg)],
      [rt(N), isSq(N) ? String(Math.sqrt(N)) : dec(Math.sqrt(N), 1)], t(rt(N) + (isSq(N) ? '' : '\\approx ' + dec(Math.sqrt(N), 1))) + (after ? ' ' + after : '') + (isSq(N) ? ' (a whole number)' : ''), sol, hints, text);
    p.bad = [[String(N), dec(N, 1)]];
    if (!isSq(N)) p.good = [[rtPlain(N), dec(Math.sqrt(N), 1)]];
    return p;
  }
  function mcP(r, prompt, opts, sol, hints, text, keepOrder) { return KP.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  function figDiv(svg) { return '<div class="fig">' + svg + '</div>'; }
  /* a right triangle drawn with legs a (vertical) and b (horizontal), labels as given; the shape is clamped so thin
   * triangles stay readable, and turned/mirrored at random */
  function triFig(r, a, b, labs, opt) {
    opt = opt || {};
    var w = b, h = a, q = w / h; if (q > 3.2) h = w / 3.2; if (q < 1 / 3.2) w = h / 3.2;
    var rot = opt.rot != null ? opt.rot : r.pick([0, 0, 1, 2, 3]), flip = opt.flip != null ? opt.flip : r.chance(0.4);
    return figDiv(HW.tri({ w: w, h: h, names: ['A', 'B', 'C'], hideNames: true, sides: { a: labs[0], b: labs[1], c: labs[2] }, rot: rot, flip: flip, width: opt.width || 230, aria: 'right triangle' }));
  }

  /* ======================== Assignment ======================== */
  var Q = [
    /* ---------- Part A ---------- */
    { num: '1', section: 'Part A — Naming the Sides and Stating the Theorem', stem: function (sh) { return 'For the right triangle shown, identify the two legs and the hypotenuse.' + sh.fig; },
      shared: function (r) {
        var T = r.chance(0.2) ? [9, 40, 41] : r.pick(triples(5, 41, BASE)), a = T[0], b = T[1], c = T[2];
        return { a: a, b: b, c: c, fig: triFig(r, a, b, [String(a), String(b), String(c)], { width: 240 }) };
      }, parts: [
        { id: '1a', level: 'LIM', make: function (r, sh) {
          var vals = [sh.a, sh.b, sh.c].sort(function (x, y) { return x - y; });
          var p = { prompt: 'Tap the <b>two legs</b>.', input: { type: 'select', options: vals.map(function (v) { return { value: v, html: t(v) }; }) },
            check: K.selectSet([sh.a, sh.b], function (extra, missing) {
              if (extra.indexOf(sh.c) >= 0) return { code: 'hyp-wrong', hint: t(sh.c) + ' is the side across from the right angle (the box) — that is the <b>hypotenuse</b>, not a leg.' };
              if (missing.length === 1) return { code: 'u6l1-one-leg', hint: 'A right triangle has <b>two</b> legs: the two sides that meet at the right angle. Tap both.' };
              return null;
            }), key: [sh.a, sh.b], answer: 'Legs ' + legsTex(sh.a, sh.b),
            solution: 'The legs are the two sides that meet to form the right angle (the small square): ' + legsTex(sh.a, sh.b) + '. The side across from the right angle, ' + t(sh.c) + ', is the hypotenuse.',
            hints: ['Find the small square: it marks the right angle. The two sides that touch it are the legs.'], text: 'legs ' + sh.a + ',' + sh.b, bad: [[sh.a, sh.c], [sh.b]] };
          return p;
        } },
        { id: '1b', level: 'LIM', make: function (r, sh) {
          return mcP(r, 'Which side is the <b>hypotenuse</b>?', [sh.a, sh.b, sh.c].sort(function (x, y) { return x - y; }).map(function (v) {
            return v === sh.c ? { html: t(v), right: true } : { html: t(v), why: t(v) + ' is a leg: it is one of the two sides that form the right angle. The hypotenuse is across from the right angle — and it is the longest side.', code: 'hyp-wrong' };
          }), 'The hypotenuse is the side opposite the right angle, and it is always the longest side: ' + t(sh.c) + '.', ['Which side does not touch the small square?'], 'hypotenuse ' + sh.c, true);
        } }] },
    { num: '2', stem: '', parts: [
      { id: '2', level: 'BEG', make: function (r) {
        var T = r.chance(0.2) ? [10, 24, 26] : r.pick(triples(10, 60).filter(function (x) { return x[0] !== x[1]; })), s = [T[0], T[1]].sort(function (x, y) { return x - y; }), a = s[0], b = s[1], c = T[2];
        var shown = r.shuffle([a, b, c]);
        return mcP(r, 'A right triangle has side lengths ' + t(shown[0]) + ', ' + t(shown[1]) + ' and ' + t(shown[2]) + '. Without drawing a diagram, which length must be the hypotenuse, and how do you know?', [
          { html: t(c) + ' — it is the longest of the three lengths, and the hypotenuse (the side opposite the right angle) is always the longest side.', right: true },
          { html: t(c) + ' — the hypotenuse is always the sum of the other two sides.', why: 'The right length, but the wrong reason: ' + t(a + '+' + b + '=' + (a + b)) + ', not ' + t(c) + '. The hypotenuse is the <b>longest</b> side, shorter than the other two put together.', code: 'reason' },
          { html: t(a) + ' — the shortest side is across from the right angle.', why: 'The side across from the right angle is the <b>longest</b> side, not the shortest.', code: 'shortest' },
          { html: t(b) + ' — the hypotenuse is the middle length, between the two legs.', why: 'The hypotenuse is longer than <b>both</b> legs, so it is the longest of the three.', code: 'middle' }],
          'The hypotenuse is opposite the right angle and is always the longest side, so it must be ' + t(c) + '. (Check: ' + t(a + '^{2}+' + b + '^{2}=' + (a * a) + '+' + (b * b) + '=' + (c * c) + '=' + c + '^{2}') + '.)',
          ['Which side of a right triangle is always the longest?'], 'which is hypotenuse ' + shown.join(','));
      } }] },
    { num: '3', stem: 'Fill in the blanks of the Pythagorean theorem.', shared: function (r) { return { L: r.chance(0.3) ? ['a', 'b', 'c'] : r.pick([['a', 'b', 'c'], ['p', 'q', 'r'], ['x', 'y', 'z'], ['d', 'e', 'f'], ['m', 'n', 'k'], ['u', 'v', 'w'], ['g', 'h', 'j']]) }; }, parts: [
      { id: '3a', level: 'LIM', make: function (r, sh) {
        var a = sh.L[0], b = sh.L[1], c = sh.L[2];
        return mcP(r, 'A right triangle has legs ' + t(a) + ' and ' + t(b) + ' and hypotenuse ' + t(c) + '. Which equation is the Pythagorean theorem?', [
          { html: t(a + '^{2}+' + b + '^{2}=' + c + '^{2}'), right: true },
          { html: t(a + '+' + b + '=' + c), why: 'The theorem is about the <b>squares</b> of the sides, not the sides themselves.', code: 'nosq' },
          { html: t(a + '^{2}-' + b + '^{2}=' + c + '^{2}'), why: 'The squares of the two legs are <b>added</b>.', code: 'sub' },
          { html: t(a + '^{2}+' + c + '^{2}=' + b + '^{2}'), why: 'Here ' + t(c) + ' is the hypotenuse, so ' + t(c + '^{2}') + ' must be alone on its own side.', code: 'hyp' }],
          'The squares of the two legs add up to the square of the hypotenuse: ' + t(a + '^{2}+' + b + '^{2}=' + c + '^{2}') + '.', ['Square each leg and add — that equals the square of the hypotenuse.'], 'theorem ' + sh.L.join(''));
      } },
      { id: '3b', level: 'LIM', make: function (r, sh) {
        var a = sh.L[0], b = sh.L[1], c = sh.L[2];
        return mcP(r, 'In ' + t(a + '^{2}+' + b + '^{2}=' + c + '^{2}') + ', the letter ' + t(c) + ' represents the ______.', [
          { html: '<b>hypotenuse</b> — the side opposite the right angle', right: true },
          { html: 'longest <b>leg</b>', why: 'The legs are ' + t(a) + ' and ' + t(b) + ' — the two sides that form the right angle. ' + t(c) + ' is not a leg.', code: 'leg' },
          { html: '<b>right angle</b>', why: 'Every letter in the theorem is a side length, not an angle.', code: 'angle' },
          { html: 'shortest side', why: t(c) + ' is the longest side of the right triangle.', code: 'short' }],
          t(c) + ' is the <b>hypotenuse</b>: the side opposite the right angle, and always the longest side.', ['Which side sits alone on one side of the equation?'], 'c is hypotenuse ' + sh.L.join(''));
      } }] },

    /* ---------- Part B ---------- */
    { num: '4', section: 'Part B — Verifying the Theorem and Finding the Hypotenuse', stem: 'Show both sides of the equation.', parts: [
      { id: '4', level: 'BEG', make: function (r) { var T = r.chance(0.25) ? [5, 12, 13] : r.pick(triples(5, 41).filter(function (x) { return x[4] === 1 || x[2] <= 20; })); return verifyPart(r, T); } }] },
    { num: '5', stem: 'Show both sides of the equation.', parts: [
      { id: '5', level: 'BEG', make: function (r) { var T = r.chance(0.25) ? [9, 12, 15] : r.pick(triples(10, 52).filter(function (x) { return x[4] > 1; })); return verifyPart(r, T); } }] },
    { num: '6', stem: 'Find the hypotenuse of each right triangle from the two legs given.', parts: [
      { id: '6', level: 'BEG', make: function (r) { var T = r.chance(0.2) ? [6, 8, 10] : r.pick(triples(5, 30)); return hypWhole(r, T); } }] },
    { num: '7', stem: 'Find the hypotenuse of each right triangle from the two legs given.', parts: [
      { id: '7', level: 'BEG', make: function (r) { var T = r.chance(0.2) ? [10, 24, 26] : r.pick(triples(13, 41).filter(function (x) { return x[2] >= 13; })); return hypWhole(r, T); } }] },
    { num: '8', stem: 'Find the hypotenuse of each right triangle from the two legs given.', parts: [
      { id: '8', level: 'EMG', make: function (r) {
        var L = r.chance(0.2) ? [3, 6] : r.pick(legPairs(2, 12, function (N) { return hasSqF(N) && N <= 200; })), a = L[0], b = L[1], N = a * a + b * b;
        return exactPart('Legs ' + legsTex(a, b) + '. Give your answer as a simplified mixed radical.', N, hypDiag(a, b), hypSol(a, b),
          [HINT_HYP[0], t(N) + ' is not a perfect square: find its largest perfect-square factor and take its root out, as in Unit 1.'], 'hyp radical ' + a + ',' + b, null, [rtPlain(a + b)]);
      } }] },

    /* ---------- Part C ---------- */
    { num: '9', section: 'Part C — Finding a Missing Leg', stem: '', parts: [
      { id: '9', level: 'BEG', make: function (r) { var T = r.chance(0.2) ? [6, 8, 10] : r.pick(triples(5, 30)), o = sw(r, T); return legWhole(T[2], o[0], o[1]); } }] },
    { num: '10', stem: '', parts: [
      { id: '10', level: 'EMG', make: function (r) { var T = r.chance(0.2) ? [10, 24, 26] : r.pick(triples(13, 52)), lo = Math.min(T[0], T[1]), hi = Math.max(T[0], T[1]); return legWhole(T[2], hi, lo); } }] },

    /* ---------- Part D ---------- */
    { num: '11', section: 'Part D — Applications and Extension', stem: '', parts: [
      { id: '11', level: 'PRG', make: function (r) {
        var T = r.chance(0.2) ? [9, 12, 15] : r.pick(triples(10, 30)), base = Math.min(T[0], T[1]), h = Math.max(T[0], T[1]), c = T[2], u = r.pick(['m', 'm', 'ft']);
        if (r.chance(0.3)) { var tmp = base; base = h; h = tmp; }
        return numPart('A ' + t(c) + '&nbsp;' + u + ' ladder leans against a vertical wall with its base ' + t(base) + '&nbsp;' + u + ' from the wall. How high up the wall does the ladder reach?', h, legDiag(c, base),
          'The wall, the ground and the ladder form a right triangle. The ladder is across from the right angle, so it is the <b>hypotenuse</b> (' + t(c) + ' ' + u + '); the distance from the wall is a leg.<br>' + legSol(c, base) + ' ' + u + '.',
          ['Sketch it: wall, ground and ladder make a right triangle. Which side is across from the right angle?', HINT_LEG[0]], 'ladder ' + c + ',' + base, u, [Math.round(Math.sqrt(c * c + base * base) * 10) / 10, c - base]);
      } }] },
    { num: '12', stem: '', parts: [
      { id: '12', level: 'EMG', make: function (r) {
        var T = r.chance(0.2) ? [5, 12, 13] : r.pick(triples(5, 30)), o = sw(r, T), u = r.pick(['ft', 'ft', 'm']), thing = r.pick([['gate', 'diagonal support brace', 'brace'], ['door frame', 'diagonal brace', 'brace'], ['window', 'diagonal strip of trim', 'trim'], ['bookshelf back', 'diagonal support wire', 'wire']]);
        return numPart('A rectangular ' + thing[0] + ' is ' + t(o[0]) + '&nbsp;' + u + ' wide and ' + t(o[1]) + '&nbsp;' + u + ' tall. A ' + thing[1] + ' will be installed corner to corner. Find the length of the ' + thing[2] + '.', T[2], hypDiag(o[0], o[1]),
          'The ' + thing[2] + ' cuts the rectangle into two right triangles; the width and the height are the legs and the ' + thing[2] + ' is the hypotenuse.<br>' + hypSol(o[0], o[1]) + ' ' + u + '.',
          ['The corners of a rectangle are right angles, so the diagonal is the hypotenuse of a right triangle.', HINT_HYP[1]], 'brace ' + o.join(','), u, [o[0] + o[1]]);
      } }] },
    { num: '13', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '13', level: 'BEG', make: function (r) {
        var T = r.chance(0.2) ? [7, 24, 25] : r.pick(triples(5, 41).filter(function (x) { return Math.abs(x[1] - x[0]) > 1 && x[0] * x[1] !== x[2] && x[1] - x[0] !== x[2]; })), o = sw(r, T), a = o[0], b = o[1];
        return mcP(r, 'A right triangle has legs of length ' + legsTex(a, b) + '. What is the length of the hypotenuse?', [
          { html: t(T[2]), right: true },
          { html: t(a + b), why: 'That adds the legs. Square them first: ' + t('\\sqrt{' + a + '^{2}+' + b + '^{2}}') + '.', code: 'add' },
          { html: t(Math.abs(b - a)), why: 'The hypotenuse is the longest side, so it can’t be shorter than a leg. Add the squares of the legs.', code: 'sub' },
          { html: t(a * b), why: 'That multiplies the legs. The theorem adds their <b>squares</b>, then takes the square root.', code: 'mult' }],
          hypSol(a, b), HINT_HYP, 'MC hyp ' + a + ',' + b);
      } }] },
    { num: '14', stem: '<i>(Numerical Response)</i>', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var T = r.chance(0.2) ? [12, 16, 20] : r.pick(triples(10, 50)), o = sw(r, T), c = T[2], b = o[0], ans = o[1], dg = legDiag(c, b);
        var p = KP.nr('A right triangle has a hypotenuse of length ' + t(c) + ' and one leg of length ' + t(b) + '. The length of the other leg is ________.', ans, function (v) { return dg(v, 1e-6); }, legSol(c, b), HINT_LEG, 'NR leg ' + c + ',' + b);
        p.bad = [String(Math.round(Math.sqrt(c * c + b * b) * 10) / 10), String(c - b)].filter(function (x) { return Number(x) !== ans; }); return p;
      } }] },
    { num: '15', stem: function (sh) { return 'A triangle has side lengths ' + t(sh.shown[0]) + ', ' + t(sh.shown[1]) + ' and ' + t(sh.shown[2]) + '. Use the Pythagorean theorem to decide whether it is a right triangle.'; }, shared: function (r) { return converseSet(r, r.chance(0.6) ? 'no' : 'yes', [6, 7, 9], 20); }, parts: [
      { id: '15a', level: 'PRG', make: function (r, sh) { return conversePart(sh, 'Add the squares of the two shorter sides, then square the longest side.'); } },
      { id: '15b', level: 'PRG', make: function (r, sh) { return verdictMC(r, sh, 'Is it a right triangle?'); } }] }
  ];

  /* Q4 / Q5: verify a triple */
  function verifyPart(r, T) {
    var o = sw(r, T), a = o[0], b = o[1], c = T[2], S = a * a + b * b;
    var p = KP.fields('Verify that a right triangle with legs ' + legsTex(a, b) + ' and hypotenuse ' + t(c) + ' satisfies the Pythagorean theorem.',
      [numField(t('a^{2}+b^{2}=' + a + '^{2}+' + b + '^{2}='), 'a² + b²'), numField(t('c^{2}=' + c + '^{2}='), 'c²')],
      [K.number(S, function (v) {
        if (v === a + b) return { code: 'pyth-nosq', hint: 'Square each leg first: ' + t(a + '^{2}=' + a * a) + '.' };
        if (v === 2 * a + 2 * b) return { code: 'u6l1-doubled', hint: 'Squaring means multiplying a number by itself: ' + t(a + '^{2}=' + a + '\\times ' + a) + ', not ' + t(a + '\\times 2') + '.' };
        if (v === (a + b) * (a + b)) return { code: 'u6l1-square-sum', hint: 'Square each leg <b>separately</b>, then add: ' + t(a + '^{2}+' + b + '^{2}') + ' is not ' + t('(' + a + '+' + b + ')^{2}') + '.' };
        return null; }), K.number(c * c, function (v) { if (v === 2 * c) return { code: 'u6l1-doubled', hint: t(c + '^{2}=' + c + '\\times ' + c) + ', not ' + t(c + '\\times 2') + '.' }; return null; })],
      [String(S), String(c * c)], t(a + '^{2}+' + b + '^{2}=' + S) + ' and ' + t(c + '^{2}=' + c * c) + ' — equal, so the theorem holds.',
      t('a^{2}+b^{2}=' + a + '^{2}+' + b + '^{2}=' + a * a + '+' + b * b + '=' + S) + '<br>' + t('c^{2}=' + c + '^{2}=' + c * c) + '<br>Both sides equal ' + t(S) + ', so the triangle satisfies ' + t('a^{2}+b^{2}=c^{2}') + '.',
      ['Work out each side separately: square each leg and add; then square the hypotenuse.', 'Squaring means multiplying a number by itself, e.g. ' + t('5^{2}=5\\times 5=25') + '.'], 'verify ' + a + ',' + b + ',' + c);
    p.bad = [[String(a + b), String(2 * c)]]; return p;
  }
  function hypWhole(r, T) {
    var o = sw(r, T), a = o[0], b = o[1];
    return numPart('Legs ' + legsTex(a, b) + '.', T[2], hypDiag(a, b), hypSol(a, b), HINT_HYP, 'hyp ' + a + ',' + b, null, [a + b, a * a + b * b]);
  }
  function legWhole(c, b, ans) {
    return numPart('Find the missing leg of a right triangle with hypotenuse ' + t(c) + ' and one leg ' + t(b) + '.', ans, legDiag(c, b), legSol(c, b), HINT_LEG, 'leg ' + c + ',' + b, null, [Math.round(Math.sqrt(c * c + b * b) * 1e4) / 1e4, c - b]);
  }
  /* converse sets: kind 'yes' = a scaled triple, 'no' = a near miss; dflt = the booklet's set */
  function converseSet(r, kind, dflt, maxC) {
    var s;
    if (dflt && r.chance(0.2)) s = dflt.slice();
    else if (kind === 'yes') { var T = r.pick(triples(5, maxC || 30)); s = [T[0], T[1], T[2]]; }
    else {
      for (var i = 0; i < 200; i++) {
        var a = r.int(3, Math.round((maxC || 30) * 0.6)), b = r.int(a + 1, Math.round((maxC || 30) * 0.8)), c0 = Math.sqrt(a * a + b * b), c = Math.round(c0) + r.pick([-1, 0, 0, 1]);
        if (c <= b || c >= a + b || a * a + b * b === c * c || c > (maxC || 30)) continue;
        s = [a, b, c]; break;
      }
      if (!s) s = [6, 7, 9];
    }
    s.sort(function (x, y) { return x - y; });
    return { a: s[0], b: s[1], c: s[2], right: s[0] * s[0] + s[1] * s[1] === s[2] * s[2], shown: r.shuffle(s) };
  }
  function conversePart(sh, prompt) {
    var a = sh.a, b = sh.b, c = sh.c, S = a * a + b * b;
    var other = function (v) { // used a side that isn't the longest as c
      if (v === a * a + c * c || v === b * b + c * c) return { code: 'u6l1-not-longest', hint: 'The longest side, ' + t(c) + ', plays the part of the hypotenuse — add the squares of the <b>two shorter</b> sides.' };
      if (v === a + b) return { code: 'pyth-nosq', hint: 'Square each side first.' };
      if (v === 2 * a + 2 * b) return { code: 'u6l1-doubled', hint: 'Squaring means multiplying a number by itself.' };
      return null;
    };
    var p = KP.fields(prompt, [numField('Sum of the squares of the two shorter sides =', 'a² + b²'), numField('Square of the longest side =', 'c²')],
      [K.number(S, other), K.number(c * c, function (v) { if (v === a * a || v === b * b) return { code: 'u6l1-not-longest', hint: 'Square the <b>longest</b> side, ' + t(c) + '.' }; if (v === 2 * c) return { code: 'u6l1-doubled', hint: t(c + '^{2}=' + c + '\\times ' + c) + '.' }; return null; })],
      [String(S), String(c * c)], t(a + '^{2}+' + b + '^{2}=' + S) + ', ' + t(c + '^{2}=' + c * c),
      'The longest side, ' + t(c) + ', would be the hypotenuse. ' + t(a + '^{2}+' + b + '^{2}=' + a * a + '+' + b * b + '=' + S) + ' and ' + t(c + '^{2}=' + c * c) + '.',
      ['The longest side would have to be the hypotenuse, so square it on its own.', 'Add the squares of the other two sides.'], 'converse squares ' + [a, b, c].join(','));
    p.bad = [[String(a * a + c * c), String(b * b)]]; return p;
  }
  function verdictMC(r, sh, prompt) {
    var a = sh.a, b = sh.b, c = sh.c, S = a * a + b * b, C = c * c, rel = S === C ? '=' : '\\neq';
    var opts = sh.right ? [
      { html: '<b>Yes</b> — ' + t(a + '^{2}+' + b + '^{2}=' + S) + ' equals ' + t(c + '^{2}=' + C) + ', so the sides satisfy the theorem.', right: true },
      { html: '<b>No</b> — ' + t(a + '+' + b + '\\neq ' + c) + ', so the sides don’t fit.', why: 'The theorem compares <b>squares</b>, not the sides: ' + t(S + '=' + C) + '.', code: 'sides' },
      { html: '<b>No</b> — a right triangle can’t have a side as long as ' + t(c) + '.', why: 'Any lengths can make a right triangle if the squares match. Here they do: ' + t(S + '=' + C) + '.', code: 'guess' },
      { html: '<b>Yes</b> — the longest side is shorter than the other two added together.', why: 'That is true of <b>every</b> triangle, right or not. The test is whether ' + t(a + '^{2}+' + b + '^{2}=' + c + '^{2}') + '.', code: 'reason' }] : [
      { html: '<b>No</b> — ' + t(a + '^{2}+' + b + '^{2}=' + S) + ' but ' + t(c + '^{2}=' + C) + '. Since ' + t(S + '\\neq ' + C) + ', the sides don’t satisfy the theorem.', right: true },
      { html: '<b>Yes</b> — the longest side is shorter than the other two added together.', why: 'That is true of <b>every</b> triangle. A right triangle needs ' + t(a + '^{2}+' + b + '^{2}') + ' to equal ' + t(c + '^{2}') + ': ' + t(S + '\\neq ' + C) + '.', code: 'reason' },
      { html: '<b>Yes</b> — ' + t(S) + ' and ' + t(C) + ' are close, so it is a right triangle.', why: 'Close isn’t enough: the two sides must be <b>exactly</b> equal.', code: 'close' },
      { html: '<b>Can’t tell</b> without measuring the angles with a protractor.', why: 'The theorem decides it: if ' + t(a + '^{2}+' + b + '^{2}=' + c + '^{2}') + ' the triangle is right; if not, it isn’t.', code: 'cant' }];
    return mcP(r, prompt, opts, t(a + '^{2}+' + b + '^{2}=' + S) + ' and ' + t(c + '^{2}=' + C) + '. ' + t(S + rel + C) + ', so it is ' + (sh.right ? '' : '<b>not</b> ') + 'a right triangle.',
      ['Compare the two numbers from part (a).'], 'converse verdict ' + [a, b, c].join(','));
  }

  /* ======================== Extra Practice ======================== */
  function hypExact(r, a, b, text, labelPrompt) { // exact + decimal for the hypotenuse
    var N = a * a + b * b;
    return lenFields(labelPrompt || 'Legs ' + legsTex(a, b) + '.', N, hypDiag(a, b), hypSol(a, b, 1), [HINT_HYP[0], 'Simplify the radical (look for a perfect-square factor), then round to one decimal place.'], text);
  }
  function legExact(r, c, b, text, labelPrompt) {
    var N = c * c - b * b;
    return lenFields(labelPrompt || 'Hypotenuse ' + t(c) + ', one leg ' + t(b) + '.', N, legDiag(c, b), legSol(c, b, 1), [HINT_LEG[0], 'Simplify the radical (look for a perfect-square factor), then round to one decimal place.'], text);
  }
  var SFP = legPairs(2, 12, function (N, a, b) { return sqFree(N) && a !== b && !halfway(Math.sqrt(N), 1); });
  var SQP = legPairs(2, 14, function (N, a, b) { return hasSqF(N) && !halfway(Math.sqrt(N), 1); });
  function figLegs(r, a, b, unknown) { return triFig(r, a, b, [String(a), String(b), unknown], { width: 200 }); }
  function figLegHyp(r, c, b) { var a = Math.sqrt(c * c - b * b); return triFig(r, b, a, [String(b), 'a', String(c)], { width: 200 }); }

  /* Q12: a box with its base diagonal d (dashed) and space diagonal D, as in the booklet */
  function boxFig() {
    var L = 150, H = 80, dx = 50, dy = 32, ox = 20, oy = 130, P = function (x, y) { return [ox + x, oy - y]; };
    var ln = function (a, b, o) { o = o || {}; return '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="' + (o.c || '#2b3340') + '" stroke-width="' + (o.w || 1.8) + '"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : '') + '/>'; };
    var tx = function (p, s, o) { o = o || {}; return '<text x="' + p[0] + '" y="' + p[1] + '" font-size="13" text-anchor="' + (o.a || 'middle') + '" fill="' + (o.c || '#2b3340') + '"' + (o.i ? ' font-style="italic" font-weight="600"' : '') + '>' + s + '</text>'; };
    var A = P(0, 0), B = P(L, 0), C = P(L, H), D = P(0, H), A2 = P(dx, dy), B2 = P(L + dx, dy), C2 = P(L + dx, H + dy), D2 = P(dx, H + dy);
    var g = ln(A, B) + ln(B, C) + ln(C, D) + ln(D, A) + ln(D, D2) + ln(D2, C2) + ln(C2, C) + ln(C2, B2) + ln(B2, B) + ln(A, A2, { c: '#9aa1ad', d: '4 3', w: 1.3 }) + ln(A2, B2, { c: '#9aa1ad', d: '4 3', w: 1.3 }) + ln(A2, D2, { c: '#9aa1ad', d: '4 3', w: 1.3 });
    g += ln(A, B2, { c: '#2b55a0', d: '6 4', w: 2.2 }) + ln(A, C2, { c: '#c4532a', w: 2.4 });
    g += tx([(A[0] + B[0]) / 2, A[1] + 17], 'length') + tx([-8 + A[0], (A[1] + D[1]) / 2 + 4], 'height', { a: 'end' }) + tx([(B[0] + B2[0]) / 2 + 8, (B[1] + B2[1]) / 2 + 14], 'width', { a: 'start' });
    g += tx([(A[0] + B2[0]) / 2 + 12, (A[1] + B2[1]) / 2 + 20], 'd', { c: '#2b55a0', i: 1 }) + tx([(A[0] + C2[0]) / 2 - 8, (A[1] + C2[1]) / 2 - 6], 'D', { c: '#c4532a', i: 1 });
    return figDiv('<svg class="fig-svg" viewBox="-40 0 300 160" width="100%" style="max-width:300px" role="img" aria-label="box with base diagonal d and space diagonal D">' + g + '</svg>');
  }
  /* Q6: multiples of the three named triples */
  var NAMED = [[3, 4, 5], [5, 12, 13], [8, 15, 17]], NAMEID = ['t345', 't51213', 't81517'];
  function e6Shared(r) {
    var none = r.int(0, 3), rows = [], used = {};
    for (var i = 0; i < 4; i++) {
      if (i === none) {
        var alt = r.pick([[9, 40, 41], [7, 24, 25], [20, 21, 29], [11, 60, 61], [12, 35, 37]]);
        rows.push({ s: alt, which: 'none' });
      } else {
        var w, k; do { w = r.int(0, 2); k = r.int(2, w === 0 ? 9 : 5); } while (used[w + ':' + k]);
        used[w + ':' + k] = 1; rows.push({ s: NAMED[w].map(function (x) { return x * k; }), which: NAMEID[w], k: k, base: NAMED[w] });
      }
    }
    if (r.chance(0.2)) rows = [{ s: [15, 20, 25], which: 't345', k: 5, base: [3, 4, 5] }, { s: [24, 45, 51], which: 't81517', k: 3, base: [8, 15, 17] }, { s: [25, 60, 65], which: 't51213', k: 5, base: [5, 12, 13] }, { s: [9, 40, 41], which: 'none' }];
    return { rows: rows };
  }
  /* Q11: two triangles sharing AC, both stages whole numbers */
  var CHAINS = (function () {
    var out = [];
    triples(5, 50).forEach(function (T1) { for (var cd = 3; cd <= 45; cd++) { var N = T1[2] * T1[2] + cd * cd; if (isSq(N) && Math.sqrt(N) <= 60) out.push({ ab: T1[0], bc: T1[1], ac: T1[2], cd: cd, ad: Math.sqrt(N) }); } });
    return out;
  })();
  function chainFig(ch) {
    var A = [0, ch.ab], B = [0, 0], C = [ch.bc, 0], u = [C[0] - A[0], C[1] - A[1]], L = Math.hypot(u[0], u[1]), n = [u[1] / L, -u[0] / L]; // perpendicular to AC, away from B
    if (n[0] * (B[0] - C[0]) + n[1] * (B[1] - C[1]) > 0) n = [-n[0], -n[1]];
    var D = [C[0] + n[0] * ch.cd, C[1] + n[1] * ch.cd];
    return figDiv(HW.fig({ pts: { A: A, B: B, C: C, D: D }, segs: [['A', 'B', String(ch.ab)], ['B', 'C', String(ch.bc)], ['C', 'A'], ['C', 'D', String(ch.cd)], ['D', 'A']], right: [['B', 'A', 'C'], ['C', 'A', 'D']], width: 300, aria: 'two right triangles sharing AC' }));
  }
  function tripleName(T) { var b = BASE.filter(function (q) { return T[2] % q[2] === 0 && T[0] % q[0] === 0 && T[1] % q[1] === 0 && T[0] / q[0] === T[2] / q[2] && T[1] / q[1] === T[2] / q[2]; })[0]; return b && b[2] !== T[2] ? t(T.join(',\\ ')) + ' (' + t(b.join(',\\ ')) + ' times ' + t(T[2] / b[2]) + ')' : t(T.join(',\\ ')); }
  function sortedT(a, b, c) { var s = [a, b].sort(function (x, y) { return x - y; }); return [s[0], s[1], c]; }
  /* Q12(b): boxes whose base diagonal is not whole but whose space diagonal is */
  var BOXB = (function () { var out = []; for (var l = 1; l <= 10; l++) for (var w = l; w <= 10; w++) { if (isSq(l * l + w * w)) continue; for (var h = 1; h <= 16; h++) { var N = l * l + w * w + h * h; if (isSq(N) && Math.sqrt(N) <= 20) out.push([l, w, h]); } } return out; })();
  /* Q19: crates with whole base and space diagonals */
  var CRATES = (function () { var out = []; triples(5, 30).forEach(function (T) { for (var h = 2; h <= 40; h++) { var N = T[2] * T[2] + h * h; if (isSq(N) && Math.sqrt(N) <= 50) out.push([T[0], T[1], h, T[2], Math.sqrt(N)]); } }); return out; })();

  var X = [
    /* ---------- Part A ---------- */
    { num: '1', section: 'Part A — Exact Answers: Hypotenuse and Missing Leg', stem: 'Find the length of the hypotenuse. Give the <b>exact</b> answer as a simplified radical and a decimal rounded to <b>one decimal place</b>.', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) { var L = r.chance(0.2) ? [5, 7] : r.pick(SFP); L = sw(r, L); return hypExact(r, L[0], L[1], 'EP1a ' + L.join(',')); } },
      { id: 'e1b', level: 'EMG', make: function (r) { var L = r.chance(0.2) ? [6, 9] : r.pick(SQP.filter(function (p) { return p[0] !== p[1]; })); L = sw(r, L); return hypExact(r, L[0], L[1], 'EP1b ' + L.join(',')); } },
      { id: 'e1c', level: 'BEG', make: function (r) { var L = r.chance(0.2) ? [3, 11] : r.pick(legPairs(2, 14, function (N, a, b) { return sqFree(N) && b >= 9 && !halfway(Math.sqrt(N), 1); })); L = sw(r, L); return hypExact(r, L[0], L[1], 'EP1c ' + L.join(',')); } }] },
    { num: '2', stem: 'Find the length of the hypotenuse ' + t('c') + ' in each right triangle. Give the exact answer as a simplified radical and a decimal to one decimal place.', parts: [
      { id: 'e2a', level: 'EMG', make: function (r) { var L = r.chance(0.2) ? [6, 10] : r.pick(SQP.filter(function (p) { return p[0] !== p[1] && p[1] !== 2 * p[0]; })); L = sw(r, L); return hypExact(r, L[0], L[1], 'EP2a ' + L.join(','), figLegs(r, L[0], L[1], 'c')); } },
      { id: 'e2b', level: 'EMG', make: function (r) { var k = r.chance(0.2) ? 10 : r.int(2, 14); return hypExact(r, k, k, 'EP2b ' + k, figLegs(r, k, k, 'c')); } },
      { id: 'e2c', level: 'EMG', make: function (r) { var k = r.chance(0.2) ? 7 : r.int(2, 12), L = sw(r, [k, 2 * k]); return hypExact(r, L[0], L[1], 'EP2c ' + k, figLegs(r, L[0], L[1], 'c')); } }] },
    { num: '3', stem: 'Find the length of the missing leg of each right triangle. Give the exact answer as a simplified radical (or say it is a whole number) and a decimal to one decimal place.', parts: [
      { id: 'e3a', level: 'BEG', make: function (r) { var T = r.chance(0.2) ? [9, 12, 15] : r.pick(triples(10, 30)), o = sw(r, T); return legExact(r, T[2], o[0], 'EP3a ' + T[2] + ',' + o[0]); } },
      { id: 'e3b', level: 'EMG', make: function (r) { var P = r.chance(0.2) ? [20, 8] : r.pick(legHyp(8, 20, function (N) { return hasSqF(N) && !halfway(Math.sqrt(N), 1); })); return legExact(r, P[0], P[1], 'EP3b ' + P.join(',')); } },
      { id: 'e3c', level: 'EMG', make: function (r) { var P = r.chance(0.2) ? [14, 5] : r.pick(legHyp(8, 20, function (N, c, b) { return hasSqF(N) && b <= c / 2 && !halfway(Math.sqrt(N), 1); })); return legExact(r, P[0], P[1], 'EP3c ' + P.join(',')); } }] },
    { num: '4', stem: 'Find the length of the missing leg ' + t('a') + ' in each right triangle. Give the exact answer and a decimal to one decimal place.', parts: [
      { id: 'e4a', level: 'BEG', make: function (r) { var T = r.chance(0.2) ? [10, 24, 26] : r.pick(triples(10, 30)), o = sw(r, T); return legExact(r, T[2], o[0], 'EP4a ' + T[2] + ',' + o[0], figLegHyp(r, T[2], o[0])); } },
      { id: 'e4b', level: 'EMG', make: function (r) { var P = r.chance(0.2) ? [9, 4] : r.pick(legHyp(5, 13, function (N) { return sqFree(N) && !halfway(Math.sqrt(N), 1); })); return legExact(r, P[0], P[1], 'EP4b ' + P.join(','), figLegHyp(r, P[0], P[1])); } },
      { id: 'e4c', level: 'EMG', make: function (r) { var P = r.chance(0.2) ? [12, 7] : r.pick(legHyp(9, 16, function (N, c, b) { return sqFree(N) && b >= 4 && !halfway(Math.sqrt(N), 1); })); return legExact(r, P[0], P[1], 'EP4c ' + P.join(','), figLegHyp(r, P[0], P[1])); } }] },

    /* ---------- Part B ---------- */
    { num: '5', section: 'Part B — The Converse and Pythagorean Triples', stem: function (sh) { return 'The Pythagorean theorem also runs <b>backwards</b> (the <b>converse</b>): if the three sides satisfy ' + t('a^{2}+b^{2}=c^{2}') + ', with ' + t('c') + ' the longest side, the triangle <b>must</b> be a right triangle. Decide whether each set of side lengths forms a right triangle.<br>(a) ' + t(sh.s[0].shown.join(',\\ ')) + ' &nbsp; (b) ' + t(sh.s[1].shown.join(',\\ ')) + ' &nbsp; (c) ' + t(sh.s[2].shown.join(',\\ ')); },
      shared: function (r) {
        var kinds = r.shuffle(['yes', 'no', r.pick(['yes', 'no'])]), dflt = r.chance(0.2);
        var s = kinds.map(function (k, i) { return converseSet(r, k, null, 30); });
        if (dflt) s = [[20, 21, 29], [8, 11, 14], [16, 12, 20]].map(function (q) { var o = q.slice().sort(function (x, y) { return x - y; }); return { a: o[0], b: o[1], c: o[2], right: o[0] * o[0] + o[1] * o[1] === o[2] * o[2], shown: q }; });
        return { s: s };
      }, parts: [0, 1, 2].map(function (i) {
        return { id: 'e5' + 'abc'[i], level: 'EMG', make: function (r, sh) { return conversePart(sh.s[i], 'For ' + t(sh.s[i].shown.join(',\\ ')) + ': add the squares of the two shorter sides, then square the longest side.'); } };
      }).concat([{ id: 'e5v', sub: 'verdict', level: 'EMG', make: function (r, sh) {
        var rows = [0, 1, 2].map(function (i) { return { id: 'abc'[i], html: '(' + 'abc'[i] + ') ' + t(sh.s[i].shown.join(',\\ ')) }; }), want = {};
        sh.s.forEach(function (s, i) { want['abc'[i]] = s.right ? 'y' : 'n'; });
        return KP.grid('Which sets form a right triangle?', rows, [{ id: 'y', html: 'Right triangle' }, { id: 'n', html: 'Not a right triangle' }], want,
          { tries: 2, why: function (row) { var s = sh.s['abc'.indexOf(row)]; return { code: 'u6l1-verdict', hint: '(' + row + '): compare ' + t(s.a + '^{2}+' + s.b + '^{2}') + ' with ' + t(s.c + '^{2}') + '. Equal → right triangle; not equal → not.' }; } },
          sh.s.map(function (s, i) { var S = s.a * s.a + s.b * s.b, C = s.c * s.c; return '(' + 'abc'[i] + ') ' + t(s.a + '^{2}+' + s.b + '^{2}=' + S) + ', ' + t(s.c + '^{2}=' + C) + ': ' + (s.right ? 'equal — <b>right</b>.' : t(S + '\\neq ' + C) + ' — <b>not right</b>.'); }).join('<br>'),
          ['Use your squares from (a)–(c): the triangle is right only when the two numbers are equal.'], 'converse table');
      } }]) },
    { num: '6', stem: function (sh) { return 'Three famous <b>Pythagorean triples</b> are ' + t('3,4,5') + ', ' + t('5,12,13') + ' and ' + t('8,15,17') + '. Every whole-number multiple of a triple is also a triple (for example ' + t('3,4,5') + ' doubled gives ' + t('6,8,10') + ').<br>' + sh.rows.map(function (q, i) { return '(' + 'abcd'[i] + ') ' + t(q.s.join(',\\ ')); }).join(' &nbsp; '); }, shared: e6Shared, parts: [
      { id: 'e6a', sub: 'triple', level: 'EMG', make: function (r, sh) {
        var rows = sh.rows.map(function (q, i) { return { id: 'abcd'[i], html: '(' + 'abcd'[i] + ') ' + t(q.s.join(',\\ ')) }; }), want = {};
        sh.rows.forEach(function (q, i) { want['abcd'[i]] = q.which; });
        return KP.grid('Which triple is each set a multiple of?', rows, [{ id: 't345', html: t('3,4,5') }, { id: 't51213', html: t('5,12,13') }, { id: 't81517', html: t('8,15,17') }, { id: 'none', html: 'none' }], want,
          { tries: 2, why: function (row) { return { code: 'u6l1-triple', hint: '(' + row + '): divide all three numbers by the same whole number. Do you land on ' + t('3,4,5') + ', ' + t('5,12,13') + ' or ' + t('8,15,17') + '?' }; } },
          sh.rows.map(function (q, i) { return '(' + 'abcd'[i] + ') ' + (q.which === 'none' ? t(q.s.join(',\\ ')) + ' is not a multiple of any of the three (no common factor takes it to one of them). It is still a triple in its own right: ' + t(q.s[0] + '^{2}+' + q.s[1] + '^{2}=' + (q.s[0] * q.s[0] + q.s[1] * q.s[1]) + '=' + q.s[2] + '^{2}') + '.' : t(q.s.join(',\\ ') + '=' + q.k + '\\times(' + q.base.join(',\\ ') + ')')); }).join('<br>'),
          ['Divide each number in the set by the same whole number (try the smallest number ÷ 3, 5 or 8).'], 'triple multiples');
      } },
      { id: 'e6b', sub: 'multiplier', level: 'EMG', make: function (r, sh) {
        var idx = []; sh.rows.forEach(function (q, i) { if (q.which !== 'none') idx.push(i); });
        var p = KP.fields('For each set that <b>is</b> a multiple, what is the multiplier?', idx.map(function (i) { return numField('(' + 'abcd'[i] + ') multiplier:', '(' + 'abcd'[i] + ')'); }),
          idx.map(function (i) { var q = sh.rows[i]; return K.number(q.k, function (v) { if (v === q.k * q.k) return { code: 'u6l1-multiplier', hint: 'The multiplier scales each side once: ' + t(q.base[0] + '\\times ' + q.k + '=' + q.s[0]) + '.' }; return null; }); }),
          idx.map(function (i) { return String(sh.rows[i].k); }), idx.map(function (i) { return '(' + 'abcd'[i] + ') ' + t(sh.rows[i].k); }).join(', '),
          idx.map(function (i) { var q = sh.rows[i]; return '(' + 'abcd'[i] + ') ' + t(q.s[0] + '\\div ' + q.base[0] + '=' + q.k) + ', ' + t(q.s[1] + '\\div ' + q.base[1] + '=' + q.k) + ', ' + t(q.s[2] + '\\div ' + q.base[2] + '=' + q.k) + ': times ' + t(q.k) + '.'; }).join('<br>'),
          ['Divide a number in the set by the matching number of the basic triple.'], 'multipliers');
        p.bad = [idx.map(function (i) { return String(sh.rows[i].k + 1); })]; return p;
      } }] },
    { num: '7', stem: 'Each triangle is a scaled copy of ' + t('3,4,5') + ', ' + t('5,12,13') + ' or ' + t('8,15,17') + '. Find the missing side <b>without</b> squaring anything: spot the triple, find the multiplier, then scale the third member.', parts: [
      { id: 'e7a', level: 'EMG', make: function (r) { return scaleHyp(r, r.chance(0.2) ? [0, 7] : [0, r.int(3, 13)]); } },
      { id: 'e7b', level: 'EMG', make: function (r) { return scaleHyp(r, r.chance(0.2) ? [1, 4] : [r.pick([1, 2]), r.int(2, 6)]); } },
      { id: 'e7c', level: 'PRG', make: function (r) { return scaleLeg(r, r.chance(0.2) ? [2, 5, 1] : [r.pick([1, 2]), r.int(2, 6), r.int(0, 1)]); } },
      { id: 'e7d', level: 'PRG', make: function (r) { return scaleLeg(r, r.chance(0.2) ? [1, 3, 0] : [r.pick([0, 1, 2]), r.int(2, 8), r.int(0, 1)]); } }] },
    { num: '8', stem: function (sh) { return '<b>Error analysis.</b> A right triangle has a hypotenuse of ' + t(sh.c) + '&nbsp;cm and one leg of ' + t(sh.b) + '&nbsp;cm. Dev wants the other leg, so he writes:<br>' + t(sh.b + '^{2}+' + sh.c + '^{2}=c^{2},\\quad ' + sh.b * sh.b + '+' + sh.c * sh.c + '=' + (sh.b * sh.b + sh.c * sh.c) + ',\\quad c=\\sqrt{' + (sh.b * sh.b + sh.c * sh.c) + '}\\approx ' + dec(Math.sqrt(sh.b * sh.b + sh.c * sh.c), 1) + '\\text{ cm}'); },
      shared: function (r) { if (r.chance(0.2)) return { c: 17, b: 15, a: 8 }; var T = r.pick(triples(5, 30)), o = sw(r, T); return { c: T[2], b: o[0], a: o[1] }; }, parts: [
        { id: 'e8a', level: 'PRG', make: function (r, sh) {
          return mcP(r, 'What did Dev do wrong?', [
            { html: 'He used the hypotenuse ' + t(sh.c) + ' as a leg. The hypotenuse must be ' + t('c') + ', alone on its own side: ' + t(sh.b + '^{2}+b^{2}=' + sh.c + '^{2}') + '.', right: true },
            { html: 'He should have added the sides instead of their squares: ' + t(sh.b + '+' + sh.c) + '.', why: 'The theorem always uses squares. His mistake is <b>where</b> he put ' + t(sh.c) + '.', code: 'nosq' },
            { html: 'He forgot to take the square root at the end.', why: 'He did take the square root. Look at which side he treated as the hypotenuse.', code: 'root' },
            { html: 'Nothing — his work is correct.', why: 'His answer is longer than the hypotenuse, which is impossible.', code: 'none' }],
            'Dev put ' + t(sh.c) + ' in the place of a leg. ' + t(sh.c) + ' is the hypotenuse, so it belongs alone as ' + t('c') + ': ' + t(sh.b + '^{2}+b^{2}=' + sh.c + '^{2}') + '.', ['Which side is the hypotenuse? Where did Dev put it?'], 'Dev error ' + sh.c + ',' + sh.b);
        } },
        { id: 'e8b', level: 'PRG', make: function (r, sh) {
          var D = dec(Math.sqrt(sh.b * sh.b + sh.c * sh.c), 1);
          return mcP(r, 'Without calculating, how can you tell his answer of ' + t(D) + '&nbsp;cm is impossible?', [
            { html: 'The hypotenuse is the longest side, so no other side can be longer than ' + t(sh.c) + '&nbsp;cm.', right: true },
            { html: 'A side length can’t have a decimal.', why: 'Side lengths can be decimals (for example ' + t('\\sqrt{2}\\approx 1.4') + '). Compare his answer with the hypotenuse.', code: 'dec' },
            { html: 'The answer must be a perfect square.', why: 'Many side lengths are not whole numbers. The giveaway is that his answer is longer than the hypotenuse.', code: 'sq' },
            { html: 'The missing leg must be shorter than the other leg.', why: 'Either leg can be the longer one. What can never happen is a leg longer than the hypotenuse.', code: 'leg' }],
            'The hypotenuse is always the longest side of a right triangle. ' + t(D) + ' cm is longer than ' + t(sh.c) + ' cm, so it can’t be a leg.', ['Which side of a right triangle is always the longest?'], 'Dev impossible ' + sh.c + ',' + sh.b);
        } },
        { id: 'e8c', sub: 'b (length)', level: 'EMG', make: function (r, sh) { return numPart('Find the correct length of the missing leg.', sh.a, legDiag(sh.c, sh.b), legSol(sh.c, sh.b) + ' cm.', HINT_LEG, 'Dev correct ' + sh.c + ',' + sh.b, 'cm', [Math.round(Math.sqrt(sh.b * sh.b + sh.c * sh.c) * 10) / 10]); } }] },

    /* ---------- Part C ---------- */
    { num: '9', section: 'Part C — Two-Stage and Three-Dimensional Problems', stem: function (sh) { return 'A ' + t(sh.c) + '&nbsp;' + sh.u + ' ladder leans against a vertical wall with its base ' + t(sh.b1) + '&nbsp;' + sh.u + ' from the wall.'; },
      shared: function (r) {
        for (var i = 0; i < 100; i++) {
          var T = r.chance(0.2) ? [5, 12, 13] : r.pick(triples(10, 35)), lo = Math.min(T[0], T[1]), hi = Math.max(T[0], T[1]), c = T[2], b2 = T[2] === 13 && T[0] === 5 && r.chance(0.5) ? 9 : r.int(lo + 1, c - 2);
          var N = c * c - b2 * b2, h2 = Math.sqrt(N);
          if (b2 >= c || isSq(N) || halfway(h2, 1) || halfway(hi - h2, 1) || K.roundTo(hi - K.roundTo(h2, 1), 1) !== K.roundTo(hi - h2, 1)) continue;
          return { c: c, b1: lo, h1: hi, b2: b2, N: N };
        }
        return { c: 13, b1: 5, h1: 12, b2: 9, N: 88 };
      }, parts: [
        { id: 'e9a', level: 'EMG', make: function (r, sh) { return numPart('How high up the wall does the ladder reach?', sh.h1, legDiag(sh.c, sh.b1), legSol(sh.c, sh.b1) + ' ft.', HINT_LEG, 'ladder a ' + sh.c + ',' + sh.b1, 'ft'); } },
        { id: 'e9b', level: 'PRG', make: function (r, sh) {
          return lenFields('The base is pulled out until it is ' + t(sh.b2) + '&nbsp;' + sh.u + ' from the wall. How high does the ladder reach now? Give the exact height as a simplified radical and a decimal to one decimal place.', sh.N, legDiag(sh.c, sh.b2),
            'The ladder is still the hypotenuse, ' + t(sh.c) + ' ft.<br>' + legSol(sh.c, sh.b2, 1) + ' ft.', HINT_LEG, 'ladder b ' + sh.c + ',' + sh.b2, 'ft', 'Height');
        } },
        { id: 'e9c', level: 'ADV', make: function (r, sh) {
          var h2 = Math.sqrt(sh.N), drop = sh.h1 - h2;
          var p = KP.approx('By how much did the top of the ladder drop? Give a decimal to one decimal place.', drop, 1, { after: 'ft', diag: function (v) {
            if (near(v, h2, 0.051)) return { code: 'u6l1-height-first', hint: 'That is the new height. The <b>drop</b> is the old height minus the new height.' };
            if (near(v, sh.b2 - sh.b1, 0.051)) return { code: 'u6l1-one-stage', hint: 'That is how far the base moved. The top doesn’t move the same distance — subtract the two heights from (a) and (b).' };
            if (near(v, sh.h1 + h2, 0.051)) return { code: 'u6l1-height-first', hint: 'Subtract the heights, don’t add them.' };
            return null; } },
            'Old height ' + t(sh.h1) + ' ft, new height ' + t(rt(sh.N) + '\\approx ' + dec(h2, 3)) + ' ft.<br>Drop ' + t('=' + sh.h1 + '-' + rt(sh.N) + '\\approx ' + sh.h1 + '-' + dec(h2, 3) + '=' + dec(drop, 3) + '\\approx ' + dec(drop, 1)) + ' ft.',
            ['The drop is the difference between the heights in (a) and (b).', 'Use the unrounded height from (b) if you can, then round at the end.'], 'ladder drop');
          p.answer = t(dec(drop, 1)) + ' ft'; p.bad = [dec(h2, 1), String(sh.b2 - sh.b1)]; return p;
        } }] },
    { num: '10', stem: function (sh) { return 'A rectangular window has a diagonal of ' + t(sh.c) + '&nbsp;cm and a shorter side of ' + t(sh.s) + '&nbsp;cm.' + figDiv(HW.fig({ pts: { P: [0, 0], Q: [sh.l, 0], R: [sh.l, sh.s], S: [0, sh.s] }, segs: [['P', 'Q'], ['Q', 'R'], ['R', 'S'], ['S', 'P', sh.s + ' cm'], ['P', 'R', sh.c + ' cm', { dash: true }]], right: [['Q', 'P', 'R']], names: false, width: 260, aria: 'rectangle with a diagonal' })); },
      shared: function (r) { if (r.chance(0.2)) return { s: 10, l: 24, c: 26 }; var T = r.pick(triples(10, 65).filter(function (x) { return Math.max(x[0], x[1]) / Math.min(x[0], x[1]) > 1.25; })); return { s: Math.min(T[0], T[1]), l: Math.max(T[0], T[1]), c: T[2] }; }, parts: [
        { id: 'e10a', level: 'EMG', make: function (r, sh) { return numPart('Find the length of the longer side.', sh.l, legDiag(sh.c, sh.s), 'The diagonal splits the window into two right triangles with hypotenuse ' + t(sh.c) + ' cm.<br>' + legSol(sh.c, sh.s) + ' cm.', HINT_LEG, 'window side ' + sh.c + ',' + sh.s, 'cm'); } },
        { id: 'e10b', level: 'PRG', make: function (r, sh) {
          var P = 2 * (sh.l + sh.s);
          return numPart('Find the perimeter of the window.', P, function (v) {
            if (v === sh.l + sh.s) return { code: 'u6l1-tri-area', hint: 'A rectangle has <b>four</b> sides: two of each length.' };
            if (v === 2 * (sh.c + sh.s) || v === sh.c + sh.l + sh.s || v === 2 * sh.c + 2 * sh.s) return { code: 'u6l1-rect-perim', hint: 'The diagonal is inside the window, not around the edge. Use the two side lengths.' };
            if (v === sh.l * sh.s) return { code: 'u6l1-tri-area', hint: 'That is the area. The perimeter is the distance around: add all four sides.' };
            return null;
          }, t('P=2(' + sh.l + ')+2(' + sh.s + ')=' + P) + ' cm.', ['Add all four sides: two long and two short.'], 'window perimeter', 'cm', [sh.l + sh.s, 2 * (sh.c + sh.s)]);
        } },
        { id: 'e10c', level: 'PRG', make: function (r, sh) {
          var A = sh.l * sh.s;
          return numPart('Find the area of the window.', A, function (v) {
            if (v === A / 2) return { code: 'u6l1-tri-area', hint: 'That is the area of one of the triangles. The window is the whole rectangle: length × width.' };
            if (v === sh.c * sh.s || v === sh.c * sh.l) return { code: 'u6l1-rect-perim', hint: 'Use the two <b>sides</b> of the rectangle, not the diagonal.' };
            if (v === 2 * (sh.l + sh.s)) return { code: 'u6l1-tri-area', hint: 'That is the perimeter. The area is length × width.' };
            return null;
          }, t('A=' + sh.l + '\\times ' + sh.s + '=' + A) + ' cm².', ['Area of a rectangle = length × width.'], 'window area', 'cm²', [A / 2]);
        } }] },
    { num: '11', stem: function (sh) { return 'In the figure, ' + t('\\triangle ABC') + ' has a right angle at ' + t('B') + ', and ' + t('\\triangle ACD') + ' has a right angle at ' + t('C') + '. The two triangles share the side ' + t('\\overline{AC}') + '.' + chainFig(sh); },
      shared: function (r) { return r.chance(0.2) ? { ab: 9, bc: 12, ac: 15, cd: 8, ad: 17 } : r.pick(CHAINS); }, parts: [
        { id: 'e11a', level: 'EMG', make: function (r, sh) { return numPart('Use ' + t('\\triangle ABC') + ' to find the length of ' + t('\\overline{AC}') + '.', sh.ac, hypDiag(sh.ab, sh.bc), hypSol(sh.ab, sh.bc), [t('\\overline{AC}') + ' is across from the right angle at ' + t('B') + ', so it is the hypotenuse of ' + t('\\triangle ABC') + '.'], 'AC ' + sh.ab + ',' + sh.bc); } },
        { id: 'e11b', level: 'ADV', make: function (r, sh) {
          var hd = hypDiag(sh.ac, sh.cd);
          return numPart('Use your answer from (a), together with ' + t('\\triangle ACD') + ', to find the length of ' + t('\\overline{AD}') + '.', sh.ad, function (v, tol) {
            if (near(v, Math.sqrt(sh.ab * sh.ab + sh.cd * sh.cd), 0.051) || near(v, Math.sqrt(sh.bc * sh.bc + sh.cd * sh.cd), 0.051)) return { code: 'u6l1-one-stage', hint: 'In ' + t('\\triangle ACD') + ' the legs are ' + t('AC') + ' (from part a) and ' + t('CD') + '.' };
            if (near(v, Math.sqrt(sh.ab * sh.ab + sh.bc * sh.bc + sh.cd * sh.cd), 1e-6)) return null;
            return hd(v, tol);
          }, 'In ' + t('\\triangle ACD') + ' the right angle is at ' + t('C') + ', so ' + t('AC=' + sh.ac) + ' and ' + t('CD=' + sh.cd) + ' are the legs and ' + t('AD') + ' is the hypotenuse:<br>' + t('AD^{2}=' + sh.ac + '^{2}+' + sh.cd + '^{2}=' + sh.ac * sh.ac + '+' + sh.cd * sh.cd + '=' + sh.ad * sh.ad) + ', so ' + t('AD=\\sqrt{' + sh.ad * sh.ad + '}=' + sh.ad) + '.',
            ['Find the right angle of ' + t('\\triangle ACD') + ': the two sides that meet there are its legs.', 'One of those legs is ' + t('AC') + ' from part (a).'], 'AD ' + sh.ac + ',' + sh.cd, null, [sh.ac + sh.cd]);
        } },
        { id: 'e11c', level: 'PRG', make: function (r, sh) {
          var T1 = sortedT(sh.ab, sh.bc, sh.ac), T2 = sortedT(sh.ac, sh.cd, sh.ad), f = function (T) { return t(T.join(',\\ ')); };
          var wrongT2 = sortedT(sh.ab, sh.cd, Math.round(Math.sqrt(sh.ab * sh.ab + sh.cd * sh.cd))), wrongT1 = [T1[0] + 1, T1[1] + 1, T1[2] + 1];
          return mcP(r, 'Both answers turned out to be whole numbers. Which Pythagorean triples were used?', [
            { html: 'Stage one: ' + f(T1) + '; stage two: ' + f(T2), right: true },
            { html: 'Stage one: ' + f(T2) + '; stage two: ' + f(T1), why: 'Stage one is ' + t('\\triangle ABC') + ' (sides ' + t(sh.ab) + ', ' + t(sh.bc) + ', ' + t(sh.ac) + '); stage two is ' + t('\\triangle ACD') + '.', code: 'swap' },
            { html: 'Stage one: ' + f(T1) + '; stage two: ' + f([sh.ab, sh.cd, sh.ad].sort(function (x, y) { return x - y; })), why: t(sh.ab) + ' is not a side of ' + t('\\triangle ACD') + '. Its sides are ' + t('AC') + ', ' + t('CD') + ' and ' + t('AD') + '.', code: 'mix' },
            { html: 'Stage one: ' + f(wrongT1) + '; stage two: ' + f(T2), why: 'Read the sides of ' + t('\\triangle ABC') + ' from the figure and part (a).', code: 'off' }],
            'Stage one (' + t('\\triangle ABC') + '): ' + tripleName(T1) + '.<br>Stage two (' + t('\\triangle ACD') + '): ' + tripleName(T2) + '.', ['Each triangle’s triple is its three side lengths.'], 'chain triples ' + T1.join(',') + '/' + T2.join(','));
        } }] },
    { num: '12', stem: 'The longest straight rod that fits inside a rectangular box runs from one bottom corner to the opposite top corner (the <b>space diagonal</b> ' + t('D') + '). Finding it takes the theorem <b>twice</b>: first across the <b>base</b> of the box to get the base diagonal ' + t('d') + ', then up the <b>height</b>, using ' + t('d') + ' as a leg.' + boxFig(), parts: [
      { id: 'e12a', level: 'ADV', make: function (r) {
        var B, h, i = 0;
        do { B = r.pick(triples(5, 15)); h = r.int(3, 15); i++; } while ((isSq(B[2] * B[2] + h * h) || halfway(Math.sqrt(B[2] * B[2] + h * h), 1)) && i < 100);
        if (r.chance(0.2)) { B = [6, 8, 10]; h = 10; }
        var o = sw(r, B), d = B[2], N = d * d + h * h;
        var p = KP.fields('A box ' + t(o[0]) + '&nbsp;cm long, ' + t(o[1]) + '&nbsp;cm wide and ' + t(h) + '&nbsp;cm tall. Find the base diagonal ' + t('d') + ', then the space diagonal ' + t('D') + ' (exact simplified radical and a decimal to one decimal place).',
          [numField(t('d='), 'd', 'cm'), radField(t('D') + ' (exact) =', 'D exact', 'cm'), decField(t('D\\approx'), 'D to one decimal place', 'cm')],
          [K.number(d, function (v) { var g = hypDiag(o[0], o[1])(v, 1e-6); return g; }),
            exactChk(N, function (v, tol) {
              if (near(v, d, tol)) return { code: 'u6l1-base-diag', hint: 'That is the base diagonal. The space diagonal goes up the height too: ' + t('D^{2}=d^{2}+h^{2}') + '.' };
              if (near(v, o[0] + o[1] + h, tol)) return { code: 'u6l1-three-edges', hint: 'Use the theorem twice instead of adding the edges.' };
              if (near(v, Math.sqrt(o[0] * o[0] + h * h), tol) || near(v, Math.sqrt(o[1] * o[1] + h * h), tol)) return { code: 'u6l1-one-stage', hint: 'The legs of the second triangle are the <b>base diagonal</b> ' + t('d') + ' and the height.' };
              return hypDiag(d, h)(v, tol); }),
            approxChk(N, 1, function (v, tol) { if (near(v, d, tol)) return { code: 'u6l1-base-diag', hint: 'That is the base diagonal, not the space diagonal.' }; return hypDiag(d, h)(v, tol); })],
          [String(d), rt(N), dec(Math.sqrt(N), 1)], t('d=' + d) + ' cm, ' + t('D=' + rt(N) + '\\approx ' + dec(Math.sqrt(N), 1)) + ' cm',
          'Stage one (base): ' + t('d=\\sqrt{' + o[0] + '^{2}+' + o[1] + '^{2}}=\\sqrt{' + o[0] * o[0] + '+' + o[1] * o[1] + '}=\\sqrt{' + d * d + '}=' + d) + ' cm.<br>Stage two (up the height): ' + t('D=\\sqrt{' + d + '^{2}+' + h + '^{2}}=\\sqrt{' + d * d + '+' + h * h + '}=' + rtSteps(N) + '\\approx ' + dec(Math.sqrt(N), 1)) + ' cm.',
          ['Stage one: length and width are the legs of the base triangle.', 'Stage two: the base diagonal ' + t('d') + ' and the height are the legs of the second triangle.'], 'space diag a ' + o.join(',') + ',' + h);
        p.bad = [[String(d), String(d), String(d)], [String(o[0] + o[1]), String(o[0] + o[1] + h), String(o[0] + o[1] + h)]]; return p;
      } },
      { id: 'e12b', level: 'MAS', make: function (r) {
        var b = r.chance(0.2) ? [4, 4, 7] : r.pick(BOXB), o = sw(r, [b[0], b[1]]), h = b[2], d2 = o[0] * o[0] + o[1] * o[1], D = Math.sqrt(d2 + h * h), dr = K.roundTo(Math.sqrt(d2), 1);
        var p = KP.fields('A box ' + t(o[0]) + '&nbsp;in long, ' + t(o[1]) + '&nbsp;in wide and ' + t(h) + '&nbsp;in tall. Find the base diagonal ' + t('d') + ' as an exact simplified radical, then the space diagonal ' + t('D') + '. (The base diagonal is <b>not</b> a whole number — keep ' + t('d^{2}') + ' rather than a rounded ' + t('d') + ' in the second stage.)',
          [radField(t('d') + ' (exact) =', 'd exact', 'in'), radField(t('D='), 'D', 'in')],
          [exactChk(d2, hypDiag(o[0], o[1])),
            exactChk(D * D, function (v, tol) {
              if (near(v, Math.sqrt(dr * dr + h * h), 0.005) && !near(Math.sqrt(dr * dr + h * h), D, 1e-6)) return { code: 'u6l1-d-rounded', hint: 'Rounding ' + t('d') + ' first gives an answer that is slightly off. Use the exact ' + t('d^{2}=' + d2) + ' in stage two: ' + t('D^{2}=' + d2 + '+' + h + '^{2}') + '.' };
              if (near(v, Math.sqrt(d2), tol)) return { code: 'u6l1-base-diag', hint: 'That is the base diagonal. Now go up the height: ' + t('D^{2}=d^{2}+h^{2}') + '.' };
              if (near(v, o[0] + o[1] + h, tol)) return { code: 'u6l1-three-edges', hint: 'Use the theorem twice instead of adding the edges.' };
              if (near(v, Math.sqrt(o[0] * o[0] + h * h), tol) || near(v, Math.sqrt(o[1] * o[1] + h * h), tol)) return { code: 'u6l1-one-stage', hint: 'The legs of the second triangle are the base diagonal ' + t('d') + ' and the height.' };
              if (near(v, d2 + h * h, tol)) return { code: 'no-root', hint: t(d2 + '+' + h * h + '=' + (d2 + h * h)) + ' is ' + t('D^{2}') + '. Take the square root.' };
              return null; })],
          [rt(d2), String(D)], t('d=' + rt(d2)) + ' in (so ' + t('d^{2}=' + d2) + '), ' + t('D=' + D) + ' in exactly',
          'Stage one: ' + t('d=\\sqrt{' + o[0] + '^{2}+' + o[1] + '^{2}}=' + rtSteps(d2)) + ' in, so ' + t('d^{2}=' + d2) + '.<br>Stage two: ' + t('D=\\sqrt{d^{2}+' + h + '^{2}}=\\sqrt{' + d2 + '+' + h * h + '}=\\sqrt{' + (d2 + h * h) + '}=' + D) + ' in — a whole number, because ' + t('d^{2}') + ' was used exactly.',
          ['You don’t need ' + t('d') + ' itself in stage two — only ' + t('d^{2}') + ', which is a whole number.', t('D^{2}=d^{2}+h^{2}') + '.'], 'space diag b ' + o.join(',') + ',' + h);
        p.good = [[rtPlain(d2), String(D)]];
        p.bad = [[dec(Math.sqrt(d2), 1), String(D + 1)], [rt(d2), dec(Math.sqrt(dr * dr + h * h), 2)]].filter(function (b) { return Math.abs(Number(b[1]) - D) > 1e-9; }); return p;
      } }] },
    { num: '13', stem: '<b>Reasoning.</b> Can a right triangle have two sides of equal length?', shared: function (r) { return r.chance(0.2) ? { s: 6, u: 'cm' } : { s: r.int(3, 15), u: r.pick(['cm', 'm', 'in']) }; }, parts: [
      { id: 'e13a', level: 'EMG', make: function (r, sh) { var s = sh.s; return lenFields('Suppose the two <b>legs</b> are both ' + t(s) + '&nbsp;' + sh.u + '. Find the hypotenuse exactly and as a decimal to one decimal place.', 2 * s * s, hypDiag(s, s), hypSol(s, s, 1) + ' ' + sh.u + '. So yes — the two <b>legs</b> may be equal.', HINT_HYP, 'equal legs ' + s, sh.u); } },
      { id: 'e13b', level: 'PRG', make: function (r, sh) {
        var s = sh.s;
        return mcP(r, 'Suppose instead a leg equals the hypotenuse, both ' + t(s) + '&nbsp;' + sh.u + '. What would the other leg have to be?', [
          { html: t('0') + ' — since ' + t('a^{2}+' + s + '^{2}=' + s + '^{2}') + ' gives ' + t('a=0') + '. That is not a triangle: the hypotenuse is always longer than either leg.', right: true },
          { html: t(s) + ' — the triangle would have three equal sides.', why: 'Test it: ' + t(s + '^{2}+' + s + '^{2}=' + 2 * s * s) + ', not ' + t(s + '^{2}=' + s * s) + '.', code: 'equi' },
          { html: t(rt(2 * s * s)) + ' — the same as part (a).', why: 'In part (a) the hypotenuse was missing. Here the hypotenuse is ' + t(s) + ', so the other leg needs ' + t('a^{2}=' + s + '^{2}-' + s + '^{2}') + '.', code: 'same' },
          { html: 'Any length works, as long as it is shorter than ' + t(s) + '.', why: 'Solve ' + t('a^{2}+' + s + '^{2}=' + s + '^{2}') + ': only one value of ' + t('a') + ' fits.', code: 'any' }],
          t('a^{2}+' + s + '^{2}=' + s + '^{2}') + ' means ' + t('a^{2}=0') + ', so ' + t('a=0') + ' — no triangle at all. The hypotenuse is always the longest side, so it can never equal a leg.', ['Put the numbers into ' + t('a^{2}+b^{2}=c^{2}') + ' with ' + t('b=c=' + s) + '.'], 'leg = hyp ' + s);
      } }] },
    { num: '14', stem: function (sh) { return '<b>Reasoning.</b> A right triangle has legs ' + t('a') + ' and ' + t('b') + ' and hypotenuse ' + t('c') + '.'; }, shared: function (r) { var T = r.chance(0.2) ? [3, 4, 5] : r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [6, 8, 10]]); return { T: T, k: r.chance(0.6) ? 2 : r.pick([3, 4, 10]) }; }, parts: [
      { id: 'e14a', level: 'PRG', make: function (r, sh) {
        var w = { 2: 'doubled', 3: 'tripled', 4: 'multiplied by 4', 10: 'multiplied by 10' }[sh.k], k = sh.k;
        return mcP(r, 'If both legs are ' + w + ', what happens to the hypotenuse? (Think of a triangle with legs ' + legsTex(sh.T[0], sh.T[1]) + '.)', [
          { html: 'It is ' + w + ' too.', right: true },
          { html: 'It is multiplied by ' + t(k * k) + '.', why: 'The <b>squares</b> are multiplied by ' + t(k * k) + ', but the hypotenuse is the square root: ' + t('\\sqrt{' + k * k + '}=' + k) + '.', code: 'sq' },
          { html: 'It grows by ' + t(k) + ' units.', why: 'Test it: legs ' + t(sh.T[0] + ',' + sh.T[1]) + ' give ' + t(sh.T[2]) + '; legs ' + t(k * sh.T[0] + ',' + k * sh.T[1]) + ' give ' + t(k * sh.T[2]) + '.', code: 'add' },
          { html: 'It stays the same.', why: 'Longer legs give a longer hypotenuse. Test it with legs ' + t(sh.T[0]) + ' and ' + t(sh.T[1]) + '.', code: 'same' }],
          t('\\sqrt{(' + k + 'a)^{2}+(' + k + 'b)^{2}}=\\sqrt{' + k * k + '(a^{2}+b^{2})}=' + k + '\\sqrt{a^{2}+b^{2}}=' + k + 'c') + ': the hypotenuse is ' + w + '. Check: legs ' + t(sh.T[0] + ',\\ ' + sh.T[1]) + ' give ' + t(sh.T[2]) + ', and legs ' + t(k * sh.T[0] + ',\\ ' + k * sh.T[1]) + ' give ' + t(k * sh.T[2]) + '.',
          ['Try it with real numbers: legs ' + t(sh.T[0]) + ' and ' + t(sh.T[1]) + ' first, then the bigger legs.'], 'scale legs ' + k + ' ' + sh.T.join(','));
      } },
      { id: 'e14b', sub: 'a (test)', level: 'EMG', make: function (r, sh) { var k = sh.k, a = k * sh.T[0], b = k * sh.T[1]; return numPart('Test your answer: legs ' + legsTex(sh.T[0], sh.T[1]) + ' give a hypotenuse of ' + t(sh.T[2]) + '. With legs ' + legsTex(a, b) + ', the hypotenuse is:', k * sh.T[2], hypDiag(a, b), hypSol(a, b) + ' That is ' + t(k + '\\times ' + sh.T[2]) + '.', HINT_HYP, 'test scale ' + a + ',' + b, null, [sh.T[2] + k, k * k * sh.T[2]]); } },
      { id: 'e14c', sub: 'b', level: 'PRG', make: function (r, sh) {
        var a = sh.T[0], b = sh.T[1], c = sh.T[2];
        return mcP(r, 'Why must ' + t('c') + ' always be less than ' + t('a+b') + ', no matter what the legs are? (For example, legs ' + legsTex(a, b) + ' give ' + t('c=' + c) + ', less than ' + t(a + '+' + b + '=' + (a + b)) + '.)', [
          { html: 'The straight path along the hypotenuse is shorter than going around the two legs; in squares, ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + ' is bigger than ' + t('c^{2}=a^{2}+b^{2}') + ' by ' + t('2ab') + '.', right: true },
          { html: 'Because ' + t('c') + ' is the shortest side.', why: t('c') + ' is the <b>longest</b> side — but still shorter than the two legs put together.', code: 'short' },
          { html: 'It isn’t always true: for some right triangles ' + t('c=a+b') + '.', why: 'Try any example: legs ' + t(a) + ' and ' + t(b) + ' give ' + t('c=' + c) + ', while ' + t('a+b=' + (a + b)) + '.', code: 'false' },
          { html: 'Because ' + t('c^{2}') + ' is less than ' + t('a^{2}') + '.', why: t('c^{2}=a^{2}+b^{2}') + ' is <b>more</b> than ' + t('a^{2}') + '.', code: 'sq' }],
          'Going straight from one end of the hypotenuse to the other is shorter than walking along both legs. Algebraically, ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}=c^{2}+2ab') + ', which is larger than ' + t('c^{2}') + ', so ' + t('a+b>c') + '. (Example: ' + t(a + '+' + b + '=' + (a + b) + '>' + c) + '.)', ['Think of walking: the straight path or the path around the corner — which is shorter?'], 'c < a+b');
      } }] },

    /* ---------- Part D ---------- */
    { num: '15', section: 'Part D — Applications', stem: 'Round every final answer to <b>one decimal place</b> unless it is exact. You may give an exact radical instead.', parts: [
      { id: 'e15', level: 'EMG', make: function (r) {
        var L = r.chance(0.2) ? [2, 7] : r.pick(legPairs(1, 12, function (N, a, b) { return a <= 3 && b >= 5 && !isSq(N) && !halfway(Math.sqrt(N), 1); })), u = 'm', N = L[0] * L[0] + L[1] * L[1];
        return eitherPart('A wheelchair ramp rises ' + t(L[0]) + '&nbsp;m vertically over a horizontal run of ' + t(L[1]) + '&nbsp;m. How long is the sloped surface of the ramp?', N, 1, hypDiag(L[0], L[1]),
          'The rise and the run are the legs; the sloped surface is the hypotenuse.<br>' + hypSol(L[0], L[1], 1) + ' m.', ['Sketch the ramp: rise, run and the sloped surface form a right triangle.', HINT_HYP[1]], 'ramp ' + L.join(','), u, [String(L[0] + L[1])]);
      } }] },
    { num: '16', stem: 'Round to one decimal place unless the answer is exact.', parts: [
      { id: 'e16', level: 'PRG', make: function (r) {
        var P = r.chance(0.2) ? [20, 9] : r.pick(legHyp(12, 30, function (N, c, b) { return b >= 5 && b <= c / 2 && !isSq(N) && !halfway(Math.sqrt(N), 1); })), N = P[0] * P[0] - P[1] * P[1];
        return eitherPart('A guy wire ' + t(P[0]) + '&nbsp;m long runs from the top of a straight vertical radio mast to an anchor in the ground ' + t(P[1]) + '&nbsp;m from the base of the mast. How tall is the mast?', N, 1, legDiag(P[0], P[1]),
          'The wire is the hypotenuse (across from the right angle at the base of the mast); the ground distance is a leg.<br>' + legSol(P[0], P[1], 1) + ' m.', ['Which side of the right triangle is the wire?', HINT_LEG[0]], 'mast ' + P.join(','), 'm', [String(Math.round(Math.sqrt(P[0] * P[0] + P[1] * P[1]) * 10) / 10)]);
      } }] },
    { num: '17', stem: '', parts: [
      { id: 'e17', level: 'PRG', make: function (r) {
        var s = r.chance(0.2) ? 27 : r.pick([15, 16, 18, 20, 21, 23, 25, 27, 28]), sport = s >= 25 ? 'softball diamond' : r.pick(['softball diamond', 'square courtyard', 'square garden']);
        return lenFields('A ' + sport + ' is a square with sides of ' + t(s) + '&nbsp;m. ' + (sport === 'softball diamond' ? 'The catcher at home plate throws straight across the diamond to second base. How far is that throw?' : 'A path runs straight across it from one corner to the opposite corner. How long is the path?') + ' Give the exact distance as a simplified radical and a decimal to one decimal place.', 2 * s * s, hypDiag(s, s),
          'The diagonal of the square is the hypotenuse of a right triangle whose legs are two sides of the square.<br>' + hypSol(s, s, 1) + ' m.', ['Two sides of the square meet at a right angle; the diagonal is the hypotenuse.', HINT_HYP[1]], 'diamond ' + s, 'm', 'Distance');
      } }] },
    { num: '18', stem: '', parts: [
      { id: 'e18', level: 'PRG', make: function (r) {
        var D = r.chance(0.2) ? [32, 18] : r.pick([[32, 18], [40, 22], [48, 27], [24, 14], [28, 16], [44, 25], [36, 20], [52, 29], [56, 32], [20, 11], [60, 34], [64, 36], [30, 17], [42, 24], [46, 26], [50, 28], [38, 21], [26, 15], [34, 19], [54, 30], [58, 33], [62, 35], [70, 39], [22, 12], [66, 37], [72, 41]].filter(function (q) { return !halfway(Math.hypot(q[0], q[1]), 1); })), N = D[0] * D[0] + D[1] * D[1];
        return eitherPart('Television screens are advertised by the length of their diagonal. A screen measures ' + t(D[0]) + '&nbsp;inches across and ' + t(D[1]) + '&nbsp;inches high. What size would this television be advertised as, to one decimal place?', N, 1, hypDiag(D[0], D[1]),
          'The width and height are the legs and the diagonal is the hypotenuse.<br>' + hypSol(D[0], D[1], 1) + ' inches.', ['The diagonal is the hypotenuse of a right triangle with the width and height as legs.'], 'TV ' + D.join(','), 'inches', [String(D[0] + D[1])]);
      } }] },
    { num: '19', stem: function (sh) { return '<b>Stretch.</b> A shipping crate measures ' + t(sh.c[0]) + '&nbsp;ft by ' + t(sh.c[1]) + '&nbsp;ft by ' + t(sh.c[2]) + '&nbsp;ft (the ' + t(sh.c[0]) + ' by ' + t(sh.c[1]) + ' face is the base).'; },
      shared: function (r) { var c = r.chance(0.2) ? [3, 4, 12, 5, 13] : r.pick(CRATES), o = sw(r, [c[0], c[1]]); var Dd = c[4], rod = r.pick([Dd + 0.5, Dd + 1.5, Dd - 0.5, Dd - 1.5]); if (c[0] === 3 && c[2] === 12 && r.chance(0.5)) rod = 13.5; if (rod <= Math.max(c[0], c[1], c[2])) rod = Dd + 0.5; return { c: [o[0], o[1], c[2], c[3], c[4]], rod: rod }; }, parts: [
        { id: 'e19a', level: 'EMG', make: function (r, sh) { var a = sh.c[0], b = sh.c[1]; return numPart('Find the diagonal of the ' + t(a) + '&nbsp;ft by ' + t(b) + '&nbsp;ft base.', sh.c[3], hypDiag(a, b), hypSol(a, b) + ' ft.', HINT_HYP, 'crate base ' + a + ',' + b, 'ft', [a + b]); } },
        { id: 'e19b', level: 'ADV', make: function (r, sh) {
          var d = sh.c[3], h = sh.c[2], hd = hypDiag(d, h);
          return numPart('Find the space diagonal of the crate.', sh.c[4], function (v, tol) {
            if (near(v, d, tol)) return { code: 'u6l1-base-diag', hint: 'That is the base diagonal from (a). Now use it with the height: ' + t('D^{2}=d^{2}+h^{2}') + '.' };
            if (near(v, sh.c[0] + sh.c[1] + h, tol)) return { code: 'u6l1-three-edges', hint: 'Use the theorem twice instead of adding the edges.' };
            if (near(v, Math.sqrt(sh.c[0] * sh.c[0] + h * h), tol) || near(v, Math.sqrt(sh.c[1] * sh.c[1] + h * h), tol)) return { code: 'u6l1-one-stage', hint: 'The legs of the second triangle are the base diagonal from (a) and the height.' };
            return hd(v, tol);
          }, 'The base diagonal ' + t('d=' + d) + ' ft and the height ' + t(h) + ' ft are the legs:<br>' + t('D=\\sqrt{' + d + '^{2}+' + h + '^{2}}=\\sqrt{' + d * d + '+' + h * h + '}=\\sqrt{' + sh.c[4] * sh.c[4] + '}=' + sh.c[4]) + ' ft.',
            ['Use the base diagonal from (a) as one leg and the height as the other.'], 'crate space ' + sh.c.join(','), 'ft', [d, d + h]);
        } },
        { id: 'e19c', level: 'PRG', make: function (r, sh) {
          var D = sh.c[4], rod = sh.rod, fits = rod <= D, edge = Math.max(sh.c[0], sh.c[1], sh.c[2]), R = t(F(rod));
          var opts = fits ? [
            { html: '<b>Yes</b> — the longest rod that fits is the space diagonal, ' + t(D) + '&nbsp;ft, and ' + t(F(rod) + '<' + D) + '.', right: true },
            { html: '<b>No</b> — ' + R + '&nbsp;ft is longer than the longest edge, ' + t(edge) + '&nbsp;ft.', why: 'A rod can lie along the space diagonal, which is longer than any edge: ' + t(D) + ' ft.', code: 'edge' },
            { html: '<b>No</b> — ' + R + '&nbsp;ft is longer than the base diagonal, ' + t(sh.c[3]) + '&nbsp;ft.', why: 'The rod can tilt up from a bottom corner to the opposite top corner: that space diagonal is ' + t(D) + ' ft.', code: 'base' },
            { html: '<b>Yes</b> — ' + R + '&nbsp;ft is less than ' + t(sh.c[0] + '+' + sh.c[1] + '+' + sh.c[2] + '=' + (sh.c[0] + sh.c[1] + sh.c[2])) + '&nbsp;ft.', why: 'Right answer, wrong reason: a straight rod can’t bend along three edges. Compare it with the space diagonal.', code: 'sum' }] : [
            { html: '<b>No</b> — the longest rod that fits is the space diagonal, ' + t(D) + '&nbsp;ft, and ' + t(F(rod) + '>' + D) + '.', right: true },
            { html: '<b>Yes</b> — ' + R + '&nbsp;ft is less than ' + t(sh.c[0] + '+' + sh.c[1] + '+' + sh.c[2] + '=' + (sh.c[0] + sh.c[1] + sh.c[2])) + '&nbsp;ft.', why: 'A straight rod can’t bend along three edges. The longest straight line inside is the space diagonal, ' + t(D) + ' ft.', code: 'sum' },
            { html: '<b>Yes</b> — it fits if it is tilted from corner to corner.', why: 'Tilted corner to corner is the space diagonal, ' + t(D) + ' ft — still shorter than the rod.', code: 'tilt' },
            { html: '<b>No</b> — no rod longer than the longest edge, ' + t(edge) + '&nbsp;ft, can fit.', why: 'Right answer, wrong reason: a rod up to ' + t(D) + ' ft fits along the space diagonal.', code: 'edge' }];
          return mcP(r, 'A metal rod ' + R + '&nbsp;ft long must be shipped. Will it fit inside the crate?', opts, 'The longest straight object that fits inside the crate is the space diagonal, ' + t(D) + ' ft. ' + (fits ? t(F(rod) + '<' + D) + ', so the rod fits.' : t(F(rod) + '>' + D) + ', so the rod is too long by ' + t(F(Math.round((rod - D) * 10) / 10)) + ' ft.'), ['Compare the rod with your answer to (b).'], 'rod ' + rod + ' in ' + D);
        } }] }
  ];

  /* Q7 helpers: c = [which named triple, multiplier] */
  function scaleHyp(r, c) {
    var T = NAMED[c[0]], k = c[1], a = T[0] * k, b = T[1] * k, h = T[2] * k, o = r.chance(0.5) ? [a, b] : [b, a], hd = hypDiag(o[0], o[1]);
    return numPart('Legs ' + legsTex(o[0], o[1]) + '; find the hypotenuse.', h, function (v, tol) {
      if (v === T[2]) return { code: 'u6l1-unscaled', hint: t(T[2]) + ' is the hypotenuse of the basic triple ' + t(T.join(',\\ ')) + '. Multiply it by ' + t(k) + ' too.' };
      if (v === T[2] * k * k || v === T[2] + k) return { code: 'u6l1-multiplier', hint: 'The legs are ' + t(k) + ' times ' + t(T[0]) + ' and ' + t(T[1]) + ', so the hypotenuse is ' + t(k) + ' times ' + t(T[2]) + '.' };
      return hd(v, tol);
    }, t(o[0] + ',\\ ' + o[1]) + ' is ' + t(k) + ' times ' + t(T[0] + ',\\ ' + T[1]) + ' (from ' + t(T.join(',\\ ')) + '). So the hypotenuse is ' + t(k + '\\times ' + T[2] + '=' + h) + '.',
      ['Divide both legs by the same number: which basic triple do you get?', 'Multiply the third member of that triple by the same number.'], 'scale hyp ' + o.join(','), null, [T[2], a + b]);
  }
  function scaleLeg(r, c) {
    var T = NAMED[c[0]], k = c[1], which = c[2], known = T[which] * k, ans = T[1 - which] * k, h = T[2] * k, ld = legDiag(h, known);
    return numPart('Hypotenuse ' + t(h) + ', one leg ' + t(known) + '; find the other leg.', ans, function (v, tol) {
      if (v === T[1 - which]) return { code: 'u6l1-unscaled', hint: t(T[1 - which]) + ' is the leg of the basic triple ' + t(T.join(',\\ ')) + '. Multiply it by ' + t(k) + ' too.' };
      if (v === T[2] * k * k || v === h + known) return { code: 'u6l1-scale-other', hint: 'The missing side is a <b>leg</b>, shorter than ' + t(h) + '.' };
      return ld(v, tol);
    }, t(h + '=' + k + '\\times ' + T[2]) + ' and ' + t(known + '=' + k + '\\times ' + T[which]) + ', so this is ' + t(T.join(',\\ ')) + ' times ' + t(k) + '. The other leg is ' + t(k + '\\times ' + T[1 - which] + '=' + ans) + '.',
      ['Divide the hypotenuse and the leg by the same number: which basic triple appears?', 'Scale the missing member of that triple.'], 'scale leg ' + h + ',' + known, null, [T[1 - which], h - known]);
  }

  HW.defineLesson({
    id: 'u6l1', unit: 6, num: '1', title: 'Review: The Pythagorean Theorem', outcome: 'RF3',
    blurb: 'Naming the sides of a right triangle, then finding a missing hypotenuse or leg.',
    questions: Q, extra: X
  });
})(window);
