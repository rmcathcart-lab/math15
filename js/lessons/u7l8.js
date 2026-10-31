/* Math 15 · Unit 7 · Lesson 8 — Graphing Horizontal Lines, Vertical Lines, and Any Form (RF6; intercepts RF5)
 * Assignment 8 (u7_L08.tex, Questions 1–16) and the Lesson 8 Extra Practice (u7_EP08.tex, Questions 1–18).
 * Every part is a generator: same structure, idea and difficulty as the booklet question, new numbers from the seed
 * (the booklet's own numbers are among the possible values). Model: Math 10C u7l5.js (graph pad, strategy questions)
 * and u7l3.js (none-intercepts of horizontal/vertical lines).
 * Graphing a line is a graph-pad drawing (a line with arrows through any two grid points on it); "state the slope" uses
 * the slope keypad with its "undefined" key; "horizontal, vertical or neither" and "which method" are tables of
 * choices; "explain" parts are multiple choice whose options are reasons. Equations accept any equivalent form
 * (x = 3, x − 3 = 0, …); general form, where asked, means integers with A positive (a common factor is accepted).
 * Intercepts are accepted as a value or as a point; "none" where a line has no such intercept.
 * Changed from the booklet: Q15 (NR) uses a point with a positive x-coordinate, since a numerical response can't be
 * negative (booklet: (−4, 9), answer −4).
 * Outcomes: RF6 (graphing any form, horizontal/vertical lines), RF5 (intercept values).
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 18(c). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, Ln = HW.lines, DR = HW.draw, P = HW.poly, frT = Ln.frT, ex = HW.ex;

  /* a keypad for a value that may also be typed as a point (lesson-local; L7 defines the same) */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.u7val) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.u7val = [[dk(7), dk(8), dk(9), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: '−', tex: '-', plain: '-' }, { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Ordered pair: type x, y inside' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (out of a box)' }],
      [dk(0), { label: '.', tex: '.', plain: '.' }, { label: ',', tex: ',', plain: ', ' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    W.KEYHELP.u7val = ['Type a number or a fraction (<b><sup>a</sup>⁄<sub>b</sub></b>, then <b>▶</b> to step out). An intercept may also be typed as a point: <b>( )</b>, then e.g. 3 , 0.', 'Type a number or fraction such as <code>-3/4</code>; an intercept may also be a point such as <code>(3, 0)</code>.'];
  }

  HW.addCodes({
    'l5-points-only': 'Plotted points but no line', 'l5-point-off': 'Plotted a point not on the line', 'l5-slope': 'Right starting point, wrong slope', 'l5-shift': 'Right slope, wrong position',
    'l5-line-missing': 'A line missing', 'l5-line-wrong': 'One of the lines wrong', 'l5-gr-sign': 'Graphed with the slope sign wrong', 'l5-gr-flip': 'Graphed run over rise', 'l5-gr-bx': 'Plotted b on the x-axis',
    'l5-gr-bsign': 'Wrong sign on the y-intercept', 'l5-gr-axes': 'Intercepts on the wrong axes', 'l5-gr-coef': 'Used coefficients as intercepts', 'l5-gr-isign': 'Intercept signs wrong', 'l5-gr-hv': 'Horizontal / vertical mixed up',
    'l5-pair-axes': 'Intercepts on the wrong axes', 'l5-c-sign': 'Sign slip moving the constant', 'l5-nodiv': 'Didn’t divide every term', 'l5-half-area': 'Forgot the ½ in the area',
    'gf-gave-x': 'Gave the x-intercept for the y-intercept', 'gf-gave-y': 'Gave the y-intercept for the x-intercept', 'gf-x-undivided': 'Didn’t divide the constant by A', 'gf-b-undivided': 'Didn’t divide the constant by B',
    'gf-none': 'Missed a “none”', 'gf-said-none': 'Said “none” when there is a value',
    'u7l8-k-sign': 'Horizontal/vertical line at the opposite number', 'u7l8-other-coord': 'Used the other coordinate of the point', 'u7l8-pt-off': 'Point not on the line',
    'u7l8-pt-format': 'Gave a number where a point was asked', 'u7l8-int-pt': 'Intercept point not on the axis', 'u7l8-perim-half': 'Perimeter: added only two sides', 'u7l8-area-perim': 'Area and perimeter swapped',
    'u7l8-side': 'Side length from one coordinate instead of the difference'
  });
  HW.addPartial({ 'u7l8-k-sign': 's', 'u7l8-other-coord': 'n', 'u7l8-pt-off': 'n', 'u7l8-int-pt': 'b', 'u7l8-perim-half': 's', 'u7l8-area-perim': 'b', 'u7l8-side': 'b' });

  /* ---------- numbers ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function fr(p, q) { if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g + 0, q / g]; }
  function fT(f) { return frT(f[0], f[1]); }
  function nT(x) { return Number.isInteger(x) ? String(x + 0) : fT(Ln.toFr(x)); }
  function pt(p) { return '(' + nT(p[0]) + ',\\ ' + nT(p[1]) + ')'; }
  function pK(p) { return '(' + nT(p[0]) + ', ' + nT(p[1]) + ')'; }
  function ptt(p) { return t(pt(p)); }
  function sg(n) { return n < 0 ? '-' + (-n) : '+' + n; }
  function mf(m) { return Array.isArray(m) ? fr(m[0], m[1]) : [m, 1]; }
  function stepT(m) { m = mf(m); return (m[0] < 0 ? 'down ' + (-m[0]) : 'up ' + m[0]) + ', right ' + m[1]; }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function pm(a, b) { return range(a, b).concat(range(a, b).map(function (x) { return -x; })); }
  function pickWhere(gen0, okf) { for (var i = 0; i < 3000; i++) { var o = gen0(); if (okf(o)) return o; } throw new Error('u7l8: no valid numbers'); }
  function mc(r, prompt, opts, sol, hints, text, keep) {
    var seen = {}, o2 = opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; });
    return KP.mc(r, prompt, o2, sol, hints, text, keep);
  }

  /* ---------- lines: A x + B y + C = 0, integers, no common factor, A > 0 (or A = 0, B > 0) ---------- */
  function line(A, B, C) { var g = gcd(gcd(A, B), C) || 1; A /= g; B /= g; C /= g; if (A < 0 || (A === 0 && B < 0)) { A = -A; B = -B; C = -C; } return { A: A + 0, B: B + 0, C: C + 0 }; }
  function thru(p, q) { var A = q[1] - p[1], B = p[0] - q[0]; return line(A, B, -(A * p[0] + B * p[1])); }
  function ms(m, p0) { m = mf(m); return line(m[0], -m[1], m[1] * p0[1] - m[0] * p0[0]); }
  function mb(m, b) { return ms(m, [0, b]); }
  function hz(k) { return line(0, 1, -k); }
  function vt(k) { return line(1, 0, -k); }
  function onL(Lo, p) { return Math.abs(Lo.A * p[0] + Lo.B * p[1] + Lo.C) < 1e-9; }
  function lat(Lo, xr, yr) {
    var out = [];
    if (Lo.B === 0) { var x0 = -Lo.C / Lo.A; if (Number.isInteger(x0) && x0 >= xr[0] && x0 <= xr[1]) for (var y = Math.ceil(yr[0]); y <= yr[1]; y++) out.push([x0 + 0, y]); return out; }
    for (var x = Math.ceil(xr[0]); x <= xr[1]; x++) { var yy = -(Lo.A * x + Lo.C) / Lo.B; if (Number.isInteger(yy) && yy >= yr[0] && yy <= yr[1]) out.push([x, yy + 0]); }
    return out;
  }
  function far(Lo, win) { var L2 = lat(Lo, win[0], win[1]); if (L2.length < 2) L2 = lat(Lo, [-60, 60], [-600, 600]); return [L2[0], L2[L2.length - 1]]; }
  function arrow(p, q) { return { pts: [], pieces: [{ v: [p, q], s: 'arrow', e: 'arrow' }], join: 'none' }; }
  function lineV(Lo, win) { var e = far(Lo, win); return arrow(e[0], e[1]); }
  function linesV(list, win) { var v = { pts: [], pieces: [], join: 'none' }; list.forEach(function (Lo) { v.pieces = v.pieces.concat(lineV(Lo, win).pieces); }); return v; }
  function segV(Lo, win) { var e = far(Lo, win); return { pts: [], pieces: [{ v: [e[0], e[1]], s: 'closed', e: 'closed' }], join: 'none' }; }
  function si(Lo) { return Ln.tex(Lo, 'slope-intercept'); }
  function gen(Lo) { return Ln.tex(Lo, 'general'); }
  function keyOf(Lo, win) { return Object.keys(DR.geom(lineV(Lo, win)).lines)[0]; }
  function slopeOf(Lo) { return Lo.B === 0 ? null : fr(-Lo.A, Lo.B); }

  /* ---------- figures ---------- */
  var BLUE = '#2b55a0', RED = '#c4532a';
  function labFig(items, win, o) {   // lines (arrows to the edges) with italic labels, optional shaded rectangle [x1, y1, x2, y2]
    o = o || {};
    var segs = items.map(function (it) { var e = far(it.L, win), pc = DR.extendPiece({ v: [e[0], e[1]], s: 'arrow', e: 'arrow' }, win[0], win[1]); return { pts: pc.v, start: 'arrow', end: 'arrow', color: it.color || BLUE }; });
    var svg = HW.graph({ x: win[0], y: win[1], labels: 2, segs: segs, max: o.max || 260 }), G = HW.graph.last;
    var add = items.map(function (it) { return it.label ? '<text x="' + (G.X(it.at[0]) + 5) + '" y="' + (G.Y(it.at[1]) - 6) + '" font-size="17" font-style="italic" fill="' + (it.color || BLUE) + '">' + it.label + '</text>' : ''; }).join('');
    if (o.fill) { var f = o.fill; svg = svg.replace(/(<rect x="0" y="0"[^>]*\/>)/, '$1<rect x="' + G.X(f[0]) + '" y="' + G.Y(f[3]) + '" width="' + (G.X(f[2]) - G.X(f[0])) + '" height="' + (G.Y(f[1]) - G.Y(f[3])) + '" fill="' + BLUE + '" fill-opacity="0.13"/>'); }
    return '<div style="text-align:center">' + svg.replace('</svg>', add + '</svg>') + '</div>';
  }

  /* ---------- graph-pad parts (from 10C u7l5) ---------- */
  function pad(win, o) { return Object.assign({ x: win[0], y: win[1], grid: 1, labels: 2, mode: 'lines', defaultEnd: 'arrow', max: 360 }, o || {}); }
  function lineCheck(key, Ls, opt) {
    opt = opt || {};
    var base = K.graphExact(key, { wrong: opt.wrong || [] });
    return function (resp) {
      var res = base(resp); if (res.v !== 'wrong' || res.code !== 'graph') return res;
      var v = DR.norm(resp);
      if (!v.pieces.length && v.pts.length) {
        var off = v.pts.filter(function (p) { return !Ls.some(function (Lo) { return onL(Lo, p); }); })[0];
        if (off) return wrong('l5-point-off', ptt(off) + ' is not on the line. Substitute it into the equation to check, then fix it.');
        return wrong('l5-points-only', v.pts.length > 1 ? 'Your points are on the line — now draw the line through them (Line tool), with arrows on both ends.' : 'That point is on the line — but one point doesn’t fix a line. Find a second point, then draw the line through them.');
      }
      if (Ls.length === 1) {
        var g = DR.geom(resp), ks = Object.keys(g.lines);
        if (ks.length === 1) {
          var S = g.lines[ks[0]], T = Ls[0], sm = S.B === 0 ? null : -S.A / S.B, tm = T.B === 0 ? null : -T.A / T.B;
          var sameSlope = sm === tm || (sm != null && tm != null && Math.abs(sm - tm) < 1e-9);
          if (T.B === 0 && S.A === 0) return wrong('l5-gr-hv', 'You drew a horizontal line. There is no ' + t('y') + ' in this equation — ' + t('x') + ' is fixed — so the line is <b>vertical</b>.');
          if (T.A === 0 && S.B === 0) return wrong('l5-gr-hv', 'You drew a vertical line. There is no ' + t('x') + ' in this equation — ' + t('y') + ' is fixed — so the line is <b>horizontal</b>.');
          var an = (opt.anchor || []).filter(function (a) { return Math.abs(S.A * a.p[0] + S.B * a.p[1] - S.C) < 1e-6; })[0];
          if (an && !sameSlope) return wrong('l5-slope', an.hint);
          if (sameSlope) return wrong('l5-shift', (T.A === 0 || T.B === 0 ? 'Right direction — but in the wrong place. ' : 'Right slope — your line is parallel to the right one, but in the wrong place. ') + (opt.placeHint || 'Check your starting point.'));
        }
      }
      return res;
    };
  }
  function splitBends(value) {
    var v = DR.norm(value), out = [];
    v.pieces.forEach(function (pc) {
      if (pc.v.length < 3 || pc.s !== 'arrow' || pc.e !== 'arrow') { out.push(pc); return; }
      var runs = [[pc.v[0], pc.v[1]]];
      for (var i = 2; i < pc.v.length; i++) {
        var run = runs[runs.length - 1], a = run[run.length - 2], b = run[run.length - 1], c = pc.v[i];
        if (Math.abs((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])) < 1e-9) run.push(c); else runs.push([b, c]);
      }
      runs.forEach(function (rv) { out.push({ v: rv, s: 'arrow', e: 'arrow' }); });
    });
    return { pts: v.pts, pieces: out, join: v.join };
  }
  function multiCheck(key, Ls, names, win) {
    var base = K.graphExact(key), keys = Ls.map(function (Lo) { return keyOf(Lo, win); });
    return function (resp) {
      resp = splitBends(resp);
      var res = base(resp); if (res.v !== 'wrong' || res.code !== 'graph') return res;
      var have = Object.keys(DR.geom(resp).lines), miss = [], extra = have.filter(function (k) { return keys.indexOf(k) < 0; });
      keys.forEach(function (k, i) { if (have.indexOf(k) < 0) miss.push(names[i]); });
      if (miss.length && !extra.length) return wrong('l5-line-missing', 'Correct so far — still to draw: ' + miss.join(' and ') + '.');
      if (miss.length && extra.length && miss.length < Ls.length) return wrong('l5-line-wrong', 'Not all of your lines are right yet: check ' + miss.join(' and ') + '.');
      return res;
    };
  }
  function gpart(prompt, Ls, win, o, sol, hints, text) {
    o = o || {}; Ls = Array.isArray(Ls) ? Ls : [Ls];
    var key = linesV(Ls, win);
    var Wr = (o.wrong || []).map(function (w) { return { is: w.v || lineV(w.L, win), code: w.code, hint: w.hint }; }).filter(function (w) { return !DR.same(w.is, key); });
    var check = o.names ? multiCheck(key, Ls, o.names, win) : lineCheck(key, Ls, { wrong: Wr, anchor: o.anchor, placeHint: o.placeHint });
    if (o.names && Wr.length) { var mc0 = check, wc = K.graphExact(key, { wrong: Wr }); check = function (resp) { var r1 = wc(splitBends(resp)); if (r1.v === 'wrong' && r1.code !== 'graph') return r1; return mc0(resp); }; }
    var p = K.P.graph(prompt, pad(win, o.pad), check, key, sol, hints, text);
    p.bad = Wr.map(function (w) { return w.is; }).concat(Ls.length === 1 ? [segV(Ls[0], win)] : []);
    return p;
  }
  var W8 = [[-8, 8], [-8, 8]];
  /* y = k or x = k */
  function hvGraph(prompt, axis, k, win, text) {
    var Lo = axis === 'y' ? hz(k) : vt(k), Y = axis, X = axis === 'y' ? 'x' : 'y', P0 = axis === 'y' ? [0, k] : [k, 0], wr = [];
    if (k !== 0) wr.push({ L: axis === 'y' ? hz(-k) : vt(-k), code: 'u7l8-k-sign', hint: 'Check the sign: ' + t(Y + '=' + k) + ' crosses the ' + t(Y) + '-axis at ' + ptt(P0) + '.' });
    wr.push({ L: axis === 'y' ? vt(k) : hz(k), code: 'l5-gr-hv', hint: 'You drew ' + t(X + '=' + k) + '. In ' + t(Y + '=' + k) + ' it is ' + t(Y) + ' that is fixed: every point has ' + t(Y) + '-coordinate ' + t(k) + ', so the line is <b>' + (axis === 'y' ? 'horizontal' : 'vertical') + '</b>.' });
    return gpart(prompt, Lo, win, { wrong: wr, placeHint: 'Every point on ' + t(Y + '=' + k) + ' has ' + t(Y) + '-coordinate ' + t(k) + ' — it goes through ' + ptt(P0) + '.' },
      t(Y + '=' + k) + ' has no ' + t(X) + ' in it, so ' + t(X) + ' can be anything while ' + t(Y) + ' stays ' + t(k) + '. Points such as ' + ptt(axis === 'y' ? [-3, k] : [k, -3]) + ', ' + ptt(P0) + ' and ' + ptt(axis === 'y' ? [2, k] : [k, 2]) + ' are on it.<br>Draw the <b>' + (axis === 'y' ? 'horizontal' : 'vertical') + '</b> line through ' + ptt(P0) + (k === 0 ? ' — it is the ' + t(axis === 'y' ? 'x' : 'y') + '-axis itself' : '') + ', with arrows on both ends.',
      ['Which coordinate is held fixed? The letter that is missing from the equation is the direction the line is free to travel.', 'Plot two points with ' + t(Y + '=' + k) + ' (say ' + ptt(P0) + ' and one more) and draw the line through them.'], text || 'graph ' + Y + '=' + k);
  }
  function hvSlope(prompt, axis, k, text) {
    var und = axis === 'x';
    return KP.slope(prompt, und ? null : 0, { before: 'm=' },
      und ? t('x=' + k) + ' is vertical: two points on it, such as ' + ptt([k, 0]) + ' and ' + ptt([k, 2]) + ', have a run of ' + t('0') + '. Rise over run would divide by ' + t('0') + ', so the slope is <b>undefined</b>.'
        : t('y=' + k) + ' is horizontal: ' + t('y') + ' never changes, so the rise is always ' + t('0') + ' and the slope is ' + t('\\frac{0}{\\text{run}}=0') + '.',
      [und ? 'For a vertical line, what is the run between two of its points?' : 'For a horizontal line, what is the rise between two of its points?'], text || 'slope of ' + axis + '=' + k);
  }
  function siGraph(prompt, m, b, win, text) {
    m = mf(m); var Lo = mb(m, b), P1 = [m[1], b + m[0]];
    return gpart(prompt, Lo, win, {
      wrong: [{ L: mb([-m[0], m[1]], b), code: 'l5-gr-sign', hint: 'Check the direction: the slope ' + t(fT(m)) + ' is ' + (m[0] < 0 ? 'negative, so the line falls' : 'positive, so the line rises') + ' from left to right.' },
        { L: mb([m[1] * (m[0] < 0 ? -1 : 1), Math.abs(m[0])], b), code: 'l5-gr-flip', hint: 'Slope is <b>rise over run</b>: ' + t('m=' + fT(m)) + ' means ' + stepT(m) + ' — you stepped run over rise.' },
        { L: ms(m, [b, 0]), code: 'l5-gr-bx', hint: t('b=' + b) + ' is the <b>' + t('y') + '-intercept</b>: start at ' + ptt([0, b]) + ' on the ' + t('y') + '-axis, not on the ' + t('x') + '-axis.' },
        { L: mb(m, -b), code: 'l5-gr-bsign', hint: 'Check the sign of the ' + t('y') + '-intercept: the line crosses the ' + t('y') + '-axis at ' + ptt([0, b]) + '.' }],
      anchor: [{ p: [0, b], hint: 'Your line starts at the right place, ' + ptt([0, b]) + '. Now check the slope: ' + t('m=' + fT(m)) + ' means ' + stepT(m) + '.' }],
      placeHint: 'Start at the ' + t('y') + '-intercept ' + ptt([0, b]) + '.' },
      'Slope–intercept form: ' + t('m=' + fT(m)) + ' and ' + t('b=' + b) + ' are read straight off.<br>Plot ' + ptt([0, b]) + '. From there step ' + stepT(m) + ' to ' + ptt(P1) + ', and again to ' + ptt([2 * m[1], b + 2 * m[0]]) + '.<br>Join the points and extend the line both ways (arrows).',
      ['Plot the ' + t('y') + '-intercept first.', 'Then use rise over run: ' + t('m=' + fT(m)) + '.'], text);
  }
  function intGraph(prompt, p, q, win, text, Lshow) {   // general form with integer intercepts (p, 0), (0, q)
    var Lo = thru([p, 0], [0, q]), S = Lshow || Lo;
    return gpart(prompt, Lo, win, {
      wrong: [{ L: thru([0, p], [q, 0]), code: 'l5-gr-axes', hint: 'Your intercepts are on the wrong axes. The ' + t('x') + '-intercept ' + t(p) + ' sits on the ' + t('x') + '-axis at ' + ptt([p, 0]) + '; the ' + t('y') + '-intercept ' + t(q) + ' at ' + ptt([0, q]) + '.' },
        { L: Math.abs(S.A) <= 8 && Math.abs(S.B) <= 8 && S.B && !(S.A === p && S.B === q) ? thru([S.A, 0], [0, S.B]) : null, code: 'l5-gr-coef', hint: 'The coefficients of ' + t('x') + ' and ' + t('y') + ' are not the intercepts. Substitute ' + t('y=0') + ' to find the ' + t('x') + '-intercept, and ' + t('x=0') + ' for the ' + t('y') + '-intercept.' },
        { L: thru([-p, 0], [0, -q]), code: 'l5-gr-isign', hint: 'Check the signs when you solve: put ' + t('y=0') + ' into the equation and solve for ' + t('x') + ' carefully.' }].filter(function (w) { return w.L; }),
      anchor: [{ p: [p, 0], hint: 'Your line goes through the ' + t('x') + '-intercept ' + ptt([p, 0]) + ' — good. Now check the ' + t('y') + '-intercept: substitute ' + t('x=0') + '.' },
        { p: [0, q], hint: 'Your line goes through the ' + t('y') + '-intercept ' + ptt([0, q]) + ' — good. Now check the ' + t('x') + '-intercept: substitute ' + t('y=0') + '.' }] },
      'Two-intercept method.<br>' + t('y=0') + ': ' + t((S.A === 1 ? '' : S.A) + 'x' + sg(S.C) + '=0') + ', so ' + t('x=' + p) + ' → ' + ptt([p, 0]) + '.<br>' + t('x=0') + ': ' + t((S.B === 1 ? '' : S.B === -1 ? '-' : S.B) + 'y' + sg(S.C) + '=0') + ', so ' + t('y=' + q) + ' → ' + ptt([0, q]) + '.<br>Plot both intercepts and draw the line through them, with arrows.',
      ['Substitute ' + t('y=0') + ' to get the ' + t('x') + '-intercept; substitute ' + t('x=0') + ' to get the ' + t('y') + '-intercept.', 'An ' + t('x') + '-intercept is a point ' + t('(a,\\ 0)') + ' on the ' + t('x') + '-axis.'], text);
  }
  function scaled(Lo, g) { return { A: Lo.A * g, B: Lo.B * g, C: Lo.C * g }; }
  function gT(Lo) { var s = ''; [[Lo.A, 'x'], [Lo.B, 'y'], [Lo.C, '']].forEach(function (tm) { var c = tm[0]; if (!c) return; var ab = Math.abs(c); s += (c < 0 ? '-' : (s ? '+' : '')) + (ab === 1 && tm[1] ? '' : ab) + tm[1]; }); return (s || '0') + '=0'; }
  /* integer intercepts (p, 0), (0, q) of a general-form line with reduced |B| in bs */
  function intLine(r, ps, qs, okB) { return pickWhere(function () { var p = r.pick(ps), q = r.pick(qs); return { p: p, q: q, L: thru([p, 0], [0, q]) }; }, function (o) { return Math.abs(o.p) !== Math.abs(o.q) && o.L.A >= 2 && (!okB || okB(o.L)); }); }

  /* ---------- answer boxes ---------- */
  function readPt(s) {
    s = String(s == null ? '' : s).replace(/\\left|\\right/g, '').replace(/\s/g, '');
    var m = /^\(([^,()]*),([^,()]*)\)$/.exec(s); if (!m) return null;
    var a = ex.parse(m[1]), b = ex.parse(m[2]); if (!a.ok || !b.ok) return null; return [ex.value(a.ast), ex.value(b.ast)];
  }
  /* an intercept value v on axis ('x' | 'y'), or the point; v = null means "none" is right. diag(x) for extra value mistakes */
  function intBox(axis, v, opt) {
    opt = opt || {};
    var other = axis === 'x' ? 'y' : 'x', P0 = v == null ? null : axis === 'x' ? [v, 0] : [0, v];
    var vc = v == null ? null : K.value(v, { diag: opt.diag });
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{\s*none\s*\}/, 'none').replace(/\\left|\\right/g, '').replace(/\s/g, '');
      if (!s) return form('empty', opt.none ? 'Fill in every box (press <b>none</b> if there isn’t one).' : 'Type your answer first.');
      if (/^none$/i.test(s)) return v == null ? ok() : wrong('gf-said-none', 'This line does cross the ' + t(axis) + '-axis — find where (set ' + t(other + '=0') + ').');
      if (v == null) return wrong('gf-none', opt.noneHint || 'Does this line ever cross the ' + t(axis) + '-axis?');
      s = s.replace(new RegExp('^' + axis + '='), '');
      if (/^\(/.test(s)) {
        var q = readPt(s); if (!q) return form('unreadable', 'Write the intercept as a number, or as an ordered pair such as ' + t(axis === 'x' ? '(3,\\ 0)' : '(0,\\ 3)') + '.');
        var mine = axis === 'x' ? q[0] : q[1], zero = axis === 'x' ? q[1] : q[0];
        if (near(mine, P0[0] + P0[1]) && near(zero, 0)) return ok();
        if (opt.other != null && near(axis === 'x' ? q[1] : q[0], opt.other) && near(mine, 0)) return wrong(axis === 'x' ? 'gf-gave-y' : 'gf-gave-x', 'That’s the ' + t(other) + '-intercept. For the ' + t(axis) + '-intercept set ' + t(other + '=0') + '.');
        if (near(mine, 0) && near(zero, v)) return wrong('l5-pair-axes', 'Right number, wrong axis: the ' + t(axis) + '-intercept is on the ' + t(axis) + '-axis, so it is ' + ptt(P0) + '.');
        if (!near(zero, 0)) return wrong('u7l8-int-pt', 'An ' + t(axis) + '-intercept is on the ' + t(axis) + '-axis, so its ' + t(other) + '-coordinate is ' + t('0') + '.');
        return vc(String(mine));
      }
      return vc(s);
    };
  }
  /* intercepts of a general-form line (values or points) */
  function intFields(prompt, Lshow, p, q, o) {
    o = o || {};
    var A = Lshow.A, Bc = Lshow.B, C = Lshow.C;
    var dx = function (x) { if (!near(q, p) && near(x, q)) return { code: 'gf-gave-y', hint: 'That’s the ' + t('y') + '-intercept. For the ' + t('x') + '-intercept set ' + t('y=0') + '.' }; if (Math.abs(A) !== 1 && (near(x, C) || near(x, -C))) return { code: 'gf-x-undivided', hint: 'Set ' + t('y=0') + ', then divide the constant by the coefficient of ' + t('x') + ', ' + t(A) + '.' }; return null; };
    var dy = function (x) { if (!near(q, p) && near(x, p)) return { code: 'gf-gave-x', hint: 'That’s the ' + t('x') + '-intercept. For the ' + t('y') + '-intercept set ' + t('x=0') + '.' }; if (Math.abs(Bc) !== 1 && (near(x, C) || near(x, -C))) return { code: 'gf-b-undivided', hint: 'Set ' + t('x=0') + ', then divide the constant by the coefficient of ' + t('y') + ', ' + t(Bc) + '.' }; return null; };
    var ph = 'e.g. 3 or (3, 0)';
    var pp = KP.fields(prompt, [{ label: t('x') + '-intercept:', name: 'x-intercept', mode: 'math', keys: 'u7val', placeholder: ph }, { label: t('y') + '-intercept:', name: 'y-intercept', mode: 'math', keys: 'u7val', placeholder: ph }],
      [intBox('x', p, { diag: dx, other: q }), intBox('y', q, { diag: dy, other: p })], [pK([p, 0]), pK([0, q])], t('x') + '-intercept ' + ptt([p, 0]) + ', ' + t('y') + '-intercept ' + ptt([0, q]),
      t('y=0') + ': ' + t((A === 1 ? '' : A) + 'x' + sg(C) + '=0') + ', so ' + t('x=' + p) + ' → ' + ptt([p, 0]) + '.<br>' + t('x=0') + ': ' + t((Bc === 1 ? '' : Bc === -1 ? '-' : Bc) + 'y' + sg(C) + '=0') + ', so ' + t('y=' + q) + ' → ' + ptt([0, q]) + '.',
      ['For the ' + t('x') + '-intercept substitute ' + t('y=0') + ' (the ' + t('y') + '-term disappears); for the ' + t('y') + '-intercept substitute ' + t('x=0') + '.'], o.text || 'intercepts of ' + gT(Lshow));
    pp.good = [[String(p), String(q)], ['x=' + p, 'y=' + q]];
    pp.bad = [[String(-p), String(-q)], [pK([0, p]), pK([q, 0])]];
    if (!near(p, q)) pp.bad.push([String(q), String(p)]);
    return pp;
  }
  /* any point on a line, as an ordered pair */
  function onBox(Lo, eqT) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim(); if (!s) return form('empty', 'Type a point first.');
      var q = readPt(s);
      if (!q) { var a = ex.parse(s.replace(/\\left|\\right/g, '')); return form(a.ok ? 'u7l8-pt-format' : 'unreadable', 'Give a <b>point</b> as an ordered pair in brackets, e.g. ' + t('(4,\\ -1)') + '.'); }
      if (onL(Lo, q)) return ok();
      if (onL(Lo, [q[1], q[0]])) return wrong('pt-swap', 'Your coordinates are the wrong way round: an ordered pair is ' + t('(x,\\ y)') + '.');
      return wrong('u7l8-pt-off', ptt(q) + ' isn’t on ' + t(eqT) + ': ' + (Lo.A === 0 ? 'every point on it has ' + t('y') + '-coordinate ' + t(nT(-Lo.C / Lo.B)) : Lo.B === 0 ? 'every point on it has ' + t('x') + '-coordinate ' + t(nT(-Lo.C / Lo.A)) : 'substitute it to check') + '.');
    };
  }
  /* an equation box; T = target; opt.wrong; opt.form */
  function eqBox(T, opt) {
    opt = opt || {};
    var base = K.line(T, { form: opt.form || 'any', wrong: opt.wrong });
    if (opt.form !== 'general') return base;
    return function (resp) {
      var r = base(resp);
      if (r.v === 'form' && r.code === 'line-form-gcd') return ok();
      return r;
    };
  }
  function eqFields(prompt, labels, Ts, opts, sol, hints, text) {
    var keys = Ts.map(function (T, i) { return Ln.tex(T, (opts[i] || {}).form === 'general' ? 'general' : 'slope-intercept'); });
    var p = KP.fields(prompt, labels.map(function (l) { var lt = /^\((\w)\)/.exec(l); return { label: l, name: lt ? '(' + lt[1] + ')' : l.replace(/\\\(|\\\)/g, '').replace('\\ell_1', 'ℓ₁').replace('\\ell_2', 'ℓ₂').replace(/:$/, ''), mode: 'math', keys: 'eq', vars: ['x', 'y'], placeholder: ' ' }; }), Ts.map(function (T, i) { return eqBox(T, opts[i]); }), keys,
      labels.map(function (l, i) { return l + ' ' + t(keys[i]); }).join('<br>'), sol, hints, text);
    return p;
  }

  /* ================= assignment ================= */
  var STRAT = ['Is it ' + t('y=k') + ' or ' + t('x=k') + '? Graph it directly.', 'Is it ' + t('y=mx+b') + '? Plot ' + t('(0,\\ b)') + ', then count the slope.', 'Is it ' + t('Ax+By+C=0') + '? Find both intercepts and join them.'];

  var EXTRA = [
    /* ---------- Part A ---------- */
    { num: '1', section: 'Extra practice A — Horizontal and vertical lines on a grid', shared: function (r) { return { a: -r.int(1, 7), b: r.int(1, 7) }; },
      stem: function (sh) { return 'Graph each line, then give its slope and both intercepts. If a line has no intercept of the kind asked for, press <b>none</b>.'; }, parts: [
      { id: 'e1a', sub: 'a graph', level: 'BEG', make: function (r, sh) { return hvGraph('Graph ' + t('y=' + sh.a) + '.', 'y', sh.a, W8); } },
      { id: 'e1a2', sub: 'a slope', level: 'EMG', make: function (r, sh) { return slopeIntFields(t('y=' + sh.a), 'y', sh.a); } },
      { id: 'e1b', sub: 'b graph', level: 'BEG', make: function (r, sh) { return hvGraph('Graph ' + t('x=' + sh.b) + '.', 'x', sh.b, W8); } },
      { id: 'e1b2', sub: 'b slope', level: 'EMG', make: function (r, sh) { return slopeIntFields(t('x=' + sh.b), 'x', sh.b); } }] },
    { num: '2', stem: 'You are given a point instead of an equation. Write the equation of the line described, then graph it.',
      shared: function (r) { return { h: [r.pick(pm(1, 6)), -r.int(1, 7)], v: [-r.int(1, 7), r.pick(pm(1, 6))] }; }, parts: [
      { id: 'e2a', sub: 'a eq', level: 'BEG', make: function (r, sh) { return hvEq('(a) The <b>horizontal</b> line through ' + ptt(sh.h) + '.', 'y', sh.h); } },
      { id: 'e2a2', sub: 'a graph', level: 'BEG', make: function (r, sh) { return hvGraph('Graph the horizontal line through ' + ptt(sh.h) + '.', 'y', sh.h[1], W8); } },
      { id: 'e2b', sub: 'b eq', level: 'BEG', make: function (r, sh) { return hvEq('(b) The <b>vertical</b> line through ' + ptt(sh.v) + '.', 'x', sh.v); } },
      { id: 'e2b2', sub: 'b graph', level: 'BEG', make: function (r, sh) { return hvGraph('Graph the vertical line through ' + ptt(sh.v) + '.', 'x', sh.v[0], W8); } }] },
    { num: '3', stem: function (sh) { return 'Each grid already shows a line. Write its equation and state its slope.' + '<div style="display:flex;flex-wrap:wrap;gap:8px 18px;justify-content:center">' + '<div style="text-align:center"><b>(a)</b>' + labFig([{ L: hz(sh.a), color: BLUE }], W8, { max: 220 }) + '</div><div style="text-align:center"><b>(b)</b>' + labFig([{ L: vt(sh.b), color: RED }], W8, { max: 220 }) + '</div></div>'; },
      shared: function (r) { return { a: r.pick(pm(1, 7)), b: r.pick(pm(1, 7)) }; }, parts: [
      { id: 'e3a', sub: 'a eq', level: 'BEG', make: function (r, sh) { return hvEq('Write the equation of the line on grid (a).', 'y', [0, sh.a], true); } },
      { id: 'e3a2', sub: 'a slope', level: 'LIM', make: function (r, sh) { return hvSlope('State the slope of the line on grid (a).', 'y', sh.a); } },
      { id: 'e3b', sub: 'b eq', level: 'BEG', make: function (r, sh) { return hvEq('Write the equation of the line on grid (b).', 'x', [sh.b, 0], true); } },
      { id: 'e3b2', sub: 'b slope', level: 'LIM', make: function (r, sh) { return hvSlope('State the slope of the line on grid (b).', 'x', sh.b); } }] },
    { num: '4', shared: function (r) { return { a: r.pick(pm(1, 6)), b: r.pick(pm(1, 6)) }; },
      stem: function (sh) { return 'The grid shows two lines.' + labFig([{ L: hz(sh.a), color: BLUE, label: 'ℓ₁', at: [sh.b > 0 ? -7 : 5, sh.a] }, { L: vt(sh.b), color: RED, label: 'ℓ₂', at: [sh.b, sh.a > 0 ? -6 : 6] }], W8, { max: 300 }); }, parts: [
      { id: 'e4a', sub: 'a', level: 'BEG', make: function (r, sh) {
        var p = eqFields('Write the equation of each line.', [t('\\ell_1') + ':', t('\\ell_2') + ':'], [{ y: sh.a }, { x: sh.b }], [{ wrong: [{ is: { x: sh.a }, code: 'l5-gr-hv', hint: t('\\ell_1') + ' is horizontal: ' + t('y') + ' is fixed.' }] }, { wrong: [{ is: { y: sh.b }, code: 'l5-gr-hv', hint: t('\\ell_2') + ' is vertical: ' + t('x') + ' is fixed.' }] }],
          t('\\ell_1') + ' is horizontal: every point on it has ' + t('y') + '-coordinate ' + t(sh.a) + ', so ' + t('y=' + sh.a) + '.<br>' + t('\\ell_2') + ' is vertical: every point has ' + t('x') + '-coordinate ' + t(sh.b) + ', so ' + t('x=' + sh.b) + '.', ['For each line, which coordinate stays the same?'], 'two hv equations');
        p.bad = [['x=' + sh.a, 'y=' + sh.b]].filter(function () { return sh.a !== sh.b; }); return p;
      } },
      { id: 'e4b', sub: 'b', level: 'BEG', make: function (r, sh) {
        return KP.fields('State the slope of each line.', [{ label: t('\\ell_1') + ':', name: 'ℓ₁ slope', mode: 'math', keys: 'slope', before: t('m='), placeholder: ' ' }, { label: t('\\ell_2') + ':', name: 'ℓ₂ slope', mode: 'math', keys: 'slope', before: t('m='), placeholder: ' ' }],
          [K.slope(0), K.slope(null)], ['0', '\\text{undefined}'], t('\\ell_1') + ': ' + t('0') + '; ' + t('\\ell_2') + ': undefined',
          t('\\ell_1') + ' is horizontal: rise ' + t('0') + ', slope ' + t('0') + '. ' + t('\\ell_2') + ' is vertical: run ' + t('0') + ', so the slope is <b>undefined</b>.', ['Horizontal: no rise. Vertical: no run.'], 'two hv slopes');
      } },
      { id: 'e4c', sub: 'c', level: 'EMG', make: function (r, sh) {
        var P0 = [sh.b, sh.a];
        var p = KP.math('Give the coordinates of the point where the two lines cross.', K.pairs([P0]), pK(P0), 'Each equation pins one coordinate: ' + t('\\ell_2') + ' makes ' + t('x=' + sh.b) + ' and ' + t('\\ell_1') + ' makes ' + t('y=' + sh.a) + '. Together they name exactly one point, ' + ptt(P0) + ' — no graph needed.',
          ['On ' + t('\\ell_1') + ', what is ' + t('y') + ' always? On ' + t('\\ell_2') + ', what is ' + t('x') + ' always?'], 'hv crossing', { keys: 'u7val', placeholder: 'e.g. (2, -4)' });
        p.answer = ptt(P0); p.bad = sh.a !== sh.b ? [pK([sh.a, sh.b])] : []; return p;
      } }] },
    { num: '5', shared: function (r) { return { P: [-r.int(1, 7), r.int(1, 7)] }; }, stem: function (sh) { return 'All four lines below pass through the point ' + ptt(sh.P) + '. Write the equation of each one.'; }, parts: [
      { id: 'e5a', sub: 'a, b', level: 'EMG', make: function (r, sh) { return throughFields(sh.P, ['(a) parallel to the ' + t('x') + '-axis:', '(b) parallel to the ' + t('y') + '-axis:'], ['y', 'x']); } },
      { id: 'e5b', sub: 'c, d', level: 'PRG', make: function (r, sh) { return throughFields(sh.P, ['(c) perpendicular to the ' + t('x') + '-axis:', '(d) perpendicular to the ' + t('y') + '-axis:'], ['x', 'y'], 'Perpendicular to the ' + t('x') + '-axis means <b>vertical</b>; perpendicular to the ' + t('y') + '-axis means <b>horizontal</b> — so (c) is the same line as (b), and (d) the same as (a).'); } }] },
    /* ---------- Part B ---------- */
    { num: '6', section: 'Extra practice B — One strategy for any form', shared: function (r) {
        var f = r.pick([[3, 4], [2, 3], [1, 2], [3, 2], [1, 3], [2, 5]]), sgn = r.pick([1, -1]), b = r.pick(pm(1, 5));
        var il = intLine(r, [2, 3, 4, 5, 6], [2, 3, 4, 5, 6]), k = r.pick(pm(1, 7)), P1 = [-r.int(1, 6), r.int(-5, 5)], P2 = [P1[0] + r.int(2, 6), r.int(-5, 5)];
        if (P2[1] === P1[1]) P2[1] = P1[1] + 2;
        return { a: { m: [sgn * f[0], f[1]], b: b }, b: il, k: k, P1: P1, P2: P2 };
      },
      stem: 'Before graphing anything, decide <b>how</b> you would graph each line — the cheapest route. <b>Constant:</b> ' + t('y=k') + ' or ' + t('x=k') + ', no work. <b>Slope–intercept:</b> plot ' + t('b') + ', then count the slope. <b>Two-intercept:</b> set ' + t('y=0') + ', then ' + t('x=0') + '. <b>Two points:</b> plot and join.', parts: [
      { id: 'e6', level: 'EMG', make: function (r, sh) {
        var rows = [{ id: 'a', html: '(a) ' + t(si(mb(sh.a.m, sh.a.b))) }, { id: 'b', html: '(b) ' + t(gT(sh.b.L)) }, { id: 'c', html: '(c) ' + t('x=' + sh.k) }, { id: 'd', html: '(d) through ' + ptt(sh.P1) + ' and ' + ptt(sh.P2) }];
        var cols = [{ id: 'c', html: 'Constant' }, { id: 's', html: 'Slope–intercept' }, { id: 'i', html: 'Two-intercept' }, { id: 't', html: 'Two points' }];
        return KP.grid('Choose the method for each line.', rows, cols, { a: 's', b: 'i', c: 'c', d: 't' }, { why: function (row) { return { a: '(a) is already ' + t('y=mx+b') + ': ' + t('b') + ' and the slope are handed to you.', b: '(b) is in general form: substituting ' + t('0') + ' for ' + t('x') + ' and for ' + t('y') + ' gives whole-number intercepts with no rearranging.', c: '(c) has only one letter: it is a vertical line — no calculation at all.', d: '(d) already gives you two points: just plot them and join them.' }[row]; } },
          '(a) slope–intercept — ' + t('b=' + sh.a.b) + ' is given and the slope ' + t(fT(sh.a.m)) + ' counts out to a grid point (' + stepT(sh.a.m) + ').<br>(b) two-intercept — ' + t('y=0') + ' gives ' + ptt([sh.b.p, 0]) + ' and ' + t('x=0') + ' gives ' + ptt([0, sh.b.q]) + ', both whole numbers.<br>(c) constant — the vertical line through ' + ptt([sh.k, 0]) + '.<br>(d) two points — both points are given, so plot and join.',
          ['Look at the form each line arrives in. What does that form hand you for free?'], 'choose method');
      } }] },
    { num: '7', shared: function (r) {
        var a = pickWhere(function () { var f = r.pick([[2, 3], [3, 4], [2, 5], [3, 2], [4, 3], [1, 2]]); return { m: [-f[0], f[1]], b: r.pick(pm(1, 5)) }; }, function (o) { return o.b * o.m[1] % o.m[0] !== 0; });
        var b = intLine(r, [-2, -3, -4, -5, -6], [-2, -3, -4, -5, -6], function (L) { return L.C !== 0; });
        return { a: a, b: b };
      },
      stem: function (sh) { return 'Graph each line. The two are deliberately mismatched: one has an ugly ' + t('x') + '-intercept, the other has tidy intercepts.<br>(a) ' + t(si(mb(sh.a.m, sh.a.b))) + ' &nbsp;&nbsp; (b) ' + t(gT(sh.b.L)); }, parts: [
      { id: 'e7', sub: 'methods', level: 'EMG', make: function (r, sh) {
        var xi = fr(-sh.a.b * sh.a.m[1], sh.a.m[0]);
        return KP.grid('Name the method you will use for each.', [{ id: 'a', html: '(a) ' + t(si(mb(sh.a.m, sh.a.b))) }, { id: 'b', html: '(b) ' + t(gT(sh.b.L)) }], [{ id: 's', html: 'Slope–intercept' }, { id: 'i', html: 'Two-intercept' }], { a: 's', b: 'i' },
          { why: function (row) { return row === 'a' ? '(a): its ' + t('x') + '-intercept is ' + t(fT(xi)) + ' — a fraction, awkward to plot. But ' + t('b') + ' and the slope are handed to you.' : '(b): its intercepts ' + ptt([sh.b.p, 0]) + ' and ' + ptt([0, sh.b.q]) + ' are whole numbers.'; } },
          '(a) Slope–intercept: its ' + t('x') + '-intercept is ' + t(fT(xi)) + ', but ' + t('(0,\\ ' + sh.a.b + ')') + ' and the slope are easy.<br>(b) Two-intercept: ' + ptt([sh.b.p, 0]) + ' and ' + ptt([0, sh.b.q]) + '.', ['Which line has whole-number intercepts? Which one hands you ' + t('b') + ' and ' + t('m') + '?'], 'name methods');
      } },
      { id: 'e7a', sub: 'a', level: 'EMG', make: function (r, sh) { return siGraph('Graph ' + t(si(mb(sh.a.m, sh.a.b))) + '.', sh.a.m, sh.a.b, W8, 'graph y=mx+b, fraction slope'); } },
      { id: 'e7b', sub: 'b', level: 'PRG', make: function (r, sh) { return intGraph('Graph ' + t(gT(sh.b.L)) + '.', sh.b.p, sh.b.q, W8, 'graph general by intercepts'); } }] },
    { num: '8', stem: 'Graph each line using the two-intercept method. Find both intercepts before you draw.',
      shared: function (r) { return { a: intLine(r, [2, 3, 4, 5, 6, 7], [-2, -3, -4, -5, -6, -7, -8]), b: intLine(r, [-2, -3, -4, -5, -6], [-2, -3, -4, -5, -6, -7, -8]) }; }, parts: [
      { id: 'e8a', sub: 'a ints', level: 'EMG', outcome: 'RF5', make: function (r, sh) { return intFields(t(gT(sh.a.L)), sh.a.L, sh.a.p, sh.a.q); } },
      { id: 'e8a2', sub: 'a graph', level: 'EMG', make: function (r, sh) { return intGraph('Graph ' + t(gT(sh.a.L)) + '.', sh.a.p, sh.a.q, W8); } },
      { id: 'e8b', sub: 'b ints', level: 'EMG', outcome: 'RF5', make: function (r, sh) { return intFields(t(gT(sh.b.L)), sh.b.L, sh.b.p, sh.b.q); } },
      { id: 'e8b2', sub: 'b graph', level: 'EMG', make: function (r, sh) { return intGraph('Graph ' + t(gT(sh.b.L)) + '.', sh.b.p, sh.b.q, W8); } }] },
    { num: '9', shared: function (r) {
        var a = pickWhere(function () { var m = r.pick([-1, -2, 1, 2, -3]), x1 = r.int(-5, -2), b = r.pick(pm(1, 4)); return { m: m, b: b, P1: [x1, m * x1 + b], P2: [x1 + 6 / (Math.abs(m) > 1 ? 2 : 1), m * (x1 + 6 / (Math.abs(m) > 1 ? 2 : 1)) + b] }; }, function (o) { return [o.P1, o.P2].every(function (p) { return Math.abs(p[0]) <= 7 && Math.abs(p[1]) <= 7; }); });
        var k = -r.int(1, 5), h = r.pick(pm(1, 4)), s = r.pick([-1, 1]), c = pickWhere(function () { return r.int(-3, 5); }, function (c) { var y = s * k + c, x = (h - c) / s; return c !== h && Math.abs(y) <= 7 && Math.abs(x) <= 7 && y !== h; });
        return { a: a, b: { k: k, h: h, s: s, c: c } };
      }, stem: '', parts: [
      { id: 'e9a', sub: 'a graph', level: 'EMG', make: function (r, sh) { var Lo = thru(sh.a.P1, sh.a.P2); return gpart('Graph the line through ' + ptt(sh.a.P1) + ' and ' + ptt(sh.a.P2) + '.', Lo, W8, { wrong: [{ L: thru([sh.a.P1[1], sh.a.P1[0]], [sh.a.P2[1], sh.a.P2[0]]), code: 'graph-swap', hint: 'Plot ' + t('(x,\\ y)') + ' across first, then up or down.' }] }, 'Plot both points and draw the line through them, with arrows on both ends.', ['Plot the two points, then join them.'], 'graph through two points'); } },
      { id: 'e9a2', sub: 'a eqs', level: 'PRG', outcome: 'RF7', make: function (r, sh) {
        var Lo = thru(sh.a.P1, sh.a.P2), m = sh.a.m, b = sh.a.b, P1 = sh.a.P1, P2 = sh.a.P2;
        return eqFields('Write the equation of the line through ' + ptt(P1) + ' and ' + ptt(P2) + ' in slope–intercept form <b>and</b> in general form.', ['Slope–intercept:', 'General:'], [Lo, Lo], [{ form: 'slope-intercept', wrong: [{ is: { m: -m, b: b }, code: 'line-slope-sign', hint: 'Check the sign of the slope: ' + t('m=\\frac{' + P2[1] + '-' + (P1[1] < 0 ? '(' + P1[1] + ')' : P1[1]) + '}{' + P2[0] + '-(' + P1[0] + ')}') + '.' }] }, { form: 'general' }],
          t('m=\\frac{' + (P2[1] - P1[1]) + '}{' + (P2[0] - P1[0]) + '}=' + m) + '. Substitute ' + ptt(P1) + ' into ' + t('y=' + m + 'x+b') + ': ' + t(P1[1] + '=' + m + '(' + P1[0] + ')+b') + ', so ' + t('b=' + b) + ': ' + t(si(Lo)) + '.<br>General form: move every term to one side, ' + t('x') + '-term positive: ' + t(gen(Lo)) + '.',
          ['Find the slope from the two points, then ' + t('b') + ' by substituting one point.', 'For general form, move every term to the left with the ' + t('x') + '-term positive.'], 'two forms through two points');
      } },
      { id: 'e9b', sub: 'b graph', level: 'PRG', make: function (r, sh) {
        var o = sh.b, L1 = vt(o.k), L2 = hz(o.h), L3 = mb(o.s, o.c);
        return gpart('On one grid, draw ' + t('x=' + o.k) + ', ' + t('y=' + o.h) + ' and ' + t(si(L3)) + '.', [L1, L2, L3], W8, { names: [t('x=' + o.k), t('y=' + o.h), t(si(L3))] },
          t('x=' + o.k) + ': vertical through ' + ptt([o.k, 0]) + '. ' + t('y=' + o.h) + ': horizontal through ' + ptt([0, o.h]) + '. ' + t(si(L3)) + ': start at ' + ptt([0, o.c]) + ', slope ' + t(o.s) + '.', ['Draw the two constant lines first, then the slanted one.'], 'three lines');
      } },
      { id: 'e9b2', sub: 'b points', level: 'ADV', make: function (r, sh) {
        var o = sh.b, L3 = mb(o.s, o.c), A = [o.k, o.h], B = [o.k, o.s * o.k + o.c], C = [(o.h - o.c) / o.s, o.h];
        var p = KP.pairs('State the three points where the lines ' + t('x=' + o.k) + ', ' + t('y=' + o.h) + ' and ' + t(si(L3)) + ' cross one another.', [A, B, C], {},
          t('x=' + o.k) + ' and ' + t('y=' + o.h) + ': ' + ptt(A) + '.<br>' + t('x=' + o.k) + ' and ' + t(si(L3)) + ': substitute ' + t('x=' + o.k) + ': ' + t('y=' + o.s + '(' + o.k + ')' + sg(o.c) + '=' + B[1]) + ', so ' + ptt(B) + '.<br>' + t('y=' + o.h) + ' and ' + t(si(L3)) + ': ' + t(o.h + '=' + (o.s === 1 ? '' : '-') + 'x' + sg(o.c)) + ', so ' + t('x=' + C[0]) + ' and ' + ptt(C) + '.',
          ['Two constant lines cross where both coordinates are fixed. For the slanted line, substitute the fixed coordinate into its equation.'], 'three crossing points');
        p.bad = ['\\{' + [A, B].map(pK).join(', ') + '\\}'];
        return p;
      } }] },
    { num: '10', shared: function (r) { var n = r.pick([2, 3]), sgn = r.pick([1, -1]), k = r.pick(pm(2, 6)); return { n: n, sgn: sgn, k: k }; },
      stem: function (sh) { var L3 = mb([-sh.sgn, sh.n], sh.k), L4 = mb(-sh.sgn * sh.n, sh.k); return 'Consider the four lines ' + t('y=' + sh.k) + ', ' + t('x=' + sh.k) + ', ' + t(si(L3)) + ' and ' + t(gen(L4)) + '.'; }, parts: [
      { id: 'e10a', sub: 'a', level: 'PRG', make: function (r, sh) {
        var L3 = mb([-sh.sgn, sh.n], sh.k), L4 = mb(-sh.sgn * sh.n, sh.k);
        return mc(r, 'Which of these lines share a point with <b>all</b> of the others?', [
          { html: 'All four: no two of them are parallel (slopes ' + t('0') + ', undefined, ' + t(fT([-sh.sgn, sh.n])) + ' and ' + t(-sh.sgn * sh.n) + '), and two lines that aren’t parallel always cross exactly once.', right: true },
          { html: 'Only the three that pass through ' + ptt([0, sh.k]) + '.', why: t('x=' + sh.k) + ' crosses each of the others too — just not at ' + ptt([0, sh.k]) + '. “Share a point” means meet somewhere.' },
          { html: 'Only ' + t('y=' + sh.k) + ' and ' + t('x=' + sh.k) + '.', why: 'Every pair of non-parallel lines meets. The slanted lines aren’t parallel to anything here.' },
          { html: 'None: a vertical line can’t meet a slanted line.', why: 'A vertical line meets every line that isn’t vertical — e.g. ' + t('x=' + sh.k) + ' meets ' + t(si(L3)) + ' at ' + ptt([sh.k, -sh.sgn * sh.k / sh.n + sh.k]) + '.' }],
          'Slopes: ' + t('0') + ', undefined, ' + t(fT([-sh.sgn, sh.n])) + ', ' + t(-sh.sgn * sh.n) + ' — all different, so no two lines are parallel and every pair crosses once. For example ' + t('y=' + sh.k) + ' and ' + t('x=' + sh.k) + ' cross at ' + ptt([sh.k, sh.k]) + ', and ' + t('x=' + sh.k) + ' crosses ' + t(gen(L4)) + ' at ' + ptt([sh.k, -sh.sgn * sh.n * sh.k + sh.k]) + '.',
          ['When do two lines never meet?'], 'all share a point');
      } },
      { id: 'e10b', sub: 'b', level: 'EMG', make: function (r, sh) {
        var base = K.pairs([[0, sh.k]]), chk = function (resp) {
          var r0 = base(resp); if (r0.v !== 'wrong') return r0;
          var q = readPt(resp); if (q && near(q[0], sh.k) && near(q[1], sh.k)) return wrong('u7l8-pt-off', 'That’s where ' + t('y=' + sh.k) + ' and ' + t('x=' + sh.k) + ' cross — but the slanted lines don’t pass through it. Where do the slanted lines cross the ' + t('y') + '-axis?');
          if (q && near(q[0], sh.k) && near(q[1], 0)) return wrong('l5-pair-axes', 'Check the order: the common point is on the ' + t('y') + '-axis, so its ' + t('x') + '-coordinate is ' + t('0') + '.');
          return r0;
        };
        var p = KP.math('Three of the lines pass through one common point. Which point?', chk, pK([0, sh.k]), t('y=' + sh.k) + ' crosses the ' + t('y') + '-axis at ' + ptt([0, sh.k]) + ', and both slanted lines have ' + t('y') + '-intercept ' + t(sh.k) + '. So ' + t('y=' + sh.k) + ' and the two slanted lines all pass through ' + ptt([0, sh.k]) + '.',
          ['What is the ' + t('y') + '-intercept of each slanted line?'], 'common point', { keys: 'u7val', placeholder: 'e.g. (0, 4)' });
        p.answer = ptt([0, sh.k]); p.bad = [pK([sh.k, 0]), pK([sh.k, sh.k])]; return p;
      } }] },
    /* ---------- Part C ---------- */
    { num: '11', section: 'Extra practice C — Figures, errors, reasoning and working backwards', shared: function (r) { return pickWhere(function () { return { x1: -r.int(1, 6), x2: r.int(1, 6), y1: -r.int(1, 6), y2: r.int(1, 6) }; }, function (o) { return o.x2 - o.x1 !== o.y2 - o.y1; }); },
      stem: function (sh) { return 'The rectangle is bounded by two horizontal lines and two vertical lines.' + labFig([{ L: vt(sh.x1), color: RED }, { L: vt(sh.x2), color: RED }, { L: hz(sh.y1), color: BLUE }, { L: hz(sh.y2), color: BLUE }], W8, { max: 300, fill: [sh.x1, sh.y1, sh.x2, sh.y2] }); }, parts: [
      { id: 'e11a', sub: 'a', level: 'EMG', make: function (r, sh) {
        return eqFields('Write the equations of all four lines.', ['Left side:', 'Right side:', 'Bottom:', 'Top:'], [{ x: sh.x1 }, { x: sh.x2 }, { y: sh.y1 }, { y: sh.y2 }], [{}, {}, {}, {}],
          'Vertical sides: ' + t('x=' + sh.x1) + ' and ' + t('x=' + sh.x2) + '. Horizontal sides: ' + t('y=' + sh.y1) + ' and ' + t('y=' + sh.y2) + '.', ['A vertical side keeps ' + t('x') + ' fixed; a horizontal side keeps ' + t('y') + ' fixed.'], 'rectangle sides');
      } },
      { id: 'e11b', sub: 'b', level: 'EMG', make: function (r, sh) {
        var cs = [[sh.x1, sh.y1], [sh.x2, sh.y1], [sh.x2, sh.y2], [sh.x1, sh.y2]];
        var p = KP.pairs('Give the coordinates of all four corners.', cs, {}, 'Each corner is where a vertical side meets a horizontal side: ' + cs.map(ptt).join(', ') + '.', ['A corner takes its ' + t('x') + ' from a vertical side and its ' + t('y') + ' from a horizontal side.'], 'rectangle corners');
        p.bad = ['\\{' + cs.slice(0, 3).map(pK).join(', ') + '\\}']; return p;
      } },
      { id: 'e11c', sub: 'c', level: 'PRG', make: function (r, sh) {
        var w = sh.x2 - sh.x1, h = sh.y2 - sh.y1, A = w * h, Pm = 2 * (w + h);
        var dA = function (v) { if (v === Pm && Pm !== A) return { code: 'u7l8-area-perim', hint: 'That’s the perimeter. Area = width × height.' }; if (v === sh.x2 * sh.y2 || v === Math.abs(sh.x1 * sh.y1)) return { code: 'u7l8-side', hint: 'A side length is the <b>difference</b> of two coordinates: width ' + t(sh.x2 + '-(' + sh.x1 + ')') + '.' }; return null; };
        var dP = function (v) { if (v === A && Pm !== A) return { code: 'u7l8-area-perim', hint: 'That’s the area. Perimeter = the distance all the way around.' }; if (v === w + h) return { code: 'u7l8-perim-half', hint: 'That’s two sides. The perimeter goes all the way around: ' + t('2(w+h)') + '.' }; return null; };
        var p = KP.fields('Find the area and the perimeter of the rectangle.', [{ label: 'Area:', name: 'Area', after: 'square units' }, { label: 'Perimeter:', name: 'Perimeter', after: 'units' }], [K.number(A, dA), K.number(Pm, dP)], [String(A), String(Pm)], 'Area ' + t(A) + ' square units, perimeter ' + t(Pm) + ' units',
          'Width ' + t(sh.x2 + '-(' + sh.x1 + ')=' + w) + ', height ' + t(sh.y2 + '-(' + sh.y1 + ')=' + h) + '.<br>Area ' + t('=' + w + '\\times ' + h + '=' + A) + ' square units; perimeter ' + t('=2(' + w + '+' + h + ')=' + Pm) + ' units.', ['Width = the difference of the two ' + t('x') + '-values; height = the difference of the two ' + t('y') + '-values.'], 'rectangle area/perimeter');
        p.bad = [[String(Pm), String(A)], [String(A), String(w + h)]].filter(function (b) { return !(b[0] === String(A) && b[1] === String(Pm)); }); return p;
      } }] },
    { num: '12', shared: function (r) { return { k: r.pick(pm(2, 7)), vert: r.chance(0.5) }; },
      stem: function (sh) { return sh.vert ? 'Asked for the equation of the <b>vertical</b> line through ' + ptt([sh.k, 0]) + ', Devon wrote ' + t('y=' + sh.k) + '.' : 'Asked for the equation of the <b>horizontal</b> line through ' + ptt([0, sh.k]) + ', Devon wrote ' + t('x=' + sh.k) + '.'; }, parts: [
      { id: 'e12a', sub: 'a', level: 'EMG', make: function (r, sh) {
        var right = sh.vert ? vt(sh.k) : hz(sh.k), his = sh.vert ? hz(sh.k) : vt(sh.k), rT = sh.vert ? 'x=' + sh.k : 'y=' + sh.k, hT = sh.vert ? 'y=' + sh.k : 'x=' + sh.k;
        return gpart('Graph Devon’s line and the correct line on the same grid.', [right, his], W8, { names: ['the correct line, ' + t(rT), 'Devon’s line, ' + t(hT)] },
          'Devon’s ' + t(hT) + ' is ' + (sh.vert ? 'horizontal through ' + ptt([0, sh.k]) : 'vertical through ' + ptt([sh.k, 0])) + '; the correct ' + t(rT) + ' is ' + (sh.vert ? 'vertical through ' + ptt([sh.k, 0]) : 'horizontal through ' + ptt([0, sh.k])) + '. They cross at ' + ptt([sh.k, sh.k]) + ' but are different lines.', ['Draw both: one is horizontal, one is vertical.'], 'Devon graph');
      } },
      { id: 'e12b', sub: 'b', level: 'EMG', make: function (r, sh) {
        var fx = sh.vert ? 'x' : 'y', ot = sh.vert ? 'y' : 'x';
        return mc(r, 'What swap did Devon make?', [
          { html: 'He used the right number but attached it to the wrong letter: on a ' + (sh.vert ? 'vertical' : 'horizontal') + ' line it is ' + t(fx) + ' that stays fixed, so the equation is ' + t(fx + '=' + sh.k) + '.', right: true },
          { html: 'He used the wrong number: it should be ' + t(ot + '=0') + '.', why: t(ot + '=0') + ' is an axis. The number ' + t(sh.k) + ' is right — the letter is wrong.' },
          { html: 'He forgot the slope: it should be ' + t('y=' + sh.k + 'x') + '.', why: 'That line is slanted. A ' + (sh.vert ? 'vertical' : 'horizontal') + ' line has only one letter in its equation.' },
          { html: 'Nothing — ' + t(ot + '=' + sh.k) + ' and ' + t(fx + '=' + sh.k) + ' are the same line.', why: 'One is horizontal and the other vertical: they only share the point ' + ptt([sh.k, sh.k]) + '.' }],
          'The given point is ' + ptt(sh.vert ? [sh.k, 0] : [0, sh.k]) + '. A ' + (sh.vert ? 'vertical' : 'horizontal') + ' line keeps ' + t(fx) + ' fixed, so it copies the ' + t(fx) + '-coordinate: ' + t(fx + '=' + sh.k) + '. Devon wrote the number with the other letter.', ['Which coordinate does a ' + (sh.vert ? 'vertical' : 'horizontal') + ' line hold fixed?'], 'Devon swap');
      } }] },
    { num: '13', shared: function (r) { return { k: r.pick(pm(2, 9)), vert: r.chance(0.6) }; },
      stem: function (sh) { return sh.vert ? 'Maya says the line ' + t('x=' + sh.k) + ' has slope ' + t('0') + ' “because ' + t('y') + ' never changes.”' : 'Maya says the line ' + t('y=' + sh.k) + ' has an undefined slope “because ' + t('x') + ' never changes.”'; }, parts: [
      { id: 'e13', level: 'EMG', make: function (r, sh) {
        var eqT = (sh.vert ? 'x=' : 'y=') + sh.k;
        return mc(r, 'Two things are wrong with what Maya says. Which correction is right?', sh.vert ? [
          { html: 'On ' + t(eqT) + ' it is ' + t('x') + ' that never changes (' + t('y') + ' takes every value); and the run is ' + t('0') + ', so rise ÷ run divides by ' + t('0') + ': the slope is <b>undefined</b>.', right: true },
          { html: 'She is right about the slope; only her reason is wrong.', why: 'A slope of ' + t('0') + ' is a horizontal line. ' + t(eqT) + ' is vertical.' },
          { html: 'She is right about the reason; the slope is undefined because ' + t('y') + ' never changes.', why: 'On ' + t(eqT) + ', ' + t('y') + ' changes freely — points like ' + ptt([sh.k, 1]) + ' and ' + ptt([sh.k, 5]) + ' are both on it.' },
          { html: 'The slope is ' + t(sh.k) + ', because the line goes through ' + ptt([sh.k, 0]) + '.', why: 'The number in ' + t(eqT) + ' is where the line is, not its slope. Its run is ' + t('0') + '.' }] : [
          { html: 'On ' + t(eqT) + ' it is ' + t('y') + ' that never changes (' + t('x') + ' takes every value); and the rise is ' + t('0') + ', so the slope is ' + t('\\frac{0}{\\text{run}}=0') + ', not undefined.', right: true },
          { html: 'She is right about the slope; only her reason is wrong.', why: 'An undefined slope is a vertical line. ' + t(eqT) + ' is horizontal.' },
          { html: 'She is right about the reason; the slope is ' + t('0') + ' because ' + t('x') + ' never changes.', why: 'On ' + t(eqT) + ', ' + t('x') + ' changes freely — points like ' + ptt([1, sh.k]) + ' and ' + ptt([5, sh.k]) + ' are both on it.' },
          { html: 'The slope is ' + t(sh.k) + ', because the line goes through ' + ptt([0, sh.k]) + '.', why: 'The number in ' + t(eqT) + ' is where the line is, not its slope. Its rise is ' + t('0') + '.' }],
          sh.vert ? t(eqT) + ' is vertical: ' + t('x') + ' is fixed and ' + t('y') + ' changes. Between ' + ptt([sh.k, 1]) + ' and ' + ptt([sh.k, 5]) + ', rise ' + t('4') + ', run ' + t('0') + ': ' + t('\\frac{4}{0}') + ' has no value — the slope is <b>undefined</b>.'
            : t(eqT) + ' is horizontal: ' + t('y') + ' is fixed and ' + t('x') + ' changes. Between ' + ptt([1, sh.k]) + ' and ' + ptt([5, sh.k]) + ', rise ' + t('0') + ', run ' + t('4') + ': slope ' + t('\\frac{0}{4}=0') + '.',
          ['Which letter is missing from the equation? That one can change.'], 'Maya');
      } }] },
    { num: '14', shared: function (r) { return { k: -r.int(1, 7) }; }, stem: function (sh) { return 'Think about the vertical line ' + t('x=' + sh.k) + '.'; }, parts: [
      { id: 'e14a', sub: 'a', level: 'EMG', make: function (r, sh) {
        return mc(r, 'Take two points on it, ' + ptt([sh.k, 1]) + ' and ' + ptt([sh.k, 5]) + '. Why is the slope <b>undefined</b> rather than ' + t('0') + '?', [
          { html: 'The rise is ' + t('4') + ' but the run is ' + t('0') + ', and ' + t('\\frac{4}{0}') + ' has no value. A slope of ' + t('0') + ' would need no rise and some run — the opposite situation.', right: true },
          { html: 'The rise is ' + t('0') + ', so the slope is undefined.', why: 'Rise ' + t('=5-1=4') + '. A rise of ' + t('0') + ' would give slope ' + t('0') + '.' },
          { html: 'Because ' + t(sh.k) + ' is negative.', why: 'Every vertical line has an undefined slope, wherever it is.' },
          { html: t('\\frac{4}{0}=0') + ', so the slope is really ' + t('0') + '.', why: t('\\frac{0}{4}=0') + ', but ' + t('\\frac{4}{0}') + ' is undefined: no number times ' + t('0') + ' gives ' + t('4') + '.' }],
          'Rise ' + t('=5-1=4') + ', run ' + t('=' + sh.k + '-(' + sh.k + ')=0') + ': ' + t('m=\\frac{4}{0}') + ', and division by zero has no value — <b>undefined</b>.', ['Work out the rise and the run between the two points.'], 'why undefined');
      } },
      { id: 'e14b', sub: 'b', level: 'EMG', outcome: 'RF5', make: function (r, sh) {
        var p = KP.fields('State the intercepts of ' + t('x=' + sh.k) + '. Press <b>none</b> if it has none.', [{ label: t('x') + '-intercept:', name: 'x-intercept', mode: 'math', keys: 'u7val', none: true, placeholder: 'e.g. 3 or none' }, { label: t('y') + '-intercept:', name: 'y-intercept', mode: 'math', keys: 'u7val', none: true, placeholder: 'e.g. 3 or none' }],
          [intBox('x', sh.k, { none: true }), intBox('y', null, { none: true, noneHint: t('x=' + sh.k) + ' is parallel to the ' + t('y') + '-axis: does it ever touch it?' })], [String(sh.k), 'none'], t('x') + '-intercept ' + t(sh.k) + ', no ' + t('y') + '-intercept',
          'It crosses the ' + t('x') + '-axis at ' + ptt([sh.k, 0]) + ', so its ' + t('x') + '-intercept is ' + t(sh.k) + '. It runs parallel to the ' + t('y') + '-axis and never touches it, so there is <b>no</b> ' + t('y') + '-intercept.', ['A vertical line never meets the ' + t('y') + '-axis (unless it <b>is</b> the axis).'], 'intercepts of x=k');
        p.bad = [[String(sh.k), '0'], ['none', 'none']]; return p;
      } }] },
    { num: '15', shared: function (r) { return { a: -r.int(1, 7), b: r.int(1, 7) }; }, stem: function (sh) { return 'Compare ' + t('x=' + sh.a) + ' and ' + t('y=' + sh.b) + '.'; }, parts: [
      { id: 'e15', level: 'PRG', make: function (r, sh) {
        return mc(r, 'Use the vertical line test: which statement is right, with the correct domain and range?', [
          { html: t('x=' + sh.a) + ' is <b>not</b> a function (domain ' + t('\\{' + sh.a + '\\}') + ', range all real numbers); ' + t('y=' + sh.b) + ' <b>is</b> a function (domain all real numbers, range ' + t('\\{' + sh.b + '\\}') + ').', right: true },
          { html: 'Both are functions, because both are straight lines.', why: 'A vertical line drawn at ' + t('x=' + sh.a) + ' meets the graph of ' + t('x=' + sh.a) + ' at infinitely many points: it fails the vertical line test.' },
          { html: t('x=' + sh.a) + ' is not a function (domain all real numbers, range ' + t('\\{' + sh.a + '\\}') + '); ' + t('y=' + sh.b) + ' is a function.', why: 'Swap them: on ' + t('x=' + sh.a) + ' the only ' + t('x') + '-value is ' + t(sh.a) + ', so its <b>domain</b> is ' + t('\\{' + sh.a + '\\}') + '.' },
          { html: t('y=' + sh.b) + ' is not a function, because every input gives the same output.', why: 'Every input having the same output is allowed. A function only forbids one input with two different outputs.' }],
          'Any vertical line meets ' + t('y=' + sh.b) + ' exactly once — a function, domain all real numbers, range ' + t('\\{' + sh.b + '\\}') + '. The vertical line at ' + t('x=' + sh.a) + ' lies on top of the graph of ' + t('x=' + sh.a) + ' and meets it infinitely often — not a function: the one input ' + t(sh.a) + ' is paired with every ' + t('y') + '. Domain ' + t('\\{' + sh.a + '\\}') + ', range all real numbers.', ['Imagine sliding a vertical line across each graph. How many times does it touch?'], 'functions?');
      } }] },
    { num: '16', stem: '<b>Work backwards.</b> Write the equation of each line described.', shared: function (r) { return { P: [-r.int(1, 7), r.int(1, 7)], c: -r.int(1, 7), d: r.int(1, 8), f: r.int(1, 7) }; }, parts: [
      { id: 'e16a', sub: 'a–c', level: 'BEG', make: function (r, sh) {
        return eqFields('Write the equations.', ['(a) slope ' + t('0') + ', through ' + ptt(sh.P) + ':', '(b) undefined slope, through ' + ptt(sh.P) + ':', '(c) slope ' + t('0') + ', ' + t('y') + '-intercept ' + t(sh.c) + ':'], [{ y: sh.P[1] }, { x: sh.P[0] }, { y: sh.c }],
          [{ wrong: [{ is: { y: sh.P[0] }, code: 'u7l8-other-coord', hint: 'Slope ' + t('0') + ' means horizontal, so ' + t('y') + ' is fixed: copy the ' + t('y') + '-coordinate.' }] }, { wrong: [{ is: { x: sh.P[1] }, code: 'u7l8-other-coord', hint: 'An undefined slope means vertical, so ' + t('x') + ' is fixed: copy the ' + t('x') + '-coordinate.' }] }, {}],
          '(a) slope ' + t('0') + ' → horizontal → ' + t('y=' + sh.P[1]) + '. (b) undefined → vertical → ' + t('x=' + sh.P[0]) + '. (c) horizontal through ' + ptt([0, sh.c]) + ' → ' + t('y=' + sh.c) + '.', ['Slope ' + t('0') + ' is horizontal (' + t('y=k') + '); undefined slope is vertical (' + t('x=k') + ').'], 'work backwards a-c');
      } },
      { id: 'e16b', sub: 'd–f', level: 'EMG', make: function (r, sh) {
        return eqFields('Write the equations.', ['(d) vertical, with ' + t('x') + '-intercept ' + t(sh.d) + ':', '(e) vertical, through the origin:', '(f) horizontal, ' + t(sh.f) + ' units below the ' + t('x') + '-axis:'], [{ x: sh.d }, { x: 0 }, { y: -sh.f }],
          [{ wrong: [{ is: { y: sh.d }, code: 'l5-gr-hv', hint: 'Vertical means ' + t('x=k') + '.' }] }, { wrong: [{ is: { y: 0 }, code: 'l5-gr-hv', hint: 'That’s the ' + t('x') + '-axis (horizontal). The vertical line through the origin is the ' + t('y') + '-axis.' }] }, { wrong: [{ is: { y: sh.f }, code: 'u7l8-k-sign', hint: '<b>Below</b> the ' + t('x') + '-axis means a negative ' + t('y') + '.' }] }],
          '(d) ' + t('x=' + sh.d) + '. (e) ' + t('x=0') + ' — the ' + t('y') + '-axis. (f) ' + t('y=-' + sh.f) + '.', ['Vertical: ' + t('x=k') + '. Horizontal: ' + t('y=k') + '.'], 'work backwards d-f');
      } }] },
    { num: '17', shared: function (r) { return { k: r.pick(pm(1, 6)), P: [r.int(2, 8), -r.int(1, 7)] }; },
      stem: function (sh) { return 'A line is <b>parallel</b> to ' + t('x=' + sh.k) + ' and passes through ' + ptt(sh.P) + '; a second line is <b>perpendicular</b> to ' + t('x=' + sh.k) + ' and passes through the same point.'; }, parts: [
      { id: 'e17a', sub: 'equations', level: 'EMG', make: function (r, sh) {
        return eqFields('Write both equations.', ['Parallel:', 'Perpendicular:'], [{ x: sh.P[0] }, { y: sh.P[1] }],
          [{ wrong: [{ is: { x: sh.k }, code: 'u7l8-other-coord', hint: 'Parallel to ' + t('x=' + sh.k) + ' means vertical, but through ' + ptt(sh.P) + ': copy the point’s ' + t('x') + '-coordinate.' }, { is: { x: sh.P[1] }, code: 'u7l8-other-coord', hint: 'A vertical line copies the ' + t('x') + '-coordinate of the point.' }] }, { wrong: [{ is: { y: sh.P[0] }, code: 'u7l8-other-coord', hint: 'A horizontal line copies the ' + t('y') + '-coordinate of the point.' }] }],
          'Parallel to the vertical line ' + t('x=' + sh.k) + ' means vertical: ' + t('x=' + sh.P[0]) + ' (copy the ' + t('x') + '-coordinate). Perpendicular to it means horizontal: ' + t('y=' + sh.P[1]) + ' (copy the ' + t('y') + '-coordinate). Neither needs any calculation — the only decision is which coordinate to keep.', ['What kind of line is ' + t('x=' + sh.k) + '? What is parallel to it, and what is perpendicular?'], 'parallel/perp to x=k');
      } },
      { id: 'e17b', sub: 'slopes', level: 'BEG', make: function (r, sh) {
        return KP.fields('State both slopes.', [{ label: 'Parallel:', name: 'Parallel slope', mode: 'math', keys: 'slope', before: t('m='), placeholder: ' ' }, { label: 'Perpendicular:', name: 'Perpendicular slope', mode: 'math', keys: 'slope', before: t('m='), placeholder: ' ' }],
          [K.slope(null), K.slope(0)], ['\\text{undefined}', '0'], 'Parallel: undefined; perpendicular: ' + t('0'), 'The parallel line is vertical (slope undefined); the perpendicular line is horizontal (slope ' + t('0') + ').', ['Vertical lines have no slope number; horizontal lines have slope ' + t('0') + '.'], 'slopes parallel/perp to x=k');
      } }] },
    { num: '18', section: 'Mastery challenge', shared: function (r) {
        return pickWhere(function () { var s = r.pick([[1, 2], [1, 1], [2, 1], [1, 3], [3, 1]]), a = -r.int(1, 4), b = -r.int(1, 5), v = r.int(2, 8); return { a: a, b: b, v: v, s: s }; }, function (o) {
          var h = o.v * o.s[1] / o.s[0]; if (!Number.isInteger(h)) return false; var y1 = o.b + o.v, x1 = o.a + h; return (o.v * h) % 2 === 0 && x1 <= 14 && y1 <= 8 && x1 !== 0 && y1 !== 0;
        });
      },
      stem: function (sh) { var h = sh.v * sh.s[1] / sh.s[0], L3 = thru([sh.a, sh.b + sh.v], [sh.a + h, sh.b]); return '<b>Stretch.</b> The three lines ' + t('x=' + sh.a) + ', ' + t('y=' + sh.b) + ' and ' + t(gen(L3)) + ' enclose a triangle.'; }, parts: [
      { id: 'e18a', sub: 'a', level: 'ADV', make: function (r, sh) {
        var h = sh.v * sh.s[1] / sh.s[0], L3 = thru([sh.a, sh.b + sh.v], [sh.a + h, sh.b]), V = [[sh.a, sh.b], [sh.a, sh.b + sh.v], [sh.a + h, sh.b]];
        var p = KP.pairs('Find the three vertices by solving the lines in pairs.', V, {},
          t('x=' + sh.a) + ' with ' + t('y=' + sh.b) + ': ' + ptt(V[0]) + '.<br>' + t('x=' + sh.a) + ' with ' + t(gen(L3)) + ': substitute ' + t('x=' + sh.a) + ' and solve: ' + t('y=' + V[1][1]) + ', so ' + ptt(V[1]) + '.<br>' + t('y=' + sh.b) + ' with ' + t(gen(L3)) + ': substitute ' + t('y=' + sh.b) + ' and solve: ' + t('x=' + V[2][0]) + ', so ' + ptt(V[2]) + '.',
          ['The two constant lines meet where both coordinates are fixed.', 'For the slanted line, substitute the fixed coordinate of the other line and solve for the missing one.'], 'triangle vertices');
        var base18 = p.check, swV = [V[0], [V[1][1], V[1][0]], V[2]], swc = K.pairs(swV), sw2 = K.pairs([V[0], V[1], [V[2][1], V[2][0]]]);
        p.check = function (resp) { var r0 = base18(resp); if (r0.v !== 'wrong') return r0; if (swc(resp).v === 'correct' || sw2(resp).v === 'correct') return wrong('pt-swap', 'One of your vertices has its coordinates the wrong way round: an ordered pair is ' + t('(x,\\ y)') + '.'); return r0; };
        p.bad = ['\\{' + V.slice(0, 2).map(pK).join(', ') + '\\}'];
        if (V[1][0] !== V[1][1]) p.bad.push('\\{' + [V[0], [V[1][1], V[1][0]], V[2]].map(pK).join(', ') + '\\}');
        return p;
      } },
      { id: 'e18b', sub: 'b', level: 'PRG', make: function (r, sh) {
        return mc(r, '(b) Why must the triangle have a right angle, and at which vertex?', [
          { html: t('x=' + sh.a) + ' is vertical and ' + t('y=' + sh.b) + ' is horizontal, and those are always perpendicular — so the right angle is where they meet, ' + ptt([sh.a, sh.b]) + '.', right: true },
          { html: 'The slanted line is perpendicular to ' + t('y=' + sh.b) + ', so the right angle is on the slanted line.', why: 'The slanted line has slope ' + t(fT([-sh.s[0], sh.s[1]])) + ' — it isn’t perpendicular to a horizontal line (only a vertical line is).' },
          { html: 'Every triangle made of three lines has a right angle.', why: 'Most don’t. This one does because one side is horizontal and another vertical.' },
          { html: 'Because ' + t('m_1m_2=-1') + ' for the two constant lines: ' + t('0\\times\\text{undefined}=-1') + '.', why: '“Undefined” isn’t a number, so the product can’t be formed. Horizontal and vertical lines are perpendicular as the stated exception.' }],
          'A vertical line and a horizontal line always meet at a right angle, so the right angle is at ' + ptt([sh.a, sh.b]) + ', where ' + t('x=' + sh.a) + ' and ' + t('y=' + sh.b) + ' cross.', ['Which two of the lines are horizontal and vertical?'], 'right angle');
      } },
      { id: 'e18c', sub: 'c', level: 'MAS', make: function (r, sh) {
        var h = sh.v * sh.s[1] / sh.s[0], A = sh.v * h / 2;
        return KP.number('Find the area of the triangle.', A, function (x) {
          if (x === sh.v * h) return { code: 'l5-half-area', hint: 'A triangle is half of a rectangle: ' + t('A=\\frac{1}{2}bh') + '.' };
          if (x === sh.v + h || x === 2 * (sh.v + h)) return { code: 'u7l8-area-perim', hint: 'Area means the space inside: ' + t('\\frac{1}{2}\\times\\text{base}\\times\\text{height}') + '.' };
          return null;
        }, 'The legs lie along the two constant lines. Vertical leg: from ' + ptt([sh.a, sh.b]) + ' to ' + ptt([sh.a, sh.b + sh.v]) + ', length ' + t((sh.b + sh.v) + '-(' + sh.b + ')=' + sh.v) + '. Horizontal leg: from ' + ptt([sh.a, sh.b]) + ' to ' + ptt([sh.a + h, sh.b]) + ', length ' + t((sh.a + h) + '-(' + sh.a + ')=' + h) + '.<br>Area ' + t('=\\frac{1}{2}(' + sh.v + ')(' + h + ')=' + A) + ' square units.',
          ['The right angle is between the two legs: use them as base and height.', 'Each leg’s length is a difference of coordinates of the vertices you found in (a).'], 'triangle area', { after: 'square units' });
      } }] }
  ];

  /* EP1: slope and both intercepts of y = k / x = k */
  function slopeIntFields(prompt, axis, k) {
    var und = axis === 'x', ph = 'e.g. 3 or none';
    return KP.fields(prompt + ': state its slope and both intercepts.', [{ label: 'Slope:', name: 'Slope', mode: 'math', keys: 'slope', before: t('m='), placeholder: 'e.g. 0 or undefined' }, { label: t('x') + '-intercept:', name: 'x-intercept', mode: 'math', keys: 'slope', none: true, placeholder: ph }, { label: t('y') + '-intercept:', name: 'y-intercept', mode: 'math', keys: 'slope', none: true, placeholder: ph }],
      [K.slope(und ? null : 0), intBox('x', und ? k : null, { none: true, noneHint: t('y=' + k) + ' runs parallel to the ' + t('x') + '-axis: does it ever meet it?' }), intBox('y', und ? null : k, { none: true, noneHint: t('x=' + k) + ' runs parallel to the ' + t('y') + '-axis: does it ever meet it?' })],
      [und ? '\\text{undefined}' : '0', und ? String(k) : 'none', und ? 'none' : String(k)],
      'Slope ' + (und ? 'undefined' : t('0')) + ', ' + t('x') + '-intercept ' + (und ? t(k) : 'none') + ', ' + t('y') + '-intercept ' + (und ? 'none' : t(k)),
      und ? t('x=' + k) + ' is vertical: run ' + t('0') + ', so the slope is <b>undefined</b>. It crosses the ' + t('x') + '-axis at ' + ptt([k, 0]) + ' (' + t('x') + '-intercept ' + t(k) + ') and never meets the ' + t('y') + '-axis: <b>no</b> ' + t('y') + '-intercept.'
        : t('y=' + k) + ' is horizontal: rise ' + t('0') + ', slope ' + t('0') + '. It crosses the ' + t('y') + '-axis at ' + ptt([0, k]) + ' (' + t('y') + '-intercept ' + t(k) + ') and runs parallel to the ' + t('x') + '-axis, never meeting it: <b>no</b> ' + t('x') + '-intercept.',
      ['Is the line horizontal or vertical? Which axis does it never touch?'], 'slope and intercepts of ' + axis + '=' + k);
  }
  /* EP2/EP3: equation of a horizontal (axis 'y') or vertical ('x') line through P */
  function hvEq(prompt, axis, P0, fromGraph) {
    var k = axis === 'y' ? P0[1] : P0[0], o = axis === 'y' ? P0[0] : P0[1], T = axis === 'y' ? { y: k } : { x: k };
    var wr = [{ is: axis === 'y' ? { x: k } : { y: k }, code: 'l5-gr-hv', hint: axis === 'y' ? 'That’s a vertical line. A horizontal line keeps ' + t('y') + ' fixed: ' + t('y=k') + '.' : 'That’s a horizontal line. A vertical line keeps ' + t('x') + ' fixed: ' + t('x=k') + '.' }];
    if (!fromGraph && o !== k && o !== 0) wr.push({ is: axis === 'y' ? { y: o } : { x: o }, code: 'u7l8-other-coord', hint: 'A ' + (axis === 'y' ? 'horizontal' : 'vertical') + ' line copies the point’s <b>' + t(axis) + '</b>-coordinate; the other coordinate, ' + t(o) + ', doesn’t matter.' });
    var p = KP.line(prompt + ' Write its equation.', T, { wrong: wr },
      fromGraph ? 'The line is ' + (axis === 'y' ? 'horizontal' : 'vertical') + ' and every point on it has ' + t(axis) + '-coordinate ' + t(k) + ', so its equation is ' + t(axis + '=' + k) + '.'
        : 'A ' + (axis === 'y' ? 'horizontal' : 'vertical') + ' line keeps ' + t(axis) + ' fixed, so it copies the ' + t(axis) + '-coordinate of ' + ptt(P0) + ': ' + t(axis + '=' + k) + '. (The ' + t(axis === 'y' ? 'x' : 'y') + '-coordinate ' + t(o) + ' is irrelevant.)',
      ['Which coordinate stays the same all along a ' + (axis === 'y' ? 'horizontal' : 'vertical') + ' line?'], 'equation of ' + axis + '=' + k);
    p.input.placeholder = axis === 'y' ? 'e.g. y = 3' : 'e.g. x = 3';
    p.good = [axis + '-' + '(' + k + ')=0', (axis === 'y' ? '0x+' : '') + axis + '=' + k];
    p.bad = [axis === 'y' ? 'x=' + k : 'y=' + k];
    return p;
  }
  /* EP5: lines through P parallel/perpendicular to an axis */
  function throughFields(P0, labels, axes, solPre) {
    var Ts = axes.map(function (a) { return a === 'y' ? { y: P0[1] } : { x: P0[0] }; });
    var opts = axes.map(function (a) { return { wrong: [{ is: a === 'y' ? { y: P0[0] } : { x: P0[1] }, code: 'u7l8-other-coord', hint: (a === 'y' ? 'This line is horizontal: copy the point’s ' + t('y') + '-coordinate.' : 'This line is vertical: copy the point’s ' + t('x') + '-coordinate.') }] }; });
    var p = eqFields('Write the equation of each line through ' + ptt(P0) + '.', labels, Ts, opts,
      (solPre ? solPre + '<br>' : '') + labels.map(function (l, i) { return l + ' ' + (axes[i] === 'y' ? 'horizontal' : 'vertical') + ' → ' + t(axes[i] === 'y' ? 'y=' + P0[1] : 'x=' + P0[0]); }).join('<br>'),
      ['A line parallel to the ' + t('x') + '-axis is horizontal; parallel to the ' + t('y') + '-axis is vertical.', 'Perpendicular to an axis means parallel to the <b>other</b> axis.'], 'through point, axes');
    p.bad = [axes.map(function (a) { return a === 'y' ? 'x=' + P0[0] : 'y=' + P0[1]; })];
    return p;
  }

  HW.defineLesson({
    id: 'u7l8', unit: 7, num: 8, title: 'Graphing Horizontal Lines, Vertical Lines, and Any Form', outcome: 'RF6',
    blurb: 'Horizontal lines y = k (slope 0) and vertical lines x = k (slope undefined), then one strategy for graphing a line in any form: constant, slope–intercept, or two intercepts.',
    questions: [
      /* ---------- Part A ---------- */
      { num: '1', section: 'Part A — Horizontal and vertical lines', stem: function (sh) { return 'Graph ' + t('y=' + sh.k) + ', and state the slope of the line.'; }, shared: function (r) { return { k: r.int(1, 7) }; }, parts: [
        { id: '1a', sub: 'graph', level: 'BEG', make: function (r, sh) { return hvGraph('Graph ' + t('y=' + sh.k) + '.', 'y', sh.k, W8); } },
        { id: '1b', sub: 'slope', level: 'LIM', make: function (r, sh) { return hvSlope('State the slope of ' + t('y=' + sh.k) + '.', 'y', sh.k); } }] },
      { num: '2', stem: function (sh) { return 'Graph ' + t('y=' + sh.k) + ', and state the slope of the line.'; }, shared: function (r) { return { k: -r.int(1, 7) }; }, parts: [
        { id: '2a', sub: 'graph', level: 'BEG', make: function (r, sh) { return hvGraph('Graph ' + t('y=' + sh.k) + '.', 'y', sh.k, W8); } },
        { id: '2b', sub: 'slope', level: 'LIM', make: function (r, sh) { return hvSlope('State the slope of ' + t('y=' + sh.k) + '.', 'y', sh.k); } }] },
      { num: '3', stem: function (sh) { return 'Graph ' + t('x=' + sh.k) + ', and state the slope of the line.'; }, shared: function (r) { return { k: r.int(1, 7) }; }, parts: [
        { id: '3a', sub: 'graph', level: 'BEG', make: function (r, sh) { return hvGraph('Graph ' + t('x=' + sh.k) + '.', 'x', sh.k, W8); } },
        { id: '3b', sub: 'slope', level: 'BEG', make: function (r, sh) { return hvSlope('State the slope of ' + t('x=' + sh.k) + '.', 'x', sh.k); } }] },
      { num: '4', stem: function (sh) { return 'Graph ' + t('x=' + sh.k) + ', and state the slope of the line.'; }, shared: function (r) { return { k: -r.int(1, 7) }; }, parts: [
        { id: '4a', sub: 'graph', level: 'BEG', make: function (r, sh) { return hvGraph('Graph ' + t('x=' + sh.k) + '.', 'x', sh.k, W8); } },
        { id: '4b', sub: 'slope', level: 'BEG', make: function (r, sh) { return hvSlope('State the slope of ' + t('x=' + sh.k) + '.', 'x', sh.k); } }] },
      { num: '5', stem: 'Graph the line.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var k = -r.int(1, 7); return hvGraph(t('y=' + k), 'y', k, W8); } },
        { id: '5b', level: 'BEG', make: function (r) { var k = r.int(1, 7); return hvGraph(t('x=' + k), 'x', k, W8); } },
        { id: '5c', level: 'EMG', make: function (r) { var ax = r.chance(0.7) ? 'y' : 'x'; return hvGraph(t(ax + '=0'), ax, 0, W8); } },
        { id: '5d', level: 'BEG', make: function (r) { var k = -r.int(1, 7); return hvGraph(t('x=' + k), 'x', k, W8); } }] },
      { num: '6', shared: function (r) {
          var m = r.pick(pm(2, 5)), c = r.pick(pm(1, 9)), z = r.chance(0.7) ? 'x' : 'y';
          return { a: -r.int(2, 9), m: m, c: c, cc: r.int(2, 9), z: z };
        },
        stem: function (sh) { return 'For each equation, state whether its graph is horizontal, vertical, or neither. If it is horizontal or vertical, give the coordinates of one point that must lie on it.<br>(a) ' + t('x=' + sh.a) + ' &nbsp;&nbsp; (b) ' + t('y=' + sh.m + 'x' + sg(sh.c)) + ' &nbsp;&nbsp; (c) ' + t('y=' + sh.cc) + ' &nbsp;&nbsp; (d) ' + t(sh.z + '=0'); }, parts: [
        { id: '6a', sub: 'type', level: 'BEG', make: function (r, sh) {
          var rows = [{ id: 'a', html: '(a) ' + t('x=' + sh.a) }, { id: 'b', html: '(b) ' + t('y=' + sh.m + 'x' + sg(sh.c)) }, { id: 'c', html: '(c) ' + t('y=' + sh.cc) }, { id: 'd', html: '(d) ' + t(sh.z + '=0') }];
          var want = { a: 'v', b: 'n', c: 'h', d: sh.z === 'x' ? 'v' : 'h' };
          return KP.grid('Horizontal, vertical, or neither?', rows, [{ id: 'h', html: 'Horizontal' }, { id: 'v', html: 'Vertical' }, { id: 'n', html: 'Neither' }], want, { why: function (row) { return { a: '(a): which letter is fixed? ' + t('x') + ' — so the line is vertical.', b: '(b) has both ' + t('x') + ' and ' + t('y') + ' in it, with slope ' + t(sh.m) + ': it is slanted.', c: '(c): ' + t('y') + ' is fixed, so the line is horizontal.', d: '(d): ' + t(sh.z) + ' is fixed at ' + t('0') + ' — that is the ' + t(sh.z === 'x' ? 'y' : 'x') + '-axis.' }[row]; } },
            '(a) vertical (' + t('x') + ' fixed). (b) neither — slanted, slope ' + t(sh.m) + '. (c) horizontal (' + t('y') + ' fixed). (d) ' + (sh.z === 'x' ? 'vertical — it is the ' + t('y') + '-axis' : 'horizontal — it is the ' + t('x') + '-axis') + '.', ['If the fixed letter is ' + t('x') + ', the line is vertical; if it is ' + t('y') + ', horizontal.'], 'h/v/neither');
        } },
        { id: '6b', sub: 'points', level: 'EMG', make: function (r, sh) {
          var La = vt(sh.a), Lc = hz(sh.cc), Ld = sh.z === 'x' ? vt(0) : hz(0), kd = sh.z === 'x' ? [0, 5] : [5, 0];
          var ph = 'e.g. (2, -1)';
          var p = KP.fields('Give one point that must lie on each horizontal or vertical line.', [{ label: '(a) ' + t('x=' + sh.a) + ':', name: '(a)', mode: 'math', keys: 'u7val', placeholder: ph }, { label: '(c) ' + t('y=' + sh.cc) + ':', name: '(c)', mode: 'math', keys: 'u7val', placeholder: ph }, { label: '(d) ' + t(sh.z + '=0') + ':', name: '(d)', mode: 'math', keys: 'u7val', placeholder: ph }],
            [onBox(La, 'x=' + sh.a), onBox(Lc, 'y=' + sh.cc), onBox(Ld, sh.z + '=0')], [pK([sh.a, 0]), pK([0, sh.cc]), pK(kd)], '(a) e.g. ' + ptt([sh.a, 0]) + ', (c) e.g. ' + ptt([0, sh.cc]) + ', (d) e.g. ' + ptt(kd) + ' — any point with the fixed coordinate works.',
            '(a) every point has ' + t('x=' + sh.a) + ', e.g. ' + ptt([sh.a, 0]) + ' or ' + ptt([sh.a, 3]) + '. (c) every point has ' + t('y=' + sh.cc) + ', e.g. ' + ptt([0, sh.cc]) + '. (d) every point has ' + t(sh.z + '=0') + ', e.g. ' + ptt(kd) + '.', ['Keep the fixed coordinate; the other one can be anything.'], 'points on h/v lines');
          p.good = [[pK([sh.a, 4]), pK([-2, sh.cc]), pK(sh.z === 'x' ? [0, -3] : [-3, 0])]];
          p.bad = [[pK([0, sh.a]), pK([sh.cc, 0]), pK(sh.z === 'x' ? [5, 0] : [0, 5])]];
          return p;
        } }] },
      /* ---------- Part B ---------- */
      { num: '7', section: 'Part B — Choosing and applying a strategy', shared: function (r) { return { m: -r.int(1, 4), b: r.int(1, 6) }; },
        stem: function (sh) { return 'Without altering its form, explain which strategy you would use to graph ' + t('y=' + (sh.m === -1 ? '-' : sh.m) + 'x+' + sh.b) + ', then graph it.'; }, parts: [
        { id: '7a', sub: 'strategy', level: 'BEG', make: function (r, sh) {
          var m = sh.m, b = sh.b;
          return mc(r, 'Which strategy fits best?', [
            { html: 'Slope–intercept: plot the ' + t('y') + '-intercept ' + ptt([0, b]) + ', then step down ' + (-m) + ' and right 1, and join the points.', right: true },
            { html: 'Slope–intercept: plot ' + ptt([b, 0]) + ' on the ' + t('x') + '-axis, then step down ' + (-m) + ' and right 1.', why: t('b=' + b) + ' is the <b>' + t('y') + '-intercept</b>: the line crosses the ' + t('y') + '-axis at ' + ptt([0, b]) + '.' },
            { html: 'Slope–intercept: plot ' + ptt([0, b]) + ', then step up ' + (-m) + ' and right 1.', why: 'The slope is ' + t(m) + ', negative: the line goes <b>down</b> as you move right.' },
            { html: 'Constant: it is a horizontal line through ' + ptt([0, b]) + '.', why: 'The equation has an ' + t('x') + '-term, so the line is slanted, not horizontal.' }],
            t('y=mx+b') + ' hands you ' + t('b=' + b) + ' and ' + t('m=' + m) + ' with no rearranging. Plot ' + ptt([0, b]) + ', then step down ' + (-m) + ', right 1, and join the points.', STRAT, 'strategy y=mx+b');
        } },
        { id: '7b', sub: 'graph', level: 'BEG', make: function (r, sh) { return siGraph('Graph it.', sh.m, sh.b, W8, 'graph y=mx+b'); } }] },
      { num: '8', shared: function (r) { return intLine(r, [1, 2, 3, 4, 5, 6], [-2, -3, -4, -5, -6, -7, -8], function (L) { return L.B >= -3; }); },
        stem: function (sh) { return 'Explain which strategy you would use to graph ' + t(gT(sh.L)) + ' (try the two-intercept method), then graph it.'; }, parts: [
        { id: '8a', sub: 'intercepts', level: 'EMG', outcome: 'RF5', make: function (r, sh) { return intFields('Find both intercepts.', sh.L, sh.p, sh.q); } },
        { id: '8b', sub: 'graph', level: 'EMG', make: function (r, sh) { return intGraph('Graph it.', sh.p, sh.q, W8, 'graph general by intercepts'); } }] },
      { num: '9', stem: function (sh) { return 'Graph the line ' + t('x=' + sh.k) + ', and state its slope.'; }, shared: function (r) { return { k: -r.int(1, 7) }; }, parts: [
        { id: '9a', sub: 'graph', level: 'BEG', make: function (r, sh) { return hvGraph('Graph ' + t('x=' + sh.k) + '.', 'x', sh.k, W8); } },
        { id: '9b', sub: 'slope', level: 'BEG', make: function (r, sh) { return hvSlope('State the slope of ' + t('x=' + sh.k) + '.', 'x', sh.k); } }] },
      { num: '10', shared: function (r) {
          var o = pickWhere(function () { var p = r.int(2, 8), q = r.int(1, 6), L = thru([p, 0], [0, q]), g = r.pick([1, 2, 3]); return { p: p, q: q, L: L, g: g }; }, function (o) { return o.p !== o.q && Math.max(o.L.A, o.L.B, -o.L.C) * o.g <= 15 && (o.g > 1 || o.L.B > 1); });
          o.S = scaled(o.L, o.g); return o;
        },
        stem: function (sh) { return 'Use the two-intercept method to find both intercepts of ' + t(gT(sh.S)) + ', then graph the line.'; }, parts: [
        { id: '10a', sub: 'intercepts', level: 'EMG', outcome: 'RF5', make: function (r, sh) { return intFields('Find both intercepts.', sh.S, sh.p, sh.q); } },
        { id: '10b', sub: 'graph', level: 'EMG', make: function (r, sh) { return intGraph('Graph the line.', sh.p, sh.q, W8, 'graph general by intercepts', sh.S); } }] },
      { num: '11', stem: 'Graph each equation, choosing whichever strategy is most efficient for its form.', parts: [
        { id: '11a', level: 'BEG', make: function (r) { var m = r.pick(pm(1, 3)), b = r.pick(pm(1, 5)); return siGraph(t(si(mb(m, b))), m, b, W8, 'graph y=mx+b'); } },
        { id: '11b', level: 'BEG', make: function (r) { var k = -r.int(1, 7); return hvGraph(t('y=' + k), 'y', k, W8); } },
        { id: '11c', level: 'BEG', make: function (r) { var k = r.int(1, 7); return hvGraph(t('x=' + k), 'x', k, W8); } },
        { id: '11d', level: 'PRG', make: function (r) {
          var s = intLine(r, [1, 2, -1, -2], pm(2, 8), function (L) { return Math.abs(L.B) === 1; });
          return intGraph(t(gT(s.L)), s.p, s.q, W8, 'graph general (any strategy)');
        } }] },
      /* ---------- Part C ---------- */
      { num: '12', section: 'Part C — Multiple choice and numerical response', parts: [
        { id: '12', level: 'BEG', make: function (r) {
          var k = r.int(2, 7), j = r.int(2, 6), m = r.int(2, 4);
          return mc(r, '<i>(Multiple Choice)</i> Which equation graphs as a <b>vertical</b> line?', [
            { html: t('y=' + k), why: t('y=' + k) + ' keeps ' + t('y') + ' fixed: a horizontal line.' },
            { html: t('x=-' + j), right: true },
            { html: t('y=' + m + 'x'), why: 'That has an ' + t('x') + '-term with slope ' + t(m) + ': a slanted line.' },
            { html: t('y=x-' + j), why: 'That has slope ' + t('1') + ': a slanted line.' }],
            'A vertical line keeps ' + t('x') + ' fixed and has no ' + t('y') + ': only ' + t('x=-' + j) + ' has that form.', ['Which equation has only ' + t('x') + ' in it?'], 'MC vertical', true);
        } }] },
      { num: '13', parts: [
        { id: '13', level: 'EMG', make: function (r) {
          var P0 = pickWhere(function () { return [r.int(2, 8), -r.int(2, 9)]; }, function (p) { return Math.abs(p[0]) !== Math.abs(p[1]); });
          return mc(r, '<i>(Multiple Choice)</i> Which equation represents the <b>horizontal</b> line passing through ' + ptt(P0) + '?', [
            { html: t('x=' + P0[0]), why: 'That is the <b>vertical</b> line through the point.' },
            { html: t('y=' + P0[1]), right: true },
            { html: t('y=' + P0[0]), why: 'A horizontal line keeps ' + t('y') + ' fixed — use the ' + t('y') + '-coordinate, ' + t(P0[1]) + '.' },
            { html: t('x=' + P0[1]), why: 'That is vertical, and it uses the wrong coordinate.' }],
            'Horizontal means the ' + t('y') + '-coordinate is held fixed. At ' + ptt(P0) + ' that value is ' + t(P0[1]) + ', so ' + t('y=' + P0[1]) + '.', ['Which coordinate does a horizontal line keep fixed?'], 'MC horizontal through point', true);
        } }] },
      { num: '14', outcome: 'RF5', parts: [
        { id: '14', level: 'EMG', make: function (r) {
          var A = r.int(2, 6), k = r.int(1, 4), C = A * k;
          return mc(r, '<i>(Multiple Choice)</i> A line has general form ' + t(A + 'x-y+' + C + '=0') + '. Its ' + t('x') + '-intercept is', [
            { html: t(-k), right: true },
            { html: t(k), why: 'Set ' + t('y=0') + ': ' + t(A + 'x+' + C + '=0') + ', so ' + t(A + 'x=-' + C) + ' — watch the sign.' },
            { html: t(-C), why: 'Divide by the coefficient of ' + t('x') + ': ' + t(A + 'x=-' + C) + '.' },
            { html: t(C), why: 'That is the ' + t('y') + '-intercept (from ' + t('x=0') + '). For the ' + t('x') + '-intercept set ' + t('y=0') + '.' }],
            'Set ' + t('y=0') + ': ' + t(A + 'x-0+' + C + '=0') + ', so ' + t(A + 'x=-' + C) + ' and ' + t('x=' + (-k)) + '. Check: ' + t(A + '(' + (-k) + ')+' + C + '=0') + ' ✓', ['At the ' + t('x') + '-intercept, ' + t('y=0') + '.'], 'MC x-int', true);
        } }] },
      { num: '15', parts: [
        { id: '15', level: 'BEG', make: function (r) {
          var k = r.int(1, 9), y0 = -r.int(2, 9);
          return KP.nr('<i>(Numerical Response)</i> The vertical line passing through ' + ptt([k, y0]) + ' has equation ' + t('x=k') + '. The value of ' + t('k') + ' is ________.', k, function (v) {
            if (v === y0 || v === -y0) return { code: 'u7l8-other-coord', hint: 'A vertical line keeps ' + t('x') + ' fixed: copy the point’s ' + t('x') + '-coordinate.' };
            return null;
          }, 'A vertical line holds ' + t('x') + ' fixed, and the point’s ' + t('x') + '-coordinate is ' + t(k) + ', so ' + t('x=' + k) + ' and ' + t('k=' + k) + '.', ['Which coordinate stays the same on a vertical line?'], 'NR vertical through point');
        } }] },
      { num: '16', parts: [
        { id: '16', level: 'PRG', make: function (r) {
          var o = pickWhere(function () { return { B: r.pick([2, 3]), m: r.int(1, 4), b: r.int(1, 6) }; }, function (o) { return o.m !== o.b; });
          var A = o.B * o.m, C = o.B * o.b, ans = o.m + o.b;
          return KP.nr('<i>(Numerical Response)</i> The equation ' + t(A + 'x-' + o.B + 'y+' + C + '=0') + ' is rewritten in slope–intercept form ' + t('y=mx+b') + '. The value of ' + t('m+b') + ' is ________.', ans, function (v) {
            if (v === A + C) return { code: 'l5-nodiv', hint: 'After moving the terms, divide <b>every</b> term by the coefficient of ' + t('y') + ', ' + t(-o.B) + '.' };
            if (v === Math.abs(o.m - o.b)) return { code: 'l5-c-sign', hint: 'Check the sign of one of the terms: ' + t('-' + o.B + 'y=-' + A + 'x-' + C) + ', then divide every term by ' + t(-o.B) + '.' };
            return null;
          }, t(A + 'x-' + o.B + 'y+' + C + '=0') + ' → ' + t('-' + o.B + 'y=-' + A + 'x-' + C) + ' → ' + t('y=' + (o.m === 1 ? '' : o.m) + 'x+' + o.b) + '. So ' + t('m=' + o.m) + ', ' + t('b=' + o.b) + ' and ' + t('m+b=' + ans) + '.', ['Get the ' + t('y') + '-term alone, then divide every term by its coefficient.'], 'NR m+b');
        } }] }
    ],
    extra: EXTRA
  });
})(window);
