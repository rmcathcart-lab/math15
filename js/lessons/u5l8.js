/* Math 15 · Unit 5 · Lesson 8 — Introducing Functions: The Vertical Line Test (RF2)
 * Assignment 8 (u5_L08.tex, questions 1–15) and the Lesson 8 Extra Practice (u5_EP08.tex, questions 1–16).
 * Twin of Math 10C u5l5 ("What Is a Function?"): its helpers are copied below unchanged (info(), the graph generators,
 * fnPick / graphPick / discReasonMC / graphReasonMC, breakerPart, readPairs / pairsCheck), with Math 15 additions:
 * a verdict-and-reason MC that knows a repeated identical pair is harmless (reasonMC), word relations from a bank
 * (driver → licence number, flavour → students …), name arrow diagrams, more graph shapes (circle, slanted line, V,
 * cubic, two separate pieces, plotted points, semicircle), and "write two ordered pairs from the graph that share an
 * x-value" (sharePart: typed pairs, both on the graph within reading accuracy, same x, different y).
 * Constructions (four pairs with a repeated output, change one pair, add a breaking / a safe pair) are typed ordered
 * pairs checked for the property. Explain-questions are multiple choice whose options are reasons, or grids.
 * Levels (Math 15): LIM the definition; BEG one representation with no trap; EMG a trap (shared outputs, repeated
 * identical pair, a closed curve); PRG reasons and constructions; ADV working backwards; MAS the k-questions of EP 16
 * (which k break the set, and what changes when the new output repeats an old one). */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P;

  HW.addCodes({
    'mc-said-fn': 'Called a non-function a function', 'mc-said-not': 'Called a function “not a function”',
    'mc-shared-out': 'Thought a shared output breaks the function test', 'mc-out-reason': 'Right verdict, reason about outputs instead of inputs',
    'mc-sizes': 'Judged a function by the sizes of the domain and range', 'mc-no-dup-pair': 'Thought different pairs with the same input are fine',
    'mc-all-hit': 'Counted arrows arriving instead of arrows leaving', 'mc-outs-distinct': 'Thought distinct outputs make a function',
    'mc-shared-not': 'Right verdict, blamed a shared output', 'mc-hlt': 'Used a horizontal line test', 'mc-hlt-fn': 'Used a horizontal line test',
    'mc-curved': 'Thought curves can’t be functions', 'mc-curved-not': 'Right verdict, wrong reason (curved)', 'mc-ends': 'Thought a restricted domain breaks the test',
    'mc-smooth': 'Thought a smooth curve must be a function', 'fn-said-not': 'Said a function breaks the test', 'fn-used-output': 'Looked at a shared output instead of the inputs',
    'said-fn': 'Missed the input that breaks the test', 'wrong-input': 'Named the wrong input', 'used-output': 'Named an output instead of an input',
    'outputs-missing': 'Left out some outputs of the input', 'outputs-extra': 'Listed outputs that don’t belong to the input', 'unchanged': 'Did not change a pair',
    'changed-many': 'Changed more than one pair', 'added': 'Added a pair instead of changing one', 'still-fn': 'New set is still a function',
    'u5l8-dup-pair': 'Thought a repeated identical pair breaks the test', 'u5l8-not-same-x': 'Pairs don’t share an x-value', 'u5l8-same-pair': 'Gave the same point twice',
    'u5l8-off-graph': 'Point not on the graph', 'u5l8-count': 'Wrong number of ordered pairs', 'u5l8-not-fn': 'Construction is not a function',
    'u5l8-repeat-y': 'Output not repeated three times', 'u5l8-break': 'Breaking pair doesn’t break the function', 'u5l8-keep': 'Safe pair breaks the function',
    'u5l8-swap': 'Swapped set wrong', 'u5l8-pick': 'Wrong choices ticked', 'u5l8-k': 'Wrong values of k', 'u5l8-k-dup': 'Thought a repeated identical pair breaks the function'
  });
  HW.addPartial({ 'u5l8-dup-pair': 'n', 'u5l8-not-same-x': 'n', 'u5l8-same-pair': 'b', 'u5l8-off-graph': 's', 'u5l8-count': 's', 'u5l8-not-fn': 'n', 'u5l8-repeat-y': 'b',
    'u5l8-break': 'n', 'u5l8-keep': 'n', 'u5l8-swap': 's', 'u5l8-pick': 'n', 'u5l8-k': 'b', 'u5l8-k-dup': 'b' });

  /* ---------------- small helpers ---------------- */
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function same(a, b) { return Math.abs(a - b) < 1e-9; }
  function num(a, b) { return a - b; }
  function nT(x) { return String(Math.round(x * 1000) / 1000); }
  function pT(p) { return '(' + nT(p[0]) + ',\\ ' + nT(p[1]) + ')'; }
  function psT(ps) { return ps.map(pT).join(',\\ '); }
  function setT(ps) { return '\\{' + psT(ps) + '\\}'; }
  function psH(ps) { return ps.map(function (p) { return '<span class="nw">' + t(pT(p)) + '</span>'; }).join(', '); } // one span per pair so long lists wrap on phones
  function andT(a) { var s = a.map(function (x) { return t(nT(x)); }); return s.length < 2 ? s.join('') : s.slice(0, -1).join(', ') + ' and ' + s[s.length - 1]; }
  function sq(y) { return y < 0 ? '(' + nT(y) + ')^{2}' : nT(y) + '^{2}'; }
  function pickWhere(gen, okf) { for (var i = 0; i < 3000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('u5l8: no valid numbers'); }
  /* who is paired with whom */
  function info(pairs) {
    var by = {}, order = [], outBy = {}, oorder = [];
    pairs.forEach(function (p) {
      var k = nT(p[0]); if (!by[k]) { by[k] = { x: p[0], ys: [] }; order.push(k); } if (!by[k].ys.some(function (y) { return same(y, p[1]); })) by[k].ys.push(p[1]);
      var o = nT(p[1]); if (!outBy[o]) { outBy[o] = { y: p[1], xs: [] }; oorder.push(o); } if (!outBy[o].xs.some(function (x) { return same(x, p[0]); })) outBy[o].xs.push(p[0]);
    });
    var breakers = order.map(function (k) { return by[k]; }).filter(function (e) { return e.ys.length > 1; });
    var shared = oorder.map(function (k) { return outBy[k]; }).filter(function (e) { return e.xs.length > 1; });
    return { isFn: !breakers.length, breakers: breakers, shared: shared, xs: order.map(function (k) { return by[k].x; }), ys: oorder.map(function (k) { return outBy[k].y; }),
      type: breakers.length ? (shared.length ? 'mm' : '1m') : (shared.length ? 'm1' : '11') };
  }
  function shuffleApart(r, pairs) {
    for (var i = 0; i < 80; i++) { var s = r.shuffle(pairs), bad = false; for (var j = 1; j < s.length; j++) if (same(s[j][0], s[j - 1][0])) bad = true; if (!bad) return s; }
    return pairs.slice();
  }
  function fnShared(r, xs, yPool) { var ys = r.sample(yPool, xs.length - 1); ys.push(r.pick(ys)); ys = r.shuffle(ys); return xs.map(function (x, i) { return [x, ys[i]]; }); }
  function notFn(r, xs, yPool) { var b = r.pick(xs), ys = r.sample(yPool, xs.length + 1), pairs = xs.map(function (x, i) { return [x, ys[i]]; }); pairs.push([b, ys[xs.length]]); return pairs; }

  /* ---------------- figures ---------------- */
  var RED = '#c4532a';
  function vtab(pairs, hx, hy) {
    return '<table class="vtab"><tr><th>' + hx + '</th><th>' + hy + '</th></tr>' + pairs.map(function (p) { return '<tr><td>' + t(nT(p[0])) + '</td><td>' + t(nT(p[1])) + '</td></tr>'; }).join('') + '</table>';
  }
  function htab(pairs, vx, vy) { return HW.valueTable([[t(vx)].concat(pairs.map(function (p) { return t(nT(p[0])); })), [t(vy)].concat(pairs.map(function (p) { return t(nT(p[1])); }))]); }
  function arrow(pairs, left, right, opt) {
    var I = info(pairs);
    return HW.arrowDiagram(left || I.xs.slice().sort(num), right || I.ys.slice().sort(num), pairs, opt || {});
  }
  function G(spec) { return HW.graph(Object.assign({ x: [-5, 5], y: [-5, 5], labels: 2, max: 260 }, spec)); }
  function demo(g) { // the graph again, with the vertical line and where it crosses
    var spec = Object.assign({}, g.spec, { vline: [g.vx], max: 220, points: (g.spec.points || []).concat(g.hits.map(function (p) { return { x: p[0], y: p[1], color: RED }; })) });
    return G(spec);
  }
  function ell(h, k, a, b, t0, t1) { var o = []; for (var i = 0; i <= 120; i++) { var th = t0 + (t1 - t0) * i / 120; o.push([h + a * Math.cos(th), k + b * Math.sin(th)]); } return o; }
  function inWin(pts, w) { return pts.every(function (p) { return Math.abs(p[0]) <= w && Math.abs(p[1]) <= w; }); }

  /* ---------------- graph generators: { spec, isFn, vx, hits, why, sayFn, sayNot, text } ---------------- */
  function ptsList(hits) { var s = hits.map(function (p) { return t(pT(p)); }); return s.length < 2 ? s.join('') : s.slice(0, -1).join(', ') + ' and ' + s[s.length - 1]; }
  var NOT_WHY = function (vx, hits) { return 'The vertical line ' + t('x=' + nT(vx)) + ' crosses the graph ' + (hits.length > 2 ? hits.length + ' times' : 'twice') + ', at ' + ptsList(hits) + ': the input ' + t(nT(vx)) + ' has more than one output.'; };
  function notG(spec, vx, hits, text, extra) {
    var w = NOT_WHY(vx, hits);
    return { spec: spec, isFn: false, vx: vx, hits: hits, text: text, why: w + (extra || '') + ' <b>Not a function.</b>',
      sayFn: 'Try the vertical line ' + t('x=' + nT(vx)) + ': it meets the graph at ' + ptsList(hits) + ' — one input, more than one output.' };
  }
  function fnG(spec, vx, hit, text, note) {
    return { spec: spec, isFn: true, vx: vx, hits: [hit], text: text,
      why: 'Every vertical line crosses the graph at most once (for example, ' + t('x=' + nT(vx)) + ' meets it only at ' + t(pT(hit)) + ')' + (note ? '; ' + note : '') + '. <b>Function.</b>',
      sayNot: 'Slide a vertical line across the graph: it never meets the graph twice' + (note ? ' (' + note + ')' : '') + '. A <i>horizontal</i> line meeting it twice doesn’t matter — two inputs may share an output.' };
  }
  function gParabola(r) { // y = k + s·a(x−h)², restricted domain
    var o = pickWhere(function () {
      var s = r.pick([-1, -1, 1]), a = r.pick([0.5, 1]), h = r.int(-1, 1), k = s < 0 ? r.int(1, 3) : r.int(-3, -1), d1 = r.pick([1.5, 2, 2.5, 3]), d2 = r.pick([1.5, 2, 2.5]);
      if (r.chance(0.5)) { var tmp = d1; d1 = d2; d2 = tmp; }
      return { s: s, a: a, h: h, k: k, from: h - d1, to: h + d2, f: function (x) { return k + s * a * (x - h) * (x - h); } };
    }, function (o) { return [o.from, o.to].every(function (x) { return Math.abs(o.f(x)) <= 4.7 && Math.abs(x) <= 4.7; }) && Math.abs(o.to - o.from) >= 3; });
    return fnG({ fns: [{ f: o.f, from: o.from, to: o.to }] }, o.h, [o.h, o.k], 'parabola piece', 'the curve stops at both ends, which is allowed');
  }
  function gSideways(r, dots) { // x = h + s·a(y−k)²
    var o = pickWhere(function () {
      var s = r.pick([-1, 1]), a = r.pick([0.5, 1]), m = a === 0.5 ? r.pick([2.5, 3]) : 2, h = s > 0 ? r.int(-4, -1) : r.int(1, 4), k = r.int(-1, 1);
      return { s: s, a: a, m: m, h: h, k: k, d: a === 0.5 ? 2 : 1 };
    }, function (o) { return Math.abs(o.h + o.s * o.a * o.m * o.m) <= 4.6 && Math.abs(o.k) + o.m <= 4.6; });
    var pts = []; for (var i = 0; i <= 80; i++) { var y = o.k - o.m + 2 * o.m * i / 80; pts.push([o.h + o.s * o.a * (y - o.k) * (y - o.k), y]); }
    var vx = o.h + o.s * o.a * o.d * o.d;
    return notG({ segs: [{ pts: pts, start: dots ? 'closed' : 'none', end: dots ? 'closed' : 'none' }] }, vx, [[vx, o.k + o.d], [vx, o.k - o.d]], 'sideways parabola');
  }
  function gWideEllipse(r) {
    var o = pickWhere(function () { return { h: r.int(-1, 1), k: r.int(-1, 1), a: r.pick([3, 4]), b: r.pick([1, 2]) }; }, function (o) { return Math.abs(o.h) + o.a <= 4.6 && Math.abs(o.k) + o.b <= 4.6 && Math.abs(o.h) !== o.a && Math.abs(o.k) !== o.b; });
    if (r.chance(0.7)) return notG({ segs: [{ pts: ell(o.h, o.k, o.a, o.b, 0, 2 * Math.PI) }] }, o.h, [[o.h, o.k + o.b], [o.h, o.k - o.b]], 'wide ellipse');
    var top = r.chance(0.5), s = top ? 1 : -1;
    return fnG({ segs: [{ pts: ell(o.h, o.k, o.a, o.b, 0, s * Math.PI), start: 'closed', end: 'closed' }] }, o.h, [o.h, o.k + s * o.b], (top ? 'top' : 'bottom') + ' half of an ellipse', 'only the ' + (top ? 'top' : 'bottom') + ' half of the oval is drawn');
  }
  function gTallEllipse(r) {
    var o = pickWhere(function () { return { h: r.int(-2, 2), k: r.int(-1, 1), a: r.pick([1, 2]), b: r.pick([3, 4]) }; }, function (o) { return Math.abs(o.h) + o.a <= 4.6 && Math.abs(o.k) + o.b <= 4.6 && Math.abs(o.h) !== o.a && Math.abs(o.k) !== o.b; });
    if (r.chance(0.65)) return notG({ segs: [{ pts: ell(o.h, o.k, o.a, o.b, 0, 2 * Math.PI) }] }, o.h, [[o.h, o.k + o.b], [o.h, o.k - o.b]], 'tall ellipse');
    var top = r.chance(0.5), s = top ? 1 : -1;
    return fnG({ segs: [{ pts: ell(o.h, o.k, o.a, o.b, 0, s * Math.PI), start: 'closed', end: 'closed' }] }, o.h, [o.h, o.k + s * o.b], (top ? 'top' : 'bottom') + ' half of a tall ellipse', 'only the ' + (top ? 'top' : 'bottom') + ' half of the oval is drawn');
  }
  function gBlob(r, wig) { // a closed, star-shaped curve around (h, k)
    return pickWhere(function () {
      var h = r.int(-1, 1), k = r.int(-1, 1), R = r.pick([2.6, 2.9, 3.2]), sx = r.pick([1, 1.15, 1.3]);
      var e1 = 0.07 + 0.08 * r.next(), e2 = 0.05 + 0.07 * r.next(), e3 = wig ? 0.06 + 0.05 * r.next() : 0, p1 = 6.283 * r.next(), p2 = 6.283 * r.next(), p3 = 6.283 * r.next();
      var rr = function (th) { return R * (1 + e1 * Math.sin(2 * th + p1) + e2 * Math.cos(3 * th + p2) + e3 * Math.sin(5 * th + p3)); };
      var pts = []; for (var i = 0; i <= 160; i++) { var th = 2 * Math.PI * i / 160; pts.push([h + sx * rr(th) * Math.cos(th), k + rr(th) * Math.sin(th)]); }
      var top = [h, Math.round((k + rr(Math.PI / 2)) * 10) / 10], bot = [h, Math.round((k - rr(3 * Math.PI / 2)) * 10) / 10];
      var g = notG({ segs: [{ pts: pts }] }, h, [top, bot], wig ? 'wavy closed curve' : 'closed curve');
      g.why = 'The vertical line ' + t('x=' + h) + ' crosses the closed curve twice — once above and once below the middle (near ' + t(pT(top)) + ' and ' + t(pT(bot)) + '). One input, two outputs: <b>not a function.</b> (Any closed loop fails the test.)';
      g.sayFn = 'Try the vertical line ' + t('x=' + h) + ': it crosses the loop once on the top and once on the bottom — one input, two outputs.';
      g.pts = pts; return g;
    }, function (g) { return inWin(g.pts, 4.7); });
  }
  function gWave(r) { // a wavy curve that is a function
    var o = pickWhere(function () { return { A: r.pick([1.5, 2, 2.5]), k: r.int(-1, 1), ph: r.pick([0, 0.5, 1, 1.5]) * Math.PI }; }, function (o) { return Math.abs(o.k) + o.A <= 4; });
    var f = function (x) { return o.k + o.A * Math.sin(Math.PI * x / 3 + o.ph); };
    return fnG({ fns: [{ f: f, from: -4.6, to: 4.6 }] }, 0, [0, Math.round(f(0) * 10) / 10], 'wavy curve (function)', 'the curve goes up and down, but always moving to the right');
  }
  function gSideWave(r) { // x = h + A sin(πy/3): fails
    var A = r.pick([1.5, 2]), h = r.int(-1, 1), pts = [];
    for (var i = 0; i <= 120; i++) { var y = -4.3 + 8.6 * i / 120; pts.push([h + A * Math.sin(Math.PI * y / 3), y]); }
    return notG({ segs: [{ pts: pts }] }, h, [[h, 3], [h, 0], [h, -3]], 'sideways wave');
  }
  function gTriangle(r) {
    var o = pickWhere(function () { var xl = r.int(-4, -2), xr = r.int(2, 4); return { xl: xl, xr: xr, xm: r.int(xl + 2, xr - 1), yb: r.int(-3, -1), yt: r.int(1, 3) }; }, function (o) { return o.xm > o.xl && o.xm < o.xr; });
    var L = [o.xl, o.yb], T = [o.xm, o.yt], R = [o.xr, o.yb];
    if (r.chance(0.7)) {
      var g = notG({ segs: [{ pts: [L, T, R, L] }] }, o.xm, [T, [o.xm, o.yb]], 'triangle');
      g.why = 'The vertical line ' + t('x=' + o.xm) + ' passes through the corner ' + t(pT(T)) + ' and crosses the bottom side at ' + t(pT([o.xm, o.yb])) + '. Any vertical line through the inside crosses two sides: <b>not a function.</b>';
      return g;
    }
    return fnG({ segs: [{ pts: [L, T, R] }] }, o.xm, T, 'two sides of a triangle (open)', 'there is no bottom side, and the path always moves to the right');
  }
  function gLine(r) {
    var c = r.pick([-3, -2, -1, 1, 2, 3]);
    if (r.chance(0.7)) return fnG({ segs: [{ pts: [[-4.6, c], [4.6, c]], start: 'arrow', end: 'arrow' }] }, 2, [2, c], 'horizontal line', 'a horizontal line gives the one output ' + t(c) + ' for every input');
    var g = notG({ segs: [{ pts: [[c, -4.6], [c, 4.6]], start: 'arrow', end: 'arrow' }] }, c, [[c, -2], [c, 2]], 'vertical line');
    g.why = 'This graph <i>is</i> the vertical line ' + t('x=' + c) + ': the one input ' + t(c) + ' is paired with every ' + t('y') + ', for example ' + t(pT([c, -2])) + ' and ' + t(pT([c, 2])) + '. <b>Not a function.</b>';
    return g;
  }

  /* ---------------- multiple-choice builders ---------------- */
  var HFN = ['A relation is a function when every input (first coordinate) is paired with exactly one output (second coordinate).', 'Look for an input that appears with two different outputs. Outputs are allowed to repeat.'];
  var HVLT = ['Imagine sliding a vertical line across the graph. If it ever crosses the graph twice, one ' + t('x') + '-value has two ' + t('y') + '-values.', 'Only vertical lines decide. A horizontal line crossing twice just means two inputs share an output.'];
  var HARR = ['Count the arrows <b>leaving</b> each element on the left. A function has exactly one arrow leaving every one of them.', 'Arrows <b>arriving</b> at the same element on the right are allowed.'];
  function fnPick(r, prompt, isFn, sayFn, sayNot, sol, hints, text) {
    var p = B.mc(r, prompt, [{ html: '<b>Function</b>', right: isFn, why: isFn ? null : sayFn, code: 'said-fn' }, { html: '<b>Not a function</b>', right: !isFn, why: isFn ? sayNot : null, code: 'said-not' }], sol, hints, text, true);
    p.tries = 1; p.input.columns = 2; return p;
  }
  function graphPick(r, g) { return fnPick(r, G(g.spec) + 'Is this relation a function?', g.isFn, g.sayFn, g.sayNot, g.why + demo(g), HVLT, 'function or not: ' + g.text); }
  /* discrete relation, the verdict as a 2-option choice */
  function discWhy(I, rep) {
    if (I.isFn) return (rep === 'arrow' ? 'Each element on the left has exactly one arrow leaving it' : 'Each input ' + andT(I.xs) + ' appears only once, with one output') +
      (I.shared.length ? ' — the output ' + t(nT(I.shared[0].y)) + ' coming from ' + andT(I.shared[0].xs) + ' is allowed' : '') + '. <b>Function.</b>';
    var b = I.breakers[0];
    return (rep === 'arrow' ? t(nT(b.x)) + ' has ' + b.ys.length + ' arrows leaving it (to ' + andT(b.ys) + ')' : 'The input ' + t(nT(b.x)) + ' is paired with ' + andT(b.ys)) + ': one input, more than one output. <b>Not a function.</b>';
  }
  function discPick(r, fig, pairs, rep, text) {
    var I = info(pairs), b = I.breakers[0];
    var sayFn = b ? (rep === 'arrow' ? 'Count the arrows leaving ' + t(nT(b.x)) + ': it points to ' + andT(b.ys) + '. One input, two outputs.' : 'Look at the input ' + t(nT(b.x)) + ': it is paired with ' + andT(b.ys) + '. One input, two outputs.') : null;
    var sayNot = I.isFn ? 'Every input has exactly one output' + (I.shared.length ? ' — the output ' + t(nT(I.shared[0].y)) + ' being shared by ' + andT(I.shared[0].xs) + ' is allowed' : '') + '.' : null;
    return fnPick(r, fig + 'Is this relation a function?', I.isFn, sayFn, sayNot, discWhy(I, rep), rep === 'arrow' ? HARR : HFN, 'function or not: ' + text);
  }
  /* discrete relation, verdict + reason (Q1) */
  function discReasonMC(r, fig, pairs, rep, text) {
    var I = info(pairs), opts, s = I.shared[0], b = I.breakers[0];
    var inputs = rep === 'arrow' ? 'element on the left' : 'input';
    if (I.isFn) {
      opts = [
        { html: 'Function — ' + (rep === 'arrow' ? 'each element on the left has exactly one arrow leaving it.' : 'the inputs ' + t(I.xs.map(nT).join(',\\ ')) + ' are all different, so each input has exactly one output.'), right: true },
        { html: 'Not a function — the output ' + t(nT(s.y)) + ' is paired with ' + (s.xs.length > 2 ? 'several inputs, ' : 'two inputs, ') + andT(s.xs) + '.', code: 'shared-out',
          why: 'Two inputs may share an output. The test is about inputs: is any ' + inputs + ' paired with two different outputs?' },
        { html: 'Function — each output is paired with exactly one input.', code: 'out-reason',
          why: 'The verdict is right but the reason isn’t: the output ' + t(nT(s.y)) + ' comes from ' + andT(s.xs) + '. A function only needs each <b>input</b> to have one output.' },
        { html: 'Not a function — the domain has more elements than the range.', code: 'sizes',
          why: 'A function may have fewer outputs than inputs (several inputs can share one output). Check whether any ' + inputs + ' has two outputs.' }];
    } else {
      var outs = I.shared[0];
      opts = [
        { html: 'Not a function — the input ' + t(nT(b.x)) + ' is paired with ' + (b.ys.length > 2 ? 'several' : 'two') + ' outputs, ' + andT(b.ys) + '.', right: true },
        rep === 'arrow' ? { html: 'Function — every element on the right has an arrow pointing to it.', code: 'all-hit', why: 'Count the arrows <b>leaving</b> each element on the left instead: ' + t(nT(b.x)) + ' sends ' + b.ys.length + ' arrows.' }
          : { html: 'Function — no ordered pair appears twice.', code: 'no-dup-pair', why: t(pT([b.x, b.ys[0]])) + ' and ' + t(pT([b.x, b.ys[1]])) + ' are different pairs, but they give the one input ' + t(nT(b.x)) + ' two different outputs.' },
        { html: 'Function — each output is paired with exactly one input.', code: 'out-reason', why: 'The test is about inputs, not outputs — and the input ' + t(nT(b.x)) + ' is paired with both ' + andT(b.ys) + '.' },
        outs ? { html: 'Not a function — the output ' + t(nT(outs.y)) + ' is paired with ' + (outs.xs.length > 2 ? 'several inputs, ' : 'two inputs, ') + andT(outs.xs) + '.', code: 'shared-not',
          why: 'The verdict is right, but not the reason: inputs may share an output. The real problem is the input ' + t(nT(b.x)) + ', which has more than one output.' }
          : { html: 'Function — the outputs ' + t(I.ys.map(nT).join(',\\ ')) + ' are all different.', code: 'outs-distinct', why: 'Different outputs don’t make it a function. The input ' + t(nT(b.x)) + ' appears twice, with ' + andT(b.ys) + '.' }];
    }
    return B.mc(r, fig + 'Is this relation a function? Choose the answer with the correct reason.', opts, discWhy(I, rep), rep === 'arrow' ? HARR : HFN, 'function? reason: ' + text);
  }
  function graphReasonMC(r, g) {
    var opts = g.isFn ? [
      { html: 'Function — every vertical line crosses the graph at most once.', right: true },
      { html: 'Not a function — some horizontal lines cross the graph twice.', code: 'hlt', why: 'That only shows two inputs sharing an output, which a function may do. Only <b>vertical</b> lines decide.' },
      { html: 'Not a function — the graph is curved, not straight.', code: 'curved', why: 'Curves can be functions. Slide a vertical line across: does it ever meet the curve twice?' },
      { html: 'Not a function — the graph stops at both ends, so some ' + t('x') + '-values have no output.', code: 'ends', why: t('x') + '-values outside the domain simply aren’t inputs — that’s allowed. The test only asks that no input has two outputs.' }] : [
      { html: 'Not a function — the vertical line ' + t('x=' + nT(g.vx)) + ' crosses the graph twice, at ' + t(pT(g.hits[0])) + ' and ' + t(pT(g.hits[1])) + '.', right: true },
      { html: 'Function — every horizontal line crosses the graph at most once.', code: 'hlt-fn', why: 'Horizontal lines don’t decide the test. Use a vertical line, such as ' + t('x=' + nT(g.vx)) + '.' },
      { html: 'Function — the curve is smooth, with no breaks.', code: 'smooth', why: 'Being smooth has nothing to do with it. Where does the vertical line ' + t('x=' + nT(g.vx)) + ' cross the curve?' },
      { html: 'Not a function — the graph is a curve.', code: 'curved-not', why: 'The verdict is right, but not the reason: many curves (a parabola opening up or down, for one) are functions. The real reason is a vertical line that crosses twice.' }];
    return B.mc(r, G(g.spec) + 'Is this relation a function? Choose the answer with the correct reason.', opts, g.why + demo(g), HVLT, 'function? reason: ' + g.text);
  }

  /* ---------------- "name the input that breaks the test" (two boxes) ---------------- */
  function isNone(s) { var z = String(s == null ? '' : s).replace(/\\text\{\s*([^}]*)\}|\\mathrm\{\s*([^}]*)\}/g, '$1$2').replace(/\s+/g, '').toLowerCase(); return /^(none|no|nothing|dne|n\/a|na|itisafunction|function)$/.test(z); }
  function nums(s) {
    s = String(s == null ? '' : s).replace(/\\left|\\right/g, '').replace(/\\[,;:! ]|\\quad|\\qquad|~/g, ' ').replace(/\\text\{\s*(or|and)\s*\}/gi, ',').replace(/\b(or|and)\b/gi, ',').replace(/;/g, ',').replace(/[a-zA-Z]\s*=\s*/g, '').replace(/\\\{|\\\}|\\lbrace|\\rbrace/g, '');
    if (!s.trim()) return null;
    var out = [], pcs = s.split(',');
    for (var i = 0; i < pcs.length; i++) { var p = pcs[i].trim(); if (!p) continue; var pm = /^(\\pm|±)/.test(p); p = p.replace(/^(\\pm|±)\s*/, ''); var a = ex.parse(p); if (!a.ok) return null; var v = ex.value(a.ast); if (!isFinite(v)) return null; out.push(v); if (pm) out.push(-v); }
    return out.length ? out : null;
  }
  function has(arr, v) { return arr.some(function (x) { return same(x, v); }); }
  function breakerPart(fig, pairs, vx, vy, sol, text, hints) {
    var I = info(pairs), b = I.breakers[0];
    var fields = [{ label: 'Input that breaks the test:', name: 'Input', mode: 'math', keys: 'solutions', vars: [vx], none: true, placeholder: 'e.g. 3  or  none' },
      { label: 'Its outputs:', name: 'Outputs', mode: 'math', keys: 'solutions', vars: [vy], none: true, placeholder: 'e.g. 4, 9  or  none' }];
    var key = I.isFn ? ['none', 'none'] : [nT(b.x), b.ys.map(nT).join(', ')];
    var check = function (resp) {
      resp = resp || []; var a = String(resp[0] == null ? '' : resp[0]).trim(), c = String(resp[1] == null ? '' : resp[1]).trim();
      if (!a && !c) return form('empty', 'Fill in the boxes first. If the relation is a function, press <b>none</b>.');
      if (!a) return form('no-input', 'Fill in the first box: the input that breaks the test, or <b>none</b>.');
      if (I.isFn) {
        if (isNone(a)) return !c || isNone(c) ? ok() : form('none-both', 'If no input breaks the test, press <b>none</b> in the second box too.');
        var av = nums(a); if (!av) return form('unreadable', 'Type one number, e.g. ' + t('3') + ', or press <b>none</b>.');
        if (!has(I.xs, av[0]) && I.shared.some(function (e) { return same(e.y, av[0]); })) return wrong('fn-used-output', t(nT(av[0])) + ' is an output shared by more than one input. Sharing an output is allowed — the test is about the inputs.');
        return wrong('fn-said-not', has(I.xs, av[0]) ? 'The input ' + t(nT(av[0])) + ' has only one output. Check every input: if none has two outputs, the relation is a function — press <b>none</b>.' : 'Every input appears with only one output' + (I.shared.length ? ' (outputs may repeat)' : '') + ', so nothing breaks the test — press <b>none</b>.');
      }
      if (isNone(a)) return wrong('said-fn', 'Look at the inputs (first coordinates) again: one of them appears with more than one output.');
      var av2 = nums(a); if (!av2) return form('unreadable', 'Type the input as a number, e.g. ' + t('3') + '.');
      if (av2.length > 1) return form('one-input', 'Type just the one input that breaks the test.');
      if (!same(av2[0], b.x)) {
        if (!has(I.xs, av2[0]) && has(I.ys, av2[0])) return wrong('used-output', t(nT(av2[0])) + ' is an output (second coordinate), not an input. Which <b>input</b> appears with two different outputs?');
        return wrong('wrong-input', has(I.xs, av2[0]) ? 'The input ' + t(nT(av2[0])) + ' has only one output. Find the input that appears with two different outputs.' : t(nT(av2[0])) + ' isn’t an input of this relation. Find the input that appears with two different outputs.');
      }
      if (!c || isNone(c)) return form('no-outputs', 'Right input! Now list the outputs it is paired with, separated by commas.');
      var cv = nums(c); if (!cv) return form('unreadable2', 'List the outputs as numbers separated by commas, e.g. ' + t('4,\\ 9') + '.');
      var miss = b.ys.filter(function (y) { return !has(cv, y); }), extra = cv.filter(function (y) { return !has(b.ys, y); });
      if (extra.length) return wrong('outputs-extra', t(nT(extra[0])) + ' is not an output of the input ' + t(nT(b.x)) + '. List only the outputs paired with ' + t(nT(b.x)) + '.');
      if (miss.length) return wrong('outputs-missing', 'The input ' + t(nT(b.x)) + ' is paired with ' + (b.ys.length > 2 ? b.ys.length + ' outputs' : 'one more output') + ' — list all of them.');
      return ok();
    };
    var bad = I.isFn ? [[nT(I.xs[0]), nT(pairs[0][1])]] : [['none', 'none'], [nT(b.x), nT(b.ys[0])]];
    var good = I.isFn ? [['none', '']] : [[vx + '=' + nT(b.x), b.ys.slice().reverse().map(nT).join(', ')]];
    return { prompt: fig + 'If the relation is <b>not</b> a function, name the input that breaks the test and the outputs it is paired with. If it <b>is</b> a function, press <b>none</b> in both boxes.',
      input: { type: 'fields', fields: fields }, check: check, key: key, good: good, bad: bad,
      answer: I.isFn ? 'none — it is a function' : 'input ' + t(nT(b.x)) + ', outputs ' + t(b.ys.map(nT).join(',\\ ')) + ' (not a function)', solution: sol || discWhy(I, 'pairs'), hints: hints || HFN, text: text };
  }

  /* ---------------- typed ordered pairs (constructions) ---------------- */
  function readPairs(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\[,;:! ]|\\quad|\\qquad|~/g, ' ').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\\{|\\\}|\\lbrace|\\rbrace|[{}]/g, ' ');
    if (!s.trim()) return { empty: true };
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) {
      var xy = m[1].split(','); if (xy.length !== 2) return { bad: true };
      var a = ex.parse(xy[0].trim()), b = ex.parse(xy[1].trim()); if (!a.ok || !b.ok) return { bad: true };
      out.push([ex.value(a.ast), ex.value(b.ast)]);
    }
    if (s.replace(re, '').replace(/[,\s]/g, '').length || !out.length) return { bad: true };
    return { pairs: out };
  }
  function pairsCheck(test) {
    return function (resp) {
      var L = readPairs(resp);
      if (L.empty) return form('empty', 'Type your ordered pairs first, e.g. ' + t('\\{(2,\\ 1),\\ (4,\\ 3)\\}') + '.');
      if (L.bad) return form('unreadable', 'Write ordered pairs in brackets, separated by commas, e.g. ' + t('\\{(2,\\ 1),\\ (4,\\ 3)\\}') + '.');
      var keys = L.pairs.map(function (p) { return nT(p[0]) + '|' + nT(p[1]); });
      for (var i = 0; i < keys.length; i++) if (keys.indexOf(keys[i]) !== i) return form('dup', 'You listed ' + t(pT(L.pairs[i])) + ' twice — each ordered pair only needs to be listed once.');
      return test(L.pairs, info(L.pairs));
    };
  }

  /* ================= Math 15 additions ================= */
  function nz(a, b) { return range(a, b).filter(function (x) { return x !== 0; }); }
  /* verdict + reason for listed pairs / a table, aware of a repeated identical pair */
  function dupPair(pairs) { for (var i = 0; i < pairs.length; i++) for (var j = 0; j < i; j++) if (same(pairs[i][0], pairs[j][0]) && same(pairs[i][1], pairs[j][1])) return pairs[i]; return null; }
  function reasonMC(r, fig, pairs, rep, text) {
    var d = dupPair(pairs), I = info(pairs);
    if (!d && I.isFn && !I.shared.length) {
      var ins = rep === 'arrow' ? 'each element on the left has exactly one arrow leaving it' : 'the inputs ' + t(I.xs.map(nT).join(',\\ ')) + ' are all different, so each input has exactly one output';
      return B.mc(r, fig + 'Is this relation a function? Choose the answer with the correct reason.', [
        { html: 'Function — ' + ins + '.', right: true },
        { html: 'Function — the outputs are all different.', code: 'out-reason', why: 'The verdict is right, but the reason is about outputs. A function needs each <b>input</b> to have exactly one output.' },
        { html: 'Not a function — no two inputs share an output.', code: 'needs-shared', why: 'Sharing outputs is allowed, not required. Check the inputs.' },
        { html: 'Not a function — the domain and range have the same number of elements.', code: 'sizes', why: 'The sizes don’t decide. Is any input paired with two outputs?' }],
        discWhy(I, rep), rep === 'arrow' ? HARR : HFN, 'function? reason: ' + text);
    }
    if (!d || !I.isFn) return discReasonMC(r, fig, pairs, rep, text);
    var opts = [
      { html: 'Function — ' + t(nT(d[0])) + ' is listed twice, but with the same output ' + t(nT(d[1])) + ' both times, so every input still has exactly one output.', right: true },
      { html: 'Not a function — the input ' + t(nT(d[0])) + ' appears twice.', code: 'dup-pair', why: 'Look at the two pairs with input ' + t(nT(d[0])) + ': they are the <b>same</b> pair ' + t(pT(d)) + '. A repeated input only breaks the rule when it has two <b>different</b> outputs.' },
      { html: 'Not a function — the same ordered pair can’t be listed twice.', code: 'dup-pair2', why: 'Listing the same pair twice adds nothing new: the input ' + t(nT(d[0])) + ' still has the one output ' + t(nT(d[1])) + '.' },
      { html: 'Not a function — the output ' + t(nT(d[1])) + ' appears more than once.', code: 'shared-out', why: 'Outputs may repeat. The test is about inputs having two different outputs.' }];
    var p = B.mc(r, fig + 'Is this relation a function? Choose the answer with the correct reason.', opts, 'The input ' + t(nT(d[0])) + ' appears twice, but both times as ' + t(pT(d)) + ' — the same pair repeated. Every input has exactly one output. <b>Function.</b>', HFN, 'function? reason: ' + text);
    p.check = (function (c) { return function (resp) { var res = c(resp); if (res.v === 'wrong' && /dup-pair/.test(res.code)) res.code = 'u5l8-dup-pair'; return res; }; })(p.check);
    return p;
  }
  /* an arrow diagram of names (students → pets / sports) */
  function nameDiagram(left, right, pairs) {
    var n = Math.max(left.length, right.length), rowH = 30, H = n * rowH + 30, W = 330, lx = 78, rx = 252, hw = function (sv) { return 3.9 * String(sv).length + 6; };
    var ly = function (i) { return 15 + (i + 0.5) * (n * rowH / left.length); }, ry = function (i) { return 15 + (i + 0.5) * (n * rowH / right.length); };
    var esc = function (v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var o = '<rect width="' + W + '" height="' + H + '" fill="#fff"/>';
    [lx, rx].forEach(function (cx) { o += '<ellipse cx="' + cx + '" cy="' + (15 + n * rowH / 2) + '" rx="58" ry="' + (n * rowH / 2 + 8) + '" fill="#f6f4ef" stroke="#2b3340" stroke-width="1.4"/>'; });
    left.forEach(function (v, i) { o += '<text x="' + lx + '" y="' + (ly(i) + 5) + '" font-size="14" text-anchor="middle" fill="#1c2230">' + esc(v) + '</text>'; });
    right.forEach(function (v, i) { o += '<text x="' + rx + '" y="' + (ry(i) + 5) + '" font-size="14" text-anchor="middle" fill="#1c2230">' + esc(v) + '</text>'; });
    pairs.forEach(function (pp) { var i = left.indexOf(pp[0]), j = right.indexOf(pp[1]); if (i < 0 || j < 0) return; o += '<line x1="' + (lx + hw(pp[0])) + '" y1="' + ly(i) + '" x2="' + (rx - hw(pp[1]) - 2) + '" y2="' + ry(j) + '" stroke="#2b55a0" stroke-width="1.6" marker-end="url(#ndArr8)"/>'; });
    return '<svg class="fig-svg" viewBox="0 0 ' + W + ' ' + H + '" style="max-width:330px" role="img" aria-label="arrow diagram"><defs><marker id="ndArr8" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#2b55a0"/></marker></defs>' + o + '</svg>';
  }
  var NAMES = ['Mia', 'Noah', 'Omar', 'Priya', 'Aiden', 'Chloe', 'Evan', 'Fatima', 'Hiro', 'Isla', 'Jonah', 'Kiran', 'Leah', 'Mateo', 'Nora', 'Ravi', 'Sofia', 'Tariq', 'Uma', 'Wes'];
  function namesMC(r, title, fig, left, pairs, item, items, text) {
    var by = {}; pairs.forEach(function (p) { (by[p[0]] = by[p[0]] || []).push(p[1]); });
    var two = left.filter(function (n) { return by[n].length > 1; })[0], shared = items.filter(function (it) { return pairs.filter(function (p) { return p[1] === it; }).length > 1; })[0];
    var opts = two ? [
      { html: 'Not a function — ' + two + ' has two arrows leaving (' + by[two].join(' and ') + ').', right: true },
      { html: 'Function — every ' + item + ' has an arrow pointing to it.', code: 'all-hit', why: 'Count the arrows <b>leaving</b> each student: ' + two + ' has two.' },
      { html: 'Function — each student is listed only once on the left.', code: 'no-dup-pair', why: 'Being listed once isn’t enough: ' + two + ' is paired with two different ' + item + 's.' },
      shared ? { html: 'Not a function — ' + shared + ' has two arrows arriving.', code: 'shared-not', why: 'Arrows arriving at the same output are allowed. The problem is the arrows leaving ' + two + '.' } : { html: 'Not a function — there are more ' + item + 's than students.', code: 'sizes', why: 'The sizes don’t decide. Count the arrows leaving each student.' }] : [
      { html: 'Function — every student has exactly one arrow leaving.', right: true },
      { html: 'Not a function — ' + shared + ' has two arrows arriving.', code: 'shared-out', why: 'Two students may share the same ' + item + '. Count arrows <b>leaving</b> each student instead.' },
      { html: 'Function — every ' + item + ' has exactly one arrow arriving.', code: 'out-reason', why: 'The verdict is right but not the reason: ' + shared + ' has more than one arrow arriving. A function only needs one arrow <b>leaving</b> each input.' },
      { html: 'Not a function — there are fewer ' + item + 's than students.', code: 'sizes', why: 'Several inputs may share an output, so a function can have fewer outputs than inputs.' }];
    return B.mc(r, '<b>' + title + '</b><br>' + fig + 'Is this relation a function? Choose the answer with the correct reason.', opts,
      two ? two + ' has two arrows leaving (to ' + by[two].join(' and ') + '): one input, two outputs. <b>Not a function.</b>' : 'Each student has exactly one arrow leaving' + (shared ? '; ' + shared + ' receiving two arrows is allowed' : '') + '. <b>Function.</b>', HARR, text);
  }

  /* more graphs (window ±5, like the copied generators) */
  function gCircle(r) {
    var o = pickWhere(function () { return { h: r.int(-1, 1), k: r.int(-1, 1), R: r.pick([2, 3, 3]) }; }, function (o) { return Math.abs(o.h) + o.R <= 4.6 && Math.abs(o.k) + o.R <= 4.6; });
    return notG({ segs: [{ pts: ell(o.h, o.k, o.R, o.R, 0, 2 * Math.PI) }] }, o.h, [[o.h, o.k + o.R], [o.h, o.k - o.R]], 'circle');
  }
  function gSlant(r) {
    var o = pickWhere(function () { return { x1: r.int(-4, -2), y1: r.int(-4, 4), x2: r.int(2, 4), y2: r.int(-4, 4) }; }, function (o) { return Math.abs(o.y2 - o.y1) >= 3; });
    var m = (o.y2 - o.y1) / (o.x2 - o.x1), vx = 0, hy = o.y1 + m * (0 - o.x1);
    return fnG({ segs: [{ pts: [[o.x1, o.y1], [o.x2, o.y2]] }] }, vx, [vx, Math.round(hy * 10) / 10], 'slanted segment', 'a slanted line meets each vertical line once');
  }
  function gVee(r) {
    var o = pickWhere(function () { return { h: r.int(-1, 1), k: r.int(-3, 3), d: r.pick([3, 4]), s: r.pick([1, -1]) }; }, function (o) { return Math.abs(o.k + o.s * o.d) <= 4.6 && Math.abs(o.h) + o.d <= 4.6; });
    return fnG({ segs: [{ pts: [[o.h - o.d, o.k + o.s * o.d], [o.h, o.k], [o.h + o.d, o.k + o.s * o.d]] }] }, o.h, [o.h, o.k], 'V shape', 'the V has exactly one point above or below each ' + t('x') + '-value');
  }
  function gCubic(r) {
    var a = r.pick([0.06, 0.08, -0.06, -0.08]), h = r.int(-1, 1), k = r.int(-1, 1), f = function (x) { return a * Math.pow(x - h, 3) + k; };
    return fnG({ fns: [{ f: f, from: -4.6, to: 4.6 }] }, h, [h, k], 'S-shaped curve', 'the curve always moves left to right');
  }
  function gPieces(r) {
    var y1 = r.int(1, 4), y2 = -r.int(1, 4), a = r.int(-4, -2), b = r.int(-1, 0), c = r.int(1, 2), d = r.int(3, 4);
    if (r.chance(0.7)) {
      var g = fnG({ segs: [{ pts: [[-4.6, y1], [b, y1]], start: 'none', end: 'closed' }, { pts: [[c, y2], [4.6, y2]], start: 'closed', end: 'none' }] }, b, [b, y1], 'two separate pieces', 'the two pieces sit over different ' + t('x') + '-values, so no vertical line meets both');
      return g;
    }
    var lo = r.int(-1, 0), hi = r.int(1, 2);
    return notG({ segs: [{ pts: [[-4.6, y1], [hi, y1]], start: 'none', end: 'closed' }, { pts: [[lo, y2], [4.6, y2]], start: 'closed', end: 'none' }] }, lo, [[lo, y1], [lo, y2]], 'two overlapping pieces', ' (the two pieces overlap for ' + t(nT(lo) + '\\le x\\le ' + nT(hi)) + ')');
  }
  function gPts(r, fn) {
    var xs = r.sample(range(-4, 4), 5).sort(num), ys = r.sample(nz(-4, 4), 5);
    var pts = xs.map(function (x, i) { return [x, ys[i]]; });
    if (fn) pts[r.int(2, 4)][1] = pts[0][1];
    else { var i = r.int(1, 4); pts[i] = [pts[i - 1][0], pts[i - 1][1] > 0 ? -r.int(1, 4) : r.int(1, 4)]; }
    var I = info(pts);
    if (fn) return fnG({ points: pts.map(function (p) { return { x: p[0], y: p[1] }; }) }, pts[0][0], pts[0], 'plotted points', 'the inputs ' + andT(I.xs) + ' are all different');
    var b = I.breakers[0];
    return notG({ points: pts.map(function (p) { return { x: p[0], y: p[1] }; }) }, b.x, b.ys.map(function (y) { return [b.x, y]; }), 'plotted points');
  }
  function gSemi(r) {
    var o = pickWhere(function () { return { h: r.int(-1, 1), k: r.int(-2, 1), R: r.pick([3, 4]), s: r.pick([1, 1, -1]) }; }, function (o) { return Math.abs(o.h) + o.R <= 4.6 && Math.abs(o.k + o.s * o.R) <= 4.6; });
    return fnG({ segs: [{ pts: ell(o.h, o.k, o.R, o.R, 0, o.s * Math.PI), start: 'closed', end: 'closed' }] }, o.h, [o.h, o.k + o.s * o.R], (o.s > 0 ? 'upper' : 'lower') + ' half of a circle', 'only the ' + (o.s > 0 ? 'upper' : 'lower') + ' half of the circle is drawn');
  }
  function gVert(r) { var c = r.pick(nz(-4, 4)); var g = notG({ segs: [{ pts: [[c, -4.6], [c, 4.6]], start: 'arrow', end: 'arrow' }] }, c, [[c, -2], [c, 2]], 'vertical line'); g.why = 'This graph <i>is</i> the vertical line ' + t('x=' + c) + ': the one input ' + t(c) + ' is paired with every ' + t('y') + ', e.g. ' + t(pT([c, -2])) + ' and ' + t(pT([c, 2])) + '. <b>Not a function.</b>'; return g; }
  function gHoriz(r) { var c = r.pick(nz(-4, 4)); return fnG({ segs: [{ pts: [[-4.6, c], [4.6, c]], start: 'arrow', end: 'arrow' }] }, 2, [2, c], 'horizontal line', 'a horizontal line gives the one output ' + t(c) + ' for every input'); }

  /* ---- "write two ordered pairs from the graph that share an x-value" ----
   * s: { spec, ysAt(x) -> [y…] (points of the graph above x), exact (points / a vertical line: no reading tolerance), key: [[x, y1], [x, y2]], what } */
  function shareSpec(kind, r) {
    if (kind === 'circle') { var o = pickWhere(function () { return { h: r.int(-1, 1), k: r.int(-1, 1), R: r.pick([2, 3, 3]) }; }, function (o) { return Math.abs(o.h) + o.R <= 4.6 && Math.abs(o.k) + o.R <= 4.6; });
      return { spec: { segs: [{ pts: ell(o.h, o.k, o.R, o.R, 0, 2 * Math.PI) }] }, what: 'circle', ysAt: function (x) { var d = o.R * o.R - (x - o.h) * (x - o.h); return d < 0 ? [] : [o.k + Math.sqrt(d), o.k - Math.sqrt(d)]; }, key: [[o.h, o.k + o.R], [o.h, o.k - o.R]] }; }
    if (kind === 'ellipse') { var e = pickWhere(function () { return { h: r.int(-1, 1), k: r.int(-1, 1), a: r.pick([3, 4]), b: r.pick([2, 3]) }; }, function (e) { return Math.abs(e.h) + e.a <= 4.6 && Math.abs(e.k) + e.b <= 4.6 && e.a !== e.b; });
      return { spec: { segs: [{ pts: ell(e.h, e.k, e.a, e.b, 0, 2 * Math.PI) }] }, what: 'ellipse', ysAt: function (x) { var d = 1 - (x - e.h) * (x - e.h) / (e.a * e.a); return d < 0 ? [] : [e.k + e.b * Math.sqrt(d), e.k - e.b * Math.sqrt(d)]; }, key: [[e.h, e.k + e.b], [e.h, e.k - e.b]] }; }
    if (kind === 'sideways') { var sw = pickWhere(function () { var a = r.pick([0.5, 1]); return { s: r.pick([1, -1]), a: a, d: a === 1 ? 1 : 2, h: r.int(-3, 3), k: r.int(-1, 1) }; }, function (q) { var m = q.a === 1 ? 2 : 3; return Math.abs(q.h + q.s * q.a * m * m) <= 4.6 && Math.abs(q.h) <= 4 && Math.abs(q.k) + m <= 4.6; });
      var m2 = sw.a === 1 ? 2 : 3, pts = []; for (var i = 0; i <= 80; i++) { var y = sw.k - m2 + 2 * m2 * i / 80; pts.push([sw.h + sw.s * sw.a * (y - sw.k) * (y - sw.k), y]); }
      var vx = sw.h + sw.s * sw.a * sw.d * sw.d;
      return { spec: { segs: [{ pts: pts }] }, what: 'sideways curve', ysAt: function (x) { var q = (x - sw.h) / (sw.s * sw.a); return q < 0 || Math.sqrt(q) > m2 + 0.05 ? [] : [sw.k + Math.sqrt(q), sw.k - Math.sqrt(q)]; }, key: [[vx, sw.k + sw.d], [vx, sw.k - sw.d]] }; }
    if (kind === 'vertical') { var c = r.pick(nz(-4, 4)); return { spec: { segs: [{ pts: [[c, -4.6], [c, 4.6]], start: 'arrow', end: 'arrow' }] }, what: 'vertical line', vert: c, ysAt: function () { return []; }, key: [[c, 1], [c, 3]] }; }
    var g = gPts(r, false), b = info(g.spec.points.map(function (p) { return [p.x, p.y]; })).breakers[0];
    return { spec: g.spec, what: 'plotted points', exact: true, pts: g.spec.points.map(function (p) { return [p.x, p.y]; }), ysAt: function () { return []; }, key: [[b.x, b.ys[0]], [b.x, b.ys[1]]] };
  }
  function sharePart(prompt, s, text, sol) {
    var onG = function (p) {
      if (s.vert != null) return same(p[0], s.vert);
      if (s.exact) return s.pts.some(function (q) { return same(q[0], p[0]) && same(q[1], p[1]); });
      return s.ysAt(p[0]).some(function (y) { return Math.abs(y - p[1]) <= 0.2; });
    };
    var check = function (resp) {
      var L = readPairs(resp);
      if (L.empty) return form('empty', 'Type two ordered pairs, e.g. ' + t('(1,\\ 2),\\ (1,\\ -2)') + '.');
      if (L.bad) return form('unreadable', 'Write ordered pairs in brackets, separated by a comma, e.g. ' + t('(1,\\ 2),\\ (1,\\ -2)') + '.');
      if (L.pairs.length !== 2) return form('u5l8-count', 'Write exactly <b>two</b> ordered pairs.');
      var p = L.pairs[0], q = L.pairs[1];
      if (!same(p[0], q[0])) return wrong('u5l8-not-same-x', 'Your two points have different ' + t('x') + '-values (' + t(nT(p[0])) + ' and ' + t(nT(q[0])) + '). Pick two points straight above and below each other — on the same vertical line.');
      if (Math.abs(p[1] - q[1]) < 0.25) return wrong('u5l8-same-pair', 'Those are (almost) the same point. You need two points with the same ' + t('x') + ' but <b>different</b> ' + t('y') + '-values.');
      var off = [p, q].filter(function (z) { return !onG(z); })[0];
      if (off) { var ys = s.ysAt(off[0]); return wrong('u5l8-off-graph', t(pT(off)) + ' isn’t on the graph.' + (ys.length ? ' Above ' + t('x=' + nT(off[0])) + ' the graph is at about ' + t('y=' + ys.map(function (y) { return nT(Math.round(y * 10) / 10); }).join('\\text{ and }y=')) + '.' : ' Read the coordinates off the grid.')); }
      return ok();
    };
    var k = s.key;
    return { prompt: G(s.spec) + prompt, input: { type: 'math', keys: 'pairs', placeholder: 'e.g. (1, 2), (1, -2)' }, check: check, key: '(' + nT(k[0][0]) + ', ' + nT(k[0][1]) + '), (' + nT(k[1][0]) + ', ' + nT(k[1][1]) + ')',
      answer: 'For example ' + t(pT(k[0]) + ',\\ ' + pT(k[1])), solution: sol || ('The vertical line ' + t('x=' + nT(k[0][0])) + ' meets the ' + s.what + ' at ' + t(pT(k[0])) + ' and ' + t(pT(k[1])) + ': one input, two outputs, so the relation is not a function. (Other pairs straight above and below each other work too.)'),
      hints: ['Draw a vertical line that crosses the graph twice. Read the two points where it crosses.', 'Both points must have the same ' + t('x') + '-value and different ' + t('y') + '-values.'], text: text,
      bad: ['(' + nT(k[0][0]) + ', ' + nT(k[0][1]) + ')', '(' + nT(k[0][0]) + ', ' + nT(k[0][1]) + '), (' + nT(k[0][1]) + ', ' + nT(k[0][0]) + ')'] };
  }

  /* word relations: [text, isFunction, reason] */
  var WORDS_FN = [
    ['Each licensed driver in Alberta paired with their driver’s licence number.', 'each driver has exactly one licence number'],
    ['Each student in the school paired with their date of birth.', 'each student has exactly one date of birth'],
    ['Each Canadian province paired with its capital city.', 'each province has exactly one capital'],
    ['Each car in a parking lot paired with its licence plate.', 'each car has exactly one licence plate'],
    ['Each person in your class paired with their height in centimetres (measured today).', 'each person has exactly one height today'],
    ['Each book in the library paired with its number of pages.', 'each book has exactly one page count'],
    ['Each house on a street paired with its street number.', 'each house has exactly one street number'],
    ['Each hockey player on a team paired with their jersey number.', 'each player wears exactly one number'],
    ['Each day last week paired with the high temperature that day.', 'each day had exactly one high temperature'],
    ['Each student paired with their homeroom teacher.', 'each student has exactly one homeroom teacher']];
  var WORDS_NOT = [
    ['Each ice cream flavour sold at a shop paired with the students who chose it as their favourite.', 'one flavour can be the favourite of many students'],
    ['Each teacher paired with the students in their classes.', 'one teacher has many students'],
    ['Each month paired with the dates it contains.', 'one month contains many dates'],
    ['Each colour paired with the cars in a parking lot of that colour.', 'one colour belongs to many cars'],
    ['Each city paired with the people who live there.', 'one city has many residents'],
    ['Each musician in a band paired with the instruments they play.', 'a musician can play several instruments'],
    ['Each bus route paired with the students who ride it.', 'one route carries many students'],
    ['Each grade level paired with the students in that grade.', 'one grade has many students'],
    ['Each sport paired with the students on the school team for it.', 'one sport has many players'],
    ['Each test score on a math test paired with the students who earned it.', 'one score can be earned by many students']];
  function wordMC(r, w, isFn, text) {
    var opts = isFn ? [{ html: 'Function — ' + w[1] + '.', right: true }, { html: 'Not a function — two of them could share the same output.', code: 'shared-out', why: 'Two inputs sharing an output is allowed. Ask: can one input have two outputs?' },
      { html: 'Not a function — it isn’t written as an equation.', code: 'forms', why: 'A relation can be a function in words, tables or diagrams too.' }, { html: 'Function — every output belongs to exactly one input.', code: 'out-reason', why: 'That is about the outputs. A function needs each <b>input</b> to have exactly one output — and here ' + w[1] + '.' }]
      : [{ html: 'Not a function — ' + w[1] + '.', right: true }, { html: 'Function — each output is paired with exactly one input.', code: 'out-reason', why: 'Look at the first item in each pair (the input): ' + w[1] + '.' },
      { html: 'Function — every input has at least one output.', code: 'at-least', why: 'A function needs <b>exactly</b> one output per input, and ' + w[1] + '.' }, { html: 'Not a function — it isn’t written as an equation.', code: 'forms', why: 'The verdict is right, but not the reason: a relation in words can be a function. The real reason: ' + w[1] + '.' }];
    return B.mc(r, w[0] + ' Is this relation a function?', opts, (isFn ? '<b>Function:</b> ' : '<b>Not a function:</b> ') + w[1] + '.', ['The first item in each pair is the input. Can one input have more than one output?'], text);
  }
  /* height of a balloon over time */
  function balloon(r) {
    var peak = r.pick([3, 4]), top = r.int(70, 90), h = [0];
    for (var i = 1; i <= 6; i++) h.push(i <= peak ? Math.round(top * Math.sin(Math.PI / 2 * i / peak) * (0.92 + 0.08 * r.next())) : Math.round(top * (1 - (i - peak) / (7 - peak)) * (0.9 + 0.1 * r.next())));
    h[peak] = top; h[6] = r.int(0, 8);
    var pts = []; for (var j = 0; j < 6; j++) { var p0 = h[Math.max(0, j - 1)], p1 = h[j], p2 = h[j + 1], p3 = h[Math.min(6, j + 2)]; for (var s = 0; s < 10; s++) { var u = s / 10; pts.push([10 * j + 10 * u, 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u)]); } }
    pts.push([60, h[6]]);
    return { h: h, top: top, peak: peak, svg: HW.graph({ x: [0, 65], y: [0, 100], grid: 10, gridY: 20, labelsX: 10, labelsY: 20, labels: 10, unitX: 4, unitY: 2.2, xName: 't', yName: 'h', xTitle: 'Time (min)', yTitle: 'Height (m)', firstQuadrant: true, segs: [{ pts: pts }], max: 330 }) };
  }

  /* ================= questions ================= */
  var QUESTIONS = [
    /* Q1 name diagrams */
    { num: '1', section: 'Part A — Is It a Function?', stem: 'Each arrow diagram pairs students with something about them. Is each relation a function? Explain.',
      shared: function (r) { return { kids: r.sample(NAMES, 4) }; },
      parts: [
        { id: '1a', sub: 'a', level: 'BEG', make: function (r, sh) {
          var pets = r.sample(['Dog', 'Cat', 'Fish', 'Bird', 'Rabbit', 'Hamster'], 3), ps = sh.kids.map(function (k, i) { return [k, pets[i < 3 ? i : 0]]; });
          ps = ps.map(function (p, i) { return i === 3 ? [p[0], pets[r.int(0, 2)]] : p; });
          return namesMC(r, 'Diagram A — Favourite pet', nameDiagram(sh.kids, pets, ps), sh.kids, ps, 'pet', pets, 'names: favourite pet');
        } },
        { id: '1b', sub: 'b', level: 'EMG', make: function (r, sh) {
          var sp = r.sample(['Soccer', 'Basketball', 'Swim', 'Hockey', 'Volleyball', 'Track'], 3), ps = [];
          var two = r.chance(0.8) ? r.int(0, 3) : -1;
          sh.kids.forEach(function (k, i) { var a = r.int(0, 2); ps.push([k, sp[a]]); if (i === two) ps.push([k, sp[(a + r.int(1, 2)) % 3]]); });
          if (two < 0 && info(ps.map(function (p) { return [sh.kids.indexOf(p[0]), sp.indexOf(p[1])]; })).shared.length === 0) ps[3][1] = ps[0][1];
          return namesMC(r, 'Diagram B — Sports played', nameDiagram(sh.kids, sp, ps), sh.kids, ps, 'sport', sp, 'names: sports');
        } }] },

    /* Q2 ordered pairs */
    { num: '2', stem: 'Determine whether each relation is a function. Give a reason.', parts: [
      { id: '2a', sub: 'a', level: 'BEG', make: function (r) { var xs = r.sample(range(-3, 9), 4).sort(num), c = r.int(-5, 9); return reasonMC(r, '<p>' + psH(xs.map(function (x) { return [x, c]; })) + '</p>', xs.map(function (x) { return [x, c]; }), 'pairs', 'constant output'); } },
      { id: '2b', sub: 'b', level: 'BEG', make: function (r) { var xs = r.sample(range(-3, 9), 3).sort(num), ys = r.sample(range(-5, 12), 4); var ps = [[xs[0], ys[0]], [xs[0], ys[1]], [xs[1], ys[2]], [xs[2], ys[3]]]; return reasonMC(r, '<p>' + psH(ps) + '</p>', ps, 'pairs', 'repeated input'); } },
      { id: '2c', sub: 'c', level: 'BEG', make: function (r) { var s = r.int(-3, 1), c = r.int(-2, 3), m = r.pick([2, 3, -1, -2]), b = r.int(-3, 4), sq = r.chance(0.6), ps = range(s, s + 3).map(function (x) { return [x, sq ? x * x + c : m * x + b]; }); return reasonMC(r, '<p>' + psH(ps) + '</p>', ps, 'pairs', 'pattern'); } },
      { id: '2d', sub: 'd', level: 'EMG', make: function (r) { var xs = r.sample(range(-2, 9), 3).sort(num), ys = r.sample(range(-4, 9), 3); var ps = [[xs[0], ys[0]], [xs[0], ys[0]], [xs[1], ys[1]], [xs[2], ys[2]]]; return reasonMC(r, '<p>' + psH(ps) + '</p>', ps, 'pairs', 'repeated pair'); } }] },

    /* Q3 tables */
    { num: '3', stem: 'Determine whether each table represents a function.', parts: [
      { id: '3a', sub: 'a', level: 'BEG', make: function (r) { var s = r.int(1, 5), d = r.pick([10, 5, 2, 3, 4, -2]), b = r.pick([0, 0, 1, -1, 2, 5]), ps = range(0, 3).map(function (i) { return [s + i, d * (s + i) + b]; }); return reasonMC(r, htab(ps, 'x', 'y'), ps, 'pairs', 'table fn'); } },
      { id: '3b', sub: 'b', level: 'EMG', make: function (r) { var xs = r.sample(range(1, 9), 3), ys = r.sample(range(1, 9), 4); var ps = [[xs[0], ys[0]], [xs[1], ys[1]], [xs[0], ys[2]], [xs[2], ys[3]]]; return reasonMC(r, htab(ps, 'x', 'y'), ps, 'pairs', 'table repeated x'); } }] },

    /* Q4 words */
    { num: '4', stem: 'State whether each relation described in words is a function, and explain.', parts: [
      { id: '4a', sub: 'a', level: 'BEG', make: function (r) { var f = r.chance(0.75); return wordMC(r, r.pick(f ? WORDS_FN : WORDS_NOT), f, 'words a'); } },
      { id: '4b', sub: 'b', level: 'EMG', make: function (r) { var f = r.chance(0.25); return wordMC(r, r.pick(f ? WORDS_FN : WORDS_NOT), f, 'words b'); } }] },

    /* Q5, Q6 definitions */
    { num: '5', parts: [{ id: '5', level: 'LIM', make: function (r) {
      return B.mc(r, 'Fill in the blanks: a function is a relation in which every ______ is paired with exactly ______ output.', [{ html: 'input; one', right: true }, { html: 'output; one', why: 'It is the inputs that may each have only one output. Outputs may repeat.', code: 'rev' },
        { html: 'input; at least one', why: '“At least one” would allow two outputs. A function allows exactly one.', code: 'atleast' }, { html: 'output; two', why: 'Read the definition from the notes again: inputs, and exactly one output each.', code: 'two' }],
        'A function is a relation in which every <b>input</b> is paired with exactly <b>one</b> output.', ['Which may repeat freely — inputs or outputs?'], 'definition');
    } }] },
    { num: '6', parts: [{ id: '6', level: 'LIM', make: function (r) {
      return B.mc(r, 'Which statement is the vertical line test?', [{ html: 'If any vertical line crosses the graph more than once, the relation is not a function.', right: true },
        { html: 'If any horizontal line crosses the graph more than once, the relation is not a function.', why: 'Horizontal lines only show inputs sharing an output, which is allowed.', code: 'hlt' },
        { html: 'If a vertical line misses the graph, the relation is not a function.', why: 'Missing the graph just means that ' + t('x') + ' is not an input. Only crossing twice fails.', code: 'miss' },
        { html: 'If every vertical line crosses the graph at least twice, the relation is a function.', why: 'Crossing twice means one ' + t('x') + ' with two ' + t('y') + '-values — the opposite.', code: 'rev' }],
        'If any vertical line crosses the graph more than once, one ' + t('x') + '-value has two ' + t('y') + '-values, so the relation is <b>not</b> a function.', HVLT, 'VLT statement');
    } }] },

    /* Q7 graphs */
    { num: '7', section: 'Part B — The Vertical Line Test', stem: 'Use the vertical line test to classify each graph.', parts: [
      { id: '7a', sub: 'a', level: 'BEG', make: function (r) { return graphPick(r, r.chance(0.8) ? gSlant(r) : gVert(r)); } },
      { id: '7b', sub: 'b', level: 'BEG', make: function (r) { return graphPick(r, gParabola(r)); } },
      { id: '7c', sub: 'c', level: 'BEG', make: function (r) { return graphPick(r, r.chance(0.75) ? gCircle(r) : gSemi(r)); } },
      { id: '7d', sub: 'd', level: 'EMG', make: function (r) { return graphPick(r, gSideways(r)); } }] },
    { num: '8', parts: [{ id: '8', level: 'EMG', make: function (r) { return sharePart('This circle is not a function. Write two ordered pairs from the graph that share the same ' + t('x') + '-value but have different ' + t('y') + '-values.', shareSpec('circle', r), 'share x circle'); } }] },
    { num: '9', parts: [{ id: '9', level: 'EMG', make: function (r) { return sharePart('This sideways curve is not a function. Write two ordered pairs from the graph that share the same ' + t('x') + '-value but have different ' + t('y') + '-values.', shareSpec('sideways', r), 'share x sideways'); } }] },
    { num: '10', stem: 'Use the vertical line test to classify each graph.', parts: [
      { id: '10a', sub: 'E', level: 'BEG', make: function (r) { return graphPick(r, r.chance(0.8) ? gHoriz(r) : gVert(r)); } },
      { id: '10b', sub: 'F', level: 'BEG', make: function (r) { return graphPick(r, r.chance(0.8) ? gBlob(r, r.chance(0.5)) : gWave(r)); } },
      { id: '10c', sub: 'G', level: 'BEG', make: function (r) { return graphPick(r, gTallEllipse(r)); } },
      { id: '10d', sub: 'H', level: 'BEG', make: function (r) { return graphPick(r, gParabola(r)); } }] },

    /* Q11 balloon */
    { num: '11', section: 'Part C — Applications and Review', parts: [{ id: '11', level: 'EMG', make: function (r) {
      var b = balloon(r);
      return B.mc(r, 'The graph shows the height of a hot-air balloon during a one-hour flight.<br>' + b.svg + 'Is height over time a function? Explain using the vertical line test.', [
        { html: 'Function — at each moment the balloon has exactly one height, so every vertical line crosses the graph once.', right: true },
        { html: 'Not a function — the balloon is at the same height twice (going up and coming down).', code: 'hlt', why: 'Two <b>times</b> sharing a height is a horizontal line crossing twice — allowed. Only a vertical line crossing twice would fail.' },
        { html: 'Not a function — the graph is curved.', code: 'curved', why: 'Curves can be functions. Slide a vertical line across the graph.' },
        { html: 'Function — every height happens at exactly one time.', code: 'out-reason', why: 'That’s not even true (it reaches most heights twice) — and it is about outputs. What matters is one height for each time.' }],
        'Every vertical line (one moment in time) crosses the graph exactly once: the balloon can only be at one height at a time. It reaches some heights twice — going up and coming down — but that is two inputs sharing an output, which is allowed. <b>Function.</b>', HVLT, 'balloon');
    } }] },
    { num: '12', parts: [{ id: '12', level: 'EMG', make: function (r) { return wordMC(r, r.pick(WORDS_NOT), false, 'one-to-many words'); } }] },

    /* Q13 MC which is not a function */
    { num: '13', stem: '<i>(Multiple choice)</i>', parts: [{ id: '13', level: 'BEG', make: function (r) {
      var mk = function (kind) { var xs = r.sample(range(-2, 6), 4).sort(num); if (kind === 'lin') { var m = r.pick([1, 2]), b = r.int(-1, 3); return xs.map(function (x) { return [x, m * x + b]; }); } if (kind === 'const') { var c = r.int(1, 9); return xs.map(function (x) { return [x, c]; }); } if (kind === 'not') { var ys = r.sample(range(1, 9), 4); return [[xs[0], ys[0]], [xs[0], ys[1]], [xs[1], ys[2]], [xs[2], ys[3]]]; } var y2 = r.sample(range(0, 9), 4); return xs.map(function (x, i) { return [x, y2[i]]; }); };
      var sets = { not: mk('not'), lin: mk('lin'), c: mk('const'), any: mk('any') };
      return B.mc(r, 'Which set of ordered pairs is <b>not</b> a function?', ['not', 'lin', 'c', 'any'].map(function (k) { var ps = sets[k]; return { html: psH(ps), right: k === 'not', why: k === 'not' ? null : 'Every input in this set has one output' + (k === 'c' ? ' (the shared output is allowed)' : '') + '.', code: k }; }),
        'In ' + psH(sets.not) + ' the input ' + t(sets.not[0][0]) + ' is paired with ' + t(sets.not[0][1]) + ' and ' + t(sets.not[1][1]) + '. <b>Not a function.</b>', HFN, 'MC not a function');
    } }] },

    /* Q14 true / false */
    { num: '14', stem: 'State whether each statement is <b>true</b> or <b>false</b>.', parts: [
      { id: '14a', sub: 'a', level: 'LIM', make: function (r) { var x = r.int(-5, 9), y = r.sample(range(-5, 9), 2); return B.tf(r, '(a) A function can have two different outputs for the same input, such as ' + t(pT([x, y[0]])) + ' and ' + t(pT([x, y[1]])) + '.', false, 'One input with two different outputs is exactly what a function does not allow.', '<b>False</b> — each input of a function has exactly one output.', HFN, 'tf two outputs'); } },
      { id: '14b', sub: 'b', level: 'BEG', make: function (r) { var c = r.pick(nz(-5, 5)); return B.tf(r, '(b) Every vertical line drawn through the graph of a function, such as the line ' + t('x=' + c) + ', crosses it at most once.', true, 'That is the vertical line test: a function’s graph is crossed at most once by every vertical line.', '<b>True</b> — that is the vertical line test.', HVLT, 'tf vlt'); } },
      { id: '14c', sub: 'c', level: 'EMG', make: function (r) { var p = [r.int(-9, 9), r.int(-9, 9)]; return B.tf(r, '(c) A relation containing only one ordered pair, such as ' + t('\\{' + pT(p) + '\\}') + ', is always a function.', true, 'With one pair there is one input, and it has exactly one output.', '<b>True</b> — the one input ' + t(p[0]) + ' has exactly one output, ' + t(p[1]) + '.', HFN, 'tf one pair'); } }] },

    /* Q15 constant table */
    { num: '15', parts: [{ id: '15', level: 'EMG', make: function (r) {
      var s = r.int(1, 3), d = r.pick([1, 2, 3]), c = r.int(-5, 12), ps = range(0, 3).map(function (i) { return [s + d * i, c]; });
      return B.mc(r, htab(ps, 'x', 'y') + 'Is this relation a function, even though every output is the same number?', [
        { html: 'Yes — every ' + t('x') + '-value is different, so each input has exactly one output (it just happens to be ' + t(c) + ').', right: true },
        { html: 'No — the output ' + t(c) + ' is repeated.', code: 'shared-out', why: 'Outputs may repeat. Check the inputs: are any of them repeated with different outputs?' },
        { html: 'No — a function must have different outputs.', code: 'outs-distinct', why: 'Nothing in the definition says outputs must differ. Each input just needs one output.' },
        { html: 'Yes — because all the outputs are equal.', code: 'out-reason', why: 'The verdict is right, but the reason is the inputs: ' + andT(ps.map(function (p) { return p[0]; })) + ' are all different.' }],
        'Yes. The inputs ' + andT(ps.map(function (p) { return p[0]; })) + ' are all different, so each input has exactly one output, even though that output is always ' + t(c) + '. <b>Function.</b> (It is a horizontal line of points.)', HFN, 'constant table');
    } }] }
  ];

  /* ================= extra practice ================= */
  var EXTRA = [
    { num: '1', section: 'Extra Practice A — The Rule, Stated Precisely', stem: 'Decide whether each set of ordered pairs is a function. If it is not, name the input that breaks the rule.', parts: [
      { id: 'e1a', sub: 'a', level: 'BEG', make: function (r) { var xs = r.sample(range(-4, 8), 4).sort(num), c = r.int(-3, 9), ps = xs.map(function (x) { return [x, c]; }); return breakerPart('<p>' + psH(ps) + '</p>', ps, 'x', 'y', 'The inputs ' + andT(xs) + ' are all different; the repeated output ' + t(c) + ' doesn’t matter. <b>Function.</b>', 'breaker const'); } },
      { id: 'e1b', sub: 'b', level: 'EMG', make: function (r) { var xs = r.sample(range(-2, 9), 3), ys = r.sample(range(1, 9), 3), ps = shuffleApart(r, [[xs[0], ys[0]], [xs[1], ys[1]], [xs[0], ys[0]], [xs[2], ys[2]]]); return breakerPart('<p>' + psH(ps) + '</p>', ps, 'x', 'y', t(xs[0]) + ' appears twice, but with the <b>same</b> output ' + t(ys[0]) + ' both times — the same pair repeated. Every input has one output. <b>Function.</b>', 'breaker dup pair'); } },
      { id: 'e1c', sub: 'c', level: 'BEG', make: function (r) { var xs = r.sample(range(-3, 6), 3), y = r.int(1, 8), ys = r.sample(range(2, 12), 2); var ps = shuffleApart(r, [[xs[0], y], [xs[1], ys[0]], [xs[0], -y], [xs[2], ys[1]]]); return breakerPart('<p>' + psH(ps) + '</p>', ps, 'x', 'y', 'The input ' + t(xs[0]) + ' is paired with both ' + t(y) + ' and ' + t(-y) + '. <b>Not a function.</b>', 'breaker ±'); } },
      { id: 'e1d', sub: 'd', level: 'EMG', make: function (r) { var a = r.int(1, 3), ps = shuffleApart(r, [[0, 0], [a, -a], [-a, a], [a, a]]); return breakerPart('<p>' + psH(ps) + '</p>', ps, 'x', 'y', 'The input ' + t(a) + ' is paired with both ' + t(-a) + ' and ' + t(a) + '. <b>Not a function.</b>', 'breaker sign pair'); } }] },
    { num: '2', stem: 'Decide whether each table represents a function. Two of these catch a reader who only checks whether an ' + t('x') + '-value repeats.', parts: [
      { id: 'e2a', sub: 'a', level: 'BEG', make: function (r) { var s = r.int(-4, -1), d = 2, c = r.int(-4, 6), ps = range(0, 3).map(function (i) { return [s + d * i, c]; }); return reasonMC(r, htab(ps, 'x', 'y'), ps, 'pairs', 'table const'); } },
      { id: 'e2b', sub: 'b', level: 'EMG', make: function (r) { var xs = r.sample(range(1, 9), 3), ys = r.sample(range(1, 9), 3), ps = [[xs[0], ys[0]], [xs[1], ys[1]], [xs[0], ys[0]], [xs[2], ys[2]]]; return reasonMC(r, htab(ps, 'x', 'y'), ps, 'pairs', 'table dup pair'); } },
      { id: 'e2c', sub: 'c', level: 'EMG', make: function (r) { var s = r.int(-2, 2), ys = r.sample(range(1, 12), 4).sort(num), ps = [[s, ys[0]], [s + 1, ys[1]], [s + 2, ys[2]], [s + 1, ys[3]]]; return reasonMC(r, htab(ps, 'x', 'y'), ps, 'pairs', 'table repeated x'); } }] },
    { num: '3', stem: 'Decide whether each mapping diagram is a function. Count the arrows <b>leaving</b> each input.', parts: [
      { id: 'e3a', sub: 'a', level: 'BEG', make: function (r) { var L = r.sample(range(1, 9), 4).sort(num), R = r.sample(range(1, 12), 2).sort(num), ps = [[L[0], R[0]], [L[1], R[0]], [L[2], R[1]], [L[3], R[1]]]; return reasonMC(r, arrow(ps, L, R), ps, 'arrow', 'arrows many-to-one'); } },
      { id: 'e3b', sub: 'b', level: 'BEG', make: function (r) { var L = r.sample(range(1, 9), 3).sort(num), R = r.sample(range(1, 12), 3).sort(num), ps = [[L[0], R[0]], [L[0], R[1]], [L[1], R[2]], [L[2], R[2]]]; return reasonMC(r, arrow(ps, L, R), ps, 'arrow', 'arrows one-to-many'); } },
      { id: 'e3c', sub: 'c', level: 'EMG', make: function (r) { var s = r.int(-3, -1), c = r.int(-2, 3), k = r.pick([1, 2]), ab = r.chance(0.3), L = range(s, s + 3), f = function (x) { return ab ? k * Math.abs(x) + c : x * x + c; }, ps = L.map(function (x) { return [x, f(x)]; }); var R = info(ps).ys.slice().sort(num); return reasonMC(r, arrow(ps, L, R), ps, 'arrow', 'arrows squares'); } }] },

    /* EP4 y = c vs x = c */
    { num: '4', stem: function (sh) { return '<b>Two lines that look equally simple.</b> One is a function and the other isn’t.<br><div style="display:flex;flex-wrap:wrap;gap:10px"><div>' + t('y=' + sh.c) + G({ segs: [{ pts: [[-4.6, sh.c], [4.6, sh.c]], start: 'arrow', end: 'arrow' }], max: 200 }) + '</div><div>' + t('x=' + sh.c) + G({ segs: [{ pts: [[sh.c, -4.6], [sh.c, 4.6]], start: 'arrow', end: 'arrow' }], max: 200 }) + '</div></div>'; },
      shared: function (r) { return { c: r.chance(0.15) ? 3 : r.pick(nz(-4, 4)) }; },
      parts: [
        { id: 'e4a', sub: 'a', level: 'BEG', make: function (r, sh) {
          return B.mc(r, '(a) Which one is a function? Apply the vertical line test to each.', [{ html: t('y=' + sh.c) + ' — every vertical line meets it exactly once', right: true },
            { html: t('x=' + sh.c) + ' — every horizontal line meets it exactly once', code: 'hlt', why: 'Horizontal lines don’t decide. The vertical line ' + t('x=' + sh.c) + ' lies right on top of ' + t('x=' + sh.c) + '.' },
            { html: 'Both are functions — they are straight lines', code: 'both', why: 'A vertical line is the one straight line that fails: the input ' + t(sh.c) + ' has every output.' },
            { html: 'Neither — a function can’t be a straight line', code: 'neither', why: 'Most straight lines are functions. Check each with a vertical line.' }],
            t('y=' + sh.c) + ' is a function: every vertical line meets it exactly once. ' + t('x=' + sh.c) + ' is not: the vertical line ' + t('x=' + sh.c) + ' lies on top of the graph and meets it infinitely many times.', HVLT, 'EP4 which');
        } },
        { id: 'e4b', sub: 'b', level: 'EMG', make: function (r, sh) { var s = shareSpec('vertical', r); s.vert = sh.c; s.key = [[sh.c, 0], [sh.c, 5]]; s.spec = { segs: [{ pts: [[sh.c, -4.6], [sh.c, 4.6]], start: 'arrow', end: 'arrow' }] }; return sharePart('(b) For the one that fails (' + t('x=' + sh.c) + '), write two ordered pairs from it that share an input.', s, 'EP4 share', 'Any two points with ' + t('x=' + sh.c) + ', e.g. ' + t(pT([sh.c, 0])) + ' and ' + t(pT([sh.c, 5])) + ': the one input ' + t(sh.c) + ' with two different outputs.'); } },
        { id: 'e4c', sub: 'c', level: 'PRG', make: function (r, sh) {
          return B.mc(r, '(c) Using the words <i>input</i> and <i>output</i>, what is the difference between the two relations?', [
            { html: 'In ' + t('y=' + sh.c) + ' every input has the one output ' + t(sh.c) + '; in ' + t('x=' + sh.c) + ' the single input ' + t(sh.c) + ' has every possible output.', right: true },
            { html: 'In ' + t('y=' + sh.c) + ' every output has one input; in ' + t('x=' + sh.c) + ' every output has many inputs.', code: 'rev', why: 'Turn it around: for ' + t('x=' + sh.c) + ', every point has input ' + t(sh.c) + ' — one input, many outputs.' },
            { html: t('y=' + sh.c) + ' has no inputs; ' + t('x=' + sh.c) + ' has no outputs.', code: 'none', why: 'Both have inputs and outputs. Read some points off each line.' },
            { html: 'There is no difference; they are the same line turned sideways.', code: 'same', why: 'Turning a graph sideways swaps inputs and outputs — and that is exactly what changes the verdict.' }],
            'For ' + t('y=' + sh.c) + ', each input ' + t('x') + ' has exactly one output, which happens to be ' + t(sh.c) + ' every time. For ' + t('x=' + sh.c) + ', the single input ' + t(sh.c) + ' has every possible output at once (and other inputs have none) — so it fails the one-output rule.', HFN, 'EP4 words');
        } }] },

    /* EP5 constructions */
    { num: '5', stem: '<b>Repeated outputs versus repeated inputs.</b>', parts: [
      { id: 'e5a', sub: 'a', level: 'PRG', make: function (r) {
        var key = [[1, 6], [2, 6], [3, 6], [4, 9]];
        var test = function (ps, I) {
          if (ps.length !== 4) return form('u5l8-count', 'Write exactly <b>four</b> ordered pairs.');
          if (!I.isFn) return wrong('u5l8-not-fn', 'The input ' + t(nT(I.breakers[0].x)) + ' has two different outputs, so this is not a function. Give the four pairs four different inputs.');
          var cnt = {}; ps.forEach(function (p) { cnt[nT(p[1])] = (cnt[nT(p[1])] || 0) + 1; });
          if (!Object.keys(cnt).some(function (k) { return cnt[k] >= 3; })) return wrong('u5l8-repeat-y', 'It is a function — now make the same ' + t('y') + '-value appear (at least) three times.');
          return ok();
        };
        return { prompt: '(a) Write a set of four ordered pairs that <b>is</b> a function and in which the same ' + t('y') + '-value appears three times.', input: { type: 'math', keys: 'pairs', placeholder: 'e.g. {(1, 6), (2, 6), …}' }, check: pairsCheck(test),
          key: '\\{(1, 6), (2, 6), (3, 6), (4, 9)\\}', answer: 'For example ' + t('\\{(1,\\ 6),\\ (2,\\ 6),\\ (3,\\ 6),\\ (4,\\ 9)\\}') + ' (answers vary — the four inputs must all differ).',
          solution: 'Use four <b>different</b> inputs, and give three of them the same output, e.g. ' + t('\\{(1,\\ 6),\\ (2,\\ 6),\\ (3,\\ 6),\\ (4,\\ 9)\\}') + '. Repeated outputs are allowed.', hints: ['Make the inputs (first numbers) all different.', 'Then use the same second number three times.'], text: 'build fn with repeated y',
          good: ['\\{(-2, 0), (5, 0), (7, 0), (8, 1)\\}', '(1,4),(2,4),(3,4),(4,4)'], bad: ['\\{(1, 6), (1, 7), (3, 6), (4, 6)\\}', '\\{(1, 6), (2, 7), (3, 8), (4, 9)\\}', '\\{(1, 6), (2, 6), (3, 6)\\}'] };
      } },
      { id: 'e5b', sub: 'b', level: 'PRG', make: function (r) {
        var xs = r.sample(range(1, 9), 4).sort(num), c = r.int(1, 9), o = r.int(1, 9); if (o === c) o = c + 1;
        var orig = [[xs[0], c], [xs[1], c], [xs[2], c], [xs[3], o]];
        var test = function (ps, I) {
          if (ps.length < 4) return wrong('u5l8-count', 'Keep four pairs: change one of them, don’t remove it.');
          if (ps.length > 4) return wrong('added', 'Don’t add a pair — <b>change</b> one of the four.');
          var kept = orig.filter(function (q) { return ps.some(function (p) { return same(p[0], q[0]) && same(p[1], q[1]); }); }).length;
          if (kept === 4) return wrong('unchanged', 'That is the same set. Change exactly one pair.');
          if (kept < 3) return wrong('changed-many', 'Change exactly <b>one</b> pair and keep the other three as they are.');
          if (I.isFn) return wrong('still-fn', 'It is still a function: every input has one output. Change a pair so that it <b>reuses an input</b> with a different output.');
          return ok();
        };
        var newP = [xs[0], o === c + 1 ? c + 2 : o]; var keyPs = orig.slice(0, 3).concat([newP]);
        return { prompt: '(b) The set ' + t('\\{' + psT(orig) + '\\}') + ' is a function. Change exactly one pair so that the set is <b>no longer</b> a function. Type the new set.', input: { type: 'math', keys: 'pairs', placeholder: 'e.g. {(1, 6), (2, 6), …}' }, check: pairsCheck(test),
          key: '\\{' + keyPs.map(function (p) { return '(' + p[0] + ', ' + p[1] + ')'; }).join(', ') + '\\}', answer: 'For example ' + t('\\{' + psT(keyPs) + '\\}') + ' (answers vary)',
          solution: 'Change one pair so that it uses an input that is already there, with a different output — e.g. change ' + t(pT(orig[3])) + ' to ' + t(pT(newP)) + ': now the input ' + t(xs[0]) + ' has two outputs, ' + t(c) + ' and ' + t(newP[1]) + '.', hints: ['A set stops being a function when one input gets two different outputs.', 'Change the first number of one pair to an input that is already used — with a different second number.'], text: 'change one pair',
          bad: ['\\{' + psT(orig).replace(/\\ /g, ' ') + '\\}', '\\{' + orig.slice(0, 3).concat([[xs[3] + 10, o]]).map(function (p) { return '(' + p[0] + ', ' + p[1] + ')'; }).join(', ') + '\\}'] };
      } },
      { id: 'e5c', sub: 'c', level: 'EMG', make: function (r) {
        return B.mc(r, '(c) Complete the sentence: “A repeated ' + t('y') + '-value is ______, but a repeated ' + t('x') + '-value is a problem whenever ______.”', [
          { html: 'always allowed; the two outputs attached to it are different', right: true },
          { html: 'never allowed; it appears', code: 'never', why: 'Repeated outputs are fine — think of a horizontal line.' },
          { html: 'always allowed; it appears at all', code: 'any', why: 'A repeated identical pair, like ' + t('(5,\\ 1)') + ' twice, is harmless. Only two <b>different</b> outputs break the rule.' },
          { html: 'a problem; the outputs are the same', code: 'rev', why: 'It’s the other way round: the same output is fine; different outputs for one input are the problem.' }],
          'A repeated ' + t('y') + '-value is <b>always allowed</b>; a repeated ' + t('x') + '-value is a problem whenever <b>the two outputs attached to it are different</b>.', HFN, 'repeated x vs y');
      } }] },

    /* EP6 Jordan */
    { num: '6', stem: function (sh) { return 'Jordan looks at ' + t('\\{' + psT(sh.ps) + '\\}') + ' and says: “This is not a function, because ' + t(sh.ps[0][0]) + ' and ' + t(sh.ps[1][0]) + ' both give ' + t(sh.ps[0][1]) + ' — the output ' + t(sh.ps[0][1]) + ' is used twice.”'; },
      shared: function (r) { if (r.chance(0.15)) return { ps: [[1, 5], [2, 5], [3, 8]] }; var xs = r.sample(range(1, 9), 3).sort(num), ys = r.sample(range(1, 12), 2); return { ps: [[xs[0], ys[0]], [xs[1], ys[0]], [xs[2], ys[1]]] }; },
      parts: [
        { id: 'e6a', sub: 'a', level: 'EMG', make: function (r, sh) {
          return B.mc(r, '(a) Is Jordan right?', [{ html: 'No — it <b>is</b> a function: each input has exactly one output; nothing forbids two inputs sharing an output.', right: true },
            { html: 'Yes — a function can’t use an output twice.', code: 'shared-out', why: 'The definition only limits <b>inputs</b>: each must have exactly one output.' },
            { html: 'No — it isn’t a function, but for a different reason.', code: 'not', why: 'Check each input: ' + andT(sh.ps.map(function (p) { return p[0]; })) + ' each have one output.' },
            { html: 'Yes — a function needs as many outputs as inputs.', code: 'sizes', why: 'Several inputs may share an output, so a function can have fewer outputs than inputs.' }],
            'Jordan is wrong — the set <b>is</b> a function. A function requires each <b>input</b> to have exactly one output: ' + sh.ps.map(function (p) { return t(p[0] + '\\to ' + p[1]); }).join(', ') + '. Two inputs sharing an output is allowed.', HFN, 'Jordan verdict');
        } },
        { id: 'e6b', sub: 'b', level: 'PRG', make: function (r, sh) {
          var sw = sh.ps.map(function (p) { return [p[1], p[0]]; });
          var p = B.pairs('(b) Jordan has reversed the roles of input and output. Write the set Jordan <i>would</i> have been right about, by swapping the coordinates of each pair.', sw, {}, 'Swapping gives ' + t('\\{' + psT(sw) + '\\}') + '. That set is <b>not</b> a function: the input ' + t(sw[0][0]) + ' now has two different outputs, ' + t(sw[0][1]) + ' and ' + t(sw[1][1]) + '.', ['Swap each pair: ' + t('(a,\\ b)\\to (b,\\ a)') + '.'], 'swap pairs');
          p.check = (function (c) { return function (resp) { var res = c(resp); if (res.v === 'wrong' && res.code === 'pairs-flip') { res.code = 'u5l8-swap'; res.hint = 'Those are the original pairs. Swap the two numbers in each pair.'; } return res; }; })(p.check);
          p.bad = ['\\{' + psT(sh.ps).replace(/\\ /g, ' ') + '\\}'];
          return p;
        } }] },

    /* EP7–9 graphs */
    { num: '7', section: 'Extra Practice B — The Vertical Line Test on Graphs', stem: 'Classify each graph. If it fails, the reason names a vertical line that crosses it more than once.', parts: [
      { id: 'e7a', sub: 'A', level: 'EMG', make: function (r) { return graphReasonMC(r, gVee(r)); } },
      { id: 'e7b', sub: 'B', level: 'EMG', make: function (r) { return graphReasonMC(r, gSideways(r)); } },
      { id: 'e7c', sub: 'C', level: 'EMG', make: function (r) { return graphReasonMC(r, gWideEllipse(r)); } }] },
    { num: '8', stem: 'Classify each graph. One of them may be drawn in separate pieces — decide carefully.', parts: [
      { id: 'e8a', sub: 'D', level: 'BEG', make: function (r) { return graphPick(r, r.chance(0.8) ? gVert(r) : gHoriz(r)); } },
      { id: 'e8b', sub: 'E', level: 'BEG', make: function (r) { return graphPick(r, gCubic(r)); } },
      { id: 'e8c', sub: 'F', level: 'PRG', make: function (r) { return graphPick(r, gPieces(r)); } }] },
    { num: '9', stem: 'Classify each graph.', parts: [
      { id: 'e9a', sub: 'G', level: 'EMG', make: function (r) { return graphPick(r, gPts(r, true)); } },
      { id: 'e9b', sub: 'H', level: 'BEG', make: function (r) { return graphPick(r, gPts(r, false)); } },
      { id: 'e9c', sub: 'I', level: 'EMG', make: function (r) { return graphPick(r, gSemi(r)); } }] },
    { num: '10', stem: 'Each graph is <b>not</b> a function. Write two ordered pairs from the graph that share the same ' + t('x') + '-value but have different ' + t('y') + '-values. Read the coordinates off the grid.', parts: ['sideways', 'ellipse', 'vertical', 'points'].map(function (k, i) {
      return { id: 'e10' + 'abcd'.charAt(i), sub: 'abcd'.charAt(i), level: i === 2 ? 'BEG' : 'EMG', make: function (r) { return sharePart('', shareSpec(k, r), 'EP10 share ' + k); } };
    }) },
    { num: '11', stem: function (sh) { return 'Amara looks at the vertical line ' + t('x=' + sh.c) + ' and says: “It is a perfectly straight line, and straight lines are functions, so this is a function.”'; },
      shared: function (r) { return { c: r.chance(0.15) ? -2 : r.pick(nz(-6, 6)) }; },
      parts: [
        { id: 'e11a', sub: 'a', level: 'EMG', make: function (r, sh) {
          return B.mc(r, '(a) Which is the accurate version of “straight lines are functions”?', [{ html: 'Every <b>non-vertical</b> straight line is a function; a vertical line is the one exception.', right: true },
            { html: 'No straight line is a function.', code: 'none', why: 'Lines like ' + t('y=2x+1') + ' pass the vertical line test.' }, { html: 'Every straight line is a function, including vertical ones.', code: 'all', why: 'A vertical line fails: the vertical line test line lies right on it.' },
            { html: 'Only horizontal lines are functions.', code: 'horiz', why: 'Slanted lines are functions too: each vertical line crosses them once.' }],
            'Every non-vertical straight line is a function; a vertical line such as ' + t('x=' + sh.c) + ' is the one exception.', HVLT, 'Amara rule');
        } },
        { id: 'e11b', sub: 'b', level: 'PRG', make: function (r, sh) {
          return B.mc(r, '(b) How many outputs does ' + t('x=' + sh.c) + ' give the single input ' + t(sh.c) + ', and why is one such input enough to decide?', [
            { html: 'Infinitely many; one input with two or more different outputs already breaks the rule, so one counterexample settles it.', right: true },
            { html: 'Exactly one, so it is a function.', code: 'one', why: 'Points like ' + t(pT([sh.c, 0])) + ' and ' + t(pT([sh.c, 1])) + ' are both on the line.' },
            { html: 'Infinitely many, but you must check every other input too before deciding.', code: 'check-all', why: 'One input with two outputs is enough — the rule says <b>every</b> input must have exactly one.' },
            { html: 'None, because the line has no slope.', code: 'none', why: 'The line has lots of points with input ' + t(sh.c) + '.' }],
            'The input ' + t(sh.c) + ' is paired with every ' + t('y') + '-value on the line — infinitely many outputs, when a function allows exactly one. One input with two different outputs already disqualifies a relation, so a single counterexample settles it.', HFN, 'Amara outputs');
        } }] },

    /* EP12 work backwards */
    { num: '12', section: 'Extra Practice C — Working Backwards, Context, and Reasoning', stem: function (sh) { return '<b>Work backwards.</b> The set ' + t('\\{' + psT(sh.A) + '\\}') + ' is a function.'; },
      shared: function (r) {
        var xs = r.chance(0.15) ? [1, 2, 4] : r.sample(range(-3, 9), 3).sort(num), m = r.pick([2, 3, -1]), b = r.int(-2, 4), A = xs.map(function (x) { return [x, m * x + b]; });
        var cx = r.sample(range(-3, 9), 1)[0], c1 = [cx, r.int(1, 9)], c2 = [r.int(-3, 9), r.int(1, 9)]; while (c2[0] === cx) c2[0]++;
        var x4 = c2[0] + r.int(1, 3); if (x4 === cx) x4 = c2[0] + 4;
        var C = shuffleApart(r, [[cx, c1[1]], c2, [cx, c1[1] + r.int(2, 5)], [x4, r.int(1, 9)]]);
        return { A: A, xs: xs, C: C, cx: cx };
      },
      parts: [
        { id: 'e12a', sub: 'a', level: 'ADV', make: function (r, sh) {
          var x0 = sh.xs[1], y0 = sh.A[1][1], brk = [x0, y0 + 2], keep = [Math.max.apply(null, sh.xs) + 2, 0];
          var fields = [{ label: 'Pair that breaks it:', name: 'breaking pair', mode: 'math', keys: 'pairs', placeholder: 'e.g. (2, 7)' }, { label: 'Pair that keeps it a function:', name: 'safe pair', mode: 'math', keys: 'pairs', placeholder: 'e.g. (6, 11)' }];
          var one = function (s) { var L = readPairs(s); return L.pairs && L.pairs.length === 1 ? L.pairs[0] : null; };
          var check = function (resp) {
            resp = resp || []; var a = one(resp[0]), c = one(resp[1]);
            if (!a || !c) return form('empty', 'Type one ordered pair in each box, like ' + t('(2,\\ 7)') + '.');
            if (info(sh.A.concat([a])).isFn) return wrong('u5l8-break', '<b>Breaking pair:</b> with ' + t(pT(a)) + ' added, every input still has one output. Reuse an input that is already there (' + andT(sh.xs) + ') with a <b>different</b> output.');
            if (!info(sh.A.concat([c])).isFn) return wrong('u5l8-keep', '<b>Safe pair:</b> ' + t(pT(c)) + ' gives the input ' + t(nT(c[0])) + ' a second output. Use a brand-new input.');
            return ok();
          };
          return { prompt: '(a) Add <b>one</b> ordered pair so that it is no longer a function, and a <b>different</b> one that leaves it a function.', input: { type: 'fields', fields: fields }, check: check, key: ['(' + brk[0] + ', ' + brk[1] + ')', '(' + keep[0] + ', ' + keep[1] + ')'],
            answer: 'For example breaking ' + t(pT(brk)) + ', safe ' + t(pT(keep)) + ' (answers vary)', solution: 'Breaking pair: reuse an input with a new output, e.g. ' + t(pT(brk)) + ' — the input ' + t(x0) + ' would have outputs ' + t(y0) + ' and ' + t(y0 + 2) + '. Safe pair: a brand-new input, e.g. ' + t(pT(keep)) + ' (or one of the pairs already in the set).',
            hints: ['A pair breaks the function only if its input is already used with a different output.'], text: 'add break/keep', good: [['(' + sh.xs[0] + ', 100)', '(' + sh.A[0][0] + ', ' + sh.A[0][1] + ')']], bad: [['(' + keep[0] + ', ' + keep[1] + ')', '(' + brk[0] + ', ' + brk[1] + ')'], [sh.A.map(function (q) { return '(' + q[0] + ', ' + q[1] + ')'; })[0], '(' + keep[0] + ', 1)']] };
        } },
        { id: 'e12b', sub: 'b', level: 'ADV', make: function (r, sh) {
          return B.valueSet('(b) Which first coordinates could the “breaking” pair use? List them all.', sh.xs, { v: 'x', diag: function (A) { if (A.length < sh.xs.length && A.every(function (a) { return has(sh.xs, a); })) return { code: 'sol-missing', hint: 'Any input already in the set works (with a new output). Are there more?' }; return { code: 'u5l8-pick', hint: 'A breaking pair must reuse an input already in the set; a new first coordinate just adds a new input with one output.' }; } },
            'Exactly the inputs already there: ' + andT(sh.xs) + '. A breaking pair must reuse an existing input with a different output; any other first coordinate is new and brings its own single output.', ['Which inputs are already in the set?'], 'which x break');
        } },
        { id: 'e12c', sub: 'c', level: 'PRG', make: function (r, sh) {
          var ps = sh.C, want = ps.filter(function (p) { return same(p[0], sh.cx); }).map(function (p) { return p[0] + ',' + p[1]; });
          return { prompt: '(c) The set ' + t('\\{' + psT(ps) + '\\}') + ' is not a function. Tap <b>every</b> pair whose removal would make it a function.', input: { type: 'select', options: ps.map(function (p) { return { value: p[0] + ',' + p[1], html: t(pT(p)) }; }) },
            check: K.selectSet(want, function (extra, miss) { return extra.length ? { code: 'u5l8-pick', hint: 'Removing ' + t('(' + extra[0].replace(',', ',\\ ') + ')') + ' leaves the input ' + t(sh.cx) + ' with two outputs.' } : { code: 'sol-missing', hint: 'There is more than one correct removal.' }; }),
            key: want, answer: want.map(function (v) { return t('(' + v.replace(',', ',\\ ') + ')'); }).join(' or '), solution: 'The input ' + t(sh.cx) + ' has two outputs. Removing either of its two pairs fixes that, so there are two correct removals; removing any other pair doesn’t help.', hints: ['Find the input with two outputs.'], text: 'which removals', bad: [ps.map(function (p) { return p[0] + ',' + p[1]; })] };
        } },
        { id: 'e12d', sub: 'd', level: 'PRG', make: function (r, sh) {
          return B.mc(r, '(d) Can <i>adding</i> a pair to the set in (c) turn it into a function?', [{ html: 'No — the input ' + t(sh.cx) + ' still has two outputs no matter what is added. Removing can repair a relation; adding never can.', right: true },
            { html: 'Yes — add a pair with a brand-new input.', code: 'new', why: 'A new input doesn’t remove the conflict at ' + t(sh.cx) + '.' }, { html: 'Yes — add a third pair with input ' + t(sh.cx) + ' to break the tie.', code: 'tie', why: 'That gives ' + t(sh.cx) + ' even more outputs.' },
            { html: 'Yes — adding pairs always makes a relation a function.', code: 'always', why: 'Adding can only add inputs and outputs; it never takes away the conflict.' }],
            'No. The conflict at ' + t('x=' + sh.cx) + ' is still there whatever you add. Removing can repair a relation; adding never can.', HFN, 'adding vs removing');
        } }] },

    /* EP13 both directions */
    { num: '13', stem: function (sh) { return '<b>Both directions.</b> Every ' + sh.who + ' has exactly one ' + sh.id + ', and no two ' + sh.who + 's share one.'; },
      shared: function (r) { return r.pick([{ who: 'student', id: 'student number', many: 'course they are enrolled in' }, { who: 'employee', id: 'employee ID', many: 'project they work on' }, { who: 'patient', id: 'health card number', many: 'doctor they have seen' }, { who: 'athlete', id: 'registration number', many: 'event they enter' }]); },
      parts: [
        { id: 'e13a', sub: 'a–d', level: 'EMG', make: function (r, sh) {
          var rows = [{ id: 'a', html: '(a) ' + sh.who + ' → ' + sh.id }, { id: 'b', html: '(b) ' + sh.id + ' → ' + sh.who }, { id: 'c', html: '(c) ' + sh.who + ' → every ' + sh.many }, { id: 'd1', html: '(d) person → their birthday' }, { id: 'd2', html: '(d) birthday → the people born on it' }];
          return B.grid('For each relation, choose Function or Not a function.', rows, [{ id: 'f', html: 'Function' }, { id: 'n', html: 'Not a function' }], { a: 'f', b: 'f', c: 'n', d1: 'f', d2: 'n' }, { why: function (rw) { return { code: 'u5l8-pick', hint: { a: 'Each ' + sh.who + ' has exactly one ' + sh.id + '.', b: 'No two ' + sh.who + 's share a number, so each number leads back to exactly one ' + sh.who + '.', c: 'One ' + sh.who + ' can have several — one input, several outputs.', d1: 'Each person has one birthday.', d2: 'Many people share a birthday — one input, many outputs.' }[rw] }; } },
            '(a) Function — one ' + sh.id + ' each. (b) Function — numbers aren’t shared, so each leads to one ' + sh.who + '. (c) Not — one ' + sh.who + ', several outputs. (d) person → birthday is a function; birthday → people is not (many people share a date).', HFN, 'both directions');
        } },
        { id: 'e13b', sub: 'e', level: 'PRG', make: function (r, sh) {
          return B.mc(r, '(e) Why do <b>both</b> directions work for ' + sh.id + 's, but not for birthdays?', [{ html: 'The pairing is one-to-one: each ' + sh.who + ' has one number and each number belongs to exactly one ' + sh.who + '. Birthdays are shared.', right: true },
            { html: 'Numbers are always functions; dates never are.', code: 'nums', why: 'It isn’t about numbers versus dates — it is about whether anything is shared.' }, { html: 'Because ' + sh.who + 's are people.', code: 'people', why: 'People appear in the birthday relation too. What matters is sharing.' },
            { html: 'Every relation works in both directions.', code: 'all', why: 'Birthday → people fails. Reversing works only when no output is shared.' }],
            'The ' + sh.id + ' pairing is one-to-one: no number is shared and none is left over, so either direction gives exactly one output per input. Many people share a birthday, so that relation only works in one direction.', HFN, 'one-to-one');
        } }] },

    /* EP14 intercepts */
    { num: '14', stem: '<b>Reasoning about intercepts.</b>', parts: [
      { id: 'e14a', sub: 'a', level: 'PRG', make: function (r) {
        var a = r.int(1, 4), b = r.int(1, 4);
        return B.mc(r, '(a) Can the graph of a function have two ' + t('x') + '-intercepts?', [{ html: 'Yes — e.g. ' + t('\\{(-' + a + ',\\ 0),\\ (' + b + ',\\ 0),\\ (0,\\ 5)\\}') + ': two inputs share the output ' + t('0') + ', which is allowed.', right: true },
          { html: 'No — the output ' + t('0') + ' would be used twice.', code: 'shared-out', why: 'Outputs may repeat. Two ' + t('x') + '-intercepts are two inputs sharing the output ' + t('0') + '.' },
          { html: 'No — a vertical line would cross twice.', code: 'vlt', why: 'The two ' + t('x') + '-intercepts are on different vertical lines (' + t('x=-' + a) + ' and ' + t('x=' + b) + ').' },
          { html: 'Yes — but only if it is a straight line.', code: 'line', why: 'A straight line has at most one ' + t('x') + '-intercept; a parabola like ' + t('y=x^{2}-4') + ' has two.' }],
          'Yes. For example ' + t('\\{(-' + a + ',\\ 0),\\ (' + b + ',\\ 0),\\ (0,\\ 5)\\}') + ', or a parabola like ' + t('y=x^{2}-4') + '. Two inputs share the output ' + t('0') + ', which the rule allows.', HFN, 'two x-ints');
      } },
      { id: 'e14b', sub: 'b', level: 'PRG', make: function (r) {
        return B.mc(r, '(b) Can the graph of a function have two ' + t('y') + '-intercepts?', [{ html: 'No — both would have input ' + t('0') + ', giving it two outputs; and the ' + t('y') + '-axis is a vertical line that would cross the graph twice.', right: true },
          { html: 'Yes — like two ' + t('x') + '-intercepts, it’s just a shared output.', code: 'sym', why: 'Two ' + t('y') + '-intercepts share the <b>input</b> ' + t('0') + ', not an output.' },
          { html: 'Yes — if the graph is curved.', code: 'curved', why: 'Any two points on the ' + t('y') + '-axis lie on one vertical line.' },
          { html: 'No — because a function can’t touch the ' + t('y') + '-axis.', code: 'touch', why: 'Functions can (and usually do) cross the ' + t('y') + '-axis — once.' }],
          'No. A ' + t('y') + '-intercept has ' + t('x=0') + '; two of them would give the single input ' + t('0') + ' two outputs. By the vertical line test: the ' + t('y') + '-axis <i>is</i> a vertical line, so it may meet the graph at most once.', HFN, 'two y-ints');
      } },
      { id: 'e14c', sub: 'c', level: 'ADV', make: function (r) {
        var xa = -r.int(1, 5), xb = r.int(1, 5), y1 = r.int(1, 5), two = r.chance(0.7), y2 = -r.int(1, 5);
        var desc = 'A relation has ' + t('x') + '-intercepts at ' + t(pT([xa, 0])) + ' and ' + t(pT([xb, 0])) + ', and ' + (two ? t('y') + '-intercepts at ' + t(pT([0, y1])) + ' and ' + t(pT([0, y2])) : 'one ' + t('y') + '-intercept, at ' + t(pT([0, y1]))) + '. Can this relation be a function?';
        return B.mc(r, '(c) ' + desc, two ? [{ html: 'No — the two ' + t('y') + '-intercepts give the input ' + t('0') + ' two outputs.', right: true },
          { html: 'No — it has two ' + t('x') + '-intercepts.', code: 'xint', why: 'Two ' + t('x') + '-intercepts are harmless (a shared output). Look at the ' + t('y') + '-intercepts.' },
          { html: 'Yes — intercepts don’t affect whether it is a function.', code: 'no-effect', why: t(pT([0, y1])) + ' and ' + t(pT([0, y2])) + ' share the input ' + t('0') + '.' },
          { html: 'Yes — it has the same number of ' + t('x') + '- and ' + t('y') + '-intercepts.', code: 'count', why: 'Counting doesn’t decide. Two ' + t('y') + '-intercepts mean one input with two outputs.' }]
          : [{ html: 'Yes, it can — two ' + t('x') + '-intercepts are just two inputs sharing the output ' + t('0') + ', and there is only one ' + t('y') + '-intercept.', right: true },
            { html: 'No — it has two ' + t('x') + '-intercepts.', code: 'xint', why: 'Two inputs may share the output ' + t('0') + '.' },
            { html: 'No — it has more ' + t('x') + '-intercepts than ' + t('y') + '-intercepts.', code: 'count', why: 'The numbers of intercepts don’t have to match.' },
            { html: 'Yes — every relation with intercepts is a function.', code: 'all', why: 'A relation with two ' + t('y') + '-intercepts can’t be a function. The reason here is that there is only one.' }],
          two ? 'No. The two ' + t('x') + '-intercepts are harmless, but ' + t(pT([0, y1])) + ' and ' + t(pT([0, y2])) + ' give the input ' + t('0') + ' two different outputs — that alone decides it.' : 'Yes, it can be. The two ' + t('x') + '-intercepts share the output ' + t('0') + ' (allowed), and the single ' + t('y') + '-intercept gives the input ' + t('0') + ' one output.', HFN, 'intercepts decide');
      } }] },

    /* EP15 true / false */
    { num: '15', stem: 'State whether each statement is <b>true</b> or <b>false</b>.', parts: [
      { id: 'e15a', sub: 'a', level: 'BEG', make: function (r) { var ys = r.int(1, 9), xs = r.sample(range(-5, 9), 2); return B.tf(r, '(a) If two different inputs give the same output, such as ' + t(pT([xs[0], ys])) + ' and ' + t(pT([xs[1], ys])) + ', the relation is not a function.', false, 'Different inputs may share an output.', '<b>False</b> — different inputs are allowed to share an output.', HFN, 'tf shared output'); } },
      { id: 'e15b', sub: 'b', level: 'BEG', make: function (r) { var c = r.pick(nz(-6, 6)); return B.tf(r, '(b) The horizontal line ' + t('y=' + c) + ' is a function, but the vertical line ' + t('x=' + c) + ' is not.', true, 'Apply the vertical line test to each.', '<b>True</b>.', HVLT, 'tf h vs v'); } },
      { id: 'e15c', sub: 'c', level: 'LIM', make: function (r) { return B.tf(r, '(c) Every function is a relation, and every relation is a function.', false, 'A relation like ' + t('\\{(1,\\ 2),\\ (1,\\ 3)\\}') + ' is not a function.', '<b>False</b> — every function is a relation, but not every relation is a function.', HFN, 'tf relation/function'); } },
      { id: 'e15d', sub: 'd', level: 'EMG', make: function (r) { return B.tf(r, '(d) A graph made of separate, disconnected pieces cannot be a function.', false, 'Pieces over different ' + t('x') + '-values never meet the same vertical line.', '<b>False</b> — separate pieces are fine as long as no ' + t('x') + '-value is used twice.', HVLT, 'tf pieces'); } },
      { id: 'e15e', sub: 'e', level: 'EMG', make: function (r) { var c = r.int(5, 9); return B.tf(r, '(e) If the vertical line ' + t('x=' + c) + ' misses the graph completely, the relation is not a function.', false, 'Missing the graph means ' + t(c) + ' isn’t an input. The test only fails when a vertical line crosses more than once.', '<b>False</b> — a miss just means that input has no output.', HVLT, 'tf miss'); } },
      { id: 'e15f', sub: 'f', level: 'EMG', make: function (r) { var p = [r.int(-5, 9), r.int(-5, 9)]; return B.tf(r, '(f) Listing the same ordered pair twice, like ' + t(pT(p)) + ' and ' + t(pT(p)) + ', can turn a function into a non-function.', false, 'A repeated identical pair adds nothing new.', '<b>False</b> — the input ' + t(p[0]) + ' still has exactly one output.', HFN, 'tf dup pair'); } }] },

    /* EP16 stretch */
    { num: '16', stem: function (sh) { return '<b>Stretch.</b> Consider the relation ' + t('\\{' + pT(sh.p1) + ',\\ ' + pT(sh.p2) + ',\\ (k,\\ ' + sh.e + ')\\}') + ', where ' + t('k') + ' is a number you choose.'; },
      shared: function (r) { if (r.chance(0.12)) return { p1: [1, 2], p2: [3, 4], e: 5 }; var xs = r.sample(range(-3, 9), 2).sort(num), ys = r.sample(range(1, 9), 3); return { p1: [xs[0], ys[0]], p2: [xs[1], ys[1]], e: ys[2] }; },
      parts: [
        { id: 'e16a', sub: 'a', level: 'BEG', make: function (r, sh) {
          var k = sh.p1[0], ps = [sh.p1, sh.p2, [k, sh.e]];
          return fnPick(r, '(a) Test ' + t('k=' + k) + ': the pairs are ' + psH(ps) + '. Is the relation a function?', false, 'The input ' + t(k) + ' now has two outputs, ' + t(sh.p1[1]) + ' and ' + t(sh.e) + '.', null, 'With ' + t('k=' + k) + ': ' + psH(ps) + ' — the input ' + t(k) + ' has outputs ' + t(sh.p1[1]) + ' and ' + t(sh.e) + '. <b>Not a function.</b>', HFN, 'k test 1');
        } },
        { id: 'e16b', sub: 'b', level: 'EMG', make: function (r, sh) {
          var k2 = sh.p2[0], k3 = sh.e !== sh.p1[0] && sh.e !== sh.p2[0] ? sh.e : Math.max(sh.p1[0], sh.p2[0]) + 2;
          var rows = [{ id: 'a', html: t('k=' + k2) }, { id: 'b', html: t('k=' + k3) }];
          return B.grid('(b) Test the two values of ' + t('k') + ' below.', rows, [{ id: 'f', html: 'Function' }, { id: 'n', html: 'Not a function' }], { a: 'n', b: 'f' }, { why: function (rw) { return { code: 'u5l8-k', hint: rw === 'a' ? 'With ' + t('k=' + k2) + ' the input ' + t(k2) + ' gets outputs ' + t(sh.p2[1]) + ' and ' + t(sh.e) + '.' : 'With ' + t('k=' + k3) + ' the input is new, so every input still has one output.' }; } },
            t('k=' + k2) + ': ' + psH([sh.p1, sh.p2, [k2, sh.e]]) + ' — the input ' + t(k2) + ' has two outputs: <b>not a function</b>. ' + t('k=' + k3) + ': ' + psH([sh.p1, sh.p2, [k3, sh.e]]) + ' — all inputs different: <b>function</b>.', HFN, 'k tests 2');
        } },
        { id: 'e16c', sub: 'c', level: 'ADV', make: function (r, sh) {
          return B.valueSet('(c) The relation is a function for every value of ' + t('k') + ' <b>except</b> a few. List the values of ' + t('k') + ' that make it <b>not</b> a function.', [sh.p1[0], sh.p2[0]], { v: 'k', diag: function (A) { if (A.length === 1) return { code: 'sol-missing', hint: 'Either existing input would clash with the new output ' + t(sh.e) + '.' }; return { code: 'u5l8-k', hint: 'Only an input that is already used — with a different output — can break the rule.' }; } },
            'The new pair ' + t('(k,\\ ' + sh.e + ')') + ' clashes only if ' + t('k') + ' is an input already used with a different output: ' + t('k=' + sh.p1[0]) + ' or ' + t('k=' + sh.p2[0]) + '. For every other ' + t('k') + ' it is a function (' + t('k\\ne ' + sh.p1[0]) + ' and ' + t('k\\ne ' + sh.p2[0]) + ').', ['Which inputs are already used?'], 'k values');
        } },
        { id: 'e16d', sub: 'd', level: 'MAS', make: function (r, sh) {
          var d = sh.p2[1];
          return B.valueSet('(d) Now consider ' + t('\\{' + pT(sh.p1) + ',\\ ' + pT(sh.p2) + ',\\ (k,\\ ' + d + ')\\}') + ' (the last output is now ' + t(d) + '). List the values of ' + t('k') + ' that make it <b>not</b> a function.', [sh.p1[0]], { v: 'k', diag: function (A) { if (has(A, sh.p2[0])) return { code: 'u5l8-k-dup', hint: 'Check ' + t('k=' + sh.p2[0]) + ': the new pair is ' + t(pT([sh.p2[0], d])) + ', the <b>same</b> pair as one already there. A repeated identical pair doesn’t break the rule.' }; return { code: 'u5l8-k', hint: 'Test each input already used: does the new pair give it a <b>different</b> output?' }; } },
            'Only ' + t('k=' + sh.p1[0]) + ': then the input ' + t(sh.p1[0]) + ' has outputs ' + t(sh.p1[1]) + ' and ' + t(d) + '. With ' + t('k=' + sh.p2[0]) + ' the new pair is ' + t(pT([sh.p2[0], d])) + ' — the <b>same</b> pair listed twice, which is harmless. So changing the output <b>did</b> change the answer: a repeated input breaks the rule only with a different output.',
            ['Test ' + t('k=' + sh.p1[0]) + ' and ' + t('k=' + sh.p2[0]) + ' separately.', 'Is ' + t(pT([sh.p2[0], d])) + ' a new pair, or one you already have?'], 'k values dup');
        } },
        { id: 'e16e', sub: 'e', level: 'PRG', make: function (r, sh) {
          return B.mc(r, '(e) Why can no choice of ' + t('k') + ' make the original set ' + t('\\{' + pT(sh.p1) + ',\\ ' + pT(sh.p2) + ',\\ (k,\\ ' + sh.e + ')\\}') + ' contain the same ordered pair twice?', [{ html: 'A repeated pair needs the same output too, and ' + t(sh.e) + ' differs from ' + t(sh.p1[1]) + ' and ' + t(sh.p2[1]) + '.', right: true },
            { html: 'Because ' + t('k') + ' can’t equal ' + t(sh.p1[0]) + ' or ' + t(sh.p2[0]) + '.', code: 'k', why: t('k') + ' can be any number. Even with ' + t('k=' + sh.p1[0]) + ' the pair is ' + t(pT([sh.p1[0], sh.e])) + ', not ' + t(pT(sh.p1)) + '.' },
            { html: 'Because sets never repeat pairs.', code: 'sets', why: 'The question is whether the pair <i>would</i> match one already there — compare the outputs.' },
            { html: 'It can: choose ' + t('k=' + sh.e) + '.', code: 'ke', why: 'Then the pair is ' + t(pT([sh.e, sh.e])) + ', which doesn’t match ' + t(pT(sh.p1)) + ' or ' + t(pT(sh.p2)) + '.' }],
            'A repeated pair would need the same first <b>and</b> second coordinates. The third pair has output ' + t(sh.e) + ', while the others have ' + t(sh.p1[1]) + ' and ' + t(sh.p2[1]) + ', so it can never match either one, whatever ' + t('k') + ' is.', HFN, 'k no dup');
        } }] }
  ];

  HW.defineLesson({
    id: 'u5l8', unit: 5, num: '8', title: 'Introducing Functions: The Vertical Line Test', outcome: 'RF2',
    blurb: 'A function pairs every input with exactly one output: test arrow diagrams, ordered pairs, tables, words and graphs (the vertical line test).',
    questions: QUESTIONS, extra: EXTRA
  });
})(window);
