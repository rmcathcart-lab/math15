/* Math 15 · Unit 5 · Lesson 7 — Using Technology to Graph and Explore Relations (RF5, RF2)
 * Assignment 7 (u5_L07.tex, questions 1–12) and the Lesson 7 Extra Practice (u5_EP07.tex, questions 1–16).
 * New for Math 15 (no 10C twin). A calculator / Desmos screen is drawn by screen() below: a dark bezel around the
 * viewing window, light gridlines at the window's scale, the axes when they are inside the window, a few numbers along
 * the axes, and the graph clipped at the window's edges (no arrowheads — it simply runs off the screen). The window is
 * printed under the screen. Every relation is a line y = mx + b generated from its intercepts, so the intercepts, the
 * windows and the worked solutions all come from the same numbers; the booklet's own numbers are among the values.
 * Inputs: intercept values in two math boxes (fraction keypad: 2.5 or 5/2); intercept points with the 10C u5l3
 * ptsCheck boxes; "state a window" = four boxes Xmin, Xmax, Ymin, Ymax checked by rule (winChk: every required point
 * inside with some room, not so wide that the graph is squeezed into a corner, and in a real situation starting at 0);
 * sketches on the graph pad (js/draw.js); domain and range with the 10C u5l4 set boxes; a whole-number context
 * domain/range (0, 1, 2, … and 6, 10, 14, …) with its own reader (discChk) and a keypad with a "…" key; explain-items
 * are multiple choice whose options are reasons, grids (choose one per row) or chips.
 * Levels (Math 15): BEG intercepts of y = mx + b, reading intercepts off a screen, all-real domain/range;
 * EMG decimals/fractions, choosing a window, a cost from a model; PRG context windows, domain and range in context,
 * trace/precision reasoning; ADV the corner point of a blank window, Q ≥ P inequality, intersection off screen,
 * counterexamples; MAS realistic domain and range from a model's intercepts (12d), an exact fraction intersection (e16b). */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, S = HW.sets, DR = HW.draw;

  HW.addCodes({
    'int-gave-x': 'Gave the x-intercept instead of the y-intercept', 'int-gave-y': 'Gave the y-intercept instead of the x-intercept',
    'int-no-divide': 'Didn’t divide by the coefficient', 'int-sign': 'Intercept with the wrong sign', 'int-gave-m': 'Gave the coefficient of x',
    'int-point-not-value': 'Gave a point where a value was asked', 'int-value-not-point': 'Gave a value where a point was asked',
    'int-pt-flip': 'Intercept point with the coordinates swapped', 'int-pt-swap': 'x- and y-intercept points swapped', 'int-off-axis': 'Point not on the axis',
    'int-missing': 'Missed an intercept', 'int-extra': 'Extra intercept', 'int-said-none': 'Said “none” when the intercept exists',
    'int-missed-none': 'Gave an intercept that doesn’t exist', 'int-bad-value': 'Wrong intercept value (written as a value)',
    'ctx-no-fee': 'Left out the starting amount', 'ctx-rate-n': 'Added the rate instead of multiplying', 'ctx-no-sub': 'Didn’t subtract the starting amount',
    'ctx-added': 'Added the starting amount instead of subtracting', 'ctx-eval': 'Substituted instead of solving', 'ctx-mult': 'Multiplied instead of dividing',
    'tab-rate': 'Multiplied the fee too', 'set-repeat': 'Wrote a value twice in a list', 'set-order': 'List not in increasing order',
    'u5l7-win-order': 'Window: min not smaller than max', 'u5l7-win-cut': 'Window cuts off a point that must show', 'u5l7-win-squeezed': 'Window far too wide (graph squeezed)',
    'u5l7-win-negative': 'Window shows impossible negative values in a real situation', 'u5l7-win-steep': 'Window: line leaves the top almost at once', 'u5l7-win-flat': 'Window: line hugs the bottom (Ymax far too big)',
    'u5l7-dr-window': 'Gave the window as the domain/range', 'u5l7-dr-visible': 'Gave only the part visible on the screen', 'u5l7-dr-negative': 'Context domain/range allows impossible values',
    'u5l7-dr-all': 'Context domain/range left as all real numbers',
    'u5l7-disc-cont': 'Whole-number situation written as an interval', 'u5l7-disc-start': 'Whole-number list starts at the wrong value', 'u5l7-disc-step': 'Whole-number list with the wrong step',
    'u5l7-disc-bounded': 'Gave a last value where the list never ends', 'u5l7-std-decision': 'Standard window: wrong decision', 'u5l7-est-off': 'Estimate off the screen too far',
    'u5l7-between': 'Wrong gridlines either side', 'u5l7-exact': 'Rounded where the exact value was asked', 'u5l7-ce-visible': 'Counterexample whose intercept is on screen',
    'u5l7-ce-horizontal': 'Counterexample is horizontal (no x-intercept)', 'u5l7-ce-int': 'Stated x-intercept doesn’t match the line', 'u5l7-ineq': 'Wrong inequality for where one line is above',
    'u5l7-diff': 'Wrong constant difference', 'u5l7-tab-y': 'Wrong y-value in the table', 'u5l7-cross': 'Wrong crossing point', 'u5l7-match': 'Matched a screen to the wrong equation',
    'u5l7-trace-y': 'Substitution slip in the trace check', 'u5l7-pick': 'Wrong choices ticked'
  });
  HW.addPartial({
    'u5l7-win-order': 's', 'u5l7-win-cut': 'n', 'u5l7-win-squeezed': 'b', 'u5l7-win-negative': 'b', 'u5l7-win-steep': 'b', 'u5l7-win-flat': 'b',
    'u5l7-dr-window': 'n', 'u5l7-dr-visible': 'n', 'u5l7-dr-negative': 'b', 'u5l7-dr-all': 'n',
    'u5l7-disc-cont': 'b', 'u5l7-disc-start': 's', 'u5l7-disc-step': 'b', 'u5l7-disc-bounded': 'b', 'u5l7-std-decision': 'n', 'u5l7-est-off': 'n',
    'u5l7-between': 'n', 'u5l7-exact': 's', 'u5l7-ce-visible': 'n', 'u5l7-ce-horizontal': 'n', 'u5l7-ce-int': 's', 'u5l7-ineq': 'b',
    'u5l7-diff': 's', 'u5l7-tab-y': 's', 'u5l7-cross': 'n', 'u5l7-match': 'n', 'u5l7-trace-y': 's', 'u5l7-pick': 'n'
  });

  /* ---------------- numbers and LaTeX ---------------- */
  function cl(x) { return Math.round(x * 1e6) / 1e6; }
  function same(a, b) { return Math.abs(a - b) < 1e-9; }
  function nT(x) { return F(cl(x)); }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function pm(a, b) { return range(a, b).concat(range(a, b).map(function (x) { return -x; })); }
  function nz(a, b) { return range(a, b).filter(function (x) { return x !== 0; }); }
  function isTerm(x) { for (var q = 1; q <= 1000; q *= 10) if (Math.abs(x * q - Math.round(x * q)) < 1e-7) return true; return false; }
  function vt(x) { if (Math.abs(x - Math.round(x)) < 1e-9) return F(Math.round(x)); if (isTerm(x)) return nT(x); for (var q = 2; q <= 24; q++) if (Math.abs(x * q - Math.round(x * q)) < 1e-6) return ex.texRat(ex.norm(Math.round(x * q), q)); return nT(x); }
  function vkey(x) { return vt(x); }                                                   // a key K.value accepts
  function sgp(c) { c = cl(c); return c < 0 ? '(' + vt(c) + ')' : vt(c); }
  function term(c, v, first) {
    c = cl(c); if (!c) return '';
    var neg = c < 0, mag = vt(Math.abs(c));
    if (v && mag === '1') mag = '';
    return (neg ? '-' : first ? '' : '+') + mag + v;
  }
  function lin(list) { var s = ''; list.forEach(function (p) { s += term(p[0], p[1], s === ''); }); return s || '0'; }
  function rhs(m, b, v, cf) { return cf ? lin([[b, ''], [m, v || 'x']]) : lin([[m, v || 'x'], [b, '']]); }
  function eqT(m, b, o) { o = o || {}; return (o.w || 'y') + '=' + rhs(m, b, o.v, o.cf); }
  function ptT(p) { return '(' + vt(p[0]) + ',\\ ' + vt(p[1]) + ')'; }
  function ptKey(p) { return '(' + vt(p[0]) + ', ' + vt(p[1]) + ')'; }
  function winT(w) { return 'x:[' + nT(w[0]) + ',\\ ' + nT(w[1]) + '],\\ y:[' + nT(w[2]) + ',\\ ' + nT(w[3]) + ']'; }
  function uniqV(a) { var o = []; a.forEach(function (x) { if (!o.some(function (y) { return same(x, y); })) o.push(x); }); return o.sort(function (x, y) { return y - x; }); }
  function pickWhere(gen, okf) { for (var i = 0; i < 4000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('u5l7: no valid numbers'); }
  function solveTex(m, b, yv) { // the steps of 0 = mx + b (or yv = mx + b) for x
    yv = yv || 0; var rhsv = yv - b, x = rhsv / m;
    return t(nT(yv) + '=' + rhs(m, b)) + ' → ' + t(term(m, 'x', true) + '=' + vt(rhsv)) + (same(m, 1) ? '' : ' → ' + t('x=' + (same(m, -1) ? '' : '\\frac{' + vt(rhsv) + '}{' + vt(m) + '}=') + vt(x)));
  }

  /* ---------------- the calculator / Desmos screen ---------------- */
  function niceStep(span, n) { var raw = span / (n || 5), steps = [0.5, 1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500]; for (var i = 0; i < steps.length; i++) if (steps[i] >= raw - 1e-9) return steps[i]; return 1000; }
  function clipLine(m, b, w) { // the part of y = mx + b inside the window w = [xmin, xmax, ymin, ymax]
    var lo = w[0], hi = w[1];
    if (Math.abs(m) < 1e-12) { if (b < w[2] || b > w[3]) return null; }
    else { var x1 = (w[2] - b) / m, x2 = (w[3] - b) / m; lo = Math.max(lo, Math.min(x1, x2)); hi = Math.min(hi, Math.max(x1, x2)); }
    if (hi - lo < 1e-9) return null;
    return [[lo, m * lo + b], [hi, m * hi + b]];
  }
  /* o: { w: [xmin, xmax, ymin, ymax], gx, gy (grid steps), lx, ly (number steps; 0 = none), lines: [{ m, b, color, label, lx }],
   *      dots: [[x, y]], W, H (screen size in px), xName, yName, cap (false = no window caption), title, max } */
  function screen(o) {
    var w = o.w, W = o.W || 230, H = o.H || 230, pad = 11, a = w[0], b = w[1], c = w[2], d = w[3];
    var gx = o.gx || niceStep(b - a, 10), gy = o.gy || niceStep(d - c, 10), lx = o.lx == null ? gx * (Math.round((b - a) / gx) > 12 ? 2 : 1) : o.lx, ly = o.ly == null ? gy * (Math.round((d - c) / gy) > 12 ? 2 : 1) : o.ly;
    var X = function (x) { return pad + (x - a) / (b - a) * W; }, Y = function (y) { return pad + (d - y) / (d - c) * H; };
    var s = '<rect x="0" y="0" width="' + (W + 2 * pad) + '" height="' + (H + 2 * pad) + '" rx="12" fill="#2b3340"/><rect x="' + pad + '" y="' + pad + '" width="' + W + '" height="' + H + '" fill="#fbfcf8"/>';
    var k;
    for (k = Math.ceil(a / gx - 1e-9) * gx; k <= b + 1e-9; k += gx) if (k > a + 1e-9 && k < b - 1e-9) s += '<line x1="' + X(k).toFixed(1) + '" y1="' + pad + '" x2="' + X(k).toFixed(1) + '" y2="' + (pad + H) + '" stroke="#dfe3e8" stroke-width="1"/>';
    for (k = Math.ceil(c / gy - 1e-9) * gy; k <= d + 1e-9; k += gy) if (k > c + 1e-9 && k < d - 1e-9) s += '<line x1="' + pad + '" y1="' + Y(k).toFixed(1) + '" x2="' + (pad + W) + '" y2="' + Y(k).toFixed(1) + '" stroke="#dfe3e8" stroke-width="1"/>';
    var axX = c <= 0 && d >= 0, axY = a <= 0 && b >= 0;
    if (axX) s += '<line x1="' + pad + '" y1="' + Y(0).toFixed(1) + '" x2="' + (pad + W) + '" y2="' + Y(0).toFixed(1) + '" stroke="#2b3340" stroke-width="1.5"/>';
    if (axY) s += '<line x1="' + X(0).toFixed(1) + '" y1="' + pad + '" x2="' + X(0).toFixed(1) + '" y2="' + (pad + H) + '" stroke="#2b3340" stroke-width="1.5"/>';
    var lab = function (x, y, txt, anchor) { return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="10.5" text-anchor="' + anchor + '" fill="#4a5262" paint-order="stroke" stroke="#fbfcf8" stroke-width="3">' + txt + '</text>'; };
    var num = function (v) { v = cl(v); return v < 0 ? '−' + Math.abs(v) : String(v); };
    if (lx) { var yl = axX ? Y(0) + 12 : pad + H - 4; for (k = Math.ceil(a / lx - 1e-9) * lx; k <= b + 1e-9; k += lx) if (Math.abs(k) > 1e-9 && X(k) > pad + 8 && X(k) < pad + W - 8) s += lab(X(k), Math.min(yl, pad + H - 3), num(k), 'middle'); }
    if (ly) { var left = axY && X(0) - pad > 20, xl = !axY ? pad + 3 : left ? X(0) - 4 : X(0) + 4; for (k = Math.ceil(c / ly - 1e-9) * ly; k <= d + 1e-9; k += ly) if (Math.abs(k) > 1e-9 && Y(k) > pad + 8 && Y(k) < pad + H - 6) s += lab(xl, Y(k) + 3.5, num(k), left ? 'end' : 'start'); }
    if (axX) s += '<text x="' + (pad + W - 4) + '" y="' + (Y(0) - 5).toFixed(1) + '" font-size="12" font-style="italic" text-anchor="end" fill="#2b3340">' + (o.xName || 'x') + '</text>';
    if (axY) s += '<text x="' + (X(0) + 5).toFixed(1) + '" y="' + (pad + 13) + '" font-size="12" font-style="italic" fill="#2b3340">' + (o.yName || 'y') + '</text>';
    (o.lines || []).forEach(function (L) {
      var seg = clipLine(L.m, L.b, w); if (!seg) return;
      s += '<line x1="' + X(seg[0][0]).toFixed(1) + '" y1="' + Y(seg[0][1]).toFixed(1) + '" x2="' + X(seg[1][0]).toFixed(1) + '" y2="' + Y(seg[1][1]).toFixed(1) + '" stroke="' + (L.color || '#1f4fbf') + '" stroke-width="2.4" stroke-linecap="round"/>';
      if (L.label) { var lxp = L.lx != null ? L.lx : seg[0][0] + 0.18 * (seg[1][0] - seg[0][0]); var lyp = L.m * lxp + L.b; s += '<text x="' + (X(lxp) + 6).toFixed(1) + '" y="' + (Y(lyp) - 6).toFixed(1) + '" font-size="12" font-weight="600" fill="' + (L.color || '#1f4fbf') + '" paint-order="stroke" stroke="#fbfcf8" stroke-width="3">' + L.label + '</text>'; }
    });
    (o.dots || []).forEach(function (p) { if (p[0] >= a - 1e-9 && p[0] <= b + 1e-9 && p[1] >= c - 1e-9 && p[1] <= d + 1e-9) s += '<circle cx="' + X(p[0]).toFixed(1) + '" cy="' + Y(p[1]).toFixed(1) + '" r="3.2" fill="#c4532a"/>'; });
    var svg = '<svg class="fig-svg" viewBox="0 0 ' + (W + 2 * pad) + ' ' + (H + 2 * pad) + '" style="max-width:' + (o.max || 250) + 'px;width:100%" role="img" aria-label="graphing calculator screen">' + s + '</svg>';
    var cap = o.cap === false ? '' : '<div style="font-size:.88em;margin-top:2px">' + t(winT(w).replace(/^x/, o.xName || 'x').replace('\\ y:', '\\ ' + (o.yName || 'y') + ':')) + '</div>';
    return '<div class="u5l7-scr" style="display:inline-block;vertical-align:top;text-align:center;margin:6px 10px 6px 0;max-width:' + (o.max || 250) + 'px;width:100%">' + (o.title ? '<div style="font-weight:600;margin-bottom:2px">' + o.title + '</div>' : '') + svg + cap + '</div>';
  }
  function row(list) { return '<div style="display:flex;flex-wrap:wrap;gap:4px 10px;align-items:flex-start">' + list.join('') + '</div>'; }
  var STD = [-10, 10, -10, 10];

  /* ---------------- answer parts ---------------- */
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  /* several value boxes (fraction keypad: 2.5 or 5/2). boxes: [{ label, ans, diag: [[value, code, hint]], before, after }] */
  function valsPart(prompt, boxes, sol, hints, text) {
    var fields = boxes.map(function (b) { return { label: b.label, name: b.name || b.label, mode: 'math', keys: 'fraction', before: b.before, after: b.after }; });
    var checks = boxes.map(function (b) {
      var dl = (b.diag || []).filter(function (d) { return isFinite(d[0]) && !same(d[0], b.ans); });
      var base = K.value(b.ans, { diag: function (v) { for (var i = 0; i < dl.length; i++) if (same(v, dl[i][0])) return { code: dl[i][1], hint: dl[i][2] }; return null; } });
      return function (resp) {
        if (/\([^()]*,[^()]*\)/.test(String(resp || '').replace(/\\left|\\right/g, ''))) return form('int-point-not-value', 'Give just the <b>value</b> (a single number), not an ordered pair.');
        var res = base(resp);
        if (res.v === 'wrong' && b.exact) { var a = K.read(resp); if (!a.res && Math.abs(a.val - b.ans) < 0.006) return form('u5l7-exact', 'Close — but give the <b>exact</b> value (a fraction), not a rounded decimal.'); }
        return res;
      };
    });
    var p = B.fields(prompt, fields, checks, boxes.map(function (b) { return vkey(b.ans); }), boxes.map(function (b) { return b.label + ' ' + t(vt(b.ans)) + (b.after ? ' ' + b.after : ''); }).join('<br>'), sol, hints, text);
    var bad = [];
    boxes.forEach(function (b, i) { var d = (b.diag || []).filter(function (z) { return isFinite(z[0]) && !same(z[0], b.ans); })[0]; if (d) bad.push(boxes.map(function (b2, j) { return j === i ? vkey(d[0]) : vkey(b2.ans); })); });
    if (boxes.length === 2 && !same(boxes[0].ans, boxes[1].ans)) bad.push([vkey(boxes[1].ans), vkey(boxes[0].ans)]);
    p.bad = bad;
    return p;
  }
  /* the diagnoses for the two intercepts of y = mx + b */
  function xDiag(m, b) { var xi = -b / m; return [[b / m, 'int-sign', 'Check the sign: from ' + t('0=' + rhs(m, b)) + ', move ' + t(vt(b)) + ' to the other side (it changes sign), then divide by ' + t(vt(m)) + '.'],
    [-b, 'int-no-divide', 'You stopped at ' + t(term(m, 'x', true) + '=' + vt(-b)) + ' — now divide both sides by ' + t(vt(m)) + '.'], [b, 'int-gave-y', 'That’s the ' + t('y') + '-intercept (where ' + t('x=0') + '). For the ' + t('x') + '-intercept, set ' + t('y=0') + ' and solve.'],
    [xi * -1, 'int-sign', 'Check the sign of your answer.']]; }
  function yDiag(m, b) { return [[-b / m, 'int-gave-x', 'That’s the ' + t('x') + '-intercept. For the ' + t('y') + '-intercept set ' + t('x=0') + ': only the constant term is left.'], [m, 'int-gave-m', t(vt(m)) + ' is the number multiplying ' + t('x') + '. Set ' + t('x=0') + ': ' + t('y=' + vt(m) + '(0)' + (b < 0 ? '' : '+') + vt(b)) + '.'], [-b, 'int-sign', 'Check the sign: at ' + t('x=0') + ', ' + t('y') + ' equals the constant term, sign included.']]; }
  var HXY = ['At the ' + t('x') + '-intercept the graph is on the ' + t('x') + '-axis, so ' + t('y=0') + '. Substitute ' + t('y=0') + ' and solve for ' + t('x') + '.', 'At the ' + t('y') + '-intercept ' + t('x=0') + ', so ' + t('y') + ' is just the constant term.'];
  function interceptVals(prompt, m, b, o) {
    o = o || {}; var xi = -b / m;
    var sol = t('x') + '-intercept: set ' + t('y=0') + ': ' + solveTex(m, b) + '.<br>' + t('y') + '-intercept: set ' + t('x=0') + ': ' + t('y=' + vt(m) + '(0)' + (b < 0 ? '' : '+') + vt(b) + '=' + vt(b)) + '.' + (o.solMore || '');
    return valsPart(prompt, [{ label: t('x') + '-intercept:', name: 'x-intercept', before: t('x='), ans: xi, diag: xDiag(m, b) }, { label: t('y') + '-intercept:', name: 'y-intercept', before: t('y='), ans: b, diag: yDiag(m, b) }], sol, o.hints || HXY, o.text);
  }

  /* ---- intercept points (Math 10C u5l3): one box of points per axis ---- */
  function strip(s) { return String(s == null ? '' : s).replace(/\\(left|right)/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\\{|\\\}|\\lbrace|\\rbrace/g, ' ').trim(); }
  function pairList(resp) {
    var s = strip(resp).trim();
    if (/^\{[\s\S]*\}$/.test(s) && !/^\{[^{}]*\}\{/.test(s)) s = s.slice(1, -1).trim();
    if (!s) return { empty: true };
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) {
      var xy = m[1].split(','); if (xy.length !== 2) return { bad: true };
      var a = ex.parse(xy[0].trim()), b = ex.parse(xy[1].trim()); if (!a.ok || !b.ok) return { bad: true };
      var va = ex.value(a.ast), vb = ex.value(b.ast); if (!isFinite(va) || !isFinite(vb)) return { bad: true };
      out.push([va, vb]);
    }
    if (s.replace(re, '').replace(/[,;\s]|\\[,;!: ]|\\text\{\s*and\s*\}|and/g, '').length || !out.length) return { bad: true };
    return { pairs: out };
  }
  function valueList(resp) {
    var s = strip(resp).replace(/\\text\{\s*(or|and)\s*\}/gi, ',').replace(/\b(or|and)\b/gi, ',').replace(/[a-zA-Z]\s*=\s*/g, '');
    if (!s.trim()) return null;
    var out = [], ps = s.split(/[,;]/);
    for (var i = 0; i < ps.length; i++) { var p = ps[i].trim(); if (!p) continue; var r = ex.parse(p); if (!r.ok) return null; var v = ex.value(r.ast); if (!isFinite(v)) return null; out.push(v); }
    return out.length ? uniqV(out) : null;
  }
  function sameVals(A, T) { A = uniqV(A); T = uniqV(T); return A.length === T.length && A.every(function (x, i) { return same(x, T[i]); }); }
  function samePts(A, T) { var k = function (p) { return cl(p[0]) + '|' + cl(p[1]); }, a = {}, b = {}; A.forEach(function (p) { a[k(p)] = 1; }); T.forEach(function (p) { b[k(p)] = 1; }); var ka = Object.keys(a), kb = Object.keys(b); return ka.length === kb.length && ka.every(function (x) { return b[x]; }); }
  function ptsCheck(want, axis, o) {
    o = o || {};
    var zero = axis === 'x' ? 1 : 0, keep = 1 - zero, other = axis === 'x' ? 'y' : 'x', name = t(axis) + '-intercept';
    var vals = want.map(function (p) { return p[keep]; }), sample = axis === 'x' ? t('(3,\\ 0)') : t('(0,\\ 3)'), an = axis === 'x' ? 'an' : 'a';
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Type the ' + name + ' as a point.');
      var L = pairList(s);
      if (L.bad || L.empty) {
        var V = valueList(s);
        if (V) {
          if (sameVals(V, vals)) return form('int-value-not-point', 'Right value — now write it as a <b>point</b>, like ' + sample + '.');
          return wrong('int-bad-value', 'Write the intercept as an ordered pair, like ' + sample + ' — and check your value: the graph meets the ' + t(axis) + '-axis where ' + t(other + '=0') + '.');
        }
        return form('int-unreadable', 'Write the point as an ordered pair in brackets, like ' + sample + '.');
      }
      var A = L.pairs;
      if (samePts(A, want)) return ok();
      if (o.other && samePts(A, o.other)) return wrong('int-pt-swap', 'That is the ' + t(other) + '-intercept (it has ' + t(axis + '=0') + '). This box is for where the graph meets the ' + t(axis) + '-axis.');
      if (A.every(function (p) { return same(p[keep], 0) && vals.some(function (v) { return same(v, p[zero]); }); }) && !vals.every(function (v) { return same(v, 0); }))
        return wrong('int-pt-flip', 'Your coordinates are in the wrong order. ' + (axis === 'x' ? 'An' : 'A') + ' ' + name + ' lies on the ' + t(axis) + '-axis, so its ' + t(other) + '-coordinate is ' + t('0') + ': ' + (axis === 'x' ? t('(a,\\ 0)') : t('(0,\\ b)')) + '.');
      var off = A.filter(function (p) { return !same(p[zero], 0); });
      if (off.length) return wrong('int-off-axis', t(ptT(off[0])) + ' isn’t on the ' + t(axis) + '-axis: ' + an + ' ' + name + ' has ' + t(other) + '-coordinate ' + t('0') + '.');
      if (A.length > want.length) return wrong('int-extra', 'A straight line meets the ' + t(axis) + '-axis only once — give one point.');
      var got = A[0][keep];
      if (same(-got, vals[0])) return wrong('int-sign', 'Check the sign of your ' + name + ' — is it on the positive or the negative side of the axis?');
      return wrong('value', null);
    };
  }
  function interceptPts(prompt, xi, yi, o) {
    o = o || {}; var xp = [[xi, 0]], yp = [[0, yi]];
    var fields = [{ name: 'x-intercept', label: t('x') + '-intercept:', mode: 'math', keys: 'pairs', placeholder: 'e.g. (2, 0)' }, { name: 'y-intercept', label: t('y') + '-intercept:', mode: 'math', keys: 'pairs', placeholder: 'e.g. (0, 3)' }];
    var p = B.fields(prompt, fields, [ptsCheck(xp, 'x', { other: yp }), ptsCheck(yp, 'y', { other: xp })], [ptKey(xp[0]), ptKey(yp[0])],
      t('x') + '-intercept ' + t(ptT(xp[0])) + '<br>' + t('y') + '-intercept ' + t(ptT(yp[0])), o.sol, o.hints || HXY, o.text);
    p.good = [['\\left(' + vt(xi) + ',0\\right)', '\\left(0,' + vt(yi) + '\\right)']];
    p.bad = [[ptKey(yp[0]), ptKey(xp[0])], [ptKey([0, xi]), ptKey(yp[0])], [ptKey([-xi, 0]), ptKey(yp[0])], [ptKey(xp[0]), vt(yi)]].filter(function (bb) { return !(bb[0] === ptKey(xp[0]) && bb[1] === ptKey(yp[0])); });
    return p;
  }

  /* ---------------- viewing windows ----------------
   * o: { show: [{ p: [x, y], name }] (points that must be on screen), ctx: true (a real situation: no negative values),
   *      fn: { m, b } (the relation; used for context windows), minX (context: Xmax at least this), v, w (letters) } */
  function winChk(o) {
    var v = o.v || 'x', w = o.w || 'y';
    return function (resp) {
      var s = (resp || []).map(function (z) { return String(z == null ? '' : z).trim(); });
      if (s.length < 4 || s.some(function (z) { return !z; })) return form('empty', 'Fill in all four window values: Xmin, Xmax, Ymin and Ymax.');
      var n = s.map(function (z) { return HW.parse.number(z.replace(/\\left|\\right/g, '')); });
      if (n.some(function (z) { return !z.ok; })) return form('notnumber', 'Each window value is a single number.');
      var x0 = n[0].value, x1 = n[1].value, y0 = n[2].value, y1 = n[3].value;
      if (x0 >= x1) return wrong('u5l7-win-order', 'Xmin is the <b>left</b> edge and Xmax the <b>right</b> edge, so Xmin must be smaller than Xmax.');
      if (y0 >= y1) return wrong('u5l7-win-order', 'Ymin is the <b>bottom</b> edge and Ymax the <b>top</b> edge, so Ymin must be smaller than Ymax.');
      if (o.ctx) {
        if (x0 > 0) return wrong('u5l7-win-cut', 'Start at ' + t(v + '=0') + ' (Xmin ' + t('=0') + '): the starting value, at ' + t(v + '=0') + ', is part of the story.');
        if (y0 > 0) return wrong('u5l7-win-cut', 'Let the window start at ' + t(w + '=0') + ' (Ymin ' + t('=0') + ') so the bottom of the picture is the axis.');
        if (x0 < -0.2 * x1 - 1e-9) return wrong('u5l7-win-negative', 'Negative values of ' + t(v) + ' make no sense here, so don’t spend much of the screen on them: let Xmin be ' + t('0') + ' (or just below it).');
        if (y0 < -0.2 * y1 - 1e-9) return wrong('u5l7-win-negative', 'Negative values of ' + t(w) + ' can’t happen here, so let Ymin be ' + t('0') + ' (or just below it).');
      }
      var box = [0, 0, 0, 0];
      for (var i = 0; i < o.show.length; i++) {
        var P = o.show[i].p, nm = o.show[i].name + ' ' + t(ptT(P));
        box = [Math.min(box[0], P[0]), Math.max(box[1], P[0]), Math.min(box[2], P[1]), Math.max(box[3], P[1])];
        if (P[0] < x0 - 1e-9) return wrong('u5l7-win-cut', 'Your window cuts off ' + nm + ': Xmin ' + t('=' + nT(x0)) + ' is to the right of ' + t(v + '=' + vt(P[0])) + '. Make Xmin smaller.');
        if (P[0] > x1 + 1e-9) return wrong('u5l7-win-cut', 'Your window cuts off ' + nm + ': Xmax ' + t('=' + nT(x1)) + ' is to the left of ' + t(v + '=' + vt(P[0])) + '. Make Xmax bigger.');
        if (P[1] < y0 - 1e-9) return wrong('u5l7-win-cut', 'Your window cuts off ' + nm + ': Ymin ' + t('=' + nT(y0)) + ' is above ' + t(w + '=' + vt(P[1])) + '. Make Ymin smaller.');
        if (P[1] > y1 + 1e-9) return wrong('u5l7-win-cut', 'Your window cuts off ' + nm + ': Ymax ' + t('=' + nT(y1)) + ' is below ' + t(w + '=' + vt(P[1])) + '. Make Ymax bigger.');
        var edgeX = same(P[0], x0) || same(P[0], x1), edgeY = same(P[1], y0) || same(P[1], y1);
        if (o.ctx) { edgeX = edgeX && !(same(P[0], 0) && same(x0, 0)); edgeY = edgeY && !(same(P[1], 0) && same(y0, 0)); }
        if (edgeX || edgeY) return form('u5l7-win-edge', nm.charAt(0).toUpperCase() + nm.slice(1) + ' sits right on the edge of your window. Leave some room beyond it.');
      }
      var bw = box[1] - box[0], bh = box[3] - box[2];
      if (bw > 0 && x1 - x0 > 25 * bw) return wrong('u5l7-win-squeezed', 'Your window is so wide that the important part is squeezed into a sliver. Zoom in: choose Xmin and Xmax a little beyond the points you need.');
      if (bh > 0 && y1 - y0 > 25 * bh) return wrong('u5l7-win-squeezed', 'Your window is so tall that the important part is squeezed into a sliver. Zoom in: choose Ymin and Ymax a little beyond the points you need.');
      if (o.full && o.fn) for (var j = 0; j < 2; j++) {
        var fx = o.full[j], fy = o.fn.m * fx + o.fn.b;
        if (fx < x0 - 1e-9 || fx > x1 + 1e-9) return wrong('u5l7-win-cut', 'The window has to cover ' + t(v + '=' + nT(o.full[0])) + ' to ' + t(v + '=' + nT(o.full[1])) + '.');
        if (fy > y1 + 1e-9) return wrong('u5l7-win-cut', 'At ' + t(v + '=' + nT(fx)) + ' the line is at ' + t(w + '=' + nT(fy)) + ', above Ymax ' + t('=' + nT(y1)) + ', so part of it is cut off. Make Ymax bigger.');
        if (fy < y0 - 1e-9) return wrong('u5l7-win-cut', 'At ' + t(v + '=' + nT(fx)) + ' the line is at ' + t(w + '=' + nT(fy)) + ', below Ymin ' + t('=' + nT(y0)) + '. Make Ymin smaller.');
      }
      if (o.ctx && o.minX && x1 < o.minX - 1e-9) return wrong('u5l7-win-cut', 'That window shows only a tiny piece of the situation. Let Xmax reach at least ' + t(nT(o.minX)) + '.');
      if (o.ctx && o.fn && o.fn.m > 0) {
        var top = (y1 - o.fn.b) / o.fn.m;
        if (top < x0 + 0.4 * (x1 - x0)) return wrong('u5l7-win-steep', 'The line leaves the top of your window less than halfway across. Make Ymax bigger: at ' + t(v + '=' + nT(x1)) + ' the value is ' + t(w + '=' + nT(o.fn.m * x1 + o.fn.b)) + '.');
        if (o.fn.m * x1 + o.fn.b < y0 + 0.25 * (y1 - y0)) return wrong('u5l7-win-flat', 'The line stays squashed along the bottom of your window. Ymax can be much smaller: at ' + t(v + '=' + nT(x1)) + ' the value is only ' + t(w + '=' + nT(o.fn.m * x1 + o.fn.b)) + '.');
      }
      return ok();
    };
  }
  function niceWin(o) { // a window that passes winChk
    var xs = [0], ys = [0];
    o.show.forEach(function (q) { xs.push(q.p[0]); ys.push(q.p[1]); });
    if (o.ctx && o.fn && o.fn.m > 0) { var X1 = o.minX || 10; xs.push(X1); ys.push(o.fn.m * X1 + o.fn.b); }
    var ax = function (vs, ctx) {
      var lo = Math.min.apply(null, vs), hi = Math.max.apply(null, vs), span = Math.max(hi - lo, 1), st = Math.max(1, niceStep(span, 6));
      var a = ctx ? 0 : Math.floor((lo - 0.1 * span) / st) * st, b = Math.ceil((hi + 0.1 * span) / st) * st;
      if (!ctx && a >= lo - 1e-9) a -= st; if (b <= hi + 1e-9) b += st;
      return [cl(a), cl(b)];
    };
    var X = ax(xs, o.ctx), Y = ax(ys, o.ctx);
    return [X[0], X[1], Y[0], Y[1]];
  }
  function winPart(prompt, o, sol, hints, text) {
    var key = o.key || niceWin(o), chk = winChk(o);
    if (chk(key.map(String)).v !== 'correct') throw new Error('u5l7: window key ' + key + ' fails its own check');
    var fields = ['Xmin', 'Xmax', 'Ymin', 'Ymax'].map(function (l) { return { label: l + ' =', name: l }; });
    var p = B.fields(prompt, fields, [], key.map(String), 'For example ' + t(winT(key)) + ' (many windows work).', sol, hints || ['Find the points that must show first. Then choose Xmin and Xmax a little to the left and right of them, and Ymin and Ymax a little below and above them.'], text);
    p.check = chk;
    p.input.fields.forEach(function (f) { f.wide = false; });
    var bad = [[String(key[1]), String(key[0]), String(key[2]), String(key[3])], STD.map(String)];
    if (o.ctx) bad.push([String(-key[1]), String(key[1]), String(key[2]), String(key[3])]);
    p.bad = bad.filter(function (bb) { return chk(bb).v !== 'correct'; });
    p.good = [key.map(function (v, i) { return String(i % 2 ? v * 2 : (o.ctx ? 0 : v * 2)); })].filter(function (g) { return chk(g).v === 'correct'; });
    return p;
  }
  function stdShows(m, b) { return Math.abs(-b / m) < 10 && Math.abs(b) < 10; }

  /* ---------------- sets (Math 10C u5l4) ---------------- */
  function cond(v, lo, hi, lc, hc) { lc = lc !== false; hc = hc !== false; if (lo == null && hi == null) return ''; if (lo == null) return v + (hc ? '\\le ' : '<') + hi; if (hi == null) return v + (lc ? '\\ge ' : '>') + lo; return lo + (lc ? '\\le ' : '<') + v + (hc ? '\\le ' : '<') + hi; }
  function bld(v, lo, hi, lc, hc) { var c = cond(v, lo, hi, lc, hc); return '\\{' + v + '\\mid ' + (c ? c + ',\\ ' : '') + v + '\\in\\mathbb{R}\\}'; }
  function all(v) { return bld(v, null, null); }
  function ivAlt(tex) { var p = S.parse(tex); if (!p.ok || p.set.kind !== 'int' || p.set.parts.length !== 1) return tex; var q = p.set.parts[0], n = function (x) { return x === Infinity ? '\\infty' : x === -Infinity ? '-\\infty' : String(x); }; return (q.lc ? '[' : '(') + n(q.lo) + ', ' + n(q.hi) + (q.hc ? ']' : ')'); }
  function ineqAlt(tex, v) { var p = S.parse(tex); if (!p.ok || p.set.kind !== 'int' || p.set.parts.length !== 1) return tex; var q = p.set.parts[0]; if (q.lo === -Infinity && q.hi === Infinity) return v + '\\in\\mathbb{R}'; return cond(v, q.lo === -Infinity ? null : q.lo, q.hi === Infinity ? null : q.hi, q.lc, q.hc); }
  function ph(v) { return 'e.g. {' + v + ' | -2 <= ' + v + ' < 5, ' + v + ' in R}'; }
  function setChk(target, o) {
    o = o || {};
    var T = S.parse(target).set, wr = (o.wrong || []).filter(function (w) { var p = S.parse(w.is); return p.ok && !S.eq(p.set, T); });
    return K.set(target, { v: o.v, other: o.other, otherName: o.otherName, wrong: wr, tag: o.tag });
  }
  function drPart(prompt, D, R, o, sol, hints, text) {
    o = o || {}; var dv = o.dv || 'x', rv = o.rv || 'y';
    var cD = setChk(D, { v: dv, other: R, otherName: 'range', wrong: o.dW }), cR = setChk(R, { v: rv, other: D, otherName: 'domain', wrong: o.rW });
    var vars = [dv, rv].filter(function (v, i, a) { return a.indexOf(v) === i; });
    var fl = [{ label: 'Domain', name: 'Domain', mode: 'math', keys: 'set', vars: vars, placeholder: ph(dv) }, { label: 'Range', name: 'Range', mode: 'math', keys: 'set', vars: vars, placeholder: ph(rv) }];
    var p = B.fields(prompt, fl, [cD, cR], [D, R], t('D=' + D) + '<br>' + t('R=' + R), sol, hints, text);
    p.good = [[ivAlt(D), ivAlt(R)], [ineqAlt(D, dv), ineqAlt(R, rv)]].concat(o.good || []);
    var Dp = S.parse(D).set, Rp = S.parse(R).set, bad = [];
    if (!S.eq(Dp, Rp)) bad.push([R, D]);
    (o.dW || []).forEach(function (w) { var q = S.parse(w.is); if (q.ok && !S.eq(q.set, Dp)) bad.push([w.is, R]); });
    (o.rW || []).forEach(function (w) { var q = S.parse(w.is); if (q.ok && !S.eq(q.set, Rp)) bad.push([D, w.is]); });
    p.bad = bad;
    return p;
  }
  var ALLX = all('x'), ALLY = all('y');
  function lineDR(prompt, m, b, w, text, level) { // domain and range of a slanted line on a screen
    var vis = clipLine(m, b, w), yl = Math.min(vis[0][1], vis[1][1]), yh = Math.max(vis[0][1], vis[1][1]);
    var whyW = 'That’s only the window. The line runs off the edges of the screen and keeps going — the screen shows just part of it.';
    var rW = [{ is: bld('y', w[2], w[3]), code: 'u5l7-dr-window', hint: whyW }];
    if (!same(yl, w[2]) || !same(yh, w[3])) rW.push({ is: bld('y', cl(yl), cl(yh)), code: 'u5l7-dr-visible', hint: 'That’s only the part of the line you can see in this window. A slanted line keeps going up and down forever, so it reaches every ' + t('y') + '-value.' });
    return drPart(prompt, ALLX, ALLY, { dW: [{ is: bld('x', w[0], w[1]), code: 'u5l7-dr-window', hint: whyW }], rW: rW },
      'The line runs off the edges of the window at both ends — it has no endpoints, so it goes on forever left and right (every ' + t('x') + ') and up and down (every ' + t('y') + ').<br>' + t('D=\\{x\\mid x\\in\\mathbb{R}\\}') + ' (all real numbers), ' + t('R=\\{y\\mid y\\in\\mathbb{R}\\}') + ' (all real numbers).',
      ['Does the line stop anywhere inside the screen, or does it run off the edges?', 'A slanted line with no endpoints has every real number in its domain and in its range: type ' + t('\\mathbb{R}') + ' or ' + t('\\{x\\mid x\\in\\mathbb{R}\\}') + '.'], text);
  }

  /* ---- a whole-number context: 0, 1, 2, 3, … (domain) and 6, 10, 14, … (range) ---- */
  var DKEY = 'u5l7disc';
  if (HW.widgets && HW.widgets.KEYSETS && !HW.widgets.KEYSETS[DKEY]) {
    HW.widgets.KEYSETS[DKEY] = function (opt) {
      var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
      var vs = ((opt && opt.vars) || ['n']).slice(0, 2).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; });
      return [[d(7), d(8), d(9), { label: '{ }', tex: '\\left\\lbrace #0\\right\\rbrace', plain: '{', title: 'Braces' }, { label: '…', tex: '\\ldots ', plain: '...', title: 'and so on' }, { label: '⌫', fn: 'del', title: 'Delete' }],
        [d(4), d(5), d(6), { label: ',', tex: ',', plain: ', ' }, { label: '≥', tex: '\\ge ', plain: ' >= ' }, { label: 'clear', fn: 'clear' }],
        [d(1), d(2), d(3), { label: '∈', tex: '\\in ', plain: ' in ' }, { label: '𝕎', tex: '\\mathbb{W}', plain: 'W', title: 'whole numbers' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (out of the braces)' }],
        [d(0), { label: '.', tex: '.', plain: '.' }, { label: '−', tex: '-', plain: '-' }].concat(vs, [{ label: '|', tex: '\\mid ', plain: ' | ' }, { label: 'Check ↵', fn: 'enter', wide: true }])];
    };
    if (HW.widgets.KEYHELP) HW.widgets.KEYHELP[DKEY] = ['List the values in braces and end with <b>…</b> (they go on forever), e.g. ' + HW.k('\\{0,\\ 1,\\ 2,\\ 3,\\ \\ldots\\}') + '. Press <b>▶</b> to step out of the braces.', 'Type e.g. <code>{0, 1, 2, 3, ...}</code>.'];
  }
  function discRead(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\lbrace|\\\{/g, '{').replace(/\\rbrace|\\\}/g, '}').replace(/\\(ldots|dots|cdots)\b|…|\.\.\./g, ' # ').replace(/\\[,;: !]|~/g, ' ');
    if (!s.trim()) return { empty: true };
    var core = s.replace(/^\s*(\\text\{)?\s*(domain|range)\s*\}?\s*[:=]?\s*/i, '').replace(/^\s*[a-zA-Z]\s*=\s*/, '').trim();
    var inner = /^\{([^{}]*)\}$/.exec(core); inner = inner ? inner[1] : core;
    if (inner.indexOf('#') >= 0 && !/\\mid|\||∈|\\in\b/.test(inner)) {
      var ps = inner.split(',').map(function (z) { return z.trim(); }).filter(Boolean);
      if (ps[ps.length - 1] === '#') {
        var nums = ps.slice(0, -1).map(function (z) { var q = ex.parse(z); return q.ok ? ex.value(q.ast) : NaN; });
        if (nums.length >= 2 && nums.every(isFinite)) {
          var st = nums[1] - nums[0], arith = nums.every(function (v, i) { return i < 1 || same(v - nums[i - 1], st); });
          return { kind: 'seq', start: nums[0], step: st, arith: arith, n: nums.length };
        }
      }
      if (ps.indexOf('#') >= 0 && ps.indexOf('#') < ps.length - 1) return { kind: 'bounded' };
      return { bad: true };
    }
    if (/\\mathbb\{?W\}?|(^|[^a-zA-Z\\])W([^a-zA-Z]|$)|\\mathbb\{?N\}?|(^|[^a-zA-Z\\])N([^a-zA-Z]|$)/.test(s)) {
      var nat = /\\mathbb\{?N\}?|(^|[^a-zA-Z\\])N([^a-zA-Z]|$)/.test(s), lo = nat ? 1 : 0;
      var g = /([a-zA-Z])\s*(\\geq?|≥|>=|\\gt|>)\s*(-?\d+)/.exec(s), l = /(-?\d+)\s*(\\leq?|≤|<=|\\lt|<)\s*([a-zA-Z])/.exec(s);
      if (/\\leq?\s*-?\d|≤\s*-?\d|<=\s*-?\d|<\s*-?\d|\\lt/.test(s.replace(/(-?\d+)\s*(\\leq?|≤|<=|\\lt|<)\s*([a-zA-Z])/, ''))) return { kind: 'bounded' };
      if (g) lo = Math.max(lo, /\\geq?|≥|>=/.test(g[2]) ? Number(g[3]) : Number(g[3]) + 1);
      else if (l) lo = Math.max(lo, /\\leq?|≤|<=/.test(l[2]) ? Number(l[1]) : Number(l[1]) + 1);
      return { kind: 'seq', start: lo, step: 1, arith: true, n: 9, tagged: true };
    }
    var p = S.parse(s.replace(/#/g, ''));
    if (p.ok) return { kind: p.set.kind === 'list' ? 'bounded' : 'cont', set: p.set };
    return { bad: true };
  }
  /* o: { v, name ('domain' | 'range'), unit (e.g. 'walk'), stepWhy, startWhy, other: [start, step] } */
  function discChk(start, step, o) {
    var v = o.v;
    return function (resp) {
      var d = discRead(resp);
      if (d.empty) return form('empty', 'Type the ' + o.name + ' first.');
      if (d.bad) return form('u5l7-disc-read', 'List the values in braces and end with … because they never stop, e.g. ' + t('\\{0,\\ 1,\\ 2,\\ 3,\\ \\ldots\\}') + '.');
      if (d.kind === 'cont') {
        if (o.allR) return wrong('u5l7-disc-cont', o.contWhy);
        return wrong('u5l7-disc-cont', o.contWhy);
      }
      if (d.kind === 'bounded') return wrong('u5l7-disc-bounded', 'Nothing in the situation sets a largest value — the list keeps going. End it with … instead of a last number.');
      if (!d.arith) return wrong('u5l7-disc-step', 'Your values don’t go up by the same amount each time. ' + o.stepWhy);
      if (o.other && same(d.start, o.other[0]) && same(d.step, o.other[1]) && !(same(o.other[0], start) && same(o.other[1], step))) return wrong('set-swap', 'That’s the ' + (o.name === 'domain' ? 'range' : 'domain') + '. The <b>domain</b> lists the inputs (' + t(o.dv || 'n') + '); the <b>range</b> lists the outputs (' + t(o.rv || 'C') + ').');
      if (!same(d.start, start)) return wrong('u5l7-disc-start', o.startWhy);
      if (!same(d.step, step)) return wrong('u5l7-disc-step', o.stepWhy);
      if (d.n < 3 && !d.tagged) return form('u5l7-disc-short', 'Right start — list at least the first three values before the …, so the pattern is clear.');
      return ok();
    };
  }
  function seqTex(a, st) { return '\\{' + [0, 1, 2, 3].map(function (i) { return nT(a + i * st); }).join(',\\ ') + ',\\ \\ldots\\}'; }

  /* ---------------- grids and chips ---------------- */
  function grid(prompt, rows, cols, want, why, sol, hints, text) { return B.grid(prompt, rows, cols, want, { why: why }, sol, hints, text); }
  function chips(prompt, opts, want, why, sol, hints, text) { // opts: [{ value, html }]
    var byV = {}; opts.forEach(function (o) { byV[o.value] = o.html; });
    return { prompt: prompt, input: { type: 'select', options: opts }, check: K.selectSet(want, why), key: want.slice(), answer: want.map(function (v) { return byV[v]; }).join('<br>'), solution: sol, hints: hints || [], text: text, bad: [opts.map(function (o) { return o.value; })] };
  }

  /* ---------------- drawing (graph pad) ---------------- */
  function gv(pts, pieces) { return { pts: pts || [], pieces: pieces || [], join: 'none' }; }
  function lineV(p, q) { return { v: [p, q], s: 'arrow', e: 'arrow' }; }
  function exactChk(target, opt) { var base = K.graphExact(target, opt); return function (resp) { if (!DR.empty(resp) && DR.same(resp, target)) return ok(); return base(resp); }; }
  var LINEPAD = { x: [-6, 6], y: [-6, 6], labels: 2, defaultEnd: 'arrow', tools: ['line', 'ends'] };
  var LINEHELP = 'Use <b>╱ Line</b>: tap two points on the line — its ends start as arrows (a line goes on forever).';

  /* ---------------- equations of lines (for a counterexample) ---------------- */
  var EQK = 'u5l7eq';
  if (HW.widgets && HW.widgets.KEYSETS && !HW.widgets.KEYSETS[EQK]) {
    var dd = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    HW.widgets.KEYSETS[EQK] = [[dd(7), dd(8), dd(9), { label: '<i>x</i>', tex: 'x', plain: 'x' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dd(4), dd(5), dd(6), { label: '<i>y</i>', tex: 'y', plain: 'y' }, { label: 'clear', fn: 'clear' }],
      [dd(1), dd(2), dd(3), { label: '=', tex: '=', plain: '=' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (out of a box)' }],
      [dd(0), { label: '.', tex: '.', plain: '.' }, { label: '−', tex: '-', plain: '-' }, { label: '+', tex: '+', plain: '+' }, { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    if (HW.widgets.KEYHELP) HW.widgets.KEYHELP[EQK] = ['Type the whole equation with the <b>=</b> key, e.g. ' + HW.k('y=x-50') + '.', 'Type the whole equation, e.g. <code>y = x - 50</code>.'];
  }
  function linCoefs(resp) { // A, B, C of A x + B y + C = 0
    var s = strip(resp).replace(/\\cdot|\\times/g, '*'), parts = s.split('=');
    if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) return { err: 'unreadable' };
    var L = ex.parse(parts[0].trim()), R = ex.parse(parts[1].trim());
    if (!L.ok || !R.ok) return { err: 'unreadable' };
    var f = function (x, y) { var env = { x: x, y: y }; return ex.value(L.ast, env) - ex.value(R.ast, env); };
    var C = f(0, 0), A = f(1, 0) - C, Bc = f(0, 1) - C;
    if (![A, Bc, C].every(isFinite)) return { err: 'var' };
    var pts = [[2.5, -1.5], [-3.25, 4.75], [7, 3]];
    for (var i = 0; i < pts.length; i++) { var v = f(pts[i][0], pts[i][1]), w = A * pts[i][0] + Bc * pts[i][1] + C; if (!isFinite(v) || Math.abs(v - w) > 1e-7 * (1 + Math.abs(w))) return { err: 'nonlinear' }; }
    return { A: A, B: Bc, C: C };
  }

  /* ---------------- shared stories ---------------- */
  function q2Shared(r) {
    var bk = r.chance(0.15);
    var a = bk ? [1, 3] : [r.pick([1, 1, -1]), r.pick(nz(-9, 9))];
    var b = bk ? [2, -5] : [r.pick([2, -2]), r.pick([1, 3, 5, 7, 9]) * r.pick([1, -1])];
    var c = bk ? [6, -42] : pickWhere(function () { var m = r.int(3, 9), xi = r.int(2, 9) * r.pick([1, 1, -1]); return [m, -m * xi]; }, function (z) { return Math.abs(z[1]) > 10 && Math.abs(z[1]) <= 81; });
    var d = bk ? [-0.5, 3] : r.chance(0.7) ? [r.pick([-0.5, 0.5]), r.pick(nz(-4, 4))] : [r.pick([-0.25, 0.25]), r.pick(nz(-2, 2))];
    var e = bk ? [-8, -72] : pickWhere(function () { var m = -r.int(4, 9), xi = -r.int(2, 9); return [m, -m * xi]; }, function (z) { return z[1] < -10; });
    var f = bk ? [3, 27] : r.chance(0.5) ? pickWhere(function () { var m = r.int(2, 5), xi = -r.int(3, 9); return [m, -m * xi]; }, function (z) { return z[1] > 10; })
      : pickWhere(function () { return [r.pick([0.2, 0.25, 0.5, -0.5, -0.25, -0.2]), r.pick(nz(-6, 6))]; }, function (z) { var xi = -z[1] / z[0]; return Math.abs(xi) > 10 && Math.abs(xi) <= 30 && Math.abs(z[1]) >= 2; });
    return { rel: [a, b, c, d, e, f] };
  }
  function q8Shared(r) { var bk = r.chance(0.15); var F0 = bk ? 6 : r.pick([4, 5, 6, 8, 10]), R0 = bk ? 4 : r.pick([3, 4, 5, 6]); return { F: F0, R: R0, n: bk ? 5 : r.int(3, 9), k: bk ? 11 : r.int(7, 15) }; }
  function q9Shared(r) { var bk = r.chance(0.15); var F0 = bk ? 12 : r.pick([9, 10, 12, 15, 16, 18]), R0 = bk ? 3 : r.pick([2, 3, 4, 5]); return { F: F0, R: R0, h: bk ? 4 : r.int(2, 8), k: bk ? 6 : r.int(3, 9) }; }
  function q12Shared(r) { var bk = r.chance(0.15); var c = bk ? [20, 5] : r.pick([[20, 5], [20, 4], [40, 5], [40, 8], [40, 10], [60, 6], [60, 10], [60, 12], [80, 8], [80, 10], [100, 10], [100, 8], [30, 5], [30, 6], [50, 5], [50, 10], [90, 9], [90, 10], [24, 6], [36, 9], [48, 8]]); return { b: c[0], xi: c[1], m: -c[0] / c[1] }; }

  /* ===================================================================== */
  var QUESTIONS = [
    /* ---------------- Q1 vocabulary ---------------- */
    { num: '1', section: 'Part A — Vocabulary and Choosing a Window', stem: 'Complete each statement.', parts: (function () {
      var V = ['domain', 'range', 'window', 'x-intercept', 'y-intercept', 'slope', 'origin'];
      var why = { domain: 'The domain is the set of all the <b>inputs</b> (' + t('x') + '-values).', range: 'The range is the set of all the <b>outputs</b> (' + t('y') + '-values).', window: 'The viewing window is the frame (Xmin, Xmax, Ymin, Ymax) that decides what part of the graph is on the screen.',
        'x-intercept': 'An ' + t('x') + '-intercept is where a graph crosses the ' + t('x') + '-axis.', 'y-intercept': 'A ' + t('y') + '-intercept is where a graph crosses the ' + t('y') + '-axis.', slope: 'The slope tells how steep a line is.', origin: 'The origin is the point ' + t('(0,\\ 0)') + '.' };
      var lab = function (w) { return w.replace(/^x-/, '\\(x\\)-').replace(/^y-/, '\\(y\\)-'); };
      function voc(r, sentence, right, pool, text) {
        var others = r.sample(pool.filter(function (w) { return w !== right; }), 3);
        return mc(r, sentence, [{ html: lab(right), right: true }].concat(others.map(function (w) { return { html: lab(w), why: why[w] + ' Read the sentence again with that word in the blank.' }; })), why[right], ['Look back at the vocabulary in the notes: domain, range, window, intercepts.'], text);
      }
      return [
        { id: '1a', level: 'LIM', outcome: 'RF2', make: function (r) { return voc(r, 'The set of all possible ' + t('x') + '-values (inputs) of a relation is called the ______.', 'domain', V, 'vocab domain'); } },
        { id: '1b', level: 'LIM', outcome: 'RF2', make: function (r) { return voc(r, 'The set of all possible ' + t('y') + '-values (outputs) of a relation is called the ______.', 'range', V, 'vocab range'); } },
        { id: '1c', level: 'LIM', make: function (r) { return voc(r, 'The setting that controls the smallest and largest ' + t('x') + '- and ' + t('y') + '-values shown on a screen is called the viewing ______.', 'window', V, 'vocab window'); } },
        { id: '1d', level: 'LIM', make: function (r) { return voc(r, 'A point where a graph crosses the ' + t('x') + '-axis is called an ______.', 'x-intercept', V, 'vocab x-intercept'); } },
        { id: '1e', level: 'LIM', make: function (r) { return voc(r, 'A point where a graph crosses the ' + t('y') + '-axis is called a ______.', 'y-intercept', V, 'vocab y-intercept'); } }];
    })() },

    /* ---------------- Q2 intercepts without graphing + the standard window ---------------- */
    { num: '2', stem: 'Without graphing, determine the ' + t('x') + '- and ' + t('y') + '-intercepts of each relation. Then decide whether the <b>standard window</b> (' + t(winT(STD)) + ') would show both intercepts.',
      shared: q2Shared,
      parts: ['a', 'b', 'c', 'd', 'e', 'f'].map(function (L, i) {
        return { id: '2' + L, sub: L, level: ['BEG', 'EMG', 'BEG', 'EMG', 'EMG', 'EMG'][i], make: function (r, sh) {
          var z = sh.rel[i], m = z[0], b = z[1];
          return interceptVals('(' + L + ') ' + t(eqT(m, b)), m, b, { text: 'intercepts of y=' + m + 'x+' + b, solMore: '<br>' + (stdShows(m, b) ? 'Both are between ' + t('-10') + ' and ' + t('10') + ', so the standard window shows them.' : 'One of them is outside ' + t('[-10,\\ 10]') + ', so the standard window must be adjusted.') });
        } };
      }).concat([{ id: '2g', sub: 'g', level: 'EMG', make: function (r, sh) {
        var rows = sh.rel.map(function (z, i) { return { id: 'abcdef'.charAt(i), html: '(' + 'abcdef'.charAt(i) + ') ' + t(eqT(z[0], z[1])) }; });
        var want = {}; sh.rel.forEach(function (z, i) { want['abcdef'.charAt(i)] = stdShows(z[0], z[1]) ? 'ok' : 'adj'; });
        return grid('(g) For each relation, would the standard window ' + t(winT(STD)) + ' show <b>both</b> intercepts?', rows, [{ id: 'ok', html: 'Standard is fine' }, { id: 'adj', html: 'Must adjust' }], want,
          function (rw) { var z = sh.rel['abcdef'.indexOf(rw)]; return { code: 'u5l7-std-decision', hint: 'Check (' + rw + '): its intercepts are ' + t('x=' + vt(-z[1] / z[0])) + ' and ' + t('y=' + vt(z[1])) + '. The standard window shows only values from ' + t('-10') + ' to ' + t('10') + ' on each axis.' }; },
          sh.rel.map(function (z, i) { return '(' + 'abcdef'.charAt(i) + ') intercepts ' + t('x=' + vt(-z[1] / z[0])) + ', ' + t('y=' + vt(z[1])) + ': ' + (stdShows(z[0], z[1]) ? 'both inside ' + t('[-10,\\ 10]') + ' — <b>standard is fine</b>.' : '<b>must adjust</b> — ' + (Math.abs(z[1]) >= 10 ? t('y=' + vt(z[1])) : t('x=' + vt(-z[1] / z[0]))) + ' is off the screen.'); }).join('<br>'),
          ['Find both intercepts of each relation first.', 'Standard is fine only when <b>both</b> intercepts are between ' + t('-10') + ' and ' + t('10') + '.'], 'standard window decisions');
      } }]) },

    /* ---------------- Q3 a window, then a sketch ---------------- */
    { num: '3', stem: function (sh) { return 'Consider the relation ' + t(eqT(sh.m, sh.b)) + '.'; },
      shared: function (r) { if (r.chance(0.15)) return { m: 4, b: 4, xi: -1 }; return pickWhere(function () { var xi = r.pick(pm(1, 3)), m = r.pick(pm(1, 4)); return { m: m, b: -m * xi, xi: xi }; }, function (z) { return Math.abs(z.b) >= 2 && Math.abs(z.b) <= 5 && !(Math.abs(z.m) === 1 && Math.abs(z.xi) === 1); }); },
      parts: [
        { id: '3a', sub: 'a', level: 'EMG', make: function (r, sh) {
          var o = { show: [{ p: [sh.xi, 0], name: 'the ' + t('x') + '-intercept' }, { p: [0, sh.b], name: 'the ' + t('y') + '-intercept' }] };
          return winPart('(a) Use a graphing calculator or Desmos to graph the relation. State a window that shows both intercepts clearly.', o,
            'Intercepts first: ' + solveTex(sh.m, sh.b) + ', and ' + t('y=' + vt(sh.b)) + ' at ' + t('x=0') + ', so the line passes through ' + t(ptT([sh.xi, 0])) + ' and ' + t(ptT([0, sh.b])) + '.<br>Choose the edges a little beyond these, e.g. ' + t(winT(niceWin(o))) + '. (The standard window would also show them, just squeezed near the centre.)',
            ['Find the two intercepts first.', 'Xmin and Xmax must be on either side of ' + t('x=' + vt(sh.xi)) + ' and ' + t('0') + '; Ymin and Ymax on either side of ' + t('y=' + vt(sh.b)) + ' and ' + t('0') + '.'], 'window for y=' + sh.m + 'x+' + sh.b);
        } },
        { id: '3b', sub: 'b', level: 'BEG', make: function (r, sh) {
          var tg = gv([], [lineV([sh.xi, 0], [0, sh.b])]);
          var chk = exactChk(tg, { wrong: [{ is: gv([], [lineV([sh.b, 0], [0, sh.xi])]), code: 'int-pt-swap', hint: 'Your line has the intercepts swapped: the ' + t('x') + '-intercept ' + t(ptT([sh.xi, 0])) + ' is on the horizontal axis.' },
            { is: gv([], [lineV([-sh.xi, 0], [0, sh.b])]), code: 'int-sign', hint: 'Check where your line crosses the ' + t('x') + '-axis: it should be at ' + t(vt(sh.xi)) + '.' }, { is: gv([], [lineV([sh.xi, 0], [0, -sh.b])]), code: 'int-sign', hint: 'Check where your line crosses the ' + t('y') + '-axis: it should be at ' + t(vt(sh.b)) + '.' }] });
          var p = B.graph('(b) Sketch the graph. ' + LINEHELP, LINEPAD, chk, tg, 'Plot ' + t(ptT([sh.xi, 0])) + ' and ' + t(ptT([0, sh.b])) + ', then draw the line through them with arrows on both ends. From ' + t(ptT([0, sh.b])) + ', each step of ' + t('1') + ' to the right goes ' + t(vt(Math.abs(sh.m))) + ' ' + (sh.m > 0 ? 'up' : 'down') + '.',
            ['Use the intercepts from part (a): ' + t(ptT([sh.xi, 0])) + ' and ' + t(ptT([0, sh.b])) + '.'], 'sketch y=' + sh.m + 'x+' + sh.b);
          p.bad = [gv([], [lineV([sh.b, 0], [0, sh.xi])]), gv([], [{ v: [[sh.xi, 0], [0, sh.b]], s: 'closed', e: 'closed' }]), gv([[sh.xi, 0], [0, sh.b]])].filter(function (b) { return !DR.same(b, tg); });
          return p;
        } }] },

    /* ---------------- Q4 reading intercepts off a screen ---------------- */
    { num: '4', section: 'Part B — Reading Intercepts, Domain, and Range Off a Screen', stem: 'Each screen shows a line as it would appear on a graphing calculator or in Desmos (gridlines are ' + t('1') + ' unit apart). State the ' + t('x') + '-intercept and the ' + t('y') + '-intercept as points.',
      parts: [
        { id: '4a', sub: 'a', level: 'BEG', make: function (r) {
          var z = r.chance(0.15) ? { m: 3, xi: 2 } : { m: r.int(2, 4), xi: r.int(1, 3) }; if (z.m * z.xi > 9) z.xi = 2; var b = -z.m * z.xi;
          var w = [-r.int(1, 2), z.xi + r.int(1, 2), b - r.int(1, 2), r.int(2, 4)];
          return interceptPts('(a)<br>' + screen({ w: w, gx: 1, gy: 1, lx: 1, ly: 2, lines: [{ m: z.m, b: b }], max: 220 }), z.xi, b,
            { sol: 'The line crosses the ' + t('x') + '-axis at ' + t(z.xi) + ' and the ' + t('y') + '-axis at ' + t(b) + ' (count the gridlines from the origin).<br>' + t('x') + '-intercept ' + t(ptT([z.xi, 0])) + ', ' + t('y') + '-intercept ' + t(ptT([0, b])) + '.', text: 'screen intercepts ' + z.xi + ',' + b });
        } },
        { id: '4b', sub: 'b', level: 'BEG', make: function (r) {
          var z = r.chance(0.15) ? { m: -2, xi: 4 } : { m: -r.int(1, 3), xi: r.int(2, 5) }; if (-z.m * z.xi > 10) z.xi = 3; var b = -z.m * z.xi;
          var w = [-r.int(1, 2), z.xi + r.int(1, 2), -r.int(1, 2), b + r.int(1, 2)];
          return interceptPts('(b)<br>' + screen({ w: w, gx: 1, gy: 1, lx: 1, ly: 2, lines: [{ m: z.m, b: b }], max: 220 }), z.xi, b,
            { sol: 'The line starts high on the ' + t('y') + '-axis at ' + t(b) + ' and falls to the ' + t('x') + '-axis at ' + t(z.xi) + '.<br>' + t('x') + '-intercept ' + t(ptT([z.xi, 0])) + ', ' + t('y') + '-intercept ' + t(ptT([0, b])) + '.', text: 'screen intercepts ' + z.xi + ',' + b });
        } }] },

    /* ---------------- Q5 a stated window ---------------- */
    { num: '5', parts: [{ id: '5', level: 'BEG', make: function (r) {
      var z = r.chance(0.15) ? { m: -2, xi: -2 } : pickWhere(function () { return { m: r.pick([-3, -2, -1, 2, 3]), xi: r.pick(pm(1, 4)) }; }, function (q) { return Math.abs(q.m * q.xi) >= 2 && Math.abs(q.m * q.xi) <= 8; });
      var b = -z.m * z.xi, w = [Math.min(-6, z.xi - 2), Math.max(4, z.xi + 2), Math.min(-10, b - 2), Math.max(6, b + 2)];
      return interceptPts('The screen shows ' + t(eqT(z.m, b)) + ' using the window ' + t(winT(w)) + '.<br>' + screen({ w: w, gx: 1, gy: 2, lx: 2, ly: 2, lines: [{ m: z.m, b: b }], max: 240 }) + '<br>Use the graph (or the calculator’s zero/table/value features) to state the ' + t('x') + '-intercept and the ' + t('y') + '-intercept.', z.xi, b,
        { sol: '<b>From the screen:</b> the line crosses the ' + t('x') + '-axis at ' + t(z.xi) + ' and the ' + t('y') + '-axis at ' + t(b) + '.<br><b>Check with algebra:</b> ' + solveTex(z.m, b) + '; and ' + t('y=' + vt(z.m) + '(0)' + (b < 0 ? '' : '+') + vt(b) + '=' + vt(b)) + '.<br>' + t('x') + '-intercept ' + t(ptT([z.xi, 0])) + ', ' + t('y') + '-intercept ' + t(ptT([0, b])) + '.', text: 'screen intercepts ' + z.m + ',' + b });
    } }] },

    /* ---------------- Q6 domain and range of a line on the standard window ---------------- */
    { num: '6', stem: 'Each screen shows a straight (non-horizontal) line in the standard window, ' + t(winT(STD)) + '. State the domain and the range.', parts: [
      { id: '6a', sub: 'a', level: 'BEG', outcome: 'RF2', make: function (r) {
        var m = r.chance(0.15) ? 5 : r.pick(pm(2, 6)), b = r.chance(0.15) ? -2 : r.pick(nz(-5, 5));
        return lineDR('(a) ' + t(eqT(m, b)) + '<br>' + screen({ w: STD, gx: 2, gy: 2, lx: 5, ly: 5, lines: [{ m: m, b: b }], max: 210 }), m, b, STD, 'D&R of y=' + m + 'x+' + b);
      } },
      { id: '6b', sub: 'b', level: 'EMG', outcome: 'RF2', make: function (r) {
        var m = r.chance(0.15) ? -0.5 : r.pick([0.5, -0.5, 0.25, -0.25, 0.2, -0.2]), b = r.chance(0.15) ? 1 : r.pick(nz(-4, 4));
        return lineDR('(b) ' + t(eqT(m, b)) + '<br>' + screen({ w: STD, gx: 2, gy: 2, lx: 5, ly: 5, lines: [{ m: m, b: b }], max: 210 }), m, b, STD, 'D&R of y=' + m + 'x+' + b);
      } }] },

    /* ---------------- Q7 true or false ---------------- */
    { num: '7', stem: 'State whether each sentence is <b>true</b> or <b>false</b>.', parts: [
      { id: '7a', sub: 'a', level: 'LIM', make: function (r) { var m = r.pick(nz(-5, 5)), b = r.pick(nz(-9, 9));
        return B.tf(r, '(a) A graphing calculator’s window controls which part of the graph of ' + t(eqT(m, b)) + ' is visible on the screen.', true, 'The window is the frame laid over the plane: only what is inside it appears.', '<b>True</b> — the window (Xmin, Xmax, Ymin, Ymax) is the frame around the picture; the graph itself doesn’t change.', [], 'tf window controls'); } },
      { id: '7b', sub: 'b', level: 'BEG', make: function (r) { var b = r.int(11, 60) * r.pick([1, -1]), m = r.pick(nz(-5, 5));
        return B.tf(r, '(b) The ' + t('y') + '-intercept of ' + t(eqT(m, b)) + ' is ' + t(b) + '. In a window with Ymin ' + t('=-10') + ' and Ymax ' + t('=10') + ', the screen will not show this intercept.', true, t(b) + ' is ' + (b > 0 ? 'above Ymax' : 'below Ymin') + ', so that point is outside the frame.', '<b>True</b> — ' + t(b) + ' is ' + (b > 0 ? 'above the top' : 'below the bottom') + ' of the window, so the point ' + t(ptT([0, b])) + ' is off the screen.', [], 'tf y-int off screen'); } },
      { id: '7c', sub: 'c', level: 'BEG', outcome: 'RF2', make: function (r) { var m = r.pick(nz(-6, 6)), b = r.pick(nz(-9, 9));
        return B.tf(r, '(c) The domain of the straight, non-horizontal line ' + t(eqT(m, b)) + ' is a single number.', false, 'The line runs left and right forever: every ' + t('x') + '-value has a point on it.', '<b>False</b> — its domain is all real numbers. (A <b>vertical</b> line is the one whose domain is a single number.)', [], 'tf domain single'); } },
      { id: '7d', sub: 'd', level: 'LIM', make: function (r) { var m = r.pick(nz(-5, 5)), b = r.pick(nz(-9, 9)), x0 = r.pick(nz(-4, 6));
        return B.tf(r, '(d) The trace feature can be used to find the ' + t('y') + '-value of ' + t(eqT(m, b)) + ' at ' + t('x=' + x0) + '.', true, 'Trace moves along the graph and reports ' + t('(x,\\ y)') + ' — as do table and value.', '<b>True</b> — trace, table and value all give the ' + t('y') + '-value at a chosen ' + t('x') + ' (here ' + t('y=' + vt(m * x0 + b)) + ').', [], 'tf trace'); } },
      { id: '7e', sub: 'e', level: 'BEG', make: function (r) { var m = r.pick(nz(-5, 5)), b = r.pick(nz(-9, 9)), k = r.pick([20, 30, 50]);
        return B.tf(r, '(e) Changing the window from ' + t(winT(STD)) + ' to ' + t(winT([-k, k, -k, k])) + ' changes the actual shape of ' + t(eqT(m, b)) + '.', false, 'The window only changes how much of the graph you see, like zooming a camera.', '<b>False</b> — the relation is the same; only the part of it you can see (and how big it looks) changes.', [], 'tf window shape'); } }] },

    /* ---------------- Q8 dog walking (whole numbers) ---------------- */
    { num: '8', section: 'Part C — Applications', stem: function (sh) { return 'A dog-walking business charges a $' + sh.F + ' booking fee plus $' + sh.R + ' per walk. The total cost, ' + t('C') + ' dollars, for ' + t('n') + ' walks booked in a month is ' + t('C=' + sh.F + '+' + sh.R + 'n') + '.'; },
      shared: q8Shared, parts: [
      { id: '8a', sub: 'a', level: 'PRG', make: function (r, sh) {
        var o = { ctx: true, show: [{ p: [0, sh.F], name: 'the ' + t('C') + '-intercept' }], fn: { m: sh.R, b: sh.F }, minX: 5, v: 'n', w: 'C', key: [0, 12, 0, Math.ceil((sh.F + 12 * sh.R + 1) / 10) * 10] };
        return winPart('(a) Use technology to graph this relation. State a window that is appropriate for this situation (' + t('x') + ' is ' + t('n') + ', ' + t('y') + ' is ' + t('C') + ').', o,
          'Neither ' + t('n') + ' nor ' + t('C') + ' can be negative, so start both at ' + t('0') + '. For about a dozen walks the cost reaches ' + t(sh.F + '+' + sh.R + '(12)=' + (sh.F + 12 * sh.R)) + '.<br>A good window: ' + t(winT(o.key)) + '.',
          ['Walks and dollars can’t be negative: start the window at ' + t('0') + '.', 'Pick a largest number of walks (Xmax), then make Ymax a bit more than the cost of that many walks.'], 'context window walks');
      } },
      { id: '8b', sub: 'b', level: 'BEG', outcome: 'RF5', make: function (r, sh) {
        return mc(r, '(b) Determine the ' + t('C') + '-intercept, and explain what it means in this situation.', [
          { html: t('C=' + sh.F) + ': the $' + sh.F + ' booking fee, charged even for ' + t('0') + ' walks', right: true },
          { html: t('C=' + sh.R) + ': the cost of each walk', why: 'The cost of each walk is the rate. The ' + t('C') + '-intercept is the cost when ' + t('n=0') + '.', code: 'rate' },
          { html: t('C=' + (sh.F + sh.R)) + ': the cost of booking the first walk', why: 'That is the cost for ' + t('n=1') + '. The intercept is where ' + t('n=0') + '.', code: 'first' },
          { html: t('n=' + vt(-sh.F / sh.R)) + ': the number of walks when the cost is $0', why: 'That is the ' + t('n') + '-intercept, and a negative number of walks is impossible. The ' + t('C') + '-intercept is at ' + t('n=0') + '.', code: 'n-int' }],
          'At ' + t('n=0') + ': ' + t('C=' + sh.F + '+' + sh.R + '(0)=' + sh.F) + ', so the intercept is ' + t(ptT([0, sh.F])) + '. It is the <b>$' + sh.F + ' booking fee</b>, paid even if no walks are booked.', ['The ' + t('C') + '-intercept is the value of ' + t('C') + ' when ' + t('n=0') + '.'], 'C-intercept meaning walks');
      } },
      { id: '8c', sub: 'c', level: 'BEG', make: function (r, sh) {
        var ans = sh.F + sh.R * sh.n;
        return B.number('(c) Determine the cost of booking ' + t(sh.n) + ' walks.', ans, function (v) {
          if (same(v, sh.R * sh.n)) return { code: 'ctx-no-fee', hint: 'Don’t forget the $' + sh.F + ' booking fee.' };
          if (same(v, sh.F + sh.R + sh.n)) return { code: 'ctx-rate-n', hint: t(sh.R + 'n') + ' means ' + t(sh.R + '\\times n') + ': multiply.' };
          if (same(v, (sh.F + sh.R) * sh.n)) return { code: 'tab-rate', hint: 'The booking fee is paid once, not for every walk.' };
          return null; }, t('C=' + sh.F + '+' + sh.R + '(' + sh.n + ')=' + sh.F + '+' + (sh.R * sh.n) + '=' + ans) + ' dollars.', ['Substitute ' + t('n=' + sh.n) + ' into ' + t('C=' + sh.F + '+' + sh.R + 'n') + '.'], 'cost of n walks', { before: '$' });
      } },
      { id: '8d', sub: 'd', level: 'EMG', make: function (r, sh) {
        var P = sh.F + sh.R * sh.k;
        return B.number('(d) A customer paid $' + P + '. How many walks did they book?', sh.k, function (v) {
          if (same(v, P / sh.R)) return { code: 'ctx-no-sub', hint: 'Subtract the $' + sh.F + ' booking fee first, then divide by ' + t(sh.R) + '.' };
          if (same(v, (P + sh.F) / sh.R)) return { code: 'ctx-added', hint: 'Subtract the fee (' + t(P + '-' + sh.F) + '), don’t add it.' };
          if (same(v, sh.F + sh.R * P)) return { code: 'ctx-eval', hint: 'Here the <b>cost</b> is known: solve ' + t(P + '=' + sh.F + '+' + sh.R + 'n') + ' for ' + t('n') + '.' };
          if (same(v, (P - sh.F) * sh.R)) return { code: 'ctx-mult', hint: 'Divide by ' + t(sh.R) + ' at the end, don’t multiply.' };
          return null; }, t(P + '=' + sh.F + '+' + sh.R + 'n') + ' → ' + t((P - sh.F) + '=' + sh.R + 'n') + ' → ' + t('n=' + sh.k) + ' walks.', ['Set ' + t('C=' + P) + ' and solve for ' + t('n') + '.'], 'walks from cost', { after: 'walks' });
      } },
      { id: '8e', sub: 'e', level: 'PRG', outcome: 'RF2', make: function (r, sh) {
        var vars = ['n', 'C'];
        var fl = [{ label: 'Domain', name: 'Domain', mode: 'math', keys: DKEY, vars: vars, placeholder: 'e.g. {0, 1, 2, 3, ...}' }, { label: 'Range', name: 'Range', mode: 'math', keys: DKEY, vars: vars, placeholder: 'e.g. {5, 8, 11, ...}' }];
        var cD = discChk(0, 1, { name: 'domain', other: [sh.F, sh.R], startWhy: 'The smallest possible number of walks is ' + t('0') + ' (just the booking fee).', stepWhy: 'Walks come in whole numbers: ' + t('0,\\ 1,\\ 2,\\ 3,\\ \\ldots'), contWhy: 'You can’t book ' + t('2.5') + ' walks or ' + t('-1') + ' walks: only whole numbers ' + t('0,\\ 1,\\ 2,\\ \\ldots') + ' are possible, so <b>list</b> them and end with …' });
        var cR = discChk(sh.F, sh.R, { name: 'range', other: [0, 1], startWhy: 'The cheapest month is ' + t('n=0') + ': ' + t('C=' + sh.F) + '. Start the list there.', stepWhy: 'Each extra walk adds $' + sh.R + ', so the costs go up by ' + t(sh.R) + ' each time.', contWhy: 'The cost can’t be just any number above $' + sh.F + ': it jumps by $' + sh.R + ' with each walk, so <b>list</b> the possible costs and end with …' });
        var D = seqTex(0, 1), R = seqTex(sh.F, sh.R);
        var p = B.fields('(e) State an appropriate domain and range for this relation, given the context.', fl, [cD, cR], [D, R], t('D=' + D) + ' (whole numbers)<br>' + t('R=' + R),
          'A walk can’t be split in half and can’t be negative, so the inputs are whole numbers: ' + t('D=' + D) + ' (that is, ' + t('n\\ge 0,\\ n\\in\\mathbb{W}') + ').<br>Each extra walk adds $' + sh.R + ' to the $' + sh.F + ' fee, so the outputs jump in steps of ' + t(sh.R) + ': ' + t('R=' + R) + '.<br>The relation is <b>discrete</b>: the points don’t join into a solid line.',
          ['Can a customer book ' + t('2.5') + ' walks? What is the smallest number of walks?', 'List the first few values and end with … because there is no largest value.'], 'discrete domain & range walks');
        p.good = [['\\left\\lbrace 0,1,2,3,\\ldots\\right\\rbrace', '\\{' + sh.F + ', ' + (sh.F + sh.R) + ', ' + (sh.F + 2 * sh.R) + ', \\ldots\\}'], ['\\{n\\mid n\\ge 0,\\ n\\in\\mathbb{W}\\}', R], ['n\\in W', R]];
        p.bad = [['\\{n\\mid n\\ge 0,\\ n\\in\\mathbb{R}\\}', R], [D, '\\{C\\mid C\\ge ' + sh.F + ',\\ C\\in\\mathbb{R}\\}'], [R, D], ['\\{1, 2, 3, \\ldots\\}', R], [D, seqTex(sh.F, 1)], ['\\{0, 1, 2, \\ldots, 12\\}', R]];
        return p;
      } }] },

    /* ---------------- Q9 canoe (any time) ---------------- */
    { num: '9', stem: function (sh) { return 'A rental company charges a flat $' + sh.F + ' fee plus $' + sh.R + ' per hour to rent a canoe. The total cost, ' + t('C') + ' dollars, to rent the canoe for ' + t('h') + ' hours is ' + t('C=' + sh.F + '+' + sh.R + 'h') + '.'; },
      shared: q9Shared, parts: [
      { id: '9a', sub: 'a', level: 'PRG', make: function (r, sh) {
        var o = { ctx: true, show: [{ p: [0, sh.F], name: 'the ' + t('C') + '-intercept' }], fn: { m: sh.R, b: sh.F }, minX: 4, v: 'h', w: 'C', key: [0, 10, 0, Math.ceil((sh.F + 10 * sh.R + 1) / 5) * 5] };
        return winPart('(a) Use technology to graph this relation. State a reasonable window (' + t('x') + ' is ' + t('h') + ', ' + t('y') + ' is ' + t('C') + ').', o,
          'Time and cost are both non-negative, so start at ' + t('0') + '. After ' + t('10') + ' hours the cost is ' + t(sh.F + '+' + sh.R + '(10)=' + (sh.F + 10 * sh.R)) + '.<br>A good window: ' + t(winT(o.key)) + '.', ['Hours and dollars can’t be negative: start the window at ' + t('0') + '.', 'Pick a longest rental (Xmax), then make Ymax a bit more than its cost.'], 'context window canoe');
      } },
      { id: '9b', sub: 'b', level: 'BEG', outcome: 'RF5', make: function (r, sh) {
        return mc(r, '(b) Determine the ' + t('C') + '-intercept, and explain what it means in this situation.', [
          { html: t('C=' + sh.F) + ': the flat $' + sh.F + ' fee, paid before any time on the water', right: true },
          { html: t('C=' + sh.R) + ': the cost of each hour', why: 'That is the hourly rate. The ' + t('C') + '-intercept is the cost when ' + t('h=0') + '.', code: 'rate' },
          { html: t('C=' + (sh.F + sh.R)) + ': the cost of a one-hour rental', why: 'That is the cost at ' + t('h=1') + '. The intercept is where ' + t('h=0') + '.', code: 'first' },
          { html: t('C=0') + ': nothing is charged before you rent', why: 'At ' + t('h=0') + ' the flat fee is still charged.', code: 'zero' }],
          'At ' + t('h=0') + ': ' + t('C=' + sh.F + '+' + sh.R + '(0)=' + sh.F) + ', the point ' + t(ptT([0, sh.F])) + '. It is the <b>flat $' + sh.F + ' fee</b>.', ['Substitute ' + t('h=0') + '.'], 'C-intercept meaning canoe');
      } },
      { id: '9c', sub: 'c', level: 'EMG', make: function (r, sh) {
        var hi = -sh.F / sh.R;
        var p = valsPart('(c) Algebraically determine the ' + t('h') + '-intercept.', [{ label: t('h') + '-intercept:', name: 'h-intercept', before: t('h='), ans: hi,
          diag: [[sh.F / sh.R, 'int-sign', 'Check the sign: ' + t('0=' + sh.F + '+' + sh.R + 'h') + ' gives ' + t(sh.R + 'h=-' + sh.F) + '.'], [-sh.F, 'int-no-divide', 'Now divide both sides by ' + t(sh.R) + '.'], [sh.F, 'int-gave-y', 'That’s the ' + t('C') + '-intercept. For the ' + t('h') + '-intercept set ' + t('C=0') + '.']] }],
          'Set ' + t('C=0') + ': ' + t('0=' + sh.F + '+' + sh.R + 'h') + ' → ' + t(sh.R + 'h=-' + sh.F) + ' → ' + t('h=' + vt(hi)) + '.', ['The ' + t('h') + '-intercept is where the cost ' + t('C') + ' is ' + t('0') + '.'], 'h-intercept canoe');
        return p;
      } },
      { id: '9c2', sub: 'c, explain', level: 'EMG', outcome: 'RF2', make: function (r, sh) {
        var hi = -sh.F / sh.R;
        return mc(r, '(c) The ' + t('h') + '-intercept is ' + t('h=' + vt(hi)) + '. Does this value make sense in this situation?', [
          { html: 'No — a rental can’t last a negative number of hours, and the cost never drops to $0 because of the flat fee.', right: true },
          { html: 'Yes — it is the time when the rental is free.', why: 'A time of ' + t(vt(hi)) + ' hours is before the rental even starts. It can’t happen.', code: 'free' },
          { html: 'Yes — every intercept of a graph has a meaning in the story.', why: 'An intercept can exist for the equation and still lie outside the real situation.', code: 'always' },
          { html: 'No — because ' + t('h') + ' must be a whole number.', why: 'A canoe can be rented for part of an hour. The problem is the <b>negative</b> time.', code: 'whole' }],
          '<b>No.</b> ' + t('h=' + vt(hi)) + ' would mean renting for a negative time, which is impossible, and the flat fee means the cost is never $0. The intercept exists for the equation but lies outside the real situation.', ['Can time be negative?'], 'h-intercept meaning');
      } },
      { id: '9d', sub: 'd', level: 'BEG', make: function (r, sh) {
        var ans = sh.F + sh.R * sh.h;
        return B.number('(d) Determine the cost to rent the canoe for ' + t(sh.h) + ' hours.', ans, function (v) {
          if (same(v, sh.R * sh.h)) return { code: 'ctx-no-fee', hint: 'Don’t forget the flat $' + sh.F + ' fee.' };
          if (same(v, sh.F + sh.R + sh.h)) return { code: 'ctx-rate-n', hint: t(sh.R + 'h') + ' means ' + t(sh.R + '\\times h') + ': multiply.' };
          if (same(v, (sh.F + sh.R) * sh.h)) return { code: 'tab-rate', hint: 'The flat fee is paid once, not every hour.' };
          return null; }, t('C=' + sh.F + '+' + sh.R + '(' + sh.h + ')=' + ans) + ' dollars.', ['Substitute ' + t('h=' + sh.h) + '.'], 'cost of h hours', { before: '$' });
      } },
      { id: '9e', sub: 'e', level: 'EMG', make: function (r, sh) {
        var P = sh.F + sh.R * sh.k;
        return B.number('(e) If the total cost was $' + P + ', how many hours was the canoe rented?', sh.k, function (v) {
          if (same(v, P / sh.R)) return { code: 'ctx-no-sub', hint: 'Subtract the $' + sh.F + ' fee first, then divide by ' + t(sh.R) + '.' };
          if (same(v, (P + sh.F) / sh.R)) return { code: 'ctx-added', hint: 'Subtract the fee, don’t add it.' };
          if (same(v, sh.F + sh.R * P)) return { code: 'ctx-eval', hint: 'The cost is known: solve ' + t(P + '=' + sh.F + '+' + sh.R + 'h') + ' for ' + t('h') + '.' };
          if (same(v, (P - sh.F) * sh.R)) return { code: 'ctx-mult', hint: 'Divide by ' + t(sh.R) + ', don’t multiply.' };
          return null; }, t(P + '=' + sh.F + '+' + sh.R + 'h') + ' → ' + t((P - sh.F) + '=' + sh.R + 'h') + ' → ' + t('h=' + sh.k) + ' hours.', ['Set ' + t('C=' + P) + ' and solve for ' + t('h') + '.'], 'hours from cost', { after: 'hours' });
      } },
      { id: '9f', sub: 'f', level: 'PRG', outcome: 'RF2', make: function (r, sh) {
        var D = bld('h', 0, null), R = bld('C', sh.F, null);
        return drPart('(f) State the domain and range of this relation in context. (<i>Hint:</i> a canoe can be rented for a fraction of an hour.)', D, R, { dv: 'h', rv: 'C',
          dW: [{ is: all('h'), code: 'u5l7-dr-all', hint: 'In this situation the time can’t be negative: the domain starts at ' + t('h=0') + '.' }, { is: bld('h', 0, null, false), code: 'set-endpoint', hint: 'Is ' + t('h=0') + ' possible? At ' + t('h=0') + ' you pay just the fee — include it.' }, { is: bld('h', vt(-sh.F / sh.R), null), code: 'u5l7-dr-negative', hint: 'That starts at the ' + t('h') + '-intercept, a negative time. Time starts at ' + t('0') + '.' }],
          rW: [{ is: all('C'), code: 'u5l7-dr-all', hint: 'The cost can never be below the $' + sh.F + ' fee.' }, { is: bld('C', 0, null), code: 'u5l7-dr-negative', hint: 'The cheapest rental still costs the flat fee: the range starts at ' + t('C=' + sh.F) + '.' }] },
          'Time can be any value from ' + t('0') + ' up (e.g. ' + t('2.5') + ' h), so the relation is continuous: ' + t('D=' + D) + '.<br>The cost starts at the $' + sh.F + ' fee and goes up from there: ' + t('R=' + R) + '.',
          ['What is the shortest possible rental? What does it cost?', 'Any time (not just whole hours) is possible, so use inequalities: ' + t('h\\ge \\ldots') + ', ' + t('C\\ge \\ldots') + '.'], 'context D&R canoe');
      } }] },

    /* ---------------- Q10, Q11 multiple choice ---------------- */
    { num: '10', stem: '<i>(Multiple choice)</i>', parts: [{ id: '10', level: 'EMG', make: function (r) {
      var bad = r.int(11, 60) * r.pick([1, 1, -1]), okb = r.sample(nz(-9, 9), 3), ms = r.sample([2, -3, 0.5, 4, -2, 3, -0.5, 5], 4);
      return mc(r, 'A calculator’s standard window is ' + t(winT(STD)) + '. Which relation would have its ' + t('y') + '-intercept cut off (not visible) in that window?', [
        { html: t(eqT(ms[0], bad)), right: true }].concat(okb.map(function (b, i) { return { html: t(eqT(ms[i + 1], b)), why: 'Its ' + t('y') + '-intercept is ' + t(b) + ', which is between ' + t('-10') + ' and ' + t('10') + ' — visible.', code: 'in' + i }; })),
        'The ' + t('y') + '-intercept is the constant term. Only ' + t(bad) + ' is outside ' + t('[-10,\\ 10]') + ', so it would be ' + (bad > 0 ? 'above the top' : 'below the bottom') + ' of the screen.', ['The ' + t('y') + '-intercept of ' + t('y=mx+b') + ' is ' + t('b') + '.'], 'MC y-int cut off');
    } }] },
    { num: '11', stem: '<i>(Multiple choice)</i>', parts: [{ id: '11', level: 'BEG', outcome: 'RF2', make: function (r) {
      var m = r.pick(pm(1, 6).concat([0.5, -0.5])), b = r.pick(nz(-9, 9));
      return mc(r, 'Which statement about the domain and range of the line ' + t(eqT(m, b)) + ' is true?', [
        { html: 'The domain and range are both all real numbers.', right: true },
        { html: 'The domain is positive numbers only.', why: 'The line also continues to the left, where ' + t('x') + ' is negative.', code: 'pos' },
        { html: 'The range depends only on the ' + t('y') + '-intercept, so it is ' + t('\\{' + b + '\\}') + '.', why: 'Only a horizontal line has a single ' + t('y') + '-value. This line is slanted.', code: 'yint' },
        { html: 'The domain and range are ' + t('-10\\le x\\le 10') + ' and ' + t('-10\\le y\\le 10') + '.', why: 'Those are the edges of the standard window, not of the line. The line keeps going.', code: 'window' }],
        'A slanted line has no endpoints: it stretches left and right forever (every ' + t('x') + ') and up and down forever (every ' + t('y') + ').', ['Does a slanted line ever stop?'], 'MC line D&R');
    } }] },

    /* ---------------- Q12 one relation, then a real story ---------------- */
    { num: '12', stem: function (sh) { return 'Consider the relation ' + t(eqT(sh.m, sh.b)) + '.'; }, shared: q12Shared, parts: [
      { id: '12a', sub: 'a', level: 'BEG', make: function (r, sh) { return interceptVals('(a) Determine the ' + t('x') + '-intercept and the ' + t('y') + '-intercept.', sh.m, sh.b, { text: 'intercepts battery line' }); } },
      { id: '12b', sub: 'b', level: 'EMG', make: function (r, sh) {
        var o = { show: [{ p: [sh.xi, 0], name: 'the ' + t('x') + '-intercept' }, { p: [0, sh.b], name: 'the ' + t('y') + '-intercept' }] };
        return winPart('(b) State a window that would show both intercepts clearly.', o, 'The frame must reach past ' + t('x=' + sh.xi) + ' and past ' + t('y=' + sh.b) + ', with a little room, e.g. ' + t(winT(niceWin(o))) + '.' + (sh.b > 10 ? ' (The standard window would cut off the ' + t('y') + '-intercept.)' : ''),
          ['The intercepts are ' + t(ptT([sh.xi, 0])) + ' and ' + t(ptT([0, sh.b])) + '.'], 'window battery');
      } },
      { id: '12c', sub: 'c', level: 'BEG', outcome: 'RF2', make: function (r, sh) {
        return drPart('(c) State the domain and range of this relation.', ALLX, ALLY, { dW: [{ is: bld('x', 0, sh.xi), code: 'u5l7-dr-visible', hint: 'As a pure relation (no story yet) the line has no endpoints — it keeps going past the intercepts.' }], rW: [{ is: bld('y', 0, sh.b), code: 'u5l7-dr-visible', hint: 'As a pure relation the line keeps going past the intercepts, up and down forever.' }] },
          'As a pure relation the line has no endpoints: ' + t('D=\\{x\\mid x\\in\\mathbb{R}\\}') + ' and ' + t('R=\\{y\\mid y\\in\\mathbb{R}\\}') + ' (all real numbers).', ['Does a slanted line ever stop?'], 'D&R battery line');
      } },
      { id: '12d', sub: 'd', level: 'EMG', outcome: 'RF2', make: function (r, sh) {
        return mc(r, '(d) Suppose this relation instead represents the battery charge remaining, ' + t('y') + '%, on a phone after ' + t('x') + ' hours of use. Would the domain and range from part (c) still make sense?', [
          { html: 'No — hours of use can’t be negative, and the charge can’t go below ' + t('0') + '%.', right: true },
          { html: 'Yes — the equation hasn’t changed, so the domain and range stay the same.', why: 'The story limits which values can really happen: negative hours or a charge below ' + t('0') + '% are impossible.', code: 'same' },
          { html: 'No — the domain must be whole numbers of hours only.', why: 'Time can be any value (like ' + t('2.5') + ' hours). The problem is negative time and negative charge.', code: 'whole' },
          { html: 'Yes — a phone can be used for any number of hours.', why: 'Once the charge reaches ' + t('0') + '% the phone stops: ' + t('y') + ' can’t keep going down.', code: 'forever' }],
          '<b>No.</b> “All real numbers” would allow negative hours of use and battery charges below ' + t('0') + '%, which can’t happen.', ['Can ' + t('x') + ' (hours) be negative? Can the charge go below ' + t('0') + '%?'], 'context changes D&R');
      } },
      { id: '12e', sub: 'd, realistic', level: 'MAS', outcome: 'RF2', make: function (r, sh) {
        var D = bld('x', 0, sh.xi), R = bld('y', 0, sh.b);
        return drPart('(d) State a more realistic domain and range for the battery situation.', D, R, {
          dW: [{ is: bld('x', 0, null), code: 'set-arrow', hint: 'The phone dies when the charge reaches ' + t('0') + '% — find when that happens (the ' + t('x') + '-intercept) and stop there.' }, { is: ALLX, code: 'u5l7-dr-all', hint: 'Hours of use start at ' + t('0') + ' and end when the battery is empty.' }, { is: bld('x', 0, sh.b), code: 'set-swap', hint: 'The domain is about <b>hours</b>: from ' + t('0') + ' to the time the battery is empty (the ' + t('x') + '-intercept).' }],
          rW: [{ is: bld('y', null, sh.b), code: 'u5l7-dr-negative', hint: 'The charge can’t go below ' + t('0') + '%.' }, { is: ALLY, code: 'u5l7-dr-all', hint: 'The charge starts at ' + t(sh.b) + '% and falls to ' + t('0') + '%.' }, { is: bld('y', 0, 100), code: 'u5l7-dr-negative', hint: 'This phone starts at ' + t(sh.b) + '% (the ' + t('y') + '-intercept), not 100%.' }] },
          'The phone starts at ' + t(sh.b) + '% when ' + t('x=0') + ' and reaches ' + t('0') + '% at the ' + t('x') + '-intercept, ' + t('x=' + sh.xi) + ' hours; it can’t discharge past empty. The story keeps only the piece of the line between the two intercepts:<br>' + t('D=' + D) + ' (hours), ' + t('R=' + R) + ' (percent).',
          ['Use the intercepts from part (a): when does the battery start, and when is it empty?', 'Both ends are included: use ' + t('\\le') + '.'], 'realistic D&R battery');
      } }] }
  ];

  /* ===================================================================== */
  function q16Shared(r) {
    if (r.chance(0.12)) return { m1: 1, b1: -1, m2: -2, b2: 4 };
    return pickWhere(function () { var m1 = r.pick([1, 2, -1]), m2 = m1 - 3 * r.pick([1, -1]); return { m1: m1, b1: r.int(-3, 3), m2: m2, b2: r.int(-4, 4) }; },
      function (z) { var x = (z.b2 - z.b1) / (z.m1 - z.m2), y = z.m1 * x + z.b1; return Math.abs(z.m2) <= 4 && z.m2 !== 0 && !same(x, Math.round(x)) && Math.abs(x) < 4 && Math.abs(y) < 4 && !same(y * 2, Math.round(y * 2)); });
  }
  var EXTRA = [
    /* ---------------- EP1 four windows ---------------- */
    { num: '1', section: 'Extra Practice A — Choosing a Window Before You Graph',
      stem: function (sh) { return 'Chantelle wants to graph ' + t(eqT(sh.m, sh.b)) + ' and see <b>both</b> intercepts on one screen. Four windows have been proposed:<br>' + sh.W.map(function (w, i) { return '<b>W' + (i + 1) + '</b>: ' + t(winT(w)); }).join('<br>'); },
      shared: function (r) {
        var bk = r.chance(0.12), m = bk ? 2 : r.pick([0.5, 1, 2, 2.5, 4, 5]), sx = bk ? 1 : r.pick([1, -1]), sy = bk ? 1 : r.pick([1, -1]);
        // base case: through the corner (−10, 10) with positive slope → x-int −(10 + 10/m), y-int 10 + 10m. Reflect by sx (x → −x) and sy (y → −y).
        var b0 = 10 + 10 * m, xi0 = -(10 + 10 / m);
        var X = Math.abs(xi0), Y = b0, nice = function (v, st) { return Math.ceil(v / st) * st; };
        var stx = X > 25 ? 10 : 5, sty = Y > 25 ? 10 : 5;
        var good0 = [-(nice(X, stx) + stx), stx, -sty, nice(Y, sty) + sty];
        var noY0 = [-(nice(X, stx) + stx), nice(X, stx) + stx, -sty, nice(Y / 2, sty)]; if (noY0[3] >= Y) noY0[3] = Math.floor((Y - 1) / sty) * sty;
        var noX0 = [0, nice(X, stx), 0, nice(Y, sty) * 2];
        var tr = function (w) { var xs = sx > 0 ? [w[0], w[1]] : [-w[1], -w[0]], ys = sy > 0 ? [w[2], w[3]] : [-w[3], -w[2]]; return xs.concat(ys); };
        var order = bk ? [0, 1, 2] : r.shuffle([0, 1, 2]), others = [good0, noY0, noX0].map(tr);
        var W = [STD].concat(order.map(function (i) { return others[i]; }));
        return { m: cl(m * sx * sy), b: cl(b0 * sy), xi: cl(xi0 * sx), W: W, kind: ['std'].concat(order.map(function (i) { return ['good', 'noY', 'noX'][i]; })), corner: [-10 * sx, 10 * sy] };
      },
      parts: [
        { id: 'e1a', sub: 'a', level: 'BEG', make: function (r, sh) { return interceptVals('(a) Determine both intercepts algebraically first.', sh.m, sh.b, { text: 'EP1 intercepts' }); } },
        { id: 'e1b', sub: 'b', level: 'EMG', make: function (r, sh) {
          var gi = sh.kind.indexOf('good'), xi = sh.xi, b = sh.b;
          var opts = sh.W.map(function (w, i) {
            var k = sh.kind[i], why = k === 'std' ? 'In W1 both ' + t(vt(xi)) + ' and ' + t(vt(b)) + ' are outside ' + t('[-10,\\ 10]') + '.' : k === 'noY' ? 'In W' + (i + 1) + ' the ' + t('y') + '-intercept ' + t(vt(b)) + ' is outside ' + t('y:[' + nT(w[2]) + ',\\ ' + nT(w[3]) + ']') + '.' : k === 'noX' ? 'In W' + (i + 1) + ' the ' + t('x') + '-intercept ' + t(vt(xi)) + ' is outside ' + t('x:[' + nT(w[0]) + ',\\ ' + nT(w[1]) + ']') + '.' : null;
            return { html: '<b>W' + (i + 1) + '</b>' + (k === 'good' ? ': ' + t(vt(xi)) + ' is inside its ' + t('x') + '-interval and ' + t(vt(b)) + ' is inside its ' + t('y') + '-interval' : ''), right: k === 'good', why: why, code: k };
          });
          opts = opts.map(function (o, i) { o.html = '<b>W' + (i + 1) + '</b>'; return o; });
          return mc(r, '(b) Which window is the only one that shows both intercepts?', opts,
            'The intercepts are ' + t(ptT([xi, 0])) + ' and ' + t(ptT([0, b])) + '. In <b>W' + (gi + 1) + '</b>, ' + t(vt(xi)) + ' lies inside ' + t('[' + nT(sh.W[gi][0]) + ',\\ ' + nT(sh.W[gi][1]) + ']') + ' and ' + t(vt(b)) + ' lies inside ' + t('[' + nT(sh.W[gi][2]) + ',\\ ' + nT(sh.W[gi][3]) + ']') + ', so both are on screen.',
            ['Check each window: is ' + t('x=' + vt(xi)) + ' between Xmin and Xmax, and is ' + t('y=' + vt(b)) + ' between Ymin and Ymax?'], 'EP1 which window', true);
        } },
        { id: 'e1c', sub: 'c', level: 'PRG', make: function (r, sh) {
          var rows = [], want = {};
          sh.W.forEach(function (w, i) { var k = sh.kind[i]; if (k === 'good') return; rows.push({ id: 'W' + (i + 1), html: '<b>W' + (i + 1) + '</b> ' + t(winT(w)) }); want['W' + (i + 1)] = k === 'std' ? ['x', 'y'] : k === 'noY' ? ['y'] : ['x']; });
          return grid('(c) For each of the other three windows, tick the intercept(s) that are <b>missing</b> from the screen.', rows, [{ id: 'x', html: t('x') + '-intercept missing' }, { id: 'y', html: t('y') + '-intercept missing' }], want,
            function (rw) { var w = sh.W[Number(rw.slice(1)) - 1]; return { code: 'u5l7-win-cut', hint: 'Check ' + rw + ': is ' + t('x=' + vt(sh.xi)) + ' between ' + t(nT(w[0])) + ' and ' + t(nT(w[1])) + '? Is ' + t('y=' + vt(sh.b)) + ' between ' + t(nT(w[2])) + ' and ' + t(nT(w[3])) + '?' }; },
            rows.map(function (rw) { var w = sh.W[Number(rw.id.slice(1)) - 1], mx = !(sh.xi > w[0] && sh.xi < w[1]), my = !(sh.b > w[2] && sh.b < w[3]); return rw.id + ': ' + (mx && my ? 'both missing (' + t(vt(sh.xi)) + ' is outside ' + t('[' + nT(w[0]) + ',\\ ' + nT(w[1]) + ']') + ' and ' + t(vt(sh.b)) + ' is outside ' + t('[' + nT(w[2]) + ',\\ ' + nT(w[3]) + ']') + ')' : mx ? 'the ' + t('x') + '-intercept is missing: ' + t(vt(sh.xi)) + ' is outside ' + t('[' + nT(w[0]) + ',\\ ' + nT(w[1]) + ']') : 'the ' + t('y') + '-intercept is missing: ' + t(vt(sh.b)) + ' is outside ' + t('[' + nT(w[2]) + ',\\ ' + nT(w[3]) + ']')) + '.'; }).join('<br>'),
            ['Compare ' + t('x=' + vt(sh.xi)) + ' with each Xmin/Xmax, and ' + t('y=' + vt(sh.b)) + ' with each Ymin/Ymax.'], 'EP1 missing intercepts');
        } },
        { id: 'e1d', sub: 'd', level: 'ADV', make: function (r, sh) {
          var c = sh.corner;
          var p = B.fields('(d) W1 is a special case: almost none of the line appears at all. Find the one point of the line that lies on the edge of W1 (a corner of the screen).', [{ label: 'Point:', name: 'point', mode: 'math', keys: 'pairs', placeholder: 'e.g. (2, 5)' }],
            [function (resp) {
              var L = pairList(resp); if (L.empty) return form('empty', 'Type the point as an ordered pair.'); if (L.bad || L.pairs.length !== 1) return form('int-unreadable', 'Type one point, like ' + t('(2,\\ 5)') + '.');
              var q = L.pairs[0]; if (same(q[0], c[0]) && same(q[1], c[1])) return ok();
              if (!same(sh.m * q[0] + sh.b, q[1])) return wrong('u5l7-cross', t(ptT(q)) + ' isn’t on the line: at ' + t('x=' + vt(q[0])) + ' the line has ' + t('y=' + vt(sh.m * q[0] + sh.b)) + '. Try the edges of W1: ' + t('x=\\pm 10') + ', ' + t('y=\\pm 10') + '.');
              return wrong('u5l7-cross', t(ptT(q)) + ' is on the line but not on the edge of W1. Substitute ' + t('x=10') + ' and ' + t('x=-10') + ' and see which gives ' + t('y=\\pm 10') + '.');
            }], [ptKey(c)], t(ptT(c)),
            'Try the edges of W1. At ' + t('x=' + c[0]) + ': ' + t('y=' + vt(sh.m) + '(' + c[0] + ')' + (sh.b < 0 ? '' : '+') + vt(sh.b) + '=' + c[1]) + ', so the line passes exactly through the corner ' + t(ptT(c)) + '. Every other point of the line is outside the window (' + t('|x|>10') + ' or ' + t('|y|>10') + '), so the screen looks blank — the line only touches one corner.',
            ['Substitute ' + t('x=10') + ' and ' + t('x=-10') + '. Which one gives ' + t('y=10') + ' or ' + t('y=-10') + '?'], 'EP1 corner point');
          p.bad = [[ptKey([sh.xi, 0])], [ptKey([c[1], c[0]])]].filter(function (b) { return b[0] !== ptKey(c); });
          return p;
        } }] },

    /* ---------------- EP2 intercepts + a window ---------------- */
    { num: '2', stem: 'For each relation, determine both intercepts <b>without graphing</b>, then state a window that shows both with room to spare on every side.',
      parts: [
        ['a', 'EMG', function (r) { return r.chance(0.15) ? [4, -36, false] : pickWhere(function () { var m = r.int(3, 6), xi = r.int(6, 10); return [m, -m * xi, false]; }, function (z) { return z[1] < -10; }); }],
        ['b', 'EMG', function (r) { return r.chance(0.15) ? [-5, -60, false] : pickWhere(function () { var m = -r.int(3, 6), xi = -r.int(8, 14); return [m, -m * xi, false]; }, function (z) { return z[1] < -10; }); }],
        ['c', 'PRG', function (r) { return r.chance(0.15) ? [0.2, 3, false] : pickWhere(function () { return [r.pick([0.2, 0.25, 0.5, -0.2, -0.25]), r.pick(nz(-5, 5)), false]; }, function (z) { return Math.abs(z[1] / z[0]) > 10 && Math.abs(z[1] / z[0]) <= 25; }); }],
        ['d', 'PRG', function (r) { return r.chance(0.15) ? [-20, 100, true] : pickWhere(function () { var m = -r.pick([10, 20, 25, 15, 30]), xi = r.int(2, 8); return [m, -m * xi, true]; }, function (z) { return z[1] <= 200; }); }]
      ].map(function (d) {
        return { id: 'e2' + d[0], sub: d[0], level: d[1], make: function (r) {
          var z = d[2](r), m = z[0], b = z[1], xi = -b / m;
          var o = { show: [{ p: [xi, 0], name: 'the ' + t('x') + '-intercept' }, { p: [0, b], name: 'the ' + t('y') + '-intercept' }] }, key = niceWin(o), wc = winChk(o);
          var iv = interceptVals('', m, b);
          var fields = iv.input.fields.concat(['Xmin', 'Xmax', 'Ymin', 'Ymax'].map(function (l) { return { label: l + ' =', name: l }; }));
          var p = B.fields('(' + d[0] + ') ' + t(eqT(m, b, { cf: z[2] })), fields, [], iv.key.concat(key.map(String)), iv.answer + '<br>Window, e.g. ' + t(winT(key)) + ' (many work)',
            '<b>Intercepts.</b> ' + iv.solution + '<br><b>Window.</b> Let the edges go a little beyond ' + t(ptT([xi, 0])) + ' and ' + t(ptT([0, b])) + ' (and the origin), e.g. ' + t(winT(key)) + '.',
            ['Intercepts: set ' + t('y=0') + ' for the ' + t('x') + '-intercept, ' + t('x=0') + ' for the ' + t('y') + '-intercept.', 'Then choose Xmin/Xmax just beyond ' + t('0') + ' and ' + t(vt(xi)) + ', and Ymin/Ymax just beyond ' + t('0') + ' and ' + t(vt(b)) + '.'], 'EP2 intercepts+window');
          var ic = iv.check;
          p.check = function (resp) { resp = resp || []; var a = ic(resp.slice(0, 2)); if (a.v !== 'correct') return a; var w = wc(resp.slice(2)); return w.v === 'correct' ? w : { v: w.v, code: w.code, hint: '<b>Window:</b> ' + (w.hint || '') }; };
          p.bad = [iv.key.concat(STD.map(String)), [iv.key[1], iv.key[0]].concat(key.map(String))];
          return p;
        } };
      }) },

    /* ---------------- EP3 predict ---------------- */
    { num: '3', stem: '<b>Predict first.</b> Before any graph is drawn, choose the description that fits the equation: rising or falling (left to right), steeper or shallower than ' + t('y=x') + ', and the ' + t('y') + '-intercept.',
      parts: ['a', 'b', 'c'].map(function (L, i) {
        return { id: 'e3' + L, sub: L, level: i === 0 ? 'BEG' : 'EMG', outcome: 'RF4', make: function (r) {
          var bk = r.chance(0.15), z = bk ? [[-4, 3], [0.5, -2], [-0.5, 4]][i] : [r.pick([-4, -3, -2, 2, 3, 4]), r.pick([0.5, -0.5, 0.25, -0.25]), r.pick([-0.5, 0.5, -3, 3, 0.25, -2])][i];
          var b = bk ? z[1] : r.pick(nz(-6, 6)); var m = bk ? z[0] : z;
          var dir = m > 0 ? 'Rises' : 'Falls', st = Math.abs(m) > 1 ? 'steeper than ' + t('y=x') : 'shallower than ' + t('y=x');
          var D = function (d, s, yi) { return d + ', ' + s + ', ' + t('y') + '-intercept ' + t(vt(yi)); };
          var opts = [{ html: D(dir, st, b), right: true },
            { html: D(m > 0 ? 'Falls' : 'Rises', st, b), why: 'The sign of the number multiplying ' + t('x') + ' decides: ' + (m > 0 ? 'positive → rises' : 'negative → falls') + '.', code: 'dir' },
            { html: D(dir, Math.abs(m) > 1 ? 'shallower than ' + t('y=x') : 'steeper than ' + t('y=x'), b), why: 'Compare the size of the slope with ' + t('1') + ' (the slope of ' + t('y=x') + '): ' + t('|' + vt(m) + '|') + (Math.abs(m) > 1 ? '>' : '<') + t('1') + '.', code: 'steep' },
            { html: D(dir, st, m), why: 'The ' + t('y') + '-intercept is the constant term, not the number multiplying ' + t('x') + '.', code: 'yint' }];
          return mc(r, '(' + L + ') ' + t(eqT(m, b)), opts, 'Slope ' + t(vt(m)) + ': ' + (m > 0 ? 'positive, so the line <b>rises</b>' : 'negative, so the line <b>falls</b>') + '; its size ' + t(vt(Math.abs(m))) + (Math.abs(m) > 1 ? ' is more than ' + t('1') + ', so it is <b>steeper</b>' : ' is less than ' + t('1') + ', so it is <b>shallower</b>') + ' than ' + t('y=x') + '. The ' + t('y') + '-intercept is the constant term, ' + t(vt(b)) + '.',
            ['In ' + t('y=mx+b') + ': the sign of ' + t('m') + ' gives rising/falling, the size of ' + t('m') + ' compared with ' + t('1') + ' gives steeper/shallower, and ' + t('b') + ' is the ' + t('y') + '-intercept.'], 'predict line');
        } };
      }) },

    /* ---------------- EP4 match screens ---------------- */
    { num: '4', stem: function (sh) { return 'Each screen uses the window ' + t(winT([-6, 6, -6, 6])) + '. Match each equation to its screen.<br>' + sh.eqs.map(function (z, i) { return '<b>(' + 'abc'.charAt(i) + ')</b> ' + t(eqT(z[0], z[1])); }).join(' &nbsp; ') + '<br>' + row(sh.order.map(function (k, j) { var z = sh.eqs[k]; return screen({ w: [-6, 6, -6, 6], gx: 1, gy: 1, lx: 2, ly: 2, lines: [{ m: z[0], b: z[1] }], cap: false, title: 'Screen ' + 'ABC'.charAt(j), max: 170 }); })); },
      shared: function (r) {
        if (r.chance(0.12)) return { eqs: [[-4, 3], [0.5, -2], [-0.5, 4]], order: [1, 0, 2] };
        var kinds = r.sample([[1, 1], [1, 0], [0, 1], [0, 0]], 3); // [rising?, steep?]
        var bs = r.sample(nz(-4, 4), 3);
        var eqs = kinds.map(function (k, i) { var mag = k[1] ? r.pick([2, 3, 4]) : r.pick([0.5, 0.25]); return [k[0] ? mag : -mag, bs[i]]; });
        var order = r.shuffle([0, 1, 2]); while (order[0] === 0 && order[1] === 1) order = r.shuffle([0, 1, 2]);
        return { eqs: eqs, order: order };
      },
      parts: [
        { id: 'e4a', sub: 'a', level: 'EMG', outcome: 'RF4', make: function (r, sh) {
          var rows = sh.order.map(function (k, j) { return { id: 'ABC'.charAt(j), html: 'Screen ' + 'ABC'.charAt(j) }; }), want = {};
          sh.order.forEach(function (k, j) { want['ABC'.charAt(j)] = 'abc'.charAt(k); });
          return grid('Match each screen to its equation.', rows, sh.eqs.map(function (z, i) { return { id: 'abc'.charAt(i), html: '(' + 'abc'.charAt(i) + ') ' + t(eqT(z[0], z[1])) }; }), want,
            function (rw) { var z = sh.eqs[sh.order['ABC'.indexOf(rw)]]; return { code: 'u5l7-match', hint: 'Look at Screen ' + rw + ': where does it cross the ' + t('y') + '-axis, and does it rise or fall?' + ' (' + (z[0] > 0 ? 'rises' : 'falls') + ', crosses at ' + t(vt(z[1])) + ').' }; },
            sh.order.map(function (k, j) { var z = sh.eqs[k]; return 'Screen ' + 'ABC'.charAt(j) + ' = (' + 'abc'.charAt(k) + ') ' + t(eqT(z[0], z[1])) + ': it ' + (z[0] > 0 ? 'rises' : 'falls') + (Math.abs(z[0]) > 1 ? ' steeply' : ' gently') + ' and crosses the ' + t('y') + '-axis at ' + t(vt(z[1])) + '.'; }).join('<br>'),
            ['Read the ' + t('y') + '-intercept of each screen first.', 'Then use rising/falling and steep/gentle.'], 'EP4 match');
        } },
        { id: 'e4b', sub: 'b', level: 'EMG', outcome: 'RF4', make: function (r, sh) {
          return mc(r, 'Which single feature of a screen is the quickest to match with an equation ' + t('y=mx+b') + ', because it can be read straight off the ' + t('y') + '-axis?', [
            { html: 'Where the line crosses the ' + t('y') + '-axis — it equals ' + t('b') + '.', right: true },
            { html: 'Where the line crosses the ' + t('x') + '-axis — it equals ' + t('m') + '.', why: 'The ' + t('x') + '-intercept is ' + t('-\\frac{b}{m}') + ', not ' + t('m') + '; it needs a calculation.', code: 'xint' },
            { html: 'How long the line looks on the screen.', why: 'Every line runs across the whole screen; its length tells you nothing.', code: 'length' },
            { html: 'The colour of the line.', why: 'Colour is chosen by the calculator, not by the equation.', code: 'colour' }],
            'The ' + t('y') + '-intercept is ' + t('b') + ' and can be read straight off the screen. Rising/falling (the sign of ' + t('m') + ') and steepness (the size of ' + t('m') + ') settle the rest.', ['Which number in ' + t('y=mx+b') + ' is a point on the ' + t('y') + '-axis?'], 'EP4 feature');
        } }] },

    /* ---------------- EP5 bread ---------------- */
    { num: '5', stem: function (sh) { return 'A loaf of bread comes out of the oven at ' + t(sh.T0 + '^{\\circ}\\text{C}') + ' and cools steadily. Its temperature ' + t('T') + ', in degrees Celsius, after ' + t('m') + ' minutes is ' + t('T=' + sh.T0 + '-' + sh.k + 'm') + ' (until it reaches room temperature).'; },
      shared: function (r) { var c = r.chance(0.15) ? [200, 8] : r.pick([[200, 8], [180, 6], [240, 8], [200, 10], [160, 8], [210, 7], [225, 9], [180, 9], [240, 12], [150, 6], [175, 7], [220, 11], [190, 10], [195, 13], [250, 10], [200, 5], [160, 5], [180, 12], [210, 10], [240, 10]]); return { T0: c[0], k: c[1], mi: c[0] / c[1] }; },
      parts: [
        { id: 'e5a', sub: 'a', level: 'BEG', make: function (r, sh) {
          return valsPart('(a) Determine the ' + t('T') + '-intercept and the ' + t('m') + '-intercept.', [{ label: t('T') + '-intercept:', name: 'T-intercept', before: t('T='), ans: sh.T0, diag: [[sh.mi, 'int-gave-x', 'That is the ' + t('m') + '-intercept. The ' + t('T') + '-intercept is the temperature at ' + t('m=0') + '.'], [-sh.k, 'int-gave-m', t('-' + sh.k) + ' is the rate of cooling. Substitute ' + t('m=0') + '.']] },
            { label: t('m') + '-intercept:', name: 'm-intercept', before: t('m='), ans: sh.mi, diag: [[-sh.mi, 'int-sign', 'Check the sign: ' + t('0=' + sh.T0 + '-' + sh.k + 'm') + ' gives ' + t(sh.k + 'm=' + sh.T0) + '.'], [sh.T0, 'int-gave-y', 'That is the ' + t('T') + '-intercept. For the ' + t('m') + '-intercept set ' + t('T=0') + '.'], [sh.T0 * sh.k, 'ctx-mult', 'Divide by ' + t(sh.k) + ', don’t multiply.']] }],
            t('T') + '-intercept: at ' + t('m=0') + ', ' + t('T=' + sh.T0) + ' (the starting temperature).<br>' + t('m') + '-intercept: ' + t('0=' + sh.T0 + '-' + sh.k + 'm') + ' → ' + t(sh.k + 'm=' + sh.T0) + ' → ' + t('m=' + sh.mi) + ' minutes.', HXY, 'EP5 intercepts');
        } },
        { id: 'e5b', sub: 'b', level: 'PRG', make: function (r, sh) {
          var o = { ctx: true, show: [{ p: [0, sh.T0], name: 'the ' + t('T') + '-intercept' }, { p: [sh.mi, 0], name: 'the ' + t('m') + '-intercept' }], v: 'm', w: 'T' };
          return winPart('(b) State a window suited to this situation (' + t('x') + ' is ' + t('m') + ', ' + t('y') + ' is ' + t('T') + ').', o,
            'Time starts at ' + t('0') + ' and the interesting part ends by ' + t('m=' + sh.mi) + '; ' + t('T') + ' runs from ' + t('0') + ' up past ' + t(sh.T0) + '. For example ' + t(winT(niceWin(o))) + '.', ['Start both at ' + t('0') + ': time and (here) temperature don’t go negative in this story.', 'Xmax a bit past ' + t(sh.mi) + ', Ymax a bit past ' + t(sh.T0) + '.'], 'EP5 window');
        } },
        { id: 'e5c', sub: 'c', level: 'EMG', make: function (r, sh) {
          return mc(r, '(c) Why would the standard window ' + t(winT(STD)) + ' show a completely blank screen here?', [
            { html: 'For ' + t('0\\le m\\le 10') + ' the temperature is between ' + t(sh.T0 - 10 * sh.k) + ' and ' + t(sh.T0) + ' — all far above Ymax ' + t('=10') + '.', right: true },
            { html: 'The relation has no graph until it is entered in a better window.', why: 'The graph exists no matter what window is used; the window only decides what part you see.', code: 'nograph' },
            { html: 'The line is too steep to be drawn.', why: 'A calculator draws any slope. The problem is where the line is, not its steepness.', code: 'steep' },
            { html: 'Negative times are not allowed, so nothing is drawn.', why: 'The calculator doesn’t know the story — it would draw negative times too. The issue is the size of ' + t('T') + '.', code: 'neg' }],
            'In the standard window only ' + t('-10\\le m\\le 10') + ' is shown. There ' + t('T') + ' is at least ' + t(sh.T0 + '-' + sh.k + '(10)=' + (sh.T0 - 10 * sh.k)) + ', far above Ymax ' + t('=10') + ', so no part of the line falls inside the screen.', ['What is ' + t('T') + ' when ' + t('m=10') + '? Is that inside ' + t('[-10,\\ 10]') + '?'], 'EP5 blank screen');
        } }] },

    /* ---------------- EP6 reading a screen carefully ---------------- */
    { num: '6', section: 'Extra Practice B — Reading a Screen Carefully',
      stem: function (sh) { return 'The screen shows ' + t(eqT(sh.m, sh.b)) + ' in the window ' + t(winT([-6, 6, -6, 6])) + ', with gridlines ' + t('1') + ' unit apart.<br>' + screen({ w: [-6, 6, -6, 6], gx: 1, gy: 1, lx: 2, ly: 2, lines: [{ m: sh.m, b: sh.b }], max: 250 }); },
      shared: function (r) {
        if (r.chance(0.12)) return { m: 1.5, b: -2, x0: 3, y1: 5 };
        return pickWhere(function () { var m = r.pick([1.5, 2.5, -1.5, -2.5, 0.5, -0.5]), b = r.pick(nz(-3, 3)); var x0 = r.pick(pm(1, 5).filter(function (x) { return x % 2; })), y1 = r.pick(nz(-5, 5)); return { m: m, b: b, x0: x0, y1: y1 }; },
          function (z) { var xi = -z.b / z.m, y0 = z.m * z.x0 + z.b, x1 = (z.y1 - z.b) / z.m; return Math.abs(xi) < 5.5 && !same(xi * 2, Math.round(xi * 2)) && Math.abs(y0) < 5.5 && !same(y0, Math.round(y0)) && Math.abs(x1) < 5.5 && !same(x1 * 2, Math.round(x1 * 2)) && Math.abs(z.y1 - z.b) >= 2; });
      },
      parts: [
        { id: 'e6a', sub: 'a', level: 'EMG', make: function (r, sh) {
          var xi = -sh.b / sh.m, lo = Math.floor(xi), hi = lo + 1;
          var fields = [{ label: 'It lies between ' + t('x='), name: 'lower gridline' }, { label: 'and ' + t('x='), name: 'upper gridline' }, { label: 'Estimate: ' + t('x\\approx'), name: 'estimate' }];
          var p = B.fields('(a) Estimate the ' + t('x') + '-intercept from the screen. Between which two gridlines does it fall?', fields, [], [String(lo), String(hi), nT(Math.round(xi * 10) / 10)], 'Between ' + t('x=' + lo) + ' and ' + t('x=' + hi) + '; about ' + t('x\\approx ' + nT(Math.round(xi * 10) / 10)) + ' (anything within about ' + t('0.3') + ').',
            'The line crosses the ' + t('x') + '-axis between ' + t(lo) + ' and ' + t(hi) + ', ' + (xi - lo < 0.5 ? 'closer to ' + t(lo) : 'closer to ' + t(hi)) + ' — about ' + t(nT(Math.round(xi * 10) / 10)) + '. (Exactly: ' + t('x=' + vt(xi)) + ', see part (c).)', ['Find where the line meets the horizontal axis and count gridlines from the origin.'], 'EP6 estimate x-int');
          p.check = function (resp) {
            resp = resp || []; var n = resp.map(function (z) { return HW.parse.number(String(z || '').trim()); });
            if (n.some(function (z) { return !z.ok; })) return form('empty', 'Fill in all three boxes with numbers.');
            var a = Math.min(n[0].value, n[1].value), c = Math.max(n[0].value, n[1].value);
            if (!same(a, lo) || !same(c, hi)) return wrong('u5l7-between', 'Look again at where the line meets the ' + t('x') + '-axis: it is between two gridlines that are ' + t('1') + ' apart.');
            if (Math.abs(n[2].value - xi) > 0.3 + 1e-9) return wrong('u5l7-est-off', n[2].value > lo && n[2].value < hi ? 'Your estimate is in the right square — now look at whether the crossing is nearer ' + t(lo) + ' or ' + t(hi) + '.' : 'Your estimate should be between your two gridlines.');
            return ok();
          };
          p.good = [[String(hi), String(lo), nT(cl(xi + 0.2))]]; p.bad = [[String(lo - 1), String(lo), nT(cl(xi))], [String(lo), String(hi), nT(cl(xi + 0.6))]];
          return p;
        } },
        { id: 'e6b', sub: 'b', level: 'EMG', make: function (r, sh) {
          var y0 = sh.m * sh.x0 + sh.b, x1 = (sh.y1 - sh.b) / sh.m;
          var p = B.fields('(b) Estimate the value of ' + t('y') + ' when ' + t('x=' + sh.x0) + ', and the value of ' + t('x') + ' when ' + t('y=' + sh.y1) + '.', [{ label: 'At ' + t('x=' + sh.x0) + ': ' + t('y\\approx'), name: 'y at x=' + sh.x0 }, { label: 'At ' + t('y=' + sh.y1) + ': ' + t('x\\approx'), name: 'x at y=' + sh.y1 }], [],
            [nT(y0), nT(Math.round(x1 * 10) / 10)], t('y=' + nT(y0)) + ' (exactly, halfway between gridlines); ' + t('x\\approx ' + nT(Math.round(x1 * 10) / 10)) + ' (within about ' + t('0.3') + ').',
            'Go up from ' + t('x=' + sh.x0) + ' to the line: it is exactly halfway between ' + t(Math.floor(y0)) + ' and ' + t(Math.ceil(y0)) + ', so ' + t('y=' + nT(y0)) + '. Go across from ' + t('y=' + sh.y1) + ' to the line: it is between ' + t(Math.floor(x1)) + ' and ' + t(Math.ceil(x1)) + ', about ' + t(nT(Math.round(x1 * 10) / 10)) + ' (exactly ' + t(vt(x1)) + ').',
            ['For ' + t('y') + ' at ' + t('x=' + sh.x0) + ': move along the vertical gridline ' + t('x=' + sh.x0) + ' until you hit the line.', 'For ' + t('x') + ' at ' + t('y=' + sh.y1) + ': move along the horizontal gridline ' + t('y=' + sh.y1) + '.'], 'EP6 estimates');
          p.check = function (resp) {
            resp = resp || []; var n = resp.map(function (z) { return HW.parse.number(String(z || '').trim()); });
            if (n.some(function (z) { return !z.ok; })) return form('empty', 'Fill in both boxes with numbers.');
            if (Math.abs(n[0].value - y0) > 0.3 + 1e-9) return wrong('u5l7-est-off', '<b>' + t('y') + ' at ' + t('x=' + sh.x0) + ':</b> follow the gridline ' + t('x=' + sh.x0) + ' up or down to the line and read across.');
            if (Math.abs(n[1].value - x1) > 0.3 + 1e-9) return wrong('u5l7-est-off', '<b>' + t('x') + ' at ' + t('y=' + sh.y1) + ':</b> follow the gridline ' + t('y=' + sh.y1) + ' across to the line and read down.');
            return ok();
          };
          p.bad = [[nT(sh.y1), nT(sh.x0)], [nT(y0 + 1), nT(x1)]];
          return p;
        } },
        { id: 'e6c', sub: 'c', level: 'PRG', make: function (r, sh) {
          var xi = -sh.b / sh.m;
          return valsPart('(c) Determine the exact ' + t('x') + '-intercept algebraically.', [{ label: t('x') + '-intercept:', name: 'x-intercept', before: t('x='), ans: xi, exact: true, diag: xDiag(sh.m, sh.b) }],
            solveTex(sh.m, sh.b) + ' — exactly ' + t(vt(xi)) + ' ≈ ' + t(nT(Math.round(xi * 100) / 100)) + '. An estimate within a few tenths was as close as the screen allows.', ['Set ' + t('y=0') + ' and solve. Leave the answer as a fraction.'], 'EP6 exact x-int');
        } },
        { id: 'e6d', sub: 'd', level: 'EMG', make: function (r, sh) {
          return mc(r, '(d) With gridlines ' + t('1') + ' unit apart, how precise can a reading off this screen honestly be?', [
            { html: 'About ' + t('\\pm 0.5') + ' or better — you can see which square a point is in and roughly where in it, but no finer.', right: true },
            { html: 'Exact to many decimal places, because the calculator draws precisely.', why: 'The drawing is precise, but your eye can only judge positions to a fraction of a square.', code: 'exact' },
            { html: 'Only to the nearest ' + t('5') + ' units.', why: 'With gridlines ' + t('1') + ' unit apart you can do much better than that.', code: 'five' },
            { html: 'To the nearest ' + t('0.01') + ', by looking closely.', why: 'A hundredth of a square is far too small to see on a screen.', code: 'hundredth' }],
            'About half a gridline (' + t('\\pm 0.5') + ', a little better with care): you can tell which square a point is in and whether it is nearer one edge or the middle, but not finer than that.', ['How small a piece of a square can your eye really judge?'], 'EP6 precision');
        } },
        { id: 'e6e', sub: 'e', level: 'PRG', make: function (r, sh) {
          var y0 = sh.m * sh.x0 + sh.b;
          return mc(r, '(e) Of the readings in parts (a) and (b), one can be stated with far more confidence than the others. Which one, and why?', [
            { html: t('y') + ' at ' + t('x=' + sh.x0) + ': the point is on a gridline and lands exactly halfway between two gridlines.', right: true },
            { html: 'The ' + t('x') + '-intercept: it is on an axis.', why: 'Being on the axis helps, but the crossing falls between gridlines, so it must be estimated.', code: 'xint' },
            { html: t('x') + ' at ' + t('y=' + sh.y1) + ': it is on a horizontal gridline.', why: 'The point is on a gridline, but the line crosses it between two vertical gridlines — that ' + t('x') + ' must be estimated.', code: 'x1' },
            { html: 'They are all equally reliable.', why: 'One of them lands at a spot you can read exactly (on a gridline, exactly halfway).', code: 'equal' }],
            'The reading at ' + t('x=' + sh.x0) + ': the point sits on the gridline ' + t('x=' + sh.x0) + ' and ' + t('y=' + nT(y0)) + ' is exactly halfway between two gridlines, so it can be read off confidently. The other two fall between gridlines in both directions and must be estimated.', ['Which reading lands where two things you can see exactly meet?'], 'EP6 confidence');
        } }] },

    /* ---------------- EP7 two lines on one screen ---------------- */
    { num: '7', stem: function (sh) { return 'Two relations, ' + t('P:\\ ' + eqT(sh.m1, sh.b1)) + ' and ' + t('Q:\\ ' + eqT(sh.m2, sh.b2)) + ', are graphed on the same screen.<br>' + screen({ w: [-6, 6, -6, 6], gx: 1, gy: 1, lx: 2, ly: 2, lines: [{ m: sh.m1, b: sh.b1, color: '#1f4fbf', label: 'P' }, { m: sh.m2, b: sh.b2, color: '#b8322a', label: 'Q' }], max: 250 }); },
      shared: function (r) {
        if (r.chance(0.12)) return { m1: 1, b1: 2, m2: 3, b2: -2, h: 2, k: 4 };
        return pickWhere(function () { var h = r.int(-3, 3), k = r.int(-3, 4), m1 = r.pick([1, 0.5, -1, 2]), m2 = r.pick([2, 3, 4]); return { m1: m1, m2: m2, h: h, k: k, b1: k - m1 * h, b2: k - m2 * h }; },
          function (z) { return z.m2 > z.m1 && Math.abs(z.b1) <= 5 && Math.abs(z.b2) <= 5 && z.b1 !== z.b2 && !(z.h === 0); });
      },
      parts: [
        { id: 'e7a', sub: 'a', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var p = B.fields('(a) Read the point where the two lines cross.', [{ label: 'Crossing point:', name: 'point', mode: 'math', keys: 'pairs', placeholder: 'e.g. (1, 3)' }], [function (resp) {
            var L = pairList(resp); if (L.empty) return form('empty', 'Type the point as an ordered pair.'); if (L.bad || L.pairs.length !== 1) return form('int-unreadable', 'Type one point, like ' + t('(1,\\ 3)') + '.');
            var q = L.pairs[0]; if (same(q[0], sh.h) && same(q[1], sh.k)) return ok();
            if (same(q[0], sh.k) && same(q[1], sh.h)) return wrong('int-pt-flip', 'Across first, then up: the point is ' + t('(x,\\ y)') + '.');
            return wrong('u5l7-cross', 'Check: substitute your point into both equations. The crossing point satisfies both.');
          }], [ptKey([sh.h, sh.k])], t(ptT([sh.h, sh.k])),
            'The lines cross at ' + t(ptT([sh.h, sh.k])) + '. Check: ' + t(vt(sh.m1) + '(' + sh.h + ')' + (sh.b1 < 0 ? '' : '+') + vt(sh.b1) + '=' + sh.k) + ' and ' + t(vt(sh.m2) + '(' + sh.h + ')' + (sh.b2 < 0 ? '' : '+') + vt(sh.b2) + '=' + sh.k) + ' ✓.', ['Find where the blue and red lines meet, and read its coordinates.'], 'EP7 crossing');
          p.bad = [[ptKey([sh.k, sh.h])], [ptKey([0, sh.b1])]].filter(function (b) { return b[0] !== ptKey([sh.h, sh.k]); });
          return p;
        } },
        { id: 'e7b', sub: 'b', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          return mc(r, '(b) Which relation grows faster as ' + t('x') + ' increases, and which number in its equation tells you?', [
            { html: t('Q') + ', because its slope ' + t(vt(sh.m2)) + ' is greater', right: true },
            { html: t('P') + ', because its slope ' + t(vt(sh.m1)) + ' is greater', why: 'Compare ' + t(vt(sh.m1)) + ' and ' + t(vt(sh.m2)) + ': the bigger number multiplying ' + t('x') + ' means faster growth.', code: 'P' },
            { html: (sh.b1 > sh.b2 ? t('P') : t('Q')) + ', because its ' + t('y') + '-intercept is greater', why: 'The ' + t('y') + '-intercept is the starting value, not how fast it grows.', code: 'yint' },
            { html: 'They grow at the same rate.', why: 'Lines with different slopes grow at different rates — that is why they cross.', code: 'same' }],
            t('Q') + ' grows faster: its slope ' + t(vt(sh.m2)) + ' is larger than ' + t('P') + '’s slope ' + t(vt(sh.m1)) + ' (the number multiplying ' + t('x') + ').', ['Growth is about the number multiplying ' + t('x') + '.'], 'EP7 faster');
        } },
        { id: 'e7c', sub: 'c', level: 'EMG', outcome: 'RF4', make: function (r, sh) {
          var xa = sh.h + r.int(2, 4), xb = sh.h - r.int(2, 4);
          var P1 = function (x) { return sh.m1 * x + sh.b1; }, Q1 = function (x) { return sh.m2 * x + sh.b2; };
          var rows = [{ id: 'a', html: 'At ' + t('x=' + xa) }, { id: 'b', html: 'At ' + t('x=' + xb) }], want = { a: Q1(xa) > P1(xa) ? 'Q' : 'P', b: Q1(xb) > P1(xb) ? 'Q' : 'P' };
          return grid('(c) Which relation has the greater ' + t('y') + '-value? Substitute to check.', rows, [{ id: 'P', html: t('P') }, { id: 'Q', html: t('Q') }], want,
            function (rw) { var x = rw === 'a' ? xa : xb; return { code: 'u5l7-cross', hint: 'Substitute ' + t('x=' + x) + ' into both: ' + t('P') + ' gives ' + t(vt(P1(x))) + ', ' + t('Q') + ' gives ' + t(vt(Q1(x))) + '.' }; },
            'At ' + t('x=' + xa) + ': ' + t('P') + ' gives ' + t(vt(P1(xa))) + ', ' + t('Q') + ' gives ' + t(vt(Q1(xa))) + ' → <b>' + want.a + '</b> is greater.<br>At ' + t('x=' + xb) + ': ' + t('P') + ' gives ' + t(vt(P1(xb))) + ', ' + t('Q') + ' gives ' + t(vt(Q1(xb))) + ' → <b>' + want.b + '</b> is greater.',
            ['Substitute the ' + t('x') + '-value into each equation and compare.'], 'EP7 compare');
        } },
        { id: 'e7d', sub: 'd', level: 'ADV', outcome: 'RF4', make: function (r, sh) {
          var T = '\\{x\\mid x>' + sh.h + ',\\ x\\in\\mathbb{R}\\}';
          var p = B.math('(d) For which values of ' + t('x') + ' is ' + t('Q') + ' above ' + t('P') + '? Answer with an inequality.', K.set(T, { v: 'x', wrong: [
            { is: '\\{x\\mid x<' + sh.h + ',\\ x\\in\\mathbb{R}\\}', code: 'u5l7-ineq', hint: 'To the <b>left</b> of the crossing, the less steep line ' + t('P') + ' is on top. Which side has ' + t('Q') + ' on top?' },
            { is: '\\{x\\mid x\\ge ' + sh.h + ',\\ x\\in\\mathbb{R}\\}', code: 'set-endpoint', hint: 'At ' + t('x=' + sh.h) + ' the lines are <b>equal</b>, so ' + t('Q') + ' is not above there: use ' + t('>') + '.' },
            { is: '\\{x\\mid x>' + sh.k + ',\\ x\\in\\mathbb{R}\\}', code: 'u5l7-ineq', hint: 'The boundary is the ' + t('x') + '-coordinate of the crossing point, ' + t('x=' + sh.h) + '.' }] }), 'x>' + sh.h,
            'The lines swap places only where they meet, at ' + t('x=' + sh.h) + '. To the right of it the steeper line ' + t('Q') + ' is on top, so ' + t('Q') + ' is above ' + t('P') + ' for ' + t('x>' + sh.h) + '. (At ' + t('x=' + sh.h) + ' they are equal.)',
            ['The crossing point is the boundary. Which side has ' + t('Q') + ' on top?', 'Use ' + t('>') + ' or ' + t('<') + ' (at the crossing they are equal).'], 'EP7 inequality', { keys: 'set', vars: ['x'], placeholder: 'e.g. x > 1' });
          p.good = ['\\{x\\mid x>' + sh.h + ',\\ x\\in\\mathbb{R}\\}', '(' + sh.h + ', \\infty)']; p.bad = ['x<' + sh.h, 'x\\ge ' + sh.h, 'x>' + sh.k].filter(function (b) { return b !== 'x>' + sh.h; });
          return p;
        } }] },

    /* ---------------- EP8 graph two lines by hand ---------------- */
    { num: '8', stem: function (sh) { return 'Graph both ' + t(eqT(sh.m1, sh.b1)) + ' and ' + t(eqT(sh.m2, sh.b2)) + ' by hand.'; },
      shared: function (r) {
        if (r.chance(0.12)) return { m1: 2, b1: -1, m2: -1, b2: 5, h: 2, k: 3 };
        return pickWhere(function () { var h = r.int(-3, 3), k = r.int(-3, 4), m1 = r.pick([1, 2, 3]), m2 = r.pick([-1, -2]); return { m1: m1, m2: m2, h: h, k: k, b1: k - m1 * h, b2: k - m2 * h }; }, function (z) { return Math.abs(z.b1) <= 5 && Math.abs(z.b2) <= 5 && z.b1 !== z.b2; });
      },
      parts: [
        { id: 'e8a', sub: 'graph', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var L1 = lineV([0, sh.b1], [1, sh.b1 + sh.m1]), L2 = lineV([0, sh.b2], [1, sh.b2 + sh.m2]), tg = gv([], [L1, L2]);
          var chk = exactChk(tg, { wrong: [{ is: gv([], [L1]), code: 'graph-missing', hint: 'Now draw the second line, ' + t(eqT(sh.m2, sh.b2)) + ', too.' }, { is: gv([], [L2]), code: 'graph-missing', hint: 'Now draw the first line, ' + t(eqT(sh.m1, sh.b1)) + ', too.' }] });
          var p = B.graph('Graph both lines on the grid. ' + LINEHELP, LINEPAD, chk, tg, 'For ' + t(eqT(sh.m1, sh.b1)) + ': start at ' + t(ptT([0, sh.b1])) + ' and go ' + t(1) + ' right, ' + t(Math.abs(sh.m1)) + ' up. For ' + t(eqT(sh.m2, sh.b2)) + ': start at ' + t(ptT([0, sh.b2])) + ' and go ' + t(1) + ' right, ' + t(Math.abs(sh.m2)) + ' down.',
            ['Plot the ' + t('y') + '-intercept of each line first, then use the slope to find a second point.'], 'EP8 two lines');
          p.bad = [gv([], [L1]), gv([], [lineV([0, sh.b1], [1, sh.b1 - sh.m1]), L2])];
          return p;
        } },
        { id: 'e8b', sub: 'a', level: 'EMG', outcome: 'RF4', make: function (r, sh) {
          var p = B.fields('(a) State the point where the two lines cross.', [{ label: 'Crossing point:', name: 'point', mode: 'math', keys: 'pairs', placeholder: 'e.g. (1, 3)' }], [function (resp) {
            var L = pairList(resp); if (L.empty) return form('empty', 'Type the point as an ordered pair.'); if (L.bad || L.pairs.length !== 1) return form('int-unreadable', 'Type one point, like ' + t('(1,\\ 3)') + '.');
            var q = L.pairs[0]; if (same(q[0], sh.h) && same(q[1], sh.k)) return ok();
            if (same(q[0], sh.k) && same(q[1], sh.h)) return wrong('int-pt-flip', 'Across first, then up: the point is ' + t('(x,\\ y)') + '.');
            var on1 = same(sh.m1 * q[0] + sh.b1, q[1]), on2 = same(sh.m2 * q[0] + sh.b2, q[1]);
            return wrong('u5l7-cross', on1 || on2 ? t(ptT(q)) + ' is on only one of the lines. The crossing point is on <b>both</b>.' : 'Check: the crossing point satisfies both equations.');
          }], [ptKey([sh.h, sh.k])], t(ptT([sh.h, sh.k])),
            'The lines cross at ' + t(ptT([sh.h, sh.k])) + '. Check: ' + t(vt(sh.m1) + '(' + sh.h + ')' + (sh.b1 < 0 ? '' : '+') + vt(sh.b1) + '=' + sh.k) + ' and ' + t(vt(sh.m2) + '(' + sh.h + ')' + (sh.b2 < 0 ? '' : '+') + vt(sh.b2) + '=' + sh.k) + ' ✓.', ['Read it off your graph, then check it in both equations.'], 'EP8 crossing');
          p.bad = [[ptKey([sh.k, sh.h])]].filter(function (b) { return b[0] !== ptKey([sh.h, sh.k]); });
          return p;
        } },
        { id: 'e8c', sub: 'b', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var rows = [{ id: 'a', html: t(eqT(sh.m1, sh.b1)) }, { id: 'b', html: t(eqT(sh.m2, sh.b2)) }];
          return grid('(b) One relation grows as ' + t('x') + ' increases and the other shrinks. Which is which? (The sign of the number multiplying ' + t('x') + ' tells you before you graph.)', rows, [{ id: 'g', html: 'grows' }, { id: 's', html: 'shrinks' }], { a: 'g', b: 's' },
            function () { return { code: 'u5l7-match', hint: 'A positive number multiplying ' + t('x') + ' means the line rises (grows); a negative one means it falls (shrinks).' }; },
            t(eqT(sh.m1, sh.b1)) + ' grows (slope ' + t('+' + vt(sh.m1)) + '); ' + t(eqT(sh.m2, sh.b2)) + ' shrinks (slope ' + t(vt(sh.m2)) + ').', ['Look at the sign of the number in front of ' + t('x') + '.'], 'EP8 grows/shrinks');
        } }] },

    /* ---------------- EP9 same line, two screens ---------------- */
    { num: '9', stem: function (sh) { return '<b>Same line, two screens.</b> Both screens show ' + t(eqT(sh.m, sh.b)) + '. Screen 1 uses ' + t(winT([-6, 6, -6, 6])) + '; Screen 2 uses ' + t(winT([-6, 6, -sh.Y, sh.Y])) + '.<br>' + row([screen({ w: [-6, 6, -6, 6], gx: 1, gy: 1, lx: 2, ly: 2, lines: [{ m: sh.m, b: sh.b }], title: 'Screen 1', cap: false, max: 200 }), screen({ w: [-6, 6, -sh.Y, sh.Y], gx: 1, gy: 5, lx: 2, ly: 10, lines: [{ m: sh.m, b: sh.b }], title: 'Screen 2', cap: false, max: 200 })]); },
      shared: function (r) { if (r.chance(0.12)) return { m: 3, b: 1, Y: 20 }; return { m: r.pick([2, 3, 4, -2, -3, -4]), b: r.pick(nz(-2, 2)), Y: r.pick([20, 20, 30]) }; },
      parts: [
        { id: 'e9a', sub: 'a', level: 'EMG', make: function (r, sh) {
          var x1 = r.pick([1, -1, 2].filter(function (x) { return Math.abs(sh.m * x + sh.b) < 6; })), q = [x1, sh.m * x1 + sh.b];
          var rows = [{ id: 'y', html: 'Both cross the ' + t('y') + '-axis at ' + t(vt(sh.b)) + '.' }, { id: 'p', html: 'Both pass through ' + t(ptT(q)) + '.' }, { id: 's', html: 'Both lines look equally steep.' }, { id: 'w', html: 'Both screens use the same Ymax.' }];
          rows = r.shuffle(rows);
          return grid('(a) Which statements are evidence that the two screens show the same relation?', rows, [{ id: 'yes', html: 'Evidence' }, { id: 'no', html: 'Not true / not evidence' }], { y: 'yes', p: 'yes', s: 'no', w: 'no' },
            function (rw) { return { code: 'u5l7-pick', hint: rw === 's' ? 'Look again: one line looks much steeper than the other — the windows are different.' : rw === 'w' ? 'The Ymax values are different (' + t('6') + ' and ' + t(sh.Y) + ').' : 'Read the screens: this one is true on both, and the same points mean the same line.' }; },
            'Both cross the ' + t('y') + '-axis at ' + t(vt(sh.b)) + ' and both pass through ' + t(ptT(q)) + ' — the same points, so the same line. They <b>don’t</b> look equally steep, and the Ymax values differ: only the window changed.', ['Same points on both screens mean the same line.'], 'EP9 evidence');
        } },
        { id: 'e9b', sub: 'b', level: 'EMG', make: function (r, sh) {
          return mc(r, '(b) Which screen makes the line look steeper, given that the slope is ' + t(vt(sh.m)) + ' on both?', [
            { html: 'Screen 1 — Screen 2 fits ' + t(2 * sh.Y) + ' units of ' + t('y') + ' into the same height, so each ' + t('y') + '-unit is drawn shorter.', right: true },
            { html: 'Screen 2 — it shows more of the line.', why: 'Showing more of the line squeezes it vertically, which makes it look flatter, not steeper.', code: 's2' },
            { html: 'Screen 2 — its slope is bigger.', why: 'The slope is ' + t(vt(sh.m)) + ' on both screens; only the picture changes.', code: 'slope' },
            { html: 'They look exactly the same.', why: 'Compare the two pictures: one line climbs much more steeply across the screen.', code: 'same' }],
            '<b>Screen 1.</b> The slope did not change; Screen 2 fits ' + t(2 * sh.Y) + ' units of ' + t('y') + ' into the same height as Screen 1’s ' + t('12') + ', so the same rise takes up much less of the picture.', ['Compare how many ' + t('y') + '-units fit in the height of each screen.'], 'EP9 steeper');
        } },
        { id: 'e9c', sub: 'c', level: 'PRG', make: function (r, sh) {
          return mc(r, '(c) On Screen 2 one gridline square is ' + t('1') + ' unit wide but ' + t('5') + ' units tall. Why does that squash the picture of the line?', [
            { html: 'A rise of ' + t(Math.abs(sh.m)) + ' covers less than one tall square, while a run of ' + t('1') + ' covers a whole square — so the line tilts closer to horizontal.', right: true },
            { html: 'The calculator changes the slope to fit the window.', why: 'The slope is part of the equation; the calculator never changes it.', code: 'slope' },
            { html: 'Taller squares make the line look steeper.', why: 'Each tall square holds ' + t('5') + ' units of rise, so the same rise looks <b>shorter</b>.', code: 'steeper' },
            { html: 'The line is cut off at the edges.', why: 'Being cut off at the edges doesn’t change how steep the visible part looks.', code: 'cut' }],
            'Over a run of ' + t('1') + ' (one whole square across) the line rises ' + t(Math.abs(sh.m)) + ', which is only ' + t('\\frac{' + Math.abs(sh.m) + '}{5}') + ' of a tall square. Vertically the picture is compressed, so the line looks closer to horizontal.', ['Compare one step across (a whole square) with one step’s rise (part of a tall square).'], 'EP9 squash');
        } },
        { id: 'e9d', sub: 'd', level: 'PRG', make: function (r, sh) {
          return mc(r, '(d) A classmate says “a slope of ' + t(vt(Math.abs(sh.m))) + ' always looks like the same steep climb.” Why can’t that claim be relied on?', [
            { html: 'The angle you see depends on the window: the same slope looked much steeper on Screen 1 than on Screen 2.', right: true },
            { html: 'Because the slope changes when you zoom.', why: 'The slope never changes — only its appearance does.', code: 'slope' },
            { html: 'It can be relied on — slope and angle are the same thing on every screen.', why: 'Look at the two screens: same slope, different-looking angles.', code: 'agree' },
            { html: 'Because negative slopes can’t be drawn.', why: 'Negative slopes are drawn fine; this is about how the window stretches the picture.', code: 'neg' }],
            'The slope was ' + t(vt(sh.m)) + ' on both screens, yet it looked nearly vertical on Screen 1 and much gentler on Screen 2. The angle you see depends on the window; only a window with equal spacing on both axes shows a trustworthy angle.', ['Look back at Screens 1 and 2.'], 'EP9 claim');
        } }] },

    /* ---------------- EP10 tables and constant differences ---------------- */
    { num: '10', stem: 'Build a table of values for each relation, then look at the <b>differences</b> between consecutive ' + t('y') + '-values.', parts: [
      { id: 'e10a', sub: 'a', level: 'BEG', outcome: 'RF4', make: function (r) {
        var bk = r.chance(0.15), m = bk ? 3 : r.pick(pm(2, 5)), b = bk ? -4 : r.pick(nz(-6, 6)), x0 = bk ? -2 : r.int(-3, 0), xs = range(x0, x0 + 5);
        return tableDiff('(a) ' + t(eqT(m, b)) + ' for ' + t('x=' + xs.join(',\\ ')) + '.', m, b, xs, 'EP10a table');
      } },
      { id: 'e10b', sub: 'b', level: 'EMG', outcome: 'RF4', make: function (r) {
        var bk = r.chance(0.15), m = bk ? -2.5 : r.pick([1.5, 2.5, -1.5, -2.5, 0.5, -3.5]), b = bk ? 6 : r.pick(nz(-6, 8)), xs = [0, 2, 4, 6, 8];
        return tableDiff('(b) ' + t(eqT(m, b)) + ' for ' + t('x=' + xs.join(',\\ ')) + '.', m, b, xs, 'EP10b table');
      } },
      { id: 'e10c', sub: 'c', level: 'PRG', outcome: 'RF4', make: function (r) {
        var m = r.pick([3, 4, -2, 1.5, -2.5]), st = r.pick([2, 3, 5]);
        return mc(r, '(c) In each table the differences are constant. For ' + t(eqT(m, r.pick(nz(-5, 5)))) + ' with ' + t('x') + '-values going up by ' + t(st) + ', what is the constant difference, and why?', [
          { html: t(vt(m * st)) + ': the number multiplying ' + t('x') + ' times the step in ' + t('x') + ' (' + t(vt(m) + '\\times ' + st) + ')', right: true },
          { html: t(vt(m)) + ': always the number multiplying ' + t('x') + '', why: 'That is the change for a step of ' + t('1') + '. Here ' + t('x') + ' goes up by ' + t(st) + ' each time.', code: 'm' },
          { html: t(vt(m + st)) + ': the number multiplying ' + t('x') + ' plus the step', why: 'Each step of ' + t('1') + ' adds ' + t(vt(m)) + ', so ' + t(st) + ' steps add ' + t(vt(m)) + ' that many times: multiply.', code: 'add' },
          { html: t(st) + ': the step in ' + t('x') + '', why: 'The step in ' + t('x') + ' is multiplied by the slope to give the change in ' + t('y') + '.', code: 'step' }],
          'Equal steps in ' + t('x') + ' always give equal steps in ' + t('y') + ' for a linear relation: (number multiplying ' + t('x') + ') × (step in ' + t('x') + ') ' + t('=' + vt(m) + '\\times ' + st + '=' + vt(m * st)) + '.', ['Each increase of ' + t('1') + ' in ' + t('x') + ' changes ' + t('y') + ' by the number multiplying ' + t('x') + '.'], 'EP10 constant diff');
      } }] },

    /* ---------------- EP11 true or false ---------------- */
    { num: '11', stem: 'State whether each sentence is <b>true</b> or <b>false</b>.', parts: [
      { id: 'e11a', sub: 'a', level: 'BEG', make: function (r) { var m = r.pick(nz(-5, 5)), b = r.pick(nz(-9, 9)), k = r.pick([20, 25, 50]);
        return B.tf(r, '(a) Changing the window from ' + t(winT(STD)) + ' to ' + t(winT([-k, k, -k, k])) + ' changes where the intercepts of ' + t(eqT(m, b)) + ' actually are.', false, 'The intercepts come from the equation; the window only changes whether you can see them.', '<b>False</b> — the intercepts are fixed by the equation; the window only decides whether they are visible.', [], 'tf intercepts fixed'); } },
      { id: 'e11b', sub: 'b', level: 'BEG', make: function (r) { var m = r.pick(nz(-5, 5));
        return B.tf(r, '(b) The line ' + t(eqT(m, r.pick(nz(-5, 5)))) + ' can look steeper on one screen than on another without its slope changing.', true, 'Think of EP 9: the same slope looked different in two windows.', '<b>True</b> — stretching or squashing the window changes how steep the line looks, not its slope.', [], 'tf looks steeper'); } },
      { id: 'e11c', sub: 'c', level: 'BEG', make: function (r) { var b = r.int(30, 90);
        return B.tf(r, '(c) If nothing appears in the standard window when ' + t('y=x+' + b) + ' is graphed, the relation has no graph at all.', false, 'The graph exists — it is just outside the window. Zoom out or change the window.', '<b>False</b> — the graph is simply outside the window (here it is high above it). A different window will show it.', [], 'tf blank screen'); } },
      { id: 'e11d', sub: 'd', level: 'EMG', make: function (r) { var m = r.pick([3, 6, 7, 9, -3, -6, -7]);
        return B.tf(r, '(d) Tracing along ' + t(eqT(m, r.pick([1, 2, -4, 5, -1, 8]))) + ' usually reports approximate ' + t('x') + '-values rather than exact ones.', true, 'Trace jumps from pixel to pixel, so it usually lands on awkward decimal ' + t('x') + '-values.', '<b>True</b> — trace moves one pixel at a time, so it rarely lands on an exact intercept.', [], 'tf trace approx'); } },
      { id: 'e11e', sub: 'e', level: 'EMG', make: function (r) { var m1 = r.pick([1, 2, 3]), m2 = m1 + r.pick([0.5, 1, 2]);
        return B.tf(r, '(e) Two lines with different slopes, such as ' + t(eqT(m1, r.int(1, 9))) + ' and ' + t(eqT(m2, -r.int(1, 9))) + ', must cross somewhere, even if the crossing is off the screen.', true, 'Lines that aren’t parallel always meet exactly once.', '<b>True</b> — two lines with different slopes are not parallel, so they cross exactly once (maybe outside the window).', [], 'tf must cross'); } },
      { id: 'e11f', sub: 'f', level: 'EMG', make: function (r) { var m = r.pick(nz(-4, 4)), b = r.pick(nz(-8, 8));
        return B.tf(r, '(f) A window that shows both intercepts of ' + t(eqT(m, b)) + ' must show every point of the relation.', false, 'A line goes on forever; no window can show all of it.', '<b>False</b> — a line has no end, so any window shows only part of it.', [], 'tf every point'); } }] },

    /* ---------------- EP12 Rowan ---------------- */
    { num: '12', section: 'Extra Practice C — Error Analysis, Reasoning, and a Stretch',
      stem: function (sh) { return 'Rowan graphs ' + t(eqT(sh.m1, sh.b1)) + ' and ' + t(eqT(sh.m2, sh.b2)) + ' in the standard window. Both lines appear, but they don’t meet anywhere on the screen. Rowan concludes: “these two lines never meet.”<br>' + screen({ w: STD, gx: 2, gy: 2, lx: 5, ly: 5, lines: [{ m: sh.m1, b: sh.b1, color: '#1f4fbf' }, { m: sh.m2, b: sh.b2, color: '#b8322a' }], max: 230 }); },
      shared: function (r) {
        if (r.chance(0.12)) return { m1: 0.5, b1: 9, m2: 1, b2: 2, h: 14, k: 16 };
        return pickWhere(function () { var m1 = r.pick([0.5, 0.5, 1, 2]), m2 = m1 + r.pick([0.5, 1]), h = r.pick([12, 14, 16, 18, 20, -12, -14, -16]); var b2 = r.int(-4, 4), k = m2 * h + b2, b1 = k - m1 * h; return { m1: m1, b1: b1, m2: m2, b2: b2, h: h, k: k }; },
          function (z) { return Number.isInteger(z.b1) && Math.abs(z.b1) <= 9 && Math.abs(z.k) <= 40 && clipLine(z.m1, z.b1, STD) && clipLine(z.m2, z.b2, STD) && z.b1 !== z.b2; });
      },
      parts: [
        { id: 'e12a', sub: 'a', level: 'EMG', make: function (r, sh) {
          return mc(r, '(a) What is wrong with Rowan’s reasoning?', [
            { html: 'The window shows only part of the plane: “not meeting on this screen” is not the same as “never meeting”.', right: true },
            { html: 'Nothing — if the lines met, the calculator would show it.', why: 'The calculator shows only what is inside the window. The meeting point can be outside it.', code: 'agree' },
            { html: 'The lines do meet on the screen; Rowan read it wrong.', why: 'On this screen they really don’t meet. The meeting point is somewhere else.', code: 'misread' },
            { html: 'Lines only meet if they have the same ' + t('y') + '-intercept.', why: 'Lines with different ' + t('y') + '-intercepts can still cross — what matters is whether the slopes differ.', code: 'yint' }],
            'The window only shows part of the plane; the meeting point is simply outside it.', ['What does the window decide?'], 'EP12 reasoning');
        } },
        { id: 'e12b', sub: 'b', level: 'ADV', make: function (r, sh) {
          var p = valsPart('(b) Determine algebraically where the two lines meet (set the two expressions equal).', [{ label: t('x') + '-coordinate:', name: 'x', before: t('x='), ans: sh.h, diag: [[sh.k, 'int-pt-flip', 'That is the ' + t('y') + '-coordinate. Solve for ' + t('x') + ' first.'], [-sh.h, 'int-sign', 'Check the sign when you move the terms across.']] },
            { label: t('y') + '-coordinate:', name: 'y', before: t('y='), ans: sh.k, diag: [[sh.h, 'int-pt-flip', 'That is the ' + t('x') + '-coordinate. Substitute it into either equation to get ' + t('y') + '.']] }],
            t(rhs(sh.m1, sh.b1) + '=' + rhs(sh.m2, sh.b2)) + ' → ' + t(vt(sh.b1 - sh.b2) + '=' + vt(sh.m2 - sh.m1) + 'x') + ' → ' + t('x=' + sh.h) + '; then ' + t('y=' + vt(sh.m2) + '(' + sh.h + ')' + (sh.b2 < 0 ? '' : '+') + vt(sh.b2) + '=' + sh.k) + '. They meet at ' + t(ptT([sh.h, sh.k])) + '.',
            ['Set ' + t(rhs(sh.m1, sh.b1) + '=' + rhs(sh.m2, sh.b2)) + ' and solve for ' + t('x') + '.', 'Then substitute your ' + t('x') + ' into either equation to find ' + t('y') + '.'], 'EP12 meet');
          return p;
        } },
        { id: 'e12c', sub: 'c', level: 'PRG', make: function (r, sh) {
          var o = { show: [{ p: [sh.h, sh.k], name: 'the meeting point' }] };
          return winPart('(c) State a window that would show the meeting point comfortably.', o, 'The meeting point is ' + t(ptT([sh.h, sh.k])) + ', so the window must reach a little past ' + t('x=' + sh.h) + ' and ' + t('y=' + sh.k) + ', e.g. ' + t(winT(niceWin(o))) + '.', ['The meeting point from part (b) must be inside, with some room.'], 'EP12 window');
        } },
        { id: 'e12d', sub: 'd', level: 'PRG', make: function (r, sh) {
          return mc(r, '(d) What feature of the two <b>equations</b> could have told Rowan, before graphing, that these lines were certain to meet somewhere?', [
            { html: 'Their slopes are different (' + t(vt(sh.m1)) + ' and ' + t(vt(sh.m2)) + '), so the lines aren’t parallel.', right: true },
            { html: 'Their ' + t('y') + '-intercepts are different.', why: 'Parallel lines also have different ' + t('y') + '-intercepts — and never meet.', code: 'yint' },
            { html: 'Both slopes are positive.', why: 'Two lines with the same positive slope never meet. It is the <b>difference</b> in slopes that matters.', code: 'pos' },
            { html: 'Both equations start with ' + t('y=') + '.', why: 'That is true of almost every line we write; it says nothing about meeting.', code: 'form' }],
            'The slopes are different (' + t(vt(sh.m1)) + ' and ' + t(vt(sh.m2)) + '), so the lines are not parallel — two non-parallel lines always cross exactly once.', ['When do two lines never meet?'], 'EP12 feature');
        } }] },

    /* ---------------- EP13 Priya and trace ---------------- */
    { num: '13', stem: function (sh) { return 'Priya uses the trace feature on ' + t(eqT(sh.a, -sh.c)) + ' in the standard window and stops as close to the ' + t('x') + '-axis as the cursor will land. The calculator reports ' + t('x=' + sh.xt) + ', ' + t('y=' + sh.yt) + '. Priya decides the calculator is broken.'; },
      shared: function (r) {
        var bk = r.chance(0.12), ac = bk ? [3, 5] : r.pick([[3, 5], [3, 4], [3, 7], [3, 8], [3, 2], [3, 1], [6, 5], [6, 7], [7, 3], [7, 2], [9, 4], [9, 5], [3, 10], [6, 13], [7, 4], [3, 11], [9, 7], [7, 5], [6, 11], [3, 13]]);
        var a = ac[0], c = ac[1], xi = c / a, dx = 20 / 94, kk = Math.round((xi + 10) / dx), xt = -10 + kk * dx; if (same(xt, xi)) { kk++; xt = -10 + kk * dx; }
        var y = a * xt - c;
        return { a: a, c: c, xi: xi, xt: Number(xt.toFixed(7)), yt: Number(y.toFixed(7)) };
      },
      parts: [
        { id: 'e13a', sub: 'a', level: 'PRG', make: function (r, sh) {
          return valsPart('(a) Determine the exact ' + t('x') + '-intercept of ' + t(eqT(sh.a, -sh.c)) + '.', [{ label: t('x') + '-intercept:', name: 'x-intercept', before: t('x='), ans: sh.xi, exact: true, diag: xDiag(sh.a, -sh.c).concat([[sh.xt, 'u5l7-exact', 'That is the trace reading, which is approximate. Solve ' + t('0=' + rhs(sh.a, -sh.c)) + ' exactly.']]) }],
            solveTex(sh.a, -sh.c) + ' ≈ ' + t(nT(Math.round(sh.xi * 1000) / 1000)) + '.', ['Set ' + t('y=0') + ' and solve; leave the answer as a fraction.'], 'EP13 exact');
        } },
        { id: 'e13b', sub: 'b', level: 'EMG', make: function (r, sh) {
          var y = sh.a * sh.xt - sh.c;
          var p = B.approx('(b) Substitute ' + t('x=' + sh.xt) + ' into the equation. Round to 4 decimal places.', y, 4, {}, t(sh.a + '(' + sh.xt + ')-' + sh.c + '\\approx ' + y.toFixed(4)) + '. That matches the calculator’s ' + t('y=' + sh.yt) + ', so the calculator is right for that ' + t('x') + ' — the ' + t('y') + '-value just isn’t zero.', ['Multiply ' + t(sh.xt) + ' by ' + t(sh.a) + ', then subtract ' + t(sh.c) + '.'], 'EP13 substitute');
          p.input.before = t('y\\approx');
          return p;
        } },
        { id: 'e13c', sub: 'c', level: 'PRG', make: function (r, sh) {
          return mc(r, '(c) Why does trace land on such an awkward ' + t('x') + '-value?', [
            { html: 'Trace steps one pixel at a time, and the pixel ' + t('x') + '-values (window width ÷ number of pixels) almost never land on the exact intercept.', right: true },
            { html: 'The calculator is broken, as Priya thinks.', why: 'Part (b) showed the reported ' + t('y') + ' is correct for that ' + t('x') + '. Nothing is broken.', code: 'broken' },
            { html: 'The line has no exact ' + t('x') + '-intercept.', why: 'It does: part (a) found it exactly.', code: 'none' },
            { html: 'Trace always rounds to 7 decimal places on purpose.', why: 'The digits come from where the pixels are, not from deliberate rounding.', code: 'round' }],
            'Trace moves the cursor one pixel at a time; in the standard window the pixels are ' + t('\\frac{20}{94}\\approx 0.213') + ' apart in ' + t('x') + ', so the cursor visits only those ' + t('x') + '-values — and the exact intercept ' + t(vt(sh.xi)) + ' is not one of them.', ['Where can the trace cursor stop?'], 'EP13 why awkward');
        } },
        { id: 'e13d', sub: 'd', level: 'EMG', make: function (r, sh) {
          var opts = [{ value: 'zero', html: 'Use the <b>zero</b> (root) feature' }, { value: 'alg', html: 'Solve ' + t(rhs(sh.a, -sh.c) + '=0') + ' algebraically' }, { value: 'trace', html: 'Trace more slowly' }, { value: 'guess', html: 'Round the trace reading to a whole number' }, { value: 'std', html: 'Go back to the standard window' }];
          return chips('(d) Tap the <b>two</b> better ways to get the exact intercept.', r.shuffle(opts), ['zero', 'alg'], function (extra) { return { code: 'u5l7-pick', hint: extra.length ? 'Tracing more slowly, rounding or changing back to the standard window still can’t land exactly on ' + t(vt(sh.xi)) + '.' : 'You found one — there is a second good way.' }; },
            'Use the <b>zero</b> (root) feature, or <b>solve</b> ' + t(rhs(sh.a, -sh.c) + '=0') + ' algebraically. (Zooming in improves a trace estimate but never makes it exact.)', ['Which methods are designed to find exactly where ' + t('y=0') + '?'], 'EP13 better ways');
        } }] },

    /* ---------------- EP14 Marcus ---------------- */
    { num: '14', stem: function (sh) { return 'Marcus says: “If I can’t see an ' + t('x') + '-intercept in the window ' + t(winT([-sh.W, sh.W, -sh.W, sh.W])) + ', the relation doesn’t have one.”'; },
      shared: function (r) { return { W: r.pick([10, 10, 4, 5, 6, 8, 12, 15, 20, 25, 30, 40, 50]), c: r.pick(nz(-9, 9)) }; },
      parts: [
        { id: 'e14a', sub: 'a', level: 'ADV', make: function (r, sh) {
          var W = sh.W;
          var chk = function (resp) {
            resp = resp || []; var e = String(resp[0] || '').trim(), xs = String(resp[1] || '').trim();
            if (!e) return form('empty', 'Type an equation of a line, e.g. ' + t('y=x-50') + '.');
            if (strip(e).indexOf('=') < 0) return form('eq-no-equals', 'Write a full <b>equation</b> with an ' + t('=') + ' sign, like ' + t('y=x-50') + '.');
            var c = linCoefs(e);
            if (c.err === 'nonlinear') return wrong('eq-not-line', 'That equation isn’t a straight line.');
            if (c.err) return form('eq-unreadable', 'I can’t read that equation. Use only ' + t('x') + ', ' + t('y') + ' and numbers, like ' + t('y=2x-60') + '.');
            if (same(c.A, 0) && same(c.B, 0)) return wrong('eq-not-line', 'That equation has no ' + t('x') + ' or ' + t('y') + ' in it.');
            if (same(c.A, 0)) return wrong('u5l7-ce-horizontal', 'A horizontal line ' + t('y=k') + ' with ' + t('k\\ne 0') + ' really has no ' + t('x') + '-intercept, so it agrees with Marcus. You need a line that <b>does</b> cross the ' + t('x') + '-axis, just off the screen.');
            var xi = -c.C / c.A;
            if (Math.abs(xi) < W + 1e-9) return wrong('u5l7-ce-visible', 'Your line crosses the ' + t('x') + '-axis at ' + t(vt(xi)) + ', which is inside the window, so Marcus could see it. Choose a line whose ' + t('x') + '-intercept is beyond ' + t('\\pm ' + W) + '.');
            if (!xs) return form('empty', 'Now state its ' + t('x') + '-intercept.');
            var q = K.read(xs.replace(/^x\s*=\s*/, '')); if (q.res) return q.res;
            if (!same(q.val, xi)) return wrong('u5l7-ce-int', 'Your line is a good counterexample, but its ' + t('x') + '-intercept is ' + t(vt(xi)) + ' (set ' + t('y=0') + ').');
            return ok();
          };
          var p = B.fields('(a) Give an equation of a line that proves Marcus wrong, and state its ' + t('x') + '-intercept.', [{ label: 'Line:', name: 'equation', mode: 'math', keys: EQK, placeholder: 'e.g. y = x - 50' }, { label: t('x') + '-intercept:', name: 'x-intercept', mode: 'math', keys: EQK, before: t('x=') }], [], ['y=x-' + (10 * W), String(10 * W)],
            'For example ' + t('y=x-' + (10 * W)) + ', whose ' + t('x') + '-intercept is ' + t(10 * W) + ' (many answers work: any line whose ' + t('x') + '-intercept is beyond ' + t('\\pm ' + W) + ').',
            'Any line whose ' + t('x') + '-intercept is beyond ' + t('\\pm ' + W) + ' works, e.g. ' + t('y=x-' + (10 * W)) + ': set ' + t('y=0') + ' → ' + t('x=' + (10 * W)) + '. It is far off the screen but certainly there.',
            ['Build the line from its intercept: ' + t('y=x-a') + ' has ' + t('x') + '-intercept ' + t('a') + '.', 'Pick ' + t('a') + ' bigger than ' + t(W) + ' (or less than ' + t(-W) + ').'], 'EP14 counterexample');
          p.check = chk;
          p.good = [['y=2x+' + (6 * W), String(-3 * W)], ['y=-x+' + (3 * W), '' + (3 * W)]];
          p.bad = [['y=x-1', '1'], ['y=4', 'none'], ['y=x-' + (10 * W), '5']];
          return p;
        } },
        { id: 'e14b', sub: 'b', level: 'PRG', make: function (r, sh) {
          var c = sh.c, m = r.pick([2, 3, -2, 4]), b = r.pick(nz(-9, 9));
          var rows = [{ id: 'h', html: t('y=' + c) }, { id: 'z', html: t('y=0') }, { id: 's', html: t(eqT(m, b)) }];
          return grid('(b) Is it true that <b>every</b> line has exactly one ' + t('x') + '-intercept? For each line, choose how many ' + t('x') + '-intercepts it has.', r.shuffle(rows), [{ id: '0', html: 'none' }, { id: '1', html: 'exactly one' }, { id: 'inf', html: 'infinitely many' }], { h: '0', z: 'inf', s: '1' },
            function (rw) { return { code: 'u5l7-pick', hint: rw === 'h' ? t('y=' + c) + ' is horizontal and never reaches the ' + t('x') + '-axis.' : rw === 'z' ? t('y=0') + ' <b>is</b> the ' + t('x') + '-axis: every one of its points is on it.' : 'A slanted line crosses the ' + t('x') + '-axis exactly once, at ' + t('x=' + vt(-b / m)) + '.' }; },
            t(eqT(m, b)) + ' has exactly one (' + t('x=' + vt(-b / m)) + '); ' + t('y=' + c) + ' is horizontal and never reaches the ' + t('x') + '-axis, so it has none; ' + t('y=0') + ' <b>is</b> the ' + t('x') + '-axis, so it has infinitely many. Rule: every non-horizontal line has exactly one ' + t('x') + '-intercept; a horizontal line has none unless it is ' + t('y=0') + '.',
            ['Picture each line: does it cross the ' + t('x') + '-axis once, never, or lie on it?'], 'EP14 how many');
        } }] },

    /* ---------------- EP15 Dominic ---------------- */
    { num: '15', stem: function (sh) { return 'Dominic graphs ' + t('y=' + sh.k + 'x') + ' in the window ' + t(winT([0, 10, 0, 10])) + '.<br>' + screen({ w: [0, 10, 0, 10], gx: 1, gy: 1, lx: 2, ly: 2, lines: [{ m: sh.k, b: 0 }], max: 210 }); },
      shared: function (r) { return { k: r.chance(0.15) ? 12 : r.pick([4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 20, 24, 25, 30, 40, 50, 60]) }; },
      parts: [
        { id: 'e15a', sub: 'a', level: 'EMG', make: function (r, sh) {
          return valsPart('(a) Determine the exact ' + t('x') + '-value at which the line leaves the top of this window.', [{ label: '', name: 'x', before: t('x='), ans: 10 / sh.k, exact: true, diag: [[sh.k / 10, 'u5l7-exact', 'Upside down: solve ' + t(sh.k + 'x=10') + ' → ' + t('x=\\frac{10}{' + sh.k + '}') + '.'], [10 * sh.k, 'ctx-mult', 'Divide by ' + t(sh.k) + ', don’t multiply.']] }],
            'The top of the window is ' + t('y=10') + ': ' + t(sh.k + 'x=10') + ' → ' + t('x=\\frac{10}{' + sh.k + '}=' + vt(10 / sh.k)) + (isTerm(10 / sh.k) ? '' : '\\approx ' + nT(Math.round(1000 * 10 / sh.k) / 1000)) + '.', ['The line leaves the top where ' + t('y=10') + '.'], 'EP15 leaves top');
        } },
        { id: 'e15b', sub: 'b', level: 'EMG', make: function (r, sh) {
          return mc(r, '(b) What does Dominic see, and why does the line look almost vertical?', [
            { html: 'A short, nearly vertical sliver in the bottom-left corner: the line uses all ' + t('10') + ' units of height in less than one unit of width.', right: true },
            { html: 'Nothing at all: the line is outside the window.', why: 'The line starts at ' + t('(0,\\ 0)') + ', a corner of this window, so part of it shows.', code: 'none' },
            { html: 'A line across the whole screen, because the slope is ' + t(sh.k) + '.', why: 'With slope ' + t(sh.k) + ' it reaches ' + t('y=10') + ' at ' + t('x=' + vt(10 / sh.k)) + ' and leaves the screen.', code: 'whole' },
            { html: 'The calculator rounds a steep slope to a vertical line.', why: 'The slope is still ' + t(sh.k) + '; the window just squeezes the picture.', code: 'round' }],
            'A very short, almost vertical piece from ' + t('(0,\\ 0)') + ' to ' + t(ptT([10 / sh.k, 10])) + ': the line climbs ' + t('10') + ' units in less than one unit across.', ['Use part (a): where does the line leave the screen?'], 'EP15 see');
        } },
        { id: 'e15c', sub: 'c', level: 'PRG', make: function (r, sh) {
          var o = { ctx: true, show: [], full: [0, 10], fn: { m: sh.k, b: 0 }, minX: 10, key: [0, 10, 0, Math.ceil(10 * sh.k / 10) * 10] };
          return winPart('(c) Give a window that shows the relation usefully for ' + t('x') + ' between ' + t('0') + ' and ' + t('10') + '.', o, 'Keep ' + t('x:[0,\\ 10]') + '; at ' + t('x=10') + ' the line reaches ' + t('y=' + (10 * sh.k)) + ', so Ymax must be a bit more than that, e.g. ' + t(winT(o.key)) + '.', ['What is ' + t('y') + ' when ' + t('x=10') + '?'], 'EP15 window');
        } },
        { id: 'e15d', sub: 'd', level: 'PRG', make: function (r, sh) {
          return mc(r, '(d) In your window from part (c), would the line still look almost vertical?', [
            { html: 'No — it would look like a moderate climb. The appearance changed because the vertical scale changed; the slope is still ' + t(sh.k) + '.', right: true },
            { html: 'Yes — a slope of ' + t(sh.k) + ' always looks almost vertical.', why: 'With Ymax near ' + t(10 * sh.k) + ' the same climb fills the screen diagonally. The look depends on the window.', code: 'yes' },
            { html: 'No — the new window changes the slope to about ' + t('1') + '.', why: 'The slope is part of the equation and never changes; only how steep it looks.', code: 'slope' },
            { html: 'No — the line would now look horizontal.', why: 'It runs from corner to corner, a moderate climb, not flat.', code: 'flat' }],
            'No. With about ' + t(10 * sh.k) + ' units of height on the screen the line runs from corner to corner — a moderate climb. Its <b>appearance</b> changed because the vertical scale changed; the slope is still ' + t(sh.k) + '.', ['Does changing the window change the equation?'], 'EP15 looks');
        } }] },

    /* ---------------- EP16 stretch ---------------- */
    { num: '16', stem: function (sh) { return '<b>Stretch.</b> The screen shows ' + t(eqT(sh.m1, sh.b1)) + ' (blue) and ' + t(eqT(sh.m2, sh.b2)) + ' (red) in the window ' + t(winT([-6, 6, -6, 6])) + '.<br>' + screen({ w: [-6, 6, -6, 6], gx: 1, gy: 1, lx: 2, ly: 2, lines: [{ m: sh.m1, b: sh.b1, color: '#1f4fbf' }, { m: sh.m2, b: sh.b2, color: '#b8322a' }], max: 250 }); },
      shared: q16Shared,
      parts: [
        { id: 'e16a', sub: 'a', level: 'EMG', make: function (r, sh) {
          var x = (sh.b2 - sh.b1) / (sh.m1 - sh.m2), y = sh.m1 * x + sh.b1, h = function (v) { return Math.round(v * 2) / 2; };
          var p = B.fields('(a) Estimate the coordinates of the crossing point from the screen, to the nearest half unit.', [{ label: t('x\\approx'), name: 'x' }, { label: t('y\\approx'), name: 'y' }], [], [nT(h(x)), nT(h(y))], t('(' + nT(h(x)) + ',\\ ' + nT(h(y)) + ')') + ' (a neighbouring half unit is also fine)',
            'The crossing sits near ' + t('(' + nT(h(x)) + ',\\ ' + nT(h(y)) + ')') + ' — between gridlines, so it can only be estimated. (Exactly: ' + t(ptT([x, y])) + ', part (b).)', ['Find the crossing, then read across to the ' + t('x') + '-axis and up/down to the ' + t('y') + '-axis.'], 'EP16 estimate');
          p.check = function (resp) {
            resp = resp || []; var n = resp.map(function (z) { return HW.parse.number(String(z || '').trim()); });
            if (n.some(function (z) { return !z.ok; })) return form('empty', 'Fill in both boxes with numbers.');
            if (n.some(function (z) { return !same(z.value * 2, Math.round(z.value * 2)); })) return form('u5l7-half', 'Give each coordinate to the nearest <b>half unit</b> (like ' + t('1.5') + ' or ' + t('2') + ').');
            if (Math.abs(n[0].value - x) > 0.51 || Math.abs(n[1].value - y) > 0.51) return wrong('u5l7-est-off', 'Look again where the two lines cross. Count gridlines from the origin.');
            return ok();
          };
          p.bad = [[nT(h(y)), nT(h(x) + 2)]];
          return p;
        } },
        { id: 'e16b', sub: 'b', level: 'MAS', make: function (r, sh) {
          var x = (sh.b2 - sh.b1) / (sh.m1 - sh.m2), y = sh.m1 * x + sh.b1;
          return valsPart('(b) Determine the crossing point algebraically by setting the two expressions equal. Give exact fractions.', [{ label: t('x') + '-coordinate:', name: 'x', before: t('x='), ans: x, exact: true, diag: [[-x, 'int-sign', 'Check the signs when you collect the ' + t('x') + '-terms on one side.'], [(sh.b2 - sh.b1) / (sh.m1 + sh.m2), 'u5l7-cross', 'When you move ' + t(term(sh.m2, 'x', true)) + ' to the other side its sign changes: subtract it.']] },
            { label: t('y') + '-coordinate:', name: 'y', before: t('y='), ans: y, exact: true, diag: [[x, 'int-pt-flip', 'That is the ' + t('x') + '-coordinate. Substitute it into either equation for ' + t('y') + '.']] }],
            t(rhs(sh.m1, sh.b1) + '=' + rhs(sh.m2, sh.b2)) + ' → ' + t(vt(sh.m1 - sh.m2) + 'x=' + vt(sh.b2 - sh.b1)) + ' → ' + t('x=' + vt(x)) + '; ' + t('y=' + vt(sh.m1) + '\\left(' + vt(x) + '\\right)' + (sh.b1 < 0 ? '' : '+') + vt(sh.b1) + '=' + vt(y)) + '. The point is ' + t(ptT([x, y])) + '.',
            ['Set ' + t(rhs(sh.m1, sh.b1) + '=' + rhs(sh.m2, sh.b2)) + ', collect the ' + t('x') + '-terms on one side and the numbers on the other.', 'Leave ' + t('x') + ' as a fraction, then substitute it into either equation.'], 'EP16 exact crossing');
        } },
        { id: 'e16c', sub: 'c', level: 'PRG', make: function (r, sh) {
          var x = (sh.b2 - sh.b1) / (sh.m1 - sh.m2), y = sh.m1 * x + sh.b1;
          return valsPart('(c) Verify: substitute ' + t('x=' + vt(x)) + ' into <b>both</b> equations.', [{ label: t(eqT(sh.m1, sh.b1)) + ' gives', name: 'first', before: t('y='), ans: y, diag: [] }, { label: t(eqT(sh.m2, sh.b2)) + ' gives', name: 'second', before: t('y='), ans: y, diag: [] }],
            t(vt(sh.m1) + '\\left(' + vt(x) + '\\right)' + (sh.b1 < 0 ? '' : '+') + vt(sh.b1) + '=' + vt(y)) + ' ✓ and ' + t(vt(sh.m2) + '\\left(' + vt(x) + '\\right)' + (sh.b2 < 0 ? '' : '+') + vt(sh.b2) + '=' + vt(y)) + ' ✓ — the same ' + t('y') + ', so the point is on both lines.', ['Multiply the fraction by the slope, then add the constant (write it with the same denominator).'], 'EP16 verify');
        } },
        { id: 'e16d', sub: 'd', level: 'PRG', make: function (r, sh) {
          var x = (sh.b2 - sh.b1) / (sh.m1 - sh.m2);
          return mc(r, '(d) Why could no amount of careful reading of this screen give the exact answer from part (b)?', [
            { html: 'The crossing falls between gridlines and ' + t(vt(x)) + ' is a repeating decimal: a picture gives an estimate, algebra gives the exact value. Zooming in (or an intersect feature) improves the estimate.', right: true },
            { html: 'The screen is drawn wrongly.', why: 'The screen is correct; the issue is that a picture can only be read approximately.', code: 'wrong' },
            { html: 'The lines don’t really cross on this screen.', why: 'They do cross on the screen — just not at a gridline.', code: 'nocross' },
            { html: 'It could, if you used a ruler.', why: 'Even with a ruler you cannot read ' + t(vt(x)) + ' (a repeating decimal) exactly from a picture.', code: 'ruler' }],
            'The crossing lands between gridlines and ' + t(vt(x)) + ' is a non-terminating decimal, so no reading off a ' + t('1') + '-unit grid can land on it exactly. Reading a graph gives an approximation; algebra gives the exact value. Zooming in on the crossing (or using an intersect feature) sharpens the estimate.', ['Can a picture show a repeating decimal exactly?'], 'EP16 why');
        } }] }
  ];

  /* EP10: a table of y-values and the constant difference */
  function tableDiff(prompt, m, b, xs, text) {
    var ys = xs.map(function (x) { return cl(m * x + b); }), d = cl(ys[1] - ys[0]);
    var fields = xs.map(function (x) { return { label: t('x=' + x), name: 'y at x=' + x, before: t('y=') }; }).concat([{ label: 'Each difference:', name: 'difference' }]);
    var checks = xs.map(function (x, i) { return K.number(ys[i], function (v) { if (same(v, cl(m * x - b))) return { code: 'u5l7-tab-y', hint: 'Check the constant term: ' + t('y=' + vt(m) + '(' + x + ')' + (b < 0 ? '' : '+') + vt(b)) + '.' }; if (same(v, -ys[i])) return { code: 'int-sign', hint: 'Check the sign: ' + t(vt(m) + '\\times ' + sgp(x)) + '.' }; return { code: 'u5l7-tab-y', hint: 'Substitute ' + t('x=' + x) + ' again carefully.' }; }); })
      .concat([K.number(d, function (v) { if (same(v, -d)) return { code: 'u5l7-diff', hint: 'Subtract in order: each ' + t('y') + '-value minus the one before it. Your values ' + (d < 0 ? 'go down' : 'go up') + '.' }; if (same(v, m) && !same(m, d)) return { code: 'u5l7-diff', hint: 'Here ' + t('x') + ' goes up by ' + t(xs[1] - xs[0]) + ' each time, so subtract consecutive ' + t('y') + '-values from your table.' }; return { code: 'u5l7-diff', hint: 'Subtract two neighbouring ' + t('y') + '-values from your table.' }; })]);
    var p = B.fields(prompt + ' Fill in the ' + t('y') + '-values, then give the difference between consecutive ' + t('y') + '-values.', fields, checks, ys.map(String).concat([String(d)]),
      HW.valueTable([[t('x')].concat(xs.map(function (x) { return t(x); })), [t('y')].concat(ys.map(function (y) { return t(nT(y)); }))]) + 'Each difference: ' + t((d > 0 ? '+' : '') + nT(d)),
      xs.map(function (x, i) { return t(vt(m) + '(' + x + ')' + (b < 0 ? '' : '+') + vt(b) + '=' + nT(ys[i])); }).join(', ') + '.<br>Differences: ' + ys.slice(1).map(function (y, i) { return t(nT(y) + '-' + sgp(ys[i]) + '=' + nT(d)); }).join(', ') + ' — all ' + t(nT(d)) + '.',
      ['Substitute each ' + t('x') + ' into the equation.', 'A difference is a ' + t('y') + '-value minus the one before it.'], text);
    p.bad = [ys.map(String).concat([String(-d)]), ys.map(function (y, i) { return String(i ? y : y + 1); }).concat([String(d)])];
    return p;
  }
  HW.addCodes({ 'u5l7-win-edge': 'Window: point right on the edge', 'u5l7-disc-read': 'Context set unreadable', 'u5l7-disc-short': 'Too few values listed', 'u5l7-half': 'Estimate not to the nearest half', 'eq-no-equals': 'Not written as an equation', 'eq-unreadable': 'Equation unreadable', 'eq-not-line': 'Not a straight line' });

  HW.defineLesson({
    id: 'u5l7', unit: 5, num: '7', title: 'Using Technology to Graph and Explore Relations', outcome: 'RF5',
    blurb: 'Graphing calculator and Desmos screens: choosing a viewing window, finding intercepts with technology or algebra, reading domain and range off a screen, and letting the context decide what makes sense.',
    questions: QUESTIONS, extra: EXTRA
  });
})(window);
