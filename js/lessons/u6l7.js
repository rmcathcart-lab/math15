/* Math 15 · Unit 6 · Lesson 7 — Types of Slope: Positive, Negative, Zero, and Undefined (RF3)
 * Assignment 7 (u6_L07.tex, Questions 1–15) and the Lesson 7 Extra Practice (u6_EP07.tex, Questions 1–18), plus one
 * added Mastery challenge (Extra 19). Every part is a generator: same structure, idea and difficulty as the booklet
 * question, new numbers from the seed (the booklet's own points are among the possible values). Model: Math 10C
 * u6l2.js / u6l3.js (rise/run/slope rows, the slope keypad with its "undefined" key, slope-type tables).
 * Conversions: "state the type" -> a table of choices (positive / negative / zero / undefined) or multiple choice;
 * "fill in the blank" -> multiple choice; "explain" -> multiple choice whose options are reasons; "draw" -> the graph
 * pad, checked by rule (any correct lines); "give points / an example" -> any correct answer is accepted;
 * "order" -> drag to order; true/false with a counterexample -> true/false, then the counterexample as an equation.
 * Changed from the booklet: Question 12 no longer asks for written labels — the checker reads each drawn line's
 * type itself. Question 10's chairlift (which loads at the top) is a skier going down the run. Extra 18(b) says
 * "the rise equals the run" (the booklet's "rises 6 for a run of 6" is not 6 units from the origin).
 * Slopes: equivalent fractions and exact decimals are accepted; where the booklet asks for lowest terms, an
 * unreduced fraction gets a nudge; "undefined" is the slope of a vertical segment.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 19 (added: a point whose segment has a given sign and lies
 * between two steepnesses). */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, K = HW.kit, KP = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, LN = HW.lines, DR = HW.draw;

  HW.addCodes({
    'rr-blank': 'Rise/run box left blank', 'rr-swap': 'Rise and run swapped', 'rr-sign': 'Rise or run with the wrong sign', 'rr-rise': 'Miscounted the rise', 'rr-run': 'Miscounted the run',
    'pts-format': 'Points not written as ordered pairs', 'pts-dup': 'Same point twice', 'pts-given': 'Gave the given point', 'pts-few': 'Not enough points',
    'pts-sign': 'Point stepped with the wrong slope sign', 'pts-flip': 'Point stepped run-over-rise', 'pts-off': 'Point not on the line', 'pts-vh': 'Horizontal/vertical mixed up (points)',
    'calc-sign': 'Sign of rise/run', 'calc-flip': 'Used run over rise', 'calc-divided': 'Divided instead of multiplying', 'calc-mult': 'Multiplied instead of dividing', 'rate-flip': 'Rate upside down', 'rate-one': 'Used one coordinate, not the change',
    'units-km': 'Did not convert km to m', 'grade-whole': 'Used the percent as a whole number', 'decimal-rounded': 'Rounded decimal instead of exact fraction', 'draw-noline': 'Plotted points instead of drawing', 'draw-many': 'Drew more than one line',
    'u6l7-draw-miss': 'A drawn line misses the given point', 'u6l7-draw-dup': 'Two lines of the same slope type', 'u6l7-draw-type': 'A slope type missing from the drawing',
    'u6l7-hv': 'Horizontal and vertical mixed up', 'u6l7-eq-slanted': 'Gave a slanted line for a horizontal/vertical one', 'u6l7-quad': 'Point not in the required quadrant', 'u6l7-sign': 'Segment has the wrong slope sign',
    'u6l7-steep-less': 'Segment not steep enough', 'u6l7-steep-more': 'Segment too steep', 'u6l7-steep-sign': 'Steepness right, sign wrong', 'u6l7-bound': 'Slope equal to a boundary (strict inequality)',
    'u6l7-ce-two': 'Counterexample still passes through two quadrants', 'u6l7-ce-side': 'Vertical counterexample on the wrong side', 'u6l7-ce-axis': 'Counterexample on an axis passes through no quadrant', 'u6l7-ce-type': 'Counterexample with the wrong slope type',
    'u6l7-times': 'Gave a difference instead of “how many times”', 'u6l7-ratio-flip': 'Divided the smaller steepness by the larger', 'u6l7-empty-depth': 'Gave the depth instead of the time', 'u6l7-quarter': 'Wrong fraction of the turn',
    'u6l7-ramp-run': 'Shortest run: divided instead of multiplying by 12', 'u6l7-roof-same': 'Gave the same sign for the other side of the roof', 'u6l7-int': 'Point without integer coordinates'
  });
  HW.addPartial({ 'u6l7-draw-miss': 'b', 'u6l7-draw-dup': 'b', 'u6l7-draw-type': 'b', 'u6l7-hv': 'n', 'u6l7-eq-slanted': 'n', 'u6l7-quad': 'b', 'u6l7-sign': 'b',
    'u6l7-steep-less': 'b', 'u6l7-steep-more': 'b', 'u6l7-steep-sign': 'b', 'u6l7-bound': 's', 'u6l7-ce-two': 'n', 'u6l7-ce-side': 'b', 'u6l7-ce-axis': 'b', 'u6l7-ce-type': 'n',
    'u6l7-times': 'n', 'u6l7-ratio-flip': 'b', 'u6l7-empty-depth': 'n', 'u6l7-quarter': 'n', 'u6l7-ramp-run': 'n', 'u6l7-roof-same': 'b' });

  /* ---------------- numbers and LaTeX ---------------- */
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function red(p, q) { if (q === 0) return null; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [cl(p / g), cl(q / g)]; }
  function frT(p, q) { return LN.frT(p, q); }
  function slT(s) { return s == null ? '\\text{undefined}' : frT(s[0], s[1]); }
  function rawFr(p, q) { return '\\frac{' + p + '}{' + q + '}'; }
  function fracSteps(p, q) { var s = rawFr(p, q); if (q === 0) return s; var r2 = slT(red(p, q)); return r2 === s ? s : s + '=' + r2; }
  function ptT(p) { return '(' + p[0] + ',\\ ' + p[1] + ')'; }
  function ptsT(arr) { return arr.map(ptT).join(',\\ '); }
  function subT(a, b) { return a + '-' + (b < 0 ? '(' + b + ')' : b); }
  function formulaT(A, Bp) { return '\\frac{' + subT(Bp[1], A[1]) + '}{' + subT(Bp[0], A[0]) + '}'; }
  function slopeOf(A, Bp) { return red(cl(Bp[1] - A[1]), cl(Bp[0] - A[0])); }
  function sval(s) { return s == null ? null : s[0] / s[1]; }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }
  function same(p, q) { return near(p[0], q[0]) && near(p[1], q[1]); }
  function dec(x, d) { return String(cl(Number(x.toFixed(d)))); }
  function isTerm(s) { if (!s) return false; var q = s[1]; while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; }
  function upDown(r) { return r > 0 ? t(r) + ' up' : r < 0 ? t(-r) + ' down' : 'no change up or down'; }
  function valOf(resp) { var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/^\s*m\s*=\s*/, '').trim(); if (!s) return null; var a = ex.parse(s); if (!a.ok) return null; var v = ex.value(a.ast); return isFinite(v) ? v : null; }

  /* ---------------- slope answers ---------------- */
  /* opt.lowest: the question asks for lowest terms (unreduced -> nudge); opt.diag(v) -> {code, hint} */
  function slChk(sl, opt) {
    opt = opt || {};
    var c = K.slope(sl, { lowest: !!opt.lowest, diag: opt.diag, signHint: opt.signHint });
    return function (resp) {
      var res = c(resp);
      if (res.v === 'wrong' && sl) { var v = valOf(resp), tv = sl[0] / sl[1]; if (v != null && Math.abs(v - tv) < 0.006 && /\.\d{2,}/.test(String(resp))) return form('decimal-rounded', 'Close — but that decimal is rounded. Give the exact slope as a fraction, e.g. ' + t(frT(sl[0], sl[1])) + '-style.'); }
      return res;
    };
  }
  function slBad(sl) { var b = []; if (!sl) return ['0']; if (sl[0] !== 0) b.push(frT(-sl[0], sl[1])); if (sl[0] !== 0 && Math.abs(sl[0]) !== Math.abs(sl[1])) b.push(frT(sl[1], sl[0])); b.push('\\text{undefined}'); return b; }
  function slopePart(prompt, sl, sol, hints, text, opt) {
    opt = opt || {};
    var key = slT(sl), p = KP.math(prompt, slChk(sl, opt), key, sol, hints, text, { keys: 'slope', before: opt.before || 'm=', placeholder: 'e.g. 3/4' });
    p.bad = slBad(sl).concat(opt.bad || []);
    p.good = (opt.good || []).slice();
    if (sl && isTerm(sl) && sl[1] !== 1) p.good.push(dec(sl[0] / sl[1], 6));
    return p;
  }
  var FHINT = 'Use ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + ', subtracting in the <b>same order</b> on the top and the bottom.';
  var NEGHINT = 'Subtracting a negative is adding: ' + t('a-(-b)=a+b') + '.';
  function coordSlopePart(prompt, A, Bp, opt) {
    opt = opt || {};
    var sl = slopeOf(A, Bp), rise = cl(Bp[1] - A[1]), run = cl(Bp[0] - A[0]);
    var sol = t('m=\\frac{y_2-y_1}{x_2-x_1}=' + formulaT(A, Bp) + '=' + fracSteps(rise, run)) + (run === 0 ? '. The run is ' + t('0') + ', and you can’t divide by ' + t('0') + ': the slope is <b>undefined</b> (a vertical segment).' : rise === 0 ? '. The rise is ' + t('0') + ', so the slope is ' + t('0') + ' (a horizontal segment).' : '.');
    var hasNeg = A[0] < 0 || A[1] < 0 || Bp[0] < 0 || Bp[1] < 0;
    var good = []; if (!opt.lowest && run !== 0 && gcd(rise, run) > 1) good.push(rawFr(rise, run));
    return slopePart(prompt, sl, sol + (opt.solMore || ''), opt.hints || [FHINT, hasNeg ? NEGHINT : 'Reduce the fraction at the end.'], opt.text || ('slope ' + ptT(A) + ptT(Bp)), { lowest: opt.lowest, good: good, diag: opt.diag });
  }

  /* ---------------- ordered points typed by the student ---------------- */
  function readPts(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\\{|\\\}|\\lbrace|\\rbrace/g, ' ').replace(/\\[,;:! ]|\\quad/g, ' ').replace(/−/g, '-').trim();
    if (s.charAt(0) === '{' && s.charAt(s.length - 1) === '}') s = s.slice(1, -1);
    if (!s.trim()) return { empty: true };
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) {
      var xy = m[1].split(','); if (xy.length !== 2) return { bad: true };
      var a = ex.parse(xy[0].trim()), b = ex.parse(xy[1].trim()); if (!a.ok || !b.ok) return { bad: true };
      var va = ex.value(a.ast), vb = ex.value(b.ast); if (!isFinite(va) || !isFinite(vb)) return { bad: true };
      out.push([cl(va), cl(vb)]);
    }
    if (s.replace(re, '').replace(/[,;\s]|and/g, '').length || !out.length) return { bad: true };
    return { pts: out };
  }
  function ptsCheck(o) {
    var n = o.n || 1, exc = o.exclude || [];
    return function (resp) {
      var L = readPts(resp);
      if (L.empty) return form('empty', 'Type your point' + (n > 1 ? 's' : '') + ' first.');
      if (L.bad) return form('pts-format', 'Write each point in brackets' + (n > 1 ? ', separated by commas' : '') + ', e.g. ' + t(n > 1 ? '(3,\\ 0),\\ (4,\\ 3)' : '(3,\\ 0)') + '.');
      var P = L.pts, i, j;
      if (n === 1 && P.length > 1) return form('pts-few', 'Give just one point.');
      for (i = 0; i < P.length; i++) for (j = 0; j < i; j++) if (same(P[i], P[j])) return form('pts-dup', 'You wrote ' + t(ptT(P[i])) + ' twice — give ' + n + ' different points.');
      for (i = 0; i < P.length; i++) for (j = 0; j < exc.length; j++) if (same(P[i], exc[j])) return form('pts-given', t(ptT(P[i])) + ' is the point you were given. Give ' + (n > 1 ? 'other points' : 'a different point') + '.');
      for (i = 0; i < P.length; i++) { var h = o.test(P[i]); if (h) return wrong(h.code, h.hint); }
      if (P.length < n) return form('pts-few', (P.length === 1 ? 'That point works! ' : 'Those work! ') + 'You need ' + n + ' points in all.');
      return ok();
    };
  }
  function ptsPart(prompt, o, key, sol, hints, text) {
    var n = o.n || 1;
    return KP.math(prompt, ptsCheck(o), ptsT(key), sol, hints, text, { keys: 'pairs', placeholder: n > 1 ? 'e.g. (3, 0), (4, 3)' : 'e.g. (3, 0)' });
  }
  function onLineTest(P0, sl) {
    var P0T = t(ptT(P0));
    return function (p) {
      var dx = cl(p[0] - P0[0]), dy = cl(p[1] - P0[1]);
      if (near(dy * sl[1], sl[0] * dx)) return null;
      if (sl[1] === 0) return dy === 0 ? { code: 'pts-vh', hint: 'From ' + P0T + ' to ' + t(ptT(p)) + ' the segment is horizontal, so its slope is ' + t('0') + '. An <b>undefined</b> slope is vertical: the run is ' + t('0') + ', so keep ' + t('x=' + P0[0]) + '.' } : { code: 'pts-off', hint: 'An undefined slope means the run is ' + t('0') + ': the other point must have the same ' + t('x') + '-coordinate, ' + t(P0[0]) + '.' };
      var m = sl[0] / sl[1];
      if (dx === 0) return { code: 'pts-off', hint: 'From ' + P0T + ' to ' + t(ptT(p)) + ' the run is ' + t('0') + ' (a vertical step). Step ' + t(Math.abs(sl[1])) + ' across as well as ' + t(Math.abs(sl[0])) + ' ' + (m > 0 ? 'up' : 'down') + '.' };
      var s = dy / dx;
      if (near(s, -m)) return { code: 'pts-sign', hint: 'From ' + P0T + ' to ' + t(ptT(p)) + ' the slope is ' + t(fracSteps(dy, dx)) + ' — the sign is wrong. A ' + (m > 0 ? 'positive slope goes <b>up</b>' : 'negative slope goes <b>down</b>') + ' as you move right.' };
      if (near(s, 1 / m)) return { code: 'pts-flip', hint: 'From ' + P0T + ' to ' + t(ptT(p)) + ' the slope is ' + t(fracSteps(dy, dx)) + ' — that’s run over rise. The top of the slope is the <b>rise</b> (up or down), the bottom is the <b>run</b> (across).' };
      return { code: 'pts-off', hint: t(ptT(p)) + ' isn’t on the line: from ' + P0T + ' the rise is ' + t(dy) + ' and the run is ' + t(dx) + ', a slope of ' + t(fracSteps(dy, dx)) + ', not ' + t(slT(red(sl[0], sl[1]))) + '.' };
    };
  }
  function stepPts(P0, sl, ks) { return ks.map(function (k) { return [P0[0] + k * sl[1], P0[1] + k * sl[0]]; }); }

  /* ---------------- figures ---------------- */
  /* a grid with segments and lettered points; letters are placed where they touch nothing (dots, segments, axes, tick labels) */
  function segGraph(segs, opt) {   // segs: [{ A, B, a, b }]
    opt = opt || {};
    var all = []; segs.forEach(function (s) { all.push(s.A, s.B); });
    var xs = all.map(function (p) { return p[0]; }), ys = all.map(function (p) { return p[1]; });
    var xr = opt.x || [Math.min(-2, Math.min.apply(null, xs) - 1), Math.max(2, Math.max.apply(null, xs) + 1)], yr = opt.y || [Math.min(-2, Math.min.apply(null, ys) - 1), Math.max(2, Math.max.apply(null, ys) + 1)];
    var spec = { x: xr, y: yr, labels: opt.labels || 2, max: opt.max || 320, segs: segs.map(function (s) { return { pts: [s.A, s.B] }; }), aria: opt.aria || 'line segments on a grid' };
    var pts = []; segs.forEach(function (s) { if (s.a) pts.push({ x: s.A[0], y: s.A[1], label: s.a }); else pts.push({ x: s.A[0], y: s.A[1] }); if (s.b) pts.push({ x: s.B[0], y: s.B[1], label: s.b }); else pts.push({ x: s.B[0], y: s.B[1] }); });
    spec.points = pts.map(function (p) { return { x: p.x, y: p.y }; });
    var svg = HW.graph(spec), L = HW.graph.last, X = L.X, Y = L.Y, obs = [], out = '';
    var hit = function (a, b) { return a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]; };
    var x0 = Math.max(L.xr[0], Math.min(L.xr[1], 0)), y0 = Math.max(L.yr[0], Math.min(L.yr[1], 0)), lx = spec.labels, ly = spec.labels;
    pts.forEach(function (p) { obs.push([X(p.x) - 5, Y(p.y) - 5, X(p.x) + 5, Y(p.y) + 5]); });
    segs.forEach(function (s) { for (var k = 0; k <= 40; k++) { var u = k / 40, px = X(s.A[0] + (s.B[0] - s.A[0]) * u), py = Y(s.A[1] + (s.B[1] - s.A[1]) * u); obs.push([px - 2, py - 2, px + 2, py + 2]); } });
    obs.push([X(L.xr[0]), Y(y0) - 1.5, X(L.xr[1]) + 8, Y(y0) + 1.5], [X(L.xr[1]) - 12, Y(y0) - 19, X(L.xr[1]) + 6, Y(y0) - 2], [X(x0) + 3, Y(L.yr[1]) - 8, X(x0) + 16, Y(L.yr[1]) + 8]); obs.push([X(x0) - 1.5, Y(L.yr[1]) - 8, X(x0) + 1.5, Y(L.yr[0])]);
    for (var tx = Math.ceil(L.xr[0] / lx) * lx; tx < L.xr[1]; tx += lx) if (tx) obs.push([X(tx) - 9, Y(y0) + 3, X(tx) + 9, Y(y0) + 16]);
    for (var ty = Math.ceil(L.yr[0] / ly) * ly; ty < L.yr[1]; ty += ly) if (ty) obs.push([X(x0) - 19, Y(ty) - 6, X(x0) - 2, Y(ty) + 6]);
    var cand = [[5, -16], [-14, -16], [5, 4], [-14, 4], [7, -6], [-17, -6], [-4, -19], [-4, 7], [10, -20], [-20, -20], [10, 8], [-20, 8]];
    pts.forEach(function (p) {
      if (!p.label) return;
      var w = 8 + 7 * p.label.length, px = X(p.x), py = Y(p.y), best = null;
      for (var i = 0; i < cand.length && !best; i++) { var dx = cand[i][0] < 0 ? cand[i][0] - (w - 10) : cand[i][0], b = [px + dx, py + cand[i][1], px + dx + w, py + cand[i][1] + 13]; if (b[0] >= 0 && b[1] >= 0 && b[2] <= L.W && b[3] <= L.H && !obs.some(function (o) { return hit(b, o); })) best = b; }
      if (!best) best = [px + 5, py - 16, px + 5 + w, py - 3];
      obs.push(best);
      out += '<text x="' + ((best[0] + best[2]) / 2).toFixed(1) + '" y="' + (best[1] + 11).toFixed(1) + '" font-size="13" font-weight="600" text-anchor="middle" fill="#2b3340">' + p.label + '</text>';
    });
    return svg.replace(/<\/svg>$/, out + '</svg>');
  }
  function distSeg(p, a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy, u = L2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2)) : 0; return Math.hypot(p[0] - a[0] - u * dx, p[1] - a[1] - u * dy); }
  /* place segments (types: {rise, run}, run >= 0) with integer endpoints in [-lim, lim], endpoints apart and off the other segments */
  function placeSegs(r, types, lim) {
    for (var tries = 0; tries < 400; tries++) {
      var segs = [], bad = false;
      types.forEach(function (ty) {
        var xlo = -lim, xhi = lim - ty.run, ylo = Math.max(-lim, -lim - ty.rise), yhi = Math.min(lim, lim - ty.rise);
        if (xhi < xlo || yhi < ylo) { bad = true; return; }
        var A = [r.int(xlo, xhi), r.int(ylo, yhi)]; segs.push([A, [A[0] + ty.run, A[1] + ty.rise]]);
      });
      if (bad) return null;
      var ends = []; segs.forEach(function (s) { ends.push(s[0], s[1]); });
      for (var i = 0; i < ends.length && !bad; i++) for (var j = 0; j < i; j++) if (Math.hypot(ends[i][0] - ends[j][0], ends[i][1] - ends[j][1]) < 2) { bad = true; break; }
      for (var k = 0; k < segs.length && !bad; k++) for (var e = 0; e < ends.length; e++) if (Math.floor(e / 2) !== k && distSeg(ends[e], segs[k][0], segs[k][1]) < 0.8) { bad = true; break; }
      if (!bad) return segs;
    }
    return null;
  }

  /* ---------------- rise / run / slope rows ---------------- */
  /* nm = 'KL' (segment from its first letter to its second); opt.coords: worked from coordinates (not a grid); opt.lowest */
  function rrPart(nm, A, Bp, opt) {
    opt = opt || {};
    var rise = cl(Bp[1] - A[1]), run = cl(Bp[0] - A[0]), sl = slopeOf(A, Bp), slc = slChk(sl, { lowest: opt.lowest });
    var fields = [{ label: 'Rise', name: 'Rise' }, { label: 'Run', name: 'Run' }, { label: 'Slope', name: 'Slope', mode: 'math', keys: 'slope', placeholder: 'e.g. 3/2' }];
    var key = [String(rise), String(run), slT(sl)], a = nm.charAt(0), b = nm.charAt(1);
    var dir = run === 0 ? 'straight ' + (rise > 0 ? 'up' : 'down') : rise === 0 ? 'straight across' : (rise > 0 ? 'up' : 'down') + ' to the ' + (run > 0 ? 'right' : 'left');
    var check = function (resp) {
      resp = resp || [];
      var plus = function (v) { return String(v == null ? '' : v).replace(/^\s*\+/, ''); }, pr = HW.parse.number(plus(resp[0])), pn = HW.parse.number(plus(resp[1]));
      if (!pr.ok || !pn.ok) return form('rr-blank', 'Fill in the <b>rise</b> and the <b>run</b> as numbers (with a minus sign for down or left).');
      var rr = cl(pr.value), n = cl(pn.value);
      var good = (rr === rise && n === run) || (rr === -rise && n === -run);
      if (!good) {
        if (Math.abs(rr) === Math.abs(run) && Math.abs(n) === Math.abs(rise) && Math.abs(rise) !== Math.abs(run)) return wrong('rr-swap', 'Rise and run are swapped: the <b>rise</b> is the vertical change (up or down), the <b>run</b> is the horizontal change (across).');
        if (Math.abs(rr) === Math.abs(rise) && Math.abs(n) === Math.abs(run)) return wrong('rr-sign', 'Right sizes — check the signs. Go from ' + t(a) + ' to ' + t(b) + ': up and right are positive, down and left are negative. ' + t(nm) + ' goes ' + dir + '.');
        if (Math.abs(rr) !== Math.abs(rise)) return wrong('rr-rise', '<b>Rise:</b> ' + (opt.coords ? 'subtract the ' + t('y') + '-coordinates again: ' + t(subT(Bp[1], A[1])) + '.' : 'count the squares up or down from ' + t(a) + ' to ' + t(b) + ' again.'));
        return wrong('rr-run', '<b>Run:</b> ' + (opt.coords ? 'subtract the ' + t('x') + '-coordinates again: ' + t(subT(Bp[0], A[0])) + '.' : 'count the squares across from ' + t(a) + ' to ' + t(b) + ' again.'));
      }
      var c = slc(resp[2] == null ? '' : resp[2]);
      if (c.v !== 'correct') return { v: c.v, code: c.code, hint: '<b>Slope:</b> ' + (c.hint || 'divide the rise by the run: ' + t('\\frac{\\text{rise}}{\\text{run}}=' + rawFr(rise, run)) + (run === 0 ? '.' : ', then reduce.')) };
      return ok();
    };
    var sol = (opt.coords ? 'From ' + t(a + ptT(A)) + ' to ' + t(b + ptT(Bp)) + ': rise ' + t('=' + subT(Bp[1], A[1]) + '=' + rise) + ', run ' + t('=' + subT(Bp[0], A[0]) + '=' + run) + '.<br>'
      : 'Count from ' + t(a) + ' to ' + t(b) + ': ' + upDown(rise) + ' and ' + (run === 0 ? 'no squares across' : t(Math.abs(run)) + ' ' + (run > 0 ? 'right' : 'left')) + '. Rise ' + t(rise) + ', run ' + t(run) + '.<br>') +
      (run === 0 ? t('\\text{slope}=\\frac{' + rise + '}{0}') + ' — you can’t divide by ' + t('0') + ', so the slope is <b>undefined</b> (a vertical segment).' : t('\\text{slope}=\\frac{\\text{rise}}{\\text{run}}=' + fracSteps(rise, run)) + (rise === 0 ? ' (a horizontal segment).' : '.'));
    var p = { prompt: opt.prompt || ('Segment ' + t(nm) + ': fill in its row of the table.'), input: { type: 'fields', fields: fields }, check: check, key: key,
      answer: 'Rise ' + t(rise) + ', run ' + t(run) + ', slope ' + t(slT(sl)), solution: sol, text: (opt.text ? opt.text + ': ' : '') + 'rise/run/slope of ' + nm + ' ' + ptT(A) + ptT(Bp),
      hints: [opt.coords ? 'Rise ' + t('=y_2-y_1') + ' (the change in ' + t('y') + '), run ' + t('=x_2-x_1') + ' (the change in ' + t('x') + '), with ' + t(a) + ' as the first point.' : 'Start at ' + t(a) + '. Count squares up (+) or down (−) to the level of ' + t(b) + ' — that’s the rise. Then count squares right (+) or left (−) — that’s the run.', 'Slope ' + t('=\\frac{\\text{rise}}{\\text{run}}') + (opt.lowest ? ', in lowest terms.' : '.')],
      good: run !== 0 || rise !== 0 ? [[String(-rise), String(-run), slT(sl)]] : [],
      bad: [[String(run), String(rise), slT(sl)], [String(rise), String(-run || run), slT(sl)], [String(rise), String(run), sl && sl[0] !== 0 && Math.abs(sl[0]) !== Math.abs(sl[1]) ? frT(sl[1], sl[0]) : '7']].filter(function (bb) { return !((bb[0] === key[0] && bb[1] === key[1] && bb[2] === key[2]) || (Number(bb[0]) === -rise && Number(bb[1]) === -run)); }) };
    if (!opt.lowest && run !== 0 && gcd(rise, run) > 1) p.good.push([String(rise), String(run), rawFr(rise, run)]);
    return p;
  }

  /* ---------------- numerical response ---------------- */
  function nrPart(prompt, ans, diag, sol, hints, text) {
    var base = K.number(ans, diag, { nr: true });
    var p = KP.nr(prompt, ans, diag, sol, hints, text);
    p.check = function (resp) {
      var r = base(resp);
      if (r.v === 'form' && (r.code === 'notnumber' || r.code === 'nr-long')) { var v = valOf(resp); if (v != null && near(v, ans)) return ok(); if (v != null && diag) { var h = diag(v); if (h) return wrong(h.code || 'diag', h.hint); } if (v != null) return wrong('value', null); }
      return r;
    };
    return p;
  }

  function mcCols(p) { p.input.columns = 2; return p; }

  /* ---------------- slope types ---------------- */
  var KIND = { pos: 'Positive', neg: 'Negative', zero: 'Zero', und: 'Undefined' };
  var KCOLS = ['pos', 'neg', 'zero', 'und'].map(function (k) { return { id: k, html: KIND[k] }; });
  function kindOf(sl) { return sl == null ? 'und' : sl[0] === 0 ? 'zero' : sl[0] / sl[1] > 0 ? 'pos' : 'neg'; }
  var KWHY = { pos: 'a <b>positive</b> slope rises from left to right (the rise and run have the same sign)', neg: 'a <b>negative</b> slope falls from left to right (the rise and run have opposite signs)',
    zero: 'a slope of <b>zero</b> is horizontal: the rise is ' + t('0'), und: 'an <b>undefined</b> slope is vertical: the run is ' + t('0') + ', and you can’t divide by ' + t('0') };
  /* rows: [{ id, html, sl }] */
  function typeGrid(prompt, rows, sol, hints, text, rowHead) {
    var want = {}; rows.forEach(function (rw) { want[rw.id] = kindOf(rw.sl); });
    return KP.grid(prompt, rows.map(function (rw) { return { id: rw.id, html: rw.html }; }), KCOLS, want, { rowHead: rowHead || 'Segment', why: function (row, got) {
      var rw = rows.filter(function (x) { return x.id === row; })[0], k = want[row];
      return { code: got === 'zero' && k === 'und' || got === 'und' && k === 'zero' ? 'u6l7-hv' : 'row', hint: rw.html + ': ' + (rw.sl == null ? 'the slope is undefined' : 'the slope is ' + t(slT(rw.sl))) + ', and ' + KWHY[k] + '.' };
    } }, sol, hints || ['Rises left to right: positive. Falls: negative. Flat: zero. Straight up and down: undefined.'], text);
  }
  function typeMC(r, prompt, kind, sol, hints, text) {
    var why = function (k) { return k === 'zero' && kind === 'und' ? 'A slope of ' + t('0') + ' is a <b>horizontal</b> line. This one is vertical: the run is ' + t('0') + ', so the slope is undefined.' : k === 'und' && kind === 'zero' ? 'Undefined is for a <b>vertical</b> line (run ' + t('0') + '). This one is horizontal: the rise is ' + t('0') + ', so the slope is ' + t('0') + '.' : 'Not quite: ' + KWHY[kind] + '.'; };
    return mcCols(KP.mc(r, prompt, ['pos', 'neg', 'zero', 'und'].map(function (k) { return { html: k === 'zero' ? 'zero (' + t('0') + ')' : KIND[k].toLowerCase(), right: k === kind, why: k === kind ? null : why(k), code: 'k-' + k }; }), sol, hints || ['Read the line from left to right.'], text, true));
  }
  function arrowLine(P, d, lim) { return [clipEnd(P, [-d[0], -d[1]], 40, lim), clipEnd(P, d, 40, lim)]; }
  function clipEnd(P, d, len, lim) { var L = Math.hypot(d[0], d[1]), s = len / L; [0, 1].forEach(function (k) { if (d[k] > 0) s = Math.min(s, (lim - P[k]) / d[k]); if (d[k] < 0) s = Math.min(s, (-lim - P[k]) / d[k]); }); return [cl(P[0] + d[0] * Math.max(0, s)), cl(P[1] + d[1] * Math.max(0, s))]; }
  function linePic(r, kind) {
    var P = [r.int(-3, 3), r.int(-3, 3)], d = kind === 'zero' ? [1, 0] : kind === 'und' ? [0, 1] : [r.pick([1, 2, 3]), (kind === 'pos' ? 1 : -1) * r.pick([1, 2, 3])];
    var e = arrowLine(P, d, 4.6);
    return '<div>' + HW.graph({ x: [-5, 5], y: [-5, 5], labels: 0, max: 150, segs: [{ pts: e, start: 'arrow', end: 'arrow' }], aria: 'a line' }) + '</div>';
  }
  function segX(a, b, c, d) {   // do segments ab and cd cross (properly)?
    var o = function (p, q, s) { return (q[0] - p[0]) * (s[1] - p[1]) - (q[1] - p[1]) * (s[0] - p[0]); };
    var d1 = o(c, d, a), d2 = o(c, d, b), d3 = o(a, b, c), d4 = o(a, b, d);
    return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
  }
  function placeApart(r, types, lim) {
    for (var g = 0; g < 60; g++) {
      var s = placeSegs(r, types, lim); if (!s) continue;
      var cross = false; for (var i = 0; i < s.length; i++) for (var j = 0; j < i; j++) if (segX(s[i][0], s[i][1], s[j][0], s[j][1])) cross = true;
      if (!cross) return s;
    }
    return null;
  }
  /* exact value answer (fractions or decimals) */
  function valuePart(prompt, val, keyTex, diag, sol, hints, text, inp) {
    var chk = function (resp) {
      var s = String(resp == null ? '' : resp).trim(); if (!s) return form('empty', 'Type your answer first.');
      var v = valOf(s); if (v == null) return form('notnumber', 'Enter a number or a fraction.');
      if (near(v, val)) return ok();
      var h = diag ? diag(v) : null; if (h) return wrong(h.code, h.hint);
      return wrong('value', null);
    };
    return KP.math(prompt, chk, keyTex, sol, hints, text, Object.assign({ keys: 'fraction' }, inp || {}));
  }
  function eqRead(resp) { var r0 = LN.read(String(resp == null ? '' : resp)); return r0.ok ? r0 : null; }

  /* ---------------- assignment generators ---------------- */
  function segQ(r, kind, bk) {
    if (r.chance(0.2)) return bk;
    for (var g = 0; g < 200; g++) {
      var A, Bp;
      if (kind === 'pos') { var f = r.pick([[2, 3], [1, 2], [3, 4], [1, 1], [3, 2], [2, 1], [1, 3]]), k = f[0] === f[1] ? r.int(3, 6) : r.pick([1, 2]); A = [r.int(-4, 1), r.int(-4, 1)]; Bp = [A[0] + f[1] * k, A[1] + f[0] * k]; }
      else if (kind === 'neg') { var f2 = r.pick([[1, 1], [2, 3], [1, 2], [3, 2], [3, 4], [2, 1]]), k2 = f2[0] === f2[1] ? r.int(3, 6) : r.pick([1, 2]); A = [r.int(-4, 1), r.int(-1, 4)]; Bp = [A[0] + f2[1] * k2, A[1] - f2[0] * k2]; }
      else if (kind === 'zero') { var y = r.pick([-4, -3, -2, -1, 1, 2, 3, 4]); A = [r.int(-4, -1), y]; Bp = [r.int(1, 4), y]; }
      else { var x = r.pick([-4, -3, -2, -1, 1, 2, 3, 4]); A = [x, r.int(1, 4)]; Bp = [x, r.int(-4, -1)]; }
      if ([A[0], A[1], Bp[0], Bp[1]].every(function (v) { return Math.abs(v) <= 4; }) && (kind === 'zero' || kind === 'und' || Bp[0] - A[0] >= 3)) return [A, Bp];
    }
    return bk;
  }
  function segStem(nm, pr) { return 'Segment ' + t(nm) + ': ' + t(nm.charAt(0) + ptT(pr[0])) + ', ' + t(nm.charAt(1) + ptT(pr[1])) + '.' + segGraph([{ A: pr[0], B: pr[1], a: nm.charAt(0), b: nm.charAt(1) }], { x: [-5, 5], y: [-5, 5], labels: 2, max: 230 }); }
  var Q25 = { '2': ['AB', 'pos', [[-3, -2], [3, 2]]], '3': ['CD', 'neg', [[-2, 3], [4, -3]]], '4': ['EF', 'zero', [[-4, -1], [3, -1]]], '5': ['GH', 'und', [[2, 4], [2, -4]]] };
  function q25(num) {
    var q = Q25[num], nm = q[0], kind = q[1];
    var parts = [{ id: num, sub: 'slope', level: 'BEG', make: function (r, sh) {
      return coordSlopePart('Calculate the slope of ' + t(nm) + (kind === 'und' ? ' (use the <b>undefined</b> key if there is no number).' : '.'), sh[0], sh[1], { text: 'slope ' + nm, hints: [FHINT, kind === 'zero' || kind === 'und' ? 'If the top is ' + t('0') + ', the slope is ' + t('0') + '. If the bottom is ' + t('0') + ', the slope is undefined.' : 'Read the graph from left to right: does it go up or down?'] });
    } }];
    if (num === '2' || num === '3') parts.push({ id: num + 't', sub: 'type', level: 'LIM', make: function (r, sh) {
      return typeMC(r, 'Is the slope of ' + t(nm) + ' positive or negative?', kind, t(nm) + ' ' + (kind === 'pos' ? 'rises' : 'falls') + ' from left to right, so its slope (' + t(slT(slopeOf(sh[0], sh[1]))) + ') is <b>' + KIND[kind].toLowerCase() + '</b>.', ['Read the segment from left to right: up or down?'], 'type ' + nm);
    } });
    return { num: num, stem: function (sh) { return segStem(nm, sh); }, shared: function (r) { return segQ(r, kind, q[2]); }, parts: parts };
  }
  var NM6 = ['AB', 'CD', 'EF', 'GH'];
  function q6Shared(r) {
    if (r.chance(0.2)) return { segs: [[[-5, -3], [-1, 1]], [[-1, 3], [3, -1]], [[-4, -4], [4, -4]], [[5, 4], [5, -4]]] };
    for (var g = 0; g < 50; g++) {
      var ab = r.pick([[4, 4], [2, 4], [3, 3], [4, 2], [3, 6], [4, 6], [6, 4]]), cd = r.pick([[4, 4], [2, 4], [3, 3], [4, 2], [6, 3], [4, 6]]), ef = r.int(4, 8), gh = r.int(4, 8);
      var s = placeApart(r, [{ rise: ab[0], run: ab[1] }, { rise: -cd[0], run: cd[1] }, { rise: 0, run: ef }, { rise: -gh, run: 0 }], 5);
      if (s) return { segs: s };
    }
    return { segs: [[[-5, -3], [-1, 1]], [[-1, 3], [3, -1]], [[-4, -4], [4, -4]], [[5, 4], [5, -4]]] };
  }
  /* Q12: four lines through P, one of each type */
  function q12Check(P) {
    return function (resp) {
      if (DR.empty(resp)) return form('empty', 'Draw the four lines on the grid first.');
      var g = DR.geom(resp), ks = Object.keys(g.lines);
      if (!ks.length) return wrong('draw-noline', 'Join points with the <b>╱ Line</b> tool to make lines.');
      var seen = {}, miss = null, dup = null;
      ks.forEach(function (k) { var L = g.lines[k]; if (Math.abs(L.A * P[0] + L.B * P[1] - L.C) > 1e-6) { miss = miss || L; return; } var kd = L.B === 0 ? 'und' : L.A === 0 ? 'zero' : -L.A / L.B > 0 ? 'pos' : 'neg'; if (seen[kd]) dup = dup || kd; seen[kd] = 1; });
      if (miss) return wrong('u6l7-draw-miss', 'Every line has to pass through ' + t(ptT(P)) + '. Start each line at that point.');
      if (dup) return wrong('u6l7-draw-dup', 'Two of your lines have ' + (dup === 'zero' ? 'slope ' + t('0') : dup === 'und' ? 'undefined slopes' : KIND[dup].toLowerCase() + ' slopes') + '. Draw <b>one</b> line of each type.');
      var lack = ['pos', 'neg', 'zero', 'und'].filter(function (k) { return !seen[k]; });
      if (lack.length) return wrong('u6l7-draw-type', 'Still missing: a line with ' + lack.map(function (k) { return k === 'zero' ? 'a slope of ' + t('0') + ' (horizontal)' : k === 'und' ? 'an undefined slope (vertical)' : 'a ' + KIND[k].toLowerCase() + ' slope (' + (k === 'pos' ? 'rising' : 'falling') + ')'; }).join(' and ') + '.');
      return ok();
    };
  }
  var LINEHELP = '<div class="muted">Use <b>╱ Line</b>: tap ' + '<b>the given point</b>, tap a second point, then tap it again to finish. Draw one line at a time.</div>';
  function gv(pts, pieces) { return { pts: pts || [], pieces: pieces || [], join: 'none' }; }
  function lineV(a, b) { return { v: [a, b], s: 'arrow', e: 'arrow' }; }
  var CONTEXTS = [['a flat, level road', 'zero'], ['the surface of a frozen pond', 'zero'], ['a level floor', 'zero'], ['a flagpole standing straight up', 'und'], ['the wall of a building', 'und'], ['an elevator shaft', 'und'],
    ['a level shelf', 'zero'], ['the top of a table', 'zero'], ['a ladder side rail standing straight up against a wall', 'und'], ['a door frame’s side post', 'und'],
    ['a wheelchair ramp that climbs to a door on the right', 'pos'], ['a staircase going up to the right', 'pos'], ['a hiking trail climbing up to a lookout on the right', 'pos'], ['a playground slide going down to the right', 'neg'], ['a road that climbs a hill as you drive to the right', 'pos'], ['a slide that goes down from the ladder on the left to the ground on the right', 'neg'], ['a ski run that drops from the top on the left to the bottom on the right', 'neg']];

  HW.defineLesson({
    id: 'u6l7', unit: 6, num: 7, title: 'Types of Slope: Positive, Negative, Zero, and Undefined', outcome: 'RF3',
    blurb: 'Positive, negative, zero and undefined slopes — from graphs, points, equations and descriptions — and telling zero slope from undefined.',
    questions: [
      { num: '1', section: 'Part A — Vocabulary and one type at a time', stem: 'Fill in each blank.', parts: [
        ['a', 'pos', 'A line that <b>rises</b> from left to right has a ________ slope.'], ['b', 'neg', 'A line that <b>falls</b> from left to right has a ________ slope.'],
        ['c', 'zero', 'A perfectly <b>horizontal</b> line has a slope of ________.'], ['d', 'und', 'A perfectly <b>vertical</b> line has a(n) ________ slope.']].map(function (q) {
        return { id: '1' + q[0], level: 'LIM', make: function (r) {
          return typeMC(r, '(' + q[0] + ') ' + q[2] + ' (For example, the line shown.)' + linePic(r, q[1]), q[1], 'Since ' + KWHY[q[1]] + ', the answer is <b>' + (q[1] === 'zero' ? t('0') + ' (zero)' : KIND[q[1]].toLowerCase()) + '</b>.', ['Positive rises, negative falls, zero is flat, undefined is straight up and down.'], 'vocab ' + q[1]);
        } };
      }) },
      q25('2'), q25('3'), q25('4'), q25('5'),
      { num: '6', section: 'Part B — Mixing the four types', stem: function (sh) { return 'Each segment has integer endpoints. Complete the table: find the rise, the run and the slope of each segment (from its first letter to its second), then state its type.' + segGraph(sh.segs.map(function (s, i) { return { A: s[0], B: s[1], a: NM6[i].charAt(0), b: NM6[i].charAt(1) }; }), { x: [-6, 6], y: [-6, 6] }); },
        shared: q6Shared,
        parts: [0, 1, 2, 3].map(function (i) { return { id: '6' + 'abcd'.charAt(i), sub: NM6[i], level: 'BEG', make: function (r, sh) { return rrPart(NM6[i], sh.segs[i][0], sh.segs[i][1], { prompt: 'Segment ' + t(NM6[i]) + ': rise, run and slope' + (i === 3 ? ' (use the <b>undefined</b> key if there is no number).' : '.') }); } }; }).concat([
          { id: '6t', sub: 'type', level: 'LIM', make: function (r, sh) {
            var rows = sh.segs.map(function (s, i) { return { id: NM6[i], html: t(NM6[i]), sl: slopeOf(s[0], s[1]) }; });
            return typeGrid('State the <b>type</b> of each segment’s slope.', rows, rows.map(function (rw) { return rw.html + ': ' + (rw.sl == null ? 'undefined' : t(slT(rw.sl))) + ' → ' + KIND[kindOf(rw.sl)].toLowerCase(); }).join('; ') + '.', null, 'types of four segments');
          } }]) },
      { num: '7', stem: 'State whether each equation describes a horizontal or a vertical line, and give the slope of that line.', parts: ['a', 'b', 'c', 'd'].map(function (L) {
        return { id: '7' + L, level: L === 'd' ? 'EMG' : 'BEG', make: function (r) {
          var v, k;
          if (L === 'a') { v = 'y'; k = r.chance(0.2) ? 5 : r.int(1, 20); } else if (L === 'b') { v = 'x'; k = r.chance(0.2) ? -2 : -r.int(1, 20); } else if (L === 'c') { v = 'y'; k = r.chance(0.2) ? -7 : -r.int(1, 20); } else { v = r.chance(0.7) ? 'x' : 'y'; k = 0; }
          var horiz = v === 'y', eq = v + '=' + k;
          var opts = [{ html: 'Horizontal; slope ' + t('0'), right: horiz, why: horiz ? null : t(eq) + ' fixes the <b>' + t('x') + '</b>-coordinate: every point has ' + t('x=' + k) + ', so the line is vertical.', code: 'h0' },
            { html: 'Vertical; slope undefined', right: !horiz, why: horiz ? t(eq) + ' fixes the <b>' + t('y') + '</b>-coordinate: every point is at height ' + t(k) + ', so the line is horizontal.' : null, code: 'vu' },
            { html: 'Horizontal; slope undefined', why: horiz ? 'Horizontal is right, but a horizontal line has a rise of ' + t('0') + ': slope ' + t('\\frac{0}{\\text{run}}=0') + '.' : 'Every point has ' + t('x=' + k) + ' — the line goes straight up and down.', code: 'hu' },
            { html: 'Vertical; slope ' + t('0'), why: horiz ? 'Every point has ' + t('y=' + k) + ' — the line is flat.' : 'Vertical is right, but the run is ' + t('0') + ': you can’t divide by ' + t('0') + ', so the slope is undefined, not ' + t('0') + '.', code: 'v0' }];
          return mcCols(KP.mc(r, '(' + L + ') ' + t(eq), opts, horiz ? t(eq) + ': every point has ' + t('y=' + k) + (k === 0 ? ' — it is the ' + t('x') + '-axis' : '') + '. The line is <b>horizontal</b> and its slope is ' + t('0') + '.' : t(eq) + ': every point has ' + t('x=' + k) + (k === 0 ? ' — it is the ' + t('y') + '-axis' : '') + '. The line is <b>vertical</b> and its slope is <b>undefined</b>.', ['Which coordinate is fixed? ' + t('y=k') + ': every point at the same height. ' + t('x=k') + ': every point the same distance across.'], 'equation ' + eq, true));
        } };
      }) },
      { num: '8', stem: '', parts: [
        { id: '8', level: 'EMG', make: function (r) {
          var n = r.int(3, 9), a = r.int(-6, -1), b = a + r.int(4, 9);
          return KP.mc(r, 'Segment 1 joins ' + t(ptT([a, 2])) + ' and ' + t(ptT([b, 2])) + '; segment 2 joins ' + t(ptT([2, a])) + ' and ' + t(ptT([2, b])) + '. One has a slope of ' + t('0') + ' and the other an undefined slope. What is the difference between the two? Choose the explanation that uses <i>horizontal</i>, <i>vertical</i> and <i>divide</i> correctly.', [
            { html: 'A slope of ' + t('0') + ' belongs to a <b>horizontal</b> line: the rise is ' + t('0') + ', and ' + t('0') + ' divided by any run is ' + t('0') + ' (e.g. ' + t('\\frac{0}{' + n + '}=0') + '). An undefined slope belongs to a <b>vertical</b> line: the run is ' + t('0') + ', and you can’t <b>divide</b> by ' + t('0') + ' (e.g. ' + t('\\frac{' + n + '}{0}') + ').', right: true },
            { html: 'A slope of ' + t('0') + ' belongs to a <b>vertical</b> line and an undefined slope to a <b>horizontal</b> line, because you can’t <b>divide</b> ' + t('0') + ' by a number.', why: 'Swapped — and ' + t('\\frac{0}{' + n + '}') + ' is fine: it equals ' + t('0') + '. A horizontal line has rise ' + t('0') + ' (slope ' + t('0') + '); a vertical line has run ' + t('0') + ' (undefined).' },
            { html: 'They mean the same thing: both lines have no steepness, so you can’t <b>divide</b>.', why: 'A horizontal line is flat (slope ' + t('0') + '), but a vertical line is as steep as possible — its run is ' + t('0') + ', so the division can’t be done.' },
            { html: 'A <b>horizontal</b> line has slope ' + t('0') + ' because its run is ' + t('0') + '; a <b>vertical</b> line is undefined because its rise is ' + t('0') + '.', why: 'Rise and run are mixed up: horizontal means no change in ' + t('y') + ' (rise ' + t('0') + '); vertical means no change in ' + t('x') + ' (run ' + t('0') + ').' }],
            'Horizontal: rise ' + t('0') + ', slope ' + t('\\frac{0}{\\text{run}}=0') + ' — a real number. Vertical: run ' + t('0') + ', slope ' + t('\\frac{\\text{rise}}{0}') + ' — you can’t divide by ' + t('0') + ', so there is no number: undefined. (Example: from ' + t(ptT([a, 2])) + ' to ' + t(ptT([b, 2])) + ' the slope is ' + t('\\frac{0}{' + (b - a) + '}=0') + '; from ' + t(ptT([2, a])) + ' to ' + t(ptT([2, b])) + ' it is ' + t('\\frac{' + (b - a) + '}{0}') + ', undefined.)', ['Which one has a ' + t('0') + ' on top, and which has a ' + t('0') + ' on the bottom?'], 'zero vs undefined');
        } }] },
      { num: '9', stem: function (sh) { return 'Calculate the slope of the line through each pair of points, then state its type: ' + ['a', 'b', 'c', 'd'].map(function (L) { return '(' + L + ') ' + t(ptT(sh[L][0])) + ' and ' + t(ptT(sh[L][1])); }).join('; ') + '.'; }, shared: function (r) { return { a: q9Pair(r, 'a'), b: q9Pair(r, 'b'), c: q9Pair(r, 'c'), d: q9Pair(r, 'd') }; }, parts: ['a', 'b', 'c', 'd'].map(function (L) {
        return { id: '9' + L, level: 'BEG', make: function (r, sh) { var pr = sh[L]; return coordSlopePart('(' + L + ') ' + t(ptT(pr[0])) + ' and ' + t(ptT(pr[1])), pr[0], pr[1], { text: 'Q9 ' + L, hints: [FHINT, 'If the top is ' + t('0') + ', the slope is ' + t('0') + '. If the bottom is ' + t('0') + ', the slope is undefined.'] }); } };
      }).concat([{ id: '9t', sub: 'types', level: 'LIM', make: function (r, sh) {
        var rows = ['a', 'b', 'c', 'd'].map(function (L) { var pr = sh[L]; return { id: L, html: '(' + L + ') ' + t(ptT(pr[0])) + ', ' + t(ptT(pr[1])), sl: slopeOf(pr[0], pr[1]) }; });
        return typeGrid('State the type of the slope for each pair of points.', rows, rows.map(function (rw) { return rw.html + ': ' + (rw.sl == null ? 'undefined' : t(slT(rw.sl))) + ' → ' + KIND[kindOf(rw.sl)].toLowerCase(); }).join('<br>'), null, 'Q9 types', 'Points');
      } }]) },
      { num: '10', section: 'Part C — Applications, explanations and practice', stem: function (sh) { return 'A ski run is measured against a grid laid over a side-view photo. A skier starts at ' + t(ptT([0, sh.h])) + ' at the top of the run and stops at ' + t(ptT([sh.w, 0])) + ' at the bottom, where each unit is ' + t('1') + ' m.'; },
        shared: function (r) { var o = r.chance(0.2) ? [10, 40] : r.pick([[10, 40], [12, 48], [15, 60], [20, 60], [8, 40], [9, 36], [10, 50], [12, 36], [16, 48], [20, 80], [14, 56], [18, 54], [15, 45], [25, 100], [12, 60], [30, 90], [24, 72], [16, 64], [18, 72], [21, 84], [11, 44], [13, 52], [9, 45], [14, 42], [20, 100], [27, 81]]); return { h: o[0], w: o[1] }; },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, sh) { var sl = red(-sh.h, sh.w); return slopePart('(a) Calculate the slope of the hill along this line.', sl, t('m=\\frac{0-' + sh.h + '}{' + sh.w + '-0}=\\frac{-' + sh.h + '}{' + sh.w + '}=' + slT(sl)) + '.', [FHINT, 'The skier goes down as she moves right: what sign should the slope have?'], 'ski slope', { good: [rawFr(-sh.h, sh.w)], signHint: 'Check the sign: the skier goes <b>down</b> (from height ' + sh.h + ' to ' + t('0') + ') while moving right, so the slope is negative.' }); } },
          { id: '10b', level: 'BEG', make: function (r, sh) {
            return KP.mc(r, '(b) Why does it make sense for this slope to be negative?', [
              { html: 'The height (' + t('y') + ') <b>drops</b> as the horizontal distance (' + t('x') + ') increases, so the line falls from left to right.', right: true },
              { html: 'Because the skier is moving fast.', why: 'Speed isn’t part of this slope. The sign tells whether the line rises or falls from left to right.' },
              { html: 'Because the hill is steep.', why: 'Steepness is the <b>size</b> of the slope. The sign tells the direction: down from left to right.' },
              { html: 'Because both points have a coordinate of ' + t('0') + '.', why: 'Zeros in the coordinates don’t make a slope negative. Compare the heights at the start and the end.' }],
              'From ' + t(ptT([0, sh.h])) + ' to ' + t(ptT([sh.w, 0])) + ' the rise is negative (down ' + t(sh.h) + ') and the run is positive (right ' + t(sh.w) + '): opposite signs give a negative slope — the hill falls from left to right.', ['Going from the start to the end, does the height go up or down?'], 'why negative ski');
          } }] },
      { num: '11', stem: '', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var x = r.pick([-5, -3, -2, 1, 2, 4, 6]), y1 = r.int(-6, -1), y2 = y1 + r.int(3, 9);
          return KP.mc(r, 'The segment from ' + t(ptT([x, y1])) + ' to ' + t(ptT([x, y2])) + ' is vertical. Why is the slope of a vertical line <b>undefined</b> rather than equal to ' + t('0') + '? Choose the explanation that uses <i>rise</i>, <i>run</i> and <i>divide</i> correctly.', [
              { html: 'Every point on a vertical line has the same ' + t('x') + ', so the <b>run</b> is ' + t('0') + '. Slope <b>divides</b> the <b>rise</b> by the run, and dividing by ' + t('0') + ' has no answer: ' + t('\\frac{' + (y2 - y1) + '}{0}') + ' is undefined.', right: true },
              { html: 'The <b>rise</b> is ' + t('0') + ', and ' + t('0') + ' <b>divided</b> by the <b>run</b> is undefined.', why: 'The rise isn’t ' + t('0') + ': it is ' + t(y2 - y1) + '. And ' + t('0') + ' divided by a number is ' + t('0') + ', not undefined.' },
              { html: 'The <b>run</b> is ' + t('0') + ', so the slope is ' + t('0') + ' too: ' + t('\\frac{\\text{rise}}{0}=0') + '.', why: 'Check by multiplying back: ' + t('0\\times 0=0') + ', not ' + t(y2 - y1) + '. There is no number that works, so the slope is undefined.' },
              { html: 'The line is too steep to <b>divide</b> the <b>rise</b> and <b>run</b> accurately.', why: 'It isn’t about accuracy: the run is exactly ' + t('0') + ', and division by ' + t('0') + ' has no answer at all.' }],
            'Run ' + t('=' + subT(x, x) + '=0') + ', rise ' + t('=' + subT(y2, y1) + '=' + (y2 - y1)) + '. Slope ' + t('=\\frac{\\text{rise}}{\\text{run}}=\\frac{' + (y2 - y1) + '}{0}') + ': no number times ' + t('0') + ' gives ' + t(y2 - y1) + ', so the slope is <b>undefined</b>, not ' + t('0') + '.', ['Work out the rise and the run for the two points. Which one is ' + t('0') + '?'], 'why vertical undefined');
        } }] },
      { num: '12', stem: function (sh) { return 'On the grid, draw four lines through ' + t(ptT(sh.P)) + ': one with a positive slope, one with a negative slope, one with a slope of zero, and one with an undefined slope.'; },
        shared: function (r) { return { P: r.chance(0.25) ? [1, 1] : [r.int(-3, 3), r.int(-3, 3)] }; },
        parts: [
          { id: '12', level: 'EMG', make: function (r, sh) {
            var P = sh.P, lim = 6, win = { x: [-6, 6], y: [-6, 6] };
            var key = gv([], [lineV(arrowLine(P, [1, 1], lim)[0], arrowLine(P, [1, 1], lim)[1]), lineV(arrowLine(P, [1, -1], lim)[0], arrowLine(P, [1, -1], lim)[1]), lineV([-lim, P[1]], [lim, P[1]]), lineV([P[0], -lim], [P[0], lim])]);
            var p = KP.graph('Draw the four lines (each through the marked point).' + LINEHELP, { x: win.x, y: win.y, labels: 2, defaultEnd: 'arrow', tools: ['line', 'ends'], bg: { points: [{ x: P[0], y: P[1] }] } }, q12Check(P), key,
              'For example: a <b>positive</b> slope rising through ' + t(ptT(P)) + ' (like ' + t(ptT(P)) + ' to ' + t(ptT([P[0] + 1, P[1] + 1])) + '), a <b>negative</b> slope falling through it (' + t(ptT(P)) + ' to ' + t(ptT([P[0] + 1, P[1] - 1])) + '), a horizontal line ' + t('y=' + P[1]) + ' (slope ' + t('0') + ') and a vertical line ' + t('x=' + P[0]) + ' (undefined slope). Any rising and any falling line through the point are correct.',
              ['Start every line at ' + t(ptT(P)) + '. Rising, falling, flat, and straight up and down.', 'The flat line keeps ' + t('y=' + P[1]) + '; the straight-up line keeps ' + t('x=' + P[0]) + '.'], 'draw four slope types');
            p.bad = [gv([], [lineV([-lim, P[1]], [lim, P[1]]), lineV([P[0], -lim], [P[0], lim])]), gv([], [lineV(arrowLine(P, [1, 1], lim)[0], arrowLine(P, [1, 1], lim)[1]), lineV(arrowLine(P, [2, 1], lim)[0], arrowLine(P, [2, 1], lim)[1]), lineV([-lim, P[1]], [lim, P[1]]), lineV([P[0], -lim], [P[0], lim])])];
            return p;
          } }] },
      { num: '13', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '13', level: 'LIM', make: function (r) {
          var c = r.chance(0.25) ? CONTEXTS[0] : r.pick(CONTEXTS);
          return typeMC(r, 'Which of the following best describes the slope of ' + c[0] + '?', c[1], 'Picture ' + c[0] + ' from the side: ' + KWHY[c[1]] + '.', ['Picture it from the side, reading left to right.'], 'context type');
        } }] },
      { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '14', level: 'BEG', make: function (r) {
          var useB = r.chance(0.2), x = useB ? 3 : r.pick([-4, -2, 1, 2, 3, 5, 6]), y1 = useB ? -2 : r.int(-6, 0), y2 = useB ? 5 : y1 + r.int(3, 9), d = y2 - y1;
          return mcCols(KP.mc(r, 'A line segment has endpoints ' + t(ptT([x, y1])) + ' and ' + t(ptT([x, y2])) + '. Its slope is', [
            { html: t('0'), why: 'A slope of ' + t('0') + ' is horizontal. Here both points have ' + t('x=' + x) + ': the segment is vertical.', code: 'zero' }, { html: t(d), why: 'That’s the rise. Divide it by the run — which is ' + t('0') + '.', code: 'rise' },
            { html: 'undefined', right: true }, { html: t(-d), why: 'That’s the rise with the wrong sign — and the run is ' + t('0') + ', so you can’t divide at all.', code: 'negrise' }],
            'Run ' + t('=' + subT(x, x) + '=0') + ', so ' + t('m=\\frac{' + d + '}{0}') + ': you can’t divide by ' + t('0') + ' — the slope is <b>undefined</b> (a vertical segment).', ['Both points have the same ' + t('x') + '. What is the run?'], 'MC vertical slope', true));
        } }] },
      { num: '15', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '15', level: 'BEG', make: function (r) {
          var useB = r.chance(0.2), y = useB ? 4 : r.pick([-5, -3, -1, 2, 3, 4, 6, 7]), x1 = useB ? -2 : r.int(-7, -1), x2 = useB ? 6 : r.int(1, 9);
          return nrPart('The points ' + t(ptT([x1, y])) + ' and ' + t(ptT([x2, y])) + ' lie on a line. The slope of this line is ________.', 0, function (v) { if (near(v, x2 - x1)) return { code: 'rate-one', hint: 'That’s the run. The <b>rise</b> is ' + t('0') + ' (both points have ' + t('y=' + y) + '), so the slope is ' + t('\\frac{0}{' + (x2 - x1) + '}') + '.' }; return null; },
            t('m=\\frac{' + subT(y, y) + '}{' + subT(x2, x1) + '}=\\frac{0}{' + (x2 - x1) + '}=0') + ': a horizontal line.', ['Both points have the same ' + t('y') + '. What is the rise?'], 'NR zero slope');
        } }] }
    ],
    extra: EXTRA()
  });
  function q9Pair(r, L) {
    var bk = { a: [[1, 2], [4, 8]], b: [[5, -1], [2, 5]], c: [[-3, 6], [4, 6]], d: [[7, -2], [7, 9]] }[L];
    if (r.chance(0.2)) return bk;
    if (L === 'a') { var m = r.pick([2, 3, 4]), k = r.pick([2, 3]), A = [r.int(1, 4), r.int(1, 4)]; return [A, [A[0] + k, A[1] + m * k]]; }
    if (L === 'b') { var m2 = r.pick([2, 3]), k2 = r.pick([2, 3]), B2 = [r.int(1, 4), r.int(-3, 2)]; return [[B2[0] + k2, B2[1] - m2 * k2], B2]; }
    if (L === 'c') { var y = r.int(-6, 8); return [[r.int(-6, -1), y], [r.int(1, 7), y]]; }
    var x = r.int(-6, 8); return [[x, r.int(-6, -1)], [x, r.int(2, 9)]];
  }
  function ptPlain(p) { var m = function (v) { return v < 0 ? '−' + Math.abs(v) : String(v); }; return '(' + m(p[0]) + ', ' + m(p[1]) + ')'; }

  /* ======================= Extra practice ======================= */
  var E2 = { a: [['AB', [[-5, 2], [3, -4]]], ['CD', [[-4, -5], [-4, 3]]]], b: [['EF', [[-6, -3], [2, 3]]], ['GH', [[-5, 5], [4, 5]]]] };
  function e2Shared(r) {
    if (r.chance(0.2)) return { a: E2.a.map(function (x) { return x[1]; }), b: E2.b.map(function (x) { return x[1]; }) };
    var sa = placeApart(r, [{ rise: -r.pick([6, 3, 4, 2]), run: r.pick([8, 4, 6]) }, { rise: -r.pick([7, 8, 6, 9]), run: 0 }], 6), sb = placeApart(r, [{ rise: r.pick([6, 3, 4, 2]), run: r.pick([8, 4, 6]) }, { rise: 0, run: r.pick([7, 8, 9, 6]) }], 6);
    if (!sa || !sb) return { a: E2.a.map(function (x) { return x[1]; }), b: E2.b.map(function (x) { return x[1]; }) };
    sa[1] = [sa[1][1], sa[1][0]];   // C at the bottom, D at the top, like the booklet
    return { a: sa, b: sb };
  }
  function E3(r, L) {
    if (L === 'a') { var useB = r.chance(0.2), m = useB ? -4 : r.pick([-4, -3, -2, -5, 2, 3, 5]), b = useB ? 9 : r.pick([9, 7, 4, -3, -6, 2, 8]); return { tex: 'y=' + m + 'x' + (b < 0 ? b : '+' + b), sl: [m, 1], how: 'It is already in the form ' + t('y=mx+b') + ': the number multiplying ' + t('x') + ' is the slope, ' + t('m=' + m) + '.' }; }
    if (L === 'b') { var a = r.chance(0.2) ? 2 : r.pick([2, 3, 4, 5]), k = r.chance(0.2) ? 5 : r.pick([-3, -2, 2, 3, 4, 5]), c = -a * k; return { tex: a + 'x' + (c < 0 ? c : '+' + c) + '=0', sl: null, how: t(a + 'x' + (c < 0 ? c : '+' + c) + '=0') + ' gives ' + t(a + 'x=' + (-c)) + ', so ' + t('x=' + k) + ': a <b>vertical</b> line, slope <b>undefined</b>.' }; }
    if (L === 'c') { var k3 = r.chance(0.2) ? 6 : r.pick([-9, -8, -7, -5, -4, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]); return { tex: 'y' + (k3 < 0 ? '+' + (-k3) : '-' + k3) + '=0', sl: [0, 1], how: t('y' + (k3 < 0 ? '+' + (-k3) : '-' + k3) + '=0') + ' gives ' + t('y=' + k3) + ': a <b>horizontal</b> line, slope ' + t('0') + '.' }; }
    var useD = r.chance(0.2), aa = useD ? 5 : r.pick([2, 3, 4, 5]), bb = useD ? 3 : r.pick([1, 3, 5, -1, -3, 7].filter(function (v) { return gcd(v, aa) === 1; })), q = useD ? -3 : r.pick([-3, -2, 2, 4, -1]), cc = aa * q;
    return { tex: aa + 'y=' + (bb === 1 ? '' : bb === -1 ? '-' : bb) + 'x' + (cc < 0 ? cc : '+' + cc), sl: [bb, aa], how: 'Divide every term by ' + t(aa) + ': ' + t('y=' + frT(bb, aa) + 'x' + (q < 0 ? q : '+' + q)) + ', so ' + t('m=' + frT(bb, aa)) + '.' };
  }
  function E4(r, L) {
    if (L === 'a') { var dx = r.chance(0.2) ? 3 : r.pick([2, 3, 4, 5, 6]), dy = r.chance(0.2) ? 7 : r.pick([1, 5, 7, 8, 9, 11, 13].filter(function (v) { return gcd(v, dx) === 1; })); return { html: 'As ' + t('x') + ' increases by ' + t(dx) + ', ' + t('y') + ' decreases by ' + t(dy) + '.', sl: [-dy, dx] }; }
    if (L === 'b') { var k = r.chance(0.2) ? -2 : r.pick([-5, -3, -2, 1, 3, 4]); return { html: 'Every point on the line has a ' + t('y') + '-coordinate of ' + t(k) + '.', sl: [0, 1] }; }
    if (L === 'c') return r.chance(0.5) ? { html: 'The line is parallel to the ' + t('y') + '-axis.', sl: null } : { html: 'Every point on the line has an ' + t('x') + '-coordinate of ' + t(r.pick([-4, -1, 2, 6])) + '.', sl: null };
    var d2 = r.chance(0.2) ? 10 : r.pick([4, 6, 7, 8, 9, 10, 12, 15]), u = r.chance(0.2) ? 1 : r.pick([1, 2, 3, 4, 5].filter(function (v) { return gcd(v, d2) === 1 && v < d2 / 2; }));
    return { html: 'As ' + t('x') + ' increases by ' + t(d2) + ', ' + t('y') + ' increases by ' + t(u) + '.', sl: [u, d2] };
  }
  function steepSet(r, n, bk) {
    if (r.chance(0.2)) return bk;
    var pool = [[1, 5], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [1, 1], [5, 4], [3, 2], [7, 4], [2, 1], [5, 2], [3, 1], [4, 1], [7, 2]];
    for (var g = 0; g < 100; g++) {
      var ch = r.sample(pool, n), negs = r.sample(ch.map(function (x, i) { return i; }), Math.floor(n / 2));
      var s = ch.map(function (f, i) { return [negs.indexOf(i) >= 0 ? -f[0] : f[0], f[1]]; });
      var bySteep = s.slice().sort(function (a, b) { return Math.abs(a[0] / a[1]) - Math.abs(b[0] / b[1]); }).map(String).join('|'), byVal = s.slice().sort(function (a, b) { return a[0] / a[1] - b[0] / b[1]; }).map(String).join('|');
      if (bySteep !== byVal) return s;
    }
    return bk;
  }
  function slItem(s) { return { id: s.join('_'), tex: frT(s[0], s[1]) }; }
  function e7Pair(r, L) {
    var bk = { a: [[3, 4], [-4, 5]], b: [[-2, 1], [9, 4]], c: [[5, 6], [-6, 7]], d: [[-7, 2], [3, 1]] }[L];
    if (r.chance(0.2)) return bk;
    for (var g = 0; g < 100; g++) {
      var p;
      if (L === 'a') p = [r.pick([[2, 3], [3, 4], [3, 5], [1, 2], [2, 5], [4, 5], [1, 3]]), r.pick([[4, 5], [5, 6], [3, 4], [2, 3], [5, 8], [3, 5], [1, 2]])];
      else if (L === 'b') p = [[r.pick([2, 3, 1, 4]), 1], r.pick([[9, 4], [7, 2], [7, 3], [5, 4], [5, 2], [11, 4], [10, 3], [8, 3]])];
      else if (L === 'c') p = [r.pick([[5, 6], [4, 5], [6, 7], [3, 4], [7, 8], [8, 9]]), r.pick([[6, 7], [7, 8], [5, 6], [4, 5], [8, 9], [9, 10]])];
      else p = [r.pick([[7, 2], [5, 2], [9, 2], [10, 3], [11, 3], [9, 4], [13, 4]]), [r.pick([3, 4, 2, 5]), 1]];
      var a = p[0], b = p[1]; if (near(a[0] / a[1], b[0] / b[1])) continue;
      var negFirst = L === 'b' || L === 'd'; return negFirst ? [[-a[0], a[1]], b] : [a, [-b[0], b[1]]];
    }
    return bk;
  }
  function e10Check(o) {   // two points, both in a region, slope of a given sign
    return function (resp) {
      var L = readPts(resp);
      if (L.empty) return form('empty', 'Type your two points first.');
      if (L.bad) return form('pts-format', 'Write each point in brackets, separated by a comma, e.g. ' + t('(-5,\\ 6),\\ (-1,\\ 2)') + '.');
      if (L.pts.length !== 2) return form('pts-few', 'Give exactly two points.');
      var p = L.pts[0], q = L.pts[1]; if (same(p, q)) return form('pts-dup', 'Use two different points.');
      for (var i = 0; i < 2; i++) { var h = o.where(L.pts[i]); if (h) return wrong('u6l7-quad', t(ptT(L.pts[i])) + ' ' + h); }
      var sl = slopeOf(p, q), kd = kindOf(sl);
      if (kd !== o.kind) return wrong(kd === 'zero' || kd === 'und' ? 'u6l7-hv' : 'u6l7-sign', 'Your segment has ' + (sl == null ? 'an undefined slope (vertical)' : 'slope ' + t(fracSteps(q[1] - p[1], q[0] - p[0]))) + '. It needs a <b>' + KIND[o.kind].toLowerCase() + '</b> slope: ' + KWHY[o.kind] + '.');
      return ok();
    };
  }
  var QS = { I: [1, 1], II: [-1, 1], III: [-1, -1], IV: [1, -1] };
  function EXTRA() {
    return [
      { num: '1', section: 'Extra practice A — Naming the type from all four representations', stem: function (sh) { return '<b>From two points.</b> State the rise, the run, the slope, and the type (positive, negative, zero, or undefined): ' + ['a', 'b', 'c', 'd'].map(function (L) { return '(' + L + ') ' + t(ptT(sh[L][0])) + ' and ' + t(ptT(sh[L][1])); }).join('; ') + '.'; },
        shared: function (r) {
          var bk = { a: [[-6, 5], [2, 5]], b: [[-3, -7], [-3, 4]], c: [[-5, 8], [3, -4]], d: [[-7, -6], [5, -1]] };
          if (r.chance(0.2)) return bk;
          var y = r.pick([-6, -4, -2, 3, 5, 7]), x = r.pick([-5, -3, -1, 2, 4, 6]);
          var c = negPair(r, -1, false, [[3, 2], [4, 3], [5, 2], [5, 4]], 9) || bk.c, d = negPair(r, 1, false, [[5, 12], [3, 10], [2, 9], [5, 8], [3, 8]], 9) || bk.d;
          return { a: [[r.int(-8, -2), y], [r.int(1, 8), y]], b: [[x, r.int(-8, -2)], [x, r.int(1, 8)]], c: c, d: d };
        },
        parts: ['a', 'b', 'c', 'd'].map(function (L) { return { id: 'e1' + L, level: 'BEG', make: function (r, sh) { return rrPart('AB', sh[L][0], sh[L][1], { coords: true, prompt: '(' + L + ') ' + t('A' + ptT(sh[L][0])) + ' and ' + t('B' + ptT(sh[L][1])) + ': rise, run and slope (from ' + t('A') + ' to ' + t('B') + ').', text: 'E1 ' + L }); } }; }).concat([
          { id: 'e1t', sub: 'types', level: 'LIM', make: function (r, sh) { var rows = ['a', 'b', 'c', 'd'].map(function (L) { return { id: L, html: '(' + L + ') ' + t(ptT(sh[L][0])) + ', ' + t(ptT(sh[L][1])), sl: slopeOf(sh[L][0], sh[L][1]) }; }); return typeGrid('State the type of each slope.', rows, rows.map(function (rw) { return rw.html + ': ' + KIND[kindOf(rw.sl)].toLowerCase(); }).join('<br>'), null, 'E1 types', 'Points'); } }]) },
      { num: '2', stem: function (sh) { return '<b>From a graph.</b> Each grid shows two segments. Read the endpoints off the grid, calculate the slope of each segment, and state its type.' + '<div class="fig-row" style="display:flex;flex-wrap:wrap;gap:10px"><div><b>(a)</b>' + segGraph([{ A: sh.a[0][0], B: sh.a[0][1], a: 'A', b: 'B' }, { A: sh.a[1][0], B: sh.a[1][1], a: 'C', b: 'D' }], { x: [-7, 7], y: [-7, 7], max: 270 }) + '</div><div><b>(b)</b>' + segGraph([{ A: sh.b[0][0], B: sh.b[0][1], a: 'E', b: 'F' }, { A: sh.b[1][0], B: sh.b[1][1], a: 'G', b: 'H' }], { x: [-7, 7], y: [-7, 7], max: 270 }) + '</div></div>'; },
        shared: e2Shared,
        parts: [['a', 0, 'AB'], ['a', 1, 'CD'], ['b', 0, 'EF'], ['b', 1, 'GH']].map(function (q, i) {
          return { id: 'e2' + 'abcd'.charAt(i), sub: q[0] + ' · ' + q[2], level: 'BEG', make: function (r, sh) { var s = sh[q[0]][q[1]]; return coordSlopePart('(' + q[0] + ') Slope of ' + t(q[2]) + ' (read its endpoints from grid (' + q[0] + ')).', s[0], s[1], { text: 'E2 ' + q[2] + ' ' + ptT(s[0]) + ptT(s[1]), hints: ['Read ' + t(q[2].charAt(0)) + ' and ' + t(q[2].charAt(1)) + ' off the grid (the numbers go up by 2), then use ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + '.', 'Run ' + t('0') + ': undefined. Rise ' + t('0') + ': slope ' + t('0') + '.'] }); } };
        }).concat([{ id: 'e2t', sub: 'types', level: 'LIM', make: function (r, sh) {
          var rows = [['a', 0, 'AB'], ['a', 1, 'CD'], ['b', 0, 'EF'], ['b', 1, 'GH']].map(function (q) { var s = sh[q[0]][q[1]]; return { id: q[2], html: t(q[2]), sl: slopeOf(s[0], s[1]) }; });
          return typeGrid('State the type of each segment’s slope.', rows, rows.map(function (rw) { return rw.html + ': ' + KIND[kindOf(rw.sl)].toLowerCase(); }).join(', ') + '.', null, 'E2 types');
        } }]) },
      { num: '3', stem: function (sh) { return '<b>From an equation.</b> Rearrange each equation if you need to, then state the slope and its type: ' + ['a', 'b', 'c', 'd'].map(function (L) { return '(' + L + ') ' + t(sh[L].tex); }).join(',&nbsp; ') + '.'; }, shared: function (r) { return { a: E3(r, 'a'), b: E3(r, 'b'), c: E3(r, 'c'), d: E3(r, 'd') }; },
        parts: [['a', 'EMG'], ['b', 'PRG'], ['c', 'EMG'], ['d', 'ADV']].map(function (q) {
          return { id: 'e3' + q[0], level: q[1], make: function (r, sh) { var e = sh[q[0]]; return slopePart('(' + q[0] + ') ' + t(e.tex) + ': what is the slope? (Use the <b>undefined</b> key if there is no number.)', e.sl, e.how, ['Get ' + t('y') + ' by itself: in ' + t('y=mx+b') + ' the number multiplying ' + t('x') + ' is the slope.', 'If there is no ' + t('y') + ' at all, the equation is ' + t('x=k') + ': a vertical line. If there is no ' + t('x') + ', it is ' + t('y=k') + ': a horizontal line.'], 'E3 ' + e.tex, { lowest: true }); } };
        }).concat([{ id: 'e3t', sub: 'types', level: 'BEG', make: function (r, sh) {
          var rows = ['a', 'b', 'c', 'd'].map(function (L) { return { id: L, html: '<span style="white-space:nowrap">(' + L + ') ' + t(sh[L].tex) + '</span>', sl: sh[L].sl }; });
          return typeGrid('State the type of each line’s slope.', rows, rows.map(function (rw) { return rw.html + ': ' + KIND[kindOf(rw.sl)].toLowerCase(); }).join('<br>'), null, 'E3 types', 'Equation');
        } }]) },
      { num: '4', stem: function (sh) { return '<b>From a description.</b> State the slope type described. Where enough information is given, also state the slope itself.<br>' + ['a', 'b', 'c', 'd'].map(function (L) { return '(' + L + ') ' + sh[L].html; }).join('<br>'); }, shared: function (r) { return { a: E4(r, 'a'), b: E4(r, 'b'), c: E4(r, 'c'), d: E4(r, 'd') }; },
        parts: [
          { id: 'e4t', sub: 'types', level: 'BEG', make: function (r, sh) { var rows = ['a', 'b', 'c', 'd'].map(function (L) { return { id: L, html: '(' + L + ') ' + sh[L].html, sl: sh[L].sl }; }); return typeGrid('State the slope type described in each part.', rows, rows.map(function (rw) { return rw.html + ' → ' + KIND[kindOf(rw.sl)].toLowerCase(); }).join('<br>'), ['“Increases” as ' + t('x') + ' increases: positive. “Decreases”: negative. Same ' + t('y') + ' everywhere: zero. Same ' + t('x') + ' everywhere (parallel to the ' + t('y') + '-axis): undefined.'], 'E4 types', 'Description'); } },
          { id: 'e4a', sub: 'a · slope', level: 'BEG', make: function (r, sh) { var s = sh.a.sl; return slopePart('(a) ' + sh.a.html + ' State the slope.', s, 'The run is ' + t(s[1]) + ' and the rise is ' + t(s[0]) + ' (a decrease): ' + t('m=' + frT(s[0], s[1])) + '.', ['Rise = the change in ' + t('y') + ' (a decrease is negative); run = the change in ' + t('x') + '.'], 'E4a slope', { diag: function (v) { return near(v, s[1] / s[0]) ? { code: 'calc-flip', hint: 'That’s run over rise: the change in ' + t('y') + ' goes on top.' } : null; } }); } },
          { id: 'e4d', sub: 'd · slope', level: 'BEG', make: function (r, sh) { var s = sh.d.sl; return slopePart('(d) ' + sh.d.html + ' State the slope.', s, 'Rise ' + t(s[0]) + ', run ' + t(s[1]) + ': ' + t('m=' + frT(s[0], s[1])) + ' — a gentle positive slope.', ['Rise = the change in ' + t('y') + '; run = the change in ' + t('x') + '.'], 'E4d slope', { diag: function (v) { return near(v, s[1] / s[0]) ? { code: 'calc-flip', hint: 'That’s run over rise: the change in ' + t('y') + ' goes on top.' } : null; } }); } }] },
      { num: '5', section: 'Extra practice B — Steepness is not the same thing as sign', stem: function (sh) { return 'The <b>sign</b> of a slope tells you which way the line tilts. The <b>steepness</b> is the size of the number — its distance from ' + t('0') + ' — and ignores the sign. Four lines have slopes ' + t(sh.s.map(function (s) { return frT(s[0], s[1]); }).join(',\\ \\ ')) + '.'; },
        shared: function (r) { return { s: steepSet(r, 4, [[-4, 1], [1, 2], [-1, 3], [3, 1]]) }; },
        parts: [
          { id: 'e5a', level: 'EMG', make: function (r, sh) { var srt = sh.s.slice().sort(function (a, b) { return Math.abs(a[0] / a[1]) - Math.abs(b[0] / b[1]); }); return KP.order(r, '(a) List the four slopes in order of <b>steepness</b>, from least steep to steepest.', srt.map(slItem), { first: 'least steep', last: 'steepest', why: function () { return 'Compare the sizes (ignore the signs): ' + t(srt.map(function (s) { return '\\left|' + frT(s[0], s[1]) + '\\right|=' + dec(Math.abs(s[0] / s[1]), 2); }).join(',\\ ')) + '.'; } }, 'Sizes: ' + t(srt.map(function (s) { return '\\left|' + frT(s[0], s[1]) + '\\right|=' + dec(Math.abs(s[0] / s[1]), 2); }).join(',\\ ')) + '. Least steep to steepest: ' + t(srt.map(function (s) { return frT(s[0], s[1]); }).join(',\\ ')) + '.', ['Ignore the minus signs and compare the sizes.'], 'E5 steepness order'); } },
          { id: 'e5b', level: 'BEG', make: function (r, sh) { var srt = sh.s.slice().sort(function (a, b) { return a[0] / a[1] - b[0] / b[1]; }); return KP.order(r, '(b) List the same four slopes in order of <b>value</b>, from least to greatest.', srt.map(slItem), { first: 'least', last: 'greatest' }, 'On a number line: ' + t(srt.map(function (s) { return frT(s[0], s[1]); }).join('<')) + '.', ['Negative numbers are less than positive ones; among negatives, the one farther from ' + t('0') + ' is less.'], 'E5 value order'); } },
          { id: 'e5c', level: 'EMG', make: function (r, sh) {
            var steep = sh.s.slice().sort(function (a, b) { return Math.abs(b[0] / b[1]) - Math.abs(a[0] / a[1]); })[0], negs = sh.s.filter(function (s) { return s[0] < 0; }), big = negs.sort(function (a, b) { return a[0] / a[1] - b[0] / b[1]; })[0];
            return KP.mc(r, '(c) Your two lists are not the same. What makes them different?', [
              { html: 'Steepness ignores the sign — it is only the distance from ' + t('0') + ' — but value doesn’t. So a slope like ' + t(frT(big[0], big[1])) + ' is among the <b>least</b> values yet among the <b>steepest</b> lines.', right: true },
              { html: 'One of the lists has a mistake: steepness and value always give the same order.', why: 'Try ' + t('-4') + ' and ' + t('1') + ': ' + t('-4<1') + ', but a slope of ' + t('-4') + ' is four times as steep.' },
              { html: 'Negative slopes are never steep, so they go first in both lists.', why: 'A negative slope can be very steep — it just falls instead of rising.' },
              { html: 'Steepness puts the fractions first and the whole numbers last.', why: 'It isn’t about fractions: steepness is the size of the number, ' + t('|m|') + '.' }],
              'Value uses the sign; steepness uses only the size ' + t('|m|') + '. A negative slope with a big size (like ' + t(frT(big[0], big[1])) + ') is small as a value but steep as a line, so it moves from one end of the list to the other.', ['Look at where the negative slopes sit in each list.'], 'why lists differ');
          } }] },
      { num: '6', stem: function (sh) { return 'Five lines have slopes ' + t(sh.s.map(function (s) { return frT(s[0], s[1]); }).join(',\\ \\ ')) + '.'; },
        shared: function (r) { return { s: steepSet(r, 5, [[-5, 2], [7, 4], [-1, 1], [1, 5], [2, 1]]) }; },
        parts: [
          { id: 'e6a', level: 'PRG', make: function (r, sh) { var srt = sh.s.slice().sort(function (a, b) { return Math.abs(b[0] / b[1]) - Math.abs(a[0] / a[1]); }); return KP.order(r, '(a) List them from <b>steepest to least steep</b>.', srt.map(slItem), { first: 'steepest', last: 'least steep', why: function () { return 'Compare the sizes, ignoring the signs (change the fractions to decimals if that helps).'; } }, 'Sizes: ' + t(srt.map(function (s) { return '\\left|' + frT(s[0], s[1]) + '\\right|=' + dec(Math.abs(s[0] / s[1]), 2); }).join(',\\ ')) + '. Steepest to least steep: ' + t(srt.map(function (s) { return frT(s[0], s[1]); }).join(',\\ ')) + '.', ['Steepness is the size of the slope, ' + t('|m|') + '.'], 'E6 steep order'); } },
          { id: 'e6b', level: 'EMG', make: function (r, sh) { var srt = sh.s.slice().sort(function (a, b) { return b[0] / b[1] - a[0] / a[1]; }); return KP.order(r, '(b) List them from <b>greatest value to least value</b>.', srt.map(slItem), { first: 'greatest', last: 'least' }, 'Greatest to least: ' + t(srt.map(function (s) { return frT(s[0], s[1]); }).join('>')) + '.', ['Positive numbers first; among negatives, the one closest to ' + t('0') + ' is greatest.'], 'E6 value order'); } }] },
      { num: '7', stem: 'For each pair, choose the slope that belongs to the <b>steeper</b> line. Careful — in every pair one slope is negative.', parts: [['a', 'EMG'], ['b', 'BEG'], ['c', 'PRG'], ['d', 'BEG']].map(function (q) {
        return { id: 'e7' + q[0], level: q[1], make: function (r) {
          var p = e7Pair(r, q[0]), a = p[0], b = p[1], va = Math.abs(a[0] / a[1]), vb = Math.abs(b[0] / b[1]), win = va > vb ? a : b, lose = va > vb ? b : a;
          return mcCols(KP.mc(r, '(' + q[0] + ') ' + t(frT(a[0], a[1])) + ' or ' + t(frT(b[0], b[1])) + '?', [
            { html: t(frT(a[0], a[1])), right: win === a, why: win === a ? null : 'Compare sizes: ' + t('\\left|' + frT(a[0], a[1]) + '\\right|=' + dec(va, 3)) + ' and ' + t('\\left|' + frT(b[0], b[1]) + '\\right|=' + dec(vb, 3)) + '.' + (a[0] > 0 ? ' Being positive doesn’t make a line steeper.' : '') },
            { html: t(frT(b[0], b[1])), right: win === b, why: win === b ? null : 'Compare sizes: ' + t('\\left|' + frT(a[0], a[1]) + '\\right|=' + dec(va, 3)) + ' and ' + t('\\left|' + frT(b[0], b[1]) + '\\right|=' + dec(vb, 3)) + '.' + (b[0] > 0 ? ' Being positive doesn’t make a line steeper.' : '') },
            { html: 'They are equally steep.', why: 'Their sizes are different: ' + t(dec(va, 3)) + ' and ' + t(dec(vb, 3)) + '.' }],
            'Steepness ignores the sign: ' + t('\\left|' + frT(win[0], win[1]) + '\\right|=' + dec(Math.max(va, vb), 3)) + ' is greater than ' + t('\\left|' + frT(lose[0], lose[1]) + '\\right|=' + dec(Math.min(va, vb), 3)) + ', so ' + t(frT(win[0], win[1])) + ' is steeper.', ['Drop the signs and compare the sizes (decimals help when the fractions are close).'], 'E7 steeper ' + q[0], true));
        } };
      }) },
      { num: '8', stem: function (sh) { return '<b>Error analysis.</b> Dev is comparing a line of slope ' + t(-sh.a) + ' with a line of slope ' + t(sh.b) + '. He writes: “Since ' + t(-sh.a + '<' + sh.b) + ', the line with slope ' + t(-sh.a) + ' is less steep.”'; },
        shared: function (r) { if (r.chance(0.2)) return { a: 5, b: 2 }; var b = r.int(1, 5), a = b + r.int(1, 6); if (a % b === 0 && r.chance(0.5)) a++; return { a: a, b: b }; },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r, sh) {
            return KP.mc(r, '(a) Is his inequality correct? Is his conclusion correct?', [
              { html: 'The inequality ' + t(-sh.a + '<' + sh.b) + ' is correct, but the conclusion is not: he compared <b>values</b>, but steepness uses the <b>size</b> of the slope, ' + t('|' + (-sh.a) + '|=' + sh.a) + ' and ' + t('|' + sh.b + '|=' + sh.b) + '.', right: true },
              { html: 'Both are correct: smaller slopes are less steep.', why: 'A slope of ' + t(-sh.a) + ' falls ' + t(sh.a) + ' units for every ' + t('1') + ' across — that is steep. Compare sizes, not values.' },
              { html: 'The inequality is wrong: ' + t(-sh.a) + ' is greater than ' + t(sh.b) + '.', why: 'On a number line ' + t(-sh.a) + ' is to the left of ' + t(sh.b) + ', so ' + t(-sh.a + '<' + sh.b) + ' is true. The mistake is in the conclusion.' },
              { html: 'Both are wrong.', why: t(-sh.a + '<' + sh.b) + ' is a true statement about values. Only the conclusion about steepness is wrong.' }],
              'As numbers, ' + t(-sh.a + '<' + sh.b) + ' (true). But steepness is the size: ' + t(sh.a + '>' + sh.b) + ', so the line with slope ' + t(-sh.a) + ' is <b>steeper</b>. Dev confused value with steepness.', ['What does steepness measure — the value or the size of the slope?'], 'Dev error');
          } },
          { id: 'e8b', level: 'PRG', make: function (r, sh) {
            var f = red(sh.a, sh.b);
            return valuePart('(b) Which line really is steeper, and by how many times? Give the number of times (how many times as steep the steeper line is).', sh.a / sh.b, frT(f[0], f[1]), function (v) { if (near(v, sh.a - sh.b)) return { code: 'u6l7-times', hint: 'That’s the difference. “How many times” means divide the sizes: ' + t('\\frac{' + sh.a + '}{' + sh.b + '}') + '.' }; if (near(v, sh.b / sh.a)) return { code: 'u6l7-ratio-flip', hint: 'Divide the bigger size by the smaller one: the answer should be more than ' + t('1') + '.' }; if (near(v, -sh.a / sh.b)) return { code: 'calc-sign', hint: 'Steepness has no sign — use the sizes ' + t(sh.a) + ' and ' + t(sh.b) + '.' }; return null; },
              'The slope ' + t(-sh.a) + ' line is steeper (it falls; the other rises). ' + t('\\frac{|' + (-sh.a) + '|}{|' + sh.b + '|}=\\frac{' + sh.a + '}{' + sh.b + '}' + (f[1] !== 1 ? '=' + dec(sh.a / sh.b, 3) : '')) + ': it is ' + t(frT(f[0], f[1])) + ' times as steep.', ['Divide the larger size by the smaller size.'], 'how many times steeper', { after: 'times as steep' });
          } }] },
      { num: '9', section: 'Extra practice C — Zero and undefined: the pair students mix up', stem: '', parts: [
        { id: 'e9a', sub: 'table', level: 'BEG', make: function (r) {
          var rows = [{ id: 'hr', html: 'Horizontal line: rise' }, { id: 'hn', html: 'Horizontal line: run' }, { id: 'hs', html: 'Horizontal line: slope' }, { id: 'vr', html: 'Vertical line: rise' }, { id: 'vn', html: 'Vertical line: run' }, { id: 'vs', html: 'Vertical line: slope' }];
          var cols = [{ id: 'z', html: t('0') }, { id: 'nz', html: 'any non-zero number' }, { id: 'u', html: 'undefined' }], want = { hr: 'z', hn: 'nz', hs: 'z', vr: 'nz', vn: 'z', vs: 'u' };
          var shown = r.chance(0.5) ? rows : rows.slice(3).concat(rows.slice(0, 3));
          return KP.grid('Complete the table.', shown, cols, want, { rowHead: 'Line', why: function (row) { return { code: row === 'hs' || row === 'vs' ? 'u6l7-hv' : 'row', hint: row.charAt(0) === 'h' ? 'A horizontal line is flat: no change in ' + t('y') + ' (rise ' + t('0') + '), some change in ' + t('x') + ' (run not ' + t('0') + '), so the slope is ' + t('\\frac{0}{\\text{run}}=0') + '.' : 'A vertical line goes straight up: some change in ' + t('y') + ' (rise not ' + t('0') + '), no change in ' + t('x') + ' (run ' + t('0') + '), so the slope ' + t('\\frac{\\text{rise}}{0}') + ' is undefined.' }; } },
            'Horizontal: rise ' + t('0') + ', run any non-zero number, slope ' + t('0') + '. Vertical: rise any non-zero number, run ' + t('0') + ', slope undefined.', ['Horizontal: what doesn’t change, ' + t('x') + ' or ' + t('y') + '?'], 'E9 table');
        } },
        { id: 'e9b', sub: 'equations', level: 'BEG', make: function (r) {
          var hk = function (resp) { var e = eqRead(resp); if (!e) return form('unreadable', 'Write an equation, e.g. ' + t('y=4') + '.'); if (e.a === 0 && e.b !== 0) return ok(); if (e.b === 0 && e.a !== 0) return wrong('u6l7-hv', t('x=k') + ' is a <b>vertical</b> line. A horizontal line has the same ' + t('y') + ' everywhere: ' + t('y=k') + '.'); return wrong('u6l7-eq-slanted', 'That line is slanted. A horizontal line has the same ' + t('y') + ' everywhere: ' + t('y=k') + ' for some number ' + t('k') + '.'); };
          var vk = function (resp) { var e = eqRead(resp); if (!e) return form('unreadable', 'Write an equation, e.g. ' + t('x=4') + '.'); if (e.b === 0 && e.a !== 0) return ok(); if (e.a === 0 && e.b !== 0) return wrong('u6l7-hv', t('y=k') + ' is a <b>horizontal</b> line. A vertical line has the same ' + t('x') + ' everywhere: ' + t('x=k') + '.'); return wrong('u6l7-eq-slanted', 'That line is slanted. A vertical line has the same ' + t('x') + ' everywhere: ' + t('x=k') + '.'); };
          var k1 = r.int(-6, 6), k2 = r.int(-6, 6);
          var p = KP.fields('Give a sample equation for each line.', [{ label: 'Horizontal', name: 'Horizontal', mode: 'math', keys: 'eq', vars: ['x', 'y'], placeholder: 'e.g. y = 4' }, { label: 'Vertical', name: 'Vertical', mode: 'math', keys: 'eq', vars: ['x', 'y'], placeholder: 'e.g. y = 4' }], [hk, vk], ['y=' + k1, 'x=' + k2], 'e.g. ' + t('y=' + k1) + ' and ' + t('x=' + k2),
            'Any ' + t('y=k') + ' is horizontal (e.g. ' + t('y=' + k1) + ') and any ' + t('x=k') + ' is vertical (e.g. ' + t('x=' + k2) + ').', ['Horizontal: every point has the same ' + t('y') + '. Vertical: every point has the same ' + t('x') + '.'], 'E9 sample equations');
          p.good = [['y=-3', 'x=0'], ['y=0', 'x=7']]; p.bad = [['x=' + k1, 'y=' + k2], ['y=2x', 'x=1']]; return p;
        } },
        { id: 'e9c', sub: 'why', level: 'EMG', make: function (r) {
          var n = r.int(2, 9);
          return KP.mc(r, 'Using the words <i>rise</i>, <i>run</i> and <i>divide</i>: why is one of these two slopes the number ' + t('0') + ' while the other is not a number at all?', [
            { html: 'Slope <b>divides</b> the rise by the run. A horizontal line has <b>rise</b> ' + t('0') + ', and ' + t('\\frac{0}{' + n + '}=0') + ' is an ordinary number. A vertical line has <b>run</b> ' + t('0') + ', and ' + t('\\frac{' + n + '}{0}') + ' has no value — “undefined” means there is no number.', right: true },
            { html: 'A horizontal line has run ' + t('0') + ', so it divides to ' + t('0') + '; a vertical line has rise ' + t('0') + ', which can’t be divided.', why: 'Rise and run are swapped: horizontal means no rise; vertical means no run.' },
            { html: 'Both are numbers: undefined is just a very large slope.', why: '“Undefined” isn’t a big number: no number ' + t('k') + ' gives ' + t('k\\times 0=' + n) + '.' },
            { html: 'Dividing anything by a number gives ' + t('0') + ', and dividing by ' + t('0') + ' gives the same number back.', why: 'Check: ' + t('\\frac{' + n + '}{1}=' + n) + ', not ' + t('0') + '. And ' + t('\\frac{' + n + '}{0}') + ' would need ' + t('k\\times 0=' + n) + ' — impossible.' }],
            t('\\frac{0}{' + n + '}=0') + ' because ' + t('0\\times ' + n + '=0') + '. But ' + t('\\frac{' + n + '}{0}') + ' would need a number that gives ' + t(n) + ' when multiplied by ' + t('0') + ' — there isn’t one. So undefined is the <b>absence</b> of a number, not a strange value.', ['Check each division by multiplying back.'], 'why 0 vs undefined');
        } }] },
      { num: '10', stem: '<b>Work backwards.</b> Give points that satisfy each requirement.', shared: function (r) { var P = r.chance(0.2) ? [-3, 5] : [r.pick([-5, -4, -3, -2, 2, 3, 4]), r.pick([-4, -2, 3, 5, 6])]; var q = r.chance(0.25) ? 'II' : r.pick(['I', 'II', 'III', 'IV']), sg = r.chance(0.25) ? 'neg' : r.pick(['pos', 'neg']); return { P: P, q: q, sg: sg, ax: r.chance(0.3) ? 'yneg' : r.pick(['yneg', 'ypos', 'xneg', 'xpos']), sg2: r.chance(0.5) ? 'pos' : 'neg' }; },
        parts: [
          { id: 'e10a', level: 'BEG', make: function (r, sh) { var P = sh.P, k = [P[0], P[1] - 7]; var p = ptsPart('(a) Give a second point so that the segment from ' + t(ptT(P)) + ' has an <b>undefined</b> slope.', { n: 1, exclude: [P], test: onLineTest(P, [1, 0]) }, [k], 'Undefined means vertical (run ' + t('0') + '): keep ' + t('x=' + P[0]) + ', e.g. ' + t(ptT(k)) + ': ' + t('m=\\frac{-7}{0}') + ', undefined.', ['Which coordinate must stay the same so that the run is ' + t('0') + '?'], 'E10a'); p.bad = [ptT([P[0] + 3, P[1]])]; p.good = [ptT([P[0], P[1] + 2])]; return p; } },
          { id: 'e10b', level: 'BEG', make: function (r, sh) { var P = sh.P, k = [P[0] + 7, P[1]]; var p = ptsPart('(b) Give a second point so that the segment from ' + t(ptT(P)) + ' has a slope of <b>zero</b>.', { n: 1, exclude: [P], test: onLineTest(P, [0, 1]) }, [k], 'Zero means horizontal (rise ' + t('0') + '): keep ' + t('y=' + P[1]) + ', e.g. ' + t(ptT(k)) + ': ' + t('m=\\frac{0}{7}=0') + '.', ['Which coordinate must stay the same so that the rise is ' + t('0') + '?'], 'E10b'); p.bad = [ptT([P[0], P[1] + 3])]; p.good = [ptT([P[0] - 2, P[1]])]; return p; } },
          { id: 'e10c', level: 'ADV', make: function (r, sh) {
            var Q = QS[sh.q], kd = sh.sg, xs = Q[0] > 0 ? [1, 4] : [-5, -1], ys = Q[1] > 0 ? [1, 5] : [-5, -1];
            var A = kd === 'pos' ? [xs[0], ys[0]] : [xs[0], ys[1]], B = kd === 'pos' ? [xs[1], ys[1]] : [xs[1], ys[0]];
            var where = function (p) { if (p[0] === 0 || p[1] === 0) return 'is on an axis, not inside Quadrant ' + sh.q + '.'; return Math.sign(p[0]) === Q[0] && Math.sign(p[1]) === Q[1] ? null : 'is not in Quadrant ' + sh.q + ' (there ' + t('x') + ' is ' + (Q[0] > 0 ? 'positive' : 'negative') + ' and ' + t('y') + ' is ' + (Q[1] > 0 ? 'positive' : 'negative') + ').'; };
            var p = KP.math('(c) Give two points whose segment has a <b>' + KIND[kd].toLowerCase() + '</b> slope, with <b>both</b> points in Quadrant ' + sh.q + '.', e10Check({ kind: kd, where: where }), ptsT([A, B]),
              'For example ' + t(ptsT([A, B])) + ': both are in Quadrant ' + sh.q + ' (' + t('x') + ' ' + (Q[0] > 0 ? '> 0' : '< 0') + ', ' + t('y') + ' ' + (Q[1] > 0 ? '> 0' : '< 0') + '), and ' + t('m=' + formulaT(A, B) + '=' + fracSteps(B[1] - A[1], B[0] - A[0])) + ' is ' + KIND[kd].toLowerCase() + '. Many other answers work.', ['First list the signs of ' + t('x') + ' and ' + t('y') + ' in Quadrant ' + sh.q + '.', kd === 'pos' ? 'Positive: the right-hand point must be higher.' : 'Negative: the right-hand point must be lower.'], 'E10c', { keys: 'pairs', placeholder: 'e.g. (−5, 6), (−1, 2)' });
            p.bad = [ptsT([A, [B[0], A[1]]]), ptsT([[A[0], B[1]], [B[0], A[1]]])]; return p;
          } },
          { id: 'e10d', level: 'PRG', make: function (r, sh) {
            var ax = sh.ax, kd = sh.sg2, desc = { yneg: 'both ' + t('y') + '-coordinates negative', ypos: 'both ' + t('y') + '-coordinates positive', xneg: 'both ' + t('x') + '-coordinates negative', xpos: 'both ' + t('x') + '-coordinates positive' }[ax];
            var where = function (p) { var v = ax.charAt(0) === 'y' ? p[1] : p[0], want = ax.slice(1) === 'neg' ? -1 : 1; return Math.sign(v) === want ? null : 'doesn’t have a ' + (want < 0 ? 'negative' : 'positive') + ' ' + t(ax.charAt(0)) + '-coordinate.'; };
            var A, B; if (ax === 'yneg') { A = [-2, -7]; B = kd === 'pos' ? [3, -2] : [3, -9]; } else if (ax === 'ypos') { A = [-2, 3]; B = kd === 'pos' ? [3, 8] : [3, 1]; } else if (ax === 'xneg') { A = [-6, 1]; B = kd === 'pos' ? [-2, 5] : [-2, -3]; } else { A = [2, 1]; B = kd === 'pos' ? [6, 5] : [6, -3]; }
            var p = KP.math('(d) Give two points whose segment has a <b>' + KIND[kd].toLowerCase() + '</b> slope, with ' + desc + '.', e10Check({ kind: kd, where: where }), ptsT([A, B]),
              'For example ' + t(ptsT([A, B])) + ': ' + desc + ', and ' + t('m=' + formulaT(A, B) + '=' + fracSteps(B[1] - A[1], B[0] - A[0])) + '. Many other answers work.', [kd === 'pos' ? 'Positive: the right-hand point is higher.' : 'Negative: the right-hand point is lower.'], 'E10d', { keys: 'pairs', placeholder: 'e.g. (−2, −7), (3, −2)' });
            p.bad = [ptsT([A, [B[0], 2 * A[1] - B[1]]])]; return p;
          } }] },
      { num: '11', stem: '<b>Sketching.</b> Draw each segment long enough to read.', shared: function (r) { var useB = r.chance(0.2); return { P1: useB ? [-4, 3] : [r.int(-5, -2), r.int(1, 5)], P2: useB ? [2, -1] : [r.int(1, 5), r.int(-5, -1)], jk: useB ? [[-4, -2], [2, 1]] : (function () { var f = r.pick([[1, 2], [2, 3], [3, 4], [1, 3], [3, 2]]), k = f[1] <= 2 ? 3 : 2, A = [r.int(-5, -3), r.int(-4, -2)]; return [A, [A[0] + f[1] * k, A[1] + f[0] * k]]; })() }; },
        parts: [
          { id: 'e11a', level: 'EMG', make: function (r, sh) {
            var P1 = sh.P1, P2 = sh.P2, key = gv([], [{ v: [[P1[0] - 2, P1[1]], [P1[0] + 3, P1[1]]], s: 'closed', e: 'closed' }, { v: [[P2[0], P2[1] - 3], [P2[0], P2[1] + 3]], s: 'closed', e: 'closed' }]);
            var chk = function (resp) {
              if (DR.empty(resp)) return form('empty', 'Draw the two segments first.');
              var g = DR.geom(resp), ks = Object.keys(g.lines);
              if (!ks.length) return wrong('draw-noline', 'Join two points with the <b>╱ Line</b> tool to make each segment.');
              var hOK = false, vOK = false, other = null;
              ks.forEach(function (k) { var L = g.lines[k]; if (L.A === 0 && Math.abs(L.C / L.B - P1[1]) < 1e-6) hOK = true; else if (L.B === 0 && Math.abs(L.C / L.A - P2[0]) < 1e-6) vOK = true; else other = other || L; });
              if (other) { if (other.B === 0 && Math.abs(other.C / other.A - P1[0]) < 1e-6) return wrong('u6l7-hv', 'Through ' + t(ptT(P1)) + ' you drew a vertical segment (undefined slope). ' + t('PQ') + ' needs slope ' + t('0') + ': horizontal, keeping ' + t('y=' + P1[1]) + '.'); if (other.A === 0 && Math.abs(other.C / other.B - P2[1]) < 1e-6) return wrong('u6l7-hv', 'Through ' + t(ptT(P2)) + ' you drew a horizontal segment (slope ' + t('0') + '). ' + t('RS') + ' needs an undefined slope: vertical, keeping ' + t('x=' + P2[0]) + '.'); return wrong('u6l7-draw-miss', 'One of your segments isn’t horizontal through ' + t(ptT(P1)) + ' or vertical through ' + t(ptT(P2)) + '. Draw only those two.'); }
              if (!hOK) return wrong('u6l7-draw-type', 'Now draw ' + t('PQ') + ': slope ' + t('0') + ' (horizontal) through ' + t(ptT(P1)) + '.');
              if (!vOK) return wrong('u6l7-draw-type', 'Now draw ' + t('RS') + ': undefined slope (vertical) through ' + t(ptT(P2)) + '.');
              if (!DR.contains(resp, P1) || !DR.contains(resp, P2)) return wrong('u6l7-draw-miss', 'Make each segment pass through its given point.');
              return ok();
            };
            var p = KP.graph('(a) Draw segment ' + t('PQ') + ' with slope ' + t('0') + ' passing through ' + t(ptT(P1)) + ', and segment ' + t('RS') + ' with an undefined slope passing through ' + t(ptT(P2)) + '.<div class="muted">Use <b>╱ Line</b>: tap where a segment starts, tap where it ends, then tap that end again to finish.</div>', { x: [-7, 7], y: [-7, 7], labels: 2, defaultEnd: 'closed', tools: ['line', 'ends'], bg: { points: [{ x: P1[0], y: P1[1] }, { x: P2[0], y: P2[1] }] } }, chk, key,
              t('PQ') + ': any horizontal segment along ' + t('y=' + P1[1]) + ' through ' + t(ptT(P1)) + '. ' + t('RS') + ': any vertical segment along ' + t('x=' + P2[0]) + ' through ' + t(ptT(P2)) + '.', ['Slope ' + t('0') + ': flat. Undefined: straight up and down.'], 'E11a draw');
            p.bad = [gv([], [{ v: [[P1[0], P1[1] - 2], [P1[0], P1[1] + 2]], s: 'closed', e: 'closed' }, { v: [[P2[0] - 2, P2[1]], [P2[0] + 2, P2[1]]], s: 'closed', e: 'closed' }])]; return p;
          } },
          { id: 'e11bj', sub: 'b · JK', level: 'BEG', make: function (r, sh) { var J = sh.jk[0], Kp = sh.jk[1]; return coordSlopePart('(b) Segment ' + t('JK') + ' joins ' + t('J' + ptT(J)) + ' and ' + t('K' + ptT(Kp)) + '. Find its slope.', J, Kp, { text: 'E11 JK slope', lowest: true }); } },
          { id: 'e11b', sub: 'b · draw', level: 'ADV', make: function (r, sh) {
            var J = sh.jk[0], Kp = sh.jk[1], m = (Kp[1] - J[1]) / (Kp[0] - J[0]), mT = slT(slopeOf(J, Kp));
            var lmS = m < 2 ? [2, 1] : [3, 1], npS = m > 0.34 ? [-1, 4] : [-1, 5];
            var key = gv([], [{ v: [[0, -4], [lmS[1] * 2, -4 + lmS[0] * 2]], s: 'closed', e: 'closed' }, { v: [[-4, 5], [-4 + npS[1] * 2, 5 + npS[0] * 2]], s: 'closed', e: 'closed' }]);
            var chk = function (resp) {
              if (DR.empty(resp)) return form('empty', 'Draw the two segments first.');
              var g = DR.geom(resp), ks = Object.keys(g.lines).filter(function (k) { var L = g.lines[k]; return !(L.B !== 0 && Math.abs(-L.A / L.B - m) < 1e-9 && Math.abs(L.A * J[0] + L.B * J[1] - L.C) < 1e-6); });
              if (!ks.length) return wrong('draw-noline', 'Draw two new segments with the <b>╱ Line</b> tool.');
              var sl = ks.map(function (k) { var L = g.lines[k]; return L.B === 0 ? null : -L.A / L.B; });
              var lm = sl.filter(function (s) { return s != null && s > m + 1e-9; }), np = sl.filter(function (s) { return s != null && s < 0 && Math.abs(s) < m - 1e-9; });
              if (lm.length && np.length && ks.length === 2) return ok();
              if (ks.length > 2) return wrong('draw-many', 'Draw just two segments: ' + t('LM') + ' and ' + t('NP') + '.');
              if (!lm.length) { var pos = sl.filter(function (s) { return s != null && s > 0; }); if (pos.length && pos[0] <= m + 1e-9) return wrong('u6l7-steep-less', t('LM') + ' rises, but it isn’t steeper than ' + t('JK') + ' (slope ' + t(mT) + '). Make its slope bigger than ' + t(mT) + ' — e.g. ' + t(slT(lmS)) + '.'); var neg = sl.filter(function (s) { return s != null && s < 0 && Math.abs(s) > m; }); if (neg.length) return wrong('u6l7-steep-sign', 'That segment is steeper than ' + t('JK') + ', but it falls. ' + t('LM') + ' must <b>rise</b> (positive slope).'); return wrong('u6l7-sign', 'Draw ' + t('LM') + ': a rising segment that is steeper than ' + t('JK') + '.'); }
              var negs = sl.filter(function (s) { return s != null && s < 0; });
              if (negs.length) return wrong('u6l7-steep-more', t('NP') + ' falls, but it is too steep: its slope ' + t(slT(LN.toFr(negs[0]))) + ' has size ' + t(dec(Math.abs(negs[0]), 2)) + ', more than ' + t('JK') + '’s ' + t(dec(m, 2)) + '. Make it flatter, e.g. ' + t(slT(npS)) + '.');
              if (sl.some(function (s) { return s === 0 || s == null; })) return wrong('u6l7-sign', 'A flat or vertical segment isn’t negative. ' + t('NP') + ' must <b>fall</b> gently — e.g. slope ' + t(slT(npS)) + '.');
              return wrong('u6l7-sign', 'Now draw ' + t('NP') + ': a <b>falling</b> segment that is less steep than ' + t('JK') + '.');
            };
            var p = KP.graph('(b) ' + t('JK') + ' (slope ' + t(mT) + ') is drawn. Draw segment ' + t('LM') + ' with a <b>positive</b> slope that is <b>steeper</b> than ' + t('JK') + ', and segment ' + t('NP') + ' with a <b>negative</b> slope that is <b>less steep</b> than ' + t('JK') + '.<div class="muted">Use <b>╱ Line</b>: tap where a segment starts, tap where it ends, then tap that end again to finish.</div>', { x: [-7, 7], y: [-7, 7], labels: 2, defaultEnd: 'closed', tools: ['line', 'ends'], bg: { segs: [{ pts: [J, Kp], color: '#9aa1ad' }], points: [{ x: J[0], y: J[1], label: 'J' }, { x: Kp[0], y: Kp[1], label: 'K' }] } }, chk, key,
              t('m_{JK}=' + formulaT(J, Kp) + '=' + fracSteps(Kp[1] - J[1], Kp[0] - J[0])) + '. ' + t('LM') + ' needs any slope greater than ' + t(mT) + ' (e.g. ' + t(slT(lmS)) + '); ' + t('NP') + ' needs a negative slope whose size is less than ' + t(mT) + ' (e.g. ' + t(slT(npS)) + ') — a slope like ' + t('-2') + ' would be wrong, because it is steeper.', ['Steeper means a bigger size of slope; less steep means a smaller size.', 'For ' + t('NP') + ': fall only a little for a long run.'], 'E11b draw steeper/less steep');
            p.bad = [gv([], [{ v: [[0, -4], [2, 0]], s: 'closed', e: 'closed' }, { v: [[-4, 5], [-2, 1]], s: 'closed', e: 'closed' }])]; return p;
          } }] },
      { num: '12', stem: function (sh) { return '<b>Error analysis.</b> Asked for the slope of the segment joining ' + t(ptT([sh.x, sh.y1])) + ' and ' + t(ptT([sh.x, sh.y2])) + ', Priya wrote ' + t('m=\\frac{0}{' + (sh.y2 - sh.y1) + '}=0') + ' and called the line horizontal.'; },
        shared: function (r) { if (r.chance(0.2)) return { x: 4, y1: -1, y2: 6 }; var y1 = r.int(-6, 2); return { x: r.pick([-5, -3, -2, 2, 3, 5, 6]), y1: y1, y2: y1 + r.int(4, 9) }; },
        parts: [
          { id: 'e12a', level: 'BEG', make: function (r, sh) { return rrPart('AB', [sh.x, sh.y1], [sh.x, sh.y2], { coords: true, prompt: '(a) She put the change in ' + t('x') + ' on top. Give the correct rise and run from ' + t('A' + ptT([sh.x, sh.y1])) + ' to ' + t('B' + ptT([sh.x, sh.y2])) + ', and the slope (use the <b>undefined</b> key if there is no number).', text: 'E12 rr' }); } },
          { id: 'e12b', level: 'EMG', make: function (r, sh) {
            return mcCols(KP.mc(r, '(b) Which is the correct slope and description of the line?', [
              { html: 'Slope undefined; the line is vertical.', right: true }, { html: 'Slope ' + t('0') + '; the line is horizontal.', why: 'That’s Priya’s answer. Both points have ' + t('x=' + sh.x) + ', so the line goes straight up and down.' },
              { html: 'Slope ' + t('0') + '; the line is vertical.', why: 'Vertical is right, but the run is ' + t('0') + ', and dividing by ' + t('0') + ' gives no number: undefined, not ' + t('0') + '.' }, { html: 'Slope ' + t(sh.y2 - sh.y1) + '; the line is vertical.', why: t(sh.y2 - sh.y1) + ' is the rise. The slope divides it by the run, ' + t('0') + ' — impossible.' }],
              t('m=\\frac{' + subT(sh.y2, sh.y1) + '}{' + subT(sh.x, sh.x) + '}=\\frac{' + (sh.y2 - sh.y1) + '}{0}') + ': undefined. The line is <b>vertical</b>.', ['Both points have the same ' + t('x') + '.'], 'E12 description'));
          } },
          { id: 'e12c', level: 'EMG', make: function (r, sh) { return KP.line('(b) Give the equation of the line.', { x: sh.x }, {}, 'Every point has ' + t('x=' + sh.x) + ', so the equation is ' + t('x=' + sh.x) + '.', ['Which coordinate is the same for every point on the line?'], 'E12 equation'); } }] },
      { num: '13', section: 'Extra practice D — What slope means in the real world', stem: function (sh) { return 'A highway sign warns of ' + (sh.g === 8 || sh.g === 11 || sh.g === 18 ? 'an ' : 'a ') + t(sh.g + '\\%') + ' downhill <b>grade</b>. Grade is slope written as a percent: an ' + t(sh.g + '\\%') + ' downhill grade means the road drops ' + t(sh.g) + ' m of elevation for every ' + t('100') + ' m of horizontal distance.'; },
        shared: function (r) { var useB = r.chance(0.2), g = useB ? 8 : r.pick([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 20, 6, 8]); return { g: g, d: useB ? 2 : r.pick([0.5, 1.5, 2, 2.5, 3, 1.2, 0.8]), g2: useB ? 11 : g + r.int(1, 5) }; },
        parts: [
          { id: 'e13a', level: 'EMG', make: function (r, sh) {
            var f = red(-sh.g, 100), dv = -sh.g / 100;
            var c1 = slChk(f, { lowest: true, signHint: 'The road goes <b>down</b> as you move forward, so the slope is negative.' });
            var c2 = function (resp) { var p = HW.parse.number(resp); if (!p.ok) return form('empty', 'Write the decimal.'); if (near(p.value, dv)) return ok(); if (near(p.value, -dv)) return wrong('calc-sign', 'Downhill: the slope is negative.'); if (near(p.value, -sh.g)) return wrong('grade-whole', 'Percent means “out of 100”: ' + t(sh.g + '\\%=' + sh.g / 100) + '.'); return wrong('value', null); };
            var p = KP.fields('(a) Write this grade as a slope: as a fraction in lowest terms, and as a decimal.', [{ label: 'Fraction', name: 'Fraction', mode: 'math', keys: 'slope', placeholder: 'e.g. 3/4' }, { label: 'Decimal', name: 'Decimal' }], [c1, c2], [slT(f), String(dv)], t('m=' + slT(f) + '=' + dv),
              'Down ' + t(sh.g) + ' for every ' + t('100') + ' across: ' + t('m=\\frac{-' + sh.g + '}{100}=' + slT(f) + '=' + dv) + '. It is negative because the elevation <b>decreases</b> as the horizontal distance increases.', ['Rise = −' + sh.g + ' (a drop), run = 100.'], 'E13 grade');
            p.bad = [[frT(sh.g, 100), String(-dv)]]; return p;
          } },
          { id: 'e13b', level: 'EMG', make: function (r, sh) {
            var m = sh.d * 1000, drop = cl(sh.g * sh.d * 10);
            return KP.number('(b) How much elevation does a truck lose over a horizontal distance of ' + t(sh.d) + ' km?', drop, function (v) { if (near(v, cl(sh.g * sh.d / 100))) return { code: 'units-km', hint: 'Change ' + t(sh.d) + ' km to metres first (' + t('1') + ' km = ' + t('1000') + ' m).' }; if (near(v, -drop)) return { code: 'calc-sign', hint: 'The question asks how much it <b>loses</b> — give the drop as a positive number.' }; if (near(v, cl(sh.g * m))) return { code: 'grade-whole', hint: t(sh.g + '\\%') + ' is ' + t('\\frac{' + sh.g + '}{100}') + ', not ' + t(sh.g) + '.' }; return null; },
              t(sh.d + '\\text{ km}=' + m + '\\text{ m}') + '. Drop ' + t('=\\frac{' + sh.g + '}{100}\\times ' + m + '=' + drop) + ' m.', ['Convert km to m.', 'Drop = ' + t('\\frac{' + sh.g + '}{100}') + ' × horizontal distance.'], 'E13 drop', { after: 'm' });
          } },
          { id: 'e13c', level: 'BEG', make: function (r, sh) {
            return KP.mc(r, '(c) A second sign reads ' + t(sh.g2 + '\\%') + '. Which hill is steeper, and what would a driver notice?', [
              { html: 'The ' + t(sh.g2 + '\\%') + ' hill: it drops more per ' + t('100') + ' m, so the driver feels a faster drop and needs lower gears or more braking.', right: true },
              { html: 'The ' + t(sh.g + '\\%') + ' hill, because a smaller grade is steeper.', why: 'A bigger grade means a bigger drop for the same horizontal distance — steeper.' },
              { html: 'They are equally steep; both are downhill.', why: 'Both are downhill, but ' + t(sh.g2 + '\\%') + ' drops ' + t(sh.g2) + ' m per 100 m and ' + t(sh.g + '\\%') + ' only ' + t(sh.g) + ' m.' },
              { html: 'You can’t tell without knowing how long the hills are.', why: 'Steepness is the drop for each 100 m — the grade — not the length of the hill.' }],
              t(sh.g2 + '>' + sh.g) + ': the ' + t(sh.g2 + '\\%') + ' road drops ' + t(sh.g2) + ' m per ' + t('100') + ' m instead of ' + t(sh.g) + ' m — steeper.', ['Which drops more for every 100 m?'], 'E13 steeper');
          } }] },
      { num: '14', stem: function (sh) { return 'A wheelchair ramp must not be steeper than a ' + t('1{:}12') + ' slope — at most ' + t('1') + ' unit of rise for every ' + t('12') + ' units of run. A contractor builds a ramp that rises ' + t(sh.h) + ' m over a horizontal run of ' + t(sh.w) + ' m.'; },
        shared: function (r) { if (r.chance(0.2)) return { h: 0.75, w: 8 }; var o = r.pick([[0.75, 8], [0.5, 5], [0.6, 7], [0.9, 10], [0.45, 5], [0.8, 9], [0.4, 4.5], [0.3, 3.2], [0.7, 8], [0.6, 8], [0.5, 6.5], [0.9, 12], [0.4, 5.2], [0.75, 10], [0.3, 4], [0.6, 6.4], [0.5, 4.8], [0.8, 10], [0.45, 6], [0.35, 4.5], [0.25, 3.2]]); return { h: o[0], w: o[1] }; },
        parts: [
          { id: 'e14a', level: 'EMG', make: function (r, sh) { var H = Math.round(sh.h * 100), W = Math.round(sh.w * 100), f = red(H, W); return slopePart('(a) Calculate the ramp’s slope as a fraction in lowest terms.', f, t('\\frac{' + sh.h + '}{' + sh.w + '}=\\frac{' + H + '}{' + W + '}=' + frT(f[0], f[1])) + ' (multiply top and bottom by ' + t('100') + ', then reduce).', ['Clear the decimals by multiplying the top and the bottom by ' + t('100') + '.', 'Then reduce.'], 'E14 ramp slope', { lowest: true }); } },
          { id: 'e14b', level: 'PRG', make: function (r, sh) {
            var s = sh.h / sh.w, meets = s <= 1 / 12 + 1e-12, sD = dec(s, 4);
            return KP.mc(r, '(b) Compare the slope with ' + t('\\frac{1}{12}') + '. Does the ramp meet the requirement?', [
              { html: (meets ? '<b>Yes.</b> ' : '<b>No.</b> ') + t('\\frac{' + sh.h + '}{' + sh.w + '}\\approx ' + sD) + ' is ' + (meets ? 'not more than' : 'greater than') + ' ' + t('\\frac{1}{12}\\approx 0.0833') + ', so the ramp is ' + (meets ? 'gentle enough.' : 'too steep.'), right: true },
              { html: (meets ? '<b>No.</b> ' : '<b>Yes.</b> ') + t('\\approx ' + sD) + ' is ' + (meets ? 'less' : 'more') + ' than ' + t('\\frac{1}{12}') + ', and the rule needs a slope of at least ' + t('\\frac{1}{12}') + '.', code: 'ramp-max', why: 'The rule is a <b>maximum</b>: the ramp may be no steeper than ' + t('\\frac{1}{12}') + '. A smaller slope is fine; a bigger one is too steep.' },
              { html: (meets ? '<b>No.</b> ' : '<b>Yes.</b> ') + 'The run, ' + t(sh.w) + ' m, is ' + (sh.w < 12 ? 'less' : 'more') + ' than ' + t('12') + ' m.', why: 'Compare the <b>slope</b> with ' + t('\\frac{1}{12}') + ' (or the run with ' + t('12\\times ' + sh.h + '=' + cl(12 * sh.h)) + ' m), not the run with 12 m.' },
              { html: (meets ? '<b>No.</b> ' : '<b>Yes.</b> ') + 'Run ÷ rise ' + t('=' + sh.w + '\\div ' + sh.h + '\\approx ' + dec(sh.w / sh.h, 2)) + (meets ? ' is too big.' : ', which is more than 1.'), code: 'calc-flip', why: 'Slope is rise ÷ run. Compare ' + t('\\frac{' + sh.h + '}{' + sh.w + '}') + ' with ' + t('\\frac{1}{12}') + '.' }],
              t('\\frac{' + sh.h + '}{' + sh.w + '}\\approx ' + sD) + ' and ' + t('\\frac{1}{12}\\approx 0.0833') + '. ' + (meets ? 'Not greater, so it <b>meets</b> the requirement.' : 'Greater, so the ramp is too steep: it does <b>not</b> meet the requirement.'), ['Change both to decimals and compare.'], 'E14 meets?');
          } },
          { id: 'e14c', level: 'PRG', make: function (r, sh) {
            var run = cl(12 * sh.h);
            return KP.number('(c) What is the shortest run that would make a ' + t(sh.h) + ' m rise legal?', run, function (v) { if (near(v, cl(sh.h / 12)) || near(v, Number((sh.h / 12).toFixed(3))) || near(v, Number((sh.h / 12).toFixed(2)))) return { code: 'u6l7-ramp-run', hint: 'Each metre of rise needs at least ' + t('12') + ' m of run: <b>multiply</b> by 12.' }; if (near(v, sh.w)) return { code: 'value', hint: 'That’s the contractor’s run. What run gives a slope of exactly ' + t('\\frac{1}{12}') + '?' }; return null; },
              'At most ' + t('1') + ' m of rise per ' + t('12') + ' m of run: ' + t('\\text{run}=12\\times ' + sh.h + '=' + run) + ' m. (Any shorter run makes the slope steeper than ' + t('\\frac{1}{12}') + '.)', ['Solve ' + t('\\frac{' + sh.h + '}{\\text{run}}=\\frac{1}{12}') + '.'], 'E14 shortest run', { after: 'm' });
          } }] },
      { num: '15', stem: function (sh) { return 'A roof’s <b>pitch</b> is written as rise' + t('{:}') + 'run. A “' + sh.a + t('{:}') + '12 roof” rises ' + t(sh.a) + ' ft for every ' + t('12') + ' ft of horizontal run. A second roof has a pitch of ' + sh.b + t('{:}') + '12.'; },
        shared: function (r) { if (r.chance(0.2)) return { a: 5, b: 7 }; var a = r.int(3, 9), b = a + r.int(1, 4); if (b > 12) b = 12; if (b === a) a--; return { a: a, b: b }; },
        parts: [
          { id: 'e15a', level: 'BEG', make: function (r, sh) {
            var fa = red(sh.a, 12), fb = red(sh.b, 12);
            var p = KP.fields('(a) Write the slopes of a ' + sh.a + t('{:}') + '12 roof and a ' + sh.b + t('{:}') + '12 roof.', [{ label: sh.a + ':12', name: sh.a + ':12', mode: 'math', keys: 'slope', placeholder: 'e.g. 3/4' }, { label: sh.b + ':12', name: sh.b + ':12', mode: 'math', keys: 'slope', placeholder: 'e.g. 3/4' }], [slChk(fa), slChk(fb)], [slT(fa), slT(fb)], t(slT(fa)) + ' and ' + t(slT(fb)),
              'Rise over run: ' + t('\\frac{' + sh.a + '}{12}' + (gcd(sh.a, 12) > 1 ? '=' + slT(fa) : '')) + ' and ' + t('\\frac{' + sh.b + '}{12}' + (gcd(sh.b, 12) > 1 ? '=' + slT(fb) : '')) + '.', ['The pitch is rise : run, so the slope is ' + t('\\frac{\\text{rise}}{12}') + '.'], 'E15 roof slopes');
            p.good = [['\\frac{' + sh.a + '}{12}', '\\frac{' + sh.b + '}{12}']]; p.bad = [[frT(12, sh.a), frT(12, sh.b)]]; return p;
          } },
          { id: 'e15as', sub: 'a · steeper', level: 'LIM', make: function (r, sh) {
            return mcCols(KP.mc(r, '(a) Which roof is steeper?', [{ html: 'The ' + sh.b + ':12 roof', right: true }, { html: 'The ' + sh.a + ':12 roof', why: 'Both have a run of 12; the ' + sh.b + ':12 roof rises more (' + t(sh.b) + ' ft), so it is steeper.' }, { html: 'They are equally steep.', why: 'Same run, different rises: ' + t('\\frac{' + sh.b + '}{12}>\\frac{' + sh.a + '}{12}') + '.' }],
              'Same run (12 ft); the ' + sh.b + ':12 roof rises ' + t(sh.b) + ' ft instead of ' + t(sh.a) + ': ' + t('\\frac{' + sh.b + '}{12}>\\frac{' + sh.a + '}{12}') + ', so it is steeper.', ['Same run — which rises more?'], 'E15 steeper', true));
          } },
          { id: 'e15b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var f = red(-sh.b, 12);
            return slopePart('(b) A gable roof has two sides meeting at a peak. If the left side has slope ' + t(frT(sh.b, 12)) + ', what is the slope of the right side?', f, 'Reading left to right, the right side goes <b>down</b> from the peak by the same amount: ' + t('m=-' + frT(sh.b, 12)) + ' — same steepness, opposite sign.', ['After the peak, does the roof go up or down as you move right?'], 'E15 other side', { good: ['-\\frac{' + sh.b + '}{12}'], signHint: 'The right side falls from the peak as you move right, so its slope is negative.', diag: function (v) { return near(v, sh.b / 12) ? { code: 'u6l7-roof-same', hint: 'Read the right side from left to right: it goes <b>down</b> from the peak.' } : null; } });
          } },
          { id: 'e15c', sub: 'c', level: 'EMG', make: function (r, sh) {
            return KP.mc(r, '(c) The two sides have different slopes but the same steepness. How can both be true?', [
              { html: 'The sides tilt in opposite directions, so the slopes have opposite signs (' + t(frT(sh.b, 12)) + ' and ' + t(frT(-sh.b, 12)) + '); steepness ignores the sign, and both sizes are ' + t(frT(sh.b, 12)) + '.', right: true },
              { html: 'They can’t both be true: different slopes always mean different steepness.', why: 'Steepness is the size ' + t('|m|') + ': ' + t('\\left|' + frT(sh.b, 12) + '\\right|=\\left|' + frT(-sh.b, 12) + '\\right|') + '.' },
              { html: 'The right side is less steep because its slope is negative.', why: 'A negative slope isn’t less steep — it just falls. Its size is the same.' },
              { html: 'Because both sides have the same run of 12 ft.', why: 'The same run alone doesn’t settle it; the rise sizes are also equal, and the signs are opposite.' }],
              'Opposite tilt → opposite signs. Steepness is the size: ' + t('\\left|' + frT(sh.b, 12) + '\\right|=\\left|' + frT(-sh.b, 12) + '\\right|') + ', so the climb is equally hard on both sides.', ['What does steepness ignore?'], 'E15 same steepness');
          } }] },
      { num: '16', stem: function (sh) { return 'A tank is draining. Its water depth ' + t('d') + ' (in centimetres) after ' + t('t') + ' minutes is a linear relation with slope ' + t(-sh.r) + '. At ' + t('t=0') + ' the depth is ' + t(sh.D) + ' cm.'; },
        shared: function (r) { if (r.chance(0.2)) return { r: 3, D: 45, t: 8 }; var rt = r.pick([2, 3, 4, 5, 6]), T = r.pick([10, 12, 15, 20, 9, 8]); return { r: rt, D: rt * T, t: r.int(2, T - 2) }; },
        parts: [
          { id: 'e16a', level: 'BEG', make: function (r, sh) { return KP.mc(r, '(a) What does the <b>negative sign</b> tell you about the water?', [{ html: 'The depth is <b>decreasing</b> — the tank is losing water.', right: true }, { html: 'The depth is increasing.', why: 'A negative slope means the depth goes <b>down</b> as time goes on.' }, { html: 'The water is below ground level.', why: 'The sign of the slope is about change, not position: the depth is getting smaller.' }, { html: 'The tank is empty.', why: 'At ' + t('t=0') + ' it holds ' + t(sh.D) + ' cm. The sign says the depth is going down.' }], 'Negative slope: as ' + t('t') + ' increases, ' + t('d') + ' decreases — the tank is draining.', ['Negative slope: falls from left to right.'], 'E16 sign'); } },
          { id: 'e16b', level: 'BEG', make: function (r, sh) { return KP.mc(r, '(b) What do the <b>units</b> of the number ' + t(sh.r) + ' tell you?', [{ html: 'The water level drops ' + t(sh.r) + ' cm every minute (cm per minute).', right: true }, { html: 'The tank drains in ' + t(sh.r) + ' minutes.', why: 'The slope is a rate: centimetres per minute, not a time.' }, { html: 'The water is ' + t(sh.r) + ' cm deep.', why: 'That would be a depth. The slope is how fast the depth changes: cm per minute.' }, { html: 'Each centimetre takes ' + t(sh.r) + ' minutes to drain.', why: 'Upside down: the rate is (vertical units) per (horizontal unit) = cm per minute.' }], 'Units of slope = (units of ' + t('d') + ') per (unit of ' + t('t') + '): ' + t(sh.r) + ' cm per minute.', ['The rise is in cm; the run is in minutes.'], 'E16 units'); } },
          { id: 'e16c', level: 'EMG', make: function (r, sh) { var d = sh.D - sh.r * sh.t; return KP.number('(c) What is the depth after ' + t(sh.t) + ' minutes?', d, function (v) { if (near(v, sh.D + sh.r * sh.t)) return { code: 'calc-sign', hint: 'The tank is draining: subtract.' }; if (near(v, sh.r * sh.t)) return { code: 'rate-one', hint: 'That’s how much the level has dropped. What depth is left?' }; return null; }, t(sh.D + '-' + sh.r + '(' + sh.t + ')=' + sh.D + '-' + sh.r * sh.t + '=' + d) + ' cm.', ['Start at ' + t(sh.D) + ' and drop ' + t(sh.r) + ' cm for each minute.'], 'E16 depth', { after: 'cm' }); } },
          { id: 'e16d', sub: 'd', level: 'PRG', make: function (r, sh) { var T = sh.D / sh.r; return KP.number('(d) When is the tank empty?', T, function (v) { if (near(v, sh.D * sh.r)) return { code: 'calc-mult', hint: 'Divide the depth by the rate: how many ' + t(sh.r) + '-cm drops make ' + t(sh.D) + ' cm?' }; if (near(v, 0)) return { code: 'u6l7-empty-depth', hint: 'The depth is ' + t('0') + ' then — but the question asks <b>when</b>, in minutes.' }; return null; }, t(sh.D + '\\div ' + sh.r + '=' + T) + ' minutes.', ['How many minutes to lose all ' + t(sh.D) + ' cm at ' + t(sh.r) + ' cm per minute?'], 'E16 empty', { after: 'minutes' }); } },
          { id: 'e16e', sub: 'd · after', level: 'PRG', make: function (r, sh) { var T = sh.D / sh.r; return KP.mc(r, '(d) What happens to the graph after the tank is empty?', [{ html: 'The relation stops: the depth stays at ' + t('0') + ' instead of going negative, so the straight line no longer models the tank.', right: true }, { html: 'The line keeps going down: the depth becomes negative.', why: 'A tank can’t have a negative depth of water.' }, { html: 'The line goes back up: the tank refills.', why: 'Nothing says the tank refills; the water simply stops draining.' }, { html: 'The slope becomes undefined.', why: 'Undefined is for a vertical line. After ' + t(T) + ' minutes the depth just stays at ' + t('0') + ' (flat).' }], 'At ' + t('t=' + T) + ' the depth reaches ' + t('0') + '; it can’t go lower, so the graph stops following the line (the depth stays ' + t('0') + ').', ['Can a depth be negative?'], 'E16 after empty'); } }] },
      { num: '17', section: 'Extra practice E — Reasoning and stretch', stem: 'State whether each claim is <b>true</b> or <b>false</b>. If it is false, give a counterexample — an actual line that breaks the claim.', shared: function (r) { return { a: r.chance(0.3) ? ['pos', 'I'] : r.pick([['pos', 'I'], ['pos', 'III'], ['neg', 'II'], ['neg', 'IV']]), c: r.chance(0.3) ? 'III' : r.pick(['I', 'II', 'III', 'IV']), d: r.chance(0.25) ? 4 : r.pick([2, 3, 5, 6, '1/2', '2/3', '3/4']), dfalse: r.chance(0.3) }; },
        parts: [
          { id: 'e17a', sub: 'a', level: 'PRG', make: function (r, sh) { var s = sh.a[0], q = sh.a[1]; return KP.tf(r, '(a) “Every line with a ' + KIND[s].toLowerCase() + ' slope passes through Quadrant ' + q + '.”', true, 'Think about a ' + KIND[s].toLowerCase() + ' line far out to the ' + (q === 'I' || q === 'IV' ? 'right' : 'left') + ': ' + (s === 'pos' ? 'it keeps rising to the right and falling to the left' : 'it keeps falling to the right and rising to the left') + ', so it must eventually enter Quadrant ' + q + '.', '<b>True.</b> A line with a ' + KIND[s].toLowerCase() + ' slope goes on forever: far enough ' + (q === 'I' || q === 'IV' ? 'right' : 'left') + ', ' + t('x') + ' is ' + (q === 'I' || q === 'IV' ? 'positive' : 'negative') + ' and ' + t('y') + ' is ' + (q === 'I' || q === 'II' ? 'positive' : 'negative') + ' — that’s Quadrant ' + q + '.', ['Try a few lines, e.g. one that crosses the ' + t('y') + '-axis very high or very low.'], 'E17a'); } },
          { id: 'e17b', sub: 'b', level: 'EMG', make: function (r) { return KP.tf(r, '(b) “A line with slope ' + t('0') + ' passes through exactly two quadrants.”', false, 'Most horizontal lines do pass through two quadrants — but is there one that passes through none?', '<b>False.</b> The ' + t('x') + '-axis, ' + t('y=0') + ', has slope ' + t('0') + ' and passes through <b>no</b> quadrant (every other horizontal line does pass through exactly two).', ['Is there a horizontal line that sits on a boundary between quadrants?'], 'E17b'); } },
          { id: 'e17bc', sub: 'b · counterexample', level: 'ADV', make: function (r) {
            var chk = function (resp) { var e = eqRead(resp); if (!e) return form('unreadable', 'Write the equation of a line, e.g. ' + t('y=3') + '.'); if (e.a !== 0) return wrong('u6l7-ce-type', e.b === 0 ? 'That line is vertical (undefined slope). The claim is about lines with slope ' + t('0') + ' (horizontal): ' + t('y=k') + '.' : 'That line is slanted. The claim is about lines with slope ' + t('0') + ': ' + t('y=k') + '.'); if (Math.abs(e.c) > 1e-9) return wrong('u6l7-ce-two', t('y=' + (-e.c / e.b)) + ' passes through two quadrants, so it agrees with the claim. Which horizontal line passes through none?'); return ok(); };
            var p = KP.math('(b) Give the counterexample: the equation of a line with slope ' + t('0') + ' that does <b>not</b> pass through exactly two quadrants.', chk, 'y=0', 'The ' + t('x') + '-axis, ' + t('y=0') + ': it lies on the boundary between the quadrants, so it passes through none.', ['A horizontal line is ' + t('y=k') + '. Which value of ' + t('k') + ' puts it on an axis?'], 'E17b counterexample', { keys: 'eq', vars: ['x', 'y'], placeholder: 'e.g. y = 3' });
            p.good = ['0=y', '2y=0']; p.bad = ['y=3', 'x=0']; return p;
          } },
          { id: 'e17c', sub: 'c', level: 'EMG', make: function (r, sh) { var q = sh.c, left = q === 'II' || q === 'III'; return KP.tf(r, '(c) “A line with an undefined slope can never pass through Quadrant ' + q + '.”', false, 'A vertical line ' + t('x=k') + ' runs through every height. Pick ' + t('k') + ' ' + (left ? 'negative' : 'positive') + ': does it reach Quadrant ' + q + '?', '<b>False.</b> For example ' + t('x=' + (left ? -3 : 3)) + ' is vertical (undefined slope) and runs straight ' + (q === 'I' || q === 'II' ? 'up' : 'down') + ' through Quadrant ' + q + '.', ['Sketch a vertical line on the ' + (left ? 'left' : 'right') + ' side of the ' + t('y') + '-axis.'], 'E17c'); } },
          { id: 'e17cc', sub: 'c · counterexample', level: 'ADV', make: function (r, sh) {
            var q = sh.c, left = q === 'II' || q === 'III', k = left ? -3 : 3;
            var chk = function (resp) { var e = eqRead(resp); if (!e) return form('unreadable', 'Write the equation of a line, e.g. ' + t('x=2') + '.'); if (e.b !== 0) return wrong('u6l7-ce-type', 'The claim is about lines with an <b>undefined</b> slope — vertical lines, ' + t('x=k') + '.'); var x0 = -e.c / e.a; if (Math.abs(x0) < 1e-9) return wrong('u6l7-ce-axis', t('x=0') + ' is the ' + t('y') + '-axis: it passes through no quadrant at all. Move it ' + (left ? 'left' : 'right') + '.'); if ((x0 < 0) !== left) return wrong('u6l7-ce-side', t('x=' + x0) + ' is on the ' + (x0 < 0 ? 'left' : 'right') + ' of the ' + t('y') + '-axis, so it never enters Quadrant ' + q + '. Quadrant ' + q + ' is on the ' + (left ? 'left' : 'right') + '.'); return ok(); };
            var p = KP.math('(c) Give the counterexample: the equation of a line with an undefined slope that passes through Quadrant ' + q + '.', chk, 'x=' + k, t('x=' + k) + ' (any ' + t('x=k') + ' with ' + t('k') + ' ' + (left ? 'negative' : 'positive') + '): it is vertical and passes through Quadrants ' + (left ? 'II and III' : 'I and IV') + '.', ['A vertical line is ' + t('x=k') + '. Which side of the ' + t('y') + '-axis is Quadrant ' + q + ' on?'], 'E17c counterexample', { keys: 'eq', vars: ['x', 'y'], placeholder: 'e.g. x = 2' });
            p.good = ['x=' + (left ? -1 : 7)]; p.bad = ['x=0', 'x=' + (-k), 'y=' + k]; return p;
          } },
          { id: 'e17d', sub: 'd', level: 'BEG', make: function (r, sh) {
            var m = String(sh.d), mT = m.indexOf('/') > 0 ? '\\frac{' + m.split('/')[0] + '}{' + m.split('/')[1] + '}' : m, rec = m.indexOf('/') > 0 ? (m.split('/')[0] === '1' ? m.split('/')[1] : '\\frac{' + m.split('/')[1] + '}{' + m.split('/')[0] + '}') : '\\frac{1}{' + m + '}';
            if (sh.dfalse) return KP.tf(r, '(d) “A line of slope ' + t(mT) + ' and a line of slope ' + t(rec) + ' are equally steep.”', false, 'Compare the sizes: ' + t(mT) + ' and ' + t(rec) + ' are different numbers (one is the reciprocal of the other).', '<b>False.</b> Steepness is the size of the slope, and ' + t(mT + '\\ne ' + rec) + '. (A line of slope ' + t('-' + mT) + ' would be equally steep.)', ['Steepness is the size of the slope.'], 'E17d false');
            return KP.tf(r, '(d) “A line of slope ' + t(mT) + ' and a line of slope ' + t('-' + mT) + ' are equally steep.”', true, 'Steepness is the size of the number, ignoring the sign: ' + t('|' + mT + '|=|-' + mT + '|') + '.', '<b>True.</b> Steepness is the size of the slope: ' + t('\\left|' + mT + '\\right|=\\left|-' + mT + '\\right|') + '. They tilt opposite ways but climb equally hard.', ['Steepness is the size of the slope.'], 'E17d true');
          } }] },
      { num: '18', stem: function (sh) { return '<b>Stretch.</b> A segment has one endpoint pinned at the origin. Its other endpoint starts at ' + t(ptT([sh.R, 0])) + ' and rotates counterclockwise about the origin, staying ' + t(sh.R) + ' units away, until it finally arrives at ' + t(ptT([0, sh.R])) + '.' + rotFig(sh.R); },
        shared: function (r) { return { R: r.chance(0.25) ? 6 : r.int(3, 12) }; },
        parts: [
          { id: 'e18a', level: 'BEG', make: function (r, sh) { return slopePart('(a) What is the slope of the segment at the very start?', [0, 1], 'At the start the segment runs from ' + t('(0,\\ 0)') + ' to ' + t(ptT([sh.R, 0])) + ': rise ' + t('0') + ', run ' + t(sh.R) + ', ' + t('m=\\frac{0}{' + sh.R + '}=0') + ' — a <b>zero</b> slope (flat along the positive ' + t('x') + '-axis).', ['Rise and run from the origin to ' + t(ptT([sh.R, 0])) + '?'], 'E18a'); } },
          { id: 'e18b', level: 'EMG', make: function (r, sh) {
            var p = KP.fields('(b) Partway through the turn, the segment’s rise equals its run. What is its slope there, and what fraction of the quarter-turn has it completed?', [{ label: 'Slope', name: 'Slope', mode: 'math', keys: 'slope', placeholder: 'e.g. 3/4' }, { label: 'Fraction of the quarter-turn', name: 'Fraction', mode: 'math', keys: 'slope', placeholder: 'e.g. 3/4' }],
              [slChk([1, 1]), function (resp) { var v = valOf(resp); if (v == null) return form('empty', 'Write the fraction of the quarter-turn.'); if (near(v, 0.5)) return ok(); if (near(v, 45)) return form('u6l7-quarter', 'That’s the angle in degrees. As a fraction of the ' + t('90^\\circ') + ' quarter-turn, it is ' + t('\\frac{45}{90}') + '.'); return wrong('u6l7-quarter', 'Rise = run means the segment is exactly halfway between flat (' + t('0^\\circ') + ') and straight up (' + t('90^\\circ') + ').'); }],
              ['1', '\\frac{1}{2}'], 'slope ' + t('1') + '; ' + t('\\frac{1}{2}') + ' of the quarter-turn', 'Rise = run, so ' + t('m=\\frac{\\text{rise}}{\\text{run}}=1') + '. The segment makes a ' + t('45^\\circ') + ' angle — halfway from ' + t('0^\\circ') + ' to ' + t('90^\\circ') + ', so ' + t('\\frac{1}{2}') + ' of the quarter-turn.', ['If rise = run, what is rise ÷ run?', 'Equal rise and run cut the corner exactly in half.'], 'E18b');
            p.good = [['1', '0.5']]; p.bad = [['0', '\\frac{1}{2}'], ['1', '\\frac{1}{4}']]; return p;
          } },
          { id: 'e18c', level: 'PRG', make: function (r, sh) { return KP.mc(r, '(c) As the endpoint keeps climbing toward ' + t(ptT([0, sh.R])) + ', what happens to the slope?', [
            { html: 'It keeps growing and never reaches a largest value: as the run shrinks toward ' + t('0') + ', ' + t('\\frac{\\text{rise}}{\\text{run}}') + ' gets bigger without limit.', right: true },
            { html: 'It levels off at ' + t('1') + '.', why: 'Past halfway the rise is bigger than the run, so the slope is more than ' + t('1') + ' — and still growing.' },
            { html: 'It starts shrinking after halfway.', why: 'The rise keeps growing and the run keeps shrinking: the slope gets <b>bigger</b>.' },
            { html: 'It grows until it reaches ' + t(sh.R) + ', the length of the segment.', why: 'The slope isn’t a length. With run ' + t('0.1') + ' and rise about ' + t(sh.R) + ', the slope is about ' + t(sh.R * 10) + '.' }],
            'Near the end the rise is almost ' + t(sh.R) + ' and the run is tiny: e.g. run ' + t('0.1') + ' gives a slope near ' + t(sh.R * 10) + ', run ' + t('0.01') + ' near ' + t(sh.R * 100) + '. The slope grows without bound — there is no largest value.', ['Try a tiny run, like ' + t('0.1') + ', with a rise of almost ' + t(sh.R) + '.'], 'E18c'); } },
          { id: 'e18d', level: 'PRG', make: function (r, sh) { return KP.mc(r, '(d) At the very end, the segment is vertical. A classmate says “the slope climbs all the way to infinity and then becomes undefined.” Which response is correct?', [
            { html: 'At the end the run is ' + t('0') + ', so the slope is undefined. Infinity is not a number, so it can’t be the value of ' + t('\\frac{\\text{rise}}{\\text{run}}') + ': the slope doesn’t “reach” anything — it stops existing the instant the run becomes ' + t('0') + '. His picture of the slope growing is right.', right: true },
            { html: 'He is completely right: the slope at the end is infinity.', why: 'Infinity isn’t a number. ' + t('\\frac{' + sh.R + '}{0}') + ' has no value, so the slope is undefined.' },
            { html: 'He is wrong: the slope at the end is ' + t('0') + '.', why: 'A slope of ' + t('0') + ' is flat. At the end the segment is vertical: the run is ' + t('0') + '.' },
            { html: 'He is wrong: the slope at the end is ' + t(sh.R) + '.', why: t(sh.R) + ' is the rise. The run is ' + t('0') + ', and you can’t divide by ' + t('0') + '.' }],
            'Final position ' + t('(0,\\ 0)') + ' to ' + t(ptT([0, sh.R])) + ': ' + t('\\frac{' + sh.R + '}{0}') + ' — undefined. The slope grows without bound as the segment turns, but “infinity” is not a value it takes.', ['What is the run at the very end?'], 'E18d'); } }] },
      { num: '19', section: 'Mastery challenge', stem: function (sh) { return 'Point ' + t('P' + ptT(sh.P)) + ' is given.'; },
        shared: function (r) { var b = r.pick([[[2, 1], [3, 1]], [[1, 2], [1, 1]], [[1, 3], [1, 2]], [[3, 2], [2, 1]], [[1, 1], [3, 2]], [[2, 1], [5, 2]], [[1, 4], [1, 3]], [[3, 1], [4, 1]]]); return { P: [r.int(-3, 2), r.int(-2, 3)], lo: b[0], hi: b[1], sg: r.chance(0.5) ? -1 : 1 }; },
        parts: [
          { id: 'e19', level: 'MAS', make: function (r, sh) {
            var P = sh.P, lo = sh.lo, hi = sh.hi, vlo = lo[0] / lo[1], vhi = hi[0] / hi[1], sg = sh.sg, word = sg < 0 ? 'falls' : 'rises';
            var key = null; for (var run = 1; run <= 12 && !key; run++) for (var rise = 1; rise <= 40 && !key; rise++) { var v = rise / run; if (v > vlo + 1e-9 && v < vhi - 1e-9) key = [P[0] + run, P[1] + sg * rise]; }
            var chk = function (resp) {
              var L = readPts(resp); if (L.empty) return form('empty', 'Type a point first.'); if (L.bad || L.pts.length !== 1) return form('pts-format', 'Write one point in brackets, e.g. ' + t('(3,\\ -2)') + '.');
              var Q = L.pts[0]; if (same(Q, P)) return form('pts-given', 'That’s ' + t('P') + ' itself. Give a different point.');
              if (Q[0] % 1 || Q[1] % 1) return form('u6l7-int', 'Use a point with integer coordinates.');
              var sl = slopeOf(P, Q); if (sl == null) return wrong('u6l7-hv', 'From ' + t(ptT(P)) + ' to ' + t(ptT(Q)) + ' the segment is vertical (undefined slope). It must ' + word + '.');
              var v = sl[0] / sl[1], a = Math.abs(v), sT = t(fracSteps(Q[1] - P[1], Q[0] - P[0]));
              if (v === 0) return wrong('u6l7-hv', 'That segment is flat (slope ' + t('0') + '). It must ' + word + '.');
              if (Math.sign(v) !== sg) return wrong(a > vlo && a < vhi ? 'u6l7-steep-sign' : 'u6l7-sign', 'From ' + t(ptT(P)) + ' to ' + t(ptT(Q)) + ' the slope is ' + sT + ' — the segment ' + (v > 0 ? 'rises' : 'falls') + '. It must <b>' + word + '</b>' + (a > vlo && a < vhi ? ' (the steepness is right).' : '.'));
              if (near(a, vlo) || near(a, vhi)) return wrong('u6l7-bound', 'Slope ' + sT + ' is exactly as steep as ' + t(near(a, vlo) ? frT(sg * lo[0], lo[1]) : frT(sg * hi[0], hi[1])) + '. It has to be strictly between: steeper than one, less steep than the other.');
              if (a < vlo) return wrong('u6l7-steep-less', 'Slope ' + sT + ' is not steep enough: its size ' + t(dec(a, 3)) + ' is less than ' + t(dec(vlo, 3)) + '.');
              if (a > vhi) return wrong('u6l7-steep-more', 'Slope ' + sT + ' is too steep: its size ' + t(dec(a, 3)) + ' is more than ' + t(dec(vhi, 3)) + '.');
              return ok();
            };
            var p = KP.math('Give a point ' + t('Q') + ' with integer coordinates so that segment ' + t('PQ') + ' ' + word + ' from left to right, is <b>steeper</b> than a line of slope ' + t(frT(sg * lo[0], lo[1])) + ', and is <b>less steep</b> than a line of slope ' + t(frT(sg * hi[0], hi[1])) + '.', chk, ptT(key),
              'The slope must be ' + (sg < 0 ? 'negative' : 'positive') + ' with a size between ' + t(frT(lo[0], lo[1]) + '\\approx ' + dec(vlo, 3)) + ' and ' + t(frT(hi[0], hi[1]) + '\\approx ' + dec(vhi, 3)) + '. For example run ' + t(key[0] - P[0]) + ', rise ' + t(key[1] - P[1]) + ': ' + t('m=' + fracSteps(key[1] - P[1], key[0] - P[0]) + '\\approx ' + dec((key[1] - P[1]) / (key[0] - P[0]), 3)) + ', so ' + t('Q' + ptT(key)) + ' works. (Many other points work too.)',
              ['First decide the sign of the slope, then a size between the two sizes. If no whole-number rise works with a run of ' + t('1') + ', try a run of ' + t('2') + '.', 'Then step that run and rise from ' + t('P') + '.'], 'mastery slope between', { keys: 'pairs', placeholder: 'e.g. (3, −2)' });
            p.bad = [ptT([P[0] + 1, P[1] + sg * Math.ceil(vhi + 1)]), ptT([P[0] + key[0] - P[0], P[1] - (key[1] - P[1])])]; return p;
          } }] }
    ];
  }
  function rotFig(R) {
    var s = HW.graph({ x: [-1, R + 1], y: [-1, R + 1], labels: R > 6 ? 2 : 1, max: 220, segs: [{ pts: [[0, 0], [R, 0]] }, { pts: [[0, 0], [R * Math.cos(Math.PI / 6), R * Math.sin(Math.PI / 6)]], dash: true }, { pts: [[0, 0], [0, R]], dash: true }], fns: [{ f: function (x) { return Math.sqrt(Math.max(0, R * R - x * x)); }, from: 0.0001, to: R, dash: true, color: '#9aa1ad' }], points: [{ x: R, y: 0 }, { x: 0, y: R }], aria: 'rotating segment' });
    return '<div>' + s + '</div>';
  }
  function negPair(r, sgn, firstRight, pool, box) {
    for (var g = 0; g < 400; g++) {
      var f = r.pick(pool), k = r.pick([1, 2]), run = f[1] * k, rise = sgn * f[0] * k, A = [r.int(-box, box), r.int(-box, box)], Bp = [A[0] + run, A[1] + rise];
      if (Math.abs(Bp[0]) > box || Math.abs(Bp[1]) > box) continue;
      var negs = [A[0], A[1], Bp[0], Bp[1]].filter(function (v) { return v < 0; }).length; if (negs < 2) continue;
      if (A[0] === 0 || A[1] === 0 || Bp[0] === 0 || Bp[1] === 0) continue;
      return firstRight ? [Bp, A] : [A, Bp];
    }
    return null;
  }
})(window);
