/* Math 15 · Unit 7 · Lesson 6 — Writing the Equation of a Line Given Two Points (RF7; slope-only parts RF3)
 * Assignment 6 (u7_L06.tex, Questions 1–14) and the Lesson 6 Extra Practice (u7_EP06.tex, Questions 1–18).
 * Every part is a generator: same structure, idea and difficulty as the booklet question, new numbers from the seed
 * (the booklet's own points are among the possible versions). Model: Math 10C u7l2.js (twoPointPart, tables) and
 * u7l4.js (lines read off a grid) — but Math 15 doesn't use slope–point form: find m with the slope formula, substitute
 * one point into y = mx + b, solve for b, and give the answer in y = mx + b form (K.line form 'slope-intercept'; a right
 * line in another form is a nudge that doesn't use a try). Diagnosed: subtracting in mixed order (slope sign), run over
 * rise, a sign slip solving for b, the point's y-coordinate used as b, stopping at b. Horizontal pairs give y = k;
 * vertical pairs x = k. Where the booklet says "keep exact", decimals get a nudge.
 * Conversions: "check by substituting the other point" -> a second box for that check value; "explain / interpret /
 * name the mistake" -> multiple choice whose options are reasons; "show that it fails" -> the value the wrong equation
 * gives; "show collinear by comparing slopes" -> the two slopes.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 14(b) (the y-intercept as a hidden second point) and
 * Extra 16(b) (the line through two midpoints, exact fractions). */
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
  function until(gen, okf) { for (var i = 0; i < 4000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('u7l6: no valid numbers'); }

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

  /* ---------------- figures ---------------- */
  var BLUE = '#2456b8', RED = '#b23a3a';
  function clipLine(Ls, xr, yr) {
    var m = fv(Ls.m), b = fv(Ls.b), pts = [];
    if (m === 0) return [[xr[0], b], [xr[1], b]];
    [xr[0], xr[1]].forEach(function (x) { var y = m * x + b; if (y >= yr[0] - 1e-9 && y <= yr[1] + 1e-9) pts.push([x, y]); });
    [yr[0], yr[1]].forEach(function (y) { var x = (y - b) / m; if (x >= xr[0] - 1e-9 && x <= xr[1] + 1e-9) pts.push([x, y]); });
    pts.sort(function (a, c) { return a[0] - c[0]; });
    return [pts[0], pts[pts.length - 1]];
  }
  function r1(v) { return Math.round(v * 10) / 10; }
  /* a grid with lines (arrows at both ends) and an italic letter beside each: lines [{ m, b, color, label, f, side }] */
  function figure(spec, lines) {
    var xr = spec.x, yr = spec.y;
    var segs = lines.map(function (Ls) { return { pts: clipLine(Ls, xr, yr), color: Ls.color || BLUE }; });
    var svg = HW.graph(Object.assign({}, spec, { segs: (spec.segs || []).concat(segs) })), G = HW.graph.last, add = '';
    lines.forEach(function (Ls, i) {
      var pp = segs[i].pts, col = segs[i].color;
      [[pp[0], pp[1]], [pp[1], pp[0]]].forEach(function (e) {
        var px = G.X(e[0][0]), py = G.Y(e[0][1]), qx = G.X(e[1][0]), qy = G.Y(e[1][1]), d = Math.hypot(px - qx, py - qy) || 1, ux = (px - qx) / d, uy = (py - qy) / d, bx = px - ux * 10, by = py - uy * 10;
        add += '<path d="M' + r1(px) + ' ' + r1(py) + ' L' + r1(bx - uy * 5) + ' ' + r1(by + ux * 5) + ' L' + r1(bx + uy * 5) + ' ' + r1(by - ux * 5) + ' Z" fill="' + col + '"/>';
      });
      if (Ls.label) {
        var top = pp[0][1] > pp[1][1] ? pp[0] : pp[1], bot = top === pp[0] ? pp[1] : pp[0], f = Ls.f == null ? 0.84 : Ls.f;
        if (pp[0][1] === pp[1][1]) { top = pp[1]; bot = pp[0]; }
        var lx = G.X(bot[0] + (top[0] - bot[0]) * f), ly = G.Y(bot[1] + (top[1] - bot[1]) * f);
        var dx = G.X(top[0]) - G.X(bot[0]), dy = G.Y(top[1]) - G.Y(bot[1]), dd = Math.hypot(dx, dy) || 1, off = Ls.side || 1;
        lx += -dy / dd * 14 * off; ly += dx / dd * 14 * off;
        lx = Math.max(G.padL + 10, Math.min(G.W - 12, lx)); ly = Math.max(14, Math.min(G.H - 22, ly));
        add += '<text x="' + r1(lx) + '" y="' + r1(ly + 4) + '" font-size="15" font-style="italic" text-anchor="middle" fill="' + col + '" stroke="#fff" stroke-width="3" paint-order="stroke">' + Ls.label + '</text>';
      }
    });
    return svg.replace('</svg>', add + '</svg>');
  }
  /* one line on a [-6, 6] grid with two marked lattice points */
  function markedFig(m, b, P, Q, col) {
    return figure({ x: [-6, 6], y: [-6, 6], labels: 2, max: 320, points: [{ x: P[0], y: P[1], color: '#1c2230' }, { x: Q[0], y: Q[1], color: '#1c2230' }], aria: 'a line through two marked points' }, [{ m: m, b: [b, 1], color: col || BLUE }]);
  }

  var SWAP = function () { return 'You swapped them: the slope ' + t('m') + ' multiplies ' + t('x') + ', and the ' + t('y') + '-intercept ' + t('b') + ' is the number added on its own.'; };
  /* Q1: slope and y-intercept given */
  function directPart(m, b, prompt, text, extra) {
    var w = (extra || []).slice();
    if (!fEq(m, b) && !(fv(b) === 0)) w.push({ is: L(b, m), code: 'u72-swap-mb', hint: SWAP() });
    return LP(prompt, L(m, b), { wrong: w },
      t('m=' + nT(m)) + ' and ' + t('b=' + nT(b)) + '. Put them into ' + t('y=mx+b') + ': ' + t(SI(m, b)) + '.<br><b>Check.</b> ' + t('x=0\\Rightarrow y=' + nT(b)) + ' ✓', H_SI, text);
  }
  /* the slope / y-intercept / equation boxes for a line read from a graph or a table */
  function threeBox(prompt, m, b, sol, hints, text, opt) {
    opt = opt || {};
    var target = L(m, b), xi = fv(b) === 0 ? null : fr(-fv(b) * fr(m)[1], fr(m)[0]);
    var lw = [{ is: L(fNeg(m), b), code: 'line-slope-sign', hint: 'Check the sign of the slope: the line ' + (fv(m) > 0 ? 'rises' : 'falls') + ' from left to right.' }];
    if (isInt(m) && !fEq(m, b) && fv(b) !== 0) lw.push({ is: L(b, m), code: 'u72-swap-mb', hint: SWAP() });
    if (xi && !fEq(xi, b) && fv(m) !== 0) lw.push({ is: L(m, xi), code: 'u72-b-xint', hint: 'In ' + t('y=mx+b') + ', ' + t('b') + ' is where the line crosses the <b>' + t('y') + '</b>-axis, not the ' + t('x') + '-axis.' });
    var fields = [fld('slope', { placeholder: 'm' }), fld(t('y') + '-intercept', { placeholder: 'b' }), fld('equation', { wide: true, placeholder: 'y = …' })];
    var checks = [slopeChk(fr(m), [], { graph: !opt.table }), intChk(b, xi && fv(m) !== 0 ? [[xi, 'u72-int-swap', 'That’s where the line crosses the ' + t('x') + '-axis. The ' + t('y') + '-intercept is where it crosses the ' + t('y') + '-axis.']] : []), K.line(target, { wrong: lw })];
    var p = B.fields(prompt, fields, checks, [nT(m), nT(b), SI(m, b)], 'slope ' + t(nT(m)) + ', ' + t('y') + '-intercept ' + t(nT(b)) + ', ' + t(SI(m, b)), sol, hints, text);
    p.good = [['m=' + nT(m), ptK(0, b), Lns.tex(target, 'general')]];
    p.bad = fv(m) === 0 ? [[nT(m), nT(fNeg(b)), SI(m, fNeg(b))], ['1', nT(b), SI(1, b)]] : [[nT(fNeg(m)), nT(b), SI(fNeg(m), b)], [nT(m), nT(b), SI(fNeg(m), b)]];
    if (xi && fv(m) !== 0 && !fEq(xi, b)) p.bad.push([nT(m), nT(xi), SI(m, xi)]);
    return p;
  }
  /* a line read off a grid through (0, b) and (q, b + p) */
  function graphSol(m, b) {
    m = fr(m); var q = m[1], p = m[0];
    return 'The line crosses the ' + t('y') + '-axis at ' + t(ptT(0, b)) + ', so ' + t('b=' + b) + '. From there it reaches the lattice point ' + t(ptT(q, b + p)) + ': ' + (p > 0 ? 'up ' : p < 0 ? 'down ' : 'no rise, ') + (p ? t(Math.abs(p)) + ', ' : '') + 'right ' + t(q) + ', so ' + t('m=\\frac{' + p + '}{' + q + '}' + (q === 1 ? '=' + p : '')) + '.<br>' +
      t(SI(m, b)) + '. <b>Check.</b> ' + t(evalT(m, q, [b, 1]) + '=' + (b + p)) + ' ✓';
  }

  var H_2P = ['Step 1: the slope, ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + ' (subtract in the <b>same order</b> on the top and the bottom). Step 2: substitute ' + t('m') + ' and <b>one</b> point into ' + t('y=mx+b') + ' and solve for ' + t('b') + '.', 'Check with the <b>other</b> point: it must make your equation true too.'];
  function slope2(A, Bp) { return fr(Bp[1] - A[1], Bp[0] - A[0]); }
  function sub(a, b) { return nT(a) + '-' + pT(b); }
  function slopeSol(A, Bp) {
    var rise = Bp[1] - A[1], run = Bp[0] - A[0], m = run === 0 ? null : fr(rise, run);
    return t('m=\\frac{' + sub(Bp[1], A[1]) + '}{' + sub(Bp[0], A[0]) + '}=\\frac{' + rise + '}{' + run + '}' + (m && (m[0] !== rise || m[1] !== run) ? '=' + nT(m) : ''));
  }
  /* two points -> y = mx + b (slope first, then substitute the first point) */
  function tpPart(A, Bp, opt) {
    opt = opt || {};
    var m = slope2(A, Bp), vars = opt.vars || ['x', 'y'], w = (opt.wrong || []).slice();
    if (m[0] !== 0) {
      w.push({ is: L(fNeg(m), bOf(fNeg(m), A[0], A[1])), code: 'u7l6-order', hint: 'Check the sign of the slope: subtract the coordinates in the <b>same order</b> on the top and the bottom, ' + t('\\frac{y_2-y_1}{x_2-x_1}') + '.' });
      if (Math.abs(m[0]) !== Math.abs(m[1])) w.push({ is: L(fInv(m), bOf(fInv(m), A[0], A[1])), code: 'line-slope-flip', hint: 'Slope is <b>rise over run</b>: the change in ' + t(vars[1]) + ' goes on top.' });
    }
    var p = spPart(m, A[0], A[1], { prompt: opt.prompt || (t(ptT(A[0], A[1])) + ' and ' + t(ptT(Bp[0], Bp[1]))), vars: vars, form: opt.form, exact: opt.exact, wrong: w,
      pre: '<b>Step 1.</b> ' + slopeSol(A, Bp) + '.<br><b>Step 2.</b> Substitute ' + t(ptT(A[0], A[1])) + ':<br>', hints: opt.hints || H_2P, text: opt.text || ('two points ' + ptK(A[0], A[1]) + ptK(Bp[0], Bp[1])) });
    var b = bOf(m, A[0], A[1]);
    p.solution += '<br><b>Check with the other point.</b> ' + t(evalT(m, Bp[0], b) + '=' + nT(fAdd(fMul(m, Bp[0]), b))) + ' ✓';
    return p;
  }
  function slopeOnly(A, Bp, prompt, text) {
    var m = slope2(A, Bp), p = B.slope(prompt || (t(ptT(A[0], A[1])) + ' and ' + t(ptT(Bp[0], Bp[1]))), m, {}, slopeSol(A, Bp) + '.', [H_2P[0].split(' Step 2')[0], 'Subtracting a negative is adding: ' + t('a-(-b)=a+b') + '.'], text || 'slope only');
    p.bad = [nT(fNeg(m))]; if (Math.abs(m[0]) !== Math.abs(m[1]) && m[0] !== 0) p.bad.push(nT(fInv(m)));
    return p;
  }
  /* integer points on y = mx + b */
  function onL(m, b, x) { return [x, fv(fAdd(fMul(m, x), [b, 1]))]; }
  function pair(r, m, b, xs1, gap) { var x1 = r.pick(xs1), x2 = x1 + gap; return [onL(m, b, x1), onL(m, b, x2)]; }

  HW.addCodes({
    'u72-decimal': 'Rounded decimals instead of exact fractions', 'u72-swap-mb': 'Swapped slope and y-intercept', 'u72-coord': 'Used the other coordinate', 'u72-b-solve': 'Sign slip solving for b', 'u72-b-y0': 'Used the point’s y-coordinate as b',
    'u72-fee': 'Forgot the fixed fee', 'u72-rate-fee': 'Mixed up the rate and the fee', 'u72-b-xint': 'Used the x-intercept as b', 'u72-int-said-none': 'Said “none” for an intercept that exists', 'u72-int-off': 'Intercept point not on the axis', 'u72-int-unreadable': 'Intercept not a number', 'u72-int-swap': 'Swapped x- and y-intercepts',
    'u72-pt-value': 'Gave one number instead of a point', 'u72-mid': 'Midpoint error', 'u7l5-stop-b': 'Stopped at b instead of writing the equation', 'u7l5-swap-xy': 'Substituted the coordinates the wrong way round', 'u7l5-check': 'Check value doesn’t match the point', 'u7l5-solve': 'Error solving for the unknown', 'u7l5-xint': 'Error finding the x-intercept',
    'u7l6-order': 'Subtracted the coordinates in mixed order (slope sign)', 'u7l6-run': 'Used the run (or one coordinate) as the slope', 'u7l6-b-noy': 'Left out the point’s y-coordinate solving for b', 'u7l6-start': 'Gave a reading instead of the starting value',
    'u7l6-cap': 'Prediction past the maximum', 'u7l6-solve-n': 'Error solving for the input', 'u7l6-his': 'Wrong value for the student’s equation', 'u7l6-unknown': 'Error solving for the unknown coordinate'
  });
  HW.addPartial({ 'u72-b-solve': 'b', 'u72-fee': 'b', 'u72-int-off': 'b', 'u72-mid': 'b', 'u72-b-y0': 'n', 'u72-swap-mb': 'n', 'u72-coord': 'n', 'u72-rate-fee': 'n', 'u72-b-xint': 'n', 'u72-int-swap': 'n', 'u72-int-said-none': 'n',
    'u7l5-swap-xy': 'b', 'u7l5-check': 'n', 'u7l5-solve': 'b', 'u7l5-xint': 'b', 'u7l6-order': 'b', 'u7l6-run': 'n', 'u7l6-b-noy': 'b', 'u7l6-start': 'n', 'u7l6-cap': 'n', 'u7l6-solve-n': 'b', 'u7l6-his': 'n', 'u7l6-unknown': 'b' });

  HW.defineLesson({
    id: 'u7l6', unit: 7, num: '6', title: 'Writing the Equation of a Line Given Two Points', outcome: 'RF7',
    blurb: 'Find the slope from two points, then substitute one point into y = mx + b and solve for b.',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A — Slope first, then the equation', stem: 'Find the slope of the line through each pair of points.', parts: [
        { id: '1a', level: 'BEG', outcome: 'RF3', make: function (r) { var m = r.int(2, 5), Pq = pair(r, [m, 1], r.int(-3, 3), [0, 1, 2], r.int(2, 4)); return slopeOnly(Pq[0], Pq[1]); } },
        { id: '1b', level: 'BEG', outcome: 'RF3', make: function (r) { var m = -r.int(2, 4), b = r.int(2, 8), Pq = [[0, b], onL([m, 1], b, r.int(2, 4))]; return slopeOnly(Pq[0], Pq[1]); } },
        { id: '1c', level: 'BEG', outcome: 'RF3', make: function (r) { var m = r.int(2, 4), x1 = -r.int(1, 3), Pq = until(function () { return pair(r, [m, 1], nz(r, -3, 3), [x1], r.int(3, 5)); }, function (q) { return q[0][1] < 0; }); return slopeOnly(Pq[0], Pq[1]); } },
        { id: '1d', level: 'BEG', outcome: 'RF3', make: function (r) { var m = -r.int(2, 3), b = -r.int(1, 5), x1 = -r.int(3, 5), Pq = [onL([m, 1], b, x1), [0, b]]; return slopeOnly(Pq[0], Pq[1]); } }] },
      { num: '2', stem: 'Determine the equation, in the form ' + t('y=mx+b') + ', of the line through each pair of points.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var m = r.int(2, 5), b = nz(r, -4, 6), Pq = pair(r, [m, 1], b, [1, 2], r.int(1, 3)); return tpPart(Pq[0], Pq[1]); } },
        { id: '2b', level: 'BEG', make: function (r) { var m = r.int(2, 5), b = -r.int(1, 9), Pq = until(function () { return pair(r, [m, 1], b, [1, 2, 3], r.int(2, 4)); }, function (q) { return q[0][1] !== 0; }); return tpPart(Pq[0], Pq[1]); } },
        { id: '2c', level: 'BEG', make: function (r) { var m = r.int(2, 4), b = -r.int(1, 6), Pq = [[0, b], onL([m, 1], b, r.int(2, 5))]; return tpPart(Pq[0], Pq[1]); } },
        { id: '2d', level: 'EMG', make: function (r) { var m = -r.int(2, 4), b = r.int(1, 6), Pq = pair(r, [m, 1], b, [-1, -2], r.int(3, 4)); return tpPart(Pq[0], Pq[1]); } },
        { id: '2e', level: 'EMG', make: function (r) { var m = r.int(2, 3), b = nz(r, -4, 4), x1 = -r.int(2, 4), Pq = [onL([m, 1], b, x1), onL([m, 1], b, -x1)]; return tpPart(Pq[0], Pq[1]); } },
        { id: '2f', level: 'EMG', make: function (r) { var m = -r.int(2, 3), b = nz(r, -4, 4), x1 = -r.int(2, 4), Pq = [onL([m, 1], b, x1), onL([m, 1], b, -x1)]; return tpPart(Pq[0], Pq[1]); } }] },
      { num: '3', stem: 'Determine the equation, in the form ' + t('y=mx+b') + ', of the line through each pair of points. Then check it by substituting the second point into your equation.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var m = r.int(2, 5), b = nz(r, -6, 4), Pq = pair(r, [m, 1], b, [1, 2, 3], r.int(2, 3)); return tpCheck(Pq[0], Pq[1]); } },
        { id: '3b', level: 'EMG', make: function (r) { var m = -r.int(2, 4), b = nz(r, -3, 5), Pq = pair(r, [m, 1], b, [-2, -3, -4], r.int(3, 5)); return tpCheck(Pq[0], Pq[1]); } },
        { id: '3c', level: 'EMG', make: function (r) { var m = r.int(2, 3), b = r.int(3, 9), x1 = -r.int(3, 6), Pq = [onL([m, 1], b, x1), [0, b]]; return tpCheck(Pq[0], Pq[1]); } }] },
      { num: '4', stem: 'Determine the equation, in the form ' + t('y=mx+b') + ', of the line through each pair of points. The slopes here are fractions — keep them exact.', parts: [
        { id: '4a', level: 'PRG', make: function (r) { var m = r.pick([[1, 2], [1, 4], [3, 4]]), b = r.int(1, 6), k = r.int(1, 2), x1 = -m[1] * r.int(1, 2); return tpPart(onL(m, b, x1), onL(m, b, x1 + m[1] * (k + 1)), { exact: true }); } },
        { id: '4b', level: 'PRG', make: function (r) { var m = r.pick([[-2, 3], [-1, 3], [-3, 2]]), b = r.int(2, 9); return tpPart([0, b], onL(m, b, m[1] * r.int(1, 3)), { exact: true }); } },
        { id: '4c', level: 'PRG', make: function (r) { var m = r.pick([[6, 5], [4, 5], [3, 5], [5, 2]]), b = nz(r, -6, 4), x1 = -m[1]; return tpPart(onL(m, b, x1), onL(m, b, -x1), { exact: true }); } },
        { id: '4d', level: 'PRG', make: function (r) { var m = r.pick([[-1, 2], [-1, 3], [-2, 3]]), b = r.int(1, 6), x1 = -m[1] * r.int(1, 2); return tpPart(onL(m, b, x1), onL(m, b, x1 + m[1] * r.int(2, 3)), { exact: true }); } }] },

      /* ---------------- Part B ---------------- */
      { num: '5', section: 'Part B — Special cases', stem: 'Determine the equation, in the form ' + t('y=mx+b') + ', of the line through each pair of points. <i>Hint:</i> one point in each pair already sits on the ' + t('y') + '-axis.', parts: [
        { id: '5a', level: 'EMG', make: function (r) { var m = r.int(2, 6) * (r.chance(0.3) ? -1 : 1), b = -m * r.int(1, 4); return yAxisPart([0, b], [-b / m, 0]); } },
        { id: '5b', level: 'EMG', make: function (r) { var m = -r.int(2, 4), b = r.int(5, 12); return yAxisPart([0, b], onL([m, 1], b, r.int(2, 4))); } }] },
      { num: '6', stem: 'Determine the equation of the line through each pair of points.', shared: function (r) { return { y: nz(r, -9, 9), xs: [-r.int(1, 6), r.int(1, 8)], v: [r.int(2, 9), r.int(1, 6), -r.int(1, 6)] }; },
        parts: [
          { id: '6a', level: 'EMG', make: function (r, sh) { return horizPart2([sh.xs[0], sh.y], [sh.xs[1], sh.y]); } },
          { id: '6b', level: 'EMG', make: function (r, sh) {
            var x = sh.v[0], P1 = [x, sh.v[1]], P2 = [x, sh.v[2]];
            return mc(r, 'Why can’t the process from this lesson produce an equation of the form ' + t('y=mx+b') + ' for the points ' + t(ptT(P1[0], P1[1])) + ' and ' + t(ptT(P2[0], P2[1])) + '?', [
              { html: 'The run is ' + t(x + '-' + x + '=0') + ', and you can’t divide by ' + t(0) + ': the slope is undefined. Equal ' + t('x') + '-coordinates make a <b>vertical</b> line, ' + t('x=' + x) + ', which has no ' + t('y=mx+b') + ' form.', right: true },
              { html: 'The rise is ' + t(0) + ', so the slope is ' + t(0) + ' and the line is ' + t('y=' + sh.v[1]) + '.', why: 'The <b>' + t('y') + '</b>-coordinates are different (' + t(sh.v[1]) + ' and ' + t(sh.v[2]) + '); it is the ' + t('x') + '-coordinates that are equal.' },
              { html: 'One of the points has a negative coordinate.', why: 'Negative coordinates are fine — substitute them with their signs. Look at the run.' },
              { html: 'Neither point is on the ' + t('y') + '-axis, so ' + t('b') + ' can’t be found.', why: 'Most pairs have no point on the ' + t('y') + '-axis; we find ' + t('b') + ' by substituting. Here the problem comes first, at the slope.' }],
              t('m=\\frac{' + sub(P2[1], P1[1]) + '}{' + x + '-' + x + '}=\\frac{' + (P2[1] - P1[1]) + '}{0}') + ' — division by ' + t(0) + ' is undefined. Both points have ' + t('x=' + x) + ', so the line is vertical: ' + t('x=' + x) + '. A vertical line has no slope ' + t('m') + ' to put into ' + t('y=mx+b') + '.', ['What happens to the run, ' + t('x_2-x_1') + '?'], 'why vertical');
          } }] },

      /* ---------------- Part C ---------------- */
      { num: '7', section: 'Part C — Applications', stem: function (sh) { return 'A cyclist rides away from home at a constant speed. After ' + t(sh.t1) + ' hours she is ' + t(sh.d1) + ' km from home; after ' + t(sh.t2) + ' hours she is ' + t(sh.d2) + ' km from home.'; },
        shared: function (r) { var v = r.int(5, 18), b = r.int(1, 9), t1 = r.int(1, 3), t2 = t1 + r.int(2, 4); return { v: v, b: b, t1: t1, t2: t2, d1: v * t1 + b, d2: v * t2 + b, t3: t2 + r.int(2, 4) }; },
        parts: [
          { id: '7a', level: 'PRG', make: function (r, sh) { return tpPart([sh.t1, sh.d1], [sh.t2, sh.d2], { prompt: 'Determine the equation relating her distance ' + t('d') + ' (km) from home and her riding time ' + t('t') + ' (hours).', vars: ['t', 'd'], text: 'cyclist equation' }); } },
          { id: '7b', level: 'EMG', make: function (r, sh) {
            return mc(r, 'What do the slope and the ' + t('d') + '-intercept represent?', [
              { html: 'Slope ' + t(sh.v) + ': she rides ' + t(sh.v) + ' km farther from home each hour (her speed). ' + t('d') + '-intercept ' + t(sh.b) + ': she was already ' + t(sh.b) + ' km from home when the timing began.', right: true },
              { html: 'Slope ' + t(sh.v) + ': her distance after ' + t(1) + ' hour. ' + t('d') + '-intercept ' + t(sh.b) + ': the time she started riding.', why: 'After ' + t(1) + ' hour she is ' + t(sh.v + sh.b) + ' km away. The slope is a <b>rate</b>: km per hour. The intercept is a distance, at ' + t('t=0') + '.' },
              { html: 'Slope ' + t(sh.v) + ': her speed in km per hour. ' + t('d') + '-intercept ' + t(sh.b) + ': the number of hours she rested.', why: 'The ' + t('d') + '-intercept is a value of ' + t('d') + ' (km): her distance from home at ' + t('t=0') + '.' },
              { html: 'Slope ' + t(sh.v) + ': the hours needed to ride ' + t(1) + ' km. ' + t('d') + '-intercept ' + t(sh.b) + ': her distance from home at the start of the timing.', why: 'Slope = change in distance ÷ change in time: km <b>per hour</b>, not hours per km.' }],
              'The slope is the change in distance per hour, ' + t(sh.v) + ' km/h — her speed. The ' + t('d') + '-intercept is the distance at ' + t('t=0') + ': she was ' + t(sh.b) + ' km from home when the timing began.', ['Units of the slope: km ÷ hours. The ' + t('d') + '-intercept is ' + t('d') + ' when ' + t('t=0') + '.'], 'meaning cyclist');
          } },
          { id: '7c', level: 'EMG', make: function (r, sh) { return predictPart('Predict her distance from home after ' + t(sh.t3) + ' hours.', [sh.v, 1], sh.b, sh.t3, [sh.t2, sh.d2], 't', 'd', { after: 'km' }, 'cyclist predict'); } }] },
      { num: '8', stem: function (sh) { return 'A phone charges at a constant rate. After ' + t(sh.t1) + ' minute' + (sh.t1 > 1 ? 's' : '') + ' the battery reads ' + t(sh.p1 + '\\%') + '; after ' + t(sh.t2) + ' minutes it reads ' + t(sh.p2 + '\\%') + '.'; },
        shared: function (r) { return until(function () { var k = r.int(3, 8), p0 = r.int(15, 45), t1 = r.int(1, 3), t2 = t1 + r.int(3, 6), t3 = t2 + r.int(2, 5); return { k: k, p0: p0, t1: t1, t2: t2, t3: t3, p1: p0 + k * t1, p2: p0 + k * t2, p3: p0 + k * t3 }; }, function (o) { return o.p3 <= 100; }); },
        parts: [
          { id: '8a', level: 'PRG', make: function (r, sh) { return tpPart([sh.t1, sh.p1], [sh.t2, sh.p2], { prompt: 'Determine the equation relating the battery percentage ' + t('p') + ' and the charging time ' + t('t') + ' (minutes).', vars: ['t', 'p'], text: 'phone equation' }); } },
          { id: '8b', level: 'EMG', make: function (r, sh) { return predictPart('Predict the battery percentage after ' + t(sh.t3) + ' minutes of charging.', [sh.k, 1], sh.p0, sh.t3, [sh.t2, sh.p2], 't', 'p', { after: '%' }, 'phone predict'); } }] },
      { num: '9', stem: '', parts: [
        { id: '9', level: 'PRG', make: function (r) {
          var k = r.pick([10, 15, 20, 25, 30]), b = r.pick([0, 0, 10, 20, 5]), a1 = r.int(1, 4), a2 = a1 + r.int(2, 4);
          return tpPart([a1, k * a1 + b], [a2, k * a2 + b], { prompt: 'A young tree was ' + t(k * a1 + b) + ' cm tall at age ' + t(a1) + ' year' + (a1 > 1 ? 's' : '') + ' and ' + t(k * a2 + b) + ' cm tall at age ' + t(a2) + ' years. Assuming constant growth, determine the equation relating its height ' + t('h') + ' (cm) and its age ' + t('a') + ' (years).', vars: ['a', 'h'], text: 'tree equation' });
        } }] },

      /* ---------------- Part D ---------------- */
      { num: '10', section: 'Part D — Multiple choice, numerical response and challenge', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var o = until(function () { var m = r.int(2, 5), x1 = r.int(1, 4), run = r.int(2, 4), b = -r.int(1, 9); return { m: m, x1: x1, x2: x1 + run, run: run, b: b, y1: m * x1 + b, y2: m * (x1 + run) + b }; }, function (o) { return o.run !== o.m && o.y1 > 0 && -o.m * o.x1 !== o.b && -o.m * o.x1 !== -o.b; });
          return mc(r, 'The equation of the line through ' + t(ptT(o.x1, o.y1)) + ' and ' + t(ptT(o.x2, o.y2)) + ' is', [
            { html: t(SI(o.m, o.b)), right: true },
            { html: t(SI(o.m, -o.b)), why: 'Check the sign of ' + t('b') + ': ' + t(o.y1 + '=' + (o.m * o.x1) + '+b') + ', so ' + t('b=' + o.y1 + '-' + (o.m * o.x1)) + '.' },
            { html: t(SI(o.run, o.b)), why: t(o.run) + ' is the run. The slope is rise ÷ run: ' + t('\\frac{' + (o.y2 - o.y1) + '}{' + o.run + '}') + '.' },
            { html: t(SI(o.m, -o.m * o.x1)), why: 'Solving for ' + t('b') + ', keep the point’s ' + t('y') + '-coordinate: ' + t(o.y1 + '=' + o.m + '(' + o.x1 + ')+b') + '.' }],
            '<b>Step 1.</b> ' + slopeSol([o.x1, o.y1], [o.x2, o.y2]) + '.<br><b>Step 2.</b> ' + subSol([o.m, 1], o.x1, o.y1) + '<br>' + t(SI(o.m, o.b)) + '.', H_2P, 'MC two points', true);
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var o = until(function () { var m = -r.int(2, 4), k = r.int(1, 3), b = r.int(1, 8); return { m: m, k: k, b: b, A: [-k, -m * k + b], Bp: [k, m * k + b] }; }, function (o) { return o.b !== -o.b && 2 * o.m !== -o.m; });
          return mc(r, 'A line passes through ' + t(ptT(o.A[0], o.A[1])) + ' and ' + t(ptT(o.Bp[0], o.Bp[1])) + '. Which is its equation?', [
            { html: t(SI(o.m, o.b)), right: true },
            { html: t(SI(-o.m, o.b)), why: 'Subtract in the same order on top and bottom: the line falls from left to right, so the slope is negative.' },
            { html: t(SI(o.m, -o.b)), why: 'Check the sign of ' + t('b') + ' when you solve.' },
            { html: t(SI(2 * o.m, o.b)), why: 'Check the run: ' + t(o.k + '-(' + (-o.k) + ')=' + (2 * o.k)) + ', not ' + t(o.k) + '.' }],
            '<b>Step 1.</b> ' + slopeSol(o.A, o.Bp) + '.<br><b>Step 2.</b> ' + subSol([o.m, 1], o.Bp[0], o.Bp[1]) + '<br>' + t(SI(o.m, o.b)) + '.', H_2P, 'MC two points symmetric', true);
        } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '12', level: 'PRG', make: function (r) {
          var o = until(function () { var m = r.int(2, 5), b = -r.int(2, 9), x1 = r.int(1, 2), run = r.int(2, 3); return { m: m, b: b, A: [x1, m * x1 + b], Bp: [x1 + run, m * (x1 + run) + b] }; }, function (o) { return o.A[1] < 0 && o.Bp[1] > 0 && o.m + o.b !== 0; });
          var ans = o.m - o.b, slip = fv(fAdd([o.A[1], 1], fMul([o.m, 1], o.A[0])));
          return nrPart('The line through ' + t(ptT(o.A[0], o.A[1])) + ' and ' + t(ptT(o.Bp[0], o.Bp[1])) + ' has equation ' + t('y=mx+b') + '. The value of ' + t('m-b') + ' is ________.', ans, [[o.m + o.b, 'sign', 'Subtract: ' + t('m-b=' + o.m + '-' + pT(o.b)) + '. Subtracting a negative adds.'], [o.m - slip, 'u72-b-solve', 'Check how you solved for ' + t('b') + ': subtract ' + t('mx') + '.'], [-o.m - o.b, 'u7l6-order', 'Check the sign of the slope.'], [o.b - o.m, 'u7l6-order', 'It is ' + t('m-b') + ', not ' + t('b-m') + '.']],
            '<b>Step 1.</b> ' + slopeSol(o.A, o.Bp) + '.<br><b>Step 2.</b> ' + subSol([o.m, 1], o.A[0], o.A[1]) + '<br>So ' + t('m-b=' + o.m + '-' + pT(o.b) + '=' + ans) + '.', H_2P, 'NR m-b');
        } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '13', level: 'PRG', make: function (r) {
          var m = r.int(2, 5), b = r.int(2, 9), x2 = r.int(2, 3), ans = m * b;   // NR: b positive so the answer is positive
          return nrPart('A line passes through ' + t(ptT(0, b)) + ' and ' + t(ptT(x2, m * x2 + b)) + '. Written as ' + t('y=mx+b') + ', the value of ' + t('m\\times b') + ' is ________.', ans, [[m + b, 'u7l6-run', t('m\\times b') + ' means multiply ' + t('m') + ' by ' + t('b') + '.'], [(m * x2 + b) * m, 'u7l6-run', 'The ' + t('y') + '-intercept is the ' + t('y') + '-value at ' + t('x=0') + ': ' + t('b=' + b) + '.']],
            t(ptT(0, b)) + ' is on the ' + t('y') + '-axis, so ' + t('b=' + b) + '. ' + slopeSol([0, b], [x2, m * x2 + b]) + '. So ' + t('m\\times b=' + m + '\\times ' + pT(b) + '=' + ans) + '.', ['One point is on the ' + t('y') + '-axis: it gives ' + t('b') + ' directly.', H_2P[0]], 'NR m×b');
        } }] },
      { num: '14', stem: '', parts: [
        { id: '14', level: 'ADV', make: function (r) {
          var m = r.int(2, 4), b = r.int(2, 9), x1 = -r.int(6, 9), x2 = r.int(3, 6);
          return tpPart(onL([m, 1], b, x1), onL([m, 1], b, x2), { prompt: 'Determine the equation, in the form ' + t('y=mx+b') + ', of the line through ' + t(ptT(x1, m * x1 + b)) + ' and ' + t(ptT(x2, m * x2 + b)) + '.' });
        } }] }
    ],

    /* =============================== EXTRA PRACTICE =============================== */
    extra: [
      { num: '1', section: 'Extra practice A — Slope first, then substitute', stem: 'Find the slope of the line through each pair of points. Keep every answer exact — several of these do not divide evenly.', parts: [
        { id: 'e1a', level: 'BEG', outcome: 'RF3', make: function (r) { var m = r.int(2, 4), x1 = r.int(1, 4), y1 = nz(r, -5, 5), run = r.int(2, 5); return slopeOnly([x1, y1], [x1 + run, y1 + m * run]); } },
        { id: 'e1b', level: 'BEG', outcome: 'RF3', make: function (r) { var m = -r.int(2, 3), x1 = -r.int(2, 6), y1 = r.int(1, 9), run = r.int(3, 6); return slopeOnly([x1, y1], [x1 + run, y1 + m * run]); } },
        { id: 'e1c', level: 'EMG', outcome: 'RF3', make: function (r) { return fracSlope(r, [[1, 2], [1, 3], [2, 5]], [-7, -2]); } },
        { id: 'e1d', level: 'EMG', outcome: 'RF3', make: function (r) { return fracSlope(r, [[-2, 3], [-3, 5], [-1, 4]], [1, 4]); } },
        { id: 'e1e', level: 'EMG', outcome: 'RF3', make: function (r) { return fracSlope(r, [[-3, 4], [-4, 3], [-5, 4]], [-8, -4]); } },
        { id: 'e1f', level: 'EMG', outcome: 'RF3', make: function (r) { return fracSlope(r, [[3, 2], [5, 2], [4, 3]], [-5, -2]); } }] },
      { num: '2', stem: 'Determine the equation, in the form ' + t('y=mx+b') + ', of the line through each pair of points. Every pair has one point in a different quadrant from the other, so substitute each coordinate <i>with</i> its sign, in brackets.', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { var m = -r.int(2, 4), b = r.int(1, 5); return tpPart(onL([m, 1], b, -r.int(2, 3)), onL([m, 1], b, r.int(2, 3))); } },
        { id: 'e2b', level: 'EMG', make: function (r) { var m = r.int(2, 4), b = nz(r, -3, 3); return tpPart(onL([m, 1], b, -r.int(4, 5)), onL([m, 1], b, r.int(2, 3))); } },
        { id: 'e2c', level: 'EMG', make: function (r) { var m = -r.int(2, 3), b = -r.int(1, 4); return tpPart(onL([m, 1], b, r.int(3, 5)), onL([m, 1], b, -r.int(2, 3))); } },
        { id: 'e2d', level: 'EMG', make: function (r) { var m = -r.int(3, 5), b = -r.int(1, 4); return tpPart(onL([m, 1], b, r.int(2, 4)), onL([m, 1], b, -r.int(4, 6))); } }] },
      { num: '3', stem: 'Determine the equation, in the form ' + t('y=mx+b') + ', of the line through each pair of points. The slopes here are fractions — reduce them, then keep them exact right through the substitution.', parts: [
        { id: 'e3a', level: 'PRG', make: function (r) { return fracPair(r, [[3, 4], [2, 3], [3, 2]], 4); } },
        { id: 'e3b', level: 'PRG', make: function (r) { return fracPair(r, [[-2, 3], [-3, 5], [-2, 5]], 5); } },
        { id: 'e3c', level: 'PRG', make: function (r) { return fracPair(r, [[4, 5], [3, 5], [5, 3]], 5); } },
        { id: 'e3d', level: 'PRG', make: function (r) { return fracPair(r, [[-3, 4], [-3, 5], [-5, 4]], 5); } }] },
      { num: '4', stem: 'Determine the equation of the line through each pair of points. This time <i>both</i> ' + t('m') + ' and ' + t('b') + ' come out as fractions. Do not round.', parts: [
        { id: 'e4a', level: 'ADV', make: function (r) { var P = until(function () { var A = [-r.int(1, 5), nz(r, -6, 6)], Bp = [r.int(2, 6), nz(r, -6, 6)]; return [A, Bp]; }, function (q) { var m = slope2(q[0], q[1]); return m[0] < 0 && m[1] >= 3 && m[1] <= 8 && !isInt(bOf(m, q[0][0], q[0][1])); }); return tpPart(P[0], P[1], { exact: true }); } },
        { id: 'e4b', level: 'ADV', make: function (r) { var P = until(function () { var A = [-r.int(2, 7), -r.int(1, 7)], Bp = [r.int(1, 6), r.int(1, 7)]; return [A, Bp]; }, function (q) { var m = slope2(q[0], q[1]); return m[1] >= 3 && m[1] <= 10 && !isInt(bOf(m, q[0][0], q[0][1])); }); return tpPart(P[0], P[1], { exact: true }); } }] },

      { num: '5', section: 'Extra practice B — Shortcuts, special cases, graphs and tables', stem: 'In each pair below, one point already sits on the ' + t('y') + '-axis. Determine the equation in the form ' + t('y=mx+b') + '.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) { var m = r.int(2, 4), b = -r.int(3, 9), x = r.int(3, 6); return yAxisPart([0, b], onL([m, 1], b, x)); } },
        { id: 'e5b', level: 'EMG', make: function (r) { var m = r.pick([[-1, 2], [-1, 3], [-2, 5]]), b = r.int(2, 8), x = -m[1] * r.int(1, 3); return yAxisPart([0, b], onL(m, b, x), true); } },
        { id: 'e5c', level: 'EMG', make: function (r) { var m = r.pick([[-3, 4], [-2, 3], [-3, 2]]), b = -r.int(1, 6), x = m[1] * r.int(1, 2); return yAxisPart([0, b], onL(m, b, x), true); } },
        { id: 'e5d', level: 'EMG', make: function (r) {
          return mc(r, 'A point of the form ' + t('(0,\\ k)') + ' lets you skip an entire step of the method. Which step, and why is skipping it legitimate?', [
            { html: 'The substitute-and-solve step: ' + t('(0,\\ k)') + ' is the ' + t('y') + '-intercept, so ' + t('b=k') + ' can be read straight off; only the slope still has to be computed.', right: true },
            { html: 'The slope step: a point on the ' + t('y') + '-axis tells you the slope is ' + t('k') + '.', why: t('(0,\\ k)') + ' tells you where the line crosses the ' + t('y') + '-axis — that is ' + t('b') + ', not the slope. You still need both points for ' + t('m') + '.' },
            { html: 'The check step: a point on the ' + t('y') + '-axis can’t be wrong.', why: 'Checking is always worth doing. What ' + t('(0,\\ k)') + ' gives you for free is ' + t('b') + '.' },
            { html: 'Writing the final equation: ' + t('y=k') + ' is already the answer.', why: t('y=k') + ' is a horizontal line. The line through ' + t('(0,\\ k)') + ' and another point usually has a slope.' }],
            'A point ' + t('(0,\\ k)') + ' lies on the ' + t('y') + '-axis, so it <b>is</b> the ' + t('y') + '-intercept: ' + t('b=k') + '. There is nothing to solve for — skip the substitute-and-solve step and compute only the slope.', ['What is ' + t('b') + ' in ' + t('y=mx+b') + '? Where is ' + t('(0,\\ k)') + '?'], 'which step to skip');
        } }] },
      { num: '6', stem: 'Write the equation of the line through each pair of points. None of these behaves like a normal question — decide what is special <i>before</i> you reach for the slope formula.',
        shared: function (r) { return { a: [-r.int(2, 9), r.int(1, 9), nz(r, -9, 9)], b: [nz(r, -8, 8), r.int(1, 9), -r.int(1, 9)], c: [r.int(1, 9), -r.int(1, 9)], d: [r.int(1, 9), -r.int(1, 9)] }; },
        parts: [
          { id: 'e6a', level: 'EMG', make: function (r, sh) { return horizPart2([sh.a[0], sh.a[2]], [sh.a[1], sh.a[2]]); } },
          { id: 'e6b', level: 'EMG', make: function (r, sh) { var x = sh.b[0]; return vertPart([x, sh.b[1]], t(ptT(x, sh.b[1])) + ' and ' + t(ptT(x, sh.b[2])), [{ is: { y: sh.b[1] }, code: 'line-vh', hint: 'Both points have the same <b>' + t('x') + '</b>-coordinate, so the line is vertical: ' + t('x=') + ' a number.' }]); } },
          { id: 'e6c', sub: 'b (why)', level: 'EMG', make: function (r, sh) {
            var x = sh.b[0];
            return mc(r, 'Why can’t the line through ' + t(ptT(x, sh.b[1])) + ' and ' + t(ptT(x, sh.b[2])) + ' be written in the form ' + t('y=mx+b') + '?', [
              { html: 'The run is ' + t(x + '-' + pT(x) + '=0') + ', so the slope formula divides by ' + t(0) + ' and the slope is undefined — there is no value of ' + t('m') + '.', right: true },
              { html: 'The slope is ' + t(0) + ', so there is no ' + t('x') + '-term.', why: 'A slope of ' + t(0) + ' (a horizontal line) <i>does</i> fit ' + t('y=0x+b') + '. Here the <b>run</b> is ' + t(0) + ', not the rise.' },
              { html: 'The line doesn’t cross the ' + t('x') + '-axis.', why: 'It crosses the ' + t('x') + '-axis at ' + t(ptT(x, 0)) + '. The trouble is the slope.' },
              { html: 'The ' + t('y') + '-coordinates have opposite signs.', why: 'Opposite signs are no problem in the slope formula. Look at the ' + t('x') + '-coordinates.' }],
              t('m=\\frac{' + sub(sh.b[2], sh.b[1]) + '}{' + sub(x, x) + '}=\\frac{' + (sh.b[2] - sh.b[1]) + '}{0}') + ': undefined. The line is vertical, ' + t('x=' + x) + ', and has no ' + t('y=mx+b') + ' form.', ['Work out the run.'], 'why vertical');
          } },
          { id: 'e6d', level: 'EMG', make: function (r, sh) { return horizPart2([sh.c[0], 0], [sh.c[1], 0]); } },
          { id: 'e6e', sub: 'c (name)', level: 'BEG', make: function (r, sh) {
            return mc(r, 'The line through ' + t(ptT(sh.c[0], 0)) + ' and ' + t(ptT(sh.c[1], 0)) + ' is ' + t('y=0') + '. What is this line usually called?', [
              { html: 'The ' + t('x') + '-axis', right: true }, { html: 'The ' + t('y') + '-axis', why: 'The ' + t('y') + '-axis is vertical, ' + t('x=0') + '. ' + t('y=0') + ' is horizontal.' },
              { html: 'The origin', why: 'The origin is a single point, ' + t('(0,\\ 0)') + ', not a line.' }, { html: 'A vertical line', why: 'Every point has ' + t('y=0') + ': the line is horizontal.' }],
              'Every point has ' + t('y=0') + ': the horizontal line through the origin — the ' + t('x') + '-axis.', ['Where are all the points with ' + t('y=0') + '?'], 'name y=0', true);
          } },
          { id: 'e6f', sub: 'd', level: 'EMG', make: function (r, sh) {
            return LP('Both points ' + t(ptT(0, sh.d[0])) + ' and ' + t(ptT(0, sh.d[1])) + ' are on the ' + t('y') + '-axis — so is the line the ' + t('y') + '-axis? Give its equation.', { x: 0 }, { wrong: [{ is: { y: 0 }, code: 'line-vh', hint: t('y=0') + ' is the ' + t('x') + '-axis. Both points have ' + t('x=0') + '.' }, { is: { y: sh.d[0] }, code: 'line-vh', hint: 'Both points have the same <b>' + t('x') + '</b>-coordinate, ' + t(0) + ', so the line is vertical.' }] },
              'Both points have ' + t('x=0') + ', so the run is ' + t(0) + ' and the line is vertical through the origin — yes, it is the ' + t('y') + '-axis: ' + t('x=0') + '. (Note that ' + t('x=0') + ' is <b>not</b> of the form ' + t('y=mx+b') + '.)', ['What do the two points have in common?'], 'y-axis');
          } }] },
      { num: '7', stem: 'Each graph below shows a line with two lattice points marked. Read the two points off the grid, then determine the slope, ' + t('b') + ' and the equation of the line.', parts: [
        { id: 'e7a', level: 'PRG', make: function (r) {
          var o = until(function () { var m = r.pick([[2, 3], [1, 2], [3, 4], [1, 3], [3, 2]]), b = nz(r, -3, 3), x1 = -m[1] * r.int(1, 2), x2 = m[1] * r.int(1, 2); return { m: m, b: b, A: onL(m, b, x1), Bq: onL(m, b, x2) }; }, function (o) { return Math.abs(o.A[1]) <= 5 && Math.abs(o.Bq[1]) <= 5 && o.A[0] >= -5 && o.Bq[0] <= 5; });
          return gridTwo(o, BLUE);
        } },
        { id: 'e7b', level: 'PRG', make: function (r) {
          var o = until(function () { var m = r.pick([[-1, 2], [-2, 3], [-1, 3], [-3, 4], [-3, 2]]), b = r.pick([0, 0, -1, 1, 2]), x1 = -m[1] * r.int(1, 2), x2 = m[1] * r.int(1, 2); return { m: m, b: b, A: onL(m, b, x1), Bq: onL(m, b, x2) }; }, function (o) { return Math.abs(o.A[1]) <= 5 && Math.abs(o.Bq[1]) <= 5 && o.A[0] >= -5 && o.Bq[0] <= 5; });
          return gridTwo(o, RED);
        } }] },
      { num: '8', stem: 'Each table gives only <i>two</i> rows of a linear relation. Determine the equation of the relation, then use it to answer the extra question.', parts: [
        { id: 'e8a', level: 'PRG', make: function (r) { var m = -r.int(2, 3), b = r.int(1, 7), x1 = -r.int(2, 5), x2 = r.int(3, 7), x3 = x2 + r.int(3, 7); return tableTwo(m, b, x1, x2, x3); } },
        { id: 'e8b', level: 'PRG', make: function (r) { var m = r.pick([[2, 3], [1, 2], [3, 4], [1, 3]]), b = r.int(1, 6), x1 = -m[1] * r.int(2, 3), x2 = m[1] * r.int(1, 2), x3 = x2 + m[1] * r.int(2, 3); return tableTwo(m, b, x1, x2, x3); } }] },

      { num: '9', section: 'Extra practice C — Applications and checking', stem: function (sh) { return 'A print shop charges a fixed set-up fee plus a constant amount per item. An order of ' + t(sh.n1) + ' items costs ' + t('\\$' + sh.c1) + ' and an order of ' + t(sh.n2) + ' items costs ' + t('\\$' + sh.c2) + '. Let ' + t('C') + ' be the cost in dollars for ' + t('n') + ' items.'; },
        shared: function (r) { return until(function () { var k = r.int(2, 6), F = r.pick([8, 10, 12, 15, 20]), n1 = r.int(3, 6), n2 = n1 + r.int(4, 8), n3 = n2 + r.int(3, 10), C4 = r.int(15, 30) * 5; return { k: k, F: F, n1: n1, n2: n2, n3: n3, c1: k * n1 + F, c2: k * n2 + F, C4: C4, n4: (C4 - F) / k }; }, function (o) { return Number.isInteger(o.n4) && o.n4 > o.n2 && o.k !== o.F; }); },
        parts: [
          { id: 'e9a', level: 'PRG', make: function (r, sh) { return tpPart([sh.n1, sh.c1], [sh.n2, sh.c2], { prompt: 'Determine the equation relating ' + t('C') + ' and ' + t('n') + '.', vars: ['n', 'C'], text: 'print shop equation' }); } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) {
            return mc(r, 'Interpret the slope and the ' + t('C') + '-intercept in the context of this print shop.', [
              { html: 'Slope ' + t(sh.k) + ': each additional item costs ' + t('\\$' + sh.k) + '. ' + t('C') + '-intercept ' + t(sh.F) + ': a fixed set-up fee of ' + t('\\$' + sh.F) + ', charged even for ' + t(0) + ' items.', right: true },
              { html: 'Slope ' + t(sh.F) + ': the set-up fee. ' + t('C') + '-intercept ' + t(sh.k) + ': the cost per item.', why: 'The slope multiplies ' + t('n') + ', so it is the cost per item; the intercept is the cost at ' + t('n=0') + '.' },
              { html: 'Slope ' + t(sh.k) + ': the cost of the first item. ' + t('C') + '-intercept ' + t(sh.F) + ': the number of items included free.', why: 'The intercept is a cost in dollars (a value of ' + t('C') + '), not a number of items.' },
              { html: 'Slope ' + t(sh.k) + ': the number of items per dollar. ' + t('C') + '-intercept ' + t(sh.F) + ': the set-up fee.', why: 'Slope = change in cost ÷ change in items: dollars <b>per item</b>.' }],
              'Slope ' + t(sh.k) + ': the cost goes up ' + t('\\$' + sh.k) + ' for each extra item. ' + t('C') + '-intercept ' + t(sh.F) + ': the cost for ' + t(0) + ' items — the fixed set-up fee.', ['Units of the slope: dollars ÷ items. The intercept: ' + t('C') + ' when ' + t('n=0') + '.'], 'meaning print shop');
          } },
          { id: 'e9c', level: 'EMG', make: function (r, sh) { return predictPart('Predict the cost of an order of ' + t(sh.n3) + ' items.', [sh.k, 1], sh.F, sh.n3, [sh.n2, sh.c2], 'n', 'C', { before: '\\$' }, 'print predict'); } },
          { id: 'e9d', level: 'PRG', make: function (r, sh) {
            return numPart('How many items can be ordered for exactly ' + t('\\$' + sh.C4) + '?', sh.n4, [[sh.C4 / sh.k, 'u72-fee', 'Take off the set-up fee first: ' + t(sh.C4 + '-' + sh.F) + '.'], [(sh.C4 + sh.F) / sh.k, 'u7l6-solve-n', 'Undo the ' + t('+' + sh.F) + ' by <b>subtracting</b> it.'], [sh.k * sh.C4 + sh.F, 'u7l6-solve-n', t(sh.C4) + ' is the cost ' + t('C') + ': solve ' + t(sh.C4 + '=' + sh.k + 'n+' + sh.F) + ' for ' + t('n') + '.']],
              t(sh.C4 + '=' + sh.k + 'n+' + sh.F + '\\ \\Rightarrow\\ ' + sh.k + 'n=' + (sh.C4 - sh.F) + '\\ \\Rightarrow\\ n=' + sh.n4) + ' items.', ['Set ' + t('C=' + sh.C4) + ' and solve for ' + t('n') + '.'], 'print solve n', { after: 'items' });
          } }] },
      { num: '10', stem: function (sh) { return 'A pool is being filled at a constant rate. After ' + t(sh.t1) + ' minutes it holds ' + t(sh.v1) + ' L; after ' + t(sh.t2) + ' minutes it holds ' + t(sh.v2) + ' L. Let ' + t('V') + ' be the volume in litres after ' + t('t') + ' minutes.'; },
        shared: function (r) { return until(function () { var m = r.pick([[25, 2], [15, 2], [35, 2], [20, 3], [40, 3]]), V0 = r.int(4, 20) * 10, t1 = m[1] * r.int(1, 3), t2 = t1 + m[1] * r.int(1, 3), t3 = m[1] * r.int(4, 10), t4 = m[1] * r.int(4, 12); var f = function (x) { return V0 + m[0] * x / m[1]; }; return { m: m, V0: V0, t1: t1, t2: t2, v1: f(t1), v2: f(t2), t3: t3, v3: f(t3), t4: t4, v4: f(t4) }; }, function (o) { return o.t3 !== o.t4 && o.t3 > o.t2 && o.t4 > o.t2 && (o.t2 - o.t1) % 1 === 0 && (o.v2 - o.v1) % (o.t2 - o.t1) !== 0; }); },
        parts: [
          { id: 'e10a', level: 'PRG', make: function (r, sh) { return tpPart([sh.t1, sh.v1], [sh.t2, sh.v2], { prompt: 'Determine the equation relating ' + t('V') + ' and ' + t('t') + '. The slope is not a whole number — keep it exact.', vars: ['t', 'V'], exact: true, text: 'pool equation' }); } },
          { id: 'e10b', sub: 'a (meaning)', level: 'EMG', make: function (r, sh) {
            var mT = nT(sh.m);
            return mc(r, 'What do the slope and the ' + t('V') + '-intercept mean here?', [
              { html: 'The pool fills at ' + t(mT + '=' + fv(sh.m)) + ' L per minute, and it already held ' + t(sh.V0) + ' L when the timing began.', right: true },
              { html: 'The pool fills at ' + t(mT) + ' L per minute, and it will hold ' + t(sh.V0) + ' L when it is full.', why: 'The ' + t('V') + '-intercept is the volume at ' + t('t=0') + ', at the start of the timing — not when it is full.' },
              { html: 'It takes ' + t(mT) + ' minutes to add one litre, and the pool started empty.', why: 'Slope = litres ÷ minutes: litres <b>per minute</b>. And at ' + t('t=0') + ' the pool held ' + t(sh.V0) + ' L, not ' + t(0) + '.' },
              { html: 'The pool held ' + t(mT) + ' L at the start and fills at ' + t(sh.V0) + ' L per minute.', why: 'The rate is the slope (the number multiplying ' + t('t') + '); the starting volume is the intercept.' }],
              'Slope ' + t(mT + '=' + fv(sh.m)) + ' litres per minute: the filling rate. ' + t('V') + '-intercept ' + t(sh.V0) + ': the volume at ' + t('t=0') + ' — water already in the pool when the timing began.', ['The slope is litres per minute; the intercept is the volume at ' + t('t=0') + '.'], 'meaning pool');
          } },
          { id: 'e10c', sub: 'b', level: 'PRG', make: function (r, sh) {
            var fields = [fld('volume after ' + t(sh.t3) + ' min', { after: 'L' }), fld('time when it holds ' + t(sh.v4) + ' L', { after: 'min' })];
            var p = B.fields('Predict the volume after ' + t(sh.t3) + ' minutes, and determine when the pool holds ' + t(sh.v4) + ' L.', fields,
              [K.number(sh.v3, function (v) { return near(v, fv(sh.m) * sh.t3) ? { code: 'u72-fee', hint: 'Add the starting volume ' + t(sh.V0) + ' L too.' } : null; }), K.number(sh.t4, function (v) { return near(v, sh.v4 / fv(sh.m)) ? { code: 'u72-fee', hint: 'Take off the starting volume first: ' + t(sh.v4 + '-' + sh.V0) + '.' } : near(v, (sh.v4 - sh.V0) * fv(sh.m)) ? { code: 'u7l6-solve-n', hint: 'Divide by the rate ' + t(nT(sh.m)) + ' (multiply by ' + t(nT(fInv(sh.m))) + ').' } : null; })],
              [String(sh.v3), String(sh.t4)], t(sh.v3) + ' L; after ' + t(sh.t4) + ' minutes',
              t('V=' + nT(sh.m) + '(' + sh.t3 + ')+' + sh.V0 + '=' + (sh.v3 - sh.V0) + '+' + sh.V0 + '=' + sh.v3) + ' L.<br>' + t(sh.v4 + '=' + nT(sh.m) + 't+' + sh.V0 + '\\ \\Rightarrow\\ ' + nT(sh.m) + 't=' + (sh.v4 - sh.V0) + '\\ \\Rightarrow\\ t=' + (sh.v4 - sh.V0) + '\\times ' + nT(fInv(sh.m)) + '=' + sh.t4) + ' minutes.',
              ['Substitute ' + t('t=' + sh.t3) + ' for the first box.', 'For the second, set ' + t('V=' + sh.v4) + ' and solve for ' + t('t') + '.'], 'pool volume and time');
            p.bad = [[String(sh.v3 - sh.V0), String(sh.t4)], [String(sh.v3), String(sh.t4 + 1)]];
            return p;
          } }] },
      { num: '11', stem: '<b>Check both points.</b> Determine the equation of each line, then verify it by substituting <i>both</i> of the original points.', parts: [
        { id: 'e11a', level: 'PRG', make: function (r) { var m = -r.int(2, 4), b = nz(r, -5, 5); return tpBoth(onL([m, 1], b, -r.int(5, 8)), onL([m, 1], b, r.int(3, 6))); } },
        { id: 'e11b', level: 'PRG', make: function (r) { var m = r.pick([[3, 2], [5, 4], [2, 3], [3, 4]]), b = nz(r, -6, 6); return tpBoth(onL(m, b, -m[1] * r.int(2, 4)), onL(m, b, m[1] * r.int(1, 3))); } }] },

      { num: '12', section: 'Extra practice D — Error analysis, working backwards and stretch', stem: '<b>Error analysis.</b>', shared: function (r) {
          var j = until(function () { var m = -r.int(2, 4), b = r.int(1, 6), A = onL([m, 1], b, -r.int(1, 3)), Bq = onL([m, 1], b, r.int(2, 5)); return { m: m, b: b, A: A, Bq: Bq }; }, function (o) { return o.A[1] !== 0; });
          var o = until(function () { var m = r.int(2, 4), b = -r.int(4, 12), A = onL([m, 1], b, r.int(1, 4)), Bq = onL([m, 1], b, r.int(5, 9)); return { m: m, b: b, A: A, Bq: Bq }; }, function (o) { return o.A[1] < 0 && o.Bq[1] > 0; });
          return { j: j, o: o };
        },
        parts: [
          { id: 'e12a', sub: 'a(i)', level: 'EMG', make: function (r, sh) {
            var j = sh.j, A = j.A, Bq = j.Bq, wm = (Bq[1] - A[1]) / (A[0] - Bq[0]);
            return mc(r, 'For the line through ' + t(ptT(A[0], A[1])) + ' and ' + t(ptT(Bq[0], Bq[1])) + ', Jaya wrote ' + t('m=\\frac{' + sub(Bq[1], A[1]) + '}{' + sub(A[0], Bq[0]) + '}=\\frac{' + (Bq[1] - A[1]) + '}{' + (A[0] - Bq[0]) + '}=' + wm) + ', then found ' + t('b') + '. What is her mistake?', [
              { html: 'She subtracted the ' + t('y') + '’s as ' + t('y_2-y_1') + ' but the ' + t('x') + '’s as ' + t('x_1-x_2') + '. Mixing the order flips the sign of the slope.', right: true },
              { html: 'She put the run on top and the rise on the bottom.', why: 'Her top is a difference of ' + t('y') + '-values — that part is right. Compare the <b>order</b> of the subtractions.' },
              { html: 'She should have added the coordinates instead of subtracting.', why: 'Slope always uses differences. The problem is the order.' },
              { html: 'There is no mistake in her slope.', why: 'The line falls from ' + t(ptT(A[0], A[1])) + ' to ' + t(ptT(Bq[0], Bq[1])) + ', so its slope must be negative.' }],
              'She used ' + t('y_2-y_1') + ' on top but ' + t('x_1-x_2') + ' on the bottom. Correctly ' + slopeSol(A, Bq) + '.', ['Is the same point first on the top and on the bottom?'], 'Jaya error');
          } },
          { id: 'e12b', sub: 'a(ii)', level: 'EMG', make: function (r, sh) {
            var j = sh.j, A = j.A, Bq = j.Bq, wm = -j.m, wb = A[1] - wm * A[0], v = wm * Bq[0] + wb;
            return numPart('Jaya’s equation is ' + t(SI(wm, wb)) + '. Show that it fails the check at ' + t(ptT(Bq[0], Bq[1])) + ': what ' + t('y') + '-value does it give at ' + t('x=' + Bq[0]) + '?', v, [[Bq[1], 'u7l6-his', 'Substitute into <b>Jaya’s</b> equation, ' + t(SI(wm, wb)) + ' — it won’t give ' + t(Bq[1]) + '.']],
              t('y=' + evalT([wm, 1], Bq[0], [wb, 1]) + '=' + v) + ', not ' + t(Bq[1]) + ' ✗.', ['Substitute ' + t('x=' + Bq[0]) + ' into her equation.'], 'Jaya check', { before: 'y=' });
          } },
          { id: 'e12c', sub: 'a(iii)', level: 'EMG', make: function (r, sh) { return tpPart(sh.j.A, sh.j.Bq, { prompt: 'Give the correct equation for Jaya’s line, through ' + t(ptT(sh.j.A[0], sh.j.A[1])) + ' and ' + t(ptT(sh.j.Bq[0], sh.j.Bq[1])) + '.' }); } },
          { id: 'e12d', sub: 'b(i)', level: 'EMG', make: function (r, sh) {
            var o = sh.o, A = o.A, Bq = o.Bq, run = Bq[0] - A[0], rise = Bq[1] - A[1], wm = fr(run, rise);
            return mc(r, 'For the line through ' + t(ptT(A[0], A[1])) + ' and ' + t(ptT(Bq[0], Bq[1])) + ', Omar wrote ' + t('m=\\frac{' + sub(Bq[0], A[0]) + '}{' + sub(Bq[1], A[1]) + '}=\\frac{' + run + '}{' + rise + '}=' + nT(wm)) + '. What is his mistake?', [
              { html: 'He put the run (change in ' + t('x') + ') on top and the rise (change in ' + t('y') + ') on the bottom. Slope is ' + t('\\frac{\\Delta y}{\\Delta x}') + '.', right: true },
              { html: 'He subtracted in mixed order.', why: 'Both subtractions start with the second point — the order is consistent. Look at which change is on top.' },
              { html: 'He forgot to reduce the fraction.', why: t(nT(wm)) + ' is reduced. The problem is that the fraction is upside down.' },
              { html: 'There is no mistake in his slope.', why: 'From ' + t(ptT(A[0], A[1])) + ' to ' + t(ptT(Bq[0], Bq[1])) + ' the line rises ' + t(rise) + ' for a run of ' + t(run) + ': slope ' + t(nT(fr(rise, run))) + '.' }],
              'He put ' + t('\\Delta x') + ' over ' + t('\\Delta y') + '. Correctly ' + slopeSol(A, Bq) + '.', ['Which change goes on top in the slope formula?'], 'Omar error');
          } },
          { id: 'e12e', sub: 'b(ii)', level: 'EMG', make: function (r, sh) {
            var o = sh.o, A = o.A, Bq = o.Bq, wm = fr(Bq[0] - A[0], Bq[1] - A[1]), wb = bOf(wm, A[0], A[1]), v = fAdd(fMul(wm, Bq[0]), wb);
            return valPart('Omar’s equation is ' + t(SI(wm, wb)) + '. Show that it fails the check at ' + t(ptT(Bq[0], Bq[1])) + ': what ' + t('y') + '-value does it give at ' + t('x=' + Bq[0]) + '?', v, [[Bq[1], 'u7l6-his', 'Substitute into <b>Omar’s</b> equation — it won’t give ' + t(Bq[1]) + '.']],
              t('y=' + evalT(wm, Bq[0], wb) + '=' + nT(v)) + ', not ' + t(Bq[1]) + ' ✗.', ['Substitute ' + t('x=' + Bq[0]) + ' into his equation. The answer may be a fraction.'], 'Omar check', { keys: 'eq', before: t('y=') });
          } },
          { id: 'e12f', sub: 'b(iii)', level: 'EMG', make: function (r, sh) { return tpPart(sh.o.A, sh.o.Bq, { prompt: 'Give the correct equation for Omar’s line, through ' + t(ptT(sh.o.A[0], sh.o.A[1])) + ' and ' + t(ptT(sh.o.Bq[0], sh.o.Bq[1])) + '.' }); } }] },
      { num: '13', stem: '<b>Work backwards.</b> Set up an equation for the unknown in each part and solve it.', parts: [
        { id: 'e13a', level: 'BEG', make: function (r) { var m = r.int(2, 5), x0 = r.int(1, 4), b = nz(r, -6, 6), y0 = m * x0 + b; return spPart([m, 1], x0, y0, { prompt: 'A line through ' + t(ptT(x0, y0)) + ' has equation ' + t('y=' + m + 'x+b') + '. Determine ' + t('b') + ', then write the equation.' }); } },
        { id: 'e13b', level: 'PRG', make: function (r) { var m = r.int(2, 4), x1 = r.int(1, 3), y1 = r.int(1, 6), k = x1 + r.int(2, 4), y2 = y1 + m * (k - x1); return unknownPart('A line through ' + t(ptT(x1, y1)) + ' and ' + t('(k,\\ ' + y2 + ')') + ' has slope ' + t(m) + '. Determine ' + t('k') + '.', 'k', k, [x1, y1], [k, y2], [m, 1], 'x'); } },
        { id: 'e13c', level: 'ADV', make: function (r) { var m = r.pick([[-1, 2], [-1, 4], [-3, 4], [1, 2]]), x1 = -r.int(1, 4), x2 = x1 + m[1] * r.int(1, 2) * 2, y2 = nz(r, -6, 6), c = y2 - fv(m) * (x2 - x1); return unknownPart('A line through ' + t('(' + x1 + ',\\ c)') + ' and ' + t(ptT(x2, y2)) + ' has slope ' + t(nT(m)) + '. Determine ' + t('c') + '.', 'c', c, [x1, c], [x2, y2], m, 'y1'); } },
        { id: 'e13d', level: 'ADV', make: function (r) { var m = r.pick([[3, 4], [2, 3], [5, 4], [3, 2]]), x1 = -r.int(2, 6), x2 = x1 + m[1] * r.int(1, 3), y1 = nz(r, -5, 5), tt = y1 + fv(m) * (x2 - x1); return unknownPart('A line through ' + t(ptT(x1, y1)) + ' and ' + t('(' + x2 + ',\\ t)') + ' has slope ' + t(nT(m)) + '. Determine ' + t('t') + '.', 't', tt, [x1, y1], [x2, tt], m, 'y2'); } }] },
      { num: '14', stem: '<b>Work backwards, continued.</b>', parts: [
        { id: 'e14a', level: 'ADV', make: function (r) {
          var o = until(function () { var m = r.pick([[3, 4], [2, 3], [3, 5], [4, 3]]), A = [-m[1] - r.int(0, 2), -r.int(2, 9)]; var k = r.int(2, 3), Bq = [A[0] + m[1] * k, A[1] + m[0] * k]; var b = bOf(m, A[0], A[1]); return { m: m, A: A, Bq: Bq, b: b }; }, function (o) { return !isInt(o.b) && !isInt(fDiv(fNeg(o.b), o.m)); });
          return intTwo(o.A, o.Bq);
        } },
        { id: 'e14b', level: 'MAS', make: function (r) {
          var o = until(function () { var b = r.int(1, 8), m = nz(r, -3, 3), x1 = -r.int(1, 4), x2 = r.int(2, 8); return { b: b, m: m, A: [x1, m * x1 + b], x2: x2, q: m * x2 + b }; }, function (o) { return o.A[1] !== o.b && o.q !== 0 && o.q !== o.b; });
          var A = o.A, b = o.b, m = o.m;
          return valPart('A line passes through ' + t(ptT(A[0], A[1])) + ' and ' + t('(' + o.x2 + ',\\ q)') + ', and its ' + t('y') + '-intercept is ' + t(b) + '. Determine the value of ' + t('q') + '.', [o.q, 1], [[-o.q, 'sign', 'Check the sign of the slope: from ' + t(ptT(0, b)) + ' to ' + t(ptT(A[0], A[1])) + '.'], [b + A[1], 'u7l6-unknown', 'Use ' + t('y=mx+b') + ': ' + t('q=m(' + o.x2 + ')+' + b) + '.'], [fv(fAdd(fMul(fr(A[0], A[1] - b), o.x2), [b, 1])), 'line-slope-flip', 'Slope is rise over run: ' + t('\\frac{' + sub(A[1], b) + '}{' + sub(A[0], 0) + '}') + '.'], [m * o.x2, 'u72-fee', 'Add ' + t('b=' + b) + ' too.']],
            'The ' + t('y') + '-intercept gives a second point, ' + t(ptT(0, b)) + '. ' + slopeSol([0, b], A) + '.<br>So ' + t(SI(m, b)) + ', and at ' + t('x=' + o.x2) + ': ' + t('q=' + evalT([m, 1], o.x2, [b, 1]) + '=' + o.q) + '.',
            ['The ' + t('y') + '-intercept is a point too: ' + t(ptT(0, b)) + '. Use it with ' + t(ptT(A[0], A[1])) + ' to find the slope.', 'Then write the equation and substitute ' + t('x=' + o.x2) + '.'], 'find q', { keys: 'eq', before: t('q=') });
        } }] },
      { num: '15', stem: function (sh) { return '<b>Stretch — three points.</b> Consider ' + t('A' + ptT(sh.A[0], sh.A[1])) + ', ' + t('B' + ptT(sh.B[0], sh.B[1])) + ' and ' + t('C' + ptT(sh.C[0], sh.C[1])) + '.'; },
        shared: function (r) { var m = r.int(2, 3) * (r.chance(0.3) ? -1 : 1), b = nz(r, -5, 5), xa = -r.int(3, 6), xb = r.int(0, 2), xc = xb + r.int(2, 4), yt = until(function () { return nz(r, -9, 9); }, function (y) { return (y - b) % m === 0 && [xa, xb, xc].indexOf((y - b) / m) < 0; }); return { m: m, b: b, A: [xa, m * xa + b], B: [xb, m * xb + b], C: [xc, m * xc + b], yt: yt, p: (yt - b) / m }; },
        parts: [
          { id: 'e15a', level: 'EMG', outcome: 'RF3', make: function (r, sh) {
            var fields = [fld(t('m_{AB}'), { keys: 'slope' }), fld(t('m_{BC}'), { keys: 'slope' })];
            var p = B.fields('Show that ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ' are collinear by comparing slopes: find ' + t('m_{AB}') + ' and ' + t('m_{BC}') + '.', fields, [K.slope([sh.m, 1]), K.slope([sh.m, 1])], [String(sh.m), String(sh.m)], t('m_{AB}=m_{BC}=' + sh.m),
              t('m_{AB}=') + slopeSol(sh.A, sh.B).replace(/^\\\(m=/, '\\(') + ', ' + t('m_{BC}=') + slopeSol(sh.B, sh.C).replace(/^\\\(m=/, '\\(') + '. The slopes are equal and the segments share the point ' + t('B') + ', so all three points lie on one line.', [H_2P[0].split(' Step 2')[0]], 'collinear slopes');
            p.bad = [[String(-sh.m), String(sh.m)]];
            return p;
          } },
          { id: 'e15b', level: 'PRG', make: function (r, sh) { return tpPart(sh.A, sh.B, { prompt: 'Write the single equation, in the form ' + t('y=mx+b') + ', of the line containing all three points.' }); } },
          { id: 'e15c', level: 'ADV', make: function (r, sh) {
            return numPart('Determine ' + t('p') + ' so that ' + t('(p,\\ ' + sh.yt + ')') + ' also lies on this line.', sh.p, [[sh.m * sh.yt + sh.b, 'u7l5-swap-xy', t(sh.yt) + ' is the <b>' + t('y') + '</b>-value: set ' + t('y=' + sh.yt) + ' and solve for ' + t('x=p') + '.'], [(sh.yt + sh.b) / sh.m, 'u7l5-solve', 'Undo the ' + t((sh.b < 0 ? '' : '+') + sh.b) + ' with the opposite operation first.'], [-sh.p, 'sign', 'Check the signs as you solve.']],
              t(sh.yt + '=' + sh.m + 'p' + (sh.b < 0 ? '' : '+') + sh.b + '\\ \\Rightarrow\\ ' + (sh.yt - sh.b) + '=' + sh.m + 'p\\ \\Rightarrow\\ p=' + sh.p) + '.', ['Substitute ' + t('x=p') + ' and ' + t('y=' + sh.yt) + ' into the equation from (b), then solve for ' + t('p') + '.'], 'find p', { before: 'p=' });
          } }] },
      { num: '16', stem: function (sh) { return '<b>Stretch — midpoints.</b> Segment ' + t('PQ') + ' joins ' + t('P' + ptT(sh.P[0], sh.P[1])) + ' to ' + t('Q' + ptT(sh.Q[0], sh.Q[1])) + '. Segment ' + t('RS') + ' joins ' + t('R' + ptT(sh.R[0], sh.R[1])) + ' to ' + t('S' + ptT(sh.S[0], sh.S[1])) + '.'; },
        shared: function (r) {
          return until(function () {
            var M1 = [-r.int(1, 4), r.int(1, 6)], M2 = [r.int(1, 6), -r.int(1, 6)], u = [r.int(1, 4), r.int(1, 4)], v = [r.int(1, 4), r.int(1, 3)];
            return { M1: M1, M2: M2, P: [M1[0] - u[0], M1[1] - u[1]], Q: [M1[0] + u[0], M1[1] + u[1]], R: [M2[0] - v[0], M2[1] - v[1]], S: [M2[0] + v[0], M2[1] + v[1]] };
          }, function (o) { var m = slope2(o.M1, o.M2); return !isInt(m) && Math.abs(m[1]) <= 8 && !isInt(bOf(m, o.M1[0], o.M1[1])); });
        },
        parts: [
          { id: 'e16a', level: 'EMG', outcome: 'RF3', make: function (r, sh) {
            var mid = function (A, Bq) { return [(A[0] + Bq[0]) / 2, (A[1] + Bq[1]) / 2]; };
            var fields = [fld('midpoint of ' + t('PQ'), { keys: 'pairs', placeholder: '(x, y)' }), fld('midpoint of ' + t('RS'), { keys: 'pairs', placeholder: '(x, y)' })];
            var mc1 = function (M, A, Bq) { var c = K.pairs([M]); return function (resp) { var res = c(resp); if (res.v === 'wrong' && K.pairs([[Bq[0] - A[0], Bq[1] - A[1]]])(resp).v === 'correct') return wrong('u72-mid', 'You subtracted. The midpoint <b>averages</b> the coordinates: add them and divide by ' + t(2) + '.'); if (res.v === 'wrong' && K.pairs([[A[0] + Bq[0], A[1] + Bq[1]]])(resp).v === 'correct') return wrong('u72-mid', 'Divide each sum by ' + t(2) + '.'); return res; }; };
            var p = B.fields('Determine the midpoint of ' + t('PQ') + ' and the midpoint of ' + t('RS') + '.', fields, [mc1(sh.M1, sh.P, sh.Q), mc1(sh.M2, sh.R, sh.S)], [ptK(sh.M1[0], sh.M1[1]), ptK(sh.M2[0], sh.M2[1])], t(ptT(sh.M1[0], sh.M1[1])) + ' and ' + t(ptT(sh.M2[0], sh.M2[1])),
              'Midpoint of ' + t('PQ') + ': ' + t('\\left(\\frac{' + sh.P[0] + '+' + pT(sh.Q[0]) + '}{2},\\ \\frac{' + sh.P[1] + '+' + pT(sh.Q[1]) + '}{2}\\right)=' + ptT(sh.M1[0], sh.M1[1])) + '.<br>Midpoint of ' + t('RS') + ': ' + t('\\left(\\frac{' + sh.R[0] + '+' + pT(sh.S[0]) + '}{2},\\ \\frac{' + sh.R[1] + '+' + pT(sh.S[1]) + '}{2}\\right)=' + ptT(sh.M2[0], sh.M2[1])) + '.',
              ['Midpoint: ' + t('\\left(\\frac{x_1+x_2}{2},\\ \\frac{y_1+y_2}{2}\\right)') + '.'], 'two midpoints');
            p.bad = [[ptK(sh.M2[0], sh.M2[1]), ptK(sh.M1[0], sh.M1[1])], [ptK(sh.Q[0] - sh.P[0], sh.Q[1] - sh.P[1]), ptK(sh.M2[0], sh.M2[1])]];
            return p;
          } },
          { id: 'e16b', level: 'MAS', make: function (r, sh) { return tpPart(sh.M1, sh.M2, { prompt: 'Determine the equation of the line through those two midpoints. Leave ' + t('m') + ' and ' + t('b') + ' exact.', exact: true, text: 'line through midpoints' }); } }] },
      { num: '17', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e17', level: 'EMG', make: function (r) {
          var o = until(function () { var m = -r.int(2, 3), b = nz(r, -4, 4), x1 = -r.int(4, 7), x2 = r.int(1, 3); return { m: m, b: b, A: onL([m, 1], b, x1), Bq: onL([m, 1], b, x2) }; }, function (o) { var bb = bOf([-o.m, 1], o.A[0], o.A[1]); return fv(bb) !== o.b && fv(bOf([fr(1, o.m)[0], fr(1, o.m)[1]], o.A[0], o.A[1])) !== o.b && Math.abs(fv(bb)) <= 40; });
          var m = o.m, bs = fv(bOf([-m, 1], o.A[0], o.A[1])), fm = fr(1, m), bf = bOf(fm, o.A[0], o.A[1]);
          return mc(r, 'The equation of the line through ' + t(ptT(o.A[0], o.A[1])) + ' and ' + t(ptT(o.Bq[0], o.Bq[1])) + ' is', uniqOpts([
            { html: t(SI(m, bs)), why: 'That line has slope ' + t(-m) + ', but this line falls from left to right. Subtract in the same order on top and bottom.' },
            { html: t(SI(-m, bs)), why: 'Check the slope: ' + slopeSol(o.A, o.Bq) + '.' },
            { html: t(SI(m, o.b)), right: true },
            { html: t(SI(fm, bf)), why: 'That slope is run over rise. Slope is ' + t('\\frac{\\Delta y}{\\Delta x}') + '.' }]),
            '<b>Step 1.</b> ' + slopeSol(o.A, o.Bq) + '.<br><b>Step 2.</b> ' + subSol([m, 1], o.A[0], o.A[1]) + '<br>' + t(SI(m, o.b)) + '.', H_2P, 'MC two points', true);
        } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e18', level: 'PRG', make: function (r) {
          var o = until(function () { var m = r.int(2, 4), b = nz(r, -6, 6), x1 = -r.int(2, 5), x2 = r.int(3, 7); return { m: m, b: b, A: onL([m, 1], b, x1), Bq: onL([m, 1], b, x2), ans: m - b }; }, function (o) { return o.ans >= 0 && o.ans !== o.m + o.b; });
          return nrPart('The line through ' + t(ptT(o.A[0], o.A[1])) + ' and ' + t(ptT(o.Bq[0], o.Bq[1])) + ' is written as ' + t('y=mx+b') + '. The value of ' + t('m-b') + ' is ________.', o.ans, [[o.m + o.b, 'sign', 'Subtract: ' + t('m-b') + '.'], [o.b - o.m, 'sign', t('m-b') + ' means ' + t('m') + ' minus ' + t('b') + '.']],
            '<b>Step 1.</b> ' + slopeSol(o.A, o.Bq) + '.<br><b>Step 2.</b> ' + subSol([o.m, 1], o.A[0], o.A[1]) + '<br>' + t('m-b=' + o.m + '-' + pT(o.b) + '=' + o.ans) + '.', H_2P, 'NR m-b');
        } }] }
    ]
  });

  /* ---------------- makers used above (function declarations are hoisted) ---------------- */
  function tpCheck(A, Bp) {
    var m = slope2(A, Bp), b = bOf(m, A[0], A[1]);
    var lw = [{ is: L(fNeg(m), bOf(fNeg(m), A[0], A[1])), code: 'u7l6-order', hint: 'Check the sign of the slope: subtract in the same order on the top and the bottom.' }, { is: L(m, fAdd([A[1], 1], fMul(m, A[0]))), code: 'u72-b-solve', hint: 'Check how you solved for ' + t('b') + '.' }];
    var fields = [fld('equation', { wide: true, placeholder: 'y = …' }), fld('check: ' + t('x=' + Bp[0]), { before: t('y='), placeholder: 'number' })];
    var p = B.fields(t(ptT(A[0], A[1])) + ' and ' + t(ptT(Bp[0], Bp[1])) + '. Write the equation, then substitute ' + t('x=' + Bp[0]) + ' (the second point) into it.', fields,
      [K.line(L(m, b), { form: 'slope-intercept', wrong: lw }), K.number(Bp[1], function (v) { return { code: 'u7l5-check', hint: 'If your equation is right, substituting ' + t('x=' + Bp[0]) + ' gives the second point’s ' + t('y') + '-coordinate. Recheck your slope and ' + t('b') + '.' }; })],
      [SI(m, b), String(Bp[1])], t(SI(m, b)) + '; check: ' + t('y=' + Bp[1]),
      '<b>Step 1.</b> ' + slopeSol(A, Bp) + '.<br><b>Step 2.</b> ' + subSol(m, A[0], A[1]) + '<br>' + t(SI(m, b)) + '.<br><b>Check.</b> ' + t('x=' + Bp[0] + ':\\ y=' + evalT(m, Bp[0], b) + '=' + Bp[1]) + ', the second point’s ' + t('y') + '-coordinate ✓', H_2P, 'two points + check');
    p.bad = [[SI(fNeg(m), bOf(fNeg(m), A[0], A[1])), String(Bp[1])]];
    if (Bp[0] !== Bp[1]) p.bad.push([SI(m, b), String(Bp[0])]);
    return p;
  }
  function tpBoth(A, Bp) {
    var m = slope2(A, Bp), b = bOf(m, A[0], A[1]);
    var fields = [fld('equation', { wide: true, placeholder: 'y = …' }), fld('check ' + t('x=' + A[0]), { before: t('y=') }), fld('check ' + t('x=' + Bp[0]), { before: t('y=') })];
    var cv = function (want, x) { return K.number(want, function () { return { code: 'u7l5-check', hint: 'Substitute ' + t('x=' + x) + ' into the equation: it should give that point’s ' + t('y') + '-coordinate.' }; }); };
    var p = B.fields(t(ptT(A[0], A[1])) + ' and ' + t(ptT(Bp[0], Bp[1])) + ': write the equation, then substitute each point’s ' + t('x') + '-coordinate.', fields,
      [K.line(L(m, b), { form: 'slope-intercept', wrong: [{ is: L(fNeg(m), bOf(fNeg(m), A[0], A[1])), code: 'u7l6-order', hint: 'Check the sign of the slope.' }] }), cv(A[1], A[0]), cv(Bp[1], Bp[0])],
      [SI(m, b), String(A[1]), String(Bp[1])], t(SI(m, b)) + '; ' + t('y=' + A[1]) + ' and ' + t('y=' + Bp[1]),
      '<b>Step 1.</b> ' + slopeSol(A, Bp) + '.<br><b>Step 2.</b> ' + subSol(m, A[0], A[1]) + '<br>' + t(SI(m, b)) + '.<br><b>Check both.</b> ' + t(evalT(m, A[0], b) + '=' + A[1]) + ' ✓ and ' + t(evalT(m, Bp[0], b) + '=' + Bp[1]) + ' ✓', H_2P, 'check both points');
    p.bad = [[SI(fNeg(m), bOf(fNeg(m), A[0], A[1])), String(A[1]), String(Bp[1])], [SI(m, b), String(A[1]), String(Bp[1] + 1)]];
    return p;
  }
  function yAxisPart(K0, Pq, exact) {
    var b = K0[1], m = slope2(K0, Pq);
    var p = tpPart(K0, Pq, { exact: exact, prompt: t(ptT(K0[0], K0[1])) + ' and ' + t(ptT(Pq[0], Pq[1])) });
    p.solution = t(ptT(0, b)) + ' is on the ' + t('y') + '-axis, so it is the ' + t('y') + '-intercept: ' + t('b=' + b) + ' — no solving needed.<br>' + slopeSol(K0, Pq) + '.<br>' + t(SI(m, b)) + '.<br><b>Check.</b> ' + t(evalT(m, Pq[0], [b, 1]) + '=' + Pq[1]) + ' ✓';
    p.hints = ['A point ' + t('(0,\\ k)') + ' is the ' + t('y') + '-intercept, so ' + t('b=k') + '.', 'You still need the slope: ' + t('\\frac{y_2-y_1}{x_2-x_1}') + '.'];
    return p;
  }
  function horizPart2(A, Bp) {
    var y = A[1];
    return LP(t(ptT(A[0], A[1])) + ' and ' + t(ptT(Bp[0], Bp[1])), { y: y }, { keyTex: 'y=' + y, wrong: [{ is: { x: y }, code: 'line-vh', hint: 'Both points have the same <b>' + t('y') + '</b>-coordinate, so the line is horizontal: ' + t('y=') + ' a number.' }, { is: { x: A[0] }, code: 'line-vh', hint: 'That’s a vertical line. The ' + t('y') + '-coordinates are equal, so the line is horizontal.' }] },
      t('m=\\frac{' + sub(y, y) + '}{' + sub(Bp[0], A[0]) + '}=\\frac{0}{' + (Bp[0] - A[0]) + '}=0') + ': both points have ' + t('y=' + y) + ', so the line is horizontal. ' + t('y=0x+b') + ' with ' + t('b=' + y) + ' gives ' + t('y=' + y) + '.', ['Compare the ' + t('y') + '-coordinates of the two points.'], 'horizontal pair');
  }
  function predictPart(prompt, m, b, x, Pk, X, Y, inp, text) {
    var v = fv(fAdd(fMul(m, x), [b, 1]));
    return numPart(prompt, v, [[fv(fMul(m, x)), 'u72-fee', 'Add ' + t('b=' + b) + ' too.'], [fv(fAdd(fMul(m, x - Pk[0]), [Pk[1], 1])) + b, 'u7l6-start', 'Use the equation from (a) directly: ' + t(Y + '=' + SI(m, b, [X, Y]).split('=')[1]) + '.'], [fv(fMul(m, x)) + Pk[1], 'u7l5-pred-b', 'Use ' + t('b=' + b) + ', not a reading.']],
      t(Y + '=' + evalT(m, x, [b, 1]) + '=' + v) + '.', ['Substitute ' + t(X + '=' + x) + ' into your equation from (a).'], text, inp);
  }
  function fracSlope(r, ms, xr) { var m = r.pick(ms), k = r.int(1, 2) * (r.chance(0.5) ? 1 : 2), x1 = r.int(xr[0], xr[1]), y1 = nz(r, -8, 8); return slopeOnly([x1, y1], [x1 + m[1] * k, y1 + m[0] * k]); }
  function fracPair(r, ms, lim) { var m = r.pick(ms), b = nz(r, -5, 5), x1 = -m[1] * r.int(1, 2), x2 = m[1] * r.int(1, 2); return tpPart(onL(m, b, x1), onL(m, b, x2), { exact: true }); }
  function gridTwo(o, col) {
    var m = o.m, b = o.b, A = o.A, Bq = o.Bq;
    return threeBox(markedFig(m, b, A, Bq, col), m, b,
      'The marked points are ' + t(ptT(A[0], A[1])) + ' and ' + t(ptT(Bq[0], Bq[1])) + '.<br>' + slopeSol(A, Bq) + '.<br>' + subSol(m, A[0], A[1]) + '<br>' + t(SI(m, b)) + '. <b>Check.</b> ' + t(evalT(m, Bq[0], [b, 1]) + '=' + Bq[1]) + ' ✓',
      ['Read the coordinates of the two marked points, then use the slope formula.', 'Substitute one point to find ' + t('b') + ' (or read it where the line crosses the ' + t('y') + '-axis).'], 'graph two points');
  }
  function tableTwo(m, b, x1, x2, x3) {
    m = fr(m); var y1 = fv(fAdd(fMul(m, x1), [b, 1])), y2 = fv(fAdd(fMul(m, x2), [b, 1])), y3 = fv(fAdd(fMul(m, x3), [b, 1]));
    var fields = [fld('equation', { wide: true, placeholder: 'y = …' }), fld(t('y') + ' when ' + t('x=' + x3), { before: t('y=') })];
    var p = B.fields(HW.valueTable([[t('x'), x1, x2], [t('y'), y1, y2]]) + 'Determine the equation of the relation, then find ' + t('y') + ' when ' + t('x=' + x3) + '.', fields,
      [K.line(L(m, b), { form: 'slope-intercept', wrong: [{ is: L(fNeg(m), bOf(fNeg(m), x1, y1)), code: 'u7l6-order', hint: 'Check the sign of the slope.' }, { is: L(m, fAdd([y1, 1], fMul(m, x1))), code: 'u72-b-solve', hint: 'Check how you solved for ' + t('b') + '.' }] }), K.number(y3, function (v) { return near(v, fv(fMul(m, x3))) ? { code: 'u72-fee', hint: 'Add ' + t('b') + ' too.' } : null; })],
      [SI(m, b), String(y3)], t(SI(m, b)) + '; ' + t('y=' + y3),
      slopeSol([x1, y1], [x2, y2]) + '.<br>' + subSol(m, x1, y1) + '<br>' + t(SI(m, b)) + '.<br>At ' + t('x=' + x3) + ': ' + t('y=' + evalT(m, x3, [b, 1]) + '=' + y3) + '.', H_2P, 'table two rows');
    p.bad = [[SI(fNeg(m), bOf(fNeg(m), x1, y1)), String(y3)], [SI(m, b), String(y3 + 1)]];
    return p;
  }
  /* Extra 13(b)–(d): the slope formula with one unknown coordinate; role: 'x' (x2 unknown), 'y1', 'y2' */
  function unknownPart(prompt, letter, ans, A, Bq, m, role) {
    m = fr(m);
    var rise = role === 'y1' ? sub(Bq[1], letter) : sub(letter === 't' ? 't' : Bq[1], A[1]), run = role === 'x' ? letter + '-' + pT(A[0]) : sub(Bq[0], A[0]);
    var eqT = '\\frac{' + (role === 'y1' ? Bq[1] + '-' + letter : role === 'y2' ? letter + '-' + pT(A[1]) : Bq[1] + '-' + pT(A[1])) + '}{' + (role === 'x' ? letter + '-' + pT(A[0]) : sub(Bq[0], A[0])) + '}=' + nT(m);
    var steps;
    if (role === 'x') steps = t(eqT) + '. The rise is ' + t(Bq[1] - A[1]) + ', so the run must be ' + t((Bq[1] - A[1]) + '\\div ' + nT(m) + '=' + (ans - A[0])) + ': ' + t(letter + '-' + pT(A[0]) + '=' + (ans - A[0]) + '\\Rightarrow ' + letter + '=' + ans) + '.';
    else if (role === 'y1') steps = t(eqT) + '. The run is ' + t(Bq[0] - A[0]) + ', so the rise must be ' + t(nT(m) + '\\times ' + (Bq[0] - A[0]) + '=' + nT(fMul(m, Bq[0] - A[0]))) + ': ' + t(Bq[1] + '-' + letter + '=' + nT(fMul(m, Bq[0] - A[0])) + '\\Rightarrow ' + letter + '=' + ans) + '.';
    else steps = t(eqT) + '. The run is ' + t(Bq[0] - A[0]) + ', so the rise must be ' + t(nT(m) + '\\times ' + (Bq[0] - A[0]) + '=' + nT(fMul(m, Bq[0] - A[0]))) + ': ' + t(letter + '-' + pT(A[1]) + '=' + nT(fMul(m, Bq[0] - A[0])) + '\\Rightarrow ' + letter + '=' + ans) + '.';
    var dl = role === 'x' ? [[A[0] + (Bq[1] - A[1]) * fv(m), 'u7l6-unknown', 'Rise ÷ run = slope, so run = rise ÷ slope: divide ' + t(Bq[1] - A[1]) + ' by ' + t(nT(m)) + '.'], [(Bq[1] - A[1]) / fv(m) - A[0], 'u7l6-unknown', 'The run is ' + t(letter + '-' + pT(A[0])) + ': add ' + t(A[0]) + ' back on.']]
      : role === 'y1' ? [[Bq[1] + fv(fMul(m, Bq[0] - A[0])), 'u7l6-unknown', 'From ' + t(Bq[1] + '-' + letter + '=' + nT(fMul(m, Bq[0] - A[0]))) + ', ' + t(letter) + ' is ' + t(Bq[1]) + ' <b>minus</b> the rise.'], [-ans, 'sign', 'Check the signs as you solve.']]
        : [[A[1] - fv(fMul(m, Bq[0] - A[0])), 'u7l6-unknown', 'From ' + t(letter + '-' + pT(A[1]) + '=' + nT(fMul(m, Bq[0] - A[0]))) + ', <b>add</b> ' + t(A[1]) + ' to both sides.'], [fv(fMul(m, Bq[0] - A[0])), 'u7l6-unknown', 'That’s the rise. ' + t(letter) + ' is the starting ' + t('y') + ' plus the rise.']];
    return valPart(prompt, [ans, 1], dl, 'Use the slope formula with the unknown: ' + steps, ['Write the slope formula with the letter in it and set it equal to ' + t(nT(m)) + '.', 'Slope = rise ÷ run: if you know two of the three, you can find the third.'], 'find ' + letter, { keys: 'eq', before: t(letter + '=') });
  }
  /* Extra 14(a): equation from two points, then both intercepts */
  function intTwo(A, Bq) {
    var m = slope2(A, Bq), b = bOf(m, A[0], A[1]), xi = fDiv(fNeg(b), m);
    var fields = [fld('equation', { wide: true, placeholder: 'y = …' }), fld(t('y') + '-intercept'), fld(t('x') + '-intercept')];
    var xiChk = function (resp) {
      var s = String(resp == null ? '' : resp).trim(), pt = readPt(s), v = pt ? (near(pt[1], 0) ? pt[0] : null) : readVal(s);
      if (!s) return form('empty', 'Fill in the ' + t('x') + '-intercept.');
      if (pt && !near(pt[1], 0)) return wrong('u72-int-off', 'A point on the ' + t('x') + '-axis has ' + t('y=0') + '.');
      if (v == null) return form('u72-int-unreadable', 'Give the ' + t('x') + '-intercept as a number or fraction.');
      if (near(v, fv(xi))) return /\d\.\d/.test(s) && Math.abs(fv(xi) * 1e4 - Math.round(fv(xi) * 1e4)) > 1e-6 ? form('u72-decimal', 'Give the exact value as a fraction.') : ok();
      if (near(v, fv(b))) return wrong('u72-int-swap', 'That’s the ' + t('y') + '-intercept. For the ' + t('x') + '-intercept, set ' + t('y=0') + '.');
      if (near(v, -fv(xi))) return wrong('u7l5-xint', 'Check the sign as you solve ' + t('0=' + nT(m) + 'x' + (fv(b) < 0 ? '' : '+') + nT(b)) + '.');
      return wrong('u7l5-xint', null);
    };
    var p = B.fields(t(ptT(A[0], A[1])) + ' and ' + t(ptT(Bq[0], Bq[1])) + ': determine the equation of the line and <i>both</i> of its intercepts. Give exact values.', fields,
      [K.line(L(m, b), { form: 'slope-intercept', wrong: [{ is: L(fNeg(m), bOf(fNeg(m), A[0], A[1])), code: 'u7l6-order', hint: 'Check the sign of the slope.' }] }), intChk(b, [[xi, 'u72-int-swap', 'That’s the ' + t('x') + '-intercept.']]), xiChk],
      [SI(m, b), nT(b), nT(xi)], t(SI(m, b)) + '; ' + t('y') + '-intercept ' + t(ptT(0, b)) + '; ' + t('x') + '-intercept ' + t(ptT(xi, 0)),
      slopeSol(A, Bq) + '.<br>' + subSol(m, A[0], A[1]) + '<br>' + t(SI(m, b)) + '.<br>' + t('y') + '-intercept: ' + t(ptT(0, b)) + '.<br>' + t('x') + '-intercept: ' + t('0=' + nT(m) + 'x' + (fv(b) < 0 ? '' : '+') + nT(b) + '\\ \\Rightarrow\\ x=' + nT(fNeg(b)) + '\\times ' + nT(fInv(m)) + '=' + nT(xi)) + ', the point ' + t(ptT(xi, 0)) + '.',
      [H_2P[0], 'The ' + t('y') + '-intercept is ' + t('b') + '. For the ' + t('x') + '-intercept, set ' + t('y=0') + '.'], 'two points and intercepts');
    p.good = [[SI(m, b), ptK(0, b), ptK(xi, 0)]];
    p.bad = [[SI(m, b), nT(xi), nT(b)], [SI(fNeg(m), bOf(fNeg(m), A[0], A[1])), nT(b), nT(xi)]];
    return p;
  }
})(window);
