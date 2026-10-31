/* Math 15 · Unit 8 · Lesson 8 — Unit Review: Systems of Linear Equations (RF9)
 * Assignment 8 (u8_L08.tex, Questions 1–24) and the Lesson 8 Extra Practice (u8_EP08.tex, Questions 1–24).
 * Every part is a generator: same structure, idea and difficulty as the booklet question, new numbers from the seed; the
 * booklet's own numbers are among the possible versions. No calculator: integer solutions unless the booklet item has
 * fractions (EP 3, 5, 24).
 * Models: Math 10C u8l6.js (cumulative review: point keypad with no solution / infinitely many, graph pad, method
 * choice as multiple choice) and the Math 15 Unit 8 files (u8l1 graph helpers and graph-pad diagnoses, the u8test
 * one-variable step checker, u8l7 word-problem system boxes).
 * Conversions: "solve by substitution / elimination" -> the key step as its own part (the one-variable equation after
 * substituting, adding or subtracting; "variable = expression" when a variable must be isolated first), then the
 * ordered pair; "graph" -> graph pad; "classify / explain / choose a method / find the error" -> multiple choice whose
 * options are reasons; "find k" -> a number; "write a second line / build a system" -> equation boxes checked against
 * the conditions (any correct answer accepted).
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 21(a) (solve in terms of a), 22(b) (three lines: the
 * triangle), 23 (build a system that needs both equations multiplied). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, Ln = HW.lines, LS = HW.lines, DR = HW.draw, F = HW.fmt, ex = HW.ex;

  /* ---------- numbers and LaTeX ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function fr(p, q) { if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g + 0, q / g]; }
  function fT(f) { return Ln.frT(f[0], f[1]); }
  function nT(x) { if (Array.isArray(x)) return fT(x); if (Number.isInteger(x)) return F(x + 0); var f = Ln.toFr(x); return f[1] <= 12 ? fT(f) : String(x); }
  function fv(f) { return Array.isArray(f) ? f[0] / f[1] : f; }
  function r6(x) { return Math.round(x * 1e6) / 1e6; }
  function pt(p) { return '(' + nT(p[0]) + ',\\ ' + nT(p[1]) + ')'; }
  function ptt(p) { return t(pt(p)); }
  /* terms [[coef, 'x'], …] -> LaTeX; coef a number or [p, q] */
  function T(terms) {
    var s = '';
    terms.forEach(function (tm) {
      var c0 = tm[0], v = tm[1] || '', cv = fv(c0); if (Math.abs(cv) < 1e-12) return;
      var neg = cv < 0, c = Array.isArray(c0) ? fr(c0[0], c0[1]) : Ln.toFr(cv), a = Math.abs(c[0]);
      var body = c[1] === 1 ? ((a === 1 && v) ? '' : F(a)) : '\\frac{' + a + '}{' + c[1] + '}';
      s += (neg ? '-' : (s ? '+' : '')) + body + v;
    });
    return s || '0';
  }
  function eqT(lhs, rhs) { return T(lhs) + '=' + (typeof rhs === 'number' ? F(rhs) : T(rhs)); }
  function yT(m, b) { return 'y=' + T([[m, 'x'], [b, '']]); }

  /* ---------- lines: A x + B y + C = 0 (integers) ---------- */
  function line(A, B, C) { var g = gcd(gcd(A, B), C) || 1; A /= g; B /= g; C /= g; if (A < 0 || (A === 0 && B < 0)) { A = -A; B = -B; C = -C; } return { A: A + 0, B: B + 0, C: C + 0 }; }
  function mbL(m, b) {   // y = m x + b; m, b numbers or [p, q]
    var M = Array.isArray(m) ? fr(m[0], m[1]) : [m, 1], Bf = Array.isArray(b) ? fr(b[0], b[1]) : Ln.toFr(b);
    return line(M[0] * Bf[1], -M[1] * Bf[1], M[1] * Bf[0]);
  }
  function arr(Lo) { return [Lo.A, Lo.B, Lo.C]; }
  function onL(Lo, p) { return Math.abs(Lo.A * fv(p[0]) + Lo.B * fv(p[1]) + Lo.C) < 1e-9; }
  function sameL(a, b) { return a.A === b.A && a.B === b.B && a.C === b.C; }
  function inter(L1, L2) { var d = L1.A * L2.B - L2.A * L1.B; return [fr(L1.B * L2.C - L2.B * L1.C, d), fr(L2.A * L1.C - L1.A * L2.C, d)]; }
  function si(Lo, vars) { return Ln.tex(Lo, 'slope-intercept', null, vars); }
  function latS(Lo, win) {   // grid points of a line inside a window (vertical lines too)
    var out = [];
    if (Lo.B === 0) { var xv = -Lo.C / Lo.A; if (Number.isInteger(r6(xv)) && xv >= win[0][0] && xv <= win[0][1]) for (var yy = Math.ceil(win[1][0]); yy <= win[1][1]; yy++) out.push([r6(xv), yy]); return out; }
    for (var x = Math.ceil(win[0][0] - 1e-9); x <= win[0][1] + 1e-9; x++) {
      var y = -(Lo.A * x + Lo.C) / Lo.B;
      if (Math.abs(y - Math.round(y)) < 1e-7 && y >= win[1][0] - 1e-9 && y <= win[1][1] + 1e-9) out.push([x, Math.round(y)]);
    }
    return out;
  }
  function arrowV(p, q) { return { pts: [], pieces: [{ v: [p, q], s: 'arrow', e: 'arrow' }], join: 'none' }; }
  function lineV(Lo, win) { var L2 = latS(Lo, win); if (L2.length < 2) L2 = latS(Lo, [[-60, 60], [-1e5, 1e5]]); return arrowV(L2[0], L2[L2.length - 1]); }
  function clipV(Lo, win) {   // the part of the line inside the window, as a segment without end marks
    var xr = win[0], yr = win[1], P = [];
    if (Lo.B !== 0) [xr[0], xr[1]].forEach(function (x) { var y = -(Lo.A * x + Lo.C) / Lo.B; if (y >= yr[0] - 1e-9 && y <= yr[1] + 1e-9) P.push([x, r6(y)]); });
    if (Lo.A !== 0) [yr[0], yr[1]].forEach(function (y) { var x = -(Lo.B * y + Lo.C) / Lo.A; if (x >= xr[0] - 1e-9 && x <= xr[1] + 1e-9) P.push([r6(x), y]); });
    P.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    return { v: [P[0], P[P.length - 1]], s: 'none', e: 'none' };
  }
  function ctxSeg(Lo, win, pd) {   // context graphs: the line between its first and last snap points in the window
    var sx = (pd && pd.snapX) || 1, sy = (pd && pd.snapY) || 1, P = [];
    for (var x = Math.ceil(win[0][0] / sx) * sx; x <= win[0][1] + 1e-9; x += sx) { var y = -(Lo.A * x + Lo.C) / Lo.B; if (Math.abs(y / sy - Math.round(y / sy)) < 1e-7 && y >= win[1][0] - 1e-9 && y <= win[1][1] + 1e-9) P.push([r6(x), r6(y)]); }
    return { v: [P[0], P[P.length - 1]], s: 'none', e: 'none' };
  }
  function uniqL(Ls) { var out = []; Ls.forEach(function (L) { if (!out.some(function (M) { return sameL(M, L); })) out.push(L); }); return out; }
  function pick2(r, list, test, tries) { for (var g = 0; g < (tries || 600); g++) { var v = list(r); if (test(v)) return v; } throw new Error('u8l1: no parameters found'); }

  /* ---------- a drawn system: blue solid and red dashed lines (as in the booklet) ---------- */
  var W6 = [[-6, 6], [-6, 6]], BLUE = '#2b55a0', RED = '#c4532a';
  function sysFig(Ls, win, extra) {
    var segs = Ls.map(function (L, i) { var c = clipV(L, win); return { pts: c.v, color: i ? RED : BLUE, dash: i === 1, start: 'arrow', end: 'arrow' }; });
    return '<div class="fig">' + HW.graph(Object.assign({ x: win[0], y: win[1], grid: 1, labels: 2, max: 300, segs: segs, aria: 'two lines on a grid' }, extra || {})) + '</div>';
  }

  /* ---------- graph pad: draw the lines of a system ---------- */
  function pad(win, o) { return Object.assign({ x: win[0], y: win[1], grid: 1, labels: 2, mode: 'lines', defaultEnd: 'arrow', max: 360 }, o || {}); }
  /* The pad continues a line only while the student keeps tapping, so a bent polyline is read as separate lines. */
  function splitBends(value) {
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
  function geoL(g, k) { var L = g.lines[k]; return { A: L.A, B: L.B, C: -L.C }; }   // draw.js stores A x + B y = C
  /* Ls: the lines; names: LaTeX of each equation; o.context: any extent of each line counts; o.pad: graph-pad options */
  function sysGraph(prompt, Ls, names, win, o, sol, hints, text) {
    o = o || {};
    var U = uniqL(Ls), uNames = U.map(function (L) { var i = Ls.length - 1; while (!sameL(Ls[i], L)) i--; return t(names[i]); });
    var key = { pts: [], pieces: [], join: 'none' };
    U.forEach(function (L) { key.pieces.push(o.context ? ctxSeg(L, win, o.pad) : lineV(L, win).pieces[0]); });
    var exact = o.context ? null : K.graphExact(key);
    function diagnose(S, Tl, name) {
      var nr = function (a, b) { return a != null && Math.abs(a - b) < 1e-9; };
      if (Tl.B === 0) {   // a vertical line x = k
        var k = -Tl.C / Tl.A;
        if (S.B === 0) return wrong('line-x', 'Your line for ' + name + ' is vertical — right — but it should cross the ' + t('x') + '-axis at ' + t(nT(k)) + ': every point on it has ' + t('x=' + nT(k)) + '.');
        if (S.A === 0) return wrong('line-vh', name + ' means ' + t('x=' + nT(k)) + ': every point has the same <b>' + t('x') + '</b>-value, so the line is <b>vertical</b>, not horizontal.');
        return wrong('u8-gr-line', name + ' is a vertical line: every point on it has ' + t('x=' + nT(k)) + '.');
      }
      if (Tl.A === 0) {   // a horizontal line y = k
        var h = -Tl.C / Tl.B;
        if (S.A === 0) return wrong('u8-gr-shift', 'Your line for ' + name + ' is horizontal — right — but it should cross the ' + t('y') + '-axis at ' + t(nT(h)) + ': every point on it has ' + t('y=' + nT(h)) + '.');
        if (S.B === 0) return wrong('line-vh', name + ' means ' + t('y=' + nT(h)) + ': every point has the same <b>' + t('y') + '</b>-value, so the line is <b>horizontal</b>, not vertical.');
        return wrong('u8-gr-line', name + ' is a horizontal line: every point on it has ' + t('y=' + nT(h)) + '.');
      }
      var sm = S.B === 0 ? null : -S.A / S.B, tm = -Tl.A / Tl.B, sb = S.B === 0 ? null : -S.C / S.B, tb = -Tl.C / Tl.B;
      if (S.B === 0) return wrong('u8-gr-line', 'One of your lines is vertical. Check your line for ' + name + ': substitute two of its points into the equation.');
      if (nr(sm, tm)) return wrong('u8-gr-shift', 'Your line for ' + name + ' has the right slope but is in the wrong place. Check a point on it: ' + (o.context ? 'substitute one value and work out the other.' : 'it crosses the ' + t('y') + '-axis at ' + ptt([0, Ln.toFr(tb)]) + '.'));
      if (nr(sb, tb)) {
        if (nr(sm, -tm)) return wrong('u8-gr-sign', 'Your line for ' + name + ' starts in the right place, but it goes the wrong way: its slope is ' + t(nT(tm)) + ', so it ' + (tm < 0 ? 'falls' : 'rises') + ' from left to right.');
        if (tm !== 0 && nr(sm, 1 / tm)) return wrong('u8-gr-flip', 'Your line for ' + name + ' starts in the right place. Slope is <b>rise over run</b>: ' + t('m=' + nT(tm)) + ' — you stepped run over rise.');
        return wrong('u8-gr-slope', 'Your line for ' + name + ' crosses the ' + t('y') + '-axis in the right place — now check its slope: ' + t('m=' + nT(tm)) + '.');
      }
      if (nr(sm, -tm) && nr(sb, -tb)) return wrong('u8-gr-sign', 'Your line for ' + name + ' has the signs of the slope and the intercept both switched. Rearrange carefully: when you divide by a negative, every sign changes.');
      return wrong('u8-gr-line', 'Check your line for ' + name + ': substitute two of the points you used into ' + name + ' — both must make it true.');
    }
    var check = function (resp) {
      var v = splitBends(resp);
      if (DR.empty(v)) return form('empty', 'Draw your answer on the grid first.');
      if (exact) { var r0 = exact(v); if (r0.v === 'wrong' && (r0.code === 'graph-length' || r0.code === 'graph-ends')) return wrong('graph-arrows', 'Right lines — but a line keeps going forever: put <b>arrows</b> on both ends of each line (use the <b>Ends</b> tool).'); if (r0.v !== 'wrong' || r0.code !== 'graph') return r0; }
      var g = DR.geom(v), have = Object.keys(g.lines).map(function (k) { return geoL(g, k); });
      if (!have.length) {
        var off = v.pts.filter(function (p) { return !U.some(function (L) { return onL(L, p); }); })[0];
        if (off) return wrong('u8-point-off', ptt(off) + ' is not on ' + (U.length > 1 ? 'any of the lines' : 'the line') + '. Substitute it into the equations to check.');
        return wrong('u8-points-only', 'Your points are on the lines — now draw the ' + (U.length > 1 ? 'lines' : 'line') + ' through them with the <b>╱ Line</b> tool.');
      }
      var hit = have.map(function (S) { for (var i = 0; i < U.length; i++) if (propL(S, U[i])) return i; return -1; });
      var extra = have.filter(function (S, j) { return hit[j] < 0; }), miss = [];
      U.forEach(function (L, i) { if (hit.indexOf(i) < 0) miss.push(i); });
      if (o.context && !extra.length && !miss.length) return ok();
      if (!extra.length && miss.length) return wrong('u8-line-missing', 'Correct so far — still to draw: ' + miss.map(function (i) { return uNames[i]; }).join(' and ') + '.');
      if (extra.length === 1 && miss.length === 1) return diagnose(extra[0], U[miss[0]], uNames[miss[0]]);
      if (extra.length && !miss.length) return wrong('u8-line-extra', 'All the lines are there, but you have drawn ' + (extra.length === 1 ? 'an extra line' : 'extra lines') + ' as well. Undo or clear the extra ' + (extra.length === 1 ? 'one' : 'ones') + '.');
      return wrong('u8-graph', null);
    };
    var p = K.P.graph(prompt, pad(win, o.pad), check, key, sol, hints, text);
    var bad = [];
    if (U.length > 1) bad.push({ pts: [], pieces: [key.pieces[0]], join: 'none' });
    U.forEach(function (L, i) {   // the classic slips: slope sign, a shifted line
      if (L.A === 0 || L.B === 0) return;
      var m = -L.A / L.B, b = -L.C / L.B, W1 = mbL(Ln.toFr(-m), Ln.toFr(b));
      if (latS(W1, win).length >= 2 && (!o.context || ctxSeg(W1, win, o.pad).v[1])) { var kv = { pts: [], pieces: key.pieces.slice(), join: 'none' }; kv.pieces[i] = o.context ? ctxSeg(W1, win, o.pad) : lineV(W1, win).pieces[0]; bad.push(kv); }
    });
    p.bad = bad.filter(function (b) { return !DR.same(b, key) && check(b).v !== 'correct'; });
    return p;
  }

  /* ---------- other part makers ---------- */
  function mc(r, prompt, opts, sol, hints, text, keep) {
    var seen = {}, o2 = opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; });
    return K.P.mc(r, prompt, o2, sol, hints, text, keep);
  }
  function pS(x) { if (Array.isArray(x)) { var f = fr(x[0], x[1]); return f[1] === 1 ? String(f[0]) : f[0] + '/' + f[1]; } if (Number.isInteger(x)) return String(x); var g = Ln.toFr(x); return g[1] === 1 ? String(g[0]) : g[0] + '/' + g[1]; }
  function samePt(a, b) { return Math.abs(fv(a[0]) - fv(b[0])) < 1e-9 && Math.abs(fv(a[1]) - fv(b[1])) < 1e-9; }
  /* the solution of a system; opt.wrong: [{ is, code, hint }], opt.vars */
  function pointPart(prompt, P, Ls, opt, sol, hints, text) {
    opt = opt || {};
    var W = (opt.wrong || []).filter(function (w) { return !(Array.isArray(w.is) && samePt(w.is, P)); });
    var p = K.P.point(prompt, P, { system: Ls.map(arr), vars: opt.vars, wrong: W }, sol, hints, text);
    var bad = ['no solution'];
    if (!samePt(P, [P[1], P[0]])) bad.push('(' + pS(P[1]) + ', ' + pS(P[0]) + ')');
    W.forEach(function (w) { bad.push('(' + pS(w.is[0]) + ', ' + pS(w.is[1]) + ')'); });
    p.good = ['x=' + pS(P[0]) + ', y=' + pS(P[1])];
    p.bad = bad;
    p.solution = String(p.solution).replace(/\\\(([xy])=([^\\]+)\\\) ⟹ \\\(\1=\2\\\)/g, '\\($1=$2\\)');
    return p;
  }
  /* equations in fixed boxes; each graded like K.line (opt.form, opt.wrong per box) */
  function twoEq(prompt, Ts, labels, opt, sol, hints, text) {
    opt = opt || {}; var vars = opt.vars || ['x', 'y'];
    var cs = Ts.map(function (Tg, i) { return K.line(Tg, { vars: vars, form: opt.form, wrong: (opt.wrong || [])[i] }); });
    var nm = labels.map(function (l) { return l.replace(/:\s*$/, ''); });
    var check = function (resp) {
      resp = resp || []; var a = String(resp[0] || '').trim(), b = String(resp[1] || '').trim();
      if (!a && !b) return form('empty', 'Write both equations.');
      if (!a || !b) return form('sys-one', 'Write an equation in <b>each</b> box.');
      var r1 = cs[0](a), r2 = cs[1](b);
      if (r1.v === 'correct' && r2.v === 'correct') return ok();
      if (cs[1](a).v === 'correct' && cs[0](b).v === 'correct') return wrong('u8-eq-swap', 'Both equations are right, but in the wrong boxes: the first box is for ' + nm[0] + '.');
      var bad = r1.v !== 'correct' ? [0, r1] : [1, r2];
      if (bad[1].v === 'form') return { v: 'form', code: bad[1].code, hint: '<b>' + nm[bad[0]] + ':</b> ' + bad[1].hint };
      return wrong(bad[1].code || 'sys-eq', (bad[0] === 1 && r1.v === 'correct' ? 'Your first equation is right. ' : '') + '<b>' + nm[bad[0]] + ':</b> ' + (bad[1].hint || 'check this equation again.'));
    };
    var keys = Ts.map(function (Tg) { return si(Tg, vars); });
    return { prompt: prompt, input: { type: 'fields', fields: labels.map(function (l) { return { label: l, mode: 'math', keys: 'eq', vars: vars, placeholder: ' ' }; }) },
      check: check, key: keys, answer: labels.map(function (l, i) { return l + ' ' + t(keys[i]); }).join('<br>'), solution: sol, hints: hints || [], text: text,
      bad: [[keys[1], keys[0]]] };
  }
  /* substitution text: terms [[c, v]], vals { x: 4, y: -1 } -> "4+3(-1)" */
  function subT(terms, vals) {
    var s = '';
    terms.forEach(function (tm) {
      var c = fv(tm[0]), v = tm[1]; if (!c) return;
      var neg = c < 0, a = Math.abs(c), body;
      if (!v) body = nT(a);
      else { var val = vals[v]; body = a === 1 ? (fv(val) < 0 ? '(' + nT(val) + ')' : nT(val)) : nT(a) + '(' + nT(val) + ')'; }
      s += (neg ? '-' : (s ? '+' : '')) + body;
    });
    return s;
  }
  function evalT(terms, vals) { return r6(terms.reduce(function (acc, tm) { return acc + fv(tm[0]) * (tm[1] ? fv(vals[tm[1]]) : 1); }, 0)); }

  /* rewriting  A x + B y = C  (one of the system's equations) in slope–intercept form */
  function rewritePart(prompt, a, b, c, sol0) {
    var L = line(a, b, -c), wr = [];
    if (b === -1) wr.push({ is: line(a, 1, -c), code: 'u8-neg', hint: 'From ' + t('-y=' + T([[-a, 'x'], [c, '']])) + ', divide <b>every</b> term by ' + t('-1') + ': both signs on the right change.' }, { is: line(a, -1, c), code: 'u8-neg', hint: 'Divide <b>every</b> term by ' + t('-1') + ' — the constant changes sign too.' });
    else if (b === 1) wr.push({ is: line(-a, 1, -c), code: 'u8-neg', hint: 'Moving ' + t(T([[a, 'x']])) + ' to the other side changes its sign.' });
    else wr.push({ is: line(a * b, b, -c), code: 'u8-nodiv', hint: 'Divide <b>every</b> term by ' + t(b) + ' — the constant ' + t(c) + ' too.' });
    var p = K.P.line(prompt, L, { form: 'slope-intercept', wrong: wr },
      sol0 || (t(eqT([[a, 'x'], [b, 'y']], c)) + '<br>' + t(T([[b, 'y']]) + '=' + T([[-a, 'x'], [c, '']])) + (b === 1 ? '' : '<br>' + t(si(L)) + ' (divide every term by ' + t(b) + ')') + '.'),
      [b === 1 ? 'Subtract ' + t(T([[a, 'x']])) + ' from both sides.' : 'Move the ' + t('x') + '-term to the other side, then divide <b>every</b> term by ' + t(b) + '.'], 'rewrite in y = mx + b');
    p.bad = wr.map(function (w) { return si(w.is); });
    return p;
  }

  /* an equation in ONE variable (the step after substituting / adding / subtracting).
     acc: [{ v: 'x'|'y', root }] the right ones; o.wrong [{ v, root, code, hint }]; o.allowSolved; o.bothHint; o.identHint; o.varHint */
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
      if (sides.length !== 2 || !sides[0].trim() || !sides[1].trim()) return form('u8l8-eq-read', 'Type an equation with one ' + t('=') + ' sign.');
      var q = Ln.read(s, ['x', 'y']);
      if (!q.ok) {
        var id = q.why === 'not-linear' ? isIdentity(s) : null;
        if (id) return wrong(o.identCode || 'u8l8-same-eq', o.identHint || 'Both variables disappeared. Substitute into the <b>other</b> equation, not the one you started from.');
        return form('line-' + q.why, q.why === 'vars' ? 'Use only the letters ' + t('x') + ' and ' + t('y') + '.' : READWHY[q.why] || READWHY.unreadable);
      }
      if (Math.abs(q.a) > 1e-9 && Math.abs(q.b) > 1e-9) return wrong('u8l8-res-not-elim', o.bothHint || 'Your equation still has both ' + t('x') + ' and ' + t('y') + ' in it — one of them should be gone.');
      var v = Math.abs(q.a) > 1e-9 ? 'x' : 'y', root = r6(-q.c / (v === 'x' ? q.a : q.b));
      var mine = acc.filter(function (a) { return a.v === v; })[0];
      if (mine && near(root, mine.root)) {
        var cl = s.replace(/\s|\\left|\\right/g, '');
        var solved = new RegExp('^' + v + '=-?[\\d.]+$|^-?[\\d.]+=' + v + '$|^' + v + '=-?\\\\frac\\{\\d+\\}\\{\\d+\\}$').test(cl);
        if (solved && !o.allowSolved) return form('u8l8-step-show', o.solvedHint || 'That is the finished value — type the equation you get at this step, before you solve it.');
        return ok();
      }
      for (var i = 0; i < W.length; i++) if (W[i].v === v && near(root, W[i].root)) return wrong(W[i].code, W[i].hint);
      if (!mine) return wrong('u8l8-wrong-var', o.varHint || 'Your equation is in ' + t(v) + ', but at this step the other variable should be left.');
      return wrong('u8l8-step', o.hint || null);
    };
  }

  /* ---------- number formatting ---------- */
  function near(a, b) { return Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)); }
  function rnd(v) { return Math.round(v * 10000) / 10000; }
  function grpAll(s) { s = String(s); var neg = s[0] === '-'; if (neg) s = s.slice(1); var p = s.split('.'), i = p[0], out = ''; while (i.length > 3) { out = '\\,' + i.slice(-3) + out; i = i.slice(0, -3); } return (neg ? '-' : '') + i + out + (p[1] ? '.' + p[1] : ''); }
  function N(v) { var x = rnd(v); return Math.abs(x) >= 10000 ? grpAll(String(x)) : String(x); }
  function plain(v) { return String(rnd(v)); }
  function m2(v) { return (Math.round(v * 100) / 100).toFixed(2); }
  function mon(v) { var c = Math.round(v * 100); return c % 100 === 0 ? String(c / 100) : (c / 100).toFixed(2); }   // 11, 2.75, 0.10
  function D(v) { return '\\$' + mon(v); }
  function Dh(v) { return t(D(v)); }
  function co(p) { return near(p, 1) ? '' : mon(p); }                       // a price as a coefficient: 1 -> '', 0.10 -> 0.10
  function pdec(p) { return (p / 100).toFixed(2); }                         // 12 -> 0.12
  function art(n) { var s = String(n); return s[0] === '8' || s === '11' || s === '18' ? 'an' : 'a'; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var TIMES = { 2: 'twice', 3: 'three times', 4: 'four times', 5: 'five times' };
  var NW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  function gen(f, fb) { for (var g = 0; g < 800; g++) { var o = f(); if (o) return o; } return fb; }
  function chk(s) { return s + ' ✓'; }
  function sgn(v) { return v < 0 ? '(' + N(v) + ')' : N(v); }

  /* ---------- systems (from Math 10C u8l4) ---------- */
  function eqOf(e, vars) { if (Array.isArray(e)) return e; var r = LS.read(e, vars); return r.ok ? [r.a, r.b, r.c] : null; }
  function onPt(L, P) { var s = Math.max(1, Math.abs(L[2]), Math.abs(L[0] * P[0]), Math.abs(L[1] * P[1])); return Math.abs(L[0] * P[0] + L[1] * P[1] + L[2]) < 1e-7 * s; }
  function solve2(A, B) { var d = A[0] * B[1] - A[1] * B[0]; if (Math.abs(d) < 1e-12) return null; return [(-A[2] * B[1] + A[1] * B[2]) / d, (-A[0] * B[2] + A[2] * B[0]) / d]; }
  var READWHY = { 'no-eq': 'Each box needs an equation with an equals sign.', unreadable: 'One of your equations can’t be read — check the brackets and signs.', 'not-linear': 'Each equation should be linear: no letters multiplied together or squared.', empty: 'Write both equations.' };
  /* T = [[A, B, C], [A, B, C]] (Ax + By + C = 0 in opt.vars); either order, any equivalent equation.
   * opt.names: what each equation says; opt.factHints: hint when that one is wrong; opt.alts: other correct forms;
   * opt.wrong: [{ eq, code, hint }] classic mistranslations (strings also become `bad` test answers). */
  function sysCheck(T, opt) {
    var vars = opt.vars, names = opt.names || ['the first fact', 'the second fact'];
    var alts = [0, 1].map(function (j) { return ((opt.alts || [])[j] || []).map(function (e) { return eqOf(e, vars); }).filter(Boolean); });
    var wr = (opt.wrong || []).map(function (w) { return { L: eqOf(w.eq, vars), code: w.code, hint: w.hint }; }).filter(function (w) { return w.L && !LS.same(w.L, T[0]) && !LS.same(w.L, T[1]); });
    var P = solve2(T[0], T[1]);
    function match(L) { for (var j = 0; j < 2; j++) { if (LS.same(L, T[j])) return j; if (alts[j].some(function (a) { return LS.same(L, a); })) return j; } return -1; }
    return function (resp) {
      resp = resp || [];
      var a = String(resp[0] || '').trim(), b = String(resp[1] || '').trim();
      if (!a && !b) return form('empty', 'Write both equations.');
      if (!a || !b) return form('sys-one', 'Write <b>two</b> equations — one in each box.');
      var rs = [LS.read(a, vars), LS.read(b, vars)];
      for (var i = 0; i < 2; i++) if (!rs[i].ok) return form('line-' + rs[i].why, rs[i].why === 'vars' ? 'Use only the letters ' + t(vars[0]) + ' and ' + t(vars[1]) + ' from the question.' : READWHY[rs[i].why] || READWHY.unreadable);
      var Ls = rs.map(function (q) { return [q.a, q.b, q.c]; }), m = Ls.map(match);
      if (m[0] >= 0 && m[1] >= 0 && m[0] !== m[1]) return ok();
      if (m[0] >= 0 && m[0] === m[1]) return wrong('sys-same', 'Both of your equations describe ' + names[m[0]] + '. Write one equation for each fact in the story.');
      for (i = 0; i < 2; i++) if (m[i] < 0) for (var k = 0; k < wr.length; k++) if (LS.same(Ls[i], wr[k].L)) return wrong(wr[k].code, wr[k].hint);
      var g = m[0] >= 0 ? 0 : m[1] >= 0 ? 1 : -1;
      if (g >= 0) {
        var miss = 1 - m[g], der = P && onPt(Ls[1 - g], P);
        return wrong(der ? 'sys-derived' : 'sys-eq', 'Your equation for ' + names[m[g]] + ' is right. ' + (der ? 'Your other equation is true for the answer, but it isn’t a sentence of the story translated — write the equation for ' + names[miss] + ' straight from the words.' : 'Check the one for ' + names[miss] + (opt.factHints ? ': ' + opt.factHints[miss] : '.')));
      }
      if (P && onPt(Ls[0], P) && onPt(Ls[1], P)) return wrong('sys-derived', 'Both equations are true for the answer, but they aren’t the facts of the story — write one equation straight from each sentence (no solving yet).');
      return wrong('sys-eq', opt.factHints ? 'Neither equation matches the story yet. ' + cap(opt.factHints[0]) : null);
    };
  }
  function sysP(prompt, T, opt, sol, hints, text) {
    var labels = opt.labels || ['Equation 1', 'Equation 2'], shown = opt.showTex || opt.keyTex, bad = (opt.bad || []).slice();
    (opt.wrong || []).forEach(function (w) { if (typeof w.eq === 'string') { var L = eqOf(w.eq, opt.vars); if (L && !LS.same(L, T[0]) && !LS.same(L, T[1])) { bad.push([opt.keyTex[0], w.eq]); bad.push([w.eq, opt.keyTex[1]]); } } });
    return { prompt: prompt, input: { type: 'fields', fields: labels.map(function (l) { return { label: l, mode: 'math', keys: 'eq', vars: opt.vars, placeholder: ' ' }; }) },
      check: sysCheck(T, opt), key: opt.keyTex, answer: shown.map(function (k) { return t(k); }).join('<br>'), solution: sol, hints: hints || [], text: text,
      good: (opt.good || []).concat([opt.keyTex.slice().reverse()]), bad: bad };
  }
  /* one equation */
  function eqCheck(T, opt) {
    var vars = opt.vars, wr = (opt.wrong || []).map(function (w) { return { L: eqOf(w.eq, vars), code: w.code, hint: w.hint }; }).filter(function (w) { return w.L && !LS.same(w.L, T); });
    return function (resp) {
      var s = String(resp || '').trim(); if (!s) return form('empty', 'Type your equation first.');
      var q = LS.read(s, vars); if (!q.ok) return form('line-' + q.why, q.why === 'vars' ? 'Use only the letters ' + t(vars[0]) + ' and ' + t(vars[1]) + '.' : q.why === 'no-eq' ? 'Write an equation with an equals sign.' : READWHY[q.why] || READWHY.unreadable);
      var L = [q.a, q.b, q.c]; if (LS.same(L, T)) return ok();
      for (var k = 0; k < wr.length; k++) if (LS.same(L, wr[k].L)) return wrong(wr[k].code, wr[k].hint);
      return wrong('eq', opt.hint || null);
    };
  }
  /* labelled number boxes. opt.names (plain words), opt.sys (two lines in box order) + opt.sysNames, opt.wrong [{ v, code, hint }], opt.swapHint */
  function numsCheck(want, opt) {
    opt = opt || {}; var names = opt.names || want.map(function (x, i) { return 'value ' + (i + 1); });
    return function (resp) {
      resp = resp || []; var vals = [];
      for (var i = 0; i < want.length; i++) {
        var s = String(resp[i] == null ? '' : resp[i]).replace(/\\\$|\$/g, '').trim();
        if (!s) return form('empty', want.length > 1 ? 'Fill in every box.' : 'Type your answer first.');
        var p = HW.parse.number(s), fm = !p.ok && s.replace(/\s/g, '').match(/^(-?)(?:\\d?frac\{(-?\d+)\}\{(\d+)\}|(-?\d+)\/(\d+))$/);
        if (fm && Number(fm[3] || fm[5])) p = { ok: true, value: (fm[1] ? -1 : 1) * Number(fm[2] || fm[4]) / Number(fm[3] || fm[5]) };
        if (!p.ok) { var ru = s.replace(/\\(text|mathrm)\{\s*([^{}]*)\}/g, '$2').replace(/\s*[a-zA-Z/²\\ ]+\.?$/, ''); if (ru !== s && HW.parse.number(ru).ok) return form('units', 'Leave the unit out — just type the number (the unit is printed next to the box).'); return form('notnumber', 'Enter a single number for the ' + names[i] + (opt.money ? ' (no $ sign needed).' : '.')); }
        vals.push(p.value);
      }
      if (vals.every(function (v, j) { return near(v, want[j]); })) return ok();
      var W0 = (opt.wrong || []).filter(function (w) { return w.v && w.v.every(function (x, j) { return isFinite(x) && near(vals[j], x); }) && !w.v.every(function (x, j) { return near(x, want[j]); }); })[0];
      if (W0) return wrong(W0.code, W0.hint);
      if (want.length === 2 && near(vals[0], want[1]) && near(vals[1], want[0]) && !near(want[0], want[1])) return wrong('swap-answer', opt.swapHint || 'Right numbers, wrong boxes: which one is the ' + names[0] + '?');
      if (opt.sys && want.length === 2) {
        var s0 = onPt(opt.sys[0], vals), s1 = onPt(opt.sys[1], vals), sn = opt.sysNames || ['the first equation', 'the second equation'];
        if (s0 !== s1) return wrong('sys-one-eq', 'Your numbers fit ' + (s0 ? sn[0] : sn[1]) + ' but not ' + (s0 ? sn[1] : sn[0]) + '. Substitute them into both equations and look for the slip.');
      }
      var right = vals.map(function (v, j) { return near(v, want[j]); });
      if (right.some(Boolean)) { var j = right.indexOf(false); return wrong('one-value', want.length === 2 ? 'Your ' + names[1 - j] + ' is right — substitute it into one of the equations to find the ' + names[j] + ' again.' : 'Some of your values are right — check the ' + names[j] + '.'); }
      if (opt.diag) { var h = opt.diag(vals); if (h) return wrong(h.code, h.hint); }
      return wrong('value', opt.hint || null);
    };
  }
  function numsP(prompt, fields, want, opt, sol, hints, text) {
    opt = opt || {};
    var show = function (v) { return opt.money ? mon(v) : N(v); };
    return { prompt: prompt, input: { type: 'fields', fields: fields.map(function (f) { return { label: f.label, before: f.before, after: f.after }; }) },
      check: numsCheck(want, opt), key: want.map(function (v) { return opt.money && !Number.isInteger(v) ? m2(v) : plain(v); }),
      answer: fields.map(function (f, i) { return f.label + ': ' + (f.before ? f.before : '') + t(show(want[i])) + (f.after ? ' ' + f.after : ''); }).join('<br>'),
      solution: sol, hints: hints || [], text: text,
      bad: (opt.bad || []).concat(want.length === 2 && !near(want[0], want[1]) ? [[plain(want[1]), plain(want[0])]] : []).concat((opt.wrong || []).filter(function (w) { return w.v.every(isFinite) && !w.v.every(function (x, j) { return near(x, want[j]); }); }).map(function (w) { return w.v.map(plain); })) };
  }
  function numP(prompt, ans, diag, sol, hints, text, inp) {
    var p = K.P.number(prompt, ans, diag, sol, hints, text, inp);
    p.check = (function (c) { return function (resp) { return c(String(resp == null ? '' : resp).replace(/\\\$|\$/g, '')); }; })(p.check);
    if (inp && inp.money) { p.answer = t(D(ans)) + (inp.after ? inp.after : ''); p.key = Number.isInteger(ans) ? String(ans) : m2(ans); }
    else p.answer = (inp && inp.before ? inp.before : '') + t(N(ans)) + (inp && inp.after ? ' ' + inp.after : '');
    return p;
  }
  function nrP(prompt, ans, diag, sol, hints, text) { var p = K.P.nr(prompt, ans, diag, sol, hints, text); p.bad = [String(ans + 1)]; return p; }

  HW.addCodes({
    'perim-half': 'Perimeter: used l + w instead of 2l + 2w', 'more-than-flip': '“More than” put on the wrong quantity', 'more-times': '“More than” written as times', 'more-than-side': '“More than / less than” added to the wrong side',
    'sum-diff': 'Sum written as a difference', 'ratio-flip': '“Twice as many” put on the wrong variable', 'units-mix': 'Mixed cents and dollars in one equation', 'count-value': 'Count and value mixed up', 'value-swap': 'Values attached to the wrong items',
    'pct-decimal': 'Percent not changed to a decimal', 'swap-answer': 'Right numbers in the wrong boxes', 'one-value': 'One value right, the other wrong', 'sys-derived': 'Equation true for the answer but not a translation', 'sys-eq': 'Equation does not match the story',
    'sys-same': 'Both equations say the same fact', 'sys-one-eq': 'Values fit only one of the two equations', 'rate-fixed': 'Fixed fee and rate mixed up', 'u8l8-pct-total': 'Mixture: used the percent instead of the amount of acid',
    'u8-gr-shift': 'Graph: right slope, wrong place', 'u8-gr-sign': 'Graph: slope sign wrong', 'u8-gr-flip': 'Graph: run over rise', 'u8-gr-slope': 'Graph: right intercept, wrong slope', 'u8-gr-line': 'Graph: a line wrong',
    'u8-point-off': 'Plotted a point not on the line', 'u8-points-only': 'Plotted points but no lines', 'u8-line-missing': 'A line of the system missing', 'u8-line-extra': 'Extra line drawn', 'u8-graph': 'Graph of the system wrong',
    'u8-eq-swap': 'Equations in the wrong boxes', 'u8-neg': 'Sign slip dividing by −1 (or a negative)', 'u8-nodiv': 'Didn’t divide every term', 'u8l1-yint': 'Gave a y-intercept instead of the crossing point'
  });
  HW.addPartial({ 'u8l8-pct-total': 'b', 'u8-point-off': 's', 'u8-points-only': 'b', 'u8-graph': 'n' });
  /* ======================= shared builders ======================= */
  /* count-and-value problems. s = { X, Y, n1, n2 (plural nouns), p1, p2 (price of one / per kg), x, y, N (total count), T (total value),
   * what ('items' / 'tickets' / 'coins' — what the count counts), unit ('' or 'kg'), each ('each' / 'per kg'), dec (decimal prices) } */
  function cvKeys(s) { return [s.X + '+' + s.Y + '=' + s.N, co(s.p1) + s.X + '+' + co(s.p2) + s.Y + '=' + mon(s.T)]; }
  function cvSys(prompt, s) {
    var k = cvKeys(s), cnt = s.unit ? 'total mass' : 'total number of ' + s.what, val = s.dec ? 'total value (in dollars)' : 'total value';
    var Tc = Math.round(100 * s.T), c1 = Math.round(100 * s.p1), c2 = Math.round(100 * s.p2);
    var wr = [{ eq: co(s.p2) + s.X + '+' + co(s.p1) + s.Y + '=' + mon(s.T), code: 'value-swap', hint: 'Each price goes with its own item: ' + s.n1 + ' are ' + Dh(s.p1) + ' ' + s.each + ', so they bring in ' + t(co(s.p1) + s.X) + ' dollars.' },
      { eq: s.X + '+' + s.Y + '=' + mon(s.T), code: 'count-value', hint: t(s.X + '+' + s.Y) + ' adds ' + (s.unit ? 'kilograms' : 'numbers of ' + s.what) + ', so it equals the ' + cnt + ', ' + t(N(s.N)) + (s.unit ? ' kg' : '') + ' — not the money.' },
      { eq: co(s.p1) + s.X + '+' + co(s.p2) + s.Y + '=' + s.N, code: 'count-value', hint: 'Price × amount gives <b>dollars</b>, so the value equation equals the money, ' + Dh(s.T) + '.' }];
    (s.extraWrong || []).forEach(function (w) { wr.push(w); });
    if (s.dec) wr.push({ eq: [c1, c2, -s.T], code: 'units-mix', hint: 'Mixed units: ' + t(c1 + s.X + '+' + c2 + s.Y) + ' is in <b>cents</b> but ' + t(mon(s.T)) + ' is in dollars. Use ' + t(k[1]) + ' (or ' + t(c1 + s.X + '+' + c2 + s.Y + '=' + Tc) + ' cents).' });
    return sysP(prompt, [[1, 1, -s.N], [s.p1, s.p2, -s.T]],
      { vars: [s.X, s.Y], keyTex: k, names: ['the ' + cnt, 'the ' + val],
        factHints: ['one equation adds the ' + (s.unit ? 'kilograms' : s.what) + ': ' + t(s.X + '+' + s.Y + '=' + N(s.N)) + '.', 'the other adds the money: (price) × (' + (s.unit ? 'kilograms' : 'number') + ') for each ' + (s.unit ? 'ingredient' : 'item') + ', so ' + t(co(s.p1) + s.X + '+' + co(s.p2) + s.Y) + '.'],
        wrong: wr, good: s.dec ? [[k[0], c1 + s.X + '+' + c2 + s.Y + '=' + Tc]] : [] },
      '<b>' + cap(s.unit ? 'mass' : 'count') + ':</b> ' + t(k[0]) + '<br><b>Value:</b> ' + t(k[1]) + (s.dec ? ' (or ' + t(c1 + s.X + '+' + c2 + s.Y + '=' + Tc) + ' in cents)' : ''),
      ['One equation adds the ' + (s.unit ? 'kilograms' : s.what) + '; the other adds the money (price × ' + (s.unit ? 'mass' : 'number') + ' for each).'], 'count and value system');
  }
  function term(p, v) { return near(p, 1) ? N(v) : co(p) + '(' + N(v) + ')'; }
  function cvSolveText(s) {
    var k = cvKeys(s), txt = '', sc = s.dec ? 100 : 1;
    var A = Math.round(sc * s.p1), M = Math.round(sc * s.p2), TT = Math.round(sc * s.T);
    if (s.dec) txt += 'Multiply the value equation by ' + t(100) + ' to clear the decimals: ' + t(A + s.X + '+' + M + s.Y + '=' + TT) + '.<br>';
    var mult = M === 1 ? '' : 'Multiply the count equation by ' + t(M) + ': ' + t(M + s.X + '+' + M + s.Y + '=' + N(M * s.N)) + '.<br>';
    if (A > M) txt += mult + 'Subtract ' + (M === 1 ? 'the count equation' : 'it') + ' from the value equation (the ' + t(s.Y) + '-terms cancel): ' + t(co(A - M) + s.X + '=' + N(TT - M * s.N)) + (A - M === 1 ? '' : ' ⟹ ' + t(s.X + '=' + N(s.x))) + '.<br>';
    else txt += mult + 'Subtract the value equation from it (the ' + t(s.Y) + '-terms cancel): ' + t(co(M - A) + s.X + '=' + N(M * s.N - TT)) + (M - A === 1 ? '' : ' ⟹ ' + t(s.X + '=' + N(s.x))) + '.<br>';
    txt += 'Then ' + t(s.Y + '=' + N(s.N) + '-' + N(s.x) + '=' + N(s.y)) + '.<br>' +
      chk('Check: ' + t(N(s.x) + '+' + N(s.y) + '=' + N(s.N))) + ', ' + chk(t(term(s.p1, s.x) + '+' + term(s.p2, s.y) + '=' + m2s(s.p1 * s.x) + '+' + m2s(s.p2 * s.y) + '=' + mon(s.T)));
    return t(k[0]) + ' and ' + t(k[1]) + '.<br>' + txt;
  }
  function m2s(v) { return Number.isInteger(rnd(v)) ? N(v) : m2(v); }
  function cvSolve(prompt, s, sentence) {
    return numsP(prompt, [{ label: cap(s.n1), after: s.unit || '' }, { label: cap(s.n2), after: s.unit || '' }], [s.x, s.y],
      { names: ['number of ' + s.n1, 'number of ' + s.n2].map(function (x) { return s.unit ? x.replace('number of', 'kg of') : x; }), sys: [[1, 1, -s.N], [s.p1, s.p2, -s.T]], sysNames: ['the count equation', 'the value equation'],
        swapHint: 'Right numbers, wrong boxes — test them: ' + t(co(s.p1) + '(' + N(s.y) + ')+' + co(s.p2) + '(' + N(s.x) + ')') + ' is not ' + Dh(s.T) + '. Which item costs ' + Dh(s.p1) + '?' },
      cvSolveText(s) + '<br><b>' + sentence + '</b>',
      ['Write the count equation and the value equation, then eliminate ' + t(s.Y) + ': multiply the count equation by ' + t(mon(s.p2)) + (s.dec ? ' (after clearing decimals)' : '') + ' and subtract.'], 'count and value solve');
  }
  function cv(r, base, f) { return gen(function () { var s = f(); if (!s || s.x === s.y || s.x <= 0 || s.y <= 0) return null; s.N = s.x + s.y; s.T = rnd(s.p1 * s.x + s.p2 * s.y); for (var k in base) if (s[k] == null) s[k] = base[k]; return s; }, null); }

  /* ======================= Lesson 8 helpers ======================= */
  function nz(r, lo, hi) { var v; do { v = r.int(lo, hi); } while (v === 0); return v; }
  function inW(p, w) { return fv(p[0]) >= w[0][0] && fv(p[0]) <= w[0][1] && fv(p[1]) >= w[1][0] && fv(p[1]) <= w[1][1]; }
  function std(a, b, c) { return eqT([[a, 'x'], [b, 'y']], c); }          // a x + b y = c
  function Lsd(a, b, c) { return line(a, b, -c); }                         // its line object
  function ck(e) { return e + '\\ \\checkmark'; }
  function both(e1, e2) { return t(e1) + ' and ' + t(e2); }
  function sysD(e1, e2) { return '<div style="margin:6px 0 2px">' + t('\\begin{aligned}' + e1.replace('=', '&=') + '\\\\' + e2.replace('=', '&=') + '\\end{aligned}') + '</div>'; }
  function isInt(v) { return Math.abs(v - Math.round(v)) < 1e-9; }
  function lvisible(Lo, w) { return latS(Lo, w).length >= 2; }
  /* a one-variable step equation (after substituting / adding / subtracting) */
  function stepP(prompt, keyTex, acc, o, sol, hints, text) {
    o = o || {};
    if (/^-?[xy]=/.test(String(keyTex).replace(/\s/g, ''))) o.allowSolved = true;   // the step itself is the value (coefficient ±1)
    var p = K.P.math(prompt, ovChk(acc, o), keyTex, sol, hints, text, { keys: 'eq', vars: ['x', 'y'], placeholder: o.placeholder || ' ' });
    p.bad = (o.bad || []).slice();
    if (!o.allowSolved) acc.forEach(function (a) { p.bad.push(a.v + '=' + pS(a.root)); });   // the finished value: a nudge, not accepted
    return p;
  }
  /* no solution / infinitely many as the answer of "solve" */
  function ptNI(prompt, kind, Lz, sol, hints, text) {
    var p = K.P.point(prompt, kind, { system: Lz.map(arr) }, sol, hints, text);
    p.bad = ['(0, 0)', kind === 'none' ? 'infinitely many' : 'no solution'];
    return p;
  }
  /* classify a system: kind 'one' | 'none' | 'inf'; tell = the slopes-and-intercepts sentence; trap = { html, why } */
  function clsMC(r, prompt, kind, tell, trap, hint, text) {
    var o = [
      { html: '<b>One solution</b> — the slopes are different, so the lines cross exactly once.', right: kind === 'one', code: 'one' },
      { html: '<b>No solution</b> — the slopes are equal but the ' + t('y') + '-intercepts are different: the lines are parallel.', right: kind === 'none', code: 'none' },
      { html: '<b>Infinitely many solutions</b> — the slopes and the ' + t('y') + '-intercepts are both equal: it is the same line.', right: kind === 'inf', code: 'inf' }];
    o.forEach(function (x) { if (!x.right) x.why = tell + (x.code === 'one' ? ' The slopes are equal, so the lines can’t cross at just one point.' : x.code === 'none' ? (kind === 'one' ? ' The slopes are different, so the lines are not parallel.' : ' The intercepts are equal too, so it is the same line.') : (kind === 'one' ? ' Different slopes: two different lines.' : ' The intercepts are different, so they are two different lines.')); });
    o.push(Object.assign({ code: 'trap' }, trap));
    return mc(r, prompt, o, tell + ' So the system has <b>' + (kind === 'one' ? 'exactly one solution' : kind === 'none' ? 'no solution' : 'infinitely many solutions') + '</b>.', [hint || 'Write both equations as ' + t('y=mx+b') + '. Compare the slopes first, then the ' + t('y') + '-intercepts.'], text);
  }
  function mbT(m, b) { return t('m=' + nT(m)) + ', ' + t('b=' + nT(b)); }
  /* isolate a variable: "variable = expression" equivalent to one of the equations (coefficient ±1 preferred) */
  function isoChk(Es, o) {   // Es: [{ a, b, c }] for a x + b y = c
    o = o || {};
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\s/g, '');
      if (!s) return form('empty', 'Type your equation first.');
      var q = Ln.read(s, ['x', 'y']);
      if (!q.ok) return form('line-' + q.why, q.why === 'no-eq' ? 'Type an equation, e.g. ' + t('y=3x-15') + '.' : READWHY[q.why] || READWHY.unreadable);
      var L = [q.a, q.b, q.c], hit = -1;
      for (var i = 0; i < Es.length; i++) if (Ln.same(L, [Es[i].a, Es[i].b, -Es[i].c])) hit = i;
      var sides = s.split('='), lone = /^[xy]$/.test(sides[0]) ? sides[0] : /^[xy]$/.test(sides[1]) ? sides[1] : null;
      var other = lone && (sides[0] === lone ? sides[1] : sides[0]);
      if (hit < 0) {
        for (i = 0; i < Es.length; i++) { var E = Es[i]; if (Ln.same(L, [E.a, -E.b, -E.c]) || Ln.same(L, [-E.a, E.b, -E.c])) return wrong('rearr-sign', 'Check the signs: moving a term to the other side of ' + t('=') + ' changes its sign. Start again from ' + t(std(E.a, E.b, E.c)) + '.'); }
        return wrong('u8l4-iso', 'That equation isn’t a rearrangement of either equation. Start from one of them and move the other terms across.');
      }
      if (!lone || other.indexOf(lone) >= 0) return form('u8l4-iso-form', 'Right equation — now write it as “variable = expression”, with ' + t('x') + ' or ' + t('y') + ' alone on one side.');
      var coef = lone === 'x' ? Es[hit].a : Es[hit].b;
      if (Math.abs(coef) !== 1 && !o.anyCoef) return form('u8l4-iso-choice', 'That works, but it brings in fractions. Isolate a variable whose coefficient is ' + t('1') + ' or ' + t('-1') + ' instead.');
      return ok();
    };
  }
  /* method chooser options: kind 'sub-iso' | 'sub-one' | 'match' | 'mult-one' | 'mult-both' | 'graph' */
  function methodMC(r, prompt, kind, info, sol, text) {
    var all = {
      graph: { html: '<b>Graphing</b> (or setting the two ' + t('y') + '-expressions equal) — both equations are already in ' + t('y=mx+b') + ' form with integer intercepts.', why: 'Graphing needs both equations in ' + t('y=mx+b') + ' form with a crossing at grid points — that isn’t the case here.' },
      sub: { html: '<b>Substitution</b> — ' + (info.subWhy || 'a variable is already isolated (or has coefficient 1), so it can be put straight into the other equation.'), why: 'No variable is isolated and none has coefficient ' + t('1') + ' or ' + t('-1') + ' — isolating one would bring in fractions.' },
      match: { html: '<b>Elimination right away</b> — ' + (info.matchWhy || 'a pair of coefficients already matches (or is opposite).'), why: 'No pair of coefficients matches yet: ' + info.coefs + '.' },
      one: { html: '<b>Elimination after multiplying one equation</b> — ' + (info.oneWhy || 'one coefficient is a multiple of the matching one in the other equation.'), why: info.oneNo || 'No coefficient is a multiple of the matching one in the other equation, so one multiplication can’t line them up.' },
      both: { html: '<b>Elimination after multiplying both equations</b> — no coefficient is ' + t('\\pm1') + ' and nothing matches.', why: info.bothNo || 'There is a quicker route: look again at the coefficients (' + info.coefs + ').' } };
    var right = { 'sub-iso': 'sub', 'sub-one': 'sub', match: 'match', 'mult-one': 'one', 'mult-both': 'both', graph: 'graph' }[kind];
    var keys = ['graph', 'sub', 'match', 'one', 'both'].filter(function (k) { return k !== right; });
    var pickW = r.shuffle(keys).slice(0, 3);
    var opts = [Object.assign({}, all[right], { right: true, why: null, code: right })].concat(pickW.map(function (k) { return { html: all[k].html, why: all[k].why, code: k }; }));
    return mc(r, prompt, opts, sol, ['Look for an isolated variable or a coefficient of ' + t('\\pm1') + ', then for matching or opposite coefficients, then for multiples.'], text);
  }

  HW.addCodes({
    'u8l8-eq-read': 'Step equation: unreadable', 'u8l8-same-eq': 'Substituted back into the same equation', 'u8l8-res-not-elim': 'Step equation still has both variables', 'u8l8-step-show': 'Gave the finished value instead of the step',
    'u8l8-wrong-var': 'Step equation in the wrong variable', 'u8l8-step': 'Step equation wrong', 'u8l8-dist': 'Bracket not multiplied out to every term', 'u8l8-elim-sign': 'Subtracting: sign of a term not changed', 'u8l8-elim-rhs': 'Right sides not combined the same way',
    'u8l8-set-equal': 'Expressions not set equal correctly', 'u8l8-one': 'Gave one unknown instead of the combination', 'u8l8-k-sign': 'Value of k: sign slip', 'u8l8-k-inv': 'Value of k from the wrong ratio',
    'u8l8-kofi': 'Value at Kofi’s point worked out wrongly', 'u8l8-gym-diff': 'Difference between the plans wrong', 'u8l8-ab': 'Working backwards: a or b wrong', 'u8l8-lit': 'Literal coefficients: expression wrong', 'u8l8-build': 'Built system does not meet the conditions',
    'u8l8-line-same': 'Wrote the same line', 'u8l8-line-slope': 'Line with the wrong slope', 'u8l8-line-pt': 'Line misses the required point', 'u8l8-std-form': 'Not in standard form',
    'rearr-sign': 'Sign not changed when moving a term across =', 'u8l4-iso': 'Isolated the variable incorrectly', 'u8l4-iso-form': 'Isolation not written as “variable = expression”', 'u8l4-iso-choice': 'Isolated a variable that makes a fraction',
    'one': 'Said one solution', 'none': 'Said no solution', 'inf': 'Said infinitely many', 'trap': 'Classification: tempting wrong reason'
  });
  HW.addPartial({ 'u8l8-dist': 'b', 'u8l8-elim-sign': 'b', 'u8l8-elim-rhs': 's', 'u8l8-set-equal': 'b', 'u8l8-one': 'b', 'u8l8-k-sign': 's', 'u8l8-k-inv': 'n', 'u8l8-kofi': 's', 'u8l8-gym-diff': 's', 'u8l8-ab': 's', 'u8l8-lit': 'n', 'u8l8-build': 'n',
    'u8l8-line-same': 'n', 'u8l8-line-slope': 'n', 'u8l8-line-pt': 'n', 'u8l8-std-form': 's', 'u8l8-res-not-elim': 'n', 'u8l8-wrong-var': 'n', 'u8l8-step': 'n', 'u8l8-same-eq': 'n' });

  /* ======================= generators ======================= */
  /* two y = mx + b lines crossing at a grid point inside W6 */
  function crossGen(r, o) {
    o = o || {};
    return gen(function () {
      var m1 = o.m1 ? r.pick(o.m1) : nz(r, -3, 3), m2 = o.m2 ? r.pick(o.m2) : nz(r, -3, 3), x0 = r.int(-3, 4), y0 = r.int(-4, 5);
      if (m1 === m2 || (o.noOpp && m1 === -m2)) return null;
      var b1 = y0 - m1 * x0, b2 = y0 - m2 * x0; if (Math.abs(b1) > 6 || Math.abs(b2) > 6 || b1 === 0 || b2 === 0) return null;
      var L1 = mbL(m1, b1), L2 = mbL(m2, b2); if (!lvisible(L1, W6) || !lvisible(L2, W6)) return null;
      return { m1: m1, b1: b1, m2: m2, b2: b2, P: [x0, y0], L1: L1, L2: L2, e1: yT(m1, b1), e2: yT(m2, b2) };
    }, null);
  }
  /* y = m x + b isolated, with a x + c y = d */
  function subIsoY(r, o) {
    o = o || {};
    return gen(function () {
      var x0 = o.neg ? r.int(-5, 3) : r.int(1, 6), y0 = o.neg ? r.int(-5, 6) : r.int(1, 7), m = r.pick(o.ms || [2, 3, 4, 5, -2, -3]), b = y0 - m * x0;
      var a = r.int(o.aLo || 1, 5), c = r.pick(o.cs || [1, 2, -1, 3, -2]), d = a * x0 + c * y0;
      if (a + c * m === 0 || b === 0 || x0 === 0 || y0 === 0 || Math.abs(b) > 15) return null;
      return { m: m, b: b, a: a, c: c, d: d, P: [x0, y0], e1: yT(m, b), e2: std(a, c, d), L1: mbL(m, b), L2: Lsd(a, c, d) };
    }, null);
  }
  /* x = p y + q isolated, with a x + c y = d */
  function subIsoX(r, o) {
    o = o || {};
    return gen(function () {
      var x0 = o.neg ? r.int(-12, 6) : r.int(2, 15), y0 = o.neg ? r.int(-4, 6) : r.int(1, 6), p = r.pick(o.ps || [2, 3, -2, -3, 4]), q = x0 - p * y0;
      var a = r.pick(o.as || [1, 2, 3]), c = r.pick(o.cs || [-1, 1, 2, -2, 5]), d = a * x0 + c * y0;
      if (a * p + c === 0 || q === 0 || x0 === 0 || y0 === 0 || Math.abs(q) > 20) return null;
      var xe = 'x=' + T([[p, 'y'], [q, '']]);
      return { p: p, q: q, a: a, c: c, d: d, P: [x0, y0], e1: xe, e2: std(a, c, d), L1: line(1, -p, -q), L2: Lsd(a, c, d) };
    }, null);
  }
  /* isolate first: one equation has a ±1 coefficient. shape 'x1' (x + a y = c1, b x − y = c2) or 'y1' (b x + y = c1, x − a y = c2) */
  function isoGen(r, shape, o) {
    o = o || {};
    return gen(function () {
      var x0 = o.neg ? r.int(-6, 6) : r.int(1, 8), y0 = o.neg ? r.int(-5, 7) : r.int(1, 8), a = r.int(2, 5), b = r.int(2, 5);
      if (x0 === 0 || y0 === 0 || a === b) return null;
      var E = shape === 'x1' ? [{ a: 1, b: a, c: x0 + a * y0 }, { a: b, b: -1, c: b * x0 - y0 }] : [{ a: b, b: 1, c: b * x0 + y0 }, { a: 1, b: -a, c: x0 - a * y0 }];
      if (Ln.same([E[0].a, E[0].b, -E[0].c], [E[1].a, E[1].b, -E[1].c])) return null;
      return { E: E, P: [x0, y0], e1: std(E[0].a, E[0].b, E[0].c), e2: std(E[1].a, E[1].b, E[1].c), L1: Lsd(E[0].a, E[0].b, E[0].c), L2: Lsd(E[1].a, E[1].b, E[1].c) };
    }, null);
  }
  /* elimination with a matching pair: kind 'add' (b and −b on y) or 'sub' (same x coefficient) */
  function elimGen(r, kind, o) {
    o = o || {};
    return gen(function () {
      var x0 = o.xs ? r.pick(o.xs) : r.int(-4, 7), y0 = o.ys ? r.pick(o.ys) : r.int(-5, 6), E;
      if (x0 === 0 || y0 === 0) return null;
      if (kind === 'add') { var a = r.int(1, 6), d = r.int(1, 6), b = r.int(2, 5); if (a === d) return null; E = [{ a: a, b: b, c: a * x0 + b * y0 }, { a: d, b: -b, c: d * x0 - b * y0 }]; }
      else { var A = r.int(2, 6), b1 = nz(r, -5, 5), b2 = nz(r, -5, 5); if (b1 === b2 || b1 === -b2 || Math.abs(b1 - b2) < 2) return null; E = [{ a: A, b: b1, c: A * x0 + b1 * y0 }, { a: A, b: b2, c: A * x0 + b2 * y0 }]; }
      return { E: E, P: [x0, y0], e1: std(E[0].a, E[0].b, E[0].c), e2: std(E[1].a, E[1].b, E[1].c), L1: Lsd(E[0].a, E[0].b, E[0].c), L2: Lsd(E[1].a, E[1].b, E[1].c) };
    }, null);
  }
  /* elimination that needs both equations multiplied: no coefficient ±1, no coefficient a multiple of its partner */
  function bothGen(r, o) {
    o = o || {};
    return gen(function () {
      var x0 = o.neg ? nz(r, -4, 4) : r.int(1, 5), y0 = o.neg ? nz(r, -3, 6) : r.int(1, 5);
      var a1 = r.int(2, 6), b1 = r.int(2, 6) * (o.mixed ? r.pick([1, -1]) : 1), a2 = r.int(2, 6), b2 = r.int(2, 6) * (o.mixed ? r.pick([1, -1]) : 1);
      if (o.mixed && b1 > 0 && b2 > 0) b2 = -b2;
      var dv = function (p, q) { p = Math.abs(p); q = Math.abs(q); return p % q === 0 || q % p === 0; };
      if (dv(a1, a2) || dv(b1, b2) || a1 * b2 - a2 * b1 === 0) return null;
      var E = [{ a: a1, b: b1, c: a1 * x0 + b1 * y0 }, { a: a2, b: b2, c: a2 * x0 + b2 * y0 }];
      if (Math.abs(E[0].c) > 40 || Math.abs(E[1].c) > 40) return null;
      if ([elimText({ E: E, P: [x0, y0] }, 'y'), elimText({ E: E, P: [x0, y0] }, 'x')].some(function (q) { return /^-?[xy]=/.test(q.step); })) return null;
      return { E: E, P: [x0, y0], e1: std(a1, b1, E[0].c), e2: std(a2, b2, E[1].c), L1: Lsd(a1, b1, E[0].c), L2: Lsd(a2, b2, E[1].c) };
    }, null);
  }
  function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
  /* worked elimination text for E (two rows a x + b y = c); eliminate y (or x when ex = 'x') */
  function elimText(S, ex) {
    var E = S.E, v = ex === 'x' ? 'a' : 'b', keep = ex === 'x' ? 'y' : 'x', c1 = E[0][v], c2 = E[1][v], L = lcm(c1, c2), k1 = L / Math.abs(c1), k2 = L / Math.abs(c2);
    var R1 = { a: E[0].a * k1, b: E[0].b * k1, c: E[0].c * k1 }, R2 = { a: E[1].a * k2, b: E[1].b * k2, c: E[1].c * k2 };
    var add = (R1[v] > 0) !== (R2[v] > 0), res = add ? { a: R1.a + R2.a, b: R1.b + R2.b, c: R1.c + R2.c } : { a: R1.a - R2.a, b: R1.b - R2.b, c: R1.c - R2.c };
    var kc = keep === 'x' ? res.a : res.b, P = S.P, sol = keep === 'x' ? P[0] : P[1];
    var s = (k1 > 1 ? 'Multiply the first equation by ' + t(k1) + ': ' + t(std(R1.a, R1.b, R1.c)) + '.<br>' : '') + (k2 > 1 ? 'Multiply the second equation by ' + t(k2) + ': ' + t(std(R2.a, R2.b, R2.c)) + '.<br>' : '');
    s += (add ? 'Add' : 'Subtract') + ' the equations (the ' + t(ex === 'x' ? 'x' : 'y') + '-terms cancel): ' + t(T([[kc, keep]]) + '=' + nT(res.c)) + ' ⟹ ' + t(keep + '=' + nT(sol)) + '.<br>';
    var back = E[0], other = ex === 'x' ? 'x' : 'y', ov = ex === 'x' ? P[0] : P[1];
    s += 'Substitute into ' + t(std(back.a, back.b, back.c)) + ' to get ' + t(other + '=' + nT(ov)) + '.<br>' + ck(t(subT([[E[0].a, 'x'], [E[0].b, 'y']], { x: P[0], y: P[1] }) + '=' + nT(E[0].c))) + ' and ' + ck(t(subT([[E[1].a, 'x'], [E[1].b, 'y']], { x: P[0], y: P[1] }) + '=' + nT(E[1].c)));
    return { text: s, step: T([[kc, keep]]) + '=' + nT(res.c), v: keep, root: sol };
  }
  /* exact (rational) intersection of two lines given as rows a x + b y = c */
  function solveR(E) { var d = E[0].a * E[1].b - E[1].a * E[0].b; return [fr(E[0].c * E[1].b - E[1].c * E[0].b, d), fr(E[0].a * E[1].c - E[1].a * E[0].c, d)]; }
  function chkPt(E, P) { return ck(t(subT([[E[0].a, 'x'], [E[0].b, 'y']], { x: P[0], y: P[1] }) + '=' + nT(E[0].c))) + ' and ' + ck(t(subT([[E[1].a, 'x'], [E[1].b, 'y']], { x: P[0], y: P[1] }) + '=' + nT(E[1].c))); }
  /* elimination step (any one-variable equation with the right root) */
  function elimStepP(prompt, S, o, sol, hints, text) {
    o = o || {}; var P = S.P, acc = o.only === 'x' ? [{ v: 'x', root: fv(P[0]) }] : o.only === 'y' ? [{ v: 'y', root: fv(P[1]) }] : [{ v: 'x', root: fv(P[0]) }, { v: 'y', root: fv(P[1]) }];
    return stepP(prompt, o.key, acc, { wrong: o.wrong || [], bothHint: 'Your equation still has both ' + t('x') + ' and ' + t('y') + ' — the coefficients of one variable must match (or be opposites) before you add or subtract.', solvedHint: 'That’s the finished value — type the one-variable equation you get right after adding or subtracting.', bad: o.bad }, sol, hints, text);
  }

  /* ======================= assignment ======================= */
  function subKey(a, v1, c, inner, d) {   // "a·v1 + c(inner) = d"
    var cT = c === 1 ? (a ? '+' : '') : c === -1 ? '-' : (c > 0 && a ? '+' : '') + c;
    return (a ? T([[a, v1]]) : '') + cT + '(' + inner + ')=' + nT(d);
  }
  var QUESTIONS = [
    /* ---------- 1 ---------- */
    { num: '1', section: 'Part A — Graphing and Classifying', shared: function (r) { return r.chance(0.06) ? Object.assign({ m1: -1, b1: 6, m2: 3, b2: -2, P: [2, 4] }, { L1: mbL(-1, 6), L2: mbL(3, -2), e1: yT(-1, 6), e2: yT(3, -2) }) : crossGen(r, {}); },
      stem: function (s) { return 'The lines ' + t(s.e1) + ' and ' + t(s.e2) + ' cross at integer coordinates.'; },
      parts: [
        { id: '1a', sub: 'a', level: 'BEG', make: function (r, s) {
          var key = T([[s.m1, 'x'], [s.b1, '']]) + '=' + T([[s.m2, 'x'], [s.b2, '']]);
          return stepP('Solve the system algebraically: set the two expressions for ' + t('y') + ' equal. Type that equation (it has only ' + t('x') + ' in it).', key, [{ v: 'x', root: s.P[0] }], {},
            t(key) + ' ⟹ ' + t(T([[s.m1 - s.m2, 'x']]) + '=' + nT(s.b2 - s.b1)) + ' ⟹ ' + t('x=' + nT(s.P[0])) + '.', ['Both equations say what ' + t('y') + ' equals, so the two right sides must be equal where the lines cross.'], 'set the expressions equal');
        } },
        { id: '1b', sub: 'b', level: 'BEG', make: function (r, s) {
          return pointPart('State the solution of the system as an ordered pair.', s.P, [s.L1, s.L2], { wrong: [{ is: [0, s.b1], code: 'u8l1-yint', hint: 'That’s where the first line crosses the ' + t('y') + '-axis. The solution is where the two lines cross each other.' }] },
            t(T([[s.m1, 'x'], [s.b1, '']]) + '=' + T([[s.m2, 'x'], [s.b2, '']])) + ' gives ' + t('x=' + nT(s.P[0])) + '; then ' + t('y=' + subT([[s.m1, 'x'], [s.b1, '']], { x: s.P[0] }) + '=' + nT(s.P[1])) + '.<br>' + ck(t(nT(s.P[1]) + '=' + subT([[s.m2, 'x'], [s.b2, '']], { x: s.P[0] }))) + '<br>The solution is ' + ptt(s.P) + ' — the point where the two lines cross.',
            ['Find ' + t('x') + ' from part (a), then substitute it into either equation to find ' + t('y') + '.'], 'state the solution');
        } }] },
    /* ---------- 2 ---------- */
    { num: '2', shared: function (r) { return r.chance(0.06) ? { m1: 2, b1: -4, m2: -1, b2: 5, P: [3, 2], L1: mbL(2, -4), L2: mbL(-1, 5), e1: yT(2, -4), e2: yT(-1, 5) } : crossGen(r, { m1: [1, 2, 3], m2: [-1, -2, -3] }); },
      stem: function (s) { return 'Graph ' + both(s.e1, s.e2) + ' without technology, and state the solution of the system.'; },
      parts: [
        { id: '2a', sub: 'graph', level: 'EMG', make: function (r, s) {
          return sysGraph('Graph both lines (arrows on both ends).', [s.L1, s.L2], [s.e1, s.e2], W6, {},
            t(s.e1) + ': start at ' + ptt([0, s.b1]) + ', slope ' + t(nT(s.m1)) + '.<br>' + t(s.e2) + ': start at ' + ptt([0, s.b2]) + ', slope ' + t(nT(s.m2)) + '.<br>The lines cross at ' + ptt(s.P) + '.',
            ['Plot each ' + t('y') + '-intercept, then use the slope (rise over run) to find more points.'], 'graph the system');
        } },
        { id: '2b', sub: 'solution', level: 'BEG', make: function (r, s) {
          return pointPart('State the solution of the system.', s.P, [s.L1, s.L2], {},
            'The lines cross at ' + ptt(s.P) + '.<br>' + ck(t(nT(s.P[1]) + '=' + subT([[s.m1, 'x'], [s.b1, '']], { x: s.P[0] }))) + ' and ' + ck(t(nT(s.P[1]) + '=' + subT([[s.m2, 'x'], [s.b2, '']], { x: s.P[0] }))),
            ['Read the point where the two lines cross, then check it in both equations.'], 'graph solution');
        } }] },
    /* ---------- 3–6 ---------- */
    { num: '3', stem: 'Without graphing, state whether the system has one solution, no solution, or infinitely many solutions.', parts: [
      { id: '3', level: 'BEG', make: function (r) {
        var o = r.chance(0.06) ? { m: 5, b1: -2, b2: 4 } : gen(function () { var m = nz(r, -7, 7), b1 = nz(r, -9, 9), b2 = nz(r, -9, 9); if (m === 6 && (b1 + b2 === 4 && b1 * b2 === -5)) return null; return b1 === b2 ? null : { m: m, b1: b1, b2: b2 }; }, { m: 5, b1: -2, b2: 4 });   // Example 2(a), y=6x−1 and y=6x+5, stays out
        return clsMC(r, 'The system ' + both(yT(o.m, o.b1), yT(o.m, o.b2)) + ' has', 'none', 'Both slopes are ' + t(nT(o.m)) + '; the intercepts are ' + t(nT(o.b1)) + ' and ' + t(nT(o.b2)) + '.',
          { html: '<b>One solution</b> — the ' + t('y') + '-intercepts are different, so the lines are different and must cross.', why: 'Different lines don’t have to cross: with <b>equal slopes</b> they are parallel and never meet.' }, null, 'classify: same slope');
      } }] },
    { num: '4', parts: [
      { id: '4', level: 'BEG', make: function (r) {
        var o = r.chance(0.06) ? { m1: -2, b1: 9, m2: 4, b2: -3 } : gen(function () { var m1 = nz(r, -6, 6), m2 = nz(r, -6, 6), b1 = nz(r, -9, 9), b2 = nz(r, -9, 9); return m1 === m2 || m1 === -m2 || b1 === b2 ? null : { m1: m1, m2: m2, b1: b1, b2: b2 }; }, null);
        return clsMC(r, 'The system ' + both(yT(o.m1, o.b1), yT(o.m2, o.b2)) + ' has', 'one', 'The slopes are ' + t(nT(o.m1)) + ' and ' + t(nT(o.m2)) + ' — different.',
          { html: '<b>No solution</b> — the ' + t('y') + '-intercepts are different, so the lines never meet.', why: 'Different intercepts only matter when the slopes are equal. These slopes are different, so the lines cross once.' }, null, 'classify: different slopes');
      } }] },
    { num: '5', parts: [
      { id: '5', level: 'BEG', make: function (r) {
        var o = r.chance(0.06) ? { m: 7, b: -10 } : { m: nz(r, -8, 8), b: nz(r, -12, 12) };
        return clsMC(r, 'The system ' + both(yT(o.m, o.b), yT(o.m, o.b)) + ' has', 'inf', 'Both equations are ' + t(yT(o.m, o.b)) + ': the same slope and the same intercept.',
          { html: '<b>No solution</b> — the two equations are identical, so there is nothing to solve.', why: 'Identical equations describe the <b>same line</b>, so every point on it satisfies both: infinitely many solutions.' }, null, 'classify: identical');
      } }] },
    { num: '6', parts: [
      { id: '6', level: 'EMG', make: function (r) {
        var o = r.chance(0.06) ? { m: 3, b: 2 } : { m: r.int(1, 6), b: nz(r, -9, 9) };
        return clsMC(r, 'The system ' + both(yT(-o.m, o.b), yT(o.m, o.b)) + ' has', 'one', 'The slopes are ' + t(nT(-o.m)) + ' and ' + t(nT(o.m)) + ' — opposites, but <b>not equal</b>.',
          { html: '<b>No solution</b> — the slopes ' + t(nT(-o.m)) + ' and ' + t(nT(o.m)) + ' are opposites, so the lines are parallel.', why: 'Parallel lines have <b>equal</b> slopes. Opposite slopes are different, so the lines cross — here at ' + ptt([0, o.b]) + '.' }, null, 'classify: opposite slopes');
      } }] },
    /* ---------- 7 ---------- */
    { num: '7', shared: function (r) {
        if (r.chance(0.06)) return { m: -1, b: 5, b2: 5, a: 2, bb: 2, c: 10, kind: 'inf' };
        return gen(function () { var m = r.pick([-1, 1, -2, 2, -3, 3]), b = nz(r, -8, 8), k = r.pick([2, 3, 4]), kind = r.chance(0.7) ? 'inf' : 'none', b2 = kind === 'inf' ? b : b + nz(r, -4, 4); if (b2 === 0) return null;
          var a = -k * m, bb = k, c = k * b; if (a < 0) { a = -a; bb = -bb; c = -c; } return { m: m, b: b, b2: b2, a: a, bb: bb, c: c, kind: kind }; }, null);
      },
      stem: function (s) { return 'Consider the system ' + both(std(s.a, s.bb, s.c), yT(s.m, s.b2)) + '.'; },
      parts: [
        { id: '7a', sub: 'a', level: 'EMG', make: function (r, s) { return rewritePart('Rewrite the first equation, ' + t(std(s.a, s.bb, s.c)) + ', in slope–intercept form.', s.a, s.bb, s.c); } },
        { id: '7b', sub: 'b', level: 'EMG', make: function (r, s) {
          var tell = t(std(s.a, s.bb, s.c)) + ' is ' + t(yT(s.m, s.b)) + ', and the other equation is ' + t(yT(s.m, s.b2)) + ': both slopes are ' + t(nT(s.m)) + (s.kind === 'inf' ? ' and both intercepts are ' + t(nT(s.b)) + '.' : '; the intercepts are ' + t(nT(s.b)) + ' and ' + t(nT(s.b2)) + '.');
          return clsMC(r, 'How many solutions does the system have?', s.kind, tell, { html: '<b>One solution</b> — the equations are written in different forms, so they are different lines.', why: 'The form doesn’t matter. Rewrite the first equation as ' + t('y=mx+b') + ' and compare.' }, null, 'classify after rewriting');
        } }] },
    /* ---------- 8–9 ---------- */
    { num: '8', section: 'Part B — Substitution', shared: function (r) { var s = r.chance(0.06) ? null : subIsoY(r, {}); return s || { m: 5, b: -6, a: 3, c: 1, d: 10, P: [2, 4], e1: yT(5, -6), e2: std(3, 1, 10), L1: mbL(5, -6), L2: Lsd(3, 1, 10) }; },
      stem: function (s) { return 'Solve using substitution: ' + both(s.e1, s.e2) + '.'; },
      parts: [
        { id: '8a', sub: 'substitute', level: 'BEG', make: function (r, s) {
          var inner = T([[s.m, 'x'], [s.b, '']]), key = subKey(s.a, 'x', s.c, inner, s.d);
          return stepP('Substitute ' + t(s.e1) + ' into ' + t(s.e2) + '. Type the equation you get (only ' + t('x') + ' left) — don’t solve it yet.', key, [{ v: 'x', root: s.P[0] }],
            { wrong: s.c === 1 ? [] : [{ v: 'x', root: (s.d - s.b) / (s.a + s.c * s.m), code: 'u8l8-dist', hint: 'Multiply the bracket out to <b>every</b> term: ' + t(s.c + '(' + inner + ')=' + T([[s.c * s.m, 'x'], [s.c * s.b, '']])) + '.' }] },
            'Replace ' + t('y') + ' with ' + t('(' + inner + ')') + ': ' + t(key) + '.', ['Write ' + t(s.e2) + ' again, with ' + t('(' + inner + ')') + ' in place of ' + t('y') + '.'], 'substitute y');
        } },
        { id: '8b', sub: 'solve', level: 'BEG', make: function (r, s) {
          var inner = T([[s.m, 'x'], [s.b, '']]);
          return pointPart('Solve the system. Give the solution as an ordered pair.', s.P, [s.L1, s.L2], {},
            t(subKey(s.a, 'x', s.c, inner, s.d)) + ' ⟹ ' + t(T([[s.a + s.c * s.m, 'x'], [s.c * s.b, '']]) + '=' + s.d) + ' ⟹ ' + t(T([[s.a + s.c * s.m, 'x']]) + '=' + (s.d - s.c * s.b)) + ' ⟹ ' + t('x=' + s.P[0]) + '.<br>' + t('y=' + subT([[s.m, 'x'], [s.b, '']], { x: s.P[0] }) + '=' + s.P[1]) + '.<br>' + ck(t(subT([[s.a, 'x'], [s.c, 'y']], { x: s.P[0], y: s.P[1] }) + '=' + s.d)),
            ['Solve your equation from (a) for ' + t('x') + ', then put ' + t('x') + ' into ' + t(s.e1) + '.'], 'substitution solve');
        } }] },
    { num: '9', shared: function (r) { var s = r.chance(0.06) ? null : subIsoX(r, {}); return s || { p: 2, q: 7, a: 1, c: -1, d: 10, P: [13, 3], e1: 'x=2y+7', e2: std(1, -1, 10), L1: line(1, -2, -7), L2: Lsd(1, -1, 10) }; },
      stem: function (s) { return 'Solve using substitution: ' + both(s.e1, s.e2) + '.'; },
      parts: [
        { id: '9a', sub: 'substitute', level: 'BEG', make: function (r, s) {
          var inner = T([[s.p, 'y'], [s.q, '']]), key = subKey(0, '', s.a, inner, 0).replace(/=0$/, '') + (s.c ? (s.c > 0 ? '+' : '') + T([[s.c, 'y']]) : '') + '=' + nT(s.d);
          return stepP('Substitute ' + t(s.e1) + ' into ' + t(s.e2) + '. Type the equation you get (only ' + t('y') + ' left) — don’t solve it yet.', key, [{ v: 'y', root: s.P[1] }],
            { wrong: s.a === 1 ? [] : [{ v: 'y', root: (s.d - s.q) / (s.a * s.p + s.c), code: 'u8l8-dist', hint: 'Multiply the bracket out to <b>every</b> term: ' + t(s.a + '(' + inner + ')=' + T([[s.a * s.p, 'y'], [s.a * s.q, '']])) + '.' }] },
            'Replace ' + t('x') + ' with ' + t('(' + inner + ')') + ': ' + t(key) + '.', ['Write ' + t(s.e2) + ' again, with ' + t('(' + inner + ')') + ' in place of ' + t('x') + '.'], 'substitute x');
        } },
        { id: '9b', sub: 'solve', level: 'BEG', make: function (r, s) {
          var k = s.a * s.p + s.c;
          return pointPart('Solve the system. Give the solution as an ordered pair.', s.P, [s.L1, s.L2], {},
            t(T([[s.a * s.p, 'y'], [s.a * s.q, '']]) + (s.c > 0 ? '+' : '') + T([[s.c, 'y']]) + '=' + s.d) + ' ⟹ ' + t(T([[k, 'y']]) + '=' + (s.d - s.a * s.q)) + ' ⟹ ' + t('y=' + s.P[1]) + '.<br>' + t('x=' + subT([[s.p, 'y'], [s.q, '']], { y: s.P[1] }) + '=' + s.P[0]) + '.<br>' + ck(t(subT([[s.a, 'x'], [s.c, 'y']], { x: s.P[0], y: s.P[1] }) + '=' + s.d)),
            ['Solve your equation from (a) for ' + t('y') + ', then put ' + t('y') + ' into ' + t(s.e1) + '.'], 'substitution solve x');
        } }] },
    /* ---------- 10–11 ---------- */
    { num: '10', shared: function (r) { return r.chance(0.06) ? { E: [{ a: 1, b: 4, c: 18 }, { a: 3, b: -1, c: 15 }], P: [6, 3], e1: std(1, 4, 18), e2: std(3, -1, 15), L1: Lsd(1, 4, 18), L2: Lsd(3, -1, 15) } : isoGen(r, 'x1'); },
      stem: function (s) { return 'Solve using substitution, isolating a variable first: ' + both(s.e1, s.e2) + '.'; },
      parts: [
        { id: '10a', sub: 'isolate', level: 'EMG', make: function (r, s) { return isoPart(s, 'x'); } },
        { id: '10b', sub: 'solve', level: 'EMG', make: function (r, s) { return isoSolve(s, 'x'); } }] },
    { num: '11', shared: function (r) { return r.chance(0.06) ? { E: [{ a: 2, b: 1, c: 17 }, { a: 1, b: -3, c: -16 }], P: [5, 7], e1: std(2, 1, 17), e2: std(1, -3, -16), L1: Lsd(2, 1, 17), L2: Lsd(1, -3, -16) } : isoGen(r, 'y1', { neg: r.chance(0.5) }); },
      stem: function (s) { return 'Solve using substitution, isolating a variable first: ' + both(s.e1, s.e2) + '.'; },
      parts: [
        { id: '11a', sub: 'isolate', level: 'EMG', make: function (r, s) { return isoPart(s, 'y'); } },
        { id: '11b', sub: 'solve', level: 'PRG', make: function (r, s) { return isoSolve(s, 'y'); } }] },
    /* ---------- 12–15 ---------- */
    { num: '12', section: 'Part C — Elimination', shared: function (r) { return r.chance(0.06) ? { E: [{ a: 2, b: 3, c: 18 }, { a: 4, b: -3, c: 18 }], P: [6, 2], e1: std(2, 3, 18), e2: std(4, -3, 18), L1: Lsd(2, 3, 18), L2: Lsd(4, -3, 18) } : elimGen(r, 'add'); },
      stem: function (s) { return 'Solve using elimination:' + sysD(s.e1, s.e2); },
      parts: [
        { id: '12a', sub: 'eliminate', level: 'BEG', make: function (r, s) {
          var E = s.E, key = T([[E[0].a + E[1].a, 'x']]) + '=' + nT(E[0].c + E[1].c);
          return elimStepP('The ' + t('y') + '-terms are opposites. Add the equations and type the equation you get (only ' + t('x') + ' left).', s, { only: 'x', key: key, wrong: [{ v: 'x', root: (E[0].c - E[1].c) / (E[0].a + E[1].a), code: 'u8l8-elim-rhs', hint: 'Add the right sides too: ' + t(nT(E[0].c) + '+' + (E[1].c < 0 ? '(' + nT(E[1].c) + ')' : nT(E[1].c)) + '=' + nT(E[0].c + E[1].c)) + '.' }] },
            'Add: ' + t(T([[E[0].a, 'x'], [E[0].b, 'y']]) + '+' + '(' + T([[E[1].a, 'x'], [E[1].b, 'y']]) + ')=' + nT(E[0].c) + '+' + (E[1].c < 0 ? '(' + nT(E[1].c) + ')' : nT(E[1].c))) + ' ⟹ ' + t(key) + '.', ['Add the ' + t('x') + '-terms, the ' + t('y') + '-terms (they cancel) and the right sides.'], 'add the equations');
        } },
        { id: '12b', sub: 'solve', level: 'BEG', make: function (r, s) { return elimSolve(s, 'y', 'Add the equations to find ' + t('x') + ', then substitute back.'); } }] },
    { num: '13', shared: function (r) { return r.chance(0.06) ? { E: [{ a: 5, b: 2, c: 7 }, { a: 5, b: -3, c: 27 }], P: [3, -4], e1: std(5, 2, 7), e2: std(5, -3, 27), L1: Lsd(5, 2, 7), L2: Lsd(5, -3, 27) } : elimGen(r, 'sub'); },
      stem: function (s) { return 'Solve using elimination:' + sysD(s.e1, s.e2); },
      parts: [
        { id: '13a', sub: 'eliminate', level: 'EMG', make: function (r, s) {
          var E = s.E, kb = E[0].b - E[1].b, key = T([[kb, 'y']]) + '=' + nT(E[0].c - E[1].c), W = [];
          if (E[0].b + E[1].b) W.push({ v: 'y', root: (E[0].c - E[1].c) / (E[0].b + E[1].b), code: 'u8l8-elim-sign', hint: 'Subtracting changes the sign of <b>every</b> term being subtracted: ' + t(T([[E[0].b, 'y']]) + '-(' + T([[E[1].b, 'y']]) + ')=' + T([[kb, 'y']])) + '.' });
          W.push({ v: 'y', root: (E[0].c + E[1].c) / kb, code: 'u8l8-elim-rhs', hint: 'Subtract the right sides too: ' + t(nT(E[0].c) + '-' + (E[1].c < 0 ? '(' + nT(E[1].c) + ')' : nT(E[1].c)) + '=' + nT(E[0].c - E[1].c)) + '.' });
          return elimStepP('The ' + t('x') + '-coefficients match. Subtract the second equation from the first and type the equation you get (only ' + t('y') + ' left).', s, { only: 'y', key: key, wrong: W },
            'Subtract: ' + t(T([[E[0].b, 'y']]) + '-(' + T([[E[1].b, 'y']]) + ')=' + nT(E[0].c) + '-' + (E[1].c < 0 ? '(' + nT(E[1].c) + ')' : nT(E[1].c))) + ' ⟹ ' + t(key) + '.', ['Subtract every term of the second equation — its sign changes, the right side too.'], 'subtract the equations');
        } },
        { id: '13b', sub: 'solve', level: 'EMG', make: function (r, s) { return elimSolve(s, 'x', 'Subtract the equations to find ' + t('y') + ', then substitute back.'); } }] },
    { num: '14', shared: function (r) { return r.chance(0.06) ? { E: [{ a: 3, b: 2, c: 16 }, { a: 2, b: 5, c: 18 }], P: [4, 2], e1: std(3, 2, 16), e2: std(2, 5, 18), L1: Lsd(3, 2, 16), L2: Lsd(2, 5, 18) } : bothGen(r, {}); },
      stem: function (s) { return 'Solve using elimination, multiplying each equation by a suitable constant first:' + sysD(s.e1, s.e2); },
      parts: [
        { id: '14a', sub: 'eliminate', level: 'PRG', make: function (r, s) { return bothStep(s); } },
        { id: '14b', sub: 'solve', level: 'PRG', make: function (r, s) { return elimSolve(s, 'x', 'Multiply both equations so one pair of coefficients matches, then add or subtract.'); } }] },
    { num: '15', shared: function (r) { return r.chance(0.06) ? { E: [{ a: 4, b: 3, c: 7 }, { a: 5, b: -2, c: -20 }], P: [-2, 5], e1: std(4, 3, 7), e2: std(5, -2, -20), L1: Lsd(4, 3, 7), L2: Lsd(5, -2, -20) } : bothGen(r, { neg: true, mixed: true }); },
      stem: function (s) { return 'Solve using elimination, multiplying each equation by a suitable constant first:' + sysD(s.e1, s.e2); },
      parts: [
        { id: '15a', sub: 'eliminate', level: 'ADV', make: function (r, s) { return bothStep(s); } },
        { id: '15b', sub: 'solve', level: 'ADV', make: function (r, s) { return elimSolve(s, 'y', 'The ' + t('y') + '-terms have opposite signs: multiply so they match in size, then add.'); } }] },
    /* ---------- 16 ---------- */
    { num: '16', section: 'Part D — Word Problems', shared: function (r) { return r.chance(0.06) ? { S: 50, k: 3, c: 2, s: 12, L: 38 } : gen(function () { var k = r.pick([2, 3, 4]), c = r.int(1, 9), s = r.int(4, 20); return { S: (k + 1) * s + c, k: k, c: c, s: s, L: k * s + c }; }, null); },
      stem: function (o) { return 'The sum of two numbers is ' + t(o.S) + '. The larger number is ' + t(o.c) + ' more than ' + TIMES[o.k] + ' the smaller number. Let ' + t('L') + ' be the larger number and ' + t('s') + ' the smaller number.'; },
      parts: [
        { id: '16a', sub: 'a', level: 'EMG', make: function (r, o) {
          return sysP('Write a system of two equations describing this situation.', [[1, 1, -o.S], [1, -o.k, -o.c]],
            { vars: ['L', 's'], keyTex: ['L+s=' + o.S, 'L=' + o.k + 's+' + o.c], names: ['the sum', 'the comparison'], factHints: ['the numbers add to ' + t(o.S) + '.', 'start from ' + TIMES[o.k] + ' the smaller, ' + t(o.k + 's') + ', and add ' + t(o.c) + '.'],
              wrong: [{ eq: 'L+' + o.c + '=' + o.k + 's', code: 'more-than-side', hint: '“' + o.c + ' more than ' + TIMES[o.k] + ' the smaller” is ' + t(o.k + 's+' + o.c) + ', so ' + t('L=' + o.k + 's+' + o.c) + '.' }, { eq: 's=' + o.k + 'L+' + o.c, code: 'ratio-flip', hint: 'The <b>larger</b> number is built from ' + TIMES[o.k] + ' the smaller: ' + t('L=' + o.k + 's+' + o.c) + '.' }, { eq: 'L-s=' + o.S, code: 'sum-diff', hint: 'A <b>sum</b> adds: ' + t('L+s=' + o.S) + '.' }] },
            t('L+s=' + o.S) + ' and ' + t('L=' + o.k + 's+' + o.c) + '.', ['One equation for the sum, one for the comparison. Build “' + o.c + ' more than ' + TIMES[o.k] + ' the smaller” in order.'], 'numbers system');
        } },
        { id: '16b', sub: 'b', level: 'EMG', make: function (r, o) {
          return numsP('Solve the system to find both numbers.', [{ label: 'Larger number' }, { label: 'Smaller number' }], [o.L, o.s], { names: ['larger number', 'smaller number'], sys: [[1, 1, -o.S], [1, -o.k, -o.c]], sysNames: ['the sum', 'the comparison'] },
            'Substitute ' + t('L=' + o.k + 's+' + o.c) + ': ' + t('(' + o.k + 's+' + o.c + ')+s=' + o.S) + ' ⟹ ' + t((o.k + 1) + 's=' + (o.S - o.c)) + ' ⟹ ' + t('s=' + o.s) + ', ' + t('L=' + o.L) + '.<br>' + chk('Check: ' + t(o.L + '+' + o.s + '=' + o.S)) + '<br><b>The numbers are ' + o.L + ' and ' + o.s + '.</b>',
            ['Substitute the comparison equation into the sum.'], 'numbers solve');
        } }] },
    /* ---------- 17 ---------- */
    { num: '17', shared: function (r) { return r.chance(0.06) ? { X: 'g', Y: 't', n1: 'general tickets', n2: 'student tickets', what: 'tickets', each: 'each', p1: 8, p2: 5, x: 120, y: 90, N: 210, T: 1410 } : cv(r, { X: 'g', Y: 't', n1: 'general tickets', n2: 'student tickets', what: 'tickets', each: 'each' }, function () { var p1 = r.int(7, 12), p2 = r.int(4, p1 - 2); return { p1: p1, p2: p2, x: 10 * r.int(5, 15), y: 10 * r.int(5, 15) }; }); },
      stem: function (s) { return 'A school play sold ' + t(s.N) + ' tickets, some at the general price of ' + Dh(s.p1) + ' and some at the student price of ' + Dh(s.p2) + ', for total sales of ' + Dh(s.T) + '.'; },
      parts: [
        { id: '17a', sub: 'a', level: 'EMG', make: function (r, s) { return cvSys('Let ' + t('g') + ' be the number of general tickets and ' + t('t') + ' the number of student tickets. Write a system of two equations.', s); } },
        { id: '17b', sub: 'b', level: 'PRG', make: function (r, s) { return cvSolve('Solve to find how many of each type were sold.', s, s.x + ' general tickets and ' + s.y + ' student tickets were sold.'); } }] },
    /* ---------- 18 ---------- */
    { num: '18', shared: function (r) { return r.chance(0.06) ? { w: 9, d: 4, l: 13, P: 44 } : gen(function () { var w = r.int(5, 20), d = r.int(2, 10); return { w: w, d: d, l: w + d, P: 2 * (2 * w + d) }; }, null); },
      stem: function (o) { return 'A rectangular banner has a perimeter of ' + t(o.P + '\\text{ cm}') + '. Its length is ' + t(o.d + '\\text{ cm}') + ' more than its width. Let ' + t('l') + ' be the length and ' + t('w') + ' the width, in centimetres.'; },
      parts: [
        { id: '18a', sub: 'a', level: 'EMG', make: function (r, o) {
          return sysP('Write a system of two equations describing the banner.', [[2, 2, -o.P], [1, -1, -o.d]],
            { vars: ['l', 'w'], keyTex: ['2l+2w=' + o.P, 'l=w+' + o.d], names: ['the perimeter', 'the length–width fact'], factHints: ['the perimeter adds all four sides: ' + t('2l+2w') + '.', 'the length is ' + o.d + ' cm more than the width.'],
              wrong: [{ eq: 'l+w=' + o.P, code: 'perim-half', hint: 'The perimeter adds <b>all four</b> sides: ' + t('2l+2w=' + o.P) + '.' }, { eq: 'w=l+' + o.d, code: 'more-than-flip', hint: 'The length is the longer side: ' + t('l=w+' + o.d) + '.' }, { eq: 'l=' + o.d + 'w', code: 'more-times', hint: '“' + o.d + ' cm more” <b>adds</b> ' + t(o.d) + '.' }], good: [['l+w=' + o.P / 2, 'l-w=' + o.d]] },
            t('2l+2w=' + o.P) + ' (or ' + t('l+w=' + o.P / 2) + ') and ' + t('l=w+' + o.d) + '.', ['A perimeter adds all four sides.'], 'banner system');
        } },
        { id: '18b', sub: 'b', level: 'PRG', make: function (r, o) {
          return numsP('Solve the system to find the length and width of the banner.', [{ label: 'Length', after: 'cm' }, { label: 'Width', after: 'cm' }], [o.l, o.w],
            { names: ['length', 'width'], sys: [[1, 1, -o.P / 2], [1, -1, -o.d]], sysNames: ['the perimeter', 'the length–width fact'], swapHint: 'The length is the longer side.', wrong: [{ v: [(o.P + o.d) / 2, (o.P - o.d) / 2], code: 'perim-half', hint: 'Check the perimeter: use ' + t('2l+2w=' + o.P) + ', so ' + t('l+w=' + o.P / 2) + '.' }] },
            t('l+w=' + o.P / 2) + '. Substitute ' + t('l=w+' + o.d) + ': ' + t('2w+' + o.d + '=' + o.P / 2) + ' ⟹ ' + t('w=' + o.w) + ', ' + t('l=' + o.l) + '.<br>' + chk('Check: ' + t('2(' + o.l + ')+2(' + o.w + ')=' + o.P)) + '<br><b>The banner is ' + o.l + ' cm long and ' + o.w + ' cm wide.</b>',
            ['Halve the perimeter equation, then substitute.'], 'banner solve');
        } }] },
    /* ---------- 19 ---------- */
    { num: '19', shared: function (r) { return r.chance(0.06) ? { a: 4, b: 2, c: 3, P: [4, 3] } : gen(function () { var a = r.int(2, 5), b = r.int(2, 5), c = r.int(2, 5), x0 = r.int(1, 6), y0 = r.int(1, 6); if (a === b || a * c + b === 0) return null; return { a: a, b: b, c: c, P: [x0, y0] }; }, null); },
      stem: function (s) { var c1 = s.a * s.P[0] - s.P[1], c2 = s.b * s.P[0] + s.c * s.P[1]; return 'Consider the system ' + both(std(s.a, -1, c1), std(s.b, s.c, c2)) + '.'; },
      parts: [
        { id: '19a', sub: 'method', level: 'EMG', make: function (r, s) {
          var c1 = s.a * s.P[0] - s.P[1];
          return mc(r, 'Which method is fastest here, and why?', [
            { html: '<b>Substitution</b> — ' + t('y') + ' has coefficient ' + t('-1') + ' in the first equation, so ' + t('y=' + T([[s.a, 'x'], [-c1, '']])) + ' has no fractions.', right: true },
            { html: '<b>Elimination right away</b> — the ' + t('x') + '-coefficients already match.', why: 'The ' + t('x') + '-coefficients are ' + t(s.a) + ' and ' + t(s.b) + ' — they don’t match.' },
            { html: '<b>Graphing</b> — both equations are in ' + t('y=mx+b') + ' form.', why: 'Both equations are in standard form, ' + t('Ax+By=C') + ', not ' + t('y=mx+b') + '.' },
            { html: '<b>Substitution</b> — isolate ' + t('x') + ' in the second equation.', why: 'Isolating ' + t('x') + ' there means dividing by ' + t(s.b) + ' — fractions. The ' + t('-y') + ' in the first equation is the easy one.' }],
            'In ' + t(std(s.a, -1, c1)) + ' the ' + t('y') + '-term has coefficient ' + t('-1') + ', so isolating ' + t('y') + ' is one step with no fractions: ' + t('y=' + T([[s.a, 'x'], [-c1, '']])) + '. Substitution is quickest. (Multiplying the first equation by ' + t(s.c) + ' and adding also works.)',
            ['Look for a variable with coefficient ' + t('1') + ' or ' + t('-1') + '.'], 'choose a method');
        } },
        { id: '19b', sub: 'solve', level: 'PRG', make: function (r, s) {
          var c1 = s.a * s.P[0] - s.P[1], c2 = s.b * s.P[0] + s.c * s.P[1], k = s.b + s.c * s.a;
          return pointPart('Solve the system.', s.P, [Lsd(s.a, -1, c1), Lsd(s.b, s.c, c2)], {},
            t('y=' + T([[s.a, 'x'], [-c1, '']])) + '. Substitute: ' + t(subKey(s.b, 'x', s.c, T([[s.a, 'x'], [-c1, '']]), c2)) + ' ⟹ ' + t(T([[k, 'x']]) + '=' + (c2 + s.c * c1)) + ' ⟹ ' + t('x=' + s.P[0]) + ', ' + t('y=' + s.P[1]) + '.<br>' + chkPt([{ a: s.a, b: -1, c: c1 }, { a: s.b, b: s.c, c: c2 }], s.P),
            ['Isolate ' + t('y') + ' in the first equation and substitute into the second.'], 'choose and solve');
        } }] },
    /* ---------- 20 ---------- */
    { num: '20', section: 'Part E — Mixed Review', shared: function (r) { return r.chance(0.06) ? { f1: 20, f2: 50, rt: 35 } : gen(function () { var f1 = 5 * r.int(2, 12), f2 = 5 * r.int(2, 12), rt = r.int(20, 60); return f1 === f2 ? null : { f1: f1, f2: f2, rt: rt }; }, null); },
      stem: function (s) { return 'Gym A charges ' + art(s.f1) + ' ' + Dh(s.f1) + ' sign-up fee plus ' + Dh(s.rt) + ' per month; Gym B charges ' + art(s.f2) + ' ' + Dh(s.f2) + ' sign-up fee plus ' + Dh(s.rt) + ' per month. Let ' + t('C') + ' be the total cost in dollars after ' + t('m') + ' months.'; },
      parts: [
        { id: '20a', sub: 'a', level: 'EMG', make: function (r, s) {
          var LA = line(s.rt, -1, s.f1), LB = line(s.rt, -1, s.f2);
          var p = twoEq('Write an equation for the total cost at each gym in terms of the number of months ' + t('m') + '.', [LA, LB], ['Gym A:', 'Gym B:'], { vars: ['m', 'C'], wrong: [[{ is: 'C=' + s.f1 + 'm+' + s.rt, code: 'rate-fixed', hint: 'The sign-up fee is paid once; the ' + Dh(s.rt) + ' is paid every month: ' + t('C=' + s.rt + 'm+' + s.f1) + '.' }], [{ is: 'C=' + s.f2 + 'm+' + s.rt, code: 'rate-fixed', hint: 'The sign-up fee is paid once; the monthly fee multiplies ' + t('m') + '.' }]] },
            'Gym A: ' + t('C=' + s.rt + 'm+' + s.f1) + '<br>Gym B: ' + t('C=' + s.rt + 'm+' + s.f2), ['Cost = monthly fee × months + sign-up fee.'], 'gym equations');
          return p;
        } },
        { id: '20b', sub: 'b', level: 'PRG', make: function (r, s) {
          var hi = s.f2 > s.f1 ? 'B' : 'A', d = Math.abs(s.f2 - s.f1);
          return mc(r, 'Without solving, classify the system and explain what this means about the two gyms’ pricing.', [
            { html: '<b>No solution</b> — same slope (' + t(s.rt) + '), different intercepts: the lines are parallel, so the gyms never cost the same. Gym ' + hi + ' always costs ' + Dh(d) + ' more.', right: true },
            { html: '<b>Infinitely many solutions</b> — both gyms charge ' + Dh(s.rt) + ' a month, so they always cost the same.', why: 'The monthly fees match, but the sign-up fees don’t: the intercepts differ by ' + t(d) + ', so the costs are never equal.' },
            { html: '<b>One solution</b> — the gyms cost the same after some number of months.', why: 'Equal slopes mean the gap never closes: Gym ' + hi + ' stays ' + Dh(d) + ' more every month.' },
            { html: '<b>No solution</b> — so Gym ' + (hi === 'A' ? 'B' : 'A') + ' is always the more expensive gym.', why: 'Compare the sign-up fees: Gym ' + hi + ' starts ' + Dh(d) + ' higher and the monthly fees are equal.' }],
            'Both slopes are ' + t(s.rt) + ' (the monthly fee), and the intercepts are ' + t(s.f1) + ' and ' + t(s.f2) + '. Same slope, different intercepts: parallel lines, <b>no solution</b>. The gyms never cost the same — Gym ' + hi + ' is always ' + Dh(d) + ' more.',
            ['Compare the slopes (monthly fees) and the intercepts (sign-up fees).'], 'gym classify');
        } }] },
    /* ---------- 21 ---------- */
    { num: '21', shared: function (r) { return r.chance(0.06) ? { w: 14, c: 3, l: 25, P: 78 } : gen(function () { var w = r.int(6, 25), c = r.int(1, 9), l = 2 * w - c; if (w <= c) return null; return { w: w, c: c, l: l, P: 2 * (l + w) }; }, null); },
      stem: function (o) { return 'A community garden is rectangular. Its perimeter is ' + t(o.P + '\\text{ m}') + ', and its length is ' + t(o.c + '\\text{ m}') + ' less than twice its width. Let ' + t('l') + ' be the length and ' + t('w') + ' the width, in metres.'; },
      parts: [
        { id: '21a', sub: 'system', level: 'PRG', make: function (r, o) {
          return sysP('Write a system of two equations.', [[2, 2, -o.P], [1, -2, o.c]],
            { vars: ['l', 'w'], keyTex: ['2l+2w=' + o.P, 'l=2w-' + o.c], names: ['the perimeter', 'the length–width fact'], factHints: ['the perimeter adds all four sides.', 'twice the width, ' + t('2w') + ', then subtract ' + t(o.c) + '.'],
              wrong: [{ eq: 'l+w=' + o.P, code: 'perim-half', hint: 'The perimeter adds <b>all four</b> sides: ' + t('2l+2w=' + o.P) + '.' }, { eq: 'l=2w+' + o.c, code: 'more-than-side', hint: '“' + o.c + ' m less than twice the width” is ' + t('2w-' + o.c) + '.' }, { eq: 'l=' + o.c + '-2w', code: 'more-than-side', hint: '“' + o.c + ' less than twice the width”: start from ' + t('2w') + ' and subtract ' + t(o.c) + '.' }, { eq: 'w=2l-' + o.c, code: 'ratio-flip', hint: 'The <b>length</b> is built from twice the width: ' + t('l=2w-' + o.c) + '.' }], good: [['l+w=' + o.P / 2, 'l=2w-' + o.c]] },
            t('2l+2w=' + o.P) + ' and ' + t('l=2w-' + o.c) + '.', ['“' + o.c + ' less than twice the width”: twice the width first, then subtract ' + t(o.c) + '.'], 'garden system');
        } },
        { id: '21b', sub: 'solve', level: 'PRG', make: function (r, o) {
          return numsP('Find the length and width of the garden.', [{ label: 'Length', after: 'm' }, { label: 'Width', after: 'm' }], [o.l, o.w],
            { names: ['length', 'width'], sys: [[1, 1, -o.P / 2], [1, -2, o.c]], sysNames: ['the perimeter', 'the length–width fact'], swapHint: 'The length is about twice the width.' },
            t('l+w=' + o.P / 2) + '. Substitute ' + t('l=2w-' + o.c) + ': ' + t('3w-' + o.c + '=' + o.P / 2) + ' ⟹ ' + t('3w=' + (o.P / 2 + o.c)) + ' ⟹ ' + t('w=' + o.w) + ', ' + t('l=' + o.l) + '.<br>' + chk('Check: ' + t('2(' + o.l + '+' + o.w + ')=' + o.P)) + '<br><b>The garden is ' + o.l + ' m long and ' + o.w + ' m wide.</b>',
            ['Halve the perimeter equation, then substitute.'], 'garden solve');
        } }] },
    /* ---------- 22–23 ---------- */
    { num: '22', parts: [
      { id: '22', level: 'PRG', make: function (r) {
        var o = r.chance(0.06) ? { a: 3, b: 4, d: 2, P: [5, 2] } : gen(function () { var a = r.int(2, 5), b = r.int(2, 5), d = r.int(1, 3), x0 = r.int(1, 8), y0 = r.int(1, 6); if (a === b || a * (-d) - b === 0 || x0 === y0) return null; return { a: a, b: b, d: d, P: [x0, y0] }; }, null);
        var c1 = o.a * o.P[0] + o.b * o.P[1], c2 = o.P[0] - o.d * o.P[1], sum = o.P[0] + o.P[1];
        return numP('If ' + t(std(o.a, o.b, c1)) + ' and ' + t(std(1, -o.d, c2)) + ', determine the value of ' + t('x+y') + '.', sum, function (v) {
          if (v === o.P[0] || v === o.P[1]) return { code: 'u8l8-one', hint: 'That’s ' + (v === o.P[0] ? t('x') : t('y')) + ' on its own. Find both values, then add them.' };
          if (v === o.P[0] - o.P[1]) return { code: 'u8l8-one', hint: 'That’s ' + t('x-y') + '. The question asks for ' + t('x+y') + '.' };
          return null;
        }, 'From ' + t(std(1, -o.d, c2)) + ': ' + t('x=' + T([[o.d, 'y'], [c2, '']])) + '.<br>Substitute: ' + t(o.a + '(' + T([[o.d, 'y'], [c2, '']]) + ')+' + o.b + 'y=' + c1) + ' ⟹ ' + t(T([[o.a * o.d + o.b, 'y']]) + '=' + (c1 - o.a * c2)) + ' ⟹ ' + t('y=' + o.P[1]) + ', ' + t('x=' + o.P[0]) + '.<br>' + t('x+y=' + o.P[0] + '+' + o.P[1] + '=' + sum),
          ['Solve the system first (isolate ' + t('x') + ' in the second equation), then add the two values.'], 'value of x + y');
      } }] },
    { num: '23', parts: [
      { id: '23', level: 'ADV', make: function (r) {
        var S = r.chance(0.06) ? { E: [{ a: 5, b: -2, c: 11 }, { a: 2, b: 3, c: 12 }], P: [3, 2] } : bothGen(r, { mixed: true });
        var cmb = r.chance(0.06) ? [2, -1] : r.pick([[2, -1], [1, 2], [3, -1], [1, -2], [2, 1]]), val = cmb[0] * S.P[0] + cmb[1] * S.P[1], ct = T([[cmb[0], 'x'], [cmb[1], 'y']]);
        var et = elimText({ E: S.E, P: S.P }, 'y');
        return numP('If ' + t(std(S.E[0].a, S.E[0].b, S.E[0].c)) + ' and ' + t(std(S.E[1].a, S.E[1].b, S.E[1].c)) + ', determine the value of ' + t(ct) + '.', val, function (v) {
          if (v === S.P[0] || v === S.P[1]) return { code: 'u8l8-one', hint: 'That’s one of the unknowns. Find both, then work out ' + t(ct) + '.' };
          if (v === S.P[0] + S.P[1] && cmb.join() !== '1,1') return { code: 'u8l8-one', hint: 'That’s ' + t('x+y') + '. The question asks for ' + t(ct) + '.' };
          return null;
        }, et.text + '<br>' + t(ct + '=' + subT([[cmb[0], 'x'], [cmb[1], 'y']], { x: S.P[0], y: S.P[1] }) + '=' + val),
          ['Solve the system by elimination (multiply both equations), then substitute into ' + t(ct) + '.'], 'value of a combination');
      } }] },
    /* ---------- 24 ---------- */
    { num: '24', shared: function (r) { return r.chance(0.06) ? { X: 's', Y: 'l', n1: 'small bags', n2: 'large bags', what: 'bags', each: 'each', dec: false, p1: 2, p2: 3, x: 21, y: 69, N: 90, T: 249 } : cv(r, { X: 's', Y: 'l', n1: 'small bags', n2: 'large bags', what: 'bags', each: 'each', dec: true }, function () { var p1 = r.pick([1, 1.25, 1.5, 1.75, 2, 2]), p2 = p1 + r.pick([0.5, 1, 1, 1.5]); return { p1: p1, p2: p2, x: r.int(10, 70), y: r.int(10, 70), dec: !(Number.isInteger(p1) && Number.isInteger(p2)) }; }); },
      stem: function (s) { return 'A vending machine sold ' + t(s.N) + ' bags of snacks: small bags at ' + t('\\$' + mon(s.p1)) + ' and large bags at ' + t('\\$' + mon(s.p2)) + '. Total sales were ' + t('\\$' + mon(s.T)) + '.'; },
      parts: [
        { id: '24a', sub: 'system', level: 'EMG', make: function (r, s) { return cvSys('Let ' + t('s') + ' be the number of small bags and ' + t('l') + ' the number of large bags. Write a system of two equations.', s); } },
        { id: '24b', sub: 'solve', level: 'PRG', make: function (r, s) { return cvSolve('How many of each were sold?', s, s.x + ' small bags and ' + s.y + ' large bags were sold.'); } }] }
  ];

  /* ---------- assignment helpers used above ---------- */
  function isoPart(s, which, pre) {
    var E = s.E, k0 = which === 'x' ? 'x=' + T([[E[0].c, ''], [-E[0].b, 'y']]) : 'y=' + T([[E[0].c, ''], [-E[0].a, 'x']]);
    var alt = Math.abs(E[1].b) === 1 ? 'y=' + T([[-E[1].a / E[1].b, 'x'], [E[1].c / E[1].b, '']]) : Math.abs(E[1].a) === 1 ? 'x=' + T([[-E[1].b / E[1].a, 'y'], [E[1].c / E[1].a, '']]) : null;
    var p = K.P.math((pre || '') + 'Isolate a variable that has coefficient ' + t('1') + ' or ' + t('-1') + '. Type it as “variable = expression”.', isoChk(E), k0,
      'In ' + t(s.e1) + ', ' + t(which) + ' has coefficient ' + t('1') + ': ' + t(k0) + '.' + (alt ? ' (Or, from ' + t(s.e2) + ': ' + t(alt) + '.) Either one avoids fractions.' : ' Isolating a variable in ' + t(s.e2) + ' would bring in fractions.'),
      ['Which variable has coefficient ' + t('1') + ' or ' + t('-1') + '? Move the other terms to the other side.'], 'isolate a variable', { keys: 'eq', vars: ['x', 'y'], placeholder: 'e.g. y = 3x - 15' });
    p.good = alt ? [alt] : [];
    var badS = which === 'x' ? 'x=' + T([[E[0].c, ''], [E[0].b, 'y']]) : 'y=' + T([[E[0].c, ''], [E[0].a, 'x']]);
    p.bad = [badS];
    return p;
  }
  function isoSolve(s, which, pre) {
    var E = s.E, P = s.P, txt;
    if (which === 'x') { var ex = T([[E[0].c, ''], [-E[0].b, 'y']]), ky = E[1].a * -E[0].b + E[1].b; txt = t('x=' + ex) + '. Substitute into ' + t(s.e2) + ': ' + t((E[1].a === 1 ? '' : E[1].a === -1 ? '-' : E[1].a) + '(' + ex + ')' + (E[1].b < 0 ? '-' : '+') + T([[Math.abs(E[1].b), 'y']]) + '=' + nT(E[1].c)) + ' ⟹ ' + t(T([[ky, 'y']]) + '=' + nT(E[1].c - E[1].a * E[0].c)) + ' ⟹ ' + t('y=' + nT(P[1])) + '; ' + t('x=' + subT([[E[0].c, ''], [-E[0].b, 'y']], { y: P[1] }) + '=' + nT(P[0])) + '.'; }
    else { var ey = T([[E[0].c, ''], [-E[0].a, 'x']]), kx = E[1].a + E[1].b * -E[0].a; txt = t('y=' + ey) + '. Substitute into ' + t(s.e2) + ': ' + t(T([[E[1].a, 'x']]) + (E[1].b < 0 ? '-' : '+') + (Math.abs(E[1].b) === 1 ? '' : Math.abs(E[1].b)) + '(' + ey + ')=' + nT(E[1].c)) + ' ⟹ ' + t(T([[kx, 'x']]) + '=' + nT(E[1].c - E[1].b * E[0].c)) + ' ⟹ ' + t('x=' + nT(P[0])) + '; ' + t('y=' + subT([[E[0].c, ''], [-E[0].a, 'x']], { x: P[0] }) + '=' + nT(P[1])) + '.'; }
    return pointPart((pre || '') + 'Solve the system. Give the solution as an ordered pair.', P, [s.L1, s.L2], {}, txt + '<br>' + chkPt(E, P), ['Substitute your expression from (a) into the <b>other</b> equation.'], 'isolate and solve');
  }
  function elimSolve(s, ex, hint) {
    var et = elimText(s, ex);
    return pointPart('Solve the system. Give the solution as an ordered pair.', s.P, [s.L1, s.L2], {}, et.text, [hint], 'elimination solve');
  }
  function bothStep(s, pre) {
    var et = elimText(s, 'y'), ex = elimText(s, 'x');
    return elimStepP((pre || '') + 'Multiply each equation by a suitable number so that one variable’s coefficients match (or are opposites). Then add or subtract, and type the one-variable equation you get.', s, { key: et.step },
      et.text.split('<br>').slice(0, 3).join('<br>') + '<br>(Eliminating ' + t('x') + ' instead gives ' + t(ex.step) + ' — also fine.)', ['Use the lowest common multiple of the two ' + t('y') + '-coefficients (or the two ' + t('x') + '-coefficients).'], 'multiply both and eliminate');
  }

  /* ======================= EXTRA PRACTICE ======================= */
  function e1Gen(r) { return r.chance(0.06) ? { x0: 2, y0: 3, k: 1, c: 8 } : gen(function () { var x0 = r.pick([-6, -4, -2, 2, 4, 6]), k = nz(r, -5, 5), y0 = x0 + k, c = x0 + 2 * y0; if (Math.abs(c / 2) > 6 || Math.abs(y0) > 6 || c === 0) return null; return { x0: x0, y0: y0, k: k, c: c }; }, null); }
  /* E2 systems by kind */
  function chooseGen(r, kind) {
    return gen(function () {
      var x0 = nz(r, -3, 5), y0 = nz(r, -3, 5), E, tex, info = {};
      if (kind === 'sub-iso') { var m = nz(r, -4, 4), b = y0 - m * x0, p = r.int(2, 6), q = r.int(2, 6); if (Math.abs(m) === 1 || p === q) return null; tex = [yT(m, b), std(p, q, p * x0 + q * y0)]; info.subWhy = t('y') + ' is already isolated in the first equation.'; info.coefs = 'the second equation is ' + t(tex[1]); }
      else if (kind === 'match') { var a = r.int(2, 6), b1 = nz(r, -8, 8), b2 = nz(r, -8, 8); if (Math.abs(b1) < 2 || Math.abs(b2) < 2 || b1 === b2 || b1 === -b2 || b1 % b2 === 0 || b2 % b1 === 0) return null; tex = [std(a, b1, a * x0 + b1 * y0), std(a, b2, a * x0 + b2 * y0)]; info.matchWhy = 'the ' + t('x') + '-coefficients are both ' + t(a) + ', so subtracting removes ' + t('x') + ' in one step.'; }
      else if (kind === 'graph') { var m1 = nz(r, -3, 3), m2 = nz(r, -3, 3), b1g = y0 - m1 * x0, b2g = y0 - m2 * x0; if (m1 === m2 || Math.abs(b1g) > 6 || Math.abs(b2g) > 6 || !b1g || !b2g) return null; tex = [yT(m1, b1g), yT(m2, b2g)]; info.coefs = 'both are in ' + t('y=mx+b') + ' form'; info.subWhy = 'a variable is already isolated (or has coefficient 1).'; }
      else if (kind === 'mult-one') { var a1 = r.int(2, 6), bb = r.int(2, 4), a2 = r.int(2, 6), k = r.int(2, 3); if (a1 === a2 || a1 % a2 === 0 || a2 % a1 === 0) return null; tex = [std(a1, bb, a1 * x0 + bb * y0), std(a2, -k * bb, a2 * x0 - k * bb * y0)]; info.oneWhy = 'multiply the first equation by ' + t(k) + ' to get ' + t((k * bb) + 'y') + ', the opposite of ' + t((-k * bb) + 'y') + '.'; info.coefs = t('x') + ': ' + t(a1) + ' and ' + t(a2) + '; ' + t('y') + ': ' + t(bb) + ' and ' + t(-k * bb); }
      else if (kind === 'sub-one') { var aa = r.int(2, 7), b3 = r.int(2, 9), d = nz(r, -5, 5); if (Math.abs(d) < 2) return null; tex = [std(1, -aa, x0 - aa * y0), std(b3, d, b3 * x0 + d * y0)]; info.subWhy = t('x') + ' has coefficient ' + t('1') + ' in the first equation, so ' + t('x=' + T([[aa, 'y'], [x0 - aa * y0, '']])) + ' costs nothing.'; info.coefs = t('x') + ': ' + t(1) + ' and ' + t(b3) + '; ' + t('y') + ': ' + t(-aa) + ' and ' + t(d); }
      else { var p1 = r.int(2, 9), q1 = r.int(2, 9), p2 = r.int(2, 9), q2 = r.int(2, 9); var dv = function (u, v) { return u % v === 0 || v % u === 0; }; if (dv(p1, p2) || dv(q1, q2) || p1 * q2 === p2 * q1) return null; tex = [std(p1, q1, p1 * x0 + q1 * y0), std(p2, -q2, p2 * x0 - q2 * y0)]; info.coefs = t('x') + ': ' + t(p1) + ' and ' + t(p2) + '; ' + t('y') + ': ' + t(q1) + ' and ' + t(-q2); info.bothNo = null; }
      return { tex: tex, info: info, kind: kind };
    }, null);
  }
  var KIND_SOL = { 'sub-iso': 'Substitution — ' + 'the first equation already gives ' + t('y') + ' by itself, so substitute it straight into the second.', match: 'Elimination right away — the ' + t('x') + '-coefficients match, so subtracting removes ' + t('x') + '.',
    graph: 'Graphing — both equations are in ' + t('y=mx+b') + ' form with integer intercepts, so both lines are quick to draw and they cross at a grid point. (Setting the two expressions equal works just as well.)',
    'mult-one': 'Elimination after multiplying <b>one</b> equation — one ' + t('y') + '-coefficient is a multiple of the other.', 'sub-one': 'Substitution — the ' + t('x') + ' in the first equation has coefficient ' + t('1') + ', so isolating it brings in no fractions.',
    'mult-both': 'Elimination after multiplying <b>both</b> equations — no coefficient is ' + t('\\pm1') + ' and neither column has a multiple, so each equation needs its own multiplier.' };
  /* classify E7 systems: shape gives the two equations' forms */
  function e7Gen(r, shape) {
    return gen(function () {
      var m, b, b2, k, A, B, C, E1, E2, kind, tell;
      if (shape === 'a') { m = nz(r, -5, 5); b = nz(r, -6, 6); k = r.pick([2, 3]); E1 = yT(m, b); E2 = std(-k * m, k, k * b); if (-k * m < 0) E2 = std(k * m, -k, -k * b); kind = 'inf'; tell = t(E2) + ' becomes ' + t(yT(m, b)) + ' — the same line as ' + t(E1) + '.'; }
      else if (shape === 'b') { m = r.int(2, 5); b = nz(r, -7, 7); k = r.pick([2, 3]); C = k * (-b) + nz(r, -3, 3); if (C === -k * b) return null; E1 = std(m, -1, -b); E2 = std(k * m, -k, C); kind = 'none'; tell = t(E1) + ' is ' + t(yT(m, b)) + ' and ' + t(E2) + ' is ' + t(yT(m, [-C, k])) + ': both slopes are ' + t(m) + ', the intercepts ' + t(nT(b)) + ' and ' + t(nT(fr(-C, k))) + ' differ.'; }
      else if (shape === 'c') { var s1 = r.int(-4, 8), d1 = r.int(-6, 6); if ((s1 + d1) % 2) return null; E1 = std(1, 1, s1); E2 = std(1, -1, d1); kind = 'one'; tell = t(E1) + ' has slope ' + t(-1) + ' and ' + t(E2) + ' has slope ' + t(1) + ' — different (they cross at ' + ptt([(s1 + d1) / 2, (s1 - d1) / 2]) + ').'; }
      else if (shape === 'd') { var q = r.int(3, 4), p = r.int(1, q - 1), cc = r.int(5, 12), b0 = r.int(1, 4); if (gcd(p, q) !== 1) return null; A = 2 * p; B = 2 * q; if (fr(cc, B)[0] === b0 * fr(cc, B)[1]) return null; E1 = std(A, B, cc); E2 = yT(fr(-p, q), b0); kind = 'none'; tell = t(E1) + ' is ' + t(yT(fr(-p, q), fr(cc, B))) + '; both slopes are ' + t(fT(fr(-p, q))) + ' but the intercepts ' + t(fT(fr(cc, B))) + ' and ' + t(b0) + ' differ.'; }
      else if (shape === 'e') { var pp = r.pick([3, 5, 7]), qq = 2, bb = nz(r, -5, 5); E1 = std(pp, -qq, -qq * bb); E2 = yT(fr(pp, qq), bb); kind = 'inf'; tell = t(E1) + ' becomes ' + t(yT(fr(pp, qq), bb)) + ' — exactly the second equation.'; }
      else { var a4 = r.int(2, 5), x0 = r.int(1, 4), y0 = r.int(-3, 3); E1 = std(a4, 1, a4 * x0 + y0); E2 = std(1, -1, x0 - y0); kind = 'one'; tell = t(E1) + ' has slope ' + t(-a4) + ' and ' + t(E2) + ' has slope ' + t(1) + ' — different.'; }
      return { E1: E1, E2: E2, kind: kind, tell: tell };
    }, null);
  }

  var EXTRA = [
    /* ---------- 1 ---------- */
    { num: '1', section: 'Extra Practice A — One System, Three Methods', shared: e1Gen,
      stem: function (o) { return 'Consider the system ' + both(std(1, 2, o.c), 'y=' + T([[1, 'x'], [o.k, '']])) + '. Solve it three separate ways.'; },
      parts: [
        { id: 'e1a', sub: 'a graphing', level: 'EMG', make: function (r, o) {
          var L1 = Lsd(1, 2, o.c), L2 = line(1, -1, o.k);
          return sysGraph('<b>Graphing.</b> Write ' + t(std(1, 2, o.c)) + ' in slope–intercept form, then graph both lines.', [L1, L2], [std(1, 2, o.c), 'y=' + T([[1, 'x'], [o.k, '']])], W6, {},
            t(std(1, 2, o.c)) + ' ⟹ ' + t('2y=' + T([[-1, 'x'], [o.c, '']])) + ' ⟹ ' + t(yT([-1, 2], o.c / 2)) + '.<br>Graph it from ' + ptt([0, o.c / 2]) + ' (down 1, right 2), and ' + t(yT(1, o.k)) + ' from ' + ptt([0, o.k]) + ' (up 1, right 1). They cross at ' + ptt([o.x0, o.y0]) + '.',
            ['Divide every term by ' + t(2) + ' after moving ' + t('x') + ': slope ' + t('-\\frac{1}{2}') + '.'], 'graph method');
        } },
        { id: 'e1b', sub: 'b substitution', level: 'BEG', make: function (r, o) {
          var key = 'x+2(' + T([[1, 'x'], [o.k, '']]) + ')=' + o.c;
          return stepP('<b>Substitution.</b> Substitute ' + t('y=' + T([[1, 'x'], [o.k, '']])) + ' into the first equation. Type the equation you get (only ' + t('x') + ' left).', key, [{ v: 'x', root: o.x0 }], { wrong: [{ v: 'x', root: (o.c - o.k) / 3, code: 'u8l8-dist', hint: 'Multiply the bracket out to <b>every</b> term: ' + t('2(x' + (o.k < 0 ? '' : '+') + o.k + ')=2x' + (o.k < 0 ? '' : '+') + 2 * o.k) + '.' }] },
            t(key) + ' ⟹ ' + t('3x' + (o.k < 0 ? '' : '+') + 2 * o.k + '=' + o.c) + ' ⟹ ' + t('x=' + o.x0) + ', so ' + t('y=' + o.y0) + '.', ['Write the first equation again with ' + t('(x' + (o.k < 0 ? '' : '+') + o.k + ')') + ' in place of ' + t('y') + '.'], 'substitution step');
        } },
        { id: 'e1c', sub: 'c elimination', level: 'BEG', make: function (r, o) {
          var key = '3y=' + (o.c + o.k);
          return stepP('<b>Elimination.</b> Rewrite ' + t('y=' + T([[1, 'x'], [o.k, '']])) + ' as ' + t(std(-1, 1, o.k)) + ', then add it to ' + t(std(1, 2, o.c)) + '. Type the equation you get.', key, [{ v: 'y', root: o.y0 }], { wrong: [{ v: 'y', root: (o.c - o.k) / 3, code: 'u8l8-elim-rhs', hint: 'Add the right sides too: ' + t(o.c + '+' + (o.k < 0 ? '(' + o.k + ')' : o.k) + '=' + (o.c + o.k)) + '.' }] },
            t('(x+2y)+(-x+y)=' + o.c + '+' + (o.k < 0 ? '(' + o.k + ')' : o.k)) + ' ⟹ ' + t(key) + ' ⟹ ' + t('y=' + o.y0) + ', then ' + t('x=' + o.x0) + '.', ['The ' + t('x') + '-coefficients are ' + t(1) + ' and ' + t(-1) + ': adding removes ' + t('x') + '.'], 'elimination step');
        } },
        { id: 'e1d', sub: 'd solution', level: 'BEG', make: function (r, o) {
          return pointPart('State the solution as an ordered pair.', [o.x0, o.y0], [Lsd(1, 2, o.c), line(1, -1, o.k)], {},
            'All three methods give ' + ptt([o.x0, o.y0]) + '.<br>' + ck(t(subT([[1, 'x'], [2, 'y']], { x: o.x0, y: o.y0 }) + '=' + o.c)) + ' and ' + ck(t(o.y0 + '=' + subT([[1, 'x'], [o.k, '']], { x: o.x0 }))), ['Use your answers from (b) or (c).'], 'three methods solution');
        } },
        { id: 'e1e', sub: 'd fastest', level: 'PRG', make: function (r, o) {
          return mc(r, 'Which method was fastest <b>for this system</b>, and why?', [
            { html: '<b>Substitution</b> — ' + t('y') + ' was already isolated in the second equation, so one substitution finished it.', right: true },
            { html: '<b>Graphing</b> — reading the crossing point is always the fastest method.', why: 'Graphing needed both equations rearranged and both lines drawn — and a crossing off the grid points can only be estimated.' },
            { html: '<b>Elimination</b> — the ' + t('x') + '-coefficients were already opposites.', why: 'Only after rewriting the second equation as ' + t(std(-1, 1, o.k)) + ' — an extra step that substitution doesn’t need.' },
            { html: 'They were all equally fast, because they give the same answer.', why: 'The answer is the same, but the amount of work isn’t: substitution needed no rearranging at all.' }],
            'Substitution was fastest: ' + t('y') + ' was already isolated. Graphing would be best if both equations were in ' + t('y=mx+b') + ' form with integer intercepts; elimination if both were in ' + t('Ax+By=C') + ' form with matching or opposite coefficients.', ['Which method used the equations exactly as they were given?'], 'fastest method');
        } }] },
    /* ---------- 2 ---------- */
    { num: '2', section: 'Extra Practice B — Choosing a Method Before You Solve', stem: 'State which method you would use — graphing, substitution, or elimination — and the feature of the equations that justifies it. <b>Do not solve.</b>',
      parts: ['sub-iso', 'match', 'graph', 'mult-one', 'sub-one', 'mult-both'].map(function (kind, i) {
        return { id: 'e2' + 'abcdef'[i], sub: 'abcdef'[i], level: kind === 'mult-both' || kind === 'mult-one' ? 'PRG' : 'EMG', make: function (r) {
          var s = chooseGen(r, kind);
          return methodMC(r, 'Which method fits this system best?' + sysD(s.tex[0], s.tex[1]), kind, s.info, KIND_SOL[kind], 'choose a method: ' + kind);
        } };
      }) },
    /* ---------- 3 ---------- */
    { num: '3', shared: function (r) { return r.chance(0.06) ? { p: 6, q: 5, s: 2, c1: 4, c2: 9 } : gen(function () { var p = r.pick([4, 6, 8, 3, 7]), q = r.pick([3, 5, 7, 4]), s = r.pick([2, 3]), c1 = nz(r, -9, 12), c2 = r.int(3, 12); if (gcd(p, q) > 1 || p % s === 0 && false) return null; var d = p + q * s, xn = c1 + q * c2; if (xn % d === 0) return null; return { p: p, q: q, s: s, c1: c1, c2: c2 }; }, null); },
      stem: function (o) { return 'Three students look at the system ' + both(std(o.p, -o.q, o.c1), std(o.s, 1, o.c2)) + '.'; },
      parts: [
        { id: 'e3a', sub: 'a', level: 'PRG', make: function (r, o) {
          return mc(r, 'Ines says elimination here forces you to multiply <b>both</b> equations. Is she right?', [
            { html: 'No — multiplying only the second equation by ' + t(o.q) + ' gives ' + t(std(o.q * o.s, o.q, o.q * o.c2)) + ', and adding it to the first eliminates ' + t('y') + '.', right: true },
            { html: 'Yes — no coefficients match, so both equations must be multiplied.', why: 'The ' + t('y') + '-coefficient in the second equation is ' + t(1) + ' — multiply that equation by ' + t(o.q) + ' and the ' + t('y') + '-terms are opposites.' },
            { html: 'No — multiplying only the first equation by ' + t(o.s) + ' makes the ' + t('x') + '-coefficients match.', why: t(o.s) + ' × ' + t(o.p) + ' is ' + t(o.s * o.p) + ', not ' + t(o.s) + '. It’s the second equation that should be multiplied.' },
            { html: 'Yes — the ' + t('y') + '-coefficients ' + t(-o.q) + ' and ' + t(1) + ' can never be made to match.', why: 'Multiply ' + t(1) + ' by ' + t(o.q) + ' and it becomes ' + t(o.q) + ', the opposite of ' + t(-o.q) + '.' }],
            'She is wrong: ' + t(o.q) + ' × (second equation) is ' + t(std(o.q * o.s, o.q, o.q * o.c2)) + '. Added to ' + t(std(o.p, -o.q, o.c1)) + ', the ' + t('y') + '-terms cancel: ' + t(T([[o.p + o.q * o.s, 'x']]) + '=' + (o.c1 + o.q * o.c2)) + '.', ['Look at the coefficient of ' + t('y') + ' in the second equation.'], 'Ines');
        } },
        { id: 'e3b', sub: 'b', level: 'EMG', make: function (r, o) {
          return mc(r, 'Tavish says substitution is fastest. Which variable should he isolate, and from which equation?', [
            { html: t('y') + ', from ' + t(std(o.s, 1, o.c2)) + ': ' + t('y=' + T([[o.c2, ''], [-o.s, 'x']])) + '.', right: true },
            { html: t('x') + ', from ' + t(std(o.s, 1, o.c2)) + '.', why: 'Isolating ' + t('x') + ' means dividing by ' + t(o.s) + ' — fractions. The ' + t('y') + ' there has coefficient ' + t(1) + '.' },
            { html: t('y') + ', from ' + t(std(o.p, -o.q, o.c1)) + '.', why: 'That means dividing by ' + t(-o.q) + ' — fractions. Use the equation where a coefficient is ' + t(1) + '.' },
            { html: t('x') + ', from ' + t(std(o.p, -o.q, o.c1)) + '.', why: 'That means dividing by ' + t(o.p) + '. Look for a coefficient of ' + t(1) + '.' }],
            'In ' + t(std(o.s, 1, o.c2)) + ' the ' + t('y') + '-term has coefficient ' + t(1) + ', so ' + t('y=' + T([[o.c2, ''], [-o.s, 'x']])) + ' with no fractions.', ['Find the coefficient ' + t(1) + '.'], 'Tavish');
        } },
        { id: 'e3c', sub: 'c solve', level: 'ADV', make: function (r, o) {
          var E = [{ a: o.p, b: -o.q, c: o.c1 }, { a: o.s, b: 1, c: o.c2 }], P = solveR(E), d = o.p + o.q * o.s;
          return pointPart('Solve the system exactly (fractions, not decimals).', P, [Lsd(o.p, -o.q, o.c1), Lsd(o.s, 1, o.c2)], {},
            t('y=' + T([[o.c2, ''], [-o.s, 'x']])) + '. Substitute: ' + t(T([[o.p, 'x']]) + '-' + o.q + '(' + T([[o.c2, ''], [-o.s, 'x']]) + ')=' + o.c1) + ' ⟹ ' + t(T([[d, 'x']]) + '=' + (o.c1 + o.q * o.c2)) + ' ⟹ ' + t('x=' + fT(P[0])) + '.<br>' + t('y=' + o.c2 + '-' + o.s + '\\left(' + fT(P[0]) + '\\right)=' + fT(P[1])) + '.',
            ['Isolate ' + t('y') + ' in the second equation, substitute, and keep the fractions exact.'], 'exact solution');
        } },
        { id: 'e3d', sub: 'c why', level: 'EMG', make: function (r, o) {
          var P = solveR([{ a: o.p, b: -o.q, c: o.c1 }, { a: o.s, b: 1, c: o.c2 }]), g = [Math.round(fv(P[0])), Math.round(fv(P[1]))];
          return mc(r, 'Ren graphs the two lines and reads the solution as ' + ptt(g) + '. The exact solution is ' + ptt(P) + '. What went wrong with Ren’s approach?', [
            { html: 'The lines cross at a point that is not on the grid lines, so a graph can only give a nearby-looking estimate.', right: true },
            { html: 'Ren graphed one of the lines wrongly — a correct graph gives the exact answer.', why: 'Even a perfect graph can’t show ' + ptt(P) + ' exactly: it isn’t a grid point.' },
            { html: 'Nothing: ' + ptt(g) + ' and ' + ptt(P) + ' are the same point.', why: 'Check ' + ptt(g) + ' in ' + t(std(o.p, -o.q, o.c1)) + ': ' + t(subT([[o.p, 'x'], [-o.q, 'y']], { x: g[0], y: g[1] }) + '=' + (o.p * g[0] - o.q * g[1])) + ', not ' + t(o.c1) + '.' },
            { html: 'Graphing never works for systems in standard form.', why: 'It works — but only gives an exact answer when the lines cross at a grid point.' }],
            'The intersection ' + ptt(P) + ' has fractional coordinates, so on a grid it only <i>looks</i> like it is near ' + ptt(g) + '. A graph is reliable only when the crossing is a grid point; algebra gives the exact answer.', ['Is the exact solution a grid point?'], 'Ren graph');
        } }] },
    /* ---------- 4 (substitution) ---------- */
    { num: '4', section: 'Extra Practice C — Solving by Every Method', stem: 'Solve each system by <b>substitution</b>. Answers may be negative.',
      shared: function (r) {
        var bk = r.chance(0.06);
        return { a: bk ? { m: 2, b: 7, a: 3, c: -2, d: -12, P: [-2, 3], e1: yT(2, 7), e2: std(3, -2, -12), L1: mbL(2, 7), L2: Lsd(3, -2, -12) } : subIsoY(r, { neg: true, ms: [2, 3, -2, 4], cs: [-2, -3, 2, 3], aLo: 2 }),
          b: bk ? { p: -3, q: 4, a: 2, c: 5, d: 3, P: [-11, 5], e1: 'x=' + T([[4, ''], [-3, 'y']]), e2: std(2, 5, 3), L1: line(1, 3, -4), L2: Lsd(2, 5, 3) } : subIsoX(r, { neg: true, ps: [-3, -2, 3, 2], as: [2, 3], cs: [5, 3, -1, 7] }),
          c: bk ? { E: [{ a: 1, b: -2, c: -9 }, { a: 4, b: 3, c: -14 }], P: [-5, 2] } : isoNeg(r, 'x'), d: bk ? { E: [{ a: 3, b: 1, c: 2 }, { a: 5, b: -4, c: 26 }], P: [2, -4] } : isoNeg(r, 'y') };
      },
      parts: [
        { id: 'e4a1', sub: 'a substitute', level: 'BEG', make: function (r, sh) { var s = sh.a, inner = T([[s.m, 'x'], [s.b, '']]), key = subKey(s.a, 'x', s.c, inner, s.d); return stepP(both(s.e1, s.e2) + '<br>Substitute and type the equation you get (only ' + t('x') + ' left).', key, [{ v: 'x', root: s.P[0] }], { wrong: [{ v: 'x', root: (s.d - s.b) / (s.a + s.c * s.m), code: 'u8l8-dist', hint: 'Multiply the bracket out to every term: ' + t(s.c + '(' + inner + ')=' + T([[s.c * s.m, 'x'], [s.c * s.b, '']])) + '.' }] }, t(key) + '.', ['Put ' + t('(' + inner + ')') + ' in place of ' + t('y') + '.'], 'E4a step'); } },
        { id: 'e4a2', sub: 'a solve', level: 'BEG', make: function (r, sh) { var s = sh.a; return pointPart(both(s.e1, s.e2) + '<br>Solve.', s.P, [s.L1, s.L2], {}, t(subKey(s.a, 'x', s.c, T([[s.m, 'x'], [s.b, '']]), s.d)) + ' ⟹ ' + t(T([[s.a + s.c * s.m, 'x']]) + '=' + (s.d - s.c * s.b)) + ' ⟹ ' + t('x=' + s.P[0]) + ', ' + t('y=' + s.P[1]) + '.<br>' + chkPt([{ a: -s.m, b: 1, c: s.b }, { a: s.a, b: s.c, c: s.d }], s.P), ['Solve the equation from the step, then find ' + t('y') + '.'], 'E4a solve'); } },
        { id: 'e4b1', sub: 'b substitute', level: 'BEG', make: function (r, sh) { var s = sh.b, inner = T([[s.p, 'y'], [s.q, '']]), key = (s.a === 1 ? '' : s.a) + '(' + inner + ')' + (s.c > 0 ? '+' : '') + T([[s.c, 'y']]) + '=' + s.d; return stepP(both(s.e1, s.e2) + '<br>Substitute and type the equation you get (only ' + t('y') + ' left).', key, [{ v: 'y', root: s.P[1] }], { wrong: s.a === 1 ? [] : [{ v: 'y', root: (s.d - s.q) / (s.a * s.p + s.c), code: 'u8l8-dist', hint: 'Multiply the bracket out to every term.' }] }, t(key) + '.', ['Put ' + t('(' + inner + ')') + ' in place of ' + t('x') + '.'], 'E4b step'); } },
        { id: 'e4b2', sub: 'b solve', level: 'BEG', make: function (r, sh) { var s = sh.b; return pointPart(both(s.e1, s.e2) + '<br>Solve.', s.P, [s.L1, s.L2], {}, t(T([[s.a * s.p + s.c, 'y']]) + '=' + (s.d - s.a * s.q)) + ' ⟹ ' + t('y=' + s.P[1]) + ', then ' + t('x=' + subT([[s.p, 'y'], [s.q, '']], { y: s.P[1] }) + '=' + s.P[0]) + '.<br>' + chkPt([{ a: 1, b: -s.p, c: s.q }, { a: s.a, b: s.c, c: s.d }], s.P), ['Solve the step equation, then find ' + t('x') + '.'], 'E4b solve'); } },
        { id: 'e4c1', sub: 'c isolate', level: 'EMG', make: function (r, sh) { var s = isoS(sh.c); return isoPart(s, 'x', sysD(s.e1, s.e2)); } },
        { id: 'e4c2', sub: 'c solve', level: 'EMG', make: function (r, sh) { var s = isoS(sh.c); return isoSolve(s, 'x', sysD(s.e1, s.e2)); } },
        { id: 'e4d1', sub: 'd isolate', level: 'EMG', make: function (r, sh) { var s = isoS(sh.d); return isoPart(s, 'y', sysD(s.e1, s.e2)); } },
        { id: 'e4d2', sub: 'd solve', level: 'PRG', make: function (r, sh) { var s = isoS(sh.d); return isoSolve(s, 'y', sysD(s.e1, s.e2)); } }] },
    /* ---------- 5 (elimination) ---------- */
    { num: '5', stem: 'Solve each system by <b>elimination</b>. Leave a fractional coordinate as an exact fraction.',
      shared: function (r) {
        var bk = r.chance(0.06);
        return { a: bk ? fracSub(r, [2, 5, 1, 2, -3, 17]) : fracSub(r), b: bk ? mkE([4, 3, -1, 5, -2, 16]) : bothGen(r, { neg: true, mixed: true }), c: bk ? mkE([3, -7, 16, 5, 2, 13]) : bothGen(r, { neg: true, mixed: true }), d: bk ? fracAdd(r, [6, 4, 7, 2, -4, 1]) : fracAdd(r) };
      },
      parts: [
        { id: 'e5a1', sub: 'a eliminate', level: 'EMG', make: function (r, sh) { var s = sh.a, E = s.E, key = T([[E[0].b - E[1].b, 'y']]) + '=' + nT(E[0].c - E[1].c); return elimStepP(sysD(s.e1, s.e2) + 'Subtract the equations. Type the equation you get.', s, { only: 'y', key: key }, 'The ' + t('x') + '-coefficients match: subtract. ' + t(key) + '.', ['Subtract every term of the second equation.'], 'E5a step'); } },
        { id: 'e5a2', sub: 'a solve', level: 'PRG', make: function (r, sh) { var s = sh.a; return pointPart(sysD(s.e1, s.e2) + 'Solve. Give an exact answer.', s.P, [s.L1, s.L2], {}, fracText(s, 'y'), ['Find ' + t('y') + ' first, then substitute and solve for ' + t('x') + ' — it is a fraction.'], 'E5a solve'); } },
        { id: 'e5b1', sub: 'b eliminate', level: 'PRG', make: function (r, sh) { return bothStep(sh.b, sysD(sh.b.e1, sh.b.e2)); } },
        { id: 'e5b2', sub: 'b solve', level: 'PRG', make: function (r, sh) { var s = sh.b; return pointPart(sysD(s.e1, s.e2) + 'Solve.', s.P, [s.L1, s.L2], {}, elimText(s, 'y').text, ['Multiply both equations so one pair of coefficients is opposite, then add.'], 'E5b solve'); } },
        { id: 'e5c1', sub: 'c eliminate', level: 'PRG', make: function (r, sh) { return bothStep(sh.c, sysD(sh.c.e1, sh.c.e2)); } },
        { id: 'e5c2', sub: 'c solve', level: 'ADV', make: function (r, sh) { var s = sh.c; return pointPart(sysD(s.e1, s.e2) + 'Solve.', s.P, [s.L1, s.L2], {}, elimText(s, 'y').text, ['Multiply both equations so one pair of coefficients is opposite, then add.'], 'E5c solve'); } },
        { id: 'e5d1', sub: 'd eliminate', level: 'EMG', make: function (r, sh) { var s = sh.d, E = s.E, key = T([[E[0].a + E[1].a, 'x']]) + '=' + nT(E[0].c + E[1].c); return elimStepP(sysD(s.e1, s.e2) + 'Add the equations. Type the equation you get.', s, { only: 'x', key: key }, 'The ' + t('y') + '-coefficients are opposites: add. ' + t(key) + '.', ['Add the matching terms.'], 'E5d step'); } },
        { id: 'e5d2', sub: 'd solve', level: 'PRG', make: function (r, sh) { var s = sh.d; return pointPart(sysD(s.e1, s.e2) + 'Solve. Give an exact answer.', s.P, [s.L1, s.L2], {}, fracText(s, 'x'), ['Find ' + t('x') + ' first; ' + t('y') + ' turns out to be a fraction.'], 'E5d solve'); } }] },
    /* ---------- 6 ---------- */
    { num: '6', stem: 'Solve each system by whichever method is most efficient. One of the four is best done by graphing.',
      shared: function (r) {
        var bk = r.chance(0.06);
        return { a: bk ? { m: -3, b: 11, a: 4, c: 3, d: 23, P: [2, 5], e1: yT(-3, 11), e2: std(4, 3, 23), L1: mbL(-3, 11), L2: Lsd(4, 3, 23) } : subIsoY(r, { ms: [-3, -2, 2, 3, -4], cs: [2, 3, -2], aLo: 2 }),
          b: bk ? mkE([7, 2, 23, 7, -5, 16]) : elimGen(r, 'sub', { xs: [1, 2, 3, 4, 5], ys: [1, 2, 3, 4, -1, -2] }),
          c: bk ? { m1: [1, 2], b1: 1, m2: -1, b2: 4, P: [2, 2] } : gen(function () { var x0 = r.pick([-4, -2, 2, 4]), y0 = r.int(-3, 5), m2 = nz(r, -2, 2), b1 = y0 - x0 / 2, b2 = y0 - m2 * x0; if (Math.abs(b1) > 5 || Math.abs(b2) > 6 || !b1 || !b2) return null; return { m1: [1, 2], b1: b1, m2: m2, b2: b2, P: [x0, y0] }; }, null),
          d: bk ? mkE([5, -3, -7, 2, 7, 30]) : bothGen(r, { mixed: true }), order: r.shuffle(['a', 'b', 'c', 'd']) };
      },
      parts: [
        { id: 'e6g', sub: 'which', level: 'EMG', make: function (r, sh) {
          var c = sh.c, ce = [yT(c.m1, c.b1), yT(c.m2, c.b2)], lab = { a: both(sh.a.e1, sh.a.e2), b: both(sh.b.e1, sh.b.e2), c: both(ce[0], ce[1]), d: both(sh.d.e1, sh.d.e2) };
          var why = { a: 'Here ' + t('y') + ' is isolated in only one equation — substitution is quicker.', b: 'The ' + t('x') + '-coefficients match — elimination (subtract) is quicker.', d: 'No coefficient is ' + t('\\pm1') + ' — this one needs elimination with both equations multiplied.' };
          return mc(r, 'Which system is best done by graphing?', ['a', 'b', 'c', 'd'].map(function (k) { return { html: '(' + k + ') ' + lab[k], right: k === 'c', why: why[k], code: k }; }),
            'System (c): both equations are in ' + t('y=mx+b') + ' form with integer ' + t('y') + '-intercepts, and they cross at a grid point, ' + ptt(c.P) + '.', ['Which system has both equations in ' + t('y=mx+b') + ' form?'], 'which by graphing', true);
        } },
        { id: 'e6a', sub: 'a', level: 'PRG', make: function (r, sh) { var s = sh.a; return pointPart('(a) ' + both(s.e1, s.e2) + '<br>Solve.', s.P, [s.L1, s.L2], {}, '<b>Substitution</b> (' + t('y') + ' is isolated): ' + t(subKey(s.a, 'x', s.c, T([[s.m, 'x'], [s.b, '']]), s.d)) + ' ⟹ ' + t(T([[s.a + s.c * s.m, 'x']]) + '=' + (s.d - s.c * s.b)) + ' ⟹ ' + t('x=' + s.P[0]) + ', ' + t('y=' + s.P[1]) + '.', ['' + t('y') + ' is already isolated: substitute.'], 'E6a'); } },
        { id: 'e6b', sub: 'b', level: 'PRG', make: function (r, sh) { var s = sh.b; return pointPart('(b) ' + both(s.e1, s.e2) + '<br>Solve.', s.P, [s.L1, s.L2], {}, '<b>Elimination</b> (the ' + t('x') + '-coefficients match):<br>' + elimText(s, 'x').text, ['The ' + t('x') + '-coefficients match: subtract.'], 'E6b'); } },
        { id: 'e6c1', sub: 'c graph', level: 'EMG', make: function (r, sh) { var c = sh.c, L1 = mbL(c.m1, c.b1), L2 = mbL(c.m2, c.b2); return sysGraph('(c) Graph ' + both(yT(c.m1, c.b1), yT(c.m2, c.b2)) + '.', [L1, L2], [yT(c.m1, c.b1), yT(c.m2, c.b2)], W6, {}, 'Start each line at its ' + t('y') + '-intercept (' + t(nT(c.b1)) + ' and ' + t(nT(c.b2)) + ') and use the slopes ' + t(fT(c.m1)) + ' and ' + t(nT(c.m2)) + '. They cross at ' + ptt(c.P) + '.', ['Slope ' + t('\\frac{1}{2}') + ': up 1, right 2.'], 'E6c graph'); } },
        { id: 'e6c2', sub: 'c solve', level: 'BEG', make: function (r, sh) { var c = sh.c; return pointPart('(c) State the solution of ' + both(yT(c.m1, c.b1), yT(c.m2, c.b2)) + '.', c.P, [mbL(c.m1, c.b1), mbL(c.m2, c.b2)], {}, 'The lines cross at ' + ptt(c.P) + '. ' + ck(t(nT(c.P[1]) + '=\\frac{1}{2}(' + c.P[0] + ')' + (c.b1 < 0 ? '' : '+') + nT(c.b1))), ['Read the crossing point and check it in both equations.'], 'E6c'); } },
        { id: 'e6d', sub: 'd', level: 'ADV', make: function (r, sh) { var s = sh.d; return pointPart('(d) ' + both(s.e1, s.e2) + '<br>Solve.', s.P, [s.L1, s.L2], {}, '<b>Elimination after multiplying both equations</b>:<br>' + elimText(s, 'y').text, ['No coefficient is ' + t('\\pm1') + ': multiply both equations.'], 'E6d'); } }] },
    /* ---------- 7 ---------- */
    { num: '7', section: 'Extra Practice D — Classifying and Reasoning', stem: 'Without solving, state whether each system has one solution, no solution, or infinitely many. Rewrite standard-form equations as ' + t('y=mx+b') + ' first.',
      parts: ['a', 'b', 'c', 'd', 'e', 'f'].map(function (k) {
        return { id: 'e7' + k, sub: k, level: k === 'd' || k === 'e' ? 'PRG' : 'EMG', make: function (r) {
          var s = r.chance(0.06) ? E7BOOK[k] : e7Gen(r, k);
          return clsMC(r, both(s.E1, s.E2), s.kind, s.tell, { html: '<b>One solution</b> — the two equations are written in different forms, so they are different lines.', why: 'The form doesn’t decide it. Rewrite each as ' + t('y=mx+b') + ' and compare the slopes, then the intercepts.' }, null, 'E7' + k);
        } };
      }) },
    /* ---------- 8 ---------- */
    { num: '8', stem: 'Solve each system algebraically. <b>Not every system has a single point as its answer</b> — use the <b>no solution</b> / <b>infinitely many</b> keys when the variables vanish.',
      shared: function (r) {
        var bk = r.chance(0.06);
        var a = bk ? { m: 2, b: -5, k: 3 } : { m: r.pick([2, 3, -2, 4]), b: nz(r, -7, 7), k: r.pick([2, 3]) };
        var b = bk ? { a: 4, c1: 6, k: 3, c2: 10 } : gen(function () { var a1 = r.int(2, 5), c1 = nz(r, -9, 9), k = r.pick([2, 3]), c2 = nz(r, -15, 15); return c2 === k * c1 ? null : { a: a1, c1: c1, k: k, c2: c2 }; }, null);
        var c = bk ? mkE([2, 3, 12, 4, 5, 22]) : gen(function () { var x0 = r.int(1, 5), y0 = r.int(1, 5), p = r.int(2, 3), q = r.int(2, 4), s2 = r.int(1, 2); var E = [{ a: p, b: q, c: p * x0 + q * y0 }, { a: 2 * p, b: 2 * q - s2, c: 2 * p * x0 + (2 * q - s2) * y0 }]; return mkE([E[0].a, E[0].b, E[0].c, E[1].a, E[1].b, E[1].c]); }, null);
        var d = bk ? { a: 1, b: -2, c: -3, k: 3 } : gen(function () { var b1 = r.pick([-2, -3, 2, 3]), c1 = nz(r, -6, 6); return { a: 1, b: b1, c: c1, k: r.pick([2, 3]) }; }, null);
        return { a: a, b: b, c: c, d: d };
      },
      parts: [
        { id: 'e8a1', sub: 'a', level: 'PRG', make: function (r, sh) { var o = sh.a, E2 = std(o.k * o.m, -o.k, -o.k * o.b); if (o.k * o.m < 0) E2 = std(-o.k * o.m, o.k, o.k * o.b);
          return ptNI(both(yT(o.m, o.b), E2) + '<br>Solve.', 'inf', [mbL(o.m, o.b), mbL(o.m, o.b)], 'Substitute: ' + t(o.k * o.m + 'x-' + o.k + '(' + T([[o.m, 'x'], [o.b, '']]) + ')=' + (-o.k * o.b)) + ' ⟹ ' + t((-o.k * o.b) + '=' + (-o.k * o.b)) + ', which is <b>true</b> for every ' + t('x') + ': <b>infinitely many solutions</b> — one line drawn twice.', ['Substitute and simplify. If the variables vanish, is what’s left true or false?'], 'E8a'); } },
        { id: 'e8a2', sub: 'a meaning', level: 'EMG', make: function (r, sh) { var o = sh.a, v = -o.k * o.b;
          return vanishMC(r, 'inf', v + '=' + v); } },
        { id: 'e8b1', sub: 'b', level: 'PRG', make: function (r, sh) { var o = sh.b; return ptNI(both(std(1, -o.a, o.c1), std(o.k, -o.k * o.a, o.c2)) + '<br>Solve.', 'none', [Lsd(1, -o.a, o.c1), Lsd(o.k, -o.k * o.a, o.c2)], t('x=' + T([[o.a, 'y'], [o.c1, '']])) + '. Substitute: ' + t(o.k + '(' + T([[o.a, 'y'], [o.c1, '']]) + ')-' + (o.k * o.a) + 'y=' + o.c2) + ' ⟹ ' + t((o.k * o.c1) + '=' + o.c2) + ', which is <b>false</b>: <b>no solution</b> — two parallel lines.', ['Isolate ' + t('x') + ' in the first equation and substitute.'], 'E8b'); } },
        { id: 'e8b2', sub: 'b meaning', level: 'EMG', make: function (r, sh) { var o = sh.b; return vanishMC(r, 'none', (o.k * o.c1) + '=' + o.c2); } },
        { id: 'e8c', sub: 'c', level: 'PRG', make: function (r, sh) { var s = sh.c; return pointPart(both(s.e1, s.e2) + '<br>Solve.', s.P, [s.L1, s.L2], {}, elimText(s, 'x').text, ['Multiply the first equation by ' + t(2) + ' and subtract.'], 'E8c'); } },
        { id: 'e8d', sub: 'd', level: 'PRG', make: function (r, sh) { var o = sh.d, A = [o.a * o.k, o.b * o.k, o.c * o.k], B = [-o.a, -o.b, -o.c];
          return ptNI(both(std(A[0], A[1], A[2]), std(B[0], B[1], B[2])) + '<br>Solve.', 'inf', [Lsd(A[0], A[1], A[2]), Lsd(B[0], B[1], B[2])], 'Multiply the second equation by ' + t(o.k) + ' and add: ' + t('0=0') + ', which is <b>true</b>: <b>infinitely many solutions</b>. Both equations are the line ' + t(si(Lsd(1, o.b, o.c))) + '.', ['Multiply the second equation so the ' + t('x') + '-terms are opposites, then add.'], 'E8d'); } }] },
    /* ---------- 9 ---------- */
    { num: '9', stem: '<b>Finding the missing constant.</b>',
      shared: function (r) {
        var bk = r.chance(0.06);
        return { a: bk ? { b1: -4, m: 6, b2: 1 } : gen(function () { var b1 = nz(r, -8, 8), b2 = nz(r, -8, 8), m = nz(r, -7, 7); return b1 === b2 ? null : { b1: b1, m: m, b2: b2 }; }, null),
          b: bk ? { p: 2, c: 10, q: 3, s: 5 } : gen(function () { var q = r.int(2, 6), s = nz(r, -9, 9), p = r.pick([2, 3, 4]); return { p: p, c: p * s, q: q, s: s }; }, null),
          c: bk ? { d: 4, c1: 12, a: 3, e: 2, c2: 5 } : gen(function () { var a = r.int(2, 6), e = r.int(2, 5), d = r.pick([2, 4, 6, 3]), c1 = nz(r, -12, 12), c2 = nz(r, -9, 9); if ((a * d) % e || c1 === -d / e * c2) return null; return { d: d, c1: c1, a: a, e: e, c2: c2 }; }, null),
          d: bk ? { a: 3, b: 5, k: 2, c: 24 } : gen(function () { var a = r.int(2, 6), b = r.int(2, 7), k = r.pick([2, 3, 4]), c = k * nz(r, -10, 12); return gcd(a, b) > 1 ? null : { a: a, b: b, k: k, c: c }; }, null) };
      },
      parts: [
        { id: 'e9a1', sub: 'a k', level: 'PRG', make: function (r, sh) { var o = sh.a;
          return numP('For what value of ' + t('k') + ' does ' + both('y=kx' + (o.b1 < 0 ? '' : '+') + o.b1, yT(o.m, o.b2)) + ' have <b>no solution</b>?', o.m, function (v) { if (v === -o.m) return { code: 'u8l8-k-sign', hint: 'Parallel lines have <b>equal</b> slopes: ' + t('k') + ' must equal ' + t(nT(o.m)) + ', sign and all.' }; return null; },
            'No solution needs equal slopes and different intercepts. The intercepts are ' + t(o.b1) + ' and ' + t(o.b2) + ' (different), so ' + t('k=' + o.m) + '.<br>Check: ' + t(o.m + 'x' + (o.b1 < 0 ? '' : '+') + o.b1 + '=' + o.m + 'x' + (o.b2 < 0 ? '' : '+') + o.b2) + ' ⟹ ' + t(o.b1 + '=' + o.b2) + ', false ✓', ['What must be true of the slopes of parallel lines?'], 'E9a k'); } },
        { id: 'e9a2', sub: 'a why', level: 'ADV', make: function (r, sh) { var o = sh.a;
          return mc(r, 'Why does <b>no</b> value of ' + t('k') + ' give infinitely many solutions for ' + both('y=kx' + (o.b1 < 0 ? '' : '+') + o.b1, yT(o.m, o.b2)) + '?', [
            { html: 'Infinitely many needs the same line, so equal intercepts — but the intercepts are ' + t(o.b1) + ' and ' + t(o.b2) + ', and ' + t('k') + ' only changes the slope.', right: true },
            { html: 'Because ' + t('k=' + o.m) + ' already gives no solution, so it can’t give anything else.', why: 'That’s true for ' + t('k=' + o.m) + ' — but the question is about every value of ' + t('k') + '. What controls whether the lines are the same?' },
            { html: 'Because the slopes can never be equal.', why: 'They are equal when ' + t('k=' + o.m) + '. The problem is the intercepts.' },
            { html: 'It does: ' + t('k=' + o.m) + ' makes the lines identical.', why: 'With ' + t('k=' + o.m) + ' the slopes match but the intercepts ' + t(o.b1) + ' and ' + t(o.b2) + ' still differ — parallel, not identical.' }],
            t('k') + ' is the slope of the first line; its intercept is fixed at ' + t(o.b1) + ', and the second line’s is ' + t(o.b2) + '. Different intercepts can never be the same line, whatever ' + t('k') + ' is.', ['Which part of ' + t('y=kx' + (o.b1 < 0 ? '' : '+') + o.b1) + ' does ' + t('k') + ' control?'], 'E9a why'); } },
        { id: 'e9b', sub: 'b', level: 'PRG', make: function (r, sh) { var o = sh.b, k = o.p * o.q;
          return numP('For what value of ' + t('k') + ' does ' + both(o.p + 'x+ky=' + o.c, std(1, o.q, o.s)) + ' have <b>infinitely many</b> solutions?', k, function (v) { if (v === o.q) return { code: 'u8l8-k-inv', hint: 'The first equation must be <b>' + o.p + ' times</b> the second: ' + t(o.p + '(x+' + o.q + 'y)=' + o.p + 'x+' + k + 'y') + '.' }; return null; },
            'The first equation must be a multiple of the second. ' + t(o.p + 'x') + ' is ' + t(o.p) + ' × ' + t('x') + ', and ' + t(o.c) + ' is ' + t(o.p) + ' × ' + t(nT(o.s)) + ', so ' + t('k=' + o.p + '\\times ' + o.q + '=' + k) + '.<br>Check: subtracting ' + t(o.p) + ' × (second equation) leaves ' + t('0=0') + ' ✓', ['Compare the ' + t('x') + '-terms and the constants: what is the first equation multiplied by?'], 'E9b'); } },
        { id: 'e9c1', sub: 'c excluded', level: 'ADV', make: function (r, sh) { var o = sh.c, k = -o.a * o.d / o.e;
          return numP('The system ' + both('kx-' + o.d + 'y=' + o.c1, std(o.a, o.e, o.c2)) + ' has exactly one solution for every value of ' + t('k') + ' except one. Find the excluded value.', k, function (v) { if (v === -k) return { code: 'u8l8-k-sign', hint: 'Check the sign: the slopes must be equal. ' + t(std(o.a, o.e, o.c2)) + ' has slope ' + t(fT(fr(-o.a, o.e))) + '.' }; return null; },
            'One solution fails only when the slopes are equal. ' + t(std(o.a, o.e, o.c2)) + ' has slope ' + t(fT(fr(-o.a, o.e))) + '; ' + t('kx-' + o.d + 'y=' + o.c1) + ' has slope ' + t('\\frac{k}{' + o.d + '}') + '. So ' + t('\\frac{k}{' + o.d + '}=' + fT(fr(-o.a, o.e))) + ' ⟹ ' + t('k=' + nT(k)) + '.', ['Write both slopes and set them equal.'], 'E9c k'); } },
        { id: 'e9c2', sub: 'c what happens', level: 'ADV', make: function (r, sh) { var o = sh.c, k = -o.a * o.d / o.e, m = o.d / o.e;
          return mc(r, 'What happens to ' + both('kx-' + o.d + 'y=' + o.c1, std(o.a, o.e, o.c2)) + ' when ' + t('k=' + nT(k)) + '?', [
            { html: '<b>No solution</b>: eliminating leaves a false statement — the lines are parallel.', right: true },
            { html: '<b>Infinitely many solutions</b>: the two equations become the same line.', why: 'Multiply the second equation by ' + t(nT(-m)) + ': the left sides match but the constants ' + t(o.c1) + ' and ' + t(nT(-m * o.c2)) + ' don’t — a false statement.' },
            { html: '<b>One solution</b> at ' + ptt([0, 0]) + '.', why: 'Equal slopes means the lines never cross at a single point.' },
            { html: 'The system can’t be solved because ' + t('k') + ' is negative.', why: 'Negative coefficients are fine. The issue is that the slopes are equal.' }],
            'With ' + t('k=' + nT(k)) + ' the slopes are equal; the constants don’t match (' + t(o.c1) + ' vs ' + t(nT(-m * o.c2)) + ' after scaling), so eliminating gives a false statement: <b>no solution</b>, parallel lines.', ['Equal slopes: is it the same line, or parallel lines?'], 'E9c what'); } },
        { id: 'e9d1', sub: 'd k', level: 'PRG', make: function (r, sh) { var o = sh.d, K2 = o.c / o.k;
          return numP('For what value of ' + t('k') + ' does ' + both(o.a + 'x+' + o.b + 'y=k', std(o.k * o.a, o.k * o.b, o.c)) + ' have infinitely many solutions?', K2, function (v) { if (v === o.c * o.k) return { code: 'u8l8-k-inv', hint: 'The second equation is ' + t(o.k) + ' times the first, so ' + t('k') + ' is the constant <b>divided</b> by ' + t(o.k) + '.' }; return null; },
            'The second equation is ' + t(o.k) + ' times the first on the left side, so its right side must be ' + t(o.k + 'k') + ': ' + t(o.k + 'k=' + o.c) + ' ⟹ ' + t('k=' + K2) + '.', ['What is the second equation’s left side multiplied by?'], 'E9d k'); } },
        { id: 'e9d2', sub: 'd other k', level: 'PRG', make: function (r, sh) { var o = sh.d, K2 = o.c / o.k;
          return mc(r, 'For ' + both(o.a + 'x+' + o.b + 'y=k', std(o.k * o.a, o.k * o.b, o.c)) + ', what is the outcome for every value of ' + t('k') + ' other than ' + t(K2) + '?', [
            { html: '<b>No solution</b> — the slopes are always equal (' + t(fT(fr(-o.a, o.b))) + ') but the intercepts differ.', right: true },
            { html: '<b>One solution</b> — changing ' + t('k') + ' moves the line so it crosses the other.', why: 'Changing ' + t('k') + ' slides the line up or down but never changes its slope, so it stays parallel.' },
            { html: '<b>Infinitely many</b> — the left sides are multiples of each other.', why: 'The right sides must match the same multiple too; that only happens at ' + t('k=' + K2) + '.' },
            { html: 'It depends on whether ' + t('k') + ' is positive or negative.', why: 'The slope never depends on ' + t('k') + '. Every other ' + t('k') + ' gives parallel lines.' }],
            'Both lines have slope ' + t(fT(fr(-o.a, o.b))) + ' whatever ' + t('k') + ' is. Only ' + t('k=' + K2) + ' makes them the same line; every other ' + t('k') + ' gives parallel lines: <b>no solution</b>.', ['Does ' + t('k') + ' change the slope?'], 'E9d other'); } }] },
    /* ---------- 10 ---------- */
    { num: '10', section: 'Extra Practice E — Graphs and Systems', shared: function (r) { return r.chance(0.08) ? { a: 2, c1: 4, c2: 5, P: [3, -2] } : gen(function () { var a = r.int(1, 3), x0 = r.int(-3, 4), y0 = r.int(-4, 4), c1 = a * x0 + y0, c2 = x0 - y0; var L1 = Lsd(a, 1, c1), L2 = Lsd(1, -1, c2); if (!lvisible(L1, W6) || !lvisible(L2, W6) || !inW([x0, y0], W6)) return null; return { a: a, c1: c1, c2: c2, P: [x0, y0] }; }, null); },
      stem: function (o) { return 'The system ' + t(std(o.a, 1, o.c1)) + ' (solid) and ' + t(std(1, -1, o.c2)) + ' (dashed) is graphed below. The lines cross at integer coordinates.' + sysFig([Lsd(o.a, 1, o.c1), Lsd(1, -1, o.c2)], W6); },
      parts: [
        { id: 'e10a', sub: 'a', level: 'BEG', make: function (r, o) { return pointPart('Read the solution from the graph.', o.P, [Lsd(o.a, 1, o.c1), Lsd(1, -1, o.c2)], {}, 'The lines cross at ' + ptt(o.P) + '.', ['Find where the solid and dashed lines meet.'], 'E10 read'); } },
        { id: 'e10b', sub: 'b', level: 'BEG', make: function (r, o) { var key = T([[o.a + 1, 'x']]) + '=' + (o.c1 + o.c2);
          return stepP('Confirm it by <b>elimination</b>: the ' + t('y') + '-coefficients are opposites. Add the equations and type the equation you get.', key, [{ v: 'x', root: o.P[0] }], { wrong: [{ v: 'x', root: (o.c1 - o.c2) / (o.a + 1), code: 'u8l8-elim-rhs', hint: 'Add the right sides too: ' + t(o.c1 + '+' + (o.c2 < 0 ? '(' + o.c2 + ')' : o.c2)) + '.' }] },
            'Add: ' + t(key) + ' ⟹ ' + t('x=' + o.P[0]) + '; then ' + t(o.P[0] + '-y=' + o.c2) + ' ⟹ ' + t('y=' + o.P[1]) + '. ' + ck('') + ' It matches the graph.', ['Add the ' + t('x') + '-terms, the ' + t('y') + '-terms (they cancel) and the right sides.'], 'E10 add'); } },
        { id: 'e10c', sub: 'c', level: 'EMG', make: function (r, o) {
          return mc(r, 'Why is part (b) the proof, and part (a) only evidence?', [
            { html: 'A graph shows where the lines <i>appear</i> to meet and depends on how accurately they are drawn; the algebra is exact.', right: true },
            { html: 'Because elimination is always faster than graphing.', why: 'Speed isn’t the point — exactness is. A graph can’t tell ' + t('3') + ' from ' + t('3.1') + '.' },
            { html: 'Because the graph could show the wrong lines.', why: 'Even the right lines, drawn carefully, only give an estimate of the crossing point.' },
            { html: 'Part (a) is the proof: you can see the point.', why: 'Seeing isn’t proving: a crossing at ' + t('(3.1,\\ -1.9)') + ' would look the same. Substituting into both equations proves it.' }],
            'Reading a graph depends on the drawing; elimination (and checking the point in both equations) is exact arithmetic, so it proves the solution.', ['Could a graph tell the difference between a point and one very close to it?'], 'E10 proof');
        } }] },
    /* ---------- 11 ---------- */
    { num: '11', shared: function (r) { return r.chance(0.08) ? { p: 2, q: 3, b1: -1, b2: -4 } : gen(function () { var q = r.pick([2, 3]), p = nz(r, -3, 3), b1 = nz(r, -4, 4), b2 = nz(r, -5, 5); if (gcd(p, q) !== 1 || b1 === b2) return null; var L1 = mbL([p, q], b1), L2 = mbL([p, q], b2); if (!lvisible(L1, W6) || !lvisible(L2, W6)) return null; return { p: p, q: q, b1: b1, b2: b2 }; }, null); },
      stem: function (o) { return 'The system ' + t(yT([o.p, o.q], o.b1)) + ' (solid) and ' + t(e11s(o, o.b2)) + ' (dashed) is graphed below.' + sysFig([mbL([o.p, o.q], o.b1), mbL([o.p, o.q], o.b2)], W6); },
      parts: [
        { id: 'e11a', sub: 'a', level: 'EMG', make: function (r, o) {
          return clsMC(r, 'Classify the system from the picture, supported by the slopes and intercepts.', 'none', t(e11s(o, o.b2)) + ' is ' + t(yT([o.p, o.q], o.b2)) + '. Both slopes are ' + t(fT([o.p, o.q])) + '; the intercepts are ' + t(o.b1) + ' and ' + t(o.b2) + '.',
            { html: '<b>One solution</b> — the lines will cross somewhere off the grid.', why: 'Lines with equal slopes stay the same distance apart forever — they never cross.' }, null, 'E11 classify');
        } },
        { id: 'e11b1', sub: 'b standard form', level: 'PRG', make: function (r, o) {
          var T0 = [o.p, -o.q, o.q * o.b1], key = e11s(o, o.b1);
          var p = K.P.math('Multiply ' + t(yT([o.p, o.q], o.b1)) + ' by ' + t(o.q) + ' and write it in standard form, ' + t('Ax+By=C') + ' (so it lines up with ' + t(e11s(o, o.b2)) + ').', stdChk(T0, { p: o.p, q: -o.q }), key,
            t(o.q + 'y=' + T([[o.p, 'x'], [o.q * o.b1, '']])) + ' ⟹ ' + t(key) + '.', ['Multiply every term by ' + t(o.q) + ', then move the ' + t('x') + '-term to the left.'], 'E11 standard form', { keys: 'eq', vars: ['x', 'y'], placeholder: ' ' });
          p.bad = [yT([o.p, o.q], o.b1), e11s(o, -o.b1)];
          return p;
        } },
        { id: 'e11b2', sub: 'b conclusion', level: 'PRG', make: function (r, o) {
          return ptNI('Now eliminate: subtract ' + t(e11s(o, o.b1)) + ' from ' + t(e11s(o, o.b2)) + '. What is the solution of the system?', 'none', [mbL([o.p, o.q], o.b1), mbL([o.p, o.q], o.b2)],
            'Subtracting gives ' + t('0=' + (o.p < 0 ? 1 : -1) * (o.q * o.b2 - o.q * o.b1)) + ', a <b>false</b> statement: no point satisfies both equations — <b>no solution</b>, which matches the parallel lines.', ['Both variables vanish. Is the statement left true or false?'], 'E11 conclusion');
        } }] },
    /* ---------- 12 ---------- */
    { num: '12', shared: function (r) { return r.chance(0.08) ? { m: -1, b: 3, x0: 2 } : gen(function () { var m = r.pick([-1, 1, -2, 2]), b = nz(r, -4, 4), x0 = nz(r, -3, 3), y0 = m * x0 + b; if (Math.abs(y0) > 5 || x0 === 0) return null; return { m: m, b: b, x0: x0 }; }, null); },
      stem: function (o) { return 'The line ' + t(yT(o.m, o.b)) + ' is drawn on the grid. Write the equation of a <b>second</b> line so that the system made from the two lines has each outcome.' + sysFig([mbL(o.m, o.b)], W6); },
      parts: [
        { id: 'e12a', sub: 'a', level: 'PRG', make: function (r, o) {
          var key = yT(o.m, o.b + (o.b > 0 ? -5 : 5));
          var p = K.P.math('<b>No solution.</b> Type an equation for the second line.', lineCondChk(o, 'none'), key, 'Any line with the same slope ' + t(nT(o.m)) + ' and a different intercept, e.g. ' + t(key) + ': same ' + t('m') + ', different ' + t('b') + ' ⟹ parallel.', ['No solution means parallel: same slope, different intercept.'], 'E12 none', { keys: 'eq', vars: ['x', 'y'], placeholder: ' ' });
          p.good = [yT(o.m, o.b + 1)]; p.bad = [yT(o.m, o.b), yT(-o.m, o.b + 1)]; return p;
        } },
        { id: 'e12b', sub: 'b', level: 'ADV', make: function (r, o) {
          var k = 2, key = std(-o.m * k, k, o.b * k);
          if (-o.m * k < 0) key = std(o.m * k, -k, -o.b * k);
          var p = K.P.math('<b>Infinitely many solutions</b>, written in <b>standard form</b> ' + t('Ax+By=C') + ' (so it doesn’t just repeat ' + t(yT(o.m, o.b)) + ').', lineCondChk(o, 'inf'), key, 'The same line in standard form, e.g. ' + t(key) + ' (divide by ' + t(k) + ' and rearrange to get back ' + t(yT(o.m, o.b)) + ').', ['Move the ' + t('x') + '-term to the left, then multiply every term by the same number.'], 'E12 inf', { keys: 'eq', vars: ['x', 'y'], placeholder: ' ' });
          p.good = [std(-o.m * 3, 3, o.b * 3)]; p.bad = [yT(o.m, o.b), std(-o.m, 1, o.b + 1)]; return p;
        } },
        { id: 'e12c', sub: 'c', level: 'ADV', make: function (r, o) {
          var y0 = o.m * o.x0 + o.b, m2 = o.m === 1 ? 2 : 1, key = yT(m2, y0 - m2 * o.x0);
          var p = K.P.math('<b>Exactly one solution, at the point ' + ptt([o.x0, y0]) + '.</b> Type an equation for the second line.', lineCondChk(o, 'one'), key, ptt([o.x0, y0]) + ' is on the given line: ' + ck(t(y0 + '=' + subT([[o.m, 'x'], [o.b, '']], { x: o.x0 }))) + '. Any line through it with a slope other than ' + t(nT(o.m)) + ' works, e.g. ' + t(key) + ' (' + ck(t(y0 + '=' + subT([[m2, 'x'], [y0 - m2 * o.x0, '']], { x: o.x0 }))) + ').', ['Pick a different slope, then choose ' + t('b') + ' so that the line passes through ' + ptt([o.x0, y0]) + '.'], 'E12 one', { keys: 'eq', vars: ['x', 'y'], placeholder: ' ' });
          p.good = ['x=' + o.x0, 'y=' + y0]; p.bad = [yT(o.m, o.b), yT(m2, y0 - m2 * o.x0 + 1)]; return p;
        } }] },
    /* ---------- 13 ---------- */
    { num: '13', section: 'Extra Practice F — Error Analysis', shared: function (r) { return r.chance(0.08) ? { a: 1, b: -3, c: 2, k: 2 } : gen(function () { var b = r.pick([-3, -2, 2, 3, -4]), c = nz(r, -5, 5), k = r.pick([2, 3]); return { a: 1, b: b, c: c, k: k }; }, null); },
      stem: function (o) { return 'Marcus solves ' + t(std(o.k, o.k * o.b, o.k * o.c)) + ' and ' + t(std(-1, -o.b, -o.c)) + ' by multiplying the second equation by ' + t(o.k) + ' and adding. He reaches ' + t('0=0') + ' and writes “no solution, because there is no ' + t('x') + ' and no ' + t('y') + '.”'; },
      parts: [
        { id: 'e13a', sub: 'a', level: 'PRG', make: function (r, o) {
          var m2 = std(-o.k, -o.k * o.b, -o.k * o.c);
          return mc(r, 'Reproduce his elimination. What does the algebra give?', [
            { html: t(o.k) + ' × (second) is ' + t(m2) + '; adding gives ' + t('0x+0y=0') + ', i.e. ' + t('0=0') + '.', right: true },
            { html: 'Adding gives ' + t('0=' + 2 * o.k * o.c) + '.', why: 'Add the right sides with their signs: ' + t(o.k * o.c + '+(' + (-o.k * o.c) + ')=0') + '.' },
            { html: 'Adding gives ' + t(T([[2 * o.k, 'x']]) + '=0') + ', so ' + t('x=0') + '.', why: 'The ' + t('x') + '-terms are ' + t(o.k + 'x') + ' and ' + t('-' + o.k + 'x') + ': they cancel.' },
            { html: 'Adding gives ' + t(T([[2 * o.k * o.b, 'y']]) + '=0') + '.', why: 'The ' + t('y') + '-terms are opposites too, so they cancel.' }],
            t(m2) + ' added to ' + t(std(o.k, o.k * o.b, o.k * o.c)) + ': every term cancels, leaving ' + t('0=0') + '. Marcus’s algebra is right — his conclusion is not.', ['Multiply every term of the second equation by ' + t(o.k) + ', then add column by column.'], 'E13 algebra');
        } },
        { id: 'e13b', sub: 'b', level: 'EMG', make: function (r, o) {
          var yl = si(Lsd(1, o.b, o.c));
          return mc(r, 'What does ' + t('0=0') + ' really mean here?', [
            { html: '<b>Infinitely many solutions</b>: ' + t('0=0') + ' is always true, and both equations are ' + t(yl) + ' — one line drawn twice.', right: true },
            { html: '<b>No solution</b>: there is no ' + t('x') + ' and no ' + t('y') + ' left.', code: 'marcus', why: 'Losing both variables isn’t the answer — what’s <b>left</b> is. ' + t('0=0') + ' is true for every point.' },
            { html: '<b>No solution</b>: the lines are parallel.', why: 'Parallel lines give a <b>false</b> statement such as ' + t('0=8') + '. ' + t('0=0') + ' is true.' },
            { html: '<b>One solution</b>: ' + ptt([0, 0]) + '.', why: 'Both variables vanished — there is nothing left to solve for. The statement itself is the answer.' }],
            t('0=0') + ' is true no matter what ' + t('x') + ' and ' + t('y') + ' are, so every point on the line works: <b>infinitely many solutions</b>. Both equations become ' + t(yl) + '. (“No solution” is the false-statement case, like ' + t('0=8') + '.)', ['Is ' + t('0=0') + ' true or false?'], 'E13 meaning');
        } }] },
    /* ---------- 14 ---------- */
    { num: '14', shared: function (r) { return r.chance(0.08) ? { a: 4, b: 3, d: 5, P: [2, 1] } : gen(function () { var a = r.int(2, 6), b = r.int(2, 5), d = r.int(2, 6), x0 = r.int(1, 5), y0 = r.int(1, 4); if (b === d) return null; var yK = (a * x0 + b * y0 - (a * x0 - d * y0)) / (b - d); if (!isInt(yK) || yK === y0) return null; return { a: a, b: b, d: d, P: [x0, y0] }; }, null); },
      stem: function (o) { var c1 = o.a * o.P[0] + o.b * o.P[1], c2 = o.a * o.P[0] - o.d * o.P[1], yK = (c1 - c2) / (o.b - o.d), xK = fr(c1 - o.b * yK, o.a);
        return 'Kofi solved ' + both(std(o.a, o.b, c1), std(o.a, -o.d, c2)) + ' by elimination. <b>Exactly one</b> of his steps is wrong.<br><b>Step 1:</b> Both equations start with ' + t(o.a + 'x') + ', so subtract the second from the first.<br><b>Step 2:</b> ' + t(o.b + 'y-' + o.d + 'y=' + c1 + '-' + (c2 < 0 ? '(' + c2 + ')' : c2)) + ', so ' + t(T([[o.b - o.d, 'y']]) + '=' + (c1 - c2)) + '.<br><b>Step 3:</b> ' + t('y=' + yK) + '.<br><b>Step 4:</b> ' + t(o.a + 'x+' + o.b + '(' + yK + ')=' + c1) + ', so ' + t('x=' + fT(xK)) + '.<br><b>Step 5:</b> The solution is ' + ptt([xK, yK]) + '.'; },
      parts: [
        { id: 'e14a', sub: 'a', level: 'EMG', make: function (r, o) { var c1 = o.a * o.P[0] + o.b * o.P[1], c2 = o.a * o.P[0] - o.d * o.P[1], yK = (c1 - c2) / (o.b - o.d), xK = fr(c1 - o.b * yK, o.a), v = c1 - o.b * yK - o.d * yK;
          return numP('Substitute Kofi’s answer into the <b>second</b> original equation. What is the value of ' + t(T([[o.a, 'x'], [-o.d, 'y']])) + '?', v, function (w) { if (w === c2) return { code: 'u8l8-kofi', hint: 'That’s the right side of the equation — work out the left side with Kofi’s numbers.' }; return null; },
            t(o.a + '\\left(' + fT(xK) + '\\right)-' + o.d + '(' + yK + ')=' + (c1 - o.b * yK) + (yK < 0 ? '+' : '-') + Math.abs(o.d * yK) + '=' + v) + ', not ' + t(c2) + ', so Kofi’s answer fails.', ['' + t(o.a) + ' times Kofi’s ' + t('x') + ' is ' + t(c1 - o.b * yK) + '.'], 'E14 check'); } },
        { id: 'e14b', sub: 'b', level: 'PRG', make: function (r, o) {
          return mc(r, 'Which step contains the error, and what is the mistake?', [
            { html: '<b>Step 2</b>: subtracting the second equation changes the sign of every term — ' + t(o.b + 'y-(-' + o.d + 'y)=' + (o.b + o.d) + 'y') + ', not ' + t(T([[o.b - o.d, 'y']])) + '.', right: true },
            { html: '<b>Step 1</b>: the equations should be added, not subtracted.', why: 'Subtracting is right — the ' + t('x') + '-coefficients are equal. The slip comes when the subtraction is carried out.' },
            { html: '<b>Step 4</b>: the substitution is done wrongly.', why: 'Step 4 is carried out correctly — it uses the wrong ' + t('y') + ' from earlier.' },
            { html: '<b>Step 3</b>: the division is wrong.', why: 'Dividing is fine; the equation it divides is already wrong.' }],
            'Step 2: ' + t(o.b + 'y-(-' + o.d + 'y)=' + (o.b + o.d) + 'y') + '. Kofi subtracted only the size of ' + t(o.d + 'y') + ' and ignored its minus sign.', ['Subtract ' + t('-' + o.d + 'y') + ' carefully.'], 'E14 step');
        } },
        { id: 'e14c', sub: 'c', level: 'PRG', make: function (r, o) { var c1 = o.a * o.P[0] + o.b * o.P[1], c2 = o.a * o.P[0] - o.d * o.P[1];
          return pointPart('Redo the work correctly. What is the true solution?', o.P, [Lsd(o.a, o.b, c1), Lsd(o.a, -o.d, c2)], {}, 'Subtract: ' + t((o.b + o.d) + 'y=' + (c1 - c2)) + ' ⟹ ' + t('y=' + o.P[1]) + '; ' + t(o.a + 'x+' + o.b + '(' + o.P[1] + ')=' + c1) + ' ⟹ ' + t('x=' + o.P[0]) + '.<br>' + chkPt([{ a: o.a, b: o.b, c: c1 }, { a: o.a, b: -o.d, c: c2 }], o.P), ['' + t(o.b + 'y-(-' + o.d + 'y)=' + (o.b + o.d) + 'y') + '.'], 'E14 redo'); } }] },
    /* ---------- 15 ---------- */
    { num: '15', shared: function (r) { return r.chance(0.08) ? { m: 3, q: 4, a: 2, c: 5, P: [2, 2] } : gen(function () { var m = r.int(2, 4), q = r.int(1, 6), a = r.int(1, 4), c = r.int(2, 5), x0 = r.int(1, 4), y0 = m * x0 - q; return { m: m, q: q, a: a, c: c, P: [x0, y0] }; }, null); },
      stem: function (o) { var d = o.a * o.P[0] + o.c * o.P[1], k = o.a + o.c * o.m, wx = fr(d + o.q, k);
        return 'Priya solved ' + both(yT(o.m, -o.q), std(o.a, o.c, d)) + ' by substitution. Exactly one step is wrong.<br><b>Step 1:</b> ' + t(T([[o.a, 'x']]) + '+' + o.c + '(' + yT(o.m, -o.q).slice(2) + ')=' + d) + '.<br><b>Step 2:</b> ' + t(T([[o.a, 'x'], [o.c * o.m, 'x']]) + '-' + o.q + '=' + d) + '.<br><b>Step 3:</b> ' + t(T([[k, 'x']]) + '=' + (d + o.q)) + ', so ' + t('x=' + fT(wx)) + '.<br><b>Step 4:</b> ' + t('y=' + o.m + '\\left(' + fT(wx) + '\\right)-' + o.q + '=' + fT(fr(o.m * wx[0] - o.q * wx[1], wx[1]))) + '.'; },
      parts: [
        { id: 'e15a', sub: 'a', level: 'PRG', make: function (r, o) {
          return mc(r, 'Which step has the error, and which rule did she break?', [
            { html: '<b>Step 2</b>: she multiplied ' + t(o.c) + ' by ' + t(o.m + 'x') + ' but not by ' + t('-' + o.q) + '. Distribute to every term: ' + t(o.c + '(' + o.m + 'x-' + o.q + ')=' + (o.c * o.m) + 'x-' + (o.c * o.q)) + '.', right: true },
            { html: '<b>Step 1</b>: she should have substituted into the first equation.', why: 'Substituting ' + t('y') + ' into the <b>other</b> equation is exactly right.' },
            { html: '<b>Step 3</b>: she added ' + t(o.q) + ' to both sides when she should have subtracted.', why: 'Moving ' + t('-' + o.q) + ' across does add ' + t(o.q) + '. The mistake is earlier.' },
            { html: '<b>Step 4</b>: she substituted into the wrong equation.', why: 'Either equation works for back-substitution; ' + t('x') + ' was already wrong.' }],
            'Step 2 breaks the distributive property: ' + t(o.c + '(' + o.m + 'x-' + o.q + ')=' + (o.c * o.m) + 'x-' + (o.c * o.q)) + ', not ' + t((o.c * o.m) + 'x-' + o.q) + '.', ['Check how the bracket was multiplied out.'], 'E15 step');
        } },
        { id: 'e15b', sub: 'b', level: 'PRG', make: function (r, o) { var d = o.a * o.P[0] + o.c * o.P[1], k = o.a + o.c * o.m;
          return pointPart('Solve correctly.', o.P, [mbL(o.m, -o.q), Lsd(o.a, o.c, d)], { wrong: [] }, t(T([[o.a, 'x'], [o.c * o.m, 'x']]) + '-' + (o.c * o.q) + '=' + d) + ' ⟹ ' + t(T([[k, 'x']]) + '=' + (d + o.c * o.q)) + ' ⟹ ' + t('x=' + o.P[0]) + '; ' + t('y=' + o.m + '(' + o.P[0] + ')-' + o.q + '=' + o.P[1]) + '.<br>' + chkPt([{ a: -o.m, b: 1, c: -o.q }, { a: o.a, b: o.c, c: d }], o.P), ['Distribute to both terms in the bracket.'], 'E15 redo'); } }] },
    /* ---------- 16 ---------- */
    { num: '16', section: 'Extra Practice G — Applications', shared: function (r) { return r.chance(0.08) ? { fA: 60, rA: 4, fB: 20, rB: 6, v: 30 } : gen(function () { var rA = r.int(3, 8), rB = rA + r.int(1, 4), n = 5 * r.int(2, 8), fB = 5 * r.int(2, 8), fA = fB + (rB - rA) * n; if (fA > 200) return null; var v = n + 5 * r.int(1, 4) * r.pick([1, -1]); if (v < 5) return null; return { fA: fA, rA: rA, fB: fB, rB: rB, v: v }; }, null); },
      stem: function (o) { return 'Two shops will print team shirts. Shop A charges ' + art(o.fA) + ' ' + Dh(o.fA) + ' setup fee plus ' + Dh(o.rA) + ' per shirt; Shop B charges ' + art(o.fB) + ' ' + Dh(o.fB) + ' setup fee plus ' + Dh(o.rB) + ' per shirt. Let ' + t('n') + ' be the number of shirts and ' + t('C') + ' the total cost in dollars.'; },
      parts: [
        { id: 'e16a', sub: 'a', level: 'EMG', make: function (r, o) { return twoEq('Write one equation for each shop.', [line(o.rA, -1, o.fA), line(o.rB, -1, o.fB)], ['Shop A:', 'Shop B:'], { vars: ['n', 'C'], wrong: [[{ is: 'C=' + o.fA + 'n+' + o.rA, code: 'rate-fixed', hint: 'The setup fee is paid once; ' + Dh(o.rA) + ' is paid per shirt.' }], [{ is: 'C=' + o.fB + 'n+' + o.rB, code: 'rate-fixed', hint: 'The setup fee is paid once; ' + Dh(o.rB) + ' is paid per shirt.' }]] }, 'Shop A: ' + t('C=' + o.rA + 'n+' + o.fA) + '<br>Shop B: ' + t('C=' + o.rB + 'n+' + o.fB), ['Cost = price per shirt × shirts + setup fee.'], 'shops equations'); } },
        { id: 'e16b', sub: 'b', level: 'PRG', make: function (r, o) { var n = (o.fA - o.fB) / (o.rB - o.rA), C = o.rA * n + o.fA;
          return numsP('Both equations are solved for ' + t('C') + ', so set them equal (substitution). Find the break-even number of shirts and the cost there.', [{ label: 'Shirts', after: 'shirts' }, { label: 'Cost', before: '$' }], [n, C], { names: ['number of shirts', 'cost'], sys: [[o.rA, -1, o.fA], [o.rB, -1, o.fB]], sysNames: ['Shop A’s equation', 'Shop B’s equation'], swapHint: 'The first box is the number of shirts.' },
            t(o.rA + 'n+' + o.fA + '=' + o.rB + 'n+' + o.fB) + ' ⟹ ' + t((o.fA - o.fB) + '=' + (o.rB - o.rA) + 'n') + ' ⟹ ' + t('n=' + n) + '; ' + t('C=' + o.rA + '(' + n + ')+' + o.fA + '=' + C) + '.<br><b>At ' + n + ' shirts both shops charge ' + Dh(C) + '.</b>', ['Set the two right sides equal.'], 'break-even'); } },
        { id: 'e16c', sub: 'c', level: 'EMG', make: function (r, o) { var n = (o.fA - o.fB) / (o.rB - o.rA), C = o.rA * n + o.fA;
          return mc(r, 'Interpret the solution.', [
            { html: 'At ' + n + ' shirts both shops charge ' + Dh(C) + '; for fewer shirts Shop B is cheaper, for more shirts Shop A is cheaper.', right: true },
            { html: 'At ' + n + ' shirts both shops charge ' + Dh(C) + '; for fewer shirts Shop A is cheaper.', why: 'With few shirts the setup fee matters most — Shop B’s is smaller.' },
            { html: 'Shop A is always cheaper because its price per shirt is lower.', why: 'Its setup fee is ' + Dh(o.fA - o.fB) + ' higher, so it only wins once enough shirts are ordered.' },
            { html: 'Both shops charge ' + Dh(n) + ' for ' + C + ' shirts.', why: 'In ' + ptt([n, C]) + ', ' + t('n') + ' (shirts) comes first and ' + t('C') + ' (dollars) second.' }],
            'The solution ' + ptt([n, C]) + ' is the break-even point. Below ' + n + ' shirts the smaller setup fee (Shop B) wins; above it the smaller price per shirt (Shop A) wins.', ['Which shop has the smaller setup fee? Which has the smaller price per shirt?'], 'interpret break-even'); } },
        { id: 'e16d', sub: 'd', level: 'PRG', make: function (r, o) { var A = o.rA * o.v + o.fA, B = o.rB * o.v + o.fB, cheap = A < B ? 'A' : 'B', diff = Math.abs(A - B);
          return mc(r, 'A team needs ' + t(o.v) + ' shirts. Which shop is cheaper, and by how much?', [
            { html: 'Shop ' + cheap + ', by ' + Dh(diff) + ' (A: ' + Dh(A) + ', B: ' + Dh(B) + ').', right: true },
            { html: 'Shop ' + (cheap === 'A' ? 'B' : 'A') + ', by ' + Dh(diff) + ' (A: ' + Dh(A) + ', B: ' + Dh(B) + ').', why: 'Compare the totals again: ' + Dh(Math.min(A, B)) + ' is less.' },
            { html: 'Shop ' + cheap + ', by ' + Dh(Math.abs(o.rA - o.rB) * o.v) + '.', why: 'That compares only the per-shirt costs — include the setup fees: ' + Dh(A) + ' and ' + Dh(B) + '.' },
            { html: 'They cost the same.', why: 'They cost the same only at the break-even number of shirts.' }],
            'Shop A: ' + t(o.rA + '(' + o.v + ')+' + o.fA + '=' + A) + '. Shop B: ' + t(o.rB + '(' + o.v + ')+' + o.fB + '=' + B) + '. <b>Shop ' + cheap + ' is cheaper by ' + Dh(diff) + '.</b>', ['Substitute ' + t('n=' + o.v) + ' into both equations.'], 'which shop'); } }] },
    /* ---------- 17 ---------- */
    { num: '17', shared: function (r) { return r.chance(0.08) ? { p1: 20, p2: 50, pm: 40, M: 30, x: 10, y: 20 } : gen(function () { var p1 = r.pick([10, 20, 30]), p2 = r.pick([40, 50, 60, 70]), M = 10 * r.int(2, 6), x = 5 * r.int(1, M / 5 - 1), y = M - x, pm = (p1 * x + p2 * y) / M; if (!isInt(pm) || pm % 5) return null; return { p1: p1, p2: p2, pm: pm, M: M, x: x, y: y }; }, null); },
      stem: function (o) { return 'A lab technician mixes a ' + t(o.p1 + '\\%') + ' acid solution with a ' + t(o.p2 + '\\%') + ' acid solution to make ' + t(o.M + '\\text{ L}') + ' of a ' + t(o.pm + '\\%') + ' acid solution. Let ' + t('x') + ' be the litres of ' + t(o.p1 + '\\%') + ' solution and ' + t('y') + ' the litres of ' + t(o.p2 + '\\%') + ' solution.'; },
      parts: [
        { id: 'e17a', sub: 'a', level: 'PRG', make: function (r, o) { var A = o.pm * o.M / 100;
          return sysP('Write one equation for the total volume and one for the total acid.', [[1, 1, -o.M], [o.p1, o.p2, -o.pm * o.M]],
            { vars: ['x', 'y'], keyTex: ['x+y=' + o.M, String(o.p1 / 100) + 'x+' + String(o.p2 / 100) + 'y=' + N(A)], names: ['the volume', 'the acid'], factHints: ['the two volumes add to ' + t(o.M) + ' L.', 'pure acid: ' + t(String(o.p1 / 100) + 'x+' + String(o.p2 / 100) + 'y') + ' equals ' + t(o.pm + '\\%') + ' of ' + t(o.M) + ' L.'],
              wrong: [{ eq: String(o.p1 / 100) + 'x+' + String(o.p2 / 100) + 'y=' + String(o.pm / 100), code: 'u8l8-pct-total', hint: 'The right side is the litres of pure acid in the mixture: ' + t(String(o.pm / 100) + '(' + o.M + ')=' + N(A)) + '.' }, { eq: o.p1 + 'x+' + o.p2 + 'y=' + N(A), code: 'pct-decimal', hint: 'Change each percent to a decimal: ' + t(o.p1 + '\\%=' + o.p1 / 100) + '.' }],
              good: [['x+y=' + o.M, T([[o.p1 / 10, 'x'], [o.p2 / 10, 'y']]) + '=' + N(A * 10)]] },
            t('x+y=' + o.M) + '<br>' + t(String(o.p1 / 100) + 'x+' + String(o.p2 / 100) + 'y=' + String(o.pm / 100) + '(' + o.M + ')=' + N(A)) + ' — times ' + t(10) + ': ' + t(T([[o.p1 / 10, 'x'], [o.p2 / 10, 'y']]) + '=' + N(10 * A)) + '.', ['One equation adds litres of solution; the other adds litres of pure acid.'], 'acid system'); } },
        { id: 'e17b', sub: 'b', level: 'ADV', make: function (r, o) { var A = o.pm * o.M / 100;
          return numsP('Solve: how many litres of each solution?', [{ label: o.p1 + '% solution', after: 'L' }, { label: o.p2 + '% solution', after: 'L' }], [o.x, o.y], { names: ['litres of ' + o.p1 + '% solution', 'litres of ' + o.p2 + '% solution'], sys: [[1, 1, -o.M], [o.p1, o.p2, -o.pm * o.M]], sysNames: ['the volume equation', 'the acid equation'] },
            'The volume equation has coefficients of ' + t(1) + ', so substitute ' + t('x=' + o.M + '-y') + ' into ' + t(T([[o.p1 / 10, 'x'], [o.p2 / 10, 'y']]) + '=' + N(10 * A)) + ': ' + t((o.p1 === 10 ? '' : o.p1 / 10) + '(' + o.M + '-y)+' + T([[o.p2 / 10, 'y']]) + '=' + N(10 * A)) + ' ⟹ ' + t(((o.p2 - o.p1) / 10) + 'y=' + N(10 * A - o.p1 / 10 * o.M)) + ' ⟹ ' + t('y=' + o.y) + ', ' + t('x=' + o.x) + '.<br>' + chk('Acid: ' + t(String(o.p1 / 100) + '(' + o.x + ')+' + String(o.p2 / 100) + '(' + o.y + ')=' + N(o.p1 * o.x / 100) + '+' + N(o.p2 * o.y / 100) + '=' + N(A)) + ' L') + '<br><b>' + o.x + ' L of the ' + o.p1 + '% solution and ' + o.y + ' L of the ' + o.p2 + '% solution.</b>',
            ['Multiply the acid equation by ' + t(10) + ', then substitute ' + t('x=' + o.M + '-y') + '.'], 'acid solve'); } }] },
    /* ---------- 18 ---------- */
    { num: '18', shared: function (r) { return r.chance(0.08) ? { X: 'q', Y: 'n', n1: 'quarters', n2: 'loonies', what: 'coins', each: 'each', dec: true, p1: 0.25, p2: 1, x: 23, y: 29, N: 52, T: 34.75 } : cv(r, { X: 'q', Y: 'n', n1: 'quarters', n2: 'loonies', what: 'coins', each: 'each', dec: true }, function () { return { p1: 0.25, p2: 1, x: r.int(10, 50), y: r.int(10, 50) }; }); },
      stem: function (s) { return 'A canteen cash box holds ' + t(s.N) + ' coins, all of them quarters (' + t('\\$0.25') + ') and loonies (' + t('\\$1.00') + '), worth ' + t('\\$' + m2(s.T)) + ' in total.'; },
      parts: [
        { id: 'e18a1', sub: 'a define', level: 'BEG', make: function (r, s) {
          return mc(r, 'Which pair of let statements defines the two unknowns?', [
            { html: 'Let ' + t('q') + ' = the number of quarters and ' + t('n') + ' = the number of loonies.', right: true },
            { html: 'Let ' + t('q') + ' = ' + t('0.25') + ' and ' + t('n') + ' = ' + t('1.00') + '.', why: 'The coin values are known. The unknowns are <b>how many</b> of each coin.' },
            { html: 'Let ' + t('q') + ' = the number of coins and ' + t('n') + ' = their value.', why: 'Both of those are given (' + s.N + ' coins, ' + t('\\$' + m2(s.T)) + ').' },
            { html: 'Let ' + t('q') + ' = quarters and ' + t('n') + ' = loonies.', why: 'Too vague: the <b>number</b> of quarters, or their value? Say what each letter counts.' }],
            'The unknowns are the counts: ' + t('q') + ' = number of quarters, ' + t('n') + ' = number of loonies.', ['What don’t you know yet?'], 'define coins');
        } },
        { id: 'e18a2', sub: 'a system', level: 'EMG', make: function (r, s) { return cvSys('Write a count equation and a value equation (' + t('q') + ' quarters, ' + t('n') + ' loonies).', s); } },
        { id: 'e18b', sub: 'b', level: 'PRG', make: function (r, s) { var p = cvSolve('Solve. How many coins of each kind are in the box?', s, 'The box holds ' + s.x + ' quarters and ' + s.y + ' loonies.');
          p.solution = t('q+n=' + s.N) + ' and ' + t('0.25q+n=' + m2(s.T)) + '. Multiply the value equation by ' + t(4) + ': ' + t('q+4n=' + N(4 * s.T)) + '. Subtract the count equation: ' + t('3n=' + N(4 * s.T - s.N)) + ' ⟹ ' + t('n=' + s.y) + ', ' + t('q=' + s.x) + '.<br>' + chk('Check: ' + t(s.x + '+' + s.y + '=' + s.N)) + ' coins, ' + chk(t('\\$' + m2(0.25 * s.x) + '+\\$' + m2(s.y) + '=\\$' + m2(s.T))) + '<br><b>The box holds ' + s.x + ' quarters and ' + s.y + ' loonies.</b>';
          return p; } }] },
    /* ---------- 19 ---------- */
    { num: '19', shared: function (r) { return r.chance(0.08) ? { X: 'm', Y: 's', n1: 'muffins', n2: 'scones', what: 'items', each: 'each', dec: true, p1: 2.75, p2: 3.5, x: 77, y: 63, N: 140, T: 432.25 } : cv(r, { X: 'm', Y: 's', n1: 'muffins', n2: 'scones', what: 'items', each: 'each', dec: true }, function () { var p1 = r.pick([2.25, 2.5, 2.75]), p2 = p1 + r.pick([0.5, 0.75, 1]); return { p1: p1, p2: p2, x: r.int(30, 90), y: r.int(30, 90) }; }); },
      stem: function (s) { return 'A bakery sold ' + t(s.N) + ' items in a morning: muffins at ' + t('\\$' + m2(s.p1)) + ' each and scones at ' + t('\\$' + m2(s.p2)) + ' each, for total sales of ' + t('\\$' + m2(s.T)) + '.'; },
      parts: [
        { id: 'e19a', sub: 'a', level: 'EMG', make: function (r, s) { return cvSys('Let ' + t('m') + ' be the number of muffins and ' + t('s') + ' the number of scones. Set up a system.', s); } },
        { id: 'e19b', sub: 'b', level: 'ADV', make: function (r, s) { var p = cvSolve('Solve the system. How many of each were sold?', s, s.x + ' muffins and ' + s.y + ' scones were sold.'); p.hints = ['Multiply the money equation by ' + t(4) + ' (or ' + t(100) + ') to clear the decimals, then substitute ' + t('m=' + s.N + '-s') + '.']; return p; } }] },
    /* ---------- 20 ---------- */
    { num: '20', section: 'Extra Practice H — Challenge', shared: function (r) { return r.chance(0.08) ? { a: 2, B: 3, C1: 12, A2: 5, b: 7, C2: 1, P: [3, 2] } : gen(function () { var x0 = r.int(1, 5), y0 = r.int(1, 5), a = r.int(2, 6), B = r.int(2, 5), A2 = r.int(2, 7), b = r.int(2, 9); var dv = function (u, v) { return u % v === 0 || v % u === 0; }; if (dv(a, A2) || dv(B, b) || x0 === y0) return null; return { a: a, B: B, C1: a * x0 + B * y0, A2: A2, b: b, C2: A2 * x0 - b * y0, P: [x0, y0] }; }, null); },
      stem: function (o) { return '<b>Work backwards.</b> The system ' + both('ax+' + o.B + 'y=' + o.C1, o.A2 + 'x-by=' + o.C2) + ' is known to have the solution ' + ptt(o.P) + '.'; },
      parts: [
        { id: 'e20a', sub: 'a', level: 'ADV', make: function (r, o) {
          return numsP('Use the fact that ' + ptt(o.P) + ' satisfies each equation to find ' + t('a') + ' and ' + t('b') + '.', [{ label: t('a') }, { label: t('b') }], [o.a, o.b], { names: ['value of a', 'value of b'], wrong: [{ v: [o.a, -o.b], code: 'u8l8-ab', hint: 'Check the sign of ' + t('b') + ': ' + t(o.A2 + '(' + o.P[0] + ')-b(' + o.P[1] + ')=' + o.C2) + '.' }] },
            t('a(' + o.P[0] + ')+' + o.B + '(' + o.P[1] + ')=' + o.C1) + ' ⟹ ' + t(o.P[0] + 'a=' + (o.C1 - o.B * o.P[1])) + ' ⟹ ' + t('a=' + o.a) + '.<br>' + t(o.A2 + '(' + o.P[0] + ')-b(' + o.P[1] + ')=' + o.C2) + ' ⟹ ' + t((o.A2 * o.P[0]) + '-' + o.P[1] + 'b=' + o.C2) + ' ⟹ ' + t('b=' + o.b) + '.', ['Substitute ' + t('x=' + o.P[0]) + ' and ' + t('y=' + o.P[1]) + ' into each equation; each has only one unknown.'], 'work backwards a, b');
        } },
        { id: 'e20b', sub: 'b', level: 'ADV', make: function (r, o) { var S = mkE([o.a, o.B, o.C1, o.A2, -o.b, o.C2]);
          return pointPart('Write out the completed system and solve it from scratch by elimination. (It must come back to ' + ptt(o.P) + '.)', S.P, [S.L1, S.L2], {}, both(S.e1, S.e2) + '<br>' + elimText(S, 'y').text, ['Multiply both equations so the ' + t('y') + '-terms are opposites, then add.'], 'solve completed system'); } }] },
    /* ---------- 21 ---------- */
    { num: '21', shared: function (r) { return r.chance(0.08) ? { m: 2, u: 3, v: 1 } : gen(function () { var m = r.pick([2, 3]), u = nz(r, -4, 5), v = nz(r, -4, 5); return u === v || m * u + v === 0 ? null : { m: m, u: u, v: v }; }, null); },
      stem: function (o) { return '<b>Literal coefficients.</b> Solve the system ' + both(T([[o.m, 'x'], [1, 'y']]) + '=' + T([[o.m * o.u + o.v, 'a']]), 'x-y=' + T([[o.u - o.v, 'a']])) + ' for ' + t('x') + ' and ' + t('y') + ' in terms of the constant ' + t('a') + '.'; },
      parts: [
        { id: 'e21a', sub: 'a', level: 'MAS', make: function (r, o) {
          var kx = T([[o.u, 'a']]), ky = T([[o.v, 'a']]);
          return { prompt: 'Add the equations to eliminate ' + t('y') + ', then back-substitute. Give ' + t('x') + ' and ' + t('y') + ' in terms of ' + t('a') + '.', input: { type: 'fields', fields: [{ label: t('x='), mode: 'math', keys: 'eq', vars: ['a'], placeholder: ' ' }, { label: t('y='), mode: 'math', keys: 'eq', vars: ['a'], placeholder: ' ' }] },
            check: litChk([o.u, o.v]), key: [kx, ky], answer: t('x=' + kx) + '<br>' + t('y=' + ky),
            solution: 'Add: ' + t(T([[o.m + 1, 'x']]) + '=' + T([[(o.m + 1) * o.u, 'a']])) + ' ⟹ ' + t('x=' + kx) + '.<br>Then ' + t(kx + '-y=' + T([[o.u - o.v, 'a']])) + ' ⟹ ' + t('y=' + ky) + '.<br>' + ck(t(o.m + '(' + kx + ')+' + (o.v < 0 ? '(' + ky + ')' : ky) + '=' + T([[o.m * o.u + o.v, 'a']]))) + ' ' + ck(t(kx + '-' + (o.v < 0 ? '(' + ky + ')' : ky) + '=' + T([[o.u - o.v, 'a']]))),
            hints: ['Treat ' + t('a') + ' like a number: add the equations, then divide by ' + t(o.m + 1) + '.'], text: 'literal coefficients', bad: [[ky, kx], [T([[o.u + 1, 'a']]), ky]] };
        } },
        { id: 'e21b', sub: 'b', level: 'PRG', make: function (r, o) { var A = 4, P = [o.u * A, o.v * A];
          return pointPart('Put ' + t('a=' + A) + ' into the system, giving ' + both(T([[o.m, 'x'], [1, 'y']]) + '=' + (o.m * o.u + o.v) * A, 'x-y=' + (o.u - o.v) * A) + ', and solve it.', P, [Lsd(o.m, 1, (o.m * o.u + o.v) * A), Lsd(1, -1, (o.u - o.v) * A)], {}, 'Add: ' + t((o.m + 1) + 'x=' + (o.m + 1) * o.u * A) + ' ⟹ ' + t('x=' + P[0]) + ', ' + t('y=' + P[1]) + ' — the same as ' + t('x=' + T([[o.u, 'a']])) + ', ' + t('y=' + T([[o.v, 'a']])) + ' with ' + t('a=4') + ' ✓', ['Add the equations.'], 'literal check'); } }] },
    /* ---------- 22 ---------- */
    { num: '22', shared: function (r) { return r.chance(0.08) ? { s: 5, p: 2, P: [2, 3], d: 2 } : gen(function () { var x0 = r.int(1, 5), y0 = r.int(1, 5), p = r.int(2, 4), d = r.int(1, 3); if (x0 === y0) return null; return { s: x0 + y0, p: p, P: [x0, y0], d: d }; }, null); },
      stem: function (o) { var c = o.d + 1, k3 = c * o.P[0] + o.d * o.P[1]; return '<b>Three lines.</b> ' + t('\\ell_1:\\ ' + std(1, 1, o.s)) + ', ' + t('\\ell_2:\\ ' + std(o.p, -1, o.p * o.P[0] - o.P[1])) + ', ' + t('\\ell_3:\\ ' + std(c, o.d, k3)) + '.'; },
      parts: [
        { id: 'e22a1', sub: 'a', level: 'EMG', make: function (r, o) { var c2 = o.p * o.P[0] - o.P[1];
          return pointPart('Solve ' + t('\\ell_1') + ' with ' + t('\\ell_2') + '.', o.P, [Lsd(1, 1, o.s), Lsd(o.p, -1, c2)], {}, 'Add: ' + t((o.p + 1) + 'x=' + (o.s + c2)) + ' ⟹ ' + t('x=' + o.P[0]) + ', ' + t('y=' + o.P[1]) + '.', ['The ' + t('y') + '-terms are opposites: add.'], 'three lines 1'); } },
        { id: 'e22a2', sub: 'a test', level: 'PRG', make: function (r, o) { var c = o.d + 1, k3 = c * o.P[0] + o.d * o.P[1];
          return mc(r, 'Test that point in ' + t('\\ell_3') + '. Do all three lines pass through one common point?', [
            { html: 'Yes: ' + t(subT([[c, 'x'], [o.d, 'y']], { x: o.P[0], y: o.P[1] }) + '=' + k3) + ' ✓, so ' + ptt(o.P) + ' is on all three lines.', right: true },
            { html: 'No: three lines can never share a point.', why: 'They can — substitute ' + ptt(o.P) + ' into ' + t('\\ell_3') + ' and see.' },
            { html: 'No: ' + t('\\ell_3') + ' has a different slope from both of the others.', why: 'Different slopes means each pair crosses once — but they may all cross at the <b>same</b> point. Test it.' },
            { html: 'Yes, because ' + t('\\ell_1') + ' and ' + t('\\ell_2') + ' meet.', why: 'Two lines meeting says nothing about the third. Substitute the point into ' + t('\\ell_3') + '.' }],
            ck(t(subT([[c, 'x'], [o.d, 'y']], { x: o.P[0], y: o.P[1] }) + '=' + k3)) + ': all three lines pass through ' + ptt(o.P) + '.', ['Substitute the point into ' + t('\\ell_3') + '.'], 'three lines test'); } },
        { id: 'e22b1', sub: 'b', level: 'PRG', make: function (r, o) { var c = o.d + 1, k3b = c * o.P[0] + o.d * o.P[1] + 1, x1 = k3b - o.d * o.s, y1 = o.s - x1;
          return pointPart('Replace ' + t('\\ell_3') + ' with ' + t("\\ell_3':\\ " + std(c, o.d, k3b)) + '. Find where ' + t('\\ell_1') + ' meets ' + t("\\ell_3'") + '.', [x1, y1], [Lsd(1, 1, o.s), Lsd(c, o.d, k3b)], {}, 'Multiply ' + t('\\ell_1') + ' by ' + t(o.d) + ': ' + t(std(o.d, o.d, o.d * o.s)) + '. Subtract from ' + t("\\ell_3'") + ': ' + t('x=' + x1) + ', then ' + t('y=' + y1) + '.', ['Multiply ' + t('\\ell_1') + ' so the ' + t('y') + '-terms match, then subtract.'], 'three lines 2'); } },
        { id: 'e22b2', sub: 'b picture', level: 'MAS', make: function (r, o) { var c = o.d + 1, k3b = c * o.P[0] + o.d * o.P[1] + 1, x1 = k3b - o.d * o.s, y1 = o.s - x1;
          return mc(r, 'With ' + t("\\ell_3'") + ' instead of ' + t('\\ell_3') + ', each pair of lines still meets. What picture do the three lines make?', [
            { html: 'A small <b>triangle</b>: the three crossing points ' + ptt(o.P) + ', ' + ptt([x1, y1]) + ' and the ' + t('\\ell_2') + '–' + t("\\ell_3'") + ' point are all different, so no point is on all three lines.', right: true },
            { html: 'Three lines through one point, like before.', why: ptt(o.P) + ' is no longer on ' + t("\\ell_3'") + ': ' + t(subT([[c, 'x'], [o.d, 'y']], { x: o.P[0], y: o.P[1] }) + '=' + (k3b - 1) + '\\ne ' + k3b) + '.' },
            { html: 'Three parallel lines.', why: 'The slopes are ' + t(-1) + ', ' + t(o.p) + ' and ' + t(fT(fr(-c, o.d))) + ' — all different, so no two are parallel.' },
            { html: 'Two of the lines are the same line.', why: 'No equation is a multiple of another.' }],
            ptt(o.P) + ' is not on ' + t("\\ell_3'") + ', and ' + t('\\ell_1') + ' meets ' + t("\\ell_3'") + ' at ' + ptt([x1, y1]) + '. Three different crossing points and no common point: the lines form a <b>triangle</b>.', ['Is any point on all three lines? How many different crossing points are there?'], 'three lines picture'); } }] },
    /* ---------- 23 ---------- */
    { num: '23', shared: function (r) { return r.chance(0.08) ? { P: [-3, 4] } : { P: [nz(r, -5, 5), nz(r, -5, 5)] }; },
      stem: function (o) { return '<b>Build one.</b> Write a system of two equations in standard form, ' + t('Ax+By=C') + ', whose solution is ' + ptt(o.P) + ' and which <b>cannot</b> be solved by multiplying only one equation — eliminating either variable must require multiplying <b>both</b>.'; },
      parts: [
        { id: 'e23', sub: '', level: 'MAS', make: function (r, o) {
          var x0 = o.P[0], y0 = o.P[1], k = [std(2, 3, 2 * x0 + 3 * y0), std(5, -4, 5 * x0 - 4 * y0)];
          return { prompt: 'Type your two equations.', input: { type: 'fields', fields: [{ label: 'Equation 1', mode: 'math', keys: 'eq', vars: ['x', 'y'], placeholder: ' ' }, { label: 'Equation 2', mode: 'math', keys: 'eq', vars: ['x', 'y'], placeholder: ' ' }] },
            check: buildChk(o.P), key: k, answer: 'For example ' + t(k[0]) + ' and ' + t(k[1]) + '.', good: [[std(3, 2, 3 * x0 + 2 * y0), std(4, -5, 4 * x0 - 5 * y0)]],
            bad: [[std(2, 3, 2 * x0 + 3 * y0), std(4, 5, 4 * x0 + 5 * y0)], [std(1, 3, x0 + 3 * y0), std(5, -4, 5 * x0 - 4 * y0)], [std(2, 3, 2 * x0 + 3 * y0 + 1), std(5, -4, 5 * x0 - 4 * y0)], [std(2, 3, 2 * x0 + 3 * y0), std(4, 6, 4 * x0 + 6 * y0)]],
            solution: 'Pick coefficients with no ' + t('\\pm1') + ' and no column where one coefficient divides the other, e.g. ' + t('x') + ': ' + t(2) + ' and ' + t(5) + ', ' + t('y') + ': ' + t(3) + ' and ' + t(-4) + '. Then make ' + ptt(o.P) + ' fit: ' + t(subT([[2, 'x'], [3, 'y']], { x: x0, y: y0 }) + '=' + (2 * x0 + 3 * y0)) + ' and ' + t(subT([[5, 'x'], [-4, 'y']], { x: x0, y: y0 }) + '=' + (5 * x0 - 4 * y0)) + '.<br>System: ' + t(k[0]) + ', ' + t(k[1]) + '. To eliminate ' + t('x') + ' you need ' + t('\\times5') + ' and ' + t('\\times2') + '; for ' + t('y') + ', ' + t('\\times4') + ' and ' + t('\\times3') + '.<br>' + elimText(mkE([2, 3, 2 * x0 + 3 * y0, 5, -4, 5 * x0 - 4 * y0]), 'y').text,
            hints: ['Choose the coefficients first (no ' + t('\\pm1') + ', no multiples in the same column), then work out each right side by substituting ' + ptt(o.P) + '.'], text: 'build a system' };
        } }] },
    /* ---------- 24 ---------- */
    { num: '24', shared: function (r) { return { a: r.chance(0.08) ? { d1: 2, d2: 3, d3: 4, P: [4, 6] } : gen(function () { var d1 = r.pick([2, 3]), d2 = r.pick([3, 4, 5]), d3 = r.pick([2, 4]); if (d1 === d2) return null; var x0 = lcm(d1, d3) * r.int(1, 2) * r.pick([1, -1]), y0 = d2 * r.int(1, 2) * r.pick([1, -1]); return { d1: d1, d2: d2, d3: d3, P: [x0, y0] }; }, null),
        b: r.chance(0.08) ? { E: [{ a: 4, b: 3, c: 27 }, { a: 2, b: -5, c: -19 }], P: [3, 5] } : gen(function () { var x0 = r.int(1, 6), y0 = r.int(1, 6), a1 = r.int(2, 6), b1 = r.int(1, 5), a2 = r.int(1, 5), b2 = -r.int(2, 6); if (a1 * b2 === a2 * b1 || x0 === y0) return null; return { E: [{ a: a1, b: b1, c: a1 * x0 + b1 * y0 }, { a: a2, b: b2, c: a2 * x0 + b2 * y0 }], P: [x0, y0] }; }, null) }; },
      stem: '<b>Clear first, then solve.</b> Clear the fractions or decimals from each equation first, then solve.',
      parts: [
        { id: 'e24a', sub: 'a', level: 'ADV', make: function (r, sh) {
          var o = sh.a, x0 = o.P[0], y0 = o.P[1], r1 = x0 / o.d1 + y0 / o.d2, r2 = x0 / o.d3 - y0;
          var e1 = '\\frac{x}{' + o.d1 + '}+\\frac{y}{' + o.d2 + '}=' + nT(r1), e2 = '\\frac{x}{' + o.d3 + '}-y=' + nT(r2), M1 = lcm(o.d1, o.d2), E = [{ a: M1 / o.d1, b: M1 / o.d2, c: M1 * r1 }, { a: 1, b: -o.d3, c: o.d3 * r2 }];
          return pointPart(sysD(e1, e2) + 'Solve.', o.P, [Lsd(E[0].a, E[0].b, E[0].c), Lsd(1, -o.d3, o.d3 * r2)], {}, 'Multiply the first equation by ' + t(M1) + ': ' + t(std(E[0].a, E[0].b, E[0].c)) + '. Multiply the second by ' + t(o.d3) + ': ' + t(std(1, -o.d3, o.d3 * r2)) + '.<br>' + elimText(mkE([E[0].a, E[0].b, E[0].c, 1, -o.d3, o.d3 * r2]), 'x').text, ['Multiply each equation by the lowest common denominator of its fractions.'], 'clear fractions');
        } },
        { id: 'e24b', sub: 'b', level: 'ADV', make: function (r, sh) {
          var o = sh.b, E = o.E, d = function (v) { return N(v / 10); }, e1 = d(E[0].a) + 'x+' + d(E[0].b) + 'y=' + d(E[0].c), e2 = d(E[1].a) + 'x-' + d(-E[1].b) + 'y=' + d(E[1].c);
          var S = mkE([E[0].a, E[0].b, E[0].c, E[1].a, E[1].b, E[1].c]);
          return pointPart(sysD(e1, e2) + 'Solve.', o.P, [S.L1, S.L2], {}, 'Multiply both equations by ' + t(10) + ': ' + t(S.e1) + ' and ' + t(S.e2) + '.<br>' + elimText(S, Math.abs(E[0].a) % Math.abs(E[1].a) === 0 || Math.abs(E[1].a) % Math.abs(E[0].a) === 0 ? 'x' : 'y').text, ['Multiply every term by ' + t(10) + ' first.'], 'clear decimals');
        } }] }
  ];

  /* ---------- extra-practice helpers ---------- */
  function mkE(a) { var E = [{ a: a[0], b: a[1], c: a[2] }, { a: a[3], b: a[4], c: a[5] }], P = solveR(E); P = P.map(function (f) { return f[1] === 1 ? f[0] : f; });
    return { E: E, P: P, e1: std(a[0], a[1], a[2]), e2: std(a[3], a[4], a[5]), L1: Lsd(a[0], a[1], a[2]), L2: Lsd(a[3], a[4], a[5]) }; }
  function isoS(o) { return mkE([o.E[0].a, o.E[0].b, o.E[0].c, o.E[1].a, o.E[1].b, o.E[1].c]); }
  function isoNeg(r, which) {   // 'x': x + a y = c1 with b x + d y = c2 ; 'y': b x + y = c1 with p x + q y = c2 (no other ±1)
    return gen(function () {
      var x0 = nz(r, -6, 4), y0 = nz(r, -5, 5), a = nz(r, -4, 4), b = r.int(2, 6), d = nz(r, -6, 6), p = r.int(2, 6);
      if (Math.abs(a) < 2 || Math.abs(d) < 2 || (x0 > 0 && y0 > 0)) return null;
      var E = which === 'x' ? [{ a: 1, b: a, c: x0 + a * y0 }, { a: b, b: d, c: b * x0 + d * y0 }] : [{ a: b, b: 1, c: b * x0 + y0 }, { a: p, b: d, c: p * x0 + d * y0 }];
      if (E[0].a * E[1].b === E[1].a * E[0].b) return null;
      return { E: E, P: [x0, y0] };
    }, null);
  }
  function fracSub(r, bk) {   // same x-coefficient, x a fraction
    if (bk) return mkE(bk);
    return gen(function () { var a = r.pick([2, 3, 4]), n = nz(r, -15, 15), b1 = nz(r, -6, 6), b2 = nz(r, -6, 6), y0 = nz(r, -4, 4); if (n % a === 0 || b1 === b2 || b1 === -b2 || Math.abs(b1 - b2) < 2) return null; return mkE([a, b1, n + b1 * y0, a, b2, n + b2 * y0]); }, null);
  }
  function fracAdd(r, bk) {   // opposite y-coefficients, y a fraction
    if (bk) return mkE(bk);
    return gen(function () { var b = r.pick([2, 3, 4]), n = nz(r, -7, 7), a1 = r.int(1, 6), a2 = r.int(1, 6), x0 = nz(r, -3, 4); if (n % b === 0 || a1 === a2) return null; return mkE([a1, b, a1 * x0 + n, a2, -b, a2 * x0 - n]); }, null);
  }
  function e11s(o, b) { var g = o.p < 0 ? -1 : 1; return std(g * o.p, -g * o.q, -g * o.q * b); }
  function fracText(s, first) { return elimText(s, first === 'y' ? 'x' : 'y').text; }
  var E7BOOK = {
    a: { E1: yT(-4, 3), E2: std(8, 2, 6), kind: 'inf', tell: t(std(8, 2, 6)) + ' becomes ' + t(yT(-4, 3)) + ' — the same line as ' + t(yT(-4, 3)) + '.' },
    b: { E1: std(3, -1, 5), E2: std(6, -2, 7), kind: 'none', tell: t(std(3, -1, 5)) + ' is ' + t(yT(3, -5)) + ' and ' + t(std(6, -2, 7)) + ' is ' + t(yT(3, [-7, 2])) + ': both slopes are ' + t(3) + ', the intercepts ' + t(-5) + ' and ' + t('-\\frac{7}{2}') + ' differ.' },
    c: { E1: std(1, 1, 4), E2: std(1, -1, 4), kind: 'one', tell: t(std(1, 1, 4)) + ' has slope ' + t(-1) + ' and ' + t(std(1, -1, 4)) + ' has slope ' + t(1) + ' — different (they cross at ' + ptt([4, 0]) + ').' },
    d: { E1: std(2, 6, 9), E2: yT([-1, 3], 2), kind: 'none', tell: t(std(2, 6, 9)) + ' is ' + t(yT([-1, 3], [3, 2])) + '; both slopes are ' + t('-\\frac{1}{3}') + ' but the intercepts ' + t('\\frac{3}{2}') + ' and ' + t(2) + ' differ.' },
    e: { E1: std(5, -2, 8), E2: yT([5, 2], -4), kind: 'inf', tell: t(std(5, -2, 8)) + ' becomes ' + t(yT([5, 2], -4)) + ' — exactly the second equation.' },
    f: { E1: std(4, 1, 9), E2: std(1, -1, 1), kind: 'one', tell: t(std(4, 1, 9)) + ' has slope ' + t(-4) + ' and ' + t(std(1, -1, 1)) + ' has slope ' + t(1) + ' — different.' } };
  function vanishMC(r, kind, stmt) {
    var none = kind === 'none';
    return mc(r, 'Solving left the statement ' + t(stmt) + '. What does it mean, and what does the graph look like?', [
      { html: none ? '<b>No solution</b>: the statement is false, so no point satisfies both equations — two parallel lines.' : '<b>Infinitely many solutions</b>: the statement is true for every point on the line — one line drawn twice.', right: true },
      { html: none ? '<b>Infinitely many solutions</b>: one line drawn twice.' : '<b>No solution</b>: two parallel lines.', why: none ? 'The same line would leave a <b>true</b> statement like ' + t('0=0') + '. ' + t(stmt) + ' is false.' : 'Parallel lines leave a <b>false</b> statement like ' + t('0=7') + '. ' + t(stmt) + ' is true.' },
      { html: '<b>No answer</b>: both variables disappeared.', why: 'The statement that is left <b>is</b> the answer: decide whether it is true or false.' },
      { html: '<b>One solution</b> at ' + ptt([0, 0]) + '.', why: 'Both variables vanished — there is no single point to find.' }],
      t(stmt) + ' is <b>' + (none ? 'false' : 'true') + '</b>: ' + (none ? 'no point works, so there is <b>no solution</b> and the lines are parallel.' : 'every point on the line works, so there are <b>infinitely many solutions</b> and the two equations are the same line.'),
      ['True statement → the same line. False statement → parallel lines.'], 'meaning of ' + stmt);
  }
  /* standard form A x + B y = C of a given line, no fractions */
  function stdChk(T0, o) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\s/g, ''); if (!s) return form('empty', 'Type your equation first.');
      var q = Ln.read(s, ['x', 'y']); if (!q.ok) return form('line-' + q.why, READWHY[q.why] || READWHY.unreadable);
      if (!Ln.same([q.a, q.b, q.c], T0)) return wrong('u8l8-step', 'Multiply <b>every</b> term by the denominator, then move the ' + t('x') + '-term to the left side.');
      var sides = s.split('='), num = function (x) { return /^-?\d+(\.\d+)?$/.test(x); };
      if (!(num(sides[1]) || num(sides[0])) || /frac|\//.test(s) || /^y=|=y$/.test(s)) return form('u8l8-std-form', 'Right line — now write it in standard form: ' + t('x') + ' and ' + t('y') + ' terms on one side, the number on the other, no fractions.');
      return ok();
    };
  }
  /* a second line for y = m x + b with the required outcome */
  function lineCondChk(o, kind) {
    var T0 = mbL(o.m, o.b), y0 = o.m * o.x0 + o.b;
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\s/g, ''); if (!s) return form('empty', 'Type your equation first.');
      var q = Ln.read(s, ['x', 'y']); if (!q.ok) return form('line-' + q.why, READWHY[q.why] || READWHY.unreadable);
      var L = [q.a, q.b, q.c], same = Ln.same(L, arr(T0)), par = Math.abs(q.a * T0.B - q.b * T0.A) < 1e-9;
      if (kind === 'none') { if (same) return wrong('u8l8-line-same', 'That is the <b>same</b> line — infinitely many solutions. Keep the slope but change the intercept.'); if (!par) return wrong('u8l8-line-slope', 'Your line has a different slope, so it crosses the given line. For no solution use the same slope, ' + t(nT(o.m)) + '.'); return ok(); }
      if (kind === 'inf') {
        if (!same) return wrong(par ? 'u8l8-line-same' : 'u8l8-line-slope', par ? 'Same slope but a different intercept: that’s parallel (no solution). It must be the <b>same</b> line.' : 'Your line has a different slope. It must be the same line, written another way.');
        var sides = s.split('='), num = function (x) { return /^-?\d+(\.\d+)?$/.test(x); };
        if (!(num(sides[0]) || num(sides[1])) || /frac|\//.test(s) || /^y=|=y$/.test(s)) return form('u8l8-std-form', 'Right line — now write it in standard form, ' + t('Ax+By=C') + ' (no fractions), so it doesn’t just repeat ' + t(yT(o.m, o.b)) + '.');
        return ok();
      }
      if (same) return wrong('u8l8-line-same', 'That is the same line — infinitely many solutions. Choose a different slope through the point.');
      if (Math.abs(q.a * o.x0 + q.b * y0 + q.c) > 1e-9) return wrong('u8l8-line-pt', 'Your line doesn’t pass through ' + ptt([o.x0, y0]) + ': substitute the point to check.');
      if (par) return wrong('u8l8-line-slope', 'Parallel lines never meet. Choose a different slope.');
      return ok();
    };
  }
  /* x = u a, y = v a */
  function litChk(uv) {
    return function (resp) {
      resp = resp || []; var vals = [];
      for (var i = 0; i < 2; i++) {
        var s = String(resp[i] == null ? '' : resp[i]).trim(); if (!s) return form('empty', 'Fill in both boxes.');
        if (/=/.test(s)) s = s.split('=').pop();
        var a = ex.parse(s); if (!a.ok) return form('unreadable', 'Write each answer as an expression in ' + t('a') + ', e.g. ' + t('3a') + '.');
        var v1 = ex.value(a.ast, { a: 1.7 }), v2 = ex.value(a.ast, { a: -2.3 }); if (!isFinite(v1) || !isFinite(v2)) return form('unreadable', 'Use only the letter ' + t('a') + '.');
        vals.push([v1, v2]);
      }
      var okv = vals.map(function (v, j) { return near(v[0], uv[j] * 1.7) && near(v[1], uv[j] * -2.3); });
      if (okv[0] && okv[1]) return ok();
      if (near(vals[0][0], uv[1] * 1.7) && near(vals[1][0], uv[0] * 1.7)) return wrong('swap-answer', 'Right expressions, wrong boxes.');
      if (okv[0] || okv[1]) return wrong('one-value', 'Your ' + (okv[0] ? t('x') : t('y')) + ' is right — substitute it back to find ' + (okv[0] ? t('y') : t('x')) + '.');
      return wrong('u8l8-lit', 'Add the equations: the ' + t('y') + '-terms cancel. Then divide to get ' + t('x') + ' in terms of ' + t('a') + '.');
    };
  }
  /* build a system through P that needs both equations multiplied */
  function buildChk(P) {
    return function (resp) {
      resp = resp || []; var R = [];
      for (var i = 0; i < 2; i++) {
        var s = String(resp[i] == null ? '' : resp[i]).replace(/\\left|\\right/g, '').replace(/\s/g, ''); if (!s) return form('empty', 'Write both equations.');
        var q = Ln.read(s, ['x', 'y']); if (!q.ok) return form('line-' + q.why, READWHY[q.why] || READWHY.unreadable);
        var sides = s.split('='); if (!/^-?\d+$/.test(sides[1]) || /frac|\//.test(s)) return form('u8l8-std-form', 'Write each equation in standard form, ' + t('Ax+By=C') + ', with whole numbers.');
        R.push({ a: q.a, b: q.b, c: -q.c });
      }
      for (i = 0; i < 2; i++) if (Math.abs(R[i].a * P[0] + R[i].b * P[1] - R[i].c) > 1e-9) return wrong('u8l8-build', 'Equation ' + (i + 1) + ' isn’t satisfied by ' + ptt(P) + ': ' + t(subT([[R[i].a, 'x'], [R[i].b, 'y']], { x: P[0], y: P[1] }) + '=' + nT(R[i].a * P[0] + R[i].b * P[1])) + ', not ' + t(nT(R[i].c)) + '.');
      if (Math.abs(R[0].a * R[1].b - R[1].a * R[0].b) < 1e-9) return wrong('u8l8-build', 'Your two lines have the same slope, so ' + ptt(P) + ' can’t be their only solution.');
      var unit = R.some(function (e) { return Math.abs(Math.abs(e.a) - 1) < 1e-9 || Math.abs(Math.abs(e.b) - 1) < 1e-9 || !e.a || !e.b; });
      if (unit) return wrong('u8l8-build', 'A coefficient of ' + t('\\pm1') + ' (or a missing variable) lets you solve with less work. Use coefficients of at least ' + t(2) + ' in size.');
      var dv = function (u, v) { u = Math.abs(u); v = Math.abs(v); return isInt(u / v) || isInt(v / u); };
      if (dv(R[0].a, R[1].a)) return wrong('u8l8-build', 'The ' + t('x') + '-coefficients ' + t(nT(R[0].a)) + ' and ' + t(nT(R[1].a)) + ': one is a multiple of the other, so multiplying just one equation eliminates ' + t('x') + '.');
      if (dv(R[0].b, R[1].b)) return wrong('u8l8-build', 'The ' + t('y') + '-coefficients ' + t(nT(R[0].b)) + ' and ' + t(nT(R[1].b)) + ': one is a multiple of the other, so multiplying just one equation eliminates ' + t('y') + '.');
      return ok();
    };
  }

  HW.defineLesson({
    id: 'u8l8', unit: 8, num: '8', title: 'Unit Review: Systems of Linear Equations', outcome: 'RF9',
    blurb: 'The whole unit together: solve by graphing, classify without graphing, substitution, elimination, choosing a method, and word problems — then error analysis and challenge problems.',
    questions: QUESTIONS, extra: EXTRA
  });
})(window);
