/* Math 15 · Unit 7 · Lesson 1 — Review: Graphing Linear Equations from a Table of Values (RF4)
 * Assignment 1 (u7_L01.tex, Questions 1–15) and the Lesson 1 Extra Practice (u7_EP01.tex, Questions 1–17).
 * Every part is a generator: same structure, idea and difficulty as the booklet question (the booklet's numbers are among
 * the possible values), new numbers from the seed. Models: Math 10C u7l1.js (linear or not, graph pad, m and b) and
 * u6l4.js (tables, rates with unequal steps), Math 15 u5l2.js / u5l3.js (tables as number boxes).
 * Outcome: RF4 (a linear relation as an equation, a table of values, a graph; linear or not; points on the line);
 * RF3 only for the rate with units in Extra 14(a).
 * Conversions: "sort linear / non-linear" -> a grid; "explain" -> multiple choice whose options are reasons;
 * "build a table" -> one number box per x (fraction boxes when a value is a fraction); "plot the points and graph the
 * line" -> the graph pad (any two points of the line, arrows at both ends; the table's points may stay on it);
 * "does the point lie on the line? show the substitution" -> multiple choice whose options are substitutions with a
 * verdict (one point) or a Yes/No grid (several points); "write the rule" -> the equation keypad, slope–intercept form.
 * No calculator: integer and simple-fraction arithmetic only.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 15(b) (where two linear relations meet, beyond the
 * tables). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, LN = HW.lines, DR = HW.draw;

  /* ---------- keypad: one ordered pair (as in Math 15 u6l2.js) ---------- */
  var PTK = 'u7l1pt', Wd = HW.widgets;
  if (Wd && Wd.KEYSETS) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' },
      right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' }, enter: { label: 'Check ↵', fn: 'enter', wide: true }, minus: { label: '−', tex: '-', plain: '-' },
      dot: { label: '.', tex: '.', plain: '.' }, par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Ordered pair: type x, y inside' }, comma: { label: ',', tex: ',', plain: ', ' } };
    if (!Wd.KEYSETS[PTK]) Wd.KEYSETS[PTK] = [[dk(7), dk(8), dk(9), KY.par, KY.del], [dk(4), dk(5), dk(6), KY.minus, KY.clear], [dk(1), dk(2), dk(3), KY.comma, KY.left, KY.right], [dk(0), KY.dot, KY.enter]];
    if (Wd.KEYHELP && !Wd.KEYHELP[PTK]) Wd.KEYHELP[PTK] = ['Press <b>( )</b>, type the two coordinates with <b>,</b> between them, then <b>▶</b> to step out.', 'Type a point as <code>(3, -2)</code>.'];
  }

  HW.addCodes({
    'lin-said-lin': 'Called a non-linear relation linear', 'lin-said-non': 'Called a linear relation non-linear',
    'u7l1-tv-sign': 'Table: sign slip multiplying by a negative x', 'u7l1-tv-no-b': 'Table: left out b', 'u7l1-tv-b-sign': 'Table: used −b instead of b', 'u7l1-tv-add': 'Table: added m and x instead of multiplying',
    'u7l1-tv-frac': 'Table: fraction times x worked out wrongly', 'u7l1-gap-solve': 'Table gap: substituted the y-value as x', 'u7l1-gap-undo': 'Table gap: undid the constant the wrong way',
    'gr-join': 'Graph: points not joined into a line', 'mb-swap': 'Slope and y-intercept swapped', 'si-swap': 'Swapped m and b in y = mx + b', 'gr-sign': 'Graph: slope sign wrong', 'gr-b-sign': 'Graph: y-intercept sign wrong', 'gr-slope': 'Graph: right y-intercept, wrong slope', 'gr-icpt': 'Graph: right slope, wrong y-intercept',
    'u7l1-pt-swap-sub': 'Substituted the y-coordinate for x', 'u7l1-pt-cmp': 'Compared with the wrong coordinate', 'u7l1-pt-arith': 'Arithmetic slip in the substitution',
    'u7l1-next-same': 'Repeated the last y-value', 'u7l1-next-one': 'Added 1 instead of the step', 'u7l1-next-nostart': 'Multiplied the step by x, no start value',
    'sub-swap': 'Substituted x and y the wrong way round', 'no-divide': 'Didn’t divide by the rate', 'u7l1-undo-sign': 'Undid the constant the wrong way', 'u7l1-div-first': 'Divided before undoing the constant',
    'dy-only': 'Used the change in y only (ignored the x-step)', 'rate-flip': 'Rate upside down', 'rate-fee': 'Gave the fixed fee as the rate', 'fee-wrong': 'Fee and rate mixed up',
    'u7l1-said-lin': 'Called a non-linear table linear', 'u7l1-said-non': 'Called a linear table non-linear', 'u7l1-rate-sign': 'Rate: sign of a decrease', 'u7l1-rate-total': 'Rate: total change instead of per unit',
    'u7l1-step2': 'Treated a step of 2 in x as a step of 1', 'u7l1-meet-x': 'Gave only the x-value where the relations meet', 'u7l1-meet-y': 'Wrong y-value where the relations meet',
    'u7l1-empty-sign': 'Time to empty: sign slip', 'u7l1-gap-fwd': 'Table gap: used the next column’s value'
  });
  HW.addPartial({ 'u7l1-tv-sign': 's', 'u7l1-tv-no-b': 's', 'u7l1-tv-b-sign': 's', 'u7l1-tv-add': 'n', 'u7l1-tv-frac': 's', 'u7l1-gap-solve': 'n', 'u7l1-gap-undo': 'b',
    'u7l1-pt-swap-sub': 'n', 'u7l1-pt-cmp': 'n', 'u7l1-pt-arith': 's', 'u7l1-next-same': 'n', 'u7l1-next-one': 'b', 'u7l1-next-nostart': 'b', 'u7l1-undo-sign': 'b', 'u7l1-div-first': 'b',
    'u7l1-said-lin': 'n', 'u7l1-said-non': 'n', 'u7l1-rate-sign': 's', 'u7l1-rate-total': 'b', 'u7l1-step2': 'b', 'u7l1-meet-x': 'b', 'u7l1-meet-y': 's', 'u7l1-empty-sign': 's', 'u7l1-gap-fwd': 'b' });

  /* ---------------- numbers and LaTeX ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a || 1; }
  function Q(p, q) { if (Array.isArray(p)) { q = p[1]; p = p[0]; } q = q == null ? 1 : q; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q); return [p / g, q / g]; }
  function qv(f) { return Array.isArray(f) ? f[0] / f[1] : f; }
  function qT(f) { if (!Array.isArray(f)) return nT(f); f = Q(f); return f[1] === 1 ? String(f[0]) : (f[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(f[0]) + '}{' + f[1] + '}'; }
  function qmul(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[0], a[1] * b[1]); }
  function qadd(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }
  function nT(x) { return String(Math.round(x * 1e6) / 1e6); }
  function ptT(p) { return '(' + qT(p[0]) + ',\\ ' + qT(p[1]) + ')'; }
  function prn(x) { var s = qT(x); return qv(x) < 0 || /frac/.test(s) ? '\\left(' + s + '\\right)' : s; }
  function term(c, v, first) {
    var neg, mag;
    if (Array.isArray(c)) { c = Q(c); if (c[0] === 0) return ''; neg = c[0] < 0; var ab = Math.abs(c[0]); mag = c[1] === 1 ? (ab === 1 && v ? '' : String(ab)) : '\\frac{' + ab + '}{' + c[1] + '}'; }
    else { if (c === 0) return ''; neg = c < 0; var a = Math.abs(c); mag = a === 1 && v ? '' : nT(a); }
    return (neg ? '-' : first ? '' : '+') + mag + v;
  }
  function lin(ts) { var o = ''; ts.forEach(function (x) { o += term(x[0], x[1], o === ''); }); return o || '0'; }
  function siT(m, b, X, Y) { return (Y || 'y') + '=' + lin([[m, X || 'x'], [b, '']]); }
  /* "3(2)+1" — the substitution of x into mx + b */
  function qabs(f) { return Array.isArray(f) ? [Math.abs(f[0]), Math.abs(f[1])] : Math.abs(f); }
  function subT(m, b, x) { m = Q(m); var mm = m[1] === 1 ? (m[0] === 1 ? '' : m[0] === -1 ? '-' : String(m[0])) : qT(m); var bb = qv(b) === 0 ? '' : (qv(b) > 0 ? '+' : '-') + qT(qabs(b)); var xs = qT(x); return mm + (/frac/.test(xs) ? '\\left(' + xs + '\\right)' : '(' + xs + ')') + bb; }
  function evalL(m, b, x) { return qadd(qmul(m, x), b); }
  function rng(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nz(a, b) { return rng(a, b).filter(function (x) { return x !== 0; }); }
  function seqT(a) { return a.map(qT).join(',\\ '); }
  function cell(v) { return v == null ? '' : typeof v === 'string' ? v : t(qT(v)); }
  function tbl(xs, ys, xn, yn) { return HW.valueTable([[t(xn || 'x')].concat(xs.map(cell)), [t(yn || 'y')].concat(ys.map(cell))]); }
  function distinct(opts) { var seen = {}; opts.forEach(function (o) { if (seen[o.html]) throw new Error('duplicate MC option ' + o.html); seen[o.html] = 1; }); return opts; }
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, distinct(opts), sol, hints, text, keepOrder); }
  function figs(list, w) { w = w || 150; return '<div style="display:flex;flex-wrap:wrap;gap:6px 14px;align-items:flex-start">' + list.map(function (f) { return '<div style="flex:1 1 ' + w + 'px;max-width:280px">' + f + '</div>'; }).join('') + '</div>'; }
  function pickWhere(gen, okf) { for (var i = 0; i < 400; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('pickWhere: no value'); }

  /* a number box with a list of known wrong values: [[value, code, hint], …] */
  function dl(list, ans) { var L2 = (list || []).filter(function (d) { return d && isFinite(d[0]) && !near(d[0], ans); }); return function (v) { for (var i = 0; i < L2.length; i++) if (near(v, L2[i][0])) return { code: L2[i][1], hint: L2[i][2] }; return null; }; }
  function numPart(prompt, ans, list, sol, hints, text, inp) {
    var p = B.number(prompt, ans, dl(list, ans), sol, hints, text, inp);
    p.answer = t(nT(ans)) + (inp && inp.after ? ' ' + inp.after : '');
    p.bad = (list || []).filter(function (d) { return d && isFinite(d[0]) && !near(d[0], ans); }).map(function (d) { return nT(d[0]); });
    return p;
  }
  function nrPart(prompt, ans, list, sol, hints, text) { var p = B.nr(prompt, ans, dl(list, ans), sol, hints, text); p.bad = (list || []).filter(function (d) { return d && isFinite(d[0]) && !near(d[0], ans) && d[0] >= 0; }).map(function (d) { return nT(d[0]); }); return p; }

  /* ---------------- tables of values ---------------- */
  /* typical slips for y = mx + b at x (values), for the diagnosis of one box */
  function tvDiag(m, b, x) {
    var mv = qv(m), bv = qv(b), xv = qv(x), y = mv * xv + bv, out = [];
    if (!near(xv, 0) && !near(mv, 0)) out.push([-mv * xv + bv, 'u7l1-tv-sign', 'Check the sign of ' + t(qT(m) + '\\times' + prn(x)) + ': ' + (mv * xv > 0 ? 'two numbers with the same sign multiply to a <b>positive</b>.' : 'a positive times a negative is <b>negative</b>.')]);
    if (!near(bv, 0)) out.push([mv * xv, 'u7l1-tv-no-b', 'You worked out ' + t(qT(m) + '\\times' + prn(x)) + ' — now finish: add ' + t(qT(b)) + '.']);
    if (!near(bv, 0)) out.push([mv * xv - bv, 'u7l1-tv-b-sign', 'Keep the sign of the constant: it is ' + t((bv > 0 ? '+' : '') + qT(b)) + '.']);
    if (Array.isArray(m) && Q(m)[1] === 1 && !near(xv, 0)) out.push([mv + xv + bv, 'u7l1-tv-add', t(qT(m) + 'x') + ' means ' + t(qT(m) + '\\times x') + ': multiply, don’t add.']);
    if (!Array.isArray(m) && !near(xv, 0)) out.push([mv + xv + bv, 'u7l1-tv-add', t(qT(m) + 'x') + ' means ' + t(qT(m) + '\\times x') + ': multiply, don’t add.']);
    return out.filter(function (d) { return !near(d[0], y); });
  }
  /* one box per x-value: "x = −2: y = [ ]". Fraction boxes when an x or y is a fraction. */
  function tablePart(prompt, xs, m, b, sol, hints, text, o) {
    o = o || {};
    var ys = xs.map(function (x) { return evalL(m, b, x); }), frac = ys.concat(xs).some(function (v) { return Q(v)[1] !== 1; });
    var X = o.X || 'x', Y = o.Y || 'y';
    var fields = xs.map(function (x) { var f = { label: t(X + '=' + qT(x)), name: t(X + '=' + qT(x)), before: t(Y + '=') }; if (frac) { f.mode = 'math'; f.keys = 'fraction'; } return f; });
    var checks = xs.map(function (x, i) {
      var list = tvDiag(m, b, x), y = ys[i];
      if (frac) return K.value(y, { only: 'fraction', diag: function (v) { for (var j = 0; j < list.length; j++) if (near(v, list[j][0])) return { code: list[j][1], hint: list[j][2] }; return null; } });
      return K.number(qv(y), dl(list, qv(y)));
    });
    var keys = ys.map(qT);
    var p = B.fields(prompt, fields, checks, keys, tbl(xs, ys, X, Y), sol, hints || ['Substitute each ' + t(X) + '-value into the equation (use brackets for negatives) and simplify.', 'Multiply first, then add or subtract the constant.'], text);
    p.bad = [ys.map(function (y) { return nT(qv(y) + 1); })];
    var firstSlip = xs.map(function (x, i) { var l = tvDiag(m, b, x); return l.length ? nT(l[0][0]) : null; });
    if (firstSlip.some(function (s) { return s != null; })) p.bad.push(firstSlip.map(function (s, i) { return s == null ? nT(qv(ys[i]) + 2) : s; }));
    p.ys = ys;
    return p;
  }
  function tableSol(m, b, xs, X, Y) {
    X = X || 'x'; Y = Y || 'y';
    return xs.map(function (x) { return t(X + '=' + qT(x) + ':\\ ' + Y + '=' + subT(m, b, x) + '=' + qT(evalL(m, b, x))); }).join('<br>');
  }

  /* ---------------- graphs ---------------- */
  var PADHELP = ' <span style="color:#6a7182;font-size:.92em">(<b>╱ Line</b>: tap two points, then tap the second again.)</span>';
  function gv(pts, pieces) { return { pts: pts || [], pieces: pieces || [], join: 'none' }; }
  function lineV(p, q) { return gv([], [{ v: [p, q], s: 'arrow', e: 'arrow' }]); }
  function lineMB(m, b) { m = Q(m); var bv = qv(b); return lineV([0, bv], [m[1], bv + m[0]]); }
  function lineCoef(v) { var g = DR.geom(v), ks = Object.keys(g.lines); if (ks.length !== 1 || g.pts.length) return null; return g.lines[ks[0]]; }
  function spanPts(m, b, xr, yr) {
    var out = [];
    for (var x = xr[0]; x <= xr[1]; x++) { var y = qv(m) * x + qv(b); if (Math.abs(y - Math.round(y)) < 1e-9 && y >= yr[0] - 1e-9 && y <= yr[1] + 1e-9) out.push([x, Math.round(y)]); }
    return [out[0], out[out.length - 1]];
  }
  function keyLine(m, b, xr, yr) { var s = spanPts(m, b, xr, yr); return lineV(s[0], s[1]); }
  function exactChk(target, W, o) {
    o = o || {};
    var base = K.graphExact(target, { wrong: W }), TL = lineCoef(target);
    function onT(p) { return Math.abs(TL.A * p[0] + TL.B * p[1] - TL.C) < 1e-6; }
    return function (resp) {
      if (!DR.empty(resp) && DR.same(resp, target)) return ok();
      var n = DR.norm(resp);
      if (!n.pieces.length && n.pts.length >= 2 && n.pts.every(onT)) return wrong('gr-join', 'Your points are right — now join them: choose <b>╱ Line</b> and tap two of them (the ends become arrows, because the line goes on forever).');
      if (!n.pieces.length && n.pts.length === 1 && onT(n.pts[0])) return wrong('gr-join', 'That point is on the line. Plot the other points from the table too, then join them with <b>╱ Line</b>.');
      var r = base(resp);
      if (r.v === 'wrong' && r.code === 'graph' && o.m != null) {
        var S = lineCoef(resp);
        if (S && S.B !== 0) {
          var ms = -S.A / S.B, bs = S.C / S.B;
          if (near(bs, o.b) && !near(ms, o.m)) return wrong('gr-slope', 'Your line crosses the ' + t('y') + '-axis in the right place, but it is not the right line. Check the other points from your table.');
          if (near(ms, o.m) && !near(bs, o.b)) return wrong('gr-icpt', 'Your line has the right steepness, but it must pass through ' + t(ptT([0, o.b])) + ' (the table’s value at ' + t('x=0') + ').');
        }
      }
      return r;
    };
  }
  function segOf(v) { var n = DR.norm(v); return gv([], n.pieces.map(function (pc) { return { v: pc.v, s: 'closed', e: 'closed' }; })); }
  /* graph the line of a table: the key is the whole line; the table's points on it are also accepted */
  function graphPart(prompt, m, b, xs, pad, sol, hints, text) {
    var key = keyLine(m, b, pad.x, pad.y), mv = qv(m), bv = qv(b);
    var W = [];
    if (mv !== 0) W.push({ is: lineMB([-Q(m)[0], Q(m)[1]], b), code: 'gr-sign', hint: 'Check the direction: as ' + t('x') + ' increases, your table’s ' + t('y') + '-values ' + (mv > 0 ? 'go up' : 'go down') + ', so the line ' + (mv > 0 ? 'rises' : 'falls') + ' from left to right.' });
    if (bv !== 0) W.push({ is: lineMB(m, -bv), code: 'gr-b-sign', hint: 'Check the point at ' + t('x=0') + ': it is ' + t(ptT([0, bv])) + '.' });
    var pts = xs.map(function (x) { return [qv(x), qv(evalL(m, b, x))]; });
    var inp = { x: pad.x, y: pad.y, grid: 1, labels: 2, defaultEnd: 'arrow', max: 360 };
    var p = B.graph(prompt + PADHELP, inp, exactChk(key, W, { m: mv, b: bv }), key, sol, hints, text);
    p.bad = W.map(function (w) { return w.is; }).concat([segOf(key), gv(pts, [])]);
    p.good = [gv(pts, [{ v: [pts[0], pts[pts.length - 1]], s: 'arrow', e: 'arrow' }])];
    return p;
  }
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
    return '<div class="fig">' + HW.graph({ x: xr, y: yr, grid: 1, labels: 2, segs: [{ pts: P, start: 'arrow', end: 'arrow' }], points: o.points || [], max: o.max || 280, aria: 'graph of a line' }) + '</div>';
  }

  /* ---------------- equations ---------------- */
  function linePart(prompt, m, b, wr, sol, hints, text, o) {
    o = o || {};
    var vars = o.vars || ['x', 'y'], target = { m: qv(m), b: qv(b) };
    var W = (wr || []).filter(function (w) { return w && !(near(qv(w.m), qv(m)) && near(qv(w.b), qv(b))); }).map(function (w) { return { is: { m: qv(w.m), b: qv(w.b) }, code: w.code, hint: w.hint }; });
    var p = B.line(prompt, target, { form: o.form || 'slope-intercept', vars: vars, wrong: W, keyTex: siT(m, b, vars[0], vars[1]) }, sol, hints, text);
    p.answer = t(siT(m, b, vars[0], vars[1]));
    p.bad = W.map(function (w) { return siT(LN.toFr(w.is.m), LN.toFr(w.is.b), vars[0], vars[1]); });
    p.good = [vars[1] + '=' + qT(b) + (qv(m) < 0 ? '' : '+') + term(m, vars[0], true)].filter(function () { return qv(b) !== 0; });
    return p;
  }

  /* ---------------- "is it linear?": the rate, or none ---------------- */
  function rateOrNone(xs, ys, lin, m) {
    var dx = [], dy = [];
    for (var i = 1; i < xs.length; i++) { dx.push(xs[i] - xs[i - 1]); dy.push(ys[i] - ys[i - 1]); }
    var eqStep = dx.every(function (d) { return d === dx[0]; });
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, function (a, p, q) { return p || q; }).trim();
      if (!s) return form('empty', 'Type the rate, or press <b>none</b> if the relation is not linear.');
      if (/^none$/i.test(s)) return lin ? wrong('u7l1-said-non', 'Look again: work out ' + t('\\frac{\\text{change in }y}{\\text{change in }x}') + ' for every pair of neighbouring columns. Is it the same every time?') : ok();
      if (/undef/i.test(s)) return wrong('u7l1-said-lin', '“Undefined” is for vertical lines. First decide whether the rate is the same between every pair of columns.');
      if (!lin) {
        var a = HW.ex.parse(s); if (!a.ok) return form('unreadable', 'Type the rate as a number or fraction, or press <b>none</b>.');
        return wrong('u7l1-said-lin', 'Check <b>every</b> step, not just the first: the changes in ' + t('y') + ' are ' + t(dy.map(function (d) { return (d > 0 ? '+' : '') + d; }).join(',\\ ')) + (eqStep ? '' : ' over steps of ' + t(dx.join(',\\ ')) + ' in ' + t('x')) + '. Is the rate the same each time?');
      }
      return K.slope(m, { diag: function (v) { if (!eqStep || dx[0] !== 1) { if (dy.some(function (d, i) { return near(d, v) && !near(d / dx[i], v); })) return { code: 'dy-only', hint: t(nT(v)) + ' is a change in ' + t('y') + ' only. Divide each change in ' + t('y') + ' by its change in ' + t('x') + (eqStep ? ' (here ' + t(dx[0]) + ').' : '.') }; } return null; } })(s);
    };
  }

  /* ---------------- does a point lie on the line? (one point: reasons) ---------------- */
  function onLineMC(r, m, b, P, prompt, text) {
    var x0 = P[0], y0 = P[1], v = qv(evalL(m, b, x0)), on = near(v, y0), S = subT(m, b, x0);
    var opts = [{ html: on ? '<b>Yes:</b> ' + t(S + '=' + nT(v)) + ', which equals the ' + t('y') + '-coordinate ' + t(y0) + '.' : '<b>No:</b> ' + t(S + '=' + nT(v)) + ', but the ' + t('y') + '-coordinate is ' + t(y0) + '.', right: true }];
    var w = qv(evalL(m, b, y0));
    opts.push({ html: (near(w, x0) ? '<b>Yes:</b> ' + t(subT(m, b, y0) + '=' + nT(w)) + ', which equals ' + t(x0) + '.' : '<b>No:</b> ' + t(subT(m, b, y0) + '=' + nT(w) + '\\ne ' + x0) + '.'), code: 'u7l1-pt-swap-sub', why: 'The first coordinate is ' + t('x') + ': substitute ' + t('x=' + x0) + ' and compare the result with ' + t('y=' + y0) + '.' });
    if (!near(v, x0)) opts.push({ html: '<b>No:</b> ' + t(S + '=' + nT(v)) + ', which is not the ' + t('x') + '-coordinate ' + t(x0) + '.', code: 'u7l1-pt-cmp', why: 'You substituted correctly, but compare the result with the <b>' + t('y') + '-coordinate</b>, ' + t(y0) + ' — the equation gives ' + t('y') + '.' });
    var slip = pickWhere(function () { return v + r.pick([-2, -1, 1, 2]); }, function (s) { return !near(s, v) && !near(s, y0); });
    opts.push(on ? { html: '<b>No:</b> ' + t(S + '=' + nT(slip) + '\\ne ' + y0) + '.', code: 'u7l1-pt-arith', why: 'Recheck the arithmetic: ' + t(S) + ' — multiply first (watch the signs), then add the constant.' }
      : { html: '<b>Yes:</b> ' + t(S + '=' + y0) + '.', code: 'u7l1-pt-arith', why: 'Recheck the arithmetic: ' + t(S) + ' — multiply first (watch the signs), then add the constant.' });
    if (opts.length < 4) opts.push({ html: '<b>Yes:</b> both coordinates are ' + (x0 > 0 && y0 > 0 ? 'positive' : 'whole numbers') + ', so the point fits.', code: 'u7l1-pt-cmp', why: 'Only a substitution can decide it: put ' + t('x=' + x0) + ' into the equation and compare with ' + t('y=' + y0) + '.' });
    return mc(r, prompt, opts, t(S + '=' + nT(v)) + (on ? '. This equals ' + t('y=' + y0) + ', so the point <b>lies on</b> the line.' : t('\\ne ' + y0) + ', so the point does <b>not</b> lie on the line.'),
      ['Substitute the ' + t('x') + '-coordinate into the equation and simplify.', 'If the result equals the ' + t('y') + '-coordinate, the point is on the line.'], text);
  }
  function ptPart(prompt, P, opt, sol, hints, text) { var p = B.point(prompt, P, opt, sol, hints, text); p.input.keys = PTK; return p; }

  /* ---------------- Q1 templates ---------------- */
  function sortTemplates(r) {
    var a = r.int(2, 9), c = r.int(1, 9), c2 = r.int(1, 9), k = r.int(2, 8), h = r.pick(nz(-9, 9)), n = r.int(1, 6), c3 = r.int(1, 9), c4 = r.int(1, 9), e = r.int(2, 6);
    return [
      { lin: 'L', tex: 'y=' + a + 'x' + (r.chance(0.5) ? '+' : '-') + c, why: 'it is already ' + t('y=mx+b') + ': ' + t('x') + ' appears only to the first power.' },
      { lin: 'N', tex: 'y=x^{2}-' + c2, why: t('x') + ' is <b>squared</b>, so the graph curves (a parabola).' },
      { lin: 'L', tex: 'y=-' + k + 'x', why: 'it is ' + t('y=-' + k + 'x+0') + ': a straight line through the origin.' },
      { lin: 'L', tex: 'y=' + h, why: t('y') + ' is the same for every ' + t('x') + ': a horizontal line, ' + t('y=0x' + (h < 0 ? '' : '+') + h) + '.' },
      { lin: 'N', tex: 'y=\\dfrac{' + n + '}{x}', why: t('x') + ' is in the <b>denominator</b>, so the graph is a curve.' },
      { lin: 'N', tex: 'y=x^{3}' + (r.chance(0.5) ? '-' : '+') + c3, why: t('x') + ' is <b>cubed</b>, so the graph curves.' },
      { lin: 'L', tex: 'y=-x-' + c4, why: t('-x') + ' is ' + t('-1x') + ': ' + t('x') + ' only to the first power, so it is a line.' },
      { lin: 'N', tex: 'y=' + e + '^{x}', why: t('x') + ' is an <b>exponent</b>, so the graph curves upward faster and faster.' }];
  }

  /* ---------------- shared numbers ---------------- */
  var PAD = { x: [-6, 6], y: [-10, 10] };
  function sh6(r) { var c = r.pick(nz(-6, 6)); return { m: 1, b: c, rev: r.chance(0.35) }; }
  function sh7(r) { var o = pickWhere(function () { return { a: r.pick([2, 3, 4]), c: r.int(-6, 6) }; }, function (o) { return 2 * o.a + Math.abs(o.c) <= 10; }); return { m: -o.a, b: o.c, rev: r.chance(0.35) && o.c > 0 }; }
  function sh8(r) { var o = pickWhere(function () { return { a: r.pick([2, 3, 4]), c: r.pick(nz(-8, 8)) }; }, function (o) { return 2 * o.a + Math.abs(o.c) <= 10; }); return { m: o.a, b: o.c, rev: false }; }
  function eqOf(sh) { return sh.rev ? 'y=' + sh.b + term(sh.m, 'x', false) : siT(sh.m, sh.b); }
  var X5 = [-2, -1, 0, 1, 2];

  function tableGraphQ(num, shf, lab) {
    return { num: num, shared: shf, stem: function (sh) { return 'Build a table of values for ' + t(eqOf(sh)) + ', using ' + t('x=-2,\\ -1,\\ 0,\\ 1,\\ 2') + '. Then plot the points and graph the line.'; }, parts: [
      { id: num + 'a', sub: 'a', level: 'BEG', make: function (r, sh) {
        return tablePart('(a) Complete the table.', X5, sh.m, sh.b, (sh.rev ? 'Reorder: ' + t(siT(sh.m, sh.b)) + '.<br>' : '') + tableSol(sh.m, sh.b, X5), null, 'table ' + lab);
      } },
      { id: num + 'b', sub: 'b', level: 'BEG', make: function (r, sh) {
        var ys = X5.map(function (x) { return qv(evalL(sh.m, sh.b, x)); });
        return graphPart('(b) Plot the points from your table and draw the line through them, across the whole grid.', sh.m, sh.b, X5, PAD,
          'Plot ' + X5.map(function (x, i) { return t(ptT([x, ys[i]])); }).join(', ') + '. They line up: draw one straight line through them with arrows at both ends.',
          ['Each column of the table is a point ' + t('(x,\\ y)') + '.', 'Join the points with one straight line and extend it to the edges of the grid.'], 'graph ' + lab);
      } }] };
  }

  /* ================= extra-practice shared numbers ================= */
  function ep1a(r) { var a = r.pick([2, 4, 6, -2, -4]), c = r.pick(nz(-6, 6)); return { m: a, b: c, xs: [-3, [-1, 2], 0, [1, 2], 2] }; }
  function ep1b(r) { var a = r.pick([-2, -4, 2]), c = r.pick(nz(-5, 5)); return { m: a, b: c, xs: [[-5, 2], -1, 0, [3, 2], 4] }; }
  function ep1c(r) { var s = r.pick([1, -1]), c = r.pick(nz(-5, 6)), q = r.pick([[1, 2], [3, 2]]); return { m: [s * q[0], q[1]], b: c, xs: [-6, -3, 0, 1, 5] }; }
  function ep1d(r) { var s = r.pick([-1, 1]), p = r.pick([1, 2]), c = r.pick(nz(-4, 4)); return { m: [s * p, 3], b: c, xs: [-6, -3, 0, [3, 2], 6] }; }

  /* the rule in a sentence: change per step of 1, where it crosses */
  function patternPart(prompt, m, b, step, text) {
    var f = [{ label: 'Each time ' + t('x') + ' increases by ' + t('1') + ', ' + t('y') + ' changes by', name: 'change in y', mode: 'math', keys: 'fraction', placeholder: 'e.g. -2 or 1/2' },
      { label: 'The line crosses the ' + t('y') + '-axis at ' + t('y='), name: 'y-axis crossing', mode: 'math', keys: 'fraction' }];
    var mv = qv(m), bv = qv(b);
    var c1 = K.value(m, { only: 'fraction', diag: function (v) { if (near(v, -mv)) return { code: 'u7l1-rate-sign', hint: 'The line ' + (mv > 0 ? 'rises' : 'falls') + ', so the change is ' + (mv > 0 ? 'positive' : 'negative') + '.' }; if (step > 1 && near(v, step * mv)) return { code: 'u7l1-step2', hint: 'In the table ' + t('x') + ' goes up by ' + t(step) + ' each column. Divide that change by ' + t(step) + ' to get the change per step of ' + t('1') + '.' }; if (near(v, bv) && !near(bv, mv)) return { code: 'mb-swap', hint: 'That’s where the line crosses the ' + t('y') + '-axis. The change per step is the other number.' }; return null; } });
    var c2 = K.value(b, { diag: function (v) { if (near(v, mv) && !near(bv, mv)) return { code: 'mb-swap', hint: 'That’s the change per step. The crossing is the ' + t('y') + '-value when ' + t('x=0') + '.' }; return null; } });
    var p = B.fields(prompt, f, [c1, c2], [qT(m), qT(b)], t('y') + ' changes by ' + t(qT(m)) + ' per step of ' + t('1') + '; crosses at ' + t(ptT([0, bv])),
      'From the table, ' + t('y') + ' changes by ' + t(qT(m)) + ' every time ' + t('x') + ' goes up by ' + t('1') + ' (the line ' + (mv > 0 ? 'rises' : 'falls') + '), and at ' + t('x=0') + ', ' + t('y=' + qT(b)) + ': the line crosses the ' + t('y') + '-axis at ' + t(ptT([0, bv])) + '.',
      ['Compare two neighbouring columns of your table; divide by the step in ' + t('x') + ' if it isn’t ' + t('1') + '.', 'The ' + t('y') + '-axis is where ' + t('x=0') + '.'], text);
    p.bad = [[qT([-Q(m)[0], Q(m)[1]]), qT(b)], [qT(b), qT(m)]].filter(function (bd) { return !(bd[0] === qT(m) && bd[1] === qT(b)); });
    return p;
  }

  var ep13 = function (r) { return pickWhere(function () { return { rate: r.int(2, 5), F: r.int(4, 12), n4: r.int(7, 10) }; }, function (o) { return o.F !== o.rate && o.F !== 5 * o.rate; }); };

  HW.defineLesson({
    id: 'u7l1', unit: 7, num: '1', title: 'Review: Graphing Linear Equations from a Table of Values', outcome: 'RF4',
    blurb: 'Recognize linear equations, build a table of values, plot the line, and test whether a point is on it.',
    questions: [
      /* ================= Part A ================= */
      { num: '1', section: 'Part A — Linear vs. Non-Linear, and Tables of Values', stem: 'Each equation below represents a relation. Without graphing, sort each one into the <b>Linear</b> or the <b>Non-linear</b> column.', parts: [
        { id: '1', level: 'BEG', make: function (r) {
          var T = r.shuffle(sortTemplates(r)), letters = 'abcdefgh'.split(''), want = {}, info = {};
          var rows = T.map(function (x, i) { want[letters[i]] = x.lin; info[letters[i]] = x; return { id: letters[i], html: '(' + letters[i] + ') ' + t(x.tex) }; });
          return B.grid('Linear or non-linear?', rows, [{ id: 'L', html: 'Linear' }, { id: 'N', html: 'Non-linear' }], want, {
            why: function (id, given) { var x = info[id]; return { code: given === 'L' ? 'lin-said-lin' : 'lin-said-non', hint: '(' + id + ') is ' + (x.lin === 'L' ? '<b>linear</b>: ' : '<b>non-linear</b>: ') + x.why }; } },
            'Linear: ' + letters.filter(function (l) { return want[l] === 'L'; }).map(function (l) { return '(' + l + ')'; }).join(', ') + '. Non-linear: ' + letters.filter(function (l) { return want[l] === 'N'; }).map(function (l) { return '(' + l + ')'; }).join(', ') + '.<br>' +
            T.map(function (x, i) { return '(' + letters[i] + ') ' + (x.lin === 'L' ? 'linear — ' : 'non-linear — ') + x.why; }).join('<br>'),
            ['In a linear equation ' + t('x') + ' appears only to the first power: never squared or cubed, never in a denominator, never an exponent.', t('y=') + ' a number alone is a horizontal line — that is linear.'], 'sort 8 equations');
        } }] },
      { num: '2', parts: [
        { id: '2', level: 'EMG', make: function (r) {
          var c = r.int(1, 9), a = r.int(2, 6), d = r.int(1, 9), sq = 'y=x^{2}-' + c, li = 'y=-' + a + 'x-' + d;
          return mc(r, 'Why is ' + t(sq) + ' <b>not</b> a linear equation, but ' + t(li) + ' <b>is</b>?', [
            { html: 'In ' + t(sq) + ' the ' + t('x') + ' is <b>squared</b>, so its graph curves (a parabola). In ' + t(li) + ', ' + t('x') + ' is only to the first power: it has the form ' + t('y=mx+b') + ', a straight line.', right: true },
            { html: t(sq) + ' subtracts a number, and a linear equation can’t subtract.', why: t(li) + ' subtracts too. What matters is the power of ' + t('x') + '.' },
            { html: t(li) + ' is linear because all of its numbers are negative.', why: 'The signs don’t decide it: ' + t('y=' + a + 'x+' + d) + ' is linear too. Look at the power of ' + t('x') + '.' },
            { html: 'Both are linear: each has one ' + t('x') + '-term and one constant.', why: 'The ' + t('x') + '-term in ' + t(sq) + ' is ' + t('x^{2}') + ' — squared, so the graph is a curve.' }],
            t(sq) + ': ' + t('x') + ' is squared → a parabola (non-linear). ' + t(li) + ' is ' + t('y=mx+b') + ' with ' + t('m=-' + a) + ', ' + t('b=-' + d) + ': ' + t('x') + ' to the first power only → a straight line.',
            ['Look at the power of ' + t('x') + ' in each equation.'], 'why x² is not linear');
        } }] },
      { num: '3', stem: '', parts: [
        { id: '3', level: 'BEG', make: function (r) {
          var a = r.int(2, 5), c = r.int(1, 6);
          return tablePart('Build a table of values for ' + t('y=' + a + 'x-' + c) + ', using ' + t('x=-2,\\ -1,\\ 0,\\ 1,\\ 2') + '.', X5, a, -c, tableSol(a, -c, X5), null, 'table ax - c');
        } }] },
      { num: '4', parts: [
        { id: '4', level: 'BEG', make: function (r) {
          var c = r.pick(nz(-6, 9)), rev = r.chance(0.5) && c > 0, eq = rev ? 'y=' + c + '-x' : siT(-1, c);
          return tablePart('Build a table of values for ' + t(eq) + ', using ' + t('x=-2,\\ -1,\\ 0,\\ 1,\\ 2') + '.', X5, -1, c, (rev ? 'Reorder: ' + t(siT(-1, c)) + '. ' : '') + t('-x') + ' means ' + t('-1\\times x') + '.<br>' + tableSol(-1, c, X5), ['Substitute each ' + t('x') + '-value; ' + t('-x') + ' means “the opposite of ' + t('x') + '”, so ' + t('-(-2)=2') + '.', 'Then add the constant.'], 'table -x + c');
        } }] },
      { num: '5', parts: [
        { id: '5', level: 'BEG', make: function (r) {
          var a = r.int(2, 4), c = r.int(1, 7);
          return tablePart('Build a table of values for ' + t('y=' + a + 'x+' + c) + ', using ' + t('x=-2,\\ -1,\\ 0,\\ 1,\\ 2') + '.', X5, a, c, tableSol(a, c, X5), null, 'table ax + c');
        } }] },
      /* ================= Part B ================= */
      (function () { var q = tableGraphQ('6', sh6, 'y = x + c'); q.section = 'Part B — Tables of Values and Graphs'; return q; })(),
      tableGraphQ('7', sh7, 'y = -ax + c'),
      tableGraphQ('8', sh8, 'y = ax + c'),
      /* ================= Part C ================= */
      { num: '9', section: 'Part C — Does the Point Lie on the Line?', parts: [
        { id: '9', level: 'BEG', make: function (r) {
          var m = r.int(2, 5), b = r.int(1, 9), x0 = r.int(1, 4), y0 = m * x0 + b;
          return onLineMC(r, m, b, [x0, y0], 'Does the point ' + t(ptT([x0, y0])) + ' lie on the line ' + t(siT(m, b)) + '? Choose the substitution and conclusion.', 'point on line (yes)');
        } }] },
      { num: '10', parts: [
        { id: '10', level: 'BEG', make: function (r) {
          var b = r.int(1, 9), x0 = r.int(2, 8), y0 = -x0 + b + r.pick([-1, -1, 1]);
          return onLineMC(r, -1, b, [x0, y0], 'Does the point ' + t(ptT([x0, y0])) + ' lie on the line ' + t(siT(-1, b)) + '? Choose the substitution and conclusion.', 'point on -x line (no)');
        } }] },
      { num: '11', parts: [
        { id: '11', level: 'BEG', make: function (r) {
          var m = r.int(2, 4), b = r.pick(nz(-5, 6)), x0 = -r.int(1, 4), y0 = m * x0 + b;
          return onLineMC(r, m, b, [x0, y0], 'Does the point ' + t(ptT([x0, y0])) + ' lie on the line ' + t(siT(m, b)) + '? Choose the substitution and conclusion.', 'point negative x (yes)');
        } }] },
      { num: '12', parts: [
        { id: '12', level: 'EMG', make: function (r) {
          var a = r.int(2, 4), c = r.int(3, 10), off = r.pick([-1, 1]), eq = siT(-a, c);
          var P = [[1, c - a], [0, c + off], [-2, c + 2 * a]], ids = ['p1', 'p2', 'p3'], want = { p1: 'y', p2: 'n', p3: 'y' };
          var rows = P.map(function (p, i) { return { id: ids[i], html: t(ptT(p)) }; });
          var sol = P.map(function (p) { var v = qv(evalL(-a, c, p[0])); return t(ptT(p)) + ': ' + t(subT(-a, c, p[0]) + '=' + v) + (v === p[1] ? ' ✓ <b>on</b> the line' : t('\\ne ' + p[1]) + ' — <b>not</b> on the line'); }).join('<br>');
          return B.grid('Consider the equation ' + t(eq) + '. Determine whether each point lies on the line.', rows, [{ id: 'y', html: 'On the line' }, { id: 'n', html: 'Not on the line' }], want, {
            why: function (row) { var p = P[ids.indexOf(row)], v = qv(evalL(-a, c, p[0])); return { code: 'u7l1-pt-arith', hint: 'Check ' + t(ptT(p)) + ': substitute ' + t('x=' + p[0]) + ': ' + t(subT(-a, c, p[0])) + '. Does it equal ' + t(p[1]) + '?' }; } },
            sol, ['Substitute each ' + t('x') + '-coordinate and compare the result with the ' + t('y') + '-coordinate.', 'Careful with ' + t('-' + a + '\\times(-2)') + ': a negative times a negative is positive.'], 'three points on/off');
        } }] },
      { num: '13', parts: [
        { id: '13', level: 'EMG', make: function (r) {
          var m = r.pick([2, 3, 4, 5, -2, -3]), b = r.int(-4, 5), xs = [-1, 0, 1, 2], ys = xs.map(function (x) { return m * x + b; }), ans = 3 * m + b;
          return numPart('A table of values for a linear equation contains the points ' + xs.map(function (x, i) { return t(ptT([x, ys[i]])); }).join(', ') + '. Without writing the equation, use the pattern in the ' + t('y') + '-values to predict the ' + t('y') + '-value when ' + t('x=3') + '.', ans,
            [[ys[3], 'u7l1-next-same', 'That is the value at ' + t('x=2') + '. One more step to ' + t('x=3') + ' changes ' + t('y') + ' once more.'], [ys[3] + 1, 'u7l1-next-one', t('y') + ' doesn’t go up by ' + t('1') + ' each time — find how much it changes from one point to the next.'], [3 * m, 'u7l1-next-nostart', 'Start from the last point, ' + t(ptT([2, ys[3]])) + ', and add the change once more.'], [ys[3] - m, 'u7l1-rate-sign', 'Keep going in the same direction: the ' + t('y') + '-values ' + (m > 0 ? 'increase' : 'decrease') + ' by ' + t(Math.abs(m)) + ' each step.']],
            'Each time ' + t('x') + ' increases by ' + t('1') + ', ' + t('y') + ' changes by ' + t((m > 0 ? '+' : '') + m) + ' (' + t(seqT(ys)) + '). So at ' + t('x=3') + ': ' + t('y=' + ys[3] + (m > 0 ? '+' : '') + m + '=' + ans) + '.',
            ['Find how much ' + t('y') + ' changes from one point to the next.', 'Add that change once more to the last ' + t('y') + '-value.'], 'predict next y', { before: t('y=') });
        } }] },
      /* ================= Part D ================= */
      { num: '14', section: 'Part D — Multiple Choice and Numerical Response', parts: [
        { id: '14', level: 'BEG', make: function (r) {
          var m = r.int(2, 6), c = r.int(1, 9), eq = 'y=' + m + 'x-' + c;
          return mc(r, '<i>(Multiple Choice)</i> Which of the following points lies on the line ' + t(eq) + '?', [
            { html: t(ptT([0, -c])), right: true },
            { html: t(ptT([0, c])), why: 'Substitute ' + t('x=0') + ': ' + t('y=' + m + '(0)-' + c + '=-' + c) + ', not ' + t(c) + '.' },
            { html: t(ptT([c, 0])), why: 'Substitute ' + t('x=' + c) + ': ' + t('y=' + m + '(' + c + ')-' + c + '=' + (m * c - c)) + ', not ' + t('0') + '.' },
            { html: t(ptT([-c, 0])), why: 'Substitute ' + t('x=-' + c) + ': ' + t('y=' + m + '(-' + c + ')-' + c + '=' + (-m * c - c)) + ', not ' + t('0') + '.' }],
            'Test each point. At ' + t('x=0') + ': ' + t('y=' + m + '(0)-' + c + '=-' + c) + ', so ' + t(ptT([0, -c])) + ' is on the line. The other points fail the substitution.',
            ['Substitute the ' + t('x') + '-coordinate of each option and compare with its ' + t('y') + '-coordinate.'], 'which point on y = mx - c');
        } }] },
      { num: '15', parts: [
        { id: '15', level: 'PRG', make: function (r) {
          var o = pickWhere(function () { return { m: r.int(2, 5), k: r.int(1, 9), c: r.pick(nz(-6, 9)) }; }, function (o) { var Y = o.m * o.k + o.c; return Y > 0 && Y <= 60; });
          var m = o.m, k = o.k, c = o.c, Y = m * k + c, eq = siT(m, c);
          return nrPart('<i>(Numerical Response)</i> The point ' + t('(k,\\ ' + Y + ')') + ' lies on the line ' + t(eq) + '. The value of ' + t('k') + ' is ____.', k,
            [[m * Y + c, 'sub-swap', t(Y) + ' is the <b>' + t('y') + '-coordinate</b>: substitute it for ' + t('y') + ', not for ' + t('x') + ': ' + t(Y + '=' + m + 'k' + (c < 0 ? '' : '+') + c) + '.'], [(Y + c) / m, 'u7l1-undo-sign', 'To undo ' + t((c > 0 ? '+' : '') + c) + ', ' + (c > 0 ? 'subtract' : 'add') + ' ' + t(Math.abs(c)) + ' on both sides.'], [Y - c, 'no-divide', 'You have ' + t(m + 'k=' + (Y - c)) + ' — now divide by ' + t(m) + '.'], [Y / m - c, 'u7l1-div-first', 'Undo the constant first, then divide by ' + t(m) + '.']],
            'Substitute ' + t('y=' + Y) + ' and ' + t('x=k') + ': ' + t(Y + '=' + m + 'k' + (c < 0 ? '' : '+') + c) + '<br>' + t((Y - c) + '=' + m + 'k') + '<br>' + t('k=' + k) + '.',
            ['The point has ' + t('y=' + Y) + '. Substitute it, then solve for ' + t('k') + '.', 'Undo the constant first, then divide.'], 'NR find k');
        } }] }
    ],

    extra: [
      /* ================= Part A ================= */
      { num: '1', section: 'Extra practice A — Tables with Negative and Fractional Inputs', stem: 'Complete each table of values. The ' + t('x') + '-values are deliberately awkward — keep fractions as fractions and watch every sign.', parts: [
        { id: 'e1a', sub: 'a', level: 'EMG', make: function (r) { var s = ep1a(r); return tablePart('(a) ' + t(siT(s.m, s.b)), s.xs, s.m, s.b, tableSol(s.m, s.b, s.xs), null, 'EP1a'); } },
        { id: 'e1b', sub: 'b', level: 'EMG', make: function (r) { var s = ep1b(r); return tablePart('(b) ' + t(siT(s.m, s.b)), s.xs, s.m, s.b, tableSol(s.m, s.b, s.xs), null, 'EP1b'); } },
        { id: 'e1c', sub: 'c', level: 'PRG', make: function (r) { var s = ep1c(r); return tablePart('(c) ' + t(siT(s.m, s.b)), s.xs, s.m, s.b, tableSol(s.m, s.b, s.xs), ['Multiply the fraction by ' + t('x') + ' first: ' + t('\\frac{a}{b}\\times x=\\frac{a\\times x}{b}') + '. Leave answers that don’t divide evenly as fractions.', 'Then add the constant (write it with the same denominator).'], 'EP1c'); } },
        { id: 'e1d', sub: 'd', level: 'PRG', make: function (r) { var s = ep1d(r); return tablePart('(d) ' + t(siT(s.m, s.b)), s.xs, s.m, s.b, tableSol(s.m, s.b, s.xs), ['Multiply the fraction by ' + t('x') + ' first (watch the signs), then add the constant.', t('\\frac{2}{3}\\times\\frac{3}{2}=1') + ': a fraction times its flip is ' + t('1') + '.'], 'EP1d'); } }] },
      { num: '2', stem: 'Each table has <b>gaps in both rows</b>. Use the given equation to fill every empty cell. Some gaps need you to work forwards (find ' + t('y') + '), others backwards (find ' + t('x') + ').', parts: [
        { id: 'e2a', sub: 'a', level: 'PRG', make: function (r) {
          var a = r.int(2, 6), c = r.int(1, 6), f = function (x) { return a * x - c; }, xs = [-2, -1, 0, 2, 3];
          return gapPart('(a) ' + t(siT(a, -c)) + tbl(['-2', '', '0', '', '3'].map(function (s) { return s === '' ? '' : t(s); }), [f(-2), f(-1), '', f(2), ''].map(function (v) { return v === '' ? '' : t(v); })), a, -c,
            [{ kind: 'x', y: f(-1), x: -1 }, { kind: 'y', x: 0 }, { kind: 'x', y: f(2), x: 2 }, { kind: 'y', x: 3 }], 'EP2a');
        } },
        { id: 'e2b', sub: 'b', level: 'PRG', make: function (r) {
          var a = r.int(2, 4), c = r.int(1, 8), f = function (x) { return -a * x + c; };
          return gapPart('(b) ' + t(siT(-a, c)) + tbl(['-3', '-1', '', '2', ''].map(function (s) { return s === '' ? '' : t(s); }), [f(-3), '', f(0), '', f(5)].map(function (v) { return v === '' ? '' : t(v); })), -a, c,
            [{ kind: 'y', x: -1 }, { kind: 'x', y: f(0), x: 0 }, { kind: 'y', x: 2 }, { kind: 'x', y: f(5), x: 5 }], 'EP2b');
        } }] },
      /* ================= Part B ================= */
      { num: '3', section: 'Extra practice B — Finding the Rule and Testing for Linearity', stem: 'Each table comes from a linear equation. Find the rule and write it in the form ' + t('y=mx+b') + '.', parts: [
        { id: 'e3a', sub: 'a', level: 'EMG', make: function (r) {
          var m = r.pick([2, 3, 4, 5]), b = r.pick(nz(-6, 6)), xs = X5, ys = xs.map(function (x) { return m * x + b; });
          return linePart('(a)' + tbl(xs, ys), m, b, [{ m: b, b: m, code: 'si-swap', hint: 'The change per step (' + t(m) + ') multiplies ' + t('x') + '; the value at ' + t('x=0') + ' (' + t(b) + ') is the constant.' }, { m: m, b: ys[0], code: 'line-intercept', hint: t('b') + ' is the ' + t('y') + '-value when ' + t('x=0') + ', not the first ' + t('y') + ' in the table.' }],
            t('y') + ' goes up by ' + t(m) + ' each step, so ' + t('m=' + m) + '. At ' + t('x=0') + ', ' + t('y=' + b) + ', so ' + t('b=' + b) + ': ' + t(siT(m, b)) + '.', ['How much does ' + t('y') + ' change each time ' + t('x') + ' goes up by ' + t('1') + '? That is ' + t('m') + '.', t('b') + ' is the ' + t('y') + '-value in the ' + t('x=0') + ' column.'], 'EP3a rule');
        } },
        { id: 'e3b', sub: 'b', level: 'EMG', make: function (r) {
          var m = r.pick([-2, -3, -4, -1]), b = r.pick(nz(-5, 7)), xs = X5, ys = xs.map(function (x) { return m * x + b; });
          return linePart('(b)' + tbl(xs, ys), m, b, [{ m: -m, b: b, code: 'line-slope-sign', hint: 'The ' + t('y') + '-values go <b>down</b> as ' + t('x') + ' goes up, so the slope is negative.' }, { m: b, b: m, code: 'si-swap', hint: 'The change per step multiplies ' + t('x') + '; the value at ' + t('x=0') + ' is the constant.' }],
            t('y') + ' goes down by ' + t(-m) + ' each step, so ' + t('m=' + m) + '. At ' + t('x=0') + ', ' + t('y=' + b) + ': ' + t(siT(m, b)) + '.', ['Find the change in ' + t('y') + ' per step of ' + t('1') + ' — with its sign.', 'Read ' + t('b') + ' in the ' + t('x=0') + ' column.'], 'EP3b rule');
        } },
        { id: 'e3c', sub: 'c', level: 'PRG', make: function (r) {
          var m = r.pick([[1, 2], [-1, 2], [3, 2], [-3, 2]]), b = r.pick(nz(-3, 4)), xs = [-4, -2, 0, 2, 4], ys = xs.map(function (x) { return qv(m) * x + b; }), dy = 2 * qv(m);
          return linePart('(c) Here the ' + t('x') + '-values step by ' + t('2') + ', not by ' + t('1') + ' — divide the change in ' + t('y') + ' by the change in ' + t('x') + '.' + tbl(xs, ys), m, b, [{ m: dy, b: b, code: 'u7l1-step2', hint: t('y') + ' changes by ' + t(dy) + ' when ' + t('x') + ' changes by ' + t('2') + '. Slope = ' + t('\\frac{' + dy + '}{2}') + '.' }, { m: [Q(m)[1], Q(m)[0]], b: b, code: 'line-slope-flip', hint: 'Slope is change in ' + t('y') + ' over change in ' + t('x') + ', not the other way round.' }],
            'Each step: ' + t('x') + ' up ' + t('2') + ', ' + t('y') + ' changes ' + t((dy > 0 ? '+' : '') + dy) + '. ' + t('m=\\frac{' + dy + '}{2}=' + qT(m)) + '. At ' + t('x=0') + ', ' + t('y=' + b) + ': ' + t(siT(m, b)) + '.', ['Slope = ' + t('\\frac{\\text{change in }y}{\\text{change in }x}') + ', and here the change in ' + t('x') + ' is ' + t('2') + '.', 'Read ' + t('b') + ' in the ' + t('x=0') + ' column.'], 'EP3c rule step 2');
        } }] },
      { num: '4', shared: function (r) {
          var xs = r.pick([[-3, -1, 0, 3, 5], [-2, 0, 1, 4, 6], [-4, -1, 0, 2, 5], [-3, 0, 1, 3, 4], [-1, 0, 2, 5, 6]]), m = r.pick([2, 3, 4, -2, -3]), b = r.int(-5, 5);
          return { xs: xs, ys: xs.map(function (x) { return m * x + b; }), m: m, b: b, X: r.pick([-8, -6, -10, 7, 8, 10]) };
        },
        stem: function (sh) { var dy = []; for (var i = 1; i < 5; i++) dy.push(sh.ys[i] - sh.ys[i - 1]); return '<b>When first differences mislead.</b> Priya looks at the table below and says “the ' + t('y') + '-values change by ' + dy.map(function (d) { return t((d > 0 ? '+' : '') + d); }).join(', then ') + ' — the jumps are not equal, so this relation is <b>not</b> linear.”' + tbl(sh.xs, sh.ys); }, parts: [
        { id: 'e4a', sub: 'a', level: 'EMG', make: function (r, sh) {
          var dx = []; for (var i = 1; i < 5; i++) dx.push(sh.xs[i] - sh.xs[i - 1]);
          return mc(r, '(a) What is the flaw in Priya’s reasoning?', [
            { html: 'She compared the changes in ' + t('y') + ' without looking at the changes in ' + t('x') + '. The ' + t('x') + '-steps are ' + t(dx.join(',\\ ')) + ' — not equal — so the ' + t('y') + '-jumps can’t be compared directly.', right: true },
            { html: 'She subtracted the ' + t('y') + '-values in the wrong order.', why: 'Her differences are right. The problem is that the ' + t('x') + '-values don’t go up in equal steps.' },
            { html: 'Nothing — unequal jumps in ' + t('y') + ' always mean the relation is not linear.', why: 'Only when the ' + t('x') + '-steps are equal. Here they are ' + t(dx.join(',\\ ')) + '.' },
            { html: 'She should have added the ' + t('y') + '-values instead.', why: 'Adding doesn’t test linearity. Compare each change in ' + t('y') + ' with its change in ' + t('x') + '.' }],
            'The ' + t('x') + '-steps are ' + t(dx.join(',\\ ')) + '. Equal ' + t('y') + '-jumps only test linearity when the ' + t('x') + '-steps are equal; otherwise compare ' + t('\\frac{\\text{change in }y}{\\text{change in }x}') + '.', ['Look at the ' + t('x') + '-row: how big is each step?'], 'EP4a Priya flaw');
        } },
        { id: 'e4b', sub: 'b', level: 'PRG', make: function (r, sh) {
          var fl = [], ch = [], keys = [], rows = [];
          for (var i = 1; i < 5; i++) {
            var dx = sh.xs[i] - sh.xs[i - 1], dy = sh.ys[i] - sh.ys[i - 1];
            fl.push({ label: 'From ' + t('x=' + sh.xs[i - 1]) + ' to ' + t('x=' + sh.xs[i]) + ':', name: 'rate ' + i, mode: 'math', keys: 'fraction' });
            ch.push((function (dx, dy) { return K.value(sh.m, { diag: function (v) { if (dx !== 1 && near(v, dy)) return { code: 'dy-only', hint: 'Divide the change in ' + t('y') + ' (' + t(dy) + ') by the change in ' + t('x') + ' (' + t(dx) + ').' }; if (near(v, dx / dy)) return { code: 'rate-flip', hint: 'Change in ' + t('y') + ' goes on top.' }; return null; } }); })(dx, dy));
            keys.push(String(sh.m)); rows.push(t('\\frac{' + dy + '}{' + dx + '}=' + sh.m));
          }
          var p = B.fields('(b) For each pair of neighbouring columns, compute ' + t('\\dfrac{\\text{change in }y}{\\text{change in }x}') + '.', fl, ch, keys, 'All four are ' + t(sh.m), rows.join(', &nbsp;') + '. The rate is the same every time, ' + t(sh.m) + ', so the relation <b>is</b> linear.',
            ['Subtract neighbouring ' + t('y') + '-values, subtract the matching ' + t('x') + '-values, then divide.'], 'EP4b rates');
          p.bad = [[1, 2, 3, 4].map(function (i) { return String(sh.ys[i] - sh.ys[i - 1]); })].filter(function (b) { return b.some(function (v) { return v !== String(sh.m); }); });
          return p;
        } },
        { id: 'e4c', sub: 'c i', level: 'PRG', make: function (r, sh) {
          return linePart('Write the equation of the relation.', sh.m, sh.b, [{ m: sh.ys[1] - sh.ys[0], b: sh.b, code: 'dy-only', hint: 'The slope is the rate from part (b), not a single jump in ' + t('y') + '.' }],
            'The rate is ' + t(sh.m) + ' and the table shows ' + t('y=' + sh.b) + ' at ' + t('x=0') + ': ' + t(siT(sh.m, sh.b)) + '.', ['Use the rate from part (b) as ' + t('m') + '.', 'Find ' + t('b') + ' in the ' + t('x=0') + ' column.'], 'EP4c equation');
        } },
        { id: 'e4d', sub: 'c ii', level: 'PRG', make: function (r, sh) {
          var X = sh.X, ans = sh.m * X + sh.b;
          return numPart('Use your equation to find ' + t('y') + ' when ' + t('x=' + X) + '.', ans, tvDiag(sh.m, sh.b, X), t('y=' + subT(sh.m, sh.b, X) + '=' + ans) + '.', ['Substitute ' + t('x=' + X) + ' into ' + t(siT(sh.m, sh.b)) + '.'], 'EP4c y at X', { before: t('y=') });
        } }] },
      { num: '5', shared: function (r) {
          var c = r.int(-3, 4), sft = r.pick([0, 1, -1]), base = r.pick([2, 2, 3]), k = base === 3 ? 1 : r.int(1, 5), am = r.int(2, 4), ac = r.int(-2, 5), dm = r.pick([[2, 1], [-2, 1], [1, 2], [3, 2], [-1, 2], [3, 1]]), dc = r.int(-3, 4);
          var T = { a: { xs: [0, 1, 2, 3] }, b: { xs: [-1, 0, 1, 2] }, c: { xs: [1, 2, 3, 4] }, d: { xs: [-2, 0, 2, 4] } };
          T.a.ys = T.a.xs.map(function (x) { return (x + sft) * (x + sft) + c; }); T.a.lin = false;
          T.b.ys = T.b.xs.map(function (x) { return -am * x + ac; }); T.b.lin = true; T.b.m = -am; T.b.b = ac;
          var x0c = r.pick([0, 1]), half = base === 2 && r.chance(0.25); T.c.xs = [x0c, x0c + 1, x0c + 2, x0c + 3];
          T.c.ys = T.c.xs.map(function (x) { return half ? k * Math.pow(2, 5 - x) : k * Math.pow(base, x); }); T.c.lin = false; T.c.base = base; T.c.half = half;
          T.d.ys = T.d.xs.map(function (x) { return qv(dm) * x + dc; }); T.d.lin = true; T.d.m = Q(dm); T.d.b = dc;
          return T;
        },
        stem: 'Decide whether each table is <b>linear</b> or <b>non-linear</b>. Justify with a rate, not just a glance: type the rate ' + t('\\frac{\\text{change in }y}{\\text{change in }x}') + ' if it is the same between every pair of columns, or press <b>none</b> if it isn’t. For the linear ones, write the equation.', parts: (function () {
        function ratePart(L, lev) {
          return { id: 'e5' + L, sub: L, level: lev, make: function (r, T) {
            var o = T[L], dx = [], dy = [];
            for (var i = 1; i < 4; i++) { dx.push(o.xs[i] - o.xs[i - 1]); dy.push(o.ys[i] - o.ys[i - 1]); }
            var rates = dy.map(function (d, i) { return Q(d, dx[i]); });
            var sol = 'Changes in ' + t('y') + ': ' + t(dy.map(function (d) { return (d > 0 ? '+' : '') + d; }).join(',\\ ')) + (dx[0] !== 1 ? ' over steps of ' + t(dx[0]) + ' in ' + t('x') + '; rates ' + t(rates.map(qT).join(',\\ ')) : '') + '. ' + (o.lin ? 'The rate is always ' + t(qT(o.m)) + ': <b>linear</b>.' : 'The rate keeps changing (' + t(rates.map(qT).join(',\\ ')) + '): <b>non-linear</b>' + (L === 'c' ? ' — ' + t('y') + (o.half ? ' is halved each step.' : ' is multiplied by ' + t(o.base) + ' each step.') : '.'));
            var p = B.fields('(' + L + ')' + tbl(o.xs, o.ys), [{ label: 'Rate (or none)', name: 'rate', mode: 'math', keys: 'slope', none: true, placeholder: 'e.g. 3, -1/2, or none' }], [rateOrNone(o.xs, o.ys, o.lin, o.m)], [o.lin ? qT(o.m) : 'none'],
              o.lin ? 'Linear, rate ' + t(qT(o.m)) : 'Non-linear', sol, ['Work out the change in ' + t('y') + ' for each step' + (dx[0] !== 1 ? ' and divide by the step in ' + t('x') + ' (' + t(dx[0]) + ')' : '') + '.', 'Linear means the rate is the same every time.'], 'EP5' + L + ' rate');
            p.bad = o.lin ? [['none']] : [[qT(rates[0])]];
            return p;
          } };
        }
        function eqPart(L, lev) {
          return { id: 'e5' + L + '2', sub: L + ' (equation)', level: lev, make: function (r, T) {
            var o = T[L];
            return linePart('Table (' + L + ') is linear: write its equation.' + tbl(o.xs, o.ys), o.m, o.b, [{ m: o.b, b: qv(o.m), code: 'si-swap', hint: 'The rate multiplies ' + t('x') + '; the value at ' + t('x=0') + ' is the constant.' }].concat(L === 'd' ? [{ m: 2 * qv(o.m), b: o.b, code: 'u7l1-step2', hint: t('x') + ' goes up by ' + t('2') + ' each column: divide the change in ' + t('y') + ' by ' + t('2') + '.' }] : []),
              'Rate ' + t('m=' + qT(o.m)) + '; at ' + t('x=0') + ', ' + t('y=' + o.b) + ': ' + t(siT(o.m, o.b)) + '.', ['The rate is ' + t('m') + '; the ' + t('y') + '-value at ' + t('x=0') + ' is ' + t('b') + '.'], 'EP5' + L + ' equation');
          } };
        }
        return [ratePart('a', 'EMG'), ratePart('b', 'EMG'), eqPart('b', 'EMG'), ratePart('c', 'EMG'), ratePart('d', 'PRG'), eqPart('d', 'PRG')];
      })() },
      { num: '6', parts: [
        { id: 'e6', level: 'EMG', make: function (r) {
          var b = r.pick([2, 2, 3]), k = b === 3 ? r.int(1, 2) : r.int(1, 6), x0 = r.int(0, b === 3 ? 1 : 2), xs = [x0, x0 + 1, x0 + 2, x0 + 3], ys = xs.map(function (x) { return k * Math.pow(b, x); });
          return mc(r, 'Riley sees the table ' + t('x:\\ ' + seqT(xs)) + ' with ' + t('y:\\ ' + seqT(ys)) + ' and says “there is a clear pattern, so the relation must be linear.” Which reply is correct?', [
            { html: 'A pattern only has to be predictable. Linear means the rate ' + t('\\frac{\\text{change in }y}{\\text{change in }x}') + ' is the <b>same</b> between every pair of columns. Here ' + t('y') + ' is multiplied by ' + t(b) + ' each step, so the changes keep growing — not linear.', right: true },
            { html: 'Riley is right: any table with a pattern is linear.', why: 'Squares and doubling are patterns too, and their graphs curve. Check the changes in ' + t('y') + '.' },
            { html: 'It isn’t linear because the ' + t('y') + '-values are all even.', why: 'Even or odd doesn’t matter. What matters is whether the change in ' + t('y') + ' is constant.' },
            { html: 'It is linear because the ' + t('x') + '-values go up by ' + t('1') + ' each time.', why: 'Equal ' + t('x') + '-steps are needed to compare, but the ' + t('y') + '-changes must also be equal.' }],
            'Changes in ' + t('y') + ': ' + t([1, 2, 3].map(function (i) { return '+' + (ys[i] - ys[i - 1]); }).join(',\\ ')) + ' — not constant. A linear table has the same rate between every pair of columns; this one is multiplied by ' + t(b) + ' each time, so its graph curves.', ['Find the change in ' + t('y') + ' from each column to the next.'], 'EP6 pattern vs linear');
        } }] },
      /* ================= Part C ================= */
      { num: '7', section: 'Extra practice C — Plotting from a Table, and Reading a Graph', stem: 'For each equation: complete the table, plot the points, and draw the line right across the grid. Then describe the pattern.',
        shared: function (r) {
          var a = pickWhere(function () { var m = r.pick([[1, 2], [-1, 2], [1, 2], [-1, 2], [3, 2], [-3, 2], [1, 3], [-1, 3]]), b = r.int(-4, 4); return { m: m, b: b, xs: m[1] === 3 ? [-6, -3, 0, 3, 6] : [-4, -2, 0, 2, 4] }; }, function (o) { return Math.abs(qv(o.m) * o.xs[4]) + Math.abs(o.b) <= 6; });
          var xs = r.pick([[-1, 0, 1, 2, 3], [-2, -1, 0, 1, 2]]);
          var bb = pickWhere(function () { return { m: -r.pick([1, 2, 2, 3]), b: r.int(-6, 7) }; }, function (o) { return xs.every(function (x) { return Math.abs(o.m * x + o.b) <= 8; }); });
          return { a: a, b: { m: bb.m, b: bb.b, xs: xs } };
        }, parts: [
        { id: 'e7a', sub: 'a i', level: 'EMG', make: function (r, sh) { var xs = sh.a.xs; return tablePart('Complete the table for ' + t(siT(sh.a.m, sh.a.b)) + '.', xs, sh.a.m, sh.a.b, tableSol(sh.a.m, sh.a.b, xs), null, 'EP7a table'); } },
        { id: 'e7a2', sub: 'a ii', level: 'EMG', make: function (r, sh) { var xs = sh.a.xs; return graphPart('Plot the points and draw the line for ' + t(siT(sh.a.m, sh.a.b)) + '.', sh.a.m, sh.a.b, xs, { x: [-6, 6], y: [-6, 6] }, 'Plot ' + xs.map(function (x) { return t(ptT([x, qv(evalL(sh.a.m, sh.a.b, x))])); }).join(', ') + ' and join them with one line, arrows at both ends.', ['Each column of your table is a point.'], 'EP7a graph'); } },
        { id: 'e7a3', sub: 'a iii', level: 'PRG', make: function (r, sh) { return patternPart('Describe the pattern of ' + t(siT(sh.a.m, sh.a.b)) + '.', sh.a.m, sh.a.b, sh.a.xs[1] - sh.a.xs[0], 'EP7a pattern'); } },
        { id: 'e7b', sub: 'b i', level: 'BEG', make: function (r, sh) { return tablePart('Complete the table for ' + t(siT(sh.b.m, sh.b.b)) + '.', sh.b.xs, sh.b.m, sh.b.b, tableSol(sh.b.m, sh.b.b, sh.b.xs), null, 'EP7b table'); } },
        { id: 'e7b2', sub: 'b ii', level: 'BEG', make: function (r, sh) { return graphPart('Plot the points and draw the line for ' + t(siT(sh.b.m, sh.b.b)) + '.', sh.b.m, sh.b.b, sh.b.xs, { x: [-6, 6], y: [-8, 8] }, 'Plot ' + sh.b.xs.map(function (x) { return t(ptT([x, sh.b.m * x + sh.b.b])); }).join(', ') + ' and join them with one line, arrows at both ends.', ['Each column of your table is a point.'], 'EP7b graph'); } },
        { id: 'e7b3', sub: 'b iii', level: 'EMG', make: function (r, sh) { return patternPart('Describe the pattern of ' + t(siT(sh.b.m, sh.b.b)) + '.', sh.b.m, sh.b.b, 1, 'EP7b pattern'); } }] },
      { num: '8', stem: 'Each line below is already drawn. Read the graph to complete the table, then write the equation of the line.',
        shared: function (r) {
          var xa = [-1, 0, 1, 2, 3], a = pickWhere(function () { return { m: r.pick([2, 3, -2, 1, -1, -3]), b: r.int(-4, 4) }; }, function (o) { return xa.every(function (x) { return Math.abs(o.m * x + o.b) <= 5; }); });
          var xb = [-4, -2, 0, 2, 4], b = pickWhere(function () { return { m: r.pick([[-1, 2], [1, 2], [-1, 2], [1, 2], [3, 2], [-3, 2]]), b: r.int(-4, 4) }; }, function (o) { return xb.every(function (x) { return Math.abs(qv(o.m) * x + o.b) <= 6; }); });
          return { a: { m: a.m, b: a.b, xs: xa }, b: { m: b.m, b: b.b, xs: xb } };
        }, parts: [
        { id: 'e8a', sub: 'a i', level: 'BEG', make: function (r, sh) { var o = sh.a; return tablePart('Read graph (a) to complete the table.' + lineFig(o.m, o.b), o.xs, o.m, o.b, 'Read each point of the line at those ' + t('x') + '-values: ' + o.xs.map(function (x) { return t(ptT([x, o.m * x + o.b])); }).join(', ') + '.', ['Go across to the ' + t('x') + '-value, then up or down to the line. Read the ' + t('y') + '-value there.'], 'EP8a read table'); } },
        { id: 'e8a2', sub: 'a ii', level: 'EMG', make: function (r, sh) { var o = sh.a; return linePart('Write the equation of line (a).' + lineFig(o.m, o.b, { max: 220 }), o.m, o.b, [{ m: o.b, b: o.m, code: 'si-swap', hint: 'The change per step multiplies ' + t('x') + '; where the line crosses the ' + t('y') + '-axis is the constant.' }, { m: -o.m, b: o.b, code: 'line-slope-sign', hint: 'Does the line rise or fall from left to right?' }], 'From the table, ' + t('y') + ' changes by ' + t(o.m) + ' per step of ' + t('1') + ', and the line crosses the ' + t('y') + '-axis at ' + t(ptT([0, o.b])) + ': ' + t(siT(o.m, o.b)) + '.', ['Use your table: the change per step is ' + t('m') + ', the value at ' + t('x=0') + ' is ' + t('b') + '.'], 'EP8a equation'); } },
        { id: 'e8b', sub: 'b i', level: 'BEG', make: function (r, sh) { var o = sh.b; return tablePart('Read graph (b) to complete the table.' + lineFig(o.m, o.b), o.xs, o.m, o.b, 'Read each point of the line at those ' + t('x') + '-values: ' + o.xs.map(function (x) { return t(ptT([x, qv(o.m) * x + o.b])); }).join(', ') + '.', ['Go across to the ' + t('x') + '-value, then up or down to the line.'], 'EP8b read table'); } },
        { id: 'e8b2', sub: 'b ii', level: 'PRG', make: function (r, sh) { var o = sh.b, d = 2 * qv(o.m); return linePart('Write the equation of line (b).' + lineFig(o.m, o.b, { max: 220 }), o.m, o.b, [{ m: d, b: o.b, code: 'u7l1-step2', hint: 'In your table ' + t('x') + ' steps by ' + t('2') + ': divide the change in ' + t('y') + ' (' + t(d) + ') by ' + t('2') + '.' }, { m: [Q(o.m)[1] * (qv(o.m) < 0 ? -1 : 1), Math.abs(Q(o.m)[0])], b: o.b, code: 'line-slope-flip', hint: 'Slope is the change in ' + t('y') + ' over the change in ' + t('x') + '.' }], 'In the table ' + t('x') + ' steps by ' + t('2') + ' and ' + t('y') + ' changes by ' + t(d) + ': ' + t('m=\\frac{' + d + '}{2}=' + qT(o.m)) + '. It crosses at ' + t(ptT([0, o.b])) + ': ' + t(siT(o.m, o.b)) + '.', ['Slope = change in ' + t('y') + ' ÷ change in ' + t('x') + ' — here the ' + t('x') + '-step is ' + t('2') + '.'], 'EP8b equation'); } }] },
      /* ================= Part D ================= */
      { num: '9', section: 'Extra practice D — Working Backwards, Errors, and Applications', stem: 'Work backwards: determine the ' + t('x') + '-value that produces the given ' + t('y') + '-value.', parts: (function () {
        function back(id, sub, lev, gen) {
          return { id: id, sub: sub, level: lev, make: function (r) {
            var g = gen(r), m = g.m, c = g.c, x = g.x, Y = qv(evalL(m, c, x)), mv = qv(m);
            var list = [[mv * Y + c, 'sub-swap', t(Y) + ' is the <b>' + t('y') + '</b>-value: substitute it for ' + t('y') + ' and solve for ' + t('x') + '.'], [(Y + c) / mv, 'u7l1-undo-sign', 'To undo ' + t((c > 0 ? '+' : '') + c) + ', ' + (c > 0 ? 'subtract' : 'add') + ' ' + t(Math.abs(c)) + ' on both sides.'], [Y - c, 'no-divide', 'You have ' + t(term(m, 'x', true) + '=' + (Y - c)) + ' — now divide by ' + t(qT(m)) + '.'], [-x, 'sign', 'Check the sign: dividing by a ' + (mv < 0 ? 'negative' : 'positive') + ' number.']];
            if (Array.isArray(m)) list.push([(Y - c) * mv, 'u7l1-tv-frac', 'To undo “multiply by ' + t(qT(m)) + '”, multiply by its reciprocal ' + t(qT([Q(m)[1], Q(m)[0]])) + '.']);
            return numPart('(' + sub + ') ' + t(siT(m, c)) + '; find ' + t('x') + ' when ' + t('y=' + Y) + '.', x, list,
              t(Y + '=' + lin([[m, 'x'], [c, '']])) + '<br>' + t((Y - c) + '=' + term(m, 'x', true)) + '<br>' + t('x=' + (Array.isArray(m) ? (Y - c) + '\\times' + prn([Q(m)[1], Q(m)[0]]) : '\\frac{' + (Y - c) + '}{' + qT(m) + '}') + '=' + x) + '.',
              ['Substitute the ' + t('y') + '-value, then solve: undo the constant first, then the ' + t('x') + '-coefficient.'], 'EP9' + sub, { before: t('x=') });
          } };
        }
        return [
          back('e9a', 'a', 'PRG', function (r) { return pickWhere(function () { return { m: r.int(2, 6), c: -r.int(1, 9), x: r.int(3, 12) }; }, function (o) { var Y = o.m * o.x + o.c; return Y > 0 && Y <= 60; }); }),
          back('e9b', 'b', 'PRG', function (r) { return pickWhere(function () { return { m: -r.int(2, 5), c: r.int(1, 9), x: -r.int(3, 10) }; }, function (o) { return o.m * o.x + o.c <= 50; }); }),
          back('e9c', 'c', 'ADV', function (r) { return pickWhere(function () { var q = r.pick([2, 3, 4]), p = r.pick([1, 2, 3].filter(function (v) { return gcd(v, q) === 1; })); return { m: [p, q], c: r.int(1, 9), x: q * r.int(2, 12) }; }, function (o) { return qv(o.m) * o.x + o.c <= 40; }); }),
          back('e9d', 'd', 'PRG', function (r) { return pickWhere(function () { return { m: r.int(2, 7), c: r.int(1, 9), x: -r.int(2, 8) }; }, function (o) { return o.m * o.x + o.c < -3; }); })];
      })() },
      { num: '10', parts: [
        { id: 'e10', level: 'PRG', make: function (r) {
          var o = pickWhere(function () { return { m: r.pick([2, 3, 4, 5, -2, -3]), b: r.pick(nz(-5, 6)), x1: r.int(1, 3), d: r.int(2, 4), X: r.pick([10, 9, 8]) }; }, function (o) { return o.x1 + o.d < o.X; });
          var x2 = o.x1 + o.d, P1 = [o.x1, o.m * o.x1 + o.b], P2 = [x2, o.m * x2 + o.b], ans = o.m * o.X + o.b, dy = P2[1] - P1[1];
          var p = B.fields('A linear relation contains the points ' + t(ptT(P1)) + ' and ' + t(ptT(P2)) + '. Without graphing, find the rate of change and the ' + t('y') + '-value when ' + t('x=' + o.X) + '.',
            [{ label: 'Rate of change', name: 'rate', mode: 'math', keys: 'fraction' }, { label: t('y') + ' when ' + t('x=' + o.X), name: 'y', before: t('y=') }],
            [K.value(o.m, { diag: function (v) { if (near(v, dy)) return { code: 'dy-only', hint: 'Divide the change in ' + t('y') + ' (' + t(dy) + ') by the change in ' + t('x') + ' (' + t(o.d) + ').' }; if (near(v, o.d / dy)) return { code: 'rate-flip', hint: 'Change in ' + t('y') + ' on top.' }; return null; } }),
              K.number(ans, dl([[o.m * o.X, 'u7l1-tv-no-b', 'Multiplying the rate by ' + t(o.X) + ' assumes the line passes through the origin. Start from a known point and step to ' + t('x=' + o.X) + '.'], [P2[1] + o.m * (o.X - x2) + o.m, 'u7l1-next-one', 'Count the steps from ' + t('x=' + x2) + ' to ' + t('x=' + o.X) + ' again: there are ' + t(o.X - x2) + '.']], ans))],
            [String(o.m), String(ans)], 'rate ' + t(o.m) + '; ' + t('y=' + ans),
            'Rate ' + t('=\\frac{' + P2[1] + '-' + prn(P1[1]) + '}{' + x2 + '-' + o.x1 + '}=\\frac{' + dy + '}{' + o.d + '}=' + o.m) + '.<br>From ' + t(ptT(P2)) + ', ' + t('x') + ' goes up ' + t(o.X - x2) + ' more, so ' + t('y') + ' changes by ' + t(o.m + '\\times' + (o.X - x2) + '=' + o.m * (o.X - x2)) + ': ' + t('y=' + P2[1] + (o.m * (o.X - x2) < 0 ? '' : '+') + o.m * (o.X - x2) + '=' + ans) + '. (The rule is ' + t(siT(o.m, o.b)) + '.)',
            ['Rate = change in ' + t('y') + ' ÷ change in ' + t('x') + '.', 'From the second point, count how many steps of ' + t('1') + ' it is to ' + t('x=' + o.X) + '.'], 'EP10 two points');
          p.bad = [[String(dy), String(ans)], [String(o.m), String(o.m * o.X)]];
          return p;
        } }] },
      { num: '11', shared: function (r) { return { a: r.int(2, 5), c: r.int(1, 7), X: r.int(3, 7) }; },
        stem: function (sh) { var wrongY = (sh.X + sh.c) / sh.a; return '<b>Error analysis.</b> For ' + t('y=' + sh.a + 'x-' + sh.c) + ', Jordan wanted the point where ' + t('x=' + sh.X) + ', but wrote ' + t(sh.X + '=' + sh.a + 'y-' + sh.c) + ' and got ' + t('y=' + qT(Q(sh.X + sh.c, sh.a))) + '.'; }, parts: [
        { id: 'e11a', sub: 'a', level: 'EMG', make: function (r, sh) {
          return mc(r, '(a) What did Jordan do wrong?', [
            { html: 'He substituted ' + t(sh.X) + ' for ' + t('y') + ' instead of for ' + t('x') + '. The given number belongs in the ' + t('x') + '-slot: ' + t('y=' + sh.a + '(' + sh.X + ')-' + sh.c) + '.', right: true },
            { html: 'He should have added ' + t(sh.c) + ' instead of subtracting it.', why: 'The equation does subtract ' + t(sh.c) + '. Look at where Jordan put the ' + t(sh.X) + '.' },
            { html: 'Nothing — swapping ' + t('x') + ' and ' + t('y') + ' gives the same point.', why: 'Swapping changes the equation: ' + t(sh.X + '=' + sh.a + 'y-' + sh.c) + ' is a different line from ' + t('y=' + sh.a + 'x-' + sh.c) + '.' },
            { html: 'He multiplied when he should have divided.', why: 'The real problem comes first: which variable did he replace with ' + t(sh.X) + '?' }],
            'The question gives ' + t('x=' + sh.X) + ', so ' + t(sh.X) + ' replaces ' + t('x') + ': ' + t('y=' + sh.a + '(' + sh.X + ')-' + sh.c + '=' + (sh.a * sh.X - sh.c)) + '. Jordan put it in place of ' + t('y') + '.', ['Which variable does the question give a value for?'], 'EP11 Jordan swap');
        } },
        { id: 'e11b', sub: 'b', level: 'EMG', make: function (r, sh) {
          var P = [sh.X, sh.a * sh.X - sh.c];
          return ptPart('(b) Give the correct ordered pair.', P, { wrong: [{ is: [sh.X, Q(sh.X + sh.c, sh.a)], code: 'sub-swap', hint: 'That is Jordan’s answer — substitute ' + t(sh.X) + ' for ' + t('x') + '.' }] },
            t('y=' + sh.a + '(' + sh.X + ')-' + sh.c + '=' + P[1]) + ', so the point is ' + t(ptT(P)) + '.', ['Substitute ' + t('x=' + sh.X) + ' and simplify.'], 'EP11 correct pair');
        } }] },
      { num: '12', stem: 'Determine whether each point lies on the given line. Substitute carefully — some coordinates are fractions.', parts: [
        { id: 'e12', level: 'PRG', make: function (r) {
          var k = r.pick([2, 4, 6]), ca = r.int(1, 5), q = r.pick([2, 3, 4]), p = r.pick([1, 2, 3].filter(function (v) { return gcd(v, q) === 1 && v < q * 2; })), cb = r.int(1, 3), pc = r.pick([1, 3, 5]), cc = r.int(2, 9), X = r.pick([-4, -2, 2, 4]);
          var A = { m: -k, b: ca, P: [[-1, 2], k / 2 + ca] }, Bq = { m: q, b: -cb, P: [[p, q], p - cb + r.pick([-1, 1])] }, C = { m: [-pc, 2], b: cc, P: [X, -pc * X / 2 + cc] };
          var all = [A, Bq, C], ids = ['a', 'b', 'c'], want = {};
          all.forEach(function (o, i) { o.v = qv(evalL(o.m, o.b, o.P[0])); want[ids[i]] = near(o.v, qv(o.P[1])) ? 'y' : 'n'; });
          var rows = all.map(function (o, i) { return { id: ids[i], html: '(' + ids[i] + ') ' + t(ptT(o.P)) + ' on ' + t(siT(o.m, o.b)) }; });
          return B.grid('Does each point lie on its line?', rows, [{ id: 'y', html: 'Yes' }, { id: 'n', html: 'No' }], want, {
            why: function (row) { var o = all[ids.indexOf(row)]; return { code: 'u7l1-pt-arith', hint: 'Recheck (' + row + '): ' + t(subT(o.m, o.b, o.P[0])) + ' — a fraction times a whole number: multiply, then simplify.' }; } },
            all.map(function (o, i) { return '(' + ids[i] + ') ' + t(subT(o.m, o.b, o.P[0]) + '=' + qT(Q(Math.round(o.v * 6), 6))) + (want[ids[i]] === 'y' ? ' ✓ yes' : t('\\ne ' + qT(o.P[1])) + ' — no'); }).join('<br>'),
            ['Substitute the ' + t('x') + '-coordinate and compare with the ' + t('y') + '-coordinate.', t('-' + k + '\\times\\left(-\\frac{1}{2}\\right)=' + k / 2) + ': a negative times a negative is positive.'], 'EP12 fraction points');
        } }] },
      { num: '13', shared: ep13, stem: function (s) { return 'A print shop charges a fixed setup fee plus a cost per poster. The table shows the total cost ' + t('C') + ', in dollars, for ' + t('n') + ' posters.' + tbl([0, 2, 5, '', 12], [s.F, '', s.F + 5 * s.rate, s.F + s.n4 * s.rate, ''], 'n', 'C'); }, parts: [
        { id: 'e13a', sub: 'a', level: 'PRG', make: function (r, s) {
          var C2 = s.F + 2 * s.rate, C12 = s.F + 12 * s.rate, Cn = s.F + s.n4 * s.rate;
          var p = B.fields('(a) Fill in the three missing entries.', [{ label: t('C') + ' when ' + t('n=2'), name: 'C at n = 2', before: t('C=') }, { label: t('n') + ' when ' + t('C=' + Cn), name: 'n at C = ' + Cn, before: t('n=') }, { label: t('C') + ' when ' + t('n=12'), name: 'C at n = 12', before: t('C=') }],
            [K.number(C2, dl([[2 * s.rate, 'u7l1-tv-no-b', 'Include the setup fee of ' + t(s.F) + ' dollars.'], [s.F + 2, 'u7l1-next-one', 'Each poster adds ' + t(s.rate) + ' dollars, not ' + t('1') + '.']], C2)),
              K.number(s.n4, dl([[Cn / s.rate, 'u7l1-gap-undo', 'Subtract the setup fee first: ' + t(Cn + '-' + s.F + '=' + (Cn - s.F)) + ', then divide by ' + t(s.rate) + '.'], [Cn - s.F, 'no-divide', 'That is the cost of the posters alone — divide by ' + t(s.rate) + ' dollars per poster.']], s.n4)),
              K.number(C12, dl([[12 * s.rate, 'u7l1-tv-no-b', 'Include the setup fee.'], [s.F + 5 * s.rate + 7, 'u7l1-next-one', 'From ' + t('n=5') + ' to ' + t('n=12') + ' is 7 more posters at ' + t(s.rate) + ' dollars each.']], C12))],
            [String(C2), String(s.n4), String(C12)], t('C=' + C2) + ', ' + t('n=' + s.n4) + ', ' + t('C=' + C12),
            'From ' + t('n=0') + ' to ' + t('n=5') + ' the cost rises ' + t(5 * s.rate) + ' dollars: ' + t(s.rate) + ' dollars per poster.<br>' + t('n=2') + ': ' + t(s.F + '+2(' + s.rate + ')=' + C2) + '. &nbsp;' + t('C=' + Cn) + ': ' + t('\\frac{' + Cn + '-' + s.F + '}{' + s.rate + '}=' + s.n4) + ' posters. &nbsp;' + t('n=12') + ': ' + t(s.F + '+12(' + s.rate + ')=' + C12) + '.',
            ['Find the cost per poster from two complete columns.', 'Total = setup fee + cost per poster × number of posters.'], 'EP13 fill table');
          p.bad = [[String(2 * s.rate), String(s.n4), String(C12)]];
          return p;
        } },
        { id: 'e13b', sub: 'b', level: 'EMG', make: function (r, s) {
          var p = B.fields('(b) State the cost per poster and the setup fee.', [{ label: 'Cost per poster', name: 'cost per poster', before: '$' }, { label: 'Setup fee', name: 'setup fee', before: '$' }],
            [K.number(s.rate, dl([[5 * s.rate, 'u7l1-rate-total', 'That’s the cost of 5 posters. Divide by 5 for one poster.'], [s.F, 'fee-wrong', 'That’s the setup fee — the cost when ' + t('n=0') + '.']], s.rate)), K.number(s.F, dl([[s.rate, 'fee-wrong', 'That’s the cost per poster. The setup fee is what you pay for ' + t('0') + ' posters.'], [s.F + 5 * s.rate, 'rate-fee', 'That’s the cost of 5 posters. The fee is the cost when ' + t('n=0') + '.']], s.F))],
            [String(s.rate), String(s.F)], '$' + s.rate + ' per poster; setup fee $' + s.F,
            'The cost rises ' + t(5 * s.rate) + ' dollars over ' + t('5') + ' posters: ' + t(s.rate) + ' dollars per poster. The setup fee is the cost when ' + t('n=0') + ': ' + t(s.F) + ' dollars.', ['The fee is the cost of zero posters.', 'Cost per poster = change in cost ÷ change in posters.'], 'EP13 rate and fee');
          p.bad = [[String(s.F), String(s.rate)]];
          return p;
        } },
        { id: 'e13c', sub: 'c', level: 'EMG', make: function (r, s) {
          return linePart('(c) Write the equation relating ' + t('C') + ' and ' + t('n') + '.', s.rate, s.F, [{ m: s.F, b: s.rate, code: 'fee-wrong', hint: 'The cost per poster multiplies ' + t('n') + '; the fixed fee is added on.' }, { m: s.rate, b: 0, code: 'u7l1-tv-no-b', hint: 'Add the setup fee.' }],
            'Cost per poster ' + t(s.rate) + ', fee ' + t(s.F) + ': ' + t('C=' + s.rate + 'n+' + s.F) + '.', ['Total cost = (cost per poster)' + t('\\times n') + ' + setup fee.'], 'EP13 equation', { vars: ['n', 'C'] });
        } },
        { id: 'e13d', sub: 'd', level: 'PRG', make: function (r, s) {
          var N = s.n4 + r.int(3, 9), T = s.F + N * s.rate;
          return numPart('(d) How many posters can be printed for exactly $' + T + '?', N, [[T / s.rate, 'u7l1-gap-undo', 'Take off the setup fee first: ' + t(T + '-' + s.F) + ', then divide by ' + t(s.rate) + '.'], [T - s.F, 'no-divide', 'That’s the money for the posters — divide by ' + t(s.rate) + ' dollars each.'], [s.rate * T + s.F, 'sub-swap', t(T) + ' is the cost ' + t('C') + ', not the number of posters.']],
            t(s.rate + 'n+' + s.F + '=' + T) + '<br>' + t(s.rate + 'n=' + (T - s.F)) + '<br>' + t('n=' + N) + ' posters.', ['Set ' + t('C=' + T) + ' in your equation and solve for ' + t('n') + '.'], 'EP13 posters for T', { after: 'posters' });
        } }] },
      { num: '14', shared: function (r) { var rt = r.int(2, 6), T = r.int(15, 25), xs = r.pick([[0, 3, 5, 10, 12], [0, 2, 5, 9, 12], [0, 4, 6, 10, 13]]); return { r: rt, V0: rt * T, T: T, ts: xs, tc: r.pick([7, 8, 9, 11]) }; },
        stem: function (s) { return 'A tank is draining at a steady rate. The readings below were <b>not</b> taken at equal time intervals.' + tbl(s.ts.map(function (x) { return x; }), s.ts.map(function (x) { return s.V0 - s.r * x; }), 't\\text{ (min)}', 'V\\text{ (L)}'); }, parts: [
        { id: 'e14a', sub: 'a', level: 'PRG', outcome: 'RF3', make: function (r, s) {
          var d1 = s.ts[1] - s.ts[0];
          return numPart('(a) The tank drains at a constant rate. State the rate of change of ' + t('V') + ', in litres per minute.', -s.r, [[s.r, 'u7l1-rate-sign', 'The volume is going <b>down</b>, so the rate of change is negative.'], [-s.r * d1, 'u7l1-rate-total', 'That is the change over the first ' + t(d1) + ' minutes. Divide by ' + t(d1) + ' for one minute.'], [s.r * d1, 'u7l1-rate-total', 'Divide by the number of minutes, and remember the volume is decreasing.']],
            s.ts.slice(1).map(function (x, i) { var a = s.ts[i]; return t('\\frac{' + (s.V0 - s.r * x) + '-' + (s.V0 - s.r * a) + '}{' + x + '-' + a + '}=' + (-s.r)); }).join(', ') + ': the same every time, so the tank loses ' + t(s.r) + ' L every minute. Rate ' + t('=-' + s.r) + ' L/min.',
            ['Divide each change in ' + t('V') + ' by its change in ' + t('t') + '.', 'Draining means the change is negative.'], 'EP14 rate', { after: 'L/min' });
        } },
        { id: 'e14b', sub: 'b', level: 'PRG', make: function (r, s) {
          return linePart('(b) Write the equation relating ' + t('V') + ' and ' + t('t') + '.', -s.r, s.V0, [{ m: s.r, b: s.V0, code: 'line-slope-sign', hint: 'The volume decreases, so the rate is negative.' }, { m: s.V0, b: -s.r, code: 'fee-wrong', hint: 'The rate multiplies ' + t('t') + '; the starting volume is the constant.' }],
            'Rate ' + t('-' + s.r) + ' L/min, starting volume ' + t(s.V0) + ' L (at ' + t('t=0') + '): ' + t('V=-' + s.r + 't+' + s.V0) + '.', ['Starting volume = ' + t('V') + ' at ' + t('t=0') + '.'], 'EP14 equation', { vars: ['t', 'V'] });
        } },
        { id: 'e14c', sub: 'c', level: 'EMG', make: function (r, s) {
          var ans = s.V0 - s.r * s.tc;
          return numPart('(c) How much water is left after ' + t(s.tc) + ' minutes?', ans, [[s.V0 + s.r * s.tc, 'u7l1-rate-sign', 'The tank is draining: subtract.'], [s.r * s.tc, 'u7l1-tv-no-b', 'That is how much has drained. Subtract it from the starting ' + t(s.V0) + ' L.']],
            t('V=-' + s.r + '(' + s.tc + ')+' + s.V0 + '=' + ans) + ' L.', ['Substitute ' + t('t=' + s.tc) + ' into your equation.'], 'EP14 V at t', { after: 'L' });
        } },
        { id: 'e14d', sub: 'd', level: 'ADV', make: function (r, s) {
          return numPart('(d) At what time is the tank empty?', s.T, [[-s.T, 'u7l1-empty-sign', 'Time can’t be negative: from ' + t('0=-' + s.r + 't+' + s.V0) + ', ' + t(s.r + 't=' + s.V0) + '.'], [s.V0, 'no-divide', 'Divide the starting volume by the rate of ' + t(s.r) + ' L/min.'], [s.V0 * s.r, 'rate-flip', 'Divide by the rate, don’t multiply.']],
            'Empty means ' + t('V=0') + ': ' + t('0=-' + s.r + 't+' + s.V0) + ' → ' + t(s.r + 't=' + s.V0) + ' → ' + t('t=' + s.T) + ' min.', ['Empty means ' + t('V=0') + '. Substitute and solve for ' + t('t') + '.'], 'EP14 empty', { after: 'min' });
        } }] },
      { num: '15', shared: function (r) {
          return pickWhere(function () { var a = r.pick([2, 3, 4]), d = r.pick([1, 2, 3]), X = r.int(4, 7), c = r.int(0, 3); var Y = a * X + c; return { a: a, d: d, X: X, c: c, Y: Y, e: Y + d * X }; }, function (o) { return o.e <= 40 && o.e - 3 * o.d > o.c + 3 * o.a; });
        },
        stem: function (s) { var xs = [0, 1, 2, 3]; return '<b>Stretch.</b> Two linear relations begin as shown.' + figs(['<b>Relation A</b>' + tbl(xs, xs.map(function (x) { return s.a * x + s.c; })), '<b>Relation B</b>' + tbl(xs, xs.map(function (x) { return -s.d * x + s.e; }))]); }, parts: [
        { id: 'e15a', sub: 'a', level: 'PRG', make: function (r, s) {
          var p = B.fields('(a) Write the equation of each relation in the form ' + t('y=mx+b') + '.', [{ label: 'Relation A', name: 'Relation A', mode: 'math', keys: 'eq', placeholder: 'e.g. y = 2x + 3' }, { label: 'Relation B', name: 'Relation B', mode: 'math', keys: 'eq', placeholder: 'e.g. y = -x + 9' }],
            [K.line({ m: s.a, b: s.c }, { form: 'slope-intercept' }), K.line({ m: -s.d, b: s.e }, { form: 'slope-intercept' })], [siT(s.a, s.c), siT(-s.d, s.e)], 'A: ' + t(siT(s.a, s.c)) + '; B: ' + t(siT(-s.d, s.e)),
            'A: ' + t('y') + ' goes up ' + t(s.a) + ' each step and starts at ' + t(s.c) + ': ' + t(siT(s.a, s.c)) + '.<br>B: ' + t('y') + ' goes down ' + t(s.d) + ' each step and starts at ' + t(s.e) + ': ' + t(siT(-s.d, s.e)) + '.', ['For each table: the change per step is ' + t('m') + ', the value at ' + t('x=0') + ' is ' + t('b') + '.'], 'EP15 two equations');
          p.bad = [[siT(s.a, s.c), siT(s.d, s.e)]].concat(s.c !== s.a ? [[siT(s.c, s.a), siT(-s.d, s.e)]] : []);
          return p;
        } },
        { id: 'e15b', sub: 'b', level: 'MAS', make: function (r, s) {
          return ptPart('(b) Find the one ' + t('x') + '-value where the two relations give the same ' + t('y') + '-value, and state that ordered pair.', [s.X, s.Y],
            { wrong: [{ is: [s.X, s.a * s.X], code: 'u7l1-meet-y', hint: 'Right ' + t('x') + ' — now substitute it into either full equation (include the constant).' }, { is: [s.X, s.e], code: 'u7l1-meet-y', hint: 'Right ' + t('x') + ' — substitute it into one of the equations to get ' + t('y') + '.' }] },
            'Set the two expressions equal: ' + t(lin([[s.a, 'x'], [s.c, '']]) + '=' + lin([[-s.d, 'x'], [s.e, '']])) + '<br>' + t((s.a + s.d) + 'x=' + (s.e - s.c)) + '<br>' + t('x=' + s.X) + ', and ' + t('y=' + s.a + '(' + s.X + ')' + (s.c ? '+' + s.c : '') + '=' + s.Y) + '. Both give ' + t(s.Y) + ': the point ' + t(ptT([s.X, s.Y])) + '.<br>(Or extend both tables: A gains ' + t(s.a) + ' and B loses ' + t(s.d) + ' each step until they match.)',
            ['Set the two right sides equal and solve for ' + t('x') + ' — or keep extending both tables until the ' + t('y') + '-values match.', 'Then substitute ' + t('x') + ' into either equation to get ' + t('y') + '.'], 'EP15 meeting point');
        } },
        { id: 'e15c', sub: 'c', level: 'PRG', make: function (r, s) {
          return mc(r, '(c) For ' + t('x') + '-values larger than ' + t(s.X) + ', which relation gives the greater ' + t('y') + '?', [
            { html: 'Relation A: past ' + t('x=' + s.X) + ' it gains ' + t(s.a) + ' per step while B loses ' + t(s.d) + ' per step, so A pulls ahead.', right: true },
            { html: 'Relation B: it starts higher, so it stays higher.', why: 'B started higher, but A has caught up at ' + t('x=' + s.X) + '. After that, A rises and B falls.' },
            { html: 'Neither: they stay equal after they meet.', why: 'Lines with different slopes meet only once. After that they separate.' },
            { html: 'Relation B: its rate, ' + t('-' + s.d) + ', is smaller, so its values grow faster.', why: 'A negative rate means B’s ' + t('y') + '-values go <b>down</b>.' }],
            'A has rate ' + t(s.a) + ' (rising), B has rate ' + t('-' + s.d) + ' (falling). They are equal at ' + t('x=' + s.X) + '; after that A is always above B.', ['Compare the two rates: which relation is going up?'], 'EP15 which greater', true);
        } }] },
      { num: '16', parts: [
        { id: 'e16', level: 'PRG', make: function (r) {
          var o = pickWhere(function () { return { m: r.pick([-3, -2, 2, 3]), b: r.int(-4, 6) }; }, function (o) { return Math.abs(-2 * o.m + o.b) <= 20 && Math.abs(4 * o.m + o.b) <= 20 && o.b !== 0; });
          var m = o.m, b = o.b, P1 = [-2, -2 * m + b], P2 = [4, 4 * m + b];
          var opts = [{ html: t(ptT([1, m + b])), right: true }, { html: t(ptT([0, -b])), why: 'At ' + t('x=0') + ', ' + t('y=' + b) + ' — check the sign.' }, { html: t(ptT([3, 3 * m + b + (m > 0 ? 2 : -2)])), why: 'At ' + t('x=3') + ', ' + t('y=' + (3 * m + b)) + '.' }, { html: t(ptT([5, -(5 * m + b)])), why: 'At ' + t('x=5') + ', ' + t('y=' + (5 * m + b)) + ' — check the sign.' }];
          return mc(r, '<i>(Multiple Choice)</i> A linear relation contains ' + t(ptT(P1)) + ' and ' + t(ptT(P2)) + '. Which point also lies on this relation?', opts,
            'Rate ' + t('=\\frac{' + P2[1] + '-' + prn(P1[1]) + '}{4-(-2)}=\\frac{' + (P2[1] - P1[1]) + '}{6}=' + m) + '. From ' + t(ptT(P1)) + ', two steps right reach ' + t('x=0') + ': ' + t('y=' + b) + ', so ' + t(siT(m, b)) + '. At ' + t('x=1') + ': ' + t('y=' + (m + b)) + '.',
            ['Find the rate from the two points, then the equation.', 'Test each option in the equation.'], 'EP16 which point');
        } }] },
      { num: '17', parts: [
        { id: 'e17', level: 'PRG', make: function (r) {
          var o = pickWhere(function () { return { a: r.int(2, 6), c: r.int(1, 9), k: r.int(2, 9) }; }, function (o) { return -o.a * o.k + o.c < 0; });
          var Y = -o.a * o.k + o.c;
          return nrPart('<i>(Numerical Response)</i> The point ' + t('(k,\\ ' + Y + ')') + ' lies on the line ' + t(siT(-o.a, o.c)) + '. The value of ' + t('k') + ' is ____.', o.k,
            [[(Y + o.c) / -o.a, 'u7l1-undo-sign', 'Undo ' + t('+' + o.c) + ' by subtracting ' + t(o.c) + ' from both sides.'], [Y - o.c, 'no-divide', 'You have ' + t('-' + o.a + 'k=' + (Y - o.c)) + ' — divide by ' + t('-' + o.a) + '.'], [-Y / o.a, 'u7l1-div-first', 'Undo the constant first, then divide.']],
            t(Y + '=-' + o.a + 'k+' + o.c) + '<br>' + t((Y - o.c) + '=-' + o.a + 'k') + '<br>' + t('k=' + o.k) + '.', ['Substitute ' + t('y=' + Y) + ' and solve for ' + t('k') + '.', 'Dividing a negative by a negative gives a positive.'], 'EP17 NR k');
        } }] }
    ]
  });

  /* fill the gaps of a table: [{ kind: 'x' | 'y', x, y }] */
  function gapPart(prompt, m, b, gaps, text) {
    var fl = [], ch = [], keys = [], sol = [], mv = qv(m), bv = qv(b);
    gaps.forEach(function (g) {
      var y = mv * g.x + bv;
      if (g.kind === 'y') {
        fl.push({ label: t('y') + ' when ' + t('x=' + g.x) + ':', name: 'y at x = ' + g.x, before: t('y=') });
        ch.push(K.number(y, dl(tvDiag(m, b, g.x), y))); keys.push(String(y));
        sol.push(t('x=' + g.x + ':\\ y=' + subT(m, b, g.x) + '=' + y));
      } else {
        fl.push({ label: t('x') + ' when ' + t('y=' + g.y) + ':', name: 'x at y = ' + g.y, before: t('x=') });
        ch.push(K.number(g.x, dl([[mv * g.y + bv, 'u7l1-gap-solve', t(g.y) + ' is a ' + t('y') + '-value: substitute it for ' + t('y') + ' and solve for ' + t('x') + '.'], [(g.y + bv) / mv, 'u7l1-gap-undo', 'To undo ' + t((bv > 0 ? '+' : '') + bv) + ', ' + (bv > 0 ? 'subtract' : 'add') + ' ' + t(Math.abs(bv)) + ' first.'], [-g.x, 'sign', 'Check the sign when you divide by ' + t(mv) + '.']], g.x)));
        keys.push(String(g.x));
        sol.push(t('y=' + g.y + ':\\ ' + g.y + '=' + lin([[m, 'x'], [b, '']]) + '\\ \\Rightarrow\\ ' + term(m, 'x', true) + '=' + (g.y - bv) + '\\ \\Rightarrow\\ x=' + g.x));
      }
    });
    var p = B.fields(prompt, fl, ch, keys, keys.map(function (k, i) { return gaps[i].kind === 'y' ? t('y=' + k) : t('x=' + k); }).join(', '), sol.join('<br>'),
      ['A missing ' + t('y') + ': substitute the ' + t('x') + '-value.', 'A missing ' + t('x') + ': substitute the ' + t('y') + '-value and solve (undo the constant first, then divide).'], text);
    p.bad = [keys.map(function (k) { return String(Number(k) + 1); })];
    return p;
  }
})(window);
