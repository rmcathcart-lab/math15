/* Math 15 · Unit 8 · Lesson 1 — What Is a System of Linear Equations? Solving by Graphing (RF9)
 * Assignment 1 (u8_L01.tex, Questions 1–14) and the Lesson 1 Extra Practice (u8_EP01.tex, Questions 1–17).
 * Every part is a generator: same structure, idea and difficulty as the booklet question (the booklet's numbers are among
 * the possible values), new numbers from the seed. Model: Math 10C u8l1.js (graph pad for both lines of a system and its
 * diagnoses, the point keypad, verifying a solution) — its helpers are copied here, with vertical/horizontal lines added.
 * Conversions: "graph both equations" -> the graph pad (both lines, arrows at both ends; any two grid points of each line),
 * then the solution as its own part (ordered pair, or "x = …, y = …"); "the system is graphed below" -> a drawn graph
 * (blue solid, red dashed); "determine whether the pair is the solution, show the substitution" -> number boxes for the
 * substituted values, then the verdict as multiple choice (Assignment), or multiple choice whose options name the
 * equation(s) the pair satisfies (Extra); "explain" -> multiple choice whose options are reasons; "check the solution in
 * both original equations" -> number boxes for the substituted values; "write a system" -> two equation boxes.
 * No calculator: integer solutions on the −6…6 grid (fraction slopes only where the booklet has them).
 * Outcomes: RF9 (systems). Rewriting one equation in slope–intercept form (no system in it) is RF6, as in Unit 7.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 17(c) (area of the triangle formed by three lines). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, Ln = HW.lines, DR = HW.draw, F = HW.fmt;

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
  function numFields(prompt, labels, vals, diags, sol, hints, text) {
    var fields = labels.map(function (l) { return { label: l }; });
    var checkers = vals.map(function (v, i) { return K.number(v, diags ? diags[i] : null); });
    return K.P.fields(prompt, fields, checkers, vals.map(String), labels.map(function (l, i) { return l + ' ' + t(nT(vals[i])); }).join('<br>'), sol, hints, text);
  }
  /* ---------- checking a point in an equation: eq = { tex, ev: terms, to: 'y' | number } means "ev = to" ---------- */
  function E(tex, ev, to) { return { tex: tex, ev: ev, to: to }; }
  function eqY(m, b) { return E(yT(m, b), [[m, 'x'], [b, '']], 'y'); }
  function eqG(terms, c) { return E(eqT(terms, c), terms, c); }
  function V(P) { return { x: P[0], y: P[1] }; }
  function want(e, P) { return e.to === 'y' ? fv(P[1]) : e.to; }
  function holds(e, P) { return Math.abs(evalT(e.ev, V(P)) - want(e, P)) < 1e-9; }
  function hasY(e) { return e.ev.some(function (tm) { return tm[1] === 'y'; }); }
  function evLabel(e, P) { return t(T(e.ev)) + ' at ' + (hasY(e) ? ptt(P) : t('x=' + nT(P[0]))) + ':'; }
  function evLine(e, P) {
    var v = evalT(e.ev, V(P)), w = want(e, P), good = Math.abs(v - w) < 1e-9;
    return 'In ' + t(e.tex) + ': ' + t(subT(e.ev, V(P)) + '=' + nT(v)) + (good ? (e.to === 'y' ? ', and ' + t('y=' + nT(P[1])) : '') + ' ✓' : ' ' + t('\\ne ' + nT(w)) + ' ✗');
  }
  function evLines(eqs, P) { return eqs.map(function (e) { return evLine(e, P); }).join('<br>'); }
  /* number boxes: the value of each substituted side */
  function subFields(prompt, eqs, P, sol, hints, text) {
    var vals = eqs.map(function (e) { return evalT(e.ev, V(P)); }), Sw = { x: P[1], y: P[0] }, Ab = { x: Math.abs(fv(P[0])), y: Math.abs(fv(P[1])) };
    var diags = eqs.map(function (e, i) {
      return function (v) {
        if (hasY(e) && fv(P[0]) !== fv(P[1]) && Math.abs(v - evalT(e.ev, Sw)) < 1e-9) return { code: 'sub-swap', hint: 'You substituted the coordinates the wrong way round: in ' + ptt(P) + ', ' + t('x=' + nT(P[0])) + ' and ' + t('y=' + nT(P[1])) + '.' };
        var ab = evalT(e.ev, Ab); if (Math.abs(ab - vals[i]) > 1e-9 && Math.abs(v - ab) < 1e-9) return { code: 'sub-wrong', hint: 'Watch the signs: put each negative value in brackets, e.g. ' + t(subT(e.ev, V(P))) + '.' };
        return null;
      };
    });
    var p = numFields(prompt, eqs.map(function (e) { return evLabel(e, P); }), vals, diags, sol, hints, text);
    p.bad = [vals.map(function (v) { return String(v + 1); })];
    return p;
  }
  /* the verdict: which equations the point makes true */
  function verdictMC(r, prompt, eqs, P, sol, hints, text) {
    var h = eqs.map(function (e) { return holds(e, P); }), a = t(eqs[0].tex), b = t(eqs[1].tex), lines = evLines(eqs, P);
    var why = 'Substitute again: <br>' + lines;
    return mc(r, prompt, [
      { html: '<b>Yes</b> — it makes both equations true, so ' + ptt(P) + ' is the solution.', right: h[0] && h[1], why: why + '<br>A solution has to make <b>both</b> equations true.', code: 'v-yes' },
      { html: '<b>No</b> — it makes ' + a + ' true but ' + b + ' false.', right: h[0] && !h[1], why: why, code: 'v-no2' },
      { html: '<b>No</b> — it makes ' + b + ' true but ' + a + ' false.', right: !h[0] && h[1], why: why, code: 'v-no1' },
      { html: '<b>No</b> — it makes both equations false.', right: !h[0] && !h[1], why: why, code: 'v-none' }],
      sol || (lines + '<br>' + (h[0] && h[1] ? 'Both equations are true, so ' + ptt(P) + ' <b>is</b> the solution of the system.' : 'A solution must make <b>both</b> equations true, so ' + ptt(P) + ' is <b>not</b> the solution.')),
      hints || ['Substitute ' + t('x=' + nT(P[0])) + ' and ' + t('y=' + nT(P[1])) + ' into each equation.', 'Put negative values in brackets.'], text, true);
  }
  /* table of values for two y = mx + b lines around x0: the matching column is the solution */
  function tabSol(m1, b1, m2, b2, x0) {
    var xs = []; for (var x = x0 - 2; x <= x0 + 1; x++) xs.push(x);
    return HW.valueTable([['\\(x\\)'].concat(xs), ['\\(' + yT(m1, b1) + '\\)'].concat(xs.map(function (x) { return fv(m1) * x + b1; })), ['\\(' + yT(m2, b2) + '\\)'].concat(xs.map(function (x) { return fv(m2) * x + b2; }))]);
  }
  /* a system y = m1 x + b1, y = m2 x + b2 with an integer crossing (x0, y0) */
  function ysys(r, M1, M2, o) {
    o = o || {};
    var s = pick2(r, function (r) { return { m1: r.pick(M1), m2: r.pick(M2), x0: r.int(o.xlo == null ? -4 : o.xlo, o.xhi == null ? 4 : o.xhi), y0: r.int(o.ylo == null ? -4 : o.ylo, o.yhi == null ? 4 : o.yhi) }; },
      function (s) {
        if (Math.abs(fv(s.m1) - fv(s.m2)) < 1e-9) return false;
        var b1 = r6(s.y0 - fv(s.m1) * s.x0), b2 = r6(s.y0 - fv(s.m2) * s.x0), B = o.bmax || 6;
        if (!Number.isInteger(b1) || !Number.isInteger(b2) || Math.abs(b1) > B || Math.abs(b2) > B) return false;
        if (o.test && !o.test(s, b1, b2)) return false;
        return latS(mbL(s.m1, b1), W6).length >= 2 && latS(mbL(s.m2, b2), W6).length >= 2;
      });
    s.b1 = r6(s.y0 - fv(s.m1) * s.x0); s.b2 = r6(s.y0 - fv(s.m2) * s.x0); s.P = [s.x0, s.y0];
    s.L1 = mbL(s.m1, s.b1); s.L2 = mbL(s.m2, s.b2); s.n1 = yT(s.m1, s.b1); s.n2 = yT(s.m2, s.b2);
    return s;
  }
  function stepT(m) { var f = Array.isArray(m) ? fr(m[0], m[1]) : [m, 1]; return (f[0] < 0 ? 'down ' + Math.abs(f[0]) : 'up ' + f[0]) + ', right ' + f[1]; }
  function graphSol(names, ms, bs, P) {
    return names.map(function (n, i) { return t(n) + ': start at ' + ptt([0, bs[i]]) + ', then ' + stepT(ms[i]) + '.'; }).join('<br>') + '<br>Draw a line through each set of points (arrows on both ends). The lines cross at ' + ptt(P) + '.';
  }
  var GH = ['Plot each ' + t('y') + '-intercept first, then use the slope (rise over run) to find more points.', 'Put arrows on both ends of each line.'];

  HW.addCodes({
    'u8-gr-shift': 'Graph: right slope, wrong place', 'u8-gr-sign': 'Graph: slope sign wrong', 'u8-gr-flip': 'Graph: run over rise', 'u8-gr-slope': 'Graph: right intercept, wrong slope', 'u8-gr-line': 'Graph: a line wrong',
    'u8-point-off': 'Plotted a point not on the line', 'u8-points-only': 'Plotted points but no lines', 'u8-line-missing': 'A line of the system missing', 'u8-line-extra': 'Extra line drawn', 'u8-graph': 'Graph of the system wrong',
    'u8-eq-swap': 'Equations in the wrong boxes', 'u8-neg': 'Sign slip dividing by −1 (or a negative)', 'u8-nodiv': 'Didn’t divide every term', 'u8-pq-one': 'Gave one coordinate, not p + q', 'u8-pq-diff': 'Subtracted the coordinates',
    'u8-sys-notpt': 'Line misses the required point', 'u8-sys-same': 'Wrote the same line (infinitely many)', 'sub-swap': 'Substituted the point’s coordinates into the wrong letters', 'sub-wrong': 'Substitution arithmetic slip', 'ch-no-half': 'Forgot the ½ in the area formula',
    'u8l1-yint': 'Gave a y-intercept instead of the crossing point', 'u8l1-xint': 'Gave an x-intercept instead of the crossing point', 'u8l1-gave-x': 'Gave x instead of y', 'u8l1-back-sign': 'Working backwards: sign slip solving for the unknown coefficient',
    'u8l1-back-move': 'Working backwards: moved a term without changing its sign', 'u8l1-pts-off': 'Listed a point that is not on the line', 'u8l1-pts-int': 'Listed the y-intercept as one of the new points', 'u8l1-pts-same': 'Listed the same point twice',
    'u8l1-base-ends': 'Triangle base: used one endpoint’s x-value instead of the distance between them', 'u8l1-height-apex': 'Triangle height: used the top vertex’s y-value instead of the distance to the base', 'u8l1-cost': 'Plan cost worked out wrongly'
  });
  HW.addPartial({ 'u8l1-yint': 'n', 'u8l1-xint': 'n', 'u8l1-gave-x': 'b', 'u8l1-back-sign': 's', 'u8l1-back-move': 's', 'u8l1-pts-off': 'n', 'u8l1-pts-int': 's', 'u8l1-pts-same': 's', 'u8l1-base-ends': 'b', 'u8l1-height-apex': 'b', 'u8l1-cost': 's',
    'u8-point-off': 's', 'u8-points-only': 'b', 'u8-graph': 'n', 'u8-sys-same': 'n' });

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

  HW.defineLesson({
    id: 'u8l1', unit: 8, num: '1', title: 'What Is a System of Linear Equations? Solving by Graphing', outcome: 'RF9',
    blurb: 'Read the solution of a system off a graph, graph both lines by hand and find where they cross, and check a solution by substituting it into both equations.',
    questions: [
      /* ---------- Part A ---------- */
      { num: '1', section: 'Part A — Reading and solving by graphing', parts: [
        { id: '1', level: 'BEG', make: function (r) {
          var s = ysys(r, [1, 1, 2, 3], [-1, -1, -2, -3], { test: function (s) { return s.x0 !== 0; } });
          return pointPart('The system ' + t(s.n1) + ' (blue, solid) and ' + t(s.n2) + ' (red, dashed) is graphed below. State the solution as an ordered pair.' + sysFig([s.L1, s.L2], W6), s.P, [s.L1, s.L2],
            { wrong: [{ is: [0, s.b1], code: 'u8l1-yint', hint: 'That is where the blue line crosses the ' + t('y') + '-axis. The solution is where the two lines cross <b>each other</b>.' }, { is: [0, s.b2], code: 'u8l1-yint', hint: 'That is where the red line crosses the ' + t('y') + '-axis. The solution is where the two lines cross <b>each other</b>.' }] },
            'The lines cross at ' + ptt(s.P) + '.<br>Check: ' + t(subT([[s.m1, 'x'], [s.b1, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓ and ' + t(subT([[s.m2, 'x'], [s.b2, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓',
            ['Find the point where the two lines cross. Go across to it first (' + t('x') + '), then up or down (' + t('y') + ').'], 'read solution off graph');
        } }] },
      { num: '2', shared: function (r) { return ysys(r, [1, 1, 1, 2], [-1], { test: function (s) { return s.x0 !== 0; } }); },
        stem: function (s) { return 'Consider the system ' + t(s.n1) + ' and ' + t(s.n2) + '.'; },
        parts: [
          { id: '2a', sub: 'graph', level: 'BEG', make: function (r, s) {
            return sysGraph('Graph both equations on the grid.', [s.L1, s.L2], [s.n1, s.n2], W6, {}, graphSol([s.n1, s.n2], [s.m1, s.m2], [s.b1, s.b2], s.P), GH, 'graph y=mx+b system');
          } },
          { id: '2b', sub: 'solution', level: 'BEG', make: function (r, s) {
            return pointPart('State the solution to the system.', s.P, [s.L1, s.L2], {},
              'The lines cross at ' + ptt(s.P) + '.<br>Check: ' + t(subT([[s.m1, 'x'], [s.b1, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓ and ' + t(subT([[s.m2, 'x'], [s.b2, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓',
              ['Where do your two lines cross?'], 'solution from graph');
          } }] },
      { num: '3', shared: function (r) {
          var s = pick2(r, function (r) { return { c: r.pick([3, 3, -2, -3, 1, 2, 4, -1, -4]), m2: r.pick([-1, -1, -2]), x0: r.int(-3, 5) }; },
            function (s) { var y0 = s.x0 - s.c, b2 = y0 - s.m2 * s.x0; s.y0 = y0; s.b2 = b2; return Math.abs(y0) <= 5 && Math.abs(b2) <= 6 && b2 !== -s.c && latS(mbL(s.m2, b2), W6).length >= 2; });
          s.P = [s.x0, s.y0]; s.L1 = line(1, -1, -s.c); s.L2 = mbL(s.m2, s.b2); s.g1 = eqT([[1, 'x'], [-1, 'y']], s.c); s.n2 = yT(s.m2, s.b2); s.n1 = si(s.L1);
          return s;
        },
        stem: function (s) { return 'Consider the system ' + t(s.g1) + ' and ' + t(s.n2) + '.'; },
        parts: [
          { id: '3a', sub: 'a', level: 'BEG', outcome: 'RF6', make: function (r, s) {
            return rewritePart('Rewrite ' + t(s.g1) + ' in slope–intercept form.', 1, -1, s.c, t(s.g1) + '<br>' + t('-y=' + T([[-1, 'x'], [s.c, '']])) + '<br>' + t(s.n1) + ' (divide every term by ' + t('-1') + ').');
          } },
          { id: '3b', sub: 'b graph', level: 'EMG', make: function (r, s) {
            return sysGraph('Graph both equations on the grid.', [s.L1, s.L2], [s.g1, s.n2], W6, {}, t(s.g1) + ' is ' + t(s.n1) + '.<br>' + graphSol([s.n1, s.n2], [1, s.m2], [-s.c, s.b2], s.P), ['Graph ' + t(s.g1) + ' from its slope–intercept form, ' + t(s.n1) + '.'].concat(GH), 'graph system, one rewritten');
          } },
          { id: '3c', sub: 'b solution', level: 'BEG', make: function (r, s) {
            return pointPart('State the solution to the system.', s.P, [s.L1, s.L2], {},
              'The lines cross at ' + ptt(s.P) + '.<br>Check in the originals: ' + t(subT([[1, 'x'], [-1, 'y']], V(s.P)) + '=' + s.c) + ' ✓ and ' + t(subT([[s.m2, 'x'], [s.b2, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓',
              ['Where do your two lines cross?'], 'solution from graph');
          } }] },
      { num: '4', shared: function (r) { return ysys(r, [-1, -1, -2], [3, 3, 2], { test: function (s, b1, b2) { return s.x0 !== 0 && b1 !== 0; } }); },
        stem: function (s) { return 'Consider the system ' + t(s.n1) + ' and ' + t(s.n2) + '.'; },
        parts: [
          { id: '4a', sub: 'graph', level: 'EMG', make: function (r, s) {
            return sysGraph('Graph both equations on the grid.', [s.L1, s.L2], [s.n1, s.n2], W6, {}, graphSol([s.n1, s.n2], [s.m1, s.m2], [s.b1, s.b2], s.P), GH, 'graph y=mx+b system, steep');
          } },
          { id: '4b', sub: 'solution', level: 'BEG', make: function (r, s) {
            return pointPart('State the solution to the system.', s.P, [s.L1, s.L2], {},
              'The lines cross at ' + ptt(s.P) + '.<br>Check: ' + t(subT([[s.m1, 'x'], [s.b1, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓ and ' + t(subT([[s.m2, 'x'], [s.b2, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓',
              ['Where do your two lines cross?'], 'solution from graph');
          } }] },
      { num: '5', shared: function (r) {
          var s = pick2(r, function (r) { return { x0: r.int(-3, 5), y0: r.int(-4, 5) }; }, function (s) { var a = s.x0 + s.y0, d = s.x0 - s.y0; return a !== 0 && d !== 0 && Math.abs(a) <= 6 && Math.abs(d) <= 6; });
          s.s = s.x0 + s.y0; s.d = s.x0 - s.y0; s.P = [s.x0, s.y0]; s.L1 = line(1, 1, -s.s); s.L2 = line(1, -1, -s.d);
          s.g1 = eqT([[1, 'x'], [1, 'y']], s.s); s.g2 = eqT([[1, 'x'], [-1, 'y']], s.d); s.n1 = si(s.L1); s.n2 = si(s.L2);
          return s;
        },
        stem: function (s) { return 'Consider the system ' + t(s.g1) + ' and ' + t(s.g2) + '.'; },
        parts: [
          { id: '5a', sub: 'a', level: 'EMG', outcome: 'RF6', make: function (r, s) {
            return twoEq('Rewrite each equation in slope–intercept form.', [s.L1, s.L2], [t(s.g1) + ':', t(s.g2) + ':'], { form: 'slope-intercept', wrong: [[{ is: line(-1, 1, -s.s), code: 'u8-neg', hint: 'Moving ' + t('x') + ' to the other side changes its sign: subtract ' + t('x') + ' from both sides.' }], [{ is: line(1, 1, s.d), code: 'u8-neg', hint: 'From ' + t('-y=' + T([[-1, 'x'], [s.d, '']])) + ', divide <b>every</b> term by ' + t('-1') + '.' }, { is: line(1, -1, s.d), code: 'u8-neg', hint: 'Divide <b>every</b> term by ' + t('-1') + ' — the constant changes sign too.' }]] },
              t(s.g1) + ' → subtract ' + t('x') + ': ' + t(s.n1) + '.<br>' + t(s.g2) + ' → ' + t('-y=' + T([[-1, 'x'], [s.d, '']])) + ' → divide by ' + t('-1') + ': ' + t(s.n2) + '.',
              ['Get ' + t('y') + ' by itself in each equation.', 'When you divide by ' + t('-1') + ', every sign changes.'], 'rewrite both');
          } },
          { id: '5b', sub: 'b graph', level: 'EMG', make: function (r, s) {
            return sysGraph('Graph both equations on the grid.', [s.L1, s.L2], [s.g1, s.g2], W6, {}, graphSol([s.n1, s.n2], [-1, 1], [s.s, -s.d], s.P), ['Use the slope–intercept forms from part (a).'].concat(GH), 'graph two rewritten equations');
          } },
          { id: '5c', sub: 'b solution', level: 'BEG', make: function (r, s) {
            return pointPart('State the solution to the system.', s.P, [s.L1, s.L2], {},
              'The lines cross at ' + ptt(s.P) + '.<br>Check in the originals: ' + t(subT([[1, 'x'], [1, 'y']], V(s.P)) + '=' + s.s) + ' ✓ and ' + t(subT([[1, 'x'], [-1, 'y']], V(s.P)) + '=' + s.d) + ' ✓',
              ['Where do your two lines cross?'], 'solution from graph');
          } }] },
      /* ---------- Part B ---------- */
      { num: '6', section: 'Part B — Checking a proposed solution',
        shared: function (r) { var s = ysys(r, [2, 2, 3, 1], [-1, -1, -2], { xlo: 1, xhi: 5, ylo: 1, yhi: 6, bmax: 9, test: function (s, b1, b2) { return b1 !== 0 && b2 !== 0; } }); s.eqs = [eqY(s.m1, s.b1), eqY(s.m2, s.b2)]; return s; },
        stem: function (s) { return 'Determine whether ' + ptt(s.P) + ' is the solution to the system ' + t(s.n1) + ' and ' + t(s.n2) + '.'; },
        parts: [
          { id: '6a', sub: 'a', level: 'BEG', make: function (r, s) {
            return subFields('Substitute ' + t('x=' + s.x0) + ' into the right side of each equation.', s.eqs, s.P, evLines(s.eqs, s.P), ['Replace ' + t('x') + ' with ' + t(s.x0) + ' and work out the value.'], 'substitute into both');
          } },
          { id: '6b', sub: 'b', level: 'BEG', make: function (r, s) {
            return verdictMC(r, 'Is ' + ptt(s.P) + ' the solution to the system?', s.eqs, s.P, null, null, 'verdict yes');
          } }] },
      { num: '7', shared: function (r) {
          var s = pick2(r, function (r) { return { m1: r.pick([3, 3, 2, 4]), b1: r.int(-3, 3), m2: r.pick([-2, -2, -1, -3]), b2: r.int(5, 10), x0: r.int(1, 3), y0: r.int(1, 8), k: r.pick(['both', 'both', 'one1', 'one2']) }; },
            function (s) {
              var v1 = s.m1 * s.x0 + s.b1, v2 = s.m2 * s.x0 + s.b2;
              if (s.b1 === 0) return false;
              if (s.k === 'both') return v1 !== s.y0 && v2 !== s.y0 && Math.abs(v1 - s.y0) <= 3 && Math.abs(v2 - s.y0) <= 3;
              if (s.k === 'one1') return v1 === s.y0 && v2 !== s.y0 && Math.abs(v2 - s.y0) <= 3;
              return v2 === s.y0 && v1 !== s.y0 && Math.abs(v1 - s.y0) <= 3;
            });
          s.P = [s.x0, s.y0]; s.n1 = yT(s.m1, s.b1); s.n2 = yT(s.m2, s.b2); s.eqs = [eqY(s.m1, s.b1), eqY(s.m2, s.b2)];
          return s;
        },
        stem: function (s) { return 'Determine whether ' + ptt(s.P) + ' is the solution to the system ' + t(s.n1) + ' and ' + t(s.n2) + '.'; },
        parts: [
          { id: '7a', sub: 'a', level: 'BEG', make: function (r, s) {
            return subFields('Substitute ' + t('x=' + s.x0) + ' into the right side of each equation.', s.eqs, s.P, evLines(s.eqs, s.P), ['Replace ' + t('x') + ' with ' + t(s.x0) + ' and work out the value.'], 'substitute into both');
          } },
          { id: '7b', sub: 'b', level: 'BEG', make: function (r, s) {
            return verdictMC(r, 'Is ' + ptt(s.P) + ' the solution to the system?', s.eqs, s.P, null, null, 'verdict no');
          } }] },
      { num: '8', shared: function (r) {
          var s = pick2(r, function (r) { return { a: r.pick([2, 2, 3, 1]), b: r.pick([1, 1, 2]), x0: r.int(1, 5), y0: r.pick([-1, -1, -2, -3, 1, 2]), c: r.pick([-4, -4, -3, -2, -5, -1]) }; },
            function (s) { var C = s.a * s.x0 + s.b * s.y0; s.C = C; return s.x0 + s.c === s.y0 && C > 0 && !(s.a === 1 && s.b === 1) && gcd(s.a, s.b) === 1; });
          s.P = [s.x0, s.y0]; s.eqs = [eqG([[s.a, 'x'], [s.b, 'y']], s.C), eqY(1, s.c)];
          return s;
        },
        stem: function (s) { return 'Determine whether ' + ptt(s.P) + ' is the solution to the system ' + t(s.eqs[0].tex) + ' and ' + t(s.eqs[1].tex) + '.'; },
        parts: [
          { id: '8a', sub: 'a', level: 'EMG', make: function (r, s) {
            return subFields('Substitute the point into each equation: work out the value of each expression.', s.eqs, s.P, evLines(s.eqs, s.P), ['In ' + t(s.eqs[0].tex) + ' substitute both ' + t('x=' + s.x0) + ' and ' + t('y=' + s.y0) + '.', 'Put the negative value in brackets: ' + t(subT(s.eqs[0].ev, V(s.P))) + '.'], 'substitute, standard form');
          } },
          { id: '8b', sub: 'b', level: 'BEG', make: function (r, s) {
            return verdictMC(r, 'Is ' + ptt(s.P) + ' the solution to the system?', s.eqs, s.P, null, null, 'verdict, standard form');
          } }] },
      { num: '9', parts: [
        { id: '9', level: 'BEG', make: function (r) {
          var s = ysys(r, [2, 3, 1], [-1, -2], { xlo: 1, xhi: 4, ylo: 1, yhi: 5, bmax: 9 }), d = r.pick([1, 2, -1]), Q = [s.x0 + d, s.m1 * (s.x0 + d) + s.b1], v2 = s.m2 * Q[0] + s.b2;
          return mc(r, 'Sam says ' + ptt(Q) + ' is the solution to the system ' + t(s.n1) + ' and ' + t(s.n2) + ', because ' + t(subT([[s.m1, 'x'], [s.b1, '']], { x: Q[0] }) + '=' + Q[1]) + ' ✓. Why is it important to check a proposed solution in <b>both</b> equations?', [
            { html: 'A point can lie on one line but not on the other, so it can make one equation true and the other false. Only a point on <b>both</b> lines — where they cross — solves the system.', right: true },
            { html: 'If a point works in one equation, it always works in the other one too, so checking both is just a habit.', why: 'Try Sam’s point in the second equation: ' + t(subT([[s.m2, 'x'], [s.b2, '']], { x: Q[0] }) + '=' + v2 + '\\ne ' + Q[1]) + '. It works in one equation and not the other.', code: 'always' },
            { html: 'The second equation is always the harder one, so it catches more mistakes.', why: 'Either equation could be the one that fails. What matters is that a solution has to lie on <b>both</b> lines.', code: 'harder' },
            { html: 'Checking one equation is enough, as long as the arithmetic is done carefully.', why: 'Sam’s arithmetic is right, and the point is still wrong: ' + t(subT([[s.m2, 'x'], [s.b2, '']], { x: Q[0] }) + '=' + v2 + '\\ne ' + Q[1]) + '.', code: 'careful' }],
            'Every point on the line ' + t(s.n1) + ' makes the first equation true, so passing one check proves only that the point is on that line. In the second equation: ' + t(subT([[s.m2, 'x'], [s.b2, '']], { x: Q[0] }) + '=' + v2 + '\\ne ' + Q[1]) + ' ✗.<br>The solution of a system must make <b>both</b> equations true — it is the point where the lines cross (here ' + ptt(s.P) + ').',
            ['How many points make just one linear equation true?'], 'why check both');
        } }] },
      /* ---------- Part C ---------- */
      { num: '10', section: 'Part C — Rearranging, graphing and checking',
        shared: function (r) {
          var s = pick2(r, function (r) { return { a: r.pick([4, 4, 3, 2]), m2: r.pick([-1, -1, -2]), x0: r.int(-2, 3), y0: r.int(-4, 4) }; },
            function (s) { var c = s.a * s.x0 - s.y0, b2 = s.y0 - s.m2 * s.x0; s.c = c; s.b2 = b2; return c !== 0 && Math.abs(c) <= 6 && Math.abs(b2) <= 6 && latS(line(s.a, -1, -c), W6).length >= 2 && latS(mbL(s.m2, b2), W6).length >= 2; });
          s.P = [s.x0, s.y0]; s.L1 = line(s.a, -1, -s.c); s.L2 = mbL(s.m2, s.b2); s.g1 = eqT([[s.a, 'x'], [-1, 'y']], s.c); s.n1 = si(s.L1); s.n2 = yT(s.m2, s.b2);
          s.eqs = [eqG([[s.a, 'x'], [-1, 'y']], s.c), eqY(s.m2, s.b2)];
          return s;
        },
        stem: function (s) { return 'Consider the system ' + t(s.g1) + ' and ' + t(s.n2) + '.'; },
        parts: [
          { id: '10a', sub: 'a', level: 'BEG', outcome: 'RF6', make: function (r, s) {
            return rewritePart('Rewrite ' + t(s.g1) + ' in slope–intercept form.', s.a, -1, s.c);
          } },
          { id: '10b', sub: 'b graph', level: 'EMG', make: function (r, s) {
            return sysGraph('Graph both equations on the grid.', [s.L1, s.L2], [s.g1, s.n2], W6, {}, t(s.g1) + ' is ' + t(s.n1) + '.<br>' + graphSol([s.n1, s.n2], [s.a, s.m2], [-s.c, s.b2], s.P), ['Graph ' + t(s.g1) + ' from its slope–intercept form, ' + t(s.n1) + '.'].concat(GH), 'graph system, one rewritten, steep');
          } },
          { id: '10c', sub: 'b solution', level: 'BEG', make: function (r, s) {
            return pointPart('State the solution to the system.', s.P, [s.L1, s.L2], {}, 'The lines cross at ' + ptt(s.P) + '.', ['Where do your two lines cross?'], 'solution from graph');
          } },
          { id: '10d', sub: 'c', level: 'BEG', make: function (r, s) {
            return subFields('Check the solution ' + ptt(s.P) + ' in both <b>original</b> equations: work out the value of each expression.', s.eqs, s.P,
              evLines(s.eqs, s.P) + '<br>Both original equations are true, so ' + ptt(s.P) + ' is confirmed.', ['Use the original equations, not the rewritten one.'], 'check in both originals');
          } }] },
      /* ---------- Part D ---------- */
      { num: '11', section: 'Part D — Multiple choice and numerical response', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var s = ysys(r, [2, 2, 3], [-1, -1, -2], { xlo: 2, xhi: 5, ylo: 2, yhi: 7, bmax: 12, test: function (s, b1, b2) { return s.x0 !== s.y0 && b1 !== 0 && Math.abs(b1) >= 2 && b2 >= 5; } });
          var opts = [s.P, [s.y0, s.x0], [-s.x0, s.y0], [s.x0, -s.y0]];
          var why = function (Q) { var e1 = [[s.m1, 'x'], [s.b1, '']], e2 = [[s.m2, 'x'], [s.b2, '']], v1 = evalT(e1, V(Q)), v2 = evalT(e2, V(Q)); return 'Test it: ' + t(subT(e1, V(Q)) + '=' + v1) + (v1 === Q[1] ? ' ✓' : t('\\ne ' + Q[1])) + ' and ' + t(subT(e2, V(Q)) + '=' + v2) + (v2 === Q[1] ? ' ✓' : t('\\ne ' + Q[1])) + '. It has to work in <b>both</b>.'; };
          return mc(r, 'The ordered pair ' + t('(x,\\ y)') + ' which satisfies the system ' + t(s.n1) + ', ' + t(s.n2) + ' is', opts.map(function (Q, i) { return { html: ptt(Q), right: i === 0, why: i ? why(Q) : null, code: ['ok', 'swap', 'xsign', 'ysign'][i] }; }),
            'Test the choices in both equations: ' + t(subT([[s.m1, 'x'], [s.b1, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓ and ' + t(subT([[s.m2, 'x'], [s.b2, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓, so ' + ptt(s.P) + ' is the solution. (Graphing both lines gives the same crossing point.)',
            ['Substitute each choice into both equations.'], 'MC which pair solves');
        } }] },
      { num: '12', parts: [
        { id: '12', level: 'LIM', make: function (r) {
          var s = ysys(r, [1, 2, 3], [-1], { xlo: -3, xhi: 4, ylo: -3, yhi: 4, test: function (s, b1, b2) { return s.x0 !== 0 && s.y0 !== 0 && b2 !== 0 && b1 !== s.y0; } }), xi = s.b2;   // m2 = −1: x-intercept = b2
          return mc(r, 'The system ' + t(s.n1) + ' (blue, solid) and ' + t(s.n2) + ' (red, dashed) is graphed below. On the graph, the solution to the system is' + sysFig([s.L1, s.L2], W6), [
            { html: 'the point where the two lines cross, ' + ptt(s.P), right: true },
            { html: 'the ' + t('y') + '-intercept of the blue line, ' + ptt([0, s.b1]), why: 'That point is on the blue line only. The solution has to be on <b>both</b> lines.', code: 'yint' },
            { html: 'the ' + t('x') + '-intercept of the red line, ' + ptt([xi, 0]), why: 'That point is on the red line only. The solution has to be on <b>both</b> lines.', code: 'xint' },
            { html: 'the slope of either line', why: 'A slope is a single number, not a point. The solution of a system is an ordered pair on both lines.', code: 'slope' }],
            'A point on a line makes that line’s equation true, so the only point that makes <b>both</b> equations true is the one on both lines: where they cross, ' + ptt(s.P) + '.',
            ['Which point is on both lines?'], 'MC what the solution is');
        } }] },
      { num: '13', parts: [
        { id: '13', level: 'PRG', make: function (r) {
          var s = pick2(r, function (r) { return { m1: r.pick([5, 5, 3, 4]), m2: r.pick([-2, -2, -1, -3]), x0: r.int(1, 4), y0: r.int(1, 9) }; }, function (s) { var b1 = s.y0 - s.m1 * s.x0, b2 = s.y0 - s.m2 * s.x0; return b1 < 0 && b1 >= -12 && b2 <= 15 && s.x0 !== s.y0; });
          var b1 = s.y0 - s.m1 * s.x0, b2 = s.y0 - s.m2 * s.x0, ans = s.x0 + s.y0;
          return K.P.nr('The system ' + t(yT(s.m1, b1)) + ' and ' + t(yT(s.m2, b2)) + ' has solution ' + t('(x,\\ y)') + '. The value of ' + t('x+y') + ' is ____.', ans,
            function (v) { if (v === s.x0) return { code: 'u8-pq-one', hint: 'That is ' + t('x') + ' alone — add ' + t('y') + ' as well.' }; if (v === s.y0) return { code: 'u8-pq-one', hint: 'That is ' + t('y') + ' alone — add ' + t('x') + ' as well.' }; if (v === Math.abs(s.x0 - s.y0)) return { code: 'u8-pq-diff', hint: 'The question asks for the <b>sum</b> ' + t('x+y') + '.' }; return null; },
            'Make a table of values for both equations and look for the ' + t('x') + ' where they give the same ' + t('y') + ':' + tabSol(s.m1, b1, s.m2, b2, s.x0) + 'At ' + t('x=' + s.x0) + ' both give ' + t('y=' + s.y0) + ', so the solution is ' + ptt([s.x0, s.y0]) + ' (check: ' + t(subT([[s.m1, 'x'], [b1, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓, ' + t(subT([[s.m2, 'x'], [b2, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓).<br>' + t('x+y=' + s.x0 + '+' + s.y0 + '=' + ans) + '.',
            ['The intercepts are off the usual grid: make a table of values for both lines (' + t('x=0,\\ 1,\\ 2,\\ \\ldots') + ') and find where they match.', 'Then add the two coordinates.'], 'NR x+y');
        } }] },
      { num: '14', parts: [
        { id: '14', level: 'PRG', make: function (r) {
          var s = pick2(r, function (r) { return { m1: r.pick([-4, -4, -3, -2]), m2: r.pick([1, 1, 2]), x0: r.int(1, 4), y0: r.int(1, 7) }; }, function (s) { var b1 = s.y0 - s.m1 * s.x0, b2 = s.y0 - s.m2 * s.x0; return b1 >= 4 && b1 <= 15 && b2 !== 0 && Math.abs(b2) <= 8 && s.x0 !== s.y0; });
          var b1 = s.y0 - s.m1 * s.x0, b2 = s.y0 - s.m2 * s.x0;
          return K.P.nr('A system’s two equations are ' + t(yT(s.m1, b1)) + ' and ' + t(yT(s.m2, b2)) + '. The value of ' + t('y') + ' at the solution is ____.', s.y0,
            function (v) { if (v === s.x0) return { code: 'u8l1-gave-x', hint: 'That is the ' + t('x') + '-coordinate of the solution. Substitute it into either equation to find ' + t('y') + '.' }; return null; },
            'Make a table of values for both equations:' + tabSol(s.m1, b1, s.m2, b2, s.x0) + 'At ' + t('x=' + s.x0) + ' both give ' + t('y=' + s.y0) + ', so the solution is ' + ptt([s.x0, s.y0]) + '.<br>Check: ' + t(subT([[s.m1, 'x'], [b1, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓, ' + t(subT([[s.m2, 'x'], [b2, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓. The value of ' + t('y') + ' is ' + t(s.y0) + '.',
            ['Make a table of values for both lines and find the ' + t('x') + ' where they give the same ' + t('y') + '.', 'The question asks for ' + t('y') + ', not ' + t('x') + '.'], 'NR y at solution');
        } }] }
    ],
    extra: [
      /* ---------- EP Part A: does the point satisfy both? ---------- */
      { num: '1', section: 'Extra practice A — Does the point satisfy both equations?',
        stem: 'Determine whether the given ordered pair is the solution to the system. Substitute into <b>both</b> equations — some of these points sit on one line but not the other.',
        parts: [
          { id: 'e1a', sub: 'a', level: 'BEG', make: function (r) {
            var s = ysys(r, [3, 3, 2], [-2, -2, -1], { xlo: 1, xhi: 4, ylo: -3, yhi: 4, bmax: 9, test: function (s, b1, b2) { return b1 !== 0 && b2 !== 0 && s.y0 !== 0; } }), eqs = [eqY(s.m1, s.b1), eqY(s.m2, s.b2)];
            return verdictMC(r, '(a) ' + ptt(s.P) + ' for ' + t(s.n1) + ' and ' + t(s.n2), eqs, s.P, null, null, 'EP verdict (yes)');
          } },
          { id: 'e1b', sub: 'b', level: 'BEG', make: function (r) {
            var s = pick2(r, function (r) { return { m1: r.pick([1, 1, 2]), b1: r.pick([-1, -1, -2, -3, 1, 2]), m2: r.pick([-2, -2, -1]), x0: r.int(1, 4), d: r.pick([1, -1, 2]) }; },
              function (s) { var y = s.m1 * s.x0 + s.b1; s.y0 = y; s.b2 = y + s.d - s.m2 * s.x0; return y !== 0 && s.b2 > 0 && s.b2 <= 12; });
            var P = [s.x0, s.y0], eqs = [eqY(s.m1, s.b1), eqY(s.m2, s.b2)];
            return verdictMC(r, '(b) ' + ptt(P) + ' for ' + t(eqs[0].tex) + ' and ' + t(eqs[1].tex), eqs, P, null, null, 'EP verdict (first only)');
          } },
          { id: 'e1c', sub: 'c', level: 'EMG', make: function (r) {
            var s = pick2(r, function (r) { return { a: r.pick([2, 2, 3]), x0: r.int(-3, -1), y0: r.int(2, 6), b2: r.int(1, 6), m2: r.pick([-1, -1, 1]) }; },
              function (s) { var c = s.a * s.x0 + s.y0; s.c = c; var v2 = s.m2 * s.x0 + s.b2; return c !== 0 && Math.abs(c) <= 9 && v2 !== s.y0 && Math.abs(v2 - s.y0) <= 3; });
            var P = [s.x0, s.y0], eqs = [eqG([[s.a, 'x'], [1, 'y']], s.c), eqY(s.m2, s.b2)];
            return verdictMC(r, '(c) ' + ptt(P) + ' for ' + t(eqs[0].tex) + ' and ' + t(eqs[1].tex), eqs, P, null, null, 'EP verdict (standard form, first only)');
          } }] },
      { num: '2', stem: 'Determine whether the given ordered pair is the solution to the system. Both equations are in standard form, so substitute directly — there is no need to rearrange.',
        parts: [
          { id: 'e2a', sub: 'a', level: 'BEG', make: function (r) {
            var s = pick2(r, function (r) { return { a: r.pick([3, 3, 2, 4]), b: r.pick([2, 2, 1, 3]), x0: r.int(2, 5), y0: r.int(-4, -1) }; }, function (s) { s.c1 = s.a * s.x0 + s.b * s.y0; return s.c1 > 0 && gcd(s.a, s.b) === 1; });
            var P = [s.x0, s.y0], eqs = [eqG([[s.a, 'x'], [s.b, 'y']], s.c1), eqG([[1, 'x'], [-1, 'y']], s.x0 - s.y0)];
            return verdictMC(r, '(a) ' + ptt(P) + ' for ' + t(eqs[0].tex) + ' and ' + t(eqs[1].tex), eqs, P, null, null, 'EP verdict standard (yes)');
          } },
          { id: 'e2b', sub: 'b', level: 'EMG', make: function (r) {
            var s = pick2(r, function (r) { return { a1: r.pick([2, 2, 3]), a2: r.pick([5, 5, 4, 2]), b2: r.pick([3, 3, 2]), x0: r.int(-3, -1), y0: r.int(-5, -1) }; }, function (s) { s.c1 = s.a1 * s.x0 - s.y0; s.c2 = s.a2 * s.x0 + s.b2 * s.y0; return s.c1 !== 0 && gcd(s.a2, s.b2) === 1; });
            var P = [s.x0, s.y0], eqs = [eqG([[s.a1, 'x'], [-1, 'y']], s.c1), eqG([[s.a2, 'x'], [s.b2, 'y']], s.c2)];
            return verdictMC(r, '(b) ' + ptt(P) + ' for ' + t(eqs[0].tex) + ' and ' + t(eqs[1].tex), eqs, P, null, null, 'EP verdict standard negatives (yes)');
          } },
          { id: 'e2c', sub: 'c', level: 'BEG', make: function (r) {
            var s = pick2(r, function (r) { return { b1: r.pick([4, 4, 3, 2]), a2: r.pick([3, 3, 2]), b2: r.pick([2, 2, 1]), x0: r.int(2, 6), y0: r.int(1, 3), d: r.pick([1, 1, -1, 2]) }; }, function (s) { s.c1 = s.x0 + s.b1 * s.y0; s.c2 = s.a2 * s.x0 - s.b2 * s.y0 - s.d; return s.c2 > 0; });
            var P = [s.x0, s.y0], eqs = [eqG([[1, 'x'], [s.b1, 'y']], s.c1), eqG([[s.a2, 'x'], [-s.b2, 'y']], s.c2)];
            return verdictMC(r, '(c) ' + ptt(P) + ' for ' + t(eqs[0].tex) + ' and ' + t(eqs[1].tex), eqs, P, null, null, 'EP verdict standard (first only)');
          } }] },
      { num: '3', parts: [
        { id: 'e3', level: 'EMG', make: function (r) {
          var s = pick2(r, function (r) { return { a: r.pick([2, 2, 3, 1]), m: r.pick([1, 1, 2]), x0: r.int(1, 4), y0: r.int(-2, 3), d: r.pick([-2, -1, 1, 2]), e: r.pick([1, -1, 2]) }; },
            function (s) { s.c = s.a * s.x0 + s.y0; s.b = s.y0 - s.m * s.x0; return s.c > 0 && s.b !== 0 && s.m !== -s.a; });
          var e1 = eqG([[s.a, 'x'], [1, 'y']], s.c), e2 = eqY(s.m, s.b), P = [s.x0, s.y0], Q = [s.x0 + s.d, s.y0 + s.m * s.d], R = [s.x0 + s.e, s.y0 - s.a * s.e];
          var pts = r.shuffle([{ id: 'sol', p: P, w: 'both' }, { id: 'q', p: Q, w: 'two' }, { id: 'r', p: R, w: 'one' }]), want = {};
          pts.forEach(function (o) { want[o.id] = o.w; });
          var byId = {}; pts.forEach(function (o) { byId[o.id] = o.p; });
          return K.P.grid('Exactly one of these three points is the solution to the system ' + t(e1.tex) + ' and ' + t(e2.tex) + '. Test each point in both equations, then choose what each point satisfies.',
            pts.map(function (o) { return { id: o.id, html: ptt(o.p) }; }), [{ id: 'both', html: 'both — the solution' }, { id: 'one', html: 'only ' + t(e1.tex) }, { id: 'two', html: 'only ' + t(e2.tex) }], want,
            { why: function (row) { return { code: 'row', hint: 'Check ' + ptt(byId[row]) + ' again:<br>' + evLines([e1, e2], byId[row]) }; } },
            pts.map(function (o) { return ptt(o.p) + ':<br>' + evLines([e1, e2], o.p); }).join('<br>') + '<br>So ' + ptt(P) + ' is the solution; ' + ptt(R) + ' is on ' + t(e1.tex) + ' only and ' + ptt(Q) + ' is on ' + t(e2.tex) + ' only.',
            ['Substitute each point into both equations. Put negative values in brackets.'], 'which point solves (grid)');
        } }] },
      /* ---------- EP Part B: solving by graphing ---------- */
      { num: '4', section: 'Extra practice B — Solving by graphing',
        stem: 'Graph both lines of each system by hand, then state the solution as an ordered pair. Each system has a <b>fractional slope</b>, so count the rise and the run one square at a time.',
        shared: function (r) {
          return { a: ysys(r, [[1, 2], [1, 2], [-1, 2], [1, 3]], [-1, -1, 1, -2], { test: function (s) { return Math.abs(s.x0) % (Array.isArray(s.m1) ? s.m1[1] : 1) === 0; } }),
            b: ysys(r, [[2, 3], [2, 3], [1, 3], [-2, 3]], [[-1, 3], [-1, 3], [1, 3], [-2, 3]], { ylo: -3, yhi: 3 }) };
        },
        parts: [].concat.apply([], ['a', 'b'].map(function (k) {
          return [
            { id: 'e4' + k, sub: k + ' graph', level: 'PRG', make: function (r, sh) { var s = sh[k]; return sysGraph('(' + k + ') ' + t(s.n1) + ' and ' + t(s.n2) + '<br>Graph both lines.', [s.L1, s.L2], [s.n1, s.n2], W6, {}, graphSol([s.n1, s.n2], [s.m1, s.m2], [s.b1, s.b2], s.P), ['A slope of ' + t(nT(s.m1)) + ' means ' + stepT(s.m1) + ': count one square at a time.', 'Put arrows on both ends of each line.'], 'graph fraction slopes'); } },
            { id: 'e4' + k + '2', sub: k + ' solution', level: 'EMG', make: function (r, sh) { var s = sh[k]; return pointPart('(' + k + ') ' + t(s.n1) + ' and ' + t(s.n2) + '<br>State the solution.', s.P, [s.L1, s.L2], {}, 'The lines cross at ' + ptt(s.P) + '.<br>Check: ' + t(subT([[s.m1, 'x'], [s.b1, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓ and ' + t(subT([[s.m2, 'x'], [s.b2, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓', ['Where do your two lines cross?'], 'solution, fraction slopes'); } }];
        })) },
      { num: '5', stem: 'In each system <b>both</b> equations must be rewritten in slope–intercept form before you can graph them. Rewrite each one, graph both lines, and state the solution.',
        shared: function (r) {
          var a = pick2(r, function (r) { return { a1: r.pick([2, 2, 1, 3]), a2: r.pick([3, 3, 1, 2]), x0: r.int(-3, 4), y0: r.int(-4, 4) }; }, function (s) { s.c1 = s.a1 * s.x0 + s.y0; s.c2 = s.a2 * s.x0 - s.y0; return s.c1 !== 0 && s.c2 !== 0 && Math.abs(s.c1) <= 6 && Math.abs(s.c2) <= 6 && latS(line(s.a1, 1, -s.c1), W6).length >= 2 && latS(line(s.a2, -1, -s.c2), W6).length >= 2; });
          a.P = [a.x0, a.y0]; a.L1 = line(a.a1, 1, -a.c1); a.L2 = line(a.a2, -1, -a.c2); a.g1 = eqT([[a.a1, 'x'], [1, 'y']], a.c1); a.g2 = eqT([[a.a2, 'x'], [-1, 'y']], a.c2);
          a.ms = [-a.a1, a.a2]; a.bs = [a.c1, -a.c2];
          a.wr = [[{ is: mbL(a.a1, a.c1), code: 'u8-neg', hint: 'Moving ' + t(T([[a.a1, 'x']])) + ' to the other side changes its sign.' }], [{ is: mbL(a.a2, a.c2), code: 'u8-neg', hint: 'Divide <b>every</b> term by ' + t('-1') + ' — the constant changes sign too.' }, { is: mbL(-a.a2, a.c2), code: 'u8-neg', hint: 'From ' + t('-y=' + T([[-a.a2, 'x'], [a.c2, '']])) + ', divide <b>every</b> term by ' + t('-1') + '.' }]];
          var b = pick2(r, function (r) { return { a: r.pick([3, 3, 1]), x0: r.pick([-4, -2, 0, 0, 2, 4]), y0: r.int(-3, 5) }; }, function (s) { s.c = s.a * s.x0 + 2 * s.y0; s.d = s.x0 - s.y0; return s.c !== 0 && s.d !== 0 && Math.abs(s.c / 2) <= 6 && Math.abs(s.d) <= 6 && latS(line(s.a, 2, -s.c), W6).length >= 2; });
          b.P = [b.x0, b.y0]; b.L1 = line(b.a, 2, -b.c); b.L2 = line(1, -1, -b.d); b.g1 = eqT([[b.a, 'x'], [2, 'y']], b.c); b.g2 = eqT([[1, 'x'], [-1, 'y']], b.d);
          b.ms = [[-b.a, 2], 1]; b.bs = [b.c / 2, -b.d];
          b.wr = [[{ is: mbL(-b.a, b.c / 2), code: 'u8-nodiv', hint: 'Divide <b>every</b> term by ' + t(2) + ' — the ' + t('x') + '-term too.' }, { is: mbL([-b.a, 2], b.c), code: 'u8-nodiv', hint: 'Divide <b>every</b> term by ' + t(2) + ' — the constant ' + t(b.c) + ' too.' }], [{ is: mbL(1, b.d), code: 'u8-neg', hint: 'Divide <b>every</b> term by ' + t('-1') + ' — the constant changes sign too.' }, { is: mbL(-1, b.d), code: 'u8-neg', hint: 'From ' + t('-y=-x' + (b.d < 0 ? '' : '+') + b.d) + ', divide <b>every</b> term by ' + t('-1') + '.' }]];
          [a, b].forEach(function (s) { s.n1 = si(s.L1); s.n2 = si(s.L2); });
          return { a: a, b: b };
        },
        parts: [].concat.apply([], ['a', 'b'].map(function (k) {
          return [
            { id: 'e5' + k, sub: k + ' rewrite', level: 'EMG', outcome: 'RF6', make: function (r, s0) { var s = s0[k]; return twoEq('(' + k + ') ' + t(s.g1) + ' and ' + t(s.g2) + '<br>Rewrite each equation in slope–intercept form.', [s.L1, s.L2], [t(s.g1) + ':', t(s.g2) + ':'], { form: 'slope-intercept', wrong: s.wr },
              t(s.g1) + ' → ' + t(s.n1) + '.<br>' + t(s.g2) + ' → ' + t('-y=' + T([[-1, 'x'], [s.d != null ? s.d : s.c2, '']]).replace(/^-x/, s.d != null ? '-x' : '-' + (s.a2 === 1 ? '' : s.a2) + 'x')) + ' → ' + t(s.n2) + '.', ['Get ' + t('y') + ' by itself, then divide <b>every</b> term by its coefficient.'], 'rewrite both, standard form'); } },
            { id: 'e5' + k + '2', sub: k + ' graph', level: 'PRG', make: function (r, s0) { var s = s0[k]; return sysGraph('(' + k + ') ' + t(s.g1) + ' and ' + t(s.g2) + '<br>Graph both lines.', [s.L1, s.L2], [s.g1, s.g2], W6, {}, graphSol([s.n1, s.n2], s.ms, s.bs, s.P), ['Use your slope–intercept forms.'].concat(GH), 'graph two rewritten'); } },
            { id: 'e5' + k + '3', sub: k + ' solution', level: 'EMG', make: function (r, s0) { var s = s0[k]; return pointPart('(' + k + ') ' + t(s.g1) + ' and ' + t(s.g2) + '<br>State the solution.', s.P, [s.L1, s.L2], {}, 'The lines cross at ' + ptt(s.P) + '.<br>Check: ' + evLines([eqG([[s.L1.A, 'x'], [s.L1.B, 'y']], -s.L1.C), eqG([[s.L2.A, 'x'], [s.L2.B, 'y']], -s.L2.C)], s.P), ['Where do your two lines cross?'], 'solution rewritten system'); } }];
        })) },
      { num: '6', stem: 'A line of the form ' + t('x=a') + ' is vertical and a line of the form ' + t('y=b') + ' is horizontal. Graph each system and state the solution — no slope counting is needed, but read the two equations carefully before you draw.',
        shared: function (r) {
          var h = r.pick([-5, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), k = r.pick([3, 3, -4, -3, -2, -1, 1, 2, 4, 5]), h2 = r.pick([3, 3, -3, -2, 2, 4, -4, 1, 5]), k2 = r.pick([-4, -4, -3, -2, 2, 3, 4, 1, -1]), A = r.pick([3, 3, 2, 4]), B = r.pick([2, 2, 3, 5]);
          if (h2 === k2) k2 = -k2;
          return { a: { h: h, k: k, n1: 'x=' + h, n2: 'y=' + k, L1: line(1, 0, -h), L2: line(0, 1, -k), P: [h, k] },
            b: { h: h2, k: k2, A: A, B: B, n1: A + 'x=' + (A * h2), n2: B + 'y=' + (B * k2), L1: line(1, 0, -h2), L2: line(0, 1, -k2), P: [h2, k2] } };
        },
        parts: [
          { id: 'e6a', sub: 'a graph', level: 'BEG', make: function (r, sh) { var s = sh.a; return sysGraph('(a) ' + t(s.n1) + ' and ' + t(s.n2) + '<br>Graph both lines.', [s.L1, s.L2], [s.n1, s.n2], W6, {}, t(s.n1) + ' is the vertical line through ' + ptt([s.h, 0]) + ' (every point has ' + t('x=' + s.h) + ').<br>' + t(s.n2) + ' is the horizontal line through ' + ptt([0, s.k]) + ' (every point has ' + t('y=' + s.k) + ').<br>They cross at ' + ptt(s.P) + '.', [t('x=a') + ': every point has the same ' + t('x') + '-value — a vertical line.', t('y=b') + ': every point has the same ' + t('y') + '-value — a horizontal line.'], 'graph x=a, y=b'); } },
          { id: 'e6a2', sub: 'a solution', level: 'BEG', make: function (r, sh) { var s = sh.a; return pointPart('(a) ' + t(s.n1) + ' and ' + t(s.n2) + '<br>State the solution.', s.P, [s.L1, s.L2], {}, 'The vertical line ' + t(s.n1) + ' and the horizontal line ' + t(s.n2) + ' cross at ' + ptt(s.P) + '.', ['The point has ' + t('x=' + s.h) + ' and ' + t('y=' + s.k) + '.'], 'solution x=a, y=b'); } },
          { id: 'e6b', sub: 'b graph', level: 'EMG', make: function (r, sh) { var s = sh.b; return sysGraph('(b) ' + t(s.n1) + ' and ' + t(s.n2) + '<br>Graph both lines.', [s.L1, s.L2], [s.n1, s.n2], W6, {}, 'Divide: ' + t(s.n1) + ' is ' + t('x=' + s.h) + ', a vertical line; ' + t(s.n2) + ' is ' + t('y=' + s.k) + ', a horizontal line.<br>They cross at ' + ptt(s.P) + '.', ['Divide each equation by its coefficient first: ' + t(s.n1) + ' gives ' + t('x=\\ ?') + '.'], 'graph ax=c, by=d'); } },
          { id: 'e6b2', sub: 'b solution', level: 'BEG', make: function (r, sh) { var s = sh.b; return pointPart('(b) ' + t(s.n1) + ' and ' + t(s.n2) + '<br>State the solution.', s.P, [s.L1, s.L2], { wrong: [{ is: [s.A * s.h, s.B * s.k], code: 'u8-nodiv', hint: 'Divide first: ' + t(s.n1) + ' means ' + t('x=' + s.h) + '.' }] }, t(s.n1) + ' gives ' + t('x=' + s.h) + ' and ' + t(s.n2) + ' gives ' + t('y=' + s.k) + ', so the lines cross at ' + ptt(s.P) + '.', ['Divide each equation by its coefficient.'], 'solution ax=c, by=d'); } }] },
      { num: '7', stem: function (s) { return 'Consider the system ' + t(s.g1) + ' and ' + t(s.g2) + '. Rewrite each equation in slope–intercept form, graph both lines, state the solution, and then check it in both original equations.'; },
        shared: function (r) {
          var s = pick2(r, function (r) { var b1 = r.pick([3, 3, 2]); return { b1: b1, a2: r.pick([2, 2, 1, 3]), x0: r.pick(b1 === 3 ? [3, 3, -3, 0] : [2, 4, -2, 0]), y0: r.int(-3, 4) }; },
            function (s) { s.c1 = s.x0 + s.b1 * s.y0; s.c2 = s.a2 * s.x0 - s.y0; return s.c1 !== 0 && s.c2 !== 0 && Math.abs(s.c1 / s.b1) <= 6 && Math.abs(s.c2) <= 6 && latS(line(1, s.b1, -s.c1), W6).length >= 2 && latS(line(s.a2, -1, -s.c2), W6).length >= 2; });
          s.P = [s.x0, s.y0]; s.L1 = line(1, s.b1, -s.c1); s.L2 = line(s.a2, -1, -s.c2); s.g1 = eqT([[1, 'x'], [s.b1, 'y']], s.c1); s.g2 = eqT([[s.a2, 'x'], [-1, 'y']], s.c2); s.n1 = si(s.L1); s.n2 = si(s.L2);
          s.eqs = [eqG([[1, 'x'], [s.b1, 'y']], s.c1), eqG([[s.a2, 'x'], [-1, 'y']], s.c2)];
          return s;
        },
        parts: [
          { id: 'e7a', sub: 'rewrite', level: 'EMG', outcome: 'RF6', make: function (r, s) {
            return twoEq('Rewrite each equation in slope–intercept form.', [s.L1, s.L2], [t(s.g1) + ':', t(s.g2) + ':'], { form: 'slope-intercept', wrong: [[{ is: mbL(-1, s.c1 / s.b1), code: 'u8-nodiv', hint: 'Divide <b>every</b> term by ' + t(s.b1) + ' — the ' + t('x') + '-term too.' }, { is: mbL([-1, s.b1], s.c1), code: 'u8-nodiv', hint: 'Divide <b>every</b> term by ' + t(s.b1) + ' — the constant too.' }], [{ is: mbL(s.a2, s.c2), code: 'u8-neg', hint: 'Divide <b>every</b> term by ' + t('-1') + ' — the constant changes sign too.' }, { is: mbL(-s.a2, s.c2), code: 'u8-neg', hint: 'From ' + t('-y=' + T([[-s.a2, 'x'], [s.c2, '']])) + ', divide <b>every</b> term by ' + t('-1') + '.' }]] },
              t(s.g1) + ' → ' + t(s.b1 + 'y=' + T([[-1, 'x'], [s.c1, '']])) + ' → ' + t(s.n1) + '.<br>' + t(s.g2) + ' → ' + t('-y=' + T([[-s.a2, 'x'], [s.c2, '']])) + ' → ' + t(s.n2) + '.', ['Get ' + t('y') + ' by itself, then divide <b>every</b> term by its coefficient.'], 'rewrite both');
          } },
          { id: 'e7b', sub: 'graph', level: 'PRG', make: function (r, s) { return sysGraph('Graph both lines.', [s.L1, s.L2], [s.g1, s.g2], W6, {}, graphSol([s.n1, s.n2], [[-1, s.b1], s.a2], [s.c1 / s.b1, -s.c2], s.P), ['Use your slope–intercept forms.'].concat(GH), 'graph rewritten system'); } },
          { id: 'e7c', sub: 'solution', level: 'EMG', make: function (r, s) { return pointPart('State the solution.', s.P, [s.L1, s.L2], {}, 'The lines cross at ' + ptt(s.P) + '.', ['Where do your two lines cross?'], 'solution'); } },
          { id: 'e7d', sub: 'check', level: 'BEG', make: function (r, s) { return subFields('Check ' + ptt(s.P) + ' in both <b>original</b> equations: work out the value of each expression.', s.eqs, s.P, evLines(s.eqs, s.P) + '<br>Both are true, so ' + ptt(s.P) + ' is confirmed.', ['Substitute both coordinates into each original equation.'], 'check in originals'); } }] },
      { num: '8', stem: function (s) { return 'Consider the system ' + t(s.n1) + ' and ' + t(s.g2) + '. Rewrite where needed, graph both lines, state the solution, and then check it in both original equations.'; },
        shared: function (r) {
          var s = pick2(r, function (r) { return { m1: r.pick([-3, -3, -2]), d: r.pick([3, 3, 1, 2, 4, -1, -2]), x0: r.int(-1, 3) }; },
            function (s) { s.y0 = s.x0 - s.d; s.b1 = s.y0 - s.m1 * s.x0; return Math.abs(s.y0) <= 5 && s.b1 !== 0 && Math.abs(s.b1) <= 6 && s.x0 !== 0; });
          s.P = [s.x0, s.y0]; s.L1 = mbL(s.m1, s.b1); s.L2 = line(1, -1, -s.d); s.n1 = yT(s.m1, s.b1); s.g2 = eqT([[1, 'x'], [-1, 'y']], s.d); s.n2 = si(s.L2);
          s.eqs = [eqY(s.m1, s.b1), eqG([[1, 'x'], [-1, 'y']], s.d)];
          return s;
        },
        parts: [
          { id: 'e8a', sub: 'rewrite', level: 'BEG', outcome: 'RF6', make: function (r, s) { return rewritePart('Rewrite ' + t(s.g2) + ' in slope–intercept form.', 1, -1, s.d); } },
          { id: 'e8b', sub: 'graph', level: 'EMG', make: function (r, s) { return sysGraph('Graph both lines.', [s.L1, s.L2], [s.n1, s.g2], W6, {}, t(s.g2) + ' is ' + t(s.n2) + '.<br>' + graphSol([s.n1, s.n2], [s.m1, 1], [s.b1, -s.d], s.P), GH, 'graph system'); } },
          { id: 'e8c', sub: 'solution', level: 'BEG', make: function (r, s) { return pointPart('State the solution.', s.P, [s.L1, s.L2], {}, 'The lines cross at ' + ptt(s.P) + '.', ['Where do your two lines cross?'], 'solution'); } },
          { id: 'e8d', sub: 'check', level: 'BEG', make: function (r, s) { return subFields('Check ' + ptt(s.P) + ' in both <b>original</b> equations: work out the value of each expression.', s.eqs, s.P, evLines(s.eqs, s.P) + '<br>Both are true, so ' + ptt(s.P) + ' is confirmed.', ['Substitute into the original equations.'], 'check in originals'); } }] },
      { num: '9', shared: function (r) { var s = ysys(r, [[1, 4], [1, 4], [-1, 4], [1, 3]], [-1, -1, 1, -2], { test: function (s, b1) { var q = s.m1[1]; return s.x0 !== 0 && s.x0 % q === 0 && Math.abs(b1) <= 4; } }); s.eqs = [eqY(s.m1, s.b1), eqY(s.m2, s.b2)]; return s; },
        stem: function (s) { return 'Consider the system ' + t(s.n1) + ' and ' + t(s.n2) + '.'; },
        parts: [
          { id: 'e9a', sub: 'a', level: 'EMG', make: function (r, s) {
            var p = s.m1[0], q = s.m1[1], B = [0, s.b1], L = s.L1;
            var rd = function (x) { var rp = Ln.readPoint(x); return rp.kind === 'pt' ? [rp.p[0].v, rp.p[1].v] : null; };
            var check = function (resp) {
              resp = resp || []; var a = String(resp[0] || '').trim(), b = String(resp[1] || '').trim();
              if (!a && !b) return form('empty', 'Write two points.');
              if (!a || !b) return form('sys-one', 'Write a point in <b>each</b> box.');
              var A = rd(a), Bp = rd(b);
              if (!A || !Bp) return form('pt-unreadable', 'Write each point as an ordered pair, e.g. ' + t('(4,\\ 4)') + '.');
              var Q = [A, Bp];
              for (var i = 0; i < 2; i++) {
                if (!onL(L, Q[i])) return wrong('u8l1-pts-off', ptt(Q[i]) + ' is not on the line: ' + t(subT([[s.m1, 'x'], [s.b1, '']], { x: Q[i][0] }) + '=' + nT(fv(s.m1) * Q[i][0] + s.b1)) + ', not ' + t(nT(Q[i][1])) + '. From ' + ptt(B) + ' go ' + stepT(s.m1) + '.');
                if (samePt(Q[i], B)) return wrong('u8l1-pts-int', ptt(B) + ' is the ' + t('y') + '-intercept you start from. Step from it to find two <b>more</b> points.');
              }
              if (samePt(Q[0], Q[1])) return wrong('u8l1-pts-same', 'Your two points are the same. Step once more to get a second point.');
              return ok();
            };
            var k1 = '(' + q + ', ' + (s.b1 + p) + ')', k2 = '(' + (-q) + ', ' + (s.b1 - p) + ')';
            return { prompt: 'The first line ' + (p > 0 ? 'rises' : 'falls') + ' only ' + t(Math.abs(p)) + ' square for every ' + t(q) + ' squares to the right. Starting at its ' + t('y') + '-intercept, list two more points on that line.',
              input: { type: 'fields', fields: [{ label: 'Point 1:', mode: 'math', keys: 'point', placeholder: ' ' }, { label: 'Point 2:', mode: 'math', keys: 'point', placeholder: ' ' }] },
              check: check, key: [k1, k2], answer: ptt([q, s.b1 + p]) + ' and ' + ptt([-q, s.b1 - p]) + ' (or any other points of the line, e.g. ' + ptt([2 * q, s.b1 + 2 * p]) + ')',
              solution: 'Start at the ' + t('y') + '-intercept ' + ptt(B) + '. Go ' + stepT(s.m1) + ': ' + ptt([q, s.b1 + p]) + '. Going the other way (' + (p > 0 ? 'down ' : 'up ') + Math.abs(p) + ', left ' + q + '): ' + ptt([-q, s.b1 - p]) + '. (Also ' + ptt([2 * q, s.b1 + 2 * p]) + ', …)',
              hints: ['Start at ' + ptt(B) + ' and step ' + stepT(s.m1) + '.'], text: 'two more points from slope', good: [['(' + 2 * q + ', ' + (s.b1 + 2 * p) + ')', k1]], bad: [[k1, k1], ['(0, ' + s.b1 + ')', k1], ['(' + p + ', ' + (s.b1 + q) + ')', k2]] };
          } },
          { id: 'e9b', sub: 'b graph', level: 'PRG', make: function (r, s) { return sysGraph('Graph both lines.', [s.L1, s.L2], [s.n1, s.n2], W6, {}, graphSol([s.n1, s.n2], [s.m1, s.m2], [s.b1, s.b2], s.P), ['Use the points from part (a) for the first line.'].concat(GH), 'graph quarter slope'); } },
          { id: 'e9c', sub: 'b solution', level: 'EMG', make: function (r, s) { return pointPart('State the solution.', s.P, [s.L1, s.L2], {}, 'The lines cross at ' + ptt(s.P) + '.', ['Where do your two lines cross?'], 'solution'); } },
          { id: 'e9d', sub: 'c', level: 'BEG', make: function (r, s) { return subFields('Verify your solution in both equations: work out the value of each right side.', s.eqs, s.P, evLines(s.eqs, s.P) + '<br>Both are true, so ' + ptt(s.P) + ' is the solution.', ['A quarter of a multiple of 4 is a whole number.'], 'verify fraction slope'); } }] },
      /* ---------- EP Part C: reading a graph, finding the error ---------- */
      { num: '10', section: 'Extra practice C — Reading a graph, and finding the error',
        shared: function (r) { var s = ysys(r, [3, 3, 2], [-1, -1, -2], { test: function (s, b1) { return s.x0 !== 0 && s.x0 !== s.y0 && b1 !== 0; } }); s.eqs = [eqY(s.m1, s.b1), eqY(s.m2, s.b2)]; return s; },
        stem: function (s) { return 'The system ' + t(s.n1) + ' (blue, solid) and ' + t(s.n2) + ' (red, dashed) is graphed below.' + sysFig([s.L1, s.L2], W6); },
        parts: [
          { id: 'e10a', sub: 'a', level: 'BEG', make: function (r, s) { return pointPart('State the point of intersection as an ordered pair.', s.P, [s.L1, s.L2], {}, 'The lines cross at ' + ptt(s.P) + '.', ['Go across to the crossing point first, then up or down.'], 'read intersection'); } },
          { id: 'e10b', sub: 'b, c', level: 'BEG', make: function (r, s) { return subFields('Substitute ' + t('x=' + s.x0) + ' into the right side of each equation.', s.eqs, s.P, evLines(s.eqs, s.P), ['Replace ' + t('x') + ' with ' + t(s.x0) + '.'], 'substitute read point'); } },
          { id: 'e10c', sub: 'd', level: 'LIM', make: function (r, s) {
            return mc(r, 'Both substitutions give ' + t('y=' + s.y0) + '. What do they confirm together?', [
              { html: ptt(s.P) + ' is on <b>both</b> lines, so it satisfies both equations: it is the solution to the system.', right: true },
              { html: 'Only that ' + ptt(s.P) + ' is on the solid line.', why: 'The second substitution put it on the dashed line too.', code: 'one' },
              { html: 'That the two lines have the same slope.', why: 'The slopes are ' + t(nT(s.m1)) + ' and ' + t(nT(s.m2)) + ' — different. The substitutions are about the point, not the slopes.', code: 'slope' },
              { html: 'Nothing yet: the point must also be checked in a third equation.', why: 'This system has only two equations. A point that makes both true is the solution.', code: 'third' }],
              'Each substitution shows the point is on one of the lines. Together: ' + ptt(s.P) + ' is on both lines, so it satisfies both equations — it is the solution of the system.', ['What does a true substitution tell you about the point and that line?'], 'meaning of two checks');
          } }] },
      { num: '11', shared: function (r) {
          var s = ysys(r, [1, 1, 2], [-1, -1, -2], { xlo: -2, xhi: 3, ylo: -2, yhi: 3, test: function (s) { return s.x0 !== 0; } });
          s.dir = r.pick([1, 1, -1]); s.D = [s.x0 + s.dir, s.y0 + s.dir * s.m1]; s.eqs = [eqY(s.m1, s.b1), eqY(s.m2, s.b2)];
          return s;
        },
        stem: function (s) { return '<b>Error analysis.</b> Devon graphed the system ' + t(s.n1) + ' (blue, solid) and ' + t(s.n2) + ' (red, dashed) below and wrote the solution as ' + ptt(s.D) + '.' + sysFig([s.L1, s.L2], W6); },
        parts: [
          { id: 'e11a', sub: 'a, b', level: 'BEG', make: function (r, s) { return subFields('Substitute Devon’s ' + t('x=' + s.D[0]) + ' into the right side of each equation.', s.eqs, s.D, evLines(s.eqs, s.D), ['Replace ' + t('x') + ' with ' + t(s.D[0]) + '.'], 'substitute wrong point'); } },
          { id: 'e11b', sub: 'c', level: 'PRG', make: function (r, s) {
            var dd = function (k) { var dx = k, dy = k * s.m1; return Math.abs(dx) + ' square' + (Math.abs(dx) === 1 ? '' : 's') + (dx > 0 ? ' right' : ' left') + ' and ' + Math.abs(dy) + ' square' + (Math.abs(dy) === 1 ? '' : 's') + (dy > 0 ? ' up' : ' down'); };
            return mc(r, 'Devon’s point lies on one of the two lines but not on the other. Which line is it on, and how far off is his reading?', [
              { html: 'On ' + t(s.n1) + ' (solid) only: ' + dd(s.dir) + ' from the crossing point.', right: true },
              { html: 'On ' + t(s.n2) + ' (dashed) only: ' + dd(s.dir) + ' from the crossing point.', why: 'Check your substitutions: ' + t(s.n2) + ' gives ' + t(nT(s.m2 * s.D[0] + s.b2)) + ' at ' + t('x=' + s.D[0]) + ', not ' + t(s.D[1]) + '.', code: 'dashed' },
              { html: 'On both lines, so Devon is right.', why: 'A point on both lines makes both equations true. One of the substitutions failed.', code: 'both' },
              { html: 'On neither line: he misread both coordinates.', why: 'One of the substitutions worked: ' + t(subT([[s.m1, 'x'], [s.b1, '']], { x: s.D[0] }) + '=' + s.D[1]) + '.', code: 'neither' }],
              'In ' + t(s.n1) + ': ' + t(subT([[s.m1, 'x'], [s.b1, '']], { x: s.D[0] }) + '=' + s.D[1]) + ' ✓, so the point is on the solid line. In ' + t(s.n2) + ': ' + t(subT([[s.m2, 'x'], [s.b2, '']], { x: s.D[0] }) + '=' + nT(s.m2 * s.D[0] + s.b2) + '\\ne ' + s.D[1]) + ' ✗.<br>Devon slid along the solid line ' + dd(s.dir) + ' past the crossing point ' + ptt(s.P) + '.',
              ['Which substitution from part (a) worked?'], 'error: slid along a line');
          } },
          { id: 'e11c', sub: 'd', level: 'BEG', make: function (r, s) { return pointPart('State the correct solution.', s.P, [s.L1, s.L2], {}, 'The lines cross at ' + ptt(s.P) + '.<br>Check: ' + evLines(s.eqs, s.P), ['Find the point where the lines really cross, and check it in both equations.'], 'correct solution'); } }] },
      { num: '12', shared: function (r) { return ysys(r, [2, 2, 3, 1], [-1, -1, -2], { xlo: 1, xhi: 4, ylo: 1, yhi: 8, bmax: 12, test: function (s, b1, b2) { return b1 > 0 && b2 > 0; } }); },
        stem: function (s) { return '<b>Error analysis.</b> Priya says ' + ptt([0, s.b1]) + ' is the solution to the system ' + t(s.n1) + ' and ' + t(s.n2) + '. Her work reads: “' + t(s.n1) + ', and ' + t(subT([[s.m1, 'x'], [s.b1, '']], { x: 0 }) + '=' + s.b1) + ' ✓, so ' + ptt([0, s.b1]) + ' is the solution.”'; },
        parts: [
          { id: 'e12a', sub: 'a', level: 'BEG', make: function (r, s) {
            var v = s.b2, e2 = [[s.m2, 'x'], [s.b2, '']];
            return mc(r, 'What step did Priya leave out, and what happens when you carry it out?', [
              { html: 'She never substituted into the second equation: ' + t(subT(e2, { x: 0 }) + '=' + v + '\\ne ' + s.b1) + ', so ' + ptt([0, s.b1]) + ' is <b>not</b> the solution.', right: true },
              { html: 'She should have checked the first equation a second time; it is the solution.', why: 'The first equation was fine. The second was never checked — and it fails.', code: 'again' },
              { html: 'Nothing is missing: one true equation is enough, so ' + ptt([0, s.b1]) + ' is the solution.', why: 'A solution must make <b>both</b> equations true. Try the second one.', code: 'enough' },
              { html: 'She should have substituted ' + t('x=' + s.b1) + ' and ' + t('y=0') + '.', why: 'In ' + ptt([0, s.b1]) + ', ' + t('x=0') + ' and ' + t('y=' + s.b1) + ' — her substitution was the right way round.', code: 'swap' }],
              'In ' + t(s.n2) + ': ' + t(subT(e2, { x: 0 }) + '=' + v + '\\ne ' + s.b1) + ' ✗. The point fails the second equation, so it is not the solution of the system.', ['Which equation did Priya never use?'], 'error: checked one equation');
          } },
          { id: 'e12b', sub: 'b', level: 'PRG', make: function (r, s) {
            return pointPart('Find the correct solution.', s.P, [s.L1, s.L2], { wrong: [{ is: [0, s.b1], code: 'sys-one-eq', hint: 'That is Priya’s point — it fails the second equation.' }] },
              'Make a table of values for both equations:' + tabSol(s.m1, s.b1, s.m2, s.b2, s.x0) + 'At ' + t('x=' + s.x0) + ' both give ' + t('y=' + s.y0) + ': the solution is ' + ptt(s.P) + '. (Graphing both lines gives the same crossing point.)',
              ['Make a table of values for both lines (or graph them) and find where they give the same ' + t('y') + '.'], 'correct solution, off-grid intercept');
          } },
          { id: 'e12c', sub: 'b meaning', level: 'BEG', make: function (r, s) {
            return mc(r, 'What does a point that satisfies only <b>one</b> of the equations, like ' + ptt([0, s.b1]) + ', tell you about the graph?', [
              { html: 'It lies on that one line but not on the other, so it is not where the lines cross.', right: true },
              { html: 'It lies on both lines.', why: 'A point on both lines satisfies both equations.', code: 'both' },
              { html: 'The two lines are parallel.', why: 'The lines here have different slopes (' + t(nT(s.m1)) + ' and ' + t(nT(s.m2)) + '), so they do cross — just not at that point.', code: 'par' },
              { html: 'It is the solution, because it is a ' + t('y') + '-intercept.', why: 'A ' + t('y') + '-intercept is on one line. The solution is the point on both lines.', code: 'yint' }],
              ptt([0, s.b1]) + ' makes ' + t(s.n1) + ' true, so it is on that line; it makes ' + t(s.n2) + ' false, so it is not on the other line. It is not a crossing point, so it is not the solution.', ['Each equation is true exactly for the points on its own line.'], 'meaning of one check');
          } }] },
      /* ---------- EP Part D: working backwards, a context, a stretch ---------- */
      { num: '13', section: 'Extra practice D — Working backwards, a context, and a stretch',
        stem: 'In each system the solution is given but one coefficient is missing. Use the solution — it must satisfy <b>both</b> equations — to find the missing value.',
        parts: [
          { id: 'e13a', sub: 'a', level: 'ADV', make: function (r) {
            var s = pick2(r, function (r) { return { a: r.pick([2, 2, 3, 1]), x0: r.int(2, 4), y0: r.int(-2, 4), m: r.pick([-2, -2, -1, -3, 1, 2]) }; }, function (s) { s.c = s.y0 - s.a * s.x0; s.d = s.y0 - s.m * s.x0; return s.m !== s.a && s.c !== 0 && s.d !== 0 && s.d !== s.c && Math.abs(s.d) <= 12; });
            var mv = (s.y0 + s.d) / s.x0;
            return K.P.number('Find the value of ' + t('m') + ' for which ' + t(yT(s.a, s.c)) + ' and ' + t(T([[1, 'mx'], [s.d, '']]).replace(/^/, 'y=')) + ' have solution ' + ptt([s.x0, s.y0]) + '.', s.m,
              function (v) { if (v === -s.m) return { code: 'u8l1-back-sign', hint: 'Check the sign: ' + t(s.y0 + '=' + s.x0 + 'm' + (s.d < 0 ? '' : '+') + s.d) + ', so ' + t(s.x0 + 'm=' + (s.y0 - s.d)) + '.' }; if (Number.isInteger(mv) && v === mv) return { code: 'u8l1-back-move', hint: 'Moving ' + t(s.d) + ' to the other side changes its sign: subtract it from both sides.' }; return null; },
              'First, ' + ptt([s.x0, s.y0]) + ' satisfies ' + t(yT(s.a, s.c)) + ': ' + t(subT([[s.a, 'x'], [s.c, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓.<br>Then substitute it into the second equation: ' + t(s.y0 + '=m(' + s.x0 + ')' + (s.d < 0 ? '' : '+') + s.d) + ', so ' + t(s.x0 + 'm=' + (s.y0 - s.d)) + ' and ' + t('m=' + s.m) + '.',
              ['Substitute ' + t('x=' + s.x0) + ' and ' + t('y=' + s.y0) + ' into the equation with ' + t('m') + ', then solve for ' + t('m') + '.'], 'find m', { before: t('m=') });
          } },
          { id: 'e13b', sub: 'b', level: 'ADV', make: function (r) {
            var s = pick2(r, function (r) { return { a: r.pick([-1, -1, -2]), x0: r.int(2, 5), y0: r.int(1, 4), k: r.pick([1, 1, 2, 3, -1]) }; }, function (s) { s.c = s.y0 - s.a * s.x0; s.d = s.y0 - s.k * s.x0; return s.k !== s.a && s.c !== 0 && s.d < 0 && s.d >= -12; });
            var kv = (s.y0 + s.d) / s.x0;
            return K.P.number('Find the value of ' + t('k') + ' for which ' + t(yT(s.a, s.c)) + ' and ' + t('y=kx' + (s.d < 0 ? '' : '+') + s.d) + ' have solution ' + ptt([s.x0, s.y0]) + '.', s.k,
              function (v) { if (v === -s.k) return { code: 'u8l1-back-sign', hint: 'Check the sign: ' + t(s.x0 + 'k=' + (s.y0 - s.d)) + '.' }; if (Number.isInteger(kv) && v === kv) return { code: 'u8l1-back-move', hint: 'Moving ' + t(s.d) + ' to the other side changes its sign.' }; return null; },
              'Check ' + ptt([s.x0, s.y0]) + ' in ' + t(yT(s.a, s.c)) + ': ' + t(subT([[s.a, 'x'], [s.c, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓.<br>Then ' + t(s.y0 + '=k(' + s.x0 + ')' + (s.d < 0 ? '' : '+') + s.d) + ', so ' + t(s.x0 + 'k=' + (s.y0 - s.d)) + ' and ' + t('k=' + s.k) + '.',
              ['Substitute the solution into the equation with ' + t('k') + '.'], 'find k', { before: t('k=') });
          } },
          { id: 'e13c', sub: 'c', level: 'ADV', make: function (r) {
            var s = pick2(r, function (r) { return { a: r.pick([3, 3, 2, 4]), b: r.pick([6, 6, 2, 3, 4, 5, -2]), x0: r.int(1, 3), y0: r.pick([1, 1, 2, -1]), e: r.pick([-1, -1, 1, -2]) }; }, function (s) { s.C = s.a * s.x0 + s.b * s.y0; return s.C > 0 && s.x0 + s.e === s.y0; });
            var mv = (s.C + s.a * s.x0) / s.y0;
            return K.P.number('Find the value of ' + t('b') + ' for which ' + t(s.a + 'x+by=' + s.C) + ' and ' + t(yT(1, s.e)) + ' have solution ' + ptt([s.x0, s.y0]) + '.', s.b,
              function (v) { if (v === -s.b) return { code: 'u8l1-back-sign', hint: 'Check the sign: ' + t('b(' + s.y0 + ')=' + s.C + '-' + s.a * s.x0) + '.' }; if (Number.isInteger(mv) && v === mv && mv !== s.b) return { code: 'u8l1-back-move', hint: 'Subtract ' + t(s.a * s.x0) + ' from both sides (don’t add it).' }; if (s.y0 !== 1 && v === s.C - s.a * s.x0) return { code: 'u8-nodiv', hint: 'That is ' + t('b(' + s.y0 + ')') + '. Divide by ' + t(s.y0) + ' to get ' + t('b') + '.' }; return null; },
              'Check ' + ptt([s.x0, s.y0]) + ' in ' + t(yT(1, s.e)) + ': ' + t(subT([[1, 'x'], [s.e, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓.<br>Then ' + t(s.a + '(' + s.x0 + ')+b(' + s.y0 + ')=' + s.C) + ': ' + t(s.a * s.x0 + (s.y0 === 1 ? '+b' : s.y0 === -1 ? '-b' : '+' + s.y0 + 'b') + '=' + s.C) + ', so ' + t('b=' + s.b) + '.',
              ['Substitute ' + t('x=' + s.x0) + ' and ' + t('y=' + s.y0) + ' into the equation with ' + t('b') + '.'], 'find b', { before: t('b=') });
          } },
          { id: 'e13d', sub: 'd', level: 'ADV', make: function (r) {
            var s = pick2(r, function (r) { return { x0: r.int(2, 5), y0: r.int(1, 5), a: r.pick([2, 2, 3, 1, 4]) }; }, function (s) { s.S = s.x0 + s.y0; s.C = s.a * s.x0 - s.y0; return s.C > 0 && s.x0 !== s.y0; });
            var mv = (s.C - s.y0) / s.x0;
            return K.P.number('Find the value of ' + t('a') + ' for which ' + t('x+y=' + s.S) + ' and ' + t('ax-y=' + s.C) + ' have solution ' + ptt([s.x0, s.y0]) + '.', s.a,
              function (v) { if (v === -s.a) return { code: 'u8l1-back-sign', hint: 'Check the sign: ' + t(s.x0 + 'a-' + s.y0 + '=' + s.C) + ', so ' + t(s.x0 + 'a=' + (s.C + s.y0)) + '.' }; if (Number.isInteger(mv) && v === mv && mv !== s.a) return { code: 'u8l1-back-move', hint: 'Add ' + t(s.y0) + ' to both sides (don’t subtract it).' }; return null; },
              'Check ' + ptt([s.x0, s.y0]) + ' in ' + t('x+y=' + s.S) + ': ' + t(s.x0 + '+' + s.y0 + '=' + s.S) + ' ✓.<br>Then ' + t('a(' + s.x0 + ')-' + s.y0 + '=' + s.C) + ', so ' + t(s.x0 + 'a=' + (s.C + s.y0)) + ' and ' + t('a=' + s.a) + '.',
              ['Substitute the solution into ' + t('ax-y=' + s.C) + '.'], 'find a', { before: t('a=') });
          } }] },
      { num: '14', shared: function (r) {
          var o = r.pick([[10, 5, 20], [10, 5, 20], [10, 5, 10], [10, 5, 15], [10, 5, 25], [10, 5, 30], [15, 5, 20], [15, 5, 30], [15, 5, 40], [15, 5, 50], [15, 10, 10], [15, 10, 15], [15, 10, 20], [15, 10, 25],
            [20, 5, 30], [20, 5, 45], [20, 10, 20], [20, 10, 30], [20, 15, 10], [20, 15, 15], [25, 5, 40], [25, 10, 30], [25, 10, 45], [25, 15, 20], [25, 15, 30]]), s = { a: o[0], b: o[1], F: o[2] };
          s.x0 = s.F / (s.a - s.b); s.y0 = s.a * s.x0; s.P = [s.x0, s.y0]; s.LA = line(s.a, -1, 0); s.LB = line(s.b, -1, s.F); s.nA = 'y=' + s.a + 'x'; s.nB = 'y=' + s.F + '+' + s.b + 'x';
          s.v = r.pick([1, 2, 3, 4, 5, 6, 7].filter(function (v) { return v !== s.x0 && Math.abs(v - s.x0) >= 1; })); s.win = [[0, 8], [0, 80]];
          return s;
        },
        stem: function (s) { return 'A climbing gym sells two memberships. Under <b>Plan A</b> each visit costs $' + s.a + ' and there is no monthly fee, so the monthly cost is ' + t(s.nA) + ', where ' + t('x') + ' is the number of visits. Under <b>Plan B</b> there is a $' + s.F + ' monthly fee plus $' + s.b + ' per visit, so ' + t(s.nB) + '.'; },
        parts: [
          { id: 'e14a', sub: 'a', level: 'PRG', make: function (r, s) {
            return sysGraph('Graph both plans. One square across is one visit and one square up is $10. (Tap and drag: the box shows the coordinates; costs snap to $5.)', [s.LA, s.LB], [s.nA, s.nB], s.win,
              { context: true, pad: { grid: 1, gridY: 10, labels: 1, labelsX: 1, labelsY: 10, snapX: 1, snapY: 5, unitX: 34, unitY: 3.4, xName: 'x', yName: 'y', xTitle: 'visits', yTitle: 'cost ($)', firstQuadrant: true, defaultEnd: 'none', max: 330 } },
              'Plan A starts at ' + ptt([0, 0]) + ' and rises $' + s.a + ' per visit: e.g. ' + ptt([2, 2 * s.a]) + '.<br>Plan B starts at ' + ptt([0, s.F]) + ' and rises $' + s.b + ' per visit: e.g. ' + ptt([2, s.F + 2 * s.b]) + '.<br>The lines cross at ' + ptt(s.P) + '.',
              ['Plan A starts at the origin (no fee). Plan B starts at its fee on the cost axis.', 'Find a second point on each line by working out the cost of 2 visits.'], 'graph membership plans');
          } },
          { id: 'e14b', sub: 'b', level: 'EMG', make: function (r, s) {
            return pointPart('State the point of intersection.', s.P, [s.LA, s.LB], {},
              'The lines cross at ' + ptt(s.P) + '.<br>Check: ' + t(s.a + '(' + s.x0 + ')=' + s.y0) + ' ✓ and ' + t(s.F + '+' + s.b + '(' + s.x0 + ')=' + s.y0) + ' ✓',
              ['Read where the two lines cross, then check it in both equations.'], 'gym intersection');
          } },
          { id: 'e14c', sub: 'c', level: 'LIM', make: function (r, s) {
            return mc(r, 'What does the point ' + ptt(s.P) + ' mean for a member of this gym?', [
              { html: 'With ' + s.x0 + ' visits a month, the two plans cost the same: $' + s.y0 + '.', right: true },
              { html: 'With ' + s.y0 + ' visits a month, the two plans cost the same: $' + s.x0 + '.', why: 'The first number is the number of visits ' + t('x') + '; the second is the cost ' + t('y') + '.', code: 'swap' },
              { html: 'Plan B saves $' + s.y0 + ' over Plan A.', why: 'At the crossing point the costs are <b>equal</b>.', code: 'save' },
              { html: 'Plan A is always $' + s.y0 + ' a month.', why: 'Plan A’s cost changes with the number of visits. The point is where the two costs are equal.', code: 'always' }],
              'At ' + ptt(s.P) + ' both equations give the same cost: with ' + s.x0 + ' visits, each plan costs $' + s.y0 + '.', ['What do ' + t('x') + ' and ' + t('y') + ' stand for?'], 'meaning of crossing');
          } },
          { id: 'e14d', sub: 'd', level: 'EMG', make: function (r, s) {
            var A = s.a * s.v, B = s.F + s.b * s.v, Bw = B < A;
            return mc(r, 'Which plan is cheaper for someone who visits ' + s.v + ' times a month?', [
              { html: 'Plan B: $' + B + ', versus $' + A + ' for Plan A', right: Bw, why: Bw ? null : 'Work out both costs: Plan A ' + t(s.a + '(' + s.v + ')=' + A) + ', Plan B ' + t(s.F + '+' + s.b + '(' + s.v + ')=' + B) + '.', code: 'B' },
              { html: 'Plan A: $' + A + ', versus $' + B + ' for Plan B', right: !Bw, why: Bw ? 'Work out both costs: Plan A ' + t(s.a + '(' + s.v + ')=' + A) + ', Plan B ' + t(s.F + '+' + s.b + '(' + s.v + ')=' + B) + '.' : null, code: 'A' },
              { html: 'They cost the same.', why: 'The costs are equal only at ' + s.x0 + ' visits.', code: 'same' },
              Bw ? { html: 'Plan A, because it has no monthly fee', why: 'With many visits the lower cost per visit wins: on the graph, Plan B’s line is lower to the right of ' + t('x=' + s.x0) + '.', code: 'nofee' } : { html: 'Plan B, because it costs less per visit', why: 'With few visits the fee matters more: on the graph, Plan A’s line is lower to the left of ' + t('x=' + s.x0) + '.', code: 'rate' }],
              'At ' + s.v + ' visits: Plan A costs ' + t(s.a + '(' + s.v + ')=' + A) + ' dollars and Plan B costs ' + t(s.F + '+' + s.b + '(' + s.v + ')=' + B) + ' dollars, so <b>Plan ' + (Bw ? 'B' : 'A') + '</b> is cheaper — its line is lower on the graph at ' + t('x=' + s.v) + '. (Plan A is cheaper for fewer than ' + s.x0 + ' visits, Plan B for more.)',
              ['Look at which line is lower at ' + t('x=' + s.v) + ', or work out both costs.'], 'which plan cheaper');
          } }] },
      { num: '15', stem: '<b>Three lines.</b> Three lines pass through a single common point only if the solution of <b>any two</b> of them also satisfies the third. For each trio, find where the first two lines meet, then test that point in the third equation.',
        shared: function (r) {
          var a = ysys(r, [2, 2, 3, 1], [-1, -1, -2], { xlo: 1, xhi: 3, ylo: 1, yhi: 4 }), b = ysys(r, [-2, -2, -1], [1, 1, 2], { xlo: 1, xhi: 4, ylo: -2, yhi: 2 });
          [a, b].forEach(function (s, i) {
            s.m3 = r.pick([1, 3, -3, 2, -1, [1, 2]].filter(function (m) { return fv(m) !== fv(s.m1) && fv(m) !== fv(s.m2) && Number.isInteger(r6(fv(m) * s.x0)); }));
            s.yes = i === 0; s.b3 = r6(s.y0 - fv(s.m3) * s.x0 + (s.yes ? 0 : r.pick([-1, -1, 1, 2])));
            s.n3 = yT(s.m3, s.b3); s.v3 = r6(fv(s.m3) * s.x0 + s.b3);
          });
          return { a: a, b: b };
        },
        parts: [].concat.apply([], ['a', 'b'].map(function (k) {
          return [
            { id: 'e15' + k, sub: k + ' meet', level: 'PRG', make: function (r, sh) { var s = sh[k]; return pointPart('(' + k + ') ' + t(s.n1) + ', \\(\;\\) ' + t(s.n2) + ', \\(\;\\) ' + t(s.n3) + '<br>Where do the first two lines meet?', s.P, [s.L1, s.L2], {}, 'Graph the first two lines (or make a table of values):' + tabSol(s.m1, s.b1, s.m2, s.b2, s.x0) + 'Both give ' + t('y=' + s.y0) + ' at ' + t('x=' + s.x0) + ': they meet at ' + ptt(s.P) + '.', ['Graph the first two lines, or make a table of values for both, and find the point they share.'], 'first two meet'); } },
            { id: 'e15' + k + '2', sub: k + ' third', level: 'PRG', make: function (r, sh) {
              var s = sh[k], sub3 = t(subT([[s.m3, 'x'], [s.b3, '']], { x: s.x0 }) + '=' + nT(s.v3));
              return mc(r, '(' + k + ') ' + t(s.n1) + ', \\(\;\\) ' + t(s.n2) + ', \\(\;\\) ' + t(s.n3) + '<br>The first two lines meet at ' + ptt(s.P) + '. Do all three lines pass through one common point?', [
                { html: '<b>Yes</b> — ' + ptt(s.P) + ' also satisfies ' + t(s.n3) + ': ' + sub3 + ' ✓', right: s.yes, why: 'Substitute again: ' + sub3 + t('\\ne ' + s.y0) + '.', code: 'yes' },
                { html: '<b>No</b> — ' + ptt(s.P) + ' does not satisfy ' + t(s.n3) + ': ' + sub3 + t('\\ne ' + s.y0), right: !s.yes, why: 'Substitute again: ' + sub3 + ', which equals ' + t('y=' + s.y0) + '.', code: 'no' },
                { html: '<b>Yes</b> — the first two lines meet, so all three must meet there.', why: 'The third line only goes through that point if the point satisfies its equation. Test it.', code: 'must' },
                { html: '<b>No</b> — three different lines can never pass through one point.', why: 'They can — every line through ' + ptt(s.P) + ' does. Test the point in the third equation.', code: 'never' }],
                'The only point the first two lines share is ' + ptt(s.P) + '. In ' + t(s.n3) + ': ' + sub3 + (s.yes ? ' ✓, so all three lines pass through ' + ptt(s.P) + '.' : t('\\ne ' + s.y0) + ' ✗, so the third line misses that point: the three lines have <b>no</b> common point.'),
                ['Substitute ' + t('x=' + s.x0) + ' into the third equation. Do you get ' + t('y=' + s.y0) + '?'], 'test in third line', true);
            } }];
        })) },
      { num: '16', parts: [
        { id: 'e16', level: 'MAS', make: function (r) {
          var P = pick2(r, function (r) { return [r.pick([-2, -2, -3, -1, 1, 2, 3, 4, -4]), r.pick([3, 3, -3, -2, -1, 1, 2, 4])]; }, function (P) { return P[0] !== P[1]; });
          var A = mbL(1, P[1] - P[0]), B = mbL(-1, P[1] + P[0]);
          var check = function (resp) {
            resp = resp || []; var a = String(resp[0] || '').trim(), b = String(resp[1] || '').trim();
            if (!a && !b) return form('empty', 'Write both equations.');
            if (!a || !b) return form('sys-one', 'Write an equation in <b>each</b> box.');
            var rs = [Ln.read(a), Ln.read(b)];
            for (var i = 0; i < 2; i++) {
              var rr = rs[i]; if (!rr.ok) return form('line-' + rr.why, 'Equation ' + (i + 1) + ' can’t be read — write it like ' + t('y=2x+1') + '.');
              if (rr.b === 0) return form('line-form-si', 'Equation ' + (i + 1) + ' is a vertical line. Write each equation in the form ' + t('y=mx+b') + '.');
              if (Math.abs(rr.a * P[0] + rr.b * P[1] + rr.c) > 1e-9) { var m = -rr.a / rr.b, bb = -rr.c / rr.b; return wrong('u8-sys-notpt', 'Equation ' + (i + 1) + ' doesn’t pass through ' + ptt(P) + ': at ' + t('x=' + P[0]) + ' it gives ' + t('y=' + nT(r6(m * P[0] + bb))) + ', not ' + t(P[1]) + '. Choose the ' + t('b') + ' that makes ' + t(P[1] + '=m(' + P[0] + ')+b') + ' true.'); }
              var f0 = K.line({ A: rr.a, B: rr.b, C: rr.c }, { form: 'slope-intercept' })([a, b][i]); if (f0.v !== 'correct') return f0;
            }
            if (Math.abs(rs[0].a * rs[1].b - rs[1].a * rs[0].b) < 1e-9) return wrong('u8-sys-same', 'Both lines have the same slope and pass through ' + ptt(P) + ', so they are the <b>same</b> line. Use two different slopes.');
            return ok();
          };
          var k1 = si(A), k2 = si(B);
          return { prompt: 'Write a system of two linear equations, each in the form ' + t('y=mx+b') + ' and with <b>different</b> slopes, whose solution is ' + ptt(P) + '.',
            input: { type: 'fields', fields: [{ label: 'Equation 1:', mode: 'math', keys: 'eq', vars: ['x', 'y'], placeholder: ' ' }, { label: 'Equation 2:', mode: 'math', keys: 'eq', vars: ['x', 'y'], placeholder: ' ' }] },
            check: check, key: [k1, k2], answer: t(k1) + ' and ' + t(k2) + ' (many answers: any two lines with different slopes through ' + ptt(P) + ')',
            solution: 'Pick any two different slopes, e.g. ' + t('1') + ' and ' + t('-1') + '. For each, find ' + t('b') + ' so the line passes through ' + ptt(P) + ':<br>' + t(P[1] + '=1(' + P[0] + ')+b') + ' gives ' + t('b=' + (P[1] - P[0])) + ': ' + t(k1) + '.<br>' + t(P[1] + '=-1(' + P[0] + ')+b') + ' gives ' + t('b=' + (P[1] + P[0])) + ': ' + t(k2) + '.<br>Verify: ' + t(subT([[1, 'x'], [P[1] - P[0], '']], { x: P[0] }) + '=' + P[1]) + ' ✓ and ' + t(subT([[-1, 'x'], [P[1] + P[0], '']], { x: P[0] }) + '=' + P[1]) + ' ✓',
            hints: ['Choose a slope, then find the ' + t('b') + ' that makes the line pass through ' + ptt(P) + '.', 'Do it again with a different slope.'], text: 'write a system with a given solution',
            good: [[si(mbL(2, P[1] - 2 * P[0])), si(mbL(-3, P[1] + 3 * P[0]))], ['y=' + P[1], k1]], bad: [[k1, k1], [k1, si(mbL(-1, P[1] + P[0] + 1))], ['x=' + P[0], k1]] };
        } }] },
      { num: '17', shared: function (r) {
          var s = pick2(r, function (r) { return { b1: r.int(-3, 4), b2: r.int(-1, 6), h: r.int(-5, 1) }; },
            function (s) { if ((s.b1 + s.b2) % 2) return false; var ya = (s.b1 + s.b2) / 2, H = ya - s.h, xl = s.h - s.b1, xr = s.b2 - s.h; return ya <= 5 && H >= 3 && xl >= -6 && xr <= 6 && s.b1 !== s.b2 && s.b1 !== 0 && s.b2 !== 0 && s.h !== 0; });
          s.xa = (s.b2 - s.b1) / 2; s.ya = (s.b1 + s.b2) / 2; s.H = s.ya - s.h; s.A = [s.xa, s.ya]; s.Bl = [s.h - s.b1, s.h]; s.Br = [s.b2 - s.h, s.h];
          s.L = [mbL(1, s.b1), mbL(-1, s.b2), line(0, 1, -s.h)]; s.n = [yT(1, s.b1), yT(-1, s.b2), 'y=' + s.h];
          return s;
        },
        stem: function (s) { return '<b>Stretch.</b> The three lines ' + t(s.n[0]) + ', ' + t(s.n[1]) + ' and ' + t(s.n[2]) + ' taken two at a time form three different systems, and the three solutions are the corners of a triangle.'; },
        parts: [
          { id: 'e17g', sub: 'graph', level: 'PRG', make: function (r, s) {
            return sysGraph('Graph the three lines on the grid.', s.L, s.n, W6, {}, t(s.n[0]) + ': start at ' + ptt([0, s.b1]) + ', up 1, right 1. ' + t(s.n[1]) + ': start at ' + ptt([0, s.b2]) + ', down 1, right 1. ' + t(s.n[2]) + ': the horizontal line through ' + ptt([0, s.h]) + '.<br>The corners are ' + ptt(s.A) + ', ' + ptt(s.Bl) + ' and ' + ptt(s.Br) + '.',
              ['Graph each line from its ' + t('y') + '-intercept and slope; ' + t(s.n[2]) + ' is horizontal.', 'Put arrows on both ends of each line.'], 'graph three lines');
          } },
          { id: 'e17a', sub: 'a', level: 'EMG', make: function (r, s) {
            var pairs = [[0, 1, s.A], [0, 2, s.Bl], [1, 2, s.Br]];
            var fields = pairs.map(function (q) { return { label: t(s.n[q[0]]) + ' and ' + t(s.n[q[1]]) + ':', mode: 'math', keys: 'point', placeholder: ' ' }; });
            var checkers = pairs.map(function (q) { return K.point(q[2], { system: [arr(s.L[q[0]]), arr(s.L[q[1]])] }); });
            var p = K.P.fields('State the three points of intersection.', fields, checkers, pairs.map(function (q) { return pt(q[2]); }), pairs.map(function (q, i) { return fields[i].label + ' ' + ptt(q[2]); }).join('<br>'),
              t(s.n[0]) + ' and ' + t(s.n[1]) + ' cross at ' + ptt(s.A) + ' (check: ' + t(subT([[1, 'x'], [s.b1, '']], { x: s.xa }) + '=' + s.ya) + ' ✓ and ' + t(subT([[-1, 'x'], [s.b2, '']], { x: s.xa }) + '=' + s.ya) + ' ✓).<br>On ' + t(s.n[2]) + ' every point has ' + t('y=' + s.h) + ': ' + t(s.n[0]) + ' reaches it at ' + t('x=' + s.Bl[0]) + ' and ' + t(s.n[1]) + ' at ' + t('x=' + s.Br[0]) + '.<br>Corners: ' + ptt(s.A) + ', ' + ptt(s.Bl) + ', ' + ptt(s.Br) + '.',
              ['Read each crossing point off your graph, and check it in both of its equations.'], 'three intersection points');
            p.bad = [[pt(s.Bl), pt(s.A), pt(s.Br)]];
            return p;
          } },
          { id: 'e17b', sub: 'b', level: 'ADV', make: function (r, s) {
            var base = 2 * s.H;
            return numFields('The horizontal side of the triangle lies along ' + t(s.n[2]) + '. State its length and the height of the triangle above it (in units).', ['Base:', 'Height:'], [base, s.H],
              [function (v) { if (v === Math.abs(s.Br[0]) || v === Math.abs(s.Bl[0])) return { code: 'u8l1-base-ends', hint: 'That is the ' + t('x') + '-value of one end. The length is the distance between the ends: ' + t(s.Br[0] + '-(' + s.Bl[0] + ')') + '.' }; return null; },
                function (v) { if (s.ya !== s.H && v === Math.abs(s.ya)) return { code: 'u8l1-height-apex', hint: 'That is the ' + t('y') + '-value of the top corner. The height is the distance from the base line ' + t(s.n[2]) + ' up to it: ' + t(s.ya + '-(' + s.h + ')') + '.' }; return null; }],
              'Base: from ' + t('x=' + s.Bl[0]) + ' to ' + t('x=' + s.Br[0]) + ' is ' + t(s.Br[0] + '-(' + s.Bl[0] + ')=' + base) + ' units.<br>Height: from ' + t('y=' + s.h) + ' up to the top corner at ' + t('y=' + s.ya) + ' is ' + t(s.ya + '-(' + s.h + ')=' + s.H) + ' units.',
              ['Count the squares between the two bottom corners, and from the base line up to the top corner.'], 'base and height');
          } },
          { id: 'e17c', sub: 'c', level: 'MAS', make: function (r, s) {
            var base = 2 * s.H, A = s.H * s.H;
            return K.P.number('Determine the area of the triangle.', A, function (v) { if (v === base * s.H) return { code: 'ch-no-half', hint: 'A triangle is half of a rectangle: ' + t('A=\\frac{1}{2}bh') + '.' }; return null; },
              t('A=\\frac{1}{2}bh=\\frac{1}{2}(' + base + ')(' + s.H + ')=' + A) + ' square units.', ['Area of a triangle: ' + t('A=\\frac{1}{2}bh') + ', with the base and height from part (b).'], 'triangle area', { after: 'square units' });
          } }] }
    ]
  });
})(window);
