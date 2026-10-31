/* Math 15 · Unit 8 · Lesson 6 — Solving Systems by Elimination, Part 2: Multiplying First (RF9)
 * Assignment 6 (u8_L06.tex, Questions 1–14) and the Lesson 6 Extra Practice (u8_EP06.tex, Questions 1–18).
 * Every part is a generator: same structure, idea and difficulty as the booklet question (one equation or both to
 * multiply, which variable, add or subtract afterwards, rearranged / fractional / decimal equations, special cases,
 * the kind of answer), new numbers from the seed; the booklet's own system is among the possible versions.
 * No calculator: integer solutions unless the booklet item has fractions.
 * Model: Math 10C u8l3.js (elimination with scaling: multipliers from the LCM, classic slips → wrong pairs with their
 * own hints — constant not scaled, right sides combined the other way, a sign not changed when subtracting,
 * back-substituting into a scaled left side with the old constant).
 * Conversions: "which equation, by what constant" -> multiple choice; "multiply one equation" -> the multiplied
 * equation typed as its own step, then the ordered pair; "explain / find the error / which is cheaper" -> multiple
 * choice whose options are reasons; word problems -> the system (equation boxes), then the values.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Q13 (three equations), Extra 12(c) (m for no solution),
 * Extra 17 (literal coefficients). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, LN = HW.lines, ex = HW.ex;

  HW.addCodes({
    'elim-const': 'Scaled an equation but not its constant', 'elim-rhs': 'Combined the right sides the other way (added vs subtracted)', 'elim-sub-sign': 'Subtracting: sign of a term not changed',
    'elim-backsub': 'Back-substituted into a scaled left side with the old constant', 'elim-not': 'Combination still has both variables', 'eq-step': 'Gave a later (simplified) step instead of the combined equation',
    'addsub': 'Chose add vs subtract wrongly', 'u8-mult': 'Wrong multiplier', 'eq': 'Wrong equation', 'pt-fraction': 'Exact answer given as a decimal', 'swap-answer': 'Right numbers in the wrong boxes', 'one-value': 'One value right, the other wrong',
    'nr-sum': 'Combined the values the wrong way (sum vs difference)', 'nr-one': 'Gave one unknown instead of the combination', 'z-wrong': 'Three unknowns: a value wrong', 'xy-right-z': 'Three unknowns: one value wrong',
    'coef-swap': 'Coefficients attached to the wrong variables', 'u8-count-swap': 'Ticket counts swapped', 'u8-price-swap': 'Prices matched to the wrong tickets', 'mix-total': 'Mixture: total not used', 'mix-swap': 'Mixture: amounts swapped', 'mix-pct': 'Mixture: percent not used correctly',
    'sub-swap': 'Substituted the point’s coordinates into the wrong letters', 'pts-not-on': 'Point not on the line', 'pts-repeat': 'Same point listed twice', 'u8-neg': 'Sign slip dividing by −1 (or a negative)',
    'm15u8l6-same': 'Copied the equation without multiplying', 'm15u8l6-back': 'Unknown coefficient: sign or arithmetic slip', 'm15u8l6-lit': 'Expression in a wrong'
  });
  HW.addPartial({ 'm15u8l6-back': 's', 'm15u8l6-lit': 'n' });

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


  /* ---------------- elimination after multiplying ---------------- */
  function scaleE(e, m) { return E(qm(e.a, m), qm(e.b, m), qm(e.c, m)); }
  function planOf(Es, e) {   // the LCM multipliers that make e's coefficients the same size
    var a = Math.abs(qv(co(Es[0], e))), b = Math.abs(qv(co(Es[1], e))), L = lcm(a, b), m = [L / a, L / b];
    var same = (qv(co(Es[0], e)) > 0) === (qv(co(Es[1], e)) > 0);
    return { e: e, m: m, L: L, sub: same, one: m[0] === 1 || m[1] === 1, n: (m[0] === 1 ? 0 : 1) + (m[1] === 1 ? 0 : 1) };
  }
  function chooseE(Es) {   // one equation beats both; then the smaller LCM; then opposite signs (add)
    var P = [planOf(Es, 0), planOf(Es, 1)];
    var sc = function (p) { return p.n * 1000 + p.L + (p.sub ? 0.5 : 0); };
    return sc(P[0]) <= sc(P[1]) ? 0 : 1;
  }
  function planT(P, V) {
    var parts = []; [0, 1].forEach(function (i) { if (P.m[i] !== 1) parts.push('Eq. ' + (i + 1) + ' by ' + t(P.m[i])); });
    return 'multiply ' + parts.join(' and ') + ', then <b>' + (P.sub ? 'subtract' : 'add') + '</b> to eliminate ' + t(V[P.e]);
  }
  function planWhy(Es, P, V) {
    var a = co(Es[0], P.e), b = co(Es[1], P.e), A = Math.abs(qv(a)), Bb = Math.abs(qv(b));
    if (P.one) { var i = P.m[0] !== 1 ? 0 : 1; return 'The ' + t(V[P.e]) + '-coefficients are ' + t(qT(a)) + ' and ' + t(qT(b)) + '. ' + t(Math.min(A, Bb)) + ' goes into ' + t(Math.max(A, Bb)) + ', so only <b>one</b> equation needs multiplying: Eq. ' + (i + 1) + ' × ' + t(P.m[i]) + '.'; }
    return 'The ' + t(V[P.e]) + '-coefficients are ' + t(qT(a)) + ' and ' + t(qT(b)) + '. Neither goes into the other, so <b>both</b> equations are multiplied, up to the lowest common multiple ' + t(P.L) + ': Eq. 1 × ' + t(P.m[0]) + ' and Eq. 2 × ' + t(P.m[1]) + '.';
  }
  function elimSolM(Es, e, o) {
    o = o || {}; var V = o.vars || ['x', 'y'], P = o.plan || planOf(Es, e), f = 1 - e, out = (o.pre || []).slice();
    var S2 = [scaleE(Es[0], P.m[0]), scaleE(Es[1], P.m[1])];
    if (P.m[0] !== 1 || P.m[1] !== 1) out.push(planWhy(Es, P, V));
    [0, 1].forEach(function (i) { if (P.m[i] !== 1) out.push('Eq. ' + (i + 1) + ' × ' + t(P.m[i]) + ' (every term, the constant too): ' + t(eqT(S2[i], V))); });
    var I = elimInfo(S2, e, o.ord != null ? o.ord : (P.sub && qv(qs(co(S2[0], f), co(S2[1], f))) < 0 ? 1 : 0));
    var nm = P.m[0] !== 1 || P.m[1] !== 1 ? (I.sub ? (I.ord ? 'subtract (second − first)' : 'subtract') : 'add') : (I.sub ? (I.ord ? 'subtract (Eq. 2 − Eq. 1)' : 'subtract') : 'add');
    out.push('The ' + t(V[e]) + '-terms are now ' + (I.sub ? 'the same, so <b>' + nm + '</b>' : 'opposites, so <b>add</b>') + ': ' + t(combT(I, V)));
    if (qv(I.k) === 0) {
      var tr = qv(I.R) === 0;
      out.push('Both variables are gone: ' + t('0=' + qT(I.R)) + ', which is ' + (tr ? '<b>always true</b> — the equations describe the <b>same line</b>, so there are <b>infinitely many solutions</b>.' : '<b>never true</b> — the lines are <b>parallel</b>, so there is <b>no solution</b>.'));
      return { html: out.join('<br>'), kind: tr ? 'inf' : 'none', I: I, plan: P };
    }
    var v = qd(I.R, I.k);
    out.push(t(stepTex(I, V)) + (qv(I.k) === 1 ? '' : ', so ' + t(V[f] + '=' + qT(v))));
    var w = o.back != null ? o.back : (Math.abs(qv(co(Es[1], e))) < Math.abs(qv(co(Es[0], e))) ? 1 : 0), bs = backStep(Es[w], e, v, V);
    out.push('Substitute ' + t(V[f] + '=' + qT(v)) + ' into the <b>original</b> Eq. ' + (w + 1) + ': ' + bs.tex + '.');
    var sol = e === 0 ? [bs.u, v] : [v, bs.u];
    out.push('Check in both original equations: ' + (o.checkEs || Es).map(function (z) { return chkLine(z, V, sol); }).join('&nbsp;&nbsp; '));
    out.push('Solution: ' + t('(' + V[0] + ',\\ ' + V[1] + ')=' + ptT(sol)));
    return { html: out.join('<br>'), sol: sol, kind: null, I: I, plan: P };
  }
  /* classic slips with multipliers → the wrong pair they lead to (numbers) */
  function slipsM(Es, e, P, V) {
    var S = Es.map(function (q) { return [qv(q.a), qv(q.b), qv(q.c)]; }), f = 1 - e, ms = P.m, s0 = solve2(Es[0], Es[1]), out = [];
    if (!s0) return out; var sol = s0.map(qv);
    function add(pt, code, hint) {
      if (!isFinite(pt[0]) || !isFinite(pt[1])) return;
      if ((near(pt[0], sol[0]) && near(pt[1], sol[1])) || (near(pt[0], sol[1]) && near(pt[1], sol[0]))) return;
      if (out.some(function (w) { return near(w.is[0], pt[0]) && near(w.is[1], pt[1]); })) return;
      if (pt.some(function (z) { var fr = LN.toFr(z); return Math.abs(fr[1]) > 200; })) return;
      out.push({ is: pt, code: code, hint: hint });
    }
    var E1 = S[0].map(function (x) { return x * ms[0]; }), E2 = S[1].map(function (x) { return x * ms[1]; }), sub = near(E1[e], E2[e]), sg = sub ? -1 : 1;
    var k = E1[f] + sg * E2[f]; if (near(k, 0)) return out;
    var R = E1[2] + sg * E2[2], v = R / k;
    function push(vv, code, hint) { [0, 1].forEach(function (w) { var pt = []; pt[f] = vv; pt[e] = (S[w][2] - S[w][f] * vv) / S[w][e]; add(pt, code, hint); }); }
    [0, 1].forEach(function (w) { var m = ms[w]; if (m === 1) return; var q = S[w], pt = []; pt[f] = v; pt[e] = (q[2] - m * q[f] * v) / (m * q[e]);
      add(pt, 'elim-backsub', 'Your ' + t(V[f]) + '-value is right. To find ' + t(V[e]) + ', substitute into an <b>original</b> equation — Eq. ' + (w + 1) + ' × ' + t(m) + ' has right side ' + t(dc(m * q[2])) + ', not ' + t(dc(q[2])) + '.'); });
    if (ms[0] !== 1 || ms[1] !== 1) { var w0 = ms[0] !== 1 ? 0 : 1; push((S[0][2] * (w0 === 0 ? 1 : ms[0]) + sg * S[1][2] * (w0 === 1 ? 1 : ms[1])) / k, 'elim-const', 'Multiplying an equation means multiplying <b>every</b> term — the constant too: Eq. ' + (w0 + 1) + ' × ' + t(ms[w0]) + ' has right side ' + t(dc(ms[w0] * S[w0][2])) + '.'); }
    push((E1[2] - sg * E2[2]) / k, 'elim-rhs', sub ? 'When you subtract the equations, subtract the right sides too — sign and all: ' + t(dc(E1[2]) + '-' + nb(dc(E2[2])) + '=' + dc(E1[2] - E2[2])) + '.' : 'You added the left sides, so add the right sides too: ' + t(dc(E1[2]) + '+' + nb(dc(E2[2])) + '=' + dc(E1[2] + E2[2])) + '.');
    if (sub) { var k2 = E1[f] + E2[f]; if (!near(k2, 0)) push(R / k2, 'elim-sub-sign', 'Subtracting changes the sign of <b>every</b> term being subtracted, including the ' + t(V[f]) + '-term. Write it as a bracketed difference.'); }
    return out;
  }
  function frQ(x) { var f = LN.toFr(x); return Q(f[0], f[1]); }
  var H_MUL = ['Pick a variable. Multiply one equation (or both) so its coefficients become the same or opposites — <b>every</b> term, the constant too.', 'Add or subtract, solve, then substitute into an <b>original</b> equation and check the pair in both.'];
  /* S = { Es, texs, e, V, pre, checkEs } */
  function mulPart(prompt, S, o) {
    o = o || {}; var V = S.V || ['x', 'y'], e = S.e != null ? S.e : chooseE(S.Es), res = elimSolM(S.Es, e, { vars: V, pre: S.pre, checkEs: S.checkEs, back: S.back });
    var target = res.kind || res.sol, wr = res.kind ? [] : slipsM(S.Es, e, res.plan, V);
    var p = B.point(prompt + sysD(S.texs), target, { vars: V, system: S.Es.map(sysA), wrong: wr.concat(o.wrong || []) }, res.html, o.hints || H_MUL, o.text || 'solve ' + S.texs.join(' ; '));
    if (!res.kind) {
      var s = res.sol;
      if (!isInt(s[0]) || !isInt(s[1])) p.check = decOnly(p.check);
      p.bad = wr.slice(0, 4).map(function (w) { return ptK([frQ(w.is[0]), frQ(w.is[1])]); }).concat(o.bad || []);
      if (qv(s[0]) !== qv(s[1])) p.bad.push(ptK([s[1], s[0]]));
      p.bad.push('\\text{no solution}');
      p.good = [V[0] + '=' + qT(s[0]) + ', ' + V[1] + '=' + qT(s[1])];
    } else p.bad = [res.kind === 'none' ? '\\text{infinitely many}' : '\\text{no solution}', '(0, 0)'];
    return p;
  }
  /* the multiplied equation: any whole-number multiple of one equation that makes a variable line up with the other */
  function mulStepPart(prompt, S, o) {
    o = o || {}; var V = S.V || ['x', 'y'], e = S.e != null ? S.e : chooseE(S.Es), P = planOf(S.Es, e), i = o.eq != null ? o.eq : (P.m[0] !== 1 ? 0 : 1), m = o.m || P.m[i], keyE = scaleE(S.Es[i], m);
    var orig = S.Es.map(function (q) { return [qv(q.a), qv(q.b), qv(q.c)]; });
    var chk = function (resp) {
      if (!String(resp == null ? '' : resp).trim()) return form('empty', 'Type the new equation first.');
      var r = LN.read(resp, V); if (!r.ok) return form('unreadable', 'I can’t read that equation — check the signs.');
      var s = [r.a, r.b, -r.c], strict = o.eq != null;
      for (var j = 0; j < 2; j++) {
        if (strict && j !== i) continue;
        var q = orig[j], k = q[0] ? s[0] / q[0] : s[1] / q[1];
        if (!(near(s[0], k * q[0]) && near(s[1], k * q[1]))) continue;
        if (near(s[2], k * q[2])) {
          if (near(Math.abs(k), 1)) return form('m15u8l6-same', 'That is the equation as it was — multiply every term by a number first.');
          if (strict) return near(k, m) ? ok() : wrong('u8-mult', 'Multiply Eq. ' + (i + 1) + ' by ' + t(m) + ', as planned.');
          var other = orig[1 - j], lines = [0, 1].some(function (v) { return near(Math.abs(k * q[v]), Math.abs(other[v])); });
          if (lines && near(k, Math.round(k))) return ok();
          if (lines) return wrong('u8-mult', 'That lines up a variable, but use a <b>whole-number</b> multiplier so no fractions appear.');
          return wrong('u8-mult', 'After multiplying by ' + t(LN.frT.apply(null, LN.toFr(k))) + ', neither variable’s coefficient matches the other equation’s. Choose the number that turns one coefficient into the other.');
        }
        if (near(s[2], q[2]) && !near(Math.abs(k), 1)) return wrong('elim-const', 'Multiply <b>every</b> term — the constant on the right side too.');
      }
      return wrong('eq', null);
    };
    var sol = planWhy(S.Es, P, V) + '<br>Eq. ' + (i + 1) + ' × ' + t(m) + ': ' + t(eqT(keyE, V)) + ' (every term, including the constant).';
    var p = B.math((prompt || '<b>Step 1.</b> Multiply <b>one</b> equation by a number so that one variable’s coefficients become the same or opposites. Type the new (multiplied) equation.') + sysD(S.texs), chk, eqT(keyE, V), sol,
      o.hints || ['Look for a coefficient that goes into the other one (like ' + t('1') + ' into ' + t('3') + ').', 'Multiply <b>every</b> term, the constant too.'], o.text || 'multiplied equation', { keys: 'eq', vars: V, placeholder: 'e.g. 6x - 3y = 3' });
    p.bad = [pol([[keyE.a, V[0]], [keyE.b, V[1]]]) + '=' + qT(S.Es[i].c)];
    return p;
  }
  /* which multipliers? (multiple choice) */
  function planMC(r, S, e, o) {
    o = o || {}; var V = ['x', 'y'], P = planOf(S.Es, e), op = P.sub ? 'subtract' : 'add', other = P.sub ? 'add' : 'subtract';
    var txt = function (m, opn) { var parts = []; [0, 1].forEach(function (i) { if (m[i] !== 1) parts.push('Eq. ' + (i + 1) + ' by ' + t(m[i])); }); return 'Multiply ' + parts.join(' and ') + (m[0] !== 1 && m[1] !== 1 ? ' (both)' : ' (one equation)') + ', then <b>' + opn + '</b>'; };
    var opts = [{ html: txt(P.m, op), right: true }];
    opts.push({ html: txt(P.m, other), code: 'addsub', why: 'After multiplying, the ' + t(V[e]) + '-coefficients are ' + t(qv(co(S.Es[0], e)) * P.m[0]) + ' and ' + t(qv(co(S.Es[1], e)) * P.m[1]) + ': ' + (P.sub ? 'the same, so subtract.' : 'opposites, so add.') });
    if (P.one) { var i = P.m[0] !== 1 ? 0 : 1, mm = [1, 1]; mm[1 - i] = P.m[i]; opts.push({ html: txt(mm, op), code: 'wrongeq', why: 'Multiplying Eq. ' + (2 - i) + ' makes its coefficient even bigger. Multiply the equation with the <b>smaller</b> coefficient.' });
      var big = Math.abs(qv(co(S.Es[1 - i], 1 - e))), mw = [1, 1]; mw[i] = big !== P.m[i] && big > 1 ? big : P.m[i] + 1; opts.push({ html: txt(mw, op), code: 'mult', why: 'Eq. ' + (i + 1) + ' × ' + t(mw[i]) + ' gives ' + t(V[e]) + '-coefficient ' + t(Math.abs(qv(co(S.Es[i], e))) * mw[i]) + ', which doesn’t match ' + t(Math.abs(qv(co(S.Es[1 - i], e)))) + '.' }); }
    else { opts.push({ html: txt([P.m[1], P.m[0]], op), code: 'swap', why: 'Eq. 1 × ' + t(P.m[1]) + ' and Eq. 2 × ' + t(P.m[0]) + ' give ' + t(V[e]) + '-coefficients ' + t(Math.abs(qv(co(S.Es[0], e))) * P.m[1]) + ' and ' + t(Math.abs(qv(co(S.Es[1], e))) * P.m[0]) + ' — they don’t match. Each equation is multiplied up to the LCM ' + t(P.L) + '.' });
      var Pf = planOf(S.Es, 1 - e); opts.push({ html: txt(Pf.m, Pf.sub ? 'subtract' : 'add').replace('</b>', '</b> (this eliminates ' + t(V[1 - e]) + ')'), code: 'othervar', why: 'Those multipliers line up ' + t(V[1 - e]) + ', not ' + t(V[e]) + '.' }); }
    var seen = {}; opts = opts.filter(function (z) { if (seen[z.html]) return false; seen[z.html] = 1; return true; });
    return mc(r, (o.prompt || 'To eliminate ' + t(V[e]) + ', which equation(s) would you multiply, by what, and would you then add or subtract? (Don’t solve.)') + sysD(S.texs), opts,
      planWhy(S.Es, P, V) + ' The new ' + t(V[e]) + '-coefficients are ' + t(qv(co(S.Es[0], e)) * P.m[0]) + ' and ' + t(qv(co(S.Es[1], e)) * P.m[1]) + ' — ' + (P.sub ? 'the same, so <b>subtract</b>.' : 'opposites, so <b>add</b>.'),
      ['Compare the two ' + t(V[e]) + '-coefficients. Does one go into the other (multiply one equation), or do you need their lowest common multiple (multiply both)?'], o.text || 'plan the multipliers');
  }

  /* ---------------- generators ---------------- */
  function noDiv(a, b) { a = Math.abs(a); b = Math.abs(b); return a !== b && a % b !== 0 && b % a !== 0; }
  /* one coefficient of e divides the other: Eq. i is multiplied by m; o.op: what happens after ('add' | 'sub') */
  function oneGen(r, o, book) {
    return gen(r, function (r) {
      var e = o.e, f = 1 - e, i = o.i != null ? o.i : r.int(0, 1), j = 1 - i, m = r.int(2, o.mMax || 5), sm = r.int(1, o.smMax || 3) * (o.smSign || (e === 0 ? 1 : sgn(r)));
      var op = o.op || r.pick(['add', 'sub']), C = [[0, 0], [0, 0]];
      C[i][e] = sm; C[j][e] = op === 'sub' ? m * sm : -m * sm;
      if (e === 0 && C[j][e] < 0 && !o.negX) return null;
      var f1 = r.int(1, o.fMax || 6), f2 = r.int(1, o.fMax || 6); if (f === 1) { f1 *= sgn(r); f2 *= sgn(r); } else if (o.negX) { f2 *= sgn(r); }
      if (Math.abs(f1) === Math.abs(f2)) return null;
      C[0][f] = f1; C[1][f] = f2;
      if (C[0][0] * C[1][1] - C[0][1] * C[1][0] === 0) return null;
      var xr = o.xr || [-4, 6], yr = o.yr || [-4, 6], P = [rnz(r, xr[0], xr[1]), rnz(r, yr[0], yr[1])];
      var Es = [E(C[0][0], C[0][1], C[0][0] * P[0] + C[0][1] * P[1]), E(C[1][0], C[1][1], C[1][0] * P[0] + C[1][1] * P[1])];
      if (!o.zeroOk && Es.some(function (z) { return qv(z.c) === 0; })) return null;
      if (Es.some(function (z) { return gcd(gcd(z.a[0], z.b[0]), z.c[0]) > 1; })) return null;
      if (o.test && !o.test(C, P, Es)) return null;
      var S = mkS(Es, o.V); S.e = o.solveE != null ? o.solveE : e; return S;
    }, function () { var b = book, S = mkS([E(b[0], b[1], b[2]), E(b[3], b[4], b[5])], o.V); S.e = o.solveE != null ? o.solveE : o.e; return S; });
  }
  /* neither coefficient divides the other, for both variables (both equations must be multiplied) */
  function bothGen(r, o, book) {
    return gen(r, function (r) {
      var lo = (o.rng || [2, 6])[0], hi = (o.rng || [2, 6])[1], a1 = r.int(lo, hi), b1 = r.int(lo, hi), a2 = r.int(lo, hi), b2 = r.int(lo, hi);
      var sg = o.signs || [1, 1, 1, -1], C = [[a1 * sg[0], b1 * sg[1]], [a2 * sg[2], b2 * sg[3]]];
      if (!noDiv(a1, a2) || !noDiv(b1, b2) || C[0][0] * C[1][1] - C[0][1] * C[1][0] === 0) return null;
      var xr = o.xr || [-4, 6], yr = o.yr || [-4, 6], P = [Q(rnz(r, xr[0], xr[1])), Q(rnz(r, yr[0], yr[1]))];
      if (o.frac) { var tv = o.frac === 'x' ? 0 : 1, q = r.pick([2, 3]), p = rnz(r, -3 * q, 3 * q); if (p % q === 0) return null; P[tv] = Q(p, q); }
      var Es = [E(C[0][0], C[0][1], qa(qm(C[0][0], P[0]), qm(C[0][1], P[1]))), E(C[1][0], C[1][1], qa(qm(C[1][0], P[0]), qm(C[1][1], P[1])))];
      if (!Es.every(function (z) { return isInt(z.c) && (o.zeroOk || qv(z.c) !== 0); })) return null;
      if (Es.some(function (z) { return gcd(gcd(z.a[0], z.b[0]), Q(z.c)[0]) > 1; })) return null;
      if (o.test && !o.test(C, P, Es)) return null;
      var S = mkS(Es, o.V); S.e = chooseE(Es); return S;
    }, function () { var b = book, S = mkS([E(b[0], b[1], b[2]), E(b[3], b[4], b[5])], o.V); S.e = chooseE(S.Es); return S; });
  }
  function freeSys(r, gen1, book) {   // Q1-style: constants free (not solved)
    return gen(r, function (r) { var C = gen1(r); if (!C) return null; var Es = [E(C[0][0], C[0][1], rnz(r, -9, 20)), E(C[1][0], C[1][1], rnz(r, -9, 20))]; return solve2(Es[0], Es[1]) ? mkS(Es) : null; }, function () { return mkS([E(book[0], book[1], book[2]), E(book[3], book[4], book[5])]); });
  }
  function oneC(e, i, op) { return function (r) { var f = 1 - e, m = r.int(2, 5), sm = r.int(1, 3) * (e === 1 ? sgn(r) : 1), C = [[0, 0], [0, 0]]; C[i][e] = sm; C[1 - i][e] = op === 'sub' ? m * sm : -m * sm; if (e === 0 && C[1 - i][0] < 0) return null; var f1 = r.int(1, 7), f2 = r.int(1, 7); if (f === 1) { f1 *= sgn(r); f2 *= sgn(r); } if (Math.abs(f1) === Math.abs(f2)) return null; C[0][f] = f1; C[1][f] = f2; return C[0][0] * C[1][1] - C[0][1] * C[1][0] ? C : null; }; }
  function bothC(e, op) { return function (r) { var f = 1 - e, a = r.int(2, 9), b = r.int(2, 9); if (!noDiv(a, b)) return null; var C = [[0, 0], [0, 0]]; C[0][e] = a; C[1][e] = op === 'sub' ? b : -b; if (e === 0 && C[1][0] < 0) { C[0][0] = -a; C[1][0] = b; } var f1 = r.int(1, 9), f2 = r.int(1, 9); if (f === 1) { f1 *= sgn(r); f2 *= sgn(r); } if (Math.abs(f1) === Math.abs(f2)) return null; C[0][f] = f1; C[1][f] = f2; return C[0][0] * C[1][1] - C[0][1] * C[1][0] ? C : null; }; }
  function word(n) { return ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][n] || String(n); }

  /* ======================================================================================================== */
  HW.defineLesson({
    id: 'u8l6', unit: 8, num: '6', title: 'Solving Systems by Elimination, Part 2: Multiplying First', outcome: 'RF9',
    blurb: 'When no coefficients match, multiply one equation (or both) so that one variable lines up, then add or subtract.',
    questions: [
      { num: '1', section: 'Part A — Identify the Multiplier', stem: 'State which equation you would multiply, and by what constant, to eliminate the given variable. Do not solve.',
        shared: function (r) { return { a: freeSys(r, oneC(1, 1, 'add'), [2, 3, 10, 5, -1, 4]), b: freeSys(r, oneC(1, 1, 'add'), [1, 4, 9, 3, -2, 1]), c: freeSys(r, oneC(0, 1, 'sub'), [4, -1, 7, 2, 3, 8]), d: freeSys(r, oneC(0, 1, 'sub'), [3, 2, 11, 1, -5, -3]) }; },
        parts: ['a', 'b', 'c', 'd'].map(function (L) { var e = L === 'a' || L === 'b' ? 1 : 0; return { id: '1' + L, level: 'BEG', make: function (r, sh) { return planMC(r, sh[L], e, { prompt: 'To eliminate ' + t(['x', 'y'][e]) + ', which equation would you multiply, by what, and would you then add or subtract? (Don’t solve.)' }); } }; }) },
      { num: '2', section: 'Part B — Multiply One Equation', stem: 'Solve each system by multiplying only one equation. Check your solution.',
        shared: function (r) {
          var o = { e: 1, op: 'add', xr: [1, 6], yr: [1, 5] };
          return { a: oneGen(r, Object.assign({ i: 1, smMax: 1 }, o), [1, 3, 11, 2, -1, 1]), b: oneGen(r, Object.assign({ i: 0, smMax: 1 }, o), [2, 1, 13, 1, -3, -4]),
            c: oneGen(r, Object.assign({ i: 0, smMax: 2 }, o), [5, 2, 24, 1, -4, -4]), d: oneGen(r, Object.assign({ i: 0, smMax: 1 }, o), [3, -1, 14, 2, 3, 13]) };
        },
        parts: ['a', 'b', 'c', 'd'].reduce(function (acc, L) {
          acc.push({ id: '2' + L + 'i', sub: L + ' i', level: 'BEG', make: function (r, sh) { return mulStepPart(null, sh[L]); } });
          acc.push({ id: '2' + L + 'ii', sub: L + ' ii', level: 'BEG', make: function (r, sh) { return mulPart('Now add or subtract, solve, and check. Give the solution as an ordered pair.', sh[L]); } });
          return acc;
        }, []) },
      { num: '3', stem: 'Solve each system by multiplying only one equation. Watch your signs — in each case you will need to subtract the equations after multiplying.', parts: [
        { id: '3a', level: 'EMG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', oneGen(r, { e: 1, i: 1, op: 'sub', smMax: 1, smSign: 1, xr: [1, 6], yr: [1, 6] }, [5, 2, 16, 1, 1, 5])); } },
        { id: '3b', level: 'EMG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', oneGen(r, { e: 1, i: 1, op: 'sub', smMax: 2, smSign: -1, xr: [1, 7], yr: [1, 6] }, [3, -4, -2, 1, -2, -4])); } },
        { id: '3c', level: 'EMG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', oneGen(r, { e: 0, i: 0, op: 'sub', smMax: 2, xr: [-4, 4], yr: [1, 5], test: function (C) { return C[0][1] > 0 && C[1][1] < 0; } }, [2, 3, 7, 4, -1, -7])); } }] },
      { num: '4', section: 'Part C — Multiply Both Equations', stem: 'Solve each system by multiplying both equations. Check your solution.',
        shared: function (r) {
          var o = { rng: [2, 5], xr: [1, 5], yr: [-3, 5] };
          return { a: bothGen(r, Object.assign({ zeroOk: true }, o), [2, 3, 13, 3, -2, 0]), b: bothGen(r, o, [3, 2, 18, 2, -5, -7]), c: bothGen(r, o, [4, 3, 24, 5, -2, 7]), d: bothGen(r, o, [5, 3, 17, 3, -4, 16]) };
        },
        parts: ['a', 'b', 'c', 'd'].reduce(function (acc, L) {
          acc.push({ id: '4' + L + 'i', sub: L + ' i', level: 'EMG', make: function (r, sh) { return planMC(r, sh[L], sh[L].e, { prompt: '<b>Plan.</b> To eliminate ' + t(['x', 'y'][sh[L].e]) + ', which multipliers would you use, and would you then add or subtract?' }); } });
          acc.push({ id: '4' + L + 'ii', sub: L + ' ii', level: 'PRG', make: function (r, sh) { return mulPart('Now solve the system and check. Give the solution as an ordered pair.', sh[L]); } });
          return acc;
        }, []) },
      { num: '5', stem: 'Solve each system, choosing whichever variable is easier to eliminate.', parts: [
        { id: '5a', level: 'EMG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', oneGen(r, { e: 0, i: 0, op: 'sub', smMax: 2, smSign: 1, xr: [1, 6], yr: [-3, 5], test: function (C) { return C[0][1] > 1 && C[1][1] === -1; } }, [2, 3, 16, 4, -1, 18])); } },
        { id: '5b', level: 'PRG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', bothGen(r, { rng: [2, 5], xr: [-3, 5], yr: [-3, 4] }, [3, 5, 2, 2, -3, 14])); } },
        { id: '5c', level: 'EMG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', oneGen(r, { e: 0, i: 0, op: 'sub', smMax: 1, xr: [1, 7], yr: [1, 6], test: function (C) { return C[0][1] < 0 && C[1][1] > 0; } }, [1, -2, -2, 3, 5, 38])); } }] },
      /* ---------- Part D ---------- */
      { num: '6', section: 'Part D — Applications', stem: function (sh) { return 'A food truck sells tacos and burritos. On Friday, ' + sh.c[0][0] + ' tacos and ' + sh.c[0][1] + ' burritos sold for a total of $' + sh.T[0] + '. On Saturday, ' + sh.c[1][0] + ' tacos and ' + sh.c[1][1] + ' burritos sold for a total of $' + sh.T[1] + '.'; },
        shared: function (r) { return wordShared(r, [3, 7], [3, 8], [[5, 2], [3, 4]], [4, 5]); },
        parts: [
          { id: '6a', level: 'EMG', make: function (r, sh) { return wordSys(sh, ['t', 'b'], 'Let ' + t('t') + ' be the price of a taco and ' + t('b') + ' the price of a burrito. Write a system of two equations describing the two days’ sales.', 'tacos'); } },
          { id: '6b', level: 'PRG', make: function (r, sh) { return wordSolve(sh, ['t', 'b'], 'Solve the system to find the price of a taco and the price of a burrito.', ['taco $', 'burrito $'], 'taco', 'burrito'); } }] },
      { num: '7', stem: function (sh) { return 'A concert sells adult and child tickets. ' + cap(word(sh.c[0][0])) + ' adult tickets and ' + word(sh.c[0][1]) + ' child tickets cost $' + sh.T[0] + ' in total. ' + cap(word(sh.c[1][0])) + ' adult tickets and ' + word(sh.c[1][1]) + ' child tickets cost $' + sh.T[1] + ' in total.'; },
        shared: function (r) { return wordShared(r, [6, 15], [3, 9], [[3, 4], [5, 3]], [10, 6], true); },
        parts: [
          { id: '7a', level: 'EMG', make: function (r, sh) { return wordSys(sh, ['a', 'c'], 'Let ' + t('a') + ' be the price of an adult ticket and ' + t('c') + ' the price of a child ticket. Write a system of two equations describing the two ticket totals.', 'tickets'); } },
          { id: '7b', level: 'PRG', make: function (r, sh) { return wordSolve(sh, ['a', 'c'], 'Solve the system to find the price of an adult ticket and the price of a child ticket.', ['adult $', 'child $'], 'adult ticket', 'child ticket'); } }] },
      { num: '8', stem: function (sh) { return 'A garden bed has length ' + t('l') + ' and width ' + t('w') + ', both in metres. ' + cap(times(sh.c[0][0])) + ' the length plus ' + times(sh.c[0][1]) + ' the width is ' + sh.T[0] + ' m. ' + cap(times(sh.c[1][0])) + ' the length minus ' + times(-sh.c[1][1]) + ' the width is ' + sh.T[1] + ' m.'; },
        shared: function (r) {
          return gen(r, function (r) { var a1 = r.int(2, 4), b1 = r.int(2, 4), a2 = r.int(2, 4), b2 = r.int(2, 4), w = r.int(3, 12), l = r.int(w + 1, w + 10); if (!noDiv(a1, a2) || !noDiv(b1, b2) || a2 * l - b2 * w <= 0) return null; return { c: [[a1, b1], [a2, -b2]], T: [a1 * l + b1 * w, a2 * l - b2 * w], P: [l, w] }; },
            function () { return { c: [[2, 3], [3, -2]], T: [57, 27], P: [15, 9] }; });
        },
        parts: [
          { id: '8a', level: 'EMG', make: function (r, sh) { return wordSys(sh, ['l', 'w'], 'Write a system of two equations describing the garden bed.', 'garden'); } },
          { id: '8b', level: 'PRG', make: function (r, sh) { return wordSolve(sh, ['l', 'w'], 'Solve the system to find the length and width of the garden bed.', [t('l='), t('w=')], 'length', 'width', 'm'); } }] },
      /* ---------- Part E ---------- */
      { num: '9', section: 'Part E — Multiple Choice and Numerical Response', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '9', level: 'EMG', make: function (r) {
          var S = gen(r, function (r) { var a1 = r.int(2, 5), b1 = r.int(2, 7), a2 = r.int(2, 5), b2 = r.int(2, 7); if (!noDiv(b1, b2) || a1 === a2 || gcd(b1, b2) !== 1 || a1 * b2 === b1 * a2 || [b2, b1, a2, a1].some(function (v, i, arr) { return arr.indexOf(v) !== i; })) return null; return mkS([E(a1, b1, rnz(r, 1, 30)), E(a2, -b2, rnz(r, -9, 20))]); }, function () { return mkS([E(2, 5, 19), E(3, -2, 1)]); });
          var b1 = qv(S.Es[0].b), b2 = -qv(S.Es[1].b), a1 = qv(S.Es[0].a), a2 = qv(S.Es[1].a), pr = function (m1, m2) { return 'Eq. 1 by ' + t(m1) + ', Eq. 2 by ' + t(m2); };
          return mc(r, 'Which pair of multipliers sets up <b>opposite</b> ' + t('y') + '-coefficients so that ' + t(S.texs[0]) + ' and ' + t(S.texs[1]) + ' can be eliminated by adding?', [
            { html: pr(b2, b1), right: true },
            { html: pr(b1, b2), why: 'Eq. 1 × ' + t(b1) + ' gives ' + t(b1 * b1 + 'y') + ' and Eq. 2 × ' + t(b2) + ' gives ' + t('-' + b2 * b2 + 'y') + ' — not opposites. Multiply each equation by the <b>other</b> equation’s ' + t('y') + '-coefficient.', code: 'swap' },
            { html: pr(a2, a1), why: 'Those multipliers match the ' + t('x') + '-coefficients, not the ' + t('y') + '-coefficients.', code: 'xvar' },
            { html: pr(b2, b2 + 1), why: 'Eq. 2 × ' + t(b2 + 1) + ' gives ' + t('-' + b2 * (b2 + 1) + 'y') + ', which isn’t the opposite of ' + t(b1 * b2 + 'y') + '.', code: 'mult' }],
            'The ' + t('y') + '-coefficients are ' + t(b1) + ' and ' + t(-b2) + '; their LCM is ' + t(b1 * b2) + '. Eq. 1 × ' + t(b2) + ' gives ' + t(b1 * b2 + 'y') + ' and Eq. 2 × ' + t(b1) + ' gives ' + t('-' + b1 * b2 + 'y') + ' — opposites, so adding removes ' + t('y') + '.', ['Make both ' + t('y') + '-coefficients equal to the lowest common multiple of ' + t(b1) + ' and ' + t(b2) + '.'], 'MC multipliers');
        } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var a, b, c, k, c1, c2;
          for (var g = 0; g < 300; g++) { a = r.int(2, 5); b = r.int(2, 4); k = r.int(2, 3); c = r.int(1, 4); c1 = rnz(r, 1, 20); c2 = rnz(r, -12, 12); if ((k * a + c) !== (a + c) && k * c1 + c2 !== c1 + c2 && (k * a - c) !== 0 && k * c1 + c2 !== 0) break; }
          var E1 = E(a, b, c1), E2 = E(c, -k * b, c2);
          return mc(r, 'When ' + t('y') + ' is eliminated from ' + t(eqT(E1)) + ' and ' + t(eqT(E2)) + ' by multiplying the first equation by ' + t(k) + ' and then adding, the result is', [
            { html: t(term(k * a + c, 'x', true) + '=' + (k * c1 + c2)), right: true },
            { html: t(term(a + c, 'x', true) + '=' + (k * c1 + c2)), why: 'Every term of the first equation is multiplied by ' + t(k) + ' — the ' + t(a + 'x') + ' too: ' + t((k * a) + 'x') + '.', code: 'u8-mult' },
            { html: t(term(k * a + c, 'x', true) + '=' + (c1 + c2)), why: 'The constant is multiplied too: ' + t(k + '\\times ' + c1 + '=' + k * c1) + '.', code: 'elim-const' },
            { html: t(term(k * a - c, 'x', true) + '=' + (k * c1 - c2)), why: 'The ' + t('y') + '-terms are opposites after multiplying, so <b>add</b>.', code: 'addsub' }],
            'First equation × ' + t(k) + ': ' + t(pol([[k * a, 'x'], [k * b, 'y']]) + '=' + k * c1) + '. Add ' + t(eqT(E2)) + ': the ' + t('y') + '-terms cancel and ' + t(term(k * a + c, 'x', true) + '=' + (k * c1 + c2)) + '.', ['Multiply <b>every</b> term of the first equation by ' + t(k) + ', then add the equations column by column.'], 'MC result');
        } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [{ id: '11', level: 'ADV', make: nrPartM(11) }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [{ id: '12', level: 'ADV', make: nrPartM(12) }] },
      { num: '13', section: 'Part F — Extension and Mixed Review', stem: '<i>(Extension)</i> Solve the system by elimination.', parts: [
        { id: '13', level: 'MAS', make: function (r) {
          var x, y, z, a, b;
          for (var g = 0; g < 300; g++) { x = r.int(1, 6); y = r.int(1, 6); z = r.int(1, 7); a = r.int(2, 3); b = r.int(2, 3); var D = 2 * (b - 1) - (a + 1) * (1 + b); if (D !== 0 && x !== y && y !== z && x !== z) break; }
          var T1 = x + y + z, T2 = a * x - y + z, T3 = x + b * y - z, texs = ['x+y+z=' + T1, pol([[a, 'x'], [-1, 'y'], [1, 'z']]) + '=' + T2, pol([[1, 'x'], [b, 'y'], [-1, 'z']]) + '=' + T3];
          var A1 = E(2, 1 + b, T1 + T3), A2 = E(a + 1, b - 1, T2 + T3), sub = elimSolM([A1, A2], chooseE([A1, A2]), {});
          var sol = 'The ' + t('z') + '-terms are ' + t('+z') + ', ' + t('+z') + ' and ' + t('-z') + ', so add pairs to remove ' + t('z') + ':<br>Eq. 1 + Eq. 3: ' + t(eqT(A1)) + '<br>Eq. 2 + Eq. 3: ' + t(eqT(A2)) + '<br>Now solve these two equations:<br>' + sub.html + '<br>Then ' + t('z=' + T1 + '-' + x + '-' + y + '=' + z) + ' (from Eq. 1).<br>Check Eq. 2: ' + t(a + '(' + x + ')-' + y + '+' + z + '=' + T2) + ' ✓ &nbsp; Eq. 3: ' + t(x + '+' + b + '(' + y + ')-' + z + '=' + T3) + ' ✓';
          return xyzPart('Solve:' + sysD(texs) + '<i>Hint:</i> add pairs of equations to eliminate ' + t('z') + ' first, then solve the resulting two-equation system.', ['x', 'y', 'z'], [x, y, z],
            [function (v) { return v[0] + v[1] + v[2] === T1; }, function (v) { return a * v[0] - v[1] + v[2] === T2; }, function (v) { return v[0] + b * v[1] - v[2] === T3; }], sol,
            ['Eq. 1 + Eq. 3 and Eq. 2 + Eq. 3 both remove ' + t('z') + '.', 'Solve the two new equations for ' + t('x') + ' and ' + t('y') + ', then use Eq. 1 for ' + t('z') + '.'], 'three unknowns');
        } }] },
      { num: '14', stem: '<i>(Mixed Review)</i> Solve each system, choosing whichever multiplying strategy (one equation or both) is most efficient.', parts: [
        { id: '14a', level: 'EMG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', oneGen(r, { e: 1, i: 0, op: 'add', smMax: 1, smSign: 1, xr: [1, 6], yr: [1, 6] }, [2, 1, 13, 5, -3, 5])); } },
        { id: '14b', level: 'PRG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', bothGen(r, { rng: [2, 6], xr: [-3, 5], yr: [-4, 4] }, [4, 3, -1, 3, -5, 21])); } }] }
    ],
    extra: [
      { num: '1', section: 'Extra Practice A — Plan Before You Multiply', stem: 'For each system, state which equation (or equations) you would multiply, by what constant, and which variable will vanish. Say whether the job needs one equation or both. Do not solve.',
        shared: function (r) {
          return { a: freeSys(r, oneC(0, 1, 'sub'), [3, 2, 12, 1, -5, 4]), b: freeSys(r, bothC(0, 'sub'), [4, -3, 7, 6, 5, 2]), c: freeSys(r, oneC(1, 1, 'add'), [5, 4, 1, 3, -2, 8]),
            d: freeSys(r, bothC(1, 'add'), [2, 9, 5, 7, -6, 3]), e: freeSys(r, bothC(0, 'sub'), [6, -5, 11, 4, 3, 9]), f: freeSys(r, oneC(0, 0, 'sub'), [1, -7, 2, 8, 3, 5]) };
        },
        parts: ['a', 'b', 'c', 'd', 'e', 'f'].map(function (L) { var e = { a: 0, b: 0, c: 1, d: 1, e: 0, f: 0 }[L]; return { id: 'e1' + L, level: L === 'b' || L === 'd' || L === 'e' ? 'EMG' : 'BEG', make: function (r, sh) { return planMC(r, sh[L], e, { prompt: 'To eliminate ' + t(['x', 'y'][e]) + ': which equation(s) would you multiply, by what, and would you then add or subtract? (Don’t solve.)' }); } }; }) },
      { num: '2', stem: 'For each system, compare the lowest common multiple of the x-coefficients with that of the y-coefficients. Which variable is cheaper to eliminate? Do not solve.',
        shared: function (r) {
          var mk = function (want, book) { return gen(r, function (r) { var C = [[r.int(2, 9), r.int(2, 9)], [r.int(2, 9), -r.int(2, 9)]], Lx = lcm(C[0][0], C[1][0]), Ly = lcm(C[0][1], -C[1][1]); if (Lx === Ly || C[0][0] === C[1][0] || C[0][1] === -C[1][1]) return null; if (want === 'x1' && !(Lx < Ly && (C[1][0] % C[0][0] === 0 || C[0][0] % C[1][0] === 0))) return null; if (want === 'x' && !(Lx < Ly && noDiv(C[0][0], C[1][0]))) return null; if (want === 'y' && !(Ly < Lx)) return null; var Es = [E(C[0][0], C[0][1], rnz(r, -9, 25)), E(C[1][0], C[1][1], rnz(r, -9, 25))]; return mkS(Es); }, function () { return mkS([E(book[0], book[1], book[2]), E(book[3], book[4], book[5])]); }); };
          return { a: mk('x', [4, 3, 10, 6, -5, 2]), b: mk('x1', [2, 7, 12, 6, -5, 8]), c: mk('y', [4, 6, 22, 9, -4, 5]) };
        },
        parts: ['a', 'b', 'c'].map(function (L) { return { id: 'e2' + L, level: 'EMG', make: function (r, sh) { return cheaperMC(r, sh[L]); } }; }) },
      { num: '3', stem: 'In each system the two coefficients of x have the same sign, so matching them would force you to subtract. Give a negative multiplier instead, so the coefficients become opposites and the equations can simply be added. Do not solve.',
        shared: function (r) {
          var mk = function (book, i) { return gen(r, function (r) { var s = r.int(2, 4), m = r.int(2, 4), C = [[0, r.int(1, 9) * sgn(r)], [0, r.int(1, 9) * sgn(r)]]; C[i][0] = s; C[1 - i][0] = m * s; if (Math.abs(C[0][1]) === Math.abs(C[1][1]) || C[0][0] * C[1][1] - C[0][1] * C[1][0] === 0) return null; return mkS([E(C[0][0], C[0][1], rnz(r, -9, 30)), E(C[1][0], C[1][1], rnz(r, -9, 30))]); }, function () { return mkS([E(book[0], book[1], book[2]), E(book[3], book[4], book[5])]); }); };
          return { a: mk([3, 2, 11, 6, 5, 26], 0), b: mk([2, -7, 4, 8, -3, 5], 0), c: mk([9, 4, 6, 3, 10, 1], 1) };
        },
        parts: ['a', 'b', 'c'].map(function (L) { return { id: 'e3' + L, level: 'EMG', make: function (r, sh) { return negMC(r, sh[L]); } }; }) },
      { num: '4', section: 'Extra Practice B — Multiplying One Equation', stem: 'In each system one coefficient is already a factor of the other, so only one equation needs multiplying. Multiply every term, including the constant, then eliminate, solve, and verify. Leave any fraction exact.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', oneGen(r, { e: 0, i: 0, op: 'sub', smMax: 1, xr: [-4, 5], yr: [-4, 4] }, [1, 4, -1, 3, -5, 14])); } },
        { id: 'e4b', level: 'EMG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', oneGen(r, { e: 1, i: 0, op: 'add', smMax: 1, smSign: -1, xr: [-4, 5], yr: [-4, 4] }, [2, -1, 7, 5, 3, 1])); } },
        { id: 'e4c', level: 'EMG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', oneGen(r, { e: 0, i: 0, op: 'sub', smMax: 3, xr: [-4, 4], yr: [-4, 5] }, [3, 2, 5, 9, -5, -29])); } },
        { id: 'e4d', level: 'PRG', make: function (r) {
          var S = gen(r, function (r) { var a1 = r.int(2, 6), m = r.int(2, 5), a2 = r.int(2, 9), b2 = -m, q = r.pick([2, 3]), p = rnz(r, -3 * q, 3 * q), y0 = rnz(r, -4, 4); if (p % q === 0 || Math.abs(a2) === a1) return null; var x0 = Q(p, q), Es = [E(a1, 1, qa(qm(a1, x0), y0)), E(a2, b2, qa(qm(a2, x0), b2 * y0))]; if (!Es.every(function (z) { return isInt(z.c) && qv(z.c); })) return null; var S = mkS(Es); S.e = 1; return S; }, function () { var S = mkS([E(4, 1, 3), E(6, -5, -2)]); S.e = 1; return S; });
          return mulPart('Solve. Give exact values (fractions in lowest terms).', S);
        } }] },
      { num: '5', section: 'Extra Practice C — Multiplying Both Equations', stem: 'In each system neither coefficient divides the other, so both equations must be multiplied. Use the lowest common multiple. Solve and verify; leave any fraction exact.', parts: [
        { id: 'e5a', level: 'PRG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', bothGen(r, { rng: [2, 7], xr: [-4, 4], yr: [-4, 5] }, [3, 4, 6, 5, -6, -28])); } },
        { id: 'e5b', level: 'PRG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', bothGen(r, { rng: [2, 7], signs: [1, -1, 1, 1], xr: [-4, 4], yr: [-4, 4] }, [4, -3, 14, 6, 5, 2])); } },
        { id: 'e5c', level: 'PRG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', bothGen(r, { rng: [2, 7], xr: [-5, 4], yr: [-4, 6] }, [5, 2, -5, 3, -7, -44])); } },
        { id: 'e5d', level: 'ADV', make: function (r) { return mulPart('Solve. Give exact values (fractions in lowest terms).', bothGen(r, { rng: [2, 9], frac: r.pick(['x', 'y']), xr: [-4, 4], yr: [-4, 4], test: function (C, P) { return !isInt(P[0]) || !isInt(P[1]); } }, [8, 6, 9, 6, -4, 11])); } }] },
      { num: '6', section: 'Extra Practice D — Aligning and Clearing First', stem: 'These equations are not yet in the arrangement elimination needs. Rewrite each with the variable terms on the left in the same order and the constant on the right, then choose your multipliers and solve.', parts: [
        { id: 'e6a', level: 'PRG', make: function (r) { var S = bothGen(r, { rng: [2, 6], signs: [1, 1, -1, 1], xr: [-3, 5], yr: [-3, 4] }, [3, 2, 14, -4, 5, -11]); return rearrPart(S, [rA, rB]); } },
        { id: 'e6b', level: 'PRG', make: function (r) { var S = bothGen(r, { rng: [2, 7], signs: [-1, 1, 1, -1], xr: [-3, 5], yr: [-4, 4] }, [-5, 2, -16, 7, -3, 23]); return rearrPart(S, [rC, rD]); } },
        { id: 'e6c', level: 'PRG', make: function (r) { var S = oneGen(r, { e: 0, i: 1, op: 'sub', smMax: 2, xr: [-4, 4], yr: [-4, 4], test: function (C) { return C[0][1] < 0 && C[1][1] < 0; } }, [4, -3, -9, 2, -5, -1]); return rearrPart(S, [rE, null]); } }] },
      { num: '7', stem: 'Clear the fractions or decimals first by multiplying each equation through by a suitable number — every term, both sides — then eliminate as usual. Leave any fractional answer exact.', parts: [
        { id: 'e7a', level: 'ADV', make: function (r) { return mulPart('Solve. Give exact values (fractions in lowest terms).', fracSysA(r)); } },
        { id: 'e7b', level: 'PRG', make: function (r) { return mulPart('Solve. Give the solution as an ordered pair.', decSys(r)); } },
        { id: 'e7c', level: 'PRG', make: function (r) { return mulPart('Solve. Give exact values (fractions in lowest terms).', sumDiffSys(r)); } }] },
      { num: '8', section: 'Extra Practice E — Errors, Special Cases, and Missing Numbers', stem: function (sh) { return 'Devon solved ' + t(sh.texs[0]) + ' and ' + t(sh.texs[1]) + '. He decided to eliminate ' + t('y') + ' by multiplying Equation 2 by ' + t(sh.m) + ', and wrote ' + t(pol([[sh.m * sh.d, 'x'], [-sh.m, 'y']]) + '=' + sh.e2) + '. Adding gave him ' + t(term(sh.a + sh.m * sh.d, 'x', true) + '=' + (sh.c1 + sh.e2)) + ', so ' + t('x=' + qT(Q(sh.c1 + sh.e2, sh.a + sh.m * sh.d))) + '.'; },
        shared: function (r) {
          return gen(r, function (r) { var a = r.int(2, 5), m = r.int(2, 5), d = r.int(2, 6), x0 = r.int(1, 5), y0 = rnz(r, -3, 5); if (a === d) return null; var c1 = a * x0 + m * y0, e2 = d * x0 - y0; if (!c1 || !e2 || (c1 + e2) % (a + m * d) === 0) return null; var Es = [E(a, m, c1), E(d, -1, e2)], S = mkS(Es); S.e = 1; S.a = a; S.m = m; S.d = d; S.c1 = c1; S.e2 = e2; return S; },
            function () { var S = mkS([E(2, 3, 12), E(5, -1, 13)]); S.e = 1; S.a = 2; S.m = 3; S.d = 5; S.c1 = 12; S.e2 = 13; return S; });
        },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r, sh) {
            return mc(r, 'What is Devon’s error?', [
              { html: 'He multiplied the left side by ' + t(sh.m) + ' but left the constant as ' + t(sh.e2) + ' — every term, including the constant, must be multiplied.', right: true },
              { html: 'He should have multiplied Equation 1 instead.', why: 'Multiplying Eq. 2 by ' + t(sh.m) + ' is a good plan: it turns ' + t('-y') + ' into ' + t('-' + sh.m + 'y') + '. The slip is in the constant.' },
              { html: 'He should have subtracted, not added.', why: t(sh.m + 'y') + ' and ' + t('-' + sh.m + 'y') + ' are opposites, so adding is right.' },
              { html: 'Nothing — fractions are normal in elimination.', why: 'Check his ' + t('x') + ' in the original equations: it doesn’t work.' }],
              'Eq. 2 × ' + t(sh.m) + ' means every term: ' + t(pol([[sh.m * sh.d, 'x'], [-sh.m, 'y']]) + '=' + sh.m * sh.e2) + ', not ' + t('=' + sh.e2) + '.', [], 'Devon’s error');
          } },
          { id: 'e8b', sub: 'b i', level: 'EMG', make: function (r, sh) { return mulStepPart('Write the correct multiplied Equation 2 (Eq. 2 × ' + t(sh.m) + ').', sh, { eq: 1, m: sh.m, hints: ['Multiply <b>every</b> term of ' + t(sh.texs[1]) + ' by ' + t(sh.m) + '.'] }); } },
          { id: 'e8c', sub: 'b ii', level: 'EMG', make: function (r, sh) { return mulPart('Finish the system properly. Give the solution as an ordered pair.', sh); } }] },
      { num: '9', stem: function (sh) { return 'Priya solved ' + t(sh.texs[0]) + ' and ' + t(sh.texs[1]) + '. She multiplied Equation 1 by ' + t(sh.P.m[0]) + ' and Equation 2 by ' + t(sh.P.m[1]) + ', getting ' + t(eqT(sh.S2[0])) + ' and ' + t(eqT(sh.S2[1])) + '. She then <b>subtracted</b> and obtained ' + t(pol([[qs(sh.S2[0].a, sh.S2[1].a), 'x'], [qs(sh.S2[0].b, sh.S2[1].b), 'y']]) + '=' + qT(qs(sh.S2[0].c, sh.S2[1].c))) + '.'; },
        shared: function (r) { var S = bothGen(r, { rng: [2, 6], xr: [-3, 5], yr: [-3, 4], test: function (C) { return C[0][0] !== C[1][0] && noDiv(C[0][1], C[1][1]); } }, [3, 4, 2, 5, -6, 16]); S.e = 1; S.P = planOf(S.Es, 1); S.S2 = [scaleE(S.Es[0], S.P.m[0]), scaleE(S.Es[1], S.P.m[1])]; return S; },
        parts: [
          { id: 'e9a', level: 'EMG', make: function (r, sh) {
            var L = sh.P.L;
            return mc(r, 'Her multiplying was correct. Why was subtracting the wrong move?', [
              { html: 'The ' + t('y') + '-terms were already <b>opposites</b> (' + t('+' + L + 'y') + ' and ' + t('-' + L + 'y') + '), so subtracting makes them add up instead of cancelling. She should add.', right: true },
              { html: 'She should have subtracted the other way round (Eq. 2 − Eq. 1).', why: 'Either order of subtraction still doubles the ' + t('y') + '-terms. Opposites cancel only when you add.' },
              { html: 'Subtracting is fine; she made an arithmetic slip with the constants.', why: 'Her result still has both variables — the operation was wrong, not the arithmetic.' },
              { html: 'She should have multiplied by different numbers.', why: 'The question says her multiplying was correct: ' + t('\\pm' + L + 'y') + ' line up perfectly.' }],
              t('+' + L + 'y') + ' and ' + t('-' + L + 'y') + ' are opposites: adding cancels them. Subtracting changes ' + t('-' + L + 'y') + ' to ' + t('+' + L + 'y') + ', giving ' + t(2 * L + 'y') + ' — both variables are still there.', [], 'Priya’s error');
          } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) { return mulPart('Redo the last step correctly and solve. Give the solution as an ordered pair.', sh); } }] },
      { num: '10', stem: 'Multiply as planned, then interpret the statement you are left with: what happens, what it tells you about the graphs, and how many solutions the system has.',
        shared: function (r) {
          return gen(r, function (r) { var p = r.int(2, 5), q = r.int(2, 5) * sgn(r); if (gcd(p, q) !== 1) return null; var k1 = r.int(2, 3), k2 = r.int(k1 + 1, 4), c0 = rnz(r, -6, 6), d0; do { d0 = rnz(r, -8, 8); } while (d0 === c0); var S = mkS([E(k1 * p, k1 * q, k1 * c0), E(k2 * p, k2 * q, k2 * d0)]); S.e = 0; return S; }, function () { var S = mkS([E(6, -4, 10), E(9, -6, 21)]); S.e = 0; return S; });
        },
        parts: [
          { id: 'e10', sub: 'i', level: 'EMG', make: function (r, sh) { return mulPart('Eliminate ' + t('x') + '. Use the <b>no solution</b> or <b>infinitely many</b> key if there isn’t exactly one solution.', sh); } },
          { id: 'e10x', sub: 'ii', level: 'EMG', make: function (r, sh) { var P = planOf(sh.Es, 0), S2 = [scaleE(sh.Es[0], P.m[0]), scaleE(sh.Es[1], P.m[1])]; return vanishMC(r, 'none', '0=' + qT(qs(S2[0].c, S2[1].c)), sh.texs); } }] },
      { num: '11', stem: 'Multiply as planned, then interpret the statement you are left with — two equations can describe the same line in disguise.',
        shared: function (r) {
          return gen(r, function (r) { var p = r.int(2, 5), q = r.int(2, 5); if (gcd(p, q) !== 1) return null; var k1 = r.int(2, 3), k2 = r.int(k1 + 1, 4), c0 = rnz(r, -6, 9); var S = mkS([E(k1 * p, k1 * q, k1 * c0), E(k2 * p, k2 * q, k2 * c0)]); S.e = 0; S.base = E(p, q, c0); return S; }, function () { var S = mkS([E(4, 6, 10), E(6, 9, 15)]); S.e = 0; S.base = E(2, 3, 5); return S; });
        },
        parts: [
          { id: 'e11', sub: 'i', level: 'EMG', make: function (r, sh) { return mulPart('Eliminate ' + t('x') + '. Use the <b>no solution</b> or <b>infinitely many</b> key if there isn’t exactly one solution.', sh); } },
          { id: 'e11x', sub: 'ii', level: 'EMG', make: function (r, sh) { return twoPoints(sh); } }] },
      { num: '12', stem: '<b>Work backwards.</b> Find the missing coefficient.', parts: [
        { id: 'e12a', level: 'ADV', make: function (r) {
          var a, k, b2, a2, x0, y0;
          for (var g = 0; g < 300; g++) { a = r.int(2, 7); k = rnz(r, -9, 9); a2 = r.int(2, 5); b2 = -r.int(2, 5); x0 = r.int(1, 5); y0 = rnz(r, -3, 3); if (Math.abs(k) > 1 && a * x0 + k * y0 !== 0 && Math.abs(k) !== Math.abs(b2)) break; }
          var c1 = a * x0 + k * y0, c2 = a2 * x0 + b2 * y0;
          return B.number(t(a + 'x+ky=' + c1) + ' and ' + t(eqT(E(a2, b2, c2))) + ' have the solution ' + t(ptT([x0, y0])) + '. Find ' + t('k') + '.', k, function (v) { if (v === -k) return { code: 'm15u8l6-back', hint: 'Watch the sign: ' + t('k(' + y0 + ')=' + term(y0, 'k', true)) + '.' }; return null; },
            t(a + '(' + x0 + ')+k' + nb(y0) + '=' + c1) + ', so ' + t(a * x0 + term(y0, 'k', false) + '=' + c1) + ', ' + t(term(y0, 'k', true) + '=' + (c1 - a * x0)) + ' and ' + t('k=' + k) + '. (The second equation checks: ' + t(a2 + '(' + x0 + ')' + (b2 < 0 ? '-' : '+') + Math.abs(b2) + nb(y0) + '=' + c2) + ' ✓)', ['Substitute the solution into the equation that contains ' + t('k') + '.'], 'find k', { before: t('k=') });
        } },
        { id: 'e12b', level: 'ADV', make: function (r) {
          var a, b1, a2, b2, x0, y0;
          for (var g = 0; g < 300; g++) { a = rnz(r, -9, 12); b1 = -r.int(2, 5); a2 = r.int(2, 5); b2 = r.int(2, 6); x0 = r.pick([1, 2, 2, 3, -1, -2]); y0 = rnz(r, -3, 4); if (Math.abs(a) > 1 && a * x0 + b1 * y0 !== 0 && a !== a2) break; }
          var c1 = a * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0;
          return B.number(t('ax' + term(b1, 'y', false) + '=' + c1) + ' and ' + t(eqT(E(a2, b2, c2))) + ' have the solution ' + t(ptT([x0, y0])) + '. Find ' + t('a') + '.', a, function (v) { if (near(v, (c1 + b1 * y0) / x0)) return { code: 'm15u8l6-back', hint: 'Check the sign when you move ' + t(term(b1, '', true) + '(' + y0 + ')') + ' to the other side.' }; return null; },
            t('a(' + x0 + ')' + term(b1, '', false) + nb(y0) + '=' + c1) + ', so ' + t(term(x0, 'a', true) + (b1 * y0 < 0 ? '' : '+') + (b1 * y0) + '=' + c1) + ', ' + t(term(x0, 'a', true) + '=' + (c1 - b1 * y0)) + ' and ' + t('a=' + a) + '. (The second equation checks: ' + t(a2 + '(' + x0 + ')+' + b2 + nb(y0) + '=' + c2) + ' ✓)', ['Substitute the solution into the equation that contains ' + t('a') + '.'], 'find a', { before: t('a=') });
        } },
        { id: 'e12c', level: 'MAS', make: function (r) {
          var a2, b2, c2, k, c1;
          for (var g = 0; g < 300; g++) { a2 = r.int(2, 6); b2 = r.int(2, 5); c2 = rnz(r, -9, 9); k = r.int(2, 3); c1 = rnz(r, -15, 20); if (c1 !== k * c2 && gcd(a2, b2) === 1) break; }
          var m = k * a2;
          return B.number(t('mx+' + k * b2 + 'y=' + c1) + ' and ' + t(eqT(E(a2, b2, c2))) + ' have <b>no</b> solution. Find ' + t('m') + '.', m, function (v) { if (v === a2) return { code: 'value', hint: 'With ' + t('m=' + a2) + ' the ' + t('x') + '-coefficients match, but the ' + t('y') + '-coefficients (' + t(k * b2) + ' and ' + t(b2) + ') don’t — the slopes differ. Scale the whole second equation first.' }; return null; },
            'No solution means parallel lines: the left sides must be multiples of each other, with right sides that don’t match. The ' + t('y') + '-coefficient ' + t(k * b2) + ' is ' + t(k) + ' × ' + t(b2) + ', so multiply Eq. 2 by ' + t(k) + ': ' + t(pol([[m, 'x'], [k * b2, 'y']]) + '=' + k * c2) + '. For the left sides to match, ' + t('m=' + m) + '.<br>Subtracting: ' + t('0=' + c1 + '-' + nb(k * c2) + '=' + (c1 - k * c2)) + ' — false, so there is no solution. ✓',
            ['No solution: same left side (after scaling), different right side.', 'What number turns the ' + t('y') + '-coefficient ' + t(b2) + ' into ' + t(k * b2) + '? Do the same to the ' + t('x') + '-coefficient.'], 'm for no solution', { before: t('m=') });
        } }] },
      /* ---------- Part F ---------- */
      { num: '13', section: 'Extra Practice F — Applications', stem: function (sh) { return 'A lab technician mixes a ' + sh.p1 + '% acid solution with a ' + sh.p2 + '% acid solution to obtain ' + sh.V + ' mL of a ' + sh.pt + '% acid solution. Let ' + t('x') + ' be the millilitres of the ' + sh.p1 + '% solution and ' + t('y') + ' the millilitres of the ' + sh.p2 + '% solution.'; },
        shared: function (r) {
          for (var g = 0; g < 400; g++) { var p1 = r.pick([10, 20, 30]), p2 = r.pick([40, 50, 60, 70]), pt = 10 * r.int(Math.ceil((p1 + 10) / 10), Math.floor((p2 - 10) / 10)), V = 50 * r.int(2, 10), x = V * (p2 - pt) / (p2 - p1); if (pt > p1 && pt < p2 && Number.isInteger(x) && x % 10 === 0 && x > 0 && x < V && x !== V / 2) return { p1: p1, p2: p2, pt: pt, V: V, x: x, y: V - x }; }
          return { p1: 20, p2: 50, pt: 30, V: 300, x: 200, y: 100 };
        },
        parts: [
          { id: 'e13a', level: 'PRG', make: function (r, sh) {
            return sysPart('Write a system of two equations: one for the total volume, one for the acid content.', [{ A: 1, B: 1, C: -sh.V }, { A: sh.p1, B: sh.p2, C: -sh.pt * sh.V }], ['x', 'y'], { key: ['x+y=' + sh.V, dc(sh.p1 / 100) + 'x+' + dc(sh.p2 / 100) + 'y=' + dc(sh.pt * sh.V / 100)],
              diag: function (is) {
                if (is([sh.p1, sh.p2, -sh.pt])) return { code: 'mix-total', hint: 'The acid in the mixture is ' + sh.pt + '% <b>of ' + sh.V + ' mL</b>: ' + t(dc(sh.pt / 100) + '(' + sh.V + ')=' + dc(sh.pt * sh.V / 100)) + '.' };
                if (is([sh.p2, sh.p1, -sh.pt * sh.V])) return { code: 'mix-swap', hint: 'Match each percent to its own volume: ' + t(sh.p1 + '\\%') + ' goes with ' + t('x') + '.' };
                return null;
              },
              sol: 'Volume: ' + t('x+y=' + sh.V) + '.<br>Acid: ' + t(dc(sh.p1 / 100) + 'x+' + dc(sh.p2 / 100) + 'y=' + dc(sh.pt / 100) + '(' + sh.V + ')=' + dc(sh.pt * sh.V / 100)) + '.', hints: ['The volumes add to ' + sh.V + ' mL. The acid amounts (percent × volume) add to the acid in the mixture.'], text: 'mixture system' });
          } },
          { id: 'e13b', level: 'PRG', make: function (r, sh) {
            var Es = [E(1, 1, sh.V), E(sh.p1 / 10, sh.p2 / 10, sh.pt * sh.V / 10)], res = elimSolM(Es, 0, { pre: ['Clear the decimals (× ' + t('10') + '): ' + t(eqT(Es[1])) + '.'] });
            return numFields('Clear the decimals, then solve by elimination. How much of each solution is used?', [{ label: sh.p1 + '% solution', after: 'mL' }, { label: sh.p2 + '% solution', after: 'mL' }], [sh.x, sh.y], { swapCode: 'mix-swap', swapHint: 'Right numbers, wrong bottles. The mixture (' + sh.pt + '%) is closer to ' + (sh.pt - sh.p1 < sh.p2 - sh.pt ? sh.p1 : sh.p2) + '%, so more of that solution is used.',
              diag: function (v) { if (!near(v[0] + v[1], sh.V)) return { code: 'mix-total', hint: 'Your volumes must add up to ' + sh.V + ' mL.' }; return { code: 'mix-pct', hint: 'The volumes add to ' + sh.V + ' mL, but the acid doesn’t come out to ' + sh.pt + '%. Check the acid equation.' }; },
              sol: res.html + '<br><b>' + sh.x + ' mL</b> of the ' + sh.p1 + '% solution and <b>' + sh.y + ' mL</b> of the ' + sh.p2 + '% solution.', answer: sh.x + ' mL of ' + sh.p1 + '%, ' + sh.y + ' mL of ' + sh.p2 + '%', hints: ['Multiply the acid equation by ' + t('10') + '. Then multiply the volume equation so the ' + t('x') + '-coefficients match.'], text: 'mixture amounts' });
          } }] },
      { num: '14', stem: function (sh) { return 'Maya trains at two steady speeds. On Monday she cycled for ' + sh.c[0][0] + ' h and ran for ' + sh.c[0][1] + ' h, covering ' + sh.T[0] + ' km in total. On Thursday she cycled for ' + sh.c[1][0] + ' h and ran for ' + sh.c[1][1] + ' h, covering ' + sh.T[1] + ' km in total.'; },
        shared: function (r) { return gen(r, function (r) { var c = r.int(10, 20), rr = r.int(4, 9), C = [[r.int(1, 4), r.int(1, 4)], [r.int(1, 4), r.int(1, 4)]]; if (C[0][0] * C[1][1] - C[0][1] * C[1][0] === 0 || C[0][0] === C[1][0] || C[0][1] === C[1][1]) return null; return { c: C, P: [c, rr], T: [C[0][0] * c + C[0][1] * rr, C[1][0] * c + C[1][1] * rr] }; }, function () { return { c: [[2, 3], [4, 1]], P: [14, 6], T: [46, 62] }; }); },
        parts: [
          { id: 'e14a', level: 'EMG', make: function (r, sh) { return wordSys(sh, ['c', 'r'], 'Let ' + t('c') + ' be her cycling speed and ' + t('r') + ' her running speed, both in km/h. Write a system of two equations.', 'speeds'); } },
          { id: 'e14b', level: 'PRG', make: function (r, sh) { return wordSolve(sh, ['c', 'r'], 'Solve by elimination to find both speeds.', ['cycling', 'running'], 'cycling speed', 'running speed', 'km/h'); } }] },
      { num: '15', stem: function (sh) { return 'A theatre sold ' + sh.c[0][0] + ' adult tickets and ' + sh.c[0][1] + ' student tickets for a total of $' + sh.T[0] + ', and on another night sold ' + sh.c[1][0] + ' adult tickets and ' + sh.c[1][1] + ' student tickets for a total of $' + sh.T[1] + '.'; },
        shared: function (r) { return wordShared(r, [8, 16], [4, 10], [[5, 3], [4, 7]], [14, 9], true); },
        parts: [
          { id: 'e15a', level: 'EMG', make: function (r, sh) { return wordSys(sh, ['a', 's'], 'Let ' + t('a') + ' be the price of an adult ticket and ' + t('s') + ' the price of a student ticket. Write a system of two equations.', 'theatre'); } },
          { id: 'e15b', level: 'PRG', make: function (r, sh) { return wordSolve(sh, ['a', 's'], 'Solve by elimination to find both prices.', ['adult $', 'student $'], 'adult ticket', 'student ticket'); } }] },
      { num: '16', stem: function (sh) { return 'At an arcade, ' + sh.c[0][0] + ' red tokens and ' + sh.c[0][1] + ' blue tokens are worth ' + sh.T[0] + ' points, while ' + sh.c[1][0] + ' red tokens and ' + sh.c[1][1] + ' blue tokens are worth ' + sh.T[1] + ' points.'; },
        shared: function (r) {
          return gen(r, function (r) { var C = [[r.int(2, 6), r.int(2, 9)], [r.int(2, 6), r.int(2, 9)]], Lx = lcm(C[0][0], C[1][0]), Ly = lcm(C[0][1], C[1][1]); if (!noDiv(C[0][0], C[1][0]) || !noDiv(C[0][1], C[1][1]) || Lx >= Ly) return null; var P = [5 * r.int(2, 8), 5 * r.int(1, 6)]; if (P[0] === P[1]) return null; return { c: C, P: P, T: [C[0][0] * P[0] + C[0][1] * P[1], C[1][0] * P[0] + C[1][1] * P[1]] }; }, function () { return { c: [[3, 7], [5, 4]], P: [25, 10], T: [145, 165] }; });
        },
        parts: [
          { id: 'e16a', level: 'EMG', make: function (r, sh) { return wordSys(sh, ['r', 'b'], 'Let ' + t('r') + ' be the point value of a red token and ' + t('b') + ' that of a blue token. Write a system of two equations.', 'tokens'); } },
          { id: 'e16b', sub: 'b i', level: 'EMG', make: function (r, sh) { var S = mkS([E(sh.c[0][0], sh.c[0][1], sh.T[0]), E(sh.c[1][0], sh.c[1][1], sh.T[1])], ['r', 'b']); return cheaperMC(r, S, ['r', 'b']); } },
          { id: 'e16c', sub: 'b ii', level: 'PRG', make: function (r, sh) { return wordSolve(sh, ['r', 'b'], 'Solve and verify. What is each token worth?', ['red', 'blue'], 'red token', 'blue token', 'points'); } }] },
      /* ---------- Part G ---------- */
      { num: '17', section: 'Extra Practice G — Stretch', stem: '<b>Literal coefficients.</b>', parts: [
        { id: 'e17', level: 'MAS', make: function (r) {
          var p, q, rr, s, tt, D;
          for (var g = 0; g < 400; g++) { p = r.int(2, 5); q = r.int(2, 5); rr = r.int(2, 6); s = r.int(2, 5); tt = r.int(2, 5); D = -p * s - q * rr; if (noDiv(q, s) && p !== rr && (tt * p - rr) !== 0 && (-s - q * tt) !== 0) break; }
          var X = Q(-s - q * tt, D), Y = Q(p * tt - rr, D);
          var fA = function (c) { c = Q(c); var n = c[0], d = c[1], sgn0 = n < 0 ? '-' : ''; n = Math.abs(n); return sgn0 + (d === 1 ? (n === 1 ? 'a' : n + 'a') : '\\frac{' + (n === 1 ? '' : n) + 'a}{' + d + '}'); };
          var texs = [pol([[p, 'x'], [q, 'y']]) + '=a', pol([[rr, 'x'], [-s, 'y']]) + '=' + tt + 'a'], P = planOf([E(p, q, 1), E(rr, -s, tt)], 1), XT = fA(X), YT = fA(Y);
          var chk1 = function (f) { return function (resp) { var s0 = String(resp || '').trim(); if (!s0) return form('empty', 'Fill in both boxes.'); var a = ex.parse(s0); if (!a.ok) return form('unreadable', 'I can’t read that expression. Use the fraction key.'); var vals = [1, 2, 7, -3].map(function (k) { return ex.value(a.ast, { a: k }); }); if (vals.some(function (v) { return !isFinite(v); })) return form('unreadable', 'Use only the letter ' + t('a') + '.'); return [1, 2, 7, -3].every(function (k, i) { return near(vals[i], f(k)); }) ? ok() : wrong('m15u8l6-lit', null); }; };
          var fx = function (k) { return qv(X) * k; }, fy = function (k) { return qv(Y) * k; };
          var chk = function (resp) { resp = resp || []; var r1 = chk1(fx)(resp[0]), r2 = chk1(fy)(resp[1]); if (r1.v === 'correct' && r2.v === 'correct') return ok(); if (chk1(fy)(resp[0]).v === 'correct' && chk1(fx)(resp[1]).v === 'correct') return wrong('swap-answer', 'Your two expressions are in the wrong boxes.'); var bad = r1.v !== 'correct' ? r1 : r2, nm = r1.v !== 'correct' ? 'x' : 'y'; return { v: bad.v, code: bad.code, hint: '<b>' + t(nm) + ':</b> ' + (bad.hint || 'Not right for every ' + t('a') + ' — substitute your answers into both equations to check.') }; };
          var S2 = [pol([[p * P.m[0], 'x'], [q * P.m[0], 'y']]) + '=' + (P.m[0] === 1 ? '' : P.m[0]) + 'a', pol([[rr * P.m[1], 'x'], [-s * P.m[1], 'y']]) + '=' + (tt * P.m[1]) + 'a'];
          var sol = 'Eliminate ' + t('y') + ' (LCM of ' + t(q) + ' and ' + t(s) + ' is ' + t(P.L) + '): Eq. 1 × ' + t(P.m[0]) + ': ' + t(S2[0]) + '; Eq. 2 × ' + t(P.m[1]) + ': ' + t(S2[1]) + '.<br>Add: ' + t((p * P.m[0] + rr * P.m[1]) + 'x=' + (P.m[0] + tt * P.m[1]) + 'a') + ', so ' + t('x=' + XT) + '.<br>' +
            'Back-substitute into ' + t(texs[0]) + ': ' + t(q + 'y=a-' + p + '\\cdot' + (XT.charAt(0) === '-' ? '\\left(' + XT + '\\right)' : XT)) + ', so ' + t('y=' + YT) + '.<br>Check: ' + t(p + '\\left(' + XT + '\\right)+' + q + '\\left(' + YT + '\\right)=a') + ' ✓ and ' + t(rr + '\\left(' + XT + '\\right)-' + s + '\\left(' + YT + '\\right)=' + tt + 'a') + ' ✓';
          return { prompt: 'Solve the system for ' + t('x') + ' and ' + t('y') + ' in terms of the constant ' + t('a') + '. Multiply exactly as you would with numbers.' + sysD(texs),
            input: { type: 'fields', fields: [{ label: t('x='), mode: 'math', keys: 'poly', vars: ['a'], placeholder: ' ' }, { label: t('y='), mode: 'math', keys: 'poly', vars: ['a'], placeholder: ' ' }] }, check: chk,
            key: [XT, YT], answer: t('x=' + XT) + ', ' + t('y=' + YT), solution: sol, hints: ['Treat ' + t('a') + ' like a number: the right sides are ' + t('a') + ' and ' + t(tt + 'a') + '.', 'Multiply to line up ' + t('y') + ', add, and divide.'], text: 'literal coefficients', bad: XT !== YT ? [[YT, XT]] : [] };
        } }] },
      { num: '18', stem: function (sh) { return '<b>Two routes, one system.</b> Consider ' + t(sh.texs[0]) + ' and ' + t(sh.texs[1]) + '.'; },
        shared: function (r) {
          return gen(r, function (r) { var a = r.int(2, 6), b = r.int(2, 7), p = r.int(2, 4), x0 = r.int(1, 5), y0 = rnz(r, -4, 4); if (!noDiv(a, 3 * p) || !noDiv(b, 3) || a === b) return null; var Es = [E(a, b, a * x0 + b * y0), E(3 * p, -3, 3 * (p * x0 - y0))]; if (!qv(Es[0].c) || !qv(Es[1].c)) return null; var S = mkS(Es); S.e = chooseE(Es); S.p = p; S.d = p * x0 - y0; S.x0 = x0; S.y0 = y0; return S; },
            function () { var S = mkS([E(4, 5, 7), E(6, -3, 21)]); S.e = 1; S.p = 2; S.d = 7; S.x0 = 3; S.y0 = -1; return S; });
        },
        parts: [
          { id: 'e18a', level: 'PRG', make: function (r, sh) { return mulPart('<b>(a)</b> Solve the system by elimination. Give the solution as an ordered pair.', sh); } },
          { id: 'e18b', level: 'EMG', make: function (r, sh) {
            var right = 'y=' + sh.p + 'x' + (sh.d < 0 ? '+' + (-sh.d) : '-' + sh.d), Ln2 = sh.p + 'x-y=' + sh.d;
            return mc(r, '<b>(b)</b> Now solve by substitution. Dividing ' + t(sh.texs[1]) + ' by ' + t('3') + ' gives ' + t(Ln2) + '. Which expression do you substitute into ' + t(sh.texs[0]) + '?', [
              { html: t(right), right: true },
              { html: t('y=' + (sh.d < 0 ? (-sh.d) + '+' : sh.d + '-') + sh.p + 'x'), why: 'From ' + t('-y=' + pol([[-sh.p, 'x'], [sh.d, '']])) + ', divide <b>every</b> term by ' + t('-1') + '.', code: 'u8-neg' },
              { html: t('x=\\frac{' + sh.d + '+y}{' + sh.p + '}'), why: 'That is correct algebra but brings in a fraction. The ' + t('y') + '-coefficient is ' + t('-1') + ': isolate ' + t('y') + ' instead.', code: 'frac' },
              { html: t('y=' + sh.p + 'x+' + (sh.d < 0 ? '(' + sh.d + ')' : sh.d)), why: 'Check the sign of the constant: ' + t('y=' + sh.p + 'x-' + nb(sh.d)) + '.', code: 'const' }],
              t(sh.texs[1]) + ' ÷ ' + t('3') + ': ' + t(Ln2) + '. Isolate ' + t('y') + ' (coefficient ' + t('-1') + '): ' + t(right) + '.<br>Substitute into ' + t(sh.texs[0]) + ': ' + t(term(sh.Es[0].a, 'x', true) + cB(sh.Es[0].b, pol([[sh.p, 'x'], [-sh.d, '']]), false) + '=' + qT(sh.Es[0].c)) + ', so ' + t(term(qa(sh.Es[0].a, qm(sh.Es[0].b, sh.p)), 'x', true) + '=' + qT(qa(sh.Es[0].c, qm(sh.Es[0].b, sh.d)))) + ', ' + t('x=' + sh.x0) + ' and ' + t('y=' + sh.p + '(' + sh.x0 + ')' + (sh.d < 0 ? '+' + (-sh.d) : '-' + sh.d) + '=' + sh.y0) + ' — the same pair ' + t(ptT([sh.x0, sh.y0])) + ' as elimination.', [], 'route 2');
          } },
          { id: 'e18c', level: 'PRG', make: function (r, sh) {
            return mc(r, '<b>(c)</b> The two answers agree. Which feature of ' + t(sh.texs[1]) + ' made substitution at least as quick here?', [
              { html: 'Its coefficients share the factor ' + t('3') + '; dividing by ' + t('3') + ' gives ' + t(sh.p + 'x-y=' + sh.d) + ', whose ' + t('y') + '-coefficient is ' + t('-1') + ' — isolating makes no fraction. With no such factor (every coefficient bigger than ' + t('1') + '), elimination would win.', right: true },
              { html: 'Its constant is the largest number in the system.', why: 'The constant doesn’t decide it. Look at the coefficients after dividing by ' + t('3') + '.' },
              { html: 'Substitution is always quicker than elimination.', why: 'Not when every coefficient is bigger than ' + t('1') + ' — then substitution drags fractions through every step.' },
              { html: 'Elimination was quicker because the ' + t('x') + '-coefficients already matched.', why: 'They don’t match: ' + t(qv(sh.Es[0].a)) + ' and ' + t(qv(sh.Es[1].a)) + '.' }],
              'Dividing ' + t(sh.texs[1]) + ' by ' + t('3') + ' produces a coefficient of ' + t('-1') + ', so substitution needs no fractions. If no equation had a ' + t('\\pm1') + ' coefficient (or a common factor that creates one), isolating would bring in fractions and elimination would be the quicker route.', [], 'which route');
          } }] }
    ]
  });

  /* ---------------- helpers used above (hoisted) ---------------- */
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function times(k) { return ['', 'once', 'twice', 'three times', 'four times', 'five times'][k]; }
  function wordShared(r, xr, yr, bookC, bookP, both) {
    return gen(r, function (r) {
      var C = [[r.int(2, 5), r.int(2, 5)], [r.int(2, 5), r.int(2, 5)]], P = [r.int(xr[0], xr[1]), r.int(yr[0], yr[1])];
      if (C[0][0] * C[1][1] - C[0][1] * C[1][0] === 0 || C[0][0] === C[1][0] || C[0][1] === C[1][1] || P[0] === P[1]) return null;
      if (both && (!noDiv(C[0][0], C[1][0]) || !noDiv(C[0][1], C[1][1]))) return null;
      if (!both && noDiv(C[0][0], C[1][0]) && noDiv(C[0][1], C[1][1])) return null;
      return { c: C, P: P, T: [C[0][0] * P[0] + C[0][1] * P[1], C[1][0] * P[0] + C[1][1] * P[1]] };
    }, function () { return { c: bookC, P: bookP, T: [bookC[0][0] * bookP[0] + bookC[0][1] * bookP[1], bookC[1][0] * bookP[0] + bookC[1][1] * bookP[1]] }; });
  }
  function wordSys(sh, V, prompt, text) {
    var k = [0, 1].map(function (i) { return pol([[sh.c[i][0], V[0]], [sh.c[i][1], V[1]]]) + '=' + sh.T[i]; });
    return sysPart(prompt, [0, 1].map(function (i) { return { A: sh.c[i][0], B: sh.c[i][1], C: -sh.T[i] }; }), V, { key: k,
      diag: function (is) { if ([0, 1].some(function (i) { return is([sh.c[i][1], sh.c[i][0], -sh.T[i]]); })) return { code: 'coef-swap', hint: 'Check which count goes with which letter: ' + t(V[0]) + ' and ' + t(V[1]) + ' are defined in the question.' }; return null; },
      sol: t(k[0]) + '<br>' + t(k[1]), hints: ['Each line of the story gives one equation: count × value, added, equals the total.'], text: text });
  }
  function wordSolve(sh, V, prompt, labs, n1, n2, unit) {
    var Es = [E(sh.c[0][0], sh.c[0][1], sh.T[0]), E(sh.c[1][0], sh.c[1][1], sh.T[1])], res = elimSolM(Es, chooseE(Es), { vars: V });
    var u = unit ? ' ' + unit : '', pre = unit ? '' : '$';
    return numFields(prompt, labs.map(function (l) { return { label: l, after: unit || '' }; }), sh.P, { swapCode: unit ? 'swap-answer' : 'u8-price-swap', swapHint: 'Right numbers in the wrong boxes — check which letter is which.',
      sol: res.html + '<br>' + cap(n1) + ': <b>' + pre + sh.P[0] + u + '</b>; ' + n2 + ': <b>' + pre + sh.P[1] + u + '</b>.', answer: n1 + ' ' + pre + sh.P[0] + u + ', ' + n2 + ' ' + pre + sh.P[1] + u,
      hints: ['Write the system, then multiply so one variable’s coefficients match.', 'Add or subtract, solve, and substitute into an original equation.'], text: n1 + ' and ' + n2 });
  }
  function cheaperMC(r, S, V) {
    V = V || ['x', 'y']; var Es = S.Es, a = [Math.abs(qv(Es[0].a)), Math.abs(qv(Es[1].a))], b = [Math.abs(qv(Es[0].b)), Math.abs(qv(Es[1].b))], Lx = lcm(a[0], a[1]), Ly = lcm(b[0], b[1]), e = Lx < Ly ? 0 : 1, one = e === 0 ? (a[0] % a[1] === 0 || a[1] % a[0] === 0) : (b[0] % b[1] === 0 || b[1] % b[0] === 0);
    var tl = function (v) { return 'LCM of the ' + t(V[v]) + '-coefficients: ' + t(v === 0 ? Lx : Ly); };
    return mc(r, 'Which variable is <b>cheaper</b> to eliminate, and why? (Don’t solve.)' + sysD(S.texs), [
      { html: t(V[e]) + ': ' + tl(e) + ' is smaller than ' + t(e === 0 ? Ly : Lx) + ', so the multipliers are smaller' + (one ? ' — only one equation needs multiplying.' : '.'), right: true },
      { html: t(V[1 - e]) + ': ' + tl(1 - e) + ' — the larger LCM gives more room.', why: 'A larger LCM means larger multipliers and bigger numbers to handle. Choose the smaller one.' },
      { html: t(V[0]) + ': always eliminate the first variable.', why: 'Either variable can be eliminated. Compare the LCMs.', code: 'first' },
      { html: t(V[1]) + ': its coefficients have opposite signs, so it is always cheaper.', why: 'Opposite signs only decide add vs subtract — not how big the multipliers are.', code: 'signs' }].filter(function (z, i, arr) { return arr.map(function (w) { return w.html.slice(0, 12); }).indexOf(z.html.slice(0, 12)) === i || z.right; }),
      t(V[0]) + '-coefficients ' + t(a[0]) + ' and ' + t(a[1]) + ': LCM ' + t(Lx) + '. ' + t(V[1]) + '-coefficients ' + t(b[0]) + ' and ' + t(b[1]) + ': LCM ' + t(Ly) + '.<br>' + t(V[e]) + ' has the smaller LCM, so its multipliers (' + planOf(Es, e).m.map(function (m) { return t(m); }).join(' and ') + ') are smaller' + (one ? '; one of them is ' + t('1') + ', so only one equation is multiplied' : '') + '.', ['Find the lowest common multiple of each pair of coefficients and compare.'], 'cheaper variable');
  }
  function negMC(r, S) {
    var Es = S.Es, a = [qv(Es[0].a), qv(Es[1].a)], i = Math.abs(a[0]) < Math.abs(a[1]) ? 0 : 1, m = Math.abs(a[1 - i]) / Math.abs(a[i]);
    var nm = function (eq, k, op) { return 'Multiply Eq. ' + (eq + 1) + ' by ' + t(k) + ', then <b>' + op + '</b>'; };
    var NE = scaleE(Es[i], -m);
    return mc(r, 'To eliminate ' + t('x') + ' by <b>adding</b>, which negative multiplier would you use, and on which equation? (Don’t solve.)' + sysD(S.texs), [
      { html: nm(i, -m, 'add'), right: true },
      { html: nm(i, m, 'add'), why: 'Multiplying by ' + t(m) + ' makes the ' + t('x') + '-coefficients the <b>same</b> — adding doubles them. Use ' + t(-m) + '.', code: 'pos' },
      { html: nm(1 - i, -m, 'add'), why: 'Multiplying Eq. ' + (2 - i) + ' gives ' + t(-m * a[1 - i] + 'x') + ' — far from ' + t(a[i] + 'x') + '. Multiply the equation with the smaller coefficient.', code: 'wrongeq' },
      { html: nm(i, -m, 'subtract'), why: 'After multiplying by ' + t(-m) + ' the ' + t('x') + '-coefficients are opposites, so <b>add</b>.', code: 'addsub' }],
      'The ' + t('x') + '-coefficients are ' + t(a[0]) + ' and ' + t(a[1]) + ' (same sign). Eq. ' + (i + 1) + ' × ' + t(-m) + ': ' + t(eqT(NE)) + '. Now ' + t(qv(NE.a) + 'x') + ' and ' + t(a[1 - i] + 'x') + ' are opposites, so the equations can simply be <b>added</b>.', ['Which number turns ' + t(a[i]) + ' into ' + t(-a[1 - i]) + '?'], 'negative multiplier');
  }
  function rA(e) { return term(e.a, 'x', true) + '=' + pol([[e.c, ''], [qn(e.b), 'y']]); }            // 3x = 14 − 2y
  function rB(e) { return term(e.b, 'y', true) + '=' + pol([[qn(e.a), 'x'], [e.c, '']]); }            // 5y = 4x − 11
  function rC(e) { return pol([[e.b, 'y'], [e.a, 'x']]) + '=' + qT(e.c); }                            // 2y − 5x = −16
  function rD(e) { return term(e.a, 'x', true) + '=' + pol([[qn(e.b), 'y'], [e.c, '']]); }            // 7x = 3y + 23
  function rE(e) { return pol([[e.a, 'x'], [qn(e.c), '']]) + '=' + term(qn(e.b), 'y', true); }        // 4x + 9 = 3y
  function rearrPart(S, fs) {
    var shown = S.Es.map(function (e, i) { return fs[i] ? fs[i](e) : eqT(e); }), T = { Es: S.Es, texs: shown, e: S.e, pre: ['Rearrange each equation to the form ' + t('ax+by=c') + ': ' + t(eqT(S.Es[0])) + ' and ' + t(eqT(S.Es[1])) + '.'] };
    return mulPart('Rewrite each equation as ' + t('ax+by=c') + ', then solve by elimination. Give the solution as an ordered pair.', T, { hints: ['Move every variable term to the left (each term changes sign as it crosses the equals sign) and the number to the right.', 'Then multiply so one variable’s coefficients match, and eliminate.'] });
  }
  function fracSysA(r) {   // x/p + y/q = c and x/u − y/v = d
    return gen(r, function (r) {
      var p = r.pick([2, 3, 4]), q = r.pick([2, 3, 4, 5]), u = r.pick([2, 3, 4]), v = r.pick([2, 3, 4]), c = r.int(2, 6), d = rnz(r, -3, 3);
      if (p === q || u === v) return null;
      var L1 = lcm(p, q), L2 = lcm(u, v), E1 = E(L1 / p, L1 / q, L1 * c), E2 = E(L2 / u, -L2 / v, L2 * d), s = solve2(E1, E2);
      if (!s || Q(s[0])[1] > 4 || Q(s[1])[1] > 4 || Math.abs(qv(s[0])) > 12 || Math.abs(qv(s[1])) > 12 || qv(s[0]) === 0 || qv(s[1]) === 0) return null;
      var S = { Es: [E1, E2], texs: ['\\dfrac{x}{' + p + '}+\\dfrac{y}{' + q + '}=' + c, '\\dfrac{x}{' + u + '}-\\dfrac{y}{' + v + '}=' + d], checkEs: [E(Q(1, p), Q(1, q), c), E(Q(1, u), Q(-1, v), d)],
        pre: ['Clear the fractions: first equation × ' + t(L1) + ': ' + t(eqT(E1)) + '; second equation × ' + t(L2) + ': ' + t(eqT(E2)) + '.'] };
      S.e = chooseE(S.Es); return S;
    }, function () { var S = { Es: [E(3, 2, 24), E(1, -2, -4)], texs: ['\\dfrac{x}{2}+\\dfrac{y}{3}=4', '\\dfrac{x}{4}-\\dfrac{y}{2}=-1'], checkEs: [E(Q(1, 2), Q(1, 3), 4), E(Q(1, 4), Q(-1, 2), -1)], pre: ['Clear the fractions: first equation × ' + t(6) + ': ' + t('3x+2y=24') + '; second equation × ' + t(4) + ': ' + t('x-2y=-4') + '.'] }; S.e = 1; return S; });
  }
  function decSys(r) {
    return gen(r, function (r) {
      var a = r.int(1, 6), b = r.int(2, 9), c = r.int(1, 6), d = -r.int(2, 9), x0 = rnz(r, -4, 6), y0 = rnz(r, -3, 6);
      if (a === c || Math.abs(b) === Math.abs(d) || !noDiv(a, c) && !noDiv(b, d) || a * d - b * c === 0) return null;
      var c1 = a * x0 + b * y0, c2 = c * x0 + d * y0; if (!c1 || !c2 || c1 % 10 === 0 || c2 % 10 === 0) return null;
      var E1 = E(a, b, c1), E2 = E(c, d, c2);
      var S = { Es: [E1, E2], texs: [dTerm(a, 'x', true) + dTerm(b, 'y') + '=' + dc(c1 / 10), dTerm(c, 'x', true) + dTerm(d, 'y') + '=' + dc(c2 / 10)], checkEs: [E(Q(a, 10), Q(b, 10), Q(c1, 10)), E(Q(c, 10), Q(d, 10), Q(c2, 10))], pre: ['Multiply both equations by ' + t('10') + ': ' + t(eqT(E1)) + ' and ' + t(eqT(E2)) + '.'] };
      S.e = chooseE(S.Es); return S;
    }, function () { var S = { Es: [E(2, 5, 29), E(3, -4, -14)], texs: ['0.2x+0.5y=2.9', '0.3x-0.4y=-1.4'], checkEs: [E(Q(1, 5), Q(1, 2), Q(29, 10)), E(Q(3, 10), Q(-2, 5), Q(-7, 5))], pre: ['Multiply both equations by ' + t('10') + ': ' + t('2x+5y=29') + ' and ' + t('3x-4y=-14') + '.'] }; S.e = chooseE(S.Es); return S; });
  }
  function sumDiffSys(r) {
    return gen(r, function (r) {
      var p = r.pick([2, 3, 4]), q = r.pick([2, 3, 4]), c = r.int(2, 7), d = r.int(1, 4), sm = p * c, df = q * d;
      if (sm <= df || (sm + df) % 2 === 0 && r.chance(0.6)) return null;
      var Es = [E(1, 1, sm), E(1, -1, df)], S = { Es: Es, texs: ['\\dfrac{x+y}{' + p + '}=' + c, '\\dfrac{x-y}{' + q + '}=' + d], checkEs: [E(Q(1, p), Q(1, p), c), E(Q(1, q), Q(-1, q), d)], pre: ['Clear the fractions: first equation × ' + t(p) + ': ' + t('x+y=' + sm) + '; second equation × ' + t(q) + ': ' + t('x-y=' + df) + '.'] };
      S.e = 1; return S;
    }, function () { var S = { Es: [E(1, 1, 10), E(1, -1, 3)], texs: ['\\dfrac{x+y}{2}=5', '\\dfrac{x-y}{3}=1'], checkEs: [E(Q(1, 2), Q(1, 2), 5), E(Q(1, 3), Q(-1, 3), 1)], pre: ['Clear the fractions: × ' + t(2) + ' and × ' + t(3) + ': ' + t('x+y=10') + ', ' + t('x-y=3') + '.'] }; S.e = 1; return S; });
  }
  function twoPoints(S) {
    var bs = S.base, on = function (P) { return near(qv(bs.a) * P[0] + qv(bs.b) * P[1], qv(bs.c)); }, keys = [];
    for (var x = -12; x <= 12 && keys.length < 6; x++) { var y = (qv(bs.c) - qv(bs.a) * x) / qv(bs.b); if (Number.isInteger(y)) keys.push([x, y]); }
    keys = keys.sort(function (p, q) { return Math.abs(p[0]) + Math.abs(p[1]) - Math.abs(q[0]) - Math.abs(q[1]); }).slice(0, 2);
    var chk = function (resp) {
      resp = resp || []; var Ps = [];
      for (var i = 0; i < 2; i++) { var rp = LN.readPoint(String(resp[i] || '')); if (rp.empty) return form('empty', 'Fill in both points.'); if (rp.bad || rp.kind !== 'pt') return form('pt-unreadable', 'Write each point as an ordered pair, e.g. ' + t('(1,\\ 2)') + '.'); Ps.push([rp.p[0].v, rp.p[1].v]); }
      for (var j = 0; j < 2; j++) if (!on(Ps[j])) return wrong('pts-not-on', 'Point ' + (j + 1) + ' doesn’t satisfy the equations. Pick an ' + t('x') + ' and solve ' + t(eqT(bs)) + ' for ' + t('y') + '.');
      if (near(Ps[0][0], Ps[1][0]) && near(Ps[0][1], Ps[1][1])) return form('pts-repeat', 'Give two <b>different</b> points.');
      return ok();
    };
    return { prompt: 'This system has infinitely many solutions. Give two different ordered pairs that satisfy it.' + sysD(S.texs), input: { type: 'fields', fields: [1, 2].map(function (i) { return { label: 'Point ' + i, mode: 'math', keys: 'pairs', placeholder: '(x, y)' }; }) }, check: chk,
      key: keys.map(ptK), answer: keys.map(function (P) { return t(ptT(P)); }).join(' and ') + ' (for example)',
      solution: 'Divide each equation by its common factor: both become ' + t(eqT(bs)) + ' — the same line in disguise, so every point on it is a solution. For example ' + keys.map(function (P) { return t(ptT(P)); }).join(' and ') + ': ' + keys.map(function (P) { return t(qv(bs.a) + nb(P[0]) + (qv(bs.b) < 0 ? '' : '+') + qv(bs.b) + nb(P[1]) + '=' + qT(bs.c)); }).join(', ') + ' ✓',
      hints: ['Divide each equation by its common factor — both become the same equation.', 'Choose a value of ' + t('x') + ' that makes ' + t('y') + ' a whole number.'], text: 'two points on the line', bad: [[ptK(keys[0]), ptK(keys[0])], ['(0,0)', '(1,1)']] };
  }
  function nrPartM(kind) {
    return function (r) {
      var Es, s, v;
      for (var g = 0; g < 900; g++) {
        Es = [E(r.int(2, 6), r.int(2, 5), r.int(5, 25)), E(r.int(2, 6), kind === 11 ? -r.int(2, 5) : r.int(2, 5), rnz(r, -5, 20))];
        if (kind === 12) Es[0] = E(qv(Es[0].a), -qv(Es[0].b), qv(Es[0].c));
        s = solve2(Es[0], Es[1]); if (!s || isInt(s[0]) || isInt(s[1]) || Q(s[0])[1] > 23 || !Es.every(okEq)) continue;
        if (!noDiv(qv(Es[0].a), qv(Es[1].a)) || !noDiv(qv(Es[0].b), qv(Es[1].b))) continue;
        v = kind === 11 ? qv(qa(s[0], s[1])) : qv(qs(qm(2, s[0]), s[1])); var f = v * 10 - Math.floor(v * 10);
        if (v < 0.2 || v > 99 || Math.abs(f - 0.5) < 0.1 || f < 0.06 || f > 0.94) continue;
        break;
      }
      if (g >= 900) { Es = kind === 11 ? [E(3, 2, 14), E(4, -3, 1)] : [E(5, -2, 8), E(2, 3, 17)]; s = solve2(Es[0], Es[1]); v = kind === 11 ? 97 / 17 : 47 / 19; }
      var texs = Es.map(function (e) { return eqT(e); }), what = kind === 11 ? 'x+y' : '2x-y', res = elimSolM(Es, chooseE(Es), {}), x = qv(s[0]), y = qv(s[1]);
      return B.approx('If ' + t(texs[0]) + ' and ' + t(texs[1]) + ', then the value of ' + t(what) + ', to the nearest tenth, is ________.', v, 1, { nr: true, diag: function (z) {
        if (near(z, K.roundTo(x, 1)) || near(z, K.roundTo(y, 1))) return { code: 'nr-one', hint: 'That’s just one of the values. Find both, then work out ' + t(what) + '.' };
        if (near(z, K.roundTo(kind === 11 ? x - y : x + y, 1))) return { code: 'nr-sum', hint: 'Check the combination: the question asks for ' + t(what) + '.' };
        return null;
      } }, res.html + '<br>' + t(what + '=' + qT(kind === 11 ? qa(s[0], s[1]) : qs(qm(2, s[0]), s[1])) + '\\approx ' + dc(Math.round(v * 1000) / 1000)) + ', which rounds to <b>' + K.roundTo(v, 1).toFixed(1) + '</b>.',
        ['Multiply both equations so one variable lines up, eliminate, and solve. The values are fractions — keep them exact.', 'Combine the fractions, then divide to round to the nearest tenth.'], 'NR ' + what);
    };
  }
})(window);
