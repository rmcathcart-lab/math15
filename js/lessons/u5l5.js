/* Math 15 · Unit 5 · Lesson 5 — Domain and Range of a Relation, Part 1: Reading From a Graph (RF2)
 * Assignment 5 (u5_L05.tex, Questions 1–13) and the Lesson 5 Extra Practice (u5_EP05.tex, Questions 1–18).
 * Every part is a generator that keeps the booklet question's structure (a segment, a curve whose highest or lowest point
 * is inside the graph, separate dots with a repeated value, a context graph) and changes the numbers; the booklet's own
 * graphs are among the possible values. Curves are drawn as smooth monotone splines through lattice points, so their
 * highest and lowest points are exactly at plotted lattice points (as in the booklet's "smooth" TikZ curves).
 * Answer format: the lesson writes domain and range in words — "x can be any value from −3 to 2" for an unbroken graph,
 * a list "−3, 0, 4" for separate dots — so the answer box takes "−3 to 2" or "−3, 0, 4" (a "to" key on the keypad);
 * inequalities (−3 ≤ x ≤ 2) and lists in braces are accepted too. The Extra Practice asks for inequalities, braces,
 * open circles and arrows (its own notation note), so its boxes expect that notation (words are still accepted where
 * they say the same thing). Duplicates in a list get a nudge; order is not required (booklet L6: "not yet required").
 * Conversions: fill-in-the-blank and "explain" → multiple choice with reasons; True/False → buttons; sketches (EP 15, 16,
 * 18) → the graph pad, checked by rules (domain, range) with targeted hints.
 * Model: Math 10C u5l4 (sketch checkers, set checker K.set from js/relfn.js).
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Main outcome RF2; the "why can't t be negative" and "discrete or continuous"
 * questions about real situations (Q9c, Q10c, Q13c) are RF1. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, S = HW.sets, Dr = HW.draw;

  HW.addCodes({
    'set-repeat': 'Wrote a value twice in a list', 'dr-peak': 'Used the endpoints instead of the highest/lowest point', 'dr-scale': 'Misread the axis scale',
    'dr-copy': 'Gave the same set for domain and range', 'dr-one-value': 'Interval for a line with only one value', 'dr-ray-dir': 'Wrong direction for the ray',
    'dr-open-side': 'Open dot attached to the wrong bound', 'dr-gap': 'Missed a gap between two pieces', 'dr-fill-gap': 'Filled a gap that isn’t there',
    'sk-swap': 'Sketch: domain and range swapped', 'sk-join': 'Sketch: joined points for a list domain', 'sk-points': 'Sketch: points instead of a line for an interval',
    'sk-ends': 'Sketch: wrong end dots / arrows', 'sk-same-range': 'Sketch: same range as the given graph', 'u5l5-not-between': 'Gave a value outside the graph’s domain',
    'u5l5-in-list': 'Gave a value that is already a dot', 'u5l5-wrong-letter': 'Wrote the range with x instead of y', 'u5l5-count-all': 'Counted repeated values',
    'set-backwards': 'Wrote the larger value first', 'int-missing': 'Missed one of the answers'
  });
  HW.addPartial({ 'u5l5-not-between': 'n', 'u5l5-in-list': 'n', 'u5l5-wrong-letter': 's', 'u5l5-count-all': 'b', 'dr-gap': 'b', 'dr-fill-gap': 'b' });

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
    var fl = [{ label: 'Domain', name: 'Domain', mode: 'math', keys: KEYS, vars: [dv, rv], placeholder: ph, wide: true }, { label: 'Range', name: 'Range', mode: 'math', keys: KEYS, vars: [dv, rv], placeholder: wm ? ph : 'e.g. -1 < ' + rv + ' <= 4', wide: true }];
    if (o.only) fl = fl.filter(function (f, i) { return o.only === (i ? 'R' : 'D'); });
    var cD = drChk(Dt, { v: dv, other: o.noOther ? null : Rt, otherName: 'range', wrong: o.dW, ctx: o.dC, words: wm, name: 'domain', braces: o.braces }), cR = drChk(Rt, { v: rv, other: o.noOther ? null : Dt, otherName: 'domain', wrong: o.rW, ctx: o.rC, words: wm, name: 'range', letterWrong: o.letterWrong, braces: o.braces });
    var kD = keyOf(Dt, dv, wm), kR = keyOf(Rt, rv, wm);
    var aD = (wm ? 'Domain: ' : t('D:') + ' ') + ansOf(Dt, dv, wm), aR = (wm ? 'Range: ' : t('R:') + ' ') + ansOf(Rt, rv, wm);
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

  /* ---------------- shapes ---------------- */
  function segShape(r, bk) { // a segment between two lattice points, not horizontal or vertical
    return pickWhere(function () { if (bk && r.chance(0.25)) return bk; var a = r.int(-5, 2), b = a + r.int(3, 6), c = r.int(-5, 3), d2 = r.chance(0.5) ? c + r.int(3, 7) : c - r.int(3, 7); return [[a, c], [b, d2]]; }, function (s) { return s[1][0] <= 5 && Math.abs(s[1][1]) <= 6 && Math.abs(s[0][1]) <= 6; });
  }

  HW.defineLesson({
    id: 'u5l5', unit: 5, num: 5, title: 'Domain and Range of a Relation, Part 1: Reading From a Graph', outcome: 'RF2',
    blurb: 'Reading how far a graph stretches left to right (domain) and bottom to top (range); separate dots give a list, an unbroken graph goes from one value to another.',
    questions: [
      /* ---------------- Q1: vocabulary ---------------- */
      { num: '1', section: 'Part A — Reading Domain and Range From a Graph', stem: 'Fill in each blank.', parts: [
        { id: '1a', level: 'LIM', make: function (r) {
          return B.mc(r, 'The domain of a relation is the set of all possible ________-values.', [{ html: t('x'), right: true }, { html: t('y'), why: 'The ' + t('y') + '-values make up the <b>range</b>. The domain is the inputs, read left to right.' }, { html: 'positive', why: 'A domain can include negative values too. Which coordinate does the domain describe?' }, { html: 'whole-number', why: 'A domain can include fractions and decimals too. Which coordinate does the domain describe?' }],
            'The domain is the set of all possible <b>' + t('x') + '-values</b> (the inputs).', [HD], 'domain = x-values');
        } },
        { id: '1b', level: 'LIM', make: function (r) {
          return B.mc(r, 'The range of a relation is the set of all possible ________-values.', [{ html: t('y'), right: true }, { html: t('x'), why: 'The ' + t('x') + '-values make up the <b>domain</b>. The range is the outputs, read bottom to top.' }, { html: 'positive', why: 'A range can include negative values too. Which coordinate does the range describe?' }, { html: 'whole-number', why: 'A range can include fractions too. Which coordinate does the range describe?' }],
            'The range is the set of all possible <b>' + t('y') + '-values</b> (the outputs).', [HR], 'range = y-values');
        } },
        { id: '1c', level: 'BEG', make: function (r) {
          return B.mc(r, 'A <b>discrete</b> graph is made up of separate ________.', [{ html: 'dots (points)', right: true }, { html: 'curves', why: 'A curve is unbroken — that is a continuous graph. Discrete means separate.' }, { html: 'arrows', why: 'Arrows show a graph keeps going. Discrete means separate pieces — which kind?' }, { html: 'axes', why: 'Every graph has axes. What is a discrete graph itself made of?' }],
            'A discrete graph is made of separate <b>dots</b> (points) that are not joined.', ['Discrete means “separate”.'], 'discrete = dots');
        } },
        { id: '1d', level: 'BEG', make: function (r) {
          return B.mc(r, 'A <b>continuous</b> graph is an unbroken ________.', [{ html: 'line or curve', right: true }, { html: 'set of dots', why: 'Separate dots make a discrete graph. Continuous means no gaps.' }, { html: 'list of numbers', why: 'A list describes the domain of a discrete graph. What does a continuous graph look like?' }, { html: 'arrow', why: 'An arrow can end a continuous graph, but the graph itself is something unbroken — what?' }],
            'A continuous graph is an unbroken <b>line or curve</b>, with no gaps.', ['Continuous means “no gaps”.'], 'continuous = line or curve');
        } }] },
      /* ---------------- Q2: domain of a segment ---------------- */
      { num: '2', stem: 'State the domain of each graph below.', parts: [
        { id: '2a', level: 'BEG', make: function (r) {
          var s = segShape(r, [[-3, -4], [2, 2]]), A = s[0], C = s[1];
          return drPart(segG(A, C), rng('x', A[0], C[0]), rng('y', Math.min(A[1], C[1]), Math.max(A[1], C[1])), { only: 'D', words: true },
            'The segment starts at ' + t(ptT(A)) + ' (leftmost) and ends at ' + t(ptT(C)) + ' (rightmost). Every ' + t('x') + '-value in between is used, so ' + wordsTex('x', A[0], C[0]) + '.', [HD, 'Read only the ' + t('x') + '-coordinates of the two end dots.'], 'domain of a segment');
        } },
        { id: '2b', level: 'BEG', make: function (r) {
          var o = r.chance(0.25) ? [-5, 5, 1] : pickWhere(function () { return [-r.int(2, 6), r.int(2, 6), r.pick([1, -1])]; }, function () { return true; });
          var A = o[2] > 0 ? [o[0], 0] : [o[0], o[1]], C = o[2] > 0 ? [0, o[1]] : [0, 0];
          if (r.chance(0.4)) { A = [0, o[2] > 0 ? 0 : o[1]]; C = [-o[0], o[2] > 0 ? o[1] : 0]; }
          return drPart(segG(A, C), rng('x', A[0], C[0]), rng('y', Math.min(A[1], C[1]), Math.max(A[1], C[1])), { only: 'D', words: true,
            dW: [{ is: rng('x', Math.min(A[1], C[1]), Math.max(A[1], C[1])), code: 'set-swap', hint: 'Those are the ' + t('y') + '-values (the range). The domain is read along the ' + t('x') + '-axis: left to right.' }] },
            'The segment runs from ' + t(ptT(A)) + ' to ' + t(ptT(C)) + '. One end is on the ' + t('y') + '-axis, so ' + t('x=0') + ' is an end value. ' + wordsTex('x', A[0], C[0]) + '.', [HD, 'An end on the ' + t('y') + '-axis has ' + t('x=0') + '.'], 'domain, end on an axis');
        } }] },
      /* ---------------- Q3: range of a curve ---------------- */
      { num: '3', stem: 'State the range of each graph below.', parts: [
        { id: '3a', level: 'BEG', make: function (r) {
          var o = r.chance(0.25) ? { c: 0, lo: -2, mid: 0, top: 4 } : pickWhere(function () { var lo = r.int(-4, 0), mid = lo + r.int(1, 2); return { c: r.int(-1, 1), lo: lo, mid: mid, top: mid + r.int(2, 4) }; }, function (z) { return z.top <= 5; });
          var P = [[o.c - 2, o.top], [o.c - 1, o.mid], [o.c, o.lo], [o.c + 1, o.mid], [o.c + 2, o.top]];
          return drPart(curveG(P), rng('x', o.c - 2, o.c + 2), rng('y', o.lo, o.top), { only: 'R', words: true,
            rW: [{ is: rng('y', o.c - 2, o.c + 2), code: 'set-swap', hint: 'Those are the ' + t('x') + '-values (the domain). The range is read along the ' + t('y') + '-axis: bottom to top.' }, { is: lst([o.top]), code: 'dr-peak', hint: 'Both ends are at ' + t('y=' + o.top) + ', but the curve dips down in between. The range runs from its <b>lowest</b> point to its highest point.' }] },
            'The lowest point is the bottom of the curve, ' + t(ptT([o.c, o.lo])) + '; the highest points are the two ends, at ' + t('y=' + o.top) + '. ' + wordsTex('y', o.lo, o.top) + '.', [HR, HWHOLE], 'range of a U-curve');
        } },
        { id: '3b', level: 'EMG', make: function (r) {
          var o = r.chance(0.25) ? { s: -3, a: 1, hi: 4, lo: 0, b: 2 } : pickWhere(function () { var lo = r.int(-3, 1), hi = lo + r.int(4, 6); return { s: r.int(-4, -2), lo: lo, hi: hi, a: r.int(lo + 1, hi - 1), b: r.int(lo + 1, hi - 1) }; }, function (z) { return z.a !== z.b && z.hi <= 5; });
          var P = [[o.s, o.a], [o.s + 2, o.hi], [o.s + 4, o.lo], [o.s + 6, o.b]];
          return drPart(curveG(P), rng('x', o.s, o.s + 6), rng('y', o.lo, o.hi), { only: 'R', words: true,
            rW: [{ is: rng('y', Math.min(o.a, o.b), Math.max(o.a, o.b)), code: 'dr-peak', hint: 'Those are just the heights of the two <b>ends</b>. The curve goes higher (to ' + t(o.hi) + ') and lower (to ' + t(o.lo) + ') in between.' }, { is: rng('y', o.s, o.s + 6), code: 'set-swap', hint: 'Those are the ' + t('x') + '-values (the domain). The range is read bottom to top.' }] },
            'Scan the whole curve: its highest point is ' + t(ptT([o.s + 2, o.hi])) + ' and its lowest point is ' + t(ptT([o.s + 4, o.lo])) + ' — neither is an end. ' + wordsTex('y', o.lo, o.hi) + '.', [HR, HWHOLE], 'range of a wiggly curve');
        } }] },
      /* ---------------- Q4: both, a cap-shaped curve ---------------- */
      { num: '4', stem: 'The graph shows a curve. State its domain and range.', parts: [
        { id: '4', level: 'EMG', make: function (r) {
          var o = r.chance(0.25) ? { c: 0, w: 2, lo: -2, mid: 1, top: 3 } : pickWhere(function () { var lo = r.int(-4, 0), mid = lo + r.int(2, 3); return { c: r.int(-1, 1), w: r.pick([1, 2, 2]), lo: lo, mid: mid, top: mid + r.int(1, 3) }; }, function (z) { return z.top <= 5; });
          var P = [[o.c - 2 * o.w, o.lo], [o.c - o.w, o.mid], [o.c, o.top], [o.c + o.w, o.mid], [o.c + 2 * o.w, o.lo]];
          return drPart(curveG(P), rng('x', o.c - 2 * o.w, o.c + 2 * o.w), rng('y', o.lo, o.top), { words: true,
            rW: [{ is: lst([o.lo]), code: 'dr-peak', hint: 'Both ends are at ' + t('y=' + o.lo) + ', but the curve rises in between. The range runs from the lowest point up to the <b>top</b> of the curve.' }] },
            'Left to right the curve runs from ' + t('x=' + (o.c - 2 * o.w)) + ' to ' + t('x=' + (o.c + 2 * o.w)) + ': ' + wordsTex('x', o.c - 2 * o.w, o.c + 2 * o.w) + '.<br>Bottom to top: the lowest points are the ends (' + t('y=' + o.lo) + '), the highest is the top ' + t(ptT([o.c, o.top])) + ': ' + wordsTex('y', o.lo, o.top) + '.', [HD, HR], 'D and R of a cap-shaped curve');
        } }] },
      /* ---------------- Q5: discrete or continuous ---------------- */
      { num: '5', stem: 'For each graph, state whether it is discrete or continuous, then state its domain and range.',
        shared: function (r) {
          var bk = r.chance(0.25), xs = bk ? [-3, -1, 0, 2, 3] : r.sample(range(-4, 4), 5).sort(function (a, b) { return a - b; }), ys = bk ? [2, -2, 4, 0, -3] : r.sample(range(-4, 5), 5);
          return { pts: xs.map(function (x, i) { return [x, ys[i]]; }), seg: segShape(r, [[-2, -4], [3, 5]]) };
        },
        parts: [
          { id: '5a', sub: 'a, type', level: 'BEG', make: function (r, o) {
            return B.mc(r, '(a)' + dotsG(o.pts) + 'Is graph (a) discrete or continuous?', [{ html: '<b>Discrete:</b> it is separate dots.', right: true }, { html: '<b>Continuous:</b> it is an unbroken line.', why: 'The dots are not joined — there is nothing between them.' }], 'Graph (a) is separate dots that are not joined, so it is <b>discrete</b>.', ['Are the points joined?'], 'discrete or continuous (dots)', true);
          } },
          { id: '5a2', sub: 'a, D and R', level: 'BEG', make: function (r, o) {
            var xs = o.pts.map(function (p) { return p[0]; }), ys = o.pts.map(function (p) { return p[1]; });
            return drPart('(a)' + dotsG(o.pts) + 'State the domain and range of graph (a).', lst(xs), lst(ys), { words: true,
              dC: { 'set-continuous': 'The graph is separate dots, so only their ' + t('x') + '-values are used — list them, don’t write “from … to …”.' }, rC: { 'set-continuous': 'The graph is separate dots, so only their ' + t('y') + '-values are used — list them.' } },
              'The dots are ' + o.pts.map(function (p) { return t(ptT(p)); }).join(', ') + '.<br>Domain: ' + wordsList('x', xs) + '.<br>Range: ' + wordsList('y', ys) + '.', [HLIST, 'Domain: the first coordinates. Range: the second coordinates.'], 'D and R of 5 dots');
          } },
          { id: '5b', sub: 'b, type', level: 'BEG', make: function (r, o) {
            var A = o.seg[0], C = o.seg[1];
            return B.mc(r, '(b)' + segG(A, C) + 'Is graph (b) discrete or continuous?', [{ html: '<b>Continuous:</b> it is an unbroken line.', right: true }, { html: '<b>Discrete:</b> it has two end dots.', why: 'The end dots are joined by a line — every point on the line belongs to the graph.' }], 'Graph (b) is an unbroken line segment, so it is <b>continuous</b>.', ['Is there anything between the two end dots?'], 'discrete or continuous (segment)', true);
          } },
          { id: '5b2', sub: 'b, D and R', level: 'BEG', make: function (r, o) {
            var A = o.seg[0], C = o.seg[1], lo = Math.min(A[1], C[1]), hi = Math.max(A[1], C[1]);
            return drPart('(b)' + segG(A, C) + 'State the domain and range of graph (b).', rng('x', A[0], C[0]), rng('y', lo, hi), { words: true,
              dC: { 'set-discrete': 'The segment is unbroken, so every ' + t('x') + '-value between the ends is used: write “from … to …”, not a list.' }, rC: { 'set-discrete': 'The segment is unbroken, so every ' + t('y') + '-value between the ends is used: write “from … to …”.' } },
              'The segment runs from ' + t(ptT(A)) + ' to ' + t(ptT(C)) + '.<br>Domain: ' + wordsTex('x', A[0], C[0]) + '.<br>Range: ' + wordsTex('y', lo, hi) + '.', [HD, HR], 'D and R of a segment');
          } }] },
      /* ---------------- Q6: dots with a repeated value ---------------- */
      { num: '6', stem: 'The graph shows a set of discrete points. State the domain and range.', parts: [
        { id: '6', level: 'EMG', make: function (r) {
          var bk = r.chance(0.25), xs = bk ? [-5, -2, 0, 1, 4] : r.sample(nz(-5, 5).concat([0]), 5).sort(function (a, b) { return a - b; });
          var ys; if (bk) ys = [3, -1, 3, -4, 2]; else { var v4 = r.sample(range(-4, 5), 4); ys = r.shuffle(v4.concat([v4[0]])); }
          var P = xs.map(function (x, i) { return [x, ys[i]]; });
          return drPart(dotsG(P), lst(xs), lst(ys), { words: true, dC: { 'set-continuous': 'The graph is separate dots: list their ' + t('x') + '-values.' }, rC: { 'set-continuous': 'The graph is separate dots: list their ' + t('y') + '-values.' } },
            'The dots are ' + P.map(function (p) { return t(ptT(p)); }).join(', ') + '.<br>Domain: ' + wordsList('x', xs) + '.<br>Range: the ' + t('y') + '-values are ' + t(ys.join(',\\ ')) + '; a repeated value is written once: ' + wordsList('y', ys) + '.', [HLIST, 'Two dots are at the same height. Write that ' + t('y') + '-value only once.'], 'dots with a repeated y');
        } }] },
      /* ---------------- Q7: a curve with an inside minimum ---------------- */
      { num: '7', stem: 'The graph shows a continuous curve. State the domain and range. (Hint: look at the whole curve, not just the two ends.)', parts: [
        { id: '7', level: 'PRG', make: function (r) {
          var o = r.chance(0.25) ? [3, -1, -3, 0, 4] : pickWhere(function () { var lo = r.int(-4, -1), e1 = r.int(lo + 2, 4), e2 = r.int(lo + 2, 5); return [e1, r.int(lo + 1, e1 - 1), lo, r.int(lo + 1, e2 - 1), e2]; }, function (z) { return z[0] !== z[4] && z[1] > z[2] && z[3] > z[2]; });
          if (r.chance(0.5) && !(o[0] === 3 && o[4] === 4)) o = o.slice().reverse();
          var P = [[-4, o[0]], [-2, o[1]], [0, o[2]], [2, o[3]], [4, o[4]]], lo = Math.min.apply(null, o), hi = Math.max.apply(null, o);
          return drPart(curveG(P), rng('x', -4, 4), rng('y', lo, hi), { words: true,
            rW: [{ is: rng('y', Math.min(o[0], o[4]), Math.max(o[0], o[4])), code: 'dr-peak', hint: 'Those are just the heights of the two <b>ends</b>. The curve dips lower in the middle — down to ' + t('y=' + lo) + '.' }] },
            'Domain: the curve runs from ' + t('x=-4') + ' to ' + t('x=4') + ': ' + wordsTex('x', -4, 4) + '.<br>Range: the lowest point is in the middle, ' + t(ptT([0, lo])) + ', and the highest is the end at ' + t('y=' + hi) + ': ' + wordsTex('y', lo, hi) + '.', [HR, HWHOLE], 'curve with an inside minimum');
        } }] },
      /* ---------------- Q8: True or False ---------------- */
      { num: '8', section: 'Part B — Everyday Graphs', stem: 'State whether each sentence is <b>True</b> or <b>False</b>.', parts: [
        { id: '8a', level: 'LIM', make: function (r) {
          var v = r.chance(0.6);
          return B.tf(r, v ? 'The domain of a relation is the set of all ' + t('y') + '-values.' : 'The range of a relation is the set of all ' + t('x') + '-values.', false, v ? 'The domain is the ' + t('x') + '-values; the ' + t('y') + '-values are the range.' : 'The range is the ' + t('y') + '-values; the ' + t('x') + '-values are the domain.',
            '<b>False.</b> The domain is the set of ' + t('x') + '-values (inputs); the range is the set of ' + t('y') + '-values (outputs).', ['Domain ↔ ' + t('x') + ', range ↔ ' + t('y') + '.'], 'TF domain/range letters');
        } },
        { id: '8b', level: 'BEG', make: function (r) {
          return B.tf(r, 'A discrete graph is described using a list of values, not “from ___ to ___.”', true, 'A discrete graph uses only its dots’ values — nothing in between.', '<b>True.</b> Only the dots belong to a discrete relation, so we list their values; “from … to …” would include every value in between.', ['Does a discrete graph use the values between its dots?'], 'TF discrete list');
        } },
        { id: '8c', level: 'BEG', make: function (r) {
          return B.tf(r, 'The range of a graph can be found by looking at the lowest and highest points on the graph.', true, 'The range runs from the lowest ' + t('y') + '-value to the highest.', '<b>True.</b> The range runs from the lowest point to the highest point — wherever they are on the graph.', [HR], 'TF range lowest/highest');
        } },
        { id: '8d', level: 'EMG', make: function (r) {
          return B.tf(r, 'Every continuous graph goes on forever in both directions.', false, 'A segment is continuous (unbroken) but it stops at its two end dots.', '<b>False.</b> Continuous only means unbroken. A line segment is continuous but stops at its end dots — like the graphs in Question 2.', ['Think of the segments in Question 2.'], 'TF continuous forever');
        } },
        { id: '8e', level: 'EMG', make: function (r) {
          return B.tf(r, 'A graph’s domain could include only positive numbers.', true, 'A graph that lives entirely to the right of the ' + t('y') + '-axis uses only positive ' + t('x') + '-values.', '<b>True.</b> Any graph entirely to the right of the ' + t('y') + '-axis — for example a time graph starting just after ' + t('t=0') + ' — has only positive ' + t('x') + '-values.', ['Picture a graph that stays to the right of the ' + t('y') + '-axis.'], 'TF positive domain');
        } }] },
      /* ---------------- Q9: filling a pool ---------------- */
      { num: '9', shared: function (r) {
          var o = r.chance(0.25) ? { T: 15, V: 300, tx: 5, vy: 50 } : pickWhere(function () { var tx = r.pick([2, 5]), T = tx * r.int(3, 6), vy = r.pick([20, 25, 50, 100]); return { T: T, tx: tx, vy: vy, V: vy * r.int(4, 8) }; }, function (z) { return z.T <= 30 && z.V <= 800 && z.V % 10 === 0; });
          return o;
        },
        stem: function (o) {
          return 'A garden hose fills a small pool. The graph shows the volume of water, ' + t('V') + ' litres, in the pool after ' + t('t') + ' minutes. The pool starts empty and fills steadily, reaching ' + t(o.V) + ' L after ' + t(o.T) + ' minutes.' +
            HW.graph({ x: [0, o.T + o.tx], y: [0, o.V + o.vy], grid: 1, gridY: o.vy, labelsX: o.tx, labelsY: o.vy * (o.V / o.vy > 6 ? 2 : 1), firstQuadrant: true, unitX: 280 / (o.T + o.tx), unitY: 200 / (o.V + o.vy), xName: 't', yName: 'V', xTitle: 'Time, t (min)', yTitle: 'Volume, V (L)', max: 360,
              segs: [{ pts: [[0, 0], [o.T, o.V]], start: 'closed', end: 'closed' }], aria: 'volume graph' });
        },
        parts: [
          { id: '9a', sub: 'a', level: 'BEG', make: function (r, o) {
            return drPart('(a) State the domain (in minutes).', rng('t', 0, o.T), rng('V', 0, o.V), { only: 'D', dv: 't', rv: 'V', words: true,
              dW: [{ is: rng('t', 0, o.V), code: 'set-swap', hint: o.V + ' is a volume. The domain is read along the time axis: when does the filling start and stop?' }, { is: rng('t', 0, o.T / o.tx), code: 'dr-scale', hint: 'Read the scale: each label on the time axis is ' + t(o.tx) + ' minutes, so the graph ends at ' + t('t=' + o.T) + '.' }] },
              'The filling starts at ' + t('t=0') + ' and stops at ' + t('t=' + o.T) + ': ' + wordsTex('t', 0, o.T) + ' minutes.', ['Read the time axis: where does the graph start and stop?'], 'pool domain');
          } },
          { id: '9b', sub: 'b', level: 'BEG', make: function (r, o) {
            return drPart('(b) State the range (in litres).', rng('t', 0, o.T), rng('V', 0, o.V), { only: 'R', dv: 't', rv: 'V', words: true,
              rW: [{ is: rng('V', 0, o.T), code: 'set-swap', hint: o.T + ' is a time. The range is read along the volume axis: from the lowest volume to the highest.' }] },
              'The volume goes from ' + t('0') + ' L (empty) up to ' + t(o.V) + ' L: ' + wordsTex('V', 0, o.V) + ' litres.', ['Read the volume axis: what is the lowest volume and the highest volume?'], 'pool range');
          } },
          { id: '9c', sub: 'c', level: 'EMG', outcome: 'RF1', make: function (r, o) {
            return B.mc(r, '(c) Why could the domain not include negative values of ' + t('t') + '?', [
              { html: 'A negative time would mean before the hose was turned on, which is not part of this filling situation.', right: true },
              { html: 'Because the volume can’t be negative.', why: 'That limits the <b>range</b>. The domain is about time: what would ' + t('t=-2') + ' mean?' },
              { html: 'Because the graph is a straight line.', why: 'Straight lines can have negative ' + t('x') + '-values. Think about what a negative time means here.' },
              { html: 'Because negative numbers can’t be on the time axis.', why: 'An axis can show negative numbers. The reason is about the real situation.' }],
              'The graph starts when the hose is turned on (' + t('t=0') + '). A negative time would be <b>before</b> filling started, which isn’t part of this situation, so ' + t('t') + ' starts at ' + t('0') + '.', ['What would ' + t('t=-2') + ' minutes mean in this story?'], 'why no negative t (pool)');
          } }] },
      /* ---------------- Q10: soccer ball ---------------- */
      { num: '10', shared: function (r) {
          var o = r.chance(0.25) ? { tp: 2, H: 8 } : { tp: r.pick([1, 2, 3]), H: r.pick([4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20]) };
          o.L = 2 * o.tp; o.k = o.H / (o.tp * o.tp); o.hy = o.H > 10 ? 3 : o.H > 6 ? 2 : 1; return o;
        },
        stem: function (o) {
          var f = function (x) { return o.H - o.k * (x - o.tp) * (x - o.tp); };
          return 'A soccer ball is kicked into the air. The graph shows the ball’s height, ' + t('h') + ' metres, after ' + t('t') + ' seconds. It peaks at ' + t(o.H) + ' m when ' + t('t=' + o.tp) + ' s and lands at ' + t('t=' + o.L) + ' s.' +
            HW.graph({ x: [0, o.L + 0.6], y: [0, o.H + o.hy], gridY: o.hy, labelsX: 1, labelsY: o.hy * (o.H / o.hy > 6 ? 2 : 1), firstQuadrant: true, unitX: 260 / (o.L + 0.6), unitY: 180 / (o.H + o.hy), xName: 't', yName: 'h', xTitle: 'Time, t (s)', yTitle: 'Height, h (m)', max: 340,
              fns: [{ f: f, from: 0, to: o.L, start: 'closed', end: 'closed' }], aria: 'height graph' });
        },
        parts: [
          { id: '10a', sub: 'a', level: 'BEG', make: function (r, o) {
            return drPart('(a) State the domain (in seconds).', rng('t', 0, o.L), rng('h', 0, o.H), { only: 'D', dv: 't', rv: 'h', words: true,
              dW: [{ is: rng('t', 0, o.tp), code: 'dr-peak', hint: 'At ' + t('t=' + o.tp) + ' the ball is at its highest, but it is still in the air. The flight ends when it lands.' }] },
              'The ball is in the air from ' + t('t=0') + ' (the kick) to ' + t('t=' + o.L) + ' (landing): ' + wordsTex('t', 0, o.L) + ' seconds.', ['When does the flight start, and when does it end?'], 'ball domain');
          } },
          { id: '10b', sub: 'b', level: 'EMG', make: function (r, o) {
            return drPart('(b) State the range (in metres).', rng('t', 0, o.L), rng('h', 0, o.H), { only: 'R', dv: 't', rv: 'h', words: true,
              rW: [{ is: lst([0]), code: 'dr-peak', hint: 'Both ends of the graph are at height ' + t('0') + ', but the ball rises in between. Go up to the <b>peak</b>.' }, { is: rng('h', 0, o.L), code: 'set-swap', hint: t(o.L) + ' s is a time. The range is the heights: from the ground to the peak.' }] },
              'The lowest height is ' + t('0') + ' m (on the ground) and the highest is the peak, ' + t(o.H) + ' m: ' + wordsTex('h', 0, o.H) + ' metres.', ['Lowest point: on the ground. Highest point: the peak.'], 'ball range');
          } },
          { id: '10c', sub: 'c', level: 'EMG', outcome: 'RF1', make: function (r, o) {
            return B.mc(r, '(c) Why could the domain not include negative values of ' + t('t') + '?', [
              { html: 'A negative time would mean before the ball was kicked, which does not apply to this flight.', right: true },
              { html: 'Because the ball can’t go below the ground.', why: 'That is about heights — the <b>range</b>. Think about what a negative time means.' },
              { html: 'Because the ball peaks at ' + t('t=' + o.tp) + '.', why: 'The peak doesn’t decide when time starts. What happens at ' + t('t=0') + '?' },
              { html: 'Because the graph is a curve.', why: 'Curves can have negative ' + t('x') + '-values. The reason is about the situation.' }],
              'The flight begins with the kick at ' + t('t=0') + '. A negative time would be before the kick, which isn’t part of this flight, so ' + t('t') + ' starts at ' + t('0') + '.', ['What would ' + t('t=-1') + ' second mean in this story?'], 'why no negative t (ball)');
          } }] },
      /* ---------------- Q11, Q12 ---------------- */
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'BEG', make: function (r) {
          var xs = r.chance(0.25) ? [-5, -1, 2, 6] : r.sample(nz(-7, 7), 4).sort(function (a, b) { return a - b; }), L = xs.map(nn).join(',\\ ');
          return B.mc(r, 'A graph is made up of four separate dots, at ' + t('x=' + L) + '. Which best describes how to state its domain?', [
            { html: t('x') + ' can be any value from ' + t(xs[0]) + ' to ' + t(xs[3]) + '.', why: 'That would include every value in between, like ' + t(xs[0] + 0.5) + ' — but there are no dots there.' },
            { html: t('x') + ' can be ' + t(xs.slice(0, 3).map(nn).join(',\\ ')) + ', or ' + t(xs[3]) + '.', right: true },
            { html: 'The domain and the range are equal.', why: 'Nothing tells us the ' + t('y') + '-values of the dots. The domain is about the ' + t('x') + '-values only.' },
            { html: 'The domain is all real numbers.', why: 'Only four ' + t('x') + '-values are used — one for each dot.' }],
            'The graph is discrete (separate dots), so its domain is the <b>list</b> of the dots’ ' + t('x') + '-values: ' + wordsList('x', xs) + '.', [HLIST], 'MC discrete domain', true);
        } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '12', level: 'PRG', make: function (r) {
          var bk = r.chance(0.25), P;
          if (bk) P = [[-6, 5], [-3, 9], [0, 5], [2, 14], [5, 9]];
          else { var xs = r.sample(range(-7, 7), 5).sort(function (a, b) { return a - b; }), nd = r.pick([3, 3, 4]), v = r.sample(range(-5, 15), nd), ys = v.slice(); while (ys.length < 5) ys.push(r.pick(v)); ys = r.shuffle(ys); P = xs.map(function (x, i) { return [x, ys[i]]; }); }
          var a = uniq(P.map(function (p) { return p[0]; })).length, b = uniq(P.map(function (p) { return p[1]; })).length;
          return B.nr('A discrete relation includes the ordered pairs ' + P.map(function (p) { return t(ptT(p)); }).join(', ') + '. If ' + t('a') + ' is the number of elements in the domain and ' + t('b') + ' is the number of elements in the range, the value of ' + t('a+b') + ' is ________.', a + b,
            function (v) { if (v === 10) return { code: 'u5l5-count-all', hint: 'A repeated ' + t('y') + '-value is counted only once in the range.' }; return null; },
            'Domain: ' + t(lst(P.map(function (p) { return p[0]; }))) + ', so ' + t('a=' + a) + '. Range: ' + t(lst(P.map(function (p) { return p[1]; }))) + ' (each value once), so ' + t('b=' + b) + '. ' + t('a+b=' + (a + b)) + '.',
            ['List the ' + t('x') + '-values and the ' + t('y') + '-values, writing each value only once.', 'Then count each list.'], 'NR a+b');
        } }] },
      /* ---------------- Q13: oven ---------------- */
      { num: '13', shared: function (r) {
          return r.chance(0.25) ? { T0: 20, T1: 200, m: 8 } : { T0: r.pick([18, 20, 21, 22]), T1: r.pick([175, 180, 190, 200, 220, 230, 250]), m: r.pick([6, 7, 8, 9, 10, 12]) };
        },
        stem: function (o) { return 'An oven starts at room temperature, ' + t(o.T0 + '^\\circ') + 'C, and preheats to ' + t(o.T1 + '^\\circ') + 'C over the first ' + t(o.m) + ' minutes after being turned on. After that, it stays at a constant ' + t(o.T1 + '^\\circ') + 'C. Consider only the graph of the first ' + t(o.m) + ' minutes (the preheating part).'; },
        parts: [
          { id: '13a', sub: 'a', level: 'BEG', outcome: 'RF2', make: function (r, o) {
            return drPart('(a) State the domain of this part of the graph (in minutes).', rng('t', 0, o.m), rng('T', o.T0, o.T1), { only: 'D', dv: 't', rv: 'T', words: true,
              dW: [{ is: rng('t', o.T0, o.T1), code: 'set-swap', hint: 'Those are temperatures. The domain is the times: from when the oven is turned on until preheating ends.' }] },
              'Preheating runs from ' + t('t=0') + ' to ' + t('t=' + o.m) + ': ' + wordsTex('t', 0, o.m) + ' minutes.', ['The domain is the times: when does preheating start and stop?'], 'oven domain');
          } },
          { id: '13b', sub: 'b', level: 'EMG', make: function (r, o) {
            return drPart('(b) State the range of this part of the graph (in degrees Celsius).', rng('t', 0, o.m), rng('T', o.T0, o.T1), { only: 'R', dv: 't', rv: 'T', words: true,
              rW: [{ is: rng('T', 0, o.T1), code: 'dr-scale', hint: 'The oven doesn’t start at ' + t('0^\\circ') + 'C — it starts at room temperature, ' + t(o.T0 + '^\\circ') + 'C.' }, { is: rng('T', 0, o.m), code: 'set-swap', hint: 'Those are times. The range is the temperatures.' }] },
              'The temperature rises from ' + t(o.T0 + '^\\circ') + 'C to ' + t(o.T1 + '^\\circ') + 'C: ' + wordsTex('T', o.T0, o.T1) + ' degrees.', ['What is the lowest temperature in the first ' + t(o.m) + ' minutes? The highest?'], 'oven range');
          } },
          { id: '13c', sub: 'c', level: 'EMG', outcome: 'RF1', make: function (r, o) {
            return B.mc(r, '(c) Is this part of the graph discrete or continuous?', [
              { html: '<b>Continuous:</b> the temperature changes smoothly with no gaps or jumps as the oven heats up — it has a value at every moment.', right: true },
              { html: '<b>Discrete:</b> the oven only shows whole-number temperatures.', why: 'The temperature passes through every value in between, like ' + t('20.5^\\circ') + 'C, whether or not a display shows it.' },
              { html: '<b>Discrete:</b> it starts and stops at fixed times.', why: 'A graph can start and stop and still be unbroken in between. Is there a temperature at every moment?' },
              { html: '<b>Continuous:</b> because the oven stays on forever.', why: 'We are only looking at the first ' + t(o.m) + ' minutes. Continuous means no gaps, not forever.' }],
              '<b>Continuous.</b> Time flows without gaps, and at every moment the oven has some temperature between ' + t(o.T0 + '^\\circ') + 'C and ' + t(o.T1 + '^\\circ') + 'C, so the graph is an unbroken curve.', ['Does the oven have a temperature at every moment, even between whole minutes?'], 'oven continuous');
          } }] }
    ],
    extra: EXTRA()
  });

  /* =============================== Extra practice (u5_EP05) — inequality notation =============================== */
  var HN = 'Solid dot → that value is included (' + t('\\le') + ' or ' + t('\\ge') + '). Open circle → not included (' + t('<') + ' or ' + t('>') + '). Arrow → no end on that side.';
  function segInfo(A, C, sA, sC) { // domain and range of a segment from A to C with end styles
    var L = A[0] <= C[0] ? [A, sA] : [C, sC], Rt = A[0] <= C[0] ? [C, sC] : [A, sA];
    var lo = A[1] <= C[1] ? [A, sA] : [C, sC], hi = A[1] <= C[1] ? [C, sC] : [A, sA];
    var D = L[0][0] === Rt[0][0] ? lst([L[0][0]]) : rng('x', L[0][0], Rt[0][0], L[1] === 'closed', Rt[1] === 'closed');
    var R = lo[0][1] === hi[0][1] ? lst([lo[0][1]]) : rng('y', lo[0][1], hi[0][1], lo[1] === 'closed', hi[1] === 'closed');
    return { D: D, R: R, L: L, Rt: Rt, lo: lo, hi: hi };
  }
  function segEP(A, C, sA, sC, text, extra) {
    var s = segInfo(A, C, sA, sC), w = function (pt, st) { return (st === 'open' ? 'open circle ' : 'solid dot ') + t(ptT(pt)); };
    var dW = [], rW = [];
    if (sA !== sC) {
      dW.push({ is: rng('x', s.L[0][0], s.Rt[0][0], s.Rt[1] === 'closed', s.L[1] === 'closed'), code: 'dr-open-side', hint: 'Match each end to its dot: the open circle is at ' + t('x=' + (sA === 'open' ? A : C)[0]) + ', so that is the end that gets ' + t('<') + '.' });
      rW.push({ is: rng('y', s.lo[0][1], s.hi[0][1], s.hi[1] === 'closed', s.lo[1] === 'closed'), code: 'dr-open-side', hint: 'Match each end to its dot: the open circle is ' + t(ptT(sA === 'open' ? A : C)) + ', so it is ' + t('y=' + (sA === 'open' ? A : C)[1]) + ' that gets ' + t('<') + '.' });
    }
    if (sA === 'open' || sC === 'open') { dW.push({ is: rng('x', s.L[0][0], s.Rt[0][0]), code: 'set-endpoint', hint: 'The open circle means that end is <b>not</b> included: use ' + t('<') + ' there.' }); }
    return { D: s.D, R: s.R, dW: dW.concat((extra && extra.dW) || []), rW: rW.concat((extra && extra.rW) || []),
      sol: 'The segment runs from the ' + w(s.L[0], s.L[1]) + ' to the ' + w(s.Rt[0], s.Rt[1]) + '.<br>Domain: ' + t(s.D) + '. Range: ' + t(s.R) + '.', text: text };
  }
  function drEP(prompt, info, hints, level) { return drPart(prompt, info.D, info.R, { dW: info.dW, rW: info.rW }, info.sol, hints || [HD, HN], info.text); }
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

  function EXTRA() {
    return [
      { num: '1', section: 'Extra Practice A — Solid Dots, Open Circles, and Arrows', stem: 'In this extra practice (a step beyond Lesson 5; Lesson 6 explains it further), write the domain and range of a <b>continuous</b> graph as an inequality (e.g. ' + t('-3\\le x\\le 4') + ') and of a <b>discrete</b> graph as a list in braces (e.g. ' + t('\\{-3,\\ 0,\\ 4\\}') + ').<br>Complete each sentence.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) {
          return B.mc(r, 'A <b>solid</b> dot at the end of a graph means that value ________, so the inequality uses ________.', [{ html: '<b>is</b> included; ' + t('\\le') + ' or ' + t('\\ge'), right: true }, { html: 'is <b>not</b> included; ' + t('<') + ' or ' + t('>'), why: 'That describes an open circle. A solid (filled-in) dot is part of the graph.' }, { html: '<b>is</b> included; ' + t('<') + ' or ' + t('>'), why: t('<') + ' leaves the end value out. Which symbol includes it?' }, { html: 'is never part of the domain; ' + t('=') + '', why: 'A solid dot is a point of the graph, so its value is included.' }],
            'A solid dot is a point of the graph, so its value <b>is included</b>: use ' + t('\\le') + ' or ' + t('\\ge') + '.', [HN], 'solid dot meaning');
        } },
        { id: 'e1b', level: 'BEG', make: function (r) {
          return B.mc(r, 'An <b>open</b> circle at the end of a graph means that value ________, so the inequality uses ________.', [{ html: 'is <b>not</b> included; ' + t('<') + ' or ' + t('>'), right: true }, { html: '<b>is</b> included; ' + t('\\le') + ' or ' + t('\\ge'), why: 'That describes a solid dot. An open (empty) circle is a point the graph does not reach.' }, { html: 'is <b>not</b> included; ' + t('\\le') + ' or ' + t('\\ge'), why: t('\\le') + ' includes the end value. Which symbol leaves it out?' }, { html: 'is a mistake in the graph.', why: 'An open circle is deliberate: it shows the graph gets right up to that point without including it.' }],
            'An open circle is a point the graph does not include: use ' + t('<') + ' or ' + t('>') + '.', [HN], 'open circle meaning');
        } },
        { id: 'e1c', level: 'BEG', make: function (r) {
          return B.mc(r, 'An <b>arrow</b> at the end of a graph means the graph ________, so there is no endpoint on that side.', [{ html: 'continues forever in that direction', right: true }, { html: 'stops at the edge of the grid', why: 'The grid is just as far as we drew. The arrow says the graph keeps going past it.' }, { html: 'is pointing at its highest value', why: 'The arrow is not a value — it says the graph never ends that way.' }, { html: 'is discrete', why: 'Arrows go on lines and curves, which are continuous. What does the arrow say about the end?' }],
            'An arrow means the graph <b>continues forever</b> in that direction, so the domain or range has no end on that side.', [HN], 'arrow meaning');
        } },
        { id: 'e1d', level: 'BEG', make: function (r) {
          return B.mc(r, 'A relation drawn as separate dots is ________, and its domain is written as a ________ in braces.', [{ html: 'discrete; list', right: true }, { html: 'continuous; list', why: 'Separate dots are <b>discrete</b>; continuous means unbroken.' }, { html: 'discrete; inequality', why: 'An inequality includes every value in between — a discrete relation has only its dots.' }, { html: 'continuous; inequality', why: 'Separate dots are not unbroken.' }],
            'Separate dots are <b>discrete</b>, and the domain is a <b>list</b> in braces, e.g. ' + t('\\{-3,\\ 0,\\ 4\\}') + '.', [HLIST], 'dots = discrete, list');
        } }] },
      { num: '2', stem: 'Each graph is a line segment with <b>both</b> endpoints marked (solid or open). Read the endpoints carefully and state the domain and range.', parts: [
        { id: 'e2a', sub: 'a', level: 'BEG', make: function (r) {
          var s = segShape(r, [[-4, -3], [3, 4]]), I = segEP(s[0], s[1], 'closed', 'closed', 'EP2a solid segment');
          return drEP(Gfix({ segs: [{ pts: s, start: 'closed', end: 'closed' }] }), I);
        } },
        { id: 'e2b', sub: 'b', level: 'EMG', make: function (r) {
          var s = segShape(r, [[-2, 5], [4, -1]]), I = segEP(s[0], s[1], 'open', 'open', 'EP2b open segment');
          I.dW.push({ is: rng('x', s[0][0], s[1][0]), code: 'set-endpoint', hint: 'Both ends are <b>open</b> circles, so neither end value is included: use ' + t('<') + ' on both sides.' });
          return drEP(Gfix({ segs: [{ pts: s, start: 'open', end: 'open' }] }), I);
        } }] },
      { num: '3', stem: 'Each segment has <b>one</b> solid end and <b>one</b> open end. State the domain and range, using ' + t('\\le') + ' and ' + t('<') + ' in the right places.', parts: [
        { id: 'e3a', sub: 'a', level: 'EMG', make: function (r) {
          var s = segShape(r, [[-5, -2], [1, 4]]), I = segEP(s[0], s[1], 'closed', 'open', 'EP3a');
          return drEP(Gfix({ segs: [{ pts: s, start: 'closed', end: 'open' }] }), I);
        } },
        { id: 'e3b', sub: 'b', level: 'PRG', make: function (r) {
          var s = segShape(r, [[-3, 4], [5, 0]]), I = segEP(s[0], s[1], 'open', 'closed', 'EP3b');
          return drEP(Gfix({ segs: [{ pts: s, start: 'open', end: 'closed' }] }), I);
        } }] },
      { num: '4', stem: 'Each graph is a <b>ray</b>: it starts at one endpoint and continues forever in the direction of the arrow. State the domain and range.', parts: [
        { id: 'e4a', sub: 'a', level: 'PRG', make: function (r) {
          var o = r.chance(0.25) ? [-2, -3, 1] : [r.int(-4, 1), r.int(-4, 1), r.pick([1, 2, 0.5])], a = o[0], b = o[1], m = o[2];
          var end = [a + (5.6 - b) / m > 5.6 ? 5.6 : a + (5.6 - b) / m, 0]; end[1] = b + m * (end[0] - a);
          var D = 'x\\ge ' + a, R = 'y\\ge ' + b;
          return drPart(Gfix({ segs: [{ pts: [[a, b], end], start: 'closed', end: 'arrow' }] }), D, R, { dW: [{ is: 'x\\le ' + a, code: 'dr-ray-dir', hint: 'The ray goes to the <b>right</b> of ' + t('x=' + a) + ', so ' + t('x') + ' is ' + t(a) + ' or more.' }, { is: rng('x', a, 6), code: 'set-arrow', hint: 'The arrow means the ray keeps going past the edge of the grid: there is no upper end. Use ' + t('x\\ge ' + a) + '.' }],
            rW: [{ is: 'y\\le ' + b, code: 'dr-ray-dir', hint: 'The ray goes <b>up</b> from ' + t('y=' + b) + ', so ' + t('y') + ' is ' + t(b) + ' or more.' }, { is: 'y>' + b, code: 'set-endpoint', hint: 'The start dot is solid, so ' + t('y=' + b) + ' is included: ' + t('\\ge') + '.' }] },
            'The ray starts at the solid dot ' + t(ptT([a, b])) + ' and goes up to the right forever.<br>' + t('D:\\ x\\ge ' + a) + ', ' + t('R:\\ y\\ge ' + b) + '.', [HD, HN], 'ray up-right');
        } },
        { id: 'e4b', sub: 'b', level: 'PRG', make: function (r) {
          var o = r.chance(0.25) ? [3, 4, 1] : [r.int(-1, 4), r.int(-1, 4), r.pick([1, 2, 0.5])], a = o[0], b = o[1], m = o[2];
          var ex0 = a - (b + 5.6) / m < -5.6 ? -5.6 : a - (b + 5.6) / m, end = [ex0, b + m * (ex0 - a)];
          var D = 'x<' + a, R = 'y<' + b;
          return drPart(Gfix({ segs: [{ pts: [[a, b], end], start: 'open', end: 'arrow' }] }), D, R, { dW: [{ is: 'x\\le ' + a, code: 'set-endpoint', hint: 'The start is an <b>open</b> circle, so ' + t('x=' + a) + ' is not included: use ' + t('<') + '.' }, { is: 'x>' + a, code: 'dr-ray-dir', hint: 'The ray goes to the <b>left</b> of ' + t('x=' + a) + '.' }],
            rW: [{ is: 'y\\le ' + b, code: 'set-endpoint', hint: 'The start is an <b>open</b> circle, so ' + t('y=' + b) + ' is not included: use ' + t('<') + '.' }, { is: 'y>' + b, code: 'dr-ray-dir', hint: 'The ray goes <b>down</b> from ' + t('y=' + b) + '.' }] },
            'The ray starts at the open circle ' + t(ptT([a, b])) + ' (not included) and goes down to the left forever.<br>' + t('D:\\ x<' + a) + ', ' + t('R:\\ y<' + b) + '.', [HD, HN], 'ray down-left open');
        } }] },
      { num: '5', stem: 'State the domain and range of each graph.', parts: [
        { id: 'e5a', sub: 'a', level: 'EMG', make: function (r) {
          var m = r.pick([1, 2, -1, -2, 0.5, -0.5]), b = r.int(-3, 3), x0 = -5.6, x1 = 5.6, f = function (x) { return m * x + b; };
          var pts = [[x0, f(x0)], [x1, f(x1)]].map(function (p) { if (Math.abs(p[1]) > 5.6) { var y = p[1] > 0 ? 5.6 : -5.6; return [(y - b) / m, y]; } return p; });
          return drPart(Gfix({ segs: [{ pts: pts, start: 'arrow', end: 'arrow' }] }), 'x\\in\\mathbb{R}', 'y\\in\\mathbb{R}', { dW: [{ is: rng('x', -6, 6), code: 'set-arrow', hint: 'The arrows mean the line keeps going past the edge of the grid, forever both ways: every ' + t('x') + '-value is used.' }], rW: [{ is: rng('y', -6, 6), code: 'set-arrow', hint: 'The arrows mean the line keeps going up and down forever: every ' + t('y') + '-value is reached.' }],
            good: [['\\text{all real numbers}', '\\text{all real numbers}']] },
            'The line has arrows at both ends and is slanted, so it goes forever left, right, up and down. Domain: all real numbers. Range: all real numbers.', ['Arrows at both ends: does the line ever stop?', 'Type “all real numbers” or ' + t('x\\in\\mathbb{R}') + '.'], 'slanted line, all reals');
        } },
        { id: 'e5b', sub: 'b', level: 'PRG', make: function (r) {
          var o = r.chance(0.25) ? [-4, 2, 3] : pickWhere(function () { var a = r.int(-5, 1); return [a, a + r.int(3, 7), r.pick(nz(-5, 5))]; }, function (z) { return z[1] <= 5; }), a = o[0], b = o[1], c = o[2];
          return drPart(Gfix({ segs: [{ pts: [[a, c], [b, c]], start: 'closed', end: 'closed' }] }), rng('x', a, b), lst([c]), { rW: [{ is: rng('y', a, b), code: 'set-swap', hint: 'Those are the ' + t('x') + '-values. How many different heights does a flat segment have?' }],
            rC: { 'set-continuous': 'Every point of this flat segment is at the same height, ' + t('y=' + c) + '. The range is that one value: ' + t('\\{' + c + '\\}') + '.' } },
            'A horizontal segment from ' + t(ptT([a, c])) + ' to ' + t(ptT([b, c])) + '.<br>' + t('D:\\ ' + rng('x', a, b)) + '. Every point has ' + t('y=' + c) + ', so ' + t('R=\\{' + c + '\\}') + '.', [HD, 'Think hard about how many different ' + t('y') + '-values a flat segment actually uses.'], 'horizontal segment');
        } }] },
      { num: '6', stem: 'Graph (a) is a vertical segment and graph (b) is a horizontal ray. One has a domain that is a single value; the other has a range that is a single value. State both.', parts: [
        { id: 'e6a', sub: 'a', level: 'PRG', make: function (r) {
          var o = r.chance(0.25) ? [3, -4, 5] : pickWhere(function () { var lo = r.int(-5, 0); return [r.pick(nz(-5, 5)), lo, lo + r.int(3, 9)]; }, function (z) { return z[2] <= 5; });
          return drPart(Gfix({ segs: [{ pts: [[o[0], o[1]], [o[0], o[2]]], start: 'closed', end: 'closed' }] }), lst([o[0]]), rng('y', o[1], o[2]), { dW: [{ is: rng('x', o[1], o[2]), code: 'set-swap', hint: 'Those are the heights. Every point of a vertical segment has the same ' + t('x') + '-value.' }],
            dC: { 'set-continuous': 'Every point of this vertical segment has ' + t('x=' + o[0]) + '. The domain is that one value: ' + t('\\{' + o[0] + '\\}') + '.' } },
            'A vertical segment from ' + t(ptT([o[0], o[1]])) + ' to ' + t(ptT([o[0], o[2]])) + '. Every point has ' + t('x=' + o[0]) + ': ' + t('D=\\{' + o[0] + '\\}') + '. ' + t('R:\\ ' + rng('y', o[1], o[2])) + '.', [HD, HR], 'vertical segment');
        } },
        { id: 'e6b', sub: 'b', level: 'PRG', make: function (r) {
          var o = r.chance(0.25) ? [-1, -3, 1] : [r.int(-4, 3), r.pick(nz(-5, 5)), r.pick([1, -1])], a = o[0], c = o[1], dir = o[2];
          var D = dir > 0 ? 'x\\ge ' + a : 'x\\le ' + a;
          return drPart(Gfix({ segs: [{ pts: [[a, c], [dir > 0 ? 5.6 : -5.6, c]], start: 'closed', end: 'arrow' }] }), D, lst([c]), { dW: [{ is: dir > 0 ? 'x\\le ' + a : 'x\\ge ' + a, code: 'dr-ray-dir', hint: 'Which way does the arrow point? The ray goes to the ' + (dir > 0 ? 'right' : 'left') + ' from ' + t('x=' + a) + '.' }],
            rC: { 'set-continuous': 'The ray is flat: every point has ' + t('y=' + c) + '. The range is that one value.' } },
            'A horizontal ray from the solid dot ' + t(ptT([a, c])) + ' going ' + (dir > 0 ? 'right' : 'left') + ' forever: ' + t('D:\\ ' + D) + '. Every point has ' + t('y=' + c) + ': ' + t('R=\\{' + c + '\\}') + '.', [HD, HN], 'horizontal ray');
        } }] },
      { num: '7', section: 'Extra Practice B — A List or an Interval? Discrete, Continuous, and Gaps', shared: function (r) {
          if (r.chance(0.25)) return { P: [[-5, 4], [-3, -2], [-1, 4], [2, -5], [4, 1]] };
          var xs = r.sample(nz(-5, 5), 5).sort(function (a, b) { return a - b; }), v = r.sample(nz(-5, 5), 4), ys = r.shuffle(v.concat([v[0]]));
          return { P: xs.map(function (x, i) { return [x, ys[i]]; }) };
        },
        stem: function (o) { return 'The graph is a set of five separate dots.' + Gfix({ points: o.P.map(function (p) { return { x: p[0], y: p[1] }; }) }); },
        parts: [
          { id: 'e7a', sub: 'a', level: 'EMG', make: function (r, o) {
            var xs = o.P.map(function (p) { return p[0]; }), ys = o.P.map(function (p) { return p[1]; });
            return drPart('(a) State the domain and range as <b>lists</b> in braces.', lst(xs), lst(ys), { dC: { 'set-continuous': 'Separate dots: list their ' + t('x') + '-values in braces.' }, rC: { 'set-continuous': 'Separate dots: list their ' + t('y') + '-values in braces.' } },
              t('D=' + lst(xs)) + ', ' + t('R=' + lst(ys)) + ' (the repeated ' + t('y') + '-value is written once).', [HLIST, 'Watch for a repeated ' + t('y') + '-value.'], 'EP7 dots lists');
          } },
          { id: 'e7b', sub: 'b', level: 'PRG', make: function (r, o) {
            var ys = o.P.map(function (p) { return p[1]; }), rep = ys.filter(function (y, i) { return ys.indexOf(y) !== i; })[0], n = uniq(ys).length;
            return numPart('(b) The domain has five elements but the range does not. How many elements does the range have?', n, [[5, 'u5l5-count-all', 'Two dots share the height ' + t('y=' + rep) + '. A set lists each value once, so count ' + t(rep) + ' only once.']],
              'The ' + t('y') + '-value ' + t(rep) + ' occurs twice, and a set lists each value only once, so the range has ' + t(n) + ' elements.', ['Is any ' + t('y') + '-value used by two dots?'], 'EP7 count range');
          } },
          { id: 'e7c', sub: 'c', level: 'BEG', make: function (r, o) {
            var xs = o.P.map(function (p) { return p[0]; }), q = xs.indexOf(0) < 0 ? 0 : [1, -1, 2, -2, 3, -3].filter(function (x) { return xs.indexOf(x) < 0; })[0], inside = q > xs[0] && q < xs[4];
            return B.mc(r, '(c) Is ' + t('x=' + q) + ' in the domain of this relation?', [
              { html: '<b>No:</b> no dot is plotted at ' + t('x=' + q) + ', and only the plotted dots belong to a discrete relation.', right: true },
              { html: '<b>Yes:</b> ' + t(q) + ' is between the smallest and largest ' + t('x') + '-values.', why: 'That would be true for an unbroken graph. Here only the dots count — is there a dot at ' + t('x=' + q) + '?' },
              { html: '<b>Yes:</b> every relation includes ' + t('x=' + q) + '.', why: 'No — a relation includes only its own points.' }],
              '<b>No.</b> The graph is discrete: its domain is only ' + t(lst(xs)) + '. There is no dot at ' + t('x=' + q) + (inside ? ', even though it lies between other dots' : '') + '.', [HLIST], 'is x in domain (dots)', true);
          } }] },
      { num: '8', shared: function (r) {
          var o = r.chance(0.25) ? [-4, -3, 2, 2] : pickWhere(function () { return [r.int(-5, -3), r.int(-5, 0), r.pick([2]), r.pick([1, 2, -1, -2])]; }, function (z) { var y4 = z[1] + 4 * z[3] * 1; return Math.abs(y4) <= 5; });
          var x0 = o[0], y0 = o[1], dx = o[2], dy = o[3], P = range(0, 4).map(function (k) { return [x0 + k * dx, y0 + k * dy]; });
          return { P: P };
        },
        stem: function (o) { return 'Graphs (a) and (b) use the <b>same</b> five points, but (b) joins them into an unbroken segment.<div style="display:flex;flex-wrap:wrap;gap:8px 16px"><div style="flex:1 1 200px;max-width:260px">(a) Five separate dots.' + Gfix({ max: 260, points: o.P.map(function (p) { return { x: p[0], y: p[1] }; }) }) + '</div><div style="flex:1 1 200px;max-width:260px">(b) The same points, joined.' + Gfix({ max: 260, segs: [{ pts: [o.P[0], o.P[4]], start: 'closed', end: 'closed' }], points: o.P.map(function (p) { return { x: p[0], y: p[1] }; }) }) + '</div></div>'; },
        parts: [
          { id: 'e8a', sub: 'a', level: 'EMG', make: function (r, o) {
            var xs = o.P.map(function (p) { return p[0]; }), ys = o.P.map(function (p) { return p[1]; });
            return drPart('(a) State the domain and range of graph (a).', lst(xs), lst(ys), { dC: { 'set-continuous': 'Graph (a) is separate dots: list their ' + t('x') + '-values.' }, rC: { 'set-continuous': 'Graph (a) is separate dots: list their ' + t('y') + '-values.' } },
              t('D=' + lst(xs)) + ', ' + t('R=' + lst(ys)) + '.', [HLIST], 'EP8 dots');
          } },
          { id: 'e8b', sub: 'b', level: 'EMG', make: function (r, o) {
            var A = o.P[0], C = o.P[4], lo = Math.min(A[1], C[1]), hi = Math.max(A[1], C[1]);
            return drPart('(b) State the domain and range of graph (b).', rng('x', A[0], C[0]), rng('y', lo, hi), { dC: { 'set-discrete': 'Graph (b) is unbroken: every ' + t('x') + ' between the ends is used. Use an inequality.' }, rC: { 'set-discrete': 'Graph (b) is unbroken: every ' + t('y') + ' between the ends is used. Use an inequality.' } },
              t('D:\\ ' + rng('x', A[0], C[0])) + ', ' + t('R:\\ ' + rng('y', lo, hi)) + '.', [HD, HR], 'EP8 joined');
          } },
          { id: 'e8c', sub: 'c', level: 'PRG', make: function (r, o) {
            var xs = o.P.map(function (p) { return p[0]; }), a = xs[0], b = xs[4];
            var chk = function (resp) {
              var w = words(resp, 'x'); if (w.empty) return form('empty', 'Type two ' + t('x') + '-values, separated by a comma.');
              var P = w.list ? S.parse(w.tex) : null; if (!P || !P.ok || P.set.kind !== 'list') return form('set-unreadable', 'Type two numbers separated by a comma, e.g. ' + t('-1,\\ 2.5') + '.');
              var V = P.set.vals; if (V.length < 2) return form('set-missing', 'Name <b>two</b> different ' + t('x') + '-values.');
              var outV = V.filter(function (v) { return v < a || v > b; }); if (outV.length) return wrong('u5l5-not-between', t(nn(outV[0])) + ' isn’t in the domain of graph (b) either: the segment only runs from ' + t('x=' + a) + ' to ' + t('x=' + b) + '.');
              var inL = V.filter(function (v) { return xs.some(function (x) { return Math.abs(x - v) < 1e-9; }); }); if (inL.length) return wrong('u5l5-in-list', 'There is a dot at ' + t('x=' + nn(inL[0])) + ', so it <b>is</b> in the domain of graph (a). Choose values between the dots.');
              return ok();
            };
            var k1 = a + 1, k2 = a + 0.5;
            var p = { prompt: '(c) Name two ' + t('x') + '-values that belong to the domain of graph (b) but <b>not</b> to the domain of graph (a).', input: { type: 'math', keys: KEYS, vars: ['x'], placeholder: 'e.g. 1, 2.5' }, check: chk, key: nn(k1) + ', ' + nn(k2), answer: 'For example ' + t(nn(k1)) + ' and ' + t(nn(k2)) + ' — any values between ' + t(a) + ' and ' + t(b) + ' that are not dots.',
              solution: 'Graph (b) uses every ' + t('x') + ' from ' + t(a) + ' to ' + t(b) + '; graph (a) uses only ' + t(lst(xs)) + '. Any value in between that is not one of the dots works, e.g. ' + t(nn(k1)) + ', ' + t(nn(k2)) + ', ' + t(nn(a + 0.25)) + '.', hints: ['Graph (a) only owns its five dots; graph (b) owns every point between them.'], text: 'values in (b) not (a)',
              bad: [nn(xs[0]) + ', ' + nn(xs[1]), nn(a - 1) + ', ' + nn(k1)] };
            return p;
          } },
          { id: 'e8c2', sub: 'c, why', level: 'PRG', make: function (r, o) {
            return B.mc(r, 'Why does a discrete relation get a list and a continuous one get an inequality?', [
              { html: 'A discrete graph owns only the values of its dots, so we list them; a continuous graph owns every value between its ends, which only an inequality can describe.', right: true },
              { html: 'Lists are for small numbers and inequalities for large numbers.', why: 'The size of the numbers doesn’t matter. What matters is whether the values in between belong to the graph.' },
              { html: 'It is just a convention; both would be correct.', why: 'An inequality for graph (a) would claim values like ' + t(o.P[0][0] + 0.5) + ' are in its domain — they aren’t.' },
              { html: 'A continuous graph has too many dots to list, so we give its endpoints only.', why: 'A continuous graph has no separate dots — and the inequality includes every value <b>between</b> the endpoints, not just them.' }],
              'Graph (a) owns only its five ' + t('x') + '-values, so a list is exact. Graph (b) owns every value between its ends — infinitely many — and an inequality says exactly that.', ['What does each graph own between its end values?'], 'list vs inequality');
          } }] },
      { num: '9', shared: function (r) {
          if (r.chance(0.25)) return { A: [-5, -2], B1: [-1, 2], B2: [2, 2], C: [5, 5] };
          return pickWhere(function () { var a = r.int(-5, -4), b = r.int(-2, -1), c = r.int(1, 2), d = r.int(4, 5), y0 = r.int(-4, -1), m = r.int(1, 4) + y0, top = m + r.int(2, 4); return { A: [a, y0], B1: [b, m], B2: [c, m], C: [d, top] }; }, function (z) { return z.C[1] <= 5 && z.B1[1] > z.A[1]; });
        },
        stem: function (o) { return 'This graph is made of two separate pieces, all four endpoints solid.' + Gfix({ segs: [{ pts: [o.A, o.B1], start: 'closed', end: 'closed' }, { pts: [o.B2, o.C], start: 'closed', end: 'closed' }] }); },
        parts: [
          { id: 'e9', sub: 'a', level: 'ADV', make: function (r, o) {
            var D = rng('x', o.A[0], o.B1[0]) + '\\text{ or }' + rng('x', o.B2[0], o.C[0]), R = rng('y', o.A[1], o.C[1]);
            return drPart('State the domain and the range. (Join two pieces with “or”.)', D, R, {
              dW: [{ is: rng('x', o.A[0], o.C[0]), code: 'dr-gap', hint: 'There is a gap: no point of the graph has an ' + t('x') + '-value between ' + t(o.B1[0]) + ' and ' + t(o.B2[0]) + '. Describe each piece and join them with “or”.' }],
              rW: [{ is: rng('y', o.A[1], o.B1[1]) + '\\text{ or }' + rng('y', o.B2[1], o.C[1]), code: 'dr-fill-gap', hint: 'Check the heights: the first piece reaches up to ' + t('y=' + o.B1[1]) + ' and the second starts at ' + t('y=' + o.B2[1]) + ' — they meet, so the range has no gap.' }] },
              'Domain: the first piece covers ' + t(rng('x', o.A[0], o.B1[0])) + ', the second ' + t(rng('x', o.B2[0], o.C[0])) + '; nothing in between, so ' + t('D:\\ ' + D) + '.<br>Range: the first piece supplies ' + t('y') + ' from ' + t(o.A[1]) + ' to ' + t(o.B1[1]) + ', the second from ' + t(o.B2[1]) + ' to ' + t(o.C[1]) + ' — they meet, so ' + t('R:\\ ' + R) + '.', [HD, 'Read each piece separately, then put them together.'], 'two pieces, gap in domain');
          } },
          { id: 'e9b', sub: 'b', level: 'PRG', make: function (r, o) {
            return B.mc(r, 'One of the two answers has a gap and the other does not. Which one, and why?', [
              { html: 'The <b>domain</b> has the gap: no points between ' + t('x=' + o.B1[0]) + ' and ' + t('x=' + o.B2[0]) + '. The range has none, because the second piece starts at the height where the first one ends.', right: true },
              { html: 'The <b>range</b> has the gap, because the graph is in two pieces.', why: 'Two pieces don’t always give a gap. Compare the heights: the first piece ends at ' + t('y=' + o.B1[1]) + ' and the second starts there too.' },
              { html: 'Both have gaps, because the graph is in two pieces.', why: 'Look at the heights: is any height between ' + t(o.A[1]) + ' and ' + t(o.C[1]) + ' missing?' },
              { html: 'Neither has a gap: both answers are unbroken.', why: 'Look left to right: is there any ' + t('x') + '-value between ' + t(o.B1[0]) + ' and ' + t(o.B2[0]) + ' on the graph?' }],
              'The domain skips the ' + t('x') + '-values between ' + t(o.B1[0]) + ' and ' + t(o.B2[0]) + '. The range has no gap: the first piece supplies ' + t('y') + ' from ' + t(o.A[1]) + ' to ' + t(o.B1[1]) + ' and the second picks up at ' + t('y=' + o.B2[1]) + ' and runs to ' + t(o.C[1]) + '.', ['Shine a light down (domain) and across (range): which shadow has a gap?'], 'which has the gap');
          } }] },
      { num: '10', shared: function (r) {
          if (r.chance(0.25)) return { a: -5, m: -1, b: 5, lo: -3, hi: 3 };
          return pickWhere(function () { var lo = r.int(-5, 0), hi = lo + r.int(2, 6); return { a: r.int(-5, -4), m: r.int(-2, 2), b: r.int(4, 5), lo: lo, hi: hi }; }, function (z) { return z.hi <= 5 && z.lo !== 0 && z.hi !== 0; });
        },
        stem: function (o) { return 'This graph is made of two flat pieces — notice the open circle at the right end of the lower piece.' + Gfix({ segs: [{ pts: [[o.a, o.lo], [o.m, o.lo]], start: 'closed', end: 'open' }, { pts: [[o.m, o.hi], [o.b, o.hi]], start: 'closed', end: 'closed' }] }); },
        parts: [
          { id: 'e10', sub: 'a', level: 'ADV', make: function (r, o) {
            var D = rng('x', o.a, o.b), R = lst([o.lo, o.hi]);
            return drPart('State the domain and the range.', D, R, {
              dW: [{ is: rng('x', o.a, o.m, true, false) + '\\text{ or }' + rng('x', o.m, o.b), code: 'dr-fill-gap', hint: 'The open circle at ' + t('x=' + o.m) + ' is filled in by the solid dot right above it, ' + t(ptT([o.m, o.hi])) + ': ' + t('x=' + o.m) + ' <b>is</b> in the domain, so there is no gap.' }],
              rC: { 'set-continuous': 'Both pieces are flat: the only heights are ' + t('y=' + o.lo) + ' and ' + t('y=' + o.hi) + '. List them in braces.' },
              rW: [{ is: rng('y', o.lo, o.hi), code: 'set-continuous', hint: 'No point of the graph has a height between ' + t(o.lo) + ' and ' + t(o.hi) + ': both pieces are flat. The range is just those two values.' }] },
              'Left to right, every ' + t('x') + ' from ' + t(o.a) + ' to ' + t(o.b) + ' is used (the open circle at ' + t('x=' + o.m) + ' is covered by the solid dot above it): ' + t('D:\\ ' + D) + '.<br>Both pieces are flat, at ' + t('y=' + o.lo) + ' and ' + t('y=' + o.hi) + ': ' + t('R=' + R) + '.', [HD, 'How many different heights does the graph use?'], 'two flat pieces');
          } },
          { id: 'e10b', sub: 'b', level: 'PRG', make: function (r, o) {
            return B.mc(r, 'The domain is an unbroken interval but the range is a short list. How can that happen?', [
              { html: 'The open circle at ' + t(ptT([o.m, o.lo])) + ' is filled in by the solid dot at ' + t(ptT([o.m, o.hi])) + ', so every ' + t('x') + ' is used; but the two flat pieces only ever reach two heights.', right: true },
              { html: 'Because open circles don’t count at all.', why: 'Open circles matter: ' + t(ptT([o.m, o.lo])) + ' itself is not on the graph. Here another point covers ' + t('x=' + o.m) + '.' },
              { html: 'Because the range is always shorter than the domain.', why: 'There is no such rule. Look at what heights the pieces reach.' },
              { html: 'Because the graph is discrete.', why: 'The pieces are unbroken segments, so the graph isn’t discrete. Look at their heights.' }],
              'Left to right there is no missing ' + t('x') + ': the solid dot ' + t(ptT([o.m, o.hi])) + ' covers ' + t('x=' + o.m) + '. Bottom to top, the flat pieces only give the heights ' + t(o.lo) + ' and ' + t(o.hi) + '.', ['Shine a light down, then across.'], 'interval domain, list range');
          } }] },
      { num: '11', shared: function (r) {
          if (r.chance(0.25)) return { xs: [-3, 1, 5], lo: -2, hi: 3 };
          var xs = r.sample(nz(-5, 5), 3).sort(function (a, b) { return a - b; }), lo = r.int(-5, 0); return { xs: xs, lo: lo, hi: Math.min(5, lo + r.int(3, 8)) };
        },
        stem: function (o) { return 'This relation is three separate vertical segments, each with solid ends.' + Gfix({ segs: o.xs.map(function (x) { return { pts: [[x, o.lo], [x, o.hi]], start: 'closed', end: 'closed' }; }) }); },
        parts: [
          { id: 'e11', level: 'ADV', make: function (r, o) {
            var D = lst(o.xs), R = rng('y', o.lo, o.hi);
            return drPart('State the domain and range.', D, R, { dW: [{ is: rng('x', o.xs[0], o.xs[2]), code: 'set-discrete', hint: 'Only three ' + t('x') + '-values are used — one for each vertical segment. List them.' }], dC: { 'set-discrete': 'Each vertical segment has a single ' + t('x') + '-value. List the three values.' } },
              'Each segment is vertical, so it uses one ' + t('x') + ': ' + t('D=' + D) + '. Each covers every height from ' + t(o.lo) + ' to ' + t(o.hi) + ': ' + t('R:\\ ' + R) + '.', [HD, 'How many different ' + t('x') + '-values does a vertical segment use?'], 'three vertical segments');
          } }] },
      { num: '12', shared: function (r) {
          if (r.chance(0.25)) return { A: [-4, 1], C: [1, -4], P: [4, 3] };
          return pickWhere(function () { var a = r.int(-5, -3), c = a + r.int(3, 5), y1 = r.int(-1, 3), y2 = y1 - r.int(3, 6); return { A: [a, y1], C: [c, y2], P: [r.int(c + 2, 5), r.pick([y1 + 2, y1 + 1, y2 - 1, 4, -5])] }; }, function (z) { return z.C[0] <= 3 && z.C[1] >= -5 && Math.abs(z.P[1]) <= 5 && (z.P[1] > z.A[1] || z.P[1] < z.C[1]); });
        },
        stem: function (o) { return 'This relation is one segment <b>plus</b> one lone dot off to the right.' + Gfix({ segs: [{ pts: [o.A, o.C], start: 'closed', end: 'closed' }], points: [{ x: o.P[0], y: o.P[1] }] }); },
        parts: [
          { id: 'e12', level: 'ADV', make: function (r, o) {
            var lo = Math.min(o.A[1], o.C[1]), hi = Math.max(o.A[1], o.C[1]);
            var D = rng('x', o.A[0], o.C[0]) + '\\text{ or }x=' + o.P[0], R = rng('y', lo, hi) + '\\text{ or }y=' + o.P[1];
            return drPart('State the domain and range. Each answer needs an inequality <b>and</b> a single value (join them with “or”).', D, R, {
              dW: [{ is: rng('x', o.A[0], o.C[0]), code: 'set-missing', hint: 'Don’t forget the lone dot: its ' + t('x') + '-value, ' + t(o.P[0]) + ', is in the domain too.' }, { is: rng('x', o.A[0], o.P[0]), code: 'dr-gap', hint: 'There is a gap between the end of the segment (' + t('x=' + o.C[0]) + ') and the dot (' + t('x=' + o.P[0]) + '). Write the segment and the dot separately, joined with “or”.' }],
              rW: [{ is: rng('y', lo, hi), code: 'set-missing', hint: 'Don’t forget the lone dot: its height, ' + t(o.P[1]) + ', is in the range too.' }] },
              'Segment: ' + t(rng('x', o.A[0], o.C[0])) + ' and ' + t(rng('y', lo, hi)) + '. Lone dot ' + t(ptT(o.P)) + ': ' + t('x=' + o.P[0]) + ', ' + t('y=' + o.P[1]) + '.<br>' + t('D:\\ ' + D) + '<br>' + t('R:\\ ' + R), [HD, 'Read the segment first, then add the dot.'], 'segment plus dot');
          } }] },
      { num: '13', section: 'Extra Practice C — Error Analysis, Sketching, and Reasoning', shared: function (r) { var s = segShape(r, [[-4, -3], [2, 3]]); return { A: s[0], C: s[1] }; },
        stem: function (o) { var lo = Math.min(o.A[1], o.C[1]), hi = Math.max(o.A[1], o.C[1]); return '<b>Error analysis.</b> Kayla read this graph and wrote “D: ' + t(rng('x', o.A[0], o.C[0])) + ' &nbsp; R: ' + t(rng('x', lo, hi)) + '.” One of her answers is right and one has a mistake.' + Gfix({ segs: [{ pts: [o.A, o.C], start: 'closed', end: 'closed' }] }); },
        parts: [
          { id: 'e13', sub: 'a', level: 'EMG', make: function (r, o) {
            return B.mc(r, 'What is Kayla’s mistake?', [
              { html: 'Her <b>range</b> uses ' + t('x') + ': a range describes ' + t('y') + '-values, so it must use ' + t('y') + '.', right: true },
              { html: 'Her <b>domain</b> has the wrong numbers.', why: 'Check: the segment runs from ' + t('x=' + o.A[0]) + ' to ' + t('x=' + o.C[0]) + ' — her domain is right.' },
              { html: 'She should have used ' + t('<') + ' instead of ' + t('\\le') + '.', why: 'Both end dots are solid, so ' + t('\\le') + ' is right. Look at the letter in her range.' },
              { html: 'Her range should be a list.', why: 'The segment is unbroken, so an inequality is right. Look at the letter she used.' }],
              'Her domain is correct. Her range has the right numbers but uses ' + t('x') + ': the range is about ' + t('y') + '-values.', ['Read both answers letter by letter.'], 'Kayla error');
          } },
          { id: 'e13b', sub: 'b', level: 'EMG', make: function (r, o) {
            var lo = Math.min(o.A[1], o.C[1]), hi = Math.max(o.A[1], o.C[1]);
            return drPart('Write the corrected range.', rng('x', o.A[0], o.C[0]), rng('y', lo, hi), { only: 'R', letterWrong: 'That is Kayla’s mistake again: a range uses the letter ' + t('y') + '.' },
              'The heights run from ' + t(lo) + ' to ' + t(hi) + ', so ' + t('R:\\ ' + rng('y', lo, hi)) + '.', ['Same numbers, correct letter.'], 'Kayla corrected');
          } }] },
      { num: '14', shared: function (r) { var s = r.chance(0.25) ? [[-3, 3], [4, -4]] : pickWhere(function () { var a = r.int(-5, -2), b = a + r.int(4, 8), y = r.int(1, 5); return [[a, y], [b, y - r.int(4, 8)]]; }, function (s2) { return s2[1][0] <= 5 && s2[1][1] >= -5; }); return { A: s[0], C: s[1] }; },
        stem: function (o) { return '<b>Error analysis.</b> Owen read this graph and wrote “D: ' + t(rng('x', o.A[0], o.C[0])) + ' &nbsp; R: ' + t(rng('y', o.C[1], o.A[1])) + '.” His numbers are right but two of his symbols are wrong.' + Gfix({ segs: [{ pts: [o.A, o.C], start: 'open', end: 'closed' }] }); },
        parts: [
          { id: 'e14', sub: 'a', level: 'PRG', make: function (r, o) {
            var I = segEP(o.A, o.C, 'open', 'closed', 'Owen corrected');
            I.dW.push({ is: rng('x', o.A[0], o.C[0]), code: 'set-endpoint', hint: 'That is Owen’s answer. The open circle is at ' + t('x=' + o.A[0]) + ': that end gets ' + t('<') + '.' });
            I.rW.push({ is: rng('y', o.C[1], o.A[1]), code: 'set-endpoint', hint: 'That is Owen’s answer. The open circle is at height ' + t('y=' + o.A[1]) + ': that end gets ' + t('<') + '.' });
            return drEP('Correct both answers.', I);
          } },
          { id: 'e14b', sub: 'b', level: 'PRG', make: function (r, o) {
            return B.mc(r, 'Why does the one open circle change <b>both</b> answers?', [
              { html: 'The open circle ' + t(ptT(o.A)) + ' is one point with an ' + t('x') + '-value and a ' + t('y') + '-value: leaving the point out removes ' + t('x=' + o.A[0]) + ' from the domain <b>and</b> ' + t('y=' + o.A[1]) + ' from the range.', right: true },
              { html: 'Because the domain and range must always use the same symbols.', why: 'They don’t have to — here the left end of the domain and the <b>top</b> of the range change. Why those two?' },
              { html: 'Because open circles change every symbol in the answer.', why: 'Only the ends that come from the open circle change; the solid end keeps ' + t('\\le') + '.' },
              { html: 'Because the segment goes downhill.', why: 'Downhill decides which end of the range the circle is at, not whether it matters. What does one point contribute?' }],
              'Each endpoint supplies one ' + t('x') + '-value and one ' + t('y') + '-value. Excluding the point ' + t(ptT(o.A)) + ' excludes ' + t('x=' + o.A[0]) + ' (the left end of the domain) and ' + t('y=' + o.A[1]) + ' (the top of the range).', ['What two numbers does the open circle stand for?'], 'why both change');
          } }] },
      { num: '15', shared: function (r) { var a = r.chance(0.25) ? [-2, 4] : pickWhere(function () { var x0 = r.int(-4, 0); return [x0, x0 + r.int(3, 6)]; }, function (z) { return z[1] <= 5; }); var y1 = r.int(-4, -1), y2 = r.int(1, 4); return { a: a[0], b: a[1], y1: y1, y2: y2, c: r.pick(nz(-4, 4)) }; },
        stem: function (o) { return '<b>Same domain, different range.</b> Graph 1 below has domain ' + t(rng('x', o.a, o.b)) + '.' + '<div style="max-width:260px"><b>Graph 1</b>' + Gfix({ max: 260, segs: [{ pts: [[o.a, o.y1], [o.b, o.y2]], start: 'closed', end: 'closed' }] }) + '</div>'; },
        parts: [
          { id: 'e15r', sub: 'a', level: 'BEG', make: function (r, o) {
            return drPart('State the range of Graph 1.', rng('x', o.a, o.b), rng('y', o.y1, o.y2), { only: 'R' }, 'Graph 1 rises from ' + t(ptT([o.a, o.y1])) + ' to ' + t(ptT([o.b, o.y2])) + ', both ends solid: ' + t('R:\\ ' + rng('y', o.y1, o.y2)) + '.', [HR], 'range of Graph 1');
          } },
          { id: 'e15s', sub: 'a, sketch', level: 'PRG', make: function (r, o) {
            var Dt = rng('x', o.a, o.b), r1 = Dr.setParts(S.parse(rng('y', o.y1, o.y2)).set), g1 = drw([seg([o.a, o.y1], [o.b, o.y2])]);
            return sketchPart('Sketch <b>Graph 2</b>: a different graph with the same domain ' + t(Dt) + ' but a <b>different range</b> from Graph 1.', { domain: Dt, custom: function (v) {
                return Dr.partsSame(Dr.range(v).parts, r1) ? { code: 'sk-same-range', hint: 'Your graph has the same range as Graph 1. Keep the ends at ' + t('x=' + o.a) + ' and ' + t('x=' + o.b) + ', but change how low or high it goes.' } : null; } },
              drw([seg([o.a, o.c], [o.b, o.c])]), [g1, drw([seg([o.b, o.y1], [o.a, o.y2])]), drw([seg([o.a, o.c], [o.b, o.c], 'closed', 'open')]), drw([seg([o.a - 1, o.c], [o.b, o.c])])],
              'Any unbroken graph from ' + t('x=' + o.a) + ' to ' + t('x=' + o.b) + ' (solid ends) that does not reach exactly from ' + t('y=' + o.y1) + ' to ' + t('y=' + o.y2) + '. For example the flat segment from ' + t(ptT([o.a, o.c])) + ' to ' + t(ptT([o.b, o.c])) + ': its range is ' + t('\\{' + o.c + '\\}') + '.',
              ['Keep the leftmost and rightmost points at ' + t('x=' + o.a) + ' and ' + t('x=' + o.b) + ' with solid dots.', 'Change the heights: a flat segment, or one that goes higher or lower than Graph 1.'], 'sketch same domain, different range');
          } },
          { id: 'e15b', sub: 'b', level: 'EMG', make: function (r, o) {
            return B.tf(r, 'Two different graphs can have the same domain but different ranges.', true, 'Look at Graph 1 and your Graph 2: same domain, different ranges.', '<b>True.</b> The domain only says how far left and right a graph reaches, not how high or low it goes — Graph 1 and your Graph 2 show it.', ['Do Graph 1 and your Graph 2 have the same range?'], 'same domain different range');
          } }] },
      { num: '16', shared: function (r) { var o = r.chance(0.3) ? { a: -5, b: 2, lo: -2, hi: 5 } : pickWhere(function () { var a = r.int(-5, -2), lo = r.int(-4, 0); return { a: a, b: a + r.int(4, 7), lo: lo, hi: lo + r.int(4, 7) }; }, function (z) { return z.b <= 5 && z.hi <= 5; }); return o; },
        stem: function (o) { return '<b>Work backwards.</b> A single line segment has domain ' + t(rng('x', o.a, o.b, true, false)) + ' and range ' + t(rng('y', o.lo, o.hi, false, true)) + '.'; },
        parts: [
          { id: 'e16', sub: 'sketch', level: 'MAS', make: function (r, o) {
            var key = drw([seg([o.a, o.hi], [o.b, o.lo], 'closed', 'open')]);
            return sketchPart('Sketch the segment, with the solid and open ends drawn correctly.', { domain: rng('x', o.a, o.b, true, false), range: rng('y', o.lo, o.hi, false, true), custom: function (v) { return v.pieces.length !== 1 || v.pts.length ? { code: 'graph', hint: 'Draw a <b>single</b> line segment (one piece, no separate dots).' } : null; } }, key,
              [drw([seg([o.a, o.lo], [o.b, o.hi], 'closed', 'open')]), drw([seg([o.a, o.hi], [o.b, o.lo])]), drw([seg([o.a, o.hi], [o.b, o.lo], 'open', 'closed')])],
              'The included ' + t('x') + ' (' + t(o.a) + ', with ' + t('\\le') + ') must pair with the included ' + t('y') + ' (' + t(o.hi) + ', with ' + t('\\le') + '): the solid end is ' + t(ptT([o.a, o.hi])) + '. The open end is ' + t(ptT([o.b, o.lo])) + '. The segment goes down from left to right.',
              ['Which end values are included (' + t('\\le') + ')? They must belong to the same endpoint.', 'The solid end has ' + t('x=' + o.a) + '; what is its ' + t('y') + '?'], 'work backwards segment',
              function (v, res, dd, rr) { if (v.pieces.length === 1) { var pc = v.pieces[0]; var lft = pc.v[0][0] < pc.v[1][0] ? [pc.v[0], pc.s] : [pc.v[1], pc.e]; if (Math.abs(lft[0][0] - o.a) < 1e-9 && Math.abs(lft[0][1] - o.lo) < 1e-9) return { code: 'sk-ends', hint: 'Your segment goes uphill. The included ' + t('x') + '-value (' + t(o.a) + ') has to sit with the included ' + t('y') + '-value (' + t(o.hi) + '), so the left end is the <b>high</b> end.' }; } return null; }, true);
          } },
          { id: 'e16a', sub: 'a', level: 'PRG', make: function (r, o) {
            return B.mc(r, '(a) Which endpoint is solid, and how do you know?', [
              { html: t(ptT([o.a, o.hi])) + ': ' + t(o.a + '\\le x') + ' includes ' + t('x=' + o.a) + ' and ' + t('y\\le ' + o.hi) + ' includes ' + t('y=' + o.hi) + ', and both come from the same point.', right: true },
              { html: t(ptT([o.b, o.lo])) + ': the right end is always solid.', why: t('x<' + o.b) + ' leaves ' + t(o.b) + ' out, so the right end is open.' },
              { html: t(ptT([o.a, o.lo])) + ': the smallest values are always included.', why: t(o.lo + '<y') + ' leaves ' + t(o.lo) + ' out. Which ' + t('y') + '-value is included?' },
              { html: 'Both ends are solid.', why: 'The symbols ' + t('<') + ' in the domain and range say one end is left out.' }],
              t('\\le') + ' appears at ' + t('x=' + o.a) + ' and at ' + t('y=' + o.hi) + ', so the included endpoint is ' + t(ptT([o.a, o.hi])) + '; the open end is ' + t(ptT([o.b, o.lo])) + '.', ['Find the ' + t('\\le') + ' in each inequality.'], 'which end solid');
          } },
          { id: 'e16b', sub: 'b', level: 'PRG', make: function (r, o) {
            return B.mc(r, '(b) Is the segment increasing or decreasing, and why does it <b>have</b> to be?', [
              { html: '<b>Decreasing:</b> the included ' + t('x') + ' (' + t(o.a) + ', the left end) must pair with the included ' + t('y') + ' (' + t(o.hi) + ', the top), so the left end is high and the right end is low.', right: true },
              { html: '<b>Increasing:</b> segments always go up from left to right.', why: 'Segments can go either way. Which end values are included, and do they belong to the same point?' },
              { html: '<b>Increasing:</b> the domain and range both get bigger.', why: 'If it rose, its left end would be at the bottom, ' + t('y=' + o.lo) + ' — but that end is included and ' + t(o.lo) + ' is not.' },
              { html: 'Either one works.', why: 'Only one choice matches the solid and open ends. Try the other and check which values would be included.' }],
              '<b>Decreasing.</b> The solid end has ' + t('x=' + o.a) + ' (left) and ' + t('y=' + o.hi) + ' (top), so the graph starts high on the left and falls to the open end ' + t(ptT([o.b, o.lo])) + '.', ['The solid end is on the left. Is it at the top or the bottom?'], 'increasing or decreasing');
          } }] },
      { num: '17', stem: '<b>Reasoning.</b>', parts: [
        { id: 'e17', level: 'PRG', make: function (r) {
          var a = r.pick([2, 1, -1, 3]), b = a + r.pick([3, 4, 5]);
          return B.mc(r, 'Can an <b>unbroken</b> (continuous) graph have a range of exactly two values, ' + t('R=\\{' + a + ',\\ ' + b + '\\}') + ', and nothing in between?', [
            { html: '<b>No.</b> An unbroken graph can’t jump from height ' + t(a) + ' to height ' + t(b) + ' without passing every height in between. A graph with ' + t('R=\\{' + a + ',\\ ' + b + '\\}') + ' must be broken, e.g. two flat pieces at ' + t('y=' + a) + ' and ' + t('y=' + b) + '.', right: true },
            { html: '<b>Yes:</b> a straight line from ' + t('y=' + a) + ' to ' + t('y=' + b) + '.', why: 'That line passes every height between ' + t(a) + ' and ' + t(b) + ' — e.g. ' + t(a + 0.5) + ' — so its range isn’t just two values.' },
            { html: '<b>Yes:</b> a horizontal line.', why: 'A horizontal line has only <b>one</b> height.' },
            { html: '<b>No,</b> because a range can never be a list.', why: 'Ranges can be lists — for separate dots or flat pieces (Question 10).' }],
            '<b>No.</b> To get from height ' + t(a) + ' to height ' + t(b) + ' without lifting the pencil, a graph passes every height between them, so its range would include all of ' + t(rng('y', a, b)) + '. Two separate flat pieces (as in Question 10) give exactly ' + t('\\{' + a + ',\\ ' + b + '\\}') + '.', ['Draw a continuous graph from height ' + t(a) + ' to height ' + t(b) + '. Which heights does it pass?'], 'continuous two-value range?');
        } }] },
      { num: '18', shared: function (r) { return r.chance(0.3) ? { a: -4, b: 2, lo: 1, hi: 7 } : pickWhere(function () { var a = r.int(-5, -2), lo = r.int(-5, 0); return { a: a, b: a + r.int(3, 7), lo: lo, hi: lo + r.int(3, 7) }; }, function (z) { return z.b <= 5 && z.hi <= 5; }); },
        stem: function (o) { return '<b>Stretch.</b> A relation is one single line segment. Its domain is ' + t(rng('x', o.a, o.b)) + ' and its range is ' + t(rng('y', o.lo, o.hi)) + '. There are exactly <b>two</b> different segments this could be.'; },
        parts: [
          { id: 'e18', sub: 'a', level: 'MAS', make: function (r, o) {
            var s1 = seg([o.a, o.lo], [o.b, o.hi]), s2 = seg([o.a, o.hi], [o.b, o.lo]), key = drw([s1, s2]);
            var PADx = Object.assign({}, PAD, { y: [Math.min(-6, o.lo - 1), Math.max(6, o.hi + 1)] });
            var check = function (resp) {
              var v = Dr.norm(resp);
              if (Dr.empty(v)) return form('empty', 'Draw both possible segments.');
              if (Dr.same(v, key)) return ok();
              var one = function (sg) { return Dr.same(v, drw([sg])); };
              if (one(s1) || one(s2)) return wrong('int-missing', 'That is one of them. Draw the <b>other</b> one too: it has the same two ' + t('x') + '-values and the same two heights, paired the other way.');
              if (v.pieces.some(function (pc) { return pc.s !== 'closed' || pc.e !== 'closed'; })) return wrong('sk-ends', 'The domain and range use ' + t('\\le') + ' on both sides, so every end is a <b>solid</b> dot.');
              var dd = Dr.domain(v).parts, rr = Dr.range(v).parts, dP = Dr.setParts(S.parse(rng('x', o.a, o.b)).set), rP = Dr.setParts(S.parse(rng('y', o.lo, o.hi)).set);
              if (!Dr.partsSame(dd, dP)) return wrong('rule-domain', 'Each segment must run from ' + t('x=' + o.a) + ' to ' + t('x=' + o.b) + '.');
              if (!Dr.partsSame(rr, rP)) return wrong('rule-range', 'Each segment must go from height ' + t(o.lo) + ' to height ' + t(o.hi) + '.');
              return wrong('graph', 'Each segment has one end at ' + t('x=' + o.a) + ' and one at ' + t('x=' + o.b) + ', one at height ' + t(o.lo) + ' and one at ' + t(o.hi) + '. Draw the two ways to pair them.');
            };
            return drawPartX('Sketch <b>both</b> possible segments on the grid. Use <b>╱ Line</b>: tap the two ends of each segment.', PADx, check, key,
              'The ends must be at ' + t('x=' + o.a) + ' and ' + t('x=' + o.b) + ', with heights ' + t(o.lo) + ' and ' + t(o.hi) + '. The only choice is which height goes with which end: ' + t(ptT([o.a, o.lo])) + ' to ' + t(ptT([o.b, o.hi])) + ' (increasing) or ' + t(ptT([o.a, o.hi])) + ' to ' + t(ptT([o.b, o.lo])) + ' (decreasing).',
              ['The domain fixes the ' + t('x') + '-values of the ends; the range fixes their heights.', 'Pair the heights with the ends in both possible ways.'], 'two possible segments', [drw([s1]), drw([s2]), drw([seg([o.a, o.lo], [o.b, o.lo]), seg([o.a, o.hi], [o.b, o.hi])])]);
          } },
          { id: 'e18b', sub: 'b', level: 'PRG', make: function (r, o) {
            return B.mc(r, 'Why are there exactly two segments and not more?', [
              { html: 'The ends must be at ' + t('x=' + o.a) + ' and ' + t('x=' + o.b) + ' with heights ' + t(o.lo) + ' and ' + t(o.hi) + '; the only choice left is which height goes with which end — two ways.', right: true },
              { html: 'Because a segment has two ends.', why: 'That is true of every segment. What is still free to choose once the domain and range are fixed?' },
              { html: 'Because one must be increasing and one decreasing, and there is no third direction.', why: 'A flat or vertical segment couldn’t have this domain and range. Why exactly two? Think about pairing heights with ends.' },
              { html: 'There are actually infinitely many.', why: 'The ends are pinned by the domain and range. Try to draw a third one.' }],
              'The domain pins the ends at ' + t('x=' + o.a) + ' and ' + t('x=' + o.b) + '; the range pins the heights ' + t(o.lo) + ' and ' + t(o.hi) + '. Pairing them can be done in exactly two ways.', ['Once the end ' + t('x') + '-values and the two heights are fixed, what is left to choose?'], 'why exactly two');
          } }] }
    ];
  }
  function numPart(prompt, ans, dl, sol, hints, text, inp) {
    dl = (dl || []).filter(function (d) { return d[0] !== ans; });
    var p = B.number(prompt, ans, function (v) { for (var i = 0; i < dl.length; i++) if (v === dl[i][0]) return { code: dl[i][1], hint: dl[i][2] }; return null; }, sol, hints, text, inp);
    p.bad = dl.map(function (d) { return String(d[0]); });
    return p;
  }
  function drawPartX(prompt, inp, check, key, sol, hints, text, bad) {
    var p = B.graph(prompt, Object.assign({ tools: ['line', 'ends'] }, inp), check, key, sol, hints, text);
    p.bad = (bad || []).filter(function (b) { return !Dr.same(b, key); });
    return p;
  }
})(window);
