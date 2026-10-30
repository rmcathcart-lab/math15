/* Math 15 · Unit 6 · Lesson 2 — Measuring the Length of a Line Segment (RF3 on every part)
 * Assignment 2 (u6_L02.tex, Questions 1–13) and the Lesson 2 Extra Practice (u6_EP02.tex, Questions 1–19).
 * Horizontal and vertical segments only: length = |x₂ − x₁| or |y₂ − y₁|. Every part is a generator with the booklet's
 * structure and difficulty (the booklet's own points are among the possible versions).
 * Model: Math 10C u6l1.js (hvLen, the variable-length parts, plot-and-join on the graph pad, ordered-pair answers,
 * "both possible endpoints" sets) and Math 15 u5l1.js (lettered grids, perimeter/area diagnoses).
 * Conversions: "horizontal or vertical?" -> a table of choices; "explain / identify the error" -> multiple choice whose
 * options are reasons; "use an example of your own" -> boxes for a generated example, or any valid example the student
 * types (Extra 16); "plot the vertices" -> the graph pad (╱ Line); "list in order" -> tap to order.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 19(d) (counting every rectangle that fits the conditions). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ---------- keypad: one ordered pair ---------- */
  var PTK = 'u6l2pt', Wd = HW.widgets;
  if (Wd && Wd.KEYSETS) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, left: { label: '◀', fn: 'left', title: 'Move left' },
      right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' }, enter: { label: 'Check ↵', fn: 'enter', wide: true }, minus: { label: '−', tex: '-', plain: '-' },
      dot: { label: '.', tex: '.', plain: '.' }, par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Ordered pair: type x, y inside' }, comma: { label: ',', tex: ',', plain: ', ' } };
    if (!Wd.KEYSETS[PTK]) Wd.KEYSETS[PTK] = [[dk(7), dk(8), dk(9), KY.par, KY.del], [dk(4), dk(5), dk(6), KY.minus, KY.clear], [dk(1), dk(2), dk(3), KY.comma, KY.left, KY.right], [dk(0), KY.dot, KY.enter]];
    if (Wd.KEYHELP && !Wd.KEYHELP[PTK]) Wd.KEYHELP[PTK] = ['Press <b>( )</b>, type the two coordinates with <b>,</b> between them, then <b>▶</b> to step out.', 'Type a point as <code>(3, -2)</code>.'];
  }

  HW.addCodes({
    'neg-length': 'Gave a negative length', 'same-coord': 'Subtracted the coordinates that are equal', 'neg-sub': 'Subtracting a negative (should add)', added: 'Added coordinates instead of subtracting',
    count: 'Run/rise off by one (counted lines, not spaces)', 'abs-bars': 'Left absolute-value bars that aren’t needed', 'no-half': 'Forgot the ½ in the triangle area', 'pt-form': 'Point not written as (x, y)',
    'pt-x': 'Wrong x-coordinate', 'pt-y': 'Wrong y-coordinate', pt: 'Wrong point', 'pairs-flip': 'Ordered pairs backwards', 'one-sol': 'Found only one of the two answers', 'shift-sign': 'Moved the wrong way from the known coordinate',
    'perim-side': 'Left a side out of the perimeter', row: 'A row of the table wrong', order: 'Two items in the wrong order',
    'u6l2-half-perim': 'Added only two sides for the perimeter', 'u6l2-area-perim': 'Gave the area for the perimeter (or reverse)', 'u6l2-gave-length': 'Gave the length instead of the coordinate',
    'u6l2-wrong-dir': 'Ignored the condition (picked the other direction)', 'u6l2-diag-wall': 'Used the straight-line (diagonal) distance', 'u6l2-extra-side': 'Added sides that aren’t part of the figure',
    'u6l2-diff-wrong': 'Wrong difference between the lengths', 'u6l2-other-coord': 'Changed the coordinate that should stay the same', 'u6l2-not-neg': 'Example doesn’t have negative x-coordinates',
    'u6l2-not-hv': 'Example segment isn’t horizontal or vertical', 'u6l2-km': 'Didn’t convert metres to kilometres', 'u6l2-one-lap': 'Counted one lap only', 'u6l2-cost': 'Cost not multiplied by the whole perimeter',
    'u6l2-pairs-count': 'Counted unordered pairs (w, h) instead of ordered ones', 'u6l2-rect-count': 'Left the four corner positions out of the count', 'u6l2-rect-side': 'Rectangle on the wrong side or wrong height',
    'u6l2-notch': 'Left the notch out of the perimeter', 'u6l2-open': 'Figure not closed (last vertex not joined back to the first)', 'u6l2-sum-wh': 'Gave the perimeter instead of w + h'
  });
  HW.addPartial({ 'u6l2-half-perim': 'b', 'u6l2-area-perim': 'n', 'u6l2-gave-length': 'b', 'u6l2-wrong-dir': 's', 'u6l2-diag-wall': 'n', 'u6l2-extra-side': 'b', 'u6l2-diff-wrong': 'n',
    'u6l2-other-coord': 'n', 'u6l2-not-neg': 'n', 'u6l2-not-hv': 'n', 'u6l2-km': 's', 'u6l2-one-lap': 'b', 'u6l2-cost': 'b', 'u6l2-pairs-count': 'b', 'u6l2-rect-count': 'b',
    'u6l2-rect-side': 'b', 'u6l2-notch': 'b', 'u6l2-sum-wh': 'b', 'u6l2-open': 's' });

  /* ---------- helpers ---------- */
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 1e-7 : e); }
  function P2(p) { return '(' + F(p[0]) + ',\\ ' + F(p[1]) + ')'; }
  function pt(p) { return '(' + p[0] + ', ' + p[1] + ')'; }
  function pr(v) { return v < 0 ? '(' + F(v) + ')' : F(v); }
  function sub(a, b) { return F(a) + '-' + pr(b); }
  function lin(v, k) { return k === 0 ? v : v + (k > 0 ? '+' + k : '-' + (-k)); }
  function sgn(r) { return r.chance(0.5) ? 1 : -1; }
  function mcP(r, prompt, opts, sol, hints, text, keepOrder) { return KP.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  function numPart(prompt, ans, diag, sol, hints, text, after, bad) {
    var p = KP.number(prompt, ans, diag, sol, hints, text, after ? { after: after } : null);
    if (after) p.answer = t(F(ans)) + ' ' + after;
    p.bad = (bad || []).filter(function (b) { return Number(b) !== ans; }).map(String);
    return p;
  }
  function numField(label, name, after) { return { label: label, name: name, after: after }; }
  function ptField(name) { return { label: t(name) + ':', name: name, mode: 'math', keys: PTK, placeholder: 'e.g. (3, -2)' }; }

  /* ---------- one point "(x, y)" (from 10C u6l1) ---------- */
  function splitPt(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\[,;:! ]/g, ' ').replace(/\\lbrace|\\rbrace|\\\{|\\\}/g, '').trim();
    if (s.charAt(0) === '{' && s.charAt(s.length - 1) === '}') s = s.slice(1, -1).trim();
    s = s.replace(/^[A-Za-z]'?\s*=?\s*(?=\()/, '');
    if (!s) return { empty: true };
    var m = /^\((.*)\)$/.exec(s); if (!m) return { bad: true };
    var body = m[1], depth = 0, cut = -1;
    for (var i = 0; i < body.length; i++) { var c = body[i]; if (c === '{' || c === '(' || c === '[') depth++; else if (c === '}' || c === ')' || c === ']') depth--; else if (c === ',' && depth === 0) { if (cut >= 0) return { bad: true }; cut = i; } }
    if (cut < 0) return { bad: true };
    return { x: body.slice(0, cut).trim(), y: body.slice(cut + 1).trim() };
  }
  function valOf(s) { var p = ex.parse(s); return p.ok ? ex.value(p.ast) : NaN; }
  function ptChk(T, opt) {
    opt = opt || {};
    return function (resp) {
      var S = splitPt(resp);
      if (S.empty) return form('empty', 'Type the point first.');
      if (S.bad || !S.x || !S.y) return form('pt-form', 'Write one ordered pair in brackets, ' + t('(x,\\ y)') + ': press <b>( )</b> and type the two coordinates with a comma between them.');
      var vx = valOf(S.x), vy = valOf(S.y);
      if (!isFinite(vx) || !isFinite(vy)) return form('pt-form', 'Use numbers for both coordinates, e.g. ' + t('(3,\\ -2)') + '.');
      if (near(vx, T[0], 1e-9) && near(vy, T[1], 1e-9)) return ok();
      if (opt.diag) { var h = opt.diag([vx, vy]); if (h) return wrong(h.code || 'pt', h.hint); }
      if (near(vx, T[1]) && near(vy, T[0]) && !near(T[0], T[1])) return wrong('pairs-flip', 'You swapped the coordinates: an ordered pair is ' + t('(x,\\ y)') + ' — the across value first, then the up/down value.');
      if (near(vx, T[0])) return wrong('pt-y', 'Your ' + t('x') + '-coordinate is right — check the ' + t('y') + '-coordinate.');
      if (near(vy, T[1])) return wrong('pt-x', 'Your ' + t('y') + '-coordinate is right — check the ' + t('x') + '-coordinate.');
      return wrong('pt', null);
    };
  }
  /* a set of points in any order, with extra diagnoses for whole wrong sets (from 10C u6l1) */
  function pairsChk(target, alts) {
    var base = K.pairs(target);
    return function (resp) {
      var r = base(resp); if (r.v !== 'wrong') return r;
      for (var i = 0; i < (alts || []).length; i++) if (K.pairs(alts[i].is)(resp).v === 'correct') return wrong(alts[i].code, alts[i].hint);
      return r;
    };
  }
  function setTex(ps) { return '\\{' + ps.map(function (q) { return '(' + q[0] + ', ' + q[1] + ')'; }).join(', ') + '\\}'; }
  function pairsPart(prompt, target, alts, sol, hints, text) {
    alts = (alts || []).filter(function (a) { return K.pairs(target)(setTex(a.is)).v !== 'correct'; });
    var p = KP.pairs(prompt, target, {}, sol, hints, text); p.check = pairsChk(target, alts);
    p.answer = target.map(function (q) { return t(P2(q)); }).join(' and ');
    p.bad = alts.map(function (a) { return setTex(a.is); }).concat(['(' + target[0][0] + ', ' + target[0][1] + ')']);
    p.good = [target.slice().reverse().map(function (q) { return '(' + q[0] + ', ' + q[1] + ')'; }).join(', ')];
    return p;
  }

  /* ---------- figures ---------- */
  /* a grid whose point letters are placed where they touch nothing (from u5l1 labelledGraph) */
  function labelledGraph(spec, pts) {
    spec.points = (spec.points || []).concat(pts.map(function (p) { return { x: p.x, y: p.y }; }));
    var svg = HW.graph(spec), L = HW.graph.last, X = L.X, Y = L.Y, obs = [], out = '';
    var hit = function (a, b) { return a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]; };
    var x0 = Math.max(L.xr[0], Math.min(L.xr[1], 0)), y0 = Math.max(L.yr[0], Math.min(L.yr[1], 0)), lx = spec.labelsX || spec.labels || 2, ly = spec.labelsY || spec.labels || 2;
    pts.forEach(function (p) { obs.push([X(p.x) - 5, Y(p.y) - 5, X(p.x) + 5, Y(p.y) + 5]); });
    (spec.segs || []).forEach(function (sg) { for (var i = 0; i + 1 < sg.pts.length; i++) { var a = sg.pts[i], b = sg.pts[i + 1]; obs.push([Math.min(X(a[0]), X(b[0])) - 2, Math.min(Y(a[1]), Y(b[1])) - 2, Math.max(X(a[0]), X(b[0])) + 2, Math.max(Y(a[1]), Y(b[1])) + 2]); } });
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
  /* segments [[A, B], …] with lettered endpoints on a grid */
  function segFig(win, segs, names, max) {
    var pts = []; segs.forEach(function (s, i) { pts.push({ x: s[0][0], y: s[0][1], label: names[i][0] }, { x: s[1][0], y: s[1][1], label: names[i][1] }); });
    return '<div class="fig">' + labelledGraph({ x: win.x, y: win.y, labels: 2, max: max || 300, segs: segs.map(function (s) { return { pts: s, start: 'none', end: 'none' }; }) }, pts) + '</div>';
  }
  function polyFig(V, win, max) {
    return '<div class="fig">' + HW.graph({ x: win.x, y: win.y, labels: 2, max: max || 300, segs: [{ pts: V.concat([V[0]]), start: 'none', end: 'none' }], points: V.map(function (p) { return { x: p[0], y: p[1] }; }) }) + '</div>';
  }
  /* plot the vertices and join them in order (10C polyPart) */
  function polyPart(prompt, Vs, win, names, text) {
    var inp = { x: win.x, y: win.y, labels: 2, mode: 'lines', defaultEnd: 'closed' }, key = { pts: [], pieces: [{ v: Vs.concat([Vs[0]]), s: 'closed', e: 'closed' }] };
    var swp = { pts: [], pieces: [{ v: Vs.concat([Vs[0]]).map(function (p) { return [p[1], p[0]]; }), s: 'closed', e: 'closed' }] };
    var open = { pts: [], pieces: [{ v: Vs.slice(), s: 'closed', e: 'closed' }] };
    var chk = K.graphExact(key, { wrong: [{ is: open, code: 'u6l2-open', hint: 'Close the shape: join the last vertex back to ' + t(names[0]) + '.' }] });
    var p = KP.graph(prompt, inp, chk, key, 'Plot ' + Vs.map(function (v, i) { return t(names[i] + P2(v)); }).join(', ') + ' (across to ' + t('x') + ', then up or down to ' + t('y') + '), then join them in order and back to ' + t(names[0]) + '.',
      ['Plot each vertex: start at the origin, go across to the ' + t('x') + '-coordinate, then up or down to the ' + t('y') + '-coordinate.', 'Join the vertices in order with the line tool, and close the shape.'], text);
    p.bad = [swp, open].filter(function (b) { return !HW.draw.same(b, key); });
    return p;
  }

  /* ---------- length of a horizontal or vertical segment (10C hvLen) ---------- */
  function hvDiag(A, B) {
    var hor = A[1] === B[1], i = hor ? 0 : 1, c = hor ? 'x' : 'y', o = hor ? 'y' : 'x', L = Math.abs(B[i] - A[i]);
    var hi = Math.max(A[i], B[i]), lo = Math.min(A[i], B[i]), axis = hor ? t('y') : t('x');
    return function (v) {
      if (near(v, -L)) return { code: 'neg-length', hint: 'A length can’t be negative. Take the <b>positive</b> difference, ' + t('|' + c + '_2-' + c + '_1|') + '.' };
      if (near(v, 0) || near(v, Math.abs(A[1 - i]))) return { code: 'same-coord', hint: 'Both endpoints have ' + t(o + '=' + F(A[1 - i])) + ' — that’s what makes the segment ' + (hor ? 'horizontal' : 'vertical') + '. Subtract the coordinates that <b>change</b>.' };
      if (lo < 0 && hi > 0 && near(v, Math.abs(hi + lo))) return { code: 'neg-sub', hint: 'The endpoints are on opposite sides of the ' + axis + '-axis. Subtracting a negative <b>adds</b>: ' + t(F(hi) + '-' + pr(lo) + '=' + F(hi) + '+' + F(-lo)) + '.' };
      if (((lo > 0 && hi > 0) || (lo < 0 && hi < 0)) && near(v, Math.abs(hi) + Math.abs(lo))) return { code: 'added', hint: 'Both endpoints are on the same side of the ' + axis + '-axis, so the distance between them is a <b>difference</b> of the coordinates, not a sum.' };
      if (Number.isInteger(L) && (near(v, L + 1) || near(v, L - 1))) return { code: 'count', hint: 'You’re off by one. The length is the number of <b>spaces</b> between the endpoints: ' + t('|' + c + '_2-' + c + '_1|') + '.' };
      return null;
    };
  }
  function hvSol(A, B, la, lb) {
    var hor = A[1] === B[1], i = hor ? 0 : 1, o = hor ? 'y' : 'x', L = Math.abs(B[i] - A[i]);
    return 'Both endpoints have the same ' + t(o) + '-coordinate, ' + t(F(A[1 - i])) + ', so the segment is <b>' + (hor ? 'horizontal' : 'vertical') + '</b>.<br>Length ' + t('=|' + sub(B[i], A[i]) + '|=|' + F(B[i] - A[i]) + '|=' + F(L)) + ' units.';
  }
  function hvLen(la, A, lb, B) {
    var hor = A[1] === B[1], i = hor ? 0 : 1, L = Math.abs(B[i] - A[i]);
    var p = KP.number(t(la + P2(A)) + ' to ' + t(lb + P2(B)), L, hvDiag(A, B), hvSol(A, B, la, lb),
      ['Which coordinate is the same for both endpoints? Subtract the <b>other</b> coordinates.', 'A length is never negative: take the positive difference.'], 'length ' + la + lb + ' ' + P2(A) + ' ' + P2(B), { after: 'units' });
    p.answer = t(F(L)) + ' units';
    p.bad = [String(-L), String(L + 1)];
    return p;
  }
  function lenOf(A, B) { return A[1] === B[1] ? Math.abs(B[0] - A[0]) : Math.abs(B[1] - A[1]); }
  function lenTex(nm, A, B) { var i = A[1] === B[1] ? 0 : 1; return t(nm + '=|' + sub(B[i], A[i]) + '|=' + lenOf(A, B)); }

  /* ---------- Q4 / Extra 5: segments written with variables (10C q3Shared, letters as in the booklet) ---------- */
  function varShared(r, letters, names) {
    var L1 = r.pick(letters[0]), L2 = r.pick(letters[1]), L3 = r.pick(letters[2]), L4 = r.pick(letters[3]);
    var segs = {};
    var a = { hor: r.chance(0.6), v: L1, k: r.int(2, 15), rev: r.chance(0.3) };
    a.P = a.hor ? [names[0] + '(' + a.v[0] + ',\\,' + a.v[1] + ')', names[1] + '(' + lin(a.v[0], a.rev ? -a.k : a.k) + ',\\,' + a.v[1] + ')'] : [names[0] + '(' + a.v[0] + ',\\,' + a.v[1] + ')', names[1] + '(' + a.v[0] + ',\\,' + lin(a.v[1], a.rev ? -a.k : a.k) + ')'];
    a.L = a.k; segs.a = a;
    var b = { hor: r.chance(0.4), v: L2, s: r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), b: r.int(1, 9), c: r.int(2, 12), flip: r.chance(0.5) };
    var b1 = lin(b.v[b.hor ? 0 : 1], b.flip ? b.c : -b.b), b2 = lin(b.v[b.hor ? 0 : 1], b.flip ? -b.b : b.c), bs = lin(b.v[b.hor ? 1 : 0], b.s);
    b.P = b.hor ? [names[2] + '(' + b1 + ',\\,' + bs + ')', names[3] + '(' + b2 + ',\\,' + bs + ')'] : [names[2] + '(' + bs + ',\\,' + b1 + ')', names[3] + '(' + bs + ',\\,' + b2 + ')'];
    b.e1 = b1; b.e2 = b2; b.L = b.b + b.c; segs.b = b;
    var c = { hor: r.chance(0.6), v: L3, gt: r.chance(0.6) };
    c.P = c.hor ? [names[4] + '(' + c.v[0] + ',\\,' + c.v[1] + ')', names[5] + '(' + c.v[2] + ',\\,' + c.v[1] + ')'] : [names[4] + '(' + c.v[1] + ',\\,' + c.v[0] + ')', names[5] + '(' + c.v[1] + ',\\,' + c.v[2] + ')'];
    c.ch = c.v[0]; c.cond = c.gt ? c.v[0] + '>' + c.v[2] : c.v[0] + '<' + c.v[2]; c.big = c.gt ? c.v[0] : c.v[2]; c.small = c.gt ? c.v[2] : c.v[0]; segs.c = c;
    var d = { hor: r.chance(0.4), v: L4, gt: r.chance(0.4) };
    d.P = d.hor ? [names[6] + '(' + d.v[1] + ',\\,' + d.v[0] + ')', names[7] + '(' + d.v[2] + ',\\,' + d.v[0] + ')'] : [names[6] + '(' + d.v[0] + ',\\,' + d.v[1] + ')', names[7] + '(' + d.v[0] + ',\\,' + d.v[2] + ')'];
    d.ch = d.v[1]; d.cond = d.gt ? d.v[1] + '>' + d.v[2] : d.v[2] + '>' + d.v[1]; d.big = d.gt ? d.v[1] : d.v[2]; d.small = d.gt ? d.v[2] : d.v[1]; segs.d = d;
    return segs;
  }
  function segTex(s) { return t(s.P[0]) + ' to ' + t(s.P[1]) + (s.cond ? ', where ' + t(s.cond) : ''); }
  function varLenPart(s) {
    var target = s.big + '-' + s.small, neg = s.small + '-' + s.big, c = s.hor ? 'x' : 'y', o = s.hor ? 'y' : 'x';
    var base = K.poly(target, { wrong: [{ is: neg, code: 'neg-length', hint: 'Since ' + t(s.cond) + ', ' + t(neg) + ' is <b>negative</b> — and a length can’t be negative. Subtract the other way.' }],
      diag: function (S) { if (HW.poly.isZero(S)) return { code: 'same-coord', hint: 'You subtracted the coordinates that are the same. Subtract the ' + t(c) + '-coordinates, the ones that change.' }; return null; } });
    var negChk = K.poly(neg);
    var chk = function (resp) {
      var s0 = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').trim();
      var m = /^(?:\||\\vert|\\lvert|\\mid)\s*(.*?)\s*(?:\||\\vert|\\rvert|\\mid)$/.exec(s0);
      if (m && (base(m[1]).v === 'correct' || negChk(m[1]).v === 'correct')) return form('abs-bars', 'Right — and because ' + t(s.cond) + ', you know the sign of the difference. Write the length <b>without</b> the absolute-value bars.');
      return base(resp);
    };
    var vs = s.v.slice().sort();
    return { prompt: (s.hor ? 'Horizontal' : 'Vertical') + ' segment from ' + segTex(s) + '. Write an expression for its length.', input: { type: 'math', keys: 'poly', vars: vs, placeholder: 'e.g. a - c' }, check: chk, key: target, answer: t(target),
      solution: 'Both endpoints have the same ' + t(o) + '-coordinate, so the segment is ' + (s.hor ? 'horizontal' : 'vertical') + ' and its length is the difference of the ' + t(c) + '-coordinates.<br>Since ' + t(s.cond) + ', the difference ' + t(target) + ' is already positive, so the length is ' + t(target) + '.',
      hints: ['Subtract the coordinates that change. Which one is larger? The condition ' + t(s.cond) + ' tells you.', 'Larger minus smaller is positive — no bars needed.'], text: 'expression for length', bad: [neg, '0'], good: [s.big + '-' + s.small, '-' + s.small + '+' + s.big] };
  }
  function varQuestion(num, section, stemTxt, letters, names, ids, levels) {
    return { num: num, section: section, stem: stemTxt, shared: function (r) { return varShared(r, letters, names); }, parts: [
      { id: ids[0], sub: 'a–d', level: levels[0], make: function (r, sh) {
        var rows = ['a', 'b', 'c', 'd'].map(function (k) { return { id: k, html: '(' + k + ') ' + t(sh[k].P[0]) + ' to ' + t(sh[k].P[1]) }; }), want = {};
        ['a', 'b', 'c', 'd'].forEach(function (k) { want[k] = sh[k].hor ? 'h' : 'v'; });
        return KP.grid('Is each segment horizontal or vertical?', rows, [{ id: 'h', html: 'Horizontal' }, { id: 'v', html: 'Vertical' }], want, { tries: 2, why: function () { return { code: 'row', hint: 'Look for the coordinate that is the same in both endpoints. Same ' + t('y') + ' (second coordinate) → horizontal; same ' + t('x') + ' (first coordinate) → vertical.' }; } },
          ['a', 'b', 'c', 'd'].map(function (k) { return '(' + k + ') The ' + (sh[k].hor ? 'second' : 'first') + ' coordinates match, so it is <b>' + (sh[k].hor ? 'horizontal' : 'vertical') + '</b>.'; }).join('<br>'),
          ['A horizontal segment keeps the same ' + t('y') + '-coordinate; a vertical one keeps the same ' + t('x') + '-coordinate.'], 'horizontal or vertical (variables)');
      } },
      { id: ids[1], sub: 'a', level: levels[1], make: function (r, sh) {
        var s = sh.a, c = s.hor ? 'x' : 'y', v = s.v[s.hor ? 0 : 1];
        var p = KP.number('Length of the ' + (s.hor ? 'horizontal' : 'vertical') + ' segment from ' + segTex(s) + ':', s.L, function (x) { if (x === -s.L) return { code: 'neg-length', hint: 'A length can’t be negative — take the positive difference.' }; if (x === 0) return { code: 'same-coord', hint: 'You subtracted the coordinates that are the same. Subtract the ' + t(c) + '-coordinates.' }; return null; },
          'The ' + t(c) + '-coordinates are ' + t(v) + ' and ' + t(lin(v, s.rev ? -s.k : s.k)) + '. Length ' + t('=|' + lin(v, s.rev ? -s.k : s.k) + '-' + v + '|=|' + (s.rev ? -s.k : s.k) + '|=' + s.L) + ' units.',
          ['Subtract the coordinates that change. The letter cancels out.'], 'variable length (a)', { after: 'units' });
        p.bad = [String(-s.L)]; return p;
      } },
      { id: ids[2], sub: 'b', level: levels[2], make: function (r, sh) {
        var s = sh.b, c = s.hor ? 'x' : 'y';
        var p = KP.number('Length of the ' + (s.hor ? 'horizontal' : 'vertical') + ' segment from ' + segTex(s) + ':', s.L, function (x) {
          if (x === -s.L) return { code: 'neg-length', hint: 'A length can’t be negative — take the positive difference.' };
          if (x === Math.abs(s.c - s.b)) return { code: 'neg-sub', hint: 'Watch the sign: ' + t('(' + s.e1 + ')-(' + s.e2 + ')') + '. Subtracting a negative adds.' };
          if (x === 0 || x === Math.abs(s.s)) return { code: 'same-coord', hint: 'Subtract the ' + t(c) + '-coordinates — the ones that change.' };
          return null;
        }, 'The ' + t(c) + '-coordinates are ' + t(s.e1) + ' and ' + t(s.e2) + '.<br>Length ' + t('=|(' + s.e1 + ')-(' + s.e2 + ')|=|' + (s.flip ? s.c + '+' + s.b : '-' + s.b + '-' + s.c) + '|=' + s.L) + ' units.',
        ['Subtract the coordinates that change, keeping the brackets: ' + t('(' + s.e1 + ')-(' + s.e2 + ')') + '. The letter cancels.'], 'variable length (b)', { after: 'units' });
        p.bad = [String(Math.abs(s.c - s.b) === s.L ? s.L + 1 : Math.abs(s.c - s.b)), String(-s.L)]; return p;
      } },
      { id: ids[3], sub: 'c', level: levels[3], make: function (r, sh) { return varLenPart(sh.c); } },
      { id: ids[4], sub: 'd', level: levels[4], make: function (r, sh) { return varLenPart(sh.d); } }] };
  }

  /* ---------- perimeter / area checkers ---------- */
  function perimDiag(w, h) {
    return function (v) {
      if (v === w + h) return { code: 'u6l2-half-perim', hint: 'That is only two sides. A rectangle has <b>four</b> sides: ' + t('P=2w+2h') + '.' };
      if (v === w * h) return { code: 'u6l2-area-perim', hint: 'That is the area. The perimeter is the distance <b>around</b> the outside: add all four sides.' };
      if (v === 2 * (w + 1) + 2 * h || v === 2 * w + 2 * (h + 1) || v === 2 * (w - 1) + 2 * h || v === 2 * w + 2 * (h - 1)) return { code: 'count', hint: 'One side length is off by one. Subtract the coordinates (or count the spaces, not the grid lines).' };
      return null;
    };
  }
  function rectShared(r, dflt, xr, yr) {
    if (dflt && r.chance(0.2)) return { V: dflt, w: dflt[1][0] - dflt[0][0], h: dflt[2][1] - dflt[1][1] };
    for (var i = 0; i < 200; i++) {
      var x1 = r.int(xr[0], -1), x2 = r.int(1, xr[1]), y1 = r.int(yr[0], -1), y2 = r.int(1, yr[1]);
      if (x2 - x1 === y2 - y1 || x2 - x1 < 4 || y2 - y1 < 4) continue;
      return { V: [[x1, y1], [x2, y1], [x2, y2], [x1, y2]], w: x2 - x1, h: y2 - y1 };
    }
    return { V: dflt, w: dflt[1][0] - dflt[0][0], h: dflt[2][1] - dflt[1][1] };
  }
  function V4tex(names, V) { return V.map(function (p, i) { return t(names[i] + P2(p)); }).join(', '); }

  /* ======================== Assignment ======================== */
  var Q = [
    { num: '1', section: 'Part A — Finding Lengths From Coordinates', stem: 'Determine the length of each line segment.', parts: [
      { id: '1a', level: 'LIM', make: function (r) { if (r.chance(0.15)) return hvLen('A', [2, 5], 'B', [9, 5]); var y = r.int(1, 9), x = r.int(1, 6), L = r.int(3, 9); return hvLen('A', [x, y], 'B', [x + L, y]); } },
      { id: '1b', level: 'BEG', make: function (r) { if (r.chance(0.15)) return hvLen('C', [-3, 6], 'D', [-3, 1]); var x = r.int(-9, -1), y = r.int(1, 5), L = r.int(3, 9); return hvLen('C', [x, y + L], 'D', [x, y]); } },
      { id: '1c', level: 'BEG', make: function (r) { if (r.chance(0.15)) return hvLen('E', [4, -2], 'F', [-5, -2]); var y = r.int(-9, -1); return hvLen('E', [r.int(1, 9), y], 'F', [r.int(-9, -1), y]); } },
      { id: '1d', level: 'BEG', make: function (r) { if (r.chance(0.15)) return hvLen('G', [-1, -7], 'H', [-1, 3]); var x = r.int(-9, 9) || 2; return hvLen('G', [x, r.int(-9, -2)], 'H', [x, r.int(1, 9)]); } }] },
    { num: '2', stem: 'Determine the length of each line segment.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { if (r.chance(0.15)) return hvLen('I', [-8, -3], 'J', [-8, -9]); var x = r.int(-12, -1), y1 = r.int(-9, -1); return hvLen('I', [x, y1], 'J', [x, r.int(-15, y1 - 3)]); } },
      { id: '2b', level: 'BEG', make: function (r) { if (r.chance(0.15)) return hvLen('K', [-12, 4], 'L', [5, 4]); var y = r.int(1, 12); return hvLen('K', [r.int(-15, -5), y], 'L', [r.int(2, 15), y]); } },
      { id: '2c', level: 'BEG', make: function (r) { if (r.chance(0.15)) return hvLen('M', [6, -15], 'N', [6, 8]); var x = r.int(2, 12); return hvLen('M', [x, r.int(-18, -6)], 'N', [x, r.int(4, 15)]); } },
      { id: '2d', level: 'EMG', make: function (r) { if (r.chance(0.15)) return hvLen('P', [-20, -6], 'Q', [14, -6]); var y = r.int(-15, -2); return hvLen('P', [r.int(-30, -11), y], 'Q', [r.int(10, 30), y]); } }] },
    { num: '3', stem: 'Determine the length of each line segment.', parts: [
      { id: '3a', level: 'EMG', make: function (r) { if (r.chance(0.15)) return hvLen('R', [150, -60], 'S', [150, 275]); var x = 5 * r.int(10, 60); return hvLen('R', [x, -5 * r.int(4, 30)], 'S', [x, 5 * r.int(20, 80)]); } },
      { id: '3b', level: 'EMG', make: function (r) { if (r.chance(0.15)) return hvLen('T', [-480, 90], 'U', [365, 90]); var y = 5 * r.int(4, 40); return hvLen('T', [-5 * r.int(40, 120), y], 'U', [5 * r.int(30, 100), y]); } },
      { id: '3c', level: 'EMG', make: function (r) { if (r.chance(0.15)) return hvLen('V', [-1200, -50], 'W', [-1200, 730]); var x = -50 * r.int(10, 40); return hvLen('V', [x, -10 * r.int(2, 20)], 'W', [x, 10 * r.int(30, 99)]); } },
      { id: '3d', level: 'EMG', make: function (r) { if (r.chance(0.15)) return hvLen('X', [2075, 600], 'Y', [-925, 600]); var y = 50 * r.int(4, 20); return hvLen('X', [25 * r.int(40, 120), y], 'Y', [-25 * r.int(10, 60), y]); } }] },
    varQuestion('4', null, 'Determine whether each line segment is horizontal or vertical, and write an expression for its length.', [[['x', 'y'], ['p', 'q'], ['m', 'n']], [['h', 'k'], ['p', 'q'], ['u', 'v']], [['a', 'b', 'c'], ['p', 'q', 'r'], ['u', 'v', 'w'], ['d', 'f', 'g'], ['g', 'h', 'k'], ['m', 'n', 'p']], [['s', 't', 'w'], ['j', 'k', 'm'], ['r', 'u', 'z'], ['b', 'c', 'd'], ['f', 'g', 'h'], ['p', 'q', 's']]],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], ['4hv', '4a', '4b', '4c', '4d'], ['LIM', 'BEG', 'EMG', 'PRG', 'PRG']),
    { num: '5', stem: function (sh) { return 'Can the length of a line segment be negative? Consider the horizontal segment from ' + t('P' + P2(sh.P)) + ' to ' + t('Q' + P2(sh.Q)) + '.'; },
      shared: function (r) { var y = r.int(-8, 8), a = r.int(-9, 4), b = a + r.int(3, 12); return r.chance(0.5) ? { P: [a, y], Q: [b, y] } : { P: [b, y], Q: [a, y] }; }, parts: [
        { id: '5a', level: 'BEG', make: function (r, sh) {
          var d1 = sh.Q[0] - sh.P[0], d2 = -d1;
          var p = KP.fields('Subtract the ' + t('x') + '-coordinates both ways, then give the length.', [numField(t('x_Q-x_P='), 'x_Q − x_P'), numField(t('x_P-x_Q='), 'x_P − x_Q'), numField('Length ' + t('PQ='), 'Length', 'units')],
            [K.number(d1, function (v) { if (v === -d1) return { code: 'neg-length', hint: 'Order matters here: ' + t('x_Q-x_P') + ' means ' + t('Q') + '’s coordinate minus ' + t('P') + '’s.' }; return null; }),
              K.number(d2, function (v) { if (v === -d2) return { code: 'neg-length', hint: t('x_P-x_Q') + ' means ' + t('P') + '’s coordinate minus ' + t('Q') + '’s.' }; return null; }),
              K.number(Math.abs(d1), function (v) { if (v === -Math.abs(d1)) return { code: 'neg-length', hint: 'A length is never negative: it is the absolute value of the difference.' }; return null; })],
            [String(d1), String(d2), String(Math.abs(d1))], t('x_Q-x_P=' + d1) + ', ' + t('x_P-x_Q=' + d2) + ', ' + t('PQ=' + Math.abs(d1)) + ' units',
            t('x_Q-x_P=' + sub(sh.Q[0], sh.P[0]) + '=' + d1) + ' and ' + t('x_P-x_Q=' + sub(sh.P[0], sh.Q[0]) + '=' + d2) + '. The two differences are opposites; the length is their absolute value, ' + t('|' + d1 + '|=' + Math.abs(d1)) + ' units.',
            ['Subtract in the order shown. Subtracting a negative adds.', 'The length is the size of the difference, without its sign.'], 'both orders');
          p.bad = [[String(d2), String(d1), String(-Math.abs(d1))]]; return p;
        } },
        { id: '5b', level: 'BEG', make: function (r, sh) {
          return mcP(r, 'So, can a length be negative, and why do we take the <b>absolute value</b> of the difference?', [
            { html: '<b>No.</b> A length is the absolute value of a difference. Subtracting in the other order only flips the sign, and the absolute value removes it.', right: true },
            { html: '<b>Yes</b>, when the segment runs to the left or downward.', why: 'Direction doesn’t change how long a segment is: ' + t('PQ') + ' and ' + t('QP') + ' are the same segment.', code: 'dir' },
            { html: '<b>Yes</b>, when both endpoints have negative coordinates.', why: 'Negative coordinates only tell you where the points are. The length depends on the gap between them, which is never negative.', code: 'negpts' },
            { html: '<b>No</b>, because you must always subtract the left endpoint from the right one.', why: 'Either order is fine — that is exactly what the absolute value takes care of.', code: 'order' }],
            'A length measures how far apart two points are, so it is never negative. ' + t('x_Q-x_P') + ' and ' + t('x_P-x_Q') + ' are opposites; the absolute value gives the same positive length either way.', ['Look at your two differences in part (a).'], 'length never negative');
        } }] },
    { num: '6', stem: 'Solve for the unknown coordinate.', parts: [
      { id: '6a', level: 'EMG', make: function (r) {
        var c = r.chance(0.15) ? [3, 4, 8, 1] : [r.int(-8, 8), r.int(-8, 8), r.int(4, 15), sgn(r)], x0 = c[0], y0 = c[1], L = c[2], dir = c[3], ans = x0 + dir * L;
        return numPart('Segment ' + t('JK') + ' has endpoints ' + t('J' + P2([x0, y0])) + ' and ' + t('K(x,\\ ' + F(y0) + ')') + '. If ' + t('JK=' + L) + ' units and ' + t('x' + (dir > 0 ? '>' : '<') + F(x0)) + ', find ' + t('x') + '.', ans, function (v) {
          if (v === x0 - dir * L) return { code: 'u6l2-wrong-dir', hint: 'That point is ' + t(L) + ' units the <b>other</b> way. The condition ' + t('x' + (dir > 0 ? '>' : '<') + F(x0)) + ' says ' + t('K') + ' is to the ' + (dir > 0 ? 'right' : 'left') + ' of ' + t('J') + '.' };
          if (v === L) return { code: 'u6l2-gave-length', hint: t(L) + ' is the length. Start at ' + t('x=' + F(x0)) + ' and move ' + t(L) + ' units ' + (dir > 0 ? 'right' : 'left') + '.' };
          if (v === dir * L - x0 || v === L - x0) return { code: 'shift-sign', hint: 'Start at ' + t('J') + '’s ' + t('x') + '-coordinate, ' + t(F(x0)) + ', and ' + (dir > 0 ? 'add' : 'subtract') + ' ' + t(L) + '.' };
          return null;
        }, t('JK') + ' is horizontal (both ' + t('y') + '-coordinates are ' + t(F(y0)) + '), so ' + t('|x-' + pr(x0) + '|=' + L) + '. Since ' + t('x' + (dir > 0 ? '>' : '<') + F(x0)) + ', ' + t('K') + ' is ' + t(L) + ' units to the ' + (dir > 0 ? 'right' : 'left') + ': ' + t('x=' + F(x0) + (dir > 0 ? '+' : '-') + L + '=' + F(ans)) + '.',
          ['The segment is horizontal: ' + t('K') + ' is ' + t(L) + ' units to the left or right of ' + t('J') + '.', 'The condition tells you which way.'], 'find x ' + x0 + ',' + L, null);
      } },
      { id: '6b', level: 'PRG', make: function (r) {
        var c = r.chance(0.15) ? [-2, 9, 13, -1] : [r.int(-8, 8), r.int(-8, 8), r.int(5, 15), sgn(r)], x0 = c[0], y0 = c[1], L = c[2], dir = c[3], ans = y0 + dir * L;
        return numPart('Segment ' + t('LM') + ' has endpoints ' + t('L(' + F(x0) + ',\\ y)') + ' and ' + t('M' + P2([x0, y0])) + '. If ' + t('LM=' + L) + ' units and ' + t('y' + (dir > 0 ? '>' : '<') + F(y0)) + ', find ' + t('y') + '.', ans, function (v) {
          if (v === y0 - dir * L) return { code: 'u6l2-wrong-dir', hint: 'That point is ' + t(L) + ' units the <b>other</b> way. The condition ' + t('y' + (dir > 0 ? '>' : '<') + F(y0)) + ' says ' + t('L') + ' is ' + (dir > 0 ? 'above' : 'below') + ' ' + t('M') + '.' };
          if (v === L) return { code: 'u6l2-gave-length', hint: t(L) + ' is the length. Start at ' + t('y=' + F(y0)) + ' and move ' + t(L) + ' units ' + (dir > 0 ? 'up' : 'down') + '.' };
          if (v === x0 + dir * L || v === x0 - dir * L) return { code: 'u6l2-other-coord', hint: 'The segment is vertical, so the ' + t('x') + '-coordinate stays ' + t(F(x0)) + '. Move from ' + t('M') + '’s ' + t('y') + '-coordinate, ' + t(F(y0)) + '.' };
          if (v === dir * L - y0 || v === L - y0 || v === y0 - L + 2 * y0) return { code: 'shift-sign', hint: 'Start at ' + t(F(y0)) + ' and ' + (dir > 0 ? 'add' : 'subtract') + ' ' + t(L) + '.' };
          return null;
        }, t('LM') + ' is vertical (both ' + t('x') + '-coordinates are ' + t(F(x0)) + '), so ' + t('|y-' + pr(y0) + '|=' + L) + '. Since ' + t('y' + (dir > 0 ? '>' : '<') + F(y0)) + ', ' + t('L') + ' is ' + t(L) + ' units ' + (dir > 0 ? 'above' : 'below') + ' ' + t('M') + ': ' + t('y=' + F(y0) + (dir > 0 ? '+' : '-') + L + '=' + F(ans)) + '.',
          ['The segment is vertical: ' + t('L') + ' is ' + t(L) + ' units above or below ' + t('M') + '.', 'The condition tells you which way.'], 'find y ' + y0 + ',' + L, null);
      } }] },
    { num: '7', section: 'Part B — Grids, Shapes, and Applications', stem: function (sh) { return 'Rectangle ' + t('ABCD') + ' has vertices ' + V4tex(['A', 'B', 'C', 'D'], sh.V) + '.'; }, shared: function (r) { return rectShared(r, [[-6, -2], [5, -2], [5, 6], [-6, 6]], [-7, 7], [-4, 8]); }, parts: [
      { id: '7a', sub: 'plot', level: 'BEG', make: function (r, sh) { return polyPart('Plot the vertices of rectangle ' + t('ABCD') + ' and join them in order.', sh.V, { x: [-8, 8], y: [-5, 9] }, ['A', 'B', 'C', 'D'], 'plot rectangle'); } },
      { id: '7b', sub: 'perimeter', level: 'EMG', make: function (r, sh) {
        var w = sh.w, h = sh.h, P = 2 * (w + h), V = sh.V;
        return numPart('Determine the perimeter of rectangle ' + t('ABCD') + '.', P, perimDiag(w, h), lenTex('AB', V[0], V[1]) + ' and ' + lenTex('BC', V[1], V[2]) + '. Opposite sides of a rectangle are equal, so ' + t('P=2(' + w + ')+2(' + h + ')=' + P) + ' units.',
          ['Find the length of a horizontal side and a vertical side by subtracting coordinates.', 'A rectangle has two of each: ' + t('P=2w+2h') + '.'], 'perimeter ABCD', 'units', [w + h, w * h]);
      } }] },
    { num: '8', stem: function (sh) { return 'Right triangle ' + t('PQR') + ' has vertices ' + V4tex(['P', 'Q', 'R'], [sh.P, sh.Q, sh.R]) + ', with the right angle at ' + t('P') + '.'; },
      shared: function (r) {
        if (r.chance(0.2)) return { P: [-2, -4], Q: [6, -4], R: [-2, 5] };
        for (var i = 0; i < 200; i++) { var px = r.int(-4, -1), py = r.int(-5, -1), b = r.int(4, 9), h = r.int(4, 10), sx = r.chance(0.8) ? 1 : -1; if ((b * h) % 2 || b === h) continue; var Q = [px + sx * b, py], R = [px, py + h]; if (Math.abs(Q[0]) > 8 || R[1] > 8) continue; return { P: [px, py], Q: Q, R: R }; }
        return { P: [-2, -4], Q: [6, -4], R: [-2, 5] };
      }, parts: [
        { id: '8a', sub: 'plot', level: 'BEG', make: function (r, sh) { return polyPart('Plot triangle ' + t('PQR') + ' and join the vertices.', [sh.P, sh.Q, sh.R], { x: [-9, 9], y: [-6, 9] }, ['P', 'Q', 'R'], 'plot triangle'); } },
        { id: '8b', sub: 'area', level: 'EMG', make: function (r, sh) {
          var b = Math.abs(sh.Q[0] - sh.P[0]), h = Math.abs(sh.R[1] - sh.P[1]), A = b * h / 2;
          return numPart('Calculate the <b>area</b> of triangle ' + t('PQR') + '.', A, function (v) {
            if (v === b * h) return { code: 'no-half', hint: 'That is base × height — the area of a <b>rectangle</b>. A triangle is half of it: ' + t('A=\\tfrac12bh') + '.' };
            if (v === (b + 1) * h / 2 || v === b * (h + 1) / 2 || v === (b - 1) * h / 2 || v === b * (h - 1) / 2) return { code: 'count', hint: 'Recount the base or the height: subtract the coordinates.' };
            if (v === b + h || v === 2 * (b + h)) return { code: 'u6l2-area-perim', hint: 'Area is not a sum of sides: ' + t('A=\\tfrac12\\times\\text{base}\\times\\text{height}') + '.' };
            return null;
          }, 'The legs meet at the right angle ' + t('P') + ': ' + lenTex('PQ', sh.P, sh.Q) + ' (horizontal) and ' + lenTex('PR', sh.P, sh.R) + ' (vertical).<br>' + t('A=\\tfrac12bh=\\tfrac12(' + b + ')(' + h + ')=' + A) + ' units².',
          ['The two legs that meet at ' + t('P') + ' are the base and the height. Find each by subtracting coordinates.', t('A=\\tfrac12\\times\\text{base}\\times\\text{height}') + '.'], 'area PQR', 'units²', [b * h]);
        } }] },
    { num: '9', stem: '', parts: [
      { id: '9', level: 'EMG', make: function (r) {
        var w = r.chance(0.2) ? 18 : r.int(8, 40), h = r.chance(0.2) && w === 18 ? 12 : r.int(5, 30); if (w === h) h += 3;
        var who = r.pick(['Sanjay', 'Mei', 'Aaliyah', 'Jordan', 'Priya', 'Lucas']);
        return numPart('A rectangular garden has corners at ' + t('(0,\\ 0)') + ', ' + t('(' + w + ',\\ 0)') + ', ' + t('(' + w + ',\\ ' + h + ')') + ' and ' + t('(0,\\ ' + h + ')') + ', measured in metres. ' + who + ' wants to build a fence all the way around the garden. What total length of fencing is needed?', 2 * (w + h), perimDiag(w, h),
          'The sides are ' + t('|' + w + '-0|=' + w) + ' m and ' + t('|' + h + '-0|=' + h) + ' m. The fence goes all the way around: ' + t('2(' + w + ')+2(' + h + ')=' + 2 * (w + h)) + ' m.', ['Find the length and the width by subtracting coordinates.', 'All the way around means all four sides.'], 'garden fence', 'm', [w + h, w * h]);
      } }] },
    { num: '10', stem: '', parts: [
      { id: '10', level: 'EMG', make: function (r) {
        var a = r.chance(0.2) ? 25 : r.int(10, 40), b = r.chance(0.2) && a === 25 ? 14 : r.int(6, 25);
        return numPart('A warehouse wall is being painted. One wall runs from ' + t('(0,\\ 0)') + ' to ' + t('(' + a + ',\\ 0)') + ', and the wall it joins runs from ' + t('(' + a + ',\\ 0)') + ' to ' + t('(' + a + ',\\ ' + b + ')') + ', both measured in metres. What is the total length of wall that will be painted?', a + b, function (v) {
          if (v === 2 * (a + b)) return { code: 'u6l2-extra-side', hint: 'Only <b>two</b> walls are painted — not the four sides of a rectangle.' };
          if (near(v, Math.round(Math.hypot(a, b) * 10) / 10, 0.06)) return { code: 'u6l2-diag-wall', hint: 'That is the straight-line distance from ' + t('(0,\\ 0)') + ' to ' + t('(' + a + ',\\ ' + b + ')') + '. The walls run along the two segments: add their lengths.' };
          if (v === a * b) return { code: 'u6l2-area-perim', hint: 'Add the two wall lengths — don’t multiply.' };
          return null;
        }, 'The first wall is horizontal: ' + t('|' + a + '-0|=' + a) + ' m. The second is vertical: ' + t('|' + b + '-0|=' + b) + ' m. Total: ' + t(a + '+' + b + '=' + (a + b)) + ' m.', ['Find each wall’s length by subtracting coordinates, then add.'], 'two walls', 'm', [2 * (a + b)]);
      } }] },
    { num: '11', stem: function (sh) { return 'Segment ' + t('EF') + ' has endpoints ' + t('E' + P2(sh.E)) + ' and ' + t('F' + P2(sh.F)) + '. Segment ' + t('GH') + ' has endpoints ' + t('G' + P2(sh.G)) + ' and ' + t('H' + P2(sh.H)) + '.'; },
      shared: function (r) {
        if (r.chance(0.2)) return { E: [-10, 3], F: [6, 3], G: [2, -9], H: [2, 19] };
        for (var i = 0; i < 100; i++) { var y = r.int(-9, 9), e = r.int(-15, -2), f = r.int(2, 15), x = r.int(-9, 9), g = r.int(-15, -2), h = r.int(2, 20); if (f - e === h - g || Math.abs((f - e) - (h - g)) < 2) continue; return { E: [e, y], F: [f, y], G: [x, g], H: [x, h] }; }
        return { E: [-10, 3], F: [6, 3], G: [2, -9], H: [2, 19] };
      }, parts: [
        { id: '11a', level: 'BEG', make: function (r, sh) {
          var a = lenOf(sh.E, sh.F), b = lenOf(sh.G, sh.H);
          var p = KP.fields('Determine the length of each segment.', [numField(t('EF='), 'EF', 'units'), numField(t('GH='), 'GH', 'units')], [K.number(a, hvDiag(sh.E, sh.F)), K.number(b, hvDiag(sh.G, sh.H))], [String(a), String(b)],
            t('EF=' + a) + ', ' + t('GH=' + b), lenTex('EF', sh.E, sh.F) + ' (horizontal) and ' + lenTex('GH', sh.G, sh.H) + ' (vertical).', ['Which coordinate changes along each segment? Subtract those.'], 'EF and GH');
          p.bad = [[String(b), String(a)]]; return p;
        } },
        { id: '11b', level: 'EMG', make: function (r, sh) {
          var a = lenOf(sh.E, sh.F), b = lenOf(sh.G, sh.H), lg = a > b ? 'EF' : 'GH', sm = a > b ? 'GH' : 'EF', d = Math.abs(a - b);
          return mcP(r, 'Which segment is longer, and by how many units?', [
            { html: t(lg) + ', by ' + t(d) + ' units', right: true },
            { html: t(sm) + ', by ' + t(d) + ' units', why: t('EF=' + a) + ' and ' + t('GH=' + b) + ': which number is bigger?', code: 'swap' },
            { html: t(lg) + ', by ' + t(a + b) + ' units', why: '“Longer by” means the <b>difference</b> of the lengths, not their sum.', code: 'sum' },
            { html: t(lg) + ', by ' + t(Math.max(a, b)) + ' units', why: 'That is the length of ' + t(lg) + '. How much longer is it than ' + t(sm) + '?', code: 'len' }],
            t('EF=' + a) + ' and ' + t('GH=' + b) + ', so ' + t(lg) + ' is longer by ' + t(Math.max(a, b) + '-' + Math.min(a, b) + '=' + d) + ' units.', ['Use your lengths from part (a), then subtract.'], 'which longer');
        } }] },
    { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '12', level: 'PRG', make: function (r) { return twoSolMC(r, 'C', 'D', 'x', r.chance(0.2) ? [-3, 5, 8] : null); } }] },
    { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
      { id: '13', level: 'EMG', make: function (r) {
        var R = rectShared(r, [[-6, -4], [9, -4], [9, 7], [-6, 7]], [-12, 12], [-9, 12]), V = R.V, w = R.w, h = R.h, P = 2 * (w + h), dg = perimDiag(w, h);
        var p = KP.nr('Rectangle ' + t('WXYZ') + ' has vertices ' + V4tex(['W', 'X', 'Y', 'Z'], V) + '. The perimeter of rectangle ' + t('WXYZ') + ', in units, is ________.', P, dg,
          lenTex('WX', V[0], V[1]) + ', ' + lenTex('XY', V[1], V[2]) + '. ' + t('P=2(' + w + ')+2(' + h + ')=' + P) + ' units.', ['Subtract coordinates to get the width and the height, then add all four sides.'], 'NR perimeter');
        p.bad = [String(w + h), String(w * h)].filter(function (b) { return Number(b) !== P; }); return p;
      } }] }
  ];

  /* Q12 / Extra 13: all positions of the missing endpoint (a horizontal or vertical segment) */
  function twoSolMC(r, n1, n2, v, fix) {
    var c, k, L;
    if (fix) { c = fix[0]; k = fix[1]; L = fix[2]; }
    else for (var i = 0; i < 100; i++) { c = r.int(-9, 9); k = r.int(-9, 9); L = r.int(5, 16); if (c !== 0 && Math.abs(c) !== L && c + L !== 0 && c - L !== 0 && L - c !== c + L && Math.abs(L - c) !== Math.abs(c + L)) break; }
    var a1 = c + L, a2 = c - L, wrongOne = L - c;
    var P = v === 'x' ? [c, k] : [k, c], Ptx = v === 'x' ? t(n1 + P2(P)) : t(n1 + P2(P)), Qtx = v === 'x' ? t(n2 + '(x,\\ ' + F(k) + ')') : t(n2 + '(' + F(k) + ',\\ y)');
    var big = Math.max(a1, a2), small = Math.min(a1, a2);
    var opts = [
      { html: t(v + '=' + F(big)) + ' only', why: 'That is one answer — but ' + t(n2) + ' could also be ' + t(L) + ' units the other way from ' + t(n1) + '.', code: 'one' },
      { html: t(v + '=' + F(wrongOne)) + ' only', why: 'Check: from ' + t(F(c)) + ' to ' + t(F(wrongOne)) + ' is ' + t(Math.abs(wrongOne - c)) + ' units, not ' + t(L) + '. Start at ' + t(F(c)) + ' and add or subtract ' + t(L) + '.', code: 'sign' },
      { html: t(v + '=' + F(small)) + ' or ' + t(v + '=' + F(big)), right: true },
      { html: t(v + '=' + F(Math.abs(wrongOne))) + ' or ' + t(v + '=' + F(-Math.abs(wrongOne))), why: 'The two answers are not opposites of each other: they are ' + t(L) + ' units on either side of ' + t(F(c)) + '.', code: 'pm' }];
    return mcP(r, (v === 'x' ? 'Horizontal' : 'Vertical') + ' segment ' + t(n1 + n2) + ' has endpoints ' + Ptx + ' and ' + Qtx + ', and its length is ' + t(L) + ' units. Which gives all possible values of ' + t(v) + '?', opts,
      'The segment is ' + (v === 'x' ? 'horizontal, so ' + t(n2) + ' is ' + t(L) + ' units left or right' : 'vertical, so ' + t(n2) + ' is ' + t(L) + ' units up or down') + ' of ' + t(n1) + ': ' + t(v + '=' + F(c) + '+' + L + '=' + F(a1)) + ' or ' + t(v + '=' + F(c) + '-' + L + '=' + F(a2)) + '.',
      ['A segment can run either way from a known endpoint.', 'Add the length to the known coordinate, and subtract it.'], 'two solutions ' + v + ' ' + c + ',' + L, true);
  }

  /* ======================== Extra Practice ======================== */
  /* Extra 1: two grids, each with one horizontal and one vertical segment */
  var WE1 = { x: [-6, 6], y: [-6, 6] };
  function e1Shared(r) {
    var dflt = r.chance(0.2), segs;
    if (dflt) segs = [[[-5, 4], [2, 4]], [[3, 1], [3, -5]], [[-4, -3], [5, -3]], [[-2, 5], [-2, -6]]];
    else for (var tr = 0; tr < 300; tr++) {
      var ok2 = true; segs = [];
      for (var g = 0; g < 2 && ok2; g++) {
        var hy = r.int(-5, 5) || 4, hx1 = r.int(-5, 0), hx2 = r.int(hx1 + 3, 5), vx = r.int(-5, 5) || 3, vy1 = r.int(-5, 0), vy2 = r.int(vy1 + 3, 5);
        var crossV = vx >= hx1 - 1 && vx <= hx2 + 1 && hy >= vy1 - 1 && hy <= vy2 + 1;
        if (crossV || hy === 0 || vx === 0) { ok2 = false; break; }
        var hs = [[hx1, hy], [hx2, hy]], vs = [[vx, vy1], [vx, vy2]];
        if (r.chance(0.5)) hs.reverse(); if (r.chance(0.5)) vs.reverse();
        segs.push(hs, vs);
      }
      if (ok2) break;
    }
    return { segs: segs };
  }
  var E1N = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H']];
  function e1Stem(sh) { return 'Four segments are graphed below. Each grid square is ' + t('1') + ' unit.<div class="fig-row">' + segFig(WE1, sh.segs.slice(0, 2), E1N.slice(0, 2), 260) + segFig(WE1, sh.segs.slice(2), E1N.slice(2), 260) + '</div>'; }

  /* Extra 7: L-shaped room; Extra 8: a rectangle with a notch */
  function lShared(r) {
    if (r.chance(0.2)) return { V: [[-4, -2], [3, -2], [3, 1], [0, 1], [0, 5], [-4, 5]], cost: 6.5 };
    var x0 = r.int(-6, -3), x2 = r.int(2, 6), x1 = r.int(x0 + 2, x2 - 2), y0 = r.int(-5, -1), y2 = r.int(3, 6), y1 = r.int(y0 + 2, y2 - 2);
    var V = [[x0, y0], [x2, y0], [x2, y1], [x1, y1], [x1, y2], [x0, y2]];
    if (r.chance(0.5)) V = V.map(function (p) { return [-p[0], p[1]]; }).reverse();
    return { V: V, cost: r.pick([4.5, 5.25, 6.5, 7.75, 8, 9.5, 12.25]) };
  }
  function notchShared(r) {
    if (r.chance(0.2)) return { V: [[-5, -3], [4, -3], [4, 0], [1, 0], [1, 2], [4, 2], [4, 5], [-5, 5]], depth: 3, W: 9, H: 8 };
    var x0 = r.int(-6, -4), x2 = r.int(3, 6), dpt = r.int(2, Math.min(4, x2 - x0 - 3)), x1 = x2 - dpt, y0 = r.int(-5, -2), y3 = r.int(4, 6), y1 = r.int(y0 + 2, 1), y2 = r.int(Math.max(y1 + 1, 0), y3 - 2);
    if (y1 >= y2) { y1 = 0; y2 = 2; }
    var V = [[x0, y0], [x2, y0], [x2, y1], [x1, y1], [x1, y2], [x2, y2], [x2, y3], [x0, y3]];
    if (r.chance(0.4)) V = V.map(function (p) { return [-p[0], p[1]]; });
    return { V: V, depth: dpt, W: x2 - x0, H: y3 - y0 };
  }
  function sidesFields(prompt, V, names, text) {
    var n = V.length, fl = [], ch = [], keys = [], sol = [];
    for (var i = 0; i < n; i++) { var A = V[i], B = V[(i + 1) % n], nm = names[i] + names[(i + 1) % n]; fl.push(numField(t(nm + '='), nm, 'units')); ch.push(K.number(lenOf(A, B), hvDiag(A, B))); keys.push(String(lenOf(A, B))); sol.push(lenTex(nm, A, B)); }
    var p = KP.fields(prompt, fl, ch, keys, keys.map(function (k, i) { return t(names[i] + names[(i + 1) % n] + '=' + k); }).join(', '), sol.join(', '), ['Each side is horizontal or vertical: subtract the coordinates that change.', 'Work around the figure in order so no side is missed.'], text);
    p.bad = [keys.map(function (k) { return String(Number(k) + 1); })]; return p;
  }
  function perimOf(V) { var s = 0; for (var i = 0; i < V.length; i++) s += lenOf(V[i], V[(i + 1) % V.length]); return s; }
  function money(x) { return '\\$' + x.toFixed(2); }
  function moneyChk(want, diag) {
    return function (resp) {
      var raw = String(resp == null ? '' : resp).replace(/\\\$|\$/g, '').replace(/,/g, '').trim(), p = HW.parse.number(raw);
      if (!p.ok) { var a = K.read(raw); if (a.res) return a.res; return form('notnumber', 'Type the amount as a number, e.g. ' + t('182.00') + '.'); }
      if (near(p.value, want, 0.005)) return ok();
      var h = diag ? diag(p.value) : null; if (h) return wrong(h.code, h.hint);
      return wrong('value', null);
    };
  }
  /* Extra 9: five segments with different lengths */
  function e9Shared(r) {
    if (r.chance(0.2)) return { s: [[[-8, 6], [7, 6]], [[3, -9], [3, 8]], [[-12, -5], [2, -5]], [[-6, 11], [-6, -2]], [[5, -4], [21, -4]]] };
    var Ls = r.sample([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], 5), out = [];
    Ls.forEach(function (L, i) {
      var hor = i % 2 === 0 ? r.chance(0.7) : r.chance(0.3), a = r.int(-15, 5), k = r.int(-12, 12) || 4, A = hor ? [a, k] : [k, a], B = hor ? [a + L, k] : [k, a + L];
      out.push(r.chance(0.5) ? [A, B] : [B, A]);
    });
    return { s: out };
  }
  /* Extra 10: both positions; Extra 11: the one position that fits a condition */
  function bothPart(r, name, P, hor, L) {
    var i = hor ? 0 : 1, A1 = P.slice(), A2 = P.slice(); A1[i] = P[i] + L; A2[i] = P[i] - L;
    var wrongAxis1 = P.slice(), wrongAxis2 = P.slice(); wrongAxis1[1 - i] = P[1 - i] + L; wrongAxis2[1 - i] = P[1 - i] - L;
    return pairsPart((hor ? 'Horizontal' : 'Vertical') + ', from ' + t(name + P2(P)) + ', length ' + t(L) + '. Give <b>both</b> possible positions of the other endpoint.', [A1, A2],
      [{ is: [A1], code: 'one-sol', hint: 'There is a second position: the segment can also run ' + t(L) + ' units ' + (hor ? 'to the left' : 'downward') + '.' }, { is: [A2], code: 'one-sol', hint: 'There is a second position: the segment can also run ' + t(L) + ' units ' + (hor ? 'to the right' : 'upward') + '.' },
        { is: [wrongAxis1, wrongAxis2], code: 'u6l2-other-coord', hint: 'A ' + (hor ? 'horizontal' : 'vertical') + ' segment keeps the same ' + t(hor ? 'y' : 'x') + '-coordinate. Change the ' + t(hor ? 'x' : 'y') + '-coordinate.' }],
      'A ' + (hor ? 'horizontal' : 'vertical') + ' segment keeps ' + t((hor ? 'y=' : 'x=') + F(P[1 - i])) + '. Move ' + t(L) + ' units ' + (hor ? 'right or left' : 'up or down') + ': ' + t(F(P[i]) + '+' + L + '=' + F(A1[i])) + ' and ' + t(F(P[i]) + '-' + L + '=' + F(A2[i])) + '.<br>The other endpoint is ' + t(P2(A1)) + ' or ' + t(P2(A2)) + '.',
      ['Which coordinate stays the same for a ' + (hor ? 'horizontal' : 'vertical') + ' segment?', 'Add the length to the other coordinate, and subtract it.'], 'both endpoints ' + P2(P) + ' ' + L);
  }
  function condPart(r, fix) {
    var c = fix || { hor: r.chance(0.5), known: [r.int(-9, 9), r.int(-9, 9)], L: r.int(4, 14), dir: sgn(r), first: r.chance(0.5) };
    var hor = c.hor, i = hor ? 0 : 1, v = hor ? 'x' : 'y', K0 = c.known, ans = K0[i] + c.dir * c.L, other = K0.slice(); other[i] = ans;
    var nmU = c.first ? c.names[0] : c.names[1], nmK = c.first ? c.names[1] : c.names[0];
    var Utex = hor ? nmU + '(x,\\ ' + F(K0[1]) + ')' : nmU + '(' + F(K0[0]) + ',\\ y)', cond = v + (c.dir > 0 ? '>' : '<') + F(K0[i]);
    var fl = [{ label: t(v + '='), name: v }, ptField(nmU)];
    var p = KP.fields(t(c.first ? Utex : nmK + P2(K0)) + ' to ' + t(c.first ? nmK + P2(K0) : Utex) + ', with ' + t(c.names[0] + c.names[1] + '=' + c.L) + ' and ' + t(cond) + '. Solve for ' + t(v) + ' and state the other endpoint ' + t(nmU) + '.', fl,
      [K.number(ans, function (x) { if (x === K0[i] - c.dir * c.L) return { code: 'u6l2-wrong-dir', hint: 'That value breaks the condition ' + t(cond) + '. Go the other way.' }; if (x === c.L) return { code: 'u6l2-gave-length', hint: t(c.L) + ' is the length. Start from ' + t(F(K0[i])) + '.' }; return null; }),
        ptChk(other, { diag: function (q) { var o2 = K0.slice(); o2[i] = K0[i] - c.dir * c.L; if (near(q[0], o2[0]) && near(q[1], o2[1])) return { code: 'u6l2-wrong-dir', hint: 'That point breaks the condition ' + t(cond) + '.' }; return null; } })],
      [String(ans), '(' + other[0] + ', ' + other[1] + ')'], t(v + '=' + F(ans)) + ', ' + t(nmU + P2(other)),
      'The segment is ' + (hor ? 'horizontal' : 'vertical') + ', so ' + t(nmU) + ' is ' + t(c.L) + ' units ' + (hor ? 'left or right' : 'up or down') + ' of ' + t(nmK + P2(K0)) + '. The condition ' + t(cond) + ' picks ' + t(v + '=' + F(K0[i]) + (c.dir > 0 ? '+' : '-') + c.L + '=' + F(ans)) + ', so ' + t(nmU + P2(other)) + '.',
      ['Two positions are ' + t(c.L) + ' units away. Which one satisfies ' + t(cond) + '?'], 'condition ' + P2(K0) + ' ' + c.L);
    p.bad = [[String(K0[i] - c.dir * c.L), '(' + (hor ? K0[i] - c.dir * c.L : K0[0]) + ', ' + (hor ? K0[1] : K0[i] - c.dir * c.L) + ')']]; return p;
  }

  var X = [
    /* ---------- Part A ---------- */
    { num: '1', section: 'Part A — Counting Squares and Subtracting Coordinates', stem: e1Stem, shared: e1Shared, parts: [
      { id: 'e1hv', sub: 'H or V', level: 'LIM', make: function (r, sh) {
        var rows = E1N.map(function (n, i) { return { id: n.join(''), html: t('\\overline{' + n.join('') + '}') }; }), want = {};
        sh.segs.forEach(function (s, i) { want[E1N[i].join('')] = s[0][1] === s[1][1] ? 'h' : 'v'; });
        return KP.grid('Is each segment horizontal or vertical?', rows, [{ id: 'h', html: 'Horizontal' }, { id: 'v', html: 'Vertical' }], want, { tries: 2, why: function () { return { code: 'row', hint: 'A horizontal segment runs left–right (same ' + t('y') + '); a vertical one runs up–down (same ' + t('x') + ').' }; } },
          sh.segs.map(function (s, i) { return t('\\overline{' + E1N[i].join('') + '}') + ': ' + (s[0][1] === s[1][1] ? 'horizontal (the ' + t('y') + '’s match)' : 'vertical (the ' + t('x') + '’s match)'); }).join('<br>'), ['Look at the grid: does the segment run across or up and down?'], 'H or V on grid');
      } }].concat([0, 1, 2, 3].map(function (i) {
        return { id: 'e1' + 'abcd'[i], sub: 'abcd'[i], level: 'BEG', make: function (r, sh) {
          var s = sh.segs[i], n = E1N[i], L = lenOf(s[0], s[1]);
          var p = KP.fields('Segment ' + t('\\overline{' + n.join('') + '}') + ': state its endpoints and find its length.', [ptField(n[0]), ptField(n[1]), numField('Length:', 'length', 'units')],
            [ptChk(s[0]), ptChk(s[1]), K.number(L, hvDiag(s[0], s[1]))], [pt(s[0]), pt(s[1]), String(L)], t(n[0] + P2(s[0])) + ', ' + t(n[1] + P2(s[1])) + ', length ' + t(L) + ' units',
            'Reading the grid: ' + t(n[0] + P2(s[0])) + ' and ' + t(n[1] + P2(s[1])) + '. Counting squares gives ' + t(L) + '; subtracting confirms it: ' + lenTex(n.join(''), s[0], s[1]) + ' units.',
            ['Read each endpoint: across to its ' + t('x') + '-coordinate, then up or down to its ' + t('y') + '-coordinate.', 'Count the squares between the endpoints, then check by subtracting the coordinates that change.'], 'grid segment ' + n.join(''));
          p.bad = [['(' + s[0][1] + ', ' + s[0][0] + ')', '(' + s[1][1] + ', ' + s[1][0] + ')', String(L + 1)]]; return p;
        } };
      })) },
    { num: '2', stem: 'Determine the length of each segment. Watch the negatives.', parts: [
      { id: 'e2a', level: 'BEG', make: function (r) { if (r.chance(0.15)) return hvLen('A', [-7, 3], 'B', [5, 3]); var y = r.int(-9, 9); return hvLen('A', [r.int(-12, -2), y], 'B', [r.int(2, 12), y]); } },
      { id: 'e2b', level: 'BEG', make: function (r) { if (r.chance(0.15)) return hvLen('C', [-2, -9], 'D', [-2, -1]); var x = r.int(-9, -1), y1 = r.int(-15, -6); return hvLen('C', [x, y1], 'D', [x, r.int(y1 + 3, -1)]); } },
      { id: 'e2c', level: 'EMG', make: function (r) { if (r.chance(0.15)) return hvLen('E', [-11, -4], 'F', [-3, -4]); var y = r.int(-12, -1), a = r.int(-18, -6); return hvLen('E', [a, y], 'F', [r.int(a + 3, -1), y]); } },
      { id: 'e2d', level: 'BEG', make: function (r) { if (r.chance(0.15)) return hvLen('G', [6, -13], 'H', [6, 12]); var x = r.int(1, 12); return hvLen('G', [x, r.int(-18, -5)], 'H', [x, r.int(5, 18)]); } }] },
    { num: '3', stem: 'These points are too far apart to graph. Determine each length by subtracting.', parts: [
      { id: 'e3a', level: 'EMG', make: function (r) { if (r.chance(0.15)) return hvLen('J', [-45, 20], 'K', [68, 20]); var y = r.int(-60, 60); return hvLen('J', [r.int(-99, -20), y], 'K', [r.int(20, 99), y]); } },
      { id: 'e3b', level: 'EMG', make: function (r) { if (r.chance(0.15)) return hvLen('L', [-17, -90], 'M', [-17, 55]); var x = r.int(-60, -1); return hvLen('L', [x, r.int(-150, -40)], 'M', [x, r.int(20, 150)]); } },
      { id: 'e3c', level: 'EMG', make: function (r) { if (r.chance(0.15)) return hvLen('N', [-126, -8], 'P', [-39, -8]); var y = r.int(-40, -1), a = r.int(-250, -100); return hvLen('N', [a, y], 'P', [r.int(a + 30, -10), y]); } },
      { id: 'e3d', level: 'EMG', make: function (r) { if (r.chance(0.15)) return hvLen('Q', [14, -205], 'R', [14, -68]); var x = r.int(1, 60), a = r.int(-300, -120); return hvLen('Q', [x, a], 'R', [x, r.int(a + 40, -20)]); } }] },
    { num: '4', stem: 'The rule works for coordinates that are not whole numbers too. Determine each length.', parts: [
      { id: 'e4a', level: 'EMG', make: function (r) { if (r.chance(0.15)) return hvLen('S', [2.5, -6], 'T', [-8.5, -6]); var y = r.int(-9, 9), a = r.int(1, 19) / 2, b = -r.int(1, 25) / 2; return hvLen('S', [a, y], 'T', [b, y]); } },
      { id: 'e4b', level: 'EMG', make: function (r) { if (r.chance(0.15)) return hvLen('U', [-3.75, 4], 'V', [-3.75, 9.25]); var x = -r.int(1, 39) / 4, a = r.int(-12, 8) + r.pick([0, 0.25, 0.5, 0.75]); return hvLen('U', [x, a], 'V', [x, a + r.int(2, 9) + r.pick([0.25, 0.5, 0.75])]); } },
      { id: 'e4c', level: 'PRG', make: function (r) { return fracLen(r, true, r.chance(0.15) ? [1, -7, 2, -3] : null); } },
      { id: 'e4d', level: 'PRG', make: function (r) { return fracLen(r, false, r.chance(0.15) ? [5, -11, 4, -6] : null); } }] },
    varQuestion('5', null, 'State whether each segment is horizontal or vertical, and write an expression for its length. Assume every letter stands for a real number.', [[['p', 'q'], ['a', 'b'], ['h', 'k']], [['m', 'n'], ['s', 't'], ['p', 'q']], [['b', 'a', 'c'], ['q', 'p', 'r'], ['v', 'u', 'w'], ['f', 'd', 'g'], ['h', 'g', 'k'], ['n', 'm', 'p']], [['s', 'r', 't'], ['k', 'j', 'm'], ['y', 'x', 'z'], ['c', 'b', 'd'], ['g', 'f', 'h'], ['q', 'p', 's']]],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], ['e5hv', 'e5a', 'e5b', 'e5c', 'e5d'], ['LIM', 'BEG', 'EMG', 'PRG', 'PRG']),

    /* ---------- Part B ---------- */
    { num: '6', section: 'Part B — Perimeter and Figures on the Grid', stem: function (sh) { return 'Rectangle ' + t('ABCD') + ' has vertices ' + V4tex(['A', 'B', 'C', 'D'], sh.V) + '.'; }, shared: function (r) { return rectShared(r, [[-5, -3], [4, -3], [4, 4], [-5, 4]], [-6, 6], [-5, 6]); }, parts: [
      { id: 'e6a', level: 'BEG', make: function (r, sh) { return polyPart('Plot and label the four vertices, then join them in order.', sh.V, { x: [-7, 7], y: [-6, 7] }, ['A', 'B', 'C', 'D'], 'plot rectangle'); } },
      { id: 'e6b', level: 'BEG', make: function (r, sh) { return sidesFields('Find the length of each of the four sides by subtracting coordinates.', sh.V, ['A', 'B', 'C', 'D'], 'four sides'); } },
      { id: 'e6c', level: 'BEG', make: function (r, sh) { return numPart('Determine the perimeter of ' + t('ABCD') + '.', 2 * (sh.w + sh.h), perimDiag(sh.w, sh.h), t('P=2(' + sh.w + ')+2(' + sh.h + ')=' + 2 * (sh.w + sh.h)) + ' units.', ['Add all four sides.'], 'perimeter', 'units', [sh.w + sh.h, sh.w * sh.h]); } },
      { id: 'e6d', level: 'EMG', make: function (r, sh) {
        var A = sh.w * sh.h;
        return numPart('Determine the area of ' + t('ABCD') + '.', A, function (v) { if (v === 2 * (sh.w + sh.h)) return { code: 'u6l2-area-perim', hint: 'That is the perimeter. The area is length × width.' }; if (v === A / 2) return { code: 'no-half', hint: 'A rectangle’s area is the whole length × width — no ½ (that is for triangles).' }; if (v === sh.w + sh.h) return { code: 'u6l2-area-perim', hint: 'Multiply the length and the width.' }; return null; },
          t('A=' + sh.w + '\\times ' + sh.h + '=' + A) + ' units².', ['Area of a rectangle = length × width.'], 'area', 'units²', [2 * (sh.w + sh.h)]);
      } }] },
    { num: '7', stem: function (sh) { return 'An L-shaped room is drawn on a floor plan with corners at ' + sh.V.map(function (p) { return t(P2(p)); }).join(', ') + ', joined in that order and back to the start. Each grid unit represents one metre.' + polyFig(sh.V, { x: [-7, 7], y: [-6, 7] }, 260); }, shared: lShared, parts: [
      { id: 'e7a', level: 'EMG', make: function (r, sh) {
        var V = sh.V, fl = [], ch = [], keys = [];
        for (var i = 0; i < 6; i++) { var A = V[i], B = V[(i + 1) % 6]; fl.push(numField('Side ' + (i + 1) + ' ' + t(P2(A) + '\\to' + P2(B)) + ':', 'side ' + (i + 1), 'm')); ch.push(K.number(lenOf(A, B), hvDiag(A, B))); keys.push(String(lenOf(A, B))); }
        var p = KP.fields('Find the length of all six sides, in order around the room.', fl, ch, keys, keys.map(function (k) { return t(k); }).join(', ') + ' m',
          V.map(function (A, i) { var B = V[(i + 1) % 6], j = A[1] === B[1] ? 0 : 1; return t('|' + sub(B[j], A[j]) + '|=' + lenOf(A, B)); }).join(', ') + ' (metres).', ['Each side is horizontal or vertical: subtract the coordinates that change.'], 'L room sides');
        p.bad = [keys.map(function (k) { return String(Number(k) + 1); })]; return p;
      } },
      { id: 'e7b', level: 'EMG', make: function (r, sh) {
        var P = perimOf(sh.V), xs = sh.V.map(function (p) { return p[0]; }), ys = sh.V.map(function (p) { return p[1]; }), W = Math.max.apply(null, xs) - Math.min.apply(null, xs), H = Math.max.apply(null, ys) - Math.min.apply(null, ys);
        return numPart('Determine the perimeter of the room, in metres.', P, function (v) { if (v === W * H) return { code: 'u6l2-area-perim', hint: 'Perimeter is the distance around: add the six sides.' }; if (v === W + H) return { code: 'u6l2-half-perim', hint: 'Add <b>all six</b> sides.' }; return null; },
          'Add the six sides: ' + t(sh.V.map(function (A, i) { return lenOf(A, sh.V[(i + 1) % 6]); }).join('+') + '=' + P) + ' m. (An L-shape has the same perimeter as the rectangle around it: ' + t('2(' + W + ')+2(' + H + ')=' + P) + '.)', ['Add the six side lengths from part (a).'], 'L perimeter', 'm', [W * H]);
      } },
      { id: 'e7c', level: 'PRG', make: function (r, sh) {
        var P = perimOf(sh.V), cost = Math.round(P * sh.cost * 100) / 100;
        var p = KP.math('Baseboard costs ' + t(money(sh.cost)) + ' per metre. Find the cost of baseboard for the whole room.', moneyChk(cost, function (v) { if (near(v, sh.cost * (P / 2), 0.01)) return { code: 'u6l2-cost', hint: 'Use the whole perimeter, all six sides.' }; if (near(v, P, 0.01)) return { code: 'u6l2-cost', hint: 'That is the perimeter in metres. Multiply by the price per metre.' }; return null; }), money(cost),
          'Cost ' + t('=' + P + '\\times ' + money(sh.cost) + '=' + money(cost)) + '.', ['Multiply the perimeter by the price per metre.'], 'baseboard cost', { keys: 'decimal', before: '$', placeholder: 'e.g. 182.00' });
        p.input.type = 'number'; p.answer = t(money(cost)); p.bad = [String(P), String(Math.round(sh.cost * P / 2 * 100) / 100)]; p.good = [cost.toFixed(2), '$' + cost.toFixed(2)]; return p;
      } }] },
    { num: '8', stem: function (sh) { var N = 'ABCDEFGH'; return 'A swimming pool deck has corners at ' + sh.V.map(function (p, i) { return t(N[i] + P2(p)); }).join(', ') + ', joined in order and back to ' + t('A') + '. Notice the <b>notch</b> cut into one side.' + polyFig(sh.V, { x: [-7, 7], y: [-6, 7] }, 260); }, shared: notchShared, parts: [
      { id: 'e8a', level: 'EMG', make: function (r, sh) { return sidesFields('Find the length of all eight sides.', sh.V, 'ABCDEFGH'.split(''), 'notch sides'); } },
      { id: 'e8b', level: 'EMG', make: function (r, sh) {
        var P = perimOf(sh.V);
        return numPart('Determine the perimeter of the deck.', P, function (v) { if (v === 2 * (sh.W + sh.H)) return { code: 'u6l2-notch', hint: 'That is the perimeter of the rectangle around the deck. Walk all eight sides — including the inside of the notch.' }; if (v === sh.W * sh.H) return { code: 'u6l2-area-perim', hint: 'Perimeter is the distance around: add the eight sides.' }; return null; },
          'Add the eight sides: ' + t(sh.V.map(function (A, i) { return lenOf(A, sh.V[(i + 1) % 8]); }).join('+') + '=' + P) + ' units.', ['Add the eight side lengths from part (a).'], 'notch perimeter', 'units', [2 * (sh.W + sh.H)]);
      } },
      { id: 'e8c', level: 'EMG', make: function (r, sh) {
        var xs = sh.V.map(function (p) { return p[0]; }), ys = sh.V.map(function (p) { return p[1]; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), RP = 2 * (sh.W + sh.H);
        return numPart('The smallest rectangle that encloses the deck runs from ' + t('x=' + F(x0)) + ' to ' + t('x=' + F(x1)) + ' and from ' + t('y=' + F(y0)) + ' to ' + t('y=' + F(y1)) + '. Find that rectangle’s perimeter.', RP, perimDiag(sh.W, sh.H),
          'The rectangle is ' + t(sh.W) + ' by ' + t(sh.H) + ': ' + t('P=2(' + sh.W + ')+2(' + sh.H + ')=' + RP) + ' units.', ['Width ' + t('=|' + F(x1) + '-' + pr(x0) + '|') + ', height ' + t('=|' + F(y1) + '-' + pr(y0) + '|') + '.'], 'enclosing rectangle', 'units', [sh.W + sh.H]);
      } },
      { id: 'e8d', level: 'PRG', make: function (r, sh) {
        var P = perimOf(sh.V), RP = 2 * (sh.W + sh.H), d = sh.depth;
        return mcP(r, 'The deck’s perimeter is ' + t(P - RP) + ' units more than the rectangle’s. Why does the notch make the two answers differ?', [
          { html: 'The two sides of the notch that go <b>into</b> the deck (each ' + t(d) + ' units long) are extra; the back of the notch just replaces the piece of the outer side that was cut away. ' + t('2\\times ' + d + '=' + 2 * d) + '.', right: true },
          { html: 'Cutting out the notch removes area, so the perimeter gets smaller.', why: 'Less area doesn’t mean less perimeter: the deck’s perimeter is actually ' + t(P - RP) + ' units <b>more</b>.', code: 'area' },
          { html: 'The back of the notch is counted twice.', why: 'The back of the notch is counted once, and it replaces the piece of the outer side that was removed. The extra length comes from the two sides that run into the deck.', code: 'back' },
          { html: 'Every one of the eight sides is longer than the rectangle’s sides.', why: 'Compare piece by piece: the outer sides add up to the rectangle; only the notch’s two inside sides are extra.', code: 'all' }],
          'Going around the deck covers the whole outline of the rectangle (the back of the notch fills in the gap it left), <b>plus</b> the two sides that run into the deck, each ' + t(d) + ' units: ' + t(RP + '+2(' + d + ')=' + P) + '.', ['Compare the walk around the deck with the walk around the rectangle. What is extra?'], 'why notch');
      } }] },
    { num: '9', stem: function (sh) { return 'Five segments are described below.<br>' + sh.s.map(function (s, i) { return t('P_{' + (i + 1) + '}') + ': ' + t(P2(s[0])) + ' to ' + t(P2(s[1])); }).join('<br>'); }, shared: e9Shared, parts: [
      { id: 'e9a', level: 'BEG', make: function (r, sh) {
        var Ls = sh.s.map(function (s) { return lenOf(s[0], s[1]); });
        var p = KP.fields('Determine the length of each segment.', sh.s.map(function (s, i) { return numField(t('P_{' + (i + 1) + '}='), 'P' + (i + 1), 'units'); }), sh.s.map(function (s) { return K.number(lenOf(s[0], s[1]), hvDiag(s[0], s[1])); }), Ls.map(String),
          Ls.map(function (L, i) { return t('P_{' + (i + 1) + '}=' + L); }).join(', '), sh.s.map(function (s, i) { return lenTex('P_{' + (i + 1) + '}', s[0], s[1]); }).join('<br>'), ['Each segment is horizontal or vertical: subtract the coordinates that change.'], 'five lengths');
        p.bad = [Ls.map(function (L) { return String(L + 1); })]; return p;
      } },
      { id: 'e9b', level: 'EMG', make: function (r, sh) {
        var items = sh.s.map(function (s, i) { return { id: 'P' + (i + 1), tex: 'P_{' + (i + 1) + '}', L: lenOf(s[0], s[1]) }; }).sort(function (a, b) { return a.L - b.L; });
        return KP.order(r, 'List the segments from <b>shortest</b> to <b>longest</b>.', items.map(function (x) { return { id: x.id, tex: x.tex }; }), { first: 'shortest', last: 'longest', why: function (a, b) { return t(a.replace('P', 'P_{') + '}') + ' is longer than ' + t(b.replace('P', 'P_{') + '}') + ' — compare your lengths from (a).'; } },
          'Lengths: ' + items.map(function (x) { return t(x.tex + '=' + x.L); }).join(', ') + '. Shortest to longest: ' + items.map(function (x) { return t(x.tex); }).join(', ') + '; ' + t(items[4].tex) + ' is the longest.', ['Use your lengths from part (a).'], 'order lengths');
      } }] },

    /* ---------- Part C ---------- */
    { num: '10', section: 'Part C — Working Backwards', stem: 'One endpoint and a length are given. Because a segment can run in either direction from a known endpoint, find <b>both</b> possible positions of the other endpoint.', parts: [
      { id: 'e10a', level: 'EMG', make: function (r) { return r.chance(0.15) ? bothPart(r, 'A', [3, -2], true, 7) : bothPart(r, 'A', [r.int(-9, 9), r.int(-9, 9)], true, r.int(4, 12)); } },
      { id: 'e10b', level: 'EMG', make: function (r) { return r.chance(0.15) ? bothPart(r, 'B', [-5, 4], false, 9) : bothPart(r, 'B', [r.int(-9, 9), r.int(-9, 9)], false, r.int(4, 12)); } },
      { id: 'e10c', level: 'PRG', make: function (r) { return r.chance(0.15) ? bothPart(r, 'C', [-1, -6], true, 12) : bothPart(r, 'C', [r.int(-9, -1), r.int(-9, -1)], true, r.int(9, 18)); } },
      { id: 'e10d', level: 'PRG', make: function (r) { return r.chance(0.15) ? bothPart(r, 'D', [7, 2], false, 15) : bothPart(r, 'D', [r.int(1, 9), r.int(-5, 5)], false, r.int(9, 18)); } }] },
    { num: '11', stem: 'Now a condition is added, so only <b>one</b> answer survives.', parts: [
      { id: 'e11a', level: 'PRG', make: function (r) { return condPart(r, r.chance(0.15) ? { hor: true, known: [4, -3], L: 10, dir: -1, first: false, names: ['F', 'G'] } : { hor: true, known: [r.int(-9, 9), r.int(-9, 9)], L: r.int(4, 14), dir: sgn(r), first: false, names: ['F', 'G'] }); } },
      { id: 'e11b', level: 'PRG', make: function (r) { return condPart(r, r.chance(0.15) ? { hor: false, known: [-2, 5], L: 11, dir: 1, first: true, names: ['H', 'J'] } : { hor: false, known: [r.int(-9, 9), r.int(-9, 9)], L: r.int(4, 14), dir: sgn(r), first: true, names: ['H', 'J'] }); } },
      { id: 'e11c', level: 'PRG', make: function (r) { return condPart(r, r.chance(0.15) ? { hor: true, known: [-9, -8], L: 6, dir: -1, first: true, names: ['K', 'L'] } : { hor: true, known: [r.int(-12, -2), r.int(-9, -1)], L: r.int(4, 14), dir: sgn(r), first: true, names: ['K', 'L'] }); } }] },
    { num: '12', stem: function (sh) { return 'One side of a rectangle joins ' + t('A' + P2(sh.A)) + ' to ' + t('B' + P2(sh.B)) + ', and the rectangle’s perimeter is ' + t(sh.P) + ' units.'; },
      shared: function (r) {
        if (r.chance(0.2)) return { A: [-3, -4], B: [9, -4], P: 40, h: 8, hor: true };
        var hor = r.chance(0.7), L = r.int(5, 14), h = r.int(3, 10); if (h === L) h++;
        var a = r.int(-8, 0), k = r.int(-6, 6), A = hor ? [a, k] : [k, a], B = hor ? [a + L, k] : [k, a + L];
        return { A: A, B: B, P: 2 * (L + h), h: h, hor: hor };
      }, parts: [
        { id: 'e12a', level: 'PRG', make: function (r, sh) {
          var L = lenOf(sh.A, sh.B);
          return numPart('How long are the other two sides (the sides that meet ' + t('\\overline{AB}') + ' at a right angle)?', sh.h, function (v) {
            if (v === sh.P - 2 * L) return { code: 'u6l2-half-perim', hint: 'Those ' + t(sh.P - 2 * L) + ' units are shared by <b>two</b> equal sides. Divide by 2.' };
            if (v === sh.P / 2) return { code: 'u6l2-half-perim', hint: 'Half the perimeter is one long side plus one short side: subtract ' + t(L) + '.' };
            if (v === sh.P - L) return { code: 'u6l2-half-perim', hint: 'The perimeter has two sides of length ' + t(L) + ' — subtract both.' };
            return null;
          }, t('AB=' + L) + '. The perimeter ' + t(sh.P + '=2(' + L + ')+2h') + ', so ' + t('2h=' + (sh.P - 2 * L)) + ' and ' + t('h=' + sh.h) + '.', ['Find ' + t('AB') + ' first. Two sides of the rectangle have that length.', 'The other two sides share what is left of the perimeter equally.'], 'other side from perimeter', 'units', [sh.P - 2 * L]);
        } },
        { id: 'e12b', level: 'ADV', make: function (r, sh) {
          var i = sh.hor ? 1 : 0, h = sh.h, up = function (p, s) { var q = p.slice(); q[i] = p[i] + s * h; return q; };
          var R1 = [up(sh.B, 1), up(sh.A, 1)], R2 = [up(sh.B, -1), up(sh.A, -1)], w1 = sh.hor ? 'above' : 'to the right of', w2 = sh.hor ? 'below' : 'to the left of';
          var mk = function (target, side) { var base = K.pairs(target); return function (resp) { var res = base(resp); if (res.v !== 'wrong') return res; var other = side > 0 ? R2 : R1; if (K.pairs(other)(resp).v === 'correct') return wrong('u6l2-rect-side', 'Those are the vertices of the rectangle on the <b>other</b> side of ' + t('\\overline{AB}') + '.'); return res; }; };
          var p = KP.fields('Find the other two vertices of each possible rectangle.', [{ label: 'Rectangle ' + w1 + ' ' + t('\\overline{AB}') + ':', name: 'rectangle 1', mode: 'math', keys: 'pairs', placeholder: '(x, y), (x, y)' }, { label: 'Rectangle ' + w2 + ' ' + t('\\overline{AB}') + ':', name: 'rectangle 2', mode: 'math', keys: 'pairs', placeholder: '(x, y), (x, y)' }],
            [mk(R1, 1), mk(R2, -1)], [R1.map(function (q) { return '(' + q[0] + ', ' + q[1] + ')'; }).join(', '), R2.map(function (q) { return '(' + q[0] + ', ' + q[1] + ')'; }).join(', ')],
            w1 + ': ' + t(P2(R1[0])) + ', ' + t(P2(R1[1])) + '; ' + w2 + ': ' + t(P2(R2[0])) + ', ' + t(P2(R2[1])),
            'The other sides are ' + t(h) + ' units long and run ' + (sh.hor ? 'up or down' : 'right or left') + ' from ' + t('A') + ' and ' + t('B') + '.<br>' + (sh.hor ? 'Above' : 'Right') + ': add ' + t(h) + ' to the ' + t(sh.hor ? 'y' : 'x') + '-coordinates → ' + t(P2(R1[0])) + ' and ' + t(P2(R1[1])) + '.<br>' + (sh.hor ? 'Below' : 'Left') + ': subtract ' + t(h) + ' → ' + t(P2(R2[0])) + ' and ' + t(P2(R2[1])) + '.',
            ['The new vertices are ' + t(h) + ' units from ' + t('A') + ' and from ' + t('B') + ', at right angles to ' + t('\\overline{AB}') + '.', 'Sketch it: one rectangle on each side of ' + t('\\overline{AB}') + '.'], 'two rectangles');
          p.bad = [[p.key[1], p.key[0]]]; return p;
        } }] },
    { num: '13', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: 'e13', level: 'PRG', make: function (r) { return twoSolMC(r, 'M', 'N', 'y', r.chance(0.2) ? [7, -4, 15] : null); } }] },

    /* ---------- Part D ---------- */
    { num: '14', section: 'Part D — Error Analysis, Reasoning, and a Stretch', stem: function (sh) { return '<b>Error analysis.</b> Two students found the length of the segment with endpoints ' + t('R' + P2(sh.R)) + ' and ' + t('S' + P2(sh.S)) + '.'; },
      shared: function (r) { if (r.chance(0.2)) return { R: [-3, 7], S: [9, 7] }; var y = r.int(-9, 9) || 6, a = r.int(-9, -1), b = r.int(2, 12); if (Math.abs(y) === b - a) y = y + 1; return { R: [a, y], S: [b, y] }; }, parts: [
        { id: 'e14a', level: 'PRG', make: function (r, sh) {
          var a = sh.R[0], b = sh.S[0], L = b - a;
          return mcP(r, 'Maya wrote: “length ' + t('=' + F(a) + '-' + F(b) + '=' + F(a - b)) + ', so ' + t('RS=' + F(a - b)) + ' units.” What is her error?', [
            { html: 'She subtracted in the order that gives a negative and forgot the absolute value. A distance can’t be negative.', right: true },
            { html: 'She should have subtracted the ' + t('y') + '-coordinates.', why: 'The ' + t('y') + '-coordinates are equal — that is what makes the segment horizontal. The ' + t('x') + '’s are the right ones to subtract.', code: 'y' },
            { html: 'She should have added the coordinates: ' + t(F(a) + '+' + F(b)) + '.', why: 'The length is a difference, ' + t('|x_2-x_1|') + '. Her mistake is the sign.', code: 'add' },
            { html: 'Nothing — a segment that runs to the left has a negative length.', why: 'Lengths are never negative, whichever way the segment runs.', code: 'none' }],
            'Maya’s subtraction is fine, but ' + t(F(a) + '-' + F(b) + '=' + F(a - b)) + ' is negative and a length can’t be. Taking the absolute value: ' + t('RS=|' + F(a - b) + '|=' + L) + ' units.', ['Can two points be a negative distance apart?'], 'Maya error');
        } },
        { id: 'e14b', level: 'BEG', make: function (r, sh) { return hvLenCorrect(sh); } },
        { id: 'e14c', level: 'PRG', make: function (r, sh) {
          var y = sh.R[1];
          return mcP(r, 'Owen wrote: “the ' + t('y') + '’s are both ' + t(F(y)) + ', so ' + t('RS=' + F(y) + '-' + pr(y) + '=0') + ' units.” What is his error?', [
            { html: 'The matching ' + t('y') + '’s tell you the segment is horizontal — that is the signal to subtract the ' + t('x') + '-coordinates, which change.', right: true },
            { html: 'He should have added the ' + t('y') + '’s: ' + t(F(y) + '+' + pr(y) + '=' + F(2 * y)) + '.', why: 'The ' + t('y') + '’s don’t change along the segment, so they tell you nothing about its length.', code: 'add' },
            { html: 'He is right: two points with the same ' + t('y') + ' are at the same place.', why: 'The points have different ' + t('x') + '-coordinates, so they are at different places on the same horizontal line.', code: 'same' },
            { html: 'He should have multiplied the coordinates.', why: 'The length of a horizontal segment is ' + t('|x_2-x_1|') + '.', code: 'mult' }],
            'Equal ' + t('y') + '’s mean the segment is <b>horizontal</b>; its length comes from the ' + t('x') + '’s: ' + t('|' + sub(sh.S[0], sh.R[0]) + '|=' + (sh.S[0] - sh.R[0])) + ' units.', ['Which coordinates change from ' + t('R') + ' to ' + t('S') + '?'], 'Owen error');
        } }] },
    { num: '15', stem: '<b>Reasoning.</b>', parts: [
      { id: 'e15', level: 'PRG', make: function (r) {
        var y = r.int(-9, 9), a = r.int(-9, -1), b = r.int(2, 12), L = b - a;
        return mcP(r, 'What are the absolute value bars in ' + t('\\text{length}=|x_2-x_1|') + ' doing? (Think of the points ' + t(P2([a, y])) + ' and ' + t(P2([b, y])) + '.)', [
          { html: 'They strip off the sign and keep the size: ' + t(F(b) + '-' + pr(a) + '=' + L) + ' and ' + t(F(a) + '-' + pr(b) + '=' + F(-L)) + ', and both become ' + t(L) + '. So either order is fine, and a length is never negative.', right: true },
          { html: 'They tell you to add the two coordinates instead of subtracting.', why: 'The bars take the absolute value of the <b>difference</b>; they don’t change subtraction into addition.', code: 'add' },
          { html: 'They mean you must always subtract the smaller coordinate from the larger one, otherwise the answer is wrong.', why: 'Subtracting the other way isn’t an error — the bars fix the sign for you.', code: 'order' },
          { html: 'They are only needed when a coordinate is negative.', why: 'They are needed whenever the subtraction might come out negative, whatever the signs of the coordinates.', code: 'neg' }],
          'The bars turn the difference into a distance: subtracting in the other order only flips the sign (' + t(L) + ' or ' + t(F(-L)) + '), and the absolute value is ' + t(L) + ' either way. Two points can’t be a negative distance apart.', ['Try both orders with the example points.'], 'abs bars ' + a + ',' + b);
      } }] },
    { num: '16', stem: '<b>Reasoning.</b> Nina says: “If both endpoints have negative ' + t('x') + '-coordinates, the length must be negative too.”', parts: [
      { id: 'e16a', level: 'PRG', make: function (r) {
        var ex1 = [[-11, -4], [-3, -4]];
        var chk = function (resp) {
          resp = resp || [];
          var P = splitPt(resp[0]), Q = splitPt(resp[1]);
          if (P.empty || Q.empty) return form('empty', 'Type both endpoints and the length.');
          if (P.bad || Q.bad) return form('pt-form', 'Write each endpoint as an ordered pair, ' + t('(x,\\ y)') + '.');
          var A = [valOf(P.x), valOf(P.y)], B = [valOf(Q.x), valOf(Q.y)];
          if (![A[0], A[1], B[0], B[1]].every(isFinite)) return form('pt-form', 'Use numbers for the coordinates.');
          if (!(A[0] < 0 && B[0] < 0)) return wrong('u6l2-not-neg', 'Nina’s claim is about endpoints with <b>negative</b> ' + t('x') + '-coordinates — both of yours need ' + t('x<0') + '.');
          if (near(A[0], B[0]) && near(A[1], B[1])) return wrong('u6l2-not-hv', 'Your two endpoints are the same point. Choose two different points.');
          if (!near(A[1], B[1]) && !near(A[0], B[0])) return wrong('u6l2-not-hv', 'Make the segment horizontal (same ' + t('y') + ') or vertical (same ' + t('x') + ') so you can find its length by subtracting.');
          var L = near(A[1], B[1]) ? Math.abs(B[0] - A[0]) : Math.abs(B[1] - A[1]), lr = HW.parse.number(String(resp[2] == null ? '' : resp[2]).trim());
          if (!lr.ok) return form('empty', 'Type the length of your segment as a number.');
          if (near(lr.value, -L)) return wrong('neg-length', 'A length is never negative — which is exactly why Nina is wrong. Take the absolute value.');
          if (!near(lr.value, L)) return wrong('value', 'Check the length: subtract the coordinates that change and take the absolute value. (It should be ' + t(L) + ' for your points.)');
          return ok();
        };
        return { prompt: 'Give a counterexample: two endpoints that both have negative ' + t('x') + '-coordinates (make the segment horizontal or vertical), and the length of the segment.', input: { type: 'fields', fields: [{ label: 'First endpoint:', name: 'first endpoint', mode: 'math', keys: PTK, placeholder: 'e.g. (-4, 2)' }, { label: 'Second endpoint:', name: 'second endpoint', mode: 'math', keys: PTK, placeholder: 'e.g. (-9, 2)' }, numField('Length:', 'length', 'units')] },
          check: chk, key: ['(-11, -4)', '(-3, -4)', '8'], answer: 'Any example, e.g. ' + t(P2(ex1[0])) + ' to ' + t(P2(ex1[1])) + ': length ' + t('|-3-(-11)|=8') + ' units — positive.',
          solution: 'For example, ' + t(P2(ex1[0])) + ' to ' + t(P2(ex1[1])) + ' has length ' + t('|-3-(-11)|=|8|=8') + ' units. Both ' + t('x') + '-coordinates are negative, but the length is positive.', hints: ['Pick two points left of the ' + t('y') + '-axis with the same ' + t('y') + '-coordinate.', 'Then subtract the ' + t('x') + '’s and take the absolute value.'], text: 'counterexample',
          good: [['(-7, 2)', '(-1, 2)', '6'], ['(-4, -3)', '(-4, 5)', '8']], bad: [['(-11, -4)', '(-3, -4)', '-8'], ['(2, 1)', '(5, 1)', '3'], ['(-2, 1)', '(-5, 4)', '3']] };
      } },
      { id: 'e16b', level: 'PRG', make: function (r) {
        return mcP(r, 'What is the flaw in Nina’s thinking?', [
          { html: 'Negative coordinates only say the points are left of the ' + t('y') + '-axis. The length depends on the <b>gap</b> between them, not on which side of zero they are.', right: true },
          { html: 'There is no flaw: two negatives give a negative.', why: 'Try her claim with real points: ' + t('(-11,\\ -4)') + ' to ' + t('(-3,\\ -4)') + ' is ' + t('8') + ' units apart.', code: 'none' },
          { html: 'She should have said the length must be positive only when one coordinate is positive.', why: 'Lengths are positive whatever the signs of the coordinates.', code: 'part' },
          { html: 'Lengths can be negative, but only when the ' + t('y') + '-coordinates are negative.', why: 'A length is a distance — it is never negative.', code: 'y' }],
          'A length measures the gap between two points, and a gap is never negative. Where the points sit (left or right of the ' + t('y') + '-axis) doesn’t matter.', ['Look at your counterexample from (a).'], 'Nina flaw');
      } }] },
    { num: '17', stem: function (sh) { return 'A rectangular hockey rink is laid out on a plan with corners at ' + sh.V.map(function (p) { return t(P2(p)); }).join(', ') + ', in metres.'; },
      shared: function (r) { if (r.chance(0.2)) return { V: [[-40, -15], [60, -15], [60, 35], [-40, 35]], w: 100, h: 50, cost: 85 }; var x1 = -10 * r.int(2, 6), w = 10 * r.int(8, 12), y1 = -5 * r.int(1, 6), h = 5 * r.int(8, 12); return { V: [[x1, y1], [x1 + w, y1], [x1 + w, y1 + h], [x1, y1 + h]], w: w, h: h, cost: r.pick([65, 75, 85, 90, 95, 110, 120]) }; }, parts: [
        { id: 'e17a', level: 'EMG', make: function (r, sh) { var P = 2 * (sh.w + sh.h); return numPart('Find the perimeter of the rink.', P, perimDiag(sh.w, sh.h), 'Sides ' + t('|' + sub(sh.V[1][0], sh.V[0][0]) + '|=' + sh.w) + ' m and ' + t('|' + sub(sh.V[2][1], sh.V[1][1]) + '|=' + sh.h) + ' m, so ' + t('P=2(' + sh.w + ')+2(' + sh.h + ')=' + P) + ' m.', ['Find the length and the width by subtracting coordinates.'], 'rink perimeter', 'm', [sh.w + sh.h]); } },
        { id: 'e17b', level: 'PRG', make: function (r, sh) {
          var P = 2 * (sh.w + sh.h), C = P * sh.cost;
          var p = KP.number('Boards cost ' + t('\\$' + sh.cost) + ' per metre. Find the total cost of boards around the rink.', C, function (v) { if (v === (sh.w + sh.h) * sh.cost) return { code: 'u6l2-cost', hint: 'Use the whole perimeter (four sides).' }; if (v === P) return { code: 'u6l2-cost', hint: 'That is the perimeter. Multiply by the price per metre.' }; return null; },
            t(P + '\\times\\$' + sh.cost + '=\\$' + C) + '.', ['Cost = perimeter × price per metre.'], 'rink cost', { before: '$' });
          p.answer = t('\\$' + C); p.bad = [String((sh.w + sh.h) * sh.cost)]; return p;
        } }] },
    { num: '18', stem: function (sh) { return 'A city block is bounded by streets running from ' + t('(0,\\ 0)') + ' to ' + t('(' + sh.w + ',\\ 0)') + ', then to ' + t('(' + sh.w + ',\\ ' + sh.h + ')') + ', then to ' + t('(0,\\ ' + sh.h + ')') + ', then back to the start, in metres. A jogger runs ' + ['', 'one', 'two', 'three', 'four', 'five'][sh.n] + ' full laps around the block.'; },
      shared: function (r) { if (r.chance(0.2)) return { w: 240, h: 180, n: 3 }; return { w: 10 * r.int(15, 40), h: 10 * r.int(8, 25), n: r.int(2, 5) }; }, parts: [
        { id: 'e18a', level: 'EMG', make: function (r, sh) { var P = 2 * (sh.w + sh.h); return numPart('How long is one lap, in metres?', P, perimDiag(sh.w, sh.h), t('2(' + sh.w + ')+2(' + sh.h + ')=' + P) + ' m.', ['One lap is the perimeter of the block.'], 'one lap', 'm', [sh.w + sh.h]); } },
        { id: 'e18b', level: 'PRG', make: function (r, sh) {
          var P = 2 * (sh.w + sh.h), m = P * sh.n, km = m / 1000;
          var p = KP.number('How far does she run in total, in <b>kilometres</b>?', km, function (v) { if (near(v, m)) return { code: 'u6l2-km', hint: 'That is in metres. Divide by ' + t('1000') + ' to get kilometres.' }; if (near(v, P / 1000) || near(v, P)) return { code: 'u6l2-one-lap', hint: 'That is one lap. She runs ' + t(sh.n) + ' laps.' }; if (near(v, m / 100) || near(v, m / 10)) return { code: 'u6l2-km', hint: 'There are ' + t('1000') + ' m in a kilometre.' }; return null; },
            t(sh.n + '\\times ' + P + '=' + m) + ' m ' + t('=' + F(km)) + ' km (divide by ' + t('1000') + ').', ['Multiply one lap by the number of laps.', '1 km = 1000 m.'], 'jog km', { after: 'km' });
          p.answer = t(F(km)) + ' km'; p.bad = [String(m), String(P / 1000)]; return p;
        } }] },
    { num: '19', stem: function (sh) { return '<b>Stretch.</b> A rectangle has its sides parallel to the axes, a perimeter of ' + t(sh.P) + ' units, whole-number side lengths, and one vertex at the point ' + t(P2(sh.V)) + '. Call the width ' + t('w') + ' and the height ' + t('h') + '.'; },
      shared: function (r) { var P = r.chance(0.3) ? 30 : r.pick([18, 20, 22, 24, 26, 28, 30, 32, 34]), V = r.chance(0.3) ? [2, 3] : [r.int(-5, 5), r.int(-5, 5)]; return { P: P, V: V, s: P / 2 }; }, parts: [
        { id: 'e19a', level: 'EMG', make: function (r, sh) { return numPart('Since ' + t('2w+2h=' + sh.P) + ', what does ' + t('w+h') + ' equal?', sh.s, function (v) { if (v === sh.P) return { code: 'u6l2-sum-wh', hint: 'The perimeter has <b>two</b> widths and <b>two</b> heights. Divide by 2.' }; if (v === sh.P / 4) return { code: 'u6l2-sum-wh', hint: t('w+h') + ' is half the perimeter, not a quarter.' }; return null; },
          t('2w+2h=' + sh.P) + '; divide both sides by ' + t('2') + ': ' + t('w+h=' + sh.s) + '.', ['Divide the perimeter equation by 2.'], 'w+h', null, [sh.P]); } },
        { id: 'e19b', level: 'ADV', make: function (r, sh) { var n = sh.s - 1; return numPart('How many ordered pairs ' + t('(w,\\ h)') + ' of whole numbers work? (A ' + t('4') + '-wide, ' + t(sh.s - 4) + '-tall rectangle and a ' + t(sh.s - 4) + '-wide, ' + t('4') + '-tall one count as different pairs.)', n, function (v) { if (v === Math.floor(n / 2) || v === Math.ceil(n / 2)) return { code: 'u6l2-pairs-count', hint: 'Count the reverses too: ' + t('(1,\\ ' + (sh.s - 1) + ')') + ' and ' + t('(' + (sh.s - 1) + ',\\ 1)') + ' are different ordered pairs.' }; if (v === n + 1 || v === n + 2) return { code: 'u6l2-pairs-count', hint: 'Both sides must be at least ' + t('1') + ': ' + t('w') + ' can be ' + t('1') + ' up to ' + t(sh.s - 1) + '.' }; return null; },
          'The width can be any whole number from ' + t('1') + ' to ' + t(sh.s - 1) + ', and then ' + t('h=' + sh.s + '-w') + ': ' + t('(1,\\ ' + (sh.s - 1) + '),\\ (2,\\ ' + (sh.s - 2) + '),\\ \\ldots,\\ (' + (sh.s - 1) + ',\\ 1)') + ' — ' + t(n) + ' ordered pairs.', ['List them: ' + t('w=1') + ', ' + t('w=2') + ', … What is the largest ' + t('w') + ' can be?'], 'count pairs', null, [Math.floor(n / 2)]); } },
        { id: 'e19c', level: 'ADV', make: function (r, sh) {
          var w = Math.min(4, sh.s - 1), h = sh.s - w, V = sh.V, corner = r.pick([['bottom-left', 1, 1], ['bottom-right', -1, 1], ['top-left', 1, -1], ['top-right', -1, -1]]), sx = corner[1], sy = corner[2];
          var target = [[V[0] + sx * w, V[1]], [V[0] + sx * w, V[1] + sy * h], [V[0], V[1] + sy * h]];
          var swapWH = [[V[0] + sx * h, V[1]], [V[0] + sx * h, V[1] + sy * w], [V[0], V[1] + sy * w]];
          var p = pairsPart('Take ' + t('w=' + w) + ' and ' + t('h=' + h) + '. If ' + t(P2(V)) + ' is the <b>' + corner[0] + '</b> corner, what are the other three vertices?', target,
            [{ is: swapWH, code: 'u6l2-rect-side', hint: 'The width ' + t(w) + ' runs left–right (along ' + t('x') + ') and the height ' + t(h) + ' runs up–down (along ' + t('y') + ').' }],
            'From the ' + corner[0] + ' corner, go ' + t(w) + ' ' + (sx > 0 ? 'right' : 'left') + ' and ' + t(h) + ' ' + (sy > 0 ? 'up' : 'down') + ': ' + target.map(function (q) { return t(P2(q)); }).join(', ') + '.',
            ['If ' + t(P2(V)) + ' is the ' + corner[0] + ' corner, which way do the width and the height run from it?'], 'rectangle corner');
          return p;
        } },
        { id: 'e19d', level: 'MAS', make: function (r, sh) {
          var n = sh.s - 1, tot = 4 * n;
          return numPart('Counting every width, every height and every corner, how many different rectangles satisfy all the conditions?', tot, function (v) {
            if (v === n) return { code: 'u6l2-rect-count', hint: 'Each pair ' + t('(w,\\ h)') + ' gives more than one rectangle: ' + t(P2(sh.V)) + ' can be any of the four corners.' };
            if (v === 2 * n || v === 4 * Math.ceil(n / 2) || v === 4 * Math.floor(n / 2)) return { code: 'u6l2-rect-count', hint: 'Count all ' + t(n) + ' ordered pairs, and all four corner positions for each.' };
            if (v === 8 * n) return { code: 'u6l2-rect-count', hint: 'Check for double counting: for one ' + t('(w,\\ h)') + ', there are only four positions (the point is one of four corners).' };
            return null;
          }, 'There are ' + t(n) + ' ordered pairs ' + t('(w,\\ h)') + '. For each, ' + t(P2(sh.V)) + ' can be the bottom-left, bottom-right, top-left or top-right corner: ' + t('2') + ' choices across × ' + t('2') + ' up or down. Total ' + t(n + '\\times 2\\times 2=' + tot) + ' rectangles, all different (the width, height and position pin each one down).',
            ['Count the ordered pairs ' + t('(w,\\ h)') + ' first.', 'For each pair, in how many ways can ' + t(P2(sh.V)) + ' be a corner?'], 'count rectangles', null, [n, 2 * n]);
        } }] }
  ];

  /* Extra 4(c)/(d): halves and quarters as fractions */
  function fracLen(r, hor, fix) {
    var den = hor ? 2 : 4, a, b, k;
    if (fix) { a = fix[0]; b = fix[1]; den = fix[2]; k = fix[3]; }
    else { k = r.int(-9, 9) || -3; do { a = r.int(-15, 15); b = r.int(-15, 15); } while (a === b || a % den === 0 || b % den === 0 || Math.abs(a - b) < den || a * b > 0); }
    var fa = ex.texRat(ex.norm(a, den)), fb = ex.texRat(ex.norm(b, den)), Lr = ex.norm(Math.abs(a - b), den), Ltex = ex.texRat(Lr);
    var A = hor ? [fa, F(k)] : [F(k), fa], B = hor ? [fb, F(k)] : [F(k), fb], L = Math.abs(a - b) / den;
    var nm = hor ? ['W', 'X'] : ['Y', 'Z'];
    var p = KP.math(t(nm[0] + '\\!\\left(' + A[0] + ',\\ ' + A[1] + '\\right)') + ' to ' + t(nm[1] + '\\!\\left(' + B[0] + ',\\ ' + B[1] + '\\right)'), K.value(L, { diag: function (v) { if (near(v, -L)) return { code: 'neg-length', hint: 'A length can’t be negative.' }; if (near(v, Math.abs(Math.abs(a) - Math.abs(b)) / den) && a * b < 0) return { code: 'neg-sub', hint: 'Subtracting a negative fraction adds.' }; return null; } }), Ltex,
      'The ' + t(hor ? 'y' : 'x') + '-coordinates match, so the segment is ' + (hor ? 'horizontal' : 'vertical') + '. Length ' + t('=\\left|' + fb + '-' + (b !== a && a < 0 ? '\\left(' + fa + '\\right)' : fa) + '\\right|=\\left|' + ex.texRat(ex.norm(b - a, den)) + '\\right|=' + Ltex) + ' units.',
      ['The fractions have the same denominator: subtract the numerators.', 'A length is never negative.'], 'fraction length', { keys: 'fraction', after: 'units', placeholder: 'e.g. 9/2' });
    p.good = [String(L)]; p.bad = [String(-L)]; return p;
  }
  function hvLenCorrect(sh) {
    var L = Math.abs(sh.S[0] - sh.R[0]);
    var p = numPart('What is the correct length of ' + t('\\overline{RS}') + '?', L, hvDiag(sh.R, sh.S), hvSol(sh.R, sh.S), ['The ' + t('y') + '’s match, so subtract the ' + t('x') + '’s and take the absolute value.'], 'RS correct', 'units', [-L, 0]);
    return p;
  }

  HW.defineLesson({
    id: 'u6l2', unit: 6, num: '2', title: 'Measuring the Length of a Line Segment', outcome: 'RF3',
    blurb: 'Finding the length of a horizontal or vertical segment by subtracting coordinates.',
    questions: Q, extra: X
  });
})(window);
