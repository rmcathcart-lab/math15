/* Math 15 · Unit 7 · Lesson 2 — Slope–Intercept Form: y = mx + b (RF6)
 * Assignment 2 (u7_L02.tex, Questions 1–16) and the Lesson 2 Extra Practice (u7_EP02.tex, Questions 1–19), plus a
 * Mastery challenge (Extra 20).
 * Every part is a generator: same structure, idea and difficulty as the booklet question (the booklet's numbers are among
 * the possible values), new numbers from the seed. Model: Math 10C u7l1.js (reading m and b, hidden coefficients,
 * rearranging, equation from m and b) — its slope / intercept boxes and diagnoses are copied here.
 * Outcomes: RF6 (slope–intercept form: reading m and b, rearranging, what m and b mean) by default; RF7 for writing an
 * equation from m and b (Extra 6) and for finding b or m from a point (Extra 12(b), (c)).
 * Conversions: "state m and b" -> two boxes; "rearrange, then state m and b" -> three boxes (the equation in
 * slope–intercept form, then m and b; a right line in another form gets a nudge); "does the table match?" -> a Yes/No
 * grid, one row per ordered pair plus the conclusion; "explain / identify / describe" -> multiple choice whose options
 * are reasons; matching -> a grid; "compare the pair" -> a grid (steeper / crosses higher: first line, second line, same).
 * No calculator: integer and simple-fraction arithmetic only.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: the Mastery challenge (Extra 20: find two unknown coefficients
 * from a parallel line and an intercept); Extra 11(d) and 3(a) are Advancing. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, LN = HW.lines;

  HW.addCodes({
    'mb-swap': 'Slope and y-intercept swapped', 'mb-order': 'Read m and b in left-to-right order', 'not-divided': 'Did not divide every term by the coefficient of y',
    'hidden-1': 'Missed the hidden coefficient 1 (or −1)', 'h-slope': 'Horizontal line: gave the constant as the slope', 'b-zero': 'b = 0 not recognised',
    'si-swap': 'Swapped m and b in y = mx + b', 'si-zero-b': 'Dropped the x-term when b = 0', 'move-sign': 'Sign error moving a term across', 'part-div': 'Divided only some terms',
    'no-dist': 'Did not distribute', 'icpt-axis': 'Intercept written as a point on the wrong axis', 'icpt-none': 'Said there is no intercept', 'icpt-has': 'Gave a value where there is no intercept',
    'fee-wrong': 'Fee and rate mixed up', 'u7l2-tab-row': 'Table check: one ordered pair judged wrongly', 'u7l2-tab-all': 'Table check: wrong conclusion about the whole table',
    'u7l2-ctx-sum': 'Added the rate and the fee', 'u7l2-ctx-rate': 'Multiplied the fee by the hours', 'u7l2-ctx-nofee': 'Left out the fixed fee',
    'u7l2-steep-sign': 'Steeper: compared signed slopes instead of sizes', 'u7l2-steep-raw': 'Steeper: did not rearrange first', 'u7l2-match': 'Matching: description paired with the wrong equation',
    'u7l2-par-raw': 'Parallel: used a coefficient before solving for y', 'u7l2-par-half': 'Parallel: forgot to divide by the coefficient of y', 'u7l2-par-sign': 'Parallel: sign of the slope',
    'u7l2-pt-solve': 'Solving for b or m: arithmetic slip', 'u7l2-pt-swap': 'Substituted the point the wrong way round', 'u7l2-change': 'Wrong description of how the line moves',
    'u7l2-mb-sum-sign': 'm + b: sign slip', 'u7l2-mb-raw': 'm + b from the coefficients before rearranging', 'u7l2-mas-c': 'Intercept: forgot to divide by the coefficient of y', 'u7l2-mas-k': 'k: used the slope without multiplying by the coefficient of y'
  });
  HW.addPartial({ 'u7l2-tab-row': 's', 'u7l2-tab-all': 'b', 'u7l2-ctx-sum': 'n', 'u7l2-ctx-rate': 'n', 'u7l2-ctx-nofee': 'b', 'u7l2-steep-sign': 'b', 'u7l2-steep-raw': 'b', 'u7l2-match': 's',
    'u7l2-par-raw': 'b', 'u7l2-par-half': 'b', 'u7l2-par-sign': 's', 'u7l2-pt-solve': 's', 'u7l2-pt-swap': 'n', 'u7l2-change': 'n', 'u7l2-mb-sum-sign': 's', 'u7l2-mb-raw': 'n', 'u7l2-mas-c': 'b', 'u7l2-mas-k': 'b' });

  /* ---------------- numbers and LaTeX ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a || 1; }
  function Q(p, q) { if (Array.isArray(p)) { q = p[1]; p = p[0]; } q = q == null ? 1 : q; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q); return [p / g, q / g]; }
  function qv(f) { return Array.isArray(f) ? f[0] / f[1] : f; }
  function qT(f) { if (!Array.isArray(f)) return nT(f); f = Q(f); return f[1] === 1 ? String(f[0]) : (f[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(f[0]) + '}{' + f[1] + '}'; }
  function qneg(a) { a = Q(a); return [-a[0], a[1]]; }
  function qmul(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[0], a[1] * b[1]); }
  function qadd(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }
  function nT(x) { return String(Math.round(x * 1e6) / 1e6); }
  function ptT(p) { return '(' + qT(p[0]) + ',\\ ' + qT(p[1]) + ')'; }
  function term(c, v, first) {
    var neg, mag;
    if (Array.isArray(c)) { c = Q(c); if (c[0] === 0) return ''; neg = c[0] < 0; var ab = Math.abs(c[0]); mag = c[1] === 1 ? (ab === 1 && v ? '' : String(ab)) : '\\frac{' + ab + '}{' + c[1] + '}'; }
    else { if (c === 0) return ''; neg = c < 0; var a = Math.abs(c); mag = a === 1 && v ? '' : nT(a); }
    return (neg ? '-' : first ? '' : '+') + mag + v;
  }
  function lin(ts) { var o = ''; ts.forEach(function (x) { o += term(x[0], x[1], o === ''); }); return o || '0'; }
  function siT(m, b, X, Y) { return (Y || 'y') + '=' + lin([[m, X || 'x'], [b, '']]); }
  /* general-ish form "Ax + By = C" */
  function axbyc(A, Bc, C, X, Y) { return lin([[A, X || 'x'], [Bc, Y || 'y']]) + '=' + C; }
  function rng(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nz(a, b) { return rng(a, b).filter(function (x) { return x !== 0; }); }
  function cop(a, b) { return gcd(a, b) === 1; }
  function distinct(opts) { var seen = {}; opts.forEach(function (o) { if (seen[o.html]) throw new Error('duplicate MC option ' + o.html); seen[o.html] = 1; }); return opts; }
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, distinct(opts), sol, hints, text, keepOrder); }
  function pickWhere(gen, okf) { for (var i = 0; i < 500; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('pickWhere: no value'); }
  function sgn(x) { return x < 0 ? '-' : '+'; }
  function dl(list, ans) { var L2 = (list || []).filter(function (d) { return d && isFinite(qv(d[0])) && !near(qv(d[0]), ans); }); return function (v) { for (var i = 0; i < L2.length; i++) if (near(v, qv(L2[i][0]))) return { code: L2[i][1], hint: L2[i][2] }; return null; }; }
  function numPart(prompt, ans, list, sol, hints, text, inp) {
    var p = B.number(prompt, ans, dl(list, ans), sol, hints, text, inp);
    p.answer = (inp && inp.before ? inp.before + ' ' : '') + t(nT(ans)) + (inp && inp.after ? ' ' + inp.after : '');
    p.bad = (list || []).filter(function (d) { return d && !near(qv(d[0]), ans); }).map(function (d) { return nT(qv(d[0])); });
    return p;
  }
  function valPart(prompt, ans, list, sol, hints, text, inp) { // a value that may be a fraction
    var p = B.math(prompt, K.value(ans, { only: 'fraction', diag: dl(list, qv(ans)) }), qT(ans), sol, hints, text, Object.assign({ keys: 'fraction' }, inp || {}));
    p.bad = (list || []).filter(function (d) { return d && !near(qv(d[0]), qv(ans)); }).map(function (d) { return qT(d[0]); });
    if (inp && inp.before === '$') { p.key = nT(qv(ans)); p.answer = '$' + qv(ans).toFixed(2); p.good = [qT(ans)]; }
    return p;
  }

  /* ---------------- slope / intercept boxes (from Math 10C u7l1) ---------------- */
  function cleanS(s) { return String(s == null ? '' : s).replace(/\\left|\\right/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\[,;:! ]|~/g, ' ').trim(); }
  function isNone(s) { return /^(\\text\{\s*none\s*\}|\\mathrm\{\s*none\s*\}|none|no\s*y-?intercept)$/i.test(String(s).trim()); }
  function asPoint(s) {
    var m = /^\((.+),(.+)\)$/.exec(cleanS(s).replace(/\s+/g, '')); if (!m) return null;
    var a = ex.parse(m[1]), b = ex.parse(m[2]); if (!a.ok || !b.ok) return null;
    var va = ex.value(a.ast), vb = ex.value(b.ast); if (!isFinite(va) || !isFinite(vb)) return null;
    return [va, vb, m[1], m[2]];
  }
  function dg(list, T) {
    var Tv = T == null ? null : qv(T);
    var L2 = (list || []).filter(function (d) { return d && d[0] != null && isFinite(qv(d[0])) && (Tv == null || !near(qv(d[0]), Tv)); });
    return function (v) { for (var i = 0; i < L2.length; i++) if (near(v, qv(L2[i][0]))) return { code: L2[i][1], hint: L2[i][2] }; return null; };
  }
  function slopeC(m, list) { return K.slope(Q(m), { diag: dg(list, m), signHint: 'Check the sign: once the equation reads ' + t('y=mx+b') + ', the slope is the number multiplying ' + t('x') + ' <b>with the sign in front of it</b>.' }); }
  function valC(T, list, o) {
    o = o || {};
    var d = dg(list, T), base = K.value(T, { only: 'fraction', diag: d });
    return function (resp) {
      var s = cleanS(resp);
      if (!s) return form('empty', 'Type your answer first.');
      if (isNone(s)) return wrong('icpt-none', 'There is one: every line that isn’t vertical crosses the ' + t('y') + '-axis.');
      var p = asPoint(s);
      if (p) { if (!near(p[0], 0)) return wrong('icpt-axis', 'A point on the ' + t('y') + '-axis has ' + t('x=0') + ': the ' + t('y') + '-intercept is the point ' + t('(0,\\ b)') + '.'); s = p[3]; }
      return base(s);
    };
  }
  function slopeField(keys) { return { label: 'Slope', name: 'Slope', before: t('m='), mode: 'math', keys: keys || 'fraction' }; }
  function yField(keys) { return { label: t('y') + '-intercept', name: t('y') + '-intercept', before: t('b='), mode: 'math', keys: keys || 'fraction' }; }
  function mbHints() { return ['Get ' + t('y') + ' by itself first: ' + t('y=mx+b') + '. Then ' + t('m') + ' is the number multiplying ' + t('x') + ' and ' + t('b') + ' is the constant term.', 'Keep the sign that is in front of each term.']; }
  function mbPart(prompt, m, b, o, sol, hints, text) {
    o = o || {};
    var swapM = [b, 'mb-swap', 'That’s the ' + t('y') + '-intercept. The slope ' + t('m') + ' is the number multiplying ' + t('x') + ' once the equation reads ' + t('y=mx+b') + '.'];
    var swapB = [m, 'mb-swap', 'That’s the slope. The ' + t('y') + '-intercept ' + t('b') + ' is the constant term once the equation reads ' + t('y=mx+b') + '.'];
    var mC = slopeC(m, (o.mDiag || []).concat([swapM])), bC = valC(b, (o.bDiag || []).concat([swapB]));
    var keys = [qT(m), qT(b)];
    var p = B.fields(prompt, [slopeField(o.keys), yField(o.keys)], [mC, bC], keys, t('m=' + qT(m)) + ', &nbsp;' + t('b=' + qT(b)), sol, hints || mbHints(), text);
    p.good = [[keys[0], '(0,\\ ' + keys[1] + ')']].concat(o.good || []);
    p.bad = !near(qv(m), qv(b)) ? [[keys[1], keys[0]]] : [];
    return p;
  }
  /* rearrange, then state m and b: three boxes */
  function rearrPart(prompt, m, b, o, sol, hints, text) {
    o = o || {};
    var X = 'x', Y = 'y', target = { m: qv(m), b: qv(b) };
    var W = (o.lineWrong || []).filter(function (w) { return !(near(qv(w.m), qv(m)) && near(qv(w.b), qv(b))); }).map(function (w) { return { is: { m: qv(w.m), b: qv(w.b) }, code: w.code, hint: w.hint }; });
    var lc = K.line(target, { form: 'slope-intercept', wrong: W });
    var swapM = [b, 'mb-swap', 'That’s the ' + t('y') + '-intercept. The slope is the number multiplying ' + t('x') + '.'], swapB = [m, 'mb-swap', 'That’s the slope. The ' + t('y') + '-intercept is the constant term.'];
    var mC = slopeC(m, (o.mDiag || []).concat([swapM])), bC = valC(b, (o.bDiag || []).concat([swapB]));
    var f = [{ label: 'Slope–intercept form', name: 'equation', mode: 'math', keys: 'eq', placeholder: 'e.g. y = 2x + 3' }, slopeField('eq'), yField('eq')];
    var keys = [siT(m, b), qT(m), qT(b)];
    var p = B.fields(prompt, f, [lc, mC, bC], keys, t(siT(m, b)) + '; &nbsp;' + t('m=' + qT(m)) + ', &nbsp;' + t('b=' + qT(b)), sol, hints || ['Use inverse operations to get ' + t('y') + ' by itself. Move the ' + t('x') + '-term first (its sign changes), then divide <b>every</b> term by the coefficient of ' + t('y') + '.', 'Write the ' + t('x') + '-term first: ' + t('y=mx+b') + '.'], text);
    p.bad = W.map(function (w) { return [siT(LN.toFr(w.is.m), LN.toFr(w.is.b)), qT(LN.toFr(w.is.m)), qT(LN.toFr(w.is.b))]; });
    if (qv(b) !== 0) p.good = [['y=' + qT(b) + (qv(m) < 0 ? '' : '+') + term(m, 'x', true), qT(m), '(0,\\ ' + qT(b) + ')']];
    return p;
  }
  /* typical wrong lines when rearranging A x + k y = C (y-coefficient k): sign of the moved term, not dividing every term */
  function rearrWrongs(m, b, k) {
    var W = [{ m: qneg(m), b: b, code: 'move-sign', hint: 'When the ' + t('x') + '-term moves to the other side, its sign changes.' }];
    if (k !== 1 && k !== -1) {
      W.push({ m: qmul(m, k), b: qmul(b, k), code: 'not-divided', hint: t('y') + ' isn’t alone yet: divide <b>every</b> term by ' + t(k) + '.' });
      W.push({ m: qmul(m, k), b: b, code: 'part-div', hint: 'Divide <b>every</b> term by ' + t(k) + ' — including the ' + t('x') + '-term.' });
      W.push({ m: m, b: qmul(b, k), code: 'part-div', hint: 'Divide <b>every</b> term by ' + t(k) + ' — including the constant.' });
    }
    if (k === -1) W.push({ m: qneg(m), b: qneg(b), code: 'move-sign', hint: 'Dividing by ' + t('-1') + ' changes the sign of <b>every</b> term.' });
    return W;
  }
  function mbDiagsFor(m, b, k) {
    var md = [[qneg(m), 'move-sign', 'Check the sign: moving the ' + t('x') + '-term to the other side changes its sign.']], bd = [];
    if (k !== 1 && k !== -1) { md.push([qmul(m, k), 'not-divided', 'Divide by ' + t(k) + ' first: ' + t('y') + ' must be alone.']); bd.push([qmul(b, k), 'not-divided', 'Divide <b>every</b> term by ' + t(k) + ', including the constant.']); }
    if (k < 0) bd.push([qneg(b), 'move-sign', 'Dividing by a negative changes the sign of every term.']);
    return { mDiag: md, bDiag: bd };
  }

  /* ---------------- equation from m and b ---------------- */
  function linePart(prompt, m, b, wr, sol, hints, text, o) {
    o = o || {};
    var vars = o.vars || ['x', 'y'], target = { m: qv(m), b: qv(b) };
    var W = (wr || []).filter(function (w) { return w && !(near(qv(w.m), qv(m)) && near(qv(w.b), qv(b))); }).map(function (w) { return { is: { m: qv(w.m), b: qv(w.b) }, code: w.code, hint: w.hint }; });
    var p = B.line(prompt, target, { form: o.form || 'slope-intercept', vars: vars, wrong: W, keyTex: siT(m, b, vars[0], vars[1]) }, sol, hints, text);
    p.answer = t(siT(m, b, vars[0], vars[1]));
    p.bad = W.map(function (w) { return siT(LN.toFr(w.is.m), LN.toFr(w.is.b), vars[0], vars[1]); });
    p.good = qv(b) !== 0 && qv(m) !== 0 ? [vars[1] + '=' + qT(b) + (qv(m) < 0 ? '' : '+') + term(m, vars[0], true)] : [];
    return p;
  }

  /* ---------------- shared generators ---------------- */
  /* x + y = c type rearrangements: { eq, m, b, k, sol } */
  function rq(kind, r) {
    var a, c, k, eq, m, b, sol;
    if (kind === 'x+y') { c = r.pick(nz(-9, 12)); eq = 'x+y=' + c; m = -1; b = c; k = 1; sol = t('y=' + c + '-x') + ', so ' + t(siT(-1, c)) + '.'; }
    else if (kind === 'ax+y') { a = r.int(2, 9); c = r.pick(nz(-9, 9)); eq = a + 'x+y=' + c; m = -a; b = c; k = 1; sol = 'Subtract ' + t(a + 'x') + ' from both sides: ' + t('y=' + c + '-' + a + 'x') + ', so ' + t(siT(-a, c)) + '.'; }
    else if (kind === '-ax+y') { a = r.int(2, 9); c = r.pick(nz(-9, 9)); eq = '-' + a + 'x+y=' + c; m = a; b = c; k = 1; sol = 'Add ' + t(a + 'x') + ' to both sides: ' + t('y=' + c + '+' + a + 'x') + ', so ' + t(siT(a, c)) + '.'; }
    else if (kind === 'ky=') { k = r.pick([2, 3, 4, 5]); a = r.pick(nz(-6, 6)); c = r.pick(nz(-6, 6)); eq = k + 'y=' + lin([[k * a, 'x'], [k * c, '']]); m = a; b = c; sol = 'Divide every term by ' + t(k) + ': ' + t(siT(a, c)) + '.'; }
    else if (kind === 'kx+ky') { k = r.pick([2, 3, 4, 5]); c = r.pick(nz(-9, 9)); a = r.pick([1, 1, -1]); eq = lin([[k * a, 'x'], [k, 'y']]) + '=' + k * c; m = -a; b = c; sol = 'Subtract ' + t(term(k * a, 'x', true)) + ': ' + t(k + 'y=' + lin([[-k * a, 'x'], [k * c, '']])) + '. Divide every term by ' + t(k) + ': ' + t(siT(-a, c)) + '.'; }
    else { k = r.pick([2, 3, 4]); a = r.pick([2, 3, 4, 5]); c = r.pick(nz(-7, 9)); eq = lin([[k * a, 'x'], [k, 'y']]) + '=' + k * c; m = -a; b = c; sol = 'Subtract ' + t(k * a + 'x') + ': ' + t(k + 'y=' + lin([[-k * a, 'x'], [k * c, '']])) + '. Divide every term by ' + t(k) + ': ' + t(siT(-a, c)) + '.'; }
    return { eq: eq, m: m, b: b, k: k, sol: sol };
  }
  function rqPart(id, kind, lev, num) {
    return { id: id, level: lev, make: function (r) {
      var g = rq(kind, r), dd = mbDiagsFor(g.m, g.b, g.k);
      return rearrPart(t(g.eq), g.m, g.b, { lineWrong: rearrWrongs(g.m, g.b, g.k), mDiag: dd.mDiag, bDiag: dd.bDiag }, g.sol + '<br>' + t('m=' + qT(g.m)) + ', ' + t('b=' + qT(g.b)) + '.', null, 'rearrange ' + kind);
    } };
  }
  /* context: cost = F + r h */
  var JOBS = [['A moving company', 'hours worked', 'h', 'hour'], ['A landscaping company', 'hours worked', 'h', 'hour'], ['A plumber', 'hours on the job', 'h', 'hour'], ['A bike rental shop', 'hours rented', 'h', 'hour'], ['A tutoring service', 'sessions booked', 's', 'session'], ['A party-hall rental', 'guests', 'g', 'guest']];
  function ctxShared(r) { var J = r.pick(JOBS); return pickWhere(function () { return { J: J, F: r.pick([20, 25, 30, 35, 40, 45, 50, 60, 75]), R: r.pick([10, 12, 15, 20, 25, 30, 40]), H: r.int(3, 9) }; }, function (o) { return o.F !== o.R; }); }

  HW.defineLesson({
    id: 'u7l2', unit: 7, num: '2', title: 'Slope–Intercept Form: y = mx + b', outcome: 'RF6',
    blurb: 'Read the slope m and the y-intercept b from y = mx + b, rearrange an equation into that form first when needed, and interpret m and b in a situation.',
    questions: [
      /* ================= Part A ================= */
      { num: '1', section: 'Part A — Reading m and b Directly', stem: 'State the slope ' + t('m') + ' and the ' + t('y') + '-intercept ' + t('b') + ' of the equation.', parts: [
        { id: '1', level: 'BEG', make: function (r) {
          var a = r.int(2, 9), c = r.pick(nz(-9, 9)), eq = siT(a, c);
          return mbPart(t(eq), a, c, {}, 'It is already ' + t('y=mx+b') + ': ' + t('m=' + a) + ', ' + t('b=' + c) + '.', null, 'm b of ' + eq);
        } }] },
      { num: '2', stem: 'State the slope ' + t('m') + ' and the ' + t('y') + '-intercept ' + t('b') + ' of the equation.', parts: [
        { id: '2', level: 'BEG', make: function (r) {
          var a = r.int(2, 9), c = r.pick(nz(-9, 9)), eq = siT(-a, c);
          return mbPart(t(eq), -a, c, { mDiag: [[a, 'sign', 'Keep the sign in front of the ' + t('x') + '-term: ' + t('m=-' + a) + '.']] }, t('m=-' + a) + ' (the sign belongs to the slope), ' + t('b=' + c) + '.', null, 'm b of ' + eq);
        } }] },
      { num: '3', stem: 'State the slope ' + t('m') + ' and the ' + t('y') + '-intercept ' + t('b') + ' of the equation.', parts: [
        { id: '3', level: 'BEG', make: function (r) {
          var c = r.pick(nz(-9, 9)), rev = r.chance(0.3), eq = rev ? 'y=' + c + '+x' : siT(1, c);
          return mbPart(t(eq), 1, c, { mDiag: [[0, 'hidden-1', 'A bare ' + t('x') + ' means ' + t('1x') + ': the slope is ' + t('1') + '.']] }, (rev ? 'Reorder: ' + t(siT(1, c)) + '. ' : '') + t('x') + ' means ' + t('1x') + ', so ' + t('m=1') + ' and ' + t('b=' + c) + '.', ['A bare ' + t('x') + ' has a hidden coefficient.', 'The constant, with its sign, is ' + t('b') + '.'], 'm b of y = x + c');
        } }] },
      { num: '4', stem: 'State the slope ' + t('m') + ' and the ' + t('y') + '-intercept ' + t('b') + ' of the equation.', parts: [
        { id: '4', level: 'BEG', make: function (r) {
          var c = r.pick(nz(-9, 9)), rev = r.chance(0.3) && c > 0, eq = rev ? 'y=' + c + '-x' : siT(-1, c);
          return mbPart(t(eq), -1, c, { mDiag: [[0, 'hidden-1', t('-x') + ' means ' + t('-1x') + ': the slope is ' + t('-1') + '.'], [1, 'hidden-1', t('-x') + ' means ' + t('-1x') + ': keep the minus sign.']] }, (rev ? 'Reorder: ' + t(siT(-1, c)) + '. ' : '') + t('-x') + ' means ' + t('-1x') + ', so ' + t('m=-1') + ' and ' + t('b=' + c) + '.', [t('-x') + ' has a hidden coefficient.', 'The constant, with its sign, is ' + t('b') + '.'], 'm b of y = -x + c');
        } }] },
      { num: '5', stem: 'State the slope ' + t('m') + ' and the ' + t('y') + '-intercept ' + t('b') + ' of the equation.', parts: [
        { id: '5', level: 'BEG', make: function (r) {
          var k = r.pick(nz(-12, 12).filter(function (v) { return Math.abs(v) > 1; })), eq = 'y=' + k + 'x';
          return mbPart(t(eq), k, 0, {}, t(eq) + ' is ' + t(eq + '+0') + ': ' + t('m=' + k) + ', ' + t('b=0') + ' (the line passes through the origin).', ['There is no constant term: what is ' + t('b') + '?'], 'm b of y = kx');
        } }] },
      { num: '6', stem: 'State the slope ' + t('m') + ' and the ' + t('y') + '-intercept ' + t('b') + ' of the equation.', parts: [
        { id: '6', level: 'EMG', make: function (r) {
          var k = r.pick(nz(-12, 12)), eq = 'y=' + k;
          return mbPart(t(eq), 0, k, { mDiag: [[k, 'h-slope', t(eq) + ' is ' + t('y=0x' + (k < 0 ? '' : '+') + k) + ': ' + t(k) + ' is ' + t('b') + '. With no ' + t('x') + '-term, the slope is ' + t('0') + '.']] },
            t(eq) + ' is ' + t('y=0x' + (k < 0 ? '' : '+') + k) + ': ' + t('m=0') + ', ' + t('b=' + k) + ' — a horizontal line.', ['There is no ' + t('x') + '-term: what is the coefficient of ' + t('x') + '?'], 'm b of y = k');
        } }] },
      /* ================= Part B ================= */
      { num: '7', section: 'Part B — Rearranging Into y = mx + b', stem: 'Rearrange the equation into slope–intercept form, then state ' + t('m') + ' and ' + t('b') + '.', parts: [rqPart('7', 'x+y', 'EMG')] },
      { num: '8', stem: 'Rearrange the equation into slope–intercept form, then state ' + t('m') + ' and ' + t('b') + '.', parts: [rqPart('8', 'ax+y', 'EMG')] },
      { num: '9', stem: 'Rearrange the equation into slope–intercept form, then state ' + t('m') + ' and ' + t('b') + '.', parts: [rqPart('9', '-ax+y', 'EMG')] },
      { num: '10', stem: 'Rearrange the equation into slope–intercept form, then state ' + t('m') + ' and ' + t('b') + '.', parts: [rqPart('10', 'ky=', 'PRG')] },
      { num: '11', stem: 'Rearrange the equation into slope–intercept form, then state ' + t('m') + ' and ' + t('b') + '.', parts: [rqPart('11', 'kx+ky', 'PRG')] },
      { num: '12', stem: 'Rearrange the equation into slope–intercept form, then state ' + t('m') + ' and ' + t('b') + '.', parts: [rqPart('12', 'kax+ky', 'PRG')] },
      /* ================= Part C ================= */
      { num: '13', section: 'Part C — Tables, Applications and Reasoning', parts: [tabPart('13', 'BEG', false)] },
      { num: '14', parts: [tabPart('14', 'EMG', true)] },
      { num: '15', shared: ctxShared, stem: function (s) { return s.J[0] + ' charges ' + t('\\text{cost}=' + s.F + '+' + s.R + s.J[2]) + ', where ' + t(s.J[2]) + ' is the number of ' + s.J[1] + ' and the cost is in dollars.'; }, parts: [
        { id: '15a', level: 'BEG', make: function (r, s) {
          var u = s.J[3];
          return mc(r, '(a) Identify the starting cost ' + t('(b)') + ' and what it represents.', [
            { html: t('b=' + s.F) + ': the flat fee charged before any ' + s.J[1] + ' — the cost when ' + t(s.J[2] + '=0') + '.', right: true },
            { html: t('b=' + s.R) + ': the flat fee charged before any ' + s.J[1] + '.', code: 'mb-swap', why: t(s.R) + ' multiplies ' + t(s.J[2]) + ' — it is the cost per ' + u + '. The number added on its own is ' + t('b') + '.' },
            { html: t('b=' + s.F) + ': the extra cost for each ' + u + '.', code: 'fee-wrong', why: 'The cost per ' + u + ' is the number multiplying ' + t(s.J[2]) + '. ' + t(s.F) + ' is charged once, no matter how many.' },
            { html: t('b=' + (s.F + s.R)) + ': the cost of the first ' + u + '.', code: 'u7l2-ctx-sum', why: t('b') + ' is the cost when ' + t(s.J[2] + '=0') + ': just the ' + t(s.F) + '.' }],
            'Written as ' + t('\\text{cost}=' + s.R + s.J[2] + '+' + s.F) + ', the constant is ' + t('b=' + s.F) + ': the cost when ' + t(s.J[2] + '=0') + ' — a flat starting fee.', ['Rewrite it as ' + t('y=mx+b') + ': which number is added on its own?'], 'context b');
        } },
        { id: '15b', level: 'BEG', make: function (r, s) {
          var u = s.J[3];
          return mc(r, '(b) Identify the cost per ' + u + ' ' + t('(m)') + ' and what it represents.', [
            { html: t('m=' + s.R) + ': the extra cost for each additional ' + u + '.', right: true },
            { html: t('m=' + s.F) + ': the extra cost for each additional ' + u + '.', code: 'mb-swap', why: t(s.F) + ' is added once — it is ' + t('b') + '. The slope multiplies ' + t(s.J[2]) + '.' },
            { html: t('m=' + s.R) + ': the total cost of the job.', code: 'fee-wrong', why: 'The total depends on ' + t(s.J[2]) + '. ' + t(s.R) + ' is how much each ' + u + ' adds.' },
            { html: t('m=' + s.R + s.J[2]) + ': the cost of all the ' + s.J[1] + '.', code: 'fee-wrong', why: 'The slope is the number multiplying ' + t(s.J[2]) + ', not the whole term.' }],
            t('m=' + s.R) + ', the coefficient of ' + t(s.J[2]) + ': every extra ' + u + ' adds ' + t(s.R) + ' dollars. It is the rate of change of the cost.', ['The slope is the number multiplying the variable.'], 'context m');
        } },
        { id: '15c', level: 'EMG', make: function (r, s) {
          var tot = s.F + s.R * s.H;
          return numPart('(c) Determine the total cost for ' + t(s.H) + ' ' + s.J[1] + '.', tot, [[s.F * s.H + s.R, 'u7l2-ctx-rate', 'The ' + t(s.R) + ' is the one that multiplies ' + t(s.J[2]) + '; the ' + t(s.F) + ' is added once.'], [s.R * s.H, 'u7l2-ctx-nofee', 'Add the flat fee of ' + t(s.F) + ' dollars.'], [s.F + s.R + s.H, 'u7l2-ctx-sum', t(s.R + s.J[2]) + ' means ' + t(s.R + '\\times ' + s.J[2]) + '.']],
            t('\\text{cost}=' + s.F + '+' + s.R + '(' + s.H + ')=' + s.F + '+' + s.R * s.H + '=' + tot) + ' dollars.', ['Substitute ' + t(s.J[2] + '=' + s.H) + ' and multiply first.'], 'context total', { before: '$' });
        } }] },
      { num: '16', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var a = r.int(2, 9), c = r.int(2, 15), eq = a + 'x+y=' + c;
          return mc(r, 'Why must you isolate ' + t('y') + ' before you can read the slope and ' + t('y') + '-intercept from an equation like ' + t(eq) + '?', [
            { html: 'Until ' + t('y') + ' is alone, the numbers you see are not ' + t('m') + ' and ' + t('b') + '. Moving ' + t(a + 'x') + ' across changes its sign: ' + t(siT(-a, c)) + ', so the slope is ' + t(-a) + ', not ' + t(a) + '.', right: true },
            { html: 'You don’t have to: the slope is ' + t(a) + ' and the ' + t('y') + '-intercept is ' + t(c) + '.', why: 'Rearrange it: ' + t(siT(-a, c)) + '. The slope is ' + t(-a) + ' — the sign changed.' },
            { html: 'Because a slope must always be positive.', why: 'Slopes can be negative: here the slope is ' + t(-a) + '.' },
            { html: 'Because the ' + t('y') + '-intercept is always the first number in the equation.', why: t('b') + ' is the constant term once the equation reads ' + t('y=mx+b') + ', wherever it appears.' }],
            t(eq) + ' → ' + t('y=' + c + '-' + a + 'x') + ' → ' + t(siT(-a, c)) + '. Only now can we read ' + t('m=' + (-a)) + ' and ' + t('b=' + c) + '.', ['Rearrange ' + t(eq) + ' and compare the slope with the number you first saw.'], 'why isolate y');
        } }] }
    ],

    extra: [
      /* ================= Part A ================= */
      { num: '1', section: 'Extra practice A — Reading m and b When the Numbers Are Ugly', stem: 'State the slope ' + t('m') + ' and the ' + t('y') + '-intercept ' + t('b') + '. Each equation is already solved for ' + t('y') + ', but the ' + t('x') + '-term is not always written first.', parts: [
        { id: 'e1a', sub: 'a', level: 'BEG', make: function (r) {
          var q = r.pick([3, 4, 5, 7, 8]), p = r.pick(rng(1, q - 1).filter(function (v) { return cop(v, q); })), c = r.pick(nz(-9, 9)), m = [-p, q];
          return mbPart('(a) ' + t(siT(m, c)), m, c, { mDiag: [[[p, q], 'sign', 'Keep the minus sign: ' + t('m=' + qT(m)) + '.']] }, t('m=' + qT(m)) + ', ' + t('b=' + c) + '.', null, 'EP1a');
        } },
        { id: 'e1b', sub: 'b', level: 'EMG', make: function (r) {
          var q = r.pick([2, 3, 4, 5]), p = r.pick(rng(1, 7).filter(function (v) { return cop(v, q) && v !== q; })), c = r.int(2, 12), m = [-p, q];
          return mbPart('(b) ' + t('y=' + c + '-\\frac{' + p + '}{' + q + '}x'), m, c, { mDiag: [[c, 'mb-order', t(c) + ' is the first number, but it doesn’t multiply ' + t('x') + '. Reorder: ' + t(siT(m, c)) + '.']], bDiag: [[m, 'mb-order', 'The number multiplying ' + t('x') + ' is the slope.']] }, 'Reorder: ' + t(siT(m, c)) + '. ' + t('m=' + qT(m)) + ', ' + t('b=' + c) + '.', null, 'EP1b');
        } },
        { id: 'e1c', sub: 'c', level: 'PRG', make: function (r) {
          var d = r.pick([2, 3, 4]), a = r.pick(rng(1, 9).filter(function (v) { return cop(v, d); })), c = d * r.int(1, 5), m = [a, d], b = -c / d;
          return mbPart('(c) ' + t('y=\\dfrac{' + a + 'x-' + c + '}{' + d + '}'), m, b, { mDiag: [[a, 'part-div', 'Split the fraction: <b>both</b> terms on top are divided by ' + t(d) + '.']], bDiag: [[-c, 'part-div', 'Split the fraction: ' + t('\\frac{-' + c + '}{' + d + '}=' + b) + '.']] },
            'Split the fraction: ' + t('y=\\frac{' + a + '}{' + d + '}x-\\frac{' + c + '}{' + d + '}=' + siT(m, b)) + '. ' + t('m=' + qT(m)) + ', ' + t('b=' + b) + '.', ['Divide <b>each</b> term on top by the bottom number.'], 'EP1c');
        } },
        { id: 'e1d', sub: 'd', level: 'BEG', make: function (r) {
          var k = r.pick([-1, -1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -6, 6, -7, 7, -8, 8, -9, 9, -10, 10, -11, 11, -12]), eq = k === -1 ? 'y=-x' : k === 1 ? 'y=x' : 'y=' + k + 'x';
          return mbPart('(d) ' + t(eq), k, 0, { mDiag: Math.abs(k) === 1 ? [[0, 'hidden-1', 'A bare ' + t('x') + ' has coefficient ' + t(k) + '.']] : [] }, t(eq + '+0') + ': ' + t('m=' + k) + ', ' + t('b=0') + '.', null, 'EP1d');
        } },
        { id: 'e1e', sub: 'e', level: 'EMG', make: function (r) {
          var m = r.pick([0.2, 0.4, 0.6, 0.8, 1.2, 1.5, 2.5, 0.5]), c = r.pick([-1.5, -2.5, -0.5, 1.5, 3.5, -4.5, 0.25, -0.75]);
          var p = mbPart('(e) ' + t('y=' + m + 'x' + (c < 0 ? '' : '+') + c) + ' &nbsp;(decimals or fractions are both fine)', LN.toFr(m), LN.toFr(c), {}, t('m=' + m) + ', ' + t('b=' + c) + '. Decimals are fine: the slope and intercept can be any real numbers.', null, 'EP1e');
          p.good = [[p.key[0], p.key[1]]]; p.key = [String(m), String(c)]; p.answer = t('m=' + m) + ', &nbsp;' + t('b=' + c);
          return p;
        } },
        { id: 'e1f', sub: 'f', level: 'PRG', make: function (r) {
          var d = r.pick([4, 5, 6, 7, 8]), q = r.pick([3, 5, 7, 2, 9].filter(function (v) { return v !== d; })), p = r.pick(rng(1, q - 1).filter(function (v) { return cop(v, q); })), m = [-1, d], b = [p, q];
          return mbPart('(f) ' + t('y=\\frac{' + p + '}{' + q + '}-\\frac{x}{' + d + '}'), m, b, { mDiag: [[[1, d], 'sign', 'Keep the minus sign: ' + t('-\\frac{x}{' + d + '}=-\\frac{1}{' + d + '}x') + '.'], [-1, 'part-div', t('\\frac{x}{' + d + '}') + ' means ' + t('\\frac{1}{' + d + '}x') + '.']] },
            t('-\\frac{x}{' + d + '}=-\\frac{1}{' + d + '}x') + ', so ' + t(siT(m, b)) + ': ' + t('m=' + qT(m)) + ', ' + t('b=' + qT(b)) + '.', [t('\\frac{x}{' + d + '}') + ' is ' + t('\\frac{1}{' + d + '}') + ' of ' + t('x') + '.', 'Reorder so the ' + t('x') + '-term is first.'], 'EP1f');
        } }] },
      /* ================= Part B ================= */
      { num: '2', section: 'Extra practice B — Rearrange First, Then Read', stem: 'Rearrange each equation into slope–intercept form, then state ' + t('m') + ' and ' + t('b') + '. Remember to divide <b>every</b> term by the coefficient of ' + t('y') + '.', parts: (function () {
        function P(id, lev, gen) { return { id: id, sub: id.slice(2), level: lev, make: function (r) { var g = gen(r), dd = mbDiagsFor(g.m, g.b, g.k); return rearrPart('(' + id.slice(2) + ') ' + t(g.eq), g.m, g.b, { lineWrong: rearrWrongs(g.m, g.b, g.k), mDiag: dd.mDiag, bDiag: dd.bDiag }, g.sol + '<br>' + t('m=' + qT(g.m)) + ', ' + t('b=' + qT(g.b)) + '.', null, 'EP2' + id); } }; }
        return [
          P('e2a', 'EMG', function (r) { var k = r.pick([2, 3, 4]), a = r.pick(nz(-5, 5)), c = r.pick(nz(-5, 5)); return { eq: k + 'y=' + lin([[k * a, 'x'], [k * c, '']]), m: a, b: c, k: k, sol: 'Divide every term by ' + t(k) + ': ' + t(siT(a, c)) + '.' }; }),
          P('e2b', 'EMG', function (r) { var g = rq('ax+y', r); return g; }),
          P('e2c', 'EMG', function (r) { var c = r.pick(nz(-9, 9)), a = r.pick(nz(-6, 6)); return { eq: 'y' + (c < 0 ? '+' + (-c) : '-' + c) + '=' + term(a, 'x', true), m: a, b: c, k: 1, sol: (c > 0 ? 'Add ' + t(c) : 'Subtract ' + t(-c)) + ' on both sides: ' + t(siT(a, c)) + '.' }; }),
          P('e2d', 'PRG', function (r) { var o = pickWhere(function () { return { A: r.pick([3, 5, 7, 1]), k: 2, C: 2 * r.pick(nz(-6, 6)) }; }, function () { return true; }); return { eq: axbyc(o.A, -o.k, o.C), m: [o.A, o.k], b: -o.C / o.k, k: -o.k, sol: 'Subtract ' + t(term(o.A, 'x', true)) + ': ' + t('-' + o.k + 'y=' + lin([[-o.A, 'x'], [o.C, '']])) + '. Divide every term by ' + t('-' + o.k) + ': ' + t(siT([o.A, o.k], -o.C / o.k)) + '.' }; }),
          P('e2e', 'PRG', function (r) { var A = r.pick([1, 2, 3, 5, -1, -2, -3]), k = r.pick([2, 3, 4, 5, 6].filter(function (v) { return cop(v, A); })), m = [-A, k]; return { eq: axbyc(A, k, 0), m: m, b: 0, k: k, sol: 'Subtract ' + t(term(A, 'x', true)) + ': ' + t(k + 'y=' + term(-A, 'x', true)) + '. Divide by ' + t(k) + ': ' + t(siT(m, 0)) + ' (so ' + t('b=0') + ').' }; }),
          P('e2f', 'PRG', function (r) { var k = r.pick([2, 3, 4, 5]), c = r.pick(nz(-5, 5)), m = [1, k]; return { eq: '-x+' + k + 'y=' + k * c, m: m, b: c, k: k, sol: 'Add ' + t('x') + ': ' + t(k + 'y=x' + sgn(k * c) + Math.abs(k * c)) + '. Divide every term by ' + t(k) + ': ' + t(siT(m, c)) + '.' }; })];
      })() },
      { num: '3', stem: 'Rearrange into slope–intercept form and state ' + t('m') + ' and ' + t('b') + '. These take more than one step, and some have a fractional slope or intercept.', parts: (function () {
        function P(id, lev, gen) { return { id: id, sub: id.slice(2), level: lev, make: function (r) { var g = gen(r), dd = mbDiagsFor(g.m, g.b, g.k); if (g.extraM) dd.mDiag = dd.mDiag.concat(g.extraM); if (g.extraB) dd.bDiag = dd.bDiag.concat(g.extraB); return rearrPart('(' + id.slice(2) + ') ' + t(g.eq), g.m, g.b, { lineWrong: rearrWrongs(g.m, g.b, g.k).concat(g.extraW || []), mDiag: dd.mDiag, bDiag: dd.bDiag }, g.sol + '<br>' + t('m=' + qT(g.m)) + ', ' + t('b=' + qT(g.b)) + '.', null, 'EP3' + id); } }; }
        return [
          P('e3a', 'ADV', function (r) { var o = pickWhere(function () { return { A: r.pick([2, 6, 10, 14, 4]), k: 4, C: r.pick([2, 6, 10, -2, -6, 14]) }; }, function (o) { return gcd(o.A, o.k) === 2 && gcd(o.C, o.k) === 2; }); var m = Q(o.A, o.k), b = Q(-o.C, o.k); return { eq: axbyc(o.A, -o.k, o.C), m: m, b: b, k: -o.k, sol: 'Subtract ' + t(o.A + 'x') + ': ' + t('-' + o.k + 'y=' + lin([[-o.A, 'x'], [o.C, '']])) + '. Divide every term by ' + t('-' + o.k) + ': ' + t('y=\\frac{' + o.A + '}{' + o.k + '}x' + (o.C > 0 ? '-' : '+') + '\\frac{' + Math.abs(o.C) + '}{' + o.k + '}') + ', which simplifies to ' + t(siT(m, b)) + '.' }; }),
          P('e3b', 'PRG', function (r) { var k = r.pick([2, 3]), c = r.int(1, 6), a = r.pick(nz(-5, 6)); return { eq: k + '(y-' + c + ')=' + term(k * a, 'x', true), m: a, b: c, k: k, extraW: [{ m: a, b: c * k, code: 'no-dist', hint: 'Divide both sides by ' + t(k) + ' (or expand): ' + t('y-' + c + '=' + term(a, 'x', true)) + ', then add ' + t(c) + '.' }, { m: a, b: -c, code: 'move-sign', hint: 'From ' + t('y-' + c + '=' + term(a, 'x', true)) + ', <b>add</b> ' + t(c) + ' to both sides.' }], extraB: [[-c, 'move-sign', 'Undo “' + t('-' + c) + '” by adding ' + t(c) + '.']], sol: 'Divide both sides by ' + t(k) + ': ' + t('y-' + c + '=' + term(a, 'x', true)) + '. Add ' + t(c) + ': ' + t(siT(a, c)) + '.' }; }),
          P('e3c', 'PRG', function (r) { var d = r.pick([2, 3, 4]), a = r.pick(nz(-4, 4)), c = r.pick(nz(-5, 5)); return { eq: '\\frac{y}{' + d + '}=' + lin([[a, 'x'], [c, '']]), m: d * a, b: d * c, k: 1, extraW: [{ m: d * a, b: c, code: 'part-div', hint: 'Multiply <b>every</b> term by ' + t(d) + ', including the constant.' }, { m: a, b: d * c, code: 'part-div', hint: 'Multiply <b>every</b> term by ' + t(d) + ', including the ' + t('x') + '-term.' }], extraM: [[a, 'not-divided', 'Multiply both sides by ' + t(d) + ' first, so ' + t('y') + ' is alone.']], extraB: [[c, 'not-divided', 'Multiply <b>every</b> term by ' + t(d) + '.']], sol: 'Multiply both sides by ' + t(d) + ': ' + t('y=' + d + '(' + lin([[a, 'x'], [c, '']]) + ')=' + siT(d * a, d * c)) + '.' }; }),
          P('e3d', 'PRG', function (r) { var k = r.pick([2, 3, 5]), a = r.pick([1, 2, 3, 4]), c = r.pick(nz(-4, 4)); return { eq: k * c + '-' + k + 'y=' + k * a + 'x', m: -a, b: c, k: -k, sol: 'Subtract ' + t(k * c) + ': ' + t('-' + k + 'y=' + lin([[k * a, 'x'], [-k * c, '']])) + '. Divide every term by ' + t('-' + k) + ': ' + t(siT(-a, c)) + '.' }; })];
      })() },
      /* ================= Part C ================= */
      { num: '4', section: 'Extra practice C — Matching and Comparing Lines', parts: [
        { id: 'e4', level: 'PRG', make: function (r) {
          var a = r.pick([2, 3, 4, 5]), c = r.int(1, 5);
          var E = { A: siT(a, -c), B: siT(-a, c), C: siT([1, a], c), D: 'y=' + (-c), E: siT(a, c) };
          var D = [{ id: 'i', html: '(i) Crosses the ' + t('y') + '-axis at ' + t(ptT([0, c])) + ' and falls ' + t(a) + ' units for every step right.', want: 'B', why: 'Falls ' + t(a) + ' per step: slope ' + t(-a) + '; crosses at ' + t(c) + ': ' + t(E.B) + '.' },
            { id: 'ii', html: '(ii) A horizontal line passing ' + t(c) + ' units below the origin.', want: 'D', why: 'Horizontal means slope ' + t('0') + ': ' + t(E.D) + '.' },
            { id: 'iii', html: '(iii) Rises ' + t(a) + ' units per step right and crosses the ' + t('y') + '-axis <i>below</i> the origin.', want: 'A', why: 'Slope ' + t(a) + ' and a negative intercept: ' + t(E.A) + '.' },
            { id: 'iv', html: '(iv) Rises only ' + t('1') + ' unit for every ' + t(a) + ' units right.', want: 'C', why: 'Rise ' + t('1') + ', run ' + t(a) + ': slope ' + t('\\frac{1}{' + a + '}') + ': ' + t(E.C) + '.' },
            { id: 'v', html: '(v) Exactly as steep as A, but crosses the ' + t('y') + '-axis ' + t(2 * c) + ' units higher.', want: 'E', why: 'Same slope ' + t(a) + ', intercept ' + t('-' + c + '+' + 2 * c + '=' + c) + ': ' + t(E.E) + '.' }];
          var want = {}; D.forEach(function (d) { want[d.id] = d.want; });
          var cols = ['A', 'B', 'C', 'D', 'E'].map(function (k) { return { id: k, html: k + '. ' + t(E[k]) }; });
          return B.grid('Match each description to exactly one equation. Every equation is used once.', D.map(function (d) { return { id: d.id, html: d.html }; }), cols, want, {
            why: function (row) { var d = D.filter(function (x) { return x.id === row; })[0]; return { code: 'u7l2-match', hint: 'Look again at ' + d.html.replace(/^\(([iv]+)\).*/, '($1)') + ': find the slope and the ' + t('y') + '-intercept it describes.' }; } },
            D.map(function (d) { return d.html.replace(/^(\([iv]+\)).*$/, '$1') + ' → <b>' + d.want + '</b>: ' + d.why; }).join('<br>'), ['Turn each description into a slope and a ' + t('y') + '-intercept.', '“Falls” means a negative slope; “below the origin” means a negative ' + t('b') + '.'], 'EP4 matching');
        } }] },
      { num: '5', stem: '<b>Compare the pair.</b> For each pair, decide which line is <b>steeper</b> and which line crosses the ' + t('y') + '-axis <b>higher</b>. Rearrange first where needed.', parts: (function () {
        function cmpPart(id, lev, gen) {
          return { id: id, sub: id.slice(2), level: lev, make: function (r) {
            var g = gen(r), s1 = Math.abs(qv(g.m1)), s2 = Math.abs(qv(g.m2)), steep = s1 > s2 ? 'L1' : 'L2', high = near(qv(g.b1), qv(g.b2)) ? 'S' : qv(g.b1) > qv(g.b2) ? 'L1' : 'L2';
            var rows = [{ id: 'st', html: 'Steeper line' }, { id: 'hi', html: 'Crosses the ' + t('y') + '-axis higher' }];
            var cols = [{ id: 'L1', html: 'First line' }, { id: 'L2', html: 'Second line' }, { id: 'S', html: 'Same' }];
            var sol = (g.pre ? g.pre + '<br>' : '') + 'Slopes ' + t(qT(g.m1)) + ' and ' + t(qT(g.m2)) + ': steepness compares the size, ' + t(nT(s1)) + ' vs ' + t(nT(s2)) + ', so the <b>' + (steep === 'L1' ? 'first' : 'second') + '</b> line is steeper.<br>Intercepts ' + t(qT(g.b1)) + ' and ' + t(qT(g.b2)) + ': ' + (high === 'S' ? 'the <b>same</b> point ' + t(ptT([0, g.b1])) + '.' : 'the <b>' + (high === 'L1' ? 'first' : 'second') + '</b> line crosses higher.');
            return B.grid('(' + id.slice(2) + ') ' + t(g.e1) + ' &nbsp;and&nbsp; ' + t(g.e2), rows, cols, { st: steep, hi: high }, {
              why: function (row, given) {
                if (row === 'st') { if (given === 'S') return { code: 'u7l2-steep-sign', hint: 'The slopes have different sizes, so one line is steeper.' }; var signedBig = qv(g.m1) > qv(g.m2) ? 'L1' : 'L2'; return { code: given === signedBig ? 'u7l2-steep-sign' : g.pre ? 'u7l2-steep-raw' : 'u7l2-steep-sign', hint: given === signedBig ? 'Steepness ignores the sign: compare ' + t('|m|') + ' — how far the line climbs or falls per step.' : 'Compare the sizes of the slopes' + (g.pre ? ' after rearranging into ' + t('y=mx+b') : '') + '.' }; }
                return { code: 'u7l2-steep-raw', hint: 'Compare the two values of ' + t('b') + (g.pre ? ' after rearranging' : '') + ': the larger ' + t('b') + ' crosses higher.' };
              } }, sol, ['Rearrange each into ' + t('y=mx+b') + '. Steeper = larger ' + t('|m|') + ' (ignore the sign).', 'Higher crossing = larger ' + t('b') + '.'], 'EP5' + id);
          } };
        }
        return [
          cmpPart('e5a', 'EMG', function (r) { var o = pickWhere(function () { return { m1: r.pick(nz(-6, 6)), m2: r.pick(nz(-6, 6)), b1: r.int(-5, 5), b2: r.int(-5, 5) }; }, function (o) { return Math.abs(o.m1) !== Math.abs(o.m2) && o.b1 !== o.b2 && o.m1 * o.m2 < 0 && (Math.abs(o.m1) > Math.abs(o.m2)) === (o.m1 < o.m2); }); o.e1 = siT(o.m1, o.b1); o.e2 = siT(o.m2, o.b2); return o; }),
          cmpPart('e5b', 'PRG', function (r) { var o = pickWhere(function () { return { p: r.pick([3, 5, 1]), k: 2, b: r.int(1, 6), q2: r.pick([[-7, 4], [-5, 4], [-9, 4], [-2, 1], [-5, 3], [-7, 3]]) }; }, function (o) { return Math.abs(o.p / 2) !== Math.abs(qv(o.q2)); }); return { m1: [o.p, 2], b1: o.b, m2: o.q2, b2: o.b, e1: '2y=' + lin([[o.p, 'x'], [2 * o.b, '']]), e2: siT(o.q2, o.b), pre: 'Rearrange: ' + t('2y=' + lin([[o.p, 'x'], [2 * o.b, '']])) + ' gives ' + t(siT([o.p, 2], o.b)) + '.' }; }),
          cmpPart('e5c', 'PRG', function (r) { var o = pickWhere(function () { return { m1: r.pick([[2, 3], [1, 2], [1, 3], [3, 5]]), b1: -r.int(3, 6), A: 3, k: 4, c2: r.int(1, 2) }; }, function (o) { return true; }); var m2 = [o.A, o.k], b2 = -o.c2; return { m1: o.m1, b1: o.b1, m2: m2, b2: b2, e1: siT(o.m1, o.b1), e2: axbyc(o.A, -o.k, o.k * o.c2), pre: 'Rearrange: ' + t(axbyc(o.A, -o.k, o.k * o.c2)) + ' → ' + t('-' + o.k + 'y=-' + o.A + 'x+' + o.k * o.c2) + ' → ' + t(siT(m2, b2)) + '.' }; })];
      })() },
      /* ================= Part D ================= */
      { num: '6', section: 'Extra practice D — Writing the Equation', stem: 'Write the equation of the line in the form ' + t('y=mx+b') + '. Watch the special cases.', parts: [
        { id: 'e6a', sub: 'a', level: 'BEG', outcome: 'RF7', make: function (r) { var q = r.pick([3, 4, 5, 7]), p = r.pick(rng(1, q - 1).filter(function (v) { return cop(v, q); })), m = [-p, q], b = r.pick(nz(-9, 9)); return linePart('(a) ' + t('m=' + qT(m)) + ', &nbsp;' + t('b=' + b), m, b, [{ m: b, b: qv(m), code: 'si-swap', hint: 'The slope multiplies ' + t('x') + '; ' + t('b') + ' is the constant.' }], t(siT(m, b)) + '.', ['Substitute into ' + t('y=mx+b') + '. Use the fraction key for ' + t('m') + '.'], 'EP6a'); } },
        { id: 'e6b', sub: 'b', level: 'BEG', outcome: 'RF7', make: function (r) { var m = r.pick(nz(-12, 12).filter(function (v) { return Math.abs(v) > 1; })); var p = linePart('(b) ' + t('m=' + m) + ', &nbsp;' + t('b=0'), m, 0, [{ m: 0, b: m, code: 'si-zero-b', hint: t('b=0') + ' means no constant — but keep the ' + t('x') + '-term: ' + t('y=' + m + 'x') + '.' }], t('y=' + m + 'x+0') + ', which is ' + t('y=' + m + 'x') + '.', ['Substitute and simplify: adding ' + t('0') + ' changes nothing.'], 'EP6b'); p.good = []; p.bad = p.bad.concat(['y=' + m]); return p; } },
        { id: 'e6c', sub: 'c', level: 'EMG', outcome: 'RF7', make: function (r) { var b = r.pick(nz(-12, 12)); var p = linePart('(c) ' + t('m=0') + ', &nbsp;' + t('b=' + b), 0, b, [], t('y=0x' + (b < 0 ? '' : '+') + b) + ', which is ' + t('y=' + b) + ' — a horizontal line.', ['Substitute and simplify: ' + t('0x=0') + '.'], 'EP6c'); p.good = []; p.bad = ['y=' + b + 'x', 'x=' + b]; return p; } },
        { id: 'e6d', sub: 'd', level: 'BEG', outcome: 'RF7', make: function (r) { var q = r.pick([2, 3, 4, 5, 6, 7]), p0 = r.pick(rng(1, q - 1).filter(function (v) { return cop(v, q); })), b = [r.pick([-1, 1]) * p0, q]; return linePart('(d) ' + t('m=1') + ', &nbsp;' + t('b=' + qT(b)), 1, b, [{ m: qv(b), b: 1, code: 'si-swap', hint: 'The slope multiplies ' + t('x') + '; ' + t('b') + ' is the constant.' }], t('y=1x' + (qv(b) < 0 ? '' : '+') + qT(b)) + ', which is ' + t(siT(1, b)) + '.', ['A slope of ' + t('1') + ' is written as just ' + t('x') + '.'], 'EP6d'); } },
        { id: 'e6e', sub: 'e', level: 'BEG', outcome: 'RF7', make: function (r) { var b = r.chance(0.5) ? 0 : r.pick(nz(-10, 10)), p = linePart('(e) ' + t('m=-1') + ', &nbsp;' + t('b=' + b), -1, b, [{ m: 1, b: b, code: 'sign', hint: 'Keep the minus sign: ' + t('-1x=-x') + '.' }], t('y=-1x' + (b ? (b < 0 ? '' : '+') + b : '')) + ', which is ' + t(siT(-1, b)) + '.', ['A slope of ' + t('-1') + ' is written as ' + t('-x') + '.'], 'EP6e'); return p; } },
        { id: 'e6f', sub: 'f', level: 'EMG', outcome: 'RF7', make: function (r) { var q = r.pick([2, 3, 4]), p0 = r.pick(rng(1, 9).filter(function (v) { return cop(v, q) && v !== q; })), m = [r.pick([1, 1, -1]) * p0, q], b = r.pick(nz(-6, 6)); return linePart('(f) Slope ' + t(qT(m)) + ', passing through ' + t(ptT([0, b])), m, b, [{ m: m, b: 0, code: 'line-intercept', hint: t(ptT([0, b])) + ' is on the ' + t('y') + '-axis, so it is the ' + t('y') + '-intercept: ' + t('b=' + b) + '.' }], t(ptT([0, b])) + ' has ' + t('x=0') + ', so it is the ' + t('y') + '-intercept: ' + t('b=' + b) + '. ' + t(siT(m, b)) + '.', ['A point with ' + t('x=0') + ' is on the ' + t('y') + '-axis.'], 'EP6f'); } }] },
      { num: '7', stem: 'What is different about the <b>graph</b> in each special case of Question 6?', parts: [
        { id: 'e7a', sub: 'a', level: 'EMG', make: function (r) {
          var m = r.pick(nz(-12, 12).filter(function (v) { return Math.abs(v) > 1; }));
          return mc(r, '(a) A line with ' + t('b=0') + ', such as ' + t('y=' + m + 'x') + '.', [
            { html: 'It passes through the origin ' + t('(0,\\ 0)') + '.', right: true },
            { html: 'It is a horizontal line.', why: 'Horizontal lines have ' + t('m=0') + '. Here ' + t('m=' + m) + ' but ' + t('b=0') + '.' },
            { html: 'It has no ' + t('y') + '-intercept.', why: 'It does: ' + t('b=0') + ' means it crosses the ' + t('y') + '-axis at ' + t('(0,\\ 0)') + '.' },
            { html: 'It is parallel to the ' + t('x') + '-axis.', why: 'That would need a slope of ' + t('0') + '.' }],
            t('b=0') + ': the line crosses the ' + t('y') + '-axis at ' + t('(0,\\ 0)') + ' — it passes through the origin.', ['Where does a line with ' + t('b=0') + ' cross the ' + t('y') + '-axis?'], 'EP7 b=0');
        } },
        { id: 'e7b', sub: 'b', level: 'EMG', make: function (r) {
          var b = r.pick(nz(-12, 12));
          return mc(r, '(b) A line with ' + t('m=0') + ', such as ' + t('y=' + b) + '.', [
            { html: 'There is no rise at all, so it is a horizontal line through ' + t(ptT([0, b])) + '.', right: true },
            { html: 'It is a vertical line through ' + t(ptT([b, 0])) + '.', why: 'Vertical lines are ' + t('x=k') + '. With ' + t('m=0') + ', ' + t('y') + ' never changes: horizontal.' },
            { html: 'It passes through the origin.', why: 'It crosses the ' + t('y') + '-axis at ' + t(ptT([0, b])) + ', not at ' + t('(0,\\ 0)') + '.' },
            { html: 'It has no slope, so it cannot be graphed.', why: 'A slope of ' + t('0') + ' is a real slope: the line is flat.' }],
            t('m=0') + ': ' + t('y') + ' is ' + t(b) + ' for every ' + t('x') + ' — a horizontal line through ' + t(ptT([0, b])) + '.', ['What does a slope of ' + t('0') + ' mean for the rise?'], 'EP7 m=0');
        } }] },
      /* ================= Part E ================= */
      { num: '8', section: 'Extra practice E — Error Analysis', parts: [
        { id: 'e8', level: 'EMG', make: function (r) {
          var a = r.int(2, 9), c = r.int(2, 12), eq = a + 'x+y=' + c;
          return mc(r, 'Devon looks at ' + t(eq) + ' and writes “' + t('m=' + a) + ' and ' + t('b=' + c) + '.” Exactly one value is correct. Which statement is right?', [
            { html: t('b=' + c) + ' is correct; the slope is ' + t('m=-' + a) + '. Rearranged, ' + t(siT(-a, c)) + ': moving ' + t(a + 'x') + ' across changes its sign. The equation is easy to misread because ' + t('y') + ' was never isolated.', right: true },
            { html: t('m=' + a) + ' is correct; the intercept is ' + t('b=-' + c) + '.', why: 'Rearrange: ' + t(siT(-a, c)) + '. The constant keeps its sign; the ' + t('x') + '-term is the one that changes.' },
            { html: 'Both are correct: the numbers can be read straight off.', why: 'Only once ' + t('y') + ' is alone. ' + t(siT(-a, c)) + ' shows ' + t('m=-' + a) + '.' },
            { html: 'Both are wrong: ' + t('m=-' + a) + ' and ' + t('b=-' + c) + '.', why: 'Only the ' + t('x') + '-term moves across. ' + t('b=' + c) + ' stays.' }],
            t(eq) + ' → ' + t(siT(-a, c)) + '. So ' + t('b=' + c) + ' was right and ' + t('m=-' + a) + ', not ' + t(a) + '.', ['Rearrange into ' + t('y=mx+b') + ' and compare.'], 'EP8 Devon');
        } }] },
      { num: '9', shared: function (r) { return { k: r.pick([2, 3, 4]), a: r.pick([2, 3, 4, 5]), c: r.int(1, 5) }; }, stem: function (s) { return 'Casey rearranges ' + t(s.k + 'y=' + s.k * s.a + 'x-' + s.k * s.c) + ' and writes ' + t('y=' + s.k * s.a + 'x-' + s.c) + '.'; }, parts: [
        { id: 'e9a', sub: 'a', level: 'EMG', make: function (r, s) {
          return mc(r, '(a) What is Casey’s mistake?', [
            { html: 'Casey divided only the constant term by ' + t(s.k) + '. <b>Every</b> term must be divided, including ' + t(s.k * s.a + 'x') + '.', right: true },
            { html: 'Casey should have subtracted ' + t(s.k) + ' instead of dividing.', why: t(s.k + 'y') + ' means ' + t(s.k + '\\times y') + ': undo it by dividing.' },
            { html: 'Casey divided the ' + t('x') + '-term but not the constant.', why: 'Look again: ' + t(s.k * s.a + 'x') + ' is unchanged, but ' + t(s.k * s.c) + ' became ' + t(s.c) + '.' },
            { html: 'There is no mistake.', why: 'Check a point: at ' + t('x=1') + ', the original gives ' + t('y=' + (s.a - s.c)) + ', Casey’s gives ' + t('y=' + (s.k * s.a - s.c)) + '.' }],
            'Casey divided ' + t(s.k * s.c) + ' by ' + t(s.k) + ' but left ' + t(s.k * s.a + 'x') + '. Dividing every term by ' + t(s.k) + ' gives ' + t(siT(s.a, -s.c)) + '.', ['Compare each term of Casey’s answer with the original divided by ' + t(s.k) + '.'], 'EP9 mistake');
        } },
        { id: 'e9b', sub: 'b', level: 'EMG', make: function (r, s) {
          return rearrPart('(b) Give the correct equation, slope and ' + t('y') + '-intercept.', s.a, -s.c, { lineWrong: [{ m: s.k * s.a, b: -s.c, code: 'part-div', hint: 'That is Casey’s answer: divide the ' + t('x') + '-term by ' + t(s.k) + ' too.' }], mDiag: [[s.k * s.a, 'part-div', 'Divide the ' + t('x') + '-coefficient by ' + t(s.k) + ' too.']] },
            t('y=\\frac{' + s.k * s.a + '}{' + s.k + '}x-\\frac{' + s.k * s.c + '}{' + s.k + '}=' + siT(s.a, -s.c)) + ': ' + t('m=' + s.a) + ', ' + t('b=-' + s.c) + '.', null, 'EP9 correct');
        } }] },
      { num: '10', shared: function (r) { var o = pickWhere(function () { return { A: r.pick([3, 5, 7, 1, 9]), C: 2 * r.int(2, 8) }; }, function () { return true; }); return o; },
        stem: function (s) { return 'Sam rearranges ' + t(axbyc(s.A, -2, s.C)) + ' like this:<br>' + t('-2y=-' + (s.A === 1 ? '' : s.A) + 'x+' + s.C) + ', &nbsp;then &nbsp;' + t('y=\\frac{' + s.A + '}{2}x+' + s.C / 2) + '.<br>The slope is right but the ' + t('y') + '-intercept is wrong.'; }, parts: [
        { id: 'e10a', sub: 'a', level: 'PRG', make: function (r, s) {
          return mc(r, '(a) Where does the error happen?', [
            { html: 'In the division by ' + t('-2') + ': the ' + t('+' + s.C) + ' must also change sign, giving ' + t('-' + s.C / 2) + ', not ' + t('+' + s.C / 2) + '.', right: true },
            { html: 'In the first step: ' + t(s.A + 'x') + ' should not change sign when it moves.', why: 'It does change sign, and Sam got the slope right. Look at what happened to ' + t(s.C) + '.' },
            { html: 'In the first step: the ' + t(s.C) + ' should have moved to the left side.', why: 'The constant can stay on the right. The trouble is the division.' },
            { html: 'There is no error: dividing by ' + t('-2') + ' only changes the sign of the ' + t('x') + '-term.', why: 'Dividing by a negative changes the sign of <b>every</b> term.' }],
            t('-2y=-' + s.A + 'x+' + s.C) + ' is right. Dividing every term by ' + t('-2') + ': ' + t('y=\\frac{' + s.A + '}{2}x-' + s.C / 2) + '.', ['Check each term of the last step: what is ' + t(s.C + '\\div(-2)') + '?'], 'EP10 error step');
        } },
        { id: 'e10b', sub: 'b', level: 'PRG', make: function (r, s) {
          return linePart('(b) Write the corrected final line.', [s.A, 2], -s.C / 2, [{ m: [s.A, 2], b: s.C / 2, code: 'move-sign', hint: 'That is Sam’s line: ' + t(s.C + '\\div(-2)=-' + s.C / 2) + '.' }, { m: [-s.A, 2], b: -s.C / 2, code: 'move-sign', hint: 'The slope was already right: ' + t('-' + s.A + '\\div(-2)=\\frac{' + s.A + '}{2}') + '.' }],
            t('y=\\frac{-' + s.A + '}{-2}x+\\frac{' + s.C + '}{-2}=' + siT([s.A, 2], -s.C / 2)) + '.', ['Divide every term of ' + t('-2y=-' + s.A + 'x+' + s.C) + ' by ' + t('-2') + '.'], 'EP10 corrected');
        } }] },
      /* ================= Part F ================= */
      { num: '11', section: 'Extra practice F — Working Backwards', stem: '<b>Parallel lines have equal slopes.</b> Determine the required value in each case.', parts: [
        { id: 'e11a', sub: 'a', level: 'BEG', make: function (r) { var m = r.pick(nz(-7, 7)), c = r.int(1, 9), d = r.pick(nz(-9, 9).filter(function (v) { return v !== c; })); return valPart('(a) Find ' + t('m') + ' so that ' + t('y=mx' + sgn(c) + Math.abs(c)) + ' is parallel to ' + t(siT(m, d)) + '.', m, [[d, 'mb-swap', 'Parallel lines share the <b>slope</b> — the number multiplying ' + t('x') + '.'], [-m, 'u7l2-par-sign', 'Equal slopes: keep the sign.']], 'Parallel lines have equal slopes: ' + t('m=' + m) + '.', ['Parallel lines have the same slope.'], 'EP11a', { before: t('m=') }); } },
        { id: 'e11b', sub: 'b', level: 'EMG', make: function (r) { var a = r.int(2, 8), c = r.int(1, 9), d = r.int(1, 9); return valPart('(b) Find ' + t('k') + ' so that ' + t('y=kx-' + d) + ' is parallel to ' + t(a + 'x+y=' + c) + '.', -a, [[a, 'u7l2-par-raw', 'Rearrange first: ' + t(siT(-a, c)) + '. The slope is ' + t(-a) + '.'], [c, 'mb-swap', 'The slope multiplies ' + t('x') + ' after rearranging.']], t(a + 'x+y=' + c) + ' gives ' + t(siT(-a, c)) + ', slope ' + t(-a) + '. So ' + t('k=' + (-a)) + '.', ['Rearrange the second equation into ' + t('y=mx+b') + ' first.'], 'EP11b', { before: t('k=') }); } },
        { id: 'e11c', sub: 'c', level: 'PRG', make: function (r) { var k = r.pick([2, 3, 4]), a = r.pick(nz(-4, 4)).valueOf(), c = r.pick([1, 3, 5, 7, -1, -3]); var A = -a * k; return valPart('(c) Find the slope of any line parallel to ' + t(axbyc(A, k, c)) + '.', a, [[-a, 'u7l2-par-sign', 'Moving ' + t(term(A, 'x', true)) + ' across changes its sign.'], [A, 'u7l2-par-half', 'Divide by ' + t(k) + ' too: ' + t('y') + ' must be alone.'], [-A, 'u7l2-par-half', 'Divide every term by ' + t(k) + '.']],
          t(k + 'y=' + lin([[-A, 'x'], [c, '']])) + ' → ' + t('y=' + lin([[a, 'x'], [[c, k], '']]))  + '. The slope is ' + t(a) + ', so any parallel line has slope ' + t(a) + '.', ['Rearrange into ' + t('y=mx+b') + '; read ' + t('m') + '.'], 'EP11c', { before: t('m=') }); } },
        { id: 'e11d', sub: 'd', level: 'ADV', make: function (r) { var k = r.pick([2, 3, 4]), s = r.pick(nz(-6, 6)), c = k * r.int(1, 4), e = r.int(1, 9); return valPart('(d) Find ' + t('k') + ' so that ' + t(k + 'y=kx+' + c) + ' is parallel to ' + t(siT(s, e)) + '.', s * k, [[s, 'u7l2-par-half', 'Dividing by ' + t(k) + ' gives ' + t('y=\\frac{k}{' + k + '}x+' + c / k) + '. Set ' + t('\\frac{k}{' + k + '}=' + s) + ' and solve: multiply by ' + t(k) + '.'], [-s * k, 'u7l2-par-sign', 'Equal slopes: keep the sign of ' + t(s) + '.']],
          t(k + 'y=kx+' + c) + ' → ' + t('y=\\frac{k}{' + k + '}x+' + c / k) + '. Parallel: ' + t('\\frac{k}{' + k + '}=' + s) + ', so ' + t('k=' + s * k) + '.', ['Divide every term by ' + t(k) + ' to see the slope, ' + t('\\frac{k}{' + k + '}') + '.', 'Set that slope equal to ' + t(s) + ' and solve.'], 'EP11d', { before: t('k=') }); } }] },
      { num: '12', stem: 'Determine the missing value in each equation.', parts: [
        { id: 'e12a', sub: 'a', level: 'BEG', make: function (r) { var m = r.pick(nz(-6, 6)), b = r.pick(nz(-9, 9)); return valPart('(a) ' + t('y=' + m + 'x+b') + ' passes through ' + t(ptT([0, b])) + '. Find ' + t('b') + '.', b, [[-b, 'sign', 'At ' + t('x=0') + ', ' + t('y=b') + ': the point says ' + t('y=' + b) + '.'], [m, 'mb-swap', t('b') + ' is the constant, not the slope.']], 'At ' + t('x=0') + ': ' + t(b + '=' + m + '(0)+b') + ', so ' + t('b=' + b) + ' — the point is the ' + t('y') + '-intercept.', ['The point has ' + t('x=0') + ': it is on the ' + t('y') + '-axis.'], 'EP12a', { before: t('b=') }); } },
        { id: 'e12b', sub: 'b', level: 'PRG', outcome: 'RF7', make: function (r) { var m = r.pick([-2, -3, 2, 3, -4]), x = r.int(2, 5), y = r.int(-5, 6), b = y - m * x; return valPart('(b) ' + t('y=' + m + 'x+b') + ' passes through ' + t(ptT([x, y])) + '. Find ' + t('b') + '.', b, [[y + m * x, 'u7l2-pt-solve', 'From ' + t(y + '=' + (m * x) + '+b') + ', ' + (m * x < 0 ? 'add ' + t(-m * x) : 'subtract ' + t(m * x)) + ' on both sides.'], [y, 'u7l2-pt-solve', 'Substitute both coordinates: ' + t(y + '=' + m + '(' + x + ')+b') + '.'], [x - m * y, 'u7l2-pt-swap', 'Substitute ' + t('x=' + x) + ' and ' + t('y=' + y) + ' — not the other way round.']],
          t(y + '=' + m + '(' + x + ')+b') + '<br>' + t(y + '=' + m * x + '+b') + '<br>' + t('b=' + b) + '.', ['Substitute the point: ' + t('x=' + x) + ', ' + t('y=' + y) + '. Then solve for ' + t('b') + '.'], 'EP12b', { before: t('b=') }); } },
        { id: 'e12c', sub: 'c', level: 'PRG', outcome: 'RF7', make: function (r) { var o = pickWhere(function () { return { m: r.pick(nz(-5, 6)), x: r.int(2, 4), c: r.int(1, 7) }; }, function () { return true; }); var y = o.m * o.x - o.c; return valPart('(c) ' + t('y=mx-' + o.c) + ' passes through ' + t(ptT([o.x, y])) + '. Find ' + t('m') + '.', o.m, [[(y - o.c) / o.x, 'u7l2-pt-solve', 'From ' + t(y + '=' + o.x + 'm-' + o.c) + ', add ' + t(o.c) + ' first.'], [y + o.c, 'no-divide', 'You have ' + t(o.x + 'm=' + (y + o.c)) + ' — divide by ' + t(o.x) + '.']],
          t(y + '=m(' + o.x + ')-' + o.c) + '<br>' + t((y + o.c) + '=' + o.x + 'm') + '<br>' + t('m=' + o.m) + '.', ['Substitute the point, then solve for ' + t('m') + '.'], 'EP12c', { before: t('m=') }); } }] },
      /* ================= Part G ================= */
      { num: '13', section: 'Extra practice G — Reasoning, Application, and Stretch', shared: function (r) { var m = r.pick([2, 3, 4]), b = r.int(-3, 5), b2 = r.pick([b - r.int(2, 5), b + r.int(2, 4)]); return { m: m, b: b, b2: b2, m2: m + r.int(2, 4) }; },
        stem: function (s) { return 'Start with the line ' + t(siT(s.m, s.b)) + '. Describe what happens to its graph under each change.'; }, parts: [
        { id: 'e13', level: 'EMG', make: function (r, s) {
          var rows = [{ id: 'a', html: '(a) ' + t('b') + ' changes from ' + t(s.b) + ' to ' + t(s.b2) }, { id: 'b', html: '(b) ' + t('m') + ' changes from ' + t(s.m) + ' to ' + t(s.m2) }, { id: 'c', html: '(c) ' + t('m') + ' changes from ' + t(s.m) + ' to ' + t(-s.m) }, { id: 'd', html: '(d) ' + t('m') + ' changes from ' + t(s.m) + ' to ' + t('\\frac{1}{' + s.m + '}') }];
          var cols = [{ id: 'up', html: 'Slides up' }, { id: 'dn', html: 'Slides down' }, { id: 'st', html: 'Tilts steeper' }, { id: 'fl', html: 'Tilts flatter' }, { id: 'fa', html: 'Same steepness, now falls' }];
          var want = { a: s.b2 > s.b ? 'up' : 'dn', b: 'st', c: 'fa', d: 'fl' };
          var why = { a: 'Only ' + t('b') + ' changes: same tilt, the crossing point moves ' + (s.b2 > s.b ? 'up' : 'down') + ' ' + t(Math.abs(s.b2 - s.b)) + ' to ' + t(ptT([0, s.b2])) + '.', b: 'A larger slope climbs faster: steeper, same crossing ' + t(ptT([0, s.b])) + '.', c: 'Opposite sign, same size: it falls to the right just as steeply.', d: 'A slope between ' + t('0') + ' and ' + t('1') + ': it still rises, but more gently.' };
          return B.grid('For each change, how does the line move?', rows, cols, want, { why: function (row) { return { code: 'u7l2-change', hint: '(' + row + ') ' + why[row] }; } },
            ['a', 'b', 'c', 'd'].map(function (k) { return '(' + k + ') ' + why[k]; }).join('<br>'), ['Changing ' + t('b') + ' slides the line up or down; changing ' + t('m') + ' tilts it around ' + t(ptT([0, s.b])) + '.'], 'EP13 changes');
        } }] },
      { num: '14', parts: [
        { id: 'e14', level: 'EMG', make: function (r) {
          var bb = r.pick(nz(-6, 6)), m1 = r.pick([1, 2, 3, -1, -2]), m2 = r.pick([-3, -1, 4, 5, -4].filter(function (v) { return v !== m1; }));
          return mc(r, 'Two different lines have the same value of ' + t('b') + ' but different values of ' + t('m') + ' (for example ' + t(siT(m1, bb)) + ' and ' + t(siT(m2, bb)) + '). What must the two graphs have in common, and what is different?', [
            { html: 'They cross the ' + t('y') + '-axis at the same point ' + t('(0,\\ b)') + ', so they meet there; their steepness (or direction) is different, so they spread apart away from that point.', right: true },
            { html: 'They are parallel: same intercept means they never meet.', why: 'Parallel lines need the same <b>slope</b>. These share a point, ' + t('(0,\\ b)') + '.' },
            { html: 'They are the same line.', why: 'Different slopes give different lines — they only share ' + t('(0,\\ b)') + '.' },
            { html: 'They cross the ' + t('x') + '-axis at the same point.', why: 'The ' + t('x') + '-intercept depends on the slope too. The shared point is on the ' + t('y') + '-axis.' }],
            'Same ' + t('b') + ': both pass through ' + t('(0,\\ b)') + '. Different ' + t('m') + ': different tilts, so they separate on either side of that point.', ['What does ' + t('b') + ' tell you about the graph?'], 'EP14 same b');
        } }] },
      { num: '15', parts: [
        { id: 'e15', level: 'EMG', make: function (r) {
          var mm = r.pick(nz(-5, 5)), b1 = r.int(-6, 6), b2 = r.pick(nz(-6, 6).filter(function (v) { return v !== b1; }));
          return mc(r, 'Two different lines have the same value of ' + t('m') + ' but different values of ' + t('b') + ' (for example ' + t(siT(mm, b1)) + ' and ' + t(siT(mm, b2)) + '). Why can these lines never cross?', [
            { html: 'Equal slopes mean both lines climb at exactly the same rate, so the vertical gap between them (the difference of the ' + t('b') + '-values) never changes. Since the gap isn’t zero, they are parallel and never meet.', right: true },
            { html: 'Lines with different ' + t('b') + '-values can never cross.', why: 'Lines with different ' + t('b') + ' and different ' + t('m') + ' do cross. It is the equal slopes that keep them apart.' },
            { html: 'They do cross, far away, where the grid ends.', why: 'The gap between them stays the same everywhere, however far you go.' },
            { html: 'Because their slopes are both positive.', why: 'The sign doesn’t matter; equal slopes are what make them parallel.' }],
            'Same ' + t('m') + ': for every step right both rise by the same amount, so the vertical distance between them stays ' + t('b_1-b_2\\ne 0') + ' forever. They are parallel.', ['Think about the vertical gap between the lines as you move right.'], 'EP15 same m');
        } }] },
      { num: '16', shared: function (r) { return r.pick([{ k: 4, a: 3, c: 26 }, { k: 4, a: 3, c: 22 }, { k: 4, a: 5, c: 18 }, { k: 4, a: 7, c: 30 }, { k: 2, a: 3, c: 9 }, { k: 2, a: 5, c: 7 }, { k: 4, a: 1, c: 14 }, { k: 2, a: 1, c: 11 }, { k: 4, a: 9, c: 10 }, { k: 2, a: 3, c: 13 }, { k: 5, a: 4, c: 30 }, { k: 5, a: 6, c: 25 }, { k: 4, a: 5, c: 26 }, { k: 2, a: 7, c: 5 }, { k: 5, a: 7, c: 20 }, { k: 4, a: 3, c: 18 }, { k: 2, a: 1, c: 7 }, { k: 4, a: 7, c: 22 }, { k: 5, a: 3, c: 35 }, { k: 2, a: 5, c: 11 }, { k: 4, a: 1, c: 30 }]); },
        stem: function (s) { return 'A taxi fare satisfies ' + t(s.k + 'C=' + (s.a === 1 ? '' : s.a) + 'd+' + s.c) + ', where ' + t('d') + ' is the distance travelled in kilometres and ' + t('C') + ' is the fare in dollars.'; }, parts: [
        { id: 'e16a', sub: 'a', level: 'PRG', make: function (r, s) {
          var m = Q(s.a, s.k), b = Q(s.c, s.k);
          var p = linePart('(a) Rewrite the equation in the form ' + t('C=md+b') + '.', m, b, [{ m: s.a, b: s.c, code: 'not-divided', hint: 'Divide <b>every</b> term by ' + t(s.k) + '.' }, { m: s.a, b: b, code: 'part-div', hint: 'Divide the ' + t('d') + '-term by ' + t(s.k) + ' too.' }],
            'Divide every term by ' + t(s.k) + ': ' + t('C=\\frac{' + s.a + '}{' + s.k + '}d+\\frac{' + s.c + '}{' + s.k + '}') + (b[1] !== s.k || m[1] !== s.k ? ' ' + t('=' + siT(m, b, 'd', 'C')) : '') + ', i.e. ' + t('C=' + nT(qv(m)) + 'd+' + nT(qv(b))) + '.', ['Divide every term by ' + t(s.k) + '.'], 'EP16 rewrite', { vars: ['d', 'C'] });
          p.good = (p.good || []).concat(['C=' + nT(qv(m)) + 'd+' + nT(qv(b))]);
          return p;
        } },
        { id: 'e16b', sub: 'b', level: 'EMG', make: function (r, s) {
          return valPart('(b) State the cost per kilometre.', Q(s.a, s.k), [[s.a, 'not-divided', 'Divide by ' + t(s.k) + ' first: ' + t('C=\\frac{' + s.a + '}{' + s.k + '}d+\\ldots') + '.'], [s.c / s.k, 'mb-swap', 'That’s the flat fee. The cost per km multiplies ' + t('d') + '.']],
            'In ' + t('C=' + nT(s.a / s.k) + 'd+' + nT(s.c / s.k)) + ' the slope is ' + t(nT(s.a / s.k)) + ': each extra kilometre adds $' + (s.a / s.k).toFixed(2) + '.', ['The cost per km is the slope, once ' + t('C') + ' is alone.'], 'EP16 per km', { before: '$', after: 'per km', placeholder: 'decimal or fraction' });
        } },
        { id: 'e16c', sub: 'c', level: 'EMG', make: function (r, s) {
          return valPart('(c) State the flat fee charged before any distance is driven.', Q(s.c, s.k), [[s.c, 'not-divided', 'Divide by ' + t(s.k) + ' first.'], [s.a / s.k, 'mb-swap', 'That’s the cost per km. The flat fee is the fare when ' + t('d=0') + '.']],
            'At ' + t('d=0') + ': ' + t('C=' + nT(s.c / s.k)) + ' — a flat fee of $' + (s.c / s.k).toFixed(2) + '.', ['The flat fee is ' + t('b') + ': the fare when ' + t('d=0') + '.'], 'EP16 fee', { before: '$', placeholder: 'decimal or fraction' });
        } },
        { id: 'e16d', sub: 'd', level: 'PRG', make: function (r, s) {
          var D = s.k * r.int(2, 6), fare = (s.a * D + s.c) / s.k;
          return valPart('(d) Determine the fare for a ' + t(D) + ' km trip.', Q(s.a * D + s.c, s.k), [[s.a * D + s.c, 'not-divided', 'That’s ' + t(s.k + 'C') + '. Divide by ' + t(s.k) + '.'], [s.a / s.k * D, 'u7l2-ctx-nofee', 'Add the flat fee.']],
            t('C=' + nT(s.a / s.k) + '(' + D + ')+' + nT(s.c / s.k) + '=' + nT(fare)) + ': $' + fare.toFixed(2) + '.', ['Substitute ' + t('d=' + D) + ' into your equation from (a).'], 'EP16 fare', { before: '$', placeholder: 'decimal or fraction' });
        } }] },
      { num: '17', shared: function (r) {
          var m = -r.pick([1, 2, 3, 4]), b = r.int(2, 7), k = r.pick([2, 3]), odd = r.pick([0, 1, 2]);
          var eqs = [lin([[-m * k, 'x'], [k, 'y']]) + '=' + b * k, 'y-' + b + '=' + term(m, 'x', true), lin([[-m, 'x'], [1, 'y']]) + '=' + b];
          var tg = [{ m: m, b: b }, { m: m, b: b }, { m: m, b: b }]; var sw = { m: m, b: -b };
          eqs[odd] = odd === 0 ? lin([[-m * k, 'x'], [k, 'y']]) + '=' + (-b * k) : odd === 1 ? 'y+' + b + '=' + term(m, 'x', true) : lin([[-m, 'x'], [1, 'y']]) + '=' + (-b);
          tg[odd] = sw;
          return { m: m, b: b, eqs: eqs, tg: tg, odd: odd };
        },
        stem: function (s) { return '<b>Stretch.</b> Three equations are given. Two of them describe the <i>same</i> line and one does not.<br>(i) ' + t(s.eqs[0]) + ' &nbsp; (ii) ' + t(s.eqs[1]) + ' &nbsp; (iii) ' + t(s.eqs[2]); }, parts: [
        { id: 'e17a', sub: 'a', level: 'PRG', make: function (r, s) {
          var f = ['(i)', '(ii)', '(iii)'].map(function (n) { return { label: n, name: n, mode: 'math', keys: 'eq', placeholder: 'y = mx + b' }; });
          var p = B.fields('(a) Rearrange all three into slope–intercept form.', f, s.tg.map(function (T) { return K.line(T, { form: 'slope-intercept' }); }), s.tg.map(function (T) { return siT(T.m, T.b); }), s.tg.map(function (T, i) { return ['(i)', '(ii)', '(iii)'][i] + ' ' + t(siT(T.m, T.b)); }).join('; '),
            s.tg.map(function (T, i) { return ['(i)', '(ii)', '(iii)'][i] + ' ' + t(s.eqs[i]) + ' → ' + t(siT(T.m, T.b)); }).join('<br>'), ['Rearrange each one: get ' + t('y') + ' alone, then write the ' + t('x') + '-term first.'], 'EP17 rearrange three');
          p.bad = [s.tg.map(function (T) { return siT(-T.m, T.b); })];
          return p;
        } },
        { id: 'e17b', sub: 'b', level: 'PRG', make: function (r, s) {
          var nm = ['(i)', '(ii)', '(iii)'], o = s.odd, others = [0, 1, 2].filter(function (i) { return i !== o; });
          return mc(r, '(b) Which is the odd one out, and why?', [
            { html: nm[o] + ': it has the same slope ' + t(s.m) + ' but a different ' + t('y') + '-intercept, so it is a parallel line. ' + nm[others[0]] + ' and ' + nm[others[1]] + ' share both ' + t('m') + ' and ' + t('b') + ': the same line.', right: true },
            { html: nm[others[0]] + ': its numbers look different from the other two.', why: 'Compare after rearranging: ' + nm[others[0]] + ' and ' + nm[others[1]] + ' are both ' + t(siT(s.m, s.b)) + '.' },
            { html: nm[o] + ': it has a different slope, so it crosses the other line.', why: 'All three have slope ' + t(s.m) + '. The difference is the ' + t('y') + '-intercept.' },
            { html: 'None: all three are the same line, because they all have slope ' + t(s.m) + '.', why: 'Same slope isn’t enough — the ' + t('y') + '-intercepts must match too.' }],
            nm[others[0]] + ' and ' + nm[others[1]] + ' rearrange to ' + t(siT(s.m, s.b)) + '; ' + nm[o] + ' to ' + t(siT(s.m, -s.b)) + '. Same slope, different intercept: parallel, not the same line.', ['Use your answers from (a): compare both ' + t('m') + ' and ' + t('b') + '.'], 'EP17 odd one');
        } }] },
      { num: '18', parts: [
        { id: 'e18', level: 'PRG', make: function (r) {
          var o = pickWhere(function () { return { p: r.pick([1, 2, 3, 4]), q: r.pick([3, 5, 2, 4]), b: r.int(2, 6) }; }, function (o) { return cop(o.p, o.q) && o.p !== o.q; });
          var m = [-o.p, o.q], C = o.q * o.b;
          var right = axbyc(o.p, o.q, C), sw = axbyc(o.q, o.p, o.p * o.b), sg = axbyc(o.p, -o.q, C), sw2 = axbyc(o.q, -o.p, -o.p * o.b);
          return mc(r, '<i>(Multiple Choice)</i> Which equation has slope ' + t(qT(m)) + ' and ' + t('y') + '-intercept ' + t(o.b) + '?', [
            { html: t(right), right: true },
            { html: t(sw), why: 'Rearranged: ' + t(siT([-o.q, o.p], o.b)) + ' — the slope is upside down.' },
            { html: t(sg), why: 'Rearranged: ' + t(siT([o.p, o.q], -o.b)) + ' — both signs are wrong.' },
            { html: t(sw2), why: 'Rearranged: ' + t(siT([o.q, o.p], o.b)) + '.' }],
            t(right) + ' → ' + t(o.q + 'y=' + lin([[-o.p, 'x'], [C, '']])) + ' → ' + t(siT(m, o.b)) + ': slope ' + t(qT(m)) + ', intercept ' + t(o.b) + '.', ['Rearrange each option into ' + t('y=mx+b') + '.'], 'EP18 which equation');
        } }] },
      { num: '19', parts: [
        { id: 'e19', level: 'PRG', make: function (r) {
          var o = pickWhere(function () { return { m: r.int(2, 5), k: r.pick([2, 3, 4]), b: r.pick(nz(-4, 9)) }; }, function (o) { return o.m + o.b > 0 && o.m + o.b < 100; });
          var A = o.m * o.k, C = -o.b * o.k, ans = o.m + o.b;
          return B.nr('<i>(Numerical Response)</i> For the line ' + t(axbyc(A, -o.k, C)) + ', the value of ' + t('m+b') + ' is ____.', ans, dl([[o.m - o.b, 'u7l2-mb-sum-sign', 'Check the sign of ' + t('b') + ': dividing by ' + t('-' + o.k) + ' changes every sign.'], [A - o.k, 'u7l2-mb-raw', 'Rearrange into ' + t('y=mx+b') + ' first; the coefficients of ' + t(axbyc(A, -o.k, C)) + ' aren’t ' + t('m') + ' and ' + t('b') + '.']].filter(function (d) { return d[0] >= 0; }), ans),
            t('-' + o.k + 'y=' + lin([[-A, 'x'], [C, '']])) + ' → ' + t(siT(o.m, o.b)) + '. ' + t('m+b=' + o.m + (o.b < 0 ? '' : '+') + o.b + '=' + ans) + '.', ['Rearrange into ' + t('y=mx+b') + ', then add ' + t('m') + ' and ' + t('b') + '.'], 'EP19 NR m+b');
        } }] },
      /* ================= Mastery challenge ================= */
      { num: '20', section: 'Mastery challenge', stem: 'Working backwards with two unknowns.', parts: [
        { id: 'e20', level: 'MAS', make: function (r) {
          var o = pickWhere(function () { return { k: r.pick([2, 3, 4]), s: r.pick(nz(-5, 5)), b: r.pick(nz(-6, 6)), d: r.pick(nz(-9, 9)) }; }, function (o) { return o.d !== o.b; });
          var kk = o.s * o.k, cc = o.b * o.k;
          var p = B.fields('The line ' + t(o.k + 'y=kx+c') + ' is parallel to ' + t(siT(o.s, o.d)) + ' and crosses the ' + t('y') + '-axis at ' + t(ptT([0, o.b])) + '. Find ' + t('k') + ' and ' + t('c') + '.',
            [{ label: t('k='), name: 'k', mode: 'math', keys: 'fraction' }, { label: t('c='), name: 'c', mode: 'math', keys: 'fraction' }],
            [K.value(kk, { diag: dl([[o.s, 'u7l2-mas-k', 'In ' + t('y=\\frac{k}{' + o.k + '}x+\\frac{c}{' + o.k + '}') + ' the slope is ' + t('\\frac{k}{' + o.k + '}') + '. Set it equal to ' + t(o.s) + ' and multiply by ' + t(o.k) + '.'], [-kk, 'u7l2-par-sign', 'Keep the sign of the slope.']], kk) }),
              K.value(cc, { diag: dl([[o.b, 'u7l2-mas-c', 'The intercept is ' + t('\\frac{c}{' + o.k + '}') + ', so ' + t('\\frac{c}{' + o.k + '}=' + o.b) + '.'], [o.d * o.k, 'u7l2-mas-c', 'The ' + t('y') + '-intercept comes from the point ' + t(ptT([0, o.b])) + ', not from the other line.']], cc) })],
            [String(kk), String(cc)], t('k=' + kk) + ', ' + t('c=' + cc),
            'Divide by ' + t(o.k) + ': ' + t('y=\\frac{k}{' + o.k + '}x+\\frac{c}{' + o.k + '}') + '.<br>Parallel: ' + t('\\frac{k}{' + o.k + '}=' + o.s) + ', so ' + t('k=' + kk) + '.<br>Intercept: ' + t('\\frac{c}{' + o.k + '}=' + o.b) + ', so ' + t('c=' + cc) + '.<br>Check: ' + t(o.k + 'y=' + lin([[kk, 'x'], [cc, '']])) + ' → ' + t(siT(o.s, o.b)) + ' ✓',
            ['Divide every term by ' + t(o.k) + ' so that ' + t('y') + ' is alone. What are the slope and the intercept now, in terms of ' + t('k') + ' and ' + t('c') + '?', 'Parallel means equal slopes; the intercept is given by the point.'], 'MAS k and c');
          p.bad = [[String(o.s), String(o.b)], [String(kk), String(o.b)]];
          return p;
        } }] }
    ]
  });

  /* Q13 / Q14: does the table match the equation? one row per ordered pair, plus the conclusion */
  function tabPart(id, lev, oneOff) {
    return { id: id, level: lev, make: function (r) {
      var m = r.pick(nz(-5, 6).filter(function (v) { return Math.abs(v) > 1; })), b = r.pick(nz(-5, 5)), x0 = r.pick([-1, 0, -2]), xs = [x0, x0 + 1, x0 + 2, x0 + 3];
      var ys = xs.map(function (x) { return m * x + b; }), bad = oneOff ? r.pick([2, 3]) : -1;
      if (oneOff) ys[bad] += r.pick([-1, 1]);
      var eq = siT(m, b), rows = xs.map(function (x, i) { return { id: 'p' + i, html: t(ptT([x, ys[i]])) + ' satisfies ' + t(eq) }; }).concat([{ id: 'all', html: '<b>The table matches ' + t(eq) + '</b>' }]);
      var want = {}; xs.forEach(function (x, i) { want['p' + i] = i === bad ? 'n' : 'y'; }); want.all = oneOff ? 'n' : 'y';
      var tb = HW.valueTable([[t('x')].concat(xs.map(function (v) { return t(v); })), [t('y')].concat(ys.map(function (v) { return t(v); }))]);
      var sol = xs.map(function (x, i) { var v = m * x + b; return t('x=' + x + ':\\ ' + m + '(' + x + ')' + sgn(b) + Math.abs(b) + '=' + v) + (v === ys[i] ? ' ✓' : ' — the table shows ' + t(ys[i]) + ' ✗'); }).join('<br>') + '<br>' + (oneOff ? 'One pair fails, so the table does <b>not</b> match.' : 'Every pair works, so the table <b>matches</b>.');
      return B.grid('Does the table below match ' + t(eq) + '? Check each ordered pair.' + tb, rows, [{ id: 'y', html: 'Yes' }, { id: 'n', html: 'No' }], want, {
        why: function (row) { if (row === 'all') return { code: 'u7l2-tab-all', hint: 'The table matches only if <b>every</b> ordered pair satisfies the equation.' }; var i = Number(row.slice(1)); return { code: 'u7l2-tab-row', hint: 'Recheck ' + t(ptT([xs[i], ys[i]])) + ': ' + t(m + '(' + xs[i] + ')' + sgn(b) + Math.abs(b)) + ' — is it ' + t(ys[i]) + '?' }; } },
        sol, ['Substitute each ' + t('x') + ' into the equation and compare with the ' + t('y') + ' in the table.', 'One pair that fails means the table does not match.'], 'table matches?');
    } };
  }
})(window);
