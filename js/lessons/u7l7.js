/* Math 15 · Unit 7 · Lesson 7 — The General Form of a Linear Equation (RF6; intercepts RF5)
 * Assignment 7 (u7_L07.tex, Questions 1–15) and the Lesson 7 Extra Practice (u7_EP07.tex, Questions 1–17).
 * Every part is a generator: same structure, idea and difficulty as the booklet question, new numbers from the seed
 * (the booklet's own numbers are among the possible values). Model: Math 10C u7l3.js (general form).
 * General form, as the booklet defines it: Ax + By + C = 0 with A, B, C integers and A positive. A right line with a
 * fraction left, a negative A, or terms on both sides gets a nudge that doesn't use a try; a common factor left in
 * (e.g. 6x − 2y − 18 = 0) is accepted, as in the booklet's own key (EP 16(b)). "Slope–intercept form" answers must be
 * y = mx + b. Intercepts are accepted as a value (3) or as a point ((3, 0)), since the booklet's keys use both.
 * Conversions: "explain / name the rule / what does it mean" -> multiple choice whose options are reasons, or a
 * table of choices; "order" -> drag to order.
 * Outcomes: RF6 (converting between forms, reading the slope), RF5 (intercepts), RF3 (what a slope means in a
 * context, as in Lesson 9). Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 16(b)(i). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, L = HW.lines, P = HW.poly;

  HW.addCodes({
    'gf-y-sign': 'Moved y across without changing its sign', 'gf-no-y': 'Didn’t multiply the y-term by the common denominator',
    'gf-no-const': 'Didn’t multiply the constant by the common denominator', 'gf-gave-b': 'Gave the y-intercept as the slope', 'gf-slope-A': 'Took the x-coefficient as the slope',
    'gf-b-undivided': 'Didn’t divide the constant by B', 'gf-x-undivided': 'Didn’t divide the constant by A', 'gf-gave-x': 'Gave the x-intercept for the y-intercept',
    'gf-gave-y': 'Gave the y-intercept for the x-intercept', 'gf-gave-m': 'Gave the slope for the y-intercept', 'gf-swap-ab': 'Swapped the roles of A and B',
    'gf-k-sign': 'Value of k/a with the wrong sign', 'gf-k-mult': 'Multiplied instead of dividing', 'gf-sub-sign': 'Sign slip substituting a point', 'gf-perp-par': 'Parallel and perpendicular mixed up',
    'l5-nodiv': 'Didn’t divide every term', 'l5-c-sign': 'Sign slip moving the constant', 'l5-pair-axes': 'Intercepts on the wrong axes',
    'u7l7-unchanged': 'Gave back the equation with A still negative', 'u7l7-some-signs': 'Changed the signs of only some terms', 'u7l7-x-sign': 'Sign slip moving the x-term',
    'u7l7-int-pt': 'Intercept point not on the axis'
  });
  HW.addPartial({ 'u7l7-unchanged': 'n', 'u7l7-some-signs': 'b', 'u7l7-x-sign': 's', 'u7l7-int-pt': 'b' });

  /* a keypad for a value that may also be typed as a point: digits, fraction, minus, ( ), comma (lesson-local; L8 defines the same) */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.u7val) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.u7val = [[dk(7), dk(8), dk(9), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: '−', tex: '-', plain: '-' }, { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Ordered pair: type x, y inside' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (out of a box)' }],
      [dk(0), { label: '.', tex: '.', plain: '.' }, { label: ',', tex: ',', plain: ', ' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    W.KEYHELP.u7val = ['Type a number or a fraction (<b><sup>a</sup>⁄<sub>b</sub></b>, then <b>▶</b> to step out). An intercept may also be typed as a point: <b>( )</b>, then e.g. 3 , 0.', 'Type a number or fraction such as <code>-3/4</code>; an intercept may also be a point such as <code>(3, 0)</code>.'];
  }
  var PH = { m: 'e.g. -3/4', v: 'e.g. 3 or (3, 0)' };

  /* ---------------- numbers and LaTeX ---------------- */
  var toFr = L.toFr;
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }
  function fT(x) { var f = toFr(x); return L.frT(f[0], f[1]); }
  function pT(p) { return '(' + fT(p[0]) + ',\\ ' + fT(p[1]) + ')'; }
  function pK(p) { return '(' + fT(p[0]) + ', ' + fT(p[1]) + ')'; }
  function term(c, v, first) {
    if (near(c, 0)) return '';
    var f = toFr(Math.abs(c)), mag = f[1] === 1 ? String(f[0]) : '\\frac{' + f[0] + '}{' + f[1] + '}';
    if (v && mag === '1') mag = '';
    return (c < 0 ? '-' : first ? '' : '+') + mag + v;
  }
  function lin(list) { var s = ''; list.forEach(function (p) { s += term(p[0], p[1], s === ''); }); return s || '0'; }
  function gT(A, Bc, C) { return lin([[A, 'x'], [Bc, 'y'], [C, '']]) + '=0'; }       // as written (not reduced)
  function siT(m, b) { return 'y=' + lin([[m, 'x'], [b, '']]); }
  function red(A, Bc, C) {                                                            // integers, A > 0, no common factor
    var d = 1; [A, Bc, C].forEach(function (v) { d = lcm(d, toFr(v)[1]); });
    var a = Math.round(A * d), b = Math.round(Bc * d), c = Math.round(C * d), g = gcd(gcd(a, b), c) || 1; a /= g; b /= g; c /= g;
    if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; c = -c; }
    return [a + 0, b + 0, c + 0];
  }
  function rT(L3) { return gT(L3[0], L3[1], L3[2]); }
  function gen(T) { return L.tex(T, 'general'); }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function pm(a, b) { return range(a, b).concat(range(a, b).map(function (x) { return -x; })); }
  function cop(a, b) { return gcd(a, b) === 1; }
  function pickWhere(gen0, okf) { for (var i = 0; i < 3000; i++) { var o = gen0(); if (okf(o)) return o; } throw new Error('u7l7: no valid numbers'); }
  function sgp(x) { return x < 0 ? '(' + fT(x) + ')' : fT(x); }
  function prn(x) { return '(' + fT(x) + ')'; }
  function mc(r, prompt, opts, sol, hints, text, keep) {
    var seen = {}, o2 = opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; });
    return KP.mc(r, prompt, o2, sol, hints, text, keep);
  }

  /* ---------------- equation answers ---------------- */
  /* general form, Math 15: integers, A > 0; a common factor left in is fine */
  function gfCheck(T, opt) {
    var base = K.line(T, Object.assign({ form: 'general' }, opt || {}));
    return function (resp) {
      var r = base(resp);
      if (r.v === 'form' && r.code === 'line-form-gcd') {
        var rd = L.read(resp);
        if (rd.ok) { var ast = P.isZero(rd.R) ? rd.lAst : rd.rAst; try { var fi = P.formIssue(ast); if (fi && fi.code !== 'not-poly') return form('line-form-simplify', 'Right line — simplify: expand brackets and collect like terms.'); } catch (e) { /* not a polynomial form issue */ } }
        return ok();
      }
      return r;
    };
  }
  function linePart(prompt, T, fm, wr, sol, hints, text, o) {
    o = o || {};
    var p = KP.line(prompt, T, { form: fm, wrong: wr }, sol, hints, text);
    if (fm === 'general') p.check = gfCheck(T, { wrong: wr });
    if (o.pre) { var c0 = p.check; p.check = function (resp) { return o.pre(resp) || c0(resp); }; }
    p.good = o.good;
    p.bad = (o.bad || []).filter(function (b) { return p.check(b).v !== 'correct'; });
    return p;
  }

  /* slope–intercept → general: m = [p, q], b = [p, q] */
  function toGenSol(mF, bF) {
    var D = lcm(mF[1], bF[1]), a = mF[0] * D / mF[1], c = bF[0] * D / bF[1], out = [];
    if (D > 1) out.push('Multiply <b>every</b> term by ' + t(D) + ' (the common denominator): ' + t(lin([[D, 'y']]) + '=' + lin([[a, 'x'], [c, '']])) + '.');
    if (a > 0) out.push('Move every term to the side with the ' + t('x') + '-term (subtract ' + t(lin([[D, 'y']])) + ' from both sides): ' + t('0=' + lin([[a, 'x'], [-D, 'y'], [c, '']]))
      + ', so ' + t(gT(a, -D, c)) + '.');
    else out.push('Move every term to the left side (subtract ' + t(lin([[a, 'x']])) + (c ? ' and ' + (c > 0 ? 'subtract ' : 'add ') + t(Math.abs(c)) : '') + '): ' + t(lin([[-a, 'x'], [D, 'y'], [-c, '']]) + '=0') + ' — the ' + t('x') + '-term is positive.');
    return out.join('<br>');
  }
  var HGEN = ['Clear any fractions first: multiply <b>every</b> term (including ' + t('y') + ') by the common denominator.', 'Then move every term to one side so the other side is ' + t('0') + ', with the ' + t('x') + '-term positive.'];
  function convPart(prompt, mF, bF, o) {
    o = o || {};
    var T = { m: mF, b: bF }, mv = mF[0] / mF[1], bv = bF[0] / bF[1], D = lcm(mF[1], bF[1]), a = mv * D, c = bv * D, wr = [], bad = [];
    wr.push({ is: { A: a, B: D, C: c }, code: 'gf-y-sign', hint: 'When ' + t(lin([[D, 'y']])) + ' moves to the other side it changes sign. Check the sign of your ' + t('y') + '-term.' });
    bad.push(rT(red(a, D, c)));
    if (D > 1) {
      wr.push({ is: { A: a, B: -1, C: c }, code: 'gf-no-y', hint: 'Multiply <b>every</b> term by ' + t(D) + ' — the ' + t('y') + '-term too. If you skip a term, the two sides aren’t multiplied by the same number, so you get a different line.' });
      bad.push(gT(a, -1, c));
      if (bF[1] === 1) { wr.push({ is: { A: a, B: -D, C: bv }, code: 'gf-no-const', hint: 'Multiply <b>every</b> term by ' + t(D) + ' — the constant ' + t(fT(bv)) + ' too.' }); bad.push(gT(a, -D, bv)); }
    } else {
      wr.push({ is: { A: a, B: -1, C: -c }, code: 'l5-c-sign', hint: 'When the constant ' + t(fT(bv)) + ' moves to the other side it changes sign.' });
      wr.push({ is: { A: -a, B: -1, C: c }, code: 'u7l7-x-sign', hint: 'When ' + t(lin([[a, 'x']])) + ' moves to the other side it changes sign — or leave it where it is and move the ' + t('y') + ' instead.' });
      bad.push(gT(a, -1, -c));
    }
    var Lr = red(mv, -1, bv);
    var good = [lin([[Lr[1], 'y'], [Lr[0], 'x'], [Lr[2], '']]) + '=0', '0=' + lin([[Lr[0], 'x'], [Lr[1], 'y'], [Lr[2], '']]), gT(2 * Lr[0], 2 * Lr[1], 2 * Lr[2])];
    var hints = o.hints || (D > 1 ? HGEN : ['Move every term to one side, so the other side is ' + t('0') + '.', 'When a term crosses the equals sign its sign changes. Make the ' + t('x') + '-term positive.']);
    return linePart(prompt || t(siT(mv, bv)), T, 'general', wr, toGenSol(mF, bF) + (o.solPost ? '<br>' + o.solPost : ''), hints, 'general form of ' + siT(mv, bv),
      { good: good, bad: bad.concat([siT(mv, bv), gT(-Lr[0], -Lr[1], -Lr[2])]) });
  }

  /* general → slope–intercept */
  function solveY(A, Bc, C) {
    var m = -A / Bc, b = -C / Bc, s = [];
    if (Bc === 1) s.push(siT(m, b));
    else { s.push(lin([[Bc, 'y']]) + '=' + lin([[-A, 'x'], [-C, '']])); s.push(siT(m, b)); }
    return s;
  }
  function solveYT(A, Bc, C) { return solveY(A, Bc, C).map(t).join(' &nbsp;→&nbsp; '); }
  function toSIPart(prompt, A, Bc, C, o) {
    o = o || {};
    var m = -A / Bc, b = -C / Bc, wr = [];
    if (Bc < 0) wr.push({ is: { m: -m, b: -b }, code: 'l5-nodiv', hint: 'When you divide by ' + t(Bc) + ', <b>every</b> term changes sign — the ' + t('x') + '-term and the constant too.' });
    if (Math.abs(Bc) !== 1) {
      wr.push({ is: { m: m, b: -C }, code: 'gf-b-undivided', hint: 'Divide the constant by ' + t(Bc) + ' too — <b>every</b> term gets divided.' });
      wr.push({ is: { m: -A, b: b }, code: 'l5-nodiv', hint: 'Divide the ' + t('x') + '-term by ' + t(Bc) + ' too — <b>every</b> term gets divided.' });
      wr.push({ is: { m: -A, b: -C }, code: 'l5-nodiv', hint: 'Once the ' + t('y') + '-term is alone, divide <b>every</b> term by its coefficient, ' + t(Bc) + '.' });
    }
    wr.push({ is: { m: m, b: -b }, code: 'l5-c-sign', hint: 'Check the sign of the constant: when ' + t(fT(C)) + ' moves across the equals sign it changes sign' + (Bc < 0 ? ', and then dividing by ' + t(Bc) + ' changes it again' : '') + '.' });
    wr.push({ is: { m: -m, b: b }, code: 'u7l7-x-sign', hint: 'Check the sign of the slope: when ' + t(lin([[A, 'x']])) + ' moves across the equals sign it changes sign' + (Bc < 0 ? ', and then dividing by ' + t(Bc) + ' changes it again' : '') + '.' });
    var keyT = siT(m, b);
    var p = linePart(prompt, { m: toFr(m), b: toFr(b) }, 'slope-intercept', wr, 'Get the ' + t('y') + '-term by itself, then divide <b>every</b> term by its coefficient:<br>' + t(o.eqT || gT(A, Bc, C)) + ' &nbsp;→&nbsp; ' + solveYT(A, Bc, C) + '.',
      o.hints || ['Move the ' + t('x') + '-term and the constant to the other side (their signs change).', 'Then divide <b>every</b> term by the coefficient of ' + t('y') + '. Simplify any fraction.'], 'slope-intercept form of ' + gT(A, Bc, C),
      { good: [('y=' + lin([[b, ''], [m, 'x']])).replace('=+', '=')], bad: [siT(-m, -b), gT(A, Bc, C), siT(m, -b)] });
    p.answer = t(keyT);
    return p;
  }

  /* ---------------- boxes ---------------- */
  function slopeBox(A, Bc, C) {
    var m = -A / Bc;
    return K.slope(toFr(m), { diag: function (v) {
      if (!near(m, -C / Bc) && near(v, -C / Bc)) return { code: 'gf-gave-b', hint: 'That’s the ' + t('y') + '-intercept. The slope is the coefficient of ' + t('x') + ' once the equation reads ' + t('y=mx+b') + '.' };
      if (Math.abs(Bc) !== 1 && (near(v, A) || near(v, -A)) && !near(m, A)) return { code: 'gf-slope-A', hint: 'In general form the slope isn’t the coefficient of ' + t('x') + '. Solve for ' + t('y') + ' — divide every term by the coefficient of ' + t('y') + '.' };
      return null;
    } });
  }
  /* an intercept: the value (3) or the point ((3, 0)) */
  function intBox(axis, A, Bc, C) {
    var v = axis === 'x' ? -C / A : -C / Bc, ov = axis === 'x' ? -C / Bc : -C / A, pt = axis === 'x' ? [v, 0] : [0, v];
    var coef = axis === 'x' ? A : Bc, other = axis === 'x' ? 'y' : 'x';
    var vc = K.value(v, { diag: function (x) {
      if (isFinite(ov) && !near(ov, v) && near(x, ov)) return { code: axis === 'x' ? 'gf-gave-y' : 'gf-gave-x', hint: 'That’s the ' + t(other) + '-intercept. For the ' + t(axis) + '-intercept set ' + t(other + '=0') + ' and solve for ' + t(axis) + '.' };
      if (Math.abs(coef) !== 1 && C !== 0 && (near(x, C) || near(x, -C))) return { code: axis === 'x' ? 'gf-x-undivided' : 'gf-b-undivided', hint: 'Set ' + t(other + '=0') + ', then divide the constant by the coefficient of ' + t(axis) + ', ' + t(coef) + '.' };
      return null;
    } });
    var pc = K.pairs([pt]);
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\s/g, '');
      if (!s) return form('empty', 'Type your answer first.');
      s = s.replace(new RegExp('^' + axis + '='), '');
      if (/^\(/.test(s)) {
        var r = pc(s); if (r.v === 'correct' || r.v === 'form') return r.v === 'form' ? form(r.code, r.hint) : r;
        var m = /^\(([^,]*),([^,]*)\)$/.exec(s), q = m ? [HW.ex.parse(m[1]), HW.ex.parse(m[2])] : null;
        if (q && q[0].ok && q[1].ok) {
          var a = HW.ex.value(q[0].ast), b = HW.ex.value(q[1].ast), mine = axis === 'x' ? a : b, zero = axis === 'x' ? b : a;
          var op = axis === 'x' ? [0, ov] : [ov, 0];
          if (isFinite(ov) && near(a, op[0]) && near(b, op[1])) return wrong(axis === 'x' ? 'gf-gave-y' : 'gf-gave-x', 'That’s the ' + t(other) + '-intercept. For the ' + t(axis) + '-intercept set ' + t(other + '=0') + ' and solve for ' + t(axis) + '.');
          if (near(mine, 0) && near(zero, v)) return wrong('l5-pair-axes', 'Right number, wrong axis: the ' + t(axis) + '-intercept is on the ' + t(axis) + '-axis, so it is ' + t(pT(pt)) + '.');
          if (!near(zero, 0)) return wrong('u7l7-int-pt', 'An ' + t(axis) + '-intercept is on the ' + t(axis) + '-axis, so its ' + t(other) + '-coordinate is ' + t('0') + '.');
          return vc(String(mine));
        }
        return form('unreadable', 'Write the intercept as a number, or as an ordered pair such as ' + t(axis === 'x' ? '(3,\\ 0)' : '(0,\\ 3)') + '.');
      }
      return vc(s);
    };
  }
  function intFields(prompt, A, Bc, C, o) {
    o = o || {};
    var xi = -C / A, yi = -C / Bc, xp = [xi, 0], yp = [0, yi];
    var sol = t('x') + '-intercept: set ' + t('y=0') + ': ' + t(lin([[A, 'x'], [C, '']]) + '=0') + ', so ' + t(lin([[A, 'x']]) + '=' + fT(-C)) + ' and ' + t('x=' + fT(xi)) + ' → ' + t(pT(xp)) + '.<br>'
      + t('y') + '-intercept: set ' + t('x=0') + ': ' + t(lin([[Bc, 'y'], [C, '']]) + '=0') + ', so ' + t(lin([[Bc, 'y']]) + '=' + fT(-C)) + ' and ' + t('y=' + fT(yi)) + ' → ' + t(pT(yp)) + '.';
    var p = KP.fields(prompt, [{ label: t('x') + '-intercept:', name: 'x-intercept', mode: 'math', keys: 'u7val', placeholder: PH.v }, { label: t('y') + '-intercept:', name: 'y-intercept', mode: 'math', keys: 'u7val', placeholder: PH.v }],
      [intBox('x', A, Bc, C), intBox('y', A, Bc, C)], [pK(xp), pK(yp)], t('x') + '-intercept ' + t(pT(xp)) + ', ' + t('y') + '-intercept ' + t(pT(yp)),
      sol + (o.solPost ? '<br>' + o.solPost : ''), o.hints || ['For the ' + t('x') + '-intercept, substitute ' + t('y=0') + ' — the ' + t('y') + '-term disappears. For the ' + t('y') + '-intercept, substitute ' + t('x=0') + '.', 'Give each as a number or as a point: an ' + t('x') + '-intercept is ' + t('(a,\\ 0)') + ', a ' + t('y') + '-intercept is ' + t('(0,\\ b)') + '.'],
      o.text || 'intercepts of ' + gT(A, Bc, C));
    p.good = [[fT(xi), fT(yi)], ['x=' + fT(xi), 'y=' + fT(yi)]];
    p.bad = [[fT(-xi), fT(-yi)]];
    if (!near(xi, yi)) p.bad.push([pK(yp), pK(xp)], [pK([0, xi]), pK([yi, 0])]);
    return p;
  }
  function mbFields(prompt, A, Bc, C, o) {
    o = o || {};
    var m = -A / Bc, b = -C / Bc;
    var p = KP.fields(prompt, [{ label: 'Slope:', name: 'Slope', mode: 'math', keys: 'u7val', placeholder: PH.m, before: t('m=') }, { label: t('y') + '-intercept:', name: 'y-intercept', mode: 'math', keys: 'u7val', placeholder: PH.v }],
      [slopeBox(A, Bc, C), intBox('y', A, Bc, C)], [fT(m), fT(b)], 'Slope ' + t('m=' + fT(m)) + ', ' + t('y') + '-intercept ' + t(fT(b)),
      'Solve for ' + t('y') + ': ' + t(gT(A, Bc, C)) + ' &nbsp;→&nbsp; ' + solveYT(A, Bc, C) + '.<br>So ' + t('m=' + fT(m)) + ' and the ' + t('y') + '-intercept is ' + t(fT(b)) + '.',
      ['Isolate the ' + t('y') + '-term, then divide <b>every</b> term by the coefficient of ' + t('y') + ': the result is ' + t('y=mx+b') + '.', 'Read ' + t('m') + ' (the coefficient of ' + t('x') + ') and ' + t('b') + ' (the constant).'], o.text || 'slope/y-int of ' + gT(A, Bc, C));
    p.bad = [[fT(-m), fT(b)], [fT(m), fT(-b)], [fT(b), fT(m)]].filter(function (x) { return !(x[0] === fT(m) && x[1] === fT(b)); });
    return p;
  }
  function numPart(prompt, ans, diag, sol, hints, text) { return KP.number(prompt, ans, diag, sol, hints, text); }

  /* ================= assignment generators ================= */
  /* Q5 lines */
  function q5(r, kind) {
    if (kind === 'a') { var A = r.int(2, 6), k = r.int(1, 6); return [A, 1, -A * k]; }               // 2x + y − 6 = 0
    if (kind === 'b') { var A2 = r.int(2, 6), k2 = r.int(1, 5); return [A2, -1, -A2 * k2]; }          // 3x − y − 9 = 0
    if (kind === 'c') { var B3 = r.int(2, 6), k3 = r.int(1, 4); return [1, B3, -B3 * k3]; }           // x + 4y − 8 = 0
    var o = pickWhere(function () { return { A: r.int(2, 6), Bc: r.int(2, 5), j: r.pick([1, 1, 2]) }; }, function (o) { return o.A !== o.Bc && lcm(o.A, o.Bc) * o.j <= 30 && lcm(o.A, o.Bc) > Math.max(o.A, o.Bc); });   // 5x − 2y − 10 = 0
    return [o.A, -o.Bc, -lcm(o.A, o.Bc) * o.j];
  }

  /* ================= Extra practice helpers ================= */
  var FR = [[1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [4, 3], [3, 2], [2, 1], [5, 2], [3, 1], [7, 2], [5, 4], [2, 5], [5, 3], [7, 3]];
  function slopeOfL(L3) { return -L3[0] / L3[1]; }
  function pairMaker(r, kind) {
    var o = pickWhere(function () { return { a: r.int(1, 5), b: r.int(2, 6), s: r.pick([2, 3]), c: r.pick(pm(1, 9)), d: r.pick(pm(1, 9)) }; },
      function (o) { return cop(o.a, o.b) && o.a !== o.b; });
    if (kind === 'par') return [[o.a, -o.b, o.c], [o.s * o.a, -o.s * o.b, o.d === o.s * o.c ? o.d + 1 : o.d]];
    if (kind === 'perp') return [[o.a, o.b, -Math.abs(o.c)], [o.b, -o.a, o.d]];
    if (kind === 'swap') { var a = o.a === 1 ? 1 : o.a; return [[a, o.b, -Math.abs(o.c)], [o.b, a, -Math.abs(o.c)]]; }
    return [[2 * o.a, 2 * o.b, -Math.abs(o.c)], [2 * o.b, -2 * o.a, o.d]];   // perp, both with a common factor
  }
  function classPart(r, kind) {
    var pr = pairMaker(r, kind), L1 = pr[0], L2 = pr[1], m1 = slopeOfL(L1), m2 = slopeOfL(L2);
    var right = near(m1, m2) ? 'par' : near(m1 * m2, -1) ? 'perp' : 'none';
    var sm = function (L3) { return t('m=-\\frac{' + L3[0] + '}{' + L3[1] + '}=' + fT(slopeOfL(L3))); };
    var sol = 'Slopes: ' + sm(L1) + ' and ' + sm(L2) + '.<br>' + (right === 'par' ? 'Equal slopes: <b>parallel</b>.' : right === 'perp' ? t('\\left(' + fT(m1) + '\\right)\\left(' + fT(m2) + '\\right)=-1') + ': negative reciprocals, so <b>perpendicular</b>.' : 'Not equal, and ' + t('\\left(' + fT(m1) + '\\right)\\left(' + fT(m2) + '\\right)=' + fT(m1 * m2)) + ', not ' + t('-1') + ': <b>neither</b>. (The fraction was flipped but the sign wasn’t changed.)');
    var p = mc(r, t(gT(L1[0], L1[1], L1[2])) + ' &nbsp;and&nbsp; ' + t(gT(L2[0], L2[1], L2[2])), [
      { html: 'Parallel', right: right === 'par', why: 'Work out both slopes ' + t('m=-\\frac{A}{B}') + ': they aren’t equal.' },
      { html: 'Perpendicular', right: right === 'perp', why: right === 'par' ? 'The slopes are equal, so the lines are parallel.' : 'Multiply the slopes: the product is ' + t(fT(m1 * m2)) + ', not ' + t('-1') + '. Perpendicular slopes have opposite signs <b>and</b> are reciprocals.' },
      { html: 'Neither', right: right === 'none', why: right === 'par' ? 'Work out both slopes and reduce them: they are equal.' : 'Multiply the slopes: ' + t('\\left(' + fT(m1) + '\\right)\\left(' + fT(m2) + '\\right)=-1') + '.' }],
      sol, ['Write ' + t('m=-\\frac{A}{B}') + ' for each line and reduce. Equal slopes → parallel; slopes that multiply to ' + t('-1') + ' → perpendicular.'], 'classify pair ' + kind, true);
    p.tries = 1; p.input.columns = 3;
    return p;
  }

  var EXTRA = [
    /* ---------- Part A ---------- */
    { num: '1', section: 'Extra practice A — Clearing denominators into general form', stem: '<b>Proper general form</b> means ' + t('Ax+By+C=0') + ' where ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ' are integers, no fractions appear, ' + t('A') + ' is positive, and ' + t('0') + ' stands alone on the right side. Convert each equation to proper general form.', parts: [
      { id: 'e1a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { p: r.int(1, 7), q: r.int(2, 6), b: -r.int(1, 9) }; }, function (o) { return cop(o.p, o.q); }); return convPart(null, [o.p, o.q], [o.b, 1]); } },
      { id: 'e1b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.int(1, 7), q: r.int(2, 6), b: r.int(1, 9) }; }, function (o) { return cop(o.p, o.q); }); return convPart(null, [-o.p, o.q], [o.b, 1]); } },
      { id: 'e1c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { p: r.int(3, 9), q: r.pick([2, 3, 4]), b: -r.int(1, 9) }; }, function (o) { return cop(o.p, o.q) && o.p > o.q; }); return convPart(null, [o.p, o.q], [o.b, 1]); } },
      { id: 'e1d', level: 'PRG', make: function (r) { var q = r.int(4, 8), b = r.int(1, 9); return convPart(null, [-1, q], [b, 1]); } }] },
    { num: '2', stem: 'Now <b>both</b> the slope and the ' + t('y') + '-intercept are fractions, so the common denominator has to clear two fractions at once. Convert each equation to proper general form.', parts: [
      { id: 'e2a', level: 'PRG', make: function (r) {   // denominators coprime: LCD = product
        var o = pickWhere(function () { var d = r.pick([[4, 3], [3, 2], [2, 5], [3, 4], [5, 2], [2, 3], [5, 3], [4, 5]]); return { q: d[0], s: d[1], p: r.int(1, 7), u: r.int(1, 5) }; }, function (o) { return cop(o.p, o.q) && cop(o.u, o.s) && cop(o.q, o.s) && o.q * o.s <= 15; });
        return convPart(null, [o.p, o.q], [-o.u, o.s]);
      } },
      { id: 'e2b', level: 'ADV', make: function (r) {   // LCD smaller than the product (6 and 4 → 12)
        var o = pickWhere(function () { var d = r.pick([[6, 4], [4, 6], [6, 8], [10, 4], [4, 10], [6, 9]]); return { q: d[0], s: d[1], p: r.int(1, 9), u: r.int(1, 7) }; }, function (o) { return cop(o.p, o.q) && cop(o.u, o.s) && o.p !== o.q; });
        return convPart(null, [-o.p, o.q], [o.u, o.s]);
      } },
      { id: 'e2c', level: 'PRG', make: function (r) {   // one denominator is the LCD
        var o = pickWhere(function () { var d = r.pick([[5, 10], [2, 4], [3, 6], [2, 6], [4, 8], [3, 9], [2, 8]]); return { q: d[0], s: d[1], p: r.int(1, 7), u: r.int(1, 9) }; }, function (o) { return cop(o.p, o.q) && cop(o.u, o.s) && o.u < o.s; });
        return convPart(null, [o.p, o.q], [o.u, o.s]);
      } },
      { id: 'e2d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var d = r.pick([[2, 8], [2, 4], [3, 6], [4, 8], [2, 6]]); return { q: d[0], s: d[1], p: r.int(1, 9), u: r.int(1, 7) }; }, function (o) { return cop(o.p, o.q) && cop(o.u, o.s) && o.p > o.q; });
        return convPart(null, [-o.p, o.q], [-o.u, o.s]);
      } }] },
    { num: '3', stem: 'Convert each equation to slope–intercept form, ' + t('y=mx+b') + '. Watch every sign when the coefficient of ' + t('y') + ' is negative, and simplify any fraction fully.', parts: [
      { id: 'e3a', level: 'PRG', make: function (r) {   // 6x − 9y + 18 = 0: common factor, B < 0, integer b
        var o = pickWhere(function () { return { a: r.int(1, 4), b: r.int(2, 5), g: r.pick([2, 3]), k: r.int(1, 4) }; }, function (o) { return cop(o.a, o.b) && o.a !== o.b; });
        return toSIPart(t(gT(o.g * o.a, -o.g * o.b, o.g * o.b * o.k)), o.g * o.a, -o.g * o.b, o.g * o.b * o.k);
      } },
      { id: 'e3b', level: 'PRG', make: function (r) {   // 10x + 4y − 14 = 0: everything becomes a half
        var o = pickWhere(function () { return { a: r.pick([1, 3, 5, 7, 9, 11]), c: r.pick([1, 3, 5, 7, 9, 11, 13]) }; }, function (o) { return o.a !== o.c; });
        return toSIPart(t(gT(2 * o.a, 4, -2 * o.c)), 2 * o.a, 4, -2 * o.c);
      } },
      { id: 'e3c', level: 'EMG', make: function (r) {   // 7x − 3y − 6 = 0
        var o = pickWhere(function () { return { A: r.int(2, 9), Bc: r.pick([2, 3, 4, 5]), k: r.int(1, 4) }; }, function (o) { return cop(o.A, o.Bc); });
        return toSIPart(t(gT(o.A, -o.Bc, -o.Bc * o.k)), o.A, -o.Bc, -o.Bc * o.k);
      } },
      { id: 'e3d', level: 'PRG', make: function (r) {   // 2x − 12y + 9 = 0: both fractions
        var o = pickWhere(function () { return { A: r.int(1, 5), Bc: r.pick([6, 8, 10, 12]), C: r.int(1, 11) }; }, function (o) { var m = toFr(o.A / o.Bc), b = toFr(o.C / o.Bc); return m[1] > 1 && b[1] > 1 && m[1] !== o.Bc; });
        return toSIPart(t(gT(o.A, -o.Bc, o.C)), o.A, -o.Bc, o.C);
      } }] },
    /* ---------- Part B ---------- */
    { num: '4', section: 'Extra practice B — Reading a line straight out of general form',
      shared: function (r) {
        var a = pickWhere(function () { return { A: r.int(2, 7), C: r.int(2, 9) }; }, function (o) { return true; });
        var b = pickWhere(function () { return { A: r.int(2, 7), Bc: r.int(2, 7), C: r.int(2, 12) }; }, function (o) { return cop(o.A, o.Bc) && o.A !== o.Bc; });
        var c = { q: r.pick([2, 3, 4]), C: r.int(2, 9) };
        var d = pickWhere(function () { return { A: r.int(2, 7), Bc: r.int(2, 7), C: r.int(2, 11) }; }, function (o) { return cop(o.A, o.Bc) && o.A !== o.Bc; });
        var e = pickWhere(function () { return { A: r.int(2, 7), Bc: r.int(2, 7), C: r.int(2, 15) }; }, function (o) { return cop(o.A, o.Bc) && o.A !== o.Bc; });
        return { a: a, b: b, c: c, d: d, e: e,
          tex: { a: lin([[a.A, 'x'], [-1, 'y']]) + '=' + a.C, b: gT(-b.A, b.Bc, b.C), c: '\\frac{1}{' + c.q + '}x+y-' + c.C + '=0', d: lin([[d.A, 'x']]) + '=' + lin([[d.Bc, 'y'], [-d.C, '']]), e: gT(e.A, e.Bc, -e.C) } };
      },
      stem: function (sh) { return 'Decide whether each equation is written in <b>proper general form</b>. If it is not, find the rule it breaks and rewrite it correctly.<br>' + ['a', 'b', 'c', 'd', 'e'].map(function (k) { return '(' + k + ') ' + t(sh.tex[k]); }).join(' &nbsp;&nbsp; '); },
      parts: [
        { id: 'e4', sub: 'rules', level: 'BEG', make: function (r, sh) {
          var rows = ['a', 'b', 'c', 'd', 'e'].map(function (k) { return { id: k, html: '(' + k + ') <span style="white-space:nowrap">' + t(sh.tex[k]) + '</span>' }; });
          var cols = [{ id: 'zero', html: 'Right side not ' + t('0') }, { id: 'neg', html: t('A') + ' negative' }, { id: 'frac', html: 'Fraction' }, { id: 'ok', html: 'Proper' }];
          var want = { a: 'zero', b: 'neg', c: 'frac', d: 'zero', e: 'ok' };
          return KP.grid('Choose the rule each equation breaks (or “already proper”).', rows, cols, want, { why: function (row) { return { a: 'Look at (a): is the right side ' + t('0') + '?', b: 'Look at (b): what is the sign of the ' + t('x') + '-term?', c: 'Look at (c): are all the coefficients integers?', d: 'Look at (d): where are the terms?', e: 'Look at (e): integers, ' + t('A') + ' positive, ' + t('=0') + ' — does it break any rule?' }[row]; } },
            '(a) the constant ' + t(sh.a.C) + ' is on the right side. (b) ' + t('A=-' + sh.b.A) + ' is negative. (c) ' + t('\\frac{1}{' + sh.c.q + '}') + ' is a fraction. (d) there are terms on both sides (so the right side isn’t ' + t('0') + '). (e) breaks no rule — it is already in proper general form.',
            ['Check each rule in turn: everything on the left with ' + t('0') + ' on the right; ' + t('A') + ' positive; integers only.'], 'proper general form rules');
        } },
        { id: 'e4a', sub: 'a', level: 'BEG', make: function (r, sh) { var o = sh.a; return linePart('Rewrite (a) ' + t(sh.tex.a) + ' in proper general form.', { A: o.A, B: -1, C: -o.C }, 'general', [{ is: { A: o.A, B: -1, C: o.C }, code: 'l5-c-sign', hint: 'When ' + t(o.C) + ' moves to the left side it becomes ' + t('-' + o.C) + '.' }], 'Subtract ' + t(o.C) + ' from both sides: ' + t(gT(o.A, -1, -o.C)) + '.', ['Move the constant to the left side, so the right side is ' + t('0') + '.'], 'proper form (a)', { bad: [lin([[o.A, 'x'], [-1, 'y']]) + '=' + o.C, gT(o.A, -1, o.C)] }); } },
        { id: 'e4b', sub: 'b', level: 'BEG', make: function (r, sh) { var o = sh.b; return negAPart('Rewrite (b) ' + t(sh.tex.b) + ' in proper general form.', -o.A, o.Bc, o.C, 'proper form (b)'); } },
        { id: 'e4c', sub: 'c', level: 'EMG', make: function (r, sh) { var o = sh.c; return linePart('Rewrite (c) ' + t(sh.tex.c) + ' in proper general form.', { A: 1, B: o.q, C: -o.q * o.C }, 'general', [{ is: { A: 1, B: 1, C: -o.q * o.C }, code: 'gf-no-y', hint: 'Multiply <b>every</b> term by ' + t(o.q) + ' — the ' + t('y') + '-term too.' }, { is: { A: 1, B: o.q, C: -o.C }, code: 'gf-no-const', hint: 'Multiply <b>every</b> term by ' + t(o.q) + ' — the constant too.' }], 'Multiply every term by ' + t(o.q) + ': ' + t(gT(1, o.q, -o.q * o.C)) + '.', ['Multiply every term by the denominator, ' + t(o.q) + '.'], 'proper form (c)', { bad: [sh.tex.c, gT(1, o.q, -o.C)] }); } },
        { id: 'e4d', sub: 'd', level: 'EMG', make: function (r, sh) { var o = sh.d; return linePart('Rewrite (d) ' + t(sh.tex.d) + ' in proper general form.', { A: o.A, B: -o.Bc, C: o.C }, 'general', [{ is: { A: o.A, B: o.Bc, C: -o.C }, code: 'u7l7-some-signs', hint: 'When the terms ' + t(lin([[o.Bc, 'y'], [-o.C, '']])) + ' move to the left side, <b>both</b> change sign.' }, { is: { A: o.A, B: -o.Bc, C: -o.C }, code: 'l5-c-sign', hint: 'When ' + t('-' + o.C) + ' moves to the left side it becomes ' + t('+' + o.C) + '.' }], 'Subtract ' + t(o.Bc + 'y') + ' and add ' + t(o.C) + ' on both sides: ' + t(gT(o.A, -o.Bc, o.C)) + '.', ['Move every term to the side with the ' + t('x') + '-term; each one changes sign as it crosses.'], 'proper form (d)', { bad: [sh.tex.d, gT(o.A, o.Bc, -o.C)] }); } }] },
    { num: '5', stem: 'State the slope and <b>both</b> intercepts of each line, without converting to slope–intercept form. (For ' + t('Ax+By+C=0') + ' the slope is ' + t('m=-\\frac{A}{B}') + '.)', parts: [
      { id: 'e5a', level: 'PRG', outcome: 'RF5', make: function (r) {   // 4x − 5y − 20 = 0
        var o = pickWhere(function () { return { A: r.int(2, 6), Bc: r.int(2, 6), j: r.pick([1, 1, 2]) }; }, function (o) { return cop(o.A, o.Bc) && o.A * o.Bc * o.j <= 40; });
        return mIntFields(o.A, -o.Bc, -o.A * o.Bc * o.j);
      } },
      { id: 'e5b', level: 'PRG', outcome: 'RF5', make: function (r) {   // 3x + 8y + 24 = 0
        var o = pickWhere(function () { return { A: r.int(2, 6), Bc: r.int(2, 8), j: r.pick([1, 1, 2]) }; }, function (o) { return cop(o.A, o.Bc) && o.A !== o.Bc && o.A * o.Bc * o.j <= 48; });
        return mIntFields(o.A, o.Bc, o.A * o.Bc * o.j);
      } },
      { id: 'e5c', level: 'EMG', make: function (r) {
        return mc(r, 'Why are the intercepts quicker to find from general form, while the slope is quicker to read from slope–intercept form?', [
          { html: 'In general form, substituting ' + t('y=0') + ' or ' + t('x=0') + ' wipes out a whole term and leaves a one-step equation. Slope–intercept form shows ' + t('m') + ' with no work, but its ' + t('x') + '-intercept needs solving ' + t('0=mx+b') + '.', right: true },
          { html: 'General form shows the intercepts directly: they are ' + t('A') + ' and ' + t('B') + '.', why: 'The coefficients aren’t the intercepts. In ' + t('2x+y-6=0') + ' the ' + t('x') + '-intercept is ' + t('3') + ', not ' + t('2') + '.' },
          { html: 'Slope–intercept form has no ' + t('x') + '-intercept.', why: 'Every slanted line crosses the ' + t('x') + '-axis — slope–intercept form just doesn’t show where.' },
          { html: 'General form is quicker for everything; slope–intercept form is only quicker for graphing.', why: 'In general form the slope is hidden: you have to solve for ' + t('y') + ' (or use ' + t('-\\frac{A}{B}') + ') to see it.' }],
          'In ' + t('Ax+By+C=0') + ', ' + t('y=0') + ' leaves ' + t('Ax+C=0') + ' and ' + t('x=0') + ' leaves ' + t('By+C=0') + ' — one step each. In ' + t('y=mx+b') + ' the slope ' + t('m') + ' (and ' + t('b') + ') is on display, but the ' + t('x') + '-intercept means solving ' + t('0=mx+b') + '.', ['What happens to ' + t('Ax+By+C=0') + ' when you substitute ' + t('y=0') + '?'], 'why each form');
      } }] },
    { num: '6', stem: 'Two equations describe the <b>same line</b> exactly when one is a multiple of the other — every coefficient, the constant included, scaled by the same number. Decide whether each pair describes the same line.', parts: [
      { id: 'e6a', level: 'EMG', make: function (r) { return samePart(r, 'up'); } },
      { id: 'e6b', level: 'EMG', make: function (r) { return samePart(r, 'down'); } },
      { id: 'e6c', level: 'PRG', make: function (r) { return samePart(r, 'par'); } }] },
    { num: '7', stem: 'From ' + t('Ax+By+C=0') + ' the slope is ' + t('m=-\\frac{A}{B}') + ', so two lines can be compared without converting either one. Decide whether each pair is parallel, perpendicular, or neither.', parts: [
      { id: 'e7a', level: 'EMG', make: function (r) { return classPart(r, 'par'); } },
      { id: 'e7b', level: 'EMG', make: function (r) { return classPart(r, 'perp'); } },
      { id: 'e7c', level: 'PRG', make: function (r) { return classPart(r, 'swap'); } },
      { id: 'e7d', level: 'EMG', make: function (r) { return classPart(r, 'perp2'); } }] },
    { num: '8', stem: 'Order four lines from <b>least steep</b> to <b>steepest</b> using only ' + t('m=-\\frac{A}{B}') + '. (Steepness compares the size of the slope, ignoring its sign.)', parts: [
      { id: 'e8', level: 'PRG', make: function (r) {
        var sl = r.sample(FR, 4), signs = r.shuffle([1, -1, r.pick([1, -1]), r.pick([1, -1])]), labels = ['a', 'b', 'c', 'd'];
        var lines = sl.map(function (f, i) { var Lr = red(signs[i] * f[0], -f[1], r.pick(pm(1, 9))); return { L: Lr, m: signs[i] * f[0] / f[1], size: f[0] / f[1] }; });
        lines.forEach(function (x, i) { x.id = labels[i]; x.tex = rT(x.L); });
        var sorted = lines.slice().sort(function (a, b) { return a.size - b.size; });
        var p = KP.order(r, 'Put the equations in order, from least steep to steepest.', sorted.map(function (x) { return { id: x.id, tex: x.tex }; }), { first: 'least steep', last: 'steepest' },
          'Slopes ' + t('-\\frac{A}{B}') + ': ' + lines.map(function (x) { return t(x.tex) + ' has ' + t('m=' + fT(x.m)); }).join('; ') + '.<br>Sizes: ' + t(sorted.map(function (x) { return fT(x.size); }).join('<')) + ', so the order is ' + sorted.map(function (x) { return t(x.tex); }).join(', ') + '.',
          ['Find each slope with ' + t('-\\frac{A}{B}') + ', then ignore the signs and compare the sizes.'], 'order by steepness');
        return p;
      } }] },
    /* ---------- Part C ---------- */
    { num: '9', section: 'Extra practice C — Errors, working backwards, and context', shared: function (r) { return { m: r.int(2, 9), b: r.int(1, 9) }; },
      stem: function (sh) { return 'Priya converted ' + t(siT(sh.m, -sh.b)) + ' to general form and wrote ' + t(gT(sh.m, 1, -sh.b)) + '.'; }, parts: [
      { id: 'e9a', sub: 'a', level: 'BEG', make: function (r, sh) {
        return linePart('Show that Priya’s equation is a <b>different</b> line: convert it back to slope–intercept form.', { m: -sh.m, b: sh.b }, 'slope-intercept', [{ is: { m: sh.m, b: -sh.b }, code: 'u7l7-x-sign', hint: 'Convert <b>her</b> equation, ' + t(gT(sh.m, 1, -sh.b)) + ': subtract ' + t(sh.m + 'x') + ' and add ' + t(sh.b) + ' on both sides.' }],
          t(gT(sh.m, 1, -sh.b)) + ' → ' + t(siT(-sh.m, sh.b)) + '. That has slope ' + t(-sh.m) + ', not ' + t(sh.m) + ' — a different line.', ['Get ' + t('y') + ' by itself in ' + t(gT(sh.m, 1, -sh.b)) + '.'], 'Priya back to y=mx+b');
      } },
      { id: 'e9b', sub: 'b', level: 'EMG', make: function (r, sh) {
        return mc(r, 'What single mistake did Priya make?', [
          { html: 'She moved ' + t(sh.m + 'x') + ' to the other side without changing its sign.', right: true },
          { html: 'She forgot to make ' + t('A') + ' positive.', why: 'Her ' + t('A') + ' is ' + t(sh.m) + ', which is positive. The problem is a sign that didn’t change when a term moved.' },
          { html: 'She moved the constant without changing its sign.', why: 'Her constant is ' + t('-' + sh.b) + ', as it should be. Look at the ' + t('x') + '-term and the ' + t('y') + '-term: only one of them may change sign.' },
          { html: 'She didn’t clear the fractions.', why: 'There are no fractions here.' }],
          'From ' + t(siT(sh.m, -sh.b)) + ', moving ' + t('y') + ' to the right gives ' + t('0=' + sh.m + 'x-y-' + sh.b) + '. Priya kept ' + t('+y') + ' and ' + t('+' + sh.m + 'x') + ' together on one side, so one of them crossed without changing sign.', ['Compare her equation with the right one term by term.'], 'Priya mistake');
      } },
      { id: 'e9c', sub: 'c', level: 'BEG', make: function (r, sh) { return convPart('Give the correct general form of ' + t(siT(sh.m, -sh.b)) + '.', [sh.m, 1], [-sh.b, 1]); } }] },
    { num: '10', shared: function (r) { return pickWhere(function () { return { p: r.int(1, 7), q: r.int(2, 6), c: r.int(1, 9) }; }, function (o) { return cop(o.p, o.q) && o.p !== o.q; }); },
      stem: function (sh) { return 'Omar converted ' + t(siT(sh.p / sh.q, sh.c)) + ' and wrote ' + t('\\frac{' + sh.p + '}{' + sh.q + '}x-y+' + sh.c + '=0') + '. His equation <b>is</b> the same line.'; }, parts: [
      { id: 'e10a', sub: 'a', level: 'EMG', make: function (r, sh) {
        return mc(r, 'So why is it still marked wrong?', [
          { html: 'General form needs <b>integer</b> coefficients, and ' + t('\\frac{' + sh.p + '}{' + sh.q + '}') + ' is a fraction.', right: true },
          { html: 'It is a different line from ' + t(siT(sh.p / sh.q, sh.c)) + '.', why: 'It is the same line: solve it for ' + t('y') + ' and you get ' + t(siT(sh.p / sh.q, sh.c)) + ' back.' },
          { html: t('A') + ' must be negative.', why: t('A') + ' should be <b>positive</b> — and here it is.' },
          { html: 'The constant must come first.', why: 'The order of the terms isn’t a rule; ' + t('Ax+By+C=0') + ' just lists the ' + t('x') + '-term first by habit.' }],
          'Proper general form has integers only. Multiply every term by ' + t(sh.q) + ' to clear the fraction.', ['Read the definition of proper general form again.'], 'Omar why wrong');
      } },
      { id: 'e10b', sub: 'b', level: 'EMG', make: function (r, sh) { return convPart('Finish the job properly: write ' + t(siT(sh.p / sh.q, sh.c)) + ' in proper general form.', [sh.p, sh.q], [sh.c, 1]); } }] },
    { num: '11', stem: '<b>Work backwards.</b> Each equation is missing one number. Substitute the information given and solve for it.', parts: [
      { id: 'e11a', level: 'PRG', make: function (r) {   // 3x − 4y + C = 0 through (2, −1)
        var o = pickWhere(function () { return { A: r.int(2, 6), Bc: -r.int(2, 6), x0: r.int(1, 5), y0: -r.int(1, 5) }; }, function (o) { return o.A !== -o.Bc && o.A * o.x0 + o.Bc * o.y0 !== 0; });
        var C = -(o.A * o.x0 + o.Bc * o.y0), slip = -(o.A * o.x0 - o.Bc * o.y0);
        return numPart('Find ' + t('C') + ' so that ' + t(lin([[o.A, 'x'], [o.Bc, 'y']]) + '+C=0') + ' passes through ' + t(pT([o.x0, o.y0])) + '.', C, function (v) {
          if (v === -C) return { code: 'gf-k-sign', hint: t(o.A * o.x0 + o.Bc * o.y0 + '+C=0') + ' — subtract ' + t(o.A * o.x0 + o.Bc * o.y0) + ' from both sides.' };
          if (v === slip || v === -slip) return { code: 'gf-sub-sign', hint: 'Careful with ' + t(o.Bc + prn(o.y0)) + ': a negative times a negative is positive.' };
          return null;
        }, 'Substitute ' + t('x=' + o.x0) + ', ' + t('y=' + o.y0) + ': ' + t(o.A + prn(o.x0) + (o.Bc < 0 ? '' : '+') + o.Bc + prn(o.y0) + '+C=0') + ', so ' + t((o.A * o.x0 + o.Bc * o.y0) + '+C=0') + ' and ' + t('C=' + C) + '.', ['Replace ' + t('x') + ' and ' + t('y') + ' with the coordinates of the point, then solve for ' + t('C') + '.'], 'find C through point');
      } },
      { id: 'e11b', level: 'PRG', make: function (r) {   // Ax + 3y − 12 = 0 with x-intercept 4
        var o = pickWhere(function () { return { A: r.int(2, 6), Bc: r.int(2, 6), p: r.int(2, 6) }; }, function (o) { return o.p !== o.Bc; });
        var C = o.A * o.p;
        return numPart('Find ' + t('A') + ' so that ' + t('Ax+' + o.Bc + 'y-' + C + '=0') + ' has an ' + t('x') + '-intercept of ' + t(o.p) + '.', o.A, function (v) {
          if (v === -o.A) return { code: 'gf-k-sign', hint: t(o.p + 'A-' + C + '=0') + ' gives ' + t(o.p + 'A=' + C) + ' — check the sign.' };
          if (v === C * o.p) return { code: 'gf-k-mult', hint: t(o.p + 'A=' + C) + ' means ' + t('A=\\frac{' + C + '}{' + o.p + '}') + ' — divide, don’t multiply.' };
          if (near(v, C / o.Bc) && !near(C / o.Bc, o.A)) return { code: 'gf-swap-ab', hint: 'The ' + t('x') + '-intercept is the point ' + t('(' + o.p + ',\\ 0)') + ': substitute ' + t('x=' + o.p) + ' and ' + t('y=0') + ', so the ' + t('y') + '-term disappears.' };
          return null;
        }, 'The ' + t('x') + '-intercept is the point ' + t('(' + o.p + ',\\ 0)') + '. Substitute: ' + t('A(' + o.p + ')+' + o.Bc + '(0)-' + C + '=0') + ', so ' + t(o.p + 'A=' + C) + ' and ' + t('A=' + o.A) + '.', ['An ' + t('x') + '-intercept of ' + t(o.p) + ' is the point ' + t('(' + o.p + ',\\ 0)') + '. Substitute it.'], 'find A from x-int');
      } },
      { id: 'e11c', level: 'ADV', make: function (r) {   // 5x + By − 20 = 0 with slope −5/2
        var o = pickWhere(function () { return { A: r.int(2, 9), Bc: r.int(2, 9), C: r.int(4, 30) }; }, function (o) { return o.A !== o.Bc && toFr(o.A / o.Bc)[1] > 1; });
        var s = -o.A / o.Bc;
        return numPart('Find ' + t('B') + ' so that ' + t(o.A + 'x+By-' + o.C + '=0') + ' has slope ' + t(fT(s)) + '.', o.Bc, function (v) {
          if (v === -o.Bc) return { code: 'gf-k-sign', hint: 'The slope is ' + t('-\\frac{' + o.A + '}{B}') + '. For it to be negative, ' + t('B') + ' must be positive.' };
          if (near(v, o.A * o.A / o.Bc) || near(v, -o.A * o.A / o.Bc)) return { code: 'gf-swap-ab', hint: 'The slope is ' + t('-\\frac{A}{B}') + ' — the coefficient of ' + t('x') + ' goes on top.' };
          return null;
        }, 'Solve for ' + t('y') + ': ' + t('By=-' + o.A + 'x+' + o.C) + ', so the slope is ' + t('-\\frac{' + o.A + '}{B}') + '.<br>' + t('-\\frac{' + o.A + '}{B}=' + fT(s)) + ' gives ' + t('B=' + o.Bc) + '. (Check: ' + t('-\\frac{' + o.A + '}{' + o.Bc + '}=' + fT(s)) + ' ✓)', ['Write the slope of ' + t(o.A + 'x+By-' + o.C + '=0') + ' in terms of ' + t('B') + ' (solve for ' + t('y') + ').', 'Set it equal to ' + t(fT(s)) + ' and solve.'], 'find B from slope');
      } }] },
    { num: '12', parts: [
      { id: 'e12', level: 'ADV', make: function (r) {   // 2x + 5y + C = 0 with y-intercept 3
        var o = pickWhere(function () { return { A: r.int(2, 6), Bc: r.int(2, 7), k: r.int(1, 6) }; }, function (o) { return cop(o.A, o.Bc) && (o.Bc * o.k) % o.A !== 0; });
        var C = -o.Bc * o.k, xi = o.Bc * o.k / o.A;
        var cBox = K.number(C, function (v) { if (v === -C) return { code: 'gf-k-sign', hint: t(o.Bc + '(' + o.k + ')+C=0') + ', so ' + t('C=-' + o.Bc * o.k) + '.' }; if (v === -o.k || v === o.k) return { code: 'gf-b-undivided', hint: 'Substitute the point ' + t('(0,\\ ' + o.k + ')') + ': the ' + t('y') + '-term becomes ' + t(o.Bc + '(' + o.k + ')') + '.' }; return null; });
        var p = KP.fields('Find ' + t('C') + ' so that ' + t(lin([[o.A, 'x'], [o.Bc, 'y']]) + '+C=0') + ' has a ' + t('y') + '-intercept of ' + t(o.k) + '. Then state the ' + t('x') + '-intercept of that line.',
          [{ label: t('C') + ' =', name: 'C', mode: 'math', keys: 'u7val', placeholder: 'e.g. -12' }, { label: t('x') + '-intercept:', name: 'x-intercept', mode: 'math', keys: 'u7val', placeholder: PH.v }],
          [function (resp) { var s = String(resp == null ? '' : resp).replace(/^C=/, ''); return cBox(s); }, intBox('x', o.A, o.Bc, C)], [String(C), pK([xi, 0])], t('C=' + C) + ', ' + t('x') + '-intercept ' + t(pT([xi, 0])),
          'Substitute ' + t('(0,\\ ' + o.k + ')') + ': ' + t(o.A + '(0)+' + o.Bc + '(' + o.k + ')+C=0') + ', so ' + t('C=' + C) + ' and the line is ' + t(gT(o.A, o.Bc, C)) + '.<br>' + t('x') + '-intercept: ' + t('y=0') + ' gives ' + t(o.A + 'x' + C + '=0') + ', so ' + t('x=' + fT(xi)) + ' → ' + t(pT([xi, 0])) + '.',
          ['A ' + t('y') + '-intercept of ' + t(o.k) + ' is the point ' + t('(0,\\ ' + o.k + ')') + ': substitute it to find ' + t('C') + '.', 'Then set ' + t('y=0') + ' in the finished equation.'], 'find C then x-int');
        p.bad = [[String(-C), pK([xi, 0])], [String(C), pK([-xi, 0])]];
        return p;
      } }] },
    { num: '13', shared: function (r) {
        var o = pickWhere(function () { return { p: r.pick([3, 4, 5, 6, 7]), q: r.pick([2, 3, 4]), n: r.int(2, 8) }; }, function (o) { return o.p !== o.q && cop(o.p, o.q) && o.p * o.q * o.n <= 100 && o.p * o.q * o.n >= 20; });
        o.M = o.p * o.q * o.n; return o;
      },
      stem: function (sh) { return '<b>Budget line.</b> A student has $' + sh.M + ' to spend at a concession stand. Slices of pizza cost $' + sh.p + ' and drinks cost $' + sh.q + '. If ' + t('x') + ' is the number of slices and ' + t('y') + ' is the number of drinks, the possible purchases satisfy ' + t(sh.p + 'x+' + sh.q + 'y=' + sh.M) + '.'; }, parts: [
      { id: 'e13a', sub: 'a', level: 'BEG', make: function (r, sh) { return linePart('Rewrite the relation in proper general form.', { A: sh.p, B: sh.q, C: -sh.M }, 'general', [{ is: { A: sh.p, B: sh.q, C: sh.M }, code: 'l5-c-sign', hint: 'When ' + t(sh.M) + ' moves to the left side it becomes ' + t('-' + sh.M) + '.' }], 'Subtract ' + t(sh.M) + ' from both sides: ' + t(gT(sh.p, sh.q, -sh.M)) + '.', ['Move the constant to the left so the right side is ' + t('0') + '.'], 'budget general form', { bad: [sh.p + 'x+' + sh.q + 'y=' + sh.M, gT(sh.p, sh.q, sh.M)] }); } },
      { id: 'e13b', sub: 'b', level: 'EMG', outcome: 'RF5', make: function (r, sh) { return intFields('Find both intercepts.', sh.p, sh.q, -sh.M); } },
      { id: 'e13b2', sub: 'b meaning', level: 'EMG', outcome: 'RF5', make: function (r, sh) {
        var xi = sh.M / sh.p, yi = sh.M / sh.q;
        return mc(r, 'What does the ' + t('x') + '-intercept, ' + t('(' + xi + ',\\ 0)') + ', mean in this situation?', [
          { html: 'Spending all $' + sh.M + ' on pizza buys ' + xi + ' slices and no drinks.', right: true },
          { html: 'Spending all $' + sh.M + ' on drinks buys ' + xi + ' drinks.', why: t('x') + ' counts slices of pizza. At the ' + t('x') + '-intercept, ' + t('y=0') + ': no drinks at all.' },
          { html: 'Each slice of pizza costs $' + xi + '.', why: 'A slice costs $' + sh.p + '. The intercept is a number of slices, not a price.' },
          { html: 'The student buys ' + xi + ' slices and ' + yi + ' drinks.', why: 'That would cost far more than $' + sh.M + '. At the ' + t('x') + '-intercept the number of drinks is ' + t('0') + '.' }],
          'At the ' + t('x') + '-intercept ' + t('y=0') + ' (no drinks): ' + t(sh.p + 'x=' + sh.M) + ', ' + t('x=' + xi) + ' slices. Likewise the ' + t('y') + '-intercept ' + t('(0,\\ ' + yi + ')') + ' means ' + yi + ' drinks and no pizza.', ['At the ' + t('x') + '-intercept, what is ' + t('y') + '?'], 'budget intercept meaning');
      } },
      { id: 'e13c', sub: 'c', level: 'PRG', make: function (r, sh) {
        return KP.slope('State the slope of the line.', toFr(-sh.p / sh.q), { diag: function (v) { if (near(v, -sh.q / sh.p)) return { code: 'gf-swap-ab', hint: 'Solve for ' + t('y') + ': ' + t(sh.q + 'y=-' + sh.p + 'x+' + sh.M) + ' — divide by the coefficient of ' + t('y') + '.' }; return null; } },
          t(sh.q + 'y=-' + sh.p + 'x+' + sh.M) + ', so ' + t(siT(-sh.p / sh.q, sh.M / sh.q)) + ' and ' + t('m=' + fT(-sh.p / sh.q)) + '.', ['Solve for ' + t('y') + ', or use ' + t('m=-\\frac{A}{B}') + '.'], 'budget slope');
      } },
      { id: 'e13c2', sub: 'c meaning', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
        var f = toFr(sh.p / sh.q);
        return mc(r, 'What does the slope ' + t(fT(-sh.p / sh.q)) + ' mean about trading drinks for pizza?', [
          { html: 'Every ' + f[1] + ' more slice' + (f[1] > 1 ? 's' : '') + ' of pizza means ' + f[0] + ' fewer drinks.', right: true },
          { html: 'Every ' + f[1] + ' more slice' + (f[1] > 1 ? 's' : '') + ' of pizza means ' + f[0] + ' more drinks.', why: 'The slope is negative: buying more pizza leaves less money, so fewer drinks.' },
          { html: 'Every ' + f[0] + ' more slice' + (f[0] > 1 ? 's' : '') + ' of pizza means ' + f[1] + ' fewer drink' + (f[1] > 1 ? 's' : '') + '.', why: 'Slope is rise over run: change in drinks (' + t('y') + ') over change in slices (' + t('x') + ').' },
          { html: 'The student always buys ' + f[0] + ' drink' + (f[0] > 1 ? 's' : '') + ' for every ' + f[1] + ' slice' + (f[1] > 1 ? 's' : '') + ' of pizza.', why: 'The slope is negative: it describes a trade-off along the budget line — more pizza means fewer drinks.' }],
          'Slope ' + t('=\\frac{\\text{change in drinks}}{\\text{change in slices}}=' + fT(-sh.p / sh.q)) + ': ' + f[1] + ' more slice' + (f[1] > 1 ? 's' : '') + ' ($' + f[1] * sh.p + ') cost' + (f[1] > 1 ? '' : 's') + ' the same as ' + f[0] + ' drink' + (f[0] > 1 ? 's' : '') + ' ($' + f[0] * sh.q + '), so the student gives up ' + f[0] + ' drink' + (f[0] > 1 ? 's' : '') + '.', ['Slope = change in ' + t('y') + ' ÷ change in ' + t('x') + '. What are ' + t('x') + ' and ' + t('y') + ' here?'], 'budget slope meaning');
      } }] },
    { num: '14', shared: function (r) {
        var o = pickWhere(function () { return { a: r.pick([10, 12, 15, 20, 12]), b: r.pick([6, 8, 10, 12, 8]), n: r.int(1, 3) }; }, function (o) { return o.a !== o.b && o.a > o.b && toFr(o.a / o.b)[1] > 1 && lcm(o.a, o.b) * o.n <= 160 && lcm(o.a, o.b) * o.n >= 48; });
        o.T = lcm(o.a, o.b) * o.n; if (o.T / o.a < 3) o.T *= 2; return o;
      },
      stem: function (sh) { return '<b>Two jobs.</b> Rani is paid $' + sh.a + ' per lawn mowed and $' + sh.b + ' per hour of babysitting, and she wants to earn exactly $' + sh.T + ' this week. With ' + t('x') + ' lawns and ' + t('y') + ' hours, this is ' + t(gT(sh.a, sh.b, -sh.T)) + '.'; }, parts: [
      { id: 'e14a', sub: 'a', level: 'EMG', outcome: 'RF5', make: function (r, sh) { return intFields('Find both intercepts.', sh.a, sh.b, -sh.T); } },
      { id: 'e14a2', sub: 'a meaning', level: 'EMG', outcome: 'RF5', make: function (r, sh) {
        var yi = sh.T / sh.b, xi = sh.T / sh.a;
        return mc(r, 'What does the ' + t('y') + '-intercept, ' + t('(0,\\ ' + yi + ')') + ', mean?', [
          { html: 'Rani earns the $' + sh.T + ' with ' + yi + ' hours of babysitting and no lawns.', right: true },
          { html: 'Rani mows ' + yi + ' lawns and does no babysitting.', why: t('y') + ' counts hours of babysitting. The ' + t('y') + '-intercept has ' + t('x=0') + ' lawns.' },
          { html: 'Rani earns $' + yi + ' per hour.', why: 'She earns $' + sh.b + ' per hour. The intercept is a number of hours.' },
          { html: 'Rani needs ' + yi + ' hours of babysitting on top of mowing ' + xi + ' lawns.', why: 'Mowing ' + xi + ' lawns already earns all $' + sh.T + '. At the ' + t('y') + '-intercept she mows none.' }],
          t('x=0') + ': ' + t(sh.b + 'y=' + sh.T) + ', ' + t('y=' + yi) + ' — all babysitting, no lawns. Likewise the ' + t('x') + '-intercept ' + t('(' + xi + ',\\ 0)') + ' is ' + xi + ' lawns and no babysitting.', ['At the ' + t('y') + '-intercept, what is ' + t('x') + '?'], 'jobs intercept meaning');
      } },
      { id: 'e14b', sub: 'b', level: 'PRG', make: function (r, sh) {
        return KP.slope('State the slope of the line.', toFr(-sh.a / sh.b), { diag: function (v) { if (near(v, -sh.b / sh.a)) return { code: 'gf-swap-ab', hint: 'Use ' + t('m=-\\frac{A}{B}') + ': the coefficient of ' + t('x') + ' goes on top.' }; return null; } },
          t('m=-\\frac{' + sh.a + '}{' + sh.b + '}=' + fT(-sh.a / sh.b)) + '.', ['Use ' + t('m=-\\frac{A}{B}') + ', or solve for ' + t('y') + '. Reduce the fraction.'], 'jobs slope');
      } },
      { id: 'e14b2', sub: 'b meaning', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
        var f = toFr(sh.a / sh.b);
        return mc(r, 'What does the slope ' + t(fT(-sh.a / sh.b)) + ' mean?', [
          { html: 'Every extra lawn replaces ' + t(fT(sh.a / sh.b)) + ' hours of babysitting (' + f[1] + ' more lawn' + (f[1] > 1 ? 's' : '') + ' → ' + f[0] + ' fewer hours).', right: true },
          { html: 'Every extra lawn adds ' + t(fT(sh.a / sh.b)) + ' hours of babysitting.', why: 'The slope is negative: more lawns means she needs <b>fewer</b> hours to reach the same total.' },
          { html: 'Every extra hour of babysitting replaces ' + t(fT(sh.a / sh.b)) + ' lawns.', why: 'Slope = change in ' + t('y') + ' (hours) per change in ' + t('x') + ' (lawns).' },
          { html: 'She always babysits ' + f[0] + ' hours for every ' + f[1] + ' lawn' + (f[1] > 1 ? 's' : '') + ' she mows.', why: 'The slope is negative: it describes a trade-off — more lawns means fewer hours.' }],
          'One lawn earns $' + sh.a + ', which is ' + t('\\frac{' + sh.a + '}{' + sh.b + '}=' + fT(sh.a / sh.b)) + ' hours of babysitting at $' + sh.b + ' per hour. So each extra lawn means ' + t(fT(sh.a / sh.b)) + ' fewer hours: slope ' + t(fT(-sh.a / sh.b)) + ' hours per lawn.', ['Slope = change in hours ÷ change in lawns.'], 'jobs slope meaning');
      } },
      { id: 'e14b3', sub: 'b points', level: 'PRG', make: function (r, sh) {
        return mc(r, 'Why do only some points on this line make sense for Rani?', [
          { html: 'She can’t mow a negative number of lawns or babysit a negative number of hours, and lawns come in whole numbers — so only points with ' + t('x') + ' a whole number from ' + t('0') + ' to ' + t(sh.T / sh.a) + ' (and ' + t('y\\ge 0') + ') make sense.', right: true },
          { html: 'Only the two intercepts make sense.', why: 'Mixing jobs works too, e.g. some lawns and some hours that still total $' + sh.T + '.' },
          { html: 'Every point on the line makes sense.', why: 'Points past the intercepts have a negative number of lawns or hours.' },
          { html: 'Only points where ' + t('x=y') + ' make sense.', why: 'Nothing requires as many hours as lawns.' }],
          'The line keeps going past both intercepts into negative ' + t('x') + ' or ' + t('y') + ', which is impossible here. Lawns are counted in whole numbers, so only the points between the intercepts with whole-number ' + t('x') + ' (and ' + t('y\\ge 0') + ') fit Rani’s week.', ['Can ' + t('x') + ' or ' + t('y') + ' be negative here? Can ' + t('x') + ' be a fraction?'], 'jobs which points');
      } }] },
    { num: '15', shared: function (r) {
        var o = pickWhere(function () { var A = r.pick([4, 6, 8, 9, 10, 12, 6, 15, 16]); return { A: A, j: r.int(2, 5), y0: -r.pick([1, 2, 3, 4, 6]), s: -r.pick([2, 3, 4, 6]) }; },
          function (o) { var C = o.A * o.j; return (C % -o.y0) === 0 && (o.A % -o.s) === 0 && C / o.y0 !== -o.A / o.s && -o.y0 !== 1 && C / -o.y0 !== o.A; });
        o.C = o.A * o.j; return o;
      },
      stem: function (sh) { return 'A line in general form is ' + t(sh.A + 'x+ky-' + sh.C + '=0') + '.'; }, parts: [
      { id: 'e15a', sub: 'a', level: 'PRG', make: function (r, sh) {
        var k = sh.C / sh.y0;
        return numPart('Find ' + t('k') + ' if the ' + t('y') + '-intercept is ' + t(sh.y0) + '.', k, function (v) {
          if (v === -k) return { code: 'gf-k-sign', hint: t('k(' + sh.y0 + ')=' + sh.C) + ' — divide by ' + t(sh.y0) + ', a negative number.' };
          if (v === sh.C * sh.y0 || v === -sh.C * sh.y0) return { code: 'gf-k-mult', hint: t('k(' + sh.y0 + ')=' + sh.C) + ' means ' + t('k=\\frac{' + sh.C + '}{' + sh.y0 + '}') + ' — divide.' };
          return null;
        }, 'Substitute ' + t('(0,\\ ' + sh.y0 + ')') + ': ' + t(sh.A + '(0)+k(' + sh.y0 + ')-' + sh.C + '=0') + ', so ' + t(sh.y0 + 'k=' + sh.C) + ' and ' + t('k=' + k) + '.', ['The ' + t('y') + '-intercept is the point ' + t('(0,\\ ' + sh.y0 + ')') + '. Substitute it.'], 'k from y-int');
      } },
      { id: 'e15b', sub: 'b', level: 'PRG', make: function (r, sh) {
        var k = -sh.A / sh.s;
        return numPart('Find ' + t('k') + ' if the slope is ' + t(sh.s) + '.', k, function (v) {
          if (v === -k) return { code: 'gf-k-sign', hint: 'The slope is ' + t('-\\frac{' + sh.A + '}{k}') + '. Set it equal to ' + t(sh.s) + ' and check the sign.' };
          if (v === -sh.A * sh.s || v === sh.A * sh.s) return { code: 'gf-k-mult', hint: t('-\\frac{' + sh.A + '}{k}=' + sh.s) + ' gives ' + t(sh.s + 'k=-' + sh.A) + ' — divide.' };
          return null;
        }, 'Solve for ' + t('y') + ': ' + t('ky=-' + sh.A + 'x+' + sh.C) + ', so the slope is ' + t('-\\frac{' + sh.A + '}{k}') + '.<br>' + t('-\\frac{' + sh.A + '}{k}=' + sh.s) + ' → ' + t(sh.s + 'k=-' + sh.A) + ' → ' + t('k=' + k) + '.', ['Write the slope in terms of ' + t('k') + ' and set it equal to ' + t(sh.s) + '.'], 'k from slope');
      } },
      { id: 'e15c', sub: 'c', level: 'EMG', make: function (r, sh) {
        var x0 = sh.C / sh.A;
        return mc(r, 'What happens to the graph when ' + t('k=0') + '?', [
          { html: 'The equation becomes ' + t(sh.A + 'x-' + sh.C + '=0') + ', i.e. ' + t('x=' + x0) + ': a <b>vertical</b> line with undefined slope and no ' + t('y') + '-intercept.', right: true },
          { html: 'It becomes ' + t('y=' + x0) + ': a horizontal line with slope ' + t('0') + '.', why: 'With ' + t('k=0') + ' the ' + t('y') + '-term disappears, so ' + t('x') + ' is the letter left: ' + t('x=' + x0) + '.' },
          { html: 'There is no line at all.', why: t(sh.A + 'x-' + sh.C + '=0') + ' still has solutions: every point with ' + t('x=' + x0) + '.' },
          { html: 'It becomes the line through the origin with slope ' + t(sh.A) + '.', why: 'The constant ' + t('-' + sh.C) + ' is still there, and there is no ' + t('y') + '-term to give a slope.' }],
          t(sh.A + 'x+0y-' + sh.C + '=0') + ' → ' + t(sh.A + 'x=' + sh.C) + ' → ' + t('x=' + x0) + ': every point has ' + t('x=' + x0) + ', a vertical line. Its run is ' + t('0') + ', so its slope is undefined, and it never meets the ' + t('y') + '-axis.', ['Which term disappears when ' + t('k=0') + '? Which letter is left?'], 'k = 0 vertical');
      } }] },
    { num: '16', shared: function (r) {
        return pickWhere(function () { return { a: r.int(2, 5), p: r.int(2, 5), c: r.pick(pm(1, 9)), q: r.pick(pm(1, 9)) }; }, function (o) { return o.a % o.p !== 0 && o.a !== o.p; });
      },
      stem: function (sh) { return '<b>Stretch.</b> Consider the lines ' + t(sh.a + 'x+ky' + (sh.c < 0 ? '' : '+') + sh.c + '=0') + ' and ' + t(gT(sh.p, -1, sh.q)) + '.'; }, parts: [
      { id: 'e16a', sub: 'a', level: 'ADV', make: function (r, sh) {
        var k = sh.a * sh.p, kp = -sh.a / sh.p;
        return numPart('Find the value of ' + t('k') + ' that makes the two lines <b>perpendicular</b>.', k, function (v) {
          if (v === -k) return { code: 'gf-k-sign', hint: 'The slope of the first line is ' + t('-\\frac{' + sh.a + '}{k}') + '; it must be ' + t('-\\frac{1}{' + sh.p + '}') + ' (negative). Check the sign of ' + t('k') + '.' };
          if (near(v, kp) || near(v, -kp)) return { code: 'gf-perp-par', hint: 'That makes the slopes equal (parallel). Perpendicular slopes are negative reciprocals.' };
          return null;
        }, t(gT(sh.p, -1, sh.q)) + ' has slope ' + t(sh.p) + ', so the other line needs slope ' + t('-\\frac{1}{' + sh.p + '}') + '.<br>' + t('-\\frac{' + sh.a + '}{k}=-\\frac{1}{' + sh.p + '}') + ' → ' + t('k=' + k) + '.<br>Check: ' + t('\\left(-\\frac{' + sh.a + '}{' + k + '}\\right)(' + sh.p + ')=-1') + ' ✓', ['Find the slope of ' + t(gT(sh.p, -1, sh.q)) + ' and its negative reciprocal.', 'Write the other slope as ' + t('-\\frac{' + sh.a + '}{k}') + ' and set them equal.'], 'k perpendicular');
      } },
      { id: 'e16b', sub: 'b(i)', level: 'MAS', make: function (r, sh) {
        var kp = [-sh.a, sh.p];
        return KP.fraction('Find the value of ' + t('k') + ' that makes the lines <b>parallel</b>. (It is not an integer.)', kp, { before: t('k='), diag: function (v) {
          if (near(v, sh.a / sh.p)) return { code: 'gf-k-sign', hint: 'The slope ' + t('-\\frac{' + sh.a + '}{k}') + ' must equal ' + t(sh.p) + ' (positive), so ' + t('k') + ' must be negative.' };
          if (near(v, sh.a * sh.p) || near(v, -sh.a * sh.p)) return { code: 'gf-perp-par', hint: 'That value makes the lines perpendicular. Parallel lines have <b>equal</b> slopes.' };
          return null;
        } }, 'Parallel needs equal slopes: ' + t('-\\frac{' + sh.a + '}{k}=' + sh.p) + ' → ' + t(sh.p + 'k=-' + sh.a) + ' → ' + t('k=' + fT(-sh.a / sh.p)) + '.', ['Set ' + t('-\\frac{' + sh.a + '}{k}') + ' equal to the slope of ' + t(gT(sh.p, -1, sh.q)) + '.', 'Multiply both sides by ' + t('k') + ', then divide.'], 'k parallel');
      } },
      { id: 'e16b2', sub: 'b(ii)', level: 'ADV', make: function (r, sh) {
        var kv = -sh.a / sh.p, Lr = red(sh.a, kv, sh.c), dn = toFr(kv)[1], g2 = gcd(gcd(sh.a * dn, sh.a * dn / sh.p), sh.c * dn);
        return linePart('With that value of ' + t('k') + ', the first line is ' + t(sh.a + 'x' + fT(kv) + 'y' + (sh.c < 0 ? '' : '+') + sh.c + '=0') + '. Write it in proper general form.', { A: sh.a, B: kv, C: sh.c }, 'general',
          [{ is: { A: sh.a * dn, B: kv * dn, C: sh.c }, code: 'gf-no-const', hint: 'Multiply <b>every</b> term by ' + t(dn) + ' — the constant too.' }],
          'Multiply every term by ' + t(dn) + ': ' + t(gT(sh.a * dn, kv * dn, sh.c * dn)) + (g2 > 1 ? ', or dividing by the common factor ' + t(g2) + ', ' + t(rT(Lr)) : '') + '. Its slope is ' + t(sh.p) + ', as required.',
          ['Multiply every term by the denominator of ' + t('k') + ', ' + t(dn) + '.'], 'parallel line general form', { bad: [gT(sh.a * dn, kv * dn, sh.c), gT(sh.a * dn, -kv * dn, sh.c * dn)] });
      } }] },
    { num: '17', stem: '<b>Stretch.</b> A line in proper general form is ' + t('Ax+By+C=0') + ' with ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ' all non-zero.', parts: [
      { id: 'e17a', sub: 'a', level: 'PRG', outcome: 'RF5', make: function (r) {
        return mc(r, 'Which are its intercepts, in terms of ' + t('A') + ', ' + t('B') + ' and ' + t('C') + '?', [
          { html: t('x') + '-intercept ' + t('\\left(-\\frac{C}{A},\\ 0\\right)') + ', ' + t('y') + '-intercept ' + t('\\left(0,\\ -\\frac{C}{B}\\right)'), right: true },
          { html: t('x') + '-intercept ' + t('\\left(-\\frac{C}{B},\\ 0\\right)') + ', ' + t('y') + '-intercept ' + t('\\left(0,\\ -\\frac{C}{A}\\right)'), why: 'Setting ' + t('y=0') + ' removes the ' + t('By') + ' term and leaves ' + t('Ax+C=0') + ', so the ' + t('x') + '-intercept is divided by ' + t('A') + '.' },
          { html: t('x') + '-intercept ' + t('\\left(\\frac{C}{A},\\ 0\\right)') + ', ' + t('y') + '-intercept ' + t('\\left(0,\\ \\frac{C}{B}\\right)'), why: 'Check the sign: ' + t('Ax+C=0') + ' gives ' + t('Ax=-C') + '.' },
          { html: t('x') + '-intercept ' + t('(A,\\ 0)') + ', ' + t('y') + '-intercept ' + t('(0,\\ B)'), why: 'The coefficients aren’t the intercepts: in ' + t('2x+y-6=0') + ' the ' + t('x') + '-intercept is ' + t('3') + '.' }],
          t('y=0') + ': ' + t('Ax+C=0') + ', so ' + t('x=-\\frac{C}{A}') + '. &nbsp; ' + t('x=0') + ': ' + t('By+C=0') + ', so ' + t('y=-\\frac{C}{B}') + '.', ['Do exactly what you do with numbers: set ' + t('y=0') + ' and solve for ' + t('x') + '.'], 'intercept formulas');
      } },
      { id: 'e17b', sub: 'b', level: 'PRG', make: function (r) {
        return mc(r, 'Use the two intercepts as two points. Why does the slope come out as ' + t('-\\frac{A}{B}') + '?', [
          { html: t('m=\\dfrac{-\\frac{C}{B}-0}{0-\\left(-\\frac{C}{A}\\right)}=\\dfrac{-\\frac{C}{B}}{\\frac{C}{A}}=-\\frac{C}{B}\\cdot\\frac{A}{C}=-\\frac{A}{B}') + ' — the ' + t('C') + '’s cancel.', right: true },
          { html: t('m=\\dfrac{-\\frac{C}{A}}{-\\frac{C}{B}}=\\frac{B}{A}') + ', which is the same thing.', why: 'Rise over run: the change in ' + t('y') + ' goes on top. And ' + t('\\frac{B}{A}') + ' isn’t ' + t('-\\frac{A}{B}') + '.' },
          { html: 'Because the slope is always the coefficient of ' + t('x') + ' divided by the constant.', why: 'The constant ' + t('C') + ' cancels out of the slope; it only moves the line.' },
          { html: 'It doesn’t: the slope of a general-form line is ' + t('A') + '.', why: 'Test it: ' + t('2x+y-6=0') + ' is ' + t('y=-2x+6') + ', slope ' + t('-2=-\\frac{2}{1}') + '.' }],
          'From ' + t('\\left(-\\frac{C}{A},\\ 0\\right)') + ' to ' + t('\\left(0,\\ -\\frac{C}{B}\\right)') + ': rise ' + t('-\\frac{C}{B}') + ', run ' + t('\\frac{C}{A}') + '. Dividing, ' + t('-\\frac{C}{B}\\cdot\\frac{A}{C}=-\\frac{A}{B}') + '.', ['Rise = change in ' + t('y') + ', run = change in ' + t('x') + '. Dividing by a fraction means multiplying by its reciprocal.'], 'why -A/B');
      } }] }
  ];

  /* EP 5: slope and both intercepts */
  function mIntFields(A, Bc, C) {
    var m = -A / Bc, xp = [-C / A, 0], yp = [0, -C / Bc];
    var p = KP.fields(t(gT(A, Bc, C)), [{ label: 'Slope:', name: 'Slope', mode: 'math', keys: 'u7val', placeholder: PH.m, before: t('m=') }, { label: t('x') + '-intercept:', name: 'x-intercept', mode: 'math', keys: 'u7val', placeholder: PH.v }, { label: t('y') + '-intercept:', name: 'y-intercept', mode: 'math', keys: 'u7val', placeholder: PH.v }],
      [slopeBox(A, Bc, C), intBox('x', A, Bc, C), intBox('y', A, Bc, C)], [fT(m), pK(xp), pK(yp)],
      'Slope ' + t('m=' + fT(m)) + ', ' + t('x') + '-intercept ' + t(pT(xp)) + ', ' + t('y') + '-intercept ' + t(pT(yp)),
      'Slope: solve for ' + t('y') + ': ' + solveYT(A, Bc, C) + ', so ' + t('m=' + fT(m)) + ' (the same as ' + t('-\\frac{A}{B}=-\\frac{' + A + '}{' + Bc + '}') + ').<br>' + t('x') + '-intercept: ' + t('y=0') + ' gives ' + t(lin([[A, 'x'], [C, '']]) + '=0') + ', so ' + t(pT(xp)) + '.<br>' + t('y') + '-intercept: ' + t('x=0') + ' gives ' + t(lin([[Bc, 'y'], [C, '']]) + '=0') + ', so ' + t(pT(yp)) + '.',
      ['For the intercepts, substitute ' + t('y=0') + ' and then ' + t('x=0') + ' — no converting needed.', 'For the slope, solve for ' + t('y') + ' (or use ' + t('m=-\\frac{A}{B}') + ').'], 'slope + intercepts of ' + gT(A, Bc, C));
    p.bad = [[fT(m), pK(yp), pK(xp)], [fT(-m), pK(xp), pK(yp)]];
    return p;
  }
  /* EP 6: same line? */
  function samePart(r, kind) {
    var o = pickWhere(function () { return { a: r.int(1, 5), b: -r.int(1, 6), c: r.pick(pm(1, 9)), k: r.pick([2, 3, 4]) }; }, function (o) { return gcd(gcd(o.a, o.b), o.c) === 1 && o.a !== -o.b; });
    var L1 = [o.a, o.b, o.c], L2 = [o.k * o.a, o.k * o.b, o.k * o.c], same = kind !== 'par';
    if (kind === 'par') L2[2] = o.k * o.c + r.pick([-1, 1]) * r.int(1, 3);
    if (kind === 'down') { var tmp = L1; L1 = L2; L2 = tmp; }
    var big = kind === 'down' ? L1 : L2, small = kind === 'down' ? L2 : L1;
    return mc(r, t(gT(L1[0], L1[1], L1[2])) + ' &nbsp;and&nbsp; ' + t(gT(L2[0], L2[1], L2[2])), [
      { html: 'The same line: every coefficient of ' + t(gT(big[0], big[1], big[2])) + ', the constant included, is ' + t(o.k) + ' times the other.', right: same },
      { html: 'Not the same line: ' + t('A') + ' and ' + t('B') + ' are scaled by ' + t(o.k) + ' but the constant isn’t, so the lines are parallel but different.', right: !same, why: same ? 'Check the constant: ' + t(o.k + '\\times' + sgp(small[2]) + '=' + big[2]) + ' — it is scaled by ' + t(o.k) + ' too.' : null },
      { html: 'Not the same line: the coefficients are different numbers.', why: same ? 'Different numbers can still describe the same line: multiplying a whole equation by ' + t(o.k) + ' doesn’t change its points.' : 'They are different lines — but the reason is that the constant isn’t scaled like ' + t('A') + ' and ' + t('B') + '. Different numbers alone don’t decide it.' },
      { html: 'The same line, because the slopes are equal.', why: same ? 'Equal slopes alone only mean parallel. Here it <b>is</b> the same line, because the constant is scaled too.' : 'Equal slopes only mean parallel. The constants decide: ' + t(o.k + '\\times' + sgp(small[2]) + '=' + o.k * small[2]) + ', not ' + t(big[2]) + '.' }],
      'Compare ' + t(gT(big[0], big[1], big[2])) + ' with ' + t(o.k) + ' times ' + t(gT(small[0], small[1], small[2])) + ', which is ' + t(gT(o.k * small[0], o.k * small[1], o.k * small[2])) + '. ' + (same ? 'Every coefficient matches: the <b>same line</b> (both give ' + t(siT(-o.a / o.b, -o.c / o.b)) + ').' : t('A') + ' and ' + t('B') + ' match but the constant doesn’t: same slope ' + t(fT(-o.a / o.b)) + ', different line — <b>parallel</b>.'),
      ['Divide each coefficient of one equation by the matching coefficient of the other. Is it the same number every time — the constant too?'], 'same line ' + kind);
  }
  /* assignment Q6 / EP 4(b): A negative → multiply by −1 */
  function negAPart(prompt, A, Bc, C, text) {
    var T = { A: -A, B: -Bc, C: -C };
    var pre = function (resp) {
      var rd = L.read(resp); if (!rd.ok) return null;
      if (L.same([rd.a, rd.b, rd.c], [A, Bc, C])) { var zl = P.isZero(rd.R); var side = zl ? rd.L : rd.R; var ax = side.x1 ? side.x1.c[0] / side.x1.c[1] : 0; if (ax < 0 && (zl || P.isZero(rd.L))) return wrong('u7l7-unchanged', 'That still has ' + t('A') + ' negative. Multiply <b>every</b> term by ' + t('-1') + '.'); }
      return null;
    };
    var wr = [{ is: { A: -A, B: Bc, C: C }, code: 'u7l7-some-signs', hint: 'Multiply <b>every</b> term by ' + t('-1') + ' — not just the ' + t('x') + '-term. Changing one sign gives a different line.' },
      { is: { A: -A, B: -Bc, C: C }, code: 'u7l7-some-signs', hint: 'Multiply <b>every</b> term by ' + t('-1') + ' — the constant too.' },
      { is: { A: -A, B: Bc, C: -C }, code: 'u7l7-some-signs', hint: 'Multiply <b>every</b> term by ' + t('-1') + ' — the ' + t('y') + '-term too.' }];
    return linePart(prompt, T, 'general', wr, 'Multiply every term by ' + t('-1') + ': ' + t(gT(-A, -Bc, -C)) + '. Both sides are multiplied by ' + t('-1') + ' and ' + t('-1\\times 0=0') + ', so it is the same line.',
      ['Multiply <b>every</b> term (both sides) by ' + t('-1') + '.'], text, { pre: pre, bad: [gT(A, Bc, C), gT(-A, Bc, C), gT(-A, -Bc, C)] });
  }

  HW.defineLesson({
    id: 'u7l7', unit: 7, num: 7, title: 'The General Form of a Linear Equation', outcome: 'RF6',
    blurb: 'Writing Ax + By + C = 0 with integer coefficients and A positive, converting back to y = mx + b, and reading the intercepts straight from general form.',
    questions: [
      /* ---------- Part A ---------- */
      { num: '1', section: 'Part A — Converting between the two forms', stem: 'Convert the equation from slope–intercept form ' + t('(y=mx+b)') + ' to general form ' + t('(Ax+By+C=0)') + ', where ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ' are integers and ' + t('A') + ' is positive.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { return convPart(null, [r.int(2, 9), 1], [-r.int(2, 9), 1]); } },
        { id: '1b', level: 'BEG', make: function (r) { return convPart(null, [-r.int(2, 9), 1], [r.int(2, 9), 1]); } },
        { id: '1c', level: 'BEG', make: function (r) { return convPart(null, [1, 1], [r.pick(pm(2, 12)), 1]); } },
        { id: '1d', level: 'BEG', make: function (r) { return convPart(null, [-r.int(2, 9), 1], [-r.int(2, 9), 1]); } }] },
      { num: '2', stem: 'Convert the equation from slope–intercept form to general form. Clear the fractions first.', parts: [
        { id: '2a', level: 'EMG', make: function (r) { return convPart(null, [1, r.int(2, 6)], [r.int(2, 9), 1]); } },
        { id: '2b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.int(1, 4), q: r.int(2, 6), b: r.int(1, 9) }; }, function (o) { return cop(o.p, o.q) && o.p < o.q; }); return convPart(null, [-o.p, o.q], [o.b, 1]); } },
        { id: '2c', level: 'PRG', make: function (r) {
          var o = pickWhere(function () { var d = r.pick([[2, 4], [3, 6], [2, 6], [4, 8], [2, 8], [3, 9]]); return { q: d[0], s: d[1], p: r.int(1, 9), u: r.int(1, 7) }; }, function (o) { return cop(o.p, o.q) && cop(o.u, o.s) && o.u < o.s && o.p !== o.q; });
          return convPart(null, [o.p, o.q], [-o.u, o.s]);
        } }] },
      { num: '3', stem: 'Convert the equation from general form to slope–intercept form, ' + t('y=mx+b') + '.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var c = r.pick(pm(1, 12)); return toSIPart(t(gT(1, -1, -c)), 1, -1, -c); } },
        { id: '3b', level: 'BEG', make: function (r) { var a = r.int(2, 6), c = r.int(2, 9); return toSIPart(t(gT(a, -1, c)), a, -1, c); } },
        { id: '3c', level: 'BEG', make: function (r) { var c = r.pick(pm(1, 12)); return toSIPart(t(gT(1, 1, -c)), 1, 1, -c); } },
        { id: '3d', level: 'BEG', make: function (r) { var a = r.int(2, 6), c = r.int(1, 9); return toSIPart(t(gT(a, 1, c)), a, 1, c); } }] },
      { num: '4', stem: 'Convert the equation from general form to slope–intercept form. Simplify the slope fully.', parts: [
        { id: '4a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { A: r.int(1, 9), Bc: r.int(2, 5), k: r.int(1, 6) }; }, function (o) { return cop(o.A, o.Bc); }); return toSIPart(t(gT(o.A, -o.Bc, -o.Bc * o.k)), o.A, -o.Bc, -o.Bc * o.k); } },
        { id: '4b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { A: r.int(1, 9), Bc: r.int(2, 5), k: r.int(1, 6) }; }, function (o) { return cop(o.A, o.Bc); }); return toSIPart(t(gT(o.A, o.Bc, -o.Bc * o.k)), o.A, o.Bc, -o.Bc * o.k); } },
        { id: '4c', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { A: r.int(1, 9), Bc: r.int(2, 5), k: r.int(1, 6) }; }, function (o) { return cop(o.A, o.Bc); }); return toSIPart(t(gT(o.A, -o.Bc, o.Bc * o.k)), o.A, -o.Bc, o.Bc * o.k); } }] },
      /* ---------- Part B ---------- */
      { num: '5', section: 'Part B — Intercepts and proper form', outcome: 'RF5', stem: 'Find the ' + t('x') + '-intercept and the ' + t('y') + '-intercept of the line directly from its general-form equation (don’t convert to slope–intercept form first).', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var L3 = q5(r, 'a'); return intFields(t(rT(L3)), L3[0], L3[1], L3[2]); } },
        { id: '5b', level: 'BEG', make: function (r) { var L3 = q5(r, 'b'); return intFields(t(rT(L3)), L3[0], L3[1], L3[2]); } },
        { id: '5c', level: 'EMG', make: function (r) { var L3 = q5(r, 'c'); return intFields(t(rT(L3)), L3[0], L3[1], L3[2]); } },
        { id: '5d', level: 'EMG', make: function (r) { var L3 = q5(r, 'd'); return intFields(t(rT(L3)), L3[0], L3[1], L3[2]); } }] },
      { num: '6', stem: 'The equation is written with a negative value of ' + t('A') + '. Rewrite it in proper general form, so that ' + t('A') + ' is positive.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { var a = r.int(2, 9), c = r.int(2, 9); return negAPart(t(gT(-a, 1, -c)), -a, 1, -c, 'negative A (a)'); } },
        { id: '6b', level: 'EMG', make: function (r) { var b = r.int(2, 7), c = r.int(2, 15); return negAPart(t(gT(-1, -b, c)), -1, -b, c, 'negative A (b)'); } }] },
      /* ---------- Part C ---------- */
      { num: '7', section: 'Part C — Mixed review', parts: [
        { id: '7', level: 'PRG', make: function (r) {   // 5x + 2y − 10 = 0
          var o = pickWhere(function () { return { A: r.int(2, 9), Bc: r.pick([2, 3, 4]), k: r.int(1, 6) }; }, function (o) { return cop(o.A, o.Bc); });
          return mbFields('A line has equation ' + t(gT(o.A, o.Bc, -o.Bc * o.k)) + '. State its slope and its ' + t('y') + '-intercept.', o.A, o.Bc, -o.Bc * o.k);
        } }] },
      { num: '8', outcome: 'RF5', parts: [
        { id: '8', level: 'EMG', make: function (r) {   // 6x − 3y − 18 = 0
          var o = pickWhere(function () { return { a: r.int(1, 4), b: r.int(1, 3), g: r.pick([2, 3]), k: r.int(1, 4) }; }, function (o) { return o.a !== o.b && (o.a > 1 || o.b > 1); });
          var A = o.g * o.a, Bc = -o.g * o.b, C = -o.g * o.a * o.b * o.k;
          return intFields('A line has equation ' + t(gT(A, Bc, C)) + '. Without converting to slope–intercept form, state its ' + t('x') + '-intercept and its ' + t('y') + '-intercept.', A, Bc, C);
        } }] },
      { num: '9', parts: [
        { id: '9', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.int(1, 5), q: r.pick([2, 3, 4, 5]), b: r.int(1, 9) }; }, function (o) { return cop(o.p, o.q) && o.p < o.q; }); return convPart('Convert ' + t(siT(-o.p / o.q, -o.b)) + ' to general form.', [-o.p, o.q], [-o.b, 1]); } }] },
      { num: '10', parts: [
        { id: '10', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { A: r.int(3, 9), k: r.int(2, 9) }; }, function (o) { return o.A % 2 === 1; }); return toSIPart('Convert ' + t(gT(o.A, -2, 2 * o.k)) + ' to slope–intercept form.', o.A, -2, 2 * o.k); } }] },
      /* ---------- Part D ---------- */
      { num: '11', section: 'Part D — Multiple choice and numerical response', parts: [
        { id: '11', level: 'BEG', make: function (r) {
          var a = r.int(2, 6), d = r.int(1, 4), c = r.int(2, 9), m = r.int(2, 6), b = r.int(2, 9), pq = pickWhere(function () { return { p: r.int(2, 7), q: r.int(2, 7), s: r.int(1, 9) }; }, function (o) { return cop(o.p, o.q); });
          return mc(r, '<i>(Multiple Choice)</i> Which equation is written in proper general form, with ' + t('A') + ', ' + t('B') + ', ' + t('C') + ' integers and ' + t('A') + ' positive?', [
            { html: t(lin([[a, 'x']]) + '+' + d + '.5y-' + c + '=0'), why: t(d + '.5') + ' is not an integer.' },
            { html: t(siT(m, -b)), why: 'That is slope–intercept form: the terms aren’t all on one side with ' + t('0') + ' on the other.' },
            { html: t(gT(pq.p, -pq.q, pq.s)), right: true },
            { html: t(gT(-a, 1, -c)), why: 'Here ' + t('A=-' + a) + ' is negative.' }],
            t(gT(pq.p, -pq.q, pq.s)) + ' has integer coefficients, ' + t('A=' + pq.p) + ' positive, and ' + t('0') + ' alone on the right. The others have a decimal, aren’t equal to ' + t('0') + ', or have ' + t('A<0') + '.', ['Check each rule: integers, ' + t('A>0') + ', and ' + t('=0') + '.'], 'which is proper general form');
        } }] },
      { num: '12', parts: [
        { id: '12', level: 'EMG', make: function (r) {
          var o = pickWhere(function () { return { Bc: r.int(2, 5), m: r.int(2, 4), k: r.int(1, 5) }; }, function (o) { return o.k !== o.m; });
          var A = o.Bc * o.m, C = o.Bc * o.k;
          return mc(r, '<i>(Multiple Choice)</i> The slope of the line ' + t(gT(A, -o.Bc, C)) + ' is', [
            { html: t(o.m), right: true },
            { html: t(-o.m), why: 'Check the signs: ' + t(-o.Bc + 'y=' + (-A) + 'x' + (-C)) + ', then divide every term by ' + t(-o.Bc) + '.' },
            { html: t(o.k), why: 'That’s the ' + t('y') + '-intercept. The slope is the coefficient of ' + t('x') + ' once you solve for ' + t('y') + '.' },
            { html: t(-o.k), why: 'That’s the ' + t('y') + '-intercept with the wrong sign — and the slope is the coefficient of ' + t('x') + ', not the constant.' }],
            t(gT(A, -o.Bc, C)) + ' → ' + t(-o.Bc + 'y=' + (-A) + 'x' + (-C)) + ' → ' + t(siT(o.m, o.k)) + ', so ' + t('m=' + o.m) + '.', ['Solve for ' + t('y') + ': divide every term by the coefficient of ' + t('y') + '.'], 'MC slope of general form');
        } }] },
      { num: '13', outcome: 'RF5', parts: [
        { id: '13', level: 'EMG', make: function (r) {
          var o = pickWhere(function () { return { A: r.int(2, 9), Bc: r.int(2, 7), k: r.int(2, 6) }; }, function (o) { return cop(o.A, o.Bc) && (o.Bc * o.k) % o.A !== 0; });
          var C = o.Bc * o.k;
          return mc(r, '<i>(Multiple Choice)</i> The ' + t('y') + '-intercept of the line ' + t(gT(o.A, o.Bc, -C)) + ' is', [
            { html: t(-o.k), why: 'Check the sign: ' + t(o.Bc + 'y-' + C + '=0') + ' gives ' + t(o.Bc + 'y=' + C) + '.' },
            { html: t(fT(C / o.A)), why: 'That’s the ' + t('x') + '-intercept (from ' + t('y=0') + '). For the ' + t('y') + '-intercept set ' + t('x=0') + '.' },
            { html: t(fT(-C / o.A)), why: 'For the ' + t('y') + '-intercept set ' + t('x=0') + ', not ' + t('y=0') + ' — and watch the sign.' },
            { html: t(o.k), right: true }],
            'Set ' + t('x=0') + ': ' + t(o.Bc + 'y-' + C + '=0') + ', so ' + t(o.Bc + 'y=' + C) + ' and ' + t('y=' + o.k) + '.', ['At the ' + t('y') + '-intercept, ' + t('x=0') + '.'], 'MC y-int', true);
        } }] },
      { num: '14', outcome: 'RF5', parts: [
        { id: '14', level: 'EMG', make: function (r) {
          var o = pickWhere(function () { return { A: r.int(2, 6), Bc: r.int(2, 6), j: r.int(1, 2) }; }, function (o) { return cop(o.A, o.Bc) && o.A !== o.Bc; });
          var C = o.A * o.Bc * o.j, xi = C / o.A, yi = C / o.Bc;
          return mc(r, '<i>(Multiple Choice)</i> The ' + t('x') + '-intercept of the line ' + t(gT(o.A, -o.Bc, -C)) + ' is', [
            { html: t(yi), why: 'That’s the size of the ' + t('y') + '-intercept. For the ' + t('x') + '-intercept set ' + t('y=0') + '.' },
            { html: t(xi), right: true },
            { html: t(-xi), why: 'Check the sign: ' + t(o.A + 'x-' + C + '=0') + ' gives ' + t(o.A + 'x=' + C) + '.' },
            { html: t(-yi), why: 'That’s the ' + t('y') + '-intercept (from ' + t('x=0') + '). For the ' + t('x') + '-intercept set ' + t('y=0') + '.' }],
            'Set ' + t('y=0') + ': ' + t(o.A + 'x-' + C + '=0') + ', so ' + t(o.A + 'x=' + C) + ' and ' + t('x=' + xi) + '.', ['At the ' + t('x') + '-intercept, ' + t('y=0') + '.'], 'MC x-int', true);
        } }] },
      { num: '15', outcome: 'RF5', parts: [
        { id: '15', level: 'ADV', make: function (r) {
          var o = pickWhere(function () { return { k: r.int(2, 9), Bc: r.int(2, 6), p: r.int(2, 6) }; }, function (o) { return o.k * o.p <= 40 && o.k * o.p / o.Bc !== o.k && o.k !== o.p; });
          var C = o.k * o.p;
          return KP.nr('<i>(Numerical Response)</i> A line has equation ' + t('kx+' + o.Bc + 'y-' + C + '=0') + ' and passes through the point ' + t('(' + o.p + ',\\ 0)') + '. The value of ' + t('k') + ' is ________.', o.k, function (v) {
            if (v === C * o.p) return { code: 'gf-k-mult', hint: t(o.p + 'k=' + C) + ' means ' + t('k=\\frac{' + C + '}{' + o.p + '}') + ' — divide, don’t multiply.' };
            if (near(v, C / o.Bc)) return { code: 'gf-swap-ab', hint: 'The point is ' + t('(' + o.p + ',\\ 0)') + ': ' + t('x=' + o.p) + ' and ' + t('y=0') + ', so the ' + t('y') + '-term disappears.' };
            return null;
          }, 'Substitute ' + t('x=' + o.p) + ', ' + t('y=0') + ': ' + t('k(' + o.p + ')+' + o.Bc + '(0)-' + C + '=0') + ', so ' + t(o.p + 'k=' + C) + ' and ' + t('k=' + o.k) + '.', ['The point satisfies the equation: substitute its coordinates and solve for ' + t('k') + '.'], 'NR k through x-int');
        } }] }
    ],
    extra: EXTRA
  });
})(window);
