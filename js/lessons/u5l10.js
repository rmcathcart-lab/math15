/* Math 15 · Unit 5 · Lesson 10 — Function Notation: Graphs, Conversions, and Real-World Models (RF8; intercept parts
 * RF5, domain/range parts RF2, sketches of the models RF1)
 * Assignment 10, questions 1–15 (u5_L10.tex) and the Lesson 10 Extra Practice (u5_EP10.tex, questions 1–16).
 * Built on the Math 10C Unit 5 Lesson 7 practice (same topic, same engine): conversions typed as whole equations on a
 * small keypad with = and ( ) (the left side is checked for y vs f(x), the function's name and the letter in the
 * brackets; the right side by K.poly); statements such as d(2) = 4 are typed and read back (name, input, output);
 * "solve f(x) = b" answers are solution lists with a "none" key; domain/range use the set keypad (a range may be written
 * with q(x), as the booklet does, or with y); the models' graphs are sketched on the graph pad as one segment over the
 * realistic domain with solid end dots (js/draw.js). Explain / interpret questions are multiple choice whose options are
 * reasons, with a hint for each wrong reason. Every part is a generator that keeps the booklet question's structure
 * (a V-shaped graph whose end heights repeat, a segment drawn on a limited domain, a model with a starting value and a
 * natural end, two price plans that cross once) and changes the numbers; the booklet's own numbers are among the
 * possible values. Levels (calibrated for Math 15): LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, S = HW.sets, PL = HW.poly;

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
    var base = K.set(Ry, { v: 'y', other: o.other, otherName: 'domain', wrong: wr });
    var fx = fname + '(' + dv + ')';
    return function (resp) {
      var r = base(toY(resp, fname, dv));
      if (r.v === 'form' && r.code === 'set-letter') return form('set-letter', 'Right set — but the range is a set of <b>outputs</b>: write it with ' + t(fx) + ' (or ' + t('y') + '), e.g. ' + t('\\{' + fx + '\\mid \\ldots\\}') + '.');
      if (r.v === 'form' && r.code === 'set-tag') return form('set-tag', 'Right — now finish the set notation with ' + t(',\\ ' + fx + '\\in\\mathbb{R}') + '.');
      if (r.v === 'wrong' && o.ctx && o.ctx[r.code]) return wrong(r.code, o.ctx[r.code]);
      return r;
    };
  }
  function domChk(D, dv, other, o) {
    o = o || {};
    var T = S.parse(D).set;
    var wr = (o.wrong || []).filter(function (w) { var q = S.parse(w.is); return q.ok && !S.eq(q.set, T); });
    var base = K.set(D, { v: dv, other: other, otherName: 'range', wrong: wr });
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
    var fl = [{ label: 'Domain', name: 'Domain', mode: 'math', keys: 'set', vars: [dv, fname], placeholder: 'e.g. {' + dv + ' | -2 <= ' + dv + ' <= 5, ' + dv + ' in R}' },
      { label: 'Range', name: 'Range', mode: 'math', keys: 'set', vars: [dv, fname], placeholder: 'e.g. {' + fx + ' | 1 <= ' + fx + ' <= 4, ' + fx + ' in R}' }];
    var p = BF(prompt, fl, [cD, cR], [Dt, Rshow], t('D=' + Dt) + '<br>' + t('R=' + Rshow), sol, hints, text);
    p.good = o.disc ? [] : [[ivAlt(Dt), ivAlt(Ry)], [cond(dv, o.D[0], o.D[1]), cond(fx, o.R[0], o.R[1])], [Dt, Ry]];
    p.bad = [[Ry, Dt]].concat((o.dW || []).map(function (w) { return [w.is, Rshow]; })).concat((o.rW || []).map(function (w) { return [Dt, w.is]; })).filter(function (b) { return !(S.eq(S.parse(b[0]).set, S.parse(Dt).set) && S.eq(S.parse(toY(b[1], fname, dv)).set, S.parse(Ry).set)); });
    return p;
  }
  function drSol(dv, fname, D, R) { return t(bld(dv, D[0], D[1])) + '<br>' + t('\\{' + fname + '(' + dv + ')\\mid ' + cond(fname + '(' + dv + ')', R[0], R[1]) + ',\\ ' + fname + '(' + dv + ')\\in\\mathbb{R}\\}'); }

  /* ---------------- small builders ---------------- */
  function phFix(fl) {
    fl.forEach(function (f) { if (f.mode === 'math' && !f.placeholder) f.placeholder = f.keys === EQK ? 'e.g. f(2) = 5' : f.keys === 'fraction' ? 'e.g. 7 or 10/3' : f.keys === 'solutions' ? 'e.g. 5' : f.keys === 'set' ? 'e.g. {x | 0 <= x <= 5, x in R}' : ''; });
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

  /* ================= shared generators ================= */
  /* Q4: a V (or upside-down V) drawn between two endpoints at the same height */
  function vShared(r, fam) {
    var c = r.pick(fam), s = c[0], w = c[1], k = c[2], fl = r.chance(0.25) ? -1 : 1;
    var hs = [0, 0, -1, 1].filter(function (h) { return Math.abs(h) + w <= 6; }), h = r.pick(hs);
    var V = [[h - w, fl * (k + s * w)], [h, fl * k], [h + w, fl * (k + s * w)]];
    var lo = pwMin(V), hi = pwMax(V);
    var Wx = Math.max(5, Math.abs(h) + w + 1), Wy = Math.max(5, Math.abs(lo) + 1, Math.abs(hi) + 1);
    return { s: s, w: w, k: fl * k, top: fl * (k + s * w), h: h, fl: fl, V: V, lo: lo, hi: hi, Wx: Wx, Wy: Wy };
  }
  /* V-graph levels: an end height (2 solutions), a middle height (2), the corner height (1) */
  function midLevel(sh) {
    var c = [];
    for (var y = Math.ceil(sh.lo) + 1; y < sh.hi; y++) { var xs = pwSols(sh.V, y); if (xs.length === 2 && xs.every(function (x) { return Math.abs(x - Math.round(x)) < 1e-9; })) c.push(y); }
    return c.indexOf(0) >= 0 ? 0 : c[0];
  }

  /* a part with its own sub-label (e.g. 'b ii') already shows that label, so its prompt drops a leading '(b) ' */
  function subLabels(def) {
    (def.questions || []).concat(def.extra || []).forEach(function (q) { q.parts.forEach(function (p) {
      if (!p.sub) return; var mk = p.make;
      p.make = function (r, sh) { var o = mk(r, sh); if (typeof o.prompt === 'string') o.prompt = o.prompt.replace(/^\([a-z]\)\s*/, ''); return o; };
    }); });
    return def;
  }

  HW.defineLesson(subLabels({
    id: 'u5l10', unit: 5, num: '10', title: 'Function Notation: Graphs, Conversions, and Real-World Models', outcome: 'RF8',
    blurb: 'Switching between y = … and f(x) = …, reading f(a) and solving f(x) = b from graphs and tables, and using function notation for real-world models and their limits.',
    questions: [
      /* ---------------- Q1 ---------------- */
      { num: '1', section: 'Part A — Converting between notations', stem: 'Write each function notation equation as an equation in ' + t('x') + ' and ' + t('y') + '.', parts: [
        { id: '1a', level: 'BEG', make: function (r) {
          var nm = r.pick(['f', 'f', 'g', 'h']), a = r.pick([6, 6, 2, 3, 4, 5, 7, 8, 9]), b = r.pick([7, 7, 1, 2, 3, 4, 5, 8, 9, 11]), rhs = lin([[a, 'x'], [-b, '']]);
          return convPart('xy', '(a) ' + t(nm + '(x)=' + rhs), { T: P(rhs), v: 'x', keyRhs: rhs, bad: [nm + '(x)=' + rhs] },
            'Replace ' + t(nm + '(x)') + ' with ' + t('y') + '. The rule on the right does not change:<br>' + t('y=' + rhs),
            [t(nm + '(x)') + ' plays exactly the role of ' + t('y') + ': swap one for the other and leave the right side alone.'], nm + '(x)=' + rhs + ' to y=');
        } },
        { id: '1b', level: 'BEG', make: function (r) {
          var nm = r.pick(['g', 'g', 'h', 'k']), c = r.pick([12, 12, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15]), neg = r.chance(0.3), rhs = lin([[1, 'x'], [neg ? -c : c, '']]);
          return convPart('xy', '(b) ' + t(nm + '(x)=' + rhs), { T: P(rhs), v: 'x', keyRhs: rhs, bad: [nm + '(x)=' + rhs] },
            'Replace ' + t(nm + '(x)') + ' with ' + t('y') + ':<br>' + t('y=' + rhs),
            ['The name of the function (' + t(nm) + ') disappears; ' + t(nm + '(x)') + ' becomes ' + t('y') + '.'], nm + '(x)=' + rhs + ' to y=');
        } },
        { id: '1c', level: 'EMG', make: function (r) {
          var nm = r.pick(['Q', 'Q', 'P', 'H', 'A']), v = r.pick(['t', 't', 'n', 'w']), a = r.int(2, 9), c = r.pick([1, 1, 2, 3, 4, 6, 8, 9]), rhs = lin([[a, v], [-c, '']]);
          return convPart('xy', '(c) ' + t(nm + '(' + v + ')=' + rhs), { T: P(rhs), v: v, keyRhs: rhs, vars: ['x'], bad: ['y=' + lin([[a, 'x'], [-c, '']]), nm + '(' + v + ')=' + rhs] },
            'Replace ' + t(nm + '(' + v + ')') + ' with ' + t('y') + '. The input stays ' + t(v) + ' — only the output’s name changes:<br>' + t('y=' + rhs),
            ['Only the output changes its name. Which letter is the input here?', 'The input letter is ' + t(v) + ' — it stays ' + t(v) + ' in the equation.'], nm + '(' + v + ') to y=');
        } }] },
      /* ---------------- Q2 ---------------- */
      { num: '2', stem: 'Write each equation in function notation.', parts: [
        { id: '2a', level: 'BEG', make: function (r) {
          var a = r.int(2, 9), b = r.pick([9, 9, 1, 3, 4, 5, 7, 11, 13]), rhs = lin([[a, 'x'], [b, '']]);
          return convPart('fn', '(a) ' + t('y=' + rhs), { T: P(rhs), v: 'x', name: 'f', keyRhs: rhs, good: ['g(x)=' + rhs], bad: ['y=' + rhs, 'f(y)=' + rhs] },
            'Replace ' + t('y') + ' with a function name and the input in brackets, ' + t('f(x)') + ':<br>' + t('f(x)=' + rhs),
            ['Swap ' + t('y') + ' for ' + t('f(x)') + '. The right side stays the same.'], 'y=' + rhs + ' to f(x)');
        } },
        { id: '2b', level: 'BEG', make: function (r) {
          var c = r.pick([15, 15, 8, 9, 10, 12, 20]), a = r.pick([4, 4, 2, 3, 5, 6]), rhs = lin([[c, ''], [-a, 'x']]);
          return convPart('fn', '(b) ' + t('y=' + rhs), { T: P(rhs), v: 'x', name: 'f', keyRhs: rhs, good: ['f(x)=' + lin([[-a, 'x'], [c, '']])], bad: ['y=' + rhs, 'f(x)=' + lin([[a, 'x'], [-c, '']])] },
            'Replace ' + t('y') + ' with ' + t('f(x)') + ':<br>' + t('f(x)=' + rhs) + '<br>(The order of the terms on the right doesn’t matter: ' + t(lin([[-a, 'x'], [c, '']])) + ' is the same rule.)',
            ['Swap ' + t('y') + ' for ' + t('f(x)') + ' and copy the right side exactly — signs included.'], 'y=' + rhs + ' to f(x)');
        } },
        { id: '2c', level: 'EMG', make: function (r) {
          var nm = r.pick(['g', 'g', 'h', 'P']), v = r.pick(['w', 'w', 't', 'n']), c = r.pick([3, 3, 1, 2, 4, 5, 6, 8]), a = r.pick([1, 1, 1, 2, 3]), rhs = lin([[a, v], [r.chance(0.7) ? -c : c, '']]);
          return convPart('fn', '(c) ' + t('y=' + rhs) + ' (name the function ' + t(nm) + ', with input ' + t(v) + ')', { T: P(rhs), v: v, name: nm, reqName: true, keyRhs: rhs, vars: ['x'], bad: [nm + '(x)=' + rhs, 'f(' + v + ')=' + rhs, 'y=' + rhs] },
            'The function is named ' + t(nm) + ' and its input is ' + t(v) + ', so ' + t('y') + ' becomes ' + t(nm + '(' + v + ')') + ':<br>' + t(nm + '(' + v + ')=' + rhs),
            ['Use the name the question gives, and put the input letter ' + t(v) + ' in the brackets.'], 'y=' + rhs + ' to ' + nm + '(' + v + ')');
        } }] },
      /* ---------------- Q3 ---------------- */
      { num: '3', stem: 'Express each equation in function notation.', parts: [
        { id: '3a', level: 'EMG', make: function (r) {
          var a = r.pick([1.5, 1.5, 0.5, 2.5, 1.25, 0.75, 3.5]), b = r.pick([4, 4, 1, 2, 3, 5, 6, 7]), nm = r.pick(['f', 'f', 'g', 'h']), rhs = lin([[a, 'x'], [b, '']]);
          return convPart('fn', '(a) The graph of the function defined by ' + t('y=' + nm + '(x)') + ' has equation ' + t('y=' + rhs) + '.', { T: P(rhs), v: 'x', name: nm, reqName: true, keyRhs: rhs, vars: ['f', 'g', 'h'].filter(function (c) { return c !== nm; }).slice(0, 1), bad: ['y=' + rhs].concat(nm !== 'f' ? ['f(x)=' + rhs] : ['g(x)=' + rhs]) },
            'The question says ' + t('y=' + nm + '(x)') + ', so replace ' + t('y') + ' with ' + t(nm + '(x)') + ':<br>' + t(nm + '(x)=' + rhs),
            [t('y=' + nm + '(x)') + ' tells you the function is called ' + t(nm) + ' and its input is ' + t('x') + '.'], 'y=' + rhs + ' with y=' + nm + '(x)');
        } },
        { id: '3b', level: 'EMG', make: function (r) {
          var a = r.pick([3, 3, 2, 4, 5, 6, 8]), b = r.pick([10, 10, 5, 6, 8, 12, 15, 20]), rhs = lin([[a, 'x'], [b, '']]), n0 = r.pick([4, 2, 3, 5]);
          return convPart('fn', '(b) The graph of the cost function defined by ' + t('y=C(x)') + ' has equation ' + t('y=' + rhs) + ' (cost in dollars, for ' + t('x') + ' items).', { T: P(rhs), v: 'x', name: 'C', reqName: true, keyRhs: rhs, vars: ['f'], bad: ['f(x)=' + rhs, 'y=' + rhs, 'C(y)=' + rhs] },
            t('y=C(x)') + ' names the cost function ' + t('C') + ', with input ' + t('x') + ':<br>' + t('C(x)=' + rhs) + '<br>For example, ' + t('C(' + n0 + ')=' + (a * n0 + b)) + ' means ' + t(n0) + ' items cost ' + t('\\$' + (a * n0 + b)) + '.',
            ['The function is named ' + t('C') + ' (for cost). Replace ' + t('y') + ' with ' + t('C(x)') + '.'], 'y=' + rhs + ' to C(x)');
        } }] },
      /* ---------------- Q4: a V-shaped graph ---------------- */
      { num: '4', section: 'Part B — Reading values from graphs and tables',
        shared: function (r) {
          var sh = vShared(r, [[2, 4, -4], [2, 4, -4], [2, 3, -3], [2, 3, -4], [1, 4, -2], [1, 5, -3], [2, 4, -5], [1, 6, -3], [1, 4, -3]]);
          var L = sh.V[0][0], Rr = sh.V[2][0], left = [], right = [];
          for (var x = L + 1; x < sh.h; x++) left.push(x); for (x = sh.h + 1; x < Rr; x++) right.push(x);
          var x1 = r.pick(left), x2 = r.pick(right.slice(0, Math.max(1, Math.ceil(right.length / 2)))), x3 = r.pick(right.filter(function (z) { return z !== x2; }).concat(right.length === 1 ? right : []));
          sh.xs = [x1, x2, x3]; sh.n = r.pick(['q', 'q', 'p', 'g', 'k']);
          sh.fig = pwGraph(sh.V, { x: [-sh.Wx, sh.Wx], y: [-sh.Wy, sh.Wy], labels: 2, yName: sh.n + '(x)', points: [{ x: sh.V[0][0], y: sh.V[0][1], label: 'A' }, { x: sh.V[2][0], y: sh.V[2][1], label: 'B' }], aria: 'V-shaped graph of ' + sh.n });
          sh.levels = [sh.top, midLevel(sh), sh.k];
          return sh;
        },
        stem: function (sh) { return 'The graph of a function ' + t(sh.n) + ' is shown.' + sh.fig; }, parts: [
        { id: '4a', level: 'BEG', make: function (r, sh) {
          var n = sh.n, items = sh.xs.map(function (x, i) {
            var val = pwAt(sh.V, x);
            return valItem(['i)', 'ii)', 'iii)'][i] + ' ' + t(n + '(' + x + ')='), n + '(' + x + ')', val, function (u) {
              if (pwSols(sh.V, x).some(function (z) { return same(z, u); }) && !same(u, val)) return { code: 'read-reverse', hint: t(n + '(' + x + ')') + ' gives you the <b>input</b> ' + t(x) + ': start at ' + t(x) + ' on the horizontal axis and read up or down to the graph.' };
              if (same(u, -val) && val !== 0) return { code: 'sign', hint: 'Check the sign: is the graph above or below the ' + t('x') + '-axis at ' + t('x=' + x) + '?' };
              return null;
            });
          });
          return fieldsOf('(a) Complete:', items, sh.xs.map(function (x) { return t(n + '(' + x + ')=' + pwAt(sh.V, x)); }).join(',\\ '),
            'Start on the horizontal axis at each input, move up or down to the graph, then read across:<br>' + sh.xs.map(function (x) { return t(n + '(' + x + ')=' + pwAt(sh.V, x)); }).join(', ') + '.',
            ['Find the input on the ' + t('x') + '-axis first, then go straight up or down to the V.', 'Each arm of the V changes by ' + t(sh.s) + ' for every ' + t('1') + ' across, so you can count from the corner.'], 'read ' + n + '(a) from V');
        } },
        { id: '4b', level: 'LIM', make: function (r, sh) {
          var pr = sh.xs.map(function (x) { return [x, pwAt(sh.V, x)]; });
          return B.pairs('(b) Write the ordered pairs associated with i), ii) and iii) — that is, the points for ' + sh.xs.map(function (x) { return t(sh.n + '(' + x + ')'); }).join(', ') + '.', pr, {},
            'In ' + t(sh.n + '(a)=b') + ' the input comes first: ' + pr.map(function (p) { return t(ptT(p)); }).join(', ') + '.', ['An ordered pair is (input, output) ' + t('=(x,\\ ' + sh.n + '(x))') + '.'], 'pairs from ' + sh.n + '(a)');
        } },
        { id: '4c', level: 'EMG', make: function (r, sh) {
          var bs = sh.levels, lab = ['i)', 'ii)', 'iii)'], n = sh.n;
          var fl = bs.map(function (b, i) { return solField(lab[i] + ' ' + t(n + '(x)=' + b) + ':', 'x'); });
          var ch = bs.map(function (b) { return solsChk(pwSols(sh.V, b), { b: b, graph: true }); });
          var keys = bs.map(function (b) { return solsKey(pwSols(sh.V, b)); });
          var p = BF('(c) State the value(s) of ' + t('x') + ' if', fl, ch, keys, bs.map(function (b, i) { return lab[i] + ' ' + t(solsKey(pwSols(sh.V, b))); }).join('<br>'),
            'A height can be met on <b>both</b> arms of the V, so watch for two answers. Start on the vertical axis and read <b>across</b>:<br>' + bs.map(function (b, i) { var s0 = pwSols(sh.V, b); return lab[i] + ' ' + t(n + '(x)=' + b) + ': ' + t(solsKey(s0)) + (i === 0 ? ' (points A and B)' : i === 2 ? ' only — the corner of the V' : ''); }).join('<br>'),
            [t(n + '(x)=b') + ' gives the <b>output</b>: start at ' + t('b') + ' on the vertical axis and read across to the graph.', 'There can be two answers — one on each arm of the V.'], 'solve ' + n + '(x)=b on V');
          p.bad = [[keys[0], 'x=' + pwSols(sh.V, bs[1])[1], keys[2]]];
          return p;
        } },
        { id: '4d', level: 'EMG', outcome: 'RF2', make: function (r, sh) {
          var n = sh.n, L = sh.V[0][0], Rr = sh.V[2][0];
          return drPart('(d) State the domain and range of ' + t(n) + '.', { dv: 'x', fname: n, D: [L, Rr], R: [sh.lo, sh.hi], rW: [{ is: bld('y', L, Rr), code: 'set-swap', hint: 'Those are the ' + t('x') + '-values. The range is the set of heights.' }] },
            'The graph is drawn from A' + t(ptT(sh.V[0])) + ' across to B' + t(ptT(sh.V[2])) + ', with its corner at ' + t(ptT(sh.V[1])) + ':<br>' + drSol('x', n, [L, Rr], [sh.lo, sh.hi]),
            ['Domain: how far the graph spreads left to right. Range: how far it spreads up and down (the corner counts).'], 'domain/range of V ' + n);
        } }] },
      /* ---------------- Q5 ---------------- */
      { num: '5', shared: function (r) {
          var a = r.pick([2, 2, 3, 4]), c = r.pick([3, 3, 1, 2, 4, 5, 7]), D = r.pick([[-1, 0, 1, 2, 3], [-1, 0, 1, 2, 3], [-2, -1, 0, 1, 2], [0, 1, 2, 3, 4], [-3, -2, -1, 0, 1]]);
          return { a: a, c: c, D: D, g: function (x) { return a * x - c; }, m: r.pick(D.filter(function (x) { return x !== 0 && a * x - c !== 0; })) };
        }, stem: function (sh) { return 'The function ' + t('g(x)=' + lin([[sh.a, 'x'], [-sh.c, '']])) + ' has domain ' + t(lst(sh.D)) + '.'; }, parts: [
        { id: '5a', level: 'EMG', outcome: 'RF2', make: function (r, sh) {
          var Rv = sh.D.map(sh.g), bad = sh.D.map(function (x) { return x < 0 ? sh.a * -x - sh.c : sh.g(x); });
          var w = [{ is: lst(bad), code: 'ev-sign', hint: 'Check the negative inputs: ' + t(sh.a + '(' + sh.D[0] + ')=' + sh.a * sh.D[0]) + ', which is negative.' }];
          var p = B.math('(a) State the range of ' + t('g') + '.', K.set(lst(Rv), { other: lst(sh.D), otherName: 'domain', wrong: w.filter(function (x) { return lst(bad) !== lst(Rv); }) }), lst(Rv),
            'Evaluate ' + t('g') + ' at each allowed input:<br>' + sh.D.map(function (x) { return t('g(' + x + ')=' + sh.a + par(x) + '-' + sh.c + '=' + sh.g(x)); }).join(', ') + '<br>' + t('R=' + lst(Rv)),
            ['The range is the set of outputs: substitute each value in the domain into the rule.', 'Write the outputs as a list in braces, e.g. ' + t('\\{-5, -3, 1\\}') + '.'], 'range of g(x)=ax-c on a set', { keys: 'set', vars: ['x'], placeholder: 'e.g. {1, 3, 5}' });
          p.bad = [lst(sh.D)].concat(lst(bad) !== lst(Rv) ? [lst(bad)] : []);
          return p;
        } },
        { id: '5b', level: 'EMG', make: function (r, sh) {
          var b = sh.g(sh.m);
          return B.number('(b) Solve the equation ' + t('g(x)=' + b) + '.', sh.m, function (u) {
            if (same(u, sh.g(b))) return { code: 'ev-instead', hint: 'You found ' + t('g(' + b + ')') + '. Here ' + t(b) + ' is the <b>output</b>: solve ' + t(lin([[sh.a, 'x'], [-sh.c, '']]) + '=' + b) + '.' };
            if (same(u, cl((b - sh.c) / sh.a))) return { code: 'conv-move-sign', hint: 'To undo ' + t('-' + sh.c) + ', <b>add</b> ' + t(sh.c) + ' to both sides.' };
            return null;
          }, t(lin([[sh.a, 'x'], [-sh.c, '']]) + '=' + b) + '<br>' + t(sh.a + 'x=' + (b + sh.c)) + '<br>' + t('x=' + sh.m) + ' (and ' + t(sh.m) + ' is in the domain ✓)',
            ['Set the rule equal to ' + t(b) + ' and solve for ' + t('x') + '.'], 'solve g(x)=b', { before: t('x=') });
        } }] },
      /* ---------------- Q6 ---------------- */
      { num: '6', shared: function (r) {
          var a = r.pick([4, 4, 2, 3, 5]), b = r.pick([5, 5, 1, 2, 3, 4, 6, 7]), xt = r.pick([4, 4, 5, 6]);
          return { a: a, b: b, xs: [-1, 0, 1, 2, 3], k: function (x) { return a * x - b; }, xt: xt, x2: r.pick([2, 2, 1, 3, -1]) };
        }, stem: function (sh) { return 'The table below shows values of ' + t('k(x)=' + lin([[sh.a, 'x'], [-sh.b, '']])) + '.' + HW.valueTable([[t('x')].concat(sh.xs.map(function (x) { return t(x); })), [t('k(x)')].concat(sh.xs.map(function () { return ''; }))]); }, parts: [
        { id: '6a', level: 'BEG', make: function (r, sh) {
          return fnTable('(a) Complete the table of values.', 'k', 'x', sh.xs, sh.k, function (x, u) {
            if (x < 0 && same(u, sh.a * -x - sh.b)) return { code: 'ev-sign', hint: t(sh.a + '(' + x + ')=' + sh.a * x) + ': a positive times a negative is negative.' };
            if (same(u, sh.a * x + sh.b)) return { code: 'sign', hint: 'The rule <b>subtracts</b> ' + t(sh.b) + '.' };
            return null;
          }, t('k(-1)=' + sh.a + '(-1)-' + sh.b + '=' + sh.k(-1)) + ', then add ' + t(sh.a) + ' each step (the inputs go up by ' + t('1') + '):<br>' + sh.xs.map(function (x) { return t('k(' + x + ')=' + sh.k(x)); }).join(', '),
            ['Substitute each input: multiply by ' + t(sh.a) + ', then subtract ' + t(sh.b) + '.'], 'table of k(x)=ax-b');
        } },
        { id: '6b', level: 'LIM', make: function (r, sh) {
          var x = sh.x2, v = sh.k(x);
          return B.number('(b) State the value of ' + t('k(' + x + ')') + '.', v, function (u) { if (same(u, x)) return { code: 'value', hint: t('k(' + x + ')') + ' is the <b>output</b> under ' + t('x=' + x) + ' in the table.' }; return null; },
            'Find ' + t('x=' + x) + ' in the top row and read the number under it: ' + t('k(' + x + ')=' + v) + '.', ['Use your completed table.'], 'k(a) from table', { before: t('k(' + x + ')=') });
        } },
        { id: '6c', level: 'PRG', make: function (r, sh) {
          var y = sh.k(sh.xt);
          return B.number('(c) For what value of ' + t('x') + ' does ' + t('k(x)=' + y) + '?', sh.xt, function (u) {
            if (same(u, sh.k(y))) return { code: 'ev-instead', hint: 'You found ' + t('k(' + y + ')') + '. Here ' + t(y) + ' is the <b>output</b>: solve ' + t(lin([[sh.a, 'x'], [-sh.b, '']]) + '=' + y) + '.' };
            if (same(u, cl((y - sh.b) / sh.a))) return { code: 'conv-move-sign', hint: 'To undo ' + t('-' + sh.b) + ', <b>add</b> ' + t(sh.b) + ' to both sides.' };
            return null;
          }, t(y) + ' is past the end of the table, so solve:<br>' + t(lin([[sh.a, 'x'], [-sh.b, '']]) + '=' + y) + '<br>' + t(sh.a + 'x=' + (y + sh.b)) + '<br>' + t('x=' + sh.xt),
            [t(y) + ' isn’t in the table. Set the rule equal to ' + t(y) + ' and solve — or keep extending the table.'], 'solve k(x)=b beyond table', { before: t('x=') });
        } }] },
      /* ---------------- Q7 ---------------- */
      { num: '7', shared: function (r) { var c, a; do { c = r.pick([10, 10, 7, 8, 11, 13, 14, 16, 17, 19, 22]); a = r.pick([3, 3, 2, 4, 5]); } while (c % a === 0); return { c: c, a: a, k: r.pick([4, 4, 2, 3, 5, 6]) }; },
        stem: function (sh) { return 'Given that ' + t('f(x)=' + lin([[sh.c, ''], [-sh.a, 'x']])) + ','; }, parts: [
        { id: '7a', level: 'BEG', make: function (r, sh) {
          var v = sh.c + sh.a * sh.k;
          return B.number('(a) evaluate ' + t('f(-' + sh.k + ')') + '.', v, function (u) { if (same(u, sh.c - sh.a * sh.k)) return { code: 'ev-sign', hint: t('-' + sh.a + '(-' + sh.k + ')=+' + sh.a * sh.k) + ': a negative times a negative is positive.' }; return null; },
            t('f(-' + sh.k + ')=' + sh.c + '-' + sh.a + '(-' + sh.k + ')') + '<br>' + t('=' + sh.c + '+' + sh.a * sh.k + '=' + v), ['Replace every ' + t('x') + ' with ' + t('(-' + sh.k + ')') + ', brackets and all.'], 'evaluate f(-k)');
        } },
        { id: '7b', level: 'MAS', make: function (r, sh) {
          var a = sh.a, c = sh.c;
          var p = K.P.poly('(b) find the value of ' + t('f(t)+f(-t)') + '.', PL.num(2 * c), { vars: ['t'], wrong: [
            { is: P(lin([[2 * c, ''], [-2 * a, 't']])), code: 'ft-sign', hint: t('f(-t)=' + c + '-' + a + '(-t)=' + c + '+' + a + 't') + '. The two minus signs multiply.' },
            { is: P(lin([[2 * c, ''], [2 * a, 't']])), code: 'ft-sign', hint: 'Check ' + t('f(t)') + ': it is ' + t(c + '-' + a + 't') + '. Then ' + t('f(-t)=' + c + '+' + a + 't') + '.' },
            { is: PL.num(0), code: 'ft-zero', hint: 'Only the ' + t('t') + '-terms cancel. What is left from the two constant terms?' },
            { is: PL.num(c), code: 'ft-zero', hint: 'Both ' + t('f(t)') + ' and ' + t('f(-t)') + ' contain the constant ' + t(c) + '. Add both of them.' }] },
            t('f(t)=' + c + '-' + a + 't') + '<br>' + t('f(-t)=' + c + '-' + a + '(-t)=' + c + '+' + a + 't') + '<br>Adding, the ' + t('-' + a + 't') + ' and ' + t('+' + a + 't') + ' cancel: ' + t('f(t)+f(-t)=' + 2 * c) + ' (for every ' + t('t') + ').',
            ['Write ' + t('f(t)') + ' by replacing ' + t('x') + ' with ' + t('t') + ', and ' + t('f(-t)') + ' by replacing ' + t('x') + ' with ' + t('(-t)') + '. Then add.'], 'f(t)+f(-t)');
          p.bad = [String(2 * c) + '-' + 2 * a + 't', '0', String(c)];
          return p;
        } },
        { id: '7c', level: 'PRG', outcome: 'RF5', make: function (r, sh) {
          var a = sh.a, c = sh.c;
          var fl = [{ label: t('x') + '-intercept: ' + t('x='), name: 'x-intercept', mode: 'math', keys: 'fraction' }, { label: t('y') + '-intercept: ' + t('y='), name: 'y-intercept', mode: 'math', keys: 'fraction' }];
          var p = BF('(c) determine the ' + t('x') + '-intercept and the ' + t('y') + '-intercept on the graph of ' + t('f') + '.', fl,
            [K.fraction([c, a], { decimalOk: true, diag: function (u) { if (same(u, c)) return { code: 'xint-yint', hint: 'That is the ' + t('y') + '-intercept. For the ' + t('x') + '-intercept, set ' + t('f(x)=0') + ' and solve.' }; if (same(u, -c / a)) return { code: 'sign', hint: 'Check the sign: ' + t(c + '-' + a + 'x=0') + ' gives ' + t(a + 'x=' + c) + '.' }; if (same(u, a / c)) return { code: 'nr-flip', hint: 'Divide the other way: ' + t('x=' + c + '\\div ' + a) + '.' }; return null; } }),
              K.value(c, { diag: function (u) { if (same(u, c / a)) return { code: 'xint-yint', hint: 'That is the ' + t('x') + '-intercept. The ' + t('y') + '-intercept is ' + t('f(0)') + '.' }; if (same(u, -a)) return { code: 'nr-const', hint: 'Substitute ' + t('x=0') + ': ' + t('f(0)=' + c + '-' + a + '(0)') + '.' }; return null; } })],
            [frT(c, a), String(c)], t('x') + '-int ' + t(frT(c, a)) + ', ' + t('y') + '-int ' + t(c),
            t('y') + '-intercept: ' + t('f(0)=' + c) + ', the point ' + t('(0,\\ ' + c + ')') + '.<br>' + t('x') + '-intercept: ' + t('0=' + c + '-' + a + 'x\\Rightarrow ' + a + 'x=' + c + '\\Rightarrow x=' + frT(c, a)) + ', the point ' + t('\\left(' + frT(c, a) + ',\\ 0\\right)\\approx(' + (Math.round(10 * c / a) / 10) + ',\\ 0)') + '.',
            ['The ' + t('y') + '-intercept is where ' + t('x=0') + ': find ' + t('f(0)') + '.', 'The ' + t('x') + '-intercept is where the output is ' + t('0') + ': solve ' + t('f(x)=0') + '. A fraction is fine.'], 'intercepts of f(x)=c-ax');
          p.good = [[nf(c / a).length < 8 ? nf(c / a) : frT(c, a), String(c)]];
          p.bad = [[String(c), frT(c, a)]];
          return p;
        } }] },
      /* ---------------- Q8: a segment on a limited domain ---------------- */
      { num: '8', shared: function (r) {
          var m = r.pick([2, 2, 1]), b = r.pick([0, 0, 1, -1, 2, -2]), Dm = r.pick([[-3, 3], [-3, 3], [-2, 4], [-4, 2], [-2, 3], [-3, 2]]);
          if (m === 1 && b === 0) b = r.pick([1, -1, 2]);
          var d = function (x) { return m * x + b; }, L = Dm[0], U = Dm[1];
          var cand = []; for (var x = L + 1; x < U; x++) { var y = d(x); if (x !== 0 && y !== 0 && y !== x && y > 0) cand.push(x); }
          if (!cand.length) for (x = L + 1; x < U; x++) if (x !== 0 && d(x) !== x && d(x) !== 0) cand.push(x);
          var p = r.pick(cand), x0 = r.chance(0.6) ? L : r.pick([L, U].concat(cand.filter(function (z) { return z !== p; })));
          var ys = [d(L), d(U)], lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys);
          var Wy = Math.max(Math.abs(lo), Math.abs(hi)) + 1;
          var fig = '<div class="fig">' + HW.graph({ x: [-5, 5], y: [-Wy, Wy], grid: 1, labelsX: 1, labelsY: 2, unitX: 26, unitY: 230 / (2 * Wy), xName: 'x', yName: 'd(x)', max: 300,
            segs: [{ pts: [[L, d(L)], [U, d(U)]], start: 'closed', end: 'closed' }], points: [{ x: p, y: d(p) }], aria: 'segment graph of d' }) + '</div>';
          return { m: m, b: b, L: L, U: U, d: d, p: p, x0: x0, lo: lo, hi: hi, fig: fig };
        }, stem: function (sh) { return 'The graph of a function ' + t('d') + ', drawn only for ' + t(sh.L + '\\le x\\le ' + sh.U) + ', is shown. A point on the graph is marked.' + sh.fig; }, parts: [
        { id: '8a', sub: 'a i', level: 'EMG', make: function (r, sh) {
          var p = sh.p, q = sh.d(p);
          return mc(r, '(a) A student looks at the marked point and says “' + t('d(' + q + ')=' + p) + '.” What is wrong with the student’s statement?', [
            { html: 'The input and output are swapped: the marked point is ' + t(ptT([p, q])) + ', so the input ' + t(p) + ' belongs in the brackets.', right: true },
            { html: 'Nothing: the height of the point goes in the brackets.', why: 'The brackets always hold the <b>input</b> — the ' + t('x') + '-coordinate. The height is the output.' },
            { html: 'The function should be named ' + t('y') + ', not ' + t('d') + '.', why: 'The graph is labelled ' + t('d(x)') + ', so the name ' + t('d') + ' is right. Look at the order of the numbers.' },
            { html: 'The point is not on the graph of ' + t('d') + '.', why: 'The marked point is on the graph. Look at which number is the input.' }],
            'The marked point is ' + t(ptT([p, q])) + ': the input (the ' + t('x') + '-coordinate) is ' + t(p) + ' and the output (the height) is ' + t(q) + '. The student swapped them — the number inside the brackets must be the input.',
            ['Read the coordinates of the marked point. Which one is the input?'], 'what is wrong with d(b)=a');
        } },
        { id: '8b', sub: 'a ii', level: 'EMG', make: function (r, sh) {
          var p = sh.p, q = sh.d(p);
          return stmtPart('Now write the correct statement using function notation.', 'd', p, q,
            'Input ' + t(p) + ', output ' + t(q) + ': ' + t('d(' + p + ')=' + q) + '.' + (q > sh.U || q < sh.L ? ' (“' + t('d(' + q + ')') + '” would be the output at ' + t('x=' + q) + ', which doesn’t even exist here — the graph stops at ' + t('x=' + (q > sh.U ? sh.U : sh.L)) + '.)' : ''),
            ['Name, input in brackets, equals, output: ' + t('d(\\text{input})=\\text{output}') + '.'], 'correct d(a)=b');
        } },
        { id: '8c', sub: 'b', level: 'EMG', make: function (r, sh) {
          var y = sh.d(sh.x0);
          return solvePart('(b) Solve the equation ' + t('d(x)=' + y) + '.', [sh.x0], { b: y, rev: Math.abs(y) <= 4 ? sh.d(y) : null },
            'Find the height ' + t(y) + ' on the vertical axis and read across to the graph' + (sh.x0 === sh.L || sh.x0 === sh.U ? ' — it happens at an end of the segment' : '') + ', then down to the ' + t('x') + '-axis: ' + t('x=' + sh.x0) + '.',
            ['Here ' + t(y) + ' is an <b>output</b>: start on the vertical axis.'], 'solve d(x)=b');
        } },
        { id: '8d', sub: 'c', level: 'EMG', outcome: 'RF2', make: function (r, sh) {
          return drPart('(c) State the domain and range of ' + t('d') + '.', { dv: 'x', fname: 'd', D: [sh.L, sh.U], R: [sh.lo, sh.hi] },
            'The segment runs from ' + t(ptT([sh.L, sh.d(sh.L)])) + ' to ' + t(ptT([sh.U, sh.d(sh.U)])) + ':<br>' + drSol('x', 'd', [sh.L, sh.U], [sh.lo, sh.hi]),
            ['The end dots are included. Read the ' + t('x') + '-values of the ends for the domain and their heights for the range.'], 'domain/range of segment d');
        } }] },
      /* ---------------- Q9 – Q11 ---------------- */
      { num: '9', section: 'Part C — Multiple choice and numerical response', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '9', level: 'BEG', make: function (r) {
          var nm = r.pick(['f', 'f', 'g', 'h']), a = r.pick([5, 5, 2, 3, 4, 6, 7, 8]), b = r.pick([12, 12, 9, 10, 11, 15, 20, -3].filter(function (x) { return x !== a && x !== 2 * a; }));
          return mc(r, 'Which statement correctly describes the meaning of the notation ' + t(nm + '(' + a + ')=' + nf(b)) + '?', [
            { html: 'When the output is ' + t(a) + ', the input is ' + t(b) + '.', why: 'Backwards: the number in the brackets, ' + t(a) + ', is the <b>input</b>.' },
            { html: 'When the input is ' + t(a) + ', the output is ' + t(b) + '.', right: true },
            { html: 'The function ' + t(nm) + ' is equal to ' + t(a) + ' times ' + t(b) + '.', why: t(nm + '(' + a + ')') + ' is not multiplication — it means “' + t(nm) + ' evaluated at ' + t(a) + '”.' },
            { html: 'The point ' + t(ptT([b, a])) + ' lies on the graph of ' + t(nm) + '.', why: 'An ordered pair is (input, output), so the point is ' + t(ptT([a, b])) + '.' }],
            t(nm + '(' + a + ')=' + b) + ' says: when the input is ' + t(a) + ', the output is ' + t(b) + '. The point ' + t(ptT([a, b])) + ' lies on the graph.', ['The number inside the brackets is the input.'], 'meaning of f(a)=b', true);
        } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var nm = r.pick(['T', 'T', 'G', 'M']), a = r.pick([6, 6, 2, 3, 4, 5, 7, 8]), b = r.pick([-2, -2, -1, -3, -4, -5, 9, 10].filter(function (x) { return x !== a; }));
          return mc(r, 'Function ' + t(nm) + ' is such that ' + t(nm + '(' + a + ')=' + b) + '. Which of the following statements is correct?', [
            { html: 'The point ' + t(ptT([a, b])) + ' lies on the graph of ' + t('y=' + nm + '(x)') + '.', right: true },
            { html: 'The point ' + t(ptT([b, a])) + ' lies on the graph of ' + t('y=' + nm + '(x)') + '.', why: 'The input comes first in an ordered pair: the input is ' + t(a) + '.' },
            { html: t(nm + '(' + b + ')=' + a) + '.', why: 'Nothing tells us the output at the input ' + t(b) + '. Swapping input and output gives a different statement.' },
            { html: 'Both A and C are correct.', why: 'Only one of them is correct: check C by asking what the input and output are.' }],
            t(nm + '(' + a + ')=' + b) + ' means input ' + t(a) + ', output ' + t(b) + ', so the point ' + t(ptT([a, b])) + ' lies on the graph. ' + t(nm + '(' + b + ')=' + a) + ' is a different statement that we know nothing about.', ['Write the ordered pair (input, output) for ' + t(nm + '(' + a + ')=' + b) + '.'], 'T(a)=b point', true);
        } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '11', level: 'PRG', outcome: 'RF5', make: function (r) {
          var nm = r.pick(['m', 'm', 'k', 'g']), a = r.pick([5, 5, 2, 3, 4, 6, 8]), z = r.pick([4, 4, 2, 3, 5, 6, 7, 9, 2.5, 1.5].filter(function (x) { return Number.isInteger(a * x); })), c = cl(a * z);
          return B.nr('Consider the graph of the function ' + t(nm + '(x)=' + a + 'x-' + c) + '. The ' + t('x') + '-intercept of the graph of ' + t(nm) + ' is located at ' + t('(a,\\ 0)') + '. The value of ' + t('a') + ' is ________. <i>(Record your answer in the numerical response box from left to right.)</i>', z, function (u) {
            if (same(u, -z)) return { code: 'sign', hint: 'Check the sign: ' + t(a + 'a-' + c + '=0') + ' gives ' + t(a + 'a=+' + c) + '.' };
            if (same(u, cl(a / c))) return { code: 'nr-flip', hint: 'Divide the other way: ' + t('a=' + c + '\\div ' + a) + '.' };
            if (same(u, c)) return { code: 'nr-const', hint: 'At the ' + t('x') + '-intercept the output is ' + t('0') + ': solve ' + t(a + 'a-' + c + '=0') + '.' };
            return null;
          }, 'At the ' + t('x') + '-intercept the output is ' + t('0') + ':<br>' + t(nm + '(a)=0\\Rightarrow ' + a + 'a-' + c + '=0\\Rightarrow ' + a + 'a=' + c + '\\Rightarrow a=' + nf(z)), ['The ' + t('x') + '-intercept is where the output is ' + t('0') + ': solve ' + t(nm + '(a)=0') + '.'], 'x-intercept NR');
        } }] },
      /* ---------------- Q12 earnings ---------------- */
      { num: '12', section: 'Part D — Real-world function models', shared: function (r) {
          var p = r.pick([['Malik', 'mowing', 'lawn', 'lawns', 'mows'], ['Malik', 'mowing', 'lawn', 'lawns', 'mows'], ['Ava', 'shovelling', 'driveway', 'driveways', 'shovels'], ['Noah', 'washing', 'car', 'cars', 'washes']]);
          var rate = r.pick([15, 15, 12, 20, 25, 18, 14, 16, 22, 24, 30, 35]), nb = r.pick([7, 7, 6, 8, 11, 12]), nc = r.pick([9, 9, 6, 8, 10, 13].filter(function (x) { return x !== nb; }));
          return { who: p[0], doing: p[1], one: p[2], many: p[3], rate: rate, nb: nb, nc: nc, E: function (n) { return rate * n; } };
        }, stem: function (sh) { return '' + sh.who + ' earns money ' + sh.doing + ' ' + sh.many + '. ' + (sh.who === 'Ava' ? 'Her' : 'His') + ' total earnings are modelled by ' + t('E(n)=' + sh.rate + 'n') + ', where ' + t('E(n)') + ' is the total earnings, in dollars, for ' + sh.doing + ' ' + t('n') + ' ' + sh.many + '.'; }, parts: [
        { id: '12a', level: 'BEG', make: function (r, sh) {
          return fnTable('(a) Complete the table of values.', 'E', 'n', [1, 2, 3, 4, 5], sh.E, function (n, u) { if (same(u, sh.rate + n)) return { code: 'value', hint: t(sh.rate + 'n') + ' means ' + t(sh.rate + '\\times n') + ', not ' + t(sh.rate + '+n') + '.' }; return null; },
            'Multiply each input by ' + t(sh.rate) + ': ' + [1, 2, 3, 4, 5].map(function (n) { return t('E(' + n + ')=' + sh.E(n)); }).join(', '), ['Each ' + sh.one + ' earns ' + t('\\$' + sh.rate) + '.'], 'table E(n)=rn');
        } },
        { id: '12b', sub: 'b i', level: 'BEG', make: function (r, sh) {
          var v = sh.E(sh.nb);
          return B.number('(b) Determine the value of ' + t('E(' + sh.nb + ')') + '.', v, function (u) { if (same(u, sh.rate + sh.nb)) return { code: 'value', hint: t(sh.rate + 'n') + ' means multiply.' }; return null; },
            t('E(' + sh.nb + ')=' + sh.rate + '(' + sh.nb + ')=' + v), ['Substitute ' + t('n=' + sh.nb) + '.'], 'E(n)', { before: t('E(' + sh.nb + ')=') });
        } },
        { id: '12c', sub: 'b ii', level: 'EMG', make: function (r, sh) {
          var v = sh.E(sh.nb);
          return meaningMC(r, 'What does ' + t('E(' + sh.nb + ')=' + v) + ' represent?', sh.who + ' earns ' + t('\\$' + v) + ' for ' + sh.doing + ' ' + t(sh.nb) + ' ' + sh.many + '.', [
            { html: sh.who + ' earns ' + t('\\$' + sh.nb) + ' for ' + sh.doing + ' ' + t(v) + ' ' + sh.many + '.', why: 'Input and output are swapped: the input ' + t(sh.nb) + ' is the number of ' + sh.many + '.' },
            { html: sh.who + ' earns ' + t('\\$' + v) + ' for each ' + sh.one + '.', why: t('\\$' + v) + ' is the total for ' + t(sh.nb) + ' ' + sh.many + '; each ' + sh.one + ' earns ' + t('\\$' + sh.rate) + '.' },
            { html: 'It takes ' + t(sh.nb) + ' hours to earn ' + t('\\$' + v) + '.', why: 'The input ' + t('n') + ' is a number of ' + sh.many + ', not hours.' }],
            'Input ' + t(sh.nb) + ' ' + sh.many + ', output ' + t('\\$' + v) + ': ' + sh.who + ' earns ' + t('\\$' + v) + ' for ' + sh.doing + ' ' + t(sh.nb) + ' ' + sh.many + '.', ['What is the input (with units)? What is the output?'], 'meaning E(n)=b');
        } },
        { id: '12d', sub: 'c', level: 'EMG', make: function (r, sh) {
          var y = sh.E(sh.nc);
          return B.number('(c) How many ' + sh.many + ' did ' + sh.who + ' do if ' + (sh.who === 'Ava' ? 'she' : 'he') + ' earned ' + t('\\$' + y) + '?', sh.nc, function (u) { if (same(u, sh.E(y))) return { code: 'ev-instead', hint: 'You found ' + t('E(' + y + ')') + '. Here ' + t('\\$' + y) + ' is the <b>output</b>: solve ' + t(sh.rate + 'n=' + y) + '.' }; if (same(u, y - sh.rate)) return { code: 'value', hint: 'Undo multiplying by ' + t(sh.rate) + ': divide.' }; return null; },
            'Solve ' + t('E(n)=' + y) + ': ' + t(sh.rate + 'n=' + y) + ', so ' + t('n=' + y + '\\div ' + sh.rate + '=' + sh.nc) + ' ' + sh.many + '.', ['The earnings are the output: solve ' + t('E(n)=' + y) + '.'], 'solve E(n)=b', { after: sh.many });
        } }] },
      /* ---------------- Q13 tank filling ---------------- */
      { num: '13', shared: function (r) {
          var V0, rate, T, Fv;
          for (var g = 0; g < 200; g++) { V0 = r.pick([40, 40, 20, 60, 80, 100, 120]); rate = r.pick([25, 25, 20, 30, 40, 50]); T = r.pick([20, 20, 10, 12, 14, 16, 18]); Fv = V0 + rate * T; if (Fv <= 600 && Fv % 20 === 0 && Fv >= 300) break; }
          if (Fv > 600 || Fv % 20) { V0 = 40; rate = 25; T = 20; Fv = 540; }
          var tb = r.pick([T / 2].concat([4, 6, 8, 10, 12].filter(function (x) { return x < T && x !== T / 2; })));
          return { V0: V0, rate: rate, T: T, Fv: Fv, tb: tb, V: function (x) { return rate * x + V0; } };
        }, stem: function (sh) { return 'A water tank already contains ' + t(sh.V0) + ' litres of water when a hose is turned on to fill it further. The volume is modelled by ' + t('V(t)=' + sh.rate + 't+' + sh.V0) + ', where ' + t('V(t)') + ' is the volume, in litres, ' + t('t') + ' minutes after the hose is turned on.'; }, parts: [
        { id: '13a', level: 'PRG', outcome: 'RF1', make: function (r, sh) {
          var T = sh.T, top = sh.Fv, ym = Math.ceil(top / 120) * 120 + 60;
          var I = padIn({ x: [0, 22], y: [0, ym], sx: 2, sy: 20, gy: 60, lx: 4, ly: 120, h: 300, v: 't', w: 'V(t)', xTitle: 't (min)', yTitle: 'V(t) (L)' });
          var Sk = segSketch({ f: sh.V, X0: 0, X1: T, sx: 2, sy: 20, name: 'V', v: 't',
            start0: 'At ' + t('t=0') + ' the tank already holds ' + t(sh.V0) + ' L: ' + t('V(0)=' + sh.V0) + ', so the graph starts on the vertical axis at ' + t(sh.V0) + ', not at the origin.',
            endX: 'The graph is for a maximum of ' + t(T) + ' minutes: end the segment at ' + t('t=' + T) + '.', arrow: 'The graph stops at ' + t('t=' + T) + ' min: end it with a solid dot, not an arrow.',
            dir: 'The tank is filling, so the graph rises from ' + t('V(0)=' + sh.V0) + ' to ' + t('V(' + T + ')=' + top) + '.' });
          var p = B.graph('(a) Sketch the graph of the function for a maximum of ' + t(T) + ' minutes.' + LINE_HELP, I, Sk.check, Sk.key,
            t('V(0)=' + sh.V0) + ' and ' + t('V(' + T + ')=' + sh.rate + '(' + T + ')+' + sh.V0 + '=' + top) + '. The graph is a segment from ' + t('(0,\\ ' + sh.V0 + ')') + ' rising ' + t(sh.rate) + ' L every minute to ' + t(ptT([T, top])) + ', with solid dots at both ends.',
            ['Find the two ends first: ' + t('V(0)') + ' and ' + t('V(' + T + ')') + '.', 'Each grid square across is ' + t('2') + ' min; up, the lines are every ' + t('60') + ' L (you can tap between them).'], 'sketch tank filling');
          p.bad = [drawing([seg([0, 0], [T, snapTo(sh.rate * T, 20)])]), drawing([seg(Sk.A, [22, snapTo(Math.min(ym, sh.V(22)), 20)], 'closed', 'arrow')]), drawing([seg(Sk.A, Sk.B, 'closed', 'open')]), drawing([seg([0, top], [T, sh.V0])])];
          return p;
        } },
        { id: '13b', level: 'BEG', make: function (r, sh) {
          var v = sh.V(sh.tb);
          return B.number('(b) Determine the value of ' + t('V(' + sh.tb + ')') + '.', v, function (u) { if (same(u, sh.rate * sh.tb)) return { code: 'no-fixed', hint: 'Add the ' + t(sh.V0) + ' L that was already in the tank.' }; if (same(u, cl((sh.tb - sh.V0) / sh.rate))) return { code: 'solve-instead', hint: t('V(' + sh.tb + ')') + ' means substitute ' + t('t=' + sh.tb) + '.' }; return null; },
            t('V(' + sh.tb + ')=' + sh.rate + '(' + sh.tb + ')+' + sh.V0 + '=' + sh.rate * sh.tb + '+' + sh.V0 + '=' + v) + ' L', ['Substitute ' + t('t=' + sh.tb) + ' into the rule.'], 'V(t)', { after: 'L' });
        } },
        { id: '13c', level: 'EMG', make: function (r, sh) {
          var v = sh.V(sh.tb);
          return meaningMC(r, '(c) What is the meaning of ' + t('V(' + sh.tb + ')=' + v) + '?', t(sh.tb) + ' minutes after the hose is turned on, the tank holds ' + t(v) + ' L of water.', [
            { html: 'After ' + t(v) + ' minutes the tank holds ' + t(sh.tb) + ' L of water.', why: 'Input and output are swapped: the input ' + t(sh.tb) + ' is the time in minutes.' },
            { html: 'The hose adds ' + t(v) + ' L of water every ' + t(sh.tb) + ' minutes.', why: t('V(' + sh.tb + ')') + ' is the amount in the tank at one moment, not a rate.' },
            { html: 'In ' + t(sh.tb) + ' minutes the hose adds ' + t(v) + ' L of water.', why: 'The tank started with ' + t(sh.V0) + ' L, so ' + t(v) + ' L is the total in the tank, not what the hose added.' }],
            t('V(t)') + ' is the volume (L) after ' + t('t') + ' minutes, so at ' + t('t=' + sh.tb) + ' min the tank holds ' + t(v) + ' L.', ['Which number is the time and which is the volume?'], 'meaning V(t)=b');
        } },
        { id: '13d', level: 'EMG', make: function (r, sh) {
          return mc(r, '(d) Evaluate ' + t('V(0)') + ' and explain its significance.', [
            { html: t('V(0)=' + sh.V0) + ': the tank held ' + t(sh.V0) + ' L before the hose was turned on.', right: true },
            { html: t('V(0)=0') + ': the tank is empty at the start.', why: 'Substitute ' + t('t=0') + ': ' + t(sh.rate + '(0)+' + sh.V0 + '=' + sh.V0) + '.' },
            { html: t('V(0)=' + sh.rate) + ': the hose adds ' + t(sh.rate) + ' L each minute.', why: t(sh.rate) + ' is the rate. ' + t('V(0)') + ' is the output when ' + t('t=0') + '.' },
            { html: t('V(0)=' + sh.V0) + ': the tank holds ' + t(sh.V0) + ' L after one minute.', why: t('t=0') + ' is the moment the hose is turned on, not one minute later.' }],
            t('V(0)=' + sh.rate + '(0)+' + sh.V0 + '=' + sh.V0) + ': the tank already held ' + t(sh.V0) + ' L when the hose was turned on — the starting volume (the vertical intercept of the graph).', ['Substitute ' + t('t=0') + ', then think about what ' + t('t=0') + ' means.'], 'meaning V(0)');
        } },
        { id: '13e', level: 'EMG', make: function (r, sh) {
          var y = sh.Fv;
          return B.number('(e) How many minutes will it take to fill the tank to ' + t(y) + ' litres?', sh.T, function (u) {
            if (Math.abs(u - y / sh.rate) < 1e-6) return { code: 'no-fixed', hint: 'Subtract the starting ' + t(sh.V0) + ' L before dividing by ' + t(sh.rate) + '.' };
            if (Math.abs(u - (y + sh.V0) / sh.rate) < 1e-6) return { code: 'conv-move-sign', hint: 'Subtract ' + t(sh.V0) + ' from both sides — don’t add it.' };
            if (same(u, sh.V(y))) return { code: 'ev-instead', hint: 'You found ' + t('V(' + y + ')') + '. Here ' + t(y) + ' L is the <b>output</b>: solve ' + t('V(t)=' + y) + '.' };
            return null;
          }, t(sh.rate + 't+' + sh.V0 + '=' + y) + '<br>' + t(sh.rate + 't=' + (y - sh.V0)) + '<br>' + t('t=' + sh.T) + ' minutes', ['The volume is the output: solve ' + t('V(t)=' + y) + '.'], 'solve V(t)=b', { after: 'min' });
        } },
        { id: '13f', level: 'PRG', outcome: 'RF2', make: function (r, sh) {
          return drPart('(f) Suggest an appropriate domain and range for the function, given that the tank is full at ' + t(sh.Fv) + ' litres.', { dv: 't', fname: 'V', D: [0, sh.T], R: [sh.V0, sh.Fv],
            rW: [{ is: bld('y', 0, sh.Fv), code: 'dr-from-zero', hint: 'At ' + t('t=0') + ' the tank already holds ' + t(sh.V0) + ' L: the range starts at ' + t('V(0)') + '.' }],
            dW: [{ is: bld('t', 0, sh.Fv), code: 'dr-context', hint: t(sh.Fv) + ' is a volume. The domain is the set of <b>times</b>: from ' + t('0') + ' until the tank is full.' }] },
            'Filling runs from ' + t('t=0') + ' until the tank is full at ' + t('t=' + sh.T) + ', and the volume rises from ' + t('V(0)=' + sh.V0) + ' to ' + t(sh.Fv) + ':<br>' + drSol('t', 'V', [0, sh.T], [sh.V0, sh.Fv]),
            ['The domain runs from when the hose is turned on to when the tank is full (part (e)).', 'For the range, find ' + t('V') + ' at both ends.'], 'domain/range tank');
        } }] },
      /* ---------------- Q14 temperature ---------------- */
      { num: '14', shared: function (r) {
          var T0, rr, H, g;
          for (g = 0; g < 300; g++) { T0 = r.pick([18, 18, 12, 15, 16, 20, 24]); rr = r.pick([3, 3, 2, 4]); H = r.pick([9, 9, 6, 7, 8, 10]); if (T0 % rr === 0 && T0 / rr < H && T0 - rr * H < 0 && T0 - rr * H >= -16 && T0 / rr + H <= 20) break; }
          if (!(T0 % rr === 0 && T0 / rr < H && T0 - rr * H < 0)) { T0 = 18; rr = 3; H = 9; }
          var start = r.pick([21, 21, 20, 22]), z = T0 / rr, hb = r.pick([4, 4, 1, 2, 3, 5].filter(function (x) { return x < z; }));
          return { T0: T0, r: rr, H: H, start: start, z: z, hb: hb, end: T0 - rr * H, T: function (x) { return T0 - rr * x; } };
        }, stem: function (sh) { return 'The temperature outside is dropping steadily overnight. It is modelled by ' + t('T(h)=' + sh.T0 + '-' + sh.r + 'h') + ', where ' + t('T(h)') + ' is the temperature, in degrees Celsius, ' + t('h') + ' hours after ' + clock(sh.start) + '. Recording stops at ' + clock(sh.start + sh.H) + ' (' + t(sh.H) + ' hours after ' + clock(sh.start) + ').'; }, parts: [
        { id: '14a', level: 'PRG', outcome: 'RF1', make: function (r, sh) {
          var H = sh.H, lo = sh.end, y0 = sh.T0, sy = sh.r, ylo = lo - sy, yhi = y0 + sy;
          var I = padIn({ x: [0, H + 1], y: [ylo, yhi], sx: 1, sy: sy, lx: 1, ly: (yhi - ylo) / sy > 12 ? 2 * sy : sy, h: 280, fq: false, v: 'h', w: 'T(h)', xTitle: 'h (hours)', yTitle: 'T(h) (°C)' });
          var Sk = segSketch({ f: sh.T, X0: 0, X1: H, sx: 1, sy: sy, name: 'T', v: 'h',
            endX: 'Recording stops ' + t(H) + ' hours after ' + clock(sh.start) + ': end the segment at ' + t('h=' + H) + ' — the temperature keeps going below ' + t('0' + DEG) + ' until then.', arrow: 'Recording stops at ' + t('h=' + H) + ': end the graph with a solid dot, not an arrow.',
            dir: 'The temperature is <b>dropping</b>, so the graph falls from ' + t('T(0)=' + y0) + ' to ' + t('T(' + H + ')=' + lo) + '.' });
          var p = B.graph('(a) Sketch the graph of the function from ' + clock(sh.start) + ' until recording stops.' + LINE_HELP, I, Sk.check, Sk.key,
            t('T(0)=' + y0) + ' and ' + t('T(' + H + ')=' + y0 + '-' + sh.r + '(' + H + ')=' + lo) + '. The graph is a segment that starts at ' + t('(0,\\ ' + y0 + ')') + ', falls ' + t(sh.r + DEG) + ' every hour, crosses the ' + t('h') + '-axis at ' + t('h=' + sh.z) + ', and ends with a solid dot at ' + t(ptT([H, lo])) + ' — below zero.',
            ['Find the two ends: ' + t('T(0)') + ' and ' + t('T(' + H + ')') + '.', 'The graph does not stop at the ' + t('h') + '-axis: temperatures can be negative.'], 'sketch temperature');
          p.bad = [drawing([seg([0, y0], [sh.z, 0])]), drawing([seg([0, lo], [H, y0])]), drawing([seg(Sk.A, [H + 1, sh.T(H + 1) < ylo ? ylo : sh.T(H + 1)], 'closed', 'arrow')]), drawing([seg([0, 0], [H, snapTo(-sh.r * H, sy) < ylo ? ylo : -sh.r * H])])];
          return p;
        } },
        { id: '14b', level: 'BEG', make: function (r, sh) {
          var v = sh.T(sh.hb);
          return B.number('(b) Determine the value of ' + t('T(' + sh.hb + ')') + '.', v, function (u) { if (same(u, sh.T0 + sh.r * sh.hb)) return { code: 'sign', hint: 'The rule <b>subtracts</b> ' + t(sh.r + 'h') + ': the temperature is dropping.' }; if (same(u, cl((sh.T0 - sh.hb) / sh.r))) return { code: 'solve-instead', hint: t('T(' + sh.hb + ')') + ' means substitute ' + t('h=' + sh.hb) + '.' }; return null; },
            t('T(' + sh.hb + ')=' + sh.T0 + '-' + sh.r + '(' + sh.hb + ')=' + v) + DEG.replace('\\,', ' '), ['Substitute ' + t('h=' + sh.hb) + '.'], 'T(h)', { after: '°C' });
        } },
        { id: '14c', level: 'EMG', make: function (r, sh) {
          var v = sh.T(sh.hb);
          return meaningMC(r, '(c) What is the meaning of ' + t('T(' + sh.hb + ')=' + v) + '?', t(sh.hb) + ' hours after ' + clock(sh.start) + ' (at ' + clock(sh.start + sh.hb) + ') the temperature is ' + t(v + DEG) + '.', [
            { html: t(v) + ' hours after ' + clock(sh.start) + ' the temperature is ' + t(sh.hb + DEG) + '.', why: 'Input and output are swapped: the input ' + t(sh.hb) + ' is the number of hours.' },
            { html: 'The temperature drops ' + t(v + DEG) + ' every ' + t(sh.hb) + ' hours.', why: t('T(' + sh.hb + ')') + ' is the temperature at one moment, not a drop.' },
            { html: 'The temperature has dropped by ' + t(v + DEG) + ' in ' + t(sh.hb) + ' hours.', why: 'It started at ' + t(sh.T0 + DEG) + ', so ' + t(v + DEG) + ' is the temperature itself, not how much it dropped.' }],
            'Input ' + t(sh.hb) + ' hours, output ' + t(v + DEG) + ': at ' + clock(sh.start + sh.hb) + ' the temperature is ' + t(v + DEG) + '.', ['Which number is the time and which is the temperature?'], 'meaning T(h)=b');
        } },
        { id: '14d', level: 'EMG', make: function (r, sh) {
          return mc(r, '(d) Evaluate ' + t('T(0)') + ' and explain its significance.', [
            { html: t('T(0)=' + sh.T0) + ': at ' + clock(sh.start) + ', when recording starts, the temperature is ' + t(sh.T0 + DEG) + '.', right: true },
            { html: t('T(0)=0') + ': the temperature at ' + clock(sh.start) + ' is ' + t('0' + DEG) + '.', why: 'Substitute ' + t('h=0') + ': ' + t(sh.T0 + '-' + sh.r + '(0)=' + sh.T0) + '.' },
            { html: t('T(0)=' + sh.T0) + ': the temperature reaches ' + t('0' + DEG) + ' after ' + t(sh.T0) + ' hours.', why: t('T(0)') + ' is the temperature at ' + t('h=0') + ', not a time.' },
            { html: t('T(0)=' + sh.r) + ': the temperature drops ' + t(sh.r + DEG) + ' per hour.', why: t(sh.r) + ' is the rate of change. ' + t('T(0)') + ' is the output when ' + t('h=0') + '.' }],
            t('T(0)=' + sh.T0 + '-' + sh.r + '(0)=' + sh.T0) + ': the temperature at the start, ' + clock(sh.start) + ', is ' + t(sh.T0 + DEG) + ' (the vertical intercept).', ['What time is ' + t('h=0') + '?'], 'meaning T(0)');
        } },
        { id: '14e', level: 'EMG', make: function (r, sh) {
          return B.number('(e) How many hours after ' + clock(sh.start) + ' will the temperature reach ' + t('0' + DEG) + '?', sh.z, function (u) {
            if (same(u, sh.T0)) return { code: 'ev-instead', hint: t(sh.T0) + ' is ' + t('T(0)') + ', the starting temperature. Solve ' + t('T(h)=0') + ' instead.' };
            if (same(u, -sh.z)) return { code: 'sign', hint: 'Check the sign: ' + t('-' + sh.r + 'h=-' + sh.T0) + ' gives a positive ' + t('h') + '.' };
            if (same(u, cl(sh.r / sh.T0))) return { code: 'nr-flip', hint: 'Divide the other way: ' + t('h=' + sh.T0 + '\\div ' + sh.r) + '.' };
            return null;
          }, 'Solve ' + t('T(h)=0') + ':<br>' + t(sh.T0 + '-' + sh.r + 'h=0') + '<br>' + t(sh.r + 'h=' + sh.T0) + '<br>' + t('h=' + sh.z) + ' hours (at ' + clock(sh.start + sh.z) + ').', ['The temperature is the output: solve ' + t('T(h)=0') + '.'], 'solve T(h)=0', { after: 'hours' });
        } },
        { id: '14f', level: 'PRG', outcome: 'RF2', make: function (r, sh) {
          return drPart('(f) Recording stops ' + t(sh.H) + ' hours after ' + clock(sh.start) + '. Suggest an appropriate domain and range for the function.', { dv: 'h', fname: 'T', D: [0, sh.H], R: [sh.end, sh.T0],
            rW: [{ is: bld('y', 0, sh.T0), code: 'dr-context', hint: 'The temperature keeps dropping below ' + t('0' + DEG) + ' until recording stops: the lowest value is ' + t('T(' + sh.H + ')=' + sh.end) + '.' }],
            dW: [{ is: bld('h', 0, sh.z), code: 'dr-context', hint: 'Recording doesn’t stop at ' + t('0' + DEG) + ': it runs for ' + t(sh.H) + ' hours.' }] },
            'Time runs from ' + t('h=0') + ' to ' + t('h=' + sh.H) + '; the temperature falls from ' + t('T(0)=' + sh.T0) + ' to ' + t('T(' + sh.H + ')=' + sh.end) + ':<br>' + drSol('h', 'T', [0, sh.H], [sh.end, sh.T0]),
            ['Domain: from ' + t('h=0') + ' until recording stops.', 'Range: the temperatures at both ends — one of them is negative.'], 'domain/range temperature');
        } }] },
      /* ---------------- Q15 ride share ---------------- */
      { num: '15', shared: function (r) {
          var a, d, c, ks, g;
          for (g = 0; g < 200; g++) { a = r.pick([2.5, 2.5, 1.5, 2, 3]); d = r.pick([0.5, 0.5, 1]); c = r.pick([3, 3, 2, 4, 5, 6, 8, 9]); ks = cl(c / d); if (Number.isInteger(ks) && ks >= 4 && ks <= 16) break; }
          if (!(Number.isInteger(ks) && ks >= 4 && ks <= 16)) { a = 2.5; d = 0.5; c = 3; ks = 6; }
          var b = cl(a + d), d1 = r.pick([10, 10, 8, 12, 5].filter(function (x) { return x !== ks; })), d2 = r.pick([20, 20, 25, 30, ks > 4 ? 2 : 20, ks > 6 ? 3 : 25].filter(function (x) { return x !== ks && x !== d1; }));
          return { a: a, b: b, c: c, ks: ks, d1: d1, d2: d2, A: function (k) { return cl(a * k + c); }, B: function (k) { return cl(b * k); } };
        }, stem: function (sh) { return 'Two ride-share companies charge different rates for a trip. Company A charges ' + t('A(k)=' + sh.a + 'k+' + sh.c) + ' and Company B charges ' + t('B(k)=' + sh.b + 'k') + ', where ' + t('k') + ' is the distance travelled, in km, and ' + t('A(k)') + ', ' + t('B(k)') + ' are the costs, in dollars.'; }, parts: [
        { id: '15a', level: 'BEG', make: function (r, sh) {
          var k = sh.d1;
          return fieldsOf('(a) Determine the cost of a ' + t(k) + ' km trip with each company.', [valItem(t('A(' + k + ')=\\$'), 'A(' + k + ')', sh.A(k), function (u) { if (same(u, sh.a * k)) return { code: 'no-fixed', hint: 'Company A also charges ' + t('\\$' + sh.c) + ' on top of the distance.' }; return null; }),
            valItem(t('B(' + k + ')=\\$'), 'B(' + k + ')', sh.B(k))], t('A(' + k + ')=\\$' + money(sh.A(k))) + ', ' + t('B(' + k + ')=\\$' + money(sh.B(k))),
            t('A(' + k + ')=' + sh.a + '(' + k + ')+' + sh.c + '=' + money(sh.A(k))) + '<br>' + t('B(' + k + ')=' + sh.b + '(' + k + ')=' + money(sh.B(k))), ['Substitute ' + t('k=' + k) + ' into each rule.'], 'costs A(k), B(k)');
        } },
        { id: '15b', level: 'ADV', make: function (r, sh) {
          var d = cl(sh.b - sh.a);
          return B.number('(b) For what distance do both companies charge the same amount? (Solve ' + t('A(k)=B(k)') + '.)', sh.ks, function (u) {
            if (same(u, cl(sh.c / (sh.a + sh.b)))) return { code: 'conv-move-sign', hint: 'Move ' + t(sh.a + 'k') + ' to the other side by <b>subtracting</b> it: ' + t(sh.c + '=' + sh.b + 'k-' + sh.a + 'k') + '.' };
            if (same(u, -sh.ks)) return { code: 'sign', hint: 'Check the sign: ' + t(sh.c + '=' + d + 'k') + ' gives a positive distance.' };
            if (same(u, cl(d / sh.c))) return { code: 'nr-flip', hint: 'Divide the other way: ' + t('k=' + sh.c + '\\div ' + d) + '.' };
            return null;
          }, t(sh.a + 'k+' + sh.c + '=' + sh.b + 'k') + '<br>' + t(sh.c + '=' + sh.b + 'k-' + sh.a + 'k=' + d + 'k') + '<br>' + t('k=' + sh.c + '\\div ' + d + '=' + sh.ks) + ' km. Check: ' + t('A(' + sh.ks + ')=B(' + sh.ks + ')=\\$' + money(sh.B(sh.ks))) + '.',
            ['Set the two rules equal: ' + t(sh.a + 'k+' + sh.c + '=' + sh.b + 'k') + '.', 'Get the ' + t('k') + '-terms on one side, then divide.'], 'solve A(k)=B(k)', { before: t('k='), after: 'km' });
        } },
        { id: '15c', sub: 'c i', level: 'BEG', make: function (r, sh) {
          var k = sh.d2;
          return fieldsOf('(c) Which company is cheaper for a ' + t(k) + ' km trip? First find both costs.', [valItem(t('A(' + k + ')=\\$'), 'A(' + k + ')', sh.A(k), function (u) { if (same(u, sh.a * k)) return { code: 'no-fixed', hint: 'Company A also charges ' + t('\\$' + sh.c) + ' on top of the distance.' }; return null; }),
            valItem(t('B(' + k + ')=\\$'), 'B(' + k + ')', sh.B(k))], t('A(' + k + ')=\\$' + money(sh.A(k))) + ', ' + t('B(' + k + ')=\\$' + money(sh.B(k))),
            t('A(' + k + ')=' + sh.a + '(' + k + ')+' + sh.c + '=' + money(sh.A(k))) + '<br>' + t('B(' + k + ')=' + sh.b + '(' + k + ')=' + money(sh.B(k))), ['Substitute ' + t('k=' + k) + ' into each rule.'], 'costs at d2');
        } },
        { id: '15d', sub: 'c ii', level: 'EMG', make: function (r, sh) {
          var k = sh.d2, cheap = sh.A(k) < sh.B(k) ? 'A' : 'B';
          return cheaperMC(r, 'Which company is cheaper for a ' + t(k) + ' km trip? Choose the answer with a correct justification.', 'A', 'B', k, sh.A, sh.B, sh.a, sh.c,
            t('A(' + k + ')=\\$' + money(sh.A(k))) + ' and ' + t('B(' + k + ')=\\$' + money(sh.B(k))) + ', so Company ' + cheap + ' is cheaper for a ' + t(k) + ' km trip. (The two cost the same at ' + t(sh.ks) + ' km; ' + (k > sh.ks ? 'beyond that, A’s lower rate per km wins.' : 'below that, B’s lack of a starting fee wins.') + ')',
            ['Use your two costs from (c): the smaller one is cheaper.'], 'which is cheaper');
        } }] }
    ],
    extra: [
      /* ---------------- Extra Part A ---------------- */
      { num: '1', section: 'Extra practice A — Both directions off one graph', shared: function (r) {
          var m, b, y1, xb, g;
          for (g = 0; g < 300; g++) {
            m = r.pick([-2, -2, -1, 1, 2, -3, 3]); b = r.pick([4, 4, 1, 2, 3, -1, -2, -3, 0, 5].filter(function (x) { return x !== 0 || m !== 1; }));
            var ys = [2, 1, 3, -2, 4, -1, -3, 5].filter(function (y) { var x = (y - b) / m; return y !== b && y !== 0 && Number.isInteger(x) && Math.abs(x) <= 5 && x !== 0; });
            var xbs = [3, 2, -2, 4, -3, 1, -1].filter(function (x) { return Math.abs(m * x + b) <= 6 && m * x + b !== b; });
            if (ys.length && xbs.length && Number.isInteger(-b / m) && Math.abs(-b / m) <= 5) { y1 = r.pick(ys); xb = r.pick(xbs); break; }
          }
          if (y1 == null) { m = -2; b = 4; y1 = 2; xb = 3; }
          return { m: m, b: b, y1: y1, xb: xb, f: function (x) { return m * x + b; }, fig: lineFig(m, b, 'f') };
        }, stem: function (sh) { return 'The graph of the function ' + t('f') + ' is shown. To find ' + t('f(a)') + ', start at ' + t('a') + ' on the horizontal axis and read up or down; to solve ' + t('f(x)=b') + ', start at ' + t('b') + ' on the vertical axis and read across.' + sh.fig; }, parts: [
        { id: 'e1a', level: 'BEG', make: function (r, sh) {
          return B.number('(a) State the value of ' + t('f(0)') + '.', sh.b, function (u) { if (same(u, -sh.b / sh.m) && sh.b !== 0) return { code: 'xint-yint', hint: 'That is where the line crosses the ' + t('x') + '-axis. ' + t('f(0)') + ' is the height at ' + t('x=0') + '.' }; return null; },
            'At ' + t('x=0') + ' the line crosses the vertical axis at ' + t(sh.b) + ': ' + t('f(0)=' + sh.b) + '.', ['Start at ' + t('0') + ' on the horizontal axis.'], 'EP f(0) from line', { before: t('f(0)=') });
        } },
        { id: 'e1b', level: 'BEG', make: function (r, sh) {
          var x = sh.xb, v = sh.f(x);
          return B.number('(b) State the value of ' + t('f(' + x + ')') + '.', v, function (u) { if (same(u, cl((x - sh.b) / sh.m))) return { code: 'read-reverse', hint: 'For ' + t('f(' + x + ')') + ' start at ' + t(x) + ' on the <b>horizontal</b> axis.' }; return null; },
            'Start at ' + t(x) + ' on the horizontal axis, go to the line, then read across: ' + t('f(' + x + ')=' + v) + '.', ['Input first: find ' + t(x) + ' on the ' + t('x') + '-axis.'], 'EP f(a) from line', { before: t('f(' + x + ')=') });
        } },
        { id: 'e1c', level: 'EMG', make: function (r, sh) {
          var y = sh.y1, x = cl((y - sh.b) / sh.m);
          return solvePart('(c) Solve ' + t('f(x)=' + y) + '.', [x], { b: y, rev: sh.f(y) },
            'Start at ' + t(y) + ' on the vertical axis, read across to the line, then down: ' + t('x=' + x) + '. (Check: ' + t('f(' + x + ')=' + y) + '.)', ['Here ' + t(y) + ' is an output — start on the vertical axis.'], 'EP solve f(x)=b from line');
        } },
        { id: 'e1d', level: 'EMG', make: function (r, sh) {
          var x = cl(-sh.b / sh.m);
          return solvePart('(d) Solve ' + t('f(x)=0') + '.', [x], { b: 0, diag: function (A) { return A.length === 1 && same(A[0], sh.b) ? { code: 'xint-yint', hint: 'That is ' + t('f(0)') + '. ' + t('f(x)=0') + ' asks where the height is ' + t('0') + ': where the line meets the ' + t('x') + '-axis.' } : null; } },
            'Height ' + t('0') + ' is the ' + t('x') + '-axis: the line crosses it at ' + t('x=' + x) + '.', ['Where is the height ' + t('0') + '?'], 'EP solve f(x)=0 from line');
        } },
        { id: 'e1e', level: 'LIM', make: function (r, sh) {
          var x = sh.xb, v = sh.f(x);
          return pointPart('(e) Write your answer to (b) as an ordered pair on the graph.', x, v, t('f(' + x + ')=' + v) + ' is the point ' + t(ptT([x, v])) + ': input first.', ['(input, output)'], 'EP pair from f(a)');
        } }] },
      { num: '2', shared: function (r) {
          var s = r.pick([1, 1, -1]), b = r.pick([1, 1, 0, 2, -1, -2, 3]), f = function (x) { return cl(s * x / 2 + b); };
          var ev = [-6, -4, -2, 2, 4, 6].filter(function (x) { return Math.abs(f(x)) <= 6; });
          var xa = r.pick(ev.filter(function (x) { return x > 0 && f(x) !== x && f(x) !== 0; }).concat(ev.filter(function (x) { return f(x) !== x && f(x) !== 0; })).slice(0, 3));
          var xb = r.pick(ev.filter(function (x) { return x !== xa && x < 0; }).concat(ev.filter(function (x) { return x !== xa; })).slice(0, 2));
          var xc = r.pick(ev.filter(function (x) { return x !== xa && x !== xb && f(x) !== 0; }));
          return { s: s, b: b, f: f, xa: xa, xb: xb, xc: xc, fig: lineFig(s / 2, b, 'g') };
        }, stem: function (sh) { return 'The graph of the function ' + t('g') + ' is shown.' + sh.fig; }, parts: [
        { id: 'e2a', level: 'BEG', make: function (r, sh) {
          var x = sh.xa, v = sh.f(x);
          return B.number('(a) State the value of ' + t('g(' + x + ')') + '.', v, function (u) { if (same(u, cl((x - sh.b) * 2 * sh.s))) return { code: 'read-reverse', hint: 'Start at ' + t(x) + ' on the <b>horizontal</b> axis.' }; return null; }, 'Up (or down) from ' + t(x) + ' to the line, then across: ' + t('g(' + x + ')=' + v) + '.', ['Find ' + t(x) + ' on the horizontal axis.'], 'EP g(a)', { before: t('g(' + x + ')=') });
        } },
        { id: 'e2b', level: 'BEG', make: function (r, sh) {
          var x = sh.xb, v = sh.f(x);
          return B.number('(b) State the value of ' + t('g(' + x + ')') + '.', v, null, 'From ' + t(x) + ' on the horizontal axis to the line, then across: ' + t('g(' + x + ')=' + v) + '.', ['Find ' + t(x) + ' on the horizontal axis.'], 'EP g(b)', { before: t('g(' + x + ')=') });
        } },
        { id: 'e2c', level: 'EMG', make: function (r, sh) {
          var y = sh.f(sh.xc);
          return solvePart('(c) Solve ' + t('g(x)=' + y) + '.', [sh.xc], { b: y, rev: Math.abs(y) <= 6 ? sh.f(y) : null }, 'From ' + t(y) + ' on the vertical axis, across to the line, then down: ' + t('x=' + sh.xc) + '.', ['Start on the vertical axis at ' + t(y) + '.'], 'EP solve g(x)=b');
        } },
        { id: 'e2d', level: 'EMG', make: function (r, sh) {
          var y = sh.f(sh.xa);
          return solvePart('(d) Solve ' + t('g(x)=' + y) + '.', [sh.xa], { b: y, rev: Math.abs(y) <= 6 ? sh.f(y) : null }, 'From ' + t(y) + ' on the vertical axis across to the line, then down: ' + t('x=' + sh.xa) + '.', ['Start on the vertical axis at ' + t(y) + '.'], 'EP solve g(x)=g(a)');
        } },
        { id: 'e2e', level: 'EMG', make: function (r, sh) {
          var x = sh.xa, y = sh.f(x);
          return mc(r, '(e) Parts (a) and (d) both involve the numbers ' + t(x) + ' and ' + t(y) + ', but in opposite roles. Which explanation is correct?', [
            { html: 'In (a) ' + t(x) + ' is the input given and ' + t(y) + ' is the output found; in (d) the output ' + t(y) + ' is given and the input ' + t(x) + ' is found. Same point ' + t(ptT([x, y])) + ', opposite direction.', right: true },
            { html: 'In both parts ' + t(x) + ' is the output and ' + t(y) + ' is the input.', why: 'In ' + t('g(' + x + ')') + ' the number in the brackets is the input.' },
            { html: 'They are different points on the graph: ' + t(ptT([x, y])) + ' and ' + t(ptT([y, x])) + '.', why: 'Both questions use the same point ' + t(ptT([x, y])) + ' — one reads it from left to right, the other backwards.' },
            { html: 'Part (d) is the same as finding ' + t('g(' + y + ')') + '.', why: t('g(' + y + ')') + ' would use ' + t(y) + ' as an input. In (d) ' + t(y) + ' is the output.' }],
            'Both parts are about the point ' + t(ptT([x, y])) + '. (a) travels ' + t('x\\to y') + ': input ' + t(x) + ' given, output ' + t(y) + ' found. (d) travels ' + t('y\\to x') + ': output ' + t(y) + ' given, input ' + t(x) + ' found.', ['Which number is given in each part, and which is found?'], 'EP opposite roles');
        } }] },
      { num: '3', shared: function (r) {
          var c, g, m, b, L, U;
          for (g = 0; g < 300; g++) {
            m = r.pick([1, 1, -1, 2]); b = r.pick([2, 2, 1, -1, 3, -2]); L = r.pick([-4, -4, -3, -2]); U = r.pick([4, 4, 3, 2]);
            var ys = [m * L + b, m * U + b], z = -b / m;
            if (Math.max(Math.abs(ys[0]), Math.abs(ys[1])) <= 6 && Number.isInteger(z) && z > L && z < U && U + 2 <= 6) break;
          }
          var d = function (x) { return m * x + b; }, lo = Math.min(d(L), d(U)), hi = Math.max(d(L), d(U));
          var x1 = r.pick([1, 1, 2, -1, -2].filter(function (x) { return x > L && x < U && d(x) !== 0; })), y2 = r.pick([5, 5, 4, 3, -1, -2, 1].filter(function (y) { return y > lo && y < hi && y !== 0 && Number.isInteger((y - b) / m); }));
          return { m: m, b: b, L: L, U: U, d: d, lo: lo, hi: hi, x1: x1, y2: y2, z: -b / m,
            fig: pwGraph([[L, d(L)], [U, d(U)]], { x: [-6, 6], y: [-6, 6], labels: 2, yName: 'd(x)', max: 280, aria: 'segment graph of d' }) };
        }, stem: function (sh) { return 'The graph of a function ' + t('d') + ' is shown. The solid dots mark where the graph begins and ends.' + sh.fig; }, parts: [
        { id: 'e3a', level: 'BEG', make: function (r, sh) {
          return fieldsOf('(a) Determine ' + t('d(' + sh.x1 + ')') + ' and ' + t('d(' + sh.L + ')') + '.', [valItem(t('d(' + sh.x1 + ')='), 'd(' + sh.x1 + ')', sh.d(sh.x1)), valItem(t('d(' + sh.L + ')='), 'd(' + sh.L + ')', sh.d(sh.L))],
            t('d(' + sh.x1 + ')=' + sh.d(sh.x1)) + ', ' + t('d(' + sh.L + ')=' + sh.d(sh.L)), 'Read up or down from each input: ' + t('d(' + sh.x1 + ')=' + sh.d(sh.x1)) + '; ' + t('x=' + sh.L) + ' is the left end dot, at height ' + t(sh.d(sh.L)) + '.', ['Start on the horizontal axis.'], 'EP read d(a)');
        } },
        { id: 'e3b', level: 'EMG', make: function (r, sh) {
          var x2 = cl((sh.y2 - sh.b) / sh.m);
          return BF('(b) Solve ' + t('d(x)=0') + ', then solve ' + t('d(x)=' + sh.y2) + '.', [solField(t('d(x)=0') + ':', 'x'), solField(t('d(x)=' + sh.y2) + ':', 'x')], [solsChk([sh.z], { b: 0 }), solsChk([x2], { b: sh.y2, rev: sh.d(sh.y2) })],
            ['x=' + nf(sh.z), 'x=' + nf(x2)], t('x=' + sh.z) + '; ' + t('x=' + x2), t('d(x)=0') + ' where the segment meets the ' + t('x') + '-axis: ' + t('x=' + sh.z) + '.<br>' + t('d(x)=' + sh.y2) + ': across from ' + t(sh.y2) + ' to the segment, then down: ' + t('x=' + x2) + '.', ['Both are outputs: start on the vertical axis.'], 'EP solve d(x)=b');
        } },
        { id: 'e3c', level: 'EMG', outcome: 'RF2', make: function (r, sh) {
          return drPart('(c) State the domain and range of ' + t('d') + ' in set notation.', { dv: 'x', fname: 'd', D: [sh.L, sh.U], R: [sh.lo, sh.hi] }, drSol('x', 'd', [sh.L, sh.U], [sh.lo, sh.hi]), ['The end dots are solid: both ends are included.'], 'EP D/R segment');
        } },
        { id: 'e3d', level: 'EMG', outcome: 'RF2', make: function (r, sh) {
          var x = sh.U + 2;
          return mc(r, '(d) Why does ' + t('d(' + x + ')') + ' have no value?', [
            { html: 'The graph ends at ' + t('x=' + sh.U) + ', so ' + t(x) + ' is not an allowed input: it is outside the <b>domain</b>.', right: true },
            { html: 'Because ' + t(x) + ' is not on the vertical axis.', why: t(x) + ' is an input — it belongs on the horizontal axis. Is ' + t('x=' + x) + ' covered by the graph?' },
            { html: 'Because the output would be too large to fit on the grid.', why: 'Grid size has nothing to do with it: the graph stops, so the function is not defined there.' },
            { html: 'It does have a value: continue the line to ' + t('x=' + x) + '.', why: 'The solid dot shows the graph <b>ends</b> there. We can’t assume it continues.' }],
            'The graph stops at the solid dot at ' + t('x=' + sh.U) + '. The domain — the set of allowed inputs — is ' + t(cond('x', sh.L, sh.U)) + ', so ' + t(x) + ' is not an input and ' + t('d(' + x + ')') + ' has no value.', ['What does the domain tell you?'], 'EP outside domain');
        } }] },
      { num: '4', shared: function (r) {
          var sh = vShared(r, [[2, 3, -3], [2, 3, -3], [1, 3, -2], [2, 2, -2], [1, 4, -2], [2, 3, -4], [1, 5, -3]]);
          sh.h = sh.V[1][0];
          var L = sh.V[0][0], U = sh.V[2][0], c1 = [], y1;
          for (var y = Math.ceil(sh.lo) + 1; y < sh.hi; y++) { var xs = pwSols(sh.V, y); if (xs.length === 2 && xs.every(function (x) { return Number.isInteger(x); }) && y !== 0) c1.push(y); }
          y1 = c1.length ? r.pick(c1) : midLevel(sh);
          var ins = []; for (var x = L + 1; x < U; x++) if (x !== sh.h) ins.push(x);
          sh.xs = [L, r.pick(ins.filter(function (x) { return x < sh.h; }).concat(ins.slice(0, 1))), r.pick(ins.filter(function (x) { return x > sh.h; }).concat(ins.slice(-1)))];
          sh.xs = sh.xs.filter(function (x, i, a) { return a.indexOf(x) === i; });
          sh.y1 = y1; sh.none = sh.fl > 0 ? sh.lo - 2 : sh.hi + 2; sh.L = L; sh.U = U;
          sh.fig = pwGraph(sh.V, { x: [-6, 6], y: [-6, 6], labels: 2, yName: 'h(x)', max: 280, aria: 'graph of h made of two pieces' });
          return sh;
        }, stem: function (sh) { return 'The graph of a function ' + t('h') + ' is shown, drawn only between its two endpoints.' + sh.fig; }, parts: [
        { id: 'e4a', level: 'BEG', make: function (r, sh) {
          return fieldsOf('(a) Determine ' + sh.xs.map(function (x) { return t('h(' + x + ')'); }).join(', ') + '.', sh.xs.map(function (x) { return valItem(t('h(' + x + ')='), 'h(' + x + ')', pwAt(sh.V, x)); }),
            sh.xs.map(function (x) { return t('h(' + x + ')=' + pwAt(sh.V, x)); }).join(', '), 'Read up or down from each input: ' + sh.xs.map(function (x) { return t('h(' + x + ')=' + pwAt(sh.V, x)); }).join(', ') + '.', ['Start on the horizontal axis.'], 'EP read h(a)');
        } },
        { id: 'e4b', level: 'EMG', make: function (r, sh) {
          var s0 = pwSols(sh.V, sh.y1);
          return solvePart('(b) Solve ' + t('h(x)=' + sh.y1) + '. (Careful — read across at ' + t(sh.y1) + ' and see how many times you meet the graph.)', s0, { b: sh.y1, graph: true },
            'The line ' + t('y=' + sh.y1) + ' meets the graph twice, once on each piece: ' + t(solsKey(s0)) + '.', ['Read across the <b>whole</b> graph at height ' + t(sh.y1) + '.'], 'EP solve h(x)=b two');
        } },
        { id: 'e4c', sub: 'c i', level: 'EMG', make: function (r, sh) {
          return solvePart('(c) Solve ' + t('h(x)=' + sh.k) + '.', [sh.h], { b: sh.k }, 'Height ' + t(sh.k) + ' is reached only at the corner: ' + t('x=' + sh.h) + '.', ['Read across at ' + t(sh.k) + '.'], 'EP solve h(x)=corner');
        } },
        { id: 'e4d', sub: 'c ii', level: 'PRG', make: function (r, sh) {
          var lowest = sh.fl > 0;
          return mc(r, 'Why does ' + t('h(x)=' + sh.k) + ' have only one solution, when ' + t('h(x)=' + sh.y1) + ' has two?', [
            { html: t(sh.k) + ' is the ' + (lowest ? 'lowest' : 'highest') + ' output on the graph, so only the corner point reaches it; any height between the corner and the ends is met once on each piece.', right: true },
            { html: 'Because ' + t(sh.k) + ' is negative.', why: 'The sign doesn’t matter. Where on the graph is the height ' + t(sh.k) + '?' },
            { html: 'Because a function can only have one input for each output.', why: 'Part (b) has two inputs with the same output — that is allowed. A function allows one <b>output</b> per input.' },
            { html: 'It has two solutions too; the second one is off the graph.', why: 'Everything outside the endpoints is not part of the graph, and the graph only reaches ' + t(sh.k) + ' once.' }],
            'Draw horizontal lines: at ' + t(sh.y1) + ' the line crosses both pieces, but at ' + t(sh.k) + ' — the ' + (lowest ? 'lowest' : 'highest') + ' output — it only touches the corner ' + t(ptT(sh.V[1])) + '.', ['Draw both horizontal lines on the graph.'], 'EP why one solution');
        } },
        { id: 'e4e', sub: 'd', level: 'EMG', make: function (r, sh) {
          return solvePart('(d) Solve ' + t('h(x)=' + sh.none) + ', or explain why no solution exists. (Press <b>none</b> if there is no solution.)', [], { b: sh.none, noneHint: 'The graph only goes from ' + t(sh.lo) + ' to ' + t(sh.hi) + '. Does it ever reach ' + t(sh.none) + '?' },
            '<b>No solution</b>: no point of the graph is as ' + (sh.none < sh.lo ? 'low' : 'high') + ' as ' + t(sh.none) + ' — the range is ' + t(cond('y', sh.lo, sh.hi)) + '.', ['What are the lowest and highest outputs?'], 'EP no solution');
        } },
        { id: 'e4f', sub: 'e', level: 'EMG', outcome: 'RF2', make: function (r, sh) {
          return drPart('(e) State the domain and range of ' + t('h') + ' in set notation.', { dv: 'x', fname: 'h', D: [sh.L, sh.U], R: [sh.lo, sh.hi], rW: [{ is: bld('y', Math.min(sh.V[0][1], sh.V[2][1]), Math.max(sh.V[0][1], sh.V[2][1], sh.V[0][1] + 1)), code: 'dr-peak', hint: 'Use the lowest and highest points of the whole graph — the corner counts.' }] },
            drSol('x', 'h', [sh.L, sh.U], [sh.lo, sh.hi]), ['The corner is the ' + (sh.fl > 0 ? 'lowest' : 'highest') + ' point.'], 'EP D/R V');
        } },
        { id: 'e4g', sub: 'f', level: 'PRG', outcome: 'RF2', make: function (r, sh) {
          var x = sh.U + 1, y = sh.V[2][1] + sh.s * sh.fl;
          return mc(r, '(f) A student claims ' + t('h(' + x + ')=' + y) + ' because “the graph keeps going.” Why can’t this claim be made from this graph?', [
            { html: t(x) + ' is outside the domain: the graph stops at ' + t('x=' + sh.U) + ', so nothing can be read there.', right: true },
            { html: 'Because the graph would go the other way after ' + t('x=' + sh.U) + '.', why: 'We don’t know what happens after the endpoint — that is the point.' },
            { html: 'The student is right: the right piece rises ' + t(sh.s) + ' for every ' + t('1') + ' across.', why: 'The solid dot shows the graph <b>ends</b>. A graph doesn’t tell you anything beyond its domain.' },
            { html: 'Because ' + t('h(' + x + ')') + ' must be a whole number.', why: t(y) + ' is a whole number. The problem is the input ' + t(x) + '.' }],
            'The graph is drawn only from ' + t('x=' + sh.L) + ' to ' + t('x=' + sh.U) + ' (solid end dots). ' + t(x) + ' is outside the domain, so ' + t('h(' + x + ')') + ' can’t be read from this graph.', ['Look at the endpoints.'], 'EP claim beyond domain');
        } }] },
      /* ---------------- Extra Part B ---------------- */
      { num: '5', section: 'Extra practice B — Equations, tables and ordered pairs', stem: 'Convert each as directed.', parts: [
        { id: 'e5a', level: 'BEG', make: function (r) {
          var a = r.pick([3, 3, 2, 4, 5, 6]), b = r.pick([4, 4, 1, 2, 5, 7]), rhs = lin([[a, 'x'], [-b, '']]);
          return convPart('xy', '(a) Write ' + t('f(x)=' + rhs) + ' in ' + t('x') + '-' + t('y') + ' notation.', { T: P(rhs), v: 'x', keyRhs: rhs, bad: ['f(x)=' + rhs] }, t('y=' + rhs), ['Replace ' + t('f(x)') + ' with ' + t('y') + '.'], 'EP f(x) to y');
        } },
        { id: 'e5b', level: 'EMG', make: function (r) {
          var a = r.pick([8, 8, 5, 6, 9, 12]), b = r.pick([12, 12, 5, 10, 15, 20]), rhs = lin([[a, 'n'], [b, '']]);
          return convPart('xy', '(b) Write ' + t('C(n)=' + rhs) + ' in ' + t('x') + '-' + t('y') + ' notation.', { T: P(rhs), v: 'n', keyRhs: rhs, vars: ['x'], bad: ['y=' + lin([[a, 'x'], [b, '']]), 'C(n)=' + rhs] }, t('y=' + rhs) + ' — the input stays ' + t('n') + '.', ['Only ' + t('C(n)') + ' changes, to ' + t('y') + '. Keep the ' + t('n') + '.'], 'EP C(n) to y');
        } },
        { id: 'e5c', level: 'EMG', make: function (r) {
          var c = r.pick([7, 7, 3, 5, 9, 10, 11, 12, 15]), a = r.pick([2, 2, 3, 4, 5, 6]), rhs = lin([[c, ''], [-a, 'x']]);
          return convPart('fn', '(c) Write ' + t('y=' + rhs) + ' in function notation, naming the function ' + t('f') + '.', { T: P(rhs), v: 'x', name: 'f', reqName: true, keyRhs: rhs, vars: ['g'], bad: ['y=' + rhs, 'g(x)=' + rhs] }, t('f(x)=' + rhs), ['Replace ' + t('y') + ' with ' + t('f(x)') + '.'], 'EP y to f(x)');
        } },
        { id: 'e5d', level: 'EMG', make: function (r) {
          var nm = r.pick(['P', 'P', 'Q', 'R']), v = r.pick(['w', 'w', 't', 'n']), a = r.pick([4, 4, 2, 3, 5]), b = r.pick([1, 1, 2, 3, 6]), rhs = lin([[a, v], [-b, '']]);
          return convPart('fn', '(d) Write ' + t('y=' + rhs) + ' in function notation, naming the function ' + t(nm) + ' with input ' + t(v) + '.', { T: P(rhs), v: v, name: nm, reqName: true, keyRhs: rhs, vars: ['x'], bad: [nm + '(x)=' + rhs, 'y=' + rhs] }, t(nm + '(' + v + ')=' + rhs), ['Name ' + t(nm) + ', input ' + t(v) + ' in the brackets.'], 'EP y to P(w)');
        } }] },
      { num: '6', shared: function (r) { return { c: r.pick([-5, -5, -9, -8, -7, -6, -4, -3, -2, -1, 1, 2, 3, 4, 6, 7, 8, 9]), h: r.pick(['h', 'h', 'g', 'k']) }; }, stem: 'A point ' + t('(a,\\ b)') + ' on the graph of ' + t('f') + ' and the statement ' + t('f(a)=b') + ' carry exactly the same information — the input is always written first.', parts: [
        { id: 'e6a', level: 'BEG', make: function (r) {
          var a = r.pick([3, 3, 2, 4, 5, -2, 6]), b = r.pick([11, 11, 7, 9, 13, -4, 8].filter(function (x) { return x !== a; }));
          return stmtPart('(a) The point ' + t(ptT([a, b])) + ' lies on the graph of ' + t('f') + '. Write this in function notation.', 'f', a, b, 'Input ' + t(a) + ', output ' + t(b) + ': ' + t('f(' + a + ')=' + b) + '.', ['The first coordinate goes in the brackets.'], 'EP point to f(a)=b');
        } },
        { id: 'e6b', level: 'BEG', make: function (r) {
          var a = r.pick([-2, -2, -3, -1, 4, 5]), b = r.pick([7, 7, 3, 6, 9, -5].filter(function (x) { return x !== a; }));
          return pointPart('(b) It is known that ' + t('g(' + a + ')=' + b) + '. Write the matching ordered pair.', a, b, 'Input ' + t(a) + ', output ' + t(b) + ': ' + t(ptT([a, b])) + '.', ['(input, output)'], 'EP g(a)=b to point');
        } },
        { id: 'e6c', sub: 'c i', level: 'BEG', make: function (r, sh) {
          var c = sh.c, h = sh.h;
          return stmtPart('(c) The graph of ' + t(h) + ' passes through ' + t(ptT([0, c])) + '. Write this in function notation.', h, 0, c, t(h + '(0)=' + c) + '.', ['Input ' + t('0') + ', output ' + t(c) + '.'], 'EP (0,c) to h(0)=c');
        } },
        { id: 'e6d', sub: 'c ii', level: 'BEG', outcome: 'RF5', make: function (r, sh) {
          var c = sh.c, h = sh.h;
          return mc(r, 'Which feature of the graph of ' + t(h) + ' does ' + t(h + '(0)=' + c) + ' describe?', [
            { html: 'The ' + t('y') + '-intercept: the graph crosses the vertical axis at ' + t(ptT([0, c])) + '.', right: true },
            { html: 'The ' + t('x') + '-intercept.', why: 'An ' + t('x') + '-intercept has output ' + t('0') + '. Here the <b>input</b> is ' + t('0') + '.' },
            { html: 'The highest point of the graph.', why: 'Nothing says it is the highest point. What is special about input ' + t('0') + '?' },
            { html: 'The end of the domain.', why: 'Input ' + t('0') + ' is where the graph meets the vertical axis.' }],
            'Input ' + t('0') + ' means the point is on the vertical axis: ' + t(ptT([0, c])) + ' is the ' + t('y') + '-intercept.', ['Where are all the points with input ' + t('0') + '?'], 'EP h(0) is y-intercept');
        } },
        { id: 'e6e', sub: 'd', level: 'EMG', make: function (r) {
          var a = r.pick([4, 4, 2, 3, 5, 6]), b = r.pick([9, 9, 7, 8, 10, 12].filter(function (x) { return x !== a; }));
          return stmtPart('(d) A student says ' + t(ptT([a, b])) + ' on the graph of ' + t('f') + ' means ' + t('f(' + b + ')=' + a) + '. Write the correct statement.', 'f', a, b, 'The input is written first, so ' + t(ptT([a, b])) + ' means input ' + t(a) + ', output ' + t(b) + ': ' + t('f(' + a + ')=' + b) + '.', ['Which coordinate goes in the brackets?'], 'EP correct swapped statement');
        } }] },
      { num: '7', shared: function (r) {
          var m = r.pick([-2, -2, -3, 2, 3, 4]), b = r.pick([1, 1, -1, 2, 3, 4, -2, -3, 0]), xs = [-3, -1, 0, 2, 5];
          var f = function (x) { return m * x + b; };
          return { m: m, b: b, xs: xs, f: f, xq: r.pick([2, 2, -1, 5, -3]), xt: r.pick([10, 10, 8, 6, -5]) };
        }, stem: function (sh) { return 'The table below lists some values of a linear function ' + t('f') + '.' + HW.valueTable([[t('x')].concat(sh.xs.map(function (x) { return t(x); })), [t('f(x)')].concat(sh.xs.map(function (x) { return t(sh.f(x)); }))]); }, parts: [
        { id: 'e7a', level: 'EMG', make: function (r, sh) {
          var fl = [1, 2, 3].map(function (i) { return { label: 'Statement ' + i + ':', name: 'Statement ' + i, mode: 'math', keys: EQK, vars: ['f'], placeholder: 'e.g. f(2) = 5' }; });
          var check = function (resp) {
            resp = resp || [];
            if (resp.some(function (x) { return !String(x || '').trim(); })) return form('incomplete', 'Write three statements, one in each box.');
            var seen = [];
            for (var i = 0; i < 3; i++) {
              var s = stmtRead(resp[i]);
              if (s && s.pair) return form('stmt-pair', '<b>Statement ' + (i + 1) + '</b> is an ordered pair. Write it in function notation, ' + t('f(\\text{input})=\\text{output}') + '.');
              if (!s) return form('stmt-unreadable', '<b>Statement ' + (i + 1) + ':</b> write it like ' + t('f(0)=' + sh.b) + '.');
              if (s.name !== 'f') return wrong('stmt-name', '<b>Statement ' + (i + 1) + ':</b> the function is named ' + t('f') + '.');
              var col = sh.xs.filter(function (x) { return same(x, s.a) && same(sh.f(x), s.b); })[0];
              if (col == null) {
                if (sh.xs.some(function (x) { return same(x, s.b) && same(sh.f(x), s.a); })) return wrong('stmt-swap', '<b>Statement ' + (i + 1) + ':</b> input and output are swapped — the top-row number goes in the brackets.');
                return wrong('u5l10-not-table', '<b>Statement ' + (i + 1) + ':</b> ' + t('f(' + nf(s.a) + ')=' + nf(s.b)) + ' is not in the table. Pick a column: the top number is the input, the bottom number is the output.');
              }
              if (seen.indexOf(col) >= 0) return form('duplicate', 'Use three <b>different</b> columns of the table.');
              seen.push(col);
            }
            return ok();
          };
          var key = sh.xs.slice(0, 3).map(function (x) { return 'f(' + x + ')=' + sh.f(x); });
          var p = { prompt: '(a) Write three statements in function notation that the table tells you.', input: { type: 'fields', fields: fl }, check: check, key: key, answer: 'e.g. ' + [0, 2, 4].map(function (i) { return t('f(' + sh.xs[i] + ')=' + sh.f(sh.xs[i])); }).join(', '),
            solution: 'Each column is one statement ' + t('f(\\text{top})=\\text{bottom}') + ':<br>' + sh.xs.map(function (x) { return t('f(' + x + ')=' + sh.f(x)); }).join(', ') + ' — any three of these.', hints: ['Each column gives one statement: the top number goes in the brackets.'], text: 'EP statements from table' };
          p.good = [sh.xs.slice(2).map(function (x) { return 'f(' + x + ')=' + sh.f(x); })];
          p.bad = [[key[0], key[0], key[1]], sh.xs.slice(0, 3).map(function (x) { return 'f(' + sh.f(x) + ')=' + x; })].filter(function (b) { return b[0] !== b[1] || true; });
          return p;
        } },
        { id: 'e7b', level: 'BEG', make: function (r, sh) {
          var y = sh.f(sh.xq);
          return solvePart('(b) Use the table to solve ' + t('f(x)=' + y) + '.', [sh.xq], { b: y }, 'Find ' + t(y) + ' in the ' + t('f(x)') + ' row; the input above it is ' + t('x=' + sh.xq) + '.', ['Look for ' + t(y) + ' in the bottom row.'], 'EP solve from table');
        } },
        { id: 'e7c', level: 'ADV', outcome: 'RF4', make: function (r, sh) {
          var m = sh.m, b = sh.b, rhs = lin([[m, 'x'], [b, '']]);
          return convPart('fn', '(c) The inputs do not go up in equal steps, so compare a pair of columns carefully to find how much ' + t('f(x)') + ' changes per unit of ' + t('x') + '. Then write the rule in the form ' + t('f(x)=mx+b') + '.', { T: P(rhs), v: 'x', name: 'f', reqName: true, keyRhs: rhs,
            wrong: [{ is: P(lin([[2 * m, 'x'], [b, '']])), code: 'diag', hint: 'From ' + t('x=0') + ' to ' + t('x=2') + ' is <b>two</b> steps: divide the change in ' + t('f(x)') + ' by ' + t('2') + '.' }, { is: P(lin([[-m, 'x'], [b, '']])), code: 'sign', hint: 'Check the sign of the rate: does ' + t('f(x)') + ' go up or down as ' + t('x') + ' increases?' }, { is: P(lin([[m, 'x'], [sh.f(-1), '']])), code: 'diag', hint: t('b') + ' is the output at ' + t('x=0') + ': read it from the table.' }] },
            'From ' + t('x=0') + ' to ' + t('x=2') + ' the output changes from ' + t(b) + ' to ' + t(sh.f(2)) + ', that is ' + t(2 * m) + ' over ' + t('2') + ' steps, so ' + t('m=' + m) + '. And ' + t('b=f(0)=' + b) + '.<br>' + t('f(x)=' + rhs),
            ['Use the columns ' + t('x=0') + ' and ' + t('x=2') + ': how much does ' + t('f(x)') + ' change, and over how many steps?', t('b') + ' is ' + t('f(0)') + '.'], 'EP rule from uneven table');
        } },
        { id: 'e7d', level: 'PRG', make: function (r, sh) {
          var x = sh.xt, v = sh.f(x);
          return B.number('(d) Use your rule to determine ' + t('f(' + x + ')') + ', a value the table does not show.', v, function (u) { if (same(u, sh.m * x - sh.b) || same(u, -sh.m * x + sh.b)) return { code: 'sign', hint: 'Check the signs: ' + t('f(' + x + ')=' + sh.m + par(x) + sgn(sh.b)) + '.' }; return null; },
            t('f(' + x + ')=' + sh.m + par(x) + sgn(sh.b) + '=' + v), ['Substitute ' + t('x=' + x) + ' into your rule from (c).'], 'EP f(10) from rule', { before: t('f(' + x + ')=') });
        } }] },
      { num: '8', shared: function (r) { var m = r.pick([-2, -2, -3, 2, 3, -1]), b = r.pick([5, 5, 1, 2, 3, 4, -1]); return { m: m, b: b, f: function (x) { return m * x + b; }, xs: [-2, -1, 0, 1, 2, 3], xq: r.pick([3, 3, 2, -2, 1]) }; },
        stem: function (sh) { return 'Let ' + t('f(x)=' + lin([[sh.m, 'x'], [sh.b, '']])) + '.'; }, parts: [
        { id: 'e8a', level: 'BEG', make: function (r, sh) {
          return fnTable('(a) Complete the table of values.', 'f', 'x', sh.xs, sh.f, function (x, u) { if (x !== 0 && same(u, -sh.m * x + sh.b)) return { code: 'ev-sign', hint: 'Check the sign: ' + t(sh.m + par(x) + '=' + sh.m * x) + '.' }; return null; },
            sh.xs.map(function (x) { return t('f(' + x + ')=' + sh.m + par(x) + sgn(sh.b) + '=' + sh.f(x)); }).join('<br>'), ['Substitute each input, brackets around negatives.'], 'EP table');
        } },
        { id: 'e8b', level: 'BEG', make: function (r, sh) {
          var rhs = lin([[sh.m, 'x'], [sh.b, '']]);
          return convPart('xy', '(b) Write the same rule in ' + t('x') + '-' + t('y') + ' notation.', { T: P(rhs), v: 'x', keyRhs: rhs, bad: ['f(x)=' + rhs] }, t('y=' + rhs), ['Replace ' + t('f(x)') + ' with ' + t('y') + '.'], 'EP to y');
        } },
        { id: 'e8c', level: 'LIM', make: function (r, sh) {
          var pr = sh.xs.map(function (x) { return [x, sh.f(x)]; });
          return B.pairs('(c) Write the six ordered pairs from your table.', pr, {}, pr.map(function (p) { return t(ptT(p)); }).join(', '), ['(input, output) for each column.'], 'EP six pairs');
        } },
        { id: 'e8d', level: 'EMG', make: function (r, sh) {
          var y = sh.f(sh.xq);
          return B.number('(d) Use the table to solve ' + t('f(x)=' + y) + ', then confirm your answer from the rule.', sh.xq, function (u) { if (same(u, sh.f(y))) return { code: 'ev-instead', hint: t(y) + ' is the <b>output</b>. Find it in the ' + t('f(x)') + ' row.' }; return null; },
            'The table shows ' + t('f(' + sh.xq + ')=' + y) + ', so ' + t('x=' + sh.xq) + '. Check: ' + t(sh.m + par(sh.xq) + sgn(sh.b) + '=' + y) + ' ✓', ['Find ' + t(y) + ' in the bottom row of your table.'], 'EP solve with table', { before: t('x=') });
        } }] },
      /* ---------------- Extra Part C: models ---------------- */
      { num: '9', section: 'Extra practice C — Real-world models: evaluate, interpret, solve, restrict', shared: function (r) {
          var Fx = r.pick([25, 25, 20, 30, 35, 40]), rate = r.pick([15, 15, 10, 12, 20]), H = r.pick([8, 8, 6, 10]), t1 = r.pick([4, 4, 2, 3, 5].filter(function (x) { return x < H; }));
          return { Fx: Fx, rate: rate, H: H, t1: t1, C: function (x) { return Fx + rate * x; } };
        }, stem: function (sh) { return 'A shop rents kayaks. The total charge, in dollars, for a rental of ' + t('t') + ' hours is ' + t('C(t)=' + sh.Fx + '+' + sh.rate + 't') + '. The shop is open for ' + t(sh.H) + ' hours a day, and a kayak must be returned the same day.'; }, parts: [
        { id: 'e9a', sub: 'a i', level: 'BEG', make: function (r, sh) {
          return fieldsOf('(a) Determine ' + t('C(0)') + ' and ' + t('C(' + sh.t1 + ')') + '.', [valItem(t('C(0)=\\$'), 'C(0)', sh.Fx), valItem(t('C(' + sh.t1 + ')=\\$'), 'C(' + sh.t1 + ')', sh.C(sh.t1), function (u) { if (same(u, sh.rate * sh.t1)) return { code: 'no-fixed', hint: 'Add the fixed charge ' + t('\\$' + sh.Fx) + '.' }; return null; })],
            t('C(0)=' + sh.Fx) + ', ' + t('C(' + sh.t1 + ')=' + sh.C(sh.t1)), t('C(0)=' + sh.Fx + '+' + sh.rate + '(0)=' + sh.Fx) + '<br>' + t('C(' + sh.t1 + ')=' + sh.Fx + '+' + sh.rate + '(' + sh.t1 + ')=' + sh.C(sh.t1)), ['Substitute each time.'], 'EP C(0), C(t1)');
        } },
        { id: 'e9b', sub: 'a ii', level: 'EMG', make: function (r, sh) {
          var v = sh.C(sh.t1);
          return meaningMC(r, 'What does ' + t('C(' + sh.t1 + ')=' + v) + ' tell a customer?', 'A ' + t(sh.t1) + '-hour rental costs ' + t('\\$' + v) + ' in total.', [
            { html: 'A ' + t(v) + '-hour rental costs ' + t('\\$' + sh.t1) + '.', why: 'Input and output are swapped: the input ' + t(sh.t1) + ' is the time in hours.' },
            { html: 'Each hour costs ' + t('\\$' + v) + '.', why: t('\\$' + v) + ' is the total for ' + t(sh.t1) + ' hours, including the fixed charge.' },
            { html: 'After ' + t(sh.t1) + ' hours the customer gets ' + t('\\$' + v) + ' back.', why: t('C(t)') + ' is the charge the customer pays.' }],
            'Input ' + t(sh.t1) + ' hours, output ' + t('\\$' + v) + ': renting a kayak for ' + t(sh.t1) + ' hours costs ' + t('\\$' + v) + '.', ['Input: hours. Output: total charge.'], 'EP meaning C(t1)');
        } },
        { id: 'e9c', sub: 'b', level: 'EMG', make: function (r, sh) {
          return mc(r, '(b) What do the ' + t(sh.Fx) + ' and the ' + t(sh.rate) + ' each represent in this situation?', [
            { html: t('\\$' + sh.Fx) + ' is the fixed charge just to take a kayak out; ' + t('\\$' + sh.rate) + ' is the cost for each hour.', right: true },
            { html: t('\\$' + sh.Fx) + ' is the cost for each hour; ' + t('\\$' + sh.rate) + ' is the fixed charge.', why: 'The number multiplied by ' + t('t') + ' is the one that grows with each hour.' },
            { html: t(sh.Fx) + ' is the number of kayaks; ' + t(sh.rate) + ' is the number of hours.', why: 'Both numbers are amounts of money in the charge.' },
            { html: t('\\$' + sh.Fx) + ' is the charge for the first hour; ' + t('\\$' + sh.rate) + ' is the charge for each hour after that.', why: 'At ' + t('t=0') + ' the charge is already ' + t('\\$' + sh.Fx) + ', so ' + t(sh.Fx) + ' is paid before any time passes.' }],
            'The constant ' + t(sh.Fx) + ' is the starting value: a fixed ' + t('\\$' + sh.Fx) + ' charge even for ' + t('0') + ' hours. The coefficient ' + t(sh.rate) + ' is the rate of change: ' + t('\\$' + sh.rate) + ' per hour.', ['Which number is multiplied by the hours?'], 'EP meaning of constants');
        } },
        { id: 'e9d', sub: 'c i', level: 'EMG', make: function (r, sh) {
          var y = sh.C(sh.H);
          return B.number('(c) Solve ' + t('C(t)=' + y) + '.', sh.H, function (u) { if (same(u, sh.C(y))) return { code: 'ev-instead', hint: t(y) + ' is the charge (the output): solve ' + t(sh.Fx + '+' + sh.rate + 't=' + y) + '.' }; if (Math.abs(u - y / sh.rate) < 1e-6) return { code: 'no-fixed', hint: 'Subtract the fixed charge first.' }; return null; },
            t(sh.Fx + '+' + sh.rate + 't=' + y) + '<br>' + t(sh.rate + 't=' + (y - sh.Fx)) + '<br>' + t('t=' + sh.H), ['The charge is the output.'], 'EP solve C(t)=b', { before: t('t='), after: 'hours' });
        } },
        { id: 'e9e', sub: 'c ii', level: 'EMG', make: function (r, sh) {
          var y = sh.C(sh.H);
          return meaningMC(r, 'What does the answer to ' + t('C(t)=' + y) + ' mean?', 'A charge of ' + t('\\$' + y) + ' means the kayak was out for ' + t(sh.H) + ' hours — the whole day.', [
            { html: 'A ' + t(sh.H) + '-dollar rental lasts ' + t(y) + ' hours.', why: 'Swapped: ' + t(y) + ' is the charge, ' + t(sh.H) + ' is the time.' },
            { html: 'The shop charges ' + t('\\$' + y) + ' per hour.', why: t('\\$' + y) + ' is the total charge, not the hourly rate.' },
            { html: 'The customer can rent ' + t(sh.H) + ' kayaks for ' + t('\\$' + y) + '.', why: 'The input ' + t('t') + ' is time in hours, not a number of kayaks.' }],
            t('t=' + sh.H) + ': a ' + t('\\$' + y) + ' charge means the kayak was rented for ' + t(sh.H) + ' hours.', ['What is ' + t('t') + '?'], 'EP meaning of solution');
        } },
        { id: 'e9f', sub: 'd', level: 'PRG', outcome: 'RF2', make: function (r, sh) {
          return drPart('(d) State a sensible domain and range for ' + t('C') + ' in set notation.', { dv: 't', fname: 'C', D: [0, sh.H], R: [sh.Fx, sh.C(sh.H)], rW: [{ is: bld('y', 0, sh.C(sh.H)), code: 'dr-from-zero', hint: 'Even a 0-hour rental costs the fixed charge: the range starts at ' + t('C(0)=' + sh.Fx) + '.' }] },
            'The rental lasts from ' + t('0') + ' to ' + t(sh.H) + ' hours (the shop’s opening hours):<br>' + drSol('t', 'C', [0, sh.H], [sh.Fx, sh.C(sh.H)]), ['Domain: from 0 hours to the longest possible rental.', 'Range: the charge at both ends.'], 'EP D/R kayak');
        } }] },
      { num: '10', shared: function (r) {
          var V0, rate, Te, g;
          for (g = 0; g < 200; g++) { V0 = r.pick([600, 600, 400, 480, 500, 720, 360, 540, 800, 900]); rate = r.pick([40, 40, 20, 25, 30, 50, 60, 45, 36]); Te = V0 / rate; if (Number.isInteger(Te) && Te >= 8 && Te <= 24) break; }
          if (!Number.isInteger(Te) || Te < 8 || Te > 24) { V0 = 600; rate = 40; Te = 15; }
          var t1 = r.pick([5, 5, 2, 3, 4, 6].filter(function (x) { return x < Te; })), t2 = r.pick([9, 9, 6, 7, 8, 10, 11].filter(function (x) { return x < Te && x !== t1; }));
          return { V0: V0, rate: rate, Te: Te, t1: t1, t2: t2, V: function (x) { return V0 - rate * x; } };
        }, stem: function (sh) { return 'A tank holding ' + t(sh.V0) + ' litres is drained at a steady rate. The volume remaining, in litres, ' + t('t') + ' minutes after the valve is opened is ' + t('V(t)=' + sh.V0 + '-' + sh.rate + 't') + '.'; }, parts: [
        { id: 'e10a', sub: 'a i', level: 'BEG', make: function (r, sh) {
          return fieldsOf('(a) Determine ' + t('V(0)') + ' and ' + t('V(' + sh.t1 + ')') + '.', [valItem(t('V(0)='), 'V(0)', sh.V0, null, 'L'), valItem(t('V(' + sh.t1 + ')='), 'V(' + sh.t1 + ')', sh.V(sh.t1), function (u) { if (same(u, sh.rate * sh.t1)) return { code: 'value', hint: 'That is how much has drained. Subtract it from ' + t(sh.V0) + '.' }; if (same(u, sh.V0 + sh.rate * sh.t1)) return { code: 'sign', hint: 'The tank is draining: subtract.' }; return null; }, 'L')],
            t('V(0)=' + sh.V0) + ', ' + t('V(' + sh.t1 + ')=' + sh.V(sh.t1)), t('V(0)=' + sh.V0 + '-' + sh.rate + '(0)=' + sh.V0) + '<br>' + t('V(' + sh.t1 + ')=' + sh.V0 + '-' + sh.rate + '(' + sh.t1 + ')=' + sh.V(sh.t1)), ['Substitute each time.'], 'EP V(0), V(t1)');
        } },
        { id: 'e10b', sub: 'a ii', level: 'EMG', make: function (r, sh) {
          var v = sh.V(sh.t1);
          return meaningMC(r, 'Which sentence interprets both values correctly?', t('V(0)=' + sh.V0) + ': the tank held ' + t(sh.V0) + ' L when the valve was opened; ' + t('V(' + sh.t1 + ')=' + v) + ': after ' + t(sh.t1) + ' min, ' + t(v) + ' L remain.', [
            { html: t('V(0)=' + sh.V0) + ': the tank is empty; ' + t('V(' + sh.t1 + ')=' + v) + ': ' + t(v) + ' L have drained out after ' + t(sh.t1) + ' min.', why: t('V(t)') + ' is the volume <b>remaining</b> in the tank.' },
            { html: t('V(0)=' + sh.V0) + ': ' + t(sh.V0) + ' L drain each minute; ' + t('V(' + sh.t1 + ')=' + v) + ': after ' + t(v) + ' min, ' + t(sh.t1) + ' L remain.', why: 'The rate is ' + t(sh.rate) + ' L/min, and the input ' + t(sh.t1) + ' is the time.' },
            { html: t('V(0)=' + sh.V0) + ': the tank held ' + t(sh.V0) + ' L at the start; ' + t('V(' + sh.t1 + ')=' + v) + ': ' + t(v) + ' L drain every ' + t(sh.t1) + ' min.', why: t('V(' + sh.t1 + ')') + ' is the amount left at one moment, not a rate.' }],
            t('V(0)=' + sh.V0) + ' is the starting volume. ' + t('V(' + sh.t1 + ')=' + v) + ': ' + t(sh.t1) + ' minutes after the valve is opened, ' + t(v) + ' L remain in the tank.', ['' + t('V(t)') + ' is the volume left in the tank.'], 'EP meaning V values');
        } },
        { id: 'e10c', sub: 'b', level: 'EMG', make: function (r, sh) {
          var y = sh.V(sh.t2);
          return B.number('(b) Solve ' + t('V(t)=' + y) + '. (The answer means: ' + t(y) + ' L are left after this many minutes.)', sh.t2, function (u) {
            if (same(u, sh.V(y))) return { code: 'ev-instead', hint: t(y) + ' is the volume (the output): solve ' + t(sh.V0 + '-' + sh.rate + 't=' + y) + '.' };
            if (same(u, cl(y / sh.rate))) return { code: 'value', hint: 'Subtract from ' + t(sh.V0) + ' first: ' + t('-' + sh.rate + 't=' + y + '-' + sh.V0) + '.' };
            if (same(u, -sh.t2)) return { code: 'sign', hint: 'Dividing a negative by a negative gives a positive time.' };
            return null;
          }, t(sh.V0 + '-' + sh.rate + 't=' + y) + '<br>' + t('-' + sh.rate + 't=' + (y - sh.V0)) + '<br>' + t('t=' + sh.t2) + ': ' + t(y) + ' L are left after ' + t(sh.t2) + ' minutes.', ['The volume is the output: solve ' + t('V(t)=' + y) + '.'], 'EP solve V(t)=b', { before: t('t='), after: 'min' });
        } },
        { id: 'e10d', sub: 'c', level: 'EMG', make: function (r, sh) {
          var V0 = sh.V0, rate = sh.rate, Te = sh.Te, Tpoly = P(V0 + '-' + rate + 't');
          var eqChk = function (resp) {
            var s = clean(resp).replace(/\s+/g, '');
            if (!s) return form('empty', 'Write the equation you solve, in function notation.');
            var parts = s.split('='); if (parts.length !== 2) return form('conv-no-eq', 'Write an <b>equation</b>, e.g. ' + t('V(t)=\\ldots') + '.');
            var L = parts[0], R = parts[1];
            if (R !== '0' && L === '0') { L = parts[1]; R = '0'; }
            var li = lhsInfo(L);
            if (li.kind === 'fn' && li.name === 'V' && li.arg === '0') return wrong('solve-instead', t('V(0)') + ' is the volume at the start. The tank is empty when the <b>output</b> is ' + t('0') + ': ' + t('V(t)=0') + '.');
            if (R !== '0') { if (li.kind === 'fn' && li.name === 'V') return wrong('u5l10-eq-zero', 'Empty means the volume left is ' + t('0') + ' L: set ' + t('V(t)') + ' equal to ' + t('0') + '.'); return form('unreadable', 'Write it in function notation: ' + t('V(t)=\\ldots') + '.'); }
            if (li.kind === 'fn' && li.name === 'V' && li.arg === 't') return ok();
            if (li.kind === 'fn') return wrong('stmt-name', 'Use the function ' + t('V') + ' with input ' + t('t') + ': ' + t('V(t)=0') + '.');
            var pp = PL.parse(L); if (pp && PL.eq && (function () { try { return PL.eq(pp, Tpoly); } catch (e) { return false; } })()) return form('u5l10-fn', 'Right equation — now write it in <b>function notation</b>: ' + t('V(t)=0') + '.');
            return wrong('u5l10-eq-zero', 'Empty means the volume left is ' + t('0') + ': write ' + t('V(t)=0') + '.');
          };
          var fl = [{ label: 'Equation:', name: 'Equation', mode: 'math', keys: EQK, vars: ['V', 't'], placeholder: 'e.g. V(t) = 100' }, { label: 'Time to empty: ' + t('t='), name: 'Time', mode: 'math', keys: 'fraction', after: 'min' }];
          var p = BF('(c) How long does the tank take to empty completely? Write the equation you solve using function notation, then solve it.', fl, [eqChk, K.value(Te, { diag: function (u) { if (same(u, V0)) return { code: 'solve-instead', hint: t(V0) + ' L is the starting volume. Solve ' + t(V0 + '-' + rate + 't=0') + '.' }; if (same(u, cl(rate / V0))) return { code: 'nr-flip', hint: 'Divide the other way: ' + t(V0 + '\\div ' + rate) + '.' }; return null; } })],
            ['V(t)=0', String(Te)], t('V(t)=0') + ', ' + t('t=' + Te) + ' min', 'Empty means ' + t('V(t)=0') + ':<br>' + t(V0 + '-' + rate + 't=0') + '<br>' + t(rate + 't=' + V0) + '<br>' + t('t=' + Te) + ' minutes.', ['The tank is empty when the volume (the output) is ' + t('0') + '.'], 'EP V(t)=0');
          p.good = [['0=V(t)', String(Te)]]; p.bad = [['V(0)', String(Te)], ['V(t)=0', String(V0)]];
          return p;
        } },
        { id: 'e10e', sub: 'd', level: 'PRG', outcome: 'RF2', make: function (r, sh) {
          return drPart('(d) State a sensible domain and range for ' + t('V') + ' in set notation.', { dv: 't', fname: 'V', D: [0, sh.Te], R: [0, sh.V0], dC: { 'set-arrow': 'Draining stops when the tank is empty, at ' + t('t=' + sh.Te) + ': the domain has an end.' } },
            'From the valve opening (' + t('t=0') + ') until the tank is empty (' + t('t=' + sh.Te) + '):<br>' + drSol('t', 'V', [0, sh.Te], [0, sh.V0]), ['Domain: from opening the valve until the tank is empty.'], 'EP D/R drain');
        } }] },
      { num: '11', shared: function (r) {
          var T0, rate, H, g;
          for (g = 0; g < 200; g++) { T0 = r.pick([20, 20, 15, 18, 24, 12]); rate = r.pick([6, 6, 5, 4, 7]); H = r.pick([10, 10, 8, 12]); if (T0 - rate * H < 0 && T0 - rate * H >= -60) break; }
          var ha = r.pick([3, 3, 2, 1].filter(function (x) { return T0 - rate * x > 0; })), hs = r.pick([6, 6, 5, 7, 8].filter(function (x) { return x < H && T0 - rate * x < 0; }));
          return { T0: T0, rate: rate, H: H, ha: ha || 1, hs: hs || H - 1, T: function (x) { return T0 - rate * x; } };
        }, stem: function (sh) { return 'As a weather balloon rises, the air temperature drops steadily. The temperature, in degrees Celsius, at an altitude of ' + t('h') + ' kilometres is ' + t('T(h)=' + sh.T0 + '-' + sh.rate + 'h') + '. The balloon rises to a maximum altitude of ' + t(sh.H) + ' km.'; }, parts: [
        { id: 'e11a', sub: 'a i', level: 'BEG', make: function (r, sh) {
          return fieldsOf('(a) Determine ' + t('T(0)') + ' and ' + t('T(' + sh.ha + ')') + '.', [valItem(t('T(0)='), 'T(0)', sh.T0, null, '°C'), valItem(t('T(' + sh.ha + ')='), 'T(' + sh.ha + ')', sh.T(sh.ha), function (u) { if (same(u, sh.T0 + sh.rate * sh.ha)) return { code: 'sign', hint: 'The temperature drops: subtract.' }; return null; }, '°C')],
            t('T(0)=' + sh.T0) + ', ' + t('T(' + sh.ha + ')=' + sh.T(sh.ha)), t('T(0)=' + sh.T0) + '<br>' + t('T(' + sh.ha + ')=' + sh.T0 + '-' + sh.rate + '(' + sh.ha + ')=' + sh.T(sh.ha)), ['Substitute each altitude.'], 'EP balloon values');
        } },
        { id: 'e11b', sub: 'a ii', level: 'EMG', make: function (r, sh) {
          var v = sh.T(sh.ha);
          return meaningMC(r, 'What does ' + t('T(' + sh.ha + ')=' + v) + ' mean?', 'At an altitude of ' + t(sh.ha) + ' km the air temperature is ' + t(v + DEG) + '.', [
            { html: 'At an altitude of ' + t(v) + ' km the temperature is ' + t(sh.ha + DEG) + '.', why: 'Swapped: the input ' + t(sh.ha) + ' is the altitude.' },
            { html: 'The temperature drops ' + t(v + DEG) + ' every ' + t(sh.ha) + ' km.', why: t('T(' + sh.ha + ')') + ' is the temperature at one altitude, not a drop.' },
            { html: 'After ' + t(sh.ha) + ' hours the temperature is ' + t(v + DEG) + '.', why: 'The input ' + t('h') + ' here is an altitude in kilometres, not a time.' }],
            'Input ' + t(sh.ha) + ' km, output ' + t(v + DEG) + '. (And ' + t('T(0)=' + sh.T0) + ' is the ground-level temperature.)', ['What does ' + t('h') + ' measure here?'], 'EP meaning T(h)');
        } },
        { id: 'e11c', sub: 'b', level: 'EMG', make: function (r, sh) {
          var y = sh.T(sh.hs);
          return B.number('(b) Solve ' + t('T(h)=' + y) + '. (The answer is the altitude where the temperature is ' + t(y + DEG) + '.)', sh.hs, function (u) {
            if (same(u, -sh.hs)) return { code: 'sign', hint: 'Dividing a negative by a negative gives a positive altitude.' };
            if (same(u, sh.T(y))) return { code: 'ev-instead', hint: t(y) + ' is a temperature (the output): solve ' + t(sh.T0 + '-' + sh.rate + 'h=' + y) + '.' };
            return null;
          }, t(sh.T0 + '-' + sh.rate + 'h=' + y) + '<br>' + t('-' + sh.rate + 'h=' + (y - sh.T0)) + '<br>' + t('h=' + sh.hs) + ': the temperature is ' + t(y + DEG) + ' at an altitude of ' + t(sh.hs) + ' km.', ['Subtract ' + t(sh.T0) + ', then divide by ' + t('-' + sh.rate) + '.'], 'EP solve T(h)=b', { before: t('h='), after: 'km' });
        } },
        { id: 'e11d', sub: 'c', level: 'BEG', make: function (r, sh) {
          var v = sh.T(sh.H);
          return B.number('(c) Determine the temperature at the balloon’s highest point.', v, function (u) { if (same(u, -v)) return { code: 'sign', hint: t(sh.T0 + '-' + sh.rate * sh.H) + ' is negative.' }; return null; }, 'The highest point is ' + t('h=' + sh.H) + ': ' + t('T(' + sh.H + ')=' + sh.T0 + '-' + sh.rate + '(' + sh.H + ')=' + v) + DEG.replace('\\,', ' '), ['The highest point is the maximum altitude, ' + t(sh.H) + ' km.'], 'EP T(max)', { after: '°C' });
        } },
        { id: 'e11e', sub: 'd', level: 'PRG', outcome: 'RF2', make: function (r, sh) {
          return drPart('(d) State a sensible domain and range for ' + t('T') + ' in set notation.', { dv: 'h', fname: 'T', D: [0, sh.H], R: [sh.T(sh.H), sh.T0], rW: [{ is: bld('y', 0, sh.T0), code: 'dr-context', hint: 'The temperature goes below zero: the coldest is at the highest point, ' + t('T(' + sh.H + ')=' + sh.T(sh.H)) + '.' }] },
            'Altitude runs from ' + t('0') + ' (the ground) to ' + t(sh.H) + ' km:<br>' + drSol('h', 'T', [0, sh.H], [sh.T(sh.H), sh.T0]), ['Range: the temperatures at the ground and at the top.'], 'EP D/R balloon');
        } }] },
      { num: '12', shared: function (r) {
          var Fx = r.pick([25, 25, 20, 30]), rate = r.pick([15, 15, 10, 12, 20]), V0 = r.pick([600, 600, 400, 480]), dr = V0 === 480 ? r.pick([40, 30, 60]) : r.pick([40, 40, 20, 50]);
          return { Fx: Fx, rate: rate, V0: V0, dr: dr, Te: V0 / dr };
        }, stem: function (sh) { return '<b>Intercepts in context.</b> A kayak rental costs ' + t('C(t)=' + sh.Fx + '+' + sh.rate + 't') + ' dollars for ' + t('t') + ' hours, and a draining tank holds ' + t('V(t)=' + sh.V0 + '-' + sh.dr + 't') + ' litres after ' + t('t') + ' minutes. An intercept is just a function value at a boundary: the vertical intercept is the output when the input is ' + t('0') + ', and a horizontal intercept is an input whose output is ' + t('0') + '.'; }, parts: [
        { id: 'e12a', level: 'EMG', outcome: 'RF5', make: function (r, sh) {
          return mc(r, '(a) The graph of ' + t('C') + ' meets the vertical axis at ' + t(ptT([0, sh.Fx])) + '. What does this point mean to a customer?', [
            { html: 'Renting for ' + t('0') + ' hours still costs ' + t('\\$' + sh.Fx) + ' — it is the fixed fee.', right: true },
            { html: 'The rental is free for the first ' + t(sh.Fx) + ' minutes.', why: 'The point says the <b>cost</b> is ' + t('\\$' + sh.Fx) + ' when the time is ' + t('0') + '.' },
            { html: 'Each hour costs ' + t('\\$' + sh.Fx) + '.', why: 'The hourly cost is ' + t('\\$' + sh.rate) + '. The intercept is the cost before any time passes.' },
            { html: 'A customer can rent for at most ' + t(sh.Fx) + ' hours.', why: 'The output of ' + t('C') + ' is a cost in dollars, not a time.' }],
            t('C(0)=' + sh.Fx) + ': at ' + t('t=0') + ' hours the charge is already ' + t('\\$' + sh.Fx) + ' — the fixed fee for taking a kayak out.', ['What are the input and output at this point?'], 'EP meaning vertical intercept');
        } },
        { id: 'e12b', level: 'PRG', outcome: 'RF5', make: function (r, sh) {
          var z = frT(-sh.Fx, sh.rate);
          return mc(r, '(b) Solving ' + t('C(t)=0') + ' gives ' + t('t=' + z) + '. Why is this number real mathematics but meaningless here?', [
            { html: 'A negative ' + t('t') + ' would be time before the rental began, which can’t happen — and the charge never actually reaches ' + t('\\$0') + '.', right: true },
            { html: 'Because the algebra is wrong: the answer should be positive.', why: 'Check: ' + t(sh.Fx + '+' + sh.rate + '\\left(' + z + '\\right)=0') + '. The algebra is fine; the input is outside the domain.' },
            { html: 'Because it is a fraction, and time must be a whole number.', why: 'Parts of an hour are fine. Look at the sign.' },
            { html: 'It means the kayak was returned early, so the customer gets money back.', why: 'The model says nothing about refunds. A negative time is before the rental started.' }],
            t(sh.Fx + '+' + sh.rate + 't=0\\Rightarrow t=' + z) + ' is correct algebra, but a negative time is before the rental began. The domain starts at ' + t('t=0') + ', where the charge is already ' + t('\\$' + sh.Fx) + ', so the charge is never ' + t('\\$0') + '.', ['Is the answer in the domain?'], 'EP horizontal intercept meaningless');
        } },
        { id: 'e12c', level: 'EMG', outcome: 'RF5', make: function (r, sh) {
          return mc(r, '(c) The graph of ' + t('V') + ' has intercepts ' + t(ptT([0, sh.V0])) + ' and ' + t(ptT([sh.Te, 0])) + '. What do they mean?', [
            { html: t(ptT([0, sh.V0])) + ': the tank started with ' + t(sh.V0) + ' L; ' + t(ptT([sh.Te, 0])) + ': the tank is empty after ' + t(sh.Te) + ' min.', right: true },
            { html: t(ptT([0, sh.V0])) + ': the tank is empty after ' + t(sh.V0) + ' min; ' + t(ptT([sh.Te, 0])) + ': the tank started with ' + t(sh.Te) + ' L.', why: 'Read each point as (input, output) = (time, volume).' },
            { html: t(ptT([0, sh.V0])) + ': ' + t(sh.V0) + ' L drain each minute; ' + t(ptT([sh.Te, 0])) + ': ' + t(sh.Te) + ' L are left at the end.', why: 'The rate is ' + t(sh.dr) + ' L/min. At the second intercept the volume is ' + t('0') + '.' },
            { html: 'Both points show when the tank is full.', why: 'Only one of them is at the start; the other has volume ' + t('0') + '.' }],
            t('V(0)=' + sh.V0) + ': at the start the tank holds ' + t(sh.V0) + ' L. ' + t('V(' + sh.Te + ')=0') + ': after ' + t(sh.Te) + ' min the tank is empty.', ['Each point is (time, volume).'], 'EP meaning both intercepts');
        } }] },
      { num: '13', shared: function (r) {
          var V0 = r.pick([600, 600, 400, 480, 720, 360, 540, 900, 800]), dr = r.pick([40, 40, 20, 30, 60, 45, 36, 50].filter(function (x) { return Number.isInteger(V0 / x) && V0 / x <= 24 && V0 / x >= 6; }));
          return { V0: V0, dr: dr, Te: V0 / dr, tx: V0 / dr + 5 };
        }, stem: function (sh) { return '<b>Error analysis.</b> Asked for the domain of ' + t('V(t)=' + sh.V0 + '-' + sh.dr + 't') + ' (the volume, in litres, left in a draining tank ' + t('t') + ' minutes after the valve is opened), a student writes: “The domain is all real numbers, because you can substitute any number into ' + t(sh.V0 + '-' + sh.dr + 't') + '.”'; }, parts: [
        { id: 'e13a', level: 'PRG', outcome: 'RF2', make: function (r, sh) {
          return mc(r, '(a) The student is right about the algebra and wrong about the model. Which gives <b>two</b> correct reasons why the domain must be restricted?', [
            { html: 'Inputs below ' + t('0') + ' are times before the valve was opened, and inputs above ' + t(sh.Te) + ' give negative volumes — the tank is already empty.', right: true },
            { html: 'Inputs below ' + t('0') + ' give volumes over ' + t(sh.V0) + ' L, and inputs above ' + t(sh.V0) + ' are too large.', why: 'The upper limit is a <b>time</b>: when does the tank become empty?' },
            { html: 'Time must be a whole number, and the volume must be a multiple of ' + t(sh.dr) + '.', why: 'Time flows continuously; parts of a minute are fine.' },
            { html: 'The rule only works for ' + t('t') + ' between ' + t('0') + ' and ' + t(sh.V0) + '.', why: t(sh.V0) + ' is the starting volume, not a time.' }],
            'Small inputs: ' + t('t<0') + ' is before the valve was opened. Large inputs: the tank is empty at ' + t('t=' + sh.Te) + ' (' + t('V(t)=0') + '), and after that the rule gives negative volumes.', ['Think about the start and the end of the draining.'], 'EP two reasons to restrict');
        } },
        { id: 'e13b', level: 'PRG', outcome: 'RF2', make: function (r, sh) {
          return drPart('(b) Write the correct domain and range in set notation.', { dv: 't', fname: 'V', D: [0, sh.Te], R: [0, sh.V0], dW: [{ is: bld('t', 0, sh.V0), code: 'dr-context', hint: t(sh.V0) + ' is the volume. The domain ends when the tank is empty: solve ' + t('V(t)=0') + '.' }] },
            t('V(t)=0') + ' at ' + t('t=' + sh.Te) + ':<br>' + drSol('t', 'V', [0, sh.Te], [0, sh.V0]), ['Solve ' + t('V(t)=0') + ' for the end of the domain.'], 'EP D/R corrected');
        } },
        { id: 'e13c', level: 'EMG', make: function (r, sh) {
          var v = sh.V0 - sh.dr * sh.tx;
          return B.number('(c) State the value of ' + t('V(' + sh.tx + ')') + ' that the student’s domain would wrongly allow.', v, function (u) { if (same(u, -v)) return { code: 'sign', hint: 'Compute ' + t(sh.V0 + '-' + sh.dr * sh.tx) + ' carefully: it is negative.' }; return null; },
            t('V(' + sh.tx + ')=' + sh.V0 + '-' + sh.dr + '(' + sh.tx + ')=' + v) + ' L — a negative volume, which is impossible. That is why the domain stops at ' + t(sh.Te) + '.', ['Substitute ' + t('t=' + sh.tx) + '.'], 'EP V beyond domain', { before: t('V(' + sh.tx + ')='), after: 'L' });
        } }] },
      { num: '14', shared: function (r) { var J = r.pick([40, 40, 25, 30, 50, 60]), m = r.pick([22, 22, 15, 18, 20, 25, 30].filter(function (x) { return x !== J; })), tc = r.pick([15, 15, 10, 12, 8]); return { J: J, m: m, tc: tc, n9: r.pick([9, 9, 6, 7, 11]), L: r.pick([24, 24, 12, 18]), M: function (x) { return J + m * x; } }; },
        stem: function (sh) { return '<b>Build the rule, then use it.</b> A gym charges a one-time joining fee of ' + t('\\$' + sh.J) + ' plus ' + t('\\$' + sh.m) + ' for each month of membership.'; }, parts: [
        { id: 'e14a', level: 'EMG', outcome: 'RF4', make: function (r, sh) {
          var rhs = lin([[sh.m, 't'], [sh.J, '']]);
          return convPart('fn', '(a) Write a function ' + t('M(t)') + ' for the total amount paid, in dollars, after ' + t('t') + ' months.', { T: P(rhs), v: 't', name: 'M', reqName: true, keyRhs: rhs, vars: ['x'],
            wrong: [{ is: P(sh.m + 't'), code: 'no-fixed', hint: 'Add the one-time joining fee of ' + t('\\$' + sh.J) + '.' }, { is: P(lin([[sh.J, 't'], [sh.m, '']])), code: 'u5l10-swap-rate', hint: 'The amount that is paid <b>each month</b> is multiplied by ' + t('t') + '; the joining fee is paid once.' }, { is: P(lin([[sh.m + sh.J, 't']])), code: 'u5l10-swap-rate', hint: 'The joining fee is paid only once, so it is not multiplied by ' + t('t') + '.' }],
            good: ['M(t)=' + sh.J + '+' + sh.m + 't'], bad: ['y=' + rhs] },
            'Each month adds ' + t(sh.m) + ' (multiply by ' + t('t') + '); the joining fee ' + t(sh.J) + ' is added once:<br>' + t('M(t)=' + rhs), ['Which amount depends on the number of months, and which is paid only once?'], 'EP build gym rule');
        } },
        { id: 'e14b', sub: 'b i', level: 'BEG', make: function (r, sh) {
          var v = sh.M(sh.n9);
          return B.number('(b) Determine ' + t('M(' + sh.n9 + ')') + '.', v, function (u) { if (same(u, sh.m * sh.n9)) return { code: 'no-fixed', hint: 'Add the joining fee.' }; return null; }, t('M(' + sh.n9 + ')=' + sh.m + '(' + sh.n9 + ')+' + sh.J + '=' + v), ['Substitute ' + t('t=' + sh.n9) + '.'], 'EP M(9)', { before: t('M(' + sh.n9 + ')=\\$') });
        } },
        { id: 'e14c', sub: 'b ii', level: 'EMG', make: function (r, sh) {
          var v = sh.M(sh.n9);
          return meaningMC(r, 'What does ' + t('M(' + sh.n9 + ')=' + v) + ' represent?', 'After ' + t(sh.n9) + ' months the member has paid ' + t('\\$' + v) + ' in total, joining fee included.', [
            { html: 'Each month costs ' + t('\\$' + v) + '.', why: t('\\$' + v) + ' is the total so far, not a monthly cost.' },
            { html: 'After ' + t(v) + ' months the member has paid ' + t('\\$' + sh.n9) + '.', why: 'Swapped: the input ' + t(sh.n9) + ' is the number of months.' },
            { html: 'The member pays ' + t('\\$' + v) + ' in month ' + t(sh.n9) + '.', why: 'In one month the member pays ' + t('\\$' + sh.m) + '. ' + t('M(' + sh.n9 + ')') + ' is the total.' }],
            'Input ' + t(sh.n9) + ' months, output ' + t('\\$' + v) + ': the total paid after ' + t(sh.n9) + ' months.', ['What is the input? What is the output?'], 'EP meaning M(9)');
        } },
        { id: 'e14d', sub: 'c', level: 'EMG', make: function (r, sh) {
          var y = sh.M(sh.tc);
          return B.number('(c) Solve ' + t('M(t)=' + y) + '. (The answer is how many months it takes to pay ' + t('\\$' + y) + ' in total.)', sh.tc, function (u) { if (same(u, sh.M(y))) return { code: 'ev-instead', hint: t(y) + ' is the total paid (the output).' }; if (Math.abs(u - y / sh.m) < 1e-6) return { code: 'no-fixed', hint: 'Subtract the joining fee first.' }; return null; },
            t(sh.m + 't+' + sh.J + '=' + y) + '<br>' + t(sh.m + 't=' + (y - sh.J)) + '<br>' + t('t=' + sh.tc) + ': a total of ' + t('\\$' + y) + ' has been paid after ' + t(sh.tc) + ' months.', ['Subtract the joining fee, then divide by the monthly charge.'], 'EP solve M(t)=b', { before: t('t='), after: 'months' });
        } },
        { id: 'e14e', sub: 'd', level: 'PRG', outcome: 'RF2', make: function (r, sh) {
          return drPart('(d) A member signs a contract for ' + t(sh.L) + ' months. State the domain and range in set notation.', { dv: 't', fname: 'M', D: [0, sh.L], R: [sh.J, sh.M(sh.L)], rW: [{ is: bld('y', 0, sh.M(sh.L)), code: 'dr-from-zero', hint: 'At ' + t('t=0') + ' the joining fee has already been paid: ' + t('M(0)=' + sh.J) + '.' }] },
            drSol('t', 'M', [0, sh.L], [sh.J, sh.M(sh.L)]) + '<br>(' + t('M(' + sh.L + ')=' + sh.m + '(' + sh.L + ')+' + sh.J + '=' + sh.M(sh.L)) + '.)', ['The range runs from ' + t('M(0)') + ' to ' + t('M(' + sh.L + ')') + '.'], 'EP D/R gym');
        } }] },
      { num: '15', shared: function (r) {
          var V0, rate, Te, g;
          for (g = 0; g < 200; g++) { V0 = r.pick([900, 900, 600, 800, 1200, 720, 960, 1080, 480]); rate = r.pick([45, 45, 30, 40, 50, 60, 20, 24, 36]); Te = V0 / rate; if (Number.isInteger(Te) && Te % 2 === 0 && Te >= 10 && Te <= 40) break; }
          if (!(Number.isInteger(Te) && Te % 2 === 0)) { V0 = 900; rate = 45; Te = 20; }
          return { V0: V0, rate: rate, Te: Te, t8: r.pick([8, 8, 4, 5, 6].filter(function (x) { return x < Te; })), W: function (x) { return V0 - rate * x; } };
        }, stem: function (sh) { return '<b>Build the rule, then use it.</b> A water tank starts with ' + t(F(sh.V0)) + ' litres and is pumped out at a constant ' + t(sh.rate) + ' litres per minute.'; }, parts: [
        { id: 'e15a', level: 'EMG', outcome: 'RF4', make: function (r, sh) {
          var rhs = sh.V0 + '-' + sh.rate + 't';
          return convPart('fn', '(a) Write a function ' + t('W(t)') + ' for the volume remaining, in litres, after ' + t('t') + ' minutes of pumping.', { T: P(rhs), v: 't', name: 'W', reqName: true, keyRhs: rhs, vars: ['x'],
            wrong: [{ is: P(sh.V0 + '+' + sh.rate + 't'), code: 'sign', hint: 'Water is pumped <b>out</b>, so the volume goes down: subtract ' + t(sh.rate + 't') + '.' }, { is: P(lin([[sh.V0, 't'], [-sh.rate, '']])), code: 'u5l10-swap-rate', hint: 'The ' + t(sh.rate) + ' L leave <b>each minute</b>, so ' + t(sh.rate) + ' is multiplied by ' + t('t') + '.' }, { is: P('-' + sh.rate + 't'), code: 'no-fixed', hint: 'Start with the ' + t(sh.V0) + ' L in the tank.' }],
            good: ['W(t)=-' + sh.rate + 't+' + sh.V0], bad: ['y=' + rhs] },
            'Start at ' + t(sh.V0) + ' L and subtract ' + t(sh.rate) + ' L for each minute: ' + t('W(t)=' + rhs), ['Starting value, then the rate times ' + t('t') + ' — added or subtracted?'], 'EP build pump rule');
        } },
        { id: 'e15b', sub: 'b', level: 'BEG', make: function (r, sh) {
          var v = sh.W(sh.t8);
          return B.number('(b) Determine ' + t('W(' + sh.t8 + ')') + '. (It is the volume left after ' + t(sh.t8) + ' minutes of pumping.)', v, function (u) { if (same(u, sh.rate * sh.t8)) return { code: 'value', hint: 'That is how much was pumped out. Subtract it from ' + t(sh.V0) + '.' }; return null; },
            t('W(' + sh.t8 + ')=' + sh.V0 + '-' + sh.rate + '(' + sh.t8 + ')=' + v) + ': after ' + t(sh.t8) + ' minutes of pumping, ' + t(v) + ' L remain.', ['Substitute ' + t('t=' + sh.t8) + '.'], 'EP W(8)', { before: t('W(' + sh.t8 + ')='), after: 'L' });
        } },
        { id: 'e15c', sub: 'c i', level: 'EMG', make: function (r, sh) {
          var y = sh.V0 / 2;
          return B.number('(c) Solve ' + t('W(t)=' + y) + '.', sh.Te / 2, function (u) { if (same(u, sh.W(y))) return { code: 'ev-instead', hint: t(y) + ' is the volume (the output).' }; if (same(u, cl(y / sh.rate)) && y !== sh.V0 / 2) return { code: 'value', hint: 'Subtract from ' + t(sh.V0) + ' first.' }; return null; },
            t(sh.V0 + '-' + sh.rate + 't=' + y) + '<br>' + t('-' + sh.rate + 't=-' + y) + '<br>' + t('t=' + sh.Te / 2) + ' minutes', ['The volume is the output.'], 'EP solve W(t)=half', { before: t('t='), after: 'min' });
        } },
        { id: 'e15d', sub: 'c ii', level: 'PRG', make: function (r, sh) {
          var y = sh.V0 / 2;
          return mc(r, 'Without further calculation, why is this answer exactly half the time needed to empty the tank?', [
            { html: t(y) + ' L is half of the starting ' + t(sh.V0) + ' L, and since the rate is constant, half the water leaves in half the total time.', right: true },
            { html: 'Because the rule has a minus sign.', why: 'The minus sign shows the volume is falling. What makes the time exactly half?' },
            { html: 'Because ' + t(sh.rate) + ' is half of ' + t(sh.V0 / sh.rate * 2) + '.', why: 'That is a coincidence of numbers. Think about the amount of water and the steady rate.' },
            { html: 'It isn’t: emptying the tank takes more than twice as long, because the pump slows down.', why: 'The pump works at a <b>constant</b> ' + t(sh.rate) + ' L per minute.' }],
            'Half the water (' + t(y) + ' L) is gone after ' + t(sh.Te / 2) + ' min. At a constant rate, the other half takes the same time again, so emptying takes ' + t(sh.Te) + ' min.', ['What fraction of the water has been pumped out?'], 'EP why half time');
        } },
        { id: 'e15e', sub: 'd i', level: 'EMG', make: function (r, sh) {
          return B.number('(d) Determine how long emptying the tank takes.', sh.Te, function (u) { if (same(u, sh.V0)) return { code: 'solve-instead', hint: 'Solve ' + t('W(t)=0') + '.' }; if (same(u, cl(sh.rate / sh.V0))) return { code: 'nr-flip', hint: 'Divide the other way.' }; return null; },
            'Solve ' + t('W(t)=0') + ': ' + t(sh.V0 + '-' + sh.rate + 't=0\\Rightarrow t=' + sh.V0 + '\\div ' + sh.rate + '=' + sh.Te) + ' minutes.', ['The tank is empty when ' + t('W(t)=0') + '.'], 'EP time to empty', { before: t('t='), after: 'min' });
        } },
        { id: 'e15f', sub: 'd ii', level: 'PRG', outcome: 'RF2', make: function (r, sh) {
          return drPart('Now state the domain and range in set notation.', { dv: 't', fname: 'W', D: [0, sh.Te], R: [0, sh.V0] }, drSol('t', 'W', [0, sh.Te], [0, sh.V0]), ['From the start of pumping until the tank is empty.'], 'EP D/R pump');
        } }] },
      /* ---------------- Extra Part D: comparing two models ---------------- */
      { num: '16', section: 'Extra practice D — Stretch: comparing two models', shared: function (r) {
          var Fx, a, b, ks, g;
          for (g = 0; g < 200; g++) { Fx = r.pick([45, 45, 30, 36, 40, 48, 60]); a = r.pick([4, 4, 3, 5, 6]); b = r.pick([9, 9, 7, 8, 10, 12]); ks = Fx / (b - a); if (b > a && Number.isInteger(ks) && ks >= 5 && ks <= 14) break; }
          if (!(b > a && Number.isInteger(ks))) { Fx = 45; a = 4; b = 9; ks = 9; }
          var k1 = r.pick([5, 5, 2, 3, 4].filter(function (x) { return x < ks; })), k2 = r.pick([15, 15, 18, 20, 25].filter(function (x) { return x > ks; }));
          return { Fx: Fx, a: a, b: b, ks: ks, k1: k1, k2: k2, P: function (k) { return Fx + a * k; }, Q: function (k) { return b * k; } };
        }, stem: function (sh) { return 'Two courier companies price a delivery of ' + t('k') + ' kilometres differently. Company P charges ' + t('P(k)=' + sh.Fx + '+' + sh.a + 'k') + ' dollars; Company Q charges ' + t('Q(k)=' + sh.b + 'k') + ' dollars.'; }, parts: [
        { id: 'e16a', sub: 'a i', level: 'BEG', make: function (r, sh) {
          var k = sh.k1;
          return fieldsOf('(a) Determine ' + t('P(' + k + ')') + ' and ' + t('Q(' + k + ')') + '.', [valItem(t('P(' + k + ')=\\$'), 'P(' + k + ')', sh.P(k), function (u) { if (same(u, sh.a * k)) return { code: 'no-fixed', hint: 'Company P also charges ' + t('\\$' + sh.Fx) + '.' }; return null; }), valItem(t('Q(' + k + ')=\\$'), 'Q(' + k + ')', sh.Q(k))],
            t('P(' + k + ')=' + sh.P(k)) + ', ' + t('Q(' + k + ')=' + sh.Q(k)), t('P(' + k + ')=' + sh.Fx + '+' + sh.a + '(' + k + ')=' + sh.P(k)) + '<br>' + t('Q(' + k + ')=' + sh.b + '(' + k + ')=' + sh.Q(k)), ['Substitute ' + t('k=' + k) + '.'], 'EP P(k1), Q(k1)');
        } },
        { id: 'e16b', sub: 'a ii', level: 'BEG', make: function (r, sh) {
          return cheaperMC(r, 'Which company is cheaper for a ' + t(sh.k1) + ' km delivery?', 'P', 'Q', sh.k1, sh.P, sh.Q, sh.a, sh.Fx, t('Q(' + sh.k1 + ')=' + sh.Q(sh.k1)) + ' is less than ' + t('P(' + sh.k1 + ')=' + sh.P(sh.k1)) + ', so Q is cheaper for short deliveries.', ['Compare the two costs.'], 'EP cheaper short');
        } },
        { id: 'e16c', sub: 'b', level: 'ADV', make: function (r, sh) {
          var d = sh.b - sh.a;
          var fl = [{ label: 'Distance: ' + t('k='), name: 'Distance', mode: 'math', keys: 'fraction', after: 'km' }, { label: 'Cost at that distance: ' + t('\\$'), name: 'Cost', mode: 'math', keys: 'fraction' }];
          return BF('(b) Solve ' + t('P(k)=Q(k)') + ', and determine the cost that both companies charge at that distance.', fl,
            [K.value(sh.ks, { diag: function (u) { if (same(u, cl(sh.Fx / (sh.a + sh.b)))) return { code: 'conv-move-sign', hint: 'Subtract ' + t(sh.a + 'k') + ' from both sides: ' + t(sh.Fx + '=' + sh.b + 'k-' + sh.a + 'k') + '.' }; if (same(u, -sh.ks)) return { code: 'sign', hint: 'The distance is positive.' }; return null; } }),
              K.value(sh.Q(sh.ks), { diag: function (u) { if (same(u, sh.ks)) return { code: 'value', hint: 'That is the distance. Now substitute it into either rule for the cost.' }; return null; } })],
            [String(sh.ks), String(sh.Q(sh.ks))], t('k=' + sh.ks) + ' km, ' + t('\\$' + sh.Q(sh.ks)),
            t(sh.Fx + '+' + sh.a + 'k=' + sh.b + 'k') + '<br>' + t(sh.Fx + '=' + d + 'k') + '<br>' + t('k=' + sh.ks) + ' km<br>Both charge ' + t('P(' + sh.ks + ')=Q(' + sh.ks + ')=\\$' + sh.Q(sh.ks)) + '.', ['Set the two rules equal and solve for ' + t('k') + '.', 'Then substitute your ' + t('k') + ' into either rule.'], 'EP solve P(k)=Q(k)');
        } },
        { id: 'e16d', sub: 'c i', level: 'BEG', make: function (r, sh) {
          var k = sh.k2;
          return fieldsOf('(c) Determine ' + t('P(' + k + ')') + ' and ' + t('Q(' + k + ')') + '.', [valItem(t('P(' + k + ')=\\$'), 'P(' + k + ')', sh.P(k)), valItem(t('Q(' + k + ')=\\$'), 'Q(' + k + ')', sh.Q(k))],
            t('P(' + k + ')=' + sh.P(k)) + ', ' + t('Q(' + k + ')=' + sh.Q(k)), t('P(' + k + ')=' + sh.Fx + '+' + sh.a + '(' + k + ')=' + sh.P(k)) + '<br>' + t('Q(' + k + ')=' + sh.b + '(' + k + ')=' + sh.Q(k)), ['Substitute ' + t('k=' + k) + '.'], 'EP P(k2), Q(k2)');
        } },
        { id: 'e16e', sub: 'c ii', level: 'BEG', make: function (r, sh) {
          return cheaperMC(r, 'Which company is cheaper for a ' + t(sh.k2) + ' km delivery?', 'P', 'Q', sh.k2, sh.P, sh.Q, sh.a, sh.Fx, t('P(' + sh.k2 + ')=' + sh.P(sh.k2)) + ' is less than ' + t('Q(' + sh.k2 + ')=' + sh.Q(sh.k2)) + ', so P is cheaper now.', ['Compare the two costs.'], 'EP cheaper long');
        } },
        { id: 'e16f', sub: 'd i', level: 'MAS', make: function (r, sh) {
          var ks = sh.ks;
          var region = function (which) {
            return function (resp) {
              var p = S.parse(resp);
              if (!String(resp || '').trim()) return form('empty', 'Write the distances as an inequality in ' + t('k') + '.');
              if (!p.ok) return form('set-' + p.why, 'Write an inequality such as ' + t('0\\le k<5') + ' or ' + t('k>5') + '.');
              if (p.v && p.v !== 'k') return form('set-letter', 'Use the variable ' + t('k') + ' (the distance).');
              if (p.set.kind !== 'int' || p.set.parts.length !== 1) return wrong('value', null);
              var q = p.set.parts[0];
              if (which === 'Q') {
                if (same(q.lo, ks) && q.hi === Infinity) return wrong('u5l10-swap-co', 'Those are the distances where <b>P</b> is cheaper. Check your answers to (a) and (c): which company wins on short trips?');
                if (!same(q.hi, ks)) return wrong('value', 'The switch happens at ' + t('k=' + ks) + ' km (part (b)). Q is cheaper on one side of it.');
                if (q.hc) return wrong('u5l10-tie', 'At ' + t('k=' + ks) + ' both companies charge the same, so neither is cheaper there: use ' + t('<') + ', not ' + t('\\le') + '.');
                if (!(q.lo === -Infinity || same(q.lo, 0))) return wrong('value', 'Q is cheaper for <b>every</b> distance shorter than ' + t(ks) + ' km — start at ' + t('0') + '.');
                return ok();
              }
              if (same(q.hi, ks) && (q.lo === -Infinity || same(q.lo, 0))) return wrong('u5l10-swap-co', 'Those are the distances where <b>Q</b> is cheaper. Check (c): which company wins on long trips?');
              if (!same(q.lo, ks) || q.hi !== Infinity) return wrong('value', 'P is cheaper for every distance longer than ' + t(ks) + ' km (part (b)) — with no upper limit.');
              if (q.lc) return wrong('u5l10-tie', 'At ' + t('k=' + ks) + ' both charge the same, so P is not cheaper there: use ' + t('>') + ', not ' + t('\\ge') + '.');
              return ok();
            };
          };
          var fl = [{ label: 'Q is cheaper when', name: 'Q cheaper', mode: 'math', keys: 'set', vars: ['k'], placeholder: 'e.g. 0 <= k < 5' }, { label: 'P is cheaper when', name: 'P cheaper', mode: 'math', keys: 'set', vars: ['k'], placeholder: 'e.g. k > 5' }];
          var p = BF('(d) Using your answers, describe completely the distances for which each company is the cheaper choice. Write each as an inequality in ' + t('k') + '.', fl, [region('Q'), region('P')], ['0\\le k<' + ks, 'k>' + ks],
            'Q cheaper: ' + t('0\\le k<' + ks) + '; P cheaper: ' + t('k>' + ks) + ' (equal at ' + t('k=' + ks) + ')',
            'Q is cheaper on short trips (part (a)), P on long ones (part (c)), and they cost the same at ' + t('k=' + ks) + ' km (part (b)):<br>Q is cheaper for ' + t('0\\le k<' + ks) + '; the two are equal at ' + t('k=' + ks) + '; P is cheaper for ' + t('k>' + ks) + '.',
            ['The switch happens at the distance from (b). Which company wins before it, and which after?', 'At the switch distance the costs are equal, so neither is cheaper there.'], 'EP regions cheaper');
          p.good = [['k<' + ks, 'k>' + ks], ['0<k<' + ks, '(' + ks + ',\\infty)']];
          p.bad = [['0\\le k\\le ' + ks, 'k>' + ks], ['k>' + ks, '0\\le k<' + ks], ['0\\le k<' + ks, 'k\\ge ' + ks]];
          return p;
        } },
        { id: 'e16g', sub: 'd ii', level: 'PRG', make: function (r, sh) {
          return mc(r, 'Why does the cheaper company switch over at exactly one distance?', [
            { html: 'Each cost is a straight line, and two lines with different rates of change cross exactly once — so the order can only change at that crossing.', right: true },
            { html: 'Because ' + t(sh.Fx) + ' is divisible by ' + t(sh.b - sh.a) + '.', why: 'That only makes the crossing a whole number. Think about the shapes of the two graphs.' },
            { html: 'Because Company P has a starting fee.', why: 'The fee explains why Q starts cheaper, not why there is only one switch.' },
            { html: 'It doesn’t: the cheaper company switches back and forth.', why: 'Each cost grows at a steady rate. Can two straight lines cross twice?' }],
            'Both costs are linear (straight-line graphs) with different rates, ' + t(sh.a) + ' and ' + t(sh.b) + ' dollars per km. Two such lines meet exactly once, at ' + t('k=' + sh.ks) + ': before it Q is lower, after it P is lower.', ['Picture the two graphs.'], 'EP why one switch');
        } }] }
    ]
  }));

  /* clock time for an hour count from midnight (21 = 9 pm, 30 = 6 am) */
  function clock(h) { h = ((h % 24) + 24) % 24; var hr = h % 12 === 0 ? 12 : h % 12; return hr + ' ' + (h < 12 ? 'am' : 'pm'); }
})(window);
