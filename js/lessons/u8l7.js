/* Math 15 · Unit 8 · Lesson 7 — Solving Word Problems with Systems of Equations (RF9)
 * Assignment 7 (u8_L07.tex, Questions 1–14) and the Lesson 7 Extra Practice (u8_EP07.tex, Questions 1–23).
 * Every part is a generator: the story stays, the numbers change (whole counts, whole cents, friendly no-calculator
 * arithmetic), and the booklet's own numbers are among the possible versions.
 * Model: Math 10C u8l4.js (system boxes on the eq keypad: two equations, either order, any equivalent form, classic
 * mistranslations diagnosed; labelled answer boxes; multiple choice whose options are reasons).
 * Conversions: "assign variables" -> choose the let statements (multiple choice) where the booklet asks for them, and
 * the letters are named in every other prompt; "write a system" -> the system part; "solve / state the answer" -> one
 * box per quantity, labelled with what it counts and its units; "explain / check in words / which number is not
 * needed" -> multiple choice whose options are reasons; error analysis -> the student's (wrong) result, why it fails,
 * the corrected equation, the corrected answer.
 * Levels (Math 15): number and age translations BEG; count-and-value systems EMG, solving them PRG; the harder
 * extra-practice translations (current, percent, digits, rate × time) PRG–ADV. Mastery: Extra 19(b)(i) (rewrite the
 * reversed equation), 21(b) (work backwards to an erased price), 23(b) (two-stage revenue). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, LS = HW.lines;

  /* ---------- number formatting ---------- */
  function near(a, b) { return Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)); }
  function rnd(v) { return Math.round(v * 10000) / 10000; }
  function grpAll(s) { s = String(s); var neg = s[0] === '-'; if (neg) s = s.slice(1); var p = s.split('.'), i = p[0], out = ''; while (i.length > 3) { out = '\\,' + i.slice(-3) + out; i = i.slice(0, -3); } return (neg ? '-' : '') + i + out + (p[1] ? '.' + p[1] : ''); }
  function N(v) { var x = rnd(v); return Math.abs(x) >= 10000 ? grpAll(String(x)) : String(x); }
  function plain(v) { return String(rnd(v)); }
  function m2(v) { return (Math.round(v * 100) / 100).toFixed(2); }
  function mon(v) { var c = Math.round(v * 100); return c % 100 === 0 ? String(c / 100) : (c / 100).toFixed(2); }   // 11, 2.75, 0.10
  function D(v) { return '\\$' + mon(v); }
  function Dh(v) { return t(D(v)); }
  function co(p) { return near(p, 1) ? '' : mon(p); }                       // a price as a coefficient: 1 -> '', 0.10 -> 0.10
  function pdec(p) { return (p / 100).toFixed(2); }                         // 12 -> 0.12
  function art(n) { var s = String(n); return s[0] === '8' || s === '11' || s === '18' ? 'an' : 'a'; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var TIMES = { 2: 'twice', 3: 'three times', 4: 'four times', 5: 'five times' };
  var NW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  function gen(f, fb) { for (var g = 0; g < 800; g++) { var o = f(); if (o) return o; } return fb; }
  function chk(s) { return s + ' ✓'; }
  function sgn(v) { return v < 0 ? '(' + N(v) + ')' : N(v); }

  /* ---------- systems (from Math 10C u8l4) ---------- */
  function eqOf(e, vars) { if (Array.isArray(e)) return e; var r = LS.read(e, vars); return r.ok ? [r.a, r.b, r.c] : null; }
  function onPt(L, P) { var s = Math.max(1, Math.abs(L[2]), Math.abs(L[0] * P[0]), Math.abs(L[1] * P[1])); return Math.abs(L[0] * P[0] + L[1] * P[1] + L[2]) < 1e-7 * s; }
  function solve2(A, B) { var d = A[0] * B[1] - A[1] * B[0]; if (Math.abs(d) < 1e-12) return null; return [(-A[2] * B[1] + A[1] * B[2]) / d, (-A[0] * B[2] + A[2] * B[0]) / d]; }
  var READWHY = { 'no-eq': 'Each box needs an equation with an equals sign.', unreadable: 'One of your equations can’t be read — check the brackets and signs.', 'not-linear': 'Each equation should be linear: no letters multiplied together or squared.', empty: 'Write both equations.' };
  /* T = [[A, B, C], [A, B, C]] (Ax + By + C = 0 in opt.vars); either order, any equivalent equation.
   * opt.names: what each equation says; opt.factHints: hint when that one is wrong; opt.alts: other correct forms;
   * opt.wrong: [{ eq, code, hint }] classic mistranslations (strings also become `bad` test answers). */
  function sysCheck(T, opt) {
    var vars = opt.vars, names = opt.names || ['the first fact', 'the second fact'];
    var alts = [0, 1].map(function (j) { return ((opt.alts || [])[j] || []).map(function (e) { return eqOf(e, vars); }).filter(Boolean); });
    var wr = (opt.wrong || []).map(function (w) { return { L: eqOf(w.eq, vars), code: w.code, hint: w.hint }; }).filter(function (w) { return w.L && !LS.same(w.L, T[0]) && !LS.same(w.L, T[1]); });
    var P = solve2(T[0], T[1]);
    function match(L) { for (var j = 0; j < 2; j++) { if (LS.same(L, T[j])) return j; if (alts[j].some(function (a) { return LS.same(L, a); })) return j; } return -1; }
    return function (resp) {
      resp = resp || [];
      var a = String(resp[0] || '').trim(), b = String(resp[1] || '').trim();
      if (!a && !b) return form('empty', 'Write both equations.');
      if (!a || !b) return form('sys-one', 'Write <b>two</b> equations — one in each box.');
      var rs = [LS.read(a, vars), LS.read(b, vars)];
      for (var i = 0; i < 2; i++) if (!rs[i].ok) return form('line-' + rs[i].why, rs[i].why === 'vars' ? 'Use only the letters ' + t(vars[0]) + ' and ' + t(vars[1]) + ' from the question.' : READWHY[rs[i].why] || READWHY.unreadable);
      var Ls = rs.map(function (q) { return [q.a, q.b, q.c]; }), m = Ls.map(match);
      if (m[0] >= 0 && m[1] >= 0 && m[0] !== m[1]) return ok();
      if (m[0] >= 0 && m[0] === m[1]) return wrong('sys-same', 'Both of your equations describe ' + names[m[0]] + '. Write one equation for each fact in the story.');
      for (i = 0; i < 2; i++) if (m[i] < 0) for (var k = 0; k < wr.length; k++) if (LS.same(Ls[i], wr[k].L)) return wrong(wr[k].code, wr[k].hint);
      var g = m[0] >= 0 ? 0 : m[1] >= 0 ? 1 : -1;
      if (g >= 0) {
        var miss = 1 - m[g], der = P && onPt(Ls[1 - g], P);
        return wrong(der ? 'sys-derived' : 'sys-eq', 'Your equation for ' + names[m[g]] + ' is right. ' + (der ? 'Your other equation is true for the answer, but it isn’t a sentence of the story translated — write the equation for ' + names[miss] + ' straight from the words.' : 'Check the one for ' + names[miss] + (opt.factHints ? ': ' + opt.factHints[miss] : '.')));
      }
      if (P && onPt(Ls[0], P) && onPt(Ls[1], P)) return wrong('sys-derived', 'Both equations are true for the answer, but they aren’t the facts of the story — write one equation straight from each sentence (no solving yet).');
      return wrong('sys-eq', opt.factHints ? 'Neither equation matches the story yet. ' + cap(opt.factHints[0]) : null);
    };
  }
  function sysP(prompt, T, opt, sol, hints, text) {
    var labels = opt.labels || ['Equation 1', 'Equation 2'], shown = opt.showTex || opt.keyTex, bad = (opt.bad || []).slice();
    (opt.wrong || []).forEach(function (w) { if (typeof w.eq === 'string') { var L = eqOf(w.eq, opt.vars); if (L && !LS.same(L, T[0]) && !LS.same(L, T[1])) { bad.push([opt.keyTex[0], w.eq]); bad.push([w.eq, opt.keyTex[1]]); } } });
    return { prompt: prompt, input: { type: 'fields', fields: labels.map(function (l) { return { label: l, mode: 'math', keys: 'eq', vars: opt.vars, placeholder: ' ' }; }) },
      check: sysCheck(T, opt), key: opt.keyTex, answer: shown.map(function (k) { return t(k); }).join('<br>'), solution: sol, hints: hints || [], text: text,
      good: (opt.good || []).concat([opt.keyTex.slice().reverse()]), bad: bad };
  }
  /* one equation */
  function eqCheck(T, opt) {
    var vars = opt.vars, wr = (opt.wrong || []).map(function (w) { return { L: eqOf(w.eq, vars), code: w.code, hint: w.hint }; }).filter(function (w) { return w.L && !LS.same(w.L, T); });
    return function (resp) {
      var s = String(resp || '').trim(); if (!s) return form('empty', 'Type your equation first.');
      var q = LS.read(s, vars); if (!q.ok) return form('line-' + q.why, q.why === 'vars' ? 'Use only the letters ' + t(vars[0]) + ' and ' + t(vars[1]) + '.' : q.why === 'no-eq' ? 'Write an equation with an equals sign.' : READWHY[q.why] || READWHY.unreadable);
      var L = [q.a, q.b, q.c]; if (LS.same(L, T)) return ok();
      for (var k = 0; k < wr.length; k++) if (LS.same(L, wr[k].L)) return wrong(wr[k].code, wr[k].hint);
      return wrong('eq', opt.hint || null);
    };
  }
  /* labelled number boxes. opt.names (plain words), opt.sys (two lines in box order) + opt.sysNames, opt.wrong [{ v, code, hint }], opt.swapHint */
  function numsCheck(want, opt) {
    opt = opt || {}; var names = opt.names || want.map(function (x, i) { return 'value ' + (i + 1); });
    return function (resp) {
      resp = resp || []; var vals = [];
      for (var i = 0; i < want.length; i++) {
        var s = String(resp[i] == null ? '' : resp[i]).replace(/\\\$|\$/g, '').trim();
        if (!s) return form('empty', want.length > 1 ? 'Fill in every box.' : 'Type your answer first.');
        var p = HW.parse.number(s), fm = !p.ok && s.replace(/\s/g, '').match(/^(-?)(?:\\d?frac\{(-?\d+)\}\{(\d+)\}|(-?\d+)\/(\d+))$/);
        if (fm && Number(fm[3] || fm[5])) p = { ok: true, value: (fm[1] ? -1 : 1) * Number(fm[2] || fm[4]) / Number(fm[3] || fm[5]) };
        if (!p.ok) { var ru = s.replace(/\\(text|mathrm)\{\s*([^{}]*)\}/g, '$2').replace(/\s*[a-zA-Z/²\\ ]+\.?$/, ''); if (ru !== s && HW.parse.number(ru).ok) return form('units', 'Leave the unit out — just type the number (the unit is printed next to the box).'); return form('notnumber', 'Enter a single number for the ' + names[i] + (opt.money ? ' (no $ sign needed).' : '.')); }
        vals.push(p.value);
      }
      if (vals.every(function (v, j) { return near(v, want[j]); })) return ok();
      var W0 = (opt.wrong || []).filter(function (w) { return w.v && w.v.every(function (x, j) { return isFinite(x) && near(vals[j], x); }) && !w.v.every(function (x, j) { return near(x, want[j]); }); })[0];
      if (W0) return wrong(W0.code, W0.hint);
      if (want.length === 2 && near(vals[0], want[1]) && near(vals[1], want[0]) && !near(want[0], want[1])) return wrong('swap-answer', opt.swapHint || 'Right numbers, wrong boxes: which one is the ' + names[0] + '?');
      if (opt.sys && want.length === 2) {
        var s0 = onPt(opt.sys[0], vals), s1 = onPt(opt.sys[1], vals), sn = opt.sysNames || ['the first equation', 'the second equation'];
        if (s0 !== s1) return wrong('sys-one-eq', 'Your numbers fit ' + (s0 ? sn[0] : sn[1]) + ' but not ' + (s0 ? sn[1] : sn[0]) + '. Substitute them into both equations and look for the slip.');
      }
      var right = vals.map(function (v, j) { return near(v, want[j]); });
      if (right.some(Boolean)) { var j = right.indexOf(false); return wrong('one-value', want.length === 2 ? 'Your ' + names[1 - j] + ' is right — substitute it into one of the equations to find the ' + names[j] + ' again.' : 'Some of your values are right — check the ' + names[j] + '.'); }
      if (opt.diag) { var h = opt.diag(vals); if (h) return wrong(h.code, h.hint); }
      return wrong('value', opt.hint || null);
    };
  }
  function numsP(prompt, fields, want, opt, sol, hints, text) {
    opt = opt || {};
    var show = function (v) { return opt.money ? mon(v) : N(v); };
    return { prompt: prompt, input: { type: 'fields', fields: fields.map(function (f) { return { label: f.label, before: f.before, after: f.after }; }) },
      check: numsCheck(want, opt), key: want.map(function (v) { return opt.money && !Number.isInteger(v) ? m2(v) : plain(v); }),
      answer: fields.map(function (f, i) { return f.label + ': ' + (f.before ? f.before : '') + t(show(want[i])) + (f.after ? ' ' + f.after : ''); }).join('<br>'),
      solution: sol, hints: hints || [], text: text,
      bad: (opt.bad || []).concat(want.length === 2 && !near(want[0], want[1]) ? [[plain(want[1]), plain(want[0])]] : []).concat((opt.wrong || []).filter(function (w) { return w.v.every(isFinite) && !w.v.every(function (x, j) { return near(x, want[j]); }); }).map(function (w) { return w.v.map(plain); })) };
  }
  function numP(prompt, ans, diag, sol, hints, text, inp) {
    var p = K.P.number(prompt, ans, diag, sol, hints, text, inp);
    p.check = (function (c) { return function (resp) { return c(String(resp == null ? '' : resp).replace(/\\\$|\$/g, '')); }; })(p.check);
    if (inp && inp.money) { p.answer = t(D(ans)); p.key = Number.isInteger(ans) ? String(ans) : m2(ans); }
    else p.answer = (inp && inp.before ? inp.before : '') + t(N(ans)) + (inp && inp.after ? ' ' + inp.after : '');
    return p;
  }
  function nrP(prompt, ans, diag, sol, hints, text) { var p = K.P.nr(prompt, ans, diag, sol, hints, text); p.bad = [String(ans + 1)]; return p; }
  function mc(r, prompt, opts, sol, hints, text) { return K.P.mc(r, prompt, opts, sol, hints, text); }

  HW.addCodes({
    'perim-half': 'Perimeter: used l + w instead of 2l + 2w', 'more-than-flip': '“More than” put on the wrong quantity', 'more-times': '“More than” written as times', 'times-more': '“Times” written as more than',
    'more-than-side': '“More than / less than” added to the wrong side', 'sum-diff': 'Sum written as a difference', 'diff-order': 'Difference subtracted in the wrong order',
    'ratio-flip': '“Twice as many” put on the wrong variable', 'answered-other': 'Gave the other quantity, not the one asked for', 'units-mix': 'Mixed cents and dollars in one equation', 'count-value': 'Count and value mixed up',
    'value-swap': 'Values attached to the wrong items', 'pct-decimal': 'Percent not changed to a decimal', 'area-perim': 'Gave the perimeter, not the area', 'dim-not-area': 'Gave one dimension, not the area',
    'swap-answer': 'Right numbers in the wrong boxes', 'one-value': 'One value right, the other wrong', 'sys-derived': 'Equation true for the answer but not a translation', 'sys-eq': 'Equation does not match the story', 'sys-same': 'Both equations say the same fact',
    'sys-one-eq': 'Values fit only one of the two equations', 'rounded-count': 'Rounded the solution before checking it', 'rev-direction': '“More / less” reversed in the digit equation', 'digits-diff': 'Reversal changes the number by 9 × (difference), not the difference',
    'rate-fixed': 'Fixed fee and rate mixed up', 'sign-count': 'Sign of a negative count',
    'u8l7-facts-swap': 'Put a number from one fact into the other equation', 'u8l7-sum-perim': 'Used 2l + 2w when the problem gave the sum of the length and width',
    'u8l7-not-halved': 'Stopped at 2x = … (did not divide by 2)', 'u8l7-current-sign': 'Current added (or subtracted) both ways',
    'u8l7-drt': 'Distance, rate and time combined the wrong way', 'u8l7-pct-total': 'Value equation: used the percent instead of the amount in the mixture',
    'u8l7-age-now': 'Used today’s ages for the “years ago” fact', 'u8l7-age-bracket': 'Took only one age back in time', 'u8l7-average': 'Used the average price of the mixture',
    'u8l7-not-divided': 'Found the cost of the part but did not divide by its mass', 'u8l7-wrong-mass': 'Divided by the wrong mass', 'u8l7-whole-sat': 'Doubled every ticket, not just the adult tickets',
    'u8l7-one-day': 'Counted only one day', 'u8l7-nadia-copied': 'Kept the reversed equation'
  });
  HW.addPartial({
    'u8l7-facts-swap': 'n', 'u8l7-sum-perim': 'n', 'u8l7-not-halved': 'b', 'u8l7-current-sign': 'n', 'u8l7-drt': 'n', 'u8l7-pct-total': 'b',
    'u8l7-age-now': 'n', 'u8l7-age-bracket': 'b', 'u8l7-average': 'n', 'u8l7-not-divided': 'b', 'u8l7-wrong-mass': 'b', 'u8l7-whole-sat': 'b', 'u8l7-one-day': 'b', 'u8l7-nadia-copied': 'n'
  });

  /* ======================= shared builders ======================= */
  /* count-and-value problems. s = { X, Y, n1, n2 (plural nouns), p1, p2 (price of one / per kg), x, y, N (total count), T (total value),
   * what ('items' / 'tickets' / 'coins' — what the count counts), unit ('' or 'kg'), each ('each' / 'per kg'), dec (decimal prices) } */
  function cvKeys(s) { return [s.X + '+' + s.Y + '=' + s.N, co(s.p1) + s.X + '+' + co(s.p2) + s.Y + '=' + mon(s.T)]; }
  function cvSys(prompt, s) {
    var k = cvKeys(s), cnt = s.unit ? 'total mass' : 'total number of ' + s.what, val = s.dec ? 'total value (in dollars)' : 'total value';
    var Tc = Math.round(100 * s.T), c1 = Math.round(100 * s.p1), c2 = Math.round(100 * s.p2);
    var wr = [{ eq: co(s.p2) + s.X + '+' + co(s.p1) + s.Y + '=' + mon(s.T), code: 'value-swap', hint: 'Each price goes with its own item: ' + s.n1 + ' are ' + Dh(s.p1) + ' ' + s.each + ', so they bring in ' + t(co(s.p1) + s.X) + ' dollars.' },
      { eq: s.X + '+' + s.Y + '=' + mon(s.T), code: 'count-value', hint: t(s.X + '+' + s.Y) + ' adds ' + (s.unit ? 'kilograms' : 'numbers of ' + s.what) + ', so it equals the ' + cnt + ', ' + t(N(s.N)) + (s.unit ? ' kg' : '') + ' — not the money.' },
      { eq: co(s.p1) + s.X + '+' + co(s.p2) + s.Y + '=' + s.N, code: 'count-value', hint: 'Price × amount gives <b>dollars</b>, so the value equation equals the money, ' + Dh(s.T) + '.' }];
    (s.extraWrong || []).forEach(function (w) { wr.push(w); });
    if (s.dec) wr.push({ eq: [c1, c2, -s.T], code: 'units-mix', hint: 'Mixed units: ' + t(c1 + s.X + '+' + c2 + s.Y) + ' is in <b>cents</b> but ' + t(mon(s.T)) + ' is in dollars. Use ' + t(k[1]) + ' (or ' + t(c1 + s.X + '+' + c2 + s.Y + '=' + Tc) + ' cents).' });
    return sysP(prompt, [[1, 1, -s.N], [s.p1, s.p2, -s.T]],
      { vars: [s.X, s.Y], keyTex: k, names: ['the ' + cnt, 'the ' + val],
        factHints: ['one equation adds the ' + (s.unit ? 'kilograms' : s.what) + ': ' + t(s.X + '+' + s.Y + '=' + N(s.N)) + '.', 'the other adds the money: (price) × (' + (s.unit ? 'kilograms' : 'number') + ') for each ' + (s.unit ? 'ingredient' : 'item') + ', so ' + t(co(s.p1) + s.X + '+' + co(s.p2) + s.Y) + '.'],
        wrong: wr, good: s.dec ? [[k[0], c1 + s.X + '+' + c2 + s.Y + '=' + Tc]] : [] },
      '<b>' + cap(s.unit ? 'mass' : 'count') + ':</b> ' + t(k[0]) + '<br><b>Value:</b> ' + t(k[1]) + (s.dec ? ' (or ' + t(c1 + s.X + '+' + c2 + s.Y + '=' + Tc) + ' in cents)' : ''),
      ['One equation adds the ' + (s.unit ? 'kilograms' : s.what) + '; the other adds the money (price × ' + (s.unit ? 'mass' : 'number') + ' for each).'], 'count and value system');
  }
  function term(p, v) { return near(p, 1) ? N(v) : co(p) + '(' + N(v) + ')'; }
  function cvSolveText(s) {
    var k = cvKeys(s), txt = '', sc = s.dec ? 100 : 1;
    var A = Math.round(sc * s.p1), M = Math.round(sc * s.p2), TT = Math.round(sc * s.T);
    if (s.dec) txt += 'Multiply the value equation by ' + t(100) + ' to clear the decimals: ' + t(A + s.X + '+' + M + s.Y + '=' + TT) + '.<br>';
    var mult = M === 1 ? '' : 'Multiply the count equation by ' + t(M) + ': ' + t(M + s.X + '+' + M + s.Y + '=' + N(M * s.N)) + '.<br>';
    if (A > M) txt += mult + 'Subtract ' + (M === 1 ? 'the count equation' : 'it') + ' from the value equation (the ' + t(s.Y) + '-terms cancel): ' + t(co(A - M) + s.X + '=' + N(TT - M * s.N)) + (A - M === 1 ? '' : ' ⟹ ' + t(s.X + '=' + N(s.x))) + '.<br>';
    else txt += mult + 'Subtract the value equation from it (the ' + t(s.Y) + '-terms cancel): ' + t(co(M - A) + s.X + '=' + N(M * s.N - TT)) + (M - A === 1 ? '' : ' ⟹ ' + t(s.X + '=' + N(s.x))) + '.<br>';
    txt += 'Then ' + t(s.Y + '=' + N(s.N) + '-' + N(s.x) + '=' + N(s.y)) + '.<br>' +
      chk('Check: ' + t(N(s.x) + '+' + N(s.y) + '=' + N(s.N))) + ', ' + chk(t(term(s.p1, s.x) + '+' + term(s.p2, s.y) + '=' + m2s(s.p1 * s.x) + '+' + m2s(s.p2 * s.y) + '=' + mon(s.T)));
    return t(k[0]) + ' and ' + t(k[1]) + '.<br>' + txt;
  }
  function m2s(v) { return Number.isInteger(rnd(v)) ? N(v) : m2(v); }
  function cvSolve(prompt, s, sentence) {
    return numsP(prompt, [{ label: cap(s.n1), after: s.unit || '' }, { label: cap(s.n2), after: s.unit || '' }], [s.x, s.y],
      { names: ['number of ' + s.n1, 'number of ' + s.n2].map(function (x) { return s.unit ? x.replace('number of', 'kg of') : x; }), sys: [[1, 1, -s.N], [s.p1, s.p2, -s.T]], sysNames: ['the count equation', 'the value equation'],
        swapHint: 'Right numbers, wrong boxes — test them: ' + t(co(s.p1) + '(' + N(s.y) + ')+' + co(s.p2) + '(' + N(s.x) + ')') + ' is not ' + Dh(s.T) + '. Which item costs ' + Dh(s.p1) + '?' },
      cvSolveText(s) + '<br><b>' + sentence + '</b>',
      ['Write the count equation and the value equation, then eliminate ' + t(s.Y) + ': multiply the count equation by ' + t(mon(s.p2)) + (s.dec ? ' (after clearing decimals)' : '') + ' and subtract.'], 'count and value solve');
  }
  /* "the sum is S and the larger is (k times / d more than) the smaller" */
  function relSys(prompt, o, vars, nm) {
    var A = vars[0], B = vars[1], times = o.kind === 'times';
    var k2 = times ? A + '=' + o.k + B : A + '=' + B + '+' + o.d;
    var W = times ? [{ eq: B + '=' + o.k + A, code: 'ratio-flip', hint: 'Test your equation with small numbers: if ' + t(B + '=10') + ', then ' + t(A) + ' should be ' + t(10 * o.k) + '. The ' + t(o.k) + ' multiplies the <b>smaller</b> one: ' + t(A + '=' + o.k + B) + '.' }, { eq: A + '=' + B + '+' + o.k, code: 'times-more', hint: '“' + cap(TIMES[o.k]) + '” means <b>multiply</b> by ' + t(o.k) + ', not add it.' }, { eq: A + '-' + B + '=' + o.S, code: 'sum-diff', hint: 'A <b>sum</b> adds: ' + t(A + '+' + B + '=' + o.S) + '.' }]
      : [{ eq: B + '=' + A + '+' + o.d, code: 'more-than-flip', hint: 'Who is bigger? ' + nm.big + ', so add ' + t(o.d) + ' to the <b>smaller</b> one: ' + t(A + '=' + B + '+' + o.d) + '. Test: if ' + t(B + '=10') + ', then ' + t(A + '=' + (10 + o.d)) + '.' }, { eq: A + '=' + o.d + B, code: 'more-times', hint: '“' + o.d + ' more than” <b>adds</b> ' + t(o.d) + ' — it doesn’t multiply.' }, { eq: A + '-' + B + '=' + o.S, code: 'sum-diff', hint: 'A <b>sum</b> adds: ' + t(A + '+' + B + '=' + o.S) + '.' }, { eq: A + '+' + B + '=' + o.d, code: 'u8l7-facts-swap', hint: 'The two add to ' + t(o.S) + '; ' + t(o.d) + ' is how many <b>more</b>.' }];
    return sysP(prompt, [[1, 1, -o.S], times ? [1, -o.k, 0] : [1, -1, -o.d]],
      { vars: vars, keyTex: [A + '+' + B + '=' + o.S, k2], names: [nm.sum, nm.rel], wrong: W,
        factHints: ['the two add to ' + t(o.S) + ': ' + t(A + '+' + B + '=' + o.S) + '.', times ? t(A) + ' is ' + TIMES[o.k] + ' ' + t(B) + ', so ' + t(A + '=' + o.k + B) + '.' : t(A) + ' is ' + t(o.d) + ' more than ' + t(B) + ', so ' + t(A + '=' + B + '+' + o.d) + '.'],
        good: times ? [] : [[A + '+' + B + '=' + o.S, A + '-' + B + '=' + o.d]] },
      '<b>' + cap(nm.sum) + ':</b> ' + t(A + '+' + B + '=' + o.S) + '<br><b>' + cap(nm.rel) + ':</b> ' + t(k2) + (times ? '' : ' (or ' + t(A + '-' + B + '=' + o.d) + ')'),
      ['One equation for the total (the sum), one for the comparison.', times ? '“' + cap(TIMES[o.k]) + '” means multiply. Test with small numbers.' : '“' + o.d + ' more than” means add ' + t(o.d) + ' to the smaller one.'], 'translate sum and comparison');
  }
  function relSolveText(o, vars) {
    var A = vars[0], B = vars[1];
    if (o.kind === 'times') return 'Substitute ' + t(A + '=' + o.k + B) + ' into ' + t(A + '+' + B + '=' + o.S) + ': ' + t(o.k + B + '+' + B + '=' + o.S) + ' ⟹ ' + t((o.k + 1) + B + '=' + o.S) + ' ⟹ ' + t(B + '=' + o.y) + '.<br>Then ' + t(A + '=' + o.k + '(' + o.y + ')=' + o.x) + '.<br>' + chk('Check: ' + t(o.x + '+' + o.y + '=' + o.S)) + ', ' + chk(t(o.x + '=' + o.k + '\\times ' + o.y));
    return 'Substitute ' + t(A + '=' + B + '+' + o.d) + ' into ' + t(A + '+' + B + '=' + o.S) + ': ' + t('(' + B + '+' + o.d + ')+' + B + '=' + o.S) + ' ⟹ ' + t('2' + B + '=' + (o.S - o.d)) + ' ⟹ ' + t(B + '=' + o.y) + '.<br>Then ' + t(A + '=' + o.y + '+' + o.d + '=' + o.x) + '.<br>' + chk('Check: ' + t(o.x + '+' + o.y + '=' + o.S)) + ', ' + chk(t(o.x + '=' + o.y + '+' + o.d));
  }
  function relSolve(prompt, o, vars, labels, names, sentence, units) {
    var W = o.kind === 'times' ? [] : [{ v: [o.S - o.d + o.d, o.S - o.d], code: 'u8l7-not-halved', hint: 'You stopped at ' + t('2' + vars[1] + '=' + (o.S - o.d)) + '. Divide both sides by ' + t(2) + ' to get ' + t(vars[1]) + '.' }];
    return numsP(prompt, [{ label: labels[0], after: units || '' }, { label: labels[1], after: units || '' }], [o.x, o.y],
      { names: names, sys: [[1, 1, -o.S], o.kind === 'times' ? [1, -o.k, 0] : [1, -1, -o.d]], sysNames: ['the sum', 'the comparison'], wrong: W,
        swapHint: 'Right numbers, wrong boxes: the ' + names[0] + ' is the bigger one.' },
      relSolveText(o, vars) + '<br><b>' + sentence + '</b>',
      ['Substitute the comparison equation into the sum equation, then solve for ' + t(vars[1]) + '.'], 'solve sum and comparison');
  }

  /* ======================= assignment generators ======================= */
  var OBJ = [{ n: 'garden path', u: 'm' }, { n: 'rectangular patio', u: 'm' }, { n: 'banner', u: 'm' }, { n: 'rectangular flower bed', u: 'm' }];
  function q1a(r) { return gen(function () { var k = r.pick([2, 2, 3]), w = r.int(3, 15), l = k * w; if (l > 40) return null; return { k: k, w: w, l: l, S: l + w, ob: r.pick(OBJ) }; }, { k: 2, w: 7, l: 14, S: 21, ob: OBJ[0] }); }
  var COINS = [{ c1: 'dimes', c2: 'quarters', s1: 'dime', s2: 'quarter', v1: 10, v2: 25, X: 'd', Y: 'q' }, { c1: 'nickels', c2: 'quarters', s1: 'nickel', s2: 'quarter', v1: 5, v2: 25, X: 'n', Y: 'q' }, { c1: 'nickels', c2: 'dimes', s1: 'nickel', s2: 'dime', v1: 5, v2: 10, X: 'n', Y: 'd' }];
  function q1b(r) { return gen(function () { var c = r.chance(0.6) ? COINS[0] : r.pick(COINS), x = r.int(8, 40), y = r.int(8, 40); if (x === y) return null; return { c: c, x: x, y: y, N: x + y, V: (c.v1 * x + c.v2 * y) / 100, holder: r.pick(['jar', 'piggy bank', 'coin purse', 'tip jar']) }; }, { c: COINS[0], x: 15, y: 25, N: 40, V: 7.75, holder: 'jar' }); }
  function sumMore(r, lo, hi, dlo, dhi) { return gen(function () { var y = r.int(lo, hi), d = r.int(dlo, dhi); return { kind: 'more', y: y, d: d, x: y + d, S: 2 * y + d }; }, null); }
  function sumTimes(r, ks, lo, hi) { return gen(function () { var k = r.pick(ks), y = r.int(lo, hi); return { kind: 'times', k: k, y: y, x: k * y, S: (k + 1) * y }; }, null); }
  var SIBS = [{ a: 'Sofia', b: 'Diego', rel: 'her brother', A: 'S', B: 'D' }, { a: 'Jordan', b: 'Ava', rel: 'his sister', A: 'J', B: 'A' }, { a: 'Maya', b: 'Noah', rel: 'her brother', A: 'M', B: 'N' },
    { a: 'Liam', b: 'Rosa', rel: 'his sister', A: 'L', B: 'R' }, { a: 'Hana', b: 'Ben', rel: 'her brother', A: 'H', B: 'B' }, { a: 'Kiran', b: 'Tess', rel: 'his sister', A: 'K', B: 'T' }];
  var PARENTS = [{ p: 'father', c: 'daughter', P: 'F', C: 'd', pr: 'his', cp: 'her' }, { p: 'mother', c: 'son', P: 'M', C: 's', pr: 'her', cp: 'his' }, { p: 'aunt', c: 'nephew', P: 'A', C: 'n', pr: 'her', cp: 'his' }];
  function q5(r) { return gen(function () { var k = r.pick([2, 3, 3, 4]), c = r.int(6, 18), p = k * c; if (p < 24 || p > 60) return null; return { kind: 'times', k: k, y: c, x: p, S: p + c, who: r.pick(PARENTS) }; }, { kind: 'times', k: 3, y: 13, x: 39, S: 52, who: PARENTS[0] }); }
  /* count-and-value stories */
  function cv(r, base, f) { return gen(function () { var s = f(); if (!s || s.x === s.y || s.x <= 0 || s.y <= 0) return null; s.N = s.x + s.y; s.T = rnd(s.p1 * s.x + s.p2 * s.y); for (var k in base) if (s[k] == null) s[k] = base[k]; return s; }, null); }
  function q6(r) { return cv(r, { X: 'a', Y: 'c', n1: 'adult tickets', n2: 'child tickets', what: 'tickets', each: 'each' }, function () { var p1 = r.int(9, 15), p2 = r.int(5, p1 - 2); return { p1: p1, p2: p2, x: r.int(2, 8), y: r.int(2, 8) }; }); }
  function q7(r) { return cv(r, { X: 'm', Y: 'c', n1: 'muffins', n2: 'cookies', what: 'items', each: 'each' }, function () { var p1 = r.int(3, 5), p2 = r.int(1, p1 - 1); return { p1: p1, p2: p2, x: r.int(10, 40), y: r.int(10, 40) }; }); }
  function q8(r) { return cv(r, { X: 'f', Y: 'b', n1: 'floor seats', n2: 'balcony seats', what: 'tickets', each: 'each' }, function () { var p1 = r.pick([40, 45, 50, 55, 60]), p2 = r.pick([20, 25, 30, 35]); if (p1 - p2 < 10) return null; return { p1: p1, p2: p2, x: 10 * r.int(3, 9), y: 10 * r.int(3, 9) }; }); }
  function q9(r) { return cv(r, { X: 'r', Y: 'a', n1: 'raisins', n2: 'almonds', what: 'kilograms', unit: 'kg', each: 'per kg' }, function () { var p1 = r.int(3, 6), p2 = r.int(p1 + 3, 12); return { p1: p1, p2: p2, x: r.int(5, 20), y: r.int(5, 20) }; }); }
  function q10(r) { return cv(r, { X: 'd', Y: 'l', n1: 'dark roast', n2: 'light roast', what: 'kilograms', unit: 'kg', each: 'per kg' }, function () { var p1 = r.int(12, 18), p2 = r.int(6, p1 - 3); return { p1: p1, p2: p2, x: r.int(2, 10), y: r.int(2, 10) }; }); }
  function q14(r) { return cv(r, { X: 'a', Y: 's', n1: 'adult tickets', n2: 'student tickets', what: 'tickets', each: 'each' }, function () { var p1 = r.int(10, 15), p2 = r.int(5, p1 - 3), x = 10 * r.int(4, 16), y = 10 * r.int(4, 16); if (x + y > 300) return null; return { p1: p1, p2: p2, x: x, y: y }; }); }
  /* booklet versions are among the possible values */
  function bookOr(r, p, book, f) { return r.chance(p) ? book : f(r); }

  /* ======================= extra practice generators ======================= */
  function riverGen(r) { return gen(function () { var td = r.pick([1, 2, 2, 3]), tu = td + r.pick([1, 1, 2]), k = r.int(2, 12), down = tu * k, up = td * k; if ((down - up) % 2) return null; var b = (down + up) / 2, c = (down - up) / 2; if (c < 1 || b > 40 || c > 10) return null; return { td: td, tu: tu, D: td * down, b: b, c: c, down: down, up: up }; }, { td: 2, tu: 3, D: 24, b: 10, c: 2, down: 12, up: 8 }); }
  function pctGen(r, lows, highs, M) { return gen(function () { var p1 = r.pick(lows), p2 = r.pick(highs), m = r.pick(M), x = r.int(1, 9) * m / 10, y = m - x; if (p2 <= p1) return null; var pm = (p1 * x + p2 * y) / m; if (!Number.isInteger(pm) || pm === p1 || pm === p2) return null; return { p1: p1, p2: p2, M: m, x: x, y: y, pm: pm, P: p1 * x / 100 + p2 * y / 100 }; }, null); }
  function digitGen(r) { return gen(function () { var tt = r.int(1, 8), u = r.int(tt + 1, 9); return { t: tt, u: u, s: tt + u, d: 9 * (u - tt) }; }, { t: 5, u: 7, s: 12, d: 18 }); }
  function hallGen(r) { return gen(function () { var f1 = 50 * r.int(2, 8), f2 = f1 + 50 * r.int(1, 6), r1 = r.int(12, 25), r2 = r.int(8, r1 - 2), n = (f2 - f1) / (r1 - r2); if (!Number.isInteger(n) || n < 10 || n > 80) return null; return { f1: f1, f2: f2, r1: r1, r2: r2, n: n, C: f1 + r1 * n }; }, { f1: 250, f2: 400, r1: 18, r2: 13, n: 30, C: 790 }); }

  /* ======================= questions ======================= */
  var QUESTIONS = [
    /* ---------- 1 ---------- */
    { num: '1', section: 'Part A — Translating Only', stem: 'Assign variables and write a system of two equations that models each situation. <b>Do not solve the system.</b>', parts: [
      { id: '1a', sub: 'a', level: 'BEG', make: function (r) {
        var o = q1a(r), A = 'l', B = 'w', k = o.k;
        return sysP('The length of a ' + o.ob.n + ' is ' + TIMES[k] + ' its width. The sum of the length and width is ' + t(o.S + '\\text{ ' + o.ob.u + '}') + '.<br>Let ' + t('l') + ' be the length and ' + t('w') + ' the width, in metres. Write the system.', [[1, -k, 0], [1, 1, -o.S]],
          { vars: [A, B], keyTex: ['l=' + k + 'w', 'l+w=' + o.S], names: ['the “' + TIMES[k] + '” fact', 'the sum'],
            factHints: ['the length is ' + TIMES[k] + ' the width: ' + t('l=' + k + 'w') + '.', 'length plus width is ' + t(o.S) + ': ' + t('l+w=' + o.S) + '.'],
            wrong: [{ eq: 'w=' + k + 'l', code: 'ratio-flip', hint: 'Test it: if the width is ' + t('5') + ' m, the length should be ' + t(5 * k) + ' m. The ' + t(k) + ' multiplies the <b>width</b>: ' + t('l=' + k + 'w') + '.' },
              { eq: 'l=w+' + k, code: 'times-more', hint: '“' + cap(TIMES[k]) + ' its width” means <b>multiply</b> the width by ' + t(k) + '.' },
              { eq: '2l+2w=' + o.S, code: 'u8l7-sum-perim', hint: 'The problem gives the <b>sum of the length and width</b>, not the perimeter: ' + t('l+w=' + o.S) + '.' },
              { eq: 'l-w=' + o.S, code: 'sum-diff', hint: 'A <b>sum</b> adds: ' + t('l+w=' + o.S) + '.' }] },
          t('l=' + k + 'w') + ' (the length is ' + TIMES[k] + ' the width)<br>' + t('l+w=' + o.S) + ' (the sum is ' + o.S + ' m)<br>(Not asked: this gives ' + t('w=' + o.w) + ', ' + t('l=' + o.l) + '.)',
          ['One equation comes from each sentence.', '“' + cap(TIMES[k]) + '” means multiply; “sum” means add.'], 'translate length and width');
      } },
      { id: '1b1', sub: 'b let', level: 'BEG', make: function (r) {
        var o = q1b(r), c = o.c;
        return mc(r, 'A ' + o.holder + ' contains ' + c.c1 + ' and ' + c.c2 + ' only. There are ' + t(o.N) + ' coins in total, worth ' + Dh(o.V) + '.<br>Which let statements define the two unknowns correctly?', [
          { html: 'Let ' + t(c.X) + ' = the <b>number</b> of ' + c.c1 + ' and ' + t(c.Y) + ' = the <b>number</b> of ' + c.c2 + '.', right: true },
          { html: 'Let ' + t(c.X) + ' = ' + c.c1 + ' and ' + t(c.Y) + ' = ' + c.c2 + '.', why: 'Too vague: is ' + t(c.X) + ' the <b>number</b> of ' + c.c1 + ' or their <b>value</b>? Say exactly what each letter counts.' },
          { html: 'Let ' + t(c.X) + ' = ' + t(pdec(c.v1)) + ' and ' + t(c.Y) + ' = ' + t(pdec(c.v2)) + '.', why: 'The value of one ' + c.s1 + ' is already known. The unknowns are <b>how many</b> of each coin there are.' },
          { html: 'Let ' + t(c.X) + ' = the number of coins and ' + t(c.Y) + ' = the value of the coins.', why: 'Both of those are given (' + o.N + ' coins, ' + Dh(o.V) + '). The unknowns are how many ' + c.c1 + ' and how many ' + c.c2 + '.' }],
          'The unknowns are <b>how many</b> of each coin: ' + t(c.X) + ' = the number of ' + c.c1 + ', ' + t(c.Y) + ' = the number of ' + c.c2 + '. (The total count and the total value are given.)', ['What don’t you know yet: the value of one coin, or how many of each coin there are?'], 'let statements for coins');
      } },
      { id: '1b2', sub: 'b system', level: 'EMG', make: function (r) {
        var o = q1b(r), c = o.c;
        var s = { X: c.X, Y: c.Y, n1: c.c1, n2: c.c2, p1: c.v1 / 100, p2: c.v2 / 100, x: o.x, y: o.y, N: o.N, T: o.V, what: 'coins', each: 'each', dec: true };
        var p = cvSys('A ' + o.holder + ' contains ' + c.c1 + ' and ' + c.c2 + ' only. There are ' + t(o.N) + ' coins in total, worth ' + Dh(o.V) + '.<br>Let ' + t(c.X) + ' be the number of ' + c.c1 + ' and ' + t(c.Y) + ' the number of ' + c.c2 + '. Write the system.', s);
        p.solution += '<br>Every term of the value equation is in dollars, so a ' + c.s1 + ' is ' + t(pdec(c.v1)) + ' and a ' + c.s2 + ' is ' + t(pdec(c.v2)) + '.';
        return p;
      } }] },
    /* ---------- 2 ---------- */
    { num: '2', section: 'Part B — Number and Age Problems', shared: function (r) { return bookOr(r, 0.05, { kind: 'more', y: 18, d: 9, x: 27, S: 45 }, function (r) { return sumMore(r, 5, 40, 2, 15); }); },
      stem: function (o) { return 'The sum of two numbers is ' + t(o.S) + '. The larger number is ' + t(o.d) + ' more than the smaller number. Find the two numbers.'; },
      parts: [
        { id: '2sys', sub: 'system', level: 'BEG', make: function (r, o) { return relSys('Let ' + t('L') + ' be the larger number and ' + t('S') + ' the smaller number. Write a system of two equations.', o, ['L', 'S'], { sum: 'the sum', rel: 'the “more than” fact', big: 'The larger number is bigger' }); } },
        { id: '2sol', sub: 'solve', level: 'BEG', make: function (r, o) { return relSolve('Solve the system. What are the two numbers?', o, ['L', 'S'], ['Larger number', 'Smaller number'], ['larger number', 'smaller number'], 'The numbers are ' + o.x + ' and ' + o.y + '.'); } }] },
    /* ---------- 3 ---------- */
    { num: '3', shared: function (r) { return bookOr(r, 0.05, { kind: 'times', k: 3, y: 12, x: 36, S: 48 }, function (r) { return sumTimes(r, [2, 3, 4, 5], 4, 20); }); },
      stem: function (o) { return 'One number is ' + TIMES[o.k] + ' another number. Their sum is ' + t(o.S) + '. Find the two numbers.'; },
      parts: [
        { id: '3sys', sub: 'system', level: 'BEG', make: function (r, o) { return relSys('Let ' + t('x') + ' be the larger number and ' + t('y') + ' the other number. Write a system of two equations.', o, ['x', 'y'], { sum: 'the sum', rel: 'the “' + TIMES[o.k] + '” fact' }); } },
        { id: '3sol', sub: 'solve', level: 'BEG', make: function (r, o) { return relSolve('Solve the system. What are the two numbers?', o, ['x', 'y'], ['Larger number', 'Other number'], ['larger number', 'other number'], 'The numbers are ' + o.x + ' and ' + o.y + '.'); } }] },
    /* ---------- 4 ---------- */
    { num: '4', shared: function (r) { return r.chance(0.05) ? { kind: 'more', y: 13, d: 7, x: 20, S: 33, p: SIBS[0] } : Object.assign(sumMore(r, 6, 20, 2, 12), { p: r.pick(SIBS) }); },
      stem: function (o) { return o.p.a + ' is ' + t(o.d) + ' years older than ' + o.p.rel + ' ' + o.p.b + '. The sum of their ages is ' + t(o.S) + '. Find both ages.'; },
      parts: [
        { id: '4sys', sub: 'system', level: 'BEG', make: function (r, o) { return relSys('Let ' + t(o.p.A) + ' be ' + o.p.a + '’s age and ' + t(o.p.B) + ' be ' + o.p.b + '’s age. Write a system of two equations.', o, [o.p.A, o.p.B], { sum: 'the sum of the ages', rel: 'who is older', big: o.p.a + ' is older' }); } },
        { id: '4sol', sub: 'solve', level: 'BEG', make: function (r, o) { return relSolve('Solve the system. How old is each person?', o, [o.p.A, o.p.B], [o.p.a + '’s age', o.p.b + '’s age'], [o.p.a + '’s age', o.p.b + '’s age'], o.p.a + ' is ' + o.x + ' and ' + o.p.b + ' is ' + o.y + '.', 'years'); } }] },
    /* ---------- 5 ---------- */
    { num: '5', shared: function (r) { return bookOr(r, 0.05, { kind: 'times', k: 3, y: 13, x: 39, S: 52, who: PARENTS[0] }, q5); },
      stem: function (o) { return 'A ' + o.who.p + ' is ' + TIMES[o.k] + ' as old as ' + o.who.pr + ' ' + o.who.c + '. The sum of their ages is ' + t(o.S) + '. Find both ages.'; },
      parts: [
        { id: '5sys', sub: 'system', level: 'BEG', make: function (r, o) { return relSys('Let ' + t(o.who.P) + ' be the ' + o.who.p + '’s age and ' + t(o.who.C) + ' the ' + o.who.c + '’s age. Write a system of two equations.', o, [o.who.P, o.who.C], { sum: 'the sum of the ages', rel: 'the “' + TIMES[o.k] + ' as old” fact' }); } },
        { id: '5sol', sub: 'solve', level: 'BEG', make: function (r, o) { return relSolve('Solve the system. How old is each person?', o, [o.who.P, o.who.C], [cap(o.who.p) + '’s age', cap(o.who.c) + '’s age'], [o.who.p + '’s age', o.who.c + '’s age'], 'The ' + o.who.p + ' is ' + o.x + ' and the ' + o.who.c + ' is ' + o.y + '.', 'years'); } }] },
    /* ---------- 6 ---------- */
    { num: '6', section: 'Part C — Cost and Purchase Problems', shared: function (r) { return r.chance(0.05) ? { X: 'a', Y: 'c', n1: 'adult tickets', n2: 'child tickets', what: 'tickets', each: 'each', p1: 11, p2: 7, x: 4, y: 5, N: 9, T: 79 } : q6(r); },
      stem: function (s) { return 'Movie tickets cost ' + Dh(s.p1) + ' for adults and ' + Dh(s.p2) + ' for children. A family bought ' + t(s.N) + ' tickets in total and paid ' + Dh(s.T) + '. How many adult tickets and how many child tickets did they buy?'; },
      parts: [
        { id: '6sys', sub: 'system', level: 'EMG', make: function (r, s) { return cvSys('Let ' + t('a') + ' be the number of adult tickets and ' + t('c') + ' the number of child tickets. Write a system of two equations.', s); } },
        { id: '6sol', sub: 'solve', level: 'PRG', make: function (r, s) { return cvSolve('Solve the system. How many tickets of each kind did they buy?', s, 'They bought ' + s.x + ' adult tickets and ' + s.y + ' child tickets.'); } }] },
    /* ---------- 7 ---------- */
    { num: '7', shared: function (r) { return r.chance(0.05) ? { X: 'm', Y: 'c', n1: 'muffins', n2: 'cookies', what: 'items', each: 'each', p1: 3, p2: 2, x: 26, y: 24, N: 50, T: 126 } : q7(r); },
      stem: function (s) { return 'A bakery sells muffins for ' + Dh(s.p1) + ' and cookies for ' + Dh(s.p2) + '. One morning, the bakery sold a total of ' + t(s.N) + ' items for ' + Dh(s.T) + '. How many muffins and how many cookies were sold?'; },
      parts: [
        { id: '7sys', sub: 'system', level: 'EMG', make: function (r, s) { return cvSys('Let ' + t('m') + ' be the number of muffins and ' + t('c') + ' the number of cookies. Write a system of two equations.', s); } },
        { id: '7sol', sub: 'solve', level: 'PRG', make: function (r, s) { return cvSolve('Solve the system. How many of each were sold?', s, 'The bakery sold ' + s.x + ' muffins and ' + s.y + ' cookies.'); } }] },
    /* ---------- 8 ---------- */
    { num: '8', shared: function (r) { return r.chance(0.05) ? { X: 'f', Y: 'b', n1: 'floor seats', n2: 'balcony seats', what: 'tickets', each: 'each', p1: 45, p2: 30, x: 70, y: 50, N: 120, T: 4650 } : q8(r); },
      stem: function (s) { return 'Concert tickets are sold as floor seats (' + Dh(s.p1) + ') and balcony seats (' + Dh(s.p2) + '). A total of ' + t(s.N) + ' tickets were sold, generating ' + Dh(s.T) + ' in revenue. How many floor seats and how many balcony seats were sold?'; },
      parts: [
        { id: '8sys', sub: 'system', level: 'EMG', make: function (r, s) { return cvSys('Let ' + t('f') + ' be the number of floor seats and ' + t('b') + ' the number of balcony seats sold. Write a system of two equations.', s); } },
        { id: '8sol', sub: 'solve', level: 'PRG', make: function (r, s) { return cvSolve('Solve the system. How many seats of each kind were sold?', s, s.x + ' floor seats and ' + s.y + ' balcony seats were sold.'); } }] },
    /* ---------- 9 ---------- */
    { num: '9', section: 'Part D — Mixture Problems', shared: function (r) { return r.chance(0.05) ? { X: 'r', Y: 'a', n1: 'raisins', n2: 'almonds', what: 'kilograms', unit: 'kg', each: 'per kg', p1: 4, p2: 9, x: 11, y: 14, N: 25, T: 170 } : q9(r); },
      stem: function (s) { return 'A trail mix combines raisins (' + Dh(s.p1) + '/kg) with almonds (' + Dh(s.p2) + '/kg). The mix weighs ' + t(s.N + '\\text{ kg}') + ' in total and sells for ' + Dh(s.T) + '. How many kilograms of each ingredient are in the mix?'; },
      parts: [
        { id: '9sys', sub: 'system', level: 'EMG', make: function (r, s) { return cvSys('Let ' + t('r') + ' be the kilograms of raisins and ' + t('a') + ' the kilograms of almonds. Write a system of two equations (one for the total mass, one for the total value).', s); } },
        { id: '9sol', sub: 'solve', level: 'PRG', make: function (r, s) { return cvSolve('Solve the system. How many kilograms of each ingredient are in the mix?', s, 'The mix has ' + s.x + ' kg of raisins and ' + s.y + ' kg of almonds.'); } }] },
    /* ---------- 10 ---------- */
    { num: '10', shared: function (r) { return r.chance(0.05) ? { X: 'd', Y: 'l', n1: 'dark roast', n2: 'light roast', what: 'kilograms', unit: 'kg', each: 'per kg', p1: 15, p2: 9, x: 5, y: 7, N: 12, T: 138 } : q10(r); },
      stem: function (s) { return 'A coffee shop blends dark roast beans (' + Dh(s.p1) + '/kg) with light roast beans (' + Dh(s.p2) + '/kg) to make a house blend. The blend weighs ' + t(s.N + '\\text{ kg}') + ' in total and costs ' + Dh(s.T) + '. How many kilograms of each type of bean are in the blend?'; },
      parts: [
        { id: '10sys', sub: 'system', level: 'EMG', make: function (r, s) { return cvSys('Let ' + t('d') + ' be the kilograms of dark roast and ' + t('l') + ' the kilograms of light roast. Write a system of two equations.', s); } },
        { id: '10sol', sub: 'solve', level: 'PRG', make: function (r, s) { return cvSolve('Solve the system. How many kilograms of each type of bean are in the blend?', s, 'The blend has ' + s.x + ' kg of dark roast and ' + s.y + ' kg of light roast.'); } }] },
    /* ---------- 11 ---------- */
    { num: '11', section: 'Part E — Multiple Choice and Numerical Response', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '11', level: 'EMG', make: function (r) {
        var o = r.chance(0.06) ? { S: 40, k: 3, c: 6, less: true } : gen(function () { var y = r.int(6, 20), k = r.pick([2, 3, 4]), c = r.int(2, 9), less = r.chance(0.7), x = less ? k * y - c : k * y + c; if (x <= y) return null; return { S: x + y, k: k, c: c, less: less }; }, { S: 40, k: 3, c: 6, less: true });
        var op = o.less ? '-' : '+', no = o.less ? '+' : '-', sys = function (a, b) { return t(a + ',\\ \\ ' + b); };
        return mc(r, 'A word problem states: <i>“The sum of two numbers is ' + t(o.S) + '. The larger number is ' + t(o.c) + ' ' + (o.less ? 'less' : 'more') + ' than ' + TIMES[o.k] + ' the smaller number.”</i> If ' + t('x') + ' is the larger number and ' + t('y') + ' is the smaller number, which system correctly represents this situation?', [
          { html: sys('x+y=' + o.S, 'x=' + o.k + 'y' + op + o.c), right: true },
          { html: sys('x+y=' + o.S, 'x=' + o.k + 'y' + no + o.c), why: '“' + o.c + ' ' + (o.less ? 'less' : 'more') + ' than ' + TIMES[o.k] + ' the smaller” starts from ' + t(o.k + 'y') + ' and ' + (o.less ? '<b>subtracts</b>' : '<b>adds</b>') + ' ' + t(o.c) + '.' },
          { html: sys('x-y=' + o.S, 'x=' + o.k + 'y' + op + o.c), why: '“The <b>sum</b> is ' + o.S + '” means add: ' + t('x+y=' + o.S) + '.' },
          { html: sys('x+y=' + o.S, 'y=' + o.k + 'x' + op + o.c), why: t('x') + ' is the <b>larger</b> number, so ' + t('x') + ' is the one equal to ' + TIMES[o.k] + ' ' + t('y') + ' ' + (o.less ? 'minus' : 'plus') + ' ' + t(o.c) + '.' }],
          '“Sum is ' + o.S + '” gives ' + t('x+y=' + o.S) + '. The larger number ' + t('x') + ' is ' + o.c + ' ' + (o.less ? 'less' : 'more') + ' than ' + TIMES[o.k] + ' the smaller: start from ' + t(o.k + 'y') + ' and ' + (o.less ? 'subtract' : 'add') + ' ' + t(o.c) + ', so ' + t('x=' + o.k + 'y' + op + o.c) + '.',
          ['“' + o.c + ' less than ' + t('A') + '” is ' + t('A-' + o.c) + '; “' + o.c + ' more than ' + t('A') + '” is ' + t('A+' + o.c) + '.'], 'which system: sum and k times');
      } }] },
    /* ---------- 12 ---------- */
    { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
      { id: '12', level: 'EMG', make: function (r) {
        var o = r.chance(0.05) ? { kind: 'more', y: 21, d: 10, x: 31, S: 52 } : sumMore(r, 8, 60, 2, 20);
        return nrP('The sum of two numbers is ' + t(o.S) + '. The larger number is ' + t(o.d) + ' more than the smaller number. The value of the smaller number is ____.', o.y, function (v) {
          if (v === o.x) return { code: 'answered-other', hint: 'That’s the <b>larger</b> number. The question asks for the smaller one.' };
          if (v === o.S - o.d) return { code: 'u8l7-not-halved', hint: 'That’s ' + t('2S') + '. Divide by ' + t(2) + ' to get the smaller number.' };
          if (near(v, o.S / 2)) return { code: 'u8l7-facts-swap', hint: 'The two numbers are not equal — the larger is ' + o.d + ' more. Substitute ' + t('L=S+' + o.d) + ' into ' + t('L+S=' + o.S) + '.' };
          return null;
        }, t('L+S=' + o.S) + ', ' + t('L=S+' + o.d) + '.<br>' + t('(S+' + o.d + ')+S=' + o.S) + ' ⟹ ' + t('2S=' + (o.S - o.d)) + ' ⟹ ' + t('S=' + o.y) + '.<br>' + chk('Check: ' + t('L=' + o.x) + ' and ' + t(o.x + '+' + o.y + '=' + o.S)),
          ['Let ' + t('L') + ' and ' + t('S') + ' be the numbers: ' + t('L+S=' + o.S) + ' and ' + t('L=S+' + o.d) + '.'], 'NR smaller number');
      } }] },
    /* ---------- 13 ---------- */
    { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
      { id: '13', level: 'PRG', make: function (r) {
        var o = r.chance(0.05) ? { p1: 2, p2: 1, x: 31, y: 14 } : gen(function () { var p1 = r.pick([2, 3, 3, 4]), p2 = r.int(1, p1 - 1), x = r.int(8, 50), y = r.int(8, 50); if (x === y) return null; return { p1: p1, p2: p2, x: x, y: y }; }, { p1: 2, p2: 1, x: 31, y: 14 });
        var Nn = o.x + o.y, T = o.p1 * o.x + o.p2 * o.y, s = { X: 'c', Y: 'k', p1: o.p1, p2: o.p2, x: o.x, y: o.y, N: Nn, T: T };
        return nrP('At a bake sale, cupcakes sell for ' + Dh(o.p1) + ' and cookies sell for ' + Dh(o.p2) + '. A total of ' + t(Nn) + ' items were sold for ' + Dh(T) + '. The number of cupcakes sold is ____.', o.x, function (v) {
          if (v === o.y) return { code: 'answered-other', hint: 'That’s the number of <b>cookies</b>. The question asks for cupcakes.' };
          return null;
        }, 'Let ' + t('c') + ' be the number of cupcakes and ' + t('k') + ' the number of cookies.<br>' + cvSolveText(s) + '<br>The number of cupcakes is ' + t(o.x) + '.',
          ['Count equation: ' + t('c+k=' + Nn) + '. Value equation: ' + t(co(o.p1) + 'c+' + co(o.p2) + 'k=' + T) + '.'], 'NR cupcakes');
      } }] },
    /* ---------- 14 ---------- */
    { num: '14', section: 'Part F — Mixed Review', shared: function (r) { return r.chance(0.05) ? { X: 'a', Y: 's', n1: 'adult tickets', n2: 'student tickets', what: 'tickets', each: 'each', p1: 12, p2: 7, x: 100, y: 100, N: 200, T: 1900 } : q14(r); },
      stem: function (s) { return '<i>(Mixed Review)</i> A school ordered a total of ' + t(s.N) + ' tickets for the spring play: adult tickets at ' + Dh(s.p1) + ' and student tickets at ' + Dh(s.p2) + ', for total ticket revenue of ' + Dh(s.T) + '.'; },
      parts: [
        { id: '14a', sub: 'a', level: 'EMG', make: function (r, s) { return cvSys('Let ' + t('a') + ' be the number of adult tickets and ' + t('s') + ' the number of student tickets. Write a system of two equations representing this situation.', s); } },
        { id: '14b', sub: 'b', level: 'PRG', make: function (r, s) { return cvSolve('Solve the system to find the number of adult tickets and the number of student tickets ordered.', s, s.x + ' adult tickets and ' + s.y + ' student tickets were ordered.'); } }] }
  ];

  /* ======================= EXTRA PRACTICE ======================= */
  var EXTRA = [
    /* ---------- 1 ---------- */
    { num: '1', section: 'Extra Practice A — Translating Only: Define, Then Write Two Equations', stem: 'Write a system of two equations that models each situation. <b>Do not solve.</b>', parts: [
      { id: 'e1a', sub: 'a', level: 'BEG', make: function (r) {
        var o = r.chance(0.05) ? { k: 3, p: 24 } : { k: r.pick([2, 3, 4]), p: r.int(10, 40) }, T = (o.k + 1) * o.p;
        return sysP('A food truck at the Calgary Stampede sells poutine and mini-donuts. On Saturday it sold ' + TIMES[o.k] + ' as many orders of mini-donuts as orders of poutine, ' + t(T) + ' orders in all.<br>Let ' + t('p') + ' = the number of orders of poutine and ' + t('d') + ' = the number of orders of mini-donuts.', [[-o.k, 1, 0], [1, 1, -T]],
          { vars: ['p', 'd'], keyTex: ['d=' + o.k + 'p', 'p+d=' + T], names: ['the “' + TIMES[o.k] + ' as many” fact', 'the total'],
            factHints: ['test it: with ' + t('p=10') + ' poutine orders there are ' + t(10 * o.k) + ' mini-donut orders, so ' + t('d=' + o.k + 'p') + '.', 'all the orders add to ' + t(T) + '.'],
            wrong: [{ eq: 'p=' + o.k + 'd', code: 'ratio-flip', hint: 'Test your equation: with ' + t('p=10') + ' poutine orders there should be ' + t(10 * o.k) + ' mini-donut orders. The ' + t(o.k) + ' multiplies the <b>smaller</b> amount: ' + t('d=' + o.k + 'p') + '.' }, { eq: 'd=p+' + o.k, code: 'times-more', hint: '“' + cap(TIMES[o.k]) + ' as many” means multiply by ' + t(o.k) + '.' }] },
          t('d=' + o.k + 'p') + ' (test: ' + t('p=10') + ' gives ' + t('d=' + 10 * o.k) + ' ✓) and ' + t('p+d=' + T) + '.', ['Invent a small number of poutine orders and test your equation.'], 'translate: as many as');
      } },
      { id: 'e1b', sub: 'b', level: 'BEG', make: function (r) {
        var o = r.chance(0.05) ? { x: 25, y: 28 } : gen(function () { var x = r.int(10, 50), y = r.int(10, 50); return x === y ? null : { x: x, y: y }; }, { x: 25, y: 28 });
        var s = { X: 'L', Y: 'T', n1: 'loonies', n2: 'toonies', p1: 1, p2: 2, x: o.x, y: o.y, N: o.x + o.y, T: o.x + 2 * o.y, what: 'coins', each: 'each' };
        return cvSys('A cash box at a Lethbridge car wash holds only loonies ($1 coins) and toonies ($2 coins). There are ' + t(s.N) + ' coins, worth ' + Dh(s.T) + ' altogether.<br>Let ' + t('L') + ' = the number of loonies and ' + t('T') + ' = the number of toonies.', s);
      } },
      { id: 'e1c1', sub: 'c let', level: 'BEG', make: function (r) {
        var d = r.int(2, 10), w = r.int(6, 25), P = 2 * (2 * w + d);
        return mc(r, 'A rectangular plot in an Edmonton community garden is ' + t(d + '\\text{ m}') + ' longer than it is wide. Its perimeter is ' + t(P + '\\text{ m}') + '.<br>Which let statements define the unknowns completely?', [
          { html: 'Let ' + t('l') + ' = the length of the plot in metres and ' + t('w') + ' = the width of the plot in metres.', right: true },
          { html: 'Let ' + t('l') + ' = the perimeter in metres and ' + t('w') + ' = the width in metres.', why: 'The perimeter is given (' + P + ' m). The unknowns are the length and the width.' },
          { html: 'Let ' + t('l=' + d + '\\text{ m}') + ' and ' + t('w=' + P + '\\text{ m}') + '.', why: 'Those numbers are given facts, not unknowns. Each letter should name a quantity you don’t know yet.' },
          { html: 'Let ' + t('l') + ' = the area of the plot in square metres and ' + t('w') + ' = the width in metres.', why: 'The area isn’t mentioned. The two facts are about the <b>length</b> and the width.' }],
          'The two unknowns are the length and the width, each in metres: ' + t('l') + ' = length (m), ' + t('w') + ' = width (m). (This gives ' + t('l=w+' + d) + ' and ' + t('2l+2w=' + P) + '.)', ['Which two measurements don’t you know yet? Give their units.'], 'let statements with units');
      } },
      { id: 'e1c2', sub: 'c system', level: 'EMG', make: function (r) {
        var o = r.chance(0.05) ? { d: 4, w: 15 } : { d: r.int(2, 10), w: r.int(6, 25) }, l = o.w + o.d, P = 2 * (l + o.w);
        return sysP('A rectangular plot in an Edmonton community garden is ' + t(o.d + '\\text{ m}') + ' longer than it is wide. Its perimeter is ' + t(P + '\\text{ m}') + '.<br>Let ' + t('l') + ' = the length in metres and ' + t('w') + ' = the width in metres.', [[1, -1, -o.d], [2, 2, -P]],
          { vars: ['l', 'w'], keyTex: ['l=w+' + o.d, '2l+2w=' + P], names: ['the length–width fact', 'the perimeter'],
            factHints: ['the length is ' + o.d + ' m more than the width: ' + t('l=w+' + o.d) + '.', 'the perimeter adds all four sides: ' + t('2l+2w') + '.'],
            wrong: [{ eq: 'l+w=' + P, code: 'perim-half', hint: 'The perimeter adds <b>all four</b> sides: ' + t('2l+2w=' + P) + '.' }, { eq: 'w=l+' + o.d, code: 'more-than-flip', hint: 'The length is the longer side: ' + t('l=w+' + o.d) + '.' }, { eq: 'l=' + o.d + 'w', code: 'more-times', hint: '“' + o.d + ' m longer” <b>adds</b> ' + t(o.d) + '.' }],
            good: [['l-w=' + o.d, 'l+w=' + P / 2]] },
          t('l=w+' + o.d) + ' and ' + t('2l+2w=' + P) + ' (or ' + t('l+w=' + P / 2) + ').', ['A perimeter adds all four sides.'], 'translate rectangle');
      } },
      { id: 'e1d', sub: 'd', level: 'PRG', make: function (r) {
        var o = r.chance(0.05) ? { j: 70, k: 2, c: 30 } : gen(function () { var j = 5 * r.int(4, 18), k = r.pick([2, 2, 3]), c = 5 * r.int(2, 10); return k * j + c + j > 400 ? null : { j: j, k: k, c: c }; }, { j: 70, k: 2, c: 30 });
        var s = o.k * o.j + o.c, T = s + o.j;
        return sysP('Two service clubs collected ' + t(T + '\\text{ kg}') + ' of food for the Red Deer food bank. The senior club collected ' + t(o.c + '\\text{ kg}') + ' more than ' + TIMES[o.k] + ' what the junior club collected.<br>Let ' + t('s') + ' = kilograms from the senior club and ' + t('j') + ' = kilograms from the junior club.', [[1, 1, -T], [1, -o.k, -o.c]],
          { vars: ['s', 'j'], keyTex: ['s+j=' + T, 's=' + o.k + 'j+' + o.c], names: ['the total', 'the comparison'],
            factHints: ['the clubs together collected ' + t(T) + ' kg.', 'start from ' + TIMES[o.k] + ' the junior amount, ' + t(o.k + 'j') + ', and add ' + t(o.c) + '.'],
            wrong: [{ eq: 's+' + o.c + '=' + o.k + 'j', code: 'more-than-side', hint: '“' + o.c + ' kg more than ' + TIMES[o.k] + ' the junior club” is ' + t(o.k + 'j+' + o.c) + ', so ' + t('s=' + o.k + 'j+' + o.c) + '. The senior club has more.' },
              { eq: 'j=' + o.k + 's+' + o.c, code: 'ratio-flip', hint: 'The ' + t(o.k) + ' multiplies the <b>junior</b> club’s amount: ' + t('s=' + o.k + 'j+' + o.c) + '.' },
              { eq: 's=' + o.k + '(j+' + o.c + ')', code: 'more-than-side', hint: 'Double the junior amount <b>first</b>, then add ' + t(o.c) + ': ' + t(o.k + 'j+' + o.c) + ', not ' + t(o.k + '(j+' + o.c + ')') + '.' }] },
          t('s+j=' + T) + ' and ' + t('s=' + o.k + 'j+' + o.c) + '.', ['“' + o.c + ' more than ' + TIMES[o.k] + ' the junior amount” — build it in order: ' + t(o.k + 'j') + ', then ' + t('+' + o.c) + '.'], 'translate: more than twice');
      } }] },
    /* ---------- 2 ---------- */
    { num: '2', stem: 'These translations are harder — the two facts are buried deeper. Write the system. <b>Do not solve.</b>', parts: [
      { id: 'e2a', sub: 'a', level: 'PRG', make: function (r) {
        var o = r.chance(0.08) ? { td: 2, tu: 3, D: 24, b: 10, c: 2 } : riverGen(r), riv = r.pick(['Bow', 'Red Deer', 'Oldman', 'North Saskatchewan']);
        var ttd = o.td === 1 ? '1\\text{ h}' : o.td + '\\text{ h}';
        return sysP('A canoe travels ' + t(o.D + '\\text{ km}') + ' down the ' + riv + ' River in ' + t(ttd) + ', and the same ' + t(o.D + '\\text{ km}') + ' back upstream in ' + t(o.tu + '\\text{ h}') + '. Going downstream the current adds to the paddling speed; going upstream it subtracts.<br>Let ' + t('b') + ' = the canoe’s speed in still water (km/h) and ' + t('c') + ' = the speed of the current (km/h).', [[o.td, o.td, -o.D], [o.tu, -o.tu, -o.D]],
          { vars: ['b', 'c'], keyTex: [(o.td === 1 ? '' : o.td) + '(b+c)=' + o.D, o.tu + '(b-c)=' + o.D], names: ['the downstream trip', 'the upstream trip'],
            factHints: ['downstream: speed ' + t('b+c') + ' for ' + o.td + ' h covers ' + o.D + ' km, so ' + t(o.td + '(b+c)=' + o.D) + '.', 'upstream: speed ' + t('b-c') + ' for ' + o.tu + ' h covers ' + o.D + ' km.'],
            wrong: [{ eq: o.tu + '(b+c)=' + o.D, code: 'u8l7-current-sign', hint: 'Going <b>upstream</b> the current slows the canoe: its speed is ' + t('b-c') + '.' }, { eq: o.td + '(b-c)=' + o.D, code: 'u8l7-current-sign', hint: 'Going <b>downstream</b> the current helps: the speed is ' + t('b+c') + '.' },
              { eq: 'b+c=' + o.D * o.td, code: 'u8l7-drt', hint: 'Distance = speed × time, so ' + t('(b+c)\\times ' + o.td + '=' + o.D) + '. (Speed = distance ÷ time.)' }],
            alts: [['b+c=' + o.D / o.td], ['b-c=' + o.D / o.tu]], good: [['b+c=' + o.D / o.td, 'b-c=' + o.D / o.tu]], bad: [[o.tu + '(b+c)=' + o.D, o.td + '(b-c)=' + o.D]] },
          'Distance = speed × time.<br>Downstream: ' + t(o.td + '(b+c)=' + o.D) + ' (so ' + t('b+c=' + o.D / o.td) + ').<br>Upstream: ' + t(o.tu + '(b-c)=' + o.D) + ' (so ' + t('b-c=' + o.D / o.tu) + ').', ['Distance = speed × time, for each direction.'], 'translate: river current');
      } },
      { id: 'e2b', sub: 'b', level: 'PRG', make: function (r) {
        var o = r.chance(0.08) ? { p1: 12, p2: 20, M: 400, x: 150, y: 250, pm: 17 } : pctGen(r, [10, 12, 14, 15, 16], [18, 20, 22, 24, 25, 30], [200, 400, 500, 600, 800, 1000]);
        var P = o.pm * o.M / 100;
        return sysP('A feed supplier blends a ' + t(o.p1 + '\\%') + ' protein ration with a ' + t(o.p2 + '\\%') + ' protein ration to make ' + t(o.M + '\\text{ kg}') + ' of ' + art(o.pm) + ' ' + t(o.pm + '\\%') + ' protein ration.<br>Let ' + t('x') + ' = kg of the ' + t(o.p1 + '\\%') + ' ration and ' + t('y') + ' = kg of the ' + t(o.p2 + '\\%') + ' ration.', [[1, 1, -o.M], [o.p1, o.p2, -o.pm * o.M]],
          { vars: ['x', 'y'], keyTex: ['x+y=' + o.M, pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + N(P)], showTex: ['x+y=' + o.M, pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + pdec(o.pm) + '(' + o.M + ')=' + N(P)], names: ['the total mass', 'the protein'],
            factHints: ['the two rations add to ' + t(o.M) + ' kg.', 'the protein: ' + t(pdec(o.p1) + 'x') + ' kg from the first ration plus ' + t(pdec(o.p2) + 'y') + ' from the second equals ' + t(o.pm + '\\%') + ' of ' + t(o.M) + ' kg.'],
            wrong: [{ eq: pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + pdec(o.pm), code: 'u8l7-pct-total', hint: 'The right side should be the <b>kilograms of protein</b> in the mix: ' + t(o.pm + '\\%') + ' of ' + t(o.M) + ' kg is ' + t(pdec(o.pm) + '(' + o.M + ')=' + N(P)) + '.' },
              { eq: pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + o.pm, code: 'u8l7-pct-total', hint: 'The right side should be the kilograms of protein: ' + t(pdec(o.pm) + '(' + o.M + ')=' + N(P)) + ', not ' + t(o.pm) + '.' },
              { eq: o.p1 + 'x+' + o.p2 + 'y=' + N(P), code: 'pct-decimal', hint: 'Change each percent to a decimal: ' + t(o.p1 + '\\%=' + pdec(o.p1)) + '.' },
              { eq: pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + o.M, code: 'count-value', hint: 'The left side counts kilograms of <b>protein</b>, so the right side must too: ' + t(pdec(o.pm) + '(' + o.M + ')') + '.' }],
            good: [['x+y=' + o.M, o.p1 + 'x+' + o.p2 + 'y=' + o.pm * o.M]] },
          t('x+y=' + o.M) + ' (total mass)<br>' + t(pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + pdec(o.pm) + '(' + o.M + ')=' + N(P)) + ' (kg of protein)', ['One equation adds the kilograms of feed; the other adds the kilograms of <b>protein</b>.'], 'translate: percent mixture');
      } },
      { id: 'e2c', sub: 'c', level: 'ADV', make: function (r) {
        var o = r.chance(0.08) ? { t: 5, u: 7, s: 12, d: 18 } : digitGen(r);
        return sysP('The digits of a two-digit number add to ' + t(o.s) + '. Reversing the digits produces a number that is ' + t(o.d) + ' greater than the original. (A number with tens digit ' + t('t') + ' and units digit ' + t('u') + ' has value ' + t('10t+u') + '.)<br>Let ' + t('t') + ' = the tens digit and ' + t('u') + ' = the units digit of the original number.', [[1, 1, -o.s], [-9, 9, -o.d]],
          { vars: ['t', 'u'], keyTex: ['t+u=' + o.s, '10u+t=10t+u+' + o.d], names: ['the digit sum', 'the reversal'],
            factHints: ['the digits add to ' + t(o.s) + '.', 'the reversed number ' + t('10u+t') + ' is ' + t(o.d) + ' more than the original ' + t('10t+u') + '.'],
            wrong: [{ eq: '10t+u=10u+t+' + o.d, code: 'rev-direction', hint: 'The <b>reversed</b> number is the greater one: ' + t('10u+t=10t+u+' + o.d) + '.' }, { eq: 'u-t=' + o.d, code: 'digits-diff', hint: 'The numbers are ' + t('10t+u') + ' and ' + t('10u+t') + ' — write those, not the digits: ' + t('10u+t=10t+u+' + o.d) + '.' }, { eq: 'u+t=' + o.d, code: 'u8l7-facts-swap', hint: 'The reversal compares the two <b>numbers</b> ' + t('10t+u') + ' and ' + t('10u+t') + '.' }],
            good: [['t+u=' + o.s, 'u-t=' + o.d / 9]] },
          t('t+u=' + o.s) + '<br>' + t('10u+t=10t+u+' + o.d) + ' (which tidies to ' + t('u-t=' + o.d / 9) + ')<br>(Not asked: the number is ' + (10 * o.t + o.u) + '.)', ['Write the original number as ' + t('10t+u') + ' and the reversed one as ' + t('10u+t') + '.'], 'translate: digits');
      } },
      { id: 'e2d', sub: 'd', level: 'EMG', make: function (r) {
        var o = r.chance(0.08) ? { f1: 250, f2: 400, r1: 18, r2: 13, n: 30 } : hallGen(r);
        return sysP('A hall in Grande Prairie charges a ' + Dh(o.f1) + ' booking fee plus ' + Dh(o.r1) + ' per guest. A second hall charges a ' + Dh(o.f2) + ' fee plus ' + Dh(o.r2) + ' per guest. Write the two equations whose intersection gives the number of guests at which the two halls cost the same.<br>Let ' + t('n') + ' = the number of guests and ' + t('C') + ' = the total cost in dollars.', [[-o.r1, 1, -o.f1], [-o.r2, 1, -o.f2]],
          { vars: ['n', 'C'], keyTex: ['C=' + o.f1 + '+' + o.r1 + 'n', 'C=' + o.f2 + '+' + o.r2 + 'n'], names: ['the first hall', 'the second hall'],
            factHints: ['first hall: the fee ' + t(o.f1) + ' plus ' + t(o.r1) + ' for each of the ' + t('n') + ' guests.', 'second hall: ' + t(o.f2) + ' plus ' + t(o.r2 + 'n') + '.'],
            wrong: [{ eq: 'C=' + o.r1 + '+' + o.f1 + 'n', code: 'rate-fixed', hint: 'The ' + Dh(o.f1) + ' fee is paid once; the ' + Dh(o.r1) + ' is paid for <b>each</b> guest: ' + t('C=' + o.f1 + '+' + o.r1 + 'n') + '.' }, { eq: 'C=' + o.r2 + '+' + o.f2 + 'n', code: 'rate-fixed', hint: 'The ' + Dh(o.f2) + ' fee is paid once; the ' + Dh(o.r2) + ' is per guest: ' + t('C=' + o.f2 + '+' + o.r2 + 'n') + '.' }, { eq: 'C=' + o.f1 + '+' + o.r2 + 'n', code: 'value-swap', hint: 'Keep each hall’s fee with its own per-guest price.' }] },
          'Hall 1: ' + t('C=' + o.f1 + '+' + o.r1 + 'n') + '<br>Hall 2: ' + t('C=' + o.f2 + '+' + o.r2 + 'n') + '<br>(Not asked: they cost the same, ' + Dh(o.f1 + o.r1 * o.n) + ', at ' + o.n + ' guests.)', ['Cost = one-time fee + (price per guest) × (number of guests).'], 'translate: two halls');
      } }] },
    /* ---------- 3 ---------- */
    { num: '3', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: 'e3', level: 'EMG', make: function (r) {
        var o = r.chance(0.06) ? { pa: 9, py: 6, d: 25, a: 72 } : gen(function () { var pa = r.int(8, 14), py = r.int(4, pa - 2), d = 5 * r.int(2, 8), a = r.int(20, 90); return { pa: pa, py: py, d: d, a: a }; }, { pa: 9, py: 6, d: 25, a: 72 });
        var y = o.a + o.d, T = o.pa * o.a + o.py * y, sys = function (a, b) { return t(a + ',\\ \\ ' + b); };
        return mc(r, 'A skating rink sells adult passes for ' + Dh(o.pa) + ' and youth passes for ' + Dh(o.py) + '. It sold ' + t(o.d) + ' more youth passes than adult passes and took in ' + Dh(T) + '. If ' + t('a') + ' is the number of adult passes and ' + t('y') + ' is the number of youth passes, which system models this situation?', [
          { html: sys('y=a+' + o.d, o.pa + 'a+' + o.py + 'y=' + T), right: true },
          { html: sys('a+y=' + o.d, o.pa + 'a+' + o.py + 'y=' + T), why: t(o.d) + ' is how many <b>more</b> youth passes there are, not the total number of passes.' },
          { html: sys('a=y+' + o.d, o.pa + 'a+' + o.py + 'y=' + T), why: 'There are more <b>youth</b> passes, so ' + t(o.d) + ' is added to the adult count: ' + t('y=a+' + o.d) + '.' },
          { html: sys('y=a+' + o.d, o.py + 'a+' + o.pa + 'y=' + T), why: 'Each adult pass is ' + Dh(o.pa) + ', so ' + t(o.pa) + ' must multiply ' + t('a') + '.' }],
          'There are ' + o.d + ' <b>more youth</b> than adults, so ' + t('y=a+' + o.d) + '. Each adult pass is ' + Dh(o.pa) + ' and each youth pass ' + Dh(o.py) + ', so ' + t(o.pa + 'a+' + o.py + 'y=' + T) + '. (This gives ' + t('a=' + o.a) + ', ' + t('y=' + y) + '.)',
          ['Which group is bigger? Then match each price to its own letter.'], 'which system: more youth passes');
      } }] },
    /* ---------- 4 ---------- */
    { num: '4', section: 'Extra Practice B — Numbers, Ages, and Relationships', stem: 'Define the variables, write a system, solve it, and answer in a sentence.', parts: [
      { id: 'e4a1', sub: 'a system', level: 'BEG', make: function (r) {
        var o = e4a(r);
        return sysP('The sum of two numbers is ' + t(o.S) + ' and their difference is ' + t(o.D) + '. Let ' + t('x') + ' be the larger number and ' + t('y') + ' the smaller. Write the system.', [[1, 1, -o.S], [1, -1, -o.D]],
          { vars: ['x', 'y'], keyTex: ['x+y=' + o.S, 'x-y=' + o.D], names: ['the sum', 'the difference'], factHints: ['the sum adds: ' + t('x+y=' + o.S) + '.', 'the difference subtracts the smaller from the larger: ' + t('x-y=' + o.D) + '.'],
            wrong: [{ eq: 'y-x=' + o.D, code: 'diff-order', hint: t('x') + ' is the larger number, so the (positive) difference is ' + t('x-y=' + o.D) + '.' }, { eq: 'x+y=' + o.D, code: 'sum-diff', hint: 'A <b>difference</b> subtracts: ' + t('x-y=' + o.D) + '.' }] },
          t('x+y=' + o.S) + ' and ' + t('x-y=' + o.D) + '.', ['Sum → add. Difference → larger minus smaller.'], 'sum and difference system');
      } },
      { id: 'e4a2', sub: 'a solve', level: 'BEG', make: function (r) {
        var o = e4a(r);
        return numsP('The sum of two numbers is ' + t(o.S) + ' and their difference is ' + t(o.D) + '. Solve the system ' + t('x+y=' + o.S) + ', ' + t('x-y=' + o.D) + ' to find the two numbers.', [{ label: 'Larger number' }, { label: 'Smaller number' }], [o.x, o.y],
          { names: ['larger number', 'smaller number'], sys: [[1, 1, -o.S], [1, -1, -o.D]], sysNames: ['the sum', 'the difference'], wrong: [{ v: [o.S + o.D, (o.S - o.D)], code: 'u8l7-not-halved', hint: 'Adding the equations gives ' + t('2x=' + (o.S + o.D)) + ' — divide by ' + t(2) + '.' }] },
          'Add the equations (the ' + t('y') + '-terms cancel): ' + t('2x=' + (o.S + o.D)) + ' ⟹ ' + t('x=' + o.x) + '. Then ' + t('y=' + o.S + '-' + o.x + '=' + o.y) + '.<br>' + chk('Check: ' + t(o.x + '+' + o.y + '=' + o.S)) + ', ' + chk(t(o.x + '-' + o.y + '=' + o.D)) + '<br><b>The numbers are ' + o.x + ' and ' + o.y + '.</b>', ['Add the two equations: ' + t('y') + ' drops out.'], 'sum and difference solve');
      } },
      { id: 'e4b1', sub: 'b system', level: 'EMG', make: function (r) {
        var o = e4b(r);
        return sysP('One number is ' + t(o.c) + ' more than ' + TIMES[o.k] + ' the other. Their sum is ' + t(o.S) + '. Let ' + t('x') + ' be the larger number and ' + t('y') + ' the other. Write the system.', [[1, -o.k, -o.c], [1, 1, -o.S]],
          { vars: ['x', 'y'], keyTex: ['x=' + o.k + 'y+' + o.c, 'x+y=' + o.S], names: ['the comparison', 'the sum'], factHints: ['start from ' + TIMES[o.k] + ' the other number, ' + t(o.k + 'y') + ', and add ' + t(o.c) + '.', 'the numbers add to ' + t(o.S) + '.'],
            wrong: [{ eq: 'x+' + o.c + '=' + o.k + 'y', code: 'more-than-side', hint: '“' + o.c + ' more than ' + TIMES[o.k] + ' the other” is ' + t(o.k + 'y+' + o.c) + ', so ' + t('x=' + o.k + 'y+' + o.c) + '.' }, { eq: 'y=' + o.k + 'x+' + o.c, code: 'ratio-flip', hint: t('x') + ' is the larger number, so ' + t('x') + ' is the one built from ' + TIMES[o.k] + ' ' + t('y') + '.' }, { eq: 'x=' + o.k + '(y+' + o.c + ')', code: 'more-than-side', hint: 'Multiply first, then add: ' + t(o.k + 'y+' + o.c) + '.' }] },
          t('x=' + o.k + 'y+' + o.c) + ' and ' + t('x+y=' + o.S) + '.', ['Build the comparison in order: ' + TIMES[o.k] + ' the other (' + t(o.k + 'y') + '), then ' + t(o.c) + ' more.'], 'more than k times system');
      } },
      { id: 'e4b2', sub: 'b solve', level: 'EMG', make: function (r) {
        var o = e4b(r);
        return numsP('Solve the system ' + t('x=' + o.k + 'y+' + o.c) + ', ' + t('x+y=' + o.S) + ' to find the two numbers.', [{ label: 'Larger number' }, { label: 'Other number' }], [o.x, o.y],
          { names: ['larger number', 'other number'], sys: [[1, -o.k, -o.c], [1, 1, -o.S]], sysNames: ['the comparison', 'the sum'] },
          'Substitute: ' + t('(' + o.k + 'y+' + o.c + ')+y=' + o.S) + ' ⟹ ' + t((o.k + 1) + 'y=' + (o.S - o.c)) + ' ⟹ ' + t('y=' + o.y) + '. Then ' + t('x=' + o.k + '(' + o.y + ')+' + o.c + '=' + o.x) + '.<br>' + chk('Check: ' + t(o.x + '+' + o.y + '=' + o.S)) + '<br><b>The numbers are ' + o.x + ' and ' + o.y + '.</b>', ['Substitute the first equation into the second.'], 'more than k times solve');
      } }] },
    /* ---------- 5 ---------- */
    { num: '5', shared: function (r) { return r.chance(0.06) ? { k: 2, rm: 6, y: 17, x: 40, S: 57 } : gen(function () { var y = r.int(8, 30), k = r.pick([2, 2, 3]), rm = r.int(1, Math.min(12, y - 1)); return { k: k, rm: rm, y: y, x: k * y + rm, S: (k + 1) * y + rm }; }, { k: 2, rm: 6, y: 17, x: 40, S: 57 }); },
      stem: function (o) { return 'The sum of two numbers is ' + t(o.S) + '. When the larger number is divided by the smaller, the quotient is ' + t(o.k) + ' and the remainder is ' + t(o.rm) + ' — that is, the larger is ' + t(o.rm) + ' more than ' + TIMES[o.k] + ' the smaller. Let ' + t('L') + ' be the larger number and ' + t('S') + ' the smaller.'; },
      parts: [
        { id: 'e5sys', sub: 'system', level: 'EMG', make: function (r, o) {
          return sysP('Write the system.', [[1, 1, -o.S], [1, -o.k, -o.rm]],
            { vars: ['L', 'S'], keyTex: ['L+S=' + o.S, 'L=' + o.k + 'S+' + o.rm], names: ['the sum', 'the quotient-and-remainder fact'], factHints: ['the numbers add to ' + t(o.S) + '.', 'the larger is ' + TIMES[o.k] + ' the smaller plus the remainder: ' + t('L=' + o.k + 'S+' + o.rm) + '.'],
              wrong: [{ eq: 'L=' + o.k + 'S-' + o.rm, code: 'more-than-side', hint: 'The remainder is <b>left over</b>, so it is added: ' + t('L=' + o.k + 'S+' + o.rm) + '.' }, { eq: 'S=' + o.k + 'L+' + o.rm, code: 'ratio-flip', hint: 'The <b>larger</b> number is divided by the smaller, so ' + t('L=' + o.k + 'S+' + o.rm) + '.' }, { eq: 'L-S=' + o.S, code: 'sum-diff', hint: 'A <b>sum</b> adds.' }] },
            t('L+S=' + o.S) + ' and ' + t('L=' + o.k + 'S+' + o.rm) + '.', ['Dividing ' + t('L') + ' by ' + t('S') + ' gives ' + o.k + ' remainder ' + o.rm + ', so ' + t('L') + ' is ' + o.k + ' groups of ' + t('S') + ' plus ' + o.rm + '.'], 'quotient remainder system');
        } },
        { id: 'e5sol', sub: 'solve', level: 'EMG', make: function (r, o) {
          return numsP('Solve the system and find both numbers.', [{ label: 'Larger number' }, { label: 'Smaller number' }], [o.x, o.y],
            { names: ['larger number', 'smaller number'], sys: [[1, 1, -o.S], [1, -o.k, -o.rm]], sysNames: ['the sum', 'the quotient fact'] },
            'Substitute ' + t('L=' + o.k + 'S+' + o.rm) + ': ' + t('(' + o.k + 'S+' + o.rm + ')+S=' + o.S) + ' ⟹ ' + t((o.k + 1) + 'S=' + (o.S - o.rm)) + ' ⟹ ' + t('S=' + o.y) + ', ' + t('L=' + o.x) + '.<br>' + chk('In words: ' + t(o.x + '+' + o.y + '=' + o.S)) + ', and ' + t(o.x + '\\div ' + o.y) + ' is ' + o.k + ' remainder ' + o.rm + ' ✓ (' + t(o.k + '\\times ' + o.y + '=' + o.k * o.y) + ', ' + t(o.x + '-' + o.k * o.y + '=' + o.rm) + ')<br><b>The numbers are ' + o.x + ' and ' + o.y + '.</b>',
            ['Substitute the second equation into the first.'], 'quotient remainder solve');
        } }] },
    /* ---------- 6 ---------- */
    { num: '6', shared: function (r) { return r.chance(0.06) ? { yr: 3, k: 2, n0: 11, n: 14, m: 25, S: 39 } : gen(function () { var yr = r.int(2, 6), k = r.pick([2, 2, 3]), n0 = r.int(4, 15), m0 = k * n0, n = n0 + yr, m = m0 + yr; if (m > 60) return null; return { yr: yr, k: k, n0: n0, n: n, m: m, S: m + n }; }, { yr: 3, k: 2, n0: 11, n: 14, m: 25, S: 39 }); },
      stem: function (o) { return NW[o.yr].replace(/^./, function (c) { return c.toUpperCase(); }) + ' years ago, Maya was exactly ' + TIMES[o.k] + ' as old as her cousin Owen. Today the sum of their ages is ' + t(o.S) + '. Let ' + t('m') + ' be Maya’s age today and ' + t('n') + ' be Owen’s age today, so ' + NW[o.yr] + ' years ago they were ' + t('m-' + o.yr) + ' and ' + t('n-' + o.yr) + '.'; },
      parts: [
        { id: 'e6sys', sub: 'system', level: 'ADV', make: function (r, o) {
          var y = o.yr;
          return sysP('Write the system.', [[1, 1, -o.S], [1, -o.k, (o.k - 1) * y]],
            { vars: ['m', 'n'], keyTex: ['m+n=' + o.S, 'm-' + y + '=' + o.k + '(n-' + y + ')'], names: ['the sum today', 'the ages ' + NW[y] + ' years ago'], factHints: ['today the ages add to ' + t(o.S) + '.', NW[y] + ' years ago, Maya’s age ' + t('m-' + y) + ' was ' + TIMES[o.k] + ' Owen’s age ' + t('n-' + y) + '.'],
              wrong: [{ eq: 'm=' + o.k + 'n', code: 'u8l7-age-now', hint: 'The “' + TIMES[o.k] + ' as old” fact is about ' + NW[y] + ' years <b>ago</b>: use ' + t('m-' + y) + ' and ' + t('n-' + y) + '.' }, { eq: 'm-' + y + '=' + o.k + 'n-' + y, code: 'u8l7-age-bracket', hint: 'Owen’s age back then is ' + t('n-' + y) + ' — put it in brackets so the whole age is multiplied: ' + t(o.k + '(n-' + y + ')') + '.' },
                { eq: 'm-' + y + '=' + o.k + 'n', code: 'u8l7-age-bracket', hint: 'Take <b>both</b> ages back ' + NW[y] + ' years: ' + t('m-' + y + '=' + o.k + '(n-' + y + ')') + '.' }, { eq: 'n-' + y + '=' + o.k + '(m-' + y + ')', code: 'ratio-flip', hint: 'Maya was the older one, so her age was ' + TIMES[o.k] + ' Owen’s: ' + t('m-' + y + '=' + o.k + '(n-' + y + ')') + '.' }],
              good: [['m+n=' + o.S, 'm=' + o.k + 'n-' + (o.k - 1) * y]] },
            t('m+n=' + o.S) + '<br>' + t('m-' + y + '=' + o.k + '(n-' + y + ')') + ', which simplifies to ' + t('m=' + o.k + 'n-' + (o.k - 1) * y) + '.', ['Write both ages as they were ' + NW[y] + ' years ago before comparing them.'], 'age system years ago');
        } },
        { id: 'e6sol', sub: 'solve', level: 'ADV', make: function (r, o) {
          var y = o.yr, c = (o.k - 1) * y, wn = o.S / (o.k + 1);
          return numsP('Solve the system. How old is each cousin today?', [{ label: 'Maya', after: 'years' }, { label: 'Owen', after: 'years' }], [o.m, o.n],
            { names: ['Maya’s age', 'Owen’s age'], sys: [[1, 1, -o.S], [1, -o.k, c]], sysNames: ['the sum today', 'the “years ago” fact'], wrong: Number.isInteger(wn) ? [{ v: [o.S - wn, wn], code: 'u8l7-age-now', hint: 'Those ages make Maya ' + TIMES[o.k] + ' as old as Owen <b>today</b>. The fact is about ' + NW[y] + ' years ago: ' + t('m-' + y + '=' + o.k + '(n-' + y + ')') + '.' }] : [], swapHint: 'Maya is the older cousin.' },
            t('m-' + y + '=' + o.k + '(n-' + y + ')') + ' ⟹ ' + t('m=' + o.k + 'n-' + (o.k * y) + '+' + y) + ' ⟹ ' + t('m=' + o.k + 'n-' + c) + '.<br>Substitute into ' + t('m+n=' + o.S) + ': ' + t('(' + o.k + 'n-' + c + ')+n=' + o.S) + ' ⟹ ' + t((o.k + 1) + 'n=' + (o.S + c)) + ' ⟹ ' + t('n=' + o.n) + ', ' + t('m=' + o.m) + '.<br>' +
            chk('In words: ' + NW[y] + ' years ago they were ' + (o.m - y) + ' and ' + (o.n - y) + ', and ' + t(o.m - y + '=' + o.k + '\\times ' + (o.n - y))) + '; ' + chk(t(o.m + '+' + o.n + '=' + o.S)) + '<br><b>Maya is ' + o.m + ' and Owen is ' + o.n + '.</b>',
            ['Expand the bracket first: ' + t('m-' + y + '=' + o.k + 'n-' + o.k * y) + ', so ' + t('m=' + o.k + 'n-' + c) + '. Then substitute.'], 'age solve years ago');
        } }] },
    /* ---------- 7 ---------- */
    { num: '7', section: 'Extra Practice C — Two Prices: Tickets, Food, and Coins', shared: function (r) { return r.chance(0.06) ? { X: 'a', Y: 's', n1: 'adult tickets', n2: 'student tickets', what: 'tickets', each: 'each', p1: 14, p2: 8, x: 141, y: 271, N: 412, T: 4142 } : cv(r, { X: 'a', Y: 's', n1: 'adult tickets', n2: 'student tickets', what: 'tickets', each: 'each' }, function () { var p1 = r.int(10, 16), p2 = r.int(5, p1 - 3); return { p1: p1, p2: p2, x: r.int(100, 300), y: r.int(100, 300) }; }); },
      stem: function (s) { return 'The Vermilion high school drama club sold ' + t(s.N) + ' tickets to its spring production. Adult tickets cost ' + Dh(s.p1) + ' and student tickets cost ' + Dh(s.p2) + ', and ticket sales totalled ' + Dh(s.T) + '.'; },
      parts: [
        { id: 'e7sys', sub: 'system', level: 'EMG', make: function (r, s) { return cvSys('Let ' + t('a') + ' be the number of adult tickets and ' + t('s') + ' the number of student tickets. Write the system.', s); } },
        { id: 'e7sol', sub: 'solve', level: 'PRG', make: function (r, s) { return cvSolve('How many tickets of each kind were sold?', s, 'They sold ' + s.x + ' adult tickets and ' + s.y + ' student tickets.'); } }] },
    /* ---------- 8 ---------- */
    { num: '8', shared: function (r) { return r.chance(0.06) ? { X: 's', Y: 'l', n1: 'small coffees', n2: 'large coffees', what: 'coffees', each: 'each', dec: true, p1: 2.75, p2: 4.25, x: 88, y: 92, N: 180, T: 633 } : cv(r, { X: 's', Y: 'l', n1: 'small coffees', n2: 'large coffees', what: 'coffees', each: 'each', dec: true }, function () { var p1 = r.pick([2, 2.25, 2.5, 2.75, 3]), p2 = p1 + r.pick([1, 1.25, 1.5, 1.75, 2]); return { p1: p1, p2: p2, x: r.int(40, 120), y: r.int(40, 120) }; }); },
      stem: function (s) { return 'A coffee stand in Canmore sells a small coffee for ' + t('\\$' + m2(s.p1)) + ' and a large coffee for ' + t('\\$' + m2(s.p2)) + '. On Friday it sold ' + t(s.N) + ' coffees for a total of ' + t('\\$' + m2(s.T)) + '.'; },
      parts: [
        { id: 'e8sys', sub: 'system', level: 'EMG', make: function (r, s) { return cvSys('Let ' + t('s') + ' be the number of small coffees and ' + t('l') + ' the number of large coffees. Write the system.', s); } },
        { id: 'e8sol', sub: 'solve', level: 'ADV', make: function (r, s) { var p = cvSolve('How many of each size were sold? (Clear the decimals before you eliminate.)', s, 'They sold ' + s.x + ' small and ' + s.y + ' large coffees.'); p.hints = ['Multiply the value equation by ' + t(100) + ' (or by ' + t(4) + ') to clear the decimals, then eliminate.', 'Or substitute ' + t('s=' + s.N + '-l') + ' into the value equation.']; return p; } }] },
    /* ---------- 9 ---------- */
    { num: '9', shared: function (r) { return r.chance(0.06) ? { X: 'q', Y: 'n', n1: 'quarters', n2: 'loonies', what: 'coins', each: 'each', dec: true, p1: 0.25, p2: 1, x: 79, y: 77, N: 156, T: 96.75 } : cv(r, { X: 'q', Y: 'n', n1: 'quarters', n2: 'loonies', what: 'coins', each: 'each', dec: true }, function () { return { p1: 0.25, p2: 1, x: r.int(30, 120), y: r.int(30, 120) }; }); },
      stem: function (s) { return 'A change machine at a Fort McMurray rec centre is emptied and found to contain only quarters and loonies: ' + t(s.N) + ' coins with a total value of ' + t('\\$' + m2(s.T)) + '. One equation counts <i>how many</i> coins there are and the other totals their <i>value</i>.'; },
      parts: [
        { id: 'e9sys', sub: 'system', level: 'EMG', make: function (r, s) { return cvSys('Let ' + t('q') + ' be the number of quarters and ' + t('n') + ' the number of loonies. Write the system.', s); } },
        { id: 'e9sol', sub: 'solve', level: 'PRG', make: function (r, s) {
          var p = cvSolve('How many coins of each kind are there?', s, 'There are ' + s.x + ' quarters and ' + s.y + ' loonies.');
          p.solution = t('q+n=' + s.N) + ' and ' + t('0.25q+n=' + m2(s.T)) + '.<br>Multiply the value equation by ' + t(4) + ': ' + t('q+4n=' + N(4 * s.T)) + '.<br>Subtract the count equation: ' + t('3n=' + N(4 * s.T - s.N)) + ' ⟹ ' + t('n=' + s.y) + ', so ' + t('q=' + s.N + '-' + s.y + '=' + s.x) + '.<br>' + chk('Check: ' + t('0.25(' + s.x + ')+' + s.y + '=' + m2(0.25 * s.x) + '+' + s.y + '=' + m2(s.T))) + '<br><b>There are ' + s.x + ' quarters and ' + s.y + ' loonies.</b>';
          p.hints = ['Multiply the value equation by ' + t(4) + ' to clear the decimal, then subtract the count equation.'];
          return p;
        } }] },
    /* ---------- 10 ---------- */
    { num: '10', shared: function (r) { return r.chance(0.06) ? { pb: 6, ph: 4, N: 95, T: 497 } : gen(function () { var ph = r.pick([3, 4, 5]), pb = ph + 2, Nn = r.int(50, 120), b2 = 2 * r.int(Math.ceil(Nn * 0.25), Math.floor(Nn * 0.75)) + 1, T = ph * Nn + b2; return { pb: pb, ph: ph, N: Nn, T: T }; }, { pb: 6, ph: 4, N: 95, T: 497 }); },
      stem: function (o) { return '<b>Does the answer make sense?</b> A charity barbecue in Airdrie sells burgers at ' + Dh(o.pb) + ' and hot dogs at ' + Dh(o.ph) + '. The organizers report that ' + t(o.N) + ' items were sold and ' + Dh(o.T) + ' was collected. Let ' + t('b') + ' be the number of burgers and ' + t('h') + ' the number of hot dogs.'; },
      parts: [
        { id: 'e10a', sub: 'a', level: 'PRG', make: function (r, o) {
          var b = (o.T - o.ph * o.N) / 2, h = o.N - b;
          var p = numsP('Write and solve the system. Give the exact values of ' + t('b') + ' and ' + t('h') + ' (don’t round).', [{ label: t('b') }, { label: t('h') }], [b, h],
            { names: ['value of b', 'value of h'], sys: [[1, 1, -o.N], [o.pb, o.ph, -o.T]], sysNames: ['the count', 'the money'] },
            t('b+h=' + o.N) + ', ' + t(o.pb + 'b+' + o.ph + 'h=' + o.T) + '.<br>Multiply the count by ' + t(o.ph) + ' and subtract: ' + t('2b=' + (o.T - o.ph * o.N)) + ' ⟹ ' + t('b=' + N(b)) + ', ' + t('h=' + N(h)) + '.<br>' + chk('Check: ' + t(N(b) + '+' + N(h) + '=' + o.N)) + ', ' + chk(t(o.pb + '(' + N(b) + ')+' + o.ph + '(' + N(h) + ')=' + o.T)),
            ['Count: ' + t('b+h=' + o.N) + '. Money: ' + t(o.pb + 'b+' + o.ph + 'h=' + o.T) + '. Keep the exact answer — decimals and all.'], 'barbecue solve');
          p.check = (function (c) { return function (resp) { var res = c(resp); if (res.v !== 'correct') { var v = (resp || []).map(function (s) { var q = HW.parse.number(String(s || '')); return q.ok ? q.value : NaN; }); if (Number.isInteger(v[0]) && Number.isInteger(v[1]) && Math.abs(v[0] - b) < 1 && Math.abs(v[1] - h) < 1) return form('rounded-count', 'Don’t round yet — give the exact solution of the system. Deciding whether it makes sense is the next step.'); } return res; }; })(p.check);
          p.bad.push([String(Math.round(b)), String(Math.round(h))]);
          return p;
        } },
        { id: 'e10b', sub: 'b', level: 'PRG', make: function (r, o) {
          var b = (o.T - o.ph * o.N) / 2, h = o.N - b, rb = Math.floor(b), rh = o.N - rb;
          return mc(r, 'The solution is ' + t('b=' + N(b)) + ', ' + t('h=' + N(h)) + '. It is mathematically correct, but it cannot be the answer to this problem. Why, and what does that tell you about the organizers’ report?', [
            { html: 'You can’t sell half a burger: no whole numbers fit both facts, so the report must contain an error (a miscount, or money from something else).', right: true },
            { html: 'Both equations check, so the report is correct — round to ' + rb + ' burgers and ' + rh + ' hot dogs.', why: 'Test the rounded counts: ' + t(o.pb + '(' + rb + ')+' + o.ph + '(' + rh + ')=' + (o.pb * rb + o.ph * rh)) + ', not ' + t(o.T) + '. No whole-number counts give the reported total.' },
            { html: 'The organizers sold more burgers than hot dogs, which is impossible.', why: 'Nothing says which item sold more. The problem is that the counts aren’t whole numbers.' },
            { html: 'The system was solved wrongly: the answer to a word problem is always whole numbers.', why: 'The algebra is right — both equations check. It’s the <b>report</b> whose numbers can’t all be true.' }],
            'The equations check, but counts of burgers and hot dogs must be whole numbers. ' + t(N(b)) + ' burgers is impossible, so <b>the report must contain an error</b> — the count or the money (or some money came from something else).', ['Check the answer against the <b>words</b>, not just the equations.'], 'barbecue conclusion');
        } }] },
    /* ---------- 11 ---------- */
    { num: '11', section: 'Extra Practice D — Mixture and Percent Problems', shared: function (r) { return r.chance(0.06) ? { p1: 20, p2: 50, M: 500, x: 300, y: 200, pm: 32 } : pctGen(r, [10, 15, 20, 25], [40, 50, 60], [200, 300, 400, 500, 600, 1000]); },
      stem: function (o) { return 'A lab technician needs ' + t(o.M + '\\text{ mL}') + ' of ' + art(o.pm) + ' ' + t(o.pm + '\\%') + ' antifreeze mixture. She has a ' + t(o.p1 + '\\%') + ' stock solution and a ' + t(o.p2 + '\\%') + ' stock solution on hand. Let ' + t('x') + ' = mL of the ' + t(o.p1 + '\\%') + ' solution and ' + t('y') + ' = mL of the ' + t(o.p2 + '\\%') + ' solution.'; },
      parts: [
        { id: 'e11sys', sub: 'system', level: 'PRG', make: function (r, o) {
          var P = o.pm * o.M / 100;
          return sysP('Write the system: one equation for the total volume, one for the <b>pure antifreeze</b>.', [[1, 1, -o.M], [o.p1, o.p2, -o.pm * o.M]],
            { vars: ['x', 'y'], keyTex: ['x+y=' + o.M, pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + N(P)], showTex: ['x+y=' + o.M, pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + pdec(o.pm) + '(' + o.M + ')=' + N(P)], names: ['the total volume', 'the pure antifreeze'],
              factHints: ['the two solutions add to ' + t(o.M) + ' mL.', 'pure antifreeze: ' + t(pdec(o.p1) + 'x+' + pdec(o.p2) + 'y') + ' equals ' + t(o.pm + '\\%') + ' of ' + t(o.M) + ' mL.'],
              wrong: [{ eq: pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + pdec(o.pm), code: 'u8l7-pct-total', hint: 'The right side is the mL of pure antifreeze in the mixture: ' + t(pdec(o.pm) + '(' + o.M + ')=' + N(P)) + '.' }, { eq: o.p1 + 'x+' + o.p2 + 'y=' + N(P), code: 'pct-decimal', hint: 'Change each percent to a decimal: ' + t(o.p1 + '\\%=' + pdec(o.p1)) + '.' }, { eq: pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + o.M, code: 'count-value', hint: 'The left side is pure antifreeze, so the right side must be too: ' + t(pdec(o.pm) + '(' + o.M + ')') + '.' }],
              good: [['x+y=' + o.M, o.p1 + 'x+' + o.p2 + 'y=' + o.pm * o.M]] },
            t('x+y=' + o.M) + '<br>' + t(pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + pdec(o.pm) + '(' + o.M + ')=' + N(P)), ['The second equation totals the <b>pure antifreeze</b>, so its right side is ' + t(pdec(o.pm) + '(' + o.M + ')') + '.'], 'antifreeze system');
        } },
        { id: 'e11sol', sub: 'solve', level: 'ADV', make: function (r, o) {
          var P = o.pm * o.M / 100;
          return numsP('How many millilitres of each solution should she use?', [{ label: o.p1 + '% solution', after: 'mL' }, { label: o.p2 + '% solution', after: 'mL' }], [o.x, o.y],
            { names: ['amount of the ' + o.p1 + '% solution', 'amount of the ' + o.p2 + '% solution'], sys: [[1, 1, -o.M], [o.p1, o.p2, -o.pm * o.M]], sysNames: ['the total volume', 'the antifreeze equation'] },
            mixSol(o, 'mL', 'pure antifreeze') + '<br><b>Use ' + o.x + ' mL of the ' + o.p1 + '% solution and ' + o.y + ' mL of the ' + o.p2 + '% solution.</b>',
            ['Multiply the antifreeze equation by ' + t(100) + ': ' + t(o.p1 + 'x+' + o.p2 + 'y=' + N(100 * P)) + '. Then substitute ' + t('x=' + o.M + '-y') + '.'], 'antifreeze solve');
        } }] },
    /* ---------- 12 ---------- */
    { num: '12', shared: function (r) { return r.chance(0.06) ? { p1: 14, p2: 26, M: 900, x: 600, y: 300, pm: 18 } : pctGen(r, [10, 12, 14, 15], [20, 22, 24, 26, 30], [300, 400, 500, 600, 900, 1000]); },
      stem: function (o) { return 'A feedlot near Brooks mixes a ' + t(o.p1 + '\\%') + ' protein barley ration with a ' + t(o.p2 + '\\%') + ' protein canola ration to produce ' + t(o.M + '\\text{ kg}') + ' of ' + art(o.pm) + ' ' + t(o.pm + '\\%') + ' protein ration.'; },
      parts: [
        { id: 'e12', sub: '', level: 'ADV', make: function (r, o) {
          var P = o.pm * o.M / 100;
          return numsP('How many kilograms of each ration are used? (Let ' + t('x') + ' = kg of barley ration and ' + t('y') + ' = kg of canola ration.)', [{ label: 'Barley (' + o.p1 + '%)', after: 'kg' }, { label: 'Canola (' + o.p2 + '%)', after: 'kg' }], [o.x, o.y],
            { names: ['kg of barley ration', 'kg of canola ration'], sys: [[1, 1, -o.M], [o.p1, o.p2, -o.pm * o.M]], sysNames: ['the total mass', 'the protein equation'] },
            t('x+y=' + o.M) + ' and ' + t(pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + pdec(o.pm) + '(' + o.M + ')=' + N(P)) + '.<br>' + mixSol(o, 'kg', 'protein') + '<br><b>Use ' + o.x + ' kg of the barley ration and ' + o.y + ' kg of the canola ration.</b>',
            ['Mass: ' + t('x+y=' + o.M) + '. Protein: ' + t(pdec(o.p1) + 'x+' + pdec(o.p2) + 'y=' + N(P)) + ' kg.', 'Multiply the protein equation by ' + t(100) + ', then substitute ' + t('x=' + o.M + '-y') + '.'], 'feedlot solve');
        } }] },
    /* ---------- 13 ---------- */
    { num: '13', section: 'Extra Practice E — Distance, Rate, and Time', shared: function (r) { return r.chance(0.06) ? { r1: 100, r2: 60, x: 6, y: 2.5 } : gen(function () { var r1 = r.pick([80, 90, 100, 110]), r2 = r.pick([40, 50, 60, 70]), x = r.int(2, 7), y = r.int(1, 8) / 2; if (r1 - r2 < 30 || x === y) return null; return { r1: r1, r2: r2, x: x, y: y }; }, { r1: 100, r2: 60, x: 6, y: 2.5 }); },
      stem: function (o) { return 'Priya drove a ' + t(N(o.r1 * o.x + o.r2 * o.y) + '\\text{ km}') + ' trip from Calgary to Fort McMurray. Part of the trip she drove at ' + t(o.r1 + '\\text{ km/h}') + ', and part of it, through a construction zone, at ' + t(o.r2 + '\\text{ km/h}') + '. The drive took ' + t(N(o.x + o.y) + '\\text{ h}') + ' of driving time. Let ' + t('x') + ' = hours at ' + t(o.r1 + '\\text{ km/h}') + ' and ' + t('y') + ' = hours at ' + t(o.r2 + '\\text{ km/h}') + '.'; },
      parts: [
        { id: 'e13sys', sub: 'system', level: 'PRG', make: function (r, o) {
          var Dd = o.r1 * o.x + o.r2 * o.y, H = o.x + o.y;
          return sysP('Write the system: one equation totals the time, the other totals the distance (' + t('d=rt') + ').', [[1, 1, -H], [o.r1, o.r2, -Dd]],
            { vars: ['x', 'y'], keyTex: ['x+y=' + N(H), o.r1 + 'x+' + o.r2 + 'y=' + Dd], names: ['the total time', 'the total distance'], factHints: ['the hours add to ' + t(N(H)) + '.', 'distance = rate × time for each part: ' + t(o.r1 + 'x+' + o.r2 + 'y') + '.'],
              wrong: [{ eq: 'x+y=' + Dd, code: 'count-value', hint: t('x+y') + ' adds <b>hours</b>, so it equals ' + t(N(H)) + ' h.' }, { eq: o.r2 + 'x+' + o.r1 + 'y=' + Dd, code: 'value-swap', hint: t('x') + ' is the time at ' + t(o.r1) + ' km/h, so that part covers ' + t(o.r1 + 'x') + ' km.' }, { eq: o.r1 + 'x+' + o.r2 + 'y=' + N(H), code: 'count-value', hint: 'Rate × time gives <b>kilometres</b>, so this equation equals the distance, ' + t(Dd) + ' km.' }] },
            t('x+y=' + N(H)) + ' (hours)<br>' + t(o.r1 + 'x+' + o.r2 + 'y=' + Dd) + ' (kilometres)', ['Each variable is a number of <b>hours</b>; multiply by the speed to get kilometres.'], 'drive system');
        } },
        { id: 'e13sol', sub: 'solve', level: 'ADV', make: function (r, o) {
          var Dd = o.r1 * o.x + o.r2 * o.y, H = o.x + o.y;
          return numsP('How many hours did she spend at each speed?', [{ label: 'At ' + o.r1 + ' km/h', after: 'h' }, { label: 'At ' + o.r2 + ' km/h', after: 'h' }], [o.x, o.y],
            { names: ['time at ' + o.r1 + ' km/h', 'time at ' + o.r2 + ' km/h'], sys: [[1, 1, -H], [o.r1, o.r2, -Dd]], sysNames: ['the time equation', 'the distance equation'] },
            'Substitute ' + t('y=' + N(H) + '-x') + ' into ' + t(o.r1 + 'x+' + o.r2 + 'y=' + Dd) + ': ' + t(o.r1 + 'x+' + N(o.r2 * H) + '-' + o.r2 + 'x=' + Dd) + ' ⟹ ' + t((o.r1 - o.r2) + 'x=' + N(Dd - o.r2 * H)) + ' ⟹ ' + t('x=' + o.x) + ', ' + t('y=' + N(o.y)) + '.<br>' + chk('Check: ' + t(o.r1 * o.x + '+' + N(o.r2 * o.y) + '=' + Dd)) + ' km, ' + chk(t(o.x + '+' + N(o.y) + '=' + N(H))) + ' h<br><b>She drove ' + o.x + ' h at ' + o.r1 + ' km/h and ' + N(o.y) + ' h at ' + o.r2 + ' km/h.</b>',
            ['Solve the time equation for ' + t('y') + ' and substitute into the distance equation.'], 'drive solve');
        } }] },
    /* ---------- 14 ---------- */
    { num: '14', shared: function (r) { return r.chance(0.08) ? { td: 2, tu: 3, D: 60, b: 25, c: 5 } : gen(function () { var o = riverGen(r), m = r.pick([1, 2, 2, 3]); if (o.D * m > 120) return null; return { td: o.td, tu: o.tu, D: o.D * m, b: o.b * m, c: o.c * m }; }, { td: 2, tu: 3, D: 60, b: 25, c: 5 }); },
      stem: function (o) { return 'A jet boat travels ' + t(o.D + '\\text{ km}') + ' down the Athabasca River in ' + t(o.td + '\\text{ h}') + '. The return trip of ' + t(o.D + '\\text{ km}') + ' against the current takes ' + t(o.tu + '\\text{ h}') + '. Let ' + t('b') + ' be the boat’s speed in still water and ' + t('c') + ' be the speed of the current, both in km/h.'; },
      parts: [
        { id: 'e14a', sub: 'a', level: 'EMG', make: function (r, o) {
          return mc(r, 'Why is the downstream speed ' + t('b+c') + ' and the upstream speed ' + t('b-c') + '?', [
            { html: 'Going downstream the current pushes the boat along, so the speeds add; going upstream the current pushes back, so its speed is subtracted.', right: true },
            { html: 'Going downstream the boat goes downhill, so it doubles its speed; going upstream it halves it.', why: 'The current <b>adds</b> its own speed ' + t('c') + ' — it doesn’t double or halve the boat’s speed.' },
            { html: 'Because the downstream trip takes less time, so its speed is a sum.', why: 'The shorter time is a <b>result</b> of the faster speed. The speed is ' + t('b+c') + ' because the current moves the boat along with it.' },
            { html: 'Going upstream the boat must cover ' + t('c') + ' extra kilometres, so the distance is ' + t(o.D) + ' − ' + t('c') + '.', why: 'The distance is the same both ways (' + o.D + ' km). It is the <b>speed</b> that changes by ' + t('c') + '.' }],
            'Downstream, the water carries the boat: its speed over the ground is ' + t('b+c') + '. Upstream, the current works against it: ' + t('b-c') + '.', ['Picture a walkway at an airport: walking with it or against it.'], 'why b + c and b − c');
        } },
        { id: 'e14b', sub: 'b system', level: 'PRG', make: function (r, o) {
          return sysP('Write the system (distance = speed × time for each trip).', [[o.td, o.td, -o.D], [o.tu, -o.tu, -o.D]],
            { vars: ['b', 'c'], keyTex: [o.td + '(b+c)=' + o.D, o.tu + '(b-c)=' + o.D], names: ['the downstream trip', 'the upstream trip'],
              factHints: ['downstream: ' + t(o.td + '(b+c)=' + o.D) + '.', 'upstream: ' + t(o.tu + '(b-c)=' + o.D) + '.'],
              wrong: [{ eq: o.tu + '(b+c)=' + o.D, code: 'u8l7-current-sign', hint: 'Upstream the speed is ' + t('b-c') + '.' }, { eq: o.td + '(b-c)=' + o.D, code: 'u8l7-current-sign', hint: 'Downstream the speed is ' + t('b+c') + '.' }, { eq: 'b+c=' + o.D * o.td, code: 'u8l7-drt', hint: 'Distance = speed × time, so ' + t('(b+c)\\times ' + o.td + '=' + o.D) + '.' }],
              alts: [['b+c=' + o.D / o.td], ['b-c=' + o.D / o.tu]], good: [['b+c=' + o.D / o.td, 'b-c=' + o.D / o.tu]], bad: [[o.tu + '(b+c)=' + o.D, o.td + '(b-c)=' + o.D]] },
            t(o.td + '(b+c)=' + o.D) + ', so ' + t('b+c=' + o.D / o.td) + '<br>' + t(o.tu + '(b-c)=' + o.D) + ', so ' + t('b-c=' + o.D / o.tu), ['Distance = speed × time, for each direction.'], 'jet boat system');
        } },
        { id: 'e14c', sub: 'b solve', level: 'PRG', make: function (r, o) {
          var s1 = o.D / o.td, s2 = o.D / o.tu;
          return numsP('Solve the system to find ' + t('b') + ' and ' + t('c') + '.', [{ label: 'Still water ' + t('b'), after: 'km/h' }, { label: 'Current ' + t('c'), after: 'km/h' }], [o.b, o.c],
            { names: ['boat’s speed', 'current’s speed'], sys: [[1, 1, -s1], [1, -1, -s2]], sysNames: ['the downstream equation', 'the upstream equation'], wrong: [{ v: [s1, s2], code: 'u8l7-drt', hint: 'Those are the downstream and upstream speeds ' + t('b+c') + ' and ' + t('b-c') + '. Add the two equations to find ' + t('b') + '.' }] },
            'Divide by the times: ' + t('b+c=' + s1) + ' and ' + t('b-c=' + s2) + '. Add: ' + t('2b=' + (s1 + s2)) + ' ⟹ ' + t('b=' + o.b) + ', so ' + t('c=' + s1 + '-' + o.b + '=' + o.c) + '.<br>' + chk('Check: downstream ' + t(s1 + '\\times ' + o.td + '=' + o.D)) + ' km, ' + chk('upstream ' + t(s2 + '\\times ' + o.tu + '=' + o.D)) + ' km<br><b>Still-water speed ' + o.b + ' km/h, current ' + o.c + ' km/h.</b>',
            ['Divide each equation by its time first, then add them.'], 'jet boat solve');
        } }] },
    /* ---------- 15 ---------- */
    { num: '15', section: 'Extra Practice F — Geometry, Break-Even, and Rates of Work', shared: function (r) { return r.chance(0.06) ? { w: 30, c: 3, less: true, l: 57, P: 174 } : gen(function () { var w = 5 * r.int(2, 8), c = r.int(1, 9), less = r.chance(0.7), l = less ? 2 * w - c : 2 * w + c; return { w: w, c: c, less: less, l: l, P: 2 * (l + w) }; }, { w: 30, c: 3, less: true, l: 57, P: 174 }); },
      stem: function (o) { return 'A rectangular skating rink in Okotoks has a perimeter of ' + t(o.P + '\\text{ m}') + '. Its length is ' + t(o.c + '\\text{ m}') + ' ' + (o.less ? 'less' : 'more') + ' than twice its width. Let ' + t('l') + ' be the length and ' + t('w') + ' the width, in metres.'; },
      parts: [
        { id: 'e15sys', sub: 'system', level: 'EMG', make: function (r, o) {
          var sg = o.less ? '-' : '+';
          return sysP('Write the system.', [[2, 2, -o.P], [1, -2, o.less ? o.c : -o.c]],
            { vars: ['l', 'w'], keyTex: ['2l+2w=' + o.P, 'l=2w' + sg + o.c], names: ['the perimeter', 'the length–width fact'], factHints: ['the perimeter adds all four sides.', 'start from twice the width, ' + t('2w') + ', then ' + (o.less ? 'subtract' : 'add') + ' ' + t(o.c) + '.'],
              wrong: [{ eq: 'l+w=' + o.P, code: 'perim-half', hint: 'The perimeter adds <b>all four</b> sides: ' + t('2l+2w=' + o.P) + '.' }, { eq: 'l=2w' + (o.less ? '+' : '-') + o.c, code: 'more-than-side', hint: '“' + o.c + ' m ' + (o.less ? 'less' : 'more') + ' than twice the width” is ' + t('2w' + sg + o.c) + '.' }, { eq: 'w=2l' + sg + o.c, code: 'ratio-flip', hint: 'The <b>length</b> is built from twice the width: ' + t('l=2w' + sg + o.c) + '.' }],
              good: [['l+w=' + o.P / 2, 'l=2w' + sg + o.c]] },
            t('2l+2w=' + o.P) + ' (or ' + t('l+w=' + o.P / 2) + ') and ' + t('l=2w' + sg + o.c) + '.', ['“' + o.c + ' ' + (o.less ? 'less' : 'more') + ' than twice the width”: twice the width first, then ' + (o.less ? 'subtract' : 'add') + '.'], 'rink system');
        } },
        { id: 'e15dim', sub: 'dimensions', level: 'PRG', make: function (r, o) {
          var sg = o.less ? '-' : '+';
          return numsP('Find the length and the width.', [{ label: 'Length', after: 'm' }, { label: 'Width', after: 'm' }], [o.l, o.w],
            { names: ['length', 'width'], sys: [[1, 1, -o.P / 2], [1, -2, o.less ? o.c : -o.c]], sysNames: ['the perimeter', 'the length–width fact'], swapHint: 'The length is the longer side — about twice the width.' },
            t('l+w=' + o.P / 2) + '. Substitute ' + t('l=2w' + sg + o.c) + ': ' + t('3w' + sg + o.c + '=' + o.P / 2) + ' ⟹ ' + t('3w=' + 3 * o.w) + ' ⟹ ' + t('w=' + o.w) + ', ' + t('l=2(' + o.w + ')' + sg + o.c + '=' + o.l) + '.<br>' + chk('Check: ' + t('2(' + o.l + '+' + o.w + ')=' + o.P)) + '<br><b>The rink is ' + o.l + ' m by ' + o.w + ' m.</b>',
            ['Halve the perimeter equation: ' + t('l+w=' + o.P / 2) + '. Then substitute.'], 'rink dimensions');
        } },
        { id: 'e15area', sub: 'area', level: 'PRG', make: function (r, o) {
          return numP('State the area of the rink.', o.l * o.w, function (v) {
            if (v === o.P || v === o.P / 2) return { code: 'area-perim', hint: 'That’s the perimeter (or half of it). Area = length × width.' };
            if (v === o.l || v === o.w) return { code: 'dim-not-area', hint: 'That’s one dimension. Multiply length × width.' };
            return null;
          }, 'The rink is ' + t(o.l + '\\text{ m}') + ' by ' + t(o.w + '\\text{ m}') + ', so the area is ' + t(o.l + '\\times ' + o.w + '=' + N(o.l * o.w)) + ' m².', ['Find the length and width first, then multiply.'], 'rink area', { after: 'm²' });
        } }] },
    /* ---------- 16 ---------- */
    { num: '16', shared: function (r) { return r.chance(0.06) ? { r1: 18, r2: 6, F: 120, n: 10, v: 15 } : gen(function () { var r1 = r.int(12, 25), r2 = r.int(4, r1 - 5), n = r.int(5, 20), F = (r1 - r2) * n; if (F > 300) return null; var v = r.chance(0.6) ? n + r.int(2, 8) : n - r.int(2, Math.min(4, n - 2)); return { r1: r1, r2: r2, F: F, n: n, v: v }; }, { r1: 18, r2: 6, F: 120, n: 10, v: 15 }); },
      stem: function (o) { return '<b>Break-even.</b> A Red Deer climbing gym offers two options. Under the drop-in plan you pay ' + Dh(o.r1) + ' per visit and nothing else. Under the membership plan you pay ' + Dh(o.F) + ' once, plus ' + Dh(o.r2) + ' per visit. Let ' + t('n') + ' be the number of visits in a year and ' + t('C') + ' the total yearly cost in dollars.'; },
      parts: [
        { id: 'e16sys', sub: 'a system', level: 'EMG', make: function (r, o) {
          return sysP('Write an equation for each plan.', [[-o.r1, 1, 0], [-o.r2, 1, -o.F]],
            { vars: ['n', 'C'], keyTex: ['C=' + o.r1 + 'n', 'C=' + o.F + '+' + o.r2 + 'n'], names: ['the drop-in plan', 'the membership plan'], labels: ['Drop-in', 'Membership'],
              factHints: ['drop-in: ' + Dh(o.r1) + ' for each visit, nothing else.', 'membership: ' + Dh(o.F) + ' once plus ' + Dh(o.r2) + ' per visit.'],
              wrong: [{ eq: 'C=' + o.r2 + '+' + o.F + 'n', code: 'rate-fixed', hint: 'The ' + Dh(o.F) + ' is paid <b>once</b>; the ' + Dh(o.r2) + ' is paid per visit: ' + t('C=' + o.F + '+' + o.r2 + 'n') + '.' }, { eq: 'C=' + o.r1 + '+n', code: 'rate-fixed', hint: 'Drop-in costs ' + Dh(o.r1) + ' for <b>each</b> visit: ' + t('C=' + o.r1 + 'n') + '.' }, { eq: 'C=' + o.F + '+' + o.r1 + 'n', code: 'value-swap', hint: 'Members pay only ' + Dh(o.r2) + ' per visit.' }] },
            'Drop-in: ' + t('C=' + o.r1 + 'n') + '<br>Membership: ' + t('C=' + o.F + '+' + o.r2 + 'n'), ['Cost = one-time fee + (price per visit) × (number of visits).'], 'gym system');
        } },
        { id: 'e16sol', sub: 'a solve', level: 'PRG', make: function (r, o) {
          var Cc = o.r1 * o.n;
          return numsP('Solve the system: at how many visits do the two plans cost the same, and what is that cost?', [{ label: 'Visits', after: 'visits' }, { label: 'Cost', before: '$' }], [o.n, Cc],
            { names: ['number of visits', 'common cost'], sys: [[-o.r1, 1, 0], [-o.r2, 1, -o.F]], sysNames: ['the drop-in equation', 'the membership equation'] },
            'Set the costs equal: ' + t(o.r1 + 'n=' + o.F + '+' + o.r2 + 'n') + ' ⟹ ' + t((o.r1 - o.r2) + 'n=' + o.F) + ' ⟹ ' + t('n=' + o.n) + '. Then ' + t('C=' + o.r1 + '(' + o.n + ')=' + Cc) + '.<br>' + chk('Check: ' + t(o.F + '+' + o.r2 + '(' + o.n + ')=' + Cc)) + '<br><b>At ' + o.n + ' visits both plans cost ' + Dh(Cc) + '.</b>',
            ['Both equations equal ' + t('C') + ', so set the right sides equal.'], 'gym break-even');
        } },
        { id: 'e16b', sub: 'b', level: 'EMG', make: function (r, o) {
          var cd = o.r1 * o.v, cm = o.F + o.r2 * o.v, mem = cm < cd;
          return mc(r, 'Which plan is cheaper for a climber who visits ' + t(o.v) + ' times in a year?', [
            { html: (mem ? 'Membership' : 'Drop-in') + ': drop-in costs ' + Dh(cd) + ' and membership costs ' + Dh(cm) + '.', right: true },
            { html: (mem ? 'Drop-in' : 'Membership') + ': drop-in costs ' + Dh(cd) + ' and membership costs ' + Dh(cm) + '.', why: 'Compare the two costs: ' + Dh(Math.min(cd, cm)) + ' is less than ' + Dh(Math.max(cd, cm)) + '.' },
            { html: (mem ? 'Drop-in' : 'Membership') + ': drop-in costs ' + Dh(o.r1 + o.v) + ' and membership costs ' + Dh(o.F + o.r2 + o.v) + '.', why: 'Multiply the price per visit by the number of visits: ' + t(o.r1 + '(' + o.v + ')') + ', not ' + t(o.r1 + '+' + o.v) + '.' },
            { html: 'They cost the same, because both plans include visits.', why: 'They cost the same only at ' + o.n + ' visits. Substitute ' + t('n=' + o.v) + ' into each equation.' }],
            'Drop-in: ' + t(o.r1 + '(' + o.v + ')=' + cd) + '. Membership: ' + t(o.F + '+' + o.r2 + '(' + o.v + ')=' + cm) + '. <b>The ' + (mem ? 'membership' : 'drop-in plan') + ' is cheaper</b>, by ' + Dh(Math.abs(cd - cm)) + '.', ['Substitute ' + t('n=' + o.v) + ' into both equations.'], 'gym which is cheaper');
        } },
        { id: 'e16c', sub: 'c', level: 'BEG', make: function (r, o) {
          var Cc = o.r1 * o.n;
          return mc(r, 'If you graphed both equations, what feature of the graph is your answer to (a)?', [
            { html: 'The point of intersection of the two lines, ' + t('(' + o.n + ',\\ ' + Cc + ')') + '.', right: true },
            { html: 'The ' + t('C') + '-intercept of the membership line, ' + t('(0,\\ ' + o.F + ')') + '.', why: 'That is the cost with no visits. The plans cost the same where the lines <b>meet</b>.' },
            { html: 'The slope of the drop-in line, ' + t(o.r1) + '.', why: 'The slope is the cost per visit. Equal costs happen where the lines cross.' },
            { html: 'The point where the drop-in line crosses the ' + t('n') + '-axis.', why: 'That is the origin (0 visits cost $0). Look for where the <b>two</b> lines meet.' }],
            'Both costs are equal where the two lines cross: the <b>point of intersection</b> ' + t('(' + o.n + ',\\ ' + Cc + ')') + '.', ['The solution of a system is where the two graphs meet.'], 'gym graph feature');
        } }] },
    /* ---------- 17 ---------- */
    { num: '17', shared: function (r) { return r.chance(0.06) ? { a1: 5, b1: 3, a2: 2, b2: 6, x: 50, y: 30 } : gen(function () { var a1 = r.int(2, 6), b1 = r.int(1, 5), a2 = r.int(1, 5), b2 = r.int(2, 6), x = 5 * r.int(4, 12), y = 5 * r.int(3, 10); if (a1 * b2 - a2 * b1 === 0 || x === y || (a1 === a2 && b1 === b2)) return null; if (!(b2 % b1 === 0 || b1 % b2 === 0 || a2 % a1 === 0 || a1 % a2 === 0)) return null; return { a1: a1, b1: b1, a2: a2, b2: b2, x: x, y: y }; }, { a1: 5, b1: 3, a2: 2, b2: 6, x: 50, y: 30 }); },
      stem: function (o) { return 'Tia and Ben plant seedlings at a Sherwood Park garden centre, each at a constant hourly rate. On Monday, Tia worked ' + t(o.a1 + '\\text{ h}') + ' and Ben worked ' + t(o.b1 + '\\text{ h}') + ', and together they planted ' + t(o.a1 * o.x + o.b1 * o.y) + ' seedlings. On Tuesday, Tia worked ' + t(o.a2 + '\\text{ h}') + ' and Ben worked ' + t(o.b2 + '\\text{ h}') + ', and together they planted ' + t(o.a2 * o.x + o.b2 * o.y) + ' seedlings. Let ' + t('t') + ' and ' + t('b') + ' be the numbers of seedlings per hour for Tia and Ben.'; },
      parts: [
        { id: 'e17sys', sub: 'system', level: 'PRG', make: function (r, o) {
          var M1 = o.a1 * o.x + o.b1 * o.y, M2 = o.a2 * o.x + o.b2 * o.y, cf = function (c, v) { return (c === 1 ? '' : c) + v; };
          return sysP('Write the system: one equation for each day.', [[o.a1, o.b1, -M1], [o.a2, o.b2, -M2]],
            { vars: ['t', 'b'], keyTex: [cf(o.a1, 't') + '+' + cf(o.b1, 'b') + '=' + M1, cf(o.a2, 't') + '+' + cf(o.b2, 'b') + '=' + M2], names: ['Monday', 'Tuesday'], factHints: ['Monday: Tia planted ' + t(o.a1 + 't') + ' and Ben ' + t(o.b1 + 'b') + ' seedlings.', 'Tuesday: ' + t(o.a2 + 't+' + o.b2 + 'b') + ' seedlings.'],
              wrong: [{ eq: cf(o.b1, 't') + '+' + cf(o.a1, 'b') + '=' + M1, code: 'value-swap', hint: 'Tia worked ' + o.a1 + ' h on Monday, so she planted ' + t(o.a1 + 't') + ' seedlings.' }, { eq: 't+b=' + M1, code: 'count-value', hint: 'Seedlings = (rate per hour) × (hours) for each person.' }] },
            'Monday: ' + t(cf(o.a1, 't') + '+' + cf(o.b1, 'b') + '=' + M1) + '<br>Tuesday: ' + t(cf(o.a2, 't') + '+' + cf(o.b2, 'b') + '=' + M2), ['Seedlings planted = (seedlings per hour) × (hours worked).'], 'planting system');
        } },
        { id: 'e17sol', sub: 'solve', level: 'ADV', make: function (r, o) {
          var M1 = o.a1 * o.x + o.b1 * o.y, M2 = o.a2 * o.x + o.b2 * o.y;
          return numsP('Find each person’s hourly planting rate.', [{ label: 'Tia', after: 'seedlings/h' }, { label: 'Ben', after: 'seedlings/h' }], [o.x, o.y],
            { names: ['Tia’s rate', 'Ben’s rate'], sys: [[o.a1, o.b1, -M1], [o.a2, o.b2, -M2]], sysNames: ['Monday’s equation', 'Tuesday’s equation'] },
            elimText(o, M1, M2) + '<br>' + chk('Check: ' + t(o.a1 + '(' + o.x + ')+' + o.b1 + '(' + o.y + ')=' + M1)) + ', ' + chk(t(o.a2 + '(' + o.x + ')+' + o.b2 + '(' + o.y + ')=' + M2)) + '<br><b>Tia plants ' + o.x + ' seedlings per hour and Ben plants ' + o.y + '.</b>',
            ['Make one pair of coefficients match (multiply one equation), then subtract.'], 'planting solve');
        } }] },
    /* ---------- 18 ---------- */
    { num: '18', section: 'Extra Practice G — Error Analysis, Checking, and Working Backwards', shared: function (r) { return r.chance(0.06) ? { ps: 5, pl: 8, d: 60, l: 60 } : gen(function () { var ps = r.int(3, 6), pl = r.int(ps + 2, 10), d = 10 * r.int(2, 8), l = 10 * r.int(2, 10); return { ps: ps, pl: pl, d: d, l: l }; }, { ps: 5, pl: 8, d: 60, l: 60 }); },
      stem: function (o) { var s = o.l + o.d, T = o.ps * s + o.pl * o.l; return '<b>Error analysis: one useless equation.</b> A theatre in Medicine Hat charges ' + Dh(o.ps) + ' for a small popcorn and ' + Dh(o.pl) + ' for a large. One evening it sold ' + t(o.d) + ' more smalls than larges and took in ' + Dh(T) + '. Let ' + t('s') + ' be the number of smalls and ' + t('l') + ' the number of larges. Marcus wrote ' + t('s-l=' + o.d) + ' and ' + t('s=l+' + o.d) + '.'; },
      parts: [
        { id: 'e18a', sub: 'a', level: 'PRG', make: function (r, o) {
          return mc(r, 'What happens when Marcus tries to solve his system, and what has gone wrong?', [
            { html: 'Substituting gives ' + t('(l+' + o.d + ')-l=' + o.d) + ', i.e. ' + t(o.d + '=' + o.d) + ', true for every ' + t('l') + ': his two equations are the same fact written two ways.', right: true },
            { html: 'Substituting gives ' + t('0=' + o.d) + ', which is never true, so the popcorn problem has no solution.', why: 'Substitute carefully: ' + t('(l+' + o.d + ')-l') + ' is ' + t(o.d) + ', so you get ' + t(o.d + '=' + o.d) + ' — always true, not never.' },
            { html: 'He gets ' + t('l=' + o.d) + ', so the theatre sold ' + o.d + ' large popcorns.', why: 'The ' + t('l') + ' cancels completely: ' + t('(l+' + o.d + ')-l=' + o.d) + '. You can’t solve for ' + t('l') + ' this way.' },
            { html: 'Nothing is wrong: two equations always give exactly one solution.', why: 'Two equations give one solution only if they say <b>different</b> things. These two lines are the same line.' }],
            'Substitute ' + t('s=l+' + o.d) + ' into ' + t('s-l=' + o.d) + ': ' + t('(l+' + o.d + ')-l=' + o.d) + ' ⟹ ' + t(o.d + '=' + o.d) + ', true for every ' + t('l') + '. Both equations say “' + o.d + ' more smalls than larges”: the system carries only <b>one</b> fact, so it has infinitely many solutions.', ['Substitute the second equation into the first and simplify.'], 'Marcus same equation');
        } },
        { id: 'e18b', sub: 'b system', level: 'ADV', make: function (r, o) {
          var s = o.l + o.d, T = o.ps * s + o.pl * o.l;
          return sysP('Marcus never used the money (' + Dh(T) + '). Write a correct system.', [[1, -1, -o.d], [o.ps, o.pl, -T]],
            { vars: ['s', 'l'], keyTex: ['s=l+' + o.d, o.ps + 's+' + o.pl + 'l=' + T], names: ['the “more smalls” fact', 'the money'], factHints: ['there are ' + o.d + ' more smalls: ' + t('s=l+' + o.d) + '.', 'the money: ' + t(o.ps + 's+' + o.pl + 'l=' + T) + '.'],
              wrong: [{ eq: o.pl + 's+' + o.ps + 'l=' + T, code: 'value-swap', hint: 'A small popcorn costs ' + Dh(o.ps) + ', so the smalls bring in ' + t(o.ps + 's') + '.' }, { eq: 's+l=' + o.d, code: 'u8l7-facts-swap', hint: t(o.d) + ' is how many <b>more</b> smalls there are, not the total.' }, { eq: 'l=s+' + o.d, code: 'more-than-flip', hint: 'There are more <b>smalls</b>: ' + t('s=l+' + o.d) + '.' }] },
            t('s=l+' + o.d) + ' (or ' + t('s-l=' + o.d) + ') and ' + t(o.ps + 's+' + o.pl + 'l=' + T) + '.', ['Keep one of Marcus’s equations and add the money equation.'], 'Marcus corrected system');
        } },
        { id: 'e18c', sub: 'b solve', level: 'ADV', make: function (r, o) {
          var s = o.l + o.d, T = o.ps * s + o.pl * o.l;
          return numsP('Solve the correct system. How many of each size were sold?', [{ label: 'Small popcorns' }, { label: 'Large popcorns' }], [s, o.l],
            { names: ['number of smalls', 'number of larges'], sys: [[1, -1, -o.d], [o.ps, o.pl, -T]], sysNames: ['the “more smalls” fact', 'the money equation'], swapHint: 'There are more <b>small</b> popcorns.' },
            'Substitute ' + t('s=l+' + o.d) + ': ' + t(o.ps + '(l+' + o.d + ')+' + o.pl + 'l=' + T) + ' ⟹ ' + t((o.ps + o.pl) + 'l+' + o.ps * o.d + '=' + T) + ' ⟹ ' + t((o.ps + o.pl) + 'l=' + (T - o.ps * o.d)) + ' ⟹ ' + t('l=' + o.l) + ', ' + t('s=' + s) + '.<br>' + chk('Check: ' + t(o.ps + '(' + s + ')+' + o.pl + '(' + o.l + ')=' + (o.ps * s) + '+' + (o.pl * o.l) + '=' + T)) + ', and ' + s + ' is ' + o.d + ' more than ' + o.l + ' ✓<br><b>They sold ' + s + ' small and ' + o.l + ' large popcorns.</b>',
            ['Substitute ' + t('s=l+' + o.d) + ' into the money equation.'], 'Marcus corrected solve');
        } }] },
    /* ---------- 19 ---------- */
    { num: '19', shared: function (r) { return r.chance(0.06) ? { pa: 15, py: 10, a: 100, y: 20, N: 120, R: 1300, an: -4, yn: 124 } : gen(function () { var pa = r.pick([12, 14, 15, 16, 18, 20]), py = r.pick([6, 8, 10]), a = 10 * r.int(4, 12), y = 10 * r.int(1, 6); if (py >= pa) return null; var Nn = a + y, R = pa * a - py * y; if (R <= 0 || R % 100) return null; var an = (py * Nn - R) / (pa + py); if (!Number.isInteger(an) || an >= 0) return null; return { pa: pa, py: py, a: a, y: y, N: Nn, R: R, an: an, yn: Nn - an }; }, { pa: 15, py: 10, a: 100, y: 20, N: 120, R: 1300, an: -4, yn: 124 }); },
      stem: function (o) { return '<b>Error analysis: reversed quantities.</b> A community theatre in Wetaskiwin sold ' + t(o.N) + ' tickets: adults at ' + Dh(o.pa) + ' and youth at ' + Dh(o.py) + '. The revenue from adult tickets was ' + Dh(o.R) + ' <i>more than</i> the revenue from youth tickets. Nadia let ' + t('a') + ' be the number of adult tickets and ' + t('y') + ' the number of youth tickets, and wrote ' + t('a+y=' + o.N) + ' and ' + t(o.py + 'y-' + o.pa + 'a=' + o.R) + '.'; },
      parts: [
        { id: 'e19a', sub: 'a', level: 'PRG', make: function (r, o) {
          return numsP('Solve <b>Nadia’s</b> system (the one she wrote, mistake and all).', [{ label: t('a') }, { label: t('y') }], [o.an, o.yn],
            { names: ['value of a', 'value of y'], sys: [[1, 1, -o.N], [-o.pa, o.py, -o.R]], sysNames: ['her first equation', 'her second equation'], wrong: [{ v: [o.a, o.y], code: 'u8l7-nadia-copied', hint: 'That’s the answer to the <b>correct</b> problem. Here, solve the system exactly as Nadia wrote it — that shows what her mistake does.' }, { v: [-o.an, o.N + o.an], code: 'sign-count', hint: 'Check the sign: substitute your ' + t('a') + ' into ' + t(o.py + 'y-' + o.pa + 'a') + '.' }] },
            'From ' + t('a+y=' + o.N) + ', ' + t('y=' + o.N + '-a') + '. Then ' + t(o.py + '(' + o.N + '-a)-' + o.pa + 'a=' + o.R) + ' ⟹ ' + t(N(o.py * o.N) + '-' + (o.pa + o.py) + 'a=' + o.R) + ' ⟹ ' + t('-' + (o.pa + o.py) + 'a=' + N(o.R - o.py * o.N)) + ' ⟹ ' + t('a=' + o.an) + ', so ' + t('y=' + o.yn) + '.',
            ['Substitute ' + t('y=' + o.N + '-a') + ' into her second equation. Watch the signs: the answer may be negative.'], 'Nadia solve');
        } },
        { id: 'e19a2', sub: 'a why', level: 'EMG', make: function (r, o) {
          return mc(r, 'Nadia’s system gives ' + t('a=' + o.an) + '. What does that say, and why is it impossible?', [
            { html: 'It says ' + t(o.an) + ' adult tickets were sold — you can’t sell a negative number of tickets.', right: true },
            { html: 'It says ' + t(-o.an) + ' adult tickets were sold, which is too few.', why: 'The value is ' + t(o.an) + ', a <b>negative</b> count — that is the impossible part.' },
            { html: 'It is fine: negative values are allowed in a system.', why: 'In algebra, yes — but ' + t('a') + ' counts tickets, which can’t be negative. The answer must make sense in the story.' },
            { html: 'It says the youth tickets cost ' + Dh(-o.an) + ' less.', why: t('a') + ' is the <b>number</b> of adult tickets, not a price.' }],
            t('a') + ' counts adult tickets. A count of ' + t(o.an) + ' is impossible, so something in her setup is wrong.', ['What does ' + t('a') + ' stand for?'], 'Nadia impossible');
        } },
        { id: 'e19b1', sub: 'b equation', level: 'MAS', make: function (r, o) {
          var T = [o.pa, -o.py, -o.R];
          return { prompt: 'Nadia reversed one quantity. Write the <b>corrected second equation</b> (in ' + t('a') + ' and ' + t('y') + ').', input: { type: 'math', keys: 'eq', vars: ['a', 'y'], placeholder: ' ' },
            check: eqCheck(T, { vars: ['a', 'y'], wrong: [{ eq: o.py + 'y-' + o.pa + 'a=' + o.R, code: 'u8l7-nadia-copied', hint: 'That’s Nadia’s equation. Which revenue is bigger — adults’ or youths’?' }, { eq: o.pa + 'a+' + o.py + 'y=' + o.R, code: 'sum-diff', hint: '“' + Dh(o.R) + ' <b>more than</b>” compares the two revenues: subtract the smaller from the larger.' }, { eq: o.py + 'a-' + o.pa + 'y=' + o.R, code: 'value-swap', hint: 'Adults pay ' + Dh(o.pa) + ', so adult revenue is ' + t(o.pa + 'a') + '.' }, { eq: 'a-y=' + o.R, code: 'count-value', hint: 'The fact compares <b>revenue</b> (dollars), so use ' + t(o.pa + 'a') + ' and ' + t(o.py + 'y') + '.' }],
              hint: 'Adult revenue is ' + t(o.pa + 'a') + ' and youth revenue is ' + t(o.py + 'y') + '. Which one is ' + Dh(o.R) + ' more?' }),
            key: o.pa + 'a-' + o.py + 'y=' + o.R, answer: t(o.pa + 'a-' + o.py + 'y=' + o.R), good: [o.pa + 'a=' + o.py + 'y+' + o.R], bad: [o.py + 'y-' + o.pa + 'a=' + o.R, o.pa + 'a+' + o.py + 'y=' + o.R],
            solution: 'The <b>adult</b> revenue ' + t(o.pa + 'a') + ' is the larger amount — it is ' + Dh(o.R) + ' more than the youth revenue ' + t(o.py + 'y') + '. Nadia subtracted in the wrong order. Correct: ' + t(o.pa + 'a-' + o.py + 'y=' + o.R) + ' (or ' + t(o.pa + 'a=' + o.py + 'y+' + o.R) + ').',
            hints: ['“A is ' + o.R + ' more than B” means ' + t('A-B=' + o.R) + '. Here A is the adult revenue.'], text: 'Nadia corrected equation' };
        } },
        { id: 'e19b2', sub: 'b solve', level: 'ADV', make: function (r, o) {
          return numsP('Solve the corrected system ' + t('a+y=' + o.N) + ', ' + t(o.pa + 'a-' + o.py + 'y=' + o.R) + '. How many of each ticket were sold?', [{ label: 'Adult tickets' }, { label: 'Youth tickets' }], [o.a, o.y],
            { names: ['number of adult tickets', 'number of youth tickets'], sys: [[1, 1, -o.N], [o.pa, -o.py, -o.R]], sysNames: ['the count', 'the revenue fact'], wrong: [{ v: [o.an, o.yn], code: 'u8l7-nadia-copied', hint: 'That’s the answer to Nadia’s reversed equation. Use ' + t(o.pa + 'a-' + o.py + 'y=' + o.R) + '.' }] },
            t('y=' + o.N + '-a') + ': ' + t(o.pa + 'a-' + o.py + '(' + o.N + '-a)=' + o.R) + ' ⟹ ' + t((o.pa + o.py) + 'a-' + N(o.py * o.N) + '=' + o.R) + ' ⟹ ' + t((o.pa + o.py) + 'a=' + N(o.R + o.py * o.N)) + ' ⟹ ' + t('a=' + o.a) + ', ' + t('y=' + o.y) + '.<br>' + chk('Check: ' + t(N(o.pa * o.a) + '-' + N(o.py * o.y) + '=' + N(o.R))) + ', ' + chk(t(o.a + '+' + o.y + '=' + o.N)) + '<br><b>They sold ' + o.a + ' adult and ' + o.y + ' youth tickets.</b>',
            ['Substitute ' + t('y=' + o.N + '-a') + ' into the corrected equation.'], 'Nadia corrected solve');
        } }] },
    /* ---------- 20 ---------- */
    { num: '20', shared: function (r) { return r.chance(0.06) ? { pc: 45, pk: 30, c: 14, k: 12, dj: 2 } : gen(function () { var pc = 5 * r.int(7, 12), pk = 5 * r.int(4, pc / 5 - 2), c = r.int(6, 20), k = r.int(6, 20), dj = r.pick([-3, -2, -1, 1, 2, 3]); if (c === k || k - dj < 1 || c + dj === k - dj) return null; return { pc: pc, pk: pk, c: c, k: k, dj: dj }; }, { pc: 45, pk: 30, c: 14, k: 12, dj: 2 }); },
      stem: function (o) { var Nn = o.c + o.k, T = o.pc * o.c + o.pk * o.k; return '<b>Checking in the original words.</b> An outfitter in Grande Cache rents canoes at ' + Dh(o.pc) + ' per day and kayaks at ' + Dh(o.pk) + ' per day. On the long weekend, ' + t(Nn) + ' boats were rented for a total of ' + Dh(T) + '. Jonah says the answer is ' + t(o.c + o.dj) + ' canoes and ' + t(o.k - o.dj) + ' kayaks.'; },
      parts: [
        { id: 'e20a', sub: 'a', level: 'PRG', make: function (r, o) {
          var Nn = o.c + o.k, T = o.pc * o.c + o.pk * o.k, jc = o.c + o.dj, jk = o.k - o.dj, JT = o.pc * jc + o.pk * jk;
          return mc(r, 'Check Jonah’s answer against <b>each sentence</b> of the problem. Which statement is true?', [
            { html: 'It fits “' + Nn + ' boats were rented” (' + t(jc + '+' + jk + '=' + Nn) + ') but not the money: ' + t(o.pc + '(' + jc + ')+' + o.pk + '(' + jk + ')=' + JT) + ', not ' + t(T) + '.', right: true },
            { html: 'It fits both sentences, so Jonah is right.', why: 'Check the money: ' + t(o.pc + '(' + jc + ')+' + o.pk + '(' + jk + ')=' + JT) + ', not ' + Dh(T) + '.' },
            { html: 'It fits the money (' + Dh(T) + ') but not the number of boats.', why: t(jc + '+' + jk + '=' + Nn) + ', so the count is right. It is the money that fails: ' + Dh(JT) + '.' },
            { html: 'It fits neither sentence.', why: 'Count: ' + t(jc + '+' + jk + '=' + Nn) + ' ✓. Only the money fails.' }],
            'Boats: ' + t(jc + '+' + jk + '=' + Nn) + ' ✓. Money: ' + t(o.pc + '(' + jc + ')+' + o.pk + '(' + jk + ')=' + N(o.pc * jc) + '+' + N(o.pk * jk) + '=' + JT) + ', not ' + Dh(T) + ' ✗. Jonah’s answer satisfies the count but not the money, so it is wrong.', ['Substitute Jonah’s numbers into each sentence separately.'], 'check Jonah');
        } },
        { id: 'e20b1', sub: 'b system', level: 'EMG', make: function (r, o) {
          var s = { X: 'c', Y: 'k', n1: 'canoes', n2: 'kayaks', p1: o.pc, p2: o.pk, x: o.c, y: o.k, N: o.c + o.k, T: o.pc * o.c + o.pk * o.k, what: 'boats', each: 'per day' };
          return cvSys('Let ' + t('c') + ' be the number of canoes and ' + t('k') + ' the number of kayaks rented. Write a correct system.', s);
        } },
        { id: 'e20b2', sub: 'b solve', level: 'PRG', make: function (r, o) {
          var s = { X: 'c', Y: 'k', n1: 'canoes', n2: 'kayaks', p1: o.pc, p2: o.pk, x: o.c, y: o.k, N: o.c + o.k, T: o.pc * o.c + o.pk * o.k, what: 'boats', each: 'per day' };
          var p = cvSolve('Solve the system. How many canoes and how many kayaks were rented?', s, 'They rented ' + o.c + ' canoes and ' + o.k + ' kayaks.');
          p.check = (function (c) { return function (resp) { var v = (resp || []).map(function (x) { return Number(String(x || '').trim()); }); if (v[0] === o.c + o.dj && v[1] === o.k - o.dj) return wrong('sys-one-eq', 'That’s Jonah’s answer — it fails the money sentence. Solve the system.'); return c(resp); }; })(p.check);
          p.bad.push([String(o.c + o.dj), String(o.k - o.dj)]);
          return p;
        } }] },
    /* ---------- 21 ---------- */
    { num: '21', stem: '<b>Working backwards.</b> A number has been erased from the problem, but the answer is known. Reconstruct the missing number.', parts: [
      { id: 'e21a', sub: 'a', level: 'PRG', make: function (r) {
        var o = r.chance(0.06) ? { py: 6, pa: 11, y: 85, a: 55 } : gen(function () { var py = r.int(4, 8), pa = r.int(py + 3, 14), y = 5 * r.int(6, 20), a = 5 * r.int(6, 20); return y === a ? null : { py: py, pa: pa, y: y, a: a }; }, { py: 6, pa: 11, y: 85, a: 55 });
        var T = o.py * o.y + o.pa * o.a;
        return numP('“A rink sold youth passes at ' + Dh(o.py) + ' and adult passes at ' + Dh(o.pa) + '. A total of ' + t(o.y + o.a) + ' passes were sold for $____.” The answer key reads: ' + o.y + ' youth passes and ' + o.a + ' adult passes. Find the erased total.', T, function (v) {
          if (v === o.py * o.a + o.pa * o.y) return { code: 'value-swap', hint: 'Match each price to its own count: ' + o.y + ' <b>youth</b> passes at ' + Dh(o.py) + '.' };
          if (v === o.y + o.a) return { code: 'count-value', hint: 'That’s the number of passes. The erased number is the <b>money</b>: price × count for each kind, added.' };
          return null;
        }, 'The erased number is the total money: ' + t(o.py + '(' + o.y + ')+' + o.pa + '(' + o.a + ')=' + (o.py * o.y) + '+' + (o.pa * o.a) + '=' + N(T)) + '.<br>(The counts also check: ' + t(o.y + '+' + o.a + '=' + (o.y + o.a)) + ' passes.)<br><b>The erased total is ' + Dh(T) + '.</b>',
          ['Money = (price × number) for each kind of pass, added together.'], 'erased total', { money: true, before: '$' });
      } },
      { id: 'e21b', sub: 'b', level: 'MAS', make: function (r) {
        var o = r.chance(0.06) ? { M: 40, pd: 22, ph: 14, d: 15 } : gen(function () { var M = 10 * r.int(2, 6), pd = r.int(16, 26), ph = r.int(8, pd - 4), d = r.int(5, M - 5); if (d === M - d) return null; return { M: M, pd: pd, ph: ph, d: d }; }, { M: 40, pd: 22, ph: 14, d: 15 });
        var h = o.M - o.d, T = o.pd * o.d + o.ph * h;
        return numP('“A ' + t(o.M + '\\text{ kg}') + ' coffee blend mixes dark roast at ' + Dh(o.pd) + '/kg with house roast at $____/kg, and the whole blend costs ' + Dh(T) + '.” The answer key reads: ' + t(o.d + '\\text{ kg}') + ' of dark roast. Find the erased price of the house roast (per kg).', o.ph, function (v) {
          if (near(v, T / o.M)) return { code: 'u8l7-average', hint: 'That’s the average price of the whole blend. Find the cost of the house roast part only, then divide by its mass.' };
          if (v === T - o.pd * o.d) return { code: 'u8l7-not-divided', hint: 'That’s what all the house roast costs together. Divide by its mass, ' + t(h + '\\text{ kg}') + ', to get the price per kg.' };
          if (near(v, (T - o.pd * o.d) / o.d)) return { code: 'u8l7-wrong-mass', hint: 'Divide by the mass of <b>house roast</b>: ' + t(o.M + '-' + o.d + '=' + h + '\\text{ kg}') + '.' };
          return null;
        }, 'Dark roast: ' + t(o.d + '\\times ' + o.pd + '=' + (o.d * o.pd)) + ' dollars.<br>House roast: ' + t(o.M + '-' + o.d + '=' + h + '\\text{ kg}') + ', costing ' + t(N(T) + '-' + (o.d * o.pd) + '=' + (h * o.ph)) + ' dollars.<br>Price: ' + t((h * o.ph) + '\\div ' + h + '=' + o.ph) + '.<br>' + chk('Check: ' + t(o.pd + '(' + o.d + ')+' + o.ph + '(' + h + ')=' + N(T))) + '<br><b>The erased price is ' + Dh(o.ph) + '/kg.</b>',
          ['How much of the ' + Dh(T) + ' is spent on dark roast? The rest pays for the house roast.', 'How many kilograms of house roast are there?'], 'erased price', { money: true, before: '$', after: '/kg' });
      } }] },
    /* ---------- 22 ---------- */
    { num: '22', section: 'Extra Practice H — Stretch', shared: function (r) { return r.chance(0.06) ? { c: 800, b: 700, d1: 620 } : gen(function () { var c = 20 * r.int(20, 50), b = 20 * r.int(15, 45); if (c === b) return null; var d1 = 10 * r.int(20, Math.floor((c + b) / 20)); return { c: c, b: b, d1: d1 }; }, { c: 800, b: 700, d1: 620 }); },
      stem: function (o) { var T = (10 * o.c + 25 * o.b) / 100; return '<b>One number you do not need.</b> A Grade 10 class in Leduc ran a two-day bottle drive. They receive ' + t('\\$0.10') + ' for each pop can and ' + t('\\$0.25') + ' for each large juice bottle. On Day 1 they collected ' + t(o.d1) + ' containers. Over the two days they collected ' + t(N(o.c + o.b)) + ' containers altogether — cans and bottles only — worth ' + Dh(T) + '.'; },
      parts: [
        { id: 'e22a', sub: 'a', level: 'PRG', make: function (r, o) {
          var T = (10 * o.c + 25 * o.b) / 100;
          return mc(r, 'Which number given in the problem is <b>not</b> needed to find how many cans and how many bottles were collected over the two days?', [
            { html: t(o.d1) + ' (Day 1) — the two-day count and the two-day value already cover the whole drive.', right: true },
            { html: t(N(o.c + o.b)) + ' (the total count) — the value alone is enough.', why: 'One equation can’t find two unknowns. The total count gives the second equation.' },
            { html: Dh(T) + ' (the total value) — the counts are enough.', why: 'Without the value, the counts give only one equation for two unknowns.' },
            { html: 'Every number is needed: Day 1 gives a third equation.', why: 'Day 1’s ' + o.d1 + ' containers mix cans and bottles from <b>one</b> day only; the question is about both days, and two facts about the whole drive are enough.' }],
            'You need two facts about the <b>whole</b> drive: the two-day count (' + N(o.c + o.b) + ') and the two-day value (' + Dh(T) + '). Day 1’s ' + o.d1 + ' containers is extra information.', ['The question is about both days together. Which facts describe both days?'], 'unneeded number');
        } },
        { id: 'e22b', sub: 'b system', level: 'PRG', make: function (r, o) {
          var s = { X: 'c', Y: 'b', n1: 'cans', n2: 'bottles', p1: 0.1, p2: 0.25, x: o.c, y: o.b, N: o.c + o.b, T: (10 * o.c + 25 * o.b) / 100, what: 'containers', each: 'each', dec: true };
          s.extraWrong = [{ eq: 'c+b=' + o.d1, code: 'u8l7-one-day', hint: t(o.d1) + ' is only Day 1. The count equation uses the <b>two-day</b> total, ' + t(N(s.N)) + '.' }];
          return cvSys('Let ' + t('c') + ' be the number of cans and ' + t('b') + ' the number of bottles collected over the two days. Write the system.', s);
        } },
        { id: 'e22c', sub: 'b solve', level: 'ADV', make: function (r, o) {
          var T = (10 * o.c + 25 * o.b) / 100, Nn = o.c + o.b;
          return numsP('How many cans and how many bottles were collected over the two days?', [{ label: 'Cans' }, { label: 'Bottles' }], [o.c, o.b],
            { names: ['number of cans', 'number of bottles'], sys: [[1, 1, -Nn], [10, 25, -100 * T]], sysNames: ['the count', 'the value'] },
            t('c+b=' + N(Nn)) + ' and ' + t('0.10c+0.25b=' + m2(T)) + '.<br>Multiply the value equation by ' + t(100) + ': ' + t('10c+25b=' + N(100 * T)) + ', then divide by ' + t(5) + ': ' + t('2c+5b=' + N(20 * T)) + '.<br>Substitute ' + t('c=' + N(Nn) + '-b') + ': ' + t(N(2 * Nn) + '+3b=' + N(20 * T)) + ' ⟹ ' + t('3b=' + N(20 * T - 2 * Nn)) + ' ⟹ ' + t('b=' + o.b) + ', ' + t('c=' + o.c) + '.<br>' +
              chk('Check: ' + t(o.c + '+' + o.b + '=' + N(Nn))) + ' containers, ' + chk(t('\\$' + m2(o.c / 10) + '+\\$' + m2(o.b / 4) + '=\\$' + m2(T))) + '<br><b>They collected ' + o.c + ' cans and ' + o.b + ' bottles.</b>',
            ['Clear the decimals in the value equation (× 100), then substitute ' + t('c=' + N(Nn) + '-b') + '.'], 'bottle drive solve');
        } }] },
    /* ---------- 23 ---------- */
    { num: '23', shared: function (r) { return r.chance(0.06) ? { pa: 18, py: 9, a: 136, y: 104 } : gen(function () { var py = r.int(6, 10), pa = 2 * py, a = r.int(80, 160), y = r.int(60, 140); return a === y ? null : { pa: pa, py: py, a: a, y: y }; }, { pa: 18, py: 9, a: 136, y: 104 }); },
      stem: function (o) { return '<b>Two stages.</b> Tickets to a Rocky Mountain House rodeo cost ' + Dh(o.pa) + ' for adults and ' + Dh(o.py) + ' for youth. On Friday, ' + t(o.a + o.y) + ' tickets were sold for ' + Dh(o.pa * o.a + o.py * o.y) + '. On Saturday, the number of adult tickets sold was double Friday’s, while the number of youth tickets sold was the same as Friday’s.'; },
      parts: [
        { id: 'e23a', sub: 'a', level: 'PRG', make: function (r, o) {
          var s = { X: 'a', Y: 'y', n1: 'adult tickets', n2: 'youth tickets', p1: o.pa, p2: o.py, x: o.a, y: o.y, N: o.a + o.y, T: o.pa * o.a + o.py * o.y, what: 'tickets', each: 'each' };
          return cvSolve('Write and solve a system to find how many adult and how many youth tickets were sold on <b>Friday</b>. (Let ' + t('a') + ' and ' + t('y') + ' be Friday’s adult and youth tickets.)', s, 'Friday: ' + o.a + ' adult and ' + o.y + ' youth tickets.');
        } },
        { id: 'e23b', sub: 'b', level: 'MAS', make: function (r, o) {
          var A2 = 2 * o.a, R = o.pa * A2 + o.py * o.y, F = o.pa * o.a + o.py * o.y;
          return numP('Use your Friday counts to find <b>Saturday’s</b> ticket revenue. (No new system is needed.)', R, function (v) {
            if (v === 2 * F) return { code: 'u8l7-whole-sat', hint: 'Only the <b>adult</b> tickets doubled; the youth tickets stayed at Friday’s number.' };
            if (v === F) return { code: 'answered-other', hint: 'That’s Friday’s revenue. On Saturday the adult tickets doubled.' };
            if (v === F + R) return { code: 'answered-other', hint: 'That’s both days together. The question asks for Saturday only.' };
            return null;
          }, 'Friday (from part a): ' + o.a + ' adult and ' + o.y + ' youth tickets.<br>Saturday: ' + t('2\\times ' + o.a + '=' + A2) + ' adult tickets and ' + o.y + ' youth tickets.<br>Revenue: ' + t(o.pa + '(' + A2 + ')+' + o.py + '(' + o.y + ')=' + N(o.pa * A2) + '+' + N(o.py * o.y) + '=' + N(R)) + '.<br><b>Saturday’s revenue was ' + Dh(R) + '.</b>',
            ['Solve part (a) first. Then double only the adult count.'], 'Saturday revenue', { money: true, before: '$' });
        } },
        { id: 'e23c', sub: 'c', level: 'ADV', make: function (r, o) {
          var tot = o.a + o.y + 2 * o.a + o.y;
          return numP('How many tickets in total were sold over the two days?', tot, function (v) {
            if (v === o.a + o.y) return { code: 'u8l7-one-day', hint: 'That’s Friday only. Add Saturday’s tickets too.' };
            if (v === 2 * (o.a + o.y)) return { code: 'u8l7-whole-sat', hint: 'Saturday is not a copy of Friday: only the adult count doubled.' };
            if (v === 2 * o.a + o.y) return { code: 'u8l7-one-day', hint: 'That’s Saturday only. Add Friday’s ' + (o.a + o.y) + ' tickets.' };
            return null;
          }, 'Friday: ' + t(o.a + '+' + o.y + '=' + (o.a + o.y)) + '. Saturday: ' + t(2 * o.a + '+' + o.y + '=' + (2 * o.a + o.y)) + '.<br>Total: ' + t((o.a + o.y) + '+' + (2 * o.a + o.y) + '=' + tot) + '.<br><b>' + tot + ' tickets were sold over the two days.</b>',
            ['Saturday had ' + t(2 * o.a) + ' adult and ' + t(o.y) + ' youth tickets.'], 'two-day tickets', { after: 'tickets' });
        } }] }
  ];

  /* ---------- helpers used above ---------- */
  function e4a(r) { return r.chance(0.05) ? { S: 128, D: 34, x: 81, y: 47 } : gen(function () { var y = r.int(10, 70), d = r.int(4, 40), x = y + d; return { S: x + y, D: d, x: x, y: y }; }, { S: 128, D: 34, x: 81, y: 47 }); }
  function e4b(r) { return r.chance(0.05) ? { k: 2, c: 3, y: 23, x: 49, S: 72 } : gen(function () { var k = r.pick([2, 2, 3]), c = r.int(1, 9), y = r.int(5, 30), x = k * y + c; return { k: k, c: c, y: y, x: x, S: x + y }; }, { k: 2, c: 3, y: 23, x: 49, S: 72 }); }
  function mixSol(o, u, what) {
    var P = o.pm * o.M / 100, P100 = o.pm * o.M;
    return 'Multiply the ' + what + ' equation by ' + t(100) + ': ' + t(o.p1 + 'x+' + o.p2 + 'y=' + N(P100)) + '.<br>Substitute ' + t('x=' + o.M + '-y') + ': ' + t(o.p1 + '(' + o.M + '-y)+' + o.p2 + 'y=' + N(P100)) + ' ⟹ ' + t(N(o.p1 * o.M) + '+' + (o.p2 - o.p1) + 'y=' + N(P100)) + ' ⟹ ' + t((o.p2 - o.p1) + 'y=' + N(P100 - o.p1 * o.M)) + ' ⟹ ' + t('y=' + o.y) + ', so ' + t('x=' + o.x) + '.<br>' +
      chk('Check: ' + t(pdec(o.p1) + '(' + o.x + ')+' + pdec(o.p2) + '(' + o.y + ')=' + N(o.p1 * o.x / 100) + '+' + N(o.p2 * o.y / 100) + '=' + N(P)) + ' ' + u + ' of ' + what + ', and ' + t(N(P) + '\\div ' + o.M + '=' + o.pm + '\\%'));
  }
  function elimText(o, M1, M2) {
    // eliminate t or b: pick a variable where one coefficient divides the other
    var cfx = function (c, v) { return (c === 1 ? '' : c) + v; };
    if (o.a1 % o.a2 === 0 || o.a2 % o.a1 === 0) {   // eliminate t
      var big = o.a1 >= o.a2, m = big ? o.a1 / o.a2 : o.a2 / o.a1;
      var E1 = big ? [o.a1, o.b1, M1] : [o.a2, o.b2, M2], E2 = big ? [o.a2 * m, o.b2 * m, M2 * m] : [o.a1 * m, o.b1 * m, M1 * m], which = big ? 'Tuesday' : 'Monday';
      var db = E2[1] - E1[1], dm = E2[2] - E1[2];
      return (m > 1 ? 'Multiply ' + which + '’s equation by ' + t(m) + ': ' + t(cfx(E2[0], 't') + '+' + cfx(E2[1], 'b') + '=' + E2[2]) + '.<br>' : '') + 'Subtract the equations: ' + t(cfx(Math.abs(db), 'b') + '=' + Math.abs(dm)) + ' ⟹ ' + t('b=' + o.y) + '.<br>Substitute: ' + t(o.a1 + 't+' + o.b1 + '(' + o.y + ')=' + M1) + ' ⟹ ' + t(cfx(o.a1, 't') + '=' + (M1 - o.b1 * o.y)) + ' ⟹ ' + t('t=' + o.x) + '.';
    }
    var bigb = o.b1 >= o.b2, mb = bigb ? o.b1 / o.b2 : o.b2 / o.b1;
    var F1 = bigb ? [o.a1, o.b1, M1] : [o.a2, o.b2, M2], F2 = bigb ? [o.a2 * mb, o.b2 * mb, M2 * mb] : [o.a1 * mb, o.b1 * mb, M1 * mb], wh = bigb ? 'Tuesday' : 'Monday';
    var dt = F1[0] - F2[0], dM = F1[2] - F2[2];
    return (mb > 1 ? 'Multiply ' + wh + '’s equation by ' + t(mb) + ': ' + t(cfx(F2[0], 't') + '+' + cfx(F2[1], 'b') + '=' + F2[2]) + '.<br>' : '') + 'Subtract the equations: ' + t(cfx(Math.abs(dt), 't') + '=' + Math.abs(dM)) + ' ⟹ ' + t('t=' + o.x) + '.<br>Substitute: ' + t(o.a1 + '(' + o.x + ')+' + cfx(o.b1, 'b') + '=' + M1) + ' ⟹ ' + t(cfx(o.b1, 'b') + '=' + (M1 - o.a1 * o.x)) + ' ⟹ ' + t('b=' + o.y) + '.';
  }

  HW.defineLesson({
    id: 'u8l7', unit: 8, num: '7', title: 'Solving Word Problems with Systems of Equations', outcome: 'RF9',
    blurb: 'Name the two unknowns, turn each fact into an equation, solve by substitution or elimination, and answer in words: numbers and ages, tickets and prices, mixtures — then checking, error analysis and working backwards.',
    questions: QUESTIONS, extra: EXTRA
  });
})(window);
