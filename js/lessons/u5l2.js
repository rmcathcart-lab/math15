/* Math 15 · Unit 5 · Lesson 2 — Growing Patterns and Types of Variables (RF4, RF1)
 * Assignment 2 (u5_L02.tex, Questions 1–13) and the Lesson 2 Extra Practice (u5_EP02.tex, Questions 1–19).
 * Every part is a generator: same structure and idea as the booklet question (the booklet's numbers are among the
 * possible values), new numbers / situations from the seed. Models: Math 10C u5l1.js (pattern tables, pattern plots,
 * pattern equations, discrete/continuous) and u5l2.js (independent/dependent variables).
 * Outcomes: RF4 (a growing pattern described in words, a table, a graph and a rule) by default; RF1 for independent /
 * dependent variables and discrete / continuous; RF2 for reading coordinates (Question 2, review of Lesson 1).
 * Conversions: "identify the independent and dependent variable" -> a two-row table of choices; "describe / explain"
 * -> multiple choice whose options are reasons; "represent the data on the grid" -> the graph pad (points only: joining
 * points is not taught in this lesson's notes; Extra 13 asks about it after the plot); tables -> number boxes;
 * rules t = mn + b -> a polynomial answer with "t =" printed.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 17(c) (when two growing patterns are equal). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, DR = HW.draw;
  var INK = '#2b3340';

  HW.addCodes({
    'var-swap': 'Swapped independent and dependent variables', 'var-same': 'Gave the same variable twice', 'var-letter': 'Wrong letter for the variable',
    'off-by-one': 'Figure numbers off by one', 'step-wrong': 'Wrong amount added per figure', 'first-term': 'Used the first value as the constant', 'no-constant': 'Equation missing the constant term',
    'step-as-const': 'Used the step as the constant', 'times-first': 'Multiplied by the first value', 'swapped-coef': 'Rate and starting value swapped', 'add-not-sub': 'Added instead of subtracting when solving',
    'no-divide': 'Didn’t divide by the rate', 'no-subtract': 'Didn’t subtract the constant', 'sub-wrong-var': 'Substituted into the wrong variable', 'diff-rev': 'Subtracted in the wrong order',
    'graph-swap': 'Plotted (y, x) instead of (x, y)', 'graph-points': 'Point misplaced', 'pair-format': 'Ordered pair not written as (x, y)', 'pair-brackets': 'Ordered pair without brackets',
    'pair-swap': 'Coordinates in the wrong order', 'pair-sign': 'Sign of a coordinate wrong', 'pair-value': 'Wrong coordinates', 'table-x': 'Plotted against 0, 1, 2, … instead of the table’s values',
    'u5l2-mult-k': 'Multiplied the step by the figure number (no start)', 'u5l2-sq-double': 'Used 2n for n²', 'u5l2-const-word': 'Didn’t answer yes/no', 'u5l2-said-const': 'Called changing differences constant',
    'u5l2-said-notconst': 'Called constant differences not constant', 'u5l2-next-step': 'Kept adding the last difference', 'u5l2-neg-tiles': 'Allowed a negative number of tiles', 'u5l2-last-fig': 'Wrong last figure',
    'u5l2-row-tile': 'Counted the extra tile in every row', 'u5l2-equal-fig': 'Wrong figure where the patterns are equal', 'u5l2-equal-count': 'Gave the figure number for the number of tiles'
  });
  HW.addPartial({ 'u5l2-mult-k': 'b', 'u5l2-sq-double': 'n', 'u5l2-const-word': 's', 'u5l2-said-const': 'b', 'u5l2-said-notconst': 'b', 'u5l2-next-step': 'b', 'u5l2-neg-tiles': 'n',
    'u5l2-last-fig': 's', 'u5l2-row-tile': 'b', 'u5l2-equal-fig': 'b', 'u5l2-equal-count': 's' });

  /* ---------- small helpers ---------- */
  function feq(a, b) { return Math.abs(a - b) < 1e-9; }
  function num(x) { return String(Math.round(x * 1e6) / 1e6); }
  function pt(p) { return '(' + num(p[0]) + ', ' + num(p[1]) + ')'; }
  function lin(m, b, v) { var a = m === 1 ? v : m === -1 ? '-' + v : m + v; return b === 0 ? a : a + (b > 0 ? '+' : '-') + Math.abs(b); }
  function linP(m, b, v) { var o = {}; o[v] = 1; return P.add(P.mono(m, o), P.num(b)); }
  function seqTex(ys) { return ys.map(num).join(',\\ '); }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function htable(h1, h2, xs, ys) { return HW.valueTable([[h1].concat(xs), [h2].concat(ys)]); }
  function mcCols(p) { p.input.columns = 2; return p; }
  function numPart(prompt, ans, diag, sol, hints, text, inp) { var p = KP.number(prompt, ans, diag, sol, hints, text, inp); p.answer = t(num(ans)) + (inp && inp.after ? ' ' + inp.after : ''); return p; }
  /* a table row of number boxes: one per x-value */
  function tablePart(prompt, xName, xs, f, diagFor, sol, hints, text, yName) {
    var fl = xs.map(function (x) { return { label: t(xName + '=' + x), name: t(xName + '=' + x), mode: 'number', before: yName ? t(yName + '=') : null }; });
    var ch = xs.map(function (x) { return K.number(f(x), diagFor ? function (v) { return diagFor(x, v); } : null); });
    var p = KP.fields(prompt, fl, ch, xs.map(function (x) { return String(f(x)); }), htable(t(xName), t(yName || 'T'), xs, xs.map(f)), sol, hints, text);
    p.bad = [xs.map(function (x) { return String(f(x) + 1); })];
    return p;
  }
  function patternDiag(f, a, d) { // a = Figure 1, d = step
    return function (n, v) {
      if (v === f(n + 1) && n > 0) return { code: 'off-by-one', hint: 'That is the count for Figure ' + (n + 1) + '. Figure 1 has ' + f(1) + '; add ' + d + ' for each figure after it.' };
      if (v === f(n - 1) && n > 1) return { code: 'off-by-one', hint: 'That is the count for Figure ' + (n - 1) + '.' };
      if (v === d * n && d * n !== f(n)) return { code: 'u5l2-mult-k', hint: 'Figure ' + n + ' isn’t just ' + d + ' × ' + n + ': start at ' + f(1) + ' and add ' + d + ' each time.' };
      return null;
    };
  }
  /* an equation  LHS = m·v + b : the left side is printed; the student types the right side */
  function relabel(s, v) {
    var letters = {};
    String(s).replace(/\\[a-zA-Z]+/g, ' ').replace(/[a-zA-Z]/g, function (c) { letters[c] = 1; return c; });
    var ls = Object.keys(letters).filter(function (c) { return c !== v; });
    if (ls.length !== 1) return s;
    return String(s).replace(/(\\[a-zA-Z]+)|([a-zA-Z])/g, function (m0, cmd, ch) { return cmd ? cmd : ch === ls[0] ? v : ch; });
  }
  function eqCheck(lhs, target, ws) {
    var v = P.vars(target)[0] || 'n', base = K.poly(target, { wrong: ws, expanded: false });
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(new RegExp('^\\s*' + lhs + '\\s*='), '').replace(new RegExp('^\\s*' + lhs.toLowerCase() + '\\s*='), '');
      var r = base(s);
      if (r.v === 'correct' || r.v === 'form') return r;
      var alt = relabel(s, v);
      if (alt !== s && base(alt).v === 'correct') return form('var-letter', 'Right rule — but use the letter ' + t(v) + ' from the question.');
      return r;
    };
  }
  function eqPart(prompt, lhs, target, keyTex, wrongs, sol, hints, text, extra) {
    extra = extra || {};
    var v = P.vars(target)[0] || 'n', ws = (wrongs || []).filter(function (w) { return w && !P.eq(w.is, target); });
    return { prompt: prompt, input: { type: 'math', keys: 'poly', vars: [v], before: t(lhs + '=') }, check: eqCheck(lhs, target, ws), key: keyTex, answer: t(lhs + '=' + keyTex), solution: sol, hints: hints || [], text: text,
      good: [lhs + '=' + keyTex].concat(extra.good || []), bad: ws.map(function (w) { return P.tex(w.is); }).concat(extra.bad || []) };
  }
  function ruleWrongs(m, b, F1) { // typical wrong rules for t = mn + b
    return [{ is: linP(m, F1, 'n'), code: 'first-term', hint: 'Test it on Figure 1: ' + t(m + '(1)+' + F1 + '=' + (m + F1)) + ', not ' + F1 + '. The number added is the value at “Figure 0”: ' + t(F1 + '-' + m + '=' + b) + '.' },
      { is: linP(m, 0, 'n'), code: 'no-constant', hint: 'Test it on Figure 1: ' + t(m + '(1)=' + m) + ', but Figure 1 has ' + F1 + '. Something has to be added.' },
      { is: linP(b, m, 'n'), code: 'swapped-coef', hint: 'Your numbers are swapped: the amount added each figure, ' + m + ', goes in front of ' + t('n') + '.' },
      { is: linP(1, m, 'n'), code: 'step-as-const', hint: 'The amount added each figure (' + m + ') multiplies ' + t('n') + '; it isn’t added on.' },
      { is: linP(F1, 0, 'n'), code: 'times-first', hint: 'Test it on Figure 2: ' + t(F1 + '(2)=' + 2 * F1) + ', but Figure 2 has ' + (F1 + m) + '.' }];
  }
  function solveDiag(m, b, V) {
    return function (v) {
      if (feq(v, (V + b) / m) && b) return { code: 'add-not-sub', hint: 'To undo the “' + t((b > 0 ? '+' : '-') + Math.abs(b)) + '”, do the opposite first: ' + (b > 0 ? 'subtract' : 'add') + ' ' + Math.abs(b) + '.' };
      if (feq(v, V - b) && m !== 1) return { code: 'no-divide', hint: 'You have ' + t(m + 'n=' + (V - b)) + '. Now divide by ' + m + '.' };
      if (feq(v, V / m) && b) return { code: 'no-subtract', hint: 'Undo the ' + t((b > 0 ? '+' : '-') + Math.abs(b)) + ' before dividing by ' + m + '.' };
      if (feq(v, m * V + b)) return { code: 'sub-wrong-var', hint: t(V) + ' is the number of tiles, ' + t('t') + ' — not the figure number. Solve ' + t(lin(m, b, 'n') + '=' + V) + '.' };
      return null;
    };
  }
  function solveSol(m, b, V, N) { return t(lin(m, b, 'n') + '=' + V) + '<br>' + t(m + 'n=' + (V - b)) + '<br>' + t('n=' + N) + ': Figure ' + N + '.'; }

  /* ---------- graph pad ---------- */
  function gv(pts, pieces, join) { return { pts: pts || [], pieces: pieces || [], join: join || 'none' }; }
  function exactChk(target, opt) { var base = K.graphExact(target, opt); return function (resp) { if (!DR.empty(resp) && DR.same(resp, target)) return ok(); return base(resp); }; }
  function pointsDiag(tp, xName, yName) {
    return function (resp) {
      var S = DR.norm(resp);
      for (var i = 0; i < tp.length; i++) {
        var p = tp[i], at = S.pts.filter(function (q) { return feq(q[0], p[0]); });
        if (at.length && !at.some(function (q) { return feq(q[1], p[1]); })) return 'Check your point at ' + t(xName + '=' + p[0]) + ': from the table ' + t(yName + '=' + p[1]) + ', so it goes at ' + t(pt(p)) + '.';
      }
      return null;
    };
  }
  /* plot a table's points (first quadrant). gy = grid step on the vertical axis (snap) */
  function plotPart(prompt, tp, xName, yName, gy, sol, hints, text, o) {
    o = o || {};
    var ymax = Math.max.apply(null, tp.map(function (p) { return p[1]; })), ly = gy * Math.max(1, Math.round(ymax / gy / 8)), Y = Math.ceil((ymax + gy) / ly) * ly, X = Math.max.apply(null, tp.map(function (p) { return p[0]; })) + 1;
    var target = gv(tp), base = exactChk(target, { wrong: [{ is: gv(tp.map(function (p, i) { return [i, p[1]]; })), code: 'off-by-one', hint: 'Figure 1 goes above ' + t(xName + '=1') + ' on the horizontal axis, not above ' + t('0') + '.' }] }), diag = pointsDiag(tp, xName, yName);
    var check = function (resp) { var res = base(resp); if (res.v === 'wrong' && (!res.hint || res.code === 'graph-points')) { var h = diag(resp); if (h) return wrong('graph-points', h); } return res; };
    var inp = { x: [0, X], y: [0, Y], grid: 1, gridY: gy, labels: 1, labelsX: 1, labelsY: ly, unitX: Math.min(48, 300 / X), unitY: Math.min(34, 300 / (Y / gy)) / gy, firstQuadrant: true, xName: xName, yName: yName, xTitle: o.xTitle, yTitle: o.yTitle, mode: 'points', snapX: 1, snapY: gy };
    var p = KP.graph(prompt, inp, check, target, sol, hints, text);
    p.bad = [gv(tp.map(function (q) { return [q[1], q[0]]; })), gv(tp.slice(1)), gv(tp.map(function (q, i) { return [i, q[1]]; }))].filter(function (b) { return !DR.same(b, target); });
    return p;
  }

  /* ---------- labelled grid (letters placed clear of the axis numbers) ---------- */
  function labelledGraph(spec, pts) {
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
  /* ---- one ordered pair (x, y) ---- */
  function readPair(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\[,;:! ]|~/g, '').replace(/−/g, '-').replace(/\\lbrace|\\rbrace|\\\{|\\\}/g, '').replace(/\s+/g, '');
    if (/^\{.*\}$/.test(s) && !/^\{[^{}]*\}\{/.test(s)) s = s.slice(1, -1);
    if (!s) return { empty: true };
    s = s.replace(/^[A-Za-z]'?=?(?=\()/, '');
    var m = /^\((.*)\)$/.exec(s), inner = m ? m[1] : s, bits = inner.split(',');
    if (bits.length !== 2 || !bits[0] || !bits[1]) return { bad: true };
    var a = HW.ex.parse(bits[0]), b = HW.ex.parse(bits[1]);
    if (!a.ok || !b.ok) return { bad: true };
    var x = HW.ex.value(a.ast), y = HW.ex.value(b.ast);
    if (!isFinite(x) || !isFinite(y)) return { bad: true };
    return { x: x, y: y, parens: !!m };
  }
  function pairCheck(x, y) {
    return function (resp) {
      var p = readPair(resp);
      if (p.empty) return form('empty', 'Type the ordered pair first.');
      if (p.bad) return form('pair-format', 'Write the point as an ordered pair in brackets, ' + t('(x, y)') + ', for example ' + t('(3, -2)') + '.');
      if (feq(p.x, x) && feq(p.y, y)) return p.parens ? ok() : form('pair-brackets', 'Right numbers — now write them as an ordered pair in brackets: ' + t('(x, y)') + '.');
      if (feq(p.x, y) && feq(p.y, x)) return wrong('pair-swap', 'Your numbers are in the wrong order: the ' + t('x') + '-coordinate (across) comes first, then the ' + t('y') + '-coordinate (up or down).');
      if (feq(Math.abs(p.x), Math.abs(x)) && feq(Math.abs(p.y), Math.abs(y))) return wrong('pair-sign', 'Check the signs: left of the ' + t('y') + '-axis, ' + t('x') + ' is negative; below the ' + t('x') + '-axis, ' + t('y') + ' is negative.');
      return wrong('pair-value', null);
    };
  }

  /* ---------- independent / dependent variables ---------- */
  // [dependent, independent, type of the independent variable ('d' discrete / 'c' continuous), why]
  var SIT = [
    ['the number of pages read in a book', 'the number of minutes spent reading', 'c', 'You decide how long to read; the pages read result from that.'],
    ['the total amount saved in a piggy bank', 'the number of weeks spent saving', 'd', 'The savings pile up as the weeks go by — the weeks don’t depend on the savings.'],
    ['the temperature of a glass of ice water', 'the number of minutes it sits on the counter', 'c', 'The water warms as time passes; time doesn’t depend on the temperature.'],
    ['the total number of stickers given out', 'the number of students in the class', 'd', 'Each student gets stickers, so the total depends on how many students there are.'],
    ['the temperature of an oven while it preheats', 'the number of minutes since it was turned on', 'c', 'The oven heats up as the minutes pass.'],
    ['the distance a cyclist has travelled', 'the number of hours spent cycling at a steady speed', 'c', 'The distance results from how long she has been cycling.'],
    ['the height remaining on a candle', 'the number of hours it has been burning', 'c', 'The candle shrinks as the hours pass; the hours don’t depend on the candle.'],
    ['the total cost of a taxi ride', 'the number of kilometres travelled', 'c', 'The fare is worked out from the distance.'],
    ['the battery percentage of a phone', 'the number of hours it has been charging', 'c', 'The battery fills up as the charging time goes on.'],
    ['the price of a pizza', 'the number of extra toppings ordered', 'd', 'You choose the toppings; the price results from that choice.'],
    ['the distance a runner has covered', 'the number of minutes spent running', 'c', 'The distance results from how long she has been running.'],
    ['the number of tiles in a figure', 'the figure number', 'd', 'Each figure number gives its own number of tiles.'],
    ['the total cost of movie tickets', 'the number of tickets bought', 'd', 'You choose how many tickets to buy; the cost results.'],
    ['the height of a bean plant', 'the number of days since it sprouted', 'd', 'The plant grows as the days pass.'],
    ['the total pay earned at a part-time job', 'the number of hours worked', 'c', 'The pay is calculated from the hours worked.'],
    ['the volume of water in a bathtub', 'the number of minutes the tap has been running', 'c', 'The tub fills as the minutes pass.'],
    ['the money collected at a car wash', 'the number of cars washed', 'd', 'The money comes in car by car.'],
    ['the depth of snow on the ground', 'the number of hours it has been snowing', 'c', 'The snow piles up as the hours pass.'],
    ['the total number of wheels in a bike-shop display', 'the number of tricycles in the display', 'd', 'Each tricycle adds 3 wheels: the wheels depend on the tricycles.'],
    ['the mass of a bag of apples', 'the number of apples in the bag', 'd', 'Each apple adds mass: the mass depends on how many apples there are.'],
    ['the cost of a bag of grapes', 'the mass of the grapes', 'c', 'Grapes are sold by mass, so the cost is worked out from the mass.'],
    ['the number of slices of pizza left', 'the number of people who have eaten', 'd', 'The slices left depend on how many people have eaten.'],
    ['the amount of gas left in a car’s tank', 'the number of kilometres driven', 'c', 'Driving uses gas, so the gas left depends on the distance driven.'],
    ['the total cost of a phone plan', 'the number of months on the plan', 'd', 'The cost adds up month by month.'],
    ['the number of push-ups done', 'the number of minutes spent exercising', 'c', 'The push-ups pile up as the minutes pass.'],
    ['the height of a stack of cups', 'the number of cups in the stack', 'd', 'Each cup makes the stack taller.'],
    ['the length of a shadow', 'the time of day', 'c', 'The shadow changes as the day goes on; the time doesn’t depend on the shadow.'],
    ['the number of tickets sold for a game', 'the number of hours the ticket office is open', 'c', 'More hours open, more tickets sold.'],
    ['the total number of legs at a dog show', 'the number of dogs at the show', 'd', 'Each dog adds 4 legs.'],
    ['the amount of paint used', 'the area of wall painted', 'c', 'The paint used depends on how much wall is painted.'],
    ['the cost of renting a canoe', 'the number of hours it is rented', 'c', 'The rental cost is worked out from the hours.'],
    ['the number of bracelets made', 'the number of beads used', 'd', 'The beads you use decide how many bracelets you can make.'],
    ['the water level in a draining sink', 'the number of seconds since the plug was pulled', 'c', 'The water drains as the seconds pass.'],
    ['the total mass of a box of books', 'the number of books in the box', 'd', 'Each book adds mass.'],
    ['the distance a snail has crawled', 'the number of minutes it has been crawling', 'c', 'The distance results from how long it has crawled.'],
    ['the number of seats in an auditorium', 'the number of rows of seats', 'd', 'Each row adds seats.'],
    ['the temperature of a cup of hot chocolate', 'the number of minutes since it was poured', 'c', 'It cools as the minutes pass.'],
    ['the cost of printing photos', 'the number of photos printed', 'd', 'Each photo printed adds to the cost.'],
    ['the number of words typed', 'the number of minutes spent typing', 'c', 'The words add up as the minutes pass.'],
    ['the height of water in a rain gauge', 'the number of hours it has been raining', 'c', 'The water rises as the rain keeps falling.']];
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function sitPart(r, s, text, prompt) { // a two-row table: which quantity is independent?
    var rows = r.shuffle([{ id: 'i', html: cap(s[1].replace(/^the /, '')) }, { id: 'd', html: cap(s[0].replace(/^the /, '')) }]);
    return KP.grid(prompt || cap(s[0]) + ', based on ' + s[1] + '. Identify the independent variable and the dependent variable.', rows, [{ id: 'I', html: 'Independent' }, { id: 'D', html: 'Dependent' }], { i: 'I', d: 'D' },
      { why: function (row, got) { return { code: got === 'I' && row === 'd' || got === 'D' && row === 'i' ? 'var-swap' : 'var-same', hint: s[3] + ' So ' + s[1] + ' is the <b>independent</b> variable (the input) and ' + s[0] + ' is the <b>dependent</b> variable (it results from the input).' }; } },
      'Independent: <b>' + s[1] + '</b> (chosen, or it changes on its own). Dependent: <b>' + s[0] + '</b> (it results from the independent variable). ' + s[3],
      ['Ask: which quantity is decided by the other one? That one is dependent.', 'The words “based on” point to the independent variable.'], text);
  }

  /* ---------- tile figures (Extra 3) ---------- */
  function figRow(items, labels, opt) {
    opt = opt || {};
    var sc = opt.scale || 1.3, m = 6, H = Math.max.apply(null, items.map(function (i) { return i.h; }));
    var out = items.map(function (it, i) {
      var slot = Math.max(it.w, 58) + 2 * m, x = (slot - it.w) / 2;
      var s = it.draw(x, m + H - it.h) + '<text x="' + (slot / 2) + '" y="' + (m + H + 18) + '" text-anchor="middle" font-size="12">' + labels[i] + '</text>';
      return '<svg class="fig-svg" viewBox="0 0 ' + Math.ceil(slot) + ' ' + Math.ceil(H + m + 26) + '" style="width:' + Math.round(slot * sc) + 'px;max-width:100%;flex:0 0 auto;margin:4px 0" role="img" aria-label="' + (opt.label || 'pattern') + ', ' + labels[i] + '" font-family="KaTeX_Main, \'Times New Roman\', serif" font-size="13" fill="' + INK + '">' + s + '</svg>';
    });
    return '<div class="fig-row" style="display:flex;flex-wrap:wrap;gap:4px 16px;align-items:flex-end;margin:6px 0">' + out.join('') + '</div>';
  }
  function rowsFig(n, rows, extra) { // rows × n tiles, plus a column of `extra` tiles on top of the left column
    var c = 12, W = n * c, H = (rows + extra) * c;
    return { w: W, h: H, draw: function (ox, oy) {
      var s = '', i, j;
      for (j = 0; j < rows; j++) for (i = 0; i < n; i++) s += '<rect x="' + (ox + i * c) + '" y="' + (oy + H - (j + 1) * c) + '" width="' + c + '" height="' + c + '" fill="#e7ecf5" stroke="' + INK + '" stroke-width="1.1"/>';
      for (j = 0; j < extra; j++) s += '<rect x="' + ox + '" y="' + (oy + H - (rows + j + 1) * c) + '" width="' + c + '" height="' + c + '" fill="#f6d9a8" stroke="' + INK + '" stroke-width="1.1"/>';
      return s;
    } };
  }

  /* ---------- vocabulary ---------- */
  var VOC = ['independent', 'dependent', 'table of values', 'horizontal (\\(x\\))', 'vertical (\\(y\\))', 'ordered pair'];
  var VWHY = { independent: 'The independent variable is the one you choose or control (the input).', dependent: 'The dependent variable results from, or depends on, the other one (the output).',
    'table of values': 'A table of values organizes the input and output values in rows.', 'horizontal (\\(x\\))': 'The horizontal axis is the ' + t('x') + '-axis, for the independent variable.',
    'vertical (\\(y\\))': 'The vertical axis is the ' + t('y') + '-axis, for the dependent variable.', 'ordered pair': 'An ordered pair ' + t('(x, y)') + ' locates one point.' };
  function vocabPart(r, sentences, right, pool, sol, text) {
    var others = r.sample(pool.filter(function (w) { return w !== right; }), 3);
    return KP.mc(r, r.pick(sentences), [{ html: right, right: true }].concat(others.map(function (w) { return { html: w, why: VWHY[w] + ' Read the sentence again with that word in the blank.' }; })), sol,
      ['Look back at the notes: independent and dependent variables, tables of values, and which axis each variable goes on.'], text);
  }

  /* ---------- growing patterns (assignment) ---------- */
  function patShared(lo1, hi1, lo2, hi2, klo, khi, book) {
    return function (r) {
      var a = r.int(lo1, hi1), d = r.int(lo2, hi2), k = r.int(klo, khi);
      if (r.chance(0.2)) { a = book[0]; d = book[1]; k = book[2]; }
      return { a: a, d: d, k: k, f: function (n) { return a + (n - 1) * d; } };
    };
  }
  var CTX = { bricks: ['A pattern of tiles is built using bricks.', 'bricks', 'T'], chairs: ['A pattern of chairs is set up in rows for an assembly.', 'chairs', 'T'], coins: ['A pattern of coins is stacked in piles.', 'coins', 'T'] };
  function patStem(c) { return function (sh) { return CTX[c][0] + ' Figure ' + t('1') + ' has ' + t(sh.a) + ' ' + CTX[c][1] + ', and each new figure has ' + t(sh.d) + ' more ' + CTX[c][1] + ' than the figure before it. Let ' + t('n') + ' be the figure number and ' + t('T') + ' the number of ' + CTX[c][1] + '.'; }; }
  function patTable(c) {
    return function (r, sh) {
      return tablePart('Complete the table relating the number of ' + CTX[c][1] + ', ' + t('T') + ', to the figure number, ' + t('n') + '.', 'n', [1, 2, 3, 4, 5], sh.f, patternDiag(sh.f, sh.a, sh.d),
        'Start at ' + t(sh.a) + ' and add ' + t(sh.d) + ' each time: ' + t(seqTex([1, 2, 3, 4, 5].map(sh.f))) + '.', ['Figure 1 has ' + sh.a + '. Add ' + sh.d + ' to get each next figure.'], c + ' table', 'T');
    };
  }
  function figureK(c, level) {
    return function (r, sh) {
      var k = sh.k, v = sh.f(k);
      return numPart('Continue the pattern to find the number of ' + CTX[c][1] + ' in Figure ' + t(k) + '.', v, function (x) {
        if (x === sh.a + k * sh.d) return { code: 'off-by-one', hint: 'Figure 1 already has the ' + sh.a + '. From Figure 1 to Figure ' + k + ' there are only ' + (k - 1) + ' steps of ' + sh.d + '.' };
        if (x === sh.d * k) return { code: 'u5l2-mult-k', hint: t(sh.d + '\\times ' + k) + ' leaves out the start. Figure 1 has ' + sh.a + ', then add ' + sh.d + ' for each figure after it.' };
        if (x === sh.f(k - 1) || x === sh.f(k + 1)) return { code: 'off-by-one', hint: 'That is Figure ' + (x === sh.f(k - 1) ? k - 1 : k + 1) + '. Count the steps again.' };
        return null;
      }, 'Keep adding ' + t(sh.d) + ': ' + t(seqTex(range(1, k).map(sh.f))) + '. Figure ' + k + ' has ' + t(v) + '.<br>(Shortcut: ' + t(sh.a + '+' + (k - 1) + '\\times ' + sh.d + '=' + v) + '.)', ['Extend the table one figure at a time, adding ' + sh.d + ' each time.'], c + ' figure ' + k);
    };
  }

  var QUESTIONS = [
    /* ===================== Part A ===================== */
    { num: '1', section: 'Part A — Vocabulary and Review', stem: 'Complete the following statements.', parts: [
      { id: '1a', level: 'LIM', outcome: 'RF1', make: function (r) { return vocabPart(r, ['The variable you choose or control is called the ______ variable.', 'In a relation, the input variable — the one you control — is called the ______ variable.'], 'independent', VOC, 'The variable you choose or control is the <b>independent</b> variable.', 'vocab independent'); } },
      { id: '1b', level: 'LIM', outcome: 'RF1', make: function (r) { return vocabPart(r, ['The variable that results from, or depends on, the other variable is called the ______ variable.', 'The output variable, whose value depends on the input, is called the ______ variable.'], 'dependent', VOC, 'The variable that results from the other one is the <b>dependent</b> variable.', 'vocab dependent'); } },
      { id: '1c', level: 'LIM', make: function (r) { return vocabPart(r, ['A table that organizes a pattern’s input and output values is called a ______.', 'Figure numbers in one row and the matching values in the other row make a ______.'], 'table of values', VOC, 'A <b>table of values</b> organizes the inputs and outputs.', 'vocab table of values'); } },
      { id: '1d', level: 'LIM', outcome: 'RF1', make: function (r) { return vocabPart(r, ['When graphing, the independent variable is plotted on the ______ axis.', 'On a graph of a relation, the input (independent) variable goes on the ______ axis.'], 'horizontal (\\(x\\))', VOC, 'Independent variable → <b>horizontal</b> (' + t('x') + ') axis.', 'vocab independent axis'); } },
      { id: '1e', level: 'LIM', outcome: 'RF1', make: function (r) { return vocabPart(r, ['When graphing, the dependent variable is plotted on the ______ axis.', 'On a graph of a relation, the output (dependent) variable goes on the ______ axis.'], 'vertical (\\(y\\))', VOC, 'Dependent variable → <b>vertical</b> (' + t('y') + ') axis.', 'vocab dependent axis'); } }] },
    { num: '2', stem: function (sh) { return 'The grid shows four points.<br>' + labelledGraph({ x: [-6, 6], y: [-6, 6], labels: 1, max: 330, aria: 'grid with points A to D' }, ['A', 'B', 'C', 'D'].map(function (L, i) { return { x: sh.p[i][0], y: sh.p[i][1], label: L }; })); },
      shared: function (r) {
        if (r.chance(0.2)) return { p: [[3, 4], [-4, 2], [-2, -5], [5, -3]] };
        var S = [[1, 1], [-1, 1], [-1, -1], [1, -1]], p = S.map(function (s) { var a = r.int(1, 5), b; do { b = r.int(1, 5); } while (b === a && r.chance(0.7)); return [s[0] * a, s[1] * b]; });
        return { p: r.shuffle(p) };
      },
      parts: [
        { id: '2', level: 'BEG', outcome: 'RF2', make: function (r, sh) {
          var fl = ['A', 'B', 'C', 'D'].map(function (L) { return { label: t(L), name: L, mode: 'math', keys: 'pairs', placeholder: '(x, y)' }; });
          var p = KP.fields('State the coordinates of points ' + t('A') + ', ' + t('B') + ', ' + t('C') + ' and ' + t('D') + '.', fl, sh.p.map(function (q) { return pairCheck(q[0], q[1]); }), sh.p.map(pt), ['A', 'B', 'C', 'D'].map(function (L, i) { return t(L + pt(sh.p[i])); }).join(', '),
            ['A', 'B', 'C', 'D'].map(function (L, i) { var q = sh.p[i]; return t(L + pt(q)) + ': ' + Math.abs(q[0]) + ' ' + (q[0] > 0 ? 'right' : 'left') + ', then ' + Math.abs(q[1]) + ' ' + (q[1] > 0 ? 'up' : 'down') + '.'; }).join('<br>'),
            ['Across first (' + t('x') + '), then up or down (' + t('y') + '). Left and down are negative.'], 'coordinates A-D');
          p.bad = [sh.p.map(function (q) { return pt([q[1], q[0]]); })]; return p;
        } }] },

    /* ===================== Part B ===================== */
    { num: '3', section: 'Part B — Patterns and Tables of Values', stem: patStem('bricks'), shared: patShared(2, 9, 2, 6, 8, 12, [5, 3, 9]), parts: [
      { id: '3a', level: 'BEG', make: patTable('bricks') },
      { id: '3b', level: 'BEG', make: function (r, sh) {
        return numPart('How many bricks are added each time you move to the next figure?', sh.d, function (v) { return v === sh.a ? { code: 'first-term', hint: 'That is Figure 1. How many <b>more</b> does each figure have than the one before?' } : null; },
          'From the table: ' + t(seqTex([1, 2, 3, 4, 5].map(sh.f))) + ' — each value is ' + t(sh.d) + ' more than the one before.', ['Subtract one value in the table from the next.'], 'bricks step');
      } },
      { id: '3c', level: 'BEG', make: figureK('bricks') }] },
    { num: '4', stem: patStem('chairs'), shared: patShared(4, 12, 3, 8, 10, 15, [8, 6, 12]), parts: [
      { id: '4a', level: 'BEG', make: patTable('chairs') },
      { id: '4b', level: 'BEG', make: function (r, sh) {
        var a = sh.a, d = sh.d;
        return KP.mc(r, 'Describe in words how the number of chairs grows from one figure to the next.', [
          { html: 'It starts at ' + a + ' chairs and increases by ' + d + ' chairs each figure.', right: true },
          { html: 'It starts at ' + d + ' chairs and increases by ' + a + ' chairs each figure.', why: 'Check Figure 1: it has ' + a + ' chairs, and each new figure adds ' + d + '.' },
          { html: 'It starts at ' + a + ' chairs and doubles each figure.', why: 'Figure 2 has ' + (a + d) + ' chairs, not ' + 2 * a + '. The same number is <b>added</b> each time.' },
          { html: 'It increases by ' + (a + d) + ' chairs each figure.', why: 'Compare Figures 1 and 2: ' + a + ' and ' + (a + d) + '. The increase is the difference.' }],
          'Figure 1 has ' + t(a) + ' chairs and each new figure adds ' + t(d) + ': it <b>starts at ' + a + ' and increases by ' + d + '</b> each figure (a constant amount).', ['What is Figure 1? How much is added each time?'], 'describe chairs');
      } },
      { id: '4c', level: 'EMG', make: figureK('chairs') }] },
    { num: '5', stem: patStem('coins'), shared: function (r) { var a = r.int(1, 6), d = r.int(2, 5); if (r.chance(0.2)) { a = 3; d = 4; } return { a: a, d: d, f: function (n) { return a + (n - 1) * d; } }; }, parts: [
      { id: '5a', level: 'BEG', make: patTable('coins') },
      { id: '5b', level: 'BEG', make: function (r, sh) {
        var tp = [1, 2, 3, 4, 5].map(function (n) { return [n, sh.f(n)]; });
        return plotPart('Represent the data from the table on the grid: plot the ordered pairs ' + t('(n,\\ T)') + '.', tp, 'n', 'T', 1, 'Plot ' + tp.map(function (p) { return t(pt(p)); }).join(', ') + ': the figure number across, the number of coins up.',
          ['Each column of the table is an ordered pair ' + t('(n,\\ T)') + ': Figure 1 is ' + t(pt(tp[0])) + '.', 'The figure number goes on the horizontal axis.'], 'plot coins');
      } },
      { id: '5c', level: 'LIM', make: function (r, sh) {
        return KP.mc(r, 'Do the plotted points appear to line up?', [
          { html: 'Yes — they lie in a straight line, because the pattern grows by the same amount (' + sh.d + ') every figure.', right: true },
          { html: 'No — the points get further apart as they go up.', why: 'Each point is 1 across and ' + sh.d + ' up from the one before — the same step every time.' },
          { html: 'Yes — but only because the first point is near the origin.', why: 'Where the first point is doesn’t decide it. Look at the step from each point to the next.' },
          { html: 'No — points on a grid never line up.', why: 'Look at your graph: each step is 1 across and ' + sh.d + ' up.' }],
          'Each step goes 1 across and ' + t(sh.d) + ' up — the same every time — so the points <b>line up</b> in a straight line. A pattern that grows by a constant amount always does.', ['Compare the step from each point to the next.'], 'coins line up', true);
      } }] },

    /* ===================== Part C ===================== */
    { num: '6', section: 'Part C — Independent and Dependent Variables', stem: 'For each situation, identify the independent variable and the dependent variable.', parts: [0, 1, 2, 3].map(function (i) {
      return { id: '6' + 'abcd'[i], level: 'BEG', outcome: 'RF1', make: function (r) {
        var pool = SIT.filter(function (s, j) { return j % 4 === i; }), s = r.chance(0.25) ? SIT[i] : r.pick(pool);
        return sitPart(r, s, 'ind/dep: ' + s[0]);
      } };
    }) },
    { num: '7', stem: function (sh) { return 'The table relates the number of hours worked, ' + t('h') + ', to the total pay, ' + t('P') + ' dollars, for a part-time job.' + htable('Hours worked, \\(h\\)', 'Pay ($), \\(P\\)', [1, 2, 3, 4, 5], [1, 2, 3, 4, 5].map(function (h) { return sh.w * h; })); },
      shared: function (r) { return { w: r.chance(0.2) ? 12 : r.int(6, 25) }; },
      parts: [
        { id: '7a', level: 'BEG', outcome: 'RF1', make: function (r, sh) {
          return sitPart(r, ['the total pay, \\(P\\)', 'the number of hours worked, \\(h\\)', 'c', 'The pay is calculated from the hours worked — the hours don’t depend on the pay.'], 'ind/dep pay', 'Identify the independent variable and the dependent variable.');
        } },
        { id: '7b', level: 'BEG', make: function (r, sh) {
          var tp = [1, 2, 3, 4, 5].map(function (h) { return [h, sh.w * h]; });
          return plotPart('Represent the data from the table on the grid.', tp, 'h', 'P', sh.w, 'Plot ' + tp.map(function (p) { return t(pt(p)); }).join(', ') + ': hours (independent) across, pay (dependent) up. The grid lines go up by ' + sh.w + '.',
            ['Each column of the table is one point ' + t('(h,\\ P)') + '.', 'The vertical grid lines go up by ' + sh.w + '.'], 'plot pay', { xTitle: 'Hours worked', yTitle: 'Pay ($)' });
        } },
        { id: '7c', level: 'BEG', make: function (r, sh) {
          var hq = r.chance(0.6) ? 6 : r.int(6, 8);
          var p = numPart('Continue the pattern in the table to find the pay for ' + t(hq) + ' hours of work.', sh.w * hq, function (v) { return v === sh.w * 5 + 1 || v === sh.w * (hq - 1) ? { code: 'off-by-one', hint: 'That is ' + (hq - 1) + ' hours. Add one more ' + t('\\$' + sh.w) + '.' } : null; },
            'The pay goes up ' + t('\\$' + sh.w) + ' for every hour: ' + t(hq + '\\times ' + sh.w + '=' + sh.w * hq) + '. Pay: ' + t('\\$' + sh.w * hq) + '.', ['How much does the pay go up for each extra hour?'], 'pay for ' + hq + ' h', { before: '$' });
          var c0 = p.check; p.check = function (resp) { return c0(String(resp == null ? '' : resp).replace(/\\?\$/g, '').trim()); }; p.answer = t('\\$' + sh.w * hq); return p;
        } }] },

    /* ===================== Part D ===================== */
    { num: '8', section: 'Part D — Short Answer', stem: '', parts: [
      { id: '8a', level: 'EMG', outcome: 'RF1', make: function (r) {
        return KP.mc(r, 'Which statement explains the difference between an independent variable and a dependent variable?', [
          { html: 'The independent variable is the one you choose or control (the input); the dependent variable results from it (the output).', right: true },
          { html: 'The dependent variable is the one you choose; the independent variable results from it.', why: 'That is backwards. “Dependent” means it depends on — results from — the other one.' },
          { html: 'The independent variable is always the larger number.', why: 'Size has nothing to do with it. Ask which quantity is decided by the other.' },
          { html: 'The independent variable is always time.', why: 'Time is often independent, but not always — e.g. the number of tickets bought decides the total cost.' }],
          'The <b>independent</b> variable is chosen or controlled (the input, on the horizontal axis); the <b>dependent</b> variable results from it (the output, on the vertical axis).', ['Which one depends on the other?'], 'ind vs dep');
      } },
      { id: '8b', level: 'EMG', outcome: 'RF1', make: function (r) {
        var four = r.sample(SIT, 4), right = four[0];
        var opts = [{ html: 'Independent: ' + right[1] + '; dependent: ' + right[0] + '.', right: true }].concat(four.slice(1).map(function (s) { return { html: 'Independent: ' + s[0] + '; dependent: ' + s[1] + '.', why: 'Swapped: ' + s[3] }; }));
        return KP.mc(r, 'Which example of a pair of variables is labelled correctly?', opts, right[3] + ' So this pair is right: independent <b>' + right[1] + '</b>, dependent <b>' + right[0] + '</b>. In the other choices the two labels are swapped.', ['For each choice, ask: does the dependent one really result from the independent one?'], 'pick a correct example');
      } }] },
    { num: '9', stem: function (sh) { return 'A pattern has this table of values.' + htable('\\(n\\)', '\\(T\\)', [1, 2, 3, 4, 5], sh.ys); },
      shared: function (r) { var a = r.int(2, 9), d = r.int(2, 6), cst = r.chance(0.6), ys = [1, 2, 3, 4, 5].map(function (n) { return cst ? a + (n - 1) * d : a + (n - 1) * d + (n > 2 ? (n - 2) * r.pick([1, 2]) : 0); }); return { ys: ys, cst: ys.slice(1).every(function (y, i) { return y - ys[i] === ys[1] - ys[0]; }) }; },
      parts: [
        { id: '9', level: 'EMG', make: function (r, sh) {
          var ds = sh.ys.slice(1).map(function (y, i) { return y - sh.ys[i]; });
          return KP.mc(r, 'How can you use the table to check whether this pattern grows by a constant amount — and does it?', [
            { html: 'Subtract each value from the next one. If every difference is the same, it grows by a constant amount. Here the differences are ' + t(seqTex(ds)) + ', so ' + (sh.cst ? 'it <b>does</b>.' : 'it does <b>not</b>.'), right: true },
            { html: 'Subtract each value from the next one. Here the differences are ' + t(seqTex(ds)) + ', so ' + (sh.cst ? 'it does <b>not</b>.' : 'it <b>does</b>.'), why: sh.cst ? 'All the differences are equal — that is exactly what “constant” means.' : 'The differences are not all equal, so the growth is not constant.' },
            { html: 'Check that the last value is bigger than the first. Here it is, so it grows by a constant amount.', why: 'Every growing pattern ends bigger — that doesn’t show the steps are equal.' },
            { html: 'Check that every value is a whole number.', why: 'Whole numbers can grow by uneven steps. Compare the differences.' }],
            'Find the differences (next − previous): ' + t(seqTex(ds)) + '. ' + (sh.cst ? 'They are all equal, so the pattern grows by a <b>constant amount</b> (' + ds[0] + ' each figure).' : 'They are not all equal, so the growth is <b>not</b> constant.'), ['Subtract each value from the next one.'], 'constant growth check');
        } }] },

    /* ===================== Part E ===================== */
    { num: '10', section: 'Part E — Multiple Choice and Numerical Response', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '10', level: 'BEG', outcome: 'RF1', make: function (r) {
        var POOL = [['The total cost of filling a car with gas depends on the number of litres of gas pumped.', 'the total cost', 'the number of litres pumped', ['the type of car', 'the price per litre']],
          ['The total cost of a group’s movie tickets depends on the number of tickets bought.', 'the total cost', 'the number of tickets bought', ['the day of the week', 'the length of the movie']],
          ['A worker’s total pay depends on the number of hours worked.', 'the total pay', 'the number of hours worked', ['the name of the company', 'the colour of the uniform']],
          ['The battery percentage of a phone depends on the number of minutes it has been charging.', 'the battery percentage', 'the number of minutes charging', ['the brand of the phone', 'the colour of the charger']],
          ['The height of a sunflower depends on the number of days since it was planted.', 'the height of the sunflower', 'the number of days since planting', ['the colour of the pot', 'the name of the gardener']],
          ['The fare for a taxi ride depends on the number of kilometres driven.', 'the fare', 'the number of kilometres driven', ['the colour of the taxi', 'the number of doors']]];
        var c = r.chance(0.3) ? POOL[0] : r.pick(POOL), askInd = r.chance(0.75);
        return KP.mc(r, c[0] + ' Which variable is the <b>' + (askInd ? 'independent' : 'dependent') + '</b> variable?', [
          { html: askInd ? c[2] : c[1], right: true },
          { html: askInd ? c[1] : c[2], why: askInd ? cap(c[1]) + ' is what results — it is the dependent variable.' : cap(c[2]) + ' is what causes the change — it is the independent variable.' },
          { html: c[3][0], why: 'That isn’t one of the two quantities in the relation.' }, { html: c[3][1], why: 'That isn’t one of the two quantities that change together here.' }],
          '“' + cap(c[1]) + ' depends on ' + c[2] + '”: ' + c[2] + ' is <b>independent</b>; ' + c[1] + ' is <b>dependent</b>.', ['The quantity after “depends on” is the independent one.'], 'MC ' + (askInd ? 'independent' : 'dependent'));
      } }] },
    { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '11', level: 'BEG', make: function (r) {
        var a = r.int(2, 8), d = r.int(3, 7), k = r.int(5, 8); if (r.chance(0.2)) { a = 4; d = 5; k = 6; }
        var v = a + (k - 1) * d, cands = [a + k * d, a + (k - 2) * d, d * k, a * k + d, v + 1].filter(function (x, i, s) { return x !== v && s.indexOf(x) === i; });
        var opts = [v].concat(r.sample(cands, 3)).sort(function (x, y) { return x - y; });
        var why = function (x) { if (x === a + k * d) return 'That adds ' + d + ' one time too many: from Figure 1 to Figure ' + k + ' there are ' + (k - 1) + ' steps.'; if (x === a + (k - 2) * d) return 'That is Figure ' + (k - 1) + '. One more step.'; if (x === d * k) return 'That leaves out the starting value ' + a + '.'; return 'List the values: ' + range(1, k).map(function (n) { return a + (n - 1) * d; }).join(', ') + '.'; };
        return KP.mc(r, 'A pattern begins at ' + t(a) + ' and grows by ' + t(d) + ' each figure. What is the value at Figure ' + t(k) + '?', opts.map(function (x) { return { html: t(x), right: x === v, why: x === v ? null : why(x) }; }),
          'Figures 1 to ' + k + ': ' + t(seqTex(range(1, k).map(function (n) { return a + (n - 1) * d; }))) + '. Figure ' + k + ' is ' + t(v) + '.', ['List the values figure by figure.'], 'MC figure ' + k, true);
      } }] },
    { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '12', level: 'LIM', outcome: 'RF1', make: function (r) {
        var dep = r.chance(0.75);
        return KP.mc(r, 'When a table of values is graphed on the Cartesian plane, the ' + (dep ? 'dependent' : 'independent') + ' variable is always plotted on which axis?', [
          { html: 'the ' + t('x') + '-axis', right: !dep, why: dep ? 'The ' + t('x') + '-axis (horizontal) is for the independent variable.' : null }, { html: 'the ' + t('y') + '-axis', right: dep, why: !dep ? 'The ' + t('y') + '-axis (vertical) is for the dependent variable.' : null },
          { html: 'either axis', why: 'The convention is fixed: independent across, dependent up.' }, { html: 'neither axis', why: 'Every point is plotted using both axes; each variable has its own.' }],
          'Independent → horizontal (' + t('x') + ') axis; dependent → vertical (' + t('y') + ') axis. So the answer is the <b>' + t(dep ? 'y' : 'x') + '-axis</b>.', ['Independent across, dependent up.'], 'MC axis', true);
      } }] },
    { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
      { id: '13', level: 'BEG', make: function (r) {
        var a, d, k, v; do { a = r.int(3, 9); d = r.int(2, 6); k = r.int(6, 9); if (r.chance(0.2)) { a = 6; d = 4; k = 7; } v = a + (k - 1) * d; } while (v > 99);
        return KP.nr('A pattern of tile figures starts at ' + t(a) + ' tiles in Figure ' + t('1') + ' and grows by ' + t(d) + ' tiles each figure. The number of tiles in Figure ' + t(k) + ' is ________.', v, function (x) {
          if (x === a + k * d) return { code: 'off-by-one', hint: 'From Figure 1 to Figure ' + k + ' there are ' + (k - 1) + ' steps of ' + d + ', not ' + k + '.' };
          if (x === d * k) return { code: 'u5l2-mult-k', hint: 'Start from the ' + a + ' tiles in Figure 1.' };
          return null;
        }, t(seqTex(range(1, k).map(function (n) { return a + (n - 1) * d; })))+ '. Figure ' + k + ' has ' + t(v) + ' tiles.', ['Write out the values figure by figure.'], 'NR figure ' + k);
      } }] }
  ];

  /* ======================================================================= Extra practice ======================= */
  var X = [];
  function ruleShared(lo, hi, blo, bhi, book) {
    return function (r) {
      var m, b; do { m = r.int(lo, hi); b = r.int(blo, bhi); } while (b === 0 || m + b < 1);
      if (r.chance(0.2)) { m = book[0]; b = book[1]; }
      return { m: m, b: b, f: function (n) { return m * n + b; } };
    };
  }
  /* ----- EP 1 ----- */
  X.push({ num: '1', section: 'Extra practice A — Finding the Rule t = mn + b', stem: function (sh) { return 'A pattern that grows by a constant amount can be written as a rule ' + t('t=mn+b') + ': ' + t('m') + ' is the amount added each time and ' + t('b') + ' is the value at “Figure 0”. A tile pattern gives this table.' + htable('Figure number, \\(n\\)', 'Number of tiles, \\(t\\)', [1, 2, 3, 4, 5], [1, 2, 3, 4, 5].map(sh.f)); },
    shared: function (r) { var o = ruleShared(2, 7, 1, 6, [4, 3])(r); o.N = r.int(40, 60); if (o.m === 4 && o.b === 3 && r.chance(0.5)) o.N = 50; o.Nv = r.int(20, 45); return o; },
    parts: [
      { id: 'e1a', level: 'BEG', make: function (r, sh) { return numPart('Find ' + t('m') + ', the constant amount added each time.', sh.m, function (v) { return v === sh.f(1) ? { code: 'first-term', hint: 'That is Figure 1. How much is added from one figure to the next?' } : null; }, t(sh.f(2) + '-' + sh.f(1) + '=' + sh.m) + ' (and the same for every step), so ' + t('m=' + sh.m) + '.', ['Subtract one value from the next.'], 'EP1 m'); } },
      { id: 'e1b', level: 'EMG', make: function (r, sh) { return numPart('Work backwards one step from Figure ' + t('1') + ' to find the value at Figure ' + t('0') + '. This is ' + t('b') + '.', sh.b, function (v) { return v === sh.f(1) ? { code: 'first-term', hint: 'That is Figure 1. Go back one step: subtract ' + sh.m + '.' } : v === sh.f(1) + sh.m ? { code: 'add-not-sub', hint: 'Going back a figure means <b>subtracting</b> ' + sh.m + '.' } : null; }, 'Figure 1 has ' + t(sh.f(1)) + '; one step back: ' + t(sh.f(1) + '-' + sh.m + '=' + sh.b) + '. So ' + t('b=' + sh.b) + '.', ['Each step forward adds ' + sh.m + '. What do you do to go one step back?'], 'EP1 b'); } },
      { id: 'e1c', level: 'EMG', make: function (r, sh) {
        return eqPart('Write the rule in the form ' + t('t=mn+b') + '.', 't', linP(sh.m, sh.b, 'n'), lin(sh.m, sh.b, 'n'), ruleWrongs(sh.m, sh.b, sh.f(1)), t('m=' + sh.m) + ', ' + t('b=' + sh.b) + ': ' + t('t=' + lin(sh.m, sh.b, 'n')) + '.<br>Test Figure 3: ' + t(sh.m + '(3)+' + sh.b + '=' + sh.f(3)) + ' ✓ (matches the table).',
          ['Put ' + t('m') + ' in front of ' + t('n') + ' and add ' + t('b') + '.', 'Test your rule on Figure 3.'], 'EP1 rule', { good: [sh.b + '+' + sh.m + 'n'] });
      } },
      { id: 'e1d', level: 'BEG', make: function (r, sh) { var N = sh.N; return numPart('Use your rule ' + t('t=' + lin(sh.m, sh.b, 'n')) + ' to find the number of tiles in Figure ' + t(N) + '.', sh.f(N), function (v) { return v === sh.m * N ? { code: 'no-constant', hint: 'You found ' + t(sh.m + '(' + N + ')') + '. Now add ' + sh.b + '.' } : null; }, t('t=' + sh.m + '(' + N + ')+' + sh.b + '=' + sh.f(N)) + ' tiles.', ['Substitute ' + t('n=' + N) + '.'], 'EP1 figure ' + N); } },
      { id: 'e1e', level: 'PRG', make: function (r, sh) { var N = sh.Nv, V = sh.f(N); return numPart('<b>Work backwards.</b> Which figure has ' + t(V) + ' tiles?', N, solveDiag(sh.m, sh.b, V), solveSol(sh.m, sh.b, V, N), ['Set the rule equal to ' + t(V) + ' and solve for ' + t('n') + '.', 'Undo the adding first, then the multiplying.'], 'EP1 which figure', { before: 'Figure' }); } },
      { id: 'e1f', level: 'EMG', make: function (r, sh) {
        var N = sh.N;
        return KP.mc(r, 'Why would counting up one figure at a time be a poor way to find Figure ' + t(N) + '?', [
          { html: 'It would take ' + (N - 1) + ' separate additions, with a chance of a mistake at every step; the rule gets there in one calculation.', right: true },
          { html: 'Counting up gives a different answer from the rule.', why: 'Done carefully, both give the same answer. The problem is how long it takes.' },
          { html: 'You can’t count past Figure 10.', why: 'You can — it just takes a very long time.' },
          { html: 'The pattern changes after Figure 5.', why: 'The pattern grows by ' + sh.m + ' every time, forever.' }],
          'Counting up means ' + (N - 1) + ' additions of ' + sh.m + ' — slow, and one slip spoils everything after it. ' + t('t=' + lin(sh.m, sh.b, 'n')) + ' gives Figure ' + N + ' in one step.', ['How many steps is it from Figure 1 to Figure ' + N + '?'], 'EP1 why rule');
      } }] });
  /* ----- EP 2 ----- */
  X.push({ num: '2', stem: function (sh) { return 'A second pattern gives this table.' + htable('Figure number, \\(n\\)', 'Number of tiles, \\(t\\)', [1, 2, 3, 4, 5], [1, 2, 3, 4, 5].map(sh.f)); },
    shared: function (r) {
      var o = ruleShared(3, 7, -4, -1, [5, -3])(r); o.N = r.int(15, 25); o.Nv = r.int(10, 20); var yes = r.chance(0.3), W;
      if (o.m === 5 && o.b === -3 && r.chance(0.5)) { o.N = 20; o.Nv = 13; }
      do { W = r.int(16, 30) * 5 + (r.chance(0.5) ? 0 : r.int(1, 4)); } while (((W - o.b) % o.m === 0) !== yes);
      o.W = W; o.yes = yes; return o;
    },
    parts: [
      { id: 'e2a', level: 'EMG', make: function (r, sh) { var F1 = sh.f(1); return eqPart('Write the rule ' + t('t=mn+b') + '.', 't', linP(sh.m, sh.b, 'n'), lin(sh.m, sh.b, 'n'), ruleWrongs(sh.m, sh.b, F1).concat([{ is: linP(sh.m, -sh.b, 'n'), code: 'add-not-sub', hint: 'Figure 0 is one step <b>back</b> from Figure 1: ' + t(F1 + '-' + sh.m + '=' + sh.b) + '.' }]), t('m=' + sh.m) + ' (the step). Figure 0: ' + t(F1 + '-' + sh.m + '=' + sh.b) + ', so ' + t('b=' + sh.b) + '. Rule: ' + t('t=' + lin(sh.m, sh.b, 'n')) + '. Check Figure 2: ' + t(sh.m + '(2)' + (sh.b < 0 ? '' : '+') + sh.b + '=' + sh.f(2)) + ' ✓', ['Find the step ' + t('m') + ', then go back one step from Figure 1 to find ' + t('b') + ' — it can be negative.'], 'EP2 rule'); } },
      { id: 'e2b', level: 'BEG', make: function (r, sh) { var N = sh.N; return numPart('How many tiles are in Figure ' + t(N) + '?', sh.f(N), function (v) { return v === sh.m * N ? { code: 'no-constant', hint: 'Don’t forget the ' + t(sh.b) + '.' } : v === sh.m * N - sh.b ? { code: 'add-not-sub', hint: 'The rule ' + (sh.b < 0 ? 'subtracts' : 'adds') + ' ' + Math.abs(sh.b) + '.' } : null; }, t('t=' + sh.m + '(' + N + ')' + (sh.b < 0 ? '-' : '+') + Math.abs(sh.b) + '=' + sh.f(N)) + ' tiles.', ['Substitute ' + t('n=' + N) + ' into ' + t('t=' + lin(sh.m, sh.b, 'n')) + '.'], 'EP2 figure ' + N); } },
      { id: 'e2c', level: 'PRG', make: function (r, sh) { var N = sh.Nv, V = sh.f(N); return numPart('Which figure has ' + t(V) + ' tiles?', N, solveDiag(sh.m, sh.b, V), solveSol(sh.m, sh.b, V, N), ['Set ' + t(lin(sh.m, sh.b, 'n') + '=' + V) + ' and solve.'], 'EP2 which figure', { before: 'Figure' }); } },
      { id: 'e2d', level: 'PRG', make: function (r, sh) {
        var W = sh.W, n = (W - sh.b) / sh.m, nr = Math.round(n * 100) / 100;
        return KP.mc(r, 'Is ' + t(W) + ' ever a value in this pattern? Show how you know.', [
          { html: 'Yes: ' + t(lin(sh.m, sh.b, 'n') + '=' + W) + ' gives ' + t('n=' + num(nr)) + (sh.yes ? ', so Figure ' + n + ' has ' + W + ' tiles.' : '.'), right: sh.yes, why: sh.yes ? null : t('n=' + num(nr)) + ' is not a whole number — there is no Figure ' + num(nr) + '.' },
          { html: 'No: ' + t(lin(sh.m, sh.b, 'n') + '=' + W) + ' gives ' + t('n=' + num(nr)) + (sh.yes ? '.' : ', which is not a whole figure number.'), right: !sh.yes, why: !sh.yes ? null : t('n=' + n) + ' is a whole number, so Figure ' + n + ' does have ' + W + ' tiles.' },
          { html: 'No: ' + t(W) + ' is too big for this pattern.', why: 'The pattern keeps growing forever. Solve the equation instead.' },
          { html: 'Yes: every number appears in a growing pattern eventually.', why: 'The pattern goes up by ' + sh.m + ' at a time, so it skips most numbers.' }],
          t(lin(sh.m, sh.b, 'n') + '=' + W) + ', ' + t(sh.m + 'n=' + (W - sh.b)) + ', ' + t('n=' + num(nr)) + '. ' + (sh.yes ? 'A whole number: <b>yes</b>, Figure ' + n + ' has ' + W + ' tiles.' : 'Not a whole number, so <b>no</b> figure has exactly ' + W + ' tiles.'), ['Solve ' + t(lin(sh.m, sh.b, 'n') + '=' + W) + '. Is ' + t('n') + ' a whole number?'], 'EP2 is W a value');
      } }] });
  /* ----- EP 3 ----- */
  X.push({ num: '3', stem: function (sh) {
      return 'The tile pattern below is made of ' + ['', 'one full row', 'two full rows', 'three full rows', 'four full rows', 'five full rows'][sh.rows] + ' plus ' + (sh.k === 1 ? 'one extra tile' : sh.k + ' extra tiles') + ' on top of the left-hand column.' +
        figRow([1, 2, 3].map(function (n) { return rowsFig(n, sh.rows, sh.k); }), ['Figure 1', 'Figure 2', 'Figure 3'], { label: 'tile pattern' });
    },
    shared: function (r) {
      var rows = r.pick([2, 3, 3, 4, 5]), k = r.pick([1, 1, 2, 3]); if (r.chance(0.2)) { rows = 3; k = 1; }
      var f = function (n) { return rows * n + k; }, N50 = r.chance(0.4) ? 50 : r.int(30, 60);
      var nd, ne; do { nd = r.int(20, 40); ne = r.int(15, 35); } while (nd === ne);
      if (rows === 3 && k === 1 && r.chance(0.5)) { nd = 33; ne = 25; }
      return { rows: rows, k: k, f: f, N50: N50, nd: nd, ne: ne };
    },
    parts: [
      { id: 'e3a', level: 'BEG', make: function (r, sh) {
        return tablePart('Count the tiles in Figures 1, 2 and 3, then predict Figures 4 and 5 without drawing them.', 'n', [1, 2, 3, 4, 5], sh.f, function (n, v) {
          if (v === sh.rows * n) return { code: 'no-constant', hint: 'Figure ' + n + ': don’t forget the extra tile' + (sh.k > 1 ? 's' : '') + ' on top.' };
          if (v === (sh.rows + sh.k) * n) return { code: 'u5l2-row-tile', hint: 'The extra tile' + (sh.k > 1 ? 's are' : ' is') + ' only on the left column — ' + (sh.k > 1 ? 'they are' : 'it is') + ' not added with every new column.' };
          return null;
        }, 'Each figure adds one column of ' + t(sh.rows) + ' tiles: ' + t(seqTex([1, 2, 3, 4, 5].map(sh.f))) + '.', ['Each new figure adds one full column.'], 'EP3 table', 't');
      } },
      { id: 'e3b', level: 'EMG', make: function (r, sh) { var m = sh.rows, b = sh.k; return eqPart('Write the rule ' + t('t=mn+b') + ' for this pattern.', 't', linP(m, b, 'n'), lin(m, b, 'n'), ruleWrongs(m, b, sh.f(1)).concat([{ is: linP(m + b, 0, 'n'), code: 'u5l2-row-tile', hint: 'The extra tile' + (b > 1 ? 's' : '') + ' on top ' + (b > 1 ? 'are' : 'is') + ' in every figure, but ' + (b > 1 ? 'they are' : 'it is') + ' not added again with each column.' }]), 'Figure ' + t('n') + ' has ' + t(m) + ' rows of ' + t('n') + ' tiles plus ' + t(b) + ' on top: ' + t('t=' + lin(m, b, 'n')) + '.', ['How many tiles does each new column add? How many tiles never change?'], 'EP3 rule'); } },
      { id: 'e3b2', sub: 'b (why)', level: 'EMG', make: function (r, sh) {
        var m = sh.rows, b = sh.k;
        return KP.mc(r, 'In ' + t('t=' + lin(m, b, 'n')) + ', where do the ' + t(m) + ' and the ' + t(b) + ' come from in the picture?', [
          { html: 'The ' + m + ' is the full column of ' + m + ' tiles added with each new figure; the ' + b + ' is the extra tile' + (b > 1 ? 's' : '') + ' on top, which ' + (b > 1 ? 'are' : 'is') + ' in every figure.', right: true },
          { html: 'The ' + m + ' is the number of figures shown; the ' + b + ' is the first figure.', why: 'Look at what changes from one figure to the next: one column of ' + m + ' tiles.' },
          { html: 'The ' + m + ' is the extra tile' + (b > 1 ? 's' : '') + ' on top; the ' + b + ' is the number of rows.', why: 'Swapped: the number of rows is ' + m + ', and that is what is added per column.' },
          { html: 'The ' + m + ' is the tiles in Figure 1; the ' + b + ' is the step.', why: 'Figure 1 has ' + sh.f(1) + ' tiles, not ' + m + '.' }],
          'Each new figure adds one column of ' + t(m) + ' tiles — that is ' + t('m=' + m) + '. The ' + t(b) + ' extra tile' + (b > 1 ? 's' : '') + ' on top never change' + (b > 1 ? '' : 's') + ' — that is ' + t('b=' + b) + '.', ['What is added each figure? What stays the same?'], 'EP3 meaning');
      } },
      { id: 'e3c', level: 'BEG', make: function (r, sh) { var N = sh.N50; return numPart('How many tiles are in Figure ' + t(N) + '?', sh.f(N), function (v) { return v === sh.rows * N ? { code: 'no-constant', hint: 'Add the ' + sh.k + ' extra.' } : v === (sh.rows + sh.k) * N ? { code: 'u5l2-row-tile', hint: 'The extra tiles are added only once.' } : null; }, t('t=' + sh.rows + '(' + N + ')+' + sh.k + '=' + sh.f(N)) + ' tiles.', ['Substitute into your rule.'], 'EP3 figure ' + N); } },
      { id: 'e3d', level: 'PRG', make: function (r, sh) { var N = sh.nd, V = sh.f(N); return numPart('<b>Work backwards:</b> which figure has ' + t(V) + ' tiles?', N, solveDiag(sh.rows, sh.k, V), solveSol(sh.rows, sh.k, V, N), ['Set your rule equal to ' + t(V) + ' and solve.'], 'EP3 which figure', { before: 'Figure' }); } },
      { id: 'e3e', level: 'PRG', make: function (r, sh) { var N = sh.ne, V = sh.f(N); return numPart('Which figure has ' + t(V) + ' tiles?', N, solveDiag(sh.rows, sh.k, V), solveSol(sh.rows, sh.k, V, N), ['Set your rule equal to ' + t(V) + ' and solve.'], 'EP3 which figure 2', { before: 'Figure' }); } },
      { id: 'e3f', level: 'EMG', make: function (r, sh) {
        return KP.mc(r, 'Why does the extra tile' + (sh.k > 1 ? 's' : '') + ' on top not change the constant difference ' + t('m') + '?', [
          { html: (sh.k > 1 ? 'They are' : 'It is') + ' there once in every figure and never added again, so ' + (sh.k > 1 ? 'they shift' : 'it shifts') + ' every value up by ' + sh.k + ' but the difference between figures stays ' + sh.rows + '.', right: true },
          { html: 'Because ' + t(sh.k) + ' is smaller than ' + t(sh.rows) + '.', why: 'Size isn’t the reason. Ask: is the extra tile added again with each figure?' },
          { html: 'It does change it: ' + t('m') + ' is ' + (sh.rows + sh.k) + '.', why: 'Check the table: the values go up by ' + sh.rows + ' each time.' },
          { html: 'Because the extra tile is a different colour.', why: 'Colour doesn’t matter. What matters is whether it is added with each new figure.' }],
          'The difference between figures counts what is <b>added</b>: one column of ' + sh.rows + '. The extra tile' + (sh.k > 1 ? 's are' : ' is') + ' in every figure, so ' + (sh.k > 1 ? 'they cancel' : 'it cancels') + ' out when you subtract one figure from the next.', ['Compare two figures: is the extra tile part of what was added?'], 'EP3 why m same');
      } }] });
  /* ----- EP 4 ----- */
  X.push({ num: '4', stem: function (sh) { return 'The table below follows the rule ' + t('t=' + lin(sh.m, sh.b, 'n')) + ', but three entries have been erased.' + htable('Figure number, \\(n\\)', 'Number of tiles, \\(t\\)', [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6].map(function (n) { return n % 2 ? sh.f(n) : '\\(\\square\\)'; })); },
    shared: function (r) { var o = ruleShared(3, 8, 1, 6, [6, 3])(r); o.err = r.pick([1, -1]); return o; },
    parts: [
      { id: 'e4a', level: 'BEG', make: function (r, sh) {
        var fl = [2, 4, 6].map(function (n) { return { label: t('n=' + n), name: t('n=' + n), mode: 'number', before: t('t=') }; });
        return KP.fields('Fill in the three missing values.', fl, [2, 4, 6].map(function (n) { return K.number(sh.f(n), function (v) { return v === sh.f(n - 1) + 1 ? { code: 'step-wrong', hint: 'Each figure adds ' + sh.m + ', not 1.' } : v === sh.m * n ? { code: 'no-constant', hint: 'Use the whole rule: ' + t(sh.m + '(' + n + ')+' + sh.b) + '.' } : null; }); }), [2, 4, 6].map(function (n) { return String(sh.f(n)); }),
          [2, 4, 6].map(function (n) { return t('n=' + n) + ': ' + t(sh.f(n)); }).join(', '), [2, 4, 6].map(function (n) { return t(sh.m + '(' + n + ')+' + sh.b + '=' + sh.f(n)) + ' (or ' + t(sh.f(n - 1) + '+' + sh.m) + ')'; }).join('<br>'), ['Substitute into the rule, or add ' + sh.m + ' to the entry before.'], 'EP4 fill table');
      } },
      { id: 'e4a2', sub: 'a (two ways)', level: 'EMG', make: function (r, sh) {
        var m = sh.m, b = sh.b;
        return KP.mc(r, 'Which describes two different ways to find the entry at ' + t('n=2') + '?', [
          { html: 'Use the rule: ' + t(m + '(2)+' + b + '=' + sh.f(2)) + '. Or use the constant difference: add ' + t(m) + ' to the ' + t('n=1') + ' entry, ' + t(sh.f(1) + '+' + m + '=' + sh.f(2)) + '.', right: true },
          { html: 'Use the rule: ' + t(m + '(2)=' + 2 * m) + '. Or double the ' + t('n=1') + ' entry: ' + t(2 * sh.f(1)) + '.', why: 'Both of those give the wrong value: the rule has ' + t('+' + b) + ', and doubling isn’t how the pattern grows.' },
          { html: 'Average the entries at ' + t('n=1') + ' and ' + t('n=3') + ', or guess and check.', why: 'Averaging happens to work here, but it isn’t the rule or the constant difference.' },
          { html: 'Add ' + t(b) + ' to the ' + t('n=1') + ' entry, or multiply ' + t('2\\times ' + b) + '.', why: 'The amount added each figure is ' + t('m=' + m) + ', not ' + t('b') + '.' }],
          'Rule: substitute ' + t('n=2') + ': ' + t(m + '(2)+' + b + '=' + sh.f(2)) + '. Constant difference: the pattern grows by ' + t(m) + ', so ' + t(sh.f(1) + '+' + m + '=' + sh.f(2)) + '.', ['One way uses the rule; the other uses the amount added each figure.'], 'EP4 two ways');
      } },
      { id: 'e4b', level: 'EMG', make: function (r, sh) {
        var w = sh.f(4) + sh.err, d1 = w - sh.f(3), d2 = sh.f(5) - w;
        return KP.mc(r, 'A student filled in ' + t('n=4') + ' as ' + t(w) + '. Which check catches this error fastest, and how?', [
          { html: 'The constant difference: ' + t(sh.f(3) + '+' + sh.m + '=' + sh.f(4)) + ', not ' + w + ' — one addition exposes it (the differences ' + d1 + ' and ' + d2 + ' are visibly unequal).', right: true },
          { html: 'Graphing all six points and looking for a curve.', why: 'That would work eventually, but it is much slower than one addition.' },
          { html: 'Checking that ' + t(w) + ' is bigger than ' + t(sh.f(3)) + '.', why: t(w) + ' is bigger than ' + sh.f(3) + ', so that check would miss the error.' },
          { html: 'Checking that ' + t(w) + ' is a whole number.', why: 'It is a whole number — that check would miss the error.' }],
          'The pattern grows by ' + t(sh.m) + ': ' + t(sh.f(3) + '+' + sh.m + '=' + sh.f(4)) + '. One addition shows ' + w + ' is wrong (the differences ' + t(d1) + ' and ' + t(d2) + ' should both be ' + sh.m + ').', ['What should every difference in the table be?'], 'EP4 catch error');
      } }] });
  /* ----- EP 5 ----- */
  X.push({ num: '5', stem: function (sh) { return 'Reasoning about the two numbers in a rule ' + t('t=mn+b') + ', for example ' + t('t=' + lin(sh.m, sh.b, 'n')) + '.'; }, shared: ruleShared(2, 7, 1, 6, [4, 3]), parts: [
    { id: 'e5a', level: 'EMG', make: function (r, sh) {
      return KP.mc(r, 'In a tile pattern, what does ' + t('m') + ' (here ' + t(sh.m) + ') tell you about the picture?', [
        { html: 'The number of tiles added to move from one figure to the next — the size of the repeating “chunk”.', right: true },
        { html: 'The number of tiles in Figure 1.', why: 'Figure 1 has ' + t('m+b=' + (sh.m + sh.b)) + ' tiles.' },
        { html: 'The number of figures in the pattern.', why: t('m') + ' doesn’t count figures. It is what each figure adds.' },
        { html: 'The part of every figure that never changes.', why: 'That is ' + t('b') + '. ' + t('m') + ' is what is added each time.' }],
        t('m=' + sh.m) + ' is the amount added each time: each figure has ' + sh.m + ' more tiles than the one before.', ['Compare two figures in a row.'], 'EP5 m meaning');
    } },
    { id: 'e5b', level: 'EMG', make: function (r, sh) {
      return KP.mc(r, 'What does ' + t('b') + ' (here ' + t(sh.b) + ') tell you, and why is it usually <b>not</b> the number of tiles in Figure 1?', [
        { html: 'It is the fixed part of every figure (the value at “Figure 0”). Figure 1 already has one copy of the growing chunk, so Figure 1 has ' + t('m+b=' + (sh.m + sh.b)) + '.', right: true },
        { html: 'It is the number of tiles in Figure 1.', why: 'Test it: ' + t(sh.m + '(1)+' + sh.b + '=' + (sh.m + sh.b)) + ', not ' + sh.b + '.' },
        { html: 'It is the number of tiles added each figure.', why: 'That is ' + t('m') + '.' },
        { html: 'It is the last figure of the pattern.', why: 'Patterns like this go on forever. ' + t('b') + ' is the part that never grows.' }],
        t('b=' + sh.b) + ' is the value at Figure 0 — the part that never grows. Figure 1 = ' + t('m+b=' + sh.m + '+' + sh.b + '=' + (sh.m + sh.b)) + ', because it already contains one chunk of ' + sh.m + '.', ['Substitute ' + t('n=0') + ' and ' + t('n=1') + ' into the rule.'], 'EP5 b meaning');
    } },
    { id: 'e5c', level: 'EMG', make: function (r, sh) {
      return KP.mc(r, 'A pattern has ' + t('m=0') + ' (for example ' + t('t=' + sh.b + '') + '). What do its figures look like? Is it still a growing pattern?', [
        { html: 'Every figure is identical — ' + sh.b + ' tiles, nothing added — so it is a constant pattern, not a growing one.', right: true },
        { html: 'It grows by ' + sh.b + ' each figure.', why: 'With ' + t('m=0') + ', the rule is ' + t('t=' + sh.b) + ' for every ' + t('n') + ': nothing is added.' },
        { html: 'It has no tiles at all.', why: 'Substitute ' + t('n=3') + ': ' + t('t=0(3)+' + sh.b + '=' + sh.b) + '.' },
        { html: 'It shrinks by one tile each figure.', why: 'A shrinking pattern has a negative ' + t('m') + '. Here ' + t('m=0') + '.' }],
        'With ' + t('m=0') + ', ' + t('t=0n+' + sh.b + '=' + sh.b) + ' for every figure: all the figures are the same. That is a <b>constant</b> pattern, not a growing one.', ['Substitute a few figure numbers.'], 'EP5 m=0');
    } }] });

  /* ----- EP 6–8: patterns that do not grow at a constant rate ----- */
  function diffsPart(prompt, ys, isConst, text) {
    var ds = ys.slice(1).map(function (y, i) { return y - ys[i]; });
    var fl = ds.map(function (d, i) { return { label: t(num(ys[i]) + '\\to ' + num(ys[i + 1])), name: 'Difference ' + (i + 1), mode: 'number' }; }).concat([{ label: 'Constant? (yes/no)', name: 'Constant?', mode: 'text', wide: true, placeholder: 'yes / no' }]);
    var word = function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/[^a-z]/g, '');
      if (!s) return form('empty', 'Type <b>yes</b> or <b>no</b> in the last box.');
      var said = /^(yes|y|constant)$/.test(s) ? true : /^(no|n|notconstant|nonconstant)$/.test(s) ? false : null;
      if (said === null) return form('u5l2-const-word', 'In the last box type <b>yes</b> or <b>no</b>.');
      if (said === isConst) return ok();
      return isConst ? wrong('u5l2-said-notconst', 'Your differences are all the same — that is exactly what “constant” means.') : wrong('u5l2-said-const', 'The differences ' + t(seqTex(ds)) + ' are not all the same, so the growth is <b>not</b> constant.');
    };
    var checks = ds.map(function (d) { return K.number(d, function (v) { return d !== 0 && v === -d ? { code: 'diff-rev', hint: 'Subtract in the order <b>next − previous</b>.' } : null; }); }).concat([word]);
    var p = KP.fields(prompt, fl, checks, ds.map(String).concat([isConst ? 'yes' : 'no']), t(seqTex(ds)) + ' — ' + (isConst ? 'constant' : '<b>not</b> constant'),
      'Differences (next − previous): ' + ds.map(function (d, i) { return t(ys[i + 1] + '-' + ys[i] + '=' + d); }).join(', ') + '. ' + (isConst ? 'All the same: constant.' : 'They change, so the growth is <b>not</b> constant.'), ['Subtract each term from the next one.'], text);
    p.bad = [ds.map(String).concat([isConst ? 'no' : 'yes'])];
    return p;
  }
  function nextTwo(prompt, ys, f, n0, sol, text) {
    var fl = [n0 + 1, n0 + 2].map(function (n) { return { label: 'Figure ' + n, name: 'Figure ' + n, mode: 'number' }; });
    var last = ys[ys.length - 1] - ys[ys.length - 2];
    return KP.fields(prompt, fl, [n0 + 1, n0 + 2].map(function (n, i) { return K.number(f(n), function (v) { return v === ys[ys.length - 1] + last * (i + 1) ? { code: 'u5l2-next-step', hint: 'The differences keep changing — the next difference isn’t ' + last + ' again.' } : null; }); }),
      [String(f(n0 + 1)), String(f(n0 + 2))], t(f(n0 + 1)) + ', ' + t(f(n0 + 2)), sol, ['Continue the pattern of the differences.'], text);
  }
  X.push({ num: '6', section: 'Extra practice B — Patterns That Do Not Grow at a Constant Rate', stem: function (sh) { return 'Consider the pattern ' + t(seqTex([1, 2, 3, 4, 5].map(sh.f)) + ',\\ \\ldots') + ' made from ' + (sh.a === 1 ? 'square arrays of tiles' : 'two square arrays of tiles') + (sh.c ? ' plus ' + (sh.c === 1 ? 'one extra tile' : sh.c + ' extra tiles') : '') + '.'; },
    shared: function (r) { var a = r.chance(0.7) ? 1 : 2, c = r.pick([0, 0, 1, 2, 3]); if (r.chance(0.2)) { a = 1; c = 0; } return { a: a, c: c, f: function (n) { return a * n * n + c; }, q: r.chance(0.4) ? 10 : r.int(8, 15) }; },
    parts: [
      { id: 'e6a', level: 'BEG', make: function (r, sh) { return diffsPart('Write the differences between consecutive terms. Are they constant?', [1, 2, 3, 4, 5].map(sh.f), false, 'EP6 differences'); } },
      { id: 'e6b', level: 'BEG', make: function (r, sh) { return nextTwo('Write the next two terms.', [1, 2, 3, 4, 5].map(sh.f), sh.f, 5, 'The differences go up by ' + t(2 * sh.a) + ' each time: next differences ' + t(sh.f(6) - sh.f(5)) + ' and ' + t(sh.f(7) - sh.f(6)) + '. Terms: ' + t(sh.f(6)) + ', ' + t(sh.f(7)) + ' (' + t(sh.a === 1 ? '6^{2}' : '2(6^{2})') + (sh.c ? '+' + sh.c : '') + ' and so on).', 'EP6 next two'); } },
      { id: 'e6c', level: 'EMG', make: function (r, sh) {
        var a = sh.a, c = sh.c, T = P.add(P.mono(a, { n: 2 }), P.num(c)), keyTex = (a === 1 ? '' : a) + 'n^{2}' + (c ? '+' + c : '');
        return eqPart('Each figure is ' + (a === 1 ? 'an ' + t('n') + ' by ' + t('n') + ' square of tiles' : 'two ' + t('n') + ' by ' + t('n') + ' squares of tiles') + (c ? ' plus ' + c : '') + '. Write a rule for ' + t('t') + ' in terms of ' + t('n') + '.', 't', T, keyTex, [
          { is: P.add(P.mono(2 * a, { n: 1 }), P.num(c)), code: 'u5l2-sq-double', hint: t('n^{2}') + ' means ' + t('n\\times n') + ', not ' + t('2n') + '. Test Figure 3: ' + t('3\\times 3=9') + '.' },
          { is: linP(sh.f(2) - sh.f(1), sh.f(1) - (sh.f(2) - sh.f(1)), 'n'), code: 'first-term', hint: 'A rule ' + t('t=mn+b') + ' adds the same amount every time, but these differences change. Think about the square arrays.' }],
          'Figure ' + t('n') + ' is ' + (a === 1 ? 'an ' + t('n\\times n') + ' square' : 'two ' + t('n\\times n') + ' squares') + (c ? ' plus ' + c : '') + ': ' + t('t=' + keyTex) + '. Check Figure 3: ' + t((a === 1 ? '' : a + '(') + '3^{2}' + (a === 1 ? '' : ')') + (c ? '+' + c : '') + '=' + sh.f(3)) + ' ✓', ['How many tiles are in an ' + t('n') + ' by ' + t('n') + ' square?'], 'EP6 rule');
      } },
      { id: 'e6d', level: 'BEG', make: function (r, sh) { var q = sh.q; return numPart('How many tiles are in Figure ' + t(q) + '?', sh.f(q), function (v) { return v === sh.a * 2 * q + sh.c ? { code: 'u5l2-sq-double', hint: t(q + '^{2}') + ' is ' + t(q + '\\times ' + q) + ', not ' + t('2\\times ' + q) + '.' } : null; }, t('t=' + (sh.a === 1 ? '' : sh.a + '(') + q + '^{2}' + (sh.a === 1 ? '' : ')') + (sh.c ? '+' + sh.c : '') + '=' + sh.f(q)) + ' tiles.', ['Use your rule with ' + t('n=' + q) + '.'], 'EP6 figure ' + q); } },
      { id: 'e6e', level: 'PRG', make: function (r, sh) {
        return KP.mc(r, 'Explain why <b>no</b> rule of the form ' + t('t=mn+b') + ' can produce this pattern.', [
          { html: 'A rule ' + t('t=mn+b') + ' always adds the same amount ' + t('m') + ' each step, but here the step keeps increasing (' + t(seqTex([1, 2, 3, 4].map(function (n) { return sh.f(n + 1) - sh.f(n); }))) + ').', right: true },
          { html: 'Because the numbers are too big.', why: 'Big numbers can come from ' + t('t=mn+b') + ' too. Look at the differences.' },
          { html: 'Because the pattern starts at ' + t(sh.f(1)) + '.', why: 'A linear rule can start anywhere (that is what ' + t('b') + ' is for). Look at the differences.' },
          { html: 'It can: ' + t('t=' + lin(sh.f(2) - sh.f(1), 2 * sh.f(1) - sh.f(2), 'n')) + '.', why: 'Test Figure 3: that rule gives ' + (3 * (sh.f(2) - sh.f(1)) + 2 * sh.f(1) - sh.f(2)) + ', not ' + sh.f(3) + '.' }],
          t('t=mn+b') + ' adds exactly ' + t('m') + ' every step, so its differences are all equal. The differences here grow, so no such rule fits.', ['What do the differences of ' + t('t=mn+b') + ' look like?'], 'EP6 why not linear');
      } },
      { id: 'e6f', level: 'PRG', make: function (r, sh) {
        var dd = 2 * sh.a, ds = [1, 2, 3, 4].map(function (n) { return sh.f(n + 1) - sh.f(n); });
        return numPart('What <i>is</i> constant about this pattern? Find the differences of the differences (the <b>second differences</b>).', dd, function (v) { return v === ds[0] ? { code: 'value', hint: 'That is the first difference. Now subtract the first differences from each other.' } : null; },
          'First differences: ' + t(seqTex(ds)) + '. Second differences: ' + ds.slice(1).map(function (d, i) { return t(d + '-' + ds[i] + '=' + dd); }).join(', ') + ' — all ' + t(dd) + ': the <b>second differences are constant</b>.', ['Subtract each first difference from the next one.'], 'EP6 second differences');
      } }] });
  X.push({ num: '7', stem: function (sh) { return 'Consider the pattern ' + t(seqTex([1, 2, 3, 4, 5].map(sh.f)) + ',\\ \\ldots') + '. Each term is a rectangle ' + t('n') + ' tiles by ' + t('(n+' + sh.k + ')') + ' tiles.'; },
    shared: function (r) { var k = r.chance(0.4) ? 1 : r.pick([2, 3, 4, 5]); return { k: k, f: function (n) { return n * (n + k); }, q: r.chance(0.4) ? 10 : r.int(8, 15) }; },
    parts: [
      { id: 'e7a', level: 'BEG', make: function (r, sh) { return diffsPart('List the differences. Are they constant?', [1, 2, 3, 4, 5].map(sh.f), false, 'EP7 differences'); } },
      { id: 'e7b', level: 'BEG', make: function (r, sh) { return nextTwo('Write the next two terms.', [1, 2, 3, 4, 5].map(sh.f), sh.f, 5, t('6(6+' + sh.k + ')=' + sh.f(6)) + ' and ' + t('7(7+' + sh.k + ')=' + sh.f(7)) + ' (the differences keep going up by 2).', 'EP7 next two'); } },
      { id: 'e7c', level: 'EMG', make: function (r, sh) {
        var k = sh.k, T = P.add(P.mono(1, { n: 2 }), P.mono(k, { n: 1 }));
        return eqPart('Write the rule for ' + t('t') + '.', 't', T, 'n(n+' + k + ')', [{ is: linP(1, k, 'n'), code: 'value', hint: 'The rectangle is ' + t('n') + ' <b>by</b> ' + t('(n+' + k + ')') + ': multiply.' }, { is: P.add(P.mono(1, { n: 2 }), P.num(k)), code: 'value', hint: 'Multiply ' + t('n') + ' by the whole bracket: ' + t('n(n+' + k + ')=n^{2}+' + k + 'n') + '.' }],
          'Area of an ' + t('n') + ' by ' + t('(n+' + k + ')') + ' rectangle: ' + t('t=n(n+' + k + ')') + ' (or ' + t('n^{2}+' + k + 'n') + '). Check Figure 2: ' + t('2(' + (2 + k) + ')=' + sh.f(2)) + ' ✓', ['Number of tiles in a rectangle = length × width.'], 'EP7 rule', { good: ['n^{2}+' + k + 'n', '(n+' + k + ')n'] });
      } },
      { id: 'e7d', level: 'BEG', make: function (r, sh) { var q = sh.q; return numPart('Find the number of tiles in Figure ' + t(q) + '.', sh.f(q), function (v) { return v === q + q + sh.k ? { code: 'value', hint: 'Multiply: ' + t(q + '\\times(' + q + '+' + sh.k + ')') + '.' } : null; }, t(q + '(' + q + '+' + sh.k + ')=' + q + '\\times ' + (q + sh.k) + '=' + sh.f(q)) + ' tiles.', ['Use ' + t('t=n(n+' + sh.k + ')') + '.'], 'EP7 figure ' + q); } }] });
  X.push({ num: '8', stem: 'For each pattern, decide whether it grows by a <b>constant amount</b>. If it does, choose its rule ' + t('t=mn+b') + '; if not, choose how it is being built.', parts: [
    { id: 'e8a', level: 'EMG', make: function (r) {
      var d = r.int(2, 6), f = r.int(3, 9); if (r.chance(0.2)) { d = 4; f = 5; } var ys = [0, 1, 2, 3, 4].map(function (i) { return f + i * d; }), b = f - d;
      return KP.mc(r, t(seqTex(ys)), [{ html: 'Constant: ' + t('t=' + lin(d, b, 'n')), right: true }, { html: 'Constant: ' + t('t=' + lin(d, f, 'n')), why: 'Test Figure 1: ' + t(d + '(1)+' + f + '=' + (d + f)) + ', not ' + f + '. ' + t('b') + ' is one step back from Figure 1.' },
        { html: 'Constant: ' + t('t=' + lin(f, d, 'n')), why: 'The amount added (' + d + ') goes in front of ' + t('n') + '.' }, { html: 'Not constant: each term doubles.', why: 'The differences are all ' + d + ' — constant.' }],
        'Differences all ' + t(d) + ': constant, ' + t('m=' + d) + '. Figure 0: ' + t(f + '-' + d + '=' + b) + '. Rule ' + t('t=' + lin(d, b, 'n')) + '.', ['Find the differences first.'], 'EP8a');
    } },
    { id: 'e8b', level: 'EMG', make: function (r) {
      var k = r.chance(0.7) ? 2 : 3, f = r.pick([1, 1, 2, 3]); if (r.chance(0.2)) { k = 2; f = 1; } var ys = [0, 1, 2, 3, 4].map(function (i) { return f * Math.pow(k, i); }), ds = ys.slice(1).map(function (y, i) { return y - ys[i]; });
      return KP.mc(r, t(seqTex(ys)), [{ html: 'Not constant: each term is ' + (k === 2 ? 'double' : 'three times') + ' the one before.', right: true }, { html: 'Constant: ' + t('t=' + lin(ds[0], f - ds[0], 'n')), why: 'Test Figure 3: that rule gives ' + (3 * ds[0] + f - ds[0]) + ', not ' + ys[2] + '. The differences ' + t(seqTex(ds)) + ' are not equal.' },
        { html: 'Not constant: it adds ' + t('1, 2, 3, 4') + '.', why: 'The differences are ' + t(seqTex(ds)) + '.' }, { html: 'Constant: ' + t('t=' + k + 'n'), why: 'Test Figure 3: ' + t(k + '(3)=' + 3 * k) + ', not ' + ys[2] + '.' }],
        'Differences ' + t(seqTex(ds)) + ' — not constant. Each term is ' + (k === 2 ? 'double' : 'three times') + ' the one before.', ['Find the differences. Then compare each term with the one before it.'], 'EP8b');
    } },
    { id: 'e8c', level: 'EMG', make: function (r) {
      var d = r.int(2, 5), f = r.int(14, 25); if (r.chance(0.2)) { d = 3; f = 20; } var ys = [0, 1, 2, 3, 4].map(function (i) { return f - i * d; }), b = f + d;
      return KP.mc(r, t(seqTex(ys)), [{ html: 'Constant: ' + t('t=' + lin(-d, b, 'n')) + ' (it shrinks by ' + d + ' each figure).', right: true }, { html: 'Constant: ' + t('t=' + lin(d, b, 'n')), why: 'The values go <b>down</b>, so ' + t('m') + ' is negative: ' + t('m=-' + d) + '.' },
        { html: 'Constant: ' + t('t=' + lin(-d, f, 'n')), why: 'Test Figure 1: ' + t('-' + d + '(1)+' + f + '=' + (f - d)) + ', not ' + f + '. Figure 0 is one step back: ' + t(f + '+' + d + '=' + b) + '.' }, { html: 'Not constant: it goes down.', why: 'Going down by the same amount each time is still constant: every difference is ' + t('-' + d) + '.' }],
        'Differences all ' + t('-' + d) + ': constant, ' + t('m=-' + d) + '. Figure 0 (one step back up): ' + t(f + '+' + d + '=' + b) + '. Rule ' + t('t=' + lin(-d, b, 'n')) + '.', ['Find the differences first — they can be negative.'], 'EP8c');
    } },
    { id: 'e8d', level: 'PRG', make: function (r) {
      var s = r.pick([1, 1, 2, 3]), c = r.pick([0, 0, 1, 2]); if (r.chance(0.2)) { s = 1; c = 0; } var ys = [], v = c; for (var i = 0; i < 5; i++) { v += s + i; ys.push(v); } var ds = ys.slice(1).map(function (y, i) { return y - ys[i]; });
      return KP.mc(r, t(seqTex(ys)), [{ html: 'Not constant: the differences are ' + t(seqTex(ds)) + ' — each one is 1 more than the last.', right: true }, { html: 'Constant: ' + t('t=' + lin(ds[0], ys[0] - ds[0], 'n')), why: 'Test Figure 3: that gives ' + (3 * ds[0] + ys[0] - ds[0]) + ', not ' + ys[2] + '.' },
        { html: 'Not constant: each term is double the one before.', why: 'Check: ' + t(2 * ys[1]) + ' is not ' + ys[2] + '. Look at the differences.' }, { html: 'Constant: it always goes up.', why: 'Going up isn’t enough: the amount added must be the same every time.' }],
        'Differences ' + t(seqTex(ds)) + ': not constant — each difference is 1 more than the one before (the pattern adds ' + t(seqTex(ds)) + ', …).', ['Find the differences, then look at how they change.'], 'EP8d');
    } }] });

  /* ----- EP 9–12: variables ----- */
  var EP9 = [['The number of tiles in Figure \\(n\\) of a growing pattern.', 'the figure number \\(n\\)', 'the number of tiles', 'd'], ['The depth of water in a bathtub while it fills.', 'the time elapsed', 'the depth of the water', 'c'],
    ['The total cost of \\(n\\) movie tickets at $12 each.', 'the number of tickets \\(n\\)', 'the total cost', 'd'], ['The distance a car has travelled after \\(t\\) hours.', 'the time \\(t\\) in hours', 'the distance travelled', 'c'],
    ['The number of buses needed for \\(s\\) students.', 'the number of students \\(s\\)', 'the number of buses', 'd'], ['The temperature of a cup of coffee as it cools.', 'the time elapsed', 'the temperature of the coffee', 'c'],
    ['The number of eggs in \\(c\\) full cartons.', 'the number of cartons \\(c\\)', 'the number of eggs', 'd'], ['The height of a kite as its string is let out.', 'the length of string let out', 'the height of the kite', 'c'],
    ['The total mass of \\(b\\) identical bricks.', 'the number of bricks \\(b\\)', 'the total mass', 'd'], ['The amount of water in a pool while a hose runs.', 'the time the hose has run', 'the amount of water', 'c'],
    ['The number of wheels on \\(k\\) cars.', 'the number of cars \\(k\\)', 'the number of wheels', 'd'], ['The volume of air in a balloon as it is pumped up.', 'the time spent pumping', 'the volume of air', 'c']];
  X.push({ num: '9', section: 'Extra practice C — Discrete or Continuous? (a preview of Lesson 5)', stem: 'A variable is <b>discrete</b> if it takes separate, countable values with gaps between them (like 1, 2, 3 tiles) and <b>continuous</b> if any value in a range is possible, including decimals. Name the <b>independent</b> variable in each situation, and say whether it is discrete or continuous.', parts: [0, 1, 2, 3, 4, 5].map(function (i) {
    return { id: 'e9' + 'abcdef'[i], level: 'EMG', outcome: 'RF1', make: function (r) {
      var s = r.chance(0.6) ? EP9[i] : EP9[i + 6];
      var D = s[3] === 'd', w = function (q) { return q === 'd' ? 'discrete' : 'continuous'; };
      return KP.mc(r, s[0], [{ html: 'Independent: ' + s[1] + ' — ' + w(s[3]), right: true }, { html: 'Independent: ' + s[1] + ' — ' + w(D ? 'c' : 'd'), why: D ? 'Can it be 2.5? No — it is counted in whole numbers: discrete.' : 'Time (or a length) can take any value, like 2.5: continuous.' },
        { html: 'Independent: ' + s[2] + ' — discrete', why: cap(s[2]) + ' results from the other quantity — it is the dependent variable.' }, { html: 'Independent: ' + s[2] + ' — continuous', why: cap(s[2]) + ' depends on the other quantity — it is the dependent variable.' }],
        'The independent variable is <b>' + s[1] + '</b>. ' + (D ? 'It is counted in whole numbers — there is nothing between 2 and 3 — so it is <b>discrete</b>.' : 'It can take any value in a range (2.5, 2.51, …), so it is <b>continuous</b>.'), ['Which quantity causes the change? Then ask: could a value halfway between two of these make sense?'], 'EP9 ' + s[1]);
    } };
  }) });
  var EP10 = [
    ['The cost of filling a car, based on the number of litres of gasoline pumped.', 'Continuous: a pump can deliver 12.73 L — any amount in the range is possible; rounding on the display doesn’t change that.', ['Discrete: you can only buy whole litres.', 'Discrete: money comes in cents.', 'Continuous: because gas is expensive.']],
    ['The height of a bean plant, measured and recorded once each morning for two weeks.', 'Either can be defended — the reason is what matters: the height itself is continuous, but the recorded data (one measurement a day, nothing in between) is discrete.', ['Continuous, and the daily recording makes no difference at all.', 'Discrete, because plants don’t grow at night.', 'Discrete, because height is measured in whole centimetres.']],
    ['The balance in a savings account that has interest added on the last day of each month. Is the balance discrete or continuous?', 'Discrete: the balance jumps on the last day of the month and then stays flat, so it changes in separate steps rather than a smooth rise.', ['Continuous: money is earned every second.', 'Continuous: the balance can be any amount.', 'Discrete: because banks close at night.']],
    ['The length of a candle, based on the number of hours it has been burning.', 'Continuous: the candle shortens smoothly, so a length halfway between two readings really happens.', ['Discrete: candles burn one centimetre at a time.', 'Discrete: hours are whole numbers.', 'Continuous: because the flame is hot.']]];
  X.push({ num: '10', stem: 'Each situation below is genuinely arguable. Choose the decision with the best justification — the justification is the real answer here.', parts: [0, 1, 2, 3].map(function (i) {
    return { id: 'e10' + 'abcd'[i], level: 'PRG', outcome: 'RF1', make: function (r) {
      var s = EP10[i];
      return KP.mc(r, s[0], [{ html: s[1], right: true }].concat(s[2].map(function (w) { return { html: w, why: 'Ask: could a value halfway between two readings really happen in this situation?' }; })), s[1], ['Could a value halfway between two of the recorded values really occur?'], 'EP10 ' + 'abcd'[i]);
    } };
  }) });
  X.push({ num: '11', section: 'Extra practice D — Independent and Dependent Variables', stem: 'Identify the independent variable and the dependent variable in each situation.', parts: [0, 1, 2, 3].map(function (i) {
    var BK = [8, 9, 10, 11];
    return { id: 'e11' + 'abcd'[i], level: 'BEG', outcome: 'RF1', make: function (r) { var pool = SIT.filter(function (s, j) { return j % 4 === (i + 2) % 4; }), s = r.chance(0.25) ? SIT[BK[i]] : r.pick(pool); return sitPart(r, s, 'EP11 ' + s[0]); } };
  }) });
  var REV = [['hours I study', 'mark I get on the test', 'Jordan', 'The study hours come first and are what Jordan controls; the mark is the result.'], ['number of hours I practise piano', 'score I get at the music festival', 'Maya', 'The practice comes first; the score results from it.'],
    ['amount of fertilizer I use', 'height of my tomato plants', 'Sam', 'Sam chooses the fertilizer; the plants’ height results from it.'], ['number of laps I swim', 'number of calories I burn', 'Ava', 'Ava chooses how many laps to swim; the calories burned result from that.'],
    ['speed I drive', 'time my trip takes', 'Leo', 'Leo chooses the speed; the trip time results from it.']];
  X.push({ num: '12', stem: 'Two harder cases.', parts: [
    { id: 'e12a', level: 'PRG', outcome: 'RF1', make: function (r) {
      var c = r.chance(0.3) ? REV[0] : r.pick(REV);
      return KP.mc(r, c[2] + ' says, “The ' + c[0] + ' depends on the ' + c[1] + '.” Which rewrite has the variables the right way round, and why?', [
        { html: '“The ' + c[1] + ' depends on the ' + c[0] + '.” ' + c[3], right: true },
        { html: 'The statement is already right: the first quantity named is the dependent one.', why: 'The order of the words doesn’t decide it. Which one is the cause and which the result?' },
        { html: '“The ' + c[1] + ' depends on the ' + c[0] + '.” Because the ' + c[1] + ' is the larger number.', why: 'Right rewrite, wrong reason: size doesn’t decide it — what comes first and is controlled does.' },
        { html: '“Neither depends on the other.”', why: 'They are related: changing one changes the other. Which one causes the change?' }],
        '“The <b>' + c[1] + '</b> depends on the <b>' + c[0] + '</b>.” ' + c[3] + ' So the ' + c[0] + ' is independent and the ' + c[1] + ' is dependent.', ['Which happens first, and which is the result?'], 'EP12a reverse');
    } },
    { id: 'e12b', level: 'PRG', outcome: 'RF1', make: function (r) {
      var c = r.pick([['shoe size', 'height', '30 people'], ['arm span', 'height', '25 students'], ['hand length', 'foot length', '20 people']]);
      return KP.mc(r, 'A table lists the ' + c[0] + ' and the ' + c[1] + ' of ' + c[2] + '. Neither one causes the other. How would you still decide which variable to put on the horizontal axis?', [
        { html: 'Put whichever one you are using as the <b>input</b> (the one you want to predict from) on the horizontal axis — the question you are asking decides it.', right: true },
        { html: 'Always put the bigger numbers on the horizontal axis.', why: 'Size doesn’t decide which is the input.' },
        { html: 'You can’t graph them, because neither causes the other.', why: 'You can graph any two related quantities. Choose the one you are predicting from as the input.' },
        { html: 'Put them both on the vertical axis.', why: 'Each point needs one value across and one value up.' }],
        'When neither quantity causes the other, the <b>question</b> decides: the quantity you predict <i>from</i> is the input (horizontal axis); the one you predict is the output (vertical axis).', ['Which quantity do you want to use to predict the other?'], 'EP12b no cause');
    } }] });

  /* ----- EP 13–19: reasoning and stretch ----- */
  X.push({ num: '13', stem: function (sh) { return 'A pattern follows the rule ' + t('t=' + lin(sh.m, sh.b, 'n')) + ', where ' + t('n') + ' is the figure number.'; }, shared: function (r) { var o = ruleShared(2, 4, 1, 4, [3, 2])(r); return o; }, parts: [
    { id: 'e13a', level: 'BEG', make: function (r, sh) { return tablePart('Build a table of values for Figures 1 through 6.', 'n', [1, 2, 3, 4, 5, 6], sh.f, function (n, v) { return v === sh.m * n ? { code: 'no-constant', hint: 'Use the whole rule: add ' + sh.b + '.' } : null; }, [1, 2, 3, 4, 5, 6].map(function (n) { return t(sh.m + '(' + n + ')+' + sh.b + '=' + sh.f(n)); }).join(', '), ['Substitute each figure number into the rule.'], 'EP13 table', 't'); } },
    { id: 'e13b', level: 'BEG', make: function (r, sh) { var tp = [1, 2, 3, 4, 5, 6].map(function (n) { return [n, sh.f(n)]; }); return plotPart('Plot the six ordered pairs ' + t('(n,\\ t)') + ' on the grid.', tp, 'n', 't', 1, 'Plot ' + tp.map(function (p) { return t(pt(p)); }).join(', ') + '.', ['Figure number across, number of tiles up.'], 'EP13 plot'); } },
    { id: 'e13c', level: 'EMG', outcome: 'RF1', make: function (r, sh) {
      return KP.mc(r, 'Should you join the plotted points with a solid line?', [
        { html: 'No — the figure number is <b>discrete</b>: there is no Figure 2.5, so only the separate points have meaning.', right: true },
        { html: 'Yes — the points lie in a straight line.', why: 'Lining up isn’t the test. Does Figure 2.5 exist?' },
        { html: 'Yes — the number of tiles is continuous.', why: 'Can a figure have ' + (sh.f(2) + 0.5) + ' tiles? Tiles are counted in whole numbers.' },
        { html: 'No — there are too many points.', why: 'The number of points isn’t the reason. Think about the values in between.' }],
        'Leave the points unjoined: the figure number is <b>discrete</b> (whole numbers only), so nothing between the points has meaning.', ['Is there a Figure 2.5?'], 'EP13 join?');
    } }] });
  X.push({ num: '14', stem: function (sh) { return 'A tile pattern has the rule ' + t('t=' + lin(sh.m, sh.b, 'n')) + '.'; }, shared: ruleShared(2, 6, 1, 6, [5, 4]), parts: [
    { id: 'e14a', level: 'EMG', make: function (r, sh) {
      var neg = -r.int(2, 4), half = r.int(1, 3) + 0.5; if (r.chance(0.3)) { neg = -3; half = 2.5; }
      return KP.mc(r, 'Explain why ' + t('n') + ' cannot be ' + t(neg) + ', and why it cannot be ' + t(half) + ' either.', [
        { html: 'A figure number counts figures, so it must be a positive whole number: there is no Figure ' + neg + ' and no half a figure.', right: true },
        { html: 'Because the rule gives a negative number of tiles for both.', why: 'Try ' + t('n=' + half) + ': ' + t(sh.m + '(' + half + ')+' + sh.b + '=' + num(sh.m * half + sh.b)) + ' — positive. The problem is the figure number itself.' },
        { html: 'Because the rule only works for even numbers.', why: 'The rule works for any figure number, odd or even.' },
        { html: 'It can — any number can go into a rule.', why: 'In the formula, yes; but ' + t('n') + ' counts figures. Is there a Figure ' + half + '?' }],
        t('n') + ' counts figures (1st, 2nd, 3rd, …). There is no Figure ' + t(neg) + ' and no Figure ' + t(half) + ': ' + t('n') + ' must be a positive whole number.', ['What does ' + t('n') + ' count?'], 'EP14 why not');
    } },
    { id: 'e14b', level: 'BEG', make: function (r, sh) { return numPart('What is the smallest value ' + t('n') + ' is allowed to take?', 1, function (v) { return v === 0 ? { code: 'value', hint: 'There is no “Figure 0” in the picture — the figures start at Figure 1.' } : null; }, 'The figures are numbered from 1, so the smallest value is ' + t('n=1') + '.', ['What is the first figure called?'], 'EP14 smallest n', { before: t('n=') }); } }] });
  X.push({ num: '15', stem: function (sh) { return 'A display of ' + t(sh.c - sh.d) + ' tiles has tiles removed: the pattern ' + t(seqTex([1, 2, 3, 4, 5].map(sh.f)) + ',\\ \\ldots') + ' follows ' + t('t=' + lin(-sh.d, sh.c, 'n')) + '.'; },
    shared: function (r) { var d, c; do { d = r.int(2, 5); c = r.int(17, 30); } while (c % d === 0); if (r.chance(0.2)) { d = 3; c = 23; } var L = Math.floor(c / d), q; do { q = r.int(L + 2, L + 6); } while (q === L + 1 && false); if (d === 3 && c === 23 && r.chance(0.5)) q = 12; return { d: d, c: c, L: L, q: q, f: function (n) { return c - d * n; } }; },
    parts: [
      { id: 'e15a', level: 'BEG', make: function (r, sh) { var q = sh.q; return numPart('What does the rule give for Figure ' + t(q) + '?', sh.f(q), function (v) { return v === -sh.f(q) ? { code: 'pair-sign', hint: t('-' + sh.d + '(' + q + ')=-' + sh.d * q) + '; then add ' + sh.c + '. The answer is negative.' } : v === sh.c + sh.d * q ? { code: 'add-not-sub', hint: 'The rule subtracts ' + t(sh.d + 'n') + '.' } : null; }, t('t=-' + sh.d + '(' + q + ')+' + sh.c + '=' + (-sh.d * q) + '+' + sh.c + '=' + sh.f(q)) + '.', ['Substitute ' + t('n=' + q) + '.'], 'EP15 figure ' + q); } },
      { id: 'e15b', level: 'EMG', make: function (r, sh) {
        return KP.mc(r, 'Why is that answer impossible in the real situation?', [
          { html: 'A display can’t hold a negative number of tiles.', right: true, why: null },
          { html: 'Because ' + t(sh.q) + ' is an even number.', why: 'Even figure numbers are fine. Look at the sign of the answer.' },
          { html: 'Because the rule should be ' + t('t=' + lin(sh.d, sh.c, 'n')) + '.', why: 'The tiles are being removed, so the rule subtracts. The answer is negative — what does that mean?' },
          { html: 'It isn’t impossible: the display borrows tiles.', why: 'You can’t remove more tiles than the display has.' }],
          'The rule gives a <b>negative</b> number of tiles — impossible: once the display is empty, no more tiles can be removed.', ['What does a negative number of tiles mean?'], 'EP15 why impossible');
      } },
      { id: 'e15c', level: 'ADV', make: function (r, sh) {
        var L = sh.L, fl = [{ label: 'Last figure', name: 'Last figure', before: 'Figure' }, { label: 'Tiles in it', name: 'Tiles' }];
        return KP.fields('What is the last figure that still makes sense, and how many tiles does it have?', fl, [K.number(L, function (v) { return v === L + 1 ? { code: 'u5l2-neg-tiles', hint: 'Figure ' + (L + 1) + ' would have ' + t(sh.f(L + 1)) + ' tiles — negative.' } : v === sh.c / sh.d ? { code: 'u5l2-last-fig', hint: 'The figure number must be a whole number.' } : null; }), K.number(sh.f(L), function (v) { return v === sh.f(L + 1) ? { code: 'u5l2-neg-tiles', hint: 'A negative number of tiles is impossible.' } : null; })],
          [String(L), String(sh.f(L))], 'Figure ' + L + ', with ' + t(sh.f(L)) + ' tiles', t('-' + sh.d + '(' + L + ')+' + sh.c + '=' + sh.f(L)) + ' and ' + t('-' + sh.d + '(' + (L + 1) + ')+' + sh.c + '=' + sh.f(L + 1)) + ', so Figure ' + t(L) + ' is the last one that makes sense, with ' + t(sh.f(L)) + ' tiles.',
          ['Keep subtracting ' + sh.d + ' (or try figure numbers in the rule) until the next figure would be negative.'], 'EP15 last figure');
      } }] });
  X.push({ num: '16', stem: function (sh) { return 'Devon is working with the pattern ' + t('t=' + lin(sh.m, sh.b, 'n')) + '.'; },
    shared: function (r) { var m = r.pick([2, 4, 4, 6]), b = r.pick([1, 1, 3, 5]); if (r.chance(0.2)) { m = 4; b = 1; } var k = r.int(8, 15), claimRight = r.chance(0.25), V = r.int(15, 30), W; do { W = 2 * r.int(15, 40); } while (W === m * k + b + 1); if (m === 4 && b === 1 && r.chance(0.5)) { k = 12; V = 25; W = 50; claimRight = false; } return { m: m, b: b, k: k, claim: m * k + b + (claimRight ? 0 : 1), claimRight: claimRight, V: V, W: W, f: function (n) { return m * n + b; } }; },
    parts: [
      { id: 'e16a', level: 'EMG', make: function (r, sh) {
        var v = sh.f(sh.k);
        return KP.mc(r, 'He claims Figure ' + t(sh.k) + ' has ' + t(sh.claim) + ' tiles. Is he right?', [
          { html: 'Yes: ' + t(sh.m + '(' + sh.k + ')+' + sh.b + '=' + v) + '.', right: sh.claimRight, why: sh.claimRight ? null : 'Check the calculation: ' + t(sh.m + '(' + sh.k + ')+' + sh.b + '=' + v) + '.' },
          { html: 'No: ' + t(sh.m + '(' + sh.k + ')+' + sh.b + '=' + v) + ', not ' + sh.claim + '.', right: !sh.claimRight, why: !sh.claimRight ? null : 'Check: ' + t(v) + ' is exactly what he claimed.' },
          { html: 'No: ' + t((sh.m + sh.b) + '\\times ' + sh.k + '=' + (sh.m + sh.b) * sh.k) + '.', why: 'Multiply ' + t('m') + ' by ' + t('n') + ' first, then add ' + t('b') + '.' },
          { html: 'Can’t tell without drawing Figure ' + sh.k + '.', why: 'The rule tells you: substitute ' + t('n=' + sh.k) + '.' }],
          t('t=' + sh.m + '(' + sh.k + ')+' + sh.b + '=' + v) + '. ' + (sh.claimRight ? 'He is right.' : 'He is <b>not</b> right: it is ' + v + ', not ' + sh.claim + '.'), ['Substitute ' + t('n=' + sh.k) + ' into the rule.'], 'EP16 claim');
      } },
      { id: 'e16b', level: 'PRG', make: function (r, sh) { var V = sh.f(sh.V); return numPart('Which figure has ' + t(V) + ' tiles?', sh.V, solveDiag(sh.m, sh.b, V), solveSol(sh.m, sh.b, V, sh.V), ['Set the rule equal to ' + t(V) + ' and solve.'], 'EP16 which figure', { before: 'Figure' }); } },
      { id: 'e16c', level: 'ADV', make: function (r, sh) {
        var W = sh.W, n = (W - sh.b) / sh.m;
        return KP.mc(r, 'Explain why ' + t(W) + ' can <b>never</b> appear in this pattern, no matter how far it runs.', [
          { html: t(sh.m + 'n') + ' is always even, so ' + t(lin(sh.m, sh.b, 'n')) + ' (even + odd) is always odd; ' + t(W) + ' is even. (Solving gives ' + t('n=' + num(n)) + ', not a whole number.)', right: true },
          { html: 'Because ' + t(W) + ' is too big.', why: 'The pattern keeps growing past ' + W + '. Think about odd and even.' },
          { html: 'Because ' + t(W) + ' is not a multiple of ' + t(sh.b) + '.', why: 'Multiples of ' + t('b') + ' have nothing to do with it. Think about odd and even.' },
          { html: 'It can: Figure ' + Math.round(n) + '.', why: 'Check: ' + t(sh.m + '(' + Math.round(n) + ')+' + sh.b + '=' + sh.f(Math.round(n))) + ', not ' + W + '.' }],
          t(sh.m + 'n') + ' is a multiple of ' + sh.m + ', so it is always even; adding the odd number ' + t(sh.b) + ' makes every value <b>odd</b>. ' + t(W) + ' is even, so it never appears. (Directly: ' + t(lin(sh.m, sh.b, 'n') + '=' + W) + ' gives ' + t('n=' + num(n)) + ', not a whole figure number.)', ['Are the values of the pattern odd or even?'], 'EP16 never');
      } }] });
  X.push({ num: '17', section: 'Extra practice E — Reasoning and Stretch', stem: function (sh) { return '<b>Stretch — two patterns racing.</b> Pattern ' + t('A') + ' starts with ' + t(sh.a1) + ' tiles in Figure ' + t('1') + ' and grows by ' + t(sh.da) + ' tiles each figure. Pattern ' + t('B') + ' starts with ' + t(sh.b1) + ' tiles in Figure ' + t('1') + ' and grows by ' + t(sh.db) + ' tiles each figure.'; },
    shared: function (r) {
      var a1, da, b1, db, N;
      for (var g = 0; g < 300; g++) { a1 = r.int(2, 6); da = r.int(4, 7); db = r.int(1, da - 2); N = r.int(4, 7); b1 = a1 + (N - 1) * (da - db); if (b1 <= 25) break; }
      if (r.chance(0.2)) { a1 = 3; da = 5; b1 = 18; db = 2; N = 6; }
      return { a1: a1, da: da, b1: b1, db: db, N: N, A: function (n) { return a1 + (n - 1) * da; }, B: function (n) { return b1 + (n - 1) * db; } };
    },
    parts: [
      { id: 'e17a', level: 'BEG', make: function (r, sh) {
        var ns = [2, 3, 4, 5, 6, 7], fl = [], ch = [], keys = [];
        ns.forEach(function (n) { fl.push({ label: t('A') + ', Figure ' + n, name: 'A ' + n }); ch.push(K.number(sh.A(n))); keys.push(String(sh.A(n))); });
        ns.forEach(function (n) { fl.push({ label: t('B') + ', Figure ' + n, name: 'B ' + n }); ch.push(K.number(sh.B(n))); keys.push(String(sh.B(n))); });
        return KP.fields('Complete the table for Figures 2 to 7.', fl, ch, keys, 'A: ' + t(seqTex(range(1, 7).map(sh.A))) + '; B: ' + t(seqTex(range(1, 7).map(sh.B))), 'Pattern A: add ' + sh.da + ' each time: ' + t(seqTex(range(1, 7).map(sh.A))) + '.<br>Pattern B: add ' + sh.db + ' each time: ' + t(seqTex(range(1, 7).map(sh.B))) + '.', ['Keep adding each pattern’s own step.'], 'EP17 table');
      } },
      { id: 'e17b', level: 'EMG', make: function (r, sh) {
        var bA = sh.a1 - sh.da, bB = sh.b1 - sh.db, fl = [{ label: 'Pattern ' + t('A') + ':', name: 'A', mode: 'math', keys: 'poly', vars: ['n'], before: t('t=') }, { label: 'Pattern ' + t('B') + ':', name: 'B', mode: 'math', keys: 'poly', vars: ['n'], before: t('t=') }];
        return KP.fields('Write a rule ' + t('t=mn+b') + ' for each pattern.', fl, [eqCheck('t', linP(sh.da, bA, 'n'), ruleWrongs(sh.da, bA, sh.a1)), eqCheck('t', linP(sh.db, bB, 'n'), ruleWrongs(sh.db, bB, sh.b1))], [lin(sh.da, bA, 'n'), lin(sh.db, bB, 'n')],
          'A: ' + t('t=' + lin(sh.da, bA, 'n')) + '; B: ' + t('t=' + lin(sh.db, bB, 'n')), 'A: ' + t('m=' + sh.da) + ', Figure 0 = ' + t(sh.a1 + '-' + sh.da + '=' + bA) + ': ' + t('t=' + lin(sh.da, bA, 'n')) + '.<br>B: ' + t('m=' + sh.db) + ', Figure 0 = ' + t(sh.b1 + '-' + sh.db + '=' + bB) + ': ' + t('t=' + lin(sh.db, bB, 'n')) + '.', ['For each: ' + t('m') + ' is the step, ' + t('b') + ' is one step back from Figure 1.'], 'EP17 rules');
      } },
      { id: 'e17c', level: 'MAS', make: function (r, sh) {
        var N = sh.N, v = sh.A(N), fl = [{ label: 'Figure number', name: 'Figure' }, { label: 'Number of tiles', name: 'Tiles' }];
        return KP.fields('At which figure number do the two patterns have the <b>same</b> number of tiles? How many tiles is that?', fl, [K.number(N, function (x) { return x === v ? { code: 'u5l2-equal-count', hint: 'That is the number of tiles. Which <b>figure</b> is it?' } : x === N - 1 || x === N + 1 ? { code: 'u5l2-equal-fig', hint: 'At Figure ' + x + ': A has ' + sh.A(x) + ' and B has ' + sh.B(x) + '.' } : null; }),
          K.number(v, function (x) { return x === N ? { code: 'u5l2-equal-count', hint: 'That is the figure number. How many tiles do both patterns have there?' } : null; })], [String(N), String(v)], 'Figure ' + N + ', ' + t(v) + ' tiles',
          'B starts ' + t(sh.b1 + '-' + sh.a1 + '=' + (sh.b1 - sh.a1)) + ' tiles ahead, and A gains ' + t(sh.da + '-' + sh.db + '=' + (sh.da - sh.db)) + ' tiles per figure. It catches up after ' + t((sh.b1 - sh.a1) + '\\div ' + (sh.da - sh.db) + '=' + (N - 1)) + ' steps: Figure ' + t(N) + '.<br>Check: A ' + t(sh.A(N)) + ', B ' + t(sh.B(N)) + ' — both ' + v + ' tiles. (Or solve ' + t(lin(sh.da, sh.a1 - sh.da, 'n') + '=' + lin(sh.db, sh.b1 - sh.db, 'n')) + '.)',
          ['Extend your table until the two rows match.', 'Or: how far ahead is B at the start, and how much does A gain each figure?'], 'EP17 equal');
      } },
      { id: 'e17d', level: 'PRG', make: function (r, sh) {
        var N = sh.N, g = sh.da - sh.db;
        return KP.mc(r, 'After that figure, which pattern is ahead? Explain using the two values of ' + t('m') + '.', [
          { html: 'Pattern ' + t('A') + ': its ' + t('m=' + sh.da) + ' is bigger than ' + t('B') + '’s ' + t('m=' + sh.db) + ', so it gains ' + g + ' more tiles every figure and pulls ahead.', right: true },
          { html: 'Pattern ' + t('B') + ': it started with more tiles.', why: 'B started ahead, but A gains ' + g + ' tiles per figure. Check Figure ' + (N + 1) + ': A ' + sh.A(N + 1) + ', B ' + sh.B(N + 1) + '.' },
          { html: 'Neither: they stay equal from then on.', why: 'They grow by different amounts, so they can be equal at only one figure.' },
          { html: 'Pattern ' + t('B') + ': its ' + t('m') + ' is smaller, so it stays ahead.', why: 'A smaller ' + t('m') + ' means slower growth.' }],
          'Pattern A: ' + t('m=' + sh.da) + ' against ' + t('m=' + sh.db) + ', so A gains ' + g + ' tiles per figure. After they are level at Figure ' + N + ', A is ahead: Figure ' + (N + 1) + ' has ' + t(sh.A(N + 1)) + ' versus ' + t(sh.B(N + 1)) + '.', ['Which pattern adds more tiles each figure?'], 'EP17 who is ahead');
      } }] });
  X.push({ num: '18', stem: '<i>(Multiple Choice)</i>', parts: [
    { id: 'e18', level: 'EMG', make: function (r) {
      var m = r.int(3, 8), b = -r.int(1, 6), N = r.int(8, 13); if (r.chance(0.2)) { m = 7; b = -4; N = 10; } var V = m * N + b;
      var opts = [N - 2, N - 1, N, N + 1].map(function (n) { return { html: 'Figure ' + n, right: n === N, why: n === N ? null : 'Check: ' + t(m + '(' + n + ')' + b + '=' + (m * n + b)) + ', not ' + V + '.' }; });
      return KP.mc(r, 'A pattern follows the rule ' + t('t=' + lin(m, b, 'n')) + '. Which figure has ' + t(V) + ' tiles?', opts, solveSol(m, b, V, N), ['Solve ' + t(lin(m, b, 'n') + '=' + V) + ', or test each choice.'], 'EP18 MC', true);
    } }] });
  X.push({ num: '19', stem: '<i>(Numerical Response)</i>', parts: [
    { id: 'e19', level: 'PRG', make: function (r) {
      var a1 = r.int(4, 12), d = r.int(3, 9), N = r.int(8, 14); if (r.chance(0.2)) { a1 = 9; d = 7; N = 11; } var V = a1 + (N - 1) * d, b = a1 - d;
      return KP.nr('A pattern begins with ' + t(a1) + ' tiles in Figure ' + t('1') + ' and grows by ' + t(d) + ' tiles each figure. The figure number that has ' + t(V) + ' tiles is ________.', N, function (x) {
        if (feq(x, (V - a1) / d)) return { code: 'off-by-one', hint: 'You found how many steps come <b>after</b> Figure 1. Add 1 (or use the rule ' + t('t=' + lin(d, b, 'n')) + ').' };
        if (feq(x, V / d)) return { code: 'no-subtract', hint: 'Write the rule first: ' + t('t=' + lin(d, b, 'n')) + '.' };
        return null;
      }, 'Rule: ' + t('t=' + lin(d, b, 'n')) + ' (' + t('m=' + d) + ', Figure 0 = ' + t(a1 + '-' + d + '=' + b) + ').<br>' + solveSol(d, b, V, N), ['Write the rule ' + t('t=mn+b') + ' first, then solve.'], 'EP19 NR');
    } }] });

  HW.defineLesson({
    id: 'u5l2', unit: 5, num: '2', title: 'Growing Patterns and Types of Variables', outcome: 'RF4',
    blurb: 'Growing patterns in words, tables and graphs; independent and dependent variables.',
    questions: QUESTIONS, extra: X
  });
})(window);
