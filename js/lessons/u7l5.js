/* Math 15 · Unit 7 · Lesson 5 — Writing the Equation of a Line Given Slope and a Point (RF7)
 * Assignment 5 (u7_L05.tex, Questions 1–15) and the Lesson 5 Extra Practice (u7_EP05.tex, Questions 1–17), plus one
 * added Mastery challenge (Extra 18). Every part is a generator: same structure, idea and difficulty as the booklet
 * question, new numbers from the seed (the booklet's own numbers are among the possible versions).
 * Model: Math 10C u7l2.js (slopePointPart, parallel / perpendicular conditions, fee-and-rate models) — but Math 15 does
 * not use slope–point form: the method is "substitute the point into y = mx + b and solve for b", and every answer is
 * asked for in y = mx + b form (K.line form 'slope-intercept': y = 6 + 2x is fine, a right line in another form is a
 * nudge that doesn't use a try). Stopping at b ("b = 6") is a nudge to write the whole equation. Classic slips are
 * diagnosed: coordinates substituted the wrong way round, the point's y-coordinate used as b, a sign slip solving for b.
 * Where the booklet says "keep fractions exact", decimals get a nudge. Story letters are the booklet's (Q15 uses a for
 * the tree's age instead of the booklet's y — see the report).
 * Conversions: "explain" / "find the mistake" -> multiple choice whose options are reasons; "check by substituting" ->
 * a second box for the check value; "show his equation fails" -> the value his equation gives.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 18 (added: a perpendicular line through the point, then
 * where it crosses the x-axis). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, Lns = HW.lines, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ---------------- fractions as [p, q] ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function fr(p, q) { if (Array.isArray(p)) return fr(p[0], p[1]); if (q == null) q = 1; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function fv(f) { f = fr(f); return f[0] / f[1]; }
  function fAdd(a, b) { a = fr(a); b = fr(b); return fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function fSub(a, b) { b = fr(b); return fAdd(a, [-b[0], b[1]]); }
  function fMul(a, b) { a = fr(a); b = fr(b); return fr(a[0] * b[0], a[1] * b[1]); }
  function fNeg(a) { a = fr(a); return [-a[0], a[1]]; }
  function fEq(a, b) { a = fr(a); b = fr(b); return a[0] === b[0] && a[1] === b[1]; }
  function isInt(a) { return fr(a)[1] === 1; }
  function nT(a) { a = fr(a); return Lns.frT(a[0], a[1]); }   // LaTeX of a number or fraction
  function pT(a) { return fv(a) < 0 ? '\\left(' + nT(a) + '\\right)' : nT(a); }
  function ptT(x, y) { return '(' + nT(x) + ',\\ ' + nT(y) + ')'; }
  function ptK(x, y) { return '(' + nT(x) + ', ' + nT(y) + ')'; }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }
  function money(v) { return (Math.round(v * 100) / 100).toFixed(2); }
  function cash(v) { return Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : money(v); }

  /* ---------------- random helpers ---------------- */
  function niceFrac(r) { return until(function () { var q = r.pick([2, 2, 3]); return [r.int(1, 13) * r.pick([1, 1, -1]), q]; }, function (f) { return f[0] % f[1] !== 0; }); }
  function nz(r, lo, hi) { var v; do { v = r.int(lo, hi); } while (v === 0); return v; }
  function properFrac(r, qlo, qhi) { for (;;) { var q = r.int(qlo, qhi), p = r.int(1, q - 1); if (gcd(p, q) === 1) return [p, q]; } }
  function until(gen, okf) { for (var i = 0; i < 4000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('u7l5: no valid numbers'); }

  /* ---------------- equations of lines ---------------- */
  function L(m, b) { return { m: fr(m), b: fr(b) }; }
  function SI(m, b, vars) { return Lns.tex({ m: fr(m), b: fr(b) }, 'slope-intercept', null, vars); }
  function evalT(m, x, b) { return (fEq(m, 1) ? '' : fEq(m, -1) ? '-' : nT(m)) + '\\left(' + nT(x) + '\\right)' + (fv(b) < 0 ? '' : '+') + nT(b); }
  function closeL(S, T) {
    if (Math.abs(S[1]) < 1e-12 || Math.abs(T[1]) < 1e-12) return false;
    var ms = -S[0] / S[1], bs = -S[2] / S[1], mt = -T[0] / T[1], bt = -T[2] / T[1];
    return Math.abs(ms - mt) < 0.051 && Math.abs(bs - bt) < 0.051;
  }
  /* the equation part: K.P.line + a nudge for rounded decimals, the general form as an accepted alternative (form 'any'),
   * and the wrong lines (opt.wrong) as answers that must not be accepted */
  function LP(prompt, target, opt, sol, hints, text) {
    opt = opt || {};
    var vars = opt.vars || ['x', 'y'], TL = Lns.of(target);
    if (opt.vars && !opt.placeholder) opt.placeholder = 'e.g. ' + vars[1] + ' = 2' + vars[0] + ' + 3';
    var p = B.line(prompt, target, opt, sol, hints, text), c = p.check;
    p.check = function (resp) {
      var res = c(resp);
      if (res.v === 'wrong' && !opt.decimalOk && /\d\.\d/.test(String(resp))) {
        var rr = Lns.read(resp, vars);
        if (rr.ok && closeL([rr.a, rr.b, rr.c], TL)) return form('u72-decimal', 'Close — but give the <b>exact</b> equation: write the slope and the intercept as fractions, not rounded decimals.');
      }
      return res;
    };
    if (opt.keyTex) { p.key = opt.keyTex; p.answer = t(opt.keyTex); }
    var bad = [];
    (opt.wrong || []).forEach(function (w) { var is = w.is; if (typeof is === 'string') { var rw = Lns.read(is, vars); if (!(rw.ok && Lns.same([rw.a, rw.b, rw.c], TL))) bad.push(is); } else if (!Lns.same(Lns.of(is), TL)) bad.push(Lns.tex(is, 'slope-intercept', null, vars)); });
    p.bad = bad.concat(opt.bad || []).filter(function (x, i, arr) { return arr.indexOf(x) === i; });
    p.good = (!opt.form || opt.form === 'any' ? [Lns.tex(target, 'general', null, vars)] : []).concat(opt.good || []);
    return p;
  }
  /* the question asks for exact fractions: a right line typed with decimals gets a form nudge */
  function exactOnly(p) { var c = p.check; p.check = function (resp) { var res = c(resp); if (res.v === 'correct' && /\d\.\d/.test(String(resp))) return form('u72-decimal', 'Right line — but give it with exact <b>fractions</b>, not decimals, as the question asks.'); return res; }; return p; }

  /* ---------------- other checkers ---------------- */
  function isNone(s) { var z = String(s == null ? '' : s).replace(/\\text\{\s*([^}]*)\}/g, '$1').replace(/\\mathrm\{\s*([^}]*)\}/g, '$1').replace(/[\s-]+/g, '').toLowerCase(); return /^(none|no|dne)$/.test(z); }
  function readVal(s) { var z = String(s == null ? '' : s).replace(/\\left|\\right/g, '').replace(/^\s*[a-zA-Z]\s*=\s*/, '').trim(); var a = ex.parse(z); if (!a.ok) return null; var v = ex.value(a.ast); return isFinite(v) ? v : null; }
  function readPt(s) { var z = String(s == null ? '' : s).replace(/\\left|\\right/g, '').trim(); var m = /^\(([^()]*),([^()]*)\)$/.exec(z); if (!m) return null; var a = readVal(m[1]), b = readVal(m[2]); return a == null || b == null ? null : [a, b]; }
  /* one intercept box (the y-intercept as a number b or a point (0, b)); dl = [[value, code, hint]] */
  function intChk(want, dl) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Fill in the ' + t('y') + '-intercept.');
      if (isNone(s)) return wrong('u72-int-said-none', 'This line does cross the ' + t('y') + '-axis — read where.');
      var P = readPt(s), v;
      if (P) {
        if (!near(P[0], 0)) return wrong('u72-int-off', t('(' + P[0] + ',\\ ' + P[1] + ')') + ' isn’t on the ' + t('y') + '-axis: on the ' + t('y') + '-axis, ' + t('x=0') + '.');
        v = P[1];
      } else { v = readVal(s); if (v == null) return form('u72-int-unreadable', 'Give the ' + t('y') + '-intercept as a number.'); }
      if (near(v, fv(want))) return ok();
      for (var i = 0; i < (dl || []).length; i++) if (!near(fv(dl[i][0]), fv(want)) && near(v, fv(dl[i][0]))) return wrong(dl[i][1], dl[i][2]);
      if (near(v, -fv(want))) return wrong('sign', 'Check the sign: is the ' + t('y') + '-intercept above or below the origin?');
      return wrong('value', null);
    };
  }
  /* a slope box with diagnoses checked first: pre = [[value, code, hint]] */
  function slopeChk(sl, pre, opt) {
    var c = K.slope(sl, opt || {});
    pre = (pre || []).filter(function (d) { return !fEq(d[0], sl); });
    return function (resp) {
      var v = readVal(String(resp == null ? '' : resp).replace(/^\s*m\s*=\s*/, ''));
      if (v != null) for (var i = 0; i < pre.length; i++) if (near(v, fv(pre[i][0]))) return wrong(pre[i][1], pre[i][2]);
      return c(resp);
    };
  }
  function numPart(prompt, ans, dl, sol, hints, text, inp) {
    dl = (dl || []).filter(function (d) { return isFinite(d[0]) && !near(d[0], ans); });
    var p = B.number(prompt, ans, function (v) { for (var i = 0; i < dl.length; i++) if (Math.abs(v - dl[i][0]) < 1e-5) return { code: dl[i][1], hint: dl[i][2] }; return null; }, sol, hints, text, inp);
    p.key = String(Math.round(ans * 1e6) / 1e6); p.answer = (inp && inp.before ? t(inp.before) : '') + t(String(Math.round(ans * 1e6) / 1e6)) + (inp && inp.after ? ' ' + inp.after : '');
    p.bad = dl.map(function (d) { return String(Math.round(d[0] * 1e6) / 1e6); }).filter(function (x, i, arr) { return arr.indexOf(x) === i; });
    return p;
  }
  function nrPart(prompt, ans, dl, sol, hints, text) {
    dl = (dl || []).filter(function (d) { return isFinite(d[0]) && !near(d[0], ans); });
    var p = B.nr(prompt, ans, function (v) { for (var i = 0; i < dl.length; i++) if (near(v, dl[i][0])) return { code: dl[i][1], hint: dl[i][2] }; return null; }, sol, hints, text);
    p.bad = dl.map(function (d) { return String(Math.round(d[0] * 100) / 100); }).filter(function (s, i, arr) { return s.length <= 4 && arr.indexOf(s) === i; });
    return p;
  }
  /* a number or fraction box: dl = [[value, code, hint]] */
  function valPart(prompt, target, dl, sol, hints, text, inp) {
    var base = isInt(target) ? K.value(fv(target), { only: 'integer' }) : K.fraction(fr(target));
    dl = (dl || []).filter(function (d) { return !near(fv(d[0]), fv(target)); });
    var chk = function (resp) {
      var s = String(resp == null ? '' : resp).replace(/^\s*[a-zA-Z]\s*=\s*/, '');
      var res = base(s);
      if (res.v === 'wrong') { var v = readVal(s); if (v != null) for (var i = 0; i < dl.length; i++) if (near(v, fv(dl[i][0]))) return wrong(dl[i][1], dl[i][2]); }
      return res;
    };
    var p = B.math(prompt, chk, nT(target), sol, hints, text, Object.assign({ keys: 'fraction' }, inp || {}));
    p.bad = dl.map(function (d) { return nT(d[0]); });
    return p;
  }
  /* one point (x, y): dl = [[[x, y], code, hint]] */
  function ptPart(prompt, P, dl, sol, hints, text) {
    var p = B.pairs(prompt, [[fv(P[0]), fv(P[1])]], {}, sol, hints, text), c = p.check;
    dl = (dl || []).filter(function (d) { return !(near(fv(d[0][0]), fv(P[0])) && near(fv(d[0][1]), fv(P[1]))); });
    p.check = function (resp) {
      var s = String(resp == null ? '' : resp);
      if (s.trim() && !/[(]|\\left|\\lparen/.test(s) && readVal(s) != null) return form('u72-pt-value', 'Give the whole point as an ordered pair ' + t('(x,\\ y)') + ', not just one number.');
      var res = c(resp);
      if (res.v === 'wrong') for (var i = 0; i < dl.length; i++) if (K.pairs([[fv(dl[i][0][0]), fv(dl[i][0][1])]])(resp).v === 'correct') return wrong(dl[i][1], dl[i][2]);
      return res;
    };
    p.key = ptK(P[0], P[1]); p.answer = t(ptT(P[0], P[1]));
    p.bad = dl.map(function (d) { return ptK(d[0][0], d[0][1]); });
    return p;
  }
  /* several points typed by the student (any correct ones): o = { n, test(p) -> null | { code, hint } } */
  function readPts(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\\{|\\\}|\\lbrace|\\rbrace/g, ' ').replace(/\\[,;:! ]|\\quad/g, ' ').replace(/−/g, '-').trim();
    if (!s.trim()) return { empty: true };
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) {
      var xy = m[1].split(','); if (xy.length !== 2) return { bad: true };
      var a = ex.parse(xy[0].trim()), b = ex.parse(xy[1].trim()); if (!a.ok || !b.ok) return { bad: true };
      var va = ex.value(a.ast), vb = ex.value(b.ast); if (!isFinite(va) || !isFinite(vb)) return { bad: true };
      out.push([va, vb]);
    }
    if (s.replace(re, '').replace(/[,;\s{}]|and/g, '').length || !out.length) return { bad: true };
    return { pts: out };
  }
  function ptsPart(prompt, o, key, sol, hints, text) {
    var n = o.n || 1;
    var chk = function (resp) {
      var Lr = readPts(resp);
      if (Lr.empty) return form('empty', 'Type your points first.');
      if (Lr.bad) return form('pts-format', 'Write each point in brackets, separated by commas, e.g. ' + t('(3,\\ 0),\\ (4,\\ 3)') + '.');
      var P = Lr.pts, i, j;
      for (i = 0; i < P.length; i++) for (j = 0; j < i; j++) if (near(P[i][0], P[j][0]) && near(P[i][1], P[j][1])) return form('pts-dup', 'You wrote ' + t(ptT(P[i][0], P[i][1])) + ' twice — give ' + n + ' different points.');
      for (i = 0; i < P.length; i++) { var h = o.test(P[i]); if (h) return wrong(h.code, h.hint); }
      if (P.length < n) return form('pts-few', (P.length === 1 ? 'That point works! ' : 'Those work! ') + 'You need ' + n + ' points in all.');
      return ok();
    };
    return B.math(prompt, chk, key.map(function (q) { return ptK(q[0], q[1]); }).join(', '), sol, hints, text, { keys: 'pairs', placeholder: 'e.g. (3, 0), (4, 3)' });
  }
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  function uniqOpts(opts) { var seen = {}; return opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; }); }
  /* fields: equation-keypad boxes */
  function fld(label, opt) { return Object.assign({ name: label, label: label, mode: 'math', keys: 'eq', placeholder: 'number' }, opt || {}); }

  function fDiv(a, b) { b = fr(b); return fMul(a, [b[1], b[0]]); }
  function fInv(a) { a = fr(a); return fr(a[1], a[0]); }
  function nrec(a) { return fNeg(fInv(a)); }
  function pm(r) { return r.chance(0.5) ? 1 : -1; }

  /* ---------------- hints ---------------- */
  var H_PT = ['Write ' + t('y=mx+b') + ' with the slope in place of ' + t('m') + '. Substitute the point: its ' + t('x') + '-coordinate for ' + t('x') + ' and its ' + t('y') + '-coordinate for ' + t('y') + '. Solve for ' + t('b') + '.', 'Then write the whole equation with ' + t('m') + ' and ' + t('b') + ' — and check that the point makes it true.'];
  var H_NEG = 'Substitute each coordinate <b>with</b> its sign, in brackets: a negative times a negative is positive.';
  var H_PAR = 'Parallel lines have <b>equal</b> slopes: read the slope off the given line.';
  var H_PERP = 'Perpendicular slopes are <b>negative reciprocals</b>: flip the slope and change its sign.';

  /* ---------------- substitute and solve ---------------- */
  /* worked step: y0 = m(x0) + b  =>  y0 = (m x0) + b  =>  b = y0 − (m x0) */
  function subSol(m, x0, y0) {
    var mx = fMul(m, x0), b = fSub(y0, mx);
    return t(nT(y0) + '=' + (fEq(m, 1) ? '' : fEq(m, -1) ? '-' : nT(m)) + '\\left(' + nT(x0) + '\\right)+b\\ \\Rightarrow\\ ' + nT(y0) + '=' + nT(mx) + '+b') + '<br>' +
      t('b=' + nT(y0) + (fv(mx) < 0 ? '+' + nT(fNeg(mx)) : '-' + nT(mx)) + '=' + nT(b));
  }
  function bOf(m, x0, y0) { return fSub(y0, fMul(m, x0)); }
  /* "b = 6" or "6" instead of the equation: a nudge */
  function stopB(p, b) {
    var c = p.check;
    p.check = function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!/[xy]/.test(s.replace(/^\s*b\s*=/, '')) || /^\s*b\s*=/.test(s)) { var v = readVal(s.replace(/^\s*b\s*=\s*/, '')); if (v != null && near(v, fv(b))) return form('u7l5-stop-b', 'Right value of ' + t('b') + '! Now write the whole equation, ' + t('y=mx+b') + ', with the slope and this ' + t('b') + '.'); }
      return c(resp);
    };
    return p;
  }
  /* slope m through (x0, y0) -> y = mx + b. opt: { prompt, vars, wrong, pre (solution start), exact, hints, text, form } */
  function spPart(m, x0, y0, opt) {
    opt = opt || {}; m = fr(m);
    var vars = opt.vars || ['x', 'y'], X = vars[0], Y = vars[1], b = bOf(m, x0, y0), slip = fAdd(y0, fMul(m, x0)), sw = bOf(m, y0, x0);
    var w = (opt.wrong || []).slice();
    if (!fEq(slip, b)) w.push({ is: L(m, slip), code: 'u72-b-solve', hint: 'Check how you solved for ' + t('b') + ': from ' + t(nT(y0) + '=' + nT(fMul(m, x0)) + '+b') + ', <b>subtract</b> ' + t(nT(fMul(m, x0))) + ' from both sides.' });
    if (!fEq([y0, 1], b) && !fEq(fr(y0), b)) w.push({ is: L(m, y0), code: 'u72-b-y0', hint: t(nT(y0)) + ' is the point’s ' + t(Y) + '-coordinate, not ' + t('b') + ' — the point isn’t on the ' + t(Y) + '-axis. Substitute it into ' + t(Y + '=m' + X + '+b') + ' and solve for ' + t('b') + '.' });
    if (!fEq(sw, b) && !fEq(sw, slip) && !fEq(sw, fr(y0))) w.push({ is: L(m, sw), code: 'u7l5-swap-xy', hint: 'The coordinates went into the wrong places: the <b>first</b> number of ' + t(ptT(x0, y0)) + ' replaces ' + t(X) + ', the second replaces ' + t(Y) + '.' });
    var p = LP(opt.prompt || ('slope ' + t(nT(m)) + ', point ' + t(ptT(x0, y0))), L(m, b), { vars: vars, form: opt.form || 'slope-intercept', point: [fv(x0), fv(y0)], wrong: w, decimalOk: opt.decimalOk },
      (opt.pre || '') + subSol(m, x0, y0) + '<br>' + t(SI(m, b, vars)) + '.<br><b>Check.</b> ' + t(evalT(m, x0, b) + '=' + nT(fAdd(fMul(m, x0), b))) + ' ✓',
      opt.hints || (fv(x0) < 0 || fv(y0) < 0 || fv(m) < 0 ? [H_PT[0], H_NEG] : H_PT), opt.text || ('slope ' + nT(m) + ' through ' + ptK(x0, y0)));
    if (opt.exact) exactOnly(p);
    return stopB(p, b);
  }
  /* the value of b alone (MC / NR helpers) */
  function bWrongs(m, x0, y0) { var b = bOf(m, x0, y0); return { b: b, slip: fAdd(y0, fMul(m, x0)), sw: bOf(m, y0, x0), y0: fr(y0) }; }
  /* a vertical line through P */
  function vertPart(P, prompt, extraW) {
    return LP(prompt, { x: P[0] }, { wrong: [{ is: { y: P[1] }, code: 'line-vh', hint: 'That’s a horizontal line. An <b>undefined</b> slope means a vertical line: ' + t('x=') + ' a number.' }, { is: { x: P[1] }, code: 'u72-coord', hint: 'Right kind of line (vertical) — but every point on it has the same <b>' + t('x') + '</b>-coordinate as ' + t(ptT(P[0], P[1])) + '.' }].concat(extraW || []) },
      'An undefined slope means a <b>vertical</b> line: every point has the same ' + t('x') + '-coordinate as ' + t(ptT(P[0], P[1])) + ', so ' + t('x=' + P[0]) + '.<br><b>Check.</b> ' + t(ptT(P[0], P[1])) + ' has ' + t('x=' + P[0]) + ' ✓', ['A vertical line: ' + t('x=') + ' the point’s ' + t('x') + '-coordinate.'], 'vertical through ' + ptK(P[0], P[1]));
  }
  function horizPart(P, prompt, extraW) {
    return LP(prompt, { y: fv(P[1]) }, { keyTex: 'y=' + nT(P[1]), wrong: [{ is: { x: fv(P[0]) }, code: 'line-vh', hint: 'That’s a vertical line. A slope of ' + t(0) + ' means a <b>horizontal</b> line: ' + t('y=') + ' a number.' }, { is: { y: fv(P[0]) }, code: 'u72-coord', hint: 'Right kind of line (horizontal) — but every point on it has the same <b>' + t('y') + '</b>-coordinate as ' + t(ptT(P[0], P[1])) + '.' }].concat(extraW || []) },
      'A slope of ' + t(0) + ' means a <b>horizontal</b> line: every point has the same ' + t('y') + '-coordinate as ' + t(ptT(P[0], P[1])) + ', so ' + t('y=' + nT(P[1])) + '. (With ' + t('m=0') + ': ' + t(nT(P[1]) + '=0(' + nT(P[0]) + ')+b') + ', so ' + t('b=' + nT(P[1])) + '.)', ['A horizontal line: ' + t('y=') + ' the point’s ' + t('y') + '-coordinate.'], 'horizontal through ' + ptK(P[0], P[1]));
  }
  /* an equation box plus a check box: "substitute x = x0 into your equation: y = ___" */
  function withCheck(m, x0, y0, prompt, text) {
    m = fr(m); var b = bOf(m, x0, y0);
    var lw = [{ is: L(m, fAdd(y0, fMul(m, x0))), code: 'u72-b-solve', hint: 'Check how you solved for ' + t('b') + ': subtract ' + t(nT(fMul(m, x0))) + ' from both sides.' }, { is: L(m, y0), code: 'u72-b-y0', hint: t(y0) + ' is the point’s ' + t('y') + '-coordinate, not ' + t('b') + '.' }];
    var fields = [fld('equation', { wide: true, placeholder: 'y = …' }), fld('check: ' + t('x=' + x0), { before: t('y='), placeholder: 'number' })];
    var p = B.fields(prompt, fields, [K.line(L(m, b), { form: 'slope-intercept', point: [x0, y0], wrong: lw }), K.number(y0, function (v) { return near(v, x0) ? { code: 'u7l5-swap-xy', hint: 'Substitute ' + t('x=' + x0) + ' into your equation and work out ' + t('y') + '.' } : { code: 'u7l5-check', hint: 'If your equation is right, substituting ' + t('x=' + x0) + ' must give the point’s ' + t('y') + '-coordinate. Recheck your ' + t('b') + '.' }; })],
      [SI(m, b), String(y0)], t(SI(m, b)) + '; check: ' + t('y=' + y0),
      subSol(m, x0, y0) + '<br>' + t(SI(m, b)) + '.<br><b>Check.</b> ' + t('x=' + x0 + ':\\ y=' + evalT(m, x0, b) + '=' + y0) + ', the point’s ' + t('y') + '-coordinate ✓', H_PT, text);
    p.bad = [[SI(m, fAdd(y0, fMul(m, x0))), String(y0)]]; if (x0 !== y0) p.bad.push([SI(m, b), String(x0)]);
    return p;
  }

  HW.addCodes({
    'u72-decimal': 'Rounded decimals instead of exact fractions', 'u72-swap-mb': 'Swapped slope and y-intercept', 'u72-coord': 'Used the other coordinate', 'u72-b-solve': 'Sign slip solving for b', 'u72-b-y0': 'Used the point’s y-coordinate as b',
    'u72-fee': 'Forgot the fixed fee', 'u72-rate-fee': 'Mixed up the rate and the fee', 'u72-int-said-none': 'Said “none” for an intercept that exists', 'u72-int-off': 'Intercept point not on the axis', 'u72-int-unreadable': 'Intercept not a number', 'u72-int-swap': 'Swapped x- and y-intercepts',
    'u72-pt-value': 'Gave one number instead of a point', 'u72-perp-same': 'Perpendicular: used the given slope', 'u72-perp-nosign': 'Perpendicular: flipped but kept the sign', 'u72-perp-noflip': 'Perpendicular: changed the sign but didn’t flip', 'u72-par-perp': 'Parallel: used the perpendicular slope', 'u72-given-line': 'Wrote the given line itself',
    'u7l5-stop-b': 'Stopped at b instead of writing the equation', 'u7l5-swap-xy': 'Substituted the coordinates the wrong way round', 'u7l5-check': 'Check value doesn’t match the point', 'u7l5-start': 'Gave the known value instead of the starting value',
    'u7l5-pred-b': 'Predicted from the known point instead of the start', 'u7l5-years': 'Didn’t convert years to months', 'u7l5-solve': 'Error solving for the unknown', 'u7l5-xint': 'Error finding the x-intercept', 'u7l5-his': 'Wrong value for the student’s equation'
  });
  HW.addPartial({ 'u72-b-solve': 'b', 'u72-fee': 'b', 'u72-int-off': 'b', 'u72-perp-nosign': 'b', 'u72-b-y0': 'n', 'u72-swap-mb': 'n', 'u72-coord': 'n', 'u72-rate-fee': 'n', 'u72-int-swap': 'n', 'u72-int-said-none': 'n',
    'u72-perp-same': 'n', 'u72-perp-noflip': 'b', 'u72-par-perp': 'n', 'u72-given-line': 'n', 'u7l5-swap-xy': 'b', 'u7l5-check': 'n', 'u7l5-start': 'n', 'u7l5-pred-b': 'b', 'u7l5-years': 'b', 'u7l5-solve': 'b', 'u7l5-xint': 'b', 'u7l5-his': 'n' });

  /* a point (x0, y0) on y = mx + b with nice numbers */
  function ptOn(r, m, xs, bs) { var x0 = r.pick(xs), b = r.pick(bs); return [x0, fv(fAdd(fMul(m, x0), [b, 1]))]; }
  function range(a, z) { var o = []; for (var i = a; i <= z; i++) o.push(i); return o; }
  function nzr(a, z) { return range(a, z).filter(function (v) { return v !== 0; }); }

  /* stories: a rate and one reading (t1, v1) */
  function storyEq(prompt, m, t1, v1, vars, text, extra) {
    return spPart(m, t1, v1, { prompt: prompt, vars: vars, form: vars.indexOf('m') >= 0 ? 'any' : 'slope-intercept', text: text, hints: ['The rate is the slope ' + t('m') + (fv(m) < 0 ? ' (negative: the amount goes down)' : '') + '. The reading gives a point ' + t('(' + vars[0] + ',\\ ' + vars[1] + ')') + '.', 'Substitute the point and solve for ' + t('b') + ': the value when ' + t(vars[0] + '=0') + '.'], wrong: extra });
  }
  function storyStart(prompt, m, t1, v1, inp, text) {
    var b = fv(bOf(m, t1, v1));
    return numPart(prompt, b, [[v1, 'u7l5-start', 'That’s the value at ' + t('t=' + t1) + '. The starting value goes with ' + t('0') + ': it is ' + t('b') + '.'], [fv(fAdd(v1, fMul(m, t1))), 'u72-b-solve', 'Check the direction: ' + (fv(m) < 0 ? 'the amount goes <b>down</b> over time, so it was <b>higher</b> at the start.' : 'the amount goes <b>up</b> over time, so it was <b>lower</b> at the start.')]],
      'This is ' + t('b') + ': ' + subSol(m, t1, v1) + '.', ['The value at time ' + t('0') + ' is ' + t('b') + ' in your equation.'], text, inp);
  }
  function storyPredict(prompt, m, t1, v1, t2, inp, text, X) {
    var b = bOf(m, t1, v1), v = fv(fAdd(fMul(m, t2), b));
    return numPart(prompt, v, [[fv(fMul(m, t2)), 'u72-fee', 'Add ' + t('b=' + nT(b)) + ' too.'], [fv(fAdd(fMul(m, t2), [v1, 1])), 'u7l5-pred-b', 'Use the starting value ' + t('b=' + nT(b)) + ', not the reading at ' + t(t1) + '.'], [fv(fAdd(fMul(fNeg(m), t2), b)), 'sign', 'Check the sign of the rate.']],
      t(X + '=' + t2 + ':\\ ' + evalT(m, t2, b) + '=' + nT(fMul(m, t2)) + (fv(b) < 0 ? '' : '+') + nT(b) + '=' + v) + '.', ['Substitute ' + t(X + '=' + t2) + ' into your equation.'], text, inp);
  }

  HW.defineLesson({
    id: 'u7l5', unit: 7, num: '5', title: 'Writing the Equation of a Line Given Slope and a Point', outcome: 'RF7',
    blurb: 'Substitute a point into y = mx + b and solve for b — with negative numbers, fractions, and in real situations.',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A — Substitute and solve', stem: 'Use the substitute-and-solve method to determine the equation of the line with the given slope through the given point.', parts: ['a', 'b', 'c', 'd', 'e', 'f'].map(function (s) {
        return { id: '1' + s, level: 'BEG', make: function (r) {
          var m = s === 'd' ? 1 : r.int(2, 7), x0 = r.int(1, 6), b = r.int(1, 9);
          return spPart([m, 1], x0, m * x0 + b);
        } };
      }) },
      { num: '2', stem: 'Determine the equation of the line with the given slope through the given point.', parts: ['a', 'b', 'c', 'd'].map(function (s) {
        return { id: '2' + s, level: 'EMG', make: function (r) {
          var m = s === 'd' ? -1 : -r.int(2, 6), x0 = r.int(s === 'd' ? 3 : 2, s === 'd' ? 9 : 5), b = r.int(3, 10);
          return spPart([m, 1], x0, m * x0 + b);
        } };
      }) },
      { num: '3', stem: 'Determine the equation of the line with the given slope through the given point. Each point has two negative coordinates.', parts: ['a', 'b', 'c', 'd'].map(function (s, i) {
        return { id: '3' + s, level: 'EMG', make: function (r) {
          var m = (i % 2 ? -1 : 1) * r.int(2, 6), P = until(function () { return [-r.int(1, 6), -r.int(1, 12)]; }, function (p) { return Math.abs(fv(bOf([m, 1], p[0], p[1]))) <= 20 && fv(bOf([m, 1], p[0], p[1])) !== 0; });
          return spPart([m, 1], P[0], P[1]);
        } };
      }) },
      { num: '4', stem: 'Determine the equation of the line with the given slope through the given point. Leave the slope as a fraction.', parts: [
        { id: '4a', level: 'EMG', make: function (r) { var m = [1, 2], P = ptOn(r, m, [2, 4, 6, 8, 10], range(1, 9)); return spPart(m, P[0], P[1]); } },
        { id: '4b', level: 'EMG', make: function (r) { var m = r.pick([[1, 3], [2, 3], [1, 4]]), P = ptOn(r, m, [m[1], 2 * m[1], 3 * m[1]], range(1, 9)); return spPart(m, P[0], P[1]); } },
        { id: '4c', level: 'PRG', make: function (r) { var m = r.pick([[-3, 4], [-1, 4], [-2, 3], [-3, 2]]), P = ptOn(r, m, [m[1], 2 * m[1]], range(2, 10)); return spPart(m, P[0], P[1]); } },
        { id: '4d', level: 'PRG', make: function (r) { var m = r.pick([[-1, 2], [-1, 3], [-3, 2]]), P = ptOn(r, m, [-m[1], -2 * m[1], -3 * m[1]], range(1, 9)); return spPart(m, P[0], P[1]); } }] },
      { num: '5', stem: function (sh) { return 'First decide whether the given point <i>is</i> the ' + t('y') + '-intercept. If it is, state ' + t('b') + ' right away; if not, use the substitute-and-solve method.'; },
        shared: function (r) { return { m: r.int(2, 6) * pm(r), k: nz(r, -9, 9), x1: r.int(1, 4) }; },
        parts: [
          { id: '5a', level: 'BEG', make: function (r, sh) {
            return stopB(LP('slope ' + t(sh.m) + ', point ' + t(ptT(0, sh.k)), L(sh.m, sh.k), { form: 'slope-intercept', wrong: [{ is: L(sh.m, -sh.k), code: 'u72-b-solve', hint: 'The point ' + t(ptT(0, sh.k)) + ' is on the ' + t('y') + '-axis, so it <b>is</b> the ' + t('y') + '-intercept: ' + t('b=' + sh.k) + ' exactly, sign and all.' }] },
              t(ptT(0, sh.k)) + ' has ' + t('x=0') + ': it is on the ' + t('y') + '-axis, so it <b>is</b> the ' + t('y') + '-intercept and ' + t('b=' + sh.k) + ' right away.<br>' + t(SI(sh.m, sh.k)) + '.', ['A point with ' + t('x=0') + ' is on the ' + t('y') + '-axis.'], 'point is y-int'), [sh.k, 1]);
          } },
          { id: '5b', level: 'EMG', make: function (r, sh) { return spPart([sh.m, 1], sh.x1, sh.k, { pre: t(ptT(sh.x1, sh.k)) + ' has ' + t('x=' + sh.x1 + '\\ne 0') + ', so it is <b>not</b> the ' + t('y') + '-intercept. Substitute and solve:<br>' }); } }] },
      { num: '6', stem: 'Determine the equation of each line, then check it by substituting the given point back into your final equation.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { var m = r.int(2, 6), x0 = r.int(2, 5), b = r.int(1, 9); return withCheck([m, 1], x0, m * x0 + b, 'slope ' + t(m) + ', point ' + t(ptT(x0, m * x0 + b)), 'with check +'); } },
        { id: '6b', level: 'EMG', make: function (r) { var m = -r.int(2, 5), x0 = r.int(2, 6), b = r.int(3, 12); return withCheck([m, 1], x0, m * x0 + b, 'slope ' + t(m) + ', point ' + t(ptT(x0, m * x0 + b)), 'with check −'); } }] },

      /* ---------------- Part B ---------------- */
      { num: '7', section: 'Part B — Applications', stem: function (sh) { return 'A hiker descends a mountain trail at a constant rate. After ' + t(sh.t1) + ' hours her elevation is ' + t(sh.v1) + ' m, and she descends at ' + t(sh.k) + ' m per hour. Let ' + t('E') + ' be her elevation (in metres) after ' + t('t') + ' hours.'; },
        shared: function (r) { return until(function () { var k = r.pick([100, 120, 150, 150, 200, 250]), t1 = r.int(2, 5), E0 = r.int(12, 30) * 100; return { k: k, t1: t1, E0: E0, v1: E0 - k * t1, t2: t1 + r.int(1, 4) }; }, function (o) { return o.E0 - o.k * o.t2 > 0; }); },
        parts: [
          { id: '7a', level: 'PRG', make: function (r, sh) { return storyEq('Write an equation for ' + t('E') + ' in terms of ' + t('t') + '.', [-sh.k, 1], sh.t1, sh.v1, ['t', 'E'], 'hiker equation'); } },
          { id: '7b', level: 'EMG', make: function (r, sh) { return storyStart('What was her elevation at ' + t('t=0') + '?', [-sh.k, 1], sh.t1, sh.v1, { after: 'm' }, 'hiker start'); } },
          { id: '7c', level: 'EMG', make: function (r, sh) { return storyPredict('Predict her elevation after ' + t(sh.t2) + ' hours.', [-sh.k, 1], sh.t1, sh.v1, sh.t2, { after: 'm' }, 'hiker predict', 't'); } }] },
      { num: '8', stem: function (sh) { return 'A gym’s membership grows at a constant rate. After ' + t(sh.t1) + ' months the gym has ' + t(sh.v1) + ' members, and membership grows by ' + t(sh.k) + ' members every month. Let ' + t('M') + ' be the number of members after ' + t('m') + ' months.'; },
        shared: function (r) { var k = r.pick([5, 8, 10, 12, 15, 20]), t1 = r.int(2, 6), M0 = r.int(6, 30) * 10; return { k: k, t1: t1, v1: M0 + k * t1, t2: t1 + r.int(2, 8) }; },
        parts: [
          { id: '8a', level: 'EMG', make: function (r, sh) { return storyEq('Write an equation for ' + t('M') + ' in terms of ' + t('m') + '.', [sh.k, 1], sh.t1, sh.v1, ['m', 'M'], 'gym equation'); } },
          { id: '8b', level: 'EMG', make: function (r, sh) { return storyStart('How many members were there at ' + t('m=0') + '?', [sh.k, 1], sh.t1, sh.v1, { after: 'members' }, 'gym start'); } },
          { id: '8c', level: 'EMG', make: function (r, sh) { return storyPredict('Predict the membership after ' + t(sh.t2) + ' months.', [sh.k, 1], sh.t1, sh.v1, sh.t2, { after: 'members' }, 'gym predict', 'm'); } }] },
      { num: '9', stem: function (sh) { return 'A young tree grows at a constant rate. At age ' + t(sh.t1) + ' years it is ' + t(sh.v1) + ' ft tall, and it grows ' + t(sh.k) + ' ft every year. Let ' + t('h') + ' be the height (in feet) at age ' + t('w') + ' years.'; },
        shared: function (r) { var k = r.int(2, 4), t1 = r.int(5, 14), h0 = r.int(3, 15); return { k: k, t1: t1, v1: h0 + k * t1, t2: t1 + r.int(4, 10) }; },
        parts: [
          { id: '9a', level: 'EMG', make: function (r, sh) { return storyEq('Write an equation for ' + t('h') + ' in terms of ' + t('w') + '.', [sh.k, 1], sh.t1, sh.v1, ['w', 'h'], 'tree equation'); } },
          { id: '9b', level: 'EMG', make: function (r, sh) { return storyStart('How tall was the tree at age ' + t(0) + '?', [sh.k, 1], sh.t1, sh.v1, { after: 'ft' }, 'tree start'); } },
          { id: '9c', level: 'EMG', make: function (r, sh) { return storyPredict('Predict the height at age ' + t(sh.t2) + '.', [sh.k, 1], sh.t1, sh.v1, sh.t2, { after: 'ft' }, 'tree predict', 'w'); } }] },

      /* ---------------- Part C ---------------- */
      { num: '10', section: 'Part C — Multiple choice and numerical response', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var o = until(function () { var m = r.int(2, 6), x0 = r.int(1, 4), b = r.int(2, 9); return { m: m, x0: x0, b: b, y0: m * x0 + b }; }, function (o) { return o.b !== o.m && o.m * o.x0 !== o.y0 + o.b && o.b !== o.y0; });
          return mc(r, 'Which is the equation of the line with slope ' + t(o.m) + ' through ' + t(ptT(o.x0, o.y0)) + '?', uniqOpts([
            { html: t(SI(o.m, -o.b)), why: 'Check how you solved for ' + t('b') + ': ' + t(o.y0 + '=' + (o.m * o.x0) + '+b') + ' gives ' + t('b=' + o.y0 + '-' + (o.m * o.x0)) + '.' },
            { html: t(SI(o.m, o.b)), right: true },
            { html: t(SI(o.m, o.y0)), why: t(o.y0) + ' is the point’s ' + t('y') + '-coordinate, not the ' + t('y') + '-intercept.' },
            { html: t(SI(o.b, o.m)), why: 'The slope ' + t(o.m) + ' must multiply ' + t('x') + '.' }]),
            subSol([o.m, 1], o.x0, o.y0) + ', so ' + t(SI(o.m, o.b)) + '.', H_PT, 'MC slope-point', true);
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var o = until(function () { var m = -r.int(2, 6), x0 = r.int(2, 5), y0 = nz(r, -6, 6); return { m: m, x0: x0, y0: y0, b: y0 - m * x0 }; }, function (o) { return o.b !== 0 && o.y0 + o.m * o.x0 !== 0 && o.y0 + o.m * o.x0 !== -o.b && o.y0 + o.m * o.x0 !== o.b && Math.abs(o.b) !== Math.abs(o.y0 + o.m * o.x0) && Math.abs(o.b) <= 25; });
          var slip = o.y0 + o.m * o.x0;
          return mc(r, 'A line has slope ' + t(o.m) + ' and passes through ' + t(ptT(o.x0, o.y0)) + '. What is the value of ' + t('b') + ' in ' + t('y=' + o.m + 'x+b') + '?', [
            { html: t(-o.b), why: 'Check the sign: ' + t(o.m + '(' + o.x0 + ')=' + (o.m * o.x0)) + ', so ' + t('b=' + o.y0 + '-' + pT(o.m * o.x0)) + '.' },
            { html: t(-slip), why: 'Substitute the point with its signs: ' + t(o.y0 + '=' + o.m + '(' + o.x0 + ')+b') + '.' },
            { html: t(o.b), right: true },
            { html: t(slip), why: 'To get ' + t('b') + ' alone, <b>subtract</b> ' + t(pT(o.m * o.x0)) + ' from both sides — subtracting a negative adds.' }],
            subSol([o.m, 1], o.x0, o.y0) + '.', [H_PT[0], H_NEG], 'MC value of b', true);
        } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'EMG', make: function (r) {
          var o = until(function () { var m = r.int(3, 8), x0 = 1, y0 = r.int(1, m - 1); return { m: m, x0: x0, y0: y0, b: y0 - m }; }, function (o) { return o.b !== -o.y0; });
          return mc(r, 'A line has slope ' + t(o.m) + ' and passes through ' + t(ptT(1, o.y0)) + '. Which is the correct equation in ' + t('y=mx+b') + ' form?', uniqOpts([
            { html: t(SI(o.m, -o.b)), why: 'Check the sign of ' + t('b') + ': ' + t(o.y0 + '=' + o.m + '+b') + ', so ' + t('b=' + o.y0 + '-' + o.m + '=' + o.b) + '.' },
            { html: t(SI(o.m, -o.y0)), why: 'Substitute and solve: ' + t(o.y0 + '=' + o.m + '(1)+b') + '.' },
            { html: t(SI(-o.m, o.b)), why: 'The slope is ' + t(o.m) + ', positive.' },
            { html: t(SI(o.m, o.b)), right: true }]),
            subSol([o.m, 1], 1, o.y0) + ', so ' + t(SI(o.m, o.b)) + '.', H_PT, 'MC equation', true);
        } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '13', level: 'BEG', make: function (r) {
          var m = r.int(2, 9), x0 = r.int(1, 4), b = r.int(1, 9), y0 = m * x0 + b;
          return nrPart('A line has slope ' + t(m) + ' and passes through ' + t(ptT(x0, y0)) + '. The value of ' + t('b') + ' in ' + t('y=' + m + 'x+b') + ' is ________.', b, [[y0 + m * x0, 'u72-b-solve', 'Subtract ' + t(m * x0) + ' from ' + t(y0) + ' — don’t add.'], [y0, 'u72-b-y0', t(y0) + ' is the ' + t('y') + '-coordinate of the point, not ' + t('b') + '.']],
            subSol([m, 1], x0, y0) + '.', H_PT, 'NR b');
        } }] },
      { num: '14', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '14', level: 'EMG', make: function (r) {
          var o = until(function () { var m = -r.int(2, 5), x0 = -r.int(1, 4), y0 = r.int(1, 9); return { m: m, x0: x0, y0: y0, b: y0 - m * x0 }; }, function (o) { return o.b !== 0 && Math.abs(o.b) < 10; });
          return nrPart('A line has slope ' + t(o.m) + ' and passes through ' + t(ptT(o.x0, o.y0)) + '. Written as ' + t('y=' + o.m + 'x+b') + ', the value of ' + t('b') + ' is ________.', o.b, [[o.y0 + o.m * o.x0, 'u72-b-solve', 'A negative times a negative is positive: ' + t(o.m + '(' + o.x0 + ')=' + (o.m * o.x0)) + '. Then subtract it.'], [o.y0 - o.m * -o.x0, 'sign', 'Keep the sign of ' + t('x=' + o.x0) + ': ' + t(o.m + '(' + o.x0 + ')=' + (o.m * o.x0)) + '.'], [o.y0, 'u72-b-y0', t(o.y0) + ' is the point’s ' + t('y') + '-coordinate.']],
            subSol([o.m, 1], o.x0, o.y0) + '.', [H_PT[0], H_NEG], 'NR b negatives');
        } }] },
      { num: '15', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '15', level: 'EMG', make: function (r) {
          var k = r.int(2, 4), a1 = r.int(4, 9), h0 = r.int(1, 9), H = h0 + k * a1;
          return nrPart('A tree is ' + t(H) + ' ft tall at age ' + t(a1) + ' and grows ' + t(k) + ' ft per year; its height is ' + t('h=' + k + 'a+b') + ', where ' + t('a') + ' is its age in years. The value of ' + t('b') + ' is ________.', h0, [[H + k * a1, 'u72-b-solve', 'Subtract ' + t(k * a1) + ' — the tree was <b>shorter</b> when it was younger.'], [H, 'u72-b-y0', 'That’s its height at age ' + t(a1) + '. ' + t('b') + ' is the height at age ' + t(0) + '.'], [H - k, 'u7l5-solve', 'Multiply the rate by the age first: ' + t(k + '(' + a1 + ')=' + (k * a1)) + '.']],
            t(H + '=' + k + '(' + a1 + ')+b\\ \\Rightarrow\\ ' + H + '=' + (k * a1) + '+b\\ \\Rightarrow\\ b=' + h0) + '.', ['Substitute ' + t('a=' + a1) + ' and ' + t('h=' + H) + ', then solve for ' + t('b') + '.'], 'NR tree b');
        } }] }
    ],

    /* =============================== EXTRA PRACTICE =============================== */
    extra: [
      { num: '1', section: 'Extra practice A — Substitute and solve with harder numbers', stem: 'Determine the equation of each line in the form ' + t('y=mx+b') + '. None of the given points is the ' + t('y') + '-intercept, so each one needs the substitute-and-solve step.',
        parts: [['a', 1, -1, -1, 'EMG'], ['b', -1, -1, 1, 'EMG'], ['c', 1, -1, 1, 'EMG'], ['d', -1, 1, -1, 'PRG'], ['e', 1, -1, -1, 'PRG'], ['f', -1, -1, 1, 'PRG']].map(function (c) {
          return { id: 'e1' + c[0], level: c[4], make: function (r) {
            var m = c[1] * r.int(4, 9), P = until(function () { return [c[2] * r.int(2, 7), c[3] * r.int(1, 20)]; }, function (p) { var b = p[1] - m * p[0]; return b !== 0 && Math.abs(b) <= 40 && b !== p[1]; });
            return spPart([m, 1], P[0], P[1]);
          } };
        }) },
      { num: '2', stem: 'Determine the equation of each line. The slopes are fractions — keep them exact.', parts: [
        { id: 'e2a', level: 'PRG', make: function (r) { var m = r.pick([[2, 3], [1, 3], [3, 4], [2, 5]]), P = [m[1] * r.int(1, 3), nz(r, -9, 9)]; return spPart(m, P[0], P[1], { exact: true }); } },
        { id: 'e2b', level: 'PRG', make: function (r) { var m = r.pick([[-3, 5], [-2, 5], [-4, 3], [-3, 2]]), P = [-m[1] * r.int(1, 2), r.int(1, 9)]; return spPart(m, P[0], P[1], { exact: true }); } },
        { id: 'e2c', level: 'PRG', make: function (r) { var m = r.pick([[-7, 4], [-5, 4], [-5, 2], [-7, 3]]), P = [-m[1] * r.int(1, 2), r.int(1, 9)]; return spPart(m, P[0], P[1], { exact: true }); } },
        { id: 'e2d', level: 'PRG', make: function (r) { var m = r.pick([[5, 6], [5, 4], [7, 6], [3, 4]]), P = [-m[1] * r.int(1, 2), -r.int(1, 9)]; return spPart(m, P[0], P[1], { exact: true }); } }] },
      { num: '3', stem: 'Determine the equation of each line. Here ' + t('mx') + ' does <i>not</i> divide evenly, so ' + t('b') + ' itself is a fraction. Leave your answer exact.', parts: [
        { id: 'e3a', level: 'ADV', make: function (r) { var m = [1, 2], P = [2 * r.int(0, 4) + 1, nz(r, -6, 6)]; return spPart(m, P[0], P[1], { exact: true }); } },
        { id: 'e3b', level: 'ADV', make: function (r) { var m = r.pick([[-2, 3], [-1, 3], [2, 3]]), P = until(function () { return [r.int(1, 8), nz(r, -6, 6)]; }, function (p) { return p[0] % 3 !== 0; }); return spPart(m, P[0], P[1], { exact: true }); } }] },

      { num: '4', section: 'Extra practice B — Horizontal, vertical, parallel and perpendicular', stem: 'Write the equation of each line. Two of them are not in the form ' + t('y=mx+b') + ' at all.',
        shared: function (r) { var P = until(function () { return [nz(r, -9, 9), nz(r, -9, 9)]; }, function (p) { return Math.abs(p[0]) !== Math.abs(p[1]); }), Q = until(function () { return [nz(r, -9, 9), nz(r, -9, 9)]; }, function (p) { return Math.abs(p[0]) !== Math.abs(p[1]); }), D = until(function () { return [nz(r, -9, 9), nz(r, -9, 9)]; }, function (p) { return Math.abs(p[0]) !== Math.abs(p[1]); }); return { P: P, Q: Q, D: D }; },
        parts: [
          { id: 'e4a', level: 'BEG', make: function (r, sh) { return horizPart(sh.P, 'slope ' + t(0) + ', through ' + t(ptT(sh.P[0], sh.P[1]))); } },
          { id: 'e4b', level: 'EMG', make: function (r, sh) { return vertPart(sh.P, 'undefined slope, through ' + t(ptT(sh.P[0], sh.P[1]))); } },
          { id: 'e4c', level: 'BEG', make: function (r, sh) { return horizPart(sh.Q, 'slope ' + t(0) + ', through ' + t(ptT(sh.Q[0], sh.Q[1]))); } },
          { id: 'e4d', level: 'EMG', make: function (r, sh) { return vertPart(sh.D, 'undefined slope, through ' + t(ptT(sh.D[0], sh.D[1]))); } },
          { id: 'e4e', sub: 'd (why)', level: 'EMG', make: function (r, sh) {
            return mc(r, 'Why does the line in (d) — undefined slope, through ' + t(ptT(sh.D[0], sh.D[1])) + ' — have no ' + t('y=mx+b') + ' form?', [
              { html: 'Its slope is undefined, so there is no number to put in for ' + t('m') + ' — every point shares one ' + t('x') + '-value, not one ' + t('y') + '-value.', right: true },
              { html: 'Its slope is ' + t(0) + ', so the ' + t('x') + '-term disappears.', why: 'A slope of ' + t(0) + ' is a horizontal line, which <i>does</i> fit ' + t('y=0x+b') + '. This line is vertical.' },
              { html: 'The point ' + t(ptT(sh.D[0], sh.D[1])) + ' has negative coordinates.', why: 'Negative coordinates are no problem — most lines through such points have a ' + t('y=mx+b') + ' form.' },
              { html: 'It has no ' + t('x') + '-intercept.', why: 'A vertical line does cross the ' + t('x') + '-axis (at ' + t(ptT(sh.D[0], 0)) + '). What it lacks is a slope.' }],
              'A vertical line has an undefined slope (the run is ' + t(0) + '), so there is no value of ' + t('m') + '. Every point has ' + t('x=' + sh.D[0]) + ', so its equation is ' + t('x=' + sh.D[0]) + ' — it can’t be solved for ' + t('y') + '.', ['What would you put in for ' + t('m') + '?'], 'why no y=mx+b');
          } }] },
      { num: '5', stem: '<b>Parallel lines.</b> Parallel lines have equal slopes. Read the slope off the given line, then use the given point to find ' + t('b') + '.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) { var g = r.int(2, 6) * pm(r), c = nz(r, -9, 9), P = [nz(r, -5, 5), nz(r, -9, 9)]; return parPart([g, 1], c, P); } },
        { id: 'e5b', level: 'PRG', make: function (r) { var g = r.pick([[-3, 4], [-1, 4], [-2, 3], [3, 4]]), c = nz(r, -9, 9), P = [g[1] * r.pick([1, 2, -1]), nz(r, -9, 9)]; return parPart(g, c, P); } },
        { id: 'e5c', level: 'PRG', make: function (r) { var g = r.pick([[-5, 2], [-3, 2], [5, 2], [-7, 2]]), P = [2 * r.pick([-3, -2, -1, 1, 2]), nz(r, -9, 9)]; return parPart(g, 0, P); } },
        { id: 'e5d', level: 'EMG', make: function (r) {
          var k = nz(r, -9, 9), P = [nz(r, -6, 6), [2 * r.int(1, 6) + 1, 2]];
          return horizPart(P, 'parallel to ' + t('y=' + k) + ', through ' + t(ptT(P[0], P[1])), [{ is: { y: k }, code: 'u72-given-line', hint: 'That’s the given line itself. Your line is parallel to it (also horizontal) but passes through ' + t(ptT(P[0], P[1])) + '.' }]);
        } }] },
      { num: '6', stem: '<b>Perpendicular lines.</b> Perpendicular lines have slopes that are negative reciprocals. Find the new slope first, then use the given point to find ' + t('b') + '.', parts: [
        { id: 'e6a', level: 'PRG', make: function (r) { var g = [r.int(2, 4), 1], c = nz(r, -9, 9), P = [g[0] * r.pick([1, 2, -1]), nz(r, -6, 6)]; return perpPart(g, c, P); } },
        { id: 'e6b', level: 'PRG', make: function (r) { var g = r.pick([[-3, 5], [-2, 3], [-3, 4], [-1, 2]]), c = nz(r, -9, 9), P = [g[0] * r.pick([1, 2]), nz(r, -6, 6)]; return perpPart(g, c, P); } },
        { id: 'e6c', level: 'PRG', make: function (r) { var g = [-r.int(2, 5), 1], c = nz(r, -9, 9), P = [g[0] * r.pick([1, 2, -1]), nz(r, -6, 6)]; return perpPart(g, c, P); } },
        { id: 'e6d', level: 'PRG', make: function (r) { var g = r.pick([[7, 2], [5, 2], [5, 3], [3, 2]]), P = [g[0] * r.pick([1, 2]), nz(r, -6, 6)]; return perpPart(g, 0, P); } }] },
      { num: '7', stem: 'A horizontal and a vertical line are perpendicular to each other, but the negative-reciprocal rule cannot be used on them. Write the equation of each line described below.',
        shared: function (r) { var P = until(function () { return [nz(r, -9, 9), nz(r, -9, 9)]; }, function (p) { return Math.abs(p[0]) !== Math.abs(p[1]); }); return { P: P, k: until(function () { return nz(r, -9, 9); }, function (k) { return k !== P[1] && k !== P[0]; }), h: until(function () { return nz(r, -9, 9); }, function (k) { return k !== P[0] && k !== P[1]; }) }; },
        parts: [
          { id: 'e7a', level: 'EMG', make: function (r, sh) { return vertPart(sh.P, 'perpendicular to ' + t('y=' + sh.k) + ', through ' + t(ptT(sh.P[0], sh.P[1])), [{ is: { y: sh.k }, code: 'u72-given-line', hint: 'That’s the given line itself.' }]); } },
          { id: 'e7b', level: 'EMG', make: function (r, sh) { return horizPart(sh.P, 'perpendicular to ' + t('x=' + sh.h) + ', through ' + t(ptT(sh.P[0], sh.P[1])), [{ is: { x: sh.h }, code: 'u72-given-line', hint: 'That’s the given line itself.' }]); } }] },

      { num: '8', section: 'Extra practice C — Applications', stem: function (sh) { return 'A tank is draining at a constant rate of ' + t(sh.k) + ' L per minute. After ' + t(sh.t1) + ' minutes of draining it holds ' + t(sh.v1) + ' L. Let ' + t('V') + ' be the volume in litres after ' + t('t') + ' minutes.'; },
        shared: function (r) { return until(function () { var k = r.int(3, 8), T = r.int(8, 20), t1 = r.int(2, 5); return { k: k, T: T, t1: t1, v1: k * (T - t1) }; }, function (o) { return o.t1 < o.T - 2; }); },
        parts: [
          { id: 'e8a', level: 'PRG', make: function (r, sh) { return storyEq('Write an equation for ' + t('V') + ' in terms of ' + t('t') + '.', [-sh.k, 1], sh.t1, sh.v1, ['t', 'V'], 'tank equation'); } },
          { id: 'e8b', level: 'EMG', make: function (r, sh) { return storyStart('How much water was in the tank when draining began?', [-sh.k, 1], sh.t1, sh.v1, { after: 'L' }, 'tank start'); } },
          { id: 'e8c', level: 'PRG', make: function (r, sh) { var V0 = sh.k * sh.T; return numPart('Determine when the tank is empty.', sh.T, [[sh.T - sh.t1, 'u7l5-solve', 'Use the starting volume ' + t(V0) + ' L: solve ' + t('0=-' + sh.k + 't+' + V0) + '.'], [sh.v1 / sh.k, 'u7l5-start', 'That’s how long the ' + t(sh.v1) + ' L left at ' + t('t=' + sh.t1) + ' takes. Empty means ' + t('V=0') + ' in your equation.']],
            'Empty: ' + t('V=0') + '. ' + t('0=-' + sh.k + 't+' + V0 + '\\ \\Rightarrow\\ ' + sh.k + 't=' + V0 + '\\ \\Rightarrow\\ t=' + sh.T) + ' minutes.', ['Set ' + t('V=0') + ' in your equation and solve for ' + t('t') + '.'], 'tank empty', { after: 'minutes' }); } }] },
      { num: '9', stem: function (sh) { return 'A hot tub cools at a constant rate of ' + t(sh.k + '^{\\circ}\\text{F}') + ' per hour once the heater is shut off. After ' + t(sh.t1) + ' hours the water reads ' + t(sh.v1 + '^{\\circ}\\text{F}') + '. Let ' + t('T') + ' be the temperature after ' + t('h') + ' hours.'; },
        shared: function (r) { return until(function () { var k = r.int(2, 5), t1 = r.int(2, 6), T0 = r.int(96, 106), tt = r.int(t1 + 1, t1 + 5); return { k: k, t1: t1, T0: T0, v1: T0 - k * t1, tt: tt, vt: T0 - k * tt }; }, function (o) { return o.vt >= 60; }); },
        parts: [
          { id: 'e9a', level: 'PRG', make: function (r, sh) { return storyEq('Write an equation for ' + t('T') + ' in terms of ' + t('h') + '.', [-sh.k, 1], sh.t1, sh.v1, ['h', 'T'], 'hot tub equation'); } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) { return storyStart('What was the temperature when the heater was shut off?', [-sh.k, 1], sh.t1, sh.v1, { after: '°F' }, 'hot tub start'); } },
          { id: 'e9c', level: 'PRG', make: function (r, sh) { return numPart('Determine when the water reaches ' + t(sh.vt + '^{\\circ}\\text{F}') + '.', sh.tt, [[(sh.T0 - sh.vt) * sh.k, 'u7l5-solve', 'Divide the drop by the rate: ' + t('(' + sh.T0 + '-' + sh.vt + ')\\div ' + sh.k) + '.'], [(sh.v1 - sh.vt) / sh.k, 'u7l5-start', 'That’s the time <b>after</b> the ' + t(sh.t1) + '-hour reading. Use your equation: ' + t('h') + ' counts from when the heater was shut off.']],
            t(sh.vt + '=-' + sh.k + 'h+' + sh.T0 + '\\ \\Rightarrow\\ ' + sh.k + 'h=' + (sh.T0 - sh.vt) + '\\ \\Rightarrow\\ h=' + sh.tt) + ' hours after the heater was shut off.', ['Set ' + t('T=' + sh.vt) + ' and solve for ' + t('h') + '.'], 'hot tub when', { after: 'hours' }); } }] },
      { num: '10', stem: function (sh) { return 'A candle burns down at a constant rate of ' + t(nT(sh.m)) + ' cm per hour. After ' + t(sh.t1) + ' hours it is ' + t(sh.v1) + ' cm tall. Let ' + t('h') + ' be the height in centimetres after ' + t('t') + ' hours.'; },
        shared: function (r) { return until(function () { var m = r.pick([[5, 2], [3, 2], [7, 2], [4, 3], [5, 3]]), t1 = m[1] * r.int(1, 4), v1 = r.int(4, 15); var H = v1 + m[0] * t1 / m[1]; return { m: m, t1: t1, v1: v1, H: H, T: fr(H * m[1], m[0]) }; }, function (o) { return o.T[1] > 1 && o.H <= 40; }); },
        parts: [
          { id: 'e10a', level: 'PRG', make: function (r, sh) { return storyEq('Write an equation for ' + t('h') + ' in terms of ' + t('t') + '.', fNeg(sh.m), sh.t1, sh.v1, ['t', 'h'], 'candle equation'); } },
          { id: 'e10b', level: 'EMG', make: function (r, sh) { return storyStart('Determine the original height of the candle.', fNeg(sh.m), sh.t1, sh.v1, { after: 'cm' }, 'candle start'); } },
          { id: 'e10c', level: 'ADV', make: function (r, sh) {
            var T = sh.T, dec = fv(T), term = String(Math.round(dec * 1e6) / 1e6).length < 8;
            var p = valPart('Determine when the candle burns out. Give an exact answer.', T, [[sh.H * fv(sh.m), 'u7l5-solve', 'To undo “times ' + t(nT(sh.m)) + '”, multiply by its reciprocal ' + t(nT(fInv(sh.m))) + ' (or divide by ' + t(nT(sh.m)) + ').'], [sh.H, 'u7l5-start', 'That’s the original height. Burns out means ' + t('h=0') + ': solve for ' + t('t') + '.']],
              'Burns out: ' + t('h=0') + '. ' + t('0=-' + nT(sh.m) + 't+' + sh.H + '\\ \\Rightarrow\\ ' + nT(sh.m) + 't=' + sh.H + '\\ \\Rightarrow\\ t=' + sh.H + '\\times ' + nT(fInv(sh.m)) + '=' + nT(T)) + (term ? ' ' + t('=' + dec) : '') + ' hours.', ['Set ' + t('h=0') + ' and solve for ' + t('t') + '.', 'Dividing by ' + t(nT(sh.m)) + ' is the same as multiplying by ' + t(nT(fInv(sh.m))) + '.'], 'candle burns out', { after: 'hours' });
            var c = p.check; p.check = function (resp) { var v = readVal(resp); if (v != null && near(v, dec) && /\./.test(String(resp))) return ok(); return c(resp); };
            if (term) p.good = [String(dec)];
            return p;
          } }] },
      { num: '11', stem: function (sh) { return 'A gym charges a one-time joining fee plus a fixed monthly rate of ' + t('\\$' + sh.k) + '. A member who has belonged for ' + t(sh.t1) + ' months has paid ' + t('\\$' + sh.v1) + ' in total. Let ' + t('C') + ' be the total paid after ' + t('m') + ' months.'; },
        shared: function (r) { var k = r.pick([25, 30, 35, 40, 45, 50]), t1 = r.int(3, 9), F = r.pick([45, 50, 55, 60, 65, 75, 80]); return { k: k, t1: t1, F: F, v1: k * t1 + F, Y: r.pick([1, 2, 2, 3]) }; },
        parts: [
          { id: 'e11a', level: 'PRG', make: function (r, sh) { return storyEq('Write an equation for ' + t('C') + ' in terms of ' + t('m') + '.', [sh.k, 1], sh.t1, sh.v1, ['m', 'C'], 'gym fee equation'); } },
          { id: 'e11b', level: 'EMG', make: function (r, sh) { return storyStart('Determine the joining fee.', [sh.k, 1], sh.t1, sh.v1, { before: '\\$' }, 'joining fee'); } },
          { id: 'e11c', level: 'PRG', make: function (r, sh) {
            var n = 12 * sh.Y, v = sh.k * n + sh.F;
            return numPart('Determine the total paid after ' + t(sh.Y) + ' year' + (sh.Y > 1 ? 's' : '') + '.', v, [[sh.k * sh.Y + sh.F, 'u7l5-years', t('m') + ' counts <b>months</b>: ' + t(sh.Y) + ' year' + (sh.Y > 1 ? 's' : '') + ' is ' + t(n) + ' months.'], [sh.k * n, 'u72-fee', 'Add the joining fee ' + t('\\$' + sh.F) + ' too.'], [sh.k * n + sh.v1, 'u7l5-pred-b', 'Use the joining fee ' + t('\\$' + sh.F) + ' as ' + t('b') + ', not the total paid after ' + t(sh.t1) + ' months.']],
              t(sh.Y) + ' year' + (sh.Y > 1 ? 's' : '') + ' = ' + t(n) + ' months: ' + t('C=' + sh.k + '(' + n + ')+' + sh.F + '=' + (sh.k * n) + '+' + sh.F + '=' + v) + ', so ' + t('\\$' + v) + '.', ['Change years to months first.', 'Then substitute into your equation.'], 'gym after years', { before: '\\$' });
          } }] },

      { num: '12', section: 'Extra practice D — Error analysis, working backwards and stretch', stem: '<b>Error analysis.</b>', shared: function (r) {
          var d = until(function () { var m = -r.int(2, 5), x0 = r.int(3, 7), y0 = r.int(1, 6); return { m: m, x0: x0, y0: y0 }; }, function (o) { return o.x0 !== o.y0 && (o.x0 - o.m * o.y0) !== (o.y0 - o.m * o.x0); });
          var n = until(function () { var q = r.pick([2, 3]), x0 = r.int(3, 9), y0 = r.int(1, 8); return { m: [1, q], x0: x0, y0: y0 }; }, function (o) { return o.x0 % o.m[1] !== 0; });
          return { d: d, n: n };
        },
        parts: [
          { id: 'e12a', sub: 'a(i)', level: 'EMG', make: function (r, sh) {
            var d = sh.d, wb = d.x0 - d.m * d.y0;
            return mc(r, 'Devon was asked for the line with slope ' + t(d.m) + ' through ' + t(ptT(d.x0, d.y0)) + '. He wrote ' + t(d.x0 + '=' + d.m + '(' + d.y0 + ')+b') + ', found ' + t('b=' + wb) + ', and answered ' + t(SI(d.m, wb)) + '. What is his error?', [
              { html: 'He substituted the coordinates backwards: the ' + t('x') + '-coordinate ' + t(d.x0) + ' went in for ' + t('y') + ' and the ' + t('y') + '-coordinate ' + t(d.y0) + ' went in for ' + t('x') + '.', right: true },
              { html: 'He made a sign slip when solving for ' + t('b') + '.', why: 'His arithmetic is fine: ' + t(d.x0 + '=' + (d.m * d.y0) + '+b') + ' does give ' + t('b=' + wb) + '. Look at where he put the coordinates.' },
              { html: 'He used the wrong slope.', why: 'He used ' + t(d.m) + ', the given slope. The problem is where the point’s coordinates went.' },
              { html: 'He should have used the point as the ' + t('y') + '-intercept.', why: t(ptT(d.x0, d.y0)) + ' is not on the ' + t('y') + '-axis, so it is not the ' + t('y') + '-intercept.' }],
              'In ' + t(ptT(d.x0, d.y0)) + ' the first number is ' + t('x') + ' and the second is ' + t('y') + '. Devon put ' + t(d.x0) + ' in place of ' + t('y') + ' and ' + t(d.y0) + ' in place of ' + t('x') + '. Correctly: ' + t(d.y0 + '=' + d.m + '(' + d.x0 + ')+b') + '.', ['Compare ' + t(d.x0 + '=' + d.m + '(' + d.y0 + ')+b') + ' with ' + t('y=mx+b') + ': which number replaced ' + t('x') + '?'], 'Devon error');
          } },
          { id: 'e12b', sub: 'a(ii)', level: 'EMG', make: function (r, sh) {
            var d = sh.d, wb = d.x0 - d.m * d.y0, his = d.m * d.x0 + wb;
            return numPart('Show that Devon’s equation ' + t(SI(d.m, wb)) + ' fails the check at ' + t(ptT(d.x0, d.y0)) + ': substitute ' + t('x=' + d.x0) + '. What ' + t('y') + '-value does it give?', his, [[d.y0, 'u7l5-his', 'Substitute ' + t('x=' + d.x0) + ' into <b>Devon’s</b> equation, ' + t(SI(d.m, wb)) + ' — it won’t give ' + t(d.y0) + '.'], [d.m * d.y0 + wb, 'u7l5-his', 'Substitute the <b>' + t('x') + '</b>-coordinate, ' + t(d.x0) + '.']],
              t('y=' + d.m + '(' + d.x0 + ')+' + pT(wb) + '=' + (d.m * d.x0) + (wb < 0 ? '' : '+') + wb + '=' + his) + ', not ' + t(d.y0) + ', so his line misses the point ✗.', ['Substitute ' + t('x=' + d.x0) + ' into his equation.'], 'Devon check', { before: 'y=' });
          } },
          { id: 'e12c', sub: 'a(iii)', level: 'EMG', make: function (r, sh) { var d = sh.d; return spPart([d.m, 1], d.x0, d.y0, { prompt: 'Give the correct equation for Devon’s line (slope ' + t(d.m) + ' through ' + t(ptT(d.x0, d.y0)) + ').' }); } },
          { id: 'e12d', sub: 'b(i)', level: 'EMG', make: function (r, sh) {
            var n = sh.n;
            return mc(r, 'Nina was asked for the line with slope ' + t(nT(n.m)) + ' through ' + t(ptT(n.x0, n.y0)) + '. She used the point’s ' + t('y') + '-coordinate as ' + t('b') + ' and wrote ' + t(SI(n.m, n.y0)) + '. Why is the ' + t('y') + '-coordinate of a point not automatically ' + t('b') + '?', [
              { html: t('b') + ' is the ' + t('y') + '-value only where ' + t('x=0') + '. The point ' + t(ptT(n.x0, n.y0)) + ' is not on the ' + t('y') + '-axis, so ' + t(n.y0) + ' is not ' + t('b') + '.', right: true },
              { html: t('b') + ' is always the ' + t('x') + '-coordinate of the point.', why: 'Neither coordinate is ' + t('b') + ' unless the point is on the ' + t('y') + '-axis. Substitute and solve.' },
              { html: 'The ' + t('y') + '-coordinate is the slope, not ' + t('b') + '.', why: 'The slope is given: ' + t(nT(n.m)) + '. A point’s coordinates are not slopes.' },
              { html: 'She was right — the ' + t('y') + '-coordinate of any point is ' + t('b') + '.', why: 'Check: ' + t(SI(n.m, n.y0)) + ' at ' + t('x=' + n.x0) + ' gives ' + t(nT(fAdd(fMul(n.m, n.x0), [n.y0, 1]))) + ', not ' + t(n.y0) + '.' }],
              t('b') + ' is the ' + t('y') + '-value at ' + t('x=0') + ' (where the line meets the ' + t('y') + '-axis). ' + t(ptT(n.x0, n.y0)) + ' has ' + t('x=' + n.x0) + ', so its ' + t('y') + '-value is not ' + t('b') + '.', ['Where on the line is the ' + t('y') + '-value equal to ' + t('b') + '?'], 'Nina error');
          } },
          { id: 'e12e', sub: 'b(ii)', level: 'PRG', make: function (r, sh) { var n = sh.n; return spPart(n.m, n.x0, n.y0, { exact: true, prompt: 'Give the correct equation for Nina’s line (slope ' + t(nT(n.m)) + ' through ' + t(ptT(n.x0, n.y0)) + ').' }); } }] },
      { num: '13', stem: '<b>Work backwards.</b> For each line, write the equation first, then determine where the line crosses <i>both</i> axes. Give exact values.', parts: [
        { id: 'e13a', level: 'ADV', make: function (r) { var m = r.pick([[-3, 4], [-2, 3], [-3, 5], [-4, 3]]), P = until(function () { return [m[1] * r.pick([1, 2, -1]), nz(r, -6, 6)]; }, function (p) { var b = fv(bOf(m, p[0], p[1])); return b !== 0 && Math.abs(b * m[1]) % Math.abs(m[0]) !== 0; }); return intPart(m, P[0], P[1]); } },
        { id: 'e13b', level: 'ADV', make: function (r) { var m = [r.int(2, 6), 1], P = until(function () { return [-r.int(1, 5), nz(r, -12, 12)]; }, function (p) { var b = p[1] - m[0] * p[0]; return b !== 0 && b % m[0] !== 0; }); return intPart(m, P[0], P[1]); } }] },
      { num: '14', stem: '<b>Work backwards.</b> Each line is described by an unknown. Set up an equation and solve for it.', parts: [
        { id: 'e14a', level: 'ADV', make: function (r) {
          var o = until(function () { var m = r.int(2, 5) * pm(r), x0 = r.int(2, 4) * pm(r), b = nz(r, -12, 12); return { m: m, x0: x0, b: b, y0: m * x0 + b }; }, function (o) { return o.y0 !== 0 && o.y0 !== o.b && Math.abs(o.y0) <= 15; });
          return valPart('A line passes through ' + t(ptT(o.x0, o.y0)) + ' and has ' + t('y') + '-intercept ' + t(o.b) + '. Determine its slope ' + t('m') + '.', [o.m, 1], [[-o.m, 'sign', 'Check the signs as you solve: ' + t(o.y0 + '=' + o.x0 + 'm' + (o.b < 0 ? '' : '+') + o.b) + '.'], [(o.y0 + o.b) / o.x0, 'u7l5-solve', 'Move ' + t(o.b) + ' to the other side by doing the <b>opposite</b>: ' + (o.b < 0 ? 'add ' + t(-o.b) : 'subtract ' + t(o.b)) + '.'], [o.y0 / o.x0, 'u72-fee', 'Don’t forget the ' + t('y') + '-intercept: ' + t(o.y0 + '=m(' + o.x0 + ')' + (o.b < 0 ? '' : '+') + o.b) + '.'], [o.x0 / (o.y0 - o.b), 'flip', 'Slope is rise over run: from ' + t(ptT(0, o.b)) + ' to ' + t(ptT(o.x0, o.y0)) + ', ' + t('\\frac{' + (o.y0 - o.b) + '}{' + o.x0 + '}') + '.']],
            'Substitute the point and ' + t('b=' + o.b) + ' into ' + t('y=mx+b') + ': ' + t(o.y0 + '=m(' + o.x0 + ')' + (o.b < 0 ? '' : '+') + o.b + '\\ \\Rightarrow\\ ' + (o.y0 - o.b) + '=' + o.x0 + 'm\\ \\Rightarrow\\ m=' + o.m) + '.<br>(Or: the line goes through ' + t(ptT(0, o.b)) + ' and ' + t(ptT(o.x0, o.y0)) + ', so ' + t('m=\\frac{' + o.y0 + '-' + pT(o.b) + '}{' + o.x0 + '-0}=' + o.m) + '.)',
            ['This time ' + t('b') + ' is known and ' + t('m') + ' is the unknown: substitute the point and ' + t('b') + ', then solve for ' + t('m') + '.', 'Or use the two points ' + t(ptT(0, o.b)) + ' and ' + t(ptT(o.x0, o.y0)) + ' in the slope formula.'], 'find m', { keys: 'fraction', before: t('m=') });
        } },
        { id: 'e14b', level: 'ADV', make: function (r) {
          var o = until(function () { var m = r.pick([[-2, 3], [-3, 4], [2, 3], [-1, 2], [3, 2]]), a = m[1] * r.int(1, 4) * pm(r), b = r.int(2, 12); return { m: m, a: a, b: b, y: fv(fAdd(fMul(m, a), [b, 1])) }; }, function (o) { return o.y !== 0 && o.y !== o.b; });
          var mT = nT(o.m);
          return valPart('The line ' + t(SI(o.m, o.b)) + ' passes through the point ' + t('(a,\\ ' + o.y + ')') + '. Determine the value of ' + t('a') + '.', [o.a, 1], [[-o.a, 'sign', 'Check the signs as you solve.'], [fv(fMul([o.y - o.b, 1], o.m)), 'u7l5-solve', 'To undo “times ' + t(mT) + '”, multiply by the reciprocal ' + t(nT(fInv(o.m))) + ' (or divide by ' + t(mT) + ').'], [fv(fDiv([o.y + o.b, 1], o.m)), 'u7l5-solve', 'Undo the ' + t('+' + o.b) + ' first by <b>subtracting</b> ' + t(o.b) + ' from both sides.'], [fv(fAdd(fMul(o.m, o.y), [o.b, 1])), 'u7l5-swap-xy', 'In ' + t('(a,\\ ' + o.y + ')') + ', ' + t(o.y) + ' is the <b>' + t('y') + '</b>-value: set ' + t('y=' + o.y) + ' and solve for ' + t('x=a') + '.']],
            t(o.y + '=' + mT + 'a+' + o.b + '\\ \\Rightarrow\\ ' + (o.y - o.b) + '=' + mT + 'a\\ \\Rightarrow\\ a=' + (o.y - o.b) + '\\times ' + nT(fInv(o.m)) + '=' + o.a) + '.', ['Substitute ' + t('y=' + o.y) + ' and ' + t('x=a') + ', then undo the operations: first the ' + t('+' + o.b) + ', then the multiplication.'], 'find a', { keys: 'fraction', before: t('a=') });
        } }] },
      { num: '15', stem: function (sh) { return '<b>Stretch.</b> A line has slope ' + t(nT(sh.m)) + ' and passes through ' + t(ptT(sh.P[0], sh.P[1])) + '.'; },
        shared: function (r) { var m = r.pick([[-2, 5], [-2, 3], [-3, 4], [2, 5], [3, 4]]); return until(function () { return { m: m, P: [m[1] * r.pick([1, 2]), nz(r, -6, 6)], Q: [m[1] * r.pick([-1, -2]), r.int(1, 9)] }; }, function (o) { return fv(bOf(o.m, o.P[0], o.P[1])) !== fv(bOf(o.m, o.Q[0], o.Q[1])); }); },
        parts: [
          { id: 'e15a', level: 'PRG', make: function (r, sh) { return spPart(sh.m, sh.P[0], sh.P[1], { prompt: 'Write its equation.' }); } },
          { id: 'e15b', level: 'PRG', make: function (r, sh) { return spPart(sh.m, sh.Q[0], sh.Q[1], { prompt: 'Write the equation of the line parallel to it through ' + t(ptT(sh.Q[0], sh.Q[1])) + '.', pre: 'Parallel: the same slope, ' + t('m=' + nT(sh.m)) + '.<br>', wrong: [{ is: L(sh.m, bOf(sh.m, sh.P[0], sh.P[1])), code: 'u72-given-line', hint: 'That’s the line from (a). A parallel line has the same slope but goes through ' + t(ptT(sh.Q[0], sh.Q[1])) + '.' }, { is: L(nrec(sh.m), bOf(nrec(sh.m), sh.Q[0], sh.Q[1])), code: 'u72-par-perp', hint: 'That’s the negative reciprocal — the slope of a perpendicular line. Parallel lines have <b>equal</b> slopes.' }] }); } },
          { id: 'e15c', level: 'ADV', make: function (r, sh) { var g = sh.m, m = nrec(g); return spPart(m, sh.P[0], sh.P[1], { prompt: 'Write the equation of the line perpendicular to it through ' + t(ptT(sh.P[0], sh.P[1])) + '.', pre: 'Perpendicular: the negative reciprocal of ' + t(nT(g)) + ' is ' + t('m=' + nT(m)) + '.<br>', wrong: perpW(g, sh.P), hints: [H_PERP, H_PT[0]] }); } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e16', level: 'EMG', make: function (r) {
          var o = until(function () { var m = -r.int(2, 6), x0 = -r.int(1, 4), y0 = r.int(1, 12); return { m: m, x0: x0, y0: y0, b: y0 - m * x0 }; }, function (o) { return o.b !== 0 && o.y0 + o.m * o.x0 !== o.b && o.b !== -(o.y0 + o.m * o.x0); });
          var slip = o.y0 + o.m * o.x0;
          return mc(r, 'Which is the equation of the line with slope ' + t(o.m) + ' through ' + t(ptT(o.x0, o.y0)) + '?', uniqOpts([
            { html: t(SI(o.m, o.b)), right: true },
            { html: t(SI(o.m, slip)), why: 'Check how you solved for ' + t('b') + ': ' + t(o.m + '(' + o.x0 + ')=' + (o.m * o.x0)) + ', and you must <b>subtract</b> it.' },
            { html: t(SI(o.m, -o.b)), why: 'Check the sign of ' + t('b') + '.' },
            { html: t(SI(-o.m, o.b)), why: 'The slope is ' + t(o.m) + ', negative.' }]),
            subSol([o.m, 1], o.x0, o.y0) + ', so ' + t(SI(o.m, o.b)) + '.', [H_PT[0], H_NEG], 'MC negatives');
        } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e17', level: 'ADV', make: function (r) {
          var o = until(function () { var g = r.pick([[-5, 2], [-3, 2], [-5, 3], [-4, 3], [5, 2], [3, 2]]), m = nrec(g), x0 = m[1] * r.int(1, 3), y0 = nz(r, -9, 9); return { g: g, m: m, x0: x0, y0: y0, b: fv(bOf(m, x0, y0)), c: nz(r, -5, 5) }; }, function (o) { return o.b !== 0 && Math.abs(o.b) < 100; });
          var gb = fv(bOf(o.g, o.x0, o.y0)), sb = fv(bOf(fNeg(o.g), o.x0, o.y0)), fb = fv(bOf(fInv(o.g), o.x0, o.y0));
          return nrPart('A line perpendicular to ' + t(SI(o.g, o.c)) + ' passes through ' + t(ptT(o.x0, o.y0)) + '. Written in the form ' + t('y=mx+b') + ', the value of ' + t('b') + ' is ________.', o.b,
            [[gb, 'u72-perp-same', 'That uses the given slope — a parallel line. Use the negative reciprocal.'], [fb, 'u72-perp-nosign', 'You flipped the slope but kept its sign.'], [sb, 'u72-perp-noflip', 'You changed the sign but didn’t flip the slope.'], [o.y0, 'u72-b-y0', t(o.y0) + ' is the point’s ' + t('y') + '-coordinate.']].filter(function (d) { return isFinite(d[0]) && Math.abs(d[0] * 100 - Math.round(d[0] * 100)) < 1e-9; }),
            'The given slope is ' + t(nT(o.g)) + ', so the perpendicular slope is ' + t('m=' + nT(o.m)) + '.<br>' + subSol(o.m, o.x0, o.y0) + '.', [H_PERP, H_PT[0]], 'NR perpendicular b');
        } }] },

      /* ---------------- added: Mastery challenge ---------------- */
      { num: '18', section: 'Mastery challenge', stem: function (sh) { return 'Line ' + t('p') + ' has slope ' + t(nT(sh.g)) + ' and passes through ' + t(ptT(sh.P[0], sh.P[1])) + '. Line ' + t('q') + ' is perpendicular to line ' + t('p') + ' and passes through the same point.'; },
        shared: function (r) { return until(function () { var g = r.pick([[2, 3], [3, 2], [-2, 3], [-3, 4], [4, 3], [-1, 2], [1, 3]]), m = nrec(g), x0 = m[1] * r.int(1, 3) * pm(r), y0 = nz(r, -6, 6), b = bOf(m, x0, y0); return { g: g, m: m, P: [x0, y0], b: b, xi: fDiv(fNeg(b), m) }; }, function (o) { return fv(o.b) !== 0 && !isInt(o.xi) && Math.abs(fv(o.b)) <= 20; }); },
        parts: [
          { id: 'e18', level: 'MAS', make: function (r, sh) {
            var m = sh.m, b = sh.b, xi = sh.xi, P = sh.P;
            var fields = [fld('equation of ' + t('q'), { wide: true, placeholder: 'y = …' }), fld(t('q') + ' crosses the ' + t('x') + '-axis at ' + t('x='), { keys: 'eq' })];
            var xiChk = function (resp) {
              var s = String(resp == null ? '' : resp).trim(), pt = readPt(s), v = pt ? (near(pt[1], 0) ? pt[0] : null) : readVal(s);
              if (!s) return form('empty', 'Fill in the ' + t('x') + '-intercept.');
              if (pt && !near(pt[1], 0)) return wrong('u72-int-off', 'A point on the ' + t('x') + '-axis has ' + t('y=0') + '.');
              if (v == null) return form('u72-int-unreadable', 'Give the ' + t('x') + '-value as a number or fraction.');
              if (near(v, fv(xi))) return /\d\.\d/.test(s) && Math.abs(fv(xi) * 1e6 - Math.round(fv(xi) * 1e6)) > 1e-6 ? form('u72-decimal', 'Give the exact value as a fraction.') : ok();
              if (near(v, fv(b))) return wrong('u72-int-swap', 'That’s where ' + t('q') + ' crosses the <b>' + t('y') + '</b>-axis. For the ' + t('x') + '-axis, set ' + t('y=0') + '.');
              if (near(v, -fv(xi))) return wrong('u7l5-xint', 'Check the sign: from ' + t('0=' + nT(m) + 'x' + (fv(b) < 0 ? '' : '+') + nT(b)) + ', move ' + t(nT(b)) + ' across first.');
              if (near(v, fv(fMul(fNeg(b), m)))) return wrong('u7l5-xint', 'To undo “times ' + t(nT(m)) + '”, <b>divide</b> by it (multiply by ' + t(nT(fInv(m))) + ').');
              return wrong('u7l5-xint', null);
            };
            var p = B.fields('Determine the equation of line ' + t('q') + ', then where line ' + t('q') + ' crosses the ' + t('x') + '-axis.', fields,
              [K.line(L(m, b), { form: 'slope-intercept', point: P, wrong: perpW(sh.g, P) }), xiChk], [SI(m, b), nT(xi)], t(SI(m, b)) + '; ' + t('x') + '-intercept ' + t(nT(xi)) + ' (the point ' + t(ptT(xi, 0)) + ')',
              'Line ' + t('q') + ' is perpendicular to slope ' + t(nT(sh.g)) + ', so its slope is the negative reciprocal, ' + t('m=' + nT(m)) + '.<br>' + subSol(m, P[0], P[1]) + '<br>' + t(SI(m, b)) + '.<br>' +
              'On the ' + t('x') + '-axis ' + t('y=0') + ': ' + t('0=' + nT(m) + 'x' + (fv(b) < 0 ? '' : '+') + nT(b) + '\\ \\Rightarrow\\ ' + nT(m) + 'x=' + nT(fNeg(b)) + '\\ \\Rightarrow\\ x=' + nT(fNeg(b)) + '\\times ' + nT(fInv(m)) + '=' + nT(xi)) + '. Line ' + t('q') + ' crosses the ' + t('x') + '-axis at ' + t(ptT(xi, 0)) + '.',
              ['Three steps: the perpendicular slope, then ' + t('b') + ' from the point, then set ' + t('y=0') + ' to find the ' + t('x') + '-intercept.', 'To undo “times ' + t(nT(m)) + '”, multiply by its reciprocal.'], 'perp then x-intercept');
            p.bad = [[SI(sh.g, bOf(sh.g, P[0], P[1])), nT(fDiv(fNeg(bOf(sh.g, P[0], P[1])), sh.g))], [SI(m, b), nT(b)], [SI(m, b), nT(fNeg(xi))]];
            p.good = [[SI(m, b), ptK(xi, 0)]];
            return p;
          } }] }
    ]
  });

  /* ---------------- makers used above (function declarations are hoisted) ---------------- */
  function perpW(g, P) {
    var out = [{ is: L(g, bOf(g, P[0], P[1])), code: 'u72-perp-same', hint: 'That line has the given slope, so it is <b>parallel</b>. A perpendicular line needs the <b>negative reciprocal</b>: flip the slope and change its sign.' }];
    if (!fEq(fInv(g), g)) out.push({ is: L(fInv(g), bOf(fInv(g), P[0], P[1])), code: 'u72-perp-nosign', hint: 'You flipped the slope but kept its sign. One perpendicular slope is positive and the other negative.' });
    out.push({ is: L(fNeg(g), bOf(fNeg(g), P[0], P[1])), code: 'u72-perp-noflip', hint: 'You changed the sign but didn’t flip the slope: the negative <b>reciprocal</b> of ' + t(nT(g)) + ' is ' + t(nT(nrec(g))) + '.' });
    return out;
  }
  function givenT(g, c) { return SI(g, c); }
  function parPart(g, c, P) {
    return spPart(g, P[0], P[1], { prompt: 'parallel to ' + t(givenT(g, c)) + ', through ' + t(ptT(P[0], P[1])), pre: 'Parallel: the same slope as ' + t(givenT(g, c)) + ', so ' + t('m=' + nT(g)) + '.<br>', exact: !isInt(g),
      wrong: [{ is: L(g, c), code: 'u72-given-line', hint: 'That’s the given line itself. Keep its slope, but find ' + t('b') + ' from ' + t(ptT(P[0], P[1])) + '.' }, { is: L(nrec(g), bOf(nrec(g), P[0], P[1])), code: 'u72-par-perp', hint: 'That’s the negative reciprocal — the slope of a perpendicular line. Parallel lines have <b>equal</b> slopes.' }], hints: [H_PAR, H_PT[0]] });
  }
  function perpPart(g, c, P) {
    var m = nrec(g);
    return spPart(m, P[0], P[1], { prompt: 'perpendicular to ' + t(givenT(g, c)) + ', through ' + t(ptT(P[0], P[1])), pre: 'The given slope is ' + t(nT(g)) + '; the negative reciprocal is ' + t('m=' + nT(m)) + '.<br>', exact: !isInt(m), wrong: perpW(g, P), hints: [H_PERP, H_PT[0]] });
  }
  /* Extra 13: equation, then both intercepts */
  function intPart(m, x0, y0) {
    m = fr(m); var b = bOf(m, x0, y0), xi = fDiv(fNeg(b), m);
    var fields = [fld('equation', { wide: true, placeholder: 'y = …' }), fld(t('y') + '-intercept'), fld(t('x') + '-intercept')];
    var xiChk = function (resp) {
      var s = String(resp == null ? '' : resp).trim(), pt = readPt(s), v = pt ? (near(pt[1], 0) ? pt[0] : null) : readVal(s);
      if (!s) return form('empty', 'Fill in the ' + t('x') + '-intercept.');
      if (pt && !near(pt[1], 0)) return wrong('u72-int-off', 'A point on the ' + t('x') + '-axis has ' + t('y=0') + '.');
      if (v == null) return form('u72-int-unreadable', 'Give the ' + t('x') + '-intercept as a number or fraction.');
      if (near(v, fv(xi))) return /\d\.\d/.test(s) && !isTerm(xi) ? form('u72-decimal', 'Give the exact value as a fraction.') : ok();
      if (near(v, fv(b))) return wrong('u72-int-swap', 'That’s the ' + t('y') + '-intercept. For the ' + t('x') + '-intercept, set ' + t('y=0') + '.');
      if (near(v, -fv(xi))) return wrong('u7l5-xint', 'Check the sign: from ' + t('0=' + nT(m) + 'x' + (fv(b) < 0 ? '' : '+') + nT(b)) + ', move ' + t(nT(b)) + ' to the other side first.');
      return wrong('u7l5-xint', null);
    };
    var p = B.fields('slope ' + t(nT(m)) + ', through ' + t(ptT(x0, y0)), fields,
      [K.line(L(m, b), { form: 'slope-intercept', point: [x0, y0], wrong: [{ is: L(m, fAdd(y0, fMul(m, x0))), code: 'u72-b-solve', hint: 'Check how you solved for ' + t('b') + '.' }, { is: L(m, y0), code: 'u72-b-y0', hint: t(y0) + ' is the point’s ' + t('y') + '-coordinate, not ' + t('b') + '.' }] }),
        intChk(b, [[xi, 'u72-int-swap', 'That’s the ' + t('x') + '-intercept. The ' + t('y') + '-intercept is ' + t('b') + '.']]), xiChk],
      [SI(m, b), nT(b), nT(xi)], t(SI(m, b)) + '; ' + t('y') + '-intercept ' + t(ptT(0, b)) + '; ' + t('x') + '-intercept ' + t(ptT(xi, 0)),
      subSol(m, x0, y0) + '<br>' + t(SI(m, b)) + '.<br>' + t('y') + '-intercept: ' + t(ptT(0, b)) + ' (it is ' + t('b') + ').<br>' + t('x') + '-intercept: set ' + t('y=0') + ': ' + t('0=' + nT(m) + 'x' + (fv(b) < 0 ? '' : '+') + nT(b) + '\\ \\Rightarrow\\ ' + nT(m) + 'x=' + nT(fNeg(b)) + '\\ \\Rightarrow\\ x=' + nT(xi)) + ', the point ' + t(ptT(xi, 0)) + '.',
      [H_PT[0], 'The ' + t('y') + '-intercept is ' + t('b') + '. For the ' + t('x') + '-intercept, set ' + t('y=0') + ' and solve for ' + t('x') + '.'], 'equation and intercepts');
    p.good = [[SI(m, b), ptK(0, b), ptK(xi, 0)]];
    p.bad = [[SI(m, b), nT(xi), nT(b)], [SI(m, b), nT(b), nT(fNeg(xi))]];
    return p;
  }
  function isTerm(f) { f = fr(f); var q = f[1]; while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; }
})(window);
