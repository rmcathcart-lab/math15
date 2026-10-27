/* Math 15 · Unit 5 · Lesson 1 — The Cartesian Plane and Plotting Points (RF2)
 * Assignment 1 (u5_L01.tex, Questions 1–15) and the Lesson 1 Extra Practice (u5_EP01.tex, Questions 1–18).
 * Every part is a generator: same structure and idea as the booklet question (the booklet's own points are among the
 * possible values), new points from the seed. Model: Math 10C u5l1.js (grid of lettered points, ordered-pair answers,
 * quadrant tables, plot-and-join on the graph pad).
 * Questions 2–7 each show their own lettered grid (the booklet uses one grid for all six; here every question draws a
 * fresh grid with the same layout: A and B share a y-coordinate, G and H share an x-coordinate, E is on the y-axis,
 * F on the x-axis).
 * Conversions: "plot and join" -> the graph pad (╱ Line tool); "what shape / explain / describe" -> multiple choice whose
 * options are reasons; "which points" -> tap the letters; quadrant lists -> a table of choices; "give an example" -> any
 * correct ordered pair is accepted.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 15(b) (every fourth vertex of a parallelogram) and
 * Extra 18(b) (counting the lattice points on the axes). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var DR = HW.draw;

  HW.addCodes({
    'pair-format': 'Ordered pair not written as (x, y)', 'pair-brackets': 'Ordered pair without brackets', 'pair-swap': 'Coordinates in the wrong order',
    'pair-sign': 'Sign of a coordinate wrong', 'pair-value': 'Wrong coordinates', 'wrong-point': 'Named the wrong point', 'no-point': 'Named a point that isn’t there', letter: 'Not a point letter',
    'quad-clockwise': 'Numbered the quadrants clockwise', 'quad-sign': 'Wrong quadrant (signs)', 'poly-join': 'Plotted the points but didn’t join them', 'poly-edge': 'A segment of the figure is missing',
    'poly-extra': 'Joined points out of order', missed: 'Missed one of the points', 'picked-quadrant': 'Picked a point that is inside a quadrant', 'same-y': 'Mixed up x- and y-coordinates',
    extra: 'Picked an extra item', set: 'Wrong selection',
    'u5l1-axis-swap': 'Named the x-axis for the y-axis (or reverse)', 'u5l1-axis-quad': 'Put a point on an axis in a quadrant', 'u5l1-quad-axis': 'Put a point in a quadrant on an axis',
    'u5l1-zero': 'Used 0 in an example (point on an axis)', 'u5l1-not-int': 'Example not made of integers', 'u5l1-area-perim': 'Gave the area for the perimeter (or reverse)',
    'u5l1-half-perim': 'Added only two sides for the perimeter', 'u5l1-count-dots': 'Counted grid points instead of units', 'u5l1-no-half': 'Forgot the ½ in a triangle or trapezoid area',
    'u5l1-add-legs': 'Added the legs instead of using the Pythagorean theorem', 'u5l1-mid-diff': 'Gave half the difference instead of the midpoint', 'u5l1-mid-sum': 'Added the coordinates without halving',
    'u5l1-mid-back': 'Gave the midpoint instead of the other endpoint', 'u5l1-back-half': 'Moved only half the distance past the midpoint', 'u5l1-refl-axis': 'Reflected in the wrong axis',
    'u5l1-refl-both': 'Changed both signs for a reflection in one axis', 'u5l1-refl-none': 'Point not reflected', 'u5l1-fourth': 'Fourth vertex wrong', 'u5l1-par-missing': 'Missed a possible fourth vertex',
    'u5l1-par-extra': 'Listed a point that doesn’t make a parallelogram', 'u5l1-grid-count': 'Counted the grid points wrong', 'u5l1-axis-double': 'Counted the origin twice',
    'u5l1-axis-noorigin': 'Left the origin out of the axis count', 'u5l1-q3-edge': 'Counted points on the axes as Quadrant III', 'u5l1-sq-quads': 'Wrong quadrants for a figure'
  });
  HW.addPartial({ 'u5l1-axis-swap': 's', 'u5l1-axis-quad': 'b', 'u5l1-quad-axis': 'b', 'u5l1-zero': 'n', 'u5l1-not-int': 's', 'u5l1-area-perim': 'n', 'u5l1-half-perim': 'b',
    'u5l1-count-dots': 's', 'u5l1-no-half': 'b', 'u5l1-add-legs': 'n', 'u5l1-mid-diff': 'b', 'u5l1-mid-sum': 'b', 'u5l1-mid-back': 'n', 'u5l1-back-half': 'b', 'u5l1-refl-axis': 'b',
    'u5l1-refl-both': 'b', 'u5l1-refl-none': 'n', 'u5l1-fourth': 'n', 'u5l1-par-missing': 'b', 'u5l1-par-extra': 'n', 'u5l1-grid-count': 'n', 'u5l1-axis-double': 's',
    'u5l1-axis-noorigin': 's', 'u5l1-q3-edge': 'b', 'u5l1-sq-quads': 's' });

  /* ---------- small helpers ---------- */
  function feq(a, b) { return Math.abs(a - b) < 1e-9; }
  function num(x) { return String(Math.round(x * 1e6) / 1e6); }
  function pt(p) { return '(' + num(p[0]) + ', ' + num(p[1]) + ')'; }
  function quadOf(p) { return p[0] === 0 || p[1] === 0 ? null : p[0] > 0 ? (p[1] > 0 ? 'I' : 'IV') : (p[1] > 0 ? 'II' : 'III'); }
  function placeOf(p) { return p[0] === 0 && p[1] === 0 ? 'O' : p[0] === 0 ? 'ya' : p[1] === 0 ? 'xa' : quadOf(p); }
  var QSIGN = { I: '(+, +)', II: '(-, +)', III: '(-, -)', IV: '(+, -)' };
  var SG = { I: [1, 1], II: [-1, 1], III: [-1, -1], IV: [1, -1] };
  var QOPT = ['I', 'II', 'III', 'IV'];
  var PLACE = { I: 'Quadrant I', II: 'Quadrant II', III: 'Quadrant III', IV: 'Quadrant IV', xa: 'on the \\(x\\)-axis', ya: 'on the \\(y\\)-axis', O: 'at the origin' };
  var SIGNS = 'I ' + t('(+,+)') + ', II ' + t('(-,+)') + ', III ' + t('(-,-)') + ', IV ' + t('(+,-)');
  function sgnWord(v) { return v > 0 ? 'positive' : 'negative'; }
  function mcCols(p) { p.input.columns = 2; return p; }
  function moveWords(p) {
    var a = p[0] === 0 ? 'stay on the ' + t('y') + '-axis' : 'move ' + Math.abs(p[0]) + ' ' + (p[0] > 0 ? 'right' : 'left');
    var b = p[1] === 0 ? 'stay on the ' + t('x') + '-axis' : Math.abs(p[1]) + ' ' + (p[1] > 0 ? 'up' : 'down');
    return a + ', then ' + b;
  }
  function placeWhy(p) { // why a point is where it is
    var w = placeOf(p);
    if (w === 'O') return t(pt(p)) + ' is the origin: it is on both axes, in no quadrant.';
    if (w === 'ya') return t('x=0') + ', so ' + t(pt(p)) + ' hasn’t moved left or right: it is <b>on the ' + t('y') + '-axis</b> (in no quadrant).';
    if (w === 'xa') return t('y=0') + ', so ' + t(pt(p)) + ' hasn’t moved up or down: it is <b>on the ' + t('x') + '-axis</b> (in no quadrant).';
    return t('x') + ' is ' + sgnWord(p[0]) + ' and ' + t('y') + ' is ' + sgnWord(p[1]) + ': ' + t(QSIGN[w]) + ', <b>Quadrant ' + w + '</b>.';
  }
  function nz(r, lo, hi) { return r.pick([1, -1]) * r.int(lo, hi); }

  /* ---- one ordered pair (x, y), typed as (3, -2) or C(3, -2) ---- */
  function readPair(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\[,;:! ]|~/g, '').replace(/−/g, '-').replace(/\\lbrace|\\rbrace|\\\{|\\\}/g, '').replace(/\s+/g, '');
    if (/^\{.*\}$/.test(s) && !/^\{[^{}]*\}\{/.test(s)) s = s.slice(1, -1); // a pair typed inside plain set braces
    if (!s) return { empty: true };
    s = s.replace(/^[A-Za-z]'?=?(?=\()/, '');
    var m = /^\((.*)\)$/.exec(s), inner = m ? m[1] : s, bits = inner.split(',');
    if (bits.length !== 2 || !bits[0] || !bits[1]) return { bad: true };
    var a = ex.parse(bits[0]), b = ex.parse(bits[1]);
    if (!a.ok || !b.ok) return { bad: true };
    var x = ex.value(a.ast), y = ex.value(b.ast);
    if (!isFinite(x) || !isFinite(y)) return { bad: true };
    return { x: x, y: y, parens: !!m };
  }
  function pairCheck(x, y, diag) {
    return function (resp) {
      var p = readPair(resp);
      if (p.empty) return form('empty', 'Type the ordered pair first.');
      if (p.bad) return form('pair-format', 'Write the point as an ordered pair in brackets, ' + t('(x, y)') + ', for example ' + t('(3, -2)') + '.');
      if (feq(p.x, x) && feq(p.y, y)) return p.parens ? ok() : form('pair-brackets', 'Right numbers — now write them as an ordered pair in brackets: ' + t('(x, y)') + '.');
      var h = diag ? diag(p.x, p.y) : null; if (h) return wrong(h.code, h.hint);
      if (feq(p.x, y) && feq(p.y, x)) return wrong('pair-swap', 'Your numbers are in the wrong order. An ordered pair lists the <b>x</b>-coordinate (across) first, then the <b>y</b>-coordinate (up or down).');
      if ((feq(Math.abs(p.x), Math.abs(x)) && feq(Math.abs(p.y), Math.abs(y))) || (feq(Math.abs(p.x), Math.abs(y)) && feq(Math.abs(p.y), Math.abs(x))))
        return wrong('pair-sign', 'Check the signs: left of the ' + t('y') + '-axis, ' + t('x') + ' is negative; below the ' + t('x') + '-axis, ' + t('y') + ' is negative.');
      return wrong('pair-value', null);
    };
  }
  function pairPart(prompt, x, y, diag, sol, hints, text, bad) {
    return { prompt: prompt, input: { type: 'math', keys: 'pairs', placeholder: 'e.g. (3, -2)' }, check: pairCheck(x, y, diag), key: pt([x, y]), answer: t(pt([x, y])),
      solution: sol, hints: hints || [], text: text, good: ['\\left(' + x + ',' + y + '\\right)', 'P(' + x + ',' + y + ')'], bad: [pt([y, x]) === pt([x, y]) ? pt([x + 1, y]) : pt([y, x])].concat(bad || []) };
  }
  function pairField(label) { return { label: label, name: label, mode: 'math', keys: 'pairs', placeholder: '(x, y)' }; }
  function letterCheck(want, pts) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').replace(/point/ig, '').replace(/[\s.()]/g, '').toUpperCase();
      if (!s) return form('empty', 'Type the letter of the point.');
      if (!/^[A-Z]$/.test(s)) return form('letter', 'Answer with the <b>letter</b> that names the point, for example ' + t('A') + '.');
      if (s === want) return ok();
      var q = pts[s], w = pts[want];
      if (!q) return form('no-point', 'There is no point ' + t(s) + ' on this grid — check the letter.');
      if (q[0] === w[1] && q[1] === w[0]) return wrong('pair-swap', 'Point ' + t(s) + ' is at ' + t(pt(q)) + ' — the numbers the other way round. Move along the ' + t('x') + '-axis first, then up or down.');
      return wrong('wrong-point', 'Point ' + t(s) + ' is at ' + t(pt(q)) + '. For ' + t(pt(w)) + ', start at the origin and ' + moveWords(w) + '.');
    };
  }
  function selectPart(prompt, opts, want, diag, sol, hints, text, html) {
    return { prompt: prompt, input: { type: 'select', options: opts.map(function (o) { return { value: o, html: html ? html(o) : t(o) }; }) }, check: K.selectSet(want, diag), key: want,
      answer: want.map(function (o) { return html ? html(o) : t(o); }).join(', '), solution: sol, hints: hints || [], text: text, bad: [opts.filter(function (o) { return want.indexOf(o) < 0; }).slice(0, 2)] };
  }
  function numPart(prompt, ans, diag, sol, hints, text, inp) { var p = KP.number(prompt, ans, diag, sol, hints, text, inp); p.answer = t(num(ans)) + (inp && inp.after ? ' ' + inp.after : ''); return p; }

  /* ---------- drawing parts (graph pad) ---------- */
  function gv(pts, pieces, join) { return { pts: pts || [], pieces: pieces || [], join: join || 'none' }; }
  function exactChk(target, opt) {
    var base = K.graphExact(target, opt);
    return function (resp) { if (!DR.empty(resp) && DR.same(resp, target)) return ok(); return base(resp); };
  }
  function drawPart(prompt, inp, check, key, sol, hints, text, bad) {
    var p = KP.graph(prompt, inp, check, key, sol, hints, text);
    p.bad = (bad || []).filter(function (b) { return !DR.same(b, key); });
    return p;
  }
  function pointsDiag(tp) { // a plotted point at the right x but the wrong y
    return function (resp) {
      var S = DR.norm(resp);
      for (var i = 0; i < tp.length; i++) {
        var p = tp[i], at = S.pts.filter(function (q) { return feq(q[0], p[0]); });
        if (at.length && !at.some(function (q) { return feq(q[1], p[1]); })) return 'Check your point at ' + t('x=' + p[0]) + ': it goes at ' + t(pt(p)) + ' — ' + moveWords(p) + '.';
      }
      return null;
    };
  }
  function plotPointsPart(prompt, tp, xr, yr, sol, hints, text) {
    var target = gv(tp), base = exactChk(target), diag = pointsDiag(tp);
    var check = function (resp) { var res = base(resp); if (res.v === 'wrong' && (!res.hint || res.code === 'graph-points')) { var h = diag(resp); if (h) return wrong('graph-points', h); } return res; };
    return drawPart(prompt, { x: xr, y: yr, labels: 1, mode: 'points' }, check, target, sol, hints, text, [gv(tp.map(function (p) { return [p[1], p[0]]; })), gv(tp.slice(1))]);
  }
  /* plot the vertices v in order and join them, closing the figure (the 10C plot-and-join check) */
  function polyPart(prompt, v, xr, yr, sol, hints, text, closed) {
    closed = closed !== false;
    var path = closed ? v.concat([v[0]]) : v, n = v.length, target = gv([], [{ v: path, s: 'closed', e: 'closed' }]), base = exactChk(target);
    var check = function (resp) {
      var res = base(resp); if (res.v !== 'wrong' || res.code === 'graph-swap') return res;
      var S = DR.norm(resp);
      if (!S.pieces.length) return wrong('poly-join', 'Now join the points: use <b>╱ Line</b> and tap each point in order' + (closed ? ', ending back at ' + t(pt(v[0])) : '') + '.');
      for (var i = 0; i < (closed ? n : n - 1); i++) {
        var a = v[i], b = v[(i + 1) % n];
        if (!DR.contains(resp, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])) return wrong('poly-edge', 'The segment from ' + t(pt(a)) + ' to ' + t(pt(b)) + ' is missing' + (closed && i === n - 1 ? ' — join the last point back to the first one.' : '. Check that both points are in the right place.'));
      }
      return wrong('poly-extra', 'Your drawing has a segment (or point) that isn’t on the path. Join each point only to the <b>next</b> one in the list.');
    };
    var bad = [gv(v), gv([], [{ v: v, s: 'closed', e: 'closed' }]), gv([], [{ v: path.map(function (p) { return [p[1], p[0]]; }), s: 'closed', e: 'closed' }])];
    return drawPart(prompt + ' (Use <b>╱ Line</b>: tap the points one after another, then tap the last one again to finish.)', { x: xr, y: yr, labels: 1, tools: ['line', 'point'] }, check, target, sol, hints, text, bad);
  }
  function figGraph(v, xr, yr, labels, extra) {
    var spec = Object.assign({ x: xr, y: yr, labels: 2, max: 260, segs: [{ pts: v.concat([v[0]]) }], aria: 'the figure on the grid' }, extra || {});
    if (labels) return labelledGraph(spec, v.map(function (p, i) { return { x: p[0], y: p[1], label: labels[i] }; }));
    spec.points = v.map(function (p) { return { x: p[0], y: p[1] }; });
    return HW.graph(spec);
  }
  function rangeOf(vs, pad, minR) { var xs = vs.map(function (p) { return p[0]; }), ys = vs.map(function (p) { return p[1]; }); var lo = Math.min.apply(null, xs.concat(ys)) - pad, hi = Math.max.apply(null, xs.concat(ys)) + pad; lo = Math.min(lo, -minR); hi = Math.max(hi, minR); return [lo, hi]; }

  /* ---------- Q1 vocabulary ---------- */
  var VOCAB = ['x-axis', 'y-axis', 'origin', 'ordered pair', 'quadrants', 'coordinates'];
  var WHY = { 'x-axis': 'The ' + t('x') + '-axis is the <b>horizontal</b> number line.', 'y-axis': 'The ' + t('y') + '-axis is the <b>vertical</b> number line.', origin: 'The origin is the single point ' + t('(0, 0)') + ' where the axes cross.',
    'ordered pair': 'An ordered pair is the two numbers ' + t('(x, y)') + ' that locate one point.', quadrants: 'The quadrants are the four regions the axes cut the plane into.', coordinates: 'The coordinates are the two numbers in an ordered pair, one at a time.' };
  function lab(w) { return w.replace(/^x-/, '\\(x\\)-').replace(/^y-/, '\\(y\\)-'); }
  function vocabPart(r, sentences, right, sol, text) {
    var others = r.sample(VOCAB.filter(function (w) { return w !== right; }), 3);
    return KP.mc(r, r.pick(sentences), [{ html: lab(right), right: true }].concat(others.map(function (w) { return { html: lab(w), why: WHY[w] + ' Read the sentence again with that word in the blank.' }; })), sol,
      ['Look back at the vocabulary in the notes: ' + t('x') + '-axis, ' + t('y') + '-axis, origin, quadrants, ordered pair.'], text);
  }

  /* ---------- Q2–Q7 the lettered grid ---------- */
  /* a graph whose point letters are placed where they touch nothing (HW.graph always puts them up-right of the dot,
   * which collides with the axis numbers when a point is one unit from an axis) */
  function labelledGraph(spec, pts) { // pts: [{ x, y, label }]
    spec.points = pts.map(function (p) { return { x: p.x, y: p.y }; });
    var svg = HW.graph(spec), L = HW.graph.last, X = L.X, Y = L.Y, obs = [], out = '';
    var hit = function (a, b) { return a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]; };
    var x0 = Math.max(L.xr[0], Math.min(L.xr[1], 0)), y0 = Math.max(L.yr[0], Math.min(L.yr[1], 0)), lx = spec.labelsX || spec.labels || 2, ly = spec.labelsY || spec.labels || 2;
    pts.forEach(function (p) { obs.push([X(p.x) - 5, Y(p.y) - 5, X(p.x) + 5, Y(p.y) + 5]); });
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
  function gridShared(r) {
    var P0, pts;
    for (var tries = 0; tries < 600; tries++) {
      var k = r.int(4, 6), gx = -r.int(1, 3), gy = -r.int(3, 5);
      P0 = { A: [-r.int(4, 6), k], B: [r.int(1, 4), k], C: [r.int(3, 6), r.int(2, 4)], D: [r.int(5, 6), -r.int(1, 3)], E: [0, r.int(3, 6)], F: [-r.int(2, 5), 0],
        G: [gx, gy], H: [gx, gy - 1], J: [r.int(2, 5), -r.int(3, 5)] };
      if (tries === 0 && r.chance(0.25)) P0 = { A: [-5, 6], B: [2, 6], C: [5, 3], D: [6, -2], E: [0, 5], F: [-3, 0], G: [-1, -5], H: [-1, -6], J: [4, -4] }; // the booklet's grid (no point I, so it can't be mistaken for Quadrant I)
      var L = Object.keys(P0), xs = L.filter(function (q) { return q !== 'H'; }).map(function (q) { return P0[q][0]; }), ys = L.filter(function (q) { return q !== 'B'; }).map(function (q) { return P0[q][1]; });
      var uniq = function (a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }).length === a.length; };
      var sx = tries ? (r.chance(0.6) ? 1 : -1) : 1, sy = tries ? (r.chance(0.7) ? 1 : -1) : 1;
      pts = {}; L.forEach(function (q) { pts[q] = [P0[q][0] * sx || 0, P0[q][1] * sy || 0]; });
      if (uniq(xs) && uniq(ys)) break;
    }
    return { pts: pts, letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'] };
  }
  function gridGraph(sh) {
    return labelledGraph({ x: [-7, 7], y: [-7, 7], labels: 1, max: 400, aria: 'grid with points A to H and J' }, sh.letters.map(function (L) { return { x: sh.pts[L][0], y: sh.pts[L][1], label: L }; }));
  }
  function gridStem(intro) { return function (sh) { return (intro ? intro + '<br>' : '') + gridGraph(sh); }; }
  function quadPoints(sh) { return sh.letters.filter(function (L) { return quadOf(sh.pts[L]); }); }

  /* ---------- Q8 / Q9 figures ---------- */
  function rectShared(r) {
    var w, h; do { w = r.int(2, 5); h = r.int(2, 5); } while (w === h);
    if (r.chance(0.25)) { w = 5; h = 4; }
    var sx = r.chance(0.65) ? 1 : -1, sy = r.chance(0.65) ? 1 : -1;
    var v = [[0, 0], [sx * w, 0], [sx * w, sy * h], [0, sy * h]];
    return { v: v, w: w, h: h };
  }
  function triShared(r) {
    var a, b, c, ax;
    do { a = r.int(2, 4); b = -r.int(1, 4); c = r.int(1, 4); ax = r.pick([0, 0, 0, -1, 1]); } while (c - b < 3);
    if (r.chance(0.25)) { a = 3; b = -2; c = 3; ax = 0; }
    var flip = r.chance(0.25) ? -1 : 1;
    return { v: [[-a, b * flip], [a, b * flip], [ax, c * flip]] };
  }

  /* ---------- Q10 / Q14 / Q15 quadrant choices ---------- */
  function placeMC(r, p, prompt, sol, hints, text) {
    var w = placeOf(p), all = ['I', 'II', 'III', 'IV', 'xa', 'ya'];
    var why = function (o) {
      if (w === 'xa' || w === 'ya') {
        if (o === 'xa' || o === 'ya') return 'Which coordinate is ' + t('0') + '? ' + (w === 'ya' ? t('x=0') + ' means the point hasn’t moved left or right — that is the ' + t('y') + '-axis.' : t('y=0') + ' means the point hasn’t moved up or down — that is the ' + t('x') + '-axis.');
        return 'One coordinate is ' + t('0') + ', so the point sits <b>on an axis</b> — a point on an axis is in no quadrant.';
      }
      if (o === 'xa' || o === 'ya') return 'Neither coordinate is ' + t('0') + ', so the point is not on an axis — it is inside a quadrant.';
      if ((w === 'II' && o === 'IV') || (w === 'IV' && o === 'II')) return 'The quadrants are numbered <b>counter-clockwise</b>, starting with I at the top right: ' + SIGNS + '.';
      return 'Quadrant ' + o + ' has signs ' + t(QSIGN[o]) + '. Look at the signs of ' + t(pt(p)) + '.';
    };
    var pool = all.filter(function (o) { return o !== w; }), dist;
    if (w === 'xa' || w === 'ya') { var other = w === 'xa' ? 'ya' : 'xa', near = p[0] + p[1] > 0 ? (w === 'xa' ? ['I', 'IV'] : ['I', 'II']) : (w === 'xa' ? ['II', 'III'] : ['III', 'IV']); dist = [other].concat(near); }
    else { var opp = { I: 'III', II: 'IV', III: 'I', IV: 'II' }[w]; dist = r.sample(pool.filter(function (o) { return o !== 'xa' && o !== 'ya'; }), 2).concat([r.pick(['xa', 'ya'])]); if (dist.indexOf(opp) < 0 && r.chance(0.3)) dist[0] = opp; }
    var opts = [w].concat(dist).map(function (o) { return { html: PLACE[o], right: o === w, why: o === w ? null : why(o), code: o === w ? null : (o === 'xa' || o === 'ya' ? (w === 'xa' || w === 'ya' ? 'axis-swap' : 'quad-axis') : (w === 'xa' || w === 'ya') ? 'axis-quad' : 'quad') }; });
    opts.sort(function (a, b) { return all.indexOf(a.html) - all.indexOf(b.html); });
    var order = ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV', PLACE.xa, PLACE.ya];
    opts.sort(function (a, b) { return order.indexOf(a.html) - order.indexOf(b.html); });
    return mcCols(KP.mc(r, prompt, opts, sol || placeWhy(p), hints || ['Look at the signs: ' + SIGNS + '. A ' + t('0') + ' puts the point on an axis.'], text, true));
  }

  /* ---------- Q11 an example in a quadrant ---------- */
  function examplePart(q) {
    var sg = SG[q], ex0 = [sg[0], sg[1]];
    return { prompt: 'Give one example of an ordered pair (using <b>non-zero integers</b>) that lies in <b>Quadrant ' + q + '</b>.', input: { type: 'math', keys: 'pairs', placeholder: 'e.g. (3, -2)' },
      key: pt(ex0), answer: 'Any pair with signs ' + t(QSIGN[q]) + ', e.g. ' + t(pt(ex0)), text: 'example in Q' + q,
      good: [pt([sg[0] * 4, sg[1] * 7]), pt([sg[0] * 12, sg[1] * 3])], bad: [pt([-sg[0], sg[1]]), pt([sg[0], 0]), pt([sg[1], sg[0]]) === pt(ex0) ? pt([-sg[0], -sg[1]]) : pt([sg[1], sg[0]])],
      check: function (resp) {
        var p = readPair(resp);
        if (p.empty) return form('empty', 'Type an ordered pair first.');
        if (p.bad) return form('pair-format', 'Write the point as an ordered pair in brackets, ' + t('(x, y)') + '.');
        if (!p.parens) return form('pair-brackets', 'Write it as an ordered pair in brackets: ' + t('(x, y)') + '.');
        if (p.x === 0 || p.y === 0) return wrong('u5l1-zero', 'A ' + t('0') + ' puts the point on an axis, and a point on an axis is in no quadrant. Use non-zero numbers.');
        if (Math.round(p.x) !== p.x || Math.round(p.y) !== p.y) return form('u5l1-not-int', 'Use integers (whole numbers and their negatives) for this one.');
        var got = quadOf([p.x, p.y]);
        if (got === q) return ok();
        if ((q === 'II' && got === 'IV') || (q === 'IV' && got === 'II')) return wrong('quad-clockwise', t(pt([p.x, p.y])) + ' is in Quadrant ' + got + '. The quadrants go <b>counter-clockwise</b> from the top right: ' + SIGNS + '.');
        return wrong('quad-sign', t(pt([p.x, p.y])) + ' is in Quadrant ' + got + ', with signs ' + t(QSIGN[got]) + '. Quadrant ' + q + ' needs ' + t(QSIGN[q]) + '.');
      },
      solution: 'Quadrant ' + q + ' points have signs ' + t(QSIGN[q]) + ': ' + t('x') + ' ' + sgnWord(sg[0]) + ', ' + t('y') + ' ' + sgnWord(sg[1]) + '. For example ' + t(pt(ex0)) + ', ' + t(pt([sg[0] * 3, sg[1] * 7])) + ' or ' + t(pt([sg[0] * 5, sg[1] * 2])) + ' — any of them is right.',
      hints: ['Quadrant ' + q + ' has signs ' + t(QSIGN[q]) + '. Pick any two non-zero numbers with those signs.'] };
  }

  /* ---------- Q12 points that line up ---------- */
  function lineShared(r) {
    for (var g = 0; g < 500; g++) {
      var d = r.pick([1, 2, 2]), x0 = r.int(-4, -1), m = r.pick([1, 1, -1, 2, -2]), c = r.int(-3, 3);
      var xs = [0, 1, 2, 3].map(function (i) { return x0 + d * i; }), ys = xs.map(function (x) { return m * x + c; });
      var ok2 = xs.concat(ys).every(function (v) { return v !== 0 && Math.abs(v) <= 5; });
      if (!ok2) continue;
      var qs = xs.map(function (x, i) { return quadOf([x, ys[i]]); }).filter(function (q, i, a) { return a.indexOf(q) === i; });
      if (qs.length < 2) continue;
      var pts = xs.map(function (x, i) { return [x, ys[i]]; }), straight = true;
      if (r.chance(0.2)) { var k = r.pick([1, 2]), dy = r.pick([1, -1, 2, -2]), ny = pts[k][1] + dy; if (ny !== 0 && Math.abs(ny) <= 5) { pts[k] = [pts[k][0], ny]; straight = false; } }
      return { pts: pts, straight: straight, m: m, c: c, d: d };
    }
    return { pts: [[-3, -1], [-1, 1], [1, 3], [3, 5]], straight: true, m: 1, c: 2, d: 2 };
  }

  var QUESTIONS = [
    /* ===================== Part A ===================== */
    { num: '1', section: 'Part A — Vocabulary', stem: 'Fill in each blank.', parts: [
      { id: '1a', level: 'LIM', make: function (r) { return vocabPart(r, ['The horizontal number line on a Cartesian plane is called the ______.', 'On a Cartesian plane, the number line that runs left to right is called the ______.', 'The ______ is the horizontal axis of a Cartesian plane.'], 'x-axis', 'The horizontal number line is the <b>' + t('x') + '-axis</b>.', 'vocab: x-axis'); } },
      { id: '1b', level: 'LIM', make: function (r) { return vocabPart(r, ['The vertical number line on a Cartesian plane is called the ______.', 'On a Cartesian plane, the number line that runs up and down is called the ______.', 'The ______ is the vertical axis of a Cartesian plane.'], 'y-axis', 'The vertical number line is the <b>' + t('y') + '-axis</b>.', 'vocab: y-axis'); } },
      { id: '1c', level: 'LIM', make: function (r) { return vocabPart(r, ['The point where the two axes cross, with coordinates ' + t('(0, 0)') + ', is called the ______.', 'The ' + t('x') + '-axis and the ' + t('y') + '-axis intersect at the ______, the point ' + t('(0, 0)') + '.', 'The point ' + t('(0, 0)') + ' is called the ______.'], 'origin', 'The axes cross at the <b>origin</b>, ' + t('(0, 0)') + '.', 'vocab: origin'); } },
      { id: '1d', level: 'LIM', make: function (r) { return vocabPart(r, ['The two numbers used together to locate a point are called an ______.', 'A point on the grid is located by an ______ such as ' + t('(3, -2)') + '.', 'Writing ' + t('(x, y)') + ' — across first, then up or down — gives an ______.'], 'ordered pair', 'A point is located by an <b>ordered pair</b> ' + t('(x, y)') + '.', 'vocab: ordered pair'); } },
      { id: '1e', level: 'LIM', make: function (r) { return vocabPart(r, ['The Cartesian plane is divided into four regions called ______.', 'The two axes cut the plane into four ______, numbered I to IV.', 'The four regions of a Cartesian plane are called ______.'], 'quadrants', 'The axes divide the plane into four <b>quadrants</b>, numbered I to IV counter-clockwise from the top right.', 'vocab: quadrants'); } }] },

    /* ===================== Part B: reading a grid ===================== */
    { num: '2', section: 'Part B — Reading a Grid', stem: gridStem('Use the grid.'), shared: gridShared, parts: [
      { id: '2', level: 'BEG', make: function (r, sh) {
        var qa = quadPoints(sh), pick = r.sample(qa, 2).concat([r.pick(['E', 'F'])]), RO = ['i', 'ii', 'iii'];
        var fl = pick.map(function (L, i) { return { label: RO[i] + ')&nbsp;' + t(pt(sh.pts[L])), name: RO[i] + ')', mode: 'text', placeholder: 'letter' }; });
        var p = KP.fields('Name the point for each ordered pair.', fl, pick.map(function (L) { return letterCheck(L, sh.pts); }), pick, pick.map(function (L, i) { return RO[i] + ') ' + t(L); }).join('&nbsp;&nbsp; '),
          pick.map(function (L) { return t(pt(sh.pts[L])) + ': from the origin ' + moveWords(sh.pts[L]) + ' — point ' + t(L) + '.'; }).join('<br>'),
          ['Start at the origin. The first number tells you how far to move left or right, the second how far to move up or down.'], 'name the point: ' + pick.join(','));
        p.bad = [pick.slice().reverse()]; return p;
      } }] },
    { num: '3', stem: gridStem('Use the grid.'), shared: gridShared, parts: [
      { id: '3', level: 'BEG', make: function (r, sh) {
        var pick = r.chance(0.5) ? ['C', 'F', 'H', 'B'] : r.sample(quadPoints(sh), 3).concat([r.pick(['E', 'F'])]), RO = ['i', 'ii', 'iii', 'iv'];
        var fl = pick.map(function (L, i) { return pairField(RO[i] + ')&nbsp;' + t(L)); });
        var p = KP.fields('List the coordinates of each point.', fl, pick.map(function (L) { var q = sh.pts[L]; return pairCheck(q[0], q[1]); }), pick.map(function (L) { return pt(sh.pts[L]); }),
          pick.map(function (L) { return t(L + pt(sh.pts[L])); }).join(', '),
          pick.map(function (L) { var q = sh.pts[L]; return t(L + pt(q)) + ': ' + moveWords(q) + '.'; }).join('<br>'),
          ['Write each point as ' + t('(x, y)') + ': across first, then up or down. A point on an axis has a ' + t('0') + ' in it.'], 'coordinates of ' + pick.join(','));
        p.bad = [pick.map(function (L) { var q = sh.pts[L]; return pt([q[1], q[0]]); })]; return p;
      } }] },
    { num: '4', stem: gridStem('Use the grid.'), shared: gridShared, parts: [
      { id: '4', level: 'BEG', make: function (r, sh) {
        var rows = quadPoints(sh), want = {}; rows.forEach(function (L) { want[L] = quadOf(sh.pts[L]); });
        return KP.grid('Which quadrant does each point lie in?', rows.map(function (L) { return { id: L, html: t(L) }; }), QOPT.map(function (q) { return { id: q, html: q }; }), want,
          { colHead: 'Quadrant', why: function (row, got, w) {
            if ((w === 'II' && got === 'IV') || (w === 'IV' && got === 'II')) return { code: 'quad-clockwise', hint: 'Check point ' + t(row) + '. The quadrants are numbered <b>counter-clockwise</b>, starting with I at the top right: ' + SIGNS + '.' };
            return { code: 'quad-sign', hint: 'Check point ' + t(row) + ': look at the signs of its two coordinates. ' + SIGNS + '.' };
          } },
          QOPT.map(function (q) { var L = rows.filter(function (x) { return want[x] === q; }); return 'Quadrant ' + q + ' ' + t(QSIGN[q]) + ': ' + (L.length ? L.map(function (x) { return t(x + pt(sh.pts[x])); }).join(', ') : 'none'); }).join('<br>') + '<br>(' + t('E') + ' and ' + t('F') + ' are on the axes, so they are in no quadrant.)',
          ['Quadrant I is top right; the numbering goes counter-clockwise.', 'Use the signs: ' + SIGNS + '.'], 'quadrants of the points');
      } }] },
    { num: '5', stem: gridStem('Use the grid.'), shared: gridShared, parts: [
      { id: '5', level: 'BEG', make: function (r, sh) {
        var pts = sh.pts, axisCheck = function (want, other, ax) {
          var base = letterCheck(want, pts);
          return function (resp) {
            var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').replace(/[\s.()]/g, '').toUpperCase();
            if (s === other) return wrong('u5l1-axis-swap', t(other + pt(pts[other])) + ' is on an axis, but not this one: ' + (ax === 'x' ? 'a point on the ' + t('x') + '-axis has ' + t('y=0') + '.' : 'a point on the ' + t('y') + '-axis has ' + t('x=0') + '.'));
            if (pts[s] && quadOf(pts[s])) return wrong('u5l1-quad-axis', t(s + pt(pts[s])) + ' has no ' + t('0') + ' in it, so it is inside a quadrant, not on an axis.');
            return base(resp);
          };
        };
        var fl = [{ label: 'On the ' + t('x') + '-axis:', name: 'x-axis', mode: 'text', placeholder: 'letter' }, { label: 'On the ' + t('y') + '-axis:', name: 'y-axis', mode: 'text', placeholder: 'letter' }];
        var p = KP.fields('Two of the points lie on an axis. Which point is on each axis?', fl, [axisCheck('F', 'E', 'x'), axisCheck('E', 'F', 'y')], ['F', 'E'], t('F' + pt(pts.F)) + ' on the ' + t('x') + '-axis; ' + t('E' + pt(pts.E)) + ' on the ' + t('y') + '-axis',
          t('F' + pt(pts.F)) + ' has ' + t('y=0') + ': it is on the <b>' + t('x') + '-axis</b>.<br>' + t('E' + pt(pts.E)) + ' has ' + t('x=0') + ': it is on the <b>' + t('y') + '-axis</b>.',
          ['A point on an axis has a ' + t('0') + ' for one coordinate.', t('y=0') + ' puts a point on the ' + t('x') + '-axis; ' + t('x=0') + ' puts it on the ' + t('y') + '-axis.'], 'points on the axes');
        p.bad = [['E', 'F']]; return p;
      } }] },
    { num: '6', stem: gridStem('Use the grid.'), shared: gridShared, parts: [
      { id: '6a', level: 'BEG', make: function (r, sh) {
        return selectPart('Two of the points share the same ' + t('y') + '-coordinate. Which two points are they? Tap both.', sh.letters, ['A', 'B'], function (extra, missing) {
          if (extra.indexOf('G') >= 0 || extra.indexOf('H') >= 0) return { code: 'same-y', hint: t('G') + ' and ' + t('H') + ' share their <b>' + t('x') + '</b>-coordinate (the first number). The ' + t('y') + '-coordinate is the second number.' };
          if (extra.length) return { code: 'extra', hint: t(extra[0] + pt(sh.pts[extra[0]])) + ' — no other point has ' + t('y=' + sh.pts[extra[0]][1]) + '.' };
          return { code: 'missed', hint: 'Write down the second number of every point and look for the one that appears twice.' };
        }, t('A' + pt(sh.pts.A)) + ' and ' + t('B' + pt(sh.pts.B)) + ' both have ' + t('y=' + sh.pts.A[1]) + '.', ['Write down the second number of each point. Which value appears twice?'], 'same y-coordinate');
      } },
      { id: '6b', level: 'EMG', make: function (r, sh) {
        var k = sh.pts.A[1];
        return KP.mc(r, 'Points ' + t('A') + ' and ' + t('B') + ' both have ' + t('y=' + k) + '. What does that tell you about where they are on the grid?', [
          { html: 'They are on the same <b>horizontal</b> line, ' + Math.abs(k) + ' units ' + (k > 0 ? 'above' : 'below') + ' the ' + t('x') + '-axis.', right: true },
          { html: 'They are on the same <b>vertical</b> line.', why: 'Points on a vertical line share their <b>' + t('x') + '</b>-coordinate (same distance across).' },
          { html: 'They are in the same quadrant.', why: 'Look at the grid: ' + t('A') + ' is in Quadrant ' + quadOf(sh.pts.A) + ' and ' + t('B') + ' in Quadrant ' + quadOf(sh.pts.B) + '.' },
          { html: 'They are the same distance from the origin.', why: t('A') + ' is ' + Math.abs(sh.pts.A[0]) + ' units across and ' + t('B') + ' is ' + Math.abs(sh.pts.B[0]) + ' units across, so they are not the same distance away. The shared ' + t('y') + ' only fixes the height.' }],
          'The ' + t('y') + '-coordinate is the height of a point. Same ' + t('y') + ' means same height: ' + t('A') + ' and ' + t('B') + ' are on the same <b>horizontal</b> line, ' + t('y=' + k) + '.', ['The ' + t('y') + '-coordinate tells you how far up or down a point is.'], 'same y: horizontal line');
      } }] },
    { num: '7', stem: gridStem('Use the grid.'), shared: gridShared, parts: [
      { id: '7a', level: 'BEG', make: function (r, sh) {
        return selectPart('Two of the points share the same ' + t('x') + '-coordinate. Which two points are they? Tap both.', sh.letters, ['G', 'H'], function (extra, missing) {
          if (extra.indexOf('A') >= 0 || extra.indexOf('B') >= 0) return { code: 'same-y', hint: t('A') + ' and ' + t('B') + ' share their <b>' + t('y') + '</b>-coordinate (the second number). The ' + t('x') + '-coordinate is the first number.' };
          if (extra.length) return { code: 'extra', hint: t(extra[0] + pt(sh.pts[extra[0]])) + ' — no other point has ' + t('x=' + sh.pts[extra[0]][0]) + '.' };
          return { code: 'missed', hint: 'Write down the first number of every point and look for the one that appears twice.' };
        }, t('G' + pt(sh.pts.G)) + ' and ' + t('H' + pt(sh.pts.H)) + ' both have ' + t('x=' + sh.pts.G[0]) + '.', ['Write down the first number of each point. Which value appears twice?'], 'same x-coordinate');
      } },
      { id: '7b', level: 'EMG', make: function (r, sh) {
        var k = sh.pts.G[0];
        return KP.mc(r, 'Points ' + t('G') + ' and ' + t('H') + ' both have ' + t('x=' + k) + '. What does that tell you about where they are on the grid?', [
          { html: 'They are on the same <b>vertical</b> line, ' + Math.abs(k) + ' unit' + (Math.abs(k) > 1 ? 's' : '') + ' ' + (k > 0 ? 'right' : 'left') + ' of the ' + t('y') + '-axis — one directly above the other.', right: true },
          { html: 'They are on the same <b>horizontal</b> line.', why: 'Points on a horizontal line share their <b>' + t('y') + '</b>-coordinate (same height).' },
          { html: 'They are on the ' + t('x') + '-axis.', why: 'A point on the ' + t('x') + '-axis has ' + t('y=0') + '. Here it is the ' + t('x') + '-coordinates that match.' },
          { html: 'They are in different quadrants.', why: 'Look at the grid: both are in Quadrant ' + quadOf(sh.pts.G) + '.' }],
          'The ' + t('x') + '-coordinate tells how far across a point is. Same ' + t('x') + ' means directly above or below each other: on the same <b>vertical</b> line, ' + t('x=' + k) + '.', ['The ' + t('x') + '-coordinate tells you how far left or right a point is.'], 'same x: vertical line');
      } }] },

    /* ===================== Part C: plotting and joining ===================== */
    { num: '8', section: 'Part C — Plotting and Joining Points', stem: function (sh) { return 'Points: ' + sh.v.concat([sh.v[0]]).map(function (p) { return t(pt(p)); }).join(' → ') + '.'; }, shared: rectShared, parts: [
      { id: '8a', level: 'BEG', make: function (r, sh) {
        var v = sh.v;
        return polyPart('Plot the points, in order, and join each point to the next with a straight line segment.', v, [-6, 6], [-6, 6],
          'Start at ' + t(pt(v[0])) + ' and join, in order, ' + v.slice(1).map(function (p) { return t(pt(p)); }).join(', ') + ' and back to ' + t(pt(v[0])) + '.',
          ['Plot each point: across first (' + t('x') + '), then up or down (' + t('y') + ').', 'Join each point to the next one, and the last one back to the first.'], 'plot and join: rectangle');
      } },
      { id: '8b', level: 'LIM', make: function (r, sh) {
        var v = sh.v;
        return KP.mc(r, 'What geometric shape do the points outline?', [{ html: 'a rectangle', right: true },
          { html: 'a square', why: 'Count the sides: one pair is ' + sh.w + ' units long and the other ' + sh.h + ' units, so the four sides are not all equal.' },
          { html: 'a triangle', why: 'Count the corners: the path turns at four points.' },
          { html: 'a trapezoid', why: 'Every corner is a right angle and both pairs of opposite sides are parallel and equal.' }],
          figGraph(v, [-6, 6], [-6, 6]) + '<br>Four right-angle corners, opposite sides equal (' + sh.w + ' and ' + sh.h + ' units): a <b>rectangle</b> (' + sh.w + ' by ' + sh.h + ').', ['Sketch the path and count the corners.', 'Are all four sides the same length?'], 'name: rectangle');
      } }] },
    { num: '9', stem: function (sh) { var v = sh.v; return 'Points: ' + t(pt(v[0])) + ', ' + t(pt(v[1])) + ' and ' + t(pt(v[2])) + '. Join ' + t(pt(v[0])) + ' to ' + t(pt(v[1])) + ', then ' + t(pt(v[1])) + ' to ' + t(pt(v[2])) + ', then ' + t(pt(v[2])) + ' back to ' + t(pt(v[0])) + '.'; }, shared: triShared, parts: [
      { id: '9a', level: 'BEG', make: function (r, sh) {
        var v = sh.v;
        return polyPart('Plot the points on the grid and join them as described.', v, [-6, 6], [-6, 6], 'Plot ' + v.map(function (p) { return t(pt(p)); }).join(', ') + ' and join them in order, ending back at ' + t(pt(v[0])) + '.',
          ['Plot each point: across first, then up or down.', 'Three segments: the last one goes back to the first point.'], 'plot and join: triangle');
      } },
      { id: '9b', level: 'LIM', make: function (r, sh) {
        return KP.mc(r, 'What geometric shape do the points outline?', [{ html: 'a triangle', right: true },
          { html: 'a rectangle', why: 'Count the corners: there are only three points, so three sides.' },
          { html: 'a square', why: 'A square has four equal sides; this figure has three sides.' },
          { html: 'a trapezoid', why: 'A trapezoid has four sides. Count the segments you drew.' }],
          figGraph(sh.v, [-6, 6], [-6, 6]) + '<br>Three points joined by three segments: a <b>triangle</b>.', ['Count the corners of the figure.'], 'name: triangle');
      } }] },

    /* ===================== Part D: quadrants and patterns ===================== */
    { num: '10', section: 'Part D — Quadrants and Patterns', stem: 'Without plotting, state which quadrant each point lies in. If a point lies on an axis, say which one.', parts: ['I', 'II', 'III', 'IV', 'ya', 'xa'].map(function (w, i) {
      var BK = [[6, 2], [-3, 7], [-5, -1], [2, -8], [0, -9], [7, 0]];
      return { id: '10' + 'abcdef'[i], level: 'BEG', make: function (r) {
        var p;
        if (r.chance(0.12)) p = BK[i];
        else if (w === 'xa') p = [nz(r, 1, 9), 0];
        else if (w === 'ya') p = [0, nz(r, 1, 9)];
        else { var a = r.int(1, 9), b; do { b = r.int(1, 9); } while (b === a); p = [SG[w][0] * a, SG[w][1] * b]; }
        return placeMC(r, p, t(pt(p)), null, null, 'quadrant of ' + pt(p));
      } };
    }) },
    { num: '11', stem: '', parts: QOPT.map(function (q, i) { return { id: '11' + 'abcd'[i], level: 'BEG', make: function () { return examplePart(q); } }; }) },
    { num: '12', stem: function (sh) { return 'Consider the points ' + sh.pts.map(function (p) { return t(pt(p)); }).join(', ') + '.'; }, shared: lineShared, parts: [
      { id: '12a', level: 'BEG', make: function (r, sh) {
        return plotPointsPart('Plot the four points on the grid.', sh.pts, [-6, 6], [-6, 6], 'Plot ' + sh.pts.map(function (p) { return t(pt(p)) + ' (' + moveWords(p) + ')'; }).join(', ') + '.',
          ['For each point: start at the origin, move across first (' + t('x') + '), then up or down (' + t('y') + ').'], 'plot four points');
      } },
      { id: '12b', level: 'BEG', make: function (r, sh) {
        var g = HW.graph({ x: [-6, 6], y: [-6, 6], labels: 1, max: 260, points: sh.pts.map(function (p) { return { x: p[0], y: p[1] }; }), segs: sh.straight ? [{ pts: [sh.pts[0], sh.pts[3]], dash: true }] : [], aria: 'the four points' });
        var d = sh.d, steps = sh.pts.slice(1).map(function (p, i) { return p[1] - sh.pts[i][1]; });
        var yes = { html: 'Yes — they appear to lie on a straight line.', right: sh.straight, why: sh.straight ? null : 'Look at the steps: each point is ' + d + ' unit' + (d > 1 ? 's' : '') + ' further right, but the heights change by ' + steps.map(String).join(', then ') + '. A straight line needs the same change every step.' };
        var no = { html: 'No — they do not lie on a straight line.', right: !sh.straight, why: sh.straight ? 'Each point is ' + d + ' unit' + (d > 1 ? 's' : '') + ' right and ' + Math.abs(steps[0]) + ' ' + (steps[0] > 0 ? 'up' : 'down') + ' from the one before — the same step every time, so they line up.' : null };
        return KP.mc(r, 'Do the points appear to lie on a straight line?', [yes, no,
          { html: 'Only if they are all in the same quadrant.', why: 'Points in different quadrants can still line up — the quadrants don’t decide it.' },
          { html: 'You can’t tell without the equation of the line.', why: 'Plot them (or compare the steps from point to point): the picture is enough.' }],
          g + '<br>' + (sh.straight ? 'Each step goes ' + d + ' right and ' + Math.abs(steps[0]) + ' ' + (steps[0] > 0 ? 'up' : 'down') + ': the same every time, so the points lie on a <b>straight line</b>.' : 'The steps up or down are ' + steps.join(', ') + ' — not all the same, so the points do <b>not</b> lie on one straight line.'),
          ['Look at how far up or down you go from each point to the next.'], 'line up? ' + sh.straight, true);
      } },
      { id: '12c', level: 'BEG', make: function (r, sh) {
        var want = {}; sh.pts.forEach(function (p, i) { want['p' + i] = quadOf(p); });
        return KP.grid('Which quadrant does each point lie in?', sh.pts.map(function (p, i) { return { id: 'p' + i, html: t(pt(p)) }; }), QOPT.map(function (q) { return { id: q, html: q }; }), want,
          { colHead: 'Quadrant', why: function (row, got, w) { var p = sh.pts[Number(row.slice(1))]; return { code: (w === 'II' && got === 'IV') || (w === 'IV' && got === 'II') ? 'quad-clockwise' : 'quad-sign', hint: 'Check ' + t(pt(p)) + ': ' + t('x') + ' is ' + sgnWord(p[0]) + ' and ' + t('y') + ' is ' + sgnWord(p[1]) + '. ' + SIGNS + '.' }; } },
          sh.pts.map(function (p) { return t(pt(p)) + ': ' + t(QSIGN[quadOf(p)]) + ', Quadrant ' + quadOf(p); }).join('<br>'), ['Use the signs of each point: ' + SIGNS + '.'], 'quadrants of four points');
      } }] },
    { num: '13', stem: '', parts: [
      { id: '13', level: 'EMG', make: function (r) {
        var q = r.pick(['II', 'II', 'I', 'III', 'IV']), a = r.int(6, 15), b; do { b = r.int(2, 12); } while (b === a);
        if (q === 'II' && r.chance(0.3)) { a = 9; b = 4; }
        var p = [SG[q][0] * a, SG[q][1] * b], sx = p[0] > 0, sy = p[1] > 0;
        var lr = sx ? 'right of' : 'left of', ab = sy ? 'above' : 'below';
        var other = { I: 'II', II: 'I', III: 'IV', IV: 'III' }[q], flipY = { I: 'IV', II: 'III', III: 'II', IV: 'I' }[q];
        return KP.mc(r, 'Without plotting it, how do you know that the point ' + t(pt(p)) + ' lies in Quadrant ' + q + '?', [
          { html: t('x=' + p[0]) + ' is ' + sgnWord(p[0]) + ', so the point is ' + lr + ' the ' + t('y') + '-axis; ' + t('y=' + p[1]) + ' is ' + sgnWord(p[1]) + ', so it is ' + ab + ' the ' + t('x') + '-axis. ' + (sx ? 'Right' : 'Left') + ' and ' + ab + ' is Quadrant ' + q + '.', right: true },
          { html: 'Because ' + t(Math.abs(p[0])) + ' is ' + (a > b ? 'bigger' : 'smaller') + ' than ' + t(Math.abs(p[1])) + '.', why: 'The sizes of the numbers don’t decide the quadrant — only their <b>signs</b> do.' },
          { html: 'Because ' + t('y=' + p[1]) + ' is ' + sgnWord(p[1]) + '.', why: 'That only tells you it is ' + ab + ' the ' + t('x') + '-axis: Quadrant ' + q + ' or Quadrant ' + other + '. You need the sign of ' + t('x') + ' too.' },
          { html: t('x') + ' is ' + sgnWord(p[0]) + ', so the point is ' + (sx ? 'left of' : 'right of') + ' the ' + t('y') + '-axis, and ' + t('y') + ' is ' + sgnWord(p[1]) + ', so it is ' + ab + ' the ' + t('x') + '-axis.', why: 'A ' + sgnWord(p[0]) + ' ' + t('x') + '-coordinate means the point is ' + lr + ' the ' + t('y') + '-axis, not ' + (sx ? 'left' : 'right') + '. That reasoning would land in Quadrant ' + other + '.' }],
          'Use the signs. ' + t('x=' + p[0]) + ' is ' + sgnWord(p[0]) + ': ' + lr + ' the ' + t('y') + '-axis. ' + t('y=' + p[1]) + ' is ' + sgnWord(p[1]) + ': ' + ab + ' the ' + t('x') + '-axis. ' + t(QSIGN[q]) + ' is <b>Quadrant ' + q + '</b>. (No need to plot — the point is off most grids anyway.)',
          ['What does the sign of each coordinate tell you?'], 'explain quadrant ' + q);
      } }] },

    /* ===================== Part E: multiple choice ===================== */
    { num: '14', section: 'Part E — Multiple Choice', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '14', level: 'BEG', make: function (r) {
        var target = r.pick(['III', 'III', 'I', 'II', 'IV']), qs = QOPT.slice(), pts = {};
        qs.forEach(function (q) { var a = r.int(1, 9), b = r.int(1, 9); pts[q] = [SG[q][0] * a, SG[q][1] * b]; });
        if (target === 'III' && r.chance(0.2)) pts = { I: [5, 7], II: [-2, 9], III: [-6, -3], IV: [4, -2] };
        return KP.mc(r, 'Which of the following points lies in Quadrant ' + target + '?', qs.map(function (q) { return { html: t(pt(pts[q])), right: q === target, why: q === target ? null : t(pt(pts[q])) + ' has signs ' + t(QSIGN[q]) + ': Quadrant ' + q + '. Quadrant ' + target + ' needs ' + t(QSIGN[target]) + '.' }; }),
          'Quadrant ' + target + ' has signs ' + t(QSIGN[target]) + ', so the answer is ' + t(pt(pts[target])) + '.', ['Write down the signs each quadrant needs: ' + SIGNS + '.'], 'MC point in Q' + target);
      } }] },
    { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var onY = r.chance(0.6), k = nz(r, 2, 9), p = onY ? [0, k] : [k, 0];
        if (r.chance(0.15)) { p = [0, -6]; onY = true; k = -6; }
        var near = onY ? (k > 0 ? 'I' : 'IV') : (k > 0 ? 'I' : 'II'), near2 = onY ? (k > 0 ? 'II' : 'III') : (k > 0 ? 'IV' : 'III');
        return KP.mc(r, 'The point ' + t(pt(p)) + ' lies', [
          { html: 'in Quadrant ' + near + '.', why: 'One coordinate is ' + t('0') + ', so the point is on an axis — and a point on an axis is in no quadrant.', code: 'quad' },
          { html: 'in Quadrant ' + near2 + '.', why: 'One coordinate is ' + t('0') + ', so the point is on an axis — in no quadrant.', code: 'quad2' },
          { html: 'on the ' + t('x') + '-axis.', right: !onY, why: onY ? t('x=0') + ': the point hasn’t moved left or right, so it is on the <b>' + t('y') + '</b>-axis.' : null, code: 'xa' },
          { html: 'on the ' + t('y') + '-axis.', right: onY, why: !onY ? t('y=0') + ': the point hasn’t moved up or down, so it is on the <b>' + t('x') + '</b>-axis.' : null, code: 'ya' }],
          placeWhy(p), ['Which coordinate is ' + t('0') + '? What does that mean about how far the point moved?'], 'MC point on axis ' + pt(p), true);
      } }] }
  ];

  /* ======================================================================= Extra practice ======================= */
  var COLS7 = QOPT.map(function (q) { return { id: q, html: q }; }).concat([{ id: 'xa', html: '\\(x\\)-axis' }, { id: 'ya', html: '\\(y\\)-axis' }, { id: 'O', html: 'origin' }]);
  function placeGrid(prompt, rows, sol, hints, text) { // rows: [{ id, html, w (place), p? }]
    var want = {}; rows.forEach(function (rw) { want[rw.id] = rw.w; });
    return KP.grid(prompt, rows.map(function (rw) { return { id: rw.id, html: rw.html }; }), COLS7, want, { why: function (row, got, w) {
      var rw = rows.filter(function (x) { return x.id === row; })[0], isAx = function (z) { return z === 'xa' || z === 'ya' || z === 'O'; };
      if (isAx(w) && !isAx(got)) return { code: 'u5l1-axis-quad', hint: 'Check ' + rw.html + ': a coordinate of ' + t('0') + ' puts the point on an axis, and then it is in <b>no</b> quadrant.' };
      if (!isAx(w) && isAx(got)) return { code: 'u5l1-quad-axis', hint: 'Check ' + rw.html + ': neither coordinate is ' + t('0') + ', so it is inside a quadrant.' };
      if (isAx(w)) return { code: 'u5l1-axis-swap', hint: 'Check ' + rw.html + ': ' + t('y=0') + ' means the ' + t('x') + '-axis, ' + t('x=0') + ' means the ' + t('y') + '-axis, and both together is the origin.' };
      return { code: (w === 'II' && got === 'IV') || (w === 'IV' && got === 'II') ? 'quad-clockwise' : 'quad-sign', hint: 'Check ' + rw.html + ': ' + SIGNS + '.' };
    } }, sol, hints, text);
  }
  function nameOf(w) { return { I: 'Quadrant I', II: 'Quadrant II', III: 'Quadrant III', IV: 'Quadrant IV', xa: 'the ' + t('x') + '-axis', ya: 'the ' + t('y') + '-axis', O: 'the origin' }[w]; }
  var X = [];

  /* ----- EP 1 ----- */
  X.push({ num: '1', section: 'Extra practice A — Quadrants, Axes, and Sign Patterns', stem: 'Without plotting, state the quadrant each point lies in. <b>Careful:</b> a point on an axis is in <i>no</i> quadrant — for those, choose the axis (or the origin).', parts: [
    { id: 'e1', level: 'BEG', make: function (r) {
      var types = r.shuffle(['III', 'ya', 'IV', 'xa', 'II', 'O', 'I', 'xa']), pts;
      if (r.chance(0.15)) pts = [[-7, -2], [0, 9], [11, -4], [-6, 0], [-1, 8], [0, 0], [5, 5], [12, 0]];
      else pts = types.map(function (w) { return w === 'O' ? [0, 0] : w === 'xa' ? [nz(r, 1, 12), 0] : w === 'ya' ? [0, nz(r, 1, 12)] : [SG[w][0] * r.int(1, 12), SG[w][1] * r.int(1, 12)]; });
      var rows = pts.map(function (p, i) { return { id: 'r' + i, html: '(' + 'abcdefgh'[i] + ') ' + t(pt(p)), w: placeOf(p) }; });
      return placeGrid('Choose where each point lies.', rows, rows.map(function (rw, i) { return rw.html + ': ' + nameOf(rw.w); }).join('<br>'), ['A ' + t('0') + ' puts the point on an axis; ' + t('(0, 0)') + ' is the origin.', 'Otherwise use the signs: ' + SIGNS + '.'], 'EP1 places');
    } }] });
  /* ----- EP 2 ----- */
  X.push({ num: '2', stem: 'Each description tells you only the <b>signs</b> of the coordinates. Where must the point lie?', parts: [
    { id: 'e2', level: 'EMG', make: function (r) {
      var all = [['>', '>', 'I'], ['<', '>', 'II'], ['<', '<', 'III'], ['>', '<', 'IV'], ['=', '<', 'ya'], ['=', '>', 'ya'], ['<', '=', 'xa'], ['>', '=', 'xa'], ['=', '=', 'O']];
      var pick = r.chance(0.2) ? [all[3], all[2], all[4], all[6], all[0], all[8]] : r.shuffle(r.sample(all.slice(0, 4), 3).concat(r.sample(all.slice(4, 8), 2)).concat([all[8]]));
      var rows = pick.map(function (c, i) { return { id: 'r' + i, html: '(' + 'abcdef'[i] + ') ' + t('x' + c[0] + '0') + ' and ' + t('y' + c[1] + '0'), w: c[2] }; });
      var desc = function (c) { if (c[2] === 'ya') return 'the ' + t('y') + '-axis, ' + (c[1] === '<' ? 'below' : 'above') + ' the origin'; if (c[2] === 'xa') return 'the ' + t('x') + '-axis, ' + (c[0] === '<' ? 'left' : 'right') + ' of the origin'; return nameOf(c[2]); };
      return placeGrid('Choose where each point must lie.', rows, pick.map(function (c, i) { return rows[i].html + ': ' + desc(c); }).join('<br>'), ['If a coordinate is ' + t('=0') + ', the point is on an axis. Otherwise use ' + SIGNS + '.'], 'EP2 sign conditions');
    } }] });
  /* ----- EP 3 ----- */
  var TRANS = [['(b, a)', function (a, b) { return [b, a]; }], ['(-a, b)', function (a, b) { return [-a, b]; }], ['(a, -b)', function (a, b) { return [a, -b]; }], ['(-b, -a)', function (a, b) { return [-b, -a]; }], ['(-a, -b)', function (a, b) { return [-a, -b]; }], ['(b, -a)', function (a, b) { return [b, -a]; }]];
  X.push({ num: '3', stem: '', parts: [
    { id: 'e3', level: 'PRG', make: function (r) {
      var Q = r.pick(['II', 'II', 'I', 'III', 'IV']), sg = SG[Q], picks = r.chance(0.5) ? TRANS.slice(0, 4) : r.sample(TRANS, 4);
      var want = {}; picks.forEach(function (tr, i) { want['t' + i] = quadOf(tr[1](sg[0], sg[1])); });
      var sgn = function (v) { return v > 0 ? '+' : '-'; };
      return KP.grid('The point ' + t('(a, b)') + ' lies in <b>Quadrant ' + Q + '</b>. That tells you the sign of ' + t('a') + ' and the sign of ' + t('b') + '. Which quadrant does each point lie in?', picks.map(function (tr, i) { return { id: 't' + i, html: '(' + 'abcd'[i] + ') ' + t(tr[0]) }; }), QOPT.map(function (q) { return { id: q, html: q }; }), want,
        { colHead: 'Quadrant', why: function (row) { var tr = picks[Number(row.slice(1))]; return { code: 'quad-sign', hint: 'For ' + t(tr[0]) + ': ' + t('a') + ' is ' + sgnWord(sg[0]) + ' and ' + t('b') + ' is ' + sgnWord(sg[1]) + '. A minus sign in front flips the sign. What are the signs of the two coordinates?' }; } },
        'Quadrant ' + Q + ' means ' + t('a') + ' is ' + sgnWord(sg[0]) + ' and ' + t('b') + ' is ' + sgnWord(sg[1]) + '.<br>' + picks.map(function (tr) { var s2 = tr[1](sg[0], sg[1]); return t(tr[0]) + ': ' + t('(' + sgn(s2[0]) + ', ' + sgn(s2[1]) + ')') + ', Quadrant ' + quadOf(s2); }).join('<br>'),
        ['Write the signs of ' + t('a') + ' and ' + t('b') + ' first, e.g. ' + t('a<0') + ', ' + t('b>0') + '.', 'Then write the signs of each new point, one coordinate at a time.'], 'EP3 quadrant of (b,a) etc.');
    } }] });
  /* ----- EP 4 ----- */
  X.push({ num: '4', stem: 'Describe <b>all</b> of the points that satisfy each condition.', parts: [
    { id: 'e4a', level: 'BEG', make: function (r) {
      var v = r.chance(0.75) ? 'x' : 'y', o = v === 'x' ? 'y' : 'x';
      return KP.mc(r, 'Where are all the points whose ' + t(v) + '-coordinate is ' + t('0') + '?', [
        { html: 'Every point on the ' + t(o) + '-axis (the whole axis, including the origin).', right: true },
        { html: 'Every point on the ' + t(v) + '-axis.', why: 'On the ' + t(v) + '-axis the <b>other</b> coordinate is ' + t('0') + '. ' + t(v + '=0') + ' means no movement in the ' + t(v) + '-direction.' },
        { html: 'Only the origin.', why: 'The origin is one of them, but ' + t(pt(v === 'x' ? [0, 4] : [4, 0])) + ' also has ' + t(v + '=0') + '.' },
        { html: 'All of Quadrant I.', why: 'Points inside a quadrant have no ' + t('0') + ' coordinates.' }],
        t(v + '=0') + ' means the point has not moved ' + (v === 'x' ? 'left or right' : 'up or down') + ' from the origin, so it sits on the <b>' + t(o) + '-axis</b> — every point on it, including the origin.', ['Try a few points with ' + t(v + '=0') + ', e.g. ' + t(pt(v === 'x' ? [0, 3] : [3, 0])) + ' and ' + t(pt(v === 'x' ? [0, -2] : [-2, 0])) + '.'], 'all points ' + v + '=0');
    } },
    { id: 'e4b', level: 'BEG', make: function (r) {
      var v = r.chance(0.75) ? 'y' : 'x', o = v === 'x' ? 'y' : 'x';
      return KP.mc(r, 'Where are all the points whose ' + t(v) + '-coordinate is ' + t('0') + '?', [
        { html: 'Every point on the ' + t(o) + '-axis (the whole axis, including the origin).', right: true },
        { html: 'Every point on the ' + t(v) + '-axis.', why: 'On the ' + t(v) + '-axis the <b>other</b> coordinate is ' + t('0') + '.' },
        { html: 'Only the origin.', why: 'The origin is one of them, but so is ' + t(pt(v === 'x' ? [0, -5] : [-5, 0])) + '.' },
        { html: 'Nowhere: a coordinate can’t be ' + t('0') + '.', why: 'Coordinates can be ' + t('0') + ' — the origin is ' + t('(0, 0)') + '.' }],
        t(v + '=0') + ': no movement ' + (v === 'y' ? 'up or down' : 'left or right') + ', so the points are on the <b>' + t(o) + '-axis</b>.', ['Try a few points with ' + t(v + '=0') + '.'], 'all points ' + v + '=0 (b)');
    } },
    { id: 'e4c', level: 'EMG', make: function (r) {
      var Q = r.chance(0.4) ? 'II' : r.pick(QOPT), sg = SG[Q], cx = sg[0] > 0 ? '>' : '<', cy = sg[1] > 0 ? '>' : '<';
      var other = QOPT.filter(function (q) { return q !== Q; });
      return KP.mc(r, 'Where are all the points with ' + t('y' + cy + '0') + ' <b>and</b> ' + t('x' + cx + '0') + '?', [
        { html: 'All of Quadrant ' + Q + ' (' + (sg[0] > 0 ? 'right' : 'left') + ' of the ' + t('y') + '-axis and ' + (sg[1] > 0 ? 'above' : 'below') + ' the ' + t('x') + '-axis), not including the axes.', right: true },
        { html: 'All of Quadrant ' + other[0] + ', not including the axes.', why: 'Quadrant ' + other[0] + ' has signs ' + t(QSIGN[other[0]]) + '. Here ' + t('x') + ' is ' + sgnWord(sg[0]) + ' and ' + t('y') + ' is ' + sgnWord(sg[1]) + '.' },
        { html: 'Quadrant ' + Q + ' together with the axes around it.', why: 'On an axis one coordinate is ' + t('0') + ', and ' + t('0') + ' is neither ' + t('>0') + ' nor ' + t('<0') + '.' },
        { html: 'Only the point ' + t(pt([sg[0], sg[1]])) + '.', why: 'That point works, but so does ' + t(pt([sg[0] * 7, sg[1] * 3])) + ' — the condition describes a whole region.' }],
        t('x') + ' ' + sgnWord(sg[0]) + ' and ' + t('y') + ' ' + sgnWord(sg[1]) + ': ' + t(QSIGN[Q]) + ' — every point of <b>Quadrant ' + Q + '</b>, but not the axes (there a coordinate is ' + t('0') + ').', ['What are the signs of the two coordinates?'], 'region Q' + Q);
    } },
    { id: 'e4d', level: 'EMG', make: function (r) {
      var hz = r.chance(0.7), k = nz(r, 1, 6); if (r.chance(0.2)) { hz = true; k = -3; }
      var v = hz ? 'y' : 'x', qs = hz ? (k > 0 ? ['I', 'II'] : ['III', 'IV']) : (k > 0 ? ['I', 'IV'] : ['II', 'III']);
      var where = hz ? Math.abs(k) + ' unit' + (Math.abs(k) > 1 ? 's' : '') + ' ' + (k > 0 ? 'above' : 'below') + ' the ' + t('x') + '-axis' : Math.abs(k) + ' unit' + (Math.abs(k) > 1 ? 's' : '') + ' ' + (k > 0 ? 'right' : 'left') + ' of the ' + t('y') + '-axis';
      var wrongQ = hz ? (k > 0 ? ['III', 'IV'] : ['I', 'II']) : (k > 0 ? ['II', 'III'] : ['I', 'IV']);
      return KP.mc(r, 'Where are all the points with ' + t(v + '=' + k) + '? Which quadrants does this set of points pass through?', [
        { html: 'A ' + (hz ? 'horizontal' : 'vertical') + ' line ' + where + '; it passes through Quadrants ' + qs.join(' and ') + '.', right: true },
        { html: 'A ' + (hz ? 'vertical' : 'horizontal') + ' line ' + Math.abs(k) + ' units from the ' + t(hz ? 'y' : 'x') + '-axis; it passes through Quadrants ' + (hz ? (k > 0 ? 'I and IV' : 'II and III') : (k > 0 ? 'I and II' : 'III and IV')) + '.', why: t(v + '=' + k) + ' fixes the ' + (hz ? 'height' : 'distance across') + ': every point is at the same ' + (hz ? 'height, so they form a <b>horizontal</b>' : 'distance across, so they form a <b>vertical</b>') + ' line.' },
        { html: 'A ' + (hz ? 'horizontal' : 'vertical') + ' line ' + where + '; it passes through Quadrants ' + wrongQ.join(' and ') + '.', why: 'Check the sign: ' + t(v + '=' + k) + ' is ' + sgnWord(k) + ', so the line is ' + (hz ? (k > 0 ? 'above' : 'below') + ' the ' + t('x') : (k > 0 ? 'right' : 'left') + ' of the ' + t('y')) + '-axis.' },
        { html: 'Only the point ' + t(pt(hz ? [0, k] : [k, 0])) + '.', why: 'That point works, but so does ' + t(pt(hz ? [5, k] : [k, 5])) + ' — the condition describes a whole line.' }],
        'Every point with ' + t(v + '=' + k) + ' is at the same ' + (hz ? 'height' : 'distance across') + ': a <b>' + (hz ? 'horizontal' : 'vertical') + ' line</b> ' + where + ', through ' + t(pt(hz ? [0, k] : [k, 0])) + '. It passes through Quadrants ' + qs.join(' and ') + ' and crosses the ' + t(hz ? 'y' : 'x') + '-axis between them.',
        ['List a few points with ' + t(v + '=' + k) + ' and imagine plotting them.'], 'line ' + v + '=' + k);
    } }] });

  /* ----- EP 5: rectangle perimeter and area ----- */
  function rectEP(r) {
    var w, h; do { w = r.int(3, 7); h = r.int(2, 5); } while (w === h || w * h === 2 * (w + h));
    var x0 = -r.int(1, w - 1), y0 = -r.int(1, h - 1);
    if (r.chance(0.2)) { w = 6; h = 4; x0 = -4; y0 = -1; }
    return { w: w, h: h, v: [[x0, y0 + h], [x0 + w, y0 + h], [x0 + w, y0], [x0, y0]] }; // A top-left, B top-right, C bottom-right, D bottom-left
  }
  X.push({ num: '5', section: 'Extra practice B — Shapes on the Grid: Perimeter and Area', stem: function (sh) { return 'Points ' + ['A', 'B', 'C', 'D'].map(function (L, i) { return t(L + pt(sh.v[i])); }).join(', ') + '. Join ' + t('A\\to B\\to C\\to D\\to A') + '.'; }, shared: rectEP, parts: [
    { id: 'e5p', sub: 'plot', level: 'BEG', make: function (r, sh) {
      return polyPart('Plot the points and join them in order.', sh.v, [-7, 7], [-7, 7], 'Join ' + sh.v.map(function (p) { return t(pt(p)); }).join(' → ') + ' and back to ' + t(pt(sh.v[0])) + '.', ['Plot each point: across first, then up or down.'], 'EP5 plot rectangle');
    } },
    { id: 'e5a', sub: 'a', level: 'LIM', make: function (r, sh) {
      return KP.mc(r, 'What shape is ' + t('ABCD') + '?', [{ html: 'a rectangle', right: true }, { html: 'a square', why: 'The sides are ' + sh.w + ' and ' + sh.h + ' units long — not all equal.' }, { html: 'a trapezoid', why: 'Both pairs of opposite sides are parallel, and every corner is a right angle.' }, { html: 'a triangle', why: 'There are four corners.' }],
        figGraph(sh.v, [-7, 7], [-7, 7], ['A', 'B', 'C', 'D']) + '<br>Two horizontal sides and two vertical sides meeting at right angles: a <b>rectangle</b>.', ['Sketch it and look at the corners.'], 'EP5 shape');
    } },
    { id: 'e5b', sub: 'b', level: 'BEG', make: function (r, sh) {
      var w = sh.w, h = sh.h, P = 2 * (w + h);
      return numPart('Find the perimeter of ' + t('ABCD') + ' by counting units.', P, function (v) {
        if (v === w * h) return { code: 'u5l1-area-perim', hint: 'That is the area (the squares inside). The perimeter is the distance <b>around</b> the outside.' };
        if (v === w + h) return { code: 'u5l1-half-perim', hint: 'That is two sides. Go all the way around: four sides.' };
        if (v === 2 * (w + 1 + h + 1)) return { code: 'u5l1-count-dots', hint: 'Count the <b>units</b> (spaces) between grid lines, not the grid points.' };
        return null;
      }, 'Width ' + t(AB(sh)) + ', height ' + t(BC(sh)) + '.<br>' + t('P=2(' + w + '+' + h + ')=' + P) + ' units.', ['Count the length of ' + t('AB') + ' and of ' + t('BC') + ', then go all the way around.'], 'EP5 perimeter', { after: 'units' });
    } },
    { id: 'e5c', sub: 'c', level: 'BEG', make: function (r, sh) {
      var w = sh.w, h = sh.h;
      return numPart('Find the area of ' + t('ABCD') + '.', w * h, function (v) {
        if (v === 2 * (w + h)) return { code: 'u5l1-area-perim', hint: 'That is the perimeter. Area counts the unit squares <b>inside</b>: length × width.' };
        if (v === (w + 1) * (h + 1)) return { code: 'u5l1-count-dots', hint: 'Count units (spaces), not grid points: the sides are ' + w + ' and ' + h + '.' };
        return null;
      }, t('A=' + w + '\\times ' + h + '=' + w * h) + ' square units.', ['Area of a rectangle = length × width.'], 'EP5 area', { after: 'square units' });
    } }] });
  function AB(sh) { return 'AB=' + sh.w; }
  function BC(sh) { return 'BC=' + sh.h; }

  /* ----- EP 6: right triangle ----- */
  X.push({ num: '6', stem: function (sh) { return 'Points ' + ['P', 'Q', 'R'].map(function (L, i) { return t(L + pt(sh.v[i])); }).join(', ') + '. Join ' + t('P\\to Q\\to R\\to P') + '.'; },
    shared: function (r) {
      var legs = r.pick([[8, 6], [6, 8], [4, 3], [3, 4], [8, 6]]), a = legs[0], b = legs[1], sx = r.pick([1, -1]), sy = r.pick([1, -1]);
      var qx = sx > 0 ? r.int(a - 6, 6) : r.int(-6, 6 - a), qy = sy > 0 ? r.int(-6, 6 - b) : r.int(b - 6, 6);
      var Q = [qx, qy], P0 = [qx - sx * a, qy], R0 = [qx, qy + sy * b];
      if (r.chance(0.2)) { a = 8; b = 6; P0 = [-3, -2]; Q = [5, -2]; R0 = [5, 4]; }
      return { a: a, b: b, c: Math.sqrt(a * a + b * b), v: [P0, Q, R0] };
    },
    parts: [
      { id: 'e6p', sub: 'plot', level: 'BEG', make: function (r, sh) {
        return polyPart('Plot the points and join them in order.', sh.v, [-7, 7], [-7, 7], 'Join ' + sh.v.map(function (p) { return t(pt(p)); }).join(' → ') + ' and back to ' + t(pt(sh.v[0])) + '.', ['Plot each point: across first, then up or down.'], 'EP6 plot triangle');
      } },
      { id: 'e6a', sub: 'a', level: 'EMG', make: function (r, sh) {
        var P0 = sh.v[0], Q = sh.v[1], R0 = sh.v[2];
        return KP.mc(r, 'Why is ' + t('\\angle Q') + ' a right angle?', [
          { html: t('PQ') + ' is horizontal (' + t('y=' + Q[1]) + ' at both ends) and ' + t('QR') + ' is vertical (' + t('x=' + Q[0]) + ' at both ends); a horizontal segment meets a vertical one at ' + t('90^\\circ') + '.', right: true },
          { html: 'Because ' + t('Q') + ' is the middle letter.', why: 'The letters don’t decide the angle. Look at which sides are horizontal or vertical.' },
          { html: 'Because ' + t('PR') + ' is the longest side.', why: 'The longest side is opposite the right angle, but that alone doesn’t prove it. Look at the directions of ' + t('PQ') + ' and ' + t('QR') + '.' },
          { html: 'Because ' + t('PQ') + ' and ' + t('QR') + ' are the same length.', why: 'They aren’t: ' + t('PQ=' + sh.a) + ' and ' + t('QR=' + sh.b) + '. Look at their directions instead.' }],
          figGraph(sh.v, [-7, 7], [-7, 7], ['P', 'Q', 'R']) + '<br>' + t('P') + ' and ' + t('Q') + ' share ' + t('y=' + Q[1]) + ' (horizontal side); ' + t('Q') + ' and ' + t('R') + ' share ' + t('x=' + Q[0]) + ' (vertical side). Horizontal meets vertical at a right angle.', ['Which side is horizontal and which is vertical?'], 'EP6 right angle');
      } },
      { id: 'e6b', sub: 'b', level: 'BEG', make: function (r, sh) {
        var a = sh.a, b = sh.b, A = a * b / 2;
        var fl = [{ label: t('PQ='), name: 'PQ', after: 'units' }, { label: t('QR='), name: 'QR', after: 'units' }, { label: 'Area', name: 'Area', after: 'square units' }];
        return KP.fields('Find the length of ' + t('PQ') + ' and of ' + t('QR') + ' by counting, then find the area of the triangle.', fl,
          [K.number(a, function (v) { return v === a + 1 ? { code: 'u5l1-count-dots', hint: 'Count the spaces between grid lines, not the grid points.' } : null; }), K.number(b, function (v) { return v === b + 1 ? { code: 'u5l1-count-dots', hint: 'Count the spaces, not the points.' } : null; }),
            K.number(A, function (v) { return v === a * b ? { code: 'u5l1-no-half', hint: 'A triangle is half of a rectangle: ' + t('A=\\tfrac{1}{2}bh') + '.' } : null; })],
          [String(a), String(b), String(A)], t('PQ=' + a) + ', ' + t('QR=' + b) + ', area ' + t(A),
          t('PQ=' + a) + ' and ' + t('QR=' + b) + ' (counting along the grid).<br>' + t('A=\\tfrac{1}{2}bh=\\tfrac{1}{2}(' + a + ')(' + b + ')=' + A) + ' square units.', ['Horizontal length: subtract the ' + t('x') + '-coordinates. Vertical length: subtract the ' + t('y') + '-coordinates.', 'Area of a triangle: ' + t('\\tfrac{1}{2}\\times\\text{base}\\times\\text{height}') + '.'], 'EP6 legs and area');
      } },
      { id: 'e6c', sub: 'c', level: 'PRG', make: function (r, sh) {
        var a = sh.a, b = sh.b, c = sh.c, P = a + b + c;
        var fl = [{ label: t('PR='), name: 'PR', after: 'units' }, { label: 'Perimeter', name: 'Perimeter', after: 'units' }];
        return KP.fields('Use the Pythagorean theorem (a Grade 8 review) to find ' + t('PR') + ', then give the perimeter of the triangle.', fl,
          [K.number(c, function (v) { return v === a + b ? { code: 'u5l1-add-legs', hint: 'A slanted side is shorter than going across and then up. Use ' + t('PR^{2}=PQ^{2}+QR^{2}') + '.' } : v === a * a + b * b ? { code: 'value', hint: 'That is ' + t('PR^{2}') + '. Take the square root.' } : null; }),
            K.number(P, function (v) { return v === a + b ? { code: 'u5l1-half-perim', hint: 'The perimeter adds all <b>three</b> sides.' } : null; })],
          [String(c), String(P)], t('PR=' + c) + ', perimeter ' + t(P),
          t('PR^{2}=' + a + '^{2}+' + b + '^{2}=' + (a * a) + '+' + (b * b) + '=' + (a * a + b * b)) + ', so ' + t('PR=\\sqrt{' + (a * a + b * b) + '}=' + c) + '.<br>Perimeter ' + t('=' + a + '+' + b + '+' + c + '=' + P) + ' units.',
          ['' + t('PR') + ' is the hypotenuse: ' + t('PR^{2}=PQ^{2}+QR^{2}') + '.'], 'EP6 hypotenuse and perimeter');
      } }] });

  /* ----- EP 7: trapezoid ----- */
  X.push({ num: '7', stem: function (sh) { return 'Points ' + ['W', 'X', 'Y', 'Z'].map(function (L, i) { return t(L + pt(sh.v[i])); }).join(', ') + '. Join ' + t('W\\to X\\to Y\\to Z\\to W') + '.'; },
    shared: function (r) {
      for (var g = 0; g < 400; g++) {
        var b1 = r.int(6, 10), b2 = r.int(2, b1 - 2), h = r.int(3, 6), x0 = -r.int(2, 5), y0 = -r.int(1, 4), off = r.int(1, b1 - b2 - 1);
        if (((b1 + b2) * h) % 2) continue;
        var v = [[x0, y0], [x0 + b1, y0], [x0 + off + b2, y0 + h], [x0 + off, y0 + h]];
        if (v.every(function (p) { return Math.abs(p[0]) <= 6 && Math.abs(p[1]) <= 6; })) { if (r.chance(0.2)) return { b1: 8, b2: 4, h: 5, v: [[-5, -3], [3, -3], [1, 2], [-3, 2]] }; return { b1: b1, b2: b2, h: h, v: v }; }
      }
      return { b1: 8, b2: 4, h: 5, v: [[-5, -3], [3, -3], [1, 2], [-3, 2]] };
    },
    parts: [
      { id: 'e7p', sub: 'plot', level: 'BEG', make: function (r, sh) {
        return polyPart('Plot the points and join them in order.', sh.v, [-7, 7], [-7, 7], 'Join ' + sh.v.map(function (p) { return t(pt(p)); }).join(' → ') + ' and back to ' + t(pt(sh.v[0])) + '.', ['Plot each point: across first, then up or down.'], 'EP7 plot trapezoid');
      } },
      { id: 'e7a', sub: 'a', level: 'BEG', make: function (r, sh) {
        var b1 = sh.b1, b2 = sh.b2;
        var fl = [{ label: t('WX='), name: 'WX', after: 'units' }, { label: t('ZY='), name: 'ZY', after: 'units' }];
        return KP.fields('The two horizontal sides, ' + t('WX') + ' and ' + t('ZY') + ', are parallel. How long is each of them?', fl,
          [K.number(b1, function (v) { return v === b1 + 1 ? { code: 'u5l1-count-dots', hint: 'Count the spaces, not the grid points.' } : null; }), K.number(b2, function (v) { return v === b2 + 1 ? { code: 'u5l1-count-dots', hint: 'Count the spaces, not the grid points.' } : null; })],
          [String(b1), String(b2)], t('WX=' + b1) + ', ' + t('ZY=' + b2),
          figGraph(sh.v, [-7, 7], [-7, 7], ['W', 'X', 'Y', 'Z']) + '<br>' + t('WX') + ': from ' + t('x=' + sh.v[0][0]) + ' to ' + t('x=' + sh.v[1][0]) + ', ' + t(b1) + ' units. ' + t('ZY') + ': from ' + t('x=' + sh.v[3][0]) + ' to ' + t('x=' + sh.v[2][0]) + ', ' + t(b2) + ' units. Both are horizontal, so they are parallel.',
          ['For a horizontal side, count across from one end to the other (or subtract the ' + t('x') + '-coordinates).'], 'EP7 parallel sides');
      } },
      { id: 'e7b', sub: 'b', level: 'BEG', make: function (r, sh) {
        var h = sh.h;
        return numPart('How far apart are the two parallel sides? (This is the height.)', h, function (v) { return v === h + 1 ? { code: 'u5l1-count-dots', hint: 'Count the spaces between the two lines.' } : (v === sh.v[2][1] + sh.v[0][1] && v !== h) ? { code: 'value', hint: 'Subtract the ' + t('y') + '-values: ' + t(sh.v[2][1] + '-(' + sh.v[0][1] + ')') + '.' } : null; },
          'The sides are at ' + t('y=' + sh.v[0][1]) + ' and ' + t('y=' + sh.v[2][1]) + ': ' + t(sh.v[2][1] + '-(' + sh.v[0][1] + ')=' + h) + ' units apart.', ['Subtract the ' + t('y') + '-coordinates of the two horizontal sides.'], 'EP7 height', { after: 'units' });
      } },
      { id: 'e7c', sub: 'c', level: 'EMG', make: function (r, sh) {
        var b1 = sh.b1, b2 = sh.b2, h = sh.h, A = (b1 + b2) * h / 2;
        return numPart('The area of a trapezoid is ' + t('\\tfrac{1}{2}(b_1+b_2)h') + '. Find the area.', A, function (v) {
          if (v === (b1 + b2) * h) return { code: 'u5l1-no-half', hint: 'Don’t forget the ' + t('\\tfrac{1}{2}') + '.' };
          if (v === b1 * h || v === b1 * b2) return { code: 'value', hint: 'Add the two parallel sides first: ' + t(b1 + '+' + b2) + '.' };
          if (v === b1 + b2 * h / 2 || v === (b1 + b2 * h) / 2) return { code: 'value', hint: 'Work out the bracket first: ' + t('(' + b1 + '+' + b2 + ')') + '.' };
          return null;
        }, t('A=\\tfrac{1}{2}(' + b1 + '+' + b2 + ')(' + h + ')=\\tfrac{1}{2}(' + (b1 + b2) + ')(' + h + ')=' + A) + ' square units.', ['Substitute ' + t('b_1=' + b1) + ', ' + t('b_2=' + b2) + ' and ' + t('h=' + h) + '.'], 'EP7 area', { after: 'square units' });
      } }] });

  /* ----- EP 8: horizontal / vertical lengths ----- */
  function segShared(r) {
    var types = r.chance(0.2) ? ['h', 'v', 'v', 'v'] : r.shuffle(['h', 'v', r.pick(['h', 'v']), r.pick(['h', 'v'])]), segs = [];
    var BK = [[[-6, 2], [5, 2]], [[3, -4], [3, 6]], [[-2, -5], [-2, 4]], [[-4, -6], [-4, 5]]];
    var book = r.chance(0.15);
    types.forEach(function (ty, i) {
      if (book) { segs.push(BK[i]); return; }
      var a = -r.int(1, 7), b = r.int(1, 7), c = nz(r, 1, 6);
      segs.push(ty === 'h' ? [[a, c], [b, c]] : [[c, a], [c, b]]);
    });
    return { segs: segs.map(function (s) { return r.chance(0.3) ? [s[1], s[0]] : s; }) };
  }
  X.push({ num: '8', section: 'Extra practice C — Distance and Midpoint Without a Formula', stem: function (sh) { return 'Each pair of points shares an ' + t('x') + '-coordinate or a ' + t('y') + '-coordinate, so the segment joining them is horizontal or vertical.<br>' + sh.segs.map(function (s, i) { return '(' + 'abcd'[i] + ') ' + t(pt(s[0])) + ' and ' + t(pt(s[1])); }).join('&nbsp;&nbsp; '); }, shared: segShared, parts: [
    { id: 'e8a', sub: 'lengths', level: 'BEG', make: function (r, sh) {
      var L = sh.segs.map(function (s) { return Math.abs(s[0][0] - s[1][0]) + Math.abs(s[0][1] - s[1][1]); });
      var fl = sh.segs.map(function (s, i) { return { label: '(' + 'abcd'[i] + ')', name: '(' + 'abcd'[i] + ')', after: 'units' }; });
      return KP.fields('Find the length of each segment by counting (or subtracting).', fl, sh.segs.map(function (s, i) {
        var hz = s[0][1] === s[1][1], a = hz ? s[0][0] : s[0][1], b = hz ? s[1][0] : s[1][1];
        return K.number(L[i], function (v) { if (v === Math.abs(Math.abs(a) - Math.abs(b)) && v !== L[i]) return { code: 'pair-sign', hint: 'The segment crosses an axis: count from ' + t(a) + ' to ' + t('0') + ' and then on to ' + t(b) + ' — that is ' + t('|' + b + '-(' + a + ')|') + '.' }; if (v === L[i] + 1) return { code: 'u5l1-count-dots', hint: 'Count spaces, not grid points.' }; return null; });
      }), L.map(String), L.map(function (x, i) { return '(' + 'abcd'[i] + ') ' + t(x); }).join(', '),
        sh.segs.map(function (s, i) { var hz = s[0][1] === s[1][1], a = hz ? s[0][0] : s[0][1], b = hz ? s[1][0] : s[1][1]; return '(' + 'abcd'[i] + ') the ' + t(hz ? 'x' : 'y') + '-coordinates differ: ' + t('|' + b + '-(' + a + ')|=' + L[i]) + ' units.'; }).join('<br>'),
        ['Subtract the two coordinates that are different (larger minus smaller).', 'If the segment crosses an axis, the two distances to the axis add up.'], 'EP8 lengths');
    } },
    { id: 'e8b', sub: 'direction', level: 'BEG', make: function (r, sh) {
      var want = {}; sh.segs.forEach(function (s, i) { want['s' + i] = s[0][1] === s[1][1] ? 'h' : 'v'; });
      return KP.grid('Is each segment horizontal or vertical?', sh.segs.map(function (s, i) { return { id: 's' + i, html: '(' + 'abcd'[i] + ') ' + t(pt(s[0]) + ',\\ ' + pt(s[1])) }; }), [{ id: 'h', html: 'horizontal' }, { id: 'v', html: 'vertical' }], want,
        { why: function (row) { var s = sh.segs[Number(row.slice(1))]; var sameY = s[0][1] === s[1][1]; return { code: 'same-y', hint: 'Check ' + t(pt(s[0]) + ',\\ ' + pt(s[1])) + ': the ' + t(sameY ? 'y' : 'x') + '-coordinates are equal. Same ' + t('y') + ' (same height) is horizontal; same ' + t('x') + ' is vertical.' }; } },
        sh.segs.map(function (s, i) { var sameY = s[0][1] === s[1][1]; return '(' + 'abcd'[i] + ') same ' + t(sameY ? 'y' : 'x') + ': <b>' + (sameY ? 'horizontal' : 'vertical') + '</b>'; }).join('<br>'), ['Same ' + t('y') + ' means the same height: a horizontal segment.'], 'EP8 direction');
    } }] });

  /* ----- EP 9: midpoints ----- */
  X.push({ num: '9', stem: 'The <b>midpoint</b> of a segment is the point exactly halfway along it. For a horizontal or vertical segment, <i>average</i> the two coordinates that differ and keep the one that stays the same.', parts: ['h', 'v', 'h', 'v'].map(function (ty, i) {
    var BK = [[[-5, 4], [3, 4]], [[2, -6], [2, 4]], [[-3, -5], [6, -5]], [[-1, 7], [-1, -2]]];
    return { id: 'e9' + 'abcd'[i], level: i < 2 ? 'BEG' : 'EMG', make: function (r) {
      var s;
      if (r.chance(0.12)) s = BK[i];
      else { var a, b; do { a = -r.int(1, 7); b = r.int(1, 7); } while (((b - a) % 2 === 0) !== (i < 2)); var c = nz(r, 1, 7); s = ty === 'h' ? [[a, c], [b, c]] : [[c, a], [c, b]]; if (r.chance(0.4)) s = [s[1], s[0]]; }
      var hz = s[0][1] === s[1][1], a0 = hz ? s[0][0] : s[0][1], b0 = hz ? s[1][0] : s[1][1], m = (a0 + b0) / 2, M = hz ? [m, s[0][1]] : [s[0][0], m];
      return pairPart('Find the midpoint of the segment from ' + t(pt(s[0])) + ' to ' + t(pt(s[1])) + '.', M[0], M[1], function (x, y) {
        var half = Math.abs(b0 - a0) / 2, mm = hz ? x : y, keep = hz ? y : x, kk = hz ? s[0][1] : s[0][0];
        if (feq(keep, kk) && feq(mm, a0 + b0)) return { code: 'u5l1-mid-sum', hint: 'You added the two coordinates. Now divide by ' + t('2') + ' to take the average.' };
        if (feq(keep, kk) && feq(mm, half)) return { code: 'u5l1-mid-diff', hint: 'That is half the <b>length</b>. The midpoint is ' + t(half) + ' units from an end: start at ' + t(a0) + ' and move ' + t(half) + '.' };
        return null;
      }, 'The ' + t(hz ? 'y' : 'x') + '-coordinate stays ' + t(hz ? s[0][1] : s[0][0]) + '. Average the ' + t(hz ? 'x' : 'y') + '-coordinates: ' + t('\\dfrac{' + a0 + '+(' + b0 + ')}{2}=\\dfrac{' + (a0 + b0) + '}{2}=' + num(m)) + '. Midpoint ' + t(pt(M)) + '.',
        ['Which coordinate stays the same? Keep it.', 'Average the other two: add them and divide by 2.'], 'EP9 midpoint ' + pt(s[0]) + pt(s[1]));
    } };
  }) });

  /* ----- EP 10: work backwards from the midpoint ----- */
  X.push({ num: '10', stem: '<b>Work backwards.</b> You are given one endpoint ' + t('A') + ' and the midpoint ' + t('M') + '. Find the other endpoint ' + t('B') + '.', parts: [0, 1].map(function (i) {
    return { id: 'e10' + 'ab'[i], level: 'PRG', make: function (r) {
      var hz = i === 0, A, M;
      if (r.chance(0.15)) { A = hz ? [-6, 3] : [2, -5]; M = hz ? [-1, 3] : [2, -1]; }
      else { var a = -r.int(1, 7), d = r.int(2, 6) * r.pick([1, 1, -1]), c = nz(r, 1, 6); if (d < 0) a = -a; A = hz ? [a, c] : [c, a]; M = hz ? [a + d, c] : [c, a + d]; }
      var B = [2 * M[0] - A[0], 2 * M[1] - A[1]], len = Math.abs(B[0] - A[0]) + Math.abs(B[1] - A[1]), step = len / 2;
      var fl = [pairField(t('B=')), { label: i === 0 ? 'Distance from ' + t('M') + ' to each endpoint:' : 'Length of the whole segment ' + t('AB') + ':', name: i === 0 ? 'Distance' : 'Length', after: 'units' }];
      var bChk = pairCheck(B[0], B[1], function (x, y) {
        if (feq(x, M[0]) && feq(y, M[1])) return { code: 'u5l1-mid-back', hint: 'That is the midpoint itself. ' + t('B') + ' is just as far past ' + t('M') + ' as ' + t('A') + ' is before it.' };
        if (feq(x, (A[0] + M[0]) / 2) && feq(y, (A[1] + M[1]) / 2)) return { code: 'u5l1-mid-back', hint: 'You found the point halfway between ' + t('A') + ' and ' + t('M') + '. Go the other way: past ' + t('M') + '.' };
        if (feq(x, M[0] + (M[0] - A[0]) / 2) && feq(y, M[1] + (M[1] - A[1]) / 2)) return { code: 'u5l1-back-half', hint: 'Move the <b>full</b> distance from ' + t('A') + ' to ' + t('M') + ' again, past ' + t('M') + '.' };
        return null;
      });
      var ans2 = i === 0 ? step : len;
      return KP.fields(t('A' + pt(A)) + ' and ' + t('M' + pt(M)) + '. Find ' + t('B') + (i === 0 ? ', then check that ' + t('M') + ' really is halfway.' : ', then state the length of the whole segment ' + t('AB') + '.'), fl,
        [bChk, K.number(ans2, function (v) { return i === 0 && v === len ? { code: 'value', hint: 'That is the whole length. How far is ' + t('M') + ' from <b>one</b> end?' } : i === 1 && v === step ? { code: 'value', hint: 'That is from ' + t('A') + ' to ' + t('M') + ' — only half. The whole segment goes from ' + t('A') + ' to ' + t('B') + '.' } : null; })],
        [pt(B), String(ans2)], t('B' + pt(B)) + ', ' + t(ans2) + ' units',
        'From ' + t('A') + ' to ' + t('M') + ' the ' + t(hz ? 'x' : 'y') + '-coordinate changes by ' + t((hz ? M[0] - A[0] : M[1] - A[1])) + '. Change it by the same amount again: ' + t('B' + pt(B)) + '.<br>' + (i === 0 ? t('M') + ' is ' + t(step) + ' units from ' + t('A') + ' and ' + t(step) + ' units from ' + t('B') + ' ✓' : t('AB') + ' is ' + t(step) + ' + ' + t(step) + ' = ' + t(len) + ' units.'),
        ['How far (and which way) is it from ' + t('A') + ' to ' + t('M') + '? Go that far again from ' + t('M') + '.'], 'EP10 endpoint from midpoint');
    } };
  }) });

  /* ----- EP 11–13: reflections ----- */
  var REFL = { x: { name: 'the ' + t('x') + '-axis', rule: '(x, -y)', f: function (p) { return [p[0], -p[1]]; }, words: 'keep ' + t('x') + ', change the sign of ' + t('y') },
    y: { name: 'the ' + t('y') + '-axis', rule: '(-x, y)', f: function (p) { return [-p[0], p[1]]; }, words: 'change the sign of ' + t('x') + ', keep ' + t('y') },
    o: { name: 'the origin', rule: '(-x, -y)', f: function (p) { return [-p[0], -p[1]]; }, words: 'change both signs' } };
  function reflDiag(p, k) {
    return function (x, y) {
      var q = [x, y];
      if (feq(q[0], p[0]) && feq(q[1], p[1])) return { code: 'u5l1-refl-none', hint: 'That is the original point. Reflecting moves it to the other side of ' + REFL[k].name + '.' };
      var other = Object.keys(REFL).filter(function (j) { return j !== k; });
      for (var i = 0; i < other.length; i++) { var w = REFL[other[i]].f(p); if (feq(q[0], w[0]) && feq(q[1], w[1])) return { code: other[i] === 'o' ? 'u5l1-refl-both' : 'u5l1-refl-axis', hint: 'That is the reflection in ' + REFL[other[i]].name + '. In ' + REFL[k].name + ': ' + REFL[k].words + '.' }; }
      return null;
    };
  }
  X.push({ num: '11', section: 'Extra practice D — Reflections in the Axes and in the Origin', stem: function (sh) { return 'Reflecting a point is like folding the plane along a line. Consider the point ' + t('T' + pt(sh.T)) + '.'; },
    shared: function (r) { var T = r.chance(0.15) ? [3, -4] : [nz(r, 1, 6), nz(r, 1, 6)]; return { T: T }; },
    parts: ['x', 'y', 'o'].map(function (k, i) {
      return { id: 'e11' + 'abc'[i], level: 'BEG', make: function (r, sh) {
        var T = sh.T, img = REFL[k].f(T);
        return pairPart('Reflect ' + t('T') + ' in <b>' + REFL[k].name + '</b>' + (k === 'o' ? ' (a half-turn)' : '') + '. Give the image ' + t("T'") + '.', img[0], img[1], reflDiag(T, k),
          'Reflect in ' + REFL[k].name + ': ' + REFL[k].words + '. ' + t('T' + pt(T) + '\\to T\'' + pt(img)) + '.' + HW.graph({ x: [-7, 7], y: [-7, 7], labels: 2, max: 240, points: [{ x: T[0], y: T[1], label: 'T' }, { x: img[0], y: img[1], label: "T'" }], aria: 'T and its image' }),
          [k === 'x' ? 'Folding along the ' + t('x') + '-axis flips the point up ↔ down: the ' + t('x') + '-coordinate stays the same.' : k === 'y' ? 'Folding along the ' + t('y') + '-axis flips the point left ↔ right: the ' + t('y') + '-coordinate stays the same.' : 'A half-turn about the origin flips the point both ways: left ↔ right and up ↔ down.'], 'EP11 reflect in ' + k, [pt(T)]);
      } };
    }).concat([{ id: 'e11d', sub: 'rules', level: 'EMG', make: function (r, sh) {
      var T = sh.T, rules = ['(x, -y)', '(-x, y)', '(-x, -y)', '(y, x)'], want = { x: '(x, -y)', y: '(-x, y)', o: '(-x, -y)' };
      var rows = ['x', 'y', 'o'].map(function (k) { return { id: k, html: 'Reflection in ' + REFL[k].name }; });
      return KP.grid('Use your three images of ' + t('T' + pt(T)) + ' to choose the sign rule for each reflection, in the form ' + t('(x, y)\\to(\\ ,\\ )') + '.', rows, rules.map(function (ru) { return { id: ru, html: t(ru) }; }), want,
        { why: function (row, got) { return { code: got === '(-x, -y)' ? 'u5l1-refl-both' : 'u5l1-refl-axis', hint: 'Look at ' + t('T' + pt(T)) + ' and its image in ' + REFL[row].name + ', ' + t(pt(REFL[row].f(T))) + ': which coordinate changed sign?' }; } },
        ['x', 'y', 'o'].map(function (k) { return 'In ' + REFL[k].name + ': ' + t('(x, y)\\to ' + REFL[k].rule) + ' — ' + REFL[k].words + ' (' + t(pt(T) + '\\to ' + pt(REFL[k].f(T))) + ').'; }).join('<br>'),
        ['Compare ' + t('T') + ' with each image: which signs changed?'], 'EP11 sign rules');
    } }]) });
  X.push({ num: '12', stem: function (sh) { return 'Apply the three reflection rules to each point: ' + sh.pts.map(function (p) { return t(pt(p)); }).join(', ') + '.'; },
    shared: function (r) {
      if (r.chance(0.15)) return { pts: [[-2, 5], [6, 1], [-4, -3], [0, -6]], ax: 'y' };
      var qs = r.sample(QOPT, 3), pts = qs.map(function (q) { return [SG[q][0] * r.int(1, 6), SG[q][1] * r.int(1, 6)]; }), ax = r.pick(['x', 'y']);
      var ap = ax === 'y' ? [0, nz(r, 1, 6)] : [nz(r, 1, 6), 0]; pts.splice(r.int(0, 3), 0, ap);
      return { pts: pts, ax: ax };
    },
    parts: ['x', 'y', 'o'].map(function (k, i) {
      return { id: 'e12' + 'abc'[i], level: 'BEG', make: function (r, sh) {
        var imgs = sh.pts.map(REFL[k].f);
        var fl = sh.pts.map(function (p) { return pairField(t(pt(p)) + '&nbsp;→'); });
        var p = KP.fields('Reflect each point in <b>' + REFL[k].name + '</b>.', fl, sh.pts.map(function (q, j) { return pairCheck(imgs[j][0], imgs[j][1], reflDiag(q, k)); }), imgs.map(pt), imgs.map(function (q) { return t(pt(q)); }).join(', '),
          'Rule ' + t('(x, y)\\to ' + REFL[k].rule) + ' (' + REFL[k].words + '):<br>' + sh.pts.map(function (q, j) { return t(pt(q) + '\\to ' + pt(imgs[j])); }).join('<br>'), ['Use the rule ' + t('(x, y)\\to ' + REFL[k].rule) + '.'], 'EP12 reflect in ' + k);
        var jm = sh.pts.findIndex(function (q, j) { return pt(q) !== pt(imgs[j]); });
        p.bad = [imgs.map(function (q, j) { return j === jm ? pt(sh.pts[j]) : pt(q); })];
        return p;
      } };
    }).concat([{ id: 'e12d', level: 'PRG', make: function (r, sh) {
      var j = sh.pts.findIndex(function (p) { return p[0] === 0 || p[1] === 0; }), P0 = sh.pts[j], onY = P0[0] === 0;
      var right = onY ? 'y' : 'x', other = onY ? 'x' : 'y';
      return KP.mc(r, 'One of the four points behaves differently under one of the reflections. Which point, which reflection, and why?', [
        { html: t(pt(P0)) + ' is unchanged by the reflection in the ' + t(right) + '-axis, because it already sits <b>on</b> the ' + t(right) + '-axis — the fold line passes through it.', right: true },
        { html: t(pt(P0)) + ' is unchanged by the reflection in the ' + t(other) + '-axis, because it is on an axis.', why: 'Reflect it in the ' + t(other) + '-axis: you get ' + t(pt(REFL[other].f(P0))) + ', a different point. Which axis does it sit on?' },
        { html: t(pt(P0)) + ' is unchanged by the reflection in the origin.', why: 'Reflected in the origin it becomes ' + t(pt(REFL.o.f(P0))) + ' — a different point.' },
        { html: t(pt(sh.pts[(j + 1) % 4])) + ' is unchanged by every reflection, because its coordinates are small.', why: 'Reflect it: ' + t(pt(sh.pts[(j + 1) % 4]) + '\\to ' + pt(REFL.x.f(sh.pts[(j + 1) % 4]))) + ' in the ' + t('x') + '-axis — it moves.' }],
        t(pt(P0)) + ' has ' + t((onY ? 'x' : 'y') + '=0') + ', so it lies on the ' + t(right) + '-axis. Reflecting in the ' + t(right) + '-axis gives ' + t(pt(REFL[right].f(P0))) + ' — the same point: the fold line passes through it.', ['Which point has a ' + t('0') + ' in it? What happens to ' + t('0') + ' when you change its sign?'], 'EP12 unchanged point');
    } }]) });
  X.push({ num: '13', stem: function (sh) {
      return 'Triangle ' + t('PQR') + ' has vertices ' + ['P', 'Q', 'R'].map(function (L, i) { return t(L + pt(sh.v[i])); }).join(', ') + '.' + figGraph(sh.v, [-7, 7], [-7, 7], ['P', 'Q', 'R']);
    },
    shared: function (r) {
      var a = r.int(2, 4), b = r.int(2, 4), x0 = r.int(1, 6 - a), y0 = r.int(1, 6 - b), Q0 = r.pick(['I', 'I', 'II', 'IV', 'III']), sg = SG[Q0];
      var v = [[x0, y0], [x0 + a, y0], [x0 + a, y0 + b]];
      if (r.chance(0.2)) { v = [[1, 2], [5, 2], [5, 5]]; a = 4; b = 3; sg = [1, 1]; Q0 = 'I'; }
      v = v.map(function (p) { return [p[0] * sg[0], p[1] * sg[1]]; });
      var ax = r.chance(0.7) ? 'x' : 'y';
      return { v: v, a: a, b: b, ax: ax, img: v.map(REFL[ax].f), Q0: Q0 };
    },
    parts: [
      { id: 'e13p', sub: 'image', level: 'BEG', make: function (r, sh) {
        var img = sh.img;
        return polyPart('Draw the image of the triangle after a reflection in <b>' + REFL[sh.ax].name + '</b> (plot ' + t("P'") + ', ' + t("Q'") + ', ' + t("R'") + ' and join them).', img, [-7, 7], [-7, 7],
          'Reflect each vertex (' + REFL[sh.ax].words + '): ' + sh.v.map(function (p, i) { return t(pt(p) + '\\to ' + pt(img[i])); }).join(', ') + ', then join them.', ['Reflect one vertex at a time, then join the three images.'], 'EP13 draw image');
      } },
      { id: 'e13a', sub: 'a', level: 'BEG', make: function (r, sh) {
        var img = sh.img, fl = ["P'", "Q'", "R'"].map(function (L) { return pairField(t(L)); });
        return KP.fields('List the coordinates of ' + t("P'") + ', ' + t("Q'") + ' and ' + t("R'") + '.', fl, img.map(function (q, i) { return pairCheck(q[0], q[1], reflDiag(sh.v[i], sh.ax)); }), img.map(pt), img.map(function (q, i) { return t(["P'", "Q'", "R'"][i] + pt(q)); }).join(', '),
          'Reflection in ' + REFL[sh.ax].name + ': ' + t('(x, y)\\to ' + REFL[sh.ax].rule) + '.<br>' + sh.v.map(function (p, i) { return t(['P', 'Q', 'R'][i] + pt(p) + '\\to ' + ["P'", "Q'", "R'"][i] + pt(img[i])); }).join('<br>'), ['Use the rule ' + t('(x, y)\\to ' + REFL[sh.ax].rule) + '.'], 'EP13 image coords');
      } },
      { id: 'e13b', sub: 'b', level: 'BEG', make: function (r, sh) {
        var q1 = quadOf(sh.v[0]), q2 = quadOf(sh.img[0]), want = { o: q1, i: q2 };
        return KP.grid('Which quadrant is each triangle in?', [{ id: 'o', html: t('PQR') }, { id: 'i', html: t("P'Q'R'") }], QOPT.map(function (q) { return { id: q, html: q }; }), want, { colHead: 'Quadrant', why: function (row) { return { code: 'quad-sign', hint: 'Look at the signs of the vertices of ' + (row === 'o' ? t('PQR') : t("P'Q'R'")) + ': ' + SIGNS + '.' }; } },
          t('PQR') + ': ' + t(QSIGN[q1]) + ', Quadrant ' + q1 + '. ' + t("P'Q'R'") + ': ' + t(QSIGN[q2]) + ', Quadrant ' + q2 + '.', ['Use the signs of the coordinates.'], 'EP13 quadrants');
      } },
      { id: 'e13c', sub: 'c', level: 'EMG', make: function (r, sh) {
        var A = sh.a * sh.b / 2, fl = [{ label: 'Area of ' + t('PQR'), name: 'PQR', after: 'sq. units' }, { label: 'Area of ' + t("P'Q'R'"), name: "P'Q'R'", after: 'sq. units' }];
        var ch = K.number(A, function (v) { return v === sh.a * sh.b ? { code: 'u5l1-no-half', hint: 'A triangle is half a rectangle: ' + t('\\tfrac{1}{2}bh') + '.' } : null; });
        return KP.fields('Find the area of each triangle. (What do you notice?)', fl, [ch, ch], [String(A), String(A)], 'both ' + t(A) + ' square units',
          'Legs ' + t(sh.a) + ' and ' + t(sh.b) + ' in both: ' + t('A=\\tfrac{1}{2}(' + sh.a + ')(' + sh.b + ')=' + A) + ' square units each. A reflection changes the position, not the size or shape.', ['Count the horizontal and vertical sides, then use ' + t('\\tfrac{1}{2}bh') + '.'], 'EP13 areas');
      } }] });

  /* ----- EP 14–18: working backwards and puzzles ----- */
  X.push({ num: '14', section: 'Extra practice E — Working Backwards and Coordinate Puzzles', stem: function (sh) { return 'Three vertices of a rectangle are ' + sh.given.map(function (p) { return t(pt(p)); }).join(', ') + '.'; },
    shared: function (r) {
      var w, h, x0 = r.int(-4, 3), y0 = r.int(-4, 3);
      do { w = r.int(2, 6); h = r.chance(0.5) ? w : r.int(2, 6); } while (2 * (w + h) === w * h); // perimeter ≠ area, so the two can't be confused
      if (r.chance(0.2)) { w = 5; h = 5; x0 = 1; y0 = 2; } // the booklet's (1,2), (6,2), (6,7)
      var c = [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
      return { w: w, h: h, given: c.slice(0, 3), miss: c[3] };
    },
    parts: [
      { id: 'e14a', level: 'EMG', make: function (r, sh) {
        var m = sh.miss, g = sh.given;
        return pairPart('Find the coordinates of the fourth vertex.', m[0], m[1], function (x, y) { if (feq(x, g[1][0]) && feq(y, g[0][1] + g[2][1] - g[1][1])) return { code: 'u5l1-fourth', hint: 'Plot the three points. The missing corner is across from ' + t(pt(g[1])) + ', not next to it.' }; return null; },
          figGraph(g.concat([m]), rangeOf(g, 1, 1), rangeOf(g, 1, 1)) + '<br>The missing corner takes its ' + t('x') + ' from ' + t(pt(g[0])) + ' and its ' + t('y') + ' from ' + t(pt(g[2])) + ': ' + t(pt(m)) + '.', ['Plot the three points; the fourth corner lines up with two of them.'], 'EP14 fourth vertex');
      } },
      { id: 'e14b', level: 'BEG', make: function (r, sh) {
        var w = sh.w, h = sh.h, fl = [{ label: 'Perimeter', name: 'Perimeter', after: 'units' }, { label: 'Area', name: 'Area', after: 'square units' }];
        return KP.fields('Find the perimeter and the area of the rectangle.', fl, [K.number(2 * (w + h), function (v) { return v === w * h ? { code: 'u5l1-area-perim', hint: 'That is the area. The perimeter goes around the outside.' } : v === w + h ? { code: 'u5l1-half-perim', hint: 'Go all the way around: four sides.' } : null; }),
          K.number(w * h, function (v) { return v === 2 * (w + h) ? { code: 'u5l1-area-perim', hint: 'That is the perimeter. Area = length × width.' } : null; })],
          [String(2 * (w + h)), String(w * h)], 'perimeter ' + t(2 * (w + h)) + ', area ' + t(w * h), 'Sides ' + t(w) + ' and ' + t(h) + ': ' + t('P=2(' + w + '+' + h + ')=' + 2 * (w + h)) + ' units, ' + t('A=' + w + '\\times ' + h + '=' + w * h) + ' square units.', ['Find the two side lengths by subtracting coordinates.'], 'EP14 P and A');
      } },
      { id: 'e14c', level: 'PRG', make: function (r, sh) {
        var sq = sh.w === sh.h, g = sh.given;
        return KP.mc(r, 'Does this rectangle deserve a more specific name? How do the side lengths show it?', [
          { html: 'Yes — it is a <b>square</b>: ' + t(pt(g[0])) + ' to ' + t(pt(g[1])) + ' is ' + sh.w + ' units and ' + t(pt(g[1])) + ' to ' + t(pt(g[2])) + ' is ' + sh.h + ' units, so all four sides are equal.', right: sq, why: sq ? null : 'Check the lengths: ' + sh.w + ' and ' + sh.h + ' are not equal.' },
          { html: 'No — its sides are ' + sh.w + ' and ' + sh.h + ' units, so it is just a rectangle.', right: !sq, why: sq ? 'The sides are ' + sh.w + ' and ' + sh.h + ' — equal! A rectangle with all four sides equal has a special name.' : null },
          { html: 'Yes — it is a <b>rhombus</b>, because it has four corners.', why: 'Every four-sided figure has four corners. Compare the side lengths.' },
          { html: 'Yes — it is a <b>trapezoid</b>, because two sides are horizontal.', why: 'A rectangle has two pairs of parallel sides. Compare the side lengths.' }],
          'Horizontal side ' + t(sh.w) + ', vertical side ' + t(sh.h) + '. ' + (sq ? 'All four sides are equal, so it is a <b>square</b>.' : 'The sides are different, so it is just a rectangle (not a square).'), ['Compare the horizontal and vertical side lengths.'], 'EP14 square?', true);
      } }] });
  X.push({ num: '15', stem: function (sh) { return '<b>Parallelogram puzzle.</b> Three vertices of a parallelogram are ' + t('E' + pt(sh.E)) + ', ' + t('F' + pt(sh.F)) + ' and ' + t('G' + pt(sh.G)) + '. More than one point could be the fourth vertex, because any one of the three given points may be the one “opposite” the missing one.' + labelledGraph({ x: [-8, 8], y: [-8, 8], labels: 2, max: 280, aria: 'points E, F, G' }, [{ x: sh.E[0], y: sh.E[1], label: 'E' }, { x: sh.F[0], y: sh.F[1], label: 'F' }, { x: sh.G[0], y: sh.G[1], label: 'G' }]); },
    shared: function (r) {
      for (var g = 0; g < 400; g++) {
        var ex0 = r.int(-5, 0), ey = r.int(-4, 1), w = r.int(3, 5), gx = ex0 + w + r.int(-2, 3), gy = ey + r.int(2, 4);
        var E = [ex0, ey], F = [ex0 + w, ey], G = [gx, gy];
        if (r.chance(0.2)) { E = [-4, -2]; F = [0, -2]; G = [2, 1]; }
        var c = [[E[0] + G[0] - F[0], E[1] + G[1] - F[1]], [E[0] + F[0] - G[0], E[1] + F[1] - G[1]], [F[0] + G[0] - E[0], F[1] + G[1] - E[1]]];
        if (c.concat([E, F, G]).every(function (p) { return Math.abs(p[0]) <= 8 && Math.abs(p[1]) <= 8; })) return { E: E, F: F, G: G, oppF: c[0], oppG: c[1], oppE: c[2] };
      }
      return { E: [-4, -2], F: [0, -2], G: [2, 1], oppF: [-2, 1], oppG: [-6, -5], oppE: [6, 1] };
    },
    parts: [
      { id: 'e15a', level: 'ADV', make: function (r, sh) {
        var D = sh.oppF;
        return pairPart('Find the fourth vertex ' + t('D') + ' if ' + t('EF') + ' and the missing side ' + t('GD') + ' are a pair of parallel sides (so ' + t('D') + ' is the vertex opposite ' + t('F') + ').', D[0], D[1], function (x, y) {
          if (feq(x, sh.oppE[0]) && feq(y, sh.oppE[1])) return { code: 'u5l1-fourth', hint: 'That point is opposite ' + t('E') + '. Here ' + t('GD') + ' must match ' + t('FE') + ': from ' + t('G') + ', move the way you move from ' + t('F') + ' to ' + t('E') + '.' };
          if (feq(x, sh.oppG[0]) && feq(y, sh.oppG[1])) return { code: 'u5l1-fourth', hint: 'That point is opposite ' + t('G') + '. Start from ' + t('G') + ' and move the way you move from ' + t('F') + ' to ' + t('E') + '.' };
          return null;
        }, 'From ' + t('F') + ' to ' + t('E') + ' is ' + t((sh.E[0] - sh.F[0]) + '') + ' across and ' + t((sh.E[1] - sh.F[1]) + '') + ' up. Do the same from ' + t('G' + pt(sh.G)) + ': ' + t('D' + pt(D)) + '. (Opposite sides of a parallelogram are equal and parallel.)',
          ['Opposite sides of a parallelogram are parallel and the same length.', 'Side ' + t('GD') + ' is a copy of side ' + t('FE') + ': move from ' + t('G') + ' the same way you move from ' + t('F') + ' to ' + t('E') + '.'], 'EP15 opposite F');
      } },
      { id: 'e15b', level: 'MAS', make: function (r, sh) {
        var all = [sh.oppF, sh.oppG, sh.oppE];
        var p = KP.pairs('List <b>every</b> possible position of the fourth vertex.', all, {}, '<b>Opposite ' + t('F') + '</b>: ' + t(pt(sh.oppF)) + ' (from ' + t('G') + ', move like ' + t('F\\to E') + ').<br><b>Opposite ' + t('G') + '</b>: ' + t(pt(sh.oppG)) + ' (from ' + t('E') + ', move like ' + t('G\\to F') + ').<br><b>Opposite ' + t('E') + '</b>: ' + t(pt(sh.oppE)) + ' (from ' + t('G') + ', move like ' + t('E\\to F') + ').' +
          HW.graph({ x: [-8, 8], y: [-8, 8], labels: 2, max: 280, segs: [{ pts: [sh.E, sh.F, sh.G, sh.oppF, sh.E] }, { pts: [sh.E, sh.F, sh.oppE, sh.G, sh.E], dash: true }, { pts: [sh.E, sh.oppG, sh.F, sh.G, sh.E], dash: true }], points: [sh.E, sh.F, sh.G].map(function (q, i) { return { x: q[0], y: q[1], label: 'EFG'[i] }; }).concat(all.map(function (q) { return { x: q[0], y: q[1], open: true }; })), aria: 'three parallelograms' }),
          ['Each of ' + t('E') + ', ' + t('F') + ', ' + t('G') + ' can be the vertex opposite the missing one — try all three.', 'For each case, copy one side: opposite sides of a parallelogram are equal and parallel.'], 'EP15 all fourth vertices');
        var c0 = p.check;
        p.check = function (resp) {
          var res = c0(resp); if (res.v !== 'wrong') return res;
          var s = String(resp || ''), got = (s.match(/\(([^()]*)\)/g) || []).map(function (m0) { var q = readPair(m0); return q.bad || q.empty ? null : [q.x, q.y]; }).filter(Boolean);
          var hasAll = all.filter(function (a) { return got.some(function (g2) { return feq(g2[0], a[0]) && feq(g2[1], a[1]); }); });
          var extra = got.filter(function (g2) { return !all.some(function (a) { return feq(g2[0], a[0]) && feq(g2[1], a[1]); }); });
          if (extra.length) return wrong('u5l1-par-extra', t(pt(extra[0])) + ' doesn’t make a parallelogram with ' + t('E') + ', ' + t('F') + ' and ' + t('G') + '. Check it by comparing opposite sides.');
          if (hasAll.length < 3) return wrong('u5l1-par-missing', 'You have ' + hasAll.length + ' of the possible fourth vertices. Make each of ' + t('E') + ', ' + t('F') + ' and ' + t('G') + ' in turn the vertex opposite the missing one.');
          return res;
        };
        p.bad = ['\\{' + pt(sh.oppF) + '\\}', '\\{' + pt(sh.oppF) + ', ' + pt(sh.oppE) + '\\}'];
        return p;
      } },
      { id: 'e15c', level: 'PRG', make: function (r, sh) {
        return numPart('How many different parallelograms are possible in total?', 3, function (v) { return v === 1 ? { code: 'u5l1-par-missing', hint: 'The missing vertex can be opposite ' + t('E') + ', opposite ' + t('F') + ' or opposite ' + t('G') + '.' } : v === 4 ? { code: 'u5l1-par-extra', hint: 'Count the choices for which given vertex is opposite the missing one.' } : null; },
          'Any one of the three given points can be the vertex opposite the missing one, so there are <b>3</b> possible fourth vertices and <b>3</b> parallelograms.', ['How many choices are there for the vertex opposite the missing one?'], 'EP15 how many');
      } }] });
  X.push({ num: '16', stem: function (sh) { return 'Three vertices of a square are ' + sh.given.map(function (p) { return t(pt(p)); }).join(', ') + '.'; },
    shared: function (r) {
      var s = r.pick([2, 3, 5]), x0 = -r.int(0, s), y0 = -r.int(0, s); // not 4: a 4 × 4 square has perimeter = area
      if (r.chance(0.2)) { s = 3; x0 = -2; y0 = -2; }
      var c = [[x0, y0 + s], [x0 + s, y0 + s], [x0 + s, y0], [x0, y0]], k = r.int(0, 3), turn = c.slice(k).concat(c.slice(0, k));
      if (r.chance(0.2)) { turn = [[-2, 1], [1, 1], [1, -2], [-2, -2]]; s = 3; } // the booklet's square
      return { s: s, given: turn.slice(0, 3), miss: turn[3], all: turn };
    },
    parts: [
      { id: 'e16a', level: 'EMG', make: function (r, sh) {
        var m = sh.miss;
        return pairPart('Find the fourth vertex.', m[0], m[1], null, figGraph(sh.all, rangeOf(sh.all, 1, 1), rangeOf(sh.all, 1, 1)) + '<br>The missing corner lines up with ' + t(pt(sh.given[0])) + ' and ' + t(pt(sh.given[2])) + ': ' + t(pt(m)) + '.', ['Plot the three points; the fourth corner lines up with two of them.'], 'EP16 fourth vertex');
      } },
      { id: 'e16b', level: 'BEG', make: function (r, sh) {
        var s = sh.s, fl = [{ label: 'Side', name: 'Side', after: 'units' }, { label: 'Perimeter', name: 'Perimeter', after: 'units' }, { label: 'Area', name: 'Area', after: 'square units' }];
        return KP.fields('Find the side length, the perimeter and the area.', fl, [K.number(s), K.number(4 * s, function (v) { return v === s * s && s !== 4 ? { code: 'u5l1-area-perim', hint: 'That is the area. Perimeter = 4 sides.' } : v === 2 * s ? { code: 'u5l1-half-perim', hint: 'A square has four sides.' } : null; }), K.number(s * s, function (v) { return v === 4 * s && s !== 4 ? { code: 'u5l1-area-perim', hint: 'That is the perimeter. Area = side × side.' } : null; })],
          [String(s), String(4 * s), String(s * s)], 'side ' + t(s) + ', perimeter ' + t(4 * s) + ', area ' + t(s * s), 'Side ' + t(s) + ' units; ' + t('P=4(' + s + ')=' + 4 * s) + ' units; ' + t('A=' + s + '^{2}=' + s * s) + ' square units.', ['Subtract coordinates to get the side.'], 'EP16 side P A');
      } },
      { id: 'e16c', level: 'EMG', make: function (r, sh) {
        var xs = sh.all.map(function (p) { return p[0]; }), ys = sh.all.map(function (p) { return p[1]; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
        var want = QOPT.filter(function (q) { var s = SG[q]; return (s[0] > 0 ? x1 > 0 : x0 < 0) && (s[1] > 0 ? y1 > 0 : y0 < 0); });
        return selectPart('Which quadrants does this square pass through? Tap every one.', QOPT, want, function (extra, missing) {
          return { code: 'u5l1-sq-quads', hint: 'The square goes from ' + t('x=' + x0) + ' to ' + t('x=' + x1) + ' and from ' + t('y=' + y0) + ' to ' + t('y=' + y1) + '. ' + (missing.length ? 'Does it reach Quadrant ' + missing[0] + '?' : 'Does it really reach Quadrant ' + extra[0] + '?') };
        }, figGraph(sh.all, rangeOf(sh.all, 1, 1), rangeOf(sh.all, 1, 1)) + '<br>' + (want.length === 4 ? 'The square straddles both axes, so it passes through <b>all four</b> quadrants.' : 'It passes through Quadrant' + (want.length > 1 ? 's ' : ' ') + want.join(' and ') + '.'), ['Sketch the square. Does it cross the ' + t('x') + '-axis? The ' + t('y') + '-axis?'], 'EP16 quadrants', function (q) { return 'Quadrant ' + q; });
      } }] });
  X.push({ num: '17', stem: function (sh) { return 'Think about <b>every</b> point whose two coordinates are ' + (sh.eq ? 'equal (that is, ' + t('x=y') + ')' : 'opposites (that is, ' + t('y=-x') + ')') + '.'; },
    shared: function (r) { return { eq: r.chance(0.7) }; },
    parts: [
      { id: 'e17a', level: 'PRG', make: function (r, sh) {
        var e = sh.eq, target = { pts: [], pieces: [{ v: [[-5, e ? -5 : 5], [5, e ? 5 : -5]], s: 'arrow', e: 'arrow' }], join: 'none' }, base = exactChk(target, { wrong: [
          { is: { pts: [], pieces: [{ v: [[-5, e ? -5 : 5], [5, e ? 5 : -5]], s: 'closed', e: 'closed' }], join: 'none' }, code: 'graph-arrows', hint: 'The points go on forever (' + t(pt(e ? [100, 100] : [100, -100])) + ' works too): put <b>arrows</b> on both ends.' },
          { is: { pts: [], pieces: [{ v: [[-5, e ? 5 : -5], [5, e ? -5 : 5]], s: 'arrow', e: 'arrow' }], join: 'none' }, code: 'u5l1-sq-quads', hint: 'Test a point on your line, e.g. ' + t(pt([2, e ? -2 : 2])) + ': are its coordinates ' + (e ? 'equal' : 'opposites') + '?' }] });
        return drawPart('Sketch where all of these points are. (Plot a few, then use <b>╱ Line</b>; use <b>●○ Ends</b> to put arrows on the ends if the points go on forever.)', { x: [-5, 5], y: [-5, 5], labels: 1, tools: ['line', 'ends', 'point'] }, base, target,
          'Points like ' + [-3, -1, 0, 2, 4].map(function (x) { return t(pt([x, e ? x : -x])); }).join(', ') + ' all lie on one straight line through the origin, which ' + (e ? 'rises' : 'falls') + ' one unit for every unit to the right. It goes on forever both ways: arrows on both ends.',
          ['Plot a few points with ' + (e ? 'equal' : 'opposite') + ' coordinates, e.g. ' + t(pt([2, e ? 2 : -2])) + ' and ' + t(pt([-3, e ? -3 : 3])) + '.', 'Do they line up? Does the pattern stop anywhere?'], 'EP17 sketch ' + (e ? 'y=x' : 'y=-x'),
          [{ pts: [[-2, e ? -2 : 2], [0, 0], [2, e ? 2 : -2]], pieces: [], join: 'none' }]);
      } },
      { id: 'e17b', level: 'PRG', make: function (r, sh) {
        var e = sh.eq, inQ = e ? 'I and III' : 'II and IV', notQ = e ? 'II and IV' : 'I and III';
        return KP.mc(r, 'Which quadrants do these points pass through, and which do they never enter?', [
          { html: 'They pass through Quadrants ' + inQ + ' (and the origin); they never enter Quadrants ' + notQ + ', because there ' + t('x') + ' and ' + t('y') + ' have ' + (e ? 'opposite' : 'the same') + ' signs and so can’t be ' + (e ? 'equal' : 'opposites') + '.', right: true },
          { html: 'They pass through Quadrants ' + notQ + '; they never enter Quadrants ' + inQ + '.', why: 'Test ' + t(pt([3, e ? 3 : -3])) + ': it is one of the points, and it is in Quadrant ' + (e ? 'I' : 'IV') + '.' },
          { html: 'They pass through all four quadrants.', why: 'Try to find one in Quadrant ' + (e ? 'II' : 'I') + ': its coordinates would have ' + (e ? 'opposite' : 'the same') + ' signs. Can they be ' + (e ? 'equal' : 'opposites') + '?' },
          { html: 'Only Quadrant ' + (e ? 'I' : 'II') + ', because the coordinates must be positive.', why: 'Negative numbers work too: ' + t(pt([-4, e ? -4 : 4])) + ' is one of the points.' }],
          (e ? 'Equal coordinates have the same sign: both positive (Quadrant I) or both negative (Quadrant III), plus ' + t('(0, 0)') + '. In Quadrants II and IV the signs are opposite, so ' + t('x=y') + ' is impossible there.' : 'Opposite coordinates have opposite signs: Quadrant II ' + t('(-,+)') + ' or IV ' + t('(+,-)') + ', plus ' + t('(0, 0)') + '. In Quadrants I and III the signs are the same, so ' + t('y=-x') + ' is impossible there (except at 0).'),
          ['What signs can two ' + (e ? 'equal' : 'opposite') + ' numbers have?'], 'EP17 quadrants of ' + (e ? 'y=x' : 'y=-x'));
      } }] });
  X.push({ num: '18', stem: function (sh) { return '<b>Stretch.</b> Consider every point ' + t('(x, y)') + ' whose coordinates are both integers with ' + t(-sh.a + '\\le x\\le ' + sh.b) + ' and ' + t(-sh.c + '\\le y\\le ' + sh.d) + '.'; },
    shared: function (r) { if (r.chance(0.25)) return { a: 2, b: 2, c: 2, d: 2 }; return { a: r.int(1, 4), b: r.int(1, 4), c: r.int(1, 4), d: r.int(1, 4) }; },
    parts: [
      { id: 'e18a', level: 'ADV', make: function (r, sh) {
        var nx = sh.a + sh.b + 1, ny = sh.c + sh.d + 1;
        return numPart('How many such points are there?', nx * ny, function (v) {
          if (v === (sh.a + sh.b) * (sh.c + sh.d)) return { code: 'u5l1-grid-count', hint: 'From ' + t(-sh.a) + ' to ' + t(sh.b) + ' there are ' + nx + ' integers, not ' + (sh.a + sh.b) + ' — don’t forget ' + t('0') + ' (count both ends).' };
          if (v === nx + ny) return { code: 'u5l1-grid-count', hint: 'Every ' + t('x') + ' goes with every ' + t('y') + ': multiply, don’t add.' };
          return null;
        }, t('x') + ' can be ' + t(-sh.a) + ' to ' + t(sh.b) + ': ' + t(nx) + ' values. ' + t('y') + ' can be ' + t(-sh.c) + ' to ' + t(sh.d) + ': ' + t(ny) + ' values. Every pairing is a point: ' + t(nx + '\\times ' + ny + '=' + nx * ny) + '.', ['How many integers are there from ' + t(-sh.a) + ' to ' + t(sh.b) + '? (Include ' + t('0') + '.)', 'Picture the points as a rectangle of dots.'], 'EP18 total points');
      } },
      { id: 'e18b', level: 'MAS', make: function (r, sh) {
        var nx = sh.a + sh.b + 1, ny = sh.c + sh.d + 1, ax = nx + ny - 1;
        return numPart('How many of them lie in <b>no</b> quadrant?', ax, function (v) {
          if (v === nx + ny) return { code: 'u5l1-axis-double', hint: 'The origin is on <b>both</b> axes — it was counted twice.' };
          if (v === nx + ny - 2) return { code: 'u5l1-axis-noorigin', hint: 'The origin ' + t('(0, 0)') + ' is in no quadrant too — count it once.' };
          if (v === sh.a + sh.b + sh.c + sh.d) return { code: 'u5l1-axis-noorigin', hint: 'You counted the axis points without the origin. Add it once.' };
          return null;
        }, 'A point is in no quadrant when it is on an axis. On the ' + t('x') + '-axis (' + t('y=0') + '): ' + t(nx) + ' points. On the ' + t('y') + '-axis (' + t('x=0') + '): ' + t(ny) + ' points. The origin is in both lists, so ' + t(nx + '+' + ny + '-1=' + ax) + '.', ['Which points are in no quadrant? Count those on each axis — and watch the origin.'], 'EP18 on axes');
      } },
      { id: 'e18c', level: 'ADV', make: function (r, sh) {
        var q3 = sh.a * sh.c;
        return numPart('How many of them lie in Quadrant III?', q3, function (v) {
          if (v === (sh.a + 1) * (sh.c + 1)) return { code: 'u5l1-q3-edge', hint: 'Points on the axes (with a ' + t('0') + ') are in no quadrant. Quadrant III needs ' + t('x<0') + ' and ' + t('y<0') + '.' };
          if (v === sh.b * sh.d) return { code: 'quad-sign', hint: 'That is Quadrant I. Quadrant III is ' + t('(-,-)') + '.' };
          return null;
        }, 'Quadrant III needs ' + t('x') + ' negative (' + t(-sh.a) + ' to ' + t('-1') + ': ' + sh.a + ' values) and ' + t('y') + ' negative (' + t(-sh.c) + ' to ' + t('-1') + ': ' + sh.c + ' values): ' + t(sh.a + '\\times ' + sh.c + '=' + q3) + ' points.', ['Quadrant III: both coordinates negative, neither zero.'], 'EP18 Q3 count');
      } }] });

  HW.defineLesson({
    id: 'u5l1', unit: 5, num: '1', title: 'The Cartesian Plane and Plotting Points', outcome: 'RF2',
    blurb: 'Axes, the origin and the four quadrants; naming, reading and plotting points from ordered pairs.',
    questions: QUESTIONS, extra: X
  });
})(window);
