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
    U.forEach(function (L) { key.pieces.push(o.context ? clipV(L, win) : lineV(L, win).pieces[0]); });
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
      if (latS(W1, win).length >= 2) { var kv = { pts: [], pieces: key.pieces.slice(), join: 'none' }; kv.pieces[i] = o.context ? clipV(W1, win) : lineV(W1, win).pieces[0]; bad.push(kv); }
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
            function (s) { var C = s.a * s.x0 + s.b * s.y0; s.C = C; return s.x0 + s.c === s.y0 && C > 0 && !(s.a === 1 && s.b === 1); });
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
    extra: []
  });
})(window);
