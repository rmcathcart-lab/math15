/* Math 15 · Unit 8 · Lesson 4 — Solving Systems by Substitution, Part 2: Isolating a Variable First (RF9)
 * Assignment 4 (u8_L04.tex, Questions 1–14) and the Lesson 4 Extra Practice (u8_EP04.tex, Questions 1–17).
 * Every part is a generator: same structure, idea and difficulty as the booklet question (where the ±1 coefficient
 * sits, its sign, fractions or not, the kind of answer), new numbers from the seed; the booklet's own numbers are among
 * the possible versions where practical. No calculator: integer solutions unless the booklet item has fractions.
 * Model: Math 10C u8l2.js (substitution: subSol worked solutions, point entry with no-solution / infinitely-many keys,
 * system entry, collapse explanations, error analysis).
 * Conversions: "state which variable you would isolate" -> multiple choice; "solve by isolating first" -> Step 1 typed
 * as "variable = expression" (checked for sign slips) and then the ordered pair; "explain / compare / name the error"
 * -> multiple choice whose options are reasons; word problems -> the system (equation boxes), then the values.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Q13 (three unknowns), Extra 11(b i) (k and c for infinitely
 * many solutions), Extra 16 (solve in terms of a). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, LN = HW.lines, ex = HW.ex;

  HW.addCodes({
    'rearr-sign': 'Sign not changed when moving a term across =', 'u8-neg': 'Sign slip dividing by −1 (or a negative)', 'u8-clear-frac': 'Cleared fractions in only some terms',
    'clear-one-side': 'Cleared fractions/decimals on one side only', 'clear-bracket': 'Bracket not multiplied out correctly when clearing', 'pt-fraction': 'Exact answer given as a decimal',
    'sub-swap': 'Substituted the point’s coordinates into the wrong letters', 'nr-sum': 'Combined the values the wrong way (sum vs difference)', 'nr-one': 'Gave one unknown instead of the combination',
    'z-wrong': 'Three unknowns: a value wrong', 'xy-right-z': 'Three unknowns: one value wrong', 'swap-answer': 'Right numbers in the wrong boxes', 'one-value': 'One value right, the other wrong',
    'diff-order': 'Difference subtracted in the wrong order', 'coef-swap': 'Coefficients attached to the wrong variables', 'sum-diff': 'Sum written as a difference', 'more-than-flip': '“More than” put on the wrong quantity',
    'u8-count-swap': 'Ticket counts swapped', 'u8-price-swap': 'Prices matched to the wrong tickets', 'perim-half': 'Perimeter: used l + w instead of 2l + 2w', 'digits-diff': 'Reversal changes the number by 9 × (difference), not the difference',
    'rev-direction': '“More / less” reversed in the digit equation', 'digits-reversed': 'Gave the reversed number', 'units-mix': 'Mixed cents and dollars in one equation', 'count-value': 'Count and value mixed up',
    'value-swap': 'Values attached to the wrong items', 'mix-total': 'Mixture: total not used', 'mix-swap': 'Mixture: amounts swapped', 'mix-pct': 'Mixture: percent not used correctly',
    'u8l4-iso': 'Isolated the variable incorrectly', 'u8l4-iso-form': 'Isolation not written as “variable = expression”', 'u8l4-iso-choice': 'Isolated a variable that makes a fraction',
    'u8l4-back-sign': 'Sign slip solving for the unknown constant', 'u8l4-dist': 'Bracket not multiplied out to every term', 'u8l4-param': 'Conditions on k and c wrong', 'u8l4-a-expr': 'Expression in a wrong',
    'u8l4-not-cleared': 'Fractions or decimals not fully cleared', 'u8l4-devon-sum': 'Value of the left side wrong'
  });
  HW.addPartial({ 'u8l4-iso': 'n', 'u8l4-back-sign': 's', 'u8l4-dist': 'b', 'u8l4-param': 'n', 'u8l4-a-expr': 'n', 'u8l4-devon-sum': 'b' });

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

  /* ---------------- the worked solution: isolate, substitute, solve, back-substitute, check ---------------- */
  function pickIso(Es) {
    var best = null, bs = 1e9;
    for (var i = 0; i < 2; i++) for (var v = 0; v < 2; v++) {
      var c = Q(co(Es[i], v)); if (!c[0]) continue;
      var s = (Math.abs(c[0]) === 1 && c[1] === 1 ? 0 : c[1] === 1 ? Math.abs(c[0]) : 50 + Math.abs(c[0]) * c[1]) + (c[0] < 0 ? 0.5 : 0);
      if (s < bs) { bs = s; best = [i, v]; }
    }
    return best;
  }
  function chkLine(e, V, p) { var a = cB(e.a, qT(p[0]), true); return t(a + cB(e.b, qT(p[1]), !a) + '=' + qT(e.c)) + '&nbsp;✓'; }
  function isoExpr(e, v, V) {   // "x = …" right side for isolating V[v] in e
    var w = 1 - v, al = qd(qn(co(e, w)), co(e, v)), be = qd(e.c, co(e, v));
    return qv(al) < 0 && qv(be) > 0 ? pol([[be, ''], [al, V[w]]]) : pol([[al, V[w]], [be, '']]);
  }
  function subSol(Es, o) {
    o = o || {};
    var V = o.vars || ['x', 'y'], iso = o.iso || pickIso(Es), i = iso[0], v = iso[1], w = 1 - v, j = 1 - i;
    var e = Es[i], O = Es[j], cv = co(e, v), cw = co(e, w), al = qd(qn(cw), cv), be = qd(e.c, cv), ov = co(O, v), ow = co(O, w);
    var nm = o.names || ['the first equation', 'the second equation'], out = (o.pre || []).slice();
    var cFirst = qv(al) < 0 && qv(be) > 0, exT = cFirst ? pol([[be, ''], [al, V[w]]]) : pol([[al, V[w]], [be, '']]);
    var mid = qv(cv) === 1 ? '' : t(term(cv, V[v], true) + '=' + pol([[qn(cw), V[w]], [e.c, '']])) + ', so ';
    out.push('<b>Step 1:</b> isolate ' + t(V[v]) + ' in ' + nm[i] + ', ' + t(eqT(e, V)) + ': ' + mid + t(V[v] + '=' + exT));
    var subT = v === 0 ? cB(ov, exT, true) + term(ow, V[w], false) : (term(ow, V[w], true) + cB(ov, exT, !qv(ow)));
    out.push('<b>Step 2:</b> substitute into ' + nm[j] + ', ' + t(eqT(O, V)) + ': ' + t(subT + '=' + qT(O.c)));
    var k = qa(qm(ov, al), ow), m = qm(ov, be);
    var expT = v === 0 ? pol([[qm(ov, al), V[w]], [m, ''], [ow, V[w]]]) : pol([[ow, V[w]], [qm(ov, al), V[w]], [m, '']]);
    var s3 = '<b>Step 3:</b> expand: ' + t(expT + '=' + qT(O.c));
    if (qv(k) === 0) {
      var tr = qv(m) === qv(O.c);
      out.push(s3 + '. Both variables cancel, leaving ' + t(qT(m) + '=' + qT(O.c)) + (tr ? ', which is <b>always true</b>.' : ', which is <b>never true</b>.'));
      out.push(tr ? 'So the system has <b>infinitely many solutions</b>: the two equations describe the <b>same line</b>.' : 'So the system has <b>no solution</b>: the lines are <b>parallel</b> (same slope, different intercepts) and never meet.');
      return { html: out.join('<br>'), kind: tr ? 'inf' : 'none' };
    }
    var den = [k, m, O.c].reduce(function (d, z) { return lcm(d, Q(z)[1]); }, 1), rhs = qs(O.c, m), w0 = qd(rhs, k);
    if (den > 1) s3 += '<br>Multiply every term by ' + t(den) + ' to clear the fractions: ' + t(pol([[qm(k, den), V[w]], [qm(m, den), '']]) + '=' + qT(qm(O.c, den)));
    else if (pol([[k, V[w]], [m, '']]) !== expT) s3 += ', so ' + t(pol([[k, V[w]], [m, '']]) + '=' + qT(O.c));
    s3 += '<br>' + t(term(qm(k, den), V[w], true) + '=' + qT(qm(rhs, den))) + ', so ' + t(V[w] + '=' + qT(w0));
    out.push(s3);
    var v0 = qa(qm(al, w0), be), back = !qv(al) ? qT(be) : cFirst ? qT(be) + cB(al, qT(w0), false) : cB(al, qT(w0), true) + (qv(be) ? (qv(be) < 0 ? '-' : '+') + qT([Math.abs(Q(be)[0]), Q(be)[1]]) : '');
    out.push('<b>Step 4:</b> back-substitute: ' + t(V[v] + '=' + back + '=' + qT(v0)));
    var sol = v === 0 ? [v0, w0] : [w0, v0];
    out.push('Solution: ' + t('(' + V[0] + ',\\ ' + V[1] + ')=' + ptT(sol)));
    if (o.check !== false) out.push('<b>Step 5:</b> check in both original equations: ' + (o.checkEs || Es).map(function (z) { return chkLine(z, V, sol); }).join('&nbsp;&nbsp; '));
    return { html: out.join('<br>'), sol: sol, kind: null };
  }

  /* ---------------- answer parts ---------------- */
  var SUBHINTS = ['Isolate a variable whose coefficient is ' + t('1') + ' or ' + t('-1') + ', substitute that expression (in brackets) into the <b>other</b> equation, solve, then back-substitute.', 'Check your answer in <b>both</b> original equations.'];
  function decOnly(chk) {
    return function (resp) { var r = chk(resp); if (r.v === 'correct' && /\d\.\d/.test(String(resp))) return form('pt-fraction', 'Right values — but give <b>exact</b> values: write them as fractions, not decimals.'); return r; };
  }
  function ptPart(prompt, S, res, hints, text, o) {
    o = o || {};
    var V = S.V || ['x', 'y'], target = res.kind || res.sol;
    var p = B.point(prompt, target, { vars: V, system: (o.sysEs || S.Es).map(sysA), wrong: o.wrong }, res.html, hints || SUBHINTS, text);
    if (!res.kind && (!isInt(res.sol[0]) || !isInt(res.sol[1]))) p.check = decOnly(p.check);
    var bad = [];
    if (!res.kind) {
      var s = res.sol;
      if (qv(s[0]) !== qv(s[1])) bad.push(ptK([s[1], s[0]]));
      if (qv(s[1]) !== 0) bad.push(ptK([s[0], qn(s[1])]));
      bad.push('\\text{no solution}');
      p.good = [V[0] + '=' + qT(s[0]) + ', ' + V[1] + '=' + qT(s[1]), V[1] + '=' + qT(s[1]) + ', ' + V[0] + '=' + qT(s[0])];
    } else bad.push(res.kind === 'none' ? '\\text{infinitely many}' : '\\text{no solution}', '(0, 0)');
    p.bad = bad.concat(o.bad || []);
    return p;
  }
  function solvePart(prompt, S, hints, text, o) {
    o = o || {};
    var res = subSol(S.Es, { vars: S.V, pre: S.pre, iso: S.iso, checkEs: S.checkEs, names: S.names });
    return ptPart(prompt + sysD(S.texs), S, res, hints, text || ('solve ' + S.texs.join(' ; ')), o);
  }
  function mc(r, prompt, opts, sol, hints, text, keep) { return B.mc(r, prompt, opts, sol, hints || [], text, keep); }
  function gen(r, maker, book) { for (var g = 0; g < 800; g++) { var S = maker(r); if (S) return S; } return book(); }
  function mkS(Es, iso, V) { return { texs: Es.map(function (e) { return eqT(e, V); }), Es: Es, iso: iso || pickIso(Es), V: V }; }
  function okEq(e) { return qv(e.c) !== 0 && gcd(gcd(e.a[0], e.b[0]), e.c[0]) === 1; }
  function bookS(b, iso) { var Es = [E(b[0], b[1], b[2]), E(b[3], b[4], b[5])]; return mkS(Es, iso); }

  /* a random system with an integer solution. ones: [[eq, var, ±1], …] are the only ±1 coefficients; the rest have
     size o.mag; x-coefficients are positive unless o.negX. o.iso: what the worked solution isolates. */
  function sysGen(r, ones, o, book) {
    o = o || {}; var mag = o.mag || [2, 5], xr = o.xr || [1, 5], yr = o.yr || [-4, 4];
    return gen(r, function (r) {
      var C = [[0, 0], [0, 0]];
      for (var i = 0; i < 2; i++) for (var v = 0; v < 2; v++) {
        var one = ones.filter(function (z) { return z[0] === i && z[1] === v; })[0];
        C[i][v] = one ? one[2] : r.int(mag[0], mag[1]) * (v === 1 || (o.negX && r.chance(0.4)) ? sgn(r) : 1);
      }
      if (C[0][0] * C[1][1] - C[0][1] * C[1][0] === 0) return null;
      var x0 = rnz(r, xr[0], xr[1]), y0 = rnz(r, yr[0], yr[1]);
      var Es = [E(C[0][0], C[0][1], C[0][0] * x0 + C[0][1] * y0), E(C[1][0], C[1][1], C[1][0] * x0 + C[1][1] * y0)];
      if (!Es.every(okEq)) return null;
      if (o.test && !o.test(C, x0, y0, Es)) return null;
      return mkS(Es, o.iso || (ones[0] ? [ones[0][0], ones[0][1]] : null));
    }, function () { return bookS(book, o.iso || (ones[0] ? [ones[0][0], ones[0][1]] : null)); });
  }
  /* a system with a fractional (non-integer) solution, small denominators */
  function fracSys(r, ones, o, book) {
    o = o || {}; var mag = o.mag || [2, 5];
    return gen(r, function (r) {
      var C = [[0, 0], [0, 0]];
      for (var i = 0; i < 2; i++) for (var v = 0; v < 2; v++) {
        var one = ones.filter(function (z) { return z[0] === i && z[1] === v; })[0];
        C[i][v] = one ? one[2] : r.int(mag[0], mag[1]) * (v === 1 ? sgn(r) : 1);
      }
      if (o.fix) o.fix(C, r);
      var Es = [E(C[0][0], C[0][1], rnz(r, -9, 9)), E(C[1][0], C[1][1], rnz(r, -9, 9))], s = solve2(Es[0], Es[1]);
      if (!s || !Es.every(okEq)) return null;
      if (o.bothFrac ? (isInt(s[0]) || isInt(s[1])) : (isInt(s[0]) && isInt(s[1]))) return null;
      if (Q(s[0])[1] > (o.maxDen || 16) || Q(s[1])[1] > (o.maxDen || 16) || Math.abs(qv(s[0])) > 4 || Math.abs(qv(s[1])) > 4) return null;
      if (o.test && !o.test(C, s, Es)) return null;
      return mkS(Es, o.iso || (ones[0] ? [ones[0][0], ones[0][1]] : null));
    }, function () { return bookS(book, o.iso || (ones[0] ? [ones[0][0], ones[0][1]] : null)); });
  }

  /* ---------------- Step 1 typed as "variable = expression" ---------------- */
  function bareVar(a) { while (a && a.t === 'paren') a = a.a; return a && a.t === 'var' ? a.n : null; }
  var TESTW = [-3, -1, 0, 2, 5];
  function readIso(s, V) {
    s = String(s == null ? '' : s).replace(/\\left|\\right/g, '').trim();
    if (!s) return { res: form('empty', 'Type your equation first.') };
    var sides = s.split('='); if (sides.length !== 2) return { res: form('u8l4-iso-form', 'Write one equation with the isolated variable on one side, e.g. ' + t(V[0] + '=5-2' + V[1]) + '.') };
    var L = ex.parse(sides[0]), R = ex.parse(sides[1]);
    if (!L.ok || !R.ok) return { res: form('unreadable', 'I can’t read that equation. Check the brackets and signs.') };
    var n = bareVar(L.ast), side = R.ast;
    if (!n || V.indexOf(n) < 0) { var n2 = bareVar(R.ast); if (n2 && V.indexOf(n2) >= 0) { n = n2; side = L.ast; } else n = null; }
    if (!n) return { res: form('u8l4-iso-form', 'Get one variable completely by itself on one side: ' + t(V[0] + '=\\ldots') + ' or ' + t(V[1] + '=\\ldots') + '.') };
    var m = V[1 - V.indexOf(n)], env = function (k, nv) { var o = {}; o[m] = k; if (nv != null) o[n] = nv; return o; };
    if (TESTW.some(function (k) { var a = ex.value(side, env(k, 1)), b = ex.value(side, env(k, 2)); return isFinite(a) && isFinite(b) && Math.abs(a - b) > 1e-9; })) return { res: form('u8l4-iso-form', t(n) + ' must not appear on the other side as well — get it completely by itself.') };
    var vals = TESTW.map(function (k) { return ex.value(side, env(k, 0)); });
    if (vals.some(function (x) { return !isFinite(x); })) return { res: form('unreadable', 'Use only the letters ' + t(V[0]) + ' and ' + t(V[1]) + '.') };
    var B0 = ex.value(side, env(0, 0)), A0 = ex.value(side, env(1, 0)) - B0;
    if (!TESTW.every(function (k, i) { return near(vals[i], A0 * k + B0); })) return { res: wrong('u8l4-iso', 'The other side should be a simple expression like ' + t('5-2' + m) + '.') };
    return { n: n, m: m, A: A0, B: B0 };
  }
  function isoCheck(S, allowed, V) {
    var lines = S.Es.map(sysA);
    return function (resp) {
      var R = readIso(resp, V); if (R.res) return R.res;
      var v = V.indexOf(R.n), L = v === 0 ? [1, -R.A, -R.B] : [-R.A, 1, -R.B];
      for (var j = 0; j < allowed.length; j++) if (allowed[j][1] === v && LN.same(L, lines[allowed[j][0]])) return ok();
      for (var i = 0; i < 2; i++) if (LN.same(L, lines[i])) return form('u8l4-iso-choice', 'That rearrangement is correct — but ' + t(R.n) + ' has coefficient ' + t(qT(co(S.Es[i], v))) + ' in ' + t(S.texs[i]) + ', so it makes a fraction. Isolate a variable whose coefficient is ' + t('1') + ' or ' + t('-1') + '.');
      var tg = allowed.filter(function (z) { return z[1] === v; })[0];
      if (!tg) return wrong('u8l4-iso', 'Look for the variable whose coefficient is ' + t('1') + ' or ' + t('-1') + ' — that is the one to isolate.');
      var e = S.Es[tg[0]], w = 1 - v, cv = qv(co(e, v)), al = qv(qd(qn(co(e, w)), co(e, v))), be = qv(qd(e.c, co(e, v)));
      var sA = near(R.A, -al), sB = near(R.B, -be), eA = near(R.A, al), eB = near(R.B, be);
      if (cv === -1 && ((sA && sB) || (sA && eB) || (eA && sB))) return wrong('u8-neg', 'From ' + t(eqT(e, V)) + ': ' + t(term(co(e, v), V[v], true) + '=' + pol([[qn(co(e, w)), V[w]], [e.c, '']])) + '. Now divide <b>every</b> term by ' + t('-1') + ' — every sign changes.');
      if (cv === 1 && ((sA && eB) || (eA && sB) || (sA && sB))) return wrong('rearr-sign', 'A term changes sign when it moves to the other side of the equals sign. Check the signs on the right side.');
      return wrong('u8l4-iso', null);
    };
  }
  function isoPart(S, allowed, o) {
    o = o || {}; var V = S.V || ['x', 'y'], a0 = allowed[0], e = S.Es[a0[0]], v = a0[1], w = 1 - v, cv = qv(co(e, v));
    var keyT = V[v] + '=' + isoExpr(e, v, V), mid = term(co(e, v), V[v], true) + '=' + pol([[qn(co(e, w)), V[w]], [e.c, '']]);
    var sol = 'In ' + t(S.texs[a0[0]]) + ' the coefficient of ' + t(V[v]) + ' is ' + t(qT(co(e, v))) + ', so isolating it makes no fraction.<br>' +
      (cv === -1 ? 'Move the ' + t(V[w]) + '-term across (its sign changes): ' + t(mid) + '. Then divide <b>every</b> term by ' + t('-1') + ' — every sign changes: ' + t(keyT) + '.'
        : 'Move the ' + t(V[w]) + '-term to the other side, changing its sign: ' + t(keyT) + '.');
    allowed.slice(1).forEach(function (z) { sol += '<br>Isolating ' + t(V[z[1]]) + ' in ' + t(S.texs[z[0]]) + ' also works: ' + t(V[z[1]] + '=' + isoExpr(S.Es[z[0]], z[1], V)) + '.'; });
    var p = B.math((o.prompt || '<b>Step 1 — isolate.</b> Find the variable whose coefficient is ' + t('1') + ' or ' + t('-1') + ' and get it by itself. Type the result as “variable = expression”.') + sysD(S.texs), isoCheck(S, allowed, V), keyT, sol,
      o.hints || ['Find the coefficient that is ' + t('1') + ' or ' + t('-1') + '. Move the other term to the right side (its sign changes).', 'If the coefficient is ' + t('-1') + ', finish by changing the sign of <b>every</b> term.'], o.text || 'isolate', { keys: 'eq', vars: V, placeholder: 'e.g. ' + V[0] + ' = 5 - 2' + V[1] });
    var al = qd(qn(co(e, w)), co(e, v)), be = qd(e.c, co(e, v));
    p.bad = [V[v] + '=' + pol([[qn(al), V[w]], [cv === -1 ? qn(be) : be, '']])];
    if (qv(be)) p.bad.push(V[v] + '=' + pol([[al, V[w]], [qn(be), '']]));
    return p;
  }
  /* which variable / equation to isolate (multiple choice) */
  function isoMC(r, S, right, o) {
    o = o || {}; var V = ['x', 'y'], opts = [], cR = co(S.Es[right[0]], right[1]), unit = Math.abs(qv(cR)) === 1;
    for (var i = 0; i < 2; i++) for (var v = 0; v < 2; v++) {
      var c = co(S.Es[i], v), isR = right[0] === i && right[1] === v, ab = Math.abs(qv(c));
      opts.push({ html: 'Isolate ' + t(V[v]) + ' in ' + t(S.texs[i]), right: isR, code: 'iso' + i + v,
        why: isR ? null : ab === 1 ? 'That coefficient is ' + t(qT(c)) + ' too — but it is not the best choice here. Compare the coefficients again.' : 'The coefficient of ' + t(V[v]) + ' there is ' + t(qT(c)) + ', so isolating ' + t(V[v]) + ' means dividing by ' + t(ab) + (unit ? ' — a fraction. Look for a coefficient of ' + t('1') + ' or ' + t('-1') + '.' : '. Is there a smaller coefficient anywhere in the system?') });
    }
    var e = S.Es[right[0]], keyT = V[right[1]] + '=' + isoExpr(e, right[1], V);
    var sol = unit ? 'In ' + t(S.texs[right[0]]) + ' the coefficient of ' + t(V[right[1]]) + ' is ' + t(qT(cR)) + ', so isolating it needs no division' + (qv(cR) === -1 ? ' (just change every sign)' : '') + ': ' + t(keyT) + '. Every other choice divides by a number bigger than ' + t('1') + ' and makes a fraction.'
      : 'No coefficient is ' + t('1') + ' or ' + t('-1') + ', so a fraction can’t be avoided. The smallest coefficient in the system is ' + t(qT(cR)) + ' (on ' + t(V[right[1]]) + ' in ' + t(S.texs[right[0]]) + '), so isolating it divides by the smallest number: ' + t(keyT) + '.';
    return mc(r, (o.prompt || 'Which variable, in which equation, should you isolate first to avoid fractions? (Don’t solve.)') + sysD(S.texs), opts, sol,
      [unit ? 'Look at all four coefficients. Which one is ' + t('1') + ' or ' + t('-1') + '?' : 'No coefficient is ' + t('\\pm1') + '. Which coefficient is the smallest (ignoring its sign)?'], o.text || 'which variable to isolate');
  }
  /* explain a collapsed substitution */
  function collapseStmt(S) { var Es = S.Es, iso = S.iso || pickIso(Es), i = iso[0], v = iso[1], j = 1 - i, e = Es[i], O = Es[j]; var m = qm(co(O, v), qd(e.c, co(e, v))); return qT(m) + '=' + qT(O.c); }
  function mcCollapse(r, kind, S) {
    var V = S.V || ['x', 'y'], inf = kind === 'inf', W = V[1 - (S.iso || pickIso(S.Es))[1]], stmt = collapseStmt(S);
    var opts = [
      { html: 'Both variables cancel and ' + t(stmt) + ' is ' + (inf ? 'always true: the equations describe the <b>same line</b>, so there are <b>infinitely many</b> solutions.' : 'never true: the lines are <b>parallel</b>, so there is <b>no solution</b>.'), right: true },
      { html: 'Both variables cancel and ' + t(stmt) + ' is ' + (inf ? 'never true: the lines are parallel, so there is no solution.' : 'always true: the equations describe the same line, so there are infinitely many solutions.'), why: inf ? 'Look again: is ' + t(stmt) + ' a true statement? A true statement means every point on the line works.' : 'Look again: is ' + t(stmt) + ' a true statement? A false statement means no point can work.', code: 'flip' },
      { html: 'The answer is ' + t(W + '=' + stmt.split('=')[0]) + ', so there is exactly one solution.', why: 'The number left over isn’t a value of ' + t(W) + ' — the ' + t(W) + '-terms cancelled, so nothing is left to solve for.', code: 'one' },
      { html: 'Both variables cancelled, which means an algebra mistake was made — start again.', why: 'Cancelling is not a mistake: it is the signal that the two lines have the same slope.', code: 'error' }];
    return mc(r, 'When you solve this system by substitution, what happens, and what does it tell you?' + sysD(S.texs), opts,
      subSol(S.Es, { vars: V, iso: S.iso }).html + '<br>' + (inf ? 'Same slope and same intercept: the graphs are the same line.' : 'Same slope, different intercepts: the graphs are parallel lines.'),
      ['Substitute and simplify. If both variables disappear, ask: is the number statement left over true or false?'], 'explain collapse');
  }
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

  /* ---------------- shared makers ---------------- */
  function q1sys(r, which) {   // Q1: exactly one ±1 coefficient; constants free (the system is not solved)
    var spec = { a: [0, 1, 1], b: [0, 0, 1], c: [1, 0, 1], d: [0, 1, -1] }[which], book = { a: [3, 1, 7, 2, -5, 4], b: [1, -4, 9, 3, 2, 5], c: [5, 2, 11, 1, 3, -2], d: [2, -1, 6, 4, 3, 1] }[which];
    return gen(r, function (r) {
      var C = [[r.int(2, 5), r.int(2, 5) * sgn(r)], [r.int(2, 5), r.int(2, 5) * sgn(r)]]; C[spec[0]][spec[1]] = spec[2];
      if (C[0][0] * C[1][1] - C[0][1] * C[1][0] === 0) return null;
      var Es = [E(C[0][0], C[0][1], rnz(r, -12, 15)), E(C[1][0], C[1][1], rnz(r, -12, 15))];
      return Es.every(okEq) ? mkS(Es, [spec[0], spec[1]]) : null;
    }, function () { return bookS(book, [spec[0], spec[1]]); });
  }
  function nrSys(r, kind) {   // Q11: a x + y = c, p x − q y = d, ask x + y.   Q12: x − p y = c, q x + y = d, ask x − y.
    for (var g = 0; g < 900; g++) {
      var Es;
      if (kind === 11) Es = [E(r.int(2, 4), 1, r.int(2, 12)), E(r.int(2, 5), -r.int(2, 5), rnz(r, -6, 9))];
      else Es = [E(1, -r.int(2, 4), rnz(r, -6, 6)), E(r.int(2, 5), 1, r.int(5, 24))];
      var s = solve2(Es[0], Es[1]); if (!s || !Es.every(okEq) || isInt(s[0]) || isInt(s[1]) || Q(s[0])[1] > 17) continue;
      var v = kind === 11 ? qv(qa(s[0], s[1])) : qv(qs(s[0], s[1])), f = v * 10 - Math.floor(v * 10);
      if (v < 0.2 || v > 99 || Math.abs(f - 0.5) < 0.1 || f < 0.06 || f > 0.94) continue;
      return { Es: Es, s: s, v: v, texs: Es.map(function (e) { return eqT(e); }) };
    }
    return kind === 11 ? { Es: [E(2, 1, 9), E(3, -4, 1)], s: [Q(37, 11), Q(25, 11)], v: 62 / 11, texs: ['2x+y=9', '3x-4y=1'] } : { Es: [E(1, -3, -2), E(4, 1, 21)], s: [Q(61, 13), Q(29, 13)], v: 32 / 13, texs: ['x-3y=-2', '4x+y=21'] };
  }
  function nrPart(kind) {
    return function (r) {
      var S = nrSys(r, kind), plus = kind === 11, want = K.roundTo(S.v, 1), x = qv(S.s[0]), y = qv(S.s[1]), what = plus ? 'x+y' : 'x-y';
      var res = subSol(S.Es, {});
      return B.approx('If ' + t(S.texs[0]) + ' and ' + t(S.texs[1]) + ', then ' + t(what) + ', to the nearest tenth, is ________.', S.v, 1, { nr: true, diag: function (z) {
        if (near(z, K.roundTo(plus ? x - y : x + y, 1))) return { code: 'nr-sum', hint: 'That’s ' + t(plus ? 'x-y' : 'x+y') + '. The question asks for ' + t(what) + '.' };
        if (near(z, K.roundTo(x, 1)) || near(z, K.roundTo(y, 1))) return { code: 'nr-one', hint: 'That’s just one of the values. Find both ' + t('x') + ' and ' + t('y') + ', then ' + (plus ? 'add' : 'subtract') + '.' };
        return null;
      } }, res.html + '<br>' + t(what + '=' + qT(plus ? qa(S.s[0], S.s[1]) : qs(S.s[0], S.s[1])) + '\\approx ' + dc(Math.round(S.v * 1000) / 1000)) + ', which rounds to <b>' + want.toFixed(1) + '</b>.',
        ['Isolate the variable with coefficient ' + t('1') + ', substitute and solve. The values are fractions — keep them as fractions.', (plus ? 'Add' : 'Subtract') + ' the fractions, then divide to round to the nearest tenth.'], 'NR ' + what);
    };
  }

  /* ======================================================================================================== */
  HW.defineLesson({
    id: 'u8l4', unit: 8, num: '4', title: 'Solving Systems by Substitution, Part 2: Isolating a Variable First', outcome: 'RF9',
    blurb: 'When neither equation is solved for a variable, isolate one yourself — the one with a coefficient of 1 or −1 — then substitute.',
    questions: [
      { num: '1', section: 'Part A — Choosing a Variable and Solving', stem: 'State which variable you would isolate, and in which equation, to avoid fractions. Do not solve.',
        shared: function (r) { return { a: q1sys(r, 'a'), b: q1sys(r, 'b'), c: q1sys(r, 'c'), d: q1sys(r, 'd') }; },
        parts: ['a', 'b', 'c', 'd'].map(function (L) { return { id: '1' + L, level: 'BEG', make: function (r, sh) { return isoMC(r, sh[L], sh[L].iso); } }; }) },
      { num: '2', stem: 'Solve each system completely by isolating a variable first. Check your solution.',
        shared: function (r) {
          return { a: sysGen(r, [[0, 0, 1]], {}, [1, 4, 15, 3, -2, 3]), b: sysGen(r, [[0, 1, -1]], {}, [2, -1, 9, 3, 5, 7]),
            c: sysGen(r, [[0, 0, 1]], {}, [1, -5, 13, 4, 3, 6]), d: sysGen(r, [[0, 1, 1]], {}, [5, 1, 2, 2, -3, 11]) };
        },
        parts: ['a', 'b', 'c', 'd'].reduce(function (acc, L) {
          acc.push({ id: '2' + L + 'i', sub: L + ' i', level: 'BEG', make: function (r, sh) { return isoPart(sh[L], [sh[L].iso]); } });
          acc.push({ id: '2' + L + 'ii', sub: L + ' ii', level: 'BEG', make: function (r, sh) { return solvePart('<b>Steps 2–5.</b> Substitute, solve, back-substitute and check. Give the solution as an ordered pair.', sh[L]); } });
          return acc;
        }, []) },
      { num: '3', stem: 'Solve each system completely. In each one the variable you isolate has a coefficient of −1 — watch your signs.',
        shared: function (r) {
          var pos = function () { return r.pick([[0, 1, -1], [0, 1, -1], [1, 1, -1], [0, 0, -1]]); };
          return { a: sysGen(r, [pos()], {}, [3, -1, 11, 2, 5, 13]), b: sysGen(r, [pos()], {}, [5, -1, 7, 3, 4, 18]), c: sysGen(r, [pos()], {}, [2, -1, 7, 4, 3, 9]) };
        },
        parts: ['a', 'b', 'c'].reduce(function (acc, L) {
          acc.push({ id: '3' + L + 'i', sub: L + ' i', level: 'EMG', make: function (r, sh) { return isoPart(sh[L], [sh[L].iso], { prompt: '<b>Step 1 — isolate.</b> The variable to isolate has a coefficient of ' + t('-1') + '. Get it by itself and type the result as “variable = expression”.' }); } });
          acc.push({ id: '3' + L + 'ii', sub: L + ' ii', level: 'EMG', make: function (r, sh) { return solvePart('<b>Steps 2–5.</b> Substitute, solve, back-substitute and check. Give the solution as an ordered pair.', sh[L], ['Use your Step 1 expression, in brackets, in the <b>other</b> equation.', 'Check your answer in <b>both</b> original equations.']); } });
          return acc;
        }, []) },
      { num: '4', stem: 'In each system both variables have a coefficient of 1 or −1 somewhere, so either choice is reasonable. Solve, then check in both original equations.', parts: [
        { id: '4a', level: 'EMG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [[0, 0, 1], [1, 1, -1]], { iso: [0, 0] }, [1, 2, 7, 4, -1, 10])); } },
        { id: '4b', level: 'EMG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [[0, 1, 1], [1, 0, 1]], { iso: [1, 0] }, [2, 1, 9, 1, -3, 1])); } }] },
      { num: '5', stem: 'Solve each system completely. No coefficient is 1 or −1, so isolating creates a fraction partway through — carry it carefully and it resolves to a whole number.',
        shared: function (r) { return sysGen(r, [], { iso: [0, 0], xr: [1, 4], yr: [1, 4], test: function (C) { return (C[0][0] === 2 || C[0][0] === 3) && Math.abs(C[1][0]) % C[0][0] !== 0 && Math.abs(C[0][0]) <= Math.min(Math.abs(C[0][1]), Math.abs(C[1][0]), Math.abs(C[1][1])); } }, [2, 5, 16, 3, -2, 5]); },
        parts: [
          { id: '5ai', sub: 'a i', level: 'PRG', make: function (r, S) {
            var e = S.Es[0], O = S.Es[1], cv = qv(e.a), b1 = qv(e.b), c1 = qv(e.c), ov = qv(O.a), ow = qv(O.b), oc = qv(O.c), s0 = solve2(e, O), x0 = qv(s0[0]), y0 = qv(s0[1]);
            var N = pol([[c1, ''], [-b1, 'y']]), frac = '\\frac{' + N + '}{' + cv + '}';
            var right = ov + '(' + N + ')' + term(ow * cv, 'y', false) + '=' + oc * cv;
            return mc(r, 'Isolating ' + t('x') + ' in ' + t(S.texs[0]) + ' gives ' + t('x=' + frac) + '. You substitute it into ' + t(S.texs[1]) + ' and multiply <b>every</b> term by ' + t(cv) + ' to clear the fraction. Which equation do you get?' + sysD(S.texs), [
              { html: t(right), right: true },
              { html: t(ov + '(' + N + ')' + term(ow, 'y', false) + '=' + oc * cv), why: 'Every term is multiplied by ' + t(cv) + ' — the ' + t(term(ow, 'y', true)) + ' term too.', code: 'u8-clear-frac' },
              { html: t(ov + '(' + N + ')' + term(ow * cv, 'y', false) + '=' + oc), why: 'The right side must be multiplied by ' + t(cv) + ' as well.', code: 'clear-one-side' },
              { html: t(pol([[ov * c1, ''], [-b1, 'y'], [ow * cv, 'y']]) + '=' + oc * cv), why: 'The ' + t(ov) + ' multiplies the <b>whole</b> numerator ' + t('(' + N + ')') + ', not just its first term.', code: 'clear-bracket' }],
              'Substitute: ' + t(ov + '\\left(' + frac + '\\right)' + term(ow, 'y', false) + '=' + oc) + '.<br>Multiply every term by ' + t(cv) + ': ' + t(right) + '.<br>Expand: ' + t(pol([[ov * c1, ''], [-ov * b1, 'y'], [ow * cv, 'y']]) + '=' + oc * cv) + ', so ' + t(term(ow * cv - ov * b1, 'y', true) + '=' + (oc * cv - ov * c1)) + ' and ' + t('y=' + y0) + '.<br>Back-substitute: ' + t('x=\\frac{' + c1 + (b1 * y0 < 0 ? '+' : '-') + Math.abs(b1 * y0) + '}{' + cv + '}=' + x0) + '. The solution is ' + t(ptT([x0, y0])) + '.',
              ['The fraction bar is cleared by multiplying <b>every</b> term — on both sides — by the denominator.'], 'clear the fraction');
          } },
          { id: '5aii', sub: 'a ii', level: 'PRG', make: function (r, S) { return solvePart('Finish solving the system. Give the solution as an ordered pair.', S, ['Isolate ' + t('x') + ' (a fraction), substitute it in brackets, then multiply every term by the denominator.', 'Check in both original equations.']); } },
          { id: '5b', sub: 'b', level: 'PRG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [], { xr: [1, 4], yr: [1, 4] }, [4, -3, 3, 2, 5, 21]), ['Isolate the variable with the <b>smallest</b> coefficient — the fraction is simplest.', 'Multiply every term by the denominator after substituting.']); } },
          { id: '5c', sub: 'c', level: 'PRG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [], { xr: [1, 4], yr: [1, 5] }, [3, 4, 25, 2, -3, -6]), ['Isolate the variable with the <b>smallest</b> coefficient — the fraction is simplest.', 'Multiply every term by the denominator after substituting.']); } }] },
      /* ---------- Part B — word problems ---------- */
      { num: '6', section: 'Part B — Word Problems', stem: function (sh) { return 'The sum of two numbers is ' + sh.s + '. ' + ['', '', 'Two', 'Three', 'Four', 'Five'][sh.k] + ' times the smaller number minus the larger number is ' + sh.d + '. Let ' + t('L') + ' be the larger number and ' + t('S') + ' the smaller number.'; },
        shared: function (r) {
          for (var g = 0; g < 400; g++) { var k = r.int(2, 5), S = r.int(3, 12), L = r.int(S + 2, k * S - 1); if (L <= 30 && k * S - L <= 20) return { k: k, S: S, L: L, s: L + S, d: k * S - L }; }
          return { k: 4, S: 5, L: 17, s: 22, d: 3 };
        },
        parts: [
          { id: '6a', level: 'EMG', make: function (r, sh) {
            return sysPart('Write a system of two equations for this situation.', [{ A: 1, B: 1, C: -sh.s }, { A: -1, B: sh.k, C: -sh.d }], ['L', 'S'], { key: ['L+S=' + sh.s, sh.k + 'S-L=' + sh.d],
              diag: function (is) {
                if (is([1, -sh.k, -sh.d])) return { code: 'diff-order', hint: '“' + sh.k + ' times the smaller <b>minus</b> the larger” starts with ' + t(sh.k + 'S') + ' and takes away ' + t('L') + ': ' + t(sh.k + 'S-L') + '.' };
                if (is([sh.k, -1, -sh.d])) return { code: 'coef-swap', hint: 'The ' + t(sh.k) + ' multiplies the <b>smaller</b> number, ' + t('S') + '.' };
                if (is([1, -1, -sh.s])) return { code: 'sum-diff', hint: 'The <b>sum</b> of the numbers is ' + t('L+S') + '.' };
                return null;
              },
              sol: '“The sum is ' + sh.s + '”: ' + t('L+S=' + sh.s) + '.<br>“' + sh.k + ' times the smaller minus the larger is ' + sh.d + '”: ' + t(sh.k + 'S-L=' + sh.d) + '.',
              hints: ['Translate each sentence into its own equation. “Sum” means add.', '“' + sh.k + ' times the smaller” is ' + t(sh.k + 'S') + '.'], text: 'number system',
              bad: [['L+S=' + sh.s, 'L-' + sh.k + 'S=' + sh.d]] });
          } },
          { id: '6b', level: 'EMG', make: function (r, sh) {
            var res = subSol([E(1, 1, sh.s), E(-1, sh.k, sh.d)], { vars: ['L', 'S'], iso: [0, 0] });
            return numFields('Solve the system to find both numbers.', [{ label: t('L=') }, { label: t('S=') }], [sh.L, sh.S], { sol: res.html + '<br>The numbers are <b>' + sh.L + '</b> and <b>' + sh.S + '</b>.', answer: t('L=' + sh.L + ',\\ S=' + sh.S),
              hints: ['Isolate ' + t('L') + ' in ' + t('L+S=' + sh.s) + ' and substitute into the other equation.'], text: 'the two numbers' });
          } }] },
      { num: '7', stem: function (sh) { return 'At the talent show, adult tickets cost $' + t('x') + ' and student tickets cost $' + t('y') + '. On Friday, ' + sh.a1 + ' adult and ' + sh.b1 + ' student tickets sold for $' + sh.T1 + '. On Saturday, ' + sh.a2 + ' adult and ' + sh.b2 + ' student tickets sold for $' + sh.T2 + '.'; },
        shared: function (r) {
          for (var g = 0; g < 400; g++) { var x = r.int(6, 15), y = r.int(3, x - 2), a1 = r.int(2, 5), b1 = r.int(2, 5), a2 = r.int(2, 5), b2 = r.int(2, 5); if (a1 * b2 - a2 * b1 !== 0 && a1 !== b1 && a2 !== b2) return { x: x, y: y, a1: a1, b1: b1, a2: a2, b2: b2, T1: a1 * x + b1 * y, T2: a2 * x + b2 * y }; }
          return { x: 9, y: 6, a1: 3, b1: 4, a2: 2, b2: 5, T1: 51, T2: 48 };
        },
        parts: [
          { id: '7a', level: 'EMG', make: function (r, sh) {
            return sysPart('Write a system for the two nights’ sales.', [{ A: sh.a1, B: sh.b1, C: -sh.T1 }, { A: sh.a2, B: sh.b2, C: -sh.T2 }], ['x', 'y'], { key: [pol([[sh.a1, 'x'], [sh.b1, 'y']]) + '=' + sh.T1, pol([[sh.a2, 'x'], [sh.b2, 'y']]) + '=' + sh.T2],
              diag: function (is) {
                if (is([sh.b1, sh.a1, -sh.T1]) || is([sh.b2, sh.a2, -sh.T2])) return { code: 'u8-count-swap', hint: t('x') + ' is the price of an <b>adult</b> ticket, so it goes with the number of adult tickets.' };
                return null;
              },
              sol: 'Friday: ' + sh.a1 + ' adult tickets cost ' + t(sh.a1 + 'x') + ' and ' + sh.b1 + ' student tickets cost ' + t(sh.b1 + 'y') + ': ' + t(pol([[sh.a1, 'x'], [sh.b1, 'y']]) + '=' + sh.T1) + '.<br>Saturday: ' + t(pol([[sh.a2, 'x'], [sh.b2, 'y']]) + '=' + sh.T2) + '.',
              hints: ['Number of tickets × price, added for both kinds, equals the night’s total.'], text: 'ticket system' });
          } },
          { id: '7b', level: 'PRG', make: function (r, sh) {
            var res = subSol([E(sh.a1, sh.b1, sh.T1), E(sh.a2, sh.b2, sh.T2)], {});
            return numFields('Solve to find the cost of each ticket type.', [{ label: 'adult $' }, { label: 'student $' }], [sh.x, sh.y], { swapCode: 'u8-price-swap', swapHint: 'Right numbers, wrong tickets: ' + t('x') + ' is the adult price.',
              sol: res.html + '<br>An adult ticket costs <b>$' + sh.x + '</b> and a student ticket costs <b>$' + sh.y + '</b>.', answer: 'adult $' + sh.x + ', student $' + sh.y,
              hints: ['No coefficient is ' + t('1') + ': isolate the variable with the smallest coefficient, then multiply every term by the denominator after substituting.'], text: 'ticket prices' });
          } }] },
      { num: '8', stem: function (sh) { return 'A rectangle has length ' + t('l') + ' (cm) and width ' + t('w') + ' (cm). ' + ['', '', 'Twice', 'Three times', 'Four times'][sh.a] + ' the length plus ' + ['', '', 'twice', 'three times', 'four times'][sh.b] + ' the width is ' + sh.T + ' cm. The length is ' + sh.d + ' cm more than the width.'; },
        shared: function (r) {
          for (var g = 0; g < 400; g++) { var a = r.int(2, 4), b = r.int(2, 4), w = r.int(4, 15), d = r.int(2, 9); if (a !== b) return { a: a, b: b, w: w, d: d, l: w + d, T: a * (w + d) + b * w }; }
          return { a: 2, b: 3, w: 12, d: 3, l: 15, T: 66 };
        },
        parts: [
          { id: '8a', level: 'EMG', make: function (r, sh) {
            return sysPart('Write a system of two equations for the rectangle.', [{ A: sh.a, B: sh.b, C: -sh.T }, { A: 1, B: -1, C: -sh.d }], ['l', 'w'], { key: [pol([[sh.a, 'l'], [sh.b, 'w']]) + '=' + sh.T, 'l-w=' + sh.d],
              diag: function (is) {
                if (is([-1, 1, -sh.d])) return { code: 'more-than-flip', hint: 'The <b>length</b> is the bigger one: ' + t('l=w+' + sh.d) + '.' };
                if (is([sh.b, sh.a, -sh.T])) return { code: 'coef-swap', hint: 'Check which dimension each number multiplies: ' + t(sh.a + 'l') + ' and ' + t(sh.b + 'w') + '.' };
                return null;
              },
              sol: t(pol([[sh.a, 'l'], [sh.b, 'w']]) + '=' + sh.T) + '<br>“The length is ' + sh.d + ' cm more than the width”: ' + t('l=w+' + sh.d) + ', or ' + t('l-w=' + sh.d) + '.',
              hints: ['“' + sh.d + ' more than the width” is ' + t('w+' + sh.d) + '.'], text: 'rectangle system', bad: [[pol([[sh.a, 'l'], [sh.b, 'w']]) + '=' + sh.T, 'w-l=' + sh.d]] });
          } },
          { id: '8b', level: 'EMG', make: function (r, sh) {
            var res = subSol([E(sh.a, sh.b, sh.T), E(1, -1, sh.d)], { vars: ['l', 'w'], iso: [1, 0] });
            return numFields('Solve to find the length and the width.', [{ label: t('l='), after: 'cm' }, { label: t('w='), after: 'cm' }], [sh.l, sh.w], { sol: res.html + '<br>The length is <b>' + sh.l + ' cm</b> and the width is <b>' + sh.w + ' cm</b>.', answer: t('l=' + sh.l) + ' cm, ' + t('w=' + sh.w) + ' cm',
              hints: ['Isolate ' + t('l') + ' in the second equation: ' + t('l=w+' + sh.d) + '. Substitute into the first.'], text: 'length and width' });
          } }] },
      /* ---------- Part C — MC, NR, extension ---------- */
      { num: '9', section: 'Part C — Multiple Choice, Numerical Response, and Extension', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '9', level: 'EMG', make: function (r) {
          var x0, y0, p, q, s;
          for (var g = 0; g < 400; g++) { x0 = r.int(2, 9); y0 = rnz(r, -4, 6); p = r.int(2, 5); q = r.int(2, 4); s = r.int(2, 4); var vals = [x0 - y0, x0 + y0, y0 - x0, x0]; if (vals.filter(function (v, i) { return vals.indexOf(v) === i; }).length === 4 && x0 !== y0) break; }
          var Es = [E(1, p, x0 + p * y0), E(q, -s, q * x0 - s * y0)], res = subSol(Es, { iso: [0, 0] });
          return mc(r, 'If ' + t(eqT(Es[0])) + ' and ' + t(eqT(Es[1])) + ', then the value of ' + t('x-y') + ' is', [
            { html: t(x0 - y0), right: true },
            { html: t(x0 + y0), why: 'That’s ' + t('x+y') + '. Subtract instead.' },
            { html: t(y0 - x0), why: 'That’s ' + t('y-x') + '. The question asks for ' + t('x-y') + '.' },
            { html: t(x0), why: 'That’s just ' + t('x') + '. Find ' + t('y') + ' as well, then subtract.' }],
            res.html + '<br>' + t('x-y=' + x0 + '-' + nb(y0) + '=' + (x0 - y0)) + '.', ['Isolate ' + t('x') + ' in the first equation, substitute into the second, and find both values.'], 'MC x-y');
        } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var a = r.int(2, 9), c = r.int(2, 15);
          return mc(r, 'When solving a system that includes ' + t(a + 'x-y=' + c) + ', a valid isolation of ' + t('y') + ' is', [
            { html: t('y=' + a + 'x-' + c), right: true },
            { html: t('y=' + c + '-' + a + 'x'), why: 'From ' + t('-y=' + c + '-' + a + 'x') + ' you must divide <b>every</b> term by ' + t('-1') + '.', code: 'u8-neg' },
            { html: t('y=' + a + 'x+' + c), why: 'Check the sign of the constant: ' + t('-y=' + c + '-' + a + 'x') + ', then change <b>every</b> sign.', code: 'const' },
            { html: t('y=-' + a + 'x-' + c), why: 'Substitute ' + t('x=0') + ': the equation gives ' + t('-y=' + c) + ', so ' + t('y=-' + c) + ' — but check the ' + t('x') + '-term: it must change sign too.', code: 'both' }],
            t(a + 'x-y=' + c) + ': move ' + t(a + 'x') + ' across, ' + t('-y=' + c + '-' + a + 'x') + ', then divide every term by ' + t('-1') + ': ' + t('y=-' + c + '+' + a + 'x') + ', i.e. ' + t('y=' + a + 'x-' + c) + '.', ['Move the ' + t('x') + '-term, then divide <b>every</b> term by ' + t('-1') + '.'], 'MC isolate y');
        } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [{ id: '11', level: 'ADV', make: nrPart(11) }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [{ id: '12', level: 'ADV', make: nrPart(12) }] },
      { num: '13', stem: '<i>(Extension)</i> Solve this system of three equations by substitution.', parts: [
        { id: '13', level: 'MAS', make: function (r) {
          var p0, a, k, b, al, be, cP;
          for (var g = 0; g < 400; g++) { p0 = r.int(1, 5); a = r.int(2, 7); k = r.int(2, 3); b = r.int(1, 6); al = r.int(2, 4); be = r.int(2, 3); cP = al - k + be; if (cP !== 0 && cP !== 1) break; }
          var q0 = k * p0 + b, r0 = p0 + a, T = al * p0 - q0 + be * r0;
          var texs = [pol([[al, 'p'], [-1, 'q'], [be, 'r']]) + '=' + T, 'r-p=' + a, 'q-' + k + 'p=' + b];
          var sol = 'Rearrange the second and third equations (no fractions): ' + t('r=p+' + a) + ' and ' + t('q=' + k + 'p+' + b) + '.<br>Substitute both into the first: ' + t(al + 'p-(' + k + 'p+' + b + ')+' + be + '(p+' + a + ')=' + T) + '.<br>' +
            t(al + 'p-' + k + 'p-' + b + '+' + be + 'p+' + be * a + '=' + T) + ', so ' + t(pol([[cP, 'p'], [be * a - b, '']]) + '=' + T) + ', ' + t(term(cP, 'p', true) + '=' + (T - be * a + b)) + ', so ' + t('p=' + p0) + '.<br>' +
            'Back-substitute: ' + t('q=' + k + '(' + p0 + ')+' + b + '=' + q0) + ' and ' + t('r=' + p0 + '+' + a + '=' + r0) + '.<br>Check in the first equation: ' + t(al + '(' + p0 + ')-' + q0 + '+' + be + '(' + r0 + ')=' + T) + ' ✓';
          return xyzPart('Solve:' + sysD(texs) + '<i>Hint:</i> rearrange the second and third equations to give ' + t('r') + ' and ' + t('q') + ' in terms of ' + t('p') + ', then substitute both into the first.', ['p', 'q', 'r'], [p0, q0, r0],
            [function (v) { return al * v[0] - v[1] + be * v[2] === T; }, function (v) { return v[2] - v[0] === a; }, function (v) { return v[1] - k * v[0] === b; }], sol,
            [t('r-p=' + a) + ' gives ' + t('r=p+' + a) + '; ' + t('q-' + k + 'p=' + b) + ' gives ' + t('q=' + k + 'p+' + b) + '.', 'After substituting, the first equation has only ' + t('p') + ' in it.'], 'three unknowns');
        } }] },
      { num: '14', stem: '<i>(Mixed Review)</i> Solve each system completely, choosing the most efficient variable to isolate.', parts: [
        { id: '14a', level: 'BEG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [[0, 0, 1], [1, 1, -1]], { iso: [0, 0] }, [1, 3, 7, 2, -1, 7])); } },
        { id: '14b', level: 'PRG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [], { xr: [1, 4], yr: [-3, 4] }, [3, 2, 12, 4, -5, -7]), ['No coefficient is ' + t('1') + ' or ' + t('-1') + ': isolate the variable with the smallest coefficient.', 'After substituting, multiply every term by the denominator.']); } }] }
    ],
    extra: [
      /* ---------- Part A ---------- */
      { num: '1', section: 'Extra Practice A — Choosing the Variable, Then Carrying the Work', stem: 'For each system, choose which variable to isolate and in which equation. If no coefficient is 1 or −1, choose the one that keeps the fraction simplest. Do not solve.',
        shared: function (r) {
          var one = function (pos, book) { return gen(r, function (r) {
            var C = [[r.int(2, 9), r.int(2, 9) * sgn(r)], [r.int(2, 9), r.int(2, 9) * sgn(r)]]; C[pos[0]][pos[1]] = pos[2];
            if (C[0][0] * C[1][1] - C[0][1] * C[1][0] === 0) return null;
            var Es = [E(C[0][0], C[0][1], rnz(r, -9, 15)), E(C[1][0], C[1][1], rnz(r, -9, 15))]; return Es.every(okEq) ? mkS(Es, [pos[0], pos[1]]) : null;
          }, function () { return bookS(book, [pos[0], pos[1]]); }); };
          var none = function (book) { return gen(r, function (r) {
            var C = [[r.int(3, 9), r.int(3, 9) * sgn(r)], [r.int(3, 9), r.int(3, 9) * sgn(r)]], sm = r.pick([[1, 1], [1, 0], [0, 1]]); C[sm[0]][sm[1]] = r.int(2, 3) * (sm[1] === 1 ? sgn(r) : 1);
            var mags = [C[0][0], C[0][1], C[1][0], C[1][1]].map(Math.abs), mn = Math.min.apply(null, mags);
            if (mags.filter(function (m) { return m === mn; }).length > 1 || C[0][0] * C[1][1] - C[0][1] * C[1][0] === 0) return null;
            var Es = [E(C[0][0], C[0][1], rnz(r, -9, 12)), E(C[1][0], C[1][1], rnz(r, -9, 12))]; return Es.every(okEq) ? mkS(Es, [sm[0], sm[1]]) : null;
          }, function () { return bookS(book, [1, 1]); }); };
          return { a: one([0, 0, 1], [1, 5, 13, 4, -3, 7]), b: one([0, 1, -1], [3, -1, 8, 5, 2, 1]), c: none([6, 5, 2, 4, -3, 9]), d: one([1, 0, 1], [7, 2, 15, 1, -9, 4]), e: one([1, 1, 1], [2, -7, 5, 8, 1, 11]), f: none([4, 3, 10, 9, -2, 7]) };
        },
        parts: ['a', 'b', 'c', 'd', 'e', 'f'].map(function (L) { return { id: 'e1' + L, level: L === 'c' || L === 'f' ? 'EMG' : 'LIM', make: function (r, sh) { return isoMC(r, sh[L], sh[L].iso, { prompt: 'Which variable, in which equation, would you isolate? (If no coefficient is ' + t('1') + ' or ' + t('-1') + ', pick the choice that keeps the fraction simplest.)' }); } }; }) },
      { num: '2', stem: 'Isolate a variable, then complete all five steps. Solutions here may be negative or fractional — leave fractions exact.', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [[0, 0, 1]], { xr: [-4, 4], yr: [-4, 4], mag: [2, 6] }, [1, 3, 5, 4, -5, -14])); } },
        { id: 'e2b', level: 'EMG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [[0, 1, -1]], { xr: [-4, 4], yr: [-4, 4], mag: [2, 6] }, [5, -1, -13, 2, 3, 5])); } },
        { id: 'e2c', level: 'EMG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [[0, 0, 1]], { xr: [-4, 4], yr: [-4, 4], mag: [2, 6] }, [1, -4, -7, 6, 5, -13])); } },
        { id: 'e2d', level: 'PRG', make: function (r) { return solvePart('Solve. Give exact values (fractions in lowest terms).', fracSys(r, [[0, 0, 1]], { bothFrac: true, maxDen: 11 }, [1, 2, 3, 3, -4, 1]), ['Isolate ' + t('x') + ' (coefficient ' + t('1') + '), substitute and solve.', 'The answer has fractions — leave them exact, in lowest terms.']); } }] },
      { num: '3', stem: 'In each system the variable you isolate has a coefficient of −1, so every term on the other side changes sign. Write the isolation step first, then solve and check both originals.',
        shared: function (r) {
          var o = { xr: [-4, 4], yr: [-4, 7], negX: true };
          return { a: sysGen(r, [[0, 0, -1]], o, [-1, 3, 7, 2, 5, 8]), b: sysGen(r, [[0, 1, -1]], o, [4, -1, -3, -2, 5, -3]), c: sysGen(r, [[0, 0, -1]], o, [-1, -2, 5, 3, 7, -16]), d: sysGen(r, [[0, 1, -1]], o, [5, -1, 8, -3, 2, 5]) };
        },
        parts: ['a', 'b', 'c', 'd'].reduce(function (acc, L) {
          acc.push({ id: 'e3' + L + 'i', sub: L + ' i', level: 'EMG', make: function (r, sh) { return isoPart(sh[L], [sh[L].iso], { prompt: '<b>Isolation step.</b> Isolate the variable whose coefficient is ' + t('-1') + '. Type the result as “variable = expression”.' }); } });
          acc.push({ id: 'e3' + L + 'ii', sub: L + ' ii', level: 'EMG', make: function (r, sh) { return solvePart('Now solve and check. Give the solution as an ordered pair.', sh[L]); } });
          return acc;
        }, []) },
      { num: '4', stem: 'In each of these systems every coefficient is bigger than 1, so isolating must produce a fraction. Carry it through the substitution, and leave any fractional answer exact.',
        shared: function (r) {
          return fracSys(r, [], { iso: [1, 0], maxDen: 16, fix: function (C, r) { C[1][0] = 2; C[1][1] = r.pick([3, 5]) * sgn(r); C[0][0] = r.int(3, 6); C[0][1] = r.int(3, 7) * sgn(r); } }, [4, 6, 5, 2, -3, 4]);
        },
        parts: [
          { id: 'e4a', level: 'PRG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [], { xr: [-3, 4], yr: [-3, 4], mag: [2, 6] }, [2, 3, 8, 5, -4, -3]), ['Isolate the variable with the smallest coefficient (divide by it), substitute in brackets, then multiply every term by the denominator.']); } },
          { id: 'e4b', level: 'PRG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [], { xr: [-3, 4], yr: [-3, 4], mag: [2, 7] }, [2, 5, -4, 7, 3, 15]), ['Isolate the variable with the smallest coefficient (divide by it), substitute in brackets, then multiply every term by the denominator.']); } },
          { id: 'e4c', level: 'ADV', make: function (r, S) { return solvePart('Solve. Give exact values (fractions in lowest terms).', S, ['Isolate ' + t('x') + ' in the equation where its coefficient is ' + t('2') + ' — the smallest divisor.', 'Keep every value as an exact fraction.']); } },
          { id: 'e4d', level: 'EMG', make: function (r, S) {
            return mc(r, 'Look back at (c). Which variable is the best one to isolate, and why?' + sysD(S.texs), [
              { html: t('x') + ' in ' + t(S.texs[1]) + ': it divides by ' + t('2') + ', the smallest coefficient in the system. Any other choice divides by ' + t('3') + ' or more and makes heavier fractions.', right: true },
              { html: t('y') + ' in ' + t(S.texs[0]) + ': the biggest coefficient cancels fastest.', why: 'Isolating divides by the coefficient, so a big coefficient makes a <b>bigger</b> denominator.' },
              { html: 'It makes no difference — the fractions are the same size whichever you pick.', why: 'The final answer is the same, but the work is not: dividing by ' + t('2') + ' gives simpler fractions than dividing by ' + t(Math.abs(qv(S.Es[0].b))) + '.' },
              { html: t('x') + ' in ' + t(S.texs[0]) + ': always isolate from the first equation.', why: 'Either equation can be used. Choose the smallest coefficient anywhere in the system.' }],
              'Isolating divides by the coefficient. The smallest coefficient in the system is the ' + t('2') + ' on ' + t('x') + ' in ' + t(S.texs[1]) + ', giving ' + t('x=' + isoExpr(S.Es[1], 0, ['x', 'y'])) + '. Isolating anything else divides by ' + t('3') + ' or more, so the fractions are heavier.', ['Isolating divides by the coefficient. Which coefficient is the smallest?'], 'best variable to isolate');
          } }] },
      /* ---------- Part B ---------- */
      { num: '5', section: 'Extra Practice B — Two Routes, Messy Coefficients, and Special Cases', stem: function (S) { return 'Solve the system ' + t(S.texs[0]) + ', ' + t(S.texs[1]) + ' twice, once by each route.'; },
        shared: function (r) {
          return gen(r, function (r) {
            var a = r.int(2, 5), k = r.pick([2, 3]), b = r.int(2, 5) * sgn(r), x0 = r.int(1, 4), y0 = r.int(1, 4); if (Math.abs(b) === k || a * b - k === 0) return null;
            var Es = [E(a, 1, a * x0 + y0), E(k, b, k * x0 + b * y0)]; if (!Es.every(okEq)) return null;
            return { texs: Es.map(function (e) { return eqT(e); }), Es: Es, iso: [0, 1], a: a, k: k, b: b, x0: x0, y0: y0 };
          }, function () { var Es = [E(3, 1, 7), E(2, -5, -1)]; return { texs: ['3x+y=7', '2x-5y=-1'], Es: Es, iso: [0, 1], a: 3, k: 2, b: -5, x0: 2, y0: 1 }; });
        },
        parts: [
          { id: 'e5a', level: 'EMG', make: function (r, S) { return solvePart('<b>Route 1:</b> isolate ' + t('y') + ' in the first equation, then substitute into the second. Give the solution as an ordered pair.', S, ['Route 1: ' + t('y=' + isoExpr(S.Es[0], 1, ['x', 'y'])) + '. Substitute it, in brackets, into the second equation.']); } },
          { id: 'e5b', level: 'PRG', make: function (r, S) {
            var c2 = qv(S.Es[1].c), c1 = qv(S.Es[0].c), N = -S.b > 0 ? pol([[-S.b, 'y'], [c2, '']]) : pol([[c2, ''], [-S.b, 'y']]), fr = '\\frac{' + N + '}{' + S.k + '}';
            var right = S.a + '(' + N + ')+' + S.k + 'y=' + S.k * c1;
            var res = subSol(S.Es, { iso: [1, 0] });
            return mc(r, '<b>Route 2:</b> isolate ' + t('x') + ' in the second equation, ' + t('x=' + fr) + ', substitute into the first equation and multiply every term by ' + t(S.k) + '. Which equation do you get?', [
              { html: t(right), right: true },
              { html: t(S.a + '(' + N + ')+y=' + S.k * c1), why: 'Every term is multiplied by ' + t(S.k) + ' — the ' + t('y') + ' term too.', code: 'u8-clear-frac' },
              { html: t(S.a + '(' + N + ')+' + S.k + 'y=' + c1), why: 'The right side must be multiplied by ' + t(S.k) + ' as well.', code: 'clear-one-side' },
              { html: t(pol([[-S.b, 'y'], [c2, '']]) + '+' + S.k + 'y=' + S.k * c1), why: 'The ' + t(S.a) + ' in front of ' + t('x') + ' still multiplies the numerator: ' + t(S.a + '(' + N + ')') + '.', code: 'clear-bracket' }],
              'Substitute: ' + t(S.a + '\\left(' + fr + '\\right)+y=' + c1) + '. Multiply every term by ' + t(S.k) + ': ' + t(right) + '.<br>Then ' + t(pol([[S.a * -S.b + S.k, 'y'], [S.a * c2, '']]) + '=' + S.k * c1) + ', so ' + t('y=' + S.y0) + ' and ' + t('x=' + S.x0) + ': the same pair ' + t(ptT([S.x0, S.y0])) + '.<br>(For comparison, the full Route 2:<br>' + res.html + ')',
              ['Multiply <b>every</b> term on both sides by the denominator ' + t(S.k) + '.'], 'route 2 step');
          } },
          { id: 'e5c', level: 'EMG', make: function (r, S) {
            return mc(r, 'Compare the ordered pairs from the two routes. What is the same, and what is different?', [
              { html: 'The ordered pair is identical; only the algebra in between is different.', right: true },
              { html: 'The two routes give different pairs, and both are solutions.', why: 'Two lines that cross meet at only <b>one</b> point, so every correct route gives that same pair.' },
              { html: 'Route 2 gives fractions in the final answer, Route 1 doesn’t.', why: 'Route 2 has fractions partway through, but they cancel: the answer is the same whole-number pair.' },
              { html: 'The ' + t('x') + '-values agree but the ' + t('y') + '-values don’t.', why: 'Both routes give ' + t(ptT([S.x0, S.y0])) + ' exactly.' }],
              'Both routes give ' + t(ptT([S.x0, S.y0])) + ': a system whose lines cross has exactly one solution, whichever variable you isolate. Only the work in between differs — Route 2 has a fraction partway through.', [], 'compare routes');
          } },
          { id: 'e5d', level: 'EMG', make: function (r, S) {
            return mc(r, 'Which route was less work, and what feature of the system made it so?', [
              { html: 'Route 1: ' + t('y') + ' has coefficient ' + t('1') + ' in ' + t(S.texs[0]) + ', so it isolates in one step with no fraction.', right: true },
              { html: 'Route 2: finding ' + t('x') + ' first is always quicker.', why: 'Which variable comes first doesn’t matter; what matters is whether isolating it divides by a number other than ' + t('\\pm1') + '.' },
              { html: 'Route 2: the second equation has the smaller constant.', why: 'The constant doesn’t decide it — the coefficient you divide by does. Route 2 divides by ' + t(S.k) + '.' },
              { html: 'Both routes were exactly the same amount of work.', why: 'Route 2 had to divide by ' + t(S.k) + ' and then clear a fraction — an extra step.' }],
              'Route 1 isolates ' + t('y=' + isoExpr(S.Es[0], 1, ['x', 'y'])) + ' with no division, because the coefficient of ' + t('y') + ' is ' + t('1') + '. Route 2 has to divide by ' + t(S.k) + ', creating a fraction that must be cleared later.', [], 'which route');
          } }] },
      { num: '6', stem: 'Each system has fractional or decimal coefficients. Clear them first, then isolate a variable and solve.',
        shared: function (r) {
          var a = gen(r, function (r) {
            var p = r.int(2, 5), q = r.int(2, 5); if (p === q) return null;
            var x0 = p * r.int(1, 3), y0 = q * r.int(1, 3), plus = r.chance(0.3), d = plus ? x0 + y0 : x0 - y0; if (!d && !plus) return null;
            return { p: p, q: q, x0: x0, y0: y0, c: x0 / p + y0 / q, plus: plus, d: d };
          }, function () { return { p: 2, q: 3, x0: 6, y0: 3, c: 4, plus: false, d: 3 }; });
          var b = gen(r, function (r) {
            var u = r.int(1, 9), v = r.int(1, 9), x0 = r.int(1, 6), y0 = r.int(1, 6); if (u === v || x0 === y0) return null;
            if ((u * x0 + v * y0) % 10 === 0 || u === 5 && v === 5) return null;
            return { u: u, v: v, x0: x0, y0: y0, c: u * x0 + v * y0, d: x0 - y0 };
          }, function () { return { u: 2, v: 5, x0: 3, y0: 4, c: 26, d: -1 }; });
          return { a: a, b: b };
        },
        parts: [
          { id: 'e6ai', sub: 'a i', level: 'EMG', make: function (r, sh) {
            var A = sh.a, Lc = lcm(A.p, A.q), tex = '\\frac{x}{' + A.p + '}+\\frac{y}{' + A.q + '}=' + A.c;
            return clearPart('Clear the fractions in ' + t(tex) + ': multiply every term by the lowest common denominator. Type the new equation.', E(Q(1, A.p), Q(1, A.q), A.c), Lc,
              'The lowest common denominator of ' + t(A.p) + ' and ' + t(A.q) + ' is ' + t(Lc) + '. Multiply every term by ' + t(Lc) + ': ' + t(pol([[Lc / A.p, 'x'], [Lc / A.q, 'y']]) + '=' + Lc * A.c) + '.');
          } },
          { id: 'e6aii', sub: 'a ii', level: 'PRG', make: function (r, sh) {
            var A = sh.a, Lc = lcm(A.p, A.q), E1 = E(Lc / A.p, Lc / A.q, Lc * A.c), E2 = E(1, A.plus ? 1 : -1, A.d);
            var S = { texs: ['\\frac{x}{' + A.p + '}+\\frac{y}{' + A.q + '}=' + A.c, eqT(E2)], Es: [E1, E2], iso: [1, 0], checkEs: [E(Q(1, A.p), Q(1, A.q), A.c), E2], pre: ['Multiply the first equation by ' + t(Lc) + ': ' + t(eqT(E1)) + '.'] };
            return solvePart('Solve the system. Give the solution as an ordered pair.', S, ['Multiply the fraction equation by ' + t(Lc) + ', then isolate ' + t('x') + ' in ' + t(eqT(E2)) + '.']);
          } },
          { id: 'e6bi', sub: 'b i', level: 'EMG', make: function (r, sh) {
            var b = sh.b, tex = dTerm(b.u, 'x', true) + dTerm(b.v, 'y') + '=' + dc(b.c / 10);
            return clearPart('Clear the decimals in ' + t(tex) + ': multiply every term by ' + t('10') + '. Type the new equation.', E(Q(b.u, 10), Q(b.v, 10), Q(b.c, 10)), 10,
              'Multiply every term by ' + t('10') + ': ' + t(pol([[b.u, 'x'], [b.v, 'y']]) + '=' + b.c) + '.');
          } },
          { id: 'e6bii', sub: 'b ii', level: 'PRG', make: function (r, sh) {
            var b = sh.b, E1 = E(b.u, b.v, b.c), E2 = E(1, -1, b.d);
            var S = { texs: [dTerm(b.u, 'x', true) + dTerm(b.v, 'y') + '=' + dc(b.c / 10), eqT(E2)], Es: [E1, E2], iso: [1, 0], checkEs: [E(Q(b.u, 10), Q(b.v, 10), Q(b.c, 10)), E2], pre: ['Multiply the first equation by ' + t('10') + ': ' + t(eqT(E1)) + '.'] };
            return solvePart('Solve the system. Give the solution as an ordered pair.', S, ['Multiply the decimal equation by ' + t('10') + ', then isolate ' + t('x') + ' in ' + t(eqT(E2)) + '.']);
          } }] },
      { num: '7', stem: 'Solve each system by substitution. One collapses to a false statement and two collapse to true statements. State the number of solutions and what the collapsed statement told you.',
        shared: function (r) {
          var m = r.int(2, 4), c = rnz(r, -6, 8), k = r.int(2, 4), dd; do { dd = rnz(r, -9, 9); } while (dd === k * c || gcd(gcd(k, k * m), dd) > 1);
          var A = { texs: ['x-' + m + 'y=' + c, k + 'x-' + k * m + 'y=' + dd], Es: [E(1, -m, c), E(k, -k * m, dd)], iso: [0, 0] };
          var a2 = r.int(2, 5), c2 = rnz(r, -6, 8), k2 = r.int(2, 4);
          var Bs = { texs: [pol([[a2, 'x'], [-1, 'y']]) + '=' + c2, pol([[k2 * a2, 'x'], [-k2, 'y']]) + '=' + k2 * c2], Es: [E(a2, -1, c2), E(k2 * a2, -k2, k2 * c2)], iso: [0, 1] };
          var m3 = r.int(2, 5), c3 = rnz(r, -8, 8), k3 = r.int(2, 4);
          var Cs = { texs: [pol([[-1, 'x'], [m3, 'y']]) + '=' + c3, pol([[k3, 'x'], [-k3 * m3, 'y']]) + '=' + (-k3 * c3)], Es: [E(-1, m3, c3), E(k3, -k3 * m3, -k3 * c3)], iso: [0, 0] };
          return { a: A, b: Bs, c: Cs };
        },
        parts: ['a', 'b', 'c'].reduce(function (acc, L) {
          acc.push({ id: 'e7' + L, sub: L + ' i', level: 'EMG', make: function (r, sh) { return solvePart('Solve by substitution. Use the <b>no solution</b> or <b>infinitely many</b> key for the number of solutions.', sh[L], ['Substitute and simplify until both variables cancel. Is the number statement left over always true or never true?']); } });
          acc.push({ id: 'e7' + L + 'x', sub: L + ' ii', level: 'EMG', make: function (r, sh) { return mcCollapse(r, L === 'a' ? 'none' : 'inf', sh[L]); } });
          return acc;
        }, []) },
      /* ---------- Part C ---------- */
      { num: '8', section: 'Extra Practice C — Error Analysis and Working Backwards', stem: function (sh) { return 'Devon is solving ' + t(sh.texs[0]) + ', ' + t(sh.texs[1]) + '. He isolates ' + t('x') + ' in the <b>first</b> equation and writes ' + t(sh.k + 'x=' + sh.c1 + '-' + sh.b1 + 'y') + ', then ' + t('x=' + sh.c1 + '-' + sh.b1 + 'y') + '.'; },
        shared: function (r) {
          return gen(r, function (r) {
            var k = r.pick([2, 3]), b1 = r.int(2, 5), d = r.int(1, 4), x0 = rnz(r, -3, 5), y0 = r.int(1, 4); if (gcd(k, b1) > 1) return null;
            var c1 = k * x0 + b1 * y0, e = x0 - d * y0; if (c1 <= 0 || !e) return null;
            var yD = Q(c1 - e, b1 + d), xD = qs(c1, qm(b1, yD)); if (qv(xD) === 0 || (isInt(xD) && isInt(yD)) || Q(yD)[1] > 9) return null;
            var Es = [E(k, b1, c1), E(1, -d, e)];
            return { k: k, b1: b1, c1: c1, d: d, e: e, x0: x0, y0: y0, xD: xD, yD: yD, Es: Es, texs: Es.map(function (z) { return eqT(z); }), iso: [1, 0] };
          }, function () { var Es = [E(2, 3, 8), E(1, -2, -3)]; return { k: 2, b1: 3, c1: 8, d: 2, e: -3, x0: 1, y0: 2, xD: Q(7, 5), yD: Q(11, 5), Es: Es, texs: ['2x+3y=8', 'x-2y=-3'], iso: [1, 0] }; });
        },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r, sh) {
            var right = 'x=\\frac{' + sh.c1 + '-' + sh.b1 + 'y}{' + sh.k + '}';
            return mc(r, 'Name Devon’s error, and give the correct isolation of ' + t('x') + ' from ' + t(sh.texs[0]) + '.', [
              { html: 'He divided only the left side by ' + t(sh.k) + '. Every term must be divided: ' + t(right) + '.', right: true },
              { html: 'He should have moved ' + t(sh.k + 'x') + ' instead: ' + t(sh.b1 + 'y=' + sh.c1 + '-' + sh.k + 'x') + ' is the only correct start.', why: 'Moving ' + t(sh.b1 + 'y') + ' was fine. The mistake is in the division.' },
              { html: 'He divided only the ' + t(sh.c1) + ' by ' + t(sh.k) + ': it should be ' + t('x=' + qT(Q(sh.c1, sh.k)) + '-' + sh.b1 + 'y') + '.', why: 'Every term on the right is divided by ' + t(sh.k) + ' — the ' + t(sh.b1 + 'y') + ' too.' },
              { html: 'There is no error — ' + t('x=' + sh.c1 + '-' + sh.b1 + 'y') + ' is correct.', why: 'Test it: with ' + t('y=0') + ' it gives ' + t('x=' + sh.c1) + ', but then ' + t(sh.k + 'x=' + sh.k * sh.c1) + ', not ' + t(sh.c1) + '.' }],
              'From ' + t(sh.k + 'x=' + sh.c1 + '-' + sh.b1 + 'y') + ', divide <b>both</b> sides — every term — by ' + t(sh.k) + ': ' + t(right) + '. Devon divided only the left side, so his right side is ' + t(sh.k) + ' times too big.', [], 'Devon’s error');
          } },
          { id: 'e8b', level: 'PRG', make: function (r, sh) {
            var DE = E(1, sh.b1, sh.c1), O = sh.Es[1], res = subSol([DE, O], { iso: [0, 0], names: ['Devon’s equation', 'the second equation'], check: false });
            return ptPart('Devon carried on with ' + t('x=' + sh.c1 + '-' + sh.b1 + 'y') + '. Substitute his expression into ' + t(sh.texs[1]) + ' and find the ordered pair he ended up with. Give exact values.', { Es: [DE, O] }, res,
              ['Substitute ' + t('(' + sh.c1 + '-' + sh.b1 + 'y)') + ' for ' + t('x') + ' in ' + t(sh.texs[1]) + '.', 'His values are fractions — leave them exact.'], 'Devon’s pair', { bad: [ptK([sh.x0, sh.y0])] });
          } },
          { id: 'e8c', level: 'PRG', make: function (r, sh) {
            var val = qa(qm(sh.k, sh.xD), qm(sh.b1, sh.yD));
            var p = B.fraction('Devon’s pair is ' + t(ptT([sh.xD, sh.yD])) + '. Substitute it into the left side of ' + t(sh.texs[0]) + '. What is ' + t(sh.k + 'x+' + sh.b1 + 'y') + '? (It should be ' + t(sh.c1) + ' — it isn’t.)', val, { before: t(sh.k + 'x+' + sh.b1 + 'y=') },
              t(sh.k + '\\left(' + qT(sh.xD) + '\\right)+' + sh.b1 + '\\left(' + qT(sh.yD) + '\\right)=' + qT(qm(sh.k, sh.xD)) + '+' + qb(qm(sh.b1, sh.yD)) + '=' + qT(val)) + ', and ' + t(qT(val) + '\\neq ' + sh.c1) + '. So Devon’s pair is not on the first line: it is not the solution.',
              ['Multiply each fraction by its coefficient, then add (use a common denominator).'], 'check Devon’s pair');
            return p;
          } },
          { id: 'e8d', level: 'EMG', make: function (r, sh) { return solvePart('Solve the system correctly, using the smartest isolation available. Give the solution as an ordered pair.', sh, ['The smartest isolation: ' + t('x') + ' in ' + t(sh.texs[1]) + ' (coefficient ' + t('1') + ').']); } }] },
      { num: '9', stem: function (sh) { return 'Priya is solving ' + t(sh.texs[0]) + ', ' + t(sh.texs[1]) + '. She isolates ' + t('y') + ' in the first equation to get ' + t('y=' + sh.a + 'x-' + sh.c) + ', then substitutes it back into ' + t(sh.texs[0]) + ' and gets ' + t(sh.a + 'x-(' + sh.a + 'x-' + sh.c + ')=' + sh.c) + ', that is, ' + t(sh.c + '=' + sh.c) + '. She concludes the system has infinitely many solutions.'; },
        shared: function (r) {
          for (var g = 0; g < 400; g++) {
            var a = r.int(2, 5), x0 = r.int(1, 4), y0 = rnz(r, -3, 4), d = r.int(2, 5), e = r.int(2, 5), c = a * x0 - y0, f = d * x0 + e * y0;
            if (c > 0 && f && a * e + d !== 0) { var Es = [E(a, -1, c), E(d, e, f)]; if (Es.every(okEq)) return { a: a, c: c, x0: x0, y0: y0, Es: Es, texs: Es.map(function (z) { return eqT(z); }), iso: [0, 1] }; }
          }
          return { a: 3, c: 5, x0: 2, y0: 1, Es: [E(3, -1, 5), E(2, 3, 7)], texs: ['3x-y=5', '2x+3y=7'], iso: [0, 1] };
        },
        parts: [
          { id: 'e9a', level: 'PRG', make: function (r, sh) {
            return mc(r, 'Why does Priya’s ' + t(sh.c + '=' + sh.c) + ' tell her nothing about the system?', [
              { html: 'She put ' + t('y=' + sh.a + 'x-' + sh.c) + ' back into the <b>same</b> equation it came from, which can only rebuild that equation — a true statement is guaranteed. It must go into the <b>other</b> equation.', right: true },
              { html: 'She isolated ' + t('y') + ' incorrectly.', why: t('y=' + sh.a + 'x-' + sh.c) + ' is correct. The mistake is where she substituted it.' },
              { html: 'Nothing is wrong — ' + t(sh.c + '=' + sh.c) + ' really does mean infinitely many solutions.', why: 'Only when the substitution goes into the <b>other</b> equation. An equation put back into itself always gives a true statement.' },
              { html: 'She should have isolated ' + t('x') + ' instead of ' + t('y') + '.', why: 'Isolating ' + t('y') + ' (coefficient ' + t('-1') + ') was a good choice. The problem is which equation she substituted into.' }],
              t(sh.a + 'x-(' + sh.a + 'x-' + sh.c + ')=' + sh.a + 'x-' + sh.a + 'x+' + sh.c + '=' + sh.c) + ': true for every ' + t('x') + '. The expression came <b>from</b> ' + t(sh.texs[0]) + ', so putting it back can only rebuild the same equation. Substitution only gives information when the expression goes into the <b>other</b> equation, ' + t(sh.texs[1]) + '.', [], 'Priya’s error');
          } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) { return solvePart('Redo Step 2 correctly and solve the system. Give the solution as an ordered pair.', sh, ['Substitute ' + t('y=' + sh.a + 'x-' + sh.c) + ' into ' + t(sh.texs[1]) + ' — the <b>other</b> equation.']); } }] },
      { num: '10', stem: 'Work backwards. In each part the solution is given; find the missing value(s).', parts: [
        { id: 'e10a', level: 'ADV', make: function (r) {
          var x0, y0, p, q, k;
          for (var g = 0; g < 400; g++) { x0 = r.int(1, 4); y0 = rnz(r, -3, 4); p = r.int(2, 4); q = r.int(2, 4); k = r.int(2, 6); if (x0 !== Math.abs(y0) && x0 + p * y0 > 0) break; }
          var c1 = x0 + p * y0, c2 = k * x0 - q * y0;
          return B.number(t(pol([[1, 'x'], [p, 'y']]) + '=' + c1) + ' and ' + t('kx-' + q + 'y=' + c2) + ' have the solution ' + t(ptT([x0, y0])) + '. Find ' + t('k') + '.', k, function (v) {
            if (near(v, (c2 - q * y0) / x0)) return { code: 'u8l4-back-sign', hint: 'Check the sign when you move ' + t('-' + q + '(' + y0 + ')') + ' to the other side.' };
            if (near(v, (c2 + q * x0) / y0)) return { code: 'sub-swap', hint: 'In ' + t(ptT([x0, y0])) + ', ' + t('x=' + x0) + ' and ' + t('y=' + y0) + '. Put each value in its own place.' };
            return null;
          }, 'Substitute ' + t('x=' + x0) + ', ' + t('y=' + y0) + ' into ' + t('kx-' + q + 'y=' + c2) + ': ' + t('k(' + x0 + ')-' + q + nb(y0) + '=' + c2) + ', so ' + t(term(x0, 'k', true) + (q * y0 < 0 ? '+' : '-') + Math.abs(q * y0) + '=' + c2) + ', ' + t(term(x0, 'k', true) + '=' + k * x0) + ' and ' + t('k=' + k) + '.<br>(The first equation checks: ' + t(x0 + '+' + p + nb(y0) + '=' + c1) + ' ✓)',
            ['Substitute the given ' + t('x') + ' and ' + t('y') + ' into the equation with ' + t('k') + ', then solve for ' + t('k') + '.'], 'find k', { before: t('k=') });
        } },
        { id: 'e10b', level: 'ADV', make: function (r) {
          var a, x0, y0, b, plus;
          for (var g = 0; g < 400; g++) { a = r.int(2, 4); x0 = r.int(2, 6); y0 = r.pick([1, 1, 2, -1, -2]); b = rnz(r, -5, 5); plus = r.chance(0.3); if (Math.abs(b) !== 1 && a * x0 + b * y0 !== 0 && x0 !== Math.abs(y0)) break; }
          var c1 = a * x0 + b * y0, c2 = plus ? x0 + y0 : x0 - y0;
          return B.number(t(a + 'x+by=' + c1) + ' and ' + t((plus ? 'x+y=' : 'x-y=') + c2) + ' have the solution ' + t(ptT([x0, y0])) + '. Find ' + t('b') + '.', b, function (v) {
            if (near(v, -b)) return { code: 'u8l4-back-sign', hint: 'Check the sign when you move ' + t(a * x0) + ' to the other side.' };
            return null;
          }, 'Substitute ' + t('x=' + x0) + ', ' + t('y=' + y0) + ' into ' + t(a + 'x+by=' + c1) + ': ' + t(a + '(' + x0 + ')+b' + nb(y0) + '=' + c1) + ', so ' + t(a * x0 + term(y0, 'b', false) + '=' + c1) + ', ' + t(term(y0, 'b', true) + '=' + (c1 - a * x0)) + ' and ' + t('b=' + b) + '.<br>(The second equation checks: ' + t(x0 + (plus ? '+' : '-') + nb(y0) + '=' + c2) + ' ✓)',
            ['Substitute the given ' + t('x') + ' and ' + t('y') + ' into the equation with ' + t('b') + ', then solve for ' + t('b') + '.'], 'find b', { before: t('b=') });
        } },
        { id: 'e10c', level: 'PRG', make: function (r) {
          var p = r.int(2, 5), q = r.int(2, 4), x0 = r.int(1, 6), y0 = rnz(r, -3, 3), a = p * x0 + y0, b = x0 - q * y0;
          return numFields(t(p + 'x+y=a') + ' and ' + t('x-' + q + 'y=b') + ' have the solution ' + t(ptT([x0, y0])) + '. Find ' + t('a') + ' and ' + t('b') + '.', [{ label: t('a=') }, { label: t('b=') }], [a, b], {
            diag: function (v) { if (near(v[0], p * y0 + x0) || near(v[1], y0 - q * x0)) return { code: 'sub-swap', hint: 'In ' + t(ptT([x0, y0])) + ', ' + t('x=' + x0) + ' and ' + t('y=' + y0) + '. Put each value in its own place.' }; return null; },
            sol: t('a=' + p + '(' + x0 + ')+' + nb(y0) + '=' + a) + ' and ' + t('b=' + x0 + '-' + q + nb(y0) + '=' + b) + '.', answer: t('a=' + a + ',\\ b=' + b), hints: ['Substitute ' + t('x=' + x0) + ' and ' + t('y=' + y0) + ' into each left side and evaluate.'], text: 'find a and b' });
        } }] },
      { num: '11', stem: function (sh) { return 'Consider the system ' + t(pol([[1, 'x'], [sh.m, 'y']]) + '=' + sh.n) + ', ' + t(sh.p + 'x+ky=c') + ', where ' + t('k') + ' and ' + t('c') + ' are unknown constants.'; },
        shared: function (r) { return { m: r.int(2, 4), n: r.int(3, 9), p: r.int(2, 5) }; },
        parts: [
          { id: 'e11a', level: 'ADV', make: function (r, sh) {
            var A = sh.p * sh.m, Bc = sh.p * sh.n;
            return numFields('Isolate ' + t('x') + ' in the first equation and substitute into the second. The result can be written as ' + t('(k-A)y=c-B') + '. What are ' + t('A') + ' and ' + t('B') + '?', [{ label: t('A=') }, { label: t('B=') }], [A, Bc], {
              diag: function (v) { if (near(v[0], sh.m) || near(v[1], sh.n)) return { code: 'u8l4-dist', hint: 'The ' + t(sh.p) + ' multiplies <b>both</b> terms of ' + t('(' + sh.n + '-' + sh.m + 'y)') + '.' }; if (near(v[0], -A) || near(v[1], -Bc)) return { code: 'rearr-sign', hint: 'Check the signs as you collect the ' + t('y') + '-terms on the left and the numbers on the right.' }; return null; },
              sol: t('x=' + sh.n + '-' + sh.m + 'y') + '. Substitute: ' + t(sh.p + '(' + sh.n + '-' + sh.m + 'y)+ky=c') + ', so ' + t(Bc + '-' + A + 'y+ky=c') + '.<br>Collect: ' + t('ky-' + A + 'y=c-' + Bc) + ', i.e. ' + t('(k-' + A + ')y=c-' + Bc) + '. So ' + t('A=' + A) + ' and ' + t('B=' + Bc) + '.',
              answer: t('A=' + A + ',\\ B=' + Bc), hints: ['Substitute ' + t('x=' + sh.n + '-' + sh.m + 'y') + ' into ' + t(sh.p + 'x+ky=c') + ' and expand the bracket.', 'Move the number to the right side and factor ' + t('y') + ' out of the ' + t('y') + '-terms.'], text: '(k-A)y=c-B', bad: [[String(sh.m), String(sh.n)]] });
          } },
          { id: 'e11b', sub: 'b i', level: 'MAS', make: function (r, sh) {
            var A = sh.p * sh.m, Bc = sh.p * sh.n;
            return numFields('The substitution gives ' + t('(k-' + A + ')y=c-' + Bc) + '. For which values of ' + t('k') + ' and ' + t('c') + ' does the system have <b>infinitely many</b> solutions?', [{ label: t('k=') }, { label: t('c=') }], [A, Bc], {
              diag: function (v) { if (near(v[0], A)) return { code: 'u8l4-param', hint: t('k=' + A) + ' is right: it makes the left side ' + t('0') + '. For infinitely many solutions the right side must be ' + t('0') + ' too.' }; if (near(v[1], Bc)) return { code: 'u8l4-param', hint: t('c=' + Bc) + ' makes the right side ' + t('0') + '. What makes the left side ' + t('0') + ' for <b>every</b> ' + t('y') + '?' }; return null; },
              sol: 'Infinitely many solutions means every ' + t('y') + ' works, so the statement must become ' + t('0=0') + ': ' + t('k-' + A + '=0') + ' and ' + t('c-' + Bc + '=0') + '. So ' + t('k=' + A) + ' and ' + t('c=' + Bc) + '.<br>(Then the second equation is ' + t(sh.p + 'x+' + A + 'y=' + Bc) + ' — exactly ' + t(sh.p) + ' times the first: the same line.)',
              answer: t('k=' + A + ',\\ c=' + Bc), hints: ['Infinitely many solutions: the equation must turn into ' + t('0=0') + ', true for every ' + t('y') + '.'], text: 'k, c for infinitely many', bad: [[String(A), String(Bc + 1)]] });
          } },
          { id: 'e11c', sub: 'b ii', level: 'PRG', make: function (r, sh) {
            var A = sh.p * sh.m, Bc = sh.p * sh.n;
            return mc(r, 'Using ' + t('(k-' + A + ')y=c-' + Bc) + ', when does the system have <b>no solution</b>, and when does it have <b>exactly one</b> solution?', [
              { html: 'No solution: ' + t('k=' + A) + ' and ' + t('c\\neq ' + Bc) + '. Exactly one: ' + t('k\\neq ' + A) + ', for any ' + t('c') + '.', right: true },
              { html: 'No solution: ' + t('k\\neq ' + A) + '. Exactly one: ' + t('k=' + A) + ' and ' + t('c\\neq ' + Bc) + '.', why: 'If ' + t('k\\neq ' + A) + ' you can divide by ' + t('k-' + A) + ' and find ' + t('y') + ': one solution.' },
              { html: 'No solution: ' + t('k=' + A) + ' and ' + t('c\\neq ' + Bc) + '. Exactly one: ' + t('k\\neq ' + A) + ' and ' + t('c\\neq ' + Bc) + '.', why: 'When ' + t('k\\neq ' + A) + ', any value of ' + t('c') + ' works — even ' + t('c=' + Bc) + ' (then ' + t('y=0') + ').' },
              { html: 'No solution: ' + t('c\\neq ' + Bc) + ', for any ' + t('k') + '. Exactly one: ' + t('k\\neq ' + A) + '.', why: 'With ' + t('k\\neq ' + A) + ' and ' + t('c\\neq ' + Bc) + ' you can still divide and find ' + t('y') + ' — that is one solution, not none.' }],
              'If ' + t('k=' + A) + ', the left side is ' + t('0') + ': the statement is ' + t('0=c-' + Bc) + ', false when ' + t('c\\neq ' + Bc) + ' — <b>no solution</b> (parallel lines).<br>If ' + t('k\\neq ' + A) + ', divide: ' + t('y=\\frac{c-' + Bc + '}{k-' + A + '}') + ' — <b>exactly one</b> solution, whatever ' + t('c') + ' is.', [], 'conditions on k and c');
          } }] },
      /* ---------- Part D ---------- */
      { num: '12', section: 'Extra Practice D — Applications', stem: function (sh) { return 'A rectangle has length ' + t('l') + ' cm and width ' + t('w') + ' cm. Its perimeter is ' + sh.P + ' cm, and ' + ['', '', 'twice', 'three times', 'four times'][sh.a] + ' the length minus ' + ['', '', 'twice', 'three times'][sh.b] + ' the width is ' + sh.D + ' cm.'; },
        shared: function (r) {
          for (var g = 0; g < 400; g++) { var w = r.int(5, 14), l = r.int(w + 1, w + 12), a = r.int(2, 4), b = r.int(2, 3), D = a * l - b * w; if (D > 0 && a !== b) return { w: w, l: l, a: a, b: b, D: D, P: 2 * (l + w) }; }
          return { w: 10, l: 17, a: 3, b: 2, D: 31, P: 54 };
        },
        parts: [
          { id: 'e12a', level: 'EMG', make: function (r, sh) {
            return sysPart('Write a system of two equations.', [{ A: 2, B: 2, C: -sh.P }, { A: sh.a, B: -sh.b, C: -sh.D }], ['l', 'w'], { key: ['2l+2w=' + sh.P, sh.a + 'l-' + sh.b + 'w=' + sh.D],
              diag: function (is) { if (is([1, 1, -sh.P])) return { code: 'perim-half', hint: 'The perimeter goes around all four sides: ' + t('2l+2w') + '.' }; return null; },
              sol: 'Perimeter: ' + t('2l+2w=' + sh.P) + '. Dividing every term by ' + t('2') + ' gives ' + t('l+w=' + sh.P / 2) + ', which has coefficients of ' + t('1') + ' — so isolate ' + t('l=' + sh.P / 2 + '-w') + '.<br>Second fact: ' + t(sh.a + 'l-' + sh.b + 'w=' + sh.D) + '.',
              hints: ['Perimeter of a rectangle: ' + t('2l+2w') + '.'], text: 'rectangle system' });
          } },
          { id: 'e12b', level: 'EMG', make: function (r, sh) {
            var res = subSol([E(1, 1, sh.P / 2), E(sh.a, -sh.b, sh.D)], { vars: ['l', 'w'], iso: [0, 0], pre: ['Divide the perimeter equation by ' + t('2') + ': ' + t('l+w=' + sh.P / 2) + '.'] });
            return numFields('Solve the system and state the length and width.', [{ label: t('l='), after: 'cm' }, { label: t('w='), after: 'cm' }], [sh.l, sh.w], { sol: res.html + '<br>Length <b>' + sh.l + ' cm</b>, width <b>' + sh.w + ' cm</b>. Perimeter check: ' + t('2(' + sh.l + '+' + sh.w + ')=' + sh.P) + ' ✓', answer: t('l=' + sh.l) + ' cm, ' + t('w=' + sh.w) + ' cm',
              hints: ['Divide the perimeter equation by ' + t('2') + ' first: then ' + t('l') + ' isolates with no fraction.'], text: 'length and width' });
          } }] },
      { num: '13', stem: function (sh) { return 'A two-digit number has tens digit ' + t('t') + ' and units digit ' + t('u') + ', so its value is ' + t('10t+u') + '. The digits add to ' + sh.s + ', and reversing the digits gives a number ' + sh.g + ' greater than the original.'; },
        shared: function (r) { var tt = r.int(1, 7), u = r.int(tt + 1, 9); return { t: tt, u: u, s: tt + u, g: 9 * (u - tt) }; },
        parts: [
          { id: 'e13a', level: 'PRG', make: function (r, sh) {
            var dd = sh.u - sh.t;
            return sysPart('Write two equations. (The reversal equation can be simplified until no coefficient is larger than ' + t('1') + '.)', [{ A: 1, B: 1, C: -sh.s }, { A: -1, B: 1, C: -dd }], ['t', 'u'], { key: ['t+u=' + sh.s, 'u-t=' + dd],
              diag: function (is) {
                if (is([-1, 1, -sh.g])) return { code: 'digits-diff', hint: 'Reversing changes the number by ' + t('9') + ' times the difference of the digits: ' + t('(10u+t)-(10t+u)=9u-9t') + '.' };
                if (is([1, -1, -dd]) || is([9, -9, -sh.g])) return { code: 'rev-direction', hint: 'The <b>reversed</b> number ' + t('10u+t') + ' is the bigger one: ' + t('10u+t=10t+u+' + sh.g) + '.' };
                return null;
              },
              sol: 'Digits: ' + t('t+u=' + sh.s) + '.<br>Reversal: ' + t('10u+t=10t+u+' + sh.g) + ', so ' + t('9u-9t=' + sh.g) + ', and dividing by ' + t('9') + ': ' + t('u-t=' + dd) + '.',
              hints: ['The reversed number is ' + t('10u+t') + '. It equals the original ' + t('10t+u') + ' plus ' + t(sh.g) + '.'], text: 'digit system', bad: [['t+u=' + sh.s, 'u-t=' + sh.g]] });
          } },
          { id: 'e13b', level: 'PRG', make: function (r, sh) {
            var orig = 10 * sh.t + sh.u, rev = 10 * sh.u + sh.t;
            return numFields('Solve for the digits. State the original number and the reversed number.', [{ label: 'original' }, { label: 'reversed' }], [orig, rev], { swapCode: 'digits-reversed', swapHint: 'Those are swapped: the original has the <b>smaller</b> tens digit, since reversing makes it bigger.',
              diag: function (v) { if (near(v[0], sh.t) || near(v[0], sh.u)) return { code: 'value', hint: 'Give the whole two-digit number, ' + t('10t+u') + ', not one digit.' }; return null; },
              sol: t('u=t+' + (sh.u - sh.t)) + ', so ' + t('t+(t+' + (sh.u - sh.t) + ')=' + sh.s) + ', ' + t('2t=' + (sh.s - sh.u + sh.t)) + ', ' + t('t=' + sh.t) + ' and ' + t('u=' + sh.u) + '.<br>The number is <b>' + orig + '</b> and the reversal is <b>' + rev + '</b> ' + t('=' + orig + '+' + sh.g) + ' ✓',
              answer: orig + ' and ' + rev, hints: ['From the simplified equation, ' + t('u=t+' + (sh.u - sh.t)) + '. Substitute into ' + t('t+u=' + sh.s) + '.'], text: 'the number' });
          } }] },
      { num: '14', stem: function (sh) { return 'A lab technician mixes ' + t('x') + ' mL of a ' + sh.p1 + '% acid solution with ' + t('y') + ' mL of a ' + sh.p2 + '% acid solution to make ' + sh.V + ' mL of a ' + sh.pt + '% acid solution. The acid equation is ' + t(dc(sh.p1 / 100) + 'x+' + dc(sh.p2 / 100) + 'y=' + dc(sh.pt / 100) + '(' + sh.V + ')') + '.'; },
        shared: function (r) {
          for (var g = 0; g < 400; g++) {
            var p1 = r.pick([10, 20, 30]), p2 = r.pick([40, 50, 60, 70, 80]), pt = 10 * r.int(Math.ceil((p1 + 10) / 10), Math.floor((p2 - 10) / 10)), V = 10 * r.int(4, 12), x = V * (p2 - pt) / (p2 - p1);
            if (pt > p1 && pt < p2 && Number.isInteger(x) && x % 5 === 0 && x > 0 && x < V && x !== V / 2) return { p1: p1, p2: p2, pt: pt, V: V, x: x, y: V - x };
          }
          return { p1: 20, p2: 50, pt: 30, V: 60, x: 40, y: 20 };
        },
        parts: [
          { id: 'e14a', level: 'PRG', make: function (r, sh) {
            var g = gcd(gcd(sh.p1, sh.p2), sh.pt * sh.V / 10), a = sh.p1 / g, b = sh.p2 / g, c = sh.pt * sh.V / g;
            return sysPart('Write the volume equation, and clear the decimals from the acid equation. (Enter both equations.)', [{ A: 1, B: 1, C: -sh.V }, { A: sh.p1, B: sh.p2, C: -sh.pt * sh.V }], ['x', 'y'], { key: ['x+y=' + sh.V, pol([[a, 'x'], [b, 'y']]) + '=' + c],
              diag: function (is) {
                if (is([sh.p1, sh.p2, -sh.pt])) return { code: 'mix-total', hint: 'The right side of the acid equation is ' + sh.pt + '% <b>of ' + sh.V + ' mL</b>: ' + t(dc(sh.pt / 100) + '(' + sh.V + ')=' + dc(sh.pt * sh.V / 100)) + '.' };
                if (is([sh.p1, sh.p2, -sh.V]) || is([1, 1, -sh.pt * sh.V / 100])) return { code: 'mix-total', hint: 'One equation adds <b>volumes</b> (' + t('x+y=' + sh.V) + '); the other adds <b>acid</b>.' };
                if (is([sh.p2, sh.p1, -sh.pt * sh.V])) return { code: 'mix-swap', hint: 'Match each percent to its own volume: ' + t(sh.p1 + '\\%') + ' goes with ' + t('x') + '.' };
                if (is([sh.p1, sh.p2, -sh.pt * sh.V / 10])) return { code: 'clear-one-side', hint: 'Multiply <b>both</b> sides by the same number.' };
                return null;
              },
              sol: 'Volume: ' + t('x+y=' + sh.V) + '.<br>Acid: ' + t(dc(sh.p1 / 100) + 'x+' + dc(sh.p2 / 100) + 'y=' + dc(sh.pt * sh.V / 100)) + '. Multiply every term by ' + t('10') + ' (or ' + t('100') + '): ' + t(pol([[sh.p1 / 10, 'x'], [sh.p2 / 10, 'y']]) + '=' + sh.pt * sh.V / 10) + (g > 10 ? ', which simplifies to ' + t(pol([[a, 'x'], [b, 'y']]) + '=' + c) : '') + '.',
              hints: ['The two volumes add up to ' + sh.V + ' mL.', 'Multiply the acid equation by ' + t('10') + ' so every coefficient is a whole number.'], text: 'mixture system' });
          } },
          { id: 'e14b', level: 'PRG', make: function (r, sh) {
            var Es = [E(1, 1, sh.V), E(sh.p1 / 10, sh.p2 / 10, sh.pt * sh.V / 10)], res = subSol(Es, { iso: [0, 0], check: false });
            return numFields('Solve by substitution to find how much of each solution is used.', [{ label: sh.p1 + '% solution', after: 'mL' }, { label: sh.p2 + '% solution', after: 'mL' }], [sh.x, sh.y], { swapCode: 'mix-swap', swapHint: 'Right numbers, wrong bottles. The mixture (' + sh.pt + '%) is closer to ' + (sh.pt - sh.p1 < sh.p2 - sh.pt ? sh.p1 : sh.p2) + '%, so more of that solution is used.',
              diag: function (v) { if (!near(v[0] + v[1], sh.V)) return { code: 'mix-total', hint: 'Your two volumes must add up to ' + sh.V + ' mL.' }; return { code: 'mix-pct', hint: 'The volumes add to ' + sh.V + ' mL, but the acid doesn’t come out to ' + sh.pt + '%. Check the acid equation.' }; },
              sol: res.html + '<br>Check the acid: ' + t(dc(sh.p1 / 100) + '(' + sh.x + ')+' + dc(sh.p2 / 100) + '(' + sh.y + ')=' + dc(sh.pt * sh.V / 100)) + ' ✓<br><b>' + sh.x + ' mL</b> of the ' + sh.p1 + '% solution and <b>' + sh.y + ' mL</b> of the ' + sh.p2 + '% solution.',
              answer: sh.x + ' mL of ' + sh.p1 + '%, ' + sh.y + ' mL of ' + sh.p2 + '%', hints: ['Isolate ' + t('x') + ' in ' + t('x+y=' + sh.V) + ' and substitute into the cleared acid equation.'], text: 'mixture amounts' });
          } }] },
      { num: '15', stem: function (sh) { return 'A cash box holds ' + sh.N + ' coins, all nickels (5 cents each) and quarters (25 cents each), worth $' + (sh.cents / 100).toFixed(2) + ' in total. Let ' + t('n') + ' be the number of nickels and ' + t('q') + ' the number of quarters.'; },
        shared: function (r) { var n = r.int(6, 30), q = r.int(6, 30); while (q === n) q = r.int(6, 30); return { n: n, q: q, N: n + q, cents: 5 * n + 25 * q }; },
        parts: [
          { id: 'e15a', level: 'PRG', make: function (r, sh) {
            return sysPart('Write a system of two equations, using cents for the value equation.', [{ A: 1, B: 1, C: -sh.N }, { A: 5, B: 25, C: -sh.cents }], ['n', 'q'], { key: ['n+q=' + sh.N, '5n+25q=' + sh.cents],
              diag: function (is) {
                if (is([5, 25, -sh.cents / 100])) return { code: 'units-mix', hint: 'The coin values are in cents, so the total must be in cents too: $' + (sh.cents / 100).toFixed(2) + ' = ' + sh.cents + ' cents.' };
                if (is([25, 5, -sh.cents])) return { code: 'value-swap', hint: 'A nickel is worth 5 cents and a quarter 25 cents: ' + t('5n+25q') + '.' };
                if (is([1, 1, -sh.cents]) || is([5, 25, -sh.N])) return { code: 'count-value', hint: 'One equation counts <b>coins</b>, the other adds up their <b>value</b>.' };
                return null;
              },
              sol: 'Number of coins: ' + t('n+q=' + sh.N) + '.<br>Value in cents: ' + t('5n+25q=' + sh.cents) + '.', hints: ['Count equation: nickels + quarters = ' + sh.N + '. Value equation: each nickel is 5 cents, each quarter 25 cents.'], text: 'coin system' });
          } },
          { id: 'e15b', level: 'PRG', make: function (r, sh) {
            var res = subSol([E(1, 1, sh.N), E(5, 25, sh.cents)], { vars: ['n', 'q'], iso: [0, 0] });
            return numFields('Solve by substitution. How many of each coin are there?', [{ label: 'nickels' }, { label: 'quarters' }], [sh.n, sh.q], { sol: res.html + '<br><b>' + sh.n + ' nickels</b> and <b>' + sh.q + ' quarters</b>.', answer: sh.n + ' nickels, ' + sh.q + ' quarters',
              hints: ['Isolate ' + t('n') + ' in ' + t('n+q=' + sh.N) + ' and substitute into the value equation.'], text: 'coins' });
          } }] },
      { num: '16', section: 'Mastery challenge', stem: '<b>Stretch.</b>', parts: [
        { id: 'e16', level: 'MAS', make: function (r) {
          var p, q, s, D, ny, nx;
          for (var g = 0; g < 400; g++) { p = r.int(1, 3); q = r.int(2, 4); s = r.int(1, 3); D = q * p + 1; ny = q - s; nx = 1 + p * s; if (ny > 0 && D !== ny && nx !== ny) break; }
          var fA = function (n, d) { var gg = gcd(n, d); n /= gg; d /= gg; return d === 1 ? (n === 1 ? 'a' : n + 'a') : '\\frac{' + (n === 1 ? '' : n) + 'a}{' + d + '}'; };
          var X = fA(nx, D), Y = fA(ny, D), texs = [pol([[1, 'x'], [p, 'y']]) + '=a', q + 'x-y=' + (s === 1 ? '' : s) + 'a'];
          var chk1 = function (f, nm) { return function (resp) {
            var s0 = String(resp || '').trim(); if (!s0) return form('empty', 'Fill in both boxes.');
            var a = ex.parse(s0); if (!a.ok) return form('unreadable', 'I can’t read the expression for ' + t(nm) + '. Use the fraction key.');
            var vals = [1, 2, 7, -3].map(function (k) { return ex.value(a.ast, { a: k }); });
            if (vals.some(function (v) { return !isFinite(v); })) return form('unreadable', 'Write ' + t(nm) + ' using only the letter ' + t('a') + '.');
            if ([1, 2, 7, -3].every(function (k, i) { return near(vals[i], f(k)); })) return ok();
            return wrong('u8l4-a-expr', null);
          }; };
          var fx = function (k) { return nx * k / D; }, fy = function (k) { return ny * k / D; };
          var chk = function (resp) {
            resp = resp || []; var r1 = chk1(fx, 'x')(resp[0]), r2 = chk1(fy, 'y')(resp[1]);
            if (r1.v === 'correct' && r2.v === 'correct') return ok();
            if (chk1(fy, 'x')(resp[0]).v === 'correct' && chk1(fx, 'y')(resp[1]).v === 'correct') return wrong('swap-answer', 'Your two expressions are in the wrong boxes.');
            var bad = r1.v !== 'correct' ? r1 : r2, nm = r1.v !== 'correct' ? 'x' : 'y';
            return { v: bad.v, code: bad.code, hint: '<b>' + t(nm) + ':</b> ' + (bad.hint || 'Not right for every ' + t('a') + ' — test it with ' + t('a=' + D) + ' in both equations.') };
          };
          var sol = 'Isolate ' + t('x') + ': ' + t('x=a' + term(-p, 'y', false)) + '.<br>Substitute into ' + t(texs[1]) + ': ' + t(q + '(a' + term(-p, 'y', false) + ')-y=' + (s === 1 ? '' : s) + 'a') + ', so ' + t(q + 'a' + term(-q * p, 'y', false) + '-y=' + (s === 1 ? '' : s) + 'a') + '.<br>' +
            t(term(-D, 'y', true) + '=' + term(s - q, 'a', true)) + ', so ' + t('y=' + Y) + '.<br>Back-substitute: ' + t('x=a' + (p === 1 ? '-' : '-' + p + '\\cdot') + '\\left(' + Y + '\\right)=' + X) + '.<br>' +
            'Check: ' + t(X + (p === 1 ? '+' : '+' + p + '\\cdot') + Y + '=a') + ' ✓ and ' + t(q + '\\cdot' + X + '-' + Y + '=' + (s === 1 ? '' : s) + 'a') + ' ✓';
          return { prompt: 'The system below has a constant ' + t('a') + ' in place of the usual numbers. Isolate ' + t('x') + ' in the first equation and substitute, then solve for ' + t('x') + ' and ' + t('y') + ' <b>in terms of ' + t('a') + '</b>.' + sysD(texs),
            input: { type: 'fields', fields: [{ label: t('x='), mode: 'math', keys: 'poly', vars: ['a'], placeholder: ' ' }, { label: t('y='), mode: 'math', keys: 'poly', vars: ['a'], placeholder: ' ' }] }, check: chk,
            key: [X, Y], answer: t('x=' + X) + ', ' + t('y=' + Y), solution: sol,
            hints: ['Treat ' + t('a') + ' like a number. Isolate ' + t('x=a' + term(-p, 'y', false)) + ' and substitute.', 'Collect the ' + t('y') + '-terms on one side and the ' + t('a') + '-terms on the other, then divide.'], text: 'solve in terms of a', bad: [[Y, X]] };
        } }] },
      { num: '17', stem: '<i>(Mixed Review)</i> Solve each system completely, choosing the most efficient variable to isolate.', parts: [
        { id: 'e17a', level: 'EMG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [[0, 0, 1]], { xr: [-4, 4], yr: [-4, 4] }, [1, -3, -1, 5, 2, 12])); } },
        { id: 'e17b', level: 'PRG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [], { xr: [-4, 3], yr: [-3, 4] }, [3, 4, -1, 5, -2, -19]), ['No coefficient is ' + t('1') + ' or ' + t('-1') + ': isolate the variable with the smallest coefficient.']); } },
        { id: 'e17c', level: 'EMG', make: function (r) { return solvePart('Solve. Give the solution as an ordered pair.', sysGen(r, [[0, 0, -1]], { xr: [-4, 4], yr: [-4, 4] }, [-1, 2, 9, 4, 3, -3])); } }] }
    ]
  });

  /* clear fractions/decimals from one equation: any equivalent equation with whole-number coefficients */
  function clearPart(prompt, e, mult, sol) {
    var tgt = sysA(e), keyE = E(qm(e.a, mult), qm(e.b, mult), qm(e.c, mult));
    var chk = function (resp) {
      var rr = LN.read(resp, ['x', 'y']);
      if (!rr.ok) return form(rr.why === 'empty' ? 'empty' : 'unreadable', rr.why === 'empty' ? 'Type your equation first.' : 'I can’t read that equation. Write it like ' + t('3x+2y=24') + '.');
      var L = [rr.a, rr.b, rr.c], isI = function (v) { return Math.abs(v - Math.round(v)) < 1e-9; };
      if (LN.same(L, tgt)) return [rr.a, rr.b, rr.c].every(isI) && !/\\frac|\.|\//.test(String(resp)) ? ok() : form('u8l4-not-cleared', 'Right equation — but it still has fractions or decimals. Multiply every term by ' + t(mult) + '.');
      if (near(rr.a / (rr.b || 1), qv(e.a) / qv(e.b)) && near(-rr.c / (rr.b || 1), qv(e.c) / qv(e.b) / mult)) return wrong('clear-one-side', 'The left side is right, but the right side must be multiplied by ' + t(mult) + ' too.');
      return wrong('u8-clear-frac', 'Multiply <b>every</b> term — on both sides — by ' + t(mult) + '.');
    };
    var p = B.math(prompt, chk, eqT(keyE), sol, ['Multiply every term on both sides by ' + t(mult) + '.'], 'clear', { keys: 'eq', vars: ['x', 'y'], placeholder: 'e.g. 3x + 2y = 24' });
    p.bad = [pol([[keyE.a, 'x'], [keyE.b, 'y']]) + '=' + qT(e.c)];
    return p;
  }
})(window);
