/* Math 15 · Unit 6 · Lesson 6 — Rise Over Run: The Slope of a Line Segment (RF3)
 * Assignment 6 (u6_L06.tex, Questions 1–15) and the Lesson 6 Extra Practice (u6_EP06.tex, Questions 1–19).
 * Every part is a generator: same structure, idea and difficulty as the booklet question, new numbers from the seed
 * (the booklet's own points are among the possible values). Model: Math 10C u6l2.js (rise/run/slope rows, the slope
 * keypad with an "undefined" key, ordered-point answers checked by a rule, rates with units as multiple choice).
 * Conversions: "explain" questions -> multiple choice whose options are reasons; "which segments fall" -> a table of
 * choices; "order the segments" -> drag to order; "find two other points" -> any correct points are accepted.
 * Slopes: equivalent fractions and exact decimals are accepted (6/4 = 3/2 = 1.5); where the booklet asks for
 * "lowest terms" / "simplify", an unreduced fraction gets a nudge that doesn't use a try; a rounded decimal
 * (0.67 for 2/3) gets a nudge to give the exact fraction. Numerical-response slopes are decimals (0.5); 1/2 is accepted.
 * The assignment keeps to rising segments (positive slopes), as the lesson says; the Extra Practice uses negative,
 * zero and undefined slopes as the booklet's Extra Practice does.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 15(b) (a collinear middle point found from the slope of
 * the outer two). */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, K = HW.kit, KP = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, LN = HW.lines, DR = HW.draw;

  HW.addCodes({
    'rr-blank': 'Rise/run box left blank', 'rr-swap': 'Rise and run swapped', 'rr-sign': 'Rise or run with the wrong sign', 'rr-rise': 'Miscounted the rise', 'rr-run': 'Miscounted the run',
    'pts-format': 'Points not written as ordered pairs', 'pts-dup': 'Same point twice', 'pts-given': 'Gave the given point', 'pts-few': 'Not enough points',
    'pts-sign': 'Point stepped with the wrong slope sign', 'pts-flip': 'Point stepped run-over-rise', 'pts-off': 'Point not on the line', 'pts-vh': 'Horizontal/vertical mixed up (points)',
    'calc-sign': 'Sign of rise/run', 'calc-flip': 'Used run over rise', 'calc-mult': 'Multiplied instead of dividing', 'calc-divided': 'Divided instead of multiplying',
    'rate-flip': 'Rate upside down', 'rate-sign': 'Rate with the wrong sign', 'rate-one': 'Used one coordinate, not the change',
    'k-sign': 'Solved with the slope’s sign flipped', 'k-flip': 'Solved with run over rise', 'end-nostart': 'Forgot to start from the given point',
    'pct-dec': 'Grade as a decimal, not a percent', 'grade-whole': 'Used the percent as a whole number', 'decimal-rounded': 'Rounded decimal instead of exact fraction',
    'u6l6-sum': 'Added the coordinates instead of subtracting', 'u6l6-first': 'Used the other point as the first point', 'u6l6-total': 'Gave the total instead of the difference',
    'u6l6-rate-total': 'Used a total (not a change) for the rate', 'u6l6-pct-100': 'Percent not multiplied by 100', 'u6l6-ab-sign': 'Kept the minus sign in a or b', 'u6l6-ab-unreduced': 'Added the numbers of an unreduced fraction',
    'u6l6-mid': 'Used the wrong pair of points for the collinear slope'
  });
  HW.addPartial({ 'u6l6-sum': 'n', 'u6l6-first': 's', 'u6l6-total': 'b', 'u6l6-rate-total': 'n', 'u6l6-pct-100': 's', 'u6l6-ab-sign': 's', 'u6l6-ab-unreduced': 'b', 'u6l6-mid': 'b' });

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

  /* ---------------- assignment generators ---------------- */
  var NM1 = ['KL', 'MN'];
  function q1Shared(r) {
    if (r.chance(0.2)) return { segs: [[[-5, -3], [-1, 1]], [[0, -4], [4, 2]]] };
    for (var g = 0; g < 80; g++) {
      var kl = r.pick([[4, 4], [3, 3], [2, 4], [3, 6], [4, 2], [2, 6], [5, 5], [2, 2]]), mn = r.pick([[6, 4], [4, 6], [6, 2], [3, 6], [2, 3], [3, 4], [4, 3], [5, 2], [2, 5], [6, 3], [4, 8], [8, 4]]);
      if (near(kl[0] / kl[1], mn[0] / mn[1])) continue;
      var segs = placeSegs(r, [{ rise: kl[0], run: kl[1] }, { rise: mn[0], run: mn[1] }], 5);
      if (segs) return { segs: segs };
    }
    return { segs: [[[-5, -3], [-1, 1]], [[0, -4], [4, 2]]] };
  }
  function q2Shared(r) {
    if (r.chance(0.2)) return { E: [-2, 1], F: [4, 5] };
    var rr = r.pick([[4, 6], [2, 4], [3, 6], [6, 4], [2, 6], [4, 8], [6, 8], [6, 9], [3, 9], [4, 10], [6, 3], [8, 6]]);
    var E = [r.int(-4, 0), r.int(-2, 2)];
    return { E: E, F: [E[0] + rr[1], E[1] + rr[0]] };
  }
  /* positive-slope pair with integer slope m or fraction f (times k), coordinates in [lo, hi] */
  function pairWith(r, f, ks, xr, yr) {
    for (var g = 0; g < 200; g++) {
      var k = r.pick(ks), run = f[1] * k, rise = f[0] * k, A = [r.int(xr[0], xr[1]), r.int(yr[0], yr[1])], Bp = [A[0] + run, A[1] + rise];
      if (Bp[0] <= xr[2] && Bp[1] <= yr[2] && !(A[0] === 0 && A[1] === 0)) return [A, Bp];
    }
    return null;
  }
  function q3Pair(r, L) {
    var bk = { a: [[2, 3], [5, 9]], b: [[1, 2], [4, 11]], c: [[2, 5], [10, 9]], d: [[1, 1], [9, 7]] }[L];
    if (r.chance(0.2)) return bk;
    var spec = { a: [[r.pick([2, 3, 4]), 1], [2, 3]], b: [[r.pick([2, 3, 5]), 1], [2, 3]], c: [r.pick([[1, 2], [1, 3], [1, 4], [2, 3]]), [2, 4]], d: [r.pick([[3, 4], [2, 5], [3, 5], [4, 5], [2, 3]]), [2]] }[L];
    return pairWith(r, spec[0], spec[1], [1, 6, 16], [1, 6, 16]) || bk;
  }
  function q4Pair(r, L) {
    var bk = { a: [[-5, -3], [1, 3]], b: [[-4, -6], [4, -2]], c: [[-2, -7], [6, -1]], d: [[-8, -4], [-2, 5]] }[L];
    if (r.chance(0.2)) return bk;
    for (var g = 0; g < 300; g++) {
      var f = { a: r.pick([[1, 1], [2, 1], [1, 2], [2, 3]]), b: r.pick([[1, 2], [1, 3], [1, 4], [2, 5]]), c: r.pick([[3, 4], [2, 3], [3, 5], [1, 2]]), d: r.pick([[3, 2], [4, 3], [5, 2], [3, 2]]) }[L];
      var k = r.pick([2, 3]), run = f[1] * k, rise = f[0] * k;
      var A = { a: [r.int(-8, -2), r.int(-8, -2)], b: [r.int(-8, -2), r.int(-9, -4)], c: [r.int(-6, -1), r.int(-9, -5)], d: [r.int(-10, -6), r.int(-6, -2)] }[L], Bp = [A[0] + run, A[1] + rise];
      var okk = { a: Bp[0] > 0 && Bp[1] > 0, b: Bp[0] > 0 && Bp[1] < 0, c: Bp[0] > 0 && Bp[1] < 0, d: Bp[0] < 0 && Bp[1] > 0 }[L];
      if (okk && Math.abs(Bp[0]) <= 10 && Math.abs(Bp[1]) <= 10) return [A, Bp];
    }
    return bk;
  }
  function percentOf(f) { return cl(100 * f[0] / f[1]); }
  var HILLS = [[50, 250], [30, 150], [40, 200], [60, 300], [20, 250], [45, 300], [35, 500], [24, 400], [90, 600], [60, 500], [80, 500], [70, 350], [40, 500], [30, 250], [75, 500], [60, 400], [36, 300], [27, 300], [50, 400], [100, 400], [45, 500]];

  HW.defineLesson({
    id: 'u6l6', unit: 6, num: 6, title: 'Rise Over Run: The Slope of a Line Segment', outcome: 'RF3',
    blurb: 'Slope as rise over run — counted off a grid, then calculated with the slope formula — in ramps, hills, stairs and roads.',
    questions: [
      { num: '1', section: 'Part A — Counting rise and run from a grid', stem: function (sh) { return 'Complete the table by counting the rise and the run for each segment (from the first letter to the second), then writing its slope.' + segGraph(sh.segs.map(function (s, i) { return { A: s[0], B: s[1], a: NM1[i].charAt(0), b: NM1[i].charAt(1) }; }), { x: [-6, 6], y: [-6, 6] }); },
        shared: q1Shared,
        parts: [0, 1].map(function (i) { return { id: '1' + 'ab'.charAt(i), sub: NM1[i], level: 'BEG', make: function (r, sh) { return rrPart(NM1[i], sh.segs[i][0], sh.segs[i][1]); } }; }) },
      { num: '2', stem: function (sh) { return 'Segment ' + t('EF') + ' is plotted below, with ' + t('E' + ptT(sh.E)) + ' and ' + t('F' + ptT(sh.F)) + '.' + segGraph([{ A: sh.E, B: sh.F, a: 'E', b: 'F' }]); },
        shared: q2Shared,
        parts: [
          { id: '2a', level: 'BEG', make: function (r, sh) {
            var rise = sh.F[1] - sh.E[1], run = sh.F[0] - sh.E[0];
            return KP.number('(a) What is the rise from ' + t('E') + ' to ' + t('F') + '?', rise, function (v) { if (near(v, run)) return { code: 'rr-swap', hint: 'That’s the run (across). The <b>rise</b> is how far up you go: from ' + t('y=' + sh.E[1]) + ' to ' + t('y=' + sh.F[1]) + '.' }; if (near(v, -rise)) return { code: 'rr-sign', hint: t('F') + ' is higher than ' + t('E') + ', so the rise is positive.' }; if (near(v, sh.F[1])) return { code: 'rate-one', hint: 'That’s the height of ' + t('F') + '. The rise is the <b>change</b> in height from ' + t('E') + ' to ' + t('F') + '.' }; return null; },
              'From ' + t('E') + ' up to the level of ' + t('F') + ': ' + t(rise) + ' squares. Rise ' + t('=' + subT(sh.F[1], sh.E[1]) + '=' + rise) + '.', ['Count the squares <b>up</b> from ' + t('E') + ' to the height of ' + t('F') + '.'], 'rise E to F', { before: 'rise =' });
          } },
          { id: '2b', level: 'BEG', make: function (r, sh) {
            var rise = sh.F[1] - sh.E[1], run = sh.F[0] - sh.E[0];
            return KP.number('(b) What is the run from ' + t('E') + ' to ' + t('F') + '?', run, function (v) { if (near(v, rise)) return { code: 'rr-swap', hint: 'That’s the rise (up). The <b>run</b> is how far across you go: from ' + t('x=' + sh.E[0]) + ' to ' + t('x=' + sh.F[0]) + '.' }; if (near(v, -run)) return { code: 'rr-sign', hint: t('F') + ' is to the right of ' + t('E') + ', so the run is positive.' }; if (near(v, sh.F[0])) return { code: 'rate-one', hint: 'That’s the ' + t('x') + '-coordinate of ' + t('F') + '. The run is the <b>change</b> in ' + t('x') + ' from ' + t('E') + ' to ' + t('F') + '.' }; return null; },
              'From ' + t('E') + ' across to ' + t('F') + ': run ' + t('=' + subT(sh.F[0], sh.E[0]) + '=' + run) + '.', ['Count the squares <b>right</b> from ' + t('E') + ' to the position of ' + t('F') + '.'], 'run E to F', { before: 'run =' });
          } },
          { id: '2c', level: 'BEG', make: function (r, sh) {
            var rise = sh.F[1] - sh.E[1], run = sh.F[0] - sh.E[0], sl = red(rise, run);
            return slopePart('(c) What is the slope of ' + t('\\overline{EF}') + '? Simplify if possible.', sl, t('m=\\frac{\\text{rise}}{\\text{run}}=' + fracSteps(rise, run)) + '.', ['Slope ' + t('=\\frac{\\text{rise}}{\\text{run}}') + ' — use (a) and (b).', 'Divide the top and bottom by their greatest common factor.'], 'slope EF', { lowest: true });
          } }] },
      { num: '3', section: 'Part B — Using the slope formula', stem: 'Use the slope formula to determine the slope of the segment with each pair of endpoints.', parts: ['a', 'b', 'c', 'd'].map(function (L) {
        return { id: '3' + L, level: 'BEG', make: function (r) { var pr = q3Pair(r, L), nm = { a: 'PQ', b: 'RS', c: 'TU', d: 'VW' }[L]; return coordSlopePart('(' + L + ') ' + t(nm.charAt(0) + ptT(pr[0])) + ', ' + t(nm.charAt(1) + ptT(pr[1])), pr[0], pr[1], { text: 'slope formula ' + L }); } };
      }) },
      { num: '4', stem: 'Same instruction, but each pair involves negative coordinates. Simplify each answer.', parts: ['a', 'b', 'c', 'd'].map(function (L) {
        return { id: '4' + L, level: 'EMG', make: function (r) { var pr = q4Pair(r, L), nm = { a: 'AB', b: 'CD', c: 'EF', d: 'GH' }[L]; return coordSlopePart('(' + L + ') ' + t(nm.charAt(0) + ptT(pr[0])) + ', ' + t(nm.charAt(1) + ptT(pr[1])), pr[0], pr[1], { lowest: true, text: 'slope formula negatives ' + L }); } };
      }) },
      { num: '5', section: 'Part C — Applications and explanations', stem: '', parts: [
        { id: '5', level: 'BEG', make: function (r) {
          var o = r.chance(0.2) ? [3, 18] : r.pick([[3, 18], [2, 24], [3, 24], [2, 16], [4, 20], [3, 15], [2, 12], [5, 30], [4, 24], [3, 21], [2, 20], [3, 36], [4, 32], [2, 18], [5, 40], [3, 30], [2, 22], [4, 28], [3, 27], [5, 35], [2, 26], [4, 36], [3, 33], [6, 36]]), sl = red(o[0], o[1]);
          return slopePart('A wheelchair ramp climbs from the ground at ' + t('(0,\\ 0)') + ' to a doorway platform at ' + t(ptT([o[1], o[0]])) + ', where each unit represents ' + t('1') + ' foot. Determine the slope of the ramp.', sl,
            'Rise ' + t('=' + o[0] + '-0=' + o[0]) + ' ft, run ' + t('=' + o[1] + '-0=' + o[1]) + ' ft. ' + t('m=\\frac{' + o[0] + '}{' + o[1] + '}=' + frT(sl[0], sl[1])) + '.', ['The rise is the change in height (the ' + t('y') + '-values); the run is the change in horizontal position (the ' + t('x') + '-values).', 'Write ' + t('\\frac{\\text{rise}}{\\text{run}}') + ' and reduce.'], 'ramp slope ' + o, { good: [rawFr(o[0], o[1])], diag: function (v) { return near(v, o[1] / o[0]) ? { code: 'calc-flip', hint: 'That’s run over rise. The platform is ' + t(o[0]) + ' ft <b>up</b>: that’s the rise, and it goes on top.' } : null; } });
        } }] },
      { num: '6', stem: function (sh) { return 'A road sign warns of a hill ahead. The hill rises ' + t(sh.h[0]) + ' m in elevation over a horizontal distance of ' + t(sh.h[1]) + ' m.'; },
        shared: function (r) { return { h: r.chance(0.2) ? [50, 250] : r.pick(HILLS) }; },
        parts: [
          { id: '6a', level: 'BEG', make: function (r, sh) {
            var f = red(sh.h[0], sh.h[1]);
            return slopePart('(a) Determine the slope (grade) of the hill as a fraction in lowest terms.', f, t('m=\\frac{\\text{rise}}{\\text{run}}=\\frac{' + sh.h[0] + '}{' + sh.h[1] + '}=' + frT(f[0], f[1])) + '.', ['Rise = the elevation gained; run = the horizontal distance.', 'Divide the top and the bottom by the same number until you can’t any more.'], 'hill slope', { lowest: true });
          } },
          { id: '6b', level: 'EMG', make: function (r, sh) {
            var f = red(sh.h[0], sh.h[1]), pc = percentOf(f);
            return KP.number('(b) Write the slope of the hill as a percent.', pc, function (v) { if (near(v, cl(f[0] / f[1]))) return { code: 'pct-dec', hint: 'That’s the slope as a decimal. Multiply by ' + t('100') + ' to make it a percent.' }; if (near(v, cl(100 * f[1] / f[0]))) return { code: 'calc-flip', hint: 'Use rise ÷ run (not run ÷ rise), then multiply by ' + t('100') + '.' }; if (near(v, sh.h[0])) return { code: 'u6l6-pct-100', hint: 'That’s the rise in metres. A percent compares with ' + t('100') + ': ' + t('\\frac{' + sh.h[0] + '}{' + sh.h[1] + '}\\times 100') + '.' }; return null; },
              t(frT(f[0], f[1]) + '=' + dec(f[0] / f[1], 4) + '=' + pc + '\\%') + '. (A ' + t(pc + '\\%') + ' grade: the road climbs ' + t(pc) + ' m for every ' + t('100') + ' m across.)', ['Change the fraction to a decimal (top ÷ bottom), then multiply by ' + t('100') + '.'], 'hill grade percent', { after: '%' });
          } }] },
      { num: '7', stem: function (sh) { return 'A segment rises ' + t(sh.a) + ' units over a run of ' + t(sh.b) + ' units, so its slope is ' + t(rawFr(sh.a, sh.b)) + '.'; },
        shared: function (r) { var a = r.int(2, 7), b = r.int(3, 9); if (a === b) b++; return { a: a, b: b }; },
        parts: [
          { id: '7a', level: 'LIM', make: function (r, sh) {
            return KP.mc(r, '(a) What does the slope of a segment measure?', [
              { html: 'How <b>steep</b> it is: the vertical change (rise) compared with the horizontal change (run).', right: true },
              { html: 'How <b>long</b> it is.', why: 'The length is the distance from one end to the other (the distance formula). Slope compares how far it goes <b>up</b> with how far it goes <b>across</b>.' },
              { html: 'How <b>high</b> its top end is.', why: 'Height alone is just the rise. Slope compares the rise with the run.' },
              { html: 'How far it goes across.', why: 'That’s the run alone. Slope compares the rise with the run.' }],
              'Slope measures <b>steepness</b>: ' + t('\\frac{\\text{rise}}{\\text{run}}=\\frac{' + sh.a + '}{' + sh.b + '}') + ' means the segment goes up ' + t(sh.a) + ' for every ' + t(sh.b) + ' across. A bigger rise for the same run is a steeper segment.', ['Think of a ramp or a staircase: what does slope tell you about it?'], 'what slope measures');
          } },
          { id: '7b', level: 'LIM', make: function (r, sh) {
            return KP.mc(r, '(b) Why do we call slope “rise over run”?', [
              { html: 'The rise (' + t(sh.a) + ', the vertical change) is written <b>over</b> — on top of — the run (' + t(sh.b) + ', the horizontal change) in the fraction ' + t(rawFr(sh.a, sh.b)) + '.', right: true },
              { html: 'You add the rise and the run: ' + t(sh.a + '+' + sh.b) + '.', why: 'Slope is a fraction (a division), not a sum.' },
              { html: 'The run is written on top: ' + t(rawFr(sh.b, sh.a)) + '.', why: 'That would be “run over rise”. The rise goes on top.' },
              { html: 'Because the run is always bigger than the rise.', why: 'The run doesn’t have to be bigger: a steep segment can have a rise bigger than its run.' }],
              '“Over” means “on top of a fraction bar”: ' + t('\\text{slope}=\\frac{\\text{rise}}{\\text{run}}=\\frac{' + sh.a + '}{' + sh.b + '}') + '. The name tells you the ratio being calculated.', ['In a fraction, which number is “over” the other?'], 'why rise over run');
          } }] },
      { num: '8', stem: function (sh) { return 'A student claims the slope of the segment joining ' + t(ptT(sh.A)) + ' and ' + t(ptT(sh.B)) + ' is ' + t(frT(sh.B[0] - sh.A[0], sh.B[1] - sh.A[1])) + '.'; },
        shared: function (r) {
          if (r.chance(0.2)) return { A: [2, 3], B: [10, 9] };
          for (var g = 0; g < 100; g++) { var f = r.pick([[3, 4], [2, 3], [3, 5], [1, 2], [2, 5], [4, 5], [1, 3]]), k = r.pick([1, 2, 3]), A = [r.int(1, 6), r.int(1, 6)], Bp = [A[0] + f[1] * k, A[1] + f[0] * k]; if (Bp[0] <= 15 && Bp[1] <= 15) return { A: A, B: Bp }; }
          return { A: [2, 3], B: [10, 9] };
        },
        parts: [
          { id: '8a', level: 'BEG', make: function (r, sh) { return coordSlopePart('(a) Use the slope formula to check the claim: what is the slope?', sh.A, sh.B, { text: 'check claim slope' }); } },
          { id: '8b', level: 'PRG', make: function (r, sh) {
            var rise = sh.B[1] - sh.A[1], run = sh.B[0] - sh.A[0], c = slT(red(rise, run)), w = slT(red(run, rise)), sm = slT(red(sh.B[1] + sh.A[1], sh.B[0] + sh.A[0]));
            return KP.mc(r, '(b) Is the claim correct? If not, what mistake did the student most likely make?', [
              { html: 'Incorrect. The slope is ' + t(c) + '; the student put the <b>run on top</b> (change in ' + t('x') + ' over change in ' + t('y') + ').', right: true },
              { html: 'Correct: the slope is ' + t(w) + '.', why: 'Work it out: ' + t('\\frac{y_2-y_1}{x_2-x_1}=' + formulaT(sh.A, sh.B) + '=' + fracSteps(rise, run)) + '.' },
              { html: 'Incorrect. The slope is ' + t(c) + '; the student subtracted in a different order on the top and the bottom.', why: 'Subtracting in different orders changes the <b>sign</b>, not which number is on top. Compare ' + t(w) + ' with ' + t(c) + ': the numbers are flipped.' },
              { html: 'Incorrect. The slope is ' + t(c) + '; the student added the coordinates instead of subtracting.', why: 'Adding would give ' + t('\\frac{' + (sh.B[1] + sh.A[1]) + '}{' + (sh.B[0] + sh.A[0]) + '}=' + sm) + ', not ' + t(w) + '. Look at which numbers ended up on top.' }],
              t('m=' + formulaT(sh.A, sh.B) + '=' + fracSteps(rise, run)) + ', so the claim is <b>incorrect</b>. The claimed ' + t(w) + ' is ' + t('\\frac{' + run + '}{' + rise + '}') + ' reduced — the run (' + t(run) + ') on top and the rise (' + t(rise) + ') underneath: rise and run swapped.', ['Compare the claimed slope with the correct one. How are the two fractions related?'], 'student flipped slope');
          } }] },
      { num: '9', stem: '', parts: [
        { id: '9', level: 'PRG', make: function (r) {
          var o = r.chance(0.2) ? [20, 25] : r.pick([[20, 25], [18, 24], [16, 28], [15, 30], [21, 28], [18, 30], [20, 30], [16, 24], [14, 28], [18, 27], [20, 32], [15, 25], [21, 30], [17, 34], [16, 32], [15, 27], [19, 38], [18, 36], [20, 28], [16, 30], [21, 35], [15, 35], [18, 32]]), sl = red(o[0], o[1]), n = r.int(5, 12);
          return slopePart('A staircase has steps that are all the same size. Each step has a rise of ' + t(o[0]) + ' cm and a run of ' + t(o[1]) + ' cm. Determine the slope of the line connecting the bottom of the first step to the top of the last step.', sl,
            'Every step is identical, so ' + t('n') + ' steps rise ' + t(o[0] + 'n') + ' cm and run ' + t(o[1] + 'n') + ' cm, and ' + t('m=\\frac{' + o[0] + 'n}{' + o[1] + 'n}=\\frac{' + o[0] + '}{' + o[1] + '}=' + frT(sl[0], sl[1])) + ' — the number of steps cancels. (For example, ' + n + ' steps: ' + t('\\frac{' + o[0] * n + '}{' + o[1] * n + '}=' + frT(sl[0], sl[1])) + '.)',
            ['You don’t need the number of steps. Try 2 steps, then 3 steps: what happens to the slope?', 'Slope of one step ' + t('=\\frac{\\text{rise}}{\\text{run}}') + '.'], 'staircase slope', { good: [rawFr(o[0], o[1])], diag: function (v) { return near(v, o[1] / o[0]) ? { code: 'calc-flip', hint: 'That’s run over rise. Each step goes ' + t(o[0]) + ' cm <b>up</b> — the rise goes on top.' } : null; } });
        } }] },
      { num: '10', stem: '', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var A, Bp;
          if (r.chance(0.2)) { A = [10, 20]; Bp = [570, 160]; }
          else { for (var g = 0; g < 100; g++) { var f = r.pick([[1, 4], [1, 5], [2, 7], [1, 8], [3, 10], [1, 3], [2, 5], [3, 8], [2, 9], [3, 7]]), k = r.int(2, 8) * 10; A = [r.int(1, 9) * 10, r.int(1, 9) * 10]; Bp = [A[0] + f[1] * k, A[1] + f[0] * k]; if (Bp[0] - A[0] >= 200 && Bp[0] <= 900) break; } }
          var sl = slopeOf(A, Bp);
          return coordSlopePart('Two survey stakes are placed on a hillside at ' + t(ptT(A)) + ' and ' + t(ptT(Bp)) + ', where each unit represents ' + t('1') + ' metre. Determine the slope of the hillside between the two stakes, in lowest terms.', A, Bp, { lowest: true, text: 'survey stakes', hints: [FHINT, 'Big numbers reduce the same way: divide the top and the bottom by ' + t('10') + ', then keep going.'] });
        } }] },
      { num: '11', section: 'Part D — Multiple choice and numerical response', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'BEG', make: function (r) {
          var o = r.chance(0.2) ? [[0, 2], [6, 5]] : null;
          if (!o) { for (var g = 0; g < 100; g++) { var rr = r.pick([[3, 6], [2, 6], [2, 8], [4, 8], [3, 9], [4, 6], [2, 4], [6, 4], [6, 3], [4, 2], [3, 5], [5, 3]]), P = [r.int(0, 2), r.int(0, 2)], Q = [P[0] + rr[1], P[1] + rr[0]]; if (Q[0] <= 8 && Q[1] <= 7) { o = [P, Q]; break; } } }
          var P0 = o[0], Q0 = o[1], rise = Q0[1] - P0[1], run = Q0[0] - P0[0], c = slT(red(rise, run));
          var opts = [{ html: t(c), right: true }, { html: t(slT(red(run, rise))), why: 'That’s run over rise. Count the rise (up) first — it goes on top.' }, { html: t(String(rise)), why: 'That’s only the rise. Divide it by the run.' }, { html: t(String(run)), why: 'That’s only the run. The slope is the rise divided by the run.' }];
          var seen = {}, more = [{ html: t(String(rise + run)), why: 'Slope divides the rise by the run; it doesn’t add them.' }, { html: t(String(rise * run)), why: 'Slope divides the rise by the run; it doesn’t multiply them.' }, { html: t(String(Math.abs(run - rise))), why: 'Slope divides the rise by the run; it doesn’t subtract them.' }];
          opts = opts.concat(more).filter(function (x) { if (seen[x.html]) return false; seen[x.html] = 1; return true; }).slice(0, 4);
          return mcCols(KP.mc(r, 'The slope of ' + t('\\overline{PQ}') + ' shown below is' + segGraph([{ A: P0, B: Q0, a: 'P', b: 'Q' }], { x: [-1, 9], y: [-1, 8], max: 280 }), opts,
            'From ' + t('P' + ptT(P0)) + ' to ' + t('Q' + ptT(Q0)) + ': rise ' + t(rise) + ', run ' + t(run) + '. ' + t('m=' + fracSteps(rise, run)) + '.', ['Count up from ' + t('P') + ' to the height of ' + t('Q') + ', then across.'], 'MC slope of PQ from graph'));
        } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'EMG', make: function (r) {
          var useB = r.chance(0.2), P = useB ? [2, 4] : [r.int(-3, 5), r.int(-3, 5)], m = useB ? 3 : r.pick([2, 3, 4, 5]), k = useB ? 1 : r.pick([1, 1, 2]);
          var opts = [{ html: t(ptT([P[0] + k, P[1] + k * m])), right: true },
            { html: t(ptT([P[0] + k, P[1] - k * m])), why: 'From ' + t(ptT(P)) + ' that point goes <b>down</b> as you move right: its slope is ' + t(-m) + '.' },
            { html: t(ptT([P[0] + k * m, P[1] + k])), why: 'From ' + t(ptT(P)) + ' that point gives rise ' + t(k) + ' and run ' + t(k * m) + ': a slope of ' + t(frT(1, m)) + ' (run over rise).' },
            { html: t(ptT([P[0] - k, P[1] + k * m])), why: 'That point is to the <b>left</b> and higher: rise ' + t(k * m) + ', run ' + t(-k) + ', slope ' + t(-m) + '.' }];
          if (useB) opts = [{ html: t('(3,\\ 7)'), right: true }, { html: t('(3,\\ 1)'), why: 'From ' + t('(2,\\ 4)') + ' to ' + t('(3,\\ 1)') + ': rise ' + t('-3') + ', run ' + t('1') + ' — slope ' + t('-3') + '.' }, { html: t('(5,\\ 4)'), why: 'Same height as ' + t('(2,\\ 4)') + ': rise ' + t('0') + ', slope ' + t('0') + '.' }, { html: t('(1,\\ 7)'), why: 'That point is to the <b>left</b>: rise ' + t('3') + ', run ' + t('-1') + ', slope ' + t('-3') + '.' }];
          var right = useB ? [3, 7] : [P[0] + k, P[1] + k * m];
          return mcCols(KP.mc(r, 'Which point, together with ' + t(ptT(P)) + ', forms a line segment with a slope of ' + t(m) + '?', opts,
            'Test each point with ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + '. With ' + t(ptT(right)) + ': ' + t(formulaT(P, right) + '=\\frac{' + (right[1] - P[1]) + '}{' + (right[0] - P[0]) + '}=' + m) + ' ✓. (A slope of ' + t(m) + ' means ' + t(m) + ' up for every ' + t('1') + ' to the right.)', ['A slope of ' + t(m) + ' is ' + t('\\frac{' + m + '}{1}') + ': up ' + t(m) + ', right ' + t('1') + '.'], 'which point slope ' + m));
        } }] },
      { num: '13', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '13', level: 'LIM', make: function (r) {
          if (r.chance(0.3)) return KP.mc(r, 'For points ' + t('(x_1,\\ y_1)') + ' and ' + t('(x_2,\\ y_2)') + ', the slope formula is', [
            { html: t('m=\\dfrac{y_2-y_1}{x_2-x_1}'), right: true }, { html: t('m=\\dfrac{x_2-x_1}{y_2-y_1}'), why: 'That’s run over rise. The change in ' + t('y') + ' (the rise) goes on top.' },
            { html: t('m=\\dfrac{y_2+y_1}{x_2+x_1}'), why: 'Slope uses <b>changes</b> — subtract the coordinates, don’t add them.' }, { html: t('m=\\dfrac{y_1-y_2}{x_2-x_1}'), why: 'The top and bottom are subtracted in different orders, so the sign comes out wrong. Use the same order on both.' }],
            t('m=\\frac{\\text{rise}}{\\text{run}}=\\frac{y_2-y_1}{x_2-x_1}') + ': the change in ' + t('y') + ' over the change in ' + t('x') + ', subtracting in the same order.', ['Slope is rise over run. Which coordinate changes when you go up?'], 'slope formula MC');
          var A = [r.int(1, 6), r.int(1, 6)], Bp = [A[0] + r.int(2, 6), A[1] + r.int(1, 7)];
          if (Bp[1] - A[1] === Bp[0] - A[0]) Bp[1]++;
          return KP.mc(r, 'Which calculation gives the slope of the segment joining ' + t(ptT(A)) + ' and ' + t(ptT(Bp)) + '?', [
            { html: t('\\dfrac{' + Bp[1] + '-' + A[1] + '}{' + Bp[0] + '-' + A[0] + '}'), right: true },
            { html: t('\\dfrac{' + Bp[0] + '-' + A[0] + '}{' + Bp[1] + '-' + A[1] + '}'), why: 'That’s run over rise. The change in ' + t('y') + ' (the rise) goes on top.' },
            { html: t('\\dfrac{' + Bp[1] + '+' + A[1] + '}{' + Bp[0] + '+' + A[0] + '}'), why: 'Slope uses <b>changes</b> — subtract the coordinates, don’t add them.' },
            { html: t('\\dfrac{' + A[1] + '-' + Bp[1] + '}{' + Bp[0] + '-' + A[0] + '}'), why: 'The top and bottom are subtracted in different orders, so the sign comes out wrong. Use the same order on both.' }],
            t('m=\\frac{y_2-y_1}{x_2-x_1}=' + formulaT(A, Bp)) + ': the change in ' + t('y') + ' over the change in ' + t('x') + ', subtracting in the same order.', ['Slope is rise over run: ' + t('\\frac{y_2-y_1}{x_2-x_1}') + '.'], 'slope formula MC numbers');
        } }] },
      { num: '14', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '14', level: 'BEG', make: function (r) {
          var A, Bp;
          if (r.chance(0.2)) { A = [3, 5]; Bp = [11, 9]; }
          else { for (var g = 0; g < 100; g++) { var f = r.pick([[1, 2], [1, 4], [3, 4], [3, 2], [5, 2], [2, 5], [5, 4], [1, 5], [2, 1]]), k = r.pick([2, 3, 4]); A = [r.int(1, 6), r.int(1, 7)]; Bp = [A[0] + f[1] * k, A[1] + f[0] * k]; if (Bp[0] <= 16 && Bp[1] <= 16) break; } }
          var rise = Bp[1] - A[1], run = Bp[0] - A[0], v = cl(rise / run);
          return nrPart('The slope of the segment joining ' + t(ptT(A)) + ' and ' + t(ptT(Bp)) + ' is ________. <span class="muted">(Numerical response: give a decimal.)</span>', v, function (x) { if (near(x, cl(run / rise))) return { code: 'calc-flip', hint: 'That’s run over rise. The change in ' + t('y') + ' goes on top.' }; return null; },
            t('m=' + formulaT(A, Bp) + '=' + fracSteps(rise, run) + '=' + v) + '.', [FHINT, 'Numerical response: change the fraction to a decimal (top ÷ bottom).'], 'NR slope positive');
        } }] },
      { num: '15', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '15', level: 'EMG', make: function (r) {
          var A, Bp;
          if (r.chance(0.2)) { A = [-6, -9]; Bp = [2, -1]; }
          else { for (var g = 0; g < 200; g++) { var f = r.pick([[1, 1], [2, 1], [1, 2], [3, 2], [3, 1], [1, 4], [3, 4], [5, 4]]), k = r.pick([2, 3, 4, 6]); A = [r.int(-9, -2), r.int(-9, -2)]; Bp = [A[0] + f[1] * k, A[1] + f[0] * k]; if (Math.abs(Bp[0]) <= 10 && Math.abs(Bp[1]) <= 10 && (Bp[0] > 0 || Bp[1] < 0)) break; } }
          var rise = Bp[1] - A[1], run = Bp[0] - A[0], v = cl(rise / run);
          return nrPart('The slope of the line through ' + t(ptT(A)) + ' and ' + t(ptT(Bp)) + ' is ________. <span class="muted">(Numerical response: give a decimal.)</span>', v, function (x) { if (near(x, cl(run / rise))) return { code: 'calc-flip', hint: 'That’s run over rise. The change in ' + t('y') + ' goes on top.' }; if (near(x, -v)) return { code: 'calc-sign', hint: 'Check the signs when you subtract the negatives: ' + t('a-(-b)=a+b') + '.' }; var w = (Bp[1] + A[1]) / (Bp[0] + A[0]); if (isFinite(w) && near(x, cl(w))) return { code: 'u6l6-sum', hint: 'Subtract the coordinates (a change), don’t add them.' }; return null; },
            t('m=' + formulaT(A, Bp) + '=' + fracSteps(rise, run) + '=' + v) + '.', [FHINT, NEGHINT], 'NR slope negatives');
        } }] }
    ],
    extra: EXTRA()
  });

  /* ======================= Extra practice ======================= */
  function negPair(r, sgn, firstRight, pool, box) {
    for (var g = 0; g < 400; g++) {
      var f = r.pick(pool), k = r.pick([2, 3, 4]), run = f[1] * k, rise = sgn * f[0] * k, A = [r.int(-box, box), r.int(-box, box)], Bp = [A[0] + run, A[1] + rise];
      if (Math.abs(Bp[0]) > box || Math.abs(Bp[1]) > box) continue;
      var negs = [A[0], A[1], Bp[0], Bp[1]].filter(function (v) { return v < 0; }).length; if (negs < 2) continue;
      if (A[0] === 0 || A[1] === 0 || Bp[0] === 0 || Bp[1] === 0) continue;
      return firstRight ? [Bp, A] : [A, Bp];
    }
    return null;
  }
  function stepsT(sl) { return sl[0] / sl[1] > 0 ? 'rises' : 'falls'; }
  function EXTRA() {
    return [
      { num: '1', section: 'Extra practice A — The slope formula with negative coordinates', stem: 'Determine the slope of the segment joining each pair of points. Every answer here is a <b>fraction in lowest terms</b> or a whole number — never a decimal.', parts: ['a', 'b', 'c', 'd', 'e', 'f'].map(function (L) {
        return { id: 'e1' + L, level: 'EMG', make: function (r) {
          var bk = { a: [[-7, 5], [2, -1]], b: [[-3, -8], [5, -2]], c: [[4, -6], [-8, 3]], d: [[-11, -2], [1, -8]], e: [[-6, -9], [4, -4]], f: [[5, -8], [-4, 4]] }[L];
          var spec = { a: [-1, false, [[2, 3], [1, 3], [3, 4], [2, 5]]], b: [1, false, [[3, 4], [2, 3], [3, 5], [1, 2]]], c: [-1, true, [[3, 4], [2, 3], [4, 5], [1, 2]]], d: [-1, false, [[1, 2], [1, 3], [1, 4], [2, 5]]], e: [1, false, [[1, 2], [1, 3], [2, 5], [1, 4]]], f: [-1, true, [[4, 3], [3, 2], [5, 3], [5, 4]]] }[L];
          var pr = r.chance(0.2) ? bk : (negPair(r, spec[0], spec[1], spec[2], 11) || bk), nm = { a: 'AB', b: 'CD', c: 'EF', d: 'GH', e: 'JK', f: 'LN' }[L];
          return coordSlopePart('(' + L + ') ' + t(nm.charAt(0) + ptT(pr[0])) + ', ' + t(nm.charAt(1) + ptT(pr[1])), pr[0], pr[1], { lowest: true, text: 'extra slope negatives ' + L });
        } };
      }) },
      { num: '2', stem: 'Determine each slope. Two of these six are special cases — for those, the slope is ' + t('0') + ' or <b>undefined</b> (use the <b>undefined</b> key).', parts: ['a', 'b', 'c', 'd', 'e', 'f'].map(function (L) {
        return { id: 'e2' + L, level: L === 'a' || L === 'b' ? 'BEG' : 'EMG', make: function (r) {
          var pr, nm = { a: 'PQ', b: 'RS', c: 'TU', d: 'VW', e: 'XY', f: 'ZB' }[L];
          if (L === 'a') { var y = r.chance(0.2) ? 7 : r.pick([-8, -6, -5, -3, 3, 5, 6, 7, 8]); pr = r.chance(0.2) ? [[-5, 7], [3, 7]] : [[r.int(-9, -2), y], [r.int(1, 9), y]]; }
          else if (L === 'b') { var x = r.pick([-6, -4, -3, -2, 2, 3, 5]); pr = r.chance(0.2) ? [[-2, -4], [-2, 6]] : [[x, r.int(-9, -2)], [x, r.int(1, 9)]]; }
          else { var bk = { c: [[-8, 5], [2, -10]], d: [[-9, 4], [6, -1]], e: [[6, -11], [-4, -3]], f: [[-10, 7], [4, -7]] }[L]; var spec = { c: [-1, false, [[3, 2], [4, 3], [5, 2], [5, 3]]], d: [-1, false, [[1, 3], [1, 4], [2, 5], [1, 5]]], e: [-1, true, [[4, 5], [3, 4], [2, 3], [3, 5]]], f: [-1, false, [[1, 1], [2, 1], [3, 1]]] }[L]; pr = r.chance(0.2) ? bk : (negPair(r, spec[0], spec[1], spec[2], 11) || bk); }
          return coordSlopePart('(' + L + ') ' + t(nm.charAt(0) + ptT(pr[0])) + ', ' + t(nm.charAt(1) + ptT(pr[1])), pr[0], pr[1], { lowest: true, text: 'extra special slopes ' + L, hints: L === 'a' || L === 'b' ? [FHINT, 'If the top is ' + t('0') + ', the slope is ' + t('0') + '. If the bottom is ' + t('0') + ', you can’t divide: the slope is <b>undefined</b>.'] : null });
        } };
      }) },
      { num: '3', stem: function (sh) { return '<b>Zero versus undefined.</b> Segment ' + t('\\overline{JK}') + ' joins ' + t('J' + ptT(sh.J)) + ' and ' + t('K' + ptT(sh.K)) + '. Segment ' + t('\\overline{LN}') + ' joins ' + t('L' + ptT(sh.L)) + ' and ' + t('N' + ptT(sh.N)) + '.'; },
        shared: function (r) { if (r.chance(0.2)) return { J: [-6, -3], K: [7, -3], L: [4, -7], N: [4, 5] }; var y = r.pick([-5, -4, -3, -2, 2, 3, 4]), x = r.pick([-5, -3, -2, 2, 3, 4, 6]); return { J: [r.int(-8, -3), y], K: [r.int(2, 9), y], L: [x, r.int(-9, -3)], N: [x, r.int(2, 8)] }; },
        parts: [
          { id: 'e3a', level: 'BEG', make: function (r, sh) { return rrPart('JK', sh.J, sh.K, { coords: true, prompt: '(a) Compute the rise and the run for ' + t('\\overline{JK}') + ', then its slope.', text: 'zero slope rr' }); } },
          { id: 'e3b', level: 'BEG', make: function (r, sh) { return rrPart('LN', sh.L, sh.N, { coords: true, prompt: '(b) Compute the rise and the run for ' + t('\\overline{LN}') + ', then its slope (use the <b>undefined</b> key if there is no number).', text: 'undefined slope rr' }); } },
          { id: 'e3c', level: 'EMG', make: function (r, sh) {
            var run = sh.K[0] - sh.J[0], rise = sh.N[1] - sh.L[1];
            return KP.mc(r, '(c) One of these slopes is ' + t('0') + ' and the other is <b>undefined</b>. Which explanation is right?', [
              { html: t('\\overline{JK}') + ' has a <b>rise</b> of ' + t('0') + ': ' + t('\\frac{0}{' + run + '}=0') + ', a level segment. ' + t('\\overline{LN}') + ' has a <b>run</b> of ' + t('0') + ': ' + t('\\frac{' + rise + '}{0}') + ' asks you to divide by zero, which has no answer — so its slope is undefined.', right: true },
              { html: t('\\overline{JK}') + ' has a run of ' + t('0') + ', so its slope is ' + t('0') + '; ' + t('\\overline{LN}') + ' has a rise of ' + t('0') + ', so it is undefined.', why: 'Swapped. ' + t('\\overline{JK}') + ' keeps the same ' + t('y') + ' (no rise); ' + t('\\overline{LN}') + ' keeps the same ' + t('x') + ' (no run).' },
              { html: 'Both are really ' + t('0') + ': any fraction with a ' + t('0') + ' in it equals ' + t('0') + '.', why: t('\\frac{0}{' + run + '}=0') + ' because ' + t('0\\times ' + run + '=0') + '. But ' + t('\\frac{' + rise + '}{0}') + ' would need a number that gives ' + t(rise) + ' when multiplied by ' + t('0') + ' — there isn’t one.' },
              { html: t('\\overline{LN}') + ' is undefined because it is too steep to measure.', why: 'It isn’t about being “too steep”: the run is ' + t('0') + ', and division by ' + t('0') + ' gives no number at all.' }],
              t('JK') + ': rise ' + t('0') + ', run ' + t(run) + ', ' + t('m=\\frac{0}{' + run + '}=0') + ' — level, climbing nothing over a real horizontal distance. ' + t('LN') + ': rise ' + t(rise) + ', run ' + t('0') + ', ' + t('\\frac{' + rise + '}{0}') + ' — there is no horizontal distance at all, and dividing by ' + t('0') + ' has no value, so a vertical segment has <b>no slope number</b>.', ['Which one has a zero on the top of the fraction, and which on the bottom?'], 'zero vs undefined explain');
          } }] },
      { num: '4', section: 'Extra practice B — Reading slope from a graph', stem: function (sh) { return 'For each segment, count the rise and the run from the labelled point on the left to the labelled point on the right, then state the slope in lowest terms. One of the two slopes is negative.' + '<div class="fig-row" style="display:flex;flex-wrap:wrap;gap:10px">' + segGraph([{ A: sh.A, B: sh.B, a: 'A', b: 'B' }], { x: [-7, 7], y: [-7, 7], max: 250 }) + segGraph([{ A: sh.C, B: sh.D, a: 'C', b: 'D' }], { x: [-7, 7], y: [-7, 7], max: 250 }) + '</div>'; },
        shared: function (r) {
          if (r.chance(0.2)) return { A: [-3, 5], B: [3, -5], C: [-6, -2], D: [3, 4] };
          var s1 = placeSegs(r, [{ rise: -r.pick([10, 8, 6, 9, 4]), run: r.pick([6, 4, 3]) }], 6) || [[[-3, 5], [3, -5]]], s2 = placeSegs(r, [{ rise: r.pick([6, 4, 3, 2]), run: r.pick([9, 6, 8, 10]) }], 6) || [[[-6, -2], [3, 4]]];
          if (near((s1[0][1][1] - s1[0][0][1]) / (s1[0][1][0] - s1[0][0][0]), -1)) s1 = [[[-3, 5], [3, -5]]];
          return { A: s1[0][0], B: s1[0][1], C: s2[0][0], D: s2[0][1] };
        },
        parts: [
          { id: 'e4a', level: 'BEG', make: function (r, sh) { return rrPart('AB', sh.A, sh.B, { lowest: true, prompt: '(a) ' + t('\\overline{AB}') + ': rise, run and slope.', text: 'graph AB negative' }); } },
          { id: 'e4b', level: 'BEG', make: function (r, sh) { return rrPart('CD', sh.C, sh.D, { lowest: true, prompt: '(b) ' + t('\\overline{CD}') + ': rise, run and slope.', text: 'graph CD positive' }); } }] },
      { num: '5', stem: function (sh) { return 'The two segments below are the same two special types you met in question 3.' + '<div class="fig-row" style="display:flex;flex-wrap:wrap;gap:10px">' + segGraph([{ A: sh.E, B: sh.F, a: 'E', b: 'F' }], { x: [-7, 7], y: [-7, 7], max: 250 }) + segGraph([{ A: sh.G, B: sh.H, a: 'G', b: 'H' }], { x: [-7, 7], y: [-7, 7], max: 250 }) + '</div>'; },
        shared: function (r) { if (r.chance(0.2)) return { E: [-5, 3], F: [4, 3], G: [-2, -5], H: [-2, 4] }; var y = r.pick([-4, -3, -2, 2, 3, 4, 5]), x = r.pick([-4, -3, -2, 2, 3, 4]); return { E: [r.int(-6, -2), y], F: [r.int(2, 6), y], G: [x, r.int(-6, -2)], H: [x, r.int(2, 6)] }; },
        parts: [
          { id: 'e5a', level: 'BEG', make: function (r, sh) { return rrPart('EF', sh.E, sh.F, { prompt: '(a) ' + t('E' + ptT(sh.E)) + ' to ' + t('F' + ptT(sh.F)) + ': rise, run and slope.', text: 'graph horizontal' }); } },
          { id: 'e5b', level: 'BEG', make: function (r, sh) { return rrPart('GH', sh.G, sh.H, { prompt: '(b) ' + t('G' + ptT(sh.G)) + ' to ' + t('H' + ptT(sh.H)) + ': rise, run and slope (use the <b>undefined</b> key if there is no number).', text: 'graph vertical' }); } },
          { id: 'e5c', level: 'LIM', make: function (r, sh) {
            return KP.mc(r, '(c) Which segment has <b>no slope value</b> at all?', [
              { html: t('\\overline{GH}') + ' (vertical: its run is ' + t('0') + ')', right: true },
              { html: t('\\overline{EF}') + ' (horizontal: its rise is ' + t('0') + ')', why: 'A horizontal segment has slope ' + t('0') + ' — and ' + t('0') + ' is a number. It is the vertical one that can’t be divided.' },
              { html: 'Both of them', why: t('\\overline{EF}') + ' has a perfectly good slope: ' + t('\\frac{0}{' + (sh.F[0] - sh.E[0]) + '}=0') + '.' },
              { html: 'Neither of them', why: 'Try ' + t('\\overline{GH}') + ': ' + t('\\frac{' + (sh.H[1] - sh.G[1]) + '}{0}') + ' — you can’t divide by ' + t('0') + '.' }],
              t('EF') + ': ' + t('\\frac{0}{' + (sh.F[0] - sh.E[0]) + '}=0') + ' (a number). ' + t('GH') + ': ' + t('\\frac{' + (sh.H[1] - sh.G[1]) + '}{0}') + ' — undefined: the vertical segment has no slope value.', ['Which one would make you divide by ' + t('0') + '?'], 'which has no slope');
          } }] },
      { num: '6', stem: function (sh) { return '<b>Which is steepest?</b> Five segments are described by their endpoints: ' + sh.segs.map(function (s) { return t('\\overline{' + s.n + '}') + ': ' + t(s.n.charAt(0) + ptT(s.A)) + ', ' + t(s.n.charAt(1) + ptT(s.B)); }).join('; ') + '.'; },
        shared: function (r) {
          var names = ['AB', 'CD', 'EF', 'GH', 'JK'];
          if (r.chance(0.2)) return { segs: [[[-4, -1], [4, 5]], [[-2, 6], [2, -4]], [[-5, -6], [-1, 2]], [[-6, 3], [6, -1]], [[0, -5], [4, 2]]].map(function (s, i) { return { n: names[i], A: s[0], B: s[1], s: slopeOf(s[0], s[1]) }; }) };
          var pool = [[1, 3], [1, 2], [2, 3], [3, 4], [1, 1], [5, 4], [3, 2], [7, 4], [2, 1], [5, 2], [3, 1]], ch = r.sample(pool, 5), negs = r.sample([0, 1, 2, 3, 4], 2);
          return { segs: ch.map(function (f, i) {
            var sg = negs.indexOf(i) >= 0 ? -1 : 1, A, Bp;
            for (var g = 0; g < 200; g++) { var k = r.pick([1, 2, 2, 3]), run = f[1] * k, rise = sg * f[0] * k; if (Math.abs(rise) > 12 || run > 12) continue; A = [r.int(-7, 7 - run), r.int(Math.max(-7, -7 - rise), Math.min(7, 7 - rise))]; Bp = [A[0] + run, A[1] + rise]; break; }
            if (!A) { A = [0, 0]; Bp = [f[1], sg * f[0]]; }
            return { n: names[i], A: A, B: Bp, s: red(sg * f[0], f[1]) };
          }) };
        },
        parts: [
          { id: 'e6a', level: 'EMG', make: function (r, sh) {
            return KP.fields('(a) Determine the five slopes in lowest terms.', sh.segs.map(function (s) { return { label: t('m_{' + s.n + '}'), name: s.n, mode: 'math', keys: 'slope', placeholder: 'e.g. 3/4' }; }), sh.segs.map(function (s) { return slChk(s.s, { lowest: true }); }), sh.segs.map(function (s) { return slT(s.s); }),
              sh.segs.map(function (s) { return t('m_{' + s.n + '}=' + slT(s.s)); }).join(', '), sh.segs.map(function (s) { return t('m_{' + s.n + '}=' + formulaT(s.A, s.B) + '=' + fracSteps(s.B[1] - s.A[1], s.B[0] - s.A[0])); }).join('<br>'), [FHINT, NEGHINT], 'five slopes');
          } },
          { id: 'e6b', level: 'PRG', make: function (r, sh) {
            var sorted = sh.segs.slice().sort(function (a, b) { return Math.abs(sval(b.s)) - Math.abs(sval(a.s)); });
            return KP.order(r, '(b) Order the segments from <b>steepest</b> to <b>least steep</b>. <i>Careful:</i> steepness depends on how far a slope is from zero, not on whether it is positive or negative.', sorted.map(function (s) { return { id: s.n, tex: '\\overline{' + s.n + '}' }; }), { first: 'steepest', last: 'least steep', why: function (a, b) { var A = sh.segs.filter(function (s) { return s.n === a; })[0], Bq = sh.segs.filter(function (s) { return s.n === b; })[0]; return t(a) + ' and ' + t(b) + ' are in the wrong order: compare the sizes ' + t('\\left|' + slT(A.s) + '\\right|') + ' and ' + t('\\left|' + slT(Bq.s) + '\\right|') + ' — ignore the signs.'; } },
              'By distance from zero: ' + sorted.map(function (s) { return t('\\left|' + slT(s.s) + '\\right|=' + dec(Math.abs(sval(s.s)), 2)); }).join(', ') + '. Steepest to least steep: ' + t(sorted.map(function (s) { return '\\overline{' + s.n + '}'; }).join(',\\ ')) + '.', ['Ignore the minus signs and compare the sizes of the slopes (change them to decimals if that helps).'], 'order steepness');
          } },
          { id: 'e6c', level: 'BEG', make: function (r, sh) {
            var rows = sh.segs.map(function (s) { return { id: s.n, html: t('\\overline{' + s.n + '}') }; }), want = {};
            sh.segs.forEach(function (s) { want[s.n] = sval(s.s) < 0 ? 'f' : 'r'; });
            return KP.grid('(c) Which segments fall from left to right? (Use your slopes from (a).)', rows, [{ id: 'r', html: 'Rises' }, { id: 'f', html: 'Falls' }], want, { rowHead: 'Segment', why: function (row) { var s = sh.segs.filter(function (x) { return x.n === row; })[0]; return { code: 'row', hint: t('m_{' + s.n + '}=' + slT(s.s)) + ' is ' + (sval(s.s) < 0 ? 'negative: the segment falls (' + t('y') + ' goes down as ' + t('x') + ' goes up).' : 'positive: the segment rises.') }; } },
              'The segments with <b>negative</b> slopes fall from left to right: ' + sh.segs.filter(function (s) { return sval(s.s) < 0; }).map(function (s) { return t('\\overline{' + s.n + '}'); }).join(' and ') + '. A negative slope means ' + t('y') + ' decreases as ' + t('x') + ' increases.', ['A negative slope: the rise and the run have opposite signs.'], 'which fall');
          } }] },
      { num: '7', section: 'Extra practice C — Slope as a rate of change', stem: function (sh) { return 'A ramp’s <b>grade</b> is its slope, usually reported as a percent. (a) A ramp rises ' + t(sh.a[0]) + ' m over a horizontal run of ' + t(sh.a[1]) + ' m. (b) A driveway rises ' + t(sh.b[0]) + ' m over a horizontal run of ' + t(sh.b[1]) + ' m.'; },
        shared: function (r) {
          var a = r.chance(0.2) ? [0.45, 5.4] : r.pick([[0.45, 5.4], [0.3, 4.5], [0.4, 4.8], [0.35, 4.2], [0.5, 7], [0.6, 7.2], [0.5, 6.5], [0.6, 5.4], [0.4, 3.6], [0.3, 2.7], [0.7, 8.4], [0.36, 5.4], [0.42, 5.6], [0.25, 3.5], [0.6, 8], [0.55, 6.6], [0.45, 6.3], [0.32, 4.8], [0.4, 5.6], [0.48, 6.4], [0.65, 7.8], [0.27, 4.5]]);
          var b = r.chance(0.2) ? [3, 25] : r.pick([[3, 25], [2, 25], [2, 20], [3, 20], [1, 20], [4, 25], [3, 50], [1, 8], [5, 50], [4, 50], [7, 50], [6, 25], [9, 50], [1, 25], [3, 40], [2, 16], [6, 50], [3, 30], [4, 40], [7, 100], [11, 100], [1, 16]]);
          if (near(a[0] / a[1], b[0] / b[1])) b = [3, 25];
          return { a: a, b: b, fa: red(Math.round(a[0] * 100), Math.round(a[1] * 100)), fb: red(b[0], b[1]) };
        },
        parts: [
          { id: 'e7a', sub: 'a · fraction', level: 'EMG', make: function (r, sh) {
            var A100 = [Math.round(sh.a[0] * 100), Math.round(sh.a[1] * 100)];
            return slopePart('(a) A ramp rises ' + t(sh.a[0]) + ' m over a horizontal run of ' + t(sh.a[1]) + ' m. Determine its grade as a fraction in lowest terms.', sh.fa, t('\\frac{' + sh.a[0] + '}{' + sh.a[1] + '}=\\frac{' + A100[0] + '}{' + A100[1] + '}=' + frT(sh.fa[0], sh.fa[1])) + ' (multiply the top and bottom by ' + t('100') + ' to clear the decimals, then reduce).', ['Multiply the top and the bottom by ' + t('100') + ' so both are whole numbers.', 'Then reduce.'], 'ramp grade fraction', { lowest: true, before: 'grade =' });
          } },
          { id: 'e7ap', sub: 'a · percent', level: 'EMG', make: function (r, sh) {
            var x = 100 * sh.a[0] / sh.a[1];
            return KP.approx('(a) Write the ramp’s grade as a percent, rounded to the nearest tenth.', x, 1, { after: '%', diag: function (v) { if (Math.abs(v - K.roundTo(sh.a[0] / sh.a[1], 1)) < 1e-9 || Math.abs(v - K.roundTo(sh.a[0] / sh.a[1], 3)) < 1e-9) return { code: 'pct-dec', hint: 'That’s the decimal. Multiply by ' + t('100') + ' to make it a percent.' }; if (Math.abs(v - K.roundTo(100 * sh.a[1] / sh.a[0], 1)) < 0.06) return { code: 'calc-flip', hint: 'Use rise ÷ run, not run ÷ rise.' }; return null; } },
              t(sh.a[0] + '\\div ' + sh.a[1] + '\\approx ' + dec(sh.a[0] / sh.a[1], 4)) + ', and ' + t('\\times 100') + ' gives ' + t('\\approx ' + K.roundTo(x, 1).toFixed(1) + '\\%') + '.', ['Divide the rise by the run, multiply by ' + t('100') + ', then round to one decimal place.'], 'ramp grade percent');
          } },
          { id: 'e7b', sub: 'b · fraction', level: 'BEG', make: function (r, sh) {
            return slopePart('(b) A driveway rises ' + t(sh.b[0]) + ' m over a horizontal run of ' + t(sh.b[1]) + ' m. Determine its grade as a fraction in lowest terms.', sh.fb, t('m=\\frac{' + sh.b[0] + '}{' + sh.b[1] + '}' + (gcd(sh.b[0], sh.b[1]) > 1 ? '=' + frT(sh.fb[0], sh.fb[1]) : '')) + '.', ['Grade ' + t('=\\frac{\\text{rise}}{\\text{run}}') + '.'], 'driveway grade', { lowest: true, before: 'grade =' });
          } },
          { id: 'e7bp', sub: 'b · percent', level: 'BEG', make: function (r, sh) {
            var pc = percentOf(sh.fb);
            return KP.number('(b) Write the driveway’s grade as an exact percent.', pc, function (v) { if (near(v, cl(sh.fb[0] / sh.fb[1]))) return { code: 'pct-dec', hint: 'That’s the decimal. Multiply by ' + t('100') + ' to make it a percent.' }; return null; },
              t(frT(sh.fb[0], sh.fb[1]) + '=' + dec(sh.fb[0] / sh.fb[1], 4) + '=' + pc + '\\%') + '.', ['Top ÷ bottom, then ' + t('\\times 100') + '.'], 'driveway percent', { after: '%' });
          } },
          { id: 'e7c', sub: 'b · steeper', level: 'BEG', make: function (r, sh) {
            var pa = K.roundTo(100 * sh.a[0] / sh.a[1], 1), pb = percentOf(sh.fb), aSteeper = sh.a[0] / sh.a[1] > sh.b[0] / sh.b[1];
            return KP.mc(r, '(b) Which is steeper, the ramp in (a) or the driveway in (b)?', [
              { html: aSteeper ? 'The ramp, because ' + t(pa.toFixed(1) + '\\%>' + pb + '\\%') + '.' : 'The driveway, because ' + t(pb + '\\%>' + pa.toFixed(1) + '\\%') + '.', right: true },
              { html: aSteeper ? 'The driveway, because it has a bigger rise (' + t(sh.b[0]) + ' m).' : 'The ramp, because its run is shorter.', why: 'Steepness is the <b>ratio</b> rise ÷ run (the grade), not the rise or the run alone. Compare ' + t(pa.toFixed(1) + '\\%') + ' with ' + t(pb + '\\%') + '.' },
              { html: 'They are equally steep.', why: 'Compare the two grades: ' + t(pa.toFixed(1) + '\\%') + ' and ' + t(pb + '\\%') + '.' },
              { html: aSteeper ? 'The driveway, because its run is longer.' : 'The ramp, because its numbers are smaller.', why: 'A longer run with the same rise is <b>less</b> steep. Compare the grades.' }],
              'Ramp ' + t('\\approx ' + pa.toFixed(1) + '\\%') + ', driveway ' + t(pb + '\\%') + '. The bigger grade is the steeper slope: the ' + (aSteeper ? 'ramp' : 'driveway') + '.', ['Compare the two percents.'], 'which grade steeper');
          } }] },
      { num: '8', stem: function (sh) { return 'A print shop charges by the poster. An order of ' + t(sh.n1) + ' posters costs $' + sh.c1 + ', and an order of ' + t(sh.n2) + ' posters costs $' + sh.c2 + '. Treat the points as ' + t('(\\text{posters},\\ \\text{cost})') + '.'; },
        shared: function (r) {
          if (r.chance(0.2)) return { n1: 4, c1: 47, n2: 10, c2: 110, rate: 10.5, n3: 16 };
          var rate = r.pick([10.5, 8.5, 9.5, 11.5, 7.5, 12.5, 6.5]), fee = r.pick([3, 4, 5, 6, 8]), n1 = r.pick([2, 4, 6]), n2 = n1 + r.pick([4, 6, 8]);
          return { n1: n1, c1: cl(rate * n1 + fee), n2: n2, c2: cl(rate * n2 + fee), rate: rate, n3: n2 + r.pick([4, 6, 8]) };
        },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r, sh) {
            var rise = cl(sh.c2 - sh.c1), run = sh.n2 - sh.n1, f = red(rise * 2, run * 2);
            return slopePart('(a) Determine the slope of the segment joining ' + t(ptT([sh.n1, sh.c1])) + ' and ' + t(ptT([sh.n2, sh.c2])) + ', as a fraction in lowest terms.', f, t('m=\\frac{' + sh.c2 + '-' + sh.c1 + '}{' + sh.n2 + '-' + sh.n1 + '}=\\frac{' + rise + '}{' + run + '}=' + frT(f[0], f[1]) + '\\ (=' + sh.rate + ')') + '.', [FHINT], 'poster slope', { lowest: true, good: [String(sh.rate)], diag: function (v) { if (near(v, sh.c2 / sh.n2) || near(v, sh.c1 / sh.n1)) return { code: 'u6l6-rate-total', hint: 'That’s one order’s cost ÷ its posters — it includes any set-up charge. The slope uses the <b>changes</b>: (change in cost) ÷ (change in posters).' }; return null; } });
          } },
          { id: 'e8b', level: 'BEG', make: function (r, sh) {
            return KP.mc(r, '(b) What are the units of the slope, and what does the number mean for this print shop?', [
              { html: 'Dollars per poster: each extra poster adds $' + sh.rate.toFixed(2) + ' to the bill.', right: true },
              { html: 'Posters per dollar: each dollar buys ' + sh.rate + ' posters.', why: 'The units are (vertical units) per (horizontal unit): cost is on the vertical axis, so it is dollars <b>per poster</b>.' },
              { html: 'Dollars: an order costs $' + sh.rate.toFixed(2) + '.', why: 'A slope is a <b>rate</b> — a change in cost for each change of one poster — not a total cost.' },
              { html: 'Dollars per poster: the shop charges $' + sh.rate.toFixed(2) + ' for the whole order.', why: 'The slope is the cost of <b>each additional</b> poster, not of the whole order.' }],
              'Slope ' + t('=\\frac{\\text{change in cost}}{\\text{change in posters}}') + ', so its units are <b>dollars per poster</b>: each additional poster adds $' + sh.rate.toFixed(2) + '.', ['The rise is in dollars; the run is in posters.'], 'poster rate meaning');
          } },
          { id: 'e8c', level: 'EMG', make: function (r, sh) {
            var more = cl(sh.rate * (sh.n3 - sh.n2));
            return KP.number('(c) Using the same rate, how much more would an order of ' + t(sh.n3) + ' posters cost than an order of ' + t(sh.n2) + '?', more, function (v) { if (near(v, cl(sh.rate * sh.n3))) return { code: 'u6l6-total', hint: 'That’s ' + t(sh.n3) + ' posters at the rate. The question asks how much <b>more</b> than ' + t(sh.n2) + ' posters: only the extra ' + t(sh.n3 - sh.n2) + ' posters count.' }; if (near(v, cl(sh.c2 + more))) return { code: 'u6l6-total', hint: 'That’s the total cost of ' + t(sh.n3) + ' posters. How much <b>more</b> is it than $' + sh.c2 + '?' }; return null; },
              t(sh.n3 + '-' + sh.n2 + '=' + (sh.n3 - sh.n2)) + ' extra posters at $' + sh.rate.toFixed(2) + ' each: ' + t((sh.n3 - sh.n2) + '\\times ' + sh.rate + '=' + more) + '. It costs $' + more.toFixed(2) + ' more.', ['How many <b>extra</b> posters? Multiply by the rate from (a).'], 'posters extra cost', { before: '$' });
          } }] },
      { num: '9', stem: function (sh) { return 'A cyclist’s distance from a marker is recorded at two times: at ' + t(sh.t1) + ' s she is ' + t(sh.d1) + ' m away, and at ' + t(sh.t2) + ' s she is ' + t(sh.d2) + ' m away. Treat the points as ' + t('(\\text{time in s},\\ \\text{distance in m})') + '.'; },
        shared: function (r) { if (r.chance(0.2)) return { t1: 3, d1: 14, t2: 11, d2: 50, v: [9, 2] }; var v = r.pick([[9, 2], [7, 2], [5, 1], [6, 1], [11, 2], [4, 1], [13, 2], [15, 4], [8, 1]]), t1 = r.int(2, 5), dt = r.pick([4, 6, 8]), d1 = r.int(6, 20); return { t1: t1, d1: d1, t2: t1 + dt, d2: cl(d1 + v[0] * dt / v[1]), v: v }; },
        parts: [
          { id: 'e9a', level: 'BEG', make: function (r, sh) {
            var rise = cl(sh.d2 - sh.d1), run = sh.t2 - sh.t1, f = red(rise * 4, run * 4);
            return slopePart('(a) Determine the slope of the segment joining ' + t(ptT([sh.t1, sh.d1])) + ' and ' + t(ptT([sh.t2, sh.d2])) + ' as a fraction in lowest terms.', f, t('m=\\frac{' + sh.d2 + '-' + sh.d1 + '}{' + sh.t2 + '-' + sh.t1 + '}=' + fracSteps(rise, run)) + (f[1] !== 1 ? ' ' + t('(=' + dec(f[0] / f[1], 3) + ')') : '') + '.', [FHINT], 'cyclist slope', { lowest: true, diag: function (v) { if (near(v, run / rise)) return { code: 'rate-flip', hint: 'That’s run over rise. Distance is the second coordinate: (change in distance) ÷ (change in time).' }; if (near(v, sh.d2 / sh.t2)) return { code: 'u6l6-rate-total', hint: 'Use the <b>changes</b>: (change in distance) ÷ (change in time), not one point’s distance ÷ time.' }; return null; } });
          } },
          { id: 'e9b', level: 'BEG', make: function (r, sh) {
            var vT = frT(sh.v[0], sh.v[1]), vd = dec(sh.v[0] / sh.v[1], 2);
            return KP.mc(r, '(b) What are the units of the slope, and what does it tell you about the cyclist?', [
              { html: 'Metres per second: every second she moves ' + vd + ' m farther from the marker. Distance ÷ time is exactly what <b>speed</b> means.', right: true },
              { html: 'Seconds per metre: each metre takes her ' + vd + ' s.', why: 'Units of a slope are (vertical units) per (horizontal unit): distance (m) is the second coordinate, so it’s metres <b>per second</b>.' },
              { html: 'Metres: she is ' + vd + ' m from the marker.', why: 'A slope is a rate — the change in distance for each second — not a distance.' },
              { html: 'Metres per second: she has ridden for ' + vd + ' s.', why: 'The slope is how fast the distance changes, not how long she rode.' }],
              t('m=' + vT + '=' + vd) + ' m/s: she gets ' + vd + ' m farther from the marker every second — her <b>speed</b>, because speed compares distance travelled with time taken.', ['The rise is in metres; the run is in seconds.'], 'cyclist meaning');
          } }] },
      { num: '10', stem: function (sh) { return 'A tank is draining. After ' + t(sh.t1) + ' minutes it holds ' + t(sh.v1) + ' L; after ' + t(sh.t2) + ' minutes it holds ' + t(sh.v2) + ' L.'; },
        shared: function (r) { if (r.chance(0.2)) return { t1: 5, v1: 340, t2: 20, v2: 115, rt: 15, t3: 25 }; for (var g = 0; g < 100; g++) { var rt = r.pick([10, 12, 15, 20, 8, 25, 6]), t1 = r.int(2, 6), dt = r.pick([10, 12, 15, 20]), v1 = r.int(20, 45) * 10, v2 = v1 - rt * dt, d3 = r.pick([3, 4, 5, 6]); if (v2 - rt * d3 > 0) return { t1: t1, v1: v1, t2: t1 + dt, v2: v2, rt: rt, t3: t1 + dt + d3 }; } return { t1: 5, v1: 340, t2: 20, v2: 115, rt: 15, t3: 25 }; },
        parts: [
          { id: 'e10a', level: 'EMG', make: function (r, sh) {
            return slopePart('(a) Determine the slope of the segment joining ' + t(ptT([sh.t1, sh.v1])) + ' and ' + t(ptT([sh.t2, sh.v2])) + '.', [-sh.rt, 1], t('m=\\frac{' + sh.v2 + '-' + sh.v1 + '}{' + sh.t2 + '-' + sh.t1 + '}=\\frac{' + (sh.v2 - sh.v1) + '}{' + (sh.t2 - sh.t1) + '}=' + (-sh.rt)) + '.', [FHINT, 'The water is going down — what sign should the slope have?'], 'tank slope', { diag: function (v) { if (near(v, -1 / sh.rt)) return { code: 'rate-flip', hint: 'That’s run over rise: (change in volume) ÷ (change in time).' }; return null; }, signHint: 'Check the sign: the volume goes <b>down</b> (' + sh.v1 + ' L to ' + sh.v2 + ' L) while the time goes up, so the slope is negative.' });
          } },
          { id: 'e10b', level: 'EMG', make: function (r, sh) {
            return KP.mc(r, '(b) What are the units of the slope, and what does the <b>negative sign</b> mean here?', [
              { html: 'Litres per minute; the tank <b>loses</b> ' + sh.rt + ' L every minute — the minus sign records that the volume is decreasing.', right: true },
              { html: 'Litres per minute; the tank <b>gains</b> ' + sh.rt + ' L every minute.', why: 'The volume goes from ' + sh.v1 + ' L down to ' + sh.v2 + ' L: a negative slope means it is <b>decreasing</b>.' },
              { html: 'Minutes per litre; each litre takes ' + sh.rt + ' minutes to drain.', why: 'The units are (vertical units) per (horizontal unit): litres per minute.' },
              { html: 'Litres; the tank has −' + sh.rt + ' L in it.', why: 'A tank can’t hold a negative amount. The slope is a rate of change, not an amount.' }],
              t('m=-' + sh.rt) + ' L/min: the tank loses ' + t(sh.rt) + ' L each minute. The negative sign means the volume decreases as time goes on.', ['Units: litres (rise) per minute (run). Is the water going up or down?'], 'tank meaning negative');
          } },
          { id: 'e10c', level: 'PRG', make: function (r, sh) {
            var v3 = sh.v2 - sh.rt * (sh.t3 - sh.t2);
            return KP.number('(c) If the tank keeps draining at this rate, how much water is left after ' + t(sh.t3) + ' minutes?', v3, function (v) { if (near(v, sh.v2 + sh.rt * (sh.t3 - sh.t2))) return { code: 'calc-sign', hint: 'The tank is <b>draining</b>: the water goes down by ' + t(sh.rt) + ' L each minute.' }; if (near(v, sh.rt * (sh.t3 - sh.t2))) return { code: 'u6l6-total', hint: 'That’s how much drains in those ' + t(sh.t3 - sh.t2) + ' minutes. How much is <b>left</b>?' }; if (near(v, sh.v1 - sh.rt * sh.t3) || near(v, sh.v2 - sh.rt * sh.t3)) return { code: 'rate-one', hint: 'Count only the minutes <b>after</b> the ' + sh.t2 + '-minute reading: ' + t(sh.t3 + '-' + sh.t2 + '=' + (sh.t3 - sh.t2)) + ' minutes.' }; return null; },
              t(sh.t3 - sh.t2) + ' more minutes past ' + t(sh.t2) + ' removes ' + t((sh.t3 - sh.t2) + '\\times ' + sh.rt + '=' + sh.rt * (sh.t3 - sh.t2)) + ' L, leaving ' + t(sh.v2 + '-' + sh.rt * (sh.t3 - sh.t2) + '=' + v3) + ' L.', ['How many minutes after the ' + sh.t2 + '-minute reading? How much drains in that time?'], 'tank later', { after: 'L' });
          } }] },
      { num: '11', section: 'Extra practice D — Working backwards, errors and reasoning', stem: 'In each part the slope is known but something else is missing. Set up the slope formula and solve.', parts: [
        { id: 'e11a', level: 'PRG', make: function (r) {
          var useB = r.chance(0.2), f = useB ? [3, 4] : r.pick([[3, 4], [2, 3], [1, 2], [3, 2], [2, 5], [5, 4]]), A = useB ? [2, 5] : [r.int(-3, 5), r.int(-3, 6)], run = useB ? 4 : f[1] * r.pick([1, 2]), y = A[1] + f[0] * run / f[1], x2 = A[0] + run;
          return KP.number('(a) The slope from ' + t(ptT(A)) + ' to ' + t('(' + x2 + ',\\ y)') + ' is ' + t(frT(f[0], f[1])) + '. Find ' + t('y') + '.', y, function (v) { if (near(v, A[1] - f[0] * run / f[1])) return { code: 'k-sign', hint: 'Check by substituting your ' + t('y') + ' back in: is the slope ' + t(frT(f[0], f[1])) + ' (positive)?' }; if (near(v, A[1] + f[1] * run / f[0])) return { code: 'k-flip', hint: 'Slope is the change in ' + t('y') + ' over the change in ' + t('x') + ': the run (' + t(run) + ') goes on the bottom.' }; if (near(v, f[0] * run / f[1])) return { code: 'end-nostart', hint: 'That’s the rise. Add it to the starting ' + t('y') + ', ' + t(A[1]) + '.' }; return null; },
            t('\\frac{y-' + (A[1] < 0 ? '(' + A[1] + ')' : A[1]) + '}{' + subT(x2, A[0]) + '}=' + frT(f[0], f[1])) + ': the run is ' + t(run) + ', so the rise is ' + t(frT(f[0], f[1]) + '\\times ' + run + '=' + cl(f[0] * run / f[1])) + ' and ' + t('y=' + A[1] + '+' + cl(f[0] * run / f[1]) + '=' + y) + '. Check: ' + t(formulaT(A, [x2, y]) + '=' + fracSteps(y - A[1], run)) + ' ✓', ['Work out the run first. Then rise = slope × run.', 'Add the rise to the first point’s ' + t('y') + '.'], 'find y from slope', { before: t('y=') });
        } },
        { id: 'e11b', level: 'PRG', make: function (r) {
          var useB = r.chance(0.2), f = useB ? [-1, 2] : r.pick([[-1, 2], [-3, 4], [-2, 3], [-1, 4], [-3, 2]]), x1 = useB ? -3 : r.int(-6, 0), run = useB ? 8 : f[1] * r.pick([2, 3]), Bp = useB ? [5, 7] : [x1 + run, r.int(-4, 7)], rise = f[0] * run / f[1], k = Bp[1] - rise;
          return KP.number('(b) The slope from ' + t('(' + x1 + ',\\ k)') + ' to ' + t(ptT(Bp)) + ' is ' + t(frT(f[0], f[1])) + '. Find ' + t('k') + '.', k, function (v) { if (near(v, Bp[1] + rise)) return { code: 'k-sign', hint: 'Check by substituting your ' + t('k') + ' back in: the slope must be <b>negative</b>, so the second point is lower than the first.' }; if (near(v, rise)) return { code: 'end-nostart', hint: 'That’s the rise. Use it with ' + t('y_2=' + Bp[1]) + ': ' + t(Bp[1] + '-k=\\text{rise}') + '.' }; return null; },
            t('\\frac{' + Bp[1] + '-k}{' + subT(Bp[0], x1) + '}=' + frT(f[0], f[1])) + ': the run is ' + t(run) + ', so the rise is ' + t(frT(f[0], f[1]) + '\\times ' + run + '=' + rise) + '. Then ' + t(Bp[1] + '-k=' + rise) + ', so ' + t('k=' + k) + '. Check: ' + t(formulaT([x1, k], Bp) + '=' + fracSteps(Bp[1] - k, run)) + ' ✓', ['Find the run, then the rise = slope × run (it is negative).', 'Rise ' + t('=' + Bp[1] + '-k') + '.'], 'find k from slope', { before: t('k=') });
        } },
        { id: 'e11c', level: 'ADV', make: function (r) {
          var useB = r.chance(0.2), f = useB ? [2, 3] : r.pick([[2, 3], [3, 4], [1, 2], [3, 2], [2, 5]]), A = useB ? [-4, 3] : [r.int(-5, 3), r.int(-2, 6)], rise = useB ? -4 : -f[0] * r.pick([1, 2]), run = rise * f[1] / f[0], x = A[0] + run, y2 = A[1] + rise;
          return KP.number('(c) The slope from ' + t(ptT(A)) + ' to ' + t('(x,\\ ' + y2 + ')') + ' is ' + t(frT(f[0], f[1])) + '. Find ' + t('x') + '.', x, function (v) { if (near(v, A[0] - run)) return { code: 'k-sign', hint: 'The rise is negative (' + t(rise) + ') and the slope is positive, so the run must be negative too: the point is to the <b>left</b>.' }; if (near(v, A[0] + rise * f[0] / f[1])) return { code: 'calc-mult', hint: 'Run = rise <b>÷</b> slope, not rise × slope.' }; if (near(v, run)) return { code: 'end-nostart', hint: 'That’s the run. Add it to the first point’s ' + t('x') + ', ' + t(A[0]) + '.' }; return null; },
            t('\\frac{' + subT(y2, A[1]) + '}{x-' + (A[0] < 0 ? '(' + A[0] + ')' : A[0]) + '}=' + frT(f[0], f[1])) + ': the rise is ' + t(rise) + ', so ' + t(f[0] + '(x-' + (A[0] < 0 ? '(' + A[0] + ')' : A[0]) + ')=' + f[1] + '(' + rise + ')') + ', the run is ' + t(run) + ', and ' + t('x=' + A[0] + (run < 0 ? '' : '+') + run + '=' + x) + '. Check: ' + t(formulaT(A, [x, y2]) + '=' + fracSteps(rise, run)) + ' ✓', ['Work out the rise first. Then run = rise ÷ slope.', 'Cross-multiply if you like: ' + t(f[0] + '\\times\\text{run}=' + f[1] + '\\times\\text{rise}') + '.'], 'find x from slope', { before: t('x=') });
        } },
        { id: 'e11d', level: 'ADV', make: function (r) {
          var useB = r.chance(0.2), f = useB ? [-5, 2] : r.pick([[-5, 2], [-3, 2], [-4, 3], [-2, 3], [-5, 3]]), A = useB ? [1, -6] : [r.int(-3, 4), r.int(-7, -2)], rise = useB ? 10 : -f[0] * r.pick([1, 2]), run = rise * f[1] / f[0], x = A[0] + run, y2 = A[1] + rise;
          return KP.number('(d) The slope from ' + t(ptT(A)) + ' to ' + t('(x,\\ ' + y2 + ')') + ' is ' + t(frT(f[0], f[1])) + '. Find ' + t('x') + '.', x, function (v) { if (near(v, A[0] - run)) return { code: 'k-sign', hint: 'A negative slope with a positive rise (' + t(rise) + ') needs a <b>negative</b> run: the point is to the left.' }; if (near(v, A[0] + rise * f[0] / f[1])) return { code: 'calc-mult', hint: 'Run = rise <b>÷</b> slope, not rise × slope.' }; if (near(v, run)) return { code: 'end-nostart', hint: 'That’s the run. Add it to the first point’s ' + t('x') + ', ' + t(A[0]) + '.' }; return null; },
            t('\\frac{' + subT(y2, A[1]) + '}{x-' + (A[0] < 0 ? '(' + A[0] + ')' : A[0]) + '}=' + frT(f[0], f[1])) + ': the rise is ' + t(rise) + ', so the run is ' + t('\\frac{' + rise + '}{' + frT(f[0], f[1]) + '}=' + run) + ' and ' + t('x=' + A[0] + (run < 0 ? '' : '+') + run + '=' + x) + '. Check: ' + t(formulaT(A, [x, y2]) + '=' + fracSteps(rise, run)) + ' ✓', ['Work out the rise first. Then run = rise ÷ slope.', 'Dividing by a negative fraction: multiply by its reciprocal, and watch the sign.'], 'find x negative slope', { before: t('x=') });
        } },
        { id: 'e11e', level: 'EMG', make: function (r) {
          var useB = r.chance(0.2), P = useB ? [1, 2] : [r.int(-3, 3), r.int(-3, 4)], m = useB ? -2 : r.pick([-2, -3, -1, 2, 3]), sl = [m, 1], key = stepPts(P, sl, [1, 2]);
          var p = ptsPart('(e) A line passes through ' + t(ptT(P)) + ' with slope ' + t(m) + '. Find two other points on it.', { n: 2, exclude: [P], test: onLineTest(P, sl) }, key,
            'Slope ' + t(m + '=\\frac{' + m + '}{1}') + ': from ' + t(ptT(P)) + ' go ' + (m < 0 ? 'down ' + t(-m) : 'up ' + t(m)) + ' for every ' + t('1') + ' right: ' + t(ptsT(key)) + '. Going left instead gives ' + t(ptT([P[0] - 1, P[1] - m])) + '. (Any two correct points.)', ['Write the slope as ' + t('\\frac{\\text{rise}}{\\text{run}}=\\frac{' + m + '}{1}') + ' and step from the point.'], 'two points slope ' + m);
          p.good = [ptsT(stepPts(P, sl, [-1, 3]))]; p.bad = [ptsT(stepPts(P, [-m, 1], [1, 2]))].concat(Math.abs(m) === 1 ? [] : [ptsT([[P[0] + m, P[1] + 1], [P[0] + 2 * m, P[1] + 2]])]); return p;
        } },
        { id: 'e11f', level: 'BEG', make: function (r) {
          var P = r.chance(0.2) ? [-4, -1] : [r.pick([-5, -4, -3, -2, 2, 3, 4]), r.int(-4, 4)], key = [[P[0], P[1] + 3], [P[0], P[1] - 2]];
          var p = ptsPart('(f) A line passes through ' + t(ptT(P)) + ' and has an <b>undefined</b> slope. Find two other points on it.', { n: 2, exclude: [P], test: onLineTest(P, [1, 0]) }, key,
            'An undefined slope means a vertical line (run ' + t('0') + '), so every point has ' + t('x=' + P[0]) + ': e.g. ' + t(ptsT(key)) + '.', ['Undefined slope: the run is ' + t('0') + '. Which coordinate must stay the same?'], 'two points undefined');
          p.good = [ptsT([[P[0], 0], [P[0], 7]].filter(function (q) { return !same(q, P); }).concat([[P[0], 9]]).slice(0, 2))]; p.bad = [ptsT([[P[0] + 1, P[1]], [P[0] + 2, P[1]]])]; return p;
        } }] },
      { num: '12', stem: function (sh) { return '<b>Error analysis.</b> Priya computes the slope of the segment joining ' + t(ptT(sh.A)) + ' and ' + t(ptT(sh.B)) + ' and writes ' + t('m=\\frac{' + subT(sh.B[0], sh.A[0]) + '}{' + subT(sh.B[1], sh.A[1]) + '}=' + fracSteps(sh.B[0] - sh.A[0], sh.B[1] - sh.A[1])) + '.'; },
        shared: function (r) { if (r.chance(0.2)) return { A: [-2, 1], B: [6, 7] }; for (var g = 0; g < 100; g++) { var f = r.pick([[3, 4], [2, 3], [3, 5], [1, 2], [2, 5]]), k = r.pick([1, 2]), A = [r.int(-6, -1), r.int(-4, 3)], Bp = [A[0] + f[1] * k * 2, A[1] + f[0] * k * 2]; if (Bp[0] <= 10 && Bp[1] <= 10) return { A: A, B: Bp }; } return { A: [-2, 1], B: [6, 7] }; },
        parts: [
          { id: 'e12a', level: 'EMG', make: function (r, sh) {
            return KP.mc(r, '(a) Name the mistake precisely.', [
              { html: 'She put the <b>run on top</b> and the rise on the bottom: she computed ' + t('\\frac{x_2-x_1}{y_2-y_1}') + ' instead of ' + t('\\frac{y_2-y_1}{x_2-x_1}') + '.', right: true },
              { html: 'She subtracted in a different order on the top and the bottom.', why: 'Both subtractions start from the second point — the order is consistent. Look at <b>which</b> coordinates are on top.' },
              { html: 'She made a sign error with the negative.', why: 'Her arithmetic with the negative is right. The problem is which change is on top.' },
              { html: 'She forgot to reduce the fraction.', why: 'She did reduce. The fraction is upside down.' }],
              'Her numerator ' + t(subT(sh.B[0], sh.A[0])) + ' is the change in ' + t('x') + ' — the run. Slope is ' + t('\\frac{\\text{rise}}{\\text{run}}=\\frac{y_2-y_1}{x_2-x_1}') + '.', ['Which coordinates did she subtract on the top?'], 'Priya mistake');
          } },
          { id: 'e12as', sub: 'a · slope', level: 'BEG', make: function (r, sh) { return coordSlopePart('(a) State the correct slope.', sh.A, sh.B, { text: 'Priya correct slope' }); } },
          { id: 'e12b', sub: 'b', level: 'PRG', make: function (r, sh) {
            var rise = sh.B[1] - sh.A[1], run = sh.B[0] - sh.A[0], c = slT(red(rise, run)), w = slT(red(run, rise));
            return KP.mc(r, '(b) Her answer ' + t(w) + ' is steeper than the correct ' + t(c) + '. Why does flipping rise and run always exaggerate a slope that should be less than ' + t('1') + '?', [
              { html: 'A slope less than ' + t('1') + ' has a top smaller than its bottom. Flipping it puts the bigger number on top, so the result is greater than ' + t('1') + ' — steeper than the segment really is.', right: true },
              { html: 'Flipping a fraction always makes it bigger.', why: 'Not always: flipping ' + t('\\frac{5}{2}') + ' gives ' + t('\\frac{2}{5}') + ', which is smaller. It only exaggerates slopes less than ' + t('1') + '.' },
              { html: 'Because the run is always bigger than the rise.', why: 'The run isn’t always bigger — but when the slope is less than ' + t('1') + ', it is. Think about what happens to the fraction when you flip it.' },
              { html: 'Because flipping changes the sign.', why: 'Flipping doesn’t change the sign: ' + t(c) + ' and ' + t(w) + ' are both positive.' }],
              t(c + '<1') + ' because its top (' + t(red(rise, run)[0]) + ') is smaller than its bottom (' + t(red(rise, run)[1]) + '). Upside down, the bigger number is on top: ' + t(w + '>1') + '. So the flipped slope looks steeper than the real one.', ['Compare the top and bottom of a fraction less than 1. What happens when you flip it?'], 'flip exaggerates');
          } }] },
      { num: '13', stem: function (sh) { return '<b>Error analysis.</b> Marcus computes the slope of the segment joining ' + t(ptT(sh.A)) + ' and ' + t(ptT(sh.B)) + ' and writes ' + t('m=\\frac{' + subT(sh.B[1], sh.A[1]) + '}{' + subT(sh.A[0], sh.B[0]) + '}=\\frac{' + (sh.B[1] - sh.A[1]) + '}{' + (sh.A[0] - sh.B[0]) + '}=' + slT(red(sh.B[1] - sh.A[1], sh.A[0] - sh.B[0]))) + '.'; },
        shared: function (r) { if (r.chance(0.2)) return { A: [-5, 2], B: [3, -4] }; for (var g = 0; g < 100; g++) { var f = r.pick([[3, 4], [2, 3], [1, 2], [3, 5], [4, 3]]), k = r.pick([2, 3]), A = [r.int(-7, -2), r.int(1, 5)], Bp = [A[0] + f[1] * k, A[1] - f[0] * k]; if (Bp[0] > 0 && Bp[0] <= 9 && Bp[1] >= -9) return { A: A, B: Bp }; } return { A: [-5, 2], B: [3, -4] }; },
        parts: [
          { id: 'e13a', level: 'EMG', make: function (r, sh) {
            return KP.mc(r, '(a) His arithmetic is correct, but his answer is wrong. Which rule did he break?', [
              { html: 'He subtracted in <b>opposite orders</b>: the top starts from the second point (' + t(subT(sh.B[1], sh.A[1])) + ') but the bottom starts from the first (' + t(subT(sh.A[0], sh.B[0])) + '). Both must start from the same point.', right: true },
              { html: 'He put the run on top.', why: 'His top uses the ' + t('y') + '-coordinates, so the rise is on top. Look at the <b>order</b> of each subtraction.' },
              { html: 'He should have added the coordinates.', why: 'Slope uses changes, so subtracting is right — but in the same order on top and bottom.' },
              { html: 'He forgot to reduce the fraction.', why: 'He did reduce. The sign is the problem.' }],
              'Top: ' + t(subT(sh.B[1], sh.A[1])) + ' (second point first). Bottom: ' + t(subT(sh.A[0], sh.B[0])) + ' (first point first). Mixing the orders flips the sign of only one part, so the sign of the slope comes out wrong.', ['In each subtraction, which point comes first?'], 'Marcus rule');
          } },
          { id: 'e13b', level: 'BEG', make: function (r, sh) { return coordSlopePart('(b) State the correct slope.', sh.A, sh.B, { text: 'Marcus correct', lowest: true }); } },
          { id: 'e13c', sub: 'b · direction', level: 'LIM', make: function (r, sh) {
            return KP.mc(r, '(b) What does the sign of the correct slope tell you about the segment?', [
              { html: 'It is negative, so the segment <b>falls</b> as you move right.', right: true }, { html: 'It is positive, so the segment rises as you move right.', why: 'The correct slope is ' + t(slT(slopeOf(sh.A, sh.B))) + ' — negative.' },
              { html: 'It is negative, so the segment is vertical.', why: 'A vertical segment has an undefined slope. Negative means falling.' }, { html: 'It is negative, so the segment is below the ' + t('x') + '-axis.', why: 'The sign of the slope is about direction (up or down as you go right), not position.' }],
              t('m=' + slT(slopeOf(sh.A, sh.B))) + ' is negative: from ' + t(ptT(sh.A)) + ' (left) to ' + t(ptT(sh.B)) + ' (right) the segment goes down.', ['Positive slopes rise; negative slopes…?'], 'sign meaning');
          } }] },
      { num: '14', stem: function (sh) { return '<b>Reasoning.</b> Does it matter which point you call “first”? Use ' + t(ptT(sh.A)) + ' and ' + t(ptT(sh.B)) + '.'; },
        shared: function (r) { if (r.chance(0.2)) return { A: [-5, 2], B: [3, -4] }; for (var g = 0; g < 100; g++) { var A = [r.int(-7, -1), r.int(-3, 6)], Bp = [r.int(1, 7), r.int(-6, A[1] - 1)]; if (Bp[1] !== A[1] && Math.abs(Bp[1] - A[1]) !== Math.abs(Bp[0] - A[0])) return { A: A, B: Bp }; } return { A: [-5, 2], B: [3, -4] }; },
        parts: [0, 1].map(function (w) {
          return { id: 'e14' + 'ab'.charAt(w), level: 'BEG', make: function (r, sh) {
            var P1 = w ? sh.B : sh.A, P2 = w ? sh.A : sh.B, rise = P2[1] - P1[1], run = P2[0] - P1[0], sl = slopeOf(P1, P2);
            var chk = function (resp) {
              resp = resp || []; var a = HW.parse.number(String(resp[0] || '').replace(/^\+/, '')), b = HW.parse.number(String(resp[1] || '').replace(/^\+/, ''));
              if (!a.ok || !b.ok) return form('rr-blank', 'Fill in ' + t('y_2-y_1') + ' and ' + t('x_2-x_1') + ' as numbers.');
              if (near(a.value, -rise) && near(b.value, -run)) return wrong('u6l6-first', 'Those are the changes with the <b>other</b> point first. Here ' + t(ptT(P1)) + ' is ' + t('(x_1,\\ y_1)') + ': ' + t('y_2-y_1=' + subT(P2[1], P1[1])) + '.');
              if (near(a.value, run) && near(b.value, rise)) return wrong('rr-swap', 'Swapped: ' + t('y_2-y_1') + ' is the change in ' + t('y') + '.');
              if (!near(a.value, rise)) return wrong(near(a.value, -rise) ? 'calc-sign' : 'rr-rise', t('y_2-y_1=' + subT(P2[1], P1[1])) + ' — check the subtraction' + (near(a.value, -rise) ? ' and its sign.' : '.'));
              if (!near(b.value, run)) return wrong(near(b.value, -run) ? 'calc-sign' : 'rr-run', t('x_2-x_1=' + subT(P2[0], P1[0])) + ' — check the subtraction' + (near(b.value, -run) ? ' and its sign.' : '.'));
              var c = slChk(sl, { lowest: true })(resp[2] || ''); if (c.v !== 'correct') return { v: c.v, code: c.code, hint: '<b>Slope:</b> ' + (c.hint || 'divide: ' + t(rawFr(rise, run)) + ', then reduce.') };
              return ok();
            };
            return { prompt: '(' + 'ab'.charAt(w) + ') Treat ' + t(ptT(P1)) + ' as ' + t('(x_1,\\ y_1)') + '. Fill in the two changes and the slope.', input: { type: 'fields', fields: [{ label: t('y_2-y_1'), name: 'rise' }, { label: t('x_2-x_1'), name: 'run' }, { label: 'Slope', name: 'slope', mode: 'math', keys: 'slope', placeholder: 'e.g. -3/4' }] }, check: chk,
              key: [String(rise), String(run), slT(sl)], answer: t('y_2-y_1=' + rise + ',\\ x_2-x_1=' + run + ',\\ m=' + slT(sl)), solution: t('m=' + formulaT(P1, P2) + '=' + fracSteps(rise, run)) + '.', hints: ['With ' + t(ptT(P1)) + ' first: ' + t('y_2-y_1=' + subT(P2[1], P1[1])) + ' and ' + t('x_2-x_1=' + subT(P2[0], P1[0])) + '.'], text: 'first point ' + w,
              bad: [[String(-rise), String(-run), slT(sl)], [String(run), String(rise), slT(sl)]] };
          } };
        }).concat([
          { id: 'e14c', level: 'EMG', make: function (r, sh) {
            var rise = sh.B[1] - sh.A[1], run = sh.B[0] - sh.A[0];
            return KP.mc(r, '(c) Compare the two results. Why can the choice of first point never change the slope?', [
              { html: 'Swapping the points changes the sign of <b>both</b> the rise and the run; ' + t('\\frac{-a}{-b}=\\frac{a}{b}') + ', so the slope is the same — as long as both subtractions are reversed together.', right: true },
              { html: 'It can change: the second way gives the opposite sign.', why: 'Look at your answers to (a) and (b): they are equal. Both the top and the bottom changed sign.' },
              { html: 'Only the rise changes sign, and the run stays the same.', why: 'The run changes sign too: ' + t(run) + ' becomes ' + t(-run) + '.' },
              { html: 'Because subtraction can be done in any order.', why: 'Subtraction order matters: ' + t('3-5\\ne 5-3') + '. It works because <b>both</b> parts flip sign.' }],
              t(rawFr(rise, run)) + ' and ' + t(rawFr(-rise, -run)) + ' are equal: a negative divided by a negative is a positive, so the two sign changes cancel. That only works if you reverse <b>both</b> subtractions.', ['Compare the rise and run you got in (a) and (b).'], 'order cancels');
          } }]) },
      { num: '15', stem: '<b>Stretch — collinear points.</b> Three points are <b>collinear</b> when they all lie on one straight line, which happens exactly when the slope between the first two equals the slope between the last two.',
        shared: function (r) { return { a: c15a(r), b: c15b(r) }; },
        parts: [
        { id: 'e15a', sub: 'a · slope', level: 'BEG', make: function (r, sh) { var g = sh.a; return coordSlopePart('(a) ' + t('A' + ptT(g.A)) + ', ' + t('B' + ptT(g.B)) + ' and ' + t('C(' + g.C[0] + ',\\ k)') + ' are collinear. Find the slope of ' + t('\\overline{AB}') + '.', g.A, g.B, { text: 'collinear AB slope' }); } },
        { id: 'e15ak', sub: 'a · k', level: 'ADV', make: function (r, sh) {
          var g = sh.a, m = slopeOf(g.A, g.B), run = g.C[0] - g.B[0], k = g.C[1];
          return KP.number('(a) ' + t('A' + ptT(g.A)) + ', ' + t('B' + ptT(g.B)) + ' and ' + t('C(' + g.C[0] + ',\\ k)') + ' are collinear. Use the slope of ' + t('\\overline{AB}') + ' to find ' + t('k') + '.', k, function (v) { if (near(v, g.B[1] - m[0] * run / m[1])) return { code: 'k-sign', hint: 'Check the sign: substitute ' + t('k') + ' back into the slope of ' + t('\\overline{BC}') + '.' }; if (near(v, m[0] * run / m[1])) return { code: 'end-nostart', hint: 'That’s the rise from ' + t('B') + ' to ' + t('C') + '. Add it to ' + t('B') + '’s ' + t('y') + '.' }; return null; },
            t('m_{AB}=' + formulaT(g.A, g.B) + '=' + fracSteps(g.B[1] - g.A[1], g.B[0] - g.A[0])) + '. Then ' + t('\\frac{k-' + (g.B[1] < 0 ? '(' + g.B[1] + ')' : g.B[1]) + '}{' + subT(g.C[0], g.B[0]) + '}=' + slT(m)) + ': the run is ' + t(run) + ', so the rise is ' + t(cl(m[0] * run / m[1])) + ' and ' + t('k=' + k) + '.', ['The slope from ' + t('B') + ' to ' + t('C') + ' must equal the slope of ' + t('\\overline{AB}') + '.', 'Rise = slope × run.'], 'collinear k', { before: t('k=') });
        } },
        { id: 'e15b', sub: 'b · slope', level: 'EMG', make: function (r, sh) { var g = sh.b; return coordSlopePart('(b) ' + t('P' + ptT(g.P)) + ', ' + t('Q(' + g.Q[0] + ',\\ y)') + ' and ' + t('R' + ptT(g.R)) + ' are collinear. Find the slope of ' + t('\\overline{PR}') + '.', g.P, g.R, { text: 'collinear PR slope', lowest: true }); } },
        { id: 'e15by', sub: 'b · y', level: 'MAS', make: function (r, sh) {
          var g = sh.b, m = slopeOf(g.P, g.R), run = g.Q[0] - g.P[0], y = g.Q[1];
          return KP.number('(b) ' + t('P' + ptT(g.P)) + ', ' + t('Q(' + g.Q[0] + ',\\ y)') + ' and ' + t('R' + ptT(g.R)) + ' are collinear. Find ' + t('y') + '.', y, function (v) { if (near(v, g.P[1] - m[0] * run / m[1])) return { code: 'k-sign', hint: 'Check the sign: from ' + t('P') + ' to ' + t('Q') + ' the segment must ' + (sval(m) < 0 ? 'fall' : 'rise') + ', like ' + t('\\overline{PR}') + '.' }; if (near(v, m[0] * run / m[1])) return { code: 'end-nostart', hint: 'That’s the rise from ' + t('P') + ' to ' + t('Q') + '. Add it to ' + t('P') + '’s ' + t('y') + '-coordinate.' }; if (near(v, (g.P[1] + g.R[1]) / 2)) return { code: 'u6l6-mid', hint: t('Q') + ' isn’t the midpoint. Use the slope of ' + t('\\overline{PR}') + ' and the run from ' + t('P') + ' to ' + t('Q') + '.' }; return null; },
            t('m_{PR}=' + formulaT(g.P, g.R) + '=' + fracSteps(g.R[1] - g.P[1], g.R[0] - g.P[0])) + '. From ' + t('P') + ' to ' + t('Q') + ' the run is ' + t(subT(g.Q[0], g.P[0]) + '=' + run) + ', so the rise is ' + t(slT(m) + '\\times ' + run + '=' + cl(m[0] * run / m[1])) + ' and ' + t('y=' + g.P[1] + (m[0] * run / m[1] < 0 ? '' : '+') + cl(m[0] * run / m[1]) + '=' + y) + '. Check: ' + t(formulaT(g.P, g.Q) + '=' + fracSteps(y - g.P[1], run)) + ' ✓', ['Find the slope of ' + t('\\overline{PR}') + ' first (both points are known).', 'Then the slope from ' + t('P') + ' to ' + t('Q') + ' must be the same: rise = slope × run.'], 'collinear middle y', { before: t('y=') });
        } }] },
      { num: '16', section: 'Multiple choice and numerical response', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e16', level: 'EMG', make: function (r) {
          var pr = r.chance(0.2) ? [[-6, 5], [2, -1]] : negPair(r, -1, false, [[3, 4], [2, 3], [3, 5], [2, 5], [4, 5]], 9) || [[-6, 5], [2, -1]], s = slopeOf(pr[0], pr[1]);
          return mcCols(KP.mc(r, 'The slope of the segment joining ' + t(ptT(pr[0])) + ' and ' + t(ptT(pr[1])) + ' is', [
            { html: t(frT(s[0], s[1])), right: true }, { html: t(frT(-s[1], -s[0])), why: 'That’s run over rise. The change in ' + t('y') + ' goes on top.' },
            { html: t(frT(-s[0], s[1])), why: 'Check the sign: from left to right the segment goes down, so the slope is negative.' }, { html: t(frT(s[1], -s[0])), why: 'That’s run over rise with the wrong sign.' }],
            t('m=' + formulaT(pr[0], pr[1]) + '=' + fracSteps(pr[1][1] - pr[0][1], pr[1][0] - pr[0][0])) + '.', [FHINT], 'MC negative slope'));
        } }] },
      { num: '17', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e17', level: 'PRG', make: function (r) {
          var useB = r.chance(0.2), P = useB ? [-3, -2] : [r.int(-5, 2), r.int(-4, 3)], f = useB ? [3, 5] : r.pick([[3, 5], [2, 3], [3, 4], [2, 5], [4, 5], [1, 3]]), p = f[0], q = f[1];
          var opts = [{ html: t(ptT([P[0] + q, P[1] - p])), right: true },
            { html: t(ptT([P[0] + q, P[1] + p])), why: 'From ' + t(ptT(P)) + ' that point is up and to the right: slope ' + t(frT(p, q)) + ' — positive.' },
            { html: t(ptT([P[0] - q, P[1] + q])), why: 'From ' + t(ptT(P)) + ': rise ' + t(q) + ', run ' + t(-q) + ', a slope of ' + t('-1') + '.' },
            { html: t(ptT([P[0], P[1] + q])), why: 'That point is straight above ' + t(ptT(P)) + ': the run is ' + t('0') + ' and the slope is undefined.' }];
          return mcCols(KP.mc(r, 'Which point, together with ' + t(ptT(P)) + ', forms a segment with a slope of ' + t(frT(-p, q)) + '?', opts,
            'A slope of ' + t(frT(-p, q)) + ' means down ' + t(p) + ' for every ' + t(q) + ' to the right: ' + t('(' + P[0] + '+' + q + ',\\ ' + P[1] + '-' + p + ')=' + ptT([P[0] + q, P[1] - p])) + '. Check: ' + t(formulaT(P, [P[0] + q, P[1] - p]) + '=' + rawFr(-p, q)) + ' ✓', ['Test each point with the slope formula, or step ' + t(p) + ' down and ' + t(q) + ' right.'], 'which point negative slope'));
        } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e18', level: 'PRG', make: function (r) {
          var pr = r.chance(0.2) ? [[-9, -4], [6, -14]] : negPair(r, -1, false, [[2, 3], [3, 4], [2, 5], [3, 5], [1, 4], [4, 5], [5, 6]], 14) || [[-9, -4], [6, -14]], s = slopeOf(pr[0], pr[1]), a = -s[0], b = s[1], rise = pr[1][1] - pr[0][1], run = pr[1][0] - pr[0][0];
          return nrPart('The slope of the segment joining ' + t(ptT(pr[0])) + ' and ' + t(ptT(pr[1])) + ' is ' + t('-\\frac{a}{b}') + ' in lowest terms. The value of ' + t('a+b') + ' is ________.', a + b, function (v) { if (near(v, -a + b) || near(v, a - b)) return { code: 'u6l6-ab-sign', hint: t('a') + ' and ' + t('b') + ' are positive: the minus sign is already written in front of the fraction.' }; if (near(v, Math.abs(rise) + Math.abs(run))) return { code: 'u6l6-ab-unreduced', hint: 'Reduce the fraction to lowest terms first, then add the top and the bottom.' }; return null; },
            t('m=' + formulaT(pr[0], pr[1]) + '=' + fracSteps(rise, run)) + ', so ' + t('a=' + a) + ', ' + t('b=' + b) + ' and ' + t('a+b=' + (a + b)) + '.', [FHINT, 'Reduce to lowest terms, then read off ' + t('a') + ' and ' + t('b') + ' (both positive).'], 'NR a+b');
        } }] },
      { num: '19', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e19', level: 'PRG', make: function (r) {
          var useB = r.chance(0.2), f, A, run, y;
          for (var g = 0; g < 100; g++) { f = useB ? [3, 4] : r.pick([[3, 4], [1, 2], [2, 3], [5, 4], [3, 2]]); A = useB ? [2, -3] : [r.int(-3, 4), r.int(-6, 4)]; run = useB ? 8 : f[1] * r.pick([2, 3]); y = A[1] + f[0] * run / f[1]; if (y >= 0 && y < 100) break; useB = true; }
          var x2 = A[0] + run;
          return nrPart('The slope from ' + t(ptT(A)) + ' to ' + t('(' + x2 + ',\\ y)') + ' is ' + t(frT(f[0], f[1])) + '. The value of ' + t('y') + ' is ________.', y, function (v) { if (near(v, f[0] * run / f[1])) return { code: 'end-nostart', hint: 'That’s the rise. Add it to the first point’s ' + t('y') + ', ' + t(A[1]) + '.' }; if (near(v, A[1] - f[0] * run / f[1])) return { code: 'k-sign', hint: 'The slope is positive, so ' + t('y') + ' must be greater than ' + t(A[1]) + '.' }; return null; },
            'Run ' + t('=' + subT(x2, A[0]) + '=' + run) + ', rise ' + t('=' + frT(f[0], f[1]) + '\\times ' + run + '=' + cl(f[0] * run / f[1])) + ', so ' + t('y=' + A[1] + '+' + cl(f[0] * run / f[1]) + '=' + y) + '.', ['Find the run, then the rise = slope × run.'], 'NR find y');
        } }] }
    ];
  }
  function c15a(r) {   // A, B and C(x, k) on one line, B between
    if (r.chance(0.2)) return { A: [-6, -7], B: [2, -1], C: [10, 5] };
    for (var g = 0; g < 200; g++) { var f = r.pick([[3, 4], [2, 3], [1, 2], [3, 2], [1, 3], [-1, 2], [-2, 3]]), k1 = r.pick([1, 2, 3]), k2 = r.pick([1, 2, 3]), A = [r.int(-8, -3), r.int(-8, 2)]; var Bp = [A[0] + f[1] * k1, A[1] + f[0] * k1], C = [Bp[0] + f[1] * k2, Bp[1] + f[0] * k2]; if (C[0] <= 12 && Math.abs(C[1]) <= 12 && Math.abs(Bp[1]) <= 12) return { A: A, B: Bp, C: C }; }
    return { A: [-6, -7], B: [2, -1], C: [10, 5] };
  }
  function c15b(r) {   // P, Q(x, y) between, R
    if (r.chance(0.2)) return { P: [-3, 4], Q: [1, 0], R: [9, -8] };
    for (var g = 0; g < 200; g++) { var f = r.pick([[-1, 1], [-1, 2], [-3, 4], [-2, 3], [1, 2], [2, 3], [3, 4]]), k1 = r.pick([1, 2]), k2 = r.pick([2, 3]), P = [r.int(-7, -2), r.int(-4, 6)]; var Q = [P[0] + f[1] * k1, P[1] + f[0] * k1], R = [Q[0] + f[1] * k2, Q[1] + f[0] * k2]; if (R[0] <= 12 && Math.abs(R[1]) <= 12 && !near(Q[1], (P[1] + R[1]) / 2)) return { P: P, Q: Q, R: R }; }
    return { P: [-3, 4], Q: [1, 0], R: [9, -8] };
  }
})(window);
