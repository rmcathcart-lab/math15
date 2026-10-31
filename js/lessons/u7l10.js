/* Math 15 · Unit 7 · Lesson 10 — Unit Review: Equations of Lines (RF3 RF4 RF5 RF6 RF7)
 * Assignment 10 (u7_L10.tex, Questions 1–26) and the Lesson 10 Extra Practice (u7_EP10.tex, Questions 1–20).
 * Every part is a generator: same structure, idea and difficulty as the booklet item, new numbers (the booklet's numbers
 * are one of the versions). Outcomes per part, by the skill (Ryan's exit-slip tags for the unit): RF4 tables of values,
 * points on a line, using a context equation; RF6 slope and y-intercept from y = mx + b, rearranging, general form,
 * horizontal and vertical lines, graphing; RF7 writing the equation from a slope and intercept / a point / two points /
 * a graph / parallel or perpendicular information; RF5 intercepts; RF3 slope as a rate and parallel/perpendicular slopes.
 * Math 15 writes equations from a slope and a point by substituting into y = mx + b (no slope–point form).
 * Equations are typed on the eq keypad (js/lines.js): "y = mx + b" questions require that form, "general form" questions
 * require Ax + By + C = 0 with integers, A > 0 and no common factor (a right line in another form gets a nudge).
 * Graphs are drawn on the graph pad (js/draw.js). Model: Math 10C u7l7.js (review), u7l3.js, u7l5.js.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 18(b), 18(c), 20(a), 20(b). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, F = HW.fmt, LN = HW.lines, DR = HW.draw;

  /* ---------------- rational numbers [p, q] ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function Q(p, q) { if (Array.isArray(p)) return Q(p[0], p[1]); if (q === undefined) q = 1; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function qa(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qs(a, b) { b = Q(b); return qa(a, [-b[0], b[1]]); }
  function qm(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[0], a[1] * b[1]); }
  function qd(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[1], a[1] * b[0]); }
  function qn(a) { a = Q(a); return [-a[0], a[1]]; }
  function qv(a) { a = Q(a); return a[0] / a[1]; }
  function qT(a) { a = Q(a); return LN.frT(a[0], a[1]); }
  function isInt(a) { return Q(a)[1] === 1; }
  function nT(v) { return Array.isArray(v) ? qT(v) : String(Math.round(v * 1e6) / 1e6); }
  function ptT(p) { return '(' + nT(p[0]) + ',\\ ' + nT(p[1]) + ')'; }
  function ptK(p) { return '(' + nT(p[0]) + ', ' + nT(p[1]) + ')'; }
  function sgnP(n) { n = Array.isArray(n) ? n : Q(n); return qv(n) < 0 ? '(' + qT(n) + ')' : qT(n); }
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function nf(x) { return F(cl(x)); }
  function fx(x, d) { return cl(x).toFixed(d); }
  function same(a, b) { return Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function isI(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function $(x) { return t('\\$' + (isI(x) ? nf(x) : fx(x, 2))); }
  function steps(a, b, s) { var o = []; for (var v = a; v <= b + 1e-9; v += (s || 1)) o.push(cl(v)); return o; }
  function gen(r, f, fb) { for (var i = 0; i < 3000; i++) { var v = f(r); if (v) return v; } return fb; }
  function rnz(r, a, b) { var v; do { v = r.int(a, b); } while (v === 0); return v; }
  function sl(r, pool) { var s = r.pick(pool); return r.chance(0.5) ? Q(s[0], s[1]) : Q(-s[0], s[1]); }

  /* ---------------- lines as A x + B y + C = 0 (integers, A > 0 or A = 0 and B > 0, no common factor) ---------------- */
  function L3(A, Bc, C) { var g = gcd(gcd(A, Bc), C) || 1; A /= g; Bc /= g; C /= g; if (A < 0 || (A === 0 && Bc < 0)) { A = -A; Bc = -Bc; C = -C; } return { A: A + 0, B: Bc + 0, C: C + 0 }; }
  function Lrat(a, b, c) { a = Q(a); b = Q(b); c = Q(c); var d = a[1] * b[1] * c[1]; return L3(a[0] * d / a[1], b[0] * d / b[1], c[0] * d / c[1]); }
  function lineMP(m, pt) { m = Q(m); return Lrat([m[0], 1], [-m[1], 1], qs(qm(m[1], pt[1]), qm(m[0], pt[0]))); }
  function lineMB(m, b) { m = Q(m); return Lrat([m[0], 1], [-m[1], 1], qm(m[1], b)); }
  function line2(p, q) { return p[0] === q[0] ? L3(1, 0, -p[0]) : lineMP(Q(q[1] - p[1], q[0] - p[0]), p); }
  function slopeOf(L) { return L.B === 0 ? null : Q(-L.A, L.B); }
  function yint(L) { return Q(-L.C, L.B); }
  function xint(L) { return Q(-L.C, L.A); }
  function yAt(L, x) { return qd(qn(qa(qm(L.A, x), L.C)), L.B); }
  function xAt(L, y) { return qd(qn(qa(qm(L.B, y), L.C)), L.A); }
  function onL(L, p) { return qv(qa(qa(qm(L.A, p[0]), qm(L.B, p[1])), L.C)) === 0; }
  function sameL(a, b) { return a.A === b.A && a.B === b.B && a.C === b.C; }
  function gT(L, vars) { return LN.tex(L, 'general', null, vars); }
  function sT(L, vars) { return LN.tex(L, 'slope-intercept', null, vars); }
  function perpS(m) { m = Q(m); return Q(-m[1], m[0]); }
  function term(c, v, first) {
    var f = Q(c); if (f[0] === 0) return '';
    var s = f[0] < 0 ? '-' : (first ? '' : '+'), ab = Math.abs(f[0]);
    return s + (f[1] === 1 ? (ab === 1 && v ? '' : String(ab)) : '\\frac{' + ab + '}{' + f[1] + '}') + v;
  }
  function pol(list) { var out = ''; list.forEach(function (tm) { out += term(tm[0], tm[1], !out); }); return out || '0'; }
  function siTex(m, b, vars) { vars = vars || ['x', 'y']; return vars[1] + '=' + pol([[m, vars[0]], [b, '']]); }
  function slopeSteps(p, q) { var d = Q(q[1] - p[1], q[0] - p[0]); return t('m=\\dfrac{' + q[1] + '-' + sgnP(p[1]) + '}{' + q[0] + '-' + sgnP(p[0]) + '}=\\dfrac{' + (q[1] - p[1]) + '}{' + (q[0] - p[0]) + '}' + ('\\dfrac{' + (q[1] - p[1]) + '}{' + (q[0] - p[0]) + '}' === '\\dfrac{' + d[0] + '}{' + d[1] + '}' ? '' : '=' + qT(d))); }
  /* substitute a point into y = mx + b and solve for b (the Math 15 method) */
  function bSteps(m, pt, vars) {
    vars = vars || ['x', 'y']; m = Q(m); var b = qs(pt[1], qm(m, pt[0]));
    return 'Substitute ' + t('m=' + qT(m)) + ' and ' + t(ptT(pt)) + ' into ' + t(vars[1] + '=m' + vars[0] + '+b') + ':<br>' + t(qT(pt[1]) + '=' + qT(m) + sgnP(pt[0]).replace(/^([^(].*)$/, '($1)') + '+b') + '<br>' + t(qT(pt[1]) + '=' + qT(qm(m, pt[0])) + '+b\\Rightarrow b=' + qT(b)) + '<br>' + t(siTex(m, b, vars));
  }
  function genSteps(m, b, vars) {   // y = mx + b → general form
    vars = vars || ['x', 'y']; m = Q(m); b = Q(b); var d = m[1] * b[1] / gcd(m[1], b[1]), L = lineMB(m, b), X = vars[0], Y = vars[1];
    var s = t(siTex(m, b, vars));
    if (d > 1) s += '<br>Multiply every term by ' + t(d) + ': ' + t(pol([[d, Y]]) + '=' + pol([[qm(m, d), X], [qm(b, d), '']]));
    s += '<br>Move every term to one side' + (L.A > 0 && qv(m) < 0 ? '' : ' (so the ' + t(X) + '-term is positive)') + ': ' + t(gT(L, vars));
    return s;
  }
  function siFromGen(L, vars) {   // general → y = mx + b, shown
    vars = vars || ['x', 'y']; var X = vars[0], Y = vars[1], m = slopeOf(L), b = yint(L);
    return t(gT(L, vars)) + '<br>Keep the ' + t(Y) + '-term on the left: ' + t(pol([[L.B, Y]]) + '=' + pol([[-L.A, X], [-L.C, '']])) + (L.B === 1 ? '' : '<br>Divide every term by ' + t(L.B) + ': ' + t(siTex(m, b, vars)));
  }

  /* ---------------- answer checkers and part makers ---------------- */
  function toL3(T) { if (T.A != null && Number.isInteger(T.A)) return L3(T.A, T.B, T.C); var c = LN.of(T); return Lrat(LN.toFr(c[0]), LN.toFr(c[1]), LN.toFr(c[2])); }
  /* "write the equation": L target ({A,B,C}); opt.form 'slope-intercept' | 'general' | 'any'; opt.wrong [{ is: L3 or {m,b}, code, hint }] */
  function lineP(prompt, L, opt, sol, hints, text) {
    opt = opt || {}; var vars = opt.vars || ['x', 'y'], o2 = Object.assign({}, opt, { wrong: (opt.wrong || []).map(function (w) { return { is: w.is.m != null ? { m: qv(w.is.m), b: qv(w.is.b) } : w.is, code: w.code, hint: w.hint }; }) });
    if (opt.form === 'slope-intercept' && L.B === 0) o2.form = 'any';
    var p = B.line(prompt, L, o2, sol, hints, text), T = toL3(L);
    if (opt.form === 'general' || (opt.form === 'any' && L.B === 0)) { p.key = gT(T, vars); p.answer = t(p.key); }
    p.bad = (opt.wrong || []).map(function (w) { return w.is.m != null ? lineMB(w.is.m, w.is.b) : toL3(w.is); }).filter(function (W) { return !sameL(W, T); }).map(function (W) { return opt.form === 'general' ? gT(W, vars) : W.B === 0 ? gT(W, vars) : sT(W, vars); });
    if (opt.form === 'general' && T.B !== 0 && T.A !== 0) p.good = [pol([[T.B, vars[1]], [T.A, vars[0]], [T.C, '']]) + '=0'];
    if (opt.form === 'slope-intercept' && T.B !== 0 && qv(yint(T)) !== 0 && qv(slopeOf(T)) !== 0) p.good = [vars[1] + '=' + pol([[yint(T), ''], [slopeOf(T), vars[0]]])];
    return p;
  }
  function eqChk(L, opt) { return K.line(L, opt || {}); }
  function eqFld(label, vars, ph) { vars = vars || ['x', 'y']; return { label: label, name: String(label).replace(/\\\(|\\\)/g, '').replace(/:\s*$/, ''), mode: 'math', keys: 'eq', vars: vars, placeholder: ph || 'e.g. ' + vars[1] + ' = 2' + vars[0] + ' + 5' }; }
  function valFld(label, before, after, keys) { return { label: label, name: String(label).replace(/\\\(|\\\)/g, '').replace(/:\s*$/, ''), mode: 'math', keys: keys || 'fraction', before: before, after: after, placeholder: ' ' }; }
  function ptFld(label) { return { label: label, name: String(label).replace(/\\\(|\\\)/g, '').replace(/:\s*$/, ''), mode: 'math', keys: 'pairs', placeholder: 'e.g. (3, -2)' }; }
  function exactV(x, list) {
    x = qv(x);
    return K.value(x, { diag: function (v) {
      for (var i = 0; i < (list || []).length; i++) if (list[i] && list[i].v != null && !same(qv(list[i].v), x) && same(v, qv(list[i].v))) return { code: list[i].code, hint: list[i].hint };
      return Math.abs(v - x) < 0.01 ? { code: 'decimal', hint: 'Close — give the <b>exact</b> value (a fraction), not a rounded decimal.' } : null;
    } });
  }
  function valP(prompt, x, list, sol, hints, text, inp) { var p = B.math(prompt, exactV(x, list), qT(Q(LN.toFr(qv(x)))), sol, hints, text, Object.assign({ keys: 'fraction' }, inp || {})); p.bad = (list || []).filter(function (e) { return e && !same(qv(e.v), qv(x)); }).slice(0, 4).map(function (e) { return qT(Q(LN.toFr(qv(e.v)))); }); return p; }
  function slopeChk(m, list) { var base = K.slope(m == null ? null : Q(m), { diag: function (v) { for (var i = 0; i < (list || []).length; i++) if (list[i] && list[i].v != null && same(v, qv(list[i].v))) return { code: list[i].code, hint: list[i].hint }; return null; } }); return base; }
  function slopeP(prompt, m, list, sol, hints, text) { var p = B.math(prompt, slopeChk(m, list), m == null ? '\\text{undefined}' : qT(m), sol, hints, text, { keys: 'slope', before: t('m='), placeholder: 'e.g. -2/3 or undefined' }); if (m != null && qv(m) !== 0) p.bad = [qT(qn(m))]; return p; }
  /* one ordered pair; name 'x' | 'y' for an intercept */
  function ptChk(pt, name) {
    var base = K.pairs([[qv(pt[0]), qv(pt[1])]]);
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (s && s.indexOf('(') < 0) { var a = K.read(s); if (!a.res) return form('pt-form', 'Write it as an ordered pair, ' + t('(x,\\ y)') + '.'); }
      var r = base(resp);
      if (r.v === 'wrong' && r.code === 'pairs-flip') return wrong(name ? 'int-swap' : 'pt-swap', name === 'x' ? 'The ' + t('x') + '-intercept is on the ' + t('x') + '-axis, so its ' + t('y') + '-coordinate is ' + t('0') + ': ' + t('(a,\\ 0)') + '.' : name === 'y' ? 'The ' + t('y') + '-intercept is on the ' + t('y') + '-axis, so its ' + t('x') + '-coordinate is ' + t('0') + ': ' + t('(0,\\ b)') + '.' : 'Your coordinates are swapped: ' + t('(x,\\ y)') + ' — across first, then up or down.');
      if (r.v === 'wrong' && r.code === 'pairs') return wrong('point', null);
      return r;
    };
  }
  function ptP(prompt, pt, sol, hints, text) { var p = B.math(prompt, ptChk(pt), ptK(pt), sol, hints, text, { keys: 'pairs', placeholder: 'e.g. (3, -2)' }); p.bad = [ptK([pt[1], pt[0]]).replace(/^\((.*), (.*)\)$/, '($1, $2)')].filter(function (b) { return b !== ptK(pt); }); return p; }
  function intsP(prompt, L, sol, hints, text) {
    var xi = xint(L), yi = yint(L);
    var p = B.fields(prompt, [ptFld(t('x') + '-intercept:'), ptFld(t('y') + '-intercept:')], [ptChk([xi, 0], 'x'), ptChk([0, yi], 'y')], [ptK([xi, 0]), ptK([0, yi])], t(ptT([xi, 0])) + ' and ' + t(ptT([0, yi])), sol, hints, text);
    p.bad = [[ptK([0, xi]), ptK([yi, 0])]];
    return p;
  }
  function intSteps(L, vars) {
    vars = vars || ['x', 'y']; var X = vars[0], Y = vars[1], xi = xint(L), yi = yint(L);
    return t(X) + '-intercept: let ' + t(Y + '=0') + ': ' + t(pol([[L.A, X], [L.C, '']]) + '=0') + ', so ' + t(X + '=' + qT(xi)) + ' → ' + t(ptT([xi, 0])) + '<br>' +
      t(Y) + '-intercept: let ' + t(X + '=0') + ': ' + t(pol([[L.B, Y], [L.C, '']]) + '=0') + ', so ' + t(Y + '=' + qT(yi)) + ' → ' + t(ptT([0, yi]));
  }
  /* any point on L other than `not`, with cond(p) true (e.g. moving right) */
  function anyPtChk(L, not, cond, condHint) {
    return function (resp) {
      var r = LN.readPoint(String(resp == null ? '' : resp));
      if (r.empty) return form('empty', 'Type your answer first.');
      if (r.kind !== 'pt' || !r.brackets && !r.named) return form('pt-form', 'Write it as an ordered pair, ' + t('(x,\\ y)') + '.');
      var P = [r.p[0].v, r.p[1].v];
      if (not && same(P[0], qv(not[0])) && same(P[1], qv(not[1]))) return wrong('u7l10-same-pt', 'That’s the ' + t('y') + '-intercept itself. Use the slope to move to a <b>second</b> point.');
      if (Math.abs(L.A * P[0] + L.B * P[1] + L.C) > 1e-9) {
        var m = slopeOf(L);
        if (m && not && Math.abs(P[0] - qv(not[0]) - qv(m)) < 1e-9 && same(P[1] - qv(not[1]), 1)) return wrong('slope-flip', 'You moved up and across the wrong way round: the slope is rise over run — go <b>across ' + t(Q(m)[1]) + '</b>, then up or down ' + t(Math.abs(Q(m)[0])) + '.');
        return wrong('u7l10-off-line', not ? 'That point isn’t on the line: substitute it into the equation to check. Start at the ' + t('y') + '-intercept, go across the run, then up or down the rise.' : 'That point isn’t on the line. Look for places where the line passes exactly through a grid corner, and read across first, then up or down.');
      }
      if (cond && !cond(P)) return form('u7l10-cond', condHint);
      return ok();
    };
  }
  function anyPtP(prompt, L, not, key, cond, condHint, sol, hints, text) { var p = B.math(prompt, anyPtChk(L, not, cond, condHint), ptK(key), sol, hints, text, { keys: 'pairs', placeholder: 'e.g. (3, -2)' }); p.bad = [ptK(not)]; return p; }
  function mc(r, prompt, opts, sol, hints, text, keep) {
    var seen = {}, out = [];
    opts.filter(function (o) { return o.right; }).concat(opts.filter(function (o) { return !o.right; })).forEach(function (o) { if (!seen[o.html]) { seen[o.html] = 1; out.push(o); } });
    return B.mc(r, prompt, keep ? opts.filter(function (o) { return out.indexOf(o) >= 0; }) : out, sol, hints, text, keep);
  }
  function dg(list) { return function (v) { for (var i = 0; i < list.length; i++) if (same(v, list[i].v)) return { code: list[i].code, hint: list[i].hint }; return null; }; }
  function cleanList(list, ans) { return (list || []).filter(function (e) { return e && e.v != null && isFinite(e.v) && !same(e.v, ans); }); }
  function num(prompt, ans, list, sol, hints, text, o) {
    o = o || {}; ans = cl(ans); list = cleanList(list, ans);
    var p = { prompt: prompt, input: { type: 'number', before: o.money ? t('\\$') : o.before, after: o.after }, check: K.number(ans, dg(list)), key: String(ans),
      answer: o.money ? $(ans) : t(nf(ans)) + (o.after ? ' ' + o.after : ''), solution: sol, hints: hints || [], text: text };
    p.bad = list.slice(0, 5).map(function (e) { return String(cl(e.v)); });
    return p;
  }
  function nums(prompt, items, sol, hints, text) {
    var fl = items.map(function (it) { return { label: it.label, name: it.name || String(it.label).replace(/\\\(|\\\)/g, '').replace(/:\s*$/, ''), before: it.money ? t('\\$') : it.before, after: it.after }; });
    var ch = items.map(function (it) { return K.number(cl(it.ans), dg(cleanList(it.list, cl(it.ans)))); });
    var p = B.fields(prompt, fl, ch, items.map(function (it) { return String(cl(it.ans)); }),
      items.map(function (it) { return it.label + ' ' + (it.money ? $(it.ans) : t(nf(it.ans)) + (it.after ? ' ' + it.after : '')); }).join('<br>'), sol, hints, text);
    p.bad = [items.map(function (it) { var l = cleanList(it.list, cl(it.ans)); return String(l.length ? cl(l[0].v) : cl(it.ans) + 1); })];
    return p;
  }
  /* context equation y = mx + b with the question's letters (numbers may be decimals) */
  function ctxTex(Y, X, m, b) { var s = (same(m, 1) ? '' : same(m, -1) ? '-' : nf(m)) + X; if (!same(b, 0)) s += (b > 0 ? '+' : '-') + nf(Math.abs(b)); return Y + '=' + s; }
  function ctxLine(prompt, m, b, o, sol, hints, text) {
    o = o || {}; var X = o.X, Y = o.Y, wl = (o.wrong || []).slice();
    if (!same(b, 0)) wl.push({ m: b, b: m, code: 'u7l9-swap', hint: 'The rate and the starting value are swapped. The rate (the “per” amount) multiplies ' + t(X) + '; the starting amount is added on by itself.' });
    wl = wl.filter(function (w) { return !(same(w.m, m) && same(w.b, b)); });
    var base = K.line({ m: m, b: b }, { vars: [X, Y], form: 'slope-intercept', wrong: wl.map(function (w) { return { is: { m: w.m, b: w.b }, code: w.code, hint: w.hint }; }) });
    var chk = function (resp) { var r = base(resp); if (r.v === 'wrong' && r.code === 'line-slope-sign') return wrong('ctx-rate-sign', m < 0 ? 'The amount is going <b>down</b>, so the rate (the slope) is negative.' : 'The amount is going <b>up</b>, so the rate (the slope) is positive.'); return r; };
    var key = Y + '=' + (same(m, 1) ? '' : same(m, -1) ? '-' : String(cl(m))) + X + (same(b, 0) ? '' : (b > 0 ? '+' : '-') + String(cl(Math.abs(b))));
    var p = B.math(prompt, chk, key, sol, hints, text, { keys: 'eq', vars: [X, Y], placeholder: 'e.g. ' + Y + ' = 2' + X + ' + 5' });
    p.answer = t(ctxTex(Y, X, m, b));
    p.bad = wl.map(function (w) { return ctxTex(Y, X, w.m, w.b).replace(/\\,/g, ''); });
    if (!same(b, 0)) p.good = [Y + '=' + String(cl(b)) + (m < 0 ? '-' : '+') + String(cl(Math.abs(m))) + X];
    return p;
  }

  /* ---------------- graphs ---------------- */
  function gv(pts, pieces) { return { pts: pts || [], pieces: pieces || [], join: 'none' }; }
  function segv(a, b, s, e) { return { v: [a, b], s: s || 'closed', e: e || 'closed' }; }
  function lattice(L, xr, yr) {
    var out = [];
    if (L.B === 0) { var k = -L.C / L.A; if (Number.isInteger(k) && k >= xr[0] && k <= xr[1]) for (var y = yr[0]; y <= yr[1]; y++) out.push([k, y]); return out; }
    for (var x = xr[0]; x <= xr[1]; x++) { var yy = (-L.C - L.A * x) / L.B; if (Number.isInteger(yy) && yy >= yr[0] && yy <= yr[1]) out.push([x, yy]); }
    return out;
  }
  function lineDraw(L, xr, yr) { var a = lattice(L, xr, yr); return a.length >= 2 ? gv([], [segv(a[0], a[a.length - 1], 'arrow', 'arrow')]) : null; }
  function linesDraw(Ls, xr, yr) { var pcs = []; for (var i = 0; i < Ls.length; i++) { var d = lineDraw(Ls[i], xr, yr); if (!d) return null; pcs.push(d.pieces[0]); } return gv([], pcs); }
  function clip(L, xr, yr) {
    var pts = [], add = function (p) { if (p[0] >= xr[0] - 1e-9 && p[0] <= xr[1] + 1e-9 && p[1] >= yr[0] - 1e-9 && p[1] <= yr[1] + 1e-9 && !pts.some(function (z) { return Math.abs(z[0] - p[0]) < 1e-9 && Math.abs(z[1] - p[1]) < 1e-9; })) pts.push(p); };
    if (L.B !== 0) { [xr[0], xr[1]].forEach(function (x) { add([x, (-L.C - L.A * x) / L.B]); }); }
    if (L.A !== 0) { [yr[0], yr[1]].forEach(function (y) { add([(-L.C - L.B * y) / L.A, y]); }); }
    return pts.slice(0, 2);
  }
  /* a figure with lines Ls (each { L, label }) and dots */
  function lineFig(Ls, xr, yr, dots, o) {
    o = o || {};
    var segs = Ls.map(function (l) { return { pts: clip(l.L, [xr[0] + 0.3, xr[1] - 0.3], [yr[0] + 0.3, yr[1] - 0.3]), start: 'arrow', end: 'arrow' }; });
    var pts = (dots || []).map(function (d) { return { x: d[0], y: d[1], label: d[2] }; });
    Ls.forEach(function (l) { if (l.label) { var c = clip(l.L, [xr[0] + 0.3, xr[1] - 0.3], [yr[0] + 0.3, yr[1] - 0.3]); var e = c[1][0] >= c[0][0] ? c[1] : c[0]; pts.push({ x: e[0], y: e[1], label: l.label, color: 'rgba(0,0,0,0)' }); } });
    return '<div class="fig">' + HW.graph({ x: xr, y: yr, grid: 1, labels: 2, segs: segs, points: pts, max: o.max || 320, aria: o.aria || 'graph of a line' }) + '</div>';
  }
  function pad(xr, yr, extra) { return Object.assign({ x: xr, y: yr, labels: 2, defaultEnd: 'arrow', tools: ['line', 'ends'] }, extra || {}); }
  function exactChk(target, opt) { var base = K.graphExact(target, opt); return function (resp) { if (!DR.empty(resp) && DR.same(resp, target)) return ok(); return base(resp); }; }

  HW.addCodes({
    'pt-form': 'Point not written as an ordered pair', 'int-swap': 'x- and y-intercept swapped', point: 'Wrong point', 'pt-swap': 'Point: coordinates swapped', decimal: 'Rounded decimal instead of the exact value',
    'u7l9-swap': 'Swapped the rate and the starting value', 'ctx-rate-sign': 'Rate sign doesn’t match the situation', 'ctx-no-b': 'Left out the intercept', 'ctx-no-sub': 'Didn’t subtract the starting amount before dividing',
    'ctx-tint-b': 'Gave the starting value instead of the time', 'ctx-total': 'Gave the total change, not the rate', 'ctx-flip': 'Rate units upside down', 'ctx-b-point': 'Used a data point’s value as the intercept', 'ctx-change': 'Gave the change instead of the value',
    'ctx-swap-boxes': 'Two answers in each other’s boxes', 'ctx-add-b': 'Added the intercept instead of subtracting', 'ctx-step': 'Didn’t divide by the step in x', 'ctx-part': 'Stopped after one step',
    'u7l10-same-pt': 'Gave the y-intercept as the second point', 'u7l10-off-line': 'Point not on the line', 'u7l10-cond': 'Point in the wrong direction', 'u7l10-b-point': 'Used the point’s y-value as b',
    'u7l10-b-sign': 'Sign slip solving for b', 'u7l10-sub-order': 'Slope: subtracted in different orders', 'u7l10-mb-swap': 'Read m and b the wrong way round', 'u7l10-m-sign': 'Dropped the sign of the slope',
    'u7l10-no-iso': 'Read m and b before isolating y', 'u7l10-int-c': 'Read C as an intercept', 'u7l10-tab-sign': 'Sign slip in a table value', 'u7l10-tab-add': 'Added instead of multiplying (table)',
    'u7l10-both-mult': 'Multiplied only some terms', 'u7l10-perp': 'Used the parallel slope for a perpendicular line', 'u7l10-par': 'Used the perpendicular slope for a parallel line', 'u7l10-k': 'Wrong value of the missing number',
    'u7l10-area-half': 'Forgot the ½ in the triangle area', 'u7l10-vertex': 'Wrong vertex', 'u7l10-yx': 'Solved for the wrong variable', 'u7l9-breakeven-cost': 'Gave the cost at break-even, not the input', 'u7l9-cheaper': 'Picked the more expensive option', 'u7l9-letter': 'Answer not given as a letter'
  });
  HW.addPartial({ 'u7l10-same-pt': 'n', 'u7l10-off-line': 'n', 'u7l10-b-point': 'b', 'u7l10-b-sign': 's', 'u7l10-sub-order': 'b', 'u7l10-mb-swap': 'n', 'u7l10-m-sign': 's', 'u7l10-no-iso': 'b', 'u7l10-int-c': 'n',
    'u7l10-tab-sign': 's', 'u7l10-tab-add': 'n', 'u7l10-both-mult': 'b', 'u7l10-perp': 'n', 'u7l10-par': 'n', 'u7l10-k': 'n', 'u7l10-area-half': 's', 'u7l10-vertex': 'n', 'u7l10-yx': 'n', 'u7l9-swap': 'n', 'u7l9-breakeven-cost': 'b', 'u7l9-cheaper': 'n' });

  var SIH = ['Substitute the slope and the point into ' + t('y=mx+b') + ', then solve for ' + t('b') + '.'];
  var GENH = ['General form: every term on one side, ' + t('Ax+By+C=0') + ', with whole numbers and ' + t('A') + ' positive.'];

  /* "y = mx + b" from a slope and a point: the usual wrong answers */
  function mpWrongs(m, pt) {
    var b = qs(pt[1], qm(m, pt[0]));
    return [{ is: { m: m, b: pt[1] }, code: 'u7l10-b-point', hint: t(ptT(pt)) + ' isn’t on the ' + t('y') + '-axis, so ' + t(qT(pt[1])) + ' isn’t ' + t('b') + '. Substitute the point into ' + t('y=mx+b') + ' and solve for ' + t('b') + '.' },
      { is: { m: m, b: qa(pt[1], qm(m, pt[0])) }, code: 'u7l10-b-sign', hint: 'Check the step where you solve for ' + t('b') + ': ' + t(qT(pt[1]) + '=' + qT(qm(m, pt[0])) + '+b') + ', so ' + t('b=' + qT(pt[1]) + (qv(qm(m, pt[0])) < 0 ? '+' + qT(qn(qm(m, pt[0]))) : '-' + qT(qm(m, pt[0])))) + '.' },
      { is: { m: m, b: qs(pt[1], qm(qn(m), pt[0])) }, code: 'u7l10-b-sign', hint: 'Careful with the signs when you multiply ' + t(qT(m) + '\\times' + sgnP(pt[0])) + '.' }].filter(function (w) { return !(qv(w.is.b) === qv(b)); });
  }

  /* ================================================================================================= */
  var LESSON = {
    id: 'u7l10', unit: 7, num: 10, title: 'Unit Review: Equations of Lines', outcome: 'RF7',
    blurb: 'Review of the whole unit: tables of values, slope–intercept form, graphing, writing equations from a slope and intercept, a point, or two points, general form, horizontal and vertical lines, and slope in context.',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A — Tables, Slope-Intercept Basics, and Graphing', shared: function (r) { return r.chance(0.25) ? { m: -2, b: 5 } : gen(r, function (r) { var m = rnz(r, -4, 4), b = rnz(r, -6, 6); return (m === -3 && b === 4) || (m === 3 && b === -2) ? null : { m: m, b: b }; }); },   // never the notes’ y = 3x − 2 or y = −3x + 4
        parts: [{ id: '1', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var xs = [-2, -1, 0, 1, 2], ys = xs.map(function (x) { return sh.m * x + sh.b; });
          var tb = HW.valueTable([[t('x')].concat(xs.map(function (x) { return t(x); })), [t('y')].concat(xs.map(function () { return '?'; }))]);
          var p = nums('Complete a table of values for ' + t(siTex(sh.m, sh.b)) + '.' + tb, xs.map(function (x, i) {
            return { label: t('x=' + x) + ':', name: 'y at x=' + x, before: t('y='), ans: ys[i], list: [{ v: -sh.m * x + sh.b, code: 'u7l10-tab-sign', hint: 'Careful with the signs: ' + t(sh.m + '\\times' + sgnP(x) + '=' + (sh.m * x)) + '.' }, { v: sh.m + x + sh.b, code: 'u7l10-tab-add', hint: t(sh.m + 'x') + ' means ' + t(sh.m) + ' <b>times</b> ' + t('x') + '.' }] };
          }), xs.map(function (x, i) { return t('y=' + sh.m + '(' + x + ')' + (sh.b < 0 ? '' : '+') + sh.b + '=' + ys[i]); }).join('<br>') + '<br>Ordered pairs: ' + t(xs.map(function (x, i) { return ptT([x, ys[i]]); }).join(',\\ ')),
            ['Substitute each ' + t('x') + '-value into the equation.', 'Multiply first, then add or subtract.'], 'table of values');
          return p;
        } }] },
      { num: '2', shared: function (r) {
          if (r.chance(0.25)) return { m: -1, b: 3, P: [5, -2], on: true };
          var m = r.pick([-3, -2, -1, 1, 2, 3]), b = rnz(r, -6, 6), x = r.int(2, 6), on = r.chance(0.5), y = m * x + b + (on ? 0 : r.pick([-2, -1, 1, 2]));
          return { m: m, b: b, P: [x, y], on: on };
        },
        parts: [{ id: '2', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var v = sh.m * sh.P[0] + sh.b, sub = t(sh.m + '(' + sh.P[0] + ')' + (sh.b < 0 ? '' : '+') + sh.b + '=' + v);
          return mc(r, 'Does the point ' + t(ptT(sh.P)) + ' lie on the line ' + t(siTex(sh.m, sh.b)) + '?', [
            { html: sh.on ? 'Yes: ' + sub + ', which equals the ' + t('y') + '-coordinate ' + t(sh.P[1]) + '.' : 'No: ' + sub + ', but the ' + t('y') + '-coordinate is ' + t(sh.P[1]) + '.', right: true },
            { html: sh.on ? 'No: ' + sub + ', which is not ' + t(sh.P[1]) + '.' : 'Yes: ' + sub + ', which equals ' + t(sh.P[1]) + '.', why: 'Compare the value you get with the ' + t('y') + '-coordinate of the point: ' + t(v) + (v === sh.P[1] ? ' = ' : ' ≠ ') + t(sh.P[1]) + '.' },
            { html: sh.on ? 'No: substituting ' + t('y=' + sh.P[0]) + ' does not give ' + t('x=' + sh.P[1]) + '.' : 'Yes: substituting ' + t('y=' + sh.P[0]) + ' gives ' + t('x=' + sh.P[1]) + '.', why: 'In ' + t(ptT(sh.P)) + ' the first number is ' + t('x') + '. Substitute ' + t('x=' + sh.P[0]) + '.' }],
            'Substitute ' + t('x=' + sh.P[0]) + ': ' + sub + '. ' + (sh.on ? 'This equals the ' + t('y') + '-coordinate, so the point <b>is</b> on the line.' : 'The point has ' + t('y=' + sh.P[1]) + ', so it is <b>not</b> on the line.'),
            ['Substitute the ' + t('x') + '-coordinate and compare the result with the ' + t('y') + '-coordinate.'], 'point on a line');
        } }] },
      { num: '3', shared: function (r) { return r.chance(0.25) ? { m: 7, b: -9 } : gen(r, function (r) { var m = r.pick([2, 3, 4, 5, 6, 7, 8, 9]) * (r.chance(0.5) ? 1 : -1), b = rnz(r, -12, 12); return m === b ? null : { m: m, b: b }; }); },
        parts: [{ id: '3', level: 'BEG', outcome: 'RF6', make: function (r, sh) {
          var p = B.fields('State the slope and ' + t('y') + '-intercept of ' + t(siTex(sh.m, sh.b)) + '.', [valFld('Slope:', t('m=')), valFld(t('y') + '-intercept:', t('b='))],
            [exactV(sh.m, [{ v: sh.b, code: 'u7l10-mb-swap', hint: 'That’s the constant term. The slope is the number multiplying ' + t('x') + '.' }, { v: -sh.m, code: 'u7l10-m-sign', hint: 'Keep the sign in front of the ' + t('x') + '-term.' }]),
              exactV(sh.b, [{ v: sh.m, code: 'u7l10-mb-swap', hint: 'That’s the slope. The ' + t('y') + '-intercept is the constant term.' }, { v: -sh.b, code: 'sign', hint: 'Keep the sign in front of the constant.' }])],
            [String(sh.m), String(sh.b)], t('m=' + sh.m) + ', ' + t('b=' + sh.b), 'In ' + t('y=mx+b') + ', ' + t('m') + ' multiplies ' + t('x') + ' and ' + t('b') + ' is the constant: ' + t('m=' + sh.m) + ', ' + t('b=' + sh.b) + '.', ['Read ' + t('m') + ' and ' + t('b') + ' with their signs.'], 'read m and b');
          p.bad = [[String(sh.b), String(sh.m)]];
          return p;
        } }] },
      { num: '4', shared: function (r) { return r.chance(0.25) ? { m: -1, b: 12 } : { m: r.pick([-1, 1]), b: rnz(r, -15, 15) }; },
        parts: [{ id: '4', level: 'BEG', outcome: 'RF6', make: function (r, sh) {
          var p = B.fields('State the slope and ' + t('y') + '-intercept of ' + t(siTex(sh.m, sh.b)) + '.', [valFld('Slope:', t('m=')), valFld(t('y') + '-intercept:', t('b='))],
            [exactV(sh.m, [{ v: 0, code: 'u7l10-m-sign', hint: 'There is an ' + t('x') + '-term, so the slope isn’t 0: ' + t(sh.m < 0 ? '-x' : 'x') + ' means ' + t(sh.m + 'x') + '.' }, { v: -sh.m, code: 'u7l10-m-sign', hint: 'Keep the sign in front of the ' + t('x') + '-term.' }, { v: sh.b, code: 'u7l10-mb-swap', hint: 'That’s the constant term.' }]),
              exactV(sh.b, [{ v: sh.m, code: 'u7l10-mb-swap', hint: 'That’s the slope.' }, { v: -sh.b, code: 'sign', hint: 'Keep the sign in front of the constant.' }])],
            [String(sh.m), String(sh.b)], t('m=' + sh.m) + ', ' + t('b=' + sh.b), t(sh.m < 0 ? '-x' : 'x') + ' means ' + t(sh.m + 'x') + ', so ' + t('m=' + sh.m) + '; the constant is ' + t('b=' + sh.b) + '.', ['When no number is written in front of ' + t('x') + ', the coefficient is ' + t('1') + ' (or ' + t('-1') + ').'], 'read m = ±1');
          p.bad = [['0', String(sh.b)]];
          return p;
        } }] },
      { num: '5', shared: function (r) { return r.chance(0.25) ? { a: 6, c: 5 } : { a: rnz(r, -9, 9), c: rnz(r, -9, 9) }; },
        parts: [{ id: '5', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          var a = Math.abs(sh.a) === 1 ? sh.a * 3 : sh.a, m = -a, b = sh.c, L = lineMB(m, b), lhs = pol([[a, 'x'], [1, 'y']]);
          var p = B.fields('Rearrange ' + t(lhs + '=' + sh.c) + ' into slope–intercept form, then state the slope and ' + t('y') + '-intercept.', [eqFld('Equation:'), valFld('Slope:', t('m=')), valFld(t('y') + '-intercept:', t('b='))],
            [eqChk(L, { form: 'slope-intercept', wrong: [{ is: { m: a, b: b }, code: 'u7l10-m-sign', hint: 'When ' + t(pol([[a, 'x']])) + ' moves across the equals sign it changes sign.' }] }),
              exactV(m, [{ v: a, code: 'u7l10-no-iso', hint: 'Isolate ' + t('y') + ' first: moving ' + t(pol([[a, 'x']])) + ' to the other side changes its sign.' }]), exactV(b, [{ v: -b, code: 'sign', hint: 'The constant stays on the right side as it is.' }])],
            [sT(L), String(m), String(b)], t(sT(L)) + ', ' + t('m=' + m) + ', ' + t('b=' + b),
            t(lhs + '=' + sh.c) + '<br>Subtract ' + t(pol([[a, 'x']])) + ' from both sides: ' + t(siTex(m, b)) + '<br>' + t('m=' + m) + ', ' + t('b=' + b), ['Get ' + t('y') + ' by itself: move the ' + t('x') + '-term to the other side (its sign changes).'], 'rearrange to y = mx + b');
          p.bad = [[siTex(a, b), String(a), String(b)]];
          return p;
        } }] },
      { num: '6', shared: function (r) { return r.chance(0.25) ? { m: 3, b: -6 } : { m: rnz(r, -4, 4), b: rnz(r, -8, 8) }; },
        parts: [{ id: '6', level: 'BEG', outcome: 'RF6', make: function (r, sh) {
          var L = lineMB(sh.m, sh.b), P0 = [0, sh.b], P1 = [1, sh.m + sh.b];
          return B.fields('For ' + t(siTex(sh.m, sh.b)) + ', state the ' + t('y') + '-intercept as a point, then use the slope to state the coordinates of a second point on the line.', [ptFld(t('y') + '-intercept:'), ptFld('Second point:')],
            [ptChk(P0, 'y'), anyPtChk(L, P0)], [ptK(P0), ptK(P1)], t(ptT(P0)) + '; e.g. ' + t(ptT(P1)),
            'The ' + t('y') + '-intercept is ' + t('b=' + sh.b) + ': the point ' + t(ptT(P0)) + '.<br>Slope ' + t(sh.m + '=\\dfrac{' + sh.m + '}{1}') + ': from ' + t(ptT(P0)) + ' go right ' + t(1) + ' and ' + (sh.m > 0 ? 'up' : 'down') + ' ' + t(Math.abs(sh.m)) + ' to ' + t(ptT(P1)) + '. (Any other point on the line is also correct.)',
            ['Start at ' + t('(0,\\ b)') + '. Write the slope as ' + t('\\frac{\\text{rise}}{\\text{run}}') + ' and step from there.'], 'intercept and second point');
        } }] },
      { num: '7', shared: function (r) { if (r.chance(0.25)) return { m: Q(-1, 4), b: 2 }; return gen(r, function (r) { var m = sl(r, [[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [1, 5], [2, 5], [3, 2]]); return { m: m, b: rnz(r, -6, 6) }; }); },
        parts: [{ id: '7', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          var L = lineMB(sh.m, sh.b), P0 = [0, sh.b], P1 = [sh.m[1], sh.b + sh.m[0]];
          return B.fields('For ' + t(siTex(sh.m, sh.b)) + ', state the ' + t('y') + '-intercept as a point, then use the slope to state a second point on the line (moving right).', [ptFld(t('y') + '-intercept:'), ptFld('Second point:')],
            [ptChk(P0, 'y'), anyPtChk(L, P0, function (P) { return P[0] > 0; }, 'That point is on the line, but it is to the <b>left</b>. Move right: the run is positive.')], [ptK(P0), ptK(P1)], t(ptT(P0)) + '; e.g. ' + t(ptT(P1)),
            'The ' + t('y') + '-intercept is ' + t(ptT(P0)) + '. Slope ' + t(qT(sh.m) + '=\\dfrac{' + sh.m[0] + '}{' + sh.m[1] + '}') + ': go right ' + t(sh.m[1]) + ', ' + (sh.m[0] > 0 ? 'up' : 'down') + ' ' + t(Math.abs(sh.m[0])) + ' → ' + t(ptT(P1)) + '.',
            ['A fraction slope ' + t('\\frac{\\text{rise}}{\\text{run}}') + ': the bottom number is how far to go right.'], 'fraction slope second point');
        } }] },
      /* ---------------- Part B ---------------- */
      { num: '8', section: 'Part B — Writing Equations of Lines', stem: 'Determine the equation of the line in the form ' + t('y=mx+b') + '.', shared: function (r) { return r.chance(0.25) ? { m: 8, b: -5 } : { m: rnz(r, -9, 9), b: rnz(r, -9, 9) }; },
        parts: [{ id: '8', level: 'BEG', outcome: 'RF7', make: function (r, sh) {
          var m = Math.abs(sh.m) === 1 ? sh.m * 2 : sh.m;
          return lineP('Slope ' + t(m) + ', ' + t('y') + '-intercept ' + t(sh.b) + '.', lineMB(m, sh.b), { form: 'slope-intercept', wrong: [{ is: { m: sh.b, b: m }, code: 'u7l10-mb-swap', hint: 'The slope multiplies ' + t('x') + '; the ' + t('y') + '-intercept is the constant.' }] },
            'Substitute ' + t('m=' + m) + ' and ' + t('b=' + sh.b) + ' into ' + t('y=mx+b') + ': ' + t(siTex(m, sh.b)), ['Put ' + t('m') + ' and ' + t('b') + ' straight into ' + t('y=mx+b') + '.'], 'equation from m and b');
        } }] },
      { num: '9', stem: 'Determine the equation of the line in the form ' + t('y=mx+b') + '.', shared: function (r) { return r.chance(0.25) ? { m: Q(-2, 3), b: 9 } : { m: sl(r, [[2, 3], [1, 2], [3, 4], [2, 5], [3, 5], [4, 3], [5, 2]]), b: rnz(r, -9, 9) }; },
        parts: [{ id: '9', level: 'BEG', outcome: 'RF7', make: function (r, sh) {
          return lineP('Slope ' + t(qT(sh.m)) + ', ' + t('y') + '-intercept ' + t(sh.b) + '.', lineMB(sh.m, sh.b), { form: 'slope-intercept' }, 'Substitute: ' + t(siTex(sh.m, sh.b)), ['Put ' + t('m') + ' and ' + t('b') + ' straight into ' + t('y=mx+b') + '. Keep the fraction as it is.'], 'equation from fraction m and b');
        } }] },
      { num: '10', stem: 'Determine the equation of the line in the form ' + t('y=mx+b') + '.', shared: function (r) { if (r.chance(0.25)) return { m: 5, P: [2, 4] }; return gen(r, function (r) { var m = r.int(2, 6), P = [r.int(1, 4), r.int(-3, 9)], b = P[1] - m * P[0]; return b ? { m: m, P: P } : null; }); },
        parts: [{ id: '10', level: 'PRG', outcome: 'RF7', make: function (r, sh) {
          return lineP('Slope ' + t(sh.m) + ' through the point ' + t(ptT(sh.P)) + '.', lineMP(sh.m, sh.P), { form: 'slope-intercept', point: sh.P, wrong: mpWrongs(Q(sh.m), sh.P) }, bSteps(sh.m, sh.P), SIH, 'slope and a point');
        } }] },
      { num: '11', stem: 'Determine the equation of the line in the form ' + t('y=mx+b') + '.', shared: function (r) { if (r.chance(0.25)) return { m: -3, P: [-2, 7] }; return gen(r, function (r) { var m = -r.int(2, 5), P = [-r.int(1, 4), r.int(-2, 10)], b = P[1] - m * P[0]; return b && Math.abs(b) <= 12 ? { m: m, P: P } : null; }); },
        parts: [{ id: '11', level: 'PRG', outcome: 'RF7', make: function (r, sh) {
          return lineP('Slope ' + t(sh.m) + ' through the point ' + t(ptT(sh.P)) + '.', lineMP(sh.m, sh.P), { form: 'slope-intercept', point: sh.P, wrong: mpWrongs(Q(sh.m), sh.P) }, bSteps(sh.m, sh.P), SIH.concat(['A negative times a negative is positive.']), 'slope and a point, negatives');
        } }] },
      { num: '12', stem: 'Determine the equation of the line in the form ' + t('y=mx+b') + '.', shared: function (r) { if (r.chance(0.25)) return { A: [1, 2], B: [4, 14] }; return gen(r, function (r) { var m = r.int(2, 5), x1 = r.int(1, 3), x2 = x1 + r.int(2, 4), y1 = r.int(-4, 6), b = y1 - m * x1; return b && !(m === 4 && b === -5) && !(m === 3 && b === 1) ? { A: [x1, y1], B: [x2, y1 + m * (x2 - x1)] } : null; }); },   // never the notes’ lines y = 4x − 5, y = 3x + 1
        parts: [{ id: '12', level: 'PRG', outcome: 'RF7', make: function (r, sh) {
          var m = Q(sh.B[1] - sh.A[1], sh.B[0] - sh.A[0]);
          return lineP('Through ' + t(ptT(sh.A)) + ' and ' + t(ptT(sh.B)) + '.', line2(sh.A, sh.B), { form: 'slope-intercept', wrong: mpWrongs(m, sh.A).concat([{ is: { m: Q(m[1], m[0]), b: qs(sh.A[1], qm(Q(m[1], m[0]), sh.A[0])) }, code: 'line-slope-flip', hint: 'Slope is rise over run: change in ' + t('y') + ' on top.' }]) },
            'Step 1: ' + slopeSteps(sh.A, sh.B) + '<br>Step 2: ' + bSteps(m, sh.A), ['Step 1: find the slope. Step 2: substitute the slope and either point into ' + t('y=mx+b') + '.'], 'two points');
        } }] },
      { num: '13', stem: 'Determine the equation of the line in the form ' + t('y=mx+b') + '.', shared: function (r) { if (r.chance(0.25)) return { A: [-2, 11], B: [4, -1] }; return gen(r, function (r) { var m = -r.int(1, 4), x1 = -r.int(1, 4), x2 = r.int(1, 4), b = rnz(r, -6, 8); return m === -2 && b === 4 ? null : { A: [x1, b + m * x1], B: [x2, b + m * x2] }; }); },   // never the notes’ line y = −2x + 4
        parts: [{ id: '13', level: 'PRG', outcome: 'RF7', make: function (r, sh) {
          var m = Q(sh.B[1] - sh.A[1], sh.B[0] - sh.A[0]);
          return lineP('Through ' + t(ptT(sh.A)) + ' and ' + t(ptT(sh.B)) + '.', line2(sh.A, sh.B), { form: 'slope-intercept', wrong: mpWrongs(m, sh.A).concat([{ is: { m: qn(m), b: qs(sh.B[1], qm(qn(m), sh.B[0])) }, code: 'u7l10-sub-order', hint: 'Subtract in the same order on top and bottom: ' + t('\\frac{y_2-y_1}{x_2-x_1}') + '.' }]) },
            'Step 1: ' + slopeSteps(sh.A, sh.B) + '<br>Step 2: ' + bSteps(m, sh.B), ['Step 1: slope. Step 2: substitute either point.', 'Watch the double negatives.'], 'two points, negative slope');
        } }] },
      /* ---------------- Part C ---------------- */
      { num: '14', section: 'Part C — General Form, Horizontal and Vertical Lines', shared: function (r) { return r.chance(0.25) ? { m: 6, b: -11 } : { m: rnz(r, -9, 9), b: rnz(r, -12, 12) }; },
        parts: [{ id: '14', level: 'BEG', outcome: 'RF6', make: function (r, sh) {
          var L = lineMB(sh.m, sh.b);
          return lineP('Convert ' + t(siTex(sh.m, sh.b)) + ' to general form.', L, { form: 'general' }, genSteps(sh.m, sh.b), GENH, 'to general form');
        } }] },
      { num: '15', shared: function (r) { if (r.chance(0.25)) return { A: 5, B: 3, b: -5 }; return gen(r, function (r) { var Bc = r.int(2, 5), A = rnz(r, -7, 7), b = rnz(r, -6, 6); return gcd(A, Bc) === 1 ? { A: A, B: Bc, b: b } : null; }); },
        parts: [{ id: '15', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          var m = Q(sh.A, sh.B), L = lineMB(m, sh.b), shown = { A: sh.A < 0 ? -sh.A : sh.A, B: sh.A < 0 ? sh.B : -sh.B, C: sh.A < 0 ? -sh.B * sh.b : sh.B * sh.b };
          var eqS = pol([[shown.A, 'x'], [shown.B, 'y'], [shown.C, '']]) + '=0';
          return lineP('Convert ' + t(eqS) + ' to slope–intercept form, simplifying the slope fully.', L, { form: 'slope-intercept', wrong: [{ is: { m: qn(m), b: sh.b }, code: 'u7l10-m-sign', hint: 'Dividing by a negative changes every sign.' }, { is: { m: m, b: -sh.b }, code: 'line-b-sign', hint: 'Check the sign of the constant after dividing.' }] },
            siFromGen(shown), ['Keep the ' + t('y') + '-term on one side, move the rest, then divide every term by the coefficient of ' + t('y') + '.'], 'general to slope-intercept');
        } }] },
      { num: '16', shared: function (r) { if (r.chance(0.25)) return { a: 5, b: 4 }; return gen(r, function (r) { var a = rnz(r, -6, 6), b = rnz(r, -6, 6); return Math.abs(a) > 1 && Math.abs(b) > 1 && a !== b ? { a: a, b: b } : null; }); },
        parts: [{ id: '16', level: 'BEG', outcome: 'RF5', make: function (r, sh) {
          var L = line2([sh.a, 0], [0, sh.b]);
          return intsP('Determine the ' + t('x') + '- and ' + t('y') + '-intercepts of ' + t(gT(L)) + ' directly, without converting first.', L, intSteps(L), ['For the ' + t('x') + '-intercept set ' + t('y=0') + '; for the ' + t('y') + '-intercept set ' + t('x=0') + '.'], 'intercepts of general form');
        } }] },
      { num: '17', shared: function (r) { return r.chance(0.25) ? { k: -8 } : { k: rnz(r, -14, 14) }; },
        parts: [{ id: '17', level: 'BEG', outcome: 'RF6', make: function (r, sh) {
          var k = sh.k;
          return mc(r, 'Is the graph of ' + t('y=' + k) + ' horizontal or vertical? Which point is on it?', [
            { html: 'Horizontal; e.g. ' + t(ptT([0, k])), right: true }, { html: 'Vertical; e.g. ' + t(ptT([k, 0])), why: t('y=' + k) + ' means every point has ' + t('y') + '-coordinate ' + t(k) + ': a <b>horizontal</b> line.' },
            { html: 'Horizontal; e.g. ' + t(ptT([k, 0])), why: 'Right type — but on this line the <b>' + t('y') + '</b>-coordinate is always ' + t(k) + '.' }, { html: 'Vertical; e.g. ' + t(ptT([0, k])), why: 'Every point has ' + t('y=' + k) + ', so the line runs across: horizontal.' }],
            t('y=' + k) + ': every point has ' + t('y') + '-coordinate ' + t(k) + ', whatever ' + t('x') + ' is — a <b>horizontal</b> line (slope 0). E.g. ' + t(ptT([0, k])) + ' or ' + t(ptT([3, k])) + '.', ['Which coordinate is fixed?'], 'y = k');
        } }] },
      { num: '18', shared: function (r) { return r.chance(0.25) ? { k: 9 } : { k: rnz(r, -14, 14) }; },
        parts: [{ id: '18', level: 'BEG', outcome: 'RF6', make: function (r, sh) {
          var k = sh.k;
          return mc(r, 'Is the graph of ' + t('x=' + k) + ' horizontal or vertical? Which point is on it?', [
            { html: 'Vertical; e.g. ' + t(ptT([k, 0])), right: true }, { html: 'Horizontal; e.g. ' + t(ptT([0, k])), why: t('x=' + k) + ' means every point has ' + t('x') + '-coordinate ' + t(k) + ': a <b>vertical</b> line.' },
            { html: 'Vertical; e.g. ' + t(ptT([0, k])), why: 'Right type — but on this line the <b>' + t('x') + '</b>-coordinate is always ' + t(k) + '.' }, { html: 'Horizontal; e.g. ' + t(ptT([k, 0])), why: 'Every point has ' + t('x=' + k) + ', so the line runs up and down: vertical.' }],
            t('x=' + k) + ': every point has ' + t('x') + '-coordinate ' + t(k) + ' — a <b>vertical</b> line (slope undefined). E.g. ' + t(ptT([k, 0])) + '.', ['Which coordinate is fixed?'], 'x = k');
        } }] },
      { num: '19', shared: function (r) { if (r.chance(0.25)) return { a: 3, s: 3 }; return { a: r.pick([2, 3, 4, 5, -2, -3]), s: rnz(r, -5, 5) }; },
        parts: [{ id: '19', level: 'BEG', outcome: 'RF5', make: function (r, sh) {
          var L = L3(sh.a, -1, -sh.a * sh.s);
          return intsP('For ' + t(gT(L)) + ', state the ' + t('x') + '- and ' + t('y') + '-intercepts you would plot to graph it by the two-intercept method.', L, intSteps(L), ['Set ' + t('y=0') + ' for the ' + t('x') + '-intercept, ' + t('x=0') + ' for the ' + t('y') + '-intercept.'], 'two-intercept method');
        } }] },
      /* ---------------- Part D ---------------- */
      { num: '20', section: 'Part D — Slope in Context', shared: function (r) { return r.chance(0.25) ? { F: 30, rate: 0.05 } : { F: r.pick([20, 25, 30, 35, 40, 45]), rate: r.pick([0.05, 0.1, 0.04, 0.02, 0.15]) }; },
        stem: function (sh) { return 'A cell-phone plan costs ' + $(sh.F) + ' to start, plus ' + $(sh.rate) + ' per minute of calls. Let ' + t('C') + ' be the total cost (dollars) after ' + t('m') + ' minutes.'; },
        parts: [
          { id: '20a', level: 'BEG', outcome: 'RF4', make: function (r, sh) { return ctxLine('Write an equation for ' + t('C') + ' in terms of ' + t('m') + '.', sh.rate, sh.F, { X: 'm', Y: 'C' }, 'Rate ' + $(sh.rate) + ' per minute (slope), start ' + $(sh.F) + ' (intercept): ' + t(ctxTex('C', 'm', sh.rate, sh.F)), ['The “per minute” amount is the slope; the starting cost is the intercept.'], 'phone plan equation'); } },
          { id: '20b', level: 'BEG', outcome: 'RF3', make: function (r, sh) {
            return mc(r, 'What do the slope and the ' + t('C') + '-intercept represent?', [
              { html: 'Slope: the cost of calls, ' + $(sh.rate) + ' per minute. ' + t('C') + '-intercept: the ' + $(sh.F) + ' base cost, before any minutes are used.', right: true },
              { html: 'Slope: the ' + $(sh.F) + ' base cost. ' + t('C') + '-intercept: ' + $(sh.rate) + ' per minute.', why: 'Swapped: the slope is the “per minute” rate; the intercept is the cost at 0 minutes.' },
              { html: 'Slope: ' + t(nf(sh.rate)) + ' minutes per dollar. ' + t('C') + '-intercept: the ' + $(sh.F) + ' base cost.', why: 'The slope’s units are upside down: dollars per minute.' },
              { html: 'Slope: the total cost of the calls. ' + t('C') + '-intercept: the number of minutes used.', why: 'The slope is a rate (a “per” amount); the intercept is a dollar amount.' }],
              'Slope ' + t(nf(sh.rate)) + ': dollars per minute of calls. Intercept ' + t(sh.F) + ': the base cost in dollars when ' + t('m=0') + '.', ['Slope = rate (per minute); intercept = value when ' + t('m=0') + '.'], 'meaning of slope and intercept');
          } }] },
      { num: '21', shared: function (r) { return r.chance(0.25) ? { V0: 500, tt: 4, q: 30 } : { V0: r.pick([300, 400, 450, 500, 600, 800]), tt: r.int(2, 6), q: r.pick([10, 15, 20, 25, 30, 40]) }; },
        parts: [{ id: '21', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          var V1 = sh.V0 - sh.q * sh.tt;
          return num('A tank contains ' + t(sh.V0) + ' L of water and is being drained at a constant rate. After ' + t(sh.tt) + ' minutes it contains ' + t(V1) + ' L. Determine the drain rate (the slope) in L/min.', -sh.q,
            [{ v: sh.q, code: 'ctx-rate-sign', hint: 'The volume is going down, so the slope is negative.' }, { v: V1 - sh.V0, code: 'ctx-total', hint: 'That’s the total change. Divide by the ' + t(sh.tt) + ' minutes.' }, { v: sh.tt / (V1 - sh.V0), code: 'ctx-flip', hint: 'Upside down: litres (change in volume) over minutes.' }],
            t('m=\\dfrac{' + V1 + '-' + sh.V0 + '}{' + sh.tt + '-0}=\\dfrac{' + (V1 - sh.V0) + '}{' + sh.tt + '}=' + (-sh.q)) + ' L/min', ['The points are ' + t('(0,\\ ' + sh.V0 + ')') + ' and ' + t('(' + sh.tt + ',\\ ' + V1 + ')') + '.'], 'drain rate', { before: t('m='), after: 'L/min' });
        } }] },
      /* ---------------- Part E ---------------- */
      { num: '22', section: 'Part E — Mixed Review', shared: function (r) { if (r.chance(0.25)) return { V0: 200, q: 45, t1: 6, T: 9 }; return gen(r, function (r) { var q = r.pick([25, 30, 35, 40, 45, 50]), V0 = r.pick([100, 150, 200, 250, 300]), t1 = r.int(3, 8), T = r.int(5, 14); return T !== t1 ? { V0: V0, q: q, t1: t1, T: T } : null; }); },
        stem: function (sh) { return 'A hot tub already contains ' + t(sh.V0) + ' L of water and fills at a constant ' + t(sh.q) + ' L per minute.'; },
        parts: [
          { id: '22a', level: 'BEG', outcome: 'RF4', make: function (r, sh) { return ctxLine('(a) Write an equation for the volume ' + t('V') + ' (litres) after ' + t('t') + ' minutes.', sh.q, sh.V0, { X: 't', Y: 'V' }, t(ctxTex('V', 't', sh.q, sh.V0)) + ' (rate ' + t(sh.q) + ' L/min, start ' + t(sh.V0) + ' L)', ['Rate times ' + t('t') + ', plus the starting amount.'], 'hot tub equation'); } },
          { id: '22b', level: 'BEG', outcome: 'RF4', make: function (r, sh) { var v = sh.q * sh.t1 + sh.V0; return num('(b) Determine the volume after ' + t(sh.t1) + ' minutes.', v, [{ v: sh.q * sh.t1, code: 'ctx-no-b', hint: 'Add the ' + t(sh.V0) + ' L already in the tub.' }], t('V=' + sh.q + '(' + sh.t1 + ')+' + sh.V0 + '=' + v) + ' L', ['Substitute ' + t('t=' + sh.t1) + '.'], 'hot tub volume', { after: 'L' }); } },
          { id: '22c', level: 'PRG', outcome: 'RF4', make: function (r, sh) { var V = sh.q * sh.T + sh.V0; return num('(c) How many minutes until the hot tub reaches ' + t(V) + ' L?', sh.T, [{ v: V / sh.q, code: 'ctx-no-sub', hint: 'Subtract the ' + t(sh.V0) + ' L first, then divide.' }, { v: V - sh.V0, code: 'ctx-part', hint: 'Now divide by ' + t(sh.q) + ' L per minute.' }], t(V + '=' + sh.q + 't+' + sh.V0 + '\\Rightarrow ' + sh.q + 't=' + (V - sh.V0) + '\\Rightarrow t=' + sh.T) + ' min', ['Set ' + t('V=' + V) + ' and solve for ' + t('t') + '.'], 'hot tub time', { after: 'min' }); } }] },
      { num: '23', shared: function (r) { if (r.chance(0.25)) return { h0: 24, q: 3, t1: 5 }; return gen(r, function (r) { var q = r.pick([2, 3, 4, 5]), T = r.int(5, 10), h0 = q * T; return h0 <= 40 ? { h0: h0, q: q, t1: r.int(1, T - 1) } : null; }); },
        stem: function (sh) { return 'A candle is ' + t(sh.h0) + ' cm tall when lit and burns at a constant ' + t(sh.q) + ' cm per hour. Let ' + t('h') + ' be its height (cm) after ' + t('t') + ' hours.'; },
        parts: [
          { id: '23a', level: 'PRG', outcome: 'RF4', make: function (r, sh) { return ctxLine('(a) Write an equation for ' + t('h') + ' in terms of ' + t('t') + '.', -sh.q, sh.h0, { X: 't', Y: 'h' }, 'It loses ' + t(sh.q) + ' cm per hour (slope ' + t(-sh.q) + ') from ' + t(sh.h0) + ' cm: ' + t(ctxTex('h', 't', -sh.q, sh.h0)), ['Burning makes the height go down: negative slope.'], 'candle equation'); } },
          { id: '23b', level: 'BEG', outcome: 'RF4', make: function (r, sh) { var v = sh.h0 - sh.q * sh.t1; return num('(b) Determine the candle’s height after ' + t(sh.t1) + ' hours.', v, [{ v: sh.q * sh.t1, code: 'ctx-change', hint: 'That’s how much has burned. How tall is it now?' }, { v: sh.h0 + sh.q * sh.t1, code: 'ctx-rate-sign', hint: 'The candle gets shorter — subtract.' }], t('h=-' + sh.q + '(' + sh.t1 + ')+' + sh.h0 + '=' + v) + ' cm', ['Substitute ' + t('t=' + sh.t1) + '.'], 'candle height', { after: 'cm' }); } },
          { id: '23c', level: 'PRG', outcome: 'RF4', make: function (r, sh) { var T = sh.h0 / sh.q; return num('(c) When will the candle burn out completely (when will ' + t('h=0') + ')?', T, [{ v: sh.h0, code: 'ctx-tint-b', hint: 'Set ' + t('h=0') + ' and solve for ' + t('t') + '.' }, { v: sh.h0 * sh.q, code: 'value', hint: 'Divide the height by the rate.' }], t('0=-' + sh.q + 't+' + sh.h0 + '\\Rightarrow t=' + T) + ' h', ['Burned out means ' + t('h=0') + '.'], 'candle burns out', { before: t('t='), after: 'h' }); } }] },
      { num: '24', shared: function (r) { if (r.chance(0.25)) return { q: 40, H0: 110, y1: 2, y2: 5, y3: 9 }; return gen(r, function (r) { var q = r.pick([20, 25, 30, 35, 40, 50]), H0 = r.pick(steps(50, 150, 10)), y1 = r.int(1, 3), y2 = y1 + r.int(2, 4), y3 = y2 + r.int(2, 5); return { q: q, H0: H0, y1: y1, y2: y2, y3: y3 }; }); },
        stem: function (sh) { return 'A tree measured ' + t(sh.H0 + sh.q * sh.y1) + ' cm tall ' + t(sh.y1) + (sh.y1 === 1 ? ' year' : ' years') + ' after planting and ' + t(sh.H0 + sh.q * sh.y2) + ' cm tall ' + t(sh.y2) + ' years after planting, growing at a constant rate.'; },
        parts: [
          { id: '24a', level: 'PRG', outcome: 'RF7', make: function (r, sh) {
            var P1 = [sh.y1, sh.H0 + sh.q * sh.y1], P2 = [sh.y2, sh.H0 + sh.q * sh.y2];
            return ctxLine('(a) Determine an equation for the height ' + t('H') + ' (cm) in terms of the years ' + t('y') + ' since planting.', sh.q, sh.H0, { X: 'y', Y: 'H', wrong: [{ m: sh.q, b: P1[1], code: 'ctx-b-point', hint: t(P1[1]) + ' cm is the height after ' + t(sh.y1) + ' years. Substitute the point to find ' + t('b') + ' (the height at planting).' }, { m: (P2[1] - P1[1]), b: P1[1] - (P2[1] - P1[1]) * sh.y1, code: 'ctx-total', hint: 'Divide the change in height by the change in years to get the slope.' }] },
              'Slope: ' + t('m=\\dfrac{' + P2[1] + '-' + P1[1] + '}{' + sh.y2 + '-' + sh.y1 + '}=\\dfrac{' + (P2[1] - P1[1]) + '}{' + (sh.y2 - sh.y1) + '}=' + sh.q) + '<br>' + t(P1[1] + '=' + sh.q + '(' + sh.y1 + ')+b\\Rightarrow b=' + sh.H0) + '<br>' + t('H=' + sh.q + 'y+' + sh.H0), ['Find the slope from the two (year, height) points, then substitute one to find ' + t('b') + '.'], 'tree equation');
          } },
          { id: '24b', level: 'BEG', outcome: 'RF3', make: function (r, sh) {
            return mc(r, '(b) What does the slope represent in this situation?', [
              { html: 'The tree grows ' + t(sh.q) + ' cm every year.', right: true }, { html: 'The tree was ' + t(sh.q) + ' cm tall when it was planted.', why: 'That would be the intercept. The slope is a rate: cm per year.' },
              { html: 'The tree grows ' + t(sh.q) + ' years every centimetre.', why: 'Units upside down: centimetres per year.' }, { html: 'The tree is ' + t(sh.q) + ' cm tall after one year.', why: 'After one year it is ' + t(sh.q + sh.H0) + ' cm. The slope is how much it grows each year.' }],
              'The slope ' + t(sh.q) + ' is in cm per year: the tree grows ' + t(sh.q) + ' cm each year.', ['Units of the slope: cm per year.'], 'tree slope meaning');
          } },
          { id: '24c', level: 'PRG', outcome: 'RF4', make: function (r, sh) { var v = sh.q * sh.y3 + sh.H0; return num('(c) Predict the height of the tree when it is ' + t(sh.y3) + ' years old.', v, [{ v: sh.q * sh.y3, code: 'ctx-no-b', hint: 'Add the height at planting, ' + t(sh.H0) + ' cm.' }, { v: (sh.H0 + sh.q * sh.y1) + sh.q * sh.y3, code: 'ctx-b-point', hint: 'Use the height at planting (' + t('b') + ' from (a)), not the first measurement.' }], t('H=' + sh.q + '(' + sh.y3 + ')+' + sh.H0 + '=' + v) + ' cm', ['Substitute ' + t('y=' + sh.y3) + ' into your equation.'], 'predict tree height', { after: 'cm' }); } }] },
      { num: '25', shared: function (r) {
          if (r.chance(0.25)) return { m: 3, C: [-2, -7], D: [2, 5], P: [1, -2], R: [0, 4] };
          return gen(r, function (r) { var m = r.pick([2, 3, 4, -2, -3, -4]), C = [-r.int(1, 3), r.int(-8, 2)], dx = r.int(2, 4), D = [C[0] + dx, C[1] + m * dx]; if (Math.abs(D[1]) > 12) return null; var P = [r.int(-3, 4), r.int(-5, 5)], R = [0, rnz(r, -6, 6)]; if (onL(line2(C, D), P)) return null; return { m: m, C: C, D: D, P: P, R: R }; });
        },
        stem: function (sh) { var D = sh.D; return 'Segment ' + t('CD') + ' joins ' + t('C' + ptT(sh.C)) + ' and ' + t('D' + ptT(D)) + '.'; },
        parts: [
          { id: '25a', level: 'BEG', outcome: 'RF3', make: function (r, sh) { var D = sh.D; return slopeP('(a) Determine the slope of ' + t('CD') + '.', Q(sh.m), [{ v: Q(1, sh.m), code: 'slope-flip', hint: 'Rise over run: change in ' + t('y') + ' on top.' }], slopeSteps(sh.C, D), ['Use ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + '.'], 'slope of segment'); } },
          { id: '25b', level: 'PRG', outcome: 'RF7', make: function (r, sh) { var m = Q(sh.m); return lineP('(b) Line ' + t('L_1') + ' is parallel to ' + t('CD') + ' through ' + t(ptT(sh.P)) + '. Determine its equation in slope–intercept form.', lineMP(m, sh.P), { form: 'slope-intercept', wrong: mpWrongs(m, sh.P).concat([{ is: { m: perpS(m), b: qs(sh.P[1], qm(perpS(m), sh.P[0])) }, code: 'u7l10-par', hint: 'Parallel lines have <b>equal</b> slopes, not negative reciprocals.' }]) }, 'Parallel: same slope, ' + t('m=' + sh.m) + '.<br>' + bSteps(m, sh.P), ['Parallel lines have equal slopes.'], 'parallel line'); } },
          { id: '25c', level: 'ADV', outcome: 'RF7', make: function (r, sh) {
            var mp = perpS(Q(sh.m)), L = lineMP(mp, sh.R), b = qs(sh.R[1], qm(mp, sh.R[0]));
            return lineP('(c) Line ' + t('L_2') + ' is perpendicular to ' + t('CD') + ' through ' + t(ptT(sh.R)) + '. Determine its equation in general form.', L, { form: 'general', wrong: [{ is: lineMP(Q(sh.m), sh.R), code: 'u7l10-perp', hint: 'That line is parallel. A perpendicular slope is the <b>negative reciprocal</b>: ' + t(qT(mp)) + '.' }, { is: lineMP(qn(Q(sh.m)), sh.R), code: 'line-perp', hint: 'Take the reciprocal too: the perpendicular slope is ' + t(qT(mp)) + '.' }, { is: lineMP(Q(1, sh.m), sh.R), code: 'line-perp', hint: 'Change the sign too: the perpendicular slope is ' + t(qT(mp)) + '.' }] },
              'Perpendicular slope: ' + t('-\\dfrac{1}{' + sh.m + '}=' + qT(mp)) + '. ' + (sh.R[0] === 0 ? 'The point ' + t(ptT(sh.R)) + ' is the ' + t('y') + '-intercept, so ' + t('b=' + qT(b)) + '.' : '') + '<br>' + genSteps(mp, b), ['Perpendicular slopes are negative reciprocals.'].concat(GENH), 'perpendicular line, general form');
          } }] },
      { num: '26', shared: function (r) { if (r.chance(0.25)) return { A: [-5, 2], B: [1, -10] }; return gen(r, function (r) { var m = r.pick([-2, -3, 2, 3, -4]), b = rnz(r, -9, 9), x1 = -r.int(1, 5), x2 = r.int(1, 3); if (b % m !== 0) return null; var A = [x1, m * x1 + b], B2 = [x2, m * x2 + b]; return A[1] && B2[1] ? { A: A, B: B2 } : null; }); },   // whole-number intercepts (no calculator)
        stem: function (sh) { return 'The line through ' + t(ptT(sh.A)) + ' and ' + t(ptT(sh.B)) + ' crosses the ' + t('x') + '-axis at point ' + t('A') + ' and the ' + t('y') + '-axis at point ' + t('B') + '.'; },
        parts: [
          { id: '26a', level: 'ADV', outcome: 'RF7', make: function (r, sh) { var L = line2(sh.A, sh.B), m = slopeOf(L); return lineP('(a) Determine the equation of the line in general form.', L, { form: 'general' }, 'Step 1: ' + slopeSteps(sh.A, sh.B) + '<br>Step 2: ' + bSteps(m, sh.A) + '<br>General form: ' + t(gT(L)), ['Find ' + t('y=mx+b') + ' first, then move every term to one side.'], 'two points to general form'); } },
          { id: '26b', level: 'ADV', outcome: 'RF5', make: function (r, sh) {
            var L = line2(sh.A, sh.B), xi = xint(L), yi = yint(L);
            var p = B.fields('(b) State the coordinates of ' + t('A') + ' and ' + t('B') + '.', [ptFld(t('A') + ':'), ptFld(t('B') + ':')], [ptChk([xi, 0], 'x'), ptChk([0, yi], 'y')], [ptK([xi, 0]), ptK([0, yi])], t('A' + ptT([xi, 0])) + ', ' + t('B' + ptT([0, yi])),
              intSteps(L) + (isInt(xi) ? '' : '<br>(' + t(qT(xi) + '=' + nT(qv(xi)) ) + '.)'), ['' + t('A') + ' is on the ' + t('x') + '-axis (' + t('y=0') + '); ' + t('B') + ' is on the ' + t('y') + '-axis (' + t('x=0') + ').'], 'axis crossings');
            p.bad = [[ptK([0, xi]), ptK([yi, 0])]];
            return p;
          } }] }
    ],
    extra: []
  };

  /* ================================================================================================= */
  /* Extra practice (u7_EP10.tex) */
  function whichChk(right, all) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').trim().toLowerCase().replace(/^(plan|company)\s*/, '').replace(/[.\s]+$/, '');
      if (!s) return form('empty', 'Type the letter of your answer (' + all.join(' or ') + ').');
      if (s === right.toLowerCase()) return ok();
      if (all.some(function (a) { return a.toLowerCase() === s; })) return wrong('u7l9-cheaper', 'Compare the two costs you found: the cheaper plan has the <b>smaller</b> cost.');
      return form('u7l9-letter', 'Type just the letter: ' + all.join(' or ') + '.');
    };
  }
  function costsPick(prompt, items, right, sol, hints, text) {
    var fl = items.map(function (it) { return { label: it.label, name: it.label.replace(/:\s*$/, ''), before: t('\\$') }; }).concat([{ label: 'Cheaper:', name: 'Cheaper', mode: 'text', placeholder: 'A or B' }]);
    var ch = items.map(function (it) { return K.number(cl(it.ans), dg(cleanList(it.list, cl(it.ans)))); }).concat([whichChk(right, ['A', 'B'])]);
    var keys = items.map(function (it) { return String(cl(it.ans)); }).concat([right]);
    var p = B.fields(prompt, fl, ch, keys, items.map(function (it) { return it.label + ' ' + $(it.ans); }).join('<br>') + '<br>Cheaper: <b>' + right + '</b>', sol, hints, text);
    p.bad = [keys.slice(0, -1).concat([right === 'A' ? 'B' : 'A'])];
    return p;
  }
  function tf(r, prompt, truth, why, sol, hints, text) { return B.tf(r, prompt, truth, why, sol, hints, text); }
  function ep1(r) {
    if (r.chance(0.25)) return { p: 3, q: 2, b: -4, x1: -2, k: 4, x5: 10, y5: 11, x6: -8 };
    return gen(r, function (r) {
      var q = r.pick([2, 3]), p = r.pick([1, 2, 3, 4, 5]) * (r.chance(0.65) ? 1 : -1); if (gcd(p, q) !== 1) return null;
      var b = rnz(r, -6, 6), ys = [-2, -1, 0, 1, 2].map(function (j) { return b + j * p; }); if (ys.some(function (y) { return Math.abs(y) > 12; })) return null;
      var x1 = -q * r.int(1, 2), k = r.int(2, 4), x5 = q * r.pick([4, 5]), on = r.chance(0.6), y5 = b + p * x5 / q + (on ? 0 : r.pick([-1, 1]));
      var dots = [[0, b], [q, b + p], [2 * q, b + 2 * p], [-q, b - p]].filter(function (d) { return Math.abs(d[0]) <= 6 && Math.abs(d[1]) <= 7; }); if (dots.length < 2) return null;
      return { p: p, q: q, b: b, x1: x1, k: k, x5: x5, y5: y5, x6: -4 * q };
    });
  }
  function rd(n) { return ['', 'one', 'two', 'three', 'four', 'five'][n] || String(n); }

  var EXTRA = [
    /* ---------------- Part A ---------------- */
    { num: '1', section: 'Extra practice A — One Line, Four Ways', shared: ep1,
      stem: function (sh) {
        var q = sh.q, p = sh.p, b = sh.b, xs = [-2, -1, 0, 1, 2].map(function (j) { return j * q; }), ys = xs.map(function (x) { return b + p * x / q; });
        var L = lineMB(Q(p, q), b), dots = [[0, b], [q, b + p], [2 * q, b + 2 * p], [-q, b - p], [-2 * q, b - 2 * p]].filter(function (d) { return Math.abs(d[0]) <= 6 && Math.abs(d[1]) <= 7; }).slice(0, 2);
        var P3 = [sh.x1, b + p * sh.x1 / q], P4 = [sh.x1 + sh.k * q, b + p * (sh.x1 + sh.k * q) / q], P5 = [2 * q, b + 2 * p];
        return 'The four descriptions below all belong to <b>the same straight line</b>. Answer each part from its own description alone.' +
          '<p><b>Description I — a table of values</b></p>' + HW.valueTable([[t('x')].concat(xs.map(function (x) { return t(x); })), [t('y')].concat(ys.map(function (y) { return t(y); }))]) +
          '<p><b>Description II — a graph</b></p>' + lineFig([{ L: L }], [-6, 6], [-8, 8], dots.map(function (d) { return [d[0], d[1]]; }), { max: 260, aria: 'graph of the line' }) +
          '<p><b>Description III — two points:</b> the line passes through ' + t(ptT(P3)) + ' and ' + t(ptT(P4)) + '.</p>' +
          '<p><b>Description IV — words:</b> the line ' + (p > 0 ? 'rises ' : 'falls ') + t(Math.abs(p)) + (Math.abs(p) === 1 ? ' unit' : ' units') + ' for every ' + t(q) + ' units it runs to the right, and it passes through ' + t(ptT(P5)) + '.</p>';
      },
      parts: [
        { id: 'e1a', level: 'PRG', outcome: 'RF7', make: function (r, sh) { var m = Q(sh.p, sh.q); return lineP('(a) Using <b>Description I</b> only: write the equation in the form ' + t('y=mx+b') + '.', lineMB(m, sh.b), { form: 'slope-intercept', wrong: [{ is: { m: sh.p, b: sh.b }, code: 'ctx-step', hint: t('x') + ' goes up by ' + t(sh.q) + ' each step, not by 1: divide the change in ' + t('y') + ' by ' + t(sh.q) + '.' }] }, 'Each step ' + t('x') + ' goes up ' + t(sh.q) + ' and ' + t('y') + ' changes by ' + t(sh.p) + ', so ' + t('m=\\dfrac{' + sh.p + '}{' + sh.q + '}') + '. At ' + t('x=0') + ', ' + t('y=' + sh.b) + ', so ' + t('b=' + sh.b) + ': ' + t(sT(lineMB(m, sh.b))), ['Slope = change in ' + t('y') + ' ÷ change in ' + t('x') + ' between columns; ' + t('b') + ' is the ' + t('y') + '-value when ' + t('x=0') + '.'], 'equation from table'); } },
        { id: 'e1b', level: 'PRG', outcome: 'RF7', make: function (r, sh) { var m = Q(sh.p, sh.q); return lineP('(b) Using <b>Description II</b> only: read two points off the graph, find the slope, and write the equation in the form ' + t('y=mx+b') + '.', lineMB(m, sh.b), { form: 'slope-intercept', wrong: [{ is: { m: Q(sh.q, sh.p), b: sh.b }, code: 'line-slope-flip', hint: 'Rise over run: the change in ' + t('y') + ' goes on top.' }] }, 'The marked points are on grid corners: e.g. ' + t(ptT([0, sh.b])) + ' and ' + t(ptT([sh.q, sh.b + sh.p])) + '. ' + t('m=\\dfrac{' + sh.p + '}{' + sh.q + '}') + ', ' + t('b=' + sh.b) + ': ' + t(sT(lineMB(m, sh.b))), ['Use the two marked points; the ' + t('y') + '-intercept is where the line crosses the ' + t('y') + '-axis.'], 'equation from graph'); } },
        { id: 'e1c', level: 'PRG', outcome: 'RF7', make: function (r, sh) { var m = Q(sh.p, sh.q), P3 = [sh.x1, sh.b + sh.p * sh.x1 / sh.q], P4 = [sh.x1 + sh.k * sh.q, sh.b + sh.p * (sh.x1 + sh.k * sh.q) / sh.q]; return lineP('(c) Using <b>Description III</b> only: find the slope, then solve for ' + t('b') + '. Write ' + t('y=mx+b') + '.', lineMB(m, sh.b), { form: 'slope-intercept', wrong: mpWrongs(m, P3) }, slopeSteps(P3, P4) + '<br>' + bSteps(m, P3), SIH, 'equation from two points'); } },
        { id: 'e1d', level: 'PRG', outcome: 'RF7', make: function (r, sh) { var m = Q(sh.p, sh.q), P5 = [2 * sh.q, sh.b + 2 * sh.p]; return lineP('(d) Using <b>Description IV</b> only: write the slope as a fraction, then solve for ' + t('b') + '. Write ' + t('y=mx+b') + '.', lineMB(m, sh.b), { form: 'slope-intercept', wrong: mpWrongs(m, P5) }, 'Rise ' + t(sh.p) + ' over run ' + t(sh.q) + ': ' + t('m=' + qT(m)) + '.<br>' + bSteps(m, P5), SIH, 'equation from words'); } },
        { id: 'e1e', level: 'ADV', outcome: 'RF6', make: function (r, sh) { var m = Q(sh.p, sh.q); return lineP('(e) Your four answers should be identical. Convert that equation to general form ' + t('Ax+By+C=0') + ' (' + t('A') + ', ' + t('B') + ', ' + t('C') + ' integers, ' + t('A') + ' positive). <i>(You will have to clear a fraction first.)</i>', lineMB(m, sh.b), { form: 'general' }, genSteps(m, sh.b), GENH, 'fraction to general form'); } },
        { id: 'e1f', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var m = Q(sh.p, sh.q), v = sh.b + sh.p * sh.x5 / sh.q, on = v === sh.y5, sub = t(qT(m) + '(' + sh.x5 + ')' + (sh.b < 0 ? '' : '+') + sh.b + '=' + v);
          return mc(r, '(f) Using the <i>equation</i>, not the graph: does ' + t(ptT([sh.x5, sh.y5])) + ' lie on this line?', [
            { html: (on ? 'Yes: ' : 'No: ') + sub + (on ? ', which matches the ' + t('y') + '-coordinate.' : ', not ' + t(sh.y5) + '.'), right: true },
            { html: (on ? 'No: ' : 'Yes: ') + 'the point is off the grid, so it can’t be checked.', why: 'You don’t need the graph: substitute ' + t('x=' + sh.x5) + ' into the equation.' },
            { html: (on ? 'No: ' : 'Yes: ') + sub + '.', why: 'Compare ' + t(v) + ' with the point’s ' + t('y') + '-coordinate, ' + t(sh.y5) + '.' }],
            'Substitute ' + t('x=' + sh.x5) + ': ' + sub + '. ' + (on ? 'It matches, so the point is on the line.' : 'The point has ' + t('y=' + sh.y5) + ', so it is not on the line.'), ['Substitute the ' + t('x') + '-coordinate into the equation.'], 'point check with the equation');
        } },
        { id: 'e1g', sub: 'f ii', level: 'BEG', outcome: 'RF4', make: function (r, sh) { var v = sh.b + sh.p * sh.x6 / sh.q; return valP('(f) Find the value of ' + t('y') + ' when ' + t('x=' + sh.x6) + '.', v, [{ v: sh.b - sh.p * sh.x6 / sh.q, code: 'sign', hint: 'Careful: ' + t(qT(Q(sh.p, sh.q)) + '\\times(' + sh.x6 + ')') + '.' }], t('y=' + qT(Q(sh.p, sh.q)) + '(' + sh.x6 + ')' + (sh.b < 0 ? '' : '+') + sh.b + '=' + (sh.p * sh.x6 / sh.q) + (sh.b < 0 ? '' : '+') + sh.b + '=' + v), ['Substitute ' + t('x=' + sh.x6) + '.'], 'y from x', { before: t('y=') }); } }] },
    /* ---------------- Part B ---------------- */
    { num: '2', section: 'Extra practice B — Writing Equations From Mixed Information', stem: 'Determine the equation of each line, <b>and then rewrite it in general form</b>. Read the given information carefully before you reach for ' + t('y=mx+b') + '.',
      shared: function (r) {
        if (r.chance(0.25)) return { m: Q(-3, 4), P: [8, -1], A: [-3, 8], Bp: [5, -4], v: -5, vy: [6, -2], h: -3, hx: [7, -2] };
        return gen(r, function (r) {
          var m = sl(r, [[3, 4], [2, 3], [1, 2], [3, 2], [5, 4], [1, 3]]), P = [m[1] * r.pick([1, 2, -1]), r.int(-6, 6)]; if (isInt(qs(P[1], qm(m, P[0]))) === false) return null;
          var m2 = sl(r, [[3, 2], [2, 3], [1, 2], [5, 2], [1, 4]]), x1 = -r.int(1, 4), A = [x1, r.int(-4, 9)], Bp = [x1 + m2[1] * r.int(2, 4), 0]; Bp[1] = A[1] + m2[0] * (Bp[0] - x1) / m2[1]; if (Math.abs(Bp[1]) > 14) return null;
          return { m: m, P: P, A: A, Bp: Bp, v: rnz(r, -8, 8), vy: [r.int(-6, 6), r.int(-6, 6)], h: rnz(r, -12, 12), hx: [r.int(-6, 8), r.int(-6, 8)] };
        });
      },
      parts: [
        { id: 'e2a', level: 'PRG', outcome: 'RF7', make: function (r, sh) {
          var L = lineMP(sh.m, sh.P), b = yint(L);
          var p = B.fields('(a) Slope ' + t(qT(sh.m)) + ', passing through ' + t(ptT(sh.P)) + '.', [eqFld(t('y=mx+b') + ':'), eqFld('General form:', null, 'e.g. 2x + 3y - 6 = 0')], [eqChk(L, { form: 'slope-intercept', point: sh.P }), eqChk(L, { form: 'general' })], [sT(L), gT(L)], t(sT(L)) + ', ' + t(gT(L)), bSteps(sh.m, sh.P) + '<br>' + genSteps(sh.m, b), SIH.concat(GENH), 'slope and point, both forms');
          p.bad = [[siTex(sh.m, sh.P[1]), gT(lineMB(sh.m, sh.P[1]))]]; return p;
        } },
        { id: 'e2b', level: 'ADV', outcome: 'RF7', make: function (r, sh) {
          var L = line2(sh.A, sh.Bp), m = slopeOf(L), b = yint(L);
          var p = B.fields('(b) Passing through ' + t(ptT(sh.A)) + ' and ' + t(ptT(sh.Bp)) + '.', [eqFld(t('y=mx+b') + ':'), eqFld('General form:', null, 'e.g. 2x + 3y - 6 = 0')], [eqChk(L, { form: 'slope-intercept' }), eqChk(L, { form: 'general' })], [sT(L), gT(L)], t(sT(L)) + ', ' + t(gT(L)), slopeSteps(sh.A, sh.Bp) + '<br>' + bSteps(m, sh.A) + '<br>' + genSteps(m, b), ['Slope first, then ' + t('b') + ' (it may be a fraction), then clear the fractions.'], 'two points, both forms');
          p.bad = [[sT(lineMB(qn(m), b)), gT(lineMB(qn(m), b))]]; return p;
        } },
        { id: 'e2c', level: 'PRG', outcome: 'RF7', make: function (r, sh) {
          var L = L3(1, 0, -sh.v);
          var p = B.fields('(c) Passing through ' + t(ptT([sh.v, sh.vy[0]])) + ' and ' + t(ptT([sh.v, sh.vy[1] === sh.vy[0] ? sh.vy[0] + 3 : sh.vy[1]])) + '.', [eqFld('Equation:'), eqFld('General form:', null, 'e.g. x - 4 = 0')], [eqChk(L, {}), eqChk(L, { form: 'general' })], ['x=' + sh.v, gT(L)], t('x=' + sh.v) + ', ' + t(gT(L)),
            'Both points have ' + t('x=' + sh.v) + ': the run is 0, so the line is <b>vertical</b>: ' + t('x=' + sh.v) + '. General form: ' + t(gT(L)) + '.', ['Look at the ' + t('x') + '-coordinates before you find the slope.'], 'vertical line both forms');
          p.bad = [['y=' + sh.v, gT(L3(0, 1, -sh.v))]]; return p;
        } },
        { id: 'e2d', level: 'PRG', outcome: 'RF7', make: function (r, sh) {
          var L = L3(0, 1, -sh.h), x2 = sh.hx[1] === sh.hx[0] ? sh.hx[0] - 4 : sh.hx[1];
          var p = B.fields('(d) Passing through ' + t(ptT([sh.hx[0], sh.h])) + ' and ' + t(ptT([x2, sh.h])) + '.', [eqFld('Equation:'), eqFld('General form:', null, 'e.g. y + 3 = 0')], [eqChk(L, {}), eqChk(L, { form: 'general' })], ['y=' + sh.h, gT(L)], t('y=' + sh.h) + ', ' + t(gT(L)),
            'Both points have ' + t('y=' + sh.h) + ': the rise is 0, so the slope is 0 — a horizontal line: ' + t('y=' + sh.h) + ' (that is ' + t('y=0x' + (sh.h < 0 ? '' : '+') + sh.h) + '). General form: ' + t(gT(L)) + ' (here ' + t('A=0') + ').', ['Look at the ' + t('y') + '-coordinates.'], 'horizontal line both forms');
          p.bad = [['x=' + sh.h, gT(L3(1, 0, -sh.h))]]; return p;
        } },
        { id: 'e2e', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          return mc(r, '(e) Exactly one of the four lines <b>cannot</b> be written in the form ' + t('y=mx+b') + ' — and line (d), ' + t('y=' + sh.h) + ', looks odd but can. Which one cannot, and why?', [
            { html: 'Line (c), ' + t('x=' + sh.v) + ': it is vertical, so its slope is undefined and there is no ' + t('m') + ' to use. Line (d) can, because slope 0 is a number: ' + t('y=0x' + (sh.h < 0 ? '' : '+') + sh.h) + '.', right: true },
            { html: 'Line (d), ' + t('y=' + sh.h) + ': it has no ' + t('x') + '-term, so it has no slope.', why: 'A horizontal line has slope 0, which is a number: ' + t('y=0x' + (sh.h < 0 ? '' : '+') + sh.h) + '.' },
            { html: 'Line (b): its ' + t('y') + '-intercept is a fraction.', why: 'Fractions are allowed in ' + t('y=mx+b') + '.' },
            { html: 'Line (c), ' + t('x=' + sh.v) + ': because its slope is 0.', why: 'Right line, wrong reason: a vertical line’s slope is <b>undefined</b> (the run is 0); slope 0 is horizontal.' }],
            'A vertical line has run 0, so its slope is undefined — there is no number ' + t('m') + ' for ' + t('y=mx+b') + '. A horizontal line has slope 0, which works: ' + t('y=0x' + (sh.h < 0 ? '' : '+') + sh.h) + '.', ['Undefined slope vs slope 0.'], 'which cannot be y = mx + b');
        } }] },
    { num: '3', shared: function (r) {
        if (r.chance(0.25)) return { p: 2, q: 3, f: 2, C: 9, P: [-6, 5] };
        return gen(r, function (r) { var q = r.pick([2, 3, 4]), p = r.pick([1, 2, 3, 5]) * (r.chance(0.6) ? 1 : -1), f = r.pick([1, 2]), C = rnz(r, -11, 11); if (gcd(p, q) !== 1 || (f === 1 && q === 1) || C % (f * q) === 0) return null; var P = [q * r.pick([-2, -1, 1, 2]), r.int(-6, 6)]; return { p: p, q: q, f: f, C: C, P: P }; });
      },
      stem: function (sh) { return 'Line ' + t('L') + ' has equation ' + t(pol([[sh.f * sh.p, 'x'], [-sh.f * sh.q, 'y'], [sh.C, '']]) + '=0') + '.'; },
      parts: [
        { id: 'e3a', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          var Lr = { A: sh.f * sh.p, B: -sh.f * sh.q, C: sh.C }, L = toL3(Lr), m = Q(sh.p, sh.q);
          var p = B.fields('(a) Convert ' + t('L') + ' to slope–intercept form and state its slope.', [eqFld('Equation:'), valFld('Slope:', t('m='))], [eqChk(L, { form: 'slope-intercept' }), exactV(m, [{ v: qn(m), code: 'u7l10-m-sign', hint: 'Dividing by a negative changes every sign.' }])], [sT(L), qT(m)], t(sT(L)) + ', slope ' + t(qT(m)),
            siFromGen(Lr) + '<br>Slope ' + t(qT(m)) + '.', ['Move the ' + t('x') + '-term and the constant across, then divide every term by the coefficient of ' + t('y') + '.'], 'general to slope-intercept');
          p.bad = [[sT(lineMB(qn(m), yint(L))), qT(qn(m))]]; return p;
        } },
        { id: 'e3b', level: 'ADV', outcome: 'RF7', make: function (r, sh) { var m = Q(sh.p, sh.q), L = lineMP(m, sh.P); return lineP('(b) Line ' + t('M') + ' is <b>parallel</b> to ' + t('L') + ' and passes through ' + t(ptT(sh.P)) + '. Determine its equation in general form.', L, { form: 'general', wrong: [{ is: lineMP(perpS(m), sh.P), code: 'u7l10-par', hint: 'Parallel lines have <b>equal</b> slopes: ' + t(qT(m)) + '.' }] }, 'Parallel: ' + t('m=' + qT(m)) + '.<br>' + bSteps(m, sh.P) + '<br>' + genSteps(m, qs(sh.P[1], qm(m, sh.P[0]))), ['Use the slope from (a).'].concat(GENH), 'parallel, general form'); } },
        { id: 'e3c', level: 'ADV', outcome: 'RF7', make: function (r, sh) { var m = perpS(Q(sh.p, sh.q)), L = lineMP(m, sh.P); return lineP('(c) Line ' + t('N') + ' is <b>perpendicular</b> to ' + t('L') + ' and passes through ' + t(ptT(sh.P)) + '. Determine its equation in general form.', L, { form: 'general', wrong: [{ is: lineMP(Q(sh.p, sh.q), sh.P), code: 'u7l10-perp', hint: 'That’s the parallel line. Perpendicular slope: negative reciprocal, ' + t(qT(m)) + '.' }] }, 'Perpendicular: ' + t('m=' + qT(m)) + '.<br>' + bSteps(m, sh.P) + '<br>' + genSteps(m, qs(sh.P[1], qm(m, sh.P[0]))), ['Negative reciprocal of the slope from (a).'].concat(GENH), 'perpendicular, general form'); } }] },
    { num: '4', stem: '<b>Work backwards.</b> Each line below is missing one number. Find it.', shared: function (r) {
        if (r.chance(0.25)) return { a: { A: 5, B: 2, a: 6, y: 7 }, b: { P1: [2, 5], P2: [8, 14], x: -4 }, c: { b: -7, P: [3, 2] }, d: { A: 3, C: -12, P: [2, -3] } };
        var a = gen(r, function (r) { var A = r.int(2, 7), Bc = r.int(2, 5), av = rnz(r, -6, 8), y = rnz(r, -8, 9); return { A: A, B: Bc, a: av, y: y }; });
        var b = gen(r, function (r) { var m = sl(r, [[3, 2], [1, 2], [2, 3], [5, 2], [1, 3]]), x1 = r.int(-2, 3), y1 = r.int(-3, 6), d = m[1] * r.int(2, 3), P2 = [x1 + d, y1 + m[0] * d / m[1]], x = x1 - m[1] * r.int(1, 3); return { P1: [x1, y1], P2: P2, x: x }; });
        var c = gen(r, function (r) { var m = rnz(r, -5, 5), x = rnz(r, -4, 5), bb = rnz(r, -9, 9); return { b: bb, P: [x, m * x + bb] }; });
        var d = gen(r, function (r) { var A = r.int(2, 6), Bv = rnz(r, -5, 5), P = [rnz(r, -4, 5), rnz(r, -5, 5)], C = -(A * P[0] + Bv * P[1]); return C ? { A: A, C: C, P: P, Bv: Bv } : null; });
        return { a: a, b: b, c: c, d: d };
      },
      parts: [
        { id: 'e4a', level: 'PRG', outcome: 'RF4', make: function (r, sh) { var o = sh.a, C = -(o.A * o.a - o.B * o.y), eqs = pol([[o.A, 'x'], [-o.B, 'y'], [C, '']]) + '=0'; return valP('(a) The point ' + t('(a,\\ ' + o.y + ')') + ' lies on ' + t(eqs) + '. Find ' + t('a') + '.', o.a, [{ v: (o.B * o.y + C) / o.A, code: 'sign', hint: 'Move the constant to the other side carefully (its sign changes).' }], 'Substitute ' + t('x=a,\\ y=' + o.y) + ': ' + t(pol([[o.A, 'a'], [-o.B * o.y, ''], [C, '']]) + '=0') + ' so ' + t(o.A + 'a=' + (o.A * o.a) + '\\Rightarrow a=' + o.a), ['Substitute the ' + t('y') + '-value and solve for ' + t('a') + '.'], 'missing x-coordinate', { before: t('a=') }); } },
        { id: 'e4b', level: 'ADV', outcome: 'RF7', make: function (r, sh) { var o = sh.b, L = line2(o.P1, o.P2), m = slopeOf(L), k = yAt(L, o.x); return valP('(b) The point ' + t('(' + o.x + ',\\ k)') + ' lies on the line through ' + t(ptT(o.P1)) + ' and ' + t(ptT(o.P2)) + '. Find ' + t('k') + '.', k, [{ v: qs(o.P1[1], qm(m, o.x - o.P1[0])), code: 'sign', hint: 'Check the sign: moving left from ' + t(ptT(o.P1)) + ' with slope ' + t(qT(m)) + '.' }], slopeSteps(o.P1, o.P2) + '<br>' + bSteps(m, o.P1) + '<br>' + t('k=' + qT(m) + '(' + o.x + ')' + (qv(yint(L)) < 0 ? '' : '+') + qT(yint(L)) + '=' + qT(k)), ['Find the equation of the line first, then substitute ' + t('x=' + o.x) + '.'], 'missing y on a line', { before: t('k=') }); } },
        { id: 'e4c', level: 'PRG', outcome: 'RF7', make: function (r, sh) { var o = sh.c, m = (o.P[1] - o.b) / o.P[0]; return valP('(c) The line ' + t('y=mx' + (o.b < 0 ? '' : '+') + o.b) + ' passes through ' + t(ptT(o.P)) + '. Find ' + t('m') + '.', m, [{ v: (o.P[1] + o.b) / o.P[0], code: 'ctx-add-b', hint: 'Move ' + t(o.b) + ' to the other side: its sign changes.' }, { v: o.P[0] / (o.P[1] - o.b), code: 'slope-flip', hint: 'Divide by the ' + t('x') + '-value, not into it.' }], t(o.P[1] + '=m(' + o.P[0] + ')' + (o.b < 0 ? '' : '+') + o.b + '\\Rightarrow ' + o.P[0] + 'm=' + (o.P[1] - o.b) + '\\Rightarrow m=' + qT(Q(o.P[1] - o.b, o.P[0]))), ['Substitute the point and solve for ' + t('m') + '.'], 'missing slope', { before: t('m=') }); } },
        { id: 'e4d', level: 'PRG', outcome: 'RF6', make: function (r, sh) { var o = sh.d, Bv = -(o.A * o.P[0] + o.C) / o.P[1]; return valP('(d) The line ' + t(pol([[o.A, 'x'], [1, 'By'], [o.C, '']]) + '=0') + ' passes through ' + t(ptT(o.P)) + '. Find ' + t('B') + '.', Bv, [{ v: -Bv, code: 'sign', hint: 'Check the sign when you divide by ' + t(o.P[1]) + '.' }], t(pol([[o.A * o.P[0], ''], [o.P[1], 'B'], [o.C, '']]) + '=0\\Rightarrow ' + o.P[1] + 'B=' + (-(o.A * o.P[0] + o.C)) + '\\Rightarrow B=' + qT(Q(-(o.A * o.P[0] + o.C), o.P[1]))), ['Substitute the point, then solve for ' + t('B') + '.'], 'missing coefficient', { before: t('B=') }); } }] },
    { num: '5', shared: function (r) { if (r.chance(0.25)) return { p: -4, b: 5, xt: -15 }; return gen(r, function (r) { var p = r.pick([-5, -4, -2, -1, 1, 2, 4, 5]), b = rnz(r, -6, 8), xt = 3 * r.pick([-6, -5, -4, 4, 5, 6, 7]), ys = [-2, -1, 0, 1, 2].map(function (j) { return b + j * p; }); return ys.every(function (y) { return Math.abs(y) <= 15; }) ? { p: p, b: b, xt: xt } : null; }); },
      stem: function (sh) { var xs = [-6, -3, 0, 3, 6]; return 'A table of values is given below. Notice that the ' + t('x') + '-values do not go up by 1.' + HW.valueTable([[t('x')].concat(xs.map(function (x) { return t(x); })), [t('y')].concat(xs.map(function (x) { return t(sh.b + sh.p * x / 3); }))]); },
      parts: [
        { id: 'e5a', level: 'PRG', outcome: 'RF7', make: function (r, sh) { var m = Q(sh.p, 3); return lineP('(a) The rate of change is constant. Write the equation in the form ' + t('y=mx+b') + '.', lineMB(m, sh.b), { form: 'slope-intercept', wrong: [{ is: { m: sh.p, b: sh.b }, code: 'ctx-step', hint: 'Each step ' + t('x') + ' goes up by 3, so divide the change in ' + t('y') + ' by 3.' }] }, 'Each ' + t('+3') + ' in ' + t('x') + ' gives ' + t((sh.p > 0 ? '+' : '') + sh.p) + ' in ' + t('y') + ', so ' + t('m=' + qT(m)) + '; ' + t('x=0') + ' gives ' + t('b=' + sh.b) + ': ' + t(siTex(m, sh.b)), ['Slope = change in ' + t('y') + ' ÷ change in ' + t('x') + ' (which is 3 here).'], 'table step 3'); } },
        { id: 'e5b', level: 'PRG', outcome: 'RF6', make: function (r, sh) { var m = Q(sh.p, 3); return lineP('(b) Convert your equation to general form.', lineMB(m, sh.b), { form: 'general' }, genSteps(m, sh.b), GENH, 'table line general form'); } },
        { id: 'e5c', level: 'BEG', outcome: 'RF4', make: function (r, sh) { var v = sh.p * 4 + sh.b; return valP('(c) Predict the value of ' + t('y') + ' when ' + t('x=12') + '.', v, [{ v: sh.p * 12 + sh.b, code: 'ctx-step', hint: 'The slope is ' + t(qT(Q(sh.p, 3))) + ', not ' + t(sh.p) + '.' }], t('y=' + qT(Q(sh.p, 3)) + '(12)' + (sh.b < 0 ? '' : '+') + sh.b + '=' + (4 * sh.p) + (sh.b < 0 ? '' : '+') + sh.b + '=' + v), ['Substitute ' + t('x=12') + '.'], 'predict y', { before: t('y=') }); } },
        { id: 'e5d', level: 'PRG', outcome: 'RF4', make: function (r, sh) { var y = sh.b + sh.p * sh.xt / 3; return valP('(d) Determine the value of ' + t('x') + ' that gives ' + t('y=' + y) + '.', sh.xt, [{ v: -sh.xt, code: 'sign', hint: 'Check the sign when you divide by the slope.' }, { v: (y - sh.b) / sh.p, code: 'ctx-step', hint: 'Divide by the slope ' + t(qT(Q(sh.p, 3))) + ' (multiply by ' + t(qT(Q(3, sh.p))) + ').' }], t(y + '=' + qT(Q(sh.p, 3)) + 'x' + (sh.b < 0 ? '' : '+') + sh.b + '\\Rightarrow ' + qT(Q(sh.p, 3)) + 'x=' + (y - sh.b) + '\\Rightarrow x=' + sh.xt), ['Set ' + t('y=' + y) + ' and solve for ' + t('x') + '.'], 'solve for x', { before: t('x=') }); } }] },
    /* ---------------- Part C ---------------- */
    { num: '6', section: 'Extra practice C — Converting Between Forms', stem: 'Convert each equation to general form ' + t('Ax+By+C=0') + ', with ' + t('A') + ', ' + t('B') + ', ' + t('C') + ' integers and ' + t('A') + ' positive. Clear every fraction first.',
      shared: function (r) {
        if (r.chance(0.25)) return { a: [Q(-5, 6), Q(2, 3)], b: [Q(7, 4), -3], c: [Q(-1, 3), Q(-5, 2)], d: Q(9, 2) };
        var a = gen(r, function (r) { var m = sl(r, [[5, 6], [1, 6], [3, 4], [1, 4], [5, 4], [7, 6]]), b = sl(r, [[2, 3], [1, 3], [1, 2], [3, 2], [5, 3]]); return m[1] === b[1] ? null : [m, b]; });
        var b = [sl(r, [[7, 4], [3, 4], [5, 2], [2, 5], [4, 3], [5, 3], [3, 5]]), rnz(r, -9, 9)];
        var c = gen(r, function (r) { var m = sl(r, [[1, 3], [2, 3], [1, 4], [1, 5]]), bb = sl(r, [[5, 2], [3, 2], [1, 2], [7, 2]]); return [m, bb]; });
        return { a: a, b: b, c: c, d: Q(r.pick([1, 3, 5, 7, 9, 11]) * (r.chance(0.7) ? 1 : -1), r.pick([2, 3, 4])) };
      },
      parts: ['a', 'b', 'c', 'd'].map(function (Lt) {
        return { id: 'e6' + Lt, level: Lt === 'a' || Lt === 'c' ? 'ADV' : 'PRG', outcome: 'RF6', make: function (r, sh) {
          if (Lt === 'd') { var L0 = Lrat([1, 1], [0, 1], qn(sh.d)); return lineP('(d) ' + t('x=' + qT(sh.d)), L0, { form: 'general' }, t('x=' + qT(sh.d)) + '<br>Multiply by ' + t(sh.d[1]) + ': ' + t(sh.d[1] + 'x=' + sh.d[0]) + '<br>' + t(gT(L0)), GENH, 'vertical line general form'); }
          var o = sh[Lt], L = lineMB(o[0], o[1]);
          return lineP('(' + Lt + ') ' + t(siTex(o[0], o[1])), L, { form: 'general' }, genSteps(o[0], o[1]), GENH.concat(['Multiply every term (on both sides) by the lowest common denominator.']), 'clear fractions to general form');
        } };
      }) },
    { num: '7', stem: 'For each line: convert to slope–intercept form, state the slope and the ' + t('y') + '-intercept, then give the ' + t('x') + '-intercept as an ordered pair. Leave every answer as an exact fraction.',
      shared: function (r) {
        var g = function (r) { var A = r.int(2, 12), Bc = r.int(3, 15), C = rnz(r, -20, 20); if (gcd(gcd(A, Bc), C) !== 1 || C % Bc === 0 || C % A === 0 || gcd(A, Bc) === 1 && r.chance(0.5)) return null; return { A: A, B: r.chance(0.5) ? -Bc : Bc, C: C }; };
        return r.chance(0.25) ? { a: { A: 9, B: -12, C: 8 }, b: { A: 6, B: 15, C: -20 } } : { a: gen(r, g), b: gen(r, g) };
      },
      parts: ['a', 'b'].map(function (Lt) {
        return { id: 'e7' + Lt, level: 'ADV', outcome: 'RF6', make: function (r, sh) {
          var o = sh[Lt], L = L3(o.A, o.B, o.C), m = slopeOf(L), b = yint(L), xi = xint(L);
          var p = B.fields('(' + Lt + ') ' + t(pol([[o.A, 'x'], [o.B, 'y'], [o.C, '']]) + '=0'), [eqFld('Equation:'), valFld('Slope:', t('m=')), valFld(t('y') + '-intercept:', t('b=')), ptFld(t('x') + '-intercept:')],
            [eqChk(L, { form: 'slope-intercept' }), exactV(m, [{ v: Q(o.A, o.B), code: 'u7l10-m-sign', hint: 'Move the ' + t('x') + '-term across (its sign changes) before dividing.' }]), exactV(b, [{ v: qn(b), code: 'sign', hint: 'Check the sign of the constant after you divide.' }]), ptChk([xi, 0], 'x')],
            [sT(L), qT(m), qT(b), ptK([xi, 0])], t(sT(L)) + '; ' + t('m=' + qT(m)) + ', ' + t('b=' + qT(b)) + '; ' + t(ptT([xi, 0])),
            siFromGen(o) + '<br>Slope ' + t(qT(m)) + ', ' + t('y') + '-intercept ' + t(qT(b)) + '.<br>' + t('x') + '-intercept: let ' + t('y=0') + ': ' + t(pol([[o.A, 'x'], [o.C, '']]) + '=0\\Rightarrow x=' + qT(xi)) + ' → ' + t(ptT([xi, 0])),
            ['Isolate ' + t('y') + ' and reduce every fraction.', 'For the ' + t('x') + '-intercept set ' + t('y=0') + ' in the original equation.'], 'general form, all features');
          p.bad = [[sT(lineMB(qn(m), b)), qT(qn(m)), qT(qn(b)), ptK([qn(xi), 0])]];
          return p;
        } };
      }) },
    { num: '8', shared: function (r) {
        var bk = r.chance(0.25), m = bk ? Q(2, 5) : sl(r, [[2, 5], [3, 4], [2, 3], [3, 5], [4, 5], [1, 3], [3, 7]]), b = bk ? -3 : rnz(r, -7, 7), L = lineMB(m, b), f = bk ? 2 : r.pick([2, 3]);
        var roles = bk ? ['proper', 'neg', 'scaled'] : r.shuffle(['proper', 'neg', 'scaled']);
        return { m: m, b: b, L: L, f: f, roles: roles };
      },
      stem: function (sh) {
        var L = sh.L, txt = { proper: pol([[L.A, 'x'], [L.B, 'y'], [L.C, '']]) + '=0', neg: pol([[-L.B, 'y'], [-L.A, 'x'], [-L.C, '']]) + '=0', scaled: pol([[sh.f * L.A, 'x'], [sh.f * L.B, 'y'], [sh.f * L.C, '']]) + '=0' };
        return '<b>Same line in different clothes.</b> Five equations:<br>(i) ' + t(siTex(sh.m, sh.b)) + '&emsp; (ii) ' + t(txt[sh.roles[0]]) + '&emsp; (iii) ' + t(txt[sh.roles[1]]) + '&emsp; (iv) ' + t(txt[sh.roles[2]]) + '&emsp; (v) ' + t(siTex(Q(sh.m[1], sh.m[0]), sh.b));
      },
      parts: [
        { id: 'e8a', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          var rows = ['ii', 'iii', 'iv', 'v'].map(function (k) { return { id: k, html: '(' + k + ')' }; }), cols = [{ id: 's', html: 'Same line as (i)' }, { id: 'd', html: 'Different line' }];
          return B.grid('(a) Sort them: which describe the <b>same</b> line as (i)?', rows, cols, { ii: 's', iii: 's', iv: 's', v: 'd' }, {},
            '(i) ' + t('\\times ' + sh.m[1]) + ' and rearranged gives ' + t(gT(sh.L)) + '. Of the others, one is that equation, one is it times ' + t('-1') + ', and one is it times ' + t(sh.f) + ' — all the same line. (v) has slope ' + t(qT(Q(sh.m[1], sh.m[0]))) + ', not ' + t(qT(sh.m)) + ': a different line.',
            ['Write (i) in general form, then compare: multiplying every term by the same number gives the same line.'], 'same line sorting');
        } },
        { id: 'e8b', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          var rows = [0, 1, 2].map(function (i) { return { id: ['ii', 'iii', 'iv'][i], html: '(' + ['ii', 'iii', 'iv'][i] + ')' }; }), cols = [{ id: 'proper', html: 'Proper general form' }, { id: 'neg', html: t('A') + ' is negative' }, { id: 'scaled', html: 'Common factor not divided out' }];
          var want = {}; rows.forEach(function (rw, i) { want[rw.id] = sh.roles[i]; });
          return B.grid('(b) Only one of (ii), (iii) and (iv) is written in <b>proper</b> general form. What is true of each?', rows, cols, want, {},
            'Proper general form has integer ' + t('A') + ', ' + t('B') + ', ' + t('C') + ', ' + t('A>0') + ' and no common factor. The one whose ' + t('x') + '-term is negative breaks ' + t('A>0') + '; the one with every coefficient a multiple of ' + t(sh.f) + ' isn’t reduced.', ['Check the sign of the ' + t('x') + '-coefficient and look for a common factor.'], 'proper general form');
        } },
        { id: 'e8c', level: 'BEG', outcome: 'RF6', make: function (r, sh) {
          var m = Q(sh.m[1], sh.m[0]);
          var p = B.fields('(c) State the slope and ' + t('y') + '-intercept of the odd line out, (v).', [valFld('Slope:', t('m=')), valFld(t('y') + '-intercept:', t('b='))], [exactV(m, [{ v: sh.m, code: 'slope-flip', hint: 'That’s the slope of (i). Read (v) itself.' }]), exactV(sh.b)], [qT(m), String(sh.b)], t('m=' + qT(m)) + ', ' + t('b=' + sh.b),
            '(v) has ' + t('m=' + qT(m)) + ' and ' + t('b=' + sh.b) + '. It shares the ' + t('y') + '-intercept with (i), but its slope is the reciprocal, so it is a different line that only crosses the others at ' + t(ptT([0, sh.b])) + '.', ['Read ' + t('m') + ' and ' + t('b') + ' from (v).'], 'odd line out');
          p.bad = [[qT(sh.m), String(sh.b)]]; return p;
        } }] },
    /* ---------------- Part D ---------------- */
    { num: '9', section: 'Extra practice D — Graphs and Lines', shared: function (r) {
        if (r.chance(0.25)) return { m: Q(-4, 3), b: 2, X: 12, Y: -30 };
        return gen(r, function (r) { var m = sl(r, [[4, 3], [3, 2], [2, 3], [1, 2], [5, 3], [3, 4]]), b = r.int(-4, 6), L = lineMB(m, b); if (lattice(L, [-6, 6], [-8, 10]).length < 3) return null; var X = m[1] * r.pick([4, 5, 6]), Xy = qv(yAt(L, X)), Yk = r.pick([3, 4, 5, 6]) * (qv(m) < 0 ? -1 : 1), Y = b + m[0] * Yk * (m[1] === 1 ? 1 : 1); var xY = qv(xAt(L, Y)); return isI(xY) && Math.abs(xY) > 6 && !same(xY, Xy) ? { m: m, b: b, X: X, Y: Y } : null; });
      },
      stem: function (sh) { return '<b>From a graph to an equation to a prediction.</b>' + lineFig([{ L: lineMB(sh.m, sh.b) }], [-6, 6], [-8, 10], [], { max: 300 }); },
      parts: [
        { id: 'e9a', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var L = lineMB(sh.m, sh.b), lp = lattice(L, [-6, 6], [-8, 10]), A = lp[0], Bq = lp[lp.length - 1];
          var chk = function (resp) {
            var a = anyPtChk(L, null), r1 = a(resp[0]), r2 = a(resp[1]);
            if (r1.v !== 'correct') return { v: r1.v, code: r1.code, hint: 'First point: ' + (r1.hint || 'check it.') };
            if (r2.v !== 'correct') return { v: r2.v, code: r2.code, hint: 'Second point: ' + (r2.hint || 'check it.') };
            var p1 = LN.readPoint(resp[0]).p, p2 = LN.readPoint(resp[1]).p;
            if (same(p1[0].v, p2[0].v)) return form('u7l10-same-pt', 'Give two <b>different</b> points.');
            if (!isI(p1[0].v) || !isI(p1[1].v) || !isI(p2[0].v) || !isI(p2[1].v)) return form('u7l10-cond', 'Those points are on the line, but use points where the line crosses a grid corner exactly (whole-number coordinates).');
            return ok();
          };
          var p = B.fields('(a) State the coordinates of two points where the line crosses a grid corner exactly.', [ptFld('Point 1:'), ptFld('Point 2:')], [chk, function () { return ok(); }], [ptK(A), ptK(Bq)], 'e.g. ' + lp.map(function (q) { return t(ptT(q)); }).join(', '),
            'The line passes exactly through the grid corners ' + lp.map(function (q) { return t(ptT(q)); }).join(', ') + '. Any two of them work.', ['Look for places where the line goes exactly through the corner of a grid square.'], 'lattice points from graph');
          p.check = function (resp) { return chk(resp || []); };
          p.bad = [[ptK(A), ptK(A)], [ptK([A[0], A[1] + 1]), ptK(Bq)]];
          p.good = [[ptK(lp[1]), ptK(lp[0])]];
          return p;
        } },
        { id: 'e9b', level: 'BEG', outcome: 'RF3', make: function (r, sh) { var L = lineMB(sh.m, sh.b), lp = lattice(L, [-6, 6], [-8, 10]); return slopeP('(b) Determine the slope from two of those points.', sh.m, [{ v: Q(sh.m[1], sh.m[0]), code: 'slope-flip', hint: 'Rise over run: change in ' + t('y') + ' on top.' }], 'e.g. ' + slopeSteps(lp[0], lp[lp.length - 1]), ['Rise ÷ run between your two points.'], 'slope from graph'); } },
        { id: 'e9c', level: 'PRG', outcome: 'RF7', make: function (r, sh) { return lineP('(c) Write the equation in the form ' + t('y=mx+b') + '.', lineMB(sh.m, sh.b), { form: 'slope-intercept' }, 'Slope ' + t(qT(sh.m)) + '; the line crosses the ' + t('y') + '-axis at ' + t(sh.b) + ': ' + t(siTex(sh.m, sh.b)), ['Slope from (b); read ' + t('b') + ' on the ' + t('y') + '-axis.'], 'equation from graph'); } },
        { id: 'e9d', level: 'PRG', outcome: 'RF6', make: function (r, sh) { return lineP('(d) Convert the equation to general form.', lineMB(sh.m, sh.b), { form: 'general' }, genSteps(sh.m, sh.b), GENH, 'graph line general form'); } },
        { id: 'e9e', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var L = lineMB(sh.m, sh.b), yX = yAt(L, sh.X), xY = xAt(L, sh.Y);
          var p = B.fields('(e) The grid stops at ' + t('x=6') + '. Use the <i>equation</i> to find ' + t('y') + ' when ' + t('x=' + sh.X) + ', and to find ' + t('x') + ' when ' + t('y=' + sh.Y) + '.', [valFld(t('y') + ' when ' + t('x=' + sh.X) + ':', t('y=')), valFld(t('x') + ' when ' + t('y=' + sh.Y) + ':', t('x='))],
            [exactV(yX, [{ v: xY, code: 'ctx-swap-boxes', hint: 'That belongs in the other box.' }]), exactV(xY, [{ v: yX, code: 'ctx-swap-boxes', hint: 'That belongs in the other box.' }, { v: qn(xY), code: 'sign', hint: 'Check the sign when you divide by the slope.' }])], [qT(yX), qT(xY)], t('y=' + qT(yX)) + ', ' + t('x=' + qT(xY)),
            t('y=' + qT(sh.m) + '(' + sh.X + ')' + (sh.b < 0 ? '' : '+') + sh.b + '=' + qT(yX)) + '<br>' + t(sh.Y + '=' + qT(sh.m) + 'x' + (sh.b < 0 ? '' : '+') + sh.b + '\\Rightarrow ' + qT(sh.m) + 'x=' + (sh.Y - sh.b) + '\\Rightarrow x=' + qT(xY)), ['Substitute into ' + t('y=mx+b') + '; for the second, solve for ' + t('x') + '.'], 'use the equation off the grid');
          p.bad = [[qT(xY), qT(yX)]]; return p;
        } }] },
    { num: '10', shared: function (r) {
        if (r.chance(0.25)) return { m: Q(2, 3), b1: -3, a: 1, P: [6, 1], k: -2, h: -5 };
        return gen(r, function (r) {
          var m = sl(r, [[2, 3], [1, 2], [3, 2], [1, 3], [3, 4]]), P = [r.int(-4, 6), r.int(-5, 5)], b1 = qs(P[1], qm(m, P[0])); if (!isInt(b1) || Math.abs(qv(b1)) > 7) return null;
          var a = r.pick([1, 3, -1, -3]), L2 = L3(a, 2, -(a * P[0] + 2 * P[1])); if (gcd(a, 2) !== 1) return null;
          var L1 = lineMB(m, qv(b1)), k = rnz(r, -6, 6), h = rnz(r, -5, 5); if (k === P[1] || h === P[0] || h === k) return null;
          if (lattice(L1, [-6, 6], [-8, 8]).length < 2 || lattice(L2, [-6, 6], [-8, 8]).length < 2) return null;
          return { m: m, b1: qv(b1), a: a, P: P, k: k, h: h };
        });
      },
      stem: function (sh) { var L2 = L3(sh.a, 2, -(sh.a * sh.P[0] + 2 * sh.P[1])); return 'Four lines: (i) ' + t(siTex(sh.m, sh.b1)) + '&emsp; (ii) ' + t(gT(L2)) + '&emsp; (iii) ' + t('y=' + sh.k) + '&emsp; (iv) ' + t('x=' + sh.h) + '. Two of them must be rearranged before they can be graphed from a slope and an intercept, and one cannot be put in the form ' + t('y=mx+b') + ' at all.'; },
      parts: [
        { id: 'e10a', sub: 'graph', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          var L1 = lineMB(sh.m, sh.b1), L2 = L3(sh.a, 2, -(sh.a * sh.P[0] + 2 * sh.P[1])), L3_ = L3(0, 1, -sh.k), L4 = L3(1, 0, -sh.h), xr = [-6, 6], yr = [-8, 8];
          var key = linesDraw([L1, L2, L3_, L4], xr, yr), wrongs = [{ is: linesDraw([L1, L2, L3(1, 0, -sh.k), L3(0, 1, -sh.h)], xr, yr), code: 'graph-hv', hint: t('y=' + sh.k) + ' is horizontal and ' + t('x=' + sh.h) + ' is vertical — you have them the other way round.' }].filter(function (w) { return w.is; });
          var p = B.graph('Graph all four lines on the grid. Use <b>╱ Line</b> for each: tap two points on it (its ends start as arrows).', pad(xr, yr), exactChk(key, { wrong: wrongs }), key,
            '(i): start at ' + t(ptT([0, sh.b1])) + ', slope ' + t(qT(sh.m)) + '. (ii): ' + t(sT(L2)) + ' — start at ' + t(ptT([0, qv(yint(L2))])) + ', slope ' + t(qT(slopeOf(L2))) + '. (iii): horizontal through ' + t(ptT([0, sh.k])) + '. (iv): vertical through ' + t(ptT([sh.h, 0])) + '.',
            ['Rearrange (ii) into ' + t('y=mx+b') + ' first.', t('y=k') + ' is horizontal; ' + t('x=k') + ' is vertical.'], 'graph four lines');
          p.bad = wrongs.map(function (w) { return w.is; }).concat([linesDraw([L1, L2, L3_], xr, yr)]);
          return p;
        } },
        { id: 'e10b', sub: 'a', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          var L2 = L3(sh.a, 2, -(sh.a * sh.P[0] + 2 * sh.P[1])), m2 = slopeOf(L2), b2 = yint(L2);
          var p = B.fields('(a) State the slope and ' + t('y') + '-intercept of line (ii), showing your rearranging, and the slope of line (iii).', [valFld('(ii) slope:', t('m=')), valFld('(ii) ' + t('y') + '-intercept:', t('b=')), valFld('(iii) slope:', t('m='))],
            [exactV(m2, [{ v: qn(m2), code: 'u7l10-m-sign', hint: 'Moving the ' + t('x') + '-term across changes its sign.' }, { v: -sh.a, code: 'u7l10-no-iso', hint: 'Divide by the coefficient of ' + t('y') + ' too.' }]), exactV(b2, [{ v: -L2.C, code: 'u7l10-no-iso', hint: 'Divide by the coefficient of ' + t('y') + ' too.' }]), exactV(0, [])], [qT(m2), qT(b2), '0'], 'Line (ii): ' + t('m=' + qT(m2)) + ', ' + t('b=' + qT(b2)) + '; line (iii): ' + t('m=0'),
            siFromGen(L2) + '<br>Line (iii) ' + t('y=' + sh.k) + ' is horizontal: ' + t('m=0') + ' (' + t('y=0x' + (sh.k < 0 ? '' : '+') + sh.k) + ').', ['Isolate ' + t('y') + ' in (ii).'], 'slopes and intercepts');
          p.bad = [[qT(qn(m2)), qT(b2), '0']]; return p;
        } },
        { id: 'e10c', sub: 'b', level: 'BEG', outcome: 'RF6', make: function (r, sh) {
          return mc(r, '(b) Which line has no slope–intercept form, and which line has a slope of 0?', [
            { html: t('x=' + sh.h) + ' has no slope–intercept form (vertical, slope undefined); ' + t('y=' + sh.k) + ' has slope 0 (horizontal).', right: true },
            { html: t('y=' + sh.k) + ' has no slope–intercept form; ' + t('x=' + sh.h) + ' has slope 0.', why: 'Swapped: ' + t('y=' + sh.k) + ' is horizontal (slope 0) and can be written ' + t('y=0x' + (sh.k < 0 ? '' : '+') + sh.k) + '; the vertical line has an undefined slope.' },
            { html: 'Line (ii) has no slope–intercept form, because it is in general form; ' + t('y=' + sh.k) + ' has slope 0.', why: 'Line (ii) can be rearranged into ' + t('y=mx+b') + '. Only a vertical line can’t.' },
            { html: 'Both ' + t('x=' + sh.h) + ' and ' + t('y=' + sh.k) + ' have slope 0.', why: 'A vertical line’s run is 0, so its slope is undefined, not 0.' }],
            'A vertical line has run 0, so its slope is undefined: ' + t('x=' + sh.h) + ' can never be ' + t('y=mx+b') + '. A horizontal line has rise 0, slope 0: ' + t('y=' + sh.k) + ' is ' + t('y=0x' + (sh.k < 0 ? '' : '+') + sh.k) + '.', ['Horizontal: slope 0. Vertical: undefined.'], 'undefined vs zero');
        } },
        { id: 'e10d', sub: 'c', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var L2 = L3(sh.a, 2, -(sh.a * sh.P[0] + 2 * sh.P[1]));
          var p = B.math('(c) Lines (i) and (ii) meet at a point that sits exactly on a grid corner. State the point.', K.point(sh.P, { system: [lineMB(sh.m, sh.b1), L2] }), ptK(sh.P), 'From the graph the lines cross at ' + t(ptT(sh.P)) + '. Check: (i) ' + t(qT(sh.m) + '(' + sh.P[0] + ')' + (sh.b1 < 0 ? '' : '+') + sh.b1 + '=' + sh.P[1]) + ' ✓; (ii) ' + t(pol([[sh.a * sh.P[0], ''], [2 * sh.P[1], ''], [L2.C, '']]).replace(/\+-/g, '-') + '=0') + ' ✓',
            ['Read the crossing point from your graph, then substitute it into both equations to check.'], 'intersection point', { keys: 'pairs', placeholder: 'e.g. (3, -2)' });
          p.bad = [ptK([sh.P[1], sh.P[0]])].filter(function (b) { return sh.P[0] !== sh.P[1]; }); return p;
        } }] },
    { num: '11', shared: function (r) {
        if (r.chance(0.25)) return { m1: 1, m2: -2, P: [2, 1] };
        return gen(r, function (r) { var m1 = r.pick([1, 2, 3, Q(1, 2)]), m2 = r.pick([-1, -2, -3]), P = [r.int(-3, 3), r.int(-3, 3)]; var L1 = lineMP(m1, P), L2 = lineMP(m2, P); if (!isInt(yint(L1)) || lattice(L1, [-6, 6], [-8, 8]).length < 3 || lattice(L2, [-6, 6], [-8, 8]).length < 3 || qv(yint(L1)) === qv(yint(L2))) return null; return { m1: m1, m2: m2, P: P }; });
      },
      stem: function (sh) { var xr = [-6, 6], yr = [-8, 8]; return 'Two lines are graphed below.' + lineFig([{ L: lineMP(sh.m1, sh.P), label: 'L₁' }, { L: lineMP(sh.m2, sh.P), label: 'L₂' }], xr, yr, [], { max: 300 }); },
      parts: [
        { id: 'e11a', level: 'BEG', outcome: 'RF4', make: function (r, sh) { var p = B.math('(a) Read the point of intersection from the graph.', K.point(sh.P, { system: [lineMP(sh.m1, sh.P), lineMP(sh.m2, sh.P)] }), ptK(sh.P), 'The lines cross at ' + t(ptT(sh.P)) + '.', ['Where do the two lines meet?'], 'intersection from graph', { keys: 'pairs', placeholder: 'e.g. (3, -2)' }); if (sh.P[0] !== sh.P[1]) p.bad = [ptK([sh.P[1], sh.P[0]])]; return p; } },
        { id: 'e11b', level: 'PRG', outcome: 'RF7', make: function (r, sh) { var L = lineMP(sh.m1, sh.P), m = slopeOf(L), b = yint(L); return lineP('(b) Determine the equation of ' + t('L_1') + ' in general form.', L, { form: 'general', wrong: [{ is: lineMP(qn(m), sh.P), code: 'line-slope-sign', hint: t('L_1') + ' rises from left to right: positive slope.' }] }, t('L_1') + ' crosses the ' + t('y') + '-axis at ' + t(qT(b)) + ' and has slope ' + t(qT(m)) + ' (rise over run between grid corners): ' + t(sT(L)) + '<br>' + genSteps(m, b), ['Read the ' + t('y') + '-intercept and count rise over run, then move every term to one side.'], 'L1 general form'); } },
        { id: 'e11c', level: 'PRG', outcome: 'RF7', make: function (r, sh) { var L = lineMP(sh.m2, sh.P), m = slopeOf(L), b = yint(L); return lineP('(c) Determine the equation of ' + t('L_2') + ' in general form.', L, { form: 'general', wrong: [{ is: lineMP(qn(m), sh.P), code: 'line-slope-sign', hint: t('L_2') + ' falls from left to right: negative slope.' }] }, t('L_2') + ' crosses the ' + t('y') + '-axis at ' + t(qT(b)) + ' and has slope ' + t(qT(m)) + ': ' + t(sT(L)) + '<br>' + genSteps(m, b), ['Read the ' + t('y') + '-intercept and the slope from the graph.'], 'L2 general form'); } }] },
    /* ---------------- Part E ---------------- */
    { num: '12', section: 'Extra practice E — Reasoning and Error Analysis', shared: function (r) {
        if (r.chance(0.25)) return { m: -2, A: [-4, 9], Bp: [2, -3] };
        return gen(r, function (r) { var m = -r.int(2, 4), x1 = -r.int(2, 5), b = rnz(r, -6, 6), x2 = r.int(1, 3); var A = [x1, m * x1 + b], Bp = [x2, m * x2 + b]; return Math.abs(A[1]) <= 20 ? { m: m, A: A, Bp: Bp } : null; });
      },
      stem: function (sh) { var mx = sh.m * sh.A[0], bw = sh.A[1] + mx; return 'Priya was asked for the equation, in general form, of the line through ' + t(ptT(sh.A)) + ' and ' + t(ptT(sh.Bp)) + '. Exactly one of her five steps is wrong.<br><b>Step 1:</b> ' + t('m=\\dfrac{' + sh.Bp[1] + '-' + sgnP(sh.A[1]) + '}{' + sh.Bp[0] + '-(' + sh.A[0] + ')}=\\dfrac{' + (sh.Bp[1] - sh.A[1]) + '}{' + (sh.Bp[0] - sh.A[0]) + '}=' + sh.m) + '<br><b>Step 2:</b> ' + t('y=' + sh.m + 'x+b') + '<br><b>Step 3:</b> ' + t(sh.A[1] + '=' + sh.m + '(' + sh.A[0] + ')+b') + ', so ' + t(sh.A[1] + '=' + (-mx) + '+b') + '<br><b>Step 4:</b> ' + t('b=' + bw) + '<br><b>Step 5:</b> ' + t('y=' + sh.m + 'x' + (bw < 0 ? '' : '+') + bw) + ', so ' + t(gT(lineMB(sh.m, bw))); },
      parts: [
        { id: 'e12a', level: 'PRG', outcome: 'RF7', make: function (r, sh) {
          var mx = sh.m * sh.A[0];
          return mc(r, '(a) Which is the first wrong step?', [
            { html: 'Step 3: ' + t(sh.m + '\\times(' + sh.A[0] + ')=+' + mx) + ', not ' + t(-mx) + ' (a negative times a negative is positive).', right: true, code: 's3' },
            { html: 'Step 1: the slope should be positive.', why: 'The ' + t('y') + '-values go down as ' + t('x') + ' goes up, so the slope ' + t(sh.m) + ' is right.', code: 's1' },
            { html: 'Step 4: she should have subtracted instead of adding.', why: 'Step 4 follows correctly from Step 3’s line. The mistake comes earlier.', code: 's4' },
            { html: 'Step 5: the general form should have ' + t('A') + ' negative.', why: 'In general form ' + t('A') + ' is positive; her Step 5 conversion is fine.', code: 's5' }],
            'Step 3 is wrong: ' + t(sh.m + '(' + sh.A[0] + ')=' + mx) + '. Then ' + t(sh.A[1] + '=' + mx + '+b\\Rightarrow b=' + (sh.A[1] - mx)) + '.', ['Check each multiplication with negatives.'], 'find the wrong step');
        } },
        { id: 'e12b', level: 'PRG', outcome: 'RF7', make: function (r, sh) { var L = line2(sh.A, sh.Bp), mx = sh.m * sh.A[0], bw = sh.A[1] + mx; return lineP('(b) Redo the solution correctly and give the correct general form.', L, { form: 'general', wrong: [{ is: lineMB(sh.m, bw), code: 'u7l10-b-sign', hint: 'That is Priya’s answer: fix Step 3 first.' }] }, 'Step 3: ' + t(sh.A[1] + '=' + sh.m + '(' + sh.A[0] + ')+b=' + mx + '+b\\Rightarrow b=' + (sh.A[1] - mx)) + '<br>' + t(siTex(sh.m, sh.A[1] - mx)) + ', so ' + t(gT(L)) + '<br>Check ' + t(ptT(sh.Bp)) + ': ' + t(pol([[L.A * sh.Bp[0], ''], [L.B * sh.Bp[1], '']]).replace(/\+-/g, '-') + (L.C < 0 ? '' : '+') + L.C + '=0') + ' ✓', ['Redo Step 3 with the correct sign, then check both points.'], 'correct the solution'); } }] },
    { num: '13', shared: function (r) { if (r.chance(0.25)) return { m: Q(-3, 5), b: 2 }; return { m: sl(r, [[3, 5], [2, 3], [1, 4], [3, 4], [2, 5], [4, 3], [5, 2]]), b: rnz(r, -7, 7) }; },
      stem: function (sh) { var q = sh.m[1], wr = L3(-sh.m[0], q, -sh.b); return 'Malik converted ' + t(siTex(sh.m, sh.b)) + ' to general form. Exactly one step is wrong.<br><b>Step 1:</b> multiply every term by ' + t(q) + ': ' + t(q + 'y=' + pol([[sh.m[0], 'x'], [sh.b, '']])) + '<br><b>Step 2:</b> move the ' + t('x') + '-term across: ' + t(gT(wr)) + '<br><b>Step 3:</b> ' + t('A') + ' is positive, so this is proper general form.'; },
      parts: [
        { id: 'e13a', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          var q = sh.m[1];
          return mc(r, '(a) Which step is wrong?', [
            { html: 'Step 1: the constant ' + t(sh.b) + ' must be multiplied by ' + t(q) + ' too, giving ' + t(sh.b * q) + '.', right: true },
            { html: 'Step 2: the ' + t('x') + '-term should keep its sign when it moves.', why: 'Moving a term across the equals sign does change its sign; Step 2 is fine.' },
            { html: 'Step 3: ' + t('A') + ' should be negative.', why: 'In general form ' + t('A') + ' is positive.' },
            { html: 'Step 1: he should have multiplied by ' + t(sh.m[0] < 0 ? -sh.m[0] : sh.m[0]) + ', the numerator.', why: 'To clear the fraction multiply by the <b>denominator</b>, ' + t(q) + ' — every term.' }],
            'Every term must be multiplied: ' + t(q + 'y=' + pol([[sh.m[0], 'x'], [sh.b * q, '']])) + '. Malik left the constant as ' + t(sh.b) + '.', ['Multiply <b>every</b> term on both sides.'], 'find the wrong step');
        } },
        { id: 'e13b', level: 'PRG', outcome: 'RF6', make: function (r, sh) { var L = lineMB(sh.m, sh.b), wr = L3(-sh.m[0], sh.m[1], -sh.b); return lineP('(b) Give the correct general form.', L, { form: 'general', wrong: [{ is: wr, code: 'u7l10-both-mult', hint: 'That’s Malik’s answer: multiply the constant by ' + t(sh.m[1]) + ' too.' }] }, genSteps(sh.m, sh.b) + '<br>Check ' + t(ptT([0, sh.b])) + ': it satisfies ' + t(gT(L)) + ' but not Malik’s ' + t(gT(wr)) + '.', GENH, 'correct general form'); } }] },
    { num: '14', stem: 'Decide whether each statement is <b>true</b> or <b>false</b>.', shared: function (r) {
        return { a: { h: rnz(r, -12, 12), vert: r.chance(0.55) }, b: { h: rnz(r, -12, 12), m: sl(r, [[2, 3], [1, 2], [3, 4], [5, 2]]), bb: sl(r, [[1, 3], [5, 2], [1, 4], [7, 3]]), v: r.chance(0.5) },
          c: { m1: rnz(r, -5, 5), m2: rnz(r, -5, 5), b1: rnz(r, -8, 8), b2: rnz(r, -8, 8), same: r.chance(0.5) }, d: { A: r.int(1, 5), Bv: rnz(r, -6, 6), C: rnz(r, -9, 9), f: r.int(2, 4), tr: r.chance(0.55) },
          e: { k: rnz(r, -9, 9), kind: r.int(0, 3) }, f: { A: r.int(2, 7), Bv: r.int(2, 7), C: r.int(2, 12), kind: r.int(0, 2) } };
      },
      parts: [
        { id: 'e14a', level: 'BEG', outcome: 'RF6', make: function (r, sh) { var o = sh.a, eq = o.vert ? 'x=' + o.h : 'y=' + o.h; return tf(r, '(a) The line ' + t(eq) + ' can be written in the form ' + t('y=mx+b') + '.', !o.vert, o.vert ? t(eq) + ' is vertical: its slope is undefined, so there is no ' + t('m') + '.' : t(eq) + ' is horizontal with slope 0: ' + t('y=0x' + (o.h < 0 ? '' : '+') + o.h) + '.', o.vert ? '<b>False</b>: a vertical line has an undefined slope, so it can’t be ' + t('y=mx+b') + '. Not every line can.' : '<b>True</b>: ' + t('y=0x' + (o.h < 0 ? '' : '+') + o.h) + ' (slope 0).', ['Vertical lines are the exception.'], 'which lines are y = mx + b'); } },
        { id: 'e14b', level: 'BEG', outcome: 'RF6', make: function (r, sh) { var o = sh.b, eq = o.v ? 'x=' + o.h : siTex(o.m, o.bb), L = o.v ? L3(1, 0, -o.h) : lineMB(o.m, o.bb); return tf(r, '(b) The line ' + t(eq) + ' can be written in general form ' + t('Ax+By+C=0') + ' with integer ' + t('A') + ', ' + t('B') + ', ' + t('C') + '.', true, 'Every line can: here ' + t(gT(L)) + '.', '<b>True</b>: ' + t(gT(L)) + '. Every straight line, vertical lines included, can be written in general form.', ['Try converting it.'], 'every line has a general form'); } },
        { id: 'e14c', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          var o = sh.c, m2 = o.m2 === o.m1 ? o.m1 + 1 || 2 : o.m2, b2 = o.b2 === o.b1 ? o.b1 + 3 : o.b2;
          var s = o.same ? '(c) The lines ' + t(siTex(o.m1, o.b1)) + ' and ' + t(siTex(o.m1, b2)) + ' are parallel.' : '(c) The lines ' + t(siTex(o.m1, o.b1)) + ' and ' + t(siTex(m2, o.b1)) + ' have the same ' + t('y') + '-intercept, so they are parallel.';
          return tf(r, s, o.same, o.same ? 'Same slope, different intercepts: parallel.' : 'Parallel lines have equal <b>slopes</b>. These share only the ' + t('y') + '-intercept, so they cross there.', o.same ? '<b>True</b>: both have slope ' + t(o.m1) + ' and different intercepts.' : '<b>False</b>: the slopes are ' + t(o.m1) + ' and ' + t(m2) + '. Lines with the same intercept simply cross at ' + t(ptT([0, o.b1])) + '.', ['Parallel means equal slopes.'], 'parallel lines');
        } },
        { id: 'e14d', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          var o = sh.d, L = L3(o.A, o.Bv, o.C), C2 = o.tr ? o.f * L.C : o.f * L.C + 1, eq1 = pol([[o.f * L.A, 'x'], [o.f * L.B, 'y'], [C2, '']]) + '=0';
          return tf(r, '(d) ' + t(eq1) + ' and ' + t(gT(L)) + ' are the same line.', o.tr, o.tr ? 'Dividing every term by ' + t(o.f) + ' gives the other equation.' : 'Divide every term by ' + t(o.f) + ': the constant doesn’t match, so the lines are parallel, not the same.', o.tr ? '<b>True</b>: divide the first by ' + t(o.f) + '.' : '<b>False</b>: dividing by ' + t(o.f) + ' gives a different constant.', ['Is one equation a multiple of the other (every term)?'], 'same line test');
        } },
        { id: 'e14e', level: 'BEG', outcome: 'RF6', make: function (r, sh) {
          var o = sh.e, S = [['The graph of ' + t('y=' + o.k) + ' has slope 0.', true], ['The graph of ' + t('y=' + o.k) + ' is a vertical line.', false], ['The graph of ' + t('x=' + o.k) + ' has slope 0.', false], ['The graph of ' + t('x=' + o.k) + ' has an undefined slope.', true]][o.kind];
          return tf(r, '(e) ' + S[0], S[1], 'Horizontal (' + t('y=k') + '): slope 0. Vertical (' + t('x=k') + '): undefined slope.', (S[1] ? '<b>True</b>. ' : '<b>False</b>. ') + 'A line ' + t('y=k') + ' is horizontal with slope 0; a line ' + t('x=k') + ' is vertical with an undefined slope.', ['Horizontal: rise 0. Vertical: run 0.'], 'zero vs undefined');
        } },
        { id: 'e14f', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          var o = sh.f, g = gcd(gcd(o.A, o.Bv), o.C), eqs = [[o.A, -o.Bv, -o.C], [-o.A, o.Bv, -o.C], [2 * o.A, -2 * o.Bv, 2 * o.C]][o.kind], eq = pol([[eqs[0], 'x'], [eqs[1], 'y'], [eqs[2], '']]) + '=0';
          var truth = o.kind === 0 && g === 1;
          return tf(r, '(f) ' + t(eq) + ' is written in proper general form.', truth, truth ? 'Integers, ' + t('A') + ' positive, no common factor — negative ' + t('B') + ' and ' + t('C') + ' are fine.' : o.kind === 1 ? t('A') + ' must be positive.' : 'The coefficients have a common factor' + (g > 1 && o.kind === 0 ? ' of ' + t(g) : '') + '.', truth ? '<b>True</b>: only ' + t('A') + ' has to be positive; ' + t('B') + ' and ' + t('C') + ' may be negative.' : '<b>False</b>: ' + (o.kind === 1 ? t('A') + ' is negative — multiply every term by ' + t('-1') + '.' : 'every coefficient shares a common factor — divide it out.'), ['Proper general form: integers, ' + t('A>0') + ', no common factor.'], 'proper general form?');
        } }] },
    /* ---------------- Part F ---------------- */
    { num: '15', section: 'Extra practice F — Applications', shared: function (r) {
        if (r.chance(0.25)) return { D0: 20, q: 1.25, t1: 6, tf: 10 };
        return gen(r, function (r) { var q = r.pick([0.5, 0.75, 1.25, 1.5, 2, 2.5]), D0 = r.pick([9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 27, 30]), T = D0 / q; if (!isI(T) || T < 8 || T > 28) return null; var t1 = r.int(2, T - 2), tf = r.int(2, T - 2); return t1 === tf ? null : { D0: D0, q: q, t1: t1, tf: tf }; });
      },
      stem: function (sh) { return 'Amira’s monthly phone plan includes ' + t(sh.D0) + ' GB of data. She uses data at a steady ' + t(nf(sh.q)) + ' GB per day. Let ' + t('D') + ' be the data remaining (GB) after ' + t('t') + ' days of the month.'; },
      parts: [
        { id: 'e15a', level: 'PRG', outcome: 'RF4', make: function (r, sh) { return ctxLine('(a) Write an equation for ' + t('D') + ' in terms of ' + t('t') + '.', -sh.q, sh.D0, { X: 't', Y: 'D' }, 'She loses ' + t(nf(sh.q)) + ' GB each day from ' + t(sh.D0) + ' GB: ' + t(ctxTex('D', 't', -sh.q, sh.D0)), ['Using data makes the amount go down: negative slope.'], 'data equation'); } },
        { id: 'e15b', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var T = sh.D0 / sh.q, xm = Math.ceil((T + 1) / 4) * 4 + 1, key = gv([], [segv([0, sh.D0], [T, 0])]);
          var I = { x: [0, xm], y: [0, sh.D0 + 3], labels: 4, firstQuadrant: true, xName: 't', yName: 'D', xTitle: 'Time, t (days)', yTitle: 'Data remaining, D (GB)', defaultEnd: 'closed', tools: ['line', 'ends'] };
          var p = B.graph('(b) Graph the relation on the axes. Use <b>╱ Line</b>: tap the start of the month, then the day the data runs out (the ends are dots — the month has a start and an end).', I, exactChk(key, { wrong: [{ is: gv([], [segv([0, sh.D0], [T, 0], 'arrow', 'arrow')]), code: 'graph-arrows', hint: 'The data starts at ' + t('t=0') + ' and runs out at ' + t('t=' + T) + ': draw a segment with dots at the ends.' }] }), key,
            'Start at ' + t(ptT([0, sh.D0])) + ' (full allowance). The data runs out when ' + t('D=0') + ': ' + t('t=' + sh.D0 + '\\div ' + nf(sh.q) + '=' + T) + ', the point ' + t(ptT([T, 0])) + '. Join them with a straight segment.', ['Plot the two intercepts: ' + t('(0,\\ ' + sh.D0 + ')') + ' and the day ' + t('D=0') + '.'], 'graph the data line');
          p.bad = [gv([], [segv([0, sh.D0], [T, 0], 'arrow', 'arrow')]), gv([], [segv([0, 0], [T, sh.D0])])];
          return p;
        } },
        { id: 'e15c', level: 'ADV', outcome: 'RF6', make: function (r, sh) { var m = Q(LN.toFr(-sh.q)), L = lineMB(m, sh.D0); return lineP('(c) Convert your equation to general form, using ' + t('t') + ' and ' + t('D') + '. <i>(Clear the decimal first.)</i>', L, { form: 'general', vars: ['t', 'D'] }, 'Write ' + t(nf(-sh.q) + '=' + qT(m)) + '. ' + genSteps(m, sh.D0, ['t', 'D']), GENH.concat(['Write the decimal as a fraction, then multiply every term by its denominator.']), 'context general form'); } },
        { id: 'e15d', level: 'BEG', outcome: 'RF5', make: function (r, sh) {
          var T = sh.D0 / sh.q;
          return nums('(d) State the ' + t('D') + '-intercept and the ' + t('t') + '-intercept (values with units).', [{ label: t('D') + '-intercept:', name: 'D-intercept', ans: sh.D0, after: 'GB', list: [{ v: T, code: 'int-swap', hint: 'That’s the ' + t('t') + '-intercept.' }] }, { label: t('t') + '-intercept:', name: 't-intercept', ans: T, after: 'days', list: [{ v: sh.D0, code: 'int-swap', hint: 'That’s the ' + t('D') + '-intercept.' }] }],
            t('D') + '-intercept ' + t(sh.D0) + ' GB: the data she starts the month with. ' + t('t') + '-intercept: ' + t('0=' + nf(-sh.q) + 't+' + sh.D0 + '\\Rightarrow t=' + T) + ' days: the day her data runs out.', ['Set ' + t('t=0') + ' for one and ' + t('D=0') + ' for the other.'], 'context intercepts');
        } },
        { id: 'e15e', level: 'BEG', outcome: 'RF4', make: function (r, sh) { var v = cl(sh.D0 - sh.q * sh.t1); return num('(e) How much data is left after ' + t(sh.t1) + ' days?', v, [{ v: sh.q * sh.t1, code: 'ctx-change', hint: 'That’s the data used. How much is <b>left</b>?' }], t('D=' + nf(-sh.q) + '(' + sh.t1 + ')+' + sh.D0 + '=' + nf(v)) + ' GB', ['Substitute ' + t('t=' + sh.t1) + '.'], 'data left', { after: 'GB' }); } },
        { id: 'e15f', level: 'PRG', outcome: 'RF4', make: function (r, sh) { var V = cl(sh.D0 - sh.q * sh.tf); return num('(f) Amira wants to still have ' + t(nf(V)) + ' GB left when she starts streaming a series. On which day is that?', sh.tf, [{ v: V / sh.q, code: 'ctx-no-sub', hint: 'Use the whole equation: ' + t(nf(V) + '=' + nf(-sh.q) + 't+' + sh.D0) + '.' }], t(nf(V) + '=' + nf(-sh.q) + 't+' + sh.D0 + '\\Rightarrow ' + nf(sh.q) + 't=' + nf(sh.D0 - V) + '\\Rightarrow t=' + sh.tf), ['Set ' + t('D=' + nf(V)) + ' and solve.'], 'day for data', { before: 'day' }); } }] },
    { num: '16', shared: function (r) {
        if (r.chance(0.25)) return { q: 0.3, F: 41, n1: 150, n2: 400, N: 1000, bud: 200 };
        return gen(r, function (r) { var q = r.pick([0.2, 0.25, 0.3, 0.4, 0.5]), F = r.pick(steps(20, 60, 1)), n1 = r.pick(steps(100, 300, 50)), n2 = n1 + r.pick(steps(150, 400, 50)), N = r.pick([600, 800, 1000, 1200]), nb = r.pick(steps(300, 900, 10)); var bud = cl(F + q * nb); if (!isI(bud) || !isI(F + q * n1) || !isI(F + q * n2)) return null; return { q: q, F: F, n1: n1, n2: n2, N: N, bud: bud }; });
      },
      stem: function (sh) { return 'A print shop charges a one-time setup fee plus a fixed price per flyer. An order of ' + t(sh.n1) + ' flyers cost ' + $(sh.F + sh.q * sh.n1) + ', and an order of ' + t(sh.n2) + ' flyers cost ' + $(sh.F + sh.q * sh.n2) + '. Let ' + t('C') + ' be the cost in dollars for ' + t('n') + ' flyers.'; },
      parts: [
        { id: 'e16a', level: 'ADV', outcome: 'RF7', make: function (r, sh) { var C1 = cl(sh.F + sh.q * sh.n1), C2 = cl(sh.F + sh.q * sh.n2); return ctxLine('(a) Determine the price per flyer and the setup fee, then write the equation for ' + t('C') + ' in terms of ' + t('n') + '.', sh.q, sh.F, { X: 'n', Y: 'C', wrong: [{ m: sh.q, b: C1, code: 'ctx-b-point', hint: t(nf(C1)) + ' is the cost of ' + t(sh.n1) + ' flyers, not the setup fee. Substitute to find ' + t('b') + '.' }] }, t('m=\\dfrac{' + nf(C2) + '-' + nf(C1) + '}{' + sh.n2 + '-' + sh.n1 + '}=\\dfrac{' + nf(C2 - C1) + '}{' + (sh.n2 - sh.n1) + '}=' + nf(sh.q)) + ' dollars per flyer.<br>' + t(nf(C1) + '=' + nf(sh.q) + '(' + sh.n1 + ')+b=' + nf(sh.q * sh.n1) + '+b\\Rightarrow b=' + sh.F) + ': setup fee ' + $(sh.F) + '.<br>' + t(ctxTex('C', 'n', sh.q, sh.F)), ['The price per flyer is the slope between the two orders.'], 'print shop equation'); } },
        { id: 'e16b', level: 'ADV', outcome: 'RF6', make: function (r, sh) { var m = Q(LN.toFr(sh.q)), L = lineMB(m, sh.F); return lineP('(b) Convert the equation to general form, with integer coefficients and a positive leading coefficient (use ' + t('n') + ' and ' + t('C') + ').', L, { form: 'general', vars: ['n', 'C'] }, 'Write ' + t(nf(sh.q) + '=' + qT(m)) + '. ' + genSteps(m, sh.F, ['n', 'C']), GENH, 'print shop general form'); } },
        { id: 'e16c', level: 'ADV', outcome: 'RF4', make: function (r, sh) { var cN = cl(sh.q * sh.N + sh.F), nb = cl((sh.bud - sh.F) / sh.q); return nums('(c) Find the cost of ' + t(nf(sh.N)) + ' flyers, then the largest order possible on a budget of ' + $(sh.bud) + '.', [{ label: 'Cost:', ans: cN, money: true, list: [{ v: sh.q * sh.N, code: 'ctx-no-b', hint: 'Add the setup fee.' }] }, { label: 'Largest order:', ans: nb, after: 'flyers', list: [{ v: sh.bud / sh.q, code: 'ctx-no-sub', hint: 'Take off the setup fee first.' }] }], t('C=' + nf(sh.q) + '(' + nf(sh.N) + ')+' + sh.F + '=' + nf(cN)) + '<br>' + t(sh.bud + '=' + nf(sh.q) + 'n+' + sh.F + '\\Rightarrow ' + nf(sh.q) + 'n=' + (sh.bud - sh.F) + '\\Rightarrow n=' + nb) + ' flyers', ['Substitute for the cost; set ' + t('C=' + sh.bud) + ' and solve for the order.'], 'use the print model'); } }] },
    { num: '17', shared: function (r) {
        if (r.chance(0.25)) return { P: 95, f: 35, q: 0.25, d1: 180, d2: 400 };
        return gen(r, function (r) { var q = r.pick([0.2, 0.25, 0.4, 0.5]), f = r.pick([25, 30, 35, 40]), ds = r.pick(steps(100, 400, 20)), P = cl(f + q * ds); if (!isI(P)) return null; return { P: P, f: f, q: q, d1: ds - r.pick([40, 60, 80]), d2: ds + r.pick([100, 160, 200]) }; });
      },
      stem: function (sh) { return 'A car-rental company offers two plans for a one-day rental. Plan A is a flat ' + $(sh.P) + ' with unlimited distance. Plan B is ' + $(sh.f) + ' plus ' + $(sh.q) + ' per kilometre driven. Let ' + t('C') + ' be the cost in dollars for ' + t('d') + ' kilometres.'; },
      parts: [
        { id: 'e17a', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var cA = K.line({ m: 0, b: sh.P }, { vars: ['d', 'C'] }), cB = K.line({ m: sh.q, b: sh.f }, { vars: ['d', 'C'], form: 'slope-intercept' });
          var p = B.fields('(a) Write an equation for each plan.', [eqFld('Plan A:', ['d', 'C']), eqFld('Plan B:', ['d', 'C'])], [cA, cB], ['C=' + sh.P, 'C=' + sh.q + 'd+' + sh.f], t('C=' + sh.P) + ', ' + t(ctxTex('C', 'd', sh.q, sh.f)), 'Plan A doesn’t depend on distance: ' + t('C=' + sh.P) + '. Plan B: ' + t(ctxTex('C', 'd', sh.q, sh.f)) + '.', ['A flat price means the cost never changes: slope 0.'], 'two rental plans');
          p.bad = [['C=' + sh.P + 'd', 'C=' + sh.f + 'd+' + sh.q]]; return p;
        } },
        { id: 'e17b', level: 'BEG', outcome: 'RF3', make: function (r, sh) {
          return mc(r, '(b) What is the slope of Plan A, and what does it mean?', [
            { html: 'Slope 0: the cost doesn’t change at all as the distance increases. Its graph is a horizontal line.', right: true },
            { html: 'Slope ' + t(sh.P) + ': the cost goes up ' + $(sh.P) + ' per km. Its graph is a steep line.', why: t(sh.P) + ' is the flat price (the intercept). It isn’t charged per km.' },
            { html: 'Undefined slope: there is no ' + t('d') + ' in the equation. Its graph is a vertical line.', why: 'No ' + t('d') + '-term means slope 0 — a horizontal line. Vertical lines have the form ' + t('d=k') + '.' },
            { html: 'Slope 0: the car can’t be driven. Its graph is a single point.', why: 'You can drive any distance; the cost just stays at ' + $(sh.P) + '.' }],
            t('C=' + sh.P) + ' is ' + t('C=0d+' + sh.P) + ': slope 0 — the cost is the same for every distance, a horizontal line.', ['How much does the cost change per km?'], 'slope 0 in context');
        } },
        { id: 'e17c', level: 'PRG', outcome: 'RF4', make: function (r, sh) { var ds = (sh.P - sh.f) / sh.q; return num('(c) Determine the distance at which the two plans cost the same.', ds, [{ v: sh.P / sh.q, code: 'ctx-no-sub', hint: 'Subtract Plan B’s ' + $(sh.f) + ' first.' }, { v: sh.P, code: 'u7l9-breakeven-cost', hint: 'That’s the cost. The question asks for the distance.' }], t(sh.P + '=' + nf(sh.q) + 'd+' + sh.f + '\\Rightarrow ' + nf(sh.q) + 'd=' + (sh.P - sh.f) + '\\Rightarrow d=' + ds) + ' km', ['Set the two costs equal.'], 'break-even distance', { after: 'km' }); } },
        { id: 'e17d', level: 'PRG', outcome: 'RF4', make: function (r, sh) { var B1 = cl(sh.q * sh.d1 + sh.f); return costsPick('(d) Which plan is cheaper for a ' + t(sh.d1) + ' km day? Find both costs.', [{ label: 'Plan A:', ans: sh.P, list: [{ v: B1, code: 'ctx-swap-boxes', hint: 'That’s Plan B.' }] }, { label: 'Plan B:', ans: B1, list: [{ v: sh.P, code: 'ctx-swap-boxes', hint: 'That’s Plan A.' }] }], B1 < sh.P ? 'B' : 'A', 'A: ' + $(sh.P) + '; B: ' + t(nf(sh.q) + '(' + sh.d1 + ')+' + sh.f + '=' + nf(B1)) + '. <b>' + (B1 < sh.P ? 'B' : 'A') + '</b> is cheaper.', ['Plan A is the same for any distance.'], 'cheaper short day'); } },
        { id: 'e17e', sub: 'd ii', level: 'PRG', outcome: 'RF4', make: function (r, sh) { var B2 = cl(sh.q * sh.d2 + sh.f); return costsPick('(d) Which plan is cheaper for a ' + t(sh.d2) + ' km day? Find both costs.', [{ label: 'Plan A:', ans: sh.P, list: [{ v: B2, code: 'ctx-swap-boxes', hint: 'That’s Plan B.' }] }, { label: 'Plan B:', ans: B2, list: [{ v: sh.P, code: 'ctx-swap-boxes', hint: 'That’s Plan A.' }] }], B2 < sh.P ? 'B' : 'A', 'A: ' + $(sh.P) + '; B: ' + t(nf(sh.q) + '(' + sh.d2 + ')+' + sh.f + '=' + nf(B2)) + '. <b>' + (B2 < sh.P ? 'B' : 'A') + '</b> is cheaper.', ['Plan A is the same for any distance.'], 'cheaper long day'); } },
        { id: 'e17f', sub: 'e', level: 'ADV', outcome: 'RF6', make: function (r, sh) {
          var LA = L3(0, 1, -sh.P), m = Q(LN.toFr(sh.q)), LB = lineMB(m, sh.f), V = ['d', 'C'];
          var p = B.fields('(e) Write both equations in general form, using ' + t('d') + ' and ' + t('C') + '.', [eqFld('Plan A:', V, 'e.g. C - 50 = 0'), eqFld('Plan B:', V, 'e.g. d - 2C + 30 = 0')], [K.line(LA, { vars: V, form: 'general' }), K.line(LB, { vars: V, form: 'general' })], [gT(LA, V), gT(LB, V)], t(gT(LA, V)) + ', ' + t(gT(LB, V)),
            'Plan A: ' + t(gT(LA, V)) + ' — here the ' + t('d') + '-coefficient is 0, which is allowed (only ' + t('A') + ' and ' + t('B') + ' can’t both be 0).<br>Plan B: ' + genSteps(m, sh.f, V), GENH, 'context general forms');
          p.bad = [['C+' + sh.P + '=0', gT(lineMB(qn(m), sh.f), V)]]; return p;
        } }] },
    /* ---------------- Part G ---------------- */
    { num: '18', section: 'Extra practice G — Challenge', shared: function (r) {
        if (r.chance(0.25)) return { a: 3, b: 4, c: 6, d1: 7, d2: -5 };
        return gen(r, function (r) { var a = r.int(1, 5), b = r.int(2, 6), c = r.pick([4, 6, 8, 9, 10, 12]); if (gcd(a, b) !== 1 || a === b || (c * b) % a || (c * a) % b === 0) return null; return { a: a, b: b, c: c, d1: rnz(r, -9, 9), d2: rnz(r, -9, 9) }; });
      },
      stem: function (sh) { return '<b>Find the missing coefficient.</b> Two lines have equations ' + t(pol([[sh.a, 'x'], [-sh.b, 'y'], [sh.d1, '']]) + '=0') + ' and ' + t('kx+' + sh.c + 'y' + (sh.d2 < 0 ? '' : '+') + sh.d2 + '=0') + '. (The second line’s slope is ' + t('-\\dfrac{k}{' + sh.c + '}') + '.)'; },
      parts: [
        { id: 'e18a', level: 'PRG', outcome: 'RF6', make: function (r, sh) { var m = Q(sh.a, sh.b); return slopeP('(a) State the slope of the first line.', m, [{ v: Q(-sh.a, sh.b), code: 'u7l10-m-sign', hint: 'Move the ' + t('x') + '-term across, then divide by ' + t(-sh.b) + ': two sign changes.' }], t(-sh.b + 'y=' + (-sh.a) + 'x' + (sh.d1 < 0 ? '+' + (-sh.d1) : '-' + sh.d1) + '\\Rightarrow y=' + qT(m) + 'x' + (qv(Q(sh.d1, sh.b)) < 0 ? '-' + qT(Q(-sh.d1, sh.b)) : '+' + qT(Q(sh.d1, sh.b)))), ['Isolate ' + t('y') + '.'], 'slope from general form'); } },
        { id: 'e18b', level: 'MAS', outcome: 'RF3', make: function (r, sh) { var k = sh.c * sh.b / sh.a; return valP('(b) Determine the value of ' + t('k') + ' that makes the two lines <b>perpendicular</b>.', k, [{ v: -k, code: 'u7l10-k', hint: 'The second slope is ' + t('-\\frac{k}{' + sh.c + '}') + '; it must equal ' + t(qT(Q(-sh.b, sh.a))) + '.' }, { v: -sh.c * sh.a / sh.b, code: 'u7l10-par', hint: 'That makes them parallel. Perpendicular slopes multiply to ' + t('-1') + '.' }], 'Perpendicular slope: ' + t(qT(Q(-sh.b, sh.a))) + '. So ' + t('-\\dfrac{k}{' + sh.c + '}=' + qT(Q(-sh.b, sh.a)) + '\\Rightarrow k=' + k) + '. Check: ' + t(qT(Q(sh.a, sh.b)) + '\\times' + sgnP(Q(-k, sh.c)) + '=-1') + ' ✓', ['Perpendicular: the second slope is the negative reciprocal of the first.'], 'k for perpendicular', { before: t('k=') }); } },
        { id: 'e18c', level: 'MAS', outcome: 'RF6', make: function (r, sh) {
          var k = Q(-sh.c * sh.a, sh.b), L = Lrat(k, Q(sh.c), Q(sh.d2));
          var p = B.fields('(c) Determine the value of ' + t('k') + ' that makes them <b>parallel</b>. That value means ' + t('kx+' + sh.c + 'y' + (sh.d2 < 0 ? '' : '+') + sh.d2 + '=0') + ' is no longer proper general form — give the proper general form of that line.', [valFld('k:', t('k=')), eqFld('General form:', null, 'e.g. 9x - 12y + 10 = 0')],
            [exactV(k, [{ v: qn(k), code: 'u7l10-k', hint: 'The second slope ' + t('-\\frac{k}{' + sh.c + '}') + ' must equal ' + t(qT(Q(sh.a, sh.b))) + '.' }]), K.line(L, { form: 'general' })], [qT(k), gT(L)], t('k=' + qT(k)) + '; ' + t(gT(L)),
            t('-\\dfrac{k}{' + sh.c + '}=' + qT(Q(sh.a, sh.b)) + '\\Rightarrow k=' + qT(k)) + '. That is not a positive integer, so multiply every term by ' + t(-k[1]) + ': ' + t(gT(L)) + '.', ['Parallel: equal slopes. Then clear the fraction and make ' + t('A') + ' positive.'], 'k for parallel');
          p.bad = [[qT(qn(k)), gT(L3(1, 1, 1))]]; return p;
        } }] },
    { num: '19', shared: function (r) {
        if (r.chance(0.25)) return { T: [3, 2], m1: 2, m2: -1, k: -2 };
        return gen(r, function (r) { var m1 = r.pick([1, 2, 3]), m2 = r.pick([-1, -2, -3]), T = [r.int(-2, 4), r.int(0, 5)], k = T[1] - r.pick([2, 3, 4, 6]); var h = T[1] - k; if (h % m1 || h % m2 || Math.abs(m1) === Math.abs(m2) && r.chance(0.5)) return null; var b1 = T[1] - m1 * T[0], b2 = T[1] - m2 * T[0]; if (!b1 || !b2 || !k) return null; return { T: T, m1: m1, m2: m2, k: k }; });
      },
      stem: function (sh) { var b1 = sh.T[1] - sh.m1 * sh.T[0], b2 = sh.T[1] - sh.m2 * sh.T[0]; return '<b>A triangle from three lines.</b> The lines ' + t(siTex(sh.m1, b1)) + ', ' + t(siTex(sh.m2, b2)) + ' and ' + t('y=' + sh.k) + ' enclose a triangle.'; },
      parts: [
        { id: 'e19a', level: 'PRG', outcome: 'RF6', make: function (r, sh) {
          var b1 = sh.T[1] - sh.m1 * sh.T[0], b2 = sh.T[1] - sh.m2 * sh.T[0], L1 = lineMB(sh.m1, b1), L2 = lineMB(sh.m2, b2), L3k = L3(0, 1, -sh.k);
          var p = B.fields('(a) Write all three equations in general form.', [eqFld(t(siTex(sh.m1, b1)) + ':', null, 'e.g. 2x - y - 4 = 0'), eqFld(t(siTex(sh.m2, b2)) + ':', null, 'e.g. x + y - 5 = 0'), eqFld(t('y=' + sh.k) + ':', null, 'e.g. y + 2 = 0')], [K.line(L1, { form: 'general' }), K.line(L2, { form: 'general' }), K.line(L3k, { form: 'general' })], [gT(L1), gT(L2), gT(L3k)], t(gT(L1)) + ', ' + t(gT(L2)) + ', ' + t(gT(L3k)),
            'Move every term to one side, ' + t('x') + '-term positive: ' + t(gT(L1)) + ', ' + t(gT(L2)) + ', ' + t(gT(L3k)) + '.', GENH, 'three general forms');
          p.bad = [[gT(L2), gT(L1), gT(L3(0, 1, sh.k))]]; return p;
        } },
        { id: 'e19b', level: 'ADV', outcome: 'RF4', make: function (r, sh) {
          var xl = sh.T[0] + (sh.k - sh.T[1]) / sh.m1, xr = sh.T[0] + (sh.k - sh.T[1]) / sh.m2, b1 = sh.T[1] - sh.m1 * sh.T[0], b2 = sh.T[1] - sh.m2 * sh.T[0];
          var lab = function (a, b) { return 'Where ' + a + ' meets ' + b + ':'; };
          var p = B.fields('(b) Determine the coordinates of all three vertices. (Each vertex is where two of the lines meet, so set the two expressions for ' + t('y') + ' equal.)', [ptFld('Lines 1 and 2:'), ptFld('Line 1 and ' + t('y=' + sh.k) + ':'), ptFld('Line 2 and ' + t('y=' + sh.k) + ':')], [ptChk(sh.T), ptChk([xl, sh.k]), ptChk([xr, sh.k])], [ptK(sh.T), ptK([xl, sh.k]), ptK([xr, sh.k])], t(ptT(sh.T)) + ', ' + t(ptT([xl, sh.k])) + ', ' + t(ptT([xr, sh.k])),
            t(pol([[sh.m1, 'x'], [b1, '']]) + '=' + pol([[sh.m2, 'x'], [b2, '']]) + '\\Rightarrow x=' + sh.T[0]) + ', ' + t('y=' + sh.T[1]) + ' → ' + t(ptT(sh.T)) + '<br>' + t(pol([[sh.m1, 'x'], [b1, '']]) + '=' + sh.k + '\\Rightarrow x=' + xl) + ' → ' + t(ptT([xl, sh.k])) + '<br>' + t(pol([[sh.m2, 'x'], [b2, '']]) + '=' + sh.k + '\\Rightarrow x=' + xr) + ' → ' + t(ptT([xr, sh.k])), ['Set the right sides equal and solve for ' + t('x') + ', then find ' + t('y') + '.'], 'triangle vertices');
          p.bad = [[ptK(sh.T), ptK([xr, sh.k]), ptK([xl, sh.k])]]; return p;
        } },
        { id: 'e19c', level: 'ADV', outcome: 'RF4', make: function (r, sh) {
          var xl = sh.T[0] + (sh.k - sh.T[1]) / sh.m1, xr = sh.T[0] + (sh.k - sh.T[1]) / sh.m2, base = Math.abs(xr - xl), h = sh.T[1] - sh.k;
          return nums('(c) Using the vertices, state the length of the horizontal side and the vertical height of the triangle, then find its area.', [{ label: 'Base:', ans: base, after: 'units', list: [{ v: h, code: 'ctx-swap-boxes', hint: 'That’s the height.' }] }, { label: 'Height:', ans: h, after: 'units', list: [{ v: base, code: 'ctx-swap-boxes', hint: 'That’s the base.' }] }, { label: 'Area:', ans: base * h / 2, after: 'square units', list: [{ v: base * h, code: 'u7l10-area-half', hint: 'A triangle’s area is ' + t('\\frac{1}{2}bh') + '.' }] }],
            'Base from ' + t(ptT([xl, sh.k])) + ' to ' + t(ptT([xr, sh.k])) + ': ' + t(base) + '. Height from ' + t('y=' + sh.k) + ' up to ' + t('y=' + sh.T[1]) + ': ' + t(h) + '. Area ' + t('=\\frac{1}{2}(' + base + ')(' + h + ')=' + nf(base * h / 2)) + ' square units.', ['Horizontal length: subtract the ' + t('x') + '-values. Height: subtract the ' + t('y') + '-values.'], 'triangle area');
        } },
        { id: 'e19d', level: 'PRG', outcome: 'RF6', make: function (r, sh) { var L = L3(1, 0, -sh.T[0]); return lineP('(d) Write the equation of the line through the top vertex that is perpendicular to ' + t('y=' + sh.k) + '.', L, { form: 'any', wrong: [{ is: L3(0, 1, -sh.T[1]), code: 'line-vh', hint: 'That line is horizontal, parallel to ' + t('y=' + sh.k) + '. Perpendicular to a horizontal line is <b>vertical</b>.' }] }, 'Perpendicular to a horizontal line is vertical. Through ' + t(ptT(sh.T)) + ': ' + t('x=' + sh.T[0]) + ' (' + t(gT(L)) + '). It has an undefined slope, so it can’t be written ' + t('y=mx+b') + '.', ['What is perpendicular to a horizontal line?'], 'vertical through vertex'); } }] },
    { num: '20', stem: '<b>Building an equation from its intercepts and its points.</b>', shared: function (r) {
        if (r.chance(0.25)) return { c: 12, xi: 4, yi: -3, P1: [2, -1], P2: [-3, 4], s: 6 };
        var a = gen(r, function (r) { var xi = rnz(r, -6, 6), yi = rnz(r, -6, 6), c = r.pick([12, 18, 24, 30, 36]); if (c % xi || c % yi || Math.abs(xi) === 1 || Math.abs(yi) === 1 || xi === yi) return null; return { xi: xi, yi: yi, c: c }; });
        var b = gen(r, function (r) { var m = r.pick([-1, -2, -3, 1, 2, 3, Q(-1, 2), Q(1, 3), Q(-2, 3), Q(1, 2)]), x1 = r.int(-3, 3), P1 = [x1, r.int(-4, 4)], d = Q(m)[1] * r.pick([-2, -1, 1, 2]), P2 = [x1 + d, P1[1] + qv(m) * d]; var L = line2(P1, P2), s = r.pick([6, 12]); if (s % L.A) return null; return { P1: P1, P2: P2, s: s }; });
        return { c: a.c, xi: a.xi, yi: a.yi, P1: b.P1, P2: b.P2, s: b.s };
      },
      parts: [
        { id: 'e20a', level: 'MAS', outcome: 'RF6', make: function (r, sh) {
          var A = sh.c / sh.xi, Bv = sh.c / sh.yi, L = L3(A, Bv, -sh.c);
          var p = B.fields('(a) A line has equation ' + t('Ax+By-' + sh.c + '=0') + '. Its ' + t('x') + '-intercept is ' + t(sh.xi) + ' and its ' + t('y') + '-intercept is ' + t(sh.yi) + '. Determine ' + t('A') + ' and ' + t('B') + ', then write the equation in slope–intercept form.', [valFld(t('A') + ':', t('A=')), valFld(t('B') + ':', t('B=')), eqFld(t('y=mx+b') + ':')],
            [exactV(A, [{ v: Bv, code: 'int-swap', hint: 'Use the ' + t('x') + '-intercept for ' + t('A') + ': at ' + t(ptT([sh.xi, 0])) + ', ' + t(sh.xi + 'A-' + sh.c + '=0') + '.' }, { v: -A, code: 'sign', hint: 'Check the sign.' }]), exactV(Bv, [{ v: A, code: 'int-swap', hint: 'Use the ' + t('y') + '-intercept for ' + t('B') + '.' }, { v: -Bv, code: 'sign', hint: 'Check the sign.' }]), K.line(L, { form: 'slope-intercept' })],
            [String(A), String(Bv), sT(L)], t('A=' + A) + ', ' + t('B=' + Bv) + ', ' + t(sT(L)),
            t('x') + '-intercept: ' + t(sh.xi + 'A-' + sh.c + '=0\\Rightarrow A=' + A) + '. ' + t('y') + '-intercept: ' + t(sh.yi + 'B-' + sh.c + '=0\\Rightarrow B=' + Bv) + '.<br>' + t(pol([[A, 'x'], [Bv, 'y'], [-sh.c, '']]) + '=0') + '<br>' + t(sT(L)),
            ['At the ' + t('x') + '-intercept ' + t('y=0') + ', so ' + t('A\\times(\\text{x-intercept})-' + sh.c + '=0') + '.'], 'coefficients from intercepts');
          p.bad = [[String(Bv), String(A), sT(L3(Bv, A, -sh.c))]]; return p;
        } },
        { id: 'e20b', level: 'MAS', outcome: 'RF7', make: function (r, sh) {
          var L = line2(sh.P1, sh.P2), f = sh.s / L.A, Bv = L.B * f, Cv = L.C * f, m = slopeOf(L);
          var p = B.fields('(b) A line has equation ' + t(sh.s + 'x+By+C=0') + ' and passes through ' + t(ptT(sh.P1)) + ' and ' + t(ptT(sh.P2)) + '. Determine ' + t('B') + ' and ' + t('C') + '. <i>(Find the slope–intercept equation first, convert it to simplest general form, then scale it so the ' + t('x') + '-coefficient is ' + t(sh.s) + '.)</i>', [valFld(t('B') + ':', t('B=')), valFld(t('C') + ':', t('C='))],
            [exactV(Bv, [{ v: L.B, code: 'u7l10-k', hint: 'Scale every coefficient by ' + t(f) + ' so the ' + t('x') + '-coefficient is ' + t(sh.s) + '.' }, { v: -Bv, code: 'sign', hint: 'Check the sign.' }]), exactV(Cv, [{ v: L.C, code: 'u7l10-k', hint: 'Scale the constant by ' + t(f) + ' too.' }, { v: -Cv, code: 'sign', hint: 'Check the sign.' }])], [String(Bv), String(Cv)], t('B=' + Bv) + ', ' + t('C=' + Cv),
            slopeSteps(sh.P1, sh.P2) + '<br>' + bSteps(m, sh.P1) + '<br>Simplest general form: ' + t(gT(L)) + '<br>Multiply by ' + t(f) + ': ' + t(pol([[sh.s, 'x'], [Bv, 'y'], [Cv, '']]) + '=0') + ', so ' + t('B=' + Bv) + ', ' + t('C=' + Cv) + '.',
            ['Find ' + t('y=mx+b') + ', write it in general form, then multiply every term so the ' + t('x') + '-coefficient is ' + t(sh.s) + '.'], 'scale general form');
          p.bad = [[String(L.B), String(L.C)]].filter(function () { return f !== 1; }).concat([[String(-Bv), String(-Cv)]]); return p;
        } }] }
  ];
  LESSON.extra = EXTRA;
  HW.defineLesson(LESSON);
})(window);
