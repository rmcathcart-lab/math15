/* Math 15 · Unit 7 Test (RF3, RF4, RF5, RF6, RF7) — Equations of Linear Relations: tables of values, y = mx + b,
 * graphing from m and b, writing equations, general form, horizontal and vertical lines, slope in context.
 * Built the way the Math 10C Unit 7 Test was built (Beginning / Progressing / Mastery boxes, mostly typed answers and
 * graphs drawn on the graph pad, keys built from the generated numbers, `bad` answers with u7t- codes, worked solutions
 * and hints) but pitched at Math 15 and NOT based on the Math 15 multiple-choice paper tests. One 75-minute class,
 * NO calculator (the numbers stay friendly); 23 questions / 42 parts.
 *
 * Boxes (outcomes follow Ryan's Math 15 Unit 7 exit-slip tags: tables, linear vs non-linear, points on a line and
 * equations used in context are RF4; slope from two points and slope as a rate are RF3; intercepts are RF5; y = mx + b,
 * general form and graphs of any form are RF6; writing an equation is RF7):
 *   RF4 — Beginning 4 parts, Progressing 3, Mastery 3.   RF3 — Beginning 3, Progressing 3 (no Mastery box).
 *   RF5 — Beginning 3, Progressing 3 (no Mastery box).   RF6 — Beginning 3, Progressing 4, Mastery 3.
 *   RF7 — Beginning 3, Progressing 4, Mastery 3.         Overall Beginning 16, Progressing 17, Mastery 9.
 *
 * How each box is pitched (numbers and situations come from Ryan's Math 15 Lessons 1–10, assignments, extra practice
 * and exit slips; their numbers are possible values):
 *   Beginning  — each lesson's core skill as first taught: linear or non-linear (L1 #1); a table of values for
 *                y = mx + b with x = −2…2, its graph, and "does the point lie on the line?" (L1 #3–12); the slope through
 *                two points with a whole-number slope (L6 #1, Ryan's L6 slip, RF3 BEG); the slope of a context equation
 *                and its units (L9 Ex 1, #13); x-intercept, y-intercept and slope read off a graph; m and b of y = mx + b
 *                and its graph with a positive whole-number slope (L2 #1–6, L3 #4); the graph of y = k or x = k (L8 #1–5);
 *                y = mx + b from m and b, b given as a value or as the point (0, b), and the horizontal or vertical line
 *                through a point (L4 #1, L8 #13, #15).
 *   Progressing — the typical assignment question: a fee-plus-rate context — write the equation, evaluate, solve
 *                backwards (L9 #5–7, Ryan's L9 slip); a rate of change with units from a start and a later reading and
 *                what the slope means (L10 #21, Ryan's L9 slip); which of two plans charges more per unit, more at the
 *                start, and is cheaper in the long run (L9 Ex 5, #9); intercepts of a general-form equation (L7 #5, Ryan's
 *                L7 and L10 slips) and of a horizontal or vertical line (EP08 #1); rearrange Ax + By = C into y = mx + b
 *                (L2 #7–12) and y = (p/q)x + b into general form (L7 #2, Ryan's L7 slip); graph a negative or fractional
 *                slope (L3 #5–6) and a general-form equation by its intercepts (L8 #8, #10); the equation from a graph
 *                and from a table (L4 #2–3, Ryan's L4 slip), from a slope and a point (L5, Ryan's slip) and from two points
 *                with a whole-number slope (L6 #2, Ryan's slip).
 *   Mastery    — Math 15's hardest assignment / extra-practice items, clearly easier than the 10C Mastery boxes: the
 *                missing coordinate k so that (k, y) is on a line (L1 #15, EP01 #17); two plans compared — the break-even
 *                point and which is cheaper for a given amount (L9 #10); two students' errors rewriting a general-form
 *                equation as y = mx + b, then the correct equation (EP02 #9, EP10); which equations are the same line
 *                (EP10); two points with negative coordinates and a fractional slope (L6 #4); a context with two readings —
 *                the equation, then used backwards (L6 #7–9, L10 #24, Challenge 2).
 * Coverage: L1 Q1, Q2 · L2 Q13a, Q15a · L3 Q13b, Q16a · L4 Q19a–b, Q20 · L5 Q21a · L6 Q6, Q21b, Q22, Q23 ·
 *           L7 Q11, Q15b, Q16b, Q17, Q18 · L8 Q12, Q14, Q16b, Q19c · L9 Q3, Q5, Q7, Q8, Q9, Q23 · L10 (review) Q4, Q8.
 *           (Paper numbers; defineTest renumbers them Beginning → Progressing → Mastery.)
 * Math 15 never uses slope–point form: a slope and a point means substitute into y = mx + b and solve for b.
 * Conversions to online: "sort into LINEAR / NON-LINEAR" → a grid; "show your substitution" → the value in a box, then
 * yes / no; "explain what the slope means" → choices that each say what a value means (Progressing only); "which is
 * cheaper / which charges more" → a grid with Company A / Company B; "explain the student's mistake" → a grid that names
 * each student's mistake, then the correct equation typed; "circle every equation of the same line" → select; graphs →
 * the graph pad (one line with arrows on both ends). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, F = HW.fmt, LN = HW.lines, DR = HW.draw;

  HW.addCodes({
    'u7t-lin-horiz': 'Called a horizontal line y = k non-linear', 'u7t-lin-origin': 'Called y = mx (no constant) non-linear', 'u7t-lin-si': 'Called y = mx + b non-linear',
    'u7t-lin-half': 'Called y = x/2 + b non-linear (x divided by a number is fine)', 'u7t-lin-curve': 'Called a non-linear relation linear', 'u7t-lin-many': 'Several relations sorted wrongly',
    'u7t-tab-mx': 'Table value: sign slip multiplying by a negative x', 'u7t-tab-b': 'Table value: sign of b', 'u7t-sub-sign': 'Sign slip substituting a negative x',
    'u7t-onpt-decide': 'Is the point on the line: decision doesn’t match the value', 'u7t-yn': 'Not answered yes or no',
    'u7t-ctx-nostart': 'Left out the starting amount / flat fee', 'u7t-ctx-swap': 'Rate and starting amount swapped', 'u7t-ctx-sign': 'Added the starting amount instead of subtracting (or the change went the wrong way)',
    'u7t-ctx-eval': 'Substituted the total for x instead of solving for x', 'u7t-k-swap': 'Missing coordinate: substituted the y-value for x', 'u7t-k-sign': 'Missing coordinate: sign slip undoing b',
    'u7t-k-mult': 'Missing coordinate: multiplied by the slope instead of dividing', 'u7t-be-fee': 'Break-even: left out the second plan’s fee', 'u7t-be-sign': 'Break-even: added the rates instead of subtracting',
    'u7t-be-cost': 'Gave the equal cost instead of the amount where they are equal', 'u7t-cheap-decide': 'Chose the more expensive plan', 'u7t-ab': 'Not answered A or B',
    'u7t-rate-sign': 'Rate of change with the wrong sign', 'u7t-rate-nodiv': 'Gave the change in the quantity (did not divide by the time)', 'u7t-rate-flip': 'Rate upside down (time over amount)',
    'u7t-rate-point': 'Divided a single reading by its time', 'u7t-mb-swap': 'Slope and y-intercept swapped', 'u7t-incdec': 'Increasing / decreasing the wrong way', 'u7t-incdec-form': 'Not answered increasing or decreasing',
    'u7t-cmp-one': 'One comparison wrong', 'u7t-cmp-many': 'Several comparisons wrong',
    'u7t-icpt-none': 'Said there is no intercept', 'u7t-icpt-has': 'Gave an intercept where there is none', 'u7t-icpt-axis': 'Intercept written as a point on the wrong axis',
    'u7t-icpt-swap': 'x- and y-intercepts swapped', 'u7t-icpt-sign': 'Intercept sign', 'u7t-icpt-read': 'Intercept not readable', 'u7t-mb-order': 'Read m and b left to right (constant first)',
    'u7t-hv-swap': 'Drew x = k as a horizontal line (or y = k as a vertical one)', 'u7t-hv-coord': 'Horizontal / vertical line: used the other coordinate',
    'u7t-move-sign': 'Moved the x-term across the = sign without changing its sign', 'u7t-div-one': 'Divided only one term by the coefficient of y', 'u7t-gen-const': 'General form: didn’t multiply the constant by the denominator',
    'u7t-err-one': 'One student’s mistake named wrongly', 'u7t-err-many': 'Both students’ mistakes named wrongly', 'u7t-err-copied': 'Gave a student’s wrong equation',
    'u7t-eqv-extra': 'Chose one equation of a different line', 'u7t-eqv-missed': 'Missed one equation of the same line', 'u7t-eqv-many': 'Several equations chosen wrongly',
    'u7t-si-swap': 'Swapped m and b in y = mx + b', 'u7t-b-ycoord': 'Used the point’s y-coordinate as b', 'u7t-b-sign': 'Sign slip solving for b', 'u7t-b-first': 'Used the first table value as the y-intercept'
  });
  /* shared graph codes (partial decisions in js/partial.js; labelled by the 10C lesson u7l7.js) — label them only if no other file has */
  var GRAPH_LABELS = { 'graph-slope-sign': 'Graph: slope sign', 'graph-int-sign': 'Graph: intercept signs', 'graph-b-x': 'Graph: b plotted on the x-axis', 'graph-flip': 'Graph: rise and run swapped', 'graph-int-swap': 'Graph: intercepts swapped' };
  Object.keys(GRAPH_LABELS).forEach(function (k) { if (!HW.CODES[k]) HW.CODES[k] = GRAPH_LABELS[k]; });
  HW.addPartial({
    'u7t-lin-horiz': 's', 'u7t-lin-origin': 's', 'u7t-lin-si': 's', 'u7t-lin-half': 's', 'u7t-lin-curve': 's', 'u7t-lin-many': 'n', 'u7t-tab-mx': 's', 'u7t-tab-b': 's', 'u7t-sub-sign': 's',
    'u7t-onpt-decide': 'n', 'u7t-ctx-nostart': 'b', 'u7t-ctx-swap': 'b', 'u7t-ctx-sign': 's', 'u7t-ctx-eval': 'n', 'u7t-k-swap': 'n', 'u7t-k-sign': 's', 'u7t-k-mult': 'b',
    'u7t-be-fee': 'b', 'u7t-be-sign': 'b', 'u7t-be-cost': 'n', 'u7t-cheap-decide': 'n', 'u7t-rate-sign': 's', 'u7t-rate-nodiv': 'b', 'u7t-rate-flip': 'b', 'u7t-rate-point': 'n',
    'u7t-mb-swap': 'b', 'u7t-incdec': 'n', 'u7t-cmp-one': 'b', 'u7t-cmp-many': 'n', 'u7t-icpt-none': 'n', 'u7t-icpt-has': 'n', 'u7t-icpt-axis': 's', 'u7t-icpt-swap': 'b', 'u7t-icpt-sign': 's',
    'u7t-mb-order': 'b', 'u7t-hv-swap': 'b', 'u7t-hv-coord': 's', 'u7t-move-sign': 's', 'u7t-div-one': 'b', 'u7t-gen-const': 's', 'u7t-err-one': 'b', 'u7t-err-many': 'n', 'u7t-err-copied': 'n',
    'u7t-eqv-extra': 's', 'u7t-eqv-missed': 's', 'u7t-eqv-many': 'n', 'u7t-si-swap': 'b', 'u7t-b-ycoord': 'b', 'u7t-b-sign': 's', 'u7t-b-first': 'b'
  });

  /* ---------------- rational numbers [p, q] (from the 10C u7test) ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function toQ(x) { return Array.isArray(x) ? x : LN.toFr(x); }
  function Q(p, q) { if (Array.isArray(p)) return Q(p[0], p[1]); if (q === undefined) { if (!Number.isInteger(p)) return Q(LN.toFr(p)); q = 1; } if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g + 0, q / g]; }
  function qa(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qs(a, b) { b = Q(b); return qa(a, [-b[0], b[1]]); }
  function qm(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[0], a[1] * b[1]); }
  function qd(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[1], a[1] * b[0]); }
  function qn(a) { a = Q(a); return [-a[0] + 0, a[1]]; }
  function qv(a) { a = Q(a); return a[0] / a[1]; }
  function qT(a) { a = Q(a); return LN.frT(a[0], a[1]); }
  function isInt(a) { return Q(a)[1] === 1; }
  function near(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function nT(v) { return Array.isArray(v) ? qT(v) : String(v); }
  function ptT(p) { return '(' + nT(p[0]) + ',\\ ' + nT(p[1]) + ')'; }
  function sgnP(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function rnz(r, a, b) { var v; do { v = r.int(a, b); } while (v === 0); return v; }
  function find(gen, test, fallback) { for (var i = 0; i < 600; i++) { var v = gen(); if (v != null && test(v)) return v; } return fallback; }
  function num(x) { return F(Math.round(x * 1e6) / 1e6); }
  function money(x) { x = Math.round(x * 100) / 100; return '\\$' + (Number.isInteger(x) ? F(x) : F(x.toFixed(2))); }
  function cur(x) { return t(money(x)); }
  var NAMES = ['Jordan', 'Kai', 'Priya', 'Sam', 'Lena', 'Omar', 'Ava', 'Noah', 'Mei', 'Leo', 'Casey', 'Marcus'];

  /* ---------------- lines as A x + B y + C = 0 (integers, A > 0 or A = 0 and B > 0, no common factor) ---------------- */
  function L3(A, Bc, C) { var g = gcd(gcd(A, Bc), C) || 1; A /= g; Bc /= g; C /= g; if (A < 0 || (A === 0 && Bc < 0)) { A = -A; Bc = -Bc; C = -C; } return { A: A + 0, B: Bc + 0, C: C + 0 }; }
  function Lrat(a, b, c) { a = Q(a); b = Q(b); c = Q(c); var d = a[1] * b[1] * c[1]; return L3(a[0] * d / a[1], b[0] * d / b[1], c[0] * d / c[1]); }
  function lineMB(m, b) { m = Q(toQ(m)); return Lrat([m[0], 1], [-m[1], 1], qm(m[1], toQ(b))); }
  function line2(p, q) { return p[0] === q[0] ? L3(1, 0, -p[0]) : lineMB(Q(q[1] - p[1], q[0] - p[0]), qs(p[1], qm(Q(q[1] - p[1], q[0] - p[0]), p[0]))); }
  function slopeOf(L) { return L.B === 0 ? null : Q(-L.A, L.B); }
  function yint(L) { return Q(-L.C, L.B); }
  function sameL(a, b) { return a.A === b.A && a.B === b.B && a.C === b.C; }
  function gT(L, vars) { return LN.tex(L, 'general', null, vars); }
  function sT(L, vars) { return LN.tex(L, 'slope-intercept', null, vars); }
  function term(c, v, first) {
    var f = Q(c); if (f[0] === 0) return '';
    var s = f[0] < 0 ? '-' : (first ? '' : '+'), ab = Math.abs(f[0]);
    return s + (f[1] === 1 ? (ab === 1 && v ? '' : String(ab)) : '\\frac{' + ab + '}{' + f[1] + '}') + v;
  }
  function pol(list) { var out = ''; list.forEach(function (tm) { out += term(tm[0], tm[1], !out); }); return out || '0'; }
  /* y = mx + b written with the student's letters (b may be 0) */
  function eqMB(m, b, x, y) { return (y || 'y') + '=' + pol([[m, x || 'x'], [b, '']]); }

  /* ---------------- checkers ---------------- */
  function lineP(prompt, L, opt, sol, hints, text) {
    opt = opt || {}; var p = B.line(prompt, L, opt, sol, hints, text), vars = opt.vars;
    p.bad = (opt.wrong || []).map(function (w) { return typeof w.is === 'string' ? null : w.is; }).filter(function (W) { return W && !sameL(W, L); }).map(function (W) { return LN.tex(W, 'general', null, vars); });
    return p;
  }
  function numD(ans, alts) { return K.number(ans, function (v) { for (var i = 0; i < (alts || []).length; i++) if (alts[i] && near(v, alts[i].v) && !near(v, ans)) return { code: alts[i].code, hint: alts[i].hint }; return null; }); }
  function diagOf(ans, alts) { return function (v) { for (var i = 0; i < (alts || []).length; i++) if (alts[i] && isFinite(alts[i].v) && (near(v, alts[i].v) || (!Number.isInteger(alts[i].v) && Math.abs(v - alts[i].v) < 0.01)) && !near(v, ans)) return { code: alts[i].code, hint: alts[i].hint }; return null; }; }
  /* a number part whose `bad` answers are its diagnosed wrong values */
  function numB(prompt, ans, alts, sol, hints, text, inp) {
    var p = B.number(prompt, ans, diagOf(ans, alts), sol, hints, text, inp);
    p.bad = (alts || []).filter(function (a) { return a && isFinite(a.v) && !near(a.v, ans); }).map(function (a) { return String(Math.round(a.v * 1e6) / 1e6); });
    return p;
  }
  function ynChk(want, code, hint) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim().toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1');
      if (!s) return form('empty', 'Type yes or no.');
      var y = /^(y|yes|yep|yeah|true|correct)\b/.test(s), n = /^(n|no|nope|not|false|incorrect)\b/.test(s);
      if (!y && !n) return form('u7t-yn', 'Answer with <b>yes</b> or <b>no</b>.');
      return (y ? 'yes' : 'no') === want ? ok() : wrong(code, hint);
    };
  }
  function incChk(want, hint) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim().toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1');
      if (!s) return form('empty', 'Type increasing or decreasing.');
      var inc = /^(inc|up|ris|grow|gain)/.test(s), dec = /^(dec|down|fall|drop|los|shrink|go(es)? down)/.test(s);
      if (!inc && !dec) return form('u7t-incdec-form', 'Answer with <b>increasing</b> or <b>decreasing</b>.');
      return (inc ? 'increasing' : 'decreasing') === want ? ok() : wrong('u7t-incdec', hint);
    };
  }
  function abChk(want, hint) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim().toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/\b(gym|plan|studio|rental|company|option)\b/g, '').trim();
      if (!s) return form('empty', 'Type A or B.');
      if (s !== 'a' && s !== 'b') return form('u7t-ab', 'Type <b>A</b> or <b>B</b>.');
      return s.toUpperCase() === want ? ok() : wrong('u7t-cheap-decide', hint);
    };
  }
  /* an intercept: a number (or the point on the axis); tg = null when there is none */
  function icChk(tg, axis, other, alts) {
    var T = tg == null ? null : qv(tg), O = other == null ? null : qv(other), ax = axis, oth = axis === 'x' ? 'y' : 'x';
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Type your answer first.');
      if (/^(\\text\{\s*)?(none|no)\b/i.test(s)) return T == null ? ok() : wrong('u7t-icpt-none', 'This line does cross the ' + t(ax) + '-axis: set ' + t(oth + '=0') + ' and solve for ' + t(ax) + '.');
      var v;
      if (/^(\\left)?\(/.test(s)) {
        var p = LN.readPoint(s);
        if (!p || p.kind !== 'pt') return form('u7t-icpt-read', 'Give the intercept as a number, e.g. ' + t('-3') + '.');
        var px = p.p[0].v, py = p.p[1].v, onAx = ax === 'x' ? near(py, 0) : near(px, 0);
        if (!onAx) { if (T != null && (ax === 'x' ? near(px, 0) && near(py, T) : near(py, 0) && near(px, T))) return wrong('u7t-icpt-axis', 'That point is on the wrong axis: the ' + t(ax) + '-intercept is on the ' + t(ax) + '-axis, so its ' + t(oth) + '-coordinate is ' + t('0') + '.'); return wrong('value', null); }
        v = ax === 'x' ? px : py;
      } else { var a = K.read(s); if (a.res) return a.res; v = a.val; }
      if (T == null) return wrong('u7t-icpt-has', 'This line is parallel to the ' + t(ax) + '-axis, so it never crosses it: type <b>none</b>.');
      if (near(v, T)) return ok();
      for (var i = 0; i < (alts || []).length; i++) if (alts[i] && near(v, qv(alts[i].v))) return wrong(alts[i].code, alts[i].hint);
      if (O != null && near(v, O)) return wrong('u7t-icpt-swap', 'That’s the ' + t(oth) + '-intercept. The ' + t(ax) + '-intercept is where the line crosses the ' + t(ax) + '-axis (where ' + t(oth + '=0') + ').');
      if (T !== 0 && near(v, -T)) return wrong('u7t-icpt-sign', 'Check the sign of the ' + t(ax) + '-intercept.');
      return wrong('value', null);
    };
  }
  /* a grid where the number of wrong rows decides the code: one row → why(row); several → many */
  function gridP(prompt, rows, cols, want, why, many, sol, hints, text, opt) {
    var p = B.grid(prompt, rows, cols, want, Object.assign({ why: why, rowHead: ' ' }, opt || {}), sol, hints, text), base = p.check;
    p.check = function (resp) {
      var res = base(resp); if (res.v !== 'wrong') return res;
      var bad = Object.keys(want).filter(function (k) { return (resp || {})[k] !== want[k]; });
      if (bad.length > 1) return wrong(many.code, (many.hint ? many.hint(bad) : '') || res.hint);
      return res;
    };
    var ids = cols.map(function (c) { return c.id; }), other = function (v) { return ids[(ids.indexOf(v) + 1) % ids.length]; }, one = {}, all = {};
    rows.forEach(function (rw, i) { one[rw.id] = i ? want[rw.id] : other(want[rw.id]); all[rw.id] = other(want[rw.id]); });
    p.bad = [one, all];
    return p;
  }

  /* ---------------- graph pad (from the 10C u7test) ---------------- */
  function gv(pts, pieces) { return { pts: pts || [], pieces: pieces || [], join: 'none' }; }
  function segv(a, b, s, e) { return { v: [a, b], s: s || 'closed', e: e || 'closed' }; }
  function lattice(L, xr, yr) {
    var out = [];
    if (L.B === 0) { var k = -L.C / L.A; if (Number.isInteger(k) && k >= xr[0] && k <= xr[1]) for (var y = yr[0]; y <= yr[1]; y++) out.push([k, y]); return out; }
    for (var x = xr[0]; x <= xr[1]; x++) { var yy = (-L.C - L.A * x) / L.B; if (Math.abs(yy - Math.round(yy)) < 1e-9 && yy >= yr[0] && yy <= yr[1]) out.push([x, Math.round(yy)]); }
    return out;
  }
  function lineDraw(L, xr, yr) { var a = lattice(L, xr, yr); return a.length >= 2 ? gv([], [segv(a[0], a[a.length - 1], 'arrow', 'arrow')]) : null; }
  function clip(L, xr, yr) {
    var pts = [], add = function (p) { if (p[0] >= xr[0] - 1e-9 && p[0] <= xr[1] + 1e-9 && p[1] >= yr[0] - 1e-9 && p[1] <= yr[1] + 1e-9 && !pts.some(function (z) { return Math.abs(z[0] - p[0]) < 1e-9 && Math.abs(z[1] - p[1]) < 1e-9; })) pts.push(p); };
    if (L.B !== 0) { [xr[0], xr[1]].forEach(function (x) { add([x, (-L.C - L.A * x) / L.B]); }); }
    if (L.A !== 0) { [yr[0], yr[1]].forEach(function (y) { add([(-L.C - L.B * y) / L.A, y]); }); }
    return pts.slice(0, 2);
  }
  function exactChk(target, opt) { var base = K.graphExact(target, opt); return function (resp) { if (!DR.empty(resp) && DR.same(resp, target)) return ok(); return base(resp); }; }
  function pad(xr, yr, extra) { return Object.assign({ x: xr, y: yr, labels: 2, defaultEnd: 'arrow', tools: ['line', 'ends'] }, extra || {}); }
  var LINEHELP = ' Use <b>╱ Line</b>: tap two points on the line — its ends start as arrows (a line goes on forever).';
  function graphLine(prompt, L, xr, yr, wrongs, sol, hints, text) {
    var key = lineDraw(L, xr, yr), W = [], bad = [];
    (wrongs || []).forEach(function (w) { if (!w || sameL(w.L, L)) return; var d = lineDraw(w.L, xr, yr); if (d) { W.push({ is: d, code: w.code, hint: w.hint }); bad.push(d); } });
    var a = lattice(L, xr, yr); bad.push(gv([], [segv(a[0], a[a.length - 1])]));
    var p = B.graph(prompt + LINEHELP, pad(xr, yr), exactChk(key, { wrong: W }), key, sol, hints, text);
    p.bad = bad.filter(function (b) { return b && !DR.same(b, key); });
    return p;
  }
  /* a picture of lines (arrow ends) and points */
  function lineFig(Ls, xr, yr, o) {
    o = o || {}; var ix = [xr[0] + 0.3, xr[1] - 0.3], iy = [yr[0] + 0.3, yr[1] - 0.3];
    return '<div class="fig">' + HW.graph({ x: xr, y: yr, grid: 1, labels: o.labels == null ? 2 : o.labels, max: o.max || 280, aria: o.aria || 'graph of a line',
      segs: Ls.map(function (L) { return { pts: clip(L, ix, iy), start: 'arrow', end: 'arrow' }; }), points: o.points || [] }) + '</div>';
  }
  function tab(xs, ys, xh, yh) { return '<div class="fig">' + HW.valueTable([[xh || t('x')].concat(xs.map(function (x) { return t(num(x)); })), [yh || t('y')].concat(ys.map(function (y) { return y == null ? '' : t(num(y)); }))]) + '</div>'; }
  function eqDec(m, b, x) { return 'C=' + num(m) + x + '+' + num(b); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ======================= contexts ======================= */
  /* RF4 PRG (Q3): flat fee + rate, or a tank that drains */
  var FEE4 = [
    { x: 'n', y: 'C', fees: [6, 8, 10, 12, 15], rates: [3, 4, 5, 6], N: [3, 8], P: [4, 10], ansU: 'dogs',
      intro: function (s) { return 'A dog walker charges a ' + cur(s.F) + ' flat fee plus ' + cur(s.R) + ' for each dog walked.'; },
      eq: 'the total charge, ' + t('C') + ' (in dollars), in terms of the number of dogs walked, ' + t('n'),
      ev: function (s) { return 'Determine the charge for walking ' + t(s.N) + ' dogs.'; }, sv: function (s) { return 'A customer paid ' + cur(s.P) + '. How many dogs were walked?'; } },
    { x: 'h', y: 'C', fees: [50, 60, 75, 80, 90, 100], rates: [30, 40, 45, 50, 60], N: [2, 6], P: [3, 8], ansU: 'hours',
      intro: function (s) { return 'A moving company charges a ' + cur(s.F) + ' flat fee plus ' + cur(s.R) + ' per hour.'; },
      eq: 'the total cost, ' + t('C') + ' (in dollars), in terms of the number of hours, ' + t('h'),
      ev: function (s) { return 'Find the cost of a ' + t(s.N) + '-hour move.'; }, sv: function (s) { return 'A move cost ' + cur(s.P) + '. How many hours did it take?'; } },
    { x: 'n', y: 'C', fees: [25, 30, 35, 40, 45], rates: [15, 20, 25], N: [2, 6], P: [3, 9], ansU: 'locks',
      intro: function (s) { return 'A locksmith charges a ' + cur(s.F) + ' service-call fee plus ' + cur(s.R) + ' for every lock changed.'; },
      eq: 'the total cost, ' + t('C') + ' (in dollars), in terms of the number of locks changed, ' + t('n'),
      ev: function (s) { return 'Determine the cost of changing ' + t(s.N) + ' locks.'; }, sv: function (s) { return 'A customer’s bill came to ' + cur(s.P) + '. How many locks were changed?'; } },
    { x: 'h', y: 'C', fees: [5, 8, 10, 12], rates: [3, 4, 6, 7], N: [2, 6], P: [3, 9], ansU: 'hours',
      intro: function (s) { return 'A bike rental costs a ' + cur(s.F) + ' flat fee plus ' + cur(s.R) + ' per hour.'; },
      eq: 'the total cost, ' + t('C') + ' (in dollars), in terms of the number of hours, ' + t('h'),
      ev: function (s) { return 'Find the cost of renting a bike for ' + t(s.N) + ' hours.'; }, sv: function (s) { return 'A rental cost ' + cur(s.P) + '. For how many hours was the bike rented?'; } },
    { x: 't', y: 'V', dec: true, fees: [600, 720, 800, 900, 960, 1200], rates: [20, 30, 40, 60], N: [3, 12], P: [4, 14], ansU: 'minutes',
      intro: function (s) { return 'A water tank starts with ' + t(F(s.F)) + ' L of water and drains at a constant rate of ' + t(s.R) + ' L per minute.'; },
      eq: 'the volume, ' + t('V') + ' (in litres), remaining after ' + t('t') + ' minutes',
      ev: function (s) { return 'How much water remains after ' + t(s.N) + ' minutes?'; }, sv: function (s) { return 'After how many minutes will ' + t(F(s.P)) + ' L remain?'; } }];
  /* RF4 MAS (Q5): two plans */
  var PLANS = [
    { u: 'month', us: 'months', A: 'Gym A', B: 'Gym B', rA: [20, 25, 30], d: [5, 10], n: [3, 8], FB: [0, 0, 10, 20],
      intro: function (s) { return 'Two gyms sell memberships. <b>Gym A</b> charges a ' + cur(s.FA) + ' sign-up fee plus ' + cur(s.rA) + ' per month. <b>Gym B</b> charges ' + (s.FB ? 'a ' + cur(s.FB) + ' sign-up fee plus ' : 'no sign-up fee, but ') + cur(s.rB) + ' per month.'; } },
    { u: 'lesson', us: 'lessons', A: 'Studio A', B: 'Studio B', rA: [15, 20, 25], d: [5, 10], n: [3, 8], FB: [0, 0, 10, 15],
      intro: function (s) { return 'Two music studios offer guitar lessons. <b>Studio A</b> charges a ' + cur(s.FA) + ' registration fee plus ' + cur(s.rA) + ' per lesson. <b>Studio B</b> charges ' + (s.FB ? 'a ' + cur(s.FB) + ' registration fee plus ' : 'no registration fee, but ') + cur(s.rB) + ' per lesson.'; } },
    { u: 'hour', us: 'hours', A: 'Rental A', B: 'Rental B', rA: [8, 10, 12], d: [2, 4, 5], n: [3, 6], FB: [0, 0, 5, 10],
      intro: function (s) { return 'Two shops rent canoes. <b>Rental A</b> charges a ' + cur(s.FA) + ' flat fee plus ' + cur(s.rA) + ' per hour. <b>Rental B</b> charges ' + (s.FB ? 'a ' + cur(s.FB) + ' flat fee plus ' : 'no flat fee, but ') + cur(s.rB) + ' per hour.'; } }];
  /* RF3 BEG (Q7): an equation in context */
  var RATE3 = [
    { y: 'd', x: 't', sg: 1, ms: [60, 70, 80, 90], bs: [0], per: ['kilometres per hour', 'hours per kilometre', 'kilometres', 'hours'],
      desc: function (e) { return 'A courier’s distance from the depot is ' + t(e) + ', where ' + t('d') + ' is in kilometres and ' + t('t') + ' is the time in hours.'; }, what: 'distance' },
    { y: 'V', x: 't', sg: -1, ms: [2, 3, 4, 5, 6], bs: [30, 40, 50, 60], per: ['litres per minute', 'minutes per litre', 'litres', 'minutes'],
      desc: function (e) { return 'A propane tank holds ' + t(e) + ', where ' + t('V') + ' is in litres and ' + t('t') + ' is the number of minutes since the barbecue was lit.'; }, what: 'amount of propane' },
    { y: 'B', x: 'n', sg: -1, ms: [3, 4, 5, 6], bs: [40, 50, 60, 75, 100], per: ['dollars per coffee', 'coffees per dollar', 'dollars', 'coffees'],
      desc: function (e) { return 'A coffee card’s balance is ' + t(e) + ', where ' + t('B') + ' is in dollars and ' + t('n') + ' is the number of coffees bought.'; }, what: 'balance' },
    { y: 'H', x: 't', sg: 1, ms: [15, 20, 25, 30, 40], bs: [100, 120, 150, 180], per: ['centimetres per year', 'years per centimetre', 'centimetres', 'years'],
      desc: function (e) { return 'A tree’s height is ' + t(e) + ', where ' + t('H') + ' is in centimetres and ' + t('t') + ' is the number of years since it was planted.'; }, what: 'height' },
    { y: 'S', x: 'w', sg: 1, ms: [10, 15, 20, 25, 30], bs: [50, 100, 150, 200], per: ['dollars per week', 'weeks per dollar', 'dollars', 'weeks'],
      desc: function (e) { return 'A savings balance is ' + t(e) + ', where ' + t('S') + ' is in dollars and ' + t('w') + ' is the number of weeks.'; }, what: 'savings' },
    { y: 'W', x: 't', sg: -1, ms: [20, 25, 40, 50], bs: [600, 800, 1000], per: ['millilitres per minute', 'minutes per millilitre', 'millilitres', 'minutes'],
      desc: function (e) { return 'A leaking bucket holds ' + t(e) + ', where ' + t('W') + ' is in millilitres and ' + t('t') + ' is in minutes.'; }, what: 'amount of water' }];
  /* RF3 PRG (Q8): a start and one later reading */
  var READ3 = [
    { sg: -1, S: [500, 600, 800, 900], R: [20, 25, 30, 40, 50], T: [2, 6], unit: 'L per minute', yu: 'L', xs: 'minute', xp: 'minutes', ys: 'litre',
      intro: function (s) { return 'A tank contains ' + t(F(s.S)) + ' L of water when it starts to drain at a constant rate. After ' + t(s.T) + ' minutes it contains ' + t(F(s.V1)) + ' L.'; },
      what: 'volume of water', start: function (s) { return 'The tank started with ' + t(F(s.S)) + ' L of water.'; } },
    { sg: -1, S: [20, 24, 30, 36], R: [2, 3, 4], T: [2, 4], unit: 'cm per hour', yu: 'cm', xs: 'hour', xp: 'hours', ys: 'centimetre',
      intro: function (s) { return 'A candle is ' + t(s.S) + ' cm tall when it is lit, and it burns at a constant rate. After ' + t(s.T) + ' hours it is ' + t(s.V1) + ' cm tall.'; },
      what: 'height of the candle', start: function (s) { return 'The candle was ' + t(s.S) + ' cm tall when it was lit.'; } },
    { sg: 1, S: [20, 24, 30, 36, 40], R: [2, 3, 4, 5, 6], T: [3, 8], unit: '% per minute', yu: '%', xs: 'minute', xp: 'minutes', ys: 'percent',
      intro: function (s) { return 'A phone’s battery reads ' + t(s.S + '\\%') + ' when it is plugged in, and it charges at a constant rate. After ' + t(s.T) + ' minutes it reads ' + t(s.V1 + '\\%') + '.'; },
      what: 'battery charge', start: function (s) { return 'The battery read ' + t(s.S + '\\%') + ' when it was plugged in.'; } },
    { sg: -1, S: [1800, 2000, 2400], R: [150, 200, 250, 300], T: [2, 4], unit: 'm per hour', yu: 'm', xs: 'hour', xp: 'hours', ys: 'metre',
      intro: function (s) { return 'A hiker starts down a mountain trail at an elevation of ' + t(F(s.S)) + ' m and descends at a constant rate. After ' + t(s.T) + ' hours her elevation is ' + t(F(s.V1)) + ' m.'; },
      what: 'hiker’s elevation', start: function (s) { return 'The hiker started at an elevation of ' + t(F(s.S)) + ' m.'; } },
    { sg: 1, S: [200, 300, 400], R: [40, 45, 50, 60], T: [3, 6], unit: 'L per minute', yu: 'L', xs: 'minute', xp: 'minutes', ys: 'litre',
      intro: function (s) { return 'A backyard pool already contains ' + t(s.S) + ' L of water when a hose starts filling it at a constant rate. After ' + t(s.T) + ' minutes it contains ' + t(F(s.V1)) + ' L.'; },
      what: 'volume of water', start: function (s) { return 'The pool started with ' + t(s.S) + ' L of water.'; } }];
  /* RF3 PRG (Q9): two companies */
  var CMP3 = [
    { x: 'd', rates: [1.5, 2, 2.5, 3], fees: [3, 4, 5, 6, 8], who: 'Two taxi companies charge ' + t('C') + ' dollars for a trip of ' + t('d') + ' kilometres:', A: 'Company A', B: 'Company B',
      rows: ['Charges more for each extra kilometre', 'Charges more before the trip starts (for ' + t('0') + ' km)', 'Is cheaper for a very long trip'] },
    { x: 'h', rates: [40, 50, 60, 75], fees: [50, 60, 75, 80, 100], who: 'Two plumbers charge ' + t('C') + ' dollars for a job that takes ' + t('h') + ' hours:', A: 'Plumber A', B: 'Plumber B',
      rows: ['Charges more for each extra hour', 'Charges more just to come to the house (for ' + t('0') + ' hours)', 'Is cheaper for a very long job'] },
    { x: 'g', rates: [5, 8, 10, 12], fees: [20, 25, 30, 35, 40], who: 'Two phone plans charge ' + t('C') + ' dollars a month when ' + t('g') + ' gigabytes of data are used:', A: 'Plan A', B: 'Plan B',
      rows: ['Charges more for each extra gigabyte', 'Charges more in a month with no data used', 'Is cheaper in a month when a lot of data is used'] }];
  /* RF7 MAS (Q23): two readings */
  var TWO7 = [
    { x: 't', y: 'd', rates: [6, 8, 10, 12, 15], starts: [2, 3, 4, 5, 6], t1: [1, 3], gap: [2, 4], goal: [6, 12], ansU: 'hours',
      intro: function (s) { return 'A cyclist rides away from home at a constant speed. After ' + t(s.x1) + ' hours she is ' + t(s.y1) + ' km from home; after ' + t(s.x2) + ' hours she is ' + t(s.y2) + ' km from home.'; },
      eq: 'her distance from home, ' + t('d') + ' (km), after ' + t('t') + ' hours', ask: function (s) { return 'After how many hours will she be ' + t(s.Y) + ' km from home?'; } },
    { x: 't', y: 'p', rates: [2, 3, 4, 5, 6], starts: [10, 20, 24, 30, 36], t1: [1, 4], gap: [3, 6], goal: [8, 15], ansU: 'minutes', max: 100,
      intro: function (s) { return 'A phone charges at a constant rate. After ' + t(s.x1) + ' minutes the battery reads ' + t(s.y1 + '\\%') + '; after ' + t(s.x2) + ' minutes it reads ' + t(s.y2 + '\\%') + '.'; },
      eq: 'the battery percentage, ' + t('p') + ', after ' + t('t') + ' minutes of charging', ask: function (s) { return 'After how many minutes will the battery read ' + t(s.Y + '\\%') + '?'; } },
    { x: 'a', y: 'h', rates: [15, 20, 25, 30, 40], starts: [30, 40, 50, 60, 80, 100], t1: [1, 3], gap: [2, 4], goal: [6, 12], ansU: 'years',
      intro: function (s) { return 'A young tree grows at a constant rate. It was ' + t(s.y1) + ' cm tall at age ' + t(s.x1) + ' years and ' + t(s.y2) + ' cm tall at age ' + t(s.x2) + ' years.'; },
      eq: 'its height, ' + t('h') + ' (cm), at age ' + t('a') + ' years', ask: function (s) { return 'At what age will the tree be ' + t(s.Y) + ' cm tall?'; } },
    { x: 't', y: 'h', rates: [-2, -3, -4], starts: [24, 30, 36], t1: [1, 2], gap: [2, 3], goal: [0, 0], ansU: 'hours',
      intro: function (s) { return 'A candle burns at a constant rate. After ' + t(s.x1) + ' hours it is ' + t(s.y1) + ' cm tall; after ' + t(s.x2) + ' hours it is ' + t(s.y2) + ' cm tall.'; },
      eq: 'its height, ' + t('h') + ' (cm), after ' + t('t') + ' hours', ask: function () { return 'When will the candle burn out completely (when will ' + t('h=0') + ')?'; } },
    { x: 't', y: 'A', rates: [100, 120, 150, 200], starts: [50, 100, 150, 200], t1: [2, 3], gap: [2, 4], goal: [8, 12], ansU: 'minutes',
      intro: function (s) { return 'A weather balloon rises at a constant rate. It was at ' + t(F(s.y1)) + ' m after ' + t(s.x1) + ' minutes and at ' + t(F(s.y2)) + ' m after ' + t(s.x2) + ' minutes.'; },
      eq: 'its altitude, ' + t('A') + ' (m), ' + t('t') + ' minutes after launch', ask: function (s) { return 'After how many minutes will the balloon reach ' + t(F(s.Y)) + ' m?'; } }];

  /* ======================= the questions (paper numbers; defineTest orders them Beginning → Progressing → Mastery) ======================= */
  var QUESTIONS = [
    /* ======================= RF4 · tables, linear or not, points, contexts ======================= */
    { num: '1', outcome: 'RF4', stem: 'An equation is <b>linear</b> when its graph is a straight line.', parts: [
      { id: '1', outcome: 'RF4', level: 'BEG', make: function (r) {
        var m = r.pick([2, 3, 4, 5, -2, -3, -4, -1]), b = rnz(r, -9, 9), k = rnz(r, -9, 9), mo = r.pick([-3, -4, 2, 5, -6, 7]), c = r.int(1, 6), a = r.pick([2, 3, 4]), kk = r.pick([1, 2, 4, 6]), half = r.chance(0.35);
        var dv = r.pick([2, 3]), bh = rnz(r, -5, 5);
        var lin = [{ id: 's', tex: half ? 'y=\\frac{x}{' + dv + '}' + (bh < 0 ? '-' : '+') + Math.abs(bh) : eqMB(m, b), kind: half ? 'half' : 'si' }, { id: 'h', tex: 'y=' + k, kind: 'h' }, { id: 'o', tex: eqMB(mo, 0), kind: 'o' }];
        var non = r.sample([
          { tex: 'y=x^{2}+' + c, why: t('x') + ' is squared, so the graph is a curve (a parabola)' },
          { tex: 'y=x^{2}-' + c, why: t('x') + ' is squared, so the graph is a curve (a parabola)' },
          { tex: 'y=x^{3}' + (c > 3 ? '' : '-' + c), why: t('x') + ' is cubed, so the graph is a curve' },
          { tex: 'y=\\dfrac{' + kk + '}{x}', why: t('x') + ' is in the denominator, so the graph is a curve' },
          { tex: 'y=' + a + '^{x}', why: t('x') + ' is an exponent, so the graph curves' },
          { tex: 'y=\\sqrt{x}', why: t('x') + ' is under a square root, so the graph is a curve' }], 3);
        var rows = r.shuffle(lin.map(function (x) { x.lin = 1; return x; }).concat(non.map(function (n, i) { return { id: 'n' + i, tex: n.tex, lin: 0, why: n.why }; })));
        var want = {}, by = {}; rows.forEach(function (x) { want[x.id] = x.lin ? 'L' : 'N'; by[x.id] = x; });
        var whyL = function (x) {
          if (!x.lin) return { code: 'u7t-lin-curve', hint: t(x.tex) + ' is <b>not</b> linear: ' + x.why + '.' };
          if (x.kind === 'h') return { code: 'u7t-lin-horiz', hint: t(x.tex) + ' <b>is</b> linear: it is a horizontal line. A missing ' + t('x') + ' is fine.' };
          if (x.kind === 'o') return { code: 'u7t-lin-origin', hint: t(x.tex) + ' <b>is</b> linear: ' + t('x') + ' is to the first power. It just passes through ' + t('(0,\\ 0)') + '.' };
          if (x.kind === 'half') return { code: 'u7t-lin-half', hint: t(x.tex) + ' <b>is</b> linear: ' + t('x') + ' divided by a number is a number times ' + t('x') + '. Non-linear means ' + t('x') + ' itself is in the denominator.' };
          return { code: 'u7t-lin-si', hint: t(x.tex) + ' <b>is</b> linear: it is in the form ' + t('y=mx+b') + '.' };
        };
        return gridP('Choose <b>Linear</b> or <b>Non-linear</b> for each equation.', rows.map(function (x) { return { id: x.id, html: t(x.tex), label: x.id }; }),
          [{ id: 'L', html: 'Linear', label: 'Linear' }, { id: 'N', html: 'Non-linear', label: 'Non-linear' }], want,
          function (id) { return whyL(by[id]); }, { code: 'u7t-lin-many' },
          rows.map(function (x) { return t(x.tex) + ': ' + (x.lin ? '<b>linear</b> — ' + (x.kind === 'h' ? 'a horizontal line' : x.kind === 'o' ? t('x') + ' to the first power (it passes through the origin)' : x.kind === 'half' ? t('\\frac{x}{' + dv + '}') + ' is ' + t('\\frac{1}{' + dv + '}x') + ', a number times ' + t('x') : 'it has the form ' + t('y=mx+b')) : '<b>non-linear</b> — ' + x.why) + '.'; }).join('<br>'),
          ['Linear: ' + t('x') + ' only to the first power — never squared or cubed, never under a root, in a denominator, or as an exponent.', 'An equation with no ' + t('x') + ' at all, like ' + t('y=6') + ', is a horizontal line — linear.'], 'linear or not: 6 equations');
      } }] },
    { num: '2', outcome: 'RF4',
      shared: function (r) {
        return find(function () {
          var m = r.pick([1, 2, 3, -1, -2, -3]), b = rnz(r, -4, 4), X = r.pick([3, 4, 5, -3, -4, 6]), on = r.chance(0.5);
          var Y = m * X + b + (on ? 0 : r.pick([-2, -1, 1, 2, -2 * m * X]));
          return { m: m, b: b, X: X, on: on, Y: Y };
        }, function (s) { return [-2, -1, 0, 1, 2].every(function (x) { return Math.abs(s.m * x + s.b) <= 8; }) && Math.abs(s.Y) <= 20 && (s.on || s.Y !== s.m * s.X + s.b); }, { m: 2, b: -3, X: 4, on: true, Y: 5 });
      },
      stem: function (s) { return 'Consider the equation ' + t(eqMB(s.m, s.b)) + '.'; }, parts: [
        { id: '2a', outcome: 'RF4', level: 'BEG', make: function (r, s) {
          var xs = [-2, -1, 0, 1, 2], ys = xs.map(function (x) { return s.m * x + s.b; }), eq = eqMB(s.m, s.b);
          var p = B.fields('Complete the table of values for ' + t(eq) + '.' + tab(xs, xs.map(function () { return null; })), xs.map(function (x) { return { name: 'x = ' + x, label: t('x=' + x) + ':', before: t('y=') }; }),
            xs.map(function (x, i) { return numD(ys[i], [{ v: -s.m * x + s.b, code: 'u7t-tab-mx', hint: 'Check ' + t(s.m + '\\times ' + sgnP(x)) + ': ' + (x < 0 ? 'a negative times a ' + (s.m < 0 ? 'negative is positive' : 'positive is negative') : 'watch the sign') + '.' }, { v: s.m * x - s.b, code: 'u7t-tab-b', hint: 'Check the sign of the constant: ' + t(eq) + '.' }]); }),
            ys.map(String), xs.map(function (x, i) { return t('(' + x + ',\\ ' + ys[i] + ')'); }).join(', '),
            xs.map(function (x, i) { return t('x=' + x) + ': ' + t('y=' + (s.m === 1 ? '' : s.m === -1 ? '-' : s.m) + '(' + x + ')' + (s.b < 0 ? '-' : '+') + Math.abs(s.b) + '=' + ys[i]); }).join('<br>'),
            ['Substitute each ' + t('x') + '-value into ' + t(eq) + '.', 'Multiply first, then add or subtract. Watch the signs when ' + t('x') + ' is negative.'], 'table for ' + eq);
          p.bad = [xs.map(function (x) { return String(-s.m * x + s.b); })].filter(function (b) { return b.join() !== ys.join(); });
          return p;
        } },
        { id: '2b', outcome: 'RF4', level: 'BEG', make: function (r, s) {
          var L = lineMB(s.m, s.b), eq = eqMB(s.m, s.b);
          return graphLine('Graph ' + t(eq) + ' on the grid (use your table).', L, [-6, 6], [-8, 8], [
            { L: lineMB(-s.m, s.b), code: 'graph-slope-sign', hint: 'Check the direction: as ' + t('x') + ' increases, ' + t('y') + ' ' + (s.m > 0 ? 'increases, so the line rises' : 'decreases, so the line falls') + ' from left to right.' },
            { L: lineMB(s.m, -s.b), code: 'graph-int-sign', hint: 'Check your table: when ' + t('x=0') + ', ' + t('y=' + s.b) + '.' }],
            'Plot the points from the table, ' + [-2, -1, 0, 1, 2].map(function (x) { return t('(' + x + ',\\ ' + (s.m * x + s.b) + ')'); }).join(', ') + ', and draw one straight line through them, with arrows on both ends.', ['Plot two (or more) points from the table.', 'Join them with one straight line across the grid.'], 'graph ' + eq);
        } },
        { id: '2c', outcome: 'RF4', level: 'BEG', make: function (r, s) {
          var val = s.m * s.X + s.b, P0 = t('(' + s.X + ',\\ ' + s.Y + ')'), sub = (s.m === 1 ? '' : s.m === -1 ? '-' : s.m) + '(' + s.X + ')' + (s.b < 0 ? '-' : '+') + Math.abs(s.b);
          var p = B.fields('Does the point ' + P0 + ' lie on the line ' + t(eqMB(s.m, s.b)) + '? Substitute ' + t('x=' + s.X) + ', then decide.', [{ name: 'y-value', label: 'Value of ' + t('y') + ' when ' + t('x=' + s.X) + ':' }, { name: 'On the line?', label: 'Does ' + P0 + ' lie on the line? (yes or no)', mode: 'text', placeholder: 'yes/no' }],
            [numD(val, [{ v: -s.m * s.X + s.b, code: 'u7t-sub-sign', hint: 'Check the sign of ' + t(s.m + '\\times ' + sgnP(s.X)) + '.' }]), ynChk(s.on ? 'yes' : 'no', 'u7t-onpt-decide', 'When ' + t('x=' + s.X) + ', ' + t('y=' + val) + (s.on ? ', which matches the point.' : ', but the point has ' + t('y=' + s.Y) + '.'))],
            [String(val), s.on ? 'yes' : 'no'], t('y=' + sub + '=' + val) + ' — <b>' + (s.on ? 'yes' : 'no') + '</b>',
            t('y=' + sub + '=' + val) + '. ' + (s.on ? 'That matches the point’s ' + t('y') + '-coordinate, ' + t(s.Y) + ', so <b>yes</b>, ' + P0 + ' lies on the line.' : t(val + '\\ne ' + s.Y) + ', so <b>no</b>, ' + P0 + ' does not lie on the line.'),
            ['Substitute ' + t('x=' + s.X) + ' into the equation.', 'The point is on the line only if you get exactly ' + t('y=' + s.Y) + '.'], 'is point on line');
          p.bad = [[String(val), s.on ? 'no' : 'yes']];
          return p;
        } }] },
    { num: '3', outcome: 'RF4',
      shared: function (r) {
        var c = r.pick(FEE4);
        return find(function () {
          var F0 = r.pick(c.fees), R = r.pick(c.rates), N = r.int(c.N[0], c.N[1]), n2 = r.int(c.P[0], c.P[1]);
          return { c: c, F: F0, R: R, N: N, n2: n2, P: c.dec ? F0 - R * n2 : F0 + R * n2 };
        }, function (s) { return s.n2 !== s.N && (!s.c.dec || (s.F - s.R * s.N > 0 && s.P > 0)); }, { c: FEE4[0], F: 10, R: 4, N: 6, n2: 8, P: 42 });
      },
      stem: function (s) { return s.c.intro(s); }, parts: [
        { id: '3a', outcome: 'RF4', level: 'PRG', make: function (r, s) {
          var c = s.c, vars = [c.x, c.y], m = c.dec ? -s.R : s.R, L = lineMB(m, s.F);
          return lineP('Write an equation for ' + c.eq + '.', L, { vars: vars, placeholder: 'e.g. ' + c.y + ' = 2' + c.x + ' + 3', wrong: [
            { is: lineMB(c.dec ? -s.F : s.F, s.R), code: 'u7t-ctx-swap', hint: 'The rate (' + t(s.R) + ' per ' + (c.dec ? 'minute' : 'unit') + ') multiplies ' + t(c.x) + '; the starting amount is the constant.' },
            { is: lineMB(m, 0), code: 'u7t-ctx-nostart', hint: 'Include the starting amount, ' + (c.dec ? t(F(s.F)) + ' L' : cur(s.F)) + ', as the constant.' }] },
            'The rate is the slope: ' + t('m=' + m) + (c.dec ? ' (the water goes <b>down</b>)' : '') + '. The starting amount is ' + t('b=' + s.F) + '.<br>' + t(eqMB(m, s.F, c.x, c.y)),
            ['The rate (“per …”) is ' + t('m') + '; the starting amount (the flat fee, or what is there at the start) is ' + t('b') + '.', 'Use the letters ' + t(c.y) + ' and ' + t(c.x) + '.'], 'context equation ' + c.y);
        } },
        { id: '3b', outcome: 'RF4', level: 'PRG', make: function (r, s) {
          var c = s.c, m = c.dec ? -s.R : s.R, v = s.F + m * s.N;
          return numB(s.c.ev(s), v, [{ v: s.R * s.N, code: 'u7t-ctx-nostart', hint: 'Don’t forget the starting amount, ' + (c.dec ? t(F(s.F)) + ' L' : cur(s.F)) + '.' },
            { v: s.F * s.N + s.R, code: 'u7t-ctx-swap', hint: 'Multiply the <b>rate</b> by ' + t(s.N) + ', then add the starting amount.' }, c.dec ? { v: s.F + s.R * s.N, code: 'u7t-ctx-sign', hint: 'The tank is <b>draining</b>: subtract ' + t(s.R + '\\times ' + s.N) + '.' } : null],
            t(c.y + '=' + m + '(' + s.N + ')+' + F(s.F) + '=' + F(v)) + ' — ' + (c.dec ? t(F(v)) + ' L' : cur(v)) + '.',
            ['Substitute ' + t(c.x + '=' + s.N) + ' into your equation from (a).'], 'evaluate context ' + c.y, c.dec ? { after: 'L' } : { before: t('\\$') });
        } },
        { id: '3c', outcome: 'RF4', level: 'PRG', make: function (r, s) {
          var c = s.c, m = c.dec ? -s.R : s.R, P = s.P;
          var alts = c.dec ? [{ v: P / s.R, code: 'u7t-ctx-nostart', hint: 'Use the whole equation: ' + t(F(P) + '=-' + s.R + 't+' + F(s.F)) + '. Subtract ' + t(F(s.F)) + ' first.' }, { v: (P + s.F) / s.R, code: 'u7t-ctx-sign', hint: 'Subtract ' + t(F(s.F)) + ' from both sides, then divide by ' + t(-s.R) + '.' }, { v: s.F - s.R * P, code: 'u7t-ctx-eval', hint: 'Here ' + t('V=' + F(P)) + ' — solve for ' + t('t') + '.' }]
            : [{ v: P / s.R, code: 'u7t-ctx-nostart', hint: 'Subtract the flat fee first: ' + t(F(P) + '-' + F(s.F)) + '.' }, { v: (P + s.F) / s.R, code: 'u7t-ctx-sign', hint: 'To undo “+' + F(s.F) + '”, subtract ' + t(F(s.F)) + ' from both sides.' }, { v: s.R * P + s.F, code: 'u7t-ctx-eval', hint: 'Here the total is ' + cur(P) + ': set ' + t('C=' + F(P)) + ' and solve for ' + t(c.x) + '.' }];
          return numB(s.c.sv(s), s.n2, alts,
            t(F(P) + '=' + m + c.x + '+' + F(s.F)) + '<br>' + t(F(P - s.F) + '=' + m + c.x) + '<br>' + t(c.x + '=' + F(P - s.F) + '\\div ' + sgnP(m) + '=' + s.n2) + ' — <b>' + s.n2 + ' ' + c.ansU + '</b>.',
            ['Set ' + t(c.y + '=' + F(P)) + ' in your equation and solve for ' + t(c.x) + '.', 'Subtract the starting amount, then divide by the rate.'], 'solve context ' + c.y, { after: c.ansU });
        } }] },
    { num: '4', outcome: 'RF4',
      shared: function (r) { return find(function () { var m = rnz(r, -5, 5), b = rnz(r, -9, 9), k = rnz(r, -6, 6); return { m: m, b: b, k: k, Y: m * k + b }; }, function (s) { return Math.abs(s.m) >= 2 && Math.abs(s.Y) <= 30 && s.Y !== 0 && Math.abs(s.k) >= 2 && s.Y !== s.k; }, { m: 3, b: 2, k: 3, Y: 11 }); },
      stem: function (s) { return 'The point ' + t('(k,\\ ' + s.Y + ')') + ' lies on the line ' + t(eqMB(s.m, s.b)) + '.'; }, parts: [
        { id: '4', outcome: 'RF4', level: 'MAS', make: function (r, s) {
          var m = s.m, b = s.b, Y = s.Y, k = s.k;
          return numB('Determine the value of ' + t('k') + '.', k, [{ v: m * Y + b, code: 'u7t-k-swap', hint: 'In ' + t('(k,\\ ' + Y + ')') + ', ' + t('k') + ' is the <b>' + t('x') + '</b>-coordinate and ' + t(Y) + ' is the ' + t('y') + '-value: substitute ' + t('y=' + Y) + '.' },
            { v: (Y + b) / m, code: 'u7t-k-sign', hint: 'To undo ' + t((b < 0 ? '-' : '+') + Math.abs(b)) + ', ' + (b < 0 ? 'add' : 'subtract') + ' ' + t(Math.abs(b)) + ' on both sides.' },
            { v: (Y - b) * m, code: 'u7t-k-mult', hint: 'To undo multiplying by ' + t(m) + ', <b>divide</b> by ' + t(m) + '.' }, { v: -k, code: 'u7t-k-sign', hint: 'Check the sign when you divide by ' + t(m) + '.' }],
            'Substitute ' + t('x=k') + ' and ' + t('y=' + Y) + ': ' + t(Y + '=' + (m === -1 ? '-' : m) + 'k' + (b < 0 ? '-' : '+') + Math.abs(b)) + '<br>' + t((Y - b) + '=' + m + 'k') + '<br>' + t('k=' + (Y - b) + '\\div ' + sgnP(m) + '=' + k) + '. Check: ' + t(m + '(' + k + ')' + (b < 0 ? '-' : '+') + Math.abs(b) + '=' + Y) + ' ✓',
            ['The point is ' + t('(x,\\ y)') + ': ' + t('k') + ' is the ' + t('x') + '-value and ' + t(Y) + ' is the ' + t('y') + '-value.', 'Substitute ' + t('y=' + Y) + ', then solve for ' + t('k') + '.'], 'missing coordinate k', { before: t('k=') });
        } }] },
    { num: '5', outcome: 'RF4',
      shared: function (r) {
        var c = r.pick(PLANS), rA = r.pick(c.rA), d = r.pick(c.d), n = r.int(c.n[0], c.n[1]), FB = r.pick(c.FB), FA = FB + d * n;
        var N = r.chance(0.5) ? r.int(Math.min(n + 2, 12), 12) : r.int(1, n - 1);
        return { c: c, rA: rA, rB: rA + d, FA: FA, FB: FB, n: n, N: N };
      },
      stem: function (s) { return s.c.intro(s); }, parts: [
        { id: '5a', outcome: 'RF4', level: 'MAS', make: function (r, s) {
          var c = s.c, x = 'n', eA = eqMB(s.rA, s.FA, x, 'C'), eB = eqMB(s.rB, s.FB, x, 'C'), cost = s.FA + s.rA * s.n;
          return numB('After how many ' + c.us + ' do ' + c.A + ' and ' + c.B + ' cost the same?', s.n, [
            s.FB ? { v: s.FA / (s.rB - s.rA), code: 'u7t-be-fee', hint: 'Don’t forget ' + c.B + '’s fee, ' + cur(s.FB) + ': both equations have a constant.' } : null,
            { v: (s.FA - s.FB) / (s.rA + s.rB), code: 'u7t-be-sign', hint: 'Get the ' + t('n') + '-terms on one side: ' + t(s.rB + 'n-' + s.rA + 'n=' + (s.rB - s.rA) + 'n') + ' — subtract the rates.' },
            { v: cost, code: 'u7t-be-cost', hint: 'That is the cost when they are equal. The question asks for the number of ' + c.us + '.' }],
            'Let ' + t('n') + ' be the number of ' + c.us + '. ' + c.A + ': ' + t(eA) + '; ' + c.B + ': ' + t(eB) + '.<br>Set them equal: ' + t(pol([[s.rA, 'n'], [s.FA, '']]) + '=' + pol([[s.rB, 'n'], [s.FB, '']])) + '<br>' + t((s.FA - s.FB) + '=' + (s.rB - s.rA) + 'n') + ', so ' + t('n=' + s.n) + '.<br>After <b>' + s.n + ' ' + c.us + '</b> both cost ' + cur(cost) + '.',
            ['Write an equation for each: the rate is ' + t('m') + ' and the fee is ' + t('b') + '.', 'Set the two equations equal and solve for ' + t('n') + '.'], 'break-even ' + c.u, { after: c.us });
        } },
        { id: '5b', outcome: 'RF4', level: 'MAS', make: function (r, s) {
          var c = s.c, N = s.N, cA = s.FA + s.rA * N, cB = s.FB + s.rB * N, ch = cA < cB ? 'A' : 'B';
          var p = B.fields('For ' + t(N) + ' ' + (N === 1 ? c.u : c.us) + ', find the total cost of each. Which is cheaper?', [{ name: c.A, label: c.A + ':', before: t('\\$') }, { name: c.B, label: c.B + ':', before: t('\\$') }, { name: 'Cheaper', label: 'Cheaper (A or B):', mode: 'text', placeholder: 'A or B' }],
            [numD(cA, [{ v: s.rA * N, code: 'u7t-ctx-nostart', hint: 'Add ' + c.A + '’s fee, ' + cur(s.FA) + '.' }]), numD(cB, [s.FB ? { v: s.rB * N, code: 'u7t-ctx-nostart', hint: 'Add ' + c.B + '’s fee, ' + cur(s.FB) + '.' } : null]),
              abChk(ch, c[ch] + ' costs less: ' + cur(Math.min(cA, cB)) + ' compared with ' + cur(Math.max(cA, cB)) + '.')],
            [String(cA), String(cB), ch], c.A + ' ' + cur(cA) + ', ' + c.B + ' ' + cur(cB) + ' — <b>' + c[ch] + '</b> is cheaper',
            c.A + ': ' + t(s.rA + '(' + N + ')+' + s.FA + '=' + cA) + '<br>' + c.B + ': ' + t(s.rB + '(' + N + ')' + (s.FB ? '+' + s.FB : '') + '=' + cB) + '<br><b>' + c[ch] + '</b> is cheaper for ' + N + ' ' + (N === 1 ? c.u : c.us) + (N < s.n ? ': before the break-even point the smaller fee wins.' : ': after the break-even point the smaller rate wins.'),
            ['Substitute ' + t('n=' + N) + ' into each equation.', 'Compare the two totals.'], 'which is cheaper ' + c.u);
          p.bad = [[String(cA), String(cB), ch === 'A' ? 'B' : 'A']];
          return p;
        } }] },

    /* ======================= RF3 · slope as a rate of change ======================= */
    { num: '6', outcome: 'RF3',
      shared: function (r) { return find(function () { var m = rnz(r, -4, 4), dx = r.int(2, 5), P = [r.int(-6, 3), r.int(-7, 7)]; return { m: m, P: P, Q2: [P[0] + dx, P[1] + m * dx] }; }, function (s) { return Math.abs(s.Q2[1]) <= 9 && s.Q2[0] <= 8 && s.P.concat(s.Q2).some(function (v) { return v < 0; }) && s.P[0] !== 0; }, { m: -2, P: [-2, 7], Q2: [2, -1] }); },
      stem: function (s) { return 'A line passes through ' + t(ptT(s.P)) + ' and ' + t(ptT(s.Q2)) + '.'; }, parts: [
        { id: '6', outcome: 'RF3', level: 'BEG', make: function (r, s) {
          var P = s.P, Q2 = s.Q2, dy = Q2[1] - P[1], dx = Q2[0] - P[0];
          var p = B.math('Determine the slope of the line.', K.slope([s.m, 1]), String(s.m),
            t('m=\\dfrac{y_2-y_1}{x_2-x_1}=\\dfrac{' + Q2[1] + '-' + sgnP(P[1]) + '}{' + Q2[0] + '-' + sgnP(P[0]) + '}=\\dfrac{' + dy + '}{' + dx + '}=' + s.m),
            ['Slope = change in ' + t('y') + ' ÷ change in ' + t('x') + ': ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + '.', 'Subtract in the same order on the top and the bottom.'], 'slope from two points', { keys: 'fraction', before: t('m=') });
          p.bad = [String(-s.m)].concat(Math.abs(s.m) > 1 ? [qT(Q(1, s.m))] : []);
          return p;
        } }] },
    { num: '7', outcome: 'RF3',
      shared: function (r) { var c = r.pick(RATE3); return { c: c, m: c.sg * r.pick(c.ms), b: r.pick(c.bs) }; },
      stem: function (s) { return s.c.desc(eqMB(s.m, s.b, s.c.x, s.c.y)); }, parts: [
        { id: '7a', outcome: 'RF3', level: 'BEG', make: function (r, s) {
          var c = s.c, dir = s.m > 0 ? 'increasing' : 'decreasing';
          var p = B.fields('State the slope. Is the ' + c.what + ' increasing or decreasing?', [{ name: 'Slope', label: 'Slope:' }, { name: 'Increasing or decreasing?', label: 'The ' + c.what + ' is:', mode: 'text', placeholder: 'increasing / decreasing', wide: true }],
            [numD(s.m, [{ v: -s.m, code: 'u7t-rate-sign', hint: 'The slope is the number multiplying ' + t(c.x) + ', <b>with its sign</b>.' }, s.b ? { v: s.b, code: 'u7t-mb-swap', hint: 'That’s the starting value. The slope is the number multiplying ' + t(c.x) + '.' } : null]),
              incChk(dir, 'The slope is ' + (s.m > 0 ? 'positive' : 'negative') + ', so the ' + c.what + ' is ' + dir + '.')],
            [String(s.m), dir], 'slope ' + t(s.m) + '; <b>' + dir + '</b>',
            'The slope is the coefficient of ' + t(c.x) + ': ' + t('m=' + s.m) + '. It is ' + (s.m > 0 ? 'positive' : 'negative') + ', so the ' + c.what + ' is <b>' + dir + '</b> — by ' + t(Math.abs(s.m)) + ' ' + c.per[0] + '.',
            ['In ' + t('y=mx+b') + ' the slope is the number in front of the variable.', 'A positive slope means increasing; a negative slope means decreasing.'], 'slope in context ' + c.y);
          p.bad = [[String(-s.m), s.m > 0 ? 'decreasing' : 'increasing']];
          return p;
        } },
        { id: '7b', outcome: 'RF3', level: 'BEG', make: function (r, s) {
          var c = s.c, U = c.per;
          return B.mc(r, 'In what units is the slope measured?', [{ html: U[0], right: true },
            { html: U[1], why: 'Slope units are (units of ' + t(c.y) + ') <b>per</b> (unit of ' + t(c.x) + '): ' + U[0] + ', not the other way around.' },
            { html: U[2], why: 'That’s the unit of ' + t(c.y) + ' alone (the unit of the starting value). A slope is a rate: ' + U[0] + '.' },
            { html: U[3], why: 'That’s the unit of ' + t(c.x) + '. A slope is a rate: units of ' + t(c.y) + ' per unit of ' + t(c.x) + '.' }],
            'Slope = change in ' + t(c.y) + ' ÷ change in ' + t(c.x) + ', so its units are (units of ' + t(c.y) + ') per (unit of ' + t(c.x) + '): <b>' + U[0] + '</b>.',
            ['A slope is a rate: units of the vertical quantity <b>per</b> unit of the horizontal quantity.'], 'units of slope ' + c.y);
        } }] },
    { num: '8', outcome: 'RF3',
      shared: function (r) {
        var c = r.pick(READ3);
        return find(function () { var S = r.pick(c.S), R = r.pick(c.R), T = r.int(c.T[0], c.T[1]); return { c: c, S: S, R: R, T: T, V1: S + c.sg * R * T }; }, function (s) { return s.V1 > 0 && (s.c.sg < 0 || s.V1 <= 100 || s.c.yu !== '%') && s.T !== s.R; }, { c: READ3[0], S: 500, R: 30, T: 4, V1: 380 });
      },
      stem: function (s) { return s.c.intro(s); }, parts: [
        { id: '8a', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var c = s.c, m = c.sg * s.R, dV = s.V1 - s.S;
          return numB('Determine the rate of change (the slope), with its sign.', m, [{ v: -m, code: 'u7t-rate-sign', hint: 'The ' + c.what + ' goes ' + (m < 0 ? '<b>down</b>, so the rate is negative' : '<b>up</b>, so the rate is positive') + '.' },
            { v: dV, code: 'u7t-rate-nodiv', hint: 'That is the change over all ' + t(s.T) + ' ' + c.xp + '. Divide by ' + t(s.T) + ' to get the change per ' + c.xs + '.' },
            { v: s.T / dV, code: 'u7t-rate-flip', hint: 'Rate = change in the ' + c.what + ' ÷ change in time — you have time over amount.' },
            { v: s.V1 / s.T, code: 'u7t-rate-point', hint: 'Use the <b>change</b>: ' + t(F(s.V1) + '-' + F(s.S)) + ', divided by the change in time.' }],
            t('m=\\dfrac{' + F(s.V1) + '-' + F(s.S) + '}{' + s.T + '-0}=\\dfrac{' + F(dV) + '}{' + s.T + '}=' + m) + ' ' + c.unit + '.',
            ['Use the two readings ' + t('(0,\\ ' + F(s.S) + ')') + ' and ' + t('(' + s.T + ',\\ ' + F(s.V1) + ')') + '.', 'Rate = change in the ' + c.what + ' ÷ change in time.'], 'rate from two readings', { after: c.unit });
        } },
        { id: '8b', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var c = s.c, R = s.R, dn = c.sg < 0 ? 'down' : 'up', up = c.sg < 0 ? 'up' : 'down', Y = c.yu === '%' ? R + '\\%' : R + '\\text{ ' + c.yu + '}';
          return B.mc(r, 'What does the slope tell you in this situation?', [
            { html: 'The ' + c.what + ' goes ' + dn + ' by ' + t(Y) + ' every ' + c.xs + '.', right: true },
            { html: 'The ' + c.what + ' goes ' + up + ' by ' + t(Y) + ' every ' + c.xs + '.', why: 'Check the sign: the ' + c.what + ' ' + (c.sg < 0 ? 'decreases' : 'increases') + ', so the slope is ' + (c.sg < 0 ? 'negative' : 'positive') + '.' },
            { html: 'It takes ' + t(R) + ' ' + c.xp + ' for each ' + c.ys + '.', why: 'Slope units are (units of the ' + c.what + ') per (unit of time): ' + c.unit + ', not ' + c.xp + ' per ' + c.ys + '.' },
            { html: c.start(s), why: 'True, but that is the starting value (the intercept), not the slope. The slope is the rate of change.' }],
            'The slope is ' + t((c.sg < 0 ? '-' : '') + R) + ' ' + c.unit + ': the ' + c.what + ' goes <b>' + dn + '</b> by ' + t(Y) + ' every ' + c.xs + '.',
            ['The slope is a rate: how much the ' + c.what + ' changes each ' + c.xs + ', and in which direction.'], 'meaning of slope');
        } }] },
    { num: '9', outcome: 'RF3',
      shared: function (r) {
        var c = r.pick(CMP3), rs = r.sample(c.rates, 2), fs = r.sample(c.fees, 2).sort(function (a, b) { return a - b; });
        var hi = rs[0] > rs[1] ? 0 : 1, cross = r.chance(0.65), fees = [0, 0]; fees[hi] = cross ? fs[0] : fs[1]; fees[1 - hi] = cross ? fs[1] : fs[0];   // usually the larger rate has the smaller fee (the lines cross)
        return { c: c, mA: rs[0], mB: rs[1], bA: fees[0], bB: fees[1] };
      },
      stem: function (s) { var c = s.c; return c.who + '<div style="margin:.4em 0"><b>' + c.A + ':</b> ' + t(eqDec(s.mA, s.bA, c.x)) + ' &nbsp;&nbsp;&nbsp; <b>' + c.B + ':</b> ' + t(eqDec(s.mB, s.bB, c.x)) + '</div>'; }, parts: [
        { id: '9', outcome: 'RF3', level: 'PRG', make: function (r, s) {
          var c = s.c, want = { rate: s.mA > s.mB ? 'A' : 'B', fee: s.bA > s.bB ? 'A' : 'B', long: s.mA < s.mB ? 'A' : 'B' }, nm = { A: c.A, B: c.B };
          var rows = [{ id: 'rate', html: c.rows[0], label: 'rate' }, { id: 'fee', html: c.rows[1], label: 'fee' }, { id: 'long', html: c.rows[2], label: 'long run' }];
          var why = function (id) {
            return { code: 'u7t-cmp-one', hint: id === 'rate' ? 'The cost per unit is the <b>slope</b>: ' + t(num(Math.max(s.mA, s.mB))) + ' is more than ' + t(num(Math.min(s.mA, s.mB))) + '.' : id === 'fee' ? 'The cost at ' + t(c.x + '=0') + ' is the <b>' + t('C') + '-intercept</b>: ' + t(Math.max(s.bA, s.bB)) + ' is more than ' + t(Math.min(s.bA, s.bB)) + '.' : 'For a very large ' + t(c.x) + ', the rate matters most: the smaller <b>slope</b> grows more slowly, so it ends up cheaper.' };
          };
          return gridP('Choose ' + c.A + ' or ' + c.B + ' for each statement.', rows, [{ id: 'A', html: c.A, label: 'A' }, { id: 'B', html: c.B, label: 'B' }], want, why, { code: 'u7t-cmp-many' },
            'Per unit: ' + nm[want.rate] + ' (slope ' + t(num(Math.max(s.mA, s.mB))) + ' vs ' + t(num(Math.min(s.mA, s.mB))) + ').<br>At ' + t(c.x + '=0') + ': ' + nm[want.fee] + ' (' + cur(Math.max(s.bA, s.bB)) + ' vs ' + cur(Math.min(s.bA, s.bB)) + ').<br>Very long: ' + nm[want.long] + ' — its smaller rate means its cost grows more slowly' + (want.long === want.fee ? ', so it eventually costs less even though it starts higher.' : ', and it also starts lower, so it is cheaper in every case.'),
            ['The slope is the cost for each extra unit; the ' + t('C') + '-intercept is the cost before any units.', 'In the long run, the plan with the smaller slope is cheaper.'], 'compare two rates');
        } }] },

    /* ======================= RF5 · intercepts, slope read off a graph ======================= */
    { num: '10', outcome: 'RF5',
      shared: function (r) {
        return find(function () { var mq = r.pick([[1, 1], [2, 1], [3, 1], [1, 2], [2, 3], [3, 2]]); return { m: Q(r.pick([1, -1]) * mq[0], mq[1]), b: rnz(r, -5, 5) }; },
          function (s) { var X = -s.b / qv(s.m); return Number.isInteger(X) && Math.abs(X) <= 5 && X !== 0 && lattice(lineMB(s.m, s.b), [-6, 6], [-6, 6]).length >= 3; }, { m: [2, 3], b: 2 });
      },
      stem: function (s) { return 'Use the graph of the line.' + lineFig([lineMB(s.m, s.b)], [-6, 6], [-6, 6]); }, parts: [
        { id: '10a', outcome: 'RF5', level: 'BEG', make: function (r, s) {
          var X = -s.b / qv(s.m), b = s.b;
          var p = B.math('State the ' + t('x') + '-intercept.', icChk([X, 1], 'x', [b, 1]), String(X), 'The line crosses the ' + t('x') + '-axis at ' + t(ptT([X, 0])) + ', so the ' + t('x') + '-intercept is ' + t(X) + '.',
            ['The ' + t('x') + '-intercept is where the line crosses the ' + t('x') + '-axis (the horizontal axis).'], 'x-intercept from graph', { keys: 'fraction', placeholder: 'e.g. -3' });
          p.bad = X !== b ? [String(b)] : [];
          return p;
        } },
        { id: '10b', outcome: 'RF5', level: 'BEG', make: function (r, s) {
          var X = -s.b / qv(s.m), b = s.b;
          var p = B.math('State the ' + t('y') + '-intercept.', icChk([b, 1], 'y', [X, 1]), String(b), 'The line crosses the ' + t('y') + '-axis at ' + t(ptT([0, b])) + ', so the ' + t('y') + '-intercept is ' + t(b) + '.',
            ['The ' + t('y') + '-intercept is where the line crosses the ' + t('y') + '-axis (the vertical axis).'], 'y-intercept from graph', { keys: 'fraction', placeholder: 'e.g. -3' });
          p.bad = X !== b ? [String(X)] : [];
          return p;
        } },
        { id: '10c', outcome: 'RF5', level: 'BEG', make: function (r, s) {
          var m = s.m, b = s.b;
          var p = B.math('Determine the slope of the line.', K.slope(m, { graph: true }), qT(m),
            'From ' + t(ptT([0, b])) + ' to ' + t(ptT([m[1], b + m[0]])) + ': rise ' + t(m[0]) + ', run ' + t(m[1]) + ', so ' + t('m=' + qT(m)) + '.',
            ['Pick two points where the line crosses grid corners.', 'Slope = rise ÷ run; a line that falls from left to right has a negative slope.'], 'slope from graph', { keys: 'fraction', before: t('m=') });
          p.bad = [qT(qn(m))].concat(Math.abs(m[0]) !== m[1] ? [qT(qd(1, m))] : []);
          return p;
        } }] },
    { num: '11', outcome: 'RF5',
      shared: function (r) {
        return find(function () { var a = rnz(r, -8, 8), c = rnz(r, -8, 8); return { X: a, Y: c, L: L3(c, a, -a * c) }; },
          function (v) { return Math.abs(v.X) !== Math.abs(v.Y) && v.L.A <= 6 && Math.abs(v.L.B) <= 6 && Math.abs(v.L.C) <= 24 && (Math.abs(v.X) > 1 || Math.abs(v.Y) > 1); }, { X: 6, Y: -4, L: L3(-4, 6, 24) });
      },
      stem: function (s) { return 'A line has the equation ' + t(gT(s.L)) + '. Find each intercept <b>directly from this equation</b> (no need to rewrite it as ' + t('y=mx+b') + ').'; }, parts: [
        { id: '11a', outcome: 'RF5', level: 'PRG', make: function (r, s) {
          var L = s.L;
          var p = B.math('Determine the ' + t('x') + '-intercept.', icChk([s.X, 1], 'x', [s.Y, 1], [{ v: Q(L.C, L.A), code: 'u7t-icpt-sign', hint: 'Move the constant to the other side: it changes sign. ' + t(pol([[L.A, 'x']]) + '=' + (-L.C)) + '.' }]), String(s.X),
            'Let ' + t('y=0') + ': ' + t(pol([[L.A, 'x'], [L.C, '']]) + '=0') + ', so ' + t(pol([[L.A, 'x']]) + '=' + (-L.C)) + (L.A !== 1 ? ' and ' + t('x=' + s.X) : '') + '. The ' + t('x') + '-intercept is ' + t(s.X) + ', the point ' + t(ptT([s.X, 0])) + '.',
            ['The ' + t('x') + '-intercept is where ' + t('y=0') + ': cover up the ' + t('y') + '-term and solve for ' + t('x') + '.'], 'x-int of general form', { keys: 'fraction', placeholder: 'e.g. 4' });
          p.bad = [String(s.Y), String(-s.X)];
          return p;
        } },
        { id: '11b', outcome: 'RF5', level: 'PRG', make: function (r, s) {
          var L = s.L;
          var p = B.math('Determine the ' + t('y') + '-intercept.', icChk([s.Y, 1], 'y', [s.X, 1], [{ v: Q(L.C, L.B), code: 'u7t-icpt-sign', hint: 'Move the constant to the other side: it changes sign. ' + t(pol([[L.B, 'y']]) + '=' + (-L.C)) + '.' }]), String(s.Y),
            'Let ' + t('x=0') + ': ' + t(pol([[L.B, 'y'], [L.C, '']]) + '=0') + ', so ' + t(pol([[L.B, 'y']]) + '=' + (-L.C)) + (L.B !== 1 ? ' and ' + t('y=' + s.Y) : '') + '. The ' + t('y') + '-intercept is ' + t(s.Y) + ', the point ' + t(ptT([0, s.Y])) + '.',
            ['The ' + t('y') + '-intercept is where ' + t('x=0') + ': cover up the ' + t('x') + '-term and solve for ' + t('y') + '.'], 'y-int of general form', { keys: 'fraction', placeholder: 'e.g. 4' });
          p.bad = [String(s.X), String(-s.Y)];
          return p;
        } }] },
    { num: '12', outcome: 'RF5', shared: function (r) { return { vert: r.chance(0.5), k: rnz(r, -5, 5) }; },
      stem: function (s) { return 'Use the graph. Write <b>none</b> if the line doesn’t have that intercept.' + lineFig([s.vert ? L3(1, 0, -s.k) : L3(0, 1, -s.k)], [-6, 6], [-6, 6]); }, parts: [
        { id: '12', outcome: 'RF5', level: 'PRG', make: function (r, s) {
          var k = s.k, xi = s.vert ? [k, 1] : null, yi = s.vert ? null : [k, 1], m = s.vert ? null : [0, 1];
          var p = B.fields('State the ' + t('x') + '-intercept, the ' + t('y') + '-intercept and the slope of the line. Write <b>none</b> for an intercept it doesn’t have.',
            [{ name: 'x-intercept', label: t('x') + '-intercept:', mode: 'math', keys: 'slope', none: true, placeholder: 'number or none' }, { name: 'y-intercept', label: t('y') + '-intercept:', mode: 'math', keys: 'slope', none: true, placeholder: 'number or none' }, { name: 'slope', label: 'Slope:', mode: 'math', keys: 'slope', none: true, placeholder: 'number or undefined' }],
            [icChk(xi, 'x', yi), icChk(yi, 'y', xi), K.slope(m)], [xi ? String(k) : 'none', yi ? String(k) : 'none', s.vert ? 'undefined' : '0'],
            s.vert ? t('x') + '-intercept ' + t(k) + '; no ' + t('y') + '-intercept; slope undefined' : 'no ' + t('x') + '-intercept; ' + t('y') + '-intercept ' + t(k) + '; slope ' + t('0'),
            s.vert ? 'The line is <b>vertical</b>: ' + t('x=' + k) + '. It crosses the ' + t('x') + '-axis at ' + t('(' + k + ',\\ 0)') + ', so the ' + t('x') + '-intercept is ' + t(k) + '. It never crosses the ' + t('y') + '-axis, so there is <b>no</b> ' + t('y') + '-intercept. The run is ' + t('0') + ', so the slope is <b>undefined</b>.'
              : 'The line is <b>horizontal</b>: ' + t('y=' + k) + '. It crosses the ' + t('y') + '-axis at ' + t('(0,\\ ' + k + ')') + ', so the ' + t('y') + '-intercept is ' + t(k) + '. It never crosses the ' + t('x') + '-axis, so there is <b>no</b> ' + t('x') + '-intercept. The rise is ' + t('0') + ', so the slope is ' + t('0') + '.',
            ['Which axis does the line cross? Which axis does it run alongside?', 'A horizontal line has slope ' + t('0') + '; a vertical line’s slope is undefined (type <b>undefined</b>).'], (s.vert ? 'vertical' : 'horizontal') + ' line intercepts');
          p.bad = s.vert ? [['none', String(k), '0'], [String(k), 'none', '0']] : [[String(k), 'none', '0'], ['none', String(k), 'undefined']];
          return p;
        } }] },

    /* ======================= RF6 · y = mx + b, general form and graphs ======================= */
    { num: '13', outcome: 'RF6',
      shared: function (r) { return find(function () { return { m: r.int(1, 4), b: rnz(r, -5, 5), cf: r.chance(0.25) }; }, function (s) { return lattice(lineMB(s.m, s.b), [-6, 6], [-8, 8]).length >= 3; }, { m: 2, b: -3, cf: false }); },
      stem: function (s) { return 'Consider the line ' + t(s.cf ? 'y=' + s.b + term(s.m, 'x', false) : eqMB(s.m, s.b)) + '.'; }, parts: [
        { id: '13a', outcome: 'RF6', level: 'BEG', make: function (r, s) {
          var m = s.m, b = s.b, eq = s.cf ? 'y=' + b + term(m, 'x', false) : eqMB(m, b), cf = s.cf;
          var p = B.fields('State the slope ' + t('m') + ' and the ' + t('y') + '-intercept ' + t('b') + '.', [{ name: 'Slope', label: t('m=') }, { name: 'y-intercept', label: t('b=') }],
            [numD(m, [{ v: b, code: cf ? 'u7t-mb-order' : 'u7t-mb-swap', hint: cf ? 'The constant is written first here, but the slope is still the number multiplying ' + t('x') + '.' : 'That’s the ' + t('y') + '-intercept. The slope is the number multiplying ' + t('x') + '.' }]),
              numD(b, [{ v: m, code: cf ? 'u7t-mb-order' : 'u7t-mb-swap', hint: 'That’s the slope. The ' + t('y') + '-intercept is the constant term' + (cf ? ' — here it is written first.' : '.') }, { v: -b, code: 'u7t-icpt-sign', hint: 'Keep the sign: ' + t(eq) + '.' }])],
            [String(m), String(b)], t('m=' + m) + ', ' + t('b=' + b),
            (cf ? t(eq) + ' is ' + t(eqMB(m, b)) + '. ' : 'Compare with ' + t('y=mx+b') + ': ') + 'the slope is the coefficient of ' + t('x') + ', ' + t('m=' + m) + '; the ' + t('y') + '-intercept is the constant, ' + t('b=' + b) + '.',
            ['In ' + t('y=mx+b') + ', ' + t('m') + ' multiplies ' + t('x') + ' and ' + t('b') + ' is the constant (with its sign).' + (cf ? ' The order of the terms doesn’t matter.' : '')], 'm and b of ' + eq);
          p.bad = m !== b ? [[String(b), String(m)]] : [];
          return p;
        } },
        { id: '13b', outcome: 'RF6', level: 'BEG', make: function (r, s) {
          var m = s.m, b = s.b, L = lineMB(m, b), eq = eqMB(m, b);
          return graphLine('Graph the line using its slope and ' + t('y') + '-intercept.', L, [-6, 6], [-8, 8], [
            { L: lineMB(-m, b), code: 'graph-slope-sign', hint: 'The slope ' + t(m) + ' is positive, so the line rises from left to right: step <b>up</b> ' + t(m) + ' for every ' + t('1') + ' right.' },
            { L: lineMB(m, -b), code: 'graph-int-sign', hint: 'Check the sign of the ' + t('y') + '-intercept: start at ' + t('(0,\\ ' + b + ')') + '.' },
            { L: line2([b, 0], [b + 1, m]), code: 'graph-b-x', hint: 'The ' + t('y') + '-intercept is on the ' + t('y') + '-axis: start at ' + t('(0,\\ ' + b + ')') + '.' },
            m > 1 ? { L: lineMB(Q(1, m), b), code: 'graph-flip', hint: 'Slope ' + t(m) + ' is ' + t('\\frac{' + m + '}{1}') + ': up ' + t(m) + ', right ' + t('1') + ' (not up 1, right ' + m + ').' } : null].filter(Boolean),
            '<b>Step 1:</b> plot the ' + t('y') + '-intercept ' + t('(0,\\ ' + b + ')') + '.<br><b>Step 2:</b> slope ' + t(m + '=\\frac{' + m + '}{1}') + ': from there go right ' + t('1') + ' and up ' + t(m) + ' to ' + t(ptT([1, b + m])) + '.<br><b>Step 3:</b> draw the line through both points, with arrows on both ends.',
            ['Start at ' + t('(0,\\ b)') + ' on the ' + t('y') + '-axis.', 'Write the slope as ' + t('\\frac{\\text{rise}}{\\text{run}}') + ' and step right by the run, up by the rise.'], 'graph ' + eq);
        } }] },
    { num: '14', outcome: 'RF6', shared: function (r) { return { vert: r.chance(0.5), k: rnz(r, -6, 6) }; },
      stem: function (s) { return 'Graph the line ' + t((s.vert ? 'x=' : 'y=') + s.k) + '.'; }, parts: [
        { id: '14', outcome: 'RF6', level: 'BEG', make: function (r, s) {
          var k = s.k, L = s.vert ? L3(1, 0, -k) : L3(0, 1, -k), W = s.vert ? L3(0, 1, -k) : L3(1, 0, -k), eq = (s.vert ? 'x=' : 'y=') + k;
          return graphLine('Graph ' + t(eq) + ' on the grid.', L, [-7, 7], [-7, 7], [{ L: W, code: 'u7t-hv-swap', hint: t(eq) + ' fixes the <b>' + t(s.vert ? 'x' : 'y') + '</b>-coordinate: every point has ' + t(eq) + ', so the line is <b>' + (s.vert ? 'vertical' : 'horizontal') + '</b>.' },
            { L: s.vert ? L3(1, 0, k) : L3(0, 1, k), code: 'u7t-hv-coord', hint: 'Check the sign: every point on the line has ' + t(eq) + '.' }],
            'Every point on ' + t(eq) + ' has ' + t((s.vert ? 'x' : 'y') + '-coordinate ' + k) + ' (for example ' + t(s.vert ? ptT([k, -2]) : ptT([-2, k])) + ', ' + t(s.vert ? ptT([k, 0]) : ptT([0, k])) + ', ' + t(s.vert ? ptT([k, 3]) : ptT([3, k])) + '), so the line is <b>' + (s.vert ? 'vertical' : 'horizontal') + '</b>, crossing the ' + t(s.vert ? 'x' : 'y') + '-axis at ' + t(k) + '.',
            ['Which coordinate is fixed? ' + t('x=k') + ' is vertical; ' + t('y=k') + ' is horizontal.'], 'graph ' + eq);
        } }] },
    { num: '15', outcome: 'RF6', stem: 'Rewrite each equation in the form asked for.', parts: [
      { id: '15a', outcome: 'RF6', level: 'PRG', make: function (r) {
        var v = find(function () { return { Bc: r.pick([1, 2, 2, 3, 4]), m: rnz(r, -5, 5), b: rnz(r, -6, 6), alt: r.chance(0.3) }; }, function (v) { return !(v.Bc === 1 && v.alt); }, { Bc: 2, m: -2, b: 5, alt: false });
        var Bc = v.Bc, m = v.m, b = v.b, A = -m * Bc, C = b * Bc, L = lineMB(m, b);
        var eq = v.alt ? pol([[Bc, 'y']]) + '=' + pol([[m * Bc, 'x'], [C, '']]) : pol([[A, 'x'], [Bc, 'y']]) + '=' + C, W = [];
        if (!v.alt) W.push({ is: lineMB(-m, b), code: 'u7t-move-sign', hint: 'Moving ' + t(pol([[A, 'x']])) + ' to the other side changes its sign: ' + t(pol([[Bc, 'y']]) + '=' + pol([[-A, 'x'], [C, '']])) + '.' });
        if (Bc > 1) W.push({ is: lineMB(m, C), code: 'u7t-div-one', hint: 'Divide <b>every</b> term by ' + t(Bc) + ', the constant too.' }, { is: lineMB(m * Bc, b), code: 'u7t-div-one', hint: 'Divide <b>every</b> term by ' + t(Bc) + ', the ' + t('x') + '-term too.' });
        return lineP('Rearrange ' + t(eq) + ' into slope–intercept form, ' + t('y=mx+b') + '.', L, { form: 'slope-intercept', wrong: W },
          (v.alt ? '' : 'Move the ' + t('x') + '-term (change its sign): ' + t(pol([[Bc, 'y']]) + '=' + pol([[-A, 'x'], [C, '']])) + '<br>') + (Bc > 1 ? 'Divide every term by ' + t(Bc) + ': ' : '') + t(sT(L)) + ' (so ' + t('m=' + m) + ', ' + t('b=' + b) + ')',
          ['Get ' + t('y') + ' by itself: move the ' + t('x') + '-term to the other side (its sign changes).' + (Bc > 1 ? ' Then divide every term by ' + t(Bc) + '.' : ''), 'Write the ' + t('x') + '-term first: ' + t('y=mx+b') + '.'], 'rearrange to y=mx+b');
      } },
      { id: '15b', outcome: 'RF6', level: 'PRG', make: function (r) {
        var v = find(function () { var q = r.int(2, 5), p = r.int(1, 4); return { q: q, p: p, sg: r.pick([1, -1]), b: rnz(r, -6, 6) }; }, function (v) { return gcd(v.p, v.q) === 1; }, { q: 3, p: 2, sg: -1, b: 4 });
        var m = Q(v.sg * v.p, v.q), q = v.q, b = v.b, L = lineMB(m, b), mid = pol([[-v.sg * v.p, 'x'], [q, 'y'], [-q * b, '']]) + '=0';
        return lineP('Write ' + t(sT(L)) + ' in general form, ' + t('Ax+By+C=0') + ' (' + t('A') + ', ' + t('B') + ', ' + t('C') + ' integers, ' + t('A') + ' positive).', L, { form: 'general', wrong: [
          { is: L3(v.sg * v.p, -q, b), code: 'u7t-gen-const', hint: 'Multiply <b>every</b> term by ' + t(q) + ' — the constant ' + t(b) + ' too.' }] },
          'Multiply every term by ' + t(q) + ': ' + t(q + 'y=' + pol([[v.sg * v.p, 'x'], [q * b, '']])) + '<br>Move every term to the left side: ' + t(mid) + (v.sg > 0 ? '<br>Multiply by ' + t('-1') + ' so ' + t('A') + ' is positive: ' + t(gT(L)) : ''),
          ['Clear the fraction first: multiply every term by ' + t(q) + '.', 'Then move every term to one side so the other side is ' + t('0') + ', with the ' + t('x') + '-term positive.'], 'y=mx+b to general form');
      } }] },
    { num: '16', outcome: 'RF6', stem: 'Graph each line. Choose the quickest method for its form.', parts: [
      { id: '16a', outcome: 'RF6', level: 'PRG', make: function (r) {
        var v = find(function () { return { m: Q(r.pick([[-1, 1], [-2, 1], [-3, 1], [1, 2], [3, 4], [2, 3], [-2, 3], [-1, 2], [-3, 4], [1, 3], [-1, 3], [3, 2], [-3, 2]])), b: r.int(-4, 4) }; }, function (v) { return lattice(lineMB(v.m, v.b), [-6, 6], [-6, 6]).length >= 3; }, { m: [-2, 3], b: 2 });
        var m = v.m, b = v.b, L = lineMB(m, b), rise = m[0], run = m[1], eq = sT(L);
        return graphLine('Graph ' + t(eq) + '.', L, [-6, 6], [-6, 6], [
          { L: lineMB(qn(m), b), code: 'graph-slope-sign', hint: 'Check the direction: the slope ' + t(qT(m)) + ' is ' + (rise > 0 ? 'positive, so step up' : 'negative, so step <b>down</b>') + ' as you go right.' },
          Math.abs(rise) !== run ? { L: lineMB(Q(Math.sign(rise) * run, Math.abs(rise)), b), code: 'graph-flip', hint: 'Rise and run are swapped: in ' + t(qT(m)) + ' the top number is the <b>rise</b> (up or down) and the bottom number is the <b>run</b> (right).' } : null,
          b ? { L: lineMB(m, -b), code: 'graph-int-sign', hint: 'Check the sign of the ' + t('y') + '-intercept: start at ' + t('(0,\\ ' + b + ')') + '.' } : null].filter(Boolean),
          'Plot the ' + t('y') + '-intercept ' + t('(0,\\ ' + b + ')') + '. Slope ' + t(qT(m) + '=\\frac{' + rise + '}{' + run + '}') + ': go right ' + t(run) + ' and ' + (rise < 0 ? 'down ' + t(-rise) : 'up ' + t(rise)) + ' to ' + t(ptT([run, b + rise])) + '. Draw the line through both points, with arrows.',
          ['Start at ' + t('(0,\\ b)') + '.', 'A negative slope: step right by the run and <b>down</b> by the rise.'], 'graph ' + eq);
      } },
      { id: '16b', outcome: 'RF6', level: 'PRG', make: function (r) {
        var v = find(function () { var a = rnz(r, -6, 6), c = rnz(r, -6, 6); return { X: a, Y: c, L: L3(c, a, -a * c) }; }, function (v) { return Math.abs(v.X) !== Math.abs(v.Y) && v.L.A <= 6 && Math.abs(v.L.B) <= 6 && (Math.abs(v.X) > 1 || Math.abs(v.Y) > 1); }, { X: 3, Y: -6, L: L3(-6, 3, 18) });
        var L = v.L, eq = gT(L);
        return graphLine('Graph ' + t(eq) + '.', L, [-7, 7], [-7, 7], [
          { L: line2([v.Y, 0], [0, v.X]), code: 'graph-int-swap', hint: 'Your intercepts are swapped: the ' + t('x') + '-intercept ' + t(ptT([v.X, 0])) + ' is on the ' + t('x') + '-axis.' },
          { L: line2([-v.X, 0], [0, -v.Y]), code: 'graph-int-sign', hint: 'Check the signs of the intercepts: ' + t(ptT([v.X, 0])) + ' and ' + t(ptT([0, v.Y])) + '.' }],
          'General form: use the two intercepts.<br>' + t('y=0') + ': ' + t(pol([[L.A, 'x'], [L.C, '']]) + '=0') + ', so ' + t('x=' + v.X) + ' → ' + t(ptT([v.X, 0])) + '<br>' + t('x=0') + ': ' + t(pol([[L.B, 'y'], [L.C, '']]) + '=0') + ', so ' + t('y=' + v.Y) + ' → ' + t(ptT([0, v.Y])) + '<br>Plot both intercepts and draw the line through them, with arrows.',
          ['For general form, the two-intercept method is quickest: set ' + t('y=0') + ' to find the ' + t('x') + '-intercept, and ' + t('x=0') + ' to find the ' + t('y') + '-intercept.'], 'graph ' + eq);
      } }] },
    { num: '17', outcome: 'RF6',
      shared: function (r) {
        var v = find(function () { var q = r.pick([2, 3, 4]), p = r.int(1, 6); return { q: q, p: p, sg: r.pick([1, -1]), b: rnz(r, -6, 6) }; }, function (v) { return gcd(v.p, v.q) === 1; }, { q: 2, p: 3, sg: -1, b: 4 });
        var types = r.sample(['sign', 'one', 'swap'], 2), nm = r.sample(NAMES, 2);
        return { p: v.p, q: v.q, sg: v.sg, b: v.b, m: Q(v.sg * v.p, v.q), A: v.p, B: -v.sg * v.q, C: v.sg * v.q * v.b, types: types, nm: nm, oneX: r.chance(0.3) };
      },
      stem: function (s) {
        return 'Two students rewrote ' + t(pol([[s.A, 'x'], [s.B, 'y'], [s.C, '']]) + '=0') + ' in the form ' + t('y=mx+b') + '. Each made one mistake.' +
          s.types.map(function (ty, i) { var w = q17Work(s, ty); return '<div style="margin:.45em 0"><b>' + s.nm[i] + ':</b>&nbsp; ' + t(w[0]) + ' &nbsp;→&nbsp; ' + t(w[1]) + '</div>'; }).join('');
      }, parts: [
        { id: '17a', outcome: 'RF6', level: 'MAS', make: function (r, s) {
          var want = { s0: s.types[0], s1: s.types[1] }, nmOf = { s0: s.nm[0], s1: s.nm[1] }, D = { sign: 'Moved a term across the ' + t('=') + ' sign without changing its sign', one: 'Didn’t divide every term by the coefficient of ' + t('y'), swap: 'Put the slope and the ' + t('y') + '-intercept in each other’s places' };
          var why = function (row) { var ty = want[row], w = q17Work(s, ty); return { code: 'u7t-err-one', hint: ty === 'sign' ? 'Look at ' + nmOf[row] + '’s first line: ' + t(w[0]) + '. The ' + t('x') + '-term kept its sign when it moved across the ' + t('=') + '.' : ty === 'one' ? 'Look at ' + nmOf[row] + '’s second line: not every term was divided by ' + t(s.B) + '.' : nmOf[row] + '’s first line is right; in the second line the number multiplying ' + t('x') + ' should be the slope, ' + t(qT(s.m)) + '.' }; };
          return gridP('What mistake did each student make?', [{ id: 's0', html: '<b>' + s.nm[0] + '</b>', label: s.nm[0] }, { id: 's1', html: '<b>' + s.nm[1] + '</b>', label: s.nm[1] }],
            ['sign', 'one', 'swap'].map(function (k) { return { id: k, html: D[k], label: k }; }), want, why, { code: 'u7t-err-many' },
            s.types.map(function (ty, i) { return '<b>' + s.nm[i] + '</b>: ' + D[ty].charAt(0).toLowerCase() + D[ty].slice(1) + '.'; }).join('<br>') + '<br>Correct: ' + t(pol([[s.B, 'y']]) + '=' + pol([[-s.A, 'x'], [-s.C, '']])) + ' → ' + t(sT(lineMB(s.m, s.b))) + '.',
            ['Redo the first step yourself (move the ' + t('x') + '-term and the constant across) and compare.', 'Then divide <b>every</b> term by ' + t(s.B) + '.'], 'name two rearranging mistakes', { rowHead: 'Student' });
        } },
        { id: '17b', outcome: 'RF6', level: 'MAS', make: function (r, s) {
          var L = lineMB(s.m, s.b), W = s.types.map(function (ty, i) { var w = q17Work(s, ty); return { is: w[1], code: 'u7t-err-copied', hint: 'That is ' + s.nm[i] + '’s answer, which has a mistake.' }; });
          var p = lineP('Write the correct equation in the form ' + t('y=mx+b') + '.', L, { form: 'slope-intercept', wrong: W },
            'Move the ' + t('x') + '-term and the constant (each changes sign): ' + t(pol([[s.B, 'y']]) + '=' + pol([[-s.A, 'x'], [-s.C, '']])) + '<br>Divide every term by ' + t(s.B) + ': ' + t(sT(L)),
            ['Move the ' + t('x') + '-term and the constant to the right side, changing their signs.', 'Divide <b>every</b> term by ' + t(s.B) + '.'], 'correct rearrangement');
          p.bad = s.types.map(function (ty) { return q17Work(s, ty)[1]; });
          return p;
        } }] },
    { num: '18', outcome: 'RF6',
      shared: function (r) {
        var m = r.chance(0.4) ? Q(r.pick([1, -1]) * r.pick([1, 2]), 3) : Q(r.pick([2, 3, 4, -2, -3, -4])), b = rnz(r, -6, 6);
        return { m: m, b: b, k: r.pick([2, 3]) };
      },
      stem: function (s) { return 'Select <b>every</b> equation below that describes the same line as ' + t(sT(lineMB(s.m, s.b))) + '.'; }, parts: [
        { id: '18', outcome: 'RF6', level: 'MAS', make: function (r, s) {
          var m = s.m, b = s.b, L = lineMB(m, b), k = s.k, q = m[1], Wc = L3(L.A, L.B, -L.C), Ws = lineMB(qn(m), b);
          var opts = [{ value: 'g', html: t(gT(L)), right: 1 }, { value: 'k', html: t(pol([[k * L.A, 'x'], [k * L.B, 'y'], [k * L.C, '']]) + '=0'), right: 1 },
            { value: 'y', html: t(pol([[q, 'y'], [-m[0], 'x']]) + '=' + q * b), right: 1 },
            { value: 'c', html: t(gT(Wc)), right: 0, simp: sT(Wc) }, { value: 's', html: t(gT(Ws)), right: 0, simp: sT(Ws) }];
          var by = {}; opts.forEach(function (o) { by[o.value] = o; });
          var want = ['g', 'k', 'y'];
          var check = K.selectSet(want, function (extra, missing) {
            if (extra.length + missing.length > 1) return { code: 'u7t-eqv-many', hint: 'Rewrite each one in the form ' + t('y=mx+b') + ' and compare it with ' + t(sT(L)) + '.' };
            if (extra.length) return { code: 'u7t-eqv-extra', hint: by[extra[0]].html + ' rearranges to ' + t(by[extra[0]].simp) + ' — a different line.' };
            return { code: 'u7t-eqv-missed', hint: 'One more is the same line: rearrange ' + by[missing[0]].html + ' to ' + t('y=mx+b') + '.' };
          });
          var shown = r.shuffle(opts);
          return { prompt: 'Select every equation of the same line as ' + t(sT(L)) + '. (They don’t have to be in proper general form.)', input: { type: 'select', options: shown.map(function (o) { return { value: o.value, html: o.html }; }), help: 'Tap every equation of the same line. Tap again to unselect.' },
            check: check, key: want, answer: want.map(function (v) { return by[v].html; }).join(', '),
            solution: 'Rewrite each one as ' + t('y=mx+b') + ':<br>' + shown.map(function (o) { return o.html + ' → ' + t(o.simp || sT(L)) + (o.right ? ' ✓ same line' : ' ✗ different line'); }).join('<br>') + '<br>(' + t(pol([[k * L.A, 'x'], [k * L.B, 'y'], [k * L.C, '']]) + '=0') + ' is ' + t(k) + ' times the general form — the same line, just not in lowest terms.)',
            hints: ['Solve each equation for ' + t('y') + '.', 'Multiplying every term of an equation by the same number gives the same line.'], text: 'same line as ' + sT(L), bad: [['g', 'k', 'y', 'c'], ['g'], ['g', 'y']] };
        } }] },

    /* ======================= RF7 · writing the equation of a line ======================= */
    { num: '19', outcome: 'RF7', stem: 'Write the equation of each line.', parts: [
      { id: '19a', outcome: 'RF7', level: 'BEG', make: function (r) {
        var m = rnz(r, -7, 7), b = rnz(r, -10, 10), L = lineMB(m, b);
        return lineP('The line with slope ' + t(m) + ' and ' + t('y') + '-intercept ' + t(b) + '. Write it in the form ' + t('y=mx+b') + '.', L, { form: 'slope-intercept', wrong: [{ is: lineMB(b, m), code: 'u7t-si-swap', hint: 'In ' + t('y=mx+b') + ' the slope multiplies ' + t('x') + ' and the ' + t('y') + '-intercept is the constant.' }] },
          'Substitute ' + t('m=' + m) + ' and ' + t('b=' + b) + ' into ' + t('y=mx+b') + ': ' + t(sT(L)), ['Use ' + t('y=mx+b') + ': ' + t('m') + ' is the slope and ' + t('b') + ' is the ' + t('y') + '-intercept.'], 'slope ' + m + ' b ' + b);
      } },
      { id: '19b', outcome: 'RF7', level: 'BEG', make: function (r) {
        var mq = r.pick([[1, 2], [2, 3], [3, 4], [2, 5], [1, 3], [3, 5], [1, 4], [5, 2]]), m = Q(r.pick([1, -1]) * mq[0], mq[1]), b = rnz(r, -9, 9), pt = r.chance(0.5), L = lineMB(m, b);
        return lineP('The line with slope ' + t(qT(m)) + (pt ? ' that passes through ' + t(ptT([0, b])) : ' and ' + t('y') + '-intercept ' + t(b)) + '. Write it in the form ' + t('y=mx+b') + '.', L, { form: 'slope-intercept', wrong: [{ is: lineMB(Q(b), m), code: 'u7t-si-swap', hint: 'In ' + t('y=mx+b') + ' the slope multiplies ' + t('x') + ' and the ' + t('y') + '-intercept is the constant.' }] },
          (pt ? 'The point ' + t(ptT([0, b])) + ' is on the ' + t('y') + '-axis, so it is the ' + t('y') + '-intercept: ' + t('b=' + b) + '. ' : '') + 'Substitute ' + t('m=' + qT(m)) + ' and ' + t('b=' + b) + ' into ' + t('y=mx+b') + ': ' + t(sT(L)),
          [pt ? 'A point with ' + t('x=0') + ' is the ' + t('y') + '-intercept: only its ' + t('y') + '-value goes into the equation.' : 'Use ' + t('y=mx+b') + '.', 'Keep the slope as a fraction.'], 'slope frac b ' + b);
      } },
      { id: '19c', outcome: 'RF7', level: 'BEG', make: function (r) {
        var v = find(function () { return { h: rnz(r, -8, 8), k: rnz(r, -8, 8), horiz: r.chance(0.5) }; }, function (v) { return Math.abs(v.h) !== Math.abs(v.k); }, { h: 3, k: -7, horiz: true });
        var h = v.h, k = v.k, L = v.horiz ? L3(0, 1, -k) : L3(1, 0, -h);
        return lineP('The <b>' + (v.horiz ? 'horizontal' : 'vertical') + '</b> line through ' + t(ptT([h, k])) + '.', L, { placeholder: v.horiz ? 'e.g. y = 4' : 'e.g. x = 4', wrong: [{ is: v.horiz ? L3(0, 1, -h) : L3(1, 0, -k), code: 'u7t-hv-coord', hint: v.horiz ? 'Every point on a horizontal line has the same <b>' + t('y') + '</b>-value: here ' + t(k) + '.' : 'Every point on a vertical line has the same <b>' + t('x') + '</b>-value: here ' + t(h) + '.' },
          { is: v.horiz ? L3(1, 0, -h) : L3(0, 1, -k), code: 'u7t-hv-swap', hint: v.horiz ? t('x=' + h) + ' is a <b>vertical</b> line. A horizontal line has the form ' + t('y=k') + '.' : t('y=' + k) + ' is a <b>horizontal</b> line. A vertical line has the form ' + t('x=k') + '.' }] },
          v.horiz ? 'A horizontal line keeps the same ' + t('y') + '-value at every point: ' + t('y=' + k) + '.' : 'A vertical line keeps the same ' + t('x') + '-value at every point: ' + t('x=' + h) + '.',
          ['Which coordinate stays the same along a ' + (v.horiz ? 'horizontal' : 'vertical') + ' line?'], (v.horiz ? 'horizontal' : 'vertical') + ' through point');
      } }] },
    { num: '20', outcome: 'RF7', stem: 'Write the equation of each line in the form ' + t('y=mx+b') + '.', parts: [
      { id: '20a', outcome: 'RF7', level: 'PRG', make: function (r) {
        var v = find(function () { var mq = r.pick([[1, 1], [2, 1], [3, 1], [1, 2], [1, 3], [2, 3]]); return { m: Q(r.pick([1, -1]) * mq[0], mq[1]), b: r.int(-4, 4) }; }, function (v) { var p = Math.abs(v.m[0]); return Math.abs(v.b) + p <= 5 && v.m[1] <= 3; }, { m: [-2, 1], b: 3 });
        var m = v.m, b = v.b, q = m[1], L = lineMB(m, b);
        return lineP('The line on the graph passes through points with integer coordinates.' + lineFig([L], [-5, 5], [-6, 6], { points: [{ x: -q, y: b - m[0] }, { x: 0, y: b }, { x: q, y: b + m[0] }] }), L, { form: 'slope-intercept', wrong: [{ is: lineMB(qn(m), b), code: 'line-slope-sign', hint: 'Check the sign of the slope: the line ' + (m[0] > 0 ? 'rises' : 'falls') + ' from left to right.' }].concat(b ? [{ is: lineMB(m, -b), code: 'line-b-sign', hint: 'Right slope — check the sign of the ' + t('y') + '-intercept: the line crosses the ' + t('y') + '-axis at ' + t(ptT([0, b])) + '.' }] : []) },
          t('y') + '-intercept: the line crosses the ' + t('y') + '-axis at ' + t(ptT([0, b])) + ', so ' + t('b=' + b) + '.<br>Slope: from ' + t(ptT([0, b])) + ' to ' + t(ptT([q, b + m[0]])) + ', rise ' + t(m[0]) + ', run ' + t(q) + ', so ' + t('m=' + qT(m)) + '.<br>' + t(sT(L)),
          ['Read ' + t('b') + ' where the line crosses the ' + t('y') + '-axis.', 'Count rise over run between two marked points (a falling line has a negative slope).'], 'equation from graph');
      } },
      { id: '20b', outcome: 'RF7', level: 'PRG', make: function (r) {
        var v = find(function () { return { m: rnz(r, -5, 5), b: rnz(r, -7, 7), x0: r.pick([-2, -1]) }; }, function (v) { return v.m * v.x0 + v.b !== v.b; }, { m: 3, b: -4, x0: -1 });
        var xs = [0, 1, 2, 3].map(function (i) { return v.x0 + i; }), ys = xs.map(function (x) { return v.m * x + v.b; }), L = lineMB(v.m, v.b);
        return lineP('The table shows points on a line.' + tab(xs, ys), L, { form: 'slope-intercept', wrong: [{ is: lineMB(v.m, ys[0]), code: 'u7t-b-first', hint: t('b') + ' is the value of ' + t('y') + ' when ' + t('x=0') + ' — not the first value in the table.' }] },
          'Each time ' + t('x') + ' goes up ' + t('1') + ', ' + t('y') + ' ' + (v.m < 0 ? 'goes down ' + t(-v.m) : 'goes up ' + t(v.m)) + ', so ' + t('m=' + v.m) + '.<br>When ' + t('x=0') + ', ' + t('y=' + v.b) + ', so ' + t('b=' + v.b) + '.<br>' + t(sT(L)),
          ['The slope is the change in ' + t('y') + ' each time ' + t('x') + ' goes up by ' + t('1') + '.', t('b') + ' is the ' + t('y') + '-value paired with ' + t('x=0') + '.'], 'equation from table');
      } }] },
    { num: '21', outcome: 'RF7', stem: 'Determine the equation of each line in the form ' + t('y=mx+b') + '.', parts: [
      { id: '21a', outcome: 'RF7', level: 'PRG', make: function (r) {
        var v = find(function () { var m = rnz(r, -5, 5), P = [rnz(r, -5, 5), rnz(r, -9, 9)]; return { m: m, P: P, b: P[1] - m * P[0] }; }, function (v) { return v.b !== v.P[1] && v.b !== 0 && Math.abs(v.b) <= 15 && v.P[1] + v.m * v.P[0] !== v.b; }, { m: -3, P: [2, 5], b: 11 });
        var m = v.m, P = v.P, b = v.b, L = lineMB(m, b);
        return lineP('The line with slope ' + t(m) + ' that passes through ' + t(ptT(P)) + '.', L, { form: 'slope-intercept', point: P, wrong: [{ is: lineMB(m, P[1]), code: 'u7t-b-ycoord', hint: 'The point ' + t(ptT(P)) + ' is not on the ' + t('y') + '-axis, so ' + t(P[1]) + ' is not ' + t('b') + '. Substitute the point into ' + t('y=' + m + 'x+b') + ' and solve for ' + t('b') + '.' },
          { is: lineMB(m, P[1] + m * P[0]), code: 'u7t-b-sign', hint: 'Check the step that solves for ' + t('b') + ': ' + t(P[1] + '=' + (m * P[0]) + '+b') + ', so ' + t('b=' + P[1] + '-' + sgnP(m * P[0])) + '.' }] },
          t('y=' + m + 'x+b') + '<br>Substitute ' + t(ptT(P)) + ': ' + t(P[1] + '=' + m + '(' + P[0] + ')+b') + '<br>' + t(P[1] + '=' + (m * P[0]) + '+b') + ', so ' + t('b=' + b) + '<br>' + t(sT(L)),
          ['Write ' + t('y=' + m + 'x+b') + ', then substitute ' + t('x=' + P[0]) + ' and ' + t('y=' + P[1]) + '.', 'Solve for ' + t('b') + ', then write the final equation.'], 'slope and point');
      } },
      { id: '21b', outcome: 'RF7', level: 'PRG', make: function (r) {
        var v = find(function () { var m = rnz(r, -4, 4), P = [r.int(-4, 3), r.int(-8, 8)], dx = r.int(1, 4); return { m: m, P: P, Q2: [P[0] + dx, P[1] + m * dx] }; }, function (v) { var b = v.P[1] - v.m * v.P[0]; return Math.abs(v.Q2[1]) <= 12 && v.P[0] !== 0 && v.Q2[0] !== 0 && b !== v.P[1] && b !== v.Q2[1] && Math.abs(b) <= 15 && Math.abs(v.Q2[0] - v.P[0]) > 1; }, { m: 3, P: [2, 1], Q2: [4, 7] });
        var m = v.m, P = v.P, Q2 = v.Q2, b = P[1] - m * P[0], L = lineMB(m, b), dy = Q2[1] - P[1], dx = Q2[0] - P[0];
        return lineP('The line through ' + t(ptT(P)) + ' and ' + t(ptT(Q2)) + '.', L, { form: 'slope-intercept', wrong: [{ is: lineMB(m, P[1]), code: 'u7t-b-ycoord', hint: 'Neither point is on the ' + t('y') + '-axis, so a ' + t('y') + '-coordinate is not ' + t('b') + '. Substitute a point and solve for ' + t('b') + '.' }, { is: lineMB(m, Q2[1]), code: 'u7t-b-ycoord', hint: 'Neither point is on the ' + t('y') + '-axis, so a ' + t('y') + '-coordinate is not ' + t('b') + '. Substitute a point and solve for ' + t('b') + '.' }] },
          '<b>Step 1:</b> ' + t('m=\\dfrac{' + Q2[1] + '-' + sgnP(P[1]) + '}{' + Q2[0] + '-' + sgnP(P[0]) + '}=\\dfrac{' + dy + '}{' + dx + '}=' + m) + '<br><b>Step 2:</b> ' + t(P[1] + '=' + m + '(' + P[0] + ')+b') + ', so ' + t(P[1] + '=' + (m * P[0]) + '+b') + ' and ' + t('b=' + b) + '<br>' + t(sT(L)) + ' (check ' + t(ptT(Q2)) + ': ' + t(m + '(' + Q2[0] + ')' + (b < 0 ? '-' : '+') + Math.abs(b) + '=' + Q2[1]) + ' ✓)',
          ['Find the slope first: ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + '.', 'Substitute ' + t('m') + ' and one point into ' + t('y=mx+b') + ' and solve for ' + t('b') + '.'], 'two points integer slope');
      } }] },
    { num: '22', outcome: 'RF7',
      shared: function (r) {
        return find(function () { var q = r.pick([2, 3, 4]), p = r.pick([1, 2, 3]) * r.pick([1, -1]), i = r.int(-3, -1), j = r.int(2, 3), b = r.int(-5, 6); var x1 = q * i, x2 = x1 + q * j, m = Q(p, q); return { m: m, b: b, P: [x1, qv(m) * x1 + b], Q2: [x2, qv(m) * x2 + b] }; },
          function (v) { return gcd(v.m[0], v.m[1]) === 1 && Math.abs(v.m[0]) !== v.m[1] && v.Q2[0] !== 0 && [v.P, v.Q2].every(function (p) { return Math.abs(p[0]) <= 9 && Math.abs(p[1]) <= 9; }) && v.b !== v.P[1] && v.b !== v.Q2[1]; }, { m: [1, 2], b: 4, P: [-6, 1], Q2: [2, 5] });
      },
      stem: function (s) { return 'A line passes through ' + t(ptT(s.P)) + ' and ' + t(ptT(s.Q2)) + '.'; }, parts: [
        { id: '22', outcome: 'RF7', level: 'MAS', make: function (r, s) {
          var m = s.m, b = s.b, P = s.P, Q2 = s.Q2, L = lineMB(m, b), dy = Q2[1] - P[1], dx = Q2[0] - P[0];
          return lineP('Determine its equation in the form ' + t('y=mx+b') + '. Keep the slope as a fraction.', L, { form: 'slope-intercept', wrong: [{ is: lineMB(m, P[1]), code: 'u7t-b-ycoord', hint: 'A ' + t('y') + '-coordinate is ' + t('b') + ' only for a point on the ' + t('y') + '-axis. Substitute a point and solve for ' + t('b') + '.' }, { is: lineMB(m, P[1] + qv(m) * P[0]), code: 'u7t-b-sign', hint: 'Check the step that solves for ' + t('b') + ': ' + t(qT(m) + '\\times' + sgnP(P[0]) + '=' + num(qv(m) * P[0])) + ', then subtract it from ' + t(P[1]) + '.' }] },
            '<b>Step 1:</b> ' + t('m=\\dfrac{' + Q2[1] + '-' + sgnP(P[1]) + '}{' + Q2[0] + '-' + sgnP(P[0]) + '}=\\dfrac{' + dy + '}{' + dx + '}=' + qT(m)) + '<br><b>Step 2:</b> substitute ' + t(ptT(P)) + ': ' + t(P[1] + '=' + qT(m) + '(' + P[0] + ')+b') + ', so ' + t(P[1] + '=' + num(qv(m) * P[0]) + '+b') + ' and ' + t('b=' + b) + '<br>' + t(sT(L)),
            ['Find the slope first and reduce the fraction.', 'Choose the point whose ' + t('x') + '-value cancels the denominator nicely, substitute it into ' + t('y=mx+b') + ', and solve for ' + t('b') + '.'], 'two points fractional slope');
        } }] },
    { num: '23', outcome: 'RF7',
      shared: function (r) {
        var c = r.pick(TWO7);
        return find(function () {
          var R = r.pick(c.rates), S = r.pick(c.starts), x1 = r.int(c.t1[0], c.t1[1]), x2 = x1 + r.int(c.gap[0], c.gap[1]), T = c.goal[0] === 0 ? -S / R : r.int(c.goal[0], c.goal[1]);
          return { c: c, R: R, S: S, x1: x1, x2: x2, y1: S + R * x1, y2: S + R * x2, T: T, Y: S + R * T };
        }, function (s) { return Number.isInteger(s.T) && s.T > s.x2 && s.y2 > 0 && (!s.c.max || s.Y <= s.c.max); }, { c: TWO7[0], R: 6, S: 3, x1: 2, x2: 5, y1: 15, y2: 33, T: 8, Y: 51 });
      },
      stem: function (s) { return s.c.intro(s); }, parts: [
        { id: '23a', outcome: 'RF7', level: 'MAS', make: function (r, s) {
          var c = s.c, L = lineMB(s.R, s.S), vars = [c.x, c.y];
          return lineP('Determine an equation for ' + c.eq + '.', L, { vars: vars, placeholder: 'e.g. ' + c.y + ' = 2' + c.x + ' + 3', wrong: [{ is: lineMB(s.R, s.y1), code: 'u7t-b-ycoord', hint: t(F(s.y1)) + ' is the value at ' + t(c.x + '=' + s.x1) + ', not at ' + t(c.x + '=0') + '. Substitute a reading into your equation to find ' + t('b') + '.' }, { is: lineMB(s.R, 0), code: 'u7t-ctx-nostart', hint: 'Find the starting value ' + t('b') + ': substitute one reading into ' + t(c.y + '=' + s.R + c.x + '+b') + '.' }] },
            'The two readings are the points ' + t(ptT([s.x1, s.y1])) + ' and ' + t(ptT([s.x2, s.y2])) + '.<br>Slope: ' + t('m=\\dfrac{' + F(s.y2) + '-' + F(s.y1) + '}{' + s.x2 + '-' + s.x1 + '}=\\dfrac{' + F(s.y2 - s.y1) + '}{' + (s.x2 - s.x1) + '}=' + s.R) + '<br>Substitute ' + t(ptT([s.x1, s.y1])) + ': ' + t(F(s.y1) + '=' + s.R + '(' + s.x1 + ')+b') + ', so ' + t('b=' + F(s.S)) + '<br>' + t(eqMB(s.R, s.S, c.x, c.y)),
            ['Treat the two readings as two points ' + t('(' + c.x + ',\\ ' + c.y + ')') + ' and find the slope.', 'Substitute one reading to find ' + t('b') + ', the value when ' + t(c.x + '=0') + '.'], 'two-reading context ' + c.y);
        } },
        { id: '23b', outcome: 'RF7', level: 'MAS', make: function (r, s) {
          var c = s.c, Y = s.Y, R = s.R, S = s.S;
          return numB(c.ask(s), s.T, [Y ? { v: Y / R, code: 'u7t-ctx-nostart', hint: 'Subtract the starting value ' + t(F(S)) + ' first.' } : null, { v: (Y + S) / R, code: 'u7t-ctx-sign', hint: 'To undo “+' + F(S) + '”, subtract ' + t(F(S)) + ' from both sides.' }, { v: R * Y + S, code: 'u7t-ctx-eval', hint: 'Here ' + t(c.y + '=' + F(Y)) + ': solve for ' + t(c.x) + '.' }, { v: -s.T, code: 'u7t-ctx-sign', hint: 'Check the sign when you divide by ' + t(R) + '.' }],
            t(F(Y) + '=' + R + c.x + '+' + F(S)) + '<br>' + t(F(Y - S) + '=' + R + c.x) + '<br>' + t(c.x + '=' + F(Y - S) + '\\div ' + sgnP(R) + '=' + s.T) + ' — after <b>' + s.T + ' ' + c.ansU + '</b>.',
            ['Set ' + t(c.y + '=' + F(Y)) + ' in your equation from (a).', 'Subtract the starting value, then divide by the rate.'], 'solve two-reading context ' + c.y, { after: c.ansU });
        } }] }
  ];

  /* Q17: one student's two lines of work for a mistake type */
  function q17Work(s, ty) {
    var By = pol([[s.B, 'y']]), A = s.A, C = s.C, m = s.m, b = s.b;
    if (ty === 'sign') return [By + '=' + pol([[A, 'x'], [-C, '']]), sT(lineMB(qn(m), b))];
    if (ty === 'one') return [By + '=' + pol([[-A, 'x'], [-C, '']]), s.oneX ? 'y=' + pol([[-A, 'x'], [b, '']]) : 'y=' + pol([[m, 'x'], [-C, '']])];
    return [By + '=' + pol([[-A, 'x'], [-C, '']]), 'y=' + pol([[b, 'x'], [m, '']])];
  }

  HW.defineTest({
    id: 'u7test', unit: 7, title: 'Unit 7 Test', outcome: 'RF6', calc: false,
    blurb: 'The Unit 7 outcomes-based test: RF4 (tables of values, linear or not, points on a line, equations in context), RF3 (slope as a rate of change), RF5 (intercepts), RF6 (y = mx + b, general form, graphing any form) and RF7 (writing the equation of a line), in Beginning, Progressing and Mastery boxes. No calculator.',
    questions: QUESTIONS
  });
})(window);
