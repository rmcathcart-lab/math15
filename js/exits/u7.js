/* Math 15 · Unit 7 (Equations of Linear Relations: tables of values, y = mx + b, graphing from m and b, writing equations,
 * general form, horizontal and vertical lines, slope in context) — exit slips for Lessons 1–10 (u7l1x … u7l10x), written
 * in test mode. No calculator (Ryan's Unit 7 paper tests say "No calculator"), so every number stays friendly.
 * Each slip is Ryan's own Math 15 exit slip for that lesson (his older exit-slip app, Versions A and B), turned into
 * generators: the same questions, skills, outcomes and levels (his tags), with his Version A and B numbers and graphs among
 * the possible values. Every part has a key built from the generated values, a worked solution, hints, and `bad` answers
 * with u7x- codes (labels and partial-credit decisions below). Graphs are drawn with HW.graph like the 10C Unit 7 slips.
 * Changes from his slips:
 *  - One short Mastery question was added to each slip at Math 15 difficulty, taken from the lesson's own hardest
 *    assignment / extra-practice items: L1 a missing coordinate so a point lies on the line (Q15), L2 find and fix an
 *    error rearranging with a negative y-coefficient (EP 2 Q9–10), L3 the area of the triangle a line makes with the axes
 *    (Q13), L4 a context equation from a start value and a later reading (Q15), L5 a fractional slope through a point (Q4),
 *    L6 two points with negatives and a fractional slope (Q4), L7 a missing coefficient so a point lies on a
 *    general-form line (Q15, EP 7 Q11), L8 graph a general-form line on the graph pad (Q8, Q10), L9 the break-even point of
 *    two plans (Q9–10), L10 an equation through two points in general form (Q26).
 *  - Multiple choice kept only where it tests recognition (L1 which point is on the line / which equation is not linear,
 *    L3 which graph, L8 which graph and which two intercepts, L9 what the slope means). No MC above Progressing.
 *  - L1 Q1 uses other x-values besides −2; L2 Q1 also asks for the slope of y = x + c (his Version B); L8 Q2 has four
 *    graphs (x = k, x = −k, y = k, y = −k) instead of three; L9 Q1 also has a rising context (snow depth).
 * Answers: equations accept any equivalent arrangement in the asked form (y = 5 − 2x is fine; exact decimals like 2.5 are
 * fine; a rounded decimal gets a nudge); a bare number typed for "write the equation" is caught (b alone = an unfinished
 * step); points may be typed with or without brackets; intercepts as a number, "x = 6" or the point. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, Ln = HW.lines, DR = HW.draw, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'u7x-tv-sign': 'Sign of a product (negative × negative or negative × positive)', 'u7x-tv-add': 'Read mx as m + x', 'u7x-tv-b': 'Subtracted b instead of adding it', 'u7x-tv-nob': 'Left out b',
    'u7x-k-subx': 'Substituted the y-value for x', 'u7x-k-sign': 'Sign slip solving for the unknown', 'u7x-k-nodiv': 'Did not divide by the coefficient', 'u7x-k-recip': 'Divided the wrong way round',
    'u7x-k-swap': 'Substituted the point’s x and y the wrong way round',
    'u7x-mb-swap': 'Slope and y-intercept swapped', 'u7x-m-zero': 'Read a bare x as slope 0', 'u7x-m-sign': 'Dropped the sign in front of x',
    'u7x-re-sign': 'Rearranging: the x-term kept its sign when it moved', 'u7x-re-divone': 'Divided only one term by the coefficient of y', 'u7x-not-divided': 'Did not divide by the coefficient of y',
    'u7x-re-mult': 'Multiplied by the coefficient of y instead of dividing', 'u7x-re-negdiv': 'Divided by the coefficient of y without its negative sign', 'u7x-copied': 'Gave back the answer that had the mistake',
    'u7x-step-flip': 'Slope step: rise and run swapped', 'u7x-step-dir': 'Slope step: went the wrong way up/down', 'u7x-step-b': 'Slope step: started at the wrong y-intercept', 'u7x-step-one': 'Slope step: moved right 1 without using the slope',
    'u7x-tri-half': 'Triangle area: forgot the ½', 'u7x-tri-legs': 'Triangle: used b for both legs', 'u7x-tri-add': 'Triangle: added the legs',
    'u7x-b-point': 'Used a point’s y-value as b', 'u7x-b-first': 'Used the first y-value of the table as b', 'u7x-b-solve': 'Sign slip solving for b', 'u7x-b-xint': 'Used the x-intercept as b',
    'u7x-sub-swap': 'Substituted the point’s x and y the wrong way round', 'u7x-only-b': 'Found b but did not write the equation', 'u7x-notlinear': 'Not the equation of a line', 'u7x-decimal': 'Rounded decimal instead of an exact fraction',
    'u7x-rate-sign': 'Rate of change: wrong sign', 'u7x-rate-change': 'Used the total change, not the change per unit', 'u7x-ctx-b-point': 'Used a later reading as the starting value', 'u7x-ctx-swap': 'Rate and starting value swapped',
    'u7x-ctx-no-b': 'Left out the starting value / flat fee', 'u7x-ctx-sum': 'Added the flat fee to the rate', 'u7x-ctx-minus': 'Subtracted the flat fee',
    'u7x-sl-negsub': 'Slope: sign slip subtracting a negative', 'u7x-sl-order': 'Slope: subtracted in a different order on the top and the bottom',
    'u7x-gf-nomult': 'General form: did not multiply every term', 'u7x-gf-csign': 'General form: the constant kept its sign when it moved',
    'u7x-icpt-swap': 'x- and y-intercepts swapped', 'u7x-icpt-axis': 'Intercept written as a point off that axis', 'u7x-icpt-sign': 'Intercept sign', 'u7x-icpt-const': 'Gave the constant term as the intercept (did not divide)',
    'u7x-hv-term': 'Horizontal/vertical line written with a variable term',
    'u7x-gr-join': 'Graph: points not joined into a line', 'u7x-gr-slope': 'Graph: right starting point, wrong slope', 'u7x-gr-icpt': 'Graph: right slope, wrong position',
    'u7x-gr-icpt-swap': 'Graph: intercepts swapped', 'u7x-gr-icpt-sign': 'Graph: an intercept with the wrong sign', 'u7x-gr-coef': 'Graph: used the coefficients as the intercepts',
    'u7x-inv-nofee': 'Solving: ignored the flat fee', 'u7x-inv-addfee': 'Solving: added the flat fee instead of subtracting', 'u7x-inv-divfee': 'Solving: divided by the fee instead of the rate', 'u7x-inv-sub': 'Substituted the total for the wrong variable',
    'u7x-be-one': 'Break-even: used only one plan', 'u7x-be-fee': 'Break-even: left out the second plan’s fee', 'u7x-be-add': 'Break-even: added the rates instead of subtracting'
  });
  HW.addPartial({
    'u7x-tv-sign': 's', 'u7x-tv-add': 'n', 'u7x-tv-b': 's', 'u7x-tv-nob': 'b', 'u7x-k-subx': 'n', 'u7x-k-sign': 's', 'u7x-k-nodiv': 'b', 'u7x-k-recip': 'b', 'u7x-k-swap': 'b',
    'u7x-mb-swap': 'n', 'u7x-m-zero': 'n', 'u7x-m-sign': 's', 'u7x-re-sign': 's', 'u7x-re-divone': 'b', 'u7x-not-divided': 'b', 'u7x-re-mult': 'n', 'u7x-re-negdiv': 'b', 'u7x-copied': 'n',
    'u7x-step-flip': 'b', 'u7x-step-dir': 's', 'u7x-step-b': 's', 'u7x-step-one': 'n', 'u7x-tri-half': 'b', 'u7x-tri-legs': 'b', 'u7x-tri-add': 'n',
    'u7x-b-point': 'b', 'u7x-b-first': 'b', 'u7x-b-solve': 's', 'u7x-b-xint': 'n', 'u7x-sub-swap': 'b', 'u7x-only-b': 'b', 'u7x-notlinear': 'n',
    'u7x-rate-sign': 's', 'u7x-rate-change': 'b', 'u7x-ctx-b-point': 'b', 'u7x-ctx-swap': 'n', 'u7x-ctx-no-b': 'b', 'u7x-ctx-sum': 'n', 'u7x-ctx-minus': 's',
    'u7x-sl-negsub': 's', 'u7x-sl-order': 'b', 'u7x-gf-nomult': 'b', 'u7x-gf-csign': 's',
    'u7x-icpt-swap': 'n', 'u7x-icpt-axis': 'n', 'u7x-icpt-sign': 's', 'u7x-icpt-const': 'b', 'u7x-hv-term': 'n',
    'u7x-gr-join': 'b', 'u7x-gr-slope': 'b', 'u7x-gr-icpt': 'b', 'u7x-gr-icpt-swap': 'n', 'u7x-gr-icpt-sign': 's', 'u7x-gr-coef': 'n',
    'u7x-inv-nofee': 'b', 'u7x-inv-addfee': 'b', 'u7x-inv-divfee': 'n', 'u7x-inv-sub': 'n', 'u7x-be-one': 'n', 'u7x-be-fee': 'b', 'u7x-be-add': 'n'
  });

  /* ================= numbers, fractions [p, q] and LaTeX ================= */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function fr(p, q) { if (Array.isArray(p)) return fr(p[0], p[1]); if (q == null) q = 1; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g + 0, q / g]; }
  function fv(f) { return Array.isArray(f) ? f[0] / f[1] : f; }
  function fNeg(a) { a = fr(a); return [-a[0], a[1]]; }
  function fInv(a) { a = fr(a); return fr(a[1], a[0]); }
  function fEq(a, b) { a = fr(a); b = fr(b); return a[0] === b[0] && a[1] === b[1]; }
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function nT(a) { if (typeof a === 'number' && !Number.isInteger(cl(a))) { var f0 = Ln.toFr(a); return Ln.frT(f0[0], f0[1]); } a = fr(typeof a === 'number' ? cl(a) : a); return Ln.frT(a[0], a[1]); }
  function pT(a) { return fv(a) < 0 ? '(' + nT(a) + ')' : nT(a); }
  function ptT(x, y) { return '(' + nT(x) + ',\\ ' + nT(y) + ')'; }
  function ptK(x, y) { return '(' + nT(x) + ', ' + nT(y) + ')'; }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nzs(a, b) { return range(a, b).filter(function (x) { return x !== 0; }); }
  function until(gen, okf) { for (var i = 0; i < 5000; i++) { var o = gen(); if (o != null && okf(o)) return o; } throw new Error('u7 exits: no valid numbers'); }
  function term(c, v, first) { c = fr(c); if (c[0] === 0) return ''; var ab = Math.abs(c[0]), mag = c[1] === 1 ? (ab === 1 && v ? '' : String(ab)) : '\\frac{' + ab + '}{' + c[1] + '}'; return (c[0] < 0 ? '-' : first ? '' : '+') + mag + v; }
  function lin(ts) { var o = ''; ts.forEach(function (x) { o += term(x[0], x[1], o === ''); }); return o || '0'; }
  function SI(m, b, vars) { return Ln.tex({ m: fr(m), b: fr(b) }, 'slope-intercept', null, vars); }
  function GEN(T, vars) { return Ln.tex(T, 'general', null, vars); }
  function L(m, b) { return { m: fr(m), b: fr(b) }; }
  function dollars(v) { return t('\\$' + F(v)); }
  function Q(num, outcome, level, make) { return { num: String(num), stem: '', parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }
  function mc(r, prompt, opts, sol, hints, text, keep) {
    var seen = {}, out = [];
    opts.forEach(function (o) { if (!seen[o.html]) { seen[o.html] = 1; out.push(o); } });
    return B.mc(r, prompt, out, sol, hints, text, keep);
  }
  function cleanS(s) { return String(s == null ? '' : s).replace(/\\left|\\right/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\[,;:! ]|~/g, ' ').replace(/−/g, '-').trim(); }
  function valOf(s) { var a = ex.parse(String(s).trim()); if (!a.ok) return NaN; var v = ex.value(a.ast); return isFinite(v) ? v : NaN; }

  /* ================= number answers ("y = 8" after a printed "y =" is fine) ================= */
  function numVal(resp) {
    var s = String(resp == null ? '' : resp).replace(/^\s*[a-zA-Z]\s*=\s*(?=[-−+.\d\\])/, '');
    var pn = HW.parse.number(s); if (pn.ok) return { v: pn.value, dec: true };
    if (pn.code === 'empty') return { res: form('empty', 'Type your answer first.') };
    var r0 = K.number(0)(s); if (r0.v === 'form' && r0.code === 'units') return { res: r0 };
    var a = K.read(s); if (a.res) return { res: a.res };
    if (!isFinite(a.val)) return { res: form('notnumber', 'Enter a single number.') };
    return { v: a.val, dec: false };
  }
  /* dl = [[wrongValue, code, hint], …] (entries equal to the answer are dropped) */
  function numChk(ans, dl) {
    ans = cl(ans); var Ls = (dl || []).filter(function (d) { return d && isFinite(d[0]) && Math.abs(d[0] - ans) > 1e-6; });
    return function (resp) {
      var n = numVal(resp); if (n.res) return n.res;
      if (Math.abs(n.v - ans) < 1e-6) return ok();
      for (var i = 0; i < Ls.length; i++) { var w = Ls[i][0], tol = n.dec && Math.abs(w * 100 - Math.round(w * 100)) > 1e-6 ? 0.006 : 1e-6; if (Math.abs(n.v - w) < tol) return wrong(Ls[i][1], Ls[i][2]); }
      return wrong('value', null);
    };
  }
  function badOf(ans, dl) {
    return (dl || []).filter(function (d) { return d && isFinite(d[0]) && Math.abs(d[0] - ans) > 1e-6; }).map(function (d) { var w = d[0]; return Math.abs(w * 100 - Math.round(w * 100)) > 1e-6 ? w.toFixed(2) : String(cl(w)); })
      .filter(function (s, i, a) { return a.indexOf(s) === i; });
  }
  function numPart(prompt, ans, dl, sol, hints, text, inp) {
    inp = inp || {};
    return { prompt: prompt, input: Object.assign({ type: 'number' }, inp), check: numChk(ans, dl), key: String(cl(ans)), answer: t((inp.ansPre || '') + nT(ans)) + (inp.after ? ' ' + inp.after : ''), solution: sol, hints: hints || [], text: text, bad: badOf(ans, dl) };
  }
  /* an intercept: a number, "x = 6", or the point (6, 0) */
  function asPoint(s) {
    var m = /^\((.+),(.+)\)$/.exec(s.replace(/\s+/g, '')) || /^([^(),=]+),([^(),=]+)$/.exec(s.replace(/\s+/g, '')); if (!m) return null;
    var a = valOf(m[1]), b = valOf(m[2]); return isFinite(a) && isFinite(b) ? [a, b] : null;
  }
  function icptPart(prompt, ans, axis, dl, sol, hints, text) {
    var base = numChk(ans, dl);
    var check = function (resp) {
      var s = cleanS(resp).replace(/^[xy]\s*=\s*/, ''); if (!s) return form('empty', 'Type your answer first.');
      var p = asPoint(s);
      if (p) {
        if (axis === 'y' && !near(p[0], 0)) return wrong('u7x-icpt-axis', 'A point on the ' + t('y') + '-axis has ' + t('x=0') + ': the ' + t('y') + '-intercept is the point ' + t('(0,\\ b)') + '.');
        if (axis === 'x' && !near(p[1], 0)) return wrong('u7x-icpt-axis', 'A point on the ' + t('x') + '-axis has ' + t('y=0') + ': the ' + t('x') + '-intercept is the point ' + t('(a,\\ 0)') + '.');
        s = String(cl(axis === 'y' ? p[1] : p[0]));
      }
      return base(s);
    };
    return { prompt: prompt, input: { type: 'math', keys: 'fraction', before: t(axis + '='), placeholder: 'a number' }, check: check, key: String(cl(ans)), answer: t(axis + '=' + nT(ans)) + ' &nbsp;(the point ' + t(axis === 'x' ? ptT(ans, 0) : ptT(0, ans)) + ')',
      solution: sol, hints: hints || [], text: text, bad: badOf(ans, dl), good: [axis === 'x' ? ptK(ans, 0) : ptK(0, ans), axis + '=' + cl(ans)] };
  }
  /* a slope value; diag(v) -> { code, hint } */
  function slopePart(prompt, sl, list, sol, hints, text) {
    var Ls = (list || []).filter(function (d) { return isFinite(fv(d[0])) && !near(fv(d[0]), fv(sl)); });
    var diag = function (v) { for (var i = 0; i < Ls.length; i++) if (near(v, fv(Ls[i][0]))) return { code: Ls[i][1], hint: Ls[i][2] }; return null; };
    var key = nT(sl);
    return { prompt: prompt, input: { type: 'math', keys: 'slope', before: t('m='), placeholder: 'e.g. -2 or 3/4' }, check: K.slope(fr(sl), { diag: diag }), key: key, answer: t('m=' + key), solution: sol, hints: hints || [], text: text,
      bad: Ls.map(function (d) { return nT(d[0]); }).filter(function (x, i, a) { return a.indexOf(x) === i && x !== key; }) };
  }
  /* a point: (4, 1) or 4, 1 */
  function pointPart(prompt, P, W, sol, hints, text) {
    var key = Ln.ptTex(P);
    return { prompt: prompt, input: { type: 'math', keys: 'pairs', placeholder: 'e.g. (3, -2)' }, check: K.point(P, { noBrackets: true, wrong: W }), key: key, answer: t(key), solution: sol, hints: hints || [], text: text,
      bad: W.map(function (w) { return ptK(w.is[0], w.is[1]); }).filter(function (x, i, a) { return a.indexOf(x) === i && x !== ptK(P[0], P[1]); }) };
  }

  /* ================= equations of lines =================
   * K.P.line + extras: a bare number that equals b is an unfinished step (u7x-only-b); any other bare number is "not an
   * equation" (no credit); a non-linear equation is wrong; a rounded decimal gets a nudge. opt.wrong lines become bad answers. */
  function closeL(S, T) {
    if (Math.abs(S[1]) < 1e-12 || Math.abs(T[1]) < 1e-12) return false;
    return Math.abs(-S[0] / S[1] + T[0] / T[1]) < 0.051 && Math.abs(-S[2] / S[1] + T[2] / T[1]) < 0.051;
  }
  function LP(prompt, target, opt, sol, hints, text) {
    opt = opt || {};
    var vars = opt.vars || ['x', 'y'], TL = Ln.of(target), bv = TL[1] === 0 ? null : -TL[2] / TL[1];
    var p = B.line(prompt, target, opt, sol, hints, text), c = p.check;
    var onlyB = 'You found ' + t('b') + ' — now finish: write the whole equation, ' + t(vars[1] + '=m' + vars[0] + '+b') + ', with your slope and ' + t('b') + '.';
    p.check = function (resp) {
      var s = cleanS(resp);
      if (s && s.indexOf('=') < 0) {
        var v = valOf(s);
        if (isFinite(v) && bv != null && near(v, bv) && !opt.noOnlyB) return wrong('u7x-only-b', onlyB);
        return form('eq-no-equals', 'Write the whole equation, with an equals sign — for example ' + t(vars[1] + '=2' + vars[0] + '+3') + '.');
      }
      var mb = /^b\s*=\s*(.+)$/.exec(s);
      if (mb && bv != null && near(valOf(mb[1]), bv) && !opt.noOnlyB) return wrong('u7x-only-b', onlyB);
      var res = c(resp);
      if (res.v === 'form' && res.code === 'line-not-linear') return wrong('u7x-notlinear', 'That isn’t the equation of a line: ' + t(vars[0]) + ' and ' + t(vars[1]) + ' appear only to the first power, and never in a denominator.');
      if (res.v === 'wrong' && /\d\.\d/.test(String(resp))) { var rr = Ln.read(resp, vars); if (rr.ok && closeL([rr.a, rr.b, rr.c], TL)) return form('u7x-decimal', 'Close — but give the <b>exact</b> equation: write the numbers as fractions, not rounded decimals.'); }
      return res;
    };
    var bad = [];
    (opt.wrong || []).forEach(function (w) { var is = w.is; if (typeof is === 'string') bad.push(is); else if (!Ln.same(Ln.of(is), TL)) bad.push(Ln.tex(is, opt.form === 'general' ? 'general' : 'slope-intercept', null, vars)); });
    p.bad = bad.concat(opt.bad || []).filter(function (x, i, arr) { return arr.indexOf(x) === i; });
    return p;
  }
  /* keep only the wrong lines that differ from the target and from each other */
  function W(target, list) {
    var TL = Ln.of(target), seen = [];
    return list.filter(function (w) { if (!w || !w.is) return false; var Lw = typeof w.is === 'string' ? null : Ln.of(w.is); if (!Lw) return true; if (Ln.same(Lw, TL) || seen.some(function (s) { return Ln.same(s, Lw); })) return false; seen.push(Lw); return true; });
  }

  /* ================= graphs ================= */
  var INK = '#2b3340';
  function clip(m, b, xr, yr) {
    var mv = fv(m), bv = fv(b), out = [];
    if (mv === 0) return [[xr[0], bv], [xr[1], bv]];
    [xr[0], xr[1]].forEach(function (x) { var y = mv * x + bv; if (y >= yr[0] - 1e-9 && y <= yr[1] + 1e-9) out.push([x, y]); });
    [yr[0], yr[1]].forEach(function (y) { var x = (y - bv) / mv; if (x > xr[0] + 1e-9 && x < xr[1] - 1e-9) out.push([x, y]); });
    out.sort(function (p, q) { return p[0] - q[0]; });
    return [out[0], out[out.length - 1]];
  }
  /* a line (or a vertical line { x: k }) with marked points; o = { x, y, points, max, labels, aria } */
  function lineFig(ls, o) {
    o = o || {};
    var xr = o.x || [-5, 5], yr = o.y || [-5, 5], ix = [xr[0] + 0.3, xr[1] - 0.3], iy = [yr[0] + 0.3, yr[1] - 0.3];
    var segs = ls.map(function (l) { return { pts: l.x != null ? [[l.x, iy[0]], [l.x, iy[1]]] : clip(l.m, l.b, ix, iy), start: 'arrow', end: 'arrow' }; });
    return HW.graph({ x: xr, y: yr, grid: 1, labels: o.labels || 1, segs: segs, points: (o.points || []).map(function (p) { return { x: p[0], y: p[1] }; }), max: o.max || 300, aria: o.aria || 'graph of a line' });
  }
  function labP(x, y) { return ('(' + x + ', ' + y + ')').replace(/-/g, '−'); }
  function figBox(svg) { return '<div class="fig">' + svg + '</div>'; }
  /* lattice points of y = mx + b in a window */
  function latPts(m, b, xr, yr) {
    var out = [];
    for (var x = xr[0]; x <= xr[1]; x++) { var y = fv(m) * x + fv(b); if (Math.abs(y - Math.round(y)) < 1e-9 && y >= yr[0] - 1e-9 && y <= yr[1] + 1e-9) out.push([x, Math.round(y)]); }
    return out;
  }
  /* graph pad (copied from the 10C slips) */
  var PADHELP = ' <span style="color:#6a7182;font-size:.92em">(Use <b>╱ Line</b>: tap two points on the line — its ends start as arrows.)</span>';
  function padI() { return { x: [-6, 6], y: [-6, 6], grid: 1, labels: 2, defaultEnd: 'arrow', max: 360 }; }
  function gv(pts, pieces) { return { pts: pts || [], pieces: pieces || [], join: 'none' }; }
  function lineV(p, q) { return gv([], [{ v: [p, q], s: 'arrow', e: 'arrow' }]); }
  function lineCoef(v) { var g = DR.geom(v), ks = Object.keys(g.lines); if (ks.length !== 1 || g.pts.length) return null; return g.lines[ks[0]]; }
  function segOf(v) { var n = DR.norm(v); return gv([], n.pieces.map(function (pc) { return { v: pc.v, s: 'closed', e: 'closed' }; })); }
  function exactChk(target, Wl, o) {
    o = o || {};
    var base = K.graphExact(target, { wrong: Wl }), TL = lineCoef(target);
    function onT(p) { return Math.abs(TL.A * p[0] + TL.B * p[1] - TL.C) < 1e-6; }
    return function (resp) {
      if (!DR.empty(resp) && DR.same(resp, target)) return ok();
      var n = DR.norm(resp);
      if (!n.pieces.length && n.pts.length >= 2 && n.pts.every(onT)) return wrong('u7x-gr-join', 'Your points are on the line — now join them: choose <b>╱ Line</b> and tap two of them (the ends become arrows, because the line goes on forever).');
      if (!n.pieces.length && n.pts.length === 1 && onT(n.pts[0])) return wrong('u7x-gr-join', 'That point is on the line. Find a second point, then join them with <b>╱ Line</b>.');
      var r = base(resp);
      if (r.v === 'wrong' && r.code === 'graph' && o.m != null) {
        var S = lineCoef(resp);
        if (S && S.B !== 0) {
          var ms = -S.A / S.B, bs = S.C / S.B;
          if (near(bs, o.b) && !near(ms, o.m)) return wrong('u7x-gr-slope', 'Your line crosses the ' + t('y') + '-axis in the right place — now check the slope.');
          if (near(ms, o.m) && !near(bs, o.b)) return wrong('u7x-gr-icpt', 'Your line has the right slope, but it is in the wrong place. Check the intercepts.');
        }
      }
      return r;
    };
  }
  function drawPart(prompt, target, Wl, o, sol, hints, text, extraBad) {
    var p = B.graph(prompt + PADHELP, padI(), exactChk(target, Wl, o), target, sol, hints, text);
    p.bad = Wl.map(function (w) { return w.is; }).concat(extraBad || []).filter(function (b) { return !DR.same(b, target); });
    return p;
  }
  /* bold point names placed in the free corner next to each point */
  function labTxt(x, y, s) { return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="15" font-weight="700" font-style="italic" text-anchor="middle" dominant-baseline="central" fill="' + INK + '" paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round">' + s + '</text>'; }
  function namedPtsFig(pts, names, o) {
    o = o || {};
    var svg = HW.graph({ x: o.x || [-5, 5], y: o.y || [-5, 5], grid: 1, labels: 1, points: pts.map(function (p) { return { x: p[0], y: p[1] }; }), max: o.max || 300, aria: o.aria || 'points on a grid' });
    var G = HW.graph.last, extra = '';
    pts.forEach(function (p, i) {
      var ax = G.X(p[0]), ay = G.Y(p[1]), best = null, bestD = -1;
      [[1, -1], [-1, -1], [1, 1], [-1, 1]].forEach(function (d) {
        var x = ax + d[0] * 13, y = ay + d[1] * 13, dm = 1e9;
        pts.forEach(function (q, j) { if (j !== i) dm = Math.min(dm, Math.hypot(G.X(q[0]) - x, G.Y(q[1]) - y)); });
        dm = Math.min(dm, Math.abs(x - G.X(0)) + 6, Math.abs(y - G.Y(0)) + 6);
        if (x < 8 || x > G.W - 8 || y < 8 || y > G.H - 8) dm = -1;
        if (dm > bestD) { bestD = dm; best = [x, y]; }
      });
      extra += labTxt(best[0], best[1], names[i]);
    });
    return figBox(svg.replace(/<\/svg>$/, extra + '</svg>'));
  }
  /* small graph for a multiple-choice option: lines [{ m, b } | { x } ] with marked points */
  function miniG(l, pts, aria) {
    var ix = [-4.7, 4.7];
    var seg = l.x != null ? [[l.x, ix[0]], [l.x, ix[1]]] : clip(l.m, l.b, ix, ix);
    return HW.graph({ x: [-5, 5], y: [-5, 5], grid: 1, labels: 2, segs: [{ pts: seg, start: 'arrow', end: 'arrow' }], points: (pts || []).map(function (p) { return { x: p[0], y: p[1] }; }), max: 210, aria: aria });
  }

  /* =====================================================================================================
   * Lesson 1 — Review: graphing linear equations from a table of values (RF4)
   * ===================================================================================================== */
  function l1q1(r) { // Ryan: y = −3x + 2 at x = −2 → 8 · y = −4x + 3 at x = −2 → 11
    var s = until(function () { return { m: r.pick([-5, -4, -3, -3, -2, -4, 2, 3, 4]), x: r.pick([-3, -2, -2, -1, 2, 3]), b: r.pick(nzs(-6, 6)) }; }, function (s) { return (s.m < 0 || s.x < 0) && Math.abs(s.b) !== Math.abs(s.m * s.x); });
    var m = s.m, x = s.x, b = s.b, y = m * x + b, eq = SI(m, b), mx = m * x;
    var dl = [[-mx + b, 'u7x-tv-sign', (m < 0 && x < 0 ? 'A negative times a negative is <b>positive</b>: ' : 'A negative times a positive is <b>negative</b>: ') + t(m + '(' + x + ')=' + mx) + '.'],
      [m + x + b, 'u7x-tv-add', t(m + 'x') + ' means ' + t(m) + ' <b>times</b> ' + t('x') + '. Put ' + t(x) + ' in brackets: ' + t(m + '(' + x + ')') + '.'],
      [mx - b, 'u7x-tv-b', 'The equation says ' + t((b < 0 ? '' : '+') + b) + ' — keep that term as it is: ' + t(mx + (b < 0 ? '' : '+') + b) + '.'],
      [mx, 'u7x-tv-nob', 'Don’t forget the constant term ' + t(b) + ': ' + t('y=' + pT(mx) + (b < 0 ? '' : '+') + b) + '.']];
    return numPart('You are building a table of values for ' + t(eq) + '. What is ' + t('y') + ' when ' + t('x=' + x) + '?', y, dl,
      t('y=' + m + '(' + x + ')' + (b < 0 ? '' : '+') + b + '=' + mx + (b < 0 ? '' : '+') + b + '=' + y) + ', so the table has the pair ' + t(ptT(x, y)) + '.',
      ['Replace ' + t('x') + ' with ' + t(x) + ' in brackets: ' + t('y=' + m + '(' + x + ')' + (b < 0 ? '' : '+') + b) + '.', 'Multiply first (watch the signs), then add the constant.'], 'table value of ' + eq, { before: t('y='), ansPre: 'y=' });
  }
  function l1q2(r) { // Ryan: y = 2x − 1, A(3, 2) B(0, 2) C(2, 3) D(−2, 3) · y = 3x − 2, A(4, 2) B(0, 3) C(2, 4) D(−2, 4)
    var s = until(function () { return { m: r.pick([2, 3, -2, -1, 1, 2, 3]), b: r.pick(nzs(-3, 3)), p: r.pick([1, 2, 3, -1, -2]) }; }, function (s) {
      var y = s.m * s.p + s.b, P = [[s.p, y], [y, s.p], [0, s.m], [-s.p, y]];
      if (y === s.p || y === 0 || s.b === s.m || Math.abs(s.m) === 1 && Math.abs(s.p) === 1) return false;
      if (P.some(function (q) { return Math.abs(q[0]) > 4 || Math.abs(q[1]) > 4; })) return false;
      if (s.m * y + s.b === s.p) return false;   // the swapped point must be off the line
      return P.every(function (q, i) { return P.every(function (q2, j) { return i === j || q[0] !== q2[0] || q[1] !== q2[1]; }); });
    });
    var m = s.m, b = s.b, p = s.p, y = m * p + b, eq = SI(m, b);
    var kinds = [{ k: 'ok', P: [p, y] }, { k: 'swap', P: [y, p] }, { k: 'slope', P: [0, m] }, { k: 'sign', P: [-p, y] }];
    var names = ['A', 'B', 'C', 'D'], order = r.shuffle(kinds);
    function val(x0) { return m * x0 + b; }
    function chk(P) { return t(m + '(' + P[0] + ')' + (b < 0 ? '' : '+') + b + '=' + val(P[0])); }
    var why = {
      swap: function (P, n) { return 'Point ' + n + ' is ' + t(ptT(P[0], P[1])) + ': ' + chk(P) + ', not ' + t(P[1]) + '. Its coordinates are the right point’s swapped — read across for ' + t('x') + ' first, then up or down for ' + t('y') + '.'; },
      slope: function (P, n) { return 'Point ' + n + ' is ' + t(ptT(P[0], P[1])) + ', but at ' + t('x=0') + ', ' + t('y=' + b) + '. The ' + t(m) + ' is the slope, not a point on the ' + t('y') + '-axis.'; },
      sign: function (P, n) { return 'Point ' + n + ' is ' + t(ptT(P[0], P[1])) + ': ' + chk(P) + ', not ' + t(P[1]) + '. Substitute ' + (P[0] < 0 ? 'negative ' : '') + t('x') + '-values with their sign, in brackets.'; } };
    var opts = order.map(function (o, i) { return { html: 'Point ' + names[i], right: o.k === 'ok', why: o.k === 'ok' ? null : why[o.k](o.P, names[i]), code: o.k }; });
    var rightName = names[order.map(function (o) { return o.k; }).indexOf('ok')];
    var p0 = mc(r, 'Which plotted point lies on the line ' + t(eq) + '?' + namedPtsFig(order.map(function (o) { return o.P; }), names, { aria: 'four labelled points on a grid' }), opts,
      'Point ' + rightName + ' is ' + t(ptT(p, y)) + '. Substitute ' + t('x=' + p) + ': ' + chk([p, y]) + ' ✓, so ' + rightName + ' is on the line. Each of the other points gives a different ' + t('y') + '-value.',
      ['Read each point’s coordinates, then substitute its ' + t('x') + ' into the equation.', 'The point is on the line only if the equation gives exactly its ' + t('y') + '-value.'], 'which point is on ' + eq, true);
    p0.input.columns = 2;
    return p0;
  }
  function l1q3(r) { // Ryan: not linear among y = 7, y = −3x, y = x/2 + 1, y = 2/x · y = x/5 − 2, y = x² + 1, y = −4, y = 6x
    var nl = r.pick(['recip', 'sq', 'sq', 'cube', 'recip']), k = r.int(2, 9), c = r.pick(nzs(-6, 6));
    var nlTex = nl === 'recip' ? 'y=\\dfrac{' + k + '}{x}' : nl === 'sq' ? 'y=x^{2}' + (c < 0 ? '' : '+') + c : 'y=x^{3}' + (c < 0 ? '' : '+') + c;
    var nlWhy = nl === 'recip' ? t('x') + ' is in the <b>denominator</b>, so the graph is a curve, not a straight line.' : t('x') + ' is ' + (nl === 'sq' ? 'squared' : 'cubed') + ', so the graph is a curve' + (nl === 'sq' ? ' (a parabola)' : '') + ', not a straight line.';
    var h = r.pick(nzs(-9, 9)), a = r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), n = r.int(2, 5), d = r.pick(nzs(-5, 5));
    var opts = [{ html: t(nlTex), right: true, code: 'nl' },
      { html: t('y=' + h), why: t('y=' + h) + ' is a horizontal line, so it is linear. A missing ' + t('x') + ' is fine; ' + t('x') + ' in a denominator or with an exponent is not.', code: 'horiz' },
      { html: t('y=' + a + 'x'), why: t('y=' + a + 'x') + ' is linear: ' + t('x') + ' is to the first power. It just passes through ' + t('(0,\\ 0)') + '.', code: 'noconst' },
      { html: t('y=\\dfrac{x}{' + n + '}' + (d < 0 ? '' : '+') + d), why: t('\\frac{x}{' + n + '}') + ' is just ' + t('\\frac{1}{' + n + '}x') + ', a number times ' + t('x') + ', so it is linear. Non-linear means ' + t('x') + ' itself is in the denominator.', code: 'xovern' }];
    return mc(r, 'Which equation is <b>not</b> linear?', opts,
      'In ' + t(nlTex) + ', ' + nlWhy + ' The other three are linear: ' + t('x') + ' appears only to the first power (or not at all).',
      ['A linear equation has ' + t('x') + ' only to the first power — no exponents on ' + t('x') + ', and ' + t('x') + ' never in a denominator.', 'A horizontal line ' + t('y=k') + ' is still linear.'], 'not linear: ' + nl);
  }
  function l1q4(r) { // added (Mastery): assignment Q15 — (k, 11) on y = 3x + 2 → k = 3
    var s = until(function () { return { m: r.pick([2, 3, 4, 5, 6, -2, -3, -4, -5]), k: r.pick(nzs(-5, 6)), b: r.pick(nzs(-9, 9)) }; }, function (s) { var Y = s.m * s.k + s.b; return Y !== 0 && Math.abs(Y) <= 30 && Math.abs(Y) !== Math.abs(s.k) && Y !== s.b; });
    var m = s.m, k = s.k, b = s.b, Y = m * k + b, eq = SI(m, b);
    var dl = [[m * Y + b, 'u7x-k-subx', t(Y) + ' is the <b>' + t('y') + '</b>-coordinate. Substitute ' + t('y=' + Y) + ' and solve for ' + t('x') + '.'],
      [(Y + b) / m, 'u7x-k-sign', 'Check the step that undoes ' + t((b < 0 ? '' : '+') + b) + ': ' + t(Y + '-' + pT(b) + '=' + (Y - b)) + '.'],
      [Y - b, 'u7x-k-nodiv', t(m + 'k=' + (Y - b)) + ' — divide both sides by ' + t(m) + ' to finish.'],
      [m / (Y - b), 'u7x-k-recip', 'Divide the other way: ' + t('k=\\frac{' + (Y - b) + '}{' + m + '}') + '.']];
    return numPart('The point ' + t('(k,\\ ' + Y + ')') + ' lies on the line ' + t(eq) + '. Determine the value of ' + t('k') + '.', k, dl,
      'The point is on the line, so its coordinates make the equation true. Substitute ' + t('x=k') + ' and ' + t('y=' + Y) + ':<br>' + t(Y + '=' + m + 'k' + (b < 0 ? '' : '+') + b) + '<br>' + t((Y - b) + '=' + m + 'k') + '<br>' + t('k=' + k) + '.<br><b>Check.</b> ' + t(m + '(' + k + ')' + (b < 0 ? '' : '+') + b + '=' + Y) + ' ✓',
      ['A point on the line makes the equation true: substitute ' + t('y=' + Y) + ' and ' + t('x=k') + '.', 'Undo the constant first, then divide by the slope.'], 'missing coordinate on ' + eq, { before: t('k='), ansPre: 'k=' });
  }
  HW.defineExit({ lesson: 'u7l1', calc: false, outcome: 'RF4',
    blurb: 'Tables of values: a y-value from the equation, which point is on a line, linear or not, and a missing coordinate.',
    questions: [Q(1, 'RF4', 'BEG', l1q1), Q(2, 'RF4', 'BEG', l1q2), Q(3, 'RF4', 'PRG', l1q3), Q(4, 'RF4', 'MAS', l1q4)] });

  /* =====================================================================================================
   * Lesson 2 — Slope–intercept form y = mx + b (RF6)
   * ===================================================================================================== */
  function l2q1(r) { // Ryan: slope of y = −x + 4 → −1 · y = x − 7 → 1
    var s = r.pick([1, -1]), c = r.pick(nzs(-9, 9).filter(function (v) { return Math.abs(v) > 1; }));
    var eq = 'y=' + (s < 0 ? '-' : '') + 'x' + (c < 0 ? '' : '+') + c;
    return slopePart('What is the slope ' + t('m') + ' of the line ' + t(eq) + '?', s, [
      [-s, 'u7x-m-sign', s < 0 ? t('-x') + ' means ' + t('-1x') + ': keep the negative sign.' : 'There is no negative sign in front of ' + t('x') + ': ' + t('x=1x') + '.'],
      [c, 'u7x-mb-swap', t(c) + ' is the constant term, ' + t('b') + '. The slope is the number in front of ' + t('x') + '.'], [-c, 'u7x-mb-swap', 'The constant term is ' + t('b') + ', not the slope. The slope is the number in front of ' + t('x') + '.'],
      [0, 'u7x-m-zero', 'A bare ' + t('x') + ' has coefficient ' + t('1') + (s < 0 ? ', so ' + t('-x') + ' has coefficient ' + t('-1') : '') + '. A slope of ' + t('0') + ' happens only when there is no ' + t('x') + ' at all.']],
      t(s < 0 ? '-x=-1x' : 'x=1x') + ', so ' + t('m=' + s) + ' (and ' + t('b=' + c) + ').',
      ['In ' + t('y=mx+b') + ', the slope is the number multiplying ' + t('x') + '.', 'If no number is written, it is a ' + t('1') + ' (with the sign in front).'], 'slope of ' + eq);
  }
  function l2q2(r) { // Ryan: 4x + 2y = 10 → y = −2x + 5 · 6x + 3y = 12 → y = −2x + 4
    var bq = r.pick([2, 2, 3, 3, 4]), k = r.pick([1, 2, 2, 3, 3, 4, 5, -1, -2, -3]), q = r.pick(nzs(-6, 6));
    var a = bq * k, c = bq * q, eq = lin([[a, 'x'], [bq, 'y']]) + '=' + c, m = -k, T = L(m, q);
    var Wl = W(T, [{ is: L(k, q), code: 'u7x-re-sign', hint: 'When ' + t(term(a, 'x', true)) + ' moves to the other side it changes sign: ' + t(bq + 'y=' + lin([[-a, 'x'], [c, '']])) + '.' },
      { is: L(m, c), code: 'u7x-re-divone', hint: 'Divide <b>every</b> term by ' + t(bq) + ': ' + t(term(-a, 'x', true) + '\\div ' + bq + '=' + term(m, 'x', true)) + ' and ' + t(pT(c) + '\\div ' + bq + '=' + q) + '.' },
      { is: L(-a, c), code: 'u7x-not-divided', hint: t(bq + 'y=' + lin([[-a, 'x'], [c, '']])) + ' still has a ' + t(bq) + ' on ' + t('y') + '. Divide every term by ' + t(bq) + '.' },
      { is: L(-a * bq, c * bq), code: 'u7x-re-mult', hint: 'To undo ' + t(bq + 'y') + ', <b>divide</b> by ' + t(bq) + ' (don’t multiply).' }]);
    return LP('Rearrange into slope–intercept form, ' + t('y=mx+b') + ': ' + t(eq), T, { form: 'slope-intercept', wrong: Wl, bad: [SI(m, -q)], noOnlyB: true },
      (a > 0 ? 'Subtract ' + t(a + 'x') : 'Add ' + t(-a + 'x')) + ' on both sides: ' + t(bq + 'y=' + lin([[-a, 'x'], [c, '']])) + '.<br>Divide <b>every</b> term by ' + t(bq) + ': ' + t(SI(m, q)) + ' (so ' + t('m=' + m) + ', ' + t('b=' + q) + ').',
      ['Move the ' + t('x') + '-term to the right side first (it changes sign).', 'Then divide every term by the coefficient of ' + t('y') + ', ' + t(bq) + '.'], 'rearrange ' + eq);
  }
  function l2q3(r) { // added (Mastery): find and fix the error (EP 2 Q9–10) with a negative y-coefficient
    var bq = r.pick([2, 3, 4]), k = r.pick([1, 2, 3, 4, 5]), q = r.pick(nzs(-5, 5)), err = r.pick(['pos', 'const']), nm = r.pick(['Sam', 'Ava', 'Liam', 'Noor', 'Jordan', 'Mia']);
    var a = bq * k, c = bq * q, eq = lin([[a, 'x'], [-bq, 'y']]) + '=' + c, m = k, bb = -q, T = L(m, bb);
    var step1 = t('-' + bq + 'y=' + lin([[-a, 'x'], [c, '']]));
    var their = err === 'pos' ? L(-m, -bb) : L(m, -bb);
    var theirT = SI(their.m, their.b);
    var Wl = W(T, [{ is: their, code: 'u7x-copied', hint: 'That is ' + nm + '’s answer — and it has a mistake. Divide <b>every</b> term by ' + t('-' + bq) + ', and keep track of each sign.' },
      { is: L(-m, -bb), code: 'u7x-re-negdiv', hint: 'Divide by ' + t('-' + bq) + ', including its negative sign: both terms on the right change sign.' },
      { is: L(m, -bb), code: 'u7x-re-negdiv', hint: 'Divide the constant by ' + t('-' + bq) + ' too: ' + t(pT(c) + '\\div(-' + bq + ')=' + bb) + '.' },
      { is: L(-m, bb), code: 'u7x-re-negdiv', hint: 'Divide the ' + t('x') + '-term by ' + t('-' + bq) + ' too: ' + t(term(-a, 'x', true) + '\\div(-' + bq + ')=' + term(m, 'x', true)) + '.' }]);
    var why = err === 'pos' ? nm + ' divided by ' + t(bq) + ' instead of ' + t('-' + bq) + ', so both signs on the right are wrong' : nm + ' divided the ' + t('x') + '-term by ' + t('-' + bq) + ' but forgot the negative when dividing the constant';
    return LP(nm + ' rearranged ' + t(eq) + ' into slope–intercept form. Here is the work:<div style="margin:.4em 0 .4em 1em">' + step1 + '<br>' + t(theirT) + '</div>The answer is <b>wrong</b>. Find the mistake, then write the correct equation in the form ' + t('y=mx+b') + '.', T,
      { form: 'slope-intercept', wrong: Wl, noOnlyB: true },
      'The first line is right: ' + step1 + '. The mistake is in the second line: ' + why + '.<br>Divide <b>every</b> term by ' + t('-' + bq) + ': ' + t(term(-a, 'x', true) + '\\div(-' + bq + ')=' + term(m, 'x', true)) + ' and ' + t(pT(c) + '\\div(-' + bq + ')=' + bb) + '.<br>So ' + t(SI(m, bb)) + '.<br><b>Check</b> with ' + t('x=0') + ': ' + t(lin([[-bq, 'y']]) + '=' + c + '\\Rightarrow y=' + bb) + ' ✓',
      ['Redo the second step yourself: divide every term by ' + t('-' + bq) + ', the whole coefficient of ' + t('y') + '.', 'Dividing by a negative changes the sign of every term.'], 'fix the error: ' + eq);
  }
  HW.defineExit({ lesson: 'u7l2', calc: false, outcome: 'RF6',
    blurb: 'Slope–intercept form: the slope of y = ±x + c, rearranging into y = mx + b, and finding and fixing a mistake.',
    questions: [Q(1, 'RF6', 'BEG', l2q1), Q(2, 'RF6', 'PRG', l2q2), Q(3, 'RF6', 'MAS', l2q3)] });

  /* =====================================================================================================
   * Lesson 3 — Graphing a line using slope–intercept form (RF6)
   * ===================================================================================================== */
  function inWin(P, w) { return Math.abs(P[0]) <= w && Math.abs(P[1]) <= w; }
  function stepPts(S, dx, dy, w) { var P = [S[0] + dx, S[1] + dy]; if (inWin(P, w)) return [S, P]; P = [S[0] - dx, S[1] - dy]; return inWin(P, w) ? [S, P] : null; }
  function l3q1(r) { // Ryan: which graph shows y = −2/3x + 2 · y = 1/2x − 2
    var s = until(function () {
      var q = r.pick([2, 3, 3, 4]), p = r.pick([1, 2, 3]), sg = r.pick([1, -1]), b = r.pick(nzs(-3, 3));
      if (gcd(p, q) !== 1 || p === q) return null;
      var P = { ok: stepPts([0, b], q, sg * p, 4.6), sign: stepPts([0, b], q, -sg * p, 4.6), flip: stepPts([0, b], p, sg * q, 4.6), xaxis: stepPts([b, 0], q, sg * p, 4.6) };
      return { q: q, p: p, sg: sg, b: b, P: P };
    }, function (s) { return s.P.ok && s.P.sign && s.P.flip && s.P.xaxis; });
    var m = fr(s.sg * s.p, s.q), b = s.b, eq = SI(m, b), up = s.sg > 0;
    var lines = { ok: L(m, b), sign: L(fNeg(m), b), flip: L(fr(s.sg * s.q, s.p), b), xaxis: L(m, fr(-s.sg * s.p * b, s.q)) };
    var aria = { ok: 'a line', sign: 'a line', flip: 'a line', xaxis: 'a line' };
    var whys = { sign: 'This line ' + (up ? 'falls' : 'rises') + ' from left to right, but the slope ' + t(nT(m)) + ' is ' + (up ? 'positive' : 'negative') + ', so the line must ' + (up ? 'rise' : 'fall') + '.',
      flip: 'Rise and run are swapped in this graph. In ' + t(nT(m)) + ' the top number is the rise (' + t(s.p) + ' ' + (up ? 'up' : 'down') + ') and the bottom number is the run (' + t(s.q) + ' right).',
      xaxis: 'This line starts at ' + t(ptT(b, 0)) + ' on the ' + t('x') + '-axis. The ' + t('y') + '-intercept is on the <b>' + t('y') + '</b>-axis: start at ' + t(ptT(0, b)) + '.' };
    var opts = ['ok', 'sign', 'flip', 'xaxis'].map(function (k) { return { html: miniG(lines[k], s.P[k], aria[k] + ' through two marked points'), right: k === 'ok', why: whys[k], code: k }; });
    var P2 = s.P.ok[1];
    var p0 = mc(r, 'Which graph shows the line ' + t(eq) + '?', opts,
      'Start at the ' + t('y') + '-intercept ' + t(ptT(0, b)) + '. The slope ' + t(nT(m)) + ' means ' + (up ? 'up ' : 'down ') + t(s.p) + ' for every ' + t(s.q) + ' to the right, so the line also passes through ' + t(ptT(P2[0], P2[1])) + ' and ' + (up ? 'rises' : 'falls') + ' from left to right.',
      ['Find ' + t('b') + ' first: where must the line cross the ' + t('y') + '-axis?', 'Then check the slope: top number = rise (up/down), bottom number = run (right).'], 'which graph is ' + eq);
    p0.input.columns = 2;
    return p0;
  }
  function l3q2(r) { // Ryan: y = 3/4x − 2 → (4, 1) · y = 2/5x + 1 → (5, 3)
    var s = until(function () { return { q: r.pick([2, 3, 4, 5]), p: r.pick([1, 2, 3, 4]), sg: r.pick([1, 1, 1, -1]), b: r.pick(nzs(-4, 4)) }; }, function (s) { return gcd(s.p, s.q) === 1 && s.p !== s.q && s.p !== s.sg * s.b && Math.abs(s.b) !== s.p; });
    var p = s.p, q = s.q, sg = s.sg, b = s.b, m = fr(sg * p, q), eq = SI(m, b), P = [q, b + sg * p];
    var Wl = [{ is: [p, b + sg * q], code: 'u7x-step-flip', hint: 'In ' + t(nT(m)) + ' the rise is ' + t(sg * p) + ' (top) and the run is ' + t(q) + ' (bottom): go right ' + t(q) + ', ' + (sg > 0 ? 'up ' : 'down ') + t(p) + '.' },
      { is: [q, b - sg * p], code: 'u7x-step-dir', hint: 'The slope is ' + (sg > 0 ? 'positive, so go <b>up</b>' : 'negative, so go <b>down</b>') + ' ' + t(p) + '.' },
      { is: [q, -b + sg * p], code: 'u7x-step-b', hint: 'The equation says ' + t((b < 0 ? '' : '+') + b) + ', so the ' + t('y') + '-intercept is ' + t(ptT(0, b)) + '.' },
      { is: [1, b], code: 'u7x-step-one', hint: 'Use the slope as ' + t('\\frac{\\text{rise}}{\\text{run}}=' + nT(m)) + ': right ' + t(q) + ', ' + (sg > 0 ? 'up ' : 'down ') + t(p) + '.' },
      { is: [1, b + sg * p], code: 'u7x-step-one', hint: 'The run is ' + t(q) + ', not ' + t('1') + ': go right ' + t(q) + ' and ' + (sg > 0 ? 'up ' : 'down ') + t(p) + '.' }].filter(function (w) { return !(w.is[0] === P[0] && w.is[1] === P[1]); });
    var fig = figBox(HW.graph({ x: [-1, 6], y: [Math.min(b, P[1]) - 2, Math.max(b, P[1]) + 2], grid: 1, labels: 1, segs: [{ pts: [[0, b], [q, b], [q, P[1]]], dash: true }], points: [{ x: 0, y: b, label: labP(0, b) }, { x: q, y: P[1], label: labP(q, P[1]) }], max: 240, aria: 'the step from the y-intercept' }));
    return pointPart('You are graphing ' + t(eq) + '. Start at the ' + t('y') + '-intercept, then use the slope once, moving <b>right</b> by the run. What point do you land on? Type it as ' + t('(x,\\ y)') + '.', P, Wl,
      'Start at ' + t(ptT(0, b)) + '. Rise ' + t(sg * p) + ', run ' + t(q) + ': right ' + t(q) + ' and ' + (sg > 0 ? 'up ' : 'down ') + t(p) + ' lands on ' + t(ptT(P[0], P[1])) + '.' + fig,
      ['The ' + t('y') + '-intercept is ' + t(ptT(0, b)) + '.', 'Slope = rise ÷ run: the bottom number is how far right, the top number how far up (or down if negative).'], 'one slope step on ' + eq);
  }
  function l3q3(r) { // added (Mastery): assignment Q13 — triangle POQ under y = −3x + 6 → area 6
    var s = until(function () { return { k: r.pick([1, 2, 2, 3, 3, 4]), a: r.int(1, 6), sg: r.pick([-1, -1, 1]), side: r.pick([1, -1]) }; }, function (s) { var bb = s.k * s.a; return bb <= 12 && s.k !== s.a && (s.k * s.a * s.a) % 2 === 0; });
    var k = s.k, a = s.a, m = s.sg * k, bb = s.side * k * a, x0 = -bb / m, A = Math.abs(bb) * Math.abs(x0) / 2, eq = SI(m, bb);
    var dl = [[Math.abs(bb * x0), 'u7x-tri-half', 'The area of a triangle is ' + t('\\frac{1}{2}\\times\\text{base}\\times\\text{height}') + ' — don’t forget the ' + t('\\frac{1}{2}') + '.'],
      [bb * bb / 2, 'u7x-tri-legs', 'The two legs are not both ' + t(Math.abs(bb)) + ': the base is the distance from ' + t('O') + ' to ' + t('P') + ', where the line crosses the ' + t('x') + '-axis.'],
      [Math.abs(bb) + Math.abs(x0), 'u7x-tri-add', 'Multiply the legs (and halve): area ' + t('=\\frac{1}{2}\\times\\text{base}\\times\\text{height}') + '.']];
    return numPart('The line ' + t(eq) + ' crosses the ' + t('x') + '-axis at ' + t('P') + ' and the ' + t('y') + '-axis at ' + t('Q') + '. With the origin ' + t('O') + ', they form triangle ' + t('POQ') + '. Find the area of the triangle, in square units. <span class="muted">(A quick sketch helps.)</span>', A, dl,
      t('Q') + ' is the ' + t('y') + '-intercept, ' + t(ptT(0, bb)) + '. For ' + t('P') + ', the line reaches ' + t('y=0') + ': ' + t('0=' + lin([[m, 'x'], [bb, '']]) + '\\Rightarrow ' + term(m, 'x', true) + '=' + (-bb) + '\\Rightarrow x=' + nT(x0)) + ', so ' + t('P' + ptT(x0, 0)) + ' (or sketch the line from ' + t('Q') + ' with the slope ' + t(m) + ' and read where it crosses the ' + t('x') + '-axis).<br>The legs are ' + t('OQ=' + Math.abs(bb)) + ' and ' + t('OP=' + Math.abs(x0)) + ':<br>' + t('\\text{Area}=\\frac{1}{2}(' + Math.abs(x0) + ')(' + Math.abs(bb) + ')=' + nT(A)) + ' square units.',
      ['Find both intercepts: ' + t('Q') + ' is ' + t('(0,\\ b)') + '; ' + t('P') + ' is where ' + t('y=0') + '.', 'The triangle has a right angle at ' + t('O') + ': area ' + t('=\\frac{1}{2}\\times\\text{base}\\times\\text{height}') + '.'], 'intercept triangle area', { after: 'square units' });
  }
  HW.defineExit({ lesson: 'u7l3', calc: false, outcome: 'RF6',
    blurb: 'Graphing from y = mx + b: which graph matches, the point one slope step from the y-intercept, and the triangle a line makes with the axes.',
    questions: [Q(1, 'RF6', 'PRG', l3q1), Q(2, 'RF6', 'PRG', l3q2), Q(3, 'RF5', 'MAS', l3q3)] });

  /* =====================================================================================================
   * Lesson 4 — Writing the equation of a line given the slope and the y-intercept (RF7)
   * ===================================================================================================== */
  function l4q1(r) { // Ryan: y = −2x + 3 through (1, 1), (3, −3) · y = 3x − 2 through (1, 1), (2, 4)
    var s = until(function () { var m = r.pick([[-3, 1], [-2, 1], [-1, 1], [1, 1], [2, 1], [3, 1], [-2, 1], [2, 1], [1, 2], [-1, 2]]); return { m: m, b: r.pick(nzs(-4, 4)) }; }, function (s) {
      var pts = latPts(s.m, s.b, [-4, 4], [-4, 4]).filter(function (p) { return p[0] !== 0; }); return pts.length >= 2 && !(s.m[0] === s.b && s.m[1] === 1);
    });
    var m = fr(s.m), b = s.b, pts = latPts(m, b, [-4, 4], [-4, 4]).filter(function (p) { return p[0] !== 0; });
    var i = r.int(0, pts.length - 2), j = Math.min(pts.length - 1, i + r.pick([1, 1, 2])), P1 = pts[i], P2 = pts[j];
    var T = L(m, b), rise = P2[1] - P1[1], run = P2[0] - P1[0];
    var Wl = W(T, [{ is: L(b, m), code: 'u7x-mb-swap', hint: 'The slope goes in front of ' + t('x') + ' and the ' + t('y') + '-intercept is the constant: ' + t('y=mx+b') + '.' },
      { is: L(m, P1[1]), code: 'u7x-b-point', hint: t(ptT(P1[0], P1[1])) + ' is not on the ' + t('y') + '-axis. ' + t('b') + ' is where the line crosses the ' + t('y') + '-axis.' },
      { is: L(m, P2[1]), code: 'u7x-b-point', hint: t(ptT(P2[0], P2[1])) + ' is not on the ' + t('y') + '-axis. ' + t('b') + ' is where the line crosses the ' + t('y') + '-axis.' }]);
    return LP('The line passes through the two marked points, which have integer coordinates. Write its equation in the form ' + t('y=mx+b') + '.' + figBox(lineFig([T], { points: [P1, P2], aria: 'a line through two marked points' })), T, { form: 'slope-intercept', wrong: Wl, bad: [SI(fNeg(m), b), SI(m, -b)] },
      'The line crosses the ' + t('y') + '-axis at ' + t(ptT(0, b)) + ', so ' + t('b=' + b) + '.<br>From ' + t(ptT(P1[0], P1[1])) + ' to ' + t(ptT(P2[0], P2[1])) + ': ' + t('m=\\frac{\\text{rise}}{\\text{run}}=\\frac{' + rise + '}{' + run + '}' + (fEq(fr(rise, run), [rise, run]) && run === 1 ? '' : '=' + nT(m))) + '.<br>So ' + t(SI(m, b)) + '.',
      ['Read ' + t('b') + ' where the line crosses the ' + t('y') + '-axis.', 'Slope = rise ÷ run between the two marked points; a line that falls from left to right has a negative slope.'], 'equation from a graph');
  }
  function l4q2(r) { // Ryan: x −1..2, y −7, −4, −1, 2 → y = 3x − 4 · x −2..1, y 9, 7, 5, 3 → y = −2x + 5
    var s = until(function () { return { st: r.pick([-3, -2, -1, -1, -2]), m: r.pick(nzs(-4, 4)), b: r.pick(nzs(-8, 8)) }; }, function (s) { return s.m !== s.b && Math.abs(s.m) !== Math.abs(s.b); });
    var m = s.m, b = s.b, xs = [0, 1, 2, 3].map(function (i) { return s.st + i; }), ys = xs.map(function (x) { return m * x + b; }), T = L(m, b);
    var Wl = W(T, [{ is: L(m, ys[0]), code: 'u7x-b-first', hint: t('b') + ' is the ' + t('y') + '-value paired with ' + t('x=0') + ', which is ' + t(b) + ' — not the first number in the table.' },
      { is: L(b, m), code: 'u7x-mb-swap', hint: 'The change per step (' + t(m) + ') is the slope ' + t('m') + ', and the value at ' + t('x=0') + ' (' + t(b) + ') is ' + t('b') + '.' }]);
    return LP('Write the equation of the line in this table in the form ' + t('y=mx+b') + '.' + HW.valueTable([['x'].concat(xs), ['y'].concat(ys)]), T, { form: 'slope-intercept', wrong: Wl, bad: [SI(-m, b)].concat(Math.abs(m) > 1 ? [SI(fr(1, m), b)] : []) },
      'Each time ' + t('x') + ' goes up ' + t('1') + ', ' + t('y') + ' goes ' + (m > 0 ? 'up ' : 'down ') + t(Math.abs(m)) + ', so ' + t('m=\\frac{' + m + '}{1}=' + m) + '.<br>At ' + t('x=0') + ', ' + t('y=' + b) + ', so ' + t('b=' + b) + '.<br>' + t(SI(m, b)) + '.',
      ['How much does ' + t('y') + ' change each time ' + t('x') + ' goes up by ' + t('1') + '? That is the slope.', t('b') + ' is the ' + t('y') + '-value in the column where ' + t('x=0') + '.'], 'equation from a table');
  }
  var L4CTX = [
    { txt: 'A candle is {b} cm tall when it is lit. It burns down at a constant rate, and after {T} hours it is {v} cm tall.', X: 't', Y: 'h', xw: 'the time in hours', yw: 'its height in centimetres', tu: 'hours', s: -1, r: [1, 4], b: [20, 36], T: [2, 5], u: 'cm per hour' },
    { txt: 'A water tank already holds {b} L when a hose starts filling it at a constant rate. After {T} minutes the tank holds {v} L.', X: 't', Y: 'V', xw: 'the time in minutes', yw: 'the volume in litres', tu: 'minutes', s: 1, r: [3, 9], b: [10, 40], T: [2, 5], u: 'L per minute' },
    { txt: 'A phone’s battery is at {b}% when a movie starts. The charge drops at a constant rate, and after {T} hours it is at {v}%.', X: 't', Y: 'B', xw: 'the time in hours', yw: 'the battery charge in percent', tu: 'hours', s: -1, r: [10, 20], b: [80, 100], T: [2, 3], u: '% per hour', pct: true },
    { txt: 'Maya has {$b} in her account and saves the same amount every week. After {T} weeks she has {$v}.', X: 'w', Y: 'S', xw: 'the number of weeks', yw: 'the amount saved in dollars', tu: 'weeks', s: 1, r: [5, 25], b: [20, 100], T: [2, 5], u: 'dollars per week', step: 5 }];
  function fillC(txt, o) { return txt.replace(/\{\$(\w+)\}/g, function (m0, k) { return dollars(o[k]); }).replace(/\{(\w+)\}%/g, function (m0, k) { return t(o[k] + '\\%'); }).replace(/\{(\w+)\}/g, function (m0, k) { return t(F(o[k])); }); }
  function l4q3(r) { // added (Mastery): assignment Q15 — a 30 cm candle is 24 cm after 2 h → h = −3t + 30
    var c = r.pick(L4CTX), st = c.step || 1;
    var s = until(function () { var rt = st * r.int(Math.ceil(c.r[0] / st), Math.floor(c.r[1] / st)), b = r.int(c.b[0], c.b[1]); if (c.step) b = 10 * Math.round(b / 10); return { rt: rt, b: b, T: r.int(c.T[0], c.T[1]) }; },
      function (s) { var v = s.b + c.s * s.rt * s.T; return v > 0 && v !== s.b && s.rt !== s.b && (!c.pct || v >= 10); });
    var m = c.s * s.rt, b = s.b, T0 = s.T, v = b + m * T0, X = c.X, Y = c.Y, Tg = L(m, b);
    var Wl = W(Tg, [{ is: L(m, v), code: 'u7x-ctx-b-point', hint: t(F(v)) + ' is the value after ' + t(T0) + ' ' + c.tu + '. The starting value ' + t('b') + ' is the value when ' + t(X + '=0') + ': ' + t(F(b)) + '.' },
      { is: L(m * T0, b), code: 'u7x-rate-change', hint: 'The total change is ' + t(F(m * T0)) + ' — divide it by the time, ' + t(T0) + ', to get the change per unit of time.' },
      { is: L(-m, b), code: 'u7x-rate-sign', hint: 'Check the sign of the rate: the quantity goes ' + (m < 0 ? '<b>down</b>, so the slope is negative' : '<b>up</b>, so the slope is positive') + '.' },
      { is: L(b, m), code: 'u7x-ctx-swap', hint: 'The rate multiplies ' + t(X) + ' and the starting value is the constant: ' + t(Y + '=m' + X + '+b') + '.' }]);
    var base = LP(fillC(c.txt, { b: b, T: T0, v: v }) + ' Let ' + t(X) + ' be ' + c.xw + ' and ' + t(Y) + ' ' + c.yw + '. Write an equation in the form ' + t(Y + '=m' + X + '+b') + '.', Tg,
      { form: 'slope-intercept', vars: [X, Y], wrong: Wl, placeholder: 'e.g. ' + Y + ' = 2' + X + ' + 5', noOnlyB: true },
      'Starting value (when ' + t(X + '=0') + '): ' + t('b=' + b) + '.<br>Rate: ' + t('m=\\frac{\\text{change}}{\\text{time}}=\\frac{' + F(v) + '-' + F(b) + '}{' + T0 + '-0}=\\frac{' + F(v - b) + '}{' + T0 + '}=' + m) + ' ' + c.u + '.<br>' + t(SI(m, b, [X, Y])) + '.<br><b>Check:</b> ' + t(X + '=' + T0) + ' gives ' + t(m + '(' + T0 + ')+' + b + '=' + F(v)) + ' ✓',
      ['The starting value is the value at ' + t(X + '=0') + ': that is ' + t('b') + '.', 'The slope is the change per unit of time: (change in ' + t(Y) + ') ÷ (change in ' + t(X) + '). Is it going up or down?'], 'context equation ' + Y);
    return base;
  }
  HW.defineExit({ lesson: 'u7l4', calc: false, outcome: 'RF7',
    blurb: 'Writing y = mx + b from a graph, from a table, and from a starting value and a later reading.',
    questions: [Q(1, 'RF7', 'PRG', l4q1), Q(2, 'RF7', 'PRG', l4q2), Q(3, 'RF7', 'MAS', l4q3)] });

  /* =====================================================================================================
   * Lesson 5 — Writing the equation of a line given the slope and a point (substitute and solve for b) (RF7)
   * ===================================================================================================== */
  function l5q1(r) { // Ryan: slope −3 through (2, 5) → y = −3x + 11 · slope 4 through (−1, 3) → y = 4x + 7
    var s = until(function () { return { m: r.pick(nzs(-5, 5)), x: r.pick(nzs(-4, 4)), b: r.pick(nzs(-12, 12)) }; }, function (s) { var y = s.m * s.x + s.b; return Math.abs(y) <= 15 && y !== s.b && Math.abs(s.m) > 1 - (s.x > 0 ? 0 : 1) && y !== 0 && y - s.m * s.x !== s.x - s.m * y; });
    var m = s.m, x1 = s.x, b = s.b, y1 = m * x1 + b, mx = m * x1, T = L(m, b);
    var Wl = W(T, [{ is: L(m, y1), code: 'u7x-b-point', hint: t(ptT(x1, y1)) + ' is not the ' + t('y') + '-intercept, because ' + t('x\\ne 0') + '. Substitute the point and solve: ' + t(y1 + '=' + m + '(' + x1 + ')+b') + '.' },
      { is: L(m, y1 + mx), code: 'u7x-b-solve', hint: t(y1 + '=' + pT(mx) + '+b') + '. ' + (mx < 0 ? 'Add ' + t(-mx) : 'Subtract ' + t(mx)) + ' on both sides: ' + t('b=' + y1 + '-' + pT(mx) + '=' + b) + '.' },
      { is: L(m, x1 - m * y1), code: 'u7x-sub-swap', hint: 'The first number in the point is ' + t('x') + ': substitute ' + t('x=' + x1) + ' and ' + t('y=' + y1) + ', so ' + t(y1 + '=' + m + '(' + x1 + ')+b') + '.' }]);
    return LP('Determine the equation of the line with slope ' + t(m) + ' that passes through ' + t(ptT(x1, y1)) + '. Write it in the form ' + t('y=mx+b') + '.', T, { form: 'slope-intercept', wrong: Wl, bad: [String(b)] },
      'Substitute ' + t('m=' + m) + ', ' + t('x=' + x1) + ' and ' + t('y=' + y1) + ' into ' + t('y=mx+b') + ':<br>' + t(y1 + '=' + m + '(' + x1 + ')+b') + '<br>' + t(y1 + '=' + mx + '+b') + '<br>' + t('b=' + y1 + '-' + pT(mx) + '=' + b) + '<br>So ' + t(SI(m, b)) + '.<br><b>Check:</b> ' + t(m + '(' + x1 + ')' + (b < 0 ? '' : '+') + b + '=' + y1) + ' ✓',
      ['Put the slope and the point into ' + t('y=mx+b') + ': the first number of the point is ' + t('x') + ', the second is ' + t('y') + '.', 'Solve for ' + t('b') + ', then write the whole equation.'], 'line from slope and point');
  }
  function l5q2(r) { // Ryan: slope −2 through (−3, 4) → b = −2 · slope 3 through (−2, −1) → b = 5
    var s = until(function () { return { m: r.pick([-4, -3, -2, 2, 3, 4, -1]), x: r.pick([-1, -2, -3, -4, -2, -3]), b: r.pick(nzs(-9, 9)) }; }, function (s) { var y = s.m * s.x + s.b; return Math.abs(y) <= 12 && y !== s.b && y !== 0; });
    var m = s.m, x1 = s.x, b = s.b, y1 = m * x1 + b, mx = m * x1;
    var dl = [[y1 + mx, 'u7x-tv-sign', 'Check the product: ' + t(m + '(' + x1 + ')=' + mx) + (m < 0 ? ' (a negative times a negative is positive)' : '') + '. Then ' + t(y1 + '=' + pT(mx) + '+b') + '.'],
      [y1, 'u7x-b-point', t(ptT(x1, y1)) + ' is not on the ' + t('y') + '-axis. Substitute it: ' + t(y1 + '=' + m + '(' + x1 + ')+b') + '.'],
      [x1 - m * y1, 'u7x-sub-swap', 'The first number is ' + t('x') + '. Substitute ' + t('x=' + x1) + ' and ' + t('y=' + y1) + '.'],
      [mx - y1, 'u7x-b-solve', 'From ' + t(y1 + '=' + pT(mx) + '+b') + ', ' + (mx < 0 ? 'add ' + t(-mx) : 'subtract ' + t(mx)) + ' on both sides: ' + t('b=' + y1 + '-' + pT(mx)) + '.']];
    return numPart('A line has slope ' + t(m) + ' and passes through ' + t(ptT(x1, y1)) + '. Written as ' + t('y=' + term(m, 'x', true) + '+b') + ', what is ' + t('b') + '?', b, dl,
      t(y1 + '=' + m + '(' + x1 + ')+b\\ \\rightarrow\\ ' + y1 + '=' + mx + '+b\\ \\rightarrow\\ b=' + b) + ', so ' + t(SI(m, b)) + '.',
      ['Substitute ' + t('x=' + x1) + ' and ' + t('y=' + y1) + ' (in brackets) into ' + t('y=' + term(m, 'x', true) + '+b') + '.', 'Multiply carefully with the signs, then get ' + t('b') + ' by itself.'], 'b from slope and point', { before: t('b='), ansPre: 'b=' });
  }
  function l5q3(r) { // added (Mastery): assignment Q4 — slope 1/2 through (6, 7) → y = 1/2x + 4 · slope −3/4 through (8, 1) → y = −3/4x + 7
    var s = until(function () { return { q: r.pick([2, 3, 4]), p: r.pick([1, 2, 3]), sg: r.pick([1, -1]), j: r.pick([-2, -1, 1, 2, 2, 3]), b: r.pick(nzs(-8, 9)) }; }, function (s) { var x = s.q * s.j, y = s.sg * s.p * s.j + s.b; return gcd(s.p, s.q) === 1 && s.p !== s.q && Math.abs(x) <= 9 && Math.abs(y) <= 12 && y !== s.b; });
    var m = fr(s.sg * s.p, s.q), x1 = s.q * s.j, b = s.b, mx = s.sg * s.p * s.j, y1 = mx + b, T = L(m, b);
    var Wl = W(T, [{ is: L(m, y1), code: 'u7x-b-point', hint: t(ptT(x1, y1)) + ' is not on the ' + t('y') + '-axis. Substitute it and solve for ' + t('b') + '.' },
      { is: L(m, y1 + mx), code: 'u7x-b-solve', hint: t(y1 + '=' + pT(mx) + '+b') + ': ' + (mx < 0 ? 'add ' + t(-mx) : 'subtract ' + t(mx)) + ' on both sides.' },
      { is: L(m, fr(x1 * s.q - s.sg * s.p * y1, s.q)), code: 'u7x-sub-swap', hint: 'Substitute ' + t('x=' + x1) + ' and ' + t('y=' + y1) + ' — the first number of the point is ' + t('x') + '.' }]);
    return LP('Determine the equation of the line with slope ' + t(nT(m)) + ' that passes through ' + t(ptT(x1, y1)) + '. Write it in the form ' + t('y=mx+b') + '.', T, { form: 'slope-intercept', wrong: Wl, bad: [String(b)] },
      'Substitute into ' + t('y=mx+b') + ':<br>' + t(y1 + '=' + nT(m) + '(' + x1 + ')+b') + '<br>' + t(nT(m) + '(' + x1 + ')=\\frac{' + s.sg * s.p + '\\times ' + pT(x1) + '}{' + s.q + '}=' + mx) + ', so ' + t(y1 + '=' + mx + '+b') + '<br>' + t('b=' + y1 + '-' + pT(mx) + '=' + b) + '<br>So ' + t(SI(m, b)) + '.',
      ['Substitute the slope and the point into ' + t('y=mx+b') + '.', 'Multiply the fraction by ' + t('x') + ' first: ' + t(x1) + ' divided by ' + t(s.q) + ' is a whole number.'], 'line from fraction slope and point');
  }
  HW.defineExit({ lesson: 'u7l5', calc: false, outcome: 'RF7',
    blurb: 'Substitute and solve: the equation from a slope and a point, the value of b, and a fractional slope through a point.',
    questions: [Q(1, 'RF7', 'PRG', l5q1), Q(2, 'RF7', 'PRG', l5q2), Q(3, 'RF7', 'MAS', l5q3)] });

  /* =====================================================================================================
   * Lesson 6 — Writing the equation of a line given two points (RF3, RF7)
   * ===================================================================================================== */
  function l6q1(r) { // Ryan: (−2, 7), (2, −1) → −2 · (−3, −4), (1, 8) → 3
    var s = until(function () { return { m: r.pick(nzs(-4, 4)), x1: r.int(-4, -1), run: r.int(2, 5), y1: r.pick(nzs(-8, 8)) }; }, function (s) { var y2 = s.y1 + s.m * s.run, x2 = s.x1 + s.run; return Math.abs(y2) <= 10 && x2 !== 0 && y2 !== 0 && (s.y1 < 0 || y2 < 0 || s.x1 < 0); });
    var m = s.m, x1 = s.x1, y1 = s.y1, x2 = x1 + s.run, y2 = y1 + m * s.run, rise = y2 - y1, run = x2 - x1;
    var neg = [];
    if (x1 < 0) neg.push([fr(rise, x2 + x1), 'u7x-sl-negsub', 'Check the run: ' + t(x2 + '-' + pT(x1) + '=' + run) + ' (subtracting a negative adds).']);
    if (y1 < 0) neg.push([fr(y2 + y1, run), 'u7x-sl-negsub', 'Check the rise: ' + t(y2 + '-' + pT(y1) + '=' + rise) + ' (subtracting a negative adds).']);
    if (x1 < 0 && y1 < 0) neg.push([fr(y2 + y1, x2 + x1), 'u7x-sl-negsub', 'Subtracting a negative adds: rise ' + t('=' + rise) + ', run ' + t('=' + run) + '.']);
    return slopePart('A line passes through ' + t(ptT(x1, y1)) + ' and ' + t(ptT(x2, y2)) + '. What is its slope ' + t('m') + '?', m, neg.filter(function (d) { return isFinite(fv(d[0])) && fr(d[0])[1] !== 0; }),
      t('m=\\frac{y_2-y_1}{x_2-x_1}=\\frac{' + y2 + '-' + pT(y1) + '}{' + x2 + '-' + pT(x1) + '}=\\frac{' + rise + '}{' + run + '}=' + m) + '.',
      ['Use ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + ': subtract in the same order on the top and the bottom.', 'Subtracting a negative number is the same as adding.'], 'slope from two points');
  }
  function l6q2(r) { // Ryan: (2, 1), (4, 7) → y = 3x − 5 · (1, −2), (3, 6) → y = 4x − 6
    var s = until(function () { return { m: r.pick([-4, -3, -2, 2, 3, 4, 2, 3]), x1: r.int(1, 3), run: r.int(1, 3), b: r.pick(nzs(-8, 8)) }; }, function (s) { var y1 = s.m * s.x1 + s.b, y2 = y1 + s.m * s.run; return Math.abs(y1) <= 12 && Math.abs(y2) <= 14 && y1 !== s.b && y1 !== 0; });
    var m = s.m, x1 = s.x1, x2 = x1 + s.run, b = s.b, y1 = m * x1 + b, y2 = m * x2 + b, T = L(m, b), mx = m * x1;
    var Wl = W(T, [{ is: L(-m, y1 + m * x1), code: 'u7x-sl-order', hint: 'Keep one order: ' + t('m=\\frac{' + y2 + '-' + pT(y1) + '}{' + x2 + '-' + x1 + '}=\\frac{' + (y2 - y1) + '}{' + (x2 - x1) + '}=' + m) + '.' },
      { is: L(m, y1), code: 'u7x-b-point', hint: t(ptT(x1, y1)) + ' is not on the ' + t('y') + '-axis. Substitute it and solve: ' + t(y1 + '=' + m + '(' + x1 + ')+b') + '.' },
      { is: L(m, y1 + mx), code: 'u7x-b-solve', hint: 'From ' + t(y1 + '=' + mx + '+b') + ', ' + (mx < 0 ? 'add ' + t(-mx) : 'subtract ' + t(mx)) + ' on both sides: ' + t('b=' + b) + '.' }]);
    return LP('Determine the equation of the line through ' + t(ptT(x1, y1)) + ' and ' + t(ptT(x2, y2)) + '. Write it in the form ' + t('y=mx+b') + '.', T, { form: 'slope-intercept', wrong: Wl, bad: [String(b)] },
      t('m=\\frac{' + y2 + '-' + pT(y1) + '}{' + x2 + '-' + x1 + '}=\\frac{' + (y2 - y1) + '}{' + (x2 - x1) + '}=' + m) + '.<br>Substitute ' + t(ptT(x1, y1)) + ': ' + t(y1 + '=' + m + '(' + x1 + ')+b\\ \\rightarrow\\ ' + y1 + '=' + mx + '+b\\ \\rightarrow\\ b=' + b) + '.<br>' + t(SI(m, b)) + '. <b>Check:</b> ' + t(m + '(' + x2 + ')' + (b < 0 ? '' : '+') + b + '=' + y2) + ' ✓',
      ['First the slope: ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + '.', 'Then substitute either point into ' + t('y=mx+b') + ' and solve for ' + t('b') + '.'], 'line through two points');
  }
  function l6q3(r) { // added (Mastery): assignment Q4 — (−6, 1), (2, 5) → y = 1/2x + 4 · (−4, 5), (2, 2) → y = −1/2x + 3
    var s = until(function () { return { q: r.pick([2, 3, 4, 2, 3]), p: r.pick([1, 2, 3]), sg: r.pick([1, -1]), j1: r.pick([-2, -1]), j2: r.pick([1, 2]), b: r.pick(nzs(-6, 6)) }; }, function (s) {
      var y1 = s.sg * s.p * s.j1 + s.b, y2 = s.sg * s.p * s.j2 + s.b; return gcd(s.p, s.q) === 1 && s.p !== s.q && Math.abs(s.q * s.j1) <= 8 && Math.abs(s.q * s.j2) <= 8 && Math.abs(y1) <= 12 && Math.abs(y2) <= 12 && y1 !== s.b && y2 !== s.b; });
    var m = fr(s.sg * s.p, s.q), b = s.b, x1 = s.q * s.j1, x2 = s.q * s.j2, y1 = s.sg * s.p * s.j1 + b, y2 = s.sg * s.p * s.j2 + b, T = L(m, b), mx = s.sg * s.p * s.j2;
    var Wl = W(T, [{ is: L(m, y2), code: 'u7x-b-point', hint: 'Neither point is on the ' + t('y') + '-axis. Substitute one of them and solve for ' + t('b') + '.' },
      { is: L(m, y1), code: 'u7x-b-point', hint: 'Neither point is on the ' + t('y') + '-axis. Substitute one of them and solve for ' + t('b') + '.' },
      { is: L(m, y2 + mx), code: 'u7x-b-solve', hint: 'From ' + t(y2 + '=' + pT(mx) + '+b') + ', ' + (mx < 0 ? 'add ' + t(-mx) : 'subtract ' + t(mx)) + ' on both sides.' }]);
    return LP('Determine the equation of the line through ' + t(ptT(x1, y1)) + ' and ' + t(ptT(x2, y2)) + '. Write it in the form ' + t('y=mx+b') + ', keeping the slope as an exact fraction.', T, { form: 'slope-intercept', wrong: Wl, bad: [String(b)] },
      t('m=\\frac{' + y2 + '-' + pT(y1) + '}{' + x2 + '-' + pT(x1) + '}=\\frac{' + (y2 - y1) + '}{' + (x2 - x1) + '}=' + nT(m)) + '.<br>Substitute ' + t(ptT(x2, y2)) + ': ' + t(y2 + '=' + nT(m) + '(' + x2 + ')+b\\ \\rightarrow\\ ' + y2 + '=' + mx + '+b\\ \\rightarrow\\ b=' + b) + '.<br>' + t(SI(m, b)) + '. <b>Check</b> with ' + t(ptT(x1, y1)) + ': ' + t(nT(m) + '(' + x1 + ')' + (b < 0 ? '' : '+') + b + '=' + y1) + ' ✓',
      ['Slope first (subtracting a negative adds), then reduce the fraction.', 'Substitute the point with the positive ' + t('x') + ' into ' + t('y=mx+b') + ' — the fraction times ' + t('x') + ' is a whole number.'], 'line through two points, fraction slope');
  }
  HW.defineExit({ lesson: 'u7l6', calc: false, outcome: 'RF7',
    blurb: 'Two points: the slope, the equation through two points, and two points with negatives and a fractional slope.',
    questions: [Q(1, 'RF3', 'BEG', l6q1), Q(2, 'RF7', 'PRG', l6q2), Q(3, 'RF7', 'MAS', l6q3)] });

  /* =====================================================================================================
   * Lesson 7 — The general form of a linear equation (RF5, RF6)
   * ===================================================================================================== */
  function l7q1(r) { // Ryan: y = −2/3x + 4 → 2x + 3y − 12 = 0 · y = −3/4x + 2 → 3x + 4y − 8 = 0
    var s = until(function () { return { q: r.pick([2, 3, 4, 5, 3, 4]), p: r.pick([1, 2, 3, 4]), sg: r.pick([-1, -1, -1, 1]), c: r.pick(nzs(-6, 6)) }; }, function (s) { return gcd(s.p, s.q) === 1 && s.p !== s.q; });
    var p = s.p, q = s.q, sg = s.sg, c = s.c, m = fr(sg * p, q), T = L(m, c), eq = SI(m, c);
    var G = { A: -sg * p, B: q, C: -q * c }; if (G.A < 0) { G.A = -G.A; G.B = -G.B; G.C = -G.C; }
    var Wl = W(T, [{ is: { A: G.A, B: G.B, C: G.C / q }, code: 'u7x-gf-nomult', hint: 'Multiply <b>every</b> term by ' + t(q) + ' — the constant ' + t(c) + ' becomes ' + t(q * c) + '.' },
      { is: { A: G.A, B: G.B, C: -G.C }, code: 'u7x-gf-csign', hint: 'Check the sign of the constant: start from ' + t(q + 'y=' + lin([[sg * p, 'x'], [q * c, '']])) + ' and remember that only the terms that move across the equals sign change sign.' }]);
    return LP('Write ' + t(eq) + ' in general form, ' + t('Ax+By+C=0') + ' (' + t('A') + ', ' + t('B') + ', ' + t('C') + ' integers, ' + t('A') + ' positive).', T, { form: 'general', wrong: Wl, bad: [lin([[-G.A, 'x'], [-G.B, 'y'], [-G.C, '']]) + '=0', q + 'y=' + lin([[sg * p, 'x'], [q * c, '']])], noOnlyB: true },
      'Multiply every term by ' + t(q) + ' to clear the fraction: ' + t(q + 'y=' + lin([[sg * p, 'x'], [q * c, '']])) + '.<br>Move every term to the left (each term that moves changes sign), keeping the ' + t('x') + '-term positive: ' + t(GEN(T)) + '.',
      ['Clear the fraction first: multiply <b>every</b> term (including the constant) by ' + t(q) + '.', 'Then move all the terms to one side so the other side is ' + t('0') + ', with ' + t('A') + ' positive.'], 'general form of ' + eq);
  }
  function l7q2(r) { // Ryan: 5x − 2y − 6 = 0 → y = 5/2x − 3 · 3x − 4y − 8 = 0 → y = 3/4x − 2
    var s = until(function () { return { A: r.int(1, 7), Bq: r.pick([2, 3, 4, 5]), ys: r.pick([-1, -1, -1, 1]), b0: r.pick(nzs(-5, 5)) }; }, function (s) { return gcd(s.A, s.Bq) === 1 && s.A % s.Bq !== 0 && s.A !== 1; });
    var A = s.A, By = s.ys * s.Bq, b0 = s.b0, C = -By * b0, eq = lin([[A, 'x'], [By, 'y'], [C, '']]) + '=0', m = fr(-A, By), T = L(m, b0);
    var Wl = W(T, [{ is: L(fNeg(m), -b0), code: 'u7x-re-negdiv', hint: 'Divide every term by ' + t(By) + ', ' + (By < 0 ? 'including its negative sign' : 'with its sign') + ': ' + t(term(-A, 'x', true) + '\\div ' + pT(By) + '=' + term(m, 'x', true)) + '.' }]);
    return LP('Convert ' + t(eq) + ' to slope–intercept form, ' + t('y=mx+b') + '.', T, { form: 'slope-intercept', wrong: Wl, bad: [lin([[By, 'y']]) + '=' + lin([[-A, 'x'], [-C, '']])], noOnlyB: true },
      'Keep the ' + t('y') + '-term on the left and move the other terms across (they change sign): ' + t(term(By, 'y', true) + '=' + lin([[-A, 'x'], [-C, '']])) + '.<br>Divide every term by ' + t(By) + ': ' + t(SI(m, b0)) + '.',
      ['Move the ' + t('x') + '-term and the constant to the right side first.', 'Then divide <b>every</b> term by the coefficient of ' + t('y') + ', ' + t(By) + ' (with its sign).'], 'slope-intercept form of ' + eq);
  }
  function l7q3(r) { // Ryan: x-intercept of 2x − 3y − 12 = 0 → 6 · 3x − 5y − 15 = 0 → 5
    var s = until(function () { return { A: r.int(2, 5), x0: r.pick(nzs(-6, 6)), B: r.pick([-5, -4, -3, -2, 2, 3, -3, -2]) }; }, function (s) { var C = -s.A * s.x0; return C % s.B === 0 && Math.abs(s.x0) !== s.A && Math.abs(C / s.B) !== Math.abs(s.x0) && gcd(gcd(s.A, s.B), C) === 1; });
    var A = s.A, Bc = s.B, x0 = s.x0, C = -A * x0, y0 = -C / Bc, eq = lin([[A, 'x'], [Bc, 'y'], [C, '']]) + '=0';
    var dl = [[y0, 'u7x-icpt-swap', 'That is the ' + t('y') + '-intercept (from ' + t('x=0') + '). For the ' + t('x') + '-intercept set ' + t('y=0') + '.'],
      [-x0, 'u7x-icpt-sign', t(term(A, 'x', true) + (C < 0 ? '' : '+') + C + '=0\\ \\rightarrow\\ ' + A + 'x=' + (-C)) + ': moving ' + t(pT(C)) + ' across changes its sign.'],
      [C, 'u7x-icpt-const', 'Set ' + t('y=0') + ' and solve: ' + t(A + 'x=' + (-C)) + ' — you still need to divide by ' + t(A) + '.'], [-C, 'u7x-icpt-const', t(A + 'x=' + (-C)) + ': divide by ' + t(A) + ' to finish.']];
    return icptPart('What is the ' + t('x') + '-intercept of ' + t(eq) + '? (Type the ' + t('x') + '-value.)', x0, 'x', dl,
      'On the ' + t('x') + '-axis, ' + t('y=0') + ': ' + t(A + 'x+' + pT(Bc) + '(0)' + (C < 0 ? '' : '+') + C + '=0\\ \\rightarrow\\ ' + A + 'x=' + (-C) + '\\ \\rightarrow\\ x=' + x0) + '. The ' + t('x') + '-intercept is ' + t(ptT(x0, 0)) + '.',
      ['The ' + t('x') + '-intercept is on the ' + t('x') + '-axis, where ' + t('y=0') + '.', 'Replace ' + t('y') + ' with ' + t('0') + ' and solve for ' + t('x') + '.'], 'x-intercept of ' + eq);
  }
  function l7q4(r) { // added (Mastery): assignment Q15 — kx + 4y − 16 = 0 through (4, 0) → k = 4 · EP 7 Q11 — 3x − 4y + C = 0 through (2, −1)
    var kind = r.pick(['A', 'A', 'C']);
    if (kind === 'A') {
      var s = until(function () { return { k: r.int(1, 6), x0: r.pick(nzs(-6, 6)), B: r.pick([-5, -4, -3, -2, 2, 3, 4, 5]) }; }, function (s) { return Math.abs(s.x0) !== s.k && s.k * Math.abs(s.x0) <= 30 && gcd(s.k, s.B) === 1; });
      var k = s.k, x0 = s.x0, Bc = s.B, C = -k * x0, eq = 'kx' + term(Bc, 'y', false) + (C < 0 ? '' : '+') + C + '=0';
      var dl = [[-k, 'u7x-k-sign', 'Check the signs: ' + t('k(' + x0 + ')' + (C < 0 ? '' : '+') + C + '=0\\ \\rightarrow\\ ' + x0 + 'k=' + (-C)) + '.'],
        [x0 / C, 'u7x-k-recip', 'Divide the other way: ' + t('k=\\frac{' + (-C) + '}{' + x0 + '}') + '.'], [-x0 / C, 'u7x-k-recip', 'Divide the other way: ' + t('k=\\frac{' + (-C) + '}{' + x0 + '}') + '.'],
        [-C, 'u7x-k-nodiv', t(x0 + 'k=' + (-C)) + ' — divide both sides by ' + t(x0) + '.']];
      return numPart('The line ' + t(eq) + ' has an ' + t('x') + '-intercept of ' + t(x0) + ' (it passes through ' + t(ptT(x0, 0)) + '). Determine the value of ' + t('k') + '.', k, dl,
        'The point ' + t(ptT(x0, 0)) + ' is on the line, so substitute ' + t('x=' + x0) + ' and ' + t('y=0') + ':<br>' + t('k(' + x0 + ')' + (Bc < 0 ? '-' : '+') + Math.abs(Bc) + '(0)' + (C < 0 ? '' : '+') + C + '=0') + '<br>' + t(x0 + 'k=' + (-C)) + '<br>' + t('k=' + k) + '. The line is ' + t(lin([[k, 'x'], [Bc, 'y'], [C, '']]) + '=0') + '.',
        ['An ' + t('x') + '-intercept of ' + t(x0) + ' means the point ' + t(ptT(x0, 0)) + ' is on the line.', 'Substitute ' + t('x=' + x0) + ' and ' + t('y=0') + ', then solve for ' + t('k') + '.'], 'missing A from an x-intercept', { before: t('k='), ansPre: 'k=' });
    }
    var s2 = until(function () { return { A: r.int(1, 5), B: r.pick([-5, -4, -3, -2, 2, 3, 4, 5]), P: [r.pick(nzs(-4, 4)), r.pick(nzs(-4, 4))] }; }, function (s) { var k = -(s.A * s.P[0] + s.B * s.P[1]); return k !== 0 && gcd(s.A, s.B) === 1 && Math.abs(s.P[0]) !== Math.abs(s.P[1]) && -(s.A * s.P[1] + s.B * s.P[0]) !== k && Math.abs(k) <= 30; });
    var A2 = s2.A, B2 = s2.B, P = s2.P, kk = -(A2 * P[0] + B2 * P[1]), eq2 = lin([[A2, 'x'], [B2, 'y']]) + '+k=0', sum = A2 * P[0] + B2 * P[1];
    var dl2 = [[-kk, 'u7x-k-sign', t(sum + '+k=0') + ', so ' + t('k=' + (-sum)) + ': moving ' + t(pT(sum)) + ' across changes its sign.'],
      [-(A2 * P[1] + B2 * P[0]), 'u7x-k-swap', 'Substitute ' + t('x=' + P[0]) + ' (the first number) and ' + t('y=' + P[1]) + '.']];
    return numPart('The line ' + t(eq2) + ' passes through the point ' + t(ptT(P[0], P[1])) + '. Determine the value of ' + t('k') + '.', kk, dl2,
      'Substitute ' + t('x=' + P[0]) + ' and ' + t('y=' + P[1]) + ':<br>' + t(A2 + '(' + P[0] + ')+' + pT(B2) + '(' + P[1] + ')+k=0') + '<br>' + t((A2 * P[0]) + (B2 * P[1] < 0 ? '' : '+') + (B2 * P[1]) + '+k=0\\ \\rightarrow\\ ' + sum + '+k=0') + '<br>' + t('k=' + kk) + '. The line is ' + t(lin([[A2, 'x'], [B2, 'y'], [kk, '']]) + '=0') + '.',
      ['A point on the line makes the equation true: substitute its coordinates.', 'Then solve for ' + t('k') + '.'], 'missing C from a point', { before: t('k='), ansPre: 'k=' });
  }
  HW.defineExit({ lesson: 'u7l7', calc: false, outcome: 'RF6',
    blurb: 'General form: from y = mx + b to Ax + By + C = 0 and back, an x-intercept, and a missing coefficient.',
    questions: [Q(1, 'RF6', 'PRG', l7q1), Q(2, 'RF6', 'PRG', l7q2), Q(3, 'RF5', 'PRG', l7q3), Q(4, 'RF6', 'MAS', l7q4)] });

  /* =====================================================================================================
   * Lesson 8 — Graphing horizontal lines, vertical lines, and any form (RF6)
   * ===================================================================================================== */
  function l8q1(r) { // Ryan: horizontal y = −2 · vertical x = 3
    var vert = r.chance(0.5), k = r.pick(nzs(-5, 5)), T = vert ? { x: k } : { y: k };
    var Wl = [{ is: vert ? { y: k } : { x: k }, code: 'line-vh', hint: vert ? t('y=' + k) + ' is a horizontal line. This line is vertical: every point has ' + t('x=' + k) + '.' : t('x=' + k) + ' is a vertical line. This line is horizontal: every point has ' + t('y=' + k) + '.' },
      { is: vert ? 'x=' + k + 'y' : 'y=' + k + 'x', code: 'u7x-hv-term', hint: vert ? 'A vertical line has no ' + t('y') + '-term: every point has ' + t('x=' + k) + '.' : 'A horizontal line has slope ' + t('0') + ', so there is no ' + t('x') + '-term. Every point has ' + t('y=' + k) + '.' }];
    var P1 = vert ? [k, -3] : [-3, k], P2 = vert ? [k, 2] : [4, k];
    var p = LP('Write the equation of this line.' + figBox(lineFig([vert ? { x: k } : { m: 0, b: k }], { x: [-6, 6], y: [-6, 6], aria: (vert ? 'a vertical' : 'a horizontal') + ' line' })), T, { wrong: Wl, bad: [vert ? 'x=' + (-k) : 'y=' + (-k)], noOnlyB: true },
      'Every point on the line has ' + t((vert ? 'x' : 'y') + '\\text{-coordinate } ' + k) + ' (for example ' + t(ptT(P1[0], P1[1])) + ' and ' + t(ptT(P2[0], P2[1])) + '), so it is the ' + (vert ? 'vertical line ' + t('x=' + k) + ' (slope undefined)' : 'horizontal line ' + t('y=' + k) + ' (slope ' + t('0') + ')') + '.',
      ['Read two points on the line. Which coordinate stays the same?', 'A horizontal line is ' + t('y=k') + '; a vertical line is ' + t('x=k') + '.'], (vert ? 'vertical' : 'horizontal') + ' line from a graph');
    return p;
  }
  function l8q2(r) { // Ryan: which graph shows x = 4 (x = 4, y = 4, x = −4) · y = −3 (y = 3, x = −3, y = −3)
    var vert = r.chance(0.5), k = r.pick(nzs(-4, 4).filter(function (v) { return Math.abs(v) > 1; })), eq = (vert ? 'x=' : 'y=') + k;
    var G = { ok: vert ? { x: k } : { m: 0, b: k }, side: vert ? { x: -k } : { m: 0, b: -k }, turn: vert ? { m: 0, b: k } : { x: k }, both: vert ? { m: 0, b: -k } : { x: -k } };
    var whys = { side: 'This line is on the wrong side: ' + (vert ? t('x=' + k) + ' is ' + (k > 0 ? 'right' : 'left') + ' of the ' + t('y') + '-axis' : t('y=' + k) + ' is ' + (k > 0 ? 'above' : 'below') + ' the ' + t('x') + '-axis') + '.',
      turn: vert ? 'This is the horizontal line ' + t('y=' + k) + '. ' + t('x=' + k) + ' holds ' + t('x') + ' fixed, so it is a <b>vertical</b> line.' : 'This is the vertical line ' + t('x=' + k) + '. ' + t('y=' + k) + ' holds ' + t('y') + ' fixed, so it is a <b>horizontal</b> line.',
      both: 'This is ' + t(vert ? 'y=' + (-k) : 'x=' + (-k)) + ': wrong direction and wrong side.' };
    var opts = ['ok', 'side', 'turn', 'both'].map(function (key) { return { html: miniG(G[key], [], 'a ' + (G[key].x != null ? 'vertical' : 'horizontal') + ' line'), right: key === 'ok', why: whys[key], code: key }; });
    var p = mc(r, 'Which graph shows the line ' + t(eq) + '?', opts,
      t(eq) + ' holds ' + t(vert ? 'x' : 'y') + ' fixed at ' + t(k) + ', so it is the ' + (vert ? 'vertical line through ' + t(ptT(k, 0)) + ' (slope undefined)' : 'horizontal line through ' + t(ptT(0, k)) + ' (slope ' + t('0') + ')') + '.',
      [t('x=k') + ' is vertical (every point has the same ' + t('x') + '); ' + t('y=k') + ' is horizontal.', 'Check the side: positive values are right of / above the axes.'], 'which graph is ' + eq);
    p.input.columns = 2;
    return p;
  }
  function icptLine(r, maxC, ymax) {
    return until(function () { return { x0: r.pick(nzs(-5, 5)), y0: r.pick(nzs(-ymax, ymax)) }; }, function (s) {
      if (Math.abs(s.x0) === Math.abs(s.y0) || Math.abs(s.x0) === 1 && Math.abs(s.y0) === 1) return false;
      var g = gcd(gcd(s.y0, s.x0), s.x0 * s.y0); var A = s.y0 / g, Bc = s.x0 / g; return Math.abs(A) <= maxC && Math.abs(Bc) <= maxC;
    });
  }
  function genOf(x0, y0) { var A = y0, Bc = x0, C = -x0 * y0, g = gcd(gcd(A, Bc), C); A /= g; Bc /= g; C /= g; if (A < 0) { A = -A; Bc = -Bc; C = -C; } return { A: A, B: Bc, C: C }; }
  function l8q3(r) { // Ryan: 3x − y + 6 = 0 → (−2, 0), (0, 6) · 2x − y + 8 = 0 → (−4, 0), (0, 8)
    var s = icptLine(r, 4, 8), x0 = s.x0, y0 = s.y0, G = genOf(x0, y0), eq = Ln.tex(G, 'general');
    var pr = function (a, b) { return t(ptT(a[0], a[1])) + ' and ' + t(ptT(b[0], b[1])); };
    var opts = [{ html: pr([x0, 0], [0, y0]), right: true, code: 'ok' },
      { html: pr([-x0, 0], [0, -y0]), why: 'Check the signs as you move terms. ' + t('y=0') + ': ' + t(G.A + 'x' + (G.C < 0 ? '' : '+') + G.C + '=0\\Rightarrow x=' + x0) + '. ' + t('x=0') + ': ' + t(term(G.B, 'y', true) + (G.C < 0 ? '' : '+') + G.C + '=0\\Rightarrow y=' + y0) + '.', code: 'signs' },
      { html: pr([0, x0], [y0, 0]), why: 'The ' + t('x') + '-intercept sits on the ' + t('x') + '-axis, ' + t('(x,\\ 0)') + ', and the ' + t('y') + '-intercept on the ' + t('y') + '-axis, ' + t('(0,\\ y)') + ': ' + pr([x0, 0], [0, y0]) + '.', code: 'axes' },
      { html: pr([x0, 0], [0, -y0]), why: 'Check the ' + t('y') + '-intercept: ' + t(term(G.B, 'y', true) + (G.C < 0 ? '' : '+') + G.C + '=0\\Rightarrow ' + term(G.B, 'y', true) + '=' + (-G.C) + '\\Rightarrow y=' + y0) + '.', code: 'ysign' }];
    return mc(r, 'To graph ' + t(eq) + ' with the two-intercept method, which two points do you plot?', opts,
      'Set ' + t('y=0') + ': ' + t(G.A + 'x' + (G.C < 0 ? '' : '+') + G.C + '=0') + ', so ' + t('x=' + x0) + '. Set ' + t('x=0') + ': ' + t(term(G.B, 'y', true) + (G.C < 0 ? '' : '+') + G.C + '=0') + ', so ' + t('y=' + y0) + '. Plot ' + pr([x0, 0], [0, y0]) + ' and join them.',
      ['For the ' + t('x') + '-intercept set ' + t('y=0') + '; for the ' + t('y') + '-intercept set ' + t('x=0') + '.', 'Each intercept is a point on its own axis.'], 'two intercepts of ' + eq);
  }
  function l8q4(r) { // added (Mastery): assignment Q8, Q10 — graph a general-form line from its intercepts
    var s = icptLine(r, 6, 6), x0 = s.x0, y0 = s.y0, G = genOf(x0, y0), eq = Ln.tex(G, 'general'), key = lineV([x0, 0], [0, y0]);
    var Wl = [{ is: lineV([0, x0], [y0, 0]), code: 'u7x-gr-icpt-swap', hint: 'The intercepts are swapped: set ' + t('y=0') + ' to find where the line crosses the <b>' + t('x') + '</b>-axis, and ' + t('x=0') + ' for the ' + t('y') + '-axis.' },
      { is: lineV([-x0, 0], [0, y0]), code: 'u7x-gr-icpt-sign', hint: 'Check the sign of the ' + t('x') + '-intercept: set ' + t('y=0') + ' and solve ' + t(G.A + 'x' + (G.C < 0 ? '' : '+') + G.C + '=0') + ' carefully.' },
      { is: lineV([x0, 0], [0, -y0]), code: 'u7x-gr-icpt-sign', hint: 'Check the sign of the ' + t('y') + '-intercept: set ' + t('x=0') + ' and solve ' + t(term(G.B, 'y', true) + (G.C < 0 ? '' : '+') + G.C + '=0') + ' carefully.' }];
    if (Math.abs(G.A) !== Math.abs(G.B) && Math.abs(G.A) <= 6 && Math.abs(G.B) <= 6 && !(G.A === x0 && G.B === y0) && !(G.A === y0 && G.B === x0)) Wl.push({ is: lineV([G.A, 0], [0, G.B]), code: 'u7x-gr-coef', hint: 'The coefficients ' + t('A') + ' and ' + t('B') + ' are not the intercepts. Set ' + t('y=0') + ' and solve for ' + t('x') + ', then set ' + t('x=0') + ' and solve for ' + t('y') + '.' });
    return drawPart('Graph the line ' + t(eq) + '.', key, Wl, { m: -y0 / x0, b: y0 },
      'The equation is in general form, so use the two-intercept method.<br>' + t('y=0') + ': ' + t(G.A + 'x' + (G.C < 0 ? '' : '+') + G.C + '=0\\Rightarrow x=' + x0) + ', the point ' + t(ptT(x0, 0)) + '.<br>' + t('x=0') + ': ' + t(term(G.B, 'y', true) + (G.C < 0 ? '' : '+') + G.C + '=0\\Rightarrow y=' + y0) + ', the point ' + t(ptT(0, y0)) + '.<br>Plot both intercepts and join them with a line.',
      ['Find the intercepts: set ' + t('y=0') + ', then ' + t('x=0') + '.', 'Plot the two intercepts and join them with a line (arrows at both ends).'], 'graph ' + eq, [segOf(key)]);
  }
  HW.defineExit({ lesson: 'u7l8', calc: false, outcome: 'RF6',
    blurb: 'Horizontal and vertical lines from a graph and an equation, the two intercepts to plot, and graphing a general-form line.',
    questions: [Q(1, 'RF6', 'BEG', l8q1), Q(2, 'RF6', 'BEG', l8q2), Q(3, 'RF6', 'PRG', l8q3), Q(4, 'RF6', 'MAS', l8q4)] });

  /* =====================================================================================================
   * Lesson 9 — Slope in context: interpreting rates of change (RF3, RF4)
   * ===================================================================================================== */
  var L9G = [
    { txt: 'The graph shows the volume of water in a tank as it drains.', X: 't', Y: 'V', xT: 'Time, t (min)', yT: 'Volume, V (L)', s: -1, rs: [10, 15, 20, 25, 30, 40, 50], ts: [4, 5, 8, 10], u: 'L', per: 'minute', pers: 'minutes', unitY: 'litre',
      right: 'The tank drains at {r} L per minute.', sign: 'The tank fills at {r} L per minute.', flip: 'The tank drains at {r} minutes per litre.', icpt: 'The tank starts with {V0} L of water.' },
    { txt: 'The graph shows the fuel left in a generator as it runs.', X: 't', Y: 'F', xT: 'Time, t (h)', yT: 'Fuel, F (L)', s: -1, rs: [2, 3, 4, 5, 6], ts: [2, 3, 4, 5, 6], u: 'L', per: 'hour', pers: 'hours', unitY: 'litre',
      right: 'The generator uses {r} L of fuel per hour.', sign: 'The fuel increases by {r} L per hour.', flip: 'The generator uses {r} hours per litre.', icpt: 'The generator starts with {V0} L of fuel.' },
    { txt: 'The graph shows the height of a candle as it burns.', X: 't', Y: 'h', xT: 'Time, t (h)', yT: 'Height, h (cm)', s: -1, rs: [2, 3, 4], ts: [2, 3, 4, 5], u: 'cm', per: 'hour', pers: 'hours', unitY: 'centimetre',
      right: 'The candle burns down {r} cm per hour.', sign: 'The candle grows {r} cm taller per hour.', flip: 'The candle burns down {r} hours per centimetre.', icpt: 'The candle is {V0} cm tall when it is lit.' },
    { txt: 'The graph shows the depth of snow on the ground during a storm.', X: 't', Y: 'd', xT: 'Time, t (h)', yT: 'Depth, d (cm)', s: 1, rs: [2, 3, 4, 5], ts: [2, 3, 4], u: 'cm', per: 'hour', pers: 'hours', unitY: 'centimetre',
      right: 'The snow gets deeper by {r} cm per hour.', sign: 'The snow gets shallower by {r} cm per hour.', flip: 'The snow gets deeper by {r} hours per centimetre.', icpt: 'There were {V0} cm of snow when the storm began.' }];
  function l9q1(r) { // Ryan: tank (0, 600), (8, 400) → drains 25 L/min · generator (0, 90), (6, 60) → uses 5 L/h
    var c = r.pick(L9G), rt = r.pick(c.rs), t1 = r.pick(c.ts), n = r.pick([3, 4]), V0, top;
    if (c.s < 0) { V0 = rt * t1 * n; top = V0; } else { V0 = rt * t1 * r.pick([1, 2]); top = V0 + rt * t1 * n; }
    var V1 = V0 + c.s * rt * t1, xEnd = n * t1, Vend = V0 + c.s * rt * xEnd, yStep = rt * t1;
    var xr = [0, xEnd + t1 * 0.45], yr = [0, top + yStep * 0.8];
    var svg = HW.graph({ x: xr, y: yr, grid: t1, gridY: yStep, labels: t1, labelsY: yStep, labelsX: t1, firstQuadrant: true, unitX: 230 / (xr[1] - xr[0]), unitY: 170 / (yr[1] - yr[0]), xTitle: c.xT, yTitle: c.yT, xName: c.X, yName: c.Y,
      segs: [{ pts: [[0, V0], [xEnd, Vend]] }], points: [{ x: 0, y: V0 }, { x: t1, y: V1 }], max: 330, aria: 'a line graph of ' + c.yT + ' against ' + c.xT });
    var G = HW.graph.last, dy = c.s < 0 ? -9 : 15, ctxLab = function (x, y, s0) { return '<text x="' + (G.X(x) + 8).toFixed(1) + '" y="' + (G.Y(y) + dy).toFixed(1) + '" font-size="12.5" fill="' + INK + '" paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round">' + s0 + '</text>'; };
    svg = svg.replace(/<\/svg>$/, ctxLab(0, V0, '(0, ' + V0 + ')') + ctxLab(t1, V1, '(' + t1 + ', ' + V1 + ')') + '</svg>');
    var f = function (s0) { return s0.replace('{r}', t(F(rt))).replace('{V0}', t(F(V0))); };
    var m = c.s * rt;
    var opts = [{ html: f(c.right), right: true, code: 'ok' },
      { html: f(c.sign), why: 'The line ' + (c.s < 0 ? 'falls, so the slope is negative' : 'rises, so the slope is positive') + ': ' + t('\\frac{' + V1 + '-' + V0 + '}{' + t1 + '-0}=' + m) + '. The amount goes ' + (c.s < 0 ? '<b>down</b>' : '<b>up</b>') + ' ' + t(rt) + ' ' + c.u + ' each ' + c.per + '.', code: 'sign' },
      { html: f(c.flip), why: 'Slope units are (units of ' + t(c.Y) + ') per (unit of ' + t(c.X) + '): ' + c.u + ' per ' + c.per + ', not ' + c.pers + ' per ' + c.unitY + '.', code: 'flip' },
      { html: f(c.icpt), why: 'True, but ' + t(F(V0)) + ' ' + c.u + ' is the ' + t(c.Y) + '-intercept (the starting value). The slope is the rate of change: ' + t(m) + ' ' + c.u + ' per ' + c.per + '.', code: 'icpt' }];
    return mc(r, c.txt + figBox(svg) + 'What does the <b>slope</b> of this line tell you?', opts,
      t('m=\\frac{' + V1 + '-' + V0 + '}{' + t1 + '-0}=\\frac{' + (V1 - V0) + '}{' + t1 + '}=' + m) + ' ' + c.u + ' per ' + c.per + ': ' + f(c.right).replace(/\.$/, '').replace(/^./, function (ch) { return ch.toLowerCase(); }) + '.',
      ['Slope = rise ÷ run, using the two labelled points. Its units are (units of ' + t(c.Y) + ') per (unit of ' + t(c.X) + ').', 'A falling line has a negative slope: the amount is going down.'], 'meaning of slope: ' + c.Y);
  }
  var L9C = [
    { txt: 'A bike rental costs a {$f} flat fee plus {$r} per hour.', X: 'h', xw: 'the number of hours', f: [5, 15], r: [2, 6] },
    { txt: 'A gym charges a {$f} sign-up fee plus {$r} per month.', X: 'm', xw: 'the number of months', f: [20, 60, 5], r: [10, 30, 5] },
    { txt: 'A dog walker charges a {$f} flat fee plus {$r} per dog walked.', X: 'n', xw: 'the number of dogs', f: [5, 15], r: [3, 8] },
    { txt: 'A moving company charges a {$f} flat fee plus {$r} per hour.', X: 'h', xw: 'the number of hours', f: [50, 90, 5], r: [20, 45, 5] },
    { txt: 'A parking lot charges {$f} to enter, plus {$r} for each hour parked.', X: 'h', xw: 'the number of hours', f: [3, 8], r: [2, 5] }];
  function pickR(r, a) { var s = a[2] || 1; return a[0] + s * r.int(0, Math.round((a[1] - a[0]) / s)); }
  function l9q2(r) { // Ryan: $8 fee + $3/h → C = 3h + 8 · $25 + $15/month → C = 15m + 25
    var c = r.pick(L9C), s = until(function () { return { f: pickR(r, c.f), rt: pickR(r, c.r) }; }, function (s) { return s.f !== s.rt; });
    var f = s.f, rt = s.rt, X = c.X, T = L(rt, f), eqK = 'C=' + rt + X + '+' + f;
    var Wl = W(T, [{ is: L(f, rt), code: 'u7x-ctx-swap', hint: 'The rate (' + dollars(rt) + ' each) multiplies ' + t(X) + '. The flat fee (' + dollars(f) + ') is the starting value ' + t('b') + '.' },
      { is: L(f + rt, 0), code: 'u7x-ctx-sum', hint: 'The ' + dollars(f) + ' is charged once, not every time. Only the ' + dollars(rt) + ' multiplies ' + t(X) + '.' },
      { is: L(rt, -f), code: 'u7x-ctx-minus', hint: 'A flat fee is <b>added</b> to the cost.' },
      { is: L(rt, 0), code: 'u7x-ctx-no-b', hint: 'Don’t forget the flat fee: even at ' + t(X + '=0') + ' the cost is ' + dollars(f) + '.' }]);
    return LP(fillC(c.txt, { f: f, r: rt }) + ' Write an equation for the total cost ' + t('C') + ' (in dollars) in terms of ' + c.xw + ', ' + t(X) + '.', T, { form: 'slope-intercept', vars: [X, 'C'], wrong: Wl, noOnlyB: true, placeholder: 'e.g. C = 2' + X + ' + 5' },
      'The rate ' + t('m=' + rt) + ' (dollars per ' + (X === 'm' ? 'month' : X === 'n' ? 'dog' : 'hour') + ') multiplies ' + t(X) + '; the flat fee ' + t('b=' + f) + ' (dollars) is the starting value:<br>' + t(eqK) + '.',
      ['The amount charged <b>per</b> ' + (X === 'm' ? 'month' : X === 'n' ? 'dog' : 'hour') + ' is the slope: it multiplies ' + t(X) + '.', 'The flat fee is paid once: it is the constant ' + t('b') + '.'], 'context equation ' + eqK);
  }
  var L9I = [
    { txt: 'A dog groomer charges ' + t('C={r}n+{f}') + ', where ' + t('C') + ' is the cost in dollars and ' + t('n') + ' is the number of dogs. A bill came to {$C}. How many dogs were groomed?', X: 'n', u: 'dogs', f: [10, 25, 5], r: [8, 15], n: [3, 8] },
    { txt: 'A plumber charges ' + t('C={r}h+{f}') + ', where ' + t('C') + ' is the cost in dollars and ' + t('h') + ' is the number of hours. A bill came to {$C}. How many hours did the plumber work?', X: 'h', u: 'hours', f: [40, 80, 10], r: [30, 60, 5], n: [2, 6] },
    { txt: 'A moving company charges ' + t('C={r}h+{f}') + ', where ' + t('C') + ' is the cost in dollars and ' + t('h') + ' is the number of hours. A move cost {$C}. How many hours did it take?', X: 'h', u: 'hours', f: [50, 90, 5], r: [25, 45, 5], n: [2, 7] },
    { txt: 'A dog walker charges ' + t('C={r}n+{f}') + ', where ' + t('C') + ' is the charge in dollars and ' + t('n') + ' is the number of dogs walked. A customer paid {$C}. How many dogs were walked?', X: 'n', u: 'dogs', f: [5, 15], r: [3, 8], n: [3, 9] }];
  function l9q3(r) { // Ryan: C = 12n + 15, $87 → 6 dogs · C = 40h + 50, $250 → 5 hours
    var c = r.pick(L9I), s = until(function () { return { f: pickR(r, c.f), rt: pickR(r, c.r), n: r.int(c.n[0], c.n[1]) }; }, function (s) { return s.f !== s.rt && s.f % s.rt !== 0; });
    var f = s.f, rt = s.rt, n = s.n, C = rt * n + f, X = c.X;
    var txt = c.txt.replace('{r}', rt).replace('{f}', f).replace('{$C}', dollars(C));
    var dl = [[C / rt, 'u7x-inv-nofee', 'Subtract the ' + dollars(f) + ' fee first: ' + t(C + '-' + f + '=' + (C - f)) + ', then divide by ' + t(rt) + '.'],
      [(C + f) / rt, 'u7x-inv-addfee', 'Solve ' + t(C + '=' + rt + X + '+' + f) + ' by <b>subtracting</b> ' + t(f) + ' from both sides.'],
      [(C - f) / f, 'u7x-inv-divfee', 'After ' + t(C + '-' + f + '=' + (C - f)) + ', divide by the rate, ' + t(rt) + ', not by the fee.'],
      [rt * C + f, 'u7x-inv-sub', t(C) + ' is the cost ' + t('C') + '. Set ' + t(rt + X + '+' + f + '=' + C) + ' and solve for ' + t(X) + '.']];
    return numPart(txt, n, dl,
      t(rt + X + '+' + f + '=' + C + '\\ \\rightarrow\\ ' + rt + X + '=' + (C - f) + '\\ \\rightarrow\\ ' + X + '=' + n) + ' ' + c.u + '.<br><b>Check:</b> ' + t(rt + '(' + n + ')+' + f + '=' + C) + ' ✓',
      ['The bill is the total ' + t('C') + ': substitute ' + t('C=' + C) + ' and solve for ' + t(X) + '.', 'Undo the flat fee first (subtract), then divide by the rate.'], 'use a context equation backwards', { before: t(X + '='), ansPre: X + '=', after: c.u });
  }
  var L9B = [
    { a: 'Gym A charges a {$f1} sign-up fee plus {$r1} per month.', b0: 'Gym B charges no sign-up fee, but {$r2} per month.', b1: 'Gym B charges a {$f2} sign-up fee plus {$r2} per month.', q: 'After how many months is the total cost the same at both gyms?', u: 'months', X: 'n', what: 'months', f: [30, 80, 10], r: [15, 40, 5] },
    { a: 'Taxi company A charges {$f1} plus {$r1} per km.', b0: 'Company B charges no starting fee, but {$r2} per km.', b1: 'Company B charges {$f2} plus {$r2} per km.', q: 'For what distance do both companies charge the same amount?', u: 'km', X: 'd', what: 'kilometres', f: [6, 15, 1], r: [1, 4, 1] },
    { a: 'Canoe rental A charges {$f1} plus {$r1} per hour.', b0: 'Rental B charges no base fee, but {$r2} per hour.', b1: 'Rental B charges {$f2} plus {$r2} per hour.', q: 'After how many hours do both rentals cost the same?', u: 'hours', X: 'h', what: 'hours', f: [10, 30, 2], r: [4, 12, 1] }];
  function l9q4(r) { // added (Mastery): assignment Q10 — Gym A $50 + $25/month, Gym B $35/month → 5 months
    var c = r.pick(L9B), s = until(function () { var r1 = pickR(r, c.r), d = c.r[2] * r.int(1, 3), f1 = pickR(r, c.f), f2 = r.chance(0.5) ? 0 : pickR(r, c.f); return { r1: r1, r2: r1 + d, f1: f1, f2: f2 }; },
      function (s) { var n = (s.f1 - s.f2) / (s.r2 - s.r1); return s.f2 < s.f1 && Number.isInteger(n) && n >= 2 && n <= 12; });
    var r1 = s.r1, r2 = s.r2, f1 = s.f1, f2 = s.f2, n = (f1 - f2) / (r2 - r1), X = c.X;
    var txt = fillC(c.a, { f1: f1, r1: r1 }) + ' ' + fillC(f2 ? c.b1 : c.b0, { f2: f2, r2: r2 }) + ' ' + c.q;
    var e1 = f1 + '+' + r1 + X, e2 = (f2 ? f2 + '+' : '') + r2 + X;
    var dl = [[f1 / r1, 'u7x-be-one', 'That uses only the first plan. Write a cost equation for <b>each</b> plan and set them equal.'], [f1 / r2, 'u7x-be-one', 'Write a cost equation for each plan and set them equal: ' + t(e1 + '=' + e2) + '.'],
      [f1 / (r2 - r1), 'u7x-be-fee', 'Include both starting fees: ' + t(e1 + '=' + e2) + '.'], [(f1 - f2) / (r1 + r2), 'u7x-be-add', 'Collect the ' + t(X) + '-terms on one side: ' + t(r2 + X + '-' + r1 + X + '=' + (r2 - r1) + X) + '.']];
    return numPart(txt, n, dl,
      'Plan A: ' + t('C=' + e1) + '. Plan B: ' + t('C=' + e2) + '.<br>Same cost: ' + t(e1 + '=' + e2) + '<br>' + t((f1 - f2) + '=' + (r2 - r1) + X + '\\ \\rightarrow\\ ' + X + '=' + n) + ' ' + c.u + '.<br><b>Check:</b> ' + t(f1 + '+' + r1 + '(' + n + ')=' + (f1 + r1 * n)) + ' and ' + t((f2 ? f2 + '+' : '') + r2 + '(' + n + ')=' + (f2 + r2 * n)) + ' ✓',
      ['Write an equation for the cost of each plan, using the same letter ' + t(X) + '.', 'Set the two costs equal and solve for ' + t(X) + '.'], 'break-even ' + c.u, { before: t(X + '='), ansPre: X + '=', after: c.u });
  }
  HW.defineExit({ lesson: 'u7l9', calc: false, outcome: 'RF4',
    blurb: 'Slope in context: what the slope of a graph means, writing a cost equation, using it backwards, and the break-even point of two plans.',
    questions: [Q(1, 'RF3', 'PRG', l9q1), Q(2, 'RF4', 'PRG', l9q2), Q(3, 'RF4', 'PRG', l9q3), Q(4, 'RF4', 'MAS', l9q4)] });

  /* =====================================================================================================
   * Lesson 10 — Unit review (RF5, RF7)
   * ===================================================================================================== */
  function l10q1(r) { // Ryan: (−1, 5), (2, −4) → y = −3x + 2 · (−2, 7), (1, −2) → y = −3x + 1
    var s = until(function () { return { m: r.pick([-4, -3, -2, 2, 3, -3, -2]), x1: r.int(-3, -1), run: r.int(2, 4), b: r.pick(nzs(-6, 6)) }; }, function (s) { var y1 = s.m * s.x1 + s.b, y2 = y1 + s.m * s.run, x2 = s.x1 + s.run; return Math.abs(y1) <= 12 && Math.abs(y2) <= 12 && x2 !== 0 && y1 !== s.b && y1 !== 0 && y2 !== 0; });
    var m = s.m, x1 = s.x1, x2 = x1 + s.run, b = s.b, y1 = m * x1 + b, y2 = m * x2 + b, mx = m * x1, T = L(m, b);
    var Wl = W(T, [{ is: L(m, y1 + mx), code: 'u7x-tv-sign', hint: 'Check the product: ' + t(m + '(' + x1 + ')=' + mx) + '. Then ' + t(y1 + '=' + pT(mx) + '+b') + '.' },
      { is: L(-m, y1 - m * x1), code: 'u7x-sl-order', hint: 'Keep one order: ' + t('\\frac{' + y2 + '-' + pT(y1) + '}{' + x2 + '-' + pT(x1) + '}=\\frac{' + (y2 - y1) + '}{' + (x2 - x1) + '}=' + m) + '.' },
      { is: L(m, y1), code: 'u7x-b-point', hint: t(ptT(x1, y1)) + ' is not on the ' + t('y') + '-axis. Substitute and solve: ' + t(y1 + '=' + m + '(' + x1 + ')+b') + '.' }]);
    return LP('Determine the equation of the line through ' + t(ptT(x1, y1)) + ' and ' + t(ptT(x2, y2)) + '. Write it in the form ' + t('y=mx+b') + '.', T, { form: 'slope-intercept', wrong: Wl, bad: [String(b)] },
      t('m=\\frac{' + y2 + '-' + pT(y1) + '}{' + x2 + '-' + pT(x1) + '}=\\frac{' + (y2 - y1) + '}{' + (x2 - x1) + '}=' + m) + '.<br>Then ' + t(y1 + '=' + m + '(' + x1 + ')+b=' + mx + '+b') + ', so ' + t('b=' + b) + ': ' + t(SI(m, b)) + '.<br><b>Check:</b> ' + t(m + '(' + x2 + ')' + (b < 0 ? '' : '+') + b + '=' + y2) + ' ✓',
      ['Slope first: ' + t('m=\\frac{y_2-y_1}{x_2-x_1}') + ' (subtracting a negative adds).', 'Substitute one point into ' + t('y=mx+b') + ' and solve for ' + t('b') + '.'], 'line through two points (review)');
  }
  function l10q2(r) { // Ryan: y-intercept of 4x − 3y + 12 = 0 → 4 · 5x − 2y + 10 = 0 → 5
    var s = until(function () { return { A: r.int(1, 6), B: r.pick([-5, -4, -3, -2, 2, 3, -3, -2]), y0: r.pick(nzs(-6, 6)) }; }, function (s) { var C = -s.B * s.y0; return C % s.A === 0 && Math.abs(C / s.A) !== Math.abs(s.y0) && Math.abs(s.B) !== Math.abs(s.y0) && gcd(gcd(s.A, s.B), C) === 1 && s.A !== Math.abs(s.B); });
    var A = s.A, Bc = s.B, y0 = s.y0, C = -Bc * y0, x0 = -C / A, eq = lin([[A, 'x'], [Bc, 'y'], [C, '']]) + '=0';
    var dl = [[-y0, 'u7x-icpt-sign', t(term(Bc, 'y', true) + (C < 0 ? '' : '+') + C + '=0\\ \\rightarrow\\ ' + Bc + 'y=' + (-C) + '\\ \\rightarrow\\ y=' + y0) + (Bc < 0 ? ' — a negative divided by a negative is positive.' : '.')],
      [C, 'u7x-icpt-const', 'Set ' + t('x=0') + ' and solve: ' + t(term(Bc, 'y', true) + '=' + (-C)) + ' — divide by ' + t(Bc) + '.'], [-C, 'u7x-icpt-const', t(term(Bc, 'y', true) + '=' + (-C)) + ': divide by ' + t(Bc) + ' to finish.'],
      [x0, 'u7x-icpt-swap', 'That is the ' + t('x') + '-intercept (from ' + t('y=0') + '). For the ' + t('y') + '-intercept set ' + t('x=0') + '.']];
    return icptPart('What is the ' + t('y') + '-intercept of the line ' + t(eq) + '?', y0, 'y', dl,
      'Set ' + t('x=0') + ': ' + t(term(Bc, 'y', true) + (C < 0 ? '' : '+') + C + '=0\\ \\rightarrow\\ ' + term(Bc, 'y', true) + '=' + (-C) + '\\ \\rightarrow\\ y=' + y0) + '. The ' + t('y') + '-intercept is ' + t(ptT(0, y0)) + '.',
      ['The ' + t('y') + '-intercept is on the ' + t('y') + '-axis, where ' + t('x=0') + '.', 'Replace ' + t('x') + ' with ' + t('0') + ' and solve for ' + t('y') + ' (divide by the coefficient, with its sign).'], 'y-intercept of ' + eq);
  }
  function l10q3(r) { // Ryan: y = 2/3x + 2 marked (−3, 0), (3, 4) · y = −3/2x + 3 marked (0, 3), (2, 0)
    var s = until(function () { var m = r.pick([[2, 3], [-2, 3], [3, 2], [-3, 2], [1, 2], [-1, 2], [1, 3], [-1, 3]]); return { m: m, b: r.pick(nzs(-3, 3)) }; }, function (s) {
      var pts = latPts(s.m, s.b, [-4, 4], [-4, 4]); return pts.length >= 2 && pts[pts.length - 1][0] - pts[0][0] >= s.m[1];
    });
    var m = fr(s.m), b = s.b, pts = latPts(m, b, [-4, 4], [-4, 4]), i = r.int(0, pts.length - 2), P1 = pts[i], P2 = pts[i + 1], T = L(m, b);
    if (r.chance(0.4) && pts.length >= 3) P2 = pts[Math.min(pts.length - 1, i + 2)];
    var x0 = fr(-b * m[1], m[0]);
    var Wl = W(T, x0[1] === 1 ? [{ is: L(m, x0), code: 'u7x-b-xint', hint: t('b') + ' is where the line crosses the <b>' + t('y') + '</b>-axis: ' + t(ptT(0, b)) + ', so ' + t('b=' + b) + '.' }] : []);
    return LP('Write an equation of this line. Any correct form is fine.' + figBox(lineFig([T], { points: [P1, P2], aria: 'a line through two marked points' })), T, { wrong: Wl, bad: [SI(fNeg(m), b), SI(fInv(m), b)] },
      'The line crosses the ' + t('y') + '-axis at ' + t(ptT(0, b)) + ', so ' + t('b=' + b) + '. From ' + t(ptT(P1[0], P1[1])) + ' to ' + t(ptT(P2[0], P2[1])) + ': ' + t('m=\\frac{' + (P2[1] - P1[1]) + '}{' + (P2[0] - P1[0]) + '}' + ((P2[0] - P1[0]) === m[1] ? '' : '=' + nT(m))) + '.<br>So ' + t(SI(m, b)) + ', or in general form ' + t(GEN(T)) + '.',
      ['Read ' + t('b') + ' where the line crosses the ' + t('y') + '-axis.', 'Count rise over run between the marked points; a falling line has a negative slope.'], 'equation from a graph (review)');
  }
  function l10q4(r) { // added (Mastery): assignment Q26 — the line through two points in general form
    var s = until(function () { return { q: r.pick([2, 3, 4, 3]), p: r.pick([1, 2, 3]), sg: r.pick([1, -1]), x1: r.int(-5, -1), j: r.pick([1, 2]), y1: r.pick(nzs(-6, 6)) }; }, function (s) {
      var x2 = s.x1 + s.q * s.j, y2 = s.y1 + s.sg * s.p * s.j, bb = fr(s.y1 * s.q - s.sg * s.p * s.x1, s.q); return gcd(s.p, s.q) === 1 && s.p !== s.q && x2 !== 0 && Math.abs(x2) <= 8 && Math.abs(y2) <= 10 && bb[1] !== 1 && y2 !== 0; });
    var m = fr(s.sg * s.p, s.q), x1 = s.x1, y1 = s.y1, x2 = x1 + s.q * s.j, y2 = y1 + s.sg * s.p * s.j, T = { m: m, point: [x1, y1] }, bb = fr(y1 * s.q - s.sg * s.p * x1, s.q);
    var G = Ln.of(T), Wl = W(T, [{ is: { m: m, b: y1 }, code: 'u7x-b-point', hint: t(ptT(x1, y1)) + ' is not on the ' + t('y') + '-axis. Substitute a point into ' + t('y=mx+b') + ' and solve for ' + t('b') + '.' },
      { is: { m: fNeg(m), point: [x1, y1] }, code: 'u7x-sl-order', hint: 'Keep one order when you subtract: ' + t('m=\\frac{' + y2 + '-' + pT(y1) + '}{' + x2 + '-' + pT(x1) + '}=' + nT(m)) + '.' },
      { is: { m: m, b: fr(y1 * s.q + s.sg * s.p * x1, s.q) }, code: 'u7x-b-solve', hint: 'Check the step that finds ' + t('b') + ': ' + t(y1 + '=' + nT(m) + '(' + x1 + ')+b') + ', so ' + t('b=' + y1 + '-' + pT(fr(s.sg * s.p * x1, s.q))) + '.' }]);
    return LP('Determine the equation of the line through ' + t(ptT(x1, y1)) + ' and ' + t(ptT(x2, y2)) + '. Write it in general form, ' + t('Ax+By+C=0') + ' (' + t('A') + ', ' + t('B') + ', ' + t('C') + ' integers, ' + t('A') + ' positive).', T, { form: 'general', wrong: Wl, bad: [SI(m, bb)], noOnlyB: true },
      t('m=\\frac{' + y2 + '-' + pT(y1) + '}{' + x2 + '-' + pT(x1) + '}=\\frac{' + (y2 - y1) + '}{' + (x2 - x1) + '}=' + nT(m)) + '.<br>Substitute ' + t(ptT(x1, y1)) + ': ' + t(y1 + '=' + nT(m) + '(' + x1 + ')+b') + ', so ' + t('b=' + nT(bb)) + ' and ' + t(SI(m, bb)) + '.<br>Multiply every term by ' + t(s.q) + ': ' + t(s.q + 'y=' + lin([[s.sg * s.p, 'x'], [fv(bb) * s.q, '']])) + '.<br>Move every term to one side, ' + t('A') + ' positive: ' + t(GEN(T)) + '.',
      ['Find the slope, then ' + t('b') + ' (it is a fraction here).', 'Clear the fractions by multiplying every term by ' + t(s.q) + ', then move everything to one side.'], 'two points to general form');
  }
  HW.defineExit({ lesson: 'u7l10', calc: false, outcome: 'RF7',
    blurb: 'Unit 7 review: an equation through two points, a y-intercept from general form, an equation from a graph, and two points to general form.',
    questions: [Q(1, 'RF7', 'PRG', l10q1), Q(2, 'RF5', 'PRG', l10q2), Q(3, 'RF7', 'PRG', l10q3), Q(4, 'RF7', 'MAS', l10q4)] });
})(window);
