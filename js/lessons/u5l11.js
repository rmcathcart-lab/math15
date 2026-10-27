/* Math 15 · Unit 5 · Lesson 11 — Interpreting and Sketching Real-World Graphs (RF1; the impossible-graph items RF2,
 * reading intercepts in context RF5)
 * Assignment 11, questions 1–14 (u5_L11.tex) and the Lesson 11 Extra Practice (u5_EP11.tex, questions 1–18).
 * Built on the Math 10C Unit 5 Lesson 8 practice (same topic, same engine): unscaled story sketches are drawn on the
 * graph pad and checked by shape (stages in order, straight vs curved, steeper / flatter, where it starts and ends;
 * see story() below), scaled sketches (the tank, the drive to the cabin, the two walks) exactly, the open "satisfy all
 * three conditions" sketches by rules. Describe / explain questions become a choice table (interval -> what is
 * happening) or multiple choice whose options are reasons; matching stories to graphs stays multiple choice (graph
 * options) or a matching table. Every part is a generator: the stories, segment lengths, rates and the order of the
 * pieces change, and the booklet's own numbers are one of the possible versions where practical.
 * Levels (calibrated for Math 15): LIM BEG EMG PRG ADV MAS (recognition formats capped at PRG). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, DR = HW.draw;

  HW.addCodes({
    'rate-flip': 'Rate as time ÷ change (upside down)', 'rate-sign': 'Sign of a rate of change wrong', 'flat-time': 'Total time on flat segments wrong', 'per-min': 'Rate per minute instead of per hour',
    'dist-vs-travel': 'Distance from home confused with distance travelled', 'wrong-line': 'Read the wrong line / segment',
    'story-bend': 'Stage drawn with the wrong bend (straight vs curved, steeper vs flatter)', 'story-zero': 'Graph reaches zero when it shouldn’t (or not when it should)', 'story-when': 'A stage at the wrong time',
    'story-lines': 'Points instead of a line', 'story-below': 'Graph drops below a level it can’t go under', 'story-peak': 'Peak at the wrong place',
    'u5l11-one-flat': 'Counted only one of the flat stretches', 'u5l11-rate-days': 'Divided by the end time instead of the change in time', 'u5l11-round': 'Rate not rounded to one decimal place',
    'u5l11-stops': 'Wrong number of stops', 'u5l11-count-ends': 'Counted the stop at the start or finish', 'u5l11-fastest': 'Fastest stretch not between the 2nd and 3rd stops', 'u5l11-limit': 'Graph goes past a stated limit',
    'u5l11-stop-time': 'Stopped time not exactly as stated', 'u5l11-ends': 'Graph does not start or end where stated', 'xint-yint': 'Gave the vertical intercept for the horizontal one', 'sign': 'Wrong sign'
  });
  HW.addPartial({ 'u5l11-count-ends': 'b', 'u5l11-one-flat': 's', 'u5l11-rate-days': 'n', 'u5l11-round': 's', 'u5l11-stops': 'n', 'u5l11-fastest': 'b', 'u5l11-limit': 's', 'u5l11-stop-time': 's', 'u5l11-ends': 's', 'story-below': 'n', 'story-peak': 'b' });

  /* ---------- small helpers ---------- */
  var C1 = '#2b55a0', C2 = '#b0562b', C3 = '#6a4fb0', INK = '#2b3340';
  function dn(x) { var v = Math.round(x * 1000) / 1000; return v < 0 ? '-' + Math.abs(v) : String(v); }
  function near(a, b) { return Math.abs(a - b) < 1e-6; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function units(s) { return '\\text{ ' + s + '}'; }
  function ptT(p) { return '(' + dn(p[0]) + ',\\ ' + dn(p[1]) + ')'; }
  function pick(r, arr) { return arr[Math.floor(r.next() * arr.length)]; }

  /* ---------- drawings: HW.graph plus custom ticks, notes and point labels (from the 10C lesson) ---------- */
  function geo(g, svg) {
    var re = /<line x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)"[^>]*marker-end="url\(#gArr\)"/g, ax = re.exec(svg), ay = re.exec(svg);
    var xr = g.x, yr = g.y, x0 = +ax[1], x1 = +ax[3] - 8, y0 = +ay[2], y1 = +ay[4] + 8;
    return { X: function (x) { return x0 + (x - xr[0]) * (x1 - x0) / (xr[1] - xr[0]); }, Y: function (y) { return y0 + (y - yr[0]) * (y1 - y0) / (yr[1] - yr[0]); },
      ax0: Math.max(xr[0], Math.min(xr[1], 0)), ay0: Math.max(yr[0], Math.min(yr[1], 0)) };
  }
  function fig(g) {
    var svg = HW.graph(g), G = geo(g, svg), s = '', fs = g.tickSize || 11;
    (g.xt || []).forEach(function (p) { var x = G.X(p[0]), y = G.Y(G.ay0); s += '<line x1="' + x + '" y1="' + (y - 3) + '" x2="' + x + '" y2="' + (y + 3) + '" stroke="' + INK + '" stroke-width="1.2"/><text x="' + x + '" y="' + (y + 14) + '" font-size="' + fs + '" text-anchor="middle" fill="#4a5262">' + esc(p[1]) + '</text>'; });
    (g.yt || []).forEach(function (p) { var x = G.X(G.ax0), y = G.Y(p[0]); s += '<line x1="' + (x - 3) + '" y1="' + y + '" x2="' + (x + 3) + '" y2="' + y + '" stroke="' + INK + '" stroke-width="1.2"/><text x="' + (x - 5) + '" y="' + (y + 4) + '" font-size="' + fs + '" text-anchor="end" fill="#4a5262">' + esc(p[1]) + '</text>'; });
    (g.notes || []).forEach(function (n) {
      var x = G.X(n.x) + (n.dx || 0), y = G.Y(n.y) + (n.dy || 0), c = n.color || INK;
      s += '<text x="' + x + '" y="' + y + '" font-size="' + (n.size || 12) + '"' + (n.bold ? ' font-weight="700"' : '') + ' text-anchor="' + (n.anchor || 'middle') + '" fill="' + c + '">' + esc(n.text) + '</text>';
    });
    return s ? svg.replace('</svg>', s + '</svg>') : svg;
  }
  /* an unscaled sketch on x 0–10, y 0–6 (shape only) */
  function sk(sh, o) {
    o = o || {};
    return fig({ x: [0, o.X || 10], y: [o.Y0 || 0, o.Y || 6], grid: 0, labels: 0, firstQuadrant: !o.Y0, xName: o.xn || ' ', yName: o.yn || ' ', unit: o.unit || 14,
      yTitle: o.yTitle, xTitle: o.xTitle, segs: sh.segs, fns: sh.fns, points: sh.points, notes: (sh.notes || []).concat(o.notes || []), max: o.max || 190, aria: o.aria || 'sketch of a graph' });
  }
  function Ln(pts, o) { return Object.assign({ pts: pts }, o || {}); }
  function Fn(f, a, b, o) { return Object.assign({ f: f, from: a, to: b }, o || {}); }
  /* shape library (x from about 0.3 to 9.6) */
  var SH = {
    up: function () { return { segs: [Ln([[0.3, 0.6], [9.6, 5.3]])] }; },
    down: function () { return { segs: [Ln([[0.3, 5.3], [9.6, 0.6]])] }; },
    flat: function (y) { return { segs: [Ln([[0.3, y || 3], [9.6, y || 3]])] }; },
    upSlow: function () { return { fns: [Fn(function (x) { return 0.6 + 4.9 * (1 - Math.exp(-0.38 * (x - 0.3))); }, 0.3, 9.6)] }; },
    upFast: function () { return { fns: [Fn(function (x) { return 0.6 + 0.054 * (x - 0.3) * (x - 0.3); }, 0.3, 9.6)] }; },
    downSlow: function (floor) { var f0 = floor == null ? 1.3 : floor; return { fns: [Fn(function (x) { return f0 + (5.3 - f0) * Math.exp(-0.42 * (x - 0.3)); }, 0.3, 9.6)] }; },
    downFast: function () { return { fns: [Fn(function (x) { return 5.3 - 0.054 * (x - 0.3) * (x - 0.3); }, 0.3, 9.6)] }; },
    poly: function (pts) { return { segs: [Ln(pts)] }; }
  };
  function mcG(r, prompt, opts, sol, hints, text, keep) { return B.mc(r, prompt, opts, sol, hints, text, keep); }
  /* a typed number with diagnoses: cands = [{ v, code, hint }] (skipped when equal to the answer) */
  function numDiag(ans, cands, extra) {
    return function (v) {
      for (var i = 0; i < cands.length; i++) { var c = cands[i]; if (c.v != null && isFinite(c.v) && !near(c.v, ans) && near(v, c.v)) return { code: c.code, hint: c.hint }; }
      return extra ? extra(v) : null;
    };
  }
  function numPart(prompt, ans, cands, sol, hints, text, inp) {
    var p = B.number(prompt, ans, numDiag(ans, cands), sol, hints, text, inp);
    p.answer = t(dn(ans) + (inp && inp.after ? units(inp.after) : ''));
    p.key = dn(ans);
    p.bad = cands.filter(function (c) { return c.v != null && isFinite(c.v) && !near(c.v, ans); }).map(function (c) { return dn(c.v); });
    return p;
  }
  function box(label, after) { return { label: label, name: label.replace(/:$/, ''), after: after }; }
  /* a rate that may be non-terminating: exact (fraction) or rounded to one decimal place */
  function rateChk(ans, cands) {
    var base = K.value(ans, { diag: numDiag(ans, cands || []) });
    return function (resp) {
      var r = base(resp); if (r.v === 'correct') return r;
      var p = HW.parse.number(String(resp)); if (!p.ok) return r;
      var r1 = Math.round(ans * 10) / 10;
      if (near(p.value, r1)) return ok();
      if (Math.abs(p.value - ans) < 0.051) return form('u5l11-round', 'Round the rate to one decimal place (or give it as an exact fraction).');
      return r;
    };
  }
  /* rate-of-change diagnoses */
  function rateCands(dy, dx, ans) {
    return [{ v: dx / dy, code: 'rate-flip', hint: 'Rate of change is <b>change in the vertical quantity ÷ change in time</b> — your division is upside down.' },
      { v: -ans, code: 'rate-sign', hint: ans < 0 ? 'Check the sign: the quantity is going <b>down</b> on this segment, so its rate of change is negative.' : 'Check the sign: the quantity is going <b>up</b>, so its rate of change is positive.' }];
  }

  /* ---------- story sketches (graph pad, js/draw.js) ---------- */
  function spad(o) {
    return Object.assign({ x: [0, 12], y: [0, 8], grid: 1, labels: 0, firstQuadrant: true, xName: ' ', yName: ' ', unitX: 25, unitY: 25, defaultEnd: 'none', tools: ['line'], max: 360,
      help: 'Tap where the graph starts, then each corner in turn, left to right; tap the last point again to finish. For a curve, use several short pieces.' }, o || {});
  }
  function poly(pts) { return { pts: [], pieces: [{ v: pts, s: 'none', e: 'none' }], join: 'none' }; }
  function groupsOf(value) {
    var g = [];
    DR.phases(value).phases.forEach(function (p) { var L = g[g.length - 1]; if (L && L.dir === p.dir) { L.segs.push(p); L.x1 = p.x1; L.y1 = p.y1; } else g.push({ dir: p.dir, segs: [p], x0: p.x0, x1: p.x1, y0: p.y0, y1: p.y1 }); });
    return g;
  }
  function simple(G) { var v = [[G[0].x0, G[0].y0]]; G.forEach(function (g) { v.push([g.x1, g.y1]); }); return poly(v); }
  function bendOk(g, kind) {
    var m = g.segs.map(function (s) { return Math.abs(s.m); }), i;
    if (kind === 'straight') return m.length === 1;
    if (kind === 'steeper' || kind === 'gentler') { if (m.length < 2) return false; for (i = 1; i < m.length; i++) if (kind === 'steeper' ? !(m[i] > m[i - 1] + 1e-9) : !(m[i] < m[i - 1] - 1e-9)) return false; return true; }
    return true;
  }
  var BENDH = { straight: 'This stage happens at a steady rate, so draw it as <b>one straight piece</b>.', steeper: 'This stage should <b>curve, getting steeper and steeper</b>: draw it as a few short pieces, each steeper than the one before.',
    gentler: 'This stage should <b>curve, getting flatter and flatter</b>: steep at first, then a few short pieces, each less steep than the one before.' };
  function story(spec) {
    var base = K.graphStory(spec);
    return function (resp) {
      if (DR.empty(resp)) return base(resp);
      var ph = DR.phases(resp);
      if (ph.vertical || ph.gaps.length || DR.notFunction(resp)) return base(resp);
      if (!ph.phases.length) return wrong('story-lines', 'Draw the graph as a line: tap where it starts, then each corner in turn, and tap the last point again to finish.');
      var G = groupsOf(resp);
      if (spec.prep) { var pr = spec.prep(G); if (pr && pr.hint) return wrong(pr.code || 'story', pr.hint); if (pr) G = pr; }
      var r = base(simple(G)); if (r.v !== 'correct') return r;
      for (var i = 0; i < spec.phases.length; i++) { var b = spec.phases[i].bend; if (b && !bendOk(G[i], b)) return wrong('story-bend', spec.phases[i].bendHint || BENDH[b]); }
      if (spec.after) { var h = spec.after(G, DR.norm(resp)); if (h) return wrong(h.code || 'story', h.hint); }
      return ok();
    };
  }
  function trimFlat(lead, trail, test) {
    return function (G) {
      G = G.slice(); test = test || function () { return true; };
      if (trail && G.length > 1 && G[G.length - 1].dir === 'flat' && test(G[G.length - 1])) G.pop();
      if (lead && G.length > 1 && G[0].dir === 'flat' && test(G[0])) G.shift();
      return G;
    };
  }
  function storyPart(prompt, inp, check, key, sol, hints, text, bad) {
    var p = B.graph(prompt, inp, check, key, sol, hints, text);
    p.answer = 'One possible sketch:' + p.answer; p.bad = bad || []; return p;
  }
  function decayStory(text, bendHint, zeroHint) {
    return story({ phases: [{ dir: 'down', text: text, bend: 'gentler', bendHint: bendHint }], prep: trimFlat(false, true),
      after: function (G) { return G[G.length - 1].y1 <= 1e-9 ? { code: 'story-zero', hint: zeroHint } : null; } });
  }
  var atZero = function (g) { return near(g.y0, 0) && near(g.y1, 0); };

  /* ---------- Q1: rain barrel ---------- */
  function barrel(r) {
    if (r.chance(0.2)) return { P: [[0, 5], [2, 5], [4, 25], [7, 25], [9, 10]], rt: 10, flat: 5, T: 9, what: ['rain barrel', 'it is raining and the barrel is filling', 'water is being used (or leaking) out of the barrel', 'no rain falls and no water is taken out'] };
    for (var k = 0; k < 400; k++) {
      var a = pick(r, [5, 5, 0, 10, 15]), x1 = pick(r, [2, 2, 1, 3]), d = pick(r, [2, 2, 3, 4, 1]), rt = pick(r, [10, 10, 5, 6, 8, 12, 15]), b = a + rt * d;
      var hold = pick(r, [3, 3, 2, 4]), e = pick(r, [2, 2, 1, 3]), drop = pick(r, [15, 15, 10, 5, 20, 12, 9]), c = b - drop;
      if (b > 40 || c < 0 || c >= b || x1 + d + hold + e > 11) continue;
      var P = [[0, a], [x1, a], [x1 + d, b], [x1 + d + hold, b], [x1 + d + hold + e, c]];
      return { P: P, rt: rt, flat: x1 + hold, T: P[4][0], what: pick(r, [['rain barrel', 'it is raining and the barrel is filling', 'water is being used (or leaking) out of the barrel', 'no rain falls and no water is taken out'],
        ['rain barrel', 'it is raining and the barrel is filling', 'water is being used (or leaking) out of the barrel', 'no rain falls and no water is taken out'],
        ['garden pond', 'rain (or a hose) is filling the pond', 'water is being pumped (or evaporating) out of the pond', 'no water is added or removed'],
        ['water trough on a farm', 'the trough is being filled', 'the animals are drinking the water down', 'no water is added or used']]) };
    }
    return { P: [[0, 5], [2, 5], [4, 25], [7, 25], [9, 10]], rt: 10, flat: 5, T: 9, what: ['rain barrel', 'it is raining and the barrel is filling', 'water is being used (or leaking) out of the barrel', 'no rain falls and no water is taken out'] };
  }
  function barrelFig(s) {
    var ym = Math.ceil((Math.max.apply(null, s.P.map(function (p) { return p[1]; })) + 5) / 5) * 5;
    return '<div class="fig">' + fig({ x: [0, s.T + 1], y: [0, ym], grid: 1, gridY: 5, labelsX: 1, labelsY: 5, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time (days)', yTitle: 'Water (L)', unitX: 300 / (s.T + 1), unitY: 200 / ym, max: 360,
      segs: [{ pts: s.P }], points: s.P.map(function (p, i) { return { x: p[0], y: p[1], label: 'PQRST'.charAt(i) }; }), aria: 'graph of the water in the ' + s.what[0] }) + '</div>';
  }

  /* ---------- Q2: speed stories and shapes ---------- */
  var SPD = {
    upFlat0: { s: SH.poly([[0.3, 0], [4, 4.6], [9.6, 4.6]]), d: 'starts at 0, rises in a straight line, then goes flat' },
    flatUp: { s: SH.poly([[0.3, 3], [5, 3], [9.6, 5.4]]), d: 'starts already moving, stays flat, then rises' },
    downFlat: { s: SH.poly([[0.3, 5.2], [5, 1.2], [9.6, 1.2]]), d: 'falls, then goes flat at a lower speed' },
    flat: { s: SH.flat(1.2), d: 'stays flat the whole time — the speed never changes' },
    flatDown0: { s: SH.poly([[0.3, 4.4], [5, 4.4], [9.4, 0]]), d: 'stays flat, then falls to 0' }
  };
  var SPD_STORY = [['speeds up steadily from a complete stop, and then travels at a constant speed', 'upFlat0'], ['travels at a constant speed, and then slows down steadily until it stops', 'flatDown0'],
    ['travels at a constant speed, and then speeds up steadily', 'flatUp'], ['slows down steadily, and then travels at a constant, slower speed', 'downFlat'], ['travels at the same constant speed the whole time', 'flat']];

  /* ---------- Q11: hiking trail ---------- */
  function trail(r) {
    if (r.chance(0.2)) return { V: [[0, 200], [3, 500], [5, 500], [8, 50]], x1: 3, fl: 2, dl: 3, rise: 300, drop: 450, rAB: 100, rCD: -150 };
    for (var k = 0; k < 400; k++) {
      var e0 = pick(r, [200, 200, 100, 150, 250, 300]), x1 = pick(r, [3, 3, 2, 4]), rise = pick(r, [300, 300, 200, 400, 240]), fl = pick(r, [2, 2, 1, 3]), dl = pick(r, [3, 3, 2, 4]), drop = pick(r, [450, 450, 350, 250, 300, 400, 500]);
      var e1 = e0 + rise, e3 = e1 - drop; if (e3 < 0 || e3 === e0) continue;
      if (Math.abs(rise / x1 - drop / dl) < 1 || rise % x1 || drop % dl) continue; // whole-number rates, like the booklet's −150 m/km
      return { V: [[0, e0], [x1, e1], [x1 + fl, e1], [x1 + fl + dl, e3]], x1: x1, fl: fl, dl: dl, rise: rise, drop: drop, rAB: rise / x1, rCD: -drop / dl };
    }
  }

  /* ---------- Extra 1: delivery van ---------- */
  function van(r) {
    if (r.chance(0.2)) return { V: [[0, 0], [12, 9], [20, 9], [30, 24], [38, 24], [62, 0]], r1: 0.75, r2: 1.5, r3: 1, s1: 8, s2: 8, d1: 9, d2: 24, dt: 10, kmh: 90 };
    for (var k = 0; k < 2000; k++) {
      var t1 = pick(r, [12, 12, 8, 10, 16]), r1 = pick(r, [0.75, 0.75, 0.5, 1]), s1 = pick(r, [8, 8, 6, 10]), dt = pick(r, [10, 10, 8, 12]), r2 = pick(r, [1.5, 1.5, 1.25, 1.75, 2]), s2 = pick(r, [8, 8, 6, 10]), r3 = pick(r, [1, 1, 0.75, 1.25]);
      var d1 = r1 * t1, d2 = d1 + r2 * dt, back = d2 / r3;
      if (d1 % 1 || d2 % 1 || back % 1 || d2 > 32 || r3 >= r2 || r1 >= r2) continue;
      var A = [0, 0], Bp = [t1, d1], Cp = [t1 + s1, d1], Dp = [t1 + s1 + dt, d2], Ep = [t1 + s1 + dt + s2, d2], Fp = [t1 + s1 + dt + s2 + back, 0];
      return { V: [A, Bp, Cp, Dp, Ep, Fp], r1: r1, r2: r2, r3: r3, s1: s1, s2: s2, d1: d1, d2: d2, dt: dt, kmh: r2 * 60 };
    }
  }

  /* Q5: stories whose graph is a curve; each returns [shape, story, vertical-axis title] */
  var CURVE_STORIES = [
    function (r) { return ['upSlow', 'The temperature inside ' + pick(r, ['a car', 'a van', 'a tent', 'a pickup truck']) + ' parked in the sun on a hot day rises quickly at first, then rises more and more slowly as it gets very hot, levelling off.', 'Temp.']; },
    function (r) { return ['upSlow', 'The temperature inside ' + pick(r, ['a car', 'a van', 'a tent', 'a pickup truck']) + ' parked in the sun on a hot day rises quickly at first, then rises more and more slowly as it gets very hot, levelling off.', 'Temp.']; },
    function (r) { return ['upSlow', 'A pot of ' + pick(r, ['soup', 'water', 'stew', 'pasta water']) + ' is put on the stove: its temperature climbs quickly at first, then more and more slowly as it nears boiling.', 'Temp.']; },
    function (r) { return ['upSlow', 'A new ' + pick(r, ['phone game', 'music app', 'video series']) + ' gains many fans in its first days, then fewer and fewer new fans each day.', 'Fans']; },
    function (r) { return ['downSlow', 'A ' + pick(r, ['glass of hot tea', 'mug of coffee', 'bowl of soup', 'cup of cocoa']) + ' cools quickly at first, then more and more slowly as it nears room temperature.', 'Temp.']; },
    function (r) { return ['downSlow', 'Air leaks out of a punctured ' + pick(r, ['bike tire', 'air mattress', 'beach ball', 'car tire']) + ' quickly at first, then more and more slowly.', 'Pressure']; },
    function (r) { return ['upFast', 'A snowball rolling down a ' + pick(r, ['long', 'steep', 'snowy']) + ' hill grows slowly at first, then faster and faster as it gets bigger.', 'Size']; },
    function (r) { return ['downFast', 'A melting ' + pick(r, ['ice sculpture', 'snowman', 'ice block']) + ' loses a little height at first, then more and more each hour as the day warms up.', 'Height']; }];

  HW.defineLesson({
    id: 'u5l11', unit: 5, num: '11', title: 'Interpreting and Sketching Real-World Graphs', outcome: 'RF1',
    blurb: 'Reading the story in a graph (increasing, decreasing, constant, steep or gradual), matching stories to graphs, and sketching graphs from stories.',
    questions: [
      /* ---------------- Q1 ---------------- */
      { num: '1', section: 'Part A — Reading and interpreting graphs', shared: barrel,
        stem: function (s) { return 'The graph shows the amount of water in a ' + s.what[0] + ', in litres, over a ' + t(s.T) + '-day period, made of four line segments meeting at ' + t('P, Q, R, S, T') + '.' + barrelFig(s); }, parts: [
        { id: '1a', level: 'BEG', make: function (r, s) {
          var rows = [{ id: 'pq', html: '(i) ' + t('P') + ' to ' + t('Q') }, { id: 'qr', html: '(ii) ' + t('Q') + ' to ' + t('R') }, { id: 'st', html: '(iii) ' + t('S') + ' to ' + t('T') }];
          var cols = [{ id: 'flat', html: 'Constant: ' + s.what[3] }, { id: 'up', html: 'Increasing: ' + s.what[1] }, { id: 'down', html: 'Decreasing: ' + s.what[2] }];
          var P = s.P;
          return B.grid('(a) What is happening during each interval?', rows, cols, { pq: 'flat', qr: 'up', st: 'down' }, { why: function (row, got) {
              if (got === 'up' || got === 'down') return { code: 'row', hint: 'Read the segment left to right: does the amount of water go up, go down, or stay the same?' };
              return { code: 'row', hint: 'A flat segment means the amount is <b>not changing</b> — it does not mean going backwards or emptying.' };
            } },
            '(i) ' + t('P') + ' to ' + t('Q') + ' (days ' + P[0][0] + '–' + P[1][0] + '): flat at ' + t(P[0][1]) + ' L — ' + s.what[3] + '.<br>(ii) ' + t('Q') + ' to ' + t('R') + ' (days ' + P[1][0] + '–' + P[2][0] + '): rises from ' + t(P[1][1]) + ' L to ' + t(P[2][1]) + ' L — ' + s.what[1] + '.<br>(iii) ' + t('S') + ' to ' + t('T') + ' (days ' + P[3][0] + '–' + P[4][0] + '): falls from ' + t(P[3][1]) + ' L to ' + t(P[4][1]) + ' L — ' + s.what[2] + '.',
            ['Read each segment from left to right: rising, falling, or flat?'], 'barrel intervals');
        } },
        { id: '1b', level: 'EMG', make: function (r, s) {
          var Q = s.P[1], R = s.P[2], dy = R[1] - Q[1], dx = R[0] - Q[0];
          return numPart('(b) Determine the rate of change, in litres per day, from ' + t('Q') + ' to ' + t('R') + '.', s.rt, rateCands(dy, dx, s.rt).concat([{ v: R[1] / R[0], code: 'u5l11-rate-days', hint: 'Use the <b>change</b> from ' + t('Q') + ' to ' + t('R') + ': subtract both coordinates, ' + t('\\frac{' + R[1] + '-' + Q[1] + '}{' + R[0] + '-' + Q[0] + '}') + '.' }, { v: dy, code: 'value', hint: 'That is the change in water. Divide by the number of days it took.' }]),
            t('Q=' + ptT(Q)) + ', ' + t('R=' + ptT(R)) + ':<br>rate ' + t('=\\dfrac{' + R[1] + '-' + Q[1] + '}{' + R[0] + '-' + Q[0] + '}=\\dfrac{' + dy + '}{' + dx + '}=' + s.rt) + ' litres per day', ['Rate of change = change in water ÷ change in time.'], 'barrel rate', { after: 'L/day' });
        } },
        { id: '1c', level: 'EMG', make: function (r, s) {
          var P = s.P, f1 = P[1][0] - P[0][0], f2 = P[3][0] - P[2][0];
          return numPart('(c) For how many days, in total, was the amount of water constant?', f1 + f2, [{ v: f1, code: 'u5l11-one-flat', hint: 'There are <b>two</b> flat segments. Add both.' }, { v: f2, code: 'u5l11-one-flat', hint: 'There are <b>two</b> flat segments. Add both.' }, { v: P[3][0], code: 'flat-time', hint: 'Count only the days on the flat segments.' }],
            'The flat parts are ' + t('P') + '–' + t('Q') + ' and ' + t('R') + '–' + t('S') + ': ' + t('(' + P[1][0] + '-' + P[0][0] + ')+(' + P[3][0] + '-' + P[2][0] + ')=' + f1 + '+' + f2 + '=' + (f1 + f2)) + ' days.', ['Find every flat segment and add their lengths in days.'], 'barrel flat days', { after: 'days' });
        } }] },
      /* ---------------- Q2 ---------------- */
      { num: '2', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '2', level: 'BEG', make: function (r) {
          var st = pick(r, SPD_STORY), who = pick(r, ['a car', 'a car', 'a city bus', 'a cyclist', 'a train', 'a delivery truck']);
          var others = r.shuffle(Object.keys(SPD).filter(function (k) { return k !== st[1]; })).slice(0, 3);
          var opts = [st[1]].concat(others).map(function (k) { return { html: sk(SPD[k].s, { xTitle: 'Time', yTitle: 'Speed', max: 170 }), right: k === st[1], code: k, why: k === st[1] ? null : 'This graph ' + SPD[k].d + '. Read the story again, one phase at a time.' }; });
          return mcG(r, 'Which graph shows ' + who + ' that ' + st[0] + '?', opts,
            'Split the story into phases: “' + st[0] + '”. The matching graph ' + SPD[st[1]].d + '. (A speed of ' + t('0') + ' means stopped; flat means constant speed; rising means speeding up.)', ['On a speed graph: a stop is speed ' + t('0') + ', constant speed is flat, speeding up is rising.'], 'speed story ' + st[1]);
        } }] },
      /* ---------------- Q3 ---------------- */
      { num: '3', shared: function (r) {
          var c = pick(r, [['upFast', 'the value of a rare coin collection', 'Value', 'increasing'], ['upFast', 'the value of a rare coin collection', 'Value', 'increasing'], ['upFast', 'the number of members of a new online club', 'Members', 'increasing'],
            ['upSlow', 'the height of a young tree', 'Height', 'increasing'], ['upSlow', 'the number of songs a child knows by heart', 'Songs', 'increasing'], ['downSlow', 'the value of a used car', 'Value', 'decreasing'],
            ['downSlow', 'the number of fish left in a stocked pond as people fish it', 'Fish', 'decreasing'], ['downFast', 'the amount of ice left on a pond in spring', 'Ice', 'decreasing']]);
          return { k: c[0], what: c[1], y: c[2], dir: c[3], yrs: pick(r, [6, 6, 5, 8, 10]) };
        }, stem: function (s) { return 'The graph shows ' + s.what + ' over ' + t(s.yrs) + ' years (no scale on the axes).' + sk(SH[s.k](), { xTitle: 'Years', yTitle: s.y, max: 260, unit: 20 }); }, parts: [
        { id: '3a', level: 'BEG', make: function (r, s) {
          return mcG(r, '(a) Over the ' + t(s.yrs) + ' years shown, is ' + s.what + ' increasing, decreasing, or constant?', [
            { html: 'Increasing', right: s.dir === 'increasing', why: 'Read the graph from left to right: does it go up?' }, { html: 'Decreasing', right: s.dir === 'decreasing', why: 'Read the graph from left to right: does it go down?' },
            { html: 'Constant', why: 'Constant would be a flat graph.' }, { html: 'Increasing, then decreasing', why: 'The graph never turns around.' }],
            '<b>' + s.dir.charAt(0).toUpperCase() + s.dir.slice(1) + '</b> — the curve ' + (s.dir === 'increasing' ? 'rises' : 'falls') + ' the whole way from left to right.', ['Follow the graph from left to right.'], 'direction of a curve', true);
        } },
        { id: '3b', level: 'EMG', make: function (r, s) {
          var bigger = s.k === 'upFast' || s.k === 'downFast', ch = s.dir === 'increasing' ? 'increases' : 'decreases';
          return mcG(r, '(b) Are the yearly ' + ch + ' getting bigger or smaller as time passes? How can you tell from the graph?', [
            { html: '<b>Bigger</b> — the graph gets <b>steeper</b>, and steepness is the rate of change.', right: bigger, why: 'Look at the steepness at the start and at the end. Is the curve getting steeper or flatter?' },
            { html: '<b>Smaller</b> — the graph gets <b>flatter</b>, and steepness is the rate of change.', right: !bigger, why: 'Look at the steepness at the start and at the end. Is the curve getting steeper or flatter?' },
            { html: '<b>Bigger</b> — the graph is ' + (s.dir === 'increasing' ? 'higher' : 'lower') + ' at the end.', why: 'Height shows the amount, not how fast it changes. Compare the <b>steepness</b>.' },
            { html: '<b>The same</b> — the graph is one smooth line.', why: 'Equal yearly changes would be a <b>straight</b> line. This one curves.' }],
            '<b>' + (bigger ? 'Bigger' : 'Smaller') + '.</b> The curve ' + (bigger ? 'starts out almost flat and gets steeper and steeper' : 'starts out steep and gets flatter and flatter') + '. Steepness is the rate of change, so each year the amount ' + ch + ' by ' + (bigger ? 'more' : 'less') + ' than the year before.',
            ['Steep = changing fast; gradual = changing slowly.'], 'steepness of a curve ' + s.k);
        } }] },
      /* ---------------- Q4 ---------------- */
      { num: '4', section: 'Part B — Matching a story to a graph', stem: '', parts: [
        { id: '4', level: 'EMG', make: function (r) {
          var nm = pick(r, [['Ravi', 'bikes', 'the park', 'fix his bike chain', 'his'], ['Ravi', 'bikes', 'the park', 'fix his bike chain', 'his'], ['Maya', 'skates', 'the rink', 'tie her skate', 'her'], ['Owen', 'walks', 'school', 'talk to a friend', 'his'], ['Lena', 'rides her scooter', 'the library', 'let a train pass', 'her'],
            ['Tariq', 'jogs', 'the track', 'tie his shoe', 'his'], ['Zoe', 'cycles', 'the beach', 'pump up a tire', 'her'], ['Mateo', 'skateboards', 'the mall', 'answer a phone call', 'his'], ['Hana', 'walks', 'her friend’s house', 'pet a dog', 'her']]);
          var rel = pick(r, ['same', 'same', 'faster', 'slower']);
          var G = { same: [[0.3, 0.6], [4, 3.2], [6, 3.2], [9.7, 5.8]], faster: [[0.3, 0.6], [4, 3.2], [6, 3.2], [8.2, 5.8]], slower: [[0.3, 0.6], [4, 3.2], [6, 3.2], [9.7, 4.6]], nostop: [[0.3, 0.6], [9.7, 5.8]], late: [[0.3, 0.6], [3, 0.6], [6.5, 4.2], [9.7, 4.2]] };
          var txt = { same: 'at the <b>same</b> speed as before', faster: '<b>faster</b> than before', slower: '<b>more slowly</b> than before' };
          var why = { same: 'Here the first and last segments are equally steep: the same speed before and after the stop.', faster: 'Here the last segment is <b>steeper</b>, so the speed after the stop is greater.', slower: 'Here the last segment is <b>less steep</b>, so the speed after the stop is smaller.', nostop: 'This graph has no flat segment — there is no stop at all.', late: 'This graph waits at home first and stops at the end; the story stops partway there.' };
          var keys = [rel].concat(r.shuffle(['same', 'faster', 'slower'].filter(function (k) { return k !== rel; })).slice(0, 1)).concat(['nostop', 'late']);
          var opts = keys.map(function (k) { return { html: sk(SH.poly(G[k]), { xTitle: 'Time', yTitle: 'Distance', max: 170 }), right: k === rel, code: k, why: k === rel ? null : why[k] }; });
          return mcG(r, '<b>Story:</b> ' + nm[0] + ' ' + nm[1] + ' to ' + nm[2] + ' at a steady pace. Partway there, ' + (nm[4] === 'her' ? 'she' : 'he') + ' stops completely to ' + nm[3] + '. Then ' + (nm[4] === 'her' ? 'she' : 'he') + ' continues the rest of the way ' + txt[rel] + '. Each graph shows ' + nm[0] + '’s distance from home versus time. Which one matches the story?', opts,
            nm[0] + ' moves, stops, then moves again ' + txt[rel] + ' — so the graph rises, has a flat segment, then rises again' + (rel === 'same' ? ' with the <b>same steepness</b> as the first segment.' : rel === 'faster' ? ', <b>steeper</b> than the first segment.' : ', <b>less steep</b> than the first segment.'),
            ['A stop is a flat segment. Faster means steeper.'], 'story match ' + rel);
        } }] },
      /* ---------------- Q5 ---------------- */
      { num: '5', stem: '', parts: [
        { id: '5', level: 'EMG', make: function (r) {
          var c = pick(r, CURVE_STORIES)(r);
          var up = c[0].indexOf('up') === 0, set = up ? ['up', 'upSlow', 'upFast', 'down'] : ['down', 'downSlow', 'downFast', 'up'];
          var D = { up: 'rises at a constant rate (a straight line)', down: 'falls at a constant rate (a straight line)', upSlow: 'rises quickly at first, then more and more slowly', upFast: 'rises slowly at first, then faster and faster', downSlow: 'falls quickly at first, then more and more slowly', downFast: 'falls slowly at first, then faster and faster' };
          var opts = set.map(function (k) { return { html: sk(SH[k](), { xTitle: 'Time', yTitle: c[2], max: 170 }), right: k === c[0], code: k, why: k === c[0] ? null : 'This graph ' + D[k] + '.' }; });
          return mcG(r, '<b>Story:</b> ' + c[1] + ' Which graph matches the story?', opts,
            'The story ' + D[c[0]] + ': a curve that is ' + (c[0] === 'upSlow' || c[0] === 'downSlow' ? 'steep at first and then flattens out' : 'gentle at first and then gets steeper') + '.', ['Is the change fastest at the start or at the end? Fast = steep.'], 'curve match ' + c[0]);
        } }] },
      /* ---------------- Q6 – Q9: sketches ---------------- */
      { num: '6', section: 'Part C — Sketching a graph from a story', stem: 'Sketch a graph with no scale for the situation. Only the <b>shape</b> matters.', parts: [
        { id: '6', level: 'BEG', make: function (r) {
          var c = pick(r, [function () { return ['The amount of gasoline in a lawnmower’s ' + pick(r, ['1.5', '2', '2.5', '3']) + ' L tank, as it is used at a steady rate while mowing, until the tank is completely empty and the mower stops.', 'Gasoline']; },
            function () { return ['The amount of gasoline in a lawnmower’s ' + pick(r, ['1.5', '2', '2.5', '3']) + ' L tank, as it is used at a steady rate while mowing, until the tank is completely empty and the mower stops.', 'Gasoline']; },
            function () { return ['The water in a ' + pick(r, ['150', '200', '250']) + ' L bathtub as it drains at a steady rate, from full until it is completely empty.', 'Water']; },
            function () { return ['The charge left in a phone battery, starting at ' + pick(r, ['100', '80', '60']) + '%, while a video plays and uses the charge at a steady rate until the phone shuts off.', 'Charge']; },
            function () { return ['The height of a ' + pick(r, ['15', '20', '25']) + ' cm candle burning at a steady rate, until it has burned all the way down.', 'Height']; },
            function () { return ['The money left on a $' + pick(r, ['25', '50', '100']) + ' gift card when the same amount is spent every day, until the card is empty.', 'Money left']; },
            function () { return ['The sand left in the top of a ' + pick(r, ['3', '5', '10']) + '-minute hourglass, falling through at a steady rate until the top is empty.', 'Sand']; },
            function () { return ['The fuel left in a generator that starts with ' + pick(r, ['5', '10', '20']) + ' L and runs at a steady rate until it runs out.', 'Fuel']; },
            function () { return ['The distance left to drive on a ' + pick(r, ['200', '300', '450']) + ' km trip at a constant speed, until you arrive.', 'Distance left']; }])();
          var chk = story({ phases: [{ dir: 'down', text: 'used up at a steady rate', bend: 'straight' }], prep: trimFlat(false, true, atZero),
            after: function (G) { var L = G[G.length - 1]; return L.y1 > 1e-9 ? { code: 'story-zero', hint: 'The story ends <b>completely empty</b>: the graph must come all the way down to the horizontal axis.' } : null; } });
          return storyPart(c[0], spad({ xTitle: 'Time', yTitle: c[1] }), chk, poly([[0, 7], [10, 0]]),
            '<b>One straight decreasing segment:</b> it starts at the full amount and falls at a constant rate to ' + t('0') + ', where it stops.', ['Does the amount go up or down? At a steady rate or not?', 'Where does it end?'], 'sketch steady decrease to 0',
            [poly([[0, 7], [10, 2]]), poly([[0, 0], [10, 7]]), poly([[0, 7], [3, 3], [6, 1], [10, 0]]), poly([[0, 7], [5, 7], [10, 0]])]);
        } }] },
      { num: '7', stem: 'Sketch a graph with no scale for the situation.', parts: [
        { id: '7', level: 'EMG', make: function (r) {
          var it = pick(r, ['a new laptop', 'a new laptop', 'a new phone', 'a new car', 'a new snowmobile', 'a new mountain bike', 'a new tablet', 'a new camera', 'a new gaming console']), yrs = pick(r, [4, 4, 3, 5, 6]);
          return storyPart('The resale value of ' + it + ' over its first ' + t(yrs) + ' years: it loses value quickly in the first year, then loses value more and more slowly each year after that, levelling off toward a low resale price.', spad({ xTitle: 'Time', yTitle: 'Value' }),
            decayStory('losing value', 'It loses value <b>fastest in the first year</b>, then more and more slowly: draw a curve that is steep at first and then flatter and flatter (a few short pieces, each less steep than the one before).',
              'It levels off at a low resale price — still worth something — so the curve stays <b>above</b> the axis.'),
            poly([[0, 7], [1, 4], [3, 2], [7, 1], [11, 1]]),
            '<b>A curve that drops steeply at first and then flattens out</b>, approaching a low resale value without reaching ' + t('0') + '.',
            ['When does it lose value fastest?', 'Draw a curve with a few short pieces: steep first, then flatter and flatter.'], 'sketch resale value',
            [poly([[0, 7], [9, 0]]), poly([[0, 7], [6, 6], [9, 4], [11, 3]]), poly([[0, 1], [4, 4], [11, 7]]), poly([[0, 7], [1, 4], [3, 2], [7, 0]]), poly([[0, 7], [10, 2]])]);
        } }] },
      { num: '8', stem: 'Sketch a graph with no scale for the situation.', parts: [
        { id: '8', level: 'EMG', make: function (r) {
          var pl = pick(r, ['a greenhouse', 'a greenhouse', 'a tent at a campsite', 'a parked car', 'a sunroom', 'a classroom with big windows', 'a barn']), day = pick(r, ['a sunny spring day', 'a sunny day', 'a hot summer day', 'a clear fall day']), pk = pick(r, ['in the mid-afternoon', 'in the mid-afternoon', 'at about 3 p.m.', 'at about 2 p.m.']);
          var chk = story({ phases: [{ dir: 'up', text: 'warming up' }, { dir: 'down', text: 'cooling again' }],
            prep: function (G) { if (G.length === 3 && G[1].dir === 'flat' && G[0].dir === 'up' && G[2].dir === 'down') return [G[0], G[2]]; return G; },
            after: function (G, v) {
              var g = groupsOf(v), x0 = g[0].x0, x1 = g[g.length - 1].x1, peak = (G[0].x1 + G[1].x0) / 2, f = (peak - x0) / (x1 - x0);
              if (f < 0.5 - 1e-9) return { code: 'story-peak', hint: 'Your peak comes too early. Sunrise is at the start and sunset at the end; the warmest time is <b>mid-afternoon</b>, well past the middle of the day.' };
              if (f > 0.9 + 1e-9) return { code: 'story-peak', hint: 'Your peak is at the very end. It is warmest in the mid-afternoon, and then it <b>cools</b> for a while before sunset.' };
              if (G[1].y1 < G[0].y0 - 1e-9) return { code: 'story-below', hint: 'It is <b>coolest at sunrise</b>: the graph should not end lower than it started.' };
              return null;
            } });
          return storyPart('The temperature inside ' + pl + ' from sunrise to sunset on ' + day + ': it is coolest at sunrise, warms steadily to a peak ' + pk + ', then cools again toward sunset.', spad({ xTitle: 'Time', yTitle: 'Temperature' }), chk,
            poly([[0, 1], [4, 3], [7, 6], [9, 5], [11, 3]]),
            '<b>Up, then down:</b> from a low point at sunrise up to a single peak ' + pk + ' (past the middle of the day), then down toward sunset — one rise and one fall, ending above the sunrise temperature.',
            ['When is it coolest? When is it warmest?', 'Sunrise is the start of the graph and sunset the end.'], 'sketch daytime temperature',
            [poly([[0, 6], [5, 1], [11, 5]]), poly([[0, 1], [11, 7]]), poly([[0, 1], [2, 6], [11, 2]]), poly([[0, 3], [8, 6], [11, 1]])]);
        } }] },
      { num: '9', stem: 'Sketch a graph with no scale for the situation.', parts: [
        { id: '9', level: 'PRG', make: function (r) {
          var c = pick(r, [function () { return 'Your speed while riding an elevator: you start at rest on the ground floor, speed up, travel at a constant speed for several floors, then slow down and come to a stop at floor ' + pick(r, [8, 10, 12, 15, 20, 25, 30]) + '.'; },
            function () { return 'Your speed while riding an elevator: you start at rest on the ground floor, speed up, travel at a constant speed for several floors, then slow down and come to a stop at floor ' + pick(r, [8, 10, 12, 15, 20, 25, 30]) + '.'; },
            function () { return 'The speed of a subway train from one station to the next, ' + pick(r, ['1', '1.5', '2']) + ' km away: it starts at rest, speeds up, travels at a constant speed, then slows down and stops at the next station.'; },
            function () { return 'The speed of a car between two stop signs ' + pick(r, ['300', '400', '500']) + ' m apart: it starts at rest, speeds up, drives at a constant speed, then slows down and stops at the next sign.'; },
            function () { return 'The speed of a ski-lift chair on a ' + pick(r, ['6', '8', '10']) + '-minute ride: it starts at rest, speeds up, moves at a constant speed, then slows down and stops at the top.'; },
            function () { return 'The speed of a city bus between two stops on route ' + pick(r, [4, 9, 12, 27]) + ': it starts at rest, speeds up, travels at a constant speed, then slows down and stops at the next stop.'; },
            function () { return 'The speed of a passenger train between two towns ' + pick(r, ['40', '60', '80']) + ' km apart: it starts at rest in the station, speeds up, travels at a constant speed, then slows down and stops at the next station.'; }])();
          c = [c, 'Speed'];
          var chk = story({ phases: [{ dir: 'up', text: 'speeding up' }, { dir: 'flat', text: 'constant speed' }, { dir: 'down', text: 'slowing down' }], start: 0, end: 0,
            startHint: 'At the start you are <b>at rest</b>: the speed is ' + t('0') + ', so the graph starts on the horizontal axis.', endHint: 'At the end you <b>come to a stop</b>: the speed is back to ' + t('0') + ', so the graph ends on the horizontal axis.',
            prep: trimFlat(true, true, atZero) });
          return storyPart(c[0], spad({ xTitle: 'Time', yTitle: c[1] }), chk, poly([[0, 0], [3, 6], [8, 6], [11, 0]]),
            '<b>Rise → flat → fall back to ' + t('0') + ':</b> speeding up, constant speed, slowing to a stop. It <b>starts</b> and <b>ends</b> on the axis, because the speed is ' + t('0') + ' both times.',
            ['What is the speed when you are at rest?', 'Constant speed is a flat segment.'], 'sketch up-flat-down speed',
            [poly([[0, 2], [3, 6], [8, 6], [11, 2]]), poly([[0, 0], [5, 6], [11, 0]]), poly([[0, 0], [3, 6], [8, 6]]), poly([[0, 6], [3, 0], [8, 0], [11, 6]])]);
        } }] },
      /* ---------------- Q10 ---------------- */
      { num: '10', section: 'Part D — Mixed practice', shared: function (r) {
          for (var k = 0; k < 60; k++) {
            var P = [[0, 0], [r.int(8, 14) / 10, r.int(16, 24) / 10], [r.int(28, 34) / 10, r.int(8, 14) / 10], [r.int(16, 21) / 10, r.int(28, 34) / 10], [r.int(42, 48) / 10, r.int(6, 10) / 10]];
            var A = P[2], Bq = P[3], Cq = P[4], dist = Math.abs((Cq[0] - Bq[0]) * (A[1] - Bq[1]) - (Cq[1] - Bq[1]) * (A[0] - Bq[0])) / Math.hypot(Cq[0] - Bq[0], Cq[1] - Bq[1]);
            if (dist >= 0.3) break;
          }
          var who = pick(r, [['his', 'the classroom door', 'he'], ['his', 'the classroom door', 'he'], ['her', 'her locker', 'she'], ['his', 'the gym doors', 'he'], ['her', 'the school entrance', 'she'], ['his', 'the bus stop', 'he']]);
          return { who: who, svg: fig({ x: [0, 6], y: [0, 4.6], grid: 0, labels: 0, firstQuadrant: true, unit: 44, xName: ' ', yName: ' ', xTitle: 'Time', yTitle: 'Distance from ' + who[1].replace(/^(the|his|her) /, ''), segs: [Ln(P)], max: 300 }) };
        }, stem: function (z) { return 'A student sketched the graph below to represent ' + z.who[0] + ' distance from ' + z.who[1] + ' during part of a school day.' + z.svg; }, parts: [
        { id: '10', level: 'PRG', outcome: 'RF2', make: function (r, z) {
          var pr = z.who[2];
          return mcG(r, 'Why can’t this graph correctly represent the distance from ' + z.who[1] + ' over time?', [
            { html: 'Part of the graph doubles back to the left (backwards in time), so one moment would have two or more different distances. It fails the vertical line test.', right: true },
            { html: 'The distance can’t go down.', why: 'It can — walking back toward ' + z.who[1] + ' makes the distance decrease. That part is fine.' },
            { html: pr.charAt(0).toUpperCase() + pr.slice(1) + ' can’t change direction that many times.', why: 'People change direction all the time. Look at the piece that goes to the <b>left</b>.' },
            { html: 'The graph doesn’t end back at ' + t('0') + '.', why: 'A trip doesn’t have to end where it started. Look for a piece where time would have to run backwards.' }],
            'The graph <b>doubles back to the left</b> — it moves backwards in time and crosses over itself. Then a single moment gives <b>two different distances</b>, which is impossible: at any instant ' + pr + ' is exactly one distance away. The sketch fails the <b>vertical line test</b>, so it is not even a function. Time only moves forward, so a distance–time graph must always travel left to right.',
            ['Draw vertical lines through the graph. Does each one cross it only once?'], 'impossible distance-time graph');
        } }] },
      /* ---------------- Q11 ---------------- */
      { num: '11', shared: trail, stem: function (s) { var V = s.V, L = 'ABCD'; return 'The graph of a hiking trail’s elevation versus horizontal distance is made of three line segments meeting at ' + V.map(function (p, i) { return t(L.charAt(i) + ptT(p)); }).join(', ') + ' (distance in km, elevation in m).'; }, parts: [
        { id: '11a', level: 'EMG', make: function (r, s) {
          var V = s.V, bc = [V[2][0] - V[1][0], 0, 0], cd = [V[3][0] - V[2][0], V[3][1] - V[2][1], s.rCD];
          var fl = [box('B to C, change in distance:', 'km'), box('B to C, change in elevation:', 'm'), box('B to C, rate:', 'm/km'), box('C to D, change in distance:', 'km'), box('C to D, change in elevation:', 'm'), box('C to D, rate:', 'm/km')];
          var tbl = '<table class="vtab" style="font-size:14px"><tr><th></th><th>' + t('A') + ' to ' + t('B') + '</th><th>' + t('B') + ' to ' + t('C') + '</th><th>' + t('C') + ' to ' + t('D') + '</th></tr><tr><th>Change in distance (km)</th><td>' + t(s.x1) + '</td><td>?</td><td>?</td></tr><tr><th>Change in elevation (m)</th><td>' + t(s.rise) + '</td><td>?</td><td>?</td></tr><tr><th>Rate (m/km)</th><td>' + t(dn(s.rAB)) + '</td><td>?</td><td>?</td></tr></table>';
          var cdTex = Number.isInteger(s.rCD) ? dn(s.rCD) : '\\approx ' + (Math.round(s.rCD * 10) / 10);
          var ch = [K.number(bc[0]), K.number(0), K.number(0), K.number(cd[0]), K.number(cd[1], function (u) { return near(u, -cd[1]) ? { code: 'rate-sign', hint: 'From ' + t('C') + ' to ' + t('D') + ' the trail goes <b>down</b>: the change in elevation is negative.' } : null; }),
            rateChk(s.rCD, rateCands(cd[1], cd[0], s.rCD))];
          var p = B.fields('(a) Complete the table.' + tbl, fl, ch, [String(bc[0]), '0', '0', String(cd[0]), String(cd[1]), dn(Math.round(s.rCD * 10) / 10)],
            t('B') + ' to ' + t('C') + ': ' + t(bc[0]) + ' km, ' + t('0') + ' m, ' + t('0') + ' m/km; ' + t('C') + ' to ' + t('D') + ': ' + t(cd[0]) + ' km, ' + t(cd[1]) + ' m, ' + t(cdTex) + ' m/km',
            t('B' + ptT(V[1]) + '\\to C' + ptT(V[2])) + ': distance ' + t(V[2][0] + '-' + V[1][0] + '=' + bc[0]) + ', elevation ' + t(V[2][1] + '-' + V[1][1] + '=0') + ', rate ' + t('\\frac{0}{' + bc[0] + '}=0') + '.<br>' + t('C' + ptT(V[2]) + '\\to D' + ptT(V[3])) + ': distance ' + t(V[3][0] + '-' + V[2][0] + '=' + cd[0]) + ', elevation ' + t(V[3][1] + '-' + V[2][1] + '=' + cd[1]) + ', rate ' + t('\\frac{' + cd[1] + '}{' + cd[0] + '}' + (Number.isInteger(s.rCD) ? '=' : '\\approx ') + dn(Math.round(s.rCD * 10) / 10)) + ' m/km.',
            ['Change = end value − start value. Rate = change in elevation ÷ change in distance.', 'Going downhill makes the change in elevation negative.'], 'trail table');
          p.bad = [[String(bc[0]), '0', '0', String(cd[0]), String(-cd[1]), dn(-Math.round(s.rCD * 10) / 10)]];
          return p;
        } },
        { id: '11b', level: 'PRG', make: function (r, s) {
          var cdSteep = Math.abs(s.rCD) > s.rAB, rc = Math.round(s.rCD * 10) / 10, rcT = Number.isInteger(s.rCD) ? dn(s.rCD) : '\\approx ' + rc;
          return mcG(r, '(b) Which segment is the steepest, and what does it represent on the trail?', [
            { html: t('C') + ' to ' + t('D') + ': the sharpest <b>descent</b> — the trail drops ' + t(s.drop) + ' m over ' + t(s.dl) + ' km (rate ' + t(rcT) + ' m/km).', right: cdSteep, why: 'Compare the <b>sizes</b> of the rates: ' + t(dn(s.rAB)) + ' and ' + t(rcT) + '. The bigger size is steeper.' },
            { html: t('A') + ' to ' + t('B') + ': the steepest <b>climb</b> — the trail rises ' + t(s.rise) + ' m over ' + t(s.x1) + ' km (rate ' + t(dn(s.rAB)) + ' m/km).', right: !cdSteep, why: 'Compare the <b>sizes</b> of the rates, ignoring the sign: ' + t(dn(s.rAB)) + ' and ' + t(rcT) + '. A negative rate can still be steep.' },
            { html: t('B') + ' to ' + t('C') + ': it is the highest part of the trail.', why: 'Height is not steepness. ' + t('B') + ' to ' + t('C') + ' has rate ' + t('0') + ' — it is <b>flat</b>.' },
            { html: (cdSteep ? t('A') + ' to ' + t('B') : t('C') + ' to ' + t('D')) + ': it covers the most distance.', why: 'Steepness is the rate of change (metres per km), not the length of the segment.' }],
            'Compare the sizes of the rates: ' + t(dn(s.rAB)) + ', ' + t('0') + ' and ' + t(rcT) + '. ' + (cdSteep ? '<b>' + t('C') + ' to ' + t('D') + ' is the steepest.</b> Its rate is negative, so it is the sharpest <b>descent</b>: the trail drops ' + t(s.drop) + ' m over the last ' + t(s.dl) + ' km.' : '<b>' + t('A') + ' to ' + t('B') + ' is the steepest:</b> the steepest <b>climb</b>, rising ' + t(s.rise) + ' m over ' + t(s.x1) + ' km.') + ' (' + t('B') + ' to ' + t('C') + ' is a flat stretch.)',
            ['Steepness is the size of the rate — a negative rate means going down, but it can still be steep.'], 'steepest trail segment');
        } }] },
      /* ---------------- Q12 – Q14: the bank of shapes ---------------- */
      { num: '12', stem: 'Use the bank of graph shapes: choose the shape that matches the situation. (A shape may be used once, more than once, or not at all.)', parts: [
        { id: '12', level: 'BEG', make: function (r) { return bankMC(r, 'B', pick(r, BANK.B)(r)); } }] },
      { num: '13', stem: 'Use the bank of graph shapes: choose the shape that matches the situation.', parts: [
        { id: '13', level: 'BEG', make: function (r) { return bankMC(r, 'D', pick(r, BANK.D)(r)); } }] },
      { num: '14', stem: 'Use the bank of graph shapes: choose the shape that matches the situation.', parts: [
        { id: '14', level: 'EMG', make: function (r) { return bankMC(r, 'E', pick(r, BANK.E)(r)); } }] }
    ],
    extra: EXTRA()
  });

  /* ---------- the Q12–14 bank ---------- */
  var BANKSH = { A: ['up', 'straight increasing'], B: ['down', 'straight decreasing'], C: ['flat', 'constant'], D: ['downSlow', 'decreasing, slowing'], E: ['upFast', 'increasing, speeding up'] };
  /* each bank story is built from a template with a few changing details (so every version reads a little differently) */
  function bk(f) { return f; }
  var BANK = {
    B: [bk(function (r) { return 'The distance remaining on a ' + pick(r, [200, 300, 400, 500, 600]) + ' km road trip, if you drive at a constant speed the whole way.'; }),
      bk(function (r) { return 'The height of a candle that burns down ' + pick(r, [1, 2, 3]) + ' cm every hour.'; }),
      bk(function (r) { var a = pick(r, [[50, 5], [40, 4], [60, 5], [30, 3]]); return 'The money left on a $' + a[0] + ' gift card if you spend $' + a[1] + ' every day.'; }),
      bk(function (r) { var a = pick(r, [[200, 10], [300, 15], [500, 25]]); return 'The water left in a ' + a[0] + ' L tank that drains at ' + a[1] + ' L per minute.'; }),
      bk(function (r) { return 'The number of pages left to read in a novel if you read ' + pick(r, [20, 25, 30, 40]) + ' pages every day.'; }),
      bk(function (r) { return 'The time left on a ' + pick(r, [30, 45, 60, 90]) + '-minute timer as it counts down.'; })],
    D: [bk(function (r) { return 'The speed of a hockey puck sliding across ' + pick(r, ['rough ice', 'rough ice', 'a bumpy outdoor rink', 'slushy ice']) + ' (slows quickly at first, then more and more gently as it comes to a stop).'; }),
      bk(function (r) { return 'The value of a new ' + pick(r, ['car', 'truck', 'phone', 'laptop']) + ' over ' + pick(r, [5, 8, 10]) + ' years (it loses value quickly at first, then more slowly).'; }),
      bk(function (r) { return 'The speed of a skydiver just after the parachute opens at ' + pick(r, [800, 1000, 1200]) + ' m (the speed drops quickly, then levels off).'; }),
      bk(function (r) { return 'The amount of medicine in a patient’s blood in the ' + pick(r, [6, 8, 12]) + ' hours after one dose (it drops quickly at first, then more and more slowly).'; }),
      bk(function (r) { return 'The temperature of a hot ' + pick(r, ['pan', 'iron', 'pizza stone']) + ' taken off the heat (it cools quickly, then levels off near room temperature).'; })],
    E: [bk(function (r) { return 'The number of views on a video in its first ' + pick(r, ['week', 'two weeks', 'month']) + ' online, which grows faster and faster each day as more people share it.'; }),
      bk(function (r) { return 'The number of bacteria in a dish, which doubles every ' + pick(r, ['hour', '30 minutes', '20 minutes']) + '.'; }),
      bk(function (r) { return 'The value of $' + pick(r, [500, 1000, 2000]) + ' in savings earning compound interest over ' + pick(r, [20, 30, 40]) + ' years.'; }),
      bk(function (r) { return 'The distance fallen by a stone dropped from a ' + pick(r, [40, 60, 80]) + ' m bridge (it falls faster and faster).'; }),
      bk(function (r) { return 'The area of a square as its side length increases from ' + t('0') + ' to ' + pick(r, [10, 20, 30]) + ' cm.'; }),
      bk(function (r) { return 'The number of people who have heard a rumour, spreading faster and faster through a school of ' + pick(r, [600, 800, 1200]) + ' students in its first hours.'; })]
  };
  function bankMC(r, right, story) {
    var why = { A: 'Shape A goes up in a straight line: the same increase every time.', B: 'Shape B goes down in a straight line: the same decrease every time.', C: 'Shape C is constant: nothing changes.', D: 'Shape D goes down, quickly at first and then more and more slowly.', E: 'Shape E goes up, slowly at first and then faster and faster.' };
    var opts = 'ABCDE'.split('').map(function (k) { return { html: '<span style="display:inline-block;vertical-align:middle">' + sk(SH[BANKSH[k][0]](), { max: 110, unit: 9 }) + '</span> <span>' + BANKSH[k][1] + '</span>', right: k === right, code: 'bank' + k, why: k === right ? null : why[k] + ' Does that fit the story?' }; });
    var p = mcG(r, story, opts, 'Shape <b>' + right + '</b> (' + BANKSH[right][1] + '). ' + { B: 'The amount goes down by the same amount each unit of time — a straight decreasing line.', D: 'The quantity decreases, but the drop slows down as time goes on — a falling curve that flattens.', E: 'The quantity increases and gets steeper: each unit adds more than the one before.' }[right],
      ['Does the quantity go up, go down, or stay the same? At a steady rate, speeding up, or slowing down?'], 'bank shape ' + right, true);
    return p;
  }

  /* ================= Extra practice ================= */
  function EXTRA() { return [
    /* ---------------- Extra 1: van ---------------- */
    { num: '1', section: 'Extra practice A — Reading a multi-segment story graph', shared: van,
      stem: function (s) { var V = s.V; return 'A delivery van leaves its depot, makes two drop-offs, and returns. The graph shows the van’s distance from the depot over the whole trip, made of five straight segments meeting at ' + t('A') + '–' + t('F') + '.' +
        '<div class="fig">' + fig({ x: [0, V[5][0] + 4], y: [0, V[3][1] + 4], grid: 2, gridY: 2, labelsX: 10, labelsY: 4, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time (min)', yTitle: 'Distance from depot (km)', unitX: 320 / (V[5][0] + 4), unitY: 200 / (V[3][1] + 4), max: 380,
          segs: [{ pts: V }], points: V.map(function (p, i) { return { x: p[0], y: p[1], label: 'ABCDEF'.charAt(i) }; }), aria: 'graph of the van’s distance from the depot' }) + '</div>'; }, parts: [
      { id: 'e1a', level: 'BEG', make: function (r, s) {
        var rows = [{ id: 'ab', html: '(i) ' + t('A') + ' to ' + t('B') }, { id: 'cd', html: '(ii) ' + t('C') + ' to ' + t('D') }, { id: 'ef', html: '(iii) ' + t('E') + ' to ' + t('F') }];
        var cols = [{ id: 'away', html: 'Driving away from the depot' }, { id: 'stop', html: 'Stopped at a drop-off' }, { id: 'back', html: 'Driving back toward the depot' }];
        var V = s.V;
        return B.grid('(a) Describe what is happening during each interval.', rows, cols, { ab: 'away', cd: 'away', ef: 'back' }, { why: function (row, got) { return { code: 'row', hint: got === 'stop' ? 'A stop is a <b>flat</b> segment. This segment is not flat.' : 'Rising means the distance from the depot is growing (driving away); falling means it is shrinking (driving back).' }; } },
          '(i) ' + t('A') + ' to ' + t('B') + ': driving away at a steady speed, reaching ' + t(s.d1) + ' km in ' + t(V[1][0]) + ' min.<br>(ii) ' + t('C') + ' to ' + t('D') + ': after the first drop-off it drives farther out, ' + t(s.d1) + ' km to ' + t(s.d2) + ' km in ' + t(s.dt) + ' min — its fastest stretch.<br>(iii) ' + t('E') + ' to ' + t('F') + ': it drives all the way back to the depot.',
          ['Rising = distance from the depot growing; flat = not moving; falling = coming back.'], 'EP van intervals');
      } },
      { id: 'e1b', level: 'EMG', make: function (r, s) {
        var V = s.V, dy = s.d2 - s.d1;
        return B.fields('(b) Determine the rate of change from ' + t('C') + ' to ' + t('D') + ', in km per minute, and then convert it to km/h.', [box('Rate:', 'km/min'), box('Rate:', 'km/h')],
          [K.number(s.r2, numDiag(s.r2, rateCands(dy, s.dt, s.r2))), K.number(s.kmh, numDiag(s.kmh, [{ v: s.r2, code: 'per-min', hint: 'That is per minute. There are 60 minutes in an hour: multiply by ' + t('60') + '.' }, { v: s.r2 / 60, code: 'per-min', hint: 'To go from per minute to per hour, multiply by ' + t('60') + ' (an hour has 60 minutes).' }]))],
          [dn(s.r2), dn(s.kmh)], t(dn(s.r2)) + ' km/min, ' + t(dn(s.kmh)) + ' km/h',
          t('\\dfrac{' + V[3][1] + '-' + V[2][1] + '}{' + V[3][0] + '-' + V[2][0] + '}=\\dfrac{' + dy + '}{' + s.dt + '}=' + dn(s.r2)) + ' km/min, and ' + t(dn(s.r2) + '\\times 60=' + dn(s.kmh)) + ' km/h.', ['Change in distance ÷ change in time, then × 60 for km/h.'], 'EP van rate');
      } },
      { id: 'e1c', level: 'EMG', make: function (r, s) {
        return mcG(r, '(c) Which segment is the steepest, and what does that steepness mean for the van at that moment?', [
          { html: t('C') + ' to ' + t('D') + ': the van is driving fastest there.', right: true },
          { html: t('D') + ' to ' + t('E') + ': the van is farthest from the depot.', why: 'That segment is flat — the van is stopped. Height is distance from the depot, not speed.' },
          { html: t('E') + ' to ' + t('F') + ': it is the longest segment.', why: 'Length isn’t steepness. Compare the rates: ' + t(dn(s.r1)) + ', ' + t(dn(s.r2)) + ' and ' + t(dn(s.r3)) + ' km/min.' },
          { html: t('A') + ' to ' + t('B') + ': the van starts out fastest.', why: 'Compare the rates: ' + t('A') + '–' + t('B') + ' is ' + t(dn(s.r1)) + ' km/min, but ' + t('C') + '–' + t('D') + ' is ' + t(dn(s.r2)) + ' km/min.' }],
          t('C') + ' to ' + t('D') + ' is the steepest segment (' + t(dn(s.r2)) + ' km/min versus ' + t(dn(s.r1)) + ' and ' + t(dn(s.r3)) + '), so the van is driving fastest there — highway speed.', ['Steeper = faster.'], 'EP van steepest');
      } },
      { id: 'e1d', level: 'EMG', make: function (r, s) {
        return numPart('(d) For how many minutes in total was the van not moving?', s.s1 + s.s2, [{ v: s.s1, code: 'u5l11-one-flat', hint: 'There are two flat segments: ' + t('B') + '–' + t('C') + ' and ' + t('D') + '–' + t('E') + '. Add both.' }, { v: s.s2, code: 'u5l11-one-flat', hint: 'There are two flat segments. Add both.' }],
          'The van is stopped on the two flat segments: ' + t('B') + ' to ' + t('C') + ' (' + t(s.s1) + ' min) and ' + t('D') + ' to ' + t('E') + ' (' + t(s.s2) + ' min): ' + t(s.s1 + s.s2) + ' minutes.', ['Not moving = flat.'], 'EP van stopped', { after: 'min' });
      } },
      { id: 'e1e', sub: 'e i', level: 'PRG', make: function (r, s) {
        var tot = s.d1 + (s.d2 - s.d1) + s.d2;
        return numPart('(e) How many kilometres did the van <b>drive</b> altogether?', tot, [{ v: 0, code: 'dist-vs-travel', hint: 'The van ends where it started, but it still drove. Add up the distance of every leg: out, farther out, and back.' }, { v: s.d2, code: 'dist-vs-travel', hint: 'That is only how far from the depot it got. It also drove all the way back.' }],
          t(s.d1) + ' km out, ' + t(s.d2 - s.d1) + ' km farther, and ' + t(s.d2) + ' km back: ' + t(s.d1 + '+' + (s.d2 - s.d1) + '+' + s.d2 + '=' + tot) + ' km.', ['Add the distance driven on every moving segment, including the trip back.'], 'EP van total driven', { after: 'km' });
      } },
      { id: 'e1f', sub: 'e ii', level: 'PRG', make: function (r, s) {
        return mcG(r, 'Why is the answer not ' + t('0') + ' km, even though the van ends where it started?', [
          { html: 'The graph shows <b>distance from the depot</b>, not distance driven: the trip back still adds kilometres even though it brings the van back to ' + t('0') + '.', right: true },
          { html: 'Because the van drove around during the stops.', why: 'The flat segments mean the van was not moving.' },
          { html: 'It is ' + t('0') + ' km: the van is back where it started.', why: 'Ending at the start means the distance <b>from the depot</b> is ' + t('0') + ' — but the odometer kept counting the whole time.' },
          { html: 'Because distances on the way back are negative.', why: 'Distances driven are never negative; the graph falls because the distance from the depot is shrinking.' }],
          'The graph tracks the distance <b>from the depot</b>. Driving back makes that distance shrink to ' + t('0') + ', but every kilometre of the return trip is still driven.', ['What does the vertical axis measure?'], 'EP distance vs driven');
      } }] },
    /* ---------------- Extra 2: reservoir ---------------- */
    { num: '2', shared: function (r) {
        for (var k = 0; k < 400; k++) {
          var y0 = pick(r, [18, 18, 15, 21, 24]), c1 = pick(r, [-6, -6, -3, -9]), c3 = pick(r, [12, 12, 9, 15, 6]), c4 = pick(r, [-6, -6, -3, -9, -12]);
          var V = [[0, y0], [3, y0 + c1], [6, y0 + c1], [9, y0 + c1 + c3], [12, y0 + c1 + c3 + c4]];
          if (V.some(function (p) { return p[1] < 3 || p[1] > 30; }) || Math.abs(c3) <= Math.abs(c1) || Math.abs(c3) <= Math.abs(c4)) continue;
          return { V: V, c1: c1, c3: c3, c4: c4 };
        }
      }, stem: function (s) { return 'The graph shows the water depth in a reservoir over one year, measured in months after January 1.' +
        '<div class="fig">' + fig({ x: [0, 13], y: [0, 33], grid: 1, gridY: 3, labelsX: 3, labelsY: 6, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time (months)', yTitle: 'Depth (m)', unitX: 24, unitY: 6.5, max: 360,
          segs: [{ pts: s.V }], points: s.V.map(function (p, i) { return { x: p[0], y: p[1], label: 'ABCDE'.charAt(i) }; }), aria: 'graph of the reservoir depth' }) + '</div>'; }, parts: [
      { id: 'e2a', level: 'EMG', make: function (r, s) {
        var segs = [['B', 'C', 0], ['C', 'D', s.c3], ['D', 'E', s.c4]], fl = [], ch = [], keys = [];
        segs.forEach(function (g) { fl.push(box(g[0] + '–' + g[1] + ', change in time:', 'months'), box(g[0] + '–' + g[1] + ', change in depth:', 'm'), box(g[0] + '–' + g[1] + ', rate:', 'm/month')); ch.push(K.number(3), K.number(g[2], function (u) { return near(u, -g[2]) && g[2] ? { code: 'rate-sign', hint: 'Check the sign: is the depth going up or down on ' + g[0] + '–' + g[1] + '?' } : null; }), K.number(g[2] / 3, numDiag(g[2] / 3, rateCands(g[2], 3, g[2] / 3)))); keys.push('3', String(g[2]), dn(g[2] / 3)); });
        var tbl = '<table class="vtab" style="font-size:14px"><tr><th></th><th>A–B</th><th>B–C</th><th>C–D</th><th>D–E</th></tr><tr><th>Change in time (months)</th><td>3</td><td>?</td><td>?</td><td>?</td></tr><tr><th>Change in depth (m)</th><td>' + t(s.c1) + '</td><td>?</td><td>?</td><td>?</td></tr><tr><th>Rate (m per month)</th><td>' + t(s.c1 / 3) + '</td><td>?</td><td>?</td><td>?</td></tr></table>';
        return B.fields('(a) Complete the table.' + tbl, fl, ch, keys, segs.map(function (g) { return g[0] + '–' + g[1] + ': ' + t('3,\\ ' + g[2] + ',\\ ' + dn(g[2] / 3)); }).join('; '),
          segs.map(function (g) { return g[0] + '–' + g[1] + ': ' + t('3') + ' months, ' + t((g[2] > 0 ? '+' : '') + g[2]) + ' m, rate ' + t('\\frac{' + g[2] + '}{3}=' + dn(g[2] / 3)) + ' m per month'; }).join('<br>'), ['Change = later value − earlier value; rate = change in depth ÷ change in time.'], 'EP reservoir table');
      } },
      { id: 'e2b', level: 'PRG', make: function (r, s) {
        return mcG(r, '(b) Which interval is the steepest, and what does that represent for the reservoir?', [
          { html: 'C–D, at ' + t(dn(s.c3 / 3)) + ' m per month: the reservoir is refilling fastest (spring melt or heavy rain).', right: true },
          { html: 'A–B: the depth drops at the start of the year.', why: 'Compare the sizes of the rates: ' + t(dn(s.c1 / 3)) + ' versus ' + t(dn(s.c3 / 3)) + '.' },
          { html: 'B–C: the depth is lowest there.', why: 'B–C is flat (rate ' + t('0') + '). Low is not steep.' },
          { html: 'D–E: the reservoir is draining fastest.', why: 'Compare the sizes of the rates: ' + t(dn(s.c4 / 3)) + ' versus ' + t(dn(s.c3 / 3)) + '.' }],
          'C–D has the biggest rate in size, ' + t(dn(s.c3 / 3)) + ' m per month: the reservoir is refilling fastest then.', ['Compare the sizes of the rates.'], 'EP reservoir steepest');
      } },
      { id: 'e2c', level: 'EMG', make: function (r, s) {
        return mcG(r, '(c) During which interval did the depth not change, and for how long?', [
          { html: 'B to C, for ' + t('3') + ' months (months 3 to 6)', right: true },
          { html: 'B to C, for ' + t('6') + ' months', why: 'B is at month 3 and C at month 6: that is ' + t('6-3=3') + ' months.' },
          { html: 'C to D, for ' + t('3') + ' months', why: 'C–D rises: the depth is changing. Look for the flat segment.' },
          { html: 'A to B, for ' + t('3') + ' months', why: 'A–B falls. Not changing means flat.' }],
          'The flat segment is B to C, from month 3 to month 6: ' + t('3') + ' months.', ['Not changing = flat.'], 'EP reservoir flat');
      } }] },
    /* ---------------- Extra 3: transit card ---------------- */
    { num: '3', shared: function (r) {
        var c = pick(r, [5, 5, 4, 6, 3]), k = pick(r, [2, 2, 1, 3, 4]), nm = pick(r, ['Nadia', 'Nadia', 'Theo', 'Hana', 'Mateo']), L = c * (10 + k);
        var V = [[0, L], [5, L - 5 * c], [7, L - 5 * c], [12, L - 10 * c], [14, L - 10 * c], [14 + k, 0]];
        return { c: c, k: k, nm: nm, L: L, V: V, end: 14 + k };
      }, stem: function (s) { return s.nm + ' loads ' + t('\\$' + s.L) + ' onto a prepaid transit card. The graph shows the value left on the card over the next ' + t(s.end) + ' days. ' + s.nm + ' rides only on weekdays (day ' + t('0') + ' is a Monday).' +
        '<div class="fig">' + fig({ x: [0, 17], y: [0, s.L + 10], grid: 1, gridY: 5, labelsX: 2, labelsY: 10, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Day', yTitle: 'Value on card ($)', unitX: 19, unitY: 200 / (s.L + 10), max: 360, segs: [{ pts: s.V }], aria: 'graph of the value on the card' }) + '</div>'; }, parts: [
      { id: 'e3a', level: 'BEG', outcome: 'RF5', make: function (r, s) {
        return mcG(r, '(a) What are the coordinates of the vertical intercept, and what do they mean here?', [
          { html: t(ptT([0, s.L])) + ': on day ' + t('0') + ' the card holds the ' + t('\\$' + s.L) + ' that was loaded.', right: true },
          { html: t(ptT([s.L, 0])) + ': the card lasts ' + t(s.L) + ' days.', why: 'The vertical intercept is on the vertical axis, where the day is ' + t('0') + '.' },
          { html: t(ptT([s.end, 0])) + ': the card is empty on day ' + t(s.end) + '.', why: 'That point is on the <b>horizontal</b> axis. The vertical intercept has day ' + t('0') + '.' },
          { html: t(ptT([0, s.c])) + ': each ride costs ' + t('\\$' + s.c) + '.', why: 'Read the value on the vertical axis where the graph starts.' }],
          'The graph meets the vertical axis at ' + t(ptT([0, s.L])) + ': on day ' + t('0') + ' the card has ' + t('\\$' + s.L) + ' — the amount ' + s.nm + ' loaded.', ['The vertical intercept is where day = 0.'], 'EP card vertical intercept');
      } },
      { id: 'e3b', level: 'EMG', make: function (r, s) {
        return mcG(r, '(b) There are two flat sections. What do they represent, and why are they <b>not</b> days on which the card gained value?', [
          { html: 'They are the weekends, when ' + s.nm + ' doesn’t ride: the value stays the same, and staying the same is not going up — a gain would be a rising segment.', right: true },
          { html: 'They are days when money was added to the card.', why: 'Adding money would make the graph <b>rise</b>. Flat means no change.' },
          { html: 'They are days when the card was empty.', why: 'The card still has money then: the graph is flat above ' + t('0') + '.' },
          { html: 'They are days when rides were free, so the card gained value.', why: 'Flat means the value did not change at all — no gain and no loss.' }],
          'Days 5–7 and 12–14 are weekends: no rides, so the value stays the same. A gain would show as a <b>rising</b> segment; flat means no change.', ['What does a flat segment mean?'], 'EP card flats');
      } },
      { id: 'e3c', level: 'EMG', make: function (r, s) {
        return numPart('(c) Determine the rate of change on a day that ' + s.nm + ' rides. Include the sign.', -s.c, rateCands(-5 * s.c, 5, -s.c).concat([{ v: -5 * s.c, code: 'value', hint: 'That is the change over 5 days. Divide by the number of days.' }]),
          'Over 5 weekdays the value drops from ' + t(s.L) + ' to ' + t(s.L - 5 * s.c) + ': ' + t('\\dfrac{' + (s.L - 5 * s.c) + '-' + s.L + '}{5-0}=\\dfrac{' + (-5 * s.c) + '}{5}=-' + s.c) + ' dollars per day (negative: the value goes down).', ['Use the change over a riding stretch, e.g. day 0 to day 5.'], 'EP card rate', { before: t('\\$'), after: 'per day' });
      } },
      { id: 'e3d', level: 'BEG', outcome: 'RF5', make: function (r, s) {
        return mcG(r, '(d) What are the coordinates of the horizontal intercept, and what do they mean here?', [
          { html: t(ptT([s.end, 0])) + ': the card runs out of money on day ' + t(s.end) + '.', right: true },
          { html: t(ptT([0, s.L])) + ': the card starts with ' + t('\\$' + s.L) + '.', why: 'That is the vertical intercept. The horizontal intercept is where the value is ' + t('0') + '.' },
          { html: t(ptT([s.end, 0])) + ': ' + s.nm + ' rode ' + t(s.end) + ' times.', why: 'The horizontal axis counts days, not rides — and weekends have no rides.' },
          { html: t(ptT([0, s.end])) + ': the card lasts ' + t(s.end) + ' days.', why: 'A horizontal intercept has output ' + t('0') + ': its coordinates are (day, 0).' }],
          'The graph meets the horizontal axis at ' + t(ptT([s.end, 0])) + ': on day ' + t(s.end) + ' the card has ' + t('\\$0') + ' left.', ['The horizontal intercept is where the value is 0.'], 'EP card horizontal intercept');
      } },
      { id: 'e3e', sub: 'e i', level: 'PRG', make: function (r, s) {
        var d = s.L / s.c;
        return numPart('(e) Suppose instead ' + s.nm + ' had ridden <b>every</b> day, weekends included, at the same daily cost. On what day would the card have reached ' + t('\\$0') + '?', d, [{ v: s.end, code: 'value', hint: 'That is the answer with weekends off. Riding every day uses ' + t('\\$' + s.c) + ' each day with no breaks: ' + t(s.L + '\\div ' + s.c) + '.' }, { v: s.L - s.c, code: 'value', hint: 'Divide the starting value by the daily cost.' }],
          t(s.L + '\\div ' + s.c + '=' + d) + ', so day ' + t(d) + '.', ['How many days of ' + t('\\$' + s.c) + ' does ' + t('\\$' + s.L) + ' last?'], 'EP card every day', { before: 'day' });
      } },
      { id: 'e3f', sub: 'e ii', level: 'PRG', make: function (r, s) {
        var d = s.L / s.c;
        return mcG(r, 'How would the graph change?', [
          { html: 'It would be one straight segment from ' + t(ptT([0, s.L])) + ' to ' + t(ptT([d, 0])) + ', with no flat parts.', right: true },
          { html: 'It would keep the flat parts but end at ' + t(ptT([d, 0])) + '.', why: 'Riding every day means the value drops every day — no flat stretches.' },
          { html: 'It would be steeper than now on riding days.', why: 'The daily cost is the same, so each riding day is just as steep. What changes is the weekends.' },
          { html: 'It would be one straight segment from ' + t(ptT([0, s.L])) + ' to ' + t(ptT([s.end, 0])) + '.', why: 'With no breaks the money runs out sooner: ' + t(s.L + '\\div ' + s.c + '=' + d) + '.' }],
          'With no weekend breaks the value drops ' + t('\\$' + s.c) + ' every day: a single straight segment from ' + t(ptT([0, s.L])) + ' to ' + t(ptT([d, 0])) + ', with no flat parts.', ['Flat parts came from the days without rides.'], 'EP card graph change');
      } }] },
    /* ---------------- Extra 4: Kai's mornings ---------------- */
    { num: '4', section: 'Extra practice B — Matching stories to graphs', shared: function (r) {
        var shapes = { steady: [[0.3, 0.4], [9.6, 5.6]], bus: [[0.3, 0.4], [4.2, 2.0], [6.4, 2.0], [9.0, 5.8]], tire: [[0.3, 0.4], [3.4, 4.2], [9.6, 5.6]], lunch: [[0.3, 0.4], [3.6, 3.6], [6.9, 0.4], [9.6, 0.4]] };
        var order = r.shuffle(['steady', 'bus', 'tire', 'lunch']), nm = pick(r, [['Kai', 'he', 'his'], ['Kai', 'he', 'his'], ['Rosa', 'she', 'her'], ['Eli', 'he', 'his'], ['Amira', 'she', 'her'], ['Jonah', 'he', 'his']]);
        var L = {}; order.forEach(function (k, i) { L[k] = 'ABCD'.charAt(i); });
        return { order: order, L: L, sh: shapes, nm: nm };
      }, stem: function (s) { return 'Each graph shows ' + s.nm[0] + '’s <b>distance from home</b> against <b>time</b> on a different morning.<div class="fig-row" style="display:flex;flex-wrap:wrap;gap:6px">' + s.order.map(function (k, i) { return '<div style="text-align:center"><b>' + 'ABCD'.charAt(i) + '</b><br>' + sk(SH.poly(s.sh[k]), { max: 150, unit: 12, xTitle: 'Time', yTitle: 'Distance' }) + '</div>'; }).join('') + '</div>'; }, parts: [
      { id: 'e4a', level: 'EMG', make: function (r, s) {
        var nm = s.nm[0], he = s.nm[1];
        var rows = [{ id: 'steady', html: '(i) ' + nm + ' walks at one steady pace the whole way, never stopping.' }, { id: 'bus', html: '(ii) ' + nm + ' walks to the bus stop, waits for the bus, then rides the bus — much faster than ' + he + ' walked — the rest of the way.' },
          { id: 'tire', html: '(iii) ' + nm + ' jogs quickly at first, then tires and walks the rest of the way, never stopping.' }, { id: 'lunch', html: '(iv) ' + nm + ' starts out, realizes ' + he + ' forgot ' + s.nm[2] + ' lunch, walks home at the same pace, and waits inside.' }];
        var cols = 'ABCD'.split('').map(function (c) { return { id: c, html: '<b>' + c + '</b>' }; }), want = {};
        rows.forEach(function (row) { want[row.id] = s.L[row.id]; });
        return B.grid('Match each story to exactly one graph.', rows, cols, want, { why: function (row) { return { code: 'row', hint: { steady: 'One steady pace: one straight rising line.', bus: 'Walk, wait (flat), then a <b>steeper</b> rise for the bus.', tire: 'Fast then slower, never stopping: steep, then less steep, with no flat part.', lunch: 'Out, back home (falling to ' + t('0') + '), then waiting (flat at ' + t('0') + ').' }[row] }; } },
          rows.map(function (row) { return row.html.slice(0, 5) + ' → <b>' + s.L[row.id] + '</b>'; }).join('<br>'), ['A wait is a flat segment; faster is steeper; going home is falling.'], 'EP match four stories');
      } },
      { id: 'e4b', level: 'EMG', make: function (r, s) {
        return mcG(r, '(v) In the graph for story (iv) (graph ' + s.L.lunch + '), the falling segment is exactly as steep as the rising segment. What does that tell you about ' + s.nm[0] + '’s two walks?', [
          { html: 'Equal steepness means equal speed: ' + s.nm[1] + ' walked home at exactly the same pace as ' + s.nm[1] + ' walked out.', right: true },
          { html: s.nm[1].charAt(0).toUpperCase() + s.nm[1].slice(1) + ' walked the same distance both times.', why: 'True, but that comes from starting and ending at home. Steepness tells you about <b>speed</b>.' },
          { html: 'The walk home took longer.', why: 'Equal steepness and equal distance mean equal times.' },
          { html: s.nm[1].charAt(0).toUpperCase() + s.nm[1].slice(1) + ' walked faster on the way home.', why: 'Faster would be a <b>steeper</b> segment.' }],
          'Steepness is the rate of change of distance — the speed. Equal steepness: the same pace out and back.', ['What does steepness measure on a distance–time graph?'], 'EP equal steepness');
      } },
      { id: 'e4c', level: 'PRG', make: function (r, s) {
        var a = s.L.tire, b = s.L.steady;
        return mcG(r, '(vi) Graphs ' + [a, b].sort().join(' and ') + ' both rise the whole way with no flat part. What makes them different stories?', [
          { html: 'Graph ' + b + ' has one constant steepness (one steady pace); graph ' + a + ' starts steep and then becomes gradual (fast first, then slower).', right: true },
          { html: 'Graph ' + a + ' ends farther from home.', why: 'Both end at the destination. Compare the steepness along each graph.' },
          { html: 'Graph ' + b + ' is faster the whole way.', why: 'Look at the start: graph ' + a + ' is steeper there.' },
          { html: 'There is no difference: both show walking without stopping.', why: 'Both rise without stopping, but the <b>rate</b> changes in one of them.' }],
          'Graph ' + b + ' is one straight line: the same pace the whole way. Graph ' + a + ' is steep first and then gradual: fast first, then slower. Both rise, but only one has a changing rate.', ['Look at the steepness along each graph.'], 'EP C vs D');
      } }] },
    /* ---------------- Extra 5: speed vs distance travelled ---------------- */
    { num: '5', shared: function (r) {
        var v = pick(r, ['bus', 'bus', 'tram', 'subway train', 'school bus', 'delivery van', 'shuttle bus']), flip = r.chance(0.5), cr = pick(r, [[0.8, 1.9], [0.8, 1.9], [0.6, 2.1], [1.0, 1.7], [0.7, 2.0]]);
        var spd = SH.poly([[0, 0], [cr[0], 1.8], [cr[1], 1.8], [2.7, 0]]);
        spd.segs[0].pts = spd.segs[0].pts.map(function (p) { return [p[0] * 3.5, p[1] * 2.6]; });
        var a = cr[0] * 3.5, b2 = cr[1] * 3.5, E = 2.7 * 3.5, vmax = 4.7, d1 = vmax * a / 2, d2 = d1 + vmax * (b2 - a), dt = d2 + vmax * (E - b2) / 2, sc = 5.6 / dt;
        var dist = { fns: [Fn(function (x) { var y = x <= a ? vmax * x * x / (2 * a) : x <= b2 ? d1 + vmax * (x - a) : d2 + vmax * (x - b2) - vmax * (x - b2) * (x - b2) / (2 * (E - b2)); return y * sc; }, 0, E), Fn(function () { return dt * sc; }, E, 9.8)] };
        spd.segs[0].pts.push([9.8, 0]);
        var gs = { speed: spd, dist: dist };
        return { v: v, P: flip ? 'dist' : 'speed', gs: gs };
      }, stem: function (s) { var Q = s.P === 'speed' ? 'dist' : 'speed'; return 'A city ' + s.v + ' pulls away from one stop, drives to the next stop, and halts there. The two graphs below describe <b>the same</b> trip: one shows its <b>speed</b>, the other its <b>distance travelled</b>. Neither is labelled.<div style="display:flex;flex-wrap:wrap;gap:8px"><div style="text-align:center"><b>Graph P</b><br>' + sk(s.gs[s.P], { max: 170, unit: 13, xTitle: 'Time' }) + '</div><div style="text-align:center"><b>Graph Q</b><br>' + sk(s.gs[Q], { max: 170, unit: 13, xTitle: 'Time' }) + '</div></div>'; }, parts: [
      { id: 'e5a', level: 'EMG', make: function (r, s) {
        var sp = s.P === 'speed' ? 'P' : 'Q', di = sp === 'P' ? 'Q' : 'P';
        return mcG(r, '(a) Which graph shows speed and which shows distance travelled?', [
          { html: sp + ' is speed and ' + di + ' is distance travelled: ' + sp + ' rises, stays flat, then falls back to ' + t('0') + ' (speeding up, cruising, slowing to a stop), while ' + di + ' only ever increases and levels off at the end.', right: true },
          { html: di + ' is speed and ' + sp + ' is distance travelled: ' + sp + ' goes back down to ' + t('0') + ' at the end of the trip.', why: 'Distance travelled is a running total — it can’t go back down to ' + t('0') + '. Returning to ' + t('0') + ' fits <b>speed</b> (stopped).' },
          { html: sp + ' is speed and ' + di + ' is distance travelled, because ' + di + ' is curved.', why: 'Right pairing, wrong reason: curves can appear on either kind of graph. The reason is what each graph does at the end.' },
          { html: 'Both could be either one.', why: 'A distance travelled can never fall, so the graph that falls to ' + t('0') + ' must be speed.' }],
          'Graph ' + sp + ' returns to ' + t('0') + ': that makes sense for speed (stopped) but not for distance travelled. It is a rise, a flat and a fall — speeding up, cruising, slowing down. Graph ' + di + ' only increases and flattens out: distance travelled.', ['Which graph could go back down to 0?'], 'EP which is speed');
      } },
      { id: 'e5b', level: 'EMG', make: function (r, s) {
        var sp = s.P === 'speed' ? 'P' : 'Q', di = sp === 'P' ? 'Q' : 'P';
        return mcG(r, '(b) At the instant the ' + s.v + ' is halted at the second stop, what is each graph doing?', [
          { html: 'The speed graph (' + sp + ') sits at ' + t('0') + '; the distance graph (' + di + ') is flat at its highest value — no new distance is being added.', right: true },
          { html: 'Both graphs are at ' + t('0') + '.', why: 'The distance travelled doesn’t go back to ' + t('0') + ' — the trip still happened.' },
          { html: 'Both graphs are at their highest point.', why: 'A stopped ' + s.v + ' has speed ' + t('0') + '.' },
          { html: 'The speed graph is flat at its top; the distance graph falls.', why: 'Halted means speed ' + t('0') + ', and distance travelled never falls.' }],
          'Halted: speed ' + t('0') + ' (graph ' + sp + ' on the axis), and the distance travelled stops growing (graph ' + di + ' flat at its maximum).', ['What is the speed of a halted ' + s.v + '?'], 'EP at the stop');
      } },
      { id: 'e5c', level: 'PRG', make: function (r, s) {
        return mcG(r, '(c) Why can the distance-travelled graph never have a falling segment, no matter what the ' + s.v + ' does?', [
          { html: 'Distance travelled is a running total: it can grow or stay the same, but the ' + s.v + ' can never “un-travel” distance it has already covered.', right: true },
          { html: 'Because ' + (s.v.indexOf('bus') >= 0 || s.v === 'tram' ? 'a ' : 'a ') + s.v + ' can’t drive backwards.', why: 'Even driving backwards adds distance travelled. The total only grows.' },
          { html: 'Because the trip ends at a stop.', why: 'That only makes the graph flat at the end. Think about what a total does.' },
          { html: 'It can, if the ' + s.v + ' turns around and comes back.', why: 'Coming back makes the distance <b>from the start</b> shrink, but the distance <b>travelled</b> keeps adding up.' }],
          'Distance travelled adds up every metre covered. Driving in any direction adds to it; stopping keeps it the same. A falling segment would mean the total distance already covered had decreased — impossible.', ['Is distance travelled a running total?'], 'EP never falls');
      } }] },
    /* ---------------- Extra 6: tank (scaled sketch) ---------------- */
    { num: '6', section: 'Extra practice C — Sketching a graph from a story', shared: function (r) {
        for (var k = 0; k < 400; k++) {
          var V0 = pick(r, [100, 100, 50, 150, 200]), pr = pick(r, [50, 50, 25, 40, 60]), pt = pick(r, [4, 4, 2, 3, 5]), off = pick(r, [6, 6, 4, 3, 5]), dr = pick(r, [30, 30, 25, 40, 50, 60]);
          var top = V0 + pr * pt, te = top / dr, T = pt + off + te;
          if (top > 400 || !Number.isInteger(te) || T > 24 || top % 50) continue;
          return { V0: V0, pr: pr, pt: pt, off: off, dr: dr, top: top, te: te, T: T, V: [[0, V0], [pt, top], [pt + off, top], [T, 0]] };
        }
        return { V0: 100, pr: 50, pt: 4, off: 6, dr: 30, top: 300, te: 10, T: 20, V: [[0, 100], [4, 300], [10, 300], [20, 0]] };
      }, stem: function (s) { return 'A tank holds ' + t(s.V0) + ' L of water when a pump is switched on. The pump adds water at a steady ' + t(s.pr) + ' L per minute for ' + t(s.pt) + ' minutes, then shuts off for ' + t(s.off) + ' minutes. A valve is then opened and the tank drains at a steady ' + t(s.dr) + ' L per minute until it is empty.'; }, parts: [
      { id: 'e6a', level: 'PRG', make: function (r, s) {
        var V = s.V, ym = Math.ceil((s.top + 50) / 100) * 100, xm = Math.ceil((s.T + 2) / 2) * 2;
        var inp = { x: [0, xm], y: [0, ym], grid: 1, gridY: 25, labelsX: 2, labelsY: 50, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time (min)', yTitle: 'Volume (L)', unitX: 310 / xm, unitY: 230 / ym, snapX: 1, snapY: 25, tools: ['line'], defaultEnd: 'none', max: 380 };
        var wr = [{ is: poly([[0, 0], [s.pt, s.pr * s.pt], [s.pt + s.off, s.pr * s.pt], [s.pt + s.off + s.pr * s.pt / s.dr, 0]]), code: 'no-fixed', hint: 'The tank already holds ' + t(s.V0) + ' L at the start: the graph starts at ' + t(ptT([0, s.V0])) + ', not at the origin.' },
          { is: poly([[0, s.V0], [s.pt, s.top], [s.T - s.off, 0]]), code: 'story-count', hint: 'Where is the pause? The pump is off for ' + t(s.off) + ' minutes before draining starts: a <b>flat</b> segment.' }];
        var chk = K.graphExact(poly(V), { wrong: wr });
        var check = function (v) { var res = chk(v); if (res.v === 'wrong' && res.code === 'graph' && !res.hint) return wrong('graph', 'Find each corner (minutes, litres): start ' + t(ptT(V[0])) + ', pump off at ' + t(s.pt) + ' min, valve opened at ' + t(s.pt + s.off) + ' min, empty at ' + t('0') + ' L. Join them in order.'); return res; };
        var p = B.graph('Sketch the volume of water against time on the grid, from the moment the pump is switched on until the tank is empty.', inp, check, poly(V),
          'Corners: ' + V.map(function (q) { return t(ptT(q)); }).join(', ') + ' — rise (pump on), flat (pump off), fall (draining), joined with straight segments.', ['Find each corner point (minutes, litres).', 'Draining ' + t(s.top) + ' L at ' + t(s.dr) + ' L/min takes ' + t(s.top + '\\div ' + s.dr) + ' minutes.'], 'EP tank sketch');
        p.bad = [wr[0].is, wr[1].is, poly(V.slice(0, 3))];
        return p;
      } },
      { id: 'e6b', level: 'BEG', make: function (r, s) {
        return numPart('(a) How much water is in the tank when the pump shuts off?', s.top, [{ v: s.pr * s.pt, code: 'no-fixed', hint: 'Add the ' + t(s.V0) + ' L that was already in the tank.' }],
          t(s.V0 + '+' + s.pr + '(' + s.pt + ')=' + s.top) + ' L.', ['Start amount + amount added.'], 'EP tank top', { after: 'L' });
      } },
      { id: 'e6c', level: 'EMG', make: function (r, s) {
        return numPart('(b) At what time (minutes after the pump is switched on) is the tank empty?', s.T, [{ v: s.te, code: 'value', hint: 'That is how long the draining takes. Add the ' + t(s.pt + s.off) + ' minutes before the valve opened.' }, { v: s.top / s.dr + s.pt, code: 'value', hint: 'Don’t forget the ' + t(s.off) + ' minutes with the pump off.' }],
          'Draining takes ' + t(s.top + '\\div ' + s.dr + '=' + s.te) + ' min, starting at minute ' + t(s.pt + s.off) + ': empty at ' + t('t=' + s.T) + ' min, the point ' + t(ptT([s.T, 0])) + '.', ['How long does the draining take? When does it start?'], 'EP tank empty time', { before: t('t='), after: 'min' });
      } }] },
    /* ---------------- Extra 7: drive to the cabin ---------------- */
    { num: '7', shared: function (r) {
        var c = pick(r, [[80, 0.5, 1, 80], [80, 0.5, 1, 80], [60, 0.5, 1, 60], [60, 1, 0.5, 90], [100, 0.5, 1, 100], [100, 0.5, 1.5, 75], [80, 1, 1, 60], [60, 0.5, 1.5, 45]]);
        var v = c[0], rest = c[1], stay = c[2], w = c[3], d1 = v, D = v * 1.5, back = D / w, nm = pick(r, ['Amara', 'Amara', 'Diego', 'Priya', 'Lucas', 'Mei']);
        var t2 = 1 + rest, t3 = t2 + 0.5, t4 = t3 + stay, t5 = t4 + back;
        return { v: v, rest: rest, stay: stay, w: w, D: D, nm: nm, V: [[0, 0], [1, d1], [t2, d1], [t3, D], [t4, D], [t5, 0]], home: t5 };
      }, stem: function (s) { return s.nm + ' drives from home to a cabin and back. ' + s.nm + ' drives ' + t(s.v) + ' km in the first hour, stops at a rest area for ' + (s.rest === 1 ? 'an hour' : 'half an hour') + ', then drives on for another half hour at the same speed, arriving at the cabin ' + t(s.D) + ' km from home. ' + s.nm + ' stays at the cabin for ' + (s.stay === 1 ? 'one hour' : s.stay === 0.5 ? 'half an hour' : t('1.5') + ' hours') + ', then drives straight home at ' + t(s.w) + ' km/h.'; }, parts: [
      { id: 'e7a', level: 'PRG', make: function (r, s) {
        var V = s.V, xm = Math.ceil(s.home + 0.5), ym = Math.ceil((s.D + 20) / 40) * 40;
        var inp = { x: [0, xm], y: [0, ym], grid: 0.5, gridY: 10, labelsX: 1, labelsY: 20, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time (h)', yTitle: 'Distance from home (km)', unitX: 310 / xm, unitY: 230 / ym, snapX: 0.5, snapY: 10, tools: ['line'], defaultEnd: 'none', max: 380 };
        var wr = [{ is: poly([[0, 0], [1, s.v], [1.5, s.D], [1.5 + s.stay, s.D], [1.5 + s.stay + s.D / s.w, 0]]), code: 'story-count', hint: 'Where is the rest-area stop? It is a <b>flat</b> segment at ' + t(s.v) + ' km, before the last half hour of driving.' },
          { is: poly([[0, 0], [1, s.v], [1 + s.rest, s.v], [1.5 + s.rest, s.D], [1.5 + s.rest + s.D / s.w, 0]]), code: 'story-count', hint: 'Where is the hour at the cabin? It is a <b>flat</b> segment at ' + t(s.D) + ' km before the drive home.' }];
        var chk = K.graphExact(poly(V), { wrong: wr });
        var check = function (v) { var res = chk(v); if (res.v === 'wrong' && res.code === 'graph' && !res.hint) return wrong('graph', 'Find each corner as (hours, km from home): ' + t('(0,\\ 0)') + ', ' + t(ptT(V[1])) + ' after the first hour, and so on. The drive home takes ' + t(s.D + '\\div ' + s.w) + ' hours.'); return res; };
        var p = B.graph('Sketch ' + s.nm + '’s distance from home against time.', inp, check, poly(V),
          'Corners: ' + V.map(function (q) { return t(ptT(q)); }).join(', ') + '. The drive home takes ' + t(s.D + '\\div ' + s.w + '=' + dn(s.D / s.w)) + ' h.', ['Find each corner (hours, km). Stops are flat segments.'], 'EP cabin sketch');
        p.bad = [wr[0].is, wr[1].is, poly(V.slice(0, 5))];
        return p;
      } },
      { id: 'e7b', level: 'EMG', make: function (r, s) {
        return numPart('(a) How many hours after leaving does ' + s.nm + ' arrive back home?', s.home, [{ v: s.home - s.D / s.w, code: 'value', hint: 'That is when the drive home <b>starts</b>. Add the time it takes: ' + t(s.D + '\\div ' + s.w) + ' h.' }, { v: s.D / s.w, code: 'value', hint: 'That is how long the drive home takes. Add it to the time ' + s.nm + ' leaves the cabin.' }],
          'Leaves the cabin at ' + t(dn(s.home - s.D / s.w)) + ' h; the drive home takes ' + t(s.D + '\\div ' + s.w + '=' + dn(s.D / s.w)) + ' h: home at ' + t(dn(s.home)) + ' h after leaving.', ['When does the drive home start, and how long does it take?'], 'EP cabin home', { after: 'h' });
      } },
      { id: 'e7c', level: 'PRG', make: function (r, s) {
        return mcG(r, '(b) Two parts of the graph are flat. Why are they flat for two <b>different</b> reasons?', [
          { html: 'Both mean “not moving”, but at two different places: the first is the rest-area stop on the way there (' + t(s.v) + ' km from home), the second is the time spent at the cabin (' + t(s.D) + ' km from home).', right: true },
          { html: 'The first is a stop; the second shows ' + s.nm + ' driving at a constant speed.', why: 'Flat on a distance-from-home graph means the distance isn’t changing: not moving.' },
          { html: 'They are flat for the same reason, so the question is wrong.', why: 'Same meaning (not moving) — but look at <b>where</b> ' + s.nm + ' is during each.' },
          { html: 'The first is at the cabin and the second at the rest area.', why: 'Read the heights: the lower flat part is ' + t(s.v) + ' km from home.' }],
          'The first flat part is the rest-area stop <b>on the way there</b>, ' + t(s.v) + ' km from home; the second is the stay <b>at the cabin</b>, ' + t(s.D) + ' km from home. Both mean not moving, but at different places.', ['Look at the height of each flat part.'], 'EP two flats');
      } }] },
    /* ---------------- Extra 8: coffee ---------------- */
    { num: '8', shared: function (r) { var T0 = pick(r, [90, 90, 85, 80, 95]), Tr = pick(r, [20, 20, 22, 18, 25]), d = pick(r, ['coffee', 'coffee', 'tea', 'hot chocolate']); return { T0: T0, Tr: Tr, d: d }; },
      stem: function (s) { return 'A mug of ' + s.d + ' is poured at ' + t(s.T0 + '\\,^{\\circ}\\text{C}') + ' into a room that stays at ' + t(s.Tr + '\\,^{\\circ}\\text{C}') + '. The ' + s.d + ' cools quickly at first and then more and more slowly, getting closer and closer to room temperature without ever dropping below it.'; }, parts: [
      { id: 'e8a', level: 'PRG', make: function (r, s) {
        var inp = { x: [0, 60], y: [0, 100], grid: 5, gridY: 5, labelsX: 10, labelsY: 20, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time (min)', yTitle: 'Temperature (°C)', unitX: 5, unitY: 2.3, snapX: 5, snapY: 1, tools: ['line'], defaultEnd: 'none', max: 380,
          bg: { segs: [{ pts: [[0, s.Tr], [60, s.Tr]], dash: true, color: '#8a93a3' }] } };
        var base = story({ phases: [{ dir: 'down', text: 'cooling', bend: 'gentler', bendHint: 'It cools <b>fastest at the start</b>, when it is much hotter than the room, then more and more slowly: steep at first, then a few short pieces, each less steep than the one before.' }], prep: trimFlat(false, true),
          start: s.T0, startHint: 'The ' + s.d + ' is poured at ' + t(s.T0 + '\\,^{\\circ}\\text{C}') + ': start the graph at ' + t(ptT([0, s.T0])) + '.' });
        var chk = function (v) {
          var res = base(v); if (res.v !== 'correct') return res;
          var g = groupsOf(v), x0 = g[0].x0, lo = Math.min.apply(null, g.map(function (q) { return Math.min(q.y0, q.y1); }));
          if (x0 > 1e-9) return wrong('story-time', 'Start at the moment it is poured: time ' + t('0') + '.');
          if (lo < s.Tr - 1e-9) return wrong('story-below', 'Your curve drops below the dashed line. The ' + s.d + ' can never get colder than the room it is sitting in: it levels off just above ' + t(s.Tr + '\\,^{\\circ}\\text{C}') + '.');
          if (lo > s.Tr + 20) return wrong('story-zero', 'Keep going: the ' + s.d + ' gets closer and closer to room temperature, so the curve should come down near the dashed line.');
          return ok();
        };
        return storyPart('Sketch the temperature against time. The dashed line marks room temperature.', inp, chk, poly([[0, s.T0], [5, s.Tr + 40], [15, s.Tr + 15], [30, s.Tr + 5], [55, s.Tr + 1]]),
          'A curve from ' + t(ptT([0, s.T0])) + ' falling steeply at first, then flattening as it approaches (but never goes below) the dashed line at ' + t(s.Tr) + '.',
          ['Start at ' + t(ptT([0, s.T0])) + '.', 'Steep first, then flatter and flatter, staying above the dashed line.'], 'EP sketch cooling',
          [poly([[0, s.T0], [55, s.Tr]]), poly([[0, s.T0], [10, s.T0 - 5], [25, s.T0 - 25], [40, s.Tr]]), poly([[0, s.T0], [5, s.Tr + 30], [15, s.Tr - 5], [30, s.Tr - 10]]), poly([[0, 50], [5, 30], [20, s.Tr + 3]])]);
      } },
      { id: 'e8b', level: 'EMG', make: function (r, s) {
        return mcG(r, '(a) How does the steepness of the curve change, and what does that mean about how fast the ' + s.d + ' is losing heat?', [
          { html: 'It starts steep and becomes more and more gradual: the ' + s.d + ' loses heat quickly while it is much hotter than the room, and more slowly as the gap closes.', right: true },
          { html: 'It starts gradual and gets steeper: the ' + s.d + ' cools faster and faster.', why: 'The story says it cools <b>quickly at first</b>.' },
          { html: 'The steepness stays the same: it loses the same amount of heat every minute.', why: 'That would be a straight line. The cooling slows down.' },
          { html: 'It gets steeper because the temperature gets lower.', why: 'Lower is about the value, not the steepness. Steepness is how fast it changes.' }],
          'Steep at first (fast cooling while it is much hotter than the room), then more and more gradual as its temperature approaches room temperature.', ['Steep = changing fast.'], 'EP cooling steepness');
      } },
      { id: 'e8c', level: 'EMG', make: function (r, s) {
        return mcG(r, '(b) Why must the curve never cross the dashed line?', [
          { html: 'Crossing it would mean the ' + s.d + ' became colder than the room it is sitting in, which it can’t do on its own.', right: true },
          { html: 'Because the graph would fail the vertical line test.', why: 'Crossing a horizontal line doesn’t break the vertical line test. Think about what the dashed line means.' },
          { html: 'Because temperatures can’t be below ' + t(s.Tr + '\\,^{\\circ}\\text{C}') + '.', why: 'Temperatures can be lower — just not for ' + s.d + ' cooling in a ' + t(s.Tr + '\\,^{\\circ}\\text{C}') + ' room.' },
          { html: 'Because the graph has to stop at ' + t(s.Tr + '\\,^{\\circ}\\text{C}') + ' after one hour.', why: 'The graph approaches the line but never has to stop there at a certain time.' }],
          'The dashed line is room temperature. A drink cooling in a room only cools <b>toward</b> the room temperature — it never gets colder than the room on its own.', ['What does the dashed line stand for?'], 'EP never cross');
      } }] },
    /* ---------------- Extra 9: container ---------------- */
    { num: '9', shared: function (r) { var wideBottom = r.chance(0.7), h1 = pick(r, [10, 10, 8, 12]), h2 = pick(r, [10, 10, 8, 12, 6]), v = pick(r, ['water', 'water', 'juice', 'sand']); return { wb: wideBottom, h1: h1, h2: h2, H: h1 + h2, v: v }; },
      stem: function (s) {
        var W = 3.2, N = 1.1, y1 = s.h1 / s.H * 6, bw = s.wb ? W : N, tw = s.wb ? N : W;
        var pts = [[-bw / 2, 0], [-bw / 2, y1], [-tw / 2, y1], [-tw / 2, 6], [tw / 2, 6], [tw / 2, y1], [bw / 2, y1], [bw / 2, 0], [-bw / 2, 0]];
        var cont = fig({ x: [-2.5, 2.5], y: [-0.3, 6.6], grid: 0, labels: 0, unit: 26, xName: ' ', yName: ' ', segs: [{ pts: pts, color: INK }], max: 140, aria: 'the container', notes: [{ x: 1.8, y: y1 / 2, text: s.h1 + ' cm', size: 11, anchor: 'start' }, { x: 1.8, y: (y1 + 6) / 2, text: s.h2 + ' cm', size: 11, anchor: 'start' }] }).replace(/<line[^>]*marker-end="url\(#gArr\)"[^>]*\/>/g, '');
        return 'The container is made of a ' + (s.wb ? 'wide cylinder with a narrow cylinder on top' : 'narrow cylinder with a wide cylinder on top') + '; the lower part is ' + t(s.h1) + ' cm tall and the upper part ' + t(s.h2) + ' cm. ' + s.v.charAt(0).toUpperCase() + s.v.slice(1) + ' is poured in at a <b>steady rate</b> from empty until the container is full.<div class="fig">' + cont + '</div>';
      }, parts: [
      { id: 'e9a', level: 'PRG', make: function (r, s) {
        var inp = { x: [0, 12], y: [0, s.H + 2], grid: 1, gridY: 2, labelsX: 0, labelsY: 4, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time', yTitle: 'Height (cm)', unitX: 25, unitY: 220 / (s.H + 2), snapX: 1, snapY: 1, tools: ['line'], defaultEnd: 'none', max: 360 };
        var base = K.graphStory({ phases: [{ dir: 'up', text: 'filling the ' + (s.wb ? 'wide' : 'narrow') + ' lower part' }, s.wb ? { dir: 'up', text: 'filling the narrow upper part', steeper: 0 } : { dir: 'up', text: 'filling the wide upper part' }], start: 0, startHint: 'The container starts empty: the height starts at ' + t('0') + '.', end: s.H, endHint: 'It ends full: height ' + t(s.H) + ' cm.' });
        var chk = function (v) {
          var res = base(v); if (res.v !== 'correct') return res;
          var S = DR.phases(v).phases;
          if (!near(S[0].y1, s.h1)) return wrong('story-height', 'The change of steepness happens where the container changes width: at a height of ' + t(s.h1) + ' cm.');
          if (!s.wb && !(Math.abs(S[1].m) < Math.abs(S[0].m) - 1e-9)) return wrong('story-steep', 'The upper part is <b>wide</b>: it takes more ' + s.v + ' per centimetre, so the level rises <b>more slowly</b> there — the second piece is less steep.');
          return ok();
        };
        var key = s.wb ? poly([[0, 0], [7, s.h1], [10, s.H]]) : poly([[0, 0], [3, s.h1], [10, s.H]]);
        var p = B.graph('Sketch the height of the ' + s.v + ' against time on the grid (no time scale — only the shape matters, but use the heights).', inp, chk, key,
          '<b>Two straight pieces:</b> ' + (s.wb ? 'a gentle one from ' + t('(0,\\ 0)') + ' up to ' + t(s.h1) + ' cm (the wide part), then a steeper one up to ' + t(s.H) + ' cm (the narrow part).' : 'a steep one from ' + t('(0,\\ 0)') + ' up to ' + t(s.h1) + ' cm (the narrow part), then a gentler one up to ' + t(s.H) + ' cm (the wide part).'),
          ['Each cylinder has a constant width, so each part fills at a steady rate: a straight piece.', 'A narrow part fills faster (steeper).'], 'EP container sketch');
        p.bad = [poly([[0, 0], [10, s.H]]), s.wb ? poly([[0, 0], [3, s.h1], [10, s.H]]) : poly([[0, 0], [7, s.h1], [10, s.H]]), poly([[0, 0], [5, s.h1 + 2], [10, s.H]])];
        return p;
      } },
      { id: 'e9b', level: 'EMG', make: function (r, s) {
        return mcG(r, '(a) Is the graph one straight line, or two straight pieces? Why?', [
          { html: 'Two pieces: the container changes width partway up, and each cylinder on its own has a constant width, so each part gives a straight segment.', right: true },
          { html: 'One straight line: the ' + s.v + ' is poured at a steady rate.', why: 'The volume rises steadily, but the <b>height</b> rises at different rates in the wide and narrow parts.' },
          { html: 'A curve: the height always rises faster and faster.', why: 'Inside one cylinder the width doesn’t change, so the height rises at a constant rate there.' },
          { html: 'Two pieces, because the ' + s.v + ' is poured faster into the top.', why: 'The pouring rate is steady the whole time. What changes is the width.' }],
          'Two straight pieces. Within each cylinder the width is constant, so at a steady pour the height rises at a constant rate (straight); the rate changes where the width changes.', ['What changes partway up?'], 'EP two pieces why');
      } },
      { id: 'e9c', level: 'EMG', make: function (r, s) {
        var up = s.wb ? 'upper' : 'lower';
        return mcG(r, '(b) Which piece is steeper, and why?', [
          { html: 'The ' + up + ' piece: the narrow part holds less ' + s.v + ' per centimetre of height, so at the same pour rate the level climbs faster there.', right: true },
          { html: 'The ' + (s.wb ? 'lower' : 'upper') + ' piece: the wide part holds more, so it fills faster.', why: 'Holding more per centimetre means the level rises <b>more slowly</b>.' },
          { html: 'The upper piece, because it is higher.', why: 'Height on the graph isn’t steepness.' + (s.wb ? '' : ' Here the upper part is wide.') },
          { html: 'They are equally steep, because the pour rate is steady.', why: 'The volume rate is steady, but the height rate depends on the width.' }],
          'The narrow part (' + up + ') needs less ' + s.v + ' to rise 1 cm, so the level climbs faster there: a steeper piece.', ['Which part needs less ' + s.v + ' to rise 1 cm?'], 'EP which steeper');
      } }] },
    /* ---------------- Extra 10: runner graphs ---------------- */
    { num: '10', section: 'Extra practice D — Impossible graphs and error analysis', shared: function (r) {
        var G = { vert: [[0, 0], [1.1, 1.2], [1.1, 2.3], [2.4, 2.6]], back: [[0, 0], [1.9, 1.5], [0.9, 2.2], [2.4, 2.6]], ok: [[0, 0], [0.9, 1.3], [1.5, 1.3], [2.4, 2.6]], below: [[0, 1.4], [1.2, -0.7], [2.4, 2.2]] };
        var order = r.shuffle(['vert', 'back', 'ok', 'below']), L = {}; order.forEach(function (k, i) { L[k] = 'ABCD'.charAt(i); });
        return { G: G, order: order, L: L, who: pick(r, ['a runner', 'a runner', 'a swimmer', 'a cyclist', 'a skier']) };
      }, stem: function (s) { return 'Each graph below is offered as a picture of ' + s.who + '’s <b>distance from the start line</b> during a race.<div style="display:flex;flex-wrap:wrap;gap:6px">' + s.order.map(function (k, i) { return '<div style="text-align:center"><b>' + 'ABCD'.charAt(i) + '</b><br>' + fig({ x: [0, 2.8], y: [k === 'below' ? -1 : 0, 3], grid: 0, labels: 0, firstQuadrant: k !== 'below', unit: 48, xName: ' ', yName: ' ', xTitle: 'Time', segs: [{ pts: s.G[k] }], max: 150 }) + '</div>'; }).join('') + '</div>'; }, parts: [
      { id: 'e10a', level: 'EMG', make: function (r, s) {
        return mcG(r, '(a) Exactly one graph could really happen. Which one?', 'ABCD'.split('').map(function (c, i) { var k = s.order[i]; return { html: 'Graph ' + c, right: k === 'ok', why: { vert: 'This one has a vertical piece: many distances at one instant.', back: 'This one doubles back to the left: time would run backwards.', below: 'This one dips below the time axis: a negative distance.' }[k] }; }),
          'Graph ' + s.L.ok + ': it only moves left to right, never goes below the axis, and has no vertical piece (a flat part just means the ' + s.who.split(' ')[1] + ' paused).', ['Check each graph for: vertical pieces, going backwards in time, negative distances.'], 'EP possible graph', true);
      } },
      { id: 'e10b', level: 'PRG', outcome: 'RF2', make: function (r, s) {
        return mcG(r, '(b) Graph ' + s.L.vert + ' contains a vertical segment. Why is this impossible?', [
          { html: 'It says the ' + s.who.split(' ')[1] + ' was at many different distances at the <b>same</b> instant. A vertical line meets the graph more than once, so it fails the vertical line test.', right: true },
          { html: 'It means the ' + s.who.split(' ')[1] + ' was going very fast, which is not allowed.', why: 'Going fast is a steep segment, but still slanted. Vertical means zero time passes.' },
          { html: 'Vertical segments are only allowed on speed graphs.', why: 'No graph of a quantity against time can have a vertical piece: one time, many values.' },
          { html: 'It means the ' + s.who.split(' ')[1] + ' stopped.', why: 'A stop is a <b>flat</b> (horizontal) segment.' }],
          'A vertical segment means infinitely many distances at one time — the ' + s.who.split(' ')[1] + ' would jump forward instantly. A vertical line meets the graph more than once: it fails the vertical line test and is not a function of time.', ['How much time passes along a vertical segment?'], 'EP vertical impossible');
      } },
      { id: 'e10c', level: 'EMG', make: function (r, s) {
        return mcG(r, '(c) What is impossible about Graph ' + s.L.back + '?', [
          { html: 'It doubles back to the left, so time would run backwards — and one time would give two distances.', right: true },
          { html: 'It goes down, so the distance decreases.', why: 'Distance from the start can decrease (running back). Look at the direction of time.' },
          { html: 'It has no flat part.', why: 'A race graph doesn’t need a stop.' },
          { html: 'It ends higher than it starts.', why: 'That is expected in a race. Look at the middle piece.' }],
          'Graph ' + s.L.back + ' moves to the <b>left</b> in its middle piece: time only moves forward, and a vertical line through that part meets the graph more than once.', ['Which way does the middle piece go?'], 'EP doubles back');
      } },
      { id: 'e10d', level: 'EMG', make: function (r, s) {
        return mcG(r, '(d) What is impossible about Graph ' + s.L.below + '? (Think about what the horizontal axis means.)', [
          { html: 'It dips below the time axis, giving a <b>negative</b> distance from the start line. A distance is never negative.', right: true },
          { html: 'It starts above ' + t('0') + ', so the race didn’t start at the start line.', why: 'That alone could happen (a head start). Look where the graph goes below the axis.' },
          { html: 'It goes down and then up.', why: 'Running back toward the start and then away again is possible. The problem is the part under the axis.' },
          { html: 'It fails the vertical line test.', why: 'Each time has one value here. The problem is the sign of the distance.' }],
          'The horizontal axis is distance ' + t('0') + '. Graph ' + s.L.below + ' goes below it — a negative distance, which is impossible: going behind the start line would make the distance grow again, not turn negative.', ['What does a point below the horizontal axis mean?'], 'EP negative distance');
      } }] },
    /* ---------------- Extra 11: Dev's walk ---------------- */
    { num: '11', shared: function (r) {
        for (var k = 0; k < 400; k++) {
          var r1 = pick(r, [80, 80, 60, 100, 70]), t1 = pick(r, [10, 10, 8, 12]), p = pick(r, [5, 5, 4, 6]), r3 = pick(r, [120, 120, 100, 90, 150]), t3 = pick(r, [10, 10, 8, 12]);
          if (r3 === r1 || r1 * p > r1 * t1) continue;
          var nm = pick(r, [['Dev', 'Rowan'], ['Dev', 'Rowan'], ['Lina', 'Marco'], ['Sol', 'Kira'], ['Ty', 'Ada']]);
          return { r1: r1, t1: t1, p: p, r3: r3, t3: t3, d1: r1 * t1, d3: r1 * t1 + r3 * t3, T: t1 + p + t3, nm: nm };
        }
      }, stem: function (s) { var V = [[0, 0], [s.t1, s.d1], [s.t1 + s.p, s.d1], [s.T, s.d3]], ym = Math.ceil((s.d3 + 200) / 400) * 400; return 'The graph shows ' + s.nm[0] + '’s distance from home on a ' + t(s.T) + '-minute walk. A classmate, ' + s.nm[1] + ', wrote: “Between ' + t(s.t1) + ' and ' + t(s.t1 + s.p) + ' minutes the graph is flat, so ' + s.nm[0] + ' turned around and walked back toward home during those ' + t(s.p) + ' minutes.”' +
        '<div class="fig">' + fig({ x: [0, s.T + 3], y: [0, ym], grid: 1, gridY: 100, labelsX: 5, labelsY: 400, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time (min)', yTitle: 'Distance from home (m)', unitX: 300 / (s.T + 3), unitY: 210 / ym, max: 360, segs: [{ pts: V }], aria: 'graph of the walk' }) + '</div>'; }, parts: [
      { id: 'e11a', level: 'EMG', make: function (r, s) {
        return mcG(r, '(a) Why is ' + s.nm[1] + ' wrong, and what actually happened between ' + t(s.t1) + ' and ' + t(s.t1 + s.p) + ' minutes?', [
          { html: 'Flat means <b>no change</b> in distance from home: ' + s.nm[0] + ' stood still, staying ' + t(s.d1) + ' m from home. Walking back would be a <b>falling</b> segment.', right: true },
          { html: s.nm[1] + ' is right: a flat segment means turning around.', why: 'Turning around and walking home would make the distance from home <b>decrease</b>.' },
          { html: s.nm[0] + ' was walking at a constant speed.', why: 'Walking would change the distance from home. Flat means it isn’t changing.' },
          { html: s.nm[0] + ' was walking very slowly back toward home.', why: 'Even walking slowly back would make the graph fall a little. Flat means no change at all.' }],
          'A flat segment means the distance from home is not changing: ' + s.nm[0] + ' stood still for ' + t(s.p) + ' minutes, ' + t(s.d1) + ' m from home. Walking back toward home would show as a falling segment.', ['On a distance-from-home graph, what does flat mean?'], 'EP flat is not back');
      } },
      { id: 'e11b', level: 'PRG', make: function (r, s) {
        var d = s.d1 - s.r1 * s.p;
        return numPart('(b) If ' + s.nm[0] + ' really had walked back toward home for those ' + t(s.p) + ' minutes at the original pace, the graph would fall from ' + t(ptT([s.t1, s.d1])) + '. How far from home would ' + s.nm[0] + ' then have been at ' + t(s.t1 + s.p) + ' minutes?', d,
          [{ v: s.d1, code: 'value', hint: 'Walking back makes the distance from home go <b>down</b>. Subtract what ' + s.nm[0] + ' walks in ' + t(s.p) + ' minutes.' }, { v: s.d1 + s.r1 * s.p, code: 'rate-sign', hint: 'Walking <b>back toward home</b> makes the distance smaller: subtract.' }, { v: s.r1 * s.p, code: 'value', hint: 'That is how far ' + s.nm[0] + ' walks back. Subtract it from ' + t(s.d1) + ' m.' }],
          'Original pace: ' + t(s.d1 + '\\div ' + s.t1 + '=' + s.r1) + ' m/min. Back for ' + t(s.p) + ' min: ' + t(s.d1 + '-' + s.p + '(' + s.r1 + ')=' + d) + ' m, the point ' + t(ptT([s.t1 + s.p, d])) + '.', ['Find the original pace from the first segment.', 'Walking back subtracts distance.'], 'EP walk back', { after: 'm' });
      } },
      { id: 'e11c', level: 'EMG', make: function (r, s) {
        var dd = s.d3 - s.d1;
        return B.fields('(c) Determine ' + s.nm[0] + '’s rate of change, in metres per minute, on each of the three segments.', [box('First segment:', 'm/min'), box('Second segment:', 'm/min'), box('Third segment:', 'm/min')],
          [K.number(s.r1, numDiag(s.r1, rateCands(s.d1, s.t1, s.r1))), K.number(0), K.number(s.r3, numDiag(s.r3, rateCands(dd, s.t3, s.r3).concat([{ v: s.d3 / s.T, code: 'u5l11-rate-days', hint: 'Use only the third segment: change in distance ÷ change in time on that segment.' }, { v: s.d3 / s.t3, code: 'u5l11-rate-days', hint: 'Use the <b>change</b> in distance on the third segment: ' + t(s.d3 + '-' + s.d1) + '.' }])))],
          [String(s.r1), '0', String(s.r3)], t(s.r1) + ', ' + t('0') + ', ' + t(s.r3) + ' m/min',
          t('\\frac{' + s.d1 + '}{' + s.t1 + '}=' + s.r1) + ' m/min; ' + t('0') + ' m/min (flat); ' + t('\\frac{' + s.d3 + '-' + s.d1 + '}{' + s.T + '-' + (s.t1 + s.p) + '}=\\frac{' + dd + '}{' + s.t3 + '}=' + s.r3) + ' m/min.', ['Change in distance ÷ change in time, one segment at a time.'], 'EP three rates');
      } },
      { id: 'e11d', level: 'BEG', make: function (r, s) {
        var fast = s.r3 > s.r1 ? 'third' : 'first';
        return mcG(r, 'Which segment is the fastest?', [
          { html: 'The first segment', right: fast === 'first', why: 'Compare the rates: ' + t(s.r1) + ' and ' + t(s.r3) + ' m/min.' }, { html: 'The second segment', why: 'The second segment is flat: rate ' + t('0') + '.' }, { html: 'The third segment', right: fast === 'third', why: 'Compare the rates: ' + t(s.r1) + ' and ' + t(s.r3) + ' m/min.' }],
          'The ' + fast + ' segment: ' + t(Math.max(s.r1, s.r3)) + ' m/min, the greatest rate (the steepest segment).', ['Biggest rate = steepest = fastest.'], 'EP fastest segment', true);
      } }] },
    /* ---------------- Extra 12 – 13 ---------------- */
    { num: '12', stem: '', parts: [
      { id: 'e12', level: 'PRG', make: function (r) {
        var v0 = pick(r, [60, 60, 50, 80, 90, 100]), m = pick(r, [3, 3, 2, 4, 5]), what = pick(r, ['car', 'car', 'bus', 'truck', 'train']);
        return mcG(r, 'A graph of a ' + what + '’s <b>speed</b> against time falls steadily from ' + t(v0) + ' km/h to ' + t('0') + ' km/h over the last ' + t(m) + ' minutes of a trip. A student writes: “The graph goes down, so the ' + what + ' was reversing.” Which statement is correct?', [
          { html: 'On a speed graph, falling means the speed is getting smaller — the ' + what + ' is slowing down (braking). It is still moving forward until the instant its speed reaches ' + t('0') + '.', right: true },
          { html: 'The student is right: a falling graph means going backwards.', why: 'That would only be true on a graph of distance or position. Here the graph shows <b>speed</b>.' },
          { html: 'The ' + what + ' was stopped for the whole ' + t(m) + ' minutes.', why: 'Stopped would be a flat segment at ' + t('0') + '. Here the speed is above ' + t('0') + ' until the very end.' },
          { html: 'The ' + what + ' was speeding up, because the graph is steep.', why: 'Steep means the speed changes quickly; falling means it is decreasing.' }],
          'A falling segment on a <b>speed</b>–time graph means the speed is decreasing: the ' + what + ' is braking. Its speed is positive until the instant it reaches ' + t('0') + ', so it keeps moving forward the whole time until it stops. Reversing would only show as going down on a distance or position graph.', ['What does the vertical axis measure here?'], 'EP falling speed not reversing');
      } }] },
    { num: '13', stem: '', parts: [
      { id: 'e13', level: 'PRG', make: function (r) {
        var k = pick(r, [2, 2, 3]), word = k === 2 ? 'twice' : 'three times', g = pick(r, [0.5, 1, 1, 1.5]), t1 = pick(r, [1, 2]), t2 = pick(r, [4, 5, 6, 8]).valueOf(), d1 = k * g * t1, d2 = g * t2;
        if (d1 >= d2) { t2 = Math.ceil(d1 / g) + 2; d2 = g * t2; }
        var mv = pick(r, [['driving', 'walking'], ['cycling', 'walking'], ['driving', 'cycling'], ['running', 'walking']]);
        var who = pick(r, ['Jamal', 'Ines', 'Kofi', 'Ana', 'Theo', 'Lena', 'Sam']);
        return mcG(r, 'On a distance–time graph of a trip that is partly ' + mv[0] + ' and partly ' + mv[1] + ', one segment is ' + word + ' as steep as another. ' + who + ' concludes: “So that part of the trip is ' + word + ' as long.” Which statement is correct?', [
          { html: 'Steepness is a rate (distance per unit of time), so ' + word + ' as steep means ' + word + ' as <b>fast</b> — not ' + word + ' as far or as long. For example, ' + mv[0] + ' ' + dn(d1) + ' km in ' + t1 + ' minute' + (t1 > 1 ? 's' : '') + ' is ' + word + ' as steep as ' + mv[1] + ' ' + dn(d2) + ' km in ' + t2 + ' minutes, yet it is the shorter part.', right: true },
          { html: 'The student is right: a steeper segment always covers more distance.', why: 'A steep segment can be short: fast, but only for a moment.' },
          { html: 'A steeper segment takes ' + word + ' as long.', why: 'Steepness compares distance to time; it says nothing about how long the part lasts.' },
          { html: 'Steepness measures how far from home the trip goes.', why: 'That is the height of the graph, not its steepness.' }],
          'Steepness = change in distance ÷ change in time = speed. Twice as steep means twice as fast. A part can be fast and short: ' + dn(d1) + ' km in ' + t1 + ' min (steep) versus ' + dn(d2) + ' km in ' + t2 + ' min (gentle).', ['What does steepness measure?'], 'EP steepness is speed');
      } }] },
    /* ---------------- Extra 14: two cyclists ---------------- */
    { num: '14', section: 'Extra practice E — Comparing two journeys on one set of axes', shared: function (r) {
        for (var k = 0; k < 2000; k++) {
          var L = pick(r, [12, 12, 10, 15, 9, 16]), TA = pick(r, [60, 60, 45, 50, 75, 40]), s = pick(r, [20, 20, 10, 15, 25]), TB = pick(r, [30, 30, 20, 25, 40, 24]);
          var vA = L * 60 / TA, vB = L * 60 / TB; if (!Number.isInteger(vA) || !Number.isInteger(vB) || s + TB >= TA || TB >= TA) continue;
          var tc = s * TA / (TA - TB), dc = L * tc / TA; if (!Number.isInteger(tc) || Math.abs(dc * 2 - Math.round(dc * 2)) > 1e-9) continue;
          var te = pick(r, [30, 30, 35, 25, 40].filter(function (x) { return x > s && x < tc; })); if (te == null) continue;
          var gap = L * te / TA - L * (te - s) / TB; if (Math.abs(gap * 2 - Math.round(gap * 2)) > 1e-9) continue;
          var nm = pick(r, [['Alina', 'Bo'], ['Alina', 'Bo'], ['Nora', 'Sid'], ['Jade', 'Ravi'], ['Ella', 'Tomas']]);
          return { L: L, TA: TA, s: s, TB: TB, vA: vA, vB: vB, tc: tc, dc: dc, te: te, gap: gap, nm: nm };
        }
      }, stem: function (c) { var X = c.TA + 10; return c.nm[0] + ' and ' + c.nm[1] + ' cycle the same ' + t(c.L) + ' km route. Both journeys are shown on one grid (' + c.nm[0] + ': solid line; ' + c.nm[1] + ': dashed line).' +
        '<div class="fig">' + fig({ x: [0, X], y: [0, c.L + 2], grid: 5, gridY: 1, labelsX: 10, labelsY: 2, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time after ' + c.nm[0] + ' starts (min)', yTitle: 'Distance (km)', unitX: 320 / X, unitY: 200 / (c.L + 2), max: 380,
          segs: [{ pts: [[0, 0], [c.TA, c.L]], color: C1 }, { pts: [[c.s, 0], [c.s + c.TB, c.L]], color: C2, dash: true }], notes: [{ x: c.TA * 0.22, y: c.L * 0.22 + c.L * 0.08, text: c.nm[0], color: C1, size: 12, anchor: 'end' }, { x: c.s + c.TB * Math.min(0.95, (c.tc - c.s) / c.TB + 0.22) - 1.5, y: c.L * Math.min(0.95, (c.tc - c.s) / c.TB + 0.22), text: c.nm[1], color: C2, size: 12, anchor: 'end' }], aria: 'two cyclists' }) + '</div>'; }, parts: [
      { id: 'e14a', level: 'BEG', make: function (r, c) {
        return mcG(r, '(a) Who starts first, and by how many minutes?', [
          { html: c.nm[0] + ', by ' + t(c.s) + ' minutes', right: true }, { html: c.nm[1] + ', by ' + t(c.s) + ' minutes', why: c.nm[1] + '’s line starts at ' + t(c.s) + ' min on the time axis — later.' },
          { html: c.nm[0] + ', by ' + t(c.TA - c.s - c.TB) + ' minutes', why: 'That is the difference in finishing times. Look where each line <b>starts</b>.' }, { html: 'They start together', why: 'The lines start at different times on the horizontal axis.' }],
          c.nm[0] + '’s line starts at ' + t('0') + ' min, ' + c.nm[1] + '’s at ' + t(c.s) + ' min: ' + c.nm[0] + ' starts first, by ' + t(c.s) + ' minutes.', ['Where does each line meet the time axis?'], 'EP who starts');
      } },
      { id: 'e14b', level: 'EMG', make: function (r, c) {
        return B.fields('(b) Determine each cyclist’s speed in km/h.', [box(c.nm[0] + ':', 'km/h'), box(c.nm[1] + ':', 'km/h')],
          [K.number(c.vA, numDiag(c.vA, [{ v: c.L / c.TA, code: 'per-min', hint: 'That is km per <b>minute</b>. Multiply by ' + t('60') + ' for km/h.' }])), K.number(c.vB, numDiag(c.vB, [{ v: c.L / c.TB, code: 'per-min', hint: 'That is km per minute. Multiply by ' + t('60') + '.' }, { v: c.L * 60 / (c.s + c.TB), code: 'wrong-line', hint: c.nm[1] + ' starts at ' + t(c.s) + ' min: the ride takes ' + t(c.s + c.TB + '-' + c.s + '=' + c.TB) + ' min.' }]))],
          [String(c.vA), String(c.vB)], t(c.vA) + ' km/h, ' + t(c.vB) + ' km/h',
          c.nm[0] + ': ' + t(c.L + '\\div ' + c.TA + '=' + dn(c.L / c.TA)) + ' km/min ' + t('=' + c.vA) + ' km/h.<br>' + c.nm[1] + ': ' + t(c.L + '\\div ' + c.TB + '=' + dn(c.L / c.TB)) + ' km/min ' + t('=' + c.vB) + ' km/h.', ['Distance ÷ time for each, then × 60 for km/h.'], 'EP two speeds');
      } },
      { id: 'e14c', level: 'ADV', make: function (r, c) {
        return B.fields('(c) At what time does ' + c.nm[1] + ' catch up to ' + c.nm[0] + ', and how far along the route are they at that moment?', [box('Time:', 'min'), box('Distance:', 'km')],
          [K.number(c.tc, numDiag(c.tc, [{ v: c.tc - c.s, code: 'wrong-line', hint: 'Give the time on the graph’s axis (minutes after ' + c.nm[0] + ' starts).' }])), K.number(c.dc)], [String(c.tc), dn(c.dc)], t(c.tc) + ' min, ' + t(dn(c.dc)) + ' km',
          'The lines cross at ' + t(ptT([c.tc, c.dc])) + '. Check: ' + c.nm[0] + ' has ridden ' + t(c.tc) + ' min at ' + t(c.vA) + ' km/h ' + t('=' + dn(c.dc)) + ' km; ' + c.nm[1] + ' has ridden ' + t(c.tc - c.s) + ' min at ' + t(c.vB) + ' km/h ' + t('=' + dn(c.dc)) + ' km.', ['Where do the two lines cross?'], 'EP catch up');
      } },
      { id: 'e14d', level: 'EMG', make: function (r, c) {
        var fb = c.s + c.TB, diff = c.TA - fb;
        return mcG(r, '(d) Who finishes first, and by how many minutes?', [
          { html: c.nm[1] + ', by ' + t(diff) + ' minutes', right: true }, { html: c.nm[0] + ', by ' + t(diff) + ' minutes', why: c.nm[0] + ' reaches ' + t(c.L) + ' km at ' + t(c.TA) + ' min; ' + c.nm[1] + ' at ' + t(fb) + ' min.' },
          { html: c.nm[1] + ', by ' + t(c.TA - c.TB) + ' minutes', why: 'Compare the finishing <b>times</b> on the axis: ' + t(fb) + ' and ' + t(c.TA) + ' min.' }, { html: 'They finish together', why: 'Look where each line reaches ' + t(c.L) + ' km.' }],
          c.nm[1] + ' finishes at ' + t(fb) + ' min, ' + c.nm[0] + ' at ' + t(c.TA) + ' min: ' + c.nm[1] + ' is first by ' + t(diff) + ' minutes.', ['When does each line reach the end of the route?'], 'EP finish first');
      } },
      { id: 'e14e', level: 'PRG', make: function (r, c) {
        var a = c.L * c.te / c.TA, b = c.L * (c.te - c.s) / c.TB;
        return numPart('(e) How far apart are the two cyclists ' + t(c.te) + ' minutes after ' + c.nm[0] + ' starts?', c.gap, [{ v: a, code: 'value', hint: 'That is where ' + c.nm[0] + ' is. Subtract where ' + c.nm[1] + ' is.' }, { v: c.L * c.te / c.TB - a, code: 'wrong-line', hint: c.nm[1] + ' has only been riding for ' + t(c.te - c.s) + ' minutes.' }],
          'At ' + t(c.te) + ' min: ' + c.nm[0] + ' is at ' + t(dn(a)) + ' km and ' + c.nm[1] + ' at ' + t(dn(b)) + ' km, so they are ' + t(dn(c.gap)) + ' km apart.', ['Read each line at the same time.'], 'EP gap', { after: 'km' });
      } }] },
    /* ---------------- Extra 15: two candles ---------------- */
    { num: '15', shared: function (r) {
        for (var k = 0; k < 2000; k++) {
          var H1 = pick(r, [24, 24, 20, 30, 16]), T1 = pick(r, [12, 12, 10, 8, 6, 15]), H2 = pick(r, [18, 18, 15, 12, 20]), T2 = pick(r, [18, 18, 15, 20, 12, 24]);
          var a = H1 / T1, b = H2 / T2; if (!(H2 < H1 && T2 > T1 && a > b)) continue;
          var ts = (H1 - H2) / (a - b), hs = H1 - a * ts; if ((a * 2) % 1 || (b * 2) % 1 || !Number.isInteger(ts) || ts >= T1 || Math.abs(hs * 2 - Math.round(hs * 2)) > 1e-9) continue;
          var tq = pick(r, [4, 4, 2, 3, 5].filter(function (x) { return x < ts; })); if (tq == null) continue;
          return { H1: H1, T1: T1, H2: H2, T2: T2, a: a, b: b, ts: ts, hs: hs, tq: tq };
        }
      }, stem: function (c) { var X = c.T2 + 2; return 'Two candles are lit at the same moment. Candle ' + t('X') + ' starts at ' + t(c.H1) + ' cm and Candle ' + t('Y') + ' starts at ' + t(c.H2) + ' cm; both burn at steady rates, shown on the grid (' + t('X') + ': solid; ' + t('Y') + ': dashed).' +
        '<div class="fig">' + fig({ x: [0, X], y: [0, c.H1 + 2], grid: 1, gridY: 1, labelsX: 2, labelsY: 4, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time (h)', yTitle: 'Height (cm)', unitX: 320 / X, unitY: 210 / (c.H1 + 2), max: 380,
          segs: [{ pts: [[0, c.H1], [c.T1, 0]], color: C1 }, { pts: [[0, c.H2], [c.T2, 0]], color: C2, dash: true }], notes: [{ x: c.T1 * 0.2, y: c.H1 * 0.8 + 1.2, text: 'X', color: C1, size: 13, bold: true, anchor: 'start' }, { x: c.T2 * 0.75, y: c.H2 * 0.25 + 1.3, text: 'Y', color: C2, size: 13, bold: true }], aria: 'two candles' }) + '</div>'; }, parts: [
      { id: 'e15a', sub: 'a i', level: 'EMG', make: function (r, c) {
        return B.fields('(a) State the rate at which each candle burns, in cm per hour.', [box('Candle X:', 'cm/h'), box('Candle Y:', 'cm/h')],
          [K.number(c.a, numDiag(c.a, [{ v: c.T1 / c.H1, code: 'rate-flip', hint: 'Divide the height lost by the time: ' + t(c.H1 + '\\div ' + c.T1) + '.' }, { v: -c.a, code: 'rate-sign', hint: 'A burning <b>rate</b> is positive (it loses this many cm each hour).' }])), K.number(c.b, numDiag(c.b, [{ v: c.T2 / c.H2, code: 'rate-flip', hint: 'Divide the height lost by the time: ' + t(c.H2 + '\\div ' + c.T2) + '.' }, { v: -c.b, code: 'rate-sign', hint: 'A burning <b>rate</b> is positive.' }]))],
          [dn(c.a), dn(c.b)], t('X') + ': ' + t(dn(c.a)) + ' cm/h; ' + t('Y') + ': ' + t(dn(c.b)) + ' cm/h',
          t('X') + ' loses ' + t(c.H1) + ' cm in ' + t(c.T1) + ' h: ' + t(dn(c.a)) + ' cm/h. ' + t('Y') + ' loses ' + t(c.H2) + ' cm in ' + t(c.T2) + ' h: ' + t(dn(c.b)) + ' cm/h.', ['Height lost ÷ time to burn out.'], 'EP candle rates');
      } },
      { id: 'e15b', sub: 'a ii', level: 'BEG', make: function (r, c) {
        return mcG(r, 'Which candle burns faster, and how does the graph show it?', [
          { html: 'Candle ' + t('X') + ': its line is steeper.', right: true }, { html: 'Candle ' + t('Y') + ': its line is longer.', why: 'A longer line means it lasts longer — it burns more slowly.' },
          { html: 'Candle ' + t('X') + ': it starts taller.', why: 'Starting height isn’t speed. Compare the steepness.' }, { html: 'They burn at the same rate.', why: 'Compare the rates: ' + t(dn(c.a)) + ' and ' + t(dn(c.b)) + ' cm/h.' }],
          'Candle ' + t('X') + ' (' + t(dn(c.a)) + ' cm/h versus ' + t(dn(c.b)) + ' cm/h): its line is steeper.', ['Steeper = faster change.'], 'EP faster candle');
      } },
      { id: 'e15c', sub: 'b', level: 'ADV', make: function (r, c) {
        return B.fields('(b) At what time are the two candles the same height, and what is that height?', [box('Time:', 'h'), box('Height:', 'cm')], [K.number(c.ts), K.number(c.hs)], [String(c.ts), dn(c.hs)], t(c.ts) + ' h, ' + t(dn(c.hs)) + ' cm',
          'The lines cross at ' + t(ptT([c.ts, c.hs])) + ': after ' + t(c.ts) + ' h, both are ' + t(dn(c.hs)) + ' cm. (Check: ' + t(c.H1 + '-' + dn(c.a) + '(' + c.ts + ')=' + c.H2 + '-' + dn(c.b) + '(' + c.ts + ')=' + dn(c.hs)) + '.)', ['Where do the lines cross?'], 'EP candles equal');
      } },
      { id: 'e15d', sub: 'c', level: 'EMG', make: function (r, c) {
        var x = c.H1 - c.a * c.tq, y = c.H2 - c.b * c.tq, d = x - y;
        return mcG(r, '(c) Which candle is taller after ' + t(c.tq) + ' hours, and by how much?', [
          { html: t('X') + ', by ' + t(dn(d)) + ' cm', right: true }, { html: t('Y') + ', by ' + t(dn(d)) + ' cm', why: 'Read both lines at ' + t(c.tq) + ' h: ' + t('X') + ' is higher.' },
          { html: t('X') + ', by ' + t(dn(c.H1 - c.H2)) + ' cm', why: 'That is the difference at the start. ' + t('X') + ' burns faster, so the gap shrinks.' }, { html: 'They are the same height', why: 'They are equal only at ' + t(c.ts) + ' h.' }],
          'After ' + t(c.tq) + ' h: ' + t('X=' + c.H1 + '-' + dn(c.a) + '(' + c.tq + ')=' + dn(x)) + ' cm and ' + t('Y=' + c.H2 + '-' + dn(c.b) + '(' + c.tq + ')=' + dn(y)) + ' cm: ' + t('X') + ' is taller by ' + t(dn(d)) + ' cm.', ['Find both heights at ' + t(c.tq) + ' h.'], 'EP taller at t');
      } },
      { id: 'e15e', sub: 'd', level: 'EMG', outcome: 'RF5', make: function (r, c) {
        return B.fields('(d) Each line has a horizontal intercept. After how many hours does each candle burn out?', [box('Candle X burns out after', 'h'), box('Candle Y burns out after', 'h')], [K.number(c.T1, numDiag(c.T1, [{ v: c.H1, code: 'xint-yint', hint: 'That is the starting height (the vertical intercept). The horizontal intercept is where the height is ' + t('0') + '.' }])), K.number(c.T2, numDiag(c.T2, [{ v: c.H2, code: 'xint-yint', hint: 'That is the starting height. Read where the dashed line meets the time axis.' }]))],
          [String(c.T1), String(c.T2)], t(ptT([c.T1, 0])) + ' and ' + t(ptT([c.T2, 0])), t(ptT([c.T1, 0])) + ': candle ' + t('X') + ' burns out after ' + t(c.T1) + ' h; ' + t(ptT([c.T2, 0])) + ': candle ' + t('Y') + ' burns out after ' + t(c.T2) + ' h. A horizontal intercept is where the height is ' + t('0') + '.', ['Where does each line meet the time axis?'], 'EP candle intercepts');
      } }] },
    /* ---------------- Extra 16 – 18: stretch ---------------- */
    { num: '16', section: 'Mastery challenge — Stretch', shared: function (r) { var a = pick(r, [5, 5, 4, 6, 3]), T = pick(r, [30, 30, 40, 24]), st = pick(r, [10, 10, 8, 6, 12]), mx = pick(r, [12, 12, 10, 14]); return { a: a, T: T, st: st, mx: mx }; },
      stem: function (c) { return 'Sketch <b>one</b> graph of a car’s distance from home against time that satisfies <b>all three</b> conditions at once:<ul><li>The car is ' + t(c.a) + ' km from home at ' + t('t=0') + ' and again ' + t(c.a) + ' km from home at ' + t('t=' + c.T) + ' (minutes).</li><li>The car is stopped for exactly ' + t(c.st) + ' minutes somewhere in the middle.</li><li>The car is never more than ' + t(c.mx) + ' km from home.</li></ul>'; }, parts: [
      { id: 'e16', level: 'MAS', make: function (r, c) {
        var inp = { x: [0, c.T + 2], y: [0, c.mx + 4], grid: 1, gridY: 1, labelsX: c.T > 30 ? 10 : 5, labelsY: 2, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time (min)', yTitle: 'Distance from home (km)', unitX: 320 / (c.T + 2), unitY: 220 / (c.mx + 4), snapX: 1, snapY: 1, tools: ['line'], defaultEnd: 'none', max: 380,
          bg: { segs: [{ pts: [[0, c.mx], [c.T + 2, c.mx]], dash: true, color: '#8a93a3' }] } };
        var chk = function (v) {
          if (DR.empty(v)) return form('empty', 'Draw your graph on the grid first.');
          var ph = DR.phases(v);
          if (ph.vertical || DR.notFunction(v)) return wrong('story-fn', 'At each moment the car is at exactly one distance: no vertical pieces, and don’t go back in time.');
          if (ph.gaps.length) return wrong('story-gap', 'The car can’t jump: the pieces should join end to end.');
          var S = ph.phases; if (!S.length) return wrong('story-lines', 'Draw the graph as a line from ' + t('t=0') + ' to ' + t('t=' + c.T) + '.');
          var x0 = S[0].x0, x1 = S[S.length - 1].x1;
          if (!near(x0, 0) || !near(S[0].y0, c.a)) return wrong('u5l11-ends', 'At ' + t('t=0') + ' the car is ' + t(c.a) + ' km from home: start at ' + t(ptT([0, c.a])) + '.');
          if (!near(x1, c.T) || !near(S[S.length - 1].y1, c.a)) return wrong('u5l11-ends', 'At ' + t('t=' + c.T) + ' the car is again ' + t(c.a) + ' km from home: end at ' + t(ptT([c.T, c.a])) + '.');
          var top = Math.max.apply(null, S.map(function (p) { return Math.max(p.y0, p.y1); })), lo = Math.min.apply(null, S.map(function (p) { return Math.min(p.y0, p.y1); }));
          if (top > c.mx + 1e-9) return wrong('u5l11-limit', 'Your graph goes above ' + t(c.mx) + ' km. The car is never more than ' + t(c.mx) + ' km from home (the dashed line).');
          if (lo < -1e-9) return wrong('story-below', 'A distance from home can’t be negative.');
          var flat = S.filter(function (p) { return p.dir === 'flat'; }).reduce(function (m, p) { return m + p.x1 - p.x0; }, 0);
          if (!near(flat, c.st)) return wrong('u5l11-stop-time', 'The car is stopped (a flat piece) for ' + t(dn(flat)) + ' minutes in your graph. It must be stopped for exactly ' + t(c.st) + ' minutes.');
          if (S[0].dir === 'flat' || S[S.length - 1].dir === 'flat') return wrong('u5l11-stop-time', 'The stop is <b>in the middle</b> of the trip, so the graph should be moving at the very start and end.');
          return ok();
        };
        var mid = (c.T - c.st) / 2, keyPts = [[0, c.a], [mid, c.mx], [mid + c.st, c.mx], [c.T, c.a]];
        var p = B.graph('Sketch the graph on the grid. (The dashed line is ' + t(c.mx) + ' km.)', inp, chk, poly(keyPts),
          'Many answers. One is: ' + keyPts.map(function (q) { return t(ptT(q)); }).join(' → ') + ': drive out to ' + t(c.mx) + ' km, stop there for ' + t(c.st) + ' minutes, then drive back to ' + t(c.a) + ' km. Any graph that starts and ends at height ' + t(c.a) + ', has ' + t(c.st) + ' minutes of flat stretches in the middle, and never rises above ' + t(c.mx) + ' is acceptable.',
          ['Start at ' + t(ptT([0, c.a])) + ' and end at ' + t(ptT([c.T, c.a])) + '.', 'A stop is a flat piece: make the flat time add up to exactly ' + t(c.st) + ' minutes.'], 'EP open sketch three conditions');
        p.good = [poly([[0, c.a], [2, c.a + 2], [2 + c.st, c.a + 2], [c.T, c.a]])];
        p.bad = [poly([[0, c.a], [mid, c.mx + 2], [mid + c.st, c.mx + 2], [c.T, c.a]]), poly([[0, c.a], [mid, c.mx], [mid + c.st + 2, c.mx], [c.T, c.a]]), poly([[0, 0], [mid, c.mx], [mid + c.st, c.mx], [c.T, c.a]]), poly([[0, c.a], [c.st, c.a], [c.T, c.mx]])];
        return p;
      } }] },
    { num: '17', shared: function (r) { return { T: pick(r, [20, 20, 24, 18]), vmax: pick(r, [50, 50, 60, 40]), v: pick(r, ['bus', 'bus', 'tram', 'shuttle']) }; },
      stem: function (c) { return 'Sketch <b>one</b> speed–time graph for a ' + t(c.T) + '-minute ' + c.v + ' route that satisfies <b>all three</b> conditions at once:<ul><li>Besides the start and the finish, the ' + c.v + ' comes to a complete stop exactly three times.</li><li>The fastest stretch of the route happens between the second stop and the third stop.</li><li>The ' + c.v + ' never exceeds ' + t(c.vmax) + ' km/h.</li></ul>The ' + c.v + ' is at rest at the start and at the finish.'; }, parts: [
      { id: 'e17a', level: 'MAS', make: function (r, c) {
        var inp = { x: [0, c.T + 1], y: [0, c.vmax + 10], grid: 1, gridY: 5, labelsX: 2, labelsY: 10, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time (min)', yTitle: 'Speed (km/h)', unitX: 320 / (c.T + 1), unitY: 220 / (c.vmax + 10), snapX: 1, snapY: 5, tools: ['line'], defaultEnd: 'none', max: 380,
          bg: { segs: [{ pts: [[0, c.vmax], [c.T + 1, c.vmax]], dash: true, color: '#8a93a3' }] } };
        var chk = function (v) {
          if (DR.empty(v)) return form('empty', 'Draw your graph on the grid first.');
          var ph = DR.phases(v);
          if (ph.vertical || DR.notFunction(v)) return wrong('story-fn', 'The ' + c.v + ' has one speed at each moment: no vertical pieces, and don’t go back in time.');
          if (ph.gaps.length) return wrong('story-gap', 'A speed can’t jump: the pieces should join end to end.');
          var S = ph.phases; if (!S.length) return wrong('story-lines', 'Draw the graph as a line from ' + t('t=0') + ' to ' + t('t=' + c.T) + '.');
          if (!near(S[0].x0, 0) || !near(S[0].y0, 0)) return wrong('u5l11-ends', 'The ' + c.v + ' is at rest at the start: begin at ' + t('(0,\\ 0)') + '.');
          if (!near(S[S.length - 1].x1, c.T) || !near(S[S.length - 1].y1, 0)) return wrong('u5l11-ends', 'The route takes ' + t(c.T) + ' minutes and the ' + c.v + ' is at rest at the finish: end at ' + t(ptT([c.T, 0])) + '.');
          var vs = []; S.forEach(function (p) { vs.push([p.x0, p.y0]); }); vs.push([S[S.length - 1].x1, S[S.length - 1].y1]);
          if (vs.some(function (q) { return q[1] < -1e-9; })) return wrong('story-below', 'A speed can’t be negative.');
          if (vs.some(function (q) { return q[1] > c.vmax + 1e-9; })) return wrong('u5l11-limit', 'Your graph goes above ' + t(c.vmax) + ' km/h (the dashed line).');
          // runs of speed 0 strictly between the start and the finish
          var zeros = [], cur = null;
          vs.forEach(function (q, i) {
            var z = near(q[1], 0);
            if (z && cur) cur.x1 = q[0]; else if (z) cur = { x0: q[0], x1: q[0], i: i }; else if (cur) { zeros.push(cur); cur = null; }
          });
          if (cur) zeros.push(cur);
          var inner = zeros.filter(function (z) { return z.x0 > 1e-9 && z.x1 < c.T - 1e-9; });
          if (inner.length !== 3) return wrong('u5l11-stops', 'Count the stops between the start and the finish: your graph touches speed ' + t('0') + ' ' + inner.length + ' time' + (inner.length === 1 ? '' : 's') + ' in between. The ' + c.v + ' must stop exactly three times.');
          var seg = function (a, b) { return vs.filter(function (q) { return q[0] > a - 1e-9 && q[0] < b + 1e-9; }).reduce(function (m, q) { return Math.max(m, q[1]); }, 0); };
          var b0 = 0, b1 = inner[0].x0, b2 = inner[1].x0, b3 = inner[2].x0, mid = seg(inner[1].x1, b3), others = Math.max(seg(b0, b1), seg(inner[0].x1, b2), seg(inner[2].x1, c.T));
          if (!(mid > others + 1e-9)) return wrong('u5l11-fastest', 'The fastest stretch must come between the <b>second</b> and <b>third</b> stops: make the highest speed there, higher than anywhere else.');
          return ok();
        };
        var T = c.T, u = T / 20, sc = function (q) { return [q[0] * u, q[1]]; }, vm = c.vmax;
        var key = [[0, 0], [3, vm - 10], [5, 0], [6, 0], [8, vm - 20], [10, 0], [11, 0], [14, vm], [16, 0], [17, 0], [18, vm - 20], [20, 0]].map(sc);
        var p = B.graph('Sketch the speed–time graph on the grid. (The dashed line is ' + t(vm) + ' km/h.)', inp, chk, poly(key),
          'Many answers. One is: ' + key.map(function (q) { return t(ptT(q)); }).join(', ') + ' — three stops in the middle (flat at ' + t('0') + '), with the highest speed, ' + t(vm) + ' km/h, between the second and third stops.',
          ['A complete stop is speed ' + t('0') + ': the graph touches the time axis.', 'Make the tallest peak come after the second stop and before the third.'], 'EP open speed sketch');
        p.bad = [poly([[0, 0], [5, vm], [10, 0], [15, vm - 10], [20, 0]].map(sc)), poly([[0, 0], [3, vm], [5, 0], [8, vm - 20], [10, 0], [14, vm - 10], [16, 0], [18, vm - 20], [20, 0]].map(sc)), poly([[0, 0], [3, vm - 10], [5, 0], [8, vm - 20], [10, 0], [14, vm + 10], [16, 0], [18, vm - 20], [20, 0]].map(sc))];
        return p;
      } },
      { id: 'e17b', level: 'EMG', make: function (r, c) {
        var u = c.T / 20, fl = [[5, 6], [10, 11], [16, 17]].map(function (z) { return t(dn(z[0] * u) + '\\text{–}' + dn(z[1] * u)); });
        var p = B.number('(a) How many times does your graph come down to speed ' + t('0') + ' <i>between</i> the start and the finish?', 3, function (v) {
          if (v === 4) return { code: 'u5l11-count-ends', hint: 'Count only the stops <b>between</b> the start and the finish: the ' + c.v + ' resting at the finish doesn’t count.' };
          if (v === 5) return { code: 'u5l11-count-ends', hint: 'Count only the stops <b>between</b> the start and the finish, not the ' + c.v + ' resting before it pulls away or after it arrives.' };
          if (v === 0) return { code: 'u5l11-stops', hint: 'A complete stop is speed ' + t('0') + ': every time your graph touches the time axis in the middle is a stop.' };
          return { code: 'u5l11-stops', hint: 'The first condition says the ' + c.v + ' stops exactly three times besides the start and the finish.' };
        }, '<b>Three times</b>: the three stops between the start and the finish. (The sample graph is flat at speed ' + t('0') + ' from ' + fl.join(', ') + ' minutes.) The ' + c.v + ' resting at the very start and the very finish is not counted.',
          ['A complete stop is speed ' + t('0') + ': the graph touches the time axis.', 'Don’t count the start or the finish.'], 'EP stops between', { after: 'times' });
        p.bad = ['4', '5', '2'];
        return p;
      } }] },
    { num: '18', shared: function (r) { var d = pick(r, [2, 2, 1.5, 3, 2.5]), t1 = pick(r, [10, 10, 15, 20]), s = pick(r, [5, 5, 10]), nm = pick(r, ['Priya', 'Priya', 'Noah', 'Ines', 'Kenji']), pl = pick(r, ['a store', 'a store', 'the library', 'a friend’s house']); return { d: d, t1: t1, s: s, nm: nm, pl: pl, T: 2 * t1 + s }; },
      stem: function (c) { return c.nm + ' walks ' + t(dn(c.d)) + ' km to ' + c.pl + ' in ' + t(c.t1) + ' minutes, stays for ' + t(c.s) + ' minutes, then walks the same ' + t(dn(c.d)) + ' km home in ' + t(c.t1) + ' minutes. Sketch <b>two</b> graphs of this one trip.'; }, parts: [
      { id: 'e18a', level: 'PRG', make: function (r, c) { return walkSketch(c, false); } },
      { id: 'e18b', level: 'ADV', make: function (r, c) { return walkSketch(c, true); } },
      { id: 'e18c', level: 'PRG', make: function (r, c) {
        return mcG(r, '(c) The two graphs agree for the first ' + t(c.t1 + c.s) + ' minutes and then disagree completely. Why?', [
          { html: 'At first ' + c.nm + ' has only walked away from home, so how far ' + c.nm + ' <b>is</b> from home and how far ' + c.nm + ' <b>has walked</b> are the same number. On the walk home, the distance from home shrinks to ' + t('0') + ' while the total walked keeps climbing to ' + t(dn(2 * c.d)) + ' km.', right: true },
          { html: 'Because ' + c.nm + ' walks faster on the way home.', why: 'Same distance, same time: same speed. The difference is what each graph measures.' },
          { html: 'Because the total-distance graph is wrong after the stop.', why: 'Both graphs are right; they measure different things.' },
          { html: 'Because the stop counts as walking on one graph only.', why: 'Both graphs are flat during the stop. Look at the walk home.' }],
          'Walking away, the distance from home and the distance walked grow together. Walking home, the distance from home falls back to ' + t('0') + ', but every step still adds to the total walked, which ends at ' + t(dn(2 * c.d)) + ' km.', ['What happens to each quantity on the walk home?'], 'EP two graphs differ');
      } },
      { id: 'e18d', level: 'EMG', make: function (r, c) {
        return mcG(r, '(d) One of the two graphs ends at the same height it started. Which one, and why is that correct rather than a mistake?', [
          { html: 'The distance-from-home graph: ' + c.nm + ' really does end up back home, a distance of ' + t('0') + ' from it.', right: true },
          { html: 'The total-distance graph: the total resets when ' + c.nm + ' gets home.', why: 'A running total never resets — it ends at ' + t(dn(2 * c.d)) + ' km.' },
          { html: 'The distance-from-home graph, but it is a mistake: it should end at ' + t(dn(2 * c.d)) + ' km.', why: t(dn(2 * c.d)) + ' km is the total walked. Back home, the distance <b>from home</b> is ' + t('0') + '.' },
          { html: 'Neither: both graphs end higher than they start.', why: 'Where is ' + c.nm + ' at the end of the trip?' }],
          'The distance-from-home graph ends at ' + t('0') + ' because ' + c.nm + ' is back home. Only the total-distance graph must keep rising, and it does, ending at ' + t(dn(2 * c.d)) + ' km.', ['Where is ' + c.nm + ' at the end?'], 'EP ends where it started');
      } }] }
  ]; }

  /* the two graphs of Extra 18 (scaled, checked exactly) */
  function walkSketch(c, total) {
    var T = c.T, ym = total ? 2 * c.d + 1 : c.d + 1, inp = { x: [0, T + 5], y: [0, ym], grid: 5, gridY: 0.5, labelsX: 5, labelsY: 1, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Time (min)', yTitle: total ? 'Total distance walked (km)' : 'Distance from home (km)',
      unitX: 320 / (T + 5), unitY: 200 / ym, snapX: 5, snapY: 0.5, tools: ['line'], defaultEnd: 'none', max: 380 };
    var home = [[0, 0], [c.t1, c.d], [c.t1 + c.s, c.d], [T, 0]], tot = [[0, 0], [c.t1, c.d], [c.t1 + c.s, c.d], [T, 2 * c.d]], key = total ? tot : home, other = total ? home : tot;
    var wr = [{ is: poly(other), code: 'dist-vs-travel', hint: total ? 'That is the distance <b>from home</b>. The total walked never goes down: on the way home every step adds to it, ending at ' + t(dn(2 * c.d)) + ' km.' : 'That is the total distance walked. Distance <b>from home</b> shrinks on the walk home, back to ' + t('0') + '.' },
      { is: poly([[0, 0], [c.t1, c.d], [T - c.t1, c.d]].concat(total ? [[T, c.d]] : [])), code: 'story-count', hint: 'Show the walk back too: it takes another ' + t(c.t1) + ' minutes.' }];
    var chk = K.graphExact(poly(key), { wrong: wr });
    var check = function (v) { var res = chk(v); if (res.v === 'wrong' && res.code === 'graph' && !res.hint) return wrong('graph', 'Find each corner (minutes, km): ' + key.map(function (q) { return t(ptT(q)); }).join(', ') + '? Check each one against the story.'); return res; };
    var p = B.graph((total ? '(b) Total distance walked' : '(a) Distance from home') + ': sketch it on the grid.', inp, check, poly(key),
      'Corners ' + key.map(function (q) { return t(ptT(q)); }).join(', ') + (total ? ': the total keeps rising on the way home, to ' + t(dn(2 * c.d)) + ' km.' : ': back home at the end, distance ' + t('0') + '.'),
      [total ? 'A total never goes down.' : 'Walking home makes the distance from home shrink.'], total ? 'EP total walked graph' : 'EP from home graph');
    p.bad = [poly(other), poly(key.slice(0, 3))];
    return p;
  }
})(window);
