/* Math 15 · Unit 5 · Lesson 12 — Unit Review: Relations and Functions (mixed outcomes, set per part:
 * RF1 graphs of situations, RF2 relations/functions/domain/range, RF4 patterns and rules, RF5 intercepts, RF8 notation)
 * Assignment 12, questions 1–26 (u5_L12.tex) and the Lesson 12 Extra Practice (u5_EP12.tex, questions 1–19).
 * Uses the same machinery as Lessons 10 and 11 (copied below so the file stands alone): conversions and statements
 * typed as equations, domain/range on the set keypad, solution lists with a "none" key, graph-pad points, segments and
 * unscaled story sketches. Explain / interpret questions are multiple choice whose options are reasons, or choice
 * tables. Every part is a generator; the booklet's own numbers are among the possible values.
 * Levels (calibrated for Math 15): LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, S = HW.sets, PL = HW.poly, DR = HW.draw;

  HW.addCodes({
    'conv-no-eq': 'Wrote an expression, not an equation', 'conv-lhs': 'Left side not y or f(x)', 'conv-still-fn': 'Kept function notation (asked for y = …)',
    'conv-still-y': 'Kept y (asked for function notation)', 'conv-name': 'Wrong function name', 'conv-arg': 'Wrong variable in the brackets', 'conv-var': 'Changed the input variable',
    'conv-out': 'Used another letter for y', 'conv-move-sign': 'Sign error moving terms across',
    'stmt-unreadable': 'Statement not in function notation', 'stmt-pair': 'Wrote an ordered pair instead of function notation', 'stmt-name': 'Wrong function name in statement',
    'stmt-swap': 'Input and output swapped', 'read-reverse': 'Read the graph in the wrong direction',
    'sol-said-none': 'Said no solution (there is one)', 'sol-not-none': 'Gave solutions when there are none', 'sol-graph-missing': 'Stopped at the first crossing',
    'ev-sign': 'Sign error with a negative input', 'ev-instead': 'Evaluated instead of solving', 'solve-instead': 'Solved instead of evaluating',
    'ft-sign': 'Sign error substituting −t', 'ft-zero': 'Cancelled everything', 'xint-yint': 'Gave the y-intercept for the x-intercept', 'no-fixed': 'Left out the fixed cost',
    'nr-flip': 'Divided the wrong way', 'nr-const': 'Gave the constant', 'dr-context': 'Domain/range does not fit the situation', 'dr-from-zero': 'Range started at 0 instead of the starting value',
    'dr-peak': 'Used the endpoints instead of the highest/lowest points',
    'sk-points': 'Sketch: plotted points only, no graph', 'sk-straight': 'Sketch: not one straight segment', 'sk-vertical': 'Sketch: vertical line', 'sk-gap': 'Sketch: gap in the graph',
    'sk-extra': 'Sketch: extra point off the graph', 'sk-arrow': 'Sketch: arrow where the model stops', 'sk-dir': 'Sketch: rises/falls the wrong way', 'sk-startx': 'Sketch: domain starts at the wrong value',
    'sk-endx': 'Sketch: domain ends at the wrong value', 'sk-starty': 'Sketch: wrong starting value', 'sk-endy': 'Sketch: wrong end value (rate)',
    'u5l10-swap-rate': 'Swapped the rate and the fixed amount in the rule', 'u5l10-not-table': 'Statement not supported by the table',
    'u5l10-tie': 'Counted the break-even distance as cheaper (≤ instead of <)', 'u5l10-swap-co': 'Swapped which company is cheaper', 'u5l10-eq-zero': 'Did not set the output to 0'
  });
  HW.addPartial({ 'u5l10-swap-rate': 'n', 'u5l10-not-table': 'n', 'u5l10-tie': 's', 'u5l10-swap-co': 'n', 'u5l10-eq-zero': 'n' });

  HW.addCodes({
    'rate-flip': 'Rate as time ÷ change (upside down)', 'rate-sign': 'Sign of a rate of change wrong', 'flat-time': 'Total time on flat segments wrong', 'per-min': 'Rate per minute instead of per hour',
    'dist-vs-travel': 'Distance from home confused with distance travelled', 'wrong-line': 'Read the wrong line / segment',
    'story-bend': 'Stage drawn with the wrong bend (straight vs curved, steeper vs flatter)', 'story-zero': 'Graph reaches zero when it shouldn’t (or not when it should)', 'story-when': 'A stage at the wrong time',
    'story-lines': 'Points instead of a line', 'story-below': 'Graph drops below a level it can’t go under', 'story-peak': 'Peak at the wrong place',
    'u5l11-one-flat': 'Counted only one of the flat stretches', 'u5l11-rate-days': 'Divided by the end time instead of the change in time', 'u5l11-round': 'Rate not rounded to one decimal place',
    'u5l11-stops': 'Wrong number of stops', 'u5l11-fastest': 'Fastest stretch not between the 2nd and 3rd stops', 'u5l11-limit': 'Graph goes past a stated limit',
    'u5l11-stop-time': 'Stopped time not exactly as stated', 'u5l11-ends': 'Graph does not start or end where stated', 'xint-yint': 'Gave the vertical intercept for the horizontal one', 'sign': 'Wrong sign'
  });
  HW.addPartial({ 'u5l11-one-flat': 's', 'u5l11-rate-days': 'n', 'u5l11-round': 's', 'u5l11-stops': 'n', 'u5l11-fastest': 'b', 'u5l11-limit': 's', 'u5l11-stop-time': 's', 'u5l11-ends': 's', 'story-below': 'n', 'story-peak': 'b' });
  HW.addCodes({ 'u5l12-window': 'Calculator window does not show the crossing point', 'u5l12-not-range': 'Value not in the range', 'u5l12-in-domain': 'Value is also in the domain', 'u5l12-not-both': 'Value not in both the domain and the range' });
  HW.addPartial({ 'u5l12-window': 'n', 'u5l12-not-range': 'n', 'u5l12-in-domain': 'n', 'u5l12-not-both': 'n' });

  /* ---------------- keypad (namespaced, registered once) ---------------- */
  var EQK = 'u5l10eq', Wd = HW.widgets;
  if (Wd && Wd.KEYSETS) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    if (!Wd.KEYSETS[EQK]) Wd.KEYSETS[EQK] = function (opt) {
      var vs = (opt && opt.vars && opt.vars.length ? opt.vars : ['x', 'y']).slice(0, 6).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; });
      return [[dk(7), dk(8), dk(9), { label: '+', tex: '+', plain: '+' }, { label: '−', tex: '-', plain: '-' }, { label: '⌫', fn: 'del', title: 'Delete' }],
        [dk(4), dk(5), dk(6), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, { label: 'clear', fn: 'clear' }],
        [dk(1), dk(2), dk(3), { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (out of a box)' }],
        [dk(0), { label: '.', tex: '.', plain: '.' }, { label: '=', tex: '=', plain: ' = ' }, { label: 'Check ↵', fn: 'enter', wide: true }], vs];
    };
    if (Wd.KEYHELP && !Wd.KEYHELP[EQK]) Wd.KEYHELP[EQK] = ['Type the whole equation with the <b>=</b> key. For function notation tap the letter, then <b>( )</b>, the input letter, and <b>▶</b> to step out, e.g. ' + HW.k('f(x)=2x-3') + '.',
      'Type the whole equation, e.g. <code>f(x) = 2x - 3</code> or <code>y = 2x - 3</code>.'];
  }

  /* ---------------- numbers and LaTeX ---------------- */
  function cl(x) { return Math.round(x * 1e6) / 1e6; }
  function uniq(a) { var s = a.slice().sort(function (x, y) { return x - y; }); return s.filter(function (x, i) { return i === 0 || Math.abs(x - s[i - 1]) > 1e-9; }); }
  function gcd(a, b) { return ex.gcd(a, b); }
  function nf(x) { return String(cl(x)); }
  function money(x) { x = cl(x); return Math.abs(x - Math.round(x)) < 1e-9 ? F(Math.round(x)) : x.toFixed(2); }
  function ptT(p) { return '(' + nf(p[0]) + ',\\ ' + nf(p[1]) + ')'; }
  function term(c, v, first) {
    var neg, mag;
    if (Array.isArray(c)) { neg = c[0] * c[1] < 0; var p = Math.abs(c[0]), q = Math.abs(c[1]); mag = q === 1 ? (p === 1 && v ? '' : String(p)) : '\\frac{' + p + '}{' + q + '}'; }
    else { neg = c < 0; var a = Math.abs(c); mag = a === 1 && v ? '' : String(cl(a)); }
    return (neg ? '-' : first ? '' : '+') + mag + v;
  }
  /* linear expression in the order given: [[coef, 'x'], [coef, '']]; coef a number or [p, q] */
  function lin(ts) { var out = ''; ts.forEach(function (x) { var z = Array.isArray(x[0]) ? x[0][0] === 0 : x[0] === 0; if (!z) out += term(x[0], x[1], out === ''); }); return out || '0'; }
  function P(tex) { return PL.parse(tex); }
  function frT(p, q) { var r = ex.norm(p, q); return ex.texRat(r); }
  function sgn(c) { return c < 0 ? '-' + nf(-c) : '+' + nf(c); }
  function par(x) { return x < 0 ? '(' + nf(x) + ')' : nf(x); }
  var DEG = '\\,^{\\circ}\\text{C}';

  /* ---------------- reading typed answers ---------------- */
  function clean(s) { return String(s == null ? '' : s).replace(/\\left|\\right/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\[,;:! ]|~/g, ' ').replace(/\\cdot/g, '\\times ').trim(); }
  function lhsInfo(L) {
    L = L.replace(/\s+/g, '');
    var m = /^([A-Za-z])\(([^()]*)\)$/.exec(L); if (m) return { kind: 'fn', name: m[1], arg: m[2] };
    if (/^[A-Za-z]$/.test(L)) return { kind: 'var', name: L };
    return { kind: 'other' };
  }
  function lettersOf(s) { var o = {}; String(s).replace(/(\\[a-zA-Z]+)|([a-zA-Z])/g, function (m, cmd, ch) { if (ch) o[ch] = 1; return m; }); return Object.keys(o); }
  function relabel(s, from, to) { return String(s).replace(/(\\[a-zA-Z]+)|(?<![a-zA-Z])([a-zA-Z])(?![a-zA-Z])/g, function (m, cmd, ch) { return cmd ? cmd : ch === from ? to : ch; }); }
  function numVal(s) { var p = ex.parse(String(s).trim()); if (!p.ok) return null; var v = ex.value(p.ast); return isFinite(v) ? v : null; }
  function same(a, b) { return Math.abs(a - b) < 1e-9; }

  /* ---- conversions: mode 'xy' (answer y = …) or 'fn' (answer f(v) = …). o: T (polynomial), v (input letter),
   * name (function name for the key), reqName (the question fixes the name), out (output letter, default y),
   * wrong [{is, code, hint}] ---- */
  function convChk(mode, o) {
    var v = o.v || 'x', out = o.out || 'y';
    var ws = (o.wrong || []).filter(function (w) { return w && !PL.eq(w.is, o.T); });
    var base = K.poly(o.T, { wrong: ws });
    return function (resp) {
      var s = clean(resp);
      if (!s) return form('empty', 'Type the whole equation first.');
      var parts = s.split('=');
      var want = mode === 'xy' ? t(out + '=\\ldots') : t((o.name || 'f') + '(' + v + ')=\\ldots');
      if (parts.length === 1) return form('conv-no-eq', 'Write the whole <b>equation</b>, starting with ' + want + '.');
      if (parts.length > 2 || !parts[0].trim() || !parts[1].trim()) return form('unreadable', 'Write one equation, starting with ' + want + '.');
      var L = parts[0], R = parts[1], li = lhsInfo(L);
      if (li.kind === 'other') { var ri = lhsInfo(R); if (ri.kind !== 'other') { li = ri; R = L; } }
      if (li.kind === 'other') return form('conv-lhs', 'Start your equation with ' + want + '.');
      var rl = lettersOf(R).filter(function (c) { return c !== v; });
      var rr = base(R);
      if (rr.v !== 'correct' && rl.length === 1 && lettersOf(R).indexOf(v) < 0) {
        var alt = base(relabel(R, rl[0], v));
        if (alt.v === 'correct') return wrong('conv-var', 'The input variable never changes when you convert: keep ' + t(v) + ' on the right side (you wrote ' + t(rl[0]) + ').');
      }
      if (mode === 'xy') {
        if (li.kind === 'fn') return wrong('conv-still-fn', t(li.name + '(' + li.arg + ')') + ' is function notation. To write an equation in ' + t('x') + ' and ' + t('y') + ', replace ' + t(li.name + '(' + li.arg + ')') + ' with ' + t(out) + '.');
        if (li.name !== out) return form('conv-out', 'Use ' + t(out) + ' for the output: start with ' + t(out + '=') + '.');
      } else {
        if (li.kind === 'var') return wrong('conv-still-y', t(li.name) + ' is the output variable, so this is still ' + t('x') + '-' + t('y') + ' notation. Replace ' + t(li.name) + ' with function notation: ' + want + '.');
        if (li.name === v) return form('conv-name', 'The function needs a name that isn’t the input letter, e.g. ' + t('f(' + v + ')') + '.');
        if (o.reqName && li.name !== o.name) return wrong('conv-name', 'The question names the function ' + t(o.name) + ', so write ' + t(o.name + '(' + v + ')') + ', not ' + t(li.name + '(' + li.arg + ')') + '.');
        if (!o.reqName && (li.name === 'y' || li.name === out)) return form('conv-name', 'Name the function with a letter such as ' + t('f') + ': ' + t('f(' + v + ')') + '. (' + t(out) + ' is the output it replaces.)');
        if (li.arg !== v) return wrong('conv-arg', 'The brackets hold the <b>input</b> variable, ' + t(v) + ' — it is the letter in the rule. Write ' + t((o.reqName ? o.name : li.name) + '(' + v + ')') + ', not ' + t(li.name + '(' + li.arg + ')') + '.');
      }
      return rr;
    };
  }
  function convPart(mode, prompt, o, sol, hints, text) {
    var v = o.v || 'x', name = o.name || 'f', out = o.out || 'y';
    var lhs = mode === 'xy' ? out : name + '(' + v + ')', key = lhs + '=' + o.keyRhs;
    var vars = [v].concat(mode === 'xy' ? [out] : [name]).concat(o.vars || []).filter(function (c, i, a) { return a.indexOf(c) === i; });
    var p = { prompt: prompt, input: { type: 'math', keys: EQK, vars: vars, placeholder: mode === 'xy' ? 'e.g. y = 2x - 3' : 'e.g. f(x) = 2x - 3' }, check: convChk(mode, o), key: key, answer: t(key),
      solution: sol, hints: hints || [], text: text };
    p.good = [o.keyRhs + '=' + lhs].concat(o.good || []);
    p.bad = (o.wrong || []).filter(function (w) { return !PL.eq(w.is, o.T); }).map(function (w) { return lhs + '=' + PL.tex(w.is); }).concat(o.bad || []);
    return p;
  }

  /* ---- a function-notation statement such as d(2) = 4 ---- */
  function stmtRead(s) {
    s = clean(s).replace(/\s+/g, '');
    if (/^\([^()]*,[^()]*\)$/.test(s)) return { pair: true };
    var parts = s.split('='); if (parts.length !== 2) return null;
    var L = parts[0], R = parts[1], m = /^([A-Za-z])\((.+)\)$/.exec(L);
    if (!m) { m = /^([A-Za-z])\((.+)\)$/.exec(R); if (!m) return null; R = L; }
    var a = numVal(m[2]), b = numVal(R); if (a == null || b == null) return null;
    return { name: m[1], a: a, b: b };
  }
  function stmtChk(name, a, b, o) {
    o = o || {};
    return function (resp) {
      if (!clean(resp)) return form('empty', 'Type the statement first, e.g. ' + t(name + '(2)=5') + '.');
      var r = stmtRead(resp);
      if (r && r.pair) return form('stmt-pair', 'That’s an ordered pair. Write it in <b>function notation</b>: ' + t(name + '(\\text{input})=\\text{output}') + '.');
      if (!r) return form('stmt-unreadable', 'Write a statement in function notation: the function’s name, the input in brackets, then ' + t('=') + ' and the output, e.g. ' + t(name + '(2)=5') + '.');
      if (r.name !== name) return wrong('stmt-name', 'The function is named ' + t(name) + ', so the statement starts with ' + t(name + '(\\ldots)') + '.');
      if (same(r.a, a) && same(r.b, b)) return ok();
      if (same(r.a, b) && same(r.b, a)) return wrong('stmt-swap', 'Input and output are swapped. In ' + t(name + '(a)=b') + ', the input ' + t('a') + ' (the ' + t('x') + '-coordinate) goes in the brackets and the output ' + t('b') + ' comes after the equals sign.');
      var h = o.diag ? o.diag(r) : null; if (h) return wrong(h.code, h.hint);
      return wrong('value', null);
    };
  }
  function stmtPart(prompt, name, a, b, sol, hints, text) {
    var p = B.math(prompt, stmtChk(name, a, b), name + '(' + nf(a) + ')=' + nf(b), sol, hints, text, { keys: EQK, vars: [name], placeholder: 'e.g. ' + name + '(2) = 5' });
    p.good = [nf(b) + '=' + name + '(' + nf(a) + ')'];
    p.bad = ['(' + nf(a) + ',' + nf(b) + ')'].concat(same(a, b) ? [] : [name + '(' + nf(b) + ')=' + nf(a)]);
    return p;
  }
  /* ---- one ordered pair (a, b) ---- */
  function pointChk(a, b) {
    return function (resp) {
      var s = clean(resp).replace(/\\\{|\\\}|[{}]/g, '').replace(/\s+/g, '');
      if (!s) return form('empty', 'Type the ordered pair first, e.g. ' + t('(3,\\ -2)') + '.');
      var m = /^\((.+),(.+)\)$/.exec(s);
      if (!m) { if (stmtRead(s)) return form('pt-stmt', 'That’s function notation. Write the <b>ordered pair</b> ' + t('(\\text{input},\\ \\text{output})') + '.'); return form('pt-unreadable', 'Write one ordered pair in brackets, e.g. ' + t('(3,\\ -2)') + '.'); }
      var x = numVal(m[1]), y = numVal(m[2]);
      if (x == null || y == null) return form('pt-unreadable', 'Write one ordered pair in brackets, e.g. ' + t('(3,\\ -2)') + '.');
      if (same(x, a) && same(y, b)) return ok();
      if (same(x, b) && same(y, a)) return wrong('pairs-flip', 'Your pair is backwards: an ordered pair is (input, output) — the input comes first.');
      return wrong('value', null);
    };
  }
  function pointPart(prompt, a, b, sol, hints, text) {
    var p = B.math(prompt, pointChk(a, b), ptT([a, b]), sol, hints, text, { keys: 'pairs', placeholder: 'e.g. (3, -2)' });
    if (!same(a, b)) p.bad = ['(' + nf(b) + ',' + nf(a) + ')'];
    return p;
  }

  /* ---- "solve" answers: values (may be empty = no solution) ---- */
  function isNone(s) { var x = String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); return /^(\\text\{\s*(none|no solutions?)\s*\}|none|no solutions?|\\emptyset|\\varnothing|∅|\\\{\s*\\\}|\{\s*\})$/i.test(x) || /^(x|[a-z])\s*=\s*(\\text\{\s*none\s*\}|none)$/i.test(x); }
  function solsChk(values, o) {
    o = o || {}; var v = o.v || 'x';
    var base = values.length ? K.valueSet(values, { v: v, diag: function (A, T) {
      if (o.graph && A.length < T.length && A.every(function (x) { return T.some(function (y) { return same(x, y); }); })) return { code: 'sol-graph-missing', hint: 'Correct so far — but keep following the horizontal line at height ' + t(nf(o.b)) + ' across the <b>whole</b> graph and count every point where it meets the graph.' };
      if (o.rev && A.length === 1 && same(A[0], o.rev)) return { code: 'read-reverse', hint: t(nf(o.b)) + ' is an <b>output</b> (a height): start at ' + t(nf(o.b)) + ' on the vertical axis and read <b>across</b> to the graph, then down to the ' + t('x') + '-axis.' };
      return o.diag ? o.diag(A, T) : null;
    } }) : null;
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Type your answer first (or press <b>none</b>).');
      if (isNone(s)) return values.length ? wrong('sol-said-none', o.saidNone || 'There is at least one solution: draw a horizontal line at height ' + t(nf(o.b)) + ' and look for where it meets the graph.') : ok();
      if (!values.length) {
        var vb = K.valueSet([1e9])(s);
        if (vb.v === 'form') return vb;
        return wrong('sol-not-none', o.noneHint || 'Check those values — does the graph ever reach height ' + t(nf(o.b)) + '?');
      }
      return base(s);
    };
  }
  function solsKey(values, v) { return values.length ? values.map(function (x) { return (v || 'x') + '=' + nf(x); }).join(',\\ ') : '\\text{none}'; }
  function solField(label, v) { return { label: label, name: String(label).replace(/:\s*$/, ''), mode: 'math', keys: 'solutions', vars: [v || 'x'], none: true, placeholder: 'e.g. ' + (v || 'x') + ' = 3, ' + (v || 'x') + ' = -5' }; }
  /* one "solve" box (several solutions allowed, or none) */
  function solvePart(prompt, values, o, sol, hints, text) {
    o = o || {}; var v = o.v || 'x';
    var p = BF(prompt, [solField(o.label || 'Solution(s):', v)], [solsChk(values, o)], [values.length ? solsKey(values, v) : 'none'], values.length ? t(solsKey(values, v)) : 'no solution', sol, hints, text);
    p.good = [[values.length ? values.slice().reverse().map(nf).join(', ') : '\\text{none}']];
    if (values.length > 1) p.bad = [[v + '=' + nf(values[0])]];
    return p;
  }

  /* ---------------- piecewise-linear graphs ---------------- */
  function pwAt(V, x) { for (var i = 0; i + 1 < V.length; i++) { var a = V[i], b = V[i + 1]; if (x >= a[0] - 1e-9 && x <= b[0] + 1e-9) return cl(a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])); } return NaN; }
  function pwSols(V, y) {
    var pts = [];
    for (var i = 0; i + 1 < V.length; i++) { var a = V[i], b = V[i + 1]; if ((y - a[1]) * (y - b[1]) <= 1e-12 && !(same(a[1], y) && same(b[1], y))) pts.push(cl(a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]))); }
    return uniq(pts);
  }
  function pwMin(V) { return Math.min.apply(null, V.map(function (p) { return p[1]; })); }
  function pwMax(V) { return Math.max.apply(null, V.map(function (p) { return p[1]; })); }
  function pwGraph(V, o) {
    o = o || {};
    var g = { x: o.x, y: o.y, grid: o.grid || 1, gridY: o.gridY, labels: o.labels || 2, labelsX: o.labelsX, labelsY: o.labelsY, unit: o.unit, unitX: o.unitX, unitY: o.unitY,
      xName: 'x', yName: o.yName || 'y', max: o.max || 320, segs: [{ pts: V, start: o.start || 'closed', end: o.end || 'closed' }], points: o.points || [], aria: o.aria || 'graph of a function' };
    return '<div class="fig">' + HW.graph(g) + '</div>';
  }
  /* a whole line y = m x + b across a ±W window (arrows at both ends) */
  function lineFig(m, b, nm, W) {
    W = W || 6; var lo = -W + 0.3, hi = W - 0.3, xa = lo, xb = hi;
    if (m !== 0) { var x1 = (lo - b) / m, x2 = (hi - b) / m; xa = Math.max(lo, Math.min(x1, x2)); xb = Math.min(hi, Math.max(x1, x2)); }
    return '<div class="fig">' + HW.graph({ x: [-W - 0.5, W + 0.5], y: [-W - 0.5, W + 0.5], grid: 1, labels: 2, xName: 'x', yName: nm + '(x)', max: 280, segs: [{ pts: [[xa, cl(m * xa + b)], [xb, cl(m * xb + b)]], start: 'arrow', end: 'arrow' }], aria: 'graph of the line ' + nm }) + '</div>';
  }

  /* ---------------- set answers ---------------- */
  function cond(v, lo, hi) { return nf(lo) + '\\le ' + v + '\\le ' + nf(hi); }
  function bld(v, lo, hi) { return '\\{' + v + '\\mid ' + cond(v, lo, hi) + ',\\ ' + v + '\\in\\mathbb{R}\\}'; }
  function lst(a) { return '\\{' + uniq(a).map(nf).join(', ') + '\\}'; }
  function toY(resp, fname, dv) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')');
    s = s.replace(/([A-Za-z])\s*\(\s*([A-Za-z])\s*\)/g, function (m, f, a) { return a === dv ? 'y' : m; });
    if (fname && fname !== dv && fname !== 'R') s = relabel(s, fname, 'y');
    return s;
  }
  function rangeChk(Ry, fname, dv, o) {
    o = o || {};
    var T = S.parse(Ry).set;
    var wr = (o.wrong || []).filter(function (w) { var q = S.parse(w.is); return q.ok && !S.eq(q.set, T); });
    var base = K.set(Ry, { v: 'y', other: o.other, otherName: 'domain', wrong: wr, tag: false });
    var fx = fname + '(' + dv + ')';
    return function (resp) {
      var r = base(toY(resp, fname, dv));
      if (r.v === 'form' && r.code === 'set-letter') return form('set-letter', 'Right set — but the range is a set of <b>outputs</b>: write it with ' + t(fx) + ' (or ' + t('y') + '), e.g. ' + t('1\\le ' + fx + '\\le 4') + '.');
      if (r.v === 'wrong' && o.ctx && o.ctx[r.code]) return wrong(r.code, o.ctx[r.code]);
      return r;
    };
  }
  function domChk(D, dv, other, o) {
    o = o || {};
    var T = S.parse(D).set;
    var wr = (o.wrong || []).filter(function (w) { var q = S.parse(w.is); return q.ok && !S.eq(q.set, T); });
    var base = K.set(D, { v: dv, other: other, otherName: 'range', wrong: wr, tag: false });
    return function (resp) { var r = base(resp); if (r.v === 'wrong' && o.ctx && o.ctx[r.code]) return wrong(r.code, o.ctx[r.code]); return r; };
  }
  function ivAlt(tex) {
    var p = S.parse(tex); if (!p.ok || p.set.kind !== 'int' || p.set.parts.length !== 1) return tex;
    var q = p.set.parts[0]; return (q.lc ? '[' : '(') + nf(q.lo) + ', ' + nf(q.hi) + (q.hc ? ']' : ')');
  }
  /* Domain and Range in one part (two boxes). o: dv, fname, D:[lo,hi] or list, R likewise, disc (lists), dW, rW, dC, rC */
  function drPart(prompt, o, sol, hints, text) {
    var dv = o.dv || 'x', fname = o.fname, fx = fname + '(' + dv + ')';
    var Dt = o.disc ? lst(o.D) : bld(dv, o.D[0], o.D[1]), Ry = o.disc ? lst(o.R) : bld('y', o.R[0], o.R[1]);
    var Rshow = o.disc ? lst(o.R) : '\\{' + fx + '\\mid ' + cond(fx, o.R[0], o.R[1]) + ',\\ ' + fx + '\\in\\mathbb{R}\\}';
    var cD = domChk(Dt, dv, Ry, { wrong: o.dW, ctx: o.dC }), cR = rangeChk(Ry, fname, dv, { other: Dt, wrong: o.rW, ctx: o.rC });
    var fl = [{ label: 'Domain', name: 'Domain', mode: 'math', keys: 'set', vars: [dv, fname], placeholder: o.disc ? 'e.g. {0, 1, 2, 3}' : 'e.g. -2 <= ' + dv + ' <= 5' },
      { label: 'Range', name: 'Range', mode: 'math', keys: 'set', vars: [dv, fname], placeholder: o.disc ? 'e.g. {0, 8, 16, 24}' : 'e.g. 1 <= ' + fx + ' <= 4' }];
    // the booklet writes a continuous domain and range as inequalities (D: 0 ≤ t ≤ 80, R: 0 ≤ h(t) ≤ 60); set-builder is still accepted
    var Dk = o.disc ? Dt : cond(dv, o.D[0], o.D[1]), Rk = o.disc ? Rshow : cond(fx, o.R[0], o.R[1]);
    var p = BF(prompt, fl, [cD, cR], [Dk, Rk], o.disc ? t('D=' + Dt) + '<br>' + t('R=' + Rshow) : t('D:\\ ' + Dk) + '<br>' + t('R:\\ ' + Rk), sol, hints, text);
    p.good = o.disc ? [] : [[ivAlt(Dt), ivAlt(Ry)], [Dt, Rshow], [Dt, Ry], [Dt.replace(/,\\ [a-zA-Z]\\in\\mathbb\{R\}/, ''), Ry.replace(/,\\ y\\in\\mathbb\{R\}/, '')]];
    p.bad = [[Ry, Dt]].concat((o.dW || []).map(function (w) { return [w.is, Rshow]; })).concat((o.rW || []).map(function (w) { return [Dt, w.is]; })).filter(function (b) { return !(S.eq(S.parse(b[0]).set, S.parse(Dt).set) && S.eq(S.parse(toY(b[1], fname, dv)).set, S.parse(Ry).set)); });
    return p;
  }
  /* a one-box set part whose key is shown as an inequality (the booklet's form); the set-builder form stays accepted */
  function ineqKey(p, key, good) { p.key = key; p.answer = t(key); p.good = good; if (p.input) p.input.placeholder = 'e.g. 0 <= x <= 5'; return p; }
  function drSol(dv, fname, D, R) { return t('D:\\ ' + cond(dv, D[0], D[1])) + '<br>' + t('R:\\ ' + cond(fname + '(' + dv + ')', R[0], R[1])); }

  /* ---------------- small builders ---------------- */
  function phFix(fl) {
    fl.forEach(function (f) { if (f.mode === 'math' && !f.placeholder) f.placeholder = f.keys === EQK ? 'e.g. f(2) = 5' : f.keys === 'fraction' ? 'e.g. 7 or 10/3' : f.keys === 'solutions' ? 'e.g. 5' : f.keys === 'set' ? 'e.g. 0 <= x <= 5' : ''; });
    return fl;
  }
  function BF(prompt, fl, ch, keys, answer, sol, hints, text) { return B.fields(prompt, phFix(fl), ch, keys, answer, sol, hints, text); }
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  function meaningMC(r, prompt, right, wrongs, sol, hints, text) { return mc(r, prompt, [{ html: right, right: true }].concat(wrongs), sol, hints, text); }
  function fieldsOf(prompt, items, answer, sol, hints, text) {
    return BF(prompt, items.map(function (x) { return x.f; }), items.map(function (x) { return x.c; }), items.map(function (x) { return x.k; }), answer, sol, hints, text);
  }
  /* one value box: label is the left side, e.g. t('q(-3)=') */
  function valItem(label, name, v, diag, after) { return { f: { label: label, name: name, after: after }, k: nf(v), c: K.number(v, diag) }; }
  /* a table of values of a named function: fields name(x) = for each input; diag(x, u) */
  function fnTable(prompt, name, v, xs, f, diag, sol, hints, text) {
    var fields = xs.map(function (x) { return { name: t(name + '(' + nf(x) + ')'), before: t(name + '(' + nf(x) + ')=') }; });
    var checks = xs.map(function (x) { return K.number(cl(f(x)), function (u) { return diag ? diag(x, u) : null; }); });
    var p = B.fields(prompt, fields, checks, xs.map(function (x) { return nf(f(x)); }),
      HW.valueTable([[t(v)].concat(xs.map(function (x) { return t(nf(x)); })), [t(name + '(' + v + ')')].concat(xs.map(function (x) { return t(nf(f(x))); }))]), sol, hints, text);
    return p;
  }
  /* ---------------- sketching a model on its context axes (graph pad) ---------------- */
  function padIn(o) {
    var I = { x: o.x, y: o.y, grid: o.gx || o.sx, gridY: o.gy || o.sy, labelsX: o.lx, labelsY: o.ly, unitX: 290 / (o.x[1] - o.x[0]), unitY: (o.h || 240) / (o.y[1] - o.y[0]),
      firstQuadrant: o.fq !== false, xName: o.v, yName: o.w, xTitle: o.xTitle, yTitle: o.yTitle, snapX: o.sx, snapY: o.sy, max: 340 };
    Object.keys(o.extra || {}).forEach(function (k) { I[k] = o.extra[k]; });
    return I;
  }
  function snapTo(x, s) { return cl(Math.round(cl(x / s)) * s); }
  /* a linear model drawn as ONE segment over [X0, X1] with solid ends. o: f, X0, X1, sx, sy, name, v, hint texts:
   * start0 (started at 0 instead of the starting value), startX, endX, arrow, dir */
  function segSketch(o) {
    var tx = o.sx / 2 + 1e-6, ty = o.sy / 2 + 1e-6, Y0 = o.f(o.X0), Y1 = o.f(o.X1), nm = o.name, v = o.v, fm = o.fmt || nf, pT = function (P0) { return '(' + fm(P0[0]) + ',\\ ' + fm(P0[1]) + ')'; };
    var A = [snapTo(o.X0, o.sx), snapTo(Y0, o.sy)], Bp = [snapTo(o.X1, o.sx), snapTo(Y1, o.sy)];
    var key = { pts: [], pieces: [{ v: [A, Bp], s: 'closed', e: 'closed' }], join: 'none' };
    var check = function (resp) {
      if (HW.draw.empty(resp)) return form('empty', 'Draw your graph first: choose <b>╱ Line</b>, tap the start point, then the end point (tap it again to finish).');
      var g = HW.draw.geom(resp), ks = Object.keys(g.lines);
      if (!ks.length) return wrong('sk-points', 'Good start — now draw the graph itself: every value in between makes sense too, so connect the start to the end with <b>╱ Line</b>.');
      if (ks.length > 1) return wrong('sk-straight', 'This model is linear, so its graph is <b>one straight segment</b>. Use <b>╱ Line</b> and tap only the two end points.');
      var L = g.lines[ks[0]];
      if (L.B === 0) return wrong('sk-vertical', 'A vertical line would give many outputs for one input. Draw the segment from the start of the domain to its end.');
      if (L.iv.length > 1) return wrong('sk-gap', 'Your graph has a gap. The model works for every value of ' + t(v) + ' in its domain — draw one unbroken segment.');
      if (g.pts.length) return wrong('sk-extra', 'The point ' + t(ptT(g.pts[0])) + ' is not on your segment. A sketch of a linear model is just the segment — remove separate points.');
      var iv = L.iv[0];
      if (!isFinite(iv.lo) || !isFinite(iv.hi)) return wrong('sk-arrow', o.arrow || 'The model has a start and an end: finish the segment with solid dots, not arrows.');
      var f = function (x) { return (L.C - L.A * x) / L.B; }, yl = f(iv.lo), yh = f(iv.hi);
      if ((yh - yl) * (Y1 - Y0) <= 0) return wrong('sk-dir', o.dir || ('Check the direction: ' + t(nm + '(' + fm(o.X0) + ')=' + fm(Y0)) + ' and ' + t(nm + '(' + fm(o.X1) + ')=' + fm(Y1)) + '.'));
      if (Math.abs(iv.lo - o.X0) > tx) return wrong('sk-startx', o.startX || ('Check where the graph starts: the domain begins at ' + t(v + '=' + nf(o.X0)) + '.'));
      if (Math.abs(iv.hi - o.X1) > tx) return wrong('sk-endx', o.endX || ('Check where the graph ends: the domain stops at ' + t(v + '=' + nf(o.X1)) + '.'));
      if (Math.abs(yl - Y0) > ty) {
        if (o.start0 && Math.abs(yl) < ty) return wrong('no-fixed', o.start0);
        return wrong('sk-starty', 'Check the start: ' + t(nm + '(' + fm(o.X0) + ')=' + fm(Y0)) + ', so the segment starts at ' + t(pT([o.X0, Y0])) + '.');
      }
      if (Math.abs(yh - Y1) > ty) return wrong('sk-endy', 'Check the end: ' + t(nm + '(' + fm(o.X1) + ')=' + fm(Y1)) + ', so the segment ends at ' + t(pT([o.X1, Y1])) + '.');
      if (!iv.lc || !iv.hc) return wrong('graph-ends', 'Both end values belong to the model: use <b>solid</b> dots at both ends (●○ Ends).');
      return ok();
    };
    return { check: check, key: key, A: A, B: Bp };
  }
  function seg(a, b, s, e) { return { v: [a, b], s: s || 'closed', e: e || 'closed' }; }
  function drawing(pieces, pts, join) { return { pieces: pieces || [], pts: pts || [], join: join || 'none' }; }
  var LINE_HELP = ' Use <b>╱ Line</b>: tap the start, then the end (tap it again to finish). The label in the corner of the grid shows exactly where you are tapping.';

  /* "which company is cheaper" with a reason (exactly one option right) */
  function cheaperMC(r, prompt, nA, nB, k, fA, fB, rA, fixA, sol, hints, text) {
    var a = fA(k), b = fB(k), Acheap = a < b, cmp = t(nA + '(' + k + ')=\\$' + money(a)) + ' and ' + t(nB + '(' + k + ')=\\$' + money(b));
    return mc(r, prompt, [
      { html: 'Company ' + nA + ': ' + cmp + ', so ' + nA + ' costs less.', right: Acheap, why: Acheap ? null : 'Compare the two numbers again: ' + t(money(b)) + ' is less than ' + t(money(a)) + '.', code: 'pickA' },
      { html: 'Company ' + nB + ': ' + cmp + ', so ' + nB + ' costs less.', right: !Acheap, why: !Acheap ? null : 'Compare the two numbers again: ' + t(money(a)) + ' is less than ' + t(money(b)) + '.', code: 'pickB' },
      { html: 'Company ' + nA + ', because its rate per kilometre is lower, so it is always cheaper.', why: 'Not always: ' + nA + ' also has a starting fee of ' + t('\\$' + money(fixA)) + ', so for short trips ' + nB + ' is cheaper. Justify with the two costs for <b>this</b> trip.', code: 'always' },
      { html: 'Company ' + nB + ', because it has no starting fee, so it is always cheaper.', why: 'Not always: ' + nB + ' charges more per kilometre, so on long trips it costs more. Justify with the two costs for <b>this</b> trip.', code: 'nofee' }],
      sol, hints, text);
  }


  /* ---------- small helpers ---------- */
  var C1 = '#2b55a0', C2 = '#b0562b', C3 = '#6a4fb0', INK = '#2b3340';
  function dn(x) { var v = Math.round(x * 1000) / 1000; return v < 0 ? '-' + Math.abs(v) : String(v); }
  function near(a, b) { return Math.abs(a - b) < 1e-6; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function units(s) { return '\\text{ ' + s + '}'; }
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


  /* ================= Unit 5 review: generators ================= */
  var QN = ['I', 'II', 'III', 'IV'];
  function hShared(r) { var a = pick(r, [3, 3, 2, 4, 5]), b = pick(r, [11, 11, 7, 9, 13, 15]), k = pick(r, [2, 2, 1, 3, 4]); var m = pick(r, [3, 3, 1, 2, 4, 5].filter(function (x) { return x !== k; })); var nm = pick(r, ['h', 'h', 'f', 'g', 'p']); return { a: a, b: b, k: k, m: m, nm: nm, h: function (x) { return -a * x + b; } }; }
  function quad(p) { return p[0] === 0 || p[1] === 0 ? 'axis' : p[0] > 0 ? (p[1] > 0 ? 'I' : 'IV') : (p[1] > 0 ? 'II' : 'III'); }
  function ptIn(r, q) { var a = r.int(1, 9), b = r.int(1, 9); return [q === 'I' || q === 'IV' ? a : -a, q === 'I' || q === 'II' ? b : -b]; }
  var QCOLS = [{ id: 'I', html: 'I' }, { id: 'II', html: 'II' }, { id: 'III', html: 'III' }, { id: 'IV', html: 'IV' }, { id: 'axis', html: 'Axis' }];
  var QWHY = function (row, got) { return { code: 'row', hint: got === 'axis' ? 'A point is on an axis only when one coordinate is ' + t('0') + '.' : 'Check the signs: Quadrant I is ' + t('(+,+)') + ', II is ' + t('(-,+)') + ', III is ' + t('(-,-)') + ', IV is ' + t('(+,-)') + '. A point with a ' + t('0') + ' coordinate is on an axis.' }; };
  /* a domain/range part where the range is written with y (no function name) */
  function drY(prompt, D, R, sol, hints, text, o) {
    o = o || {};
    var Dt = o.disc ? lst(D) : bld('x', D[0], D[1]), Rt = o.disc ? lst(R) : bld('y', R[0], R[1]);
    var fl = [{ label: 'Domain', name: 'Domain', mode: 'math', keys: 'set', vars: ['x', 'y'], placeholder: o.disc ? 'e.g. {1, 3, 5}' : 'e.g. {x | -2 <= x <= 5, x in R}' }, { label: 'Range', name: 'Range', mode: 'math', keys: 'set', vars: ['x', 'y'], placeholder: o.disc ? 'e.g. {2, 4}' : 'e.g. {y | 1 <= y <= 4, y in R}' }];
    var p = BF(prompt, fl, [K.set(Dt, { v: 'x', other: Rt, otherName: 'range', wrong: o.dW }), K.set(Rt, { v: 'y', other: Dt, otherName: 'domain', wrong: o.rW })], [Dt, Rt], t('D=' + Dt) + '<br>' + t('R=' + Rt), sol, hints, text);
    p.bad = [[Rt, Dt]];
    if (!o.disc) p.good = [[cond('x', D[0], D[1]), cond('y', R[0], R[1])], [ivAlt(Dt), ivAlt(Rt)]];
    return p;
  }
  function gridPart(prompt, rows, cols, want, why, sol, hints, text) { return B.grid(prompt, rows, cols, want, { why: why }, sol, hints, text); }
  var TF = [{ id: 'T', html: 'True' }, { id: 'F', html: 'False' }];
  function pts(list) { return { pts: list, pieces: [], join: 'none' }; }
  function ptsFig(P0, o) { o = o || {}; return '<div class="fig">' + HW.graph({ x: o.x || [-6, 6], y: o.y || [-6, 6], grid: 1, labels: 2, xName: 'x', yName: o.yn || 'y', max: o.max || 280, points: P0.map(function (q) { return { x: q[0], y: q[1] }; }), aria: 'points' }) + '</div>'; }
  function segFig(V, o) { o = o || {}; return pwGraph(V, { x: o.x || [-7, 7], y: o.y || [-7, 7], labels: 2, yName: o.yn || 'y', max: o.max || 300, start: o.start, end: o.end, aria: o.aria || 'graph' }); }
  function meaning(r, prompt, right, wrongs, sol, hints, text) { return meaningMC(r, prompt, right, wrongs, sol, hints, text); }

  /* the part header already shows the booklet letter (sub, or a/b/c by position): drop the letter the prompt repeats */
  function subLabels(def) {
    (def.questions || []).concat(def.extra || []).forEach(function (q) { if (q.parts.length < 2) return; q.parts.forEach(function (p) {
      var mk = p.make;
      p.make = function (r, sh) { var o = mk(r, sh); if (typeof o.prompt === 'string') o.prompt = o.prompt.replace(/^\([a-z](?: i{1,2})?\)\s*/, ''); return o; };
    }); });
    return def;
  }

  HW.defineLesson(subLabels({
    id: 'u5l12', unit: 5, num: '12', title: 'Unit Review: Relations and Functions', outcome: '',
    blurb: 'Review of the whole unit: the Cartesian plane, patterns and representations, intercepts, domain and range, functions and function notation, models and real-world graphs.',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A — The Cartesian plane', stem: 'State the quadrant containing each point.', parts: [
        { id: '1', level: 'BEG', outcome: 'RF2', make: function (r) {
          var qs = r.shuffle(QN).slice(0, 3), P0 = qs.map(function (q) { return ptIn(r, q); }), k = r.int(1, 9) * (r.chance(0.5) ? -1 : 1), ax = r.chance(0.6) ? [0, k] : [k, 0];
          P0.push(ax); var lab = ['(a)', '(b)', '(c)', '(d)'], want = {};
          var rows = P0.map(function (p, i) { want['p' + i] = quad(p); return { id: 'p' + i, html: lab[i] + ' ' + t(ptT(p)) }; });
          return gridPart('Choose the quadrant (I, II, III or IV), or “Axis” if the point lies on an axis, for each of the points ' + P0.map(function (p) { return t(ptT(p)); }).join(', ') + '.', rows, QCOLS, want, QWHY,
            P0.map(function (p, i) { var q = quad(p); return lab[i] + ' ' + t(ptT(p)) + ': ' + (q === 'axis' ? (p[0] === 0 ? t('x=0') + ', so it is on the ' + t('y') + '-axis' : t('y=0') + ', so it is on the ' + t('x') + '-axis') + ' — not in any quadrant' : t('(' + (p[0] > 0 ? '+' : '-') + ',' + (p[1] > 0 ? '+' : '-') + ')\\Rightarrow') + ' Quadrant ' + q); }).join('<br>'),
            ['Look at the signs of the two coordinates.', 'Quadrants are numbered counter-clockwise starting at the top right.'], 'quadrants');
        } }] },
      { num: '2', stem: '', parts: [
        { id: '2', level: 'BEG', outcome: 'RF2', make: function (r) {
          var a = r.int(1, 9) * (r.chance(0.5) ? 1 : -1), b = r.int(1, 9) * (r.chance(0.5) ? 1 : -1), X = [a, 0], Y = [0, b], first = r.chance(0.5);
          var P0 = first ? [X, Y] : [Y, X], want = {};
          var rows = P0.map(function (p, i) { want['p' + i] = p[1] === 0 ? 'x' : 'y'; return { id: 'p' + i, html: t(ptT(p)) }; });
          return gridPart('Which axis contains each of the points ' + P0.map(function (p) { return t(ptT(p)); }).join(' and ') + '?', rows, [{ id: 'x', html: t('x') + '-axis' }, { id: 'y', html: t('y') + '-axis' }], want, function () { return { code: 'row', hint: 'A point with ' + t('y=0') + ' is on the ' + t('x') + '-axis; a point with ' + t('x=0') + ' is on the ' + t('y') + '-axis.' }; },
            t(ptT(X)) + ' has ' + t('y=0') + ', so it lies on the ' + t('x') + '-axis. ' + t(ptT(Y)) + ' has ' + t('x=0') + ', so it lies on the ' + t('y') + '-axis.', ['Which coordinate is ' + t('0') + '?'], 'which axis');
        } }] },
      { num: '3', shared: function (r) { var P0 = QN.map(function (q) { var p; do { p = ptIn(r, q); } while (Math.abs(p[0]) > 6 || Math.abs(p[1]) > 7); return p; }); var ord = r.shuffle([0, 1, 2, 3]); return { P: ord.map(function (i) { return P0[i]; }) }; },
        stem: function (s) { return 'Plot the points ' + s.P.map(function (p, i) { return t('ABCD'.charAt(i) + ptT(p)); }).join(', ') + ', and state which quadrant each point lies in.'; }, parts: [
        { id: '3a', level: 'BEG', outcome: 'RF2', make: function (r, s) {
          var inp = { x: [-7, 7], y: [-8, 8], grid: 1, labels: 2, xName: 'x', yName: 'y', mode: 'points', max: 300 };
          var p = B.graph('(a) Plot the four points on the grid.', inp, K.graphExact(pts(s.P)), pts(s.P), 'Across first (' + t('x') + '), then up or down (' + t('y') + '): ' + s.P.map(function (q, i) { return t('ABCD'.charAt(i) + ptT(q)); }).join(', ') + '.', ['Start at the origin: move across to the ' + t('x') + '-value, then up or down to the ' + t('y') + '-value.'], 'plot four points');
          p.bad = [pts(s.P.map(function (q) { return [q[1], q[0]]; })), pts(s.P.slice(0, 3))];
          return p;
        } },
        { id: '3b', level: 'LIM', outcome: 'RF2', make: function (r, s) {
          var want = {}, rows = s.P.map(function (p, i) { want['p' + i] = quad(p); return { id: 'p' + i, html: t('ABCD'.charAt(i) + ptT(p)) }; });
          return gridPart('(b) State the quadrant of each point.', rows, QCOLS.slice(0, 4), want, QWHY, s.P.map(function (p, i) { return t('ABCD'.charAt(i)) + ': Quadrant ' + quad(p); }).join(', '), ['Use the signs of the coordinates.'], 'quadrants of plotted points');
        } }] },
      /* ---------------- Part B ---------------- */
      { num: '4', section: 'Part B — Patterns and representing relations', shared: function (r) {
          var c = pick(r, [['A stack of firewood grows as logs are added. Level', 'logs', 'Level', 'Logs', 'L'], ['A stack of firewood grows as logs are added. Level', 'logs', 'Level', 'Logs', 'L'], ['A display of cans is built in rows. Row', 'cans', 'Row', 'Cans', 'C'], ['A pattern of chairs is set up in rows. Row', 'chairs', 'Row', 'Chairs', 'C'], ['A tower is built from blocks, layer by layer. Layer', 'blocks', 'Layer', 'Blocks', 'B']]);
          return { c: c, a: pick(r, [3, 3, 2, 4, 5, 6]), d: pick(r, [4, 4, 3, 5, 2, 6]) };
        }, stem: function (s) { return s.c[0] + ' ' + t('1') + ' has ' + t(s.a) + ' ' + s.c[1] + ', and each additional ' + s.c[2].toLowerCase() + ' has ' + t(s.d) + ' more ' + s.c[1] + ' than the one before it.'; }, parts: [
        { id: '4', level: 'BEG', outcome: 'RF4', make: function (r, s) {
          var f = function (n) { return s.a + s.d * (n - 1); }, ns = [2, 3, 4];
          var p = B.fields('Complete the table for ' + s.c[2] + 's ' + t('1') + ' to ' + t('4') + '. (The last entry is the number of ' + s.c[1] + ' in ' + s.c[2] + ' ' + t('4') + '.)' + HW.valueTable([['<b>' + s.c[2] + '</b>, ' + t('n'), 1, 2, 3, 4], ['<b>' + s.c[3] + '</b>, ' + t(s.c[4]), s.a, '?', '?', '?']]),
            ns.map(function (n) { return { name: s.c[2] + ' ' + n, label: s.c[2] + ' ' + n + ':', after: s.c[1] }; }), ns.map(function (n) { return K.number(f(n), function (u) { return same(u, s.a * n) ? { code: 'value', hint: 'Start from ' + t(s.a) + ' and <b>add</b> ' + t(s.d) + ' for each new ' + s.c[2].toLowerCase() + '.' } : same(u, s.d * n) ? { code: 'value', hint: s.c[2] + ' ' + t('1') + ' has ' + t(s.a) + ' ' + s.c[1] + '; add ' + t(s.d) + ' each time.' } : null; }); }),
            ns.map(function (n) { return String(f(n)); }), [1, 2, 3, 4].map(function (n) { return t(f(n)); }).join(', '),
            'Add ' + t(s.d) + ' each ' + s.c[2].toLowerCase() + ': ' + [1, 2, 3, 4].map(function (n) { return t(f(n)); }).join(', ') + '. ' + s.c[2] + ' ' + t('4') + ' has ' + t(f(4)) + ' ' + s.c[1] + '. (Rule: ' + t(s.c[4] + '=' + lin([[s.d, 'n'], [s.a - s.d, '']])) + '.)', ['Each new ' + s.c[2].toLowerCase() + ' adds ' + t(s.d) + '.'], 'pattern table');
          return p;
        } }] },
      { num: '5', shared: function (r) { var c = pick(r, [['level number', 'number of logs', 'firewood stack', 'Level number', 'Number of logs'], ['row number', 'number of cans', 'can display', 'Row number', 'Number of cans'], ['row number', 'number of chairs', 'chair pattern', 'Row number', 'Number of chairs'], ['layer number', 'number of blocks', 'block tower', 'Layer number', 'Number of blocks'], ['figure number', 'number of tiles', 'tile pattern', 'Figure number', 'Number of tiles']]).slice(); c.n = r.int(4, 9); c.v = c.n * r.int(2, 5) + r.int(0, 3); return c; },
        stem: function (s) { return 'For a ' + s[2] + ' like the one in Question 4, the ' + s[1] + ' depends on the ' + s[0] + ' (for example, ' + s[0].replace(' number', '') + ' ' + t(s.n) + ' has ' + t(s.v) + ' ' + s[1].replace('number of ', '') + ').'; }, parts: [
        { id: '5', level: 'BEG', outcome: 'RF1', make: function (r, s) {
          var rows = r.shuffle([{ id: 'i', html: s[3] }, { id: 'd', html: s[4] }]);
          return gridPart('Identify the independent variable and the dependent variable.', rows, [{ id: 'ind', html: 'Independent' }, { id: 'dep', html: 'Dependent' }], { i: 'ind', d: 'dep' }, function () { return { code: 'row', hint: 'The independent variable is the one you choose; the dependent variable depends on it.' }; },
            '<b>Independent:</b> the ' + s[0] + ' — you pick which one to count. <b>Dependent:</b> the ' + s[1] + ' — it depends on which one you picked. (The independent variable goes on the horizontal axis.)', ['Which quantity do you choose, and which one depends on it?'], 'independent and dependent');
        } }] },
      { num: '6', shared: function (r) { var k = pick(r, [4, 4, 3, 5, 6, 7]), x0 = pick(r, [1, 1, 2, 0]), c = pick(r, [0, 0, 1, -1]); return { k: k, xs: [x0, x0 + 1, x0 + 2, x0 + 3], f: function (x) { return k * x + c; } }; },
        stem: function (s) { return 'The relation is given by the ordered pairs ' + s.xs.map(function (x) { return t(ptT([x, s.f(x)])); }).join(', ') + '.'; }, parts: [
        { id: '6', level: 'BEG', outcome: 'RF2', make: function (r, s) {
          var fl = []; s.xs.forEach(function (x, i) { fl.push({ name: 'x, column ' + (i + 1), label: 'Column ' + (i + 1) + ': ' + t('x=') }, { name: 'y, column ' + (i + 1), label: t('y=') }); });
          var chk = function (resp) {
            resp = resp || []; if (resp.some(function (v) { return !String(v || '').trim(); })) return form('incomplete', 'Fill in every box: an ' + t('x') + ' and its ' + t('y') + ' in each column.');
            var P0 = []; for (var i = 0; i < 4; i++) { var x = numVal(resp[2 * i]), y = numVal(resp[2 * i + 1]); if (x == null || y == null) return form('unreadable', 'Use numbers only.'); P0.push([x, y]); }
            var T0 = s.xs.map(function (x) { return [x, s.f(x)]; }), has = function (L0, q) { return L0.some(function (z) { return same(z[0], q[0]) && same(z[1], q[1]); }); };
            if (P0.every(function (q) { return has(T0, [q[1], q[0]]); })) return wrong('pairs-flip', 'The rows are swapped: the first coordinate of each pair goes in the ' + t('x') + ' row, the second in the ' + t('y') + ' row.');
            var bad = P0.filter(function (q) { return !has(T0, q); });
            if (bad.length) return wrong('pairs', 'Column with ' + t(ptT(bad[0])) + ' is not one of the given pairs.');
            if (T0.some(function (q) { return !has(P0, q); })) return form('duplicate', 'Use each ordered pair once.');
            return ok();
          };
          var key = []; s.xs.forEach(function (x) { key.push(String(x), String(s.f(x))); });
          var p = { prompt: 'Represent this relation in a table of values: one ordered pair per column, ' + t('x') + ' on top and ' + t('y') + ' underneath.', input: { type: 'fields', fields: fl }, check: chk, key: key,
            answer: HW.valueTable([[t('x')].concat(s.xs), [t('y')].concat(s.xs.map(s.f))]), solution: 'First coordinates on the top row, second coordinates underneath:' + HW.valueTable([[t('x')].concat(s.xs), [t('y')].concat(s.xs.map(s.f))]), hints: ['Each pair ' + t('(x,\\ y)') + ' becomes one column.'], text: 'pairs to table' };
          p.bad = [s.xs.reduce(function (a, x) { return a.concat([String(s.f(x)), String(x)]); }, [])];
          return p;
        } }] },
      { num: '7', shared: function (r) { var st = pick(r, [5, 5, 2, 3, 4, 10]), a = pick(r, [5, 5, 4, 6, 3]), ins = [st, st + a, st + 2 * a], o0 = pick(r, [1, 1, 2, 3, 0]), outs = r.chance(0.7) ? [o0, o0 + 1, o0 + 2] : [o0 + 2, o0 + 1, o0]; return { ins: ins, outs: outs, P: ins.map(function (x, i) { return [x, outs[i]]; }) }; },
        stem: function (s) { return 'A mapping diagram shows the inputs ' + t(lst(s.ins)) + ' mapped to the outputs ' + t(lst(s.outs)) + '.<div class="fig">' + HW.arrowDiagram(s.ins.map(String), s.outs.slice().sort(function (a, b) { return a - b; }).map(String), s.P.map(function (q) { return [String(q[0]), String(q[1])]; }), { leftTitle: 'Input', rightTitle: 'Output' }) + '</div>'; }, parts: [
        { id: '7', level: 'BEG', outcome: 'RF2', make: function (r, s) {
          return B.pairs('Write this relation as a set of ordered pairs.', s.P, {}, 'Input first, output second: ' + s.P.map(function (q) { return t(ptT(q)); }).join(', ') + '.', ['Follow each arrow: (input, output).'], 'mapping to pairs');
        } }] },
      /* ---------------- Part C ---------------- */
      { num: '8', section: 'Part C — Intercepts, domain and range', shared: function (r) { var m = pick(r, [-1, -1, -2, 1, 2, -3, 3]), xi = pick(r, [3, 3, 2, 1, 4]); if (Math.abs(m) === 3 && xi > 2) xi = r.int(1, 2); var b = -m * xi, x0 = pick(r, [0, 0, -1, -2]); return { m: m, b: b, xi: xi, f: function (x) { return m * x + b; }, xs: [0, 1, 2, 3, 4, 5, 6].map(function (i) { return x0 + i; }).filter(function (x) { return x <= 4; }) }; },
        stem: function (s) { return 'A relation is given by the table below.' + HW.valueTable([[t('x')].concat(s.xs), [t('y')].concat(s.xs.map(s.f))]); }, parts: [
        { id: '8', level: 'BEG', outcome: 'RF5', make: function (r, s) {
          var fl = [{ label: t('y') + '-intercept:', name: 'y-intercept', mode: 'math', keys: 'pairs', placeholder: 'e.g. (0, 5)' }, { label: t('x') + '-intercept:', name: 'x-intercept', mode: 'math', keys: 'pairs', placeholder: 'e.g. (5, 0)' }];
          var yi = [0, s.b], xi = [s.xi, 0];
          var swapChk = function (want, other, nm) { var base = pointChk(want[0], want[1]); return function (resp) { var rr = base(resp); if (rr.v === 'wrong') { var o = pointChk(other[0], other[1])(resp); if (o.v === 'correct') return wrong('xint-yint', 'That is the ' + nm + '-intercept. Check which coordinate is ' + t('0') + '.'); } return rr; }; };
          return BF('State the ' + t('y') + '-intercept and the ' + t('x') + '-intercept as ordered pairs.', fl, [swapChk(yi, xi, 'x'), swapChk(xi, yi, 'y')], [ptT(yi), ptT(xi)], t(ptT(yi)) + ', ' + t(ptT(xi)),
            t('x=0') + ' pairs with ' + t('y=' + s.b) + ', so the ' + t('y') + '-intercept is ' + t(ptT(yi)) + '.<br>' + t('y=0') + ' pairs with ' + t('x=' + s.xi) + ', so the ' + t('x') + '-intercept is ' + t(ptT(xi)) + '.', ['The ' + t('y') + '-intercept has ' + t('x=0') + '; the ' + t('x') + '-intercept has ' + t('y=0') + '.'], 'intercepts from table');
        } }] },
      { num: '9', shared: function (r) { var a = [r.int(-6, -2), r.int(-7, -1)], b = [r.int(1, 5), r.int(1, 7)]; if (r.chance(0.5)) { var y = a[1]; a[1] = b[1]; b[1] = y; } return { A: a, B: b }; },
        stem: function (s) { return 'The graph of a relation is a line segment with endpoints ' + t(ptT(s.A)) + ' and ' + t(ptT(s.B)) + '.'; }, parts: [
        { id: '9', level: 'BEG', outcome: 'RF2', make: function (r, s) {
          var D = [s.A[0], s.B[0]], R = [Math.min(s.A[1], s.B[1]), Math.max(s.A[1], s.B[1])];
          return drY('State the domain and range.', D, R, 'A segment is continuous, so give the span between the endpoints. ' + t('x') + ' runs from ' + t(D[0]) + ' to ' + t(D[1]) + '; ' + t('y') + ' runs from ' + t(R[0]) + ' to ' + t(R[1]) + ':<br>' + t(cond('x', D[0], D[1])) + '<br>' + t(cond('y', R[0], R[1])),
            ['Domain: the ' + t('x') + '-values from one end to the other. Range: the ' + t('y') + '-values.', 'Smaller number first.'], 'D/R of segment', { dW: [{ is: lst(D), code: 'set-discrete', hint: 'The segment includes every point between its ends, not just the two endpoints.' }] });
        } }] },
      { num: '10', shared: function (r) { var x0 = pick(r, [2, 2, 1, 3, -2]), st = pick(r, [2, 2, 3]), hi = r.int(5, 9), lo = r.int(-3, 3); var xs = [0, 1, 2, 3].map(function (i) { return x0 + st * i; }), ys = r.chance(0.5) ? [hi, hi, lo, lo] : [lo, hi, lo, hi]; return { P: xs.map(function (x, i) { return [x, ys[i]]; }) }; },
        stem: function (s) { return 'Consider the relation ' + s.P.map(function (q) { return t(ptT(q)); }).join(', ') + '.'; }, parts: [
        { id: '10', level: 'EMG', outcome: 'RF2', make: function (r, s) {
          var D = s.P.map(function (q) { return q[0]; }), R = s.P.map(function (q) { return q[1]; });
          var p = drY('State the domain and range, using set notation.', D, R, t('x') + '-values: ' + D.join(', ') + ' (all different). ' + t('y') + '-values: ' + R.join(', ') + ' — only two different outputs.<br>' + t('D=' + lst(D)) + '<br>' + t('R=' + lst(R)) + ' (each value listed once)',
            ['List the first coordinates for the domain and the second coordinates for the range.', 'List a repeated value only once.'], 'D/R of list', { disc: true });
          return p;
        } }] },
      { num: '11', shared: function (r) { var c = r.int(-6, 9), x0 = pick(r, [-5, -5, -4, -2]), st = pick(r, [5, 5, 4, 2, 3]); return { c: c, P: [0, 1, 2, 3].map(function (i) { return [x0 + st * i, c]; }) }; },
        stem: function (s) { return 'Consider the relation ' + s.P.map(function (q) { return t(ptT(q)); }).join(', ') + '.'; }, parts: [
        { id: '11', level: 'BEG', outcome: 'RF2', make: function (r, s) {
          var p = B.set('State the range of the relation.', lst([s.c]), { v: 'y', other: lst(s.P.map(function (q) { return q[0]; })), wrong: [] }, 'Every output is ' + t(s.c) + ', and a set lists it once: ' + t('R=\\{' + s.c + '\\}') + '. (This is part of the horizontal line ' + t('y=' + s.c) + ' — still a function.)', ['The range is the set of second coordinates, each listed once.'], 'range of constant relation');
          p.input.placeholder = 'e.g. {4}'; p.bad = ['\\{' + s.c + ', ' + (s.c + 1) + '\\}'];
          return p;
        } }] },
      /* ---------------- Part D ---------------- */
      { num: '12', section: 'Part D — Technology, functions and function notation', shared: function (r) { var a = pick(r, [6, 6, 4, 5, 3, 8]), xi = pick(r, [3, 3, 4, 5, 2]), b = a * xi; if (b <= 10) { xi += 2; b = a * xi; } var nm = pick(r, ['Priya', 'Priya', 'Owen', 'Lena', 'Kofi']); return { a: a, b: b, xi: xi, nm: nm }; },
        stem: function (s) { return s.nm + ' graphs ' + t('y=' + s.a + 'x-' + s.b) + ' on a graphing calculator, using the standard window ' + t('x:[-10,\\ 10]') + ', ' + t('y:[-10,\\ 10]') + '.'; }, parts: [
        { id: '12a', level: 'EMG', outcome: 'RF5', make: function (r, s) {
          var fl = [{ label: t('x') + '-intercept:', name: 'x-intercept', mode: 'math', keys: 'pairs', placeholder: 'e.g. (5, 0)' }, { label: t('y') + '-intercept:', name: 'y-intercept', mode: 'math', keys: 'pairs', placeholder: 'e.g. (0, 5)' }];
          var xc = pointChk(s.xi, 0), yc = pointChk(0, -s.b);
          var xchk = function (resp) { var rr = xc(resp); if (rr.v === 'wrong' && pointChk(-s.xi, 0)(resp).v === 'correct') return wrong('sign', 'Check the sign: ' + t(s.a + 'x-' + s.b + '=0') + ' gives ' + t(s.a + 'x=' + s.b) + '.'); if (rr.v === 'wrong' && pointChk(0, -s.b)(resp).v === 'correct') return wrong('xint-yint', 'That is the ' + t('y') + '-intercept. For the ' + t('x') + '-intercept set ' + t('y=0') + '.'); return rr; };
          var ychk = function (resp) { var rr = yc(resp); if (rr.v === 'wrong' && pointChk(0, s.b)(resp).v === 'correct') return wrong('sign', 'Check the sign: ' + t('y=' + s.a + '(0)-' + s.b + '=-' + s.b) + '.'); return rr; };
          return BF('(a) Algebraically determine the ' + t('x') + '-intercept and the ' + t('y') + '-intercept.', fl, [xchk, ychk], [ptT([s.xi, 0]), ptT([0, -s.b])], t(ptT([s.xi, 0])) + ', ' + t(ptT([0, -s.b])),
            t('x') + '-intercept (set ' + t('y=0') + '): ' + t('0=' + s.a + 'x-' + s.b + '\\Rightarrow ' + s.a + 'x=' + s.b + '\\Rightarrow x=' + s.xi) + ', i.e. ' + t(ptT([s.xi, 0])) + '.<br>' + t('y') + '-intercept (set ' + t('x=0') + '): ' + t('y=' + s.a + '(0)-' + s.b + '=-' + s.b) + ', i.e. ' + t(ptT([0, -s.b])) + '.',
            ['Set ' + t('y=0') + ' for the ' + t('x') + '-intercept, and ' + t('x=0') + ' for the ' + t('y') + '-intercept.'], 'intercepts algebraically');
        } },
        { id: '12b', level: 'PRG', outcome: 'RF5', make: function (r, s) {
          return mc(r, '(b) Does the standard window show both intercepts clearly?', [
            { html: 'No: ' + t(ptT([s.xi, 0])) + ' fits, but ' + t('-' + s.b) + ' is below Ymin ' + t('=-10') + ', so the ' + t('y') + '-intercept is off the bottom of the screen. Widen the window, e.g. ' + t('y:[-' + (Math.ceil((s.b + 5) / 5) * 5) + ',\\ 10]') + '.', right: true },
            { html: 'Yes: both intercepts are close to the origin.', why: 'Compare ' + t('-' + s.b) + ' with Ymin ' + t('=-10') + '.' },
            { html: 'No: the ' + t('x') + '-intercept ' + t(s.xi) + ' is off the screen.', why: t(s.xi) + ' is between ' + t('-10') + ' and ' + t('10') + ', so it shows. Check the ' + t('y') + '-intercept.' },
            { html: 'Yes: a calculator always shows the intercepts.', why: 'A window only shows ' + t('-10\\le y\\le 10') + ' here.' }],
            t('x') + ': ' + t(s.xi) + ' is inside ' + t('[-10,\\ 10]') + '. ' + t('y') + ': ' + t('-' + s.b) + ' is below ' + t('-10') + ', so the ' + t('y') + '-intercept is not shown. A window such as ' + t('y:[-' + (Math.ceil((s.b + 5) / 5) * 5) + ',\\ 10]') + ' fixes it.', ['Compare each intercept with the window limits.'], 'standard window check');
        } }] },
      { num: '13', stem: '', parts: [
        { id: '13', level: 'EMG', outcome: 'RF2', make: function (r) {
          var dev = pick(r, ['a graphing calculator', 'a graphing calculator', 'a computer graphing app', 'a tablet graphing app']), m0 = pick(r, [2, 3, -1, -2, 4, -3, 1]), b0 = r.int(-6, 6), sl = m0 > 0 ? 'rising' : 'falling', nm = 'line ' + t('y=' + lin([[m0, 'x'], [b0, '']])) + ' ';
          var p = BF('The ' + nm + 'is graphed on ' + dev + ' screen, ' + sl + ' from left to right, and runs off every edge of the window without turning around anywhere. State the domain and range of this relation.', [{ label: 'Domain', name: 'Domain', mode: 'math', keys: 'set', vars: ['x', 'y'], placeholder: 'e.g. -2 <= x <= 5' }, { label: 'Range', name: 'Range', mode: 'math', keys: 'set', vars: ['x', 'y'], placeholder: 'e.g. y >= 1' }],
            [K.set('\\{x\\mid x\\in\\mathbb{R}\\}', { v: 'x', tag: false, wrong: [{ is: '\\{x\\mid -10\\le x\\le 10,\\ x\\in\\mathbb{R}\\}', code: 'dr-context', hint: 'The window is only a view: the line keeps going past its edges.' }] }), K.set('\\{y\\mid y\\in\\mathbb{R}\\}', { v: 'y', wrong: [{ is: '\\{y\\mid -10\\le y\\le 10,\\ y\\in\\mathbb{R}\\}', code: 'dr-context', hint: 'The window is only a view: the line keeps going past its edges.' }] })],
            ['\\text{all real numbers}', '\\text{all real numbers}'], 'Domain: all real numbers. Range: all real numbers.',
            'No endpoints and no turning: the line continues forever in both directions, so it reaches every ' + t('x') + '-value and every ' + t('y') + '-value.<br>Domain: <b>all real numbers</b>. Range: <b>all real numbers</b>.', ['Does the line ever stop?'], 'D/R of a full line');
          p.good = [['\\mathbb{R}', '\\mathbb{R}'], ['x\\in\\mathbb{R}', 'y\\in\\mathbb{R}'], ['\\{x\\mid x\\in\\mathbb{R}\\}', '\\{y\\mid y\\in\\mathbb{R}\\}']]; p.bad = [['-10\\le x\\le 10', '\\text{all real numbers}']];
          return p;
        } }] },
      { num: '14', stem: '', parts: [
        { id: '14', level: 'BEG', outcome: 'RF2', make: function (r) {
          var a = r.int(1, 6), b = r.int(1, 9), c = b + r.int(1, 5), d = a + r.int(1, 3), e = d + r.int(1, 3), f = r.int(0, 9);
          var P0 = r.shuffle([[a, b], [d, b], [a, c], [e, f]]);
          return mc(r, 'Determine whether the relation ' + P0.map(function (q) { return t(ptT(q)); }).join(', ') + ' is a function.', [
            { html: '<b>Not a function:</b> the input ' + t(a) + ' has two different outputs, ' + t(b) + ' and ' + t(c) + '.', right: true },
            { html: '<b>Not a function:</b> the output ' + t(b) + ' appears twice.', why: 'Repeated outputs are fine. Look for an <b>input</b> with two outputs.' },
            { html: '<b>A function:</b> there are four different ordered pairs.', why: 'Different pairs can still share an input. Scan the ' + t('x') + '-values.' },
            { html: '<b>A function:</b> every output is a whole number.', why: 'What matters is whether any input has two outputs.' }],
            'Scan the ' + t('x') + '-values: the input ' + t(a) + ' appears twice, once with output ' + t(b) + ' and once with ' + t(c) + '. <b>Not a function</b> — one input has two outputs. (The repeated output ' + t(b) + ' is fine.)', ['Look for a repeated input with different outputs.'], 'function from pairs');
        } }] },
      { num: '15', stem: '', parts: [
        { id: '15', level: 'BEG', outcome: 'RF2', make: function (r) {
          // the sideways parabola x = y² shifted: x = y² + c (vertex (c, 0)), x = (y − k)² (vertex (0, k)) or both; the booklet's is x = y²
          var bk = r.chance(0.25), ty = r.pick(['c', 'c', 'c', 'k', 'k', 'ck', 'ck']), c = 0, k = 0;
          if (!bk && ty !== 'k') c = ty === 'c' ? r.pick([-5, -4, -3, -2, -1, 1, 2]) : r.pick([-3, -2, -1, 1]);
          if (!bk && ty !== 'c') k = ty === 'k' ? r.pick([-3, -2, -1, 1, 2, 3]) : r.pick([-2, -1, 1, 2]);
          var eq = 'x=' + (k === 0 ? 'y^{2}' : '(y' + (k > 0 ? '-' + k : '+' + (-k)) + ')^{2}') + (c > 0 ? '+' + c : c < 0 ? String(c) : '');
          var dv = bk ? 2 : r.pick([1, 2]), xv = c + dv * dv, yt = k + dv, yb = k - dv, pv = ptT([c, k]);
          var pts = [[c + 1, k + 1], [c + 1, k - 1], [c + 4, k + 2], [c + 4, k - 2]], ys = Math.sqrt(6 - c), path = [];
          for (var i = 0; i <= 60; i++) { var y = k - ys + 2 * ys * i / 60; if (Math.abs(y) <= 6.2) path.push([(y - k) * (y - k) + c, y]); }
          var fig0 = '<div class="fig">' + HW.graph({ x: [-6, 6], y: [-6, 6], grid: 1, labels: 2, xName: 'x', yName: 'y', max: 240, segs: [{ pts: path, start: 'arrow', end: 'arrow' }], points: pts.map(function (q) { return { x: q[0], y: q[1] }; }), aria: 'a sideways parabola' }) + '</div>';
          return mc(r, 'The graph shows the sideways parabola ' + t(eq) + ': it opens to the right from its vertex at ' + (c === 0 && k === 0 ? 'the origin' : t(pv)) + ', passing through ' + pts.slice(0, 3).map(function (q) { return t(ptT(q)); }).join(', ') + ' and ' + t(ptT(pts[3])) + '. Is this relation a function? Use the vertical line test.' + fig0, [
            { html: '<b>Not a function:</b> the vertical line ' + t('x=' + xv) + ' crosses it twice, at ' + t(ptT([xv, yt])) + ' and ' + t(ptT([xv, yb])) + ', so the input ' + t(xv) + ' has two outputs.', right: true },
            { html: '<b>A function:</b> a horizontal line crosses it only once.', why: 'The test for a function uses <b>vertical</b> lines.' },
            { html: '<b>A function:</b> the vertical line ' + t('x=' + c) + ' through the vertex crosses it only once.', why: 'One line isn’t enough: try a vertical line to the <b>right</b> of the vertex, like ' + t('x=' + xv) + '.' },
            { html: '<b>Not a function:</b> it is not a straight line.', why: 'Curves can be functions. The reason is the vertical line test.' }],
            '<b>Not a function.</b> Any vertical line to the right of the vertex crosses the curve <b>twice</b>, once on the top half and once on the bottom half. For example, ' + t('x=' + xv) + ' meets it at ' + t(ptT([xv, yt])) + ' and ' + t(ptT([xv, yb])) + ', so the input ' + t(xv) + ' has two outputs.', ['Draw a vertical line to the right of the vertex. How many times does it meet the curve?'], 'sideways parabola VLT');
        } }] },
      { num: '16', shared: hShared,
        stem: function (s) { return 'Consider the function ' + t(s.nm + '(x)=' + lin([[-s.a, 'x'], [s.b, '']])) + '.'; }, parts: [
        { id: '16', level: 'BEG', outcome: 'RF8', make: function (r, s) {
          var v = s.h(-s.k);
          return B.number('Determine ' + t(s.nm + '(-' + s.k + ')') + '.', v, function (u) { if (same(u, s.h(s.k))) return { code: 'ev-sign', hint: t('-' + s.a + '(-' + s.k + ')=+' + s.a * s.k) + ': a negative times a negative is positive.' }; return null; },
            t(s.nm + '(-' + s.k + ')=-' + s.a + '(-' + s.k + ')+' + s.b + '=' + s.a * s.k + '+' + s.b + '=' + v), ['Replace ' + t('x') + ' with ' + t('(-' + s.k + ')') + '.'], 'evaluate h(-k)', { before: t(s.nm + '(-' + s.k + ')=') });
        } },
        ] },
      { num: '17', shared: hShared, stem: function (s) { return 'Consider the function ' + t(s.nm + '(x)=' + lin([[-s.a, 'x'], [s.b, '']])) + '.'; }, parts: [
        { id: '17', level: 'EMG', outcome: 'RF8', make: function (r, s) {
          var y = s.h(s.m);
          return B.number('If ' + t(s.nm + '(m)=' + y) + ', determine the value of ' + t('m') + '.', s.m, function (u) { if (same(u, s.h(y))) return { code: 'ev-instead', hint: 'You found ' + t(s.nm + '(' + y + ')') + '. Here the <b>output</b> ' + t(y) + ' is given: solve ' + t('-' + s.a + 'm+' + s.b + '=' + y) + '.' }; if (same(u, -s.m)) return { code: 'sign', hint: 'Dividing by ' + t('-' + s.a) + ' changes the sign.' }; return null; },
            'The output is given, so solve:<br>' + t('-' + s.a + 'm+' + s.b + '=' + y) + '<br>' + t('-' + s.a + 'm=' + (y - s.b)) + '<br>' + t('m=' + s.m) + '. Check: ' + t(s.nm + '(' + s.m + ')=' + y) + ' ✓', ['Set the rule equal to ' + t(y) + ' and solve.'], 'solve h(m)=c', { before: t('m=') });
        } }] },
      { num: '18', shared: function (r) { var xs = [-4, -2, 0, 2, 4], ys; do { ys = xs.map(function () { return r.int(-6, 6); }); } while (ys[1] === ys[3] || ys[1] === 0 || ys[3] === 0); if (r.chance(0.3)) ys = [6, 3, 0, -3, -6]; var i = r.chance(0.6) ? [1, 3] : r.chance(0.5) ? [0, 4] : [3, 1]; return { P: xs.map(function (x, k) { return [x, ys[k]]; }), i: i }; },
        stem: function (s) { return 'The graph of ' + t('y=f(x)') + ' consists of the points ' + s.P.map(function (q) { return t(ptT(q)); }).join(', ') + '.'; }, parts: [
        { id: '18', level: 'EMG', outcome: 'RF8', make: function (r, s) {
          var A = s.P[s.i[0]], Bq = s.P[s.i[1]], v = A[1] - Bq[1];
          return B.number('Determine ' + t('f(' + A[0] + ')-f(' + Bq[0] + ')') + '.', v, function (u) { if (same(u, A[1] + Bq[1])) return { code: 'sign', hint: 'Subtracting a negative: ' + t(A[1] + '-(' + Bq[1] + ')') + '.' }; if (same(u, A[0] - Bq[0])) return { code: 'read-reverse', hint: t('f(' + A[0] + ')') + ' is the <b>output</b> paired with ' + t(A[0]) + ', not ' + t(A[0]) + ' itself.' }; if (same(u, -v)) return { code: 'sign', hint: 'Keep the order: ' + t('f(' + A[0] + ')') + ' minus ' + t('f(' + Bq[0] + ')') + '.' }; return null; },
            'From the list: ' + t('f(' + A[0] + ')=' + A[1]) + ' and ' + t('f(' + Bq[0] + ')=' + Bq[1]) + '.<br>' + t('f(' + A[0] + ')-f(' + Bq[0] + ')=' + A[1] + '-' + (Bq[1] < 0 ? '(' + Bq[1] + ')' : Bq[1]) + '=' + v), ['Find each output in the list first.'], 'f(a)-f(b) from points');
        } }] },
      /* ---------------- Part E ---------------- */
      { num: '19', section: 'Part E — Models and real-world graphs', shared: function (r) { var c = pick(r, [['A moving company', 'labour', 'move'], ['A moving company', 'labour', 'move'], ['A plumber', 'work', 'repair'], ['A boat rental shop', 'rental', 'rental'], ['A tutoring service', 'tutoring', 'session']]); return { c: c, F: pick(r, [60, 60, 40, 50, 75, 80]), rr: pick(r, [25, 25, 20, 30, 35, 45]), h: pick(r, [3, 3, 2, 4, 5]) }; },
        stem: function (s) { return s.c[0] + ' charges a ' + t('\\$' + s.F) + ' flat fee plus ' + t('\\$' + s.rr) + ' per hour of ' + s.c[1] + ', so the total cost of ' + t('h') + ' hours is ' + t('M(h)=' + s.F + '+' + s.rr + 'h') + '.'; }, parts: [
        { id: '19a', level: 'BEG', outcome: 'RF8', make: function (r, s) {
          var v = s.F + s.rr * s.h;
          return B.number('Determine ' + t('M(' + s.h + ')') + '.', v, function (u) { if (same(u, s.rr * s.h)) return { code: 'no-fixed', hint: 'Add the flat fee ' + t('\\$' + s.F) + '.' }; return null; }, t('M(' + s.h + ')=' + s.F + '+' + s.rr + '(' + s.h + ')=' + s.F + '+' + s.rr * s.h + '=' + v), ['Substitute ' + t('h=' + s.h) + '.'], 'M(h)', { before: t('M(' + s.h + ')=\\$') });
        } },
        { id: '19b', level: 'EMG', outcome: 'RF8', make: function (r, s) {
          var v = s.F + s.rr * s.h;
          return meaning(r, 'What does ' + t('M(' + s.h + ')=' + v) + ' represent?', 'The total cost of a ' + t(s.h) + '-hour ' + s.c[2] + ' is ' + t('\\$' + v) + ' (the ' + t('\\$' + s.F) + ' flat fee plus ' + t(s.h) + ' hours of ' + s.c[1] + ').', [
            { html: 'The cost of ' + t(s.h) + ' hours of ' + s.c[1] + ' only, without the flat fee.', why: 'The rule adds the flat fee: ' + t(v) + ' is the <b>total</b> cost.' },
            { html: 'Each hour costs ' + t('\\$' + v) + '.', why: 'Each hour costs ' + t('\\$' + s.rr) + '; ' + t(v) + ' is the total for ' + t(s.h) + ' hours.' },
            { html: 'A ' + t(v) + '-hour ' + s.c[2] + ' costs ' + t('\\$' + s.h) + '.', why: 'Input and output are swapped.' }],
            t('M(' + s.h + ')=' + v) + ': input ' + t(s.h) + ' hours, output ' + t('\\$' + v) + ' — the total cost, including the flat fee.', ['Input: hours. Output: total cost.'], 'meaning M(h)');
        } }] },
      { num: '20', shared: function (r) { var T = pick(r, [4, 4, 6, 3, 5, 8, 2, 7]), obj = pick(r, ['ball', 'ball', 'beanbag', 'water balloon', 'rock', 'tennis ball']); return { T: T, obj: obj, pk: T / 2 }; },
        stem: function (s) { return 'A ' + s.obj + ' is thrown straight up and lands back on the ground after ' + t(s.T) + ' seconds, reaching its peak height at ' + t('t=' + dn(s.pk)) + ' seconds.'; }, parts: [
        { id: '20', level: 'BEG', outcome: 'RF1', make: function (r, s) {
          return gridPart('What is happening to the ' + s.obj + '’s height during each time interval?', [{ id: 'a', html: 'The first ' + t(dn(s.pk)) + ' s ' + t('(0\\le t\\le ' + dn(s.pk) + ')') }, { id: 'b', html: 'The last ' + t(dn(s.pk)) + ' s ' + t('(' + dn(s.pk) + '\\le t\\le ' + s.T + ')') }],
            [{ id: 'up', html: 'Increasing' }, { id: 'down', html: 'Decreasing' }, { id: 'flat', html: 'Constant' }], { a: 'up', b: 'down' }, function (row) { return { code: 'row', hint: row === 'a' ? 'Before the peak the ' + s.obj + ' is rising.' : 'After the peak the ' + s.obj + ' falls back to the ground.' }; },
            '<b>First ' + dn(s.pk) + ' s:</b> increasing — it rises from the ground to its highest point. <b>Last ' + dn(s.pk) + ' s:</b> decreasing — it falls from the peak back to the ground. The graph is a smooth arch.', ['Where is the peak?'], 'ball up and down');
        } }] },
      { num: '21', shared: function (r) { var c = pick(r, [['a car', 'parked'], ['a car', 'parked'], ['a city bus', 'stopped at the terminal'], ['a train', 'waiting at the station'], ['a delivery van', 'parked'], ['a motorcycle', 'parked']]).slice(); c.v = pick(r, [60, 60, 40, 50, 70, 80, 90, 100]); return c; },
        stem: function (s) { return 'A graph shows the speed of ' + s[0] + ' over time as it sits ' + s[1] + ' (speed ' + t('0') + '), accelerates smoothly up to a cruising speed of ' + t(s.v) + ' km/h, then holds that cruising speed constant.'; }, parts: [
        { id: '21a', level: 'EMG', outcome: 'RF1', make: function (r, s) {
          var chk = story({ phases: [{ dir: 'flat', text: s[1] }, { dir: 'up', text: 'accelerating' }, { dir: 'flat', text: 'cruising' }], start: 0, startHint: 'At first it sits ' + s[1] + ': speed ' + t('0') + ', so start on the horizontal axis.',
            after: function (G) { return Math.abs(G[0].y0) > 1e-9 ? { code: 'story-start', hint: 'The first section is at speed ' + t('0') + ': flat <b>along the axis</b>.' } : G[2].y0 <= 1e-9 ? { code: 'story-zero', hint: 'Cruising is a constant speed <b>above</b> zero.' } : null; } });
          return storyPart('Sketch the graph (no scale; only the shape matters).', spad({ xTitle: 'Time', yTitle: 'Speed' }), chk, poly([[0, 0], [3, 0], [6, 5], [11, 5]]),
            '<b>Three sections:</b> flat along the axis (speed ' + t('0') + ', ' + s[1] + '), a rising section (accelerating), then flat at a higher level (cruising at a constant speed).', ['Speed 0 is on the axis; constant speed is flat.'], 'sketch parked-accelerate-cruise',
            [poly([[0, 0], [5, 5], [11, 5]]), poly([[0, 2], [3, 2], [6, 5], [11, 5]]), poly([[0, 0], [3, 0], [6, 5], [11, 0]])]);
        } },
        { id: '21b', level: 'BEG', outcome: 'RF1', make: function (r, s) {
          return gridPart('Describe each of the three sections of the graph.', [{ id: 'a', html: 'Section 1: flat along the axis' }, { id: 'b', html: 'Section 2: rising' }, { id: 'c', html: 'Section 3: flat above the axis' }],
            [{ id: 'park', html: s[1].charAt(0).toUpperCase() + s[1].slice(1) + ': not moving' }, { id: 'acc', html: 'Accelerating: speed increasing' }, { id: 'cruise', html: 'Cruising: moving at a constant speed' }], { a: 'park', b: 'acc', c: 'cruise' }, function (row) { return { code: 'row', hint: row === 'c' ? 'Flat means the speed is <b>not changing</b> — but it is above ' + t('0') + ', so the vehicle is still moving.' : 'Read the speed: is it ' + t('0') + ', rising, or constant?' }; },
            '1. Flat along the axis: speed ' + t('0') + ' (' + s[1] + '). 2. Rising: accelerating. 3. Flat at a higher level: constant cruising speed — flat means unchanging speed, not stopped.', ['Flat at 0 vs flat above 0.'], 'describe three sections');
        } }] },
      /* ---------------- Part F ---------------- */
      { num: '22', section: 'Part F — Mixed review', shared: function (r) { var rt = pick(r, [150, 150, 120, 200, 250, 100, 80, 90]), t1 = pick(r, [12, 12, 8, 10, 15, 6, 9]), t2 = pick(r, [18, 18, 20, 24, 16, 14].filter(function (x) { return x !== t1; })); return { rt: rt, t1: t1, t2: t2 }; },
        stem: function (s) { return 'A rectangular pool is being filled with water. The volume, in litres, after ' + t('m') + ' minutes is ' + t('V(m)=' + s.rt + 'm') + '.'; }, parts: [
        { id: '22a', level: 'BEG', outcome: 'RF8', make: function (r, s) { var v = s.rt * s.t1; return B.number('(a) Determine ' + t('V(' + s.t1 + ')') + '.', v, null, t('V(' + s.t1 + ')=' + s.rt + '(' + s.t1 + ')=' + F(v)) + ' litres', ['Substitute ' + t('m=' + s.t1) + '.'], 'V(m)', { after: 'L' }); } },
        { id: '22b', level: 'EMG', outcome: 'RF8', make: function (r, s) { var y = s.rt * s.t2; return B.number('(b) If ' + t('V(m)=' + F(y)) + ', determine how many minutes the pool has been filling.', s.t2, function (u) { if (same(u, s.rt * y)) return { code: 'ev-instead', hint: t(F(y)) + ' is the volume (the output): solve ' + t(s.rt + 'm=' + F(y)) + '.' }; return null; }, t(s.rt + 'm=' + F(y) + '\\Rightarrow m=\\dfrac{' + F(y) + '}{' + s.rt + '}=' + s.t2) + ' minutes', ['The volume is given: solve for ' + t('m') + '.'], 'solve V(m)=b', { after: 'min' }); } }] },
      { num: '23', shared: function (r) { return { rt: pick(r, [150, 150, 120, 200, 250]), T: pick(r, [40, 40, 30, 45, 50, 60, 35]) }; },
        stem: function (s) { return 'A pool fills according to ' + t('V(m)=' + s.rt + 'm') + ' (litres after ' + t('m') + ' minutes). It takes ' + t(s.T) + ' minutes to fill completely, after which the hose is turned off.'; }, parts: [
        { id: '23', level: 'EMG', outcome: 'RF2', make: function (r, s) {
          var p = B.set('State a reasonable domain for ' + t('V(m)') + ', given this context.', bld('m', 0, s.T), { v: 'm', tag: false, wrong: [{ is: '\\{m\\mid m\\in\\mathbb{R}\\}', code: 'dr-context', hint: 'The rule only applies while the pool is filling: from ' + t('m=0') + ' until it is full.' }, { is: '\\{m\\mid m\\ge 0,\\ m\\in\\mathbb{R}\\}', code: 'dr-context', hint: 'The hose is turned off when the pool is full, at ' + t(s.T) + ' minutes.' }, { is: bld('m', 0, s.rt * s.T), code: 'set-swap', hint: 'That is the volume. The domain is the set of times (minutes).' }] },
            'Filling starts at ' + t('m=0') + ' and the rule stops applying once the pool is full at ' + t('m=' + s.T) + ': ' + t(cond('m', 0, s.T)) + ' (minutes). Time is continuous, so an inequality — not a list — is right.', ['When does filling start, and when does it stop?'], 'domain of pool model');
          return ineqKey(p, cond('m', 0, s.T), [bld('m', 0, s.T), '[0, ' + s.T + ']']);
        } }] },
      { num: '24', shared: function (r) { var H = pick(r, [20, 20, 24, 30, 18, 15, 12, 16, 36, 28]), rr = pick(r, [5, 5, 4, 6, 3, 2, 7].filter(function (x) { return H % x === 0 && H / x <= 10 && H / x >= 3; })), k = r.int(1, H / rr - 1); return { H: H, rr: rr, k: k, Te: H / rr }; },
        stem: function (s) { return 'A candle is ' + t(s.H) + ' cm tall when lit and burns down at a steady rate of ' + t(s.rr) + ' cm per hour. The height, in cm, remaining after ' + t('x') + ' hours is modelled by ' + t('f(x)=' + s.H + '-' + s.rr + 'x') + '.'; }, parts: [
        { id: '24a', sub: 'a i', level: 'BEG', outcome: 'RF8', make: function (r, s) { var v = s.H - s.rr * s.k; return B.number('(a) Determine ' + t('f(' + s.k + ')') + '.', v, function (u) { if (same(u, s.rr * s.k)) return { code: 'value', hint: 'That is how much has burned. Subtract it from ' + t(s.H) + '.' }; return null; }, t('f(' + s.k + ')=' + s.H + '-' + s.rr + '(' + s.k + ')=' + v), ['Substitute ' + t('x=' + s.k) + '.'], 'f(k) candle', { after: 'cm' }); } },
        { id: '24b', sub: 'a ii', level: 'EMG', outcome: 'RF8', make: function (r, s) { var v = s.H - s.rr * s.k; return meaning(r, 'What does ' + t('f(' + s.k + ')=' + v) + ' mean?', 'After ' + t(s.k) + ' hours of burning, ' + t(v) + ' cm of candle is left.', [{ html: 'After ' + t(v) + ' hours, ' + t(s.k) + ' cm is left.', why: 'Input and output are swapped.' }, { html: 'The candle burns ' + t(v) + ' cm every ' + t(s.k) + ' hours.', why: t('f(' + s.k + ')') + ' is the height at one moment, not a rate.' }, { html: t(v) + ' cm of candle has burned after ' + t(s.k) + ' hours.', why: t('f(x)') + ' is the height <b>remaining</b>.' }], 'Input ' + t(s.k) + ' h, output ' + t(v) + ' cm remaining.', ['Input: hours. Output: height left.'], 'meaning f(k) candle'); } },
        { id: '24c', sub: 'b i', level: 'EMG', outcome: 'RF5', make: function (r, s) {
          var p = B.math('(b) Algebraically determine the ' + t('x') + '-intercept of this function (as an ordered pair).', pointChk(s.Te, 0), ptT([s.Te, 0]), 'Set the height to ' + t('0') + ': ' + t('0=' + s.H + '-' + s.rr + 'x\\Rightarrow ' + s.rr + 'x=' + s.H + '\\Rightarrow x=' + s.Te) + ', so the intercept is ' + t(ptT([s.Te, 0])) + '.', ['The ' + t('x') + '-intercept is where the output is ' + t('0') + '.'], 'x-int candle', { keys: 'pairs', placeholder: 'e.g. (5, 0)' });
          p.bad = ['(0,' + s.H + ')', '(0,' + s.Te + ')']; return p;
        } },
        { id: '24d', sub: 'b ii', level: 'EMG', outcome: 'RF5', make: function (r, s) { return meaning(r, 'What does the ' + t('x') + '-intercept ' + t(ptT([s.Te, 0])) + ' represent?', 'The candle is completely burned out after ' + t(s.Te) + ' hours.', [{ html: 'The candle is ' + t(s.Te) + ' cm tall at the start.', why: 'At the ' + t('x') + '-intercept the <b>height</b> is ' + t('0') + '.' }, { html: 'The candle burns ' + t(s.Te) + ' cm per hour.', why: 'The rate is ' + t(s.rr) + ' cm per hour.' }, { html: 'The candle was lit at hour ' + t(s.Te) + '.', why: 'It was lit at ' + t('x=0') + '.' }], t(ptT([s.Te, 0])) + ': after ' + t(s.Te) + ' hours the height is ' + t('0') + ' — the candle has burned out.', ['What is the height at an ' + t('x') + '-intercept?'], 'meaning x-int candle'); } },
        { id: '24e', sub: 'c', level: 'EMG', outcome: 'RF2', make: function (r, s) {
          var p = B.set('(c) State an appropriate domain for this function, given the context.', bld('x', 0, s.Te), { v: 'x', tag: false, wrong: [{ is: '\\{x\\mid x\\in\\mathbb{R}\\}', code: 'dr-context', hint: 'The candle exists only from when it is lit until it burns out.' }, { is: bld('x', 0, s.H), code: 'set-swap', hint: t(s.H) + ' is the starting height. The domain is a set of times: until it burns out at ' + t(s.Te) + ' h.' }] },
            'From lighting (' + t('x=0') + ') until it burns out (' + t('x=' + s.Te) + '): ' + t(cond('x', 0, s.Te)) + ' (hours).', ['When does the candle start burning, and when is it gone?'], 'domain candle');
          return ineqKey(p, cond('x', 0, s.Te), [bld('x', 0, s.Te), '[0, ' + s.Te + ']']);
        } }] },
      { num: '25', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '25', level: 'PRG', outcome: 'RF2', make: function (r) {
          var a = pick(r, [6, 6, 3, 4, 5, 7]), b = pick(r, [4, 4, 1, 2, 3, 5].filter(function (x) { return x < a; })), nm = pick(r, ['r', 'r', 'g', 'k']), D = r.chance(0.7) ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4];
          var R = D.map(function (x) { return a * x - b; }), sum = R.reduce(function (s0, v) { return s0 + v; }, 0);
          return B.nr('The function ' + t(nm + '(x)=' + a + 'x-' + b) + ' has domain ' + t(lst(D)) + '. The sum of all values in the range of ' + t(nm) + ' is ________.', sum, function (u) { if (same(u, D.reduce(function (s0, v) { return s0 + v; }, 0))) return { code: 'set-swap', hint: 'That is the sum of the domain. Evaluate ' + t(nm) + ' at each input first.' }; if (same(u, R[R.length - 1])) return { code: 'value', hint: 'Add <b>all</b> the outputs, not just the last one.' }; return null; },
            'Evaluate at each input: ' + D.map(function (x) { return t(nm + '(' + x + ')=' + (a * x - b)); }).join(', ') + '. Range ' + t('=' + lst(R)) + ', sum ' + t('=' + R.join('+').replace(/\+-/g, '-') + '=' + sum) + '.', ['Find every output, then add them.'], 'NR sum of range');
        } }] },
      { num: '26', section: 'Written response', shared: function (r) { var F0 = pick(r, [4, 4, 3, 5, 6, 2]), rr = pick(r, [3, 3, 2, 4, 5]), H = pick(r, [8, 8, 6, 10, 12]), h1 = pick(r, [5, 5, 3, 4, 2].filter(function (x) { return x < H; })), h2 = pick(r, [7, 7, 5, 6, 3].filter(function (x) { return x <= H && x !== h1; })); return { F: F0, rr: rr, H: H, h1: h1, h2: h2, C: function (x) { return F0 + rr * x; } }; },
        stem: function (s) { return 'A parking lot charges according to the function ' + t('C(h)=' + s.F + '+' + s.rr + 'h') + ', where ' + t('C') + ' is the cost in dollars and ' + t('h') + ' is the number of hours parked, up to a maximum stay of ' + t(s.H) + ' hours.'; }, parts: [
        { id: '26a', level: 'BEG', outcome: 'RF8', make: function (r, s) { var v = s.C(s.h1); return B.number('Determine the cost of parking for ' + t(s.h1) + ' hours.', v, function (u) { if (same(u, s.rr * s.h1)) return { code: 'no-fixed', hint: 'Add the base fee ' + t('\\$' + s.F) + '.' }; return null; }, t('C(' + s.h1 + ')=' + s.F + '+' + s.rr + '(' + s.h1 + ')=' + v), ['Find ' + t('C(' + s.h1 + ')') + '.'], 'C(h1)', { before: t('\\$') }); } },
        { id: '26b', level: 'EMG', outcome: 'RF8', make: function (r, s) { var y = s.C(s.h2); return B.number('A customer paid ' + t('\\$' + y) + '. Determine how many hours they parked.', s.h2, function (u) { if (same(u, s.C(y))) return { code: 'ev-instead', hint: t('\\$' + y) + ' is the cost (output): solve ' + t(s.F + '+' + s.rr + 'h=' + y) + '.' }; if (Math.abs(u - y / s.rr) < 1e-6) return { code: 'no-fixed', hint: 'Subtract the base fee first.' }; return null; }, t(s.F + '+' + s.rr + 'h=' + y) + '<br>' + t(s.rr + 'h=' + (y - s.F)) + '<br>' + t('h=' + s.h2) + ' hours (within the ' + t(s.H) + '-hour maximum ✓)', ['Solve ' + t('C(h)=' + y) + '.'], 'solve C(h)=b', { after: 'hours' }); } },
        { id: '26c', level: 'EMG', outcome: 'RF8', make: function (r, s) { return mc(r, 'Determine ' + t('C(0)') + ', and explain what it represents.', [{ html: t('C(0)=\\$' + s.F) + ': the base fee charged just for entering the lot, before any hourly charge.', right: true }, { html: t('C(0)=\\$0') + ': parking for no time is free.', why: 'Substitute: ' + t(s.F + '+' + s.rr + '(0)=' + s.F) + '.' }, { html: t('C(0)=\\$' + s.rr) + ': the cost per hour.', why: t(s.rr) + ' is the hourly rate; ' + t('C(0)') + ' is the output at ' + t('h=0') + '.' }, { html: t('C(0)=\\$' + s.F) + ': the cost of the first hour.', why: 'At ' + t('h=0') + ' no hours have been charged yet.' }], t('C(0)=' + s.F + '+' + s.rr + '(0)=\\$' + s.F) + ' — the base fee, charged even for ' + t('0') + ' hours.', ['Substitute ' + t('h=0') + '.'], 'meaning C(0)'); } },
        { id: '26d', level: 'PRG', outcome: 'RF2', make: function (r, s) { return drPart('State the domain and range of this function, given the maximum ' + t(s.H) + '-hour stay.', { dv: 'h', fname: 'C', D: [0, s.H], R: [s.F, s.C(s.H)], rW: [{ is: bld('y', 0, s.C(s.H)), code: 'dr-from-zero', hint: 'Even ' + t('0') + ' hours costs the base fee: the range starts at ' + t('C(0)=' + s.F) + '.' }] }, 'Hours run from ' + t('0') + ' to the ' + t(s.H) + '-hour maximum; cost from ' + t('C(0)=\\$' + s.F) + ' to ' + t('C(' + s.H + ')=\\$' + s.C(s.H)) + ':<br>' + drSol('h', 'C', [0, s.H], [s.F, s.C(s.H)]), ['Domain: 0 to the maximum stay. Range: the cost at both ends.'], 'D/R parking'); } },
        { id: '26e', level: 'PRG', outcome: 'RF5', make: function (r, s) { return mc(r, 'The ' + t('y') + '-intercept of the graph equals ' + t('C(0)') + '. Why does this make sense in the situation?', [{ html: 'The ' + t('y') + '-intercept is the cost when ' + t('h=0') + ': a driver owes the ' + t('\\$' + s.F) + ' base fee the moment they enter, before any time is charged.', right: true }, { html: 'Because the graph starts at the origin.', why: 'It starts at ' + t('(0,\\ ' + s.F + ')') + ', not at the origin.' }, { html: 'Because the ' + t('y') + '-intercept is the hourly rate.', why: 'The hourly rate is the steepness, not the intercept.' }, { html: 'Because the lot is free for the first hour.', why: 'At ' + t('h=0') + ' the cost is already ' + t('\\$' + s.F) + '.' }], 'The ' + t('y') + '-intercept is the value of ' + t('C') + ' when ' + t('h=0') + ' — exactly ' + t('C(0)=\\$' + s.F) + ', the base fee. The graph starts ' + t('\\$' + s.F) + ' up the vertical axis, and the ' + t('\\$' + s.rr) + ' per hour adds on from there.', ['What is the input at the ' + t('y') + '-intercept?'], 'y-int equals C(0)'); } }] }
    ],
    extra: EXTRA12()
  }));

  function EXTRA12() { return [
    /* ---------------- Extra 1: piecewise graph ---------------- */
    { num: '1', section: 'Extra practice A — Reading graphs', shared: function (r) {
        for (var g = 0; g < 500; g++) {
          var s = pick(r, [2, 2, 1]), k = pick(r, [-2, -2, -3, -1, -4]), x1 = pick(r, [-2, -2, -3, -1]), L = pick(r, [3, 3, 2, 4]), w1 = pick(r, [3, 3, 2, 4]), w2 = pick(r, [3, 3, 2, 4]);
          var V = [[x1 - w1, k + s * w1], [x1, k], [x1 + L, k], [x1 + L + w2, k + s * w2]];
          if (V[0][0] < -6 || V[3][0] > 6 || V[0][1] > 6 || V[3][1] > 6 || V[0][1] <= 0 || V[3][1] <= 0 || x1 > 0 || x1 + L < 0) continue;
          var zs = pwSols(V, 0); if (zs.length !== 2 || zs.some(function (z) { return !Number.isInteger(z); })) continue;
          var lev = [2, 1, 3].filter(function (y) { var q = pwSols(V, y); return y > k && y <= Math.min(V[0][1], V[3][1]) && q.length === 2 && q.every(Number.isInteger) && y !== 0; })[0];
          if (lev == null) continue;
          var xa = pwSols(V, lev);
          return { V: V, k: k, s: s, z: zs, lev: lev, xa: xa, lo: k, hi: Math.max(V[0][1], V[3][1]), fig: segFig(V, { yn: 'y', aria: 'graph of f' }) };
        }
      }, stem: function (sh) { return 'The graph of ' + t('y=f(x)') + ' below is made of three straight pieces, with solid endpoints.' + sh.fig; }, parts: [
      { id: 'e1a', level: 'BEG', outcome: 'RF2', make: function (r, sh) { return mc(r, '(a) Is this relation a function? Use the vertical line test.', [{ html: '<b>Yes:</b> no vertical line meets the graph more than once, so each ' + t('x') + ' has exactly one ' + t('y') + '.', right: true }, { html: '<b>No:</b> the horizontal line ' + t('y=' + sh.lev) + ' meets the graph twice.', why: 'The test uses <b>vertical</b> lines. Two inputs sharing an output is allowed.' }, { html: '<b>No:</b> it has a flat piece, so many inputs have the same output.', why: 'Repeated outputs are fine. Only one input with two outputs breaks the rule.' }, { html: '<b>Yes:</b> it is made of straight pieces.', why: 'Right answer, wrong reason: straight pieces can still fail (e.g. a vertical piece).' }], 'Every vertical line meets the graph at most once: each input has exactly one output — a function. (The flat piece just repeats an output, which is allowed.)', ['Sweep a vertical line across the graph.'], 'EP VLT piecewise'); } },
      { id: 'e1b', level: 'EMG', outcome: 'RF2', make: function (r, sh) { var V = sh.V; return drPart('(b) State the domain and the range, using set notation.', { dv: 'x', fname: 'f', D: [V[0][0], V[3][0]], R: [sh.lo, sh.hi], rW: [{ is: bld('y', Math.min(V[0][1], V[3][1]), sh.hi), code: 'dr-peak', hint: 'Use the lowest point of the whole graph: the flat piece at ' + t(sh.lo) + '.' }] }, drSol('x', 'f', [V[0][0], V[3][0]], [sh.lo, sh.hi]), ['Left to right for the domain; lowest to highest for the range.'], 'EP D/R piecewise'); } },
      { id: 'e1c', level: 'EMG', outcome: 'RF5', make: function (r, sh) {
        var y0 = pwAt(sh.V, 0);
        var fl = [solField(t('x') + '-intercepts: ' + t('x=') + ' (the ' + t('x') + '-values)', 'x'), { label: t('y') + '-intercept:', name: 'y-intercept', mode: 'math', keys: 'pairs', placeholder: 'e.g. (0, 3)' }];
        var p = BF('(c) State every ' + t('x') + '-intercept and the ' + t('y') + '-intercept.', fl, [solsChk(sh.z, { b: 0, graph: true }), pointChk(0, y0)], [solsKey(sh.z), ptT([0, y0])], sh.z.map(function (z) { return t(ptT([z, 0])); }).join(', ') + '; ' + t(ptT([0, y0])),
          t('x') + '-intercepts (where the graph meets the ' + t('x') + '-axis): ' + sh.z.map(function (z) { return t(ptT([z, 0])); }).join(' and ') + '.<br>' + t('y') + '-intercept: ' + t(ptT([0, y0])) + '.', ['Where does the graph cross each axis?'], 'EP intercepts piecewise');
        return p;
      } },
      { id: 'e1d', level: 'BEG', outcome: 'RF8', make: function (r, sh) { var xs = [sh.xa[1], sh.xa[0]]; return fieldsOf('(d) Determine ' + xs.map(function (x) { return t('f(' + x + ')'); }).join(' and ') + '.', xs.map(function (x) { return valItem(t('f(' + x + ')='), 'f(' + x + ')', pwAt(sh.V, x)); }), xs.map(function (x) { return t('f(' + x + ')=' + pwAt(sh.V, x)); }).join(', '), 'Read up or down from each input: ' + xs.map(function (x) { return t('f(' + x + ')=' + pwAt(sh.V, x)); }).join(', ') + '.', ['Start on the ' + t('x') + '-axis.'], 'EP read f'); } },
      { id: 'e1e', level: 'EMG', outcome: 'RF8', make: function (r, sh) { return solvePart('(e) Determine <b>all</b> values of ' + t('x') + ' for which ' + t('f(x)=' + sh.lev) + '.', sh.xa, { b: sh.lev, graph: true }, 'Read across at height ' + t(sh.lev) + ': one point on each sloped piece, ' + t(solsKey(sh.xa)) + '.', ['Read across the whole graph.'], 'EP solve f=b two'); } },
      { id: 'e1f', level: 'BEG', outcome: 'RF2', make: function (r, sh) { var x = sh.xa[0], y = sh.lev; return mc(r, '(f) In which quadrant does the point ' + t('\\big(' + x + ',\\ f(' + x + ')\\big)') + ' lie?', QN.map(function (q) { return { html: 'Quadrant ' + q, right: q === quad([x, y]), why: 'Find ' + t('f(' + x + ')') + ' first, then use the signs of both coordinates.' }; }), t('f(' + x + ')=' + y) + ', so the point is ' + t(ptT([x, y])) + ': ' + t('x<0') + ' and ' + t('y>0') + ' — Quadrant ' + quad([x, y]) + '.', ['Find the output first.'], 'EP quadrant of point', true); } },
      { id: 'e1g', level: 'PRG', outcome: 'RF8', make: function (r, sh) { var a = sh.V[1][0], b = sh.V[2][0], T0 = bld('x', a, b); var p = B.math('(g) The equation ' + t('f(x)=' + sh.k) + ' has infinitely many solutions. State them using an inequality.', K.set(T0, { v: 'x', wrong: [{ is: lst([a, b]), code: 'sol-graph-missing', hint: 'The graph is flat at ' + t(sh.k) + ' for <b>every</b> ' + t('x') + ' from ' + t(a) + ' to ' + t(b) + ', not just at the ends.' }] }), cond('x', a, b), 'The middle piece is the horizontal segment ' + t('y=' + sh.k) + ' from ' + t('x=' + a) + ' to ' + t('x=' + b) + ': every ' + t('x') + ' there gives ' + t(sh.k) + '. Solutions: ' + t(cond('x', a, b)) + '. (A function may repeat an output as often as it likes.)', ['Where is the graph at height ' + t(sh.k) + '?'], 'EP interval solutions', { keys: 'set', vars: ['x'], placeholder: 'e.g. -2 <= x <= 1' }); p.good = ['[' + a + ', ' + b + ']']; return p; } }] },
    /* ---------------- Extra 2: five points ---------------- */
    { num: '2', shared: function (r) { var c, a; do { c = pick(r, [-3, -3, -2, -1, 2, 1, -5]); a = pick(r, [4, 4, 2, 3, 1, 5]); } while ([c, c + a, c + 4 * a].indexOf(0) >= 0 || c + 4 * a > 7 || c + a === 0); var nm = pick(r, ['g', 'g', 'k', 'p']); var P0 = [-4, -2, 0, 2, 4].map(function (x) { return [x, c + a * x * x / 4]; }); return { c: c, a: a, P: P0, nm: nm }; },
      stem: function (s) { return 'The graph of ' + t('y=' + s.nm + '(x)') + ' consists of the five points shown.' + ptsFig(s.P, { y: [Math.min(-5, s.c - 1), Math.max(7, s.c + 4 * s.a + 1)], yn: s.nm + '(x)' }); }, parts: [
      { id: 'e2a', sub: 'a i', level: 'LIM', outcome: 'RF2', make: function (r, s) { return B.pairs('(a) Write the relation as a set of ordered pairs.', s.P, {}, s.P.map(function (q) { return t(ptT(q)); }).join(', '), ['(x, y) for each dot.'], 'EP points to pairs'); } },
      { id: 'e2b', sub: 'a ii', level: 'LIM', outcome: 'RF2', make: function (r, s) { return fnTable('Now write it as a table of values.', s.nm, 'x', s.P.map(function (q) { return q[0]; }), function (x) { return s.c + s.a * x * x / 4; }, null, 'Read each dot: ' + s.P.map(function (q) { return t(s.nm + '(' + q[0] + ')=' + q[1]); }).join(', '), ['Each dot gives one column.'], 'EP points to table'); } },
      { id: 'e2c', sub: 'b i', level: 'EMG', outcome: 'RF2', make: function (r, s) { var D = s.P.map(function (q) { return q[0]; }), R = s.P.map(function (q) { return q[1]; }); return drPart('(b) State the domain and the range in set notation.', { dv: 'x', fname: s.nm, disc: true, D: D, R: R }, t('D=' + lst(D)) + '<br>' + t('R=' + lst(R)) + ' — only three values: two pairs of points share an output, and a set lists each value once.', ['Separate dots: list the values in braces, each once.'], 'EP D/R five points'); } },
      { id: 'e2d', sub: 'b ii', level: 'EMG', outcome: 'RF2', make: function (r, s) { return mc(r, 'Why does the range have only three values even though there are five points?', [{ html: 'Two pairs of points share an output, and a set lists each value only once.', right: true }, { html: 'Because two of the points are not part of the relation.', why: 'All five dots are part of it. Compare their heights.' }, { html: 'Because the range only counts positive values.', why: 'The range includes every output, negative ones too.' }, { html: 'Because ' + t(s.nm) + ' is not a function.', why: 'It is a function. Look at which outputs repeat.' }], 'The outputs are ' + s.P.map(function (q) { return t(q[1]); }).join(', ') + ': ' + t(s.c + s.a) + ' and ' + t(s.c + 4 * s.a) + ' each appear twice, and a set lists each value once.', ['Compare the heights of the dots.'], 'EP why three values'); } },
      { id: 'e2e', sub: 'c', level: 'BEG', outcome: 'RF2', make: function (r, s) { return mc(r, '(c) Is ' + t(s.nm) + ' a function?', [{ html: '<b>Yes:</b> every ' + t('x') + '-value appears exactly once, so no input has two outputs.', right: true }, { html: '<b>No:</b> some outputs repeat.', why: 'Repeated outputs are fine.' }, { html: '<b>No:</b> the points are not joined.', why: 'Separate dots can be a function.' }, { html: '<b>No:</b> it is symmetric.', why: 'Symmetry doesn’t matter; check the inputs.' }], 'Each input ' + t('-4,-2,0,2,4') + ' appears once: a function.', ['Does any input repeat?'], 'EP five points function'); } },
      { id: 'e2f', sub: 'd', level: 'BEG', outcome: 'RF8', make: function (r, s) { var v = (s.c + s.a) + (s.c + 4 * s.a); return B.number('(d) Determine ' + t(s.nm + '(-2)+' + s.nm + '(4)') + '.', v, null, t(s.nm + '(-2)+' + s.nm + '(4)=' + (s.c + s.a) + '+' + (s.c + 4 * s.a) + '=' + v), ['Read each output from the graph.'], 'EP g(a)+g(b)'); } },
      { id: 'e2g', sub: 'e', level: 'EMG', outcome: 'RF8', make: function (r, s) { var y = s.c + s.a; return solvePart('(e) Solve ' + t(s.nm + '(x)=' + y) + '.', [-2, 2], { b: y, graph: true }, 'Two dots are at height ' + t(y) + ': ' + t('x=-2') + ' and ' + t('x=2') + '.', ['Find every dot at height ' + t(y) + '.'], 'EP solve g=b points'); } },
      { id: 'e2h', sub: 'f', level: 'EMG', outcome: 'RF5', make: function (r, s) { return mc(r, '(f) State the ' + t('y') + '-intercept, then explain why this relation has <b>no</b> ' + t('x') + '-intercept.', [{ html: t('y') + '-intercept ' + t(ptT([0, s.c])) + '. No dot has ' + t('y=0') + ', and the relation is only these five dots — nothing joins them — so it never touches the ' + t('x') + '-axis.', right: true }, { html: t('y') + '-intercept ' + t(ptT([0, s.c])) + '; there is no ' + t('x') + '-intercept because ' + t(s.c) + ' is ' + (s.c < 0 ? 'negative' : 'positive') + '.', why: 'The sign of the ' + t('y') + '-intercept doesn’t decide it. Is any dot on the ' + t('x') + '-axis?' }, { html: t('y') + '-intercept ' + t(ptT([s.c, 0])) + '; the dots are not joined.', why: 'A ' + t('y') + '-intercept has ' + t('x=0') + ': ' + t(ptT([0, s.c])) + '.' }, { html: 'It does have ' + t('x') + '-intercepts, between the dots.', why: 'Only the five dots belong to the relation — nothing between them.' }], t('y') + '-intercept: ' + t(ptT([0, s.c])) + '. No dot lies on the ' + t('x') + '-axis, and there is nothing between the dots, so there is no ' + t('x') + '-intercept.', ['Is any dot on the ' + t('x') + '-axis?'], 'EP no x-intercept'); } }] },
    /* ---------------- Extra 3: drone ---------------- */
    { num: '3', shared: function (r) { for (var g = 0; g < 400; g++) { var t1 = pick(r, [20, 20, 10, 15, 30]), H = pick(r, [60, 60, 40, 50, 30]), hv = pick(r, [30, 30, 20, 25, 40]), t3 = pick(r, [30, 30, 20, 25, 40, 50]); var T = t1 + hv + t3; if (T > 100 || (H / t1) <= (H / t3) || (H / t1) % 1 || (H / t3 * 2) % 1) continue; return { t1: t1, H: H, hv: hv, t3: t3, T: T, V: [[0, 0], [t1, H], [t1 + hv, H], [T, 0]] }; } },
      stem: function (s) { return 'A drone takes off, hovers, and lands. Its height ' + t('h(t)') + ', in metres, ' + t('t') + ' seconds after launch is graphed below.<div class="fig">' + HW.graph({ x: [0, s.T + 10], y: [0, s.H + 10], grid: 5, gridY: 5, labelsX: 10, labelsY: 10, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 't (s)', yTitle: 'h(t) (m)', unitX: 320 / (s.T + 10), unitY: 200 / (s.H + 10), max: 380, segs: [{ pts: s.V }], aria: 'drone height' }) + '</div>'; }, parts: [
      { id: 'e3a', level: 'BEG', outcome: 'RF8', make: function (r, s) { var x = s.t1 + Math.round(s.hv / 2 / 5) * 5; return B.number('(a) Determine ' + t('h(' + x + ')') + '. (At that moment the drone is hovering at a constant height.)', s.H, null, t('h(' + x + ')=' + s.H) + ' m: the graph is flat there — the drone is hovering.', ['Read up from ' + t(x) + ' s.'], 'EP drone h(t)', { after: 'm' }); } },
      { id: 'e3b', level: 'EMG', outcome: 'RF1', make: function (r, s) { var u = s.H / s.t1, d = -s.H / s.t3; return B.fields('(b) Determine the rate of change during the climb and during the descent (include the sign).', [box('Climb:', 'm/s'), box('Descent:', 'm/s')], [K.number(u, numDiag(u, rateCands(s.H, s.t1, u))), K.number(d, numDiag(d, rateCands(-s.H, s.t3, d)))], [dn(u), dn(d)], t('+' + dn(u)) + ' m/s, ' + t(dn(d)) + ' m/s', 'Climb: ' + t('\\frac{' + s.H + '}{' + s.t1 + '}=' + dn(u)) + ' m/s. Descent: ' + t('\\frac{-' + s.H + '}{' + s.t3 + '}=' + dn(d)) + ' m/s. The climb is steeper (' + t(dn(u)) + ' > ' + t(dn(-d)) + '): the drone rises faster than it comes down.', ['Change in height ÷ change in time; going down is negative.'], 'EP drone rates'); } },
      { id: 'e3c', sub: 'c i', level: 'EMG', outcome: 'RF8', make: function (r, s) { var y = s.H / 2, a = s.t1 / 2, b = s.t1 + s.hv + s.t3 / 2; return solvePart('(c) Solve ' + t('h(t)=' + y) + '.', [a, b], { v: 't', b: y, graph: true }, 'Height ' + t(y) + ' is passed twice: ' + t('t=' + a) + ' going up and ' + t('t=' + b) + ' coming down.', ['Read across at ' + t(y) + ' m.'], 'EP drone solve'); } },
      { id: 'e3d', sub: 'c ii', level: 'PRG', outcome: 'RF2', make: function (r, s) { return mc(r, 'Why do two answers to ' + t('h(t)=' + s.H / 2) + ' <b>not</b> stop ' + t('h') + ' from being a function?', [{ html: 'A function may give the same output at two different inputs; it is only broken when one input has two outputs.', right: true }, { html: 'Because the two answers are far apart in time.', why: 'Distance between them doesn’t matter.' }, { html: 'It does stop it: two inputs with the same output is not allowed.', why: 'That is backwards: one <b>input</b> with two outputs is not allowed.' }, { html: 'Because the drone lands at the end.', why: 'Landing isn’t the reason. Think about the definition.' }], 'The drone passes ' + t(s.H / 2) + ' m once going up and once coming down: two inputs share one output, which a function allows.', ['What does a function restrict: inputs or outputs?'], 'EP two inputs one output'); } },
      { id: 'e3e', sub: 'd', level: 'EMG', outcome: 'RF2', make: function (r, s) { return drPart('(d) State the domain and range of ' + t('h') + ', using set notation.', { dv: 't', fname: 'h', D: [0, s.T], R: [0, s.H] }, drSol('t', 'h', [0, s.T], [0, s.H]), ['From launch to landing; from the ground to the hover height.'], 'EP drone D/R'); } },
      { id: 'e3f', sub: 'e', level: 'EMG', outcome: 'RF5', make: function (r, s) { return mc(r, '(e) What do the two ' + t('t') + '-intercepts mean for the drone?', [{ html: t(ptT([0, 0])) + ': launch, still on the ground; ' + t(ptT([s.T, 0])) + ': landing.', right: true }, { html: t(ptT([0, 0])) + ': landing; ' + t(ptT([s.T, 0])) + ': launch.', why: 'Time runs left to right.' }, { html: 'The two times when the drone is highest.', why: 'At a ' + t('t') + '-intercept the height is ' + t('0') + '.' }, { html: 'The start and end of the hover.', why: 'The hover is the flat part at ' + t(s.H) + ' m.' }], 'At both ' + t('t') + '-intercepts the height is ' + t('0') + ': ' + t('t=0') + ' is the launch and ' + t('t=' + s.T) + ' is the landing.', ['Height 0 means on the ground.'], 'EP drone intercepts'); } }] },
    /* ---------------- Extra 4: function or not ---------------- */
    { num: '4', section: 'Extra practice B — Functions and notation', shared: function (r) {
        var fA = r.chance(0.6), fB = r.chance(0.5), fC = r.chance(0.4), fD = r.chance(0.6), fE = r.chance(0.3);
        var c = r.int(1, 8), a = fA ? [[-1, c], [0, c], [1, c], [2, c]] : [[-1, c], [0, c + 2], [-1, c + 4], [2, c]];
        var u = r.int(2, 4), bt = fB ? [[u, 2], [u + 2, 4], [u, 2], [u + 4, 8]] : [[u, 2], [u + 2, 4], [u, 6], [u + 4, 8]];
        var cl = fC ? [['2', '7'], ['4', '7'], ['6', '9']] : [['2', '7'], ['4', '7'], ['6', '9'], ['6', '11']];
        return { fA: fA, fB: fB, fC: fC, fD: fD, fE: fE, a: a, bt: bt, cl: cl };
      }, stem: function (s) {
        var Dfig = HW.graph({ x: [-4, 4], y: [-4, 5], grid: 1, labels: 2, xName: 'x', yName: 'y', max: 150, segs: [{ pts: s.fD ? [[-3, 4], [0, -1], [3, 4]] : [[3.5, 3], [-1, 0], [3.5, -3]], start: 'none', end: 'none' }], aria: 'graph d' });
        var Efig = HW.graph({ x: [-4, 4], y: [-4, 4], grid: 1, labels: 2, xName: 'x', yName: 'y', max: 150, fns: s.fE ? [{ f: function (x) { return 0.33 * x * x - 2; }, from: -3.4, to: 3.4 }] : [{ f: function (x) { return Math.sqrt(Math.max(0, x / 0.33)); }, from: 0, to: 3 }, { f: function (x) { return -Math.sqrt(Math.max(0, x / 0.33)); }, from: 0, to: 3 }], aria: 'graph e' });
        return 'Decide whether each relation is a function.<br>(a) ' + s.a.map(function (q) { return t(ptT(q)); }).join(', ') + '<br>(b) ' + HW.valueTable([[t('x')].concat(s.bt.map(function (q) { return q[0]; })), [t('y')].concat(s.bt.map(function (q) { return q[1]; }))]) +
          '(c) <div class="fig">' + HW.arrowDiagram(['2', '4', '6'], ['7', '9', '11'], s.cl, {}) + '</div><div style="display:flex;flex-wrap:wrap;gap:8px"><div>(d)<br>' + Dfig + '</div><div>(e)<br>' + Efig + '</div></div>(f) Every student at a school is paired with their student number, and no two students share a number.';
      }, parts: [
      { id: 'e4a', sub: 'a–f i', level: 'EMG', outcome: 'RF2', make: function (r, s) {
        var rows = [{ id: 'a', html: '(a)' }, { id: 'b', html: '(b)' }, { id: 'c', html: '(c)' }, { id: 'd', html: '(d)' }, { id: 'e', html: '(e)' }, { id: 'f1', html: '(f) student → number' }, { id: 'f2', html: '(f) number → student' }];
        var want = { a: s.fA ? 'y' : 'n', b: s.fB ? 'y' : 'n', c: s.fC ? 'y' : 'n', d: s.fD ? 'y' : 'n', e: s.fE ? 'y' : 'n', f1: 'y', f2: 'y' };
        var why = { a: s.fA ? 'Each input appears once (repeated outputs are fine).' : 'The input ' + t('-1') + ' has two different outputs.', b: s.fB ? 'The pair ' + t(ptT(s.bt[0])) + ' is just listed twice: the input still has one output.' : 'The input ' + t(s.bt[0][0]) + ' has outputs ' + t('2') + ' and ' + t('6') + '.', c: s.fC ? 'Each input has one arrow (two inputs sharing an output is fine).' : 'The input ' + t('6') + ' has two arrows.', d: s.fD ? 'The V passes the vertical line test.' : 'It opens sideways: a vertical line crosses it twice.', e: s.fE ? 'The U-shape passes the vertical line test.' : 'It opens sideways: a vertical line crosses it twice.', f1: 'Each student has one number.', f2: 'No two students share a number, so each number leads to one student.' };
        return gridPart('Is each relation a function?', rows, [{ id: 'y', html: 'Function' }, { id: 'n', html: 'Not a function' }], want, function (row) { return { code: 'row', hint: why[row] }; },
          rows.map(function (rw) { return rw.html + ': ' + (want[rw.id] === 'y' ? '<b>function</b>' : '<b>not a function</b>') + ' — ' + why[rw.id]; }).join('<br>'), ['A relation fails only when one input has two different outputs.'], 'EP function or not six');
      } },
      { id: 'e4b', sub: 'a–f ii', level: 'PRG', outcome: 'RF2', make: function (r, s) {
        var bad = []; if (!s.fA) bad.push(['(a)', -1]); if (!s.fB) bad.push(['(b)', s.bt[0][0]]); if (!s.fC) bad.push(['(c)', 6]);
        if (!bad.length) bad.push(['(c)', null]);
        if (bad[0][1] == null) return mc(r, 'In relation (c), which input has two arrows?', [{ html: 'None: each input has exactly one arrow', right: true }, { html: t('2'), why: 'Count the arrows leaving 2.' }, { html: t('4'), why: 'Count the arrows leaving 4.' }, { html: t('6'), why: 'Count the arrows leaving 6.' }], 'Each input has one arrow; two inputs share the output 7, which is allowed.', ['Count arrows from each input.'], 'EP which input breaks', true);
        var b0 = bad[0];
        return B.number('Relation ' + b0[0] + ' is not a function. Name the input that breaks the rule.', b0[1], null, 'In ' + b0[0] + ' the input ' + t(b0[1]) + ' is paired with two different outputs.', ['Find the input that appears with two different outputs.'], 'EP name the input', { before: t('x=') });
      } }] },
    /* ---------------- Extra 5: f and g ---------------- */
    { num: '5', shared: function (r) { for (var k = 0; k < 400; k++) { var a = pick(r, [5, 5, 3, 7, 4, 6, 9, 11, 13, 1]), b = pick(r, [2, 2, 3, 4]), c = pick(r, [3, 3, 2, 4, 5]), d = pick(r, [10, 10, 6, 8, 12, -4, -6, 14, -2, 4, -3, 7]), xs = (a - d) / (b + c); if (!Number.isInteger(xs) || xs === 0 || a % b === 0 || d % c === 0) continue; return { a: a, b: b, c: c, d: d, xs: xs, f: function (x) { return a - b * x; }, g: function (x) { return c * x + d; }, k: pick(r, [3, 3, 2, 4]), y: r.chance(0.2) && (a - 15) % b === 0 ? 15 : a - b * pick(r, [-5, -4, -3, -2, 2, 3, 4]) }; } },
      stem: function (s) { return 'Consider the functions ' + t('f(x)=' + s.a + '-' + s.b + 'x') + ' and ' + t('g(x)=' + lin([[s.c, 'x'], [s.d, '']])) + '.'; }, parts: [
      { id: 'e5a', level: 'BEG', outcome: 'RF8', make: function (r, s) { var v = s.f(-s.k); return B.number('(a) Determine ' + t('f(-' + s.k + ')') + '.', v, function (u) { return same(u, s.f(s.k)) ? { code: 'ev-sign', hint: t('-' + s.b + '(-' + s.k + ')=+' + s.b * s.k) + '.' } : null; }, t('f(-' + s.k + ')=' + s.a + '-' + s.b + '(-' + s.k + ')=' + v), ['Brackets around ' + t('-' + s.k) + '.'], 'EP f(-k)', { before: t('f(-' + s.k + ')=') }); } },
      { id: 'e5b', level: 'EMG', outcome: 'RF8', make: function (r, s) { if (s.y == null) s.y = s.a + s.b * 5; var x = (s.a - s.y) / s.b; return B.number('(b) Solve ' + t('f(x)=' + s.y) + '.', x, function (u) { return same(u, -x) ? { code: 'sign', hint: 'Dividing by ' + t('-' + s.b) + ' changes the sign.' } : same(u, s.f(s.y)) ? { code: 'ev-instead', hint: 'Solve ' + t(s.a + '-' + s.b + 'x=' + s.y) + '.' } : null; }, t(s.a + '-' + s.b + 'x=' + s.y) + '<br>' + t('-' + s.b + 'x=' + (s.y - s.a)) + '<br>' + t('x=' + x), ['Set ' + t('f(x)') + ' equal to ' + t(s.y) + '.'], 'EP solve f=b', { before: t('x=') }); } },
      { id: 'e5c', level: 'PRG', outcome: 'RF8', make: function (r, s) { var v = s.f(s.xs); return B.fields('(c) Solve ' + t('f(x)=g(x)') + ', then verify by evaluating both functions at your answer.', [box(t('x='), ''), box(t('f(x)=g(x)=') + ' (common value)', '')], [K.number(s.xs, numDiag(s.xs, [{ v: -s.xs, code: 'sign', hint: 'Check your signs when moving terms across.' }])), K.number(v)], [String(s.xs), String(v)], t('x=' + s.xs) + ', both equal ' + t(v), t(s.a + '-' + s.b + 'x=' + lin([[s.c, 'x'], [s.d, '']])) + '<br>' + t(s.a - s.d + '=' + (s.b + s.c) + 'x') + '<br>' + t('x=' + s.xs) + '. Check: ' + t('f(' + s.xs + ')=' + v) + ' and ' + t('g(' + s.xs + ')=' + s.g(s.xs)) + ' ✓', ['Set the two rules equal and solve.'], 'EP solve f=g'); } },
      { id: 'e5d', level: 'PRG', outcome: 'RF5', make: function (r, s) { return B.fields('(d) Determine the ' + t('x') + '-intercept of each function. Give exact values.', [{ label: t('f') + ': ' + t('x='), name: 'f x-intercept', mode: 'math', keys: 'fraction' }, { label: t('g') + ': ' + t('x='), name: 'g x-intercept', mode: 'math', keys: 'fraction' }], [K.fraction([s.a, s.b], { decimalOk: false }), K.fraction([-s.d, s.c], { decimalOk: false })], [frT(s.a, s.b), frT(-s.d, s.c)], t(frT(s.a, s.b)) + ', ' + t(frT(-s.d, s.c)), t('f') + ': ' + t(s.a + '-' + s.b + 'x=0\\Rightarrow x=' + frT(s.a, s.b)) + '. ' + t('g') + ': ' + t(lin([[s.c, 'x'], [s.d, '']]) + '=0\\Rightarrow x=' + frT(-s.d, s.c)) + '.', ['Set each rule equal to ' + t('0') + '.'], 'EP exact x-ints'); } },
      { id: 'e5e', level: 'MAS', outcome: 'RF8', make: function (r, s) { var T0 = '\\{x\\mid x<' + s.xs + ',\\ x\\in\\mathbb{R}\\}'; var p = B.math('(e) For which values of ' + t('x') + ' is ' + t('f(x)>g(x)') + '? Write an inequality.', K.set(T0, { v: 'x', wrong: [{ is: '\\{x\\mid x>' + s.xs + ',\\ x\\in\\mathbb{R}\\}', code: 'sign', hint: t('f') + ' falls and ' + t('g') + ' rises, so ' + t('f') + ' is above ' + t('g') + ' to the <b>left</b> of where they meet. Test a value, e.g. ' + t('x=' + (s.xs - 5)) + '.' }, { is: '\\{x\\mid x\\le ' + s.xs + ',\\ x\\in\\mathbb{R}\\}', code: 'set-endpoint', hint: 'At ' + t('x=' + s.xs) + ' they are equal, not greater.' }] }), 'x<' + s.xs, 'The graphs meet only at ' + t('x=' + s.xs) + ' (part (c)). ' + t('f') + ' falls while ' + t('g') + ' rises, so ' + t('f') + ' is above ' + t('g') + ' on the left of that point: ' + t('x<' + s.xs) + '. (Check ' + t('x=' + (s.xs - 1)) + ': ' + t('f=' + s.f(s.xs - 1)) + ', ' + t('g=' + s.g(s.xs - 1)) + '.)', ['Use your answer to (c), then test a value on each side.'], 'EP f>g region', { keys: 'set', vars: ['x'], placeholder: 'e.g. x < 2' }); p.good = ['(-\\infty, ' + s.xs + ')']; return p; } },
      { id: 'e5f', level: 'PRG', outcome: 'RF8', make: function (r, s) { var nm = pick(r, ['Zeke', 'Zeke', 'Ivy', 'Raj']); return mc(r, '(f) ' + nm + ' says “' + t('f(x)=g(x)') + ' has no solution, because ' + t('f') + ' and ' + t('g') + ' are different functions.” What has ' + nm + ' confused?', [{ html: t('f(x)=g(x)') + ' doesn’t claim the functions are the same: it asks for the input at which they give the same output — here ' + t('x=' + s.xs) + '.', right: true }, { html: nm + ' is right: different functions never give equal outputs.', why: 'Check part (c): ' + t('f(' + s.xs + ')=g(' + s.xs + ')') + '.' }, { html: 'The equation has infinitely many solutions.', why: 'Two lines with different slopes meet once.' }, { html: 'It only has a solution if the two rules are equal.', why: 'Different rules can still agree at one input.' }], t('f(x)=g(x)') + ' asks where two different functions happen to have the same output: at ' + t('x=' + s.xs) + ', both are ' + t(s.f(s.xs)) + '.', ['What does solving ' + t('f(x)=g(x)') + ' look for?'], 'EP Zeke'); } }] },
    /* ---------------- Extra 6: tiles ---------------- */
    { num: '6', shared: function (r) { var a = pick(r, [5, 5, 3, 4, 6, 7]), d = pick(r, [4, 4, 2, 3, 5]), q = pick(r, [12, 12, 10, 15, 20]), nf0 = pick(r, [25, 25, 20, 30, 18]); return { a: a, d: d, q: q, N: a + d * (nf0 - 1), nf0: nf0, T: function (n) { return a + d * (n - 1); } }; },
      stem: function (s) { return 'A tiling pattern is built from square tiles. Figure ' + t('1') + ' uses ' + t(s.a) + ' tiles, and each figure after that uses ' + t(s.d) + ' more tiles than the one before.'; }, parts: [
      { id: 'e6a', level: 'BEG', outcome: 'RF4', make: function (r, s) { return fnTable('(a) Complete the table of values.', 'T', 'n', [2, 3, 4, 5], s.T, function (n, u) { return same(u, s.d * n) ? { code: 'value', hint: 'Start from ' + t(s.a) + ' and add ' + t(s.d) + ' each figure.' } : null; }, 'Add ' + t(s.d) + ' each time: ' + [1, 2, 3, 4, 5].map(function (n) { return t(s.T(n)); }).join(', '), ['Each figure adds ' + t(s.d) + '.'], 'EP tile table'); } },
      { id: 'e6b', level: 'BEG', outcome: 'RF1', make: function (r, s) { return gridPart('(b) Identify the independent and the dependent variable.', r.shuffle([{ id: 'n', html: 'Figure number ' + t('n') }, { id: 'T', html: 'Number of tiles ' + t('T(n)') }]), [{ id: 'ind', html: 'Independent' }, { id: 'dep', html: 'Dependent' }], { n: 'ind', T: 'dep' }, function () { return { code: 'row', hint: 'You choose the figure; the number of tiles depends on it.' }; }, 'Independent: the figure number ' + t('n') + '. Dependent: the number of tiles ' + t('T(n)') + '.', ['Which depends on which?'], 'EP ind/dep tiles'); } },
      { id: 'e6c', level: 'EMG', outcome: 'RF4', make: function (r, s) { var rhs = lin([[s.d, 'n'], [s.a - s.d, '']]); return convPart('fn', '(c) Write a function rule ' + t('T(n)') + ' for the number of tiles in Figure ' + t('n') + '.', { T: P(rhs), v: 'n', name: 'T', reqName: true, keyRhs: rhs, vars: ['x'], wrong: [{ is: P(lin([[s.d, 'n'], [s.a, '']])), code: 'diag', hint: 'Check Figure 1: your rule gives ' + t(s.d + s.a) + ', not ' + t(s.a) + '.' }, { is: P(lin([[s.a, 'n'], [s.d, '']])), code: 'u5l10-swap-rate', hint: 'The number added each figure (' + t(s.d) + ') multiplies ' + t('n') + '.' }] }, 'Each figure adds ' + t(s.d) + ', so ' + t('T(n)=' + s.d + 'n+b') + '; Figure 1: ' + t(s.d + '+b=' + s.a) + ', so ' + t('b=' + (s.a - s.d)) + '.<br>' + t('T(n)=' + rhs) + '. Check: ' + t('T(1)=' + s.a) + ', ' + t('T(5)=' + s.T(5)) + ' ✓', ['The constant change is the coefficient of ' + t('n') + '. Use Figure 1 to find the constant.'], 'EP tile rule'); } },
      { id: 'e6d', level: 'EMG', outcome: 'RF4', make: function (r, s) { var key = [1, 2, 3, 4, 5].map(function (n) { return [n, s.T(n)]; }), ym = Math.ceil((s.T(5) + 4) / 4) * 4; var inp = { x: [0, 6], y: [0, ym], grid: 1, gridY: 2, labelsX: 1, labelsY: 4, firstQuadrant: true, xName: 'n', yName: 'T(n)', xTitle: 'Figure, n', yTitle: 'Tiles, T(n)', mode: 'points', unitX: 45, unitY: 220 / ym, max: 340 }; var p = B.graph('(d) Graph the first five figures on the grid.', inp, K.graphExact(pts(key)), pts(key), 'Five separate dots: ' + key.map(function (q) { return t(ptT(q)); }).join(', ') + '. (Not joined: there is no Figure 2.5.)', ['Plot (figure, tiles) for each figure.'], 'EP tile graph'); p.bad = [pts(key.slice(0, 4)), pts(key.map(function (q) { return [q[0], q[1] - s.d]; }))]; return p; } },
      { id: 'e6e', level: 'BEG', outcome: 'RF8', make: function (r, s) { return B.number('(e) Determine ' + t('T(' + s.q + ')') + '.', s.T(s.q), function (u) { return same(u, s.d * s.q + s.a) ? { code: 'value', hint: 'Use your rule: ' + t('T(n)=' + lin([[s.d, 'n'], [s.a - s.d, '']])) + '.' } : null; }, t('T(' + s.q + ')=' + s.d + '(' + s.q + ')' + (s.a - s.d >= 0 ? '+' : '') + (s.a - s.d) + '=' + s.T(s.q)), ['Substitute into your rule.'], 'EP T(q)', { before: t('T(' + s.q + ')=') }); } },
      { id: 'e6f', level: 'EMG', outcome: 'RF8', make: function (r, s) { return B.number('(f) Which figure uses ' + t(s.N) + ' tiles?', s.nf0, function (u) { return same(u, s.T(s.N)) ? { code: 'ev-instead', hint: t(s.N) + ' is the number of tiles (output): solve ' + t('T(n)=' + s.N) + '.' } : null; }, t(lin([[s.d, 'n'], [s.a - s.d, '']]) + '=' + s.N + '\\Rightarrow ' + s.d + 'n=' + (s.N - s.a + s.d) + '\\Rightarrow n=' + s.nf0) + ': Figure ' + t(s.nf0) + '.', ['Solve ' + t('T(n)=' + s.N) + '.'], 'EP which figure', { before: 'Figure' }); } },
      { id: 'e6g', sub: 'g i', level: 'BEG', outcome: 'RF1', make: function (r, s) { return mc(r, '(g) Is the graph discrete or continuous?', [{ html: '<b>Discrete:</b> there is no Figure 2.5, so the points are not joined.', right: true }, { html: '<b>Continuous:</b> the tiles go up steadily.', why: 'Steady change doesn’t mean every value in between exists. Can there be half a figure?' }, { html: '<b>Discrete:</b> because the points lie on a line.', why: 'Points on a line could still be joined. The reason is that only whole figures exist.' }, { html: '<b>Continuous:</b> because it is a function.', why: 'Functions can be discrete.' }], 'Only whole-numbered figures exist: discrete dots.', ['Is there a Figure 2.5?'], 'EP discrete'); } },
      { id: 'e6h', sub: 'g ii', level: 'EMG', outcome: 'RF2', make: function (r, s) { return drPart('State the domain and range for Figures ' + t('1') + ' to ' + t('5') + '.', { dv: 'n', fname: 'T', disc: true, D: [1, 2, 3, 4, 5], R: [1, 2, 3, 4, 5].map(s.T) }, t('D=\\{1, 2, 3, 4, 5\\}') + ', ' + t('R=' + lst([1, 2, 3, 4, 5].map(s.T))), ['Discrete: list the values.'], 'EP tile D/R'); } },
      { id: 'e6i', sub: 'h', level: 'PRG', outcome: 'RF2', make: function (r, s) { var z = s.a - s.d; return mc(r, '(h) The rule gives ' + t('T(0)=' + z) + '. Why does that answer have no meaning in this pattern?', [{ html: 'There is no Figure 0: the pattern starts at Figure 1, so ' + t('n=0') + ' is outside the domain even though the arithmetic works.', right: true }, { html: 'Because the rule is wrong.', why: 'The rule is right for every figure. The problem is the input.' }, { html: 'Because ' + t(z) + ' tiles is too few.', why: 'The number isn’t the issue; Figure 0 doesn’t exist.' }, { html: 'It does have meaning: Figure 0 uses ' + t(z) + ' tiles.', why: 'The pattern begins with Figure 1.' }], t('n=0') + ' is outside the domain (figures start at 1): the rule can be evaluated there, but it describes no figure.', ['Which figures exist?'], 'EP T(0) meaningless'); } }] },
    /* ---------------- Extra 7: rule from two values ---------------- */
    { num: '7', shared: function (r) { var m = pick(r, [5, 5, 3, 4, 6, 2]), b = pick(r, [1, 1, 2, 3, -1, 4]), a1 = pick(r, [2, 2, 1, 3]), a2 = a1 + pick(r, [3, 3, 2, 4]), x9 = pick(r, [9, 9, 8, 10, 12]), y = m * pick(r, [19, 19, 15, 20, 25]) + b, nm = pick(r, ['h', 'h', 'k', 'p']); return { m: m, b: b, a1: a1, a2: a2, x9: x9, y: y, nm: nm, h: function (x) { return m * x + b; } }; },
      stem: function (s) { return 'A function ' + t(s.nm) + ' has a constant rate of change, and ' + t(s.nm + '(' + s.a1 + ')=' + s.h(s.a1)) + ' and ' + t(s.nm + '(' + s.a2 + ')=' + s.h(s.a2)) + '.'; }, parts: [
      { id: 'e7a', level: 'EMG', outcome: 'RF4', make: function (r, s) { var dy = s.h(s.a2) - s.h(s.a1), dx = s.a2 - s.a1; return B.number('(a) Determine the rate of change of ' + t(s.nm) + '.', s.m, numDiag(s.m, [{ v: dx / dy, code: 'rate-flip', hint: 'Change in output ÷ change in input.' }, { v: dy, code: 'value', hint: 'Divide by the change in ' + t('x') + ', ' + t(dx) + '.' }]), t('\\dfrac{' + s.h(s.a2) + '-' + s.h(s.a1) + '}{' + s.a2 + '-' + s.a1 + '}=\\dfrac{' + dy + '}{' + dx + '}=' + s.m), ['Change in output ÷ change in input.'], 'EP rate from two values'); } },
      { id: 'e7b', sub: 'b i', level: 'PRG', outcome: 'RF8', make: function (r, s) { return B.number('(b) Determine ' + t(s.nm + '(0)') + '.', s.b, numDiag(s.b, [{ v: s.h(s.a1) + s.m * s.a1, code: 'sign', hint: 'Going from ' + t('x=' + s.a1) + ' back to ' + t('x=0') + ' <b>subtracts</b> ' + t(s.a1) + ' steps of ' + t(s.m) + '.' }]), t(s.nm + '(0)=' + s.h(s.a1) + '-' + s.a1 + '(' + s.m + ')=' + s.b), ['Step back from ' + t('x=' + s.a1) + ' to ' + t('x=0') + '.'], 'EP h(0)', { before: t(s.nm + '(0)=') }); } },
      { id: 'e7c', sub: 'b ii', level: 'PRG', outcome: 'RF8', make: function (r, s) { var rhs = lin([[s.m, 'x'], [s.b, '']]); return convPart('fn', 'Use it to write a rule for ' + t(s.nm + '(x)') + '.', { T: P(rhs), v: 'x', name: s.nm, reqName: true, keyRhs: rhs, wrong: [{ is: P(lin([[s.m, 'x'], [s.h(s.a1), '']])), code: 'diag', hint: 'The constant is ' + t(s.nm + '(0)') + ', not ' + t(s.nm + '(' + s.a1 + ')') + '.' }] }, t(s.nm + '(x)=' + rhs) + ' (rate ' + t(s.m) + ', starting value ' + t(s.nm + '(0)=' + s.b) + ').', ['Rate × ' + t('x') + ' + value at 0.'], 'EP rule from values'); } },
      { id: 'e7d', sub: 'c', level: 'EMG', outcome: 'RF8', make: function (r, s) { return B.number('(c) Determine ' + t(s.nm + '(' + s.x9 + ')') + '.', s.h(s.x9), null, t(s.nm + '(' + s.x9 + ')=' + s.m + '(' + s.x9 + ')' + (s.b < 0 ? '' : '+') + s.b + '=' + s.h(s.x9)), ['Substitute into the rule.'], 'EP h(9)', { before: t(s.nm + '(' + s.x9 + ')=') }); } },
      { id: 'e7e', sub: 'd', level: 'EMG', outcome: 'RF8', make: function (r, s) { var x = (s.y - s.b) / s.m; return B.number('(d) Solve ' + t(s.nm + '(x)=' + s.y) + '.', x, function (u) { return same(u, s.h(s.y)) ? { code: 'ev-instead', hint: 'Solve ' + t(lin([[s.m, 'x'], [s.b, '']]) + '=' + s.y) + '.' } : null; }, t(lin([[s.m, 'x'], [s.b, '']]) + '=' + s.y + '\\Rightarrow ' + s.m + 'x=' + (s.y - s.b) + '\\Rightarrow x=' + x), ['Set the rule equal to ' + t(s.y) + '.'], 'EP solve h=b', { before: t('x=') }); } }] },
    /* ---------------- Extra 8: D/R in different notations ---------------- */
    { num: '8', section: 'Extra practice C — Domain, range and intercepts', shared: function (r) {
        var xs = [r.int(-7, -4), r.int(-3, 0), r.int(1, 4), r.int(5, 9)], y1 = r.int(-2, 4), y2 = y1 + r.int(2, 6), ys = r.chance(0.5) ? [y1, y2, y1, y2] : [y2, y1, y1, y2];
        var A = [r.int(-5, -2), r.int(-4, -1)], d = pick(r, [5, 6, 4]), Bq = [A[0] + d, A[1] + d];
        return { P: xs.map(function (x, i) { return [x, ys[i]]; }), A: A, B: Bq, fare: pick(r, [12, 12, 10, 15, 8, 20, 25]), cap: pick(r, [240, 240, 200, 300, 150, 180]) };
      }, stem: 'State the domain and the range of each relation, using the notation that fits it.', parts: [
      { id: 'e8a', level: 'EMG', outcome: 'RF2', make: function (r, s) { var D = s.P.map(function (q) { return q[0]; }), R = s.P.map(function (q) { return q[1]; }); return drY('(a) ' + s.P.map(function (q) { return t(ptT(q)); }).join(', '), D, R, t('D=' + lst(D)) + ', ' + t('R=' + lst(R)), ['Separate points: list values in braces.'], 'EP D/R list', { disc: true }); } },
      { id: 'e8b', level: 'PRG', outcome: 'RF2', make: function (r, s) {
        var fig0 = '<div class="fig">' + HW.graph({ x: [-6, 6], y: [-6, 6], grid: 1, labels: 2, xName: 'x', yName: 'y', max: 240, segs: [{ pts: [s.A, s.B], start: 'closed', end: 'open' }], aria: 'segment with an open end' }) + '</div>';
        var Dt = '\\{x\\mid ' + s.A[0] + '\\le x<' + s.B[0] + ',\\ x\\in\\mathbb{R}\\}', Rt = '\\{y\\mid ' + s.A[1] + '\\le y<' + s.B[1] + ',\\ y\\in\\mathbb{R}\\}', Dk = s.A[0] + '\\le x<' + s.B[0], Rk = s.A[1] + '\\le y<' + s.B[1];
        var p = BF('(b) The segment below.' + fig0, [{ label: 'Domain', name: 'Domain', mode: 'math', keys: 'set', vars: ['x', 'y'] }, { label: 'Range', name: 'Range', mode: 'math', keys: 'set', vars: ['x', 'y'] }], [K.set(Dt, { v: 'x', tag: false }), K.set(Rt, { v: 'y', tag: false })], [Dk, Rk], t('D:\\ ' + Dk) + '<br>' + t('R:\\ ' + Rk),
          'Solid dot at ' + t(ptT(s.A)) + ' (included, ' + t('\\le') + '); open circle at ' + t(ptT(s.B)) + ' (not included, ' + t('<') + '):<br>' + t('D:\\ ' + Dk) + '<br>' + t('R:\\ ' + Rk), ['An open circle means that end is not included: use ' + t('<') + '.'], 'EP D/R open end');
        p.good = [['[' + s.A[0] + ', ' + s.B[0] + ')', '[' + s.A[1] + ', ' + s.B[1] + ')'], [Dt, Rt]]; p.bad = [[bld('x', s.A[0], s.B[0]), bld('y', s.A[1], s.B[1])]]; return p;
      } },
      { id: 'e8c', level: 'EMG', outcome: 'RF2', make: function (r, s) {
        var b = pick(r, [-2, -2, -1, 1, 2, 0]), m0 = pick(r, [0.5, 0.5, -0.5, 1, -1, 2, -2]), xe = Math.min(4.6, (5.5 - Math.abs(b)) / Math.abs(m0)), fig0 = '<div class="fig">' + HW.graph({ x: [-6, 6], y: [-6, 6], grid: 1, labels: 2, xName: 'x', yName: 'y', max: 240, segs: [{ pts: [[-xe, b - m0 * xe], [xe, b + m0 * xe]], start: 'arrow', end: 'arrow' }], aria: 'a line with arrows' }) + '</div>';
        var p = BF('(c) The line below.' + fig0, [{ label: 'Domain', name: 'Domain', mode: 'math', keys: 'set', vars: ['x', 'y'] }, { label: 'Range', name: 'Range', mode: 'math', keys: 'set', vars: ['x', 'y'] }], [K.set('\\{x\\mid x\\in\\mathbb{R}\\}', { v: 'x' }), K.set('\\{y\\mid y\\in\\mathbb{R}\\}', { v: 'y' })], ['\\text{all real numbers}', '\\text{all real numbers}'], 'all real numbers (both)', 'Both arrows continue forever: D: <b>all real numbers</b>, R: <b>all real numbers</b>.', ['Arrows mean the line keeps going.'], 'EP D/R arrows');
        p.good = [['\\mathbb{R}', '\\mathbb{R}'], ['\\{x\\mid x\\in\\mathbb{R}\\}', '\\{y\\mid y\\in\\mathbb{R}\\}']]; return p;
      } },
      { id: 'e8d', sub: 'd i', level: 'PRG', outcome: 'RF2', make: function (r, s) { return B.fields('(d) A ferry sells tickets at ' + t('\\$' + s.fare) + ' each and carries at most ' + t(s.cap) + ' passengers, so the ticket revenue from ' + t('p') + ' passengers is ' + t('C(p)=' + s.fare + 'p') + '. State the smallest and largest values in the domain and in the range.', [box('Domain, smallest:', 'passengers'), box('Domain, largest:', 'passengers'), box('Range, smallest: $', ''), box('Range, largest: $', '')], [K.number(0), K.number(s.cap), K.number(0), K.number(s.fare * s.cap)], ['0', String(s.cap), '0', String(s.fare * s.cap)], 'D: ' + t('0') + ' to ' + t(s.cap) + ' passengers; R: ' + t('\\$0') + ' to ' + t('\\$' + F(s.fare * s.cap)), 'Passengers: ' + t('0') + ' to ' + t(s.cap) + ' (whole numbers only). Revenue: ' + t('C(0)=0') + ' to ' + t('C(' + s.cap + ')=' + F(s.fare * s.cap)) + ' dollars, in steps of ' + t('\\$' + s.fare) + '.', ['Domain: 0 to the most passengers. Range: revenue at both ends.'], 'EP ferry D/R'); } },
      { id: 'e8e', sub: 'd ii', level: 'BEG', outcome: 'RF2', make: function (r, s) { return mc(r, 'The ferry’s domain runs from ' + t('0') + ' to ' + t(s.cap) + ' passengers (tickets ' + t('\\$' + s.fare) + ' each). What kind of numbers must it contain?', [{ html: 'Whole numbers only: you can’t carry part of a passenger.', right: true }, { html: 'All real numbers from ' + t('0') + ' to ' + t(s.cap) + '.', why: 'Can the ferry carry 12.5 passengers?' }, { html: 'Multiples of ' + t(s.fare) + '.', why: 'That describes the revenue (range), not the number of passengers.' }, { html: 'Any number, including negatives.', why: 'A negative number of passengers is impossible.' }], 'Passengers are counted: the domain is the whole numbers from ' + t('0') + ' to ' + t(s.cap) + '. (The range is then the multiples of ' + t(s.fare) + ' from ' + t('0') + ' to ' + t(F(s.fare * s.cap)) + '.)', ['Can you have part of a passenger?'], 'EP whole numbers'); } },
      { id: 'e8f', sub: 'e', level: 'EMG', outcome: 'RF2', make: function (r, s) { return mc(r, '(e) Why is the domain in (a), ' + t(lst(s.P.map(function (q) { return q[0]; }))) + ', written with braces but the domain in (b), ' + t(s.A[0] + '\\le x<' + s.B[0]) + ', with an inequality, and what does the open circle in (b) change?', [{ html: '(a) is four separate points (discrete), so it is a list in braces; (b) is an unbroken segment (continuous), so it needs an inequality. The open circle means that end is not included: ' + t('<') + ' instead of ' + t('\\le') + '.', right: true }, { html: 'Braces are for negative numbers; inequalities for positive ones.', why: 'The notation depends on whether the graph is separate points or unbroken.' }, { html: 'Both could be written either way; the open circle changes nothing.', why: 'A segment has infinitely many values — it can’t be listed. And an open circle excludes its end.' }, { html: '(b) uses an inequality because it has an open circle.', why: 'Even with two solid ends, a segment needs an inequality.' }], '(a) discrete → list; (b) continuous → inequality, and the open circle at ' + t(ptT(s.B)) + ' excludes that end (' + t('<') + ').', ['Separate dots or a solid line?'], 'EP braces vs inequality'); } }] },
    /* ---------------- Extra 9: work backwards ---------------- */
    { num: '9', shared: function (r) { var a = r.int(-5, -2), b = r.int(1, 4), c = r.int(0, 2), d = c + r.int(2, 4); var xs = r.shuffle([-4, -3, -1, 0, 1, 3, 4]).slice(0, 3).sort(function (u, v) { return u - v; }); return { a: a, b: b, c: c, d: d, xs: xs, k: r.int(1, 5), k2: r.int(1, 5) }; },
      stem: function (s) { return '<b>Work backwards.</b> The domain is ' + t(bld('x', s.a, s.b)) + ' and the range is ' + t(bld('y', s.c, s.d)) + '.'; }, parts: [
      { id: 'e9a', level: 'MAS', outcome: 'RF2', make: function (r, s) { var inp = { x: [-6, 6], y: [-2, 7], grid: 1, labels: 2, xName: 'x', yName: 'y', max: 300, tools: ['line', 'ends', 'point'] }; var key = { pts: [], pieces: [{ v: [[s.a, s.c], [s.b, s.d]], s: 'closed', e: 'closed' }], join: 'none' }; var p = B.graph('(a) Draw one relation that has exactly this domain and range and <b>is</b> a function.', inp, K.graphRules({ domain: bld('x', s.a, s.b), range: bld('y', s.c, s.d), fn: true }), key, 'Many answers; the simplest is the segment from ' + t(ptT([s.a, s.c])) + ' to ' + t(ptT([s.b, s.d])) + ' with both endpoints solid.', ['A rising segment from the bottom-left corner of the box to the top-right corner works.'], 'EP draw function given D/R'); p.good = [{ pts: [], pieces: [{ v: [[s.a, s.d], [s.b, s.c]], s: 'closed', e: 'closed' }], join: 'none' }]; p.bad = [{ pts: [], pieces: [{ v: [[s.a, s.c], [s.b, s.d]], s: 'closed', e: 'open' }], join: 'none' }]; return p; } },
      { id: 'e9b', level: 'MAS', outcome: 'RF2', make: function (r, s) { var inp = { x: [-6, 6], y: [-2, 7], grid: 1, labels: 2, xName: 'x', yName: 'y', max: 300, tools: ['line', 'ends', 'point'] }; var key = { pts: [], pieces: [{ v: [[s.a, s.c], [s.b, s.d]], s: 'closed', e: 'closed' }, { v: [[s.a, s.d], [s.b, s.c]], s: 'closed', e: 'closed' }], join: 'none' }; var p = B.graph('(b) Draw one relation with the <b>same</b> domain and range that is <b>not</b> a function.', inp, K.graphRules({ domain: bld('x', s.a, s.b), range: bld('y', s.c, s.d), fn: false }), key, 'Many answers; e.g. the two segments ' + t(ptT([s.a, s.c])) + '–' + t(ptT([s.b, s.d])) + ' and ' + t(ptT([s.a, s.d])) + '–' + t(ptT([s.b, s.c])) + ', forming an X: same domain and range, but a vertical line through the crossing meets it twice.', ['Make some vertical line cross your drawing twice, e.g. draw an X.'], 'EP draw non-function given D/R'); p.bad = [{ pts: [], pieces: [{ v: [[s.a, s.c], [s.b, s.d]], s: 'closed', e: 'closed' }], join: 'none' }]; return p; } },
      { id: 'e9c', level: 'EMG', outcome: 'RF2', make: function (r, s) { var key = s.xs.map(function (x) { return [x, s.k]; }); var inp = { x: [-6, 6], y: [-2, 7], grid: 1, labels: 2, xName: 'x', yName: 'y', max: 300, mode: 'points' }; var p = B.graph('(c) Now draw the relation with ' + t('D=' + lst(s.xs)) + ' and ' + t('R=\\{' + s.k + '\\}') + '.', inp, K.graphExact(pts(key)), pts(key), 'The three points ' + key.map(function (q) { return t(ptT(q)); }).join(', ') + ' — and nothing else.', ['Each input must pair with the only output, ' + t(s.k) + '.'], 'EP points from D/R'); p.bad = [pts(key.slice(0, 2)), pts(key.map(function (q) { return [q[1], q[0]]; }))]; return p; } },
      { id: 'e9d', level: 'PRG', outcome: 'RF2', make: function (r, s) { return mc(r, '(d) Why can part (c) be drawn only one way, while parts (a) and (b) have infinitely many correct answers?', [{ html: 'In (c) the domain and range are short lists: each of the three ' + t('x') + '-values must pair with the only ' + t('y') + '-value, so the picture is forced. In (a) and (b) the domain is a whole interval, and infinitely many different graphs cross it while reaching every height in the range.', right: true }, { html: 'Because (c) has fewer numbers in it.', why: 'It is about lists versus intervals, and how many ways the values can be paired.' }, { html: 'Because (c) is a function and (a) is not.', why: '(a) is a function too.' }, { html: 'Parts (a) and (b) also have only one answer.', why: 'Try another shape in (a): a falling segment works too.' }], 'Lists force the points; intervals leave room for many shapes.', ['How many ways can three inputs pair with one output?'], 'EP forced vs many'); } },
      { id: 'e9e', level: 'EMG', outcome: 'RF2', make: function (r, s) { return mc(r, '(e) Could a relation have domain ' + t(bld('x', s.a, s.b)) + ' and range ' + t('\\{' + s.k2 + '\\}') + ' and be a function?', [{ html: '<b>Yes:</b> the horizontal segment from ' + t(ptT([s.a, s.k2])) + ' to ' + t(ptT([s.b, s.k2])) + '. Every input has exactly one output, and the only output is ' + t(s.k2) + '.', right: true }, { html: '<b>No:</b> a function can’t have only one output value.', why: 'Many inputs can share one output — a horizontal line is a function.' }, { html: '<b>No:</b> it would be a vertical line.', why: 'One output for many inputs is a <b>horizontal</b> line.' }, { html: '<b>Yes:</b> the vertical segment ' + t('x=' + s.k2) + '.', why: 'A vertical segment has one input, not a whole interval of inputs — and it isn’t a function.' }], 'Yes: the horizontal segment ' + t('y=' + s.k2) + ' for ' + t(cond('x', s.a, s.b)) + '.', ['What graph has the same output for every input?'], 'EP constant function'); } }] },
    /* ---------------- Extra 10: water cooler ---------------- */
    { num: '10', shared: function (r) { var V0 = pick(r, [24, 24, 20, 18, 30, 16, 36, 40, 12, 32, 28]), rr = pick(r, [3, 3, 2, 4, 5, 6, 8].filter(function (x) { return V0 % x === 0 && V0 / x >= 4 && V0 / x <= 12; })), Te = V0 / rr, x5 = r.int(1, Te - 1), x6 = r.int(1, Te - 1); return { V0: V0, rr: rr, Te: Te, x5: x5, x6: x6, f: function (x) { return V0 - rr * x; } }; },
      stem: function (s) { return 'A water cooler holds ' + t(s.V0) + ' L at the start of a shift and empties at a steady rate. The amount left, in litres, after ' + t('x') + ' hours is ' + t('f(x)=' + s.V0 + '-' + s.rr + 'x') + '.'; }, parts: [
      { id: 'e10a', sub: 'a i', level: 'EMG', outcome: 'RF5', make: function (r, s) { return B.number('(a) Determine the ' + t('x') + '-intercept algebraically (give the ' + t('x') + '-value).', s.Te, numDiag(s.Te, [{ v: s.V0, code: 'xint-yint', hint: 'That is the ' + t('y') + '-intercept. Set ' + t('f(x)=0') + '.' }, { v: s.rr / s.V0, code: 'nr-flip', hint: 'Divide the other way.' }]), t(s.V0 + '-' + s.rr + 'x=0\\Rightarrow x=' + s.Te) + ': the cooler is empty ' + t(s.Te) + ' hours into the shift.', ['Set the amount left to 0.'], 'EP cooler x-int', { before: t('x=') }); } },
      { id: 'e10b', sub: 'a ii', level: 'EMG', outcome: 'RF5', make: function (r, s) { return meaning(r, 'What does the ' + t('x') + '-intercept mean?', 'The cooler is empty ' + t(s.Te) + ' hours into the shift.', [{ html: 'The cooler holds ' + t(s.Te) + ' L at the start.', why: 'At the ' + t('x') + '-intercept the amount is ' + t('0') + '.' }, { html: 'The cooler loses ' + t(s.Te) + ' L per hour.', why: 'The rate is ' + t(s.rr) + ' L/h.' }, { html: 'The shift starts at hour ' + t(s.Te) + '.', why: 'The shift starts at ' + t('x=0') + '.' }], 'At ' + t(ptT([s.Te, 0])) + ' the amount left is 0: empty after ' + t(s.Te) + ' h.', ['Output 0 means empty.'], 'EP cooler meaning x-int'); } },
      { id: 'e10c', sub: 'b', level: 'BEG', outcome: 'RF5', make: function (r, s) { return meaning(r, '(b) What is the ' + t('y') + '-intercept, and what does it mean?', t(ptT([0, s.V0])) + ': the cooler holds ' + t(s.V0) + ' L at the start of the shift.', [{ html: t(ptT([s.Te, 0])) + ': the cooler is empty after ' + t(s.Te) + ' h.', why: 'That is the ' + t('x') + '-intercept.' }, { html: t(ptT([0, s.rr])) + ': the cooler loses ' + t(s.rr) + ' L each hour.', why: 'The ' + t('y') + '-intercept is the output at ' + t('x=0') + '.' }, { html: t(ptT([s.V0, 0])) + ': the shift lasts ' + t(s.V0) + ' hours.', why: 'A ' + t('y') + '-intercept has ' + t('x=0') + '.' }], t('f(0)=' + s.V0) + ': the starting amount.', ['Input 0.'], 'EP cooler y-int'); } },
      { id: 'e10d', sub: 'c', level: 'EMG', outcome: 'RF8', make: function (r, s) { var y = s.f(s.x6); return B.fields('(c) Determine ' + t('f(' + s.x5 + ')') + ' and solve ' + t('f(x)=' + y) + '.', [box(t('f(' + s.x5 + ')='), 'L'), box('Solution: ' + t('x='), 'h')], [K.number(s.f(s.x5)), K.number(s.x6, numDiag(s.x6, [{ v: s.f(y), code: 'ev-instead', hint: t(y) + ' is the amount (output): solve ' + t(s.V0 + '-' + s.rr + 'x=' + y) + '.' }]))], [String(s.f(s.x5)), String(s.x6)], t('f(' + s.x5 + ')=' + s.f(s.x5)) + '; ' + t('x=' + s.x6), t('f(' + s.x5 + ')=' + s.V0 + '-' + s.rr + '(' + s.x5 + ')=' + s.f(s.x5)) + ' L. ' + t(s.V0 + '-' + s.rr + 'x=' + y + '\\Rightarrow x=' + s.x6) + ' h.', ['Evaluate, then solve.'], 'EP cooler evaluate/solve'); } },
      { id: 'e10e', sub: 'd', level: 'EMG', outcome: 'RF2', make: function (r, s) { return drPart('(d) State the domain and range of ' + t('f') + ' in this context, using set notation.', { dv: 'x', fname: 'f', D: [0, s.Te], R: [0, s.V0] }, drSol('x', 'f', [0, s.Te], [0, s.V0]), ['From the start of the shift until empty.'], 'EP cooler D/R'); } },
      { id: 'e10f', sub: 'e', level: 'PRG', outcome: 'RF2', make: function (r, s) { return mc(r, '(e) A student says “the domain is all real numbers, because the rule ' + t(s.V0 + '-' + s.rr + 'x') + ' works for any ' + t('x') + '.” Which response is correct?', [{ html: 'The rule is only a model of a real cooler: e.g. ' + t('x=-2') + ' is before the shift began, and ' + t('x=' + (s.Te + 2)) + ' gives ' + t('f(' + (s.Te + 2) + ')=' + s.f(s.Te + 2)) + ' L, a negative volume.', right: true }, { html: 'The student is right: you can substitute any number.', why: 'The algebra works, but the situation doesn’t: negative times, negative volumes.' }, { html: 'The domain should be ' + t('0\\le x\\le ' + s.V0) + ', because the cooler holds ' + t(s.V0) + ' L.', why: t(s.V0) + ' is a volume; the domain is time until empty, ' + t(s.Te) + ' h.' }, { html: 'Only negative values must be removed.', why: 'Times after the cooler is empty must be removed too.' }], 'Before the shift and after the cooler is empty, the rule describes nothing: e.g. ' + t('x=-2') + ' and ' + t('x=' + (s.Te + 2)) + ' (negative volume).', ['Try a value after the cooler is empty.'], 'EP cooler domain error'); } },
      { id: 'e10g', sub: 'f', level: 'EMG', outcome: 'RF1', make: function (r, s) {
        var ym = Math.ceil((s.V0 + 4) / 4) * 4, I = padIn({ x: [0, s.Te + 2], y: [0, ym], sx: 1, sy: 2, gy: 2, lx: 2, ly: 4, v: 'x', w: 'f(x)', xTitle: 'x (h)', yTitle: 'f(x) (L)' });
        var Sk = segSketch({ f: s.f, X0: 0, X1: s.Te, sx: 1, sy: 2, name: 'f', v: 'x', endX: 'The cooler is empty at ' + t('x=' + s.Te) + ': end the segment there.', arrow: 'The model stops when the cooler is empty: use a solid dot, not an arrow.' });
        var p = B.graph('(f) Sketch the graph of ' + t('f') + ' over its context domain. (The range can then be read off its two endpoints.)' + LINE_HELP, I, Sk.check, Sk.key, 'A straight segment from ' + t(ptT([0, s.V0])) + ' down to ' + t(ptT([s.Te, 0])) + ', solid dots at both ends. It never rises above its left end or falls below its right end, so the range is exactly ' + t(cond('f(x)', 0, s.V0)) + '.', ['Plot the two ends: ' + t('f(0)') + ' and the ' + t('x') + '-intercept.'], 'EP cooler sketch');
        p.bad = [drawing([seg([0, s.V0], [s.Te + 2, s.f(s.Te + 2) < 0 ? 0 : s.f(s.Te + 2)], 'closed', 'arrow')]), drawing([seg([0, 0], [s.Te, s.V0])])]; return p;
      } }] },
    /* ---------------- Extra 11: error analysis ---------------- */
    { num: '11', section: 'Extra practice D — Reasoning and error analysis', stem: 'Each statement contains one error. Give the correct answer.', parts: [
      { id: 'e11a', level: 'BEG', outcome: 'RF2', make: function (r) { var neg = r.chance(0.7), b = (neg ? -1 : 1) * r.int(1, 9), onY = r.chance(0.6), p = onY ? [0, b] : [b, 0], Qc = neg ? 'III' : 'I', Qo = neg ? 'IV' : 'II'; return mc(r, '(a) “The point ' + t(ptT(p)) + ' is in Quadrant ' + Qc + ', because its ' + (onY ? t('y') : t('x')) + '-coordinate is ' + (neg ? 'negative' : 'positive') + '.” Where is the point really?', [{ html: 'On the ' + (onY ? t('y') : t('x')) + '-axis — not in any quadrant (one coordinate is ' + t('0') + ').', right: true }, { html: 'Quadrant ' + Qo, why: 'Quadrants need both coordinates non-zero.' }, { html: 'Quadrant ' + Qc + ' — the statement is correct.', why: 'One coordinate is ' + t('0') + '.' }, { html: 'At the origin', why: 'Only ' + t('(0,\\ 0)') + ' is the origin.' }], 'A point with a ' + t('0') + ' coordinate lies on an axis: ' + t(ptT(p)) + ' is on the ' + (onY ? t('y') : t('x')) + '-axis.', ['Is either coordinate 0?'], 'EP error quadrant'); } },
      { id: 'e11b', level: 'BEG', outcome: 'RF2', make: function (r) { var y = r.int(-5, 9), x0 = r.int(-3, 3), P0 = [0, 1, 2].map(function (i) { return [x0 + i, y]; }); return mc(r, '(b) “The relation ' + P0.map(function (q) { return t(ptT(q)); }).join(', ') + ' is not a function, because the outputs repeat.” What is the correct answer?', [{ html: 'It <b>is</b> a function: repeated outputs are fine; only a repeated input with two different outputs breaks the rule.', right: true }, { html: 'It is not a function: all outputs are the same.', why: 'Each input has one output — that is all a function needs.' }, { html: 'It is not a relation.', why: 'Any set of ordered pairs is a relation.' }, { html: 'It is a function only if the outputs are different.', why: 'That is the wrong way round.' }], 'Each input ' + t(P0.map(function (q) { return q[0]; }).join(',\\ ')) + ' has one output: a function.', ['What does a function restrict?'], 'EP error repeated outputs'); } },
      { id: 'e11c', level: 'BEG', outcome: 'RF8', make: function (r) { var a = pick(r, [2, 2, 3, 4, 5]), b = pick(r, [7, 7, 1, 3, 5, 9]), x = pick(r, [3, 3, 2, 4, 5]); return B.number('(c) “For ' + t('f(x)=' + a + 'x+' + b) + ', the expression ' + t('f(' + x + ')') + ' means ' + t('f') + ' multiplied by ' + t(x) + '.” Determine the correct value of ' + t('f(' + x + ')') + '.', a * x + b, null, t('f(' + x + ')') + ' means substitute ' + t(x) + ' for ' + t('x') + ': ' + t(a + '(' + x + ')+' + b + '=' + (a * x + b)) + '. The symbol ' + t('f') + ' is a name, not a number.', ['Substitute.'], 'EP error f(3)', { before: t('f(' + x + ')=') }); } },
      { id: 'e11d', level: 'EMG', outcome: 'RF2', make: function (r) { var A = [r.int(-5, -1), r.int(-5, 0)], Bq = [r.int(2, 6), r.int(1, 6)]; var p = B.set('(d) “The graph is a solid line segment from ' + t(ptT(A)) + ' to ' + t(ptT(Bq)) + ', so the domain is ' + t(lst([A[0], Bq[0]])) + '.” Give the correct domain.', bld('x', A[0], Bq[0]), { v: 'x', wrong: [{ is: lst([A[0], Bq[0]]), code: 'set-discrete', hint: 'A solid segment contains every ' + t('x') + '-value in between.' }] }, 'A solid segment contains every ' + t('x') + ' in between: ' + t(bld('x', A[0], Bq[0])) + '. Braces would only fit two separate dots.', ['Does the segment include the values between the ends?'], 'EP error domain list'); p.good = [cond('x', A[0], Bq[0])]; return p; } },
      { id: 'e11e', level: 'EMG', outcome: 'RF5', make: function (r) { var a = pick(r, [4, 4, 2, 3, 5]), xi = pick(r, [5, 5, 2, 3, 4, 6]), b = a * xi; var p = B.math('(e) “The ' + t('x') + '-intercept of ' + t('y=' + a + 'x-' + b) + ' is ' + t(ptT([0, -b])) + '.” Give the correct ' + t('x') + '-intercept.', pointChk(xi, 0), ptT([xi, 0]), t(ptT([0, -b])) + ' is the ' + t('y') + '-intercept. The ' + t('x') + '-intercept has ' + t('y=0') + ': ' + t(a + 'x-' + b + '=0\\Rightarrow x=' + xi) + ', so ' + t(ptT([xi, 0])) + '.', ['Set ' + t('y=0') + '.'], 'EP error x-int', { keys: 'pairs', placeholder: 'e.g. (3, 0)' }); p.bad = ['(0,' + (-b) + ')']; return p; } },
      { id: 'e11f', level: 'BEG', outcome: 'RF1', make: function (r) { var a = r.int(2, 8), b = a + r.int(2, 6), who = pick(r, ['the runner', 'the runner', 'the cyclist', 'the walker']); return mc(r, '(f) “A distance–time graph is flat from ' + t(a) + ' to ' + t(b) + ' minutes, so ' + who + ' went backwards then.” What really happened?', [{ html: 'Flat means the distance is not changing: ' + who + ' stopped.', right: true }, { html: who.charAt(0).toUpperCase() + who.slice(1) + ' went backwards.', why: 'Going back would be a falling segment.' }, { html: who.charAt(0).toUpperCase() + who.slice(1) + ' moved at a constant speed.', why: 'On a <b>distance</b> graph constant speed is a straight sloped line.' }, { html: who.charAt(0).toUpperCase() + who.slice(1) + ' sped up.', why: 'Speeding up would make the graph steeper.' }], 'Flat on a distance–time graph = no change in distance = stopped.', ['What does flat mean on a distance graph?'], 'EP error flat'); } }] },
    /* ---------------- Extra 12: true / false ---------------- */
    { num: '12', stem: 'State whether each statement is true or false.', parts: [
      { id: 'e12', level: 'PRG', outcome: 'RF2', make: function (r) {
        var a = r.int(1, 6), b = a + r.int(2, 5), c = r.int(2, 9), d = c + r.int(1, 4);
        var all = [['a', 'Every function is a relation.', 'T', 'A function is a relation with one extra condition.'], ['b', 'Every relation is a function.', 'F', 'E.g. ' + t('(1,\\ 2),\\ (1,\\ 5)') + ' is a relation but not a function.'], ['c', 'A graph can have two different ' + t('y') + '-intercepts and still be a function.', 'F', 'Two ' + t('y') + '-intercepts means the input ' + t('0') + ' has two outputs.'],
          ['d', 'A graph can have two different ' + t('x') + '-intercepts and still be a function.', 'T', 'Two inputs may share the output ' + t('0') + '.'], ['e', 'If ' + t('f(' + a + ')=' + c) + ' and ' + t('f(' + b + ')=' + c) + ', then the relation is not a function.', 'F', 'Two inputs sharing an output is fine.'], ['f', 'If ' + t('f(' + a + ')=' + c) + ' and ' + t('f(' + a + ')=' + d) + ', then the relation is not a function.', 'T', 'One input with two outputs.'],
          ['g', 'The domain of a relation drawn as five separate dots should be written with an inequality.', 'F', 'Separate dots: list the values in braces.'], ['h', 'On a distance–time graph, a steeper segment always means the object travelled farther in total.', 'F', 'Steepness is a rate (speed), not a total.']];
        var rows = r.shuffle(all), want = {}; rows.forEach(function (x) { want[x[0]] = x[2]; });
        return gridPart('True or false?', rows.map(function (x) { return { id: x[0], html: x[1] }; }), TF, want, function (row) { var x = all.filter(function (z) { return z[0] === row; })[0]; return { code: 'row', hint: x[3] }; },
          rows.map(function (x) { return x[1] + ' <b>' + (x[2] === 'T' ? 'True' : 'False') + '</b> — ' + x[3]; }).join('<br>'), ['A function restricts inputs: each input has exactly one output.'], 'EP true/false');
      } }] },
    /* ---------------- Extra 13 – 14: vertical and horizontal lines ---------------- */
    { num: '13', shared: function (r) { return { h: pick(r, [3, 3, -2, 4, 5, -4, 2, -3, 1, -1, 6, -5]), nm: pick(r, [['Mia', 'Jon'], ['Mia', 'Jon'], ['Ana', 'Ben'], ['Zoe', 'Kai']]) }; },
      stem: function (s) { return s.nm[0] + ' says the vertical line ' + t('x=' + s.h) + ' is a function “because it is a straight line, and straight lines are functions.” ' + s.nm[1] + ' says it is not.'; }, parts: [
      { id: 'e13a', level: 'EMG', outcome: 'RF2', make: function (r, s) { return mc(r, 'Who is right?', [{ html: s.nm[1] + ': every point on ' + t('x=' + s.h) + ' has the input ' + t(s.h) + ' with a different output, so one input has infinitely many outputs — it fails the vertical line test.', right: true }, { html: s.nm[0] + ': all straight lines are functions.', why: 'A vertical line is the exception: draw the vertical line test on it.' }, { html: 'Both: it depends on the window.', why: 'The definition doesn’t depend on a window.' }, { html: s.nm[1] + ': it has no ' + t('y') + '-intercept.', why: 'Right person, wrong reason. Many functions have no intercepts of some kind.' }], s.nm[1] + ' is right: ' + t('x=' + s.h) + ' pairs the one input ' + t(s.h) + ' with every ' + t('y') + '.', ['Apply the vertical line test.'], 'EP vertical line'); } },
      { id: 'e13b', level: 'PRG', outcome: 'RF2', make: function (r, s) { var p = drY('State the domain and range of ' + t('x=' + s.h) + '.', [s.h], [], '', [], 'EP D/R vertical', { disc: true }); var Dt = '\\{' + s.h + '\\}', Rt = '\\{y\\mid y\\in\\mathbb{R}\\}'; p.check = K.fields([K.set(Dt, { v: 'x', wrong: [{ is: '\\{x\\mid x\\in\\mathbb{R}\\}', code: 'set-swap', hint: 'Every point has ' + t('x=' + s.h) + ': the only input is ' + t(s.h) + '.' }] }), K.set(Rt, { v: 'y', wrong: [{ is: '\\{' + s.h + '\\}', code: 'set-swap', hint: 'The outputs are every real number.' }] })], { labels: ['Domain', 'Range'] }); p.key = [Dt, '\\text{all real numbers}']; p.answer = t('D=' + Dt) + '<br>R: all real numbers'; p.solution = 'Only one input, ' + t(s.h) + '; every real output: ' + t('D=\\{' + s.h + '\\}') + ', R: <b>all real numbers</b>.'; p.hints = ['What is the ' + t('x') + '-value of every point on the line?']; p.good = [['\\{' + s.h + '\\}', '\\mathbb{R}'], [Dt, Rt]]; p.bad = [[Rt.replace('y', 'x').replace('y', 'x'), Dt]]; return p; } }] },
    { num: '14', shared: function (r) { var a = r.int(-6, -1); return { k: pick(r, [3, 3, -2, 4, 5, -4, 2, -3, 1, -1, 6, -5]), a: a, b: a + r.int(3, 9) }; }, stem: function (s) { return 'Now consider the horizontal line ' + t('y=' + s.k) + ', which passes through ' + t(ptT([s.a, s.k])) + ' and ' + t(ptT([s.b, s.k])) + '.'; }, parts: [
      { id: 'e14a', level: 'EMG', outcome: 'RF2', make: function (r, s) { var Dt = '\\{x\\mid x\\in\\mathbb{R}\\}', Rt = '\\{' + s.k + '\\}'; var p = BF('Is it a function? State its domain and range. (It <b>is</b> a function: every input has the one output ' + t(s.k) + '.)', [{ label: 'Domain', name: 'Domain', mode: 'math', keys: 'set', vars: ['x', 'y'] }, { label: 'Range', name: 'Range', mode: 'math', keys: 'set', vars: ['x', 'y'] }], [K.set(Dt, { v: 'x', wrong: [{ is: Rt, code: 'set-swap', hint: 'Every real number is an allowed input.' }] }), K.set(Rt, { v: 'y', wrong: [{ is: '\\{y\\mid y\\in\\mathbb{R}\\}', code: 'set-swap', hint: 'Every point has ' + t('y=' + s.k) + '.' }] })], ['\\text{all real numbers}', Rt], 'D: all real numbers, ' + t('R=' + Rt), 'A function: no vertical line meets it twice. D: <b>all real numbers</b>, ' + t('R=\\{' + s.k + '\\}') + '.', ['Every input gives ' + t(s.k) + '.'], 'EP horizontal line D/R'); p.good = [['\\mathbb{R}', '\\{' + s.k + '\\}'], [Dt, Rt]]; return p; } },
      { id: 'e14b', level: 'PRG', outcome: 'RF2', make: function (r, s) { return mc(r, 'Why does swapping the roles of ' + t('x') + ' and ' + t('y') + ' (vertical vs horizontal line) change the answer so completely?', [{ html: 'The definition is not symmetric: it restricts what <b>inputs</b> may do and says nothing about outputs, so repeating a ' + t('y') + '-value is harmless while repeating an ' + t('x') + '-value with different outputs is fatal.', right: true }, { html: 'Because horizontal lines are always functions and vertical lines never are — that is the definition.', why: 'That describes the result, not the reason.' }, { html: 'Because ' + t('y') + ' is always bigger than ' + t('x') + '.', why: 'Size has nothing to do with it.' }, { html: 'It doesn’t: both are functions.', why: 'A vertical line fails the vertical line test.' }], 'A function allows each input only one output, but any number of inputs may share an output.', ['What does a function restrict?'], 'EP asymmetry'); } }] },
    /* ---------------- Extra 15: drone rental ---------------- */
    { num: '15', section: 'Extra practice E — Applications', shared: function (r) { var F0 = pick(r, [18, 18, 15, 20, 25, 12]), rr = pick(r, [7, 7, 5, 6, 8, 9]), H = pick(r, [6, 6, 5, 8, 4]), h1 = r.int(1, H - 1), h2 = r.int(1, H), over = H + pick(r, [2, 2, 1, 3]); var item = pick(r, ['drone', 'drone', 'kayak', 'e-bike', 'paddleboard']); return { F: F0, rr: rr, H: H, h1: h1, h2: h2, over: over, item: item, C: function (x) { return F0 + rr * x; } }; },
      stem: function (s) { return 'A ' + s.item + ' may be rented for at most ' + t(s.H) + ' hours. The cost, in dollars, of an ' + t('h') + '-hour rental is ' + t('C(h)=' + s.F + '+' + s.rr + 'h') + '.'; }, parts: [
      { id: 'e15a', sub: 'a i', level: 'BEG', outcome: 'RF8', make: function (r, s) { return B.number('(a) Determine ' + t('C(' + s.h1 + ')') + '.', s.C(s.h1), numDiag(s.C(s.h1), [{ v: s.rr * s.h1, code: 'no-fixed', hint: 'Add the ' + t('\\$' + s.F) + ' fee.' }]), t('C(' + s.h1 + ')=' + s.F + '+' + s.rr + '(' + s.h1 + ')=' + s.C(s.h1)), ['Substitute.'], 'EP rental C(h)', { before: t('\\$') }); } },
      { id: 'e15b', sub: 'a ii', level: 'EMG', outcome: 'RF8', make: function (r, s) { var v = s.C(s.h1); return meaning(r, 'What does ' + t('C(' + s.h1 + ')=' + v) + ' mean?', 'A ' + t(s.h1) + '-hour rental costs ' + t('\\$' + v) + ' in total.', [{ html: 'Each hour costs ' + t('\\$' + v) + '.', why: 'It is the total for ' + t(s.h1) + ' hours.' }, { html: 'A ' + t(v) + '-hour rental costs ' + t('\\$' + s.h1) + '.', why: 'Swapped.' }, { html: 'The fee for ' + t(s.h1) + ' hours, not counting the booking fee.', why: 'The rule includes the ' + t('\\$' + s.F) + ' booking fee.' }], 'Total cost of a ' + t(s.h1) + '-hour rental.', ['Input hours, output total cost.'], 'EP rental meaning'); } },
      { id: 'e15c', sub: 'b', level: 'EMG', outcome: 'RF8', make: function (r, s) { var y = s.C(s.h2); return B.number('(b) A customer is charged ' + t('\\$' + y) + '. Determine the length of the rental.', s.h2, numDiag(s.h2, [{ v: y / s.rr, code: 'no-fixed', hint: 'Subtract the booking fee first.' }]), t(s.F + '+' + s.rr + 'h=' + y + '\\Rightarrow ' + s.rr + 'h=' + (y - s.F) + '\\Rightarrow h=' + s.h2) + ' hours', ['Solve ' + t('C(h)=' + y) + '.'], 'EP rental solve', { after: 'hours' }); } },
      { id: 'e15d', sub: 'c', level: 'PRG', outcome: 'RF2', make: function (r, s) { var y = s.C(s.over); return mc(r, '(c) A customer claims to have been charged ' + t('\\$' + y) + '. Why is this impossible here?', [{ html: 'Solving ' + t(s.F + '+' + s.rr + 'h=' + y) + ' gives ' + t('h=' + s.over) + ', more than the ' + t(s.H) + '-hour maximum: outside the domain, so ' + t('\\$' + y) + ' is not a possible charge.', right: true }, { html: 'Because ' + t(y) + ' is not a multiple of ' + t(s.rr) + '.', why: 'Solve it: the answer is a whole number of hours — just too many.' }, { html: 'It is possible: a ' + t(s.over) + '-hour rental.', why: 'Rentals are at most ' + t(s.H) + ' hours.' }, { html: 'Because the booking fee is more than ' + t('\\$' + y) + '.', why: 'The fee is only ' + t('\\$' + s.F) + '.' }], t('h=' + s.over) + ' is beyond the maximum of ' + t(s.H) + ' hours, so no rental costs ' + t('\\$' + y) + '. The most possible is ' + t('C(' + s.H + ')=\\$' + s.C(s.H)) + '.', ['Solve, then compare with the maximum.'], 'EP rental impossible'); } },
      { id: 'e15e', sub: 'd', level: 'EMG', outcome: 'RF8', make: function (r, s) { return mc(r, '(d) Determine ' + t('C(0)') + ' and explain what it represents.', [{ html: t('C(0)=\\$' + s.F) + ': the booking fee, charged before any hours are used.', right: true }, { html: t('C(0)=\\$0') + ': no hours, no charge.', why: 'Substitute ' + t('h=0') + '.' }, { html: t('C(0)=\\$' + s.rr) + ': the hourly rate.', why: 'That is the rate, not the output at ' + t('h=0') + '.' }, { html: t('C(0)=\\$' + s.F) + ': the cost of the first hour.', why: 'At ' + t('h=0') + ' no time is used.' }], t('C(0)=' + s.F) + ': the fixed booking fee.', ['Substitute 0.'], 'EP rental C(0)'); } },
      { id: 'e15f', sub: 'e', level: 'PRG', outcome: 'RF2', make: function (r, s) { return drPart('(e) State the domain and range of ' + t('C') + ' in this context, using set notation.', { dv: 'h', fname: 'C', D: [0, s.H], R: [s.F, s.C(s.H)], rW: [{ is: bld('y', 0, s.C(s.H)), code: 'dr-from-zero', hint: 'The cost starts at the booking fee, ' + t('C(0)=' + s.F) + '.' }] }, drSol('h', 'C', [0, s.H], [s.F, s.C(s.H)]), ['0 to the maximum hours; cost at both ends.'], 'EP rental D/R'); } },
      { id: 'e15g', sub: 'f', level: 'EMG', outcome: 'RF5', make: function (r, s) { return mc(r, '(f) Why must the ' + t('y') + '-intercept of the graph of ' + t('C') + ' equal ' + t('C(0)') + ', and what is that number called here?', [{ html: 'The ' + t('y') + '-intercept is the value of ' + t('C') + ' when ' + t('h=0') + ' — exactly ' + t('C(0)') + '. Here it is the booking fee, ' + t('\\$' + s.F) + '.', right: true }, { html: 'Because the graph passes through the origin.', why: 'It starts at ' + t(ptT([0, s.F])) + '.' }, { html: 'It is the hourly rate.', why: 'The rate is the steepness.' }, { html: 'It is the maximum cost.', why: 'The maximum is at ' + t('h=' + s.H) + '.' }], 'Input 0 at the ' + t('y') + '-intercept: ' + t('C(0)=\\$' + s.F) + ', the booking fee.', ['What is the input at a ' + t('y') + '-intercept?'], 'EP rental y-int'); } }] },
    /* ---------------- Extra 16: phone plans ---------------- */
    { num: '16', shared: function (r) { for (var g = 0; g < 400; g++) { var A0 = pick(r, [30, 30, 20, 24, 36, 15]), a = pick(r, [0.05, 0.05, 0.1, 0.04]), b = pick(r, [0.20, 0.20, 0.25, 0.15, 0.3]), ms = A0 / (b - a); if (b <= a || Math.abs(ms - Math.round(ms)) > 1e-9 || ms > 600 || ms < 60) continue; ms = Math.round(ms); var m1 = pick(r, [150, 150, 100, 50].filter(function (x) { return x < ms; })), m2 = pick(r, [300, 300, 400, 500].filter(function (x) { return x > ms; })); if (m1 == null || m2 == null) continue; return { A0: A0, a: a, b: b, ms: ms, m1: m1, m2: m2, A: function (m) { return cl(A0 + a * m); }, B: function (m) { return cl(b * m); } }; } },
      stem: function (s) { return 'Two phone plans charge for ' + t('m') + ' minutes of long distance: ' + t('A(m)=' + s.A0 + '+' + s.a + 'm') + ' and ' + t('B(m)=' + s.b + 'm') + ' (in dollars).'; }, parts: [
      { id: 'e16a', sub: 'a i', level: 'BEG', outcome: 'RF8', make: function (r, s) { return fieldsOf('(a) Determine ' + t('A(' + s.m1 + ')') + ' and ' + t('B(' + s.m1 + ')') + '.', [valItem(t('A(' + s.m1 + ')=\\$'), 'A(' + s.m1 + ')', s.A(s.m1)), valItem(t('B(' + s.m1 + ')=\\$'), 'B(' + s.m1 + ')', s.B(s.m1))], t('\\$' + money(s.A(s.m1))) + ', ' + t('\\$' + money(s.B(s.m1))), t('A(' + s.m1 + ')=' + s.A0 + '+' + s.a + '(' + s.m1 + ')=' + money(s.A(s.m1))) + '<br>' + t('B(' + s.m1 + ')=' + s.b + '(' + s.m1 + ')=' + money(s.B(s.m1))), ['Substitute.'], 'EP plans at m1'); } },
      { id: 'e16b', sub: 'a ii', level: 'BEG', outcome: 'RF8', make: function (r, s) { return cheaperMC(r, 'Which plan is cheaper for ' + t(s.m1) + ' minutes?', 'A', 'B', s.m1, s.A, s.B, s.a, s.A0, 'Plan B costs less at ' + t(s.m1) + ' minutes.', ['Compare the two costs.'], 'EP cheaper m1'); } },
      { id: 'e16c', sub: 'b', level: 'EMG', outcome: 'RF8', make: function (r, s) { return B.number('(b) Solve ' + t('A(m)=B(m)') + '. (At that number of minutes both plans cost the same.)', s.ms, numDiag(s.ms, [{ v: s.A0 / (s.a + s.b), code: 'conv-move-sign', hint: 'Subtract ' + t(s.a + 'm') + ' from both sides.' }]), t(s.A0 + '+' + s.a + 'm=' + s.b + 'm\\Rightarrow ' + s.A0 + '=' + cl(s.b - s.a) + 'm\\Rightarrow m=' + s.ms) + ' minutes: both plans cost ' + t('\\$' + money(s.B(s.ms))) + ' — the break-even point.', ['Set the two rules equal.'], 'EP plans equal', { before: t('m='), after: 'min' }); } },
      { id: 'e16d', sub: 'c', level: 'EMG', outcome: 'RF8', make: function (r, s) { return cheaperMC(r, '(c) Which plan is cheaper for ' + t(s.m2) + ' minutes? Justify using function notation.', 'A', 'B', s.m2, s.A, s.B, s.a, s.A0, t('A(' + s.m2 + ')=\\$' + money(s.A(s.m2))) + ' < ' + t('B(' + s.m2 + ')=\\$' + money(s.B(s.m2))) + ': plan A.', ['Evaluate both at ' + t(s.m2) + '.'], 'EP cheaper m2'); } },
      { id: 'e16e', sub: 'd', level: 'EMG', outcome: 'RF2', make: function (r, s) { var p = B.set('(d) State the domain of each function in this context.', '\\{m\\mid m\\ge 0,\\ m\\in\\mathbb{R}\\}', { v: 'm', tag: false, wrong: [{ is: '\\{m\\mid m\\in\\mathbb{R}\\}', code: 'dr-context', hint: 'You can’t talk for a negative number of minutes.' }] }, t('m\\ge 0') + ' for both: you can’t talk for a negative number of minutes.', ['Can minutes be negative?'], 'EP plans domain'); return ineqKey(p, 'm\\ge 0', ['\\{m\\mid m\\ge 0,\\ m\\in\\mathbb{R}\\}', '[0,\\infty)']); } },
      { id: 'e16f', sub: 'e', level: 'ADV', outcome: 'RF5', make: function (r, s) {
        var X = s.ms, Y = s.B(s.ms);
        var fl = [box('Xmin:', ''), box('Xmax:', ''), box('Ymin:', ''), box('Ymax:', '')];
        var chk = function (resp) {
          resp = resp || []; var v = resp.map(function (z) { return numVal(z); }); if (v.some(function (z) { return z == null; })) return form('incomplete', 'Fill in all four window values.');
          if (!(v[0] < v[1]) || !(v[2] < v[3])) return form('unreadable', 'Each minimum must be less than its maximum.');
          if (X < v[0] || X > v[1]) return wrong('u5l12-window', 'The plans cross at ' + t('m=' + X) + ': your ' + t('x') + '-range ' + t('[' + v[0] + ',\\ ' + v[1] + ']') + ' doesn’t include it.');
          if (Y < v[2] || Y > v[3]) return wrong('u5l12-window', 'At the crossing both cost ' + t('\\$' + money(Y)) + ': your ' + t('y') + '-range ' + t('[' + v[2] + ',\\ ' + v[3] + ']') + ' doesn’t include it.');
          if (v[1] - v[0] > 20 * X || v[3] - v[2] > 20 * Math.max(Y, s.A0)) return wrong('u5l12-window', 'That window is so wide the crossing would be squeezed into a tiny corner. Choose ranges a little bigger than the crossing point.');
          if (s.A0 > v[3] || s.A0 < v[2]) return form('u5l12-window', 'It works, but plan A starts at ' + t('\\$' + s.A0) + ' — include ' + t(s.A0) + ' in your ' + t('y') + '-range so both lines show from the start.');
          return ok();
        };
        var k = [0, Math.ceil(X * 2 / 100) * 100, 0, Math.ceil(Y * 2 / 10) * 10];
        var p = { prompt: '(e) You want to graph both plans on a calculator and see the point where they cross. State a window that would show it clearly. (The standard window ' + t('x:[-10,\\ 10]') + ', ' + t('y:[-10,\\ 10]') + ' would not.)', input: { type: 'fields', fields: fl }, check: chk, key: k.map(String), answer: 'e.g. ' + t('x:[' + k[0] + ',\\ ' + k[1] + ']') + ', ' + t('y:[' + k[2] + ',\\ ' + k[3] + ']'),
          solution: 'The plans cross at ' + t('(' + X + ',\\ ' + money(Y) + ')') + ', far outside the standard window (plan A already costs ' + t('\\$' + s.A0) + ' at ' + t('m=0') + '). Something like ' + t('x:[' + k[0] + ',\\ ' + k[1] + ']') + ', ' + t('y:[' + k[2] + ',\\ ' + k[3] + ']') + ' shows it clearly.', hints: ['Find the crossing point first (part (b)).', 'Pick ranges a bit larger than the crossing point, starting at 0.'], text: 'EP calculator window' };
        p.good = [['0', String(2 * X), '0', String(Math.ceil(2 * Y))]]; p.bad = [['-10', '10', '-10', '10'], ['0', String(X - 10), '0', String(2 * Y)]]; return p;
      } },
      { id: 'e16g', sub: 'f', level: 'PRG', outcome: 'RF1', make: function (r, s) { return mc(r, '(f) Without calculating, why must plan B be cheaper for few minutes and plan A for many minutes?', [{ html: 'B starts at ' + t('\\$0') + ' and A at ' + t('\\$' + s.A0) + ', so B wins at first; but B charges more per minute (' + t(s.b) + ' vs ' + t(s.a) + '), so its cost climbs faster and eventually overtakes A’s head start.', right: true }, { html: 'Because A has a fee, so A is always more expensive.', why: 'B’s higher rate catches up eventually.' }, { html: 'Because B is a function and A is not.', why: 'Both are functions.' }, { html: 'Because long calls are free on plan A.', why: 'A still charges ' + t(s.a) + ' per minute.' }], 'Start values decide small ' + t('m') + '; rates decide large ' + t('m') + '.', ['Compare the starting values and the rates.'], 'EP why switch'); } }] },
    /* ---------------- Extra 17: parking lot ---------------- */
    { num: '17', shared: function (r) { for (var g = 0; g < 400; g++) { var t1 = pick(r, [2, 2, 1, 3]), N = pick(r, [160, 160, 120, 200, 240]), hold = pick(r, [3, 3, 2, 4]), t3 = pick(r, [4, 4, 3, 5, 6]), st = pick(r, [7, 7, 6, 8]); if ((N / t1) % 1 || (N / t3) % 1 || t1 + hold + t3 > 11 || N / t1 <= N / t3) continue; return { t1: t1, N: N, hold: hold, t3: t3, st: st, T: t1 + hold + t3, V: [[0, 0], [t1, N], [t1 + hold, N], [t1 + hold + t3, 0]] }; } },
      stem: function (s) { return 'The graph shows ' + t('N(t)') + ', the number of cars in a parking lot, ' + t('t') + ' hours after ' + clk(s.st) + '.<div class="fig">' + HW.graph({ x: [0, s.T + 1], y: [0, s.N + 20], grid: 1, gridY: 20, labelsX: 1, labelsY: 40, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 't (h)', yTitle: 'Cars, N(t)', unitX: 300 / (s.T + 1), unitY: 200 / (s.N + 20), max: 360, segs: [{ pts: s.V }], aria: 'cars in the lot' }) + '</div>'; }, parts: [
      { id: 'e17a', level: 'BEG', outcome: 'RF8', make: function (r, s) { var x = s.t1 + 1; return B.number('(a) Determine ' + t('N(' + x + ')') + '. (At that time the lot is full and has been for a while.)', s.N, null, t('N(' + x + ')=' + s.N) + ' cars: the lot is full — the graph is flat at its maximum.', ['Read up from ' + t(x) + '.'], 'EP N(t)', { after: 'cars' }); } },
      { id: 'e17b', level: 'EMG', outcome: 'RF1', make: function (r, s) { var u = s.N / s.t1, d = -s.N / s.t3; return B.fields('(b) Determine the rate of change on each of the three segments (cars per hour).', [box('First:', 'cars/h'), box('Second:', 'cars/h'), box('Third:', 'cars/h')], [K.number(u, numDiag(u, rateCands(s.N, s.t1, u))), K.number(0), K.number(d, numDiag(d, rateCands(-s.N, s.t3, d)))], [dn(u), '0', dn(d)], t('+' + dn(u)) + ', ' + t('0') + ', ' + t(dn(d)), t('\\frac{' + s.N + '}{' + s.t1 + '}=' + dn(u)) + '; flat: ' + t('0') + '; ' + t('\\frac{-' + s.N + '}{' + s.t3 + '}=' + dn(d)) + ' cars/h. The first is steepest — the morning rush, when the lot fills fastest.', ['Change in cars ÷ change in hours.'], 'EP lot rates'); } },
      { id: 'e17c', level: 'EMG', outcome: 'RF8', make: function (r, s) { var y = s.N / 2, a = s.t1 / 2, b = s.t1 + s.hold + s.t3 / 2; return solvePart('(c) Solve ' + t('N(t)=' + y) + '.', [a, b], { v: 't', b: y, graph: true }, t('t=' + dn(a)) + ' (filling) and ' + t('t=' + dn(b)) + ' (emptying): the graph rises to ' + t(s.N) + ' and comes back down, so it passes ' + t(y) + ' twice.', ['Read across at ' + t(y) + '.'], 'EP lot solve'); } },
      { id: 'e17d', level: 'EMG', outcome: 'RF5', make: function (r, s) { return mc(r, '(d) What are the ' + t('t') + '-intercepts, their clock times, and their meaning?', [{ html: t('t=0') + ' (' + clk(s.st) + ') and ' + t('t=' + s.T) + ' (' + clk(s.st + s.T) + '): the lot is empty before the day starts and empty again once everyone has left.', right: true }, { html: t('t=0') + ' and ' + t('t=' + s.T) + ': the lot is full.', why: 'At a ' + t('t') + '-intercept there are ' + t('0') + ' cars.' }, { html: t('t=' + s.t1) + ' and ' + t('t=' + (s.t1 + s.hold)) + ': the lot is empty.', why: 'Those are where the flat part starts and ends.' }, { html: t('t=0') + ' (' + clk(s.st) + ') and ' + t('t=' + s.T) + ' (' + clk(s.st + s.T - 1) + ')', why: 'Add ' + t(s.T) + ' hours to ' + clk(s.st) + '.' }], 'Zero cars at ' + t('t=0') + ' (' + clk(s.st) + ') and ' + t('t=' + s.T) + ' (' + clk(s.st + s.T) + ').', ['Where are there 0 cars?'], 'EP lot intercepts'); } },
      { id: 'e17e', level: 'EMG', outcome: 'RF2', make: function (r, s) { return drPart('(e) State the domain and range of ' + t('N') + ', using set notation.', { dv: 't', fname: 'N', D: [0, s.T], R: [0, s.N] }, drSol('t', 'N', [0, s.T], [0, s.N]), ['Left to right, bottom to top.'], 'EP lot D/R'); } }] },
    /* ---------------- Extra 18: challenge segment ---------------- */
    { num: '18', section: 'Extra practice F — Challenge', shared: function (r) { for (var g = 0; g < 400; g++) { var m = pick(r, [-1, -1, -2, 1, 2]), b = pick(r, [3, 3, 2, 1, -1, 4]), L = pick(r, [-6, -6, -4, -5, -3]), U = pick(r, [6, 6, 4, 5, 3]); var y1 = m * L + b, y2 = m * U + b; if (Math.max(Math.abs(y1), Math.abs(y2)) > 14 || -b / m < L || -b / m > U || !Number.isInteger(-b / m)) continue; var lo = Math.min(y1, y2), hi = Math.max(y1, y2), x2 = pick(r, [-2, -2, 1, 2, -1].filter(function (x) { return x > L && x < U; })), y7 = pick(r, [7, 7, 5, 6, -2, 0].filter(function (y) { return y > lo && y < hi && Number.isInteger((y - b) / m); })), out = m < 0 ? m * (L - 3) + b : m * (U + 3) + b; if (y7 == null) continue; return { m: m, b: b, L: L, U: U, A: [L, y1], B: [U, y2], lo: lo, hi: hi, x2: x2, y7: y7, out: out, g: function (x) { return m * x + b; } }; } },
      stem: function (s) { return 'The graph of a function ' + t('g') + ' is a single straight segment joining ' + t(ptT(s.A)) + ' to ' + t(ptT(s.B)) + ', with both endpoints included.'; }, parts: [
      { id: 'e18a', level: 'ADV', outcome: 'RF4', make: function (r, s) { var rhs = lin([[s.m, 'x'], [s.b, '']]); return convPart('fn', '(a) Determine the rate of change, then write a rule for ' + t('g(x)') + '.', { T: P(rhs), v: 'x', name: 'g', reqName: true, keyRhs: rhs, good: ['g(x)=' + lin([[s.b, ''], [s.m, 'x']])], wrong: [{ is: P(lin([[-s.m, 'x'], [s.b, '']])), code: 'sign', hint: 'Check the sign of the rate: is the segment rising or falling?' }] }, 'Rate ' + t('=\\dfrac{' + s.B[1] + '-' + (s.A[1] < 0 ? '(' + s.A[1] + ')' : s.A[1]) + '}{' + s.U + '-(' + s.L + ')}=' + s.m) + '; ' + t('g(0)=' + s.b) + ', so ' + t('g(x)=' + rhs) + '. (Check: ' + t('g(' + s.L + ')=' + s.A[1]) + ', ' + t('g(' + s.U + ')=' + s.B[1]) + '.)', ['Rate = change in ' + t('y') + ' ÷ change in ' + t('x') + '.', 'Find ' + t('g(0)') + ' by stepping from an endpoint.'], 'EP rule from segment'); } },
      { id: 'e18b', level: 'EMG', outcome: 'RF5', make: function (r, s) { var xi = -s.b / s.m; return B.fields('(b) State the ' + t('x') + '-intercept and the ' + t('y') + '-intercept as ordered pairs.', [{ label: t('x') + '-intercept:', name: 'x-intercept', mode: 'math', keys: 'pairs', placeholder: 'e.g. (3, 0)' }, { label: t('y') + '-intercept:', name: 'y-intercept', mode: 'math', keys: 'pairs', placeholder: 'e.g. (0, 3)' }], [pointChk(xi, 0), pointChk(0, s.b)], [ptT([xi, 0]), ptT([0, s.b])], t(ptT([xi, 0])) + ', ' + t(ptT([0, s.b])), t('g(x)=0\\Rightarrow x=' + xi) + '; ' + t('g(0)=' + s.b) + '.', ['Set ' + t('g(x)=0') + '; find ' + t('g(0)') + '.'], 'EP segment intercepts'); } },
      { id: 'e18c', level: 'EMG', outcome: 'RF2', make: function (r, s) { return drPart('(c) State the domain and range, using set notation.', { dv: 'x', fname: 'g', D: [s.L, s.U], R: [s.lo, s.hi] }, drSol('x', 'g', [s.L, s.U], [s.lo, s.hi]), ['Use the endpoints.'], 'EP segment D/R'); } },
      { id: 'e18d', level: 'EMG', outcome: 'RF8', make: function (r, s) { var x7 = (s.y7 - s.b) / s.m; return B.fields('(d) Determine ' + t('g(' + s.x2 + ')') + ', then solve ' + t('g(x)=' + s.y7) + '.', [box(t('g(' + s.x2 + ')='), ''), box(t('x='), '')], [K.number(s.g(s.x2)), K.number(x7, numDiag(x7, [{ v: s.g(s.y7), code: 'ev-instead', hint: 'Solve ' + t('g(x)=' + s.y7) + '.' }]))], [String(s.g(s.x2)), String(x7)], t('g(' + s.x2 + ')=' + s.g(s.x2)) + '; ' + t('x=' + x7), t('g(' + s.x2 + ')=' + s.g(s.x2)) + '; ' + t(lin([[s.m, 'x'], [s.b, '']]) + '=' + s.y7 + '\\Rightarrow x=' + x7), ['Use your rule.'], 'EP segment eval/solve'); } },
      { id: 'e18e', level: 'PRG', outcome: 'RF2', make: function (r, s) { var xo = (s.out - s.b) / s.m; return mc(r, '(e) Solving ' + t('g(x)=' + s.out) + ' with the rule gives ' + t('x=' + xo) + '. Why is ' + t(s.out) + ' nevertheless <b>not</b> in the range of ' + t('g') + '?', [{ html: 'The rule extends forever, but the graph stops at ' + t('x=' + (xo < s.L ? s.L : s.U)) + '. ' + t('x=' + xo) + ' is outside the domain, so no allowed input gives ' + t(s.out) + ' — the outputs only go from ' + t(s.lo) + ' to ' + t(s.hi) + '.', right: true }, { html: 'Because the algebra was done wrong.', why: 'Check: ' + t('g(' + xo + ')') + ' with the rule is ' + t(s.out) + '. The input is the problem.' }, { html: 'It is in the range: ' + t('g(' + xo + ')=' + s.out) + '.', why: t(xo) + ' is not an allowed input.' }, { html: 'Because ' + t(s.out) + ' is ' + (s.out < 0 ? 'negative' : 'too big') + '.', why: 'The range is set by the endpoints of the graph.' }], 'The range is ' + t(cond('y', s.lo, s.hi)) + ': ' + t(s.out) + ' would need ' + t('x=' + xo) + ', outside the domain ' + t(cond('x', s.L, s.U)) + '.', ['Is ' + t('x=' + xo) + ' in the domain?'], 'EP outside range'); } },
      { id: 'e18f', level: 'MAS', outcome: 'RF2', make: function (r, s) {
        var inR = function (v) { return v >= s.lo - 1e-9 && v <= s.hi + 1e-9; }, inD = function (v) { return v >= s.L - 1e-9 && v <= s.U + 1e-9; };
        var c1 = function (resp) { var v = numVal(resp); if (v == null) return form('unreadable', 'Type one number.'); if (!inR(v)) return wrong('u5l12-not-range', t(v) + ' is not in the range ' + t(cond('y', s.lo, s.hi)) + '.'); if (inD(v)) return wrong('u5l12-in-domain', t(v) + ' is in the range, but it is also in the domain ' + t(cond('x', s.L, s.U)) + '. Pick a range value outside it.'); return ok(); };
        var c2 = function (resp) { var v = numVal(resp); if (v == null) return form('unreadable', 'Type one number.'); if (!inR(v) || !inD(v)) return wrong('u5l12-not-both', t(v) + ' must be in both ' + t(cond('x', s.L, s.U)) + ' and ' + t(cond('y', s.lo, s.hi)) + '.'); return ok(); };
        var cand = []; for (var v = Math.ceil(s.lo); v <= s.hi; v++) if (!inD(v)) cand.push(v);
        if (!cand.length) return mc(r, '(f) Is there a value in the range of ' + t('g') + ' that is not in its domain?', [{ html: 'No: the range ' + t(cond('y', s.lo, s.hi)) + ' lies inside the domain ' + t(cond('x', s.L, s.U)) + '.', right: true }, { html: 'Yes: ' + t(s.hi) + '.', why: t(s.hi) + ' is also in the domain.' }, { html: 'Yes: ' + t(s.lo) + '.', why: t(s.lo) + ' is also in the domain.' }], 'Compare the two intervals.', ['Compare the intervals.'], 'EP range vs domain');
        var both = Math.max(s.lo, s.L) <= Math.min(s.hi, s.U) ? Math.ceil(Math.max(s.lo, s.L)) : null;
        var p = B.fields('(f) Give one value that <b>is</b> in the range of ' + t('g') + ' but <b>not</b> in its domain, and one value that is in both.', [box('In the range, not the domain:', ''), box('In both:', '')], [c1, c2], [String(cand[0]), String(both)], 'e.g. ' + t(cand[0]) + '; ' + t(both), 'Domain ' + t(cond('x', s.L, s.U)) + ', range ' + t(cond('y', s.lo, s.hi)) + '. A range value outside the domain, e.g. ' + t(cand[0]) + '; a value in both, e.g. ' + t(both) + '.', ['Write both intervals and compare them.'], 'EP range not domain');
        p.good = [[String(cand[cand.length - 1]), String(Math.floor(Math.min(s.hi, s.U)))]]; p.bad = [[String(both), String(cand[0])]]; return p;
      } }] },
    /* ---------------- Extra 19: candle club ---------------- */
    { num: '19', shared: function (r) { var pr = pick(r, [6, 6, 5, 8, 4]), be = pick(r, [15, 15, 10, 12, 20]), cost = pr * be, mx = pick(r, [40, 40, 50, 30]), n1 = pick(r, [25, 25, 20, 30, 28].filter(function (x) { return x <= mx && x > be + 2 && pr * (x - be) !== x; })) || mx, goal = pr * pick(r, [35, 35, 30, 25, 40].filter(function (x) { return x <= mx && x > be + 1 && x !== n1; })) - cost; var club = pick(r, ['candle-making club', 'candle-making club', 'bake-sale team', 'craft club']); return { pr: pr, cost: cost, mx: mx, n1: n1, goal: goal, club: club, P: function (n) { return pr * n - cost; } }; },
      stem: function (s) { return 'A ' + s.club + ' can make at most ' + t(s.mx) + ' items. Its profit, in dollars, from selling ' + t('n') + ' items is ' + t('P(n)=' + s.pr + 'n-' + s.cost) + '.'; }, parts: [
      { id: 'e19a', sub: 'a i', level: 'BEG', outcome: 'RF8', make: function (r, s) { return B.number('(a) Determine ' + t('P(' + s.n1 + ')') + '.', s.P(s.n1), null, t('P(' + s.n1 + ')=' + s.pr + '(' + s.n1 + ')-' + s.cost + '=' + s.P(s.n1)), ['Substitute.'], 'EP P(n1)', { before: t('\\$') }); } },
      { id: 'e19b', sub: 'a ii', level: 'EMG', outcome: 'RF8', make: function (r, s) { var v = s.P(s.n1); return meaning(r, 'What does ' + t('P(' + s.n1 + ')=' + v) + ' mean?', 'Selling ' + t(s.n1) + ' items gives a profit of ' + t('\\$' + v) + '.', [{ html: 'Selling ' + t(v) + ' items gives a profit of ' + t('\\$' + s.n1) + '.', why: 'Swapped.' }, { html: 'Each item earns ' + t('\\$' + v) + '.', why: 'Each earns ' + t('\\$' + s.pr) + '; ' + t(v) + ' is the total profit.' }, { html: 'The club takes in ' + t('\\$' + v) + ' before costs.', why: 'Profit is after the costs are subtracted.' }], 'Input ' + t(s.n1) + ' items, output ' + t('\\$' + v) + ' profit.', ['Input items, output profit.'], 'EP meaning P'); } },
      { id: 'e19c', sub: 'b i', level: 'EMG', outcome: 'RF5', make: function (r, s) { var z = s.cost / s.pr; return B.number('(b) Determine the ' + t('n') + '-intercept (give the ' + t('n') + '-value).', z, numDiag(z, [{ v: -s.cost, code: 'xint-yint', hint: 'That is the vertical intercept. Set ' + t('P(n)=0') + '.' }]), t(s.pr + 'n-' + s.cost + '=0\\Rightarrow n=' + z), ['Set the profit to 0.'], 'EP n-int', { before: t('n=') }); } },
      { id: 'e19d', sub: 'b ii', level: 'EMG', outcome: 'RF5', make: function (r, s) { var z = s.cost / s.pr; return meaning(r, 'What does the ' + t('n') + '-intercept mean for the club?', 'Selling ' + t(z) + ' items breaks even: no profit and no loss.', [{ html: 'The club makes its biggest profit at ' + t(z) + ' items.', why: 'At the intercept the profit is ' + t('0') + '.' }, { html: 'The club must sell ' + t(z) + ' items each day.', why: 'Profit 0 means breaking even.' }, { html: 'The supplies cost ' + t('\\$' + z) + '.', why: 'Supplies cost ' + t('\\$' + s.cost) + '.' }], 'At ' + t('n=' + z) + ' profit is 0: break-even.', ['Profit 0 means…?'], 'EP break-even'); } },
      { id: 'e19e', sub: 'c', level: 'EMG', outcome: 'RF8', make: function (r, s) { return mc(r, '(c) Determine ' + t('P(0)') + ' and explain what it represents.', [{ html: t('P(0)=-\\$' + s.cost) + ': with nothing sold the club is ' + t('\\$' + s.cost) + ' down — the cost of its supplies.', right: true }, { html: t('P(0)=\\$0') + ': no sales, no profit or loss.', why: 'Substitute: ' + t(s.pr + '(0)-' + s.cost) + '.' }, { html: t('P(0)=\\$' + s.cost) + ': the club’s savings.', why: 'Check the sign.' }, { html: t('P(0)=\\$' + s.pr) + ': the price of one item.', why: 'That is the rate.' }], t('P(0)=-' + s.cost) + ': a loss equal to the supply cost.', ['Substitute 0.'], 'EP P(0)'); } },
      { id: 'e19f', sub: 'd', level: 'EMG', outcome: 'RF8', make: function (r, s) { var n = (s.goal + s.cost) / s.pr; return B.number('(d) How many items must be sold for a profit of ' + t('\\$' + s.goal) + '?', n, numDiag(n, [{ v: s.goal / s.pr, code: 'no-fixed', hint: 'Add the ' + t(s.cost) + ' first.' }]), t(s.pr + 'n-' + s.cost + '=' + s.goal + '\\Rightarrow ' + s.pr + 'n=' + (s.goal + s.cost) + '\\Rightarrow n=' + n) + ' (within the limit of ' + t(s.mx) + ').', ['Solve ' + t('P(n)=' + s.goal) + '.'], 'EP solve P', { after: 'items' }); } },
      { id: 'e19g', sub: 'e', level: 'PRG', outcome: 'RF2', make: function (r, s) { return B.fields('(e) The domain is the whole numbers from ' + t('0') + ' to ' + t(s.mx) + ' (items are sold whole). State the least and the greatest value in the range.', [box('Least: $', ''), box('Greatest: $', '')], [K.number(-s.cost, numDiag(-s.cost, [{ v: 0, code: 'dr-from-zero', hint: 'With 0 items sold the profit is negative: ' + t('P(0)') + '.' }])), K.number(s.P(s.mx))], [String(-s.cost), String(s.P(s.mx))], t(-s.cost) + ' and ' + t(s.P(s.mx)), 'Least: ' + t('P(0)=-' + s.cost) + '; greatest: ' + t('P(' + s.mx + ')=' + s.P(s.mx)) + '. (Domain: whole numbers, because a value such as 12.5 items has no meaning.)', ['Evaluate at both ends of the domain.'], 'EP range ends'); } },
      { id: 'e19h', sub: 'f', level: 'PRG', outcome: 'RF1', make: function (r, s) { return mc(r, '(f) The graph of ' + t('P') + ' is not a solid line. What does it look like, and why is the rule still useful?', [{ html: t(s.mx + 1) + ' separate dots, one for each whole number of items from ' + t('0') + ' to ' + t(s.mx) + ', rising in steps of ' + t('\\$' + s.pr) + '. The rule still gives the height of every dot, so the club can answer questions without listing them all.', right: true }, { html: 'A solid line from ' + t('(0,\\ -' + s.cost + ')') + ' to ' + t('(' + s.mx + ',\\ ' + s.P(s.mx) + ')') + '.', why: 'Only whole numbers of items make sense: dots, not a line.' }, { html: 'A staircase of flat steps.', why: 'Each whole number has one value: a dot, with nothing in between.' }, { html: 'Dots, so the rule is useless.', why: 'The rule gives every dot’s height.' }], 'Discrete dots; the rule still computes each one.', ['Which inputs are allowed?'], 'EP discrete profit'); } }] }
  ]; }

  function clk(h) { h = ((h % 24) + 24) % 24; var hr = h % 12 === 0 ? 12 : h % 12; return hr + ' ' + (h < 12 ? 'am' : 'pm'); }
})(window);
