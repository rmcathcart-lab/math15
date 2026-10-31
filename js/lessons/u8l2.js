/* Math 15 · Unit 8 · Lesson 2 — Classifying Systems: One Solution, No Solution, or Infinite Solutions (RF9)
 * Assignment 2 (u8_L02.tex, Questions 1–15) and the Lesson 2 Extra Practice (u8_EP02.tex, Questions 1–17).
 * Every part is a generator: same structure, idea and difficulty as the booklet question (the booklet's numbers are among
 * the possible values), new numbers from the seed. Model: Math 10C u8l1.js (classifying with reasons, the graph pad,
 * the point keypad with its "no solution" / "infinitely many" keys, "write a second equation") and the Math 15 u8l1.js
 * helpers (copied here).
 * Conversions: "state the slopes" -> two number boxes; "graph both lines" -> the graph pad (a line drawn once when both
 * equations are the same line); "state the number of solutions (and the solution)" -> the point keypad; "classify /
 * explain why" -> multiple choice whose options are classifications with reasons; "how can you tell from the graph /
 * from y = mx + b" -> a table of choices; "find k for each case, say which is impossible" -> a table of choices (k = v,
 * every k ≠ v, impossible), then multiple choice for the reason; "write a second equation" -> the equation keypad (any
 * equivalent form accepted); "write an equation for each description" -> two equation boxes.
 * Outcomes: RF9; rewriting an equation in slope–intercept form (no system in it) is RF6, as in Unit 7.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 17(b) (no point on three lines, from the classifications). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, Ln = HW.lines, DR = HW.draw, F = HW.fmt;

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
  function pick2(r, list, test, tries) { for (var g = 0; g < (tries || 600); g++) { var v = list(r); if (test(v)) return v; } throw new Error('u8l2: no parameters found'); }

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
    opt = opt || {}; var isPt = Array.isArray(P);
    var W = (opt.wrong || []).filter(function (w) { return !(isPt && Array.isArray(w.is) && samePt(w.is, P)) && w.is !== P; });
    var p = K.P.point(prompt, P, { system: Ls.map(arr), vars: opt.vars, wrong: W }, sol, hints, text);
    var bad = [];
    if (isPt) { bad.push('no solution'); if (!samePt(P, [P[1], P[0]])) bad.push('(' + pS(P[1]) + ', ' + pS(P[0]) + ')'); p.good = ['x=' + pS(P[0]) + ', y=' + pS(P[1])]; }
    else { bad.push(P === 'none' ? 'infinitely many' : 'no solution', '(0, 0)'); p.good = [P === 'none' ? 'no solution' : 'infinitely many solutions']; }
    W.forEach(function (w) { bad.push(Array.isArray(w.is) ? '(' + pS(w.is[0]) + ', ' + pS(w.is[1]) + ')' : w.is === 'none' ? 'no solution' : 'infinitely many'); });
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
      bad: sameL(Ts[0], Ts[1]) ? [] : [[keys[1], keys[0]]] };
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

  /* ---------- classifying ---------- */
  function slopeOf(Lo) { return fr(-Lo.A, Lo.B); }
  function yInt(Lo) { return fr(-Lo.C, Lo.B); }
  function parL(a, b) { return a.A * b.B === a.B * b.A; }
  function kindOf(L1, L2) { return !parL(L1, L2) ? 'one' : sameL(L1, L2) ? 'inf' : 'none'; }
  function mbTex(Lo) { return { m: fT(slopeOf(Lo)), b: fT(yInt(Lo)) }; }
  function clsD(L1, L2) { var a = mbTex(L1), b = mbTex(L2); return { m1: a.m, m2: b.m, b1: a.b, b2: b.b }; }
  var KIND = { one: '<b>one solution</b>', none: '<b>no solution</b>', inf: '<b>infinitely many solutions</b>' };
  function verdictT(k) { return k === 'one' ? 'Different slopes: the lines cross once — ' + KIND.one + '.' : k === 'none' ? 'Same slope, different ' + t('y') + '-intercepts: parallel lines that never meet — ' + KIND.none + '.' : 'Same slope and same ' + t('y') + '-intercept: the same line — ' + KIND.inf + '.'; }
  function clsSol(L1, L2, n1, n2) {
    var a = mbTex(L1), b = mbTex(L2), k = kindOf(L1, L2), w = function (n, L) { return t(n) + (n === si(L) ? '' : ' → ' + t(si(L))); };
    return w(n1, L1) + ': ' + t('m=' + a.m) + ', ' + t('b=' + a.b) + '.<br>' + w(n2, L2) + ': ' + t('m=' + b.m) + ', ' + t('b=' + b.b) + '.<br>' + verdictT(k);
  }
  /* classify with a reason: kind 'none' | 'one' | 'inf'; d = { m1, m2, b1, b2 } as LaTeX; trap: extra distractor text */
  function classMC(r, prompt, kind, d, sol, hints, text, trap) {
    var O = [];
    if (kind === 'none') O = [
      { html: '<b>No solution</b> — the slopes are equal (' + t(d.m1) + ') but the ' + t('y') + '-intercepts differ (' + t(d.b1) + ' and ' + t(d.b2) + '): parallel lines.', right: true },
      { html: '<b>Infinitely many solutions</b> — the slopes are equal (' + t(d.m1) + ').', why: 'Equal slopes alone don’t make the same line — compare the ' + t('y') + '-intercepts too: ' + t(d.b1) + ' and ' + t(d.b2) + ' differ, so the lines are parallel and never meet.', code: 'cls-inf' },
      { html: '<b>One solution</b> — the ' + t('y') + '-intercepts are different.', why: 'Different intercepts don’t make lines cross. With the <b>same slope</b> ' + t(d.m1) + ', the lines are parallel.', code: 'cls-one' },
      { html: trap || '<b>Infinitely many solutions</b> — one equation is a multiple of the other.', why: 'Check every term, the constant too. The ' + t('y') + '-intercepts ' + t(d.b1) + ' and ' + t(d.b2) + ' differ, so the lines are parallel.', code: 'cls-mult' }];
    else if (kind === 'inf') O = [
      { html: '<b>Infinitely many solutions</b> — the same slope (' + t(d.m1) + ') and the same ' + t('y') + '-intercept (' + t(d.b1) + '): the same line.', right: true },
      { html: '<b>No solution</b> — the slopes are equal (' + t(d.m1) + ').', why: 'Equal slopes means parallel <b>or</b> the same line. Compare the ' + t('y') + '-intercepts: both are ' + t(d.b1) + ', so it is the same line.', code: 'cls-none' },
      { html: '<b>One solution</b> — the two equations look different.', why: 'Rearrange both into ' + t('y=mx+b') + ': they give exactly the same equation, so every point on the line is a solution.', code: 'cls-one' },
      { html: trap || '<b>No solution</b> — the constant terms are different numbers.', why: 'The constants differ only because one equation is a multiple of the other. Compare slopes and ' + t('y') + '-intercepts: both match.', code: 'cls-const' }];
    else O = [
      { html: '<b>One solution</b> — the slopes are different (' + t(d.m1) + ' and ' + t(d.m2) + '): the lines cross once.', right: true },
      { html: '<b>No solution</b> — the lines are parallel.', why: 'Parallel lines have equal slopes. Here the slopes are ' + t(d.m1) + ' and ' + t(d.m2) + ' — different — so the lines cross exactly once.', code: 'cls-none' },
      { html: trap || '<b>Infinitely many solutions</b> — the equations use the same numbers.', why: 'Using the same numbers in different places isn’t the same line. The slopes are ' + t(d.m1) + ' and ' + t(d.m2) + ': different, so one solution.', code: 'cls-inf' },
      { html: '<b>No solution</b> — the ' + t('y') + '-intercepts are ' + (d.b1 === d.b2 ? 'the same' : 'different') + '.', why: 'When the slopes are different the lines cross no matter what the intercepts are: one solution.', code: 'cls-int' }];
    return mc(r, prompt, O, sol, hints, text);
  }
  function clsPart(r, prompt, L1, L2, n1, n2, text, trap, sol) {
    var k = kindOf(L1, L2);
    return classMC(r, prompt, k, clsD(L1, L2), sol || clsSol(L1, L2, n1, n2), ['Write both equations as ' + t('y=mx+b') + '. Compare the slopes first; only if they are equal, compare the ' + t('y') + '-intercepts.'], text, trap);
  }
  /* rewriting  a x + b y = c  in slope–intercept form, with the classic slips */
  function rw(prompt, a, b, c, extra) {
    var L = line(a, b, -c), m = fr(-a, b), q = fr(c, b), wr = [];
    var add = function (W, code, hint) { if (!sameL(W, L) && !wr.some(function (w) { return sameL(w.is, W); })) wr.push({ is: W, code: code, hint: hint }); };
    if (b === 1) add(mbL(a, c), 'u8-neg', 'Moving ' + t(T([[a, 'x']])) + ' to the other side changes its sign.');
    else if (b === -1) { add(mbL(a, -c), 'u8-neg', 'Divide <b>every</b> term by ' + t('-1') + ' — the constant changes sign too.'); add(mbL(-a, c), 'u8-neg', 'From ' + t('-y=' + T([[-a, 'x'], [c, '']])) + ', divide <b>every</b> term by ' + t('-1') + '.'); }
    else {
      add(mbL(-a, Ln.toFr(c / b)), 'u8-nodiv', 'Divide <b>every</b> term by ' + t(b) + ' — the ' + t('x') + '-term too.');
      add(mbL(m, c), 'u8-nodiv', 'Divide <b>every</b> term by ' + t(b) + ' — the constant ' + t(c) + ' too.');
      if (b < 0) add(mbL(fr(a, b), q), 'u8-neg', 'Dividing by ' + t(b) + ' changes the sign of <b>every</b> term.');
    }
    var p = K.P.line(prompt, L, { form: 'slope-intercept', wrong: wr },
      t(eqT([[a, 'x'], [b, 'y']], c)) + '<br>' + t(T([[b, 'y']]) + '=' + T([[-a, 'x'], [c, '']])) + (b === 1 ? '' : '<br>' + t(si(L)) + ' (divide every term by ' + t(b) + ')') + '.' + (extra || ''),
      [b === 1 ? 'Subtract ' + t(T([[a, 'x']])) + ' from both sides.' : 'Move the ' + t('x') + '-term to the other side, then divide <b>every</b> term by ' + t(b) + '.'], 'rewrite in y = mx + b');
    p.bad = wr.map(function (w) { return si(w.is); });
    return p;
  }
  function rwWrong(a, b, c) {   // the wrong lines for twoEq boxes
    var L = line(a, b, -c), out = [];
    var add = function (W, code, hint) { if (!sameL(W, L) && !out.some(function (w) { return sameL(w.is, W); })) out.push({ is: W, code: code, hint: hint }); };
    if (b === 1) add(mbL(a, c), 'u8-neg', 'Moving ' + t(T([[a, 'x']])) + ' to the other side changes its sign.');
    else if (b === -1) { add(mbL(a, -c), 'u8-neg', 'Divide <b>every</b> term by ' + t('-1') + ' — the constant changes sign too.'); add(mbL(-a, c), 'u8-neg', 'Divide <b>every</b> term by ' + t('-1') + '.'); }
    else { add(mbL(-a, Ln.toFr(c / b)), 'u8-nodiv', 'Divide <b>every</b> term by ' + t(b) + ' — the ' + t('x') + '-term too.'); add(mbL(fr(-a, b), c), 'u8-nodiv', 'Divide <b>every</b> term by ' + t(b) + ' — the constant too.'); }
    return out;
  }
  function rwSteps(a, b, c) { var L = line(a, b, -c); return t(eqT([[a, 'x'], [b, 'y']], c)) + ' → ' + (b === 1 ? '' : t(T([[b, 'y']]) + '=' + T([[-a, 'x'], [c, '']])) + ' → ') + t(si(L)); }
  /* the two slopes in number boxes */
  function slopeFields(m1, b1, m2, b2) {
    var mk = function (m, b) { return function (v) { if (m !== 0 && v === -m) return { code: 'slope-sign', hint: 'Check the sign: in ' + t(yT(m, b)) + ' the number in front of ' + t('x') + ' is ' + t(m) + '.' }; if (v === b && b !== m) return { code: 'mb-swap', hint: 'That is the ' + t('y') + '-intercept ' + t('b') + '. The slope is the number multiplying ' + t('x') + '.' }; return null; }; };
    var p = numFields('State the slope of each line.', [t('m_1=') , t('m_2=')], [m1, m2], [mk(m1, b1), mk(m2, b2)],
      'In ' + t('y=mx+b') + ' the slope is the coefficient of ' + t('x') + ': ' + t(yT(m1, b1)) + ' has ' + t('m_1=' + m1) + ' and ' + t(yT(m2, b2)) + ' has ' + t('m_2=' + m2) + '. ' + (m1 === m2 ? 'The slopes are the same.' : 'The slopes are different.'),
      ['In ' + t('y=mx+b') + ', the slope is the number multiplying ' + t('x') + '.'], 'state both slopes');
    p.bad = [[String(b1), String(b2)]].filter(function (q) { return q[0] !== String(m1) || q[1] !== String(m2); });
    return p;
  }
  /* a grid: for each case (no solution / infinitely many / one solution), which k works */
  function kGrid(prompt, v, want, sol, hints, text, vT) {
    vT = vT || t('k=' + v);
    var cols = [{ id: 'eq', html: vT }, { id: 'ne', html: 'every ' + t('k\\ne ' + v) }, { id: 'imp', html: 'impossible' }];
    var rows = [{ id: 'none', html: '(a) no solution' }, { id: 'inf', html: '(b) infinitely many' }, { id: 'one', html: '(c) one solution' }];
    var names = { eq: vT, ne: 'every ' + t('k\\ne ' + v), imp: 'impossible' };
    return K.P.grid(prompt, rows, cols, want, { why: function (row, got) { return { code: 'u8l2-kcase', hint: 'Look again at ' + (row === 'none' ? 'no solution: equal slopes <b>and</b> different intercepts' : row === 'inf' ? 'infinitely many: equal slopes <b>and</b> equal intercepts' : 'one solution: different slopes') + '. Which values of ' + t('k') + ' do that' + (got === 'imp' ? ' — is it really impossible?' : '?') }; } }, sol, hints, text);
  }
  function tinyGraph(Ls, kind) {   // a small picture of two lines (for "classify from the graph")
    var segs = Ls.map(function (L, i) { var c = clipV(L, W6); return { pts: c.v, color: i ? (kind === 'inf' ? '#2b55a0' : RED) : (kind === 'inf' ? '#9aa0a8' : BLUE), dash: i === 1, start: 'arrow', end: 'arrow' }; });
    return HW.graph({ x: W6[0], y: W6[1], grid: 1, labels: 0, max: 130, segs: segs, aria: 'two lines' });
  }

  HW.addCodes({
    'u8-gr-shift': 'Graph: right slope, wrong place', 'u8-gr-sign': 'Graph: slope sign wrong', 'u8-gr-flip': 'Graph: run over rise', 'u8-gr-slope': 'Graph: right intercept, wrong slope', 'u8-gr-line': 'Graph: a line wrong',
    'u8-point-off': 'Plotted a point not on the line', 'u8-points-only': 'Plotted points but no lines', 'u8-line-missing': 'A line of the system missing', 'u8-line-extra': 'Extra line drawn', 'u8-graph': 'Graph of the system wrong',
    'u8-eq-swap': 'Equations in the wrong boxes', 'u8-neg': 'Sign slip dividing by −1 (or a negative)', 'u8-nodiv': 'Didn’t divide every term', 'sub-swap': 'Substituted the point’s coordinates into the wrong letters', 'sub-wrong': 'Substitution arithmetic slip',
    'u8-sys-same': 'Wrote the same line (infinitely many)', 'u8-sys-par': 'Wrote a parallel line (no solution)', 'u8-sys-cross': 'Wrote a crossing line (one solution)', 'u8-sys-sign': 'Slope sign from the given equation',
    'u8-k-ycoef': 'Matched only the y-coefficients', 'u8-k-xcoef': 'Used the x-coefficient for k', 'u8-k-flip': 'Ratio of coefficients upside down', 'u8-k-div': 'Divided by the multiplier instead of multiplying', 'u8-c-sign': 'Sign of the constant',
    'mb-swap': 'Slope and y-intercept swapped', 'u8l2-kcase': 'Matched a value of k to the wrong case', 'u8l2-c-nomult': 'Forgot to multiply the constant by the same factor', 'u8l2-hours': 'Break-even: wrong number of hours', 'u8l2-cost': 'Break-even: wrong cost at the crossing'
  });
  HW.addPartial({ 'u8-point-off': 's', 'u8-points-only': 'b', 'u8-graph': 'n', 'u8-sys-same': 'n', 'u8-sys-par': 'n', 'u8-sys-cross': 'n', 'u8-sys-sign': 'b', 'mb-swap': 'b', 'u8l2-kcase': 'n', 'u8l2-c-nomult': 's', 'u8l2-hours': 'n', 'u8l2-cost': 's' });

  /* write a second equation that makes a system with a given number of solutions (any form accepted) */
  function writePartS(id, want, level, label, opt) {
    opt = opt || {};
    return { id: id, sub: label, level: level, make: function (r, sh) {
      var G = sh.G, nG = sh.n, m = fr(-G.A, G.B), b = fr(-G.C, G.B), mT = fT(m), bT = fT(b), siG = si(G);
      var check = function (resp) {
        var rd = Ln.read(resp); if (!rd.ok) return form(rd.why === 'empty' ? 'empty' : 'line-' + rd.why, rd.why === 'empty' ? 'Type your equation first.' : rd.why === 'no-eq' ? 'Write an equation with an equals sign, e.g. ' + t('y=2x+1') + '.' : 'I can’t read that equation — use ' + t('x') + ', ' + t('y') + ' and numbers.');
        var S = { A: rd.a, B: rd.b, C: rd.c }, k = (Math.abs(S.A * G.B - S.B * G.A) < 1e-9) ? (Math.abs(S.A * G.C - S.C * G.A) < 1e-9 && Math.abs(S.B * G.C - S.C * G.B) < 1e-9 ? 'inf' : 'none') : 'one';
        if (k === want) return ok();
        var negSlope = S.B !== 0 && Math.abs(-S.A / S.B + fv(m)) < 1e-9 && fv(m) !== 0;
        if (want !== 'one' && negSlope) return wrong('u8-sys-sign', 'Check the slope of the given line: ' + t(nG) + (nG === siG ? '' : ' is ' + t(siG) + ',') + ' so its slope is ' + t(mT) + ', not ' + t(fT(fr(-m[0], m[1]))) + '.');
        if (k === 'inf') return wrong('u8-sys-same', 'Your equation is the same line as ' + t(nG) + ', so the system would have <b>infinitely many</b> solutions. ' + (want === 'none' ? 'Keep the slope but change the ' + t('y') + '-intercept.' : 'Use a different slope.'));
        if (k === 'none') return wrong('u8-sys-par', 'Your line has the same slope as ' + t(nG) + ' but a different ' + t('y') + '-intercept: parallel lines, so <b>no solution</b>. ' + (want === 'inf' ? 'For infinitely many, keep the intercept too (or multiply <b>every</b> term, the constant too, by the same number).' : 'Use a different slope.'));
        return wrong('u8-sys-cross', 'Your line has a different slope from ' + t(nG) + ' (slope ' + t(mT) + '), so the lines cross once: <b>one solution</b>. ' + (want === 'none' ? 'Keep the slope ' + t(mT) + ' and change only the intercept.' : 'Use the same slope and the same intercept.'));
      };
      var none = mbL(m, fv(b) + (fv(b) > 0 ? -4 : 4)), one = mbL(fv(m) === 1 ? -1 : 1, b);
      var key = want === 'none' ? si(none) : want === 'one' ? si(one) : (opt.general ? eqT([[G.A, 'x'], [G.B, 'y']], -G.C) : si(G));
      if (want === 'inf') key = opt.multKey || key;
      var sol = (nG === siG ? t(nG) + ' has' : t(nG) + ' is ' + t(siG) + ':') + ' slope ' + t(mT) + ' and ' + t('y') + '-intercept ' + t(bT) + '.<br>' +
        (want === 'none' ? 'Keep the slope and change the intercept, e.g. ' + t(key) + '. (Any line with slope ' + t(mT) + ' and a different ' + t('y') + '-intercept works.)'
          : want === 'one' ? 'Use any different slope, e.g. ' + t(key) + '.'
            : 'Use the same line written another way: multiply every term by the same number, e.g. ' + t(key) + '. (The equation itself also works.)');
      var p = K.P.math('(' + label + ') ' + ['', 'no solution', 'one solution', 'infinitely many solutions'][['', 'none', 'one', 'inf'].indexOf(want)], check, key, sol,
        [want === 'none' ? 'No solution means parallel lines: same slope, different ' + t('y') + '-intercept.' : want === 'one' ? 'One solution means the lines cross: the slopes are different.' : 'Infinitely many means the same line: same slope and same ' + t('y') + '-intercept.', (nG === siG ? 'Read the slope and the ' + t('y') + '-intercept of ' + t(nG) + '.' : 'First rewrite ' + t(nG) + ' as ' + t('y=mx+b') + '.')], 'write equation: ' + want, { keys: 'eq', placeholder: 'e.g. y = 2x + 1' });
      p.good = want === 'none' ? [si(mbL(m, fv(b) + 1))] : want === 'one' ? [si(mbL(fv(m) + 1, b)), 'x=3'] : [siG, Ln.tex(G, 'general')];
      p.bad = want === 'none' ? [siG, si(mbL(fr(-m[0], m[1]), fv(b) + 1))] : want === 'one' ? [si(mbL(m, fv(b) + 2))] : [si(mbL(m, fv(b) + 1))];
      return p;
    } };
  }

  function dec(p, q) { return String(r6(p / q)); }
  function fracT(p, q) { return (p < 0 ? '-' : '') + '\\frac{' + Math.abs(p) + '}{' + q + '}'; }   // unsimplified on purpose
  function yRaw(mT, b) { return 'y=' + mT + 'x' + (b === 0 ? '' : (typeof b === 'string' ? (b.charAt(0) === '-' ? b : '+' + b) : (b < 0 ? '-' + Math.abs(b) : '+' + b))); }
  function whyMC(r, prompt, opts, sol, text) { return mc(r, prompt, opts, sol, ['Write both equations as ' + t('y=mx+b') + ' with ' + t('k') + ' in place. Which number can ' + t('k') + ' change: a slope or an intercept?'], text); }
  var L2EXTRA = [
      /* ---------- EP Part A: compare m and b ---------- */
      { num: '1', section: 'Extra practice A — Compare m and b, don’t graph',
        stem: 'Each system is already in slope–intercept form. State whether it has one solution, no solution, or infinitely many solutions. Watch for equations that are written differently but say the same thing.',
        parts: [
          { id: 'e1a', sub: 'a', level: 'BEG', make: function (r) { var q = r.pick([3, 3, 4, 5]), p = r.pick([1, 2, -1, -2, 3].filter(function (v) { return gcd(v, q) === 1; })), bs = r.sample([-4, 1, 2, -3, 5, -1], 2), n1 = yT([p, q], bs[0]), n2 = yT([p, q], bs[1]); return clsPart(r, '(a) ' + t(n1) + ', \\(\;\\) ' + t(n2), mbL([p, q], bs[0]), mbL([p, q], bs[1]), n1, n2, 'EP classify fraction slopes'); } },
          { id: 'e1b', sub: 'b', level: 'EMG', make: function (r) { var n = r.pick([5, 5, 2, 3, 4]), sg = r.pick([-1, -1, 1]), b = r.pick([2, 2, -1, 3, -4]), n1 = yT(sg * n, b), n2 = yT([sg, n], b); return clsPart(r, '(b) ' + t(n1) + ', \\(\;\\) ' + t(n2), mbL(sg * n, b), mbL([sg, n], b), n1, n2, 'EP classify n vs 1/n', '<b>Infinitely many solutions</b> — the slopes use the same number ' + t(n) + ' and the intercepts are equal.'); } },
          { id: 'e1c', sub: 'c', level: 'EMG', make: function (r) { var pq = r.pick([[3, 4], [3, 4], [2, 3], [1, 2], [2, 5], [-3, 4], [-1, 3]]), k = r.pick([2, 2, 3]), b = r.pick([-2, -2, 1, 4, -3]), n1 = yT(pq, b), n2 = yRaw(fracT(k * pq[0], k * pq[1]), b); return clsPart(r, '(c) ' + t(n1) + ', \\(\;\\) ' + t(n2), mbL(pq, b), mbL(pq, b), n1, n2, 'EP classify unsimplified slope', '<b>One solution</b> — the slopes ' + t(fT(pq)) + ' and ' + t(fracT(k * pq[0], k * pq[1])) + ' are different numbers.'); } },
          { id: 'e1d', sub: 'd', level: 'EMG', make: function (r) { var q = r.pick([2, 2, 4, 5, 10]), sg = r.pick([-1, -1, 1]), b = r.pick([3, 3, -2, 1, 5, -4, 6, -1]); var n1 = yRaw((sg < 0 ? '-' : '') + '\\frac{x}{' + q + '}', b).replace('x' + '', '').replace(/^y=(-?\\frac\{x\}\{\d\})x/, 'y=$1'), n2 = yRaw((sg < 0 ? '-' : '') + dec(1, q), b); return clsPart(r, '(d) ' + t(n1) + ', \\(\;\\) ' + t(n2), mbL([sg, q], b), mbL([sg, q], b), n1, n2, 'EP classify x/q vs decimal', '<b>No solution</b> — one slope is a fraction and the other is a decimal.'); } },
          { id: 'e1e', sub: 'e', level: 'EMG', make: function (r) { var pq = r.pick([[5, 2], [5, 2], [3, 2], [7, 4], [3, 4], [6, 5], [-5, 2], [-3, 2]]), bs = r.sample([1, -1, 2, -3, 4], 2), n1 = yT(pq, bs[0]), n2 = yRaw(dec(pq[0], pq[1]), bs[1]); return clsPart(r, '(e) ' + t(n1) + ', \\(\;\\) ' + t(n2), mbL(pq, bs[0]), mbL(pq, bs[1]), n1, n2, 'EP classify fraction vs decimal slope', '<b>One solution</b> — one slope is a fraction and the other is a decimal, so they are different.'); } },
          { id: 'e1f', sub: 'f', level: 'EMG', make: function (r) { var k = r.pick([7, 7, 5, -3, 4, -6, 9]), h = r.pick([7, 7, 2, -4, 5, -1, 8]); return pointPart('(f) ' + t('y=' + k) + ', \\(\;\\) ' + t('x=' + h) + '<br>How many solutions does the system have? If there is exactly one, give it as an ordered pair; otherwise use the <b>no solution</b> or <b>infinitely many</b> key.', [h, k], [line(0, 1, -k), line(1, 0, -h)], {},
            t('y=' + k) + ' is a horizontal line and ' + t('x=' + h) + ' is a vertical line. A horizontal and a vertical line always cross exactly once: <b>one solution</b>, ' + ptt([h, k]) + ' (every point on the first has ' + t('y=' + k) + ', every point on the second has ' + t('x=' + h) + ').', ['One line is horizontal and the other vertical. Where do they cross?'], 'horizontal meets vertical'); } }] },
      { num: '2', stem: 'The slopes below only match <b>after</b> you simplify them. Simplify each slope and each ' + t('y') + '-intercept, then classify the system.',
        parts: [
          { id: 'e2a', sub: 'a', level: 'EMG', make: function (r) { var pq = r.pick([[2, 3], [2, 3], [3, 4], [1, 3], [3, 5], [-2, 3]]), k = r.pick([2, 2, 3]), b = r.pick([3, 3, -1, 2, -4]), n1 = yRaw(fracT(k * pq[0], k * pq[1]), b), n2 = yT(pq, b); return clsPart(r, '(a) ' + t(n1) + ', \\(\;\\) ' + t(n2), mbL(pq, b), mbL(pq, b), n1, n2, 'EP simplify then classify (inf)', '<b>One solution</b> — the slopes ' + t(fracT(k * pq[0], k * pq[1])) + ' and ' + t(fT(pq)) + ' have different numerators.'); } },
          { id: 'e2b', sub: 'b', level: 'EMG', make: function (r) { var pq = r.pick([[3, 4], [3, 4], [2, 3], [2, 5], [-3, 4]]), k = r.pick([3, 3, 2, 4]), b = r.pick([5, 5, 2, 3, 4]), n1 = yRaw(fracT(k * pq[0], k * pq[1]), -b), n2 = yT(pq, b); return clsPart(r, '(b) ' + t(n1) + ', \\(\;\\) ' + t(n2), mbL(pq, -b), mbL(pq, b), n1, n2, 'EP simplify then classify (none)', '<b>Infinitely many solutions</b> — the slopes simplify to the same number and the intercepts use the same number ' + t(b) + '.'); } },
          { id: 'e2c', sub: 'c', level: 'PRG', make: function (r) { var pq = r.pick([[5, 2], [5, 2], [3, 2], [7, 2], [3, 4], [5, 4]]), k = r.pick([2, 2, 3]), bq = r.pick([[1, 2], [1, 2], [3, 2], [1, 4], [-1, 2]]); var bT = fT(bq), n1 = yRaw(fracT(k * pq[0], k * pq[1]), bT), n2 = yRaw(dec(pq[0], pq[1]), dec(bq[0], bq[1])); return clsPart(r, '(c) ' + t(n1) + ', \\(\;\\) ' + t(n2), mbL(pq, bq), mbL(pq, bq), n1, n2, 'EP simplify fractions and decimals', '<b>No solution</b> — one equation uses fractions and the other decimals.'); } }] },
      /* ---------- EP Part B: general form ---------- */
      { num: '3', section: 'Extra practice B — Standard form: rearrange first',
        stem: 'Each equation is in the form ' + t('Ax+By=C') + '. Rewrite <b>both</b> equations as ' + t('y=mx+b') + ', then classify the system. In parts (a) and (b) the two equations are very nearly the same — look carefully at the constant.',
        shared: function (r) {
          var base = r.pick([[1, 2, 5], [1, 2, 5], [1, 3, 4], [2, 3, 6], [1, 4, 6], [3, 2, 4], [1, 2, 3], [2, 5, 4], [3, 4, 5], [1, 3, 7], [2, 1, 3], [1, 5, 2]]), k = r.pick([2, 2, 3, 4]), d = r.pick([2, 2, 1, 3, -1, -2]);
          var a = { e: [[k * base[0], k * base[1], k * base[2]], base] }, b = { e: [[k * base[0], k * base[1], k * base[2]], [base[0], base[1], base[2] + d]] };
          var c = { e: [[r.pick([4, 4, 3, 2]), -1, r.pick([7, 7, 5, 3, -2])], [1, 2, r.pick([4, 4, 6, -2, 8])]] };
          var dd = [r.pick([2, 2, 1, 3, 4]), r.pick([3, 3, 2, 5])]; if (gcd(dd[0], dd[1]) > 1 || dd[0] === dd[1]) dd = [2, 3]; dd.push(r.pick([4, 4, 1, 2, 5, -1, -2]), 0); dd[3] = dd[2] + r.pick([1, 1, -1, 2, 3]);   // [p, q, r, s]: 3p x − 3q y = 3r, p x − q y = s
          var e4 = { e: [[3 * dd[0], -3 * dd[1], 3 * dd[2]], [dd[0], -dd[1], dd[3]]] };
          [a, b, c, e4].forEach(function (s) { s.L = s.e.map(function (q) { return line(q[0], q[1], -q[2]); }); s.g = s.e.map(function (q) { return eqT([[q[0], 'x'], [q[1], 'y']], q[2]); }); });
          return { a: a, b: b, c: c, d: e4 };
        },
        parts: [].concat.apply([], ['a', 'b', 'c', 'd'].map(function (k) {
          return [
            { id: 'e3' + k, sub: k + ' rewrite', level: 'EMG', outcome: 'RF6', make: function (r, sh) { var s = sh[k]; return twoEq('(' + k + ') ' + t(s.g[0]) + ' and ' + t(s.g[1]) + '<br>Rewrite both equations as ' + t('y=mx+b') + '.', s.L, [t(s.g[0]) + ':', t(s.g[1]) + ':'], { form: 'slope-intercept', wrong: s.e.map(function (q) { return rwWrong(q[0], q[1], q[2]); }) }, s.e.map(function (q) { return rwSteps(q[0], q[1], q[2]); }).join('<br>'), ['Move the ' + t('x') + '-term across, then divide <b>every</b> term by the coefficient of ' + t('y') + '.'], 'rewrite both, standard form'); } },
            { id: 'e3' + k + '2', sub: k + ' classify', level: k === 'c' ? 'EMG' : 'PRG', make: function (r, sh) { var s = sh[k]; return clsPart(r, '(' + k + ') ' + t(s.g[0]) + ' and ' + t(s.g[1]) + '<br>Classify the system.', s.L[0], s.L[1], s.g[0], s.g[1], 'classify standard form', k === 'b' || k === 'd' ? '<b>Infinitely many solutions</b> — the ' + t('x') + '- and ' + t('y') + '-terms of one equation are a multiple of the other’s.' : null); } }];
        })) },
      { num: '4', stem: 'Clear the fractions first, then rewrite each equation as ' + t('y=mx+b') + ' and classify the system.',
        parts: [
          { id: 'e4a', sub: 'a', level: 'PRG', make: function (r) {
            var pqr = r.pick([[3, 2, 6], [3, 2, 6], [2, 5, 10], [4, 3, 12], [2, 3, 6], [5, 2, 10], [3, 4, 12], [5, 3, 15], [3, 5, 15], [4, 5, 20], [5, 4, 20], [2, 7, 14], [7, 2, 14], [6, 5, 30], [5, 6, 30], [4, 7, 28], [7, 3, 21], [3, 7, 21], [2, 9, 18], [9, 2, 18]]), p = pqr[0], q = pqr[1], R = pqr[2];
            var g1 = T([[[p, R], 'x'], [[q, R], 'y']]) + '=1', g2 = eqT([[p, 'x'], [q, 'y']], R), L = line(p, q, -R);
            return clsPart(r, '(a) ' + t(g1) + ' and ' + t(g2), L, L, g1, g2, 'EP clear fractions (inf)', null,
              'Multiply ' + t(g1) + ' by ' + t(R) + ': ' + t(g2) + ' — exactly the second equation.<br>Both are ' + t(si(L)) + '.<br>' + verdictT('inf'));
          } },
          { id: 'e4b', sub: 'b', level: 'PRG', make: function (r) {
            var s = pick2(r, function (r) { return { a: r.pick([2, 2, 1, 3]), b: r.pick([3, 3, 5, 4]), c: r.pick([4, 4, 2, 3, 5]), k: r.pick([2, 2, 1]), d: r.pick([-6, -6, -3, 3, 6]) }; }, function (s) { return gcd(s.a, s.b) === 1 && s.a < s.b; });
            var M = s.k * s.b, g1 = T([[[s.a, s.b], 'x'], [-1, 'y']]) + '=' + s.c, g2 = eqT([[s.k * s.a, 'x'], [-M, 'y']], M * s.c + s.d), L1 = line(s.a, -s.b, -s.b * s.c), L2 = line(s.k * s.a, -M, -(M * s.c + s.d));
            return clsPart(r, '(b) ' + t(g1) + ' and ' + t(g2), L1, L2, g1, g2, 'EP clear fractions (none)', null,
              'Multiply ' + t(g1) + ' by ' + t(M) + ': ' + t(eqT([[s.k * s.a, 'x'], [-M, 'y']], M * s.c)) + ' — the same ' + t('x') + '- and ' + t('y') + '-terms as ' + t(g2) + ', but the constant is ' + t(M * s.c) + ', not ' + t(M * s.c + s.d) + '.<br>' + t(si(L1)) + ' and ' + t(si(L2)) + '.<br>' + verdictT('none'));
          } },
          { id: 'e4c', sub: 'c', level: 'PRG', make: function (r) {
            var s = pick2(r, function (r) { return { a: r.pick([3, 3, 1, 2, 5]), b: r.pick([4, 4, 2, 3]), c: r.pick([2, 2, 1, 3, -1]), p: r.pick([3, 3, 1, 2, 4]), q: r.pick([2, 2, 3]), R: r.pick([10, 10, 6, 8, 9, 12]) }; }, function (s) { return gcd(s.a, s.b) === 1 && s.a < s.b * 2 && s.a * s.q !== s.p * s.b && gcd(gcd(s.p, s.q), s.R) === 1; });
            var g1 = T([[[s.a, s.b], 'x'], [1, 'y']]) + '=' + s.c, g2 = eqT([[s.p, 'x'], [s.q, 'y']], s.R), L1 = line(s.a, s.b, -s.b * s.c), L2 = line(s.p, s.q, -s.R);
            return clsPart(r, '(c) ' + t(g1) + ' and ' + t(g2), L1, L2, g1, g2, 'EP clear fractions (one)', null,
              'Multiply ' + t(g1) + ' by ' + t(s.b) + ': ' + t(eqT([[s.a, 'x'], [s.b, 'y']], s.b * s.c)) + ', so ' + t(si(L1)) + '.<br>' + t(g2) + ' is ' + t(si(L2)) + '.<br>' + verdictT('one'));
          } },
          { id: 'e4d', sub: 'd', level: 'EMG', make: function (r) {
            var b = r.pick([[1, 2, 5], [3, 2, 6], [2, 5, 10], [1, 3, 4], [2, 3, 7], [4, 1, 3], [1, -2, 4], [3, -1, 2]]), k = r.pick([2, 3, 4, 5, 6]), g = eqT([[b[0], 'x'], [b[1], 'y']], b[2]), gk = eqT([[k * b[0], 'x'], [k * b[1], 'y']], k * b[2]), L = line(b[0], b[1], -b[2]);
            return mc(r, 'Multiplying ' + t(g) + ' by ' + t(k) + ' gives ' + t(gk) + '. What does multiplying <b>every</b> term of an equation by a non-zero constant do to ' + t('m') + ' and ' + t('b') + '?', [
              { html: 'It changes neither ' + t('m') + ' nor ' + t('b') + ': both equations are ' + t(si(L)) + ', the same line.', right: true },
              { html: 'It multiplies the slope by ' + t(k) + ' but keeps ' + t('b') + '.', why: 'Rewrite ' + t(gk) + ': dividing by ' + t(k * b[1]) + ' gives ' + t(si(L)) + ' again.', code: 'm' },
              { html: 'It multiplies ' + t('b') + ' by ' + t(k) + ', so the lines are parallel.', why: 'Every term was multiplied, the constant too, so the ratio ' + t('C\\div B') + ' — the intercept — is unchanged.', code: 'b' },
              { html: 'It multiplies both ' + t('m') + ' and ' + t('b') + ' by ' + t(k) + '.', why: 'Rewrite both equations: they give the same ' + t('y=mx+b') + '.', code: 'both' }],
              t(g) + ' → ' + t(si(L)) + '; ' + t(gk) + ' → ' + t(si(L)) + '. Multiplying every term (the constant too) by a non-zero number changes neither ' + t('m') + ' nor ' + t('b') + ': it is the same line. (If only the ' + t('x') + '- and ' + t('y') + '-terms were multiplied and not the constant, ' + t('b') + ' would change and the lines would be parallel.)',
              ['Rewrite both equations as ' + t('y=mx+b') + ' and compare.'], 'multiplying by a constant');
          } }] },
      /* ---------- EP Part C: reading a graph ---------- */
      { num: '5', section: 'Extra practice C — Reading a graph',
        stem: 'Classify each system from its graph: state the number of solutions, and give the solution as an ordered pair if there is exactly one. Two different lines are drawn solid and dashed; when the two lines are the <b>same</b> line, a dashed line lies right on top of a grey one.',
        shared: function (r) {
          var a = ysys(r, [1, 2, [1, 2], -1], [-1, -2, 1, 3], { xlo: -3, xhi: 4 });
          var m = r.pick([[1, 2], [1, 2], 1, -1, 2, [-1, 2]]), bs = r.sample([3, -2, 1, -4, 4, 0], 2);
          var cm = r.pick([-1, 2, [1, 2], 1, -2, [-1, 2], 3]), cb = r.pick([1, -2, 3, 0, -1, 2, -3]);
          return { a: a, b: { L1: mbL(m, bs[0]), L2: mbL(m, bs[1]), m: m, bs: bs }, c: { L: mbL(cm, cb), m: cm, b: cb } };
        },
        parts: [
          { id: 'e5a', sub: 'a', level: 'BEG', make: function (r, sh) { var s = sh.a; return pointPart('(a)' + sysFig([s.L1, s.L2], W6) + 'How many solutions? If exactly one, give it as an ordered pair; otherwise use the <b>no solution</b> or <b>infinitely many</b> key.', s.P, [s.L1, s.L2], {}, 'The lines cross at one point: <b>one solution</b>, ' + ptt(s.P) + '.', ['Do the lines cross? Where?'], 'classify from graph (one)'); } },
          { id: 'e5b', sub: 'b', level: 'BEG', make: function (r, sh) { var s = sh.b; return pointPart('(b)' + sysFig([s.L1, s.L2], W6) + 'How many solutions? If exactly one, give it as an ordered pair; otherwise use the <b>no solution</b> or <b>infinitely many</b> key.', 'none', [s.L1, s.L2], {}, 'The lines are parallel (both have slope ' + t(nT(s.m)) + '; ' + t('y') + '-intercepts ' + t(s.bs[0]) + ' and ' + t(s.bs[1]) + '): they never meet — <b>no solution</b>.', ['Do the lines ever meet?'], 'classify from graph (none)'); } },
          { id: 'e5c', sub: 'c', level: 'BEG', make: function (r, sh) { var s = sh.c, c = clipV(s.L, W6); return pointPart('(c)<div class="fig">' + HW.graph({ x: W6[0], y: W6[1], grid: 1, labels: 2, max: 300, segs: [{ pts: c.v, color: '#9aa0a8', start: 'arrow', end: 'arrow' }, { pts: c.v, color: BLUE, dash: true }], aria: 'two lines on top of each other' }) + '</div>How many solutions? If exactly one, give it as an ordered pair; otherwise use the <b>no solution</b> or <b>infinitely many</b> key.', 'inf', [s.L, s.L], {}, 'The dashed line lies exactly on the grey line: it is one line drawn twice, so every point on it is a solution — <b>infinitely many solutions</b>.', ['How many points do the two lines share?'], 'classify from graph (inf)'); } }] },
      /* ---------- EP Part D: find k ---------- */
      { num: '6', section: 'Extra practice D — Find the value of k',
        stem: function (s) { return 'Consider the system ' + t(s.n1) + ' and ' + t(s.n2) + '. For each case, choose the value(s) of ' + t('k') + ' that make it happen — one case is impossible.'; },
        shared: function (r) { var m = r.pick([2, 2, 3, -1, -3, 4]), bs = r.sample([-4, 1, 3, -2, 5], 2); return { m: m, b1: bs[0], b2: bs[1], n1: 'y=kx' + (bs[0] < 0 ? '' : '+') + bs[0], n2: yT(m, bs[1]) }; },
        parts: [
          { id: 'e6', sub: 'cases', level: 'PRG', make: function (r, s) { return kGrid('Choose for each case.', s.m, { none: 'eq', inf: 'imp', one: 'ne' }, t(s.n1) + ' has slope ' + t('k') + ' and ' + t('y') + '-intercept ' + t(s.b1) + '; ' + t(s.n2) + ' has slope ' + t(s.m) + ' and ' + t('y') + '-intercept ' + t(s.b2) + '.<br>(a) No solution: equal slopes, ' + t('k=' + s.m) + ' (the intercepts already differ).<br>(b) Infinitely many: impossible — the intercepts are ' + t(s.b1) + ' and ' + t(s.b2) + ' whatever ' + t('k') + ' is.<br>(c) One solution: different slopes, every ' + t('k\\ne ' + s.m) + '.', ['Here ' + t('k') + ' is the slope of the first line.'], 'k cases: slope'); } },
          { id: 'e6w', sub: 'why', level: 'ADV', make: function (r, s) { return whyMC(r, 'Why is that case impossible?', [
            { html: 'Infinitely many needs the same ' + t('y') + '-intercept, but the intercepts are fixed at ' + t(s.b1) + ' and ' + t(s.b2) + ': ' + t('k') + ' only changes the slope.', right: true },
            { html: 'Infinitely many is impossible because the slopes can never be equal.', why: 'With ' + t('k=' + s.m) + ' the slopes are equal. It is the intercepts that can never match.', code: 'slopes' },
            { html: 'No solution is impossible because the intercepts are different.', why: 'Different intercepts are exactly what no solution needs (with equal slopes).', code: 'none' },
            { html: 'One solution is impossible because ' + t('k') + ' can be any number.', why: 'Any ' + t('k\\ne ' + s.m) + ' gives different slopes — one solution.', code: 'one' }], 'Infinitely many solutions needs the same slope <b>and</b> the same intercept. The intercepts are ' + t(s.b1) + ' and ' + t(s.b2) + ' no matter what ' + t('k') + ' is, so it can never happen.', 'why impossible (slope k)'); } }] },
      { num: '7', stem: function (s) { return 'Consider the system ' + t(s.n1) + ' and ' + t(s.n2) + '. For each case, choose the value(s) of ' + t('k') + ' that make it happen — one case is impossible.'; },
        shared: function (r) { var m = r.pick([5, 5, 2, -3, 4, -2, 3]), b = r.pick([-3, -3, 2, 4, -1, 6, -5]); return { m: m, b: b, n1: 'y=' + T([[m, 'x']]) + '+k', n2: yT(m, b) }; },
        parts: [
          { id: 'e7', sub: 'cases', level: 'PRG', make: function (r, s) { return kGrid('Choose for each case.', s.b, { none: 'ne', inf: 'eq', one: 'imp' }, 'Both lines have slope ' + t(s.m) + ', whatever ' + t('k') + ' is; ' + t('k') + ' is the first line’s ' + t('y') + '-intercept.<br>(a) No solution: different intercepts, every ' + t('k\\ne ' + s.b) + '.<br>(b) Infinitely many: ' + t('k=' + s.b) + ' (the same line).<br>(c) One solution: impossible — the slopes are always equal.', ['Here ' + t('k') + ' is the ' + t('y') + '-intercept of the first line.'], 'k cases: intercept'); } },
          { id: 'e7w', sub: 'why', level: 'ADV', make: function (r, s) { return whyMC(r, 'Why is that case impossible?', [
            { html: 'One solution needs different slopes, but both slopes are ' + t(s.m) + ' whatever ' + t('k') + ' is.', right: true },
            { html: 'One solution is impossible because the intercepts are always different.', why: 'With ' + t('k=' + s.b) + ' the intercepts are equal. One solution depends on the slopes, and they are always equal.', code: 'int' },
            { html: 'No solution is impossible because ' + t('k') + ' can equal ' + t(s.b) + '.', why: 'Any ' + t('k\\ne ' + s.b) + ' gives parallel lines — no solution.', code: 'none' },
            { html: 'Infinitely many is impossible because the equations look different.', why: 'With ' + t('k=' + s.b) + ' the two equations are identical.', code: 'inf' }], 'Lines cross exactly once only when their slopes are different. Here ' + t('k') + ' changes only the intercept, and both slopes are ' + t(s.m) + ', so one solution can never happen.', 'why impossible (intercept k)'); } }] },
      { num: '8', stem: function (s) { return 'Consider the system ' + t(s.n1) + ' and ' + t(s.n2) + '. For each case, choose the value(s) of ' + t('k') + ' that make it happen — one case is impossible.'; },
        shared: function (r) { var B = r.pick([3, 3, 2, 4]), A2 = r.pick([2, 2, 1, 3, -2]), c2 = r.pick([3, 3, 2, 4, 5, -1]); return { B: B, A2: A2, c2: c2, v: A2 * B, n1: 'kx+' + B + 'y=' + B * c2, n2: eqT([[A2, 'x'], [1, 'y']], c2) }; },
        parts: [
          { id: 'e8', sub: 'cases', level: 'PRG', make: function (r, s) { return kGrid('Choose for each case.', s.v, { none: 'imp', inf: 'eq', one: 'ne' }, t(s.n1) + ' is ' + t('y=-\\frac{k}{' + s.B + '}x+' + s.c2) + ', and ' + t(s.n2) + ' is ' + t(yT(-s.A2, s.c2)) + ': the ' + t('y') + '-intercepts are both ' + t(s.c2) + '.<br>(a) No solution: impossible — equal slopes would make the same line.<br>(b) Infinitely many: ' + t('-\\frac{k}{' + s.B + '}=' + (-s.A2)) + ', so ' + t('k=' + s.v) + '.<br>(c) One solution: every ' + t('k\\ne ' + s.v) + '.', ['Rewrite both equations as ' + t('y=mx+b') + '. What do you notice about the intercepts?'], 'k cases: same intercept'); } },
          { id: 'e8w', sub: 'why', level: 'ADV', make: function (r, s) { return whyMC(r, 'Why is that case impossible?', [
            { html: 'No solution needs equal slopes with different intercepts, but both intercepts are ' + t(s.c2) + ': equal slopes would give the same line.', right: true },
            { html: 'No solution is impossible because the slopes can never be equal.', why: 'With ' + t('k=' + s.v) + ' the slopes are equal (and then it is the same line).', code: 'slopes' },
            { html: 'Infinitely many is impossible because the equations have different numbers.', why: 'With ' + t('k=' + s.v) + ', ' + t(s.n1) + ' is ' + t(s.B) + ' times ' + t(s.n2) + '.', code: 'inf' },
            { html: 'One solution is impossible because the intercepts are equal.', why: 'Lines with equal intercepts but different slopes cross once (at the intercept).', code: 'one' }], 'Both lines cross the ' + t('y') + '-axis at ' + ptt([0, s.c2]) + '. Lines through the same point are either the same line (equal slopes) or cross there (different slopes) — they can never be parallel.', 'why impossible (same intercept)'); } }] },
      { num: '9', stem: function (s) { return 'Consider the system ' + t(s.n1) + ' and ' + t(s.n2) + '. For each case, choose the value(s) of ' + t('k') + ' that make it happen — one case is impossible.'; },
        shared: function (r) { var M = r.pick([4, 4, 2, 3]), A = r.pick([2, 2, 1, 3]), c = r.pick([5, 5, 3, 4, 6, -2]); return { M: M, A: A, c: c, n1: eqT([[M * A, 'x'], [M, 'y']], M * c), n2: T([[A, 'x'], [1, 'y']]) + '=k' }; },
        parts: [
          { id: 'e9', sub: 'cases', level: 'PRG', make: function (r, s) { return kGrid('Choose for each case.', s.c, { none: 'ne', inf: 'eq', one: 'imp' }, t(s.n1) + ' is ' + t(yT(-s.A, s.c)) + ' and ' + t(s.n2) + ' is ' + t('y=' + T([[-s.A, 'x']]) + '+k') + ': both slopes are ' + t(-s.A) + '.<br>(a) No solution: every ' + t('k\\ne ' + s.c) + '.<br>(b) Infinitely many: ' + t('k=' + s.c) + '.<br>(c) One solution: impossible — the slopes are always equal.', ['Rewrite both equations as ' + t('y=mx+b') + '.'], 'k cases: constant'); } },
          { id: 'e9w', sub: 'why', level: 'ADV', make: function (r, s) { return whyMC(r, 'Why is that case impossible?', [
            { html: 'One solution needs different slopes, but both slopes are ' + t(-s.A) + ': ' + t('k') + ' only moves the second line up or down.', right: true },
            { html: 'One solution is impossible because ' + t(s.n1) + ' is a multiple of ' + t(s.n2) + '.', why: 'Only for ' + t('k=' + s.c) + '. The real reason is that the slopes never change.', code: 'mult' },
            { html: 'No solution is impossible because the slopes are equal.', why: 'Equal slopes with different intercepts is exactly no solution (any ' + t('k\\ne ' + s.c) + ').', code: 'none' },
            { html: 'Infinitely many is impossible because ' + t('k') + ' is a letter.', why: 'With ' + t('k=' + s.c) + ' the equations are the same line.', code: 'inf' }], 'Both lines have slope ' + t(-s.A) + ' whatever ' + t('k') + ' is, so they are parallel or the same line — never crossing once.', 'why impossible (constant k)'); } }] },
      { num: '10', shared: function (r) {
          var s = pick2(r, function (r) { return { p: r.pick([4, 4, 2, 3, 5]), q: r.pick([3, 3, 2, 5]), M: r.pick([3, 3, 2]), r0: r.pick([10, 10, 6, 7, 9]), s0: r.pick([24, 24, 12, 18, 30, 20]) }; }, function (s) { return gcd(s.p, s.q) === 1 && s.s0 !== s.M * s.r0 && gcd(gcd(s.p, s.q), s.r0) === 1; });
          s.v = s.M * s.q; s.n1 = (s.M * s.p) + 'x-ky=' + s.s0; s.n2 = eqT([[s.p, 'x'], [-s.q, 'y']], s.r0);
          return s;
        },
        stem: function (s) { return 'Consider the system ' + t(s.n1) + ' and ' + t(s.n2) + '.'; },
        parts: [
          { id: 'e10', sub: 'cases', level: 'ADV', make: function (r, s) { return kGrid('For each case, choose the value(s) of ' + t('k') + ' that make it happen — one case is impossible.', s.v, { none: 'eq', inf: 'imp', one: 'ne' }, t(s.n2) + ' is ' + t(si(line(s.p, -s.q, -s.r0))) + '. ' + t(s.n1) + ' is ' + t('y=\\frac{' + s.M * s.p + '}{k}x-\\frac{' + s.s0 + '}{k}') + '.<br>Equal slopes: ' + t('\\frac{' + s.M * s.p + '}{k}=' + fT(fr(s.p, s.q))) + ', so ' + t('k=' + s.v) + '; then the intercepts are ' + t(fT(fr(-s.s0, s.v))) + ' and ' + t(fT(fr(-s.r0, s.q))) + ' — different.<br>(a) No solution: ' + t('k=' + s.v) + '. (b) Infinitely many: impossible. (c) One solution: every ' + t('k\\ne ' + s.v) + '.', ['Compare the ' + t('x') + '-coefficients: ' + t(s.M * s.p) + ' is ' + t(s.M) + ' times ' + t(s.p) + '.'], 'k cases: y-coefficient'); } },
          { id: 'e10b', sub: 'check', level: 'EMG', outcome: 'RF6', make: function (r, s) { return rw('Substitute ' + t('k=' + s.v) + ' and rewrite ' + t((s.M * s.p) + 'x-' + s.v + 'y=' + s.s0) + ' as ' + t('y=mx+b') + ' to check the case.', s.M * s.p, -s.v, s.s0, '<br>Compare with ' + t(s.n2) + ', which is ' + t(si(line(s.p, -s.q, -s.r0))) + ': same slope, different intercept — no solution ✓'); } },
          { id: 'e10w', sub: 'why', level: 'ADV', make: function (r, s) { return whyMC(r, 'Why can this system never have infinitely many solutions?', [
            { html: 'The only ' + t('k') + ' that makes the slopes equal is ' + t('k=' + s.v) + ', and then the intercepts are different — so the lines are parallel, never the same.', right: true },
            { html: 'Because the slopes can never be equal.', why: 'With ' + t('k=' + s.v) + ' they are equal.', code: 'slopes' },
            { html: 'Because ' + t(s.s0) + ' is not ' + t(s.r0) + '.', why: 'Different constants alone don’t decide it (equations can be multiples). Here ' + t(s.M) + ' times ' + t(s.r0) + ' is ' + t(s.M * s.r0) + ', not ' + t(s.s0) + ' — that is why.', code: 'const' },
            { html: 'It can: with ' + t('k=' + s.v) + ' it has infinitely many solutions.', why: 'With ' + t('k=' + s.v) + ' the intercepts are ' + t(fT(fr(-s.s0, s.v))) + ' and ' + t(fT(fr(-s.r0, s.q))) + ' — different: parallel lines.', code: 'can' }], 'For the same line, the first equation would have to be ' + t(s.M) + ' times the second, constant included: ' + t(s.M + '\\times' + s.r0 + '=' + s.M * s.r0) + ', but it is ' + t(s.s0) + '. The value ' + t('k=' + s.v) + ' matches the slopes only — the intercepts stay different.', 'why no k for inf'); } }] },
      /* ---------- EP Part E: error analysis ---------- */
      { num: '11', section: 'Extra practice E — Error analysis and reasoning', parts: [
        { id: 'e11', level: 'EMG', make: function (r) {
          var b = r.pick([[3, -2, 5], [3, -2, 5], [2, -3, 4], [4, -1, 3], [1, -2, 3], [5, 2, 7], [2, 5, 3], [4, 3, -2], [1, 4, 6], [3, 4, 1], [5, -3, 2]]), k = r.pick([2, 2, 3, 4]), g1 = eqT([[k * b[0], 'x'], [k * b[1], 'y']], k * b[2]), g2 = eqT([[b[0], 'x'], [b[1], 'y']], b[2]), L = line(b[0], b[1], -b[2]);
          return mc(r, 'Marcus is given the system ' + t(g1) + ' and ' + t(g2) + '. He writes: “The two equations have different numbers in them, so they must be different lines. Different lines cross once, so the system has one solution.” What is the flaw, and what is the correct classification?', [
            { html: 'Different-looking is not the same as different: dividing ' + t(g1) + ' by ' + t(k) + ' gives ' + t(g2) + '. It is one line written twice — <b>infinitely many solutions</b>.', right: true },
            { html: 'His reasoning is fine: different numbers mean different lines, so there is one solution.', why: 'Divide the first equation by ' + t(k) + ': it becomes the second equation exactly.', code: 'fine' },
            { html: 'The lines are parallel, so there is <b>no solution</b>.', why: 'Parallel needs different intercepts. Both equations are ' + t(si(L)) + ' — the same intercept.', code: 'par' },
            { html: 'Different lines can cross more than once, so there are two solutions.', why: 'Two different lines meet at most once. And these are not different lines at all.', code: 'two' }],
            t(g1) + ' ÷ ' + t(k) + ' = ' + t(g2) + '. Both are ' + t(si(L)) + ': one line drawn twice, so <b>infinitely many solutions</b>, not one.', ['Look for a number that divides every term of the first equation.'], 'Marcus: looks different');
        } }] },
      { num: '12', parts: [
        { id: 'e12', level: 'BEG', make: function (r) {
          var P = [r.int(-3, 0), r.int(-3, 3)], Q = [P[0] + r.pick([2, 3, 4]), P[1] + r.pick([-3, -2, 1, 2, 4])];
          return mc(r, 'Ana says the two lines of a system both pass through ' + ptt(P) + ' and ' + ptt(Q) + ', so the system has exactly two solutions. Can a system of two linear equations have <b>exactly two</b> solutions?', [
            { html: '<b>No</b> — only one line passes through two given points, so two lines sharing ' + ptt(P) + ' and ' + ptt(Q) + ' are the same line, and they share every point: infinitely many.', right: true },
            { html: '<b>Yes</b> — Ana’s system has exactly the two solutions ' + ptt(P) + ' and ' + ptt(Q) + '.', why: 'Two points determine one line. If both lines go through both points they are the same line — every point of it is a solution.', code: 'yes' },
            { html: '<b>Yes</b> — if the lines are curved enough.', why: 'Linear equations graph as straight lines.', code: 'curve' },
            { html: '<b>No</b> — two lines can never share a point.', why: 'Crossing lines share exactly one point.', code: 'never' }],
            'Exactly one straight line passes through two given points. So if two lines share two points they are the same line and share <b>every</b> point. The only possible numbers of solutions are 0, 1 and infinitely many.', ['How many straight lines pass through two given points?'], 'exactly two solutions?');
        } }] },
      { num: '13', parts: [
        { id: 'e13', level: 'BEG', make: function (r) {
          var ms = r.sample([2, -3, [1, 2], 4, -1, [-2, 3], 5], 2);
          return mc(r, 'Two linear equations written as ' + t('y=mx+b') + ' have slopes ' + t(nT(ms[0])) + ' and ' + t(nT(ms[1])) + '. Is it possible for the system to have <b>no</b> solution?', [
            { html: '<b>No</b> — different slopes means the lines tilt differently, so they must cross, exactly once. The ' + t('y') + '-intercepts aren’t needed.', right: true },
            { html: '<b>Yes</b> — if the ' + t('y') + '-intercepts are different.', why: 'Intercepts only matter when the slopes are equal. With different slopes the lines always cross once.', code: 'int' },
            { html: '<b>Yes</b> — if the lines are far apart.', why: 'Lines go on forever; lines with different slopes always meet somewhere.', code: 'far' },
            { html: 'It depends on the ' + t('y') + '-intercepts, so you can’t tell.', why: 'You can tell from the slopes alone: different slopes → one solution.', code: 'depends' }],
            'Different slopes → the lines are not parallel, so they cross exactly once: one solution, never zero. You only check the ' + t('y') + '-intercepts when the slopes are equal.', ['When do two lines never meet?'], 'different slopes, zero solutions?');
        } }] },
      { num: '14', shared: function (r) { var b = r.pick([[3, -6, 12], [3, -6, 12], [2, -4, 8], [4, 2, 8], [3, 9, 6], [5, -10, 15], [2, 6, -4], [4, -8, 12], [6, 3, 9], [3, -3, 6], [2, 4, 10], [6, -2, 8], [5, 5, -10], [4, 6, 2], [3, 12, -6], [8, -4, 12], [2, -10, 6], [9, 3, -6], [6, 9, 12], [10, 5, 15], [4, -12, 8], [3, 6, -9]]); return { G: line(b[0], b[1], -b[2]), n: eqT([[b[0], 'x'], [b[1], 'y']], b[2]) }; },
        stem: function (s) { return 'The equation ' + t(s.n) + ' is given. Write a <b>second</b> equation that pairs with it to make a system with:'; },
        parts: [writePartS('e14a', 'none', 'PRG', 'a'), writePartS('e14b', 'one', 'EMG', 'b'), writePartS('e14c', 'inf', 'PRG', 'c', { general: true })] },
      /* ---------- EP Part F: words ---------- */
      { num: '15', section: 'Extra practice F — Two situations in words',
        shared: function (r) { var rate = r.pick([25, 25, 20, 30, 35, 40]), fs = r.sample([40, 75, 50, 60, 25, 90], 2); return { rate: rate, F1: Math.min(fs[0], fs[1]), F2: Math.max(fs[0], fs[1]) }; },
        stem: function (s) { return 'Gym A charges a $' + s.F1 + ' joining fee plus $' + s.rate + ' per month. Gym B charges a $' + s.F2 + ' joining fee plus $' + s.rate + ' per month. Let ' + t('y') + ' be the total cost after ' + t('x') + ' months.'; },
        parts: [
          { id: 'e15a', sub: 'a', level: 'BEG', make: function (r, s) { var p = twoEq('Write an equation for each gym’s total cost.', [mbL(s.rate, s.F1), mbL(s.rate, s.F2)], ['Gym A:', 'Gym B:'], { wrong: [[{ is: mbL(s.F1, s.rate), code: 'u8-fee-rate', hint: 'The joining fee is paid once (the constant); the monthly fee multiplies ' + t('x') + '.' }], [{ is: mbL(s.F2, s.rate), code: 'u8-fee-rate', hint: 'The joining fee is paid once (the constant); the monthly fee multiplies ' + t('x') + '.' }]] }, 'Total = joining fee + (monthly fee)(months):<br>Gym A: ' + t(yT(s.rate, s.F1)) + '. Gym B: ' + t(yT(s.rate, s.F2)) + '.', ['Total cost = joining fee + monthly fee × number of months.'], 'gym equations'); return p; } },
          { id: 'e15b', sub: 'b', level: 'EMG', make: function (r, s) {
            var d = s.F2 - s.F1;
            return mc(r, 'Classify the system. What does the classification mean about the two gyms’ costs?', [
              { html: '<b>No solution</b>: same slope ' + t(s.rate) + ', different intercepts. Gym B always costs $' + d + ' more, so the totals are never equal.', right: true },
              { html: '<b>One solution</b>: after some number of months the costs become equal.', why: 'Both costs grow by $' + s.rate + ' a month, so the $' + d + ' gap never closes.', code: 'one' },
              { html: '<b>Infinitely many solutions</b>: both gyms charge $' + s.rate + ' a month, so they cost the same.', why: 'The slopes match but the intercepts (' + t(s.F1) + ' and ' + t(s.F2) + ') don’t: parallel lines.', code: 'inf' },
              { html: '<b>No solution</b>: the slopes are different.', why: 'Both slopes are ' + t(s.rate) + '. It is the intercepts that differ.', code: 'slopes' }],
              t(yT(s.rate, s.F1)) + ' and ' + t(yT(s.rate, s.F2)) + ': same slope, different ' + t('y') + '-intercepts — parallel lines, <b>no solution</b>. Gym B costs exactly $' + d + ' more every month, so the totals never become equal.', ['Compare the slopes, then the intercepts.'], 'gyms: classify and interpret');
          } }] },
      { num: '16', shared: function (r) { var F = r.pick([30, 30, 20, 25, 40]), h = r.pick([12, 12, 10, 15, 8]), M = r.pick([3, 3, 2, 4]); return { F: F, h: h, M: M, W: { 2: 'Two', 3: 'Three', 4: 'Four' }[M] }; },
        stem: function (s) { return 'A canoe rental is described two ways. <b>Clerk 1:</b> “It’s $' + s.F + ' to start plus $' + s.h + ' an hour.” <b>Clerk 2:</b> “' + s.W + ' times your total is $' + s.M * s.h + ' per hour plus $' + s.M * s.F + '.” Let ' + t('y') + ' be the total cost for ' + t('x') + ' hours.'; },
        parts: [
          { id: 'e16a', sub: 'a', level: 'EMG', make: function (r, s) {
            var L = mbL(s.h, s.F), k2 = s.M + 'y=' + s.M * s.h + 'x+' + s.M * s.F;
            var p = twoEq('Write an equation for each description.', [L, L], ['Clerk 1:', 'Clerk 2:'], { wrong: [[{ is: mbL(s.F, s.h), code: 'u8-fee-rate', hint: 'The $' + s.F + ' is paid once (the constant); the $' + s.h + ' is paid every hour, so it multiplies ' + t('x') + '.' }], [{ is: line(s.M * s.h, -1, s.M * s.F), code: 'u8l2-c-nomult', hint: '“' + s.W + ' times your total” is ' + t(s.M + 'y') + ', not ' + t('y') + '.' }]] }, 'Clerk 1: ' + t(yT(s.h, s.F)) + '.<br>Clerk 2: ' + s.W.toLowerCase() + ' times the total is ' + t(s.M + 'y') + ', so ' + t(k2) + '.', ['“' + s.W + ' times your total” means ' + t(s.M + 'y') + '.'], 'clerks: equations');
            p.key = [yT(s.h, s.F), k2]; p.answer = 'Clerk 1: ' + t(yT(s.h, s.F)) + '<br>Clerk 2: ' + t(k2) + ' (or any equivalent equation)'; p.bad = [[yT(s.h, s.F), yT(s.M * s.h, s.M * s.F)]];
            return p;
          } },
          { id: 'e16b', sub: 'b', level: 'EMG', make: function (r, s) {
            var k2 = s.M + 'y=' + s.M * s.h + 'x+' + s.M * s.F;
            return mc(r, 'Classify the system. What does the classification tell you about the two clerks?', [
              { html: '<b>Infinitely many solutions</b>: dividing ' + t(k2) + ' by ' + t(s.M) + ' gives ' + t(yT(s.h, s.F)) + '. The clerks describe the same price in different words.', right: true },
              { html: '<b>No solution</b>: Clerk 2’s numbers are bigger, so the lines are parallel.', why: 'Divide Clerk 2’s equation by ' + t(s.M) + ': it becomes Clerk 1’s equation exactly.', code: 'none' },
              { html: '<b>One solution</b>: the prices agree for only one number of hours.', why: 'The two equations are the same line, so the prices agree for every number of hours.', code: 'one' },
              { html: '<b>No solution</b>: the slopes ' + t(s.h) + ' and ' + t(s.M * s.h) + ' are different.', why: t(s.M * s.h) + ' is the slope of ' + t(s.M + 'y') + ', not of ' + t('y') + '. Divide by ' + t(s.M) + ' first.', code: 'slopes' }],
              t(k2) + ' ÷ ' + t(s.M) + ': ' + t(yT(s.h, s.F)) + ' — the same equation as Clerk 1’s. Same line: <b>infinitely many solutions</b>. The two clerks are describing the identical price.', ['Get ' + t('y') + ' by itself in Clerk 2’s equation.'], 'clerks: classify and interpret');
          } }] },
      /* ---------- EP Part G: stretch ---------- */
      { num: '17', section: 'Extra practice G — Stretch',
        shared: function (r) {
          var s = pick2(r, function (r) { return { m: r.pick([2, 2, 3, 1]), x12: r.int(1, 3), x23: r.int(2, 5), sum: r.pick([5, 5, 4, 6, 3]) }; },
            function (s) { if (s.x12 === s.x23) return false; s.y12 = s.sum - s.x12; s.y23 = s.sum - s.x23; s.b1 = s.y12 - s.m * s.x12; s.b3 = s.y23 - s.m * s.x23; return s.b1 !== s.b3 && s.b1 !== 0 && s.b3 !== 0; });
          s.L = [mbL(s.m, s.b1), line(1, 1, -s.sum), mbL(s.m, s.b3)]; s.g = [yT(s.m, s.b1), eqT([[1, 'x'], [1, 'y']], s.sum), eqT([[2 * s.m, 'x'], [-2, 'y']], -2 * s.b3)];
          return s;
        },
        stem: function (s) { return 'Three lines are given: ' + t('L_1:\\ ' + s.g[0]) + ', \\(\\quad\\) ' + t('L_2:\\ ' + s.g[1]) + ', \\(\\quad\\) ' + t('L_3:\\ ' + s.g[2]) + '.'; },
        parts: [
          { id: 'e17a', sub: 'a rewrite', level: 'EMG', outcome: 'RF6', make: function (r, s) { return twoEq('Write ' + t('L_2') + ' and ' + t('L_3') + ' in the form ' + t('y=mx+b') + '.', [s.L[1], s.L[2]], [t('L_2') + ':', t('L_3') + ':'], { form: 'slope-intercept', wrong: [rwWrong(1, 1, s.sum), rwWrong(2 * s.m, -2, -2 * s.b3)] }, rwSteps(1, 1, s.sum) + '<br>' + rwSteps(2 * s.m, -2, -2 * s.b3), ['Get ' + t('y') + ' by itself in each equation.'], 'rewrite L2 and L3'); } },
          { id: 'e17a2', sub: 'a pairs', level: 'PRG', make: function (r, s) {
            var want = { p12: 'one', p13: 'none', p23: 'one' };
            return K.P.grid('Classify each pair of lines.', [{ id: 'p12', html: t('L_1') + ' & ' + t('L_2') }, { id: 'p13', html: t('L_1') + ' & ' + t('L_3') }, { id: 'p23', html: t('L_2') + ' & ' + t('L_3') }],
              [{ id: 'one', html: 'one solution' }, { id: 'none', html: 'no solution' }, { id: 'inf', html: 'infinitely many' }], want, { why: function (row) { return { code: 'row', hint: 'Compare the slopes of that pair first, then (if they are equal) the intercepts.' }; } },
              t('L_1:\\ ' + si(s.L[0])) + ', ' + t('L_2:\\ ' + si(s.L[1])) + ', ' + t('L_3:\\ ' + si(s.L[2])) + '.<br>' + t('L_1') + ' & ' + t('L_2') + ': slopes ' + t(s.m) + ' and ' + t(-1) + ' — one solution.<br>' + t('L_1') + ' & ' + t('L_3') + ': slope ' + t(s.m) + ' both, intercepts ' + t(s.b1) + ' and ' + t(s.b3) + ' — no solution (parallel).<br>' + t('L_2') + ' & ' + t('L_3') + ': slopes ' + t(-1) + ' and ' + t(s.m) + ' — one solution.',
              ['Use the ' + t('y=mx+b') + ' forms: slopes first.'], 'classify three pairs');
          } },
          { id: 'e17b', sub: 'b solutions', level: 'PRG', make: function (r, s) {
            var pairs = [[0, 1, [s.x12, s.y12]], [1, 2, [s.x23, s.y23]]];
            var fields = [{ label: t('L_1') + ' & ' + t('L_2') + ':', mode: 'math', keys: 'point', placeholder: ' ' }, { label: t('L_2') + ' & ' + t('L_3') + ':', mode: 'math', keys: 'point', placeholder: ' ' }];
            var checkers = pairs.map(function (q) { return K.point(q[2], { system: [arr(s.L[q[0]]), arr(s.L[q[1]])] }); });
            var tab = function (q) { return t(si(s.L[q[0]])) + ' and ' + t(si(s.L[q[1]])) + ' meet at ' + ptt(q[2]) + ' (check: ' + t(subT([[fv(slopeOf(s.L[q[0]])), 'x'], [fv(yInt(s.L[q[0]])), '']], { x: q[2][0] }) + '=' + q[2][1]) + ', ' + t(subT([[fv(slopeOf(s.L[q[1]])), 'x'], [fv(yInt(s.L[q[1]])), '']], { x: q[2][0] }) + '=' + q[2][1]) + ').'; };
            var p = K.P.fields('Find the solution of each pair that has one.', fields, checkers, pairs.map(function (q) { return pt(q[2]); }), pairs.map(function (q, i) { return fields[i].label + ' ' + ptt(q[2]); }).join('<br>'),
              tab(pairs[0]) + '<br>' + tab(pairs[1]) + '<br>(Graph the lines, or make a table of values for each pair.)', ['Graph each pair, or make a table of values, and find the shared point.'], 'solutions of two pairs');
            p.bad = [[pt(pairs[1][2]), pt(pairs[0][2])]];
            return p;
          } },
          { id: 'e17c', sub: 'b all three', level: 'MAS', make: function (r, s) {
            return mc(r, 'Is there a single point that lies on <b>all three</b> lines? How does part (a) settle it without more algebra?', [
              { html: '<b>No</b> — a point on all three would be on both ' + t('L_1') + ' and ' + t('L_3') + ', but they are parallel and share no point.', right: true },
              { html: '<b>Yes</b> — ' + ptt([s.x12, s.y12]) + ' is on all three lines.', why: 'Test it in ' + t('L_3') + ': ' + t(subT([[2 * s.m, 'x'], [-2, 'y']], { x: s.x12, y: s.y12 }) + '=' + (2 * s.m * s.x12 - 2 * s.y12)) + ', not ' + t(-2 * s.b3) + '. And ' + t('L_1') + ', ' + t('L_3') + ' are parallel.', code: 'p12' },
              { html: '<b>Yes</b> — two of the pairs have one solution each, so the lines must share a point.', why: 'The two crossing points ' + ptt([s.x12, s.y12]) + ' and ' + ptt([s.x23, s.y23]) + ' are different points.', code: 'two' },
              { html: '<b>No</b> — three lines can never pass through one point.', why: 'They can (many lines pass through one point). Here it is impossible because ' + t('L_1') + ' and ' + t('L_3') + ' are parallel.', code: 'never' }],
              'A point on all three lines would have to lie on ' + t('L_1') + ' <b>and</b> ' + t('L_3') + '. Those two are parallel (no solution), so no such point exists. (Indeed ' + t('L_1') + ' & ' + t('L_2') + ' meet at ' + ptt([s.x12, s.y12]) + ' and ' + t('L_2') + ' & ' + t('L_3') + ' at ' + ptt([s.x23, s.y23]) + ' — two different points.)',
              ['Which pair from part (a) has no solution?'], 'common point of three lines');
          } }] }
  ];

  HW.defineLesson({
    id: 'u8l2', unit: 8, num: '2', title: 'Classifying Systems: One Solution, No Solution, or Infinite Solutions', outcome: 'RF9',
    blurb: 'Tell from a graph, or from the slopes and y-intercepts, whether a system has one solution, no solution, or infinitely many — and build systems of each kind.',
    questions: [
      /* ---------- Part A ---------- */
      { num: '1', section: 'Part A — Graph and classify', shared: function (r) { return ysys(r, [1, 1, 2, 3], [-2, -2, -1, -3], { xlo: -3, xhi: 3, test: function (s, b1, b2) { return s.x0 !== 0 && b1 !== 0 && b2 !== 0; } }); },
        stem: function (s) { return 'Consider the system ' + t(s.n1) + ' and ' + t(s.n2) + '.'; },
        parts: [
          { id: '1a', sub: 'a', level: 'BEG', make: function (r, s) { return slopeFields(s.m1, s.b1, s.m2, s.b2); } },
          { id: '1b', sub: 'b', level: 'BEG', make: function (r, s) { return sysGraph('Graph both lines on the grid.', [s.L1, s.L2], [s.n1, s.n2], W6, {}, graphSol([s.n1, s.n2], [s.m1, s.m2], [s.b1, s.b2], s.P), GH, 'graph one-solution system'); } },
          { id: '1c', sub: 'c', level: 'BEG', make: function (r, s) {
            return pointPart('How many solutions does the system have? If there is exactly one, give it as an ordered pair; otherwise use the <b>no solution</b> or <b>infinitely many</b> key.', s.P, [s.L1, s.L2], {},
              'The slopes ' + t(s.m1) + ' and ' + t(s.m2) + ' are different, so the lines cross once: <b>one solution</b>, ' + ptt(s.P) + '.<br>Check: ' + t(subT([[s.m1, 'x'], [s.b1, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓ and ' + t(subT([[s.m2, 'x'], [s.b2, '']], { x: s.x0 }) + '=' + s.y0) + ' ✓',
              ['Where do your two lines cross?'], 'count: one solution');
          } }] },
      { num: '2', shared: function (r) {
          var s = pick2(r, function (r) { var bs = r.sample([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], 2); return { m: r.pick([-1, -1, 1, 2, -2]), b1: Math.max(bs[0], bs[1]), b2: Math.min(bs[0], bs[1]) }; }, function (s) { return s.b1 - s.b2 >= 3 && latS(mbL(s.m, s.b1), W6).length >= 3 && latS(mbL(s.m, s.b2), W6).length >= 3; });
          s.L1 = mbL(s.m, s.b1); s.L2 = mbL(s.m, s.b2); s.n1 = yT(s.m, s.b1); s.n2 = yT(s.m, s.b2);
          return s;
        },
        stem: function (s) { return 'Consider the system ' + t(s.n1) + ' and ' + t(s.n2) + '.'; },
        parts: [
          { id: '2a', sub: 'a', level: 'BEG', make: function (r, s) { return slopeFields(s.m, s.b1, s.m, s.b2); } },
          { id: '2b', sub: 'b', level: 'BEG', make: function (r, s) { return sysGraph('Graph both lines on the grid.', [s.L1, s.L2], [s.n1, s.n2], W6, {}, 'Both lines have slope ' + t(s.m) + '. Start them at ' + ptt([0, s.b1]) + ' and ' + ptt([0, s.b2]) + ' and step ' + stepT(s.m) + ': the lines are parallel.', GH, 'graph parallel lines'); } },
          { id: '2c', sub: 'c', level: 'BEG', make: function (r, s) {
            return clsPart(r, 'State the number of solutions, and why the lines never cross.', s.L1, s.L2, s.n1, s.n2, 'classify parallel (graphed)');
          } }] },
      { num: '3', shared: function (r) {
          var s = pick2(r, function (r) { return { a: r.pick([1, 1, 2, -1, 3]), c: r.pick([2, 2, -3, -2, 1, 3, 4, -1]), k: r.pick([2, 2, 3]) }; }, function (s) { return latS(line(s.a, -1, -s.c), W6).length >= 3; });
          s.L = line(s.a, -1, -s.c); s.g1 = eqT([[s.a, 'x'], [-1, 'y']], s.c); s.g2 = eqT([[s.k * s.a, 'x'], [-s.k, 'y']], s.k * s.c); s.n = si(s.L);
          return s;
        },
        stem: function (s) { return 'Consider the system ' + t(s.g1) + ' and ' + t(s.g2) + '.'; },
        parts: [
          { id: '3a', sub: 'a', level: 'EMG', outcome: 'RF6', make: function (r, s) {
            return twoEq('Rewrite both equations in slope–intercept form.', [s.L, s.L], [t(s.g1) + ':', t(s.g2) + ':'], { form: 'slope-intercept', wrong: [rwWrong(s.a, -1, s.c), rwWrong(s.k * s.a, -s.k, s.k * s.c)] },
              rwSteps(s.a, -1, s.c) + '<br>' + rwSteps(s.k * s.a, -s.k, s.k * s.c) + '<br>Both give the same equation.', ['Get ' + t('y') + ' by itself, then divide <b>every</b> term by its coefficient.'], 'rewrite both (same line)');
          } },
          { id: '3b', sub: 'b', level: 'EMG', make: function (r, s) { return sysGraph('Graph both lines on the grid.', [s.L, s.L], [s.g1, s.g2], W6, {}, 'Both equations are ' + t(s.n) + ', so both graphs are the same line: start at ' + ptt([0, s.c === 0 ? 0 : -s.c]) + ' and step ' + stepT(s.a) + '. Draw it once.', ['Use your answers to part (a).', 'If both equations give the same line, draw it once.'], 'graph coincident lines'); } },
          { id: '3c', sub: 'c', level: 'BEG', make: function (r, s) {
            return pointPart('State the number of solutions. If there is exactly one, give it as an ordered pair; otherwise use the <b>no solution</b> or <b>infinitely many</b> key.', 'inf', [s.L, s.L], {},
              'Both equations are ' + t(s.n) + ': the same line, so every point on it is a solution — <b>infinitely many solutions</b>.', ['Look at your graph: how many points do the two lines share?'], 'count: same line');
          } }] },
      /* ---------- Part B ---------- */
      { num: '4', section: 'Part B — Classifying without graphing', stem: 'Without graphing, state whether each system has one solution, no solution, or infinitely many solutions.',
        parts: [
          { id: '4a', sub: 'a', level: 'BEG', make: function (r) { var m = r.pick([-3, -3, 2, -2, 4, 3, -4]), bs = r.sample([7, 1, -2, 5, 3, -4, 6, -1], 2), L1 = mbL(m, bs[0]), L2 = mbL(m, bs[1]); return clsPart(r, '(a) ' + t(yT(m, bs[0])) + ', \\(\;\\) ' + t(yT(m, bs[1])), L1, L2, yT(m, bs[0]), yT(m, bs[1]), 'classify parallel'); } },
          { id: '4b', sub: 'b', level: 'BEG', make: function (r) { var ms = r.sample([6, -2, 3, -4, 5, -1], 2), b1 = r.pick([-5, -3, 2, 4]), b2 = r.pick([11, 7, -6, 9, 3]), L1 = mbL(ms[0], b1), L2 = mbL(ms[1], b2); return clsPart(r, '(b) ' + t(yT(ms[0], b1)) + ', \\(\;\\) ' + t(yT(ms[1], b2)), L1, L2, yT(ms[0], b1), yT(ms[1], b2), 'classify crossing'); } },
          { id: '4c', sub: 'c', level: 'BEG', make: function (r) { var m = r.pick([-5, -5, 2, -3, 4, 3, -2, 5, 6]), b = r.pick([3, 3, -1, 6, -4, 7, 2, -5, 8]), L = mbL(m, b); return clsPart(r, '(c) ' + t(yT(m, b)) + ', \\(\;\\) ' + t(yT(m, b)), L, L, yT(m, b), yT(m, b), 'classify identical', '<b>No solution</b> — the two equations are identical, so there is nothing to solve.'); } },
          { id: '4d', sub: 'd', level: 'EMG', make: function (r) { var hs = r.sample([4, -2, 3, -5, 1, 6, -3], 2), L1 = line(0, 1, -hs[0]), L2 = line(0, 1, -hs[1]); return clsPart(r, '(d) ' + t('y=' + hs[0]) + ', \\(\;\\) ' + t('y=' + hs[1]), L1, L2, 'y=' + hs[0], 'y=' + hs[1], 'classify horizontal lines', null,
            t('y=' + hs[0]) + ' and ' + t('y=' + hs[1]) + ' are horizontal lines: both have slope ' + t('0') + ' (' + t('y=0x+' + hs[0]).replace('+-', '-') + '), with different ' + t('y') + '-intercepts.<br>' + verdictT('none')); } }] },
      { num: '5', stem: 'Rearrange each system into slope–intercept form, then state whether it has one solution, no solution, or infinitely many solutions.',
        shared: function (r) {
          var a = { A: r.pick([3, 3, 2, 4, 5]), c1: r.pick([5, 5, 2, -1, 4, -3]), c2: r.pick([9, 9, 1, -2, 6, 7]) }; if (a.c1 === a.c2) a.c2 = a.c1 + 4;
          a.L1 = line(a.A, 1, -a.c1); a.L2 = mbL(-a.A, a.c2); a.g1 = eqT([[a.A, 'x'], [1, 'y']], a.c1); a.n2 = yT(-a.A, a.c2);
          var b = { c: r.pick([6, 6, 2, 3, -4, 5, -1, 4, -3, 1, -2, -5]), k: r.pick([2, 2, 3, 4]) }; b.L = line(1, -1, -b.c); b.g1 = eqT([[1, 'x'], [-1, 'y']], b.c); b.g2 = eqT([[b.k, 'x'], [-b.k, 'y']], b.k * b.c);
          var c = { A: r.pick([4, 4, 2, 3, 5]), c1: r.pick([1, 1, 2, 3, -2]), c2: r.pick([9, 9, 4, 6, 7]) }; c.L1 = line(c.A, -1, -c.c1); c.L2 = line(1, 1, -c.c2); c.g1 = eqT([[c.A, 'x'], [-1, 'y']], c.c1); c.g2 = eqT([[1, 'x'], [1, 'y']], c.c2);
          return { a: a, b: b, c: c };
        },
        parts: [
          { id: '5a1', sub: 'a rewrite', level: 'BEG', outcome: 'RF6', make: function (r, sh) { var a = sh.a; return rw('(a) ' + t(a.g1) + ', \\(\;\\) ' + t(a.n2) + '<br>Rewrite ' + t(a.g1) + ' in slope–intercept form.', a.A, 1, a.c1); } },
          { id: '5a2', sub: 'a classify', level: 'EMG', make: function (r, sh) { var a = sh.a; return clsPart(r, '(a) ' + t(a.g1) + ', \\(\;\\) ' + t(a.n2) + '<br>How many solutions does the system have?', a.L1, a.L2, a.g1, a.n2, 'classify after rewriting (parallel)', '<b>One solution</b> — one equation is in standard form and the other is not.'); } },
          { id: '5b1', sub: 'b rewrite', level: 'EMG', outcome: 'RF6', make: function (r, sh) { var b = sh.b; return twoEq('(b) ' + t(b.g1) + ', \\(\;\\) ' + t(b.g2) + '<br>Rewrite both equations in slope–intercept form.', [b.L, b.L], [t(b.g1) + ':', t(b.g2) + ':'], { form: 'slope-intercept', wrong: [rwWrong(1, -1, b.c), rwWrong(b.k, -b.k, b.k * b.c)] }, rwSteps(1, -1, b.c) + '<br>' + rwSteps(b.k, -b.k, b.k * b.c), ['Divide <b>every</b> term by the coefficient of ' + t('y') + '.'], 'rewrite both (same line)'); } },
          { id: '5b2', sub: 'b classify', level: 'EMG', make: function (r, sh) { var b = sh.b; return clsPart(r, '(b) ' + t(b.g1) + ', \\(\;\\) ' + t(b.g2) + '<br>How many solutions does the system have?', b.L, b.L, b.g1, b.g2, 'classify after rewriting (same line)'); } },
          { id: '5c1', sub: 'c rewrite', level: 'BEG', outcome: 'RF6', make: function (r, sh) { var c = sh.c; return twoEq('(c) ' + t(c.g1) + ', \\(\;\\) ' + t(c.g2) + '<br>Rewrite both equations in slope–intercept form.', [c.L1, c.L2], [t(c.g1) + ':', t(c.g2) + ':'], { form: 'slope-intercept', wrong: [rwWrong(c.A, -1, c.c1), rwWrong(1, 1, c.c2)] }, rwSteps(c.A, -1, c.c1) + '<br>' + rwSteps(1, 1, c.c2), ['Get ' + t('y') + ' by itself in each equation.'], 'rewrite both (crossing)'); } },
          { id: '5c2', sub: 'c classify', level: 'BEG', make: function (r, sh) { var c = sh.c; return clsPart(r, '(c) ' + t(c.g1) + ', \\(\;\\) ' + t(c.g2) + '<br>How many solutions does the system have?', c.L1, c.L2, c.g1, c.g2, 'classify after rewriting (crossing)'); } }] },
      /* ---------- Part C ---------- */
      { num: '6', section: 'Part C — Explain and build', parts: [
        { id: '6', level: 'BEG', make: function (r) {
          var a = ysys(r, [1, 2, [1, 2]], [-1, -2], {}), m = r.pick([1, -1, 2, [1, 2]]), bb = r.sample([-3, -1, 2, 4], 2), c = mbL(r.pick([-1, 1, -2]), r.pick([-2, 1, 3]));
          var rows = r.shuffle([{ id: 'one', g: tinyGraph([a.L1, a.L2], 'one'), d: 'The lines cross at one point.' }, { id: 'none', g: tinyGraph([mbL(m, bb[0]), mbL(m, bb[1])], 'none'), d: 'The lines are parallel: they never touch.' }, { id: 'inf', g: tinyGraph([c, c], 'inf'), d: 'One line lies exactly on top of the other.' }]), want = {};
          rows.forEach(function (x) { want[x.id] = x.id; });
          return K.P.grid('How can you tell from the graph of a system how many solutions it has? Match each graph with its number of solutions. (In the last kind of graph the dashed line lies right on top of the grey one.)',
            rows.map(function (x) { return { id: x.id, html: '<div style="display:flex;align-items:center;gap:8px">' + x.g + '<span>' + x.d + '</span></div>' }; }),
            [{ id: 'one', html: 'one solution' }, { id: 'none', html: 'no solution' }, { id: 'inf', html: 'infinitely many' }], want, { why: function (row) { return { code: 'row', hint: row === 'one' ? 'Lines that cross share exactly one point.' : row === 'none' ? 'Parallel lines never meet, so no point is on both.' : 'Lines on top of each other share <b>every</b> point.' }; } },
            '<b>Cross at one point</b> → one solution (the crossing point).<br><b>Parallel, never touching</b> → no solution.<br><b>One line on top of the other</b> → infinitely many solutions (every point of the line).', ['The solutions are the points the two lines share.'], 'classify from a graph (grid)');
        } }] },
      { num: '7', parts: [
        { id: '7', level: 'BEG', make: function (r) {
          var m1 = r.pick([2, 3, -1, -2, 4]), m2 = r.pick([-3, 1, 5, -4].filter(function (v) { return v !== m1; })), bs = r.sample([-5, -2, 1, 3, 4, 6], 3), mm = r.pick([2, -3, 4, -1]);
          var rows = r.shuffle([
            { id: 'r1', html: t('m_1=' + m1 + ',\\ m_2=' + m2) + '; ' + t('b_1=' + bs[0] + ',\\ b_2=' + bs[1]), w: 'one' },
            { id: 'r2', html: t('m_1=' + mm + ',\\ m_2=' + mm) + '; ' + t('b_1=' + bs[0] + ',\\ b_2=' + bs[2]), w: 'none' },
            { id: 'r3', html: t('m_1=' + mm + ',\\ m_2=' + mm) + '; ' + t('b_1=' + bs[1] + ',\\ b_2=' + bs[1]), w: 'inf' },
            { id: 'r4', html: t('m_1=' + m2 + ',\\ m_2=' + m1) + '; ' + t('b_1=' + bs[2] + ',\\ b_2=' + bs[2]), w: 'one' }]), want = {};
          rows.forEach(function (x) { want[x.id] = x.w; });
          return K.P.grid('How can you tell, once a system is written as ' + t('y=mx+b') + ', how many solutions it has? Classify each system from its slopes and ' + t('y') + '-intercepts.',
            rows.map(function (x) { return { id: x.id, html: x.html }; }), [{ id: 'one', html: 'one solution' }, { id: 'none', html: 'no solution' }, { id: 'inf', html: 'infinitely many' }], want,
            { why: function (row) { var x = rows.filter(function (q) { return q.id === row; })[0]; return { code: 'row', hint: x.w === 'one' ? 'Compare the slopes first: they are different, so the lines cross once — the intercepts don’t matter.' : x.w === 'none' ? 'Same slope, but different intercepts: parallel lines.' : 'Same slope <b>and</b> same intercept: the same line.' }; } },
            'Compare the slopes first: <b>different</b> → one solution (stop there — the intercepts don’t matter).<br>If the slopes are <b>equal</b>, compare the ' + t('y') + '-intercepts: different → no solution (parallel); equal → infinitely many (the same line).',
            ['Slopes first. Only look at the intercepts when the slopes are equal.'], 'classify from m and b (grid)');
        } }] },
      { num: '8', shared: function (r) { var m = r.pick([2, 2, 3, -2, -3, 4]), b = r.pick([-5, -5, -1, 3, 4, -2, 6]); return { m: m, b: b, G: mbL(m, b), n: yT(m, b) }; },
        stem: function (s) { return 'The equation ' + t(s.n) + ' is given. Write a second equation that pairs with it to form a system with:'; },
        parts: [
          writePartS('8a', 'none', 'EMG', 'a'), writePartS('8b', 'one', 'BEG', 'b'), writePartS('8c', 'inf', 'PRG', 'c')] },
      /* ---------- Part D ---------- */
      { num: '9', section: 'Part D — Multiple choice and numerical response', parts: [
        { id: '9', level: 'LIM', make: function (r) {
          var m = r.pick([-4, -4, 3, -2, 5, 2]), bs = r.sample([7, -2, 4, -5, 1, 9], 2), L1 = mbL(m, bs[0]), L2 = mbL(m, bs[1]);
          return mc(r, 'The system ' + t(yT(m, bs[0])) + ', ' + t(yT(m, bs[1])) + ' has', [
            { html: 'no solution', right: true },
            { html: 'one solution', why: 'Both slopes are ' + t(m) + ': the lines are parallel and never cross.', code: 'one' },
            { html: 'infinitely many solutions', why: 'The slopes match, but the ' + t('y') + '-intercepts ' + t(bs[0]) + ' and ' + t(bs[1]) + ' differ: two different (parallel) lines.', code: 'inf' },
            { html: 'two solutions', why: 'Two lines can never share exactly two points: the only possibilities are 0, 1 or infinitely many.', code: 'two' }],
            clsSol(L1, L2, yT(m, bs[0]), yT(m, bs[1])), ['Compare the slopes, then the ' + t('y') + '-intercepts.'], 'MC classify parallel', true);
        } }] },
      { num: '10', parts: [
        { id: '10', level: 'ADV', make: function (r) {
          var s = pick2(r, function (r) { return { a: r.pick([3, 3, 1, 2, 5]), b: r.pick([2, 2, 1, 3]), c: r.pick([9, 9, 4, 6, 7, 10]), m: r.pick([2, 2, 3]) }; }, function (s) { return gcd(s.a, s.b) === 1 && gcd(gcd(s.a, s.b), s.c) === 1 && s.a !== s.b; });
          var e1 = s.a + 'x+ky=' + s.c, e2 = eqT([[s.m * s.a, 'x'], [s.m * s.b, 'y']], s.m * s.c);
          return K.P.nr('The value of ' + t('k') + ', ' + t('k\\in N') + ', for which the system ' + t(e1) + ' and ' + t(e2) + ' has infinitely many solutions, is ____.', s.b,
            function (v) { if (v === s.m * s.b && v !== s.b) return { code: 'u8-k-ycoef', hint: 'The second equation is ' + t(s.m) + ' times the first. Divide its ' + t('y') + '-coefficient by ' + t(s.m) + ' too.' }; if (v === s.a) return { code: 'u8-k-xcoef', hint: 'That is the ' + t('x') + '-coefficient. Infinitely many solutions needs the second equation to be a multiple of the first <b>term by term</b>.' }; return null; },
            'Infinitely many solutions means the same line: one equation is a multiple of the other.<br>' + t(e2) + ' is ' + t(s.m) + ' times ' + t(eqT([[s.a, 'x'], [s.b, 'y']], s.c)) + ' (' + t(s.m * s.a + '\\div' + s.a + '=' + s.m) + ', ' + t(s.m * s.c + '\\div' + s.c + '=' + s.m) + '), so the ' + t('y') + '-coefficient must be ' + t(s.m * s.b + '\\div' + s.m + '=' + s.b) + ': ' + t('\\mathbf{k=' + s.b + '}') + '.',
            ['Infinitely many solutions: one equation is a multiple of the other.', 'Find the multiplier from the ' + t('x') + '-terms (or the constants).'], 'NR k for infinitely many');
        } }] },
      { num: '11', parts: [
        { id: '11', level: 'ADV', make: function (r) {
          var s = pick2(r, function (r) { return { p: r.pick([3, 3, 2, 4, 5]), q: 1, Q: r.pick([2, 2, 3]), r0: r.pick([4, 4, 3, 5, 6, 7]), s0: r.pick([10, 10, 9, 8, 12, 15]) }; }, function (s) { return s.s0 !== s.Q * s.r0 && s.s0 % s.Q === 0; });
          var a = s.Q * s.p, e1 = 'ax+' + s.Q + 'y=' + s.s0, e2 = eqT([[s.p, 'x'], [1, 'y']], s.r0);
          return K.P.nr('The value of ' + t('a') + ', ' + t('a\\in N') + ', for which the system ' + t(e1) + ' and ' + t(e2) + ' has no solution, is ____.', a,
            function (v) { if (v === s.p) return { code: 'u8-k-xcoef', hint: 'With ' + t('a=' + s.p) + ' the slopes are ' + t(fT(fr(-s.p, s.Q))) + ' and ' + t(-s.p) + ' — not equal. Rewrite ' + t(e1) + ' as ' + t('y=-\\frac{a}{' + s.Q + '}x+' + s.s0 / s.Q) + ' and set the slopes equal.' }; if (v * s.Q === s.p) return { code: 'u8-k-div', hint: 'Set the slopes equal: ' + t('-\\frac{a}{' + s.Q + '}=' + (-s.p)) + ', so multiply by ' + t(s.Q) + '.' }; return null; },
            t(e2) + ' is ' + t(yT(-s.p, s.r0)) + ': slope ' + t(-s.p) + ', ' + t('y') + '-intercept ' + t(s.r0) + '.<br>' + t(e1) + ' is ' + t('y=-\\frac{a}{' + s.Q + '}x+' + s.s0 / s.Q) + ': ' + t('y') + '-intercept ' + t(s.s0 / s.Q) + ' — already different.<br>No solution needs equal slopes: ' + t('-\\frac{a}{' + s.Q + '}=' + (-s.p)) + ', so ' + t('\\mathbf{a=' + a + '}') + '.',
            ['No solution: equal slopes, different ' + t('y') + '-intercepts.', 'Rewrite both equations as ' + t('y=mx+b') + '.'], 'NR a for no solution');
        } }] },
      /* ---------- Part E ---------- */
      { num: '12', section: 'Part E — Applications and reasoning', shared: function (r) { var m = r.pick([5, 5, 3, 4, -2, 2]), b = r.pick([-2, -2, 1, 3, -4, 5]), k = r.pick([2, 2, 3]); return { m: m, b: b, k: k, n1: yT(m, b), g2: eqT([[k * m, 'x'], [-k, 'y']], -k * b), L: mbL(m, b) }; },
        stem: function (s) { return 'Keisha says the system ' + t(s.n1) + ' and ' + t(s.g2) + ' has no solution because the two equations look different.'; },
        parts: [
          { id: '12a', sub: 'a', level: 'BEG', outcome: 'RF6', make: function (r, s) { return rw('Rewrite ' + t(s.g2) + ' in slope–intercept form.', s.k * s.m, -s.k, -s.k * s.b); } },
          { id: '12b', sub: 'b', level: 'EMG', make: function (r, s) {
            return mc(r, 'Is Keisha correct?', [
              { html: '<b>No</b> — ' + t(s.g2) + ' rearranges to ' + t(s.n1) + ': the same line, so the system has infinitely many solutions.', right: true },
              { html: '<b>Yes</b> — equations that look different are different lines, and these are parallel.', why: 'Rearrange ' + t(s.g2) + ': you get exactly ' + t(s.n1) + '.', code: 'yes' },
              { html: '<b>No</b> — the slopes are different, so the system has one solution.', why: 'Both equations have slope ' + t(s.m) + ' once ' + t(s.g2) + ' is rearranged.', code: 'one' },
              { html: '<b>Yes</b> — the constants ' + t(s.b) + ' and ' + t(-s.k * s.b) + ' are different, so the lines are parallel.', why: 'The constants differ only because the whole equation was multiplied by ' + t(s.k) + '. The ' + t('y') + '-intercepts are both ' + t(s.b) + '.', code: 'const' }],
              t(s.g2) + ' → ' + t(T([[-s.k, 'y']]) + '=' + T([[-s.k * s.m, 'x'], [-s.k * s.b, '']])) + ' → ' + t(s.n1) + '.<br>Same slope (' + t(s.m) + ') and same ' + t('y') + '-intercept (' + t(s.b) + '): one line written two ways. Keisha is wrong — the system has <b>infinitely many solutions</b>.',
              ['Rearrange the second equation before you decide.'], 'Keisha: looks different');
          } }] },
      { num: '13', parts: [
        { id: '13', level: 'EMG', make: function (r) {
          var rate = r.pick([0.1, 0.1, 0.05, 0.15, 0.2, 0.25]), fs = r.sample([5, 8, 10, 12, 15, 20], 2), F1 = Math.min(fs[0], fs[1]), F2 = Math.max(fs[0], fs[1]), rT = rate.toFixed(2), d = F2 - F1;
          return mc(r, 'Texting Plan A costs ' + t('y=' + rT + 'x+' + F1) + ' dollars per month (where ' + t('x') + ' is the number of texts sent), and Plan B costs ' + t('y=' + rT + 'x+' + F2) + '. Without solving algebraically, is there a number of texts for which the two plans cost the same?', [
            { html: '<b>No</b> — both slopes are ' + t(rT) + ' but the ' + t('y') + '-intercepts are ' + t(F1) + ' and ' + t(F2) + ': parallel lines, so Plan B always costs $' + d + ' more.', right: true },
            { html: '<b>Yes</b> — the slopes are equal, so the costs are equal.', why: 'Equal slopes means the costs grow at the same rate; they started $' + d + ' apart, so they stay $' + d + ' apart.', code: 'same' },
            { html: '<b>Yes</b> — any two lines cross somewhere if you go far enough.', why: 'Only lines with <b>different</b> slopes must cross. These have the same slope ' + t(rT) + '.', code: 'far' },
            { html: '<b>No</b> — the slopes are different.', why: 'Both slopes are ' + t(rT) + ' (the cost per text). It is the intercepts that differ.', code: 'slopes' }],
            'Slopes: ' + t(rT) + ' and ' + t(rT) + ' — equal. Intercepts: ' + t(F1) + ' and ' + t(F2) + ' — different. Parallel lines never meet: <b>no solution</b>. Both plans add $' + rT + ' per text, so Plan B is always $' + d + ' more.',
            ['Compare the slopes, then the ' + t('y') + '-intercepts.'], 'texting plans');
        } }] },
      { num: '14', shared: function (r) {
          var s = pick2(r, function (r) { return { a: r.pick([3, 3, 2, 4]), b: r.pick([5, 5, 4, 6, 7]), F: r.pick([4, 4, 2, 6, 8, 3, 9, 10]) }; }, function (s) { var x = s.F / (s.b - s.a); return s.b > s.a && Number.isInteger(x) && x >= 1 && x <= 6; });
          s.x0 = s.F / (s.b - s.a); s.y0 = s.b * s.x0; s.n1 = 'y=' + s.a + 'x+' + s.F; s.n2 = 'y=' + s.b + 'x';
          return s;
        },
        stem: function (s) { return 'A downtown parking garage charges ' + t(s.n1) + ' dollars (where ' + t('x') + ' is the number of hours parked). A nearby lot charges ' + t(s.n2) + ' dollars.'; },
        parts: [
          { id: '14a', sub: 'a', level: 'BEG', make: function (r, s) {
            return mc(r, 'Is there a number of hours for which the two costs are the same?', [
              { html: '<b>Yes</b> — the slopes ' + t(s.a) + ' and ' + t(s.b) + ' are different, so the lines cross exactly once.', right: true },
              { html: '<b>No</b> — the garage has a fee and the lot doesn’t, so the garage always costs more.', why: 'The lot costs more per hour, so it catches up. Different slopes means the lines cross once.', code: 'fee' },
              { html: '<b>No</b> — the lines are parallel.', why: 'Parallel lines have equal slopes; here they are ' + t(s.a) + ' and ' + t(s.b) + '.', code: 'par' },
              { html: '<b>Yes</b> — for every number of hours.', why: 'That would need the same line (same slope and same intercept).', code: 'all' }],
              'Slopes ' + t(s.a) + ' and ' + t(s.b) + ' are different, so the lines cross once: there is exactly one number of hours with equal costs.', ['Compare the slopes.'], 'parking: one solution?');
          } },
          { id: '14b', sub: 'b', level: 'PRG', make: function (r, s) {
            var p = numFields('Find the number of hours, and the cost then.', ['Hours:', 'Cost ($):'], [s.x0, s.y0], [function (v) { if (v === s.y0) return { code: 'u8l2-hours', hint: 'That is the cost. The hours are the ' + t('x') + '-value where ' + t(s.a + 'x+' + s.F + '=' + s.b + 'x') + '.' }; return null; }, function (v) { if (v === s.a * s.x0) return { code: 'u8l2-cost', hint: 'Include the garage’s $' + s.F + ': ' + t(s.a + '(' + s.x0 + ')+' + s.F) + '.' }; return null; }],
              'Both costs are ' + t('y') + ', so set them equal: ' + t(s.a + 'x+' + s.F + '=' + s.b + 'x') + '.<br>Subtract ' + t(s.a + 'x') + ': ' + t(s.F + '=' + (s.b - s.a) + 'x') + ', so ' + t('x=' + s.x0) + '.<br>Cost: ' + t(s.b + '(' + s.x0 + ')=' + s.y0) + ' (check: ' + t(s.a + '(' + s.x0 + ')+' + s.F + '=' + s.y0) + ' ✓).<br>After ' + s.x0 + ' h both cost $' + s.y0 + '.',
              ['Both expressions equal ' + t('y') + ': set ' + t(s.a + 'x+' + s.F + '=' + s.b + 'x') + ' and solve for ' + t('x') + '. (Or make a table of values for both.)'], 'parking: hours and cost');
            p.bad = [[String(s.y0), String(s.x0)]];
            return p;
          } }] },
      { num: '15', parts: [
        { id: '15', level: 'ADV', make: function (r) {
          var s = pick2(r, function (r) { return { B: r.pick([2, 2, 3, 4]), m: r.pick([2, 2, 1, 3, -1, -2]), d: r.pick([-3, -3, -2, -1, 1, 2, 4, 5]) }; }, function () { return true; });
          var A = s.B * s.m, sgn = A > 0 ? 1 : -1, a = sgn * A, b = -sgn * s.B, c = -sgn * s.B * s.d;   // a x + b y = c, a > 0
          var e1 = eqT([[a, 'x'], [b, 'y']], 0).replace(/=0$/, '=c');
          return K.P.number('Determine the value of ' + t('c') + ' for which the system ' + t(e1) + ' and ' + t(yT(s.m, s.d)) + ' has infinitely many solutions.', c,
            function (v) { if (v === -c) return { code: 'u8-c-sign', hint: 'Check the sign: substitute ' + t('y=' + T([[s.m, 'x'], [s.d, '']])) + ' into ' + t(e1) + ' carefully, or rewrite ' + t(e1) + ' as ' + t('y=mx+b') + '.' }; if (v === s.d && c !== s.d) return { code: 'u8l2-c-nomult', hint: 'Multiply ' + t(yT(s.m, s.d)) + ' through by the same number that turns its ' + t('y') + '-term into ' + t(T([[b, 'y']])) + ' — the constant too.' }; return null; },
            'Infinitely many solutions means the same line. Write ' + t(yT(s.m, s.d)) + ' in the form of the first equation: move ' + t(T([[s.m, 'x']])) + ' across, ' + t(T([[-s.m, 'x'], [1, 'y']]) + '=' + s.d) + ', then multiply every term by ' + t(b) + ': ' + t(eqT([[a, 'x'], [b, 'y']], c)) + '.<br>So ' + t('\\mathbf{c=' + c + '}') + '. (Check: ' + t(eqT([[a, 'x'], [b, 'y']], c)) + ' rearranges to ' + t(yT(s.m, s.d)) + '.)',
            ['Rewrite ' + t(e1) + ' as ' + t('y=mx+b') + ' (with ' + t('c') + ' in it) and match the ' + t('y') + '-intercepts.', 'Or multiply ' + t(yT(s.m, s.d)) + ' to match the ' + t('x') + '- and ' + t('y') + '-terms of the first equation.'], 'c for infinitely many', { before: t('c=') });
        } }] }
    ],
    extra: L2EXTRA
  });
})(window);
