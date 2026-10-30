/* Math 15 · Unit 6 · Lesson 8 — Determining Collinearity Using Slope (RF3)
 * Assignment 8 (u6_L08.tex, Questions 1–16) and the Lesson 8 Extra Practice (u6_EP08.tex, Questions 1–16).
 * Every part is a generator: same structure and idea as the booklet question (signs, which coordinate is unknown, near
 * misses, how big the numbers are); the booklet's own points are among the possible versions (the generators fall back
 * to them). Model: Math 10C u6l3.js (collinear points, slope fields, find k, "is D on segment AC").
 * Conversions: "determine whether … collinear" -> the two slopes in a fields box, then the verdict as multiple choice
 * (several sets: one verdict table); "explain" -> multiple choice whose options are reasons; "find every collinear
 * triple" -> tap the triples; "give three points where …" -> three ordered-pair boxes, any correct example accepted.
 * Slopes accept equivalent fractions (6/4 = 3/2 = 1.5) and "undefined"; Extra Practice Part A asks for lowest terms
 * (a nudge, not a wrong answer).
 * Changed from the booklet: Extra 10(a) rounds to one decimal place (not three) with points chosen so the rounded
 * distances DO appear to add up — with the booklet's points and three decimals the two methods don't seem to disagree.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 16(c) (every k for (0, 0), (k, a), (b, k)). */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, Ln = HW.lines;

  HW.addCodes({
    'double-neg': 'Double negative slip in the slope formula', 'k-sign': 'Sign slip solving for k', 'k-no-start': 'Forgot the starting coordinate',
    'k-flip': 'Used run over rise when solving for k', 'mid-sub': 'Subtracted coordinates for a midpoint', 'mid-half': 'Didn’t halve the sums (midpoint)',
    'len-no-root': 'Forgot the square root', 'sum-sq': 'Added instead of squaring', 'sel-none': 'Picked a set that isn’t collinear', 'sel-missing': 'Missed a set',
    'sol-missing': 'Missed a solution', 'sol-extra': 'Extra solution', 'sol-sign': 'Solutions with the wrong sign',
    'u6l8-slope-once': 'Added the slope once instead of the whole rise', 'u6l8-not-collinear': 'Example points not collinear',
    'u6l8-middle': 'Example: the middle-listed point is between the others', 'u6l8-same-point': 'Example: two points the same',
    'u6l8-rate-units': 'Rate of change with the units the wrong way round', 'u6l8-predict-start': 'Prediction started from the wrong data point',
    'u6l8-predict-mass': 'Predicted the stretch only, not the length'
  });
  HW.addPartial({ 'u6l8-slope-once': 'n', 'u6l8-not-collinear': 'n', 'u6l8-middle': 'b', 'u6l8-same-point': 'n', 'u6l8-rate-units': 'b',
    'u6l8-predict-start': 'b', 'u6l8-predict-mass': 'b', 'mid-sub': 'n', 'sel-none': 'n' });

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
  function len(A, P) { return Math.sqrt(d2(A, P)); }
  function col3(A, P, C) { return (P[0] - A[0]) * (C[1] - A[1]) - (P[1] - A[1]) * (C[0] - A[0]) === 0; }
  function pick3(r, arr) { return r.shuffle(arr).slice(0, 3); }

  /* slopes as [p, q] (lowest terms, q > 0), null = undefined */
  function slopeOf(A, P) { var dx = P[0] - A[0], dy = P[1] - A[1]; return dx === 0 ? null : red(dy, dx); }
  function sT(s) { return s == null ? '\\text{undefined}' : frT(s[0], s[1]); }
  function sV(s) { return s == null ? null : s[0] / s[1]; }
  function sEq(a, b) { if (a == null || b == null) return a == null && b == null; return a[0] * b[1] === a[1] * b[0]; }
  function nice(s, maxD, maxN) { return s && s[0] !== 0 && s[1] <= (maxD || 6) && Math.abs(s[0]) <= (maxN || 8); }
  function calc(A, P, nm) {   // m_{AB} = (yB − yA)/(xB − xA) = dy/dx = reduced
    var dy = P[1] - A[1], dx = P[0] - A[0];
    var s = (nm ? 'm_{' + nm + '}=' : '') + '\\frac{' + nT(P[1]) + '-' + nb(A[1]) + '}{' + nT(P[0]) + '-' + nb(A[0]) + '}=\\frac{' + nT(dy) + '}{' + nT(dx) + '}';
    if (dx === 0) return s + ',\\ \\text{undefined}';
    var f = sT(red(dy, dx)); return f === '\\frac{' + dy + '}{' + dx + '}' ? s : s + '=' + f;
  }
  var SLOPE_HINT = 'Slope ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + ' — subtract in the <b>same order</b> on the top and the bottom.';
  var NEG_HINT = 'Careful with negatives: subtracting a negative means adding, e.g. ' + t('3-(-2)=3+2=5') + '.';

  /* ---------------- checkers ---------------- */
  function dnDiag(A, P) {   // the double-negative slips for the slope of AP
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
  function slopeAns(prompt, s, chk, sol, hints, text, before) {
    var p = B.math(prompt, chk || slopeChk(s), sT(s), sol, hints, text, { keys: 'slope', before: before || t('m='), placeholder: 'e.g. -2/3' });
    var bad = [];
    if (s && s[0] !== 0) { bad.push(sT([-s[0], s[1]])); if (Math.abs(s[0]) !== s[1]) bad.push(sT(red(s[1], s[0]))); } else if (s) bad.push('\\text{undefined}'); else bad.push('0');
    p.bad = bad.filter(function (b) { return b !== sT(s); }); return p;
  }
  /* items: [{ nm, A, B }] — the slope of each segment AB, with the double-negative diagnosis */
  function slopeFields(prompt, items, sol, hints, text, lowest) {
    items.forEach(function (it) { it.s = slopeOf(it.A, it.B); });
    var fields = items.map(function (it) { return { label: t('m_{' + it.nm + '}='), mode: 'math', keys: 'slope', placeholder: 'e.g. -2/3' }; });
    var p = B.fields(prompt, fields, items.map(function (it) { return slopeChk(it.s, dnDiag(it.A, it.B), lowest); }), items.map(function (it) { return sT(it.s); }),
      t(items.map(function (it) { return 'm_{' + it.nm + '}=' + sT(it.s); }).join(',\\quad ')), sol || items.map(function (it) { return t(calc(it.A, it.B, it.nm)); }).join('<br>'), hints || [SLOPE_HINT], text);
    p.bad = [items.map(function (it) { return it.s && it.s[0] ? sT([-it.s[0], it.s[1]]) : '5'; })];
    if (items.some(function (it) { return it.s && it.s[0] && Math.abs(it.s[0]) !== it.s[1]; })) p.bad.push(items.map(function (it) { return it.s && it.s[0] ? sT(red(it.s[1], it.s[0])) : '7'; }));
    return p;
  }
  /* a number answer with known wrong values: list = [[value, code, hint], …]; "k = 5" is read as 5 */
  function dg(list, target) {
    return function (v) { for (var i = 0; i < list.length; i++) if (list[i][0] != null && isFinite(list[i][0]) && !near(list[i][0], target) && near(v, list[i][0])) return { code: list[i][1], hint: list[i][2] }; return null; };
  }
  function stripVar(chk) { return function (resp) { return chk(String(resp == null ? '' : resp).replace(/^\s*[a-zA-Z](_\{?\w+\}?)?\s*=\s*/, '')); }; }
  function numAns(prompt, val, list, sol, hints, text, before, after) {   // val number or [p, q]
    var fr = Array.isArray(val) ? red(val[0], val[1]) : [val, 1], tv = fr[0] / fr[1];
    var p = fr[1] === 1 ? B.number(prompt, fr[0], dg(list, tv), sol, hints, text, { before: before, after: after }) : B.fraction(prompt, fr, { diag: dg(list, tv), before: before, decimalOk: true }, sol, hints, text);
    p.check = stripVar(p.check);
    p.bad = list.filter(function (x) { return x[0] != null && isFinite(x[0]) && !near(x[0], tv); }).slice(0, 3).map(function (x) { var f = Ln.toFr(x[0]); return fr[1] === 1 ? String(cl(x[0])) : frT(f[0], f[1]); });
    if (fr[1] === 1) p.good = ['k=' + fr[0]];
    return p;
  }
  /* one ordered pair; list = [[[x, y], code, hint], …] */
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
  function ptField(lab) { return { label: t(lab + '='), mode: 'math', keys: 'pairs', placeholder: 'e.g. (3, -2)' }; }
  function midOf(P, Q) { return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; }
  function midChk(P, Q) {
    var M = midOf(P, Q);
    return ptChk(M, [[[P[0] + Q[0], P[1] + Q[1]], 'mid-half', 'You added the coordinates — now divide each sum by ' + t('2') + '.'],
      [[(Q[0] - P[0]) / 2, (Q[1] - P[1]) / 2], 'mid-sub', 'For a midpoint, <b>add</b> the coordinates, then halve: ' + t('\\left(\\frac{x_1+x_2}{2},\\ \\frac{y_1+y_2}{2}\\right)') + '.'],
      [[(P[0] - Q[0]) / 2, (P[1] - Q[1]) / 2], 'mid-sub', 'For a midpoint, <b>add</b> the coordinates, then halve.']]);
  }

  /* ---------------- the verdict (multiple choice with reasons) ----------------
   * o: { names: ['X','Y','Z'], s1, s2, yes, no (option wording), what } */
  function verdictMC(r, prompt, coll, o, sol, text) {
    var N = o.names, a = N[0] + N[1], b = N[1] + N[2], y = N[1];
    var yes = o.yes || '<b>Collinear</b>', no = o.no || '<b>Not collinear</b>';
    var opts = coll ? [
      { html: yes + ' — ' + t('m_{' + a + '}=m_{' + b + '}') + ' and the two segments share the point ' + t(y) + '.', right: true },
      { html: no + ' — the two slopes are different.', why: 'Write both slopes in lowest terms before you compare them — they are equal.' },
      { html: yes + ' — the two slopes multiply to ' + t('-1') + '.', why: 'Multiply them: the product isn’t ' + t('-1') + '. (A product of ' + t('-1') + ' is the test for <b>perpendicular</b>.) Collinear needs <b>equal</b> slopes.' },
      { html: 'You can’t tell without drawing a graph.', why: 'The slope test settles it: equal slopes through the shared point ' + t(y) + ' mean one straight line.' }] : [
      { html: no + ' — ' + t('m_{' + a + '}\\ne m_{' + b + '}') + ', so the path bends at ' + t(y) + '.', right: true },
      { html: yes + ' — the two slopes are very close.', why: 'Close isn’t equal: ' + t(sT(o.s1) + '\\ne ' + sT(o.s2)) + '. Even a small difference in slope means the path bends.' },
      { html: yes + ' — the segments ' + t(a) + ' and ' + t(b) + ' share the point ' + t(y) + '.', why: t(a) + ' and ' + t(b) + ' always share ' + t(y) + '. They also need <b>equal</b> slopes to be on one line.' },
      { html: 'You can’t tell without drawing a graph.', why: 'The slope test settles it: different slopes mean the path bends at ' + t(y) + '.' }];
    return B.mc(r, prompt, opts, sol, ['Equal slopes through a shared point: collinear. Different slopes: not collinear.'], text);
  }
  function verdictSol(N, s1, s2, coll, tail) {
    var a = N[0] + N[1], b = N[1] + N[2];
    return t('m_{' + a + '}=' + sT(s1)) + ' and ' + t('m_{' + b + '}=' + sT(s2)) + (coll ? ': equal slopes, and the segments share ' + t(N[1]) + ', so the points are <b>collinear</b>' : ': ' + t(sT(s1) + '\\ne ' + sT(s2)) + ', so the points are <b>not collinear</b>') + (tail || '.');
  }
  /* several sets at once: a table of verdicts */
  function verdictGrid(prompt, sets, sol, text) {
    var rows = sets.map(function (st) { return { id: st.id, html: '(' + st.id + ') ' + st.N.map(function (n, i) { return nP(n, st.P[i]); }).join(', ') }; });
    var cols = [{ id: 'y', html: 'Collinear' }, { id: 'n', html: 'Not collinear' }], want = {};
    sets.forEach(function (st) { want[st.id] = st.coll ? 'y' : 'n'; });
    var byId = {}; sets.forEach(function (st) { byId[st.id] = st; });
    return B.grid(prompt, rows, cols, want, { why: function (row) { var st = byId[row]; return 'Look at (' + row + ') again: ' + t('m_{' + st.N[0] + st.N[1] + '}=' + sT(st.s1)) + ' and ' + t('m_{' + st.N[1] + st.N[2] + '}=' + sT(st.s2)) + (st.coll ? ' are equal (reduce them).' : ' are not equal.'); } },
      sol || sets.map(function (st) { return '(' + st.id + ') ' + verdictSol(st.N, st.s1, st.s2, st.coll); }).join('<br>'), ['Collinear only when the two slopes are equal (after reducing).'], text);
  }

  /* ---------------- three points: P2 = P1 + a·v, P3 = P2 + c·v (a near miss bends the second step) ---------------- */
  function trio(r, o) {
    return gen(r, function (r) {
      var s = r.pick(o.sl), p = s[0], q = s[1], a = r.pick(o.a), c = r.pick(o.c);
      var X = [r.int(o.x0[0], o.x0[1]), r.int(o.y0[0], o.y0[1])], d1 = [q * a, p * a], d2 = [q * c, p * c];
      if (!o.coll) { if (r.chance(o.runMiss || 0.25)) d2 = [d2[0] + r.pick([-1, 1]), d2[1]]; else d2 = [d2[0], d2[1] + r.pick([-1, 1])]; if (d2[0] <= 0) return null; }
      var Y = add(X, d1), Z = add(Y, d2);
      if (!inBox(Y, o.box) || !inBox(Z, o.box) || !inBox(X, o.box)) return null;
      var s1 = slopeOf(X, Y), s2 = slopeOf(Y, Z);
      if (!nice(s1, o.maxD || 9, 20) || !nice(s2, o.maxD || 9, 20)) return null;
      if (!o.coll && (sEq(s1, s2) || Math.abs(sV(s1) - sV(s2)) > (o.close || 1.2))) return null;
      if (o.test && !o.test(X, Y, Z)) return null;
      return { P: [X, Y, Z], s1: s1, s2: s2, coll: !!o.coll };
    }, o.fb);
  }
  function fbTrio(P) { return { P: P, s1: slopeOf(P[0], P[1]), s2: slopeOf(P[1], P[2]), coll: sEq(slopeOf(P[0], P[1]), slopeOf(P[1], P[2])) }; }
  function trioFields(prompt, st, text, lowest) {
    var N = st.N, P = st.P;
    return slopeFields(prompt, [{ nm: N[0] + N[1], A: P[0], B: P[1] }, { nm: N[1] + N[2], A: P[1], B: P[2] }],
      t(calc(P[0], P[1], N[0] + N[1])) + '<br>' + t(calc(P[1], P[2], N[1] + N[2])) + '<br>' + (st.coll ? 'Equal slopes through the shared point ' + t(N[1]) + ': <b>collinear</b>.' : t(sT(st.s1) + '\\ne ' + sT(st.s2)) + ': <b>not collinear</b>.'),
      [SLOPE_HINT, 'Use the shared middle point ' + t(N[1]) + ' in both slopes, and reduce each fraction before you compare.'], text, lowest);
  }
  function setT(N, P) { return N.map(function (n, i) { return nP(n, P[i]); }).join(', '); }

  /* ---------------- figures ---------------- */
  function lbl(P, name) { return { x: P[0], y: P[1], label: name }; }
  function graphOf(spec) { return '<div class="fig">' + HW.graph(spec) + '</div>'; }
  function q1Fig(P, N) { return graphOf({ x: [0, 6.6], y: [0, 5.6], grid: 1, labels: 1, firstQuadrant: true, max: 270, unit: 34, segs: [{ pts: P }], points: P.map(function (X, i) { return lbl(X, N[i]); }), aria: 'three points joined by segments' }); }
  function q1Pts(r, coll) {
    return gen(r, function (r) {
      if (coll) {
        var q = r.int(1, 2), p = r.pick([-2, -1, 1, 1, 2]); if (gcd(p, q) !== 1) return null;
        var X = [r.int(1, 2), r.int(1, 4)], a = r.int(1, 2), c = r.int(1, 2), Y = add(X, [q, p], a), Z = add(Y, [q, p], c);
        if (!(Z[0] <= 6 && Y[1] >= 1 && Y[1] <= 5 && Z[1] >= 1 && Z[1] <= 5)) return null;
        return [X, Y, Z];
      }
      var X2 = [r.int(1, 2), r.int(1, 4)], d1 = [r.int(1, 3), r.int(-3, 3)], d2 = [r.int(1, 3), r.int(-3, 3)];
      var Y2 = add(X2, d1), Z2 = add(Y2, d2); if (!(Z2[0] <= 6 && Y2[1] >= 1 && Y2[1] <= 5 && Z2[1] >= 1 && Z2[1] <= 5)) return null;
      var ang = Math.abs(Math.atan2(d1[1], d1[0]) - Math.atan2(d2[1], d2[0])); if (ang < 0.75) return null;
      return [X2, Y2, Z2];
    }, coll ? [[1, 2], [3, 3], [5, 4]] : [[1, 1], [3, 4], [5, 2]]);
  }
  function q1Part(id, N, collDefault) {
    return { id: id, level: 'LIM', make: function (r) {
      var coll = r.chance(0.65) ? collDefault : !collDefault, P = q1Pts(r, coll);
      var p = B.mc(r, '(' + id.slice(1) + ') By looking only at the picture, do the three points appear to be collinear?' + q1Fig(P, N), [
        { html: '<b>Appear collinear</b>', right: coll, why: coll ? null : 'Lay a ruler from ' + t(N[0]) + ' to ' + t(N[2]) + ': it misses ' + t(N[1]) + '. The path bends at ' + t(N[1]) + '.' },
        { html: '<b>Do not appear collinear</b>', right: !coll, why: coll ? 'Lay a ruler along the segments: one straight edge touches all three points — the path never bends.' : null }],
        coll ? 'A ruler through ' + t(N[0]) + ' and ' + t(N[2]) + ' passes right through ' + t(N[1]) + ': the two segments head in the same direction, so the points <b>appear collinear</b>.' : 'The line through ' + t(N[0]) + ' and ' + t(N[2]) + ' misses ' + t(N[1]) + ': the path bends sharply at ' + t(N[1]) + ', so the points <b>do not appear collinear</b>.',
        ['Collinear means one straight line passes through all of them — does the path bend at ' + t(N[1]) + '?'], 'appear collinear from a picture', true);
      p.tries = 1; p.input.columns = 2;
      return p;
    } };
  }

  /* ---------------- Q6 / Q12: a point on a segment ---------------- */
  function onSegMC(r, prompt, A, C, D, nmD, sol, text) {
    var sAC = slopeOf(A, C), sAD = slopeOf(A, D), on = sEq(sAC, sAD) && D[0] > Math.min(A[0], C[0]) && D[0] < Math.max(A[0], C[0]);
    var opts = on ? [
      { html: '<b>Yes</b> — ' + t('m_{A' + nmD + '}=m_{AC}') + ', and ' + t(nmD) + ' is between ' + t('A') + ' and ' + t('C') + '.', right: true },
      { html: '<b>No</b> — ' + t('m_{A' + nmD + '}\\ne m_{AC}') + '.', why: 'Reduce both slopes to lowest terms and compare again — they are equal.' },
      { html: '<b>No</b> — ' + t('m_{A' + nmD + '}\\times m_{AC}\\ne -1') + '.', why: 'A product of ' + t('-1') + ' is the test for <b>perpendicular</b>. To be on the line, ' + t('A' + nmD) + ' needs the <b>same</b> slope as ' + t('AC') + '.' },
      { html: '<b>Yes</b> — its ' + t('x') + '-coordinate is between those of ' + t('A') + ' and ' + t('C') + '.', why: 'Being between them left to right isn’t enough — lots of points above or below the segment are too. The reason is the equal slopes.' }] : [
      { html: '<b>No</b> — ' + t('m_{A' + nmD + '}\\ne m_{AC}') + ', so ' + t(nmD) + ' is off the line.', right: true },
      { html: '<b>Yes</b> — its ' + t('x') + '-coordinate is between those of ' + t('A') + ' and ' + t('C') + '.', why: 'Being between them left to right isn’t enough — the point must be <b>on</b> the line. Compare ' + t('m_{A' + nmD + '}') + ' with ' + t('m_{AC}') + '.' },
      { html: '<b>Yes</b> — ' + t('m_{A' + nmD + '}') + ' is very close to ' + t('m_{AC}') + '.', why: 'Close isn’t equal: ' + t(sT(sAD) + '\\ne ' + sT(sAC)) + ', so ' + t(nmD) + ' sits just off the line.' },
      { html: '<b>No</b> — ' + t('m_{A' + nmD + '}\\times m_{AC}\\ne -1') + '.', why: 'The conclusion is right but the reason isn’t: a product of ' + t('-1') + ' tests for perpendicular. Being on the line means equal slopes.' }];
    return B.mc(r, prompt, opts, sol, ['A point is on segment ' + t('AC') + ' when the segment from ' + t('A') + ' to it has the same slope as ' + t('AC') + ' (and it lies between ' + t('A') + ' and ' + t('C') + ').'], text);
  }

  /* =============================== ASSIGNMENT =============================== */
  var QUESTIONS = [
    /* ---------------- Q1 ---------------- */
    { num: '1', section: 'Part A — Reading and Testing for Collinearity', stem: 'Each grid shows three labelled points joined by straight segments.', parts: [
      q1Part('1a', ['M', 'N', 'O'], true), q1Part('1b', ['R', 'S', 'T'], false)] },
    /* ---------------- Q2 ---------------- */
    { num: '2', shared: function (r) {
        var coll = r.chance(0.75);
        return gen(r, function (r) { var q = r.int(2, 3), m = r.int(1, 3), A = [r.int(0, 2), r.int(0, 3)], v = [q, m * q], c = r.pick([1, 1, 2]), Bp = add(A, v), C = add(Bp, v, c); if (!coll) C = [C[0], C[1] + r.pick([-1, 1])]; if (C[1] < 0 || C[1] > 18) return null; return { P: [A, Bp, C], s1: slopeOf(A, Bp), s2: slopeOf(Bp, C), coll: coll, N: ['A', 'B', 'C'] }; }, { P: [[0, 1], [2, 5], [4, 9]], s1: [2, 1], s2: [2, 1], coll: true, N: ['A', 'B', 'C'] });
      },
      stem: function (s) { return 'Use the slope test to determine whether ' + setT(s.N, s.P) + ' are collinear.'; },
      parts: [
        { id: '2', sub: 'i', level: 'BEG', make: function (r, s) { return trioFields('Find ' + t('m_{AB}') + ' and ' + t('m_{BC}') + '.', s, 'collinear test: two slopes'); } },
        { id: '2v', sub: 'ii', level: 'LIM', make: function (r, s) { return verdictMC(r, 'Are ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ' collinear?', s.coll, { names: s.N, s1: s.s1, s2: s.s2 }, verdictSol(s.N, s.s1, s.s2, s.coll), 'collinear verdict'); } }] },
    /* ---------------- Q3 ---------------- */
    { num: '3', shared: function (r) {
        var pat = r.chance(0.4) ? [true, false, true] : r.pick([[true, false, false], [false, true, true], [false, false, true], [true, true, false], [false, true, false], [true, false, true]]);
        var a = trio(r, { coll: pat[0], sl: [[1, 1], [2, 1], [3, 1], [1, 2], [2, 3], [3, 2]], a: [1, 2, 3], c: [1, 2, 3], x0: [0, 3], y0: [0, 4], box: 18, close: 1, test: function (X, Y, Z) { return [X, Y, Z].every(function (P) { return P[0] >= 0 && P[1] >= 0; }); }, fb: fbTrio([[1, 3], [4, 9], [7, 15]]) });
        var b = trio(r, { coll: pat[1], sl: [[2, 1], [1, 1], [3, 2], [1, 2], [3, 1]], a: [1, 2], c: [2, 3], x0: [-3, -1], y0: [-2, 1], box: 12, close: 1, test: function (X, Y, Z) { return X[0] < 0 && Y[0] >= 0 && Z[0] > 0; }, fb: fbTrio([[-2, 0], [0, 4], [3, 9]]) });
        var c = trio(r, { coll: pat[2], sl: [[2, 1], [1, 1], [3, 1], [2, 3], [4, 3]], a: [2, 3], c: [1, 2, 3], x0: [1, 3], y0: [-5, -2], box: 14, close: 1, test: function (X, Y, Z) { return X[1] < 0 && Z[1] > 0; }, fb: fbTrio([[2, -3], [5, 3], [8, 9]]) });
        a.N = ['P', 'Q', 'R']; b.N = ['S', 'T', 'U']; c.N = ['K', 'L', 'M']; a.id = 'a'; b.id = 'b'; c.id = 'c';
        return { a: a, b: b, c: c };
      },
      stem: 'Use the slope test to determine whether each set of points is collinear.',
      parts: [
        { id: '3a', level: 'BEG', make: function (r, s) { var st = s.a; return trioFields('(a) ' + setT(st.N, st.P) + ': find both slopes.', st, 'collinear test (positive)'); } },
        { id: '3b', level: 'BEG', make: function (r, s) { var st = s.b; return trioFields('(b) ' + setT(st.N, st.P) + ': find both slopes.', st, 'collinear test (with zero and a negative)'); } },
        { id: '3c', level: 'BEG', make: function (r, s) { var st = s.c; return trioFields('(c) ' + setT(st.N, st.P) + ': find both slopes.', st, 'collinear test (negative y)'); } },
        { id: '3v', sub: 'verdict', level: 'BEG', make: function (r, s) { return verdictGrid('Give the verdict for each set.', [s.a, s.b, s.c], null, 'three verdicts'); } }] },
    /* ---------------- Q4 ---------------- */
    { num: '4', section: 'Part B — Negative Coordinates and Points on a Segment', shared: function (r) {
        var st = trio(r, { coll: r.chance(0.75), sl: [[1, 1], [2, 1], [1, 2], [3, 2], [2, 3], [3, 4]], a: [1, 2, 4], c: [1, 2, 4], x0: [-8, -4], y0: [-8, -3], box: 10, close: 0.6, test: function (X, Y, Z) { return Y[0] < 0 && Y[1] < 0 && (Z[0] > 0 || Z[1] > 0); }, fb: fbTrio([[-6, -5], [-2, -1], [2, 3]]) });
        st.N = ['D', 'E', 'F']; return st;
      },
      stem: function (s) { return 'The points ' + setT(s.N, s.P) + ' all involve negative coordinates. Determine whether ' + t('D') + ', ' + t('E') + ' and ' + t('F') + ' are collinear.'; },
      parts: [
        { id: '4', sub: 'i', level: 'EMG', make: function (r, s) { return trioFields('Find ' + t('m_{DE}') + ' and ' + t('m_{EF}') + '.', s, 'collinear test, negative coordinates'); } },
        { id: '4v', sub: 'ii', level: 'LIM', make: function (r, s) { return verdictMC(r, 'Are ' + t('D') + ', ' + t('E') + ' and ' + t('F') + ' collinear?', s.coll, { names: s.N, s1: s.s1, s2: s.s2 }, verdictSol(s.N, s.s1, s.s2, s.coll), 'collinear verdict'); } }] },
    /* ---------------- Q5 ---------------- */
    { num: '5', shared: function (r) {
        var st = trio(r, { coll: r.chance(0.25), sl: [[-1, 1], [-2, 1], [-1, 2], [-3, 2], [-2, 3], [-3, 4]], a: [1, 2, 3], c: [1, 2], x0: [-6, -3], y0: [1, 4], box: 9, close: 0.5, runMiss: 0.6, test: function (X, Y, Z) { return X[0] < 0 && (Y[0] < 0 || Y[1] < 0) && Z[1] < 0 && Z[0] > 0; }, fb: fbTrio([[-4, 2], [-1, -1], [3, -4]]) });
        st.N = ['G', 'H', 'I']; return st;
      },
      stem: function (s) { return 'The points ' + setT(s.N, s.P) + ' all involve negative coordinates. Determine whether ' + t('G') + ', ' + t('H') + ' and ' + t('I') + ' are collinear.'; },
      parts: [
        { id: '5', sub: 'i', level: 'EMG', make: function (r, s) { return trioFields('Find ' + t('m_{GH}') + ' and ' + t('m_{HI}') + '.', s, 'collinear test, negative slopes'); } },
        { id: '5v', sub: 'ii', level: 'BEG', make: function (r, s) { return verdictMC(r, 'Are ' + t('G') + ', ' + t('H') + ' and ' + t('I') + ' collinear?', s.coll, { names: s.N, s1: s.s1, s2: s.s2 }, verdictSol(s.N, s.s1, s.s2, s.coll), 'collinear verdict (near miss)'); } }] },
    /* ---------------- Q6 ---------------- */
    { num: '6', shared: function (r) {
        return gen(r, function (r) {
          var q = r.int(1, 3), p = r.int(1, 4) * (r.chance(0.8) ? 1 : -1); if (gcd(Math.abs(p), q) !== 1 || Math.abs(p) === q) return null;
          var n = r.pick([3, 4, 5]), A = [r.int(0, 3), r.int(0, 4)], C = add(A, [q, p], n); if (!inBox(C, 18) || C[1] < -6) return null;
          var j = r.int(1, n - 1), D = add(A, [q, p], j), E = [D[0], D[1] + r.pick([-1, 1])];
          var firstOn = r.chance(0.65);
          return { A: A, C: C, Da: firstOn ? D : E, Db: firstOn ? E : D };
        }, { A: [1, 2], C: [9, 14], Da: [5, 8], Db: [5, 9] });
      },
      stem: function (s) { return 'Consider the points ' + nP('A', s.A) + ' and ' + nP('C', s.C) + '.'; },
      parts: [
        { id: '6a', sub: 'a i', level: 'BEG', make: function (r, s) { return slopeFields('Does ' + nP('D', s.Da) + ' lie on line segment ' + t('AC') + '? Start with the slopes ' + t('m_{AC}') + ' and ' + t('m_{AD}') + '.', [{ nm: 'AC', A: s.A, B: s.C }, { nm: 'AD', A: s.A, B: s.Da }], null, [SLOPE_HINT, 'Both slopes start at ' + t('A') + '.'], 'slopes m_AC, m_AD'); } },
        { id: '6a2', sub: 'a ii', level: 'EMG', make: function (r, s) { var sAC = slopeOf(s.A, s.C), sAD = slopeOf(s.A, s.Da), on = sEq(sAC, sAD);
          return onSegMC(r, '' + t('m_{AC}=' + sT(sAC)) + ' and ' + t('m_{AD}=' + sT(sAD)) + '. Does ' + nP('D', s.Da) + ' lie on line segment ' + t('AC') + '?', s.A, s.C, s.Da, 'D',
            t(calc(s.A, s.C, 'AC')) + '<br>' + t(calc(s.A, s.Da, 'AD')) + '<br>' + (on ? 'Equal slopes, and ' + t('AD') + ' and ' + t('AC') + ' share ' + t('A') + ', so ' + t('D') + ' is on the line; its ' + t('x') + ' is between ' + t(s.A[0]) + ' and ' + t(s.C[0]) + ': <b>yes</b>, ' + t('D') + ' is on the segment.' : t(sT(sAD) + '\\ne ' + sT(sAC)) + ': <b>no</b>, ' + t('D') + ' is not on ' + t('AC') + '.'), 'is D on segment AC'); } },
        { id: '6b', sub: 'b i', level: 'BEG', make: function (r, s) { var sAE = slopeOf(s.A, s.Db); return slopeAns('Does ' + nP('E', s.Db) + ' lie on line segment ' + t('AC') + '? Find ' + t('m_{AE}') + '.', sAE, slopeChk(sAE, dnDiag(s.A, s.Db)), t(calc(s.A, s.Db, 'AE')), [SLOPE_HINT], 'slope m_AE', t('m_{AE}=')); } },
        { id: '6b2', sub: 'b ii', level: 'EMG', make: function (r, s) { var sAC = slopeOf(s.A, s.C), sAE = slopeOf(s.A, s.Db), on = sEq(sAC, sAE);
          return onSegMC(r, '' + t('m_{AC}=' + sT(sAC)) + ' and ' + t('m_{AE}=' + sT(sAE)) + '. Does ' + nP('E', s.Db) + ' lie on line segment ' + t('AC') + '?', s.A, s.C, s.Db, 'E',
            t(calc(s.A, s.Db, 'AE')) + '<br>' + (on ? 'Equal to ' + t('m_{AC}') + ', sharing ' + t('A') + ', and ' + t('E') + ' is between ' + t('A') + ' and ' + t('C') + ': <b>yes</b>.' : t(sT(sAE) + '\\ne ' + sT(sAC)) + ': <b>no</b>, ' + t('E') + ' is just off the segment.'), 'is E on segment AC'); } }] },
    /* ---------------- Q7 ---------------- */
    { num: '7', section: 'Part C — Unknown Coordinates and Applications', parts: [
      { id: '7', level: 'EMG', make: function (r) {
        var g = gen(r, function (r) { var m = r.int(1, 3), q = r.int(1, 4), c = r.pick([1, 1, 1, 2]), J = [r.int(0, 4), r.int(0, 6)]; if (m === q) return null; var Kp = add(J, [q, m * q]), L = add(Kp, [q, m * q], c); if (L[1] > 30) return null; return { J: J, K: Kp, L: L, m: m, run: q * c }; }, { J: [3, 5], K: [6, 11], L: [9, 17], m: 2, run: 3 });
        var rise = g.m * g.run;
        return numAns('The points ' + nP('J', g.J) + ', ' + nP('K', g.K) + ' and ' + t('L(' + g.L[0] + ',\\ k)') + ' are collinear. Find the value of ' + t('k') + '.', g.L[1],
          [[rise, 'k-no-start', 'You found the rise from ' + t('K') + ' to ' + t('L') + ' (' + t(rise) + ') — now add it to the height of ' + t('K') + ', ' + t(g.K[1]) + '.'], [g.K[1] - rise, 'k-sign', 'The slope is positive, so ' + t('L') + ' (to the right of ' + t('K') + ') is <b>higher</b>: add the rise.'],
            [g.K[1] + g.run, 'k-flip', 'You added the run. The rise is the slope times the run: ' + t(g.m + '\\times ' + g.run + '=' + rise) + '.'], [g.K[1] + g.m, 'u6l8-slope-once', 'You added the slope once, but the run from ' + t('K') + ' to ' + t('L') + ' is ' + t(g.run) + ': the rise is ' + t(g.m + '\\times ' + g.run) + '.'], [g.m * g.L[0], 'k-no-start', 'Multiplying the slope by the ' + t('x') + '-coordinate only works for a line through the origin. Use the rise from ' + t('K') + '.']],
          t(calc(g.J, g.K, 'JK')) + '. Collinear, so ' + t('m_{KL}=' + g.m) + ':<br>' + t('\\frac{k-' + g.K[1] + '}{' + g.L[0] + '-' + g.K[0] + '}=' + g.m + '\\ \\Rightarrow\\ \\frac{k-' + g.K[1] + '}{' + g.run + '}=' + g.m + '\\ \\Rightarrow\\ k-' + g.K[1] + '=' + rise + '\\ \\Rightarrow\\ k=' + g.L[1]) + '.',
          ['Find ' + t('m_{JK}') + '. Collinear means ' + t('m_{KL}') + ' must be the same.', 'Write ' + t('m_{KL}') + ' with ' + t('k') + ' in it, set it equal, then multiply both sides by the run.'], 'collinear: find k (y)', t('k='));
      } }] },
    /* ---------------- Q8 ---------------- */
    { num: '8', parts: [
      { id: '8', level: 'PRG', make: function (r) {
        var g = gen(r, function (r) { var q = r.int(1, 3), p = r.int(1, 4); if (gcd(p, q) !== 1 || p === q) return null; var n = r.int(2, 4) * (q === 1 ? 2 : 1), j = r.int(1, n - 1), P = [r.int(0, 3), r.int(0, 4)], R = add(P, [q, p], n), Q = add(P, [q, p], j); if (R[1] > 20 || R[0] > 14 || j * q < 2) return null; return { P: P, Q: Q, R: R, s: [p, q] }; }, { P: [1, 2], Q: [5, 8], R: [7, 11], s: [3, 2] });
        var rise = g.Q[1] - g.P[1], run = g.Q[0] - g.P[0], m = sV(g.s), isInt = function (v) { return Math.abs(v - Math.round(v)) < 1e-9; };
        var list = [[rise, 'k-no-start', 'You found the rise (' + t(rise) + ') — the rise is ' + t('y-' + g.P[1]) + ', so add ' + t(g.P[1]) + '.'], [g.P[1] - rise, 'k-sign', 'The slope is positive and ' + t('Q') + ' is to the right of ' + t('P') + ', so ' + t('Q') + ' is <b>higher</b> than ' + t('P') + ': add the rise.'],
          [g.P[1] + run / m, 'k-flip', 'Slope is rise ÷ run, so the rise is the slope <b>times</b> the run: ' + t(sT(g.s) + '\\times ' + run + '=' + rise) + '.'], [g.P[1] + m, 'u6l8-slope-once', 'You added the slope once, but the run from ' + t('P') + ' to ' + t('Q') + ' is ' + t(run) + ': the rise is ' + t(sT(g.s) + '\\times ' + run) + '.'],
          [m * g.Q[0], 'k-no-start', 'Multiplying the slope by the ' + t('x') + '-coordinate only works for a line through the origin. Use the rise from ' + t('P') + '.']].filter(function (x) { return isInt(x[0]); });
        var p = numAns('The points ' + nP('P', g.P) + ', ' + t('Q(' + g.Q[0] + ',\\ y)') + ' and ' + nP('R', g.R) + ' are collinear. Find the value of ' + t('y') + '.', g.Q[1], list,
          t(calc(g.P, g.R, 'PR')) + '. ' + t('Q') + ' must give the same slope from ' + t('P') + ':<br>' + t('\\frac{y-' + g.P[1] + '}{' + g.Q[0] + '-' + g.P[0] + '}=' + sT(g.s) + '\\ \\Rightarrow\\ \\frac{y-' + g.P[1] + '}{' + run + '}=' + sT(g.s) + '\\ \\Rightarrow\\ y-' + g.P[1] + '=' + run + '\\times ' + sT(g.s) + '=' + rise + '\\ \\Rightarrow\\ y=' + g.Q[1]) + '.',
          ['Use the two known points ' + t('P') + ' and ' + t('R') + ' to find the slope of the line.', 'Then ' + t('m_{PQ}') + ' must equal it: the unknown is in the rise, ' + t('y-' + g.P[1]) + '. Multiply both sides by the run.'], 'collinear: find y (middle point)', t('y='));
        p.good = ['y=' + g.Q[1]]; return p;
      } }] },
    /* ---------------- Q9 ---------------- */
    { num: '9', shared: function (r) {
        var coll = r.chance(0.7), A0 = r.chance(0.6) ? [0, 0] : [r.int(1, 4), r.int(0, 3)];
        var st = trio(r, { coll: coll, sl: [[2, 3], [3, 4], [1, 2], [3, 2], [4, 3], [2, 5]], a: [2, 3], c: [3, 4, 5], x0: [A0[0], A0[0]], y0: [A0[1], A0[1]], box: 30, close: 0.4, fb: fbTrio([[0, 0], [6, 4], [15, 10]]) });
        st.N = ['A', 'B', 'C']; return st;
      },
      stem: function (s) { return 'A surveyor marks three fence posts at ' + setT(s.N, s.P) + ' on a site map, each unit ' + t('1') + ' m. Do the three posts lie along the same straight fence line?'; },
      parts: [
        { id: '9', sub: 'i', level: 'EMG', make: function (r, s) { return trioFields('Find ' + t('m_{AB}') + ' and ' + t('m_{BC}') + '.', s, 'fence posts: two slopes'); } },
        { id: '9v', sub: 'ii', level: 'BEG', make: function (r, s) { return verdictMC(r, 'Do the three posts lie along one straight fence line?', s.coll, { names: s.N, s1: s.s1, s2: s.s2, yes: '<b>Yes, one straight fence line</b>', no: '<b>No</b>' }, verdictSol(s.N, s.s1, s.s2, s.coll, s.coll ? ': one straight fence line.' : ': the fence would have to bend at ' + t('B') + '.'), 'fence verdict'); } }] },
    /* ---------------- Q10 ---------------- */
    { num: '10', shared: function (r) {
        var st = trio(r, { coll: r.chance(0.3), sl: [[3, 2], [4, 3], [5, 4], [2, 3], [5, 3], [3, 4]], a: [1, 2], c: [1, 2], x0: [1, 3], y0: [1, 4], box: 22, close: 0.5, runMiss: 0, fb: fbTrio([[1, 3], [5, 9], [9, 14]]) });
        st.N = ['D_1', 'D_2', 'D_3']; return st;
      },
      stem: function (s) { return 'A courier’s first three stops are ' + setT(s.N, s.P) + ' on a city map, each unit ' + t('1') + ' km. Can the courier drive one straight line through all three?'; },
      parts: [
        { id: '10', sub: 'i', level: 'EMG', make: function (r, s) { return trioFields('Find ' + t('m_{D_1D_2}') + ' and ' + t('m_{D_2D_3}') + '.', s, 'courier: two slopes'); } },
        { id: '10v', sub: 'ii', level: 'BEG', make: function (r, s) { return verdictMC(r, 'Can the courier drive one straight line through all three stops?', s.coll, { names: s.N, s1: s.s1, s2: s.s2, yes: '<b>Yes</b>', no: '<b>No</b>' }, verdictSol(s.N, s.s1, s.s2, s.coll, s.coll ? ': one straight line works.' : ': the route has to turn at ' + t('D_2') + '.'), 'courier verdict'); } }] },
    /* ---------------- Q11 ---------------- */
    { num: '11', stem: 'Think about why the slope test works.', parts: [
      { id: '11a', level: 'EMG', make: function (r) {
        return B.mc(r, '(a) Why is calculating ' + t('m_{AB}') + ' and ' + t('m_{BC}') + ' (using the shared point ' + t('B') + ') enough to prove ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ' are collinear when the slopes are equal?', [
          { html: 'Equal slopes mean ' + t('AB') + ' and ' + t('BC') + ' point in exactly the same direction, and since they share ' + t('B') + ' they are two pieces of one straight line.', right: true },
          { html: 'Equal slopes always mean the points are on one line, whether or not a point is shared.', why: 'Two segments with equal slopes can sit side by side (parallel). What stops that here?' },
          { html: 'Equal slopes mean the segments ' + t('AB') + ' and ' + t('BC') + ' have the same length.', why: 'Slope is about direction, not length — ' + t('AB') + ' and ' + t('BC') + ' can be different lengths and still be collinear.' },
          { html: 'Equal slopes mean the segments meet at a right angle at ' + t('B') + '.', why: 'Meeting at a right angle is perpendicular (slopes multiply to ' + t('-1') + '). Equal slopes mean no turn at all.' }],
          'Slope measures direction. If ' + t('m_{AB}=m_{BC}') + ', the two segments head in the same direction; because they also share the point ' + t('B') + ', they are two pieces of the <b>same</b> straight line, so ' + t('A') + ', ' + t('B') + ', ' + t('C') + ' are collinear.', ['Two pieces of track pointing the same way, joined at ' + t('B') + '…'], 'why the slope test works');
      } },
      { id: '11b', level: 'BEG', make: function (r) {
        return B.mc(r, '(b) What would ' + t('m_{AB}\\ne m_{BC}') + ' mean?', [
          { html: 'The path bends at ' + t('B') + ', so ' + t('A') + ', ' + t('B') + ', ' + t('C') + ' are <b>not</b> collinear.', right: true },
          { html: 'The points are still collinear, just unevenly spaced.', why: 'Spacing doesn’t change the slope. Different slopes mean the direction changes at ' + t('B') + '.' },
          { html: t('AB') + ' and ' + t('BC') + ' are perpendicular.', why: 'Only if the slopes multiply to ' + t('-1') + '. In general, different slopes just mean a bend at ' + t('B') + '.' },
          { html: 'You made an arithmetic mistake — the slopes of three points are always equal.', why: 'Most sets of three points are not collinear: their slopes really are different.' }],
          'Unequal slopes mean ' + t('AB') + ' and ' + t('BC') + ' head in different directions: the path bends at ' + t('B') + ', so the points are <b>not collinear</b>.', ['What happens to the direction at ' + t('B') + '?'], 'what unequal slopes mean');
      } }] },
    /* ---------------- Q12 ---------------- */
    { num: '12', shared: function (r) {
        return gen(r, function (r) {
          var q = r.int(2, 6), p = r.int(1, 5) * (r.chance(0.8) ? 1 : -1); if (gcd(Math.abs(p), q) !== 1 || Math.abs(p) === q) return null;
          var A = [r.int(-9, -6), r.int(-5, -2)], v = [q, p], Bp = add(A, v), C = add(Bp, v), on = r.chance(0.65), D = add(C, v); if (!on) D = [D[0], D[1] + r.pick([-1, 1])];
          if (!inBox(D, 16) || !(Bp[0] < 0) || !(C[0] > 0)) return null;
          return { A: A, B: Bp, C: C, D: D, s: red(p, q), on: on };
        }, { A: [-8, -3], B: [-2, 1], C: [4, 5], D: [10, 9], s: [2, 3], on: true });
      },
      stem: function (s) { return '<i>(Mixed Review)</i> Consider ' + nP('A', s.A) + ', ' + nP('B', s.B) + ', ' + nP('C', s.C) + ' and ' + nP('D', s.D) + '.'; },
      parts: [
        { id: '12a', level: 'EMG', make: function (r, s) { return slopeFields('(a) Show that ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ' are collinear: find ' + t('m_{AB}') + ' and ' + t('m_{BC}') + '.', [{ nm: 'AB', A: s.A, B: s.B }, { nm: 'BC', A: s.B, B: s.C }],
          t(calc(s.A, s.B, 'AB')) + '<br>' + t(calc(s.B, s.C, 'BC')) + '<br>Equal slopes through the shared point ' + t('B') + ': collinear.', [SLOPE_HINT, NEG_HINT], 'show collinear (review)'); } },
        { id: '12b', level: 'PRG', make: function (r, s) {
          var sCD = slopeOf(s.C, s.D), sl = sT(s.s), flip = sT(red(s.s[1], s.s[0]));
          var opts = s.on ? [
            { html: '<b>Yes</b> — ' + t('m_{CD}=' + sl + '=m_{BC}') + ', and ' + t('CD') + ' shares ' + t('C') + ' with ' + t('BC') + '.', right: true },
            { html: '<b>No</b> — ' + t('m_{CD}=' + flip) + ', which is not ' + t(sl) + '.', why: t(flip) + ' is run over rise. Slope is <b>rise over run</b>: ' + t('\\frac{y_D-y_C}{x_D-x_C}') + '.' },
            { html: '<b>Yes</b> — both coordinates of ' + t('D') + ' are bigger than those of ' + t('C') + '.', why: 'Lots of points are up and to the right of ' + t('C') + '. ' + t('D') + ' must give the <b>same slope</b> from ' + t('C') + '.' },
            { html: '<b>No</b> — ' + t('D') + ' is too far from ' + t('A') + ' to be on the same line.', why: 'A line goes on forever: distance doesn’t matter, only direction (slope).' }] : [
            { html: '<b>No</b> — ' + t('m_{CD}=' + sT(sCD)) + ', which is not ' + t(sl) + '.', right: true },
            { html: '<b>Yes</b> — ' + t('m_{CD}=' + sl) + '.', why: 'Recalculate ' + t('m_{CD}=\\frac{y_D-y_C}{x_D-x_C}') + ' carefully — it doesn’t reduce to ' + t(sl) + '.' },
            { html: '<b>Yes</b> — the run from ' + t('C') + ' to ' + t('D') + ' is the same as from ' + t('B') + ' to ' + t('C') + '.', why: 'Equal runs aren’t enough: the rises must match too, so that the slopes are equal.' },
            { html: '<b>No</b> — ' + t('D') + ' is too far from ' + t('A') + ' to be on the same line.', why: 'The conclusion is right but not the reason: a line goes on forever. ' + t('D') + ' is off the line because ' + t('m_{CD}\\ne m_{BC}') + '.' }];
          return B.mc(r, '(b) Does ' + t('D') + ' also lie on this same line? Use slope.', opts, t(calc(s.C, s.D, 'CD')) + '<br>' + (s.on ? 'The same slope as ' + t('BC') + ', and ' + t('CD') + ' shares ' + t('C') + ': <b>yes</b>, ' + t('D') + ' is on the line too.' : t(sT(sCD) + '\\ne ' + sl) + ': <b>no</b>, ' + t('D') + ' is not on the line.'),
            ['Find ' + t('m_{CD}') + ' and compare it with the slope from (a).'], 'is D on the line too');
        } }] },
    /* ---------------- Q13 ---------------- */
    { num: '13', section: 'Part D — Multiple Choice and Numerical Response', parts: [
      { id: '13', level: 'EMG', make: function (r) {
        var g = gen(r, function (r) { var m = r.int(2, 3), q = r.int(2, 4), E = [r.int(1, 4), r.int(0, 4)], F = add(E, [q, m * q]), G = add(F, [q, m * q]); return { E: E, F: F, G: G, m: m, q: q }; }, { E: [2, 1], F: [5, 7], G: [8, 13], m: 2, q: 3 });
        var k = g.G[1], seen = {}; seen[k] = 1;
        var cand = [[g.F[1] + g.q, 'You added the run. Add the <b>rise</b>: slope × run ' + t('=' + g.m + '\\times ' + g.q) + '.'], [g.m * g.G[0], 'Slope × ' + t('x') + ' only works for a line through the origin. Use the rise from ' + t('F') + '.'], [g.F[1] + g.m, 'You added the slope once, but the run from ' + t('F') + ' to ' + t('G') + ' is ' + t(g.q) + '.'], [g.F[1] + g.m * g.q + g.m, 'Check the rise: slope × run ' + t('=' + g.m + '\\times ' + g.q + '=' + g.m * g.q) + '.'], [g.F[1] - g.m * g.q, 'The slope is positive, so ' + t('G') + ' is higher than ' + t('F') + '.']]
          .filter(function (o) { if (seen[o[0]] || o[0] < 0) return false; seen[o[0]] = 1; return true; }).slice(0, 3);
        return B.mc(r, '<i>(Multiple choice)</i> The points ' + nP('E', g.E) + ', ' + nP('F', g.F) + ' and ' + t('G(' + g.G[0] + ',\\ k)') + ' are collinear. The value of ' + t('k') + ' is', [{ html: t(String(k)), right: true }].concat(cand.map(function (o) { return { html: t(String(o[0])), why: o[1] }; })),
          t(calc(g.E, g.F, 'EF')) + '. ' + t('\\frac{k-' + g.F[1] + '}{' + g.G[0] + '-' + g.F[0] + '}=' + g.m + '\\ \\Rightarrow\\ k-' + g.F[1] + '=' + g.m * g.q + '\\ \\Rightarrow\\ k=' + k) + '.', ['Find ' + t('m_{EF}') + ', then make ' + t('m_{FG}') + ' equal to it.'], 'MC collinear find k');
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        function set(coll) { return gen(r, function (r) { var m = r.int(1, 3), q = r.pick([1, 2]), A = [r.int(0, 2), r.int(0, 3)], d1 = [q, m * q], d2 = [q + (coll ? 0 : r.pick([0, 1])), m * q]; if (!coll) d2[1] += r.pick([-1, 1]); var Bp = add(A, d1), C = add(Bp, d2); if (!coll && sEq(slopeOf(A, Bp), slopeOf(Bp, C))) return null; if (C[1] < 0 || C[1] > 14) return null; return [A, Bp, C]; }, null); }
        var right = set(true), wr = [], tries = 0; while (wr.length < 3 && tries++ < 50) { var w = set(false); if (w && !wr.some(function (x) { return sameP(x[0], w[0]) && sameP(x[1], w[1]); })) wr.push(w); }
        if (!right || wr.length < 3) { right = [[1, 1], [3, 5], [5, 9]]; wr = [[[0, 0], [2, 3], [4, 7]], [[2, 2], [4, 5], [6, 9]], [[0, 3], [2, 4], [5, 5]]]; }
        var lab = function (P) { return t(P.map(ptT).join(',\\ ')); };
        var opts = [{ html: lab(right), right: true }].concat(wr.map(function (P) { var a = slopeOf(P[0], P[1]), b = slopeOf(P[1], P[2]); return { html: lab(P), why: 'For ' + lab(P) + ': the slopes are ' + t(sT(a)) + ' and ' + t(sT(b)) + ' — not equal.' }; }));
        var a = slopeOf(right[0], right[1]), b = slopeOf(right[1], right[2]);
        return B.mc(r, '<i>(Multiple choice)</i> Which set of points below is collinear?', opts,
          lab(right) + ': slopes ' + t(sT(a)) + ' and ' + t(sT(b)) + ' — equal, so collinear.<br>' + wr.map(function (P) { return lab(P) + ': slopes ' + t(sT(slopeOf(P[0], P[1]))) + ' and ' + t(sT(slopeOf(P[1], P[2]))) + ' — not equal.'; }).join('<br>'), ['For each set, find the slope of the first two points and of the last two points.'], 'MC which set is collinear');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var g = gen(r, function (r) { var q = r.int(1, 4), p = r.int(1, 4); if (gcd(p, q) !== 1) return null; var H = [r.int(-5, -2), r.int(-5, -1)], I = add(H, [q, p], r.int(1, 5)), J = add(I, [q, p], r.int(1, 6 - q)); if (!(I[0] > 0 && I[1] > 0) || J[1] > 30 || J[0] - I[0] < 2) return null; return { H: H, I: I, J: J, s: [p, q] }; }, { H: [-3, -2], I: [1, 2], J: [6, 7], s: [1, 1] });
        var run = g.J[0] - g.I[0], rise = g.J[1] - g.I[1];
        return B.nr('<i>(Numerical response)</i> The points ' + nP('H', g.H) + ', ' + nP('I', g.I) + ' and ' + t('J(' + g.J[0] + ',\\ k)') + ' are collinear. The value of ' + t('k') + ' is ____.', g.J[1],
          dg([[rise, 'k-no-start', 'That is the rise from ' + t('I') + ' to ' + t('J') + ' — add it to the height of ' + t('I') + ', ' + t(g.I[1]) + '.'], [g.I[1] + run, 'k-flip', 'You added the run. The rise is the slope times the run.'], [g.I[1] + sV(g.s), 'u6l8-slope-once', 'You added the slope once, but the run from ' + t('I') + ' to ' + t('J') + ' is ' + t(run) + '.']], g.J[1]),
          t(calc(g.H, g.I, 'HI')) + '. ' + t('\\frac{k-' + g.I[1] + '}{' + g.J[0] + '-' + g.I[0] + '}=' + sT(g.s) + '\\ \\Rightarrow\\ k-' + g.I[1] + '=' + rise + '\\ \\Rightarrow\\ k=' + g.J[1]) + '.', ['Find ' + t('m_{HI}') + ' (watch the negatives), then make ' + t('m_{IJ}') + ' equal to it.'], 'NR collinear find k');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'EMG', make: function (r) {
        var g = gen(r, function (r) { var C = [-r.int(2, 8), -r.int(3, 12)], D = [r.int(4, 14), r.int(8, 26)]; var dx = D[0] - C[0], dy = D[1] - C[1], s = dy / dx; if (dx < 9 || Number.isInteger(s * 10) || Math.abs(s * 10 - Math.round(s * 10)) < 0.04 || Math.abs(Math.abs(s * 10 % 1) - 0.5) < 0.02 || s >= 10) return null; return { C: C, D: D, s: s }; }, { C: [-4, -9], D: [11, 22], s: 31 / 15 });
        var dx = g.D[0] - g.C[0], dy = g.D[1] - g.C[1];
        return B.approx('<i>(Numerical response)</i> To the nearest tenth, the slope of the line segment joining ' + nP('C', g.C) + ' and ' + nP('D', g.D) + ' is ____.', g.s, 1, { nr: true, diag: function (v) {
          var cands = [(g.D[1] + g.C[1]) / dx, dy / (g.D[0] + g.C[0]), (g.D[1] + g.C[1]) / (g.D[0] + g.C[0])];
          for (var i = 0; i < cands.length; i++) if (isFinite(cands[i]) && near(v, K.roundTo(cands[i], 1))) return { code: 'double-neg', hint: NEG_HINT };
          if (near(v, K.roundTo(dx / dy, 1))) return { code: 'slope-flip', hint: 'Slope is <b>rise over run</b> — you have run over rise.' }; return null; } },
          t('m=\\frac{' + g.D[1] + '-' + nb(g.C[1]) + '}{' + g.D[0] + '-' + nb(g.C[0]) + '}=\\frac{' + dy + '}{' + dx + '}\\approx ' + K.roundTo(g.s, 1).toFixed(1)), [SLOPE_HINT, 'Divide on the calculator, then round to one decimal place.'], 'NR slope to the nearest tenth');
      } }] }
  ];

  /* =============================== EXTRA PRACTICE =============================== */
  /* Part A near misses: EP1 and EP2 */
  function nearPair(r, o) {
    var a = trio(r, { coll: true, sl: o.slA, a: o.aA, c: o.cA, x0: o.x0A, y0: o.y0A, box: 12, maxD: 12, test: o.testA, fb: o.fbA });
    var b = trio(r, { coll: false, sl: o.slB, a: o.aB, c: o.cB, x0: o.x0B, y0: o.y0B, box: 12, maxD: 12, close: 0.15, runMiss: 0, test: o.testB, fb: o.fbB });
    if (r.chance(0.2)) { var tmp = trio(r, { coll: true, sl: o.slB, a: o.aB, c: o.cB, x0: o.x0B, y0: o.y0B, box: 12, maxD: 12, test: o.testB, fb: null }); if (tmp) b = tmp; }
    a.N = o.NA; b.N = o.NB; a.id = 'a'; b.id = 'b';
    return { a: a, b: b };
  }
  function nearQ(num, sec, o) {
    var q = { num: num, shared: function (r) { return nearPair(r, o); }, stem: 'Determine whether each set of points is collinear. Give both slopes as exact fractions in lowest terms.', parts: [
      { id: 'e' + num + 'a', level: 'EMG', make: function (r, s) { return trioFields('(a) ' + setT(s.a.N, s.a.P) + ': find both slopes.', s.a, 'near miss test (a)', true); } },
      { id: 'e' + num + 'b', level: 'EMG', make: function (r, s) { return trioFields('(b) ' + setT(s.b.N, s.b.P) + ': find both slopes.', s.b, 'near miss test (b)', true); } },
      { id: 'e' + num + 'v', sub: 'verdict', level: 'BEG', make: function (r, s) { return verdictGrid('Give the verdict for each set.', [s.a, s.b], null, 'near miss verdicts'); } }] };
    if (sec) q.section = sec;
    return q;
  }

  var EXTRA = [
    nearQ('1', 'Extra Practice A — The Slope Test, Including Some Very Near Misses', { NA: ['A', 'B', 'C'], NB: ['D', 'E', 'F'],
      slA: [[3, 2], [2, 3], [4, 3], [3, 4], [5, 2], [5, 3], [1, 2]], aA: [1, 2], cA: [2, 3, 4], x0A: [-7, -3], y0A: [-9, -3], testA: function (X, Y, Z) { return Y[0] < 0 && Y[1] < 0 && Z[0] > 0; }, fbA: fbTrio([[-5, -7], [-1, -1], [7, 11]]),
      slB: [[-3, 4], [-2, 3], [-3, 5], [-4, 5], [-1, 2]], aB: [1], cB: [2], x0B: [-7, -5], y0B: [2, 5], testB: function (X, Y, Z) { return Y[0] < 0 && Z[0] > 0 && Z[1] < 0; }, fbB: fbTrio([[-6, 4], [-2, 1], [6, -6]]) }),
    nearQ('2', null, { NA: ['P', 'Q', 'R'], NB: ['S', 'T', 'U'],
      slA: [[2, 3], [3, 2], [1, 3], [3, 4], [2, 5], [4, 3]], aA: [2, 3], cA: [2, 3], x0A: [-9, -7], y0A: [-6, -4], testA: function (X, Y, Z) { return Y[0] < 0 && Z[0] > 0; }, fbA: fbTrio([[-8, -5], [-2, -1], [7, 5]]),
      slB: [[-2, 3], [-3, 2], [-1, 3], [-3, 4], [-2, 5]], aB: [2], cB: [3], x0B: [-9, -7], y0B: [4, 7], testB: function (X, Y, Z) { return Y[0] < 0 && Z[0] > 0 && Z[1] < 0; }, fbB: fbTrio([[-7, 6], [-1, 2], [8, -5]]) }),
    /* ---------------- EP3 ---------------- */
    { num: '3', shared: function (r) {
        return gen(r, function (r) {
          var q = r.int(2, 4), p = r.int(1, 3) * (r.chance(0.8) ? 1 : -1); if (gcd(Math.abs(p), q) !== 1) return null;
          var n = r.int(2, 3), O = r.chance(0.5) ? [0, 0] : [r.int(-2, 2), r.int(-2, 2)], A = add(O, [q, p], -n), Bp = add(O, [q, p], n); if (!inBox(A, 10) || !inBox(Bp, 10)) return null;
          var onPts = [add(A, [q, p], r.int(1, n - 1)), add(A, [q, p], r.int(n + 1, 2 * n - 1))], off1 = [O[0], O[1] + r.pick([-1, 1])], off2 = add(Bp, [q, p]); off2 = [off2[0], off2[1] + r.pick([-1, 1])];
          if (!distinct([onPts[0], onPts[1], off1, off2, A, Bp])) return null;
          var pts = [onPts[0], off1, onPts[1], off2].map(function (P, i) { return { P: P, on: i % 2 === 0 }; });
          if (r.chance(0.5)) pts = [pts[0], pts[1], pts[3], pts[2]];
          return { A: A, B: Bp, s: red(p, q), pts: pts };
        }, { A: [-6, -4], B: [6, 4], s: [2, 3], pts: [{ P: [-3, -2], on: true }, { P: [0, 1], on: false }, { P: [3, 2], on: true }, { P: [9, 5], on: false }] });
      },
      stem: function (s) { return 'The line through ' + nP('A', s.A) + ' and ' + nP('B', s.B) + ' is drawn on a map.'; },
      parts: [
        { id: 'e3a', level: 'BEG', make: function (r, s) { return slopeAns('Find the slope of the line, ' + t('m_{AB}') + '.', s.s, slopeChk(s.s, dnDiag(s.A, s.B)), t(calc(s.A, s.B, 'AB')), [SLOPE_HINT], 'slope of the line', t('m_{AB}=')); } },
        { id: 'e3b', level: 'EMG', make: function (r, s) {
          var rows = s.pts.map(function (o, i) { return { id: 'abcd'.charAt(i), html: '(' + 'abcd'.charAt(i) + ') ' + t(ptT(o.P)) }; }), want = {};
          s.pts.forEach(function (o, i) { want['abcd'.charAt(i)] = o.on ? 'on' : 'off'; });
          var why = function (row) { var o = s.pts['abcd'.indexOf(row)], sl = slopeOf(s.A, o.P); return 'For (' + row + '): the slope from ' + t('A') + ' is ' + t(sT(sl)) + (sEq(sl, s.s) ? ', the same as ' + t('m_{AB}') + ' — on the line.' : ', not ' + t(sT(s.s)) + ' — off the line.'); };
          return B.grid(t('m_{AB}=' + sT(s.s)) + '. Decide whether each point lies on the line. Justify each with the slope from ' + t('A') + ' to the point.', rows, [{ id: 'on', html: 'On the line' }, { id: 'off', html: 'Not on the line' }], want, { why: why },
            s.pts.map(function (o, i) { var sl = slopeOf(s.A, o.P); return '(' + 'abcd'.charAt(i) + ') ' + t(calc(s.A, o.P)) + (sEq(sl, s.s) ? ': equal to ' + t(sT(s.s)) + ', <b>on</b> the line.' : ': not ' + t(sT(s.s)) + ', <b>not</b> on the line.'); }).join('<br>'),
            ['A point is on line ' + t('AB') + ' exactly when the slope from ' + t('A') + ' to it equals ' + t('m_{AB}') + '.'], 'which points are on the line');
        } }] },
    /* ---------------- EP4 ---------------- */
    { num: '4', shared: function (r) {
        return gen(r, function (r) {
          var q = r.int(3, 5), p = r.int(1, q - 1) * (r.chance(0.8) ? 1 : -1); if (gcd(Math.abs(p), q) !== 1) return null;
          var v = [q, p], w = [q + 1, p + (p > 0 ? 1 : -1)], first = r.chance(0.6), A, Bp, C, D;
          if (first) { A = [r.int(-7, -5), r.int(-6, -3) * (p > 0 ? 1 : -1)]; Bp = add(A, v); C = add(Bp, v); D = add(C, w); }
          else { Bp = [r.int(-3, -1), r.int(-3, 0) * (p > 0 ? 1 : -1)]; A = add(Bp, w, -1); C = add(Bp, v); D = add(C, v); }
          var P = [A, Bp, C, D]; if (!P.every(function (X) { return inBox(X, 12); })) return null;
          var tr = [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]].filter(function (x) { return col3(P[x[0]], P[x[1]], P[x[2]]); });
          if (tr.length !== 1) return null;
          return { P: P, tri: tr[0] };
        }, { P: [[-6, -5], [-2, -2], [2, 1], [7, 5]], tri: [0, 1, 2] });
      },
      stem: function (s) { return '<b>Four points.</b> Consider ' + setT(['A', 'B', 'C', 'D'], s.P) + '.'; },
      parts: [
        { id: 'e4a', sub: 'a i', level: 'EMG', make: function (r, s) { var P = s.P; return slopeFields('Are all four points collinear? Find ' + t('m_{AB}') + ', ' + t('m_{BC}') + ' and ' + t('m_{CD}') + '.', [{ nm: 'AB', A: P[0], B: P[1] }, { nm: 'BC', A: P[1], B: P[2] }, { nm: 'CD', A: P[2], B: P[3] }], null, [SLOPE_HINT, 'Use consecutive pairs: each slope shares a point with the next.'], 'four points: three slopes'); } },
        { id: 'e4a2', sub: 'a ii', level: 'BEG', make: function (r, s) {
          var P = s.P, sl = [slopeOf(P[0], P[1]), slopeOf(P[1], P[2]), slopeOf(P[2], P[3])];
          return B.mc(r, '' + t('m_{AB}=' + sT(sl[0]) + ',\\ m_{BC}=' + sT(sl[1]) + ',\\ m_{CD}=' + sT(sl[2])) + '. Are all four points collinear?', [
            { html: '<b>No</b> — the three slopes are not all equal.', right: true },
            { html: '<b>Yes</b> — two of the three slopes are equal.', why: 'For all four to be on one line, <b>every</b> consecutive slope must be the same. One bend is enough to break the line.' },
            { html: '<b>Yes</b> — the slopes are all close to each other.', why: 'Close isn’t equal: ' + t(sT(sl[0]) + ',\\ ' + sT(sl[1]) + ',\\ ' + sT(sl[2])) + '.' }],
            'The slopes are ' + t(sT(sl[0])) + ', ' + t(sT(sl[1])) + ' and ' + t(sT(sl[2])) + ': not all equal, so the four points are <b>not</b> all collinear.', ['All four are collinear only if every consecutive pair has the same slope.'], 'all four collinear?');
        } },
        { id: 'e4b', sub: 'b', level: 'PRG', make: function (r, s) {
          var P = s.P, NM = ['A', 'B', 'C', 'D'], sets = [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]], key = s.tri.join('');
          var lineSl = slopeOf(P[s.tri[0]], P[s.tri[1]]);
          var opts = sets.map(function (x) { var nm = x.map(function (i) { return NM[i]; }).join(', '); var right = x.join('') === key; var sa = slopeOf(P[x[0]], P[x[1]]), sb = slopeOf(P[x[1]], P[x[2]]);
            return { html: t(nm), right: right, why: right ? null : 'Test ' + t(nm) + ': ' + t('m_{' + NM[x[0]] + NM[x[1]] + '}=' + sT(sa)) + ' but ' + t('m_{' + NM[x[1]] + NM[x[2]] + '}=' + sT(sb)) + '.' }; });
          return B.mc(r, '(b) Exactly one set of <b>three</b> of these points is collinear. Which three?', opts,
            t(s.tri.map(function (i) { return NM[i]; }).join(',\\ ')) + ': both slopes are ' + t(sT(lineSl)) + '. Every other set contains the point off that line, which brings in a different slope: ' + sets.filter(function (x) { return x.join('') !== key; }).map(function (x) { return t('m_{' + NM[x[0]] + NM[x[2]] + '}=' + sT(slopeOf(P[x[0]], P[x[2]]))); }).join(', ') + '.', ['Use the slopes from (a): which consecutive slopes are equal?'], 'which three are collinear', true);
        } }] },
    /* ---------------- EP5 ---------------- */
    { num: '5', shared: function (r) {
        return gen(r, function (r) { var q = r.int(2, 6), p = r.int(1, 4) * (r.chance(0.75) ? -1 : 1); if (gcd(Math.abs(p), q) !== 1 || Math.abs(p) === q) return null; var W = [r.int(-10, -7), r.int(-8, 8)], v = [q, p], j = r.pick([1, 1, 2]); if (j * q * 3 > 20) return null; var X = add(W, v, j), Y = add(X, v, j), Z = add(Y, v, j); if (!inBox(Z, 12) || !inBox(W, 12)) return null; return { P: [W, X, Y, Z] }; }, { P: [[-9, 7], [-3, 3], [3, -1], [9, -5]] });
      },
      stem: function (s) { return '<b>Four more points.</b> Consider ' + setT(['W', 'X', 'Y', 'Z'], s.P) + '.'; },
      parts: [
        { id: 'e5a', sub: 'a i', level: 'EMG', make: function (r, s) { var P = s.P; return slopeFields('Are all four collinear? Find ' + t('m_{WX}') + ', ' + t('m_{XY}') + ' and ' + t('m_{YZ}') + '.', [{ nm: 'WX', A: P[0], B: P[1] }, { nm: 'XY', A: P[1], B: P[2] }, { nm: 'YZ', A: P[2], B: P[3] }], null, [SLOPE_HINT], 'four points: three slopes'); } },
        { id: 'e5a2', sub: 'a ii', level: 'BEG', make: function (r, s) {
          var sl = slopeOf(s.P[0], s.P[1]);
          return B.mc(r, 'All three slopes are ' + t(sT(sl)) + '. Are all four points collinear?', [
            { html: '<b>Yes</b> — each slope equals the next, and consecutive segments share a point, so the line never bends.', right: true },
            { html: '<b>No</b> — you would also need ' + t('m_{WY}') + ', ' + t('m_{WZ}') + ' and ' + t('m_{XZ}') + '.', why: 'Consecutive equal slopes through shared points already chain the points onto one line: ' + t('W,X,Y') + ' are collinear and ' + t('X,Y,Z') + ' are collinear on the same line.' },
            { html: '<b>No</b> — four points can never be collinear.', why: 'Any number of points can lie on one line.' }],
            'All three slopes equal ' + t(sT(sl)) + ' and each segment shares a point with the next: <b>yes</b>, all four are collinear.', ['Equal slopes through shared points → one line.'], 'four collinear verdict');
        } },
        { id: 'e5b', sub: 'b', level: 'PRG', make: function (r) {
          return B.mc(r, '(b) There are four different three-point sets you could form from ' + t('W') + ', ' + t('X') + ', ' + t('Y') + ', ' + t('Z') + '. Why do you <b>not</b> need to test all four sets separately?', [
            { html: 'Once ' + t('W') + ', ' + t('X') + ', ' + t('Y') + ' are on one line and ' + t('YZ') + ' has that same slope through the shared point ' + t('Y') + ', ' + t('Z') + ' is on that line too — so every three of them are.', right: true },
            { html: 'Because every set of three points is collinear.', why: 'Not at all — most sets of three points aren’t. These are, because they all lie on one line.' },
            { html: 'Because testing two sets always gives the same answer as testing four.', why: 'That isn’t true in general (see Question 4, where only one set worked). It works here because consecutive slopes chain all four points onto one line.' },
            { html: 'Because the points are equally spaced.', why: 'Spacing doesn’t matter. What matters is that each consecutive slope is the same and the segments share points.' }],
            'Testing consecutive pairs is enough: ' + t('m_{WX}=m_{XY}') + ' puts ' + t('W,X,Y') + ' on one line, and ' + t('m_{YZ}') + ' equal to it (sharing ' + t('Y') + ') puts ' + t('Z') + ' on the same line. All four are on one line, so any three of them are collinear.', ['Think of a chain: each link shares a point with the next.'], 'why consecutive slopes are enough');
        } }] },
    /* ---------------- EP6 ---------------- */
    { num: '6', section: 'Extra Practice B — Finding the Missing Coordinate', stem: 'Find the value of ' + t('k') + ' that makes each set collinear.', parts: [
      { id: 'e6a', level: 'EMG', make: function (r) {
        var g = gen(r, function (r) { var q = r.int(2, 5), p = r.int(1, 7) * (r.chance(0.8) ? 1 : -1); if (gcd(Math.abs(p), q) !== 1 || Math.abs(p) === q) return null; var A = [r.int(-5, -2), r.int(-6, -2)], Bp = add(A, [q, p]), C = add(Bp, [q, p]); if (!inBox(C, 14)) return null; return { A: A, B: Bp, C: C, s: [p, q] }; }, { A: [-3, -4], B: [1, 2], C: [5, 8], s: [3, 2] });
        var rise = g.C[1] - g.B[1], run = g.C[0] - g.B[0];
        return numAns('(a) ' + nP('A', g.A) + ', ' + nP('B', g.B) + ', ' + t('C(' + g.C[0] + ',\\ k)'), g.C[1], [[rise, 'k-no-start', 'That is the rise from ' + t('B') + ' to ' + t('C') + ' — add it to the height of ' + t('B') + ', ' + t(g.B[1]) + '.'], [g.B[1] - rise, 'k-sign', 'Check the sign: going right from ' + t('B') + ', the rise has the same sign as the slope.'], [g.B[1] + run * g.s[1] / g.s[0], 'k-flip', 'The rise is slope × run, not run ÷ slope.']],
          t(calc(g.A, g.B, 'AB')) + '; ' + t('\\frac{k-' + nb(g.B[1]) + '}{' + run + '}=' + sT(red(g.s[0], g.s[1])) + '\\ \\Rightarrow\\ k-' + nb(g.B[1]) + '=' + rise + '\\ \\Rightarrow\\ k=' + g.C[1]) + '.', ['Find ' + t('m_{AB}') + ' first, then make ' + t('m_{BC}') + ' equal to it.'], 'find k (y, last point)', t('k='));
      } },
      { id: 'e6b', level: 'PRG', make: function (r) {
        var g = gen(r, function (r) { var q = r.int(1, 4), p = r.int(1, 6) * (r.chance(0.75) ? -1 : 1); if (gcd(Math.abs(p), q) !== 1 || Math.abs(p) === q) return null; var D = [r.int(-4, -1), r.int(-3, 9)], c = r.pick([1, 2]), E = add(D, [q * c, p * c]), F = add(E, [q * c, p * c]); if (!inBox(F, 14) || !inBox(E, 14)) return null; return { D: D, E: E, F: F, s: red(p, q) }; }, { D: [-2, 7], E: [2, 1], F: [6, -5], s: [-3, 2] });
        var rise = g.F[1] - g.E[1], run = g.F[0] - g.E[0];
        return numAns('(b) ' + nP('D', g.D) + ', ' + nP('E', g.E) + ', ' + t('F(k,\\ ' + g.F[1] + ')') + ' — the unknown is now an ' + t('x') + '-coordinate.', g.F[0], [[run, 'k-no-start', 'That is the run from ' + t('E') + ' to ' + t('F') + ' — the run is ' + t('k-' + nb(g.E[0])) + ', so add ' + t(g.E[0]) + '.'], [g.E[0] - run, 'k-sign', 'Check the sign as you solve for the run.'], [g.E[0] + rise * sV(g.s), 'k-flip', 'The run is rise ÷ slope, not rise × slope.']],
          t(calc(g.D, g.E, 'DE')) + '; ' + t('\\frac{' + g.F[1] + '-' + nb(g.E[1]) + '}{k-' + nb(g.E[0]) + '}=' + sT(g.s) + '\\ \\Rightarrow\\ \\frac{' + rise + '}{k-' + nb(g.E[0]) + '}=' + sT(g.s) + '\\ \\Rightarrow\\ k-' + nb(g.E[0]) + '=' + run + '\\ \\Rightarrow\\ k=' + g.F[0]) + '.', ['Find ' + t('m_{DE}') + '. The unknown is in the run of ' + t('EF') + ': set ' + t('\\frac{\\text{rise}}{k-' + nb(g.E[0]) + '}') + ' equal to the slope and cross-multiply.'], 'find k (x, last point)', t('k='));
      } }] },
    /* ---------------- EP7 ---------------- */
    { num: '7', stem: 'Find ' + t('k') + '. In each case the unknown point sits <b>between</b> the two known ones, so find the slope of the outer pair first.', parts: [
      { id: 'e7a', level: 'PRG', make: function (r) {
        var g = gen(r, function (r) { var q = r.int(3, 8), p = r.int(1, 6) * (r.chance(0.8) ? 1 : -1); if (gcd(Math.abs(p), q) !== 1) return null; var P = [r.int(-5, -2), r.int(-3, 3)], Q = add(P, [q, p]), R = add(Q, [q, p]); if (!inBox(R, 14)) return null; return { P: P, Q: Q, R: R, s: red(p, q) }; }, { P: [-4, 1], Q: [3, 5], R: [10, 9], s: [4, 7] });
        var rise = g.Q[1] - g.P[1], run = g.Q[0] - g.P[0];
        return numAns('(a) ' + nP('P', g.P) + ', ' + t('Q(' + g.Q[0] + ',\\ k)') + ', ' + nP('R', g.R), g.Q[1], [[rise, 'k-no-start', 'That is the rise from ' + t('P') + ' to ' + t('Q') + ' — add the height of ' + t('P') + ', ' + t(g.P[1]) + '.'], [g.P[1] - rise, 'k-sign', 'Check the sign as you solve.']],
          t(calc(g.P, g.R, 'PR')) + '; ' + t('\\frac{k-' + nb(g.P[1]) + '}{' + g.Q[0] + '-' + nb(g.P[0]) + '}=' + sT(g.s) + '\\ \\Rightarrow\\ \\frac{k-' + nb(g.P[1]) + '}{' + run + '}=' + sT(g.s) + '\\ \\Rightarrow\\ k-' + nb(g.P[1]) + '=' + rise + '\\ \\Rightarrow\\ k=' + g.Q[1]) + '.', ['Find ' + t('m_{PR}') + ' from the two known points.', 'Then ' + t('m_{PQ}') + ' must equal it.'], 'find k (middle point, y)', t('k='));
      } },
      { id: 'e7b', level: 'PRG', make: function (r) {
        var g = gen(r, function (r) { var q = r.int(1, 4), p = r.int(1, 6); if (gcd(p, q) !== 1) return null; var S = [r.int(-6, -3), r.int(-4, -1)], j = r.int(2, 4), c = r.int(2, 4), T = add(S, [q, p], j), U = add(T, [q, p], c); if (!inBox(U, 16)) return null; return { S: S, T: T, U: U, s: [p, q] }; }, { S: [-5, -2], T: [1, 4], U: [7, 10], s: [1, 1] });
        var rise = g.T[1] - g.S[1], run = g.T[0] - g.S[0];
        return numAns('(b) ' + nP('S', g.S) + ', ' + t('T(k,\\ ' + g.T[1] + ')') + ', ' + nP('U', g.U), g.T[0], [[run, 'k-no-start', 'That is the run from ' + t('S') + ' to ' + t('T') + ' — the run is ' + t('k-' + nb(g.S[0])) + ', so add ' + t(g.S[0]) + '.'], [g.S[0] - run, 'k-sign', 'Check the sign: ' + t('k-' + nb(g.S[0]) + '=k+' + (-g.S[0])) + '.'], [g.S[0] + rise * sV(g.s), 'k-flip', 'The run is rise ÷ slope.']],
          t(calc(g.S, g.U, 'SU')) + '; ' + t('\\frac{' + g.T[1] + '-' + nb(g.S[1]) + '}{k-' + nb(g.S[0]) + '}=' + sT(g.s) + '\\ \\Rightarrow\\ \\frac{' + rise + '}{k-' + nb(g.S[0]) + '}=' + sT(g.s) + '\\ \\Rightarrow\\ k-' + nb(g.S[0]) + '=' + run + '\\ \\Rightarrow\\ k=' + g.T[0]) + '.', ['Find ' + t('m_{SU}') + ' first.', 'The unknown is in the run: cross-multiply.'], 'find k (middle point, x)', t('k='));
      } },
      { id: 'e7c', level: 'ADV', make: function (r) {
        var g = gen(r, function (r) { var E = [r.int(-4, -1), r.int(1, 5)], G = [r.int(6, 10), r.int(-6, -2)], xF = r.int(E[0] + 2, G[0] - 2); var dx = G[0] - E[0], dy = G[1] - E[1], s = red(dy, dx); if (s[1] < 5 || s[1] > 13) return null; var num = s[0] * (xF - E[0]), den = s[1]; if (num % den === 0) return null; var k = red(E[1] * den + num, den); if (Math.abs(k[0] / k[1]) > 8) return null; return { E: E, F0: xF, G: G, s: s, k: k }; }, { E: [-2, 3], F0: 4, G: [9, -4], s: [-7, 11], k: [-9, 11] });
        var run = g.F0 - g.E[0], rise = red(g.s[0] * run, g.s[1]);
        return numAns('(c) ' + nP('E', g.E) + ', ' + t('F(' + g.F0 + ',\\ k)') + ', ' + nP('G', g.G) + ' — the answer is not an integer.', g.k, [[sV(rise), 'k-no-start', 'That is the rise from ' + t('E') + ' to ' + t('F') + ' — add the height of ' + t('E') + ', ' + t(g.E[1]) + '.'], [g.E[1] - sV(rise), 'k-sign', 'Check the sign: the slope is ' + (g.s[0] < 0 ? 'negative, so ' + t('F') + ' is lower than ' + t('E') : 'positive') + '.']],
          t(calc(g.E, g.G, 'EG')) + '<br>' + t('\\frac{k-' + nb(g.E[1]) + '}{' + g.F0 + '-' + nb(g.E[0]) + '}=' + sT(g.s) + '\\ \\Rightarrow\\ k-' + nb(g.E[1]) + '=' + sT(g.s) + '\\times ' + run + '=' + sT(rise) + '\\ \\Rightarrow\\ k=' + sT(g.k)) + '.', ['Find ' + t('m_{EG}') + ' — it is a fraction that doesn’t reduce much.', 'Multiply both sides by the run ' + t(run) + ', then add ' + t(g.E[1]) + ' (as a fraction).'], 'find k (fraction answer)', t('k='));
      } }] },
    /* ---------------- EP8 ---------------- */
    { num: '8', stem: 'Harder: in each set the unknown appears <b>twice</b>.', parts: [
      { id: 'e8a', level: 'ADV', make: function (r) {
        var g = gen(r, function (r) { var m = r.int(2, 4), y0 = r.int(1, 6), A = [0, y0]; var k = y0 / (1 - m); if (!Number.isInteger(k)) return null; var C = [r.int(2, 5), 0]; C[1] = y0 + m * C[0]; if (C[1] > 22 || sameP([k, k], A)) return null; return { A: A, C: C, m: m, k: k }; }, { A: [0, 1], C: [4, 9], m: 2, k: -1 });
        var p = B.fields('(a) ' + nP('A', g.A) + ', ' + t('B(k,\\ k)') + ' and ' + nP('C', g.C) + ' are collinear. Find ' + t('k') + ', then state the coordinates of ' + t('B') + '.', [{ label: t('k='), mode: 'math', keys: 'pairs', placeholder: 'e.g. -2' }, ptField('B')],
          [stripVar(K.number(g.k, dg([[-g.k, 'k-sign', 'Check the signs as you collect the ' + t('k') + '-terms.'], [g.A[1] / (1 + g.m), 'k-sign', 'Check the signs as you collect the ' + t('k') + '-terms: ' + t('k-' + g.A[1] + '=' + g.m + 'k') + '.']], g.k))), ptChk([g.k, g.k], [[[-g.k, -g.k], 'k-sign', 'Both coordinates of ' + t('B') + ' are ' + t('k') + '. Check the sign of ' + t('k') + '.']])],
          [String(g.k), '(' + g.k + ', ' + g.k + ')'], t('k=' + g.k + ',\\ B(' + g.k + ',\\ ' + g.k + ')'),
          t('m_{AC}=\\frac{' + g.C[1] + '-' + g.A[1] + '}{' + g.C[0] + '-0}=' + g.m) + '<br>' + t('m_{AB}=\\frac{k-' + g.A[1] + '}{k-0}=' + g.m + '\\ \\Rightarrow\\ k-' + g.A[1] + '=' + g.m + 'k\\ \\Rightarrow\\ ' + (1 - g.m) + 'k=' + g.A[1] + '\\ \\Rightarrow\\ k=' + g.k) + '<br>So ' + t('B(' + g.k + ',\\ ' + g.k + ')') + '. Check: ' + t('m_{AB}=\\frac{' + g.k + '-' + g.A[1] + '}{' + g.k + '}=' + g.m) + ' ✓',
          ['Find ' + t('m_{AC}') + ' first. Then write ' + t('m_{AB}') + ' with ' + t('B(k,\\ k)') + ' and set it equal.', 'Multiply both sides by ' + t('k') + ', then collect the ' + t('k') + '-terms on one side.'], 'B(k,k) collinear');
        p.bad = [[String(-g.k), '(' + (-g.k) + ', ' + (-g.k) + ')']]; return p;
      } },
      { id: 'e8b', level: 'ADV', make: function (r) {
        var g = gen(r, function (r) { var q = r.int(2, 3), p = r.int(1, 4) * (r.chance(0.8) ? 1 : -1); if (gcd(Math.abs(p), q) !== 1) return null; var x1 = r.int(-4, -1), y1 = r.int(-2, 6), j = r.int(1, 2), x2 = x1 + q * j, k = y1 + p * j, c = r.int(1, 3), x3 = x2 + q * c * 2, d = p * c * 2; if (x2 === 0 && false) return null; if (Math.abs(k) > 15 || Math.abs(d) > 16) return null; return { P1: [x1, y1], x2: x2, x3: x3, d: d, k: k, s: [p, q] }; }, { P1: [-2, 5], x2: 1, x3: 7, d: 8, k: 9, s: [4, 3] });
        var run1 = g.x2 - g.P1[0], run2 = g.x3 - g.x2, dT = g.d > 0 ? '+' + g.d : String(g.d);
        return numAns('(b) ' + t(ptT(g.P1)) + ', ' + t('(' + g.x2 + ',\\ k)') + ' and ' + t('(' + g.x3 + ',\\ k' + dT + ')') + ' are collinear. Find ' + t('k') + '.', g.k, [[g.P1[1] - sV(g.s) * run1, 'k-sign', 'Check the sign as you solve.'], [sV(g.s) * run1, 'k-no-start', 'That is the rise from the first point — add its height, ' + t(g.P1[1]) + '.']],
          'The last two points: ' + t('m=\\frac{(k' + dT + ')-k}{' + g.x3 + '-' + nb(g.x2) + '}=\\frac{' + g.d + '}{' + run2 + '}=' + sT(g.s)) + ', whatever ' + t('k') + ' is.<br>' + t('\\frac{k-' + nb(g.P1[1]) + '}{' + g.x2 + '-' + nb(g.P1[0]) + '}=' + sT(g.s) + '\\ \\Rightarrow\\ k-' + nb(g.P1[1]) + '=' + sT(g.s) + '\\times ' + run1 + '=' + sV(g.s) * run1 + '\\ \\Rightarrow\\ k=' + g.k) + '.',
          ['The slope between the last two points can be found without knowing ' + t('k') + ': the rise is ' + t('(k' + dT + ')-k') + '.', 'Then set the slope from the first point to ' + t('(' + g.x2 + ',\\ k)') + ' equal to it.'], 'unknown twice');
      } }] },
    /* ---------------- EP9 ---------------- */
    { num: '9', section: 'Extra Practice C — Two Different Methods, and Two Tempting Errors', shared: function (r) {
        return gen(r, function (r) { var v = r.pick([[4, 3], [3, 4], [4, -3], [3, -4]]), A = [r.int(-6, -3), r.int(-5, 2)], a = 1, c = r.pick([1, 2, 2]), Bp = add(A, v, a), C = add(Bp, v, c); if (!inBox(C, 12)) return null; return { A: A, B: Bp, C: C }; }, { A: [-4, -1], B: [0, 2], C: [8, 8] });
      },
      stem: function (s) { return 'Consider ' + nP('A', s.A) + ', ' + nP('B', s.B) + ' and ' + nP('C', s.C) + '. A second way to test three points: if ' + t('B') + ' lies on segment ' + t('AC') + ', then ' + t('AB+BC=AC') + '. Distances come from ' + t('d=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}') + '.'; },
      parts: [
        { id: 'e9a', level: 'BEG', make: function (r, s) { return slopeFields('(a) Test for collinearity using <b>slopes</b>: find ' + t('m_{AB}') + ' and ' + t('m_{BC}') + '.', [{ nm: 'AB', A: s.A, B: s.B }, { nm: 'BC', A: s.B, B: s.C }], t(calc(s.A, s.B, 'AB')) + '<br>' + t(calc(s.B, s.C, 'BC')) + '<br>Equal slopes sharing ' + t('B') + ': collinear.', [SLOPE_HINT], 'two methods: slopes'); } },
        { id: 'e9b', level: 'EMG', make: function (r, s) {
          var L = [[s.A, s.B, 'AB'], [s.B, s.C, 'BC'], [s.A, s.C, 'AC']];
          var chk = function (X, Y) { var n = d2(X, Y), dx = Math.abs(Y[0] - X[0]), dy = Math.abs(Y[1] - X[1]); return K.number(Math.sqrt(n), function (v) { if (near(v, n)) return { code: 'len-no-root', hint: 'That is ' + t('d^{2}') + ' — take the square root.' }; if (near(v, dx + dy)) return { code: 'sum-sq', hint: 'Square the run and the rise <b>before</b> adding, then take the square root.' }; return null; }); };
          var p = B.fields('(b) Test again using <b>distances</b>: find ' + t('AB') + ', ' + t('BC') + ' and ' + t('AC') + '.', L.map(function (x) { return { label: t(x[2] + '=') }; }), L.map(function (x) { return chk(x[0], x[1]); }), L.map(function (x) { return String(len(x[0], x[1])); }),
            t(L.map(function (x) { return x[2] + '=' + len(x[0], x[1]); }).join(',\\ ')),
            L.map(function (x) { return t(x[2] + '=\\sqrt{' + nb(x[1][0] - x[0][0]) + '^{2}+' + nb(x[1][1] - x[0][1]) + '^{2}}=\\sqrt{' + d2(x[0], x[1]) + '}=' + len(x[0], x[1])); }).join('<br>') + '<br>' + t(len(s.A, s.B) + '+' + len(s.B, s.C) + '=' + len(s.A, s.C)) + ': ' + t('AB+BC=AC') + ', so the points are collinear.',
            ['Distance formula for each pair of points.', 'Square the run and the rise, add, then take the square root.'], 'two methods: distances');
          p.bad = [L.map(function (x) { return String(d2(x[0], x[1])); })]; return p;
        } },
        { id: 'e9c', level: 'BEG', make: function (r) {
          return B.mc(r, '(c) Both methods agree here. Which was less work, and why?', [
            { html: 'The slope test: two subtractions and a division for each slope, with exact fractions.', right: true },
            { html: 'The distance test: it uses all three points at once.', why: 'It needs three distances, each with two squares, a sum and a square root, before you can add and compare.' },
            { html: 'They are the same amount of work, because they use the same coordinates.', why: 'Count the steps: a slope is two subtractions and a division; a distance is two subtractions, two squares, a sum and a square root — and you need three of them.' }],
            'The slope test: each slope is two subtractions and a division, and comparing two fractions is immediate. The distance test needs three square roots.', ['Count the operations in each test.'], 'which test is less work');
        } }] },
    /* ---------------- EP10 ---------------- */
    { num: '10', shared: function (r) {
        return gen(r, function (r) {
          var v1 = r.pick([[4, 3], [3, 4], [4, -3], [5, 2], [2, 3], [3, 2]]), v2 = [r.int(5, 9), r.int(-7, 8)];
          var s1 = red(v1[1], v1[0]), s2 = red(v2[1], v2[0]); if (sEq(s1, s2) || Math.abs(Math.atan2(v1[1], v1[0]) - Math.atan2(v2[1], v2[0])) > 0.25) return null;
          var D = [r.int(-5, -2), r.int(-4, 0)], E = add(D, v1), F = add(E, v2); if (!inBox(F, 13)) return null;
          var a = len(D, E), b = len(E, F), c = len(D, F);
          if (Math.abs(K.roundTo(a, 1) + K.roundTo(b, 1) - K.roundTo(c, 1)) > 1e-9) return null;
          if (a + b - c < 0.002) return null;
          return { D: D, E: E, F: F };
        }, { D: [-3, -2], E: [1, 1], F: [9, 8] });
      },
      stem: function (s) { return 'Now consider ' + nP('D', s.D) + ', ' + nP('E', s.E) + ' and ' + nP('F', s.F) + '.'; },
      parts: [
        { id: 'e10a', level: 'EMG', make: function (r, s) {
          var L = [[s.D, s.E, 'DE'], [s.E, s.F, 'EF'], [s.D, s.F, 'DF']];
          var chk = function (X, Y) { var n = d2(X, Y), dx = Math.abs(Y[0] - X[0]), dy = Math.abs(Y[1] - X[1]); var c = K.approx(Math.sqrt(n), 1, { diag: function (v) { if (near(v, n)) return { code: 'len-no-root', hint: 'That is ' + t('d^{2}') + ' — take the square root.' }; if (near(v, dx + dy)) return { code: 'sum-sq', hint: 'Square the run and the rise <b>before</b> adding.' }; return null; } }); return c; };
          var rd = function (x) { return K.roundTo(len(x[0], x[1]), 1).toFixed(1); };
          var p = B.fields('(a) Find ' + t('DE') + ', ' + t('EF') + ' and ' + t('DF') + ', each rounded to one decimal place.', L.map(function (x) { return { label: t(x[2] + '\\approx') }; }), L.map(function (x) { return chk(x[0], x[1]); }), L.map(rd),
            t(L.map(function (x) { return x[2] + '\\approx ' + rd(x); }).join(',\\ ')),
            L.map(function (x) { return t(x[2] + '=\\sqrt{' + nb(x[1][0] - x[0][0]) + '^{2}+' + nb(x[1][1] - x[0][1]) + '^{2}}=\\sqrt{' + d2(x[0], x[1]) + '}\\approx ' + rd(x)); }).join('<br>') + '<br>' + t(rd(L[0]) + '+' + rd(L[1]) + '=' + K.roundTo(Number(rd(L[0])) + Number(rd(L[1])), 1).toFixed(1)) + ': ' + t('DE+EF') + ' <b>appears</b> to equal ' + t('DF') + '.',
            ['Distance formula for each pair, then round each to one decimal place.'], 'rounded distances');
          p.bad = [L.map(function (x) { return String(d2(x[0], x[1])); })]; return p;
        } },
        { id: 'e10b', level: 'BEG', make: function (r, s) { return slopeFields('(b) Now use slopes: find ' + t('m_{DE}') + ' and ' + t('m_{EF}') + '.', [{ nm: 'DE', A: s.D, B: s.E }, { nm: 'EF', A: s.E, B: s.F }], t(calc(s.D, s.E, 'DE')) + '<br>' + t(calc(s.E, s.F, 'EF')) + '<br>' + t(sT(slopeOf(s.D, s.E)) + '\\ne ' + sT(slopeOf(s.E, s.F))) + ': <b>not collinear</b>.', [SLOPE_HINT], 'slopes: the verdict'); } },
        { id: 'e10c', level: 'PRG', make: function (r, s) {
          var a = len(s.D, s.E), b = len(s.E, s.F), c = len(s.D, s.F), s1 = slopeOf(s.D, s.E), s2 = slopeOf(s.E, s.F);
          return B.mc(r, '(c) The rounded distances say ' + t('DE+EF=DF') + ', but the slopes ' + t(sT(s1)) + ' and ' + t(sT(s2)) + ' are different. Which do you trust, and why?', [
            { html: 'The slopes: they are exact fractions and clearly different. Rounding hid a tiny difference in the distances, so the points are <b>not</b> collinear.', right: true },
            { html: 'The distances: they use all three points, so the points <b>are</b> collinear.', why: 'Rounded decimals can hide a small difference. Without rounding, ' + t('DE+EF\\approx ' + (a + b).toFixed(3)) + ' and ' + t('DF\\approx ' + c.toFixed(3)) + '.' },
            { html: 'Neither — the two methods disagree, so you can’t decide.', why: 'Only one of them is exact. The exact fractions ' + t(sT(s1)) + ' and ' + t(sT(s2)) + ' settle it.' },
            { html: 'The slopes, because the slope test always gives “not collinear” for near misses.', why: 'The slope test is right because it is <b>exact</b>, not because of a rule about near misses.' }],
            'Trust the slopes. ' + t(sT(s1) + '\\ne ' + sT(s2)) + ' exactly. Unrounded, ' + t('DE+EF\\approx ' + (a + b).toFixed(3)) + ' while ' + t('DF\\approx ' + c.toFixed(3)) + ': they differ by about ' + t((a + b - c).toFixed(3)) + ', small enough to vanish when each length is rounded to one decimal place. Exact comparisons beat rounded decimals.', ['Which method uses exact values?'], 'which method to trust');
        } }] },
    /* ---------------- EP11 ---------------- */
    { num: '11', shared: function (r) {
        return gen(r, function (r) { var q = r.int(1, 3), p = r.int(1, 4); if (gcd(p, q) !== 1 || p === q) return null; var A = [0, 0], Bp = [q, p], C = [r.int(1, 3), r.int(2, 5)], D = add(C, [q, p]); if (col3(A, Bp, C) || sameP(C, Bp)) return null; return { A: A, B: Bp, C: C, D: D, s: [p, q] }; }, { A: [0, 0], B: [2, 3], C: [1, 4], D: [3, 7], s: [3, 2] });
      },
      stem: function (s) { return '<b>Error analysis.</b> Marcus is asked whether ' + nP('A', s.A) + ', ' + nP('B', s.B) + ', ' + nP('C', s.C) + ' and ' + nP('D', s.D) + ' are collinear. He calculates ' + t('m_{AB}=' + sT(s.s)) + ' and ' + t('m_{CD}=' + sT(s.s)) + ', sees that they match, and answers “yes, all four are collinear.”'; },
      parts: [
        { id: 'e11a', level: 'PRG', make: function (r) {
          return B.mc(r, '(a) Both of his slopes are correct. Why is his conclusion still wrong? What do two equal slopes with <b>no shared point</b> tell you?', [
            { html: 'They only show ' + t('AB') + ' and ' + t('CD') + ' are <b>parallel</b>. To prove collinear, the two segments must share a point (e.g. compare ' + t('m_{AB}') + ' with ' + t('m_{BC}') + ').', right: true },
            { html: 'He should have multiplied the slopes to check for ' + t('-1') + '.', why: 'A product of ' + t('-1') + ' tests for perpendicular. The problem is that ' + t('AB') + ' and ' + t('CD') + ' share no point.' },
            { html: 'Nothing is wrong — equal slopes always mean collinear.', why: 'Two train tracks have equal slopes but never meet. Equal slopes without a shared point mean parallel.' },
            { html: 'Four points can never be collinear.', why: 'Any number of points can be collinear. The issue is the missing shared point.' }],
            'Equal slopes with no point in common mean the segments are <b>parallel</b>, not on the same line — ' + t('AB') + ' and ' + t('CD') + ' could be two different parallel segments. The slope test needs a shared point, e.g. ' + t('m_{AB}') + ' and ' + t('m_{BC}') + '.', ['Picture two parallel train tracks.'], 'equal slopes, no shared point');
        } },
        { id: 'e11b', level: 'BEG', make: function (r, s) { var sAC = slopeOf(s.A, s.C); return slopeAns('(b) Calculate ' + t('m_{AC}') + ' to settle the question.', sAC, slopeChk(sAC), t(calc(s.A, s.C, 'AC')) + ' ' + t('\\ne ' + sT(s.s)) + ', so ' + t('C') + ' is not on line ' + t('AB') + ': the four points are <b>not</b> collinear.', [SLOPE_HINT], 'm_AC settles it', t('m_{AC}=')); } }] },
    /* ---------------- EP12 ---------------- */
    { num: '12', shared: function (r) {
        return gen(r, function (r) { var q = r.int(2, 5), p = r.int(1, 5); if (gcd(p, q) !== 1) return null; var A = [r.int(-4, -1), r.int(1, 5)], Bp = add(A, [q, -p]), C = add(Bp, [q, -p]); if (!inBox(C, 12) || A[1] - Bp[1] === Bp[0] - A[0] && false) return null; if (Bp[1] >= 0) return null; return { A: A, B: Bp, C: C, s: [-p, q] }; }, { A: [-2, 3], B: [2, -1], C: [6, -5], s: [-1, 1] });
      },
      stem: function (s) { var dy = s.A[1] - s.B[1], dx = s.B[0] - s.A[0]; return '<b>Error analysis.</b> Testing ' + nP('A', s.A) + ', ' + nP('B', s.B) + ', ' + nP('C', s.C) + ', Jaya writes \\[m_{AB}=\\frac{y_A-y_B}{x_B-x_A}=\\frac{' + s.A[1] + '-' + nb(s.B[1]) + '}{' + s.B[0] + '-' + nb(s.A[0]) + '}=' + sT(red(dy, dx)) + ',\\]\\[m_{BC}=\\frac{y_C-y_B}{x_C-x_B}=\\frac{' + s.C[1] + '-' + nb(s.B[1]) + '}{' + s.C[0] + '-' + nb(s.B[0]) + '}=' + sT(s.s) + '\\] and concludes the points are not collinear.'; },
      parts: [
        { id: 'e12a', level: 'EMG', make: function (r) {
          return B.mc(r, '(a) Look closely at her first fraction. What did she do differently there?', [
            { html: 'She subtracted the ' + t('y') + '’s as ' + t('A-B') + ' but the ' + t('x') + '’s as ' + t('B-A') + ' — opposite orders, which flips the sign.', right: true },
            { html: 'She put the run over the rise.', why: 'The top has the ' + t('y') + '-values, so it is rise over run. Compare the <b>order</b> of the subtractions on the top and the bottom.' },
            { html: 'She should have added the coordinates.', why: 'Slope always subtracts. The trouble is the order of the subtraction.' },
            { html: 'Nothing — her slopes are right and the points really aren’t collinear.', why: 'Check the order of the points in each subtraction of her first fraction.' }],
            'In the first fraction she used ' + t('y_A-y_B') + ' on top but ' + t('x_B-x_A') + ' on the bottom. Reversing only one of the two subtractions multiplies the whole fraction by ' + t('-1') + ', so the sign flips.', ['Compare the order of the points on the top and on the bottom.'], 'find the sign error');
        } },
        { id: 'e12b', sub: 'b i', level: 'BEG', make: function (r, s) { return slopeAns('Redo ' + t('m_{AB}') + ' correctly.', s.s, slopeChk(s.s, dnDiag(s.A, s.B)), 'Same order, ' + t('B') + ' minus ' + t('A') + ': ' + t(calc(s.A, s.B, 'AB')) + '.', [SLOPE_HINT], 'corrected slope', t('m_{AB}=')); } },
        { id: 'e12c', sub: 'b ii', level: 'LIM', make: function (r, s) { return verdictMC(r, 'With the corrected ' + t('m_{AB}=' + sT(s.s)) + ' and ' + t('m_{BC}=' + sT(s.s)) + ', what is the right conclusion?', true, { names: ['A', 'B', 'C'], s1: s.s, s2: s.s }, t('m_{AB}=m_{BC}=' + sT(s.s)) + ', sharing ' + t('B') + ': the points <b>are</b> collinear.', 'corrected conclusion'); } }] },
    /* ---------------- EP13 ---------------- */
    { num: '13', section: 'Extra Practice D — Data, Reasoning, Figures, and Stretch', shared: function (r) {
        return gen(r, function (r) { var rate = r.pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.05, 0.12]), step = r.pick([20, 30, 40, 25]), m0 = r.pick([10, 20, 30]), L0 = r.int(80, 160) / 10; var ms = [m0, m0 + step, m0 + 2 * step], Ls = ms.map(function (m) { return Math.round((L0 + rate * (m - m0)) * 100) / 100; }); if (Ls.some(function (L) { return Math.abs(L * 10 - Math.round(L * 10)) > 1e-9; })) return null; var M = ms[2] + r.pick([20, 30, 40, 50]), bump = r.pick([0.5, -0.5, 1, 0.4]); return { ms: ms, Ls: Ls, rate: rate, M: M, pred: Math.round((Ls[2] + rate * (M - ms[2])) * 1000) / 1000, bump: bump }; }, { ms: [20, 50, 80], Ls: [12.5, 17, 21.5], rate: 0.15, M: 100, pred: 24.5, bump: 0.5 });
      },
      stem: function (s) { return 'A student hangs masses from a spring and records its length.' + HW.valueTable([['Mass (g)'].concat(s.ms), ['Length (cm)'].concat(s.Ls.map(function (L) { return L.toFixed(1); }))]); },
      parts: [
        { id: 'e13a', level: 'EMG', make: function (r, s) {
          var r1 = s.rate, f = function (v) { return K.slope(Ln.toFr(v), { lowest: false, diag: function (x) { if (near(x, 1 / v)) return { code: 'u6l8-rate-units', hint: 'That is grams per centimetre. Slope = change in length ÷ change in mass.' }; return null; } }); };
          var dl = (s.Ls[1] - s.Ls[0]).toFixed(1), dl2 = (s.Ls[2] - s.Ls[1]).toFixed(1), step = s.ms[1] - s.ms[0];
          var p = B.fields('(a) Treat each row as a point (mass, length). Find the slope between the first two points and between the last two points.', [{ label: 'First two:', mode: 'math', keys: 'slope', placeholder: 'e.g. 0.2' }, { label: 'Last two:', mode: 'math', keys: 'slope', placeholder: 'e.g. 0.2' }], [f(r1), f(r1)], [String(r1), String(r1)],
            t('m=' + r1) + ' both times — collinear', t('m_1=\\frac{' + s.Ls[1].toFixed(1) + '-' + s.Ls[0].toFixed(1) + '}{' + s.ms[1] + '-' + s.ms[0] + '}=\\frac{' + dl + '}{' + step + '}=' + r1) + '<br>' + t('m_2=\\frac{' + s.Ls[2].toFixed(1) + '-' + s.Ls[1].toFixed(1) + '}{' + s.ms[2] + '-' + s.ms[1] + '}=\\frac{' + dl2 + '}{' + step + '}=' + r1) + '<br>Equal slopes through the shared middle point: the three points are <b>collinear</b>.',
            ['Slope = change in length ÷ change in mass.', 'A decimal answer such as 0.2 is fine here.'], 'spring data: slopes');
          p.bad = [[String(Math.round(1 / r1 * 1000) / 1000), String(r1)]]; return p;
        } },
        { id: 'e13b', sub: 'b i', level: 'BEG', make: function (r, s) {
          return B.mc(r, 'The slope is ' + t(s.rate) + '. What does it mean?', [
            { html: 'The spring stretches ' + t(s.rate) + ' cm for each extra gram (cm per g).', right: true },
            { html: 'The spring stretches ' + t(s.rate) + ' g for each extra centimetre.', why: 'The slope is change in <b>length</b> (cm) over change in <b>mass</b> (g): centimetres per gram.' },
            { html: 'The spring is ' + t(s.rate) + ' cm long with no mass on it.', why: 'That would be a starting value, not a rate. The slope tells how fast the length changes.' },
            { html: 'The spring stretches ' + t(s.rate) + ' cm for every ' + t(s.ms[1] - s.ms[0]) + ' g.', why: 'Divide the change in length by the change in mass: the slope is per <b>one</b> gram.' }],
            'Slope = ' + t('\\frac{\\text{change in length (cm)}}{\\text{change in mass (g)}}') + ' ' + t('=' + s.rate) + ' cm per g: each extra gram stretches the spring ' + t(s.rate) + ' cm.', ['Units of the slope: units of the vertical axis per unit of the horizontal axis.'], 'interpret the slope');
        } },
        { id: 'e13c', sub: 'b ii', level: 'PRG', make: function (r, s) {
          var dm = s.M - s.ms[2];
          return numAns('Predict the spring’s length at a mass of ' + t(s.M) + ' g.', s.pred, [[Math.round(s.rate * dm * 1000) / 1000, 'u6l8-predict-mass', 'That is how much it stretches from ' + t(s.ms[2]) + ' g — add it to the length at ' + t(s.ms[2]) + ' g, ' + t(s.Ls[2].toFixed(1)) + ' cm.'], [Math.round(s.rate * s.M * 1000) / 1000, 'u6l8-predict-start', 'Rate × mass leaves out the starting length. Start from a data point, e.g. ' + t(s.Ls[2].toFixed(1)) + ' cm at ' + t(s.ms[2]) + ' g.'], [Math.round((s.Ls[0] + s.rate * dm) * 1000) / 1000, 'u6l8-predict-start', 'Start from the point you measured the extra mass from: ' + t(dm) + ' g more than ' + t(s.ms[2]) + ' g, so start at ' + t(s.Ls[2].toFixed(1)) + ' cm.']],
            'From ' + t(s.ms[2]) + ' g to ' + t(s.M) + ' g is ' + t(dm) + ' g more: ' + t(s.Ls[2].toFixed(1) + '+' + s.rate + '\\times ' + dm + '=' + s.pred) + ' cm.', ['Start at the last row and add the rate times the extra mass.'], 'predict the length', null, ' cm');
        } },
        { id: 'e13d', sub: 'c', level: 'EMG', make: function (r, s) {
          var L3 = Math.round((s.Ls[2] + s.bump) * 10) / 10, step = s.ms[2] - s.ms[1], m2 = (L3 - s.Ls[1]) / step;
          var m2T = sT(Ln.toFr(Math.round(m2 * 1e6) / 1e6)), m2D = (Math.round(m2 * 1000) / 1000);
          return B.mc(r, '(c) A repeat of the experiment gives ' + t(L3.toFixed(1)) + ' cm instead of ' + t(s.Ls[2].toFixed(1)) + ' cm at ' + t(s.ms[2]) + ' g (the other rows are the same). Are the new three points collinear?', [
            { html: '<b>No</b> — the last slope is now ' + t(m2T + '\\approx ' + m2D) + ', not ' + t(s.rate) + ': the second run isn’t perfectly linear (likely a measurement error).', right: true },
            { html: '<b>Yes</b> — the change is too small to matter.', why: 'Collinear means the slopes are <b>exactly</b> equal. ' + t(m2D) + ' is not ' + t(s.rate) + '.' },
            { html: '<b>Yes</b> — the masses are still equally spaced.', why: 'Equal steps in mass aren’t enough: the steps in length must be equal too.' },
            { html: '<b>No</b> — the spring got shorter.', why: 'Check the table: the length still ' + (s.bump > 0 ? 'increases' : 'increases, just by less') + '. The reason is that the two slopes differ.' }],
            'New last slope: ' + t('\\frac{' + L3.toFixed(1) + '-' + s.Ls[1].toFixed(1) + '}{' + step + '}=' + m2T + '\\approx ' + m2D) + ', but the first slope is still ' + t(s.rate) + '. Not equal, so the new points are <b>not collinear</b>: the repeat isn’t perfectly linear — likely a measurement error, or the spring was stretched too far.', ['Recalculate only the slope that uses the changed row.'], 'new data collinear?');
        } }] },
    /* ---------------- EP14 ---------------- */
    { num: '14', stem: '<b>Reasoning.</b>', parts: [
      { id: 'e14a', level: 'BEG', make: function (r) {
        return B.mc(r, '(a) Why is asking “are these <b>two</b> points collinear?” never an interesting question?', [
          { html: 'Any two different points always lie on exactly one line, so two points are always collinear.', right: true },
          { html: 'Two points are never collinear — you need three.', why: 'A ruler can always be laid through two points: they are always collinear.' },
          { html: 'You can’t find a slope with only two points.', why: 'Two points are exactly what a slope needs. The point is that they always lie on one line.' }],
          'Any two distinct points lie on exactly one line, so two points are always collinear — there is nothing to decide. Collinearity only becomes a real question with three or more points.', ['Can you always lay a ruler through two points?'], 'two points always collinear');
      } },
      { id: 'e14b', sub: 'b i', level: 'EMG', make: function (r) {
        return B.mc(r, 'If ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ' are collinear, must ' + t('B') + ' lie <b>between</b> ' + t('A') + ' and ' + t('C') + ' on the line?', [
          { html: '<b>No</b> — the order the points are listed in has nothing to do with where they are on the line.', right: true },
          { html: '<b>Yes</b> — the middle letter is always the middle point.', why: 'Letters are just names. For example ' + t('(0,0)') + ', ' + t('(6,6)') + ', ' + t('(2,2)') + ' are collinear, but the middle-listed point is at the far end.' },
          { html: '<b>Yes</b> — otherwise ' + t('m_{AB}') + ' and ' + t('m_{BC}') + ' couldn’t be equal.', why: 'Try ' + t('(0,0)') + ', ' + t('(6,6)') + ', ' + t('(2,2)') + ': both slopes are ' + t('1') + ', yet ' + t('(6,6)') + ' is not in the middle.' }],
          'No. Listing order has nothing to do with position: ' + t('(0,0)') + ', ' + t('(6,6)') + ', ' + t('(2,2)') + ' are collinear (all slopes ' + t('1') + '), but the middle-listed ' + t('(6,6)') + ' is the far end.', ['Try a quick example on a line such as ' + t('y=x') + '.'], 'must B be between');
      } },
      { id: 'e14c', sub: 'b ii', level: 'PRG', make: function (r) {
        var ex0 = gen(r, function (r) { var v = r.pick([[1, 1], [1, 2], [2, 1], [1, -1], [1, 3]]), A = [r.int(-3, 2), r.int(-3, 2)], i = r.int(3, 5), j = r.int(1, i - 1); return [A, add(A, v, i), add(A, v, j)]; }, [[0, 0], [6, 6], [2, 2]]);
        var rd = function (s) { var p = Ln.readPoint(String(s == null ? '' : s)); return p && p.kind === 'pt' ? [p.p[0].v, p.p[1].v] : null; };
        var chk = function (resp) {
          resp = resp || []; var P = [0, 1, 2].map(function (i) { return rd(resp[i]); });
          if (P.some(function (x) { return !x; })) return form('unreadable', 'Write each point as an ordered pair, e.g. ' + t('(2,\\ 2)') + '.');
          for (var i = 0; i < 3; i++) for (var j = i + 1; j < 3; j++) if (near(P[i][0], P[j][0]) && near(P[i][1], P[j][1])) return wrong('u6l8-same-point', 'Use three <b>different</b> points.');
          var cr = (P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[1][1] - P[0][1]) * (P[2][0] - P[0][0]);
          if (Math.abs(cr) > 1e-9) return wrong('u6l8-not-collinear', 'Your three points aren’t collinear: ' + t('m_{AB}') + ' and ' + t('m_{BC}') + ' must be equal. Pick them all on one line, e.g. ' + t('y=x') + '.');
          var dot = (P[0][0] - P[1][0]) * (P[2][0] - P[1][0]) + (P[0][1] - P[1][1]) * (P[2][1] - P[1][1]);
          if (dot < 0) return wrong('u6l8-middle', 'Collinear — but ' + t('B') + ' (the middle-listed point) is between ' + t('A') + ' and ' + t('C') + '. Move ' + t('B') + ' past one of the ends.');
          return ok();
        };
        var key = ex0.map(function (P) { return '(' + P[0] + ', ' + P[1] + ')'; });
        var p = B.fields('Give three specific collinear points ' + t('A') + ', ' + t('B') + ', ' + t('C') + ' where the middle-listed one, ' + t('B') + ', is <b>not</b> in the middle.', [ptField('A'), ptField('B'), ptField('C')], [function () { return ok(); }, function () { return ok(); }, function () { return ok(); }], key,
          'For example ' + t('A' + ptT(ex0[0]) + ',\\ B' + ptT(ex0[1]) + ',\\ C' + ptT(ex0[2])), 'For example ' + t('A' + ptT(ex0[0]) + ',\\ B' + ptT(ex0[1]) + ',\\ C' + ptT(ex0[2])) + ': ' + t('m_{AB}=' + sT(slopeOf(ex0[0], ex0[1])) + '=m_{BC}') + ', so they are collinear, but ' + t('C') + ' is the point between the other two. Any three points on one line with ' + t('B') + ' at an end work.',
          ['Pick a simple line, e.g. ' + t('y=x') + ', and three points on it.', 'Put the point you call ' + t('B') + ' at one end.'], 'example: middle-listed not in the middle');
        p.check = chk;
        p.bad = [['(0, 0)', '(1, 1)', '(2, 2)'], ['(0, 0)', '(1, 2)', '(2, 2)']];
        p.good = [['(0, 0)', '(6, 6)', '(2, 2)'], ['(1, 2)', '(-3, -6)', '(2, 4)']];
        return p;
      } }] },
    /* ---------------- EP15 ---------------- */
    { num: '15', shared: function (r) {
        var fb = { pts: { A: [-5, -3], B: [-1, -1], C: [3, 1], D: [-4, 5], E: [0, 1], F: [4, -3], G: [2, -5], H: [-5, 1] }, lines: [['A', 'B', 'C'], ['D', 'E', 'F'], ['C', 'E', 'H']], left: 'G' };
        var tries = 0, res = null;
        while (!res && tries++ < 12) res = gen(r, function (r) {
          function dir(r) { if (r.chance(0.08)) return [0, 1]; var q = r.int(1, 3), p = r.int(-3, 3); if (gcd(p, q) !== 1) return null; return [q, p]; }
          var C = [r.int(-5, 5), r.int(-5, 5)], E = [r.int(-5, 5), r.int(-5, 5)]; if (sameP(C, E)) return null;
          var d3 = [E[0] - C[0], E[1] - C[1]], g3 = gcd(d3[0], d3[1]); if (g3 > 2) return null;
          var u3 = [d3[0] / g3, d3[1] / g3], H = add(E, u3, r.pick([1, 2]) * (g3 === 1 ? 1 : 1));
          var d1 = dir(r), d2 = dir(r); if (!d1 || !d2) return null;
          var A = add(C, d1, -r.int(2, 4)), Bp = add(C, d1, -r.int(1, 1)); if (r.chance(0.4)) Bp = add(C, d1, r.int(1, 2));
          var D = add(E, d2, r.int(1, 3)), F = add(E, d2, -r.int(1, 3)), G = [r.int(-6, 6), r.int(-6, 6)];
          var P = [A, Bp, C, D, E, F, G, H]; if (!P.every(function (X) { return inBox(X, 6); }) || !distinct(P)) return null;
          var trip = []; for (var i = 0; i < 8; i++) for (var j = i + 1; j < 8; j++) for (var k = j + 1; k < 8; k++) if (col3(P[i], P[j], P[k])) trip.push([i, j, k]);
          if (trip.length !== 3) return null;
          if (trip.some(function (x) { return x.indexOf(6) >= 0; })) return null;
          var sl = trip.map(function (x) { return slopeOf(P[x[0]], P[x[1]]); }); if (sl.some(function (s) { return s && (Math.abs(s[0]) > 4 || s[1] > 4); })) return null;
          if (sl.filter(function (s) { return !s || s[0] === 0; }).length > 1 || sEq(sl[0], sl[1]) || sEq(sl[1], sl[2]) || sEq(sl[0], sl[2])) return null;
          for (var a = 0; a < 8; a++) for (var b = a + 1; b < 8; b++) if (Math.pow(P[a][0] - P[b][0], 2) + Math.pow(P[a][1] - P[b][1], 2) < 4) return null;
          var xs = P.map(function (X) { return X[0]; }), ys = P.map(function (X) { return X[1]; }); if (Math.max.apply(null, xs) - Math.min.apply(null, xs) < 6 || Math.max.apply(null, ys) - Math.min.apply(null, ys) < 6) return null;
          var names = r.shuffle(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']), pts = {}; P.forEach(function (X, i) { pts[names[i]] = X; });
          return { pts: pts, lines: trip.map(function (x) { return x.map(function (i) { return names[i]; }).sort(); }), left: names[6] };
        }, null);
        return res || fb;
      },
      stem: function (s) {
        var N = Object.keys(s.pts).sort();
        return 'Eight points are plotted below.' + graphOf({ x: [-6, 6], y: [-6, 6], grid: 1, labels: 2, max: 340, points: N.map(function (n) { return lbl(s.pts[n], n); }), aria: 'eight labelled points' }) + 'Coordinates: ' + N.map(function (n) { return nP(n, s.pts[n]); }).join(', ') + '.';
      },
      parts: [
        { id: 'e15a', level: 'ADV', make: function (r, s) {
          var N = Object.keys(s.pts).sort(), all = [];
          for (var i = 0; i < 8; i++) for (var j = i + 1; j < 8; j++) for (var k = j + 1; k < 8; k++) all.push([N[i], N[j], N[k]]);
          var key = function (x) { return x.join(''); }, right = s.lines.map(key);
          var score = function (x) { var P = x.map(function (n) { return s.pts[n]; }); var a = slopeOf(P[0], P[1]), b = slopeOf(P[1], P[2]); if (!a || !b) return 9; return Math.abs(sV(a) - sV(b)) + (x.some(function (n) { return right.some(function (rk) { return rk.indexOf(n) >= 0; }); }) ? 0 : 0.5); };
          var wrongs = all.filter(function (x) { return right.indexOf(key(x)) < 0; }).map(function (x) { return { x: x, sc: score(x) }; }).sort(function (a, b) { return a.sc - b.sc; }).slice(0, 12);
          var shown = r.shuffle(wrongs).slice(0, 5).map(function (o) { return o.x; }).concat(s.lines.map(function (x) { return x.slice(); }));
          shown.sort(function (a, b) { return key(a) < key(b) ? -1 : 1; });
          var opts = shown.map(function (x) { return { value: key(x), html: t(x.join(',\\ ')) }; });
          var sl = function (x) { return slopeOf(s.pts[x[0]], s.pts[x[1]]); };
          var diag = function (extra, missing) {
            if (extra.length) { var x = extra[0].split(''), P = x.map(function (n) { return s.pts[n]; }); return { code: 'sel-none', hint: t(x.join(',\\ ')) + ' isn’t collinear: ' + t('m_{' + x[0] + x[1] + '}=' + sT(slopeOf(P[0], P[1]))) + ' but ' + t('m_{' + x[1] + x[2] + '}=' + sT(slopeOf(P[1], P[2]))) + '.' }; }
            return { code: 'sel-missing', hint: 'Correct so far — but there ' + (missing.length === 1 ? 'is one more collinear set' : 'are ' + missing.length + ' more') + '. One point can be on two of the lines.' };
          };
          return { prompt: '(a) Working from the coordinates, select <b>every</b> set of three points that is collinear.', input: { type: 'select', options: opts }, check: K.selectSet(right, diag), key: right,
            answer: s.lines.map(function (x) { return t(x.join(',\\ ')) + ' (slope ' + t(sT(sl(x))) + ')'; }).join('; '),
            solution: s.lines.map(function (x) { var P = x.map(function (n) { return s.pts[n]; }); return t(x.join(',\\ ')) + ': ' + t('m_{' + x[0] + x[1] + '}=' + sT(slopeOf(P[0], P[1])) + ',\\ m_{' + x[1] + x[2] + '}=' + sT(slopeOf(P[1], P[2])) + (slopeOf(P[0], P[1]) && slopeOf(P[0], P[1])[0] === 0 ? '\\ \\text{(horizontal)}' : '')); }).join('<br>') + '<br>Each of the other listed sets has two different slopes.',
            hints: ['For each listed set, compare the slope of the first two points with the slope of the last two.', 'Look for points that share a ' + t('y') + '-coordinate too: a horizontal line has slope ' + t('0') + '.'], text: 'find every collinear triple',
            bad: [right.slice(1), right.concat([key(shown.filter(function (x) { return right.indexOf(key(x)) < 0; })[0])])] };
        } },
        { id: 'e15b', level: 'EMG', make: function (r, s) {
          var items = s.lines.map(function (x) { return { nm: x[0] + x[1] + x[2], A: s.pts[x[0]], B: s.pts[x[1]] }; });
          return slopeFields('(b) Give the slope of the line through each collinear set: ' + s.lines.map(function (x) { return t(x.join(',\\ ')); }).join('; ') + '.', items, s.lines.map(function (x) { return t(calc(s.pts[x[0]], s.pts[x[1]], x[0] + x[1] + x[2])); }).join('<br>'), [SLOPE_HINT, 'Any two points of a set give the slope of its line.'], 'slopes of the three lines');
        } },
        { id: 'e15c', level: 'EMG', make: function (r, s) {
          var N = Object.keys(s.pts).sort(), inLines = {}; s.lines.forEach(function (x) { x.forEach(function (n) { inLines[n] = 1; }); });
          var opts = r.shuffle(N.filter(function (n) { return n !== s.left; })).slice(0, 3).map(function (n) { return { html: t(n), why: t(n) + ' is on the line through ' + t(s.lines.filter(function (x) { return x.indexOf(n) >= 0; })[0].join(',\\ ')) + '.' }; }).concat([{ html: t(s.left), right: true }]);
          return B.mc(r, '(c) One point belongs to no collinear set of three at all. Which one?', opts, t(s.left + ptT(s.pts[s.left])) + ' is on none of the three lines; every other point is on at least one.', ['Every point you selected in (a) is used. Which letter is left?'], 'the leftover point');
        } }] },
    /* ---------------- EP16 ---------------- */
    { num: '16', shared: function (r) {
        return gen(r, function (r) { var P = [r.int(-3, -2) * 2, r.int(-2, 1) * 2], Q = [r.int(0, 2) * 2, r.int(2, 4) * 2], R = [r.int(2, 3) * 2, r.int(-2, 1) * 2]; if (col3(P, Q, R)) return null; var M = midOf(P, Q), N = midOf(Q, R); var s1 = slopeOf(M, N), s2 = slopeOf(N, R); if (!s1 || !s2 || s2[1] > 6 || s1[1] > 6 || Math.abs(s1[0]) > 6 || Math.abs(s2[0]) > 8) return null; if (sameP(M, [0, 0]) && false) return null; return { P: P, Q: Q, R: R, M: M, N: N }; }, { P: [-4, -2], Q: [2, 6], R: [6, -2], M: [-1, 2], N: [4, 2] });
      },
      stem: function (s) { return '<b>Stretch.</b> Triangle ' + t('PQR') + ' has vertices ' + nP('P', s.P) + ', ' + nP('Q', s.Q) + ' and ' + nP('R', s.R) + '.'; },
      parts: [
        { id: 'e16a', sub: 'a i', level: 'EMG', make: function (r, s) {
          var p = B.fields('Find ' + t('M') + ', the midpoint of ' + t('PQ') + ', and ' + t('N') + ', the midpoint of ' + t('QR') + '.', [ptField('M'), ptField('N')], [midChk(s.P, s.Q), midChk(s.Q, s.R)], ['(' + s.M[0] + ', ' + s.M[1] + ')', '(' + s.N[0] + ', ' + s.N[1] + ')'],
            t('M' + ptT(s.M) + ',\\ N' + ptT(s.N)), t('M=\\left(\\frac{' + s.P[0] + '+' + nb(s.Q[0]) + '}{2},\\ \\frac{' + s.P[1] + '+' + nb(s.Q[1]) + '}{2}\\right)=' + ptT(s.M)) + '<br>' + t('N=\\left(\\frac{' + s.Q[0] + '+' + nb(s.R[0]) + '}{2},\\ \\frac{' + s.Q[1] + '+' + nb(s.R[1]) + '}{2}\\right)=' + ptT(s.N)),
            ['Midpoint: average the ' + t('x') + '-coordinates and average the ' + t('y') + '-coordinates.'], 'two midpoints');
          p.bad = sameP([s.P[0] + s.Q[0], s.P[1] + s.Q[1]], s.M) ? [] : [['(' + (s.P[0] + s.Q[0]) + ', ' + (s.P[1] + s.Q[1]) + ')', '(' + s.N[0] + ', ' + s.N[1] + ')']]; return p;
        } },
        { id: 'e16a2', sub: 'a ii', level: 'EMG', make: function (r, s) {
          var a = slopeOf(s.M, s.N), b = slopeOf(s.N, s.R);
          return slopeFields('With ' + nP('M', s.M) + ' and ' + nP('N', s.N) + ', show that ' + t('M') + ', ' + t('N') + ' and the vertex ' + t('R') + ' are <b>not</b> collinear: find ' + t('m_{MN}') + ' and ' + t('m_{NR}') + '.', [{ nm: 'MN', A: s.M, B: s.N }, { nm: 'NR', A: s.N, B: s.R }],
            t(calc(s.M, s.N, 'MN')) + '<br>' + t(calc(s.N, s.R, 'NR')) + '<br>' + t(sT(a) + '\\ne ' + sT(b)) + ', so ' + t('M') + ', ' + t('N') + ', ' + t('R') + ' are <b>not</b> collinear.', [SLOPE_HINT], 'M, N, R not collinear');
        } },
        { id: 'e16b', sub: 'b', level: 'PRG', make: function (r, s) {
          var a = slopeOf(s.M, s.N), pr = slopeOf(s.P, s.R);
          return B.mc(r, '(b) Compare the slope of ' + t('MN') + ' with the slope of ' + t('PR') + ', ' + t('m_{PR}=' + sT(pr)) + '. What do you notice, and why does that guarantee ' + t('M') + ', ' + t('N') + ', ' + t('R') + ' could never be collinear?', [
            { html: 'They are equal, so ' + t('MN\\parallel PR') + '. A line through ' + t('M') + ' and ' + t('N') + ' runs parallel to ' + t('PR') + ' and never reaches ' + t('R') + '.', right: true },
            { html: 'They are equal, so ' + t('M') + ', ' + t('N') + ' and ' + t('R') + ' are collinear.', why: 'Equal slopes with no shared point mean <b>parallel</b>. ' + t('MN') + ' and ' + t('PR') + ' share no point, and (a) showed ' + t('M,N,R') + ' are not collinear.' },
            { html: 'The slope of ' + t('MN') + ' is half the slope of ' + t('PR') + ', because ' + t('MN') + ' is half as long.', why: 'Length doesn’t change slope. Compare the two values: they are equal.' },
            { html: 'They multiply to ' + t('-1') + ', so ' + t('MN\\perp PR') + '.', why: 'Compare them directly: they are the same number.' }],
            t('m_{MN}=' + sT(a)) + ' and ' + t(calc(s.P, s.R, 'PR')) + ': equal, so ' + t('MN\\parallel PR') + '. The line through ' + t('M') + ' and ' + t('N') + ' is parallel to ' + t('PR') + ' and does not contain ' + t('R') + ' (it would have to cross ' + t('PR') + '), so ' + t('R') + ' can never fall on it — the segment joining two midpoints always misses the third vertex.', ['Compare the two slope values.'], 'midsegment parallel to the third side');
        } },
        { id: 'e16c', sub: 'c', level: 'MAS', make: function (r) {
          var g = gen(r, function (r) { var a = r.int(1, 18), b = r.int(1, 18); if (a === b) return null; var k = Math.round(Math.sqrt(a * b)); if (k * k !== a * b || k > 12) return null; return { a: a, b: b, k: k, form2: r.chance(0.5) }; }, { a: 4, b: 9, k: 6, form2: false });
          var P2 = g.form2 ? '(' + g.a + ',\\ k)' : '(k,\\ ' + g.a + ')', P3 = g.form2 ? '(k,\\ ' + g.b + ')' : '(' + g.b + ',\\ k)';
          var m1 = g.form2 ? '\\frac{k}{' + g.a + '}' : '\\frac{' + g.a + '}{k}', m2 = g.form2 ? '\\frac{' + g.b + '}{k}' : '\\frac{k}{' + g.b + '}';
          var chkPts = function (k) { var Q2 = g.form2 ? [g.a, k] : [k, g.a], Q3 = g.form2 ? [k, g.b] : [g.b, k]; return t('(0,\\ 0),\\ ' + ptT(Q2) + ',\\ ' + ptT(Q3)) + ': slopes ' + t(sT(slopeOf([0, 0], Q2))) + ' and ' + t(sT(slopeOf(Q2, Q3))) + ' ✓'; };
          var p = B.valueSet('(c) Find <b>all</b> values of ' + t('k') + ' for which ' + t('(0,\\ 0)') + ', ' + t(P2) + ' and ' + t(P3) + ' are collinear. There is more than one answer.', [g.k, -g.k], { v: 'k' },
            'Both slopes from the origin must be equal: ' + t(m1 + '=' + m2) + '. Cross-multiply: ' + t('k^{2}=' + g.a + '\\times ' + g.b + '=' + g.a * g.b) + ', so ' + t('k=' + g.k) + ' <b>or</b> ' + t('k=-' + g.k) + '.<br>Check ' + t('k=' + g.k) + ': ' + chkPts(g.k) + '<br>Check ' + t('k=-' + g.k) + ': ' + chkPts(-g.k),
            ['Use the slope from ' + t('(0,\\ 0)') + ' to each other point and set them equal.', 'Cross-multiplying gives ' + t('k^{2}') + ' — a square number has two square roots.'], 'all k: k squared');
          p.bad = ['k=' + g.k, 'k=' + (-g.k)]; p.good = ['k=-' + g.k + ', k=' + g.k, '\\pm ' + g.k];
          return p;
        } }] }
  ];

  HW.defineLesson({
    id: 'u6l8', unit: 6, num: '8', title: 'Determining Collinearity Using Slope', outcome: 'RF3',
    blurb: 'Three points lie on one straight line exactly when the two slopes through the shared middle point agree: testing sets of points, points on a segment, and finding a missing coordinate.',
    questions: QUESTIONS, extra: EXTRA
  });
})(window);
