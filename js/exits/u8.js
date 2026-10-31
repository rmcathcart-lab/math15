/* Math 15 · Unit 8 (Systems of Linear Equations: graphing, classifying, substitution, elimination, word problems) — exit
 * slips for Lessons 1–8 (u8l1x … u8l8x), written in test mode. All questions are RF9 (Ryan's tags). No calculator (Ryan's
 * Unit 8 paper tests say "No calculator"), so every number stays friendly.
 * Each slip is Ryan's own Math 15 exit slip for that lesson (his older exit-slip app, Versions A and B), turned into
 * generators: the same questions, skills, outcomes and levels (his tags), with his Version A and B numbers and graphs among
 * the possible values. Every part has a key built from the generated values, a worked solution, hints, and `bad` answers
 * with u8x- codes (labels and partial-credit decisions below). Graphs are drawn with HW.graph like the 10C Unit 8 slips
 * (solid blue and dashed red lines, as in his slips); graphing uses the graph pad; solutions are typed as ordered pairs.
 * Changes from his slips:
 *  - One short Mastery question was added where his slip had none, at Math 15 difficulty, taken from the lesson's own
 *    hardest assignment items: L1 rearrange a standard-form equation, then solve by graphing (Q10, Ex. 3 and 5); L3 fix a
 *    student's mistake in Step 2 and give the correct solution ("find and fix an error"); L4 a number word problem solved
 *    by isolating first (Q6); L5 a boat/current or "twice a number" problem by elimination (Q8–9); L6 multiply both
 *    equations (Q4); L7 a mixture problem (Q9–10). L2 and L8 already had one.
 *  - L1 Q2 (his MC "which graph shows the system") became the graph pad: graph both lines, then state the solution (the
 *    lesson's core skill; the checker diagnoses slope sign / rise–run / intercept slips).
 *  - L1 Q3 (is the point the solution?) keeps his reasoned options; besides "works in the first only" some versions work
 *    in the second only, in both, or in neither.
 *  - L2 Q2 (classify without graphing, his MC) got a first part: rewrite the standard-form equation as y = mx + b (the
 *    method the checker can't otherwise see); the classification stays multiple choice with a reason for each option.
 *    L2 Q3 sometimes asks for b so that the system has infinitely many solutions (assignment Q15) instead of m.
 *  - Multiple choice kept where it tests recognition: L2 which picture, L3 which step has the first mistake, L4 which
 *    variable to isolate, L5 add or subtract, L6 which multipliers, L7 which system models the situation, L8 what 0 = 8 /
 *    0 = 0 means. No MC above Progressing.
 * Answers: points as (x, y) on the point keypad (x = …, y = … also accepted); equations in any equivalent arrangement in
 * the asked form; word-problem answers as numbers (two boxes where two values are asked). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, Ln = HW.lines, DR = HW.draw, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'u8x-gr-line': 'Graph: a line through the wrong points', 'u8x-gr-shift': 'Graph: right slope, wrong position', 'u8x-gr-sign': 'Graph: slope sign wrong', 'u8x-gr-flip': 'Graph: rise and run swapped',
    'u8x-gr-slope': 'Graph: right y-intercept, wrong slope', 'u8x-line-missing': 'Graph: one line missing', 'u8x-line-extra': 'Graph: an extra line', 'u8x-point-off': 'Graph: points not on the lines',
    'u8x-points-only': 'Graph: points not joined into lines', 'u8x-graph': 'Graph not right',
    'u8x-yint': 'Gave a y-intercept, not the crossing point', 'u8x-pt-sign': 'Misread the sign of a coordinate',
    'u8x-si-sign': 'Rearranging: a term kept its sign when it moved', 'u8x-si-neg': 'Rearranging: did not divide every term by −1', 'u8x-si-div': 'Rearranging: did not divide every term by the y-coefficient',
    'u8x-k-sign': 'Sign slip rewriting in slope–intercept form', 'u8x-k-icpt': 'Mixed up the slope and the y-intercept',
    'u8x-distribute': 'Substitution: did not multiply every term in the bracket', 'u8x-dist-sign': 'Sign slip multiplying a bracket by a negative',
    'u8x-copied': 'Repeated the student’s mistake', 'u8x-step-solved': 'Solved instead of writing the corrected step',
    'u8x-iso-sign': 'Sign slip isolating the variable', 'u8x-elim-sign': 'Elimination: sign slip subtracting a term', 'u8x-elim-rhs': 'Elimination: constants combined the wrong way',
    'u8x-elim-const': 'Elimination: did not multiply the constant', 'u8x-back-sign': 'Sign slip back-substituting',
    'u8x-other': 'Gave the other amount (or matched the prices to the wrong items)', 'u8x-total': 'Gave the total instead',
    'u8x-age-nohalf': 'Age problem: did not divide by 2', 'u8x-age-half': 'Age problem: split the total in half, ignoring the difference',
    'u8x-swap': 'Answers in each other’s boxes', 'u8x-one': 'One of the two values wrong', 'u8x-bc-ground': 'Gave a speed with or against the current/wind', 'u8x-bc-nohalf': 'Speeds: did not divide by 2', 'u8x-ka': 'Found a multiple of the number, not the number'
  });
  HW.addPartial({
    'u8x-gr-line': 'b', 'u8x-gr-shift': 's', 'u8x-gr-sign': 's', 'u8x-gr-flip': 's', 'u8x-gr-slope': 'b', 'u8x-line-missing': 'b', 'u8x-line-extra': 's', 'u8x-point-off': 'n', 'u8x-points-only': 'n', 'u8x-graph': 'n',
    'u8x-yint': 'n', 'u8x-pt-sign': 's', 'u8x-si-sign': 's', 'u8x-si-neg': 's', 'u8x-si-div': 's', 'u8x-k-sign': 's', 'u8x-k-icpt': 'n',
    'u8x-distribute': 'b', 'u8x-dist-sign': 's', 'u8x-copied': 'n', 'u8x-step-solved': 'b', 'u8x-iso-sign': 's', 'u8x-elim-sign': 's', 'u8x-elim-rhs': 's',
    'u8x-elim-const': 'b', 'u8x-back-sign': 's', 'u8x-other': 'b', 'u8x-total': 'n', 'u8x-age-nohalf': 'b', 'u8x-age-half': 'n',
    'u8x-swap': 's', 'u8x-one': 's', 'u8x-bc-ground': 'b', 'u8x-bc-nohalf': 'b', 'u8x-ka': 'b'
  });

  /* ================= numbers and LaTeX ================= */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function fr(p, q) { if (Array.isArray(p)) return fr(p[0], p[1]); if (q == null) q = 1; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g + 0, q / g]; }
  function fv(f) { return Array.isArray(f) ? f[0] / f[1] : f; }
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function nf(x) { return F(cl(x)); }
  function nT(x) { if (Array.isArray(x)) { var f = fr(x); return Ln.frT(f[0], f[1]); } if (Number.isInteger(cl(x))) return F(cl(x)); var g = Ln.toFr(x); return Ln.frT(g[0], g[1]); }
  function pT(x) { return fv(x) < 0 ? '(' + nT(x) + ')' : nT(x); }
  function cT(c) { return fv(c) === 1 ? '' : fv(c) === -1 ? '-' : nT(c); }
  function mT(c, x) { return cT(c) + '(' + nT(x) + ')'; }                       // 3(4), -(2), (5)
  function plusMT(c, x) { return (fv(c) < 0 ? '' : '+') + mT(c, x); }
  function ptT(p) { return '(' + nT(p[0]) + ',\\ ' + nT(p[1]) + ')'; }
  function pS(x) { if (Array.isArray(x)) { var f = fr(x); return f[1] === 1 ? String(f[0]) : f[0] + '/' + f[1]; } if (Number.isInteger(cl(x))) return String(cl(x)); var g = Ln.toFr(x); return g[1] === 1 ? String(g[0]) : g[0] + '/' + g[1]; }
  function ptK(p) { return '(' + pS(p[0]) + ', ' + pS(p[1]) + ')'; }
  function near(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function nz(r, lo, hi) { var v; do { v = r.int(lo, hi); } while (v === 0); return v; }
  function until(gen, okf) { for (var i = 0; i < 8000; i++) { var o = gen(); if (o != null && okf(o)) return o; } throw new Error('u8 exits: no valid numbers'); }
  /* terms [[coef, 'x'], …] -> LaTeX */
  function T(terms) {
    var s = '';
    terms.forEach(function (tm) {
      var cv = fv(tm[0]), v = tm[1] || ''; if (Math.abs(cv) < 1e-12) return;
      var a = Math.abs(cv), body = a === 1 && v ? '' : nf(a);
      s += (cv < 0 ? '-' : (s ? '+' : '')) + body + v;
    });
    return s || '0';
  }
  function eqT(lhs, rhs) { return T(lhs) + '=' + (typeof rhs === 'number' ? nf(rhs) : T(rhs)); }
  function sysT(e1, e2) { return '\\[\\begin{aligned}' + e1.replace('=', '&=') + '\\\\' + e2.replace('=', '&=') + '\\end{aligned}\\]'; }
  function siT(m, b) { return 'y=' + T([[m, 'x'], [b, '']]); }
  function cst(k) { return k === 0 ? '' : (k < 0 ? '-' : '+') + nf(Math.abs(k)); }               // "+4" / "-4"
  function tm(c, v) { return (c < 0 ? '-' : '+') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + v; }  // a signed term "+3y" / "-y"
  function brT(c, inner, first) { return (c < 0 ? '-' : first ? '' : '+') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + '\\left(' + inner + '\\right)'; }
  function money(v) { return t('\\$' + nf(v)); }
  function frP(p) { return p && isFinite(p[0]) && isFinite(p[1]) ? [Ln.toFr(cl(p[0])), Ln.toFr(cl(p[1]))] : null; }
  function solve2(A1, B1, C1, A2, B2, C2) { var D = A1 * B2 - A2 * B1; if (!D) return null; return [(C1 * B2 - C2 * B1) / D, (A1 * C2 - A2 * C1) / D]; }   // A x + B y = C
  function steps(lines) { return '<div style="margin:.35em 0 .35em 1em;line-height:2">' + lines.map(function (s, i) { return 'Step ' + (i + 1) + ': &nbsp;' + t(s); }).join('<br>') + '</div>'; }
  function Q(num, level, make) { return { num: String(num), stem: '', parts: [{ id: String(num), outcome: 'RF9', level: level, make: make }] }; }

  /* ================= lines A x + B y + C = 0 ================= */
  function line(A, Bc, C) { var g = gcd(gcd(A, Bc), C) || 1; A /= g; Bc /= g; C /= g; if (A < 0 || (A === 0 && Bc < 0)) { A = -A; Bc = -Bc; C = -C; } return { A: A + 0, B: Bc + 0, C: C + 0 }; }
  function mbL(m, b) { return line(m, -1, b); }        // y = m x + b (integers)
  function std(a, b, c) { return line(a, b, -c); }     // a x + b y = c
  function isoL(u, m, p) { return u === 'y' ? line(-m, 1, -p) : line(1, -m, -p); }   // u = m v + p
  function arr(Lo) { return [Lo.A, Lo.B, Lo.C]; }
  function onL(Lo, p) { return Math.abs(Lo.A * fv(p[0]) + Lo.B * fv(p[1]) + Lo.C) < 1e-9; }
  function sameL(a, b) { return a.A === b.A && a.B === b.B && a.C === b.C; }
  function latS(Lo, win) {
    var out = [];
    for (var x = Math.ceil(win[0][0]); x <= win[0][1]; x++) { if (Lo.B === 0) continue; var y = -(Lo.A * x + Lo.C) / Lo.B; if (Math.abs(y - Math.round(y)) < 1e-7 && y >= win[1][0] - 1e-9 && y <= win[1][1] + 1e-9) out.push([x, Math.round(y)]); }
    return out;
  }
  function arrowV(p, q) { return { pts: [], pieces: [{ v: [p, q], s: 'arrow', e: 'arrow' }], join: 'none' }; }
  function lineV(Lo, win) { var L2 = latS(Lo, win); if (L2.length < 2) L2 = latS(Lo, [[-60, 60], [-1e5, 1e5]]); return arrowV(L2[0], L2[L2.length - 1]); }
  function uniqL(Ls) { var out = []; Ls.forEach(function (L) { if (!out.some(function (M) { return sameL(M, L); })) out.push(L); }); return out; }

  /* ================= figures ================= */
  var W6 = [[-6, 6], [-6, 6]], BLUE = '#2a5db0', RED = '#c4532a';
  function clipSeg(Lo, win) {   // the part of the line inside the window
    var xr = win[0], yr = win[1], P = [];
    [xr[0], xr[1]].forEach(function (x) { var y = -(Lo.A * x + Lo.C) / Lo.B; if (y >= yr[0] - 1e-9 && y <= yr[1] + 1e-9) P.push([x, y]); });
    if (Lo.A !== 0) [yr[0], yr[1]].forEach(function (y) { var x = -(Lo.B * y + Lo.C) / Lo.A; if (x >= xr[0] - 1e-9 && x <= xr[1] + 1e-9) P.push([x, y]); });
    P.sort(function (a, b) { return a[0] - b[0]; });
    return [P[0], P[P.length - 1]];
  }
  /* a system as Ryan draws it: the first line solid blue, the second dashed red, every unit labelled */
  function figSys(L1, L2) {
    var w = [[-5.7, 5.7], [-5.7, 5.7]];
    return '<div class="fig">' + HW.graph({ x: W6[0], y: W6[1], grid: 1, labels: 1, max: 320, segs: [{ pts: clipSeg(L1, w), color: BLUE, start: 'arrow', end: 'arrow' }, { pts: clipSeg(L2, w), color: RED, dash: true, start: 'arrow', end: 'arrow' }], aria: 'two lines on a grid, one solid blue and one dashed red' }) + '</div>';
  }
  /* small picture of a system for a multiple-choice option (same line: the dashed red line lies on the blue one) */
  function mini(Ls, aria) {
    var w = [[-4.6, 4.6], [-4.6, 4.6]];
    return HW.graph({ x: [-5, 5], y: [-5, 5], grid: 1, labels: 0, max: 180, segs: Ls.map(function (L, i) { return { pts: clipSeg(L, w), color: i ? RED : BLUE, dash: !!i, start: 'arrow', end: 'arrow' }; }), aria: aria });
  }
  function crossPic(r, P) {
    var s = until(function () { return { m1: r.pick([-2, -1, 1, 2, 3, -3]), m2: r.pick([-2, -1, 1, 2, 3, -3]) }; }, function (s) { return s.m1 !== s.m2 && Math.abs(P[1] - s.m1 * P[0]) <= 4 && Math.abs(P[1] - s.m2 * P[0]) <= 4; });
    return mini([mbL(s.m1, P[1] - s.m1 * P[0]), mbL(s.m2, P[1] - s.m2 * P[0])], 'two lines that cross at one point');
  }
  function parPic(r) {
    var s = until(function () { return { m: r.pick([-2, -1, 1, 2, -1, 1]), b1: r.int(-4, 4), b2: r.int(-4, 4) }; }, function (s) { return Math.abs(s.b1 - s.b2) >= 3; });
    return mini([mbL(s.m, s.b1), mbL(s.m, s.b2)], 'two parallel lines');
  }
  function samePic(r) { var m = r.pick([-2, -1, 1, 2, 3, -3]), b = r.int(-2, 2), L = mbL(m, b); return mini([L, L], 'two lines on top of each other'); }

  /* ================= graph pad: both lines of a system (the 10C Unit 8 checker) ================= */
  var PADHELP = ' <span style="color:#6a7182;font-size:.92em">(Use <b>╱ Line</b>: tap two points on a line — its ends start as arrows. Draw both lines.)</span>';
  function pad(win) { return { x: win[0], y: win[1], grid: 1, labels: 2, mode: 'lines', defaultEnd: 'arrow', max: 360 }; }
  function splitBends(value) {
    var v = DR.norm(value), out = [];
    v.pieces.forEach(function (pc) {
      if (pc.v.length < 3) { out.push(pc); return; }
      var runs = [[pc.v[0], pc.v[1]]];
      for (var i = 2; i < pc.v.length; i++) {
        var run = runs[runs.length - 1], a = run[run.length - 2], b = run[run.length - 1], c = pc.v[i];
        if (Math.abs((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])) < 1e-9) run.push(c); else runs.push([b, c]);
      }
      var both = pc.s === 'arrow' && pc.e === 'arrow';
      runs.forEach(function (rv, k) { out.push({ v: rv, s: k === 0 ? pc.s : (both ? 'arrow' : 'closed'), e: k === runs.length - 1 ? pc.e : (both ? 'arrow' : 'closed') }); });
    });
    return { pts: v.pts, pieces: out, join: v.join };
  }
  function propL(S, L) {
    var a = [S.A, S.B, S.C], b = [L.A, L.B, L.C], sa = Math.max.apply(null, a.map(Math.abs)), sb = Math.max.apply(null, b.map(Math.abs));
    for (var i = 0; i < 3; i++) for (var j = i + 1; j < 3; j++) if (Math.abs(a[i] * b[j] - a[j] * b[i]) > 1e-6 * sa * sb) return false;
    return true;
  }
  function geoL(g, k) { var L = g.lines[k]; return { A: L.A, B: L.B, C: -L.C }; }
  function sysGraph(prompt, Ls, names, win, o, sol, hints, text) {
    o = o || {};
    var U = uniqL(Ls), uNames = U.map(function (L) { var i = Ls.length - 1; while (!sameL(Ls[i], L)) i--; return t(names[i]); });
    var key = { pts: [], pieces: U.map(function (L) { return lineV(L, win).pieces[0]; }), join: 'none' };
    var exact = K.graphExact(key);
    var W0 = (o.wrong || []).filter(function (w) { return w.L && !U.some(function (L) { return sameL(L, w.L); }); });
    function diagnose(S, Tl, name) {
      var sm = S.B === 0 ? null : -S.A / S.B, tmv = -Tl.A / Tl.B, sb = S.B === 0 ? null : -S.C / S.B, tb = -Tl.C / Tl.B, nr = function (a, b) { return a != null && Math.abs(a - b) < 1e-9; };
      if (S.B === 0) return wrong('u8x-gr-line', 'One of your lines is vertical. Check your line for ' + name + ': substitute two of its points into the equation.');
      if (nr(sm, tmv)) return wrong('u8x-gr-shift', 'Your line for ' + name + ' has the right slope but is in the wrong place: it should cross the ' + t('y') + '-axis at ' + t(ptT([0, Ln.toFr(tb)])) + '.');
      if (nr(sb, tb)) {
        if (nr(sm, -tmv)) return wrong('u8x-gr-sign', 'Your line for ' + name + ' starts in the right place, but it goes the wrong way: its slope is ' + t(nT(tmv)) + ', so it ' + (tmv < 0 ? 'falls' : 'rises') + ' from left to right.');
        if (tmv !== 0 && nr(sm, 1 / tmv)) return wrong('u8x-gr-flip', 'Your line for ' + name + ' starts in the right place. Slope is <b>rise over run</b>: ' + t('m=' + nT(tmv)) + ' — you stepped run over rise.');
        return wrong('u8x-gr-slope', 'Your line for ' + name + ' crosses the ' + t('y') + '-axis in the right place — now check its slope: ' + t('m=' + nT(tmv)) + '.');
      }
      return wrong('u8x-gr-line', 'Check your line for ' + name + ': substitute two of the points you used into ' + name + ' — both must make it true.');
    }
    var check = function (resp) {
      var v = splitBends(resp);
      if (DR.empty(v)) return form('empty', 'Draw your answer on the grid first.');
      var r0 = exact(v);
      if (r0.v === 'wrong' && (r0.code === 'graph-length' || r0.code === 'graph-ends')) return wrong('graph-arrows', 'Right lines — but a line keeps going forever: put <b>arrows</b> on both ends of each line (use the <b>Ends</b> tool).');
      if (r0.v !== 'wrong' || r0.code !== 'graph') return r0;
      var g = DR.geom(v), have = Object.keys(g.lines).map(function (k) { return geoL(g, k); });
      if (!have.length) {
        var off = v.pts.filter(function (p) { return !U.some(function (L) { return onL(L, p); }); })[0];
        if (off) return wrong('u8x-point-off', t(ptT(off)) + ' is not on ' + (U.length > 1 ? 'either line' : 'the line') + '. Substitute it into the equations to check.');
        return wrong('u8x-points-only', 'Your points are on the lines — now draw the lines through them with the <b>╱ Line</b> tool.');
      }
      var hit = have.map(function (S) { for (var i = 0; i < U.length; i++) if (propL(S, U[i])) return i; return -1; });
      var extra = have.filter(function (S, j) { return hit[j] < 0; }), miss = [];
      U.forEach(function (L, i) { if (hit.indexOf(i) < 0) miss.push(i); });
      for (var j = 0; j < extra.length; j++) for (var w = 0; w < W0.length; w++) if (propL(extra[j], W0[w].L)) return wrong(W0[w].code, W0[w].hint);
      if (!extra.length && miss.length) return wrong('u8x-line-missing', 'Correct so far — still to draw: ' + miss.map(function (i) { return uNames[i]; }).join(' and ') + '.');
      if (extra.length === 1 && miss.length === 1) return diagnose(extra[0], U[miss[0]], uNames[miss[0]]);
      if (extra.length && !miss.length) return wrong('u8x-line-extra', 'All the lines are there, but you have drawn ' + (extra.length === 1 ? 'an extra line' : 'extra lines') + ' as well. Undo or clear the extra ' + (extra.length === 1 ? 'one' : 'ones') + '.');
      return wrong('u8x-graph', null);
    };
    var p = K.P.graph(prompt + PADHELP, pad(win), check, key, sol, hints, text);
    var bad = W0.map(function (w) { var kv = { pts: [], pieces: key.pieces.slice(), join: 'none' }; kv.pieces[0] = lineV(w.L, win).pieces[0]; return kv; });
    if (U.length > 1) bad.push({ pts: [], pieces: [key.pieces[0]], join: 'none' });
    p.bad = bad.filter(function (b) { return !DR.same(b, key); });
    return p;
  }

  /* ================= other part makers ================= */
  function mc(r, prompt, opts, sol, hints, text, keep) {
    var seen = {}, o2 = opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; });
    return B.mc(r, prompt, o2, sol, hints, text, keep);
  }
  function samePt(a, b) { return Math.abs(fv(a[0]) - fv(b[0])) < 1e-9 && Math.abs(fv(a[1]) - fv(b[1])) < 1e-9; }
  /* the solution of a system as an ordered pair; opt.wrong: [{ is: [x, y], code, hint }] (also the bad answers) */
  function pointPart(prompt, P, Ls, opt, sol, hints, text) {
    opt = opt || {};
    var seen = [], W = (opt.wrong || []).filter(function (w) {
      if (!w || !Array.isArray(w.is) || !w.is.every(function (v) { return isFinite(fv(v)); }) || samePt(w.is, P)) return false;
      if (seen.some(function (q) { return samePt(q, w.is); })) return false; seen.push(w.is); return true;
    });
    var p = K.P.point(prompt, P, { system: Ls.map(arr), wrong: W }, sol, hints, text);
    var bad = [];
    if (!samePt(P, [P[1], P[0]])) bad.push(ptK([P[1], P[0]]));
    bad.push('no solution');
    W.forEach(function (w) { bad.push(ptK(w.is)); });
    p.bad = bad.filter(function (x, i, a) { return a.indexOf(x) === i; });
    return p;
  }
  /* [[value, code, hint]] -> diag */
  function dg(list, ans) {
    var L2 = (list || []).filter(function (d) { return d && isFinite(d[0]) && !near(d[0], ans); });
    return function (v) { for (var i = 0; i < L2.length; i++) if (Math.abs(v - L2[i][0]) < 1e-9) return { code: L2[i][1], hint: L2[i][2] }; return null; };
  }
  function numPart(prompt, ans, list, sol, hints, text, inp) {
    inp = inp || {};
    var p = B.number(prompt, ans, dg(list, ans), sol, hints, text, { before: inp.before, after: inp.after });
    p.key = String(cl(ans)); p.answer = t((inp.ansPre || '') + nf(ans)) + (inp.after ? ' ' + inp.after : '');
    p.bad = (list || []).filter(function (d) { return d && isFinite(d[0]) && !near(d[0], ans) && isInt(d[0]); }).map(function (d) { return String(cl(d[0])); }).filter(function (x, i, a) { return a.indexOf(x) === i; });
    return p;
  }
  /* two numbers in two boxes; dls[i] = [[value, code, hint]] for box i */
  function numIs(resp, v) { return K.number(v)(resp == null ? '' : String(resp)).v === 'correct'; }
  function pairPart(prompt, fields, vals, dls, sol, hints, text, answer) {
    var names = fields.map(function (f) { return f.name; });
    var check = function (resp) {
      resp = resp || [];
      for (var i = 0; i < 2; i++) { var r0 = K.number(vals[i])(resp[i] == null ? '' : String(resp[i])); if (r0.v === 'form') return { v: 'form', code: r0.code, hint: '<b>' + names[i] + ':</b> ' + (r0.hint || 'Enter a number.') }; }
      var g = [numIs(resp[0], vals[0]), numIs(resp[1], vals[1])];
      if (g[0] && g[1]) return ok();
      if (vals[0] !== vals[1] && numIs(resp[0], vals[1]) && numIs(resp[1], vals[0])) return wrong('u8x-swap', 'Your two answers are in each other’s boxes: check which letter (or item) each value belongs to.');
      for (i = 0; i < 2; i++) { if (g[i]) continue; var L = (dls && dls[i]) || []; for (var j = 0; j < L.length; j++) if (isFinite(L[j][0]) && !near(L[j][0], vals[i]) && numIs(resp[i], L[j][0])) return wrong(L[j][1], '<b>' + names[i] + ':</b> ' + L[j][2]); }
      if (g[0] || g[1]) return wrong('u8x-one', 'Your ' + names[g[0] ? 0 : 1] + ' is right — check the other value: substitute back into one of the equations.');
      return wrong('value', null);
    };
    var bad = [[String(vals[1]), String(vals[0])]];
    (dls || []).forEach(function (L, i) { (L || []).forEach(function (d) { if (isFinite(d[0]) && isInt(d[0]) && !near(d[0], vals[i])) { var b = [String(vals[0]), String(vals[1])]; b[i] = String(cl(d[0])); bad.push(b); } }); });
    return { prompt: prompt, input: { type: 'fields', fields: fields }, check: check, key: [String(vals[0]), String(vals[1])], answer: answer, solution: sol, hints: hints || [], text: text,
      bad: bad.filter(function (b, i, a) { return !(b[0] === String(vals[0]) && b[1] === String(vals[1])) && a.findIndex(function (c) { return c[0] === b[0] && c[1] === b[1]; }) === i; }) };
  }
  /* y = mx + b answer; W: [{ is: { m, b }, code, hint }] (also the bad answers) */
  function linePart(prompt, m, b, W, sol, hints, text) {
    var p = K.P.line(prompt, { m: m, b: b }, { form: 'slope-intercept', wrong: W }, sol, hints, text);
    p.bad = W.filter(function (w) { return !(w.is.m === m && w.is.b === b); }).map(function (w) { return siT(w.is.m, w.is.b); }).filter(function (x, i, a) { return a.indexOf(x) === i; });
    return p;
  }
  function fld(label, name, after) { return { label: label, name: name, mode: 'math', keys: 'fraction', placeholder: 'a number', after: after }; }

  /* ================= substitution work: u = m v + p into a x + b y = c ================= */
  function subObj(u, m, p, a, b, c) {
    var v = u === 'x' ? 'y' : 'x', beta = u === 'x' ? a : b, alpha = u === 'x' ? b : a, D = alpha + beta * m, K2 = beta * p, v0 = (c - K2) / D, u0 = m * v0 + p;
    return { u: u, v: v, m: m, p: p, a: a, b: b, c: c, beta: beta, alpha: alpha, D: D, K: K2, v0: v0, u0: u0, x0: u === 'x' ? u0 : v0, y0: u === 'x' ? v0 : u0 };
  }
  function work(s) {
    var inner = T([[s.m, s.v], [s.p, '']]);
    var exp = function (Kc) { return (s.u === 'x' ? T([[s.a * s.m, 'y'], [Kc, ''], [s.b, 'y']]) : T([[s.a, 'x'], [s.b * s.m, 'x'], [Kc, '']])) + '=' + s.c; };
    return { iso: s.u + '=' + inner, inner: inner, exp: exp,
      st1: (s.u === 'x' ? brT(s.a, inner, true) + tm(s.b, 'y') : T([[s.a, 'x']]) + brT(s.b, inner, false)) + '=' + s.c,
      st2: exp(s.K), st3: T([[s.D, s.v], [s.K, '']]) + '=' + s.c, st4: T([[s.D, s.v]]) + '=' + (s.c - s.K) };
  }
  /* the wrong point if v were found from D v = rhs (then u = m v + p) */
  function subPt(s, v) { if (!isFinite(v)) return null; var u = s.m * v + s.p; return frP(s.u === 'x' ? [u, v] : [v, u]); }
  function workSol(s, e2) {
    var w = work(s), L = [t(w.st1), t(w.st2), t(w.st3)];
    if (s.K !== 0) L.push(t(w.st4));
    if (s.D !== 1) L.push(t(s.v + '=' + nT(s.v0)));
    return 'Substitute ' + t(w.iso) + ' into ' + t(e2) + ' (in brackets) and solve for ' + t(s.v) + ':<br>' + L.join('<br>') +
      '<br>Back-substitute: ' + t(s.u + '=' + mT(s.m, s.v0) + cst(s.p) + '=' + nT(s.u0)) + '. The solution is ' + t(ptT([s.x0, s.y0])) + '.<br><b>Check</b> in ' + t(e2) + ': ' + t(mT(s.a, s.x0) + plusMT(s.b, s.y0) + '=' + s.c) + ' ✓';
  }
  /* A x + B y = c with one variable known: the substitution, and the other value */
  function backSub(A, Bc, c, known, val) {
    var kx = known === 'x', coefU = kx ? Bc : A, coefK = kx ? A : Bc, u = kx ? 'y' : 'x', rhs = c - coefK * val, uv = rhs / coefU;
    var lhs = kx ? mT(A, val) + tm(Bc, 'y') : T([[A, 'x']]) + plusMT(Bc, val);
    return { u: u, val: uv, txt: t(lhs + '=' + c) + (coefU === 1 ? ', so ' + t(u + '=' + nT(uv)) : ', so ' + t(T([[coefU, u]]) + '=' + nf(rhs)) + ' and ' + t(u + '=' + nT(uv))) };
  }

  /* =====================================================================================================
   * Lesson 1 — What is a system of linear equations? Solving by graphing
   * ===================================================================================================== */
  var MS = [-3, -2, -1, 1, 2, 3];
  function pickSys(r, bmax) {   // y = m1 x + b1 and y = m2 x + b2 crossing at an integer point off the y-axis
    return until(function () {
      var x0 = nz(r, -4, 4), y0 = r.int(-4, 4), m1 = r.pick(MS), m2 = r.pick(MS);
      return { P: [x0, y0], m1: m1, m2: m2, b1: y0 - m1 * x0, b2: y0 - m2 * x0 };
    }, function (s) {
      if (s.m1 === s.m2 || Math.abs(s.b1) > bmax || Math.abs(s.b2) > bmax || s.P[0] === s.P[1]) return false;
      return latS(mbL(s.m1, s.b1), W6).length >= 3 && latS(mbL(s.m2, s.b2), W6).length >= 3;
    });
  }
  function chk(m, b, P) { return t(mT(m, P[0]) + cst(b) + '=' + nT(P[1])) + ' ✓'; }
  function l1q1(r) { // Ryan: y = x + 3 (solid blue) and y = −2x − 3 (dashed red) → (−2, 1) · y = −x + 1 and y = 2x + 4 → (−1, 2)
    var s = pickSys(r, 5), L1 = mbL(s.m1, s.b1), L2 = mbL(s.m2, s.b2), e1 = siT(s.m1, s.b1), e2 = siT(s.m2, s.b2), P = s.P;
    var W = [{ is: [0, s.b1], code: 'u8x-yint', hint: t(ptT([0, s.b1])) + ' is where the solid blue line crosses the ' + t('y') + '-axis (its ' + t('y') + '-intercept). The solution is where the two lines cross <b>each other</b>.' },
      { is: [0, s.b2], code: 'u8x-yint', hint: t(ptT([0, s.b2])) + ' is where the dashed red line crosses the ' + t('y') + '-axis (its ' + t('y') + '-intercept). The solution is where the two lines cross <b>each other</b>.' },
      { is: [-P[0], P[1]], code: 'u8x-pt-sign', hint: 'Check the sign of ' + t('x') + ': the lines cross to the <b>' + (P[0] < 0 ? 'left' : 'right') + '</b> of the ' + t('y') + '-axis, so ' + t('x') + ' is ' + (P[0] < 0 ? 'negative' : 'positive') + '.' }];
    if (P[1] !== 0) W.push({ is: [P[0], -P[1]], code: 'u8x-pt-sign', hint: 'Check the sign of ' + t('y') + ': the lines cross <b>' + (P[1] < 0 ? 'below' : 'above') + '</b> the ' + t('x') + '-axis.' });
    return pointPart('The system ' + t(e1) + ' (solid blue) and ' + t(e2) + ' (dashed red) is graphed below. What is the solution of the system? Give it as an ordered pair ' + t('(x,\\ y)') + '.' + figSys(L1, L2), P, [L1, L2], { wrong: W },
      'The lines cross at ' + t(ptT(P)) + ', so the solution is ' + t(ptT(P)) + '.<br><b>Check.</b> ' + t(e1) + ': ' + chk(s.m1, s.b1, P) + ' and ' + t(e2) + ': ' + chk(s.m2, s.b2, P),
      ['The solution of a system is the point where the two lines <b>cross</b>.', 'Read across for ' + t('x') + ' first, then up or down for ' + t('y') + '.'], 'solution read from a graph');
  }
  var L1Q2 = { num: '2', shared: function (r) { return pickSys(r, 5); },
    stem: function (s) { return 'Consider the system ' + t(siT(s.m1, s.b1)) + ' and ' + t(siT(s.m2, s.b2)) + '.'; },
    parts: [
      { id: '2a', outcome: 'RF9', level: 'PRG', make: function (r, s) {   // Ryan (MC, which graph): y = x − 3 and y = −2x + 3 → (2, −1) · y = −2x + 4 and y = x − 2 → (2, 0)
        var L1 = mbL(s.m1, s.b1), L2 = mbL(s.m2, s.b2), n1 = siT(s.m1, s.b1), n2 = siT(s.m2, s.b2);
        var W = [{ L: mbL(-s.m1, s.b1), code: 'u8x-gr-sign', hint: 'Check the direction of ' + t(n1) + ': its slope is ' + t(s.m1) + ', so it ' + (s.m1 < 0 ? 'falls' : 'rises') + ' from left to right.' },
          { L: mbL(s.m1, -s.b1), code: 'u8x-gr-shift', hint: 'Check where ' + t(n1) + ' crosses the ' + t('y') + '-axis: at ' + t(ptT([0, s.b1])) + '.' },
          { L: mbL(-s.m2, s.b2), code: 'u8x-gr-sign', hint: 'Check the direction of ' + t(n2) + ': its slope is ' + t(s.m2) + ', so it ' + (s.m2 < 0 ? 'falls' : 'rises') + ' from left to right.' }];
        return sysGraph('Graph both lines on the grid.', [L1, L2], [n1, n2], W6, { wrong: W },
          t(n1) + ': start at ' + t(ptT([0, s.b1])) + ', then ' + (s.m1 < 0 ? 'down ' : 'up ') + t(Math.abs(s.m1)) + ' for every ' + t(1) + ' to the right.<br>' + t(n2) + ': start at ' + t(ptT([0, s.b2])) + ', then ' + (s.m2 < 0 ? 'down ' : 'up ') + t(Math.abs(s.m2)) + ' for every ' + t(1) + ' to the right.<br>Draw each line with arrows at both ends. They cross at ' + t(ptT(s.P)) + '.',
          ['Each equation is in the form ' + t('y=mx+b') + ': plot ' + t('b') + ' on the ' + t('y') + '-axis, then use the slope (rise over run).', 'Draw both lines with arrows at both ends.'], 'graph a system');
      } },
      { id: '2b', outcome: 'RF9', level: 'PRG', make: function (r, s) {
        var L1 = mbL(s.m1, s.b1), L2 = mbL(s.m2, s.b2), P = s.P;
        return pointPart('State the solution of the system as an ordered pair.', P, [L1, L2], { wrong: [
          { is: [0, s.b1], code: 'u8x-yint', hint: t(ptT([0, s.b1])) + ' is a ' + t('y') + '-intercept. The solution is where the two lines cross each other.' },
          { is: [0, s.b2], code: 'u8x-yint', hint: t(ptT([0, s.b2])) + ' is a ' + t('y') + '-intercept. The solution is where the two lines cross each other.' }] },
          'The lines cross at ' + t(ptT(P)) + '.<br><b>Check.</b> ' + chk(s.m1, s.b1, P) + ' and ' + chk(s.m2, s.b2, P),
          ['The solution is the point where the two lines cross.', 'Check it: it must make both equations true.'], 'solution of a graphed system');
      } }] };
  function l1q3(r) { // Ryan: is (2, 5) the solution of y = 3x − 1 and y = −x + 6? (works in the first only) · (1, 4) for y = 2x + 2 and y = −3x + 6
    var kind = r.pick(['first', 'first', 'first', 'second', 'second', 'both', 'both', 'neither']);
    var s = until(function () {
      var px = r.int(1, 4), py = r.int(-3, 8), m1 = r.pick([-3, -2, -1, 1, 2, 3, 4]), m2 = r.pick([-3, -2, -1, 1, 2, 3]);
      var d1 = kind === 'first' || kind === 'both' ? 0 : r.pick([-3, -2, -1, 1, 2, 3]), d2 = kind === 'second' || kind === 'both' ? 0 : r.pick([-3, -2, -1, 1, 2, 3]);
      return { px: px, py: py, m1: m1, m2: m2, b1: py - m1 * px + d1, b2: py - m2 * px + d2 };
    }, function (s) { return s.m1 !== s.m2 && s.b1 !== 0 && s.b2 !== 0 && Math.abs(s.b1) <= 9 && Math.abs(s.b2) <= 9 && s.px !== s.py; });
    var e1 = siT(s.m1, s.b1), e2 = siT(s.m2, s.b2), E1 = t(e1), E2 = t(e2), v1 = s.m1 * s.px + s.b1, v2 = s.m2 * s.px + s.b2, P = [s.px, s.py];
    var c = function (m, b, v) { return t(mT(m, s.px) + cst(b) + '=' + v) + (v === s.py ? ' ✓' : ', and ' + t(v + '\\ne ' + s.py) + ' ✗'); };
    var subs = 'Substitute ' + t('x=' + s.px) + ': in ' + E1 + ', ' + c(s.m1, s.b1, v1) + '; in ' + E2 + ', ' + c(s.m2, s.b2, v2) + '.';
    var o = {
      yes1: { html: 'Yes. It works in ' + (kind === 'second' ? E2 : E1) + ', so it is the solution.', why: 'A solution of a system must work in <b>both</b> equations, not just one. ' + subs },
      noF: { html: 'No. It works in ' + E1 + ' but not in ' + E2 + '.', right: kind === 'first', why: subs },
      noS: { html: 'No. It works in ' + E2 + ' but not in ' + E1 + '.', right: kind === 'second', why: subs },
      both: { html: 'Yes. It works in both equations.', right: kind === 'both', why: subs },
      none: { html: 'No. It does not work in either equation.', right: kind === 'neither', why: subs } };
    var opts = kind === 'first' ? [o.yes1, o.noF, o.both, o.none] : kind === 'second' ? [o.yes1, o.noS, o.both, o.none] : [o.noF, o.noS, o.both, o.none];
    var concl = { first: 'It works in the first equation but not the second, so ' + t(ptT(P)) + ' is <b>not</b> the solution.', second: 'It works in the second equation but not the first, so ' + t(ptT(P)) + ' is <b>not</b> the solution.',
      both: 'It works in <b>both</b> equations, so ' + t(ptT(P)) + ' <b>is</b> the solution.', neither: 'It works in neither equation, so ' + t(ptT(P)) + ' is <b>not</b> the solution.' }[kind];
    return mc(r, 'Is ' + t(ptT(P)) + ' the solution of the system ' + E1 + ' and ' + E2 + '?', opts,
      'Substitute ' + t('x=' + s.px) + ' into each equation and compare with ' + t('y=' + s.py) + ':<br>' + E1 + ': ' + c(s.m1, s.b1, v1) + '<br>' + E2 + ': ' + c(s.m2, s.b2, v2) + '<br>' + concl,
      ['Substitute the point into <b>each</b> equation.', 'A solution of the system must make both equations true.'], 'check a point: ' + kind, true);
  }
  var L1Q4 = { num: '4', shared: function (r) {   // added (Mastery): assignment Q10 (4x − y = 3 and y = −x + 2 → (1, 1)), Examples 3 and 5
      return until(function () {
        var x0 = nz(r, -3, 4), y0 = r.int(-4, 4), plus = r.chance(0.5), a = r.int(1, 4), m2 = r.pick(MS), m1 = plus ? -a : a;
        return { P: [x0, y0], plus: plus, a: a, m1: m1, b1: y0 - m1 * x0, m2: m2, b2: y0 - m2 * x0 };
      }, function (s) { return s.m1 !== s.m2 && s.b1 !== 0 && Math.abs(s.b1) <= 6 && Math.abs(s.b2) <= 6 && s.P[0] !== s.P[1] && latS(mbL(s.m1, s.b1), W6).length >= 3 && latS(mbL(s.m2, s.b2), W6).length >= 3; });
    },
    stem: function (s) { return 'Consider the system ' + t(s.plus ? eqT([[s.a, 'x'], [1, 'y']], s.b1) : eqT([[s.a, 'x'], [-1, 'y']], -s.b1)) + ' and ' + t(siT(s.m2, s.b2)) + '.'; },
    parts: [
      { id: '4a', outcome: 'RF9', level: 'MAS', make: function (r, s) {
        var e1 = s.plus ? eqT([[s.a, 'x'], [1, 'y']], s.b1) : eqT([[s.a, 'x'], [-1, 'y']], -s.b1), ax = T([[s.a, 'x']]);
        var W = s.plus ? [{ is: { m: s.a, b: s.b1 }, code: 'u8x-si-sign', hint: 'Moving ' + t(ax) + ' to the other side changes its sign: subtract ' + t(ax) + ' from both sides.' },
          { is: { m: -s.a, b: -s.b1 }, code: 'u8x-si-sign', hint: 'Only the ' + t('x') + '-term moves; the constant ' + t(s.b1) + ' stays as it is.' }]
          : [{ is: { m: -s.a, b: -s.b1 }, code: 'u8x-si-neg', hint: 'After subtracting ' + t(ax) + ' you have ' + t('-y=' + T([[-s.a, 'x'], [-s.b1, '']])) + ': divide <b>every</b> term by ' + t('-1') + '.' },
            { is: { m: s.a, b: -s.b1 }, code: 'u8x-si-neg', hint: 'Divide <b>every</b> term by ' + t('-1') + ' — the constant changes sign too.' },
            { is: { m: -s.a, b: s.b1 }, code: 'u8x-si-sign', hint: 'Moving ' + t(ax) + ' to the other side changes its sign.' }];
        return linePart('Rewrite ' + t(e1) + ' in slope–intercept form, ' + t('y=mx+b') + '.', s.m1, s.b1, W,
          (s.plus ? 'Subtract ' + t(ax) + ' from both sides: ' + t(siT(s.m1, s.b1)) + '.' : 'Subtract ' + t(ax) + ' from both sides: ' + t('-y=' + T([[-s.a, 'x'], [-s.b1, '']])) + '.<br>Divide every term by ' + t('-1') + ': ' + t(siT(s.m1, s.b1)) + '.'),
          ['Get ' + t('y') + ' by itself: move the ' + t('x') + '-term to the other side (its sign changes).', s.plus ? 'The constant stays where it is.' : 'Then divide <b>every</b> term by ' + t('-1') + '.'], 'rearrange to y = mx + b');
      } },
      { id: '4b', outcome: 'RF9', level: 'MAS', make: function (r, s) {
        var L1 = mbL(s.m1, s.b1), L2 = mbL(s.m2, s.b2), P = s.P, W = [];
        [[s.plus ? s.a : -s.a, s.b1], [s.m1, -s.b1]].forEach(function (mb) { if (mb[0] !== s.m2) { var x = (s.b2 - mb[1]) / (mb[0] - s.m2); W.push({ is: frP([x, mb[0] * x + mb[1]]), code: 'u8x-si-sign', hint: 'Check your slope–intercept form of the first equation: the point must make the <b>original</b> equation true.' }); } });
        var orig = s.plus ? t(mT(s.a, P[0]) + plusMT(1, P[1]) + '=' + s.b1) : t(mT(s.a, P[0]) + plusMT(-1, P[1]) + '=' + (-s.b1));
        return pointPart('Graph both lines (sketch them on paper) and state the solution of the system as an ordered pair.', P, [L1, L2], { wrong: W.filter(function (w) { return w.is; }) },
          t(siT(s.m1, s.b1)) + ': start at ' + t(ptT([0, s.b1])) + ', slope ' + t(s.m1) + '.<br>' + t(siT(s.m2, s.b2)) + ': start at ' + t(ptT([0, s.b2])) + ', slope ' + t(s.m2) + '.<br>The lines cross at ' + t(ptT(P)) + '.<br><b>Check</b> in the original equations: ' + orig + ' ✓ and ' + chk(s.m2, s.b2, P),
          ['Graph ' + t(siT(s.m1, s.b1)) + ' from your answer to (a), and the second line from its ' + t('y') + '-intercept and slope.', 'Check the crossing point in both <b>original</b> equations.'], 'rearrange, graph and solve');
      } }] };
  HW.defineExit({ lesson: 'u8l1', calc: false, outcome: 'RF9',
    blurb: 'Solving by graphing: read a solution off a graph, graph a system and state its solution, check whether a point solves a system, and rearrange before graphing.',
    questions: [Q(1, 'BEG', l1q1), L1Q2, Q(3, 'BEG', l1q3), L1Q4] });

  /* =====================================================================================================
   * Lesson 2 — Classifying systems: one solution, no solution, or infinitely many
   * ===================================================================================================== */
  /* y = m x + b written as A x ± y = C with A > 0, every term times k */
  function rearr(m, b, k) { var sy = m < 0 ? 1 : -1; return { sy: sy, A: -m * sy * k, By: sy * k, C: b * sy * k, tex: eqT([[-m * sy * k, 'x'], [sy * k, 'y']], b * sy * k) }; }
  var CNT = { one: 'one solution', none: 'no solution', inf: 'infinitely many solutions' };
  function l2q1(r) { // Ryan: which picture shows infinitely many solutions · exactly one solution
    var ask = r.pick(['inf', 'one', 'none']);
    var X = [r.int(-3, 3), r.int(-3, 3)];
    var pics = { one: crossPic(r, X), none: parPic(r), inf: samePic(r) };
    var WHY = { one: 'In that picture the lines cross at exactly one point, so that system has <b>one</b> solution.', none: 'Those lines are parallel: they never meet, so that system has <b>no</b> solution.', inf: 'In that picture the two lines lie on top of each other (the same line), so every point on it is a solution: <b>infinitely many</b>.' };
    var opts = ['one', 'none', 'inf'].map(function (k) { return { html: pics[k], right: k === ask, why: WHY[k], code: k }; });
    var p = mc(r, 'Which picture shows a system with <b>' + { inf: 'infinitely many solutions', one: 'exactly one solution', none: 'no solution' }[ask] + '</b>?', opts,
      { one: 'Lines that cross meet at exactly one point, so that system has exactly one solution.', none: 'Parallel lines never meet, so no point is on both lines: no solution.', inf: 'When both equations make the <b>same line</b>, every point on it works in both, so there are infinitely many solutions.' }[ask] +
        '<br>Crossing lines: one solution. Parallel lines: no solution. The same line: infinitely many.',
      ['The solution is where the lines meet. How many points do they share?', 'Parallel lines never meet; the same line meets itself everywhere.'], 'which picture: ' + ask);
    p.input.columns = 2;
    return p;
  }
  var L2Q2 = { num: '2', shared: function (r) {   // Ryan (MC): 3x + y = 5 and y = −3x + 9 → no solution · 2x − y = 3 and y = 2x − 3 → infinitely many
      return until(function () {
        var kind = r.pick(['none', 'inf', 'one']), m1 = r.pick([-4, -3, -2, -1, 1, 2, 3, 4]), b1 = nz(r, -9, 9), k = r.pick([1, 1, 1, 2]), m2 = m1, b2 = b1;
        if (kind === 'none') b2 = b1 + nz(r, -6, 6);
        if (kind === 'one') { m2 = r.chance(0.5) ? -m1 : m1 + r.pick([-1, 1]); if (r.chance(0.5)) b2 = b1 + nz(r, -6, 6); }
        return { kind: kind, m1: m1, b1: b1, k: k, m2: m2, b2: b2 };
      }, function (s) { return s.m2 !== 0 && Math.abs(s.b2) <= 12 && Math.abs(s.b1 * s.k) <= 18 && (s.kind !== 'one' || s.m2 !== s.m1); });
    },
    stem: function (s) { return 'Here is a system of two equations:' + sysT(rearr(s.m1, s.b1, s.k).tex, siT(s.m2, s.b2)); },
    parts: [
      { id: '2a', outcome: 'RF9', level: 'PRG', make: function (r, s) {
        var R = rearr(s.m1, s.b1, s.k), ax = T([[R.A, 'x']]), W;
        if (R.sy > 0) W = [{ is: { m: -s.m1, b: s.b1 }, code: 'u8x-si-sign', hint: 'Moving ' + t(ax) + ' to the other side changes its sign.' }, { is: { m: s.m1, b: -s.b1 }, code: 'u8x-si-sign', hint: 'Only the ' + t('x') + '-term moves; the constant keeps its sign.' }];
        else W = [{ is: { m: -s.m1, b: -s.b1 }, code: 'u8x-si-neg', hint: 'After moving ' + t(ax) + ', ' + t('y') + ' has a negative coefficient: divide <b>every</b> term by ' + t(-s.k) + '.' }, { is: { m: s.m1, b: -s.b1 }, code: 'u8x-si-neg', hint: 'Divide <b>every</b> term by ' + t(-s.k) + ' — the constant changes sign too.' }, { is: { m: -s.m1, b: s.b1 }, code: 'u8x-si-sign', hint: 'Moving ' + t(ax) + ' to the other side changes its sign.' }];
        if (s.k > 1) W.push({ is: { m: s.m1, b: s.k * s.b1 }, code: 'u8x-si-div', hint: 'Divide <b>every</b> term by ' + t(R.By) + ' — the constant too.' });
        var mid = T([[R.By, 'y']]) + '=' + T([[-R.A, 'x'], [R.C, '']]);
        return linePart('Rewrite the first equation, ' + t(R.tex) + ', in slope–intercept form.', s.m1, s.b1, W,
          'Subtract ' + t(ax) + ' from both sides: ' + t(mid) + '.' + (R.By !== 1 ? '<br>Divide every term by ' + t(R.By) + ': ' + t(siT(s.m1, s.b1)) + '.' : ''),
          ['Get ' + t('y') + ' by itself: move the ' + t('x') + '-term to the other side (its sign changes).', R.By !== 1 ? 'Then divide <b>every</b> term by ' + t(R.By) + '.' : 'The constant stays where it is.'], 'rearrange to y = mx + b');
      } },
      { id: '2b', outcome: 'RF9', level: 'PRG', make: function (r, s) {
        var both = 'In slope–intercept form the equations are ' + t(siT(s.m1, s.b1)) + ' and ' + t(siT(s.m2, s.b2)) + '. ';
        var cmp = s.m1 !== s.m2 ? 'The slopes, ' + t(s.m1) + ' and ' + t(s.m2) + ', are different.' : 'The slopes are both ' + t(s.m1) + '; the ' + t('y') + '-intercepts, ' + t(s.b1) + ' and ' + t(s.b2) + ', are ' + (s.b1 === s.b2 ? 'the same.' : 'different.');
        var verdict = { one: 'Different slopes: the lines cross once — <b>one solution</b>.', none: 'Same slope, different ' + t('y') + '-intercepts: parallel lines — <b>no solution</b>.', inf: 'Same slope and same ' + t('y') + '-intercept: the same line — <b>infinitely many solutions</b>.' }[s.kind];
        var opts = [{ html: 'One solution', right: s.kind === 'one', why: both + cmp + ' ' + (s.kind === 'none' ? 'Same slope with different intercepts means parallel lines, which never cross.' : 'Same slope and same intercept means it is the same line.') },
          { html: 'No solution', right: s.kind === 'none', why: both + cmp + ' ' + (s.kind === 'one' ? 'Different slopes means the lines are not parallel: they cross once.' : 'The intercepts are the same too, so this is the same line, not two parallel lines.') },
          { html: 'Infinitely many solutions', right: s.kind === 'inf', why: both + cmp + ' ' + (s.kind === 'one' ? 'Different slopes means two different lines that cross once.' : 'The intercepts are different, so these are two different (parallel) lines.') }];
        return mc(r, 'Without graphing, how many solutions does the system have?', opts, both + cmp + '<br>' + verdict,
          ['Write both equations as ' + t('y=mx+b') + ' and compare the slopes first.', 'Different slopes: one solution. Same slope: compare the ' + t('y') + '-intercepts (different: none; same: infinitely many).'], 'classify: ' + s.kind, true);
      } }] };
  function l2q3(r) { // Ryan: 2x + y = 7 and y = mx + 1 has no solution → m = −2 · 3x + y = 4 and y = mx − 2 → m = −3; added: b for infinitely many (assignment Q15)
    var inf = r.chance(0.3);
    var s = until(function () { return { m1: r.pick([-5, -4, -3, -2, -1, -3, -2, 2, 3, 4]), b1: nz(r, -9, 9), d: nz(r, -9, 9) }; }, function (s) { return s.d !== s.b1 && Math.abs(s.b1) !== Math.abs(s.m1); });
    var R = rearr(s.m1, s.b1, 1), e1 = R.tex, si1 = siT(s.m1, s.b1);
    var re = 'Rewrite ' + t(e1) + ': ' + (R.sy > 0 ? t(si1) : t('-y=' + T([[-R.A, 'x'], [R.C, '']])) + ', so ' + t(si1)) + ' (slope ' + t(s.m1) + ', ' + t('y') + '-intercept ' + t(s.b1) + ').';
    if (!inf) {
      var e2 = 'y=mx' + cst(s.d);
      return numPart('The system ' + t(e1) + ' and ' + t(e2) + ' has <b>no solution</b>. What is the value of ' + t('m') + '?', s.m1,
        [[-s.m1, 'u8x-k-sign', 'Check the sign when you rewrite ' + t(e1) + ' as ' + t('y=mx+b') + ': moving the ' + t('x') + '-term changes its sign.'], [s.b1, 'u8x-k-icpt', t(s.b1) + ' is the ' + t('y') + '-intercept of the first line. No solution means the lines are parallel: same <b>slope</b>.']],
        re + '<br>No solution means the lines are <b>parallel</b>: the same slope and different ' + t('y') + '-intercepts (' + t(s.b1) + ' and ' + t(s.d) + '). So ' + t('m=' + s.m1) + '.',
        ['Write the first equation as ' + t('y=mx+b') + '.', 'Parallel lines (no solution) have the same slope and different ' + t('y') + '-intercepts.'], 'no solution: find m', { before: t('m='), ansPre: 'm=' });
    }
    var e2b = 'y=' + T([[s.m1, 'x']]) + '+b';
    return numPart('The system ' + t(e1) + ' and ' + t(e2b) + ' has <b>infinitely many solutions</b>. What is the value of ' + t('b') + '?', s.b1,
      [[-s.b1, 'u8x-k-sign', 'Check the sign of the constant when you rewrite ' + t(e1) + ' as ' + t('y=mx+b') + '.'], [s.m1, 'u8x-k-icpt', t(s.m1) + ' is the slope. Infinitely many solutions means the same line: the same <b>' + t('y') + '-intercept</b> too.']],
      re + '<br>Infinitely many solutions means both equations are the <b>same line</b>: same slope and same ' + t('y') + '-intercept. So ' + t('b=' + s.b1) + '.',
      ['Write the first equation as ' + t('y=mx+b') + '.', 'Infinitely many solutions: the two equations are the same line.'], 'infinitely many: find b', { before: t('b='), ansPre: 'b=' });
  }
  HW.defineExit({ lesson: 'u8l2', calc: false, outcome: 'RF9',
    blurb: 'Classifying systems: one solution, no solution or infinitely many from a picture and without graphing, and a missing slope or intercept.',
    questions: [Q(1, 'BEG', l2q1), L2Q2, Q(3, 'MAS', l2q3)] });

  /* =====================================================================================================
   * Lesson 3 — Substitution, part 1: a variable already isolated
   * ===================================================================================================== */
  function subSys(r, o) {
    o = o || {};
    return until(function () {
      var u = r.chance(o.py == null ? 0.65 : o.py) ? 'y' : 'x', m = r.pick(o.ms || [1, 1, 2, 3, -1]), p = nz(r, -6, 7), v0 = r.int(o.vlo == null ? -3 : o.vlo, o.vhi || 10), a = r.int(1, 5), b = nz(r, -5, 5);
      var x0 = u === 'x' ? m * v0 + p : v0, y0 = u === 'x' ? v0 : m * v0 + p;
      return subObj(u, m, p, a, b, a * x0 + b * y0);
    }, function (s) { return isInt(s.v0) && s.D >= (o.dmin || 1) && s.D <= 6 && Math.abs(s.beta) >= (o.bmin || 2) && s.x0 !== s.y0 && s.c !== 0 && Math.abs(s.c) <= 40 && Math.abs(s.x0) <= 14 && Math.abs(s.y0) <= 14 && (!o.ok || o.ok(s)); });
  }
  function e2Of(s) { return eqT([[s.a, 'x'], [s.b, 'y']], s.c); }
  function l3q1(r) { // Ryan: y = x + 4 and 3x − 2y = 1 → (9, 13) · y = x + 2 and 4x − 3y = 1 → (7, 9)
    var s = subSys(r), w = work(s), e2 = e2Of(s), W = [];
    W.push({ is: subPt(s, (s.c - s.p) / s.D), code: 'u8x-distribute', hint: 'Multiply <b>both</b> terms in the bracket by ' + t(s.beta) + ': ' + t(brT(s.beta, w.inner, true) + '=' + T([[s.beta * s.m, s.v], [s.K, '']])) + '.' });
    if (s.beta < 0) W.push({ is: subPt(s, (s.c + s.K) / s.D), code: 'u8x-dist-sign', hint: 'Check the sign: ' + t(s.beta + '\\times ' + pT(s.p) + '=' + s.K) + '.' });
    return pointPart('Solve the system by substitution. Give the solution as an ordered pair.' + sysT(w.iso, e2), [s.x0, s.y0], [isoL(s.u, s.m, s.p), std(s.a, s.b, s.c)], { wrong: W.filter(function (x) { return x.is; }) }, workSol(s, e2),
      ['The first equation tells you what ' + t(s.u) + ' equals: replace ' + t(s.u) + ' in the second equation with ' + t('(' + w.inner + ')') + ' — in brackets.', 'Solve for ' + t(s.v) + ', then substitute back into ' + t(w.iso) + ' to find ' + t(s.u) + '.'], 'substitution, ' + s.u + ' isolated');
  }
  /* the student's work (Ryan's four steps) with one mistake: err 'dist' (Step 2), 'sign' (Step 2), 'move' (Step 3), 'div' (Step 4) */
  function badWork(s, err) {
    var w = work(s), Kw = err === 'dist' ? s.p : err === 'sign' ? -s.K : s.K, rhs = err === 'move' ? s.c + s.K : s.c - Kw;
    var st = [w.st1, w.exp(Kw), T([[s.D, s.v]]) + '=' + rhs, s.v + '=' + (err === 'div' ? Ln.frT(s.D, rhs) : Ln.frT(rhs, s.D))];
    return { st: st, vw: err === 'div' ? s.D / rhs : rhs / s.D };
  }
  function l3q2(r) { // Ryan: x = 2y + 1, 3x − y = 13 — Step 2 wrote 6y + 1 − y = 13 · y = 3x − 2, 2x + y = 13 — Step 3 wrote 5x = 11
    var err = r.pick(['dist', 'dist', 'move', 'move', 'div']);
    var s = subSys(r, { ms: [1, 2, 3, -1], vlo: -2, vhi: 6, dmin: 2, bmin: err === 'dist' ? 2 : 1, ok: function (s) { return s.c - s.K !== 0 && (err !== 'div' || Math.abs(s.v0) > 1); } });
    var w = work(s), e2 = e2Of(s), bw = badWork(s, err), at = { dist: 1, move: 2, div: 3 }[err];
    var whyOk = ['it replaces ' + t(s.u) + ' with ' + t('(' + w.inner + ')') + '.', 'it multiplies ' + t(s.beta) + ' by both terms in the bracket.', 'it collects the ' + t(s.v) + '-terms and moves ' + t(s.K) + ' to the other side.'];
    var opts = [0, 1, 2, 3].map(function (i) { return { html: 'Step ' + (i + 1), right: i === at, why: i < at ? 'Step ' + (i + 1) + ' is correct: ' + whyOk[i] : 'Step ' + (i + 1) + ' follows correctly from the step before it — the first mistake is earlier.' }; });
    var what = { dist: 'Step 2 multiplied only the first term in the bracket by ' + t(s.beta) + '. It should be ' + t(brT(s.beta, w.inner, true) + '=' + T([[s.beta * s.m, s.v], [s.K, '']])) + ', so Step 2 is ' + t(w.st2) + '.',
      move: 'Step 3 moved ' + t(s.K) + ' to the other side without changing its sign. It should be ' + t(w.st4) + '.',
      div: 'Step 4 divided the wrong way. From ' + t(w.st4) + ', divide both sides by ' + t(s.D) + ': ' + t(s.v + '=' + nT(s.v0)) + '.' }[err];
    return mc(r, 'A student solved this system by substitution:' + sysT(w.iso, e2) + steps(bw.st) + 'Which step has the <b>first</b> mistake?', opts,
      what + '<br>Correct work: ' + t(w.st1) + ', ' + t(w.st2) + ', ' + t(w.st4) + ', ' + t(s.v + '=' + nT(s.v0)) + '. Then ' + t(s.u + '=' + mT(s.m, s.v0) + cst(s.p) + '=' + nT(s.u0)) + ', so the solution is ' + t(ptT([s.x0, s.y0])) + '.',
      ['Check each step against the one before it: expand the bracket, collect like terms, move the constant (change its sign), divide.', 'Look for the <b>first</b> step that does not follow correctly.'], 'first mistake: ' + err, true);
  }
  var L3Q3 = { num: '3', shared: function (r) {   // added (Mastery): find and fix the mistake — Ryan's slip explanations and assignment Q4 (checking a claimed solution)
      var sign = r.chance(0.4);
      var s = subSys(r, { ms: [1, 2, 3, -1], vlo: -2, vhi: 7, dmin: 2, ok: function (s) { return (!sign || s.beta < 0) && s.c - (sign ? -s.K : s.p) !== 0; } });
      return { s: s, err: sign ? 'sign' : 'dist' };
    },
    stem: function (o) { var s = o.s, w = work(s); return 'A student solved the system' + sysT(w.iso, e2Of(s)) + 'by substitution, but made a mistake in <b>Step 2</b>:' + steps(badWork(s, o.err).st); },
    parts: [
      { id: '3a', outcome: 'RF9', level: 'MAS', make: function (r, o) {
        var s = o.s, w = work(s), bw = badWork(s, o.err), other = s.v === 'x' ? 'y' : 'x';
        var check = function (resp) {
          var rr = Ln.read(resp, [s.v, other]);
          if (!rr.ok) return form(rr.why === 'empty' ? 'empty' : 'line-' + rr.why, rr.why === 'empty' ? 'Type the corrected Step 2 first.' : 'Write Step 2 as an equation in ' + t(s.v) + ', for example ' + t(w.exp(1)) + '.');
          if (Math.abs(rr.b) > 1e-9) return form('u8x-step-var', 'After substituting, Step 2 has only ' + t(s.v) + ' in it.');
          var A = rr.a, C = rr.c;
          if (Math.abs(A * s.v0 + C) < 1e-9) return Math.abs(Math.abs(A) - Math.abs(s.D)) < 1e-9 ? ok() : wrong('u8x-step-solved', 'Your equation is true for the right value of ' + t(s.v) + ', but it is not Step 2. Write Step 2 itself: multiply out the bracket correctly (don’t solve yet).');
          if (Math.abs(A * bw.vw + C) < 1e-9) return wrong('u8x-copied', 'That gives the same answer as the student’s Step 2. Multiply <b>both</b> terms in the bracket by ' + t(s.beta) + ', with the sign.');
          return wrong('value', null);
        };
        var p = B.math('Write <b>Step 2</b> correctly.', check, w.st2,
          'Step 2 must multiply <b>both</b> terms in the bracket by ' + t(s.beta) + ': ' + t(brT(s.beta, w.inner, true) + '=' + T([[s.beta * s.m, s.v], [s.K, '']])) + '.<br>' + (o.err === 'dist' ? 'The student multiplied only the first term.' : 'The student got the sign of ' + t(s.beta + '\\times ' + pT(s.p)) + ' wrong: it is ' + t(s.K) + '.') + '<br>Correct Step 2: ' + t(w.st2) + ' (or, collected, ' + t(w.st3) + ').',
          ['Step 2 multiplies out the bracket in Step 1.', 'The number in front of the bracket multiplies <b>every</b> term inside it — watch the signs.'], 'fix step 2 (' + o.err + ')', { keys: 'eq', vars: [s.v], placeholder: 'an equation in ' + s.v });
        p.bad = [bw.st[1], s.v + '=' + nT(s.v0)];
        return p;
      } },
      { id: '3b', outcome: 'RF9', level: 'MAS', make: function (r, o) {
        var s = o.s, bw = badWork(s, o.err), e2 = e2Of(s);
        return pointPart('What is the correct solution of the system? Give it as an ordered pair.', [s.x0, s.y0], [isoL(s.u, s.m, s.p), std(s.a, s.b, s.c)], { wrong: [{ is: subPt(s, bw.vw), code: 'u8x-copied', hint: 'That comes from the student’s mistake in Step 2. Redo the work from a correct Step 2.' }].filter(function (x) { return x.is; }) },
          workSol(s, e2), ['Start again from your corrected Step 2.', 'Find ' + t(s.v) + ', then substitute it back to find ' + t(s.u) + '. Check in both equations.'], 'correct solution after the fix');
      } }] };
  HW.defineExit({ lesson: 'u8l3', calc: false, outcome: 'RF9',
    blurb: 'Substitution when a variable is already isolated: solve a system, find the first mistake in a student’s work, and fix a mistake and finish correctly.',
    questions: [Q(1, 'PRG', l3q1), Q(2, 'PRG', l3q2), L3Q3] });

  /* =====================================================================================================
   * Lesson 4 — Substitution, part 2: isolating a variable first
   * ===================================================================================================== */
  function l4q1(r) { // Ryan: 6x + y = 14 and 5x − 2y = 6 → y in the first · 4x + 3y = 10 and x − 5y = 6 → x in the second
    var pos = r.int(0, 3), sg = pos % 2 === 1 && r.chance(0.3) ? -1 : 1;
    var s = until(function () {
      var C = [r.int(2, 6), r.pick([-5, -4, -3, -2, 2, 3, 4, 5]), r.int(2, 6), r.pick([-5, -4, -3, -2, 2, 3, 4, 5])], x0 = r.int(-2, 5), y0 = r.int(-2, 5);
      C[pos] = sg;
      return { C: C, k1: C[0] * x0 + C[1] * y0, k2: C[2] * x0 + C[3] * y0 };
    }, function (s) { return s.C[0] * s.C[3] - s.C[1] * s.C[2] !== 0 && s.k1 !== 0 && s.k2 !== 0 && Math.abs(s.k1) <= 30 && Math.abs(s.k2) <= 30 && s.C[0] !== s.C[2]; });
    var C = s.C, E = [eqT([[C[0], 'x'], [C[1], 'y']], s.k1), eqT([[C[2], 'x'], [C[3], 'y']], s.k2)];
    var names = [['x', 0], ['y', 0], ['x', 1], ['y', 1]];
    var ui = names[pos], u = ui[0], eq = ui[1], cu = C[pos], ko = C[pos % 2 === 0 ? pos + 1 : pos - 1], ov = u === 'x' ? 'y' : 'x', kk = eq ? s.k2 : s.k1;
    var isoTex = u + '=' + T([[-ko * cu, ov], [kk * cu, '']]);
    var opts = names.map(function (n, i) { return { html: t(n[0]) + ' in ' + t(E[n[1]]), right: i === pos, why: 'In ' + t(E[n[1]]) + ', ' + t(n[0]) + ' has a coefficient of ' + t(C[i]) + ': isolating it means dividing every term by ' + t(C[i]) + ', which makes fractions.' }; });
    return mc(r, 'To solve this system by substitution <b>without fractions</b>, which variable should you isolate first?' + sysT(E[0], E[1]), opts,
      'Only ' + t(u) + ' in ' + t(E[eq]) + ' has a coefficient of ' + t(cu) + ', so isolating it takes one step and gives no fractions: ' + t(isoTex) + '.',
      ['Look for a variable with a coefficient of ' + t('1') + ' or ' + t('-1') + '.', 'Any other coefficient means dividing every term — fractions.'], 'which variable to isolate', true);
  }
  /* one equation with a ±1 coefficient (forms 'ax-y', 'ax+y', 'x+by', 'x-by'); returns the system and its substitution */
  function isoSys(r, o) {
    o = o || {};
    return until(function () {
      var fm = r.pick(o.forms || ['ax-y', 'ax-y', 'ax+y', 'x+by', 'x-by']), k = r.int(2, 5), x0 = r.int(o.lo == null ? -3 : o.lo, 7), y0 = r.int(o.lo == null ? -3 : o.lo, 7);
      var A1 = fm[0] === 'a' ? k : 1, B1 = fm === 'ax-y' ? -1 : fm === 'ax+y' ? 1 : fm === 'x+by' ? k : -k;
      var A2 = r.int(fm[0] === 'a' ? 1 : 2, 5), B2 = r.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
      var s = { fm: fm, A1: A1, B1: B1, A2: A2, B2: B2, x0: x0, y0: y0, c1: A1 * x0 + B1 * y0, c2: A2 * x0 + B2 * y0 };
      s.u = fm[0] === 'a' ? 'y' : 'x'; s.su = s.u === 'y' ? B1 : A1; s.ko = s.u === 'y' ? A1 : B1;
      s.sub = subObj(s.u, -s.su * s.ko, s.su * s.c1, A2, B2, s.c2);
      return s;
    }, function (s) { var det = s.A1 * s.B2 - s.A2 * s.B1; return det !== 0 && s.sub.D > 0 && s.x0 !== s.y0 && (s.x0 || s.y0) && s.c1 !== 0 && Math.abs(s.c1) <= 30 && Math.abs(s.c2) <= 40 && s.sub.D <= 14 && (!o.ok || o.ok(s)); });
  }
  function isoText(s) {
    var e1 = eqT([[s.A1, 'x'], [s.B1, 'y']], s.c1), w = work(s.sub);
    return 'In ' + t(e1) + ', ' + t(s.u) + ' has a coefficient of ' + t(s.su) + ', so isolate it: ' + (s.su === 1 ? t(w.iso) : t('-' + s.u + '=' + T([[-s.ko, s.sub.v], [s.c1, '']])) + ', so ' + t(w.iso)) + '.<br>';
  }
  function isoWrongs(s) {   // sign slip isolating; not multiplying the constant in the bracket
    var q = s.sub, W = [], mw = -q.m, pw = s.su === 1 ? q.p : -q.p;   // kept the sign of the moved term / did not divide by −1
    var den = q.alpha + q.beta * mw; if (den) { var vw = (q.c - q.beta * pw) / den; var uw = mw * vw + pw; W.push({ is: frP(q.u === 'x' ? [uw, vw] : [vw, uw]), code: 'u8x-iso-sign', hint: 'Check the signs when you isolate ' + t(q.u) + ' in the first equation' + (s.su === -1 ? ': with ' + t('-' + q.u) + ', divide <b>every</b> term by ' + t('-1') + '.' : ': the term you move changes sign.') }); }
    if (Math.abs(q.beta) >= 2) W.push({ is: subPt(q, (q.c - q.p) / q.D), code: 'u8x-distribute', hint: 'Multiply <b>both</b> terms in the bracket by ' + t(q.beta) + '.' });
    return W.filter(function (x) { return x.is; });
  }
  function l4q2(r) { // Ryan: 2x − y = 7 and 3x + 2y = 21 → (5, 3) · 3x − y = 4 and x + 2y = 13 → (3, 5)
    var s = isoSys(r), e1 = eqT([[s.A1, 'x'], [s.B1, 'y']], s.c1), e2 = eqT([[s.A2, 'x'], [s.B2, 'y']], s.c2);
    return pointPart('Solve the system by substitution. Isolate a variable first. Give the solution as an ordered pair.' + sysT(e1, e2), [s.x0, s.y0], [std(s.A1, s.B1, s.c1), std(s.A2, s.B2, s.c2)], { wrong: isoWrongs(s) },
      isoText(s) + workSol(s.sub, e2),
      ['Isolate the variable that has a coefficient of ' + t('1') + ' or ' + t('-1') + ' (here ' + t(s.u) + ' in the first equation).', 'Substitute that expression, in brackets, into the other equation; solve, then back-substitute.'], 'isolate, then substitute');
  }
  function l4q3(r) { // added (Mastery): assignment Q6 — sum 22; four times the smaller minus the larger is 3 → 17 and 5
    var s = until(function () { return { sm: r.int(3, 15), k: r.pick([2, 3, 4, 5]), d: r.int(1, 20) }; }, function (s) { var L = s.k * s.sm - s.d; return L > s.sm + 1 && L + s.sm <= 60; });
    var sm = s.sm, k = s.k, L = k * sm - s.d, S = L + sm, D = s.d, KW = { 2: 'Twice', 3: 'Three times', 4: 'Four times', 5: 'Five times' }[k];
    var sw = (D + S) / (k - 1);
    return pairPart('The sum of two numbers is ' + t(S) + '. ' + KW + ' the smaller number minus the larger number is ' + t(D) + '. Let ' + t('L') + ' be the larger number and ' + t('s') + ' the smaller number. Find the two numbers.',
      [fld('Larger number, ' + t('L') + ':', 'larger number'), fld('Smaller number, ' + t('s') + ':', 'smaller number')], [L, sm],
      [[[S - sw, 'u8x-dist-sign', 'Check the step ' + t(k + 's-(' + S + '-s)') + ': the minus sign changes the sign of <b>both</b> terms in the bracket.']], [[sw, 'u8x-dist-sign', 'Check the step ' + t(k + 's-(' + S + '-s)') + ': the minus sign changes the sign of <b>both</b> terms in the bracket.']]],
      'The system: ' + t('L+s=' + S) + ' and ' + t(k + 's-L=' + D) + '.<br>Isolate ' + t('L') + ' in the first equation (its coefficient is 1): ' + t('L=' + S + '-s') + '.<br>Substitute: ' + t(k + 's-(' + S + '-s)=' + D) + ', so ' + t(k + 's-' + S + '+s=' + D) + ', ' + t((k + 1) + 's=' + (D + S)) + ' and ' + t('s=' + sm) + '.<br>Then ' + t('L=' + S + '-' + sm + '=' + L) + '. The numbers are ' + t(L) + ' and ' + t(sm) + '.<br><b>Check.</b> ' + t(k + '(' + sm + ')-' + L + '=' + D) + ' ✓',
      ['Write one equation for the sum and one for the second sentence.', 'Isolate ' + t('L') + ' in ' + t('L+s=' + S) + ' and substitute it, in brackets, into the other equation.'], 'number problem', t('L=' + L) + ', ' + t('s=' + sm));
  }
  HW.defineExit({ lesson: 'u8l4', calc: false, outcome: 'RF9',
    blurb: 'Substitution after isolating a variable: which variable to isolate, solve a system, and a number problem.',
    questions: [Q(1, 'BEG', l4q1), Q(2, 'PRG', l4q2), Q(3, 'MAS', l4q3)] });

  /* =====================================================================================================
   * Lesson 5 — Elimination, part 1: coefficients that already match
   * ===================================================================================================== */
  function l5q1(r) { // Ryan: 4x + 3y = 5, −4x + y = 7 → add, eliminates x · 5x − 2y = 4, 3x + 2y = 12 → add, eliminates y
    var s = until(function () {
      var mv = r.pick(['x', 'y']), add = r.chance(0.5), k = r.int(2, 6), neg = mv === 'x' && r.chance(0.25), x0 = r.int(-3, 5), y0 = r.int(-3, 5);
      var o1 = mv === 'y' ? r.int(1, 6) : nz(r, -6, 6), o2 = mv === 'y' ? r.int(1, 6) : nz(r, -6, 6), k1 = neg ? -k : k, k2 = add ? -k1 : k1;
      var A1 = mv === 'x' ? k1 : o1, B1 = mv === 'x' ? o1 : k1, A2 = mv === 'x' ? k2 : o2, B2 = mv === 'x' ? o2 : k2;
      return { mv: mv, add: add, k1: k1, k2: k2, o1: o1, o2: o2, A1: A1, B1: B1, A2: A2, B2: B2, c1: A1 * x0 + B1 * y0, c2: A2 * x0 + B2 * y0 };
    }, function (s) { return Math.abs(s.o1) !== Math.abs(s.o2) && Math.abs(s.o1) !== Math.abs(s.k1) && Math.abs(s.o2) !== Math.abs(s.k1) && Math.abs(s.c1) <= 40 && Math.abs(s.c2) <= 40; });
    var E1 = eqT([[s.A1, 'x'], [s.B1, 'y']], s.c1), E2 = eqT([[s.A2, 'x'], [s.B2, 'y']], s.c2), ov = s.mv === 'x' ? 'y' : 'x';
    var terms = function (v) { var a = v === 'x' ? [s.A1, s.A2] : [s.B1, s.B2]; return t(T([[a[0], v]])) + ' and ' + t(T([[a[1], v]])); };
    var opts = [['add', 'x'], ['sub', 'x'], ['add', 'y'], ['sub', 'y']].map(function (c) {
      var right = c[1] === s.mv && (c[0] === 'add') === s.add, why;
      if (c[1] !== s.mv) why = 'The ' + t(c[1]) + '-terms, ' + terms(c[1]) + ', are neither equal nor opposites, so ' + (c[0] === 'add' ? 'adding' : 'subtracting') + ' would not eliminate ' + t(c[1]) + '.';
      else why = 'The ' + t(c[1]) + '-terms, ' + terms(c[1]) + ', are ' + (s.add ? 'opposites, so subtracting would double them instead of cancelling.' : 'equal, so adding would double them instead of cancelling.');
      return { html: (c[0] === 'add' ? 'Add' : 'Subtract') + ' the equations to eliminate ' + t(c[1]), right: right, why: why };
    });
    var oc = s.add ? s.o1 + s.o2 : s.o1 - s.o2, cc = s.add ? s.c1 + s.c2 : s.c1 - s.c2;
    return mc(r, 'What is the best first step to solve this system by elimination?' + sysT(E1, E2), opts,
      'The ' + t(s.mv) + '-terms, ' + terms(s.mv) + ', are ' + (s.add ? 'opposites, so <b>add</b>' : 'equal, so <b>subtract</b>') + ' the equations: ' + t(s.mv) + ' cancels and ' + t(T([[oc, ov]]) + '=' + cc) + ', so ' + t(ov + '=' + nT(cc / oc)) + '.',
      ['Look for a variable whose coefficients are the same (subtract) or opposites (add).', 'Opposites cancel when you add; equal terms cancel when you subtract.'], 'add or subtract', true);
  }
  function l5q2(r) { // Ryan: 2x + 3y = 5, 2x − 2y = 10 → subtract → (4, −1) · 3x + 2y = 12, 3x − y = 3 → (2, 3)
    var s = until(function () {
      var mv = r.chance(0.7) ? 'x' : 'y', sub = r.chance(0.7), k = r.int(2, 5), x0 = r.int(-4, 6), y0 = r.int(-4, 6);
      var o1 = mv === 'y' ? r.int(1, 6) : nz(r, -5, 5), o2 = mv === 'y' ? r.int(1, 6) : (sub && r.chance(0.7) ? -r.int(1, 5) : nz(r, -5, 5));
      var k1 = k, k2 = sub ? k : -k, A1 = mv === 'x' ? k1 : o1, B1 = mv === 'x' ? o1 : k1, A2 = mv === 'x' ? k2 : o2, B2 = mv === 'x' ? o2 : k2;
      return { mv: mv, sub: sub, k1: k1, o1: o1, o2: o2, A1: A1, B1: B1, A2: A2, B2: B2, x0: x0, y0: y0, c1: A1 * x0 + B1 * y0, c2: A2 * x0 + B2 * y0, oc: sub ? o1 - o2 : o1 + o2 };
    }, function (s) { return s.oc !== 0 && Math.abs(s.oc) <= 8 && s.x0 !== s.y0 && (s.x0 || s.y0) && Math.abs(s.c1) <= 40 && Math.abs(s.c2) <= 40 && s.o1 !== s.o2 && (s.sub ? s.c1 !== s.c2 : true); });
    var E1 = eqT([[s.A1, 'x'], [s.B1, 'y']], s.c1), E2 = eqT([[s.A2, 'x'], [s.B2, 'y']], s.c2), ov = s.mv === 'x' ? 'y' : 'x', cc = s.sub ? s.c1 - s.c2 : s.c1 + s.c2, v0 = cc / s.oc, P = [s.x0, s.y0];
    var ptOf = function (v) { if (!isFinite(v)) return null; var M = (s.c1 - s.o1 * v) / s.k1; return frP(s.mv === 'x' ? [M, v] : [v, M]); };
    var W = [];
    if (s.sub) {
      if (s.o1 + s.o2 !== 0) W.push({ is: ptOf((s.c1 - s.c2) / (s.o1 + s.o2)), code: 'u8x-elim-sign', hint: 'Subtract <b>every</b> term: ' + t(T([[s.o1, ov]]) + '-' + pT(s.o2) + ov + '=' + T([[s.oc, ov]])) + ' — subtracting a negative adds.' });
      W.push({ is: ptOf((s.c1 + s.c2) / s.oc), code: 'u8x-elim-rhs', hint: 'You subtracted the left sides — subtract the right sides too: ' + t(s.c1 + '-' + pT(s.c2)) + '.' });
      W.push({ is: ptOf((s.c2 - s.c1) / s.oc), code: 'u8x-elim-rhs', hint: 'Subtract the right sides in the same order as the left sides: ' + t(s.c1 + '-' + pT(s.c2)) + '.' });
    } else W.push({ is: ptOf((s.c1 - s.c2) / s.oc), code: 'u8x-elim-rhs', hint: 'You added the left sides — add the right sides too: ' + t(s.c1 + '+' + pT(s.c2)) + '.' });
    var bs = backSub(s.A1, s.B1, s.c1, ov, v0);
    return pointPart('Solve the system by elimination. Give the solution as an ordered pair.' + sysT(E1, E2), P, [std(s.A1, s.B1, s.c1), std(s.A2, s.B2, s.c2)], { wrong: W.filter(function (x) { return x.is; }) },
      'The ' + t(s.mv) + '-terms are ' + (s.sub ? 'equal, so <b>subtract</b>' : 'opposites, so <b>add</b>') + ' the equations:<br>' + t((s.sub ? T([[s.o1, ov]]) + '-' + (s.o2 < 0 ? '(' + T([[s.o2, ov]]) + ')' : T([[s.o2, ov]])) + '=' + s.c1 + '-' + pT(s.c2) : T([[s.o1, ov]]) + '+' + (s.o2 < 0 ? '(' + T([[s.o2, ov]]) + ')' : T([[s.o2, ov]])) + '=' + s.c1 + '+' + pT(s.c2))) + '<br>' + t(T([[s.oc, ov]]) + '=' + cc) + (s.oc !== 1 ? ', so ' + t(ov + '=' + nT(v0)) : '') + '.<br>Substitute into the first equation: ' + bs.txt + '.<br>The solution is ' + t(ptT(P)) + '. <b>Check</b> in the second equation: ' + t(mT(s.A2, s.x0) + plusMT(s.B2, s.y0) + '=' + s.c2) + ' ✓',
      ['Equal coefficients: subtract the equations. Opposite coefficients: add them.', 'Subtract (or add) <b>every</b> term, the constants too. Then substitute to find the other variable.'], 'elimination, coefficients match');
  }
  function l5q3(r) { // added (Mastery): assignment Q8 (2a + b = 23, 2a − b = 9) and Q9 (boat: 22 km/h downstream, 14 km/h upstream)
    if (r.chance(0.55)) {
      var plane = r.chance(0.35), o = until(function () { return plane ? { b: 10 * r.int(18, 45), c: 10 * r.int(2, 6) } : { b: r.int(8, 30), c: r.int(2, 8) }; }, function (o) { return o.b > 3 * o.c; });
      var dn = o.b + o.c, up = o.b - o.c, V = plane ? { who: 'A small plane', with: 'with the wind', ag: 'against the wind', med: 'wind', still: 'in still air', s: 'p', w: 'w' } : { who: 'A boat', with: 'downstream (with the current)', ag: 'upstream (against the current)', med: 'current', still: 'in still water', s: 'b', w: 'c' };
      return pairPart(V.who + ' travels at ' + t(dn) + ' km/h ' + V.with + ' and at ' + t(up) + ' km/h ' + V.ag + '. Going ' + V.with.replace(/ \(.*\)$/, '') + ', the ' + V.med + '’s speed adds to the ' + (plane ? 'plane' : 'boat') + '’s speed ' + V.still + '; going ' + V.ag.replace(/ \(.*\)$/, '') + ', it is taken away. Find the ' + (plane ? 'plane' : 'boat') + '’s speed ' + V.still + ', ' + t(V.s) + ', and the speed of the ' + V.med + ', ' + t(V.w) + '.',
        [fld((plane ? 'Plane' : 'Boat') + ' ' + V.still + ', ' + t(V.s) + ':', 'speed ' + V.still, 'km/h'), fld('Speed of the ' + V.med + ', ' + t(V.w) + ':', 'speed of the ' + V.med, 'km/h')], [o.b, o.c],
        [[[dn, 'u8x-bc-ground', t(dn) + ' km/h is the speed ' + V.with.replace(/ \(.*\)$/, '') + ' (' + t(V.s + '+' + V.w) + '). Write a system and solve it.'], [up, 'u8x-bc-ground', t(up) + ' km/h is the speed ' + V.ag.replace(/ \(.*\)$/, '') + ' (' + t(V.s + '-' + V.w) + '). Write a system and solve it.'], [dn + up, 'u8x-bc-nohalf', 'Adding the equations gives ' + t('2' + V.s + '=' + (dn + up)) + ': divide by 2.']],
          [[dn - up, 'u8x-bc-nohalf', 'Subtracting the equations gives ' + t('2' + V.w + '=' + (dn - up)) + ': divide by 2.']]],
        'The system: ' + t(V.s + '+' + V.w + '=' + dn) + ' and ' + t(V.s + '-' + V.w + '=' + up) + '.<br>The ' + t(V.w) + '-terms are opposites, so add: ' + t('2' + V.s + '=' + (dn + up)) + ', so ' + t(V.s + '=' + o.b) + ' km/h.<br>Then ' + t(o.b + '+' + V.w + '=' + dn) + ', so ' + t(V.w + '=' + o.c) + ' km/h.<br><b>Check.</b> ' + t(o.b + '-' + o.c + '=' + up) + ' ✓',
        ['Write one equation for each speed: ' + V.with.replace(/ \(.*\)$/, '') + ' the speeds add, ' + V.ag.replace(/ \(.*\)$/, '') + ' they subtract.', 'Add the two equations to eliminate ' + t(V.w) + '.'], plane ? 'plane and wind' : 'boat and current', t(V.s + '=' + o.b) + ' km/h, ' + t(V.w + '=' + o.c) + ' km/h');
    }
    var n = until(function () { return { k: r.pick([2, 2, 3]), a: r.int(2, 12), b: r.int(1, 15) }; }, function (n) { return n.k * n.a - n.b > 0 && n.k * n.a !== n.b && n.a !== n.b && n.k * n.a + n.b <= 50; });
    var S = n.k * n.a + n.b, Dd = n.k * n.a - n.b, KW = n.k === 2 ? 'Twice' : 'Three times', kw = n.k === 2 ? 'twice' : 'three times';
    return pairPart(KW + ' a number ' + t('a') + ' plus a number ' + t('b') + ' is ' + t(S) + '. ' + KW + ' ' + t('a') + ' minus ' + t('b') + ' is ' + t(Dd) + '. Find ' + t('a') + ' and ' + t('b') + '.',
      [fld(t('a') + ' =', 'a'), fld(t('b') + ' =', 'b')], [n.a, n.b],
      [[[n.k * n.a, 'u8x-ka', 'That is ' + t(n.k + 'a') + ' (' + kw + ' the number). Divide by ' + t(n.k) + ' to find ' + t('a') + '.'], [S + Dd, 'u8x-ka', 'Adding the equations gives ' + t(2 * n.k + 'a=' + (S + Dd)) + ': divide by ' + t(2 * n.k) + '.']], []],
      'The system: ' + t(n.k + 'a+b=' + S) + ' and ' + t(n.k + 'a-b=' + Dd) + '.<br>The ' + t('b') + '-terms are opposites, so add: ' + t(2 * n.k + 'a=' + (S + Dd)) + ', so ' + t('a=' + n.a) + '.<br>Then ' + t(n.k + '(' + n.a + ')+b=' + S) + ', so ' + t('b=' + n.b) + '.<br><b>Check.</b> ' + t(n.k + '(' + n.a + ')-' + n.b + '=' + Dd) + ' ✓',
      ['Write each sentence as an equation in ' + t('a') + ' and ' + t('b') + '.', 'The ' + t('b') + '-terms are opposites: add the equations.'], 'twice a number plus another', t('a=' + n.a) + ', ' + t('b=' + n.b));
  }
  HW.defineExit({ lesson: 'u8l5', calc: false, outcome: 'RF9',
    blurb: 'Elimination when coefficients already match: add or subtract, solve a system, and a speed or number problem.',
    questions: [Q(1, 'BEG', l5q1), Q(2, 'PRG', l5q2), Q(3, 'MAS', l5q3)] });

  /* =====================================================================================================
   * Lesson 6 — Elimination, part 2: multiplying first
   * ===================================================================================================== */
  var COP = [[2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2], [3, 5], [5, 3], [4, 5], [5, 4]];
  function l6q1(r) { // Ryan: 3x + 4y = 10, 5x − 3y = 7 → Eq. 1 × 3, Eq. 2 × 4 · 4x + 3y = 11, 3x − 2y = 4 → Eq. 1 × 2, Eq. 2 × 3
    var s = until(function () {
      var tv = r.chance(0.75) ? 'y' : 'x', pr = r.pick(COP), negFirst = r.chance(0.3), o1 = r.int(2, 6), o2 = r.int(2, 6), x0 = r.int(1, 5), y0 = r.int(-2, 5);
      var t1 = negFirst ? -pr[0] : pr[0], t2 = negFirst ? pr[1] : -pr[1];
      var A1 = tv === 'x' ? t1 : o1, B1 = tv === 'x' ? o1 : t1, A2 = tv === 'x' ? t2 : o2, B2 = tv === 'x' ? o2 : t2;
      return { tv: tv, t1: t1, t2: t2, o1: o1, o2: o2, A1: A1, B1: B1, A2: A2, B2: B2, c1: A1 * x0 + B1 * y0, c2: A2 * x0 + B2 * y0 };
    }, function (s) {
      var a = Math.abs(s.t1), b = Math.abs(s.t2), L = a * b;
      return !(s.o2 === b && s.o1 === a) && !(s.o2 === a && s.o1 === b) && !(s.o1 === L && s.o2 === L) && s.A1 * s.B2 - s.A2 * s.B1 !== 0 && Math.abs(s.c1) <= 40 && Math.abs(s.c2) <= 40;
    });
    var a = Math.abs(s.t1), b = Math.abs(s.t2), L = a * b, ov = s.tv === 'x' ? 'y' : 'x';
    var E1 = eqT([[s.A1, 'x'], [s.B1, 'y']], s.c1), E2 = eqT([[s.A2, 'x'], [s.B2, 'y']], s.c2);
    var times = function (k, A, Bc, c) { return t(eqT([[k * A, 'x'], [k * Bc, 'y']], k * c)); };
    var opts = [{ html: 'Eq. 1 by ' + t(b) + ', Eq. 2 by ' + t(a), right: true },
      { html: 'Eq. 1 by ' + t(a) + ', Eq. 2 by ' + t(b), why: 'That gives ' + t(T([[s.t1 * a, s.tv]])) + ' and ' + t(T([[s.t2 * b, s.tv]])) + ': not opposites, so ' + t(s.tv) + ' doesn’t cancel. Multiply each equation by the <b>other</b> equation’s ' + t(s.tv) + '-coefficient.' },
      { html: 'Eq. 1 by ' + t(s.o2) + ', Eq. 2 by ' + t(s.o1), why: 'Those multipliers make the ' + t(ov) + '-terms the same size (' + t(T([[s.o1 * s.o2, ov]])) + '), not the ' + t(s.tv) + '-terms.' },
      { html: 'Eq. 1 by ' + t(L) + ', Eq. 2 by ' + t(L), why: 'Multiplying both by ' + t(L) + ' gives ' + t(T([[s.t1 * L, s.tv]])) + ' and ' + t(T([[s.t2 * L, s.tv]])) + ' — still not opposites. Each equation needs its own multiplier.' }];
    return mc(r, 'To eliminate ' + t(s.tv) + ' by <b>adding</b>, what should you multiply each equation by?<br>Eq. 1: ' + t(E1) + '<br>Eq. 2: ' + t(E2), opts,
      'The lowest common multiple of ' + t(a) + ' and ' + t(b) + ' is ' + t(L) + '.<br>Eq. 1 × ' + t(b) + ': ' + times(b, s.A1, s.B1, s.c1) + '<br>Eq. 2 × ' + t(a) + ': ' + times(a, s.A2, s.B2, s.c2) + '<br>Now ' + t(T([[s.t1 * b, s.tv]])) + ' and ' + t(T([[s.t2 * a, s.tv]])) + ' are opposites, so they cancel when you add.',
      ['Make the ' + t(s.tv) + '-coefficients opposites with the same size: the lowest common multiple of ' + t(a) + ' and ' + t(b) + '.', 'Multiply each equation by the <b>other</b> equation’s ' + t(s.tv) + '-coefficient (without its sign).'], 'which multipliers');
  }
  function l6q2(r) { // Ryan: x + 3y = 14, 2x − y = 7, multiply the second by 3 → (5, 3) · 3x + y = 7, x − 2y = 0, multiply the first by 2 → (2, 1)
    var s = until(function () {
      var which = r.pick([0, 1]), sg = r.pick([1, -1]), k = r.int(2, 4), aS = r.int(1, 4), aO = r.int(1, 4), x0 = r.int(-2, 7), y0 = r.int(-2, 6);
      return { which: which, sg: sg, k: k, aS: aS, aO: aO, x0: x0, y0: y0, cS: aS * x0 + sg * y0, cO: aO * x0 - sg * k * y0 };
    }, function (s) { return s.x0 !== s.y0 && (s.x0 || s.y0) && s.x0 !== 0 && Math.abs(s.cS) <= 30 && Math.abs(s.cO) <= 40 && s.k * s.aS + s.aO <= 12 && s.aS !== s.k * s.aO; });
    var ES = eqT([[s.aS, 'x'], [s.sg, 'y']], s.cS), EO = eqT([[s.aO, 'x'], [-s.sg * s.k, 'y']], s.cO), E1 = s.which ? EO : ES, E2 = s.which ? ES : EO, P = [s.x0, s.y0];
    var Sk = eqT([[s.k * s.aS, 'x'], [s.k * s.sg, 'y']], s.k * s.cS), cx = s.k * s.aS + s.aO, rx = s.k * s.cS + s.cO;
    var xw = (s.cS + s.cO) / cx, W = [{ is: frP([xw, (s.cO - s.aO * xw) / (-s.sg * s.k)]), code: 'u8x-elim-const', hint: 'Multiply <b>every</b> term by ' + t(s.k) + ', the constant too: ' + t(Sk) + '.' }, { is: frP([xw, (s.cS - s.aS * xw) / s.sg]), code: 'u8x-elim-const', hint: 'Multiply <b>every</b> term by ' + t(s.k) + ', the constant too: ' + t(Sk) + '.' }];
    var bs = backSub(s.aS, s.sg, s.cS, 'x', s.x0);
    return pointPart('Solve the system by elimination: multiply the ' + (s.which ? 'second' : 'first') + ' equation by ' + t(s.k) + ', then add the equations. Give the solution as an ordered pair.' + sysT(E1, E2), P, [std(s.aS, s.sg, s.cS), std(s.aO, -s.sg * s.k, s.cO)], { wrong: W.filter(function (x) { return x.is; }) },
      'Multiply ' + t(ES) + ' by ' + t(s.k) + ': ' + t(Sk) + '.<br>Add it to ' + t(EO) + ': the ' + t('y') + '-terms cancel, so ' + t(cx + 'x=' + rx) + ' and ' + t('x=' + s.x0) + '.<br>Substitute into ' + t(ES) + ': ' + bs.txt + '.<br>The solution is ' + t(ptT(P)) + '. <b>Check</b> in ' + t(EO) + ': ' + t(mT(s.aO, s.x0) + plusMT(-s.sg * s.k, s.y0) + '=' + s.cO) + ' ✓',
      ['Multiply <b>every</b> term of that equation by ' + t(s.k) + ' — the constant too.', 'Then the ' + t('y') + '-terms are opposites: add, solve for ' + t('x') + ', and substitute back.'], 'multiply one equation, then add');
  }
  function l6q3(r) { // added (Mastery): assignment Q4 — multiply both equations: 2x + 3y = 13, 3x − 2y = 0 → (2, 3)
    var s = until(function () {
      var a1 = r.int(2, 5), a2 = r.int(2, 5), b1 = r.int(2, 5), b2 = r.chance(0.75) ? -r.int(2, 5) : r.int(2, 5), x0 = r.int(-2, 5), y0 = r.int(-2, 5);
      return { a1: a1, a2: a2, b1: b1, b2: b2, x0: x0, y0: y0, c1: a1 * x0 + b1 * y0, c2: a2 * x0 + b2 * y0 };
    }, function (s) {
      var B1 = Math.abs(s.b1), B2 = Math.abs(s.b2);
      return s.a1 !== s.a2 && s.a1 % s.a2 && s.a2 % s.a1 && B1 !== B2 && B1 % B2 && B2 % B1 && gcd(s.a1, B1) === 1 && gcd(s.a2, B2) === 1 && s.a1 * s.b2 - s.a2 * s.b1 !== 0 && s.x0 !== s.y0 && s.x0 !== 0 && s.y0 !== 0 && Math.abs(s.c1) <= 30 && Math.abs(s.c2) <= 30;
    });
    var B1 = Math.abs(s.b1), B2 = Math.abs(s.b2), L = B1 * B2 / gcd(B1, B2), k1 = L / B1, k2 = L / B2, add = s.b2 < 0, sg = add ? 1 : -1;
    var cx = k1 * s.a1 + sg * k2 * s.a2, rx = k1 * s.c1 + sg * k2 * s.c2, P = [s.x0, s.y0];
    var E1 = eqT([[s.a1, 'x'], [s.b1, 'y']], s.c1), E2 = eqT([[s.a2, 'x'], [s.b2, 'y']], s.c2);
    var W = [];
    [[s.c1 + sg * k2 * s.c2], [k1 * s.c1 + sg * s.c2]].forEach(function (rw) { var xw = rw[0] / cx; W.push({ is: frP([xw, (s.c1 - s.a1 * xw) / s.b1]), code: 'u8x-elim-const', hint: 'When you multiply an equation, multiply <b>every</b> term — the constant on the right too.' }); });
    var bs = backSub(s.a1, s.b1, s.c1, 'x', s.x0);
    return pointPart('Solve the system by elimination. Give the solution as an ordered pair.' + sysT(E1, E2), P, [std(s.a1, s.b1, s.c1), std(s.a2, s.b2, s.c2)], { wrong: W.filter(function (x) { return x.is; }) },
      'Neither variable lines up, so multiply <b>both</b> equations. Eliminate ' + t('y') + ': the lowest common multiple of ' + t(B1) + ' and ' + t(B2) + ' is ' + t(L) + '.<br>First equation × ' + t(k1) + ': ' + t(eqT([[k1 * s.a1, 'x'], [k1 * s.b1, 'y']], k1 * s.c1)) + '<br>Second equation × ' + t(k2) + ': ' + t(eqT([[k2 * s.a2, 'x'], [k2 * s.b2, 'y']], k2 * s.c2)) + '<br>' + (add ? 'Add' : 'Subtract') + ': ' + t(cx + 'x=' + rx) + ', so ' + t('x=' + s.x0) + '.<br>Substitute into the first equation: ' + bs.txt + '.<br>The solution is ' + t(ptT(P)) + '. <b>Check</b> in the second equation: ' + t(mT(s.a2, s.x0) + plusMT(s.b2, s.y0) + '=' + s.c2) + ' ✓',
      ['No coefficient is a multiple of the matching one, so multiply <b>both</b> equations (use the lowest common multiple of two matching coefficients).', 'Multiply every term, the constants too; then add or subtract.'], 'multiply both equations');
  }
  HW.defineExit({ lesson: 'u8l6', calc: false, outcome: 'RF9',
    blurb: 'Elimination after multiplying: which multipliers, multiply one equation and add, and multiply both equations.',
    questions: [Q(1, 'BEG', l6q1), Q(2, 'PRG', l6q2), Q(3, 'MAS', l6q3)] });

  /* =====================================================================================================
   * Lesson 7 — Word problems with systems (number/age, cost, mixture)
   * ===================================================================================================== */
  var SALES = [
    { intro: 'A bake sale sells muffins for {pa} each and cookies for {pb} each. It sold {N} items in total for {V}.', a: ['muffins', 'm'], b: ['cookies', 'c'], pa: [3, 4], pb: [1, 2], N: [20, 50], it: 'items', verb: 'sold' },
    { intro: 'A theatre sells adult tickets for {pa} and child tickets for {pb}. It sold {N} tickets for {V} in total.', a: ['adult tickets', 'a'], b: ['child tickets', 'c'], pa: [10, 14], pb: [5, 8], N: [20, 40], it: 'tickets', verb: 'sold' },
    { intro: 'A school store sells binders for {pa} and notebooks for {pb}. One week it sold {N} of them for {V} in total.', a: ['binders', 'b'], b: ['notebooks', 'n'], pa: [4, 6], pb: [1, 3], N: [15, 40], it: 'items', verb: 'sold' },
    { intro: 'A fundraiser sells large pizzas for {pa} and small pizzas for {pb}. It sold {N} pizzas for {V} in total.', a: ['large pizzas', 'l'], b: ['small pizzas', 's'], pa: [12, 16], pb: [7, 10], N: [10, 30], it: 'pizzas', verb: 'sold' },
    { intro: 'A car wash charges {pa} for a truck and {pb} for a car. One Saturday it washed {N} vehicles and took in {V}.', a: ['trucks', 't'], b: ['cars', 'c'], pa: [9, 12], pb: [5, 7], N: [15, 40], it: 'vehicles', verb: 'washed' }];
  var L7Q1 = { num: '1', shared: function (r) {   // Ryan: muffins $3, cookies $2, 45 items, $110 → 20 muffins · adult $12, child $8, 30 tickets, $296 → 14 adult
      return until(function () {
        var c = r.pick(SALES), pa = r.int(c.pa[0], c.pa[1]), pb = r.int(c.pb[0], c.pb[1]), N = r.int(c.N[0], c.N[1]), x = r.int(3, N - 3);
        return { c: c, pa: pa, pb: pb, N: N, x: x, y: N - x, V: pa * x + pb * N - pb * x, askA: r.chance(0.65) };
      }, function (s) { return s.pa > s.pb && s.x !== s.y && s.V <= 600; });
    },
    stem: function (s) { var c = s.c; return c.intro.replace('{pa}', money(s.pa)).replace('{pb}', money(s.pb)).replace('{N}', t(s.N)).replace('{V}', money(s.V)) + ' Let ' + t(c.a[1]) + ' be the number of ' + c.a[0] + ' and ' + t(c.b[1]) + ' the number of ' + c.b[0] + '.'; },
    parts: [
      { id: '1a', outcome: 'RF9', level: 'PRG', make: function (r, s) {
        var c = s.c, A = c.a[1], Bv = c.b[1], cnt = A + '+' + Bv + '=' + s.N, val = s.pa + A + '+' + s.pb + Bv + '=' + s.V;
        var sys = function (e1, e2) { return t(e1) + ' and ' + t(e2); };
        var opts = [{ html: sys(cnt, val), right: true },
          { html: sys(A + '+' + Bv + '=' + s.V, s.pa + A + '+' + s.pb + Bv + '=' + s.N), why: 'The count goes with ' + t(A + '+' + Bv) + ' (' + t(s.N) + ' ' + c.it + '); the money goes with the prices (' + money(s.V) + ').' },
          { html: sys(cnt, s.pb + A + '+' + s.pa + Bv + '=' + s.V), why: 'Each price goes with its own item: ' + c.a[0] + ' cost ' + money(s.pa) + ', so the money from them is ' + t(s.pa + A) + '.' },
          { html: sys(cnt, (s.pa + s.pb) + '(' + A + '+' + Bv + ')=' + s.V), why: t((s.pa + s.pb) + '(' + A + '+' + Bv + ')') + ' would charge ' + money(s.pa + s.pb) + ' for every item. Each kind has its own price: (price × number) for each kind, added.' }];
        return mc(r, 'Which system models this situation?', opts,
          'Count: ' + t(cnt) + '.<br>Value (price × number for each kind, added): ' + t(val) + '.',
          ['One equation counts the ' + c.it + '; the other adds up the money.', 'Money from one kind = (its price) × (how many).'], 'which system: ' + c.a[0]);
      } },
      { id: '1b', outcome: 'RF9', level: 'PRG', make: function (r, s) {
        var c = s.c, A = c.a[1], Bv = c.b[1], ans = s.askA ? s.x : s.y, other = s.askA ? s.y : s.x, nm = s.askA ? c.a[0] : c.b[0];
        var dl = [[other, 'u8x-other', 'That is the number of ' + (s.askA ? c.b[0] : c.a[0]) + '. The question asks for the ' + nm + ' — check which price goes with which item.'], [s.N, 'u8x-total', t(s.N) + ' is the total number of ' + c.it + '. Solve the system to split it.']];
        if (s.askA) dl.push([(s.V - s.N) / (s.pa - s.pb), 'u8x-elim-const', 'When you multiply ' + t(A + '+' + Bv + '=' + s.N) + ' by ' + t(s.pb) + ', multiply the ' + t(s.N) + ' too.']);
        return numPart('Solve the system. How many <b>' + nm + '</b> were ' + c.verb + '?', ans, dl,
          'Multiply ' + t(A + '+' + Bv + '=' + s.N) + ' by ' + t(s.pb) + ': ' + t(s.pb + A + '+' + s.pb + Bv + '=' + s.pb * s.N) + '.<br>Subtract it from ' + t(s.pa + A + '+' + s.pb + Bv + '=' + s.V) + ': ' + t((s.pa - s.pb === 1 ? '' : s.pa - s.pb) + A + '=' + (s.V - s.pb * s.N)) + ', so ' + t(A + '=' + s.x) + '.<br>Then ' + t(Bv + '=' + s.N + '-' + s.x + '=' + s.y) + '. So ' + t(s.x) + ' ' + c.a[0] + ' and ' + t(s.y) + ' ' + c.b[0] + '.<br><b>Check.</b> ' + t(s.pa + '(' + s.x + ')+' + s.pb + '(' + s.y + ')=' + s.V) + ' ✓',
          ['Eliminate ' + t(Bv) + ': multiply the count equation by ' + t(s.pb) + ' and subtract (or substitute ' + t(Bv + '=' + s.N + '-' + A) + ').', 'Answer the question that was asked: the number of ' + nm + '.'], 'solve: how many ' + nm, { after: nm });
      } }] };
  var AGES = [{ o: 'Maya', op: 'her', y: 'Leo', yp: 'his', oR: 'sister', yR: 'brother' }, { o: 'Ana', op: 'her', y: 'Ben', yp: 'his', oR: 'sister', yR: 'brother' }, { o: 'Sofia', op: 'her', y: 'Diego', yp: 'his', oR: 'sister', yR: 'brother' },
    { o: 'Omar', op: 'his', y: 'Priya', yp: 'her', oR: 'brother', yR: 'sister' }, { o: 'Jacob', op: 'his', y: 'Liam', yp: 'his', oR: 'brother', yR: 'brother' }, { o: 'Emma', op: 'her', y: 'Ava', yp: 'her', oR: 'sister', yR: 'sister' }];
  function l7q2(r) { // Ryan: Maya is 6 years older than her brother Leo; sum 28 → Leo 11 · Ben is 4 years younger than his sister Ana; sum 30 → Ben 13
    var n = r.pick(AGES), Y = r.int(5, 16), d = r.int(2, 9), S = 2 * Y + d, O = Y + d, older = r.chance(0.5), askY = r.chance(0.6);
    var rel = older ? n.o + ' is ' + t(d) + ' years older than ' + n.op + ' ' + n.yR + ' ' + n.y + '.' : n.y + ' is ' + t(d) + ' years younger than ' + n.yp + ' ' + n.oR + ' ' + n.o + '.';
    var who = askY ? n.y : n.o, ans = askY ? Y : O, oL = n.o.charAt(0), yL = n.y.charAt(0) === oL ? n.y.charAt(0).toLowerCase() : n.y.charAt(0);
    var dl = [[askY ? O : Y, 'u8x-other', 'That is ' + (askY ? n.o : n.y) + '’s age (or the “' + (older ? 'older' : 'younger') + ' than” sentence turned around). ' + n.o + ' is the older one.'], [S - d, 'u8x-age-nohalf', t('2' + yL + '=' + (S - d)) + ' — divide by 2 to finish.']];
    if (S % 2 === 0) dl.push([S / 2, 'u8x-age-half', 'Splitting ' + t(S) + ' in half ignores the ' + t(d) + '-year difference. Write two equations and solve.']);
    return numPart(rel + ' The sum of their ages is ' + t(S) + '. How old is <b>' + who + '</b>?', ans, dl,
      'Let ' + t(oL) + ' be ' + n.o + '’s age and ' + t(yL) + ' be ' + n.y + '’s age:<br>' + t(oL + '+' + yL + '=' + S) + ' and ' + t(oL + '=' + yL + '+' + d) + '.<br>Substitute: ' + t('(' + yL + '+' + d + ')+' + yL + '=' + S) + ', so ' + t('2' + yL + '+' + d + '=' + S) + ', ' + t('2' + yL + '=' + (S - d)) + ' and ' + t(yL + '=' + Y) + '.<br>Then ' + t(oL + '=' + Y + '+' + d + '=' + O) + '. ' + n.y + ' is ' + Y + ' and ' + n.o + ' is ' + O + '.<br><b>Check.</b> ' + t(O + '+' + Y + '=' + S) + ' ✓',
      ['Write one equation for the sum and one for the difference: the older age = the younger age + ' + t(d) + '.', 'Substitute and solve; then answer for the person asked about.'], 'age problem', { after: 'years old' });
  }
  var MIX = [{ who: 'A store mixes', a: 'raisins', b: 'almonds', mix: 'trail mix', pa: [3, 5], pb: [8, 12] }, { who: 'A coffee shop blends', a: 'light roast beans', b: 'dark roast beans', mix: 'house blend', pa: [8, 10], pb: [13, 16] },
    { who: 'A candy store mixes', a: 'jelly beans', b: 'chocolates', mix: 'party mix', pa: [4, 6], pb: [9, 12] }, { who: 'A pet store mixes', a: 'seed', b: 'nuts', mix: 'bird food', pa: [2, 4], pb: [7, 10] }];
  function l7q3(r) { // added (Mastery): assignment Q9 (raisins $4/kg, almonds $9/kg, 25 kg for $170 → 11 kg and 14 kg) and Q10
    var c = r.pick(MIX), s = until(function () { return { pa: r.int(c.pa[0], c.pa[1]), pb: r.int(c.pb[0], c.pb[1]), x: r.int(2, 15), y: r.int(2, 15) }; }, function (s) { return s.x !== s.y && s.x + s.y <= 30 && s.pa * s.x + s.pb * s.y <= 400; });
    var N = s.x + s.y, V = s.pa * s.x + s.pb * s.y;
    return pairPart(c.who + ' ' + c.a + ' that sell for ' + money(s.pa) + ' per kg with ' + c.b + ' that sell for ' + money(s.pb) + ' per kg. It makes ' + t(N) + ' kg of ' + c.mix + ' worth ' + money(V) + ' in total. How many kilograms of each are in the mix?',
      [fld(c.a.charAt(0).toUpperCase() + c.a.slice(1) + ':', c.a, 'kg'), fld(c.b.charAt(0).toUpperCase() + c.b.slice(1) + ':', c.b, 'kg')], [s.x, s.y], [[[N, 'u8x-total', t(N) + ' kg is the whole mix.']], [[N, 'u8x-total', t(N) + ' kg is the whole mix.']]],
      'Let ' + t('x') + ' be the kg of ' + c.a + ' and ' + t('y') + ' the kg of ' + c.b + ':<br>' + t('x+y=' + N) + ' (mass) and ' + t(s.pa + 'x+' + s.pb + 'y=' + V) + ' (value).<br>Multiply the first by ' + t(s.pa) + ': ' + t(s.pa + 'x+' + s.pa + 'y=' + s.pa * N) + '. Subtract it from the second: ' + t((s.pb - s.pa) + 'y=' + (V - s.pa * N)) + ', so ' + t('y=' + s.y) + '.<br>Then ' + t('x=' + N + '-' + s.y + '=' + s.x) + '. So ' + t(s.x) + ' kg of ' + c.a + ' and ' + t(s.y) + ' kg of ' + c.b + '.<br><b>Check.</b> ' + t(s.pa + '(' + s.x + ')+' + s.pb + '(' + s.y + ')=' + V) + ' ✓',
      ['One equation adds the masses; the other adds the values (price per kg × kg).', 'Solve by elimination: multiply the mass equation by one of the prices and subtract.'], 'mixture: ' + c.mix, t(s.x) + ' kg of ' + c.a + ', ' + t(s.y) + ' kg of ' + c.b);
  }
  HW.defineExit({ lesson: 'u8l7', calc: false, outcome: 'RF9',
    blurb: 'Word problems: choose the system for a cost problem and solve it, an age problem, and a mixture problem.',
    questions: [L7Q1, Q(2, 'PRG', l7q2), Q(3, 'MAS', l7q3)] });

  /* =====================================================================================================
   * Lesson 8 — Unit review
   * ===================================================================================================== */
  function l8q1(r) { // Ryan: elimination ends with 0 = 8 → parallel lines, no solution · 0 = 0 → same line, infinitely many
    var inf = r.chance(0.45), elim = r.chance(0.6), res;
    if (inf) { var a = r.chance(0.6) ? 0 : nz(r, -9, 9); res = [a, a]; }
    else res = r.chance(0.6) ? [0, nz(r, -12, 12)] : until(function () { return [nz(r, -9, 9), r.int(-9, 9)]; }, function (p) { return p[0] !== p[1]; });
    var rT = res[0] + '=' + res[1], X = Math.abs(res[0]) <= 3 && Math.abs(res[1]) <= 3 ? res : [r.int(-2, 2), r.int(-2, 2)];
    var opts = [{ html: 'Lines cross at ' + t(ptT(res)) + '<br>' + crossPic(r, X), why: t(rT) + ' has no ' + t('x') + ' or ' + t('y') + ' left in it — it is not a point. ' + (inf ? 'It is always true, so every point on the line works.' : 'It is false, so no point works.') },
      { html: 'Parallel lines: no solution<br>' + parPic(r), right: !inf, why: t(rT) + ' is always <b>true</b>: the equations describe the same line, so every point on it is a solution.' },
      { html: 'Same line: infinitely many solutions<br>' + samePic(r), right: inf, why: t(rT) + ' is <b>false</b>: no ' + t('(x,\\ y)') + ' makes both equations true, so the lines never meet.' }];
    var p = mc(r, 'While solving a system by ' + (elim ? 'elimination, both variables cancel' : 'substitution, the variable cancels') + ' and a student ends up with ' + t(rT) + '. Which choice describes the system?', opts,
      inf ? t(rT) + ' is always true, so every point that works in one equation works in the other: the two equations are the <b>same line</b>, with infinitely many solutions.' : t(rT) + ' is false, so no ' + t('(x,\\ y)') + ' works in both equations. The lines are <b>parallel</b>: no solution.',
      ['When the variables cancel, look at what is left: is it true or false?', 'True (like ' + t('0=0') + '): the same line. False (like ' + t('0=8') + '): parallel lines.'], 'variables cancel: ' + (inf ? 'true' : 'false'), true);
    p.input.columns = 2;
    return p;
  }
  function l8q2(r) { // Ryan: 2x − y = 5, 4x + 3y = 25 → (4, 3) · 3x − y = 8, 2x + 3y = 9 → (3, 1)
    var s = isoSys(r, { forms: ['ax-y', 'ax-y', 'ax+y'], lo: -2 }), e1 = eqT([[s.A1, 'x'], [s.B1, 'y']], s.c1), e2 = eqT([[s.A2, 'x'], [s.B2, 'y']], s.c2), P = [s.x0, s.y0];
    var W = isoWrongs(s);
    if (s.B1 * s.B2 < 0) { var k = Math.abs(s.B2), xw = (s.c1 + s.c2) / (k * s.A1 + s.A2); W.push({ is: frP([xw, (s.c1 - s.A1 * xw) / s.B1]), code: 'u8x-elim-const', hint: 'If you multiply the first equation by ' + t(k) + ', multiply the constant ' + t(s.c1) + ' too.' }); }
    if (s.y0 !== 0) W.push({ is: [s.x0, -s.y0], code: 'u8x-back-sign', hint: 'Your ' + t('x') + ' is right — check the signs when you substitute it back to find ' + t('y') + '.' });
    return pointPart('Solve the system using any method. Give the solution as an ordered pair.' + sysT(e1, e2), P, [std(s.A1, s.B1, s.c1), std(s.A2, s.B2, s.c2)], { wrong: W.filter(function (x) { return x.is; }) },
      isoText(s) + workSol(s.sub, e2) + '<br>(Elimination works too: multiply the first equation by ' + t(Math.abs(s.B2)) + ' so the ' + t('y') + '-terms are opposites or equal, then add or subtract.)',
      ['In the first equation ' + t('y') + ' has a coefficient of ' + t(s.B1) + ': isolating it is quick (substitution).', 'Or multiply the first equation so the ' + t('y') + '-terms cancel (elimination).'], 'solve any method');
  }
  var TIX = [{ ev: 'A school play', a: 'adult', b: 'student' }, { ev: 'A school concert', a: 'adult', b: 'student' }, { ev: 'A hockey game', a: 'general', b: 'student' }, { ev: 'A band fundraiser', a: 'adult', b: 'child' }];
  function l8q3(r) { // Ryan: 180 tickets, adult $9, student $5, $1300 → 100 adult · 150 tickets, $10, $6, $1220 → 80 adult
    var c = r.pick(TIX), s = until(function () { var N = 10 * r.int(10, 25), pa = r.int(7, 12), pb = r.int(4, pa - 2), a = 5 * r.int(4, N / 5 - 4); return { N: N, pa: pa, pb: pb, a: a, b: N - a }; }, function (s) { return s.a !== s.b && s.pa * s.a + s.pb * s.b <= 3000; });
    var V = s.pa * s.a + s.pb * s.b, askA = r.chance(0.7), ans = askA ? s.a : s.b, nm = (askA ? c.a : c.b) + ' tickets';
    var dl = [[askA ? s.b : s.a, 'u8x-other', 'That is the number of ' + (askA ? c.b : c.a) + ' tickets. Check which price goes with which ticket.'], [s.N, 'u8x-total', t(s.N) + ' is the total number of tickets.']];
    if (askA) dl.push([(V - s.N) / (s.pa - s.pb), 'u8x-elim-const', 'When you multiply ' + t('a+s=' + s.N) + ' by ' + t(s.pb) + ', multiply the ' + t(s.N) + ' too.']);
    return numPart(c.ev + ' sold ' + t(s.N) + ' tickets. ' + c.a.charAt(0).toUpperCase() + c.a.slice(1) + ' tickets cost ' + money(s.pa) + ' and ' + c.b + ' tickets cost ' + money(s.pb) + '. Ticket sales were ' + money(V) + '. How many <b>' + nm + '</b> were sold?', ans, dl,
      'Let ' + t('a') + ' be the number of ' + c.a + ' tickets and ' + t('s') + ' the number of ' + c.b + ' tickets:<br>' + t('a+s=' + s.N) + ' and ' + t(s.pa + 'a+' + s.pb + 's=' + V) + '.<br>Multiply the first by ' + t(s.pb) + ': ' + t(s.pb + 'a+' + s.pb + 's=' + s.pb * s.N) + '. Subtract it from the second: ' + t((s.pa - s.pb) + 'a=' + (V - s.pb * s.N)) + ', so ' + t('a=' + s.a) + '.<br>Then ' + t('s=' + s.N + '-' + s.a + '=' + s.b) + '. So ' + t(s.a) + ' ' + c.a + ' tickets and ' + t(s.b) + ' ' + c.b + ' tickets.<br><b>Check.</b> ' + t(s.pa + '(' + s.a + ')+' + s.pb + '(' + s.b + ')=' + V) + ' ✓',
      ['Write one equation for the number of tickets and one for the money.', 'Solve by elimination (multiply the count equation by ' + t(s.pb) + ' and subtract) or by substitution.'], 'ticket problem', { after: nm });
  }
  HW.defineExit({ lesson: 'u8l8', calc: false, outcome: 'RF9',
    blurb: 'Unit review: what 0 = 8 or 0 = 0 means, solve a system by any method, and a ticket problem.',
    questions: [Q(1, 'PRG', l8q1), Q(2, 'PRG', l8q2), Q(3, 'MAS', l8q3)] });
})(window);
