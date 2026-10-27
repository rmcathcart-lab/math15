/* Math 15 · Unit 5 Test (RF1, RF2, RF4, RF5, RF8) — Relations and Functions, built the way the Math 10C Unit 5 Test was
 * built (BEG / PRG / MAS boxes, mostly typed or graphical answers, keys built from the generated numbers, `bad` answers
 * with u5t- codes, worked solutions and hints) but pitched at Math 15 and NOT based on the Math 15 multiple-choice paper
 * tests. One 75-minute class, scientific calculator allowed; 19 questions / 39 parts.
 *
 * Boxes kept: RF1, RF2 and RF8 have Beginning, Progressing and Mastery boxes (3 parts each). RF4 (linear patterns) and
 * RF5 (intercepts) have only Beginning and Progressing boxes (3 parts each): Units 6–7 assess them in depth. Three parts
 * in each of the 13 boxes is why the test has 39 parts rather than 38.
 *
 * How each box is pitched (numbers come from Ryan's Math 15 Lessons 1–12, assignments, extra practice and exit slips;
 * their numbers and situations are possible values):
 *   Beginning  — each lesson's core skill as first taught: draw the mapping diagram of a table, plot its points (all four
 *                quadrants) and list its domain and range (L1, L3, L6); read a value off a story graph and say whether
 *                each piece is increasing, decreasing or constant (L11); independent vs dependent variable (L2); a tile
 *                pattern's table, its start and step, and the next figures (L2); intercepts read off a line, off a table
 *                listed out of order, and the form of an intercept point (L4); write y = mx + b as f(x) = …, evaluate f(3)
 *                and read g(a) off a graph (L9, L10).
 *   Progressing — the typical assignment question: match a story to its graph and find a rate of change and the total
 *                constant time on a story graph (L11); the vertical line test on four graphs and "which input breaks
 *                it?" for pairs / a table / a mapping diagram (L8); domain and range of a continuous graph that bends,
 *                as inequalities or set notation (L5, L6); a pattern given in words: Figure 12, plot Figures 1–5, missing
 *                outputs in a table (L2, L3); intercepts in context, their meanings, and a calculator window that shows
 *                both intercepts (L4, L7); h(−3) with a negative input, solve h(x) = k, and x so that f(x) = k from a
 *                graph (L9, L10).
 *   Mastery    — Math 15's hardest assignment / extra-practice items, clearly easier than the 10C Mastery box: sketch a
 *                fill–soak–drain story from given times and heights and find the draining rate (L11 Ex 4); why a sketch
 *                can't be a distance-over-time graph (L11 #10); build a relation with a given domain and range that is not
 *                a function, and decide whether a function could have a given domain and range (L8, EP12); realistic
 *                domain and range from a context with restrictions (L10 #13–14, L12 #23–24); interpret C(a) = b in
 *                context and use it (L9 Ex 5, L12 #26); find and correct a student's d(4) = 2 error (L10 #8).
 * Coverage: L1 Q1b · L2 Q3, Q4, Q11 · L3 Q1a, Q11c · L4 Q5, Q12a–b · L5 Q10, Q17 · L6 Q1c, Q16 · L7 Q12c, Q17 ·
 *           L8 Q9, Q16 · L9 Q6, Q13a–b, Q18 · L10 Q6c, Q13c, Q19 · L11 Q2, Q7, Q8, Q14, Q15 · L12 (review) Q17, Q18.
 * Notation: Math 15 writes a continuous domain or range as an inequality (−4 ≤ x ≤ 3, y ≥ 2) and a discrete one as a list
 * in braces; set-builder notation and intervals are accepted too, "x ∈ ℝ" is not required, and a list may be in any order
 * (Lesson 6: increasing order is "good habit, not yet required"), but each value only once.
 * Conversions to online: "explain what happens on each interval" → an increasing / decreasing / constant table; "which
 * graph matches the story" → graphs A–D in the question and a choice; "explain why the graph can't be right" → choices
 * that are each a reasoned claim; "is it a function? justify" → type the input that has two outputs, or press none;
 * "sketch" → the graph pad (checked by shape, times and heights); "explain what C(a) = b means" → a sentence with blanks;
 * "explain the student's error and write the correct statement" → the corrected statement in function notation. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, S = HW.sets, DR = HW.draw, PL = HW.poly;

  HW.addCodes({
    'u5t-plot-swap': 'Plotted every point as (y, x)', 'u5t-plot-one-swap': 'One point plotted as (y, x)', 'u5t-plot-one-sign': 'One point with a sign slip',
    'u5t-plot-shift': 'Plotted the pattern one figure to the left (started at Figure 0)', 'u5t-read-swap': 'Read the wrong axis (input and output swapped)',
    'u5t-read-point': 'Read the graph at the wrong point', 'u5t-dir-one': 'Increasing / decreasing / constant: one interval wrong', 'u5t-dir': 'Increasing / decreasing / constant: several intervals wrong',
    'u5t-var-swap': 'Independent and dependent variables swapped', 'u5t-var-same': 'Same variable in both boxes', 'u5t-pat-extend': 'Pattern table right for the drawn figures, wrong after them',
    'u5t-pat-nobase': 'Pattern: used only the amount added (figure number × step)', 'u5t-pat-mult': 'Pattern: multiplied Figure 1 by the figure number', 'u5t-pat-swap': 'Pattern: start and step swapped',
    'u5t-pat-off1': 'Pattern: added the step one time too many', 'u5t-pat-step': 'Pattern: wrong step between figures', 'u5t-miss-step': 'Missing table value: wrong step',
    'u5t-int-other': 'Gave the other intercept', 'u5t-int-flip': 'Intercept point with its coordinates in the wrong order', 'u5t-int-off': 'Intercept point not on the axis',
    'u5t-ev-no-b': 'Evaluating: left out the constant term', 'u5t-ev-add': 'Evaluating: added instead of multiplying', 'u5t-ev-instead': 'Evaluated instead of solving',
    'u5t-rate-rise': 'Gave the change in the quantity, not the rate of change', 'u5t-rate-seg': 'Rate of change of a different piece', 'u5t-flat-one': 'Counted only one of the constant intervals',
    'u5t-flat-count': 'Counted the constant pieces instead of the time', 'u5t-flat-other': 'Gave the time the amount was changing', 'u5t-vlt-one': 'Vertical line test: one graph wrong',
    'u5t-vlt': 'Vertical line test: several graphs wrong', 'u5t-fn-output': 'Looked for a repeated output (outputs may repeat)', 'u5t-fn-said-fn': 'Said “function” when an input has two outputs',
    'u5t-fn-said-not': 'Said a function is not a function', 'u5t-mean-one': 'Meanings of the intercepts: one wrong', 'u5t-mean': 'Meanings of the intercepts: both wrong',
    'u5t-ex-fn': 'Example is a function (asked for a non-function)', 'u5t-ex-dom': 'Example has the wrong domain', 'u5t-ex-range': 'Example has the wrong range',
    'u5t-ex-count': 'Example has the wrong number of ordered pairs', 'u5t-fn-impossible': 'Gave a “function” for an impossible domain and range', 'u5t-said-none': 'Said no function exists (one does)',
    'u5t-ex-notfn': 'Example is not a function', 'u5t-ctx-noend': 'Realistic domain or range: no end where the situation stops', 'u5t-ctx-all': 'Realistic domain or range: all real numbers',
    'u5t-ctx-start': 'Realistic range: started at 0 instead of the starting value', 'u5t-ctx-end': 'Realistic domain: stopped at the wrong value', 'u5t-io-swap': 'Input and output swapped',
    'u5t-stmt-input': 'Put the output in the brackets', 'u5t-fee': 'Left out the fixed fee', 'u5t-err-kept': 'Repeated the student’s error',
    'u5t-arrow-one': 'Mapping diagram: one arrow to the wrong output', 'u5t-arrows': 'Mapping diagram: several arrows wrong'
  });
  HW.addPartial({
    'u5t-plot-swap': 'n', 'u5t-plot-one-swap': 's', 'u5t-plot-one-sign': 's', 'u5t-plot-shift': 's', 'u5t-read-swap': 'n', 'u5t-read-point': 'n', 'u5t-dir-one': 's', 'u5t-dir': 'n',
    'u5t-var-swap': 'n', 'u5t-var-same': 'n', 'u5t-pat-extend': 'b', 'u5t-pat-nobase': 'n', 'u5t-pat-mult': 'n', 'u5t-pat-swap': 'n', 'u5t-pat-off1': 'b', 'u5t-pat-step': 'b', 'u5t-miss-step': 'b',
    'u5t-int-other': 'n', 'u5t-int-flip': 'b', 'u5t-int-off': 'n', 'u5t-ev-no-b': 's', 'u5t-ev-add': 'n', 'u5t-ev-instead': 'n', 'u5t-rate-rise': 'b', 'u5t-rate-seg': 'n',
    'u5t-flat-one': 'b', 'u5t-flat-count': 'n', 'u5t-flat-other': 'n', 'u5t-vlt-one': 's', 'u5t-vlt': 'n', 'u5t-fn-output': 'n', 'u5t-fn-said-fn': 'n', 'u5t-fn-said-not': 'n',
    'u5t-mean-one': 'b', 'u5t-mean': 'n', 'u5t-ex-fn': 'n', 'u5t-ex-dom': 'b', 'u5t-ex-range': 'b', 'u5t-ex-count': 's', 'u5t-fn-impossible': 'n', 'u5t-said-none': 'n', 'u5t-ex-notfn': 'n',
    'u5t-ctx-noend': 'b', 'u5t-ctx-all': 'n', 'u5t-ctx-start': 'b', 'u5t-ctx-end': 'n', 'u5t-io-swap': 'n', 'u5t-stmt-input': 'n', 'u5t-fee': 'b', 'u5t-err-kept': 'n', 'u5t-arrow-one': 's', 'u5t-arrows': 'n'
  });
  /* labels for shared codes this file uses (their partial-credit decisions are already in js/partial.js); kept if another file set them */
  (function (o) { Object.keys(o).forEach(function (k) { if (!HW.CODES[k]) { var x = {}; x[k] = o[k]; HW.addCodes(x); } }); })({
    'value': 'Wrong value', 'rate-sign': 'Rate of change with the wrong sign', 'rate-flip': 'Rate of change upside down (run ÷ rise)',
    'fn-solve-sign': 'Sign slip solving', 'fn-solve-inverse': 'Inverse-operation slip (added instead of subtracted)', 'fn-solve-divide': 'Didn’t divide by the coefficient'
  });

  /* ================= general helpers (as in the 10C Unit 5 Test) ================= */
  function find(gen, test, fallback) { for (var i = 0; i < 1500; i++) { var v = gen(); if (v != null && test(v)) return v; } return fallback; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nz(a, b) { return range(a, b).filter(function (x) { return x !== 0; }); }
  function cl(x) { return Math.round(x * 1e6) / 1e6; }
  function nT(x) { return String(cl(x)); }
  function same(a, b) { return Math.abs(a - b) < 1e-9; }
  function uniq(a) { var s = a.slice().sort(function (x, y) { return x - y; }); return s.filter(function (x, i) { return i === 0 || Math.abs(x - s[i - 1]) > 1e-9; }); }
  function pT(p) { return '(' + nT(p[0]) + ',\\ ' + nT(p[1]) + ')'; }
  function pK(p) { return '(' + nT(p[0]) + ', ' + nT(p[1]) + ')'; }
  function psT(ps) { return ps.map(pT).join(',\\ '); }
  function setT(ps) { return '\\{' + psT(ps) + '\\}'; }
  function psH(ps) { return ps.map(function (p) { return '<span class="nw">' + t(pT(p)) + '</span>'; }).join(', '); }
  function andT(a) { var s = a.map(function (x) { return t(nT(x)); }); return s.length < 2 ? s.join('') : s.slice(0, -1).join(', ') + ' and ' + s[s.length - 1]; }
  function money(x) { x = cl(x); return Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : x.toFixed(2); }
  function lin(m, b, v) { // m·v + b, written normally
    v = v || 'x'; var s = m === 0 ? '' : (m === 1 ? '' : m === -1 ? '-' : nT(m)) + v;
    if (b) s += (s ? (b > 0 ? '+' : '-') + nT(Math.abs(b)) : nT(b));
    return s || '0';
  }
  function linB(b, m, v) { // b + m·v (constant first, as in 7 − 2x)
    v = v || 'x'; var mm = Math.abs(m), term = (mm === 1 ? '' : nT(mm)) + v;
    return nT(b) + (m < 0 ? '-' : '+') + term;
  }
  function sg(x) { return x < 0 ? '(' + nT(x) + ')' : nT(x); }
  function bank(items, cols) {
    return '<div style="display:grid;grid-template-columns:repeat(' + (cols || 2) + ',minmax(0,1fr));gap:4px 14px;margin:6px 0">' + items.map(function (it) { return '<div><b>' + it.label + '</b>' + it.svg + '</div>'; }).join('') + '</div>';
  }
  function badRows(want, resp) { resp = resp || {}; return Object.keys(want).filter(function (k) { return resp[k] !== want[k]; }); }
  function gridPart(prompt, rows, cols, want, why, sol, hints, text, oneCode, manyCode) {
    var p = P.grid(prompt, rows, cols, want, { why: why }, sol, hints, text), base = p.check;
    p.check = function (resp) { var res = base(resp); if (res.v !== 'wrong') return res; return wrong(badRows(want, resp).length === 1 ? oneCode : manyCode, res.hint); };
    var other = function (id) { return cols.map(function (x) { return x.id; }).filter(function (c0) { return c0 !== want[id]; })[0]; };
    var one = {}; Object.keys(want).forEach(function (k) { one[k] = want[k]; }); var k0 = Object.keys(want)[0]; one[k0] = other(k0);
    var allW = {}; Object.keys(want).forEach(function (k) { allW[k] = other(k); });
    p.bad = [one, allW];
    return p;
  }
  function numDiag(cands, extra) {
    return function (v) {
      for (var i = 0; i < cands.length; i++) { var c = cands[i]; if (c.v != null && isFinite(c.v) && same(v, c.v)) return { code: c.code, hint: c.hint }; }
      return extra ? extra(v) : null;
    };
  }
  function goodC(ans, cands) { var seen = []; return (cands || []).filter(function (c) { if (c.v == null || !isFinite(c.v) || same(c.v, ans) || seen.some(function (s) { return same(s, c.v); })) return false; seen.push(c.v); return true; }); }
  function numChk(ans, cands, extra) { return K.number(ans, numDiag(goodC(ans, cands), extra)); }
  function numPart(prompt, ans, cands, sol, hints, text, inp) {
    var cs = goodC(ans, cands);
    var p = P.number(prompt, ans, numDiag(cs), sol, hints, text, inp);
    p.key = nT(ans); p.answer = t((inp && inp.before ? String(inp.before).replace(/\\\(|\\\)/g, '') : '') + nT(ans)) + (inp && inp.after ? ' ' + inp.after : '');
    p.bad = cs.map(function (c) { return nT(c.v); });
    return p;
  }
  function parseNum(s) { var p = HW.parse.number(String(s == null ? '' : s).replace(/^\s*\\?\$/, '').trim()); return p.ok ? p.value : null; }

  /* ================= domain and range (as in Lessons 5–6) ================= */
  function cond(v, lo, hi, lc, hc) {
    lc = lc !== false; hc = hc !== false;
    if (lo == null && hi == null) return '';
    if (lo == null) return v + (hc ? '\\le ' : '<') + hi;
    if (hi == null) return v + (lc ? '\\ge ' : '>') + lo;
    return lo + (lc ? '\\le ' : '<') + v + (hc ? '\\le ' : '<') + hi;
  }
  function bld(v, lo, hi, lc, hc) { var c = cond(v, lo, hi, lc, hc); return '\\{' + v + '\\mid ' + (c ? c + ',\\ ' : '') + v + '\\in\\mathbb{R}\\}'; }
  function lst(a) { return '\\{' + uniq(a).map(nT).join(', ') + '\\}'; }
  function alts(tex) { // other ways to write the same interval set (accepted too)
    var p = S.parse(tex); if (!p.ok || p.set.kind !== 'int' || p.set.parts.length !== 1) return [];
    var q = p.set.parts[0], n = function (x) { return x === Infinity ? '\\infty' : x === -Infinity ? '-\\infty' : String(x); };
    return [(q.lc ? '[' : '(') + n(q.lo) + ', ' + n(q.hi) + (q.hc ? ']' : ')'), S.tex(p.set, p.v || 'x')];
  }
  function listRaw(resp) {
    var s = String(resp || '').replace(/\\(left|right)\.?/g, '').replace(/\\lbrace|\\\{/g, '{').replace(/\\rbrace|\\\}/g, '}');
    s = s.replace(/^\s*(\\text\{)?\s*(domain|range)\s*\}?\s*[:=]?\s*/i, '').replace(/^\s*[DR]\s*[:=]\s*/, '');
    var m = /^\s*\{([^{}]*)\}\s*$/.exec(s); if (!m || /\\mid|\||:|\\vert/.test(m[1])) return null;
    var out = [], ps = m[1].split(/[,;]/);
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i].replace(/\\[,;: ]/g, '').trim(); if (!p) return null;
      var q = ex.parse(p); if (!q.ok) return null; var v = ex.value(q.ast); if (!isFinite(v)) return null; out.push(v);
    }
    return out;
  }
  /* K.set with Math 15's rules: any order in a list, but each value once; "x ∈ ℝ" not required */
  function setChk(target, o) {
    o = o || {};
    var T = S.parse(target).set;
    var wr = (o.wrong || []).filter(function (w) { var p = S.parse(w.is); return p.ok && !S.eq(p.set, T); });
    var base = K.set(target, { v: o.v, other: o.other, otherName: o.otherName, wrong: wr, tag: false });
    return function (resp) {
      var r = base(resp);
      if (r.v === 'correct') {
        var L = listRaw(resp);
        if (L && L.length > 1 && L.some(function (x, i) { return L.some(function (y, j) { return j < i && same(x, y); }); })) return form('set-repeat', 'Right values — but write each value <b>only once</b> in a list, even when it appears in several points.');
        return r;
      }
      if (r.v === 'wrong' && o.ctx && o.ctx[r.code]) return wrong(r.code, o.ctx[r.code]);
      return r;
    };
  }
  /* one part, two boxes: Domain and Range. o: dv, rv, dW / rW (wrong sets), dC / rC (hints for built-in codes), bad, ph */
  function drPart(prompt, D, R, o, sol, hints, text) {
    o = o || {}; var dv = o.dv || 'x', rv = o.rv || 'y';
    var cD = setChk(D, { v: dv, other: R, otherName: 'range', wrong: o.dW, ctx: o.dC }), cR = setChk(R, { v: rv, other: D, otherName: 'domain', wrong: o.rW, ctx: o.rC });
    var vars = [dv, rv].filter(function (v, i, a) { return a.indexOf(v) === i; });
    var phD = o.list ? 'e.g. {1, 3, 5}' : 'e.g. -2 <= ' + dv + ' <= 5', phR = o.list ? 'e.g. {1, 3, 5}' : 'e.g. -2 <= ' + rv + ' <= 5';
    var fl = [{ label: 'Domain:', name: 'Domain', mode: 'math', keys: 'set', vars: vars, placeholder: phD }, { label: 'Range:', name: 'Range', mode: 'math', keys: 'set', vars: vars, placeholder: phR }];
    var p = P.fields(prompt, fl, [cD, cR], [D, R], 'Domain: ' + t(D) + '<br>Range: ' + t(R), sol, hints, text);
    var aD = alts(D), aR = alts(R);
    p.good = aD.length && aR.length ? [[aD[0], aR[0]], [aD[1], aR[1]]] : [];
    var Dp = S.parse(D).set, Rp = S.parse(R).set, bad = [];
    if (!S.eq(Dp, Rp)) bad.push([R, D]);
    (o.dW || []).forEach(function (w) { var q = S.parse(w.is); if (q.ok && !S.eq(q.set, Dp)) bad.push([w.is, R]); });
    (o.rW || []).forEach(function (w) { var q = S.parse(w.is); if (q.ok && !S.eq(q.set, Rp)) bad.push([D, w.is]); });
    p.bad = bad.concat(o.bad || []);
    return p;
  }
  var HINT_D = 'The <b>domain</b> is every ' + t('x') + '-value the relation uses (look left to right); the <b>range</b> is every ' + t('y') + '-value it produces (look bottom to top).';
  var HINT_LIST = 'Separate values are written as a <b>list</b> in braces, each value once, e.g. ' + t('\\{-2, 1, 5\\}') + '.';

  /* ================= relations (as in Lessons 3 and 8) ================= */
  function info(pairs) {
    var by = {}, order = [], outBy = {}, oorder = [];
    pairs.forEach(function (p) {
      var k = nT(p[0]); if (!by[k]) { by[k] = { x: p[0], ys: [] }; order.push(k); } if (!by[k].ys.some(function (y) { return same(y, p[1]); })) by[k].ys.push(p[1]);
      var o = nT(p[1]); if (!outBy[o]) { outBy[o] = { y: p[1], xs: [] }; oorder.push(o); } if (!outBy[o].xs.some(function (x) { return same(x, p[0]); })) outBy[o].xs.push(p[0]);
    });
    var breakers = order.map(function (k) { return by[k]; }).filter(function (e) { return e.ys.length > 1; });
    var shared = oorder.map(function (k) { return outBy[k]; }).filter(function (e) { return e.xs.length > 1; });
    return { isFn: !breakers.length, breakers: breakers, shared: shared, xs: order.map(function (k) { return by[k].x; }), ys: oorder.map(function (k) { return outBy[k].y; }) };
  }
  function shuffleApart(r, pairs) {
    for (var i = 0; i < 80; i++) { var s = r.shuffle(pairs), bad = false; for (var j = 1; j < s.length; j++) if (same(s[j][0], s[j - 1][0])) bad = true; if (!bad) return s; }
    return pairs.slice();
  }
  function htab(pairs, vx, vy) { return HW.valueTable([[t(vx || 'x')].concat(pairs.map(function (p) { return t(nT(p[0])); })), [t(vy || 'y')].concat(pairs.map(function (p) { return t(nT(p[1])); }))]); }
  function readPairs(resp) {
    var s = String(resp || '').replace(/\\(left|right)\.?/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\lbrace|\\rbrace|\\\{|\\\}|[{}]/g, ' ').replace(/\\[,;: ]/g, ' ');
    if (!s.trim()) return { empty: true };
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) {
      var xy = m[1].split(','); if (xy.length !== 2) return { bad: true };
      var a = ex.parse(xy[0].trim()), b = ex.parse(xy[1].trim()); if (!a.ok || !b.ok) return { bad: true };
      out.push([ex.value(a.ast), ex.value(b.ast)]);
    }
    if (s.replace(re, '').replace(/[,\s]/g, '').length || !out.length) return { bad: true };
    var seen = {}, u = []; out.forEach(function (p) { var k = nT(p[0]) + '|' + nT(p[1]); if (!seen[k]) { seen[k] = 1; u.push(p); } });
    return { pairs: u };
  }
  function isNoneS(s) { var z = String(s == null ? '' : s).replace(/\\text\{\s*([^}]*)\}|\\mathrm\{\s*([^}]*)\}/g, '$1$2').replace(/\s+/g, '').toLowerCase(); return /^(none|no|nofunction|impossible|notpossible|dne|n\/a|∅|\\emptyset|\\varnothing)$/.test(z); }
  function setEqA(a, b) { var A = uniq(a), B = uniq(b); return A.length === B.length && A.every(function (x, i) { return same(x, B[i]); }); }

  /* ================= drawing helpers ================= */
  var INK = '#2b3340';
  function G(spec) { return HW.graph(Object.assign({ x: [-6, 6], y: [-6, 6], labels: 1, max: 330 }, spec)); }
  var EDGE = 5.4;
  function toEdge(p, d, w) {
    w = w || EDGE; var k = Infinity;
    if (d[0] > 0) k = Math.min(k, (w - p[0]) / d[0]); if (d[0] < 0) k = Math.min(k, (-w - p[0]) / d[0]);
    if (d[1] > 0) k = Math.min(k, (w - p[1]) / d[1]); if (d[1] < 0) k = Math.min(k, (-w - p[1]) / d[1]);
    return [cl(p[0] + k * d[0]), cl(p[1] + k * d[1])];
  }
  function lineThrough(p, m) { return [toEdge(p, [-1, -m]), toEdge(p, [1, m])]; }
  function ell(h, k, a, b) { var o = []; for (var i = 0; i <= 120; i++) { var th = 2 * Math.PI * i / 120; o.push([h + a * Math.cos(th), k + b * Math.sin(th)]); } return o; }
  function poly(pts) { return { pts: [], pieces: [{ v: pts, s: 'none', e: 'none' }], join: 'none' }; }
  function gv(pts) { return { pts: pts || [], pieces: [], join: 'none' }; }
  function labelPts(svg, pts, labs, off) { // letters beside points of the graph just drawn
    var Lt = HW.graph.last, txt = '';
    pts.forEach(function (p, i) { if (!labs[i]) return; var o = off ? off(i) : [0, -11]; txt += '<text x="' + (Lt.X(p[0]) + o[0]).toFixed(1) + '" y="' + (Lt.Y(p[1]) + o[1]).toFixed(1) + '" font-size="13" font-weight="700" font-style="italic" text-anchor="middle" fill="' + INK + '" stroke="#fff" stroke-width="3" paint-order="stroke">' + labs[i] + '</text>'; });
    return svg.replace('</svg>', txt + '</svg>');
  }
  /* the same point set is always right (K.graphExact tests "joined or not" before it tests equality) */
  function exactChk(target, opt) { var base = K.graphExact(target, opt); return function (resp) { if (!DR.empty(resp) && DR.same(resp, target)) return ok(); return base(resp); }; }
  /* wrong plots: all swapped, one swapped, one sign slip */
  function plotWrongs(pts, names) {
    var wr = [{ is: gv(pts.map(function (p) { return [p[1], p[0]]; })), code: 'u5t-plot-swap', hint: 'Every point is plotted as ' + t('(y,\\ x)') + '. In ' + t('(x,\\ y)') + ' go <b>across</b> to ' + t('x') + ' first, then <b>up or down</b> to ' + t('y') + '.' }];
    pts.forEach(function (p, i) {
      var nm = names ? 'Point ' + t(names[i]) : t(pT(p));
      var sw = pts.map(function (z, j) { return j === i ? [z[1], z[0]] : z.slice(); }), sgn = pts.map(function (z, j) { return j === i ? (z[0] !== 0 ? [-z[0], z[1]] : [z[0], -z[1]]) : z.slice(); });
      wr.push({ is: gv(sw), code: 'u5t-plot-one-swap', hint: nm + ' is plotted at ' + t(pT([p[1], p[0]])) + ' — its coordinates the other way round. Across first (' + t('x=' + p[0]) + '), then up or down (' + t('y=' + p[1]) + ').' });
      wr.push({ is: gv(sgn), code: 'u5t-plot-one-sign', hint: 'Check the signs of ' + nm + ': a negative ' + t('x') + ' is left of the ' + t('y') + '-axis, a negative ' + t('y') + ' is below the ' + t('x') + '-axis.' });
    });
    return wr.filter(function (w) { return !DR.same(w.is, gv(pts)); });
  }
  function moveWords(p) {
    var a = p[0] === 0 ? 'stay on the ' + t('y') + '-axis' : 'go ' + Math.abs(p[0]) + ' ' + (p[0] > 0 ? 'right' : 'left'), b = p[1] === 0 ? 'stay on the ' + t('x') + '-axis' : Math.abs(p[1]) + ' ' + (p[1] > 0 ? 'up' : 'down');
    return a + ', then ' + b;
  }
  /* a sketch-style graph with no scale (story graphs) */
  function sketchSvg(segs, fns, yT, o) {
    o = o || {};
    return HW.graph({ x: [0, 10], y: o.y || [0, 6], grid: 0, labels: 0, firstQuadrant: !o.y, xName: ' ', yName: ' ', xTitle: 'Time', yTitle: yT, unit: o.unit || 15, segs: segs || [], fns: fns || [], max: o.max || 170, aria: o.aria || 'a sketch of a graph' });
  }

  /* ---------- story graphs (as in Lesson 11): runs of pieces going the same way are one stage ---------- */
  function groupsOf(value) {
    var g = [];
    DR.phases(value).phases.forEach(function (p) { var L = g[g.length - 1]; if (L && L.dir === p.dir) { L.segs.push(p); L.x1 = p.x1; L.y1 = p.y1; } else g.push({ dir: p.dir, segs: [p], x0: p.x0, x1: p.x1, y0: p.y0, y1: p.y1 }); });
    return g;
  }
  function simple(Gs) { var v = [[Gs[0].x0, Gs[0].y0]]; Gs.forEach(function (g) { v.push([g.x1, g.y1]); }); return poly(v); }
  function story(spec) {
    var base = K.graphStory(spec);
    return function (resp) {
      if (DR.empty(resp)) return base(resp);
      var ph = DR.phases(resp);
      if (ph.vertical || ph.gaps.length || DR.notFunction(resp)) return base(resp);
      if (!ph.phases.length) return wrong('story-lines', 'Draw the graph as a line: tap where it starts, then each corner in turn, and tap the last point again to finish.');
      var Gs = groupsOf(resp);
      if (spec.prep) Gs = spec.prep(Gs);
      return base(simple(Gs));
    };
  }

  /* ================= function notation helpers (as in Lesson 10) ================= */
  var EQK = 'u5teq', Wd = HW.widgets;
  if (Wd && Wd.KEYSETS && !Wd.KEYSETS[EQK]) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    Wd.KEYSETS[EQK] = function (opt) {
      var vs = (opt && opt.vars && opt.vars.length ? opt.vars : ['x', 'y']).slice(0, 6).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; });
      return [[dk(7), dk(8), dk(9), { label: '+', tex: '+', plain: '+' }, { label: '−', tex: '-', plain: '-' }, { label: '⌫', fn: 'del', title: 'Delete' }],
        [dk(4), dk(5), dk(6), { label: 'x<sup>2</sup>', tex: '^{2}', plain: '^2', title: 'Squared' }, { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, { label: 'clear', fn: 'clear' }],
        [dk(1), dk(2), dk(3), { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (out of a box)' }],
        [dk(0), { label: '.', tex: '.', plain: '.' }, { label: '=', tex: '=', plain: ' = ' }, { label: 'Check ↵', fn: 'enter', wide: true }], vs];
    };
    if (Wd.KEYHELP && !Wd.KEYHELP[EQK]) Wd.KEYHELP[EQK] = ['Type the whole equation with the <b>=</b> key. For function notation tap the letter, then <b>( )</b>, the input letter, and <b>▶</b> to step out, e.g. ' + HW.k('f(x)=2x-3') + '.', 'Type the whole equation, e.g. <code>f(x) = 2x - 3</code> or <code>y = 2x - 3</code>.'];
  }
  function clean(s) { return String(s == null ? '' : s).replace(/\\left|\\right/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\[,;:! ]|~/g, ' ').replace(/\\cdot/g, '\\times ').trim(); }
  function lhsInfo(L) {
    L = L.replace(/\s+/g, '');
    var m = /^([A-Za-z])\(([^()]*)\)$/.exec(L); if (m) return { kind: 'fn', name: m[1], arg: m[2] };
    if (/^[A-Za-z]$/.test(L)) return { kind: 'var', name: L };
    return { kind: 'other' };
  }
  function lettersOf(s) { var o = {}; String(s).replace(/(\\[a-zA-Z]+)|([a-zA-Z])/g, function (m, cmd, ch) { if (ch) o[ch] = 1; return m; }); return Object.keys(o); }
  function relabel(s, from, to) { return String(s).replace(/(\\[a-zA-Z]+)|(?<![a-zA-Z])([a-zA-Z])(?![a-zA-Z])/g, function (m, cmd, ch) { return cmd ? cmd : ch === from ? to : ch; }); }
  /* y = … → f(x) = … (mode 'fn'); checks the left side, then the rule */
  function convChk(o) {
    var v = o.v || 'x', out = o.out || 'y';
    var base = K.poly(o.T, { wrong: (o.wrong || []).filter(function (w) { return w && !PL.eq(w.is, o.T); }) });
    return function (resp) {
      var s = clean(resp);
      if (!s) return form('empty', 'Type the whole equation first.');
      var parts = s.split('='), want = t((o.name || 'f') + '(' + v + ')=\\ldots');
      if (parts.length === 1) return form('conv-no-eq', 'Write the whole <b>equation</b>, starting with ' + want + '.');
      if (parts.length > 2 || !parts[0].trim() || !parts[1].trim()) return form('unreadable', 'Write one equation, starting with ' + want + '.');
      var L = parts[0], R = parts[1], li = lhsInfo(L);
      if (li.kind === 'other') { var ri = lhsInfo(R); if (ri.kind !== 'other') { li = ri; R = L; } }
      if (li.kind === 'other') return form('conv-lhs', 'Start your equation with ' + want + '.');
      var rl = lettersOf(R).filter(function (c) { return c !== v; }), rr = base(R);
      if (rr.v !== 'correct' && rl.length === 1 && lettersOf(R).indexOf(v) < 0) { var alt = base(relabel(R, rl[0], v)); if (alt.v === 'correct') return wrong('conv-var', 'The input variable never changes when you convert: keep ' + t(v) + ' on the right side (you wrote ' + t(rl[0]) + ').'); }
      if (li.kind === 'var') return wrong('conv-still-y', t(li.name) + ' is an output variable, so this is still ' + t('x') + '-' + t('y') + ' notation. Replace ' + t(li.name) + ' with function notation: ' + want + '.');
      if (li.name === v) return form('conv-name', 'The function needs a name that isn’t the input letter, e.g. ' + t('f(' + v + ')') + '.');
      if (o.reqName && li.name !== o.name) return wrong('conv-name', 'The function is named ' + t(o.name) + ', so write ' + t(o.name + '(' + v + ')') + ', not ' + t(li.name + '(' + li.arg + ')') + '.');
      if (li.arg !== v) return wrong('conv-arg', 'The brackets hold the <b>input</b> variable, ' + t(v) + '. Write ' + t((o.reqName ? o.name : li.name) + '(' + v + ')') + ', not ' + t(li.name + '(' + li.arg + ')') + '.');
      return rr;
    };
  }

  /* ================= intercept points (as in Lesson 4) ================= */
  function pairList(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\\{|\\\}|\\lbrace|\\rbrace/g, ' ').trim();
    if (!s) return { empty: true };
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) {
      var xy = m[1].split(','); if (xy.length !== 2) return { bad: true };
      var a = ex.parse(xy[0].trim()), b = ex.parse(xy[1].trim()); if (!a.ok || !b.ok) return { bad: true };
      var va = ex.value(a.ast), vb = ex.value(b.ast); if (!isFinite(va) || !isFinite(vb)) return { bad: true };
      out.push([va, vb]);
    }
    if (s.replace(re, '').replace(/[,;\s]|\\[,;!: ]/g, '').length || !out.length) return { bad: true };
    return { pairs: out };
  }
  /* one intercept point: want = [x, y]; axis 'x' (want[1] = 0) or 'y'; other = the other intercept point */
  function intChk(want, axis, other, o) {
    o = o || {};
    var xn = o.xn || 'x', yn = o.yn || 'y', name = (axis === 'x' ? 'horizontal' : 'vertical') + ' intercept', keep = axis === 'x' ? 0 : 1, zero = 1 - keep;
    var sample = axis === 'x' ? t('(3,\\ 0)') : t('(0,\\ 3)'), onAx = t(axis === 'x' ? xn : yn) + '-axis';
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Type the intercept as an ordered pair, like ' + sample + '.');
      var L = pairList(s);
      if (L.bad || L.empty) {
        var v = parseNum(s.replace(/^[a-zA-Z]\s*=\s*/, ''));
        if (v != null && same(v, want[keep])) return form('int-value-not-point', 'Right value — now write the intercept as an ordered pair, like ' + sample + '.');
        if (v != null) return wrong('value', 'Write the intercept as an ordered pair, like ' + sample + ', and check the value where the graph meets the ' + onAx + '.');
        return form('int-unreadable', 'Write the point as an ordered pair in brackets, like ' + sample + '.');
      }
      if (L.pairs.length !== 1) return form('int-one', 'Type just one ordered pair here.');
      var A = L.pairs[0];
      if (same(A[0], want[0]) && same(A[1], want[1])) return ok();
      if (other && same(A[0], other[0]) && same(A[1], other[1])) return wrong('u5t-int-other', 'That is the other intercept. This box is for where the graph meets the ' + onAx + ' (there ' + t((axis === 'x' ? yn : xn) + '=0') + ').');
      if (same(A[zero], want[keep]) && same(A[keep], 0) && !same(want[keep], 0)) return wrong('u5t-int-flip', 'The coordinates are in the wrong order. On the ' + onAx + ' the ' + (axis === 'x' ? 'second' : 'first') + ' coordinate is ' + t('0') + ': the point looks like ' + (axis === 'x' ? t('(a,\\ 0)') : t('(0,\\ b)')) + '.');
      if (!same(A[zero], 0)) return wrong('u5t-int-off', t(pT(A)) + ' isn’t on the ' + onAx + ': every point there has ' + t((axis === 'x' ? yn : xn) + '=0') + '.');
      return wrong('value', o.valHint || 'Check where the graph meets the ' + onAx + '.');
    };
  }
  function interceptsPart(prompt, xi, yi, o) {
    o = o || {};
    var xp = [xi, 0], yp = [0, yi], xn = o.xn || 'x', yn = o.yn || 'y';
    var fields = [{ name: o.xLab || t(xn) + '-intercept', label: (o.xLab || t(xn) + '-intercept') + ':', mode: 'math', keys: 'pairs', wide: true, placeholder: 'e.g. (2, 0)' },
      { name: o.yLab || t(yn) + '-intercept', label: (o.yLab || t(yn) + '-intercept') + ':', mode: 'math', keys: 'pairs', wide: true, placeholder: 'e.g. (0, 3)' }];
    var p = P.fields(prompt, fields, [intChk(xp, 'x', yp, o), intChk(yp, 'y', xp, o)], [pK(xp), pK(yp)], (o.xLab || t(xn) + '-intercept') + ' ' + t(pT(xp)) + '; ' + (o.yLab || t(yn) + '-intercept') + ' ' + t(pT(yp)), o.sol, o.hints, o.text);
    p.bad = [[pK(yp), pK(xp)], [pK([0, xi]), pK(yp)], [String(xi), String(yi)]].filter(function (b) { return b.join() !== p.key.join(); });
    return p;
  }

  /* ================= RF2 · BEG — one relation, three forms (Lessons 1, 3, 6) ================= */
  function q1Shared(r) {
    return find(function () {
      var xs = r.sample(range(-5, 5), 4).sort(function (a, b) { return a - b; }), y3 = r.sample(range(-5, 5), 3), pat = r.pick([[0, 1, 0, 2], [0, 1, 2, 1], [0, 1, 2, 0], [0, 0, 1, 2], [0, 1, 1, 2]]);
      return { xs: xs, ys: pat.map(function (i) { return y3[i]; }) };
    }, function (s) {
      var ps = s.xs.map(function (x, i) { return [x, s.ys[i]]; }), q = {};
      ps.forEach(function (p) { if (p[0] && p[1]) q[(p[0] > 0 ? 'R' : 'L') + (p[1] > 0 ? 'U' : 'D')] = 1; });
      return s.xs.some(function (x) { return x < 0; }) && s.xs.some(function (x) { return x > 0; }) && s.ys.some(function (y) { return y < 0; }) && s.ys.some(function (y) { return y > 0; }) &&
        Object.keys(q).length >= 3 && !ps.some(function (p) { return p[0] === 0 && p[1] === 0; }) && ps.filter(function (p) { return p[0] === p[1]; }).length < 2;
    }, { xs: [-4, -1, 2, 5], ys: [3, -2, 3, -4] });
  }
  function q1Pairs(s) { return s.xs.map(function (x, i) { return [x, s.ys[i]]; }); }

  /* ================= RF1 · story graphs with labelled points (Lesson 11) ================= */
  var NAMES = ['Maya', 'Owen', 'Nia', 'Theo', 'Ravi', 'Lena', 'Kofi', 'Ana', 'Mateo', 'Zoe', 'Iris', 'Sam', 'Tariq', 'Hana', 'Jae', 'Amir'];
  var SHE = { Maya: 1, Nia: 1, Lena: 1, Ana: 1, Zoe: 1, Iris: 1, Hana: 1, Jae: 1 };
  var SIT2 = {
    walk: { xT: 'Time (min)', yT: 'Distance from home (m)', xn: 't', yn: 'd', xu: 'min', yu: 'm', starts: [0], dys: [200, 300, 400, 500], durs: [5, 10, 15], gx: 5, lx: 5, gy: 100, ly: 200, ymax: 1200, tmax: 50, floor: 0, home: true,
      pats: [['up', 'flat', 'up', 'down'], ['up', 'flat', 'down', 'flat'], ['up', 'up', 'flat', 'down']],
      intro: function (s) { return 'The graph shows ' + s.nm + '’s distance from home during a walk.'; },
      ask: function (s, tt) { return 'How far from home was ' + s.nm + ' after ' + t(tt) + ' minutes?'; } },
    oven: { xT: 'Time (min)', yT: 'Temperature (°C)', xn: 't', yn: 'T', xu: 'min', yu: '°C', starts: [20], dys: [60, 80, 100, 120, 140], durs: [5, 10, 15], gx: 5, lx: 5, gy: 20, ly: 40, ymax: 240, tmax: 50, floor: 20,
      pats: [['up', 'flat', 'down', 'flat'], ['flat', 'up', 'flat', 'down'], ['up', 'flat', 'up', 'flat'], ['up', 'up', 'flat', 'down']],
      intro: function () { return 'The graph shows the temperature inside an oven.'; },
      ask: function (s, tt) { return 'What was the temperature in the oven after ' + t(tt) + ' minutes?'; } },
    snow: { xT: 'Time (h)', yT: 'Snow depth (cm)', xn: 't', yn: 'd', xu: 'h', yu: 'cm', starts: [0, 2, 4], dys: [4, 6, 8, 10], durs: [2, 3, 4], gx: 1, lx: 2, gy: 2, ly: 2, ymax: 28, tmax: 16, floor: 0,
      pats: [['up', 'flat', 'up', 'down'], ['up', 'up', 'flat', 'down'], ['flat', 'up', 'flat', 'down']],
      intro: function () { return 'The graph shows the depth of the snow on a deck during a snowstorm and the sunny day after it.'; },
      ask: function (s, tt) { return 'How deep was the snow after ' + t(tt) + ' hours?'; } } };
  function sitGen(r, c, ratesOf) {
    return find(function () {
      var dirs = r.pick(c.pats), T = [0], Y = [r.pick(c.starts)], rates = [];
      for (var i = 0; i < 4; i++) {
        var d = r.pick(c.durs), y0 = Y[i], y1;
        if (dirs[i] === 'flat') { y1 = y0; rates.push(0); }
        else if (ratesOf) { var rt = r.pick(dirs[i] === 'up' ? c.up : c.dn); y1 = y0 + (dirs[i] === 'up' ? 1 : -1) * rt * d; rates.push(dirs[i] === 'up' ? rt : -rt); }
        else if (dirs[i] === 'up') y1 = y0 + r.pick(c.dys);
        else y1 = c.home ? 0 : y0 - r.pick(c.dys);
        T.push(T[i] + d); Y.push(y1);
      }
      return { dirs: dirs, T: T, Y: Y, rates: rates };
    }, function (s) {
      return s.Y.every(function (y) { return y >= c.floor && y <= c.ymax; }) && s.T[4] <= c.tmax && s.dirs.every(function (d, i) { return d === 'flat' || !same(s.Y[i], s.Y[i + 1]); }) &&
        (!ratesOf || s.rates.every(function (x, i) { return s.dirs[i] === 'flat' || x !== 0; }));
    }, null);
  }
  function sitFig(c, s, labs) {
    var X = Math.ceil((s.T[4] + c.gx) / c.lx) * c.lx, Y = Math.ceil((Math.max.apply(null, s.Y) + c.gy) / c.ly) * c.ly, pts = s.T.map(function (x, i) { return [x, s.Y[i]]; });
    var svg = HW.graph({ x: [0, X], y: [0, Y], grid: c.gx, gridY: c.gy, labels: c.lx, labelsX: c.lx, labelsY: c.ly, firstQuadrant: true, unitX: 330 / X, unitY: 200 / Y, xName: c.xn, yName: c.yn,
      xTitle: c.xT, yTitle: c.yT, segs: [{ pts: pts }], points: pts.map(function (p) { return { x: p[0], y: p[1] }; }), max: 430, aria: 'a graph made of four straight pieces, with labelled points' });
    var Lt = HW.graph.last;
    return labelPts(svg, pts, labs, function (i) { // away from the neighbouring pieces (screen coordinates)
      var P0 = [Lt.X(pts[i][0]), Lt.Y(pts[i][1])], vx = 0, vy = 0;
      [i - 1, i + 1].forEach(function (j) { if (j < 0 || j > 4) return; var dx = Lt.X(pts[j][0]) - P0[0], dy = Lt.Y(pts[j][1]) - P0[1], L = Math.hypot(dx, dy) || 1; vx += dx / L; vy += dy / L; });
      if (i === 0) return Lt.Y(pts[1][1]) < P0[1] ? [12, 13] : [12, -8]; // first point sits on the vertical axis: label to its right
      if (i === 4) { var px = vy, py = -vx; if (py > 0) { px = -px; py = -py; } if (Math.abs(py) < 0.3) { px = 0; py = -1; } vx = -px; vy = -py; } // ends: beside the piece, above it
      var L2 = Math.hypot(vx, vy); if (L2 < 0.2) { vx = 0; vy = 1; L2 = 1; }
      return [-vx / L2 * 13, -vy / L2 * 13 + 4];
    });
  }
  var SIT8 = {
    barrel: { xT: 'Time (days)', yT: 'Water (L)', xn: 't', yn: 'V', xu: 'days', x1: 'day', yu: 'L', rateU: 'L per day', starts: [5, 10, 15], durs: [1, 2, 3], up: [5, 10], dn: [5, 10], gx: 1, lx: 1, gy: 5, ly: 5, ymax: 45, tmax: 11, floor: 0,
      intro: 'The graph shows the amount of water, in litres, in a rain barrel over several days.', flatQ: 'For how many days, in total, did the amount of water stay constant?', flatU: 'days', cause: { up: 'it rains', dn: 'water is used' } },
    tank: { xT: 'Time (min)', yT: 'Water (L)', xn: 't', yn: 'V', xu: 'min', x1: 'minute', yu: 'L', rateU: 'L per minute', starts: [0, 20, 40], durs: [2, 4, 5], up: [10, 20], dn: [10, 20], gx: 1, lx: 2, gy: 10, ly: 20, ymax: 200, tmax: 20, floor: 0,
      intro: 'The graph shows the amount of water, in litres, in a tank over time.', flatQ: 'For how many minutes, in total, did the amount of water stay constant?', flatU: 'min', cause: { up: 'it is being filled', dn: 'it is draining' } },
    hike: { xT: 'Distance (km)', yT: 'Elevation (m)', xn: 'd', yn: 'E', xu: 'km', x1: 'km', yu: 'm', rateU: 'm per km', starts: [100, 200, 300], durs: [1, 2, 3], up: [100, 150, 200], dn: [100, 150, 200], gx: 1, lx: 1, gy: 50, ly: 100, ymax: 1000, tmax: 11, floor: 0,
      intro: 'The graph shows the elevation of a hiking trail, in metres, against the distance walked along it, in kilometres.', flatQ: 'For how many kilometres, in total, was the trail level (elevation constant)?', flatU: 'km', cause: { up: 'the trail climbs', dn: 'the trail goes down' } } };
  SIT8.barrel.pats = SIT8.tank.pats = SIT8.hike.pats = [['flat', 'up', 'flat', 'down'], ['up', 'flat', 'down', 'flat'], ['flat', 'up', 'down', 'flat'], ['up', 'flat', 'up', 'down'], ['up', 'down', 'flat', 'up']];

  /* ================= RF1 · PRG — match a story to its graph (Lesson 11) ================= */
  var SHAPES = {
    gentleFlatSteep: { segs: [{ pts: [[0, 0], [4, 2], [6, 2], [8.5, 5.2]] }] },
    steepFlatGentle: { segs: [{ pts: [[0, 0], [2.5, 3.2], [4.5, 3.2], [9, 5.2]] }] },
    upFlatDown: { segs: [{ pts: [[0, 0], [3.5, 3.5], [5.5, 3.5], [9, 0]] }] },
    gentleSteep: { segs: [{ pts: [[0, 0], [4.5, 2], [8.5, 5.2]] }] },
    sameFlatSame: { segs: [{ pts: [[0, 0], [3, 2.4], [5.5, 2.4], [8.5, 4.8]] }] },
    straightDown: { segs: [{ pts: [[0, 5.2], [9, 0.8]] }] },
    straightUp: { segs: [{ pts: [[0, 0.8], [9, 5.2]] }] },
    coolCurve: { fns: [{ f: function (x) { return 1 + 4.2 * Math.exp(-0.45 * x); }, from: 0, to: 9.4 }] },
    fallFaster: { fns: [{ f: function (x) { return 5.2 - 4.4 * Math.pow(x / 9.4, 2.2); }, from: 0, to: 9.4 }] },
    warmCurve: { fns: [{ f: function (x) { return 5.2 - 4.4 * Math.exp(-0.45 * x); }, from: 0, to: 9.4 }] },
    riseFaster: { fns: [{ f: function (x) { return 0.8 + 4.4 * Math.pow(x / 9.4, 2.2); }, from: 0, to: 9.4 }] },
    upThenFlat: { segs: [{ pts: [[0, 0], [3.5, 4], [9.4, 4]] }] },
    flatThenUp: { segs: [{ pts: [[0, 0], [4, 0], [9, 4.5]] }] },
    flatHigh: { segs: [{ pts: [[0, 4], [9.4, 4]] }] },
    upDown: { segs: [{ pts: [[0, 0], [4.5, 4.5], [9, 0]] }] }
  };
  var STORIES = [
    { y: 'Distance from home', s: function (n, he) { return n + ' leaves home and walks at a steady pace toward school. Partway there, ' + he + ' stops at a corner to talk to a friend for a few minutes. Then ' + he + ' jogs the rest of the way, faster than ' + he + ' walked.'; },
      right: 'gentleFlatSteep', why: 'Gentle rise (walking), flat (stopped), then a <b>steeper</b> rise (jogging is faster).',
      wrong: [['steepFlatGentle', 'This one is steeper at the start: it would mean moving <b>faster</b> first and slower after the stop.'], ['upFlatDown', 'This one falls at the end: that means going back <b>toward home</b>.'], ['gentleSteep', 'There is no flat piece: the stop at the corner is missing.']] },
    { y: 'Distance from home', s: function (n, he) { return n + ' bikes to the park at a steady pace. Partway there, ' + he + ' stops completely to fix the bike chain. Once it is fixed, ' + he + ' bikes the rest of the way at the same speed as before.'; },
      right: 'sameFlatSame', why: 'Rise, flat (stopped), then a rise with the <b>same steepness</b> as the first (same speed).',
      wrong: [['gentleFlatSteep', 'The last piece is steeper than the first: that means riding <b>faster</b> after the stop.'], ['upFlatDown', 'This one falls at the end: that means riding back <b>toward home</b>.'], ['gentleSteep', 'There is no flat piece: the stop to fix the chain is missing.']] },
    { y: 'Temperature', s: function () { return 'A mug of hot cocoa is left on a table. It cools quickly at first, then more and more slowly as it gets close to room temperature.'; },
      right: 'coolCurve', why: 'Falling, steep at first and then flatter and flatter (levelling off near room temperature).',
      wrong: [['straightDown', 'A straight line cools at the <b>same</b> rate the whole time. The story says quickly at first, then slowly.'], ['fallFaster', 'This one gets <b>steeper</b>: it cools slowly at first, then faster and faster.'], ['warmCurve', 'This one rises: the temperature would be going <b>up</b>.']] },
    { y: 'Temperature', s: function () { return 'A car is parked in the sun on a hot day. The temperature inside rises quickly at first, then more and more slowly, levelling off.'; },
      right: 'warmCurve', why: 'Rising, steep at first and then flatter and flatter (levelling off).',
      wrong: [['straightUp', 'A straight line rises at the <b>same</b> rate the whole time. The story says quickly at first, then slowly.'], ['riseFaster', 'This one gets <b>steeper</b>: it would warm slowly at first, then faster and faster.'], ['coolCurve', 'This one falls: the temperature would be going <b>down</b>.']] },
    { y: 'Speed', s: function (n, he) { return n + ' starts from a complete stop, speeds up steadily, and then travels at a constant speed.'; },
      right: 'upThenFlat', why: 'Starts at a speed of 0, rises (speeding up), then flat (constant speed).',
      wrong: [['flatThenUp', 'This one is flat at 0 first: that means waiting before speeding up, and it never reaches a constant speed.'], ['flatHigh', 'This one never starts at 0: it shows a constant speed the whole time, with no start from a stop.'], ['upDown', 'This one falls at the end: that means slowing down again.']] }
  ];

  /* ================= RF1 · MAS — a sketch that can't be right (Lesson 11 #10) ================= */
  var BADSK = [
    { id: 'back', y: [0, 6], segs: [{ pts: [[0, 1], [3, 2], [5.5, 3], [7, 4.2], [6.2, 5.2], [4.5, 5.4]] }], what: 'the graph turns back to the left',
      right: 'Part of the graph goes back to the left, so at some times it shows two distances at once — but at each moment he is only one distance from the door.',
      wrong: [['The graph is curved. A distance–time graph must be made of straight pieces.', 'Curves are fine: speeding up or slowing down gives a curve. The problem is that the graph goes back in time.'],
        ['The distance keeps increasing. He must come back to the door at some point, so the graph has to come down again.', 'Nothing says he comes back during this part of the day. The problem is that one time has two distances.'],
        ['The graph does not start at 0, so he did not start at the door.', 'He can start some distance from the door. The problem is that the graph goes back in time.']] },
    { id: 'vertical', y: [0, 6], segs: [{ pts: [[0, 1.2], [3.5, 1.2], [3.5, 4.4], [8, 4.4], [9.4, 3]] }], what: 'part of the graph is a vertical line',
      right: 'The vertical piece means that at one moment he is at every distance between the two values at once — no one can move without time passing.',
      wrong: [['The flat pieces are impossible: a person is always moving during a school day.', 'Flat pieces are fine: they mean he stays in one place for a while.'],
        ['The graph comes down at the end, but a distance can only go up.', 'A distance can go down: that means coming back toward the door.'],
        ['The graph does not start at 0, so he did not start at the door.', 'He can start some distance from the door. The problem is the vertical piece: one time with many distances.']] },
    { id: 'negative', y: [-2, 5], segs: [{ pts: [[0, 3], [3, 3], [5.5, -1.4], [7.5, -1.4], [9.4, 2]] }], what: 'part of the graph is below the time axis',
      right: 'Part of the graph is below the time axis, so it shows a negative distance from the door — a distance can never be less than 0.',
      wrong: [['The graph goes down and then up again, so it fails the vertical line test.', 'Going down and up again is fine: every vertical line still crosses the graph only once.'],
        ['The flat pieces are impossible: a person is always moving during a school day.', 'Flat pieces are fine: they mean he stays in one place for a while.'],
        ['The graph should start at 0, since everyone starts at the door.', 'He can start some distance from the door. The problem is the part below the time axis.']] }
  ];

  /* ================= RF2 · vertical line test (Lesson 8) ================= */
  function vltGraph(r, isFn) {
    var u = r.int(0, 4);
    if (isFn) {
      if (u === 0) { var m = r.pick([-2, -1, -0.5, 0.5, 1, 2]), b = r.int(-2, 2); return { spec: { fns: [{ f: function (x) { return m * x + b; }, from: -4.8, to: 4.8, start: 'arrow', end: 'arrow' }] }, fn: true, why: 'a slanted line: every vertical line crosses it exactly once' }; }
      if (u === 1) { var h = r.int(-1, 1), k = r.int(-3, 1), a = r.pick([0.5, 1]); return { spec: { fns: [{ f: function (x) { return k + a * (x - h) * (x - h); }, from: -4.8, to: 4.8, start: 'arrow', end: 'arrow' }] }, fn: true, why: 'a parabola opening up: every vertical line crosses it at most once (a horizontal line crossing twice doesn’t matter)' }; }
      if (u === 2) { var h2 = r.int(-1, 1), k2 = r.int(1, 3), a2 = r.pick([0.5, 1]); return { spec: { fns: [{ f: function (x) { return k2 - a2 * (x - h2) * (x - h2); }, from: -4.8, to: 4.8, start: 'arrow', end: 'arrow' }] }, fn: true, why: 'a parabola opening down: every vertical line crosses it at most once' }; }
      if (u === 3) { var c = r.pick([-3, -2, 2, 3]); return { spec: { segs: [{ pts: [[-4.8, c], [4.8, c]], start: 'arrow', end: 'arrow' }] }, fn: true, why: 'a horizontal line: every vertical line crosses it once (every input has the output ' + t(c) + ')' }; }
      var k3 = r.int(-1, 1); return { spec: { fns: [{ f: function (x) { return k3 + 0.3 * x * x * x - 0.9 * x; }, from: -2.4, to: 2.4, start: 'arrow', end: 'arrow' }] }, fn: true, why: 'a curve that goes up, down and up again, but always moves to the right: every vertical line crosses it once' };
    }
    if (u === 0) { var h0 = r.int(-1, 1), k0 = r.int(-1, 1), R0 = r.pick([2, 2.5, 3]); return { spec: { segs: [{ pts: ell(h0, k0, R0, R0) }] }, fn: false, why: 'a circle: the vertical line ' + t('x=' + h0) + ' crosses it twice' }; }
    if (u === 1) { var hh = r.int(-3, -1), kk = r.int(-1, 1), aa = r.pick([0.4, 0.5]), pts = []; for (var i = 0; i <= 60; i++) { var y = kk - 3 + 6 * i / 60; pts.push([hh + aa * (y - kk) * (y - kk) * 1.6, y]); } return { spec: { segs: [{ pts: pts, start: 'arrow', end: 'arrow' }] }, fn: false, why: 'a sideways parabola: a vertical line to the right of its vertex crosses it twice' }; }
    if (u === 2) { var c4 = r.pick([-3, -2, 1, 2, 3]); return { spec: { segs: [{ pts: [[c4, -4.8], [c4, 4.8]], start: 'arrow', end: 'arrow' }] }, fn: false, why: 'a vertical line: the input ' + t(c4) + ' has every ' + t('y') + ' as an output' }; }
    if (u === 3) { var he = r.int(-1, 1), ke = r.int(-1, 1); return { spec: { segs: [{ pts: ell(he, ke, 3.2, 1.6) }] }, fn: false, why: 'an oval: the vertical line ' + t('x=' + he) + ' crosses it twice' }; }
    var hv = r.int(-2, 0), kv = r.int(-1, 1); return { spec: { segs: [{ pts: [[hv + 3.5, kv + 3.5], [hv, kv], [hv + 3.5, kv - 3.5]], start: 'arrow', end: 'arrow' }] }, fn: false, why: 'a sideways V: a vertical line to the right of its corner crosses it twice' };
  }
  function vltSmall(spec) { return HW.graph(Object.assign({ x: [-5, 5], y: [-5, 5], labels: 0, grid: 1, max: 165, aria: 'graph of a relation' }, spec)); }

  /* ================= RF4 · tile patterns (Lesson 2) ================= */
  function tileSvg(c, d, nmax) {
    var u = 20, gap = 30, x = 8, figs = '', H = Math.max(c, d) * u + 34, bottom = H - 26;
    for (var n = 1; n <= nmax; n++) {
      var w = ((c ? 1 : 0) + n) * u, slot = Math.max(w, 64), x0 = x + (slot - w) / 2, xx = x0, s = '';
      for (var i = 0; i < c; i++) s += '<rect x="' + xx + '" y="' + (bottom - (i + 1) * u) + '" width="' + u + '" height="' + u + '" fill="#d9dde3" stroke="' + INK + '" stroke-width="1.2"/>';
      if (c) xx += u;
      for (var k = 0; k < n; k++) { for (var j = 0; j < d; j++) s += '<rect x="' + xx + '" y="' + (bottom - (j + 1) * u) + '" width="' + u + '" height="' + u + '" fill="#c9d7f0" stroke="' + INK + '" stroke-width="1.2"/>'; xx += u; }
      figs += s + '<text x="' + (x + slot / 2) + '" y="' + (H - 7) + '" font-size="13" text-anchor="middle" fill="' + INK + '">Figure ' + n + '</text>';
      x += slot + gap;
    }
    var W = x - gap + 8;
    return '<svg class="fig-svg" viewBox="0 0 ' + W + ' ' + H + '" style="max-width:' + W + 'px" role="img" aria-label="Figures 1 to ' + nmax + ' of a tile pattern"><rect width="100%" height="100%" fill="#fff"/>' + figs + '</svg>';
  }
  var PAT11 = [
    { what: 'A display of cans is built in rows', unit: 'cans', fig: 'Row', L: 'C' },
    { what: 'Chairs are set up in groups for an assembly', unit: 'chairs', fig: 'Figure', L: 'C' },
    { what: 'A pattern is built from bricks', unit: 'bricks', fig: 'Figure', L: 'B' },
    { what: 'Coins are stacked in piles', unit: 'coins', fig: 'Pile', L: 'C' },
    { what: 'A fence is built from boards', unit: 'boards', fig: 'Section', L: 'B' }];

  /* ================= RF5 · context intercepts (Lesson 4) ================= */
  var INT12 = {
    card: { xn: 't', yn: 'B', xT: 't (weeks)', yT: 'B ($)', pairs: [[40, 8], [50, 5], [60, 6], [80, 8], [40, 4], [60, 10], [30, 6]], s: function (q) { return q.nm + ' loads money onto a gift card and spends it at a steady rate. The graph shows the balance, ' + t('B') + ' dollars, after ' + t('t') + ' weeks.'; },
      vint: function (q) { return 'The card started with ' + t('\\$' + q.y0) + ', before any spending.'; }, hint: function (q) { return 'After ' + t(q.x0) + ' weeks the balance is ' + t('\\$0') + ': all the money is spent.'; },
      d1: function (q) { return q.nm + ' spends ' + t('\\$' + q.y0) + ' each week.'; }, d2: function (q) { return 'The card started with ' + t('\\$' + q.x0) + '.'; } },
    trip: { xn: 't', yn: 'D', xT: 't (hours)', yT: 'D (km)', pairs: [[300, 6], [240, 4], [400, 5], [360, 6], [450, 5], [320, 4]], s: function (q) { return q.nm + ' is on a road trip. The graph shows the distance still to drive, ' + t('D') + ' km, after ' + t('t') + ' hours of driving.'; },
      vint: function (q) { return 'The whole trip is ' + t(q.y0) + ' km: the distance left before any driving.'; }, hint: function (q) { return 'After ' + t(q.x0) + ' hours no distance is left: ' + q.nm + ' has arrived.'; },
      d1: function (q) { return q.nm + ' drives ' + t(q.y0) + ' km every hour.'; }, d2: function (q) { return 'The whole trip is ' + t(q.x0) + ' km long.'; } },
    candle: { xn: 't', yn: 'h', xT: 't (hours)', yT: 'h (cm)', pairs: [[20, 10], [24, 8], [30, 10], [18, 6], [16, 8], [25, 5]], s: function () { return 'A candle burns down at a steady rate. The graph shows its height, ' + t('h') + ' cm, after ' + t('t') + ' hours.'; },
      vint: function (q) { return 'The candle is ' + t(q.y0) + ' cm tall when it is lit.'; }, hint: function (q) { return 'After ' + t(q.x0) + ' hours the candle has burned down completely.'; },
      d1: function (q) { return 'The candle burns ' + t(q.y0) + ' cm every hour.'; }, d2: function (q) { return 'The candle is ' + t(q.x0) + ' cm tall when it is lit.'; } },
    battery: { xn: 't', yn: 'B', xT: 't (hours)', yT: 'B (%)', pairs: [[100, 10], [80, 8], [100, 20], [90, 6], [60, 5], [100, 5]], s: function () { return 'A phone’s battery runs down at a steady rate while a game is played. The graph shows the charge, ' + t('B') + ' %, after ' + t('t') + ' hours.'; },
      vint: function (q) { return 'The battery is at ' + t(q.y0 + '\\%') + ' when the game starts.'; }, hint: function (q) { return 'After ' + t(q.x0) + ' hours the battery is empty.'; },
      d1: function (q) { return 'The battery loses ' + t(q.y0 + '\\%') + ' every hour.'; }, d2: function (q) { return 'The battery is at ' + t(q.x0 + '\\%') + ' when the game starts.'; } } };
  function niceStep(V, lo, hi) { var c = [1, 2, 4, 5, 10, 20, 25, 40, 50, 60, 100]; for (var i = 0; i < c.length; i++) if (V % c[i] === 0 && V / c[i] >= lo && V / c[i] <= hi) return c[i]; return V / 5; }
  function int12Fig(q) {
    var c = INT12[q.kind], gx = niceStep(q.x0, 4, 10), gy = niceStep(q.y0, 4, 8), X = q.x0 + gx, Y = q.y0 + gy;
    return HW.graph({ x: [0, X], y: [0, Y], grid: gx, gridY: gy, labels: gx, labelsX: gx, labelsY: gy, firstQuadrant: true, unitX: 300 / X, unitY: 190 / Y, xName: c.xn, yName: c.yn, xTitle: c.xT, yTitle: c.yT,
      segs: [{ pts: [[0, q.y0], [q.x0, 0]] }], max: 420, aria: 'a decreasing straight-line graph' });
  }

  /* ================= RF8 · MAS — models (Lessons 9, 10, 12) ================= */
  var MODELS = [
    { what: 'A parking lot charges', fn: 'C', v: 'h', u: 'hour', us: 'hours', m: [3, 4, 5], b: [4, 5, 6], a: [2, 3, 5, 6], verb: 'Parking for', pay: 'A driver paid' },
    { what: 'A food truck charges', fn: 'C', v: 'n', u: 'taco', us: 'tacos', m: [3, 4], b: [6, 8, 10], a: [4, 5, 10, 12], verb: 'Ordering', pay: 'A customer paid' },
    { what: 'A canoe rental costs', fn: 'C', v: 'h', u: 'hour', us: 'hours', m: [3, 4, 5], b: [12, 15], a: [2, 3, 4, 6], verb: 'Renting a canoe for', pay: 'A family paid' },
    { what: 'A gym membership costs', fn: 'M', v: 't', u: 'month', us: 'months', m: [15, 20, 25], b: [20, 30, 50], a: [3, 4, 5, 6], verb: 'A membership for', pay: 'A member paid' },
    { what: 'A moving company charges', fn: 'M', v: 'h', u: 'hour', us: 'hours', m: [25, 30], b: [60, 80], a: [2, 3, 4], verb: 'Hiring the movers for', pay: 'A family paid' },
    { what: 'A landscaping company charges', fn: 'C', v: 'p', u: 'tree', us: 'trees', m: [15, 20], b: [25, 30], a: [4, 6, 8], verb: 'Planting', pay: 'A school paid' }];

  /* ================= the questions, written by outcome (defineTest orders them Beginning → Progressing → Mastery) ================= */
  var QUESTIONS = [
    /* ======================= RF2 — BEG: one relation in a table ======================= */
    { num: '1', outcome: 'RF2', shared: q1Shared, stem: function (s) { return 'The table shows a relation.' + htab(q1Pairs(s)); }, parts: [
      { id: '1a', sub: 'a', outcome: 'RF2', level: 'BEG', make: function (r, s) {
        var pairs = q1Pairs(s), right = uniq(s.ys), I = info(pairs);
        var p = K.P.arrows('Draw the arrows to complete the mapping diagram: tap a value on the left, then its partner on the right.', { left: s.xs, right: right, leftTitle: 'x', rightTitle: 'y' }, pairs,
          'Each column of the table is one arrow, from the ' + t('x') + '-value (left) to its ' + t('y') + '-value (right): ' + t(pairs.map(function (q) { return q[0] + '\\to ' + q[1]; }).join(',\\ ')) + '.' + (I.shared.length ? ' The value ' + t(I.shared[0].y) + ' receives two arrows.' : ''),
          ['Each column of the table is one arrow: from the top value (left oval) to the bottom value (right oval).'], 'mapping diagram from a table');
        /* K.arrows' generic 'arrows' code is the sketch code in js/partial.js (2/3 credit): recode it here */
        var base = p.check, keyS = {}; pairs.forEach(function (q) { keyS[q[0] + '>' + q[1]] = 1; });
        p.check = function (resp) {
          var res = base(resp); if (res.v !== 'wrong' || res.code !== 'arrows') return res;
          var got = (resp || []).map(function (q) { return q[0] + '>' + q[1]; }), miss = Object.keys(keyS).filter(function (k) { return got.indexOf(k) < 0; }), extra = got.filter(function (k) { return !keyS[k]; });
          return miss.length === 1 && extra.length === 1 && miss[0].split('>')[0] === extra[0].split('>')[0] ? wrong('u5t-arrow-one', 'One arrow goes to the wrong output: check the column for ' + t(miss[0].split('>')[0]) + ' in the table.') : wrong('u5t-arrows', 'Each column of the table is one arrow, from its ' + t('x') + '-value on the left to its ' + t('y') + '-value on the right.');
        };
        p.bad = [pairs.slice(1).map(function (q) { return [String(q[0]), String(q[1])]; }), pairs.map(function (q, i) { return [String(q[0]), String(i === 0 ? right.filter(function (y) { return y !== q[1]; })[0] : q[1])]; }), pairs.map(function (q) { return [String(q[0]), String(right[0])]; })].filter(function (b) { return p.check(b).v !== 'correct'; });
        return p;
      } },
      { id: '1b', sub: 'b', outcome: 'RF2', level: 'BEG', make: function (r, s) {
        var pts = q1Pairs(s), key = gv(pts.map(function (p) { return p.slice(); })), wr = plotWrongs(pts);
        var quad = function (p) { return p[0] === 0 ? 'on the ' + t('y') + '-axis' : p[1] === 0 ? 'on the ' + t('x') + '-axis' : 'Quadrant ' + (p[0] > 0 ? (p[1] > 0 ? 'I' : 'IV') : (p[1] > 0 ? 'II' : 'III')); };
        var p = K.P.graph('Plot the four ordered pairs of the relation on the grid. (Tap the grid to place a point; tap it again to remove it.)', { x: [-6, 6], y: [-6, 6], labels: 1, mode: 'points', max: 340 }, exactChk(key, { wrong: wr }), key,
          pts.map(function (q) { return t(pT(q)) + ': start at the origin, ' + moveWords(q) + ' (' + quad(q) + ').'; }).join('<br>'),
          ['Start at the origin each time. The first number tells you how far to go <b>across</b> (right if positive, left if negative).', 'The second number tells you how far to go <b>up</b> (positive) or <b>down</b> (negative).'], 'plot the relation');
        p.bad = wr.map(function (w) { return w.is; }).slice(0, 4);
        return p;
      } },
      { id: '1c', sub: 'c', outcome: 'RF2', level: 'BEG', make: function (r, s) {
        var D = lst(s.xs), R = lst(s.ys);
        var p = drPart('State the domain and the range of the relation. Write each as a list in braces.', D, R, { list: true },
          'Domain: the ' + t('x') + '-values (top row) ' + t(s.xs.join(',\\ ')) + ': ' + t('D=' + D) + '.<br>Range: the ' + t('y') + '-values (bottom row) ' + t(s.ys.join(',\\ ')) + '; a value that repeats is written only once: ' + t('R=' + R) + '.',
          ['The domain is the list of ' + t('x') + '-values (first numbers); the range is the list of ' + t('y') + '-values (second numbers).', HINT_LIST], 'D & R of a table');
        p.bad.push([D, '\\{' + s.ys.join(', ') + '\\}'], [lst(s.xs.concat(s.ys)), R]);
        p.bad = p.bad.filter(function (b) { return p.check(b).v !== 'correct'; });
        return p;
      } }] },

    /* ======================= RF1 — BEG ======================= */
    { num: '2', outcome: 'RF1',
      shared: function (r) {
        var kind = r.pick(['walk', 'walk', 'oven', 'snow']), c = SIT2[kind], nm = r.pick(NAMES), s = sitGen(r, c, false);
        if (!s) { kind = 'walk'; c = SIT2.walk; s = { dirs: ['up', 'flat', 'up', 'down'], T: [0, 10, 15, 25, 40], Y: [0, 400, 400, 700, 0] }; }
        return { kind: kind, c: c, nm: nm, she: !!SHE[nm], dirs: s.dirs, T: s.T, Y: s.Y, at: r.pick([1, 2, 3].filter(function (i) { return s.Y[i] !== 0; })) || 1 };
      },
      stem: function (s) { return s.c.intro(s) + sitFig(s.c, s, ['A', 'B', 'C', 'D', 'E']); },
      parts: [
        { id: '2a', sub: 'a', outcome: 'RF1', level: 'BEG', make: function (r, s) {
          var c = s.c, i = s.at, tt = s.T[i], val = s.Y[i], others = s.Y.filter(function (y, j) { return j !== i && !same(y, val); });
          var p = numPart(c.ask(s, tt), val, [{ v: tt, code: 'u5t-read-swap', hint: 'That’s the time. Find ' + t(tt) + ' on the horizontal (time) axis, go up to the graph, then across to the vertical axis.' }].concat(others.map(function (y) { return { v: y, code: 'u5t-read-point', hint: 'That’s the value at a different point. Start at ' + t(tt) + ' on the time axis.' }; })),
            'At ' + t(tt) + ' ' + c.xu + ' the graph is at point ' + 'ABCDE'.charAt(i) + ', ' + t(pT([tt, val])) + ': <b>' + t(val) + ' ' + c.yu + '</b>.',
            ['Find ' + t(tt) + ' on the horizontal (time) axis, go up to the graph, then across to the vertical axis.'], 'read the story graph', { after: c.yu });
          return p;
        } },
        { id: '2b', sub: 'b', outcome: 'RF1', level: 'BEG', make: function (r, s) {
          var L = ['A', 'B', 'C', 'D', 'E'], word = { up: 'Increasing', down: 'Decreasing', flat: 'Constant' }, id = { up: 'I', down: 'D', flat: 'C' };
          var rows = s.dirs.map(function (d, i) { return { id: 'r' + i, html: L[i] + ' to ' + L[i + 1] }; }), want = {};
          s.dirs.forEach(function (d, i) { want['r' + i] = id[d]; });
          var why = function (rid) { var i = Number(rid.slice(1)), d = s.dirs[i]; return { code: 'u5t-dir', hint: L[i] + ' to ' + L[i + 1] + ': the graph ' + (d === 'up' ? '<b>rises</b> from ' + t(s.Y[i]) + ' to ' + t(s.Y[i + 1]) : d === 'down' ? '<b>falls</b> from ' + t(s.Y[i]) + ' to ' + t(s.Y[i + 1]) : 'is <b>flat</b> at ' + t(s.Y[i])) + ' ' + s.c.yu + '.' }; };
          return gridPart('Read the graph from left to right. Is the quantity <b>increasing</b>, <b>decreasing</b> or <b>constant</b> on each interval?', rows, [{ id: 'I', html: 'Increasing' }, { id: 'D', html: 'Decreasing' }, { id: 'C', html: 'Constant' }], want, why,
            s.dirs.map(function (d, i) { return L[i] + ' to ' + L[i + 1] + ': ' + (d === 'up' ? 'rises' : d === 'down' ? 'falls' : 'flat') + ' — <b>' + word[d].toLowerCase() + '</b>.'; }).join('<br>'),
            ['Rising (going up to the right) means increasing, falling means decreasing, flat means constant.'], 'increasing/decreasing/constant: ' + s.dirs.join(','), 'u5t-dir-one', 'u5t-dir');
        } }] },
    { num: '3', outcome: 'RF1',
      shared: function (r) {
        var c = r.pick([
          { ind: 'm', dep: 'p', s: ['The number of pages read, ' + t('p') + ', depends on the number of minutes spent reading, ' + t('m') + '.', 'The number of minutes spent reading, ' + t('m') + ', decides the number of pages read, ' + t('p') + '.'], why: 'The pages read <b>depend on</b> how long you read.' },
          { ind: 'w', dep: 'A', s: ['The amount saved in a piggy bank, ' + t('A') + ' dollars, depends on the number of weeks spent saving, ' + t('w') + '.', 'The number of weeks spent saving, ' + t('w') + ', decides the amount saved in a piggy bank, ' + t('A') + ' dollars.'], why: 'The amount saved <b>depends on</b> how many weeks you save.' },
          { ind: 'L', dep: 'P', s: ['The total price of gas, ' + t('P') + ' dollars, depends on the number of litres pumped, ' + t('L') + '.', 'The number of litres of gas pumped, ' + t('L') + ', decides the total price, ' + t('P') + ' dollars.'], why: 'The price <b>depends on</b> how much gas is pumped.' },
          { ind: 'h', dep: 'P', s: ['The pay for a part-time job, ' + t('P') + ' dollars, depends on the number of hours worked, ' + t('h') + '.', 'The number of hours worked, ' + t('h') + ', decides the pay for a part-time job, ' + t('P') + ' dollars.'], why: 'The pay <b>depends on</b> the hours worked.' },
          { ind: 'm', dep: 'T', s: ['The temperature of a glass of ice water, ' + t('T') + ' °C, depends on the number of minutes it sits on the counter, ' + t('m') + '.', 'The number of minutes a glass of ice water sits on the counter, ' + t('m') + ', decides its temperature, ' + t('T') + ' °C.'], why: 'The temperature <b>depends on</b> how long it sits out.' },
          { ind: 'n', dep: 'S', s: ['The number of stickers given out, ' + t('S') + ', depends on the number of students in the class, ' + t('n') + '.', 'The number of students in a class, ' + t('n') + ', decides the number of stickers given out, ' + t('S') + '.'], why: 'The stickers given out <b>depend on</b> how many students there are.' },
          { ind: 'k', dep: 'C', s: ['The cost of a taxi ride, ' + t('C') + ' dollars, depends on the number of kilometres travelled, ' + t('k') + '.', 'The number of kilometres travelled, ' + t('k') + ', decides the cost of a taxi ride, ' + t('C') + ' dollars.'], why: 'The cost <b>depends on</b> how far you ride.' },
          { ind: 't', dep: 'h', s: ['The height of a candle, ' + t('h') + ' cm, depends on the number of hours it has been burning, ' + t('t') + '.', 'The number of hours a candle has been burning, ' + t('t') + ', decides its height, ' + t('h') + ' cm.'], why: 'The height <b>depends on</b> how long the candle has burned.' },
          { ind: 'h', dep: 'd', s: ['The distance a cyclist has travelled, ' + t('d') + ' km, depends on the number of hours spent cycling, ' + t('h') + '.', 'The number of hours spent cycling, ' + t('h') + ', decides the distance travelled, ' + t('d') + ' km.'], why: 'The distance <b>depends on</b> how long the cyclist rides.' },
          { ind: 'n', dep: 'C', s: ['The total cost of movie tickets, ' + t('C') + ' dollars, depends on the number of tickets bought, ' + t('n') + '.', 'The number of movie tickets bought, ' + t('n') + ', decides the total cost, ' + t('C') + ' dollars.'], why: 'The cost <b>depends on</b> how many tickets are bought.' },
          { ind: 'm', dep: 'T', s: ['The temperature of an oven while it preheats, ' + t('T') + ' °C, depends on the number of minutes since it was turned on, ' + t('m') + '.', 'The number of minutes since an oven was turned on, ' + t('m') + ', decides its temperature while it preheats, ' + t('T') + ' °C.'], why: 'The temperature <b>depends on</b> how long the oven has been on.' },
          { ind: 'n', dep: 'W', s: ['The total number of wheels, ' + t('W') + ', on the tricycles in a display depends on the number of tricycles, ' + t('n') + '.', 'The number of tricycles in a display, ' + t('n') + ', decides the total number of wheels, ' + t('W') + '.'], why: 'The number of wheels <b>depends on</b> the number of tricycles.' }]);
        return { c: c, s: c.s[r.int(0, 1)] };
      },
      stem: function (s) { return s.s; },
      parts: [
        { id: '3', outcome: 'RF1', level: 'BEG', make: function (r, s) {
          var ind = s.c.ind, dep = s.c.dep;
          var cl0 = function (x) { return String(x == null ? '' : x).replace(/\\[a-zA-Z]+|[{}$\\()\s]/g, ''); }, is = function (a, b) { return a === b || (ind.toLowerCase() !== dep.toLowerCase() && a.toLowerCase() === b.toLowerCase()); };
          return { prompt: 'Name the independent variable and the dependent variable (type the letters).', input: { type: 'fields', fields: [{ label: 'Independent variable:', name: 'Independent', mode: 'text', placeholder: 'letter' }, { label: 'Dependent variable:', name: 'Dependent', mode: 'text', placeholder: 'letter' }] },
            key: [ind, dep], answer: 'Independent: ' + t(ind) + '; dependent: ' + t(dep), bad: [[dep, ind], [ind, ind]], text: 'independent/dependent: ' + ind + ', ' + dep,
            solution: s.c.why + ' So ' + t(dep) + ' is the <b>dependent</b> variable (the result), and ' + t(ind) + ' is the <b>independent</b> variable (the one you choose or control). The independent variable goes on the horizontal axis.',
            hints: ['Which quantity is the result of the other? That one depends on the other: it is the dependent variable.'],
            check: function (resp) {
              resp = resp || []; var a = cl0(resp[0]), b = cl0(resp[1]);
              if (!a || !b) return form('empty', 'Type one letter in each box.');
              if (is(a, ind) && is(b, dep)) return ok();
              if (is(a, dep) && is(b, ind)) return wrong('u5t-var-swap', 'Swapped: ' + s.c.why + ' The quantity that depends on the other is the <b>dependent</b> variable.');
              if (is(a, b)) return wrong('u5t-var-same', 'The two boxes need two different variables: one is chosen, the other is the result.');
              return form('var-letter', 'Use the letters from the question, ' + t(ind) + ' and ' + t(dep) + ' (one letter per box).');
            } };
        } }] },

    /* ======================= RF4 — BEG: a tile pattern ======================= */
    { num: '4', outcome: 'RF4',
      shared: function (r) { var d = r.int(2, 6), c = r.int(1, 5); return { d: d, c: c, a: c + d, N: r.int(7, 9) }; },
      stem: function (s) { return 'A pattern is built from square tiles. Each new figure adds the same number of tiles.' + tileSvg(s.c, s.d, 3); },
      parts: [
        { id: '4a', sub: 'a', outcome: 'RF4', level: 'BEG', make: function (r, s) {
          var T = function (n) { return s.a + s.d * (n - 1); }, keys = [1, 2, 3, 4, 5].map(function (n) { return String(T(n)); });
          var fields = [1, 2, 3, 4, 5].map(function (n) { return { label: 'Figure ' + n + ':', name: 'Figure ' + n, after: 'tiles' }; });
          var chk = function (resp) {
            resp = resp || []; var v = [0, 1, 2, 3, 4].map(function (i) { return parseNum(resp[i]); });
            if (v.some(function (x) { return x == null; })) return form('empty', 'Fill in all five boxes with numbers.');
            if (v.every(function (x, i) { return same(x, T(i + 1)); })) return ok();
            if (v.every(function (x, i) { return same(x, s.d * (i + 1)); })) return wrong('u5t-pat-nobase', 'Count Figure 1 again: it has ' + t(s.a) + ' tiles, not ' + t(s.d) + '. Start there and add ' + t(s.d) + ' each time.');
            if (v.every(function (x, i) { return same(x, s.a * (i + 1)); })) return wrong('u5t-pat-mult', 'Each figure adds ' + t(s.d) + ' tiles to the one before; it doesn’t add another ' + t(s.a) + '. Count Figure 2: ' + t(T(2)) + ' tiles.');
            var first3 = v.slice(0, 3).every(function (x, i) { return same(x, T(i + 1)); });
            if (first3) return wrong('u5t-pat-extend', 'Figures 1–3 are right. Keep going the same way: add ' + t(s.d) + ' tiles for each new figure.');
            var st = v[1] - v[0];
            if (same(v[0], s.a) && [2, 3, 4].every(function (i) { return same(v[i] - v[i - 1], st); })) return wrong('u5t-pat-step', 'Figure 1 is right, but each figure adds ' + t(s.d) + ' tiles, not ' + t(st) + '. Count the tiles added from Figure 1 to Figure 2.');
            return wrong('value', 'Count the tiles in Figures 1, 2 and 3, then keep adding the same number each time.');
          };
          return { prompt: 'Complete the table of values: the number of tiles in Figures 1 to 5.', input: { type: 'fields', fields: fields }, check: chk, key: keys,
            answer: HW.valueTable([['Figure'].concat([1, 2, 3, 4, 5]), ['Tiles'].concat(keys)]),
            solution: 'Count the drawn figures: ' + t(T(1)) + ', ' + t(T(2)) + ', ' + t(T(3)) + ' tiles. Each new figure adds one more column of ' + t(s.d) + ' tiles, so keep adding ' + t(s.d) + ': Figure 4 has ' + t(T(3) + '+' + s.d + '=' + T(4)) + ' and Figure 5 has ' + t(T(4) + '+' + s.d + '=' + T(5)) + '.',
            hints: ['Count the tiles in each drawn figure. How many more does each figure have than the one before?'], text: 'tile pattern table',
            bad: [[1, 2, 3, 4, 5].map(function (n) { return String(s.d * n); }), [1, 2, 3, 4, 5].map(function (n) { return n <= 3 ? String(T(n)) : String(T(n) + 1); })] };
        } },
        { id: '4b', sub: 'b', outcome: 'RF4', level: 'BEG', make: function (r, s) {
          var chk = function (resp) {
            resp = resp || []; var a = parseNum(resp[0]), b = parseNum(resp[1]);
            if (a == null || b == null) return form('empty', 'Fill in both blanks with numbers.');
            if (same(a, s.a) && same(b, s.d)) return ok();
            if (same(a, s.d) && same(b, s.a)) return wrong('u5t-pat-swap', 'Swapped: Figure 1 has ' + t(s.a) + ' tiles, and each new figure has ' + t(s.d) + ' more.');
            if (same(a, s.a)) return wrong('value', 'Figure 1 is right. Now count how many tiles are added from one figure to the next.');
            return wrong('value', 'Count the tiles in Figure 1, then how many more Figure 2 has.');
          };
          return { prompt: 'Describe the pattern in words by completing the sentence.', input: { type: 'fields', fields: [{ label: 'Figure 1 has', name: 'Figure 1', after: 'tiles,' }, { label: 'and each new figure has', name: 'Added each time', after: 'more tiles than the one before.' }] },
            check: chk, key: [String(s.a), String(s.d)], bad: [[String(s.d), String(s.a)]], answer: 'Figure 1 has ' + t(s.a) + ' tiles, and each new figure has ' + t(s.d) + ' more tiles than the one before.',
            solution: 'Figure 1 has ' + t(s.a) + ' tiles. Figure 2 has ' + t(s.a + s.d) + ', which is ' + t(s.d) + ' more, and Figure 3 has ' + t(s.d) + ' more again: the pattern starts at ' + t(s.a) + ' and grows by ' + t(s.d) + ' each figure.',
            hints: ['The pattern grows by a constant amount: find the difference between two figures in a row.'], text: 'pattern in words' };
        } },
        { id: '4c', sub: 'c', outcome: 'RF4', level: 'BEG', make: function (r, s) {
          var N = s.N, val = s.a + s.d * (N - 1);
          return numPart('Continue the pattern: how many tiles are in Figure ' + t(N) + '?', val, [{ v: s.a + s.d * N, code: 'u5t-pat-off1', hint: 'Check with Figure 2: it has ' + t(s.a) + ' plus <b>one</b> group of ' + t(s.d) + '. Figure ' + N + ' has ' + t(N - 1) + ' groups added, not ' + t(N) + '.' },
            { v: s.d * N, code: 'u5t-pat-nobase', hint: 'Start from Figure 1’s ' + t(s.a) + ' tiles and add ' + t(s.d) + ' for each new figure.' }, { v: s.a * N, code: 'u5t-pat-mult', hint: 'Each figure adds ' + t(s.d) + ' tiles, not another ' + t(s.a) + '.' }],
            'Keep adding ' + t(s.d) + ': Figure 5 has ' + t(s.a + 4 * s.d) + (N > 6 ? ', Figure 6 has ' + t(s.a + 5 * s.d) : '') + (N > 7 ? ', Figure 7 has ' + t(s.a + 6 * s.d) : '') + (N > 8 ? ', Figure 8 has ' + t(s.a + 7 * s.d) : '') + ', so Figure ' + t(N) + ' has ' + t(val) + ' tiles.<br>(Or: Figure 1 plus ' + t(N - 1) + ' groups of ' + t(s.d) + ': ' + t(s.a + '+' + (N - 1) + '\\times ' + s.d + '=' + val) + '.)',
            ['Continue your table: add ' + t(s.d) + ' for each new figure.'], 'figure ' + N, { after: 'tiles' });
        } }] },

    /* ======================= RF5 — BEG: intercepts ======================= */
    { num: '5', outcome: 'RF5', stem: 'An <b>' + t('x') + '-intercept</b> is where a graph meets the ' + t('x') + '-axis; a <b>' + t('y') + '-intercept</b> is where it meets the ' + t('y') + '-axis.', parts: [
      { id: '5a', sub: 'a', outcome: 'RF5', level: 'BEG', make: function (r) {
        var q = find(function () { return { p: r.pick(nz(-4, 4)), b: r.pick(nz(-4, 4)) }; }, function (q) { return Math.abs(q.p) !== Math.abs(q.b) || q.p !== q.b; }, { p: 3, b: -4 });
        var m = -q.b / q.p, ends = lineThrough([0, q.b], m);
        return interceptsPart('State the ' + t('x') + '-intercept and the ' + t('y') + '-intercept of the line as ordered pairs.' + G({ segs: [{ pts: ends, start: 'arrow', end: 'arrow' }], aria: 'graph of a line' }), q.p, q.b,
          { sol: 'The line crosses the ' + t('x') + '-axis at ' + t(pT([q.p, 0])) + ' (there ' + t('y=0') + ') and the ' + t('y') + '-axis at ' + t(pT([0, q.b])) + ' (there ' + t('x=0') + ').', hints: ['On the ' + t('x') + '-axis every point has ' + t('y=0') + ', like ' + t('(a,\\ 0)') + '; on the ' + t('y') + '-axis every point has ' + t('x=0') + ', like ' + t('(0,\\ b)') + '.'], text: 'intercepts of a line' });
      } },
      { id: '5b', sub: 'b', outcome: 'RF5', level: 'BEG', make: function (r) {
        var q = find(function () {
          var m = r.pick([-3, -2, -1, 1, 2, 3]), p = r.pick(nz(-4, 4)), b = -m * p, others = r.sample(range(-4, 5).filter(function (x) { return x !== 0 && x !== p; }), 3);
          var xs = [0, p].concat(others); return { m: m, p: p, b: b, xs: xs };
        }, function (q) { return Math.abs(q.b) <= 12 && q.xs.every(function (x) { return Math.abs(q.m * x + q.b) <= 15; }); }, { m: 3, p: 2, b: -6, xs: [0, 2, -1, 4, 3] });
        var xs = find(function () { return r.shuffle(q.xs); }, function (a) { return a[0] !== 0 && a.indexOf(0) !== 1 && a.some(function (x, i) { return i && x < a[i - 1]; }); }, q.xs);
        var pairs = xs.map(function (x) { return [x, q.m * x + q.b]; });
        return interceptsPart('The table shows several points on a line, listed out of order. State the ' + t('x') + '-intercept and the ' + t('y') + '-intercept as ordered pairs.' + htab(pairs), q.p, q.b,
          { sol: 'The ' + t('x') + '-intercept is the pair with ' + t('y=0') + ': ' + t(pT([q.p, 0])) + '. The ' + t('y') + '-intercept is the pair with ' + t('x=0') + ': ' + t(pT([0, q.b])) + '.', hints: ['Find the column where ' + t('y=0') + ' (the ' + t('x') + '-intercept) and the column where ' + t('x=0') + ' (the ' + t('y') + '-intercept).'], text: 'intercepts from a table' });
      } },
      { id: '5c', sub: 'c', outcome: 'RF5', level: 'BEG', make: function (r) {
        var ax = r.chance(0.5) ? 'x' : 'y', a = r.pick(nz(-9, 9)), b = r.pick(nz(-9, 9).filter(function (v) { return Math.abs(v) !== Math.abs(a); })), c2 = r.pick(nz(-9, 9).filter(function (v) { return Math.abs(v) !== Math.abs(a) && Math.abs(v) !== Math.abs(b); }));
        var right = ax === 'x' ? [a, 0] : [0, a], flip = ax === 'x' ? [0, a] : [a, 0];
        var o = [{ html: t(pT(right)), right: true },
          { html: t(pT(flip)), why: t(pT(flip)) + ' has ' + (ax === 'x' ? t('x=0') + ', so it is on the ' + t('y') + '-axis: a ' + t('y') + '-intercept.' : t('y=0') + ', so it is on the ' + t('x') + '-axis: an ' + t('x') + '-intercept.') },
          { html: t(pT([a, b])), why: 'Neither coordinate of ' + t(pT([a, b])) + ' is 0, so it isn’t on either axis.' },
          { html: t(pT([b, c2])), why: 'Neither coordinate of ' + t(pT([b, c2])) + ' is 0, so it isn’t on either axis.' }];
        return P.mc(r, 'Which ordered pair could be the <b>' + t(ax) + '-intercept</b> of a graph?', o,
          'Every point on the ' + t(ax) + '-axis has ' + t((ax === 'x' ? 'y' : 'x') + '=0') + ', so ' + (ax === 'x' ? 'an ' + t('x') + '-intercept looks like ' + t('(a,\\ 0)') : 'a ' + t('y') + '-intercept looks like ' + t('(0,\\ b)')) + ': ' + t(pT(right)) + '.',
          ['On the ' + t(ax) + '-axis, which coordinate is always 0?'], 'which could be the ' + ax + '-intercept');
      } }] },

    /* ======================= RF8 — BEG ======================= */
    { num: '6', outcome: 'RF8', shared: function (r) { return { m: r.int(2, 5), b: r.pick(nz(-9, 9)), a: r.int(2, 5) }; },
      stem: function (s) { return 'Consider the relation ' + t('y=' + lin(s.m, s.b)) + '.'; },
      parts: [
        { id: '6a', sub: 'a', outcome: 'RF8', level: 'BEG', make: function (r, s) {
          var rhs = lin(s.m, s.b), key = 'f(x)=' + rhs;
          var p = { prompt: 'Write the relation in function notation. Name the function ' + t('f') + '.', input: { type: 'math', keys: EQK, vars: ['x', 'f', 'y'], placeholder: 'e.g. f(x) = 2x - 3' },
            check: convChk({ T: PL.parse(rhs), v: 'x', name: 'f', reqName: true }), key: key, answer: t(key),
            solution: 'Replace ' + t('y') + ' with ' + t('f(x)') + ' (read “' + t('f') + ' of ' + t('x') + '”). The rule on the right stays the same: ' + t(key) + '.', hints: ['Swap ' + t('y') + ' for ' + t('f(x)') + '. The right side stays the same.'], text: 'y= to f(x)=' };
          p.good = [rhs + '=f(x)']; p.bad = ['y=' + rhs, 'f(y)=' + rhs, 'g(x)=' + rhs, 'f(x)=' + lin(s.b, s.m)].filter(function (b) { return p.check(b).v !== 'correct'; });
          return p;
        } },
        { id: '6b', sub: 'b', outcome: 'RF8', level: 'BEG', make: function (r, s) {
          var x = s.a, val = s.m * x + s.b, fx = 'f(' + x + ')';
          return numPart('Evaluate ' + t(fx) + '.', val, [{ v: s.m * x, code: 'u5t-ev-no-b', hint: 'Don’t forget the constant term: ' + (s.b > 0 ? 'add ' + t(s.b) : 'subtract ' + t(-s.b)) + ' after multiplying.' }, { v: s.m + x + s.b, code: 'u5t-ev-add', hint: t(s.m + 'x') + ' means ' + t(s.m + '\\times x') + ': multiply, don’t add.' }, { v: s.m * x - s.b, code: 'ev-sign', hint: 'Check the sign of the constant term: it is ' + t((s.b > 0 ? '+' : '') + s.b) + '.' }, { v: s.m * 10 + x + s.b, code: 'u5t-ev-add', hint: t(s.m + 'x') + ' means ' + t(s.m + '\\times x') + ', not the digits side by side.' }],
            t(fx + '=' + s.m + '(' + x + ')' + (s.b > 0 ? '+' : '') + s.b + '=' + (s.m * x) + (s.b > 0 ? '+' : '') + s.b + '=' + val), ['Replace ' + t('x') + ' with ' + t(x) + ', then multiply before you add or subtract.'], 'evaluate f(' + x + ')', { before: t(fx + '=') });
        } },
        { id: '6c', sub: 'c', outcome: 'RF8', level: 'BEG', make: function (r) {
          var V = find(function () { var x1 = r.int(-3, -1), x2 = r.int(1, 3); return [[-5, r.int(-4, 4)], [x1, r.int(-4, 4)], [x2, r.int(-4, 4)], [5, r.int(-4, 4)]]; },
            function (V) { return V.every(function (p, i) { return !i || p[1] !== V[i - 1][1]; }) && V.some(function (p) { return p[1] < 0; }) && V.some(function (p) { return p[1] > 0; }); }, [[-5, -2], [-2, 3], [2, -1], [5, 4]]);
          var i = r.int(0, 3), k = V[i][0], val = V[i][1], o = V.filter(function (p, j) { return j !== i; }).map(function (p) { return p[1]; });
          var back = V.filter(function (p) { return p[1] === k; })[0];
          return numPart('The graph of the function ' + t('g') + ' is shown. Find ' + t('g(' + k + ')') + '.' + G({ segs: [{ pts: V, start: 'closed', end: 'closed' }], yName: 'y', aria: 'graph of a function g made of three line segments' }), val,
            [{ v: -val, code: 'ev-sign', hint: 'Check the sign: is the graph above or below the ' + t('x') + '-axis at ' + t('x=' + k) + '?' }, { v: back ? back[0] : null, code: 'u5t-read-swap', hint: 'You found where the <b>output</b> is ' + t(k) + '. In ' + t('g(' + k + ')') + ' the ' + t(k) + ' is the <b>input</b>: start at ' + t('x=' + k) + ' on the horizontal axis.' }].concat(o.map(function (y) { return { v: y, code: 'u5t-read-point', hint: 'That is the graph’s value at a different ' + t('x') + '. Start at ' + t('x=' + k) + '.' }; })),
            'Go to ' + t('x=' + k) + ' on the horizontal axis, then up or down to the graph: the point is ' + t(pT([k, val])) + ', so ' + t('g(' + k + ')=' + val) + '.', ['In ' + t('g(' + k + ')') + ', ' + t(k) + ' is the input (an ' + t('x') + '-value). Read the ' + t('y') + '-value of the graph there.'], 'read g(' + k + ') from a graph', { before: t('g(' + k + ')=') });
        } }] },

    /* ======================= RF1 — PRG ======================= */
    { num: '7', outcome: 'RF1', stem: 'Each graph shows a quantity over time. Read the shape: rising, flat or falling, and how steeply.', parts: [
      { id: '7', outcome: 'RF1', level: 'PRG', make: function (r) {
        var st = r.pick(STORIES), nm = r.pick(NAMES), he = SHE[nm] ? 'she' : 'he';
        var items = r.shuffle([{ k: st.right, right: true }].concat(st.wrong.map(function (w) { return { k: w[0], why: w[1] }; }))), labs = ['A', 'B', 'C', 'D'];
        var bk = bank(items.map(function (it, i) { var sh = SHAPES[it.k]; return { label: 'Graph ' + labs[i], svg: sketchSvg(sh.segs, sh.fns, st.y) }; }), 2);
        var o = items.map(function (it, i) { return it.right ? { html: 'Graph ' + labs[i], right: true } : { html: 'Graph ' + labs[i], why: 'Graph ' + labs[i] + ': ' + it.why }; });
        var ri = items.findIndex(function (it) { return it.right; });
        var p = P.mc(r, st.s(nm, he) + ' Which graph matches the story?' + bk, o, 'Break the story into stages and match each one to a piece of the graph. <b>Graph ' + labs[ri] + '</b>: ' + st.why, ['Read the vertical axis first. A stop is a flat piece; faster means steeper.'], 'match a story: ' + st.right, true);
        p.input.columns = 4;
        return p;
      } }] },
    { num: '8', outcome: 'RF1',
      shared: function (r) {
        var kind = r.pick(['barrel', 'tank', 'hike']), c = SIT8[kind], s = sitGen(r, c, true);
        if (!s) { kind = 'barrel'; c = SIT8.barrel; s = { dirs: ['flat', 'up', 'flat', 'down'], T: [0, 2, 4, 7, 9], Y: [5, 5, 25, 25, 10], rates: [0, 10, 0, -7.5] }; }
        var segs = s.dirs.map(function (d, i) { return i; }).filter(function (i) { return s.dirs[i] !== 'flat' && Number.isInteger(s.rates[i]); });
        var ups = segs.filter(function (i) { return s.dirs[i] === 'up'; }), ask = ups.length && r.chance(0.6) ? r.pick(ups) : r.pick(segs.length ? segs : [1]);
        return { kind: kind, c: c, dirs: s.dirs, T: s.T, Y: s.Y, rates: s.rates, ask: ask };
      },
      stem: function (s) { return s.c.intro + sitFig(s.c, s, ['P', 'Q', 'R', 'S', 'T']); },
      parts: [
        { id: '8a', sub: 'a', outcome: 'RF1', level: 'PRG', make: function (r, s) {
          var c = s.c, i = s.ask, L = 'PQRST', dy = s.Y[i + 1] - s.Y[i], dx = s.T[i + 1] - s.T[i], rate = cl(dy / dx);
          var otherR = s.rates.filter(function (x, j) { return j !== i && x !== 0; });
          return numPart('Determine the rate of change from ' + t(L.charAt(i)) + ' to ' + t(L.charAt(i + 1)) + ', in ' + c.rateU + '.', rate,
            [{ v: -rate, code: 'rate-sign', hint: 'Check the sign: the graph ' + (rate > 0 ? 'rises' : 'falls') + ' from ' + L.charAt(i) + ' to ' + L.charAt(i + 1) + ', so the rate of change is ' + (rate > 0 ? 'positive' : 'negative') + '.' },
              { v: dy, code: 'u5t-rate-rise', hint: 'That is the change in the amount. Divide it by the change in ' + (c.xu === 'km' ? 'distance' : 'time') + ', ' + t(dx) + ' ' + c.xu + '.' },
              { v: -dy, code: 'u5t-rate-rise', hint: 'That is only the change in the amount. Divide it by ' + t(dx) + ' ' + c.xu + '.' },
              { v: cl(dx / dy), code: 'rate-flip', hint: 'Rate of change is <b>change in the amount ÷ change in ' + (c.xu === 'km' ? 'distance' : 'time') + '</b> — your division is upside down.' }].concat(otherR.map(function (x) { return { v: x, code: 'u5t-rate-seg', hint: 'That is the rate of a different piece. Use the points ' + L.charAt(i) + ' and ' + L.charAt(i + 1) + '.' }; })),
            L.charAt(i) + ' is ' + t(pT([s.T[i], s.Y[i]])) + ' and ' + L.charAt(i + 1) + ' is ' + t(pT([s.T[i + 1], s.Y[i + 1]])) + '.<br>Rate of change ' + t('=\\dfrac{\\text{change in amount}}{\\text{change in ' + (c.xu === 'km' ? 'distance' : 'time') + '}}=\\dfrac{' + s.Y[i + 1] + '-' + s.Y[i] + '}{' + s.T[i + 1] + '-' + s.T[i] + '}=\\dfrac{' + dy + '}{' + dx + '}=' + nT(rate)) + ' ' + c.rateU + '.' + (rate < 0 ? ' It is negative because the amount goes down (' + c.cause.dn + ').' : ' It is positive because the amount goes up (' + c.cause.up + ').'),
            ['Rate of change = change in the vertical value ÷ change in the horizontal value, between the two points.', 'A falling piece has a negative rate of change.'], 'rate of change on a story graph', { after: c.rateU });
        } },
        { id: '8b', sub: 'b', outcome: 'RF1', level: 'PRG', make: function (r, s) {
          var c = s.c, L = 'PQRST', flats = s.dirs.map(function (d, i) { return i; }).filter(function (i) { return s.dirs[i] === 'flat'; }), dur = function (i) { return s.T[i + 1] - s.T[i]; };
          var tot = flats.reduce(function (a, i) { return a + dur(i); }, 0), moving = s.T[4] - tot;
          var p = numPart(c.flatQ, tot, (flats.length > 1 ? flats.map(function (i) { return { v: dur(i), code: 'u5t-flat-one', hint: 'There is more than one flat piece. Add the lengths of <b>all</b> of them.' }; }) : []).concat([{ v: flats.length, code: 'u5t-flat-count', hint: 'That counts the flat pieces. The question asks how long they last: read their start and end on the horizontal axis.' },
            { v: moving, code: 'u5t-flat-other', hint: 'That is how long the amount was <b>changing</b>. Constant means the flat pieces.' }]),
            'The amount is constant where the graph is flat: ' + flats.map(function (i) { return L.charAt(i) + ' to ' + L.charAt(i + 1) + ' (' + t(s.T[i] + '\\text{ to }' + s.T[i + 1]) + ', ' + t(dur(i)) + ' ' + c.flatU + ')'; }).join(' and ') + '. In total: <b>' + t(tot) + ' ' + c.flatU + '</b>.',
            ['Find every flat (horizontal) piece. How long does each one last?'], 'total constant time', { after: c.flatU });
          if (tot === 1) p.answer = t('1') + ' ' + c.flatU.replace(/s$/, '');
          return p;
        } }] },

    /* ======================= RF2 — PRG ======================= */
    { num: '9', outcome: 'RF2', stem: 'A relation is a <b>function</b> when every input is paired with exactly one output.', parts: [
      { id: '9a', sub: 'a', outcome: 'RF2', level: 'PRG', make: function (r) {
        var nf = r.chance(0.7) ? 2 : r.pick([1, 3]), kinds = r.shuffle([true, true, true, false, false, false].slice(3 - nf, 7 - nf)), gs = kinds.map(function (f) { return vltGraph(r, f); });
        var labs = ['(i)', '(ii)', '(iii)', '(iv)'], want = {}, rows = gs.map(function (g, i) { want['g' + i] = g.fn ? 'Y' : 'N'; return { id: 'g' + i, html: labs[i] }; });
        var why = function (id) { var i = Number(id.slice(1)), g = gs[i]; return { code: 'u5t-vlt', hint: 'Graph ' + labs[i] + ' is ' + g.why + '.' }; };
        var p = gridPart('Use the vertical line test. Is each graph a function? Choose <b>Yes</b> or <b>No</b>.' + bank(gs.map(function (g, i) { return { label: labs[i], svg: vltSmall(g.spec) }; }), 2), rows, [{ id: 'Y', html: 'Yes' }, { id: 'N', html: 'No' }], want, why,
          gs.map(function (g, i) { return labs[i] + ': ' + g.why + ' — <b>' + (g.fn ? 'yes' : 'no') + '</b>.'; }).join('<br>'),
          ['Imagine sliding a vertical line across each graph. If it ever crosses the graph twice, the graph is not a function.'], 'vertical line test: 4 graphs', 'u5t-vlt-one', 'u5t-vlt');
        p.answer = gs.map(function (g, i) { return labs[i] + ' ' + (g.fn ? 'Yes' : 'No'); }).join(', ');
        return p;
      } },
      { id: '9b', sub: 'b', outcome: 'RF2', level: 'PRG', make: function (r) {
        var isFn = r.chance(0.45), rep = r.pick(['pairs', 'table', 'arrow']), pairs, xs, bx = null;
        pairs = find(function () {
          if (isFn) { var x4 = r.sample(range(-3, 9), 4), cy = r.int(0, 9), yy = x4.map(function () { return r.chance(0.4) ? cy : r.int(0, 9); }); return x4.map(function (x, i) { return [x, yy[i]]; }); }
          var x3 = r.sample(range(-3, 9), 3), y4 = r.sample(range(0, 9), 4), dup = r.int(0, 2); bx = x3[dup]; return x3.map(function (x, i) { return [x, y4[i]]; }).concat([[x3[dup], y4[3]]]);
        }, function (ps) { var I = info(ps); return I.isFn === isFn && (!isFn || I.shared.length > 0 || r.chance(0.3)); }, isFn ? [[1, 4], [2, 7], [3, 4], [5, 9]] : [[2, 6], [3, 8], [2, 11], [4, 8]]);
        var I = info(pairs); if (!isFn) bx = I.breakers[0].x;
        if (rep === 'arrow') { xs = uniq(I.xs); pairs = pairs.slice().sort(function (a, b) { return a[0] - b[0]; }); } else pairs = shuffleApart(r, pairs);
        var fig = rep === 'arrow' ? HW.arrowDiagram(xs, uniq(I.ys), pairs) : rep === 'table' ? htab(pairs) : '<p>' + psH(pairs) + '</p>';
        var shY = I.shared.length ? I.shared[0].y : null;
        var chk = function (resp) {
          var raw = Array.isArray(resp) ? resp[0] : resp, s0 = String(raw == null ? '' : raw).trim();
          if (!s0) return form('empty', 'Type the input, or press <b>none</b> if the relation is a function.');
          if (isNoneS(s0)) return isFn ? ok() : wrong('u5t-fn-said-fn', 'Look again at the inputs: ' + t(bx) + ' is paired with ' + andT(I.breakers[0].ys) + '. One input with two outputs means it is <b>not</b> a function.');
          var v = parseNum(s0); if (v == null) return form('unreadable', 'Type one number (the input), or press <b>none</b>.');
          if (!isFn && same(v, bx)) return ok();
          if (shY != null && same(v, shY) && !I.xs.some(function (x) { return same(x, v); })) return wrong('u5t-fn-output', t(nT(v)) + ' is an <b>output</b> that appears twice — that is allowed. Look for an <b>input</b> that appears with two different outputs.');
          if (isFn) return wrong('u5t-fn-said-not', 'Every input appears with only one output, so this relation <b>is</b> a function: press <b>none</b>.' + (shY != null ? ' (Outputs may repeat.)' : ''));
          return wrong('value', 'Find the input (first number) that is paired with two different outputs.');
        };
        var how = rep === 'arrow' ? 'Count the arrows leaving each value on the left.' : 'Look for an ' + t('x') + '-value that appears twice with different ' + t('y') + '-values.';
        var p = { prompt: 'Is this relation a function? If it is <b>not</b>, type the input that has two different outputs. If it <b>is</b> a function, press <b>none</b>.' + fig,
          input: { type: 'fields', fields: [{ label: 'Input with two outputs:', name: 'Input', mode: 'math', keys: 'expr', none: true, placeholder: 'e.g. 3  or  none' }] },
          check: chk, key: [isFn ? 'none' : String(bx)], answer: isFn ? '<b>none</b> — it is a function.' : t(bx) + ' — so it is not a function.',
          solution: isFn ? (rep === 'arrow' ? 'Each value on the left has exactly one arrow leaving it' : 'Each input ' + andT(I.xs) + ' appears only once') + (shY != null ? ' (the output ' + t(shY) + ' is shared by ' + andT(I.shared[0].xs) + ', which is allowed)' : '') + ': it <b>is a function</b>, so the answer is <b>none</b>.'
            : 'The input ' + t(bx) + ' is paired with ' + andT(I.breakers[0].ys) + ': one input, two outputs, so it is <b>not a function</b>. The answer is ' + t(bx) + '.',
          hints: [how, 'Outputs are allowed to repeat; inputs with two different outputs are not.'], text: 'which input breaks it: ' + rep };
        p.bad = isFn ? [[String(pairs[0][0])]].concat(shY != null && !I.xs.some(function (x) { return same(x, shY); }) ? [[String(shY)]] : []) : [['none'], [String(I.breakers[0].ys[0])]];
        p.bad = p.bad.filter(function (b) { return chk(b).v !== 'correct'; });
        return p;
      } }] },
    { num: '10', outcome: 'RF2', stem: 'Each grid square is 1 unit. The graph is continuous and stops at the two solid dots.', parts: [
      { id: '10', outcome: 'RF2', level: 'PRG', make: function (r) {
        var s = find(function () {
          var peak = r.chance(0.5), L = [r.int(-5, -3), 0], M = [r.int(-1, 1), 0], Rp = [r.int(3, 5), 0], extra = r.chance(0.4);
          if (peak) { M[1] = r.int(2, 5); L[1] = r.int(-3, 1); Rp[1] = r.int(-3, 1); } else { M[1] = r.int(-5, -2); L[1] = r.int(-1, 3); Rp[1] = r.int(-1, 3); }
          var V = [L, M, Rp];
          if (extra) { var N2 = [Math.round((M[0] + Rp[0]) / 2) + (r.chance(0.5) ? 0 : 1), 0]; N2[1] = Math.round((M[1] + Rp[1]) / 2) + (peak ? -1 : 1); V = [L, M, N2, Rp]; }
          return { peak: peak, V: V };
        }, function (s) { var V = s.V, ys = V.map(function (p) { return p[1]; }); return V.every(function (p, i) { return !i || p[0] > V[i - 1][0]; }) && V[0][1] !== V[V.length - 1][1] && (s.peak ? Math.max.apply(null, ys) === s.V[1][1] : Math.min.apply(null, ys) === s.V[1][1]) && ys.filter(function (y) { return y === s.V[1][1]; }).length === 1; },
          { peak: true, V: [[-4, -1], [0, 4], [4, -2]] });
        var V = s.V, xs = V.map(function (p) { return p[0]; }), ys = V.map(function (p) { return p[1]; }), lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys), L = V[0], Rp = V[V.length - 1];
        var D = cond('x', L[0], Rp[0]), R = cond('y', lo, hi);
        var endsR = cond('y', Math.min(L[1], Rp[1]), Math.max(L[1], Rp[1]));
        var rW = [{ is: endsR, code: 'dr-peak', hint: 'The range isn’t just the endpoints’ ' + t('y') + '-values: the ' + (s.peak ? 'highest' : 'lowest') + ' point is the corner ' + t(pT(V[1])) + '.' }];
        var dW = [{ is: cond('x', Math.min(L[1], Rp[1]), Math.max(L[1], Rp[1])), code: 'set-swap', hint: 'Those are ' + t('y') + '-values of the endpoints. The domain uses their ' + t('x') + '-values.' }];
        return drPart('State the domain and the range, using inequalities or set notation.' + G({ segs: [{ pts: V, start: 'closed', end: 'closed' }], aria: 'a continuous graph made of line segments with solid end dots' }), D, R, { dW: dW, rW: rW },
          '<b>Domain</b>: the graph runs from the leftmost point ' + t(pT(L)) + ' to the rightmost point ' + t(pT(Rp)) + ', and both end dots are solid: ' + t(D) + '.<br><b>Range</b>: scan the whole graph, not just the ends. The lowest point is ' + t(pT(V[ys.indexOf(lo)])) + ' and the highest is ' + t(pT(V[ys.indexOf(hi)])) + ': ' + t(R) + '.',
          [HINT_D, 'The highest or lowest point may be a corner in the middle of the graph.'], 'D & R of a continuous graph');
      } }] },

    /* ======================= RF4 — PRG ======================= */
    { num: '11', outcome: 'RF4',
      shared: function (r) { var c = r.pick(PAT11); return { c: c, a: r.int(3, 8), d: r.int(2, 4), N: r.int(10, 15) }; },
      stem: function (s) { var c = s.c; return c.what + '. ' + c.fig + ' 1 has ' + t(s.a) + ' ' + c.unit + ', and each new ' + c.fig.toLowerCase() + ' has ' + t(s.d) + ' more ' + c.unit + ' than the one before.'; },
      parts: [
        { id: '11a', sub: 'a', outcome: 'RF4', level: 'PRG', make: function (r, s) {
          var c = s.c, N = s.N, val = s.a + s.d * (N - 1);
          return numPart('How many ' + c.unit + ' are in ' + c.fig + ' ' + t(N) + '?', val, [{ v: s.a + s.d * N, code: 'u5t-pat-off1', hint: c.fig + ' 2 has ' + t(s.a) + ' plus <b>one</b> group of ' + t(s.d) + '. ' + c.fig + ' ' + N + ' has ' + t(N - 1) + ' groups added, not ' + t(N) + '.' },
            { v: s.d * N, code: 'u5t-pat-nobase', hint: 'Start from the ' + t(s.a) + ' ' + c.unit + ' in ' + c.fig + ' 1, then add ' + t(s.d) + ' for each new ' + c.fig.toLowerCase() + '.' }, { v: s.a * N, code: 'u5t-pat-mult', hint: 'Each new ' + c.fig.toLowerCase() + ' adds ' + t(s.d) + ', not another ' + t(s.a) + '.' }],
            c.fig + ' 1 has ' + t(s.a) + '; going from ' + c.fig + ' 1 to ' + c.fig + ' ' + N + ' adds ' + t(s.d) + ' a total of ' + t(N - 1) + ' times: ' + t(s.a + '+' + (N - 1) + '\\times ' + s.d + '=' + s.a + '+' + (N - 1) * s.d + '=' + val) + ' ' + c.unit + '.',
            ['Make a table, or count how many times ' + t(s.d) + ' is added between ' + c.fig + ' 1 and ' + c.fig + ' ' + N + '.'], 'pattern value far out', { after: c.unit });
        } },
        { id: '11b', sub: 'b', outcome: 'RF4', level: 'PRG', make: function (r, s) {
          var c = s.c, pts = [1, 2, 3, 4, 5].map(function (n) { return [n, s.a + s.d * (n - 1)]; }), key = gv(pts.map(function (p) { return p.slice(); }));
          var Ymax = Math.ceil((pts[4][1] + 2) / 2) * 2, ly = Ymax > 20 ? 4 : 2;
          var wr = [{ is: gv(pts.map(function (p) { return [p[0] - 1, p[1]]; })), code: 'u5t-plot-shift', hint: 'Each point is one place too far left: ' + c.fig + ' 1 goes at ' + t(c.fig.charAt(0).toLowerCase() === 'r' ? 'n=1' : 'n=1') + ', not at 0.' },
            { is: gv(pts.map(function (p) { return [p[0], s.d * p[0]]; })), code: 'u5t-pat-nobase', hint: 'Check ' + c.fig + ' 1: it has ' + t(s.a) + ' ' + c.unit + ', so its point is ' + t(pT([1, s.a])) + '.' }];
          var p = K.P.graph('Plot the points ' + t('(n,\\ ' + c.L + ')') + ' for ' + c.fig + 's 1 to 5 on the grid, where ' + t('n') + ' is the ' + c.fig.toLowerCase() + ' number and ' + t(c.L) + ' is the number of ' + c.unit + '. (Tap to place a point; tap it again to remove it.)',
            { x: [0, 6], y: [0, Ymax], grid: 1, gridY: 1, labels: 1, labelsX: 1, labelsY: ly, firstQuadrant: true, xName: 'n', yName: c.L, unitX: 44, unitY: Math.min(24, 300 / Ymax), mode: 'points', snapX: 1, snapY: 1, max: 360 },
            exactChk(key, { wrong: wr.filter(function (w) { return !DR.same(w.is, key); }) }), key,
            'The table is ' + pts.map(function (q) { return t(pT(q)); }).join(', ') + '. Plot each pair: across to the ' + c.fig.toLowerCase() + ' number, up to the number of ' + c.unit + '. The points line up, rising ' + t(s.d) + ' for each step to the right.',
            ['Make the table first: start at ' + t(s.a) + ' and add ' + t(s.d) + ' each time.', 'Across to ' + t('n') + ', then up to ' + t(c.L) + '.'], 'plot a pattern');
          p.bad = wr.map(function (w) { return w.is; }).filter(function (b) { return !DR.same(b, key); });
          return p;
        } },
        { id: '11c', sub: 'c', outcome: 'RF4', level: 'PRG', make: function (r) {
          var st = r.int(1, 9), k = r.int(3, 8), xs = [1, 2, 3, 4, 5, 6], ys = xs.map(function (x) { return st + k * (x - 1); }), miss = r.pick([[2, 5], [2, 4], [3, 5], [1, 4]]);
          var tab = HW.valueTable([[t('x')].concat(xs), [t('y')].concat(ys.map(function (y, i) { return miss.indexOf(i) >= 0 ? '?' : y; }))]);
          var chk = function (resp) {
            resp = resp || []; var a = parseNum(resp[0]), b = parseNum(resp[1]);
            if (a == null || b == null) return form('empty', 'Fill in both missing values.');
            if (same(a, ys[miss[0]]) && same(b, ys[miss[1]])) return ok();
            if (same(a, ys[miss[0]])) return wrong('value', 'The first value is right. Keep adding ' + t(k) + ' to find the other one.');
            return wrong('u5t-miss-step', 'Find the step first: the outputs grow by the same amount each time. Compare two values that are side by side.');
          };
          var keys = [String(ys[miss[0]]), String(ys[miss[1]])];
          return { prompt: 'A different relation: the outputs in this table grow by the same amount each time. Find the two missing outputs.' + tab, input: { type: 'fields', fields: [{ label: 'When ' + t('x=' + xs[miss[0]]) + ':', name: 'x = ' + xs[miss[0]], before: t('y=') }, { label: 'When ' + t('x=' + xs[miss[1]]) + ':', name: 'x = ' + xs[miss[1]], before: t('y=') }] },
            check: chk, key: keys, answer: t('y=' + keys[0]) + ' and ' + t('y=' + keys[1]),
            solution: 'Two outputs side by side differ by ' + t(k) + ', so the pattern adds ' + t(k) + ' each time: ' + t(ys.join(',\\ ')) + '. The missing outputs are ' + t(keys[0]) + ' and ' + t(keys[1]) + '.',
            hints: ['Find two outputs that are side by side and subtract to get the step.'], text: 'missing outputs in a linear table',
            bad: [[String(ys[miss[0]] + 1), String(ys[miss[1]] + 1)], [String(ys[miss[0]]), String(ys[miss[1]] + k)]] };
        } }] },

    /* ======================= RF5 — PRG ======================= */
    { num: '12', outcome: 'RF5',
      shared: function (r) { var kind = r.pick(['card', 'trip', 'candle', 'battery']), c = INT12[kind], pr = r.pick(c.pairs); return { kind: kind, y0: pr[0], x0: pr[1], nm: r.pick(NAMES) }; },
      stem: function (q) { return INT12[q.kind].s(q) + int12Fig(q); },
      parts: [
        { id: '12a', sub: 'a', outcome: 'RF5', level: 'PRG', make: function (r, q) {
          var c = INT12[q.kind];
          return interceptsPart('State the intercept on each axis as an ordered pair ' + t('(' + c.xn + ',\\ ' + c.yn + ')') + '.', q.x0, q.y0,
            { xn: c.xn, yn: c.yn, xLab: t(c.xn) + '-intercept (horizontal axis)', yLab: t(c.yn) + '-intercept (vertical axis)',
              sol: 'The graph meets the vertical (' + t(c.yn) + ') axis at ' + t(pT([0, q.y0])) + ' and the horizontal (' + t(c.xn) + ') axis at ' + t(pT([q.x0, 0])) + '.', hints: ['Where does the line touch each axis? On the ' + t(c.yn) + '-axis ' + t(c.xn + '=0') + '; on the ' + t(c.xn) + '-axis ' + t(c.yn + '=0') + '.'], text: 'context intercepts: ' + q.kind });
        } },
        { id: '12b', sub: 'b', outcome: 'RF5', level: 'PRG', make: function (r, q) {
          var c = INT12[q.kind], cols = r.shuffle([{ id: 'A', html: c.vint(q) }, { id: 'B', html: c.hint(q) }, { id: 'C', html: c.d1(q) }, { id: 'D', html: c.d2(q) }]);
          var why = function (id) { return { code: 'u5t-mean', hint: id === 'v' ? 'At the ' + t(c.yn) + '-intercept, ' + t(c.xn + '=0') + ': it is the value at the very start. Read its units on the vertical axis.' : 'At the ' + t(c.xn) + '-intercept, ' + t(c.yn + '=0') + ': it is when nothing is left. Read its units on the horizontal axis.' }; };
          return gridPart('What does each intercept mean here? Choose the meaning of each one.', [{ id: 'v', html: 'The ' + t(c.yn) + '-intercept, ' + t(pT([0, q.y0])) }, { id: 'h', html: 'The ' + t(c.xn) + '-intercept, ' + t(pT([q.x0, 0])) }], cols, { v: 'A', h: 'B' }, why,
            t(pT([0, q.y0])) + ': ' + c.vint(q) + '<br>' + t(pT([q.x0, 0])) + ': ' + c.hint(q) + '<br>The vertical intercept is the starting value; the horizontal intercept is when the quantity reaches zero.',
            ['At the vertical intercept, ' + t(c.xn + '=0') + ' (the start). At the horizontal intercept, ' + t(c.yn + '=0') + ' (nothing left).'], 'meaning of intercepts: ' + q.kind, 'u5t-mean-one', 'u5t-mean');
        } },
        { id: '12c', sub: 'c', outcome: 'RF5', level: 'PRG', make: function (r) {
          var w = find(function () { var m = r.pick([2, 3, 4, 5, 6, 8]) * (r.chance(0.6) ? 1 : -1), p = r.pick([4, 5, 6, 7, 8, 9, 10, 12]) * (r.chance(0.7) ? 1 : -1); return { m: m, p: p, b: -m * p }; },
            function (w) { return Math.abs(w.b) >= 12 && Math.abs(w.b) <= 72; }, { m: 5, p: 8, b: -40 });
          var nm = r.pick(NAMES), r5 = function (v, up) { return up ? Math.ceil(v / 5) * 5 : Math.floor(v / 5) * 5; };
          var xmin = Math.min(0, w.p) - 2, xmax = Math.max(0, w.p) + 2, ymin = r5(Math.min(0, w.b) - 5, false), ymax = r5(Math.max(0, w.b) + 5, true);
          var wy0 = r5(Math.min(0, -w.b) - 5, false), wy1 = r5(Math.max(0, -w.b) + 5, true);
          var win = function (a, b, c, d) { return t('x\\!:\\ [' + a + ',\\ ' + b + '],\\quad y\\!:\\ [' + c + ',\\ ' + d + ']'); };
          var eq = 'y=' + lin(w.m, w.b);
          var o = [{ html: win(xmin, xmax, ymin, ymax), right: true },
            { html: win(-10, 10, -10, 10) + ' (the standard window)', why: 'The ' + t('y') + '-intercept is ' + t(pT([0, w.b])) + ', and ' + t(w.b) + ' is outside ' + t('-10\\le y\\le 10') + ': the standard window cuts it off.' },
            { html: win(ymin, ymax, xmin, xmax), why: 'The two ranges are swapped: the ' + t('x') + '-intercept ' + t(w.p) + ' must fit in the ' + t('x') + ' range, and the ' + t('y') + '-intercept ' + t(w.b) + ' in the ' + t('y') + ' range.' },
            { html: win(xmin, xmax, wy0, wy1), why: 'Check the sign of the ' + t('y') + '-intercept: at ' + t('x=0') + ', ' + t('y=' + w.b) + ', which is outside ' + t('y\\!:\\ [' + wy0 + ',\\ ' + wy1 + ']') + '.' }];
          return P.mc(r, 'A different relation: ' + nm + ' graphs ' + t(eq) + ' on a graphing calculator. Find its intercepts, then choose the window that shows <b>both</b> intercepts.', o,
            t('x') + '-intercept: set ' + t('y=0') + ': ' + t('0=' + lin(w.m, w.b) + ',\\ x=' + w.p) + ', the point ' + t(pT([w.p, 0])) + '. ' + t('y') + '-intercept: set ' + t('x=0') + ': ' + t('y=' + w.b) + ', the point ' + t(pT([0, w.b])) + '.<br>A good window reaches a little past both: ' + win(xmin, xmax, ymin, ymax) + '. The standard window only shows ' + t('y') + '-values from ' + t('-10') + ' to ' + t('10') + '.',
            ['Find the intercepts first: set ' + t('y=0') + ' for the ' + t('x') + '-intercept and ' + t('x=0') + ' for the ' + t('y') + '-intercept.', 'Xmin/Xmax must reach past the ' + t('x') + '-intercept; Ymin/Ymax past the ' + t('y') + '-intercept.'], 'window for ' + eq);
        } }] },

    /* ======================= RF8 — PRG ======================= */
    { num: '13', outcome: 'RF8',
      shared: function (r) {
        return find(function () { var c = r.int(5, 12), m = r.int(2, 4), n = r.int(-4, -1), x0 = r.int(1, 5); return { c: c, m: m, n: n, x0: x0, k: c - m * x0 }; },
          function (s) { var v = s.c - s.m * s.n; return s.k !== s.x0 && s.k !== 0 && s.k !== s.n && Math.abs(s.k) !== Math.abs(v) && s.x0 !== Math.abs(s.n) && s.c - s.m * s.k !== s.x0; }, { c: 7, m: 2, n: -3, x0: 5, k: -3 });
      },
      stem: function (s) { return 'Function ' + t('h') + ' is defined by ' + t('h(x)=' + linB(s.c, -s.m)) + '.'; },
      parts: [
        { id: '13a', sub: 'a', outcome: 'RF8', level: 'PRG', make: function (r, s) {
          var rule = linB(s.c, -s.m), val = s.c - s.m * s.n;
          return numPart('Evaluate ' + t('h(' + s.n + ')') + '.', val, [{ v: s.c + s.m * s.n, code: 'ev-sign', hint: 'Check the signs: ' + t('-' + s.m + '\\times(' + s.n + ')=+' + (-s.m * s.n)) + ' (a negative times a negative is positive).' }, { v: -s.c - s.m * s.n, code: 'ev-sign', hint: 'Check the sign of the constant: the rule starts with ' + t('+' + s.c) + '.' }, { v: s.c - s.m + s.n, code: 'u5t-ev-add', hint: t(s.m + 'x') + ' means ' + t(s.m + '\\times x') + ': multiply.' }, { v: (s.c - s.m) * s.n, code: 'u5t-ev-add', hint: 'Order of operations: multiply ' + t(s.m + '\\times(' + s.n + ')') + ' first, then subtract from ' + t(s.c) + '.' }],
            t('h(' + s.n + ')=' + s.c + '-' + s.m + '(' + s.n + ')=' + s.c + '+' + (-s.m * s.n) + '=' + val), ['Replace ' + t('x') + ' with ' + t('(' + s.n + ')') + ' — keep the brackets. A negative times a negative is positive.'], 'h(' + s.n + ')', { before: t('h(' + s.n + ')=') });
        } },
        { id: '13b', sub: 'b', outcome: 'RF8', level: 'PRG', make: function (r, s) {
          var rule = linB(s.c, -s.m), k = s.k;
          return numPart('Solve ' + t('h(x)=' + k) + ': find the input that gives the output ' + t(k) + '.', s.x0, [{ v: s.c - s.m * k, code: 'u5t-ev-instead', hint: 'That is ' + t('h(' + k + ')') + '. Here ' + t(k) + ' is the <b>output</b>: solve ' + t(rule + '=' + k) + ' for ' + t('x') + '.' }, { v: -s.x0, code: 'fn-solve-sign', hint: 'Check the sign when you divide by ' + t(-s.m) + '.' }, { v: cl((s.c + k) / s.m), code: 'fn-solve-inverse', hint: 'To undo ' + t('+' + s.c) + ', subtract ' + t(s.c) + ' from both sides.' }, { v: s.c - k, code: 'fn-solve-divide', hint: 'Last step: divide both sides by ' + t(-s.m) + '.' }],
            t(rule + '=' + k) + '<br>' + t('-' + s.m + 'x=' + k + '-' + s.c + '=' + (k - s.c)) + '<br>' + t('x=' + s.x0) + '<br>Check: ' + t('h(' + s.x0 + ')=' + s.c + '-' + s.m + '(' + s.x0 + ')=' + k) + ' ✓',
            ['In ' + t('h(x)=' + k) + ', ' + t(k) + ' is the output. Set the rule equal to ' + t(k) + ' and solve for ' + t('x') + '.', 'Or try inputs until the output is ' + t(k) + '.'], 'solve h(x)=' + k, { before: t('x=') });
        } },
        { id: '13c', sub: 'c', outcome: 'RF8', level: 'PRG', make: function (r) {
          var g = find(function () { var sl = r.pick([[1, 2], [-1, 2], [2, 1], [-2, 1], [1, 1], [-1, 1], [3, 1], [-3, 1]]), b = r.int(-3, 3), m = sl[0] / sl[1], xs = range(-5, 5).filter(function (x) { return x % sl[1] === 0 && Math.abs(m * x + b) <= 5 && x !== 0; }); if (!xs.length) return null; var x = r.pick(xs); return { m: m, b: b, x: x, k: cl(m * x + b) }; },
            function (g) { return g.k !== g.x && g.k !== 0 && Math.abs(g.k) <= 5; }, { m: 0.5, b: 1, x: 4, k: 3 });
          var ends = lineThrough([0, g.b], g.m), fk = cl(g.m * g.k + g.b);
          return numPart('The graph of the function ' + t('f') + ' is shown. Find the value of ' + t('x') + ' if ' + t('f(x)=' + g.k) + '.' + G({ segs: [{ pts: ends, start: 'arrow', end: 'arrow' }], yName: 'y', aria: 'graph of a line y = f(x)' }), g.x,
            [{ v: Number.isInteger(fk) && Math.abs(fk) <= 6 ? fk : null, code: 'u5t-read-swap', hint: 'You found ' + t('f(' + g.k + ')') + '. Here ' + t(g.k) + ' is the <b>output</b>: start at ' + t(g.k) + ' on the vertical axis, go across to the line, then down or up to the ' + t('x') + '-axis.' }, { v: -g.x, code: 'ev-sign', hint: 'Check the sign: is that point left or right of the ' + t('y') + '-axis?' }],
            'Start at ' + t(g.k) + ' on the vertical axis, go across to the line, then read straight ' + (g.k > 0 ? 'down' : 'up') + ' to the ' + t('x') + '-axis: the point is ' + t(pT([g.x, g.k])) + ', so ' + t('x=' + g.x) + '.',
            ['In ' + t('f(x)=' + g.k) + ', ' + t(g.k) + ' is an output (a ' + t('y') + '-value). Find it on the vertical axis first.'], 'x with f(x)=' + g.k + ' from a graph', { before: t('x=') });
        } }] },

    /* ======================= RF1 — MAS ======================= */
    { num: '14', outcome: 'RF1',
      shared: function (r) {
        var kind = r.pick(['bath', 'bath', 'balloon']);
        return find(function () {
          var a = r.pick([4, 6, 8]), b = r.pick([6, 8, 10, 12]), c = r.pick([4, 6, 8, 10, 12]), D = kind === 'bath' ? r.pick([24, 30, 36, 40]) : r.pick([60, 80, 100, 120]), nm = r.pick(NAMES);
          return { kind: kind, a: a, b: b, c: c, D: D, nm: nm, she: !!SHE[nm] };
        }, function (s) { return s.D % s.c === 0 && s.c !== s.a && s.a + s.b + s.c <= 30; }, { kind: 'bath', a: 6, b: 10, c: 8, D: 24, nm: 'Mia', she: true });
      },
      stem: function (s) {
        return s.kind === 'bath' ? s.nm + ' runs a bath. For the first ' + t(s.a) + ' minutes the tap fills the tub at a steady rate, and the water depth rises from ' + t('0') + ' to ' + t(s.D) + ' cm. ' + (s.she ? 'She' : 'He') + ' then soaks for ' + t(s.b) + ' minutes, and the depth stays the same. Finally ' + (s.she ? 'she' : 'he') + ' pulls the plug, and the tub drains at a steady rate back to ' + t('0') + ' cm over the next ' + t(s.c) + ' minutes.'
          : 'A hot-air balloon lifts off from the ground and rises at a steady rate to ' + t(s.D) + ' m in ' + t(s.a) + ' minutes. It stays at that height for ' + t(s.b) + ' minutes, then comes down at a steady rate and lands ' + t(s.c) + ' minutes later.';
      },
      parts: [
        { id: '14a', sub: 'a', outcome: 'RF1', level: 'MAS', make: function (r, s) {
          var a = s.a, b = s.b, c = s.c, D = s.D, tot = a + b + c, X = Math.ceil((tot + 2) / 4) * 4, bath = s.kind === 'bath', gy = bath ? (D % 6 === 0 ? 6 : D % 5 === 0 ? 5 : 4) : 20, Y = D + gy * 2;
          var st = bath ? ['filling', 'soaking', 'draining'] : ['rising', 'staying at the same height', 'coming down'], u = bath ? 'cm' : 'm';
          var chk = story({ phases: [{ dir: 'up', text: st[0], x0: 0, x1: a, y1: D }, { dir: 'flat', text: st[1], x1: a + b, y0: D, y1: D }, { dir: 'down', text: st[2], x1: tot, y1: 0 }], start: 0, startHint: 'The graph starts at ' + t('0') + (bath ? ' cm: the tub is empty at time 0.' : ' m: the balloon starts on the ground.'), end: 0, endHint: 'It ends back at ' + t('0') + '.', xUnit: 'min', yUnit: u,
            prep: function (Gs) { Gs = Gs.slice(); if (Gs.length > 1 && Gs[Gs.length - 1].dir === 'flat' && Math.abs(Gs[Gs.length - 1].y0) < 1e-9) Gs.pop(); return Gs; } });
          var inp = { x: [0, X], y: [0, Y], grid: 2, gridY: gy, labels: 4, labelsX: 4, labelsY: gy * (Y / gy > 8 ? 2 : 1), firstQuadrant: true, xName: 't', yName: bath ? 'd' : 'h', xTitle: 'Time (min)', yTitle: bath ? 'Water depth (cm)' : 'Height (m)', unitX: 340 / X, unitY: 220 / Y,
            snapX: 2, snapY: gy, defaultEnd: 'none', tools: ['line'], max: 400, help: 'Tap where the graph starts, then each corner in turn, left to right; tap the last point again to finish.' };
          var key = poly([[0, 0], [a, D], [a + b, D], [tot, 0]]);
          var p = K.P.graph('Sketch the graph of the ' + (bath ? 'water depth' : 'balloon’s height') + ' for the whole story on the grid.', inp, chk, key,
            'Three straight pieces: up from ' + t(pT([0, 0])) + ' to ' + t(pT([a, D])) + ' (' + st[0] + '), flat to ' + t(pT([a + b, D])) + ' (' + st[1] + ' for ' + t(b) + ' min), then down to ' + t(pT([tot, 0])) + ' (' + st[2] + ' for ' + t(c) + ' min).',
            ['Mark the times where the story changes: ' + t(a) + ', ' + t(a + b) + ' and ' + t(tot) + ' minutes.', 'Staying the same is a flat piece; going back to ' + t('0') + ' is a falling piece.'], 'sketch a story with numbers: ' + s.kind);
          p.bad = [poly([[0, 0], [a, D], [a + c, 0]]), poly([[0, 0], [a, D], [a + b, D], [a + b + a, 0]]), poly([[0, 0], [b, D], [a + b, D], [tot, 0]]), poly([[0, D], [a, 0], [a + b, 0], [tot, D]])].filter(function (q) { return chk(q).v !== 'correct'; });
          return p;
        } },
        { id: '14b', sub: 'b', outcome: 'RF1', level: 'MAS', make: function (r, s) {
          var bath = s.kind === 'bath', u = bath ? 'cm' : 'm', rate = -s.D / s.c, up = s.D / s.a;
          return numPart('What is the rate of change of the ' + (bath ? 'water depth while the tub drains' : 'height while the balloon comes down') + ', in ' + u + ' per minute? Include its sign.', rate,
            [{ v: -rate, code: 'rate-sign', hint: 'The ' + (bath ? 'depth' : 'height') + ' goes <b>down</b>, so the rate of change is negative.' }, { v: -s.D, code: 'u5t-rate-rise', hint: 'That is the whole change. Divide it by the ' + t(s.c) + ' minutes it took.' }, { v: s.D, code: 'u5t-rate-rise', hint: 'That is the whole change (and it is a drop). Divide by the ' + t(s.c) + ' minutes it took.' }, { v: cl(up), code: 'u5t-rate-seg', hint: 'That is the rate while it ' + (bath ? 'fills' : 'rises') + '. Use the last stage: ' + t(s.D) + ' ' + u + ' down in ' + t(s.c) + ' minutes.' }, { v: cl(-up), code: 'u5t-rate-seg', hint: 'Use the last stage: ' + t(s.D) + ' ' + u + ' in ' + t(s.c) + ' minutes, not ' + t(s.a) + '.' }, { v: cl(-s.c / s.D), code: 'rate-flip', hint: 'Rate of change is change in ' + (bath ? 'depth' : 'height') + ' ÷ change in time — your division is upside down.' }],
            'While it ' + (bath ? 'drains' : 'comes down') + ', the ' + (bath ? 'depth' : 'height') + ' goes from ' + t(s.D) + ' to ' + t('0') + ' ' + u + ' in ' + t(s.c) + ' minutes: rate of change ' + t('=\\dfrac{0-' + s.D + '}{' + s.c + '}=' + nT(rate)) + ' ' + u + ' per minute. It is negative because the ' + (bath ? 'depth' : 'height') + ' decreases.',
            ['Rate of change = change in ' + (bath ? 'depth' : 'height') + ' ÷ change in time, for the last stage only.'], 'draining rate', { after: u + '/min' });
        } }] },
    { num: '15', outcome: 'RF1', shared: function (r) { return { c: r.pick(BADSK), nm: r.pick(['Jordan', 'Liam', 'Ethan', 'Noah', 'Kai', 'Dev']) }; },
      stem: function (s) { var c = s.c; return 'A student, ' + s.nm + ', sketched this graph to show his distance from the classroom door during part of a school day.' + HW.graph({ x: [0, 10], y: c.y, grid: 0, labels: 0, firstQuadrant: c.y[0] >= 0, xName: ' ', yName: ' ', xTitle: 'Time', yTitle: 'Distance from door', unit: 24, segs: c.segs, max: 300, aria: 'a sketched graph in which ' + c.what }); },
      parts: [
        { id: '15', outcome: 'RF1', level: 'MAS', make: function (r, s) {
          var c = s.c, o = [{ html: c.right, right: true }].concat(c.wrong.map(function (w) { return { html: w[0], why: w[1] }; }));
          return P.mc(r, 'Explain why this graph cannot correctly show his distance from the door over time. Choose the correct explanation.', o,
            'In this sketch ' + c.what + '. ' + c.right + ' A real distance–time graph has exactly one distance at each time (it passes the vertical line test) and never goes below ' + t('0') + '.',
            ['At one moment in time, how many distances from the door can he have?'], 'why the sketch is impossible: ' + c.id);
        } }] },

    /* ======================= RF2 — MAS ======================= */
    { num: '16', outcome: 'RF2',
      shared: function (r) {
        var D = r.sample(range(-3, 9), 3).sort(function (a, b) { return a - b; }), R = r.sample(range(-4, 10), 2).sort(function (a, b) { return a - b; }), poss = r.chance(0.5), R2;
        if (poss) R2 = r.chance(0.5) ? [r.pick(range(-3, 9))] : r.sample(range(-4, 10), 2).sort(function (a, b) { return a - b; });
        else R2 = uniq(R.concat(r.sample(range(-4, 10).filter(function (y) { return R.indexOf(y) < 0; }), 2)));
        return { D: D, R: R, R2: R2, poss: poss };
      },
      stem: 'A function pairs every input with exactly one output.',
      parts: [
        { id: '16a', sub: 'a', outcome: 'RF2', level: 'MAS', make: function (r, s) {
          var n = 3, need = 4;
          var key = s.D.map(function (x, i) { return [x, s.R[i % 2]]; }), extraY = s.R.filter(function (y) { return y !== key[2][1]; })[0]; key.push([s.D[2], extraY]);
          var chk = function (resp) {
            var L = readPairs(resp);
            if (L.empty) return form('empty', 'Type your ordered pairs first.');
            if (L.bad) return form('unreadable', 'Write ordered pairs in brackets, separated by commas, e.g. ' + t('\\{(1, 4), (2, 7)\\}') + '.');
            var ps = L.pairs, I = info(ps);
            if (I.isFn) return wrong('u5t-ex-fn', 'Every input in your set has only one output, so it <b>is</b> a function. To break it, one input must appear in two pairs with different outputs.');
            if (!setEqA(I.xs, s.D)) return wrong('u5t-ex-dom', 'The first numbers must be exactly the domain ' + t(lst(s.D)) + ' — every value used, and no others. Yours are ' + t(lst(I.xs)) + '.');
            if (!setEqA(I.ys, s.R)) return wrong('u5t-ex-range', 'The second numbers must be exactly the range ' + t(lst(s.R)) + ' — every value used, and no others. Yours are ' + t(lst(I.ys)) + '.');
            if (ps.length !== need) return wrong('u5t-ex-count', 'The question asks for exactly ' + t(need) + ' ordered pairs; you have ' + t(ps.length) + '.');
            return ok();
          };
          var keyTex = '\\{' + key.map(function (q) { return '(' + q[0] + ', ' + q[1] + ')'; }).join(', ') + '\\}';
          var p = P.math('Write a set of <b>four</b> ordered pairs for a relation with domain ' + t(lst(s.D)) + ' and range ' + t(lst(s.R)) + ' that is <b>not</b> a function.', chk, keyTex,
            'For example ' + t(setT(key)) + '. There are ' + t(need) + ' pairs but only ' + t(n) + ' inputs, so one input (' + t(s.D[2]) + ' here) appears twice, with two different outputs: <b>not a function</b>. Every domain value and every range value is used.',
            ['With ' + t(need) + ' pairs and only ' + t(n) + ' inputs, one input has to be used twice.', 'Give that input two <b>different</b> outputs, and use both range values.'], 'example: not a function', { keys: 'pairs', placeholder: 'e.g. {(1, 4), (2, 7)}' });
          p.answer = 'One example: ' + t(setT(key)) + '.';
          p.bad = ['\\{' + s.D.map(function (x, i) { return '(' + x + ', ' + s.R[i % 2] + ')'; }).join(', ') + '\\}', '\\{' + key.slice(0, 2).concat([[s.D[2], key[2][1]], [s.D[2], extraY], [s.D[0], key[0][1] === extraY ? s.R.filter(function (y) { return y !== extraY; })[0] : extraY]]).map(function (q) { return '(' + q[0] + ', ' + q[1] + ')'; }).join(', ') + '\\}'];
          return p;
        } },
        { id: '16b', sub: 'b', outcome: 'RF2', level: 'MAS', make: function (r, s) {
          var n = 3, R2 = s.R2, m = R2.length;
          var key = s.poss ? s.D.map(function (x, i) { return [x, R2[i % m]]; }) : null;
          var chk = function (resp) {
            var raw = Array.isArray(resp) ? resp[0] : resp;
            if (!String(raw == null ? '' : raw).trim()) return form('empty', 'Type a function, or press <b>none</b>.');
            if (isNoneS(raw)) return s.poss ? wrong('u5t-said-none', 'It is possible. Each input needs exactly one output, and outputs may be shared: give every input one of the values ' + t(lst(R2)) + ', using each at least once.') : ok();
            var L = readPairs(raw);
            if (L.bad || L.empty) return form('unreadable', 'Write ordered pairs in brackets, e.g. ' + t('\\{(1, 4), (2, 7)\\}') + ', or press <b>none</b>.');
            var I = info(L.pairs);
            if (!s.poss) return wrong('u5t-fn-impossible', 'Check your example: ' + (I.isFn ? (setEqA(I.ys, R2) ? '' : 'its range is ' + t(lst(I.ys)) + ', not ' + t(lst(R2)) + '. ') : 'it is not a function. ') + 'A function gives each of the ' + t(n) + ' inputs exactly one output, so it has at most ' + t(n) + ' different outputs — but this range has ' + t(m) + '. It can’t be done: <b>none</b>.');
            if (!I.isFn) return wrong('u5t-ex-notfn', 'That isn’t a function: an input appears with two different outputs.');
            if (!setEqA(I.xs, s.D)) return wrong('u5t-ex-dom', 'The first numbers must be exactly ' + t(lst(s.D)) + '.');
            if (!setEqA(I.ys, R2)) return wrong('u5t-ex-range', 'The outputs must be exactly ' + t(lst(R2)) + ' — every value used, and no others.');
            return ok();
          };
          var p = { prompt: 'Could a <b>function</b> have the domain ' + t(lst(s.D)) + ' and the range ' + t(lst(R2)) + '? If it can, write one as a set of ordered pairs. If it can’t, press <b>none</b>.',
            input: { type: 'fields', fields: [{ label: 'Function:', name: 'Function', mode: 'math', keys: 'pairs', none: true, wide: true, placeholder: 'e.g. {(1, 4), (2, 7)}  or  none' }] },
            check: chk, key: [s.poss ? '\\{' + key.map(function (q) { return '(' + q[0] + ', ' + q[1] + ')'; }).join(', ') + '\\}' : 'none'],
            answer: s.poss ? 'Yes, for example ' + t(setT(key)) + '.' : '<b>No</b> — none.',
            solution: s.poss ? '<b>Yes.</b> Give each input exactly one output from ' + t(lst(R2)) + ', using every value: for example ' + t(setT(key)) + '. Several inputs may share an output, so a range smaller than the domain is fine.'
              : '<b>No.</b> A function pairs each of the ' + t(n) + ' inputs with exactly one output, so it has at most ' + t(n) + ' different outputs. This range has ' + t(m) + ' values, so no function can have it.',
            hints: ['Each input gets exactly one output. How many different outputs can ' + t(n) + ' inputs make, at most?'], text: 'could a function have this D and R' };
          p.bad = s.poss ? [['none'], ['\\{' + s.D.map(function (x) { return '(' + x + ', ' + R2[0] + ')'; }).concat(m > 1 ? [] : ['(' + s.D[0] + ', ' + (R2[0] + 1) + ')']).join(', ') + '\\}']] : [['\\{' + s.D.map(function (x, i) { return '(' + x + ', ' + R2[i] + ')'; }).join(', ') + '\\}']];
          return p;
        } }] },
    { num: '17', outcome: 'RF2',
      shared: function (r) {
        var c = r.pick(['candle', 'tank', 'temp', 'battery']), q;
        if (c === 'candle') q = find(function () { return { H: r.pick([20, 24, 30, 36]), k: r.pick([2, 3, 4, 5, 6]) }; }, function (q) { return q.H % q.k === 0 && q.H / q.k >= 4 && q.H / q.k <= 12; }, { H: 20, k: 2 });
        else if (c === 'tank') q = find(function () { return { s0: r.pick([20, 40, 50, 60]), k: r.pick([10, 20, 25]), T: r.int(8, 20) }; }, function (q) { return q.s0 + q.k * q.T <= 600; }, { s0: 40, k: 25, T: 20 });
        else if (c === 'temp') q = { A: r.pick([12, 15, 18, 20]), k: r.pick([2, 3]), H: r.pick([[3, 'midnight'], [6, '3 am'], [9, '6 am']]) };
        else q = { k: r.pick([4, 5, 10, 20, 25]) };
        q.c = c; return q;
      },
      stem: function (q) {
        if (q.c === 'candle') return 'A candle is ' + t(q.H) + ' cm tall when it is lit, and it burns down ' + t(q.k) + ' cm every hour. Its height is ' + t('h=' + linB(q.H, -q.k, 't')) + ' cm, ' + t('t') + ' hours after it is lit. The candle is not relit.';
        if (q.c === 'tank') return 'A water tank already holds ' + t(q.s0) + ' L when a hose is turned on. The volume is ' + t('V=' + linB(q.s0, q.k, 't')) + ' litres, ' + t('t') + ' minutes after the hose is turned on. The tank is full at ' + t(q.s0 + q.k * q.T) + ' L, and then the hose is turned off.';
        if (q.c === 'temp') return 'The temperature outside drops steadily overnight: ' + t('T=' + linB(q.A, -q.k, 'h')) + ' °C, ' + t('h') + ' hours after 9 pm. Recording stops at ' + q.H[1] + ' (' + t(q.H[0]) + ' hours after 9 pm).';
        return 'A phone is unplugged with a full battery (100%). Its charge is ' + t('B=' + linB(100, -q.k, 't')) + ' %, ' + t('t') + ' hours after it is unplugged, until the battery is empty.';
      },
      parts: [
        { id: '17', outcome: 'RF2', level: 'MAS', make: function (r, q) {
          var dv, rv, D, R, dW = [], rW = [], sol;
          if (q.c === 'candle') {
            var z = q.H / q.k; dv = 't'; rv = 'h'; D = cond('t', 0, z); R = cond('h', 0, q.H);
            dW = [{ is: cond('t', 0, null), code: 'u5t-ctx-noend', hint: 'The candle burns out at ' + t('t=' + z) + ' (when ' + t('h=0') + '): the situation stops there.' }, { is: '\\{t\\mid t\\in\\mathbb{R}\\}', code: 'u5t-ctx-all', hint: 'Time starts when the candle is lit (' + t('t=0') + ') and stops when it has burned out.' }, { is: cond('t', 0, q.H), code: 'u5t-ctx-end', hint: t(q.H) + ' is the starting height. The time ends when the height reaches ' + t('0') + ': solve ' + t(linB(q.H, -q.k, 't') + '=0') + '.' }];
            rW = [{ is: cond('h', null, q.H), code: 'u5t-ctx-noend', hint: 'A height can’t be negative: the lowest height is ' + t('0') + ' (burned out).' }];
            sol = 'Time starts at ' + t('t=0') + ' (lit) and stops when the candle has burned out: ' + t(linB(q.H, -q.k, 't') + '=0') + ' gives ' + t('t=' + z) + '. So ' + t('D\\!:\\ ' + D) + '.<br>The height goes from ' + t(q.H) + ' cm down to ' + t('0') + ': ' + t('R\\!:\\ ' + R) + '. Values outside these make no sense (negative time or a negative height).';
          } else if (q.c === 'tank') {
            var F2 = q.s0 + q.k * q.T; dv = 't'; rv = 'V'; D = cond('t', 0, q.T); R = cond('V', q.s0, F2);
            dW = [{ is: cond('t', 0, null), code: 'u5t-ctx-noend', hint: 'The hose is turned off when the tank is full: solve ' + t(linB(q.s0, q.k, 't') + '=' + F2) + '.' }, { is: '\\{t\\mid t\\in\\mathbb{R}\\}', code: 'u5t-ctx-all', hint: 'Time starts when the hose is turned on (' + t('t=0') + ') and stops when the tank is full.' }, { is: cond('t', 0, F2), code: 'u5t-ctx-end', hint: t(F2) + ' L is a volume. The domain is about time: when is the tank full?' }];
            rW = [{ is: cond('V', 0, F2), code: 'u5t-ctx-start', hint: 'The tank already holds ' + t(q.s0) + ' L at ' + t('t=0') + ': the volume never goes below that.' }, { is: cond('V', q.s0, null), code: 'u5t-ctx-noend', hint: 'The tank is full at ' + t(F2) + ' L: the volume stops there.' }];
            sol = 'Time starts at ' + t('t=0') + ' and stops when the tank is full: ' + t(linB(q.s0, q.k, 't') + '=' + F2) + ' gives ' + t(q.k + 't=' + (F2 - q.s0)) + ', ' + t('t=' + q.T) + '. So ' + t('D\\!:\\ ' + D) + '.<br>The volume starts at ' + t(q.s0) + ' L (not 0 — the tank already had water) and ends at ' + t(F2) + ' L: ' + t('R\\!:\\ ' + R) + '.';
          } else if (q.c === 'temp') {
            var Hh = q.H[0], low = q.A - q.k * Hh; dv = 'h'; rv = 'T'; D = cond('h', 0, Hh); R = cond('T', low, q.A);
            dW = [{ is: cond('h', 0, null), code: 'u5t-ctx-noend', hint: 'Recording stops at ' + q.H[1] + ', ' + t(Hh) + ' hours after 9 pm.' }, { is: '\\{h\\mid h\\in\\mathbb{R}\\}', code: 'u5t-ctx-all', hint: 'The hours run from 9 pm (' + t('h=0') + ') to when recording stops.' }];
            rW = [{ is: cond('T', 0, q.A), code: 'u5t-ctx-start', hint: 'The temperature can go below 0 °C. Find the last temperature: ' + t('T=' + q.A + '-' + q.k + '(' + Hh + ')=' + low) + '.' }, { is: cond('T', null, q.A), code: 'u5t-ctx-noend', hint: 'Recording stops at ' + t('h=' + Hh) + ', so the temperature stops at ' + t(low) + ' °C.' }];
            sol = 'The hours run from 9 pm (' + t('h=0') + ') to ' + q.H[1] + ' (' + t('h=' + Hh) + '): ' + t('D\\!:\\ ' + D) + '.<br>The temperature starts at ' + t(q.A) + ' °C and ends at ' + t('T=' + q.A + '-' + q.k + '(' + Hh + ')=' + low) + ' °C: ' + t('R\\!:\\ ' + R) + '.';
          } else {
            var z2 = 100 / q.k; dv = 't'; rv = 'B'; D = cond('t', 0, z2); R = cond('B', 0, 100);
            dW = [{ is: cond('t', 0, null), code: 'u5t-ctx-noend', hint: 'The battery is empty at ' + t('t=' + z2) + ' (when ' + t('B=0') + '): the situation stops there.' }, { is: '\\{t\\mid t\\in\\mathbb{R}\\}', code: 'u5t-ctx-all', hint: 'Time starts when the phone is unplugged (' + t('t=0') + ') and stops when the battery is empty.' }, { is: cond('t', 0, 100), code: 'u5t-ctx-end', hint: '100 is the starting charge. When does the charge reach 0? Solve ' + t(linB(100, -q.k, 't') + '=0') + '.' }];
            rW = [{ is: cond('B', null, 100), code: 'u5t-ctx-noend', hint: 'A battery charge can’t be negative: the lowest is ' + t('0\\%') + '.' }];
            sol = 'Time starts at ' + t('t=0') + ' and stops when the battery is empty: ' + t(linB(100, -q.k, 't') + '=0') + ' gives ' + t('t=' + z2) + '. So ' + t('D\\!:\\ ' + D) + '.<br>The charge goes from 100% down to 0%: ' + t('R\\!:\\ ' + R) + '. Negative times and negative charges make no sense here.';
          }
          return drPart('State a realistic domain and range for this situation, using inequalities or set notation.', D, R, { dv: dv, rv: rv, dW: dW, rW: rW },
            sol, ['The domain is the values of ' + t(dv) + ' from where the situation starts to where it stops. The range is the values of ' + t(rv) + ' over that time.', 'Find where it stops: when does the quantity reach ' + (q.c === 'tank' ? 'full' : q.c === 'temp' ? 'the end of the recording' : '0') + '?'], 'realistic D & R: ' + q.c);
        } }] },

    /* ======================= RF8 — MAS ======================= */
    { num: '18', outcome: 'RF8',
      shared: function (r) {
        var c = r.pick(MODELS), m = r.pick(c.m), b = r.pick(c.b), a = r.pick(c.a), np = find(function () { return r.int(5, 14); }, function (n) { return n !== a && n !== m * n + b; }, 8);
        return { c: c, m: m, b: b, a: a, np: np };
      },
      stem: function (s) { var c = s.c; return c.what + ' ' + t('\\$' + s.b) + ' plus ' + t('\\$' + s.m) + ' per ' + c.u + '. The total cost, in dollars, for ' + t(c.v) + ' ' + c.us + ' is ' + t(c.fn + '(' + c.v + ')=' + lin(s.m, s.b, c.v)) + '.'; },
      parts: [
        { id: '18a', sub: 'a', outcome: 'RF8', level: 'MAS', make: function (r, s) {
          var c = s.c, val = s.m * s.a + s.b, st = c.fn + '(' + s.a + ')=' + val;
          var chk = function (resp) {
            resp = resp || []; var p0 = parseNum(resp[0]), p1 = parseNum(resp[1]);
            if (p0 == null || p1 == null) return form('empty', 'Fill in both blanks with numbers.');
            if (same(p0, s.a) && same(p1, val)) return ok();
            if (same(p0, val) && same(p1, s.a)) return wrong('u5t-io-swap', 'Swapped: in ' + t(st) + ' the number in the brackets, ' + t(s.a) + ', is the input (the ' + c.us + '), and ' + t(val) + ' is the output (the cost in dollars).');
            return wrong('value', 'Read the statement: ' + t(c.fn + '(\\text{input})=\\text{output}') + '.');
          };
          return { prompt: 'The statement ' + t(st) + ' is true. Explain what it means in this situation by completing the sentence.', input: { type: 'fields', fields: [{ name: c.us, label: c.verb, after: c.us }, { name: 'cost', label: 'costs', before: '$' }] },
            check: chk, key: [String(s.a), String(val)], bad: [[String(val), String(s.a)]], answer: c.verb + ' ' + t(s.a) + ' ' + c.us + ' costs ' + t('\\$' + val) + '.',
            solution: 'In ' + t(st) + ' the input is ' + t(c.v + '=' + s.a) + ' (' + c.us + ') and the output is ' + t(val) + ' (dollars). Check: ' + t(c.fn + '(' + s.a + ')=' + s.m + '(' + s.a + ')+' + s.b + '=' + val) + ' ✓. ' + c.verb + ' ' + t(s.a) + ' ' + c.us + ' costs ' + t('\\$' + val) + '.',
            hints: ['The number in the brackets is the input (here, ' + c.us + '); the number after the equals sign is the output (dollars).'], text: 'meaning of ' + st };
        } },
        { id: '18b', sub: 'b', outcome: 'RF8', level: 'MAS', make: function (r, s) {
          var c = s.c, tot = s.m * s.np + s.b, v = c.v, fn = c.fn;
          var stChk = function (resp) {
            var q = clean(resp).replace(/\s+/g, '').replace(/\\\$|\$/g, ''); if (!q) return form('empty', 'Write the statement in function notation.');
            var parts = q.split('='), reF = /^([A-Za-z])\(([^()]*)\)$/, m1 = reF.exec(q);
            if (m1 && parseNum(m1[2]) != null && same(parseNum(m1[2]), tot)) return wrong('u5t-stmt-input', t(tot) + ' dollars is the <b>output</b> (the cost), not the input: it goes after the equals sign, ' + t(fn + '(' + v + ')=' + tot) + '.');
            if (parts.length !== 2) return form('stmt-unreadable', 'Write one statement, e.g. ' + t(fn + '(' + v + ')=\\ldots') + '.');
            var A = parts[0], B = parts[1], mA = reF.exec(A), num = B;
            if (!mA) { mA = reF.exec(B); num = A; }
            if (!mA) return form('stmt-unreadable', 'Use function notation: start with ' + t(fn + '(' + v + ')=') + ', not the rule itself.');
            var nv = parseNum(num);
            if (mA[1] !== fn) return form('stmt-name', 'The function is named ' + t(fn) + ': write ' + t(fn + '(' + v + ')=\\ldots') + '.');
            if (parseNum(mA[2]) != null && same(parseNum(mA[2]), tot)) return wrong('u5t-stmt-input', t(tot) + ' dollars is the <b>output</b> (the cost), so it goes after the equals sign: ' + t(fn + '(' + v + ')=' + tot) + '.');
            if (mA[2] !== v) return form('stmt-arg', 'The input is unknown, so keep the letter ' + t(v) + ' in the brackets: ' + t(fn + '(' + v + ')=\\ldots') + '.');
            if (nv == null) return form('stmt-unreadable', 'After the equals sign, write the cost as a number.');
            return same(nv, tot) ? ok() : wrong('value', 'The amount paid is ' + t('\\$' + tot) + '.');
          };
          var vc = numChk(s.np, [{ v: cl(tot / s.m), code: 'u5t-fee', hint: 'Subtract the fixed fee of ' + t('\\$' + s.b) + ' first, then divide by ' + t(s.m) + '.' }, { v: cl((tot + s.b) / s.m), code: 'fn-solve-inverse', hint: 'To undo ' + t('+' + s.b) + ', subtract ' + t(s.b) + ' from both sides.' }, { v: tot - s.b, code: 'fn-solve-divide', hint: 'Last step: divide by ' + t(s.m) + '.' }, { v: s.m * tot + s.b, code: 'u5t-ev-instead', hint: 'That is ' + t(fn + '(' + tot + ')') + '. Here ' + t(tot) + ' is the cost (output): solve for ' + t(v) + '.' }]);
          var p = P.fields(c.pay + ' ' + t('\\$' + tot) + '. Write this as a function notation statement, then find the number of ' + c.us + '.',
            [{ name: 'Statement', label: 'In function notation:', mode: 'math', keys: EQK, vars: [fn, v], wide: true, placeholder: 'e.g. ' + fn + '(' + v + ') = …' }, { name: v, before: t(v + '='), after: c.us }],
            [stChk, vc], [fn + '(' + v + ')=' + tot, String(s.np)], t(fn + '(' + v + ')=' + tot) + '; ' + t(v + '=' + s.np) + ' ' + c.us,
            t(fn + '(' + v + ')=' + tot) + '<br>' + t(lin(s.m, s.b, v) + '=' + tot) + '<br>' + t(s.m + v + '=' + (tot - s.b)) + '<br>' + t(v + '=' + s.np) + ' ' + c.us + '. Check: ' + t(s.m + '(' + s.np + ')+' + s.b + '=' + tot) + ' ✓',
            ['The cost is the output: ' + t(fn + '(' + v + ')=\\text{cost}') + '.', 'Subtract the fixed fee, then divide by the rate.'], 'solve ' + fn + '(' + v + ')=' + tot);
          p.bad = [[fn + '(' + tot + ')', String(s.np)], [fn + '(' + v + ')=' + tot, nT(cl(tot / s.m))], [fn + '(' + v + ')=' + tot, String(tot - s.b)]].filter(function (b) { return p.check(b).v !== 'correct'; });
          return p;
        } }] },
    { num: '19', outcome: 'RF8',
      shared: function (r) {
        return find(function () {
          var m = r.pick([-2, -1, 1, 2]), b = r.int(-2, 2), a = r.pick(nz(-3, 3)), y = m * a + b;
          return { m: m, b: b, a: a, y: y, nm: r.pick(['Jesse', 'Kai', 'Ava', 'Noor', 'Liam', 'Priya', 'Ethan', 'Mei']) };
        }, function (s) { return s.y !== 0 && s.y !== s.a && Math.abs(s.y) <= 6 && Math.abs(3 * s.m) + Math.abs(s.b) <= 6 && Math.abs(s.y) !== Math.abs(s.a); }, { m: 2, b: 0, a: 2, y: 4, nm: 'Kai' });
      },
      stem: function (s) {
        var V = [[-3, -3 * s.m + s.b], [3, 3 * s.m + s.b]];
        var g = HW.graph({ x: [-5, 5], y: [-7, 7], labels: 1, labelsY: 2, max: 290, yName: 'd(x)', segs: [{ pts: V, start: 'closed', end: 'closed' }], points: [{ x: s.a, y: s.y, color: '#c4532a' }], aria: 'graph of a function d drawn from x = -3 to x = 3, with a marked point' });
        return 'The graph of a function ' + t('d') + ' is drawn only for ' + t('-3\\le x\\le 3') + '. The marked point is ' + t(pT([s.a, s.y])) + '.' + g + s.nm + ' looks at the marked point and says “' + t('d(' + s.y + ')=' + s.a) + '.”';
      },
      parts: [
        { id: '19', outcome: 'RF8', level: 'MAS', make: function (r, s) {
          var chk = function (resp) {
            var q = clean(Array.isArray(resp) ? resp[0] : resp).replace(/\s+/g, ''); if (!q) return form('empty', 'Write the statement, e.g. ' + t('d(1)=5') + '.');
            var m = /^d\(([^()]*)\)=(.+)$/.exec(q) || /^(.+)=d\(([^()]*)\)$/.exec(q), a, b;
            if (!m) return form('stmt-unreadable', 'Write it in function notation: ' + t('d(\\text{input})=\\text{output}') + ', e.g. ' + t('d(1)=5') + '.');
            if (/^d\(/.test(q)) { a = parseNum(m[1]); b = parseNum(m[2]); } else { a = parseNum(m[2]); b = parseNum(m[1]); }
            if (a == null || b == null) return form('stmt-unreadable', 'Use numbers for the input and the output, e.g. ' + t('d(1)=5') + '.');
            if (same(a, s.a) && same(b, s.y)) return ok();            if (same(a, s.y) && same(b, s.a)) return wrong('u5t-err-kept', 'That is ' + s.nm + '’s statement. In ' + t('d(\\text{input})=\\text{output}') + ', the input is the ' + t('x') + '-coordinate of the point and the output is its ' + t('y') + '-coordinate.');
            if (same(a, s.a)) return wrong('value', 'The input is right. The output is the ' + t('y') + '-coordinate of the marked point.');
            return wrong('value', 'Use the marked point ' + t(pT([s.a, s.y])) + ': its ' + t('x') + '-coordinate goes in the brackets.');
          };
          var outD = Math.abs(s.y) > 3;
          return { prompt: s.nm + '’s statement is wrong. Write the correct statement for the marked point in function notation.', input: { type: 'fields', fields: [{ label: 'Correct statement:', name: 'Statement', mode: 'math', keys: EQK, vars: ['d', 'x'], wide: true, placeholder: 'e.g. d(1) = 5' }] },
            check: chk, key: ['d(' + s.a + ')=' + s.y], bad: [['d(' + s.y + ')=' + s.a], ['d(' + s.a + ')=' + (-s.y)]], good: [[s.y + '=d(' + s.a + ')']], answer: t('d(' + s.a + ')=' + s.y),
            solution: 'In function notation the input (the ' + t('x') + '-coordinate) goes in the brackets and the output (the ' + t('y') + '-coordinate) after the equals sign. The point ' + t(pT([s.a, s.y])) + ' means ' + t('d(' + s.a + ')=' + s.y) + '. ' + s.nm + ' wrote them the other way round' + (outD ? '; besides, ' + t('d(' + s.y + ')') + ' doesn’t exist here, because ' + t(s.y) + ' is outside the domain ' + t('-3\\le x\\le 3') : '') + '.',
            hints: ['A point ' + t('(x,\\ y)') + ' on the graph of ' + t('d') + ' means ' + t('d(x)=y') + '.'], text: 'correct the d(y)=x error' };
        } }] }
  ];

  HW.defineTest({
    id: 'u5test', unit: 5, title: 'Unit 5 Test', outcome: 'RF2', calc: true,
    blurb: 'The Unit 5 outcomes-based test: RF1 (story graphs, types of variables), RF2 (relations, domain and range, functions), RF4 (linear patterns), RF5 (intercepts) and RF8 (function notation), with Beginning, Progressing and Mastery boxes. Scientific calculator allowed.',
    questions: QUESTIONS
  });
})(window);
