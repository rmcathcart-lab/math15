/* Math 15 · Unit 5 · Lesson 6 — Domain and Range of a Relation, Part 2 (RF2)
 * Assignment 6 (u5_L06.tex, Questions 1–15) and the Lesson 6 Extra Practice (u5_EP06.tex, Questions 1–20).
 * Every part is a generator that keeps the booklet question's structure (ordered pairs with repeated values, a single
 * x-value, tables in and out of order, a constant output, rays described in words, a context with a cap) and changes
 * the numbers; the booklet's own numbers are among the possible values.
 * Answer format: Part A asks to "list" the domain and range, so a plain list ("2, 3, 5") is accepted (braces too); from
 * Part B on the booklet asks for set notation, so a correct list without braces gets a nudge (no try used). A value
 * written twice gets a nudge; order is not required (booklet: "good habit, not yet required"). Rays/inequalities are typed
 * with the keypad's ≤ < ≥ > keys; "all real numbers" is accepted for ℝ; the Extra Practice's whole-number lists use … .
 * The domain/range checker, keypad and sketch checker are the ones of u5l5.js (copied: each lesson file stands alone).
 * Conversions: "explain" → multiple choice with reasons; True/False → buttons; Q15 → a table of choices (list or
 * inequality); EP "draw on the number line" → the number-line input; EP 19 sketch → graph pad; "write an equation" → a
 * typed equation checked by its values; "write ordered pairs" → typed pairs checked for the required domain and range.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Main outcome RF2; parts that explain a restriction in a real situation are RF1. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, S = HW.sets, Dr = HW.draw;

  HW.addCodes({
    'set-repeat': 'Wrote a value twice in a list', 'set-backwards': 'Wrote the larger value first', 'dr-ray-dir': 'Wrong direction for the ray', 'dr-open-side': 'Open dot attached to the wrong bound',
    'dr-no-b': 'Forgot the constant term', 'dr-opens': 'Wrong direction for the curve', 'dr-one-value': 'Interval for a line with only one value', 'dr-swap': 'Domain and range swapped',
    'cnt-zero': 'Forgot n = 0', 'pairs-count': 'Ordered pairs with the wrong counts', 'ctx-eval': 'Substituted instead of solving', 'ctx-no-sub': 'Didn’t subtract the starting amount', 'ctx-mult': 'Multiplied instead of dividing',
    'eq-unreadable': 'Equation unreadable', 'eq-not-line': 'Not a straight line', 'rule-through': 'Graph misses a required point', 'rule-range': 'Graph has the wrong range', 'rule-domain': 'Graph has the wrong domain',
    'sk-swap': 'Sketch: domain and range swapped', 'sk-points': 'Sketch: points instead of a line for an interval', 'sk-ends': 'Sketch: wrong end dots / arrows',
    'u5l5-count-all': 'Counted repeated values', 'u5l5-not-between': 'Gave a value outside the graph’s domain', 'u5l5-in-list': 'Gave a value that is already a dot', 'u5l5-wrong-letter': 'Wrote the range with x instead of y'
  });
  HW.addPartial({ 'u5l5-not-between': 'n', 'u5l5-in-list': 'n', 'u5l5-wrong-letter': 's', 'u5l5-count-all': 'b' });

  /* ---------------- numbers ---------------- */
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nz(a, b) { return range(a, b).filter(function (x) { return x !== 0; }); }
  function uniq(a) { var s = a.slice().sort(function (x, y) { return x - y; }); return s.filter(function (x, i) { return i === 0 || Math.abs(x - s[i - 1]) > 1e-9; }); }
  function ptT(p) { return '(' + F(p[0]) + ',\\ ' + F(p[1]) + ')'; }
  function pickWhere(gen, okf) { for (var i = 0; i < 4000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('u5l5: no valid numbers'); }
  function sorted(a) { for (var i = 1; i < a.length; i++) if (a[i] < a[i - 1]) return false; return true; }
  function nn(x) { return F(x); }

  /* ---------------- sets: words, inequalities, lists ---------------- */
  function rng(v, a, b, lc, hc) { return a + (lc === false ? '<' : '\\le ') + v + (hc === false ? '<' : '\\le ') + b; }
  function lst(a) { return '\\{' + uniq(a).join(', ') + '\\}'; }
  function wordsTex(v, a, b) { return t(v) + ' can be any value from ' + t(nn(a)) + ' to ' + t(nn(b)); }
  function wordsList(v, vals) { var u = uniq(vals).map(function (x) { return t(nn(x)); }); return t(v) + ' can be ' + (u.length === 1 ? u[0] : u.slice(0, -1).join(', ') + ', or ' + u[u.length - 1]); }
  /* "x can be any value from −3 to 2" / "−3, 0, or 4" / "−5 to −1 and 2 to 5" → set notation for HW.sets.parse */
  var NUM = '(-?\\s*(?:\\\\frac\\{\\d+\\}\\{\\d+\\}|\\d+(?:\\.\\d+)?|\\.\\d+))';
  function words(resp, v) {
    var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}|\\textrm\{([^}]*)\}/g, function (m, a, b, c) { return ' ' + (a || b || c) + ' '; })
      .replace(/\\(left|right)\b\.?/g, '').replace(/\\[,;:! ]|~|\\quad|\\qquad/g, ' ').replace(/[−–—]/g, '-').replace(/\\to\b|→|->/g, ' to ').trim();
    if (!s) return { empty: true };
    if (/\\le|\\ge|\\lt|\\gt|[<>≤≥]|\\lbrace|\\\{|\{|\\mathbb|ℝ|\breal\b|\\in\b|∈|\[|\(|\\infty|∞/.test(s)) return { tex: s, notation: true };
    var low = s.toLowerCase().replace(/^\s*(domain|range|d|r)\s*[:=]\s*/, '').replace(/^\s*(the\s+)?(domain|range)\s+(is\s+)?/, '');
    var letter = null, m = /^\s*([a-z])(?![a-z])\s*(=|:)?/.exec(low);
    if (m) { letter = m[1]; low = low.slice(m[0].length); }
    low = low.replace(/\b(can|be|any|all|values?|from|is|are|the|of|numbers?|between|only)\b/g, ' ').replace(/\s+/g, ' ').trim();
    var V = letter || v || 'x';
    var pieces = low.split(/\s*(?:\band\b|\bor\b|,|;)\s*/).filter(function (p) { return p.trim(); });
    if (!pieces.length) return { bad: true };
    var reTo = new RegExp('^' + NUM + '\\s*to\\s*' + NUM + '$'), reN = new RegExp('^' + NUM + '$'), out = [], vals = [], hasTo = false, back = false;
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i].trim(), a;
      if ((a = reTo.exec(p))) {
        hasTo = true; var lo = ex.value(ex.parse(a[1].replace(/\s/g, '')).ast), hi = ex.value(ex.parse(a[2].replace(/\s/g, '')).ast);
        if (lo > hi) { back = true; var z = lo; lo = hi; hi = z; }
        out.push(nn(lo) + '\\le ' + V + '\\le ' + nn(hi));
      } else if ((a = reN.exec(p))) { var val = ex.value(ex.parse(a[1].replace(/\s/g, '')).ast); vals.push(val); out.push(V + '=' + nn(val)); }
      else return { bad: true };
    }
    var dup = vals.some(function (x, k) { return vals.some(function (y, j) { return j < k && Math.abs(x - y) < 1e-9; }); });
    if (!hasTo) return { tex: '\\{' + vals.map(nn).join(', ') + '\\}', list: true, bare: true, dup: dup, letter: letter };
    return { tex: out.join('\\cup '), back: back, letter: letter, dup: dup };
  }
  function listRaw(s) { // values of a typed brace list, in order, repeats kept
    s = String(s || '').replace(/\\(left|right)\.?/g, '').replace(/\\lbrace|\\\{/g, '{').replace(/\\rbrace|\\\}/g, '}').replace(/^\s*[a-zA-Z]\s*=\s*/, '');
    var m = /^\s*\{([^{}]*)\}\s*$/.exec(s); if (!m || /\\mid|\||:/.test(m[1])) return null;
    var out = [], ps = m[1].split(/[,;]/);
    for (var i = 0; i < ps.length; i++) { var p = ps[i].replace(/\\[,;: ]/g, '').trim(); if (!p) return null; var q = ex.parse(p); if (!q.ok) return null; out.push(ex.value(q.ast)); }
    return out;
  }
  /* a domain or range. target: set notation (−3\le x\le 2, \{1, 4\}, x\ge 2, …). o: { v, other, otherName, wrong: [{ is, code, hint }], ctx: { code: hint }, words: true (Part-1 wording in the nudges) } */
  function drChk(target, o) {
    o = o || {};
    var T = S.parse(target); if (!T.ok) throw new Error('u5l5: bad target ' + target);
    var wr = (o.wrong || []).filter(function (w) { var p = S.parse(w.is); return p.ok && !S.eq(p.set, T.set); });
    var base = K.set(target, { v: o.v, other: o.other, otherName: o.otherName, wrong: wr, tag: false });
    var eg = o.words ? '“' + t('-3') + ' to ' + t('2') + '” (an unbroken graph) or “' + t('-3,\\ 0,\\ 4') + '” (separate dots)' : t('-3\\le ' + (o.v || 'x') + '\\le 2') + ' or a list ' + t('\\{-3,\\ 0,\\ 4\\}');
    return function (resp) {
      var w = words(resp, o.v);
      if (w.empty) return form('empty', 'Type the ' + (o.name || 'answer') + ' first.');
      if (w.bad) return form('set-unreadable', 'I can’t read that. Write it like ' + eg + '.');
      var P = S.parse(w.tex);
      if (!P.ok) return form('set-' + (P.why || 'unreadable'), P.why === 'backwards' ? 'Your inequality runs backwards — write the smaller number first (on the left).' : P.why === 'no-braces' ? 'Put a list of values inside braces, e.g. ' + t('\\{-3,\\ 0,\\ 4\\}') + '.' : 'I can’t read that. Write it like ' + eg + '.');
      var r = base(w.tex);
      if (r.v === 'correct' && o.braces && w.bare && (S.parse(target).set.kind === 'list')) return form('set-no-braces', 'Right values — now write them in <b>set notation</b>: inside curly braces, e.g. ' + t('\\{2,\\ 4,\\ 9\\}') + '.');
      if (r.v === 'correct') {
        if (w.back) return form('set-backwards', 'Right values — write the smaller one first: from the lowest value <b>to</b> the highest.');
        var L = w.list ? null : listRaw(w.tex);
        if (w.dup || (L && L.some(function (x, i) { return L.some(function (y, j) { return j < i && Math.abs(x - y) < 1e-9; }); }))) return form('set-repeat', 'Right values — but write each value <b>only once</b>, even when several dots share it.');
        return r;
      }
      if (r.v === 'form' && r.code === 'set-letter' && o.letterWrong) return wrong('u5l5-wrong-letter', o.letterWrong);
      if (r.v === 'wrong' && o.ctx && o.ctx[r.code]) return wrong(r.code, o.ctx[r.code]);
      if (r.v === 'wrong' && o.words && r.code === 'set-continuous') return wrong(r.code, 'The graph is unbroken, so every value in between is used too: write it as “from … to …”, e.g. “' + t('-3') + ' to ' + t('2') + '”.');
      if (r.v === 'wrong' && o.words && r.code === 'set-discrete') return wrong(r.code, 'The graph is separate dots, so only the dots’ values are used: list them, e.g. “' + t('-3,\\ 0,\\ 4') + '”.');
      if (r.v === 'wrong' && o.words && r.code === 'set-endpoint') return wrong('set-values', 'Check the end values: read the ' + (o.name === 'range' ? 'lowest and highest points' : 'leftmost and rightmost points') + ' again.');
      return r;
    };
  }
  function keyOf(target, v, wordsMode) { // a key the checker accepts, in the lesson's own format
    if (!wordsMode) return target;
    var P = S.parse(target).set;
    if (P.kind === 'list') return P.vals.map(nn).join(', ');
    return P.parts.map(function (p) { return p.lo === p.hi ? nn(p.lo) : nn(p.lo) + ' \\text{ to } ' + nn(p.hi); }).join(' \\text{ and } ');
  }
  function ansOf(target, v, wordsMode) {
    var P = S.parse(target).set;
    if (P.kind === 'int' && P.parts.length === 1 && P.parts[0].lo === -Infinity && P.parts[0].hi === Infinity) return 'all real numbers';
    if (!wordsMode) return t(target);
    if (P.kind === 'list') return wordsList(v, P.vals);
    if (P.parts.length === 1) return wordsTex(v, P.parts[0].lo, P.parts[0].hi);
    return t(target);
  }
  var KEYS = 'u5drw';
  if (HW.widgets && HW.widgets.KEYSETS && !HW.widgets.KEYSETS[KEYS]) {
    HW.widgets.KEYSETS[KEYS] = function (opt) {
      var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
      var vs = (opt && opt.vars && opt.vars.length ? opt.vars : ['x', 'y']).slice(0, 2).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; });
      return [[d(7), d(8), d(9), { label: 'to', tex: '\\text{ to }', plain: ' to ', title: 'from … to …' }, { label: '≤', tex: '\\le ', plain: ' <= ' }, { label: '<', tex: '<', plain: ' < ' }, { label: '⌫', fn: 'del', title: 'Delete' }],
        [d(4), d(5), d(6), { label: ',', tex: ',', plain: ', ' }, { label: '≥', tex: '\\ge ', plain: ' >= ' }, { label: '>', tex: '>', plain: ' > ' }, { label: 'clear', fn: 'clear' }],
        [d(1), d(2), d(3), { label: 'or', tex: '\\text{ or }', plain: ' or ' }, { label: '{ }', tex: '\\left\\lbrace #0\\right\\rbrace', plain: '{', title: 'Braces' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (out of the braces)' }],
        [d(0), { label: '.', tex: '.', plain: '.' }, { label: '−', tex: '-', plain: '-' }].concat(vs, [{ label: '=', tex: '=', plain: ' = ' }, { label: '…', tex: '\\ldots ', plain: '...', title: 'and so on' }, { label: 'Check ↵', fn: 'enter', wide: true }])];
    };
    if (HW.widgets.KEYHELP) HW.widgets.KEYHELP[KEYS] = ['An unbroken graph: from the smallest value <b>to</b> the largest, e.g. ' + HW.k('-3') + ' <b>to</b> ' + HW.k('2') + ' (or ' + HW.k('-3\\le x\\le 2') + '). Separate dots: a list, e.g. ' + HW.k('-3,\\ 0,\\ 4') + '.',
      'Type e.g. <code>-3 to 2</code>, <code>-3 &lt;= x &lt;= 2</code> or a list <code>-3, 0, 4</code>.'];
  }
  /* one part with two boxes (Domain, Range). o: { dv, rv, words, dW, rW, dC, rC, good, bad } */
  function drPart(prompt, Dt, Rt, o, sol, hints, text) {
    o = o || {}; var dv = o.dv || 'x', rv = o.rv || 'y', wm = !!o.words;
    var ph = wm ? 'e.g. -3 to 2   or   -3, 0, 4' : 'e.g. -3 <= ' + dv + ' <= 2';
    var fl = [{ label: o.label || 'Domain', name: o.label || 'Domain', mode: 'math', keys: KEYS, vars: [dv, rv], placeholder: ph, wide: true }, { label: o.label || 'Range', name: o.label || 'Range', mode: 'math', keys: KEYS, vars: [dv, rv], placeholder: wm ? ph : 'e.g. -1 < ' + rv + ' <= 4', wide: true }];
    if (o.only) fl = fl.filter(function (f, i) { return o.only === (i ? 'R' : 'D'); });
    var cD = drChk(Dt, { v: dv, other: o.noOther ? null : Rt, otherName: 'range', wrong: o.dW, ctx: o.dC, words: wm, name: 'domain', braces: o.braces }), cR = drChk(Rt, { v: rv, other: o.noOther ? null : Dt, otherName: 'domain', wrong: o.rW, ctx: o.rC, words: wm, name: 'range', letterWrong: o.letterWrong, braces: o.braces });
    var kD = keyOf(Dt, dv, wm), kR = keyOf(Rt, rv, wm);
    var aD = (o.label ? '' : wm ? 'Domain: ' : t('D:') + ' ') + ansOf(Dt, dv, wm), aR = (wm ? 'Range: ' : t('R:') + ' ') + ansOf(Rt, rv, wm);
    var checks = o.only === 'D' ? [cD] : o.only === 'R' ? [cR] : [cD, cR], keys = o.only === 'D' ? [kD] : o.only === 'R' ? [kR] : [kD, kR];
    var p = B.fields(prompt, fl, checks, keys, o.only === 'D' ? aD : o.only === 'R' ? aR : aD + '<br>' + aR, sol, hints, text);
    var Dp = S.parse(Dt).set, Rp = S.parse(Rt).set, bad = [], good = [];
    var pick = function (d, r) { return o.only === 'D' ? [d] : o.only === 'R' ? [r] : [d, r]; };
    good.push(pick(Dt, Rt));
    if (!S.eq(Dp, Rp) && !o.only) bad.push([Rt, Dt]);
    (o.dW || []).forEach(function (w) { var q = S.parse(w.is); if (q.ok && !S.eq(q.set, Dp) && o.only !== 'R') bad.push(pick(w.is, Rt)); });
    (o.rW || []).forEach(function (w) { var q = S.parse(w.is); if (q.ok && !S.eq(q.set, Rp) && o.only !== 'D') bad.push(pick(Dt, w.is)); });
    p.good = good.concat(o.good || []); p.bad = bad.concat(o.bad || []);
    return p;
  }

  /* ---------------- graphs ---------------- */
  /* monotone cubic through lattice points (no overshoot: the highest and lowest points are knots) */
  function mono(P) {
    var n = P.length, d = [], m = [], i;
    for (i = 0; i < n - 1; i++) d.push((P[i + 1][1] - P[i][1]) / (P[i + 1][0] - P[i][0]));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      var a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (a < 0) m[i] = 0; if (b < 0) m[i + 1] = 0;
      if (s > 9) { var tau = 3 / Math.sqrt(s); m[i] = tau * a * d[i]; m[i + 1] = tau * b * d[i]; }
    }
    return function (x) {
      var k = 0; while (k < n - 2 && x > P[k + 1][0]) k++;
      var h = P[k + 1][0] - P[k][0], u = (x - P[k][0]) / h, u2 = u * u, u3 = u2 * u;
      return (2 * u3 - 3 * u2 + 1) * P[k][1] + (u3 - 2 * u2 + u) * h * m[k] + (-2 * u3 + 3 * u2) * P[k + 1][1] + (u3 - u2) * h * m[k + 1];
    };
  }
  function win(pts, pad) {
    pad = pad == null ? 1 : pad;
    var xs = pts.map(function (p) { return p[0]; }).concat([0]), ys = pts.map(function (p) { return p[1]; }).concat([0]);
    var X = [Math.min.apply(null, xs) - pad, Math.max.apply(null, xs) + pad], Y = [Math.min.apply(null, ys) - pad, Math.max.apply(null, ys) + pad];
    while (X[1] - X[0] < 6) { X[0]--; X[1]++; } while (Y[1] - Y[0] < 6) { Y[0]--; Y[1]++; }
    return { x: X, y: Y };
  }
  function G(spec, pts) { var w = win(pts); return HW.graph(Object.assign({ x: w.x, y: w.y, labels: 1, max: 280 }, spec)); }
  function Gfix(spec) { return HW.graph(Object.assign({ x: [-6, 6], y: [-6, 6], labels: 1, max: 280 }, spec)); }
  function curveG(P) { return G({ fns: [{ f: mono(P), from: P[0][0], to: P[P.length - 1][0], start: 'closed', end: 'closed' }] }, P); }
  function segG(A, Bp, sA, sB) { return G({ segs: [{ pts: [A, Bp], start: sA || 'closed', end: sB || 'closed' }] }, [A, Bp]); }
  function dotsG(P) { return G({ points: P.map(function (p) { return { x: p[0], y: p[1] }; }) }, P); }
  function ext(P, k) { var v = P.map(function (p) { return p[k]; }); return [Math.min.apply(null, v), Math.max.apply(null, v)]; }

  var HD = 'The <b>domain</b> is every ' + t('x') + '-value the graph uses: go from its leftmost point to its rightmost point.';
  var HR = 'The <b>range</b> is every ' + t('y') + '-value the graph uses: go from its lowest point to its highest point.';
  var HWHOLE = 'Scan the <b>whole</b> graph, not just its two ends: the highest or lowest point can be in the middle.';
  var HLIST = 'Separate dots: list the values of the dots only (each value once).';

  var SK_HELP = 'Use <b>╱ Line</b> to draw (tap each end), <b>●○ Ends</b> to make an end solid, open or an arrow, and <b>● Point</b> for separate points.';
  var PAD = { x: [-6, 6], y: [-6, 6], labels: 1 };
  function isPt(p) { return Math.abs(p.lo - p.hi) < 1e-9; }
  function seg(a, b, s, e) { return { v: [a, b], s: s || 'closed', e: e || 'closed' }; }
  function drw(pieces, pts) { return { pts: pts || [], pieces: pieces || [], join: 'none' }; }
  function bndHint(got, want, v) { // what is wrong with the ends when the extremes are right
    if (got.length !== want.length) return null;
    var nm = v === 'x' ? 'domain' : 'range';
    for (var i = 0; i < want.length; i++) { var q = want[i], p = got[i]; if (isPt(q) !== isPt(p)) return null; if (!(Math.abs(q.lo - p.lo) < 1e-9 && Math.abs(q.hi - p.hi) < 1e-9)) return null; }
    for (var k = 0; k < want.length; k++) {
      var a = want[k], b = got[k];
      if (isFinite(a.lo) && a.lc !== b.lc) return 'Your graph reaches the right values — now fix the end dots: ' + t(v + '=' + a.lo) + ' must be ' + (a.lc ? '<b>included</b> (a solid dot)' : '<b>excluded</b> (an open circle)') + ' in the ' + nm + '.';
      if (isFinite(a.hi) && a.hc !== b.hc) return 'Your graph reaches the right values — now fix the end dots: ' + t(v + '=' + a.hi) + ' must be ' + (a.hc ? '<b>included</b> (a solid dot)' : '<b>excluded</b> (an open circle)') + ' in the ' + nm + '.';
    }
    return null;
  }
  function sketchChk(rules, extra) {
    var base = K.graphRules(rules);
    var dP = rules.domain ? Dr.setParts(S.parse(rules.domain).set) : null, rP = rules.range ? Dr.setParts(S.parse(rules.range).set) : null;
    return function (resp) {
      var res = base(resp); if (res.v !== 'wrong') return res;
      var v = Dr.norm(resp), dd = Dr.domain(v).parts, rr = Dr.range(v).parts, h;
      if (extra) { h = extra(v, res, dd, rr); if (h) return wrong(h.code, h.hint); }
      if (dP && rP && !Dr.partsSame(dP, rP) && Dr.partsSame(dd, rP) && Dr.partsSame(rr, dP)) return wrong('sk-swap', 'Your graph has the domain and range swapped. The <b>domain</b> is read along the ' + t('x') + '-axis, the <b>range</b> along the ' + t('y') + '-axis.');
      if (dP && !dP.every(isPt) && !v.pieces.length && v.join === 'none') return wrong('sk-points', 'Separate points only give a list of ' + t('x') + '-values. This domain has no gaps, so draw a <b>line</b> (╱ Line).');
      if (res.code === 'rule-domain' && dP) { h = bndHint(dd, dP, 'x'); if (h) return wrong('sk-ends', h); }
      if (res.code === 'rule-range' && rP) { h = bndHint(rr, rP, 'y'); if (h) return wrong('sk-ends', h); }
      return res;
    };
  }
  function sketchPart(prompt, rules, key, bads, sol, hints, text, extra, exact) {
    var p = B.graph(prompt + '<div class="muted">' + (exact ? '' : 'Many different drawings are right. ') + SK_HELP + '</div>', Object.assign({}, PAD), sketchChk(rules, extra), key, sol, hints, text);
    if (!exact) p.answer = 'One possible answer:' + p.answer;
    p.bad = (bads || []).filter(function (b) { return !Dr.same(b, key); });
    return p;
  }

  /* ---------------- L6 helpers ---------------- */
  function ptsH(P) { return P.map(function (p) { return t(ptT(p)); }).join(', '); }
  function tabH(xs, ys, xn, yn) { return HW.valueTable([[t(xn || 'x')].concat(xs.map(function (x) { return t(nn(x)); })), [t(yn || 'y')].concat(ys.map(function (y) { return t(nn(y)); }))]); }
  function shuffleUnsorted(r, arr, key) { var s = r.shuffle(arr); for (var g = 0; g < 20 && sorted(s.map(key)); g++) s = r.shuffle(arr); return s; }
  var ALLX = 'x\\in\\mathbb{R}', ALLY = 'y\\in\\mathbb{R}';
  var HPAIRS = 'The <b>domain</b> is every first coordinate (' + t('x') + '); the <b>range</b> is every second coordinate (' + t('y') + ').';
  var HONCE = 'Write a repeated value only <b>once</b>.';
  var HSET = 'Set notation: the values inside curly braces, e.g. ' + t('\\{2,\\ 4,\\ 9\\}') + '.';
  /* domain and range of ordered pairs / a table. o: { words, braces, text, solPre, xn, yn } */
  function pairsDR(prompt, P, o) {
    o = o || {}; var xs = P.map(function (p) { return p[0]; }), ys = P.map(function (p) { return p[1]; }), D = lst(xs), R = lst(ys), dv = o.xn || 'x', rv = o.yn || 'y';
    var rep = function (a) { return uniq(a).length < a.length; };
    var sol = (o.solPre || '') + 'First coordinates: ' + t(xs.map(nn).join(',\\ ')) + (rep(xs) ? ' — the repeated value is written once' : '') + '.<br>Second coordinates: ' + t(ys.map(nn).join(',\\ ')) + (rep(ys) ? ' — repeated values are written once' : '') + '.<br>' + t('D=' + D) + ', ' + t('R=' + R) + '.';
    var bad = [];
    if (rep(ys)) bad.push(o.words ? [keyOf(D, dv, true), ys.map(nn).join(', ')] : [D, '\\{' + ys.map(nn).join(', ') + '\\}']);
    if (uniq(xs).length > 1) bad.push([o.words ? uniq(xs).slice(1).map(nn).join(', ') : lst(uniq(xs).slice(1)), o.words ? keyOf(R, rv, true) : R]);
    return drPart(prompt, D, R, { words: !!o.words, braces: !!o.braces, dv: dv, rv: rv, bad: bad,
      dC: { 'set-continuous': 'Only the listed ' + t(dv) + '-values are used — list them, don’t write “from … to …”.' }, rC: { 'set-continuous': 'Only the listed ' + t(rv) + '-values are used — list them.' } },
      sol, [HPAIRS, HONCE], o.text || 'D and R of pairs');
  }
  function oneSet(prompt, target, v, o, sol, hints, text) { // a single domain or range box
    o = o || {}; var isD = o.which !== 'R';
    var other = o.other || (isD ? 'y\\in\\mathbb{R}' : 'x\\in\\mathbb{R}');
    return drPart(prompt, isD ? target : other, isD ? other : target, Object.assign({ only: isD ? 'D' : 'R', dv: isD ? v : 'x', rv: isD ? 'y' : v, noOther: !o.other }, o), sol, hints, text);
  }
  function mc(r, prompt, opts, sol, hints, text, keep) { return B.mc(r, prompt, opts, sol, hints, text, keep); }
  function tablePart(prompt, xs, f, sol, hints, text, xn, yn) {
    var fields = xs.map(function (x) { return { name: t((xn || 'x') + '=' + nn(x)), label: t((xn || 'x') + '=' + nn(x)), before: t((yn || 'y') + '=') }; });
    var checks = xs.map(function (x) { return K.number(Math.round(f(x) * 1e6) / 1e6, null); });
    return B.fields(prompt, fields, checks, xs.map(function (x) { return String(Math.round(f(x) * 1e6) / 1e6); }), tabH(xs, xs.map(f), xn, yn), sol, hints, text);
  }
  function numPart(prompt, ans, dl, sol, hints, text, inp) {
    dl = (dl || []).filter(function (d) { return Math.abs(d[0] - ans) > 1e-9; });
    var p = B.number(prompt, ans, function (v) { for (var i = 0; i < dl.length; i++) if (Math.abs(v - dl[i][0]) < 1e-9) return { code: dl[i][1], hint: dl[i][2] }; return null; }, sol, hints, text, inp);
    p.bad = dl.map(function (d) { return String(d[0]); });
    return p;
  }
  /* y = f(x) typed as an equation: returns f or null */
  function fnOf(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(left|right)\b\.?/g, '').replace(/\\cdot|\\times/g, '*').trim(), parts = s.split('=');
    if (parts.length !== 2 || !/^\s*y\s*$/.test(parts[0])) return null;
    var R = ex.parse(parts[1].trim()); if (!R.ok) return null;
    return function (x) { try { return ex.value(R.ast, { x: x }); } catch (e) { return NaN; } };
  }
  var EQK6 = 'u5l6eq';
  if (HW.widgets && HW.widgets.KEYSETS && !HW.widgets.KEYSETS[EQK6]) {
    var dd = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    HW.widgets.KEYSETS[EQK6] = [[dd(7), dd(8), dd(9), { label: '<i>x</i>', tex: 'x', plain: 'x' }, { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dd(4), dd(5), dd(6), { label: '<i>y</i>', tex: 'y', plain: 'y' }, { label: 'x²', tex: '^2', plain: '^2' }, { label: 'clear', fn: 'clear' }],
      [dd(1), dd(2), dd(3), { label: '=', tex: '=', plain: '=' }, { label: '( )', tex: '\\left(#0\\right)', plain: '(' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right' }],
      [dd(0), { label: '.', tex: '.', plain: '.' }, { label: '−', tex: '-', plain: '-' }, { label: '+', tex: '+', plain: '+' }, { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    if (HW.widgets.KEYHELP) HW.widgets.KEYHELP[EQK6] = ['Type the whole equation, starting with ' + HW.k('y=') + ', e.g. ' + HW.k('y=3-x') + '.', 'Type e.g. <code>y = 3 - x</code>.'];
  }
  function eqPart(prompt, check, key, sol, hints, text, bad) {
    return { prompt: prompt, input: { type: 'math', keys: HW.widgets && HW.widgets.KEYSETS && HW.widgets.KEYSETS[EQK6] ? EQK6 : 'expr', placeholder: 'e.g. y = 3 - x' }, check: check, key: key, answer: t(key) + ' (one possible answer)', solution: sol, hints: hints || [], text: text, bad: bad || [] };
  }
  function pairsIn(resp) { // ordered pairs typed in a box
    var s = String(resp || '').replace(/\\(left|right)\.?/g, '').replace(/\\lbrace|\\rbrace|\\\{|\\\}|[{}]/g, ' ');
    if (!s.trim()) return { empty: true };
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) { var xy = m[1].split(','); if (xy.length !== 2) return { bad: true }; var a = ex.parse(xy[0].trim()), b = ex.parse(xy[1].trim()); if (!a.ok || !b.ok) return { bad: true }; out.push([ex.value(a.ast), ex.value(b.ast)]); }
    if (s.replace(re, '').replace(/[,\s]|\\[,;: ]/g, '').length || !out.length) return { bad: true };
    return { pairs: out };
  }
  function pairsField(name) { return { name: name, label: name, mode: 'math', keys: 'pairs', wide: true, placeholder: 'e.g. (1, 3), (2, 4)' }; }
  function nlSvg(lo, hi, value) { return Dr.numlineSvg({ min: lo, max: hi, step: 1 }, value); }

  HW.defineLesson({
    id: 'u5l6', unit: 5, num: 6, title: 'Domain and Range of a Relation, Part 2', outcome: 'RF2',
    blurb: 'Domain and range from ordered pairs and tables (each value once), written in set notation — a list in braces, or an inequality for a relation that never ends.',
    questions: [
      { num: '1', section: 'Part A — Ordered Pairs and Tables', stem: 'Fill in each blank.', parts: [
        { id: '1a', level: 'LIM', make: function (r) {
          return mc(r, 'The domain of a relation is the set of all ________ values.', [{ html: 'input', right: true }, { html: 'output', why: 'The outputs make up the <b>range</b>. The domain is what goes in.' }, { html: 'positive', why: 'A domain can include negative values. Which values does it collect — the ones going in, or coming out?' }, { html: 'repeated', why: 'Repeats are written once. Which values does the domain collect?' }],
            'The domain is the set of all <b>input</b> values (the ' + t('x') + '-values).', [HPAIRS], 'domain = inputs');
        } },
        { id: '1b', level: 'LIM', make: function (r) {
          return mc(r, 'The range of a relation is the set of all ________ values.', [{ html: 'output', right: true }, { html: 'input', why: 'The inputs make up the <b>domain</b>. The range is what comes out.' }, { html: 'negative', why: 'A range can include any values. Which values does it collect?' }, { html: 'largest', why: 'The range collects every value of one kind, not just the largest.' }],
            'The range is the set of all <b>output</b> values (the ' + t('y') + '-values).', [HPAIRS], 'range = outputs');
        } },
        { id: '1c', level: 'LIM', make: function (r) {
          return mc(r, 'In ' + t('(x,\\ y)') + ', the domain value is the ________-coordinate.', [{ html: t('x'), right: true }, { html: t('y'), why: 'The ' + t('y') + '-coordinate (second) is the range value.' }], 'The first coordinate, ' + t('x') + ', is the domain value.', [HPAIRS], 'domain coordinate', true);
        } },
        { id: '1d', level: 'LIM', make: function (r) {
          return mc(r, 'In ' + t('(x,\\ y)') + ', the range value is the ________-coordinate.', [{ html: t('x'), why: 'The ' + t('x') + '-coordinate (first) is the domain value.' }, { html: t('y'), right: true }], 'The second coordinate, ' + t('y') + ', is the range value.', [HPAIRS], 'range coordinate', true);
        } }] },
      { num: '2', stem: 'List the domain and range of each set of ordered pairs.', parts: [
        { id: '2a', level: 'BEG', make: function (r) {
          var P;
          if (r.chance(0.25)) P = [[2, 6], [3, 6], [5, 9], [7, 1]];
          else { var xs = r.sample(range(-3, 9), 4).sort(function (a, b) { return a - b; }), v = r.sample(range(-2, 12), 3), ys = r.shuffle([v[0], v[0], v[1], v[2]]); P = xs.map(function (x, i) { return [x, ys[i]]; }); }
          return pairsDR(ptsH(P), P, { words: true, text: 'pairs, repeated y' });
        } },
        { id: '2b', level: 'BEG', make: function (r) {
          var c = r.chance(0.25) ? -4 : r.pick(nz(-8, 8)), ys = r.chance(0.25) && c === -4 ? [3, 7, 0] : r.sample(range(-3, 10), 3), P = ys.map(function (y) { return [c, y]; });
          var p = pairsDR(ptsH(P), P, { words: true, text: 'pairs, one x' }); p.hints = ['Every pair has the same first coordinate — how many different ' + t('x') + '-values is that?', HONCE]; return p;
        } }] },
      { num: '3', stem: 'State the domain and range of each relation given by a table of values.', parts: [
        { id: '3a', level: 'BEG', make: function (r) {
          var o = r.chance(0.25) ? [-2, -2, 5] : [r.int(-3, 0), r.pick([-2, -3, 2, 3, -1]), r.int(-4, 8)], xs = range(o[0], o[0] + 4), P = xs.map(function (x) { return [x, o[1] * x + o[2]]; });
          return pairsDR(tabH(xs, P.map(function (p) { return p[1]; })), P, { words: true, solPre: 'Top row = domain, bottom row = range. ', text: 'table linear' });
        } },
        { id: '3b', level: 'BEG', make: function (r) {
          var o = r.chance(0.25) ? [0, 2, 8, 3] : [r.int(-4, 1), r.pick([1, 2, 3]), r.int(-5, 9), r.int(-5, 9)];
          if (o[2] === o[3]) o[3] = o[2] + 4;
          var xs = range(0, 3).map(function (k) { return o[0] + k * o[1]; }), P = xs.map(function (x, k) { return [x, k % 2 ? o[3] : o[2]]; });
          return pairsDR(tabH(xs, P.map(function (p) { return p[1]; })), P, { words: true, solPre: 'Top row = domain, bottom row = range. ', text: 'table repeating y' });
        } }] },
      { num: '4', stem: 'State the domain and range of the relation below. Notice the ' + t('x') + '-values are not listed in order.', parts: [
        { id: '4', level: 'EMG', make: function (r) {
          var xs = r.chance(0.25) ? [3, -1, 4, 0, 2] : shuffleUnsorted(r, r.sample(range(-3, 5), 5), function (x) { return x; }), kind = r.chance(0.6), P = xs.map(function (x) { return [x, kind ? x * x : 2 * x + 1]; });
          if (xs.join() === '3,-1,4,0,2') P = xs.map(function (x) { return [x, x * x]; });
          return pairsDR(tabH(xs, P.map(function (p) { return p[1]; })), P, { words: true, solPre: 'Read every column; the order doesn’t matter. ', text: 'unordered table' });
        } }] },
      { num: '5', stem: function () { return ''; }, parts: [
        { id: '5', level: 'EMG', make: function (r) {
          var v = r.chance(0.25) ? [4, 9, 2] : r.sample(nz(-6, 12), 3), xs = r.chance(0.25) && v[0] === 4 ? [4, 4, 4, 9, 9, 2] : r.shuffle([v[0], v[0], v[0], v[1], v[1], v[2]]);
          return oneSet('Suppose the ' + t('x') + '-coordinates of the ordered pairs in a relation are ' + t(xs.map(nn).join(',\\ ')) + '. Write the domain of this relation using proper set notation.', lst(xs), 'x', { braces: true, bad: [['\\{' + xs.map(nn).join(', ') + '\\}']] },
            'Each value is written once, inside braces: ' + t('D=' + lst(xs)) + '.', [HONCE, HSET], 'domain from x list');
        } }] },
      { num: '6', section: 'Part B — Set Notation and Inequalities', stem: 'Write the domain and range, using set notation, of the ordered pairs below.', parts: [
        { id: '6', level: 'EMG', make: function (r) {
          var c = r.chance(0.25) ? 5 : r.pick(nz(-7, 9)), ys = r.chance(0.25) && c === 5 ? [2, 9, -3, 0] : shuffleUnsorted(r, r.sample(range(-5, 10), 4), function (y) { return y; }), P = ys.map(function (y) { return [c, y]; });
          return pairsDR(ptsH(P), P, { braces: true, text: 'set notation, one x' });
        } }] },
      { num: '7', stem: 'Write the domain and range, using set notation, of the relation given by the table.', parts: [
        { id: '7', level: 'EMG', make: function (r) {
          var o = r.chance(0.25) ? [10, 10, 100] : [r.pick([1, 2, 5, 10, 3]), r.pick([1, 2, 5, 10, 4]), r.pick([-7, 3, 12, 50, 100, -2, 25])], xs = range(0, 4).map(function (k) { return o[0] + k * o[1]; }), P = xs.map(function (x) { return [x, o[2]]; });
          var p = pairsDR(tabH(xs, P.map(function (p2) { return p2[1]; })), P, { braces: true, text: 'constant table' });
          p.hints = ['Every ' + t('y') + ' is the same number. How many different outputs is that?', HSET]; return p;
        } }] },
      { num: '8', stem: 'Each description is part of a graph that continues forever in one direction, like the graphs from Lesson 5. Write the indicated set using an inequality.', parts: [
        { id: '8a', level: 'EMG', make: function (r) {
          var k = r.chance(0.25) ? 4 : r.pick(nz(-10, 12));
          return oneSet('(a) A ray rises forever to the upper right, with an arrow at the end. Every ' + t('y') + '-value on the ray is ' + t(k) + ' or greater. Write the <b>range</b>.', 'y\\ge ' + k, 'y', { which: 'R', rW: [{ is: 'y>' + k, code: 'set-endpoint', hint: '“' + t(k) + ' or greater” includes ' + t(k) + ' itself: use ' + t('\\ge') + '.' }, { is: 'y\\le ' + k, code: 'dr-ray-dir', hint: '“Or greater” means ' + t('y') + ' is at least ' + t(k) + ': ' + t('y\\ge ' + k) + '.' }] },
            '“' + t(k) + ' or greater” is ' + t('y\\ge ' + k) + '.', ['“Or greater” → ' + t('\\ge') + '; “or less” → ' + t('\\le') + '.'], 'range y>=k');
        } },
        { id: '8b', level: 'EMG', make: function (r) {
          var k = r.chance(0.25) ? 6 : r.pick(nz(-10, 12));
          return oneSet('(b) A ray extends forever to the left, with an arrow at the end. Every ' + t('x') + '-value on the ray is ' + t(k) + ' or less. Write the <b>domain</b>.', 'x\\le ' + k, 'x', { dW: [{ is: 'x<' + k, code: 'set-endpoint', hint: '“' + t(k) + ' or less” includes ' + t(k) + ': use ' + t('\\le') + '.' }, { is: 'x\\ge ' + k, code: 'dr-ray-dir', hint: '“Or less” means ' + t('x') + ' is at most ' + t(k) + '.' }] },
            '“' + t(k) + ' or less” is ' + t('x\\le ' + k) + '.', ['“Or less” → ' + t('\\le') + '.'], 'domain x<=k');
        } }] },
      { num: '9', section: 'Part C — Combining Representations and Applications', stem: 'State the domain and range, using set notation, of the relation shown in the graph.', parts: [
        { id: '9', level: 'EMG', make: function (r) {
          var P;
          if (r.chance(0.25)) P = [[-5, -2], [-2, 3], [0, 3], [2, -1], [4, 6]];
          else { var xs = r.sample(range(-5, 5), 5).sort(function (a, b) { return a - b; }), v = r.sample(range(-5, 6), 4), ys = r.shuffle(v.concat([v[1]])); P = xs.map(function (x, i) { return [x, ys[i]]; }); }
          var w = win(P);
          return pairsDR(HW.graph({ x: w.x, y: w.y, labels: 1, max: 280, points: P.map(function (p) { return { x: p[0], y: p[1] }; }) }), P, { braces: true, solPre: 'The dots are ' + ptsH(P) + '.<br>', text: 'graph dots set notation' });
        } }] },
      { num: '10', stem: 'Determine the domain and range of each relation, writing your answers in set notation.', parts: [
        { id: '10a', sub: 'a', level: 'EMG', make: function (r) {
          var P = r.chance(0.25) ? [[1, 10], [2, 20], [3, 10], [4, 40]] : (function () { var s = r.pick([1, 2, 3, 5]), b = r.pick([5, 10, 3, 4, 6, 2]); var ys = r.pick([[b, 2 * b, b, 4 * b], [2 * b, b, 3 * b, b], [b, 3 * b, 3 * b, 2 * b]]); return range(1, 4).map(function (k, i) { return [k * s, ys[i]]; }); })();
          return pairsDR('(a) Ordered pairs: ' + ptsH(P), P, { braces: true, text: '10a pairs' });
        } },
        { id: '10b', sub: 'b', level: 'EMG', make: function (r) {
          var o = r.chance(0.25) ? [-6, 3, -1, 3] : [r.int(-8, -3), r.pick([2, 3, 4]), r.int(-5, 3), r.pick([2, 3, 4])], xs = range(0, 3).map(function (k) { return o[0] + k * o[1]; }), ys = [o[2], o[2], o[2] + o[3], o[2] + 2 * o[3]], P = xs.map(function (x, i) { return [x, ys[i]]; });
          return pairsDR('(b) Table:' + tabH(xs, ys), P, { braces: true, text: '10b table' });
        } },
        { id: '10c', sub: 'c', level: 'EMG', make: function (r) {
          var o = r.chance(0.25) ? [[-3, 1, 5], 7] : [r.sample(range(-5, 5), 3).sort(function (a, b) { return a - b; }), r.pick(nz(-5, 6))], P = o[0].map(function (x) { return [x, o[1]]; }), w = win(P);
          var p = pairsDR('(c) Graph:' + HW.graph({ x: w.x, y: w.y, labels: 1, max: 260, points: P.map(function (q) { return { x: q[0], y: q[1] }; }) }), P, { braces: true, solPre: 'The dots are ' + ptsH(P) + '.<br>', text: '10c graph' });
          p.hints = ['All three dots are at the same height.', HSET]; return p;
        } }] },
      { num: '11', shared: function (r) { return r.chance(0.25) ? { p: 4, N: 60, s: 10 } : pickWhere(function () { var s = r.pick([5, 10, 12, 20]); return { p: r.pick([3, 4, 5, 6, 7, 8, 2.5, 3.5, 4.5]), s: s, N: 6 * s }; }, function () { return true; }); },
        stem: function (o) { var ns = range(1, 6).map(function (k) { return k * o.s; }); return 'A snack bar sells popcorn combos for $' + (o.p % 1 ? o.p.toFixed(2) : o.p) + ' each during a Saturday afternoon shift. Only ' + t(o.N) + ' combos are available that shift. The table shows the number of combos sold, ' + t('n') + ', and the total revenue, ' + t('R') + ' dollars, collected.' + tabH(ns, ns.map(function (n) { return n * o.p; }), 'n', 'R'); },
        parts: [
          { id: '11a', sub: 'a', level: 'EMG', make: function (r, o) {
            var ns = range(1, 6).map(function (k) { return k * o.s; }), P = ns.map(function (n) { return [n, n * o.p]; });
            return pairsDR('(a) State the domain and range of the relation shown in the table, using set notation.', P, { braces: true, xn: 'n', yn: 'R', text: 'snack D and R' });
          } },
          { id: '11b', sub: 'b', level: 'BEG', outcome: 'RF1', make: function (r, o) {
            return mc(r, '(b) Why can’t ' + t('n') + ' be greater than ' + t(o.N) + ' in this situation?', [
              { html: 'Only ' + t(o.N) + ' combos are available that shift, so it is impossible to sell more.', right: true },
              { html: 'Because the revenue would be too large.', why: 'Any revenue is fine for the snack bar. What limits the number <b>sold</b>?' },
              { html: 'Because the table stops at ' + t(o.N) + '.', why: 'The table stops there for a reason in the story. What is it?' },
              { html: 'Because ' + t('n') + ' must be a multiple of ' + t(o.s) + '.', why: 'That’s just how the table was made. What does the story say about how many combos there are?' }],
              'The story says only ' + t(o.N) + ' combos are available, so no more than ' + t(o.N) + ' can be sold.', ['Read the story: how many combos are there?'], 'why n <= N');
          } },
          { id: '11c', sub: 'c', level: 'PRG', outcome: 'RF1', make: function (r, o) {
            var n = o.N + r.pick([5, 2, 10]), R = n * o.p;
            return mc(r, '(c) Would the ordered pair ' + t('(' + n + ',\\ ' + nn(R) + ')') + ' belong to this relation?', [
              { html: '<b>No:</b> ' + t('n=' + n) + ' is outside the domain — more combos than were available — even though ' + t(nn(o.p) + '\\times ' + n + '=' + nn(R)) + ' matches the price.', right: true },
              { html: '<b>Yes:</b> ' + t(nn(o.p) + '\\times ' + n + '=' + nn(R)) + ', so it fits the pattern.', why: 'The arithmetic fits, but can they sell ' + t(n) + ' combos?' },
              { html: '<b>No:</b> the revenue is calculated wrong.', why: 'Check: ' + t(nn(o.p) + '\\times ' + n + '=' + nn(R)) + ' — the arithmetic is right. Look at ' + t('n') + '.' },
              { html: '<b>Yes:</b> any whole number of combos can be sold.', why: 'Only ' + t(o.N) + ' combos are available.' }],
              '<b>No.</b> The price works out, but ' + t(n) + ' combos is more than the ' + t(o.N) + ' available, so ' + t('n=' + n) + ' is not in the domain.', ['Is ' + t('n=' + n) + ' possible in this story?'], 'pair outside domain');
          } }] },
      { num: '12', section: 'Part D — Concepts and Review', stem: 'State whether each sentence is <b>True</b> or <b>False</b>.', parts: [
        { id: '12a', level: 'BEG', make: function (r) { return B.tf(r, 'The domain of a relation can never contain a repeated value once written in set notation.', true, 'In set notation each value is listed once.', '<b>True.</b> A set lists each value only once.', [HONCE], 'TF no repeats'); } },
        { id: '12b', level: 'BEG', make: function (r) { return B.tf(r, 'If two ordered pairs share the same ' + t('y') + '-value, that value is listed twice in the range.', false, 'A repeated value is written only once.', '<b>False.</b> The shared ' + t('y') + '-value appears once in the range.', [HONCE], 'TF listed twice'); } },
        { id: '12c', level: 'EMG', make: function (r) { var a = r.sample(range(1, 9), 3); return B.tf(r, 'The order in which values are listed inside curly braces changes the set (for example, ' + t('\\{' + a.join(',') + '\\}') + ' and ' + t('\\{' + a.slice().reverse().join(',') + '\\}') + ' are different sets).', false, 'A set is just a collection: the same values in any order make the same set.', '<b>False.</b> The same values in a different order are the same set (smallest to largest is just a good habit).', ['Does a set care about order?'], 'TF order'); } },
        { id: '12d', level: 'EMG', make: function (r) { return B.tf(r, 'The inequality ' + t('y\\ge 0') + ' could describe the range of a relation whose graph continues upward forever, starting from a lowest point of ' + t('y=0') + '.', true, 'Lowest value 0 (included), no highest value: ' + t('y\\ge 0') + '.', '<b>True.</b> The lowest value is ' + t('0') + ' (included) and there is no highest value, so ' + t('y\\ge 0') + '.', ['Is there a lowest value? A highest one?'], 'TF y>=0'); } },
        { id: '12e', level: 'BEG', make: function (r) { return B.tf(r, 'A relation with exactly one ordered pair has a domain with one element and a range with one element.', true, 'One pair gives one ' + t('x') + ' and one ' + t('y') + '.', '<b>True.</b> One pair ' + t('(a,\\ b)') + ' gives ' + t('D=\\{a\\}') + ' and ' + t('R=\\{b\\}') + '.', ['Try it with ' + t('(3,\\ 7)') + '.'], 'TF one pair'); } }] },
      { num: '13', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '13', level: 'BEG', make: function (r) {
          var bk = r.chance(0.25), a = bk ? 3 : r.int(-5, 9), b = bk ? 8 : a + r.int(2, 9), xs = bk ? [0, 1, 2, 3] : range(0, 3).map(function (k) { return k + r.int(-3, 0); });
          var ys = [a, a, b, a], P = xs.map(function (x, i) { return [x, ys[i]]; });
          return mc(r, 'Using the convention of this lesson (each value listed once), which correctly shows the <b>range</b> of the ordered pairs ' + ptsH(P) + '?', [
            { html: t(lst(xs)), why: 'That is the domain (the first coordinates).' },
            { html: t('\\{' + [a, a, a, b].join(',\\ ') + '\\}'), why: 'Each value is listed only once.' },
            { html: t('\\{' + a + ',\\ ' + b + '\\}'), right: true },
            { html: t('\\{' + b + '\\}'), why: t(a) + ' is an output too — it just repeats.' }],
            'The outputs are ' + t(ys.join(',\\ ')) + '; each value once: ' + t('\\{' + a + ',\\ ' + b + '\\}') + '.', [HONCE], 'MC range', true);
        } }] },
      { num: '14', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '14', level: 'PRG', make: function (r) {
          var P;
          if (r.chance(0.25)) P = [[-6, 14], [-2, 9], [0, 9], [3, 14], [5, 20]];
          else { var xs = r.sample(range(-7, 7), 5).sort(function (a, b) { return a - b; }), v = r.sample(range(-3, 20), r.pick([3, 4])), ys = v.slice(); while (ys.length < 5) ys.push(r.pick(v)); ys = r.shuffle(ys); P = xs.map(function (x, i) { return [x, ys[i]]; }); }
          var a = uniq(P.map(function (p) { return p[0]; })).length, b = uniq(P.map(function (p) { return p[1]; })).length;
          return B.nr('A relation includes the ordered pairs ' + ptsH(P) + '. If ' + t('a') + ' is the number of elements in the domain and ' + t('b') + ' is the number of elements in the range, the value of ' + t('a+b') + ' is ________.', a + b,
            function (v) { return v === 10 && a + b !== 10 ? { code: 'u5l5-count-all', hint: 'A repeated ' + t('y') + '-value counts only once in the range.' } : null; },
            t('D=' + lst(P.map(function (p) { return p[0]; }))) + ' (' + t('a=' + a) + '), ' + t('R=' + lst(P.map(function (p) { return p[1]; }))) + ' (' + t('b=' + b) + '). ' + t('a+b=' + (a + b)) + '.', ['Write each set with each value once, then count.'], 'NR a+b');
        } }] },
      { num: '15', stem: 'A list in braces (such as ' + t('\\{2,\\ 4,\\ 6\\}') + ') or an inequality (such as ' + t('x\\ge 0') + ')?', parts: [
        { id: '15', level: 'PRG', make: function (r) {
          var k = r.int(2, 9), rowsAll = [
            { id: 'a', html: 'the domain of ' + ptsH([[2, k], [4, k], [6, k]]), want: 'list', why: 'Three separate pairs: only three ' + t('x') + '-values, so list them.' },
            { id: 'b', html: 'the domain of a ray that starts at the origin and goes right forever', want: 'ineq', why: 'A ray uses every ' + t('x') + '-value from ' + t('0') + ' on — infinitely many: ' + t('x\\ge 0') + '.' },
            { id: 'c', html: 'the range of a table with five columns', want: 'list', why: 'A table has only its own values: list them.' },
            { id: 'd', html: 'the range of a graph that continues upward forever from a lowest point ' + t('y=' + (-k)), want: 'ineq', why: 'Every height from ' + t(-k) + ' up is used — impossible to list: ' + t('y\\ge ' + (-k)) + '.' },
            { id: 'e', html: 'the domain of a graph made of four separate dots', want: 'list', why: 'Four dots: four ' + t('x') + '-values to list.' }];
          var rows = r.shuffle(rowsAll).slice(0, 4), want = {}, by = {};
          rows.forEach(function (x) { want[x.id] = x.want; by[x.id] = x; });
          var p = B.grid('Choose the better notation for each set.', rows.map(function (x) { return { id: x.id, html: x.html }; }), [{ id: 'list', html: 'List in braces' }, { id: 'ineq', html: 'Inequality' }], want, { why: function (id) { return { code: 'row', hint: by[id].why }; } },
            rows.map(function (x) { return x.html + ': <b>' + (x.want === 'list' ? 'list' : 'inequality') + '</b> — ' + x.why; }).join('<br>') + '<br>A list works for a finite, discrete relation where every value can be written down; an inequality is needed when the relation uses every value across a stretch, so the values can’t be listed.',
            ['Can every value be written down? Then list it. Does it use every value across a stretch? Then use an inequality.'], 'list or inequality');
          p.tries = 2; return p;
        } }] }
    ],
    extra: EXTRA()
  });

  /* =============================== Extra practice (u5_EP06) =============================== */
  function eqDR(eq, D, R, o, sol, hints, text) { return drPart(t(eq), D, R, Object.assign({ good: [] }, o || {}), sol, hints, text); }
  var HALL = 'If every number can be substituted, the domain is all real numbers (type “all real numbers” or ' + t('x\\in\\mathbb{R}') + ').';
  function EXTRA() {
    return [
      { num: '1', section: 'Extra Practice A — Domain and Range From an Equation', shared: function (r) { return r.chance(0.25) ? { m: 2, b: 1, xs: [-4, -1, 0, 3.5, 10] } : { m: r.pick([2, 3, -2, 4, 5, -3]), b: r.pick([1, -3, 5, 2, -1, 4, 7]), xs: [r.int(-6, -2), -1, 0, r.pick([1.5, 2.5, 3.5]), r.pick([8, 10, 12])] }; },
        stem: function (o) { return 'The equation ' + t('y=' + (o.m === 1 ? '' : o.m) + 'x' + (o.b < 0 ? o.b : '+' + o.b)) + ' has no picture, so the domain is decided by asking: <i>which numbers am I allowed to substitute for ' + t('x') + '?</i>'; },
        parts: [
          { id: 'e1a', sub: 'a', level: 'BEG', make: function (r, o) { var f = function (x) { return o.m * x + o.b; }; return tablePart('(a) Complete the table.', o.xs, f, o.xs.map(function (x) { return t('y=' + o.m + '(' + nn(x) + ')' + (o.b < 0 ? o.b : '+' + o.b) + '=' + nn(f(x))); }).join(', ') + '.', ['Substitute each ' + t('x') + ': multiply by ' + t(o.m) + ', then add ' + t(o.b) + '.'], 'EP1 table'); } },
          { id: 'e1b', sub: 'b', level: 'EMG', make: function (r, o) {
            return mc(r, '(b) Is there any number at all that you are <b>not</b> allowed to substitute for ' + t('x') + '?', [
              { html: '<b>No:</b> multiplying by ' + t(o.m) + ' and adding ' + t(o.b) + ' works on every number.', right: true },
              { html: '<b>Yes:</b> negative numbers.', why: 'Try ' + t('x=-4') + ' — it worked in the table.' },
              { html: '<b>Yes:</b> decimals.', why: 'Try ' + t('x=3.5') + ' — it worked in the table.' },
              { html: '<b>Yes:</b> ' + t('x=0') + '.', why: t('x=0') + ' gives ' + t('y=' + o.b) + ' — no problem.' }],
              'Every number can be multiplied by ' + t(o.m) + ' and have ' + t(o.b) + ' added, so nothing is forbidden.', ['Did any value in your table cause a problem?'], 'anything forbidden?');
          } },
          { id: 'e1c', sub: 'c', level: 'EMG', make: function (r, o) { return oneSet('(c) State the domain.', ALLX, 'x', { dW: [{ is: rng('x', o.xs[0], o.xs[4]), code: 'set-arrow', hint: 'The table only shows a few values; any number at all can be substituted.' }] }, 'Any number can be substituted: the domain is all real numbers.', [HALL], 'domain all reals'); } },
          { id: 'e1d', sub: 'd', level: 'EMG', make: function (r, o) { var x = (100 - o.b) / o.m; return numPart('(d) Find the ' + t('x') + '-value that produces ' + t('y=100') + '.', x, [[o.m * 100 + o.b, 'ctx-eval', 'You substituted ' + t('x=100') + '. Here ' + t('y=100') + ': solve ' + t(o.m + 'x' + (o.b < 0 ? o.b : '+' + o.b) + '=100') + '.'], [100 / o.m, 'ctx-no-sub', 'First undo the ' + t(o.b) + ', then divide.']], t(o.m + 'x' + (o.b < 0 ? o.b : '+' + o.b) + '=100') + ', ' + t(o.m + 'x=' + (100 - o.b)) + ', ' + t('x=' + nn(x)) + '.', ['Set the equation equal to ' + t('100') + ' and solve.'], 'x for y=100', { before: t('x=') }); } },
          { id: 'e1d2', sub: 'd, range', level: 'PRG', make: function (r, o) { return oneSet('(d, continued) Any target ' + t('y') + ' can be reached the same way. State the range.', ALLY, 'y', { which: 'R' }, 'For any target ' + t('y') + ', solving gives an ' + t('x') + ' (just as ' + t('y=100') + ' did), so every real number is an output: the range is all real numbers.', ['Could you hit ' + t('y=-1000') + ' the same way?'], 'range all reals'); } }] },
      { num: '2', stem: 'State the domain and range of each linear equation.', parts: ['a', 'b', 'c'].map(function (sub, i) {
        return { id: 'e2' + sub, sub: sub, level: 'EMG', make: function (r) {
          var eq = i === 0 ? 'y=' + r.pick([-4, -3, 5, 6]) + 'x+' + r.int(1, 12) : i === 1 ? 'y=\\frac{1}{' + r.pick([2, 3, 4]) + '}x-' + r.int(1, 9) : 'y=' + r.int(2, 15) + '-' + r.pick(['', '', '2', '3']) + 'x';
          if (r.chance(0.25)) eq = ['y=-4x+9', 'y=\\frac{1}{3}x-2', 'y=7-x'][i];
          return eqDR(eq, ALLX, ALLY, { dW: [{ is: 'x\\ge 0', code: 'set-arrow', hint: 'Negative ' + t('x') + '-values can be substituted too.' }], rW: [{ is: 'y\\ge 0', code: 'set-arrow', hint: 'A slanted line goes down forever too: negative outputs happen.' }] },
            'Every number can be substituted, and a slanted line stretches forever up and down, so D: all real numbers, R: all real numbers.', [HALL, 'A slanted line goes forever left, right, up and down.'], 'linear D and R');
        } };
      }) },
      { num: '3', stem: 'The equation ' + t('y=x^{2}') + ' behaves differently.', parts: [
        { id: 'e3a', sub: 'a', level: 'BEG', make: function (r) { var xs = range(-3, 3); return tablePart('(a) Complete the table.', xs, function (x) { return x * x; }, 'Squaring: ' + xs.map(function (x) { return t('(' + x + ')^{2}=' + x * x); }).join(', ') + '.', ['A negative times a negative is positive.'], 'x^2 table'); } },
        { id: 'e3b', sub: 'b', level: 'EMG', make: function (r) { return oneSet('(b) Every number can be squared. State the domain of ' + t('y=x^{2}') + '.', ALLX, 'x', { dW: [{ is: 'x\\ge 0', code: 'set-swap', hint: 'You can square negative numbers too: ' + t('(-3)^{2}=9') + '. It is the <b>outputs</b> that are never negative.' }] }, 'Every number can be squared, so the domain is all real numbers.', [HALL], 'x^2 domain'); } },
        { id: 'e3c', sub: 'c', level: 'PRG', make: function (r) { return oneSet('(c) State the range of ' + t('y=x^{2}') + '.', 'y\\ge 0', 'y', { which: 'R', rW: [{ is: 'y>0', code: 'set-endpoint', hint: t('x=0') + ' gives ' + t('y=0') + ', so ' + t('0') + ' is included.' }, { is: ALLY, code: 'set-arrow', hint: 'Look down the ' + t('y') + '-row: can a square ever be negative?' }] }, 'A square is never negative, and ' + t('x=0') + ' gives ' + t('y=0') + ': ' + t('y\\ge 0') + '.', ['Can a square ever be negative? What is the smallest square?'], 'x^2 range'); } },
        { id: 'e3c2', sub: 'c, why', level: 'PRG', make: function (r) {
          return mc(r, 'Why can no choice of ' + t('x') + ' make ' + t('y=x^{2}') + ' negative?', [
            { html: 'A positive times itself is positive and a negative times itself is also positive (and ' + t('0^{2}=0') + '), so a square is never negative.', right: true },
            { html: 'Because ' + t('x') + ' can’t be negative.', why: 'It can: ' + t('x=-3') + ' gives ' + t('9') + '. Think about what squaring does to the sign.' },
            { html: 'Because the graph has no arrows.', why: 'The graph does go on forever. Think about the sign of a square.' },
            { html: 'Because the table didn’t show any.', why: 'A table shows only a few values. Why is <b>every</b> square non-negative?' }],
            'Same signs multiply to a positive, so ' + t('x\\cdot x\\ge 0') + ' for every ' + t('x') + '.', ['What is ' + t('(-5)^{2}') + '?'], 'why squares non-negative');
        } },
        { id: 'e3d', sub: 'd', level: 'EMG', make: function (r) {
          var a = r.chance(0.25) ? 6 : r.int(4, 12), b = r.chance(0.25) ? 5 : r.int(2, 9);
          var p = B.grid('(d) Does each ordered pair belong to ' + t('y=x^{2}') + '?', [{ id: 'p', html: t('(-' + a + ',\\ ' + a * a + ')') }, { id: 'q', html: t('(' + b + ',\\ -' + b * b + ')') }], [{ id: 'yes', html: 'Yes' }, { id: 'no', html: 'No' }], { p: 'yes', q: 'no' },
            { why: function (id) { return { code: 'row', hint: id === 'p' ? t('(-' + a + ')^{2}=' + a * a) + ' — a negative squared is positive.' : t(b + '^{2}=' + b * b) + ', not ' + t(-b * b) + '.' }; } },
            t('(-' + a + ',\\ ' + a * a + ')') + ': yes, ' + t('(-' + a + ')^{2}=' + a * a) + '. ' + t('(' + b + ',\\ -' + b * b + ')') + ': no, ' + t(b + '^{2}=' + b * b) + ', not ' + t(-b * b) + '.', ['Square the first coordinate and compare.'], 'pairs on x^2');
          p.tries = 2; return p;
        } }] },
      { num: '4', stem: 'Each equation is ' + t('y=x^{2}') + ' with something done to it. State the domain and the range.', parts: [
        { id: 'e4a', sub: 'a', level: 'PRG', make: function (r) { var k = r.chance(0.25) ? 3 : r.int(1, 15); return eqDR('y=x^{2}+' + k, ALLX, 'y\\ge ' + k, { rW: [{ is: 'y\\ge 0', code: 'dr-no-b', hint: t('x^{2}\\ge 0') + ', and then ' + t(k) + ' is added.' }, { is: 'y\\ge -' + k, code: 'set-values', hint: 'Adding ' + t(k) + ' moves every output <b>up</b>.' }] }, t('x^{2}\\ge 0') + ', so ' + t('x^{2}+' + k + '\\ge ' + k) + ': D all real numbers, ' + t('R:\\ y\\ge ' + k) + '.', [HALL, 'The smallest square is ' + t('0') + '. What is the smallest output then?'], 'x^2+k'); } },
        { id: 'e4b', sub: 'b', level: 'PRG', make: function (r) { var k = r.chance(0.25) ? 5 : r.int(1, 15); return eqDR('y=x^{2}-' + k, ALLX, 'y\\ge -' + k, { rW: [{ is: 'y\\ge 0', code: 'dr-no-b', hint: 'Then ' + t(k) + ' is subtracted from every square.' }, { is: 'y\\ge ' + k, code: 'set-values', hint: 'Subtracting ' + t(k) + ' moves every output <b>down</b>.' }] }, t('x^{2}\\ge 0') + ', so ' + t('x^{2}-' + k + '\\ge -' + k) + ': D all real numbers, ' + t('R:\\ y\\ge -' + k) + '.', [HALL, 'The smallest square is ' + t('0') + '. What is the smallest output then?'], 'x^2-k'); } },
        { id: 'e4c', sub: 'c', level: 'ADV', make: function (r) { var k = r.chance(0.4) ? 0 : r.pick(nz(-9, 9)), eq = k < 0 ? 'y=-x^{2}' + k : k ? 'y=-x^{2}+' + k : 'y=-x^{2}'; return eqDR(eq, ALLX, 'y\\le ' + k, { rW: [{ is: 'y\\ge ' + k, code: 'dr-opens', hint: 'The minus sign makes every square into its opposite: the outputs are ' + t(k) + ' or <b>less</b>.' }] }, t('x^{2}\\ge 0') + ', so ' + t('-x^{2}\\le 0') + (k ? ' and ' + t('-x^{2}+' + k + '\\le ' + k) : '') + ': D all real numbers, ' + t('R:\\ y\\le ' + k) + '.', [HALL, 'The opposite of a non-negative number is never above ' + t('0') + '.'], '-x^2'); } }] },
      { num: '5', stem: 'The equation ' + t('y=\\sqrt{x}') + ' restricts the <b>domain</b> instead of the range.', parts: [
        { id: 'e5a', sub: 'a', level: 'BEG', make: function (r) { var xs = r.chance(0.25) ? [0, 1, 4, 9, 25] : [0].concat(r.sample([1, 4, 9, 16, 25, 36, 49, 64, 81, 100], 4).sort(function (a, b) { return a - b; })); return tablePart('(a) Complete the table.', xs, Math.sqrt, xs.map(function (x) { return t('\\sqrt{' + x + '}=' + Math.sqrt(x)); }).join(', ') + '.', ['Which number times itself gives ' + t('x') + '?'], 'sqrt table'); } },
        { id: 'e5b', sub: 'b', level: 'EMG', make: function (r) { var a = r.pick([4, 9, 16, 1, 25]); return mc(r, '(b) Try ' + t('x=-' + a) + '. What goes wrong?', [{ html: 'No number times itself gives ' + t('-' + a) + ', so ' + t('\\sqrt{-' + a + '}') + ' is not a real number.', right: true }, { html: t('\\sqrt{-' + a + '}=-' + Math.sqrt(a)) + ', which is negative but fine.', why: t('(-' + Math.sqrt(a) + ')^{2}=' + a) + ', not ' + t(-a) + '.' }, { html: 'Nothing goes wrong; it equals ' + t(Math.sqrt(a)) + '.', why: t(Math.sqrt(a) + '^{2}=' + a) + ', not ' + t(-a) + '.' }], 'A square is never negative, so nothing squares to ' + t(-a) + ': ' + t('\\sqrt{-' + a + '}') + ' is not a real number.', ['Which number squared gives a negative?'], 'sqrt of negative'); } },
        { id: 'e5c', sub: 'c', level: 'PRG', make: function (r) { return oneSet('(c) State the domain of ' + t('y=\\sqrt{x}') + '.', 'x\\ge 0', 'x', { dW: [{ is: 'x>0', code: 'set-endpoint', hint: t('\\sqrt{0}=0') + ' works, so ' + t('0') + ' is included.' }, { is: ALLX, code: 'set-arrow', hint: 'Negative numbers can’t go under the square root (part b).' }] }, 'Only numbers ' + t('0') + ' or greater can go under the root: ' + t('x\\ge 0') + '.', ['Which numbers can go under a square root?'], 'sqrt domain'); } },
        { id: 'e5d', sub: 'd', level: 'PRG', make: function (r) { return oneSet('(d) State the range of ' + t('y=\\sqrt{x}') + '.', 'y\\ge 0', 'y', { which: 'R', rW: [{ is: 'y>0', code: 'set-endpoint', hint: t('x=0') + ' gives ' + t('y=0') + '.' }] }, 'The square root symbol gives the non-negative root, and ' + t('0') + ' is reached at ' + t('x=0') + ': ' + t('y\\ge 0') + '. (Every non-negative output is reached: ' + t('y=k') + ' comes from ' + t('x=k^{2}') + '.)', ['Look at your table: are the outputs ever negative?'], 'sqrt range'); } }] },
      { num: '6', stem: 'State the domain and range of each relation.', parts: [
        { id: 'e6a', sub: 'a', level: 'ADV', make: function (r) { var k = r.chance(0.25) ? 2 : r.pick(nz(-9, 12)), eq = 'y=\\sqrt{x' + (k < 0 ? '+' + (-k) : '-' + k) + '}'; return eqDR(eq, 'x\\ge ' + k, 'y\\ge 0', { dW: [{ is: 'x\\ge 0', code: 'set-values', hint: 'What goes under the root is ' + t('x' + (k < 0 ? '+' + (-k) : '-' + k)) + ': it must be ' + t('\\ge 0') + '.' }, { is: 'x\\ge ' + (-k), code: 'set-values', hint: 'Solve ' + t('x' + (k < 0 ? '+' + (-k) : '-' + k) + '\\ge 0') + ' — check the sign.' }] }, 'Need ' + t('x' + (k < 0 ? '+' + (-k) : '-' + k) + '\\ge 0') + ', so ' + t('x\\ge ' + k) + '. The root is never negative and reaches ' + t('0') + ' at ' + t('x=' + k) + ': ' + t('y\\ge 0') + '.', ['What is under the root must be ' + t('0') + ' or more.'], 'sqrt(x-k)'); } },
        { id: 'e6b', sub: 'b', level: 'ADV', make: function (r) { var k = r.chance(0.25) ? 6 : r.int(1, 20); return eqDR('y=\\sqrt{x}+' + k, 'x\\ge 0', 'y\\ge ' + k, { rW: [{ is: 'y\\ge 0', code: 'dr-no-b', hint: 'Then ' + t(k) + ' is added to every root.' }], dW: [{ is: 'x\\ge ' + k, code: 'set-values', hint: 'The ' + t('+' + k) + ' is outside the root: only ' + t('x') + ' itself must be ' + t('\\ge 0') + '.' }] }, 'Under the root is just ' + t('x') + ': ' + t('x\\ge 0') + '. ' + t('\\sqrt{x}\\ge 0') + ', so ' + t('\\sqrt{x}+' + k + '\\ge ' + k) + ': ' + t('y\\ge ' + k) + '.', ['Is the ' + t(k) + ' inside or outside the root?'], 'sqrt(x)+k'); } },
        { id: 'e6c', sub: 'c', level: 'PRG', make: function (r) { var k = r.chance(0.25) ? 5 : r.pick(nz(-8, 8)); return eqDR('y=' + k, ALLX, lst([k]), { rC: { 'set-continuous': 'Every point has ' + t('y=' + k) + ': one output only.' }, dW: [{ is: lst([k]), code: 'set-swap', hint: t(k) + ' is the output. Any ' + t('x') + ' can go in.' }] }, 'A horizontal line: any ' + t('x') + ', always ' + t('y=' + k) + '. D: all real numbers, ' + t('R=\\{' + k + '\\}') + '.', ['What does the graph of ' + t('y=' + k) + ' look like?'], 'y=k'); } },
        { id: 'e6d', sub: 'd', level: 'PRG', make: function (r) { var k = r.chance(0.25) ? -2 : r.pick(nz(-8, 8)); return eqDR('x=' + k, lst([k]), ALLY, { dC: { 'set-continuous': 'Every point has ' + t('x=' + k) + ': one input only.' }, rW: [{ is: lst([k]), code: 'set-swap', hint: t(k) + ' is the only ' + t('x') + '-value. The line goes up and down forever.' }] }, 'A vertical line: always ' + t('x=' + k) + ', every height. ' + t('D=\\{' + k + '\\}') + ', R: all real numbers.', ['What does the graph of ' + t('x=' + k) + ' look like?'], 'x=k'); } }] },
      { num: '7', section: 'Extra Practice B — From a Table and From Ordered Pairs', stem: 'Write the domain and range of each set of ordered pairs using set notation. Watch for repeats.', parts: [
        { id: 'e7a', sub: 'a', level: 'EMG', make: function (r) { var s = r.chance(0.25) ? 4 : r.pick([1, 2, 3, 5]), a = r.chance(0.25) ? [3, -5] : r.sample(nz(-6, 9), 2), P = [-2, -1, 0, 1, 2].map(function (k, i) { return [k * s, a[[0, 0, 1, 0, 1][i]]]; }); return pairsDR(ptsH(P), P, { braces: true, text: 'EP7a' }); } },
        { id: 'e7b', sub: 'b', level: 'EMG', make: function (r) { var c = r.pick(nz(-7, 9)), ys = shuffleUnsorted(r, r.sample(range(-4, 9), 3), function (y) { return y; }), P = ys.map(function (y) { return [c, y]; }); return pairsDR(ptsH(P), P, { braces: true, text: 'EP7b' }); } },
        { id: 'e7c', sub: 'c', level: 'EMG', make: function (r) { var s = r.int(-3, 1), m = r.pick([1, 1, 2, -1, 3]), P = range(s, s + 3).map(function (x) { return [x, m * x]; }); return pairsDR(ptsH(P), P, { braces: true, text: 'EP7c' }); } }] },
      { num: '8', stem: 'Write the domain and range of each table using set notation.', parts: [
        { id: 'e8a', sub: 'a', level: 'EMG', make: function (r) { var c = r.chance(0.25) ? 1 : r.int(-2, 2), k = r.pick([1, 2, 3]), xs = [-4, -2, 0, 2, 4].map(function (d) { return c + d; }), ys = xs.map(function (x) { return k * (x - c) * (x - c) / 4 * (k === 3 ? 1 : 1); }); if (c === 1 && r.chance(0.5)) ys = [12, 4, 0, 4, 12]; var P = xs.map(function (x, i) { return [x, ys[i]]; }); return pairsDR(tabH(xs, ys), P, { braces: true, text: 'EP8a symmetric' }); } },
        { id: 'e8b', sub: 'b', level: 'EMG', make: function (r) { var x0 = r.pick([0.5, 1.5, -1.5, 2.5]), d = r.pick([1, 0.5, 2]), y = r.pick(nz(-9, 9)), xs = range(0, 3).map(function (k) { return x0 + k * d; }), P = xs.map(function (x) { return [x, y]; }); return pairsDR(tabH(xs, xs.map(function () { return y; })), P, { braces: true, text: 'EP8b decimals constant' }); } }] },
      { num: '9', shared: function (r) { var xs = r.chance(0.25) ? [2, 4, 6, 8] : r.sample(range(-5, 10), 4).sort(function (a, b) { return a - b; }); return { xs: xs, c: r.chance(0.25) ? 5 : r.pick(nz(-6, 9)), a: r.int(1, 3), b: r.int(4, 7) }; },
        stem: function (o) { return 'A relation has domain ' + t('D=' + lst(o.xs)) + ' and range ' + t('R=\\{' + o.c + '\\}') + '.'; },
        parts: [
          { id: 'e9a', sub: 'a', level: 'PRG', make: function (r, o) { var P = o.xs.map(function (x) { return [x, o.c]; }); var p = K.P.pairs('(a) Write every ordered pair in this relation.', P, {}, 'Every ' + t('x') + ' must pair with the only output, ' + t(o.c) + ': ' + ptsH(P) + '.', ['There is only one possible output. Pair it with each input.'], 'pairs from D and R'); p.bad = ['\\{' + o.xs.map(function (x) { return '(' + o.c + ', ' + x + ')'; }).join(', ') + '\\}']; return p; } },
          { id: 'e9b', sub: 'b', level: 'PRG', make: function (r, o) { return mc(r, '(b) Could this relation have five <b>different</b> ordered pairs?', [{ html: '<b>No:</b> every ' + t('y') + ' must be ' + t(o.c) + ' and there are only four ' + t('x') + '-values, so only four different pairs exist.', right: true }, { html: '<b>Yes:</b> add ' + t('(' + (o.xs[3] + 2) + ',\\ ' + o.c + ')') + '.', why: 'Then ' + t(o.xs[3] + 2) + ' would be in the domain — but the domain is fixed.' }, { html: '<b>Yes:</b> repeat one pair.', why: 'A repeated pair is the same pair, not a different one.' }], 'Each pair is ' + t('(x,\\ ' + o.c + ')') + ' with ' + t('x') + ' from the domain: exactly four pairs.', ['How many choices are there for ' + t('x') + '? For ' + t('y') + '?'], 'five pairs?', true); } },
          { id: 'e9c', sub: 'c', level: 'ADV', make: function (r, o) {
            var a = o.a, b = o.b, c1 = a + 2, c2 = b + 3;
            var one = function (resp) { var L = pairsIn(resp); if (L.empty) return form('empty', 'Type two ordered pairs.'); if (L.bad) return form('unreadable', 'Write ordered pairs like ' + t('(1,\\ 3),\\ (2,\\ 4)') + '.'); var P = L.pairs; if (P.length !== 2) return wrong('pairs-count', 'Each relation has exactly <b>two</b> ordered pairs.'); var xs = uniq(P.map(function (p) { return p[0]; })), ys = uniq(P.map(function (p) { return p[1]; })); if (xs.join() !== [a, b].join()) return wrong('pairs-count', 'The domain must be ' + t('\\{' + a + ',\\ ' + b + '\\}') + ': use each of ' + t(a) + ' and ' + t(b) + ' once as a first coordinate.'); if (ys.join() !== [c1, c2].join()) return wrong('pairs-count', 'The range must be ' + t('\\{' + c1 + ',\\ ' + c2 + '\\}') + ': use each of ' + t(c1) + ' and ' + t(c2) + ' once as a second coordinate.'); return ok(); };
            var key = function (resp) { var L = pairsIn(resp); return L.pairs ? L.pairs.map(function (p) { return p.join(','); }).sort().join(';') : ''; };
            var chk = K.fields([one, one], { labels: ['Relation 1', 'Relation 2'] });
            var check = function (resp) { var res = chk(resp); if (res.v !== 'correct') return res; return key(resp[0]) === key(resp[1]) ? wrong('pairs-count', 'Your two relations are the same. Pair the values the other way for the second one.') : ok(); };
            var k1 = '(' + a + ', ' + c1 + '), (' + b + ', ' + c2 + ')', k2 = '(' + a + ', ' + c2 + '), (' + b + ', ' + c1 + ')';
            return { prompt: '(c) A second relation has ' + t('D=\\{' + a + ',\\ ' + b + '\\}') + ' and ' + t('R=\\{' + c1 + ',\\ ' + c2 + '\\}') + ' and exactly two ordered pairs. Write two different relations that fit.', input: { type: 'fields', fields: [pairsField('Relation 1'), pairsField('Relation 2')] }, check: check, key: [k1, k2], answer: t(k1) + ' and ' + t(k2),
              solution: 'Each input is used once and each output once; the only choice is how to pair them: ' + t(k1) + ' or ' + t(k2) + '.', hints: ['Each relation uses ' + t(a) + ' and ' + t(b) + ' once as inputs and ' + t(c1) + ' and ' + t(c2) + ' once as outputs.', 'Pair them one way, then the other way.'], text: 'two relations', bad: [[k1, k1], ['(' + a + ', ' + c1 + '), (' + b + ', ' + c1 + ')', k2]] };
          } }] },
      { num: '10', section: 'Extra Practice C — Restricted Domains in Context', shared: function (r) { return r.chance(0.25) ? { p: 8, N: 240 } : { p: r.pick([5, 6, 7, 9, 10, 12, 15]), N: r.pick([120, 150, 180, 200, 250, 300]) }; },
        stem: function (o) { return 'A school play sells tickets for $' + o.p + ' each. The theatre holds ' + t(o.N) + ' seats, and the show is not oversold. The revenue, ' + t('R') + ' dollars, from selling ' + t('n') + ' tickets is ' + t('R=' + o.p + 'n') + '.'; },
        parts: [
          { id: 'e10a', sub: 'a', level: 'PRG', make: function (r, o) { var D = '\\{0, 1, 2, \\ldots, ' + o.N + '\\}'; return oneSet('(a) Tickets can’t be split, so ' + t('n') + ' is a whole number. State the domain in set notation (write the first values, then dots, then the last value).', D, 'n', { dW: [{ is: rng('n', 0, o.N), code: 'set-discrete', hint: 'An inequality would allow ' + t('n=12.5') + ' tickets. Tickets are counted, so list them: ' + t('\\{0,\\ 1,\\ 2,\\ \\ldots\\}') + '.' }, { is: '\\{1, 2, 3, \\ldots, ' + o.N + '\\}', code: 'set-missing', hint: 'Don’t forget ' + t('n=0') + ': selling no tickets is possible.' }] }, t('n') + ' counts whole tickets from ' + t('0') + ' to ' + t(o.N) + ': ' + t('D=' + D) + '.', ['Whole numbers only — and the theatre limits the largest.', 'Use the dots key or type ... between the first values and the last.'], 'tickets domain'); } },
          { id: 'e10b', sub: 'b', level: 'PRG', make: function (r, o) { var R = '\\{0, ' + o.p + ', ' + 2 * o.p + ', \\ldots, ' + o.p * o.N + '\\}'; return oneSet('(b) State the range in set notation. (Write the first three values, then dots, then the last value.)', R, 'R', { which: 'R', rW: [{ is: rng('R', 0, o.p * o.N), code: 'set-discrete', hint: 'Revenue comes in steps of $' + o.p + ': list it with dots.' }, { is: '\\{0, 1, 2, \\ldots, ' + o.p * o.N + '\\}', code: 'set-extra', hint: 'Revenue goes up $' + o.p + ' per ticket, not $1.' }] }, 'Revenue is ' + t(o.p) + ' times a whole number from ' + t('0') + ' to ' + t(o.N) + '; the largest is ' + t(o.p + '\\times ' + o.N + '=' + o.p * o.N) + ': ' + t('R=' + R) + '.', ['Multiply the first few domain values and the last by ' + t(o.p) + '.'], 'tickets range'); } },
          { id: 'e10c', sub: 'c', level: 'PRG', make: function (r, o) { return numPart('(c) How many values are in the domain?', o.N + 1, [[o.N, 'cnt-zero', 'Don’t forget ' + t('n=0') + '.']], t('1') + ' to ' + t(o.N) + ' is ' + t(o.N) + ' values, plus ' + t('0') + ': ' + t(o.N + 1) + '.', ['Count ' + t('0') + ' too.'], 'count domain'); } },
          { id: 'e10d', sub: 'd', level: 'EMG', outcome: 'RF1', make: function (r, o) { var n = r.pick([50, 100, 150, 75]); n = Math.min(n, o.N); return mc(r, '(d) Does ' + t('(' + n + ',\\ ' + o.p * n + ')') + ' belong to this relation?', [{ html: '<b>Yes:</b> ' + t(o.p + '\\times ' + n + '=' + o.p * n) + ' <b>and</b> ' + t(n) + ' is a whole number no bigger than ' + t(o.N) + '.', right: true }, { html: '<b>No:</b> ' + t(n) + ' is too many tickets.', why: 'The theatre holds ' + t(o.N) + '.' }, { html: '<b>Yes:</b> because the equation works — nothing else matters.', why: 'The equation works, but the restriction matters too — check it as well.' }], 'Equation: ' + t(o.p + '\\times ' + n + '=' + o.p * n) + ' ✓. Restriction: ' + t(n) + ' is a whole number from ' + t('0') + ' to ' + t(o.N) + ' ✓. So yes.', ['Check the equation <b>and</b> the restriction.'], 'pair in relation'); } },
          { id: 'e10e', sub: 'e', level: 'PRG', outcome: 'RF1', make: function (r, o) { var n = r.pick([37.5, 12.5, 20.5, 45.5]); return mc(r, '(e) Does ' + t('(' + n + ',\\ ' + nn(o.p * n) + ')') + ' belong to this relation? The arithmetic works — so what is the problem?', [{ html: '<b>No:</b> ' + t(n) + ' is not a whole number of tickets, so it is not in the domain.', right: true }, { html: '<b>Yes:</b> the arithmetic works.', why: 'Can you sell half a ticket?' }, { html: '<b>No:</b> the revenue is too small.', why: 'The revenue matches the equation. Look at ' + t('n') + '.' }], t(o.p + '\\times ' + n + '=' + nn(o.p * n)) + ' is fine, but ' + t(n) + ' tickets is impossible: the domain has whole numbers only.', ['Is ' + t(n) + ' a possible number of tickets?'], 'half ticket'); } }] },
      { num: '11', shared: function (r) { return r.chance(0.25) ? { V: 600, q: 40 } : pickWhere(function () { return { q: r.pick([20, 25, 30, 40, 50, 60]), V: r.pick([300, 400, 450, 500, 600, 750, 900, 1200]) }; }, function (z) { return z.V % z.q === 0 && z.V / z.q <= 40; }); },
        stem: function (o) { return 'A water tank holds ' + t(o.V) + ' L. A valve is opened and the tank drains steadily at ' + t(o.q) + ' L per minute until it is empty. The volume left after ' + t('t') + ' minutes is ' + t('V=' + o.V + '-' + o.q + 't') + '.'; },
        parts: [
          { id: 'e11a', sub: 'a', level: 'EMG', make: function (r, o) { var T = o.V / o.q; return numPart('(a) How many minutes does the tank take to empty?', T, [[o.V * o.q, 'ctx-mult', 'Divide, don’t multiply.'], [o.V - o.q, 'value', 'Set ' + t('V=0') + ' and solve.']], t('0=' + o.V + '-' + o.q + 't') + ', ' + t('t=' + o.V + '\\div ' + o.q + '=' + T) + ' minutes.', ['Empty means ' + t('V=0') + '.'], 'time to empty', { after: 'min' }); } },
          { id: 'e11b', sub: 'b', level: 'PRG', make: function (r, o) { var T = o.V / o.q; return oneSet('(b) State the domain.', rng('t', 0, T), 't', { dW: [{ is: '\\{0, 1, 2, \\ldots, ' + T + '\\}', code: 'set-continuous', hint: 'Time flows smoothly: ' + t('t=7.3') + ' minutes happens too, so use an inequality.' }, { is: 't\\ge 0', code: 'set-arrow', hint: 'Draining stops when the tank is empty, at ' + t('t=' + T) + '.' }] }, 'From opening (' + t('t=0') + ') to empty (' + t('t=' + T) + '), every time in between happens: ' + t(rng('t', 0, T)) + ' minutes.', ['Is time counted in whole steps, or does it flow?'], 'tank domain'); } },
          { id: 'e11b2', sub: 'b, why', level: 'PRG', outcome: 'RF1', make: function (r, o) { return mc(r, 'Why is the domain an inequality rather than a list?', [{ html: 'Time runs smoothly, so every value in between (such as ' + t('7.3') + ' minutes) really happens — there is nothing to list.', right: true }, { html: 'Because the tank is big.', why: 'Size doesn’t matter. What kind of values can ' + t('t') + ' take?' }, { html: 'Because lists are only for negative numbers.', why: 'Lists are for separate values. Is time separate values?' }], 'Time is continuous: every moment between ' + t('0') + ' and empty is a real value of ' + t('t') + '.', ['Can ' + t('t') + ' be ' + t('2.5') + '?'], 'why inequality'); } },
          { id: 'e11c', sub: 'c', level: 'PRG', make: function (r, o) { return oneSet('(c) State the range.', rng('V', 0, o.V), 'V', { which: 'R', rW: [{ is: rng('V', 0, o.V / o.q), code: 'set-swap', hint: 'Those are times. The range is volumes.' }] }, 'The volume goes from ' + t(o.V) + ' L down to ' + t('0') + ' L: ' + t(rng('V', 0, o.V)) + ' litres.', ['Lowest volume? Highest?'], 'tank range'); } },
          { id: 'e11d', sub: 'd', level: 'EMG', outcome: 'RF1', make: function (r, o) { var T = o.V / o.q, t2 = T + r.pick([5, 10]), v = o.V - o.q * t2; return mc(r, '(d) Substituting ' + t('t=' + t2) + ' gives ' + t('V=' + v) + '. Why does this show ' + t('t=' + t2) + ' is outside the domain?', [{ html: 'A tank can’t hold ' + t(v) + ' L; it was already empty at ' + t('t=' + T) + '.', right: true }, { html: 'Because ' + t(t2) + ' is not a whole number.', why: t(t2) + ' is whole. Look at the volume it gives.' }, { html: 'It isn’t outside the domain.', why: 'Can a tank hold a negative volume?' }], t('V=' + v) + ' L is impossible; the tank emptied at ' + t('t=' + T) + ', so later times are outside the domain.', ['Can a volume be negative?'], 'negative volume'); } },
          { id: 'e11e', sub: 'e', level: 'PRG', outcome: 'RF1', make: function (r) { return mc(r, '(e) The domain in question 10 was a list and here it is an inequality. Why?', [{ html: 'Tickets come in whole units and are counted, while time can take any value across a stretch.', right: true }, { html: 'Because question 10 had money in it.', why: 'Money isn’t the reason. What kind of quantity is the input in each?' }, { html: 'Because this tank is smaller.', why: 'Size doesn’t matter. Can the input take in-between values?' }], 'Tickets are counted (discrete), so we list them; time is measured (continuous), so we use an inequality.', ['Can you have 12.5 tickets? 12.5 minutes?'], 'list vs inequality context'); } }] },
      { num: '12', shared: function (r) { return { P: r.chance(0.25) ? 40 : r.pick([12, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 44, 48, 50, 60, 64, 70, 80, 100]) }; },
        stem: function (o) { return 'A rectangle has a perimeter of ' + t(o.P) + ' cm. One side is ' + t('x') + ' cm long and the side next to it is ' + t('y') + ' cm long.'; },
        parts: [
          { id: 'e12a', sub: 'a', level: 'EMG', make: function (r, o) { var h = o.P / 2; return mc(r, '(a) Which shows that ' + t('y=' + h + '-x') + '?', [{ html: t('2x+2y=' + o.P) + ', so ' + t('x+y=' + h) + ' and ' + t('y=' + h + '-x') + '.', right: true }, { html: t('x+y=' + o.P) + ', so ' + t('y=' + o.P + '-x') + '.', why: 'A rectangle has <b>two</b> sides of each length: ' + t('2x+2y') + '.' }, { html: t('xy=' + o.P) + '.', why: t('xy') + ' is the area, not the perimeter.' }], 'Perimeter: ' + t('2x+2y=' + o.P) + '. Divide by 2: ' + t('x+y=' + h) + ', so ' + t('y=' + h + '-x') + '.', ['Add up all four sides.'], 'perimeter equation'); } },
          { id: 'e12b', sub: 'b', level: 'PRG', outcome: 'RF1', make: function (r, o) { return mc(r, '(b) Why must the domain use ' + t('x>0') + ' and not ' + t('x\\ge 0') + '?', [{ html: 'A side of length ' + t('0') + ' gives no rectangle at all.', right: true }, { html: 'Because lengths are whole numbers.', why: 'Lengths can be decimals. What happens when ' + t('x=0') + '?' }, { html: 'Because ' + t('y') + ' would be negative.', why: 'At ' + t('x=0') + ', ' + t('y=' + o.P / 2) + ' — not negative. The problem is ' + t('x') + ' itself.' }], 'If ' + t('x=0') + ' the shape is a flat line, not a rectangle, so ' + t('0') + ' is excluded: ' + t('x>0') + '.', ['Draw a rectangle with one side 0 cm.'], 'why x>0'); } },
          { id: 'e12c', sub: 'c', level: 'PRG', outcome: 'RF1', make: function (r, o) { var h = o.P / 2; return mc(r, '(c) Why must ' + t('x') + ' also stay below ' + t(h) + '?', [{ html: 'If ' + t('x=' + h) + ' then ' + t('y=0') + ', and if ' + t('x>' + h) + ' then ' + t('y') + ' is negative — neither is a rectangle.', right: true }, { html: 'Because ' + t('x') + ' must be smaller than ' + t('y') + '.', why: 'Either side can be longer. What happens to ' + t('y') + ' when ' + t('x') + ' reaches ' + t(h) + '?' }, { html: 'Because the perimeter is ' + t(o.P) + '.', why: 'True, but how does that stop ' + t('x') + ' at ' + t(h) + '? Look at ' + t('y') + '.' }], t('y=' + h + '-x') + ' must be positive, so ' + t('x<' + h) + '.', ['What is ' + t('y') + ' when ' + t('x=' + h) + '?'], 'why x<half'); } },
          { id: 'e12d', sub: 'd', level: 'ADV', make: function (r, o) { var h = o.P / 2; return drPart('(d) State the domain and the range.', rng('x', 0, h, false, false), rng('y', 0, h, false, false), { dW: [{ is: rng('x', 0, h), code: 'set-endpoint', hint: 'Neither ' + t('0') + ' nor ' + t(h) + ' gives a rectangle: use ' + t('<') + ' at both ends.' }, { is: rng('x', 0, o.P, false, false), code: 'set-values', hint: 'The other side ' + t('y=' + h + '-x') + ' must stay positive.' }], rW: [{ is: rng('y', 0, h), code: 'set-endpoint', hint: 'Use ' + t('<') + ' at both ends.' }] }, t('0<x<' + h) + ' (parts b and c), so ' + t('y=' + h + '-x') + ' also runs between ' + t('0') + ' and ' + t(h) + ', ends excluded: ' + t('0<y<' + h) + '.', ['Use parts (b) and (c).'], 'rectangle D and R'); } },
          { id: 'e12e', sub: 'e', level: 'PRG', make: function (r, o) {
            var h = o.P / 2, inC = function (resp) { var p = HW.parse.number(resp); if (!p.ok) return form('notnumber', 'Type one number.'); return p.value > 0 && p.value < h ? ok() : wrong('u5l5-not-between', t(nn(p.value)) + ' is not in the domain: ' + (p.value <= 0 ? 'a side must be longer than 0.' : 'then ' + t('y=' + nn(h - p.value)) + ', which is not a real side.')); };
            var outC = function (resp) { var p = HW.parse.number(resp); if (!p.ok) return form('notnumber', 'Type one number.'); return p.value > 0 && p.value < h ? wrong('u5l5-in-list', t(nn(p.value)) + ' <b>is</b> in the domain: it gives a ' + t(nn(p.value)) + ' cm by ' + t(nn(h - p.value)) + ' cm rectangle.') : ok(); };
            var p = B.fields('(e) Give one value of ' + t('x') + ' that is in the domain and one that is not.', [{ name: 'In the domain', label: 'In the domain', before: t('x=') }, { name: 'Not in the domain', label: 'Not in the domain', before: t('x=') }], [inC, outC], [String(h / 2 + 0.5), String(h)], 'For example ' + t('x=' + nn(h / 2 + 0.5)) + ' (in) and ' + t('x=' + h) + ' (not in).',
              'Any ' + t('x') + ' strictly between ' + t('0') + ' and ' + t(h) + ' works, e.g. ' + t('x=' + nn(h / 2 + 0.5)) + ' gives a ' + t(nn(h / 2 + 0.5)) + ' cm by ' + t(nn(h / 2 - 0.5)) + ' cm rectangle. ' + t('x=' + h) + ' is not in the domain: it gives ' + t('y=0') + '.', ['In: strictly between ' + t('0') + ' and ' + t(h) + '. Not in: anything else.'], 'in and out of domain');
            p.bad = [[String(h), String(h / 2)], ['0', '1']]; return p;
          } }] },
      { num: '13', shared: function (r) { return r.chance(0.25) ? { f: 3.5, k: 1.25, M: 30 } : { f: r.pick([2.5, 3, 3.5, 4, 4.5]), k: r.pick([1.25, 1.5, 2, 2.25, 2.5]), M: r.pick([20, 25, 30, 40, 50]) }; },
        stem: function (o) { return 'A taxi charges a $' + o.f.toFixed(2) + ' flat fee plus $' + o.k.toFixed(2) + ' for each kilometre driven. The longest trip the company will take is ' + t(o.M) + ' km. The cost of a ' + t('d') + '-kilometre trip is ' + t('C=' + nn(o.f) + '+' + nn(o.k) + 'd') + '.'; },
        parts: [
          { id: 'e13a', sub: 'a', level: 'EMG', make: function (r, o) { return oneSet('(a) State the domain.', rng('d', 0, o.M), 'd', { dW: [{ is: '\\{0, 1, 2, \\ldots, ' + o.M + '\\}', code: 'set-continuous', hint: 'A trip can be any distance, like ' + t('12.4') + ' km: use an inequality.' }, { is: 'd\\ge 0', code: 'set-arrow', hint: 'The company won’t go past ' + t(o.M) + ' km.' }] }, 'From ' + t('0') + ' km up to the longest trip, ' + t(o.M) + ' km: ' + t(rng('d', 0, o.M)) + ' km.', ['Shortest trip? Longest trip?'], 'taxi domain'); } },
          { id: 'e13b', sub: 'b', level: 'PRG', make: function (r, o) { var top = Math.round((o.f + o.k * o.M) * 100) / 100; return oneSet('(b) State the range.', rng('C', nn(o.f), nn(top)), 'C', { which: 'R', rW: [{ is: rng('C', 0, nn(top)), code: 'dr-no-b', hint: 'Even a 0 km trip costs the $' + o.f.toFixed(2) + ' fee.' }, { is: rng('C', nn(o.f), nn(o.k * o.M)), code: 'dr-no-b', hint: 'The longest trip also pays the fee: ' + t(nn(o.f) + '+' + nn(o.k) + '(' + o.M + ')') + '.' }] }, 'Cheapest: ' + t('d=0') + ' gives ' + t('C=' + nn(o.f)) + '. Most expensive: ' + t('C=' + nn(o.f) + '+' + nn(o.k) + '(' + o.M + ')=' + nn(top)) + '. ' + t(rng('C', nn(o.f), nn(top))) + ' dollars.', ['Substitute the smallest and largest distances.'], 'taxi range'); } },
          { id: 'e13c', sub: 'c', level: 'EMG', outcome: 'RF1', make: function (r) { return mc(r, '(c) Is this relation discrete or continuous?', [{ html: '<b>Continuous:</b> a trip can be any distance, such as ' + t('12.4') + ' km, so the values can’t be listed.', right: true }, { html: '<b>Discrete:</b> money comes in cents.', why: 'The <b>distance</b> (the input) can be any value. Is the input counted or measured?' }, { html: '<b>Discrete:</b> taxis drive whole kilometres.', why: 'A trip of ' + t('3.7') + ' km is possible.' }], 'Distance is measured, not counted: every distance from ' + t('0') + ' to the maximum is possible, so the relation is continuous.', ['Can a trip be 3.7 km?'], 'taxi continuous'); } },
          { id: 'e13d', sub: 'd', level: 'EMG', outcome: 'RF1', make: function (r, o) { return mc(r, '(d) Why does the range not start at $0?', [{ html: 'The $' + o.f.toFixed(2) + ' flat fee is charged before any distance is driven, so the cheapest trip still costs $' + o.f.toFixed(2) + '.', right: true }, { html: 'Because nobody takes a 0 km trip.', why: 'Even at ' + t('d=0') + ' the formula gives the fee. Why?' }, { html: 'Because the domain doesn’t start at 0.', why: 'It does start at 0. What does ' + t('d=0') + ' cost?' }], t('d=0') + ' gives ' + t('C=' + nn(o.f)) + ': the flat fee.', ['What does a 0 km trip cost?'], 'why range not 0'); } }] },
      { num: '14', section: 'Extra Practice D — Words, Set Notation, and Number Lines', stem: 'Write each description using an inequality or a list in braces, whichever fits.', parts: (function () {
        var items = [
          ['a', 'BEG', function (r) { var a = r.chance(0.25) ? -3 : r.pick(nz(-12, 12)); return ['All numbers greater than ' + t(a) + '.', 'x>' + a, [{ is: 'x\\ge ' + a, code: 'set-endpoint', hint: '“Greater than” does not include ' + t(a) + ': use ' + t('>') + '.' }]]; }],
          ['b', 'BEG', function (r) { var a = r.chance(0.25) ? 2 : r.int(-6, 3), b = a + r.int(3, 9); return ['All numbers from ' + t(a) + ' to ' + t(b) + ', including both ends.', rng('x', a, b), [{ is: rng('x', a, b, false, false), code: 'set-endpoint', hint: '“Including both ends”: use ' + t('\\le') + ' twice.' }]]; }],
          ['c', 'BEG', function (r) { var a = r.chance(0.25) ? 0 : r.pick(nz(-12, 12)); return ['All numbers less than or equal to ' + t(a) + '.', 'x\\le ' + a, [{ is: 'x<' + a, code: 'set-endpoint', hint: '“Or equal to” includes ' + t(a) + '.' }]]; }],
          ['d', 'EMG', function (r) { var a = r.chance(0.25) ? -5 : r.int(-8, 0), b = a + r.int(3, 7); return ['All numbers between ' + t(a) + ' and ' + t(b) + ', including neither end.', rng('x', a, b, false, false), [{ is: rng('x', a, b), code: 'set-endpoint', hint: '“Including neither end”: use ' + t('<') + ' twice.' }]]; }],
          ['e', 'EMG', function (r) { var a = r.chance(0.25) ? 1 : r.int(-2, 3), b = a + r.int(3, 6), v = range(a, b); return ['Every whole number from ' + t(a) + ' to ' + t(b) + '.', lst(v), [{ is: rng('x', a, b), code: 'set-discrete', hint: 'Only <b>whole</b> numbers: list them in braces.' }]]; }],
          ['f', 'EMG', function (r) { var a = r.chance(0.25) ? -1 : r.int(-6, 2), b = a + r.int(3, 8); return ['All numbers that are at least ' + t(a) + ' but under ' + t(b) + '.', rng('x', a, b, true, false), [{ is: rng('x', a, b, false, true), code: 'dr-open-side', hint: '“At least ' + a + '” includes ' + t(a) + '; “under ' + b + '” excludes ' + t(b) + '.' }, { is: rng('x', a, b), code: 'set-endpoint', hint: '“Under ' + b + '” leaves ' + t(b) + ' out.' }]]; }]];
        return items.map(function (it) { return { id: 'e14' + it[0], sub: it[0], level: it[1], make: function (r) { var q = it[2](r); return oneSet(q[0], q[1], 'x', { dW: q[2], label: 'Set' }, t(q[1]) + '.', ['“Or equal”, “at least”, “including” → ' + t('\\le') + ' or ' + t('\\ge') + '; “greater”, “less”, “under”, “neither end” → ' + t('<') + ' or ' + t('>') + '.'], 'words to notation ' + it[0]); } }; });
      })() },
      { num: '15', stem: 'Write the set shown by each number line. Look closely at whether each dot is solid or open.', parts: (function () {
        var items = [
          ['a', 'EMG', function (r) { var a = r.chance(0.25) ? -2 : r.int(-5, 5); return { v: { dots: [{ x: a }], shade: [[a, null]] }, T: 'x\\ge ' + a, W: [{ is: 'x>' + a, code: 'set-endpoint', hint: 'The dot is solid: ' + t(a) + ' is included.' }] }; }],
          ['b', 'EMG', function (r) { var a = r.chance(0.25) ? 4 : r.int(-5, 5); return { v: { dots: [{ x: a, open: true }], shade: [[null, a]] }, T: 'x<' + a, W: [{ is: 'x\\le ' + a, code: 'set-endpoint', hint: 'The dot is open: ' + t(a) + ' is not included.' }, { is: 'x>' + a, code: 'nl-side', hint: 'The shading goes to the <b>left</b>: smaller numbers.' }] }; }],
          ['c', 'PRG', function (r) { var a = r.chance(0.25) ? -1 : r.int(-4, 0), b = a + r.int(2, 5); return { v: { dots: [{ x: a }, { x: b, open: true }], shade: [[a, b]] }, T: rng('x', a, b, true, false), W: [{ is: rng('x', a, b, false, true), code: 'dr-open-side', hint: 'The <b>solid</b> dot is at ' + t(a) + ' (included), the open one at ' + t(b) + '.' }] }; }],
          ['d', 'EMG', function (r) { var v = r.chance(0.25) ? [-4, -1, 2, 5] : r.sample(range(-5, 5), 4).sort(function (a, b) { return a - b; }); return { v: { dots: v.map(function (x) { return { x: x }; }), shade: [] }, T: lst(v), W: [{ is: rng('x', v[0], v[3]), code: 'set-discrete', hint: 'Nothing is shaded between the dots: list just the dots.' }] }; }]];
        return items.map(function (it) { return { id: 'e15' + it[0], sub: it[0], level: it[1], make: function (r) { var q = it[2](r); return oneSet(nlSvg(-6, 6, q.v), q.T, 'x', { dW: q.W, label: 'Set' }, t(q.T) + '.', ['Solid dot → included (' + t('\\le') + ', ' + t('\\ge') + '); open → not included (' + t('<') + ', ' + t('>') + '); arrow → keeps going; separate dots → a list.'], 'number line to notation ' + it[0]); } }; });
      })() },
      { num: '16', stem: 'Draw each set on the number line. Use a solid dot for an included end, an open dot for an excluded end, and shade (with the arrow) where the set never stops.', parts: (function () {
        var items = [
          ['a', 'EMG', function (r) { var a = r.chance(0.25) ? -4 : r.int(-5, 5); return r.chance(0.5) ? 'x\\le ' + a : 'x<' + a; }],
          ['b', 'PRG', function (r) { var a = r.chance(0.25) ? -2 : r.int(-4, 0), b = a + r.int(3, 6); return rng('x', a, b, false, true); }],
          ['c', 'EMG', function (r) { var a = r.chance(0.25) ? 0 : r.int(-5, 5); return r.chance(0.5) ? 'x>' + a : 'x\\ge ' + a; }],
          ['d', 'BEG', function (r) { var v = r.chance(0.25) ? [-5, -2, 1, 4] : r.sample(range(-5, 5), 4).sort(function (a, b) { return a - b; }); return lst(v); }]];
        return items.map(function (it) { return { id: 'e16' + it[0], sub: it[0], level: it[1], make: function (r) { var T = it[2](r); return B.numline('Show ' + t(T) + ' on the number line.', { min: -6, max: 6, step: 1 }, T, 'Solid dot where the end is included, open dot where it isn’t; shade every included number' + (/\\\{/.test(T) ? ' — here only the separate dots, no shading.' : ', with the arrow where the set never stops.'), ['Solid dot: ' + t('\\le') + ' or ' + t('\\ge') + '. Open dot: ' + t('<') + ' or ' + t('>') + '.'], 'draw ' + it[0]); } }; });
      })() },
      { num: '17', section: 'Extra Practice E — Error Analysis, Working Backwards, and a Stretch', shared: function (r) { return r.chance(0.25) ? { p: 2, N: 50, x: 12.7 } : { p: r.pick([2, 3, 4]), N: r.pick([24, 30, 40, 60]), x: r.pick([12.7, 8.5, 15.3]) }; },
        stem: function (o) { return '<b>Error analysis.</b> A bakery sells muffins for $' + o.p + ' each and bakes at most ' + t(o.N) + ' per day. Marcus writes the domain (the number of muffins sold, ' + t('n') + ') as “' + t(rng('n', 0, o.N)) + '.”'; },
        parts: [
          { id: 'e17a', sub: 'a', level: 'PRG', make: function (r, o) { return mc(r, 'Test his answer with ' + t('n=' + o.x) + '. What is wrong with his notation?', [{ html: 'His inequality allows ' + t('n=' + o.x) + ', but the bakery can’t sell ' + t(o.x) + ' muffins: the situation is discrete, so it needs a list.', right: true }, { html: 'Nothing: ' + t(o.x) + ' is between ' + t('0') + ' and ' + t(o.N) + '.', why: 'It is between them — but can you sell ' + t(o.x) + ' muffins?' }, { html: 'The upper bound should be ' + t(o.N * o.p) + '.', why: 'That is the most money, not the most muffins.' }], t('0\\le n\\le ' + o.N) + ' includes ' + t(o.x) + ', which is impossible for a count of muffins. Muffins are counted, so list the whole numbers.', ['Can you sell part of a muffin?'], 'Marcus error'); } },
          { id: 'e17b', sub: 'b', level: 'PRG', make: function (r, o) { var D = '\\{0, 1, 2, \\ldots, ' + o.N + '\\}'; return oneSet('Write the correct domain.', D, 'n', { dW: [{ is: rng('n', 0, o.N), code: 'set-discrete', hint: 'That is Marcus’s answer. List the whole numbers instead (use dots).' }, { is: '\\{1, 2, 3, \\ldots, ' + o.N + '\\}', code: 'set-missing', hint: 'Selling 0 muffins is possible too.' }] }, t('D=' + D) + ' — the whole numbers from ' + t('0') + ' to ' + t(o.N) + '.', ['Whole numbers from 0 to the most they bake; use … in the middle.'], 'Marcus corrected'); } }] },
      { num: '18', shared: function (r) { return { a: r.chance(0.25) ? 3 : r.int(2, 6) }; },
        stem: function (o) { return '<b>Error analysis.</b> Tia says: “The domain of ' + t('y=x^{2}') + ' is ' + t('x\\ge 0') + ', because the range is ' + t('y\\ge 0') + '.”'; },
        parts: [
          { id: 'e18a', sub: 'a', level: 'PRG', make: function (r, o) { return mc(r, 'Use the ordered pair ' + t('(-' + o.a + ',\\ ' + o.a * o.a + ')') + ' to explain her mistake.', [{ html: t('(-' + o.a + ')^{2}=' + o.a * o.a) + ', so ' + t('-' + o.a) + ' is an input that works. She mixed up domain (inputs) with range (outputs): squaring restricts what comes <b>out</b>, not what goes <b>in</b>.', right: true }, { html: t('(-' + o.a + ',\\ ' + o.a * o.a + ')') + ' is not on the graph, so she is right.', why: 'Check: ' + t('(-' + o.a + ')^{2}=' + o.a * o.a) + '.' }, { html: 'She mixed up ' + t('\\le') + ' and ' + t('\\ge') + '.', why: 'The symbol isn’t the issue. Is ' + t('-' + o.a) + ' allowed as an input?' }], t('(-' + o.a + ')^{2}=' + o.a * o.a) + ', so the pair is on the graph and ' + t('-' + o.a) + ' is in the domain. The outputs are never negative, but the inputs can be.', ['Is ' + t('x=-' + o.a) + ' allowed?'], 'Tia error'); } },
          { id: 'e18b', sub: 'b', level: 'PRG', make: function (r) { return drPart('Write the correct domain and range.', ALLX, 'y\\ge 0', { dW: [{ is: 'x\\ge 0', code: 'set-swap', hint: 'That is Tia’s mistake: negative inputs work too.' }] }, 'D: all real numbers; ' + t('R:\\ y\\ge 0') + '.', [HALL], 'x^2 corrected'); } }] },
      { num: '19', stem: function (o) { return '<b>Work backwards.</b> Describe a relation whose domain is ' + t('x\\ge ' + o.a) + ' and whose range is ' + t('y\\le ' + o.b) + '.'; }, shared: function (r) { return r.chance(0.3) ? { a: 3, b: 0 } : pickWhere(function () { return { a: r.int(-2, 4), b: r.int(-2, 3) }; }, function (z) { return z.a !== z.b; }); },
        parts: [
          { id: 'e19s', sub: 'sketch', level: 'MAS', make: function (r, o) { var A = o.a, Bv = o.b, P0 = '(' + A + ',\\ ' + Bv + ')';
            return sketchPart('Sketch one such relation on the grid.', { domain: 'x\\ge ' + A, range: 'y\\le ' + Bv }, drw([seg([A, Bv], [A + Math.min(5.6 - A, Bv + 5.6), Bv - Math.min(5.6 - A, Bv + 5.6)], 'closed', 'arrow')]), [drw([seg([A, Bv], [A + Math.min(5.6 - A, 5.6 - Bv), Bv + Math.min(5.6 - A, 5.6 - Bv)], 'closed', 'arrow')]), drw([seg([A, Bv], [A + 2, Bv - 2])]), drw([seg([A, Bv], [A + Math.min(5.6 - A, Bv + 5.6), Bv - Math.min(5.6 - A, Bv + 5.6)], 'open', 'arrow')])],
              'For example a ray from the <b>solid</b> point ' + t(P0) + ' going down and to the right forever (an arrow at the end).', ['Where must it start? Solid or open?', 'Which way must it go so ' + t('x') + ' grows and ' + t('y') + ' falls?'], 'sketch x>=a, y<=b');
          } },
          { id: 'e19a', sub: 'a', level: 'PRG', make: function (r, o) { var A = o.a, Bv = o.b, P0 = '(' + A + ',\\ ' + Bv + ')'; return mc(r, '(a) Where must the graph start, and is that point solid or open?', [{ html: 'At ' + t(P0) + ', <b>solid</b>: ' + t('x\\ge ' + A) + ' includes ' + t(A) + ' and ' + t('y\\le ' + Bv) + ' includes ' + t(Bv) + '.', right: true }, { html: 'At ' + t(P0) + ', open.', why: t('\\ge') + ' and ' + t('\\le') + ' include their end values.' }, { html: 'At ' + t('(' + Bv + ',\\ ' + A + ')') + ', solid.', why: 'The ' + t('x') + '-value ' + t(A) + ' comes first: ' + t(P0) + '.' }], t('x\\ge ' + A) + ' starts at ' + t('x=' + A) + ' and ' + t('y\\le ' + Bv) + ' tops out at ' + t('y=' + Bv) + ', both included: solid point ' + t(P0) + '.', ['Smallest ' + t('x') + '? Largest ' + t('y') + '?'], 'start point'); } },
          { id: 'e19b', sub: 'b', level: 'PRG', make: function (r, o) { var A = o.a, Bv = o.b, P0 = '(' + A + ',\\ ' + Bv + ')'; return mc(r, '(b) Which way must it travel from there?', [{ html: '<b>Right and down:</b> right so the ' + t('x') + '-values grow past ' + t(A) + ', down so the ' + t('y') + '-values drop below ' + t(Bv) + '.', right: true }, { html: 'Right and up.', why: 'Up would give ' + t('y>' + Bv) + ' — not allowed.' }, { html: 'Left and down.', why: 'Left would give ' + t('x<' + A) + ' — not allowed.' }], 'Right (' + t('x\\ge ' + A) + ') and down (' + t('y\\le ' + Bv) + ').', ['Which direction makes ' + t('x') + ' bigger? ' + t('y') + ' smaller?'], 'direction'); } },
          { id: 'e19c', sub: 'c', level: 'ADV', make: function (r, o) { var A = o.a, Bv = o.b, P0 = '(' + A + ',\\ ' + Bv + ')';
            var KEY = 'y=' + (A + Bv) + '-x'; var chk = function (resp) {
              var f = fnOf(resp); if (!f) return form('eq-unreadable', 'Type an equation that starts with ' + t('y=') + ', e.g. ' + t(KEY) + '.');
              var f3 = f(A); if (!isFinite(f3) || Math.abs(f3 - Bv) > 1e-9) return wrong('rule-through', 'At ' + t('x=' + A) + ' your equation gives ' + t('y=' + nn(Math.round(f3 * 1000) / 1000)) + ', but the graph must start at ' + t(P0) + '.');
              for (var x = A; x <= A + 60; x += 0.5) { var y = f(x); if (!isFinite(y) || y > Bv + 1e-9) return wrong('rule-range', 'At ' + t('x=' + x) + ' your equation gives ' + t('y=' + nn(Math.round(y * 1000) / 1000)) + ', above ' + t(Bv) + '. The range is ' + t('y\\le ' + Bv) + ': the graph must go <b>down</b>.'); }
              if (!(f(1e6) < -100)) return wrong('rule-range', 'Your graph doesn’t keep going down: the range must reach every negative number.');
              return ok();
            };
            return eqPart('(c) Write an equation for your relation (for ' + t('x\\ge ' + A) + ').', chk, KEY, 'For example ' + t(KEY) + ': ' + t('x=' + A) + ' gives ' + t('y=' + Bv) + ', and as ' + t('x') + ' grows ' + t('y') + ' falls forever. (' + t('y=-\\sqrt{' + (A === 0 ? 'x' : 'x' + (A > 0 ? '-' + A : '+' + (-A))) + '}' + (Bv ? (Bv > 0 ? '+' + Bv : Bv) : '')) + ' works too.)', ['A line through ' + t(P0) + ' going down: try ' + t('y=a-x') + ' and choose ' + t('a') + '.'], 'equation x>=a y<=b', ['y=x' + (A + Bv ? '+' + (-A + Bv) : ''), 'y=' + (A + Bv + 1) + '-x', 'y=' + Bv]);
          } }] },
      { num: '20', section: 'Stretch', stem: '<b>Stretch:</b> when the domain and the range are the same set.', parts: [
        { id: 'e20a', sub: 'a', level: 'MAS', make: function (r) {
          var n = r.chance(0.5) ? 3 : 4, S0 = range(1, n).map(function (k) { return k + (r.chance(0.25) ? 0 : 0); }), base = r.pick([0, 0, 1, 4]), vals = S0.map(function (k) { return k + base; }), Ls = lst(vals);
          var chk = function (resp) {
            var L = pairsIn(resp); if (L.empty) return form('empty', 'Type the ordered pairs.'); if (L.bad) return form('unreadable', 'Write ordered pairs like ' + t('(1,\\ 2),\\ (2,\\ 3)') + '.');
            var P = L.pairs; if (P.length !== n) return wrong('pairs-count', 'Use exactly ' + n + ' ordered pairs.');
            if (P.some(function (p) { return Math.abs(p[0] - p[1]) < 1e-9; })) return wrong('pairs-count', 'Pairs like ' + t('(a,\\ a)') + ' are not allowed here.');
            var xs = uniq(P.map(function (p) { return p[0]; })), ys = uniq(P.map(function (p) { return p[1]; }));
            if (xs.join() !== vals.join()) return wrong('pairs-count', 'The first coordinates must be exactly ' + t(Ls) + ', each once.');
            if (ys.join() !== vals.join()) return wrong('pairs-count', 'The second coordinates must also be exactly ' + t(Ls) + ', each once.');
            return ok();
          };
          var key = vals.map(function (v, i) { return '(' + v + ', ' + vals[(i + 1) % n] + ')'; }).join(', ');
          return { prompt: 'Write ' + n + ' ordered pairs whose domain <b>and</b> range are both ' + t(Ls) + ', without using any pair like ' + t('(a,\\ a)') + '.', input: { type: 'math', keys: 'pairs', placeholder: 'e.g. (1, 2), (2, 3), …' }, check: chk, key: key, answer: t(key) + ' (one possible answer)',
            solution: 'Shift each value to the next one and wrap around: ' + t(key) + '. The first coordinates are ' + t(Ls) + ' and so are the second coordinates.', hints: ['Each value must appear once as a first coordinate and once as a second coordinate.', 'Try pairing each number with the next one, and the last with the first.'], text: 'same D and R pairs',
            bad: [vals.map(function (v) { return '(' + v + ', ' + v + ')'; }).join(', '), vals.map(function (v) { return '(' + v + ', ' + vals[0] + ')'; }).join(', ')] };
        } },
        { id: 'e20b', sub: 'b', level: 'PRG', make: function (r) {
          var chk = function (resp) { var f = fnOf(resp); if (!f) return form('eq-unreadable', 'Type an equation that starts with ' + t('y=') + '.'); var a = f(0), b = f(1), c = f(2), d = f(-7.5); if (![a, b, c, d].every(isFinite)) return wrong('eq-not-line', 'Every real number must be allowed as an input.'); if (Math.abs((c - b) - (b - a)) > 1e-9 || Math.abs(d - (a - 7.5 * (b - a))) > 1e-6) return wrong('eq-not-line', 'That isn’t a linear equation (a straight line).'); if (Math.abs(b - a) < 1e-12) return wrong('dr-one-value', 'A horizontal line has only one output, so its range isn’t every real number. Use a slanted line.'); return ok(); };
          return eqPart('Give a linear equation whose domain and range are both every real number.', chk, 'y=x', 'Any slanted line works, e.g. ' + t('y=x') + ' or ' + t('y=2x-7') + ': it stretches forever left, right, up and down.', ['A slanted line goes forever in every direction. A horizontal one does not.'], 'line D=R=all', ['y=3', 'y=x^2']);
        } },
        { id: 'e20c', sub: 'c', level: 'PRG', make: function (r) { return mc(r, 'The domain of ' + t('y=\\sqrt{x}') + ' is ' + t('x\\ge 0') + ' and its range is ' + t('y\\ge 0') + '. Why is it fair to say they are the same set?', [{ html: 'Both are all the numbers that are zero or greater; the letter only records whether a value is an input or an output.', right: true }, { html: 'Because ' + t('x=y') + ' for every point.', why: 'Not true: ' + t('(4,\\ 2)') + ' is on the graph. Compare the sets of numbers.' }, { html: 'They aren’t the same: one uses ' + t('x') + ' and one uses ' + t('y') + '.', why: 'The letters differ, but which numbers does each set contain?' }], 'Both sets are “all numbers ' + t('\\ge 0') + '”. The letter only says whether the numbers are inputs or outputs.', ['List a few numbers in each set.'], 'same set different letter'); } },
        { id: 'e20d', sub: 'd', level: 'EMG', make: function (r) { var k = r.chance(0.5) ? 5 : r.pick(nz(-6, 9)); var p = K.P.pairs('Write a relation whose domain is ' + t('\\{' + k + '\\}') + ' and whose range is also ' + t('\\{' + k + '\\}') + '.', [[k, k]], {}, 'The single ordered pair ' + t('(' + k + ',\\ ' + k + ')') + ' — its graph is one dot.', ['How many ordered pairs can there be with only one input and one output?'], 'D=R={k}'); p.bad = ['\\{(' + k + ', 0)\\}']; return p; } }] }
    ];
  }
})(window);
