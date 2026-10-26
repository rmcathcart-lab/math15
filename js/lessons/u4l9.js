/* Math 15 · Unit 4 · Lesson 9 — Solving Polynomial Equations by Factoring (AN5)
 * Assignment 9 (u4_L09.tex, questions 1–15) and the Lesson 9 Extra Practice (u4_EP09.tex, questions 1–23).
 * New for Math 15 (no 10C twin). Every equation is built from its roots: Eq({ fs: [[a, b], …], k, rhs | prod }) is
 * k·∏(a x + b) = 0, shown either factored, expanded, rearranged (LHS = P + R, RHS = R) or as a product equal to a
 * number ((x − 3)(x + 9) = 13), so the solutions, the worked solution and the classic wrong answers all come from
 * the same numbers. Solutions are typed in one box in any order with K.P.valueSet (js/relfn.js: "x = 3, x = −8",
 * "3, −8", "±6", fractions), the engine's input for "list the solutions in any order". Check-by-substitution steps
 * are chip selections (which candidates satisfy the original equation?), so they never give the roots away.
 * Diagnoses: a root with the wrong sign, ax + b = 0 solved as x = −b (no divide) or upside down, the root 0 lost by
 * dividing by x, a "root" taken from the constant in front, and a product ≠ 0 split factor by factor.
 * Levels (Math 15): BEG ZPP on a factored equation / one-step factoring; EMG a zero root, a constant in front, a
 * rearrangement; PRG decomposition (fraction roots), rearranging both sides; ADV expand-then-rearrange, working
 * backwards (k from a root, equations from roots); MAS four roots of a quartic (extra 13a), an equation from a fraction
 * root (extra 15c). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, P = HW.poly, FA = HW.factor, ex = HW.ex;

  HW.addCodes({
    'sol-sign-one': 'One solution has the wrong sign', 'sol-flip': 'Solved ax + b = 0 upside down',
    'u4l9-no-divide': 'Solved ax + b = 0 as x = −b (did not divide by a)', 'u4l9-lost-zero': 'Lost the root x = 0 (divided by x)', 'u4l9-constant-root': 'Took a root from the constant factor',
    'u4l9-not-zero': 'Split a product that is not equal to 0', 'u4l9-not-rearranged': 'Factored without making one side 0', 'u4l9-pick': 'Wrong choice of root in context',
    'u4l9-k-sign': 'Sign slip finding k', 'u4l9-sq-neg': 'Squared a negative number as negative', 'u4l9-pq': 'p + q from the wrong root or not in lowest terms', 'u4l9-eq-root-sign': 'Equation from roots: factor signs wrong',
    'u4l9-eq-not-int': 'Equation from roots: fraction coefficients left', 'u4l9-check': 'Check by substitution: wrong values chosen', 'u4l9-dims': 'Dimensions wrong or in the wrong boxes'
  });
  HW.addPartial({ 'u4l9-no-divide': 's', 'u4l9-lost-zero': 's', 'u4l9-constant-root': 's', 'u4l9-not-zero': 'n', 'u4l9-not-rearranged': 'n', 'u4l9-pick': 'b',
    'u4l9-k-sign': 's', 'u4l9-sq-neg': 's', 'u4l9-pq': 'b', 'u4l9-eq-root-sign': 's', 'u4l9-eq-not-int': 'b', 'u4l9-check': 'n', 'u4l9-dims': 's' });

  /* ---------------- helpers ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function M(c, v) { var o = {}; if (typeof v === 'string') { if (v) o[v] = 1; } else if (v) o = v; return P.mono(c, o); }
  function N(c) { return P.num(c); }
  function S() { return P.add.apply(null, arguments); }
  function tx(p, o) { return P.tex(p, o); }
  function nn(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function rt(a, b) { return ex.norm(-b, a); }                  // root of a x + b
  function rv(r) { return r[0] / r[1]; }
  function rtex(r) { return ex.texRat(r); }
  function mcPart(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  function uniqR(list) { var out = []; list.forEach(function (x) { if (!out.some(function (y) { return y[0] === x[0] && y[1] === x[1]; })) out.push(x); }); return out; }

  /* An equation built from its factors: k·∏(a v + b) = 0, displayed as o.show:
   *   'factored'  k(a v + b)(…) = 0          'expanded'  P = 0
   *   'rhs'       P + R = R (o.R a polynomial; terms move across)
   *   'prod'      (given factors) = c         (o.Q: list of [a, b]; P = Q − c) */
  function Eq(o) {
    var v = o.v || 'x', V = M(1, v), k = o.k == null ? 1 : o.k;
    var lin = function (f) { return S(M(f[0], v), N(f[1])); };
    var Pp = o.fs.reduce(function (acc, f) { return P.mul(acc, lin(f)); }, N(k)), E = { v: v, k: k, fs: o.fs, P: Pp };
    E.roots = uniqR(o.fs.map(function (f) { return rt(f[0], f[1]); }));
    E.vals = E.roots.map(function (r) { return r[1] === 1 ? r[0] : r; });
    E.ptex = tx(Pp); E.ftex = (k === 1 ? '' : k === -1 ? '-' : String(k)) + o.fs.map(function (f) { var s = tx(lin(f)); return s === v ? v : '(' + s + ')'; }).join('').replace(/^(\d*)\(([a-z])\)/, '$1$2');
    if (o.fs.some(function (f) { return f[1] === 0; })) { // write the bare variable factor first, e.g. 3x(x+5)
      var bare = o.fs.filter(function (f) { return f[1] === 0; }), rest = o.fs.filter(function (f) { return f[1] !== 0; });
      E.ftex = (k === 1 ? '' : k === -1 ? '-' : String(k)) + bare.map(function (f) { return f[0] === 1 ? v : f[0] + v; }).join('') + rest.map(function (f) { return '(' + tx(lin(f)) + ')'; }).join('');
    }
    if (o.sq) E.ftex = (k === 1 ? '' : String(k)) + '(' + tx(lin(o.fs[0])) + ')^{2}';
    var show = o.show || 'expanded';
    if (show === 'factored') { E.lhs = o.ftexShow || E.ftex; E.rhs = '0'; }
    else if (show === 'expanded') { E.lhs = E.ptex; E.rhs = '0'; }
    else if (show === 'rhs') { E.R = o.R; E.lhs = o.lhsTex || tx(S(Pp, o.R)); E.rhs = o.rhsTex || tx(o.R); }
    else if (show === 'prod') { E.Q = o.Q; E.c = o.c; E.qtex = o.Q.map(function (f) { var s = tx(lin(f)); return s === v ? v : '(' + s + ')'; }).join('').replace(/^\(([a-z])\)/, '$1'); if (o.qsq) E.qtex = '(' + tx(lin(o.Q[0])) + ')^{2}'; E.lhs = E.qtex; E.rhs = String(o.c); }
    E.show = show; E.tex = E.lhs + '=' + E.rhs; E.lin = lin;
    return E;
  }
  function rootsTex(E) { return E.roots.map(function (r) { return E.v + '=' + rtex(r); }).join(',\\ '); }
  function solveLines(E, o) {
    o = o || {}; var L = [], v = E.v;
    if (E.show === 'prod') {
      var Qp = E.Q.reduce(function (acc, f) { return P.mul(acc, E.lin(f)); }, N(1));
      L.push('The product equals ' + t(E.c) + ', not ' + t('0') + ', so expand first: ' + t(E.qtex + '=' + tx(Qp)) + ', so ' + t(tx(Qp) + '=' + E.c) + '.');
      L.push('Make one side zero: ' + t(E.ptex + '=0') + '.');
    } else if (E.show === 'rhs') {
      L.push('Move every term to one side: ' + t(E.lhs + '=' + E.rhs) + ' becomes ' + t(E.ptex + '=0') + '.');
    }
    if (E.show !== 'factored') L.push('Factor' + (o.how ? ' (' + o.how + ')' : '') + ': ' + t(E.ftex + '=0') + '.');
    if (E.k !== 1) L.push('The constant ' + t(E.k) + ' is never ' + t('0') + ', so it gives no solution.');
    var parts = [];
    E.fs.forEach(function (f, i) {
      if (E.fs.slice(0, i).some(function (g) { return g[0] === f[0] && g[1] === f[1]; })) return;
      var s = tx(E.lin(f)), r = rt(f[0], f[1]);
      if (f[1] === 0) parts.push(t((f[0] === 1 ? v : f[0] + v) + '=0') + ' gives ' + t(v + '=0'));
      else if (f[0] === 1) parts.push(t(s + '=0') + ' gives ' + t(v + '=' + rtex(r)));
      else parts.push(t(s + '=0') + ' gives ' + t(f[0] + v + '=' + (-f[1])) + ', so ' + t(v + '=' + rtex(r)));
    });
    L.push('Zero product property: ' + parts.join('; ') + '.');
    if (E.sq) L.push('Both factors are the same, so there is only one solution (a double root).');
    L.push('Solutions: ' + t(rootsTex(E)) + '.');
    return L;
  }
  /* wrong-answer sets for the diagnoses */
  function diagFor(E) {
    var T = E.roots.map(rv), near = function (x, y) { return Math.abs(x - y) < 1e-9; };
    var setEq = function (A, B2) { return A.length === B2.length && A.every(function (x) { return B2.some(function (y) { return near(x, y); }); }); };
    var noDiv = uniqR(E.fs.map(function (f) { return f[1] === 0 ? [0, 1] : [-f[1], 1]; })).map(rv);
    var flip = uniqR(E.fs.map(function (f) { return f[1] === 0 ? [0, 1] : ex.norm(-f[0], f[1]); })).map(rv);
    var lostZero = T.filter(function (x) { return !near(x, 0); });
    return function (A) {
      if (E.fs.some(function (f) { return f[0] !== 1 && f[1] !== 0; }) && setEq(A, noDiv)) return { code: 'u4l9-no-divide', hint: 'Finish each small equation: for ' + t(E.fs.filter(function (f) { return f[0] !== 1 && f[1] !== 0; }).map(function (f) { return tx(E.lin(f)) + '=0'; })[0]) + ', move the constant <b>and</b> divide by the coefficient of ' + t(E.v) + '.' };
      if (E.fs.some(function (f) { return f[0] !== 1 && f[1] !== 0; }) && setEq(A, flip)) return { code: 'sol-flip', hint: 'Check your fractions: if ' + t('2' + E.v + '=3') + ' then ' + t(E.v + '=\\frac{3}{2}') + ' — divide by the coefficient of ' + t(E.v) + '.' };
      if (T.some(function (x) { return near(x, 0); }) && lostZero.length && setEq(A, lostZero)) return { code: 'u4l9-lost-zero', hint: 'You are missing a solution. The factor ' + t(E.v) + ' on its own gives ' + t(E.v + '=0') + ' — never divide both sides by ' + t(E.v) + '.' };
      if (E.k !== 1 && A.some(function (x) { return near(Math.abs(x), Math.abs(E.k)); }) && !T.some(function (x) { return near(Math.abs(x), Math.abs(E.k)); })) return { code: 'u4l9-constant-root', hint: 'The constant ' + t(E.k) + ' in front can never equal ' + t('0') + ', so it gives no solution. Only the factors containing ' + t(E.v) + ' do.' };
      if (A.length === T.length && T.length >= 2) {
        var wrongSign = A.filter(function (x) { return !T.some(function (y) { return near(x, y); }); });
        if (wrongSign.length === 1 && T.some(function (y) { return near(-wrongSign[0], y); }) && !A.some(function (x) { return near(x, -wrongSign[0]); })) return { code: 'sol-sign-one', hint: 'One solution has the wrong sign: if ' + t(E.v + '-3=0') + ' then ' + t(E.v + '=3') + ', and if ' + t(E.v + '+3=0') + ' then ' + t(E.v + '=-3') + '.' };
      }
      if (E.notZero && setEq(A, E.notZero)) return { code: 'u4l9-not-zero', hint: 'The zero product property only works when the product equals ' + t('0') + '. Expand, move ' + t(E.c) + ' across so one side is ' + t('0') + ', then factor again.' };
      if (E.unrearranged && setEq(A, E.unrearranged)) return { code: 'u4l9-not-rearranged', hint: 'Move every term to one side first, so the equation equals ' + t('0') + ' — then factor.' };
      return null;
    };
  }
  function solvePart(E, o) {
    o = o || {};
    var p = K.P.valueSet(o.prompt || t(E.tex), E.vals, { v: E.v, diag: diagFor(E) }, o.sol || solveLines(E, o).join('<br>'), o.hints || hintsFor(E, o), o.text || 'solve ' + E.tex);
    var bad = [], T = E.roots, key = T.map(rv).sort().join('|');
    var add = function (rs) { rs = uniqR(rs); if (rs.map(rv).sort().join('|') !== key) bad.push(rs.map(function (x) { return E.v + '=' + rtex(x); }).join(', ')); };
    if (T.length > 1) add([T[0]]); // one solution only
    add(T.map(function (x) { return [-x[0], x[1]]; }));
    if (E.fs.some(function (f) { return f[0] !== 1 && f[1] !== 0; })) add(E.fs.map(function (f) { return [f[1] === 0 ? 0 : -f[1], 1]; }));
    if (E.notZero) add(E.notZero.map(function (x) { return ex.norm(Math.round(x * 2), 2); }));
    if (T.some(function (x) { return x[0] === 0; }) && T.length > 1) add(T.filter(function (x) { return x[0] !== 0; }));
    if (E.k !== 1 && E.k > 0) add(T.concat([[E.k, 1]]));
    p.bad = bad;
    p.good = [T.map(function (r) { return rtex(r); }).reverse().join(', '), T.map(function (r) { return E.v + '=' + rtex(r); }).join('\\text{ or }')];
    return p;
  }
  function hintsFor(E, o) {
    var h = [];
    if (E.show === 'prod') h.push('The product is ' + t(E.c) + ', not ' + t('0') + '. Expand the left side and move ' + t(E.c) + ' across first.');
    else if (E.show === 'rhs') h.push('Move every term to the left side so the right side is ' + t('0') + '.');
    else if (E.show === 'expanded') h.push('Factor the left side completely' + (o && o.how ? ' (' + o.how + ')' : '') + '.');
    h.push('Set each factor that contains ' + t(E.v) + ' equal to ' + t('0') + ' and solve.');
    return h.slice(0, 2);
  }
  /* "which of these values satisfy the original equation?" (check by substitution) */
  function checkPart(r, E, prompt) {
    var cands = E.roots.slice();
    E.roots.forEach(function (x) { var n = [-x[0], x[1]]; if (!cands.some(function (y) { return y[0] === n[0] && y[1] === n[1]; })) cands.push(n); });
    if (cands.length < 4) { var extra = [E.roots[0][0] + E.roots[0][1], E.roots[0][1]]; extra = ex.norm(extra[0], extra[1]); if (!cands.some(function (y) { return y[0] === extra[0] && y[1] === extra[1]; })) cands.push(extra); }
    var shuffled = r.shuffle(cands), key = E.roots.map(rtex);
    var lhsAt = function (x) { return evalTex(E, x); };
    var lines = cands.map(function (x) { var good = E.roots.some(function (y) { return y[0] === x[0] && y[1] === x[1]; }); return t(E.v + '=' + rtex(x)) + ': ' + lhsAt(x) + (good ? ' ✓' : ' ✗'); });
    var chk = K.selectSet(key, function (extra, miss) {
      if (extra.length) return { code: 'u4l9-check', hint: 'Substitute ' + t(E.v + '=' + extra[0]) + ' into the <b>original</b> equation: ' + lhsAt(texToRat(extra[0])) + '.' };
      return { code: 'u4l9-check', hint: 'One of the values you left out also works — substitute it into the original equation.' };
    });
    return { prompt: prompt || 'Check by substitution: which of these values satisfy ' + t(E.tex) + '? Tap every one that works.', input: { type: 'select', options: shuffled.map(function (x) { return { value: rtex(x), html: t(E.v + '=' + rtex(x)) }; }), help: 'Substitute each value into the <b>original</b> equation. Tap every one that makes it true.' },
      check: chk, key: key, answer: t(key.map(function (s) { return E.v + '=' + s; }).join(',\\ ')), solution: 'Substitute each value into the original equation:<br>' + lines.join('<br>'),
      hints: ['Substitute each value into the left side and compare it with the right side, ' + t(E.rhs) + '.'], text: 'check ' + E.tex, bad: [cands.filter(function (x) { return !E.roots.some(function (y) { return y[0] === x[0] && y[1] === x[1]; }); }).map(rtex), [key[0]]] };
  }
  function texToRat(s) { var m = /^(-?)\\frac\{(\d+)\}\{(\d+)\}$/.exec(s); if (m) return [(m[1] ? -1 : 1) * Number(m[2]), Number(m[3])]; return [Number(s), 1]; }
  /* the original equation with a value substituted: "(4)^2 − 2(4) = 16 − 8 = 8 = 8 ✓" (integers only; fractions shown as a value) */
  function evalTex(E, x) {
    var xv = rv(x), lhsP = E.show === 'prod' ? E.Q.reduce(function (acc, f) { return P.mul(acc, E.lin(f)); }, N(1)) : E.show === 'rhs' ? S(E.P, E.R) : E.P;
    var rhsV = E.show === 'prod' ? E.c : E.show === 'rhs' ? P.at(E.R, valEnv(E, xv)) : 0, lhsV = P.at(lhsP, valEnv(E, xv));
    var shown = rtex(x), sub = function (s) { return s.replace(new RegExp(E.v, 'g'), '(' + shown + ')'); };
    var L = E.show === 'prod' ? sub(E.qtex) : sub(E.lhs), R = E.show === 'rhs' ? sub(E.rhs) : E.rhs;
    var lv = Math.round(lhsV * 1e9) / 1e9, rvv = Math.round(rhsV * 1e9) / 1e9;
    return t(L + '=' + fmtNum(lv)) + (E.show === 'rhs' && /[a-z]/.test(E.rhs) ? ' and ' + t(R + '=' + fmtNum(rvv)) : '') + (Math.abs(lv - rvv) < 1e-9 ? ' — equal' : ' — not ' + t(fmtNum(rvv)));
  }
  function valEnv(E, xv) { var o = {}; o[E.v] = xv; return o; }
  function fmtNum(x) { if (Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x)); for (var q = 2; q <= 64; q++) { var p = x * q; if (Math.abs(p - Math.round(p)) < 1e-9) return ex.texRat(ex.norm(Math.round(p), q)); } return String(x); }

  /* ---------------- generators ---------------- */
  function two(r, lo, hi, test) { for (var i = 0; i < 400; i++) { var a = r.int(lo[0], lo[1]), b = r.int(hi[0], hi[1]); if (a && b && a !== b && (!test || test(a, b))) return [a, b]; } return null; }
  function monicEq(r, sp, extra) { var ab = two(r, sp.a, sp.b, sp.test) || sp.book; return Eq(Object.assign({ fs: [[1, -ab[0]], [1, -ab[1]]] }, extra || {})); } // roots ab[0], ab[1]
  function decEq(r, sp, extra) { // (a x + b)(c x + d): primitive brackets, at least one a ≠ 1
    for (var i = 0; i < 800; i++) {
      var a = val(r, sp.a), b = val(r, sp.b), c = val(r, sp.c), d = val(r, sp.d);
      if (!b || !d || gcd(a, b) !== 1 || gcd(c, d) !== 1 || (a === c && b === d) || a * d + b * c === 0) continue;
      if (sp.test && !sp.test({ a: a, b: b, c: c, d: d, A: a * c, Bm: a * d + b * c, C: b * d })) continue;
      return Eq(Object.assign({ fs: [[a, b], [c, d]] }, extra || {}));
    }
    return Eq(Object.assign({ fs: sp.book }, extra || {}));
  }
  function LV(r) { return r.pick(['x', 'x', 'x', 'y', 'a', 'm']); }
  function val(r, x) { return typeof x === 'number' ? x : Array.isArray(x) ? r.int(x[0], x[1]) : r.pick(x.of); }
  /* move part of P to the right: R = −(terms of P chosen), so LHS = P + R keeps the other terms */
  function moveRight(E, which) { // which: 'c' (constant across), 'bc' (x term and constant across), 'x' (x-term across)
    var ts = P.terms(E.P), R = N(0);
    ts.forEach(function (T) { var deg = Object.keys(T.v).reduce(function (s, x) { return s + T.v[x]; }, 0); var o = {}; o[T.key] = T; if ((which === 'c' && deg === 0) || (which === 'bc' && deg <= 1) || (which === 'x' && deg === 1)) R = P.sub(R, o); });
    return R;
  }
  function rhsEq(E, which) { var R = moveRight(E, which); var F = Eq({ fs: E.fs, k: E.k, v: E.v, show: 'rhs', R: R }); F.unrearranged = null; return F; }

  HW.defineLesson({
    id: 'u4l9', unit: 4, num: '9', title: 'Solving Polynomial Equations by Factoring', outcome: 'AN5',
    blurb: 'The zero product property: make one side 0, factor completely, set each factor equal to 0, and solve. Check each root in the original equation.',
    questions: [
      { num: '1', section: 'Part A — The Zero Product Property', stem: 'Solve each equation using the Zero Product Property. Type the solutions separated by a comma, e.g. ' + t('x=3,\\ x=-5') + '.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { var ab = two(r, [1, 9], [-12, -1], function (a, b) { return a + b !== 0; }) || [3, -8]; return solvePart(Eq({ fs: [[1, -ab[0]], [1, -ab[1]]], show: 'factored' })); } },
        { id: '1b', level: 'BEG', make: function (r) { var ab = two(r, [-9, -1], [1, 9], function (a, b) { return a + b !== 0; }) || [-5, 1]; return solvePart(Eq({ fs: [[1, -ab[0]], [1, -ab[1]]], show: 'factored' })); } },
        { id: '1c', level: 'BEG', make: function (r) { var ab = two(r, [-12, -1], [-9, -1]) || [-10, -2]; return solvePart(Eq({ fs: [[1, -ab[0]], [1, -ab[1]]], show: 'factored' })); } },
        { id: '1d', level: 'EMG', make: function (r) { var ab = two(r, [1, 9], [-9, -1], function (a, b) { return a + b !== 0; }) || [7, -4]; return solvePart(Eq({ k: r.int(2, 9), fs: [[1, -ab[0]], [1, -ab[1]]], show: 'factored' })); } },
        { id: '1e', level: 'EMG', make: function (r) { var a = r.int(2, 15) * r.pick([1, 1, -1]); return solvePart(Eq({ fs: [[1, 0], [1, -a]], show: 'factored' })); } },
        { id: '1f', level: 'EMG', make: function (r) { var a = r.int(1, 12) * r.pick([1, -1, -1]); return solvePart(Eq({ k: r.int(2, 7), fs: [[1, 0], [1, -a]], show: 'factored' })); } }] },
      { num: '2', stem: 'Solve each equation by factoring.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var n = r.int(2, 12); return solvePart(Eq({ v: LV(r), fs: [[1, -n], [1, n]] }), { how: 'difference of squares' }); } },
        { id: '2b', level: 'EMG', make: function (r) { var a = r.int(2, 15); return solvePart(Eq({ v: LV(r), fs: [[1, 0], [1, a]] }), { how: 'GCF' }); } },
        { id: '2c', level: 'BEG', make: function (r) { return solvePart(monicEq(r, { a: [1, 9], b: [1, 9], test: function (a, b) { return a < b && a * b <= 45; }, book: [3, 5] }), { how: 'inspection' }); } },
        { id: '2d', level: 'EMG', make: function (r) { return solvePart(monicEq(r, { a: [-9, -1], b: [1, 9], test: function (a, b) { return a + b < 0 && a * b >= -45; }, book: [-5, 4] }), { how: 'inspection' }); } },
        { id: '2e', level: 'EMG', make: function (r) { var a = r.int(2, 15); return solvePart(Eq({ v: LV(r), fs: [[1, 0], [1, -a]] }), { how: 'GCF' }); } },
        { id: '2f', level: 'BEG', make: function (r) { var n = r.int(4, 15); return solvePart(Eq({ v: LV(r), fs: [[1, -n], [1, n]] }), { how: 'difference of squares' }); } }] },
      { num: '3', section: 'Part B — Rearranging Before Factoring', stem: 'Solve each equation. Rearrange first so one side is ' + t('0') + '.', parts: [
        { id: '3a', level: 'EMG', make: function (r) { return solvePart(rhsEq(monicEq(r, { a: [-9, -1], b: [1, 9], test: function (a, b) { return a + b < 0 && a * b >= -40; }, book: [-8, 1] }), 'c')); } },
        { id: '3b', level: 'PRG', make: function (r) { return solvePart(rhsEq(monicEq(r, { a: [1, 9], b: [-6, -1], test: function (a, b) { return a + b > 0 && a * b >= -40; }, book: [6, -1] }), 'bc')); } },
        { id: '3c', level: 'EMG', make: function (r) { return solvePart(rhsEq(monicEq(r, { a: [1, 9], b: [-6, -1], test: function (a, b) { return a + b > 0 && a * b >= -40; }, book: [5, -3] }), 'c')); } },
        { id: '3d', level: 'EMG', make: function (r) { return solvePart(rhsEq(monicEq(r, { a: [-9, -1], b: [1, 9], test: function (a, b) { return a + b < 0 && a * b >= -40; }, book: [-7, 3] }), 'c')); } }] },
      { num: '4', stem: function (sh) { return 'Solve each equation, then check both solutions by substituting into the original equation.'; },
        shared: function (r) {
          return { A: rhsEq(monicEq(r, { a: [1, 9], b: [-6, -1], test: function (a, b) { return a + b > 0 && a * b >= -30; }, book: [4, -2] }), 'c'),
            B: rhsEq(monicEq(r, { a: [-9, -1], b: [1, 8], test: function (a, b) { return a + b < 0 && a * b >= -40; }, book: [-3, 2] }), 'c') };
        },
        parts: [
          { id: '4a1', sub: 'a solve', level: 'EMG', make: function (r, sh) { return solvePart(sh.A, { prompt: '(a) ' + t(sh.A.tex) }); } },
          { id: '4a2', sub: 'a check', level: 'BEG', make: function (r, sh) { return checkPart(r, sh.A); } },
          { id: '4b1', sub: 'b solve', level: 'EMG', make: function (r, sh) { return solvePart(sh.B, { prompt: '(b) ' + t(sh.B.tex) }); } },
          { id: '4b2', sub: 'b check', level: 'BEG', make: function (r, sh) { return checkPart(r, sh.B); } }] },
      { num: '5', section: 'Part C — Decomposition and Mixed Practice', stem: 'Solve each equation using decomposition (leading coefficient not equal to ' + t('1') + ').', parts: [
        { id: '5a', level: 'PRG', make: function (r) { return solvePart(decEq(r, { a: [2, 3], b: [1, 5], c: 1, d: [1, 6], test: function (o) { return o.Bm <= 20; }, book: [[2, 1], [1, 3]] }), { how: 'decomposition' }); } },
        { id: '5b', level: 'PRG', make: function (r) { return solvePart(decEq(r, { a: [2, 5], b: [1, 5], c: 1, d: [-6, -1], test: function (o) { return o.Bm < 0 && o.C >= -20; }, book: [[3, 1], [1, -2]] }), { how: 'decomposition' }); } },
        { id: '5c', level: 'PRG', make: function (r) { return solvePart(decEq(r, { a: [2, 3], b: [1, 7], c: 1, d: [-5, -1], test: function (o) { return o.Bm < 0 && o.C >= -30; }, book: [[2, 3], [1, -2]] }), { how: 'decomposition' }); } }] },
      { num: '6', stem: function (sh) { return 'Consider ' + t(sh.E.tex) + '.'; },
        shared: function (r) { return { E: prodEq(r, { book: { q: [-3, 9], c: 13 } }) }; },
        parts: [
          { id: '6a', level: 'EMG', make: function (r, sh) {
            var E = sh.E, q = E.Q;
            return mcPart(r, '(a) Why can you <b>not</b> solve it by setting ' + t(tx(E.lin(q[0])) + '=' + E.c) + ' and ' + t(tx(E.lin(q[1])) + '=' + E.c) + '?', [
              { html: 'The zero product property only works when the product equals ' + t('0') + '. Two numbers can multiply to ' + t(E.c) + ' in many ways, so neither factor has to be ' + t(E.c) + '.', right: true },
              { html: 'Because ' + t(E.c) + ' is not a perfect square.', why: 'Perfect squares have nothing to do with it. What does the zero product property need on the right side?' },
              { html: 'You can — that method is correct, it just takes longer.', why: 'Try it: the values it gives don’t satisfy the equation. Only a product equal to ' + t('0') + ' can be split this way.' },
              { html: 'Because the factors should be set equal to ' + t(-E.c) + ' instead.', why: 'No split works for a product that isn’t ' + t('0') + '. Expand and move ' + t(E.c) + ' across first.' }],
              'If ' + t('A\\cdot B=0') + ' then ' + t('A=0') + ' or ' + t('B=0') + ' — but ' + t('A\\cdot B=' + E.c) + ' tells you nothing about ' + t('A') + ' or ' + t('B') + ' alone (for example ' + t('1\\times' + E.c) + ', or ' + t('2\\times' + fmtNum(E.c / 2)) + '). Expand and make one side ' + t('0') + ' first.',
              ['What is special about the number ' + t('0') + ' in the zero product property?'], 'why not split = c');
          } },
          { id: '6b', level: 'ADV', make: function (r, sh) { return solvePart(sh.E, { prompt: '(b) Solve ' + t(sh.E.tex) + ' correctly.' }); } }] },
      { num: '7', stem: 'Solve.', parts: [
        { id: '7', level: 'EMG', make: function (r) { var a = r.int(2, 12) * r.pick([1, 1, -1]); return solvePart(Eq({ fs: [[1, 0], [1, -a]] }), { how: 'GCF' }); } }] },
      { num: '8', stem: 'Solve.', parts: [
        { id: '8', level: 'PRG', make: function (r) { return solvePart(decEq(r, { a: [2, 3], b: [-5, 5], c: 1, d: [-5, 5], test: function (o) { return o.C < 0 && o.Bm > 0 && o.C >= -20; }, book: [[2, -1], [1, 2]] }), { how: 'decomposition' }); } }] },
      { num: '9', stem: function (sh) { return 'Solve ' + t(sh.E.tex) + ', then verify both roots by substitution.'; },
        shared: function (r) { return { E: rhsEq(monicEq(r, { a: [-9, -1], b: [1, 6], test: function (a, b) { return a + b < 0 && a * b >= -40; }, book: [-8, 2] }), 'c') }; },
        parts: [
          { id: '9a', sub: 'solve', level: 'EMG', make: function (r, sh) { return solvePart(sh.E, { prompt: 'Solve ' + t(sh.E.tex) + '.' }); } },
          { id: '9b', sub: 'check', level: 'BEG', make: function (r, sh) { return checkPart(r, sh.E); } }] },
      { num: '10', stem: 'Solve.', parts: [
        { id: '10', level: 'PRG', make: function (r) { var ab = coprime(r, 2, 5, 1, 11) || [2, 5]; return solvePart(Eq({ fs: [[ab[0], -ab[1]], [ab[0], ab[1]]] }), { how: 'difference of squares' }); } }] },
      { num: '11', stem: 'Solve.', parts: [
        { id: '11', level: 'PRG', make: function (r) { return solvePart(decEq(r, { a: 3, b: [1, 5], c: 1, d: [1, 6], test: function (o) { return o.Bm <= 25; }, book: [[3, 2], [1, 3]] }), { how: 'decomposition' }); } }] },
      { num: '12', stem: 'Solve.', parts: [
        { id: '12', level: 'PRG', make: function (r) { return solvePart(rhsEq(monicEq(r, { a: [1, 9], b: [1, 9], test: function (a, b) { return a * b <= 40 && a > b; }, book: [5, 2] }), 'bc')); } }] },
      { num: '13', section: 'Part D — Multiple Choice and Numerical Response', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '13', level: 'EMG', make: function (r) {
          var E = prodEq(r, { mono: true, book: { q: [0, -3], c: 10 } }), a = E.roots[0][0], b = E.roots[1][0];
          var opt = function (x, y) { return t(E.v + '=' + x) + ' and ' + t(E.v + '=' + y); };
          var cand = [[a, b], [-a, -b], [a, -b], [-a, b]];
          var o2 = [{ html: opt(a, b), right: true }], why = ['', 'Every sign is flipped: if ' + t('x+2=0') + ' then ' + t('x=-2') + '.', 'Substitute each value into the original equation to check.', 'Substitute each value into the original equation to check.'];
          cand.slice(1).forEach(function (c, i) { o2.push({ html: opt(c[0], c[1]), why: 'Check: ' + evalTex(E, [c[0], 1]) + '. ' + why[i + 1] }); });
          return mcPart(r, 'The complete solution to the equation ' + t(E.tex) + ' is', o2, solveLines(E).join('<br>'), ['Expand, make one side ' + t('0') + ', then factor.'], 'MC solve ' + E.tex);
        } }] },
      { num: '14', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '14', level: 'ADV', make: function (r) {
          /* a negative given root s and a positive other root o2 with |s| > o2, so k = −(s + o2) is positive (an NR bubble answer) */
          var ab = two(r, [-12, -2], [1, 9], function (a, b) { return -a > b && -a * b <= 60; }) || [-8, 3], s = ab[0], o2 = ab[1], m = -s, c = s * o2, k = -(s + o2), sq = s * s;
          var kx = (k === 1 ? '' : k) + 'x';
          return B.nr('The equation ' + t('x^{2}+kx' + c + '=0') + ' has one solution ' + t('x=' + s) + '. The value of ' + t('k') + ' is ________.', k, function (v) {
            if (v === -k) return { code: 'u4l9-k-sign', hint: 'Check the signs: ' + t('(' + s + ')^{2}+k(' + s + ')' + c + '=0') + ' is ' + t(sq + '-' + m + 'k' + c + '=0') + ', so ' + t((sq + c) + '-' + m + 'k=0') + ' and ' + t(m + 'k=' + (sq + c)) + '.' };
            if (v === o2) return { code: 'value', hint: 'That is the other solution. The question asks for ' + t('k') + '.' };
            if (v === -(m + o2)) return { code: 'u4l9-sq-neg', hint: 'Check ' + t('(' + s + ')^{2}') + ': a negative number squared is <b>positive</b>, ' + t('(' + s + ')^{2}=' + sq) + '.' };
            return null;
          }, 'Substitute ' + t('x=' + s) + ': ' + t('(' + s + ')^{2}+k(' + s + ')' + c + '=0') + '<br>' + t(sq + '-' + m + 'k' + c + '=0') + '<br>' + t((sq + c) + '-' + m + 'k=0') + ', so ' + t(m + 'k=' + (sq + c)) + ' and ' + t('k=\\mathbf{' + k + '}') + '.<br>(Check: ' + t('x^{2}+' + kx + c + '=(x+' + m + ')(x-' + o2 + ')') + ', so the other solution is ' + t('x=' + o2) + '.)',
          ['A solution makes the equation true: substitute ' + t('x=' + s) + ' and solve for ' + t('k') + '.', 'Use brackets: ' + t('(' + s + ')^{2}') + ' is positive, and ' + t('k(' + s + ')=-' + m + 'k') + '.'], 'NR k from a root');
        } }] },
      { num: '15', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '15', level: 'PRG', make: function (r) { return pqPart(r, { book: [[2, -3], [3, 1]] }); } }] }
    ],
    extra: [
      { num: '1', section: 'Part A — Rearranging So One Side Is Zero', stem: 'Rearrange each equation so one side is ' + t('0') + ', then factor and solve.', parts: [
        { id: 'e1a', level: 'EMG', make: function (r) { return solvePart(rhsEq(monicEq(r, { a: [-12, -1], b: [1, 9], test: function (a, b) { return a + b < 0 && a * b >= -45 && a * b <= -12; }, book: [-10, 3] }), 'c')); } },
        { id: 'e1b', level: 'PRG', make: function (r) { return solvePart(rhsEq(monicEq(r, { a: [1, 12], b: [-6, -1], test: function (a, b) { return a + b > 0 && a * b >= -45; }, book: [8, -3] }), 'bc')); } },
        { id: 'e1c', level: 'PRG', make: function (r) { return solvePart(rhsEq(monicEq(r, { a: [1, 9], b: [1, 9], test: function (a, b) { return a < b && a * b <= 45; }, book: [4, 5] }), 'c')); } },
        { id: 'e1d', level: 'PRG', make: function (r) { return solvePart(rhsEq(monicEq(r, { a: [1, 9], b: [-7, -1], test: function (a, b) { return a + b > 0 && a * b >= -45; }, book: [7, -5] }), 'bc')); } }] },
      { num: '2', stem: 'Each equation below has a common factor. Remove the GCF first, then use the Zero Product Property. <b>Do not divide both sides by ' + t('x') + '.</b> State both roots every time.', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { return solvePart(Eq({ k: r.int(2, 6), fs: [[1, 0], [1, -r.int(2, 9)]] }), { how: 'GCF' }); } },
        { id: 'e2b', level: 'EMG', make: function (r) { return solvePart(rhsEq(Eq({ k: r.int(2, 6), fs: [[1, 0], [1, -r.int(2, 9)]] }), 'x')); } },
        { id: 'e2c', level: 'EMG', make: function (r) { return solvePart(Eq({ k: r.int(2, 7), fs: [[1, 0], [1, r.int(2, 9)]] }), { how: 'GCF' }); } },
        { id: 'e2d', level: 'EMG', make: function (r) { return solvePart(rhsEq(Eq({ k: r.int(2, 6), fs: [[1, 0], [1, r.int(2, 9)]] }), 'x')); } }] },
      { num: '3', stem: function (sh) { return '<b>Error analysis.</b> Nadia solves ' + t(sh.E.tex) + ' like this: “Divide both sides by ' + t(sh.k + 'x') + '. That leaves ' + t('x=' + sh.a) + '.” Her answer is genuinely a solution, yet her work is still wrong.'; },
        shared: function (r) { var k = r.int(2, 5), a = r.int(2, 9); return { k: k, a: a, E: rhsEq(Eq({ k: k, fs: [[1, 0], [1, -a]] }), 'x') }; },
        parts: [
          { id: 'e3a', sub: 'a', level: 'EMG', make: function (r, sh) {
            return mcPart(r, 'What did her division destroy?', [
              { html: 'Dividing by ' + t(sh.k + 'x') + ' is only allowed if ' + t(sh.k + 'x\\neq 0') + ', so it throws away the case ' + t('x=0') + ' — which is also a solution.', right: true },
              { html: 'Nothing — dividing both sides by the same thing is always allowed.', why: 'Not by something that could be ' + t('0') + ': substitute ' + t('x=0') + ' into the original equation.' },
              { html: 'It changed the solution ' + t('x=' + sh.a) + ' into a wrong one.', why: t('x=' + sh.a) + ' really does solve it. The problem is a solution she <b>lost</b>.' },
              { html: 'It made the equation have three solutions.', why: 'A quadratic has at most two solutions. Her division lost one of them.' }],
              'Dividing by ' + t(sh.k + 'x') + ' assumes ' + t(sh.k + 'x\\neq0') + '. But ' + t('x=0') + ' works: ' + evalTex(sh.E, [0, 1]) + '. Never divide both sides by a variable — move everything to one side and factor.',
              ['Substitute ' + t('x=0') + ' into the original equation.'], 'Nadia error');
          } },
          { id: 'e3b', sub: 'b', level: 'BEG', make: function (r, sh) {
            var p = B.number('Name the root she never found: ' + t('x=') + '?', 0, function (v) { return v === sh.a ? { code: 'value', hint: 'She found that one. Which value makes ' + t(sh.k + 'x') + ' equal to ' + t('0') + '?' } : null; },
              'The factor ' + t(sh.k + 'x') + ' gives ' + t('x=0') + '. Check: ' + evalTex(sh.E, [0, 1]) + '.', ['Which value of ' + t('x') + ' makes the factor she divided by equal to ' + t('0') + '?'], 'lost root', { before: t('x=') });
            p.bad = [String(sh.a)]; return p;
          } },
          { id: 'e3c', sub: 'c', level: 'EMG', make: function (r, sh) { return solvePart(sh.E, { prompt: 'Solve ' + t(sh.E.tex) + ' correctly.' }); } }] },
      { num: '4', section: 'Part B — Special Forms and a Leading Coefficient Other Than One', stem: 'Solve each equation. Watch for a difference of squares and for a perfect square trinomial.', parts: [
        { id: 'e4a', level: 'PRG', make: function (r) { var ab = coprime(r, 2, 5, 1, 9) || [2, 5]; return solvePart(rhsEq(Eq({ fs: [[ab[0], -ab[1]], [ab[0], ab[1]]] }), 'c'), { how: 'difference of squares' }); } },
        { id: 'e4b', level: 'PRG', make: function (r) { var ab = coprime(r, 2, 5, 1, 11) || [3, 8]; return solvePart(Eq({ fs: [[ab[0], -ab[1]], [ab[0], ab[1]]] }), { how: 'difference of squares' }); } },
        { id: 'e4c', level: 'EMG', make: function (r) { var n = r.int(2, 12); return solvePart(sqEq(-n, LV(r)), { how: 'perfect square trinomial' }); } },
        { id: 'e4d', level: 'EMG', make: function (r) { var n = r.int(2, 12); return solvePart(sqEq(n, LV(r)), { how: 'perfect square trinomial' }); } }] },
      { num: '5', stem: '', parts: [
        { id: 'e5', level: 'EMG', make: function (r) {
          var n = r.int(2, 12), v = LV(r), E = sqEq(-n, v);
          return mcPart(r, 'An equation like ' + t(E.tex) + ' produces only <b>one</b> number, while most quadratic equations produce two. Why — and what is a root like this called?', [
            { html: 'It factors as ' + t('(' + v + '-' + n + ')(' + v + '-' + n + ')=0') + ': both factors are the same, so both small equations give ' + t(v + '=' + n) + '. It is a <b>double root</b>.', right: true },
            { html: 'The other root is ' + t(v + '=' + (-n)) + ', which was forgotten. It is a <b>negative root</b>.', why: 'Substitute ' + t(v + '=' + (-n)) + ': ' + evalTex(E, [-n, 1]) + '. It is not a solution.' },
            { html: 'Because the last term is positive. It is a <b>positive root</b>.', why: t('x^{2}-5x+6=0') + ' also has a positive last term, yet it has two roots (2 and 3). Look at the factored form.' },
            { html: 'Because the equation has no ' + t('x') + '-term. It is a <b>zero root</b>.', why: 'It does have an ' + t('x') + '-term. Look at the factored form.' }],
            'A perfect square trinomial factors into two identical factors: ' + t(E.ptex + '=(' + v + '-' + n + ')^{2}') + ', so both factors give ' + t(v + '=' + n) + '. A root that comes from a repeated factor is called a <b>double root</b> (or repeated root).',
            ['Factor it. What do you notice about the two factors?'], 'double root');
        } }] },
      { num: '6', stem: 'Solve by decomposition. Every answer here is a fraction or involves one.', parts: [
        { id: 'e6a', level: 'PRG', make: function (r) { return solvePart(decEq(r, { a: [2, 3], b: [-5, 5], c: [2, 5], d: [-5, 5], test: function (o) { return o.C < 0 && o.a !== o.c && o.Bm < 0 && Math.abs(o.b) !== o.a && Math.abs(o.d) !== o.c; }, book: [[2, 1], [3, -2]] }), { how: 'decomposition' }); } },
        { id: 'e6b', level: 'PRG', make: function (r) { var a2 = r.pick([2, 2, 3]); return solvePart(decEq(r, { a: a2, b: [-9, 9], c: a2, d: [-9, 9], test: function (o) { return o.C < 0 && o.Bm > 0; }, book: [[2, -3], [2, 5]] }), { how: 'decomposition' }); } },
        { id: 'e6c', level: 'PRG', make: function (r) { return solvePart(decEq(r, { a: 2, b: [-5, 5], c: [3, 5], d: [-7, 7], test: function (o) { return o.C < 0 && o.Bm > 0 && o.Bm <= 7 && Math.abs(o.d) !== o.c; }, book: [[2, -1], [5, 3]] }), { how: 'decomposition' }); } },
        { id: 'e6d', level: 'PRG', make: function (r) { return solvePart(rhsEq(decEq(r, { a: 1, b: [-5, -1], c: [2, 3], d: [-7, -1], test: function (o) { return Math.abs(o.d) % o.c !== 0; }, book: [[1, -2], [3, -4]] }), 'bc'), { how: 'decomposition' }); } }] },
      { num: '7', stem: 'Rearrange, then solve by decomposition.', parts: [
        { id: 'e7a', level: 'PRG', make: function (r) { return solvePart(rhsEq(decEq(r, { a: 2, b: [1, 7], c: [3, 5], d: [-7, -1], test: function (o) { return o.Bm > 0; }, book: [[2, 3], [3, -2]] }), 'c'), { how: 'decomposition' }); } },
        { id: 'e7b', level: 'PRG', make: function (r) { return solvePart(rhsEq(decEq(r, { a: 2, b: [-7, -1], c: [3, 5], d: [1, 7], test: function (o) { return o.Bm < 0; }, book: [[2, -3], [4, 5]] }), 'bc'), { how: 'decomposition' }); } }] },
      { num: '8', section: 'Part C — Expanding Before You Can Factor', stem: 'An equation such as ' + t('(x+3)(x-2)=6') + ' <i>looks</i> ready for the zero product property, but the product equals ' + t('6') + ', not ' + t('0') + '. Expand, rearrange so one side is ' + t('0') + ', then factor and solve.', parts: [
        { id: 'e8a', level: 'ADV', make: function (r) { return solvePart(prodEq(r, { book: { q: [3, -2], c: 6 } })); } },
        { id: 'e8b', level: 'ADV', make: function (r) { return solvePart(prodEq(r, { book: { q: [-5, 1], c: 16 } })); } },
        { id: 'e8c', level: 'ADV', make: function (r) { return solvePart(prodEq(r, { mono: true, book: { q: [0, 5], c: 24 } })); } },
        { id: 'e8d', level: 'ADV', make: function (r) { return solvePart(prodEq(r, { sq: true, book: { q: [4, 4], c: 25 } })); } }] },
      { num: '9', stem: function (sh) { return '<b>Error analysis.</b> A student solves ' + t(sh.E.tex) + ' by writing “' + t(sh.f1 + '=' + sh.E.c) + ' or ' + t(sh.f2 + '=' + sh.E.c) + '”, and reports ' + t('x=' + sh.s1) + ' and ' + t('x=' + sh.s2) + '.'; },
        shared: function (r) {
          for (var i = 0; i < 300; i++) { var E = prodEq(r, { book: { q: [3, -2], c: 6 } }), q = E.Q, s1 = E.c - q[0][1], s2 = E.c - q[1][1]; var good = E.roots.map(rv); if ((good.indexOf(s1) >= 0) !== (good.indexOf(s2) >= 0)) return { E: E, s1: s1, s2: s2, f1: tx(E.lin(q[0])), f2: tx(E.lin(q[1])), lucky: good.indexOf(s1) >= 0 ? s1 : s2 }; }
          var E2 = Eq({ v: 'x', fs: [[1, 4], [1, -3]], show: 'prod', Q: [[1, 3], [1, -2]], c: 6 }); return { E: E2, s1: 3, s2: 8, f1: 'x+3', f2: 'x-2', lucky: 3 };
        },
        parts: [
          { id: 'e9a', sub: 'a', level: 'EMG', make: function (r, sh) {
            var E = sh.E, opts = [sh.s1, sh.s2];
            return { prompt: 'Substitute ' + t('x=' + sh.s1) + ' and then ' + t('x=' + sh.s2) + ' into the original equation. Which one actually works?', input: { type: 'select', options: opts.map(function (x) { return { value: String(x), html: t('x=' + x) }; }), help: 'Tap the value (or values) that make the original equation true.' },
              check: K.selectSet([String(sh.lucky)], function () { return { code: 'u4l9-check', hint: 'Substitute each value into ' + t(E.qtex) + ' and see whether you get ' + t(E.c) + '.' }; }), key: [String(sh.lucky)], answer: t('x=' + sh.lucky),
              solution: opts.map(function (x) { return t('x=' + x) + ': ' + evalTex(E, [x, 1]); }).join('<br>') + '<br>Only ' + t('x=' + sh.lucky) + ' works.', hints: ['Substitute each value into the left side and compare it with ' + t(E.c) + '.'], text: 'which works', bad: [[String(sh.s1), String(sh.s2)]] };
          } },
          { id: 'e9b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var E = sh.E;
            return mcPart(r, 'Why did that answer arrive only by luck?', [
              { html: 'The method assumes one factor must equal ' + t(E.c) + ', which is false — ' + t(E.c) + ' can be split into a product in endlessly many ways. Only ' + t('0') + ' forces a factor to be ' + t('0') + '.', right: true },
              { html: 'Because the student should have set both factors equal to ' + t(E.c) + ' at the same time.', why: 'That is impossible here. The real problem is splitting a product that isn’t ' + t('0') + '.' },
              { html: 'It wasn’t luck — the method always gives at least one right answer.', why: 'Try it on another equation, e.g. ' + t('(x+1)(x+2)=6') + ': it gives ' + t('x=5') + ' and ' + t('x=4') + ', and neither works.' },
              { html: 'Because ' + t(E.c) + ' is positive.', why: 'The sign of ' + t(E.c) + ' doesn’t matter. Think about what is special about ' + t('0') + '.' }],
              'At ' + t('x=' + sh.lucky) + ' the factors happen to be ' + t(E.c) + ' and ' + t('1') + ' (or similar) — a coincidence. Only a product equal to ' + t('0') + ' forces one factor to be ' + t('0') + '.', ['What is special about the number ' + t('0') + '?'], 'why luck');
          } },
          { id: 'e9c', sub: 'c', level: 'PRG', make: function (r, sh) {
            var E = sh.E, miss = E.roots.map(rv).filter(function (x) { return x !== sh.lucky; })[0];
            var p = B.number('State the correct root the student missed entirely: ' + t('x=') + '?', miss, function (v) { return v === sh.lucky ? { code: 'value', hint: 'The student already has that one. Solve the equation properly to find the other.' } : (v === sh.s1 || v === sh.s2) ? { code: 'value', hint: 'That value doesn’t work — substitute it to check.' } : null; },
              solveLines(E).join('<br>') + '<br>The student missed ' + t('x=' + miss) + '.', ['Solve it correctly: expand, make one side ' + t('0') + ', factor.'], 'missed root', { before: t('x=') });
            p.bad = [String(sh.lucky), String(sh.s1 === sh.lucky ? sh.s2 : sh.s1)]; return p;
          } }] },
      { num: '10', stem: 'Solve each equation. Expand first.', parts: [
        { id: 'e10a', level: 'ADV', make: function (r) { return solvePart(prodEqDec(r)); } },
        { id: 'e10b', level: 'ADV', make: function (r) { return solvePart(prodEq(r, { book: { q: [-1, 6], c: 8 } })); } }] },
      { num: '11', section: 'Part D — More Than Two Factors, More Than Two Roots', stem: 'Solve each cubic equation. Each has three roots. A GCF of ' + t('x') + ' contributes the root ' + t('x=0') + '.', parts: [
        { id: 'e11a', level: 'PRG', make: function (r) { var n = r.int(2, 9); return solvePart(Eq({ k: r.pick([1, 1, 2, 3]), fs: [[1, 0], [1, -n], [1, n]] }), { how: 'GCF, then difference of squares' }); } },
        { id: 'e11b', level: 'PRG', make: function (r) { var ab = two(r, [-7, -1], [1, 7], function (a, b) { return a + b !== 0 && a * b >= -35; }) || [-5, 3]; return solvePart(Eq({ fs: [[1, 0], [1, -ab[0]], [1, -ab[1]]] }), { how: 'GCF, then inspection' }); } },
        { id: 'e11c', level: 'PRG', make: function (r) { var ab = two(r, [2, 9], [-6, -1], function (a, b) { return a + b > 0 && a * b >= -40; }) || [6, -2]; return solvePart(Eq({ k: r.int(2, 4), fs: [[1, 0], [1, -ab[0]], [1, -ab[1]]] }), { how: 'GCF, then inspection' }); } },
        { id: 'e11d', level: 'EMG', make: function (r) { var ab = two(r, [2, 9], [-6, -1]) || [7, -2]; return solvePart(Eq({ k: r.int(2, 6), fs: [[1, 0], [1, -ab[0]], [1, -ab[1]]], show: 'factored' })); } }] },
      { num: '12', stem: function (sh) { return 'Consider ' + t(sh.E.tex) + '.'; },
        shared: function (r) { var a = r.int(1, 9), b = r.int(1, 6), c = r.pick([2, 3, 4, 5]), d = r.int(1, 9); if (gcd(c, d) !== 1 || d % c === 0) { c = 2; d = 3; } if (a === b) b = a + 1; return { E: Eq({ fs: [[1, -a], [1, b], [c, -d]], show: 'factored' }), c: c, d: d, a: a }; },
        parts: [
          { id: 'e12a', level: 'EMG', make: function (r, sh) { return solvePart(sh.E, { prompt: '(a) Solve ' + t(sh.E.tex) + '.' }); } },
          { id: 'e12b', level: 'EMG', make: function (r, sh) {
            var c = sh.c, d = sh.d;
            return mcPart(r, '(b) Why does the factor ' + t(c + 'x-' + d) + ' not give the root ' + t('x=' + d) + ', even though ' + t('x-' + sh.a) + ' gives ' + t('x=' + sh.a) + '?', [
              { html: 'Setting ' + t(c + 'x-' + d + '=0') + ' gives ' + t(c + 'x=' + d) + ', so ' + t('x=\\frac{' + d + '}{' + c + '}') + ' — the coefficient ' + t(c) + ' must be divided out. Only a factor of the form ' + t('x-r') + ' hands you the root directly.', right: true },
              { html: 'Because ' + t(c + 'x-' + d) + ' has no root.', why: 'Every factor ' + t('ax+b') + ' with ' + t('a\\neq0') + ' has a root. Solve ' + t(c + 'x-' + d + '=0') + '.' },
              { html: 'Because the root of ' + t(c + 'x-' + d) + ' is ' + t('x=' + (-d)) + '.', why: 'Substitute ' + t('x=' + (-d)) + ': ' + t(c + '(' + (-d) + ')-' + d + '=' + (-c * d - d)) + ', not ' + t('0') + '.' },
              { html: 'It does give ' + t('x=' + d) + '; the book is wrong.', why: 'Substitute ' + t('x=' + d) + ': ' + t(c + '(' + d + ')-' + d + '=' + (c * d - d)) + ', not ' + t('0') + '.' }],
              t(c + 'x-' + d + '=0') + ' means ' + t(c + 'x=' + d) + ', so ' + t('x=\\frac{' + d + '}{' + c + '}') + '. Check: ' + t(c + '\\left(\\frac{' + d + '}{' + c + '}\\right)-' + d + '=' + d + '-' + d + '=0') + ' ✓', ['Solve ' + t(c + 'x-' + d + '=0') + ' step by step.'], 'why not d');
          } }] },
      { num: '13', stem: '<b>Stretch.</b> The equation ' + t('x^{4}-13x^{2}+36=0') + ' is a trinomial in ' + t('x^{2}') + ': think of it as ' + t('(x^{2})^{2}-13(x^{2})+36=0') + '. Factor it as a trinomial first, then factor each bracket again as a difference of squares, and finally solve. Expect four roots.', parts: [
        { id: 'e13a', level: 'MAS', make: function (r) { var pq = twoSq(r, [1, 4], 7), v = r.pick(['x', 'x', 'y']); return solvePart(Eq({ v: v, fs: [[1, -pq[0]], [1, pq[0]], [1, -pq[1]], [1, pq[1]]] }), { how: 'a trinomial in ' + t(v + '^{2}') + ', then difference of squares twice', sol: quarticSol(pq[0], pq[1], v) }); } },
        { id: 'e13b', level: 'ADV', make: function (r) { var pq = twoSq(r, [1, 3], 6), v = r.pick(['x', 'x', 'y']); return solvePart(Eq({ v: v, fs: [[1, -pq[0]], [1, pq[0]], [1, -pq[1]], [1, pq[1]]] }), { how: 'a trinomial in ' + t(v + '^{2}') + ', then difference of squares twice', sol: quarticSol(pq[0], pq[1], v) }); } }] },
      { num: '14', section: 'Part E — Checking, Building Backwards, and Applying', stem: function (sh) { return 'Solve ' + t(sh.E.tex) + ' by factoring. Then substitute <b>each</b> root into the original equation.'; },
        shared: function (r) { return { E: rhsEq(monicEq(r, { a: [-12, -1], b: [1, 9], test: function (a, b) { return a + b < 0 && a * b >= -60 && a * b <= -10; }, book: [-7, 4] }), 'c') }; },
        parts: [
          { id: 'e14a', sub: 'solve', level: 'EMG', make: function (r, sh) { return solvePart(sh.E, { prompt: 'Solve ' + t(sh.E.tex) + '.' }); } },
          { id: 'e14b', sub: 'check', level: 'BEG', make: function (r, sh) { return checkPart(r, sh.E); } }] },
      { num: '15', stem: '<b>Work backwards.</b> If ' + t('x=r') + ' is a root, then ' + t('(x-r)') + ' is a factor. Build a quadratic equation ' + t('ax^{2}+bx+c=0') + ' with integer coefficients having the given roots. Expand your answer fully.', parts: [
        { id: 'e15a', level: 'ADV', make: function (r) { var ab = two(r, [-9, -1], [1, 9], function (a, b) { return a + b !== 0; }) || [-3, 5]; return buildEqPart([[1, -ab[0]], [1, -ab[1]]], 'roots ' + t(ab[0]) + ' and ' + t(ab[1])); } },
        { id: 'e15b', level: 'ADV', make: function (r) { var a = r.int(2, 12) * r.pick([1, 1, -1]); return buildEqPart([[1, 0], [1, -a]], 'roots ' + t('0') + ' and ' + t(a)); } },
        { id: 'e15c', level: 'MAS', make: function (r) { var pq = coprime(r, 2, 4, 1, 5, function (q, p) { return p % q !== 0; }) || [2, 1], s = r.pick([1, -1]), b = r.int(1, 7) * r.pick([1, -1]); return buildEqPart([[pq[0], s * pq[1]], [1, -b]], 'roots ' + t(rtex(ex.norm(-s * pq[1], pq[0]))) + ' and ' + t(b)); } }] },
      { num: '16', stem: function (sh) { return 'The product of two consecutive <b>positive</b> integers is ' + t(sh.n * (sh.n + 1)) + '. Let the smaller integer be ' + t('n') + '.'; },
        shared: function (r) { var n = r.int(3, 25); return { n: n, E: Eq({ v: 'n', fs: [[1, n + 1], [1, -n]], show: 'rhs', R: N(n * (n + 1)), lhsTex: 'n(n+1)', rhsTex: String(n * (n + 1)) }) }; },
        parts: [
          { id: 'e16a', level: 'PRG', make: function (r, sh) { var E = sh.E; return solvePart(E, { prompt: '(a) The equation is ' + t('n(n+1)=' + sh.n * (sh.n + 1)) + '. Solve it by factoring (give both roots).', sol: 'Expand: ' + t('n^{2}+n=' + sh.n * (sh.n + 1)) + ', so ' + t(E.ptex + '=0') + '.<br>Factor: ' + t('(n+' + (sh.n + 1) + ')(n-' + sh.n + ')=0') + ', so ' + t('n=' + (-sh.n - 1)) + ' or ' + t('n=' + sh.n) + '.' }); } },
          { id: 'e16b', level: 'EMG', make: function (r, sh) { return twoNums(sh.n, sh.n + 1, ['Smaller integer', 'Larger integer'], '(b) Reject the root that doesn’t fit, then give the two integers.', 'Reject ' + t('n=' + (-sh.n - 1)) + ': the integers must be <b>positive</b>. So ' + t('n=' + sh.n) + ' and the integers are ' + t(sh.n) + ' and ' + t(sh.n + 1) + ' (' + t(sh.n + '\\times' + (sh.n + 1) + '=' + sh.n * (sh.n + 1)) + ' ✓).', [-sh.n - 1, -sh.n]); } }] },
      { num: '17', stem: function (sh) { return 'The length of a rectangle is ' + t(sh.d) + ' cm more than its width, and its area is ' + t(sh.w * (sh.w + sh.d) + '\\ \\text{cm}^{2}') + '. Let the width be ' + t('w') + '.'; },
        shared: function (r) { var o = null; for (var i = 0; i < 200 && !o; i++) { var d = r.int(1, 7), w = r.int(2, 12); if (w + d !== w) o = { d: d, w: w }; } o = o || { d: 3, w: 5 }; o.E = Eq({ v: 'w', fs: [[1, -o.w], [1, o.w + o.d]], show: 'rhs', R: N(o.w * (o.w + o.d)), lhsTex: 'w(w+' + o.d + ')', rhsTex: String(o.w * (o.w + o.d)) }); return o; },
        parts: [
          { id: 'e17a', level: 'PRG', make: function (r, sh) { var E = sh.E; return solvePart(E, { prompt: '(a) The equation is ' + t('w(w+' + sh.d + ')=' + sh.w * (sh.w + sh.d)) + '. Solve it by factoring (give both roots).', sol: 'Expand: ' + t('w^{2}+' + sh.d + 'w=' + sh.w * (sh.w + sh.d)) + ', so ' + t(E.ptex + '=0') + '.<br>Factor: ' + t('(w+' + (sh.w + sh.d) + ')(w-' + sh.w + ')=0') + ', so ' + t('w=' + (-sh.w - sh.d)) + ' or ' + t('w=' + sh.w) + '.' }); } },
          { id: 'e17b', level: 'EMG', make: function (r, sh) { return twoNums(sh.w, sh.w + sh.d, ['Width (cm)', 'Length (cm)'], '(b) Reject the inadmissible root, then state the dimensions.', 'Reject ' + t('w=' + (-sh.w - sh.d)) + ': a width cannot be negative. Width ' + t(sh.w) + ' cm, length ' + t(sh.w + sh.d) + ' cm (' + t(sh.w + '\\times' + (sh.w + sh.d) + '=' + sh.w * (sh.w + sh.d)) + ' ✓).', [-sh.w - sh.d, -sh.w]); } }] },
      { num: '18', stem: function (sh) { return 'The length of a rectangular deck is ' + t(sh.d) + ' m more than twice its width, and its area is ' + t(sh.w * (2 * sh.w + sh.d) + '\\ \\text{m}^{2}') + '. Let the width be ' + t('w') + '.'; },
        shared: function (r) { var o = null; for (var i = 0; i < 300 && !o; i++) { var d = r.pick([2, 4, 6]), w = r.int(2, 9); var A = w * (2 * w + d), c = -A / 2, b2 = d / 2; var disc = b2 * b2 - 4 * c / 1; o = { d: d, w: w }; } return o; },
        parts: [
          { id: 'e18a', level: 'ADV', make: function (r, sh) {
            var d = sh.d, w = sh.w, A = w * (2 * w + d), other = -(w + d / 2); // 2w² + dw − A = 2(w − w0)(w + w0 + d/2)
            var E = Eq({ v: 'w', k: 2, fs: [[1, -w], [1, w + d / 2]], show: 'rhs', R: N(A), lhsTex: 'w(2w+' + d + ')', rhsTex: String(A) });
            return solvePart(E, { prompt: '(a) Write an equation and solve it by factoring (give both roots).', sol: 'Length ' + t('2w+' + d) + ', so ' + t('w(2w+' + d + ')=' + A) + '.<br>Expand and rearrange: ' + t('2w^{2}+' + d + 'w-' + A + '=0') + '.<br>GCF ' + t('2') + ': ' + t('2(w^{2}+' + (d / 2) + 'w-' + (A / 2) + ')=0') + ', so ' + t('2(w-' + w + ')(w+' + (w + d / 2) + ')=0') + '.<br>' + t('w=' + w) + ' or ' + t('w=' + other) + '.',
              hints: ['The length is ' + t('2w+' + d) + ', so the area is ' + t('w(2w+' + d + ')') + '. Expand, make one side ' + t('0') + ', and take out the GCF.'] });
          } },
          { id: 'e18b', level: 'EMG', make: function (r, sh) { var w = sh.w, L = 2 * w + sh.d; return twoNums(w, L, ['Width (m)', 'Length (m)'], '(b) Reject the inadmissible root, then state the dimensions.', 'Reject the negative root: a width cannot be negative. Width ' + t(w) + ' m, length ' + t('2(' + w + ')+' + sh.d + '=' + L) + ' m (' + t(w + '\\times' + L + '=' + w * L) + ' ✓).', [-(w + sh.d / 2), L - 2 * w]); } }] },
      { num: '19', stem: function (sh) { return 'A ball is thrown from the top of a wall. Its height above the ground, in metres, after ' + t('t') + ' seconds is given by ' + t('h=' + sh.htex) + '.'; },
        shared: function (r) { var o = null; for (var i = 0; i < 200 && !o; i++) { var T = r.int(2, 8), u = r.int(1, 4); if (T > u && T * u <= 24) o = { T: T, u: u }; } o = o || { T: 4, u: 1 }; var hp = P.mul(N(-5), S(M(1, 't'), N(-o.T)), S(M(1, 't'), N(o.u))); o.hp = hp; o.htex = tx(hp); o.h0 = 5 * o.T * o.u; return o; },
        parts: [
          { id: 'e19a', level: 'BEG', make: function (r, sh) {
            var p = B.number('(a) How high was the ball when it was released? (Substitute ' + t('t=0') + '.)', sh.h0, function (v) { return v === -sh.h0 ? { code: 'sign', hint: 'Check the sign: at ' + t('t=0') + ' only the constant term is left.' } : null; },
              t('h=' + sh.htex.replace(/t/g, '(0)') + '=' + sh.h0) + ' m.', ['At ' + t('t=0') + ' the terms with ' + t('t') + ' are zero.'], 'release height', { after: t('\\text{ m}') });
            p.bad = [String(-sh.h0)]; return p;
          } },
          { id: 'e19b', level: 'PRG', make: function (r, sh) {
            var T = sh.T, u = sh.u, inner = S(M(1, { t: 2 }), M(u - T, 't'), N(-T * u));
            var p = B.number('(b) Set ' + t('h=0') + ' and solve by factoring to find when the ball lands. (Reject the root that is impossible here.)', T, function (v) {
              if (v === -u) return { code: 'u4l9-pick', hint: 'That root is a negative time — before the ball was thrown. Use the other root.' };
              if (v === u) return { code: 'sign', hint: 'Check the signs in your factors: ' + t(tx(inner) + '=(t-' + T + ')(t+' + u + ')') + '.' };
              return null;
            }, t(sh.htex + '=0') + '. Divide by ' + t('-5') + ': ' + t(tx(inner) + '=0') + ', so ' + t('(t-' + T + ')(t+' + u + ')=0') + ' and ' + t('t=' + T) + ' or ' + t('t=' + (-u)) + '.<br>Reject ' + t('t=' + (-u)) + ': a negative time is before the ball was thrown. The ball lands after ' + t(T) + ' s.',
            ['Take out the GCF ' + t('-5') + ' first, then factor the trinomial.', 'Time can’t be negative here.'], 'landing time', { after: t('\\text{ s}') });
            p.bad = [String(-u), String(u)]; return p;
          } }] },
      { num: '20', stem: function (sh) { return 'A rectangular garden measures ' + t(sh.L) + ' m by ' + t(sh.W) + ' m. A path of uniform width ' + t('x') + ' metres is built all the way around the outside of it, and the garden and path together cover ' + t(sh.A + '\\ \\text{m}^{2}') + '.'; },
        shared: function (r) { var o = null; for (var i = 0; i < 300 && !o; i++) { var L = r.int(5, 12), W = r.int(3, 8), x = r.int(1, 4); if (L > W) o = { L: L, W: W, x: x }; } o = o || { L: 8, W: 5, x: 3 }; o.A = (o.L + 2 * o.x) * (o.W + 2 * o.x); return o; },
        parts: [
          { id: 'e20a', level: 'EMG', make: function (r, sh) {
            var L = sh.L, W = sh.W, tot = P.mul(S(N(L), M(2, 'x')), S(N(W), M(2, 'x'))), one = P.mul(S(N(L), M(1, 'x')), S(N(W), M(1, 'x')));
            var p = B.poly('(a) The outer dimensions are ' + t('(' + L + '+2x)') + ' by ' + t('(' + W + '+2x)') + ' (the path adds ' + t('x') + ' at <b>each</b> end). Write the total area as an expanded polynomial.', tot, { wrong: [{ is: one, code: 'value', hint: 'The path is on <b>both</b> sides, so each dimension grows by ' + t('2x') + '.' }] },
              t('(' + L + '+2x)(' + W + '+2x)=' + L * W + '+' + 2 * L + 'x+' + 2 * W + 'x+4x^{2}=' + tx(tot)) + '.', ['Expand the two brackets and collect like terms.'], 'total area', { order: 'desc' });
            p.bad = [tx(one)]; return p;
          } },
          { id: 'e20b', level: 'ADV', make: function (r, sh) {
            var L = sh.L, W = sh.W, x = sh.x, A = sh.A, b = 2 * (L + W), c = L * W - A; // 4x² + 2(L+W)x + LW − A = 0, divide by 2: 2x² + (L+W)x + (LW−A)/2
            var b2 = L + W, c2 = c / 2, other = c2 / (2 * x); // roots x and −(c2)/(2x)·… : 2x² + b2 x + c2 = (x − x0)(2x + m)
            var m = -c2 / x, oth = -m / 2;
            var p = B.number('(b) Solve ' + t('(' + L + '+2x)(' + W + '+2x)=' + A) + ' by factoring. Reject the inadmissible root and state the width of the path.', x, function (v) {
              if (Math.abs(v - oth) < 1e-9) return { code: 'u4l9-pick', hint: 'That root is negative — a path can’t have a negative width. Use the other root.' };
              if (v === 2 * x) return { code: 'value', hint: 'That is ' + t('2x') + ', the amount each dimension grows. The width of the path is ' + t('x') + '.' };
              return null;
            }, 'Expand: ' + t('4x^{2}+' + b + 'x+' + L * W + '=' + A) + ', so ' + t('4x^{2}+' + b + 'x' + c + '=0') + '. Divide by ' + t('2') + ': ' + t('2x^{2}+' + b2 + 'x' + c2 + '=0') + ', which factors as ' + t('(x-' + x + ')(2x+' + m + ')=0') + '.<br>' + t('x=' + x) + ' or ' + t('x=' + fmtNum(oth)) + '. Reject the negative root: a width can’t be negative. The path is ' + t(x) + ' m wide (check: ' + t((L + 2 * x) + '\\times' + (W + 2 * x) + '=' + A) + ' ✓).',
            ['Expand, move ' + t(A) + ' across, and take out the GCF before you factor.'], 'path width', { after: t('\\text{ m}') });
            p.bad = [String(2 * x)]; return p;
          } }] },
      { num: '21', section: 'Part F — Multiple Choice and Numerical Response', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e21', level: 'PRG', make: function (r) {
          var E = prodEq(r, { book: { q: [-1, 4], c: 6 } }), q = E.Q, a = E.roots[0][0], b = E.roots[1][0], z1 = -q[0][1], z2 = -q[1][1];
          var opt = function (x, y) { return t('x=' + x) + ' and ' + t('x=' + y); }, seen = {}, opts = [{ html: opt(a, b), right: true }]; seen[[a, b].sort().join()] = 1;
          [[z1, z2, 'Those make the product ' + t('0') + ', not ' + t(E.c) + '. Expand and move ' + t(E.c) + ' across first.'], [E.c - q[0][1], E.c - q[1][1], 'Setting each factor equal to ' + t(E.c) + ' is not valid. Expand and make one side ' + t('0') + '.'], [-a, -b, 'Every sign is flipped — check the signs in your factors.'], [a, -b, 'Substitute each value into the original equation to check.'], [-a, b, 'Substitute each value into the original equation to check.']].forEach(function (c) {
            var key = [c[0], c[1]].sort().join(); if (opts.length < 4 && !seen[key] && c[0] !== c[1]) { seen[key] = 1; opts.push({ html: opt(c[0], c[1]), why: c[2] }); }
          });
          return mcPart(r, 'The complete solution to the equation ' + t(E.tex) + ' is', opts, solveLines(E).join('<br>'), ['Expand, make one side ' + t('0') + ', then factor.'], 'MC solve ' + E.tex);
        } }] },
      { num: '22', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e22', level: 'ADV', make: function (r) {
          var ab = two(r, [1, 9], [1, 12], function (a, b) { return a !== b && a + b <= 20; }) || [3, 8], s = ab[0], o2 = ab[1], B2 = -(s + o2), k = s * o2;
          return B.nr('The equation ' + t('x^{2}' + B2 + 'x+k=0') + ' has one solution ' + t('x=' + s) + '. The value of ' + t('k') + ' is ________.', k, function (v) {
            if (v === -k) return { code: 'u4l9-k-sign', hint: 'Check the sign: ' + t(s + '^{2}' + B2 + '(' + s + ')+k=0') + ' gives ' + t(s * s + B2 * s + '+k=0') + '.' };
            if (v === o2) return { code: 'value', hint: 'That is the other solution. The question asks for ' + t('k') + '.' };
            return null;
          }, 'Substitute ' + t('x=' + s) + ': ' + t(s * s + '-' + (-B2 * s) + '+k=0') + ', so ' + t('k=' + k) + '. (The other solution is ' + t('x=' + o2) + ': ' + t('x^{2}' + B2 + 'x+' + k + '=(x-' + s + ')(x-' + o2 + ')') + '.)',
          ['A solution makes the equation true: substitute ' + t('x=' + s) + ' and solve for ' + t('k') + '.'], 'NR k from a root');
        } }] },
      { num: '23', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e23', level: 'PRG', make: function (r) {
          var pq = coprime(r, 2, 9, 1, 9, function (q, p) { return p !== q && p % q !== 0 && p + q <= 99; }) || [4, 9], q = pq[0], p = pq[1];
          var E = Eq({ fs: [[1, 0], [q, -p]] });
          return B.nr('The non-zero solution of ' + t(E.ptex + '=0') + ' can be written as ' + t('x=\\frac{p}{q}') + ' in lowest terms, where ' + t('p') + ' and ' + t('q') + ' are positive integers. The value of ' + t('p+q') + ' is ________.', p + q, function (v) {
            if (v === p) return { code: 'u4l9-no-divide', hint: 'Solve ' + t(q + 'x-' + p + '=0') + ' all the way: divide by ' + t(q) + '.' };
            if (v === p * q) return { code: 'value', hint: 'Add ' + t('p') + ' and ' + t('q') + ', don’t multiply.' };
            return null;
          }, 'GCF: ' + t('x(' + q + 'x-' + p + ')=0') + ', so ' + t('x=0') + ' or ' + t(q + 'x=' + p) + ', i.e. ' + t('x=\\frac{' + p + '}{' + q + '}') + '. So ' + t('p+q=' + p + '+' + q + '=' + (p + q)) + '.', ['Take out the GCF ' + t('x') + '; the other factor gives the non-zero solution.'], 'NR p+q');
        } }] }
    ]
  });

  /* ---------------- more makers ---------------- */
  function coprime(r, a, b, c, d, test) { for (var i = 0; i < 300; i++) { var p = r.int(a, b), q = r.int(c, d); if (gcd(p, q) === 1 && p !== q && (!test || test(p, q))) return [p, q]; } return null; }
  function sqEq(n, v) { var E = Eq({ v: v, fs: [[1, n], [1, n]], sq: true }); E.sq = true; return E; }
  function twoSq(r, rng, hi) { for (var i = 0; i < 100; i++) { var p = r.int(rng[0], rng[1]), q = r.int(p + 1, hi); if (p !== q) return [p, q]; } return [2, 3]; }
  function quarticSol(p, q, v) {
    v = v || 'x'; var P2 = p * p, Q2 = q * q;
    return 'Treat ' + t(v + '^{2}') + ' as one variable: two integers with product ' + t(P2 * Q2) + ' and sum ' + t(-(P2 + Q2)) + ' are ' + t(-P2) + ' and ' + t(-Q2) + ', so ' + t('(' + v + '^{2}-' + P2 + ')(' + v + '^{2}-' + Q2 + ')=0') + '.<br>Each bracket is a difference of squares: ' + t('(' + v + '-' + p + ')(' + v + '+' + p + ')(' + v + '-' + q + ')(' + v + '+' + q + ')=0') + '.<br>Solutions: ' + t(v + '=\\pm' + p + ',\\ ' + v + '=\\pm' + q) + '.';
  }
  /* a product equal to a number: (x + q1)(x + q2) = c whose rearranged form factors nicely */
  function prodEq(r, sp) {
    for (var i = 0; i < 2000; i++) {
      var q1, q2, c;
      if (sp.mono) { q1 = 0; q2 = r.int(-9, 9); } else if (sp.sq) { q1 = q2 = r.int(-6, 6); } else { q1 = r.int(-9, 9); q2 = r.int(-9, 9); }
      if (!sp.mono && !sp.sq && (!q1 || !q2 || q1 === q2)) continue; if (sp.mono && !q2) continue;
      c = sp.sq ? r.pick([4, 9, 16, 25, 36, 49, 64]) : r.int(2, 30) * (r.chance(0.8) ? 1 : -1);
      var B1 = q1 + q2, C1 = q1 * q2 - c, disc = B1 * B1 - 4 * C1; if (disc <= 0) continue;
      var s = Math.round(Math.sqrt(disc)); if (s * s !== disc || (B1 + s) % 2) continue;
      var r1 = (-B1 + s) / 2, r2 = (-B1 - s) / 2; if (!r1 || !r2 || r1 === r2 || Math.abs(r1) > 15 || Math.abs(r2) > 15) continue;
      // the student's "split" values must not both be roots, and the original factors must not already vanish at the roots
      var E = Eq({ fs: [[1, -r1], [1, -r2]], show: 'prod', Q: [[1, q1], [1, q2]], c: c, qsq: sp.sq });
      E.notZero = uniqR([[c - q1, 1], [c - q2, 1]]).map(rv);
      return E;
    }
    var b = sp.book, q1b = b.q[0], q2b = b.q[1], cb = b.c, B1b = q1b + q2b, C1b = q1b * q2b - cb, sb = Math.round(Math.sqrt(B1b * B1b - 4 * C1b));
    var Eb = Eq({ fs: [[1, -(-B1b + sb) / 2], [1, -(-B1b - sb) / 2]], show: 'prod', Q: [[1, q1b], [1, q2b]], c: cb, qsq: sp.sq }); Eb.notZero = uniqR([[cb - q1b, 1], [cb - q2b, 1]]).map(rv); return Eb;
  }
  /* (2x + 1)(x − 3) = −6 style: a non-monic product whose rearranged form factors nicely */
  function prodEqDec(r) {
    for (var i = 0; i < 3000; i++) {
      var a = 2, b = r.int(-5, 5), d = r.int(-5, 5), c = r.int(-12, 12); if (!b || !d || !c || gcd(a, b) !== 1) continue;
      // (2x + b)(x + d) − c = 2x² + (2d + b)x + (bd − c)
      var A = 2, Bm = 2 * d + b, C = b * d - c, disc = Bm * Bm - 4 * A * C; if (disc <= 0) continue;
      var s = Math.round(Math.sqrt(disc)); if (s * s !== disc) continue;
      var n1 = -Bm + s, n2 = -Bm - s; // roots n/4
      var r1 = ex.norm(n1, 4), r2 = ex.norm(n2, 4); if (r1[1] > 2 || r2[1] > 2 || (r1[1] === 1 && r2[1] === 1)) continue;
      var f1 = [r1[1], -r1[0]], f2 = [r2[1], -r2[0]], k = A / (f1[0] * f2[0]);
      if (k !== 1) continue;
      var E = Eq({ fs: [f1, f2], show: 'prod', Q: [[2, b], [1, d]], c: c }); E.notZero = uniqR([ex.norm(c - b, 2), [c - d, 1]]).map(rv); return E;
    }
    var Eb = Eq({ fs: [[1, -1], [2, -3]], show: 'prod', Q: [[2, 1], [1, -3]], c: -6 }); Eb.notZero = [ -3.5, -3]; return Eb;
  }
  /* NR: positive root p/q of a decomposed quadratic */
  function pqPart(r, sp) {
    var E = null;
    for (var i = 0; i < 500 && !E; i++) {
      var a = r.int(2, 5), b = r.int(1, 9), c = r.int(2, 5), d = r.int(1, 9);
      if (gcd(a, b) !== 1 || gcd(c, d) !== 1 || b % a === 0 || a === c) continue;
      if (a * c > 30) continue;
      E = Eq({ fs: [[a, -b], [c, d]] });
    }
    E = E || Eq({ fs: sp.book });
    var pos = E.roots.filter(function (x) { return rv(x) > 0; })[0], neg = E.roots.filter(function (x) { return rv(x) < 0; })[0], p = pos[0], q = pos[1];
    return B.nr('The positive solution of ' + t(E.ptex + '=0') + ' can be written as ' + t('x=\\frac{p}{q}') + ' in lowest terms, where ' + t('p') + ' and ' + t('q') + ' are positive integers. The value of ' + t('p+q') + ' is ________.', p + q, function (v) {
      if (neg && v === Math.abs(neg[0]) + neg[1]) return { code: 'u4l9-pq', hint: 'That comes from the <b>negative</b> solution. Use the positive one.' };
      if (v === p * q) return { code: 'value', hint: 'Add ' + t('p') + ' and ' + t('q') + ', don’t multiply.' };
      return null;
    }, solveLines(E, { how: 'decomposition' }).join('<br>') + '<br>The positive solution is ' + t('x=' + rtex(pos)) + ', so ' + t('p+q=' + p + '+' + q + '=' + (p + q)) + '.', ['Factor by decomposition, then solve each factor. Use the positive solution.'], 'NR p+q');
  }
  /* two numbers in labelled boxes (dimensions / integers) */
  function twoNums(a, b, labels, prompt, sol, rejectVals) {
    var chk = function (resp) {
      resp = resp || [];
      var A = K.read(resp[0] == null ? '' : resp[0]), C = K.read(resp[1] == null ? '' : resp[1]);
      if (A.res) return { v: A.res.v, code: A.res.code, hint: '<b>' + labels[0] + ':</b> ' + A.res.hint }; if (C.res) return { v: C.res.v, code: C.res.code, hint: '<b>' + labels[1] + ':</b> ' + C.res.hint };
      if (A.val === a && C.val === b) return ok();
      if (A.val === b && C.val === a) return form('u4l9-dims', 'Right numbers — check which box each one goes in.');
      if ((rejectVals || []).some(function (x) { return Math.abs(A.val - x) < 1e-9 || Math.abs(C.val - x) < 1e-9; })) return wrong('u4l9-pick', 'You used the root that has to be rejected (it is negative). Use the positive root.');
      return wrong('u4l9-dims', 'Use the positive root, then work out the other quantity from it.');
    };
    var p = B.fields(prompt, labels.map(function (l) { return { name: l, label: l }; }), [chk, function () { return ok(); }], [String(a), String(b)], labels[0] + ' ' + t(a) + ', ' + labels[1].toLowerCase() + ' ' + t(b), sol, ['Reject the root that doesn’t make sense here, then use the other one.'], 'two values');
    p.check = chk; p.bad = [[String(rejectVals[0]), String(rejectVals[1])]];
    return p;
  }
  /* build a quadratic equation from its roots; any non-zero integer multiple is accepted */
  function buildEqPart(fs, rootsTex) {
    var E = Eq({ fs: fs }), T = E.P, tex = E.ptex;
    var wrongSign = fs.reduce(function (acc, f) { return P.mul(acc, S(M(f[0], 'x'), N(-f[1]))); }, N(1));
    var chk = function (resp) {
      var s = String(resp == null ? '' : resp).replace(/=\s*0\s*$/, '');
      var a = K.read(s); if (a.res) return a.res;
      var rd = P.read(a.ast); if (!rd.ok) return wrong('value', null);
      var S2 = rd.p, ts = P.terms(T), lead = P.lead(T, 'x'), sl = P.lead(S2, 'x');
      if (!sl[0]) return wrong('value', null);
      var ratio = [sl[0] * lead[1], sl[1] * lead[0]], scaled = P.scale(T, ratio);
      if (P.eq(scaled, S2)) {
        if (P.terms(S2).some(function (x) { return x.c[1] !== 1; })) return wrong('u4l9-eq-not-int', 'Right roots — now clear the fractions: multiply every term by the denominator so all the coefficients are integers.');
        var fi = P.formIssue(a.ast); if (fi) return form(fi.code, fi.msg || 'Expand it fully (no brackets).');
        return ok();
      }
      if (P.eq(P.scale(wrongSign, ratio), S2)) return wrong('u4l9-eq-root-sign', 'Your equation has roots with the opposite signs. A root ' + t('x=r') + ' gives the factor ' + t('(x-r)') + ': the sign changes.');
      return wrong('value', 'Write a factor for each root, multiply them, and expand. Check: substitute each root — it should give ' + t('0') + '.');
    };
    var facTex = fs.map(function (f) { return f[1] === 0 ? (f[0] === 1 ? 'x' : f[0] + 'x') : '(' + tx(S(M(f[0], 'x'), N(f[1]))) + ')'; }).join('');
    return { prompt: rootsTex + ': build the equation.', input: { type: 'math', keys: 'poly', vars: ['x'], after: t('=0'), placeholder: 'e.g. x^2 - 2x - 15' }, check: chk, key: tex, answer: t(tex + '=0') + ' (or any non-zero integer multiple of it)',
      solution: 'Each root gives a factor: ' + fs.map(function (f) { var r = rt(f[0], f[1]); return t('x=' + rtex(r)) + ' → ' + t(f[1] === 0 ? 'x' : '(' + tx(S(M(f[0], 'x'), N(f[1]))) + ')'); }).join(', ') + (fs.some(function (f) { return f[0] !== 1; }) ? ' (the factor ' + t('(' + tx(S(M(fs[0][0], 'x'), N(fs[0][1]))) + ')') + ' clears the fraction)' : '') + '.<br>' + t(facTex + '=0') + ', so ' + t(tex + '=0') + '.',
      hints: ['If ' + t('x=r') + ' is a root, ' + t('(x-r)') + ' is a factor. For a fraction root like ' + t('x=\\frac{1}{2}') + ', use ' + t('(2x-1)') + '.', 'Multiply the factors and expand.'], text: 'equation from ' + rootsTex,
      bad: (P.eq(wrongSign, T) ? [] : [tx(wrongSign)]).concat([facTex]), good: [tx(P.scale(T, 2)), tex + '=0', tx(P.scale(T, -1))] };
  }
})(window);
