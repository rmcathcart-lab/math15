/* Math 15 · Unit 7 · Lesson 3 — Graphing a Line Using Slope–Intercept Form (RF6)
 * Assignment 3 (u7_L03.tex, Questions 1–14) and the Lesson 3 Extra Practice (u7_EP03.tex, Questions 1–18).
 * Every part is a generator: same structure, idea and difficulty as the booklet question (the booklet's numbers are among
 * the possible values), new numbers from the seed. Model: Math 10C u7l1.js (m and b boxes, graph pad with the classic
 * graphing diagnoses: slope sign, rise and run swapped, b on the x-axis, b sign, right b / wrong slope).
 * Outcomes: RF6 (graphing from y = mx + b, reading m and b, rise over run) by default; RF7 for writing the equation of a
 * line through a point that is not the intercept (Extra 12) and from two marked points (Extra 9(c)).
 * Conversions: "state m and b" -> two boxes; "(0, b)" -> a point box; "slope as a fraction rise/run" -> a fraction box
 * that must be a fraction (an integer slope over 1); "graph the line" -> the graph pad (any two points of the line,
 * arrows at both ends); "record the second point" -> a point box (any point of the line other than the intercept;
 * the step from the slope is the key); "explain" -> multiple choice whose options are reasons; on/off/above/below -> a
 * grid or multiple choice with the substitution.
 * Change from the booklet: Question 14 (perimeter of the intercept triangle "to the nearest tenth", 2 + 6 + √40) needs
 * a calculator; this unit is no-calculator, so the intercepts make a Pythagorean triple and the perimeter is whole.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 15(b ii) (the intersection of two lines, read from the
 * graph and confirmed algebraically with a fraction slope); Extra 15(a ii) and Extra 12 equations are Advancing. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, LN = HW.lines, DR = HW.draw;

  HW.addCodes({
    'mb-swap': 'Slope and y-intercept swapped', 'mb-order': 'Read m and b in left-to-right order', 'hidden-1': 'Missed the hidden coefficient 1 (or −1)', 'icpt-axis': 'Intercept written as a point on the wrong axis', 'icpt-none': 'Said there is no intercept',
    'gr-join': 'Graph: points not joined into a line', 'gr-sign': 'Graph: slope sign wrong', 'gr-flip': 'Graph: rise and run swapped', 'gr-b-xaxis': 'Graph: plotted b on the x-axis', 'gr-b-sign': 'Graph: y-intercept sign wrong',
    'gr-vh': 'Graph: horizontal/vertical mixed up', 'gr-slope': 'Graph: right y-intercept, wrong slope', 'gr-icpt': 'Graph: right slope, wrong y-intercept', 'move-sign': 'Sign error moving a term across', 'not-divided': 'Did not divide every term by the coefficient of y', 'part-div': 'Divided only some terms',
    'tri-half': 'Triangle area: forgot the ½', 'tri-hyp': 'Perimeter: left out the hypotenuse', 'tri-area': 'Gave the area for the perimeter',
    'u7l3-frac-form': 'Slope not written as a fraction rise/run', 'u7l3-same-frac': 'Gave the same fraction twice', 'u7l3-dir': 'Fraction steps the wrong way (left/right)', 'u7l3-pt-icpt': 'Gave the y-intercept as the second point',
    'u7l3-pt-flip': 'Second point: rise and run swapped', 'u7l3-pt-sign': 'Second point: moved up instead of down (or down instead of up)', 'u7l3-pt-off': 'Point not on the line',
    'u7l3-hv-slope': 'Horizontal/vertical: wrong slope', 'u7l3-hv-icpt': 'Horizontal/vertical: wrong intercept', 'u7l3-hv-none': 'Horizontal/vertical: “none” mixed up', 'u7l3-hv-form': 'Horizontal/vertical: can it be y = mx + b',
    'u7l3-ctx-graph': 'Context graph: wrong line', 'u7l3-two-lines': 'Graph: only one of the two lines', 'u7l3-meet-y': 'Intersection: wrong y-value', 'u7l3-side': 'Above/below the line mixed up', 'u7l3-pt-step': 'Point: counted the steps wrongly'
  });
  HW.addPartial({ 'u7l3-frac-form': 's', 'u7l3-same-frac': 's', 'u7l3-dir': 'b', 'u7l3-pt-icpt': 'n', 'u7l3-pt-flip': 'b', 'u7l3-pt-sign': 'b', 'u7l3-pt-off': 'n', 'u7l3-hv-slope': 'b', 'u7l3-hv-icpt': 'b', 'u7l3-hv-none': 'b', 'u7l3-hv-form': 'b',
    'u7l3-ctx-graph': 'n', 'u7l3-two-lines': 'b', 'u7l3-meet-y': 's', 'u7l3-side': 'b', 'u7l3-pt-step': 's' });

  /* ---------------- numbers and LaTeX ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a || 1; }
  function Q(p, q) { if (Array.isArray(p)) { q = p[1]; p = p[0]; } q = q == null ? 1 : q; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q); return [p / g, q / g]; }
  function qv(f) { return Array.isArray(f) ? f[0] / f[1] : f; }
  function qT(f) { if (!Array.isArray(f)) return nT(f); f = Q(f); return f[1] === 1 ? String(f[0]) : (f[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(f[0]) + '}{' + f[1] + '}'; }
  function qneg(a) { a = Q(a); return [-a[0], a[1]]; }
  function qmul(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[0], a[1] * b[1]); }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }
  function nT(x) { return String(Math.round(x * 1e6) / 1e6); }
  function ptT(p) { return '(' + qT(p[0]) + ',\\ ' + qT(p[1]) + ')'; }
  function term(c, v, first) {
    var neg, mag;
    if (Array.isArray(c)) { c = Q(c); if (c[0] === 0) return ''; neg = c[0] < 0; var ab = Math.abs(c[0]); mag = c[1] === 1 ? (ab === 1 && v ? '' : String(ab)) : '\\frac{' + ab + '}{' + c[1] + '}'; }
    else { if (c === 0) return ''; neg = c < 0; var a = Math.abs(c); mag = a === 1 && v ? '' : nT(a); }
    return (neg ? '-' : first ? '' : '+') + mag + v;
  }
  function lin(ts) { var o = ''; ts.forEach(function (x) { o += term(x[0], x[1], o === ''); }); return o || '0'; }
  function siT(m, b, X, Y) { return (Y || 'y') + '=' + lin([[m, X || 'x'], [b, '']]); }
  function axbyc(A, Bc, C) { return lin([[A, 'x'], [Bc, 'y']]) + '=' + C; }
  function rng(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nz(a, b) { return rng(a, b).filter(function (x) { return x !== 0; }); }
  function cop(a, b) { return gcd(a, b) === 1; }
  function distinct(opts) { var seen = {}; opts.forEach(function (o) { if (seen[o.html]) throw new Error('duplicate MC option ' + o.html); seen[o.html] = 1; }); return opts; }
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, distinct(opts), sol, hints, text, keepOrder); }
  function pickWhere(gen, okf) { for (var i = 0; i < 500; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('pickWhere: no value'); }
  function dl(list, ans) { var L2 = (list || []).filter(function (d) { return d && isFinite(qv(d[0])) && !near(qv(d[0]), ans); }); return function (v) { for (var i = 0; i < L2.length; i++) if (near(v, qv(L2[i][0]))) return { code: L2[i][1], hint: L2[i][2] }; return null; }; }
  function fracs(qs, maxP, proper) { var o = []; qs.forEach(function (q) { for (var p = 1; p <= maxP; p++) if (cop(p, q) && (!proper || p < q) && q > 1) o.push([p, q]); }); return o; }
  function riseRun(m) { m = Q(m); return { rise: m[0], run: m[1] }; }
  function stepT(m) { var s = riseRun(m); return 'right ' + t(s.run) + ', ' + (s.rise >= 0 ? 'up ' : 'down ') + t(Math.abs(s.rise)); }

  /* ---------------- slope / intercept boxes (from Math 10C u7l1) ---------------- */
  function cleanS(s) { return String(s == null ? '' : s).replace(/\\left|\\right/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\[,;:! ]|~/g, ' ').trim(); }
  function isNone(s) { return /^(\\text\{\s*none\s*\}|\\mathrm\{\s*none\s*\}|none|no\s*y-?intercept)$/i.test(String(s).trim()); }
  function asPoint(s) {
    var m = /^\((.+),(.+)\)$/.exec(cleanS(s).replace(/\s+/g, '')); if (!m) return null;
    var a = ex.parse(m[1]), b = ex.parse(m[2]); if (!a.ok || !b.ok) return null;
    var va = ex.value(a.ast), vb = ex.value(b.ast); if (!isFinite(va) || !isFinite(vb)) return null;
    return [va, vb, m[1], m[2]];
  }
  function dg(list, T) {
    var Tv = T == null ? null : qv(T);
    var L2 = (list || []).filter(function (d) { return d && d[0] != null && isFinite(qv(d[0])) && (Tv == null || !near(qv(d[0]), Tv)); });
    return function (v) { for (var i = 0; i < L2.length; i++) if (near(v, qv(L2[i][0]))) return { code: L2[i][1], hint: L2[i][2] }; return null; };
  }
  function slopeC(m, list) { return K.slope(Q(m), { diag: dg(list, m), signHint: 'Check the sign: once the equation reads ' + t('y=mx+b') + ', the slope is the number multiplying ' + t('x') + ' <b>with the sign in front of it</b>.' }); }
  function valC(T, list) {
    var base = K.value(T, { only: 'fraction', diag: dg(list, T) });
    return function (resp) {
      var s = cleanS(resp);
      if (!s) return form('empty', 'Type your answer first.');
      if (isNone(s)) return wrong('icpt-none', 'There is one: every line that isn’t vertical crosses the ' + t('y') + '-axis.');
      var p = asPoint(s);
      if (p) { if (!near(p[0], 0)) return wrong('icpt-axis', 'A point on the ' + t('y') + '-axis has ' + t('x=0') + ': the ' + t('y') + '-intercept is the point ' + t('(0,\\ b)') + '.'); s = p[3]; }
      return base(s);
    };
  }
  function slopeField(keys) { return { label: 'Slope', name: 'Slope', before: t('m='), mode: 'math', keys: keys || 'fraction', placeholder: 'e.g. -2 or 3/4' }; }
  function yField(keys) { return { label: t('y') + '-intercept', name: t('y') + '-intercept', before: t('b='), mode: 'math', keys: keys || 'fraction', placeholder: 'e.g. 5' }; }
  function mbPart(prompt, m, b, o, sol, hints, text) {
    o = o || {};
    var swapM = [b, 'mb-swap', 'That’s the ' + t('y') + '-intercept. The slope ' + t('m') + ' is the number multiplying ' + t('x') + '.'];
    var swapB = [m, 'mb-swap', 'That’s the slope. The ' + t('y') + '-intercept ' + t('b') + ' is the constant term.'];
    var p = B.fields(prompt, [slopeField(), yField()], [slopeC(m, (o.mDiag || []).concat([swapM])), valC(b, (o.bDiag || []).concat([swapB]))], [qT(m), qT(b)], t('m=' + qT(m)) + ', &nbsp;' + t('b=' + qT(b)), sol,
      ['Once the equation reads ' + t('y=mx+b') + ', ' + t('m') + ' is the number multiplying ' + t('x') + ' and ' + t('b') + ' is the constant term.', 'Keep the sign in front of each term.'], text);
    p.good = [[qT(m), '(0,\\ ' + qT(b) + ')']];
    p.bad = !near(qv(m), qv(b)) ? [[qT(b), qT(m)]] : [];
    return p;
  }
  function ptPart(prompt, P, opt, sol, hints, text) { var p = B.point(prompt, P, opt, sol, hints, text); p.input.keys = 'pairs'; return p; }

  /* ---------------- graphs (from Math 10C u7l1) ---------------- */
  var PADHELP = ' <span style="color:#6a7182;font-size:.92em">(<b>╱ Line</b>: tap two points, then tap the second again.)</span>';
  function padI(xr, yr) { return { x: xr || [-6, 6], y: yr || [-6, 6], grid: 1, labels: 2, defaultEnd: 'arrow', max: 360 }; }
  function gv(pts, pieces) { return { pts: pts || [], pieces: pieces || [], join: 'none' }; }
  function lineV(p, q) { return gv([], [{ v: [p, q], s: 'arrow', e: 'arrow' }]); }
  function lineMB(m, b) { m = Q(m); var bv = qv(b); return lineV([0, bv], [m[1], bv + m[0]]); }
  function lineThroughSlope(pt, m) { m = Q(m); return lineV(pt, [pt[0] + m[1], pt[1] + m[0]]); }
  function spanPts(m, b, xr, yr) {
    var out = [];
    for (var x = xr[0]; x <= xr[1]; x++) { var y = qv(m) * x + qv(b); if (Math.abs(y - Math.round(y)) < 1e-9 && y >= yr[0] - 1e-9 && y <= yr[1] + 1e-9) out.push([x, Math.round(y)]); }
    return [out[0], out[out.length - 1]];
  }
  function latticeCount(m, b, xr, yr) { var n = 0; for (var x = xr[0]; x <= xr[1]; x++) { var y = qv(m) * x + qv(b); if (Math.abs(y - Math.round(y)) < 1e-9 && y >= yr[0] && y <= yr[1]) n++; } return n; }
  function keyLine(m, b, xr, yr) { var s = spanPts(m, b, xr || [-6, 6], yr || [-6, 6]); return lineV(s[0], s[1]); }
  function lineCoef(v) { var g = DR.geom(v), ks = Object.keys(g.lines); if (ks.length !== 1 || g.pts.length) return null; return g.lines[ks[0]]; }
  function exactChk(target, W, o) {
    o = o || {};
    var base = K.graphExact(target, { wrong: W }), TL = lineCoef(target);
    function onT(p) { return Math.abs(TL.A * p[0] + TL.B * p[1] - TL.C) < 1e-6; }
    return function (resp) {
      if (!DR.empty(resp) && DR.same(resp, target)) return ok();
      var n = DR.norm(resp);
      if (!n.pieces.length && n.pts.length >= 2 && n.pts.every(onT)) return wrong('gr-join', 'Your points are on the line — now join them: choose <b>╱ Line</b> and tap two of them (the ends become arrows, because the line goes on forever).');
      if (!n.pieces.length && n.pts.length === 1 && onT(n.pts[0])) return wrong('gr-join', 'That point is on the line. Use the slope to find a second point, then join them with <b>╱ Line</b>.');
      var r = base(resp);
      if (r.v === 'wrong' && r.code === 'graph' && o.m != null) {
        var S = lineCoef(resp);
        if (S && S.B !== 0) {
          var ms = -S.A / S.B, bs = S.C / S.B;
          if (near(bs, o.b) && !near(ms, o.m)) return wrong('gr-slope', 'Your line crosses the ' + t('y') + '-axis in the right place — now check the slope: from ' + t(ptT([0, o.b])) + ' count the rise (up or down) and the run (right) from ' + t('m=' + qT(o.mq || o.m)) + '.');
          if (near(ms, o.m) && !near(bs, o.b)) return wrong('gr-icpt', 'Your line has the right slope — but it must cross the ' + t('y') + '-axis at ' + t(ptT([0, o.b])) + '.');
        }
      }
      return r;
    };
  }
  function segOf(v) { var n = DR.norm(v); return gv([], n.pieces.map(function (pc) { return { v: pc.v, s: 'closed', e: 'closed' }; })); }
  function slopeWrongs(m, b) {
    m = Q(m); var W = [], up = m[0] > 0;
    if (m[0] !== 0) W.push({ is: lineMB([-m[0], m[1]], b), code: 'gr-sign', hint: 'Check the direction: a ' + (up ? 'positive' : 'negative') + ' slope means the line ' + (up ? 'rises' : 'falls') + ' from left to right.' });
    if (m[0] !== 0 && Math.abs(m[0]) !== m[1]) W.push({ is: lineMB(Q(m[0] > 0 ? m[1] : -m[1], Math.abs(m[0])), b), code: 'gr-flip', hint: 'Rise and run are swapped. In ' + t('m=' + qT(m)) + ' the top number is the <b>rise</b> (up or down) and the bottom number is the <b>run</b> (to the right).' });
    if (b !== 0) W.push({ is: lineThroughSlope([b, 0], m), code: 'gr-b-xaxis', hint: 'The ' + t('y') + '-intercept is on the <b>' + t('y') + '-axis</b>: start at ' + t(ptT([0, b])) + ', not at ' + t(ptT([b, 0])) + '.' });
    if (b !== 0) W.push({ is: lineMB(m, -b), code: 'gr-b-sign', hint: 'Check the sign of the ' + t('y') + '-intercept: the line crosses the ' + t('y') + '-axis at ' + t(ptT([0, b])) + '.' });
    return W;
  }
  /* graph y = mx + b from the slope and intercept */
  function graphMB(prompt, m, b, sol, hints, text, pad) {
    pad = pad || { x: [-6, 6], y: [-6, 6] };
    var key = keyLine(m, b, pad.x, pad.y), mq = Q(m), W = slopeWrongs(m, b);
    var p = B.graph(prompt + PADHELP, padI(pad.x, pad.y), exactChk(key, W, { m: qv(m), b: b, mq: m }), key, sol, hints || ['Start on the ' + t('y') + '-axis at ' + t(ptT([0, b])) + '.', 'Slope = rise ÷ run: the top number is up (or down if negative), the bottom number is to the right.'], text);
    p.bad = W.map(function (w) { return w.is; }).filter(function (w) { return !DR.same(w, key); }).concat([segOf(key)]);
    p.good = [lineV([0, b], [mq[1], b + mq[0]])];
    return p;
  }
  function mbSol(m, b) { var s = riseRun(m); return 'Plot the ' + t('y') + '-intercept ' + t(ptT([0, b])) + '. The slope ' + t(qT(m) + (Q(m)[1] === 1 ? '=\\frac{' + s.rise + '}{1}' : '')) + ' means ' + stepT(m) + ': ' + t(ptT([s.run, b + s.rise])) + '. Draw the line through both points, arrows at both ends.'; }
  function clip(m, b, xr, yr) {
    var mv = qv(m), bv = qv(b), out = [];
    if (mv === 0) return [[xr[0], bv], [xr[1], bv]];
    [xr[0], xr[1]].forEach(function (x) { var y = mv * x + bv; if (y >= yr[0] - 1e-9 && y <= yr[1] + 1e-9) out.push([x, y]); });
    [yr[0], yr[1]].forEach(function (y) { var x = (y - bv) / mv; if (x > xr[0] + 1e-9 && x < xr[1] - 1e-9) out.push([x, y]); });
    out.sort(function (p, q) { return p[0] - q[0]; });
    return [out[0], out[out.length - 1]];
  }
  function lineFig(m, b, o) {
    o = o || {};
    var xr = o.x || [-6, 6], yr = o.y || [-6, 6], P = clip(m, b, [xr[0] + 0.3, xr[1] - 0.3], [yr[0] + 0.3, yr[1] - 0.3]);
    return '<div class="fig">' + HW.graph({ x: xr, y: yr, grid: 1, labels: 2, segs: [{ pts: P, start: 'arrow', end: 'arrow' }], points: (o.points || []).map(function (p) { return { x: p[0], y: p[1] }; }), max: o.max || 260, aria: 'graph of a line' }) + '</div>';
  }

  /* ---------------- slope as a fraction rise/run ---------------- */
  function fracParts(s) { // "a/b" as typed -> [num, den] (signs as written) or null
    var a = ex.parse(cleanS(s)); if (!a.ok) return null;
    var ast = a.ast, neg = false;
    while (ast && ast.t === 'paren') ast = ast.a;
    if (ast && ast.t === 'neg') { neg = true; ast = ast.a; while (ast && ast.t === 'paren') ast = ast.a; }
    if (!ast || ast.t !== 'div') return { value: ex.value(a.ast), frac: null };
    var n = ex.value(ast.a), d = ex.value(ast.b);
    if (!isFinite(n) || !isFinite(d) || Math.round(n) !== n || Math.round(d) !== d || d === 0) return { value: ex.value(a.ast), frac: null };
    return { value: (neg ? -1 : 1) * n / d, frac: [neg ? -n : n, d] };
  }
  /* dir: null (any) | 'right' (positive run) | 'left' (negative run) */
  function riseRunC(m, dir, other) {
    var mv = qv(m);
    return function (resp) {
      var s = cleanS(resp); if (!s) return form('empty', 'Type your answer first.');
      var f = fracParts(s); if (!f || !isFinite(f.value)) return form('unreadable', 'Type a fraction ' + t('\\frac{\\text{rise}}{\\text{run}}') + ' with the fraction key.');
      if (!near(f.value, mv)) {
        if (near(f.value, -mv) && mv !== 0) return wrong('slope-sign', 'Check the sign: the slope is ' + t(qT(m)) + '.');
        if (mv !== 0 && near(f.value, 1 / mv)) return wrong('slope-flip', 'Rise goes on top, run on the bottom.');
        return wrong('slope', null);
      }
      if (!f.frac) return form('u7l3-frac-form', 'Right value — now write it as a fraction ' + t('\\frac{\\text{rise}}{\\text{run}}') + (Q(m)[1] === 1 ? ', e.g. ' + t('\\frac{' + Q(m)[0] + '}{1}') : '') + '.');
      if (dir === 'right' && f.frac[1] < 0) return wrong('u7l3-dir', 'This fraction has a negative run: it steps to the <b>left</b>. For a step to the right, put the sign on the rise.');
      if (dir === 'left' && f.frac[1] > 0) return wrong('u7l3-dir', 'This fraction has a positive run: it steps to the <b>right</b>. For a step to the left, make the run negative (and change the sign of the rise).');
      if (other) { var o = other(); if (o && o[0] === f.frac[0] && o[1] === f.frac[1]) return form('u7l3-same-frac', 'That is the same fraction as your first one — write a different one.'); }
      return ok();
    };
  }

  /* ---------------- a second point on the line ---------------- */
  function secondPtC(m, b) {
    var mq = Q(m), mv = qv(m);
    return function (resp) {
      var r = LN.readPoint(resp);
      if (r.empty) return form('empty', 'Type the point, e.g. ' + t('(3,\\ 1)') + '.');
      if (r.bad || r.kind !== 'pt') return form('pt-unreadable', 'Write the point as an ordered pair, e.g. ' + t('(3,\\ 1)') + '.');
      if (!r.brackets && !r.named) return form('pt-brackets', 'Write the point in brackets: ' + t('(x,\\ y)') + '.');
      var x = r.p[0].v, y = r.p[1].v;
      if (near(x, 0) && near(y, b)) return wrong('u7l3-pt-icpt', 'That is the ' + t('y') + '-intercept, the first point. Use the slope to step to a second point.');
      if (near(y, mv * x + b)) return ok();
      if (near(x, mq[0]) && near(y, b + mq[1]) || near(x, Math.abs(mq[0])) && near(y, b + (mq[0] < 0 ? -mq[1] : mq[1]))) return wrong('u7l3-pt-flip', 'Rise and run are swapped: the top number of ' + t(qT(m)) + ' is the rise (up/down), the bottom number is the run (right).');
      if (near(x, mq[1]) && near(y, b - mq[0])) return wrong('u7l3-pt-sign', 'Check the direction: the slope is ' + (mv < 0 ? 'negative, so from the intercept go right and <b>down</b>.' : 'positive, so go right and <b>up</b>.'));
      if (near(y, x) && near(x, 0)) return wrong('u7l3-pt-off', null);
      return wrong('u7l3-pt-off', 'That point isn’t on the line: check it in ' + t(siT(m, b)) + '. From ' + t(ptT([0, b])) + ' step ' + stepT(m) + '.');
    };
  }
  function secondPtPart(prompt, m, b, text, lev) {
    var mq = Q(m), P = [mq[1], b + mq[0]];
    var p = B.math(prompt, secondPtC(m, b), ptT(P), 'From ' + t(ptT([0, b])) + ', step ' + stepT(m) + ': ' + t(ptT(P)) + '. (Any other point of the line works too, e.g. ' + t(ptT([2 * mq[1], b + 2 * mq[0]])) + '.)', ['Write ' + t('m') + ' as ' + t('\\frac{\\text{rise}}{\\text{run}}') + ' and step from ' + t(ptT([0, b])) + ': right by the run, up or down by the rise.'], text, { keys: 'pairs', placeholder: 'e.g. (3, 1)' });
    p.good = ['(' + (-mq[1]) + ', ' + (b - mq[0]) + ')'];
    p.bad = ['(0, ' + b + ')', '(' + mq[1] + ', ' + (b - mq[0]) + ')'].filter(function (s) { return mq[0] !== 0; });
    return p;
  }

  /* ---------------- horizontal / vertical: slope, y-int, x-int with none / undefined ---------------- */
  function readSpecial(s) {
    var low = String(s == null ? '' : s).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, function (a, p, q) { return p || q; }).trim().toLowerCase();
    if (!low) return { empty: true };
    if (/^(none|no)$/.test(low)) return { none: true };
    if (/^(undefined|undef\.?)$/.test(low)) return { und: true };
    var pp = asPoint(s); if (pp) return { pt: pp };
    var a = ex.parse(cleanS(s)); if (!a.ok) return { bad: true };
    var v = ex.value(a.ast); return isFinite(v) ? { v: v } : { bad: true };
  }
  function hvC(kind, want, ctx) { // kind: 'slope' | 'y' | 'x'; want: number, 'none', 'und'
    return function (resp) {
      var a = readSpecial(resp);
      if (a.empty) return form('empty', 'Fill in this box.');
      if (a.bad) return form('unreadable', 'Type a number, or use <b>none</b> / <b>undef.</b>');
      if (kind === 'slope') {
        if (want === 'und') return a.und ? ok() : a.none ? form('u7l3-hv-none', 'For a vertical line we say the slope is <b>undefined</b> (the run is 0) — use <b>undef.</b>') : wrong('u7l3-hv-slope', 'This line is vertical: the run between any two of its points is ' + t('0') + ', and you can’t divide by ' + t('0') + '. The slope is undefined.');
        if (a.v != null && near(a.v, want)) return ok();
        return wrong('u7l3-hv-slope', a.und ? '“Undefined” is the slope of a <b>vertical</b> line. This one is horizontal: the rise is ' + t('0') + ', so the slope is ' + t('0') + '.' : a.none ? 'A horizontal line has a slope: the rise is ' + t('0') + ', so the slope is ' + t('0') + '.' : 'A horizontal line never rises or falls: its slope is ' + t('0') + '.');
      }
      if (want === 'none') { if (a.none) return ok(); return wrong('u7l3-hv-none', 'This line never meets the ' + t(kind) + '-axis (it runs parallel to it) — press <b>none</b>.'); }
      if (a.none) return wrong('u7l3-hv-none', 'This line does cross the ' + t(kind) + '-axis. Where?');
      if (a.und) return wrong('u7l3-hv-none', '“Undefined” describes a slope, not an intercept.');
      var v = a.pt ? (kind === 'x' ? a.pt[0] : a.pt[1]) : a.v;
      if (a.pt && !(kind === 'x' ? near(a.pt[1], 0) : near(a.pt[0], 0))) return wrong('icpt-axis', 'A point on the ' + t(kind) + '-axis has ' + t((kind === 'x' ? 'y' : 'x') + '=0') + '.');
      if (near(v, want)) return ok();
      return wrong('u7l3-hv-icpt', 'The line is ' + ctx + '. Where does it cross the ' + t(kind) + '-axis?');
    };
  }

  /* ---------------- shared numbers ---------------- */
  function intLine(r, mList, bRange) { return pickWhere(function () { return { m: r.pick(mList), b: r.int(bRange[0], bRange[1]) }; }, function (o) { return latticeCount(o.m, o.b, [-6, 6], [-6, 6]) >= 2 && o.b >= -6 && o.b <= 6; }); }
  function fracLine(r, list, bRange) { return pickWhere(function () { return { m: r.pick(list), b: r.int(bRange[0], bRange[1]) }; }, function (o) { var mq = Q(o.m); return Math.abs(o.b + mq[0]) <= 6 && latticeCount(o.m, o.b, [-6, 6], [-6, 6]) >= 2; }); }
  function graphQ(num, sec, stem, items) {
    var parts = [];
    items.forEach(function (it) {
      parts.push({ id: num + it.s, sub: it.s + ' i', level: it.lm, make: function (r, sh) { var o = sh[it.s], E = eqShown(o); return mbPart('(' + it.s + ') ' + t(E) + ': state the slope and ' + t('y') + '-intercept.', o.m, o.b, { mDiag: (Math.abs(qv(o.m)) === 1 ? [[0, 'hidden-1', 'A bare ' + t((qv(o.m) < 0 ? '-' : '') + 'x') + ' means ' + t(qv(o.m) + 'x') + '.']] : []).concat(o.rev ? [[o.b, 'mb-order', t(o.b) + ' is written first, but it doesn’t multiply ' + t('x') + '.']] : []) }, (o.rev ? 'Reorder: ' + t(siT(o.m, o.b)) + '. ' : '') + t('m=' + qT(o.m)) + ', ' + t('b=' + o.b) + '.', null, 'mb ' + num + it.s); } });
      parts.push({ id: num + it.s + '2', sub: it.s + ' ii', level: it.lg, make: function (r, sh) { var o = sh[it.s]; return graphMB('Graph ' + t(eqShown(o)) + '.', o.m, o.b, mbSol(o.m, o.b), null, 'graph ' + num + it.s); } });
    });
    var q = { num: num, stem: stem, shared: function (r) { var o = {}; items.forEach(function (it) { o[it.s] = it.gen(r); o[it.s].rev = o[it.s].b !== 0 && r.chance(0.3); }); return o; }, parts: parts };
    if (sec) q.section = sec;
    return q;
  }

  function eqShown(o) { return o.rev ? 'y=' + o.b + term(o.m, 'x', false) : siT(o.m, o.b); }
  /* two lines: the drawing must show both */
  function twoLinesChk(L1, L2) {
    var k1 = keyLine(L1.m, L1.b), k2 = keyLine(L2.m, L2.b), both = gv([], DR.norm(k1).pieces.concat(DR.norm(k2).pieces));
    var base = K.graphExact(both, {});
    return { key: both, check: function (resp) {
      if (!DR.empty(resp) && DR.same(resp, both)) return ok();
      if (!DR.empty(resp) && (DR.same(resp, k1) || DR.same(resp, k2))) return wrong('u7l3-two-lines', 'That line is right — now graph the other one on the same grid.');
      return base(resp);
    } };
  }

  HW.defineLesson({
    id: 'u7l3', unit: 7, num: '3', title: 'Graphing a Line Using Slope–Intercept Form', outcome: 'RF6',
    blurb: 'Graph y = mx + b with no table of values: plot (0, b), step out the slope as rise over run, and draw the line.',
    questions: [
      /* ================= Part A ================= */
      { num: '1', section: 'Part A — Reading the Slope and the y-Intercept', stem: 'State the slope ' + t('m') + ' and the ' + t('y') + '-intercept ' + t('b') + ' for each equation. (No graphing needed.)', parts: [
        { id: '1a', sub: 'a', level: 'BEG', make: function (r) { var a = r.int(2, 9), c = r.pick(nz(-9, 9)); return mbPart('(a) ' + t(siT(a, c)), a, c, {}, t('m=' + a) + ', ' + t('b=' + c) + '.', null, '1a'); } },
        { id: '1b', sub: 'b', level: 'BEG', make: function (r) { var a = r.int(2, 9), c = r.pick(nz(-9, 9)); return mbPart('(b) ' + t(siT(-a, c)), -a, c, { mDiag: [[a, 'sign', 'Keep the minus sign: ' + t('m=-' + a) + '.']] }, t('m=-' + a) + ', ' + t('b=' + c) + '.', null, '1b'); } },
        { id: '1c', sub: 'c', level: 'BEG', make: function (r) { var m = r.pick(fracs([2, 3, 4, 5], 4, true)), c = r.pick(nz(-9, 9)); return mbPart('(c) ' + t(siT(m, c)), m, c, {}, t('m=' + qT(m)) + ', ' + t('b=' + c) + '.', null, '1c'); } },
        { id: '1d', sub: 'd', level: 'BEG', make: function (r) { var m = qneg(r.pick(fracs([3, 4, 5, 7, 8, 9], 8, true))); return mbPart('(d) ' + t(siT(m, 0)), m, 0, {}, t(siT(m, 0) + '+0') + ': ' + t('m=' + qT(m)) + ', ' + t('b=0') + '.', null, '1d'); } },
        { id: '1e', sub: 'e', level: 'EMG', make: function (r) { var a = r.int(2, 9), c = r.int(2, 12); return mbPart('(e) ' + t('y=' + c + '-' + a + 'x'), -a, c, { mDiag: [[c, 'mb-order', t(c) + ' is the first number, but it doesn’t multiply ' + t('x') + '. Reorder: ' + t(siT(-a, c)) + '.']], bDiag: [[-a, 'mb-order', 'The number multiplying ' + t('x') + ' is the slope.']] }, 'Reorder: ' + t(siT(-a, c)) + '. ' + t('m=-' + a) + ', ' + t('b=' + c) + '.', null, '1e'); } }] },
      { num: '2', stem: 'Write the ' + t('y') + '-intercept of each equation as an ordered pair ' + t('(0,\\ b)') + '.', parts: [
        { id: '2a', sub: 'a', level: 'BEG', make: function (r) { var a = r.int(2, 9), c = -r.int(1, 12); return ptPart('(a) ' + t(siT(a, c)), [0, c], { wrong: [{ is: [0, a], code: 'mb-swap', hint: t(a) + ' is the slope. The ' + t('y') + '-intercept is the constant.' }, { is: [0, -c], code: 'sign', hint: 'Keep the sign of the constant.' }] }, t('b=' + c) + ', so the line crosses the ' + t('y') + '-axis at ' + t(ptT([0, c])) + '.', ['The ' + t('y') + '-intercept is on the ' + t('y') + '-axis, where ' + t('x=0') + '.'], '2a'); } },
        { id: '2b', sub: 'b', level: 'BEG', make: function (r) { var a = r.int(2, 9), c = r.int(1, 12); return ptPart('(b) ' + t(siT(-a, c)), [0, c], { wrong: [{ is: [0, -a], code: 'mb-swap', hint: t(-a) + ' is the slope. The ' + t('y') + '-intercept is the constant.' }] }, t('b=' + c) + ': ' + t(ptT([0, c])) + '.', ['The ' + t('y') + '-intercept is ' + t('(0,\\ b)') + '.'], '2b'); } },
        { id: '2c', sub: 'c', level: 'BEG', make: function (r) { var m = r.pick(fracs([3, 4, 5, 7], 6, true)).map(function (v, i) { return i === 0 && r.chance(0.3) ? -v : v; }); return ptPart('(c) ' + t(siT(m, 0)), [0, 0], { wrong: [{ is: [0, m], code: 'mb-swap', hint: 'That’s the slope. There is no constant term, so ' + t('b=0') + '.' }] }, 'No constant term: ' + t('b=0') + '. The line passes through the origin ' + t('(0,\\ 0)') + '.', ['There is no constant term — what is ' + t('b') + '?'], '2c'); } },
        { id: '2d', sub: 'd', level: 'BEG', make: function (r) { var c = r.pick(nz(-9, 15).filter(function (v) { return Math.abs(v) > 1; })); return ptPart('(d) ' + t('y=' + c + '-x'), [0, c], { wrong: [{ is: [0, -1], code: 'mb-order', hint: t('-1') + ' is the slope (' + t('-x=-1x') + '). The constant is ' + t(c) + '.' }] }, 'Reorder: ' + t(siT(-1, c)) + ': ' + t('b=' + c) + ', ' + t(ptT([0, c])) + '.', ['The constant term is ' + t('b') + ', wherever it is written.'], '2d'); } }] },
      { num: '3', stem: 'Write the slope of each equation as a fraction ' + t('\\dfrac{\\text{rise}}{\\text{run}}') + '.', parts: [
        { id: '3a', sub: 'a', level: 'BEG', make: function (r) { var a = r.int(2, 9), c = r.pick(nz(-9, 9)); return fracPart('(a) ' + t(siT(a, c)), a, '3a'); } },
        { id: '3b', sub: 'b', level: 'BEG', make: function (r) { var a = r.int(2, 9), c = r.pick(nz(-9, 9)); return fracPart('(b) ' + t(siT(-a, c)), -a, '3b'); } },
        { id: '3c', sub: 'c', level: 'BEG', make: function (r) { var m = r.pick(fracs([5, 7, 8, 9], 8, true)), c = r.pick(nz(-9, 9)); return fracPart('(c) ' + t(siT(m, c)), m, '3c'); } },
        { id: '3d', sub: 'd', level: 'BEG', make: function (r) { var m = qneg(r.pick(fracs([2, 3, 4], 9, false).filter(function (f) { return f[0] > f[1]; }))), c = r.pick(nz(-9, 9)); return fracPart('(d) ' + t(siT(m, c)), m, '3d'); } }] },
      /* ================= Part B ================= */
      graphQ('4', 'Part B — Graphing from y = mx + b', 'For each equation, state the slope and ' + t('y') + '-intercept, then graph the line: plot the ' + t('y') + '-intercept, use the slope to find a second point, and draw the line through both points.', [
        { s: 'a', lm: 'BEG', lg: 'BEG', gen: function (r) { return intLine(r, [1], [-6, 6]); } },
        { s: 'b', lm: 'BEG', lg: 'BEG', gen: function (r) { return intLine(r, [2], [-6, 6]); } },
        { s: 'c', lm: 'BEG', lg: 'BEG', gen: function (r) { return intLine(r, [3], [-6, 6]); } },
        { s: 'd', lm: 'BEG', lg: 'BEG', gen: function (r) { return intLine(r, [4, 3], [-4, 4]); } }]),
      graphQ('5', null, 'Same instruction as Question 4. Each of these lines has a <b>negative</b> slope.', [
        { s: 'a', lm: 'BEG', lg: 'EMG', gen: function (r) { return intLine(r, [-1], [-6, 6]); } },
        { s: 'b', lm: 'BEG', lg: 'EMG', gen: function (r) { return intLine(r, [-2], [-6, 6]); } },
        { s: 'c', lm: 'BEG', lg: 'EMG', gen: function (r) { return intLine(r, [-3], [-6, 6]); } }]),
      graphQ('6', null, 'Same instruction as Question 4. Each of these lines has a <b>fractional</b> slope.', [
        { s: 'a', lm: 'BEG', lg: 'PRG', gen: function (r) { return fracLine(r, [[1, 2], [1, 3]], [-5, 3]); } },
        { s: 'b', lm: 'BEG', lg: 'PRG', gen: function (r) { return fracLine(r, [[3, 4], [2, 3], [3, 5], [2, 5]], [-4, 3]); } },
        { s: 'c', lm: 'BEG', lg: 'PRG', gen: function (r) { return fracLine(r, [[-2, 3], [-3, 4], [-1, 2], [-3, 2]], [-1, 5]); } }]),
      /* ================= Part C ================= */
      { num: '7', section: 'Part C — Short Answer and Application', parts: [
        { id: '7', level: 'EMG', make: function (r) {
          var m = r.pick([2, 3, -2, [2, 3], [-3, 4]]), b = r.pick(nz(-5, 5));
          return mc(r, 'Why do you always start graphing ' + t(siT(m, b)) + ' at the ' + t('y') + '-intercept rather than at some other point on the line?', [
            { html: 'The point ' + t('(0,\\ b)') + ' can be read straight from the equation with no calculation, so it is a guaranteed point on the line to step from.', right: true },
            { html: 'The ' + t('y') + '-intercept is the only point on the line with whole-number coordinates.', why: 'Lines have many lattice points. The intercept is special because it needs no calculation.' },
            { html: 'Starting anywhere else would give a different line.', why: 'Any point of the line works with the slope — the intercept is just the one you can read off with no work.' },
            { html: 'The slope only works when you start on the ' + t('x') + '-axis.', why: 'The slope works from any point of the line. And ' + t('(0,\\ b)') + ' is on the ' + t('y') + '-axis.' }],
            t('b') + ' is in the equation, so ' + t(ptT([0, b])) + ' is a point you know for certain without any arithmetic. From there the slope gives more points.', ['What can you read from ' + t(siT(m, b)) + ' without calculating?'], 'why start at b');
        } }] },
      { num: '8', shared: function (r) { return { a: r.int(2, 12) * (r.chance(0.75) ? 1 : -1) }; }, stem: function (s) { return 'A line has slope ' + t(-s.a) + '.'; }, parts: [
        { id: '8a', level: 'EMG', make: function (r, s) {
          var first = null, m = -s.a;
          var c1 = riseRunC(m, null), c2 = riseRunC(m, null, function () { return first; });
          var p = B.fields('(a) Write the slope as two different but equivalent fractions ' + t('\\dfrac{\\text{rise}}{\\text{run}}') + '.', [{ label: 'Fraction 1', name: 'fraction 1', mode: 'math', keys: 'fraction' }, { label: 'Fraction 2', name: 'fraction 2', mode: 'math', keys: 'fraction' }], [function (resp) { var f = fracParts(cleanS(resp)); first = f && f.frac; return c1(resp); }, c2],
            ['\\frac{' + m + '}{1}', '\\frac{' + s.a + '}{-1}'], t('\\frac{' + m + '}{1}') + ' and ' + t('\\frac{' + s.a + '}{-1}'),
            t(m + '=\\frac{' + m + '}{1}') + ' (' + (m < 0 ? 'down ' : 'up ') + t(Math.abs(m)) + ', right ' + t('1') + ') ' + t('=\\frac{' + s.a + '}{-1}') + ' (' + (m < 0 ? 'up ' : 'down ') + t(Math.abs(m)) + ', left ' + t('1') + '). Others work too, e.g. ' + t('\\frac{' + 2 * m + '}{2}') + '.', ['Any whole number can be written over ' + t('1') + '.', 'Moving the minus sign from the top to the bottom keeps the value the same.'], '8a two fractions');
          p.good = [['\\frac{' + 2 * m + '}{2}', '\\frac{' + m + '}{1}']];
          p.bad = [['\\frac{' + m + '}{1}', '\\frac{' + m + '}{1}'], [String(m), '\\frac{' + s.a + '}{-1}']];
          return p;
        } },
        { id: '8b', level: 'EMG', make: function (r, s) {
          return mc(r, '(b) Why do ' + t('\\frac{' + (-s.a) + '}{1}') + ' and ' + t('\\frac{' + s.a + '}{-1}') + ' produce the same line?', [
            { html: 'They are the same number. ' + (s.a > 0 ? 'Down' : 'Up') + ' ' + t(Math.abs(s.a)) + '-right ' + t('1') + ' and ' + (s.a > 0 ? 'up' : 'down') + ' ' + t(Math.abs(s.a)) + '-left ' + t('1') + ' are opposite moves along the same line, so both land on it.', right: true },
            { html: 'They don’t: one line rises and the other falls.', why: 'Both fractions equal ' + t(-s.a) + ': each move goes the same direction along the line, just in opposite senses.' },
            { html: 'Because a slope can always be written upside down.', why: t('\\frac{1}{' + (-s.a) + '}') + ' is a different slope. Here only the minus sign moves.' },
            { html: 'Because both have ' + t(Math.abs(s.a)) + ' in them, and the sign never matters.', why: 'The sign matters: ' + t(s.a) + ' and ' + t(-s.a) + ' are different slopes. Here both fractions are ' + t(-s.a) + '.' }],
            t('\\frac{' + (-s.a) + '}{1}=\\frac{' + s.a + '}{-1}=' + (-s.a)) + '. The two moves travel the same line in opposite directions.', ['Work out each fraction as a single number.'], '8b same line');
        } }] },
      { num: '9', shared: function (r) {
          var C = r.pick([['A bike rental company', 'hours rented'], ['A canoe rental company', 'hours rented'], ['A kayak rental shop', 'hours rented'], ['An e-scooter rental', 'hours rented']]);
          var o = pickWhere(function () { return { m: r.pick([2, 3, 4, 5]), b: r.pick([5, 10, 15, 20]) }; }, function (o) { return o.m * 10 + o.b <= 50; });
          return { C: C, m: o.m, b: o.b, ym: Math.ceil((o.m * 10 + o.b) / 10) * 10 };
        },
        stem: function (s) { return s.C[0] + ' charges according to the equation ' + t(siT(s.m, s.b)) + ', where ' + t('x') + ' is the number of hours rented and ' + t('y') + ' is the total cost in dollars.'; }, parts: [
        { id: '9a', level: 'BEG', make: function (r, s) { return mbPart('(a) State the slope and ' + t('y') + '-intercept.', s.m, s.b, {}, t('m=' + s.m) + ' (dollars per hour), ' + t('b=' + s.b) + ' (dollars).', null, '9a'); } },
        { id: '9b', level: 'EMG', make: function (r, s) {
          var inp = { x: [0, 10], y: [0, s.ym], grid: 1, gridY: 5, snapY: 5, labelsX: 2, labelsY: 10, unitX: 30, unitY: 280 / s.ym, firstQuadrant: true, xTitle: 'Hours', yTitle: 'Cost ($)', defaultEnd: 'arrow', max: 380 };
          var key = gv([], [{ v: [[0, s.b], [10, s.m * 10 + s.b]], s: 'closed', e: 'closed' }]);
          var chk = function (resp) {
            if (DR.empty(resp)) return form('empty', 'Draw the line on the grid first.');
            var g = DR.geom(resp), ks = Object.keys(g.lines);
            var n = DR.norm(resp), onL = function (p) { return near(p[1], s.m * p[0] + s.b); };
            if (!ks.length) { if (n.pts.length >= 2 && n.pts.every(onL)) return wrong('gr-join', 'Your points are on the line — now join them with <b>╱ Line</b>.'); return wrong('u7l3-ctx-graph', 'Start at ' + t(ptT([0, s.b])) + ' and use the slope to reach a second point, then draw the line.'); }
            if (ks.length > 1) return wrong('u7l3-ctx-graph', 'Draw just one straight line.');
            var L = g.lines[ks[0]];
            if (Math.abs(L.B) < 1e-9) return wrong('gr-vh', 'That line is vertical. The cost goes up ' + t(s.m) + ' dollars for every hour.');
            var ms = -L.A / L.B, bs = L.C / L.B;
            if (!near(ms, s.m) || !near(bs, s.b)) {
              if (near(bs, s.b)) return wrong('gr-slope', 'Right starting cost — check the slope: every hour adds ' + t(s.m) + ' dollars, so 5 hours adds ' + t(5 * s.m) + '.');
              if (near(ms, s.m)) return wrong('gr-icpt', 'Right slope — but at ' + t('0') + ' hours the cost is ' + t(s.b) + ' dollars.');
              return wrong('u7l3-ctx-graph', null);
            }
            var iv = L.iv || [], lo = Math.min.apply(null, iv.map(function (q) { return q.lo; })), hi = Math.max.apply(null, iv.map(function (q) { return q.hi; }));
            if (!(lo <= 0.01) || !(hi >= 5)) return wrong('u7l3-ctx-graph', 'Right line — draw it from ' + t(ptT([0, s.b])) + ' across the grid.');
            return ok();
          };
          var p = B.graph('(b) Graph the line using the slope and ' + t('y') + '-intercept method.' + PADHELP, inp, chk, key,
            'Start at ' + t(ptT([0, s.b])) + '. The slope ' + t(s.m) + ' means ' + t(s.m) + ' dollars per hour: right ' + t('5') + ' hours, up ' + t(5 * s.m) + ' dollars to ' + t(ptT([5, s.b + 5 * s.m])) + '. Draw the line from ' + t(ptT([0, s.b])) + ' across the grid (time can’t be negative, so it starts at ' + t('x=0') + ').',
            ['The grid’s cost axis goes up by ' + t('5') + ' per line: use a run of ' + t('5') + ' hours.', 'At ' + t('0') + ' hours the cost is ' + t('b') + '.'], '9b context graph');
          p.good = [lineV([0, s.b], [5, s.b + 5 * s.m]), gv([], [{ v: [[0, s.b], [5, s.b + 5 * s.m]], s: 'closed', e: 'arrow' }])];
          p.bad = [lineV([0, s.b], [5, s.b + 5]), gv([[0, s.b], [5, s.b + 5 * s.m]], [])];
          return p;
        } },
        { id: '9c', level: 'BEG', make: function (r, s) {
          return mc(r, '(c) What does the ' + t('y') + '-intercept represent in this situation?', [
            { html: 'A flat $' + s.b + ' starting fee, charged before any hours — the cost at ' + t('0') + ' hours.', right: true },
            { html: 'The cost of each hour, $' + s.b + '.', why: 'The cost per hour is the slope, ' + t(s.m) + '. The intercept is the cost at ' + t('0') + ' hours.' },
            { html: 'The number of hours you can rent for $' + s.b + '.', why: 'The ' + t('y') + '-axis is the cost, not the hours.' },
            { html: 'The total cost of a full day.', why: 'The ' + t('y') + '-intercept is where ' + t('x=0') + ' — no hours at all.' }],
            'At ' + t('x=0') + ' hours, ' + t('y=' + s.b) + ': a starting fee of $' + s.b + ' you pay even before riding.', ['The ' + t('y') + '-intercept is the value of ' + t('y') + ' when ' + t('x=0') + '.'], '9c meaning of b');
        } }] },
      /* ================= Part D ================= */
      { num: '10', section: 'Part D — Multiple Choice and Numerical Response', parts: [
        { id: '10', level: 'BEG', make: function (r) {
          var a = r.int(2, 9), c = r.pick(nz(-9, 9).filter(function (v) { return Math.abs(v) !== a; })), eq = siT(-a, c);
          return mc(r, '<i>(Multiple Choice)</i> When graphing ' + t(eq) + ' using the slope–intercept method, which point should you plot <i>first</i>?', [
            { html: t(ptT([0, c])), right: true }, { html: t(ptT([0, -a])), why: t(-a) + ' is the slope. Plot the ' + t('y') + '-intercept first.' }, { html: t(ptT([c, 0])), why: 'The ' + t('y') + '-intercept is on the ' + t('y') + '-axis: ' + t('x=0') + '.' }, { html: t(ptT([-a, 0])), why: 'That uses the slope as a point on the ' + t('x') + '-axis.' }],
            'Start with the ' + t('y') + '-intercept ' + t(ptT([0, c])) + ', then use the slope ' + t(-a) + '.', ['Step 1 is always ' + t('(0,\\ b)') + '.'], '10 first point');
        } }] },
      { num: '11', parts: [
        { id: '11', level: 'BEG', make: function (r) {
          var m = r.pick(fracs([3, 4, 5, 7], 6, true).filter(function (f) { return f[0] > 1; })), c = r.pick(nz(-6, 6)), p = m[0], q = m[1];
          return mc(r, '<i>(Multiple Choice)</i> A line has equation ' + t(siT(m, c)) + '. Starting at the ' + t('y') + '-intercept, which move locates a second point on the line?', [
            { html: 'Right ' + q + ', up ' + p, right: true }, { html: 'Right ' + p + ', up ' + q, why: 'The top number is the rise (up), the bottom number the run (right).' }, { html: 'Right ' + q + ', down ' + p, why: 'The slope is positive: go up.' }, { html: 'Right ' + (-c > 0 ? -c : 2) + ', up ' + t(qT(m)), why: 'Use the slope as rise over run: up ' + p + ', right ' + q + '.' }],
            t('m=' + qT(m) + '=\\frac{\\text{rise}}{\\text{run}}') + ': up ' + p + ', right ' + q + '.', ['Rise over run: which number is the rise?'], '11 move');
        } }] },
      { num: '12', parts: [
        { id: '12', level: 'EMG', make: function (r) {
          var a = r.int(2, 6), c = r.int(2, 9), F = r.pick(['A', 'B', 'C', 'D']), eq = siT(-a, c);
          var S = {
            A: F === 'A' ? { html: 'The ' + t('y') + '-intercept is ' + t(-a) + '.' } : { html: 'The ' + t('y') + '-intercept is ' + t(c) + '.', why: 'True: ' + t('b=' + c) + '.' },
            B: F === 'B' ? { html: 'The graph rises from left to right.' } : { html: 'The graph falls from left to right.', why: 'True: the slope ' + t(-a) + ' is negative.' },
            C: F === 'C' ? { html: 'The slope can be written as ' + t('\\frac{' + a + '}{1}') + '.' } : { html: 'The slope can be written as ' + t('\\frac{-' + a + '}{1}') + ' or ' + t('\\frac{' + a + '}{-1}') + '.', why: 'True: both equal ' + t(-a) + '.' },
            D: F === 'D' ? { html: 'The line passes through the point ' + t(ptT([1, c + a])) + '.' } : { html: 'The line passes through the point ' + t(ptT([1, c - a])) + '.', why: 'True: ' + t('-' + a + '(1)+' + c + '=' + (c - a)) + '.' } };
          S[F].right = true;
          var why = { A: t('b=' + c) + ', not ' + t(-a) + '.', B: 'The slope ' + t(-a) + ' is negative, so the graph falls.', C: t('\\frac{' + a + '}{1}=' + a) + ', but the slope is ' + t(-a) + '.', D: 'At ' + t('x=1') + ': ' + t('y=-' + a + '(1)+' + c + '=' + (c - a)) + ', not ' + t(c + a) + '.' };
          return mc(r, '<i>(Multiple Choice)</i> Which statement is <b>false</b> for the line ' + t(eq) + '?', ['A', 'B', 'C', 'D'].map(function (k) { return S[k]; }),
            'Check each: ' + ['A', 'B', 'C', 'D'].map(function (k) { return k === F ? '<b>' + why[k] + ' — false.</b>' : S[k].why; }).join('<br>'), ['Test every statement against ' + t(eq) + '.'], '12 false statement', true);
        } }] },
      { num: '13', shared: function (r) { return pickWhere(function () { return { a: r.pick([1, 2, 3, 4, 5, 6]), x0: r.int(1, 6) }; }, function (o) { return o.a * o.x0 <= 18 && (o.a * o.x0 * o.x0) % 2 === 0; }); },
        stem: function (s) { var c = s.a * s.x0; return 'Consider the line with equation ' + t(siT(-s.a, c)) + '. The line intersects the ' + t('x') + '-axis at ' + t('P') + ' and the ' + t('y') + '-axis at ' + t('Q') + '. Triangle ' + t('POQ') + ' is formed, where ' + t('O') + ' is the origin.'; }, parts: [
        { id: '13', level: 'PRG', make: function (r, s) {
          var c = s.a * s.x0, A = s.x0 * c / 2;
          return B.nr('<i>(Numerical Response)</i> The area of ' + t('\\triangle POQ') + ', in square units, is ____.', A, dl([[2 * A, 'tri-half', 'Area of a triangle is ' + t('\\frac{1}{2}\\times\\text{base}\\times\\text{height}') + '.'], [s.x0 + c, 'tri-area', 'That’s the sum of the legs. The area is half their product.']], A),
            t('Q=' + ptT([0, c])) + '. For ' + t('P') + ' set ' + t('y=0') + ': ' + t('0=-' + s.a + 'x+' + c) + ', ' + t('x=' + s.x0) + ', so ' + t('P=' + ptT([s.x0, 0])) + '.<br>Legs ' + t(s.x0) + ' and ' + t(c) + ': ' + t('A=\\frac{1}{2}(' + s.x0 + ')(' + c + ')=' + A) + ' square units.',
            ['Find both intercepts: they are the corners of a right triangle with the origin.', 'Area = ' + t('\\frac{1}{2}\\times\\text{base}\\times\\text{height}') + '.'], '13 area');
        } }] },
      { num: '14', shared: function (r) { var T = r.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15], [8, 15, 17], [15, 8, 17]]); return { p: T[0] * (r.chance(0.3) ? -1 : 1), q: T[1], h: T[2] }; },
        stem: function (s) { var m = Q(-s.q, s.p); return 'Consider the line with equation ' + t(siT(m, s.q)) + '. The line intersects the ' + t('x') + '-axis at ' + t('P') + ' and the ' + t('y') + '-axis at ' + t('Q') + '. Triangle ' + t('POQ') + ' is formed, where ' + t('O') + ' is the origin.'; }, parts: [
        { id: '14', level: 'ADV', make: function (r, s) {
          var P = Math.abs(s.p) + s.q + s.h, m = Q(-s.q, s.p);
          return B.nr('<i>(Numerical Response)</i> The perimeter of ' + t('\\triangle POQ') + ', in units, is ____.', P, dl([[Math.abs(s.p) + s.q, 'tri-hyp', 'The perimeter goes all the way round: add the third side ' + t('PQ') + ' (Pythagorean theorem).'], [Math.abs(s.p) * s.q / 2, 'tri-area', 'That’s the area. The perimeter is the sum of the three sides.'], [s.h, 'tri-hyp', 'That’s only the side ' + t('PQ') + '. Add the two legs.']], P),
            t('Q=' + ptT([0, s.q])) + '. Set ' + t('y=0') + ': ' + t('0=' + lin([[m, 'x'], [s.q, '']])) + ' gives ' + t('x=' + s.p) + ', so ' + t('P=' + ptT([s.p, 0])) + '.<br>Legs ' + t(Math.abs(s.p)) + ' and ' + t(s.q) + '; ' + t('PQ=\\sqrt{' + s.p * s.p + '+' + s.q * s.q + '}=\\sqrt{' + s.h * s.h + '}=' + s.h) + '.<br>Perimeter ' + t('=' + Math.abs(s.p) + '+' + s.q + '+' + s.h + '=' + P) + ' units.',
            ['Find both intercepts, then the three sides of the right triangle.', 'The hypotenuse: ' + t('c=\\sqrt{a^{2}+b^{2}}') + '.'], '14 perimeter');
        } }] }
    ],

    extra: [
      /* ================= Part A ================= */
      { num: '1', section: 'Extra practice A — Counting Rise Over Run: Fractional Slopes', stem: 'Graph each line: plot ' + t('(0,\\ b)') + ' first, use the slope to step to a second point, then draw the line all the way across the grid. Record the second point you landed on.',
        shared: function (r) {
          return { a: fracLine(r, [[2, 3], [1, 3], [3, 4], [1, 2]], [-4, 0]), b: fracLine(r, [[-3, 4], [-2, 3], [-1, 3], [-3, 5]], [1, 5]), c: fracLine(r, [[5, 2], [3, 2], [5, 3], [4, 3]], [-5, -1]), d: fracLine(r, [[-4, 3], [-5, 2], [-3, 2], [-5, 3]], [0, 5]) };
        }, parts: [].concat.apply([], ['a', 'b', 'c', 'd'].map(function (L) {
          var lev = L === 'a' || L === 'b' ? 'EMG' : 'PRG';
          return [{ id: 'e1' + L, sub: L + ' i', level: lev, make: function (r, sh) { var o = sh[L]; return secondPtPart('(' + L + ') ' + t(siT(o.m, o.b)) + ': from ' + t('(0,\\ b)') + ', which second point do you land on?', o.m, o.b, 'EP1' + L + ' second point'); } },
            { id: 'e1' + L + '2', sub: L + ' ii', level: lev === 'EMG' ? 'EMG' : 'PRG', make: function (r, sh) { var o = sh[L]; return graphMB('Graph ' + t(siT(o.m, o.b)) + '.', o.m, o.b, mbSol(o.m, o.b), null, 'EP1' + L + ' graph'); } }];
        })) },
      { num: '2', shared: function (r) { var o = fracLine(r, [[-2, 3], [-3, 4], [-1, 2], [-3, 2], [-2, 5]], [-1, 3]); return pickWhere(function () { return o; }, function (o) { var q = Q(o.m); return Math.abs(o.b - q[0]) <= 6; }); },
        stem: function (s) { return '<b>One line, two directions.</b> Both moves below are for the same line, ' + t(siT(s.m, s.b)) + '.'; }, parts: [
        { id: 'e2a', sub: 'a', level: 'BEG', make: function (r, s) { var q = Q(s.m), P = [q[1], s.b + q[0]]; return ptPart('(a) Write the slope as ' + t('\\frac{' + q[0] + '}{' + q[1] + '}') + '. From ' + t(ptT([0, s.b])) + ', step <b>right</b> ' + t(q[1]) + ' and <b>down</b> ' + t(-q[0]) + '. Which point do you land on?', P, { wrong: [{ is: [q[1], s.b - q[0]], code: 'u7l3-pt-sign', hint: 'Down means the ' + t('y') + '-value gets smaller.' }, { is: [-q[1], s.b + q[0]], code: 'u7l3-dir', hint: 'Right means the ' + t('x') + '-value gets bigger.' }] }, 'From ' + t(ptT([0, s.b])) + ': ' + t('x') + ' goes up ' + t(q[1]) + ', ' + t('y') + ' goes down ' + t(-q[0]) + ': ' + t(ptT(P)) + '.', ['Right adds to ' + t('x') + '; down subtracts from ' + t('y') + '.'], 'EP2a'); } },
        { id: 'e2b', sub: 'b', level: 'EMG', make: function (r, s) { var q = Q(s.m), P = [-q[1], s.b - q[0]]; return ptPart('(b) Write the same slope as ' + t('\\frac{' + (-q[0]) + '}{-' + q[1] + '}') + '. From ' + t(ptT([0, s.b])) + ', step <b>left</b> ' + t(q[1]) + ' and <b>up</b> ' + t(-q[0]) + '. Which point do you land on?', P, { wrong: [{ is: [q[1], s.b - q[0]], code: 'u7l3-dir', hint: 'Left means the ' + t('x') + '-value gets smaller.' }, { is: [-q[1], s.b + q[0]], code: 'u7l3-pt-sign', hint: 'Up means the ' + t('y') + '-value gets bigger.' }] }, 'From ' + t(ptT([0, s.b])) + ': ' + t('x') + ' goes down ' + t(q[1]) + ', ' + t('y') + ' goes up ' + t(-q[0]) + ': ' + t(ptT(P)) + '.', ['Left subtracts from ' + t('x') + '; up adds to ' + t('y') + '.'], 'EP2b'); } },
        { id: 'e2c', sub: 'c', level: 'EMG', make: function (r, s) { return graphMB('(c) Draw the line through the points.', s.m, s.b, mbSol(s.m, s.b) + ' The point from (b) is on the same line.', null, 'EP2 graph'); } },
        { id: 'e2d', sub: 'd', level: 'EMG', make: function (r, s) {
          var q = Q(s.m);
          return mc(r, '(d) The two second points are different, but the two lines are identical. Why?', [
            { html: t('\\frac{' + q[0] + '}{' + q[1] + '}=\\frac{' + (-q[0]) + '}{-' + q[1] + '}') + ', so both moves use the same slope from the same starting point. Both points lie on ' + t(siT(s.m, s.b)) + ': the moves just travel the line in opposite directions.', right: true },
            { html: 'They aren’t identical: one line rises and the other falls.', why: 'Both fractions equal ' + t(qT(s.m)) + ' — the same slope, so the same line.' },
            { html: 'Any two points make the same line.', why: 'Only points on this line. Check: both points satisfy ' + t(siT(s.m, s.b)) + '.' },
            { html: 'Because the second fraction is the reciprocal of the first.', why: 'Not a reciprocal: the top and bottom both change sign, so the value is the same.' }],
            'Both fractions are ' + t(qT(s.m)) + '. Check: ' + t(ptT([q[1], s.b + q[0]])) + ' and ' + t(ptT([-q[1], s.b - q[0]])) + ' both satisfy ' + t(siT(s.m, s.b)) + '. Two points fix one line.', ['Compare the values of the two fractions.'], 'EP2 why same');
        } }] },
      { num: '3', stem: 'Write each slope as <b>two</b> equivalent fractions ' + t('\\dfrac{\\text{rise}}{\\text{run}}') + ': one that steps to the <b>right</b> (positive run), and one that steps to the <b>left</b> (negative run).', parts: (function () {
        function P(id, lev, gen) { return { id: id, sub: id.slice(2), level: lev, make: function (r) {
          var m = gen(r), q = Q(m), right = '\\frac{' + q[0] + '}{' + q[1] + '}', left = '\\frac{' + (-q[0]) + '}{-' + q[1] + '}';
          var p = B.fields('(' + id.slice(2) + ') ' + t('m=' + qT(m)), [{ label: 'Steps right', name: 'steps right', mode: 'math', keys: 'fraction' }, { label: 'Steps left', name: 'steps left', mode: 'math', keys: 'fraction' }], [riseRunC(m, 'right'), riseRunC(m, 'left')], [right, left], t(right) + ' (right ' + q[1] + ', ' + (q[0] < 0 ? 'down ' : 'up ') + Math.abs(q[0]) + ') and ' + t(left) + ' (left ' + q[1] + ', ' + (q[0] < 0 ? 'up ' : 'down ') + Math.abs(q[0]) + ')',
            'Right-stepping: the run is positive, ' + t(right) + '. Left-stepping: make the run negative and change the sign of the rise too, ' + t(left) + ' — the same value.', ['For a step to the left the run is negative; change the sign of the rise as well so the value stays ' + t(qT(m)) + '.'], 'EP3' + id);
          p.bad = [[left, right]];
          return p;
        } }; }
        return [P('e3a', 'EMG', function (r) { return r.int(2, 12) * (r.chance(0.7) ? -1 : 1); }), P('e3b', 'EMG', function (r) { return qneg(r.pick(fracs([3, 4, 5, 7, 8, 9], 8, true))); }), P('e3c', 'EMG', function (r) { var f = r.pick(fracs([2, 3, 4], 9, false).filter(function (f) { return f[0] > f[1]; })); return r.chance(0.6) ? f : qneg(f); })];
      })() },
      /* ================= Part B ================= */
      { num: '4', section: 'Extra practice B — Rearrange First, Then Graph', stem: 'None of these equations is in ' + t('y=mx+b') + ' form yet. Rearrange each one, then graph it.', parts: (function () {
        var out = [];
        ['a', 'b', 'c', 'd'].forEach(function (L) {
          var lev = L === 'a' || L === 'b' ? 'EMG' : 'PRG';
          out.push({ id: 'e4' + L, sub: L + ' i', level: lev, make: function (r, sh) {
            var g = sh[L], W = [{ is: { m: -qv(g.m), b: g.b }, code: 'move-sign', hint: 'When the ' + t('x') + '-term moves across, its sign changes.' }];
            if (Math.abs(g.k) !== 1) W.push({ is: { m: qv(g.m) * g.k, b: g.b * g.k }, code: 'not-divided', hint: 'Divide <b>every</b> term by ' + t(g.k) + '.' }, { is: { m: qv(g.m), b: g.b * g.k }, code: 'part-div', hint: 'Divide the constant by ' + t(g.k) + ' too.' });
            W = W.filter(function (w) { return !(near(w.is.m, qv(g.m)) && near(w.is.b, g.b)); });
            var p = B.line('(' + L + ') Rearrange ' + t(g.eq) + ' into ' + t('y=mx+b') + '.', { m: qv(g.m), b: g.b }, { form: 'slope-intercept', wrong: W, keyTex: siT(g.m, g.b) }, g.sol, ['Get ' + t('y') + ' alone: move the ' + t('x') + '-term (its sign changes), then divide <b>every</b> term by the coefficient of ' + t('y') + '.'], 'EP4' + L + ' rearrange');
            p.answer = t(siT(g.m, g.b)); p.bad = W.map(function (w) { return siT(LN.toFr(w.is.m), w.is.b); });
            return p;
          } });
          out.push({ id: 'e4' + L + '2', sub: L + ' ii', level: lev, make: function (r, sh) { var g = sh[L]; return graphMB('Graph ' + t(g.eq) + '.', g.m, g.b, 'In slope–intercept form: ' + t(siT(g.m, g.b)) + '. ' + mbSol(g.m, g.b), ['Rearrange into ' + t('y=mx+b') + ' first (part i).', 'Plot ' + t('(0,\\ b)') + ', then step out the slope.'], 'EP4' + L + ' graph'); } });
        });
        return out;
      })(), shared: function (r) { var o = {}; ['a', 'b', 'c', 'd'].forEach(function (L) { o[L] = ({
          a: function () { var k = r.pick([2, 3]), q = intLine(r, [2, 3, -2, 4], [-4, 3]); return { eq: k + 'y=' + lin([[k * q.m, 'x'], [k * q.b, '']]), m: q.m, b: q.b, k: k, sol: 'Divide every term by ' + t(k) + ': ' + t(siT(q.m, q.b)) + '.' }; },
          b: function () { var q = intLine(r, [-3, -2, -4, -1], [1, 6]); return { eq: lin([[-q.m, 'x'], [1, 'y']]) + '=' + q.b, m: q.m, b: q.b, k: 1, sol: 'Subtract ' + t(term(-q.m, 'x', true)) + ' from both sides: ' + t(siT(q.m, q.b)) + '.' }; },
          c: function () { var q = fracLine(r, [[-3, 4], [-1, 2], [-2, 3], [-1, 4]], [-2, 4]), f = Q(q.m); return { eq: axbyc(-f[0], f[1], f[1] * q.b), m: q.m, b: q.b, k: f[1], sol: 'Subtract ' + t(term(-f[0], 'x', true)) + ': ' + t(f[1] + 'y=' + lin([[f[0], 'x'], [f[1] * q.b, '']])) + '. Divide every term by ' + t(f[1]) + ': ' + t(siT(q.m, q.b)) + '.' }; },
          d: function () { var q = fracLine(r, [[1, 2], [1, 3], [1, 4], [3, 2], [2, 3]], [-5, -1]), f = Q(q.m); return { eq: axbyc(f[0], -f[1], -f[1] * q.b), m: q.m, b: q.b, k: -f[1], sol: 'Subtract ' + t(term(f[0], 'x', true)) + ': ' + t('-' + f[1] + 'y=' + lin([[-f[0], 'x'], [-f[1] * q.b, '']])) + '. Divide every term by ' + t('-' + f[1]) + ': ' + t(siT(q.m, q.b)) + '.' }; } })[L](); }); return o; } },
      /* ================= Part C ================= */
      { num: '5', section: 'Extra practice C — Horizontal and Vertical Lines', stem: 'Graph each line, then fill in all three boxes. Use <b>none</b> or <b>undef.</b> (undefined) where that is the correct answer.', shared: function (r) { return { h: r.pick(nz(-6, 6)), v: r.pick(nz(-6, 6)) }; }, parts: [
        { id: 'e5a', sub: 'a i', level: 'BEG', make: function (r, s) { var key = lineV([-5, s.h], [5, s.h]); return B.graph('(a) Graph ' + t('y=' + s.h) + '.' + PADHELP, padI(), exactChk(key, [{ is: lineV([s.h, -5], [s.h, 5]), code: 'gr-vh', hint: 'That’s the vertical line ' + t('x=' + s.h) + '. On ' + t('y=' + s.h) + ' every point has ' + t('y') + '-value ' + t(s.h) + ': a <b>horizontal</b> line.' }, { is: lineV([-5, -s.h], [5, -s.h]), code: 'gr-b-sign', hint: 'Check its height: ' + t('y=' + s.h) + '.' }]), key, 'Every point has ' + t('y=' + s.h) + ': the horizontal line through ' + t(ptT([0, s.h])) + '.', ['Every point on the line has the same ' + t('y') + '-value.'], 'EP5a graph'); } },
        { id: 'e5a2', sub: 'a ii', level: 'EMG', make: function (r, s) { return hvPart('(a) ' + t('y=' + s.h), 0, s.h, 'none', 'horizontal (' + t('y=' + s.h) + ')', 'Slope ' + t('0') + ' (no rise), ' + t('y') + '-intercept ' + t(s.h) + ', ' + t('x') + '-intercept <b>none</b>: the line runs parallel to the ' + t('x') + '-axis and never meets it.'); } },
        { id: 'e5b', sub: 'b i', level: 'BEG', make: function (r, s) { var key = lineV([s.v, -5], [s.v, 5]); return B.graph('(b) Graph ' + t('x=' + s.v) + '.' + PADHELP, padI(), exactChk(key, [{ is: lineV([-5, s.v], [5, s.v]), code: 'gr-vh', hint: 'That’s the horizontal line ' + t('y=' + s.v) + '. On ' + t('x=' + s.v) + ' every point has ' + t('x') + '-value ' + t(s.v) + ': a <b>vertical</b> line.' }, { is: lineV([-s.v, -5], [-s.v, 5]), code: 'gr-b-sign', hint: 'Check where it crosses the ' + t('x') + '-axis: ' + t('x=' + s.v) + '.' }]), key, 'Every point has ' + t('x=' + s.v) + ': the vertical line through ' + t(ptT([s.v, 0])) + '.', ['Every point on the line has the same ' + t('x') + '-value.'], 'EP5b graph'); } },
        { id: 'e5b2', sub: 'b ii', level: 'EMG', make: function (r, s) { return hvPart('(b) ' + t('x=' + s.v), 'und', 'none', s.v, 'vertical (' + t('x=' + s.v) + ')', 'Slope <b>undefined</b> (the run is ' + t('0') + '), ' + t('y') + '-intercept <b>none</b> (it runs parallel to the ' + t('y') + '-axis), ' + t('x') + '-intercept ' + t(s.v) + '.'); } }] },
      { num: '6', shared: function (r) { return { h: r.pick(nz(-6, 6)), v: r.pick(nz(-6, 6)) }; }, parts: [
        { id: 'e6', level: 'EMG', make: function (r, s) {
          return mc(r, 'Of the lines ' + t('y=' + s.h) + ' and ' + t('x=' + s.v) + ', one can be written in the form ' + t('y=mx+b') + ' and the other cannot. Which statement is correct?', [
            { html: t('y=' + s.h) + ' can: it is ' + t('y=0x' + (s.h < 0 ? '' : '+') + s.h) + '. ' + t('x=' + s.v) + ' cannot: it pairs the single input ' + t(s.v) + ' with every ' + t('y') + ', and its slope is undefined (run ' + t('0') + '), so there is no number ' + t('m') + ' to write.', right: true },
            { html: t('x=' + s.v) + ' can: it is ' + t('y=' + s.v + 'x') + '.', why: t('y=' + s.v + 'x') + ' is a slanted line through the origin, not the vertical line ' + t('x=' + s.v) + '.' },
            { html: 'Neither can, because neither has an ' + t('x') + '-term.', why: t('y=' + s.h) + ' is ' + t('y=0x' + (s.h < 0 ? '' : '+') + s.h) + ': the ' + t('x') + '-term is just ' + t('0x') + '.' },
            { html: 'Both can: every line has a slope and a ' + t('y') + '-intercept.', why: 'A vertical line has no ' + t('y') + '-intercept and an undefined slope.' }],
            t('y=' + s.h) + ' = ' + t('y=0x' + (s.h < 0 ? '' : '+') + s.h) + ' (' + t('m=0') + ', ' + t('b=' + s.h) + '). ' + t('x=' + s.v) + ' has an undefined slope and no ' + t('y') + '-intercept, so it can’t be written as ' + t('y=mx+b') + '.', ['Try to write each one as ' + t('y=mx+b') + '. What would ' + t('m') + ' be?'], 'EP6 which can');
        } }] },
      { num: '7', stem: 'For each equation, state the slope and whether it can be written in the form ' + t('y=mx+b') + '.', parts: [
        { id: 'e7', level: 'EMG', make: function (r) {
          var dec = r.pick(['3.5', '-2.5', '1.5', '-4.5', '0.5', '5.5']), kind = r.shuffle(['x0', 'y0', 'xd', r.pick(['yk', 'yd'])]).slice(0, 3);
          var yk = r.pick(nz(-6, 6));
          var D = { x0: { tex: 'x=0', note: ' (the ' + t('y') + '-axis)', w: 'un' }, y0: { tex: 'y=0', note: ' (the ' + t('x') + '-axis)', w: 'zy' }, xd: { tex: 'x=' + dec, note: '', w: 'un' }, yk: { tex: 'y=' + yk, note: '', w: 'zy' }, yd: { tex: 'y=' + dec, note: '', w: 'zy' } };
          var ids = ['a', 'b', 'c'], want = {}, rows = kind.map(function (k, i) { want[ids[i]] = D[k].w; return { id: ids[i], html: '(' + ids[i] + ') ' + t(D[k].tex) + D[k].note }; });
          var cols = [{ id: 'zy', html: 'Slope 0 — yes' }, { id: 'zn', html: 'Slope 0 — no' }, { id: 'uy', html: 'Undefined — yes' }, { id: 'un', html: 'Undefined — no' }];
          return B.grid('Choose the slope and yes/no for each.', rows, cols, want, { why: function (row, given) { var k = kind[ids.indexOf(row)], vert = D[k].w === 'un'; return { code: given && given.charAt(0) !== D[k].w.charAt(0) ? 'u7l3-hv-slope' : 'u7l3-hv-form', hint: '(' + row + ') ' + t(D[k].tex) + ' is a ' + (vert ? '<b>vertical</b> line: run ' + t('0') + ', slope undefined, and it can’t be written as ' + t('y=mx+b') + '.' : '<b>horizontal</b> line: slope ' + t('0') + ', and it is ' + t('y=0x+b') + ' — yes.') }; } },
            kind.map(function (k, i) { var vert = D[k].w === 'un'; return '(' + ids[i] + ') ' + t(D[k].tex) + ': ' + (vert ? 'vertical — slope undefined; <b>no</b>.' : 'horizontal — slope ' + t('0') + '; <b>yes</b>, ' + t('y=0x' + (D[k].tex.slice(2).charAt(0) === '-' ? '' : '+') + D[k].tex.slice(2)) + '.'); }).join('<br>'),
            [t('x=k') + ' is vertical; ' + t('y=k') + ' is horizontal.', 'Only a line with a number slope can be written as ' + t('y=mx+b') + '.'], 'EP7 slope yes/no');
        } }] },
      /* ================= Part D ================= */
      { num: '8', section: 'Extra practice D — Reading the Equation Off a Graph', stem: 'Each line passes through the two marked lattice points. Read the slope and the ' + t('y') + '-intercept from the graph, then write the equation in ' + t('y=mx+b') + ' form.', parts: (function () {
        var lists = { a: [[[2, 3], [1, 2], [1, 3], [3, 4]], [-4, 1]], b: [[[-3, 4], [-2, 3], [-1, 2], [-3, 5]], [1, 5]], c: [[[5, 2], [3, 2], [4, 3], [5, 3]], [-5, -1]], d: [[[-2, 3], [-1, 3], [-4, 3], [-5, 2]], [0, 4]] };
        return ['a', 'b', 'c', 'd'].map(function (L) {
          return { id: 'e8' + L, sub: L, level: L === 'a' || L === 'c' ? 'EMG' : 'PRG', make: function (r) {
            var o = fracLine(r, lists[L][0], lists[L][1]), q = Q(o.m), P2 = [q[1], o.b + q[0]];
            var f = [slopeField('eq'), yField('eq'), { label: 'Equation', name: 'equation', mode: 'math', keys: 'eq', placeholder: 'e.g. y = 2x + 3' }];
            var W = [{ is: { m: q[1] / q[0], b: o.b }, code: 'line-slope-flip', hint: 'Slope is rise over run: count the up/down change, then divide by the change to the right.' }, { is: { m: -qv(o.m), b: o.b }, code: 'line-slope-sign', hint: 'Does the line rise or fall from left to right?' }];
            var p = B.fields('(' + L + ')' + lineFig(o.m, o.b, { points: [[0, o.b], P2] }), f,
              [slopeC(o.m, [[[q[1], q[0]], 'slope-flip', 'Rise over run: the up/down change goes on top.'], [o.b, 'mb-swap', 'That’s where the line crosses the ' + t('y') + '-axis.']]), valC(o.b, [[qv(o.m), 'mb-swap', 'That’s the slope.']]), K.line({ m: qv(o.m), b: o.b }, { form: 'slope-intercept', wrong: W })],
              [qT(o.m), String(o.b), siT(o.m, o.b)], t('m=' + qT(o.m)) + ', ' + t('b=' + o.b) + ', ' + t(siT(o.m, o.b)),
              'From ' + t(ptT([0, o.b])) + ' to ' + t(ptT(P2)) + ': rise ' + t(q[0]) + ', run ' + t(q[1]) + ', so ' + t('m=' + qT(o.m)) + '. The line crosses the ' + t('y') + '-axis at ' + t(ptT([0, o.b])) + ': ' + t('b=' + o.b) + '. Equation: ' + t(siT(o.m, o.b)) + '.',
              ['Count from the marked point on the ' + t('y') + '-axis to the other marked point: up/down is the rise, right is the run.', t('b') + ' is where the line crosses the ' + t('y') + '-axis.'], 'EP8' + L);
            p.bad = [[qT([q[1], q[0]]), String(o.b), siT(LN.toFr(q[1] / q[0]), o.b)]];
            return p;
          } };
        });
      })() },
      { num: '9', shared: function (r) {
          return pickWhere(function () { var m = r.pick([[3, 4], [2, 3], [1, 2], [3, 2], [-3, 4], [-1, 2], [-2, 3]]), q = Q(m), k1 = r.pick([1, 2]), b = r.int(-3, 2); return { m: m, b: b, A: [-q[1] * k1, b - q[0] * k1], Bp: [q[1], b + q[0]] }; },
            function (o) { var q = Q(o.m); return [o.A, o.Bp].every(function (p) { return Math.abs(p[0]) <= 6 && Math.abs(p[1]) <= 6; }) && o.A[0] !== 0 && Math.abs(o.Bp[0] - o.A[0]) >= 3 && o.b !== 0; });
        },
        stem: function (s) { return 'The graph shows a single line through the two marked points.' + lineFig(s.m, s.b, { points: [s.A, s.Bp] }); }, parts: [
        { id: 'e9a', sub: 'a', level: 'EMG', make: function (r, s) {
          var dy = s.Bp[1] - s.A[1], dx = s.Bp[0] - s.A[0];
          var p = B.math('(a) Determine the slope by counting rise over run between the two marked points.', slopeC(s.m, [[[dx, dy], 'slope-flip', 'Rise over run: the up/down change goes on top.'], [dy, 'dy-only', 'Divide the rise by the run (' + t(dx) + ').']]), qT(s.m),
            'From ' + t(ptT(s.A)) + ' to ' + t(ptT(s.Bp)) + ': rise ' + t(dy) + ', run ' + t(dx) + ', so ' + t('m=\\frac{' + dy + '}{' + dx + '}=' + qT(s.m)) + '.', ['Count the change in ' + t('y') + ' (rise) and the change in ' + t('x') + ' (run) from one marked point to the other.'], 'EP9a', { keys: 'fraction', before: t('m=') });
          p.bad = [qT(Q(dx, dy))];
          return p;
        } },
        { id: 'e9b', sub: 'b', level: 'EMG', make: function (r, s) { return ptPart('(b) State the ' + t('y') + '-intercept as an ordered pair.', [0, s.b], { wrong: [{ is: [s.b, 0], code: 'pt-swap', hint: 'On the ' + t('y') + '-axis, ' + t('x=0') + ': ' + t('(0,\\ b)') + '.' }] }, 'The line crosses the ' + t('y') + '-axis at ' + t(ptT([0, s.b])) + '.', ['Where does the line cross the vertical axis?'], 'EP9b'); } },
        { id: 'e9c', sub: 'c', level: 'PRG', outcome: 'RF7', make: function (r, s) { var p = B.line('(c) Write the equation of the line.', { m: qv(s.m), b: s.b }, { form: 'slope-intercept', keyTex: siT(s.m, s.b) }, 'Slope ' + t(qT(s.m)) + ', ' + t('y') + '-intercept ' + t(s.b) + ': ' + t(siT(s.m, s.b)) + '.', ['Use your answers to (a) and (b) in ' + t('y=mx+b') + '.'], 'EP9c'); p.answer = t(siT(s.m, s.b)); return p; } },
        { id: 'e9d', sub: 'd', level: 'EMG', make: function (r, s) {
          var q = Q(s.m);
          var chk = function (resp) {
            var rr = LN.readPoint(resp);
            if (rr.empty) return form('empty', 'Type a point.');
            if (rr.bad || rr.kind !== 'pt') return form('pt-unreadable', 'Write the point as an ordered pair, e.g. ' + t('(8,\\ 4)') + '.');
            if (!rr.brackets && !rr.named) return form('pt-brackets', 'Write the point in brackets.');
            var x = rr.p[0].v, y = rr.p[1].v;
            if ((near(x, s.A[0]) && near(y, s.A[1])) || (near(x, s.Bp[0]) && near(y, s.Bp[1]))) return wrong('u7l3-pt-icpt', 'That is one of the marked points. Give a different one.');
            if (near(y, qv(s.m) * x + s.b)) return ok();
            return wrong('u7l3-pt-off', 'That point isn’t on the line. Start at a point you know and step ' + stepT(s.m) + '.');
          };
          var keyP = pickWhere(function () { var k = r.pick([2, -2, 3, -1, 0]); return [k * q[1], s.b + k * q[0]]; }, function (P) { return !(P[0] === s.A[0] && P[1] === s.A[1]) && !(P[0] === s.Bp[0] && P[1] === s.Bp[1]); });
          var p = B.math('(d) Give the coordinates of a third point on the line, different from the two marked ones.', chk, ptT(keyP), 'For example ' + t(ptT(keyP)) + ': from a marked point, step ' + stepT(s.m) + ' (or the reverse). Any point that satisfies ' + t(siT(s.m, s.b)) + ' works.', ['From a marked point, step out the slope again.'], 'EP9d', { keys: 'pairs', placeholder: 'e.g. (8, 4)' });
          p.bad = ['(' + s.A[0] + ', ' + s.A[1] + ')', '(' + s.Bp[0] + ', ' + (s.Bp[1] + 1) + ')'];
          return p;
        } },
        { id: 'e9e', sub: 'e', level: 'PRG', make: function (r, s) {
          var q = Q(s.m), X1 = 2 * q[1] * (s.A[0] < 0 ? 1 : 1), P1 = pickWhere(function () { var x = r.pick([4, 5, 6, 8, -4, -6]); return [x, Math.round(qv(s.m) * x + s.b) + (r.chance(0.5) ? 1 : 0)]; }, function (P) { return !near(P[1], qv(s.m) * P[0] + s.b); }), P2 = [X1 * r.pick([1, -1]), 0];
          P2[1] = qv(s.m) * P2[0] + s.b;
          var pts = r.shuffle([P1, P2]), ids = ['p1', 'p2'], want = {};
          pts.forEach(function (P, i) { want[ids[i]] = near(P[1], qv(s.m) * P[0] + s.b) ? 'y' : 'n'; });
          return B.grid('(e) Decide whether each point lies on the line ' + t(siT(s.m, s.b)) + '.', pts.map(function (P, i) { return { id: ids[i], html: t(ptT(P)) }; }), [{ id: 'y', html: 'On the line' }, { id: 'n', html: 'Not on it' }], want,
            { why: function (row) { var P = pts[ids.indexOf(row)]; return { code: 'u7l3-pt-off', hint: 'Substitute ' + t('x=' + P[0]) + ': ' + t(qT(s.m) + '(' + P[0] + ')' + (s.b < 0 ? '' : '+') + s.b) + '. Is it ' + t(P[1]) + '?' }; } },
            pts.map(function (P) { var v = qv(s.m) * P[0] + s.b; return t(ptT(P)) + ': ' + t(qT(s.m) + '(' + P[0] + ')' + (s.b < 0 ? '' : '+') + s.b + '=' + qT(Q(Math.round(v * 12), 12))) + (near(v, P[1]) ? ' ✓ on the line' : t('\\ne ' + P[1]) + ' — not on it'); }).join('<br>'), ['Substitute each ' + t('x') + ' into the equation from (c) and compare.'], 'EP9e on/off');
        } }] },
      /* ================= Part E ================= */
      { num: '10', section: 'Extra practice E — Error Analysis', shared: function (r) { return pickWhere(function () { return { m: r.pick([[2, 3], [1, 4], [3, 5], [2, 5], [1, 3], [3, 4]]), b: r.int(-3, 3) }; }, function (o) { return true; }); },
        stem: function (s) { var q = Q(s.m); return 'Marcus graphs ' + t(siT(s.m, s.b)) + '. He plots ' + t(ptT([0, s.b])) + ' correctly, then moves <i>right ' + q[0] + ' and up ' + q[1] + '</i> and plots ' + t(ptT([q[0], s.b + q[1]])) + '.'; }, parts: [
        { id: 'e10a', sub: 'a', level: 'EMG', make: function (r, s) {
          var q = Q(s.m);
          return mc(r, '(a) What is Marcus’s mistake?', [
            { html: 'He used the numerator as the run. In ' + t('\\frac{\\text{rise}}{\\text{run}}') + ' the top number is the rise, so ' + t(qT(s.m)) + ' means right ' + q[1] + ', up ' + q[0] + '.', right: true },
            { html: 'He should have moved left instead of right.', why: 'Right is fine for a positive slope. Look at which number he used for the run.' },
            { html: 'He started at the wrong point.', why: 'He started correctly at ' + t(ptT([0, s.b])) + '.' },
            { html: 'He should have moved down instead of up.', why: 'The slope is positive, so up is right. The problem is which number is the rise.' }],
            'Rise over run: ' + t(qT(s.m)) + ' = up ' + q[0] + ', right ' + q[1] + '. Marcus swapped them.', ['Which number in the slope is the rise?'], 'EP10a');
        } },
        { id: 'e10b', sub: 'b', level: 'EMG', make: function (r, s) { var q = Q(s.m), wrongM = [q[1], q[0]]; var p = B.math('(b) What is the slope of the line Marcus actually drew?', slopeC(wrongM, [[s.m, 'slope-flip', 'That’s the slope he <i>meant</i>. His move was up ' + q[1] + ' for right ' + q[0] + '.']]), qT(wrongM), 'He moved up ' + q[1] + ' for every ' + q[0] + ' right: slope ' + t('\\frac{' + q[1] + '}{' + q[0] + '}') + ' — too steep.', ['Slope = his rise ÷ his run.'], 'EP10b', { keys: 'fraction', before: t('m=') }); p.bad = [qT(s.m)]; return p; } },
        { id: 'e10c', sub: 'c', level: 'EMG', make: function (r, s) { var q = Q(s.m); return ptPart('(c) Give the correct second point.', [q[1], s.b + q[0]], { wrong: [{ is: [q[0], s.b + q[1]], code: 'u7l3-pt-flip', hint: 'That is Marcus’s point. Run ' + q[1] + ', rise ' + q[0] + '.' }] }, 'From ' + t(ptT([0, s.b])) + ': right ' + q[1] + ', up ' + q[0] + ' → ' + t(ptT([q[1], s.b + q[0]])) + '.', ['Right by the bottom number, up by the top number.'], 'EP10c'); } }] },
      { num: '11', shared: function (r) { return { m: r.pick([[-2, 5], [-3, 4], [-1, 3], [-2, 3], [-3, 5], [-1, 4]]), b: r.int(1, 4) }; },
        stem: function (s) { var q = Q(s.m); return 'Priya graphs ' + t(siT(s.m, s.b)) + '. She plots ' + t(ptT([0, s.b])) + ', then moves <i>right ' + q[1] + ' and up ' + (-q[0]) + '</i> and plots ' + t(ptT([q[1], s.b - q[0]])) + '.'; }, parts: [
        { id: 'e11a', sub: 'a', level: 'EMG', make: function (r, s) {
          return mc(r, '(a) What is Priya’s mistake?', [
            { html: 'A negative slope falls to the right: after moving right she must move <b>down</b>, not up.', right: true },
            { html: 'She should have moved right ' + (-Q(s.m)[0]) + ' and up ' + Q(s.m)[1] + '.', why: 'The run is the bottom number. The problem is the direction of the rise.' },
            { html: 'She started at the wrong point.', why: 'She started correctly at ' + t(ptT([0, s.b])) + '.' },
            { html: 'Nothing — the minus sign can be ignored when graphing.', why: 'The sign tells you whether to go up or down.' }],
            t(qT(s.m) + '=\\frac{' + Q(s.m)[0] + '}{' + Q(s.m)[1] + '}') + ': right ' + Q(s.m)[1] + ', <b>down</b> ' + (-Q(s.m)[0]) + '.', ['What does the minus sign in the slope tell you?'], 'EP11a');
        } },
        { id: 'e11b', sub: 'b', level: 'EMG', make: function (r, s) { var q = Q(s.m); return ptPart('(b) Give the point she should have reached by moving right ' + q[1] + '.', [q[1], s.b + q[0]], { wrong: [{ is: [q[1], s.b - q[0]], code: 'u7l3-pt-sign', hint: 'That is Priya’s point. Go <b>down</b> ' + (-q[0]) + '.' }] }, 'Right ' + q[1] + ', down ' + (-q[0]) + ': ' + t(ptT([q[1], s.b + q[0]])) + '. Check: ' + t(qT(s.m) + '(' + q[1] + ')+' + s.b + '=' + (s.b + q[0])) + '.', ['Negative slope: right, then down.'], 'EP11b'); } },
        { id: 'e11c', sub: 'c', level: 'PRG', make: function (r, s) { var q = Q(s.m); return ptPart('(c) Give a second correct point found by moving <b>left</b> instead.', [-q[1], s.b - q[0]], { wrong: [{ is: [-q[1], s.b + q[0]], code: 'u7l3-pt-sign', hint: 'Moving left on a falling line takes you <b>up</b>.' }, { is: [q[1], s.b + q[0]], code: 'u7l3-dir', hint: 'That point is to the right. Move left ' + q[1] + '.' }] }, 'Left ' + q[1] + ', up ' + (-q[0]) + ' (the slope as ' + t('\\frac{' + (-q[0]) + '}{-' + q[1] + '}') + '): ' + t(ptT([-q[1], s.b - q[0]])) + '.', ['Moving left reverses both directions: left and up.'], 'EP11c'); } }] },
      /* ================= Part F ================= */
      { num: '12', section: 'Extra practice F — Working Backwards: The Point Is Not the Intercept', stem: 'You are given <b>one point on the line</b> (not the ' + t('y') + '-intercept) and the slope. Plot the point, step out the slope to more points, draw the line, and write its equation in ' + t('y=mx+b') + ' form.',
        shared: function (r) {
          function gen(list, okb) { return pickWhere(function () { var m = r.pick(list), q = Q(m), k = r.pick([-2, -1, 1, 2]), b = r.int(-4, 4); return { m: m, b: b, P: [k * q[1], b + k * q[0]] }; }, function (o) { return o.P[0] !== 0 && Math.abs(o.P[0]) <= 5 && Math.abs(o.P[1]) <= 5 && latticeCount(o.m, o.b, [-6, 6], [-6, 6]) >= 2 && okb(o); }); }
          return { a: gen([[1, 2], [1, 3], [2, 3]], function () { return true; }), b: gen([[-2, 3], [-1, 2], [-3, 4]], function () { return true; }), c: gen([[5, 4], [3, 2], [4, 3]], function (o) { return Math.abs(o.P[0]) >= 2; }), d: (function () { var y0 = r.pick(nz(-5, 5)), x0 = r.pick(nz(-5, 5)); return { m: 0, b: y0, P: [x0, y0] }; })() };
        }, parts: [].concat.apply([], ['a', 'b', 'c', 'd'].map(function (L) {
          return [{ id: 'e12' + L, sub: L + ' i', level: L === 'd' ? 'EMG' : 'PRG', make: function (r, sh) {
            var o = sh[L], key = keyLine(o.m, o.b), Wd = o.m === 0 ? [{ is: lineV([o.P[0], -5], [o.P[0], 5]), code: 'gr-vh', hint: 'A slope of ' + t('0') + ' is a <b>horizontal</b> line.' }] : [{ is: lineThroughSlope(o.P, [-Q(o.m)[0], Q(o.m)[1]]), code: 'gr-sign', hint: 'Check the direction of the slope.' }, { is: lineThroughSlope(o.P, [Q(o.m)[1], Q(o.m)[0]]), code: 'gr-flip', hint: 'Rise over run: the top number is the rise.' }, { is: lineThroughSlope([0, o.P[1]], o.m), code: 'gr-icpt', hint: 'Start at the given point ' + t(ptT(o.P)) + ', not on the ' + t('y') + '-axis.' }];
            var p = B.graph('(' + L + ') Through ' + t(ptT(o.P)) + ' with ' + t('m=' + qT(o.m)) + ': draw the line.' + PADHELP, padI(), exactChk(key, Wd.filter(function (w) { return !DR.same(w.is, key); }), { m: qv(o.m), b: o.b, mq: o.m }), key,
              o.m === 0 ? 'Slope ' + t('0') + ': a horizontal line through ' + t(ptT(o.P)) + '.' : 'Plot ' + t(ptT(o.P)) + '. Step ' + stepT(o.m) + ' (or the reverse) to more points, e.g. ' + t(ptT([o.P[0] + Q(o.m)[1], o.P[1] + Q(o.m)[0]])) + ', and draw the line.', ['Plot the given point first, then step out the slope from it.'], 'EP12' + L + ' graph');
            p.bad = Wd.map(function (w) { return w.is; }).filter(function (w) { return !DR.same(w, key); });
            return p;
          } }, { id: 'e12' + L + '2', sub: L + ' ii', level: L === 'd' ? 'PRG' : 'ADV', outcome: 'RF7', make: function (r, sh) {
            var o = sh[L], q = Q(o.m), k = o.m === 0 ? 0 : -o.P[0] / q[1];
            var W = o.m === 0 ? [{ is: { x: o.P[0] }, code: 'line-vh', hint: 'Slope ' + t('0') + ': horizontal, ' + t('y=k') + '.' }] : [{ is: { m: qv(o.m), b: o.P[1] }, code: 'line-intercept', hint: t(o.P[1]) + ' is the ' + t('y') + '-coordinate of the given point, not the ' + t('y') + '-intercept. Step along the line to ' + t('x=0') + '.' }];
            var p = B.line('Write the equation of line (' + L + ') — through ' + t(ptT(o.P)) + ' with ' + t('m=' + qT(o.m)) + ' — in ' + t('y=mx+b') + ' form.', o.m === 0 ? { y: o.b } : { m: qv(o.m), b: o.b }, { form: 'slope-intercept', keyTex: o.m === 0 ? 'y=' + o.b : siT(o.m, o.b), wrong: W },
              o.m === 0 ? 'Horizontal through ' + t(ptT(o.P)) + ': ' + t('y=' + o.b) + '.' : 'From ' + t(ptT(o.P)) + ', step ' + (k > 0 ? stepT(o.m) : 'the reverse way (left ' + t(q[1]) + ', ' + (q[0] > 0 ? 'down ' : 'up ') + t(Math.abs(q[0])) + ')') + (Math.abs(k) > 1 ? ' ' + t(Math.abs(k)) + ' times' : '') + ' to reach the ' + t('y') + '-axis at ' + t(ptT([0, o.b])) + '. So ' + t(siT(o.m, o.b)) + '.',
              ['Step along the line from the given point until you reach the ' + t('y') + '-axis: that is ' + t('b') + '.'], 'EP12' + L + ' equation');
            p.answer = t(o.m === 0 ? 'y=' + o.b : siT(o.m, o.b));
            return p;
          } }];
        })) },
      /* ================= Part G ================= */
      { num: '13', section: 'Extra practice G — Reasoning, Stretch, and Multiple Choice', parts: [
        { id: 'e13', level: 'PRG', make: function (r) {
          var o = pickWhere(function () { var m = r.pick([[-2, 3], [-3, 4], [1, 2], [-1, 3], [2, 3], [3, 2]]), q = Q(m), k = r.pick([2, 3, -2]), b = r.int(-3, 5); return { m: m, b: b, x: k * q[1], d: r.pick([-2, -1, 1, 2, 0]) }; }, function (o) { return Math.abs(o.x) <= 9; });
          var yl = qv(o.m) * o.x + o.b, P = [o.x, yl + o.d], rel = o.d > 0 ? 'above' : o.d < 0 ? 'below' : 'on';
          var calc = t(qT(o.m) + '(' + o.x + ')' + (o.b < 0 ? '' : '+') + o.b + '=' + yl);
          return mc(r, 'Without graphing, does the point ' + t(ptT(P)) + ' lie <b>above</b>, <b>below</b>, or <b>on</b> the line ' + t(siT(o.m, o.b)) + '?', [
            { html: '<b>Above</b>: at ' + t('x=' + o.x) + ' the line has ' + t('y=' + yl) + (rel === 'above' ? ', and ' + t(P[1] + '>' + yl) : '') + '.', right: rel === 'above', code: 'u7l3-side', why: rel === 'above' ? null : 'At ' + t('x=' + o.x) + ' the line has ' + calc + '. Compare ' + t(P[1]) + ' with ' + t(yl) + '.' },
            { html: '<b>Below</b>: at ' + t('x=' + o.x) + ' the line has ' + t('y=' + yl) + (rel === 'below' ? ', and ' + t(P[1] + '<' + yl) : '') + '.', right: rel === 'below', code: 'u7l3-side', why: rel === 'below' ? null : 'At ' + t('x=' + o.x) + ' the line has ' + calc + '. Compare ' + t(P[1]) + ' with ' + t(yl) + '.' },
            { html: '<b>On</b>: ' + calc + (rel === 'on' ? ', the same as the point’s ' + t('y') + '.' : '.'), right: rel === 'on', code: 'u7l3-side', why: rel === 'on' ? null : calc + ', but the point has ' + t('y=' + P[1]) + '.' },
            { html: 'It can’t be decided without a graph.', code: 'u7l3-side', why: 'Substitute ' + t('x=' + o.x) + ': the line’s ' + t('y') + '-value there decides it.' }],
            'At ' + t('x=' + o.x) + ': ' + calc + '. The point has ' + t('y=' + P[1]) + (rel === 'on' ? ': the same, so it is <b>on</b> the line.' : rel === 'above' ? ', greater, so it lies <b>above</b> the line.' : ', smaller, so it lies <b>below</b> the line.'), ['Find the line’s ' + t('y') + '-value at the point’s ' + t('x') + ', then compare.'], 'EP13 above/below', true);
        } }] },
      { num: '14', parts: [
        { id: 'e14', level: 'EMG', make: function (r) {
          var o = r.pick([[2, 5], [3, 4], [1, 3], [2, 3], [3, 5], [1, 4]]), b = r.int(-3, 3), k = r.pick([2, 3]), X = k * o[1], Y = b + k * o[0];
          return mc(r, 'A line has slope ' + t('\\frac{' + o[0] + '}{' + o[1] + '}') + ' and ' + t('y') + '-intercept ' + t(b) + '. The grid only reaches ' + t('x=6') + '. How do you know ' + t(ptT([X, Y])) + ' is on this line without extending the grid?', [
            { html: 'From ' + t(ptT([0, b])) + ', each step of right ' + o[1] + ', up ' + o[0] + ' stays on the line: ' + (k === 2 ? t(ptT([o[1], b + o[0]])) + ', then ' + t(ptT([X, Y])) : t(ptT([o[1], b + o[0]])) + ', ' + t(ptT([2 * o[1], b + 2 * o[0]])) + ', then ' + t(ptT([X, Y]))) + '. ' + k + ' steps land exactly on it.', right: true },
            { html: 'Because ' + t(X) + ' and ' + t(Y) + ' are both multiples of the slope’s numbers.', why: 'That isn’t enough — count steps from the ' + t('y') + '-intercept.' },
            { html: 'You can’t know without extending the grid.', why: 'Repeated rise-over-run steps reach it: ' + k + ' steps of right ' + o[1] + ', up ' + o[0] + '.' },
            { html: 'Because the line rises, so every point to the right is on it.', why: 'Only points that fit the slope are on the line.' }],
            k + ' steps of right ' + o[1] + ', up ' + o[0] + ' from ' + t(ptT([0, b])) + ' reach ' + t(ptT([X, Y])) + '. Check: ' + t('\\frac{' + o[0] + '}{' + o[1] + '}(' + X + ')' + (b < 0 ? '' : '+') + b + '=' + Y) + '.', ['Count how many slope-steps take you from ' + t('x=0') + ' to ' + t('x=' + X) + '.'], 'EP14 steps');
        } }] },
      { num: '15', stem: '<b>Stretch.</b> Graph both lines on the same grid. Read the point of intersection, then confirm it algebraically by setting the two expressions for ' + t('y') + ' equal and solving.',
        shared: function (r) {
          function gen(ma, mb) { return pickWhere(function () { var X = r.int(-3, 4), Y = r.int(-3, 4), m1 = r.pick(ma), m2 = r.pick(mb); var b1 = Y - qv(m1) * X, b2 = Y - qv(m2) * X; return { X: X, Y: Y, L1: { m: m1, b: b1 }, L2: { m: m2, b: b2 } }; }, function (o) { return [o.L1, o.L2].every(function (L) { return Number.isInteger(L.b) && Math.abs(L.b) <= 5 && latticeCount(L.m, L.b, [-6, 6], [-6, 6]) >= 3; }) && o.X !== 0; }); }
          return { a: gen([2, 3, 1, -2], [[-1, 2], [1, 2], [-1, 3]]), b: gen([[1, 3], [2, 3], [1, 2]], [-1, -2, 2]) };
        }, parts: [].concat.apply([], ['a', 'b'].map(function (L) {
          return [{ id: 'e15' + L, sub: L + ' i', level: 'PRG', make: function (r, sh) {
            var o = sh[L], T = twoLinesChk(o.L1, o.L2);
            var p = B.graph('(' + L + ') Graph ' + t(siT(o.L1.m, o.L1.b)) + ' and ' + t(siT(o.L2.m, o.L2.b)) + ' on the same grid.' + PADHELP, padI(), T.check, T.key,
              t(siT(o.L1.m, o.L1.b)) + ': start at ' + t(ptT([0, o.L1.b])) + ', step ' + stepT(o.L1.m) + '. ' + t(siT(o.L2.m, o.L2.b)) + ': start at ' + t(ptT([0, o.L2.b])) + ', step ' + stepT(o.L2.m) + '. They cross at ' + t(ptT([o.X, o.Y])) + '.', ['Graph one line at a time: ' + t('(0,\\ b)') + ', then the slope.'], 'EP15' + L + ' graph both');
            p.bad = [keyLine(o.L1.m, o.L1.b)];
            return p;
          } }, { id: 'e15' + L + '2', sub: L + ' ii', level: L === 'a' ? 'ADV' : 'MAS', make: function (r, sh) {
            var o = sh[L], dm = Q(Math.round((qv(o.L1.m) - qv(o.L2.m)) * 12), 12), db = o.L2.b - o.L1.b;
            return ptPart('(' + L + ') State the point of intersection of ' + t(siT(o.L1.m, o.L1.b)) + ' and ' + t(siT(o.L2.m, o.L2.b)) + ', confirmed algebraically.', [o.X, o.Y], { wrong: [{ is: [o.Y, o.X], code: 'pt-swap', hint: 'The ' + t('x') + '-value comes first.' }, { is: [o.X, qv(o.L1.m) * o.X], code: 'u7l3-meet-y', hint: 'Right ' + t('x') + ' — substitute it into a full equation (with ' + t('b') + ').' }] },
              'Set the expressions equal: ' + t(lin([[o.L1.m, 'x'], [o.L1.b, '']]) + '=' + lin([[o.L2.m, 'x'], [o.L2.b, '']])) + '<br>' + t(term(dm, 'x', true) + '=' + db) + '<br>' + t('x=' + o.X) + ', and ' + t('y=' + qT(o.L1.m) + '(' + o.X + ')' + (o.L1.b < 0 ? '' : '+') + o.L1.b + '=' + o.Y) + '. The intersection is ' + t(ptT([o.X, o.Y])) + ', the point where the graphs cross.',
              ['Read the crossing point from your graph.', 'Confirm: set the two right sides equal, collect the ' + t('x') + '-terms (common denominators for fractions), solve for ' + t('x') + ', then find ' + t('y') + '.'], 'EP15' + L + ' intersection');
          } }];
        })) },
      { num: '16', parts: [
        { id: 'e16', level: 'EMG', make: function (r) {
          var m = r.pick([[2, 3], [3, 4], [1, 2], [2, 5], [1, 3], [3, 5]]), k = r.pick([2, 3]), b = r.int(-3, 3), big = [m[0] * k, m[1] * k];
          var P1 = [big[1], b + big[0]], P2 = [m[1], b + m[0]];
          return mc(r, '<b>Stretch.</b> Devon graphs ' + t('y=\\frac{' + big[0] + '}{' + big[1] + '}x' + (b < 0 ? '' : '+') + b) + ' by stepping right ' + big[1] + ' and up ' + big[0] + '. Elena first reduces the slope to ' + t('\\frac{' + m[0] + '}{' + m[1] + '}') + ' and steps right ' + m[1] + ' and up ' + m[0] + '. They land on different second points. Which statement is correct?', [
            { html: t('\\frac{' + big[0] + '}{' + big[1] + '}=\\frac{' + m[0] + '}{' + m[1] + '}') + ', so both use the same slope from the same intercept ' + t(ptT([0, b])) + ': Devon’s ' + t(ptT(P1)) + ' and Elena’s ' + t(ptT(P2)) + ' are on the same line. Elena’s smaller steps keep her point on the grid.', right: true },
            { html: 'Devon’s line is steeper because his numbers are bigger.', why: 'Bigger rise <b>and</b> bigger run: the ratio is the same, so the steepness is the same.' },
            { html: 'Only Elena is right: you must always reduce a slope before graphing.', why: 'Both are right. Reducing just gives smaller steps.' },
            { html: 'Their lines are parallel but different.', why: 'Same slope <b>and</b> same intercept: the same line.' }],
            t('\\frac{' + big[0] + '}{' + big[1] + '}=\\frac{' + m[0] + '}{' + m[1] + '}') + ': same slope, same start ' + t(ptT([0, b])) + ', so the same line (Devon’s point is two of Elena’s steps). Advantage of reducing: smaller steps stay on the grid and give more points.', ['Compare the two slopes as numbers.'], 'EP16 reduce');
        } }] },
      { num: '17', parts: [
        { id: 'e17', level: 'BEG', make: function (r) {
          var m = r.pick([[-5, 3], [-4, 3], [-5, 2], [-3, 2], [-7, 4], [-5, 4]]), b = r.int(-3, 4), p = -m[0], q = m[1];
          return mc(r, '<i>(Multiple Choice)</i> Starting at the ' + t('y') + '-intercept of ' + t(siT(m, b)) + ', which move lands on another point of the line?', [
            { html: 'Right ' + q + ', down ' + p, right: true }, { html: 'Right ' + q + ', up ' + p, why: 'The slope is negative: right, then down.' }, { html: 'Right ' + p + ', down ' + q, why: 'The top number is the rise: down ' + p + ', right ' + q + '.' }, { html: 'Left ' + p + ', up ' + q, why: 'Going left you’d go up ' + p + ' for left ' + q + ' — not this.' }],
            t(qT(m) + '=\\frac{-' + p + '}{' + q + '}') + ': right ' + q + ', down ' + p + '. Check: ' + t(qT(m) + '(' + q + ')' + (b < 0 ? '' : '+') + b + '=' + (b - p)) + '.', ['Rise over run, and the sign tells up or down.'], 'EP17 move');
        } }] },
      { num: '18', parts: [
        { id: 'e18', level: 'PRG', make: function (r) {
          var o = pickWhere(function () { var m = r.pick([[2, 3], [3, 4], [1, 2], [3, 2], [2, 5], [5, 3]]), j = r.int(2, 5), b = -r.int(1, 6); return { m: m, k: j * m[1], b: b }; }, function (o) { return qv(o.m) * o.k + o.b > 0 && o.k <= 20; });
          var Y = qv(o.m) * o.k + o.b;
          return B.nr('<i>(Numerical Response)</i> The line ' + t(siT(o.m, o.b)) + ' passes through the point ' + t('(k,\\ ' + Y + ')') + '. The value of ' + t('k') + ' is ____.', o.k, dl([[qv(o.m) * Y + o.b, 'sub-swap', t(Y) + ' is the ' + t('y') + '-coordinate: substitute it for ' + t('y') + '.'], [(Y - o.b) * qv(o.m), 'u7l3-pt-step', 'To undo “multiply by ' + t(qT(o.m)) + '”, multiply by its reciprocal ' + t('\\frac{' + o.m[1] + '}{' + o.m[0] + '}') + '.'], [Y - o.b, 'no-divide', 'You have ' + t(qT(o.m) + 'k=' + (Y - o.b)) + ' — now multiply by ' + t('\\frac{' + o.m[1] + '}{' + o.m[0] + '}') + '.']], o.k),
            t(Y + '=' + qT(o.m) + 'k' + (o.b < 0 ? '' : '+') + o.b) + '<br>' + t((Y - o.b) + '=' + qT(o.m) + 'k') + '<br>' + t('k=' + (Y - o.b) + '\\times\\frac{' + o.m[1] + '}{' + o.m[0] + '}=' + o.k) + '.', ['Substitute ' + t('y=' + Y) + ' and solve for ' + t('k') + '.', 'Undo the constant first, then multiply by the reciprocal of the slope.'], 'EP18 NR k');
        } }] }
    ]
  });

  /* slope written as a fraction rise/run */
  function fracPart(prompt, m, text) {
    var q = Q(m), key = '\\frac{' + q[0] + '}{' + q[1] + '}';
    var p = B.math(prompt, riseRunC(m, null), key, t('m=' + qT(m) + '=' + key) + ': rise ' + t(q[0]) + ', run ' + t(q[1]) + (q[1] === 1 ? ' (a whole number is a fraction over ' + t('1') + ')' : '') + '.', ['A whole number can be written over ' + t('1') + '.', 'Keep the sign of the slope (on the rise).'], text, { keys: 'fraction', before: t('m=') });
    p.answer = t(key);
    p.good = q[0] < 0 ? ['\\frac{' + (-q[0]) + '}{-' + q[1] + '}', '-\\frac{' + (-q[0]) + '}{' + q[1] + '}'] : [];
    p.bad = [String(qv(m)) === qT(m) && q[1] === 1 ? String(q[0] + 1) : '\\frac{' + q[1] + '}{' + q[0] + '}'];
    return p;
  }
  /* horizontal / vertical: slope, y-intercept, x-intercept */
  function hvPart(prompt, sl, yi, xi, ctx, sol) {
    var keyOf = function (v) { return v === 'und' ? 'undefined' : v === 'none' ? 'none' : String(v); };
    var f = [{ label: 'Slope', name: 'slope', mode: 'math', keys: 'slope', none: true, placeholder: 'number or undef.' }, { label: t('y') + '-intercept', name: 'y-intercept', mode: 'math', keys: 'slope', none: true, placeholder: 'number or none' }, { label: t('x') + '-intercept', name: 'x-intercept', mode: 'math', keys: 'slope', none: true, placeholder: 'number or none' }];
    var p = B.fields(prompt, f, [hvC('slope', sl, ctx), hvC('y', yi, ctx), hvC('x', xi, ctx)], [keyOf(sl), keyOf(yi), keyOf(xi)], 'slope ' + keyOf(sl) + ', ' + t('y') + '-int ' + keyOf(yi) + ', ' + t('x') + '-int ' + keyOf(xi), sol,
      ['Sketch it: a horizontal line has slope ' + t('0') + ' and never meets the ' + t('x') + '-axis (unless it is the axis); a vertical line has an undefined slope and never meets the ' + t('y') + '-axis.'], 'EP5 h/v boxes');
    p.bad = [[keyOf(sl === 'und' ? 0 : 'und'), keyOf(yi), keyOf(xi)], [keyOf(sl), keyOf(xi), keyOf(yi)]].filter(function (b) { return b[1] !== b[2] || b[0] !== keyOf(sl); });
    return p;
  }
})(window);
