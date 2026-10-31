/* Math 15 · Unit 8 · Lesson 5 — Solving Systems by Elimination, Part 1: When Coefficients Already Match (RF9)
 * Assignment 5 (u8_L05.tex, Questions 1–15) and the Lesson 5 Extra Practice (u8_EP05.tex, Questions 1–17).
 * Every part is a generator: same structure, idea and difficulty as the booklet question (which variable lines up,
 * equal or opposite coefficients, signs, fractions or not, the kind of answer), new numbers from the seed; the booklet's
 * own system is among the possible versions. No calculator: integer solutions unless the booklet item has fractions.
 * Model: Math 10C u8l3.js (elimination: the one-variable equation after adding/subtracting typed as its own step,
 * classic slips → wrong pairs with their own hints, special cases, unknown coefficients).
 * Conversions: "add or subtract? which variable?" -> multiple choice; "solve by subtracting / adding" -> the
 * one-variable equation the step produces, then the ordered pair; "explain / find the error" -> multiple choice
 * whose options are reasons; word problems -> the system (equation boxes), then the values.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Q14 (three equations), Extra 10(c) (unknown coefficient). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, LN = HW.lines, ex = HW.ex;

  HW.addCodes({
    'elim-rhs': 'Combined the right sides the other way (added vs subtracted)', 'elim-sub-sign': 'Subtracting: sign of a term not changed', 'elim-not': 'Combination still has both variables',
    'eq-step': 'Gave a later (simplified) step instead of the combined equation', 'addsub': 'Chose add vs subtract wrongly', 'nr-partial': 'Gave x or y instead of the requested expression', 'nr-swap': 'Evaluated the expression with x and y swapped',
    'pt-fraction': 'Exact answer given as a decimal', 'swap-answer': 'Right numbers in the wrong boxes', 'one-value': 'One value right, the other wrong', 'diff-order': 'Difference subtracted in the wrong order',
    'boat-swap': 'Current: downstream and upstream swapped', 'z-wrong': 'Three unknowns: a value wrong', 'xy-right-z': 'Three unknowns: one value wrong', 'u8-count-swap': 'Ticket counts swapped', 'u8-price-swap': 'Prices matched to the wrong tickets',
    'coef-swap': 'Coefficients attached to the wrong variables', 'perim-half': 'Perimeter: used l + w instead of 2l + 2w', 'sub-swap': 'Substituted the point’s coordinates into the wrong letters',
    'u8l5-order': 'Equation not lined up as ax + by = c', 'eq': 'Wrong equation', 'rearr-sign': 'Sign not changed when moving a term across =', 'u8l5-back-sign': 'Sign slip finding the unknown coefficient'
  });
  HW.addPartial({ 'u8l5-back-sign': 's' });

  /* ---------------- rational numbers [p, q] ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function lcm(a, b) { return a / (gcd(a, b) || 1) * b; }
  function Q(p, q) { if (Array.isArray(p)) return Q(p[0], p[1]); if (q === undefined) q = 1; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g + 0, q / g]; }
  function qa(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qs(a, b) { b = Q(b); return qa(a, [-b[0], b[1]]); }
  function qm(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[0], a[1] * b[1]); }
  function qd(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[1], a[1] * b[0]); }
  function qn(a) { a = Q(a); return [-a[0] + 0, a[1]]; }
  function qv(a) { a = Q(a); return a[0] / a[1]; }
  function qT(a) { a = Q(a); return LN.frT(a[0], a[1]); }
  function isInt(a) { return Q(a)[1] === 1; }
  function ptT(p) { return '(' + qT(p[0]) + ',\\ ' + qT(p[1]) + ')'; }
  function ptK(p) { return '(' + qT(p[0]) + ', ' + qT(p[1]) + ')'; }
  function nb(x) { return x < 0 ? '(' + x + ')' : String(x); }
  function qb(x) { return qv(x) < 0 ? '\\left(' + qT(x) + '\\right)' : qT(x); }
  function dc(x) { return String(Math.round(x * 1e6) / 1e6); }
  function rnz(r, a, b) { var v; do { v = r.int(a, b); } while (v === 0); return v; }
  function sgn(r) { return r.chance(0.5) ? 1 : -1; }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }

  /* ---------------- terms and equations ---------------- */
  function term(c, v, first) {
    var f = Q(c); if (f[0] === 0) return '';
    var s = f[0] < 0 ? '-' : (first ? '' : '+'), ab = Math.abs(f[0]);
    return s + (f[1] === 1 ? (ab === 1 && v ? '' : String(ab)) : '\\frac{' + ab + '}{' + f[1] + '}') + v;
  }
  function pol(list) { var out = ''; list.forEach(function (tm) { out += term(tm[0], tm[1], !out); }); return out || '0'; }
  function cB(c, inner, first) {
    var f = Q(c); if (f[0] === 0) return '';
    var s = f[0] < 0 ? '-' : (first ? '' : '+'), ab = Math.abs(f[0]);
    return s + (f[1] === 1 ? (ab === 1 ? '' : String(ab)) : '\\frac{' + ab + '}{' + f[1] + '}') + '\\left(' + inner + '\\right)';
  }
  function E(a, b, c) { return { a: Q(a), b: Q(b), c: Q(c) }; }          // a·X + b·Y = c
  function co(e, k) { return k === 0 ? e.a : e.b; }
  function eqT(e, V) { V = V || ['x', 'y']; return pol([[e.a, V[0]], [e.b, V[1]]]) + '=' + qT(e.c); }
  function siT(e, V) { V = V || ['x', 'y']; return V[1] + '=' + pol([[qd(qn(e.a), e.b), V[0]], [qd(e.c, e.b), '']]); }
  function det(E1, E2) { return qs(qm(E1.a, E2.b), qm(E2.a, E1.b)); }
  function solve2(E1, E2) {
    var D = det(E1, E2); if (qv(D) === 0) return null;
    return [qd(qs(qm(E1.c, E2.b), qm(E2.c, E1.b)), D), qd(qs(qm(E1.a, E2.c), qm(E2.a, E1.c)), D)];
  }
  function onE(e, p) { return qv(qs(qa(qm(e.a, p[0]), qm(e.b, p[1])), e.c)) === 0; }
  function sysA(e) { return [qv(e.a), qv(e.b), -qv(e.c)]; }
  function sysD(texs) { return '\\[\\begin{aligned}' + texs.map(function (s) { return s.replace('=', '&='); }).join('\\\\') + '\\end{aligned}\\]'; }
  function dTerm(n, v, first) { if (!n) return ''; return (n < 0 ? '-' : first ? '' : '+') + dc(Math.abs(n) / 10) + v; }
  function mc(r, prompt, opts, sol, hints, text, keep) { return B.mc(r, prompt, opts, sol, hints || [], text, keep); }
  function gen(r, maker, book) { for (var g = 0; g < 800; g++) { var S = maker(r); if (S) return S; } return book(); }
  function okEq(e) { return qv(e.c) !== 0 && gcd(gcd(e.a[0], e.b[0]), e.c[0]) === 1; }

  /* two (or more) numbers in labelled boxes */
  function numFields(prompt, labs, vals, o) {
    o = o || {};
    var chk = function (resp) {
      resp = resp || []; var v = [];
      for (var i = 0; i < vals.length; i++) { var p = HW.parse.number(String(resp[i] == null ? '' : resp[i]).trim()); if (!p.ok) return form('empty', 'Enter a number in each box.'); v.push(p.value); }
      if (v.every(function (x, i) { return near(x, vals[i]); })) return ok();
      if (o.diag) { var h = o.diag(v); if (h) return wrong(h.code, h.hint); }
      if (vals.length === 2 && near(v[0], vals[1]) && near(v[1], vals[0])) return wrong(o.swapCode || 'swap-answer', o.swapHint || 'Right numbers in the wrong boxes — check which value is which.');
      if (vals.length === 2 && (near(v[0], vals[0]) || near(v[1], vals[1]))) return wrong('one-value', 'One of your values is right. Substitute it back to find the other one again.');
      return wrong('value', null);
    };
    return { prompt: prompt, input: { type: 'fields', fields: labs }, check: chk, key: vals.map(String), answer: o.answer, solution: o.sol, hints: o.hints || [], text: o.text,
      bad: (vals.length === 2 && vals[0] !== vals[1] ? [[String(vals[1]), String(vals[0])]] : []).concat(o.bad || []) };
  }
  /* write a system: equation boxes; o.key: nice key texts */
  function sysPart(prompt, T, V, o) {
    var p = B.system(prompt, T, { vars: V, diag: o.diag ? function (resp) {
      var Ls = (resp || []).map(function (s) { var rr = LN.read(s, V); return rr.ok ? [rr.a, rr.b, rr.c] : null; });
      return o.diag(function (L) { return Ls.some(function (z) { return z && LN.same(z, L); }); });
    } : null }, o.sol, o.hints, o.text);
    p.key = o.key; p.answer = o.key.map(function (k) { return t(k); }).join('<br>');
    if (o.bad) p.bad = o.bad;
    return p;
  }

  /* ---------------- Q13: three unknowns ---------------- */
  function xyzPart(prompt, names, sol, eqOK, solution, hints, text) {
    var chk = function (resp) {
      resp = resp || []; var v = [];
      for (var i = 0; i < 3; i++) { var p = HW.parse.number(String(resp[i] == null ? '' : resp[i])); if (!p.ok) return form('empty', 'Enter a number in each box.'); v.push(p.value); }
      if (v[0] === sol[0] && v[1] === sol[1] && v[2] === sol[2]) return ok();
      var right = v.filter(function (x, i) { return x === sol[i]; }).length;
      if (right === 2) return wrong('xy-right-z', 'Two of your values are right. Substitute them back to find the third one again.');
      var bad = eqOK.map(function (f) { return f(v); }).indexOf(false);
      return wrong('z-wrong', 'Your values don’t satisfy equation ' + (bad + 1) + '. Substitute them into all three equations to find the slip.');
    };
    return { prompt: prompt, input: { type: 'fields', fields: names.map(function (n) { return { label: t(n + '=') }; }) }, check: chk, key: sol.map(String), answer: t(names.map(function (n, i) { return n + '=' + sol[i]; }).join(',\\ ')),
      solution: solution, hints: hints, text: text, bad: [[sol[0], sol[1], sol[2] + 1].map(String), [sol[1], sol[0], sol[2]].map(String)] };
  }

  function mkS(Es, V) { return { texs: Es.map(function (e) { return eqT(e, V); }), Es: Es, V: V }; }
  function decOnly(chk) {
    return function (resp) { var r = chk(resp); if (r.v === 'correct' && /\d\.\d/.test(String(resp))) return form('pt-fraction', 'Right values — but give <b>exact</b> values: write them as fractions, not decimals.'); return r; };
  }
  function chkLine(e, V, p) { var a = cB(e.a, qT(p[0]), true); return t(a + cB(e.b, qT(p[1]), !a) + '=' + qT(e.c)) + '&nbsp;✓'; }
  function lhsT(e, V) { return pol([[e.a, V[0]], [e.b, V[1]]]); }
  function yFirstT(e, V) { V = V || ['x', 'y']; return pol([[e.b, V[1]], [e.a, V[0]]]) + '=' + qT(e.c); }

  /* ---------------- elimination: add or subtract the equations as they stand ---------------- */
  function elimInfo(Es, e, ord) {   // e: the variable that disappears; ord 1: Eq. 2 − Eq. 1
    var f = 1 - e, A = Es[0], Bq = Es[1], sub = qv(co(A, e)) === qv(co(Bq, e));
    if (sub && ord === 1) { A = Es[1]; Bq = Es[0]; }
    return { sub: sub, A: A, B: Bq, f: f, e: e, ord: sub && ord === 1 ? 1 : 0, k: sub ? qs(co(A, f), co(Bq, f)) : qa(co(A, f), co(Bq, f)), R: sub ? qs(A.c, Bq.c) : qa(A.c, Bq.c) };
  }
  function opName(I) { return I.sub ? (I.ord === 1 ? 'Eq. 2 − Eq. 1' : 'Eq. 1 − Eq. 2') : 'Eq. 1 + Eq. 2'; }
  function combT(I, V) { return '(' + lhsT(I.A, V) + ')' + (I.sub ? '-' : '+') + '(' + lhsT(I.B, V) + ')=' + qT(I.A.c) + (I.sub ? '-' : '+') + qb(I.B.c); }
  function stepTex(I, V) { return term(I.k, V[I.f], true) + '=' + qT(I.R); }
  function whyOp(Es, e, V) {
    var a = co(Es[0], e), b = co(Es[1], e), sub = qv(a) === qv(b);
    return 'The ' + t(V[e]) + '-coefficients are ' + t(qT(a)) + ' and ' + t(qT(b)) + ' — ' + (sub ? '<b>the same</b> (same number, same sign), so <b>subtract</b>' : '<b>opposites</b> (same number, opposite signs), so <b>add</b>') + ' to make ' + t(V[e]) + ' disappear.';
  }
  function backStep(q, e, v, V) {   // q has the eliminated variable e; the other variable has value v
    var f = 1 - e, ce = co(q, e), rest = qs(q.c, qm(co(q, f), v)), u = qd(rest, ce);
    var subT = e === 0 ? term(ce, V[0], true) + cB(co(q, f), qT(v), false) : cB(co(q, f), qT(v), true) + term(ce, V[1], false);
    return { u: u, tex: t(subT + '=' + qT(q.c)) + ', so ' + t(term(ce, V[e], true) + '=' + qT(rest)) + (qv(ce) === 1 ? '' : ', so ' + t(V[e] + '=' + qT(u))) };
  }
  function elimSol(Es, e, o) {
    o = o || {}; var V = o.vars || ['x', 'y'], I = elimInfo(Es, e, o.ord), f = I.f, out = (o.pre || []).slice();
    out.push(whyOp(Es, e, V));
    if (qv(I.k) === 0) {
      var tr = qv(I.R) === 0;
      out.push('<b>' + opName(I) + ':</b> ' + t(combT(I, V)) + ', so ' + t('0=' + qT(I.R)) + ' — both variables are gone, and ' + t('0=' + qT(I.R)) + ' is ' + (tr ? '<b>always true</b>.' : '<b>never true</b>.'));
      out.push(tr ? 'So there are <b>infinitely many solutions</b>: the two equations describe the <b>same line</b>.' : 'So there is <b>no solution</b>: the lines are <b>parallel</b> and never meet.');
      return { html: out.join('<br>'), kind: tr ? 'inf' : 'none', I: I };
    }
    var v = qd(I.R, I.k);
    out.push('<b>' + opName(I) + ':</b> ' + t(combT(I, V)) + '<br>' + t(stepTex(I, V)) + (qv(I.k) === 1 ? '' : ', so ' + t(V[f] + '=' + qT(v))));
    var w = o.back != null ? o.back : (Math.abs(qv(co(Es[1], e))) < Math.abs(qv(co(Es[0], e))) ? 1 : 0), bs = backStep(Es[w], e, v, V);
    out.push('Substitute ' + t(V[f] + '=' + qT(v)) + ' into Eq. ' + (w + 1) + ': ' + bs.tex + '.');
    var sol = e === 0 ? [bs.u, v] : [v, bs.u];
    out.push('Check in both original equations: ' + Es.map(function (z) { return chkLine(z, V, sol); }).join('&nbsp;&nbsp; '));
    out.push('Solution: ' + t('(' + V[0] + ',\\ ' + V[1] + ')=' + ptT(sol)));
    return { html: out.join('<br>'), sol: sol, kind: null, I: I };
  }
  /* classic slips → the wrong pair they lead to */
  function elimSlips(Es, e, V) {
    var I = elimInfo(Es, e, 0), out = [], P = solve2(Es[0], Es[1]); if (!P || qv(I.k) === 0) return out;
    function push(vf, code, hint) {
      [0, 1].forEach(function (w) {
        var bs = backStep(Es[w], e, vf, V), pt = e === 0 ? [bs.u, vf] : [vf, bs.u];
        if ((qv(pt[0]) === qv(P[0]) && qv(pt[1]) === qv(P[1])) || (qv(pt[0]) === qv(P[1]) && qv(pt[1]) === qv(P[0]))) return;
        if (out.some(function (z) { return qv(z.is[0]) === qv(pt[0]) && qv(z.is[1]) === qv(pt[1]); })) return;
        out.push({ is: pt.map(function (q) { return Q(q); }), code: code, hint: hint });
      });
    }
    var R2 = I.sub ? qa(I.A.c, I.B.c) : qs(I.A.c, I.B.c);
    push(qd(R2, I.k), 'elim-rhs', I.sub ? 'When you subtract the equations, subtract the right sides too — sign and all: ' + t(qT(I.A.c) + '-' + qb(I.B.c) + '=' + qT(I.R)) + '.' : 'You added the left sides, so add the right sides too: ' + t(qT(I.A.c) + '+' + qb(I.B.c) + '=' + qT(I.R)) + '.');
    if (I.sub) { var k2 = qa(co(I.A, I.f), co(I.B, I.f)); if (qv(k2)) push(qd(I.R, k2), 'elim-sub-sign', 'Subtracting changes the sign of <b>every</b> term being subtracted: ' + t(term(co(I.A, I.f), V[I.f], true) + '-' + (qv(co(I.B, I.f)) < 0 ? '(' + term(co(I.B, I.f), V[I.f], true) + ')' : term(co(I.B, I.f), V[I.f], true)) + '=' + term(I.k, V[I.f], true)) + '. Write it as a bracketed difference.'); }
    return out;
  }
  var H_ELIM = ['Look for a variable whose coefficients are the <b>same</b> (subtract) or <b>opposite</b> (add). Combine the left sides <b>and</b> the right sides.', 'Find one variable, substitute it into an original equation for the other, then check the pair in <b>both</b> equations.'];
  /* solve part: S = { Es, texs, e (variable eliminated), V, ord } */
  function elimPart(prompt, S, o) {
    o = o || {}; var V = S.V || ['x', 'y'], res = elimSol(S.Es, S.e, { vars: V, ord: S.ord, pre: S.pre, back: S.back });
    var target = res.kind || res.sol, wr = res.kind ? [] : elimSlips(S.Es, S.e, V);
    var p = B.point(prompt + sysD(S.texs), target, { vars: V, system: S.Es.map(sysA), wrong: wr }, res.html, o.hints || H_ELIM, o.text || 'solve ' + S.texs.join(' ; '));
    if (!res.kind) {
      var s = res.sol;
      if (!isInt(s[0]) || !isInt(s[1])) p.check = decOnly(p.check);
      p.bad = wr.slice(0, 4).map(function (w) { return ptK(w.is); });
      if (qv(s[0]) !== qv(s[1])) p.bad.push(ptK([s[1], s[0]]));
      p.bad.push('\\text{no solution}');
      p.good = [V[0] + '=' + qT(s[0]) + ', ' + V[1] + '=' + qT(s[1])];
    } else p.bad = [res.kind === 'none' ? '\\text{infinitely many}' : '\\text{no solution}', '(0, 0)'];
    return p;
  }
  /* the one-variable equation the step produces: A x + B y = C, accepted as written or with both sides negated */
  function stepEq(T, wrongs, V) {
    function sc(s, w, k) { return near(s[0], k * w[0]) && near(s[1], k * w[1]) && near(s[2], k * w[2]); }
    function prop(s, w) { return near(s[0] * w[1], s[1] * w[0]) && near(s[0] * w[2], s[2] * w[0]) && near(s[1] * w[2], s[2] * w[1]); }
    wrongs = (wrongs || []).filter(function (w) { return !prop(w.is, T); });
    return function (resp) {
      if (!String(resp == null ? '' : resp).trim()) return form('empty', 'Type the equation first.');
      var r = LN.read(resp, V);
      if (!r.ok) return form('unreadable', r.why === 'vars' ? 'Use the letters ' + t(V[0]) + ' and ' + t(V[1]) + ' from the question.' : r.why === 'no-eq' ? 'Write an equation, with an equals sign.' : 'I can’t read that equation — check the signs and brackets.');
      var s = [r.a, r.b, -r.c];
      if (sc(s, T, 1) || sc(s, T, -1)) return ok();
      for (var i = 0; i < wrongs.length; i++) if (sc(s, wrongs[i].is, 1) || sc(s, wrongs[i].is, -1)) return wrong(wrongs[i].code, wrongs[i].hint);
      if (prop(s, T)) return form('eq-step', 'That is equivalent — but type the equation exactly as adding/subtracting gives it, before dividing.');
      if (!near(s[0], 0) && !near(s[1], 0)) return wrong('elim-not', 'Your equation still has <b>both</b> variables. Equal coefficients disappear when you <b>subtract</b>; opposite ones when you <b>add</b>.');
      return wrong('eq', null);
    };
  }
  function stepPart(prompt, S, o) {
    o = o || {}; var V = S.V || ['x', 'y'], I = elimInfo(S.Es, S.e, S.ord), f = I.f, T = f === 1 ? [0, qv(I.k), qv(I.R)] : [qv(I.k), 0, qv(I.R)];
    var R2 = I.sub ? qa(I.A.c, I.B.c) : qs(I.A.c, I.B.c), wr = [{ is: f === 1 ? [0, qv(I.k), qv(R2)] : [qv(I.k), 0, qv(R2)], code: 'elim-rhs', hint: I.sub ? 'Subtract the right sides too — sign and all: ' + t(qT(I.A.c) + '-' + qb(I.B.c) + '=' + qT(I.R)) + '.' : 'Add the right sides too: ' + t(qT(I.A.c) + '+' + qb(I.B.c) + '=' + qT(I.R)) + '.' }];
    if (I.sub) { var k2 = qv(qa(co(I.A, f), co(I.B, f))); wr.push({ is: f === 1 ? [0, k2, qv(I.R)] : [k2, 0, qv(I.R)], code: 'elim-sub-sign', hint: 'Subtracting changes the sign of <b>every</b> term being subtracted: ' + t(term(co(I.A, f), V[f], true) + '-' + (qv(co(I.B, f)) < 0 ? '(' + term(co(I.B, f), V[f], true) + ')' : term(co(I.B, f), V[f], true)) + '=' + term(I.k, V[f], true)) + '.' }); }
    var key = stepTex(I, V), sol = whyOp(S.Es, S.e, V) + '<br><b>' + opName(I) + ':</b> ' + t(combT(I, V)) + '<br>The ' + t(V[S.e]) + '-terms cancel, leaving ' + t(key) + (qv(I.k) ? ' (so ' + t(V[f] + '=' + qT(qd(I.R, I.k))) + ').' : '.');
    var p = B.math((o.prompt || '<b>Step 1.</b> ' + (I.sub ? 'Subtract' : 'Add') + ' the equations' + (I.sub ? ' (' + opName(I) + ')' : '') + '. Type the one-variable equation you get — don’t solve it yet.') + sysD(S.texs), stepEq(T, wr, V), key, sol,
      o.hints || ['Line up the columns: ' + t(V[0]) + '-terms, ' + t(V[1]) + '-terms, numbers. ' + (I.sub ? 'Subtract each column — the sign of every term being subtracted changes, the constant too.' : 'Add each column.')], o.text || 'elimination step', { keys: 'eq', vars: V, placeholder: 'e.g. 5y = 15' });
    p.bad = wr.filter(function (w) { return !(near(w.is[0], T[0]) && near(w.is[1], T[1]) && near(w.is[2], T[2])); }).map(function (w) { return pol([[w.is[0], V[0]], [w.is[1], V[1]]]) + '=' + dc(w.is[2]); });
    return p;
  }
  /* add or subtract? which variable? (multiple choice) */
  function decideMC(r, S, o) {
    o = o || {}; var V = ['x', 'y'], Es = S.Es, works = [];
    for (var v = 0; v < 2; v++) { var a = qv(co(Es[0], v)), b = qv(co(Es[1], v)); works.push(a === b ? 'sub' : a === -b ? 'add' : null); }
    var both = works[0] && works[1];
    var opts = [];
    ['sub', 'add'].forEach(function (op) { [0, 1].forEach(function (v) {
      var isR = !both && works[v] === op, a = co(Es[0], v), b = co(Es[1], v);
      opts.push({ html: '<b>' + (op === 'sub' ? 'Subtract' : 'Add') + '</b> — eliminates ' + t(V[v]), right: isR, code: op + V[v],
        why: isR ? null : both && works[v] === op ? 'That works — but look at the other variable as well.' : works[v] ? 'The ' + t(V[v]) + '-coefficients are ' + t(qT(a)) + ' and ' + t(qT(b)) + (works[v] === 'sub' ? ': the <b>same</b>, so adding doubles them — subtract instead.' : ': <b>opposites</b>, so subtracting doubles them — add instead.') : 'The ' + t(V[v]) + '-coefficients are ' + t(qT(a)) + ' and ' + t(qT(b)) + ' — not the same and not opposites, so ' + t(V[v]) + ' can’t be eliminated yet.' });
    }); });
    if (both) {
      var part = opts.filter(function (z) { return z.code === works[0] + 'x' || z.code === works[1] + 'y'; }), bad = opts.filter(function (z) { return z.code !== works[0] + 'x' && z.code !== works[1] + 'y'; });
      opts = part.concat([r.pick(bad), { html: 'Either: <b>' + (works[0] === 'add' ? 'add' : 'subtract') + '</b> to eliminate ' + t('x') + ', or <b>' + (works[1] === 'add' ? 'add' : 'subtract') + '</b> to eliminate ' + t('y') + '.', right: true, code: 'either' }]);
    }
    var e = both ? 0 : works[0] ? 0 : 1;
    var sol = (o.pre || '') + (both ? whyOp(Es, 0, V) + '<br>' + whyOp(Es, 1, V) + '<br>Both routes work.' : whyOp(Es, e, V) + ' The ' + t(V[1 - e]) + '-coefficients (' + t(qT(co(Es[0], 1 - e))) + ' and ' + t(qT(co(Es[1], 1 - e))) + ') don’t line up.');
    return mc(r, (o.prompt || 'Would you add or subtract the equations, and which variable is eliminated? (Don’t solve.)') + sysD(o.texs || S.texs), opts, sol,
      ['Look at each variable: are its two coefficients the <b>same</b> (subtract) or <b>opposites</b> (add)?'], o.text || 'add or subtract');
  }
  function vanishMC(r, kind, stmt, texs) {
    var none = kind === 'none';
    return mc(r, 'Eliminating removes both variables from this system and leaves ' + t(stmt) + '. What does that mean?' + (texs ? sysD(texs) : ''), [
      { html: none ? '<b>No solution</b>: the statement is false for every point, so the lines are parallel and never meet.' : '<b>Infinitely many solutions</b>: the statement is true for every point — the two equations describe the same line.', right: true },
      { html: none ? '<b>Infinitely many solutions</b>: the two equations are the same line.' : '<b>No solution</b>: the lines are parallel and never meet.', code: 'none-inf', why: none ? 'The same line would leave a <b>true</b> statement such as ' + t('0=0') + '. ' + t(stmt) + ' is false.' : 'Parallel lines leave a <b>false</b> statement such as ' + t('0=7') + '. ' + t(stmt) + ' is always true.' },
      { html: '<b>One solution</b>: ' + t('(0,\\ 0)') + '.', code: 'one', why: 'Both variables vanished — nothing is left to solve for. The number statement itself is the answer.' },
      { html: 'An arithmetic slip was made — elimination never removes both variables.', code: 'slip', why: 'When both variables vanish, the lines have the same slope. The true/false statement tells you which case it is.' }],
      (none ? t(stmt) + ' is <b>false</b>: no point satisfies both equations, so there is <b>no solution</b> — same slope, different intercepts: parallel lines.' : t(stmt) + ' is <b>true</b> for every ' + t('x') + ' and ' + t('y') + ': the equations are multiples of each other — the <b>same line</b> — so there are <b>infinitely many solutions</b>.'),
      ['True statement (like ' + t('0=0') + ') → same line. False statement (like ' + t('0=7') + ') → parallel lines.'], 'meaning of ' + stmt);
  }

  /* ---------------- generators ---------------- */
  /* o: { e (variable that lines up), op 'sub'|'add', mag [lo,hi] for e, magF [lo,hi] for the other, sgnE 1|-1|0 (0: random),
         posF: the other variable's coefficients positive when it is x, xr, yr, frac: 'e'|'f' (that variable's value is a fraction) } */
  function elimGen(r, o, book) {
    return gen(r, function (r) {
      var e = o.e != null ? o.e : r.int(0, 1), op = o.op || r.pick(['sub', 'add']), f = 1 - e, m = o.mag || [2, 9], mf = o.magF || [1, 9];
      var ce = r.int(m[0], m[1]) * (o.sgnE === -1 ? -1 : o.sgnE === 0 ? sgn(r) : 1);
      var f1 = r.int(mf[0], mf[1]), f2 = r.int(mf[0], mf[1]);
      if (!(f === 0 && o.posF !== false)) { f1 *= sgn(r); f2 *= sgn(r); }
      if (Math.abs(f1) === Math.abs(f2)) return null;
      var C = [[0, 0], [0, 0]]; C[0][e] = ce; C[1][e] = op === 'sub' ? ce : -ce; C[0][f] = f1; C[1][f] = f2;
      if (op === 'add' && o.sgnE == null && e === 0 && r.chance(0.3)) { C[0][0] = -ce; C[1][0] = ce; }
      var xr = o.xr || [-5, 9], yr = o.yr || [-5, 9], P = [Q(rnz(r, xr[0], xr[1])), Q(rnz(r, yr[0], yr[1]))];
      if (o.frac) {
        var tv = o.frac === 'e' ? e : f, g = gcd(C[0][tv], C[1][tv]), qq = [2, 3, 4].filter(function (q) { return g % q === 0; });
        if (!qq.length) return null; var q = r.pick(qq), p = rnz(r, -3 * q, 3 * q); if (p % q === 0) return null; P[tv] = Q(p, q);
      }
      var Es = [E(C[0][0], C[0][1], qa(qm(C[0][0], P[0]), qm(C[0][1], P[1]))), E(C[1][0], C[1][1], qa(qm(C[1][0], P[0]), qm(C[1][1], P[1])))];
      if (!Es.every(function (z) { return isInt(z.c) && qv(z.c) !== 0; }) || qv(Es[0].c) === qv(Es[1].c)) return null;
      if (o.test && !o.test(C, P, Es)) return null;
      var S = mkS(Es, o.V); S.e = e; S.P = P; return S;
    }, function () { var b = book, Es = [E(b[0], b[1], b[2]), E(b[3], b[4], b[5])], S = mkS(Es, o.V); S.e = o.e != null ? o.e : (qv(Es[0].a) === qv(Es[1].a) || qv(Es[0].a) === -qv(Es[1].a) ? 0 : 1); S.P = solve2(Es[0], Es[1]); return S; });
  }
  function decGen(r, e, op, book, o) {   // for "add or subtract?" — constants free
    o = o || {};
    return gen(r, function (r) {
      var f = 1 - e, ce = r.int(2, 9) * (o.neg ? -1 : 1), f1 = r.int(1, 9), f2 = r.int(1, 9);
      if (f === 1 || o.negF) { f1 *= sgn(r); f2 *= sgn(r); }
      if (Math.abs(f1) === Math.abs(f2)) return null;
      var C = [[0, 0], [0, 0]]; C[0][e] = op === 'add' && r.chance(0.4) ? -ce : ce; C[1][e] = op === 'sub' ? C[0][e] : -C[0][e]; C[0][f] = f1; C[1][f] = f2;
      var Es = [E(C[0][0], C[0][1], rnz(r, -12, 30)), E(C[1][0], C[1][1], rnz(r, -12, 30))];
      return solve2(Es[0], Es[1]) ? mkS(Es) : null;
    }, function () { return mkS([E(book[0], book[1], book[2]), E(book[3], book[4], book[5])]); });
  }
  function eWord(k) { return ['', '', 'Twice', 'Three times', 'Four times'][k]; }

  /* ======================================================================================================== */
  HW.defineLesson({
    id: 'u8l5', unit: 8, num: '5', title: 'Solving Systems by Elimination, Part 1: When Coefficients Already Match', outcome: 'RF9',
    blurb: 'When a variable has the same coefficient in both equations, subtract them; when the coefficients are opposites, add them.',
    questions: [
      { num: '1', section: 'Part A — Identify, then Eliminate by Subtraction', stem: 'State whether you would add or subtract to eliminate a variable, and name the variable eliminated. Do not solve.',
        shared: function (r) { return { a: decGen(r, 0, 'sub', [4, 3, 17, 4, -5, 1]), b: decGen(r, 0, 'add', [2, 7, 5, -2, 3, 15]), c: decGen(r, 1, 'sub', [5, 6, 28, 9, 6, 48]), d: decGen(r, 0, 'add', [-3, 4, 10, 3, 2, 8]) }; },
        parts: ['a', 'b', 'c', 'd'].map(function (L) { return { id: '1' + L, level: 'BEG', make: function (r, sh) { return decideMC(r, sh[L]); } }; }) },
      { num: '2', stem: 'Solve each system by subtracting the equations (the coefficients already match). Check your solution in both original equations.',
        shared: function (r) {
          var o = { op: 'sub', xr: [1, 6], yr: [-4, 6] };
          return { a: elimGen(r, Object.assign({ e: 0, mag: [2, 7] }, o), [2, 3, 17, 2, -1, 5]), b: elimGen(r, Object.assign({ e: 1, mag: [2, 7] }, o), [3, 4, 23, 1, 4, 13]),
            c: elimGen(r, Object.assign({ e: 0, mag: [2, 7] }, o), [6, 1, 16, 6, -5, 28]), d: elimGen(r, Object.assign({ e: 0, mag: [2, 7], sgnE: -1 }, o), [-3, 5, -17, -3, 2, -14]) };
        },
        parts: ['a', 'b', 'c', 'd'].reduce(function (acc, L) {
          acc.push({ id: '2' + L + 'i', sub: L + ' i', level: 'BEG', make: function (r, sh) { return stepPart(null, sh[L]); } });
          acc.push({ id: '2' + L + 'ii', sub: L + ' ii', level: 'BEG', make: function (r, sh) { return elimPart('Now solve the system and check. Give the solution as an ordered pair.', sh[L]); } });
          return acc;
        }, []) },
      { num: '3', stem: 'Solve each system by subtracting the equations. Check your solution.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 0, op: 'sub', xr: [1, 8], yr: [-4, 6] }, [7, 2, 50, 7, -3, 30])); } },
        { id: '3b', level: 'BEG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 1, op: 'sub', xr: [1, 9], yr: [-4, 6] }, [4, 5, 17, 9, 5, 57])); } },
        { id: '3c', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 0, op: 'sub', sgnE: -1, xr: [-4, 4], yr: [-4, 7] }, [-5, 4, 34, -5, -2, -2])); } },
        { id: '3d', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 1, op: 'sub', sgnE: -1, xr: [1, 9], yr: [-4, 6] }, [3, -4, 7, 8, -4, 52])); } }] },
      { num: '4', section: 'Part B — Eliminate by Addition', stem: 'Solve each system by adding the equations (the coefficients are opposites). Check your solution in both original equations.',
        shared: function (r) {
          var o = { op: 'add', xr: [-3, 6], yr: [-4, 5] };
          return { a: elimGen(r, Object.assign({ e: 0, mag: [2, 6], sgnE: 1 }, o), [3, 2, 19, -3, 4, -7]), b: elimGen(r, Object.assign({ e: 1, mag: [2, 7] }, o), [2, 5, 17, 4, -5, 19]),
            c: elimGen(r, Object.assign({ e: 0, mag: [2, 6], sgnE: 1 }, o), [4, 3, 0, -4, 7, -40]), d: elimGen(r, Object.assign({ e: 1, mag: [2, 7] }, o), [5, 6, 20, 3, -6, -36]) };
        },
        parts: ['a', 'b', 'c', 'd'].reduce(function (acc, L) {
          acc.push({ id: '4' + L + 'i', sub: L + ' i', level: 'BEG', make: function (r, sh) { return stepPart(null, sh[L]); } });
          acc.push({ id: '4' + L + 'ii', sub: L + ' ii', level: 'BEG', make: function (r, sh) { return elimPart('Now solve the system and check. Give the solution as an ordered pair.', sh[L]); } });
          return acc;
        }, []) },
      { num: '5', stem: 'Solve each system by adding the equations. Check your solution.', parts: [
        { id: '5a', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 0, op: 'add', sgnE: 1, xr: [-4, 8], yr: [-5, 5] }, [6, 5, 32, -6, 2, -46])); } },
        { id: '5b', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 1, op: 'add', xr: [-5, 5], yr: [-4, 8] }, [5, 3, 4, 2, -3, -32])); } },
        { id: '5c', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 0, op: 'add', sgnE: -1, xr: [-4, 8], yr: [-6, 5] }, [-7, 4, -62, 7, 9, -3])); } }] },
      { num: '6', section: 'Part C — Add or Subtract? You Decide', stem: 'Decide whether to add or subtract, then solve each system. Check your solution.', parts: ['a', 'b', 'c', 'd'].map(function (L, i) {
        var book = [[3, 4, 39, 8, 4, 64], [5, 2, 29, -5, 6, 27], [-2, 7, 40, -2, 3, 24], [4, 8, 12, 5, -8, 69]][i];
        return { id: '6' + L, level: 'EMG', make: function (r) { return elimPart('Decide whether to add or subtract, then solve. Give the solution as an ordered pair.', elimGen(r, { xr: [-6, 9], yr: [-5, 7], sgnE: 0 }, book)); } };
      }) },
      { num: '7', stem: 'Decide whether to add or subtract, then solve each system. Check your solution.', parts: ['a', 'b', 'c'].map(function (L, i) {
        var book = [[9, 2, -21, 9, -5, 21], [3, 7, 31, 6, -7, 41], [4, -6, 64, 7, -6, 94]][i];
        return { id: '7' + L, level: 'PRG', make: function (r) { return elimPart('Decide whether to add or subtract, then solve. Give the solution as an ordered pair.', elimGen(r, { xr: [-6, 10], yr: [-6, 6], sgnE: 0 }, book)); } };
      }) },
      /* ---------- Part D ---------- */
      { num: '8', section: 'Part D — Applications', stem: function (sh) { return 'The sum of ' + eWord(sh.k).toLowerCase() + ' a number ' + t('a') + ' and a number ' + t('b') + ' is ' + sh.s + '. ' + eWord(sh.k) + ' ' + t('a') + ' minus ' + t('b') + ' is ' + sh.d + '.'; },
        shared: function (r) { for (var g = 0; g < 200; g++) { var k = r.int(2, 3), a = r.int(3, 12), b = r.int(1, 12); if (k * a - b > 0 && b !== a) return { k: k, a: a, b: b, s: k * a + b, d: k * a - b }; } return { k: 2, a: 8, b: 7, s: 23, d: 9 }; },
        parts: [
          { id: '8a', level: 'EMG', make: function (r, sh) {
            return sysPart('Write a system of two equations describing this situation.', [{ A: sh.k, B: 1, C: -sh.s }, { A: sh.k, B: -1, C: -sh.d }], ['a', 'b'], { key: [sh.k + 'a+b=' + sh.s, sh.k + 'a-b=' + sh.d],
              diag: function (is) { if (is([-sh.k, 1, -sh.d])) return { code: 'diff-order', hint: '“' + eWord(sh.k) + ' a minus b” starts with ' + t(sh.k + 'a') + ' and takes away ' + t('b') + '.' }; if (is([1, sh.k, -sh.s]) || is([1, -sh.k, -sh.d])) return { code: 'coef-swap', hint: 'The ' + t(sh.k) + ' multiplies ' + t('a') + ', not ' + t('b') + '.' }; return null; },
              sol: '“The sum of ' + eWord(sh.k).toLowerCase() + ' a and b is ' + sh.s + '”: ' + t(sh.k + 'a+b=' + sh.s) + '.<br>“' + eWord(sh.k) + ' a minus b is ' + sh.d + '”: ' + t(sh.k + 'a-b=' + sh.d) + '.', hints: ['“' + eWord(sh.k) + ' a” is ' + t(sh.k + 'a') + '. “Sum” means add.'], text: 'number system' });
          } },
          { id: '8b', level: 'EMG', make: function (r, sh) {
            var res = elimSol([E(sh.k, 1, sh.s), E(sh.k, -1, sh.d)], 1, { vars: ['a', 'b'] });
            return numFields('Solve the system to find ' + t('a') + ' and ' + t('b') + '.', [{ label: t('a=') }, { label: t('b=') }], [sh.a, sh.b], { sol: res.html, answer: t('a=' + sh.a + ',\\ b=' + sh.b), hints: ['The ' + t('b') + '-coefficients are opposites: add the equations.'], text: 'a and b' });
          } }] },
      { num: '9', stem: function (sh) { return 'A boat’s downstream speed is ' + t('b+c') + ' and its upstream speed is ' + t('b-c') + ', where ' + t('b') + ' is its speed in still water and ' + t('c') + ' is the current’s speed. Downstream it travels ' + (sh.b + sh.c) + ' km/h; upstream, ' + (sh.b - sh.c) + ' km/h.'; },
        shared: function (r) { return { b: r.int(10, 30), c: r.int(2, 8) }; },
        parts: [
          { id: '9a', level: 'EMG', make: function (r, sh) {
            return sysPart('Write a system of two equations describing this situation.', [{ A: 1, B: 1, C: -(sh.b + sh.c) }, { A: 1, B: -1, C: -(sh.b - sh.c) }], ['b', 'c'], { key: ['b+c=' + (sh.b + sh.c), 'b-c=' + (sh.b - sh.c)],
              diag: function (is) { if (is([1, 1, -(sh.b - sh.c)])) return { code: 'boat-swap', hint: 'Downstream the current helps: ' + t('b+c') + ' is the <b>faster</b> speed, ' + (sh.b + sh.c) + ' km/h.' }; return null; },
              sol: 'Downstream: ' + t('b+c=' + (sh.b + sh.c)) + '. Upstream: ' + t('b-c=' + (sh.b - sh.c)) + '.', hints: ['Set each speed expression equal to the speed given for it.'], text: 'boat system', bad: [['b+c=' + (sh.b - sh.c), 'b-c=' + (sh.b + sh.c)]] });
          } },
          { id: '9b', level: 'EMG', make: function (r, sh) {
            var res = elimSol([E(1, 1, sh.b + sh.c), E(1, -1, sh.b - sh.c)], 1, { vars: ['b', 'c'] });
            return numFields('Solve the system to find ' + t('b') + ' and ' + t('c') + '.', [{ label: t('b='), after: 'km/h' }, { label: t('c='), after: 'km/h' }], [sh.b, sh.c], { swapHint: 'Right numbers in the wrong boxes: the boat is faster than the current.', sol: res.html + '<br>The boat goes <b>' + sh.b + ' km/h</b> in still water; the current is <b>' + sh.c + ' km/h</b>.', answer: t('b=' + sh.b) + ' km/h, ' + t('c=' + sh.c) + ' km/h', hints: ['The ' + t('c') + '-coefficients are opposites: add the equations to find ' + t('b') + '.'], text: 'boat and current' });
          } }] },
      /* ---------- Part E ---------- */
      { num: '10', section: 'Part E — Multiple Choice and Numerical Response', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var a, b, d, c1, c2;
          for (var g = 0; g < 200; g++) { a = r.int(2, 6); b = r.int(1, 6); d = r.int(1, 7); c1 = rnz(r, -10, 20); c2 = rnz(r, -10, 20); if (b !== d && c1 + c2 !== 0 && c1 - c2 !== c1 + c2 && (d - b) !== (b + d) && 2 * a !== b + d) break; }
          var E1 = E(a, b, c1), E2 = E(-a, d, c2);
          return mc(r, 'Adding ' + t(eqT(E1)) + ' and ' + t(eqT(E2)) + ' eliminates a variable and produces the equation', [
            { html: t(term(b + d, 'y', true) + '=' + (c1 + c2)), right: true },
            { html: t(term(2 * a, 'x', true) + '=' + (c1 + c2)), why: 'The ' + t('x') + '-terms are opposites: ' + t(a + 'x+(-' + a + 'x)=0') + '. It is ' + t('x') + ' that disappears.', code: 'elim-not' },
            { html: t(term(d - b, 'y', true) + '=' + (c1 + c2)), why: 'Adding, not subtracting: ' + t(b + 'y+' + d + 'y=' + (b + d) + 'y') + '.', code: 'elim-sub-sign' },
            { html: t(term(b + d, 'y', true) + '=' + (c1 - c2)), why: 'Add the right sides too: ' + t(c1 + '+' + nb(c2) + '=' + (c1 + c2)) + '.', code: 'elim-rhs' }],
            'The ' + t('x') + '-terms are opposites, so adding removes ' + t('x') + ': ' + t('(' + eqT(E1).split('=')[0] + ')+(' + eqT(E2).split('=')[0] + ')=' + c1 + '+' + nb(c2)) + ', so ' + t(term(b + d, 'y', true) + '=' + (c1 + c2)) + '.', ['Add column by column: ' + t('x') + '-terms, ' + t('y') + '-terms, and the right sides.'], 'MC add');
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var a, b, d, c1, c2;
          for (var g = 0; g < 200; g++) { a = r.int(2, 8); b = r.int(1, 5); d = r.int(1, 6); c1 = r.int(2, 20); c2 = r.int(c1 + 1, 45); if (d !== b && d - b !== 1 && b + d !== 2 * a) break; }
          var E1 = E(a, -b, c1), E2 = E(a, d, c2);
          return mc(r, 'Subtracting the first equation from the second in the system ' + t(eqT(E1)) + ', ' + t(eqT(E2)) + ' produces the equation', [
            { html: t(term(b + d, 'y', true) + '=' + (c2 - c1)), right: true },
            { html: t(term(d - b, 'y', true) + '=' + (c2 - c1)), why: 'Subtracting ' + t('-' + b + 'y') + ' changes its sign: ' + t(d + 'y-(-' + b + 'y)=' + (b + d) + 'y') + '.', code: 'elim-sub-sign' },
            { html: t(term(2 * a, 'x', true) + '=' + (c2 - c1)), why: 'The ' + t('x') + '-terms are equal, so subtracting makes them ' + t('0') + ': ' + t('x') + ' disappears.', code: 'elim-not' },
            { html: t(term(b + d, 'y', true) + '=' + (c1 + c2)), why: 'Subtract the right sides too: ' + t(c2 + '-' + c1 + '=' + (c2 - c1)) + '.', code: 'elim-rhs' }],
            'Second minus first: ' + t('(' + eqT(E2).split('=')[0] + ')-(' + eqT(E1).split('=')[0] + ')=' + c2 + '-' + c1) + '. The ' + t('x') + '-terms cancel and ' + t(d + 'y-(-' + b + 'y)=' + (b + d) + 'y') + ', so ' + t(term(b + d, 'y', true) + '=' + (c2 - c1)) + '.', ['Subtracting changes the sign of every term in the equation being subtracted.'], 'MC subtract');
        } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '12', level: 'EMG', make: function (r) {
          var a, b1, b2, x0, y0;
          for (var g = 0; g < 200; g++) { a = r.int(2, 6); b1 = r.int(2, 5); b2 = -r.int(1, 4); x0 = r.int(1, 9); y0 = r.int(1, 9); if (x0 !== y0) break; }
          var Es = [E(a, b1, a * x0 + b1 * y0), E(a, b2, a * x0 + b2 * y0)], res = elimSol(Es, 0, {});
          return B.nr('If ' + t(eqT(Es[0])) + ' and ' + t(eqT(Es[1])) + ', then the value of ' + t('x+y') + ' is ________.', x0 + y0, function (v) {
            if (v === x0 || v === y0) return { code: 'nr-partial', hint: 'That is one of the values. The question asks for ' + t('x+y') + '.' };
            return null;
          }, res.html + '<br>' + t('x+y=' + x0 + '+' + y0 + '=' + (x0 + y0)) + '.', ['The ' + t('x') + '-coefficients match: subtract to find ' + t('y') + ', then find ' + t('x') + '.'], 'NR x+y');
        } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '13', level: 'EMG', make: function (r) {
          var a, b1, b2, x0, y0;
          for (var g = 0; g < 200; g++) { a = r.int(2, 6); b1 = r.int(2, 6); b2 = r.int(1, 5); x0 = r.int(1, 9); y0 = rnz(r, -6, 4); if (b1 !== b2 && x0 - y0 > 0 && x0 + y0 !== x0 - y0) break; }
          var Es = [E(a, b1, a * x0 + b1 * y0), E(-a, b2, -a * x0 + b2 * y0)], res = elimSol(Es, 0, {});
          return B.nr('If ' + t(eqT(Es[0])) + ' and ' + t(eqT(Es[1])) + ', then the value of ' + t('x-y') + ' is ________.', x0 - y0, function (v) {
            if (v === x0 || v === Math.abs(y0)) return { code: 'nr-partial', hint: 'That is one of the values. The question asks for ' + t('x-y') + '.' };
            if (v === x0 + y0) return { code: 'nr-swap', hint: 'That’s ' + t('x+y') + '. Subtract: ' + t('x-y') + '.' };
            return null;
          }, res.html + '<br>' + t('x-y=' + x0 + '-' + nb(y0) + '=' + (x0 - y0)) + '.', ['The ' + t('x') + '-coefficients are opposites: add to find ' + t('y') + ', then find ' + t('x') + '.'], 'NR x-y');
        } }] },
      { num: '14', section: 'Part F — Extension and Mixed Review', stem: '<i>(Extension)</i> Consider the system of three equations below.', parts: [
        { id: '14', level: 'MAS', make: function (r) {
          var x, y, z; do { x = r.int(1, 9); y = r.int(1, 9); z = r.int(1, 12); } while (x === y || y === z || x === z);
          var p = x + y, q = y + z, s = x + z, T = (p + q + s) / 2;
          var sol = 'Add all three: ' + t('(x+y)+(y+z)+(x+z)=' + p + '+' + q + '+' + s) + ', so ' + t('2x+2y+2z=' + (p + q + s)) + ' and ' + t('x+y+z=' + T) + '.<br>Subtract each original equation from this: ' + t('z=' + T + '-' + p + '=' + z) + ', ' + t('x=' + T + '-' + q + '=' + x) + ', ' + t('y=' + T + '-' + s + '=' + y) + '.<br>Check: ' + t(x + '+' + y + '=' + p) + ', ' + t(y + '+' + z + '=' + q) + ', ' + t(x + '+' + z + '=' + s) + ' ✓';
          return xyzPart('Find ' + t('x') + ', ' + t('y') + ' and ' + t('z') + '.' + sysD(['x+y=' + p, 'y+z=' + q, 'x+z=' + s]) + '<i>Hint:</i> add all three equations, then divide by ' + t('2') + ' to find ' + t('x+y+z') + '; from there subtract each original equation.', ['x', 'y', 'z'], [x, y, z],
            [function (v) { return v[0] + v[1] === p; }, function (v) { return v[1] + v[2] === q; }, function (v) { return v[0] + v[2] === s; }], sol, ['Adding all three counts each variable twice: ' + t('2x+2y+2z=' + (p + q + s)) + '.', 'Then ' + t('x+y+z=' + T) + '. Subtract ' + t('x+y=' + p) + ' to get ' + t('z') + '.'], 'three unknowns');
        } }] },
      { num: '15', stem: '<i>(Mixed Review)</i> Solve each system, deciding whether to add or subtract.', parts: [
        { id: '15a', level: 'BEG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 1, op: 'sub', mag: [1, 1], magF: [2, 9], xr: [1, 6], yr: [-5, 9] }, [5, 1, 19, 8, 1, 25])); } },
        { id: '15b', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 0, op: 'add', sgnE: 1, mag: [2, 6], xr: [-6, 6], yr: [-4, 4] }, [2, 3, -7, -2, 7, 17])); } }] }
    ],
    extra: [
      { num: '1', section: 'Extra Practice A — Decide First: Add or Subtract?', stem: 'State whether you would add or subtract, and name the variable that is eliminated. Do not solve.',
        shared: function (r) {
          return { a: decGen(r, 0, 'sub', [7, 2, 19, 7, -5, -9]), b: decGen(r, 0, 'add', [4, 9, 1, -4, 3, 11]), c: decGen(r, 1, 'sub', [6, -5, 22, 11, -5, 42], { neg: true }),
            d: decGen(r, 0, 'sub', [-3, 8, -4, -3, -2, 16], { neg: true }), e: decGen(r, 1, 'add', [2, -7, 13, 9, 7, -2]), f: decGen(r, 0, 'add', [-5, -4, 3, 5, -9, 22], { negF: true }) };
        },
        parts: ['a', 'b', 'c', 'd', 'e', 'f'].map(function (L) { return { id: 'e1' + L, level: 'LIM', make: function (r, sh) { return decideMC(r, sh[L]); } }; }) },
      { num: '2', stem: 'These equations are not written in the same order, so nothing lines up yet. Rewrite with the x-terms, y-terms and constants in columns, then decide.',
        shared: function (r) {
          var a = gen(r, function (r) { var A = r.int(2, 7), Bc = r.int(2, 7), c1 = rnz(r, -9, 15), c2 = rnz(r, -9, 15); if (A === Bc || c1 === c2) return null; return { Es: [E(A, Bc, c1), E(-A, Bc, c2)], ro: 1 }; }, function () { return { Es: [E(3, 2, 7), E(-3, 2, 1)], ro: 1 }; });
          var b = gen(r, function (r) { var A = r.int(2, 7), A2 = r.int(2, 9), Bc = -r.int(2, 7), c1 = rnz(r, -9, 30), c2 = rnz(r, -9, 30); if (A === A2 || Math.abs(Bc) === A || Math.abs(Bc) === A2) return null; return { Es: [E(A, Bc, c1), E(A2, Bc, c2)], ro: 1 }; }, function () { return { Es: [E(4, -3, 18), E(7, -3, 27)], ro: 1 }; });
          var c = gen(r, function (r) { var A = r.int(2, 7), B1 = r.int(1, 6), B2 = -r.int(2, 7), c1 = rnz(r, -9, 20), c2 = rnz(r, -12, 20); if (B1 === -B2 || A === B1 || A === -B2) return null; return { Es: [E(A, B1, c1), E(A, B2, c2)], ro: 0 }; }, function () { return { Es: [E(5, 2, 16), E(5, -6, -8)], ro: 0 }; });
          [a, b, c].forEach(function (z) { z.texs = z.Es.map(function (e, i) { return i === z.ro ? yFirstT(e) : eqT(e); }); z.lined = z.Es.map(function (e) { return eqT(e); }); });
          return { a: a, b: b, c: c };
        },
        parts: ['a', 'b', 'c'].reduce(function (acc, L) {
          acc.push({ id: 'e2' + L + 'i', sub: L + ' i', level: 'BEG', make: function (r, sh) { return orderPart(sh[L]); } });
          acc.push({ id: 'e2' + L + 'ii', sub: L + ' ii', level: 'EMG', make: function (r, sh) { var z = sh[L]; return decideMC(r, { Es: z.Es, texs: z.lined }, { texs: z.texs, pre: 'Lined up: ' + t(z.lined[0]) + ' and ' + t(z.lined[1]) + '.<br>', prompt: 'With the columns lined up, would you add or subtract, and which variable is eliminated?' }); } });
          return acc;
        }, []) },
      { num: '3', stem: 'Carry out the correct operation and write only the resulting one-variable equation. Do not solve it. Remember that subtracting changes the sign of every term on that side, the constant included.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { return stepPart('Add or subtract the equations. Type only the one-variable equation you get.', elimGen(r, { e: 0, op: 'sub', mag: [2, 9], xr: [-5, 5], yr: [-5, 5] }, [9, 4, -5, 9, -6, -35]), { text: 'step (subtract)' }); } },
        { id: 'e3b', level: 'BEG', make: function (r) { return stepPart('Add or subtract the equations. Type only the one-variable equation you get.', elimGen(r, { e: 0, op: 'add', mag: [2, 9], sgnE: -1, xr: [-5, 5], yr: [-5, 6] }, [-8, 5, -12, 8, 3, 44]), { text: 'step (add)' }); } },
        { id: 'e3c', level: 'EMG', make: function (r) { return stepPart('Add or subtract the equations. Type only the one-variable equation you get.', elimGen(r, { e: 0, op: 'sub', mag: [2, 9], magF: [2, 11], xr: [-4, 5], yr: [-4, 5], test: function (C) { return C[0][1] < 0 && C[1][1] < 0; } }, [6, -11, -7, 6, -4, 14]), { text: 'step (subtract negatives)' }); } }] },
      { num: '4', section: 'Extra Practice B — Carrying Out the Elimination', stem: 'In every system below a variable’s coefficients match, so subtract. Watch the right-hand side. Solve, then back-substitute.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 0, op: 'sub', xr: [-5, 5], yr: [-5, 5], test: function (C) { return C[0][1] < 0 || C[1][1] < 0; } }, [5, -3, -19, 5, 7, 11])); } },
        { id: 'e4b', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 0, op: 'sub', sgnE: -1, xr: [-5, 5], yr: [-5, 5] }, [-4, 9, -21, -4, 2, -14])); } },
        { id: 'e4c', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 1, op: 'sub', sgnE: -1, posF: false, xr: [-5, 5], yr: [-5, 5] }, [2, -6, 22, -3, -6, 42])); } },
        { id: 'e4d', level: 'PRG', make: function (r) { return elimPart('Solve. Give exact values (fractions in lowest terms).', elimGen(r, { e: 0, op: 'sub', mag: [4, 9], frac: 'e', xr: [-4, 4], yr: [-5, 5] }, [8, 5, -11, 8, -3, 13]), { hints: ['Subtract to find ' + t('y') + '. Then the value of ' + t('x') + ' is a fraction — leave it exact.'] }); } }] },
      { num: '5', stem: 'In every system below a variable’s coefficients are opposites, so add. Some solutions are negative or fractional — leave fractions exact.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 0, op: 'add', sgnE: 1, xr: [-5, 5], yr: [-5, 5] }, [7, 6, 3, -7, 2, 29])); } },
        { id: 'e5b', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 0, op: 'add', sgnE: -1, xr: [-5, 6], yr: [-5, 5] }, [-9, 4, -53, 9, 11, 23])); } },
        { id: 'e5c', level: 'PRG', make: function (r) { return elimPart('Solve. Give exact values (fractions in lowest terms).', elimGen(r, { e: 1, op: 'add', mag: [2, 7], magF: [2, 9], frac: 'f', xr: [-4, 4], yr: [-8, 8] }, [6, -5, 39, 3, 5, -33])); } },
        { id: 'e5d', level: 'PRG', make: function (r) { return elimPart('Solve. Give exact values (fractions in lowest terms).', elimGen(r, { e: 1, op: 'add', mag: [4, 8], frac: 'e', xr: [-7, 7], yr: [-4, 4] }, [1, -8, -2, 2, 8, -16])); } }] },
      { num: '6', stem: 'Now you decide. For each system state the operation and the variable eliminated, then solve. Check your solution in both original equations.',
        shared: function (r) {
          return { a: elimGen(r, { e: 0, op: 'sub', xr: [-5, 8], yr: [-5, 5] }, [4, 1, 25, 4, -9, 55]), b: elimGen(r, { e: 1, op: 'add', posF: false, xr: [-5, 5], yr: [-5, 7] }, [5, -7, -47, -2, 7, 44]),
            c: elimGen(r, { e: 1, op: 'sub', sgnE: -1, posF: false, mag: [2, 6], magF: [2, 10], frac: 'f', xr: [-4, 4], yr: [-6, 6] }, [-6, -4, -29, 10, -4, -5]), d: elimGen(r, { e: 0, op: 'add', sgnE: -1, xr: [-5, 5], yr: [-9, 5] }, [-3, 2, -6, 3, -11, 87]) };
        },
        parts: ['a', 'b', 'c', 'd'].reduce(function (acc, L) {
          acc.push({ id: 'e6' + L + 'i', sub: L + ' i', level: 'BEG', make: function (r, sh) { return decideMC(r, sh[L]); } });
          acc.push({ id: 'e6' + L + 'ii', sub: L + ' ii', level: L === 'c' ? 'PRG' : 'EMG', make: function (r, sh) { return elimPart(L === 'c' ? 'Solve. Give exact values (fractions in lowest terms).' : 'Solve. Give the solution as an ordered pair.', sh[L]); } });
          return acc;
        }, []) },
      { num: '7', section: 'Extra Practice C — Special Cases, Errors, and Checking', stem: 'Eliminate as usual. One system collapses to a false statement, one collapses to a true statement, and one has exactly one solution.',
        shared: function (r) {
          var a1 = r.int(2, 6) * 2, b1 = -r.int(2, 7), c1 = rnz(r, -9, 12), c2; do { c2 = rnz(r, -9, 12); } while (c2 === c1);
          var A = { Es: [E(a1, b1, c1), E(a1, b1, c2)], e: 0 };
          var a2 = r.int(2, 7), b2 = r.int(2, 7), c3 = rnz(r, -12, 12);
          var Bs = { Es: [E(a2, b2, c3), E(-a2, -b2, -c3)], e: 0 };
          var Cs = elimGen(r, { e: 1, op: 'add', xr: [-5, 5], yr: [-4, 4] }, [4, 5, 7, 4, -5, 17]);
          [A, Bs].forEach(function (z) { z.texs = z.Es.map(function (e) { return eqT(e); }); });
          return { a: A, b: Bs, c: Cs };
        },
        parts: [
          { id: 'e7a', sub: 'a i', level: 'EMG', make: function (r, sh) { return elimPart('Eliminate. Use the <b>no solution</b> or <b>infinitely many</b> key if there isn’t exactly one solution.', sh.a); } },
          { id: 'e7ax', sub: 'a ii', level: 'EMG', make: function (r, sh) { return vanishMC(r, 'none', '0=' + qT(qs(sh.a.Es[0].c, sh.a.Es[1].c)), sh.a.texs); } },
          { id: 'e7b', sub: 'b i', level: 'EMG', make: function (r, sh) { return elimPart('Eliminate. Use the <b>no solution</b> or <b>infinitely many</b> key if there isn’t exactly one solution.', sh.b); } },
          { id: 'e7bx', sub: 'b ii', level: 'EMG', make: function (r, sh) { return vanishMC(r, 'inf', '0=0', sh.b.texs); } },
          { id: 'e7c', sub: 'c', level: 'EMG', make: function (r, sh) { return elimPart('Eliminate. Use the <b>no solution</b> or <b>infinitely many</b> key if there isn’t exactly one solution.', sh.c); } }] },
      { num: '8', stem: 'Error analysis. Each student chose correctly but executed badly.',
        shared: function (r) {
          var a = elimGen(r, { e: 0, op: 'sub', xr: [-5, 6], yr: [-8, 5], test: function (C, P, Es) { return C[0][1] > 0 && C[1][1] < 0 && C[0][1] !== -C[1][1]; } }, [5, 3, -1, 5, -8, 76]);
          var b = elimGen(r, { e: 0, op: 'sub', sgnE: -1, xr: [-4, 6], yr: [-5, 5], test: function (C) { return C[0][1] > 0 && C[1][1] > 0; } }, [-4, 9, 6, -4, 5, -2]);
          return { a: a, b: b };
        },
        parts: [
          { id: 'e8a', sub: 'a i', level: 'EMG', make: function (r, sh) {
            var S = sh.a, e1 = S.Es[0], e2 = S.Es[1], a = qv(e1.a), b1 = qv(e1.b), b2 = qv(e2.b), c1 = qv(e1.c), c2 = qv(e2.c), wy = b1 + b2;
            return mc(r, 'For ' + t(S.texs[0]) + ' and ' + t(S.texs[1]) + ', Dev subtracted and wrote ' + t(a + 'x-' + a + 'x' + term(b1, 'y', false) + term(b2, 'y', false) + '=' + c1 + '-' + nb(c2)) + ', so ' + t(term(wy, 'y', true) + '=' + (c1 - c2)) + '. What went wrong?', [
              { html: 'He changed the sign of ' + t(a + 'x') + ' but not of ' + t(term(b2, 'y', true)) + ': the ' + t('y') + '-column is ' + t(term(b1, 'y', true) + '-(' + term(b2, 'y', true) + ')=' + term(b1 - b2, 'y', true)) + '.', right: true },
              { html: 'He should have added, because the ' + t('y') + '-terms have opposite signs.', why: 'Subtracting was right: the ' + t('x') + '-coefficients match. The slip is in one sign.' },
              { html: 'The right side should be ' + t(c1 + '+' + nb(c2)) + '.', why: 'Subtracting the right sides, ' + t(c1 + '-' + nb(c2)) + ', was correct.' },
              { html: 'Nothing — his ' + t('y') + '-value is correct.', why: 'Check it: a fraction here won’t satisfy both equations.' }],
              'Subtracting the second equation changes the sign of <b>every</b> term in it: ' + t('-(' + lhsT(e2, ['x', 'y']) + ')=' + pol([[-a, 'x'], [-b2, 'y']])) + '. So the ' + t('y') + '-column is ' + t(term(b1, 'y', true) + '+' + Math.abs(b2) + 'y=' + term(b1 - b2, 'y', true)) + ', not ' + t(term(wy, 'y', true)) + '.', [], 'Dev’s error');
          } },
          { id: 'e8aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { return elimPart('Finish Dev’s question properly. Give the solution as an ordered pair.', sh.a); } },
          { id: 'e8b', sub: 'b i', level: 'EMG', make: function (r, sh) {
            var S = sh.b, e1 = S.Es[0], e2 = S.Es[1], a = qv(e1.a);
            return mc(r, 'For ' + t(S.texs[0]) + ' and ' + t(S.texs[1]) + ', Mei added and wrote ' + t(pol([[2 * a, 'x'], [qv(e1.b) + qv(e2.b), 'y']]) + '=' + (qv(e1.c) + qv(e2.c))) + ', then said she was stuck. What went wrong?', [
              { html: 'The ' + t('x') + '-coefficients are both ' + t(a) + ' — the <b>same</b> sign — so adding doubles them. She should subtract.', right: true },
              { html: 'She should have added the ' + t('y') + '-terms only.', why: 'Every column is combined the same way. The problem is the choice of operation.' },
              { html: 'Adding was right; she just made an arithmetic slip.', why: 'Her arithmetic is fine — but adding two equal coefficients never cancels them.' },
              { html: 'This system can’t be solved by elimination.', why: 'It can: the ' + t('x') + '-coefficients match, so subtracting removes ' + t('x') + '.' }],
              'The ' + t('x') + '-coefficients are ' + t(a) + ' and ' + t(a) + ': the same number with the <b>same</b> sign. Adding gives ' + t((2 * a) + 'x') + ' — nothing cancels. Subtracting gives ' + t(a + 'x-(' + a + 'x)=0') + ', so ' + t('x') + ' disappears.', [], 'Mei’s error');
          } },
          { id: 'e8bii', sub: 'b ii', level: 'EMG', make: function (r, sh) { return elimPart('Finish Mei’s question properly. Give the solution as an ordered pair.', sh.b); } }] },
      { num: '9', stem: 'Solve the system by elimination, then check: substitute your ordered pair into each original equation separately. A pair that satisfies only one equation is not a solution.', parts: [
        { id: 'e9', level: 'EMG', make: function (r) { return elimPart('Solve and check. Give the solution as an ordered pair.', elimGen(r, { e: 0, op: 'sub', xr: [-5, 5], yr: [-5, 5] }, [9, 4, -17, 9, -5, 1])); } }] },
      { num: '10', section: 'Extra Practice D — Working Backwards and Applications', stem: 'Each system below is missing a number. Use the information given to find it.', parts: [
        { id: 'e10a', level: 'ADV', make: function (r) {
          var a, k, b2, x0, y0;
          for (var g = 0; g < 200; g++) { a = r.int(2, 9); k = rnz(r, -9, 20); b2 = -r.int(2, 5); x0 = r.int(1, 5); y0 = rnz(r, -3, 3); if (Math.abs(k) !== Math.abs(b2) && k !== 1 && a * x0 + k * y0 !== 0) break; }
          var c1 = a * x0 + k * y0, c2 = a * x0 + b2 * y0;
          return B.number(t(ptT([x0, y0])) + ' solves ' + t(a + 'x+ky=' + c1) + ' and ' + t(eqT(E(a, b2, c2))) + '. Find ' + t('k') + '.', k, function (v) {
            if (v === -k) return { code: 'u8l5-back-sign', hint: 'Check the sign: ' + t('k(' + y0 + ')') + (y0 < 0 ? ' is ' + t('-' + Math.abs(y0) + 'k') + '.' : '.') };
            if (y0 !== 0 && near(v, (c1 - a * y0) / x0)) return { code: 'sub-swap', hint: t(x0) + ' is the ' + t('x') + '-value and ' + t(y0) + ' is the ' + t('y') + '-value.' };
            return null;
          }, 'Substitute ' + t('x=' + x0) + ' and ' + t('y=' + y0) + ' into ' + t(a + 'x+ky=' + c1) + ': ' + t(a + '(' + x0 + ')+k' + nb(y0) + '=' + c1) + ', so ' + t(a * x0 + term(y0, 'k', false) + '=' + c1) + ', ' + t(term(y0, 'k', true) + '=' + (c1 - a * x0)) + ' and ' + t('k=' + k) + '.<br>(The second equation checks: ' + t(a + '(' + x0 + ')' + (b2 < 0 ? '-' : '+') + Math.abs(b2) + nb(y0) + '=' + c2) + ' ✓)',
            ['Substitute the ordered pair into the equation that contains ' + t('k') + '.'], 'find k', { before: t('k=') });
        } },
        { id: 'e10b', level: 'EMG', make: function (r) {
          var a = r.int(2, 9), b1 = r.int(1, 6), b2 = -r.int(2, 6), x0 = r.int(1, 4), y0 = rnz(r, -4, 3), c = -a * x0 + b1 * y0, c2 = -a * x0 + b2 * y0;
          return B.number(t(ptT([x0, y0])) + ' solves ' + t(pol([[-a, 'x'], [b1, 'y']]) + '=c') + ' and ' + t(eqT(E(-a, b2, c2))) + '. Find ' + t('c') + '.', c, function (v) { if (v === a * x0 + b1 * y0) return { code: 'u8l5-back-sign', hint: 'Keep the minus sign on ' + t('-' + a + 'x') + ': ' + t('-' + a + '(' + x0 + ')=' + (-a * x0)) + '.' }; return null; },
            t('c=-' + a + '(' + x0 + ')' + (b1 === 1 ? '+' : '+' + b1) + nb(y0) + '=' + (-a * x0) + (b1 * y0 < 0 ? '' : '+') + (b1 * y0) + '=' + c) + '.', ['Substitute ' + t('x=' + x0) + ' and ' + t('y=' + y0) + ' into the left side.'], 'find c', { before: t('c=') });
        } },
        { id: 'e10c', level: 'MAS', make: function (r) {
          var m, p, b, x0, y0;
          for (var g = 0; g < 200; g++) { m = r.int(1, 7); p = r.int(1, 5); b = r.int(2, 6); x0 = r.int(1, 5); y0 = rnz(r, -4, 5); if (m !== p && m * x0 + b * y0 !== 0 && p * x0 - b * y0 !== 0) break; }
          var c1 = m * x0 + b * y0, c2 = p * x0 - b * y0;
          return numFields('Adding ' + t('mx+' + b + 'y=' + c1) + ' and ' + t(eqT(E(p, -b, c2))) + ' eliminates ' + t('y') + ' and gives ' + t('x=' + x0) + '. Find ' + t('m') + ', then find ' + t('y') + '.', [{ label: t('m=') }, { label: t('y=') }], [m, y0], {
            diag: function (v) { if (near(v[0], (c1 + c2) / x0)) return { code: 'value', hint: t((c1 + c2) / x0) + ' is the whole coefficient ' + t('m+' + p) + '. Subtract ' + t(p) + ' to get ' + t('m') + '.' }; return null; },
            sol: 'Adding: ' + t('(m+' + p + ')x=' + c1 + '+' + nb(c2) + '=' + (c1 + c2)) + '. With ' + t('x=' + x0) + ': ' + t('(m+' + p + ')(' + x0 + ')=' + (c1 + c2)) + ', so ' + t('m+' + p + '=' + (m + p)) + ' and ' + t('m=' + m) + '.<br>Then ' + t(p + '(' + x0 + ')-' + b + 'y=' + c2) + ', ' + t('-' + b + 'y=' + (c2 - p * x0)) + ', so ' + t('y=' + y0) + '.',
            answer: t('m=' + m + ',\\ y=' + y0), hints: ['Adding gives ' + t('(m+' + p + ')x=' + (c1 + c2)) + '. Put in ' + t('x=' + x0) + '.', 'Then substitute ' + t('x=' + x0) + ' into the second equation to find ' + t('y') + '.'], text: 'find m and y' });
        } }] },
      { num: '11', stem: function (sh) { return 'A drama club sells adult tickets at ' + t('a') + ' dollars each and student tickets at ' + t('s') + ' dollars each. One family bought ' + sh.A + ' adult and ' + sh.s1 + ' student tickets for $' + sh.T1 + '. Another bought ' + sh.A + ' adult and ' + sh.s2 + ' student tickets for $' + sh.T2 + '.'; },
        shared: function (r) { for (var g = 0; g < 200; g++) { var A = r.int(2, 5), s1 = r.int(2, 7), s2 = r.int(1, 6), a = r.int(6, 15), s = r.int(3, a - 1); if (s1 !== s2 && s1 !== A && s2 !== A) return { A: A, s1: s1, s2: s2, a: a, s: s, T1: A * a + s1 * s, T2: A * a + s2 * s }; } return { A: 3, s1: 5, s2: 2, a: 8, s: 5, T1: 49, T2: 34 }; },
        parts: [
          { id: 'e11a', level: 'EMG', make: function (r, sh) {
            return sysPart('Write a system of two equations for this situation.', [{ A: sh.A, B: sh.s1, C: -sh.T1 }, { A: sh.A, B: sh.s2, C: -sh.T2 }], ['a', 's'], { key: [sh.A + 'a+' + sh.s1 + 's=' + sh.T1, sh.A + 'a+' + (sh.s2 === 1 ? '' : sh.s2) + 's=' + sh.T2],
              diag: function (is) { if (is([sh.s1, sh.A, -sh.T1]) || is([sh.s2, sh.A, -sh.T2])) return { code: 'u8-count-swap', hint: t('a') + ' is the adult price, so it goes with the number of adult tickets.' }; return null; },
              sol: 'First family: ' + t(sh.A + 'a+' + sh.s1 + 's=' + sh.T1) + '. Second family: ' + t(sh.A + 'a+' + (sh.s2 === 1 ? '' : sh.s2) + 's=' + sh.T2) + '.', hints: ['Number of tickets × price, for both kinds, adds up to what the family paid.'], text: 'ticket system' });
          } },
          { id: 'e11b', sub: 'b i', level: 'EMG', make: function (r, sh) {
            return mc(r, 'Why is subtracting the natural first move for ' + t(sh.A + 'a+' + sh.s1 + 's=' + sh.T1) + ' and ' + t(sh.A + 'a+' + (sh.s2 === 1 ? '' : sh.s2) + 's=' + sh.T2) + '?', [
              { html: 'Both families bought ' + sh.A + ' adult tickets: the ' + t('a') + '-coefficients are the same, so subtracting removes ' + t('a') + ' at once.', right: true },
              { html: 'The ' + t('s') + '-coefficients are opposites, so subtracting removes ' + t('s') + '.', why: t(sh.s1) + ' and ' + t(sh.s2) + ' are not opposites. Look at the adult tickets.' },
              { html: 'Subtracting always works; adding never does.', why: 'Adding works when the coefficients are opposites. Here they are the same.' },
              { html: 'The second total is smaller, so it must be subtracted.', why: 'The totals don’t decide it — the matching coefficients do.' }],
              'Both purchases include ' + sh.A + ' adult tickets, so the ' + t('a') + '-coefficients are both ' + t(sh.A) + ' — same number, same sign. Subtracting removes ' + t('a') + ', and the difference in totals is the cost of the extra student tickets.', [], 'why subtract');
          } },
          { id: 'e11c', sub: 'b ii', level: 'EMG', make: function (r, sh) {
            var res = elimSol([E(sh.A, sh.s1, sh.T1), E(sh.A, sh.s2, sh.T2)], 0, { vars: ['a', 's'], ord: sh.s1 < sh.s2 ? 1 : 0, back: 1 });
            return numFields('Find ' + t('a') + ' and ' + t('s') + '.', [{ label: 'adult ' + t('a=') + ' $' }, { label: 'student ' + t('s=') + ' $' }], [sh.a, sh.s], { swapCode: 'u8-price-swap', swapHint: 'Right numbers, wrong tickets: ' + t('a') + ' is the adult price.', sol: res.html + '<br>Adult <b>$' + sh.a + '</b>, student <b>$' + sh.s + '</b>.', answer: 'adult $' + sh.a + ', student $' + sh.s, hints: ['Subtract the equations to find ' + t('s') + ' first.'], text: 'ticket prices' });
          } }] },
      { num: '12', stem: function (sh) { return 'At a canteen, ' + sh.M + ' muffins and ' + sh.j1 + ' juices cost $' + sh.T1 + ', while ' + sh.M + ' muffins and ' + sh.j2 + ' juices cost $' + sh.T2 + '.'; },
        shared: function (r) { for (var g = 0; g < 200; g++) { var M = r.int(2, 6), j1 = r.int(1, 8), j2 = r.int(1, 8), m = r.int(1, 5), j = r.int(1, 5); if (j1 !== j2 && j1 !== M && j2 !== M && m !== j) return { M: M, j1: j1, j2: j2, m: m, j: j, T1: M * m + j1 * j, T2: M * m + j2 * j }; } return { M: 4, j1: 3, j2: 7, m: 2, j: 3, T1: 17, T2: 29 }; },
        parts: [
          { id: 'e12a', level: 'EMG', make: function (r, sh) { return sysPart('Write a system using ' + t('m') + ' (price of a muffin) and ' + t('j') + ' (price of a juice).', [{ A: sh.M, B: sh.j1, C: -sh.T1 }, { A: sh.M, B: sh.j2, C: -sh.T2 }], ['m', 'j'], { key: [pol([[sh.M, 'm'], [sh.j1, 'j']]) + '=' + sh.T1, pol([[sh.M, 'm'], [sh.j2, 'j']]) + '=' + sh.T2], diag: function (is) { if (is([sh.j1, sh.M, -sh.T1]) || is([sh.j2, sh.M, -sh.T2])) return { code: 'coef-swap', hint: 'The number of muffins multiplies ' + t('m') + '.' }; return null; }, sol: t(pol([[sh.M, 'm'], [sh.j1, 'j']]) + '=' + sh.T1) + ' and ' + t(pol([[sh.M, 'm'], [sh.j2, 'j']]) + '=' + sh.T2) + '.', hints: ['Count × price for each item, added, equals the total.'], text: 'canteen system' }); } },
          { id: 'e12b', level: 'EMG', make: function (r, sh) {
            var res = elimSol([E(sh.M, sh.j1, sh.T1), E(sh.M, sh.j2, sh.T2)], 0, { vars: ['m', 'j'], ord: sh.j1 < sh.j2 ? 1 : 0 });
            return numFields('Solve it by elimination and state the price of each item.', [{ label: 'muffin $' }, { label: 'juice $' }], [sh.m, sh.j], { sol: res.html + '<br>Muffins <b>$' + sh.m + '</b>, juice <b>$' + sh.j + '</b>.', answer: 'muffin $' + sh.m + ', juice $' + sh.j, hints: ['The ' + t('m') + '-coefficients match: subtract.'], text: 'canteen prices' });
          } }] },
      { num: '13', stem: function (sh) { return 'For a rectangle, twice the length plus twice the width is ' + (2 * sh.l + 2 * sh.w) + ' cm, and twice the length minus twice the width is ' + (2 * sh.l - 2 * sh.w) + ' cm.'; },
        shared: function (r) { var w = r.int(3, 15), l = r.int(w + 1, w + 12); return { l: l, w: w }; },
        parts: [
          { id: 'e13a', level: 'EMG', make: function (r, sh) { var P = 2 * sh.l + 2 * sh.w, D = 2 * sh.l - 2 * sh.w; return sysPart('Write a system using ' + t('l') + ' and ' + t('w') + '.', [{ A: 2, B: 2, C: -P }, { A: 2, B: -2, C: -D }], ['l', 'w'], { key: ['2l+2w=' + P, '2l-2w=' + D], diag: function (is) { if (is([1, 1, -P]) || is([1, -1, -D])) return { code: 'perim-half', hint: '“Twice the length” is ' + t('2l') + '.' }; return null; }, sol: t('2l+2w=' + P) + ' and ' + t('2l-2w=' + D) + '.', hints: ['“Twice the length” is ' + t('2l') + '.'], text: 'rectangle system' }); } },
          { id: 'e13b', level: 'EMG', make: function (r, sh) {
            var P = 2 * sh.l + 2 * sh.w, D = 2 * sh.l - 2 * sh.w;
            return numFields('Add to find ' + t('l') + '; subtract to find ' + t('w') + '.', [{ label: t('l='), after: 'cm' }, { label: t('w='), after: 'cm' }], [sh.l, sh.w], { sol: 'Adding: ' + t('4l=' + (P + D)) + ', so ' + t('l=' + sh.l) + '.<br>Subtracting: ' + t('(2l+2w)-(2l-2w)=' + P + '-' + D) + ', so ' + t('4w=' + (P - D)) + ' and ' + t('w=' + sh.w) + '.<br>Check: ' + t(2 * sh.l + '+' + 2 * sh.w + '=' + P) + ' ✓ and ' + t(2 * sh.l + '-' + 2 * sh.w + '=' + D) + ' ✓', answer: t('l=' + sh.l) + ' cm, ' + t('w=' + sh.w) + ' cm', hints: ['Adding cancels the ' + t('w') + '-terms; subtracting cancels the ' + t('l') + '-terms.'], text: 'rectangle' });
          } }] },
      { num: '14', section: 'Extra Practice E — Stretch and Reasoning', stem: 'Elimination gives you one variable immediately. Sometimes that is the only one you need.',
        shared: function (r) {
          var a = gen(r, function (r) { var A = r.pick([7, 9, 11, 13]), b1 = r.int(3, 8), b2 = -r.int(1, 4), y0 = r.int(1, 5), N = r.int(5, 30); if (N % A === 0) return null; return { A: A, b1: b1, b2: b2, y0: y0, N: N, Es: [E(A, b1, N + b1 * y0), E(A, b2, N + b2 * y0)] }; }, function () { return { A: 11, b1: 6, b2: -2, y0: 4, N: 16, Es: [E(11, 6, 40), E(11, -2, 8)] }; });
          a.texs = a.Es.map(function (e) { return eqT(e); }); a.e = 0;
          var b = gen(r, function (r) { var A = r.int(5, 9), Bc = r.int(2, 6), x0 = r.int(1, 5), y0 = r.int(1, 5); if (A % Bc === 0 || Bc % A === 0) return null; var Es = [E(A, Bc, A * x0 + Bc * y0), E(A, -Bc, A * x0 - Bc * y0)]; if (!qv(Es[1].c)) return null; var S = mkS(Es); S.e = 1; return S; }, function () { var S = mkS([E(9, 4, 31), E(9, -4, 23)]); S.e = 1; return S; });
          return { a: a, b: b };
        },
        parts: [
          { id: 'e14a', sub: 'a i', level: 'PRG', make: function (r, sh) {
            var S = sh.a, I = elimInfo(S.Es, 0, 0);
            return B.number('If ' + t(S.texs[0]) + ' and ' + t(S.texs[1]) + ', find the value of ' + t('y') + ' <b>without</b> finding ' + t('x') + '.', S.y0, function (v) { if (near(v, qv(qd(qa(S.Es[0].c, S.Es[1].c), I.k)))) return { code: 'elim-rhs', hint: 'Subtract the right sides too: ' + t(qT(S.Es[0].c) + '-' + qb(S.Es[1].c)) + '.' }; return null; },
              'The ' + t('x') + '-coefficients match, so subtract: ' + t(combT(I, ['x', 'y'])) + ', so ' + t(stepTex(I, ['x', 'y'])) + ' and ' + t('y=' + S.y0) + '. One step — ' + t('x') + ' was never needed.', ['The ' + t('x') + '-coefficients are the same: subtract.'], 'y only', { before: t('y=') });
          } },
          { id: 'e14aii', sub: 'a ii', level: 'PRG', make: function (r, sh) {
            var S = sh.a, xv = Q(S.N, S.A);
            return B.fraction('For ' + t(S.texs[0]) + ' and ' + t(S.texs[1]) + ', now find ' + t('x') + ' as well (exact value), using ' + t('y=' + S.y0) + '.', xv, { before: t('x=') },
              'Substitute ' + t('y=' + S.y0) + ' into ' + t(S.texs[0]) + ': ' + t(S.A + 'x+' + S.b1 + '(' + S.y0 + ')=' + qT(S.Es[0].c)) + ', so ' + t(S.A + 'x=' + S.N) + ' and ' + t('x=' + qT(xv)) + '.', ['Substitute ' + t('y=' + S.y0) + ' into either equation and solve for ' + t('x') + '.'], 'x as a fraction');
          } },
          { id: 'e14aiii', sub: 'a iii', level: 'EMG', make: function (r, sh) {
            var S = sh.a;
            return mc(r, 'For ' + t(S.texs[0]) + ' and ' + t(S.texs[1]) + ': why did answering only the question asked (the value of ' + t('y') + ') save you the ugly part?', [
              { html: 'One subtraction gave ' + t('y') + ' directly as a whole number; the fraction only appears when you go on to find ' + t('x') + '.', right: true },
              { html: 'Because ' + t('y') + ' is always easier to find than ' + t('x') + '.', why: 'It depends on the system: here the ' + t('x') + '-coefficients matched, so ' + t('y') + ' came first.' },
              { html: 'Because ' + t('x') + ' has no value in this system.', why: t('x') + ' has a value — ' + t(qT(Q(S.N, S.A))) + ' — it is just a fraction.' },
              { html: 'Because elimination never produces fractions.', why: 'It can: finding ' + t('x') + ' here gives a fraction.' }],
              'Subtracting removed ' + t('x') + ' and gave ' + t('y=' + S.y0) + ' in one step. Finding ' + t('x') + ' means dividing by ' + t(S.A) + ', which gives the fraction ' + t(qT(Q(S.N, S.A))) + '. If only ' + t('y') + ' is asked for, you never have to do that.', [], 'why only y');
          } },
          { id: 'e14b', sub: 'b i', level: 'EMG', make: function (r, sh) { return elimPart('Solve by elimination. Give the solution as an ordered pair.', sh.b); } },
          { id: 'e14bii', sub: 'b ii', level: 'EMG', make: function (r, sh) {
            var S = sh.b, a = qv(S.Es[0].a), b = qv(S.Es[0].b), c = qv(S.Es[0].c);
            return mc(r, 'Why would substitution have been the slower route for ' + t(S.texs[0]) + ', ' + t(S.texs[1]) + '?', [
              { html: 'No coefficient is ' + t('1') + ' or ' + t('-1') + ', so isolating a variable (e.g. ' + t('y=\\frac{' + c + '-' + a + 'x}{' + b + '}') + ') drags a fraction through every step; adding cleared ' + t('y') + ' in one line.', right: true },
              { html: 'Substitution doesn’t work when both equations have the same ' + t('x') + '-coefficient.', why: 'Substitution always works — it is just slower here because of fractions.' },
              { html: 'Substitution would give a different answer.', why: 'Both methods give the same solution; the difference is the amount of work.' },
              { html: 'Because the constants are odd numbers.', why: 'The constants don’t matter. What matters is that no coefficient is ' + t('\\pm1') + '.' }],
              'To substitute you would isolate a variable — but every coefficient is bigger than ' + t('1') + ', so you would get a fraction like ' + t('y=\\frac{' + c + '-' + a + 'x}{' + b + '}') + ' and carry it through every step. The ' + t('y') + '-coefficients are already opposites, so one addition removes ' + t('y') + '.', [], 'why not substitution');
          } }] },
      { num: '15', stem: function (sh) { return 'In the system ' + t(sh.texs[0]) + ', ' + t(sh.texs[1]) + ' the ' + t('x') + '-coefficients are opposites <b>and</b> the ' + t('y') + '-coefficients match, so both operations eliminate something.'; },
        shared: function (r) {
          return gen(r, function (r) { var a = r.int(2, 6), b = r.int(2, 9), x0 = rnz(r, -5, 6), y0 = rnz(r, -4, 4); if (a === b) return null; var Es = [E(a, b, a * x0 + b * y0), E(-a, b, -a * x0 + b * y0)]; if (!qv(Es[0].c) || !qv(Es[1].c)) return null; return { Es: Es, texs: Es.map(function (e) { return eqT(e); }), x0: x0, y0: y0 }; },
            function () { var Es = [E(3, 7, 1), E(-3, 7, -29)]; return { Es: Es, texs: ['3x+7y=1', '-3x+7y=-29'], x0: 5, y0: -2 }; });
        },
        parts: [
          { id: 'e15a', sub: 'a', level: 'EMG', make: function (r, sh) { var S = { Es: sh.Es, texs: sh.texs, e: 0 }; return stepPart('<b>(a)</b> Add the equations. Type the one-variable equation you get.', S, { text: 'add route' }); } },
          { id: 'e15b', sub: 'b', level: 'EMG', make: function (r, sh) { var S = { Es: sh.Es, texs: sh.texs, e: 1 }; return stepPart('<b>(b)</b> Subtract the equations instead (Eq. 1 − Eq. 2). Type the one-variable equation you get.', S, { text: 'subtract route' }); } },
          { id: 'e15c', sub: 'a–b', level: 'EMG', make: function (r, sh) { var S = { Es: sh.Es, texs: sh.texs, e: 0 }; var p = elimPart('Finish solving (either route). Give the solution as an ordered pair.', S); var r2 = elimSol(sh.Es, 1, {}); p.solution += '<br><br>The other route (subtract):<br>' + r2.html; return p; } },
          { id: 'e15d', sub: 'c', level: 'PRG', make: function (r, sh) {
            return mc(r, 'Both routes give the same pair. What has to be true of a system for <b>both</b> operations to work?', [
              { html: 'One variable’s coefficients must match <b>and</b> the other variable’s coefficients must be opposites.', right: true },
              { html: 'Both variables’ coefficients must match.', why: 'Then subtracting removes both variables at once — the lines are parallel or the same.' },
              { html: 'All four coefficients must be different.', why: 'Then neither operation removes a variable without scaling first.' },
              { html: 'The two constants must be opposites.', why: 'The constants don’t decide which variable cancels.' }],
              'Adding removes ' + t('x') + ' because the ' + t('x') + '-coefficients are opposites; subtracting removes ' + t('y') + ' because the ' + t('y') + '-coefficients match. Both work only when one variable matches and the other is opposite.', [], 'when both work');
          } }] },
      { num: '16', stem: function (sh) { return 'Consider the system ' + t(pol([[-sh.a, 'x'], [sh.b, 'y']]) + '=d') + ' and ' + t(pol([[-sh.a, 'x'], [sh.b, 'y']]) + '=' + sh.D) + ', where ' + t('d') + ' is a constant.'; },
        shared: function (r) { var a = r.int(2, 9), b = r.int(2, 9); while (b === a) b = r.int(2, 9); return { a: a, b: b, D: rnz(r, -20, 20) }; },
        parts: [
          { id: 'e16a', level: 'EMG', make: function (r, sh) { return B.number('For which value of ' + t('d') + ' does the system have infinitely many solutions?', sh.D, null, 'With ' + t('d=' + sh.D) + ' the two equations are identical; subtracting gives ' + t('0=0') + ', so every point on the line ' + t(pol([[-sh.a, 'x'], [sh.b, 'y']]) + '=' + sh.D) + ' is a solution.', ['Infinitely many solutions: the two equations must be the <b>same line</b>.'], 'd for infinitely many', { before: t('d=') }); } },
          { id: 'e16b', level: 'EMG', make: function (r, sh) {
            return mc(r, 'What happens for every other value of ' + t('d') + ', and what do the graphs look like?', [
              { html: 'Subtracting gives ' + t('0=d-' + nb(sh.D)) + ', which is false: <b>no solution</b>. The graphs are two distinct parallel lines.', right: true },
              { html: 'There is exactly one solution, where the lines cross.', why: 'The left sides are identical, so the lines have the same slope — they can’t cross once.' },
              { html: 'There are still infinitely many solutions.', why: 'With different right sides the equations can’t both be true at the same point.' },
              { html: 'No solution, and the lines are perpendicular.', why: 'Same left side means same slope: the lines are parallel, not perpendicular.' }],
              'For ' + t('d\\neq ' + sh.D) + ', subtracting gives ' + t('0=d-' + nb(sh.D)) + ' — false. No point satisfies both, so there is <b>no solution</b>: the lines have the same slope ' + t(qT(Q(sh.a, sh.b))) + ' but different intercepts (parallel).', [], 'other d');
          } },
          { id: 'e16c', level: 'PRG', make: function (r, sh) {
            return mc(r, 'Can this system ever have exactly one solution?', [
              { html: 'No. The left sides are identical, so the lines always have the same slope — they are either the same line or parallel, never crossing once.', right: true },
              { html: 'Yes, for one special value of ' + t('d') + '.', why: 'Changing ' + t('d') + ' only moves the line up or down; it never changes the slope.' },
              { html: 'Yes, when ' + t('d=0') + '.', why: 'With ' + t('d=0') + ' the lines are still parallel (same slope, different intercepts).' },
              { html: 'No, because elimination can’t be used.', why: 'Elimination can be used — it gives ' + t('0=d-' + nb(sh.D)) + '. The reason is the matching slopes.' }],
              'Exactly one solution needs two lines with <b>different</b> slopes. Here both lines are ' + t(pol([[-sh.a, 'x'], [sh.b, 'y']]) + '=\\ldots') + ', so their slopes are equal whatever ' + t('d') + ' is.', [], 'one solution?');
          } }] },
      { num: '17', stem: '<i>(Mixed Review)</i> Line the equations up first, then decide, eliminate and solve.', parts: [
        { id: 'e17a', level: 'EMG', make: function (r) { var S = elimGen(r, { e: 0, op: 'sub', magF: [1, 6], xr: [-4, 5], yr: [-4, 5], test: function (C) { return C[0][1] > 0; } }, [6, 1, 13, 6, -4, 8]); S.texs[0] = yFirstT(S.Es[0]); return elimPart('Solve. Give the solution as an ordered pair.', S); } },
        { id: 'e17b', level: 'EMG', make: function (r) { var S = elimGen(r, { e: 0, op: 'add', sgnE: -1, xr: [-4, 5], yr: [-4, 6] }, [-8, 3, -1, 8, 3, 31]); S.texs[1] = yFirstT(S.Es[1]); return elimPart('Solve. Give the solution as an ordered pair.', S); } },
        { id: 'e17c', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair.', elimGen(r, { e: 0, op: 'sub', mag: [4, 10], xr: [-4, 5], yr: [-4, 5] }, [10, -7, -4, 10, 2, 14])); } },
        { id: 'e17d', level: 'EMG', make: function (r) { return elimPart('Solve. Give the solution as an ordered pair ' + t('(a,\\ b)') + '.', elimGen(r, { e: 1, op: 'add', V: ['a', 'b'], xr: [-5, 9], yr: [-5, 5] }, [2, 3, 4, 2, -3, 28])); } }] }
    ]
  });

  /* rewrite an equation as ax + by = c (x-term first) */
  function orderPart(z) {
    var i = z.ro, e = z.Es[i], key = eqT(e);
    var chk = function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right|\s/g, '');
      if (!s) return form('empty', 'Type the equation first.');
      var rr = LN.read(s, ['x', 'y']); if (!rr.ok) return form('unreadable', 'I can’t read that equation — check the signs.');
      if (!LN.same([rr.a, rr.b, rr.c], sysA(e))) return near(rr.a, -qv(e.a)) && near(rr.b, qv(e.b)) ? wrong('rearr-sign', 'Check the sign of the ' + t('x') + '-term: it keeps its own sign when you move it to the front.') : wrong('eq', 'That isn’t the same equation. Only the order of the terms should change.');
      if (!/^-?\d*x[+-]\d*y=-?\d+$/.test(s)) return form('u8l5-order', 'Right equation — now write it in the order ' + t('ax+by=c') + ': the ' + t('x') + '-term first, then the ' + t('y') + '-term, then the number on the right.');
      if (!(near(rr.a, qv(e.a)) && near(rr.b, qv(e.b)))) return form('u8l5-order', 'Right equation — but keep the coefficients as they are (don’t multiply through by ' + t('-1') + ').');
      return ok();
    };
    var p = B.math('Rewrite ' + t(z.texs[i]) + ' with the terms in columns: the ' + t('x') + '-term first, then the ' + t('y') + '-term, then the constant.' + sysD(z.texs), chk, key,
      'Just reorder the terms, keeping each sign: ' + t(z.texs[i]) + ' becomes ' + t(key) + '. Lined up, the system is' + sysD(z.lined), ['Each term keeps its own sign when it moves.'], 'line up', { keys: 'eq', vars: ['x', 'y'], placeholder: 'e.g. 3x + 2y = 7' });
    p.bad = [pol([[qn(e.a), 'x'], [e.b, 'y']]) + '=' + qT(e.c)];
    return p;
  }
})(window);
