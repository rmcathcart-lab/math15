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
        return wrong('u7l10-off-line', 'That point isn’t on the line: substitute it into the equation to check. Start at the ' + t('y') + '-intercept, go across the run, then up or down the rise.');
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
      { num: '1', section: 'Part A — Tables, Slope-Intercept Basics, and Graphing', shared: function (r) { return r.chance(0.25) ? { m: -3, b: 4 } : { m: rnz(r, -4, 4), b: rnz(r, -6, 6) }; },
        parts: [{ id: '1', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var xs = [-2, -1, 0, 1, 2], ys = xs.map(function (x) { return sh.m * x + sh.b; });
          var tb = HW.valueTable([[t('x')].concat(xs.map(function (x) { return t(x); })), [t('y')].concat(xs.map(function () { return '?'; }))]);
          var p = nums('Complete a table of values for ' + t(siTex(sh.m, sh.b)) + '.' + tb, xs.map(function (x, i) {
            return { label: t('x=' + x) + ':', name: 'y at x=' + x, before: t('y='), ans: ys[i], list: [{ v: -sh.m * x + sh.b, code: 'u7l10-tab-sign', hint: 'Careful with the signs: ' + t(sh.m + '\\times' + sgnP(x) + '=' + (sh.m * x)) + '.' }, { v: sh.m + x + sh.b, code: 'u7l10-tab-add', hint: t(sh.m + 'x') + ' means ' + t(sh.m) + ' <b>times</b> ' + t('x') + '.' }] };
          }), xs.map(function (x, i) { return t('y=' + sh.m + sgnP(x) + (sh.b < 0 ? '' : '+') + sh.b + '=' + ys[i]); }).join('<br>') + '<br>Ordered pairs: ' + t(xs.map(function (x, i) { return ptT([x, ys[i]]); }).join(',\\ ')),
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
      { num: '12', stem: 'Determine the equation of the line in the form ' + t('y=mx+b') + '.', shared: function (r) { if (r.chance(0.25)) return { A: [2, 3], B: [6, 19] }; return gen(r, function (r) { var m = r.int(2, 5), x1 = r.int(1, 3), x2 = x1 + r.int(2, 4), y1 = r.int(-4, 6), b = y1 - m * x1; return b ? { A: [x1, y1], B: [x2, y1 + m * (x2 - x1)] } : null; }); },
        parts: [{ id: '12', level: 'PRG', outcome: 'RF7', make: function (r, sh) {
          var m = Q(sh.B[1] - sh.A[1], sh.B[0] - sh.A[0]);
          return lineP('Through ' + t(ptT(sh.A)) + ' and ' + t(ptT(sh.B)) + '.', line2(sh.A, sh.B), { form: 'slope-intercept', wrong: mpWrongs(m, sh.A).concat([{ is: { m: Q(m[1], m[0]), b: qs(sh.A[1], qm(Q(m[1], m[0]), sh.A[0])) }, code: 'line-slope-flip', hint: 'Slope is rise over run: change in ' + t('y') + ' on top.' }]) },
            'Step 1: ' + slopeSteps(sh.A, sh.B) + '<br>Step 2: ' + bSteps(m, sh.A), ['Step 1: find the slope. Step 2: substitute the slope and either point into ' + t('y=mx+b') + '.'], 'two points');
        } }] },
      { num: '13', stem: 'Determine the equation of the line in the form ' + t('y=mx+b') + '.', shared: function (r) { if (r.chance(0.25)) return { A: [-3, 10], B: [3, -2] }; return gen(r, function (r) { var m = -r.int(1, 4), a = r.int(1, 4), b = rnz(r, -6, 8); return { A: [-a, b + m * -a], B: [a, b + m * a] }; }); },
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
      { num: '26', shared: function (r) { if (r.chance(0.25)) return { A: [-4, 1], B: [2, -11] }; return gen(r, function (r) { var m = r.pick([-2, -3, 2, 3, -4]), b = rnz(r, -9, 9), x1 = -r.int(1, 4), x2 = r.int(1, 3); if (b % m === 0) return null; return { A: [x1, m * x1 + b], B: [x2, m * x2 + b] }; }); },
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
  var EXTRA = [];
  LESSON.extra = EXTRA;
  HW.defineLesson(LESSON);
})(window);
