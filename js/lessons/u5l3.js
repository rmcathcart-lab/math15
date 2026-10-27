/* Math 15 · Unit 5 · Lesson 3 — Describing Relationships Between Two Quantities (RF2, RF4, RF1)
 * Assignment 3 (u5_L03.tex, Questions 1–13) and the Lesson 3 Extra Practice (u5_EP03.tex, Questions 1–19).
 * Every part is a generator: same structure and idea as the booklet question (the booklet's numbers are among the
 * possible values), new numbers / situations from the seed. Model: Math 10C u5l2.js (ordered pairs, mapping diagrams,
 * tables, graphs, linear or not) and u5l8.js (story graphs).
 * Outcomes: RF2 (a relation as ordered pairs, a table, a mapping diagram, a graph) by default; RF1 for independent /
 * dependent variables and for interpreting or sketching graphs of situations; RF4 for linear / non-linear (first
 * differences, rates) and for extending a linear relation.
 * Conversions: "write as a set of ordered pairs" -> a pairs box (any order); "complete a table" -> number boxes (any
 * column order); "represent with a mapping diagram" -> the arrow-diagram drawer (inputs on the left, outputs on the
 * right, the student draws the arrows); "plot / sketch" -> the graph pad; "explain / describe / write a story" ->
 * multiple choice whose options are reasons or stories.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 16(c) (when and where one runner catches the other, from a
 * graph) and Extra 15(b) is Advancing. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, DR = HW.draw;

  HW.addCodes({
    'var-swap': 'Swapped independent and dependent variables', 'var-same': 'Gave the same variable twice', 'graph-swap': 'Plotted (y, x) instead of (x, y)', 'graph-points': 'Point misplaced',
    'arrows-flip': 'Arrows reversed', 'pairs-flip': 'Ordered pairs backwards', 'pairs-missing': 'Missing ordered pairs', pairs: 'Wrong ordered pairs', 'diff-rev': 'Subtracted in the wrong order',
    'said-linear': 'Called a nonlinear relation linear', 'said-nonlinear': 'Called a linear relation nonlinear', 'lin-word': 'Didn’t type linear/nonlinear', 'diff-unit': 'Divided the change by the x-step',
    'story-bend': 'Stage drawn with the wrong bend (straight vs curved, steeper vs flatter)', 'story-zero': 'Graph reaches zero when it shouldn’t (or not when it should)', 'story-lines': 'Points instead of a line',
    'u5l3-io-swap': 'Inputs and outputs swapped in the table', 'u5l3-col': 'A table column that isn’t one of the pairs', 'u5l3-mult': 'Multiplied by the wrong number', 'u5l3-off-by-one': 'Used the wrong input',
    'u5l3-sum-four': 'Added only the four given outputs', 'u5l3-rate-flip': 'Divided time by distance (or input by output)', 'u5l3-rate-total': 'Used a total instead of a rate',
    'u5l3-net-dist': 'Gave the distance from home instead of the distance travelled', 'u5l3-interval': 'Wrong time interval', 'u5l3-below-room': 'Cooled below room temperature', 'u5l3-no-level': 'Graph doesn’t level off',
    'u5l3-head-start': 'Ignored the head start', 'u5l3-start-time': 'Measured the time from the wrong start', 'u5l3-full': 'Thought the tank was full', 'u5l3-catch': 'Wrong catch-up time or place'
  });
  HW.addPartial({ 'u5l3-io-swap': 'b', 'u5l3-col': 's', 'u5l3-mult': 'n', 'u5l3-off-by-one': 's', 'u5l3-sum-four': 'b', 'u5l3-rate-flip': 'b', 'u5l3-rate-total': 'b', 'u5l3-net-dist': 'b',
    'u5l3-interval': 's', 'u5l3-below-room': 'b', 'u5l3-no-level': 'b', 'u5l3-head-start': 'b', 'u5l3-start-time': 'b', 'u5l3-full': 'n', 'u5l3-catch': 'b' });

  /* ---------- small helpers ---------- */
  function feq(a, b) { return Math.abs(a - b) < 1e-9; }
  function num(x) { return String(Math.round(x * 1e6) / 1e6); }
  function pt(p) { return '(' + num(p[0]) + ', ' + num(p[1]) + ')'; }
  function ptsTex(ps) { return ps.map(function (p) { return '(' + num(p[0]) + ',\\ ' + num(p[1]) + ')'; }).join(',\\ '); }
  function seqTex(ys) { return ys.map(num).join(',\\ '); }
  function htable(h1, h2, xs, ys) { return HW.valueTable([[h1].concat(xs), [h2].concat(ys)]); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function numPart(prompt, ans, diag, sol, hints, text, inp) { var p = KP.number(prompt, ans, diag, sol, hints, text, inp); p.answer = t(num(ans)) + (inp && inp.after ? ' ' + inp.after : ''); return p; }
  function stripMoney(resp) { return String(resp == null ? '' : resp).replace(/\\\$|\$/g, '').trim(); }
  function moneyNum(ans, diag) { var c = K.number(ans, diag); return function (resp) { return c(stripMoney(resp)); }; }
  /* a set of ordered pairs, any order */
  function pairsPart(prompt, ps, sol, text, hints) {
    var p = KP.pairs(prompt, ps, {}, sol, hints || ['Write each pair as ' + t('(\\text{input},\\ \\text{output})') + ' — the independent variable first.'], text);
    p.bad = ['\\{' + ps.slice(1).map(pt).join(', ') + '\\}', '\\{' + ps.map(function (q) { return pt([q[1], q[0]]); }).join(', ') + '\\}'];
    p.good = ['\\{' + ps.slice().reverse().map(pt).join(', ') + '\\}', ps.map(pt).join(', ')];
    return p;
  }
  /* complete a table of values from pairs: an x row and a y row of boxes; any column order is accepted */
  function tableFromPairs(prompt, ps, xn, yn, sol, text) {
    var n = ps.length, fl = [{ label: t(xn) + ' row:', name: xn + ' row', mode: 'math', keys: 'pairs', placeholder: 'e.g. ' + ps.map(function (p, i) { return i + 1; }).join(', ') }, { label: t(yn) + ' row:', name: yn + ' row', mode: 'math', keys: 'pairs', placeholder: 'the partners, in the same order' }];
    var key = [ps.map(function (p) { return num(p[0]); }).join(', '), ps.map(function (p) { return num(p[1]); }).join(', ')];
    var list = function (v) { var s = String(v == null ? '' : v).replace(/\\left|\\right|\\[,;: ]|~/g, '').replace(/\\lbrace|\\rbrace|\\\{|\\\}|[{}()]/g, '').replace(/−/g, '-').trim(); if (!s) return []; return s.split(/[,;\s]+/).filter(Boolean).map(function (x) { var r = HW.parse.number(x); return r.ok ? r.value : NaN; }); };
    var check = function (resp) {
      resp = resp || []; var a = list(resp[0]), b = list(resp[1]);
      if (!a.length && !b.length) return form('empty', 'Fill in both rows first.');
      if (!a.length || !b.length) return form('incomplete', 'Fill in both rows: the ' + t(xn) + '-values on the first, their partners on the second.');
      if (a.concat(b).some(isNaN)) return form('unreadable', 'Type the numbers of each row separated by commas, e.g. ' + t('1,\\ 2,\\ 3') + '.');
      if (a.length !== n || b.length !== n) return form('incomplete', 'Each row needs ' + n + ' numbers — one column for each ordered pair.');
      var cols = a.map(function (x, i) { return [x, b[i]]; }), has = function (arr, q) { return arr.some(function (c) { return feq(c[0], q[0]) && feq(c[1], q[1]); }); };
      if (ps.every(function (q) { return has(cols, q); })) return ok();
      if (ps.every(function (q) { return has(cols, [q[1], q[0]]); })) return wrong('u5l3-io-swap', 'Your rows are swapped: the first row is for ' + t(xn) + ' (the first number of each pair), the second for ' + t(yn) + '.');
      var badc = cols.filter(function (c) { return !has(ps, c); })[0];
      return wrong('u5l3-col', 'The column ' + t(xn + '=' + num(badc[0])) + ', ' + t(yn + '=' + num(badc[1])) + ' isn’t one of the ordered pairs. Each column is one pair: the first number on top, its partner underneath.');
    };
    var rev = ps.slice().reverse();
    return { prompt: prompt, input: { type: 'fields', fields: fl }, check: check, key: key, answer: htable(t(xn), t(yn), ps.map(function (p) { return p[0]; }), ps.map(function (p) { return p[1]; })), solution: sol, text: text,
      hints: ['Each ordered pair is one column of the table: the first number goes in the ' + t(xn) + ' row, the second directly below it in the ' + t(yn) + ' row.'],
      good: [[rev.map(function (p) { return num(p[0]); }).join(', '), rev.map(function (p) { return num(p[1]); }).join(', ')], [key[0].replace(/ /g, ''), key[1]]], bad: [[key[1], key[0]], [key[0], rev.map(function (p) { return num(p[1]); }).join(', ')]] };
  }
  function arrowPart(prompt, left, right, pairs, sol, hints, text, o) {
    o = o || {};
    var p = KP.arrows(prompt, { left: left.map(String), right: right.map(String), leftTitle: o.lt, rightTitle: o.rt }, pairs, sol, hints, text, { diag: o.diag });
    var key = p.key; p.bad = [key.slice(1), key.map(function (k) { return [k[1], k[0]]; })];
    return p;
  }
  /* graph pad: plot a relation's points (first quadrant) */
  function gv(pts, pieces, join) { return { pts: pts || [], pieces: pieces || [], join: join || 'none' }; }
  function exactChk(target, opt) { var base = K.graphExact(target, opt); return function (resp) { if (!DR.empty(resp) && DR.same(resp, target)) return ok(); return base(resp); }; }
  function plotPart(prompt, tp, xn, yn, o, sol, hints, text) {
    var target = gv(tp), base = exactChk(target);
    var check = function (resp) {
      var res = base(resp); if (res.v !== 'wrong' || res.code === 'graph-swap' || (res.hint && res.code !== 'graph-points')) return res;
      var S = DR.norm(resp);
      for (var i = 0; i < tp.length; i++) { var p = tp[i], at = S.pts.filter(function (q) { return feq(q[0], p[0]); }); if (at.length && !at.some(function (q) { return feq(q[1], p[1]); })) return wrong('graph-points', 'Check your point at ' + t(xn + '=' + num(p[0])) + ': its partner is ' + t(yn + '=' + num(p[1])) + ', so it goes at ' + t(pt(p)) + '.'); }
      return res;
    };
    var inp = { x: [0, o.X], y: [0, o.Y], grid: 1, gridY: o.gy || 1, labels: 1, labelsX: o.lx || 1, labelsY: o.ly, unitX: Math.min(46, 300 / o.X), unitY: Math.min(30, 300 / (o.Y / (o.gy || 1))) / (o.gy || 1), firstQuadrant: true, xName: xn, yName: yn, mode: 'points', snapX: 1, snapY: o.gy || 1 };
    var p = KP.graph(prompt, inp, check, target, sol, hints, text);
    p.bad = [gv(tp.map(function (q) { return [q[1], q[0]]; })), gv(tp.slice(1))].filter(function (b) { return !DR.same(b, target) && b.pts.every(function (q) { return q[0] <= o.X && q[1] <= o.Y; }); });
    return p;
  }
  function yAxisFor(ymax) { var ly = ymax <= 14 ? 2 : ymax <= 30 ? 5 : ymax <= 60 ? 10 : 20, gy = ly <= 5 ? 1 : ly / 2; return { Y: Math.ceil((ymax + 1) / ly) * ly, ly: ly, gy: gy }; }

  /* ---------- independent / dependent ---------- */
  function ivPart(r, ind, dep, why, prompt, text, axis) {
    var rows = r.shuffle([{ id: 'i', html: cap(ind) }, { id: 'd', html: cap(dep) }]), cols = axis ? [{ id: 'I', html: 'Independent<br>(horizontal axis)' }, { id: 'D', html: 'Dependent<br>(vertical axis)' }] : [{ id: 'I', html: 'Independent' }, { id: 'D', html: 'Dependent' }];
    return KP.grid(prompt, rows, cols, { i: 'I', d: 'D' }, { why: function (row, got) { return { code: (got === 'I' && row === 'd') || (got === 'D' && row === 'i') ? 'var-swap' : 'var-same', hint: why + ' So ' + ind + ' is the <b>independent</b> variable and ' + dep + ' is the <b>dependent</b> one.' }; } },
      'Independent' + (axis ? ' (horizontal axis)' : '') + ': <b>' + ind + '</b>. Dependent' + (axis ? ' (vertical axis)' : '') + ': <b>' + dep + '</b>. ' + why, ['Ask: which quantity is decided by the other? That one is dependent.'], text);
  }
  /* ---------- linear or not (first differences) ---------- */
  function linWord(isLin, ds) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text|[^a-z]/g, '');
      if (!s) return form('empty', 'Type <b>linear</b> or <b>non-linear</b> in the last box.');
      var said = s === 'linear' ? true : (s === 'nonlinear' || s === 'notlinear') ? false : null;
      if (said === null) return form('lin-word', 'In the last box type <b>linear</b> or <b>non-linear</b>.');
      if (said === isLin) return ok();
      return isLin ? wrong('said-nonlinear', 'Your differences are all the same (' + t(seqTex(ds)) + ') — equal steps in the output for equal steps in the input is exactly what makes a relation <b>linear</b>.')
        : wrong('said-linear', 'The differences ' + t(seqTex(ds)) + ' are not all the same, so the relation is <b>non-linear</b>.');
    };
  }
  function diffsPart(prompt, xs, ys, text, showTable) {
    var ds = ys.slice(1).map(function (y, i) { return y - ys[i]; }), step = xs[1] - xs[0], isLin = ds.every(function (d) { return d === ds[0]; });
    var fl = ds.map(function (d, i) { return { label: t(num(ys[i]) + '\\to ' + num(ys[i + 1])), name: 'Difference ' + (i + 1), mode: 'number' }; })
      .concat([{ label: 'Linear or non-linear?', name: 'Linear or non-linear', mode: 'text', wide: true, placeholder: 'linear / non-linear' }]);
    var checks = ds.map(function (d) { return K.number(d, function (v) {
      if (d !== 0 && v === -d) return { code: 'diff-rev', hint: 'Subtract in the order <b>next − previous</b>. When the output goes ' + (d < 0 ? 'down' : 'up') + ', the difference is ' + (d < 0 ? 'negative' : 'positive') + '.' };
      if (step !== 1 && Math.abs(v - d / step) < 1e-9) return { code: 'diff-unit', hint: 'Give the change in ' + t('y') + ' from one output to the next — don’t divide by the step in ' + t('x') + '.' };
      return null; }); }).concat([linWord(isLin, ds)]);
    return { prompt: prompt + (showTable === false ? '' : htable('\\(x\\)', '\\(y\\)', xs, ys)), input: { type: 'fields', fields: fl }, key: ds.map(num).concat([isLin ? 'linear' : 'non-linear']), text: text,
      answer: 'Differences ' + t(ds.map(function (d) { return (d > 0 ? '+' : '') + num(d); }).join(',\\ ')) + ': <b>' + (isLin ? 'linear' : 'non-linear') + '</b>',
      good: [ds.map(num).concat([isLin ? 'Linear' : 'nonlinear'])], bad: [ds.map(num).concat([isLin ? 'non-linear' : 'linear'])],
      check: K.fields(checks, { labels: fl.map(function (f) { return f.name; }) }),
      solution: (step !== 1 ? 'The inputs go up in equal steps of ' + t(step) + '. ' : '') + 'Differences (next − previous): ' + ds.map(function (d, i) { return t(num(ys[i + 1]) + '-' + (ys[i] < 0 ? '(' + ys[i] + ')' : ys[i]) + '=' + num(d)); }).join(', ') + '. ' +
        (isLin ? 'The same every step, so the relation is <b>linear</b>.' : 'Not all equal, so the relation is <b>non-linear</b>.'),
      hints: ['Subtract each output from the next one (next − previous).', 'Same difference every step → linear. Different → non-linear.'] };
  }

  /* ---------- story graphs (shape only) ---------- */
  function shapeGraph(segs, aria, o) {
    o = o || {};
    return HW.graph(Object.assign({ x: [0, 7], y: [0, 7], grid: 1, labels: 0, firstQuadrant: true, xName: 'time', yName: o.yName || ' ', unitX: 22, unitY: 22, max: o.max || 170, segs: segs.map(function (s) { return { pts: s }; }), fns: o.fns || [], aria: aria }, o.extra || {}));
  }
  function groupsOf(value) {
    var g = [];
    DR.phases(value).phases.forEach(function (p) { var L = g[g.length - 1]; if (L && L.dir === p.dir) { L.segs.push(p); L.x1 = p.x1; L.y1 = p.y1; } else g.push({ dir: p.dir, segs: [p], x0: p.x0, x1: p.x1, y0: p.y0, y1: p.y1 }); });
    return g;
  }

  /* ======================================================================= Assignment ======================= */
  var LETTERS = [['P', 'L', 'The total price, \\(P\\) (dollars), of gasoline pumped is related to the number of litres, \\(L\\), pumped.', 'The price is worked out from the litres pumped.'],
    ['C', 'n', 'The total cost, \\(C\\) (dollars), of a concert trip is related to the number of students, \\(n\\), who go.', 'The cost depends on how many students go.'],
    ['d', 't', 'The distance, \\(d\\) (km), a train covers is related to the time, \\(t\\) (hours), it travels.', 'The distance results from how long the train travels.'],
    ['h', 'w', 'The height, \\(h\\) (cm), of a sunflower is related to the number of weeks, \\(w\\), since it was planted.', 'The sunflower grows as the weeks pass.'],
    ['V', 'm', 'The volume, \\(V\\) (litres), of water in a pool is related to the number of minutes, \\(m\\), a hose has been running.', 'The pool fills as the minutes pass.'],
    ['E', 'k', 'The energy used, \\(E\\) (kWh), by a heater is related to the number of hours, \\(k\\), it runs.', 'The energy used depends on how long the heater runs.'],
    ['W', 'b', 'The total number of wheels, \\(W\\), in a bike rack is related to the number of bikes, \\(b\\), in it.', 'Each bike adds two wheels.'],
    ['A', 's', 'The area, \\(A\\) (cm²), of a square is related to its side length, \\(s\\) (cm).', 'The area is calculated from the side length.']];
  var PRICED = [['Movie tickets', 'tickets', 'n', 'C', 3, 15, 6], ['Bus passes', 'passes', 'p', 'C', 2, 9, 2], ['Raffle tickets', 'tickets', 'r', 'C', 2, 10, 5], ['Notebooks', 'notebooks', 'b', 'C', 2, 8, 2], ['Swim lessons', 'lessons', 'l', 'C', 8, 20, 12]];

  var QUESTIONS = [
    { num: '1', section: 'Part A — Ordered Pairs and Tables of Values', stem: '', parts: [
      { id: '1', level: 'BEG', outcome: 'RF1', make: function (r) {
        var c = r.chance(0.25) ? LETTERS[0] : r.pick(LETTERS);
        return ivPart(r, t(c[1]), t(c[0]), c[3], c[2] + ' State (i) the independent variable and (ii) the dependent variable.', 'ind/dep letters ' + c[0] + c[1]);
      } }] },
    { num: '2', stem: '', parts: [
      { id: '2', level: 'BEG', make: function (r) {
        var c = r.chance(0.2) ? PRICED[0] : r.pick(PRICED), pr = r.chance(0.2) ? c[6] : r.int(c[4], c[5]), ps = [1, 2, 3, 4].map(function (n) { return [n, pr * n]; });
        return pairsPart(c[0] + ' cost ' + t('\\$' + pr) + ' each. Let ' + t(c[2]) + ' be the number of ' + c[1] + ' bought and ' + t(c[3]) + ' the total cost, in dollars. Write this relation as a set of ordered pairs ' + t('(' + c[2] + ',\\ ' + c[3] + ')') + ' for ' + t(c[2] + '=1,\\ 2,\\ 3,\\ 4') + '.', ps,
          'Each cost is ' + t(pr) + ' times the number bought: ' + t('\\{' + ptsTex(ps) + '\\}') + '.', 'tickets pairs');
      } }] },
    { num: '3', stem: '', parts: [
      { id: '3', level: 'BEG', make: function (r) {
        var L = r.chance(0.7) ? 25 : 50, st = r.pick([1, 2, 2, 3]), x0 = st === 1 ? r.int(1, 4) : st * r.int(1, 2); if (r.chance(0.2)) { L = 25; st = 2; x0 = 2; }
        var ls = [0, 1, 2, 3].map(function (i) { return x0 + i * st; }), ps = ls.map(function (l) { return [l, L * l]; });
        return pairsPart('In a ' + t(L) + ' m pool, the table shows the number of laps, ' + t('l') + ', a swimmer completes and the total distance, ' + t('d') + ' (metres), swum. Write this relation as a set of ordered pairs ' + t('(l,\\ d)') + '.' + htable('\\(l\\)', '\\(d\\)', ls, ls.map(function (l) { return L * l; })), ps,
          'Read each column of the table as one pair, ' + t('l') + ' first: ' + t('\\{' + ptsTex(ps) + '\\}') + '.', 'pool pairs');
      } }] },
    { num: '4', stem: '', parts: [
      { id: '4', level: 'BEG', make: function (r) {
        var a = r.int(1, 9), d = r.int(2, 5); if (r.chance(0.2)) { a = 7; d = 2; } var ps = [1, 2, 3, 4].map(function (x) { return [x, a + d * x]; });
        return tableFromPairs('A relation is given by the ordered pairs ' + t('(x,\\ y)') + ': ' + t(ptsTex(ps)) + '. Complete a table of values for this relation.', ps, 'x', 'y', 'Each pair is one column: ' + t('x') + ' on top, ' + t('y') + ' underneath. ' + t('x') + ': ' + t(seqTex(ps.map(function (p) { return p[0]; }))) + '; ' + t('y') + ': ' + t(seqTex(ps.map(function (p) { return p[1]; }))) + '.', 'table from pairs');
      } }] },
    { num: '5', section: 'Part B — Mapping Diagrams', stem: '', parts: [
      { id: '5', level: 'BEG', make: function (r) {
        var a = r.int(1, 6), m = r.pick([2, 2, 3]), x0 = r.int(1, 5), st = r.pick([1, 2, 2]); if (r.chance(0.2)) { a = 1; m = 2; x0 = 3; st = 2; }
        var xs = [0, 1, 2].map(function (i) { return x0 + i * st; }), ps = xs.map(function (x) { return [x, m * x + a]; }), right = r.shuffle(ps.map(function (p) { return p[1]; }));
        return arrowPart('A relation is given by the set of ordered pairs ' + t('(m,\\ n)') + ': ' + t(ptsTex(ps)) + '. Represent it with a mapping diagram: the inputs are in the left oval and the outputs in the right oval — draw an arrow from each input to its output.', xs, right, ps,
          'One arrow per pair, from the input ' + t('m') + ' (left) to its output ' + t('n') + ' (right): ' + ps.map(function (q) { return t(q[0] + '\\to ' + q[1]); }).join(', ') + '.' + HW.arrowDiagram(xs, ps.map(function (p) { return p[1]; }), ps, { leftTitle: 'm', rightTitle: 'n' }),
          ['Each ordered pair ' + t('(m,\\ n)') + ' is one arrow, from ' + t('m') + ' to ' + t('n') + '.'], 'mapping from pairs', { lt: 'm (inputs)', rt: 'n (outputs)' });
      } }] },
    { num: '6', stem: function (sh) { return 'The mapping diagram shows a relation between two sets of numbers, ' + t('P') + ' and ' + t('Q') + '.' + HW.arrowDiagram(sh.ps.map(function (p) { return p[0]; }), sh.ps.map(function (p) { return p[1]; }), sh.ps, { leftTitle: 'P', rightTitle: 'Q' }); },
      shared: function (r) { var st, x0, c; do { st = r.pick([5, 10, 10, 2, 3, 4]); x0 = st * r.int(1, 2); c = r.int(-8, 9); } while (c === 0 || x0 + c <= 0); if (r.chance(0.2)) { st = 10; x0 = 10; c = -6; } return { ps: [0, 1, 2].map(function (i) { var x = x0 + i * st; return [x, x + c]; }) }; },
      parts: [
        { id: '6a', level: 'BEG', make: function (r, sh) { return pairsPart('Write this relation as a set of ordered pairs ' + t('(P,\\ Q)') + '.', sh.ps, 'Read each arrow, input first: ' + t('\\{' + ptsTex(sh.ps) + '\\}') + '.', 'pairs from mapping'); } },
        { id: '6b', level: 'BEG', make: function (r, sh) { return tableFromPairs('Complete a table of values for this relation.', sh.ps, 'P', 'Q', 'Each arrow gives one column: ' + t('P') + ': ' + t(seqTex(sh.ps.map(function (p) { return p[0]; }))) + '; ' + t('Q') + ': ' + t(seqTex(sh.ps.map(function (p) { return p[1]; }))) + '.', 'table from mapping'); } }] },
    { num: '7', section: 'Part C — Graphing Relations', stem: '', parts: [
      { id: '7', level: 'BEG', make: function (r) {
        var k = r.pick([2, 3, 4, 5, 5, 6]), c = r.chance(0.5) ? 0 : r.int(1, 4); if (r.chance(0.2)) { k = 5; c = 0; }
        var ps = [1, 2, 3, 4].map(function (x) { return [x, k * x + c]; }), ax = yAxisFor(ps[3][1]);
        return plotPart('Plot these ordered pairs ' + t('(x,\\ y)') + ' on the grid: ' + t(ptsTex(ps)) + '.', ps, 'x', 'y', { X: 5, Y: ax.Y, ly: ax.ly, gy: ax.gy }, 'Plot ' + ps.map(function (p) { return t(pt(p)); }).join(', ') + ': across to ' + t('x') + ', then up to ' + t('y') + '.', ['Across first, then up. The vertical axis is numbered every ' + ax.ly + '.'], 'plot pairs');
      } }] },
    { num: '8', stem: '', parts: [
      { id: '8', level: 'BEG', make: function (r) {
        var a = r.int(0, 5), d = r.int(2, 5); if (r.chance(0.2)) { a = 1; d = 3; } var xs = [0, 1, 2, 3, 4], ps = xs.map(function (x) { return [x, a + d * x]; }), ax = yAxisFor(ps[4][1]);
        return plotPart('The table shows a relation. Plot the corresponding ordered pairs on the grid.' + htable('\\(x\\)', '\\(y\\)', xs, ps.map(function (p) { return p[1]; })), ps, 'x', 'y', { X: 5, Y: ax.Y, ly: ax.ly, gy: ax.gy }, 'Each column is a point: ' + ps.map(function (p) { return t(pt(p)); }).join(', ') + '. The first one, ' + t(pt(ps[0])) + ', is on the ' + t('y') + '-axis.', ['Each column of the table is one ordered pair ' + t('(x,\\ y)') + '.', t('x=0') + ' puts a point on the vertical axis.'], 'plot table');
      } }] },
    { num: '9', stem: function (sh) { return 'The mapping diagram shows a relation between two sets of numbers, ' + t('R') + ' and ' + t('S') + '.' + HW.arrowDiagram(sh.ps.map(function (p) { return p[0]; }), sh.ps.map(function (p) { return p[1]; }), sh.ps, { leftTitle: 'R', rightTitle: 'S' }); },
      shared: function (r) { var x0 = r.int(1, 3), st = r.pick([1, 2, 2]), m = r.pick([2, 3, 3]), c = r.int(-1, 3); if (r.chance(0.2)) { x0 = 3; st = 2; m = 3; c = -1; } return { ps: [0, 1, 2].map(function (i) { var x = x0 + i * st; return [x, m * x + c]; }) }; },
      parts: [
        { id: '9a', level: 'BEG', make: function (r, sh) { return pairsPart('Write this relation as a set of ordered pairs ' + t('(R,\\ S)') + '.', sh.ps, 'Read each arrow, input first: ' + t('\\{' + ptsTex(sh.ps) + '\\}') + '.', 'pairs from mapping 9'); } },
        { id: '9b', level: 'BEG', make: function (r, sh) { return tableFromPairs('Complete a table of values for this relation.', sh.ps, 'R', 'S', t('R') + ': ' + t(seqTex(sh.ps.map(function (p) { return p[0]; }))) + '; ' + t('S') + ': ' + t(seqTex(sh.ps.map(function (p) { return p[1]; }))) + '.', 'table from mapping 9'); } },
        { id: '9c', level: 'BEG', make: function (r, sh) {
          var ax = yAxisFor(sh.ps[2][1]);
          return plotPart('Plot the ordered pairs on the grid to represent this relation as a graph.', sh.ps, 'R', 'S', { X: sh.ps[2][0] + 1, Y: ax.Y, ly: ax.ly, gy: ax.gy }, 'Plot ' + sh.ps.map(function (p) { return t(pt(p)); }).join(', ') + ': ' + t('R') + ' across, ' + t('S') + ' up.', ['Input ' + t('R') + ' on the horizontal axis, output ' + t('S') + ' on the vertical axis.'], 'plot mapping 9');
        } }] },
    { num: '10', section: 'Part D — Applications and Practice', stem: function (sh) { return 'A trivia night charges ' + t('\\$' + sh.f) + ' per person as a team’s entry fee. Let ' + t('p') + ' be the number of people on a team and ' + t('F') + ' the team’s total entry fee, in dollars.'; },
      shared: function (r) { return { f: r.chance(0.2) ? 8 : r.int(4, 15), ps: r.chance(0.6) ? [2, 3, 4, 5] : [3, 4, 5, 6] }; },
      parts: [
        { id: '10a', level: 'BEG', make: function (r, sh) {
          var fl = sh.ps.map(function (p) { return { label: t('p=' + p), name: t('p=' + p), before: t('F=') }; });
          var p = KP.fields('Determine the total entry fee for ' + t('p=' + sh.ps.join(',\\ ')) + ' people.', fl, sh.ps.map(function (q) { return moneyNum(sh.f * q, function (v) { return v === sh.f + q ? { code: 'u5l3-mult', hint: 'Each person pays ' + t('\\$' + sh.f) + ': <b>multiply</b> ' + t(q + '\\times ' + sh.f) + '.' } : null; }); }), sh.ps.map(function (q) { return String(sh.f * q); }),
            sh.ps.map(function (q) { return t('\\$' + sh.f * q); }).join(', '), sh.ps.map(function (q) { return t(q + '\\times ' + sh.f + '=' + sh.f * q); }).join(', ') + ' dollars.', ['Multiply the number of people by ' + t('\\$' + sh.f) + '.'], 'trivia fees');
          p.bad = [sh.ps.map(function (q) { return String(sh.f + q); })]; return p;
        } },
        { id: '10b', level: 'BEG', make: function (r, sh) { var ps = sh.ps.map(function (q) { return [q, sh.f * q]; }); return pairsPart('Write this relation as a set of ordered pairs ' + t('(p,\\ F)') + '.', ps, 'Pair each number of people with its fee: ' + t('\\{' + ptsTex(ps) + '\\}') + '.', 'trivia pairs'); } }] },
    { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '11', level: 'LIM', make: function (r) {
        return KP.mc(r, 'In a mapping diagram, arrows are drawn from the', [
          { html: 'inputs to the outputs.', right: true }, { html: 'outputs to the inputs.', why: 'That is backwards: the arrow starts at the input (the first number of the pair).' },
          { html: t('x') + '-axis to the ' + t('y') + '-axis.', why: 'A mapping diagram has two ovals, not axes.' }, { html: 'dependent variable to the independent variable.', why: 'Backwards: the independent variable is the input, where the arrow starts.' }],
          'Arrows go <b>from the inputs to the outputs</b> — independent to dependent.', ['Which number of an ordered pair does the arrow start from?'], 'MC arrows');
      } }] },
    { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '12', level: 'BEG', make: function (r) {
        var a = r.int(1, 6), d = r.int(2, 5); if (r.chance(0.2)) { a = 3; d = 3; } var xs = [1, 2, 3, 4], ys = xs.map(function (x) { return a + d * x; }), k = r.int(1, 2), off = r.pick([-2, -1, 1, 2]);
        var opts = xs.map(function (x, i) { var p = [x, ys[i] + (i === k ? off : 0)]; return { html: t(pt(p)), right: i === k, why: i === k ? null : t(pt(p)) + ' matches the table: ' + t('x=' + x) + ' goes with ' + t('y=' + ys[i]) + '.' }; });
        return KP.mc(r, 'For the relation ' + t('x:\\ ' + seqTex(xs)) + ' and ' + t('y:\\ ' + seqTex(ys)) + ', which ordered pair does <b>not</b> belong?', opts, 'Pair the columns: ' + t(ptsTex(xs.map(function (x, i) { return [x, ys[i]]; }))) + '. ' + t(pt([xs[k], ys[k] + off])) + ' is not one of them (' + t('x=' + xs[k]) + ' goes with ' + t(ys[k]) + ').', ['Pair each ' + t('x') + ' with the ' + t('y') + ' below it.'], 'MC odd pair', true);
      } }] },
    { num: '13', stem: function (sh) { return '<i>(Numerical Response)</i> The table shows a relation.' + htable('\\(x\\)', '\\(y\\)', [1, 2, 3, 4, 5], sh.ys.slice(0, 4).concat(['?'])); },
      shared: function (r) { var a = r.int(1, 9), d = r.int(3, 9); if (r.chance(0.2)) { a = 4; d = 5; } return { ys: [1, 2, 3, 4, 5].map(function (x) { return a + d * (x - 1); }), d: d }; },
      parts: [
        { id: '13a', level: 'BEG', outcome: 'RF4', make: function (r, sh) { var v = sh.ys[4]; return KP.nr('Determine the missing output value.', v, function (x) { return x === sh.ys[3] + 1 ? { code: 'u5l3-off-by-one', hint: 'The outputs go up by ' + sh.d + ' each time.' } : null; }, 'The outputs go up by ' + t(sh.d) + ': ' + t(sh.ys[3] + '+' + sh.d + '=' + v) + '.', ['How much do the outputs go up each time?'], 'NR missing'); } },
        { id: '13b', level: 'EMG', outcome: 'RF4', make: function (r, sh) { var S = sh.ys.reduce(function (a, b) { return a + b; }, 0); return KP.nr('Determine the sum of all five outputs in the completed table.', S, function (x) { return x === S - sh.ys[4] ? { code: 'u5l3-sum-four', hint: 'Include the missing output too — all <b>five</b>.' } : null; }, t(sh.ys.join('+') + '=' + S) + '.', ['First find the missing output, then add all five.'], 'NR sum'); } }] }
  ];

  /* ======================================================================= Extra practice ======================= */
  var X = [];
  /* ----- EP 1: match situations to graph shapes ----- */
  var SHAPES = { up: [[[0, 0], [6, 6]]], down: [[[0, 6], [6, 0]]], flat: [[[0, 3], [6, 3]]], flatup: [[[0, 1], [2, 1], [6, 6]]] };
  var SH_CTX = { up: ['Water is pumped into an empty tank at a steady rate. The quantity is the volume of water in the tank.', 'A car leaves home and drives away at a steady speed. The quantity is its distance from home.', 'Snow falls steadily on a bare lawn. The quantity is the depth of snow.'],
    down: ['A candle burns down steadily from its full height until nothing is left. The quantity is the height of the candle.', 'A bathtub drains at a steady rate until it is empty. The quantity is the volume of water in the tub.', 'A phone’s battery runs down steadily until it dies. The quantity is the battery charge.'],
    flat: ['A car is parked at a mall 3 km from home for the whole afternoon. The quantity is the car’s distance from home.', 'A thermostat holds a room at 21°C all afternoon. The quantity is the room temperature.', 'A book sits on a shelf all week. The quantity is its height above the floor.'],
    flatup: ['A hiker rests at a lookout 1 km along the trail, then walks steadily onward. The quantity is the hiker’s distance from the trailhead.', 'A plant is 10 cm tall and doesn’t grow for a week, then grows steadily. The quantity is its height.', 'An account holds $50 untouched for a while, then steady weekly deposits begin. The quantity is the balance.'] };
  var SH_WORD = { up: 'rises steadily from 0', down: 'falls steadily to 0', flat: 'stays the same', flatup: 'stays level, then rises steadily' };
  X.push({ num: '1', section: 'Extra practice A — Shapes, Variables, and What a Relationship Means', stem: function (sh) {
      return '<i>Note:</i> some questions in this set look ahead: reading the <b>shape</b> of a graph as a story is Lesson 11, and steady versus changing rates come back in Unit 6. Treat them as a preview.<br>Each graph shows the general <b>shape</b> of a relationship between two quantities. Time runs along the horizontal axis; the quantity runs up the vertical axis.<div style="display:flex;flex-wrap:wrap;gap:6px 18px">' +
        ['A', 'B', 'C', 'D'].map(function (L) { return '<div style="text-align:center;flex:0 0 140px;width:140px"><b>Graph ' + L + '</b><br>' + shapeGraph(SHAPES[sh.map[L]], 'graph ' + L, { max: 140 }) + '</div>'; }).join('') + '</div>';
    },
    shared: function (r) { var order = r.chance(0.25) ? ['up', 'down', 'flat', 'flatup'] : r.shuffle(['up', 'down', 'flat', 'flatup']), map = {}, inv = {}; ['A', 'B', 'C', 'D'].forEach(function (L, i) { map[L] = order[i]; inv[order[i]] = L; }); return { map: map, inv: inv }; },
    parts: ['up', 'down', 'flat', 'flatup'].map(function (kind, i) {
      return { id: 'e1' + 'abcd'[i], level: 'BEG', outcome: 'RF1', make: function (r, sh) {
        var ctx = r.chance(0.4) ? SH_CTX[kind][0] : r.pick(SH_CTX[kind]), right = sh.inv[kind];
        return KP.mc(r, ctx + ' Which graph best matches?', ['A', 'B', 'C', 'D'].map(function (L) { return { html: 'Graph ' + L, right: L === right, why: L === right ? null : 'Graph ' + L + ' ' + SH_WORD[sh.map[L]] + '. Does the quantity in this story do that?' }; }),
          'The quantity ' + SH_WORD[kind] + ' — <b>Graph ' + right + '</b>.', ['As time passes, does the quantity go up, go down, stay the same — or stay the same and then change?'], 'EP1 ' + kind, true);
      } };
    }) });
  /* ----- EP 2 ----- */
  var IV2 = [['the mass of a parcel', 'the cost of shipping it', 'The shipping cost is worked out from the mass.'], ['the number of minutes a phone has been charging', 'the battery percentage', 'The battery fills as the minutes pass.'],
    ['the distance a taxi drives', 'the fare the rider pays', 'The fare is calculated from the distance.'], ['the number of days since a seed was planted', 'the height of the plant', 'The plant grows as the days pass.'],
    ['the number of people at a party', 'the amount of pizza ordered', 'More people means more pizza is ordered.'], ['the speed of a car', 'the distance needed to stop', 'A faster car needs more distance to stop.'],
    ['the number of hours of practice', 'the score in a free-throw contest', 'The score results from the practice.'], ['the temperature outside', 'the number of cold drinks sold', 'Hot weather sells more cold drinks; drink sales can’t change the weather.']];
  X.push({ num: '2', stem: 'For each pair of quantities, state the <b>independent</b> variable and the <b>dependent</b> variable. (The independent variable belongs on the horizontal axis.)', parts: [0, 1, 2, 3].map(function (i) {
    return { id: 'e2' + 'abcd'[i], level: 'BEG', outcome: 'RF1', make: function (r) {
      var c = r.chance(0.6) ? IV2[i] : IV2[i + 4], order = r.chance(0.5) ? [c[0], c[1]] : [c[1], c[0]];
      var p = ivPart(r, c[0], c[1], c[2], cap(order[0]) + ' and ' + order[1] + '.', 'EP2 ' + c[0], true);
      p.solution += ' (The order a pair is listed in doesn’t tell you which is which: ask which one depends on the other.)'; return p;
    } };
  }) });
  /* ----- EP 3 ----- */
  var TREND = { down: ['the money left on a bus pass as rides are taken', 'the air pressure in a slowly leaking tire', 'the number of pages left to read as you read a book', 'the gas in a car’s tank during a road trip'],
    flat: ['the temperature of a pot of water that is already boiling and stays on the burner', 'the speed of a car on cruise control on a flat highway', 'the height of a flagpole over one day', 'the number of wheels on a bicycle during a ride'],
    up: ['the height of a young tree over ten years', 'the total distance walked during a hike', 'the number of songs in a playlist as songs are added each day', 'the total rainfall during a rainy afternoon'],
    downflat: ['the number of unopened cans in a case as you drink one a day for four days, then stop for a week', 'the amount of ice in a glass as the cubes melt, and afterwards', 'the water in a pool as it drains for an hour, then the drain is closed', 'the number of cookies in a jar as you eat two a day, until the jar is empty'] };
  var TNAME = { up: 'increasing', down: 'decreasing', flat: 'constant', downflat: 'decreasing then constant' };
  X.push({ num: '3', stem: 'For each situation, state whether the graph (quantity against time) would be <b>increasing</b>, <b>decreasing</b>, <b>constant</b>, or <b>decreasing then constant</b>.', parts: ['down', 'flat', 'up', 'downflat'].map(function (kind, i) {
    return { id: 'e3' + 'abcd'[i], level: 'BEG', outcome: 'RF1', make: function (r) {
      var c = r.chance(0.4) ? TREND[kind][0] : r.pick(TREND[kind]);
      return KP.mc(r, cap(c) + '.', ['up', 'down', 'flat', 'downflat'].map(function (k) { return { html: TNAME[k], right: k === kind, why: k === kind ? null : 'As time passes, does it really ' + { up: 'keep going up', down: 'keep going down', flat: 'stay the same', downflat: 'go down and then stop changing' }[k] + '?' }; }),
        cap(c) + ': <b>' + TNAME[kind] + '</b>.', ['Picture the quantity as time passes: up, down, the same — or down and then the same?'], 'EP3 ' + kind, true);
    } };
  }) });
  /* ----- EP 4–5: related is not causing ----- */
  var CORR = [['the number of ice cream cones sold at a beach', 'the number of sunburns treated at the first-aid station', 'hot, sunny weather'], ['the number of umbrellas sold', 'the number of car accidents', 'rainy weather'],
    ['the number of hot chocolates sold at a rink', 'the number of people wearing mittens', 'cold weather'], ['the number of lifeguards on duty', 'the number of swimmers at the beach', 'warm summer days']];
  X.push({ num: '4', stem: '', parts: [
    { id: 'e4', level: 'EMG', outcome: 'RF1', make: function (r) {
      var c = r.chance(0.4) ? CORR[0] : r.pick(CORR);
      return KP.mc(r, 'Across one season, ' + c[0] + ' and ' + c[1] + ' rise and fall together. A student concludes that one causes the other. What is wrong with this reasoning?', [
        { html: 'Rising together is not the same as one causing the other: ' + c[2] + ' is a hidden third quantity that drives both.', right: true },
        { html: 'Nothing — when two quantities rise together, one always causes the other.', why: 'Two quantities can move together because something else drives both.' },
        { html: 'The student has it backwards: ' + c[1] + ' cause ' + c[0] + '.', why: 'Neither causes the other — look for something that drives both.' },
        { html: 'The two quantities are not related at all.', why: 'They are related — they rise and fall together. The question is why.' }],
        'Related is not the same as caused. <b>' + cap(c[2]) + '</b> is the hidden quantity behind both: it raises ' + c[0] + ' and ' + c[1] + ' at the same time.', ['Is there something else that could make both of them go up?'], 'EP4 causation');
    } }] });
  var NOCAUSE = [['running-shoe sales and the number of marathon finishers in a city', 'both rise because more people are training'], ['the number of firefighters at a fire and the damage done', 'bigger fires bring more firefighters and also do more damage'],
    ['a child’s shoe size and reading level', 'both grow as the child gets older'], ['heating bills and hot-chocolate sales', 'both go up in cold weather']];
  X.push({ num: '5', stem: 'Two quantities can be strongly related without either one causing the other.', parts: [
    { id: 'e5', level: 'EMG', outcome: 'RF1', make: function (r) {
      var c = r.pick(NOCAUSE);
      return KP.mc(r, 'Which example is a pair of quantities that are related, but where neither causes the other?', [
        { html: cap(c[0]) + ' — ' + c[1] + '.', right: true },
        { html: 'The number of hours worked and the pay earned — more hours means more pay.', why: 'Here one really does cause the other: the pay is calculated from the hours.' },
        { html: 'The number of tickets bought and the total cost — each ticket adds to the cost.', why: 'The tickets really do cause the cost.' },
        { html: 'The time a candle burns and its height — burning makes it shorter.', why: 'The burning time really does cause the height to drop.' }],
        cap(c[0]) + ' are related, but ' + c[1] + ' — buying or doing one doesn’t make the other happen. In the other choices one quantity really does cause the other.', ['For each choice, ask: does changing the first quantity actually make the second one change?'], 'EP5 related not causal');
    } }] });

  /* ----- EP 6: Jamal's ride ----- */
  function rideShared(r) {
    for (var g = 0; g < 400; g++) {
      var T1 = r.pick([10, 10, 20]), T2 = T1 + 10, L3 = r.pick([10, 10, 20]), T3 = T2 + L3, L4 = r.pick([20, 20, 30]), T4 = T3 + L4, D1 = r.int(2, 6), D2 = D1 + 2 * r.int(1, 3);
      if (r.chance(0.15)) { T1 = 10; T2 = 20; T3 = 30; T4 = 50; D1 = 4; D2 = 10; }
      var v = [D1 / T1, (D2 - D1) / (T3 - T2), D2 / (T4 - T3)], top = Math.max.apply(null, v);
      if (D2 <= 12 && T4 <= 60 && v.filter(function (x) { return feq(x, top); }).length === 1 && v[0] !== v[1] && v[1] !== v[2] && v[0] !== v[2] && v.every(function (x) { return feq(x * 100, Math.round(x * 100)); }))
        return { T: [0, T1, T2, T3, T4], D: [0, D1, D1, D2, 0], v: v, tq: T2 + (T3 - T2) / 2 };
    }
    return { T: [0, 10, 20, 30, 50], D: [0, 4, 4, 10, 0], v: [0.4, 0.6, 0.5], tq: 25 };
  }
  function rideGraph(sh) {
    var X = Math.ceil((sh.T[4] + 5) / 10) * 10, Y = Math.ceil((Math.max.apply(null, sh.D) + 1) / 2) * 2;
    return HW.graph({ x: [0, X], y: [0, Y], grid: 5, gridY: 1, labels: 10, labelsX: 10, labelsY: 2, unitX: 300 / X, unitY: 22, firstQuadrant: true, xName: 't', yName: 'd', xTitle: 't (minutes)', yTitle: 'd (km)', max: 380,
      segs: [{ pts: sh.T.map(function (x, i) { return [x, sh.D[i]]; }) }], aria: 'distance from home against time' });
  }
  function ivField(lbl) { return [{ label: lbl + ' from', name: 'from', before: t('t='), after: 'min' }, { label: 'to', name: 'to', before: t('t='), after: 'min' }]; }
  function ivCheck(a, b, wrongIv) {
    return [K.number(a, function (v) { return wrongIv(v, 0); }), K.number(b, function (v) { return wrongIv(v, 1); })];
  }
  X.push({ num: '6', section: 'Extra practice B — Reading and Telling Stories with Graphs', stem: function (sh) { return 'The graph shows Jamal’s distance from home, ' + t('d') + ' kilometres, after ' + t('t') + ' minutes of cycling.' + rideGraph(sh); }, shared: rideShared, parts: [
    { id: 'e6a', level: 'BEG', outcome: 'RF1', make: function (r, sh) {
      var T = sh.T, p = KP.fields('During which time interval was Jamal stopped?', ivField('Stopped'), ivCheck(T[1], T[2], function (v) { return v === T[3] || v === T[0] ? { code: 'u5l3-interval', hint: 'Look for the <b>horizontal</b> piece of the graph: the distance isn’t changing there.' } : null; }), [String(T[1]), String(T[2])],
        t('t=' + T[1]) + ' to ' + t(T[2]) + ' min', 'From ' + t('t=' + T[1]) + ' to ' + t('t=' + T[2]) + ' minutes the graph is <b>horizontal</b>: his distance from home stays at ' + t(sh.D[1]) + ' km, so he is not moving.', ['When is the graph flat?'], 'EP6 stopped');
      p.bad = [[String(T[2]), String(T[3])]]; return p;
    } },
    { id: 'e6b', level: 'EMG', outcome: 'RF1', make: function (r, sh) {
      var tq = sh.tq, d = sh.D[2] + sh.v[1] * (tq - sh.T[2]);
      return numPart('How far from home was Jamal after ' + t(tq) + ' minutes?', d, function (v) { return v === sh.D[3] ? { code: 'u5l3-interval', hint: 'That is at ' + t('t=' + sh.T[3]) + '. At ' + t('t=' + tq) + ' he is halfway through that section.' } : null; },
        'At ' + t('t=' + tq) + ' he is halfway between ' + t(pt([sh.T[2], sh.D[2]])) + ' and ' + t(pt([sh.T[3], sh.D[3]])) + ': ' + t(sh.D[2] + '+' + num(sh.v[1]) + '(' + (tq - sh.T[2]) + ')=' + num(d)) + ' km.', ['Find ' + t(tq) + ' on the time axis, go up to the graph, then across.'], 'EP6 distance at ' + tq, { after: 'km' });
    } },
    { id: 'e6c', level: 'PRG', outcome: 'RF1', make: function (r, sh) {
      var T = sh.T, D = sh.D, labs = ['first ride (' + T[0] + '–' + T[1] + ' min)', 'second ride (' + T[2] + '–' + T[3] + ' min)', 'ride home (' + T[3] + '–' + T[4] + ' min)'];
      var fl = labs.map(function (l, i) { return { label: 'Speed, ' + l, name: 'Speed ' + (i + 1), after: 'km/min' }; });
      var segs = [[T[0], T[1], D[0], D[1]], [T[2], T[3], D[2], D[3]], [T[3], T[4], D[3], D[4]]];
      var top = sh.v.indexOf(Math.max.apply(null, sh.v));
      return KP.fields('Calculate Jamal’s speed, in kilometres per minute, for each of the three moving sections. (The fastest one is the steepest.)', fl, segs.map(function (s, i) { var dd = Math.abs(s[3] - s[2]), tt = s[1] - s[0]; return K.number(sh.v[i], function (v) { return feq(v, tt / dd) ? { code: 'u5l3-rate-flip', hint: 'Speed is distance ÷ time: ' + t(dd + '\\div ' + tt) + ', not time ÷ distance.' } : (v === dd ? { code: 'u5l3-rate-total', hint: 'That is the distance. Divide by the time, ' + tt + ' min.' } : null); }); }),
        sh.v.map(num), sh.v.map(function (v) { return t(num(v)); }).join(', ') + ' km/min — fastest: the ' + labs[top],
        segs.map(function (s, i) { return labs[i] + ': ' + t(Math.abs(s[3] - s[2]) + '\\div ' + (s[1] - s[0]) + '=' + num(sh.v[i])) + ' km/min'; }).join('<br>') + '<br>Fastest: the <b>' + labs[top] + '</b> (the steepest section).', ['Speed = distance ÷ time for each section.', 'Read the distance change and the time for each section off the graph.'], 'EP6 speeds');
    } },
    { id: 'e6d', level: 'BEG', outcome: 'RF1', make: function (r, sh) {
      var T = sh.T, p = KP.fields('During which interval was Jamal returning home?', ivField('Returning'), ivCheck(T[3], T[4], function (v) { return v === T[2] || v === T[1] ? { code: 'u5l3-interval', hint: 'Returning home means his distance from home is <b>shrinking</b>: where does the graph go down?' } : null; }), [String(T[3]), String(T[4])],
        t('t=' + T[3]) + ' to ' + t(T[4]) + ' min', 'From ' + t('t=' + T[3]) + ' to ' + t('t=' + T[4]) + ' the graph slopes <b>down</b>: his distance from home shrinks, reaching ' + t('0') + ' (home) at ' + t(T[4]) + ' min.', ['Where does the graph go down?'], 'EP6 returning');
      p.bad = [[String(T[1]), String(T[2])]]; return p;
    } },
    { id: 'e6e', level: 'EMG', outcome: 'RF1', make: function (r, sh) {
      var tot = 2 * sh.D[3];
      return numPart('What total distance did Jamal cycle? (This is not the same as his final distance from home.)', tot, function (v) { return v === 0 ? { code: 'u5l3-net-dist', hint: 'He ends at home, but he cycled out and back. Add the distance out and the distance back.' } : v === sh.D[3] ? { code: 'u5l3-net-dist', hint: 'That is only the way out. He also rode ' + sh.D[3] + ' km back home.' } : null; },
        t(sh.D[3]) + ' km out + ' + t(sh.D[3]) + ' km back = ' + t(tot) + ' km. (His final distance from home is ' + t('0') + '.)', ['How far did he ride out? How far back?'], 'EP6 total', { after: 'km' });
    } }] });
  /* ----- EP 7: stories for graphs ----- */
  X.push({ num: '7', stem: 'Each graph has no labels on its axes except “time.” Choose the story that explains <b>every</b> section of the graph.', parts: [
    { id: 'e7a', level: 'EMG', outcome: 'RF1', make: function (r) {
      var g = shapeGraph([], 'rises quickly then levels off', { max: 200, fns: [{ f: function (x) { return 6 * (1 - Math.exp(-0.7 * x)); }, from: 0, to: 6.8 }] });
      var S = r.pick([['Fans arrive at a stadium: they pour in quickly at first, then more slowly as it fills, until it is nearly full. (Vertical axis: the number of fans inside.)', 'stadium'], ['A cup of cold water is put in a warm room: it warms quickly at first, then more slowly, levelling off at room temperature. (Vertical axis: temperature.)', 'warming'], ['A new video gets lots of views on day one, fewer each day after, until almost nobody new watches. (Vertical axis: total views.)', 'video']]);
      return KP.mc(r, g + 'Which story fits this graph?', [{ html: S[0], right: true },
        { html: 'A car drives at a steady speed all afternoon. (Vertical axis: distance travelled.)', why: 'Steady speed would be a straight line. This graph rises fast, then slower and slower, then levels off.' },
        { html: 'A bathtub drains until it is empty. (Vertical axis: volume of water.)', why: 'Draining would make the graph go <b>down</b>.' },
        { html: 'A ball is thrown up and falls back down. (Vertical axis: height.)', why: 'The graph never comes back down — it levels off.' }],
        'The graph rises quickly, then more and more slowly, and levels off. ' + S[0], ['Describe each section: rising fast? slowing down? levelling off?'], 'EP7a story');
    } },
    { id: 'e7b', level: 'EMG', outcome: 'RF1', make: function (r) {
      var g = shapeGraph([[[0, 5], [2, 2], [4, 2], [6, 6]]], 'falls, flat, then rises steeply', { max: 200 });
      return KP.mc(r, g + 'Which story fits this graph?', [
        { html: 'A bathtub drains steadily, sits while the plug is put back in, then is refilled faster than it drained. (Vertical axis: volume of water.)', right: true },
        { html: 'A bathtub is filled, then drained. (Vertical axis: volume of water.)', why: 'This graph goes <b>down first</b>, then stays level, then rises.' },
        { html: 'A bathtub drains steadily, then is refilled more slowly than it drained. (Vertical axis: volume of water.)', why: 'The last section is <b>steeper</b> than the first, so it refills faster, not slower.' },
        { html: 'A bathtub drains steadily until it is empty. (Vertical axis: volume of water.)', why: 'The graph doesn’t reach zero, and it has a flat section and a rise after.' }],
        'Three sections: a steady fall, a flat stretch (nothing changes), then a <b>steeper</b> rise — e.g. a tub draining, sitting while the plug is replaced, then refilling faster.', ['Describe each of the three sections in order. Which section is steepest?'], 'EP7b story');
    } }] });
  /* ----- EP 8: Maya's walk (sketch) ----- */
  X.push({ num: '8', stem: function (sh) { return 'Maya leaves home and walks ' + t(sh.b1) + ' blocks in ' + t(sh.m1) + ' minutes. She waits ' + t(sh.w) + ' minutes for a friend, and then the two of them walk ' + t(sh.b2) + ' more blocks in the next ' + t(sh.m2) + ' minutes.'; },
    shared: function (r) { var b1 = r.int(2, 5), m1 = r.int(3, 6), w = r.int(2, 5), b2 = r.int(3, 6), m2 = r.int(5, 9); if (r.chance(0.2)) { b1 = 3; m1 = 5; w = 4; b2 = 5; m2 = 8; } return { b1: b1, m1: m1, w: w, b2: b2, m2: m2 }; },
    parts: [
      { id: 'e8', level: 'PRG', outcome: 'RF1', make: function (r, sh) {
        var A = [sh.m1, sh.b1], B = [sh.m1 + sh.w, sh.b1], C = [sh.m1 + sh.w + sh.m2, sh.b1 + sh.b2], target = gv([], [{ v: [[0, 0], A, B, C], s: 'none', e: 'none' }]);
        var base = exactChk(target, { wrong: [
          { is: gv([], [{ v: [[0, 0], A, [sh.m1 + sh.m2, sh.b1 + sh.b2]], s: 'none', e: 'none' }]), code: 'story-time', hint: 'Show the wait: a <b>flat</b> piece for ' + sh.w + ' minutes, while her distance from home doesn’t change.' },
          { is: gv([], [{ v: [[0, 0], A, B, [sh.m1 + sh.w + sh.m2, sh.b2]], s: 'none', e: 'none' }]), code: 'story-height', hint: 'After the wait she walks ' + sh.b2 + ' <b>more</b> blocks: she ends ' + (sh.b1 + sh.b2) + ' blocks from home, not ' + sh.b2 + '.' },
          { is: gv([], [{ v: [[0, 0], A, B, [sh.m2, sh.b1 + sh.b2]], s: 'none', e: 'none' }]), code: 'story-time', hint: 'Time keeps going: the last section ends at ' + t(sh.m1 + '+' + sh.w + '+' + sh.m2 + '=' + C[0]) + ' minutes.' }] });
        var check = function (resp) {
          var res = base(resp); if (res.v !== 'wrong' || res.code !== 'graph') return res;
          if (DR.notFunction(resp)) return wrong('story-vertical', 'A vertical piece would mean being in two places at once. Time always moves to the right.');
          if (!DR.contains(resp, A)) return wrong('story-height', 'After ' + sh.m1 + ' minutes she has walked ' + sh.b1 + ' blocks: the graph should pass through ' + t(pt(A)) + '.');
          if (!DR.contains(resp, B)) return wrong('story-time', 'She waits ' + sh.w + ' minutes, so the flat piece ends at ' + t(pt(B)) + '.');
          if (!DR.contains(resp, C)) return wrong('story-end', 'The walk ends ' + t(sh.b1 + sh.b2) + ' blocks from home at ' + t(C[0]) + ' minutes: ' + t(pt(C)) + '.');
          return wrong('story-count', 'Draw just three straight sections: from ' + t('(0, 0)') + ' to ' + t(pt(A)) + ', flat to ' + t(pt(B)) + ', then to ' + t(pt(C)) + '.');
        };
        var X0 = Math.max(C[0] + 2, 12), Y0 = Math.max(C[1] + 2, 8);
        var inp = { x: [0, X0], y: [0, Y0], grid: 1, labels: 1, labelsX: 2, labelsY: 2, unitX: Math.min(26, 320 / X0), unitY: Math.min(26, 260 / Y0), firstQuadrant: true, xName: 't', yName: 'd', xTitle: 'time (minutes)', yTitle: 'distance (blocks)', tools: ['line'], defaultEnd: 'none' };
        var p = KP.graph('Sketch a graph of Maya’s distance from home against time. (Use <b>╱ Line</b>: tap ' + t('(0, 0)') + ', then each corner in turn, and tap the last point again to finish.)', inp, check, target,
          'Three sections: walking from ' + t('(0, 0)') + ' to ' + t(pt(A)) + '; waiting (flat) from ' + t(pt(A)) + ' to ' + t(pt(B)) + '; walking with her friend from ' + t(pt(B)) + ' to ' + t(pt(C)) + '.', ['Work out where each section ends: time so far, and blocks from home so far.', 'While she waits, her distance from home doesn’t change.'], 'EP8 Maya sketch');
        p.bad = [gv([], [{ v: [[0, 0], A, [sh.m1 + sh.m2, sh.b1 + sh.b2]], s: 'none', e: 'none' }]), gv([[0, 0], A, B, C])]; return p;
      } }] });
  /* ----- EP 9: tea cooling (sketch) ----- */
  X.push({ num: '9', stem: function (sh) { return 'A mug of tea is poured at ' + t(sh.T0 + '^\\circ') + 'C and left on a counter in a room that stays at ' + t(sh.R + '^\\circ') + 'C.'; },
    shared: function (r) { var T0 = r.pick([70, 80, 80, 90]), R = r.pick([20, 20, 10, 30]); if (R >= T0 - 30) R = 20; return { T0: T0, R: R }; },
    parts: [
      { id: 'e9a', level: 'PRG', outcome: 'RF1', make: function (r, sh) {
        var T0 = sh.T0, R = sh.R, key = gv([], [{ v: [[0, T0], [5, R + (T0 - R) * 0.45], [10, R + (T0 - R) * 0.2], [20, R + (T0 - R) * 0.05], [30, R]], s: 'none', e: 'none' }]);
        var check = function (resp) {
          if (DR.empty(resp)) return form('empty', 'Draw your answer on the grid first.');
          var ph = DR.phases(resp); if (ph.vertical || DR.notFunction(resp)) return wrong('story-vertical', 'The tea has one temperature at each moment: no vertical pieces, and keep moving to the right.');
          if (!ph.phases.length) return wrong('story-lines', 'Draw the graph as a line: tap where it starts, then each corner in turn, and tap the last point again to finish.');
          if (ph.gaps.length) return wrong('story-gap', 'The pieces should join end to end — the temperature doesn’t jump.');
          var G = groupsOf(resp), P0 = ph.phases[0];
          if (Math.abs(P0.x0) > 1e-9 || Math.abs(P0.y0 - T0) > 1e-9) return wrong('story-start', 'Start the graph at ' + t(pt([0, T0])) + ': at time 0 the tea is ' + T0 + '°C.');
          var ys = []; ph.phases.forEach(function (q) { ys.push(q.y0, q.y1); });
          if (Math.min.apply(null, ys) < R - 1e-9) return wrong('u5l3-below-room', 'The tea can’t get colder than the room: it stops cooling at ' + R + '°C.');
          if (G.some(function (g2) { return g2.dir === 'up'; })) return wrong('story-dir', 'Nothing heats the tea up again: the graph only goes down (or levels off).');
          var last = ph.phases[ph.phases.length - 1];
          if (last.y1 > R + 5 + 1e-9) return wrong('u5l3-no-level', 'Keep going: the tea keeps cooling until it is (almost) at room temperature, ' + R + '°C, and then levels off.');
          var downs = G.filter(function (g2) { return g2.dir === 'down'; })[0], m = downs.segs.map(function (s) { return Math.abs(s.m); });
          if (m.length < 2) return wrong('story-bend', 'It cools <b>fastest at the start</b>, when it is much hotter than the room, then more and more slowly: draw a curve that is steep at first and then flatter (a few short pieces, each less steep than the one before).');
          for (var i = 1; i < m.length; i++) if (!(m[i] < m[i - 1] - 1e-9)) return wrong('story-bend', 'Each piece should be <b>less steep</b> than the one before: the tea cools quickly at first, then more and more slowly.');
          return ok();
        };
        var inp = { x: [0, 35], y: [0, 100], grid: 5, gridY: 10, labels: 1, labelsX: 10, labelsY: 10, snapX: 5, snapY: 5, unitX: 9, unitY: 2.6, firstQuadrant: true, xName: 't', yName: 'T', xTitle: 'time (minutes)', yTitle: 'temperature (°C)', tools: ['line'], defaultEnd: 'none', bg: { segs: [{ pts: [[0, R], [35, R]], dash: true, color: '#c4532a' }] } };
        var p = KP.graph('Sketch a graph of the tea’s temperature against time. (The dashed line is room temperature. Use <b>╱ Line</b> and several short pieces for a curve.)', inp, check, key,
          'Start at ' + t(pt([0, T0])) + '. The tea cools quickly at first (it is much hotter than the room), then more and more slowly, levelling off at ' + t(R + '^\\circ') + 'C — the room temperature.', ['Where does the graph start? Where must it end up?', 'Is the cooling fastest at the start or at the end?'], 'EP9 tea sketch');
        p.answer = 'One possible sketch:' + p.answer;
        p.good = [gv([], [{ v: [[0, T0], [5, R + (T0 - R) / 2], [15, R + 5], [35, R]], s: 'none', e: 'none' }])];
        p.bad = [gv([], [{ v: [[0, T0], [30, R]], s: 'none', e: 'none' }]), gv([], [{ v: [[0, T0], [5, R + (T0 - R) / 2], [15, R - 10 > 0 ? R - 10 : 0]], s: 'none', e: 'none' }])];
        return p;
      } },
      { id: 'e9b', level: 'EMG', outcome: 'RF1', make: function (r, sh) {
        return KP.mc(r, 'Why does the graph level off instead of continuing to fall?', [
          { html: 'The tea can only cool to room temperature (' + sh.R + '°C); once it gets there, no temperature difference is left to cool it further.', right: true },
          { html: 'Because the mug runs out of tea.', why: 'The amount of tea isn’t what is graphed. Think about the room.' },
          { html: 'It doesn’t: the tea keeps cooling until it freezes.', why: 'The room is ' + sh.R + '°C. Can the tea get colder than the air around it?' },
          { html: 'Because someone puts it in the microwave.', why: 'Nothing in the story heats the tea.' }],
          'Tea cools because it is warmer than the room. As it nears ' + sh.R + '°C the difference disappears, so it cools more and more slowly and levels off at room temperature.', ['What temperature is the room?'], 'EP9 why level off');
      } }] });

  /* ----- EP 10–14: linear or non-linear ----- */
  X.push({ num: '10', section: 'Extra practice C — Tables, Ordered Pairs, and Linear or Non-Linear', stem: 'A relation is <b>linear</b> when equal steps in the input always produce equal steps in the output — that is, when the <b>first differences</b> of the outputs are constant.', parts: [
    { id: 'e10a', level: 'BEG', outcome: 'RF4', make: function (r) { var a = r.int(1, 9), d = r.int(2, 6); if (r.chance(0.2)) { a = 1; d = 3; } var xs = [1, 2, 3, 4, 5]; return diffsPart('Find the first differences, then decide: linear or non-linear?', xs, xs.map(function (x) { return a + d * x; }), 'EP10a linear'); } },
    { id: 'e10b', level: 'BEG', outcome: 'RF4', make: function (r) { var c = r.chance(0.5) ? 0 : r.int(1, 5); var xs = [1, 2, 3, 4, 5]; return diffsPart('Find the first differences, then decide: linear or non-linear?', xs, xs.map(function (x) { return x * x + c; }), 'EP10b squares'); } },
    { id: 'e10c', level: 'EMG', outcome: 'RF4', make: function (r) { var a = r.int(15, 30), d = r.int(2, 5); if (r.chance(0.2)) { a = 20; d = 3; } var xs = [0, 2, 4, 6, 8]; return diffsPart('Find the first differences, then decide: linear or non-linear? (Notice the step in ' + t('x') + '.)', xs, xs.map(function (x, i) { return a - d * i; }), 'EP10c decreasing'); } },
    { id: 'e10d', level: 'BEG', outcome: 'RF4', make: function (r) { var a = r.pick([1, 2, 3]), k = r.pick([2, 3, 3]); if (r.chance(0.2)) { a = 2; k = 3; } var xs = [0, 1, 2, 3, 4]; return diffsPart('Find the first differences, then decide: linear or non-linear?', xs, xs.map(function (x) { return a * Math.pow(k, x); }), 'EP10d growth'); } }] });
  function rateCheckPart(prompt, xs, ys, text) {
    var rates = ys.slice(1).map(function (y, i) { return (y - ys[i]) / (xs[i + 1] - xs[i]); }), isLin = rates.every(function (q) { return feq(q, rates[0]); });
    var fl = rates.map(function (q, i) { return { label: 'Rate from ' + t('x=' + xs[i]) + ' to ' + t(xs[i + 1]), name: 'Rate ' + (i + 1) }; }).concat([{ label: 'Linear or non-linear?', name: 'Linear or non-linear', mode: 'text', wide: true, placeholder: 'linear / non-linear' }]);
    var checks = rates.map(function (q, i) { var dy = ys[i + 1] - ys[i], dx = xs[i + 1] - xs[i]; return K.number(q, function (v) { return dx !== 1 && v === dy ? { code: 'diff-unit', hint: 'That is the change in ' + t('y') + '. Divide it by the change in ' + t('x') + ', ' + t(dx) + '.' } : feq(v, dx / dy) ? { code: 'u5l3-rate-flip', hint: 'Rate = change in ' + t('y') + ' ÷ change in ' + t('x') + '.' } : null; }); }).concat([linWord(isLin, rates)]);
    return { prompt: prompt + htable('\\(x\\)', '\\(y\\)', xs, ys), input: { type: 'fields', fields: fl }, key: rates.map(num).concat([isLin ? 'linear' : 'non-linear']), text: text,
      answer: 'Rates ' + t(seqTex(rates)) + ': <b>' + (isLin ? 'linear' : 'non-linear') + '</b>', check: K.fields(checks, { labels: fl.map(function (f) { return f.name; }) }),
      solution: rates.map(function (q, i) { return t('\\dfrac{' + ys[i + 1] + '-' + ys[i] + '}{' + xs[i + 1] + '-' + xs[i] + '}=\\dfrac{' + (ys[i + 1] - ys[i]) + '}{' + (xs[i + 1] - xs[i]) + '}=' + num(q)); }).join(', ') + '. ' + (isLin ? 'All the rates are equal, so the relation is <b>linear</b> — even though the raw output differences ' + t(seqTex(ys.slice(1).map(function (y, i) { return y - ys[i]; }))) + ' are not.' : 'The rates are not equal, so the relation is <b>non-linear</b>.'),
      hints: ['For each gap: (change in ' + t('y') + ') ÷ (change in ' + t('x') + ').', 'Equal rates → linear.'], good: [rates.map(num).concat([isLin ? 'Linear' : 'nonlinear'])], bad: [rates.map(num).concat([isLin ? 'non-linear' : 'linear'])] };
  }
  X.push({ num: '11', stem: '<b>Careful</b> — in these tables the inputs do <b>not</b> go up in equal steps, so comparing the output differences alone will fool you. Compare the <b>rate</b> ' + t('\\dfrac{\\text{change in }y}{\\text{change in }x}') + ' across each gap.', parts: [
    { id: 'e11a', level: 'PRG', outcome: 'RF4', make: function (r) { var m = r.int(2, 5), b = r.int(1, 6), xs; if (r.chance(0.2)) { m = 3; b = 2; xs = [1, 3, 4, 7]; } else { var x0 = r.int(0, 2); do { xs = [x0, x0 + r.int(1, 3)]; xs.push(xs[1] + r.int(1, 2)); xs.push(xs[2] + r.int(2, 3)); } while (xs[1] - xs[0] === xs[2] - xs[1] && xs[2] - xs[1] === xs[3] - xs[2]); } return rateCheckPart('Find the rate across each gap, then decide: linear or non-linear?', xs, xs.map(function (x) { return m * x + b; }), 'EP11a'); } },
    { id: 'e11b', level: 'PRG', outcome: 'RF4', make: function (r) { var c = r.int(1, 4), xs = r.chance(0.5) ? [0, 1, 3, 6] : [0, 2, 3, 5]; if (r.chance(0.2)) { c = 2; xs = [0, 1, 3, 6]; } var ys = xs.map(function (x) { return xs[3] === 6 ? [c, c + 1, c + 5, c + 14][xs.indexOf(x)] : x * x + c; }); return rateCheckPart('Find the rate across each gap, then decide: linear or non-linear?', xs, ys, 'EP11b'); } }] });
  X.push({ num: '12', stem: function (sh) { return 'The table shows a linear relation with two outputs missing.' + htable('\\(x\\)', '\\(y\\)', sh.xs, sh.ys.map(function (y, i) { return i === 1 || i === 3 ? '?' : y; })); },
    shared: function (r) { var a, s, x0, xs; do { a = r.int(1, 9); s = r.int(2, 6); x0 = r.int(1, 3); } while (a === x0 && s === 2); xs = [0, 1, 2, 3, 4].map(function (i) { return x0 + 2 * i; }); if (r.chance(0.2)) { a = 7; s = 6; xs = [2, 4, 6, 8, 10]; return { xs: xs, ys: [7, 13, 19, 25, 31], s: 6 }; } return { xs: xs, ys: xs.map(function (x, i) { return a + s * i; }), s: s }; },
    parts: [
      { id: 'e12a', level: 'EMG', outcome: 'RF4', make: function (r, sh) {
        var fl = [{ label: 'Step in ' + t('y') + ' for each step of ' + t('2') + ' in ' + t('x'), name: 'Step' }, { label: t('y') + ' at ' + t('x=' + sh.xs[1]), name: t('x=' + sh.xs[1]) }, { label: t('y') + ' at ' + t('x=' + sh.xs[3]), name: t('x=' + sh.xs[3]) }];
        var p = KP.fields('Use the given outputs to find the step size, then fill in the two missing values.', fl, [K.number(sh.s, function (v) { return v === 2 * sh.s ? { code: 'u5l3-rate-total', hint: 'From ' + t('x=' + sh.xs[0]) + ' to ' + t('x=' + sh.xs[2]) + ' is <b>two</b> steps of 2. Halve the change.' } : null; }), K.number(sh.ys[1]), K.number(sh.ys[3])],
          [String(sh.s), String(sh.ys[1]), String(sh.ys[3])], 'step ' + t(sh.s) + '; missing ' + t(sh.ys[1]) + ' and ' + t(sh.ys[3]),
          t('y') + ' rises ' + t(sh.ys[2] + '-' + sh.ys[0] + '=' + (sh.ys[2] - sh.ys[0])) + ' over the two steps from ' + t('x=' + sh.xs[0]) + ' to ' + t('x=' + sh.xs[2]) + ', so ' + t(sh.s) + ' per step of 2. Missing values: ' + t(sh.ys[0] + '+' + sh.s + '=' + sh.ys[1]) + ' and ' + t(sh.ys[2] + '+' + sh.s + '=' + sh.ys[3]) + '.', ['Two steps of ' + t('x') + ' separate the first and third outputs.'], 'EP12 fill');
        p.bad = [[String(2 * sh.s), String(sh.ys[0] + 2 * sh.s), String(sh.ys[2] + 2 * sh.s)]]; return p;
      } },
      { id: 'e12b', level: 'BEG', make: function (r, sh) { var ps = sh.xs.map(function (x, i) { return [x, sh.ys[i]]; }); return pairsPart('Write the completed relation as a set of ordered pairs ' + t('(x,\\ y)') + '.', ps, t('\\{' + ptsTex(ps) + '\\}'), 'EP12 pairs'); } }] });
  X.push({ num: '13', stem: function (sh) { var ymax = sh.ps[4][1], ax = yAxisFor(ymax); return 'The points of a relation have been plotted.' + HW.graph({ x: [0, 5], y: [0, ax.Y], grid: 1, gridY: ax.gy, labels: 1, labelsX: 1, labelsY: ax.ly, unitX: 46, unitY: Math.min(16, 260 / ax.Y), firstQuadrant: true, max: 300, points: sh.ps.map(function (p) { return { x: p[0], y: p[1] }; }), aria: 'plotted relation' }); },
    shared: function (r) { var c = r.int(0, 5), k = r.chance(0.7) ? 1 : 2; if (r.chance(0.2)) { c = 1; k = 1; } return { ps: [0, 1, 2, 3, 4].map(function (x) { return [x, k * x * x + c]; }) }; },
    parts: [
      { id: 'e13a', level: 'BEG', make: function (r, sh) { return pairsPart('Write the relation as a set of ordered pairs.', sh.ps, 'Read each point, across then up: ' + t('\\{' + ptsTex(sh.ps) + '\\}') + '.', 'EP13 pairs', ['Read each point: across (' + t('x') + ') first, then up (' + t('y') + ').']); } },
      { id: 'e13a2', sub: 'a (table)', level: 'BEG', make: function (r, sh) { return tableFromPairs('Write the relation as a table of values.', sh.ps, 'x', 'y', t('x') + ': ' + t(seqTex(sh.ps.map(function (p) { return p[0]; }))) + '; ' + t('y') + ': ' + t(seqTex(sh.ps.map(function (p) { return p[1]; }))) + '.', 'EP13 table'); } },
      { id: 'e13b', level: 'EMG', outcome: 'RF4', make: function (r, sh) { return diffsPart('Is the relation linear or non-linear? Find the first differences of the outputs.', sh.ps.map(function (p) { return p[0]; }), sh.ps.map(function (p) { return p[1]; }), 'EP13 linear?', false); } }] });
  X.push({ num: '14', stem: function (sh) { return 'A mapping diagram for a summer job: each input is a number of hours worked, ' + t('h') + ', and each output is the pay earned, ' + t('P') + ' dollars.' + HW.arrowDiagram(sh.hs, sh.hs.map(function (h) { return sh.w * h; }), sh.hs.map(function (h) { return [h, sh.w * h]; }), { leftTitle: 'h', rightTitle: 'P' }); },
    shared: function (r) { var w = r.int(11, 20), st = r.pick([1, 2, 2]), hs = [1, 2, 3, 4].map(function (i) { return i * st; }); if (r.chance(0.2)) { w = 15; hs = [2, 4, 6, 8]; } return { w: w, hs: hs, hq: r.chance(0.4) ? 11 : r.int(9, 15) }; },
    parts: [
      { id: 'e14a', level: 'BEG', make: function (r, sh) { var ps = sh.hs.map(function (h) { return [h, sh.w * h]; }); return pairsPart('Write the relation as a set of ordered pairs ' + t('(h,\\ P)') + '.', ps, t('\\{' + ptsTex(ps) + '\\}'), 'EP14 pairs'); } },
      { id: 'e14b', level: 'EMG', outcome: 'RF1', make: function (r, sh) {
        return KP.mc(r, 'Which is the independent variable, and how do the <b>words</b> of the situation — not the diagram — tell you?', [
          { html: t('h') + ' is independent and ' + t('P') + ' dependent: the pay depends on the hours worked, not the reverse.', right: true },
          { html: t('h') + ' is independent because it is in the left oval.', why: 'True, but the question asks how the <b>words</b> of the situation tell you.' },
          { html: t('P') + ' is independent because the numbers are bigger.', why: 'Size doesn’t decide it. Which one depends on the other?' },
          { html: t('P') + ' is independent: you decide how much money you want, then work those hours.', why: 'At this job the pay is worked out from the hours, not the other way round.' }],
          'The pay is calculated from the hours worked, so ' + t('h') + ' is <b>independent</b> and ' + t('P') + ' is <b>dependent</b> — the situation, not the picture, decides.', ['Which quantity is worked out from the other?'], 'EP14 ind/dep why');
      } },
      { id: 'e14c', level: 'EMG', outcome: 'RF4', make: function (r, sh) { return diffsPart('Is this relation linear? Find the first differences of the outputs (the inputs go up in equal steps of ' + t(sh.hs[1] - sh.hs[0]) + ').', sh.hs, sh.hs.map(function (h) { return sh.w * h; }), 'EP14 linear', false); } },
      { id: 'e14d', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
        var hq = sh.hq, fl = [{ label: 'Hourly rate', name: 'Rate', before: '$', after: 'per hour' }, { label: 'Pay for ' + t(hq) + ' hours', name: 'Pay', before: '$' }], st = sh.hs[1] - sh.hs[0];
        return KP.fields('Determine the hourly rate of pay, and use it to predict the pay for ' + t(hq) + ' hours of work.', fl, [moneyNum(sh.w, function (v) { return v === sh.w * st && st !== 1 ? { code: 'u5l3-rate-total', hint: 'That is the pay for ' + st + ' hours. Divide by ' + st + '.' } : null; }), moneyNum(sh.w * hq, function (v) { return v === sh.w * st * hq && st !== 1 ? { code: 'u5l3-rate-total', hint: 'Use the pay for <b>one</b> hour.' } : null; })],
          [String(sh.w), String(sh.w * hq)], t('\\$' + sh.w) + ' per hour; ' + t('\\$' + sh.w * hq), 'Rate: ' + t('\\$' + sh.w * sh.hs[0] + '\\div ' + sh.hs[0] + '=\\$' + sh.w) + ' per hour. Pay for ' + hq + ' hours: ' + t(hq + '\\times\\$' + sh.w + '=\\$' + sh.w * hq) + '.', ['Divide any pay by its number of hours.'], 'EP14 rate and predict');
      } }] });

  /* ----- EP 15–19: stretch ----- */
  X.push({ num: '15', section: 'Extra practice D — Stretch', stem: function (sh) { return 'An empty ' + t(sh.cap) + ' L tank is filled at a steady ' + t(sh.f) + ' L per minute for ' + t(sh.t1) + ' minutes. The valve is then closed and the tank is left untouched for ' + t(sh.w) + ' minutes. Finally the tank is drained at a steady ' + t(sh.g) + ' L per minute until it is empty.'; },
    shared: function (r) {
      for (var gg = 0; gg < 300; gg++) { var f = r.pick([10, 15, 20, 25]), t1 = r.int(3, 6), V = f * t1, full = r.chance(0.25), cap = full ? V : V + r.pick([10, 20, 30]), g = r.pick([20, 30, 40, 50]), w = r.int(2, 5); if (g === f) continue; var td = V / g; if (td * 2 === Math.round(td * 2) && cap <= 150) { if (r.chance(0.2)) return { f: 20, t1: 5, V: 100, cap: 120, g: 40, w: 4, tE: 11.5, full: false }; return { f: f, t1: t1, V: V, cap: cap, g: g, w: w, tE: t1 + w + td, full: full }; } }
      return { f: 20, t1: 5, V: 100, cap: 120, g: 40, w: 4, tE: 11.5, full: false };
    },
    parts: [
      { id: 'e15a', level: 'BEG', outcome: 'RF1', make: function (r, sh) { return numPart('How much water is in the tank at ' + t('t=' + sh.t1) + ' minutes?', sh.V, function (v) { return v === sh.cap ? { code: 'u5l3-full', hint: 'Work it out from the filling: ' + t(sh.f) + ' L every minute for ' + sh.t1 + ' minutes.' } : v === sh.f + sh.t1 ? { code: 'u5l3-mult', hint: 'Multiply the rate by the time.' } : null; }, t(sh.f + '\\times ' + sh.t1 + '=' + sh.V) + ' L.', ['Litres per minute × minutes.'], 'EP15 volume', { after: 'L' }); } },
      { id: 'e15a2', sub: 'a (full?)', level: 'EMG', outcome: 'RF1', make: function (r, sh) {
        return KP.mc(r, 'Does the tank ever get full?', [{ html: 'Yes — ' + sh.V + ' L is exactly its capacity.', right: sh.full, why: sh.full ? null : 'It holds ' + sh.cap + ' L, but only ' + sh.V + ' L go in.' }, { html: 'No — it reaches only ' + sh.V + ' L, ' + (sh.cap - sh.V) + ' L short of the ' + sh.cap + ' L capacity.', right: !sh.full, why: !sh.full ? null : sh.V + ' L is exactly the capacity.' },
          { html: 'Yes — water keeps flowing while the valve is closed.', why: 'A closed valve means nothing flows in or out.' }, { html: 'Can’t tell without the graph.', why: 'Compare the water put in with the capacity.' }],
          sh.V + ' L go in; the tank holds ' + sh.cap + ' L. ' + (sh.full ? 'It is exactly full.' : 'It is ' + (sh.cap - sh.V) + ' L short — never full.'), ['Compare the volume after filling with the capacity.'], 'EP15 full?', true);
      } },
      { id: 'e15b', level: 'ADV', outcome: 'RF1', make: function (r, sh) {
        var td = sh.V / sh.g;
        return numPart('At what time is the tank empty again?', sh.tE, function (v) { return feq(v, td) ? { code: 'u5l3-start-time', hint: 'Draining takes ' + num(td) + ' min, but it starts at ' + t('t=' + (sh.t1 + sh.w)) + '.' } : feq(v, sh.cap / sh.g + sh.t1 + sh.w) && sh.cap !== sh.V ? { code: 'u5l3-full', hint: 'Only ' + sh.V + ' L are in the tank, not ' + sh.cap + '.' } : feq(v, sh.t1 + sh.w + sh.V / sh.f) ? { code: 'u5l3-rate-total', hint: 'It drains at ' + sh.g + ' L/min, not ' + sh.f + '.' } : null; },
          'Draining ' + t(sh.V) + ' L at ' + t(sh.g) + ' L/min takes ' + t(sh.V + '\\div ' + sh.g + '=' + num(td)) + ' min. It starts at ' + t('t=' + sh.t1 + '+' + sh.w + '=' + (sh.t1 + sh.w)) + ', so the tank is empty at ' + t('t=' + num(sh.tE)) + ' min.', ['When does the draining start? How long does it take?'], 'EP15 empty time', { before: t('t='), after: 'min' });
      } },
      { id: 'e15c', level: 'PRG', outcome: 'RF1', make: function (r, sh) {
        var a = [sh.t1, sh.V], b = [sh.t1 + sh.w, sh.V], c = [sh.tE, 0], target = gv([], [{ v: [[0, 0], a, b, c], s: 'none', e: 'none' }]), base = exactChk(target);
        var check = function (resp) { var res = base(resp); if (res.v !== 'wrong' || res.code !== 'graph') return res;
          if (!DR.contains(resp, a)) return wrong('story-height', 'After filling for ' + sh.t1 + ' min the tank holds ' + sh.V + ' L: the graph passes through ' + t(pt(a)) + '.');
          if (!DR.contains(resp, b)) return wrong('story-time', 'The valve is closed for ' + sh.w + ' min: a flat piece to ' + t(pt(b)) + '.');
          if (!DR.contains(resp, c)) return wrong('story-end', 'The tank is empty at ' + t('t=' + num(sh.tE)) + ': the graph ends at ' + t(pt(c)) + '.');
          return wrong('story-count', 'Draw three straight sections: up to ' + t(pt(a)) + ', flat to ' + t(pt(b)) + ', then down to ' + t(pt(c)) + '.'); };
        var X0 = Math.ceil(sh.tE + 1), Yt = Math.ceil((sh.cap + 10) / 20) * 20;
        var inp = { x: [0, X0], y: [0, Yt], grid: 1, gridY: 10, labels: 1, labelsX: 2, labelsY: 20, snapX: 0.5, snapY: 5, unitX: Math.min(28, 330 / X0), unitY: 260 / Yt, firstQuadrant: true, xName: 't', yName: 'V', xTitle: 't (minutes)', yTitle: 'V (litres)', tools: ['line'], defaultEnd: 'none', bg: { segs: [{ pts: [[0, sh.cap], [X0, sh.cap]], dash: true, color: '#c4532a' }] } };
        var p = KP.graph('Sketch the complete graph of volume against time. (The dashed line is the tank’s capacity. Use <b>╱ Line</b>; the grid snaps to half-minutes.)', inp, check, target,
          'Up from ' + t('(0, 0)') + ' to ' + t(pt(a)) + ' (filling), flat to ' + t(pt(b)) + ' (valve closed), then down to ' + t(pt(c)) + ' (draining).', ['Find the three corner points first.'], 'EP15 sketch');
        p.bad = [gv([], [{ v: [[0, 0], a, c], s: 'none', e: 'none' }])]; return p;
      } },
      { id: 'e15d', level: 'EMG', outcome: 'RF1', make: function (r, sh) {
        var drainSteep = sh.g > sh.f;
        return KP.mc(r, 'Which section of the graph is steepest, and what does that steepness mean in this situation?', [
          { html: drainSteep ? 'The draining section: ' + sh.g + ' L/min is faster than the fill rate of ' + sh.f + ' L/min, so the volume changes faster.' : 'The filling section: ' + sh.f + ' L/min is faster than the drain rate of ' + sh.g + ' L/min, so the volume changes faster.', right: true },
          { html: drainSteep ? 'The filling section: it comes first.' : 'The draining section: it ends at zero.', why: 'Steepness shows the rate: compare ' + sh.f + ' L/min with ' + sh.g + ' L/min.' },
          { html: 'The flat section: nothing happens there.', why: 'A flat section has no steepness at all — the volume isn’t changing.' },
          { html: 'All three are equally steep.', why: 'The rates are ' + sh.f + ' L/min, 0 and ' + sh.g + ' L/min.' }],
          'Steepness is the rate of change of volume. ' + (drainSteep ? 'Draining at ' + sh.g + ' L/min is faster than filling at ' + sh.f + ' L/min, so the <b>draining</b> section is steepest.' : 'Filling at ' + sh.f + ' L/min is faster than draining at ' + sh.g + ' L/min, so the <b>filling</b> section is steepest.'), ['Compare the rates in litres per minute.'], 'EP15 steepest');
      } }] });
  X.push({ num: '16', stem: function (sh) {
      return 'The graph shows two runners on a straight ' + t(sh.L) + ' m track. Amir’s line starts at the origin; Bea’s (dashed) line starts higher because she is given a head start.' +
        HW.graph({ x: [0, 9], y: [0, sh.L + 100], grid: 1, gridY: 100, labels: 1, labelsX: 1, labelsY: 200, unitX: 34, unitY: 250 / (sh.L + 100), firstQuadrant: true, xName: 't', yName: 'd', xTitle: 't (minutes)', yTitle: 'd (metres)', max: 380,
          segs: [{ pts: [[0, 0], [8, sh.a * 8]] }, { pts: [[0, sh.h], [8, sh.h + sh.b * 8]], dash: true, color: '#c4532a' }], points: [{ x: 7.3, y: sh.a * 7.3 + 60, label: 'Amir' }, { x: 7.3, y: sh.h + sh.b * 7.3 - 120, label: 'Bea' }].map(function (p) { p.color = 'rgba(0,0,0,0)'; return p; }), aria: 'two runners' });
    },
    shared: function (r) {
      for (var g = 0; g < 400; g++) { var a = r.pick([100, 125, 150, 150, 175, 200]), b = r.pick([50, 75, 100, 100, 125]), T = r.int(3, 6), h; if (b >= a) continue; h = (a - b) * T; var L = Math.max(a, b) * 8 + (a > b ? 0 : h); if (h % 50 || h < 100 || h > 500 || a * 8 > 1600 || h + b * 8 > a * 8 + 100) continue; if (r.chance(0.2)) return { a: 150, b: 100, h: 300, T: 6, L: 1200, q: 4 }; var q; do { q = r.int(1, 7); } while (q === T); return { a: a, b: b, h: h, T: T, L: a * 8, q: q }; }
      return { a: 150, b: 100, h: 300, T: 6, L: 1200, q: 4 };
    },
    parts: [
      { id: 'e16a', level: 'BEG', outcome: 'RF1', make: function (r, sh) { return numPart('How big is Bea’s head start?', sh.h, null, 'Bea’s line starts at ' + t('d=' + sh.h) + ' when ' + t('t=0') + ': a head start of ' + t(sh.h) + ' m.', ['Where does Bea’s line cross the vertical axis?'], 'EP16 head start', { after: 'm' }); } },
      { id: 'e16b', level: 'PRG', outcome: 'RF1', make: function (r, sh) {
        var e8 = sh.h + sh.b * 8, fl = [{ label: 'Amir', name: 'Amir', after: 'm/min' }, { label: 'Bea', name: 'Bea', after: 'm/min' }];
        return KP.fields('Determine each runner’s speed in metres per minute.', fl, [K.number(sh.a), K.number(sh.b, function (v) { return v === e8 / 8 ? { code: 'u5l3-head-start', hint: 'Bea didn’t run the head start: she ran from ' + sh.h + ' m to ' + e8 + ' m.' } : null; })], [String(sh.a), String(sh.b)], 'Amir ' + t(sh.a) + ', Bea ' + t(sh.b) + ' m/min (Amir is faster)',
          'Amir: ' + t(sh.a * 8 + '\\div 8=' + sh.a) + ' m/min. Bea: ' + t('(' + e8 + '-' + sh.h + ')\\div 8=' + sh.b) + ' m/min. Amir is faster (his line is steeper).', ['Speed = distance run ÷ time. Read where each line is at ' + t('t=8') + '.', 'Bea’s distance run starts from her head start, not from 0.'], 'EP16 speeds');
      } },
      { id: 'e16c', level: 'MAS', outcome: 'RF1', make: function (r, sh) {
        var T = sh.T, D = sh.a * T, fl = [{ label: 'Time', name: 'Time', before: t('t='), after: 'min' }, { label: 'Distance along the track', name: 'Distance', after: 'm' }];
        return KP.fields('At what time does Amir catch Bea, and how far along the track are they at that moment?', fl, [K.number(T, function (v) { return v === sh.h / sh.a ? { code: 'u5l3-head-start', hint: 'Bea keeps running too: Amir gains only ' + (sh.a - sh.b) + ' m on her each minute.' } : null; }), K.number(D, function (v) { return v === sh.h ? { code: 'u5l3-catch', hint: 'That is the head start. Where are they when the lines cross?' } : null; })],
          [String(T), String(D)], t('t=' + T) + ' min, ' + t(D) + ' m',
          'Amir gains ' + t(sh.a + '-' + sh.b + '=' + (sh.a - sh.b)) + ' m on Bea every minute. To close the ' + t(sh.h) + ' m head start takes ' + t(sh.h + '\\div ' + (sh.a - sh.b) + '=' + T) + ' min. Then both are at ' + t(sh.a + '\\times ' + T + '=' + D) + ' m (Bea: ' + t(sh.h + '+' + sh.b + '\\times ' + T + '=' + (sh.h + sh.b * T)) + ' ✓) — where the lines cross.',
          ['How many metres does Amir gain on Bea each minute?', 'Or find where the two lines cross.'], 'EP16 catch');
      } },
      { id: 'e16d', level: 'EMG', outcome: 'RF1', make: function (r, sh) {
        var q = sh.q, A = sh.a * q, B = sh.h + sh.b * q, lead = B > A ? 'Bea' : 'Amir', gap = Math.abs(B - A);
        return KP.mc(r, 'Who is ahead at ' + t(q) + ' minutes, and by how much?', [
          { html: lead + ', by ' + gap + ' m (' + B + ' m versus ' + A + ' m for Bea and Amir) — ' + (lead === 'Bea' ? 'her' : 'his') + ' line is the higher one at ' + t('t=' + q) + '.', right: true },
          { html: (lead === 'Bea' ? 'Amir' : 'Bea') + ', by ' + gap + ' m — ' + (lead === 'Bea' ? 'he' : 'she') + ' is running faster.', why: 'Running faster doesn’t mean being ahead yet. Read both lines at ' + t('t=' + q) + '.' },
          { html: lead + ', by ' + sh.h + ' m — the head start.', why: 'The gap changes every minute. Read both lines at ' + t('t=' + q) + '.' },
          { html: 'Neither — they are level.', why: 'They are level only at ' + t('t=' + sh.T) + '.' }],
          'At ' + t('t=' + q) + ': Amir ' + t(sh.a + '\\times ' + q + '=' + A) + ' m, Bea ' + t(sh.h + '+' + sh.b + '\\times ' + q + '=' + B) + ' m. <b>' + lead + '</b> is ahead by ' + t(gap) + ' m — the higher line at a glance.', ['Read both lines at ' + t('t=' + q) + '.'], 'EP16 ahead');
      } }] });
  X.push({ num: '17', stem: function (sh) { return 'A swimming pool holds ' + t(sh.V) + ' L and is drained at a steady ' + t(sh.r) + ' L per minute. Two of the three tables below cannot describe this situation.<div style="display:flex;flex-wrap:wrap;gap:6px 18px">' + sh.tabs.map(function (tb, i) { return '<div><b>Table ' + (i + 1) + '</b>' + htable('\\(t\\)', '\\(V\\)', [0, 2, 4, 6], tb.ys) + '</div>'; }).join('') + '</div>'; },
    shared: function (r) { var V = r.pick([400, 500, 600]), rr = r.pick([20, 25, 25, 30]); if (r.chance(0.2)) { V = 500; rr = 25; } var mk = function (s) { return [0, 2, 4, 6].map(function (x) { return V + s * x; }); }; var tabs = r.shuffle([{ k: 'right', ys: mk(-rr) }, { k: 'fill', ys: mk(rr) }, { k: 'fast', ys: mk(-2 * rr) }]); return { V: V, r: rr, tabs: tabs, right: tabs.map(function (x) { return x.k; }).indexOf('right') + 1 }; },
    parts: [
      { id: 'e17a', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
        var w = function (k) { return sh.tabs.map(function (x) { return x.k; }).indexOf(k) + 1; };
        return KP.mc(r, 'Which table matches the situation? Justify with a rate.', [1, 2, 3].map(function (n) { var k = sh.tabs[n - 1].k, rate = k === 'right' ? -sh.r : k === 'fill' ? sh.r : -2 * sh.r; return { html: 'Table ' + n + ': ' + t('V') + ' changes ' + t((rate > 0 ? '+' : '') + 2 * rate) + ' L every 2 min, i.e. ' + t((rate > 0 ? '+' : '') + rate) + ' L/min.', right: k === 'right', why: k === 'right' ? null : k === 'fill' ? 'The volume goes <b>up</b> — that pool is being filled, not drained.' : 'That drains ' + 2 * sh.r + ' L/min — twice as fast as the situation says.' }; }).concat([{ html: 'All three: each one starts at ' + sh.V + ' L.', why: 'Starting at ' + sh.V + ' L isn’t enough — the rate must be ' + t('-' + sh.r) + ' L/min.' }]),
          'Draining at ' + sh.r + ' L/min means ' + t(2 * sh.r) + ' L less every 2 min: <b>Table ' + w('right') + '</b> (' + t(seqTex(sh.tabs[w('right') - 1].ys)) + ').', ['Work out how much the volume changes per minute in each table.'], 'EP17 which table', true);
      } },
      { id: 'e17b', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
        var wf = sh.tabs.map(function (x) { return x.k; }).indexOf('fill') + 1, wq = sh.tabs.map(function (x) { return x.k; }).indexOf('fast') + 1;
        return KP.mc(r, 'Which description fits the other two tables?', [
          { html: 'Table ' + wf + ': the same pool being <b>filled</b> at ' + sh.r + ' L/min. Table ' + wq + ': the pool draining at ' + 2 * sh.r + ' L/min — twice as fast (a wider pipe).', right: true },
          { html: 'Table ' + wf + ': the pool draining at ' + sh.r + ' L/min. Table ' + wq + ': the pool being filled at ' + 2 * sh.r + ' L/min.', why: 'In Table ' + wf + ' the volume goes <b>up</b>; in Table ' + wq + ' it goes <b>down</b>.' },
          { html: 'Table ' + wf + ': being filled at ' + 2 * sh.r + ' L/min. Table ' + wq + ': draining at ' + sh.r / 2 + ' L/min.', why: 'Check the rates: divide the change over 2 minutes by 2.' },
          { html: 'Neither can describe any pool.', why: 'Both are possible situations — just not this one.' }],
          'Table ' + wf + ' rises ' + t(2 * sh.r) + ' L every 2 min: ' + t('+' + sh.r) + ' L/min, the pool being <b>filled</b>. Table ' + wq + ' falls ' + t(4 * sh.r) + ' L every 2 min: ' + t('-' + 2 * sh.r) + ' L/min, draining twice as fast.', ['Find each table’s rate per minute and its direction.'], 'EP17 other tables');
      } }] });
  X.push({ num: '18', stem: '', parts: [
    { id: 'e18', level: 'EMG', outcome: 'RF1', make: function (r) {
      var w = shapeGraph([], 'a repeating wave', { max: 200, fns: [{ f: function (x) { return 3.2 - 2.8 * Math.cos(x * 2.1); }, from: 0, to: 6.8 }] });
      return KP.mc(r, 'A Ferris wheel turns at a steady speed. Why can’t a graph of a rider’s height above the ground against time be an increasing line, and what shape must it have?', [
        { html: 'The rider goes up to the top, comes back down, and repeats, so the height rises and falls between a minimum and a maximum — a repeating wave.', right: true },
        { html: 'It can be an increasing line: the wheel turns at a steady speed.', why: 'Steady turning doesn’t mean steady rising: after the top, the rider comes back down.' },
        { html: 'It must be a horizontal line, because the speed is steady.', why: 'The height changes all the time, even though the speed is steady.' },
        { html: 'It must be a decreasing line, because riders get off at the bottom.', why: 'The rider goes up and down many times during the ride.' }],
        w + '<br>The height goes up to the top, back down to the bottom, and repeats: a <b>repeating wave</b> between the lowest and highest heights, never a line that keeps increasing.', ['Picture the rider’s height during one full turn.'], 'EP18 Ferris wheel');
    } }] });
  X.push({ num: '19', stem: '', parts: [
    { id: 'e19', level: 'PRG', outcome: 'RF1', make: function (r) {
      return KP.mc(r, 'On a distance–time graph, can a section ever be a perfectly <b>vertical</b> segment?', [
        { html: 'No: a vertical segment would put the object at many different distances at the <b>same</b> instant — infinite speed, which is impossible.', right: true },
        { html: 'Yes: it shows the object standing still.', why: 'Standing still is a <b>horizontal</b> segment: time passes, the distance stays the same.' },
        { html: 'Yes: it shows a very fast object.', why: 'However fast, it takes <i>some</i> time to cover a distance, so the segment always leans a little.' },
        { html: 'Yes: it shows the object going back home.', why: 'Going back home is a section sloping down, as time keeps passing.' }],
        'A vertical segment has one time but many distances: the object would be in many places at once (infinite speed). That is impossible, so distance–time graphs never have vertical pieces.', ['What would a vertical segment claim about the time?'], 'EP19 vertical');
    } }] });

  HW.defineLesson({
    id: 'u5l3', unit: 5, num: '3', title: 'Describing Relationships Between Two Quantities', outcome: 'RF2',
    blurb: 'A relation as ordered pairs, a table of values, a mapping diagram and a graph.',
    questions: QUESTIONS, extra: X
  });
})(window);
