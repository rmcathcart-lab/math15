/* Math 15 · Unit 5 (Relations and Functions) — exit slips for Lessons 1–12 (u5l1x … u5l12x), written in test mode.
 * Each slip is Ryan's own Math 15 exit slip for that lesson (his older exit-slip app, Versions A and B), turned into
 * generators: the same questions, skills, outcomes and levels (his tags), with his Version A and B numbers and graphs
 * among the possible values. Every part has a key built from the generated values, a worked solution, hints, and `bad`
 * answers with u5x- codes (labels and partial-credit decisions below).
 * Changes from his slips:
 *  - Where his slip had only Beginning/Progressing questions, one short Mastery question was added at Math 15
 *    difficulty (a lesson's own harder assignment item: a fourth corner, working a pattern backwards, a relation from a
 *    rule in words, intercepts from a story, sketching to a given domain and range, domain and range in context, a
 *    missing input that breaks a function, correcting a function-notation error, a story graph with numbers), so
 *    "highest level right" separates students. Lessons 6 and 9 already had a Mastery question.
 *  - Multiple choice was kept where it tests recognition (quadrants, axes, variables and axes, the meaning of an
 *    intercept or of f(a) = b, mapping diagrams, story-to-graph matching, which relation is not a function). Questions
 *    that ask for a value, a point or a set are typed: reading a domain/range (L5 range as "from … to …", L12 segment,
 *    L7 line on a screen), the L6 ray (his Mastery MC → typed inequalities), the L7 window (typed Xmin/Xmax/Ymin/Ymax,
 *    any window that shows both intercepts), and the L3 "which graph shows the table" (now: plot the table).
 *  - L8's "which one graph is a function" became the 10C-style table (each of four graphs: function or not).
 * Notation follows the Math 15 booklet: lists in braces, inequalities (−4 ≤ x ≤ 2, y ≥ 2), "all real numbers"; no
 * set-builder notation is required (it is accepted), and lists may be in any order. A scientific calculator is allowed. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, P = HW.poly, S = HW.sets, Dr = HW.draw;

  HW.addCodes({
    'u5x-pt-swap': 'Ordered pair written as (y, x)', 'u5x-pt-sign': 'Sign slip in an ordered pair', 'u5x-pt-value': 'Gave one number instead of the point', 'u5x-pt-unreadable': 'Point not written as an ordered pair',
    'u5x-rect-corner': 'Fourth corner does not make a rectangle',
    'u5x-pat-nostart': 'Pattern: multiplied by the step and ignored the start', 'u5x-pat-extra-step': 'Pattern: added the step once too often', 'u5x-pat-short': 'Pattern: stopped one figure early',
    'u5x-pat-times-first': 'Pattern: multiplied the first figure', 'u5x-pat-div-only': 'Pattern: divided by the step without using the start', 'u5x-pat-off-one': 'Pattern: counted steps, not the figure number', 'u5x-pat-nodiv': 'Pattern: did not divide by the step',
    'u5x-map-across': 'Mapping: read straight across instead of following the arrow', 'u5x-map-other': 'Mapping: used another input’s arrow', 'u5x-plot-sorted': 'Plotted the outputs in sorted order (pairs broken)', 'u5x-one-swap': 'One point plotted as (y, x)',
    'u5x-pairs-nofee': 'Ordered pairs without the one-time fee', 'u5x-pairs-fee-each': 'Ordered pairs with the fee added every time',
    'u5x-int-other': 'Gave the other intercept', 'u5x-int-swap': 'Intercept with its coordinates swapped', 'u5x-int-mix': 'Mixed up the columns of the table', 'u5x-int-nodiv': 'Used the start value instead of the time to reach 0', 'u5x-int-rate': 'Used the rate as the starting value',
    'u5x-dr-swap': 'Gave the domain for the range (or reverse)', 'u5x-dr-ends': 'Used only the end points, not the highest/lowest points', 'u5x-dr-ends-list': 'Listed only the end values', 'u5x-dr-order': 'Lowest and highest values reversed',
    'u5x-dr-peak-time': 'Stopped the domain at the highest point', 'u5x-dr-height': 'Gave a height (range) instead of a time', 'u5x-dr-zero': 'Left out the value 0', 'u5x-dr-window': 'Used the window as the domain/range',
    'u5x-dr-int': 'Gave an intercept instead of the domain/range', 'u5x-dr-part': 'Used only part of a line that never ends', 'u5x-dr-allreal': 'All real numbers for a graph that stops',
    'u5x-list-missing': 'Left values out of the list', 'u5x-list-extra': 'Extra values in the list', 'u5x-set-repeat': 'Repeated a value in a set',
    'u5x-sk-swap': 'Sketch with the domain and range swapped', 'u5x-sk-points': 'Separate points where a continuous graph was asked', 'u5x-sk-ends': 'Sketch reaches the right values but with wrong end dots',
    'u5x-ray-dir': 'Ray: inequality in the wrong direction', 'u5x-ray-start': 'Ray: gave only the starting value',
    'u5x-win-std': 'Kept the standard window', 'u5x-win-swap': 'Window: x and y settings swapped', 'u5x-win-sign': 'Window on the wrong side for a negative/positive intercept', 'u5x-win-x': 'Window misses the x-intercept', 'u5x-win-y': 'Window misses the y-intercept', 'u5x-win-edge': 'Intercept exactly on the edge of the window', 'u5x-win-minmax': 'Window minimum not below the maximum',
    'u5x-zero-yint': 'Gave the y-intercept instead of the zero', 'u5x-zero-sign': 'Sign slip solving for the zero', 'u5x-zero-nodiv': 'Did not divide by the slope',
    'u5x-ctx-allreal': 'All real numbers where the situation limits the values', 'u5x-ctx-start0': 'Range starts at 0 instead of the starting value', 'u5x-ctx-nomax': 'Left out the maximum the situation sets', 'u5x-ctx-rate': 'Used the rate as the lowest value',
    'u5x-fn-wrong': 'Wrong function decision', 'u5x-fn-rep-y': 'Picked a repeated output (allowed in a function)', 'u5x-fn-output': 'Gave an output instead of the input', 'u5x-one-k': 'Gave only one of the possible values', 'u5x-k-y': 'Used the outputs instead of the inputs', 'u5x-k-extra': 'Included a value that keeps it a function',
    'u5x-sq-neg': 'Squared a negative without brackets', 'u5x-bx-sign': 'Sign slip multiplying by a negative input', 'u5x-sq-both': 'Squared without brackets and a sign slip', 'u5x-sq-2x': 'Read x² as 2x',
    'u5x-fn-nodist': 'Did not multiply both terms of the bracket', 'u5x-fn-ax': 'Multiplied the number into the x-term', 'u5x-fn-eval-a': 'Evaluated at the number instead of the expression',
    'u5x-read-input': 'Repeated the input instead of reading the output', 'u5x-read-swap': 'Read the graph sideways (input and output swapped)', 'u5x-read-sign': 'Sign slip reading the graph', 'u5x-evaluated': 'Evaluated instead of solving',
    'u5x-sub-rate': 'Subtracted the rate instead of dividing', 'u5x-add-rate': 'Added the rate instead of dividing', 'u5x-fn-swap': 'Function notation with input and output swapped',
    'u5x-rate-total': 'Gave the total change, not the rate', 'u5x-rate-coords': 'Divided one point’s coordinates', 'u5x-rate-flip': 'Divided time by the change',
    'u5x-solve-inverse': 'Undid the constant the wrong way', 'u5x-solve-nodiv': 'Did not divide by the coefficient'
  });
  HW.addPartial({
    'u5x-pt-swap': 'b', 'u5x-pt-sign': 's', 'u5x-rect-corner': 'n',
    'u5x-pat-nostart': 'b', 'u5x-pat-extra-step': 's', 'u5x-pat-short': 's', 'u5x-pat-times-first': 'n', 'u5x-pat-div-only': 'b', 'u5x-pat-off-one': 's', 'u5x-pat-nodiv': 'b',
    'u5x-map-across': 'n', 'u5x-map-other': 'n', 'u5x-plot-sorted': 'b', 'u5x-one-swap': 's', 'u5x-pairs-nofee': 'b', 'u5x-pairs-fee-each': 'b',
    'u5x-int-other': 'n', 'u5x-int-swap': 'b', 'u5x-int-mix': 'n', 'u5x-int-nodiv': 'b', 'u5x-int-rate': 'n',
    'u5x-dr-swap': 'b', 'u5x-dr-ends': 'b', 'u5x-dr-ends-list': 'b', 'u5x-dr-peak-time': 'b', 'u5x-dr-height': 'n', 'u5x-dr-zero': 's', 'u5x-dr-window': 'n', 'u5x-dr-int': 'n', 'u5x-dr-part': 'n', 'u5x-dr-allreal': 'n',
    'u5x-list-missing': 'b', 'u5x-list-extra': 'b', 'u5x-sk-swap': 'b', 'u5x-sk-points': 'b', 'u5x-sk-ends': 's', 'u5x-ray-dir': 'b', 'u5x-ray-start': 'n',
    'u5x-win-std': 'n', 'u5x-win-swap': 'b', 'u5x-win-sign': 'b', 'u5x-win-x': 'b', 'u5x-win-y': 'b',
    'u5x-zero-yint': 'n', 'u5x-zero-sign': 's', 'u5x-zero-nodiv': 'b', 'u5x-ctx-allreal': 'b', 'u5x-ctx-start0': 's', 'u5x-ctx-nomax': 'b', 'u5x-ctx-rate': 'n',
    'u5x-fn-wrong': 'n', 'u5x-fn-rep-y': 'n', 'u5x-fn-output': 'b', 'u5x-one-k': 'b', 'u5x-k-y': 'n', 'u5x-k-extra': 'b',
    'u5x-sq-neg': 'b', 'u5x-bx-sign': 's', 'u5x-sq-both': 'b', 'u5x-sq-2x': 'n', 'u5x-fn-nodist': 'b', 'u5x-fn-ax': 'n', 'u5x-fn-eval-a': 'n',
    'u5x-read-input': 'n', 'u5x-read-swap': 'n', 'u5x-read-sign': 's', 'u5x-evaluated': 'n', 'u5x-sub-rate': 'n', 'u5x-add-rate': 'n', 'u5x-fn-swap': 'n',
    'u5x-rate-total': 'b', 'u5x-rate-coords': 'n', 'u5x-rate-flip': 'n', 'u5x-solve-inverse': 'b', 'u5x-solve-nodiv': 'b'
  });

  /* ================= numbers and LaTeX ================= */
  function cl(x) { return Math.round(x * 1e6) / 1e6; }
  function same(a, b) { return Math.abs(a - b) < 1e-9; }
  function nf(x) { return String(cl(x)); }
  function sgp(x) { x = cl(x); return x < 0 ? '(' + x + ')' : String(x); }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nz(a, b) { return range(a, b).filter(function (x) { return x !== 0; }); }
  function uniq(a) { var s = a.slice().sort(function (x, y) { return x - y; }); return s.filter(function (x, i) { return i === 0 || Math.abs(x - s[i - 1]) > 1e-9; }); }
  function setSame(A, Bs) { A = uniq(A); Bs = uniq(Bs); return A.length === Bs.length && A.every(function (x, i) { return Math.abs(x - Bs[i]) < 1e-6; }); }
  function pickWhere(gen, okf) { for (var i = 0; i < 3000; i++) { var o = gen(); if (o != null && okf(o)) return o; } throw new Error('u5 exits: no valid numbers'); }
  function term(c, v, first) { c = cl(c); if (!c) return ''; var neg = c < 0, mag = nf(Math.abs(c)); if (v && mag === '1') mag = ''; return (neg ? '-' : first ? '' : '+') + mag + v; }
  function lin(list) { var s = ''; list.forEach(function (p) { s += term(p[0], p[1], s === ''); }); return s || '0'; }
  function PL(tex) { return P.parse(tex); }
  function ptT(p) { return '(' + nf(p[0]) + ',\\ ' + nf(p[1]) + ')'; }
  function ptKey(p) { return '(' + nf(p[0]) + ', ' + nf(p[1]) + ')'; }
  function lst(a) { return '\\{' + uniq(a).map(nf).join(',\\ ') + '\\}'; }
  function lstPlain(a) { return '\\{' + uniq(a).map(nf).join(', ') + '\\}'; }
  function ineq(v, lo, hi) { if (lo != null && hi != null) return nf(lo) + '\\le ' + v + '\\le ' + nf(hi); if (lo != null) return v + '\\ge ' + nf(lo); return v + '\\le ' + nf(hi); }
  var ALL = '\\text{all real numbers}';
  var NAMES = ['Aisha', 'Marcus', 'Leah', 'Sam', 'Priya', 'Noah', 'Mei', 'Jordan', 'Ava', 'Kai'];

  /* ================= part makers ================= */
  function numChk(ans, dl) {
    ans = cl(ans); var L = (dl || []).filter(function (d) { return d && isFinite(d[0]) && !same(cl(d[0]), ans); });
    var base = K.number(ans, function (v) { for (var i = 0; i < L.length; i++) if (Math.abs(v - L[i][0]) < 1e-6) return { code: L[i][1], hint: L[i][2] }; return null; });
    return function (resp) { return base(String(resp == null ? '' : resp).replace(/^\s*[a-zA-Z]\s*=\s*(?=[-−+.\d\\])/, '')); }; // "x = 6" is fine
  }
  /* one number; dl = [[wrongValue, code, hint], …] (entries equal to the answer are dropped) */
  function numPart(prompt, ans, dl, sol, hints, text, inp) {
    ans = cl(ans);
    var L = (dl || []).filter(function (d) { return d && isFinite(d[0]) && !same(cl(d[0]), ans); });
    var p = B.number(prompt, ans, null, sol, hints, text, inp);
    p.check = numChk(ans, L);
    p.bad = L.map(function (d) { return String(cl(d[0])); }).filter(function (s, i, a) { return a.indexOf(s) === i; });
    return p;
  }
  function nw(html) { return '<span style="white-space:nowrap">' + html + '</span>'; }
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  function Q(num, outcome, level, stem, make) { return { num: String(num), outcome: outcome, stem: stem, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }

  /* ---------- one ordered pair: "(3, -2)" (brackets optional); dl = [[point, code, hint]] ---------- */
  function cleanR(s) { return String(s == null ? '' : s).replace(/\\left|\\right/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\[,;:! ]|~/g, ' ').replace(/−/g, '-').trim(); }
  function numOf(s) { var q = ex.parse(String(s).trim()); if (!q.ok) return NaN; var v = ex.value(q.ast); return isFinite(v) ? v : NaN; }
  function readPt(resp) {
    var s = cleanR(resp).replace(/^[A-Za-z]\s*=?\s*(?=\()/, '');
    if (!s) return { empty: true };
    var m = /^\(\s*([^(),]+)\s*,\s*([^(),]+)\s*\)$/.exec(s) || /^([^(),]+),([^(),]+)$/.exec(s);
    if (m) { var a = numOf(m[1]), b = numOf(m[2]); return isFinite(a) && isFinite(b) ? { pt: [a, b] } : { bad: true }; }
    var v = numOf(s.replace(/^[a-zA-Z]\s*=\s*/, '')); if (isFinite(v)) return { val: v };
    return { bad: true };
  }
  function ptChk(T, o) {
    o = o || {}; var dl = (o.dl || []).filter(function (d) { return !(same(d[0][0], T[0]) && same(d[0][1], T[1])); });
    return function (resp) {
      var r = readPt(resp);
      if (r.empty) return form('empty', 'Type your answer first.');
      if (r.bad) return form('u5x-pt-unreadable', 'Write the point as an ordered pair in brackets, like ' + t('(3,\\ -2)') + '.');
      if (r.val != null) {
        if (o.valIdx != null && same(r.val, T[o.valIdx])) return form('u5x-pt-value', o.valHint || 'Right number — now write the whole point as an ordered pair, like ' + t('(3,\\ -2)') + '.');
        return form('u5x-pt-unreadable', 'Write the point as an ordered pair: two numbers in brackets, like ' + t('(3,\\ -2)') + '.');
      }
      var p = r.pt;
      if (same(p[0], T[0]) && same(p[1], T[1])) return ok();
      for (var i = 0; i < dl.length; i++) if (same(p[0], dl[i][0][0]) && same(p[1], dl[i][0][1])) return wrong(dl[i][1], dl[i][2]);
      if (same(p[0], T[1]) && same(p[1], T[0])) return wrong('u5x-pt-swap', o.swapHint || 'Your coordinates are in the wrong order: the ' + t('x') + '-coordinate (left or right) comes first, then the ' + t('y') + '-coordinate (up or down).');
      if (same(Math.abs(p[0]), Math.abs(T[0])) && same(Math.abs(p[1]), Math.abs(T[1]))) return wrong('u5x-pt-sign', o.signHint || 'Check the signs: left of the ' + t('y') + '-axis means a negative ' + t('x') + '; below the ' + t('x') + '-axis means a negative ' + t('y') + '.');
      return wrong('value', null);
    };
  }
  function ptBad(T, dl) {
    var bad = (dl || []).map(function (d) { return ptKey(d[0]); }); if (!same(T[0], T[1])) bad.push(ptKey([T[1], T[0]]));
    return bad.filter(function (b, i, a) { return a.indexOf(b) === i && b !== ptKey(T); });
  }
  function ptPart(prompt, T, o, sol, hints, text) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'math', keys: 'pairs', placeholder: o.placeholder || 'e.g. (3, -2)', before: o.before }, check: ptChk(T, o), key: ptKey(T), answer: (o.ansPre || '') + t(ptT(T)), solution: sol, hints: hints || [], text: text };
    p.bad = ptBad(T, o.dl);
    p.good = ['\\left(' + nf(T[0]) + ',' + nf(T[1]) + '\\right)', nf(T[0]) + ',' + nf(T[1])];
    return p;
  }
  function ptField(label, name) { return { label: label, name: name, mode: 'math', keys: 'pairs', placeholder: 'e.g. (3, -2)' }; }

  /* ---------- a list of values in any order (L5: "x can be −3, −2, 2 or 4"); braces allowed ---------- */
  function readList(resp) {
    var s = cleanR(resp).replace(/\\\{|\\\}|\\lbrace|\\rbrace|[{}]/g, ' ').replace(/\\text\{\s*(or|and)\s*\}/gi, ',').replace(/\\text\{([^{}]*)\}/g, '$1');
    s = s.replace(/^\s*(D|R|domain|range)\s*[:=]?\s*/i, '').replace(/\b(or|and)\b/gi, ',').replace(/[a-zA-Z]\s*=\s*/g, '');
    if (!s.trim()) return { empty: true };
    var out = [], ps = s.split(/[,;]/);
    for (var i = 0; i < ps.length; i++) { var q = ps[i].trim(); if (!q) continue; var v = numOf(q); if (!isFinite(v)) return { bad: true }; out.push(v); }
    return out.length ? { vals: out } : { empty: true };
  }
  function listPart(prompt, vals, o, sol, hints, text) {
    o = o || {}; var T = uniq(vals), dl = (o.dl || []).filter(function (d) { return !setSame(d[0], T); });
    var check = function (resp) {
      var r = readList(resp);
      if (r.empty) return form('empty', 'Type your answer first.');
      if (r.bad) return form('u5x-list-unreadable', 'Type the values separated by commas, like ' + t('-3,\\ 1,\\ 4') + '.');
      var A = uniq(r.vals);
      if (setSame(A, T)) return ok();
      for (var i = 0; i < dl.length; i++) if (setSame(A, dl[i][0])) return wrong(dl[i][1], dl[i][2]);
      var miss = T.filter(function (x) { return !A.some(function (y) { return same(x, y); }); }), extra = A.filter(function (x) { return !T.some(function (y) { return same(x, y); }); });
      if (miss.length && !extra.length) return wrong('u5x-list-missing', 'Correct so far — but you are missing ' + (miss.length === 1 ? 'a value' : miss.length + ' values') + '. Check every dot.');
      if (extra.length && !miss.length) return wrong('u5x-list-extra', 'You have ' + (extra.length === 1 ? 'a value' : extra.length + ' values') + ' that don’t belong. Check which coordinate you are listing.');
      return wrong('value', null);
    };
    var p = { prompt: prompt, input: { type: 'math', keys: 'set', vars: [], placeholder: 'e.g. -3, 1, 4', before: o.before }, check: check, key: T.map(nf).join(', '), answer: (o.ansPre || '') + t(T.map(nf).join(',\\ ')), solution: sol, hints: hints || [], text: text };
    p.bad = dl.map(function (d) { return uniq(d[0]).map(nf).join(', '); });
    return p;
  }

  /* ---------- domain and range (Math 15 notation: lists in braces, inequalities, "all real numbers") ---------- */
  function prepSet(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\text\{\s*([^{}]*)\}/g, ' $1 ').replace(/\\mathrm\{\s*([^{}]*)\}/g, ' $1 ');
    s = s.replace(/a\s*l\s*l\s*r\s*e\s*a\s*l\s*n\s*u\s*m\s*b\s*e\s*r\s*s?/ig, '\\mathbb{R}');
    return s.replace(/^\s*(D|R|domain|range)\s*[:=]\s*/i, '');
  }
  function rawList(s) {
    s = String(s || '').replace(/\\(left|right)\.?/g, '').replace(/\\lbrace|\\\{/g, '{').replace(/\\rbrace|\\\}/g, '}');
    var m = /^\s*\{([^{}]*)\}\s*$/.exec(s); if (!m || /\\mid|\||:/.test(m[1])) return null;
    var out = [], ps = m[1].split(/[,;]/);
    for (var i = 0; i < ps.length; i++) { var v = numOf(ps[i].replace(/\\[,;: ]/g, '')); if (!isFinite(v)) return null; out.push(v); }
    return out;
  }
  function setChk15(target, o) {
    o = o || {};
    var T = S.parse(target).set;
    var wr = (o.wrong || []).filter(function (w) { var p = S.parse(w.is); return p.ok && !S.eq(p.set, T); });
    var base = K.set(target, { v: o.v, other: o.other, otherName: o.otherName, wrong: wr, tag: false });
    return function (resp) {
      var s = prepSet(resp), r = base(s);
      if (r.v === 'correct' && T.kind === 'list') { var L = rawList(s); if (L && L.length !== uniq(L).length) return form('u5x-set-repeat', 'Right values — but in a set each value is written <b>only once</b>.'); }
      return r;
    };
  }
  function PH(v, list) { return list ? 'e.g. {1, 3, 5}' : 'e.g. -2 <= ' + v + ' <= 5, or ' + v + ' >= 3'; }
  function setPart15(prompt, target, o, sol, hints, text) {
    o = o || {}; var v = o.v || 'x';
    var p = { prompt: prompt, input: { type: 'math', keys: 'set', vars: [v], placeholder: o.ph || PH(v, S.parse(target).set.kind === 'list'), before: o.before }, check: setChk15(target, o), key: target, answer: (o.ansPre || '') + t(target), solution: sol, hints: hints || [], text: text };
    var Tp = S.parse(target).set;
    p.bad = (o.wrong || []).map(function (w) { return w.is; }).concat(o.other ? [o.other] : []).concat(o.bad || []).filter(function (b) { var q = S.parse(b); return !q.ok || !S.eq(q.set, Tp); });
    return p;
  }
  /* one part, two boxes: Domain and Range. o: dv, rv, dW, rW (wrong lists), bad, ph */
  function drPart15(prompt, D, R, o, sol, hints, text) {
    o = o || {}; var dv = o.dv || 'x', rv = o.rv || 'y';
    var Dp = S.parse(D).set, Rp = S.parse(R).set, sw = !S.eq(Dp, Rp);
    var cD = setChk15(D, { v: dv, other: sw ? R : null, otherName: 'range', wrong: o.dW }), cR = setChk15(R, { v: rv, other: sw ? D : null, otherName: 'domain', wrong: o.rW });
    var vars = [dv, rv].filter(function (v, i, a) { return a.indexOf(v) === i; });
    var fl = [{ label: 'Domain:', name: 'Domain', mode: 'math', keys: 'set', vars: vars, wide: true, placeholder: o.phD || PH(dv, Dp.kind === 'list') }, { label: 'Range:', name: 'Range', mode: 'math', keys: 'set', vars: vars, wide: true, placeholder: o.phR || PH(rv, Rp.kind === 'list') }];
    var p = B.fields(prompt, fl, [cD, cR], [D, R], 'Domain: ' + t(D) + '<br>Range: ' + t(R), sol, hints, text);
    var bad = [];
    if (sw) bad.push([R, D]);
    (o.dW || []).forEach(function (w) { var q = S.parse(w.is); if (q.ok && !S.eq(q.set, Dp)) bad.push([w.is, R]); });
    (o.rW || []).forEach(function (w) { var q = S.parse(w.is); if (q.ok && !S.eq(q.set, Rp)) bad.push([D, w.is]); });
    p.bad = bad.concat(o.bad || []);
    return p;
  }
  var HINT_D = 'The <b>domain</b> is every ' + t('x') + '-value the graph uses (look left to right); the <b>range</b> is every ' + t('y') + '-value (look bottom to top).';

  /* ================= graphs ================= */
  var EDGE = 5.4, BLUE = '#2b55a0', RED = '#c0392b', INK = '#2b3340';
  function G(spec) { return HW.graph(Object.assign({ x: [-6, 6], y: [-6, 6], labels: 1, max: 300 }, spec)); }
  function toEdge(p, d, w) {
    w = w || EDGE; var k = Infinity;
    if (d[0] > 0) k = Math.min(k, (w - p[0]) / d[0]); if (d[0] < 0) k = Math.min(k, (-w - p[0]) / d[0]);
    if (d[1] > 0) k = Math.min(k, (w - p[1]) / d[1]); if (d[1] < 0) k = Math.min(k, (-w - p[1]) / d[1]);
    return [cl(p[0] + k * d[0]), cl(p[1] + k * d[1])];
  }
  function lineSeg(m, c, w) { var p = [0, c], d = [1, m]; return { pts: [toEdge(p, [-d[0], -d[1]], w), toEdge(p, d, w)], start: 'arrow', end: 'arrow' }; }
  function flexFigs(list, w) { w = w || 150; return '<div style="display:flex;flex-wrap:wrap;gap:6px 14px;align-items:flex-start">' + list.map(function (f) { return '<div style="flex:1 1 ' + w + 'px;max-width:230px">' + f + '</div>'; }).join('') + '</div>'; }
  function gv(pts, pieces, join) { return { pts: pts || [], pieces: pieces || [], join: join || 'none' }; }
  function segv(a, b, s, e) { return { v: [a, b], s: s || 'closed', e: e || 'closed' }; }
  function exactChk(target, opt) { var base = K.graphExact(target, opt); return function (resp) { if (!Dr.empty(resp) && Dr.same(resp, target)) return ok(); return base(resp); }; }
  var SK_HELP = 'Use <b>╱ Line</b> to draw (tap each corner; tap the last point again to finish) and <b>●○ Ends</b> to make an end solid.';
  function isPt(p) { return Math.abs(p.lo - p.hi) < 1e-9; }
  function sketchChk(rules) {
    var base = K.graphRules(rules);
    var dP = rules.domain ? Dr.setParts(S.parse(rules.domain).set) : null, rP = rules.range ? Dr.setParts(S.parse(rules.range).set) : null;
    return function (resp) {
      var res = base(resp); if (res.v !== 'wrong') return res;
      var v = Dr.norm(resp), dd = Dr.domain(v).parts, rr = Dr.range(v).parts;
      if (dP && rP && !Dr.partsSame(dP, rP) && Dr.partsSame(dd, rP) && Dr.partsSame(rr, dP)) return wrong('u5x-sk-swap', 'Your graph has the domain and range swapped. The <b>domain</b> is read along the ' + t('x') + '-axis (left to right), the <b>range</b> along the ' + t('y') + '-axis (bottom to top).');
      if (dP && !dP.every(isPt) && !v.pieces.length && v.join === 'none') return wrong('u5x-sk-points', 'Separate dots give only a few ' + t('x') + '-values. A <b>continuous</b> graph is an unbroken line: draw a line (╱ Line) that uses every ' + t('x') + ' in between.');
      if ((res.code === 'rule-domain' && dP && dd.length === dP.length && dd.every(function (q, i) { return same(q.lo, dP[i].lo) && same(q.hi, dP[i].hi); })) ||
          (res.code === 'rule-range' && rP && rr.length === rP.length && rr.every(function (q, i) { return same(q.lo, rP[i].lo) && same(q.hi, rP[i].hi); })))
        return wrong('u5x-sk-ends', 'Your graph reaches the right values — now make both end dots <b>solid</b>, so the end values are included.');
      return res;
    };
  }
  function sketchPart(prompt, pad, rules, key, bads, sol, hints, text) {
    var p = B.graph(prompt + '<div class="muted">Many different drawings are right. ' + SK_HELP + '</div>', pad, sketchChk(rules), key, sol, hints, text);
    p.answer = 'One possible answer:' + p.answer; p.bad = bads || [];
    return p;
  }
  /* a small sketch graph without numbers (story graphs); pts in 0…10 units; curve = list of points */
  function mini(pts, xT, yT) {
    var X = function (x) { return 30 + x * 11.5; }, Y = function (y) { return 100 - y * 8.6; };
    var s = '<rect width="160" height="122" fill="#fff"/><line x1="30" y1="100" x2="152" y2="100" stroke="' + INK + '" stroke-width="1.5"/><line x1="30" y1="100" x2="30" y2="8" stroke="' + INK + '" stroke-width="1.5"/>';
    s += '<path d="M152 100 l-6 -3.5 v7 z M30 6 l-3.5 6 h7 z" fill="' + INK + '"/>';
    s += '<text x="91" y="116" font-size="11" text-anchor="middle" fill="' + INK + '">' + xT + '</text><text x="14" y="54" font-size="11" text-anchor="middle" fill="' + INK + '" transform="rotate(-90 14 54)">' + yT + '</text>';
    s += '<polyline points="' + pts.map(function (p) { return X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1); }).join(' ') + '" fill="none" stroke="' + RED + '" stroke-width="2.5" stroke-linejoin="round"/>';
    return '<svg class="fig-svg" viewBox="0 0 160 122" style="max-width:170px" role="img" aria-label="' + yT + ' against ' + xT + '">' + s + '</svg>';
  }

  /* =====================================================================================================
   * Lesson 1 — The Cartesian plane and plotting points (RF2)
   * ===================================================================================================== */
  function quadOf(p) { return p[0] > 0 ? (p[1] > 0 ? 'I' : 'IV') : (p[1] > 0 ? 'II' : 'III'); }
  function moveWords(p) { return Math.abs(p[0]) + ' units ' + (p[0] > 0 ? '<b>right</b>' : '<b>left</b>') + ' (' + t('x=' + p[0]) + ') and ' + Math.abs(p[1]) + ' units ' + (p[1] > 0 ? '<b>up</b>' : '<b>down</b>') + ' (' + t('y=' + p[1]) + ')'; }
  function l1q1(r) { // Ryan: P(−4, 2) · P(3, −4)
    var p = pickWhere(function () { return [r.pick(nz(-5, 5)), r.pick(nz(-5, 5))]; }, function (p) { return Math.abs(p[0]) !== Math.abs(p[1]); });
    var g = G({ points: [{ x: p[0], y: p[1], label: 'P', color: RED }], aria: 'point P on a coordinate grid', max: 280 });
    var lr = p[0] < 0 ? 'to the <b>left</b> of the ' + t('y') + '-axis, and left means a negative ' + t('x') : 'to the <b>right</b> of the ' + t('y') + '-axis, so ' + t('x') + ' is positive';
    var ud = p[1] < 0 ? '<b>below</b> the ' + t('x') + '-axis, and down means a negative ' + t('y') : '<b>above</b> the ' + t('x') + '-axis, so ' + t('y') + ' is positive';
    return ptPart('Each grid square is 1 unit. State the coordinates of point ' + t('P') + ' as an ordered pair.' + g, p, {
      dl: [[[-p[0], p[1]], 'u5x-pt-sign', t('P') + ' is ' + lr + '. So ' + t('P') + ' is ' + t(ptT(p)) + '.'], [[p[0], -p[1]], 'u5x-pt-sign', t('P') + ' is ' + ud + '. So ' + t('P') + ' is ' + t(ptT(p)) + '.'],
        [[-p[1], -p[0]], 'u5x-pt-swap', 'Read ' + t('x') + ' first (left or right), then ' + t('y') + ' (up or down).']],
      swapHint: 'Move left or right first: that is ' + t('x') + '. Then up or down: that is ' + t('y') + '.' },
      'From the origin, ' + t('P') + ' is ' + moveWords(p) + ': ' + t('P' + ptT(p)) + '.',
      ['Start at the origin. How many units left or right do you move to get below or above ' + t('P') + '? That is the ' + t('x') + '-coordinate.', 'Left and down are negative. Write ' + t('(x,\\ y)') + ': the left/right number first.'], 'read a point');
  }
  function l1q2(r) { // Ryan: (5, −3) · (−6, 2)
    var p = pickWhere(function () { return [r.pick(nz(-9, 9)), r.pick(nz(-9, 9))]; }, function (p) { return Math.abs(p[0]) !== Math.abs(p[1]); });
    var q = quadOf(p), SG = { I: '(+, +)', II: '(−, +)', III: '(−, −)', IV: '(+, −)' };
    var expl = t('x=' + p[0]) + ' is ' + (p[0] > 0 ? 'positive (right)' : 'negative (left)') + ' and ' + t('y=' + p[1]) + ' is ' + (p[1] > 0 ? 'positive (up)' : 'negative (down)') + '. Signs ' + SG[q] + ' mean <b>Quadrant ' + q + '</b>.';
    var opts = ['I', 'II', 'III', 'IV'].map(function (Qd) {
      if (Qd === q) return { html: 'Quadrant ' + Qd, right: true };
      var why;
      if (Qd === quadOf([p[1], p[0]])) why = 'Read the coordinates in order: ' + t('x') + ' (left/right) first, then ' + t('y') + ' (up/down). ' + expl;
      else if (Qd === 'III') why = 'Quadrant III needs <b>both</b> coordinates negative. ' + expl;
      else if (Qd === 'I') why = 'The signs matter: a negative coordinate means left or down. ' + expl;
      else why = 'The quadrants are numbered counter-clockwise from the top right: I, II, III, IV. ' + expl;
      return { html: 'Quadrant ' + Qd, why: why, code: 'q' + Qd };
    });
    return mc(r, 'Without plotting, where does the point ' + t(ptT(p)) + ' lie?', opts, expl,
      ['The sign of ' + t('x') + ' tells you left (−) or right (+); the sign of ' + t('y') + ' tells you down (−) or up (+).', 'Quadrants go counter-clockwise from the top right: I (+, +), II (−, +), III (−, −), IV (+, −).'], 'quadrant of a point', true);
  }
  function l1q3(r) { // Ryan: (0, −6) · (−7, 0)
    var k = r.pick(nz(-9, 9)), onY = r.chance(0.5), p = onY ? [0, k] : [k, 0];
    var guess = onY ? (k > 0 ? r.pick(['I', 'II']) : r.pick(['III', 'IV'])) : (k > 0 ? r.pick(['I', 'IV']) : r.pick(['II', 'III']));
    var expl = onY ? t('x=0') + ' means no move left or right; then ' + Math.abs(k) + ' units ' + (k > 0 ? 'up' : 'down') + '. The point is <b>on the ' + t('y') + '-axis</b>, not in any quadrant.'
      : 'Move ' + Math.abs(k) + ' units ' + (k > 0 ? 'right' : 'left') + '; ' + t('y=0') + ' means no move up or down. The point is <b>on the ' + t('x') + '-axis</b>, not in any quadrant.';
    var opts = [{ html: 'In Quadrant ' + guess, why: 'A coordinate of ' + t('0') + ' puts the point right on an axis, not inside a quadrant. ' + expl, code: 'quad' },
      { html: 'On the ' + t('x') + '-axis', right: !onY, why: onY ? 'Points on the ' + t('x') + '-axis have ' + t('y=0') + '. Here ' + t('x=0') + ' instead. ' + expl : null, code: 'xaxis' },
      { html: 'On the ' + t('y') + '-axis', right: onY, why: onY ? null : 'Points on the ' + t('y') + '-axis have ' + t('x=0') + '. Here ' + t('y=0') + ' instead. ' + expl, code: 'yaxis' },
      { html: 'At the origin', why: 'The origin is ' + t('(0,\\ 0)') + '. This point is ' + Math.abs(k) + ' units away from it. ' + expl, code: 'origin' }];
    return mc(r, 'Where does the point ' + t(ptT(p)) + ' lie?', opts, expl,
      ['A coordinate of ' + t('0') + ' means you don’t move in that direction.', 'Points on the ' + t('x') + '-axis look like ' + t('(a,\\ 0)') + '; points on the ' + t('y') + '-axis look like ' + t('(0,\\ b)') + '.'], 'point on an axis', true);
  }
  function l1q4(r) { // added Mastery: the fourth corner of a rectangle (Lesson 1 Part C, shapes from points)
    var s = pickWhere(function () { return { x1: r.pick(nz(-6, 6)), x2: r.pick(nz(-6, 6)), y1: r.pick(nz(-6, 6)), y2: r.pick(nz(-6, 6)), hFirst: r.chance(0.5) }; },
      function (s) { return Math.abs(s.x1 - s.x2) >= 3 && Math.abs(s.y1 - s.y2) >= 3 && (s.x1 * s.x2 < 0 || s.y1 * s.y2 < 0) && Math.abs(s.x1) !== Math.abs(s.y2); });
    var A = [s.x1, s.y1], Bq = s.hFirst ? [s.x2, s.y1] : [s.x1, s.y2], C = [s.x2, s.y2], D = s.hFirst ? [s.x1, s.y2] : [s.x2, s.y1];
    var W1 = [A[0] + Bq[0] - C[0], A[1] + Bq[1] - C[1]], W2 = [Bq[0] + C[0] - A[0], Bq[1] + C[1] - A[1]];
    var dl = [[W1, 'u5x-rect-corner', 'With that point the shape is not a rectangle. ' + t('D') + ' must line up with ' + t('A') + ' (one side) and with ' + t('C') + ' (the other side).'], [W2, 'u5x-rect-corner', 'With that point the shape is not a rectangle. Sketch ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ': ' + t('D') + ' goes opposite ' + t('B') + '.'], [Bq, 'u5x-rect-corner', 'That is corner ' + t('B') + '. The fourth corner is the one opposite ' + t('B') + '.']];
    var sh = s.hFirst ? [t('A') + ' and ' + t('B') + ' share the ' + t('y') + '-coordinate ' + t(s.y1) + ' (a horizontal side), and ' + t('B') + ' and ' + t('C') + ' share the ' + t('x') + '-coordinate ' + t(s.x2) + ' (a vertical side).', t('D') + ' is straight above or below ' + t('A') + ' (same ' + t('x') + ', ' + t(s.x1) + ') and straight across from ' + t('C') + ' (same ' + t('y') + ', ' + t(s.y2) + ').']
      : [t('A') + ' and ' + t('B') + ' share the ' + t('x') + '-coordinate ' + t(s.x1) + ' (a vertical side), and ' + t('B') + ' and ' + t('C') + ' share the ' + t('y') + '-coordinate ' + t(s.y2) + ' (a horizontal side).', t('D') + ' is straight across from ' + t('A') + ' (same ' + t('y') + ', ' + t(s.y1) + ') and straight above or below ' + t('C') + ' (same ' + t('x') + ', ' + t(s.x2) + ').'];
    return ptPart('Three corners of a rectangle are ' + t('A' + ptT(A)) + ', ' + t('B' + ptT(Bq)) + ' and ' + t('C' + ptT(C)) + ', in order around the rectangle. Its sides are horizontal and vertical. State the coordinates of the fourth corner, ' + t('D') + '. (A quick sketch helps.)', D, { dl: dl },
      sh.join('<br>') + '<br>So ' + t('D' + ptT(D)) + '.',
      ['Two corners on a horizontal side have the same ' + t('y') + '-coordinate; two corners on a vertical side have the same ' + t('x') + '-coordinate.', 'Sketch the three points. The fourth corner is opposite ' + t('B') + '.'], 'fourth corner of a rectangle');
  }
  HW.defineExit({ lesson: 'u5l1', calc: true, outcome: 'RF2',
    blurb: 'Read a point’s coordinates, name a point’s quadrant, a point on an axis, and the fourth corner of a rectangle.',
    questions: [Q(1, 'RF2', 'BEG', 'Reading a point.', l1q1), Q(2, 'RF2', 'BEG', 'Quadrants.', l1q2), Q(3, 'RF2', 'BEG', 'Points on an axis.', l1q3), Q(4, 'RF2', 'MAS', 'The fourth corner.', l1q4)] });

  /* =====================================================================================================
   * Lesson 2 — Growing patterns and types of variables (RF1, RF4)
   * ===================================================================================================== */
  var IVDV = [
    { set: 'A pool is being filled with a hose.', dep: 'the depth of the water', ind: 'the number of minutes the hose has been running', D: 'Depth', I: 'Minutes' },
    { set: 'A pizza order is being priced.', dep: 'the cost', ind: 'the number of toppings', D: 'Cost', I: 'Toppings' },
    { set: 'A car is being filled with gas.', dep: 'the total cost', ind: 'the number of litres pumped', D: 'Total cost', I: 'Litres pumped' },
    { set: 'Ana works at a part-time job.', dep: 'her pay', ind: 'the number of hours she works', D: 'Pay', I: 'Hours worked' },
    { set: 'A candle is burning.', dep: 'the height of the candle', ind: 'the number of hours it has burned', D: 'Height', I: 'Hours burned' },
    { set: 'A teacher hands out stickers.', dep: 'the number of stickers given out', ind: 'the number of students in the class', D: 'Stickers', I: 'Students' },
    { set: 'Theo is reading a novel.', dep: 'the number of pages read', ind: 'the number of minutes spent reading', D: 'Pages read', I: 'Minutes' },
    { set: 'A glass of ice water sits on the counter.', dep: 'the temperature of the water', ind: 'the number of minutes it has been sitting', D: 'Temperature', I: 'Minutes' },
    { set: 'A taxi ride is being priced.', dep: 'the fare', ind: 'the distance driven', D: 'Fare', I: 'Distance' },
    { set: 'Mila saves money in a piggy bank.', dep: 'the total amount saved', ind: 'the number of weeks she has been saving', D: 'Amount saved', I: 'Weeks' }];
  function l2q1(r) { // Ryan: pool depth / minutes · pizza cost / toppings
    var c = r.pick(IVDV), dir = r.chance(0.5);
    var sent = dir ? 'The <b>' + c.dep.replace(/^the /, '') + '</b> depends on the <b>' + c.ind.replace(/^the /, '') + '</b>.' : 'The <b>' + c.ind.replace(/^the /, '') + '</b> decides the <b>' + c.dep.replace(/^the /, '') + '</b>.';
    var H = 'the horizontal (' + t('x') + ') axis', V = 'the vertical (' + t('y') + ') axis', why0 = c.D + ' <b>depends on</b> ' + c.ind.replace(/^the /, 'the ') + ', so ' + c.D.toLowerCase() + ' is the dependent variable.';
    var opts = [{ html: c.I + ' is independent and goes on ' + H, right: true },
      { html: c.D + ' is independent and goes on ' + H, why: why0 + ' ' + c.I + ' is independent, and the independent variable goes on the horizontal axis.', code: 'swap' },
      { html: c.I + ' is independent and goes on ' + V, why: c.I + ' is independent — that part is right — but the independent variable always goes on the <b>horizontal</b> (' + t('x') + ') axis.', code: 'axis' },
      { html: c.D + ' is independent and goes on ' + V, why: why0 + ' The independent variable (' + c.I.toLowerCase() + ') goes on the horizontal (' + t('x') + ') axis.', code: 'both' }];
    return mc(r, c.set + ' ' + sent + ' Which statement is correct?', opts,
      c.D + ' results from ' + c.ind + ', so <b>' + c.I.toLowerCase() + '</b> is the independent variable (horizontal axis) and ' + c.D.toLowerCase() + ' is the dependent variable (vertical axis).',
      ['The dependent variable is the one that <b>depends on</b> (results from) the other.', 'The independent variable goes on the horizontal axis; the dependent variable on the vertical axis.'], 'independent variable and axis');
  }
  var TILE = {
    plus: { a: 5, d: 4, grow: 'one tile is added to the end of each of the 4 arms', cells: function (n) { var c = [[0, 0]]; for (var i = 1; i <= n; i++) c.push([i, 0], [-i, 0], [0, i], [0, -i]); return c; } },
    rect2: { a: 6, d: 2, grow: 'a new column of 2 tiles is added', cells: function (n) { var c = []; for (var i = 0; i < n + 2; i++) c.push([i, 0], [i, 1]); return c; } },
    L: { a: 3, d: 2, grow: 'one tile is added to each arm of the L', cells: function (n) { var c = [[0, 0]]; for (var i = 1; i <= n; i++) c.push([0, i], [i, 0]); return c; } },
    T: { a: 4, d: 3, grow: 'one tile is added to each end of the top and one to the bottom of the stem', cells: function (n) { var c = []; for (var i = -n; i <= n; i++) c.push([i, 0]); for (var j = 1; j <= n; j++) c.push([0, -j]); return c; } },
    rect3: { a: 6, d: 3, grow: 'a new column of 3 tiles is added', cells: function (n) { var c = []; for (var i = 0; i < n + 1; i++) c.push([i, 0], [i, 1], [i, 2]); return c; } }
  };
  function tileFigs(kind) {
    var T0 = TILE[kind], u = 11, gap = 30, figs = [1, 2, 3].map(function (n) { var c = T0.cells(n), xs = c.map(function (p) { return p[0]; }), ys = c.map(function (p) { return p[1]; }); return { c: c, x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs), y0: Math.min.apply(null, ys), y1: Math.max.apply(null, ys) }; });
    var Hh = Math.max.apply(null, figs.map(function (f) { return f.y1 - f.y0 + 1; })) * u, x = 10, s = '';
    figs.forEach(function (f, i) {
      var w = (f.x1 - f.x0 + 1) * u, top = 8 + Hh - (f.y1 - f.y0 + 1) * u;
      f.c.forEach(function (p) { s += '<rect x="' + (x + (p[0] - f.x0) * u) + '" y="' + (top + (f.y1 - p[1]) * u) + '" width="' + u + '" height="' + u + '" fill="#dbe6f6" stroke="' + BLUE + '" stroke-width="1.2"/>'; });
      s += '<text x="' + (x + w / 2) + '" y="' + (Hh + 26) + '" font-size="12" text-anchor="middle" fill="' + INK + '">Figure ' + (i + 1) + '</text>';
      x += Math.max(w, 50) + gap;
    });
    return '<div class="fig"><svg class="fig-svg" viewBox="0 0 ' + x + ' ' + (Hh + 34) + '" style="max-width:' + Math.min(360, x * 1.3) + 'px" role="img" aria-label="tile pattern, figures 1 to 3">' + '<rect width="' + x + '" height="' + (Hh + 34) + '" fill="#fff"/>' + s + '</svg></div>';
  }
  function l2q2(r) { // Ryan: plus pattern 5, 9, 13 → Figure 6 · 2-row rectangle 6, 8, 10 → Figure 7
    var kind = r.pick(Object.keys(TILE)), T0 = TILE[kind], N = r.int(5, 10), a = T0.a, d = T0.d, cnt = function (n) { return a + d * (n - 1); };
    var seq = range(1, N).map(cnt);
    return numPart('The tile pattern grows by the same amount each time.' + tileFigs(kind) + 'How many tiles will be in <b>Figure ' + N + '</b>?', cnt(N), [
      [d * N, 'u5x-pat-nostart', 'The pattern does not start at ' + t('0') + ': Figure 1 already has ' + t(a) + ' tiles, then ' + t(d) + ' more are added each time.'],
      [cnt(N + 1), 'u5x-pat-extra-step', 'Figure 1 has ' + t(a) + ' tiles, so only ' + t(N - 1) + ' more steps take you to Figure ' + N + '.'],
      [a * N, 'u5x-pat-times-first', 'The pattern grows by <b>adding ' + d + '</b> each time, not by repeating Figure 1. Count on: ' + seq.slice(0, 4).join(', ') + ', …'],
      [cnt(N - 1), 'u5x-pat-short', 'That is Figure ' + (N - 1) + '. Count the figures as you go: one more step to Figure ' + N + '.']],
      'Count the tiles: ' + seq.slice(0, 3).join(', ') + ' — ' + T0.grow + ', so ' + t(d) + ' tiles are added each time.<br>Continue: ' + seq.map(function (v, i) { return 'Figure ' + (i + 1) + ': ' + v; }).join(', ') + '.<br>Figure ' + N + ' has <b>' + cnt(N) + '</b> tiles.',
      ['Count the tiles in Figures 1, 2 and 3. How many are added each time?', 'Keep adding that amount, one figure at a time, until you reach Figure ' + N + '.'], 'tile pattern: Figure ' + N, { after: 'tiles' });
  }
  var PAT3 = [{ noun: 'chairs', what: 'Square tables are pushed together in a row, and chairs are placed around them.' }, { noun: 'toothpicks', what: 'A row of squares is made from toothpicks.' },
    { noun: 'bricks', what: 'A garden wall is built in steps, with the same number of bricks added each time.' }, { noun: 'coins', what: 'Coins are laid out in a growing pattern.' }, { noun: 'logs', what: 'A stack of firewood grows level by level.' }];
  function l2q3(r) { // added Mastery: working a pattern backwards (Lesson 2 "continue the pattern", in reverse)
    var s = pickWhere(function () { return { c: r.pick(PAT3), a: r.int(3, 9), d: r.int(2, 6), k: r.int(9, 16) }; }, function (s) { return s.a !== s.d; });
    var a = s.a, d = s.d, k = s.k, Tn = a + d * (k - 1), noun = s.c.noun;
    return numPart(s.c.what + ' The table shows the number of ' + noun + ' in each figure.' + HW.valueTable([['Figure', 1, 2, 3, 4], ['Number of ' + noun, a, a + d, a + 2 * d, a + 3 * d]]) + 'Which figure has exactly ' + t(Tn) + ' ' + noun + '?', k, [
      [Tn / d, 'u5x-pat-div-only', 'Figure 1 already has ' + t(a) + ' ' + noun + '. Find how many must be <b>added</b> after Figure 1: ' + t(Tn + '-' + a) + '.'],
      [(Tn - a) / d, 'u5x-pat-off-one', 'That is the number of <b>steps</b> after Figure 1. Add it to the figure number you started from (Figure 1).'],
      [Tn - a, 'u5x-pat-nodiv', 'That is how many ' + noun + ' are added after Figure 1. Each figure adds ' + t(d) + ', so divide by ' + t(d) + ' to count the steps.']],
      'Each figure has ' + t(d) + ' more ' + noun + ' than the one before. From Figure 1 (' + t(a) + ') to ' + t(Tn) + ' is ' + t(Tn + '-' + a + '=' + (Tn - a)) + ' more ' + noun + ', which is ' + t((Tn - a) + '\\div ' + d + '=' + (k - 1)) + ' steps.<br>So it is Figure ' + t('1+' + (k - 1) + '=' + k) + '. Check: ' + t(a + '+' + d + '\\times' + (k - 1) + '=' + Tn) + ' ✓',
      ['How many ' + noun + ' are added each time?', 'How many must be added after Figure 1 to reach ' + t(Tn) + '? How many steps is that?'], 'pattern backwards', { before: 'Figure' });
  }
  HW.defineExit({ lesson: 'u5l2', calc: true, outcome: 'RF4',
    blurb: 'Independent and dependent variables and their axes, continuing a tile pattern, and finding which figure has a given number of items.',
    questions: [Q(1, 'RF1', 'BEG', 'Types of variables.', l2q1), Q(2, 'RF4', 'PRG', 'A growing pattern.', l2q2), Q(3, 'RF4', 'MAS', 'Working backwards.', l2q3)] });

  /* =====================================================================================================
   * Lesson 3 — Describing relationships between two quantities (RF2, RF4)
   * ===================================================================================================== */
  function l3q1(r) { // Ryan: 3→8, 5→14, 7→20 (input 5) · 2, 4, 6 (input 4)
    var a = r.int(1, 6), st = r.int(1, 3), L = [a, a + st, a + 2 * st];
    var outs = pickWhere(function () { return r.sample(range(2, 25), 3); }, function (o) { return uniq(o).length === 3 && o.every(function (v) { return L.indexOf(v) < 0; }); });
    var disp = pickWhere(function () { return r.shuffle(outs.slice()); }, function (d) { return d.every(function (v, i) { return v !== outs[i]; }); });
    var ask = r.int(0, 2), x = L[ask], y = outs[ask], across = disp[ask], other = (ask + 1 + r.int(0, 1)) % 3, nm = r.pick([['A', 'B'], ['P', 'Q'], ['R', 'S'], ['m', 'n']]);
    var dg = HW.arrowDiagram(L, disp, L.map(function (v, i) { return [v, outs[i]]; }), { leftTitle: nm[0], rightTitle: nm[1] });
    return ptPart('The mapping diagram shows a relation. Write the ordered pair ' + t('(' + nm[0] + ',\\ ' + nm[1] + ')') + ' that has input ' + nw(t(x) + '.') + '<div class="fig">' + dg + '</div>', [x, y], {
      dl: [[[x, across], 'u5x-map-across', 'The outputs are not in the same order as the inputs. Follow the arrow that leaves ' + t(x) + ': it points to ' + t(y) + '.'],
        [[L[other], outs[other]], 'u5x-map-other', 'That pair has the input ' + t(L[other]) + '. Start at ' + t(x) + ' in the left oval and follow its arrow.']],
      swapHint: 'In ' + t('(' + nm[0] + ',\\ ' + nm[1] + ')') + ' the input comes first. Follow the arrow that leaves ' + t(x) + ': it points to ' + t(y) + ', so the pair is ' + t(ptT([x, y])) + '.' },
      'Start at ' + t(x) + ' in the left oval and follow its arrow to ' + t(y) + ' in the right oval. The ordered pair is ' + t(ptT([x, y])) + ' (input first).',
      ['Find ' + t(x) + ' in the <b>left</b> oval (the inputs) and follow its arrow.', 'Write (input, output).'], 'mapping diagram to ordered pair');
  }
  function l3q2(r) { // Ryan: "which graph shows the table" (x 1,2,3 · y 4,5,2) → plot the table yourself
    var n = r.pick([3, 4]);
    var s = pickWhere(function () { var xs = r.sample(range(1, 6), n).sort(function (a, b) { return a - b; }); return { xs: xs, ys: xs.map(function () { return r.int(1, 6); }) }; },
      function (s) { var srt = s.ys.slice().sort(function (a, b) { return a - b; }); var P0 = s.xs.map(function (x, i) { return [x, s.ys[i]]; }); return s.xs.every(function (x, i) { return x !== s.ys[i]; }) && srt.join() !== s.ys.join() && uniq(s.ys).length >= 3 && !Dr.same(gv(P0), gv(P0.map(function (q) { return [q[1], q[0]]; }))); });
    var pts = s.xs.map(function (x, i) { return [x, s.ys[i]]; }), srt = s.ys.slice().sort(function (a, b) { return a - b; }), key = gv(pts.map(function (p) { return p.slice(); }));
    var wr = [{ is: gv(s.xs.map(function (x, i) { return [x, srt[i]]; })), code: 'u5x-plot-sorted', hint: 'Keep each ' + t('x') + ' with the ' + t('y') + ' directly below it in the table — don’t sort the ' + t('y') + '-values.' }];
    pts.forEach(function (p, i) { wr.push({ is: gv(pts.map(function (q, j) { return j === i ? [q[1], q[0]] : q.slice(); })), code: 'u5x-one-swap', hint: 'One point is plotted the wrong way round: ' + t(ptT(p)) + ' is ' + t(p[0]) + ' across, then ' + t(p[1]) + ' up.' }); });
    var p0 = B.graph('The table of values shows a relation.' + HW.valueTable([[t('x')].concat(s.xs), [t('y')].concat(s.ys)]) + 'Plot the relation on the grid. (Tap the grid to place a point; tap it again to remove it.)',
      { x: [0, 7], y: [0, 7], labels: 1, mode: 'points', firstQuadrant: true, max: 290 }, exactChk(key, { wrong: wr }), key,
      'Each column of the table is one ordered pair ' + t('(x,\\ y)') + ': ' + pts.map(function (p) { return t(ptT(p)); }).join(', ') + '. For each one, go across to ' + t('x') + ', then up to ' + t('y') + '.',
      ['Read down each column: the top number is ' + t('x') + ', the bottom number is ' + t('y') + '.', 'Go across first, then up.'], 'plot a table of values');
    p0.bad = wr.map(function (w) { return w.is; }).filter(function (b) { return !Dr.same(b, key); }).slice(0, 3).concat([gv(pts.map(function (p) { return [p[1], p[0]]; }))]);
    return p0;
  }
  var FEES = [
    { txt: function (f, c) { return 'A climbing gym charges a ' + t('\\$' + f) + ' sign-up fee plus ' + t('\\$' + c) + ' per visit.'; }, v: 'v', V: 'C', vw: 'the number of visits', Vw: 'the total cost, in dollars' },
    { txt: function (f, c) { return 'A bowling alley charges ' + t('\\$' + f) + ' for shoe rental plus ' + t('\\$' + c) + ' per game.'; }, v: 'g', V: 'C', vw: 'the number of games', Vw: 'the total cost, in dollars' },
    { txt: function (f, c) { return 'A taxi charges a ' + t('\\$' + f) + ' starting fee plus ' + t('\\$' + c) + ' per kilometre.'; }, v: 'd', V: 'F', vw: 'the distance in kilometres', Vw: 'the fare, in dollars' },
    { txt: function (f, c) { return 'A pottery studio charges a ' + t('\\$' + f) + ' registration fee plus ' + t('\\$' + c) + ' per class.'; }, v: 'n', V: 'C', vw: 'the number of classes', Vw: 'the total cost, in dollars' }];
  function l3q3(r) { // added Mastery: a relation from a rule in words, as ordered pairs (Lesson 3 Part D)
    var c = r.pick(FEES), f = r.pick([4, 5, 8, 10, 12, 15, 20]), k = r.pick([2, 3, 4, 5, 6, 8]), xs = r.pick([[1, 2, 3, 4], [2, 3, 4, 5], [2, 4, 6, 8], [1, 3, 5, 7]]);
    var pr = xs.map(function (x) { return [x, f + k * x]; }), noFee = xs.map(function (x) { return [x, k * x]; }), each = xs.map(function (x) { return [x, (f + k) * x]; });
    var base = K.pairs(pr), cN = K.pairs(noFee), cE = K.pairs(each);
    var check = function (resp) {
      var res = base(resp); if (res.v !== 'wrong') return res;
      if (cN(resp).v === 'correct') return wrong('u5x-pairs-nofee', 'Don’t forget the one-time fee: every total includes the ' + t('\\$' + f) + ' once.');
      if (cE(resp).v === 'correct') return wrong('u5x-pairs-fee-each', 'The ' + t('\\$' + f) + ' is paid only <b>once</b>, not for every ' + (c.v === 'd' ? 'kilometre' : 'one') + '. Each total is ' + t(f + '+' + k + '\\times ' + c.v) + '.');
      return res;
    };
    var keyTex = '\\{' + pr.map(function (p) { return '(' + p[0] + ', ' + p[1] + ')'; }).join(', ') + '\\}';
    var p0 = { prompt: c.txt(f, k) + ' Let ' + t(c.v) + ' be ' + c.vw + ' and ' + t(c.V) + ' ' + c.Vw + '. Write this relation as a set of ordered pairs ' + t('(' + c.v + ',\\ ' + c.V + ')') + ' for ' + t(c.v + '=' + xs.join(',\\ ')) + '.',
      input: { type: 'math', keys: 'pairs', placeholder: 'e.g. {(1, 4), (2, 7)}' }, check: check, key: keyTex, answer: t(keyTex.replace(/, /g, ',\\ ')),
      solution: 'Each total is the fee plus ' + t(k) + ' for each one: ' + t(c.V + '=' + f + '+' + k + c.v) + '.<br>' + xs.map(function (x) { return t(c.v + '=' + x) + ': ' + t(f + '+' + k + '\\times ' + x + '=' + (f + k * x)); }).join('<br>') + '<br>' + t(keyTex.replace(/, /g, ',\\ ')),
      hints: ['The fee is paid once; the ' + t('\\$' + k) + ' is paid for each one. Total ' + t('=' + f + '+' + k + '\\times(\\text{number})') + '.', 'Write each pair as (input, output): ' + t('(' + c.v + ',\\ ' + c.V + ')') + '.'], text: 'ordered pairs from a rule in words' };
    p0.bad = ['\\{' + noFee.map(function (p) { return '(' + p[0] + ', ' + p[1] + ')'; }).join(', ') + '\\}', '\\{' + each.map(function (p) { return '(' + p[0] + ', ' + p[1] + ')'; }).join(', ') + '\\}', '\\{' + pr.map(function (p) { return '(' + p[1] + ', ' + p[0] + ')'; }).join(', ') + '\\}'];
    return p0;
  }
  HW.defineExit({ lesson: 'u5l3', calc: true, outcome: 'RF2',
    blurb: 'An ordered pair from a mapping diagram, plotting a table of values, and ordered pairs from a rule in words.',
    questions: [Q(1, 'RF2', 'BEG', 'A mapping diagram.', l3q1), Q(2, 'RF4', 'PRG', 'From a table to a graph.', l3q2), Q(3, 'RF2', 'MAS', 'A relation in words.', l3q3)] });

  /* =====================================================================================================
   * Lesson 4 — x- and y-intercepts (RF5)
   * ===================================================================================================== */
  function l4q1(r) { // Ryan: x-intercept (−4, 0) [y-int (0, 2)] · (−3, 0)
    var s = pickWhere(function () { return { x0: r.pick(nz(-5, 5)), b: r.pick(nz(-5, 5)) }; }, function (s) { return Math.abs(s.x0) !== Math.abs(s.b); });
    var x0 = s.x0, b = s.b, d = [-x0, b], g = G({ segs: [{ pts: [toEdge([x0, 0], [-d[0], -d[1]]), toEdge([0, b], d)], start: 'arrow', end: 'arrow', color: RED }], aria: 'a line crossing both axes', max: 280 });
    return ptPart('Each grid square is 1 unit. State the <b>' + t('x') + '-intercept</b> of the line as an ordered pair.' + g, [x0, 0], {
      dl: [[[0, b], 'u5x-int-other', 'The line crosses the <b>' + t('y') + '</b>-axis at ' + t(ptT([0, b])) + '. The ' + t('x') + '-intercept is where it crosses the horizontal ' + t('x') + '-axis.'],
        [[0, x0], 'u5x-int-swap', 'An ' + t('x') + '-intercept always has ' + t('y=0') + ', so it looks like ' + t('(\\square,\\ 0)') + '.'],
        [[-x0, 0], 'u5x-pt-sign', 'The crossing is ' + Math.abs(x0) + ' units to the <b>' + (x0 < 0 ? 'left' : 'right') + '</b> of the origin, so ' + t('x') + ' is ' + (x0 < 0 ? 'negative' : 'positive') + '.']],
      valIdx: 0, valHint: 'Right number! An intercept is a <b>point</b>, so write both coordinates: ' + t('(\\square,\\ 0)') + '.' },
      'The line meets the ' + t('x') + '-axis ' + Math.abs(x0) + ' units ' + (x0 < 0 ? 'left' : 'right') + ' of the origin, where ' + t('y=0') + '. The ' + t('x') + '-intercept is ' + t(ptT([x0, 0])) + '.',
      ['The ' + t('x') + '-intercept is where the line crosses the <b>horizontal</b> axis.', 'Every point on the ' + t('x') + '-axis has ' + t('y=0') + '.'], 'x-intercept from a graph');
  }
  function l4q2(r) { // Ryan: x 3, −2, 0, 1, 5 · y 0, −10, −6, −4, 4 → (0, −6) · (0, −8)
    var s = pickWhere(function () {
      var m = r.pick([1, 2, 3, -1, -2, -3]), x0 = r.pick(nz(-5, 5)), b = -m * x0, others = r.sample(range(-4, 6).filter(function (x) { return x !== 0 && x !== x0; }), 3);
      var xs = r.shuffle([x0, 0].concat(others)); return { m: m, x0: x0, b: b, xs: xs, ys: xs.map(function (x) { return m * x + b; }) };
    }, function (s) { return Math.abs(s.b) <= 15 && Math.abs(s.b) !== Math.abs(s.x0) && s.ys.every(function (y) { return Math.abs(y) <= 20; }) && Math.abs(s.xs.indexOf(0) - s.xs.indexOf(s.x0)) > 1; });
    var x0 = s.x0, b = s.b;
    return ptPart('The table shows points on a relation. State the <b>' + t('y') + '-intercept</b> as an ordered pair.' + HW.valueTable([[t('x')].concat(s.xs), [t('y')].concat(s.ys)]), [0, b], {
      dl: [[[x0, 0], 'u5x-int-other', t(ptT([x0, 0])) + ' has ' + t('y=0') + ', so it is the <b>' + t('x') + '</b>-intercept. For the ' + t('y') + '-intercept, find the column where ' + t('x=0') + '.'],
        [[b, 0], 'u5x-int-swap', 'A ' + t('y') + '-intercept always has ' + t('x=0') + ', so it looks like ' + t('(0,\\ \\square)') + '.'],
        [[0, x0], 'u5x-int-mix', 'Look for the column where <b>' + t('x=0') + '</b> and read the ' + t('y') + '-value below it.']],
      valIdx: 1, valHint: 'Right number! An intercept is a <b>point</b>, so write both coordinates: ' + t('(0,\\ \\square)') + '.' },
      'At a ' + t('y') + '-intercept, ' + t('x=0') + '. The column with ' + t('x=0') + ' has ' + t('y=' + b) + ', so the ' + t('y') + '-intercept is ' + t(ptT([0, b])) + '.',
      ['A ' + t('y') + '-intercept is on the ' + t('y') + '-axis, where ' + t('x=0') + '.', 'Find the column with ' + t('x=0') + ' (the columns are not in order).'], 'y-intercept from a table');
  }
  var ICTX = [
    { L: 'B', yT: 'B (%)', xT: 't (h)', tu: 'hours', tu1: 'hour', thing: 'a phone’s battery level, ' + t('B') + ' (%), after ' + t('t') + ' hours', S: [60, 80, 100], T: [4, 5, 8, 10],
      right: function (T) { return 'After ' + T + ' hours, the battery is empty'; }, start: function (T) { return 'The battery starts at ' + T + '%'; }, rate: function (T) { return 'The battery loses ' + T + '% each hour'; }, mix: function (S, T) { return 'The battery is at ' + S + '% after ' + T + ' hours'; } },
    { L: 'V', yT: 'V (L)', xT: 't (min)', tu: 'minutes', tu1: 'minute', thing: 'the water left in a draining tank, ' + t('V') + ' (L), after ' + t('t') + ' minutes', S: [40, 60, 80], T: [4, 5, 8, 10, 12],
      right: function (T) { return 'After ' + T + ' minutes, the tank is empty'; }, start: function (T) { return 'The tank starts with ' + T + ' L'; }, rate: function (T) { return 'The tank drains ' + T + ' L each minute'; }, mix: function (S, T) { return 'The tank holds ' + S + ' L after ' + T + ' minutes'; } },
    { L: 'h', yT: 'h (cm)', xT: 't (h)', tu: 'hours', tu1: 'hour', thing: 'the height of a burning candle, ' + t('h') + ' (cm), after ' + t('t') + ' hours', S: [20, 24, 30, 40], T: [4, 5, 6, 8, 10],
      right: function (T) { return 'After ' + T + ' hours, the candle has burned down completely'; }, start: function (T) { return 'The candle starts ' + T + ' cm tall'; }, rate: function (T) { return 'The candle burns ' + T + ' cm each hour'; }, mix: function (S, T) { return 'The candle is ' + S + ' cm tall after ' + T + ' hours'; } },
    { L: 'd', yT: 'd (km)', xT: 't (h)', tu: 'hours', tu1: 'hour', thing: 'the distance left to drive, ' + t('d') + ' (km), on a trip, after ' + t('t') + ' hours', S: [200, 300, 400, 600], T: [4, 5, 6, 8],
      right: function (T) { return 'After ' + T + ' hours, the driver reaches the destination'; }, start: function (T) { return 'The trip starts with ' + T + ' km to drive'; }, rate: function (T) { return 'The driver covers ' + T + ' km each hour'; }, mix: function (S, T) { return 'There are ' + S + ' km left after ' + T + ' hours'; } }];
  function l4q3(r) { // Ryan: battery (10, 0), start 80 % · tank (12, 0), start 60 L
    var c = r.pick(ICTX), Sv = r.pick(c.S), T = r.pick(c.T), stY = Sv >= 200 ? 100 : Sv >= 60 ? 20 : 10, gY = stY / 2, ym = Sv + stY, xm = T + 2;
    var g = HW.graph({ x: [0, xm], y: [0, ym], grid: 1, gridY: gY, labels: xm > 10 ? 2 : 1, labelsX: xm > 10 ? 2 : 1, labelsY: stY, unitX: 250 / xm, unitY: 170 / ym, firstQuadrant: true, xName: 't', yName: c.L, xTitle: c.xT, yTitle: c.yT,
      segs: [{ pts: [[0, Sv], [T, 0]], start: 'closed', end: 'closed' }], max: 320, aria: 'a line falling from the vertical axis to the horizontal axis' });
    var opts = [{ html: c.right(T), right: true },
      { html: c.start(T), why: 'The starting value is the <b>vertical</b> intercept, ' + t(ptT([0, Sv])) + '. At ' + t(ptT([T, 0])) + ', ' + t(c.L + '=0') + '.', code: 'start' },
      { html: c.rate(T), why: 'An intercept is a <b>point</b>, not a rate. At ' + t(ptT([T, 0])) + ' the time is ' + T + ' ' + c.tu + ' and ' + t(c.L + '=0') + '.', code: 'rate' },
      { html: c.mix(Sv, T), why: 'At ' + t(ptT([T, 0])) + ' the time is ' + T + ' ' + c.tu + ' and ' + t(c.L + '=0') + '. The ' + Sv + ' belongs to ' + t(ptT([0, Sv])) + ', the start.', code: 'mix' }];
    return mc(r, 'The graph shows ' + c.thing + '. What does the ' + t('t') + '-intercept ' + t(ptT([T, 0])) + ' mean?' + g, opts,
      'At ' + t(ptT([T, 0])) + ', ' + t('t=' + T) + ' ' + c.tu + ' and ' + t(c.L + '=0') + ': ' + c.right(T).replace(/^After/, 'after').replace(/^./, function (z) { return z.toUpperCase(); }) + '.',
      ['A ' + t('t') + '-intercept has the form ' + t('(t,\\ 0)') + ': the time when the amount reaches ' + t('0') + '.', 'The first number is the time; the second is the amount.'], 'meaning of a t-intercept');
  }
  var ICTX2 = [
    { L: 'h', txt: function (H, k) { return 'A candle is ' + t(H) + ' cm tall when it is lit, and it burns down ' + t(k) + ' cm every hour. Its height, ' + t('h') + ' (cm), is graphed against the time, ' + t('t') + ' (hours).'; }, H: [12, 15, 18, 20, 24, 30, 36], k: [2, 3, 4, 5, 6], u: 'cm', tu: 'hours', zero: 'the candle has burned down completely' },
    { L: 'V', txt: function (H, k) { return 'A tank holds ' + t(H) + ' L of water. It drains at ' + t(k) + ' L every minute. The volume, ' + t('V') + ' (L), is graphed against the time, ' + t('t') + ' (minutes).'; }, H: [40, 60, 80, 90, 120], k: [4, 5, 6, 10, 15, 20], u: 'L', tu: 'minutes', zero: 'the tank is empty' },
    { L: 'B', txt: function (H, k) { return 'A tablet’s battery is at ' + t(H + '\\%') + ' and loses ' + t(k + '\\%') + ' every hour while a movie plays. The battery level, ' + t('B') + ' (%), is graphed against the time, ' + t('t') + ' (hours).'; }, H: [60, 80, 90, 100], k: [5, 10, 15, 20], u: '%', tu: 'hours', zero: 'the battery is empty' },
    { L: 'd', txt: function (H, k) { return 'A family has ' + t(H) + ' km left to drive and travels ' + t(k) + ' km every hour. The distance left, ' + t('d') + ' (km), is graphed against the time, ' + t('t') + ' (hours).'; }, H: [180, 240, 300, 360, 400], k: [60, 80, 90, 100], u: 'km', tu: 'hours', zero: 'they arrive' }];
  function l4q4(r) { // added Mastery: both intercepts from a story (Lesson 4 Part C: candle, distance remaining)
    var s = pickWhere(function () { var c = r.pick(ICTX2); return { c: c, H: r.pick(c.H), k: r.pick(c.k) }; }, function (s) { return s.H % s.k === 0 && s.H / s.k >= 3 && s.H / s.k <= 15; });
    var c = s.c, H = s.H, k = s.k, T = H / k, L = c.L;
    var cV = ptChk([0, H], { dl: [[[H, 0], 'u5x-int-swap', 'The ' + t(L) + '-intercept is on the vertical axis, where ' + t('t=0') + ': it looks like ' + t('(0,\\ \\square)') + '.'], [[0, k], 'u5x-int-rate', t(k) + ' is how much is lost each ' + (c.tu === 'minutes' ? 'minute' : 'hour') + '. At ' + t('t=0') + ' (the start) the amount is ' + t(H) + '.']], valIdx: 1 });
    var cT = ptChk([T, 0], { dl: [[[H, 0], 'u5x-int-nodiv', t(H) + ' is the starting amount. The ' + t('t') + '-intercept is the <b>time</b> when the amount reaches ' + t('0') + ': ' + t(H + '\\div ' + k) + '.'], [[0, T], 'u5x-int-swap', 'The ' + t('t') + '-intercept is on the horizontal axis, where ' + t(L + '=0') + ': it looks like ' + t('(\\square,\\ 0)') + '.'], [[k, 0], 'u5x-int-rate', t(k) + ' is the amount lost each ' + (c.tu === 'minutes' ? 'minute' : 'hour') + '. How many ' + c.tu + ' until all ' + t(H) + ' is gone?']], valIdx: 0 });
    var p0 = B.fields(c.txt(H, k) + ' State the ' + t(L) + '-intercept and the ' + t('t') + '-intercept as ordered pairs ' + t('(t,\\ ' + L + ')') + '.',
      [ptField(t(L) + '-intercept (vertical axis):', L + '-intercept'), ptField(t('t') + '-intercept (horizontal axis):', 't-intercept')], [cV, cT], [ptKey([0, H]), ptKey([T, 0])],
      t(L) + '-intercept ' + t(ptT([0, H])) + ', ' + t('t') + '-intercept ' + t(ptT([T, 0])),
      '<b>' + t(L) + '-intercept</b>: at the start, ' + t('t=0') + ' and the amount is ' + t(H) + ': ' + t(ptT([0, H])) + '.<br><b>' + t('t') + '-intercept</b>: the amount reaches ' + t('0') + ' when all ' + t(H) + ' ' + c.u + ' are gone, ' + t(k) + ' each ' + (c.tu === 'minutes' ? 'minute' : 'hour') + ': ' + t(H + '\\div ' + k + '=' + T) + ' ' + c.tu + '. Point ' + t(ptT([T, 0])) + ' — after ' + T + ' ' + c.tu + ', ' + c.zero + '.',
      ['The vertical intercept is the value at the start (' + t('t=0') + ').', 'The ' + t('t') + '-intercept is the time when the amount is ' + t('0') + ': how many groups of ' + t(k) + ' make ' + t(H) + '?'], 'intercepts from a story');
    p0.bad = [[ptKey([H, 0]), ptKey([T, 0])], [ptKey([0, H]), ptKey([H, 0])], [ptKey([T, 0]), ptKey([0, H])]];
    return p0;
  }
  HW.defineExit({ lesson: 'u5l4', calc: true, outcome: 'RF5',
    blurb: 'An x-intercept from a graph, a y-intercept from a table, what a t-intercept means, and both intercepts from a story.',
    questions: [Q(1, 'RF5', 'BEG', 'From a graph.', l4q1), Q(2, 'RF5', 'BEG', 'From a table.', l4q2), Q(3, 'RF5', 'PRG', 'What it means.', l4q3), Q(4, 'RF5', 'MAS', 'From a story.', l4q4)] });

  /* =====================================================================================================
   * Lesson 5 — Domain and range, Part 1: reading from a graph (RF2)
   * ===================================================================================================== */
  function l5q1(r) { // Ryan: (−4, 1) (−1, 4) (2, −3) (4, 0) → y from −3 to 4 (MC → two boxes)
    var s = pickWhere(function () {
      var xs = r.sample(range(-5, 5), 4).sort(function (a, b) { return a - b; }), hi = r.int(2, 5), lo = r.int(-5, -2), e1 = r.int(lo + 1, hi - 1), e2 = r.int(lo + 1, hi - 1), pf = r.chance(0.5);
      return { xs: xs, hi: hi, lo: lo, ys: pf ? [e1, hi, lo, e2] : [e1, lo, hi, e2] };
    }, function (s) { var x = s.xs; return x[1] - x[0] >= 2 && x[2] - x[1] >= 2 && x[3] - x[2] >= 2 && s.ys[0] !== s.ys[3] && !(x[0] === s.lo && x[3] === s.hi); });
    var V = s.xs.map(function (x, i) { return [x, s.ys[i]]; }), lo = s.lo, hi = s.hi, eL = Math.min(s.ys[0], s.ys[3]), eH = Math.max(s.ys[0], s.ys[3]), x0 = s.xs[0], x3 = s.xs[3];
    var c1 = numChk(lo, [[x0, 'u5x-dr-swap', t(x0) + ' is how far the graph reaches to the left: that is the domain. The range is read bottom to top.'], [eL, 'u5x-dr-ends', 'The lowest point is not at an end here. Scan the whole graph: it dips to ' + t('y=' + lo) + '.']]);
    var c2 = numChk(hi, [[x3, 'u5x-dr-swap', t(x3) + ' is how far the graph reaches to the right: that is the domain. The range is read bottom to top.'], [eH, 'u5x-dr-ends', 'The highest point is not at an end here. Scan the whole graph: it rises to ' + t('y=' + hi) + '.']]);
    var p0 = B.fields('Each grid square is 1 unit. The graph is continuous and stops at the two dots. State its <b>range</b>.' + G({ segs: [{ pts: V, start: 'closed', end: 'closed' }], aria: 'a continuous graph with two end dots' }),
      [{ label: t('y') + ' can be any value from', name: 'lowest value', mode: 'number' }, { label: 'to', name: 'highest value', mode: 'number' }], [c1, c2], [String(lo), String(hi)],
      t('y') + ' can be any value from ' + t(lo) + ' to ' + t(hi),
      'Bottom to top: the lowest point of the whole graph is ' + t(ptT(V[s.ys.indexOf(lo)])) + ' and the highest is ' + t(ptT(V[s.ys.indexOf(hi)])) + ' (neither is an end dot). The graph is continuous, so the range is every ' + t('y') + '-value from ' + t(lo) + ' to ' + t(hi) + '.',
      ['The range is read <b>bottom to top</b>: find the lowest and the highest point of the <b>whole</b> graph, not just its ends.', 'Shine a light from the side: the shadow on the ' + t('y') + '-axis is the range.'], 'range of a continuous graph');
    var base = p0.check;
    p0.check = function (resp) { resp = resp || []; var a = HW.parse.number(resp[0]), b = HW.parse.number(resp[1]); if (a.ok && b.ok && same(a.value, hi) && same(b.value, lo)) return form('u5x-dr-order', 'Right values — write the <b>lowest</b> value first: from ' + t(lo) + ' to ' + t(hi) + '.'); return base(resp); };
    p0.bad = [[String(x0), String(x3)], [String(eL), String(eH)]];
    return p0;
  }
  function l5q2(r) { // Ryan: dots at x = −3, −2, 2, 4 (MC → typed list)
    var s = pickWhere(function () { var xs = r.sample(range(-5, 5), 4).sort(function (a, b) { return a - b; }); return { xs: xs, ys: xs.map(function () { return r.int(-5, 5); }) }; },
      function (s) { return !setSame(s.xs, s.ys) && uniq(s.ys).length >= 3 && s.xs[3] - s.xs[0] >= 5; });
    var pts = s.xs.map(function (x, i) { return [x, s.ys[i]]; });
    return listPart('Each grid square is 1 unit. The graph is made of 4 separate dots. State its <b>domain</b>.' + G({ points: pts.map(function (p) { return { x: p[0], y: p[1] }; }), aria: 'four separate dots' }), s.xs, {
      before: t('x') + ' can be:', dl: [[s.ys, 'u5x-dr-swap', 'Those are the ' + t('y') + '-values of the dots, which give the range. The domain uses the <b>' + t('x') + '</b>-values.'],
        [[s.xs[0], s.xs[3]], 'u5x-dr-ends-list', 'Only the dots belong to this relation, and each dot has its own ' + t('x') + '-value. List all four.']] },
      'The graph is discrete (separate dots), so list the ' + t('x') + '-value of each dot: ' + pts.map(function (p) { return t(ptT(p)); }).join(', ') + ' give ' + t('x') + ' = ' + t(s.xs.join(',\\ ')) + '.',
      ['The domain is the ' + t('x') + '-values (left to right). For separate dots, list them.', 'Read each dot’s ' + t('x') + '-coordinate. Separate the values with commas.'], 'domain of a discrete graph');
  }
  var FLY = [{ what: 'A toy rocket is launched from the ground.', thing: 'its height, ' + t('h') + ' (m)', lands: 'lands' }, { what: 'A soccer ball is kicked up from the ground.', thing: 'its height, ' + t('h') + ' (m)', lands: 'lands' },
    { what: 'A water balloon is launched from the ground.', thing: 'its height, ' + t('h') + ' (m)', lands: 'lands' }, { what: 'A football is punted from the ground.', thing: 'its height, ' + t('h') + ' (m)', lands: 'lands' }];
  function l5q3(r) { // Ryan: rocket lands at t = 8 (peak 25 m) · ball lands at t = 6
    var c = r.pick(FLY), T = r.pick([4, 6, 8, 10]), Hh = r.pick([16, 20, 24, 25, 30, 35, 40]), xm = T + 1, ym = Hh + 5;
    var g = HW.graph({ x: [0, xm], y: [0, ym], grid: 1, gridY: 5, labels: 1, labelsX: T > 8 ? 2 : 1, labelsY: ym > 30 ? 10 : 5, unitX: 230 / xm, unitY: 170 / ym, firstQuadrant: true, xName: 't', yName: 'h', xTitle: 't (s)', yTitle: 'h (m)',
      fns: [{ f: function (x) { return 4 * Hh * x * (T - x) / (T * T); }, from: 0, to: T, start: 'closed', end: 'closed' }], max: 320, aria: 'height against time for a flight' });
    return numPart(c.what + ' The graph shows ' + c.thing + ', after ' + t('t') + ' seconds.' + g + 'The domain is ' + t('t') + ' from ' + t('0') + ' to how many seconds?', T, [
      [T / 2, 'u5x-dr-peak-time', 'The domain covers the whole flight, left to right. The object keeps flying after its highest point and ' + c.lands + ' at ' + t('t=' + T) + ' s.'],
      [Hh, 'u5x-dr-height', t(Hh) + ' m is the greatest height — a ' + t('y') + '-value, part of the range. The domain is the time values.']],
      'The graph starts at ' + t('t=0') + ' (launch) and ends when it ' + c.lands + ' at ' + t('t=' + T) + '. Domain: ' + t('t') + ' from ' + t('0') + ' to ' + t(T) + ' seconds.',
      ['The domain is read left to right, along the time axis.', 'Where does the graph end? (Don’t stop at the highest point.)'], 'domain of a flight', { before: t('t') + ' from 0 to', after: 's' });
  }
  function l5q4(r) { // added Mastery: sketch a continuous graph for a given domain and range
    var s = pickWhere(function () { return { a: r.int(-5, -1), b: r.int(1, 5), c: r.int(-5, -1), d: r.int(1, 5), up: r.chance(0.5) }; }, function (s) { return s.b - s.a >= 3 && s.d - s.c >= 3 && !(s.a === s.c && s.b === s.d); });
    var a = s.a, b = s.b, c = s.c, d = s.d, Dt = ineq('x', a, b), Rt = ineq('y', c, d);
    var key = gv([], [s.up ? segv([a, c], [b, d]) : segv([a, d], [b, c])]);
    var bads = [gv([], [segv([c, a], [d, b])]), gv([[a, c], [b, d]]), gv([], [segv([a, c], [b, d - 1])]), gv([], [segv([a, c], [b, d], 'open', 'closed')])];
    return sketchPart('Sketch a <b>continuous</b> graph whose domain is ' + t('x') + ' from ' + t(a) + ' to ' + t(b) + ' and whose range is ' + t('y') + ' from ' + t(c) + ' to ' + t(d) + '.', { x: [-6, 6], y: [-6, 6], labels: 1, max: 300 }, { domain: Dt, range: Rt }, key, bads,
      'The graph must reach from ' + t('x=' + a) + ' to ' + t('x=' + b) + ' (left to right) and from ' + t('y=' + c) + ' to ' + t('y=' + d) + ' (bottom to top), with no gaps. One answer: the segment from ' + t(ptT(key.pieces[0].v[0])) + ' to ' + t(ptT(key.pieces[0].v[1])) + ' with solid end dots. (A zig-zag or a curve that stays inside those limits and touches them works too.)',
      ['The domain sets how far left and right the graph goes; the range sets how low and high.', 'A single straight segment from a lowest-left corner to a highest-right corner works.'], 'sketch for a domain and range');
  }
  HW.defineExit({ lesson: 'u5l5', calc: true, outcome: 'RF2',
    blurb: 'The domain of separate dots, the range of a continuous graph, the domain of a flight, and a sketch for a given domain and range.',
    questions: [Q(1, 'RF2', 'PRG', 'Range from a graph.', l5q1), Q(2, 'RF2', 'BEG', 'Domain of separate dots.', l5q2), Q(3, 'RF2', 'PRG', 'A flight.', l5q3), Q(4, 'RF2', 'MAS', 'Sketch it.', l5q4)] });

  /* =====================================================================================================
   * Lesson 6 — Domain and range, Part 2: pairs, tables, set notation (RF2)
   * ===================================================================================================== */
  function l6q1(r) { // Ryan: (−2, 6) (1, 3) (4, 6) (5, 0) → R = {0, 3, 6} · {−1, 2, 5}
    var s = pickWhere(function () { var xs = r.sample(nz(-5, 6), 4).sort(function (a, b) { return a - b; }), ys = r.sample(range(-3, 9), 3); ys.push(ys[r.int(0, 2)]); return { xs: xs, ys: r.shuffle(ys) }; },
      function (s) { return !setSame(s.xs, s.ys) && s.ys[0] !== s.ys[1] && s.ys[2] !== s.ys[3] || false; });
    var pts = s.xs.map(function (x, i) { return [x, s.ys[i]]; }), R = lstPlain(s.ys);
    return setPart15('Write the <b>range</b> of this relation in set notation (use the ' + t('\\{\\ \\}') + ' keys):<br>' + t(pts.map(ptT).join(',\\ ')), R, {
      v: 'y', other: lstPlain(s.xs), otherName: 'domain', ansPre: t('R=') + ' ', bad: ['\\{' + s.ys.join(', ') + '\\}', uniq(s.ys).join(', ')] },
      'The range is the ' + t('y') + '-values, the second number in each pair: ' + t(s.ys.join(',\\ ')) + '. Write each one once: ' + t('R=' + lst(s.ys)) + '.',
      ['The range is the set of outputs: the <b>second</b> number in each pair.', 'In a set, each value is written once, inside braces.'], 'range of ordered pairs');
  }
  function l6q2(r) { // Ryan: dots at x = −4, −2, 0, 3, 5 → D = {−4, −2, 0, 3, 5}
    var s = pickWhere(function () { var xs = r.sample(nz(-5, 5), 4).concat([0]).sort(function (a, b) { return a - b; }); return { xs: xs, ys: xs.map(function () { return r.int(-4, 4); }) }; },
      function (s) { return s.xs[0] < 0 && s.xs[4] > 0 && !setSame(s.xs, s.ys) && s.ys[s.xs.indexOf(0)] !== 0 && uniq(s.ys).length >= 3; });
    var pts = s.xs.map(function (x, i) { return [x, s.ys[i]]; });
    return setPart15('Each grid square is 1 unit. Write the <b>domain</b> of this relation in set notation.' + G({ points: pts.map(function (p) { return { x: p[0], y: p[1] }; }), aria: 'five separate dots' }), lstPlain(s.xs), {
      v: 'x', other: lstPlain(s.ys), otherName: 'range', ansPre: t('D=') + ' ',
      wrong: [{ is: lstPlain([s.xs[0], s.xs[4]]), code: 'u5x-dr-ends-list', hint: 'Every dot has its own ' + t('x') + '-value, and all of them belong in the domain — not just the leftmost and rightmost.' },
        { is: lstPlain(s.xs.filter(function (x) { return x !== 0; })), code: 'u5x-dr-zero', hint: 'The dot on the ' + t('y') + '-axis has ' + t('x=0') + ', and ' + t('0') + ' counts.' }] },
      'The dots are ' + pts.map(function (p) { return t(ptT(p)); }).join(', ') + '. Their ' + t('x') + '-values give ' + t('D=' + lst(s.xs)) + '.',
      ['The domain is the ' + t('x') + '-values: read each dot left to right.', 'A dot on the ' + t('y') + '-axis has ' + t('x=0') + '.'], 'domain of dots in set notation');
  }
  function l6q3(r) { // Ryan (Mastery MC → typed): ray from (0, 2) up to the right · from (0, −1) down to the right
    var s = pickWhere(function () { return { a: r.int(-3, 2), b: r.int(-3, 3), dx: r.pick([1, -1]), dy: r.pick([1, -1]), m: r.pick([1, 2, 0.5]) }; }, function (s) { return s.a !== s.b || s.a !== 0; });
    var a = s.a, b = s.b, end = toEdge([a, b], [s.dx, s.dy * s.m]);
    var D = s.dx > 0 ? ineq('x', a, null) : ineq('x', null, a), R = s.dy > 0 ? ineq('y', b, null) : ineq('y', null, b);
    var g = G({ segs: [{ pts: [[a, b], end], start: 'closed', end: 'arrow' }], aria: 'a ray with a solid starting dot and an arrow' });
    return drPart15('A ray starts at the solid dot ' + t(ptT([a, b])) + ' and goes on forever in the direction of the arrow.' + g + 'Write its domain and range using inequalities.', D, R, {
      dW: [{ is: s.dx > 0 ? ineq('x', null, a) : ineq('x', a, null), code: 'u5x-ray-dir', hint: 'The ray goes to the <b>' + (s.dx > 0 ? 'right' : 'left') + '</b> from ' + t('x=' + a) + ', so the ' + t('x') + '-values are ' + t(a) + ' or ' + (s.dx > 0 ? 'greater' : 'less') + '.' }, { is: lstPlain([a]), code: 'u5x-ray-start', hint: 'The ray keeps going, so ' + t('x') + ' takes every value from ' + t(a) + ' onward, not just ' + t(a) + '. Use an inequality.' }],
      rW: [{ is: s.dy > 0 ? ineq('y', null, b) : ineq('y', b, null), code: 'u5x-ray-dir', hint: 'The ray goes <b>' + (s.dy > 0 ? 'up' : 'down') + '</b> from ' + t('y=' + b) + ', so the ' + t('y') + '-values are ' + t(b) + ' or ' + (s.dy > 0 ? 'greater' : 'less') + '.' }, { is: lstPlain([b]), code: 'u5x-ray-start', hint: 'The ray keeps ' + (s.dy > 0 ? 'rising' : 'falling') + ', so ' + t('y') + ' takes every value from ' + t(b) + ' onward, not just ' + t(b) + '. Use an inequality.' }] },
      'The ray starts at ' + t(ptT([a, b])) + ' (solid: included) and goes ' + (s.dy > 0 ? 'up' : 'down') + ' to the ' + (s.dx > 0 ? 'right' : 'left') + ' forever. A list can never finish, so use inequalities:<br>Domain ' + t(D) + '; range ' + t(R) + '.',
      [HINT_D, 'The arrow means no end on that side. Which way does the ray go from its starting dot: right or left? up or down?'], 'domain and range of a ray');
  }
  HW.defineExit({ lesson: 'u5l6', calc: true, outcome: 'RF2',
    blurb: 'The range of ordered pairs and the domain of a dot graph in set notation, and the domain and range of a ray as inequalities.',
    questions: [Q(1, 'RF2', 'BEG', 'Range of ordered pairs.', l6q1), Q(2, 'RF2', 'PRG', 'Domain of a graph.', l6q2), Q(3, 'RF2', 'MAS', 'A ray.', l6q3)] });

  /* =====================================================================================================
   * Lesson 7 — Using technology to graph (RF5, RF2)
   * ===================================================================================================== */
  function fmtW(x) { return x < 0 ? '−' + (-x) : String(x); }
  function calcScreen(m, b, W) {
    W = W || { x: [-10, 10], y: [-10, 10] };
    var x0 = W.x[0], x1 = W.x[1], y0 = W.y[0], y1 = W.y[1], X = function (x) { return 20 + (x - x0) / (x1 - x0) * 200; }, Y = function (y) { return 8 + (y1 - y) / (y1 - y0) * 160; };
    var s = '<rect x="14" y="2" width="212" height="172" rx="8" fill="#2b3446"/><rect x="20" y="8" width="200" height="160" fill="#f4f7ee"/>';
    if (y0 < 0 && y1 > 0) { s += '<line x1="20" y1="' + Y(0) + '" x2="220" y2="' + Y(0) + '" stroke="#333" stroke-width="1"/>'; for (var i = Math.ceil(x0); i <= x1; i++) s += '<line x1="' + X(i).toFixed(1) + '" y1="' + (Y(0) - 2.5) + '" x2="' + X(i).toFixed(1) + '" y2="' + (Y(0) + 2.5) + '" stroke="#333" stroke-width="1"/>'; }
    if (x0 < 0 && x1 > 0) { s += '<line x1="' + X(0) + '" y1="8" x2="' + X(0) + '" y2="168" stroke="#333" stroke-width="1"/>'; for (var j = Math.ceil(y0); j <= y1; j++) s += '<line x1="' + (X(0) - 2.5) + '" y1="' + Y(j).toFixed(1) + '" x2="' + (X(0) + 2.5) + '" y2="' + Y(j).toFixed(1) + '" stroke="#333" stroke-width="1"/>'; }
    var lo = x0, hi = x1; if (m !== 0) { var ua = (y0 - b) / m, ub = (y1 - b) / m; lo = Math.max(x0, Math.min(ua, ub)); hi = Math.min(x1, Math.max(ua, ub)); }
    if (hi > lo) s += '<line x1="' + X(lo).toFixed(1) + '" y1="' + Y(m * lo + b).toFixed(1) + '" x2="' + X(hi).toFixed(1) + '" y2="' + Y(m * hi + b).toFixed(1) + '" stroke="' + BLUE + '" stroke-width="2.5"/>';
    s += '<text x="120" y="190" font-size="12" text-anchor="middle" fill="' + INK + '">Window: x: [' + fmtW(x0) + ', ' + fmtW(x1) + '], y: [' + fmtW(y0) + ', ' + fmtW(y1) + ']</text>';
    return '<div class="fig"><svg class="fig-svg" viewBox="0 0 240 198" style="max-width:260px" role="img" aria-label="graphing calculator screen">' + s + '</svg></div>';
  }
  function l7q1(r) { // Ryan: y = 5x − 40, intercepts (8, 0), (0, −40) · y = 6x + 30 (MC → type a window)
    var s = pickWhere(function () { var m = r.pick([2, 3, 4, 5, 6, 8, -2, -3, -4, -5, -6]), x0 = r.pick(nz(-9, 9)); return { m: m, x0: x0, b: -m * x0, who: r.pick(NAMES) }; }, function (s) { return Math.abs(s.b) >= 12 && Math.abs(s.b) <= 64 && Math.abs(s.x0) >= 2; });
    var m = s.m, x0 = s.x0, b = s.b, eq = 'y=' + lin([[m, 'x'], [b, '']]);
    var key = b < 0 ? [-10, 10, b - 5, 10] : [-10, 10, -10, b + 5];
    var check = function (resp) {
      resp = resp || []; var v = [0, 1, 2, 3].map(function (i) { var q = HW.parse.number(resp[i]); return q.ok ? q.value : NaN; });
      if (v.some(function (x) { return !isFinite(x); })) return form('empty', 'Type a number in all four boxes.');
      var Xn = v[0], Xx = v[1], Yn = v[2], Yx = v[3];
      if (Xn >= Xx || Yn >= Yx) return form('u5x-win-minmax', 'Each minimum must be <b>less</b> than its maximum (Xmin < Xmax, Ymin < Ymax).');
      var inX = function (lo, hi, a) { return lo < Math.min(a, 0) && hi > Math.max(a, 0); }, onX = function (lo, hi, a) { return lo <= Math.min(a, 0) && hi >= Math.max(a, 0); };
      if (inX(Xn, Xx, x0) && inX(Yn, Yx, b)) return ok();
      if (onX(Xn, Xx, x0) && onX(Yn, Yx, b)) return form('u5x-win-edge', 'Almost — an intercept sits exactly on the edge of your screen, where it is hard to see. Go a little past each intercept.');
      if (Xn === -10 && Xx === 10 && Yn === -10 && Yx === 10) return wrong('u5x-win-std', 'That is the standard window: ' + t('y') + ' only goes to ' + t(b < 0 ? '-10' : '10') + ', so the ' + t('y') + '-intercept ' + t(ptT([0, b])) + ' is off the screen. ' + (b < 0 ? 'Ymin' : 'Ymax') + ' must go past ' + t(b) + '.');
      if (inX(Yn, Yx, x0) && inX(Xn, Xx, b) && !inX(Yn, Yx, b)) return wrong('u5x-win-swap', 'You swapped the settings: the ' + t('x') + '-values need to reach ' + t(x0) + ' and the ' + t('y') + '-values need to reach ' + t(b) + '. Put ' + t(b) + ' in the <b>' + t('y') + '</b> settings.');
      if (inX(Xn, Xx, x0) && inX(Yn, Yx, -b)) return wrong('u5x-win-sign', 'The ' + t('y') + '-intercept ' + t(ptT([0, b])) + ' is ' + (b < 0 ? '<b>below</b> the ' + t('x') + '-axis, so Ymin must be below ' + t(b) : '<b>above</b> the ' + t('x') + '-axis, so Ymax must be above ' + t(b)) + '.');
      if (!inX(Xn, Xx, x0)) return wrong('u5x-win-x', 'Your ' + t('x') + '-settings must include ' + t(x0) + ' (the ' + t('x') + '-intercept) and ' + t('0') + ' (where the ' + t('y') + '-intercept is): Xmin below the smaller one, Xmax above the bigger one.');
      return wrong('u5x-win-y', 'Your ' + t('y') + '-settings must include ' + t(b) + ' (the ' + t('y') + '-intercept) and ' + t('0') + ' (where the ' + t('x') + '-intercept is): Ymin below the smaller one, Ymax above the bigger one.');
    };
    var fl = ['Xmin', 'Xmax', 'Ymin', 'Ymax'].map(function (n) { return { label: n + ':', name: n, mode: 'number' }; });
    var p0 = B.fields(s.who + ' graphs ' + t(eq) + ' in the standard window. Its intercepts are ' + t(ptT([x0, 0])) + ' and ' + nw(t(ptT([0, b])) + '.') + calcScreen(m, b) + 'Type a window that shows <b>both</b> intercepts.', fl, [], key.map(String),
      'For example ' + t('x:\\ [' + key[0] + ',\\ ' + key[1] + ']') + ', ' + t('y:\\ [' + key[2] + ',\\ ' + key[3] + ']') + ' (many windows work)',
      'The window must go a little past each intercept. The ' + t('x') + '-intercept ' + t(x0) + ' is already inside ' + t('[-10,\\ 10]') + '. The ' + t('y') + '-intercept ' + t(b) + ' is not, so ' + (b < 0 ? 'Ymin must be below ' + t(b) + ', for example ' + t(b - 5) : 'Ymax must be above ' + t(b) + ', for example ' + t(b + 5)) + '.<br>One window: ' + t('x:\\ [' + key[0] + ',\\ ' + key[1] + ']') + ', ' + t('y:\\ [' + key[2] + ',\\ ' + key[3] + ']') + '.',
      ['Which intercept is off the screen? Which setting (Xmin, Xmax, Ymin or Ymax) has to change to reach it?', 'Go a little past each intercept, so both are clearly on the screen.'], 'choose a viewing window');
    p0.check = check;
    p0.bad = [['-10', '10', '-10', '10'], [String(Math.min(b, 0) - 5), String(Math.max(b, 0) + 5), String(Math.min(x0, 0) - 2), String(Math.max(x0, 0) + 2)], ['-10', '10', String(Math.min(-b, 0) - 5), String(Math.max(-b, 0) + 5)]];
    return p0;
  }
  function l7q2(r) { // Ryan: y = 4x − 12 → 3 · y = 3x − 18 → 6
    var m = r.int(2, 6), x0 = r.pick(range(2, 9).concat([-2, -3, -4, -5])), b = -m * x0, eq = 'y=' + lin([[m, 'x'], [b, '']]);
    return numPart('A calculator graphs ' + t(eq) + '. The <b>zero</b> feature finds the ' + t('x') + '-intercept. What ' + t('x') + '-value will it show?', x0, [
      [b, 'u5x-zero-yint', t(b) + ' is the ' + t('y') + '-value when ' + t('x=0') + ' (the ' + t('y') + '-intercept). The zero is where ' + t('y=0') + '.'],
      [-x0, 'u5x-zero-sign', 'Set ' + t('y=0') + ': ' + t(lin([[m, 'x'], [b, '']]) + '=0') + '. ' + (b < 0 ? 'Add ' + t(-b) : 'Subtract ' + t(b)) + ' on both sides: ' + t(m + 'x=' + (-b)) + '.'],
      [-b, 'u5x-zero-nodiv', 'You are nearly there: ' + t(m + 'x=' + (-b)) + ' still needs dividing by ' + t(m) + '.']],
      'The zero is where ' + t('y=0') + ': ' + t(lin([[m, 'x'], [b, '']]) + '=0') + ', so ' + t(m + 'x=' + (-b)) + ' and ' + t('x=' + x0) + '. The ' + t('x') + '-intercept is ' + t(ptT([x0, 0])) + '.',
      ['The zero (the ' + t('x') + '-intercept) is where ' + t('y=0') + '. Substitute ' + t('y=0') + '.', 'Solve: move the constant to the other side, then divide by ' + t(m) + '.'], 'zero of a line', { before: t('x=') });
  }
  function l7q3(r) { // Ryan: y = −3x + 6 · y = 2x − 4 (MC → typed)
    var s = pickWhere(function () { return { m: r.pick([2, 3, 4, -2, -3, -4]), b: r.pick(nz(-6, 6)) }; }, function (s) { return true; });
    var m = s.m, b = s.b, eq = 'y=' + lin([[m, 'x'], [b, '']]), xi = -b / m;
    var dW = [{ is: '-10\\le x\\le 10', code: 'u5x-dr-window', hint: 'The window is only a picture frame. The line keeps going past every edge of the screen, so it uses <b>every</b> ' + t('x') + '-value.' }, { is: 'x\\ge 0', code: 'u5x-dr-part', hint: 'The line also goes into negative ' + t('x') + '-values, off the edge of the screen. A line never stops.' }];
    var rW = [{ is: '-10\\le y\\le 10', code: 'u5x-dr-window', hint: 'The window is only a picture frame. The line keeps going past the top and bottom of the screen, so it uses <b>every</b> ' + t('y') + '-value.' }, { is: 'y\\ge 0', code: 'u5x-dr-part', hint: 'The line also goes below the ' + t('x') + '-axis. A slanted line uses every ' + t('y') + '-value.' }, { is: lstPlain([b]), code: 'u5x-dr-int', hint: t(b) + ' is the ' + t('y') + '-intercept. The range is <b>all</b> the ' + t('y') + '-values the line uses.' }];
    if (xi % 1 === 0) dW.push({ is: lstPlain([xi]), code: 'u5x-dr-int', hint: t(xi) + ' is the ' + t('x') + '-intercept. The domain is <b>all</b> the ' + t('x') + '-values the line uses.' });
    return drPart15('The screen shows ' + t(eq) + '. The line runs off the top and bottom of the screen.' + calcScreen(m, b) + 'State the domain and range of the relation.', ALL, ALL, { dW: dW, rW: rW, phD: 'e.g. all real numbers, or x >= 2', phR: 'e.g. all real numbers, or y >= 2' },
      'A straight, slanted line never stops: it keeps going past every edge of the screen. So it uses every ' + t('x') + '-value and every ' + t('y') + '-value.<br>Domain: all real numbers. Range: all real numbers.',
      ['The window is only the part you can see. Does the line ever stop?', 'Type <b>all real numbers</b> (or use ' + t('x\\in\\mathbb{R}') + ').'], 'domain and range of a line on a screen');
  }
  var RENT = [{ who: 'Kai rents a canoe.', what: 'The cost, ' + t('C') + ' dollars, to rent it for ' + t('h') + ' hours is', v: 'h', note: 'A canoe can be rented for any part of an hour.' },
    { who: 'Lena takes a taxi.', what: 'The fare, ' + t('C') + ' dollars, for a ride of ' + t('h') + ' kilometres is', v: 'h', note: 'A ride can be any distance.' },
    { who: 'Raj rents an e-scooter.', what: 'The cost, ' + t('C') + ' dollars, to ride it for ' + t('h') + ' hours is', v: 'h', note: 'It can be ridden for any part of an hour.' }];
  function l7q4(r) { // added Mastery: domain and range in context (Lesson 7 Q9 canoe, C = 12 + 3h)
    var c = r.pick(RENT), Fe = r.pick([4, 5, 8, 10, 12, 15]), k = r.pick([2, 3, 4, 5, 6]), v = c.v;
    var D = ineq(v, 0, null), R = ineq('C', Fe, null);
    return drPart15(c.who + ' ' + c.what + ' ' + t('C=' + Fe + '+' + k + v) + '. ' + c.note + ' On a calculator the graph looks like a line. State the domain and range of the relation <b>in this situation</b>.', D, R, {
      dv: v, rv: 'C', dW: [{ is: ALL, code: 'u5x-ctx-allreal', hint: 'On the calculator the line goes on forever, but here ' + t(v) + ' can’t be negative.' }],
      rW: [{ is: ALL, code: 'u5x-ctx-allreal', hint: 'The cost can’t be any number: it is never less than the starting fee.' }, { is: ineq('C', 0, null), code: 'u5x-ctx-start0', hint: 'At ' + t(v + '=0') + ' the cost is already ' + t('\\$' + Fe) + ' (the flat fee), so the lowest cost is ' + t(Fe) + '.' }, { is: ineq('C', k, null), code: 'u5x-ctx-rate', hint: t(k) + ' is the rate. The lowest cost happens at ' + t(v + '=0') + ': ' + t('C=' + Fe + '+' + k + '(0)=' + Fe) + '.' }],
      phD: 'e.g. ' + v + ' >= 0', phR: 'e.g. C >= 5' },
      'In this situation ' + t(v) + ' can be ' + t('0') + ' or any positive number (any part counts), but not negative: ' + t(D) + '.<br>At ' + t(v + '=0') + ', ' + t('C=' + Fe + '+' + k + '(0)=' + Fe) + ', and the cost goes up from there: ' + t(R) + '.',
      ['Can ' + t(v) + ' be negative in this situation? What is the smallest value it can have?', 'Find ' + t('C') + ' at that smallest ' + t(v) + '. Does the cost have a largest value?'], 'domain and range in context');
  }
  HW.defineExit({ lesson: 'u5l7', calc: true, outcome: 'RF5',
    blurb: 'The zero of a line, a viewing window that shows both intercepts, the domain and range of a line on a screen, and domain and range in context.',
    questions: [Q(1, 'RF5', 'PRG', 'Choosing a window.', l7q1), Q(2, 'RF5', 'BEG', 'The zero feature.', l7q2), Q(3, 'RF2', 'PRG', 'Domain and range on a screen.', l7q3), Q(4, 'RF2', 'MAS', 'In context.', l7q4)] });

  /* =====================================================================================================
   * Lesson 8 — Functions: the vertical line test (RF2)
   * ===================================================================================================== */
  var SMALL = { x: [-5, 5], y: [-5, 5], labels: 0, max: 165, grid: 1 };
  function smallG(spec, aria) { return HW.graph(Object.assign({}, SMALL, spec, { aria: aria })); }
  function circlePts(h, k, rr) { var o = []; for (var i = 0; i <= 64; i++) { var th = 2 * Math.PI * i / 64; o.push([cl(h + rr * Math.cos(th)), cl(k + rr * Math.sin(th))]); } return o; }
  function parab(h, k, a, w) { w = w || 4.6; var lim = a > 0 ? w : -w, dx = Math.sqrt((lim - k) / a); return { f: function (x) { return k + a * (x - h) * (x - h); }, from: Math.max(-w, h - dx), to: Math.min(w, h + dx), start: 'arrow', end: 'arrow' }; }
  var FN_GRAPHS = [
    { fn: true, make: function (r) { var m = r.pick([1, 2, -1, -2, 0.5]), b = r.int(-2, 2); return { spec: { segs: [lineSeg(m, b, 4.6)] }, name: 'a slanted line', why: 'every vertical line crosses a slanted line exactly once' }; } },
    { fn: true, make: function (r) { var k = r.int(-1, 1), a = r.pick([1, -1]); return { spec: { fns: [{ f: function (x) { return k + a * (0.1 * x * x * x - x); }, from: -4.4, to: 4.4, start: 'arrow', end: 'arrow' }] }, name: 'a wavy curve', why: 'every vertical line crosses it exactly once' }; } },
    { fn: true, make: function (r) { var h = r.int(-1, 1), k = r.int(-3, 0); return { spec: { fns: [parab(h, k, 1)] }, name: 'a U-shaped curve', why: 'every vertical line crosses it at most once' }; } },
    { fn: true, make: function (r) { var c = r.pick([-3, -2, 2, 3]); return { spec: { segs: [{ pts: [[-4.6, c], [4.6, c]], start: 'arrow', end: 'arrow' }] }, name: 'a horizontal line', why: 'a horizontal line has one ' + t('y') + '-value for every ' + t('x') }; } },
    { fn: false, make: function (r) { var c = r.pick([-3, -2, -1, 1, 2, 3]); return { spec: { segs: [{ pts: [[c, -4.6], [c, 4.6]], start: 'arrow', end: 'arrow' }] }, name: 'a vertical line', why: 'a vertical line pairs one ' + t('x') + '-value with every ' + t('y') + '-value' }; } },
    { fn: false, make: function (r) { var h = r.int(-1, 1), k = r.int(-1, 1), rr = r.pick([2, 3]); return { spec: { segs: [{ pts: circlePts(h, k, rr), start: 'none', end: 'none' }] }, name: 'a circle', why: 'a vertical line through the middle crosses it twice (top and bottom)' }; } },
    { fn: false, make: function (r) { var k = r.int(-1, 1); return { spec: { segs: [{ pts: range(-20, 20).map(function (i) { var y = k + i * 0.2; return [cl(-3 + 0.45 * (y - k) * (y - k)), cl(y)]; }).filter(function (p) { return p[0] <= 4.6; }), start: 'arrow', end: 'arrow' }] }, name: 'a sideways U', why: 'a vertical line to the right of its tip crosses it twice' }; } }];
  function l8q1(r) { // Ryan: which graph is a function (circle, sideways curve, wave, vertical line) → each graph: function or not
    var picks = pickWhere(function () { return r.sample(FN_GRAPHS, 4); }, function (g) { return g.some(function (x) { return x.fn; }) && g.filter(function (x) { return !x.fn; }).length >= 2; });
    var gs = picks.map(function (g) { var o = g.make(r); o.fn = g.fn; return o; }), L = 'ABCD';
    var rows = gs.map(function (g, i) { return { id: L[i], html: 'Graph ' + L[i], label: 'Graph ' + L[i] }; }), want = {};
    gs.forEach(function (g, i) { want[L[i]] = g.fn ? 'F' : 'N'; });
    var p0 = B.grid('Use the vertical line test. Is each graph a function?' + flexFigs(gs.map(function (g, i) { return '<div style="text-align:center;font-weight:600">Graph ' + L[i] + '</div>' + smallG(g.spec, 'graph ' + L[i]); }), 120), rows, [{ id: 'F', html: 'Function' }, { id: 'N', html: 'Not a function' }], want,
      { why: function (id) { var g = gs[L.indexOf(id)]; return { code: 'u5x-fn-wrong', hint: 'Graph ' + id + ' is ' + g.name + ': ' + g.why + ', so it is ' + (g.fn ? '' : '<b>not</b> ') + 'a function.' }; }, rowHead: 'Graph' },
      gs.map(function (g, i) { return 'Graph ' + L[i] + ' (' + g.name + '): ' + g.why + ' → ' + (g.fn ? '<b>function</b>' : '<b>not a function</b>') + '.'; }).join('<br>'),
      ['Imagine a vertical line sliding across the graph from left to right.', 'If it ever crosses the graph more than once, one input has two outputs: not a function.'], 'vertical line test, 4 graphs');
    return p0;
  }
  function l8q2(r) { // Ryan: 1, 2, 3, 4 → 5, 7, 9 with 5 shared (function) · 6, 7, 8 → 1, 3, 5, 8 with 7 → two (not)
    var isFn = r.chance(0.5), d;
    if (isFn) {
      d = pickWhere(function () { var L = r.sample(range(1, 9), 4).sort(function (a, b) { return a - b; }), R = r.sample(range(1, 12), 3).sort(function (a, b) { return a - b; }), sh = r.int(0, 2), map = r.shuffle([0, 1, 2, sh]); return { L: L, R: R, pairs: L.map(function (x, i) { return [x, R[map[i]]]; }), sh: R[sh] }; }, function (d) { return true; });
    } else {
      d = pickWhere(function () { var L = r.sample(range(1, 9), 3).sort(function (a, b) { return a - b; }), R = r.sample(range(1, 12), 4).sort(function (a, b) { return a - b; }), two = r.int(0, 2), map = r.shuffle([0, 1, 2, 3]), pairs = []; var k = 0; L.forEach(function (x, i) { pairs.push([x, R[map[k++]]]); if (i === two) pairs.push([x, R[map[k++]]]); }); return { L: L, R: R, pairs: pairs, two: L[two] }; }, function (d) { return true; });
    }
    var dg = HW.arrowDiagram(d.L, d.R, d.pairs, { leftTitle: 'Input', rightTitle: 'Output' }), opts;
    if (isFn) opts = [{ html: 'Yes, each input has exactly one arrow leaving it', right: true },
      { html: 'No, two arrows point to the output ' + d.sh, why: 'Arrows pointing <b>into</b> an output don’t matter. Count the arrows <b>leaving</b> each input: each has exactly one, so it is a function.', code: 'shared' },
      { html: 'No, the outputs do not follow a pattern', why: 'A function does not need a pattern or rule. It only needs each input to have exactly one output.', code: 'pattern' },
      { html: 'No, there are more inputs than outputs', why: 'Outputs can be shared, so there can be fewer outputs. What matters is one arrow leaving each input — true here.', code: 'count' }];
    else opts = [{ html: 'No, the input ' + d.two + ' has two arrows leaving it', right: true },
      { html: 'Yes, every input has at least one arrow', why: 'A function needs <b>exactly</b> one arrow leaving each input. The input ' + d.two + ' has two.', code: 'atleast' },
      { html: 'Yes, no output is used twice', why: 'Shared outputs don’t matter either way. Look at the arrows leaving each input: ' + d.two + ' has two, so it is not a function.', code: 'outputs' },
      { html: 'No, there are more outputs than inputs', why: 'The number of outputs doesn’t decide it. It is not a function because the input ' + d.two + ' has two arrows leaving it.', code: 'count' }];
    return mc(r, 'Is the relation in this mapping diagram a function?<div class="fig">' + dg + '</div>', opts,
      isFn ? 'Each input (' + d.L.join(', ') + ') has exactly one arrow leaving it. Sharing the output ' + d.sh + ' is fine, so it <b>is</b> a function.' : 'The input ' + d.two + ' has two arrows leaving it (two outputs), so it is <b>not</b> a function.',
      ['A function: every input has <b>exactly one</b> arrow leaving it.', 'Arrows arriving at the same output are allowed.'], 'function from a mapping diagram');
  }
  function l8q3(r) { // Ryan: (2, 6) (3, 8) (2, 11) (4, 8) → 2 · (5, 2) (7, 3) (9, 2) (7, 6) → 7
    var s = pickWhere(function () { var xs = r.sample(range(1, 9), 3), ys = r.sample(range(0, 12), 3); return { xr: xs[0], xa: xs[1], xb: xs[2], y1: ys[0], y2: ys[1], y3: ys[2], ord: r.shuffle([0, 1, 2, 3]) }; },
      function (s) { return [s.y1, s.y2, s.y3].indexOf(s.xr) < 0 && s.ord.indexOf(0) !== s.ord.indexOf(2) - 1 && s.ord.indexOf(0) !== s.ord.indexOf(2) + 1; });
    var pts = [[s.xr, s.y1], [s.xa, s.y3], [s.xr, s.y2], [s.xb, s.y3]], shown = s.ord.map(function (i) { return pts[i]; });
    return numPart('This relation is <b>not</b> a function:<br>' + t(shown.map(ptT).join(',\\ ')) + '<br>Which ' + t('x') + '-value causes the problem?', s.xr, [
      [s.y3, 'u5x-fn-rep-y', 'A repeated ' + t('y') + '-value is fine. Look for an <b>' + t('x') + '</b>-value used twice with different ' + t('y') + '-values.'],
      [s.y1, 'u5x-fn-output', 'The problem is the <b>input</b>. ' + t('x=' + s.xr) + ' is paired with two different outputs, ' + t(s.y1) + ' and ' + t(s.y2) + '.'],
      [s.y2, 'u5x-fn-output', 'The problem is the <b>input</b>. ' + t('x=' + s.xr) + ' is paired with two different outputs, ' + t(s.y1) + ' and ' + t(s.y2) + '.']],
      t('x=' + s.xr) + ' appears twice, with different outputs ' + t(s.y1) + ' and ' + t(s.y2) + '. One input with two outputs means it is not a function. (The repeated ' + t(s.y3) + ' is fine.)',
      ['In a function, each input (' + t('x') + '-value) has exactly one output.', 'Look for the same ' + t('x') + ' in two pairs with different ' + t('y') + '-values.'], 'which input breaks the function', { before: t('x=') });
  }
  function l8q4(r) { // added Mastery: every k that makes the relation not a function
    var xy = pickWhere(function () { return { xs: r.sample(range(-4, 9).filter(function (x) { return x !== 0; }), 3), ys: r.sample(range(-3, 12), 4) }; }, function (q) { return !setSame(q.xs, q.ys.slice(0, 3)) && q.xs.indexOf(Math.max.apply(null, q.xs) + 1) < 0; }), xs = xy.xs, ys = xy.ys, g = ys[3], ord = xs.slice().sort(function (a, b) { return a - b; });
    var pts = xs.map(function (x, i) { return [x, ys[i]]; });
    var p0 = B.valueSet('The relation ' + t('\\{' + pts.map(ptT).join(',\\ ') + ',\\ (k,\\ ' + g + ')\\}') + ' is <b>not</b> a function. Determine every possible value of ' + t('k') + '.', xs, { v: 'k', diag: function (A, T) {
      if (setSame(A, ys.slice(0, 3))) return { code: 'u5x-k-y', hint: 'Those are outputs. ' + t('k') + ' is the <b>input</b> of the last pair: it must match an input that already has a different output.' };
      if (A.length < T.length && A.every(function (x) { return T.some(function (y) { return same(x, y); }); })) return { code: 'u5x-one-k', hint: 'That value works — but it isn’t the only one. Check every input already in the set.' };
      if (A.some(function (x) { return !T.some(function (y) { return same(x, y); }); }) && T.every(function (y) { return A.some(function (x) { return same(x, y); }); })) return { code: 'u5x-k-extra', hint: 'One of your values doesn’t match any input in the set: with it, every input would still have one output (a function).' };
      return null; } },
      'Not a function means some input has two different outputs. The last pair has output ' + t(g) + ', which is different from every other output, so ' + t('k') + ' can be <b>any</b> of the inputs already used: ' + t(ord.map(function (x) { return 'k=' + x; }).join(',\\ ')) + '.<br>(Any other value of ' + t('k') + ' gives four different inputs — a function.)',
      ['Not a function means one input has two outputs. Which inputs could ' + t('k') + ' copy?', 'Check each input already in the set: would ' + t('(k,\\ ' + g + ')') + ' give it a second output?'], 'k so that it is not a function');
    p0.bad = [ys.slice(0, 3).map(function (y) { return 'k=' + y; }).join(', '), 'k=' + xs[0], ord.map(function (x) { return 'k=' + x; }).join(', ') + ', k=' + (Math.max.apply(null, xs) + 1)];
    return p0;
  }
  HW.defineExit({ lesson: 'u5l8', calc: true, outcome: 'RF2',
    blurb: 'The vertical line test on four graphs, a mapping diagram, the input that breaks a function, and every value that makes a relation not a function.',
    questions: [Q(1, 'RF2', 'BEG', 'The vertical line test.', l8q1), Q(2, 'RF2', 'BEG', 'A mapping diagram.', l8q2), Q(3, 'RF2', 'PRG', 'Ordered pairs.', l8q3), Q(4, 'RF2', 'MAS', 'A missing input.', l8q4)] });

  /* =====================================================================================================
   * Lesson 9 — Function notation: evaluating and interpreting f(x) (RF8)
   * ===================================================================================================== */
  function l9q1(r) { // Ryan: f(x) = x² + 2x, f(−4) = 8 · x² − 3x, f(−2) = 10
    var s = pickWhere(function () { return { n: r.pick(['f', 'g', 'h']), b: r.pick(nz(-4, 4)), k: r.int(2, 5) }; }, function (s) { return s.k !== s.b && s.k !== -s.b; });
    var n = s.n, bq = s.b, k = s.k, x = -k, ans = k * k - bq * k, bx = (bq < 0 ? '-' : '+') + (Math.abs(bq) === 1 ? '' : Math.abs(bq));
    return numPart('If ' + t(n + '(x)=x^{2}' + term(bq, 'x', false)) + ', evaluate ' + t(n + '(' + x + ')') + '.', ans, [
      [-k * k - bq * k, 'u5x-sq-neg', 'Wrap the input in brackets: ' + t('(' + x + ')^{2}=(' + x + ')(' + x + ')=' + k * k) + ' — a negative number squared is positive.'],
      [k * k + bq * k, 'u5x-bx-sign', 'Check the sign of the second term: ' + t((Math.abs(bq) === 1 ? (bq < 0 ? '-' : '') : bq) + '(' + x + ')=' + (-bq * k)) + '.'],
      [-k * k + bq * k, 'u5x-sq-both', 'Put the input in brackets everywhere: ' + t('(' + x + ')^{2}' + bx + '(' + x + ')') + '.'],
      [-2 * k - bq * k, 'u5x-sq-2x', t('x^{2}') + ' means ' + t('x\\times x') + ', not ' + t('2x') + '.']],
      'Replace every ' + t('x') + ' with ' + t('(' + x + ')') + ':<br>' + t(n + '(' + x + ')=(' + x + ')^{2}' + bx + '(' + x + ')') + '<br>' + t('=' + k * k + (-bq * k < 0 ? '' : '+') + (-bq * k) + '=' + ans),
      ['Put the negative input in brackets: ' + t('(' + x + ')^{2}') + '.', 'A negative times a negative is positive.'], 'evaluate x² + bx at a negative');
  }
  function l9q2(r) { // Ryan: f(x) = 4x − 3, f(x + 2) = 4x + 5 · 3x + 5, f(x − 4) = 3x − 7
    var s = pickWhere(function () { return { n: r.pick(['f', 'g', 'h']), m: r.int(2, 6), c: r.pick(nz(-9, 9)), a: r.pick(nz(-5, 5)) }; }, function (s) { return s.m * s.a + s.c !== 0 && s.a + s.c !== 0 && s.m * s.a !== s.m; });
    var n = s.n, m = s.m, c = s.c, a = s.a, inner = 'x' + (a < 0 ? '-' + (-a) : '+' + a), K0 = m * a + c, T = PL(lin([[m, 'x'], [K0, '']]));
    var W = [{ is: PL(lin([[m, 'x'], [a + c, '']])), code: 'u5x-fn-nodist', hint: 'Wrap the input in brackets: ' + t(m + '(' + inner + ')' + term(c, '', false)) + '. The ' + t(m) + ' multiplies <b>both</b> terms.' },
      { is: PL(lin([[m * a, 'x'], [c, '']])), code: 'u5x-fn-ax', hint: 'Replace ' + t('x') + ' with the whole bracket: ' + t(m + '(' + inner + ')' + term(c, '', false) + '=' + m + 'x' + term(m * a, '', false) + term(c, '', false)) + '.' },
      { is: PL(String(K0)), code: 'u5x-fn-eval-a', hint: 'The input is the expression ' + t(inner) + ', not the number ' + t(a) + '. Your answer should still contain ' + t('x') + '.' }];
    var Wf = W.filter(function (w) { return !P.eq(w.is, T); });
    var p0 = B.poly('If ' + t(n + '(x)=' + lin([[m, 'x'], [c, '']])) + ', determine a simplified expression for ' + t(n + '(' + inner + ')') + '.', T, { before: t(n + '(' + inner + ')='), wrong: Wf, vars: ['x'], expanded: true },
      t(n + '(' + inner + ')=' + m + '(' + inner + ')' + term(c, '', false)) + '<br>' + t('=' + m + 'x' + term(m * a, '', false) + term(c, '', false)) + '<br>' + t('=' + lin([[m, 'x'], [K0, '']])),
      ['Replace every ' + t('x') + ' with ' + t('(' + inner + ')') + ', in brackets.', 'Multiply both terms in the bracket by ' + t(m) + ', then collect the numbers.'], 'f(x + a) for a linear f');
    p0.bad = Wf.map(function (w) { return P.tex(w.is); });
    return p0;
  }
  var MEAN = [{ f: 'B', v: 'h', act: 'Renting a bike', rule: function (k, F0) { return 'A bike rental costs ' + t('B(h)=' + k + 'h+' + F0) + ' dollars for ' + t('h') + ' hours.'; }, u: 'hours', u1: 'hour' },
    { f: 'P', v: 'h', act: 'Parking downtown', rule: function (k, F0) { return 'Parking downtown costs ' + t('P(h)=' + k + 'h+' + F0) + ' dollars for ' + t('h') + ' hours.'; }, u: 'hours', u1: 'hour' },
    { f: 'M', v: 't', act: 'A gym membership', rule: function (k, F0) { return 'A gym membership costs ' + t('M(t)=' + k + 't+' + F0) + ' dollars for ' + t('t') + ' months.'; }, u: 'months', u1: 'month' },
    { f: 'C', v: 'n', act: 'Renting skates', rule: function (k, F0) { return 'Renting skates costs ' + t('C(n)=' + k + 'n+' + F0) + ' dollars for ' + t('n') + ' days.'; }, u: 'days', u1: 'day' }];
  function l9q3(r) { // Ryan: B(h) = 5h + 10, B(3) = 25 · P(h) = 4h + 6, P(5) = 26
    var c = r.pick(MEAN), k = r.pick(c.f === 'M' ? [12, 15, 20, 25] : [3, 4, 5, 6, 8]), F0 = r.pick([5, 6, 8, 10, 12, 20]), a = r.int(2, 8), V = k * a + F0;
    var for_ = function (x, y) { return c.act + ' for ' + x + ' ' + c.u + ' costs ' + t('\\$' + y); };
    var opts = [{ html: for_(a, V), right: true },
      { html: for_(V, a), why: 'The number in the brackets is the input, the ' + c.u + '. The value after the = sign is the output, the cost. So ' + a + ' ' + c.u + ' cost ' + t('\\$' + V) + '.', code: 'swap' },
      { html: t(c.f) + ' times ' + a + ' equals ' + V, why: 'The brackets do not mean multiply. ' + t(c.f + '(' + a + ')') + ' means the output of ' + t(c.f) + ' when the input is ' + t(a) + '.', code: 'times' },
      { html: 'Each ' + c.u1 + ' costs ' + t('\\$' + V), why: t(c.f + '(' + c.v + ')') + ' is the <b>total</b> cost for ' + t(c.v) + ' ' + c.u + '. ' + t(c.f + '(' + a + ')=' + V) + ' means ' + a + ' ' + c.u + ' cost ' + t('\\$' + V) + ' altogether.', code: 'each' }];
    return mc(r, c.rule(k, F0) + ' What does ' + t(c.f + '(' + a + ')=' + V) + ' mean?', opts,
      'The input ' + t(a) + ' is the number of ' + c.u + ' and the output ' + t(V) + ' is the total cost: ' + for_(a, V) + '. Check: ' + t(k + '(' + a + ')+' + F0 + '=' + V) + ' ✓',
      ['In ' + t(c.f + '(' + a + ')=' + V) + ', the number in the brackets is the input; the number after the = sign is the output.', 'What does the input stand for here? What does the output stand for?'], 'meaning of f(a) = b');
  }
  HW.defineExit({ lesson: 'u5l9', calc: true, outcome: 'RF8',
    blurb: 'Evaluate x² + bx at a negative input, interpret B(3) = 25 in context, and simplify f(x + a) for a linear f.',
    questions: [Q(1, 'RF8', 'BEG', 'Evaluate.', l9q1), Q(2, 'RF8', 'MAS', 'An expression as the input.', l9q2), Q(3, 'RF8', 'PRG', 'What it means.', l9q3)] });

  /* =====================================================================================================
   * Lesson 10 — Function notation: graphs, conversions, real-world models (RF8)
   * ===================================================================================================== */
  function lineFn(r) { return pickWhere(function () { return { m: r.pick([1, 2, -1, -2]), c: r.int(-3, 3) }; }, function () { return true; }); }
  function l10q1(r) { // Ryan: f(x) = 2x + 1, f(1) = 3 · f(x) = 2x − 1, f(2) = 3
    var s = pickWhere(function () { var L = lineFn(r); return { m: L.m, c: L.c, a: r.int(-3, 3), n: r.pick(['f', 'g', 'h']) }; }, function (s) { var fa = s.m * s.a + s.c; return Math.abs(fa) <= 5 && fa !== s.a && fa !== -s.a && fa !== 0 && (s.a - s.c) / s.m !== fa; });
    var m = s.m, c = s.c, a = s.a, n = s.n, fa = m * a + c;
    var g = G({ segs: [lineSeg(m, c)], aria: 'graph of the function ' + n, max: 280 });
    return numPart('The graph of a function ' + t(n) + ' is shown. Each grid square is 1 unit. Use the graph to find ' + t(n + '(' + a + ')') + '.' + g, fa, [
      [a, 'u5x-read-input', t(a) + ' is the input. Go from ' + t('x=' + a) + ' up or down to the line and read across to the vertical axis.'],
      [(a - c) / m, 'u5x-read-swap', 'In ' + t(n + '(' + a + ')') + ', ' + t(a) + ' is the <b>input</b>, an ' + t('x') + '-value. Find ' + t('x=' + a) + ' on the horizontal axis, not on the vertical axis.'],
      [-fa, 'u5x-read-sign', 'Check the sign: is the point on the line ' + (fa > 0 ? 'above' : 'below') + ' the ' + t('x') + '-axis?']],
      'Start at ' + t('x=' + a) + ' on the horizontal axis, move ' + (fa > 0 ? 'up' : 'down') + ' to the line, then read across: the point is ' + t(ptT([a, fa])) + ', so ' + t(n + '(' + a + ')=' + fa) + '.',
      ['The number in the brackets is the input, an ' + t('x') + '-value.', 'Find that ' + t('x') + ' on the horizontal axis, go up or down to the line, and read the ' + t('y') + '-value.'], 'read f(a) from a graph');
  }
  function l10q2(r) { // Ryan: f(x) = −3 → x = −2 · x = −1
    var s = pickWhere(function () { var L = lineFn(r); return { m: L.m, c: L.c, x: r.int(-4, 4), n: r.pick(['f', 'g', 'h']) }; }, function (s) { var k = s.m * s.x + s.c; return Math.abs(k) <= 5 && k !== 0 && k !== s.x && k !== -s.x && s.x !== 0; });
    var m = s.m, c = s.c, xs = s.x, n = s.n, k = m * xs + c, fk = m * k + c;
    var g = G({ segs: [lineSeg(m, c)], aria: 'graph of the function ' + n, max: 280 });
    return numPart('The graph of a function ' + t(n) + ' is shown. Each grid square is 1 unit. Find the value of ' + t('x') + ' if ' + t(n + '(x)=' + k) + '.' + g, xs, [
      [Math.abs(fk) <= 6 ? fk : NaN, 'u5x-evaluated', 'That is ' + t(n + '(' + k + ')') + '. Here ' + t(k) + ' is the <b>output</b>: start at ' + t(k) + ' on the vertical axis, go across to the line, then read the ' + t('x') + '-axis.'],
      [-xs, 'u5x-read-sign', 'The point on the line with output ' + t(k) + ' is ' + (xs < 0 ? 'to the <b>left</b>' : 'to the <b>right</b>') + ' of the vertical axis.'],
      [k, 'u5x-read-input', t(k) + ' is the output you were given. Find the ' + t('x') + '-value that goes with it.']],
      'Start at ' + t(k) + ' on the vertical axis, go across to the line at ' + t(ptT([xs, k])) + ', then read the ' + t('x') + '-axis: ' + t('x=' + xs) + '.',
      ['In ' + t(n + '(x)=' + k) + ' you know the <b>output</b>. Find ' + t(k) + ' on the vertical axis.', 'Go across to the line, then straight up or down to the ' + t('x') + '-axis.'], 'solve f(x) = k from a graph', { before: t('x=') });
  }
  var EARN = [{ who: 'Jasmine', job: 'walking', L: 'n', what: 'dogs', one: 'dog' }, { who: 'Noah', job: 'mowing', L: 'n', what: 'lawns', one: 'lawn' }, { who: 'Ava', job: 'washing', L: 'c', what: 'cars', one: 'car' }, { who: 'Malik', job: 'shovelling', L: 'd', what: 'driveways', one: 'driveway' }];
  function l10q3(r) { // Ryan: E(n) = 12n, $84 → 7 · E(n) = 15n, $120 → 8
    var c = r.pick(EARN), k = r.pick([8, 9, 10, 12, 15, 18, 20, 25]), n = r.int(4, 12), Tt = k * n, L = c.L;
    return numPart(c.who + '’s earnings are ' + t('E(' + L + ')=' + k + L) + ' dollars for ' + c.job + ' ' + t(L) + ' ' + c.what + '. How many ' + c.what + ' did ' + (/a$|e$|ah$/.test(c.who) ? 'she' : 'he') + ' ' + (c.job === 'walking' ? 'walk' : c.job === 'mowing' ? 'mow' : c.job === 'washing' ? 'wash' : 'shovel') + ' if the earnings were ' + t('\\$' + Tt) + '?', n, [
      [k * Tt, 'u5x-evaluated', t('\\$' + Tt) + ' is the <b>output</b> (the earnings). Solve ' + t(k + L + '=' + Tt) + ' by dividing.'],
      [Tt - k, 'u5x-sub-rate', t(k + L) + ' means ' + t(k) + ' times ' + t(L) + ', so undo it by dividing: ' + t(Tt + '\\div ' + k) + '.'],
      [Tt + k, 'u5x-add-rate', t(k + L) + ' means ' + t(k) + ' times ' + t(L) + ', so undo it by dividing: ' + t(Tt + '\\div ' + k) + '.']],
      'Set ' + t('E(' + L + ')=' + Tt) + ': ' + t(k + L + '=' + Tt) + ', so ' + t(L + '=' + Tt + '\\div ' + k + '=' + n) + ' ' + c.what + '. Check: ' + t(k + '(' + n + ')=' + Tt) + ' ✓',
      ['The earnings ' + t('\\$' + Tt) + ' are the output: set ' + t('E(' + L + ')=' + Tt) + '.', 'Undo the multiplication by dividing.'], 'solve E(n) = T', { after: c.what });
  }
  function l10q4(r) { // added Mastery: correct a function-notation error (Lesson 10 Q8: "d(4) = 2" for the point (2, 4))
    var s = pickWhere(function () { var m = r.pick([1, 2, -1, -2, 0.5]), c = r.int(-3, 3), a = r.int(-4, 4); return { m: m, c: c, a: a, b: m * a + c }; }, function (s) { return s.b % 1 === 0 && Math.abs(s.b) <= 4 && s.a !== 0 && s.b !== 0 && Math.abs(s.a) !== Math.abs(s.b); });
    var a = s.a, b = s.b, g = G({ segs: [lineSeg(s.m, s.c)], points: [{ x: a, y: b, color: RED }], aria: 'graph of the function d with one point marked', max: 280 });
    var c1 = numChk(a, [[b, 'u5x-fn-swap', 'The brackets hold the <b>input</b> — the ' + t('x') + '-coordinate of the point.']]), c2 = numChk(b, [[a, 'u5x-fn-swap', 'After the = sign comes the <b>output</b> — the ' + t('y') + '-coordinate of the point.']]);
    var p0 = B.fields('The graph of the function ' + t('d') + ' is shown, with one point marked. A student looks at the marked point and says “' + t('d(' + b + ')=' + a) + '.” The student is wrong. Complete the correct statement, ' + t('d(\\square)=\\square') + '.' + g,
      [{ label: 'Inside the brackets:', name: 'input', mode: 'number' }, { label: 'After the = sign:', name: 'output', mode: 'number' }], [c1, c2], [String(a), String(b)], t('d(' + a + ')=' + b),
      'The marked point is ' + t(ptT([a, b])) + ': input ' + t('x=' + a) + ', output ' + t('y=' + b) + '. In function notation the input goes in the brackets and the output after the = sign: ' + t('d(' + a + ')=' + b) + '.<br>The student swapped them: ' + t('d(' + b + ')=' + a) + ' would mean the point ' + t(ptT([b, a])) + '.',
      ['Read the coordinates of the marked point: (input, output).', t('d(\\text{input})=\\text{output}') + '.'], 'correct a function-notation error');
    var base = p0.check;
    p0.check = function (resp) { resp = resp || []; var u = HW.parse.number(resp[0]), v = HW.parse.number(resp[1]); if (u.ok && v.ok && same(u.value, b) && same(v.value, a)) return wrong('u5x-fn-swap', 'That is the student’s statement. ' + t('d(' + b + ')=' + a) + ' would mean the point ' + t(ptT([b, a])) + '. Put the <b>input</b> (the ' + t('x') + '-coordinate) in the brackets.'); return base(resp); };
    p0.bad = [[String(b), String(a)]];
    return p0;
  }
  HW.defineExit({ lesson: 'u5l10', calc: true, outcome: 'RF8',
    blurb: 'Read f(a) from a graph, solve f(x) = k from a graph, solve an earnings model, and correct a function-notation error.',
    questions: [Q(1, 'RF8', 'BEG', 'Reading a graph.', l10q1), Q(2, 'RF8', 'PRG', 'Solving from a graph.', l10q2), Q(3, 'RF8', 'PRG', 'A model.', l10q3), Q(4, 'RF8', 'MAS', 'Find the error.', l10q4)] });

  /* =====================================================================================================
   * Lesson 11 — Interpreting and sketching real-world graphs (RF1)
   * ===================================================================================================== */
  var TRIP = [{ who: 'Leah', go: 'bikes from home at a steady pace', stop: 'stops at a store for a while', rest: 'rides the rest of the way' },
    { who: 'Sam', go: 'walks to school at a steady pace', stop: 'stops to talk to a friend', rest: 'walks the rest of the way' },
    { who: 'Ravi', go: 'bikes toward the park at a steady pace', stop: 'stops to fix his bike chain', rest: 'bikes the rest of the way' },
    { who: 'Mei', go: 'jogs from home at a steady pace', stop: 'stops for a drink of water', rest: 'jogs the rest of the way' }];
  function l11q1(r) { // Ryan: Leah (faster) · Sam (slower)
    var c = r.pick(TRIP), kind = r.pick(['faster', 'slower', 'same']);
    var shape = { faster: [[0, 0], [3.5, 3], [5.5, 3], [9, 9]], slower: [[0, 0], [3.5, 3], [5.5, 3], [9.5, 4.4]], same: [[0, 0], [3.5, 3], [5.5, 3], [9.5, 6.4]], fall: [[0, 0], [3, 3.8], [5, 1.8], [9, 7.5]] };
    var word = { faster: '<b>faster</b> than before', slower: 'more <b>slowly</b> than before', same: 'at the <b>same</b> speed as before' };
    var whyF = { faster: 'Here the last part is <b>steeper</b> than the first — that means going faster.', slower: 'Here the last part is <b>less steep</b> than the first — that means going slower.', same: 'Here both rising parts are equally steep — the same speed.' };
    var opts = ['faster', 'slower', 'same', 'fall'].map(function (k) {
      if (k === kind) return { html: mini(shape[k], 'Time', 'Distance'), right: true };
      if (k === 'fall') return { html: mini(shape[k], 'Time', 'Distance'), why: 'When ' + c.who + ' stops, the distance from home does not change, so that part of the graph is <b>flat</b>. A falling part means heading back toward home.', code: 'fall' };
      return { html: mini(shape[k], 'Time', 'Distance'), why: whyF[k] + ' The story says the rest of the way is ' + word[kind].replace(/<\/?b>/g, '') + '.', code: k };
    });
    var p0 = mc(r, c.who + ' ' + c.go + ', ' + c.stop + ', then ' + c.rest + ' ' + word[kind] + '. Which graph shows ' + (c.who === 'Ravi' || c.who === 'Sam' ? 'his' : 'her') + ' distance from home?', opts,
      'Steady pace: a straight rising part. Stop: a <b>flat</b> part (the distance is not changing). Then ' + (kind === 'faster' ? 'a <b>steeper</b> rising part (faster).' : kind === 'slower' ? 'a <b>less steep</b> rising part (slower).' : 'a rising part just as steep as the first (same speed).'),
      ['Flat means not moving; steeper means faster.', 'Compare the steepness of the last part with the first part.'], 'match a trip story to a graph');
    p0.input.columns = 2;
    return p0;
  }
  function l11q2(r) { // Ryan: P(0, 10) Q(2, 10) R(5, 40) S(7, 40) T(9, 20) → 10 L/day · depth (cm) 5 cm/day
    var c = r.pick([{ yT: 'Water (L)', thing: 'the water in a rain barrel', u: 'litres per day', uu: 'L' }, { yT: 'Depth (cm)', thing: 'the water depth in a pond', u: 'centimetres per day', uu: 'cm' }, { yT: 'Water (L)', thing: 'the water in a garden tank', u: 'litres per day', uu: 'L' }]);
    var s = pickWhere(function () { var y0 = r.pick([0, 10, 20]), q = r.int(1, 3), dR = r.int(2, 5), rate = r.pick([5, 10, 15, 20]), y1 = y0 + rate * dR, sS = r.int(1, 2), y2 = r.pick([0, 10, 20, 30]); return { y0: y0, q: q, rr: q + dR, rate: rate, y1: y1, ss: q + dR + sS, y2: y2 }; },
      function (s) { return s.y1 <= 60 && s.y1 % 10 === 0 && s.y0 % 10 === 0 && s.ss <= 8 && s.y2 < s.y1 && (s.y1 - s.y0) !== s.rate; });
    var V = [[0, s.y0], [s.q, s.y0], [s.rr, s.y1], [s.ss, s.y1], [9, s.y2]], LB = ['P', 'Q', 'R', 'S', 'T'], ym = s.y1 + 10, dy = s.y1 - s.y0, dt = s.rr - s.q;
    var g = HW.graph({ x: [0, 10], y: [0, ym], grid: 1, gridY: 10, labels: 1, labelsX: 1, labelsY: 10, unitX: 27, unitY: 190 / ym, firstQuadrant: true, xName: ' ', yName: ' ', xTitle: 'Day', yTitle: c.yT,
      segs: [{ pts: V, start: 'none', end: 'none' }], points: V.map(function (p) { return { x: p[0], y: p[1], color: RED }; }).concat(V.map(function (p, i) { var below = i === 1 || (i === 4 && p[1] > 0); return { x: p[0] + (i === 4 ? -0.7 : i === 1 ? 0.1 : -0.1), y: p[1] + (below ? -20 : i === 4 ? 6 : 0) * ym / 190, label: LB[i], color: 'none' }; })), max: 340, aria: 'graph made of four segments P to T' });
    return numPart('The graph shows ' + c.thing + ' over 9 days.' + g + 'What is the rate of change from ' + t('Q') + ' to ' + t('R') + ', in ' + c.u + '?', s.rate, [
      [dy, 'u5x-rate-total', t(dy) + ' ' + c.uu + ' is the total rise from ' + t('Q') + ' to ' + t('R') + '. The rate is <b>per day</b>: divide by the ' + t(dt) + ' days.'],
      [s.y1 / s.rr, 'u5x-rate-coords', 'Use the <b>change</b> in ' + c.uu + ' and the <b>change</b> in days: from ' + t(s.y0) + ' to ' + t(s.y1) + ', and from day ' + t(s.q) + ' to day ' + t(s.rr) + '.'],
      [dt / dy, 'u5x-rate-flip', 'Rate of change is change in ' + c.uu + ' ÷ change in time: ' + t(dy + '\\div ' + dt) + ', not ' + t(dt + '\\div ' + dy) + '.']],
      'From ' + t('Q' + ptT([s.q, s.y0])) + ' to ' + t('R' + ptT([s.rr, s.y1])) + ': the water rises ' + t(s.y1 + '-' + s.y0 + '=' + dy) + ' ' + c.uu + ' in ' + t(s.rr + '-' + s.q + '=' + dt) + ' days, so the rate is ' + t(dy + '\\div ' + dt + '=' + s.rate) + ' ' + c.u + '.',
      ['Rate of change = change in the amount ÷ change in time.', 'Read the coordinates of ' + t('Q') + ' and ' + t('R') + ' from the grid.'], 'rate of change from a graph', { after: c.uu + '/day' });
  }
  var CURVE = [{ txt: 'A mug of hot cocoa is left on a table. It cools <b>quickly at first</b>, then more and more <b>slowly</b>, levelling off.', dir: 'down', yT: 'Temp.', what: 'its temperature' },
    { txt: 'A bowl of hot soup is set out to cool. Its temperature drops <b>quickly at first</b>, then more and more <b>slowly</b>, levelling off.', dir: 'down', yT: 'Temp.', what: 'its temperature' },
    { txt: 'A new laptop loses value <b>quickly at first</b>, then more and more <b>slowly</b>, levelling off.', dir: 'down', yT: 'Value', what: 'its value' },
    { txt: 'A pot of water is put on a hot stove. Its temperature rises <b>quickly at first</b>, then more and more <b>slowly</b>, levelling off.', dir: 'up', yT: 'Temp.', what: 'its temperature' },
    { txt: 'A cold can of juice is left in a warm room. It warms up <b>quickly at first</b>, then more and more <b>slowly</b>, levelling off.', dir: 'up', yT: 'Temp.', what: 'its temperature' },
    { txt: 'A sunflower seedling grows <b>quickly at first</b>, then more and more <b>slowly</b>, levelling off at its full height.', dir: 'up', yT: 'Height', what: 'its height' }];
  function curvePts(f) { return range(0, 20).map(function (i) { var x = i / 2; return [x, f(x)]; }); }
  function l11q3(r) { // Ryan: cocoa cooling (falls, steep first) · pot heating (rises, steep first)
    var c = r.pick(CURVE), down = c.dir === 'down';
    var fast = down ? function (x) { return 1.5 + 7.5 * Math.exp(-0.38 * x); } : function (x) { return 9 - 7.5 * Math.exp(-0.38 * x); };
    var slow = down ? function (x) { return 9 - 7.5 * Math.pow(x / 10, 2.2); } : function (x) { return 1.5 + 7.5 * Math.pow(x / 10, 2.2); };
    var straight = down ? function (x) { return 9 - 0.75 * x; } : function (x) { return 1.5 + 0.75 * x; };
    var opp = down ? function (x) { return 9 - 7.5 * Math.exp(-0.38 * x); } : function (x) { return 1.5 + 7.5 * Math.exp(-0.38 * x); };
    var opts = [{ html: mini(curvePts(fast), 'Time', c.yT), right: true },
      { html: mini(curvePts(straight), 'Time', c.yT), why: 'A straight line changes at the same rate the whole time. The story changes fast at first (steep), then slowly (flatter), so the graph is a curve.', code: 'straight' },
      { html: mini(curvePts(slow), 'Time', c.yT), why: 'This graph starts flat and gets steeper: slowly first, then faster. The story is the opposite: steep first, then flatter.', code: 'slowfirst' },
      { html: mini(curvePts(opp), 'Time', c.yT), why: down ? 'The amount goes <b>down</b> in the story, so the graph must fall from left to right.' : 'The amount goes <b>up</b> in the story, so the graph must rise from left to right.', code: 'dir' }];
    var p0 = mc(r, c.txt + ' Which graph shows ' + c.what + '?', opts,
      (down ? 'Falling' : 'Rising') + ', steep at first (fast), then flatter and flatter (slow, levelling off).',
      ['Does the amount go up or down?', 'Fast change = steep; slow change = nearly flat.'], 'match a curve story to a graph');
    p0.input.columns = 2;
    return p0;
  }
  function l11q4(r) { // added Mastery: sketch a story graph with numbers (Lesson 11 Part C)
    var s = pickWhere(function () { var V0 = r.pick([30, 35, 40, 45, 50, 55, 60]), r1 = r.pick([2, 3, 4, 5]), t1 = r.int(1, 5), t2 = r.int(1, 4), r2 = r.pick([5, 10, 15]), V1 = V0 - r1 * t1; return { V0: V0, r1: r1, t1: t1, t2: t2, r2: r2, V1: V1, t3: V1 / r2, T: t1 + t2 + V1 / r2 }; },
      function (s) { return s.V1 > 0 && s.V1 % 5 === 0 && s.t3 % 1 === 0 && s.t3 >= 2 && s.T <= 15 && s.r2 > s.r1; });
    var a = s.t1, b = s.t1 + s.t2, T = s.T, V0 = s.V0, V1 = s.V1;
    var I = { x: [0, 16], y: [0, 70], grid: 1, gridY: 5, labels: 2, labelsX: 2, labelsY: 10, unitX: 18, unitY: 3.6, firstQuadrant: true, xName: 't', yName: 'V', xTitle: 'Time (min)', yTitle: 'Volume (L)', tools: ['line'], defaultEnd: 'none', snapX: 1, snapY: 5 };
    var chk = K.graphStory({ phases: [{ dir: 'down', text: 'drains at ' + s.r1 + ' L/min', x0: 0, x1: a, y0: V0, y1: V1 }, { dir: 'flat', text: 'valve closed', x0: a, x1: b, y0: V1, y1: V1 }, { dir: 'down', text: 'drains at ' + s.r2 + ' L/min', x0: b, x1: T, y0: V1, y1: 0 }],
      start: V0, end: 0, xUnit: 'min', yUnit: 'L', startHint: 'The tank starts full: at ' + t('t=0') + ' it holds ' + t(V0) + ' L.', endHint: 'The story ends when the tank is <b>empty</b>: the graph must come down to ' + t('V=0') + '.' });
    var key = gv([], [{ v: [[0, V0], [a, V1], [b, V1], [T, 0]], s: 'none', e: 'none' }]);
    var p0 = B.graph('A tank holds ' + t(V0) + ' L of water. It drains at ' + t(s.r1) + ' L/min for ' + t(a) + ' min. Then the valve is closed for ' + t(s.t2) + ' min. Then the valve is opened wider, and the tank drains at ' + t(s.r2) + ' L/min until it is empty.<br>Sketch the volume of water, ' + t('V') + ' (L), against time, ' + t('t') + ' (min). Use <b>╱ Line</b>: tap the start, then each corner, and tap the last point again to finish.', I, chk, key,
      'Stage 1: from ' + t(V0) + ' L, ' + t(s.r1 + '\\times' + a + '=' + (s.r1 * a)) + ' L drain, leaving ' + t(V1) + ' L at ' + t('t=' + a) + ' min.<br>Stage 2: flat at ' + t(V1) + ' L until ' + t('t=' + b) + ' min.<br>Stage 3: ' + t(V1 + '\\div' + s.r2 + '=' + s.t3) + ' more minutes to empty, so it reaches ' + t('0') + ' L at ' + t('t=' + T) + ' min. The last stage is steeper because it drains faster.',
      ['Work out the volume at the end of each stage and the time when each stage ends.', 'A closed valve means the volume stays the same: a flat piece. Faster draining is a steeper piece.'], 'sketch a draining tank');
    p0.bad = [gv([], [{ v: [[0, V0], [a, V1], [T, 0]], s: 'none', e: 'none' }]), gv([], [{ v: [[0, V0], [a, V1], [b, V1], [T + 2, 0]], s: 'none', e: 'none' }]), gv([], [{ v: [[0, V0], [a, V0 - s.r1], [b, V0 - s.r1], [T, 0]], s: 'none', e: 'none' }])].filter(function (q) { return !Dr.same(q, key); });
    return p0;
  }
  HW.defineExit({ lesson: 'u5l11', calc: true, outcome: 'RF1',
    blurb: 'A cooling or heating curve, matching a trip story to a graph, a rate of change from a graph, and sketching a story graph with numbers.',
    questions: [Q(1, 'RF1', 'PRG', 'A trip.', l11q1), Q(2, 'RF1', 'PRG', 'Rate of change.', l11q2), Q(3, 'RF1', 'BEG', 'Fast, then slow.', l11q3), Q(4, 'RF1', 'MAS', 'Sketch the story.', l11q4)] });

  /* =====================================================================================================
   * Lesson 12 — Unit review (RF2, RF8)
   * ===================================================================================================== */
  function l12q1(r) { // Ryan: segment (−4, −3) to (2, 5) · (−3, 4) to (5, −2) (MC → typed)
    var s = pickWhere(function () { return { x1: r.int(-5, -1), x2: r.int(1, 5), y1: r.int(-5, 5), y2: r.int(-5, 5) }; }, function (s) { return s.x2 - s.x1 >= 3 && Math.abs(s.y1 - s.y2) >= 3 && !(Math.min(s.y1, s.y2) === s.x1 && Math.max(s.y1, s.y2) === s.x2); });
    var lo = Math.min(s.y1, s.y2), hi = Math.max(s.y1, s.y2), D = ineq('x', s.x1, s.x2), R = ineq('y', lo, hi);
    var g = G({ segs: [{ pts: [[s.x1, s.y1], [s.x2, s.y2]], start: 'closed', end: 'closed' }], aria: 'a line segment with two end dots' });
    return drPart15('The graph is a line segment with endpoints ' + t(ptT([s.x1, s.y1])) + ' and ' + t(ptT([s.x2, s.y2])) + '.' + g + 'State its domain and range.', D, R, {
      dW: [{ is: lstPlain([s.x1, s.x2]), code: 'u5x-dr-ends-list', hint: 'The segment is unbroken, so every ' + t('x') + '-value from ' + t(s.x1) + ' to ' + t(s.x2) + ' is used, not just the ends. Use an inequality.' }, { is: ALL, code: 'u5x-dr-allreal', hint: 'This graph stops at its two endpoints, so its domain is limited.' }],
      rW: [{ is: lstPlain([lo, hi]), code: 'u5x-dr-ends-list', hint: 'The segment is unbroken, so every ' + t('y') + '-value from ' + t(lo) + ' to ' + t(hi) + ' is used, not just the ends. Use an inequality.' }, { is: ALL, code: 'u5x-dr-allreal', hint: 'This graph stops at its two endpoints, so its range is limited.' }] },
      'Left to right, ' + t('x') + ' goes from ' + t(s.x1) + ' to ' + t(s.x2) + '; bottom to top, ' + t('y') + ' goes from ' + t(lo) + ' to ' + t(hi) + '. The endpoints are solid, so they are included.<br>Domain ' + t(D) + '; range ' + t(R) + '.',
      [HINT_D, 'Write each one as an inequality, like ' + t('-2\\le x\\le 5') + '.'], 'domain and range of a segment');
  }
  function l12q2(r) { // Ryan: g(x) = 4x − 9, g(k) = 7 → 4 · g(x) = 2x − 7, g(k) = 5 → 6
    var s = pickWhere(function () { return { m: r.int(2, 6), c: r.pick(nz(-12, 12)), k: r.pick(range(2, 9).concat([-2, -3])) }; }, function (s) { var v = s.m * s.k + s.c; return v !== 0 && Math.abs(v) <= 40 && v !== s.k; });
    var m = s.m, c = s.c, k = s.k, v = m * k + c, rule = lin([[m, 'x'], [c, '']]);
    return numPart('Consider ' + t('g(x)=' + rule) + '. If ' + t('g(k)=' + v) + ', determine the value of ' + t('k') + '.', k, [
      [m * v + c, 'u5x-evaluated', t(v) + ' is the <b>output</b>. Set the rule equal to ' + t(v) + ': ' + t(lin([[m, 'k'], [c, '']]) + '=' + v) + '.'],
      [(v + c) / m, 'u5x-solve-inverse', 'To undo ' + t((c < 0 ? '' : '+') + c) + ', ' + (c < 0 ? '<b>add</b> ' + t(-c) : '<b>subtract</b> ' + t(c)) + ' on both sides: ' + t(m + 'k=' + (v - c)) + '.'],
      [v - c, 'u5x-solve-nodiv', 'Almost there: ' + t(m + 'k=' + (v - c)) + ' still needs dividing by ' + t(m) + '.']],
      t(lin([[m, 'k'], [c, '']]) + '=' + v) + ', so ' + t(m + 'k=' + (v - c)) + ' and ' + t('k=' + k) + '. Check: ' + t('g(' + k + ')=' + m + '(' + k + ')' + term(c, '', false) + '=' + v) + ' ✓',
      ['In ' + t('g(k)=' + v) + ', ' + t(v) + ' is the output. Set the rule equal to ' + t(v) + '.', 'Undo the constant first, then divide by ' + t(m) + '.'], 'solve g(k) = v', { before: t('k=') });
  }
  function l12q3(r) { // Ryan: which relation is not a function
    var A0 = r.int(1, 5), cA = r.int(2, 9), A = [[A0, cA], [A0 + 1, cA], [A0 + 2, cA]];
    var nx = r.int(1, 6), nB = pickWhere(function () { return r.sample(range(0, 9), 3); }, function () { return true; }), Bn = [[nx, nB[0]], [nx, nB[1]], [nx + r.int(2, 4), nB[2]]];
    var cx = r.int(2, 7), cy = r.int(0, 9), C = [[cx, cy], [cx, cy], [cx + 1, cy + r.int(1, 3)]];
    var d0 = r.int(0, 2), sq = r.chance(0.5), Dd = range(d0, d0 + 3).map(function (x) { return [x, sq ? x * x : 2 * x + 1]; });
    var show = function (ps) { return t(ps.map(ptT).join(',\\ ')); };
    var opts = [{ html: show(A), why: 'Every input ' + t(A0 + ',\\ ' + (A0 + 1) + ',\\ ' + (A0 + 2)) + ' has one output. Reusing the output ' + t(cA) + ' is fine, so this is a function.', code: 'repY' },
      { html: show(Bn), right: true },
      { html: show(C), why: t(ptT(C[0])) + ' is the same pair written twice, so ' + t('x=' + cx) + ' still has only one output, ' + t(cy) + '. This is a function.', code: 'dup' },
      { html: show(Dd), why: 'A function needs no pattern, but every ' + t('x') + '-value here is different, so each has one output: a function.', code: 'pattern' }];
    return mc(r, 'Which relation is <b>not</b> a function?', opts,
      'In ' + show(Bn) + ', the input ' + t(nx) + ' has two different outputs, ' + t(nB[0]) + ' and ' + t(nB[1]) + '. That breaks the rule, so it is not a function.',
      ['A relation is not a function when one input (' + t('x') + ') has two <b>different</b> outputs.', 'Repeated outputs, or the same pair written twice, are fine.'], 'which relation is not a function');
  }
  var FILL = [{ txt: function (k, M) { return 'A rectangular pool is filled at ' + t(k) + ' L per minute. The volume, in litres, after ' + t('m') + ' minutes is ' + t('V(m)=' + k + 'm') + '. The pool is full after ' + t(M) + ' minutes, and then the hose is turned off.'; }, v: 'm', L: 'V' },
    { txt: function (k, M) { return 'A water truck fills a tank at ' + t(k) + ' L per minute. The volume, in litres, after ' + t('m') + ' minutes is ' + t('V(m)=' + k + 'm') + '. The tank is full after ' + t(M) + ' minutes, and then the pump stops.'; }, v: 'm', L: 'V' },
    { txt: function (k, M) { return 'A hot tub is filled at ' + t(k) + ' L per minute. The volume, in litres, after ' + t('m') + ' minutes is ' + t('V(m)=' + k + 'm') + '. It is full after ' + t(M) + ' minutes, and then the tap is turned off.'; }, v: 'm', L: 'V' }];
  function l12q4(r) { // added Mastery: domain and range from the context (review Q22–23: V(m) = 150m, full after 40 min)
    var c = r.pick(FILL), k = r.pick([25, 40, 50, 75, 100, 150, 200]), M = r.pick([20, 30, 40, 45, 60]), Vm = k * M;
    var D = ineq('m', 0, M), R = ineq('V', 0, Vm);
    return drPart15(c.txt(k, M) + ' State the domain and range of ' + t('V') + ' in this situation.', D, R, {
      dv: 'm', rv: 'V', dW: [{ is: ineq('m', 0, null), code: 'u5x-ctx-nomax', hint: 'The hose is turned off after ' + t(M) + ' minutes, so the time stops there.' }, { is: ALL, code: 'u5x-ctx-allreal', hint: 'Time can’t be negative here, and it stops when the filling stops.' }],
      rW: [{ is: ineq('V', 0, null), code: 'u5x-ctx-nomax', hint: 'The volume stops growing when it is full: ' + t('V(' + M + ')=' + k + '(' + M + ')') + '.' }, { is: ALL, code: 'u5x-ctx-allreal', hint: 'The volume can’t be negative, and it stops at the full volume.' }, { is: ineq('V', 0, M), code: 'u5x-dr-swap', hint: t(M) + ' is a time. The range is the volumes: up to ' + t('V(' + M + ')') + '.' }],
      phD: 'e.g. 0 <= m <= 10', phR: 'e.g. 0 <= V <= 500' },
      'Time runs from the start (' + t('m=0') + ') until the filling stops (' + t('m=' + M) + '): ' + t(D) + '.<br>The volume starts at ' + t('V(0)=0') + ' and ends at ' + t('V(' + M + ')=' + k + '(' + M + ')=' + F(Vm)) + ': ' + t(R) + '.',
      ['When does the situation start and stop? That gives the domain.', 'Find ' + t('V') + ' at the start and at the end: that gives the range.'], 'domain and range from the context');
  }
  HW.defineExit({ lesson: 'u5l12', calc: true, outcome: 'RF2',
    blurb: 'Unit 5 review: which relation is not a function, the domain and range of a segment, solving g(k) = v, and domain and range from a context.',
    questions: [Q(1, 'RF2', 'PRG', 'Domain and range.', l12q1), Q(2, 'RF8', 'PRG', 'Function notation.', l12q2), Q(3, 'RF2', 'BEG', 'Functions.', l12q3), Q(4, 'RF2', 'MAS', 'In context.', l12q4)] });
})(window);
