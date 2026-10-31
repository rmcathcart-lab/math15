/* Math 15 · Unit 8 Test (RF9) — Systems of Linear Equations: solving by graphing, classifying, substitution,
 * elimination and word problems. Built the way the Math 10C Unit 8 Test was built (Beginning / Progressing / Mastery
 * boxes, mostly typed answers and graphs drawn on the graph pad, keys built from the generated numbers, `bad` answers
 * with u8t- codes, worked solutions and hints) but pitched at Math 15 and NOT based on the Math 15 multiple-choice paper
 * tests. One 75-minute class, NO calculator (whole-number answers, friendly arithmetic); one outcome (RF9, as Ryan tags
 * every Unit 8 question); 17 questions / 33 parts: Beginning 7 questions / 11 parts, Progressing 6 / 13, Mastery 4 / 9.
 *
 * How each box is pitched (numbers and situations come from Ryan's Math 15 Lessons 1–8, assignments, extra practice and
 * exit slips; their numbers are possible values):
 *   Beginning  — each lesson's core skill as first taught: read the solution off a graph of two y = mx + b lines and
 *                check it in both equations (L1 #1, Ryan's L1 slip); is a given point the solution? — substitute into
 *                both equations (L1 Ex 4, #6–8); classify a system from its graph (L2 Ex 1–3, Ryan's L2 slip); which
 *                variable to isolate to avoid fractions (L4 #1, Ryan's L4 slip — the only Beginning multiple choice);
 *                substitution when a variable is already isolated (L3 #1–2); elimination when a pair of coefficients
 *                already matches or is opposite (L5 #2–7); translate a number / age / class problem into a system
 *                (L7 Part A, Ex 1–2).
 *   Progressing — the typical assignment question: rewrite Ax + By = C as y = mx + b, graph both lines and solve
 *                (L1 #3, #10); classify without graphing after rearranging (L2 #5, L8 #7); isolate a variable first,
 *                then substitute (L4 #2–3, Ryan's L4 slip); elimination by multiplying one equation (L6 #1–3, Ryan's L6
 *                slip); a count-and-value problem — write the system and solve (L7 #6–8, Ryan's L7 and L8 slips); prices
 *                from two purchases (L6 #6–7, EP05 #11–12).
 *   Mastery    — Math 15's hardest assignment / extra-practice items, clearly easier than the 10C Mastery boxes:
 *                elimination multiplying both equations (L6 #4, L8 #14–15); a value of k (or c) that gives no solution or
 *                infinitely many (L2 #10, #11, #15, EP02 #6–9, Ryan's L2 slip); find and explain the error in a worked
 *                elimination, then solve correctly (EP05 #8); a two-rate (fee + rate) problem with interpretation — write
 *                both cost equations, find where they cost the same, decide which is cheaper (L2 #14, EP01 #14,
 *                EP07 #16, L8 #20).
 * Coverage: L1 Q1, Q2, Q8 · L2 Q3, Q9, Q15 · L3 Q4 · L4 Q7, Q10 · L5 Q5, Q16 · L6 Q11, Q13, Q14 · L7 Q6, Q12, Q13, Q17.
 * Method questions: the checker can't see a method, so where it matters the key step is its own box — the equation after
 * substituting (Q4, Q10), the equation after adding or subtracting (Q5, Q11, Q14) and the multiplier(s) (Q11, Q14). Any
 * equivalent one-variable equation is accepted; typing the finished value (e.g. x = 3) instead of the step earns 2/3.
 * Conversions to online: reading a graph → ordered pair (point keypad); "check in both equations" → one box per
 * equation holding the substitution (e.g. 2(−2)+3 = −1) or its value; graphing → the graph pad (two lines with arrows);
 * "how many solutions" → typed one / none / infinitely many; "define variables, write a system, solve" → the variables
 * are named in the question, then a system part (two equation boxes, any equivalent equations, either order) and an
 * answer part; "find the error" → choices that each name a line and a reason (Mastery, as in the 10C test). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, Ln = HW.lines, DR = HW.draw, ex = HW.ex, F = HW.fmt;

  HW.addCodes({
    'u8t-gr-line': 'Graph: a line wrong', 'u8t-gr-shift': 'Graph: right slope, wrong place', 'u8t-gr-sign': 'Graph: slope sign wrong', 'u8t-gr-flip': 'Graph: run over rise',
    'u8t-gr-slope': 'Graph: right intercept, wrong slope', 'u8t-point-off': 'Graph: a plotted point is off the line', 'u8t-points-only': 'Graph: points without lines',
    'u8t-line-missing': 'Graph: a line of the system missing', 'u8t-line-extra': 'Graph: an extra line', 'u8t-graph': 'Graph wrong',
    'u8t-pt-swap': 'Solution with x and y swapped', 'u8t-one-eq': 'Point satisfies only one equation', 'u8t-pt-sign': 'Solution: sign of a coordinate',
    'u8t-sub-arith': 'Check: arithmetic slip', 'u8t-sub-swap': 'Check: x and y substituted in each other’s places', 'u8t-sub-point': 'Check: substituted a different point',
    'u8t-sub-show': 'Check: substitution not shown', 'u8t-sub-read': 'Check: work can’t be read', 'u8t-yn': 'Values right, yes/no wrong', 'u8t-yn-read': 'Yes/no not readable',
    'u8t-cls-kind': 'Classified the system wrongly', 'u8t-cls-eqs': 'Both equations rewritten wrongly (classification right)', 'u8t-kind-read': 'Number of solutions not readable',
    'u8t-several': 'Several boxes wrong', 'u8t-two-slips': 'Two recognized slips',
    'u8t-nodiv': 'Didn’t divide every term by the y-coefficient', 'u8t-neg': 'Sign slip dividing by a negative',
    'u8t-iso-pick': 'Picked a variable whose coefficient isn’t 1 or −1',
    'u8t-step-show': 'Gave the finished value instead of the step', 'u8t-same-eq': 'Substituted back into the same equation', 'u8t-wrong-var': 'Equation in the other variable', 'u8t-step': 'Step equation wrong', 'u8t-eq-read': 'Equation not readable',
    'u8t-distribute': 'Bracket multiplied into the first term only', 'u8t-move-const': 'Sign slip moving the constant', 'u8t-iso-sign': 'Sign slip isolating the variable',
    'u8t-elim-rhs': 'Right sides combined the wrong way', 'u8t-elim-sign': 'Subtracting: a sign not changed', 'u8t-res-not-elim': 'A variable left after adding/subtracting',
    'u8t-mult': 'Multiplier(s) don’t make the coefficients match', 'u8t-rhs-unscaled': 'Right side not multiplied',
    'u8t-k-mult': 'k: divided instead of multiplied (or the reverse)', 'u8t-k-sign': 'Sign of k', 'u8t-k-copy': 'k: copied the other coefficient without scaling', 'u8t-c-copy': 'c: copied the y-intercept',
    'u8t-sys-one': 'One equation of the system right, the other wrong', 'u8t-sys-derived': 'Equation true for the answer but not a translation',
    'u8t-rel-rev': 'Comparison written the wrong way round', 'u8t-rel-op': '“More than” and “times” mixed up', 'u8t-facts-swap': 'Totals attached to the wrong facts',
    'u8t-rhs-count': 'Used the count as the money total', 'u8t-price-swap': 'Prices matched to the wrong items', 'u8t-no-prices': 'Left out the prices', 'u8t-count-swap': 'Counts matched to the wrong items',
    'u8t-eq-boxes': 'Equations in each other’s boxes', 'u8t-fee-rate': 'Fixed fee and rate swapped', 'u8t-no-fee': 'Fixed fee left out', 'u8t-fee-rate-both': 'Fee added to the rate',
    'u8t-cost': 'Cost worked out wrongly', 'swap-answer': 'Right numbers in the wrong boxes', 'u8t-better': 'Costs right, wrong choice', 'u8t-pick-read': 'Choice not readable'
  });
  HW.addPartial({
    'u8t-gr-line': 'b', 'u8t-gr-shift': 's', 'u8t-gr-sign': 's', 'u8t-gr-flip': 's', 'u8t-gr-slope': 'b', 'u8t-point-off': 'b', 'u8t-points-only': 'b', 'u8t-line-missing': 's', 'u8t-line-extra': 's', 'u8t-graph': 'n',
    'u8t-pt-swap': 'b', 'u8t-one-eq': 'b', 'u8t-pt-sign': 's', 'u8t-sub-arith': 's', 'u8t-sub-swap': 'b', 'u8t-sub-point': 'n', 'u8t-sub-show': 'n', 'u8t-yn': 'b',
    'u8t-cls-kind': 'b', 'u8t-cls-eqs': 'b', 'u8t-several': 'n', 'u8t-two-slips': 'b', 'u8t-nodiv': 's', 'u8t-neg': 's', 'u8t-iso-pick': 'n',
    'u8t-same-eq': 'n', 'u8t-wrong-var': 'n', 'u8t-step': 'n',
    'u8t-distribute': 'b', 'u8t-move-const': 's', 'u8t-iso-sign': 's', 'u8t-elim-rhs': 's', 'u8t-elim-sign': 'b', 'u8t-res-not-elim': 'n',
    'u8t-mult': 'b', 'u8t-rhs-unscaled': 's',
    'u8t-k-mult': 'b', 'u8t-k-sign': 's', 'u8t-k-copy': 'b', 'u8t-c-copy': 'b',
    'u8t-sys-one': 'b', 'u8t-sys-derived': 'n', 'u8t-rel-rev': 'b', 'u8t-rel-op': 'b', 'u8t-facts-swap': 'n',
    'u8t-rhs-count': 'b', 'u8t-price-swap': 'b', 'u8t-no-prices': 'n', 'u8t-count-swap': 'b',
    'u8t-fee-rate': 'b', 'u8t-no-fee': 's', 'u8t-fee-rate-both': 'b', 'u8t-cost': 's', 'u8t-better': 'b'
  });

  /* ---------- numbers and LaTeX ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function r6(x) { return Math.round(x * 1e6) / 1e6 + 0; }
  function near(a, b) { return Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(b)); }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function fr(p, q) { if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g + 0, q / g]; }
  function fv(f) { return Array.isArray(f) ? f[0] / f[1] : f; }
  function fT(f) { return Ln.frT(f[0], f[1]); }
  function iT(v) { v = Math.round(v) + 0; return Math.abs(v) >= 10000 ? F(v) : String(v); }
  function toF(x) { for (var q = 1; q <= 400; q++) { var p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-6) return fr(p, q); } return [x, 1]; }
  function nT(x) { var v = r6(fv(x)); if (isInt(v)) return iT(v); var f = Array.isArray(x) ? fr(x[0], x[1]) : toF(v); return f[1] <= 200 && isInt(f[0]) ? fT(f) : String(v); }
  function dT(x) { x = r6(x); return isInt(x) ? iT(x) : String(x); }
  function pS(x) { var v = r6(fv(x)); if (isInt(v)) return String(Math.round(v)); var f = Array.isArray(x) ? fr(x[0], x[1]) : toF(fv(x)); return f[0] + '/' + f[1]; }
  function par(x) { var s = nT(x); return fv(x) < 0 ? '(' + s + ')' : s; }
  function pt(p) { return '(' + nT(p[0]) + ',\\ ' + nT(p[1]) + ')'; }
  function ptt(p) { return t(pt(p)); }
  function samePt(a, b) { return near(fv(a[0]), fv(b[0])) && near(fv(a[1]), fv(b[1])); }
  function nz(r, a, b) { var v; do { v = r.int(a, b); } while (v === 0); return v; }
  function find(gen, test, fb) { for (var i = 0; i < 1500; i++) { var v = gen(); if (v && test(v)) return v; } return fb; }
  function money(v) { v = r6(v); return '\\$' + (isInt(v) ? iT(v) : v.toFixed(2)); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* terms [[coef, 'x'], …] -> LaTeX */
  function T(terms) {
    var s = '';
    terms.forEach(function (tm) {
      var c0 = tm[0], v = tm[1] || '', cv = r6(fv(c0)); if (Math.abs(cv) < 1e-12) return;
      var neg = cv < 0, a = Math.abs(cv), body;
      if (isInt(a)) body = (a === 1 && v) ? '' : iT(a);
      else { var f = Array.isArray(c0) ? fr(Math.abs(c0[0]), c0[1]) : Ln.toFr(a); body = '\\frac{' + Math.abs(f[0]) + '}{' + f[1] + '}'; }
      s += (neg ? '-' : (s ? '+' : '')) + body + v;
    });
    return s || '0';
  }
  function gT(a, b, c, vs) { vs = vs || ['x', 'y']; return T([[a, vs[0]], [b, vs[1]]]) + '=' + nT(c); }
  function mbT(m, b, v, w) { return (w || 'y') + '=' + T([[m, v || 'x'], [b, '']]); }            // y = mx + b
  function tm(c, v, first) { var s = T([[c, v]]); return (!first && c > 0 ? '+' : '') + s; }      // one term with its sign
  function bracket(c, inner, first) { return (c < 0 ? '-' : first ? '' : '+') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + '(' + inner + ')'; }
  /* "3(4)+2(-2)": the left side a·x + b·y with the point substituted */
  function subT(a, b, P) {
    var s = '';
    [[a, P[0]], [b, P[1]]].forEach(function (cv) {
      var c = cv[0], v = cv[1]; if (!c) return;
      var vt = fv(v) < 0 || Math.abs(c) !== 1 ? '(' + nT(v) + ')' : nT(v), co = Math.abs(c) === 1 ? '' : dT(Math.abs(c));
      s += (c < 0 ? '-' : s ? '+' : '') + co + vt;
    });
    return s;
  }
  /* "2(-2)+3": the right side m·x + b with x substituted */
  function rhsSubT(m, b, x) { return subT(m, 0, [x, 0]) + (b ? (b < 0 ? '-' : '+') + Math.abs(b) : ''); }
  function sysTexN(e1, e2) { return '<div style="text-align:center;margin:6px 0">' + t('\\begin{aligned}&\\text{Equation 1:}\\quad {' + e1 + '}\\\\&\\text{Equation 2:}\\quad {' + e2 + '}\\end{aligned}') + '</div>'; }

  /* ---------- lines: A x + B y + C = 0 (integers) ---------- */
  function line(A, B, C) { var g = gcd(gcd(A, B), C) || 1; A /= g; B /= g; C /= g; if (A < 0 || (A === 0 && B < 0)) { A = -A; B = -B; C = -C; } return { A: A + 0, B: B + 0, C: C + 0 }; }
  function std(a, b, c) { return line(a, b, -c); }                                    // a x + b y = c
  function mbL(m, b) { var M = Array.isArray(m) ? fr(m[0], m[1]) : [m, 1], Bf = Array.isArray(b) ? fr(b[0], b[1]) : Ln.toFr(b); return line(M[0] * Bf[1], -M[1] * Bf[1], M[1] * Bf[0]); }
  function arr(Lo) { return [Lo.A, Lo.B, Lo.C]; }
  function slopeOf(Lo) { return fr(-Lo.A, Lo.B); }
  function yInt(Lo) { return fr(-Lo.C, Lo.B); }
  function onL(Lo, p) { return Math.abs(Lo.A * fv(p[0]) + Lo.B * fv(p[1]) + Lo.C) < 1e-9; }
  function sameL(a, b) { return a.A === b.A && a.B === b.B && a.C === b.C; }
  function parL(a, b) { return a.A * b.B === a.B * b.A; }
  function si(Lo, vars) { return Ln.tex(Lo, 'slope-intercept', null, vars); }
  function mbTex(Lo) { return { m: fT(slopeOf(Lo)), b: fT(yInt(Lo)) }; }
  function scaledT(L, k) { return gT(k * L.A, k * L.B, -k * L.C); }

  /* ---------- graphs ---------- */
  var W6 = [[-6, 6], [-6, 6]], BLUE = '#2a5db0', RED = '#c4532a';
  function latS(Lo, win) {
    var out = [];
    for (var x = Math.ceil(win[0][0]); x <= win[0][1]; x++) { if (Lo.B === 0) continue; var y = -(Lo.A * x + Lo.C) / Lo.B; if (isInt(y) && y >= win[1][0] - 1e-9 && y <= win[1][1] + 1e-9) out.push([x, r6(y)]); }
    return out;
  }
  function lineV(Lo, win) { var L2 = latS(Lo, win); if (L2.length < 2) L2 = latS(Lo, [[-60, 60], [-1e5, 1e5]]); return { pts: [], pieces: [{ v: [L2[0], L2[L2.length - 1]], s: 'arrow', e: 'arrow' }], join: 'none' }; }
  function clipV(Lo, win) {   // the part of the line inside the window
    var xr = win[0], yr = win[1], P = [];
    [xr[0], xr[1]].forEach(function (x) { var y = -(Lo.A * x + Lo.C) / Lo.B; if (y >= yr[0] - 1e-9 && y <= yr[1] + 1e-9) P.push([x, r6(y)]); });
    if (Lo.A !== 0) [yr[0], yr[1]].forEach(function (y) { var x = -(Lo.B * y + Lo.C) / Lo.A; if (x >= xr[0] - 1e-9 && x <= xr[1] + 1e-9) P.push([r6(x), y]); });
    P.sort(function (a, b) { return a[0] - b[0]; });
    return [P[0], P[P.length - 1]];
  }
  function sysFig(L1, L2) {
    return '<div class="fig">' + HW.graph({ x: W6[0], y: W6[1], grid: 1, labels: 2, max: 320, segs: [{ pts: clipV(L1, W6), color: BLUE, start: 'arrow', end: 'arrow' }, { pts: clipV(L2, W6), color: RED, dash: true, start: 'arrow', end: 'arrow' }], aria: 'two lines on a grid' }) + '</div>';
  }
  function splitBends(value) {   // the pad continues a line drawn from the end of another one: read each straight run as its own line
    var v = DR.norm(value), out = [];
    v.pieces.forEach(function (pc) {
      if (pc.v.length < 3) { out.push(pc); return; }
      var runs = [[pc.v[0], pc.v[1]]];
      for (var i = 2; i < pc.v.length; i++) {
        var run = runs[runs.length - 1], a = run[run.length - 2], b = run[run.length - 1], c = pc.v[i];
        if (Math.abs((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])) < 1e-9) run.push(c); else runs.push([b, c]);
      }
      runs.forEach(function (rv, k) { out.push({ v: rv, s: k === 0 ? pc.s : (pc.s === 'arrow' && pc.e === 'arrow' ? 'arrow' : 'closed'), e: k === runs.length - 1 ? pc.e : (pc.s === 'arrow' && pc.e === 'arrow' ? 'arrow' : 'closed') }); });
    });
    return { pts: v.pts, pieces: out, join: v.join };
  }
  function propL(S, L) {
    var a = [S.A, S.B, S.C], b = [L.A, L.B, L.C], sa = Math.max.apply(null, a.map(Math.abs)), sb = Math.max.apply(null, b.map(Math.abs));
    for (var i = 0; i < 3; i++) for (var j = i + 1; j < 3; j++) if (Math.abs(a[i] * b[j] - a[j] * b[i]) > 1e-6 * sa * sb) return false;
    return true;
  }
  function geoL(g, k) { var L = g.lines[k]; return { A: L.A, B: L.B, C: -L.C }; }
  /* graph the two lines of a system: arrows on both ends; o.wrong: [{ L, code, hint }] classic wrong lines */
  function sysGraph(prompt, Ls, names, o, sol, hints, text) {
    o = o || {};
    var win = W6, uNames = names.map(function (n) { return t(n); });
    var key = { pts: [], pieces: Ls.map(function (L) { return lineV(L, win).pieces[0]; }), join: 'none' };
    var exact = K.graphExact(key);
    var W0 = (o.wrong || []).filter(function (w) { return !Ls.some(function (L) { return sameL(L, w.L); }) && latS(w.L, win).length >= 2; });
    function diagnose(S, Tl, name) {
      var sm = S.B === 0 ? null : -S.A / S.B, tm0 = -Tl.A / Tl.B, sb = S.B === 0 ? null : -S.C / S.B, tb = -Tl.C / Tl.B, nr = function (a, b) { return a != null && Math.abs(a - b) < 1e-9; };
      if (S.B === 0) return wrong('u8t-gr-line', 'One of your lines is vertical. Check your line for ' + name + ': substitute two of its points into the equation.');
      if (nr(sm, tm0)) return wrong('u8t-gr-shift', 'Your line for ' + name + ' has the right slope but is in the wrong place: it should cross the ' + t('y') + '-axis at ' + ptt([0, Ln.toFr(r6(tb))]) + '.');
      if (nr(sb, tb)) {
        if (nr(sm, -tm0)) return wrong('u8t-gr-sign', 'Your line for ' + name + ' starts in the right place, but it goes the wrong way: its slope is ' + t(nT(r6(tm0))) + ', so it ' + (tm0 < 0 ? 'falls' : 'rises') + ' from left to right.');
        if (tm0 !== 0 && nr(sm, 1 / tm0)) return wrong('u8t-gr-flip', 'Your line for ' + name + ' starts in the right place. Slope is <b>rise over run</b>: ' + t('m=' + nT(r6(tm0))) + ' — you stepped run over rise.');
        return wrong('u8t-gr-slope', 'Your line for ' + name + ' crosses the ' + t('y') + '-axis in the right place — now check its slope: ' + t('m=' + nT(r6(tm0))) + '.');
      }
      if (nr(sm, -tm0) && nr(sb, -tb)) return wrong('u8t-gr-sign', 'Your line for ' + name + ' has the signs of the slope and the intercept both switched. When you divide by a negative, every sign changes.');
      return wrong('u8t-gr-line', 'Check your line for ' + name + ': substitute two of the points you used into ' + name + ' — both must make it true.');
    }
    var check = function (resp) {
      var v = splitBends(resp);
      if (DR.empty(v)) return form('empty', 'Draw your answer on the grid first.');
      var r0 = exact(v);
      if (r0.v === 'wrong' && (r0.code === 'graph-length' || r0.code === 'graph-ends')) return wrong('graph-arrows', 'Right lines — but a line keeps going forever: put <b>arrows</b> on both ends of each line (use the <b>Ends</b> tool).');
      if (r0.v !== 'wrong' || r0.code !== 'graph') return r0;
      var g = DR.geom(v), have = Object.keys(g.lines).map(function (k) { return geoL(g, k); });
      if (!have.length) {
        var off = v.pts.filter(function (p) { return !Ls.some(function (L) { return onL(L, p); }); })[0];
        if (off) return wrong('u8t-point-off', ptt(off) + ' is not on either line. Substitute it into the equations to check.');
        return wrong('u8t-points-only', 'Your points are on the lines — now draw the lines through them with the <b>╱ Line</b> tool.');
      }
      var hit = have.map(function (S) { for (var i = 0; i < Ls.length; i++) if (propL(S, Ls[i])) return i; return -1; });
      var extra = have.filter(function (S, j) { return hit[j] < 0; }), miss = [];
      Ls.forEach(function (L, i) { if (hit.indexOf(i) < 0) miss.push(i); });
      for (var j = 0; j < extra.length; j++) for (var w = 0; w < W0.length; w++) if (propL(extra[j], W0[w].L)) return wrong(W0[w].code, W0[w].hint);
      if (!extra.length && miss.length) return wrong('u8t-line-missing', 'Correct so far — still to draw: ' + miss.map(function (i) { return uNames[i]; }).join(' and ') + '.');
      if (extra.length === 1 && miss.length === 1) return diagnose(extra[0], Ls[miss[0]], uNames[miss[0]]);
      if (extra.length && !miss.length) return wrong('u8t-line-extra', 'Both lines are there, but you have drawn ' + (extra.length === 1 ? 'an extra line' : 'extra lines') + ' as well. Undo or clear the extra ' + (extra.length === 1 ? 'one' : 'ones') + '.');
      return wrong('u8t-graph', null);
    };
    var p = K.P.graph(prompt, { x: win[0], y: win[1], grid: 1, labels: 2, mode: 'lines', defaultEnd: 'arrow', max: 360 }, check, key, sol, hints, text);
    p.bad = W0.map(function (w) { return { pts: [], pieces: [lineV(w.L, win).pieces[0], key.pieces[1]], join: 'none' }; }).concat([{ pts: [], pieces: [key.pieces[0]], join: 'none' }]).filter(function (b) { return !DR.same(b, key); });
    return p;
  }

  /* ---------- answer checkers ---------- */
  var REMAP = { 'pt-swap': 'u8t-pt-swap', 'sys-one-eq': 'u8t-one-eq', 'pt-sign': 'u8t-pt-sign' };
  function remap(chk) { return function (resp) { var r = chk(resp); return r && r.code && REMAP[r.code] ? { v: r.v, code: REMAP[r.code], hint: r.hint } : r; }; }
  /* the solution of a system: P = [x, y]; Ls the two lines; opt.wrong [{ is: [x, y], code, hint }] */
  function pointPart(prompt, P, Ls, opt, sol, hints, text) {
    opt = opt || {};
    var W = (opt.wrong || []).filter(function (w) { return isFinite(fv(w.is[0])) && isFinite(fv(w.is[1])) && !samePt(w.is, P); });
    var seen = {}; W = W.filter(function (w) { var k = pS(w.is[0]) + ',' + pS(w.is[1]); if (seen[k]) return false; seen[k] = 1; return true; });
    var p = K.P.point(prompt, P, { system: Ls.map(arr), vars: opt.vars, wrong: W }, sol, hints, text);
    p.check = remap(p.check);
    var bad = ['no solution'];
    if (!near(fv(P[0]), fv(P[1]))) bad.push('(' + pS(P[1]) + ', ' + pS(P[0]) + ')');
    W.forEach(function (w) { bad.push('(' + pS(w.is[0]) + ', ' + pS(w.is[1]) + ')'); });
    p.bad = bad;
    return p;
  }
  function numOf(x) {
    var s = String(x == null ? '' : x).replace(/\\(text|mathrm)\{([^{}]*)\}/g, '$2').replace(/\\[;: ]|~/g, ' ').trim();
    s = s.replace(/^[a-zA-Z]\s*=\s*/, '').replace(/\s*(kg|h|hrs?|hours?|years?|dollars?|visits?|sessions?|games?|tickets?|items?)\s*\.?\s*$/i, '');
    s = s.replace(/\\\$|\$|\\,|,(?=\d{3}\b)|\s/g, '').trim(); if (!s) return null;
    var p = HW.parse.number(s); if (p.ok) return p.value;
    var a = ex.parse(s); if (!a.ok) return null; var v = ex.value(a.ast); return isFinite(v) ? v : null;
  }
  /* one number; diag(v) -> { code, hint } */
  function valChk(target, diag) {
    return function (resp) {
      var raw = String(resp == null ? '' : resp).trim();
      if (!raw) return form('empty', 'Type your answer first.');
      var v = numOf(raw);
      if (v == null) return form('notnumber', 'Type a single number.');
      if (near(v, target)) return ok();
      var h = diag ? diag(v) : null;
      return h ? wrong(h.code, h.hint) : wrong('value', null);
    };
  }
  /* several boxes, all checked: one wrong box → its code; several → 'u8t-two-slips' if they are all recognized slips,
     else 'u8t-several'; a box left empty while others are filled → 'incomplete' (when the filled ones are right) */
  function isEmptyRes(x) { return x.v === 'form' && x.code === 'empty'; }
  function allChk(checkers, labels, opt) {
    opt = opt || {};
    return function (resp) {
      resp = resp || [];
      if (opt.pre) { var h0 = opt.pre(resp); if (h0) return h0; }
      var res = checkers.map(function (c, i) { return c(resp[i] == null ? '' : resp[i]); });
      var lab = function (i) { return (labels[i] ? '<b>' + labels[i] + ':</b> ' : '') + (res[i].hint || 'Check this one again.'); };
      var W = [], E = [], Fm = -1;
      res.forEach(function (x, i) { if (x.v === 'wrong') W.push(i); else if (isEmptyRes(x)) E.push(i); else if (x.v === 'form' && Fm < 0) Fm = i; });
      if (E.length === res.length) return form('empty', 'Fill in the boxes first.');
      if (!W.length && E.length) return wrong('incomplete', lab(E[0]) + ' Fill in <b>every</b> box.');
      if (!W.length) return Fm < 0 ? ok() : { v: 'form', code: res[Fm].code, hint: lab(Fm) };
      if (W.length === 1 && !E.length) return { v: 'wrong', code: res[W[0]].code, hint: lab(W[0]) };
      if (opt.multi) { var m = opt.multi(W, res); if (m) return { v: 'wrong', code: m, hint: lab(W[0]) }; }
      var P = HW.PARTIAL || {}, known = !E.length && W.every(function (i) { var c = res[i].code; return (P.small && P.small[c]) || (P.big && P.big[c]); });
      return { v: 'wrong', code: known ? 'u8t-two-slips' : 'u8t-several', hint: lab(W[0]) };
    };
  }
  function fieldsPart(prompt, fields, checkers, keys, answer, sol, hints, text, opt) {
    return { prompt: prompt, input: { type: 'fields', fields: fields }, check: allChk(checkers, fields.map(function (f) { return f.name || String(f.label || '').replace(/:\s*$/, ''); }), opt), key: keys, answer: answer, solution: sol, hints: hints || [], text: text };
  }
  function eqField(label, name, vars) { return { label: label, name: name, mode: 'math', keys: 'eq', vars: vars, placeholder: ' ' }; }
  function numsIn(ast, out) { if (!ast || typeof ast !== 'object') return out; if (ast.t === 'num') out.push(Math.abs(ast.v)); ['a', 'b', 'n'].forEach(function (k) { if (ast[k]) numsIn(ast[k], out); }); (ast.args || []).forEach(function (x) { numsIn(x, out); }); return out; }
  function isNumAst(a) { while (a && a.t === 'paren') a = a.a; return !!a && (a.t === 'num' || (a.t === 'neg' && isNumAst(a.a))); }
  /* "check the point in y = mx + b": the right side with x put in, = its value (which must be the y-coordinate) */
  function rhsSubChk(m, b, P) {
    var want = m * P[0] + b, swp = m * P[1] + b, eg = t(rhsSubT(m, b, P[0]) + '=' + nT(want));
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Type the right side with the ' + t('x') + '-value put in, then ' + t('=') + ' and its value.');
      var sides = s.split('=');
      if (sides.length > 2) return form('u8t-sub-read', 'Type the right side with the ' + t('x') + '-value put in, then ' + t('=') + ' and what it equals.');
      var asts = sides.map(function (x) { var a = ex.parse(x); return a.ok ? a.ast : null; });
      if (asts.some(function (a) { return !a; })) return form('u8t-sub-read', 'Put the <b>number</b> in place of ' + t('x') + ' (with brackets around a negative), then ' + t('=') + ' and its value.');
      var vals = asts.map(function (a) { return ex.value(a); });
      if (vals.some(function (v) { return !isFinite(v); })) return form('u8t-sub-read', 'Put the <b>number</b> in place of ' + t('x') + ' — no letters left.');
      var k = asts.length === 1 ? (isNumAst(asts[0]) ? -1 : 0) : !isNumAst(asts[0]) ? 0 : !isNumAst(asts[1]) ? 1 : -1;
      if (k < 0) return wrong('u8t-sub-show', 'Show the substitution: write the right side with the ' + t('x') + '-value put in, then what it equals.');
      if (asts.length === 2 && !near(vals[0], vals[1])) return wrong('u8t-sub-arith', 'Your substitution is worth ' + t(dT(vals[k])) + ', not ' + t(dT(vals[1 - k])) + '. Work it out again, carefully with the signs.');
      var v = vals[k], ns = numsIn(asts[k], []), shown = ns.indexOf(Math.abs(P[0])) >= 0 || ns.indexOf(Math.abs(m * P[0])) >= 0;
      if (near(v, want) && shown) return ok();
      if (!near(swp, want) && near(v, swp)) return wrong('u8t-sub-swap', 'Put the ' + t('x') + '-value in for ' + t('x') + ' — you used the ' + t('y') + '-value.');
      if (near(v, want)) return form('u8t-sub-show', 'Show the substitution, e.g. ' + eg + '.');
      if (shown) return wrong('u8t-sub-arith', 'Check the arithmetic, especially the signs: the right side should work out to the ' + t('y') + '-coordinate, ' + t(nT(P[1])) + '.');
      return wrong('u8t-sub-point', 'Substitute the solution you read off the graph.');
    };
  }
  /* an equation in ONE variable (the step after substituting / adding / subtracting).
     acc: [{ v: 'x'|'y', root }] the right ones; o.wrong [{ v, root, code, hint }]; o.allowSolved; o.bothHint; o.identHint; o.varHint */
  var READWHY = { 'no-eq': 'Type an equation with an equals sign.', unreadable: 'Your equation can’t be read — check the brackets and signs.', 'not-linear': 'The equation should be linear: no variables multiplied together or squared.' };
  function isIdentity(s) {
    var sides = s.split('='); if (sides.length !== 2) return null;
    var a = ex.parse(sides[0]), b = ex.parse(sides[1]); if (!a.ok || !b.ok) return null;
    var d1 = ex.value(a.ast, { x: 1.37, y: 2.91 }) - ex.value(b.ast, { x: 1.37, y: 2.91 }), d2 = ex.value(a.ast, { x: -0.73, y: 4.1 }) - ex.value(b.ast, { x: -0.73, y: 4.1 });
    if (!isFinite(d1) || !isFinite(d2)) return null;
    return Math.abs(d1 - d2) < 1e-9 ? (Math.abs(d1) < 1e-9 ? 'true' : 'false') : null;
  }
  function ovChk(acc, o) {
    o = o || {};
    var W = (o.wrong || []).filter(function (w) { return isFinite(w.root) && !acc.some(function (a) { return a.v === w.v && near(w.root, a.root); }); });
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim(); if (!s) return form('empty', 'Type the equation first.');
      var sides = s.split('=');
      if (sides.length !== 2 || !sides[0].trim() || !sides[1].trim()) return form('u8t-eq-read', 'Type an equation with one ' + t('=') + ' sign.');
      var q = Ln.read(s, ['x', 'y']);
      if (!q.ok) {
        var id = q.why === 'not-linear' ? isIdentity(s) : null;
        if (id) return wrong(o.identCode || 'u8t-same-eq', o.identHint || 'Both variables disappeared. Substitute into the <b>other</b> equation, not the one you started from.');
        return form('line-' + q.why, q.why === 'vars' ? 'Use only the letters ' + t('x') + ' and ' + t('y') + '.' : READWHY[q.why] || READWHY.unreadable);
      }
      if (Math.abs(q.a) > 1e-9 && Math.abs(q.b) > 1e-9) return wrong('u8t-res-not-elim', o.bothHint || 'Your equation still has both ' + t('x') + ' and ' + t('y') + ' in it — one of them should be gone.');
      var v = Math.abs(q.a) > 1e-9 ? 'x' : 'y', root = r6(-q.c / (v === 'x' ? q.a : q.b));
      var mine = acc.filter(function (a) { return a.v === v; })[0];
      if (mine && near(root, mine.root)) {
        var cl = s.replace(/\s|\\left|\\right/g, '');
        var solved = new RegExp('^' + v + '=-?[\\d.]+$|^-?[\\d.]+=' + v + '$|^' + v + '=-?\\\\frac\\{\\d+\\}\\{\\d+\\}$').test(cl);
        if (solved && !o.allowSolved) return form('u8t-step-show', o.solvedHint || 'That is the finished value — type the equation you get at this step, before you solve it.');
        return ok();
      }
      for (var i = 0; i < W.length; i++) if (W[i].v === v && near(root, W[i].root)) return wrong(W[i].code, W[i].hint);
      if (!mine) return wrong('u8t-wrong-var', o.varHint || 'Your equation is in ' + t(v) + ', but at this step the other variable should be left.');
      return wrong('u8t-step', o.hint || null);
    };
  }
  /* write a system: Tg = [[A, B, C], [A, B, C]] (A·v1 + B·v2 + C = 0); either order, any equivalent equations.
     opt: vars, labels, keyTex, names (what each equation says), tips, wrong: [{ eq: [A, B, C] | text, code, hint }] */
  function eqOf(e, vars) { if (Array.isArray(e)) return e; var r = Ln.read(e, vars); return r.ok ? [r.a, r.b, r.c] : null; }
  function onPt(L, P) { var s = Math.max(1, Math.abs(L[2]), Math.abs(L[0] * P[0]), Math.abs(L[1] * P[1])); return Math.abs(L[0] * P[0] + L[1] * P[1] + L[2]) < 1e-7 * s; }
  function solve2(A, B) { var d = A[0] * B[1] - A[1] * B[0]; if (Math.abs(d) < 1e-12) return null; return [(-A[2] * B[1] + A[1] * B[2]) / d, (-A[0] * B[2] + A[2] * B[0]) / d]; }
  function sysPart(prompt, Tg, opt, sol, hints, text) {
    var vars = opt.vars, names = opt.names || ['the first fact', 'the second fact'];
    var wr = (opt.wrong || []).map(function (w) { return { L: eqOf(w.eq, vars), code: w.code, hint: w.hint, text: typeof w.eq === 'string' ? w.eq : null }; }).filter(function (w) { return w.L && !Ln.same(w.L, Tg[0]) && !Ln.same(w.L, Tg[1]); });
    var P = solve2(Tg[0], Tg[1]);
    function match(L) { for (var j = 0; j < 2; j++) if (Ln.same(L, Tg[j])) return j; return -1; }
    var check = function (resp) {
      resp = resp || [];
      var a = String(resp[0] || '').trim(), b = String(resp[1] || '').trim();
      if (!a && !b) return form('empty', 'Write both equations.');
      var rs = [a ? Ln.read(a, vars) : null, b ? Ln.read(b, vars) : null];
      for (var i = 0; i < 2; i++) if (rs[i] && !rs[i].ok) return form('line-' + rs[i].why, rs[i].why === 'vars' ? 'Use only the letters ' + t(vars[0]) + ' and ' + t(vars[1]) + ' from the question.' : READWHY[rs[i].why] || READWHY.unreadable);
      var Ls = rs.map(function (q) { return q ? [q.a, q.b, q.c] : null; }), m = Ls.map(function (L) { return L ? match(L) : -1; });
      if (!a || !b) { var one = Ls[0] || Ls[1], j0 = match(one); return j0 >= 0 ? wrong('incomplete', 'Your equation for ' + names[j0] + ' is right — now write one for ' + names[1 - j0] + ' in the other box.') : wrong('sys-eq', 'Write <b>two</b> equations — one for each fact.'); }
      if (m[0] >= 0 && m[1] >= 0 && m[0] !== m[1]) return ok();
      if (m[0] >= 0 && m[0] === m[1]) return wrong('sys-same', 'Both of your equations describe ' + names[m[0]] + '. Write one equation for each fact.');
      for (i = 0; i < 2; i++) if (m[i] < 0) for (var k = 0; k < wr.length; k++) if (Ln.same(Ls[i], wr[k].L)) return wrong(wr[k].code, wr[k].hint);
      var g = m[0] >= 0 ? 0 : m[1] >= 0 ? 1 : -1;
      if (g >= 0) {
        var miss = 1 - m[g], der = P && onPt(Ls[1 - g], P);
        return wrong(der ? 'u8t-sys-derived' : 'u8t-sys-one', 'Your equation for ' + names[m[g]] + ' is right. ' + (der ? 'Your other equation is true for the answer, but it isn’t a fact of the question translated — write the equation for ' + names[miss] + ' straight from the words.' : 'Check the one for ' + names[miss] + (opt.tips ? ': ' + opt.tips[miss] : '.')));
      }
      if (P && onPt(Ls[0], P) && onPt(Ls[1], P)) return wrong('u8t-sys-derived', 'Both equations are true for the answer, but they aren’t the facts of the question — write one equation straight from each fact (no solving yet).');
      return wrong('sys-eq', null);
    };
    var labels = opt.labels || ['Equation 1', 'Equation 2'];
    var bad = wr.filter(function (w) { return w.text; }).map(function (w) { return [opt.keyTex[0], w.text]; });
    return { prompt: prompt, input: { type: 'fields', fields: labels.map(function (l) { return { label: l, mode: 'math', keys: 'eq', vars: vars, placeholder: ' ' }; }) },
      check: check, key: opt.keyTex, answer: opt.keyTex.map(function (k) { return t(k); }).join('<br>'), solution: sol, hints: hints || [], text: text,
      good: [opt.keyTex.slice().reverse()], bad: bad.concat([[opt.keyTex[0], '']]) };
  }
  /* one equation in the question's letters */
  function eqChk(Tg, vars, wrongs) {
    var wr = (wrongs || []).map(function (w) { return { L: eqOf(w.eq, vars), code: w.code, hint: w.hint }; }).filter(function (w) { return w.L && !Ln.same(w.L, Tg); });
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim(); if (!s) return form('empty', 'Type your equation first.');
      var q = Ln.read(s, vars); if (!q.ok) return form('line-' + q.why, q.why === 'vars' ? 'Use only the letters ' + t(vars[0]) + ' and ' + t(vars[1]) + '.' : READWHY[q.why] || READWHY.unreadable);
      var L = [q.a, q.b, q.c]; if (Ln.same(L, Tg)) return ok();
      for (var k = 0; k < wr.length; k++) if (Ln.same(L, wr[k].L)) return wrong(wr[k].code, wr[k].hint);
      return wrong('sys-eq', null);
    };
  }
  /* two answer numbers. want: numbers; opt: names, sys (two lines, in the order of the boxes), wrong [{ v, code, hint }], money */
  function numsChk(want, opt) {
    opt = opt || {}; var names = opt.names;
    return function (resp) {
      resp = resp || []; var vals = [], blank = 0;
      for (var i = 0; i < want.length; i++) { var s = String(resp[i] == null ? '' : resp[i]).trim(); if (!s) { blank++; vals.push(null); continue; } var v = numOf(s); if (v == null) return form('notnumber', 'Enter a single number for the ' + names[i] + (opt.money ? ' (no $ sign needed).' : '.')); vals.push(v); }
      if (blank === want.length) return form('empty', 'Fill in the boxes first.');
      var eq = function (v, w) { return v != null && near(v, w); };
      if (blank) { var anyR = vals.some(function (v, j) { return eq(v, want[j]); }); return wrong(anyR ? 'incomplete' : 'value', 'Fill in <b>every</b> box.'); }
      if (vals.every(function (v, j) { return eq(v, want[j]); })) return ok();
      var W0 = (opt.wrong || []).filter(function (w) { return w.v.every(function (x, j) { return isFinite(x) && near(vals[j], x); }) && !w.v.every(function (x, j) { return near(x, want[j]); }); })[0];
      if (W0) return wrong(W0.code, W0.hint);
      if (want.length === 2 && near(vals[0], want[1]) && near(vals[1], want[0]) && !near(want[0], want[1])) return wrong('swap-answer', opt.swapHint || 'Right numbers, wrong boxes: which one is the ' + names[0] + '?');
      if (opt.sys && want.length === 2) {
        var s0 = onPt(opt.sys[0], vals), s1 = onPt(opt.sys[1], vals);
        if (s0 !== s1) return wrong('u8t-one-eq', 'Your numbers fit one of the facts but not the other. Substitute them into both equations and look for the slip.');
      }
      var right = vals.map(function (v, j) { return eq(v, want[j]); });
      if (want.length === 2 && right.some(Boolean)) { var j = right.indexOf(false); return wrong('one-value', 'Your ' + names[1 - j] + ' is right — substitute it into one of the equations to find the ' + names[j] + ' again.'); }
      return wrong('value', null);
    };
  }
  function numsPart(prompt, fields, want, opt, sol, hints, text) {
    opt = opt || {};
    var show = function (v) { return opt.money ? money(v).replace('\\$', '') : dT(v); };
    return { prompt: prompt, input: { type: 'fields', fields: fields.map(function (f) { return { label: f.label, before: f.before, after: f.after }; }) },
      check: numsChk(want, Object.assign({ names: fields.map(function (f) { return f.name; }) }, opt)), key: want.map(function (v) { return String(r6(v)); }),
      answer: fields.map(function (f, i) { return f.label + ' ' + (f.before ? f.before : '') + t(show(want[i])) + (f.after ? ' ' + f.after : ''); }).join('<br>'),
      solution: sol, hints: hints || [], text: text, bad: (opt.bad || []).concat(want.length === 2 && !near(want[0], want[1]) ? [[String(r6(want[1])), String(r6(want[0]))]] : []) };
  }
  function mc(r, prompt, opts, sol, hints, text, keep) {
    var seen = {}, o2 = opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; });
    return K.P.mc(r, prompt, o2, sol, hints, text, keep);
  }
  function readKind(s) {
    s = String(s == null ? '' : s).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\infty/g, '∞').trim();
    if (!s) return '';
    if (/inf|many|∞|same line|coincid|endless|every/.test(s)) return 'inf';
    if (/^(no|none|zero|0)\b|no sol|parallel|never/.test(s)) return 'none';
    if (/^(one|1|exactly one|a single|single|unique|only one)\b|one sol|1 sol/.test(s)) return 'one';
    return null;
  }
  var KIND_KEY = { one: 'one solution', none: 'no solution', inf: 'infinitely many' };
  function kindChk(kind, why) {
    return function (resp) {
      var k = readKind(resp);
      if (k === '') return form('empty', 'Type one, none or infinitely many.');
      if (k == null) return form('u8t-kind-read', 'Type <b>one</b>, <b>none</b> or <b>infinitely many</b>.');
      return k === kind ? ok() : wrong('u8t-cls-kind', why(k));
    };
  }
  function ynChk(want, whyWrong) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').trim();
      if (!s) return form('empty', 'Type yes or no.');
      var k = /^(yes|y|yep|true)\b/.test(s) ? true : /^(no|n|nope|false|not)\b/.test(s) ? false : null;
      if (k == null) return form('u8t-yn-read', 'Type <b>yes</b> or <b>no</b>.');
      return k === want ? ok() : wrong(whyWrong.code, whyWrong.hint);
    };
  }
  function pickChk(names, want) {
    var keyOf = function (s) { return String(s).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/plan|the|\s|\.|!/g, ''); };
    var ks = names.map(function (n) { return keyOf(n); });
    return function (resp) {
      var k = keyOf(resp == null ? '' : resp); if (!k) return form('empty', 'Type which one is cheaper.');
      var i = ks.indexOf(k); if (i < 0) return form('u8t-pick-read', 'Type ' + names[0] + ' or ' + names[1] + '.');
      return i === want ? ok() : wrong('u8t-better', 'Compare your two costs: the better choice is the one that costs <b>less</b>.');
    };
  }

  /* ---------- worked-solution text ---------- */
  /* elimination of E1, E2 ({ a, b, c }: a·v1 + b·v2 = c), multiplying E1 by m1 and E2 by m2 (positive), eliminating 'elim' */
  function knownT(c, val, first) { return (c < 0 ? '-' : first ? '' : '+') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + '(' + nT(val) + ')'; }
  function backSub(E, P, vs, known) {   // known: index of the variable whose value is known
    var u = 1 - known, cu = u === 0 ? E.a : E.b, ck = known === 0 ? E.a : E.b, rhs = E.c - ck * P[known];
    var lhs = known === 0 ? knownT(E.a, P[0], true) + tm(E.b, vs[1]) : tm(E.a, vs[0], true) + knownT(E.b, P[1]);
    return t(lhs + '=' + nT(E.c)) + ', so ' + t(T([[cu, vs[u]]]) + '=' + nT(rhs)) + (cu === 1 ? '' : ' and ' + t(vs[u] + '=' + nT(P[u]))) + '.';
  }
  function elimSol(E1, E2, P, elim, m1, m2, vs) {
    vs = vs || ['x', 'y'];
    var ei = vs.indexOf(elim), keep = 1 - ei, co = function (E, i) { return i === 0 ? E.a : E.b; };
    var S1 = { a: m1 * E1.a, b: m1 * E1.b, c: m1 * E1.c }, S2 = { a: m2 * E2.a, b: m2 * E2.b, c: m2 * E2.c }, same = (co(S1, ei) > 0) === (co(S2, ei) > 0), s = '';
    if (m1 !== 1 || m2 !== 1) s += 'Multiply ' + (m1 !== 1 && m2 !== 1 ? 'Equation 1 by ' + t(m1) + ' and Equation 2 by ' + t(m2) : m1 !== 1 ? 'Equation 1 by ' + t(m1) : 'Equation 2 by ' + t(m2)) + ' (every term) so the ' + t(elim) + '-terms ' + (same ? 'match' : 'are opposites') + ':<br>' + t(gT(S1.a, S1.b, S1.c, vs)) + ' &nbsp; and &nbsp; ' + t(gT(S2.a, S2.b, S2.c, vs)) + '<br>';
    else s += 'The ' + t(elim) + '-terms are ' + (same ? 'the same' : 'opposites') + ', so ' + (same ? 'subtract' : 'add') + ' the equations.<br>';
    var Kc = same ? co(S1, keep) - co(S2, keep) : co(S1, keep) + co(S2, keep), C = same ? S1.c - S2.c : S1.c + S2.c, flip = same && Kc < 0;
    if (flip) { Kc = -Kc; C = -C; }
    s += (same ? (flip ? 'Subtract (Equation 2 minus Equation 1)' : 'Subtract') : 'Add') + ': ' + t(T([[Kc, vs[keep]]]) + '=' + nT(C)) + (Kc === 1 ? '' : ', so ' + t(vs[keep] + '=' + nT(P[keep]))) + '.<br>';
    s += 'Substitute into Equation 1: ' + backSub(E1, P, vs, keep) + '<br>';
    s += 'Check in Equation 2: ' + t(subT(E2.a, E2.b, P) + '=' + nT(E2.c)) + ' ✓. The solution is ' + t('(' + nT(P[0]) + ',\\ ' + nT(P[1]) + ')') + '.';
    return s;
  }
  /* substitution for a count/value system: v1 + v2 = N, p1·v1 + p2·v2 = V */
  function subsText(vs, N, p1, p2, V, n1, n2) {
    var d = r6(p1 - p2), rhs = r6(V - p2 * N);
    return t(vs[1] + '=' + N + '-' + vs[0]) + '<br>' + t(T([[p1, vs[0]]]) + '+' + p2 + '(' + N + '-' + vs[0] + ')=' + iT(V)) +
      '<br>' + t(T([[p1, vs[0]]]) + '+' + iT(p2 * N) + T([[-p2, vs[0]]]) + '=' + iT(V)) + '<br>' + t(T([[d, vs[0]]]) + '=' + iT(rhs)) + (d === 1 ? '' : ', so ' + t(vs[0] + '=' + n1)) +
      '<br>' + t(vs[1] + '=' + N + '-' + n1 + '=' + n2);
  }

  /* =================================================================================================================== */
  /* Q1 (L1): read the solution off a graph of two y = mx + b lines, then check it */
  function q1Shared(r) {
    var s = find(function () {
      var m1 = r.pick([1, 2, 3, 1, 2]), m2 = r.pick([-1, -2, -3, -1, -2]), x0 = nz(r, -4, 4), y0 = nz(r, -4, 4);
      if (r.chance(0.5)) { var tmp = m1; m1 = m2; m2 = tmp; }
      return { m: [m1, m2], b: [y0 - m1 * x0, y0 - m2 * x0], P: [x0, y0] };
    }, function (s) { return s.b[0] !== 0 && s.b[1] !== 0 && Math.abs(s.b[0]) <= 5 && Math.abs(s.b[1]) <= 5 && s.P[0] !== s.P[1]; }, { m: [1, -2], b: [3, -3], P: [-2, 1] });
    s.L = [mbL(s.m[0], s.b[0]), mbL(s.m[1], s.b[1])]; s.n = [mbT(s.m[0], s.b[0]), mbT(s.m[1], s.b[1])];
    return s;
  }
  /* Q2 (L1): is a given point the solution? */
  function q2Shared(r) {
    var s = find(function () {
      var A = r.pick([1, 2, 3, 2, 3]), B = r.pick([1, -1]), m = r.pick([1, 2, 3, -1, -2]), x0 = r.int(-2, 5), y0 = nz(r, -3, 6);
      var o = { A: A, B: B, m: m, x0: x0, y0: y0, C: A * x0 + B * y0, b: y0 - m * x0, kind: r.pick(['sol', 'sol', 'e1', 'e2', 'e1', 'e2']), d: r.pick([-2, -1, 1, 2]) };
      var x = x0 + o.d;
      o.Q = o.kind === 'sol' ? [x0, y0] : o.kind === 'e2' ? [x, m * x + o.b] : [x, (o.C - A * x) / B];
      return o;
    }, function (s) {
      return s.C !== 0 && Math.abs(s.C) <= 15 && s.b !== 0 && Math.abs(s.b) <= 9 && -s.A / s.B !== s.m && s.Q[0] !== s.Q[1] && Math.abs(s.Q[1]) <= 12 && s.Q[0] !== 0 && s.Q[1] !== 0;
    }, { A: 2, B: 1, m: 1, x0: 3, y0: -1, C: 5, b: -4, kind: 'sol', d: 1, Q: [3, -1] });
    s.e1 = gT(s.A, s.B, s.C); s.e2 = mbT(s.m, s.b); s.lhs = T([[s.A, 'x'], [s.B, 'y']]); s.rhs = T([[s.m, 'x'], [s.b, '']]);
    s.v1 = s.A * s.Q[0] + s.B * s.Q[1]; s.v2 = s.m * s.Q[0] + s.b; s.ok1 = s.v1 === s.C; s.ok2 = s.v2 === s.Q[1];
    return s;
  }
  /* Q3 (L2): classify from a graph */
  function q3Lines(r, kind) {
    return find(function () {
      var M = kind === 'none' ? [1, 2, -1, -2, [1, 2], [-1, 2]] : [1, 2, 3, -1, -2, -3, [1, 2], [-1, 2]], m1 = r.pick(M), b1 = r.int(-4, 4), m2 = kind === 'one' ? r.pick(M) : m1, b2 = kind === 'inf' ? b1 : r.int(-5, 5);
      return { m: [m1, m2], b: [b1, b2], L: [mbL(m1, b1), mbL(m2, b2)] };
    }, function (s) {
      if (kind === 'one') { if (parL(s.L[0], s.L[1])) return false; var P = solve2(arr(s.L[0]), arr(s.L[1])); return P && Math.abs(P[0]) <= 4 && Math.abs(P[1]) <= 4; }
      if (kind === 'none') return Math.abs(s.b[0] - s.b[1]) >= 3;
      return true;
    }, null);
  }
  /* Q4 (L3): substitution, a variable already isolated */
  function q4Shared(r) {
    var isoX = r.chance(0.3);
    var s = find(function () {
      var m = r.pick([1, 1, 2, 3, -1, 2]), b = nz(r, -6, 7), A = r.int(1, 4), B = r.pick([1, 2, 3, -1, -2]), f = nz(r, -2, 8);
      var o = { isoX: isoX, m: m, b: b, A: A, B: B };
      if (!isoX) { o.x0 = f; o.y0 = m * f + b; o.k = A + B * m; o.kc = B * b; } else { o.y0 = f; o.x0 = m * f + b; o.k = A * m + B; o.kc = A * b; }
      o.C = A * o.x0 + B * o.y0;
      return o;
    }, function (s) { return s.k !== 0 && s.C !== 0 && Math.abs(s.C) <= 40 && s.x0 !== 0 && s.y0 !== 0 && Math.abs(s.x0) <= 15 && Math.abs(s.y0) <= 15 && Math.abs(s.x0) !== Math.abs(s.y0) && !(s.A === 1 && s.B === 1); }, null)
      || { isoX: false, m: 1, b: 4, A: 3, B: -2, x0: 9, y0: 13, k: 1, kc: -8, C: 1 };
    var iv = s.isoX ? 'x' : 'y', fv0 = s.isoX ? 'y' : 'x';
    s.iv = iv; s.fv = fv0; s.expr = T([[s.m, fv0], [s.b, '']]); s.e1 = iv + '=' + s.expr; s.e2 = gT(s.A, s.B, s.C);
    s.L = [s.isoX ? std(1, -s.m, s.b) : mbL(s.m, s.b), std(s.A, s.B, s.C)]; s.P = [s.x0, s.y0];
    s.subEq = (s.isoX ? bracket(s.A, s.expr, true) + tm(s.B, 'y') : tm(s.A, 'x', true) + bracket(s.B, s.expr)) + '=' + s.C;
    s.froot = s.isoX ? s.y0 : s.x0;
    return s;
  }
  /* Q5 (L5): elimination, a pair of coefficients already matches */
  function q5Shared(r) {
    return find(function () {
      var elim = r.pick(['x', 'y']), add = r.chance(0.5), a = r.int(2, 6) * (r.chance(0.2) ? -1 : 1), b1 = nz(r, -5, 7), b2 = nz(r, -5, 7), x0 = nz(r, -4, 9), y0 = nz(r, -5, 8);
      var s = { elim: elim, add: add };
      var u1 = a, u2 = add ? -a : a;   // coefficients of the eliminated variable
      s.E = elim === 'x' ? [{ a: u1, b: b1 }, { a: u2, b: b2 }] : [{ a: b1, b: u1 }, { a: b2, b: u2 }];
      if (s.E[0].a < 0 && s.E[1].a < 0 && elim === 'y') return null;
      s.E.forEach(function (e) { e.c = e.a * x0 + e.b * y0; });
      s.P = [x0, y0]; s.keep = elim === 'x' ? 'y' : 'x'; s.kv = elim === 'x' ? y0 : x0;
      s.Kc = add ? b1 + b2 : b1 - b2; s.C = add ? s.E[0].c + s.E[1].c : s.E[0].c - s.E[1].c; s.b1 = b1; s.b2 = b2;
      return s;
    }, function (s) { return Math.abs(s.Kc) >= 2 && s.b1 !== s.b2 && s.E.every(function (e) { return e.c !== 0 && Math.abs(e.c) <= 50; }) && s.E[0].c !== s.E[1].c && s.P[0] !== s.P[1]; }, null);
  }
  /* Q8 (L1): rewrite Ax + By = C, graph both, solve */
  function q8Shared(r) {
    var s = find(function () {
      var A = r.pick([1, 2, 3, 4, 1]), B = r.pick([1, -1]), m2 = r.pick([-3, -2, -1, 1, 2, 3]), x0 = nz(r, -3, 4), y0 = r.int(-4, 4);
      return { A: A, B: B, C: A * x0 + B * y0, m2: m2, b2: y0 - m2 * x0, x0: x0, y0: y0 };
    }, function (s) { var m1 = -s.A / s.B, b1 = s.C / s.B; return m1 !== s.m2 && s.C !== 0 && Math.abs(b1) <= 5 && s.b2 !== 0 && Math.abs(s.b2) <= 5 && b1 !== s.b2 && s.x0 !== s.y0 && (m1 > 0) !== (s.m2 > 0); }, { A: 1, B: -1, C: 3, m2: -1, b2: 5, x0: 4, y0: 1 });
    s.L = [std(s.A, s.B, s.C), mbL(s.m2, s.b2)]; s.n = [gT(s.A, s.B, s.C), mbT(s.m2, s.b2)]; s.P = [s.x0, s.y0];
    return s;
  }
  /* Q9 (L2): classify without graphing (one equation needs rearranging) */
  function cls15(r, kind) {
    var big = function (tx) { return (tx.match(/\d+/g) || []).some(function (d) { return Number(d) > 24; }); };
    return find(function () {
      var m = r.pick([-4, -3, -2, -1, 1, 2, 3, 4]), b1 = nz(r, -6, 8), L1 = mbL(m, b1), L2;
      if (kind === 'one') { var m2 = r.pick([-4, -3, -2, -1, 1, 2, 3, 4]); if (m2 === m) return null; L2 = mbL(m2, nz(r, -6, 9)); }
      else if (kind === 'none') L2 = mbL(m, nz(r, -6, 9));
      else L2 = L1;
      var si2 = r.chance(0.5), k1 = r.pick([1, 1, 2]), k2 = r.pick(kind === 'inf' ? [2, 3, -1] : [1, 1, 2]);
      return { L1: L1, L2: L2, kind: kind, t1: scaledT(L1, k1), t2: si2 ? si(L2) : scaledT(L2, k2), si2: si2 };
    }, function (s) {
      if (s.t1 === s.t2 || big(s.t1) || big(s.t2)) return false;
      if (s.kind === 'one') return !parL(s.L1, s.L2);
      if (s.kind === 'none') return !sameL(s.L1, s.L2);
      return true;
    }, null);
  }
  function rearrWrongs(Lo) {
    var A = Lo.A, B = Lo.B, C = -Lo.C, m = fr(-A, B), b = fr(C, B), W = [];   // A x + B y = C
    if (Math.abs(B) > 1) { W.push({ is: mbL(fr(-A, B), C), code: 'u8t-nodiv', hint: 'Divide <b>every</b> term by the coefficient of ' + t('y') + ' — the constant too.' }); W.push({ is: mbL(-A * (B < 0 ? -1 : 1), b), code: 'u8t-nodiv', hint: 'Divide <b>every</b> term by the coefficient of ' + t('y') + ' — the ' + t('x') + '-term too.' }); }
    if (B < 0) { W.push({ is: mbL([-m[0], m[1]], [-b[0], b[1]]), code: 'u8t-neg', hint: 'The coefficient of ' + t('y') + ' is negative, so dividing by it changes <b>every</b> sign.' }); W.push({ is: mbL(m, [-b[0], b[1]]), code: 'u8t-neg', hint: 'Dividing by a negative changes the sign of the constant too.' }); W.push({ is: mbL([-m[0], m[1]], b), code: 'u8t-neg', hint: 'Dividing by a negative changes the sign of the ' + t('x') + '-term too.' }); }
    else W.push({ is: mbL([-m[0], m[1]], b), code: 'line-slope-sign', hint: 'Moving the ' + t('x') + '-term to the other side changes its sign.' });
    return W.filter(function (w) { return !sameL(w.is, Lo); });
  }
  function siChk(Lo) { return K.line(Lo, { form: 'slope-intercept', wrong: rearrWrongs(Lo) }); }
  /* Q10 (L4): isolate a variable first */
  function q10Shared(r) {
    var s = find(function () {
      var pos = r.pick(['1y', '1y', '2y', '2y', '1x', '2x']), x0 = nz(r, -2, 6), y0 = nz(r, -3, 6);
      var a1 = r.int(2, 5), a2 = r.int(2, 5), b1 = r.int(2, 5) * r.pick([1, -1]), b2 = r.int(2, 5) * r.pick([1, -1]);
      if (pos === '1y') b1 = r.pick([1, -1, -1]); else if (pos === '2y') b2 = r.pick([1, -1, -1]); else if (pos === '1x') a1 = 1; else a2 = 1;
      var o = { pos: pos, E: [{ a: a1, b: b1 }, { a: a2, b: b2 }], P: [x0, y0] };
      o.E.forEach(function (e) { e.c = e.a * x0 + e.b * y0; });
      return o;
    }, function (s) {
      var E = s.E, det = E[0].a * E[1].b - E[0].b * E[1].a, ones = [E[0].a, E[0].b, E[1].a, E[1].b].filter(function (c) { return Math.abs(c) === 1; }).length;
      return det !== 0 && ones === 1 && E.every(function (e) { return e.c !== 0 && Math.abs(e.c) <= 30; }) && s.P[0] !== s.P[1];
    }, null);
    var i = s.pos.charAt(0) === '1' ? 0 : 1, j = 1 - i, v = s.pos.charAt(1), Ei = s.E[i], Ej = s.E[j];
    s.i = i; s.j = j; s.v = v; s.n = s.E.map(function (e) { return gT(e.a, e.b, e.c); });
    s.L = s.E.map(function (e) { return std(e.a, e.b, e.c); });
    /* isolated: v = p·w + q (w the other variable) */
    if (v === 'y') { s.p = -Ei.a * Ei.b; s.q = Ei.c * Ei.b; s.w = 'x'; } else { s.p = -Ei.b; s.q = Ei.c; s.w = 'y'; }
    s.expr = T([[s.p, s.w], [s.q, '']]); s.iso = v + '=' + s.expr;
    s.subEq = (v === 'y' ? tm(Ej.a, 'x', true) + bracket(Ej.b, s.expr) : bracket(Ej.a, s.expr, true) + tm(Ej.b, 'y')) + '=' + Ej.c;
    /* the same, with a sign slip when isolating: wrong p and/or q */
    var cv = v === 'y' ? Ej.b : Ej.a, cw = v === 'y' ? Ej.a : Ej.b, wv = v === 'y' ? 0 : 1;   // in Ej: cw·w + cv·v = c
    s.slips = [[-s.p, s.q], [s.p, -s.q], [-s.p, -s.q]].map(function (pq) {
      var den = cw + cv * pq[0]; if (!den) return null;
      var wr = (Ej.c - cv * pq[1]) / den, vr = pq[0] * wr + pq[1];
      return { v: s.w, root: r6(wr), pt: wv === 0 ? [wr, vr] : [vr, wr] };
    }).filter(function (x) { return x && isFinite(x.root); });
    return s;
  }
  /* Q11 (L6): multiply ONE equation */
  function q11Shared(r) {
    return find(function () {
      var elim = r.pick(['y', 'y', 'x']), P1 = r.int(2, 5) * r.pick([1, 1, -1]), s2 = r.pick([1, -1]), o1 = r.int(1, 5), o2 = r.int(1, 5), x0 = nz(r, -3, 6), y0 = nz(r, -3, 6);
      if (elim === 'x') { P1 = Math.abs(P1); s2 = 1; o1 = o1 * r.pick([1, -1]); o2 = o2 * r.pick([1, -1]); }
      var E = elim === 'y' ? [{ a: o1, b: P1 }, { a: o2, b: s2 }] : [{ a: P1, b: o1 }, { a: s2, b: o2 }];
      E.forEach(function (e) { e.c = e.a * x0 + e.b * y0; });
      var k = -P1 * s2;   // multiply Equation 2 by k, then ADD
      var Kc = o1 + k * o2, C = E[0].c + k * E[1].c;
      return { elim: elim, keep: elim === 'y' ? 'x' : 'y', E: E, P: [x0, y0], P1: P1, s2: s2, o1: o1, o2: o2, k: k, Kc: Kc, C: C, kv: elim === 'y' ? x0 : y0 };
    }, function (s) { return Math.abs(s.Kc) >= 2 && s.E.every(function (e) { return e.c !== 0 && Math.abs(e.c) <= 30; }) && s.P[0] !== s.P[1] && Math.abs(s.o1) !== Math.abs(s.P1); }, null);
  }
  /* Q14 (L6): multiply BOTH equations */
  function q14Shared(r) {
    return find(function () {
      var a1 = r.int(2, 5), b1 = r.int(2, 5), a2 = r.int(2, 5), b2 = -r.int(2, 5), x0 = nz(r, -2, 5), y0 = nz(r, -3, 5);
      var E = [{ a: a1, b: b1 }, { a: a2, b: b2 }]; E.forEach(function (e) { e.c = e.a * x0 + e.b * y0; });
      return { E: E, P: [x0, y0] };
    }, function (s) {
      var E = s.E, A1 = E[0].a, A2 = E[1].a, B1 = Math.abs(E[0].b), B2 = Math.abs(E[1].b);
      return A1 % A2 && A2 % A1 && B1 % B2 && B2 % B1 && gcd(A1, B1) === 1 && gcd(A2, B2) === 1 && E.every(function (e) { return e.c !== 0 && Math.abs(e.c) <= 30; }) && s.P[0] !== s.P[1];
    }, null);
  }
  /* Q16 (EP05 #8): find the error in a worked elimination */
  function q16Build(a, b1, b2, x0, y0) {
    var s = { a: a, b1: b1, b2: b2, x0: x0, y0: y0, c1: a * x0 + b1 * y0, c2: a * x0 + b2 * y0 }; s.sw = b1 + b2;
    s.yw = (s.c1 - s.c2) / s.sw; s.xwF = fr(s.c1 - b1 * s.yw, a); s.xw = fv(s.xwF);
    s.n = [gT(a, b1, s.c1), gT(a, b2, s.c2)]; s.L = [std(a, b1, s.c1), std(a, b2, s.c2)]; s.P = [x0, y0];
    return s;
  }
  function q16Shared(r) {
    var s = find(function () { return q16Build(r.int(2, 6), nz(r, -5, 5), nz(r, -5, 5), nz(r, -3, 5), nz(r, -4, 4)); },
      function (s) { return s.b1 !== s.b2 && Math.abs(s.sw) >= 2 && Math.abs(s.sw) <= 4 && isInt(s.yw) && s.yw !== s.y0 && s.yw !== 0 && Math.abs(s.yw) <= 15 && !near(s.xw, s.x0) && Math.abs(s.c1) <= 30 && Math.abs(s.c2) <= 30 && s.b1 - s.b2 !== s.sw && Math.abs(s.b1 - s.b2) >= 2; }, null) || q16Build(4, -3, 5, 2, 2);
    s.who = r.pick([['Dev', 'His'], ['Liam', 'His'], ['Ava', 'Her'], ['Maya', 'Her'], ['Noah', 'His'], ['Mei', 'Her']]);
    return s;
  }
  function xwT(f) { var v = f[0] / f[1], d = f[1]; while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1 ? dT(v) : fT(f); }
  /* Q6 (L7): translate a number / age / class problem */
  var AGEP = [['Sofia', 's', 'Diego', 'd', 'her brother'], ['Jordan', 'j', 'Ava', 'a', 'his sister'], ['Maya', 'm', 'Ben', 'b', 'her brother'], ['Priya', 'p', 'Tom', 't', 'her cousin'], ['Nadia', 'n', 'Raj', 'r', 'her cousin'], ['Carter', 'c', 'Gwen', 'g', 'his sister']];
  function q6Shared(r) {
    var c = r.pick(['age', 'age', 'num', 'times', 'class']), o = { c: c };
    if (c === 'age') { var P = r.pick(AGEP); o.v = [P[1], P[3]]; o.who = P; o.y = r.int(6, 20); o.d = r.int(2, 9); o.x = o.y + o.d; o.S = o.x + o.y; }
    else if (c === 'num') { o.v = ['x', 'y']; o.y = r.int(5, 30); o.d = r.int(3, 15); o.x = o.y + o.d; o.S = o.x + o.y; }
    else if (c === 'times') { o.v = ['x', 'y']; o.k = r.pick([2, 3, 4, 5]); o.y = r.int(4, 15); o.x = o.k * o.y; o.S = o.x + o.y; }
    else { o.v = ['g', 'b']; o.y = r.int(9, 15); o.d = r.int(2, 8); o.x = o.y + o.d; o.S = o.x + o.y; }
    return o;
  }
  function q6Text(s) {
    var v = s.v;
    if (s.c === 'age') return s.who[0] + ' is ' + t(s.d) + ' years older than ' + s.who[4] + ' ' + s.who[2] + '. The sum of their ages is ' + t(s.S) + '. Let ' + t(v[0]) + ' be ' + s.who[0] + '’s age and ' + t(v[1]) + ' be ' + s.who[2] + '’s age.';
    if (s.c === 'num') return 'The sum of two numbers is ' + t(s.S) + '. The larger number is ' + t(s.d) + ' more than the smaller number. Let ' + t('x') + ' be the larger number and ' + t('y') + ' the smaller number.';
    if (s.c === 'times') return 'One number is ' + t(s.k) + ' times another number. Their sum is ' + t(s.S) + '. Let ' + t('x') + ' be the larger number and ' + t('y') + ' the smaller number.';
    return 'There are ' + t(s.S) + ' students in a class. There are ' + t(s.d) + ' more girls than boys. Let ' + t('g') + ' be the number of girls and ' + t('b') + ' the number of boys.';
  }
  /* Q7 (L4): which variable to isolate */
  function q7Shared(r) {
    return find(function () {
      var pos = r.int(0, 3), C = [r.int(2, 6), r.int(2, 6) * r.pick([1, -1]), r.int(2, 6), r.int(2, 6) * r.pick([1, -1])], x0 = nz(r, -2, 5), y0 = nz(r, -2, 5);
      C[pos] = pos % 2 === 0 ? 1 : r.pick([1, -1]);
      var E = [{ a: C[0], b: C[1] }, { a: C[2], b: C[3] }]; E.forEach(function (e) { e.c = e.a * x0 + e.b * y0; });
      return { pos: pos, E: E };
    }, function (s) { var E = s.E; return E[0].a * E[1].b !== E[0].b * E[1].a && E.every(function (e) { return e.c !== 0 && Math.abs(e.c) <= 30; }); }, null);
  }
  /* Q12 (L7): count and value */
  var CV = [
    { txt: 'Movie tickets cost {p1} for adults and {p2} for children. A family bought {N} tickets and paid {V} in total.', v: ['a', 'c'], names: ['adult tickets', 'child tickets'], one: ['adult ticket', 'child ticket'], p1: [10, 11, 12, 13], p2: [6, 7, 8], N: [6, 12], word: 'tickets' },
    { txt: 'A bakery sells muffins for {p1} each and cookies for {p2} each. One morning it sold {N} muffins and cookies for {V} in total.', v: ['m', 'c'], names: ['muffins', 'cookies'], one: ['muffin', 'cookie'], p1: [3, 4], p2: [1, 2], N: [30, 60], word: 'items' },
    { txt: 'At the school canteen, hot dogs cost {p1} and juice boxes cost {p2}. On Monday the canteen sold {N} hot dogs and juice boxes for {V} in total.', v: ['h', 'j'], names: ['hot dogs', 'juice boxes'], one: ['hot dog', 'juice box'], p1: [3, 4], p2: [1, 2], N: [30, 50], word: 'items' },
    { txt: 'At a school concert, adult tickets cost {p1} and student tickets cost {p2}. A total of {N} tickets were sold for {V}.', v: ['a', 's'], names: ['adult tickets', 'student tickets'], one: ['adult ticket', 'student ticket'], p1: [8, 9, 10], p2: [4, 5, 6], N: [40, 80], word: 'tickets' }];
  function q12Shared(r) {
    var C = r.pick(CV);
    return find(function () { var p1 = r.pick(C.p1), p2 = r.pick(C.p2), N = r.int(C.N[0], C.N[1]), n1 = r.int(2, N - 2); return { C: C, p: [p1, p2], N: N, n: [n1, N - n1], V: p1 * n1 + p2 * (N - n1) }; },
      function (s) { return s.n[0] !== s.n[1] && s.p[0] > s.p[1] && s.n[1] >= 2; }, null);
  }
  function fill(tx, o) { return tx.replace(/\{(\w+)\}/g, function (m, k) { return o[k]; }); }
  /* Q13 (L6): prices from two purchases */
  var TWO = [{ lead: 'A food truck sells tacos and burritos.', v: ['t', 'b'], one: ['taco', 'burrito'], many: ['tacos', 'burritos'], days: ['On Friday,', 'On Saturday,'], verb: 'sold for' },
    { lead: 'A concert sells adult and child tickets.', v: ['a', 'c'], one: ['adult ticket', 'child ticket'], many: ['adult tickets', 'child tickets'], days: ['One family bought', 'Another family bought'], verb: 'for' },
    { lead: 'A canteen sells muffins and juices.', v: ['m', 'j'], one: ['muffin', 'juice'], many: ['muffins', 'juices'], days: ['On Monday,', 'On Tuesday,'], verb: 'sold for' },
    { lead: 'A snack stand sells hot dogs and drinks.', v: ['h', 'd'], one: ['hot dog', 'drink'], many: ['hot dogs', 'drinks'], days: ['Before the game,', 'After the game,'], verb: 'sold for' }];
  function q13Shared(r) {
    var C = r.pick(TWO);
    return find(function () {
      var p = [r.int(2, 9), r.int(2, 9)], n = [[r.int(1, 6), r.int(1, 6)], [r.int(1, 6), r.int(1, 6)]];
      return { C: C, p: p, n: n, V: n.map(function (q) { return q[0] * p[0] + q[1] * p[1]; }) };
    }, function (s) {
      var n = s.n, det = n[0][0] * n[1][1] - n[0][1] * n[1][0];
      var div = function (a, b) { return a % b === 0 || b % a === 0; };
      return det !== 0 && s.p[0] !== s.p[1] && (div(n[0][0], n[1][0]) || div(n[0][1], n[1][1])) && s.V.every(function (v) { return v <= 60; }) && n[0].join() !== n[1].join() && n.every(function (q) { return q[0] + q[1] >= 4 && q[0] !== q[1]; }) && s.V[0] !== s.V[1];
    }, null);
  }
  function plural(k, one, many) { return k === 1 ? '1 ' + one : k + ' ' + many; }
  /* Q15 (L2): a value of k / c */
  /* Q17 (L7, EP07 #16): two plans */
  var PLANS = [{ intro: 'A climbing gym has two ways to pay.', A: 'Drop-in', B: 'Membership', aTxt: 'pay {a} per visit', bTxt: 'pay a {F} monthly fee plus {b} per visit', v: 'n', vw: 'visits', one: 'visit', defn: 'the number of visits in a month' },
    { intro: 'Two parking lots downtown charge differently.', A: 'Lot A', B: 'Lot B', aTxt: 'charges {a} per hour', bTxt: 'charges a {F} flat fee plus {b} per hour', v: 'h', vw: 'hours', one: 'hour', defn: 'the number of hours parked' },
    { intro: 'Two skating rinks charge differently.', A: 'Rink A', B: 'Rink B', aTxt: 'charges {a} per skate session', bTxt: 'charges a {F} season card plus {b} per session', v: 's', vw: 'sessions', one: 'session', defn: 'the number of sessions' }];
  function q17Shared(r) {
    var C = r.pick(PLANS);
    return find(function () {
      var a = r.int(4, 20), b = r.int(1, a - 2), X = r.int(3, 12), F = X * (a - b), N = X + r.pick([-3, -2, 2, 3, 4, 5]);
      return { C: C, a: a, b: b, X: X, F: F, Cst: a * X, N: N };
    }, function (s) { return s.F <= 150 && s.F >= 10 && s.N >= 1 && (s.F % 5 === 0 || s.F < 40) && s.a * s.N <= 300; }, null);
  }

  HW.defineTest({
    id: 'u8test', unit: 8, title: 'Unit 8 Test', outcome: 'RF9', calc: false,
    blurb: 'The Unit 8 outcomes-based test on RF9 (systems of linear equations): solving by graphing and checking a solution, classifying systems (one, none or infinitely many solutions), substitution, elimination, and word problems — in Beginning, Progressing and Mastery boxes. No calculator.',
    questions: [
      /* ======================= Beginning ======================= */
      { num: '1', outcome: 'RF9', shared: q1Shared,
        stem: function (s) { return 'The system ' + t(s.n[0]) + ' (blue) and ' + t(s.n[1]) + ' (red, dashed) is graphed below.' + sysFig(s.L[0], s.L[1]); },
        parts: [
          { id: '1a', outcome: 'RF9', level: 'BEG', make: function (r, s) {
            return pointPart('State the solution of the system as an ordered pair.', s.P, s.L, {},
              'The lines cross at ' + ptt(s.P) + ': ' + (s.P[0] > 0 ? 'right ' : 'left ') + t(Math.abs(s.P[0])) + ', then ' + (s.P[1] > 0 ? 'up ' : 'down ') + t(Math.abs(s.P[1])) + '. The solution is ' + ptt(s.P) + '.',
              ['The solution of a system is the point where the two lines cross.', 'Write the ' + t('x') + '-coordinate first: ' + t('(x,\\ y)') + '.'], 'read solution from graph ' + s.n.join(','));
          } },
          { id: '1b', outcome: 'RF9', level: 'BEG', make: function (r, s) {
            var keys = [0, 1].map(function (i) { return rhsSubT(s.m[i], s.b[i], s.P[0]) + '=' + nT(s.P[1]); });
            var p = fieldsPart('Check your solution in <b>both</b> equations. In each box, type the right side with the ' + t('x') + '-value put in, then what it equals (for example ' + t('2(3)-1=5') + '). It should equal the ' + t('y') + '-value.',
              [0, 1].map(function (i) { return eqField('In ' + t(s.n[i]) + ':', 'In ' + t(s.n[i])); }),
              [0, 1].map(function (i) { return rhsSubChk(s.m[i], s.b[i], s.P); }), keys,
              keys.map(function (k, i) { return 'In ' + t(s.n[i]) + ': ' + t(k) + ' ✓'; }).join('<br>'),
              'Put ' + t('x=' + s.P[0]) + ' into the right side of each equation; each must give ' + t('y=' + s.P[1]) + ':<br>' + [0, 1].map(function (i) { return t(s.n[i]) + ': ' + t(rhsSubT(s.m[i], s.b[i], s.P[0]) + '=' + nT(s.P[1])) + ' ✓'; }).join('<br>') + '<br>Both are true, so ' + ptt(s.P) + ' is the solution.',
              ['Replace ' + t('x') + ' with ' + t(s.P[0]) + ' (use brackets around a negative) and work out the right side.', 'Each right side must come out to the ' + t('y') + '-value of the point.'], 'check solution ' + s.n.join(','));
            p.bad = [[keys[0], ''], [rhsSubT(s.m[0], s.b[0], s.P[1]) + '=' + nT(s.m[0] * s.P[1] + s.b[0]), keys[1]], [nT(s.P[1]) + '=' + nT(s.P[1]), keys[1]]];
            return p;
          } }] },
      { num: '2', outcome: 'RF9', shared: q2Shared,
        stem: function (s) { return 'Is ' + ptt(s.Q) + ' the solution of this system? Substitute it into <b>both</b> equations.' + sysTexN(s.e1, s.e2); },
        parts: [
          { id: '2', outcome: 'RF9', level: 'BEG', make: function (r, s) {
            var Q = s.Q, want = s.ok1 && s.ok2;
            var c1 = valChk(s.v1, function (v) { return near(v, s.A * Q[1] + s.B * Q[0]) ? { code: 'u8t-sub-swap', hint: 'Put ' + t(Q[0]) + ' in for ' + t('x') + ' and ' + t(Q[1]) + ' in for ' + t('y') + '.' } : { code: 'u8t-sub-arith', hint: 'Work out ' + t(subT(s.A, s.B, Q)) + ' again, carefully with the signs.' }; });
            var c2 = valChk(s.v2, function (v) { return near(v, s.m * Q[1] + s.b) ? { code: 'u8t-sub-swap', hint: 'Put the ' + t('x') + '-value, ' + t(Q[0]) + ', in for ' + t('x') + '.' } : { code: 'u8t-sub-arith', hint: 'Work out ' + t(rhsSubT(s.m, s.b, Q[0])) + ' again, carefully with the signs.' }; });
            var c3 = ynChk(want, want ? { code: 'u8t-yn', hint: 'Both equations come out true, so the point <b>is</b> the solution.' } : (s.ok1 || s.ok2) ? { code: 'u8t-one-eq', hint: 'The point makes only one equation true. The solution must make <b>both</b> true.' } : { code: 'u8t-yn', hint: 'Neither equation comes out true, so the point is not the solution.' });
            var verdict = function (good) { return good ? ' ✓' : ' ✗'; };
            var p = fieldsPart('Fill in the boxes.', [
              { label: 'In ' + t(s.e1) + ', the left side ' + t(s.lhs) + ' at ' + ptt(Q) + ' is', name: 'Left side of ' + t(s.e1) },
              { label: 'In ' + t(s.e2) + ', the right side ' + t(s.rhs) + ' at ' + t('x=' + Q[0]) + ' is', name: 'Right side of ' + t(s.e2) },
              { label: 'Is ' + ptt(Q) + ' the solution? (yes or no)', name: 'Yes or no', mode: 'text', placeholder: ' ' }],
              [c1, c2, c3], [String(s.v1), String(s.v2), want ? 'yes' : 'no'],
              t(String(s.v1)) + ', ' + t(String(s.v2)) + ' — <b>' + (want ? 'yes' : 'no') + '</b>',
              t(s.e1) + ': ' + t(subT(s.A, s.B, Q) + '=' + s.v1) + (s.ok1 ? ', which equals ' + t(s.C) + verdict(true) : ', but the right side is ' + t(s.C) + verdict(false)) + '<br>' +
                t(s.e2) + ': ' + t(rhsSubT(s.m, s.b, Q[0]) + '=' + s.v2) + (s.ok2 ? ', which equals ' + t('y=' + Q[1]) + verdict(true) : ', but ' + t('y=' + Q[1]) + verdict(false)) + '<br>' +
                (want ? 'Both equations are true, so <b>yes</b>, ' + ptt(Q) + ' is the solution.' : (s.ok1 || s.ok2) ? 'It works in only one equation, so <b>no</b>, it is not the solution: a solution must make <b>both</b> equations true.' : 'It works in neither equation, so <b>no</b>.'),
              ['Put ' + t('x=' + Q[0]) + ' and ' + t('y=' + Q[1]) + ' into each equation.', 'The point is the solution only if <b>both</b> equations come out true.'], 'is point a solution ' + s.e1 + s.e2 + pt(Q));
            p.bad = [[String(s.v1), String(s.v2), want ? 'no' : 'yes'], [String(s.v1 + 1), String(s.v2), want ? 'yes' : 'no'], [String(s.v1), String(s.v2), '']];
            return p;
          } }] },
      { num: '3', outcome: 'RF9', shared: function (r) { var k = r.sample(['one', 'none', 'inf'], 2); return { kinds: k, sys: k.map(function (kd) { return q3Lines(r, kd); }) }; },
        stem: 'Each graph shows a system of two linear equations: a blue line and a red dashed line.',
        parts: [0, 1].map(function (i) {
          return { id: '3' + 'ab'[i], outcome: 'RF9', level: 'BEG', make: function (r, s) {
            var kind = s.kinds[i], S = s.sys[i];
            var why = function (k) {
              if (kind === 'one') return 'The lines cross at exactly <b>one</b> point, so there is one solution.';
              if (kind === 'none') return k === 'inf' ? 'The lines are parallel — they never touch. Infinitely many would need the lines to lie on top of each other.' : 'The lines are parallel: they never cross, so there is no point on both.';
              return k === 'none' ? 'Look closely: the dashed line lies right on top of the blue one — it is the same line, so every point on it works.' : 'The two lines lie on top of each other, so they share every point, not just one.';
            };
            var sol = kind === 'one' ? 'The lines cross at one point, ' + ptt(solve2(arr(S.L[0]), arr(S.L[1]))) + ': <b>one solution</b>.' : kind === 'none' ? 'The lines are parallel (same steepness, different ' + t('y') + '-intercepts) and never meet: <b>no solution</b>.' : 'The dashed line lies on top of the blue line — they are the <b>same line</b>, so every point on it is a solution: <b>infinitely many solutions</b>.';
            var p = fieldsPart(sysFig(S.L[0], S.L[1]) + 'How many solutions does this system have?', [{ label: 'Number of solutions (one, none or infinitely many):', name: 'Number of solutions', mode: 'text', wide: true, placeholder: ' ' }],
              [kindChk(kind, why)], [KIND_KEY[kind]], '<b>' + KIND_KEY[kind] + (kind === 'inf' ? ' solutions' : '') + '</b>', sol,
              ['Cross once: one solution. Parallel (never touch): no solution. On top of each other: infinitely many.'], 'classify from graph ' + kind + ' ' + S.L.map(arr).join(';'));
            p.bad = ['one', 'none', 'inf'].filter(function (k) { return k !== kind; }).map(function (k) { return [KIND_KEY[k]]; });
            return p;
          } };
        }) },
      { num: '4', outcome: 'RF9', shared: q4Shared,
        stem: function (s) { return 'Solve the system by <b>substitution</b>.' + sysTexN(s.e1, s.e2); },
        parts: [
          { id: '4a', outcome: 'RF9', level: 'BEG', make: function (r, s) {
            var W = [];
            if (Math.abs(s.isoX ? s.A : s.B) !== 1) W.push({ v: s.fv, root: r6((s.C - s.b) / s.k), code: 'u8t-distribute', hint: 'Multiply the bracket out fully: the ' + t(s.isoX ? s.A : s.B) + ' multiplies the constant ' + t(s.b) + ' too.' });
            var p = K.P.math('Substitute Equation 1 into Equation 2. Type the equation you get (it has only ' + t(s.fv) + ' in it).',
              ovChk([{ v: s.fv, root: s.froot }], { wrong: W, varHint: 'Replace ' + t(s.iv) + ' in Equation 2 with ' + t(s.expr) + ' — then only ' + t(s.fv) + ' is left.', identHint: 'Put ' + t(s.expr) + ' into <b>Equation 2</b> in place of ' + t(s.iv) + '.', bothHint: 'Replace ' + t(s.iv) + ' with ' + t('(' + s.expr + ')') + ' — then only ' + t(s.fv) + ' is left.', solvedHint: 'That is the value of ' + t(s.fv) + ' — type the equation right after substituting, e.g. ' + t(s.subEq) + '.' }),
              s.subEq, 'Equation 1 says ' + t(s.iv) + ' is the same as ' + t(s.expr) + ', so replace ' + t(s.iv) + ' in Equation 2 with ' + t('(' + s.expr + ')') + ':<br>' + t(s.subEq),
              ['Put ' + t('(' + s.expr + ')') + ' in place of ' + t(s.iv) + ' in Equation 2 — keep the brackets.'], 'substitute ' + s.e1 + ' into ' + s.e2, { keys: 'eq', placeholder: ' ' });
            p.bad = [s.fv + '=' + s.froot, s.e2].concat(W.length ? [s.fv + '=' + nT(W[0].root)] : []);
            return p;
          } },
          { id: '4b', outcome: 'RF9', level: 'BEG', make: function (r, s) {
            var W = [], wpt = function (f) { return s.isoX ? [s.m * f + s.b, f] : [f, s.m * f + s.b]; };
            var c0 = s.isoX ? s.A : s.B;
            if (Math.abs(c0) !== 1) W.push({ is: wpt((s.C - s.b) / s.k), code: 'u8t-distribute', hint: 'Multiply the bracket out fully: ' + t(c0 + '(' + s.expr + ')') + ' — the ' + t(c0) + ' multiplies ' + t(s.b) + ' too.' });
            W.push({ is: wpt((s.C + s.kc) / s.k), code: 'u8t-move-const', hint: 'Check the step where you move the constant to the other side: its sign changes.' });
            var exp = s.isoX ? T([[s.A * s.m, 'y'], [s.B, 'y']]).replace(/y([+-])/, 'y$1') : T([[s.A, 'x'], [s.B * s.m, 'x']]).replace(/x([+-])/, 'x$1');
            return pointPart('Solve the system. Give the solution as an ordered pair.', s.P, s.L, { wrong: W },
              t(s.subEq) + '<br>' + t(exp + (s.kc < 0 ? '' : '+') + s.kc + '=' + s.C) + '<br>' + t(T([[s.k, s.fv]]) + '=' + (s.C - s.kc)) + (s.k === 1 ? '' : ', so ' + t(s.fv + '=' + s.froot)) + '<br>' +
                'Back-substitute into Equation 1: ' + t(s.iv + '=' + rhsSubT(s.m, s.b, s.froot) + '=' + (s.isoX ? s.x0 : s.y0)) + '<br>Check in Equation 2: ' + t(subT(s.A, s.B, s.P) + '=' + s.C) + ' ✓. The solution is ' + ptt(s.P) + '.',
              ['Solve your equation from (a) for ' + t(s.fv) + '.', 'Then put that value into Equation 1 to find ' + t(s.iv) + '.'], 'solve by substitution ' + s.e1 + s.e2);
          } }] },
      { num: '5', outcome: 'RF9', shared: q5Shared,
        stem: function (s) { return 'Solve the system by <b>elimination</b>.' + sysTexN(gT(s.E[0].a, s.E[0].b, s.E[0].c), gT(s.E[1].a, s.E[1].b, s.E[1].c)); },
        parts: [
          { id: '5a', outcome: 'RF9', level: 'BEG', make: function (r, s) {
            var c1 = s.E[0].c, c2 = s.E[1].c, W = [], key = T([[s.Kc, s.keep]]) + '=' + s.C;
            if (s.add) W.push({ v: s.keep, root: r6((c1 - c2) / s.Kc), code: 'u8t-elim-rhs', hint: 'You added the left sides — add the right sides too: ' + t(c1 + '+' + par(c2)) + '.' });
            else {
              W.push({ v: s.keep, root: r6((c1 + c2) / s.Kc), code: 'u8t-elim-rhs', hint: 'You subtracted the left sides — subtract the right sides too: ' + t(c1 + '-' + par(c2)) + '.' });
              if (s.b1 + s.b2 !== 0) W.push({ v: s.keep, root: r6((c1 - c2) / (s.b1 + s.b2)), code: 'u8t-elim-sign', hint: 'Subtracting changes the sign of <b>every</b> term of Equation 2: ' + t(T([[s.b1, s.keep]]) + '-(' + T([[s.b2, s.keep]]) + ')=' + T([[s.b1 - s.b2, s.keep]])) + '.' });
            }
            var p = K.P.math('The ' + t(s.elim) + '-terms are ' + (s.add ? 'opposites' : 'the same') + '. ' + (s.add ? 'Add' : 'Subtract') + ' the equations to eliminate ' + t(s.elim) + '. What equation do you get?',
              ovChk([{ v: s.keep, root: s.kv }], { wrong: W, bothHint: 'The ' + t(s.elim) + '-terms didn’t cancel. ' + (s.add ? 'They are opposites, so <b>add</b>.' : 'They are the same, so <b>subtract</b>.'), varHint: 'Eliminate ' + t(s.elim) + ': the ' + t(s.keep) + '-terms should be left.', solvedHint: 'That is the value of ' + t(s.keep) + ' — type the equation you get right after ' + (s.add ? 'adding' : 'subtracting') + ', e.g. ' + t(key) + '.' }),
              key, (s.add ? 'Add' : 'Subtract') + ' the left sides and the right sides:<br>' + t('(' + gT(s.E[0].a, s.E[0].b, s.E[0].c).split('=')[0] + ')' + (s.add ? '+' : '-') + '(' + gT(s.E[1].a, s.E[1].b, s.E[1].c).split('=')[0] + ')=' + c1 + (s.add ? '+' : '-') + par(c2)) + '<br>' + t(key),
              [(s.add ? 'The ' + t(s.elim) + '-terms are opposites: add' : 'The ' + t(s.elim) + '-terms are the same: subtract') + ' the equations, left side and right side.', s.add ? 'Combine the ' + t(s.keep) + '-terms and the right sides.' : 'Subtracting changes the sign of every term of Equation 2.'], 'eliminate matching ' + key, { keys: 'eq', placeholder: ' ' });
            p.bad = W.map(function (w) { return T([[s.Kc, s.keep]]) + '=' + nT(Math.round(w.root * s.Kc)); }).concat([s.keep + '=' + s.kv]);
            return p;
          } },
          { id: '5b', outcome: 'RF9', level: 'BEG', make: function (r, s) {
            var c1 = s.E[0].c, c2 = s.E[1].c, wr = s.add ? (c1 - c2) / s.Kc : (c1 + c2) / s.Kc, E1 = s.E[0];
            var other = function (kv) { return s.keep === 'y' ? [(c1 - E1.b * kv) / E1.a, kv] : [kv, (c1 - E1.a * kv) / E1.b]; };
            return pointPart('Solve the system. Give the solution as an ordered pair.', s.P, s.E.map(function (e) { return std(e.a, e.b, e.c); }), { wrong: [{ is: other(wr), code: 'u8t-elim-rhs', hint: 'When you ' + (s.add ? 'add' : 'subtract') + ' the equations, ' + (s.add ? 'add' : 'subtract') + ' the right sides too.' }] },
              elimSol(s.E[0], s.E[1], s.P, s.elim, 1, 1), ['Use your equation from (a) to find ' + t(s.keep) + '.', 'Substitute it into either equation to find ' + t(s.elim) + '.'], 'solve elimination matching ' + s.E.map(function (e) { return [e.a, e.b, e.c]; }).join(';'));
          } }] },
      { num: '6', outcome: 'RF9', shared: q6Shared,
        stem: function (s) { return q6Text(s); },
        parts: [
          { id: '6', outcome: 'RF9', level: 'BEG', make: function (r, s) {
            var v = s.v, k1 = v[0] + '+' + v[1] + '=' + s.S, k2 = s.c === 'times' ? v[0] + '=' + s.k + v[1] : v[0] + '=' + v[1] + '+' + s.d;
            var T2 = s.c === 'times' ? [1, -s.k, 0] : [1, -1, -s.d];
            var W = s.c === 'times' ? [{ eq: v[1] + '=' + s.k + v[0], code: 'u8t-rel-rev', hint: t(v[0]) + ' is the larger number, so ' + t(v[0]) + ' is ' + s.k + ' times ' + t(v[1]) + ': ' + t(v[0] + '=' + s.k + v[1]) + '.' }, { eq: v[0] + '=' + v[1] + '+' + s.k, code: 'u8t-rel-op', hint: '“' + s.k + ' times” means multiply by ' + t(s.k) + ', not add it.' }, { eq: v[0] + '-' + v[1] + '=' + s.S, code: 'u8t-facts-swap', hint: t(s.S) + ' is the <b>sum</b>: add the numbers.' }]
              : [{ eq: v[1] + '=' + v[0] + '+' + s.d, code: 'u8t-rel-rev', hint: 'Who has more? ' + t(v[0]) + ' is the bigger one, so ' + t(v[0] + '=' + v[1] + '+' + s.d) + '.' }, { eq: v[0] + '=' + s.d + v[1], code: 'u8t-rel-op', hint: '“' + s.d + ' more than” means add ' + t(s.d) + ', not multiply by it.' }, { eq: v[0] + '-' + v[1] + '=' + s.S, code: 'u8t-facts-swap', hint: t(s.S) + ' is the <b>sum</b>: add.' }, { eq: v[0] + '+' + v[1] + '=' + s.d, code: 'u8t-facts-swap', hint: 'The two add to ' + t(s.S) + '; ' + t(s.d) + ' is how many <b>more</b>.' }];
            var nm = s.c === 'age' ? ['the sum of the ages', 'who is older'] : s.c === 'class' ? ['the number of students', 'how many more girls'] : s.c === 'times' ? ['the sum', 'the “times” fact'] : ['the sum', 'the “more than” fact'];
            return sysPart('Write a system of two equations for this situation. (Do not solve it.)', [[1, 1, -s.S], T2],
              { vars: v, keyTex: [k1, k2], names: nm, wrong: W, tips: [t(v[0]) + ' and ' + t(v[1]) + ' add to ' + s.S + '.', s.c === 'times' ? 'the larger is ' + s.k + ' times the smaller.' : 'the bigger one is ' + s.d + ' more than the other: add ' + s.d + ' to the smaller one.'] },
              cap(nm[0]) + ': ' + t(k1) + '<br>' + cap(nm[1]) + ': ' + t(k2) + (s.c === 'times' ? '' : ' (or ' + t(v[0] + '-' + v[1] + '=' + s.d) + ')') + '<br>(These give ' + t(v[0] + '=' + s.x) + ' and ' + t(v[1] + '=' + s.y) + '.)',
              ['One equation for the total (the sum), one for the comparison.', s.c === 'times' ? '“times” means multiply.' : '“more than” means add.'], 'translate ' + q6Text(s));
          } }] },
      { num: '7', outcome: 'RF9', shared: q7Shared,
        stem: function (s) { return 'You want to solve this system by <b>substitution</b> without making fractions.' + sysTexN(gT(s.E[0].a, s.E[0].b, s.E[0].c), gT(s.E[1].a, s.E[1].b, s.E[1].c)); },
        parts: [
          { id: '7', outcome: 'RF9', level: 'BEG', make: function (r, s) {
            var co = [s.E[0].a, s.E[0].b, s.E[1].a, s.E[1].b], nm = ['x', 'y', 'x', 'y'], eqn = [1, 1, 2, 2];
            var E = s.E[s.pos < 2 ? 0 : 1], v = nm[s.pos], isoT = v === 'y' ? 'y=' + T([[-E.a * E.b, 'x'], [E.c * E.b, '']]) : 'x=' + T([[-E.b, 'y'], [E.c, '']]);
            var O = [0, 1, 2, 3].map(function (i) {
              return { html: 'Isolate ' + t(nm[i]) + ' in Equation ' + eqn[i], right: i === s.pos, why: i === s.pos ? null : 'Its coefficient is ' + t(co[i]) + ', so isolating it means dividing by ' + t(Math.abs(co[i])) + ' — that makes fractions.', code: 'iso' };
            });
            var p = mc(r, 'Which variable should you isolate first?', O,
              'Look for a coefficient of ' + t('1') + ' or ' + t('-1') + ': ' + t(nm[s.pos]) + ' in Equation ' + eqn[s.pos] + ' has coefficient ' + t(co[s.pos]) + '. Isolating it takes one step and no fractions: ' + t(isoT) + '.',
              ['Find the variable whose coefficient is ' + t('1') + ' or ' + t('-1') + '.'], 'isolate which ' + co.join(','), true);
            p.input.options.forEach(function (o, i) { o.code = 'iso' + i; });
            return p;
          } }] },

      /* ======================= Progressing ======================= */
      { num: '8', outcome: 'RF9', shared: q8Shared,
        stem: function (s) { return 'Consider the system ' + t(s.n[0]) + ' and ' + t(s.n[1]) + '.'; },
        parts: [
          { id: '8a', outcome: 'RF9', level: 'PRG', make: function (r, s) {
            var A = s.L[0];
            var p = K.P.math('Rewrite ' + t(s.n[0]) + ' in slope-intercept form, ' + t('y=mx+b') + '.', siChk(A), si(A),
              t(s.n[0]) + '<br>' + (s.B === -1 ? t(T([[s.B, 'y']]) + '=' + T([[-s.A, 'x'], [s.C, '']])) + ' (move the ' + t('x') + '-term across: its sign changes)<br>' + t(si(A)) + ' (divide every term by ' + t('-1') + ': every sign changes)' : t(si(A)) + ' (move the ' + t('x') + '-term across: its sign changes)'),
              ['Move the ' + t('x') + '-term to the other side (its sign changes).', s.B === -1 ? 'Then divide every term by ' + t('-1') + '.' : 'Then ' + t('y') + ' is alone.'], 'rewrite ' + s.n[0], { keys: 'eq', placeholder: ' ' });
            p.bad = rearrWrongs(A).map(function (w) { return si(w.is); });
            return p;
          } },
          { id: '8b', outcome: 'RF9', level: 'PRG', make: function (r, s) {
            var a = mbTex(s.L[0]), sl = slopeOf(s.L[0]), st = function (L) { var m = fv(slopeOf(L)), b = fv(yInt(L)); return 'start at ' + ptt([0, b]) + ', then ' + (m > 0 ? 'up ' : 'down ') + t(Math.abs(m)) + ', right ' + t(1); };
            return sysGraph('Graph both equations on the grid (arrows on both ends).', s.L, [si(s.L[0]), s.n[1]], { wrong: [{ L: mbL([-sl[0], sl[1]], yInt(s.L[0])), code: 'u8t-gr-sign', hint: 'Your line for ' + t(s.n[0]) + ' goes the wrong way: its slope is ' + t(a.m) + '.' }, { L: mbL(-s.m2, s.b2), code: 'u8t-gr-sign', hint: 'Your line for ' + t(s.n[1]) + ' goes the wrong way: its slope is ' + t(s.m2) + '.' }] },
              t(si(s.L[0])) + ': ' + st(s.L[0]) + '.<br>' + t(s.n[1]) + ': ' + st(s.L[1]) + '.<br>Draw each line with arrows on both ends. They cross at ' + ptt(s.P) + '.',
              ['Use ' + t('y=mx+b') + ': plot the ' + t('y') + '-intercept ' + t('b') + ', then step with the slope ' + t('m') + ' (rise over run).', 'Put arrows on both ends of each line.'], 'graph system ' + s.n.join(','));
          } },
          { id: '8c', outcome: 'RF9', level: 'PRG', make: function (r, s) {
            return pointPart('State the solution of the system.', s.P, s.L, {},
              'The lines cross at ' + ptt(s.P) + '.<br>Check: ' + t(subT(s.A, s.B, s.P) + '=' + s.C) + ' ✓ and ' + t(rhsSubT(s.m2, s.b2, s.x0) + '=' + s.y0) + ' ✓.',
              ['Read the crossing point of your two lines, then check it in both equations.'], 'solution of graphed system ' + s.n.join(','));
          } }] },
      { num: '9', outcome: 'RF9', shared: function (r) { var k = r.sample(['one', 'none', 'inf'], 2); return { kinds: k, sys: k.map(function (kd) { return cls15(r, kd); }) }; },
        stem: 'Without graphing, decide whether each system has <b>one solution</b>, <b>no solution</b> or <b>infinitely many solutions</b>. First write the equation(s) in the form ' + t('y=mx+b') + '.',
        parts: [0, 1].map(function (i) {
          return { id: '9' + 'ab'[i], outcome: 'RF9', level: 'PRG', make: function (r, s) {
            var S = s.sys[i], kind = S.kind, a = mbTex(S.L1), b = mbTex(S.L2);
            var why = function (k) {
              if (kind === 'none') return k === 'inf' ? 'The slopes are equal, but the ' + t('y') + '-intercepts ' + t(a.b) + ' and ' + t(b.b) + ' are different: parallel lines that never meet.' : 'The slopes are equal (' + t(a.m) + '), so the lines can’t cross just once.';
              if (kind === 'inf') return k === 'none' ? 'Same slope <b>and</b> the same ' + t('y') + '-intercept (' + t(a.b) + '): it is the same line, so every point on it is a solution.' : 'Same slope and the same ' + t('y') + '-intercept: it is the same line, not two lines crossing once.';
              return 'The slopes are different (' + t(a.m) + ' and ' + t(b.m) + '), so the lines cross exactly once.';
            };
            var fields = [eqField(t(S.t1) + ' as ' + t('y=mx+b') + ':', 'First equation')], chks = [siChk(S.L1)], keys = [si(S.L1)];
            if (!S.si2) { fields.push(eqField(t(S.t2) + ' as ' + t('y=mx+b') + ':', 'Second equation')); chks.push(siChk(S.L2)); keys.push(si(S.L2)); }
            fields.push({ label: 'Number of solutions (one, none or infinitely many):', name: 'Number of solutions', mode: 'text', wide: true, placeholder: ' ' }); chks.push(kindChk(kind, why)); keys.push(KIND_KEY[kind]);
            var sol = t(S.t1) + ' → ' + t(si(S.L1)) + ': slope ' + t(a.m) + ', ' + t('y') + '-intercept ' + t(a.b) + '.<br>' + (S.si2 ? t(S.t2) + ': slope ' + t(b.m) + ', ' + t('y') + '-intercept ' + t(b.b) : t(S.t2) + ' → ' + t(si(S.L2)) + ': slope ' + t(b.m) + ', ' + t('y') + '-intercept ' + t(b.b)) + '.<br>' +
              (kind === 'one' ? 'Different slopes: the lines cross once — <b>one solution</b>.' : kind === 'none' ? 'Same slope, different ' + t('y') + '-intercepts: parallel lines — <b>no solution</b>.' : 'Same slope and the same ' + t('y') + '-intercept: the same line — <b>infinitely many solutions</b>.');
            var nEq = keys.length - 1;
            var p = fieldsPart(t(S.t1) + ' &ensp;and&ensp; ' + t(S.t2), fields, chks, keys,
              keys.slice(0, nEq).map(function (k) { return t(k); }).join(', ') + ' — <b>' + (kind === 'one' ? 'one solution' : kind === 'none' ? 'no solution' : 'infinitely many solutions') + '</b>', sol,
              ['Get ' + t('y') + ' by itself, then compare the slopes and the ' + t('y') + '-intercepts.', 'Different slopes: one solution. Same slope, different intercepts: none. Same slope and intercept: infinitely many.'], 'classify ' + S.t1 + ', ' + S.t2,
              { multi: function (W) { return nEq === 2 && W.length === 2 && W.indexOf(2) < 0 ? 'u8t-cls-eqs' : null; } });
            var other = KIND_KEY[kind === 'none' ? 'inf' : 'none'];
            p.bad = [keys.slice(0, nEq).concat([other])].concat(nEq === 2 ? [[keys[0], '', KIND_KEY[kind]]] : []);
            return p;
          } };
        }) },
      { num: '10', outcome: 'RF9', shared: q10Shared,
        stem: function (s) { return 'Solve the system by <b>substitution</b>. First isolate a variable whose coefficient is ' + t('1') + ' or ' + t('-1') + '.' + sysTexN(s.n[0], s.n[1]); },
        parts: [
          { id: '10a', outcome: 'RF9', level: 'PRG', make: function (r, s) {
            var W = s.slips.map(function (x) { return { v: x.v, root: x.root, code: 'u8t-iso-sign', hint: 'Check the signs when you isolate ' + t(s.v) + ' in Equation ' + (s.i + 1) + ': ' + t(s.iso) + '.' }; });
            var p = K.P.math('Isolate a variable, then substitute into the <b>other</b> equation. Type the equation you get (it has only one variable in it).',
              ovChk([{ v: 'x', root: s.P[0] }, { v: 'y', root: s.P[1] }], { wrong: W, identHint: 'Both variables cancelled because you substituted back into the same equation. Substitute into the <b>other</b> equation.', bothHint: 'Replace the variable you isolated with its expression (in brackets) — then only one variable is left.', solvedHint: 'That is a finished value — type the equation right after substituting, e.g. ' + t(s.subEq) + '.' }),
              s.subEq, 'Equation ' + (s.i + 1) + ' has ' + t(s.v) + ' with coefficient ' + t(s.v === 'y' ? s.E[s.i].b : s.E[s.i].a) + ': ' + t(s.iso) + '.<br>Substitute into Equation ' + (s.j + 1) + ': ' + t(s.subEq),
              ['Isolate the variable with coefficient ' + t('1') + ' or ' + t('-1') + ' — watch the signs.', 'Put its expression, in brackets, into the other equation.'], 'isolate and substitute ' + s.n.join(','), { keys: 'eq', placeholder: ' ' });
            p.bad = ['x=' + s.P[0], s.n[s.i], s.n[s.j]];
            return p;
          } },
          { id: '10b', outcome: 'RF9', level: 'PRG', make: function (r, s) {
            var Ej = s.E[s.j], cv = s.v === 'y' ? Ej.b : Ej.a, cw = s.v === 'y' ? Ej.a : Ej.b, k = cw + cv * s.p, wv = s.v === 'y' ? s.P[0] : s.P[1];
            var exp = s.v === 'y' ? T([[Ej.a, 'x'], [Ej.b * s.p, 'x']]).replace(/x([+-])/, 'x$1') : T([[Ej.a * s.p, 'y'], [Ej.b, 'y']]).replace(/y([+-])/, 'y$1');
            var kc = cv * s.q;
            return pointPart('Solve the system. Give the solution as an ordered pair.', s.P, s.L, { wrong: s.slips.map(function (x) { return { is: x.pt, code: 'u8t-iso-sign', hint: 'Check the signs when you isolate ' + t(s.v) + ': ' + t(s.iso) + '.' }; }) },
              'Isolate: ' + t(s.iso) + '<br>Substitute: ' + t(s.subEq) + '<br>' + t(exp + (kc < 0 ? '' : '+') + kc + '=' + Ej.c) + '<br>' + t(T([[k, s.w]]) + '=' + (Ej.c - kc)) + (k === 1 ? '' : ', so ' + t(s.w + '=' + wv)) +
                '<br>Back-substitute: ' + t(s.v + '=' + rhsSubT(s.p, s.q, wv).replace(/^\((-?\d+)\)/, '$1') + '=' + (s.v === 'y' ? s.P[1] : s.P[0])) + '<br>Check: ' + t(subT(s.E[0].a, s.E[0].b, s.P) + '=' + s.E[0].c) + ' ✓ and ' + t(subT(s.E[1].a, s.E[1].b, s.P) + '=' + s.E[1].c) + ' ✓. The solution is ' + ptt(s.P) + '.',
              ['Solve your equation from (a), then put the value into the isolated expression.', 'Check the pair in both original equations.'], 'solve isolate-first ' + s.n.join(','));
          } }] },
      { num: '11', outcome: 'RF9', shared: q11Shared,
        stem: function (s) { return 'Solve the system by <b>elimination</b>: eliminate ' + t(s.elim) + ' by multiplying <b>Equation 2</b> by a number first.' + sysTexN(gT(s.E[0].a, s.E[0].b, s.E[0].c), gT(s.E[1].a, s.E[1].b, s.E[1].c)); },
        parts: [
          { id: '11a', outcome: 'RF9', level: 'PRG', make: function (r, s) {
            var aP = Math.abs(s.P1), key = T([[s.Kc, s.keep]]) + '=' + s.C, c1 = s.E[0].c, c2 = s.E[1].c;
            var mChk = valChk(s.k, function (v) {
              if (near(Math.abs(v), aP)) return null;
              return { code: 'u8t-mult', hint: 'Equation 1 has ' + t(T([[s.P1, s.elim]])) + ' and Equation 2 has ' + t(T([[s.s2, s.elim]])) + ': multiply Equation 2 by ' + t(aP) + ' (or ' + t(-aP) + ') so the ' + t(s.elim) + '-terms are the same size.' };
            });
            var mChk2 = function (resp) { var v = numOf(resp); if (v != null && near(Math.abs(v), aP)) return ok(); return mChk(resp); };
            var W = [{ v: s.keep, root: r6((c1 + Math.sign(s.k) * c2) / s.Kc), code: 'u8t-rhs-unscaled', hint: 'Multiply <b>every</b> term of Equation 2 — the right side ' + t(c2) + ' too.' }];
            var p = fieldsPart('What do you multiply Equation 2 by? Then add or subtract the equations: what equation do you get?',
              [{ label: 'Multiply Equation 2 by:', name: 'Multiplier' }, eqField('Equation after adding or subtracting:', 'Equation')],
              [mChk2, ovChk([{ v: s.keep, root: s.kv }], { wrong: W, bothHint: 'The ' + t(s.elim) + '-terms didn’t cancel: after multiplying, they should be opposites (add) or the same (subtract).', varHint: 'You are eliminating ' + t(s.elim) + ', so the ' + t(s.keep) + '-terms should be left.', solvedHint: 'That is the value of ' + t(s.keep) + ' — type the equation right after adding or subtracting, e.g. ' + t(key) + '.' })],
              [String(s.k), key], '×' + t(s.k) + ' (or ×' + t(-s.k) + '), then ' + t(key),
              'Multiply Equation 2 by ' + t(s.k) + ': ' + t(gT(s.k * s.E[1].a, s.k * s.E[1].b, s.k * c2)) + ' — now the ' + t(s.elim) + '-terms are opposites.<br>Add it to Equation 1: ' + t(key) + '.<br>(Multiplying by ' + t(-s.k) + ' instead makes them the same; then subtract — same result.)',
              ['Make the ' + t(s.elim) + '-terms the same size: Equation 1 has ' + t(T([[s.P1, s.elim]])) + '.', 'Multiply <b>every</b> term of Equation 2, the right side too.'], 'multiply one ' + s.E.map(function (e) { return [e.a, e.b, e.c]; }).join(';'));
            p.bad = [[String(s.o1), key], [String(s.k), T([[s.Kc, s.keep]]) + '=' + (c1 + Math.sign(s.k) * c2)]].filter(function (b) { return Math.abs(Number(b[0])) !== aP || b[1] !== key; });
            return p;
          } },
          { id: '11b', outcome: 'RF9', level: 'PRG', make: function (r, s) {
            var c1 = s.E[0].c, c2 = s.E[1].c, wr = (c1 + Math.sign(s.k) * c2) / s.Kc, E1 = s.E[0];
            var other = function (kv) { return s.keep === 'x' ? [kv, (c1 - E1.a * kv) / E1.b] : [(c1 - E1.b * kv) / E1.a, kv]; };
            return pointPart('Solve the system. Give the solution as an ordered pair.', s.P, s.E.map(function (e) { return std(e.a, e.b, e.c); }), { wrong: [{ is: other(wr), code: 'u8t-rhs-unscaled', hint: 'When you multiply Equation 2, multiply its right side too.' }] },
              elimSol(s.E[0], s.E[1], s.P, s.elim, 1, s.k),
              ['Use your equation from (a) to find ' + t(s.keep) + '.', 'Substitute it into Equation 1 to find ' + t(s.elim) + '.'], 'solve multiply one ' + s.E.map(function (e) { return [e.a, e.b, e.c]; }).join(';'));
          } }] },
      { num: '12', outcome: 'RF9', shared: q12Shared,
        stem: function (s) { var C = s.C; return fill(C.txt, { p1: t(money(s.p[0])), p2: t(money(s.p[1])), N: t(s.N), V: t(money(s.V)) }) + ' Let ' + t(C.v[0]) + ' be the number of ' + C.names[0] + ' and ' + t(C.v[1]) + ' the number of ' + C.names[1] + '.'; },
        parts: [
          { id: '12a', outcome: 'RF9', level: 'PRG', make: function (r, s) {
            var v = s.C.v, k1 = v[0] + '+' + v[1] + '=' + s.N, k2 = T([[s.p[0], v[0]], [s.p[1], v[1]]]) + '=' + s.V;
            return sysPart('Write a system of two equations: one for the number of ' + s.C.word + ', one for the money.', [[1, 1, -s.N], [s.p[0], s.p[1], -s.V]],
              { vars: v, keyTex: [k1, k2], names: ['the number of ' + s.C.word, 'the money'], tips: ['the two counts add to ' + s.N + '.', 'price × number for each, adding to the total money.'],
                wrong: [{ eq: T([[s.p[0], v[0]], [s.p[1], v[1]]]) + '=' + s.N, code: 'u8t-rhs-count', hint: t(s.N) + ' is the number of ' + s.C.word + '. The money equation adds up <b>dollars</b>: its total is ' + t(money(s.V)) + '.' },
                  { eq: T([[s.p[1], v[0]], [s.p[0], v[1]]]) + '=' + s.V, code: 'u8t-price-swap', hint: 'Check which price goes with which letter: ' + t(v[0]) + ' counts the ' + s.C.names[0] + ', at ' + t(money(s.p[0])) + ' each.' },
                  { eq: v[0] + '+' + v[1] + '=' + s.V, code: 'u8t-no-prices', hint: 'In the money equation, multiply each count by its price.' }] },
              'Number of ' + s.C.word + ': ' + t(k1) + '<br>Money: ' + t(k2),
              ['One equation counts the ' + s.C.word + '; the other adds up the money (price × number).'], 'count value system ' + k1 + k2);
          } },
          { id: '12b', outcome: 'RF9', level: 'PRG', make: function (r, s) {
            var v = s.C.v, nm = s.C.names;
            return numsPart('Solve the system. How many of each were sold?', [{ label: cap(nm[0]) + ':', name: 'number of ' + nm[0] }, { label: cap(nm[1]) + ':', name: 'number of ' + nm[1] }],
              s.n, { sys: [[1, 1, -s.N], [s.p[0], s.p[1], -s.V]] },
              t(v[0] + '+' + v[1] + '=' + s.N) + ' and ' + t(T([[s.p[0], v[0]], [s.p[1], v[1]]]) + '=' + s.V) + '. Substitute ' + t(v[1] + '=' + s.N + '-' + v[0]) + ':<br>' + subsText(v, s.N, s.p[0], s.p[1], s.V, s.n[0], s.n[1]) + '<br>Check: ' + t(s.p[0] + '(' + s.n[0] + ')+' + s.p[1] + '(' + s.n[1] + ')=' + s.V) + ' ✓<br><b>' + s.n[0] + ' ' + nm[0] + ' and ' + s.n[1] + ' ' + nm[1] + '.</b>',
              ['Solve the count equation for one letter and substitute into the money equation (or eliminate).', 'Check both numbers in the money equation.'], 'solve count value ' + s.N + ',' + s.V + ',' + s.p);
          } }] },
      { num: '13', outcome: 'RF9', shared: q13Shared,
        stem: function (s) { var C = s.C, n = s.n; return C.lead + ' ' + C.days[0] + ' ' + plural(n[0][0], C.one[0], C.many[0]) + ' and ' + plural(n[0][1], C.one[1], C.many[1]) + ' ' + (C.verb === 'for' ? 'for' : 'sold for') + ' a total of ' + t(money(s.V[0])) + '. ' + C.days[1] + ' ' + plural(n[1][0], C.one[0], C.many[0]) + ' and ' + plural(n[1][1], C.one[1], C.many[1]) + ' ' + (C.verb === 'for' ? 'for' : 'sold for') + ' ' + t(money(s.V[1])) + '. Let ' + t(C.v[0]) + ' be the price of one ' + C.one[0] + ' and ' + t(C.v[1]) + ' the price of one ' + C.one[1] + ', in dollars.'; },
        parts: [
          { id: '13a', outcome: 'RF9', level: 'PRG', make: function (r, s) {
            var v = s.C.v, n = s.n, keys = [0, 1].map(function (i) { return T([[n[i][0], v[0]], [n[i][1], v[1]]]) + '=' + s.V[i]; });
            return sysPart('Write a system of two equations, one for each total.', [[n[0][0], n[0][1], -s.V[0]], [n[1][0], n[1][1], -s.V[1]]],
              { vars: v, keyTex: keys, names: ['the first total', 'the second total'], tips: ['(number of ' + s.C.many[0] + ') × ' + v[0] + ' + (number of ' + s.C.many[1] + ') × ' + v[1] + ' = ' + s.V[0] + '.', '(number of ' + s.C.many[0] + ') × ' + v[0] + ' + (number of ' + s.C.many[1] + ') × ' + v[1] + ' = ' + s.V[1] + '.'],
                wrong: [0, 1].map(function (i) { return { eq: T([[n[i][1], v[0]], [n[i][0], v[1]]]) + '=' + s.V[i], code: 'u8t-count-swap', hint: 'Check which count goes with which price: ' + t(v[0]) + ' is the price of one ' + s.C.one[0] + '.' }; }).concat([{ eq: T([[n[0][0], v[0]], [n[1][0], v[1]]]) + '=' + s.V[0], code: 'u8t-count-swap', hint: 'Each equation uses the two counts from <b>one</b> purchase.' }]) },
              keys.map(function (k) { return t(k); }).join('<br>') + '<br>(number × price for each item, adding to the total)',
              ['Each total = (how many of the first item) × its price + (how many of the second) × its price.'], 'two purchases system ' + keys.join(','));
          } },
          { id: '13b', outcome: 'RF9', level: 'PRG', make: function (r, s) {
            var n = s.n, v = s.C.v, E1 = { a: n[0][0], b: n[0][1], c: s.V[0] }, E2 = { a: n[1][0], b: n[1][1], c: s.V[1] };
            /* eliminate the variable whose coefficients divide; multiply the smaller one */
            var elim = (n[0][0] % n[1][0] === 0 || n[1][0] % n[0][0] === 0) ? 0 : 1, a1 = n[0][elim], a2 = n[1][elim];
            var m1 = a1 >= a2 ? 1 : a2 / a1, m2 = a1 >= a2 ? a1 / a2 : 1;
            return numsPart('Solve the system. Find both prices.', [{ label: 'One ' + s.C.one[0] + ':', name: 'price of one ' + s.C.one[0], before: '$' }, { label: 'One ' + s.C.one[1] + ':', name: 'price of one ' + s.C.one[1], before: '$' }],
              s.p, { money: true, sys: [[n[0][0], n[0][1], -s.V[0]], [n[1][0], n[1][1], -s.V[1]]] },
              elimSol(E1, E2, s.p, v[elim], m1, m2, v) + '<br><b>' + cap(s.C.one[0]) + ' $' + s.p[0] + ', ' + s.C.one[1] + ' $' + s.p[1] + '.</b>',
              ['Multiply one equation so a pair of coefficients matches, then subtract.', 'Check both prices in both totals.'], 'solve two purchases ' + n.join(';') + s.V);
          } }] },

      /* ======================= Mastery ======================= */
      { num: '14', outcome: 'RF9', shared: q14Shared,
        stem: function (s) { return 'Solve the system by <b>elimination</b>. You will need to multiply <b>both</b> equations.' + sysTexN(gT(s.E[0].a, s.E[0].b, s.E[0].c), gT(s.E[1].a, s.E[1].b, s.E[1].c)); },
        parts: [
          { id: '14a', outcome: 'RF9', level: 'MAS', make: function (r, s) {
            var E = s.E, A1 = E[0].a, A2 = E[1].a, B1 = E[0].b, B2 = E[1].b, gy = gcd(B1, B2), my = [Math.abs(B2) / gy, Math.abs(B1) / gy];
            var cur = [];
            var pairOk = function () { var k1 = numOf(cur[0]), k2 = numOf(cur[1]); if (k1 == null || k2 == null || !k1 || !k2) return null; return near(Math.abs(k1 * A1), Math.abs(k2 * A2)) || near(Math.abs(k1 * B1), Math.abs(k2 * B2)); };
            var k1Chk = function (resp) { var s0 = String(resp == null ? '' : resp).trim(); if (!s0) return form('empty', 'Type a number.'); if (numOf(s0) == null) return form('notnumber', 'Type a single number.'); var pk = pairOk(); return pk === false ? wrong('u8t-mult', 'Choose multipliers that make the ' + t('x') + '-coefficients (or the ' + t('y') + '-coefficients) the same size: e.g. Equation 1 × ' + t(my[0]) + ' and Equation 2 × ' + t(my[1]) + ' make ' + t(T([[B1 * my[0], 'y']])) + ' and ' + t(T([[B2 * my[1], 'y']])) + '.') : ok(); };
            var k2Chk = function (resp) { var s0 = String(resp == null ? '' : resp).trim(); if (!s0) return form('empty', 'Type a number.'); if (numOf(s0) == null) return form('notnumber', 'Type a single number.'); return ok(); };
            var Ky = A1 * my[0] + A2 * my[1], Cy = E[0].c * my[0] + E[1].c * my[1], key = T([[Ky, 'x']]) + '=' + Cy;
            var W = [{ v: 'x', root: r6((E[0].c + E[1].c) / Ky), code: 'u8t-rhs-unscaled', hint: 'Multiply <b>every</b> term — the right sides too.' }, { v: 'x', root: r6((E[0].c * my[0] + E[1].c) / Ky), code: 'u8t-rhs-unscaled', hint: 'Multiply <b>every</b> term of Equation 2 — its right side too.' }, { v: 'x', root: r6((E[0].c + E[1].c * my[1]) / Ky), code: 'u8t-rhs-unscaled', hint: 'Multiply <b>every</b> term of Equation 1 — its right side too.' }];
            var inner = allChk([k1Chk, k2Chk, ovChk([{ v: 'x', root: s.P[0] }, { v: 'y', root: s.P[1] }], { wrong: W, bothHint: 'After multiplying, a pair of terms should be opposites (add) or the same (subtract), so that one variable is gone.', solvedHint: 'That is a finished value — type the equation right after adding or subtracting, e.g. ' + t(key) + '.' })], ['Equation 1 ×', 'Equation 2 ×', 'Equation']);
            var p = { prompt: 'What do you multiply each equation by? Then add or subtract: what equation do you get?', input: { type: 'fields', fields: [{ label: 'Multiply Equation 1 by:', name: 'Equation 1 ×' }, { label: 'Multiply Equation 2 by:', name: 'Equation 2 ×' }, eqField('Equation after adding or subtracting:', 'Equation')] },
              check: function (resp) { cur = resp || []; return inner(resp); }, key: [String(my[0]), String(my[1]), key],
              answer: 'e.g. ×' + t(my[0]) + ' and ×' + t(my[1]) + ', then ' + t(key) + ' (other choices work too)',
              solution: 'To eliminate ' + t('y') + ': the ' + t('y') + '-coefficients are ' + t(B1) + ' and ' + t(B2) + '. Multiply Equation 1 by ' + t(my[0]) + ' and Equation 2 by ' + t(my[1]) + ':<br>' + t(gT(A1 * my[0], B1 * my[0], E[0].c * my[0])) + ' &nbsp; and &nbsp; ' + t(gT(A2 * my[1], B2 * my[1], E[1].c * my[1])) + '<br>The ' + t('y') + '-terms are opposites, so add: ' + t(key) + '.<br>(Eliminating ' + t('x') + ' instead works too: multiply so the ' + t('x') + '-coefficients match, then subtract.)',
              hints: ['Pick a number both ' + t('y') + '-coefficients go into (or both ' + t('x') + '-coefficients), then multiply each equation to reach it.', 'Multiply every term, the right sides too.'], text: 'multiply both ' + E.map(function (e) { return [e.a, e.b, e.c]; }).join(';') };
            p.bad = [[String(A1), String(A2), key], [String(my[0]), String(my[1]), T([[Ky, 'x']]) + '=' + (E[0].c + E[1].c)]].filter(function (b) { var k1 = Number(b[0]), k2 = Number(b[1]); return !(near(Math.abs(k1 * A1), Math.abs(k2 * A2)) || near(Math.abs(k1 * B1), Math.abs(k2 * B2))) || b[2] !== key; });
            return p;
          } },
          { id: '14b', outcome: 'RF9', level: 'MAS', make: function (r, s) {
            var E = s.E, gy = gcd(E[0].b, E[1].b), my = [Math.abs(E[1].b) / gy, Math.abs(E[0].b) / gy], Ky = E[0].a * my[0] + E[1].a * my[1];
            var xw = (E[0].c + E[1].c) / Ky;
            return pointPart('Solve the system. Give the solution as an ordered pair.', s.P, E.map(function (e) { return std(e.a, e.b, e.c); }), { wrong: [{ is: [xw, (E[0].c - E[0].a * xw) / E[0].b], code: 'u8t-rhs-unscaled', hint: 'When you multiply an equation, multiply its right side too.' }] },
              elimSol(E[0], E[1], s.P, 'y', my[0], my[1]), ['Use your equation from (a), then substitute back into Equation 1.', 'Check the pair in both equations.'], 'solve multiply both ' + E.map(function (e) { return [e.a, e.b, e.c]; }).join(';'));
          } }] },
      { num: '15', outcome: 'RF9',
        stem: 'Find the missing value.',
        parts: [
          { id: '15a', outcome: 'RF9', level: 'MAS', make: function (r) {
            if (r.chance(0.5)) {   /* Ryan's slip: Ax + y = C and y = kx + b */
              var o = find(function () { return { A: r.int(2, 5) * r.pick([1, -1]), C: nz(r, -9, 9), b: nz(r, -6, 6) }; }, function (o) { return o.b !== o.C; }, { A: 2, C: 7, b: 1 });
              var k = -o.A, e1 = gT(o.A, 1, o.C), e2 = 'y=kx' + (o.b < 0 ? '' : '+') + o.b;
              var p = K.P.math('The system ' + t(e1) + ' and ' + t(e2) + ' has <b>no solution</b>. What is the value of ' + t('k') + '?',
                valChk(k, function (v) { if (near(v, o.A)) return { code: 'u8t-k-sign', hint: 'Rewrite ' + t(e1) + ' as ' + t('y=mx+b') + ': moving ' + t(T([[o.A, 'x']])) + ' across changes its sign.' }; if (near(v, -o.C) || near(v, o.C)) return { code: 'u8t-k-copy', hint: 'No solution needs the same <b>slope</b> — ' + t('k') + ' is the slope of the second line.' }; return null; }),
                String(k), 'Rewrite: ' + t(e1) + ' → ' + t(mbT(-o.A, o.C)) + ': slope ' + t(-o.A) + ', ' + t('y') + '-intercept ' + t(o.C) + '.<br>No solution means parallel lines: the <b>same slope</b> and different intercepts. So ' + t('k=' + k) + ' (and the intercepts ' + t(o.C) + ' and ' + t(o.b) + ' are different ✓).',
                ['No solution: same slope, different ' + t('y') + '-intercepts.', 'Write ' + t(e1) + ' as ' + t('y=mx+b') + ' first.'], 'k no solution ' + e1 + e2, { keys: 'slope', before: t('k=') });
              p.bad = [String(o.A), String(-o.C === k ? o.C : -o.C)].filter(function (b) { return b !== String(k); });
              return p;
            }
            /* L2 #11: kx + sy = C1 and ax + y = c (scaled y-coefficient) */
            var q = find(function () { return { a: r.int(2, 5), sc: r.pick([2, 3]), c: nz(r, -6, 8), C1: nz(r, -12, 15) }; }, function (q) { return q.C1 !== q.sc * q.c && q.a !== q.sc; }, { a: 3, sc: 2, c: 4, C1: 10 });
            var k2 = q.sc * q.a, f1 = 'kx+' + q.sc + 'y=' + q.C1, f2 = gT(q.a, 1, q.c);
            var p2 = K.P.math('The system ' + t(f1) + ' and ' + t(f2) + ' has <b>no solution</b>. What is the value of ' + t('k') + '?',
              valChk(k2, function (v) { if (near(v, q.a)) return { code: 'u8t-k-copy', hint: 'The ' + t('y') + '-coefficient of the first equation is ' + t(q.sc) + ' times the second’s, so ' + t('k') + ' must be ' + t(q.sc) + ' times ' + t(q.a) + '.' }; if (near(v, q.a / q.sc)) return { code: 'u8t-k-mult', hint: 'The first equation is “' + t(q.sc) + ' times bigger”: multiply ' + t(q.a) + ' by ' + t(q.sc) + ', don’t divide.' }; if (near(v, -k2)) return { code: 'u8t-k-sign', hint: 'Check the sign: the slopes must be equal, sign included.' }; return null; }),
              String(k2), 'Multiply ' + t(f2) + ' by ' + t(q.sc) + ': ' + t(gT(k2, q.sc, q.sc * q.c)) + '. For the same slope the ' + t('x') + '-terms must match too: ' + t('k=' + k2) + '.<br>Then the left sides are the same but the right sides, ' + t(q.C1) + ' and ' + t(q.sc * q.c) + ', are different: parallel lines, <b>no solution</b>.<br>(Or: slopes ' + t('-\\frac{k}{' + q.sc + '}') + ' and ' + t(-q.a) + ' are equal when ' + t('k=' + k2) + '.)',
              ['No solution: same slope, different intercepts.', 'Compare the ' + t('y') + '-coefficients: the first is ' + t(q.sc) + ' times the second.'], 'k no solution ' + f1 + f2, { keys: 'slope', before: t('k=') });
            p2.bad = [String(q.a), String(-k2)];
            return p2;
          } },
          { id: '15b', outcome: 'RF9', level: 'MAS', make: function (r) {
            if (r.chance(0.5)) {   /* L2 #15: Ax + By = c and y = mx + b */
              var o = find(function () { return { m: nz(r, -4, 4), b: nz(r, -6, 6), sc: r.pick([2, 3, -2, -3]) }; }, function (o) { var c = o.sc * o.b; return Math.abs(c) <= 30 && Math.abs(c) !== Math.abs(o.b) && Math.abs(c) !== 0; }, { m: 2, b: -3, sc: -2 });
              /* show A x + B y = c with the x-coefficient positive */
              var Ax = -o.sc * o.m, By = o.sc, c = o.sc * o.b; if (Ax < 0) { Ax = -Ax; By = -By; c = -c; }
              var e1 = T([[Ax, 'x'], [By, 'y']]) + '=c', e2 = mbT(o.m, o.b), f = By;   // e1 is f × (y - mx = b) rearranged
              var p = K.P.math('The system ' + t(e1) + ' and ' + t(e2) + ' has <b>infinitely many solutions</b>. What is the value of ' + t('c') + '?',
                valChk(c, function (v) { if (near(v, o.b)) return { code: 'u8t-c-copy', hint: 'The two equations must be the <b>same line</b>: rewrite ' + t(e2) + ' with the ' + t('x') + ' and ' + t('y') + ' on the left, then multiply it to match ' + t(T([[Ax, 'x'], [By, 'y']])) + '.' }; if (near(v, -c)) return { code: 'u8t-k-sign', hint: 'Check the sign: multiply the whole equation, the constant too, by the same number.' }; if (near(v, -o.b)) return { code: 'u8t-k-copy', hint: 'Multiply the constant too: the left side was multiplied by ' + t(Math.abs(f)) + '.' }; return null; }),
                String(c), t(e2) + ' → ' + t(gT(-o.m, 1, o.b)) + '.<br>Multiply every term by ' + t(f) + ': ' + t(gT(-o.m * f, f, o.b * f)) + '. This must be the same as ' + t(e1) + ', so ' + t('c=' + c) + '.<br>Check: ' + t(T([[Ax, 'x'], [By, 'y']]) + '=' + c) + ' → ' + t(e2) + ', the same line ✓.',
                ['Infinitely many solutions means the <b>same line</b>.', 'Write ' + t(e2) + ' with ' + t('x') + ' and ' + t('y') + ' on the left, then multiply it to match.'], 'c infinitely many ' + e1 + e2, { keys: 'slope', before: t('c=') });
              p.bad = [String(o.b), String(-c)].filter(function (b) { return b !== String(c); });
              return p;
            }
            /* L2 #10: ax + ky = c and (sa)x + (sb)y = sc */
            var q = find(function () { return { a: r.int(1, 5), b: r.int(1, 5) * r.pick([1, -1]), c: nz(r, -9, 12), sc: r.pick([2, 3]) }; }, function (q) { return gcd(gcd(q.a, q.b), q.c) === 1 && Math.abs(q.b) !== q.a; }, { a: 3, b: 2, c: 9, sc: 2 });
            var f1 = q.a === 1 ? 'x+ky=' + q.c : q.a + 'x+ky=' + q.c, f2 = gT(q.sc * q.a, q.sc * q.b, q.sc * q.c);
            var p2 = K.P.math('The system ' + t(f1) + ' and ' + t(f2) + ' has <b>infinitely many solutions</b>. What is the value of ' + t('k') + '?',
              valChk(q.b, function (v) { if (near(v, q.sc * q.b)) return { code: 'u8t-k-copy', hint: 'The second equation is ' + t(q.sc) + ' times the first, so ' + t('k') + ' is ' + t(q.sc * q.b) + ' <b>divided</b> by ' + t(q.sc) + '.' }; if (near(v, q.sc * q.sc * q.b)) return { code: 'u8t-k-mult', hint: 'Divide by ' + t(q.sc) + ', don’t multiply: the second equation is ' + t(q.sc) + ' times the first.' }; if (near(v, -q.b)) return { code: 'u8t-k-sign', hint: 'Check the sign of ' + t('k') + '.' }; return null; }),
              String(q.b), 'Infinitely many solutions: the same line, so the second equation is a multiple of the first. Compare: ' + t(q.sc * q.a + '\\div ' + q.a + '=' + q.sc) + ' and ' + t(q.sc * q.c + '\\div ' + par(q.c) + '=' + q.sc) + ', so the second is ' + t(q.sc) + ' times the first.<br>Then ' + t(q.sc + 'k=' + q.sc * q.b) + ', so ' + t('k=' + q.b) + '.',
              ['Infinitely many solutions means the same line: one equation is a multiple of the other.', 'Find the multiplier from the ' + t('x') + '-terms (or the constants).'], 'k infinitely many ' + f1 + f2, { keys: 'slope', before: t('k=') });
            p2.bad = [String(q.sc * q.b), String(-q.b)];
            return p2;
          } }] },
      { num: '16', outcome: 'RF9', shared: q16Shared,
        stem: function (s) {
          var lhs = '(' + T([[s.a, 'x'], [s.b1, 'y']]) + ')-(' + T([[s.a, 'x'], [s.b2, 'y']]) + ')=' + nT(s.c1) + '-' + par(s.c2);
          var l4 = T([[s.a, 'x']]) + (s.b1 < 0 ? '-' : '+') + (Math.abs(s.b1) === 1 ? '' : Math.abs(s.b1)) + '(' + nT(s.yw) + ')=' + nT(s.c1) + '\\ \\Rightarrow\\ x=' + xwT(s.xwF);
          return s.who[0] + ' solved this system by elimination. ' + s.who[1] + ' answer is wrong.' + sysTexN(s.n[0], s.n[1]) +
            '<table style="margin:4px auto"><tr><td style="padding:2px 10px;color:#6a7182">Line 1</td><td>' + t(lhs) + '</td></tr><tr><td style="padding:2px 10px;color:#6a7182">Line 2</td><td>' + t(T([[s.sw, 'y']]) + '=' + nT(s.c1 - s.c2)) + '</td></tr><tr><td style="padding:2px 10px;color:#6a7182">Line 3</td><td>' + t('y=' + nT(s.yw)) + '</td></tr><tr><td style="padding:2px 10px;color:#6a7182">Line 4</td><td>' + t(l4) + '</td></tr></table>';
        },
        parts: [
          { id: '16a', outcome: 'RF9', level: 'MAS', make: function (r, s) {
            var right = T([[s.b1, 'y']]) + '-(' + T([[s.b2, 'y']]) + ')=' + T([[s.b1 - s.b2, 'y']]);
            return mc(r, 'Which line has the first error, and why?', [
              { html: '<b>Line 2.</b> Subtracting changes the sign of <b>every</b> term of the second equation: ' + t(right) + ', not ' + t(T([[s.sw, 'y']])) + '.', right: true },
              { html: '<b>Line 1.</b> The equations should be added, not subtracted.', why: 'Subtracting is the right move: the ' + t('x') + '-terms are the same, so subtracting cancels ' + t('x') + '. The slip is in combining the ' + t('y') + '-terms.' },
              { html: '<b>Line 4.</b> ' + t('y') + ' should be substituted into the second equation, not the first.', why: 'Either equation works for substituting back. The mistake happens earlier, when the ' + t('y') + '-terms are combined.' },
              { html: '<b>No line is wrong.</b> The answer just isn’t a whole number.', why: 'Check it in the second equation: it doesn’t work. A solution must make <b>both</b> equations true, so some line is wrong.' }],
              'Line 2 is wrong. Subtracting the whole second equation changes the sign of every term in it: ' + t(right) + ' (not ' + t(T([[s.sw, 'y']])) + '), while ' + t(nT(s.c1) + '-' + par(s.c2) + '=' + nT(s.c1 - s.c2)) + ' is right.',
              ['Check each line: subtract term by term, with the signs.'], 'find the elimination error ' + s.n.join(','));
          } },
          { id: '16b', outcome: 'RF9', level: 'MAS', make: function (r, s) {
            var d = s.b1 - s.b2;
            return pointPart('Give the correct solution.', s.P, s.L, { wrong: [{ is: [s.xw, s.yw], code: 'u8t-elim-sign', hint: 'That is the student’s answer. Redo Line 2: ' + t(T([[s.b1, 'y']]) + '-(' + T([[s.b2, 'y']]) + ')') + '.' }] },
              t('(' + T([[s.a, 'x'], [s.b1, 'y']]) + ')-(' + T([[s.a, 'x'], [s.b2, 'y']]) + ')=' + nT(s.c1) + '-' + par(s.c2)) + '<br>' + t(T([[d, 'y']]) + '=' + nT(s.c1 - s.c2)) + ', so ' + t('y=' + s.y0) + '<br>' +
                t(T([[s.a, 'x']]) + (s.b1 < 0 ? '-' : '+') + (Math.abs(s.b1) === 1 ? '' : Math.abs(s.b1)) + '(' + nT(s.y0) + ')=' + nT(s.c1)) + ', so ' + t(T([[s.a, 'x']]) + '=' + nT(s.c1 - s.b1 * s.y0)) + ' and ' + t('x=' + s.x0) + '.' +
                '<br>Solution: ' + ptt(s.P) + '. Check: ' + t(subT(s.a, s.b2, s.P) + '=' + nT(s.c2)) + ' ✓',
              ['Subtract the equations again, carefully with the signs of the ' + t('y') + '-terms.'], 'correct solution after error ' + s.n.join(','));
          } }] },
      { num: '17', outcome: 'RF9', shared: q17Shared,
        stem: function (s) { var C = s.C; return C.intro + ' <b>' + C.A + '</b>: ' + fill(C.aTxt, { a: t(money(s.a)) }) + '. <b>' + C.B + '</b>: ' + fill(C.bTxt, { F: t(money(s.F)), b: t(money(s.b)) }) + '. Let ' + t(C.v) + ' be ' + C.defn + ' and ' + t('C') + ' the total cost in dollars.'; },
        parts: [
          { id: '17a', outcome: 'RF9', level: 'MAS', make: function (r, s) {
            var C = s.C, v = [C.v, 'C'], eqs = ['C=' + s.a + C.v, 'C=' + s.F + '+' + s.b + C.v], Tg = [[s.a, -1, 0], [s.b, -1, s.F]];
            var chkA = eqChk(Tg[0], v, [{ eq: 'C=' + s.a + '+' + C.v, code: 'u8t-fee-rate', hint: 'The rate multiplies ' + t(C.v) + ': ' + t(money(s.a)) + ' for each ' + C.one + '.' }]);
            var chkB = eqChk(Tg[1], v, [{ eq: 'C=' + s.b + '+' + s.F + C.v, code: 'u8t-fee-rate', hint: 'The fixed fee is added once; the rate multiplies ' + t(C.v) + '.' }, { eq: 'C=' + s.b + C.v, code: 'u8t-no-fee', hint: 'Don’t forget the fixed fee, ' + t(money(s.F)) + '.' }, { eq: 'C=' + (s.F + s.b) + C.v, code: 'u8t-fee-rate-both', hint: 'The fee is paid once, not for every ' + C.one + ': ' + t('C=' + s.F + '+' + s.b + C.v) + '.' }]);
            var p = fieldsPart('Write an equation for the total cost ' + t('C') + ' of each plan.', [eqField(C.A + ':', C.A, v), eqField(C.B + ':', C.B, v)],
              [chkA, chkB], eqs, C.A + ': ' + t(eqs[0]) + '<br>' + C.B + ': ' + t(eqs[1]),
              C.A + ': ' + t(eqs[0]) + ' (' + t(money(s.a)) + ' for each ' + C.one + ')<br>' + C.B + ': ' + t(eqs[1]) + ' (the ' + t(money(s.F)) + ' fee once, plus ' + t(money(s.b)) + ' for each ' + C.one + ')',
              ['Cost = fixed fee + rate × ' + t(C.v) + '. ' + C.A + ' has no fee.'], 'cost equations ' + eqs.join(','),
              { pre: function (resp) { var a = Ln.read(String(resp[0] || ''), v), b = Ln.read(String(resp[1] || ''), v); return a.ok && b.ok && Ln.same([a.a, a.b, a.c], Tg[1]) && Ln.same([b.a, b.b, b.c], Tg[0]) ? form('u8t-eq-boxes', 'Both equations are right, but they are in each other’s boxes.') : null; } });
            p.bad = [[eqs[0], 'C=' + s.b + C.v], [eqs[0], 'C=' + (s.F + s.b) + C.v], [eqs[1], eqs[0]]];
            return p;
          } },
          { id: '17b', outcome: 'RF9', level: 'MAS', make: function (r, s) {
            var C = s.C;
            return numsPart('Solve the system. For how many ' + C.vw + ' do the two plans cost the same, and what is that cost?', [{ label: 'Number of ' + C.vw + ':', name: 'number of ' + C.vw }, { label: 'Cost:', name: 'cost', before: '$' }],
              [s.X, s.Cst], { sys: [[s.a, -1, 0], [s.b, -1, s.F]], swapHint: 'The first box is the number of ' + C.vw + '; the second is the cost.', wrong: [{ v: [s.F / s.a, s.F], code: 'u8t-no-fee', hint: 'Set the two costs equal: ' + t(s.a + C.v + '=' + s.F + '+' + s.b + C.v) + '.' }] },
              'Both equations give ' + t('C') + ', so set them equal (substitution):<br>' + t(s.a + C.v + '=' + s.F + '+' + s.b + C.v) + '<br>' + t((s.a - s.b) + C.v + '=' + s.F) + ', so ' + t(C.v + '=' + s.X) + '.<br>' + t('C=' + s.a + '(' + s.X + ')=' + s.Cst) + '. At <b>' + s.X + ' ' + C.vw + '</b> both plans cost <b>$' + s.Cst + '</b> — the point ' + ptt([s.X, s.Cst]) + ' where the two lines cross.',
              ['Both expressions equal ' + t('C') + ', so set them equal to each other.', 'Then put your ' + t(C.v) + ' into either equation to get the cost.'], 'break-even ' + s.a + ',' + s.F + ',' + s.b);
          } },
          { id: '17c', outcome: 'RF9', level: 'MAS', make: function (r, s) {
            var C = s.C, cA = s.a * s.N, cB = s.F + s.b * s.N, best = cA < cB ? 0 : 1, names = [C.A, C.B];
            var p = fieldsPart('Which plan is cheaper for ' + s.N + ' ' + (s.N === 1 ? C.one : C.vw) + '? Give both costs, then the cheaper plan.',
              [{ label: C.A + ' cost:', name: C.A + ' cost', before: '$' }, { label: C.B + ' cost:', name: C.B + ' cost', before: '$' }, { label: 'Cheaper plan (' + C.A + ' or ' + C.B + '):', name: 'Cheaper plan', mode: 'text', wide: true, placeholder: ' ' }],
              [valChk(cA, function () { return { code: 'u8t-cost', hint: 'Substitute ' + t(C.v + '=' + s.N) + ' into ' + t('C=' + s.a + C.v) + '.' }; }), valChk(cB, function (v) { return near(v, (s.F + s.b) * s.N) ? { code: 'u8t-fee-rate-both', hint: 'The fee is paid once: ' + t(s.F + '+' + s.b + '(' + s.N + ')') + '.' } : { code: 'u8t-cost', hint: 'Substitute ' + t(C.v + '=' + s.N) + ' into ' + t('C=' + s.F + '+' + s.b + C.v) + '.' }; }), pickChk(names, best)],
              [String(cA), String(cB), names[best]], C.A + ' ' + t(money(cA)) + ', ' + C.B + ' ' + t(money(cB)) + ' — <b>' + names[best] + '</b>',
              C.A + ': ' + t(s.a + '(' + s.N + ')=' + money(cA)) + '<br>' + C.B + ': ' + t(s.F + '+' + s.b + '(' + s.N + ')=' + money(cB)) + '<br><b>' + names[best] + '</b> is cheaper. This fits the break-even point: below ' + s.X + ' ' + C.vw + ' ' + C.A + ' costs less; above it ' + C.B + ' costs less (its fee is spread over more ' + C.vw + ').',
              ['Substitute ' + t(C.v + '=' + s.N) + ' into both equations and compare.'], 'cheaper plan ' + s.a + ',' + s.F + ',' + s.b + ',' + s.N);
            p.bad = [[String(cA), String(cB), names[1 - best]]].concat((s.F + s.b) * s.N !== cB ? [[String(cA), String((s.F + s.b) * s.N), names[best]]] : []);
            return p;
          } }] }
    ]
  });
})(window);
