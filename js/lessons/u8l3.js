/* Math 15 · Unit 8 · Lesson 3 — Solving Systems by Substitution, Part 1: When a Variable Is Already Isolated (RF9)
 * Assignment 3 (u8_L03.tex, Questions 1–6) and the Lesson 3 Extra Practice (u8_EP03.tex, Questions 1–19).
 * Every part is a generator: same structure, idea and difficulty as the booklet question (the booklet's numbers are among
 * the possible values), new numbers from the seed. Model: Math 10C u8l2.js (substitution: worked solution step by step,
 * the point keypad, dropped-bracket diagnosis, exact answers) and the Math 15 u8l1.js helpers (copied here).
 * "By substitution": the checker can't see the method, so Question 1, Extra 4(a) and Extra 6 first ask for the equation
 * in one variable you get right after substituting (any equivalent one-variable equation is accepted; the solved value
 * alone gets a nudge), then the solution. Other "solve" parts take the ordered pair (or "x = …, y = …"); "check" parts
 * take the substituted values in number boxes; "test the claim" is multiple choice naming the equation(s) the pair
 * satisfies; "explain" parts are multiple choice whose options are reasons; word problems ask for the two equations
 * (any equivalent form, either order), then the numbers. No calculator: integer solutions except where the booklet has
 * fractions (Extra 2, 7(c), 18), which must be exact.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 19 (substitution chain with three unknowns). */
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
  function pick2(r, list, test, tries) { for (var g = 0; g < (tries || 600); g++) { var v = list(r); if (test(v)) return v; } throw new Error('u8l3: no parameters found'); }

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
        if (S.A === 0) return wrong('line-vh', (name === t('x=' + nT(k)) ? 'In ' + name : name + ' means ' + t('x=' + nT(k)) + ':') + ' every point has the same <b>' + t('x') + '</b>-value, so the line is <b>vertical</b>, not horizontal.');
        return wrong('u8-gr-line', name + ' is a vertical line: every point on it has ' + t('x=' + nT(k)) + '.');
      }
      if (Tl.A === 0) {   // a horizontal line y = k
        var h = -Tl.C / Tl.B;
        if (S.A === 0) return wrong('u8-gr-shift', 'Your line for ' + name + ' is horizontal — right — but it should cross the ' + t('y') + '-axis at ' + t(nT(h)) + ': every point on it has ' + t('y=' + nT(h)) + '.');
        if (S.B === 0) return wrong('line-vh', (name === t('y=' + nT(h)) ? 'In ' + name : name + ' means ' + t('y=' + nT(h)) + ':') + ' every point has the same <b>' + t('y') + '</b>-value, so the line is <b>horizontal</b>, not vertical.');
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
  function want(e, P) { return e.to === 'y' ? fv(P[1]) : e.to === 'x' ? fv(P[0]) : e.to; }
  function holds(e, P) { return Math.abs(evalT(e.ev, V(P)) - want(e, P)) < 1e-9; }
  function hasY(e) { return e.ev.some(function (tm) { return tm[1] === 'y'; }); }
  function hasX(e) { return e.ev.some(function (tm) { return tm[1] === 'x'; }); }
  function evLabel(e, P) { return t(T(e.ev)) + ' at ' + (hasY(e) && hasX(e) ? ptt(P) : hasY(e) ? t('y=' + nT(P[1])) : t('x=' + nT(P[0]))) + ':'; }
  function evLine(e, P) {
    var v = evalT(e.ev, V(P)), w = want(e, P), good = Math.abs(v - w) < 1e-9;
    return 'In ' + t(e.tex) + ': ' + t(subT(e.ev, V(P)) + '=' + nT(v)) + (good ? (e.to === 'y' ? ', and ' + t('y=' + nT(P[1])) : e.to === 'x' ? ', and ' + t('x=' + nT(P[0])) : '') + ' ✓' : ' ' + t('\\ne ' + nT(w)) + ' ✗');
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

  var KIND = { one: '<b>one solution</b>', none: '<b>no solution</b>', inf: '<b>infinitely many solutions</b>' };
  /* ---------- substitution ---------- */
  function cfT(c) { return c === 1 ? '' : c === -1 ? '-' : String(c); }
  function exprT(p, q, w, cFirst) { return cFirst ? T([[q, ''], [p, w]]) : T([[p, w], [q, '']]); }
  /* S: v = p·w + q (isolated) and A x + B y = C, solution P */
  function mkS(o) {
    var S = Object.assign({}, o); S.w = S.v === 'y' ? 'x' : 'y';
    S.cv = S.v === 'y' ? S.B : S.A; S.cw = S.v === 'y' ? S.A : S.B;
    S.ex = exprT(S.p, S.q, S.w, S.cFirst); S.isoT = S.v + '=' + S.ex; S.othT = eqT([[S.A, 'x'], [S.B, 'y']], S.C);
    S.k = S.cv * S.p + S.cw; S.rhs = S.C - S.cv * S.q;
    if (S.k !== 0) { S.w0 = fr(S.rhs, S.k); S.v0 = fr(S.p * S.w0[0] + S.q * S.w0[1], S.w0[1]); S.P = S.v === 'y' ? [S.w0, S.v0] : [S.v0, S.w0]; S.P = S.P.map(function (f) { return f[1] === 1 ? f[0] : f; }); }
    S.Liso = S.v === 'y' ? line(-S.p, 1, -S.q) : line(1, -S.p, -S.q); S.Loth = line(S.A, S.B, -S.C);
    S.eqs = [E(S.isoT, S.cFirst ? [[S.q, ''], [S.p, S.w]] : [[S.p, S.w], [S.q, '']], S.v), E(S.othT, [[S.A, 'x'], [S.B, 'y']], S.C)];
    // the substituted equation, terms in the order of the other equation
    var parts = [[S.A, 'x'], [S.B, 'y']].filter(function (tm) { return tm[0] !== 0; }), out = '';
    parts.forEach(function (tm) {
      if (tm[1] === S.v) out += (tm[0] < 0 ? '-' : out ? '+' : '') + (Math.abs(tm[0]) === 1 ? '' : Math.abs(tm[0])) + '(' + S.ex + ')';
      else out += T([[tm[0], tm[1]]]).replace(/^(?!-)/, out ? '+' : '');
    });
    S.subT = out + '=' + S.C;
    S.nbK = S.cv * S.p + S.cw; S.nbR = S.C - S.q;   // brackets dropped: only the first term multiplied
    return S;
  }
  function eqVal(S) { return S.v + '=' + nT(S.v === 'y' ? S.P[1] : S.P[0]); }
  function subSol(S, o) {
    o = o || {}; var w = S.w, v = S.v, out = [];
    out.push('<b>Step 1:</b> ' + t(S.isoT) + ' already gives ' + t(v) + '.');
    out.push('<b>Step 2:</b> substitute ' + t(S.ex) + ' for ' + t(v) + ' in the <b>other</b> equation, ' + t(S.othT) + ':<br>' + t(S.subT));
    if (S.k === 0) {
      var tr = S.cv * S.q === S.C;
      out.push('<b>Step 3:</b> expand: ' + t(T([[S.cv * S.p, w], [S.cw, w], [S.cv * S.q, '']]).replace(/^0$/, '') + '=' + S.C) + '. The ' + t(w) + '-terms cancel, leaving ' + t(F(S.cv * S.q) + '=' + F(S.C)) + (tr ? ', which is <b>always true</b>: the same line — <b>infinitely many solutions</b>.' : ', which is <b>never true</b>: parallel lines — <b>no solution</b>.'));
      return out.join('<br>');
    }
    var ex2 = S.v === 'y' ? T([[S.cw, w], [S.cv * S.p, w], [S.cv * S.q, '']]) : T([[S.cv * S.p, w], [S.cv * S.q, ''], [S.cw, w]]);
    if (S.cv * S.p === 0 || S.cw === 0) ex2 = T([[S.cv * S.p + S.cw, w], [S.cv * S.q, '']]);
    out.push('<b>Step 3:</b> expand and solve: ' + t(ex2 + '=' + S.C) + (ex2 === T([[S.k, w], [S.cv * S.q, '']]) ? '' : ', so ' + t(T([[S.k, w], [S.cv * S.q, '']]) + '=' + S.C)) + ', ' + t(T([[S.k, w]]) + '=' + S.rhs) + (S.k === 1 ? '' : ', so ' + t(w + '=' + fT(S.w0))) + '.');
    var wv = fv(S.w0);
    out.push('<b>Step 4:</b> back-substitute into ' + t(S.isoT) + ': ' + t(v + '=' + subT(S.cFirst ? [[S.q, ''], [S.p, w]] : [[S.p, w], [S.q, '']], (function () { var o2 = {}; o2[w] = S.w0; return o2; })()) + '=' + fT(S.v0)) + '.');
    out.push('Solution: ' + ptt(S.P) + '.');
    if (o.check !== false) out.push('Check: ' + S.eqs.map(function (e) { return t(subT(e.ev, V(S.P)) + '=' + nT(evalT(e.ev, V(S.P)))) + (typeof e.to === 'string' ? ' ' + t('=' + e.to) : '') + ' ✓'; }).join('&nbsp;&nbsp; '));
    return out.join('<br>');
  }
  var SUBH = function (S) { return ['Replace ' + t(S.v) + ' in ' + t(S.othT) + ' with ' + t('(' + S.ex + ')') + ' — in brackets — and solve for ' + t(S.w) + '.', 'Then substitute your ' + t(S.w) + '-value into ' + t(S.isoT) + ' to find ' + t(S.v) + '. Write the answer as ' + t('(x,\\ y)') + '.']; };
  function exactOnly(chk) { return function (resp) { var r = chk(resp); if (r.v === 'correct' && /\d\.\d/.test(String(resp))) return form('pt-fraction', 'Right values — but the question asks for <b>exact</b> values: write them as fractions, not decimals.'); return r; }; }
  /* the solution of a substitution system */
  function solvePart(prompt, S, o) {
    o = o || {};
    var W = [];
    if (S.nbK !== 0 && S.cv !== 1) { var w1 = fr(S.nbR, S.nbK), v1 = fr(S.p * w1[0] + S.q * w1[1], w1[1]), P1 = S.v === 'y' ? [w1, v1] : [v1, w1]; P1 = P1.map(function (f) { return f[1] === 1 ? f[0] : f; }); if (!samePt(P1, S.P)) W.push({ is: P1, code: 'dropped-bracket', hint: 'Put the expression in brackets when you substitute: ' + t(cfT(S.cv) + '(' + S.ex + ')') + ' — the ' + t(S.cv) + ' multiplies <b>every</b> term inside.' }); }
    if (S.k !== 0) { var Sw = [S.P[1], S.P[0]]; if (!samePt(Sw, S.P)) W.push({ is: Sw, code: 'pt-swap', hint: 'You have the right numbers in the wrong order. You found ' + t(S.w) + ' first, but the pair is still written ' + t('(x,\\ y)') + '.' }); }
    var p = pointPart(prompt + (o.noSys ? '' : '<div style="margin:.4em 0">' + t('\\begin{aligned}' + S.isoT.replace('=', '&=') + '\\\\' + S.othT.replace('=', '&=') + '\\end{aligned}') + '</div>'), S.k === 0 ? (S.cv * S.q === S.C ? 'inf' : 'none') : S.P, [S.Liso, S.Loth], { wrong: W.filter(function (w) { return w.code !== 'pt-swap'; }) }, o.sol || subSol(S), o.hints || SUBH(S), o.text || 'solve by substitution');
    if (o.exact) p.check = exactOnly(p.check);
    return p;
  }
  /* the equation in one variable you get right after substituting */
  function stepPart(prompt, S, o) {
    o = o || {}; var w = S.w, v = S.v, w0 = fv(S.w0), nb = S.nbK !== 0 ? S.nbR / S.nbK : null;
    var check = function (resp) {
      var s = String(resp == null ? '' : resp).trim(); if (!s) return form('empty', 'Type the equation first.');
      var rd = Ln.read(s, ['x', 'y']);
      if (!rd.ok) {
        if (rd.why === 'not-linear' && !/\^/.test(s)) return wrong('u8l3-same-eq', 'Every variable cancelled — that happens when the expression goes back into the equation it came from. Substitute into the <b>other</b> equation, ' + t(S.othT) + '.');
        return form(rd.why === 'empty' ? 'empty' : 'line-' + rd.why, rd.why === 'no-eq' ? 'Write an equation with an equals sign.' : 'I can’t read that equation — check the brackets and signs.');
      }
      var cv = v === 'y' ? rd.b : rd.a, cw = v === 'y' ? rd.a : rd.b;
      if (Math.abs(cv) > 1e-9) return wrong('u8l3-still-v', 'Your equation still has ' + t(v) + ' in it. Replace ' + t(v) + ' with ' + t('(' + S.ex + ')') + ' so that only ' + t(w) + ' is left.');
      if (Math.abs(cw) < 1e-9) return wrong('u8l3-same-eq', 'There is no ' + t(w) + ' left in your equation. Substitute ' + t('(' + S.ex + ')') + ' for ' + t(v) + ' in ' + t(S.othT) + '.');
      var root = -rd.c / cw;
      if (Math.abs(root - w0) < 1e-9) {
        var flat = s.replace(/\\left|\\right|\s/g, '');
        if (new RegExp('^' + w + '=[^xy]*$').test(flat) || new RegExp('^[^xy]*=' + w + '$').test(flat)) return form('u8l3-solved', 'Right value — but this part asks for the equation you get <b>right after substituting</b>, before you solve it, e.g. it starts like ' + t(S.subT.split('=')[0].slice(0, 6) + '\\ldots') + '.');
        return ok();
      }
      if (nb != null && Math.abs(root - nb) < 1e-9) return wrong('dropped-bracket', 'Put the expression in brackets: ' + t(cfT(S.cv) + '(' + S.ex + ')') + '. The ' + t(S.cv) + ' multiplies <b>every</b> term inside.');
      return wrong('not-subst', 'Check your substitution: in ' + t(S.othT) + ', replace ' + t(v) + ' with ' + t('(' + S.ex + ')') + ' and keep every other term as it is.');
    };
    var p = K.P.math(prompt, check, S.subT, 'Replace ' + t(v) + ' in ' + t(S.othT) + ' with ' + t('(' + S.ex + ')') + ':<br>' + t(S.subT) + '<br>Only ' + t(w) + ' is left, so this equation can be solved: ' + t(w + '=' + fT(S.w0)) + '.',
      ['Copy ' + t(S.othT) + ', but wherever it says ' + t(v) + ', write ' + t('(' + S.ex + ')') + ' instead.'], o.text || 'equation after substituting', { keys: 'eq', placeholder: 'e.g. 3x + 2(x - 5) = 20' });
    p.good = [T([[S.k, w], [S.cv * S.q, '']]) + '=' + S.C];
    p.bad = [w + '=' + fT(S.w0), S.isoT.split('=')[1] + '=' + S.isoT.split('=')[1]].concat(S.nbK !== 0 && Math.abs(nb - w0) > 1e-9 ? [T([[S.nbK, w], [S.q, '']]) + '=' + S.C] : []);
    return p;
  }
  /* generator: v isolated, integer solution unless o.frac */
  function gen(r, o) {
    return pick2(r, function (r) {
      var v = o.v || 'y', P = [r.int(o.x[0], o.x[1]), r.int(o.y[0], o.y[1])], p = r.pick(o.p), A = r.pick(o.A), B = r.pick(o.B), cFirst = o.cFirst ? r.chance(o.cFirst) : false;
      var vv = v === 'y' ? P[1] : P[0], ww = v === 'y' ? P[0] : P[1], q = vv - p * ww;
      return mkS({ v: v, p: p, q: q, A: A, B: B, C: A * P[0] + B * P[1], cFirst: cFirst && q !== 0 });
    }, function (S) {
      if (S.k === 0 || S.q === 0 && !o.q0 || S.A === 0 || S.B === 0) return false;
      if (o.test && !o.test(S)) return false;
      return Math.abs(S.C) <= (o.cmax || 40) && Math.abs(S.q) <= (o.qmax || 12);
    });
  }
  /* generator with a fractional solution: pick the coefficients, the solution comes out of them */
  function genFrac(r, o) {
    return pick2(r, function (r) { return mkS({ v: 'y', p: r.pick(o.p), q: r.pick(o.q), A: r.pick(o.A), B: r.pick(o.B), C: r.pick(o.C), cFirst: false }); },
      function (S) { return S.k !== 0 && S.k !== 1 && S.k !== -1 && Array.isArray(S.w0) && S.w0[1] <= 6 && (!o.test || o.test(S)); });
  }
  function numsOf(S) { return S.P.map(function (z) { return fv(z); }); }

  HW.addCodes({
    'u8-gr-shift': 'Graph: right slope, wrong place', 'u8-gr-sign': 'Graph: slope sign wrong', 'u8-gr-flip': 'Graph: run over rise', 'u8-gr-slope': 'Graph: right intercept, wrong slope', 'u8-gr-line': 'Graph: a line wrong', 'u8-point-off': 'Plotted a point not on the line', 'u8-points-only': 'Plotted points but no lines', 'u8-line-missing': 'A line of the system missing', 'u8-line-extra': 'Extra line drawn', 'u8-graph': 'Graph of the system wrong', 'u8-eq-swap': 'Equations in the wrong boxes', 'u8-price-swap': 'Prices matched to the wrong tickets',
    'u8-neg': 'Sign slip dividing by −1 (or a negative)', 'u8-nodiv': 'Didn’t divide every term', 'sub-swap': 'Substituted the point’s coordinates into the wrong letters', 'sub-wrong': 'Substitution arithmetic slip',
    'dropped-bracket': 'Dropped the bracket when substituting', 'not-subst': 'Substitution slip', 'no-back-sub': 'Left the substitution letter in the answer', 'pt-fraction': 'Exact answer given as a decimal', 'nr-one': 'Gave one unknown instead of the combination', 'pq-swap': 'Values of the two unknowns swapped', 'xy-right-z': 'Three unknowns: x and y right, z wrong',
    'u8l1-back-sign': 'Working backwards: sign slip solving for the unknown coefficient', 'u8l1-back-move': 'Working backwards: moved a term without changing its sign',
    'u8l3-same-eq': 'Substituted back into the equation the expression came from', 'u8l3-still-v': 'Substituted equation still has the replaced variable', 'u8l3-solved': 'Gave the solved value, not the substituted equation',
    'u8l3-word-eq': 'Word problem: equation doesn’t match the sentence', 'u8l3-perim': 'Perimeter: used L + w instead of 2L + 2w', 'u8l3-z': 'Substitution chain: wrong value for z', 'u8l3-gave-y': 'Gave y instead of the asked value'
  });
  HW.addPartial({ 'u8-point-off': 's', 'u8-points-only': 'b', 'u8-graph': 'n', 'u8l3-same-eq': 'n', 'u8l3-still-v': 'b', 'u8l3-word-eq': 'n', 'u8l3-perim': 'b', 'u8l3-z': 's', 'u8l3-gave-y': 'b' });

  function solveSub(k, lv, o, extra) { return { id: o.id, sub: k, level: lv, make: function (r) { var S = o.frac ? genFrac(r, o) : gen(r, o); return solvePart('(' + k + ')', S, extra); } }; }
  function wordEq(prompt, vars, Ts, labels, wrongs, sol, hints, text, keysT) {   // two equation boxes, any equivalent form, either order
    var cs = Ts.map(function (Tg, i) { return K.line(Tg, { vars: vars, wrong: (wrongs || [])[i] }); });
    var check = function (resp) {
      resp = resp || []; var a = String(resp[0] || '').trim(), b = String(resp[1] || '').trim();
      if (!a && !b) return form('empty', 'Write both equations.');
      if (!a || !b) return form('sys-one', 'Write an equation in <b>each</b> box.');
      var ok1 = cs[0](a).v === 'correct' && cs[1](b).v === 'correct', ok2 = cs[1](a).v === 'correct' && cs[0](b).v === 'correct';
      if (ok1 || ok2) return ok();
      for (var i = 0; i < 2; i++) { var rr = [a, b].map(function (x) { return cs[i](x); }).filter(function (q) { return q.v === 'wrong' && q.code !== 'line' && !/^line-/.test(q.code); })[0]; if (rr && !([a, b].some(function (x) { return cs[i](x).v === 'correct'; }))) return wrong(rr.code, rr.hint); }
      var fm = [cs[0](a), cs[1](b), cs[0](b), cs[1](a)].filter(function (q) { return q.v === 'form'; })[0]; if (fm && (cs[0](a).v !== 'wrong' || cs[0](b).v !== 'wrong')) return fm;
      var done = [a, b].filter(function (x) { return cs[0](x).v === 'correct' || cs[1](x).v === 'correct'; }).length;
      return wrong('u8l3-word-eq', (done ? 'One of your equations is right. ' : '') + 'Check ' + (done ? 'the other' : 'each') + ' equation against the sentence it comes from.');
    };
    var keys = keysT || Ts.map(function (Tg) { return Ln.tex(Tg, 'slope-intercept', null, vars); });
    return { prompt: prompt, input: { type: 'fields', fields: labels.map(function (l) { return { label: l, mode: 'math', keys: 'eq', vars: vars, placeholder: ' ' }; }) },
      check: check, key: keys, answer: keys.map(function (k) { return t(k); }).join(' and ') + ' (or equivalent equations)', solution: sol, hints: hints || [], text: text, bad: [[keys[0], keys[0]]] };
  }
  function probA(a) { return '(a) The sum of two numbers is ' + a.S + '. The larger number is ' + Math.abs(a.c) + ' ' + (a.c > 0 ? 'more' : 'less') + ' than ' + { 2: 'twice', 3: 'three times' }[a.m] + ' the smaller number.'; }
  function probB(b) { return '(b) A drama club sold adult tickets at $' + b.pa + ' and student tickets at $' + b.ps + '. They sold ' + { 2: 'twice', 3: 'three times', 4: 'four times' }[b.k] + ' as many student tickets as adult tickets and took in $' + HW.fmt(b.R, true) + '.'; }
  var L3EXTRA = [
      /* ---------- EP Part A ---------- */
      { num: '1', section: 'Extra practice A — Substituting when y is already isolated', stem: 'Each system already has one equation written as ' + t('y=\\ldots') + '. Substitute that expression into the <b>other</b> equation, solve for ' + t('x') + ', back-substitute to find ' + t('y') + ', and state the solution as an ordered pair.',
        parts: [
          solveSub('a', 'BEG', { id: 'e1a', x: [1, 4], y: [1, 7], p: [2, 2, 3], A: [4, 4, 3, 2], B: [3, 3, 2], test: function (S) { return S.q < 0 && S.C > 0; } }),
          solveSub('b', 'EMG', { id: 'e1b', x: [1, 3], y: [-4, 4], p: [-3, -3, -2], A: [2, 2, 3], B: [5, 5, 4], cFirst: 1, test: function (S) { return S.q > 0 && S.C > 0; } }),
          solveSub('c', 'EMG', { id: 'e1c', x: [-3, -1], y: [1, 6], p: [4, 4, 3, 2], A: [3, 3, 5], B: [-2, -2, -3], test: function (S) { return S.q > 0 && S.C < 0; } }),
          solveSub('d', 'EMG', { id: 'e1d', x: [-3, -1], y: [-5, -1], p: [-1, -1, -2], A: [5, 5, 4, 3], B: [2, 2, 3], test: function (S) { return S.q < 0 && S.C < 0; } })] },
      { num: '2', stem: 'Solve each system by substitution. Some answers are negative and some are fractions — leave every answer <b>exact</b> (no decimals, no rounding).',
        parts: [
          solveSub('a', 'PRG', { id: 'e2a', frac: true, p: [4, 4, 3, 2], q: [1, 1, 2, -1], A: [2, 2, 1], B: [3, 3, 2], C: [10, 10, 7, 9, 8], test: function (S) { return fv(S.w0) > 0; } }, { exact: true }),
          solveSub('b', 'PRG', { id: 'e2b', frac: true, p: [-2, -2, -3], q: [1, 1, 2, 3], A: [6, 6, 5, 4], B: [4, 4, 2, 3], C: [9, 9, 7, 5, 11], test: function (S) { return fv(S.w0) < 0; } }, { exact: true }),
          solveSub('c', 'PRG', { id: 'e2c', frac: true, p: [1], q: [1, 1, 2, -1], A: [4, 4, 2, 3], B: [-6, -6, -4, -5], C: [3, 3, 5, 1, 7], test: function (S) { return fv(S.w0) < 0 && fv(S.v0) !== Math.round(fv(S.v0)); } }, { exact: true }),
          solveSub('d', 'EMG', { id: 'e2d', x: [-4, -1], y: [-8, 8], p: [2, 2, 3], A: [5, 5, 4, 7], B: [-4, -4, -3, -2], q0: true, test: function (S) { return S.q === 0 && S.C > 0 && S.k !== 0; } }, { exact: true })] },
      { num: '3', stem: 'Solve each system by substitution. Check your solution in both equations.',
        parts: [
          solveSub('a', 'EMG', { id: 'e3a', x: [2, 6], y: [-4, -1], p: [1], A: [2, 2, 3], B: [1], test: function (S) { return S.q < 0 && S.C > 0; } }),
          solveSub('b', 'EMG', { id: 'e3b', x: [1, 3], y: [-12, 12], p: [-4, -4, -3, -2], A: [3, 3, 5, 1], B: [2, 2, 3], q0: true, test: function (S) { return S.q === 0 && S.C < 0; } }),
          solveSub('c', 'EMG', { id: 'e3c', x: [1, 4], y: [1, 5], p: [-1], A: [3, 3, 2, 4], B: [-2, -2, -3], cFirst: 1, q0: false, test: function (S) { return S.q > 0 && S.C === 0 || S.q > 0 && S.C > 0 && S.C <= 3; } })] },
      /* ---------- EP Part B ---------- */
      { num: '4', section: 'Extra practice B — When x is isolated instead', stem: 'In every system below it is ' + t('x') + ', not ' + t('y') + ', that is already isolated. Substitute the expression into the <b>other</b> equation — it replaces ' + t('x') + ', so the equation that is left contains only ' + t('y') + '. Solve for ' + t('y') + ' first, then back-substitute to find ' + t('x') + '.',
        shared: function (r) { return gen(r, { v: 'x', x: [-2, 3], y: [-2, 3], p: [3, 3, 2, 4], A: [4, 4, 3, 2], B: [1], test: function (S) { return S.q < 0 && S.C > 0 && S.P[1] !== 0; } }); },
        parts: [
          { id: 'e4a', sub: 'a substitute', level: 'EMG', make: function (r, S) { return stepPart('(a) ' + t(S.isoT) + ' and ' + t(S.othT) + '<br>Substitute: write the equation in ' + t('y') + ' alone that you get by replacing ' + t('x') + '.', S); } },
          { id: 'e4a2', sub: 'a solution', level: 'EMG', make: function (r, S) { return solvePart('(a) Solve the system.', S); } },
          solveSub('b', 'EMG', { id: 'e4b', v: 'x', x: [1, 5], y: [1, 4], p: [-2, -2, -3], A: [3, 3, 2], B: [-4, -4, -3], test: function (S) { return S.q > 0 && S.C > 0; } }),
          solveSub('c', 'EMG', { id: 'e4c', v: 'x', x: [1, 5], y: [-4, -1], p: [1], A: [2, 2, 3], B: [3, 3, 2], test: function (S) { return S.q > 0 && S.C <= 6; } }),
          solveSub('d', 'PRG', { id: 'e4d', v: 'x', x: [5, 12], y: [-3, -1], p: [-5, -5, -4, -3], A: [2, 2, 3], B: [-3, -3, -2], cFirst: 1, test: function (S) { return S.q > 0 && S.C > 0; } })] },
      { num: '5', stem: 'Solve each system by substitution. Be careful when you write the ordered pair: you find ' + t('y') + ' first here, but the pair is still written ' + t('(x,\\ y)') + '.',
        parts: [
          solveSub('a', 'EMG', { id: 'e5a', v: 'x', x: [1, 4], y: [-3, -1], p: [2, 2, 3], A: [5, 5, 4, 3], B: [-2, -2, -1], test: function (S) { return S.q > 0 && S.C > 0 && S.P[0] !== -S.P[1]; } }),
          solveSub('b', 'EMG', { id: 'e5b', v: 'x', x: [-8, -3], y: [2, 7], p: [-1], A: [4, 4, 3], B: [3, 3, 2], test: function (S) { return S.q < 0 && S.C < 0; } }),
          solveSub('c', 'EMG', { id: 'e5c', v: 'x', x: [3, 12], y: [1, 4], p: [3, 3, 2, 4], A: [2, 2, 3], B: [-5, -5, -4, -7], q0: true, test: function (S) { return S.q === 0 && S.C > 0; } })] },
      /* ---------- EP Part C ---------- */
      { num: '6', section: 'Extra practice C — Parentheses and negative coefficients', stem: 'When the variable you replace already has a coefficient in front of it, the whole expression must go inside <b>parentheses</b> before you distribute — for example, substituting ' + t('2x-5') + ' into ' + t('3y') + ' gives ' + t('3(2x-5)') + ', not ' + t('3\\cdot 2x-5') + '.',
        shared: function (r) {
          return { a: gen(r, { x: [1, 5], y: [-2, 4], p: [2, 2, 3], A: [-4, -4, -5], B: [3, 3, 2], test: function (S) { return S.q < 0 && S.C < 0 && S.P[1] !== 0; } }),
            b: gen(r, { x: [1, 4], y: [1, 4], p: [-1], A: [5, 5, 4, 3], B: [-2, -2, -3], cFirst: 1, test: function (S) { return S.q > 0 && S.C > 0; } }),
            c: gen(r, { v: 'x', x: [-3, -1], y: [1, 3], p: [-2, -2, -3], A: [-3, -3, -2], B: [4, 4, 5], cFirst: 1, test: function (S) { return S.q > 0 && S.C > 0; } }),
            d: gen(r, { x: [1, 4], y: [-6, -1], p: [-3, -3, -2], A: [5, 5, 4], B: [-2, -2, -3], test: function (S) { return S.q > 0 && S.C > 0; } }) };
        },
        parts: [].concat.apply([], ['a', 'b', 'c', 'd'].map(function (k) {
          return [
            { id: 'e6' + k, sub: k + ' substitute', level: 'EMG', make: function (r, sh) { var S = sh[k]; return stepPart('(' + k + ') ' + t(S.isoT) + ' and ' + t(S.othT) + '<br>Write the equation you get when you substitute — with the parentheses.', S); } },
            { id: 'e6' + k + 's', sub: k + ' solution', level: 'EMG', make: function (r, sh) { var S = sh[k]; return solvePart('(' + k + ') Solve the system.', S); } }];
        })) },
      { num: '7', stem: 'A <b>negative</b> coefficient multiplies every term inside the parentheses, so both signs change. Substitute, distribute carefully, and check.',
        parts: [
          solveSub('a', 'PRG', { id: 'e7a', x: [1, 4], y: [-4, -1], p: [3, 3, 2, 4], A: [1], B: [-5, -5, -4, -3], test: function (S) { return S.q < 0 && S.C > 0; } }),
          solveSub('b', 'PRG', { id: 'e7b', v: 'x', x: [2, 8], y: [-3, -1], p: [-3, -3, -2], A: [4, 4, 3], B: [-7, -7, -5, -6], cFirst: 1, test: function (S) { return S.q > 0 && S.C > 0; } }),
          solveSub('c', 'PRG', { id: 'e7c', frac: true, p: [-1], q: [-2, -2, -3, -1], A: [6, 6, 4, 5], B: [-4, -4, -2, -3], C: [2, 2, 4, 1, 3], test: function (S) { return fv(S.w0) < 0; } }, { exact: true })] },
      /* ---------- EP Part D ---------- */
      { num: '8', section: 'Extra practice D — Both equations isolated, and the two special cases', stem: 'When <b>both</b> equations are already solved for the same variable, the two right-hand sides are two names for that one value, so set them equal to each other. Solve each system this way, then find the second variable and check.',
        parts: ['a', 'b', 'c', 'd'].map(function (k, i) {
          return { id: 'e8' + k, sub: k, level: 'BEG', make: function (r) {
            var v = k === 'd' ? 'x' : 'y', w = v === 'y' ? 'x' : 'y';
            var s = pick2(r, function (r) { return { m1: r.pick([[3, 2, 1, -2], [-2, -3, 1], [5, 4, 3], [4, 3, 2]][i]), m2: r.pick([[1, 2, -1], [4, 3, 2], [2, 1, -1], [1, -1, 2]][i]), w0: r.int(-3, 4), v0: r.int(-8, 8) }; }, function (s) { s.b1 = s.v0 - s.m1 * s.w0; s.b2 = s.v0 - s.m2 * s.w0; return s.m1 !== s.m2 && s.b1 !== 0 && s.b2 !== 0 && s.b1 !== s.b2 && Math.abs(s.b1) <= 9 && Math.abs(s.b2) <= 9; });
            var n1 = v + '=' + T([[s.m1, w], [s.b1, '']]), n2 = v + '=' + T([[s.m2, w], [s.b2, '']]), P = v === 'y' ? [s.w0, s.v0] : [s.v0, s.w0];
            var L1 = v === 'y' ? line(-s.m1, 1, -s.b1) : line(1, -s.m1, -s.b1), L2 = v === 'y' ? line(-s.m2, 1, -s.b2) : line(1, -s.m2, -s.b2);
            var wo = {}; wo[w] = s.w0;
            return pointPart('(' + k + ') ' + t(n1) + ' and ' + t(n2), P, [L1, L2], {},
              'Both right sides equal ' + t(v) + ', so set them equal: ' + t(T([[s.m1, w], [s.b1, '']]) + '=' + T([[s.m2, w], [s.b2, '']])) + '.<br>Collect: ' + t(T([[s.m1 - s.m2, w]]) + '=' + (s.b2 - s.b1)) + ', so ' + t(w + '=' + s.w0) + '.<br>Then ' + t(v + '=' + subT([[s.m1, w], [s.b1, '']], wo) + '=' + s.v0) + ' (check: ' + t(subT([[s.m2, w], [s.b2, '']], wo) + '=' + s.v0) + ' ✓).<br>Solution: ' + ptt(P) + '.',
              ['Set the two right-hand sides equal and solve for ' + t(w) + '.', 'Then substitute into either equation for ' + t(v) + '. Write the pair as ' + t('(x,\\ y)') + '.'], 'both isolated: set equal');
          } };
        }) },
      { num: '9', stem: 'In each system below the variables disappear during the substitution and you are left with a statement containing only numbers. If it is <b>true</b>, the system has infinitely many solutions; if it is <b>false</b>, there is no solution.',
        parts: ['a', 'b', 'c', 'd'].map(function (k, i) {
          return { id: 'e9' + k, sub: k, level: 'EMG', make: function (r) {
            var tr = i === 0 || i === 2, v = i >= 2 ? 'x' : 'y';
            var S = pick2(r, function (r) { var p = r.pick([2, 2, 3, -1, 1]), q = r.pick([-3, -3, 1, 2, 4, -2, 5]), m = r.pick(v === 'x' ? [2, 2, 3] : [-2, -2, -3, 2]); var A, B; if (v === 'y') { B = m; A = -m * p; } else { A = m; B = -m * p; } var C = (v === 'y' ? B : A) * q + (tr ? 0 : r.pick([1, 3, -2, 5, -7])); if (A < 0) { A = -A; B = -B; C = -C; } return mkS({ v: v, p: p, q: q, A: A, B: B, C: C, cFirst: v === 'x' && p === -1 }); }, function (S) { return S.k === 0 && S.A !== 0 && S.B !== 0 && S.q !== 0 && Math.abs(S.C) <= 15; });
            var L = S.cv * S.q, nbL = S.q, stmt = function (a, b) { return t(F(a) + '=' + F(b)); }, isT = function (a, b) { return a === b; };
            var O = [
              { html: stmt(L, S.C) + ', which is ' + (isT(L, S.C) ? 'true' : 'false') + ': ' + (isT(L, S.C) ? KIND.inf + ' (the same line)' : KIND.none + ' (parallel lines)'), right: true },
              { html: stmt(L, S.C) + ', which is ' + (isT(L, S.C) ? 'true' : 'false') + ': ' + (isT(L, S.C) ? KIND.none : KIND.inf), why: isT(L, S.C) ? 'A <b>true</b> statement means every point of the line works: infinitely many solutions.' : 'A <b>false</b> statement means no point works: no solution.', code: 'case' },
              { html: 'The variables cancel, so ' + t(S.w) + ' can be any number: ' + KIND.one, why: 'When the variables cancel there is never exactly one solution — look at the number statement that is left.', code: 'one' }];
            if (nbL !== L) O.push({ html: stmt(nbL, S.C) + ', which is ' + (isT(nbL, S.C) ? 'true' : 'false') + ': ' + (isT(nbL, S.C) ? KIND.inf : KIND.none), why: 'Keep the brackets when you substitute: ' + t(cfT(S.cv) + '(' + S.ex + ')') + ' — the ' + t(S.cv) + ' multiplies the constant too.', code: 'nobr' });
            else O.push({ html: stmt(-L, S.C) + ', which is ' + (isT(-L, S.C) ? 'true' : 'false') + ': ' + (isT(-L, S.C) ? KIND.inf : KIND.none), why: 'Check the signs when you distribute ' + t(cfT(S.cv) + '(' + S.ex + ')') + '.', code: 'sign' });
            return mc(r, '(' + k + ') ' + t(S.isoT) + ' and ' + t(S.othT) + '<br>Substitute. What number statement is left, and which case is it?', O, subSol(S), ['Substitute ' + t('(' + S.ex + ')') + ' for ' + t(S.v) + ' and distribute.'], 'special case by substitution');
          } };
        }) },
      { num: '10', parts: [
        { id: 'e10', level: 'EMG', make: function (r) {
          var n = r.pick([6, 6, 10, 4, -3, 8]), z = r.pick([5, 5, 3, -2, 7]), c = r.pick([2, 2, 3, 5]), lhs = r.pick([0, 0, 1, -4]);
          var rows = r.shuffle([{ id: 't', html: 'ends in ' + t(n + '=' + n), w: 'inf' }, { id: 'f', html: 'ends in ' + t(lhs + '=' + (lhs + z)), w: 'none' }, { id: 'x', html: 'ends in ' + t(c + 'x=' + c + 'x'), w: 'oops' }]), want = {};
          rows.forEach(function (x) { want[x.id] = x.w; });
          return K.P.grid('In Lesson 2 you met the two special cases on a graph. Match each way a substitution can end with what it tells you.', rows.map(function (x) { return { id: x.id, html: x.html }; }),
            [{ id: 'inf', html: 'the same line: infinitely many' }, { id: 'none', html: 'parallel lines: no solution' }, { id: 'oops', html: 'nothing: substituted back into the same equation' }], want,
            { why: function (row) { return { code: 'row', hint: row === 't' ? 'A true number statement holds for every point: the lines are the same.' : row === 'f' ? 'A false statement holds for no point: the lines never meet.' : 'A statement that still contains ' + t('x') + ' and is true for every ' + t('x') + ' proves nothing — it comes from putting the expression back into the equation it came from.' }; } },
            'A true statement such as ' + t(n + '=' + n) + ': the two equations are the <b>same line</b>, so every point on it is a solution.<br>A false statement such as ' + t(lhs + '=' + (lhs + z)) + ': the lines are <b>parallel</b> and never meet — no solution.<br>' + t(c + 'x=' + c + 'x') + ' still contains the variable and is true for every ' + t('x') + ', so it tells you nothing: it is what you get when you substitute back into the equation the expression came from. Substitute into the <b>other</b> equation instead.',
            ['Is the leftover statement true, false, or does it still contain a variable?'], 'special endings (grid)');
        } }] },
      /* ---------- EP Part E ---------- */
      { num: '11', section: 'Extra practice E — Checking and error analysis',
        shared: function (r) { return gen(r, { x: [6, 15], y: [8, 25], p: [2, 2, 3], A: [5, 5, 7, 4], B: [-3, -3, -2], test: function (S) { return S.q < 0 && S.C > 0 && S.nbK !== 0; } }); },
        stem: function (S) { var wrongL = T([[S.A, 'x']]) + '-' + Math.abs(S.B) + '\\cdot ' + S.ex.replace(/x/, 'x'); return 'Rohan solved the system ' + t(S.isoT) + ', ' + t(S.othT) + ' and his first line was ' + t(wrongL + '=' + S.C) + '.'; },
        parts: [
          { id: 'e11a', sub: 'a', level: 'EMG', make: function (r, S) {
            return mc(r, 'What is the mistake in his first line?', [
              { html: 'He dropped the parentheses: ' + t(S.B) + ' must multiply the whole expression, so the line should read ' + t(S.subT) + '.', right: true },
              { html: 'He substituted into the wrong equation.', why: 'He did substitute into the other equation, ' + t(S.othT) + ' — that part is right. Look at what ' + t(S.B) + ' multiplies.', code: 'wrongeq' },
              { html: 'He should have replaced ' + t('x') + ', not ' + t('y') + '.', why: 'The isolated variable is ' + t('y') + ', so replacing ' + t('y') + ' is right.', code: 'var' },
              { html: 'Nothing — his first line is correct.', why: t(S.B) + ' multiplies only ' + t(T([[S.p, 'x']])) + ' in his line; the constant ' + t(S.q) + ' was never multiplied.', code: 'none' }],
              'The ' + t(S.B) + ' multiplies the <b>whole</b> expression for ' + t('y') + ': ' + t(S.subT) + '. Without the parentheses the ' + t(S.q) + ' was never multiplied (it should become ' + t(F(S.B * S.q).replace(/^(?!-)/, '+')) + ').', ['What does the ' + t(S.B) + ' in front of ' + t('y') + ' have to multiply?'], 'error: dropped brackets');
          } },
          { id: 'e11b', sub: 'b', level: 'PRG', make: function (r, S) { return solvePart('Redo the substitution correctly and find the true solution.', S, { noSys: false }); } }] },
      { num: '12', shared: function (r) { return gen(r, { x: [2, 6], y: [-4, 3], p: [-3, -3, -2, -4], A: [2, 2, 3], B: [5, 5, 4], test: function (S) { return S.q > 0 && S.C !== 0 && S.P[1] !== S.P[0]; } }); },
        stem: function (S) { return 'Asked to solve ' + t(S.isoT) + ', ' + t(S.othT) + ', Priya substituted correctly, solved, and wrote “the solution is ' + t(S.P[0]) + '.”'; },
        parts: [
          { id: 'e12a', sub: 'a', level: 'BEG', make: function (r, S) {
            return mc(r, 'What did Priya forget to do?', [
              { html: 'She found only ' + t('x') + '. A system has two unknowns, so the answer is an ordered pair: she still has to back-substitute to find ' + t('y') + '.', right: true },
              { html: 'Nothing — ' + t(S.P[0]) + ' is the complete answer.', why: 'One number can’t say where two lines cross: a point needs an ' + t('x') + ' and a ' + t('y') + '.', code: 'none' },
              { html: 'She should have substituted into the first equation instead.', why: 'Substituting into the other equation was right. The missing step comes after.', code: 'eq' },
              { html: 'She should have rounded her answer.', why: 'Her ' + t('x') + ' is exact. What is missing is the second coordinate.', code: 'round' }],
              'Substitution gave ' + t('x=' + S.P[0]) + ' — only half of the answer. Back-substitute: ' + t('y=' + subT([[S.p, 'x'], [S.q, '']], { x: S.P[0] }) + '=' + S.P[1]) + ', so the solution is ' + ptt(S.P) + '.', ['How many unknowns does a system of two equations have?'], 'error: no back-substitution');
          } },
          { id: 'e12b', sub: 'b', level: 'EMG', make: function (r, S) { return solvePart('Finish her work: state the solution as an ordered pair.', S, { wrong: [] }); } }] },
      { num: '13', stem: 'Substitution is only finished once the pair has been tested in <b>both original</b> equations — not the rearranged ones.',
        shared: function (r) { return { a: gen(r, { x: [1, 4], y: [-3, 3], p: [4, 4, 3, 5], A: [3, 3, 2], B: [2, 2, 3], test: function (S) { return S.q < 0 && S.C > 0; } }), b: gen(r, { v: 'x', x: [-3, 3], y: [1, 4], p: [-2, -2, -3], A: [4, 4, 3, 2], B: [1], cFirst: 1, test: function (S) { return S.q > 0 && S.P[0] !== 0; } }) }; },
        parts: [
          { id: 'e13a', sub: 'a solve', level: 'EMG', make: function (r, sh) { return solvePart('(a) Solve by substitution.', sh.a); } },
          { id: 'e13a2', sub: 'a check', level: 'BEG', make: function (r, sh) { var S = sh.a; return subFields('(a) Check ' + ptt(S.P) + ': work out the right side of ' + t(S.isoT) + ' and the left side of ' + t(S.othT) + '.', S.eqs, S.P, evLines(S.eqs, S.P) + '<br>Both sides balance in both equations ✓', ['Substitute both coordinates; put negative values in brackets.'], 'check in both originals'); } },
          { id: 'e13b', sub: 'b', level: 'BEG', make: function (r, sh) { var S = sh.b; return verdictMC(r, '(b) System: ' + t(S.isoT) + ', ' + t(S.othT) + '. Claimed solution: ' + ptt(S.P) + '. Test the claim.', S.eqs, S.P, null, null, 'verdict claim (right)'); } }] },
      { num: '14', shared: function (r) { var S = gen(r, { x: [1, 4], y: [5, 16], p: [5, 5, 4, 3], A: [2, 2, 3], B: [-1], test: function (S) { return S.q > 0 && S.C < 0; } }); S.claim = [S.P[0], S.P[1] - 2]; return S; },
        stem: function (S) { return 'System: ' + t(S.isoT) + ', ' + t(S.othT) + '. A student claims the solution is ' + ptt(S.claim) + '.'; },
        parts: [
          { id: 'e14a', sub: 'test', level: 'BEG', make: function (r, S) { return verdictMC(r, 'Test the claim in both original equations.', S.eqs, S.claim, null, null, 'verdict claim (fails)'); } },
          { id: 'e14b', sub: 'correct', level: 'EMG', make: function (r, S) { return solvePart('Give the correct solution.', S, { wrong: [] }); } }] },
      /* ---------- EP Part F ---------- */
      { num: '15', section: 'Extra practice F — Working backwards, context, and a stretch', stem: '<b>Work backwards.</b> In each part you are told the solution of the system. Use it to find the missing number: substitute the given ' + t('x') + '- and ' + t('y') + '-values into the equation that contains the unknown letter.',
        parts: [
          { id: 'e15a', sub: 'a', level: 'ADV', make: function (r) {
            var s = pick2(r, function (r) { return { x0: r.int(2, 5), y0: r.int(1, 8), A: r.pick([3, 3, 2, 4]), m: r.pick([2, 2, 3]) }; }, function (s) { s.k = s.y0 - s.m * s.x0; return s.k !== 0; });
            var C = s.A * s.x0 + s.y0, mv = s.y0 + s.m * s.x0;
            return K.P.number('(a) ' + t('y=' + s.m + 'x+k') + ' and ' + t(eqT([[s.A, 'x'], [1, 'y']], C)) + ' have solution ' + ptt([s.x0, s.y0]) + '. Find ' + t('k') + '.', s.k,
              function (v) { if (v === -s.k) return { code: 'u8l1-back-sign', hint: 'Check the sign: ' + t(s.y0 + '=' + s.m + '(' + s.x0 + ')+k') + ', so ' + t('k=' + s.y0 + '-' + s.m * s.x0) + '.' }; if (v === mv) return { code: 'u8l1-back-move', hint: 'Subtract ' + t(s.m * s.x0) + ' from both sides (don’t add it).' }; return null; },
              t(s.y0 + '=' + s.m + '(' + s.x0 + ')+k') + ', so ' + t(s.y0 + '=' + s.m * s.x0 + '+k') + ' and ' + t('k=' + s.k) + '. (Check the other equation: ' + t(s.A + '(' + s.x0 + ')+' + F(s.y0) + '=' + C) + ' ✓)', ['Substitute ' + t('x=' + s.x0) + ' and ' + t('y=' + s.y0) + ' into ' + t('y=' + s.m + 'x+k') + '.'], 'find k', { before: t('k=') });
          } },
          { id: 'e15b', sub: 'b', level: 'ADV', make: function (r) {
            var s = pick2(r, function (r) { return { x0: r.int(1, 4), a: r.pick([2, 2, 3, -1, 4]), c: r.pick([-1, -1, 1, 2, -2]), A: r.pick([2, 2, 1]), B: r.pick([3, 3, 2]) }; }, function (s) { s.y0 = s.a * s.x0 + s.c; return s.y0 > 0 && s.y0 <= 12; });
            var C = s.A * s.x0 + s.B * s.y0, flip = (s.y0 + s.c) / s.x0;
            return K.P.number('(b) ' + t('y=ax' + (s.c < 0 ? '' : '+') + s.c) + ' and ' + t(eqT([[s.A, 'x'], [s.B, 'y']], C)) + ' have solution ' + ptt([s.x0, s.y0]) + '. Find ' + t('a') + '.', s.a,
              function (v) { if (v === -s.a) return { code: 'u8l1-back-sign', hint: 'Check the sign of your answer.' }; if (Number.isInteger(flip) && v === flip && flip !== s.a) return { code: 'u8l1-back-move', hint: 'Move ' + t(s.c) + ' to the other side by doing the opposite operation.' }; return null; },
              t(s.y0 + '=a(' + s.x0 + ')' + (s.c < 0 ? '' : '+') + s.c) + ', so ' + t(s.x0 + 'a=' + (s.y0 - s.c)) + ' and ' + t('a=' + s.a) + '. (Check: ' + t(subT([[s.A, 'x'], [s.B, 'y']], { x: s.x0, y: s.y0 }) + '=' + C) + ' ✓)', ['Substitute the solution into the equation with ' + t('a') + '.'], 'find a', { before: t('a=') });
          } },
          { id: 'e15c', sub: 'c', level: 'ADV', make: function (r) {
            var s = pick2(r, function (r) { return { x0: r.int(1, 4), y0: r.pick([-3, -3, -2, -1, 1, 2]), m: r.pick([3, 3, 2]), A: r.pick([5, 5, 4, 3]), B: r.pick([-2, -2, -1, 2]) }; }, function (s) { s.c = s.x0 - s.m * s.y0; return s.c !== 0; });
            var C = s.A * s.x0 + s.B * s.y0, mv = s.x0 + s.m * s.y0;
            return K.P.number('(c) ' + t('x=' + s.m + 'y+c') + ' and ' + t(eqT([[s.A, 'x'], [s.B, 'y']], C)) + ' have solution ' + ptt([s.x0, s.y0]) + '. Find ' + t('c') + '.', s.c,
              function (v) { if (v === -s.c) return { code: 'u8l1-back-sign', hint: 'Check the sign: ' + t(s.x0 + '=' + s.m + '(' + s.y0 + ')+c') + '.' }; if (v === mv && mv !== s.c) return { code: 'u8l1-back-move', hint: t(s.m + '(' + s.y0 + ')=' + s.m * s.y0) + ': subtract it from both sides.' }; return null; },
              t(s.x0 + '=' + s.m + '(' + s.y0 + ')+c') + ', so ' + t(s.x0 + '=' + F(s.m * s.y0) + '+c') + ' and ' + t('c=' + s.c) + '. (Check: ' + t(subT([[s.A, 'x'], [s.B, 'y']], { x: s.x0, y: s.y0 }) + '=' + C) + ' ✓)', ['Substitute ' + t('x=' + s.x0) + ' and ' + t('y=' + s.y0) + ' into ' + t('x=' + s.m + 'y+c') + '.'], 'find c', { before: t('c=') });
          } }] },
      { num: '16', shared: function (r) { return pick2(r, function (r) { return { x0: r.int(1, 4), S: r.pick([10, 10, 8, 12, 9, 7]), b: r.pick([4, 4, 2, 3, 1, -2]) }; }, function (s) { s.y0 = s.S - s.x0; var m = (s.y0 - s.b) / s.x0; s.m = m; return Number.isInteger(m) && m !== 0 && m !== -1; }); },
        stem: function (s) { return 'The system ' + t('y=mx' + (s.b < 0 ? '' : '+') + s.b) + ', ' + t('x+y=' + s.S) + ' has a solution whose ' + t('x') + '-coordinate is ' + t(s.x0) + '.'; },
        parts: [
          { id: 'e16a', sub: 'a', level: 'ADV', make: function (r, s) {
            var p = numFields('Determine the ' + t('y') + '-coordinate first, then the value of ' + t('m') + '.', [t('y='), t('m=')], [s.y0, s.m], [null, function (v) { if (v === -s.m) return { code: 'u8l1-back-sign', hint: 'Check the sign: ' + t(s.y0 + '=m(' + s.x0 + ')' + (s.b < 0 ? '' : '+') + s.b) + '.' }; return null; }],
              'From ' + t('x+y=' + s.S) + ' with ' + t('x=' + s.x0) + ': ' + t('y=' + s.S + '-' + s.x0 + '=' + s.y0) + '.<br>Then ' + t(s.y0 + '=m(' + s.x0 + ')' + (s.b < 0 ? '' : '+') + s.b) + ', so ' + t(s.x0 + 'm=' + (s.y0 - s.b)) + ' and ' + t('m=' + s.m) + '.', ['Use the equation with no unknown letter first: ' + t('x+y=' + s.S) + '.'], 'y then m');
            p.bad = [[String(s.y0), String(-s.m)]].filter(function () { return s.m !== 0; });
            return p;
          } },
          { id: 'e16b', sub: 'b', level: 'EMG', make: function (r, s) {
            return mc(r, 'Why does the order matter?', [
              { html: 'The equation with ' + t('m') + ' has two unknowns, ' + t('m') + ' and ' + t('y') + '. You need ' + t('y') + ' from ' + t('x+y=' + s.S) + ' (no unknown letter) before you can solve for ' + t('m') + '.', right: true },
              { html: 'It doesn’t matter: you can solve for ' + t('m') + ' first.', why: 'With only ' + t('x=' + s.x0) + ' known, ' + t('y=m(' + s.x0 + ')' + (s.b < 0 ? '' : '+') + s.b) + ' still has two unknowns.', code: 'any' },
              { html: 'Because ' + t('m') + ' is always found last in a system.', why: 'It’s not a rule about ' + t('m') + ' — it is about which equation has only one unknown left.', code: 'rule' },
              { html: 'Because ' + t('y') + ' comes before ' + t('m') + ' in the alphabet.', why: 'The order comes from which equation can be solved, not from the letters.', code: 'alpha' }],
              'Knowing only ' + t('x=' + s.x0) + ', the equation ' + t('y=mx' + (s.b < 0 ? '' : '+') + s.b) + ' has two unknowns. ' + t('x+y=' + s.S) + ' has just one, so it gives ' + t('y=' + s.y0) + ' first; then ' + t('m') + ' is the only unknown left.', ['Which equation has only one unknown once you know ' + t('x') + '?'], 'why the order');
          } }] },
      { num: '17', stem: 'Define your two variables, write a system in which one equation is already isolated, then solve it by substitution.',
        shared: function (r) {
          var a = pick2(r, function (r) { return { s: r.int(5, 14), m: r.pick([2, 2, 3]), c: r.pick([5, 5, 3, 4, 6, 7, -2]) }; }, function (a) { a.L = a.m * a.s + a.c; return a.L > a.s; }); a.S = a.s + a.L;
          var b = pick2(r, function (r) { return { pa: r.pick([12, 12, 10, 15, 9]), ps: r.pick([7, 7, 5, 6, 8]), k: r.pick([3, 3, 2, 4]), a: r.pick([20, 20, 15, 25, 30, 18]) }; }, function (b) { return b.ps < b.pa; }); b.t = b.k * b.a; b.R = b.pa * b.a + b.ps * b.t;
          return { a: a, b: b };
        },
        parts: [
          { id: 'e17a', sub: 'a equations', level: 'PRG', make: function (r, sh) {
            var a = sh.a, W = { 2: 'twice', 3: 'three times' }[a.m];
            return wordEq(probA(a) + ' Let ' + t('s') + ' be the smaller number and ' + t('L') + ' the larger. Write the system.', ['s', 'L'],
              [line(1, 1, -a.S), line(a.m, -1, a.c)], ['Equation 1:', 'Equation 2:'], [[], [{ is: line(1, -a.m, a.c), code: 'u8l3-word-eq', hint: '“The <b>larger</b> number is …” starts with ' + t('L') + ': ' + t('L=' + a.m + 's' + (a.c > 0 ? '+' : '-') + Math.abs(a.c)) + '.' }]],
              'The sum: ' + t('s+L=' + a.S) + '. The larger is ' + W + ' the smaller ' + (a.c > 0 ? 'plus' : 'minus') + ' ' + Math.abs(a.c) + ': ' + t('L=' + a.m + 's' + (a.c > 0 ? '+' : '-') + Math.abs(a.c)) + '.', ['“The sum of two numbers” adds them.', '“The larger number is …” gives ' + t('L=\\ldots') + '.'], 'number problem: equations', ['s+L=' + a.S, 'L=' + a.m + 's' + (a.c > 0 ? '+' : '-') + Math.abs(a.c)]);
          } },
          { id: 'e17a2', sub: 'a numbers', level: 'EMG', make: function (r, sh) {
            var a = sh.a, p = numFields(probA(a) + '<br>Solve: determine both numbers.', ['Smaller number:', 'Larger number:'], [a.s, a.L], null,
              'Substitute ' + t('L=' + a.m + 's' + (a.c > 0 ? '+' : '-') + Math.abs(a.c)) + ' into ' + t('s+L=' + a.S) + ': ' + t('s+(' + a.m + 's' + (a.c > 0 ? '+' : '-') + Math.abs(a.c) + ')=' + a.S) + ', ' + t((a.m + 1) + 's=' + (a.S - a.c)) + ', ' + t('s=' + a.s) + '.<br>' + t('L=' + a.m + '(' + a.s + ')' + (a.c > 0 ? '+' : '-') + Math.abs(a.c) + '=' + a.L) + '. Check: ' + t(a.s + '+' + a.L + '=' + a.S) + ' ✓',
              ['Substitute the expression for ' + t('L') + ' into the sum.'], 'number problem: solve');
            var base = p.check; p.check = function (resp) { resp = resp || []; if (Number(resp[0]) === a.L && Number(resp[1]) === a.s) return wrong('pq-swap', 'Your numbers are in the wrong boxes: the smaller one goes first.'); return base(resp); };
            p.bad = [[String(a.L), String(a.s)]];
            return p;
          } },
          { id: 'e17b', sub: 'b equations', level: 'PRG', make: function (r, sh) {
            var b = sh.b, W = { 2: 'twice', 3: 'three times', 4: 'four times' }[b.k];
            return wordEq(probB(b) + ' Let ' + t('a') + ' be the number of adult tickets and ' + t('t') + ' the number of student tickets. Write the system.', ['a', 't'],
              [line(b.k, -1, 0), line(b.pa, b.ps, -b.R)], ['Equation 1:', 'Equation 2:'], [[{ is: line(1, -b.k, 0), code: 'u8l3-word-eq', hint: 'There are <b>more</b> student tickets: ' + t('t') + ' is ' + b.k + ' times ' + t('a') + ', so ' + t('t=' + b.k + 'a') + '.' }], [{ is: line(b.ps, b.pa, -b.R), code: 'u8-price-swap', hint: 'Match each price to its ticket: adult tickets ' + t('a') + ' cost $' + b.pa + '.' }]],
              W.charAt(0).toUpperCase() + W.slice(1) + ' as many student tickets: ' + t('t=' + b.k + 'a') + '. Money: ' + t(b.pa + 'a+' + b.ps + 't=' + b.R) + '.', ['“' + W + ' as many student tickets as adult tickets”: ' + t('t=\\,?\\,a') + '.', 'Money: price × number for each kind, added.'], 'tickets: equations', ['t=' + b.k + 'a', b.pa + 'a+' + b.ps + 't=' + b.R]);
          } },
          { id: 'e17b2', sub: 'b numbers', level: 'EMG', make: function (r, sh) {
            var b = sh.b, p = numFields(probB(b) + '<br>How many of each did they sell?', ['Adult tickets:', 'Student tickets:'], [b.a, b.t], null,
              'Substitute ' + t('t=' + b.k + 'a') + ': ' + t(b.pa + 'a+' + b.ps + '(' + b.k + 'a)=' + b.R) + ', ' + t((b.pa + b.ps * b.k) + 'a=' + b.R) + ', ' + t('a=' + b.a) + '.<br>' + t('t=' + b.k + '(' + b.a + ')=' + b.t) + '. They sold ' + b.a + ' adult and ' + b.t + ' student tickets.<br>Check: ' + t(b.pa + '(' + b.a + ')+' + b.ps + '(' + b.t + ')=' + b.R) + ' ✓',
              ['Substitute ' + t('t=' + b.k + 'a') + ' into the money equation.'], 'tickets: solve');
            var base = p.check; p.check = function (resp) { resp = resp || []; if (Number(resp[0]) === b.t && Number(resp[1]) === b.a) return wrong('pq-swap', 'Your numbers are in the wrong boxes: adult tickets go first.'); return base(resp); };
            p.bad = [[String(b.t), String(b.a)]];
            return p;
          } }] },
      { num: '18', stem: '<b>Interpreting the answer.</b> A fractional answer is perfectly fine in some contexts and impossible in others.',
        shared: function (r) {
          var a = pick2(r, function (r) { return { w2: r.pick([9, 9, 7, 11, 5, 13, 15, 17]), m: r.pick([2, 2, 3]), c: r.pick([4, 4, 1, 2, 3, 5]) }; }, function () { return true; }); a.w = [a.w2, 2]; a.L = fr(a.m * a.w2 + 2 * a.c, 2); a.P = 2 * fv(a.L) + 2 * fv(a.w);
          var b = pick2(r, function (r) { return { d: r.pick([3, 3, 2, 4, 5, 6]), tot: r.pick([200, 200, 175, 230, 160, 290, 140, 260, 320, 185, 245, 310]) }; }, function (b) { var n = (b.tot - 10 * b.d) / 15; b.n = n; return !Number.isInteger(n) && n > 0; });
          b.nf = fr(b.tot - 10 * b.d, 15); b.df = fr(b.nf[0] + b.d * b.nf[1], b.nf[1]);
          return { a: a, b: b };
        },
        parts: [
          { id: 'e18a', sub: 'a', level: 'PRG', make: function (r, sh) {
            var a = sh.a, Pt = F(a.P), W = { 2: 'twice', 3: 'three times' }[a.m];
            var cW = K.value(fv(a.w)), cL = K.value(fv(a.L));
            var p = K.P.fields('(a) A rectangle’s length is ' + a.c + ' cm more than ' + W + ' its width, and its perimeter is ' + Pt + ' cm. Determine the width and the length. (Fractions or decimals are fine.)', [{ label: 'Width:', mode: 'math', keys: 'fraction', placeholder: ' ', after: 'cm' }, { label: 'Length:', mode: 'math', keys: 'fraction', placeholder: ' ', after: 'cm' }],
              [function (resp) { var x = cW(resp); if (x.v !== 'correct') { var rr = K.read(resp); if (rr.val != null && Math.abs(rr.val - (a.P / 2 - a.c) / (a.m + 1)) < 1e-9) return wrong('u8l3-perim', 'The perimeter is ' + t('2L+2w') + ', not ' + t('L+w') + '.'); } return x; }, cL],
              [fT(a.w), fT(a.L)], 'Width ' + t(fT(a.w) + '=' + String(fv(a.w))) + ' cm, length ' + t(fT(a.L) + '=' + String(fv(a.L))) + ' cm',
              'Let ' + t('w') + ' be the width and ' + t('L') + ' the length: ' + t('L=' + a.m + 'w+' + a.c) + ' and ' + t('2L+2w=' + Pt) + '.<br>Substitute: ' + t('2(' + a.m + 'w+' + a.c + ')+2w=' + Pt) + ', ' + t((2 * a.m + 2) + 'w+' + 2 * a.c + '=' + Pt) + ', ' + t((2 * a.m + 2) + 'w=' + F(a.P - 2 * a.c)) + ', so ' + t('w=' + fT(a.w)) + ' cm ' + t('=' + String(fv(a.w))) + ' cm.<br>' + t('L=' + a.m + '(' + String(fv(a.w)) + ')+' + a.c + '=' + String(fv(a.L))) + ' cm.',
              ['Perimeter of a rectangle: ' + t('2L+2w') + '. Substitute ' + t('L=' + a.m + 'w+' + a.c) + '.'], 'rectangle: fractional answer');
            p.bad = [[fT(a.L), fT(a.w)]];
            return p;
          } },
          { id: 'e18a2', sub: 'a fraction ok?', level: 'BEG', make: function (r, sh) {
            var a = sh.a;
            return mc(r, '(a) The rectangle’s width came out as ' + t(fT(a.w) + '=' + String(fv(a.w))) + ' cm and its length as ' + t(String(fv(a.L))) + ' cm. Is a fractional answer acceptable here?', [
              { html: '<b>Yes</b> — a length can be any positive measurement, so ' + t(String(fv(a.w))) + ' cm is a perfectly good width.', right: true },
              { html: '<b>No</b> — lengths must be whole numbers, so the rectangle can’t exist.', why: 'Lengths are measurements: 4.5 cm is a real length.', code: 'whole' },
              { html: '<b>No</b> — a fraction means the algebra went wrong.', why: 'Check: the width and length satisfy both equations. Fractions are normal answers.', code: 'algebra' },
              { html: '<b>Yes</b>, but only after rounding to a whole number.', why: 'Rounding would break the perimeter. The exact value is fine as it is.', code: 'round' }],
              'Width and length are measurements, which can be any positive number — ' + t(String(fv(a.w))) + ' cm is fine.', ['Can a length be a fraction of a centimetre?'], 'fraction ok for lengths');
          } },
          { id: 'e18b', sub: 'b solve', level: 'PRG', make: function (r, sh) {
            var b = sh.b, Tt = '$' + (b.tot / 100).toFixed(2);
            var p = K.P.fields('(b) A jar holds only nickels (5¢) and dimes (10¢). There are ' + b.d + ' more dimes than nickels, and the total value is ' + Tt + '. Let ' + t('n') + ' be the number of nickels and ' + t('d') + ' the number of dimes. Solve the system ' + t('d=n+' + b.d) + ', ' + t('5n+10d=' + b.tot) + '. (Give exact values.)', [{ label: t('n='), mode: 'math', keys: 'fraction', placeholder: ' ' }, { label: t('d='), mode: 'math', keys: 'fraction', placeholder: ' ' }],
              [K.value(fv(b.nf)), K.value(fv(b.df))], [fT(b.nf), fT(b.df)], t('n=' + fT(b.nf)) + ', ' + t('d=' + fT(b.df)),
              'Substitute: ' + t('5n+10(n+' + b.d + ')=' + b.tot) + ', ' + t('15n+' + 10 * b.d + '=' + b.tot) + ', ' + t('15n=' + (b.tot - 10 * b.d)) + ', ' + t('n=' + fT(b.nf)) + '; ' + t('d=' + fT(b.nf) + '+' + b.d + '=' + fT(b.df)) + '.', ['Work in cents: ' + Tt + ' is ' + b.tot + '¢. Substitute ' + t('d=n+' + b.d) + '.'], 'coins: solve');
            p.bad = [[String(Math.round(fv(b.nf))), String(Math.round(fv(b.df)))]];
            return p;
          } },
          { id: 'e18b2', sub: 'b meaning', level: 'ADV', make: function (r, sh) {
            var b = sh.b;
            return mc(r, '(b) For the jar of nickels and dimes you found ' + t('n=' + fT(b.nf)) + ' and ' + t('d=' + fT(b.df)) + '. What does that tell you about whether such a jar can exist?', [
              { html: 'It can’t exist: coins come only in whole numbers, so ' + t('n=' + fT(b.nf)) + ' nickels is impossible — the conditions contradict each other.', right: true },
              { html: 'It exists: round to ' + Math.round(fv(b.nf)) + ' nickels and ' + Math.round(fv(b.df)) + ' dimes.', why: 'Check the rounded values: ' + t('5(' + Math.round(fv(b.nf)) + ')+10(' + Math.round(fv(b.df)) + ')=' + (5 * Math.round(fv(b.nf)) + 10 * Math.round(fv(b.df)))) + ', not ' + b.tot + '.', code: 'round' },
              { html: 'The algebra must be wrong, because answers are always whole numbers.', why: 'The values check in both equations. The algebra is right; the situation is impossible.', code: 'algebra' },
              { html: 'It exists, with part of a coin in the jar.', why: 'You can’t have part of a coin.', code: 'part' }],
              'The values satisfy both equations, but a number of coins must be a whole number. So no jar matches the description: the fractional answer means the conditions are impossible, not that the algebra went wrong.', ['Can you have a fraction of a coin?'], 'impossible context');
          } }] },
      { num: '19', parts: [
        { id: 'e19', level: 'MAS', make: function (r) {
          var s = pick2(r, function (r) { return { x0: r.int(3, 12), a: r.pick([3, 3, 2, 4, 5]), k: r.pick([2, 2, 3]) }; }, function () { return true; }); s.y0 = s.x0 + s.a; s.z0 = s.k * s.y0; s.S = s.x0 + s.y0 + s.z0;
          var zx = T([[s.k, 'x'], [s.k * s.a, '']]);
          var p = numFields('<b>Stretch — a substitution chain.</b> Three numbers satisfy ' + t('z=' + s.k + 'y') + ', ' + t('y=x+' + s.a) + ' and ' + t('x+y+z=' + s.S) + '. Substitute twice: write ' + t('z') + ' in terms of ' + t('x') + ', then substitute both expressions into the third equation. Determine ' + t('x') + ', ' + t('y') + ' and ' + t('z') + '.', [t('x='), t('y='), t('z=')], [s.x0, s.y0, s.z0],
            [null, function (v) { if (v === s.x0) return { code: 'no-back-sub', hint: 'Back-substitute: ' + t('y=x+' + s.a) + '.' }; return null; }, function (v) { if (v === s.k * s.x0) return { code: 'u8l3-z', hint: t('z=' + s.k + 'y') + ' — use ' + t('y') + ', not ' + t('x') + '.' }; return null; }],
            t('z=' + s.k + '(x+' + s.a + ')=' + zx) + '.<br>' + t('x+(x+' + s.a + ')+(' + zx + ')=' + s.S) + ', so ' + t((2 + s.k) + 'x+' + (s.a + s.k * s.a) + '=' + s.S) + ' and ' + t('x=' + s.x0) + '.<br>' + t('y=' + s.x0 + '+' + s.a + '=' + s.y0) + ', ' + t('z=' + s.k + '(' + s.y0 + ')=' + s.z0) + '.<br>Check: ' + t(s.x0 + '+' + s.y0 + '+' + s.z0 + '=' + s.S) + ' ✓',
            ['Replace ' + t('y') + ' in ' + t('z=' + s.k + 'y') + ' with ' + t('x+' + s.a) + '.', 'Then every term of ' + t('x+y+z') + ' can be written with ' + t('x') + ' only.'], 'substitution chain');
          return p;
        } }] }
  ];

  function Q1(r, o) { return gen(r, o); }
  /* a prompt that starts "(a) …" in a part labelled "a graph" gets the full label, so the page doesn't print both */
  function fullLabels(def) {
    (def.questions || []).concat(def.extra || []).forEach(function (q) {
      q.parts.forEach(function (p) {
        if (!p.sub || p.sub.indexOf(' ') < 0) return;
        var mk = p.make, k = p.sub.split(' ')[0];
        p.make = function (r, sh) { var o = mk(r, sh); if (typeof o.prompt === 'string' && o.prompt.indexOf('(' + k + ')') === 0) o.prompt = '(' + p.sub + ')' + o.prompt.slice(k.length + 2); return o; };
      });
    });
    return def;
  }
  HW.defineLesson(fullLabels({
    id: 'u8l3', unit: 8, num: '3', title: 'Solving Systems by Substitution, Part 1: When a Variable Is Already Isolated', outcome: 'RF9',
    blurb: 'Substitute the isolated expression into the other equation, solve for one variable, back-substitute for the other, and check the ordered pair in both equations.',
    questions: [
      /* ---------- Part A ---------- */
      { num: '1', section: 'Part A — Substitute, solve, back-substitute', stem: 'Solve each system by substitution. Check your solution in both equations.',
        shared: function (r) {
          return {
            a: gen(r, { x: [1, 5], y: [2, 8], p: [1], A: [2, 2, 3], B: [1], test: function (S) { return S.q > 0 && S.C > 0; } }),
            b: gen(r, { x: [2, 7], y: [-2, 4], p: [1], A: [3, 3, 2, 4], B: [2, 2, 3], test: function (S) { return S.q < 0 && S.C > 0 && S.P[1] !== 0; } }),
            c: gen(r, { v: 'x', x: [3, 9], y: [1, 5], p: [1], A: [2, 2, 3], B: [-1], test: function (S) { return S.q > 0 && S.C > 0; } }),
            d: gen(r, { v: 'x', x: [3, 9], y: [1, 4], p: [2, 2, 3], A: [3, 3, 2], B: [-1], test: function (S) { return S.q > 0 && S.C > 0; } }) };
        },
        parts: [].concat.apply([], ['a', 'b', 'c', 'd'].map(function (k) {
          return [
            { id: '1' + k, sub: k + ' substitute', level: k === 'd' ? 'EMG' : 'BEG', make: function (r, sh) { var S = sh[k]; return stepPart('(' + k + ') ' + t(S.isoT) + ' and ' + t(S.othT) + '<br>Substitute: write the equation in ' + t(S.w) + ' alone that you get by replacing ' + t(S.v) + '.', S); } },
            { id: '1' + k + 's', sub: k + ' solution', level: k === 'd' ? 'EMG' : 'BEG', make: function (r, sh) { var S = sh[k]; return solvePart('(' + k + ') Solve the system, and give the solution as an ordered pair.', S); } }];
        })) },
      { num: '2', stem: 'Solve each system by substitution. Check your solution in both equations. (One answer is negative — that is normal.)',
        parts: [
          { id: '2a', sub: 'a', level: 'EMG', make: function (r) { return solvePart('(a)', gen(r, { x: [2, 6], y: [5, 12], p: [1], A: [3, 3, 2, 4], B: [-1], test: function (S) { return S.q > 0 && S.C > 0; } })); } },
          { id: '2b', sub: 'b', level: 'BEG', make: function (r) { return solvePart('(b)', gen(r, { x: [1, 4], y: [5, 13], p: [3, 3, 2, 4], A: [1], B: [1], test: function (S) { return S.q > 0; } })); } },
          { id: '2c', sub: 'c', level: 'EMG', make: function (r) { return solvePart('(c)', gen(r, { v: 'x', x: [-5, -1], y: [2, 9], p: [1], A: [1], B: [1], test: function (S) { return S.q < 0 && S.C > 0; } })); } },
          { id: '2d', sub: 'd', level: 'EMG', make: function (r) { return solvePart('(d)', gen(r, { v: 'x', x: [7, 14], y: [1, 3], p: [4, 4, 3, 5], A: [2], B: [-1], test: function (S) { return S.q > 0; } })); } }] },
      { num: '3', stem: 'Solve each system by substitution. Check your solution in both equations.',
        parts: [
          { id: '3a', sub: 'a', level: 'EMG', make: function (r) { return solvePart('(a)', gen(r, { x: [1, 5], y: [-2, 5], p: [2, 2, 3], A: [4, 4, 5, 3], B: [-1], test: function (S) { return S.q < 0 && S.C > 0 && S.A !== S.p; } })); } },
          { id: '3b', sub: 'b', level: 'PRG', make: function (r) { return solvePart('(b)', gen(r, { x: [1, 4], y: [3, 9], p: [-1, -1, -2], A: [5, 5, 3, 4], B: [2, 2, 3], test: function (S) { return S.q > 0 && S.C > 0; } })); } },
          { id: '3c', sub: 'c', level: 'PRG', make: function (r) { return solvePart('(c)', gen(r, { v: 'x', x: [-2, 4], y: [1, 4], p: [3, 3, 2], A: [2, 2, 3], B: [1], test: function (S) { return S.q < 0 && S.P[0] !== 0; } })); } }] },
      /* ---------- Part B ---------- */
      { num: '4', section: 'Part B — Checking, multiple choice, numerical response', stem: 'A student’s claimed solution is given. Substitute it into both original equations to test it. If it fails either one, find the correct solution by substitution.',
        shared: function (r) {
          var a = gen(r, { x: [2, 6], y: [6, 12], p: [1], A: [3, 3, 2], B: [-1], test: function (S) { return S.q > 0 && S.C > 0; } });
          a.claim = [a.P[0], a.P[1] - r.pick([1, 1, -1, 2])];
          var b = gen(r, { v: 'x', x: [3, 9], y: [2, 5], p: [2, 2, 3], A: [1], B: [1], test: function (S) { return S.q < 0; } });
          return { a: a, b: b };
        },
        parts: [
          { id: '4a', sub: 'a test', level: 'BEG', make: function (r, sh) { var S = sh.a; return verdictMC(r, '(a) System: ' + t(S.isoT) + ', ' + t(S.othT) + '. Claimed solution: ' + ptt(S.claim) + '.<br>Does the claimed solution work?', S.eqs, S.claim, null, null, 'verdict claimed solution (wrong)'); } },
          { id: '4a2', sub: 'a correct', level: 'EMG', make: function (r, sh) { var S = sh.a; return solvePart('(a) The claim fails. Find the correct solution by substitution.', S, { wrong: [] }); } },
          { id: '4b', sub: 'b test', level: 'BEG', make: function (r, sh) { var S = sh.b; return verdictMC(r, '(b) System: ' + t(S.isoT) + ', ' + t(S.othT) + '. Claimed solution: ' + ptt(S.P) + '.<br>Does the claimed solution work?', S.eqs, S.P, null, null, 'verdict claimed solution (right)'); } }] },
      { num: '5', parts: [
        { id: '5', level: 'EMG', make: function (r) {
          var S = gen(r, { v: 'x', x: [5, 10], y: [2, 7], p: [1], A: [2, 2, 3], B: [-1], test: function (S) { return S.q > 0 && S.C > 0 && S.P[0] !== S.P[1]; } }), y0 = S.P[1], x0 = S.P[0];
          var nbY = S.nbK !== 0 ? (S.nbR / S.nbK) : null, vals = [y0, x0, -y0], whys = {};
          whys[x0] = 'That is ' + t('x') + '. Back-substitute: ' + t('x=' + x0) + ', and the question asks for ' + t('y') + '.';
          whys[-y0] = 'Check the sign: ' + t(S.subT) + ' gives ' + t('y=' + y0) + '.';
          if (nbY != null && Number.isInteger(nbY) && vals.indexOf(nbY) < 0) { vals.push(nbY); whys[nbY] = 'Brackets: ' + t(cfT(S.cv) + '(' + S.ex + ')') + ' — multiply every term inside.'; }
          var extra = [y0 - 3, y0 + 3, 2 * y0].filter(function (v) { return vals.indexOf(v) < 0; }); while (vals.length < 4) vals.push(extra.shift());
          return mc(r, 'If ' + t(S.isoT) + ' and ' + t(S.othT) + ', then ' + t('y') + ' is equal to', vals.map(function (v, i) { return { html: t(v), right: i === 0, why: i ? (whys[v] || 'Substitute ' + t('(' + S.ex + ')') + ' for ' + t('x') + ' in ' + t(S.othT) + ' and solve for ' + t('y') + '.') : null, code: 'v' + i }; }),
            subSol(S), ['Substitute ' + t('(' + S.ex + ')') + ' for ' + t('x') + ' in the second equation.'], 'MC y by substitution');
        } }] },
      { num: '6', parts: [
        { id: '6', level: 'EMG', make: function (r) {
          var S = gen(r, { x: [1, 5], y: [3, 20], p: [4, 4, 3, 2, 5], A: [3, 3, 2, 1], B: [1], test: function (S) { return S.q < 0 && S.C > 0 && S.A !== S.p; } }), x0 = S.P[0], y0 = S.P[1], ans = x0 + y0;
          return K.P.nr('If ' + t(S.isoT) + ' and ' + t(S.othT) + ', then the value of ' + t('x+y') + ' is ____.', ans,
            function (v) { if (v === x0 || v === y0) return { code: 'nr-one', hint: 'That is only one of the values. Add ' + t('x') + ' and ' + t('y') + '.' }; return null; },
            subSol(S) + '<br>' + t('x+y=' + x0 + '+' + y0 + '=' + ans) + '.', ['Find both ' + t('x') + ' and ' + t('y') + ' by substitution, then add them.'], 'NR x+y');
        } }] }
    ],
    extra: L3EXTRA
  }));
})(window);
