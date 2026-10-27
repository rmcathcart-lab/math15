/* Math 15 · Unit 5 · Lesson 4 — Where Graphs Meet the Axes: x- and y-Intercepts (RF5)
 * Assignment 4 (u5_L04.tex, Questions 1–13) and the Lesson 4 Extra Practice (u5_EP04.tex, Questions 1–19).
 * Every part is a generator that keeps the booklet question's structure (a line read off a graph, a curve with two
 * x-intercepts, a table in order or out of order, a context graph or table, an equation in y = mx + b or Ax + By = C form)
 * and changes the numbers; the booklet's own numbers and graphs are among the possible values.
 * Answer format: the booklet's key writes every intercept as an ordered pair, so the intercept boxes take ordered pairs
 * (a bare value gets a nudge, not a lost try) with a "none" key where a line can miss an axis.
 * Conversions: "fill in the blank" with "any number" and every "explain" / "what does it represent" → multiple choice whose
 * options are reasons; True/False → True/False buttons; EP 8(d) → a table of choices; EP 17(b) sketch → the graph pad.
 * EP 6, 13–15 and 17 ask for y = mx + b, which Math 15 meets in Unit 7: the hints and solutions find m by substituting
 * the x-intercept point (the method of EP 14–15), never by slope.
 * Model: Math 10C u5l3 (helpers, checkers, codes copied from there).
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Main outcome RF5; Q9(d) (linear or not) RF4; Q10(c)(d) (reading a value off a
 * context graph) RF1. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P;

  HW.addCodes({
    'int-gave-x': 'Gave the x-intercept instead of the y-intercept', 'int-gave-y': 'Gave the y-intercept instead of the x-intercept',
    'int-no-divide': 'Didn’t divide by the coefficient', 'int-sign': 'Intercept with the wrong sign', 'int-gave-m': 'Gave the coefficient of x',
    'int-point-not-value': 'Gave a point where a value was asked', 'int-value-not-point': 'Gave a value where a point was asked',
    'int-pt-flip': 'Intercept point with the coordinates swapped', 'int-pt-swap': 'x- and y-intercept points swapped', 'int-off-axis': 'Point not on the axis',
    'int-missing': 'Missed an intercept', 'int-extra': 'Extra intercept', 'int-said-none': 'Said “none” when the intercept exists',
    'int-missed-none': 'Gave an intercept that doesn’t exist', 'int-bad-value': 'Wrong intercept value (written as a value)', 'int-unreadable': 'Intercept not written as an ordered pair',
    'ctx-used': 'Gave the amount used instead of the amount left', 'ctx-added': 'Added instead of subtracting', 'ctx-mult': 'Multiplied instead of dividing',
    'ctx-rate': 'Gave the rate', 'ctx-no-sub': 'Didn’t subtract the starting amount', 'ctx-eval': 'Substituted instead of solving',
    'eq-no-equals': 'Not written as an equation', 'eq-unreadable': 'Equation unreadable', 'eq-not-line': 'Not a straight line',
    'eq-const': 'Wrong constant in the equation', 'eq-slope-sign': 'Slope with the wrong sign', 'eq-slope-flip': 'Slope upside down (run over rise)',
    'eq-b-xint': 'Used the x-intercept as b', 'decimal-rounded': 'Rounded decimal instead of exact fraction',
    'u5l4-not-ymxb': 'Right line, not written as y = mx + b', 'u5l4-time-left': 'Read the time still to go instead of the time so far',
    'u5l4-coef': 'Took a coefficient as the intercept', 'u5l4-k-none': 'Gave a value although no value works', 'u5l4-area-half': 'Forgot the ½ in the triangle area',
    'u5l4-one-b': 'Gave only one of the two possible values'
  });
  HW.addPartial({ 'u5l4-not-ymxb': 's', 'u5l4-time-left': 'b', 'u5l4-coef': 'n', 'u5l4-k-none': 'n', 'u5l4-area-half': 'b', 'u5l4-one-b': 's', 'decimal-rounded': 's' });

  /* ---------------- numbers and LaTeX ---------------- */
  function cl(x) { return Math.round(x * 1e6) / 1e6; }
  function same(a, b) { return Math.abs(a - b) < 1e-9; }
  function nT(x) { return F(cl(x)); }
  function vt(x) { if (Math.abs(x - Math.round(x)) < 1e-9) return F(Math.round(x)); for (var q = 2; q <= 24; q++) if (Math.abs(x * q - Math.round(x * q)) < 1e-6) return ex.texRat(ex.norm(Math.round(x * q), q)); return String(cl(x)); }
  function sg(c) { c = cl(c); return c < 0 ? nT(c) : '+' + nT(c); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function pm(a, b) { return range(a, b).concat(range(a, b).map(function (x) { return -x; })); }
  function cTex(c) { // coefficient of x as LaTeX ("", "-", "3", "\frac{1}{2}", "-\frac{3}{4}")
    var q = Array.isArray(c) ? ex.norm(c[0], c[1]) : null;
    if (q) { if (q[1] === 1) return q[0] === 1 ? '' : q[0] === -1 ? '-' : String(q[0]); return (q[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(q[0]) + '}{' + q[1] + '}'; }
    c = cl(c); if (c === 1) return ''; if (c === -1) return '-'; if (Math.abs(c - Math.round(c)) < 1e-9) return String(c); return vt(c);
  }
  function mxb(m, b) { // y = mx + b as LaTeX; m a number or [p, q]
    var mv = Array.isArray(m) ? m[0] / m[1] : m, s = 'y=';
    if (same(mv, 0)) return s + nT(b);
    s += cTex(Array.isArray(m) ? m : (Math.abs(mv - Math.round(mv)) < 1e-9 ? mv : fracOf(mv))) + 'x';
    if (!same(b, 0)) s += sg(b);
    return s;
  }
  function fracOf(x) { for (var q = 1; q <= 48; q++) if (Math.abs(x * q - Math.round(x * q)) < 1e-6) return ex.norm(Math.round(x * q), q); throw new Error('u5l4: not a simple fraction ' + x); }
  function genForm(A, Bc, C) { // Ax + By = C
    var s = (A === 1 ? '' : A === -1 ? '-' : A) + 'x' + (Bc < 0 ? '-' : '+') + (Math.abs(Bc) === 1 ? '' : Math.abs(Bc)) + 'y=' + C;
    return s;
  }
  function ptT(p) { return '(' + vt(p[0]) + ',\\ ' + vt(p[1]) + ')'; }
  function ptsT(ps) { return ps.map(ptT).join(',\\ '); }
  function ptKey(p) { return '(' + vt(p[0]) + ', ' + vt(p[1]) + ')'; }
  function uniqV(a) { var o = []; a.forEach(function (x) { if (!o.some(function (y) { return same(x, y); })) o.push(x); }); return o.sort(function (x, y) { return y - x; }); }
  function pickWhere(gen, okf) { for (var i = 0; i < 4000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('u5l4: no valid numbers'); }

  var HX = ['At an ' + t('x') + '-intercept the graph is on the ' + t('x') + '-axis, where ' + t('y=0') + '.', 'An ' + t('x') + '-intercept point looks like ' + t('(a,\\ 0)') + '.'];
  var HY = ['At a ' + t('y') + '-intercept the graph is on the ' + t('y') + '-axis, where ' + t('x=0') + '.', 'A ' + t('y') + '-intercept point looks like ' + t('(0,\\ b)') + '.'];
  var HXY = ['The ' + t('x') + '-intercept is where the graph meets the ' + t('x') + '-axis (' + t('y=0') + '); the ' + t('y') + '-intercept is where it meets the ' + t('y') + '-axis (' + t('x=0') + ').',
    'An ' + t('x') + '-intercept point looks like ' + t('(a,\\ 0)') + ' and a ' + t('y') + '-intercept point like ' + t('(0,\\ b)') + '.'];
  var HEQ = ['For the ' + t('x') + '-intercept substitute ' + t('y=0') + ' and solve for ' + t('x') + '; for the ' + t('y') + '-intercept substitute ' + t('x=0') + ' and solve for ' + t('y') + '.',
    'Write each intercept as an ordered pair: ' + t('(a,\\ 0)') + ' and ' + t('(0,\\ b)') + '.'];

  /* ---------------- answer readers (from 10C u5l3) ---------------- */
  function strip(s) { return String(s == null ? '' : s).replace(/\\(left|right)/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\\{|\\\}|\\lbrace|\\rbrace/g, ' ').trim(); }
  function looksPoint(s) { return /\([^()]*,[^()]*\)/.test(strip(s)); }
  function isNone(s) { var z = String(s == null ? '' : s).replace(/\\text\{\s*([^}]*)\}/g, '$1').replace(/[\s-]+/g, '').toLowerCase(); return /^(none|no|nointercepts?|dne|no[xy]intercepts?|nosolutions?|novalue|impossible)$/.test(z); }
  function pairList(resp) {
    var s = strip(resp).trim();
    if (/^\{[\s\S]*\}$/.test(s) && !/^\{[^{}]*\}\{/.test(s)) s = s.slice(1, -1).trim();
    if (!s) return { empty: true };
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) {
      var xy = m[1].split(','); if (xy.length !== 2) return { bad: true };
      var a = ex.parse(xy[0].trim()), b = ex.parse(xy[1].trim()); if (!a.ok || !b.ok) return { bad: true };
      var va = ex.value(a.ast), vb = ex.value(b.ast); if (!isFinite(va) || !isFinite(vb)) return { bad: true };
      out.push([va, vb]);
    }
    if (s.replace(re, '').replace(/[,;\s]|\\[,;!: ]|\\text\{\s*and\s*\}|and/g, '').length || !out.length) return { bad: true };
    return { pairs: out };
  }
  function valueList(resp) {
    var s = strip(resp).replace(/\\text\{\s*(or|and)\s*\}/gi, ',').replace(/\b(or|and)\b/gi, ',').replace(/[a-zA-Z]\s*=\s*/g, '').replace(/\\pm|±/g, '±');
    if (!s.trim()) return null;
    var out = [], ps = s.split(/[,;]/);
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i].trim(); if (!p) continue;
      var both = p.charAt(0) === '±'; if (both) p = p.slice(1);
      var r = ex.parse(p); if (!r.ok) return null;
      var v = ex.value(r.ast); if (!isFinite(v)) return null;
      out.push(v); if (both) out.push(-v);
    }
    return out.length ? uniqV(out) : null;
  }

  /* ---- one box of intercept points. want: [[x, y], …] or null (no such intercept). axis 'x' | 'y'.
   * o: { other, noneWhy, saidNoneWhy, missWhy, diag(pairs), names, tol (accept values this close: rounded answers),
   *      exact (a value within 0.01 but not exact gets a "leave it as a fraction" nudge) } ---- */
  function ptsCheck(want, axis, o) {
    o = o || {};
    var tol = o.tol || 1e-9, sm = function (a, b) { return Math.abs(a - b) < tol; };
    var zero = axis === 'x' ? 1 : 0, keep = 1 - zero, nm = o.names || { x: 'x', y: 'y' }, other = nm[axis === 'x' ? 'y' : 'x'], name = t(nm[axis]) + '-intercept';
    var vals = want ? want.map(function (p) { return p[keep]; }) : [];
    var sample = axis === 'x' ? t('(3,\\ 0)') : t('(0,\\ 3)');
    var ax = nm[axis];
    var an = /^[aefhilmnorsx]$/i.test(ax) ? 'an' : 'a', An = an.charAt(0).toUpperCase() + an.slice(1);
    var sameSet = function (A, T) { return A.every(function (p) { return T.some(function (q) { return sm(p[0], q[0]) && sm(p[1], q[1]); }); }) && T.every(function (q) { return A.some(function (p) { return sm(p[0], q[0]) && sm(p[1], q[1]); }); }); };
    var sameVals = function (A, T) { return A.every(function (x) { return T.some(function (y) { return sm(x, y); }); }) && T.every(function (y) { return A.some(function (x) { return sm(x, y); }); }); };
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Type the ' + name + ' point(s)' + (o.noneKey === false ? '.' : ', or press <b>none</b> if there isn’t one.'));
      if (isNone(s)) return want ? wrong('int-said-none', o.saidNoneWhy || 'There is ' + an + ' ' + name + ' here: the graph does meet the ' + t(ax) + '-axis.') : ok();
      var L = pairList(s);
      if (L.bad || L.empty) {
        var V = valueList(s);
        if (V) {
          if (!want) return wrong('int-missed-none', o.noneWhy || 'Check: this graph never meets the ' + t(ax) + '-axis, so there is no ' + name + '.');
          if (sameVals(V, vals)) return form('int-value-not-point', 'Right value' + (vals.length > 1 ? 's' : '') + ' — now write ' + (vals.length > 1 ? 'each one' : 'it') + ' as an ordered pair, like ' + sample + '.');
          return wrong('int-bad-value', 'Write each intercept as an ordered pair, like ' + sample + ' — and check the number: at ' + an + ' ' + name + ', ' + t(other + '=0') + '.');
        }
        return form('int-unreadable', 'Write each point as an ordered pair in brackets, like ' + sample + (vals.length > 1 ? ', with a comma between points' : '') + (o.noneKey === false ? '.' : ' — or press <b>none</b>.'));
      }
      var A = L.pairs;
      if (!want) return wrong('int-missed-none', o.noneWhy || 'Check: this graph never meets the ' + t(ax) + '-axis, so there is no ' + name + '. Press <b>none</b>.');
      if (sameSet(A, want)) return ok();
      if (o.diag) { var h = o.diag(A); if (h) return h.form ? form(h.code, h.hint) : wrong(h.code, h.hint); }
      if (o.exact && A.length === want.length && A.every(function (p) { return want.some(function (q) { return Math.abs(p[0] - q[0]) < 0.0101 && Math.abs(p[1] - q[1]) < 0.0101; }); }))
        return form('decimal-rounded', 'Very close — but that is a rounded decimal. Leave the intercept as an exact fraction (use the fraction key).');
      var sub = A.every(function (p) { return want.some(function (q) { return sm(p[0], q[0]) && sm(p[1], q[1]); }); });
      if (o.other && sameSet(A, o.other) && !sub) return wrong('int-pt-swap', 'That is the ' + t(other) + '-intercept (it has ' + t(ax + '=0') + '). This box is for where the graph meets the ' + t(ax) + '-axis.');
      if (!sub && A.every(function (p) { return sm(p[keep], 0) && vals.some(function (v) { return sm(v, p[zero]); }); }) && !vals.every(function (v) { return sm(v, 0); }))
        return wrong('int-pt-flip', 'Your coordinates are in the wrong order. ' + An + ' ' + name + ' lies on the ' + t(ax) + '-axis, so its ' + t(other) + '-coordinate is ' + t('0') + ': ' + (axis === 'x' ? t('(a,\\ 0)') : t('(0,\\ b)')) + '.');
      var off = A.filter(function (p) { return !sm(p[zero], 0); });
      if (off.length) return wrong('int-off-axis', t(ptT(off[0])) + ' isn’t on the ' + t(ax) + '-axis: every ' + name + ' has ' + t(other) + '-coordinate ' + t('0') + '.');
      var got = uniqV(A.map(function (p) { return p[keep]; }));
      var miss = vals.filter(function (v) { return !got.some(function (g) { return sm(g, v); }); }), extra = got.filter(function (g) { return !vals.some(function (v) { return sm(g, v); }); });
      if (miss.length && !extra.length) return wrong('int-missing', o.missWhy || 'Correct so far — but there is another ' + name + '. Look for <b>every</b> place the graph meets the ' + t(ax) + '-axis.');
      if (extra.length && !miss.length) return wrong('int-extra', 'One of your points isn’t ' + an + ' ' + name + '. Check each one.');
      if (got.length === vals.length && got.every(function (g) { return vals.some(function (v) { return sm(-g, v); }); })) return wrong('int-sign', 'Check the sign' + (vals.length > 1 ? 's' : '') + ' of your ' + name + (vals.length > 1 ? 's' : '') + '.');
      return wrong('value', null);
    };
  }
  /* The x- and y-intercept boxes. xs / ys: the intercept values (null = none).
   * o: { only: 'x'|'y', names, none (show the none key; default true), tol, exact, fmt (number format for the key: vt or nT), xNone, yNone, xSaidNone, ySaidNone, xMiss, yMiss, xDiag, yDiag, sol, hints, text, bad, good } */
  function interceptsPart(prompt, xs, ys, o) {
    o = o || {};
    var ord = function (vs) { vs = uniqV(vs); return vs.reverse(); };
    var xp = xs ? ord(xs).map(function (v) { return [v, 0]; }) : null, yp = ys ? ord(ys).map(function (v) { return [0, v]; }) : null;
    var nm = o.names || { x: 'x', y: 'y' }, noneKey = o.none !== false, fv = o.fmt || vt;
    var ptTf = function (q) { return '(' + fv(q[0]) + ',\\ ' + fv(q[1]) + ')'; }, ptKf = function (q) { return '(' + fv(q[0]) + ', ' + fv(q[1]) + ')'; };
    var plural = function (p) { return p && p.length > 1 ? 's' : ''; };
    var fields = [{ name: t(nm.x) + '-intercept', label: t(nm.x) + '-intercept' + plural(xp), mode: 'math', keys: 'pairs', none: noneKey, wide: true, placeholder: xp && xp.length > 1 ? 'e.g. (-1, 0), (3, 0)' : noneKey ? 'e.g. (2, 0)  or  none' : 'e.g. (2, 0)' },
      { name: t(nm.y) + '-intercept', label: t(nm.y) + '-intercept' + plural(yp), mode: 'math', keys: 'pairs', none: noneKey, wide: true, placeholder: noneKey ? 'e.g. (0, 3)  or  none' : 'e.g. (0, 3)' }];
    if (o.only) fields = fields.filter(function (f, i) { return o.only === (i ? 'y' : 'x'); });
    var cx = { other: yp, noneWhy: o.xNone, saidNoneWhy: o.xSaidNone, missWhy: o.xMiss, diag: o.xDiag, names: o.names, tol: o.tol, exact: o.exact, noneKey: noneKey };
    var cy = { other: xp, noneWhy: o.yNone, saidNoneWhy: o.ySaidNone, missWhy: o.yMiss, diag: o.yDiag, names: o.names, tol: o.tol, exact: o.exact, noneKey: noneKey };
    var chx = ptsCheck(xp, 'x', cx), chy = ptsCheck(yp, 'y', cy);
    var kx = xp ? xp.map(ptKf).join(', ') : 'none', ky = yp ? yp.map(ptKf).join(', ') : 'none';
    var ax = t(nm.x) + '-intercept' + plural(xp) + ': ' + (xp ? t(xp.map(ptTf).join(',\\ ')) : '<b>none</b>'), ay = t(nm.y) + '-intercept' + plural(yp) + ': ' + (yp ? t(yp.map(ptTf).join(',\\ ')) : '<b>none</b>');
    var checks = o.only === 'x' ? [chx] : o.only === 'y' ? [chy] : [chx, chy], keys = o.only === 'x' ? [kx] : o.only === 'y' ? [ky] : [kx, ky];
    var p = B.fields(prompt, fields, checks, keys, o.only === 'x' ? ax : o.only === 'y' ? ay : ax + '<br>' + ay, o.sol, o.hints || HXY, o.text);
    var rev = function (ps) { return ps.slice().reverse().map(function (q) { return '\\left(' + vt(q[0]) + ',' + vt(q[1]) + '\\right)'; }).join(','); };
    var good = [[xp ? rev(xp) : '\\text{none}', yp ? rev(yp) : 'none']];
    var bad = [];
    if (!o.only) {
      if (xp && yp && !(xp.length === 1 && yp.length === 1 && same(xp[0][0], 0) && same(yp[0][1], 0))) bad.push([ky, kx]);
      if (xp && !xp.every(function (q) { return same(q[0], 0); })) bad.push([xp.map(function (q) { return ptKey([q[1], q[0]]); }).join(', '), ky]);
      if (xp) bad.push(['none', ky]); else bad.push(['(1, 0)', ky]);
      if (yp) bad.push([kx, 'none']); else bad.push([kx, '(0, 1)']);
      if (xp && xp.length > 1) bad.push([ptKey(xp[0]), ky]);
    } else {
      var mine = o.only === 'x' ? xp : yp;
      good = [[good[0][o.only === 'x' ? 0 : 1]]];
      if (noneKey) bad.push([mine ? 'none' : (o.only === 'x' ? '(1, 0)' : '(0, 1)')]);
      if (mine && !mine.every(function (q) { return same(q[0], 0) && same(q[1], 0); })) bad.push([mine.map(function (q) { return ptKey([q[1], q[0]]); }).join(', ')]);
    }
    if (o.tol) good = [];
    p.good = good.concat(o.good || []); p.bad = bad.concat(o.bad || []);
    return p;
  }
  /* ---- one number with targeted diagnoses. dl: [[wrongValue, code, hint], …] ---- */
  function numPart(prompt, ans, dl, sol, hints, text, inp) {
    ans = cl(ans);
    dl = (dl || []).filter(function (d) { return isFinite(d[0]) && !same(d[0], ans); });
    var p = B.number(prompt, ans, function (v) { for (var i = 0; i < dl.length; i++) if (same(v, dl[i][0])) return { code: dl[i][1], hint: dl[i][2] }; return null; }, sol, hints, text, inp);
    var c = p.check;
    p.check = function (resp) { if (looksPoint(resp)) return form('int-point-not-value', 'This asks for a single number, not an ordered pair.'); return c(resp); };
    p.bad = dl.map(function (d) { return String(cl(d[0])); });
    return p;
  }
  function mcPart(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }

  /* ---------------- graphs ---------------- */
  var DR = HW.draw;
  function gv(pts, pieces, join) { return { pts: pts || [], pieces: pieces || [], join: join || 'none' }; }
  function segv(a, b, s, e) { return { v: [a, b], s: s || 'closed', e: e || 'closed' }; }
  function lineV(p, q) { return gv([], [segv(p, q, 'arrow', 'arrow')]); }
  function clipL(p, q, X, Y, inset) { // the line through p and q inside the window (inset a little)
    var e = inset == null ? 0.3 : inset, dx = q[0] - p[0], dy = q[1] - p[1], ts = [], x0 = X[0] + e, x1 = X[1] - e, y0 = Y[0] + e, y1 = Y[1] - e;
    if (dx) [x0, x1].forEach(function (x) { var u = (x - p[0]) / dx, y = p[1] + u * dy; if (y >= y0 - 1e-9 && y <= y1 + 1e-9) ts.push(u); });
    if (dy) [y0, y1].forEach(function (y) { var u = (y - p[1]) / dy, x = p[0] + u * dx; if (x >= x0 - 1e-9 && x <= x1 + 1e-9) ts.push(u); });
    var a = Math.min.apply(null, ts), b = Math.max.apply(null, ts);
    return [[p[0] + a * dx, p[1] + a * dy], [p[0] + b * dx, p[1] + b * dy]];
  }
  function lineG(p, q, opt) {
    opt = opt || {}; var X = opt.x || [-6, 6], Y = opt.y || [-6, 6];
    return HW.graph({ x: X, y: Y, labels: 1, max: opt.max || 300, segs: [{ pts: clipL(p, q, X, Y), start: 'arrow', end: 'arrow' }], aria: 'line' });
  }
  /* a line with x-intercept a and y-intercept b (both not 0) */
  function abLine(r, sa, sb, booklet) {
    return pickWhere(function () { return r.chance(0.25) && booklet ? booklet : [sa * r.int(1, 5), sb * r.int(1, 5)]; }, function (z) { return Math.abs(z[0]) <= 5 && Math.abs(z[1]) <= 5; });
  }
  function exactChk(target, opt) {
    var base = K.graphExact(target, opt);
    return function (resp) { if (!DR.empty(resp) && DR.same(resp, target)) return ok(); return base(resp); };
  }
  function drawPart(prompt, inp, check, key, sol, hints, text, bad) {
    var p = B.graph(prompt, inp, check, key, sol, hints, text);
    p.bad = (bad || []).filter(function (b) { return !DR.same(b, key); });
    return p;
  }
  var LINEPAD = { x: [-7, 7], y: [-7, 7], labels: 1, defaultEnd: 'arrow', tools: ['line', 'ends'] };

  /* ---------------- equations of lines: y = mx + b ---------------- */
  var EQK = 'u5l4eq';
  if (HW.widgets && HW.widgets.KEYSETS && !HW.widgets.KEYSETS[EQK]) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    HW.widgets.KEYSETS[EQK] = [[d(7), d(8), d(9), { label: '<i>x</i>', tex: 'x', plain: 'x' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [d(4), d(5), d(6), { label: '<i>y</i>', tex: 'y', plain: 'y' }, { label: 'clear', fn: 'clear' }],
      [d(1), d(2), d(3), { label: '=', tex: '=', plain: '=' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (out of a box)' }],
      [d(0), { label: '.', tex: '.', plain: '.' }, { label: '−', tex: '-', plain: '-' }, { label: '+', tex: '+', plain: '+' }, { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    if (HW.widgets.KEYHELP) HW.widgets.KEYHELP[EQK] = ['Type the whole equation with the <b>=</b> key, e.g. ' + HW.k('y=2x-4') + ' or ' + HW.k('y=\\frac{1}{2}x+3') + ' (use the fraction key).', 'Type the whole equation, e.g. <code>y = 2x - 4</code> or <code>y = 1/2x + 3</code>.'];
  }
  function linCoefs(resp) {
    var s = strip(resp).replace(/\\cdot|\\times/g, '*'), parts = s.split('=');
    if (parts.length > 2 || !parts[0].trim() || (parts.length === 2 && !parts[1].trim())) return { err: 'unreadable' };
    var L = ex.parse(parts[0].trim()), R = parts.length === 2 ? ex.parse(parts[1].trim()) : null;
    if (!L.ok || (R && !R.ok)) return { err: 'unreadable' };
    var f = function (x, y) { var env = { x: x, y: y }; return ex.value(L.ast, env) - (R ? ex.value(R.ast, env) : 0); };
    var C = f(0, 0), A = f(1, 0) - C, Bc = f(0, 1) - C;
    if (![A, Bc, C].every(isFinite)) return { err: 'var' };
    var pts = [[2.5, -1.5], [-3.25, 4.75], [7, 3]];
    for (var i = 0; i < pts.length; i++) { var v = f(pts[i][0], pts[i][1]), w = A * pts[i][0] + Bc * pts[i][1] + C; if (!isFinite(v) || Math.abs(v - w) > 1e-7 * (1 + Math.abs(w))) return { err: 'nonlinear' }; }
    var ymx = !!R && /^y$/.test(parts[0].replace(/\s/g, '')) && !/y/.test(parts[1]);
    return { A: A, B: Bc, C: C, eq: !!R, ymx: ymx };
  }
  function propLine(c, T) {
    if (same(c.A, 0) && same(c.B, 0)) return false;
    var e = 1e-7 * (1 + Math.abs(c.A) + Math.abs(c.B) + Math.abs(c.C)) * (1 + Math.abs(T[0]) + Math.abs(T[1]) + Math.abs(T[2]));
    return Math.abs(c.A * T[1] - c.B * T[0]) < e && Math.abs(c.A * T[2] - c.C * T[0]) < e && Math.abs(c.B * T[2] - c.C * T[1]) < e;
  }
  /* the line y = mx + b (m a number); a, b0 = its intercepts (a may be null) */
  function ymxbChk(m, b, o) {
    o = o || {};
    var T = [m, -1, b];
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Type the equation of the line, like ' + t('y=2x-4') + '.');
      if (strip(s).indexOf('=') < 0) return form('eq-no-equals', 'Write a full <b>equation</b>, starting with ' + t('y=') + ', like ' + t('y=2x-4') + '.');
      var c = linCoefs(s);
      if (c.err === 'nonlinear') return wrong('eq-not-line', 'That equation isn’t a straight line (check for a square or a product of variables).');
      if (c.err) return form('eq-unreadable', 'I can’t read that equation. Use only ' + t('x') + ', ' + t('y') + ' and numbers, like ' + t('y=\\frac{1}{2}x-3') + '.');
      if (same(c.B, 0)) return wrong('eq-not-line', 'Your equation has no ' + t('y') + ' in it. Write it as ' + t('y=mx+b') + '.');
      if (propLine(c, T)) return c.ymx ? ok() : form('u5l4-not-ymxb', 'Right line — now write it in the form ' + t('y=mx+b') + ', with ' + t('y') + ' alone on the left.');
      var cm = -c.A / c.B, cb = -c.C / c.B;
      if (o.diag) { var h = o.diag(cm, cb); if (h) return wrong(h.code, h.hint); }
      if (same(cm, m) && !same(cb, b)) {
        if (o.xi != null && same(cb, o.xi)) return wrong('eq-b-xint', t('b') + ' is the <b>' + t('y') + '-intercept</b>, ' + t(vt(b)) + ' — not the ' + t('x') + '-intercept.');
        return wrong('eq-const', 'The number in front of ' + t('x') + ' is right, but ' + t('b') + ' should be the ' + t('y') + '-intercept, ' + t(vt(b)) + '.');
      }
      if (same(cb, b) && same(cm, -m)) return wrong('eq-slope-sign', 'Right ' + t('b') + '. Check the sign of ' + t('m') + ': substitute the ' + t('x') + '-intercept point and solve ' + t('0=m(' + vt(o.xi) + ')' + sg(b)) + '.');
      if (same(cb, b) && !same(m, 0) && same(cm, 1 / m)) return wrong('eq-slope-flip', 'Right ' + t('b') + ', but ' + t('m') + ' is upside down. Solve ' + t('0=m(' + vt(o.xi) + ')' + sg(b)) + ' for ' + t('m') + '.');
      if (same(cb, b)) return wrong('eq-const', 'Right ' + t('b') + '. Now find ' + t('m') + ': substitute the ' + t('x') + '-intercept point, ' + t(ptT([o.xi, 0])) + ', and solve for ' + t('m') + '.');
      return wrong('value', null);
    };
  }
  function ymxbPart(prompt, m, b, xi, sol, hints, text, o) {
    o = o || {}; o.xi = xi;
    var key = mxb(fracOf(m), b);
    var p = { prompt: prompt, input: { type: 'math', keys: HW.widgets && HW.widgets.KEYSETS && HW.widgets.KEYSETS[EQK] ? EQK : 'expr', placeholder: 'e.g. y = 2x - 4' }, check: ymxbChk(m, b, o), key: key, answer: t(key), solution: sol, hints: hints || [], text: text };
    p.bad = [mxb(fracOf(-m || 1), b), mxb(fracOf(m), -b || 1)].filter(function (k) { return k !== key; });
    return p;
  }
  function backSol(a, b) { // working backwards from intercepts a (x) and b (y)
    var m = -b / a;
    return t('b') + ' is the ' + t('y') + '-intercept: ' + t('b=' + b) + ', so ' + t('y=mx' + sg(b)) + '.<br>The ' + t('x') + '-intercept point ' + t(ptT([a, 0])) + ' is on the line: ' + t('0=m(' + vt(a) + ')' + sg(b)) + ', so ' + t(vt(a) + 'm=' + vt(-b)) + ' and ' + t('m=' + vt(m)) + '.<br>The line is ' + t(mxb(fracOf(m), b)) + '. Check: ' + t('x=' + vt(a)) + ' gives ' + t('y=' + vt(m * a + b)) + ' ✓.';
  }
  var HBACK = ['In ' + t('y=mx+b') + ', ' + t('b') + ' is the ' + t('y') + '-intercept. Write ' + t('y=mx+b') + ' with that number for ' + t('b') + '.',
    'The ' + t('x') + '-intercept point ' + t('(a,\\ 0)') + ' is on the line: substitute ' + t('x=a') + ' and ' + t('y=0') + ', then solve for ' + t('m') + '.'];

  /* ================= assignment helpers ================= */
  /* a parabola y = a(x − p)(x − q) with two integer x-intercepts and an integer y-intercept inside the window */
  function parabola(r) {
    return pickWhere(function () {
      if (r.chance(0.2)) return { a: 0.25, p: -4, q: 4 };
      var p = -r.int(1, 5), q = r.int(1, 5), a = r.pick([0.25, 0.5, 1, -0.25, -0.5, -1]);
      if (r.chance(0.25)) { var w = r.int(1, 5); p = -w; q = r.pick([-w + r.int(1, 3), w]); }
      return { a: a, p: p, q: q };
    }, function (o) {
      var c = o.a * o.p * o.q, v = (o.p + o.q) / 2, k = o.a * (v - o.p) * (v - o.q);
      return o.p !== o.q && Math.abs(c - Math.round(c)) < 1e-9 && c !== 0 && Math.abs(c) <= 6 && Math.abs(k) <= 6.5 && Math.abs(k) >= 2 && o.p !== 0 && o.q !== 0;
    });
  }

  HW.defineLesson({
    id: 'u5l4', unit: 5, num: 4, title: 'Where Graphs Meet the Axes: x- and y-Intercepts', outcome: 'RF5',
    blurb: 'Reading the points where a graph crosses each axis, from graphs, tables, and real situations: an x-intercept is (a, 0), a y-intercept is (0, b).',
    questions: [
      /* ---------------- Question 1: fill in the blanks ---------------- */
      { num: '1', section: 'Part A — Reading Intercepts from Graphs', stem: 'Fill in each blank.', parts: [
        { id: '1a', level: 'LIM', make: function (r) {
          var k = r.pick([5, 5].concat(pm(1, 9)));
          return numPart('At an ' + t('x') + '-intercept, the value of ' + t('y') + ' is ________.<br><span class="muted">For example, a graph crosses the ' + t('x') + '-axis at ' + t('(' + k + ',\\ \\square)') + '.</span>', 0,
            [[k, 'int-gave-x', t(k) + ' is the ' + t('x') + '-coordinate. On the ' + t('x') + '-axis you haven’t moved up or down at all: what is ' + t('y') + '?']],
            'Every point on the ' + t('x') + '-axis has ' + t('y=0') + ', so at an ' + t('x') + '-intercept ' + t('y=0') + ' — for example ' + t('(' + k + ',\\ 0)') + '.', HX, 'x-int: y = 0 (' + k + ')');
        } },
        { id: '1b', level: 'LIM', make: function (r) {
          var k = r.pick([3, 3].concat(pm(1, 9)));
          return numPart('At a ' + t('y') + '-intercept, the value of ' + t('x') + ' is ________.<br><span class="muted">For example, a graph crosses the ' + t('y') + '-axis at ' + t('(\\square,\\ ' + k + ')') + '.</span>', 0,
            [[k, 'int-gave-y', t(k) + ' is the ' + t('y') + '-coordinate. On the ' + t('y') + '-axis you haven’t moved left or right at all: what is ' + t('x') + '?']],
            'Every point on the ' + t('y') + '-axis has ' + t('x=0') + ', so at a ' + t('y') + '-intercept ' + t('x=0') + ' — for example ' + t('(0,\\ ' + k + ')') + '.', HY, 'y-int: x = 0 (' + k + ')');
        } },
        { id: '1c', level: 'BEG', make: function (r) {
          var ex3 = r.sample([-5, -3, -2, -1, 1, 2, 3, 4, 6, 7], 2).concat([r.pick([0.5, 2.5, -1.5])]);
          return mcPart(r, 'An ' + t('x') + '-intercept has the form ' + t('(\\square,\\ 0)') + '. What can go in the box?', [
            { html: '<b>Any number</b> — for example ' + ex3.map(function (v) { return t('(' + nT(v) + ',\\ 0)'); }).join(', ') + ' and ' + t('(0,\\ 0)') + ' are all on the ' + t('x') + '-axis.', right: true },
            { html: 'Only ' + t('0') + '.', why: 'The ' + t('0') + ' is already in the second spot. The first number tells how far left or right the graph crosses — it can be any number.' },
            { html: 'Only positive numbers.', why: 'A graph can cross the ' + t('x') + '-axis to the left of the origin too, e.g. at ' + t('(' + -Math.abs(ex3[0]) + ',\\ 0)') + '.' },
            { html: 'Only whole numbers.', why: 'A graph can cross the ' + t('x') + '-axis between grid lines too, e.g. at ' + t('(2.5,\\ 0)') + '.' }],
            'Any point ' + t('(a,\\ 0)') + ' is on the ' + t('x') + '-axis, whatever ' + t('a') + ' is — positive, negative, zero, or a fraction. So the box can hold <b>any number</b>.', ['Picture the ' + t('x') + '-axis: which points on it have a ' + t('0') + ' in the second spot?'], 'x-int form (a, 0)');
        } },
        { id: '1d', level: 'BEG', make: function (r) {
          var ex3 = r.sample([-6, -4, -2, -1, 1, 2, 3, 5, 8], 2).concat([r.pick([0.5, -2.5, 1.5])]);
          return mcPart(r, 'A ' + t('y') + '-intercept has the form ' + t('(0,\\ \\square)') + '. What can go in the box?', [
            { html: '<b>Any number</b> — for example ' + ex3.map(function (v) { return t('(0,\\ ' + nT(v) + ')'); }).join(', ') + ' and ' + t('(0,\\ 0)') + ' are all on the ' + t('y') + '-axis.', right: true },
            { html: 'Only ' + t('0') + '.', why: 'The ' + t('0') + ' is already in the first spot. The second number tells how far up or down the graph crosses — it can be any number.' },
            { html: 'Only positive numbers.', why: 'A graph can cross the ' + t('y') + '-axis below the origin too, e.g. at ' + t('(0,\\ ' + -Math.abs(ex3[0]) + ')') + '.' },
            { html: 'Only the same number as the ' + t('x') + '-intercept.', why: 'The two intercepts are usually different numbers — they are on different axes.' }],
            'Any point ' + t('(0,\\ b)') + ' is on the ' + t('y') + '-axis, whatever ' + t('b') + ' is. So the box can hold <b>any number</b>.', ['Picture the ' + t('y') + '-axis: which points on it have a ' + t('0') + ' in the first spot?'], 'y-int form (0, b)');
        } }] },
      /* ---------------- Questions 2–3: one intercept read off a line ---------------- */
      { num: '2', stem: 'State the ' + t('x') + '-intercept of each graph.', parts: [
        { id: '2a', level: 'BEG', make: function (r) {
          var ab = abLine(r, 1, 1, [2, 4]), a = ab[0], b = ab[1];
          return interceptsPart(lineG([a, 0], [0, b]), [a], [b], { only: 'x', none: false, hints: HX, text: 'read x-int ' + a + ',' + b,
            sol: 'The line meets the ' + t('x') + '-axis at ' + t(a) + ' (where ' + t('y=0') + '). The ' + t('x') + '-intercept is ' + t(ptT([a, 0])) + '.' });
        } },
        { id: '2b', level: 'BEG', make: function (r) {
          var ab = abLine(r, -1, 1, [-3, 3]), a = ab[0], b = ab[1];
          return interceptsPart(lineG([a, 0], [0, b]), [a], [b], { only: 'x', none: false, hints: HX, text: 'read x-int ' + a + ',' + b,
            sol: 'The line meets the ' + t('x') + '-axis at ' + t(a) + ', to the left of the origin. The ' + t('x') + '-intercept is ' + t(ptT([a, 0])) + '.' });
        } }] },
      { num: '3', stem: 'State the ' + t('y') + '-intercept of each graph.', parts: [
        { id: '3a', level: 'BEG', make: function (r) {
          var o = r.chance(0.25) ? [1, 1] : pickWhere(function () { return [r.pick([1, 2, 3, -1, -2, -3, 0.5, -0.5]), r.int(1, 5)]; }, function (z) { var xi = -z[1] / z[0]; return Math.abs(xi) <= 5.5; }), m = o[0], b = o[1];
          return interceptsPart(lineG([0, b], [1, b + m]), [-b / m], [b], { only: 'y', none: false, hints: HY, text: 'read y-int ' + m + ',' + b,
            sol: 'The line meets the ' + t('y') + '-axis at ' + t(b) + ' (where ' + t('x=0') + '). The ' + t('y') + '-intercept is ' + t(ptT([0, b])) + '.' });
        } },
        { id: '3b', level: 'BEG', make: function (r) {
          var o = r.chance(0.25) ? [1, -2] : pickWhere(function () { return [r.pick([1, 2, 3, -1, -2, -3, 0.5, -0.5]), -r.int(1, 5)]; }, function (z) { var xi = -z[1] / z[0]; return Math.abs(xi) <= 5.5; }), m = o[0], b = o[1];
          return interceptsPart(lineG([0, b], [1, b + m]), [-b / m], [b], { only: 'y', none: false, hints: HY, text: 'read y-int ' + m + ',' + b,
            sol: 'The line meets the ' + t('y') + '-axis at ' + t(b) + ', below the origin. The ' + t('y') + '-intercept is ' + t(ptT([0, b])) + '.' });
        } }] },
      /* ---------------- Question 4: both intercepts of a line ---------------- */
      { num: '4', stem: 'The graph shows a line. State the ' + t('x') + '-intercept and the ' + t('y') + '-intercept.', parts: [
        { id: '4', level: 'BEG', make: function (r) {
          var sa = r.chance(0.5) ? 1 : -1, sb = r.chance(0.6) ? -sa : sa, ab = abLine(r, sa, sb, [2, -4]), a = ab[0], b = ab[1];
          return interceptsPart(lineG([a, 0], [0, b]), [a], [b], { none: false, text: 'read both ints ' + a + ',' + b,
            sol: 'The line meets the ' + t('x') + '-axis at ' + t(a) + ' and the ' + t('y') + '-axis at ' + t(b) + '.<br>' + t('x') + '-intercept ' + t(ptT([a, 0])) + ', ' + t('y') + '-intercept ' + t(ptT([0, b])) + '.' });
        } }] },
      /* ---------------- Question 5: a curve with two x-intercepts ---------------- */
      { num: '5', stem: 'The curve crosses the ' + t('x') + '-axis at two points and the ' + t('y') + '-axis at one point. State all three intercepts.', parts: [
        { id: '5', level: 'EMG', make: function (r) {
          var o = parabola(r), a = o.a, p = o.p, q = o.q, c = a * p * q, f = function (x) { return a * (x - p) * (x - q); };
          var v = (p + q) / 2, k = f(v), lo = Math.floor(Math.min(0, k, c) - 1.5), hi = Math.ceil(Math.max(0, k, c) + 1.5);
          while (hi - lo < 10) { if (a > 0) hi++; else lo--; }
          var Y = [lo, hi];
          var g = HW.graph({ x: [-6, 6], y: Y, labels: 1, max: 300, fns: [{ f: f, from: -6, to: 6, start: 'arrow', end: 'arrow' }], aria: 'curve' });
          return interceptsPart(g, [p, q], [c], { none: false, text: 'curve ints ' + p + ',' + q + ',' + c, xMiss: 'This curve crosses the ' + t('x') + '-axis <b>twice</b>. Type both points, with a comma between them.',
            sol: 'The curve meets the ' + t('x') + '-axis at ' + t(p) + ' and at ' + t(q) + ', and the ' + t('y') + '-axis at ' + t(c) + '.<br>' + t('x') + '-intercepts ' + t(ptsT([[p, 0], [q, 0]])) + '; ' + t('y') + '-intercept ' + t(ptT([0, c])) + '.',
            hints: ['Look for <b>every</b> place the curve touches the ' + t('x') + '-axis — there are two.', 'Type both ' + t('x') + '-intercepts in the first box, like ' + t('(-2,\\ 0),\\ (3,\\ 0)') + '.'],
            bad: [[ptKey([p, 0]) + ', ' + ptKey([q, 0]) + ', ' + ptKey([0, c]), ptKey([0, c])], [ptKey([v, 0]), ptKey([0, c])]] });
        } }] },
      /* ---------------- Questions 6–7: tables ---------------- */
      { num: '6', section: 'Part B — Intercepts from Tables, and Key Facts', stem: 'The table shows several points on a relation. State the ' + t('x') + '-intercept and the ' + t('y') + '-intercept.', parts: [
        { id: '6', level: 'BEG', make: function (r) {
          var o = r.chance(0.25) ? { m: 1, root: -1, s: -3 } : pickWhere(function () { var root = r.pick(pm(1, 3)); return { m: r.pick([1, 1, 2, -1, -2, 3]), root: root, s: r.int(-4, 0) }; }, function (z) { return z.s <= Math.min(0, z.root) && z.s + 4 >= Math.max(0, z.root); });
          var m = o.m, b = -m * o.root, xs = range(o.s, o.s + 4), f = function (x) { return m * x + b; };
          var tab = HW.valueTable([[t('x')].concat(xs.map(function (x) { return t(x); })), [t('y')].concat(xs.map(function (x) { return t(f(x)); }))]);
          return interceptsPart(tab, [o.root], [b], { none: false, text: 'table ints ' + m + ',' + b,
            sol: 'The column where ' + t('y=0') + ' is ' + t('x=' + o.root) + ': the ' + t('x') + '-intercept is ' + t(ptT([o.root, 0])) + '.<br>The column where ' + t('x=0') + ' has ' + t('y=' + b) + ': the ' + t('y') + '-intercept is ' + t(ptT([0, b])) + '.',
            hints: ['Find the column where ' + t('y=0') + ' — that point is the ' + t('x') + '-intercept.', 'Find the column where ' + t('x=0') + ' — that point is the ' + t('y') + '-intercept.'] });
        } }] },
      { num: '7', stem: 'The table shows several points on a relation, listed <b>out of order</b>. State the ' + t('x') + '-intercept and the ' + t('y') + '-intercept.', parts: [
        { id: '7', level: 'EMG', make: function (r) {
          var bk = r.chance(0.25), m = bk ? 3 : r.pick([2, 3, 4, -2, -3, 3]), root = bk ? 2 : r.pick([1, 2, 3, -1, -2, 2]), b = -m * root;
          var xs = bk ? [2, -1, 4, 0, 3] : (function () { var others = r.sample(range(-3, 5).filter(function (x) { return x !== 0 && x !== root; }), 3); var a = [root, 0].concat(others); var s; do { s = r.shuffle(a); } while (s.join() === s.slice().sort(function (p, q) { return p - q; }).join() || s[0] === 0); return s; })();
          var f = function (x) { return m * x + b; };
          var tab = HW.valueTable([[t('x')].concat(xs.map(function (x) { return t(x); })), [t('y')].concat(xs.map(function (x) { return t(f(x)); }))]);
          return interceptsPart(tab, [root], [b], { none: false, text: 'unordered table ' + m + ',' + b,
            xDiag: function (A) { if (A.length === 1 && same(A[0][1], 0) && same(A[0][0], xs[0]) && xs[0] !== root) return { code: 'value', hint: 'Don’t just take the first column. Look along the ' + t('y') + '-row for the ' + t('0') + ' — that column is the ' + t('x') + '-intercept.' }; return null; },
            sol: 'Look for the ' + t('0') + 's. The column with ' + t('y=0') + ' has ' + t('x=' + root) + ': ' + t('x') + '-intercept ' + t(ptT([root, 0])) + '.<br>The column with ' + t('x=0') + ' has ' + t('y=' + b) + ': ' + t('y') + '-intercept ' + t(ptT([0, b])) + '.<br>The order of the columns doesn’t matter.',
            hints: ['The order doesn’t matter: just look for the column with ' + t('y=0') + ' and the column with ' + t('x=0') + '.'] });
        } }] },
      /* ---------------- Question 8: True or False ---------------- */
      { num: '8', stem: 'State whether each sentence is <b>True</b> or <b>False</b>.', parts: [
        { id: '8a', level: 'LIM', make: function (r) {
          var v = r.chance(0.6);
          return B.tf(r, v ? 'At an ' + t('x') + '-intercept, the ' + t('y') + '-coordinate is always ' + t('0') + '.' : 'At a ' + t('y') + '-intercept, the ' + t('x') + '-coordinate is always ' + t('0') + '.', true,
            v ? 'Every point on the ' + t('x') + '-axis, like ' + t('(4,\\ 0)') + ', has ' + t('y=0') + '.' : 'Every point on the ' + t('y') + '-axis, like ' + t('(0,\\ 4)') + ', has ' + t('x=0') + '.',
            '<b>True.</b> ' + (v ? 'An ' + t('x') + '-intercept is on the ' + t('x') + '-axis, and every point there has ' + t('y=0') + ': ' + t('(a,\\ 0)') + '.' : 'A ' + t('y') + '-intercept is on the ' + t('y') + '-axis, and every point there has ' + t('x=0') + ': ' + t('(0,\\ b)') + '.'),
            [v ? HX[0] : HY[0]], 'TF 8a');
        } },
        { id: '8b', level: 'BEG', make: function (r) {
          var v = r.chance(0.6);
          return B.tf(r, v ? 'At a ' + t('y') + '-intercept, the ' + t('y') + '-coordinate is always ' + t('0') + '.' : 'At an ' + t('x') + '-intercept, the ' + t('x') + '-coordinate is always ' + t('0') + '.', false,
            v ? 'A ' + t('y') + '-intercept like ' + t('(0,\\ 5)') + ' has ' + t('x=0') + ' — its ' + t('y') + '-coordinate can be any number.' : 'An ' + t('x') + '-intercept like ' + t('(5,\\ 0)') + ' has ' + t('y=0') + ' — its ' + t('x') + '-coordinate can be any number.',
            '<b>False.</b> ' + (v ? 'At a ' + t('y') + '-intercept the <b>' + t('x') + '</b>-coordinate is ' + t('0') + ', e.g. ' + t('(0,\\ 5)') + '.' : 'At an ' + t('x') + '-intercept the <b>' + t('y') + '</b>-coordinate is ' + t('0') + ', e.g. ' + t('(5,\\ 0)') + '.'),
            ['Which axis is the intercept on? Which coordinate is ' + t('0') + ' on that axis?'], 'TF 8b');
        } },
        { id: '8c', level: 'BEG', make: function (r) {
          return B.tf(r, 'A graph can have more than one ' + t('x') + '-intercept.', true, 'Look back at Question 5: that curve crosses the ' + t('x') + '-axis twice.',
            '<b>True.</b> A curve can cross the ' + t('x') + '-axis several times — the curve in Question 5 has two ' + t('x') + '-intercepts.', ['Think of the curve in Question 5.'], 'TF 8c');
        } },
        { id: '8d', level: 'EMG', make: function (r) {
          return B.tf(r, t('(0,\\ 0)') + ' could be both the ' + t('x') + '- and the ' + t('y') + '-intercept of a graph.', true, 'The origin is on both axes. A line through the origin, like ' + t('y=2x') + ', meets both axes there.',
            '<b>True.</b> The origin ' + t('(0,\\ 0)') + ' is on the ' + t('x') + '-axis <b>and</b> on the ' + t('y') + '-axis, so a graph through the origin has it as both intercepts.', ['Which axis is the point ' + t('(0,\\ 0)') + ' on?'], 'TF 8d');
        } },
        { id: '8e', level: 'BEG', make: function (r) {
          var k = r.pick([5, 5, 2, 3, 4, 6, 7, 8, -3, -4]), v = r.chance(0.6);
          return B.tf(r, v ? 'If a graph passes through ' + t('(' + k + ',\\ 0)') + ', then ' + t(k) + ' is the ' + t('y') + '-intercept.' : 'If a graph passes through ' + t('(0,\\ ' + k + ')') + ', then ' + t(k) + ' is the ' + t('x') + '-intercept.', false,
            v ? t('(' + k + ',\\ 0)') + ' has ' + t('y=0') + ', so it is on the ' + t('x') + '-axis: it is an <b>' + t('x') + '</b>-intercept.' : t('(0,\\ ' + k + ')') + ' has ' + t('x=0') + ', so it is on the ' + t('y') + '-axis: it is a <b>' + t('y') + '</b>-intercept.',
            '<b>False.</b> ' + (v ? t('(' + k + ',\\ 0)') + ' is on the ' + t('x') + '-axis, so it is an ' + t('x') + '-intercept, not the ' + t('y') + '-intercept.' : t('(0,\\ ' + k + ')') + ' is on the ' + t('y') + '-axis, so it is a ' + t('y') + '-intercept, not the ' + t('x') + '-intercept.'),
            ['Which coordinate of the point is ' + t('0') + '? Which axis does that put it on?'], 'TF 8e');
        } }] },
      /* ---------------- Question 9: candle (table) ---------------- */
      { num: '9', section: 'Part C — Applications', shared: function (r) {
          if (r.chance(0.25)) return { rate: 2, s: 2, H: 20, T: 10, tc: 5 };
          var o = pickWhere(function () { return { s: r.pick([2, 3]), n: r.pick([4, 5, 5, 6]), rate: r.int(1, 5) }; }, function (z) { var H = z.rate * z.n * z.s; return H >= 10 && H <= 80; });
          var T = o.n * o.s, tc = r.pick(range(1, T - 1).filter(function (x) { return x % o.s; }));
          return { rate: o.rate, s: o.s, n: o.n, H: o.rate * T, T: T, tc: tc };
        },
        stem: function (o) {
          var ts = range(0, o.n || 5).map(function (i) { return i * o.s; });
          return 'A candle is ' + t(o.H) + ' cm tall and burns down at a constant rate of ' + t(o.rate) + ' cm per hour. The table shows the height, ' + t('h') + ' cm, of the candle after ' + t('t') + ' hours.' +
            HW.valueTable([[t('t') + ' (h)'].concat(ts.map(function (x) { return t(x); })), [t('h') + ' (cm)'].concat(ts.map(function (x) { return t(o.H - o.rate * x); }))]);
        },
        parts: [
          { id: '9a', sub: 'a', level: 'BEG', make: function (r, o) {
            return interceptsPart('What is the ' + t('y') + '-intercept (the height-intercept, on the ' + t('h') + '-axis)? Write it as an ordered pair ' + t('(t,\\ h)') + '.', [o.T], [o.H], { only: 'y', none: false, names: { x: 't', y: 'h' }, text: 'candle h-int',
              sol: 'The height-intercept is where ' + t('t=0') + ': the first column of the table, ' + t('h=' + o.H) + '. It is ' + t(ptT([0, o.H])) + '.', hints: ['On the ' + t('h') + '-axis, ' + t('t=0') + '. Which column of the table has ' + t('t=0') + '?'] });
          } },
          { id: '9a2', sub: 'a, meaning', level: 'BEG', make: function (r, o) {
            return mcPart(r, 'What does the height-intercept ' + t(ptT([0, o.H])) + ' represent?', [
              { html: 'The candle’s starting height: ' + t(o.H) + ' cm before it has burned at all.', right: true },
              { html: 'How fast the candle burns.', why: 'The burn rate is ' + t(o.rate) + ' cm per hour — how much the height drops each hour. At ' + t(ptT([0, o.H])) + ', no time has passed.' },
              { html: 'The time when the candle burns out.', why: 'Burned out means ' + t('h=0') + ' — that is the time-intercept. Here ' + t('t=0') + '.' },
              { html: 'The height after ' + t('1') + ' hour.', why: 'In ' + t(ptT([0, o.H])) + ', the first number is the time: ' + t('t=0') + ', not ' + t('1') + '.' }],
              'At ' + t('t=0') + ' no time has passed, so ' + t(ptT([0, o.H])) + ' is the candle’s <b>starting height</b>, ' + t(o.H) + ' cm.', ['In ' + t('(t,\\ h)') + ', what is the time at this point?'], 'candle h-int meaning');
          } },
          { id: '9b', sub: 'b', level: 'BEG', make: function (r, o) {
            return interceptsPart('What is the ' + t('x') + '-intercept (the time-intercept, on the ' + t('t') + '-axis)? Write it as an ordered pair ' + t('(t,\\ h)') + '.', [o.T], [o.H], { only: 'x', none: false, names: { x: 't', y: 'h' }, text: 'candle t-int',
              sol: 'The time-intercept is where ' + t('h=0') + ': the last column of the table, ' + t('t=' + o.T) + '. It is ' + t(ptT([o.T, 0])) + '.', hints: ['On the ' + t('t') + '-axis, ' + t('h=0') + '. Which column of the table has ' + t('h=0') + '?'] });
          } },
          { id: '9b2', sub: 'b, meaning', level: 'BEG', make: function (r, o) {
            return mcPart(r, 'What does the time-intercept ' + t(ptT([o.T, 0])) + ' represent?', [
              { html: 'After ' + t(o.T) + ' hours the candle is completely burned out (its height is ' + t('0') + ').', right: true },
              { html: 'The candle is ' + t(o.T) + ' cm tall at the start.', why: 'The start is the height-intercept, ' + t(o.H) + ' cm. Here the height is ' + t('0') + '.' },
              { html: 'The candle burns ' + t(o.T) + ' cm every hour.', why: 'It burns ' + t(o.rate) + ' cm per hour. The ' + t(o.T) + ' here is a time.' },
              { html: 'The moment the candle is lit.', why: 'The candle is lit at ' + t('t=0') + '. At this point the height is ' + t('0') + '.' }],
              'At ' + t(ptT([o.T, 0])) + ' the height is ' + t('0') + ' cm: the candle is <b>completely burned out</b> after ' + t(o.T) + ' hours.', ['In ' + t('(t,\\ h)') + ', what is the height at this point?'], 'candle t-int meaning');
          } },
          { id: '9c', sub: 'c', level: 'EMG', make: function (r, o) {
            var x = o.tc, h = o.H - o.rate * x;
            return numPart('Using the burn rate, determine the height of the candle after ' + t(x) + ' hours.', h, [[o.rate * x, 'ctx-used', t(o.rate * x) + ' cm is how much has <b>burned</b>. How much is <b>left</b>?'], [o.H + o.rate * x, 'ctx-added', 'The candle gets shorter: subtract.'], [o.H - o.rate, 'ctx-rate', 'That is the height after only ' + t('1') + ' hour.']],
              'In ' + t(x) + ' hours it burns ' + t(o.rate + '\\times ' + x + '=' + o.rate * x) + ' cm, so ' + t('h=' + o.H + '-' + o.rate * x + '=' + h) + ' cm.', ['Each hour the candle loses ' + t(o.rate) + ' cm. How much does it lose in ' + t(x) + ' hours?', 'Subtract that from the starting height, ' + t(o.H) + ' cm.'], 'candle after ' + x, { after: 'cm' });
          } },
          { id: '9d', sub: 'd', level: 'EMG', outcome: 'RF4', make: function (r, o) {
            return mcPart(r, 'Is this relation linear or nonlinear? How do you know?', [
              { html: '<b>Linear:</b> the height drops by the same amount (' + t(o.rate * o.s) + ' cm) every ' + t(o.s) + ' hours — a constant rate of change.', right: true },
              { html: '<b>Linear:</b> the height keeps going down.', why: 'Going down isn’t enough — a curve can go down too. Linear means it changes by the <b>same amount</b> each step.' },
              { html: '<b>Nonlinear:</b> the height reaches ' + t('0') + '.', why: 'A line can reach ' + t('0') + ' too. Look at how much the height changes from one column to the next.' },
              { html: '<b>Nonlinear:</b> the candle stops burning at ' + t('t=' + o.T) + '.', why: 'Where the graph stops doesn’t decide its shape. Look at the change in the height each step.' }],
              '<b>Linear.</b> In the table the height drops by ' + t(o.rate * o.s) + ' cm every ' + t(o.s) + ' hours (' + t(o.rate) + ' cm each hour) — always the same amount, so the points lie on a straight line.', ['By how much does ' + t('h') + ' change from one column to the next?'], 'candle linear?');
          } }] },
      /* ---------------- Question 10: road trip (graph) ---------------- */
      { num: '10', shared: function (r) {
          var o = r.chance(0.25) ? { T: 6, step: 50 } : pickWhere(function () { return { T: r.pick([4, 5, 6, 8]), step: r.pick([25, 40, 50, 60, 75, 100]) }; }, function (z) { return z.T * z.step <= 600 && z.T * z.step >= 150; });
          o.D0 = o.T * o.step;
          var mids = range(1, o.T - 1), bk = o.T === 6 && o.step === 50 && r.chance(0.5);
          o.t1 = bk ? 2 : r.pick(mids);
          o.t2 = bk ? 4 : r.pick(mids.filter(function (k) { return k !== o.t1; }));
          o.Dd = o.D0 - o.step * o.t2;
          return o;
        },
        stem: function (o) {
          return 'Priya is on a road trip. The graph shows the distance remaining, ' + t('D') + ' km, until she reaches her destination, after ' + t('t') + ' hours of driving.' +
            HW.graph({ x: [0, o.T + 1], y: [0, o.D0 + o.step], gridY: o.step, labelsX: 1, labelsY: o.step * (o.T > 6 ? 2 : 1), firstQuadrant: true, unitX: 280 / (o.T + 1), unitY: 220 / (o.D0 + o.step), xName: 't', yName: 'D', xTitle: 'Time, t (hours)', yTitle: 'Distance left, D (km)', max: 360,
              segs: [{ pts: [[0, o.D0], [o.T, 0]] }], aria: 'distance remaining graph' });
        },
        parts: [
          { id: '10a', sub: 'a', level: 'BEG', make: function (r, o) {
            return interceptsPart('What is the ' + t('y') + '-intercept of the graph (on the ' + t('D') + '-axis)? Write it as an ordered pair ' + t('(t,\\ D)') + '.', [o.T], [o.D0], { only: 'y', none: false, names: { x: 't', y: 'D' }, text: 'trip D-int',
              sol: 'The graph meets the ' + t('D') + '-axis at ' + t(o.D0) + ': the point ' + t(ptT([0, o.D0])) + '.', hints: ['Where does the line meet the vertical axis? Read the scale carefully: each grid line is ' + t(o.step) + ' km.'] });
          } },
          { id: '10a2', sub: 'a, meaning', level: 'BEG', make: function (r, o) {
            return mcPart(r, 'What does the ' + t('D') + '-intercept ' + t(ptT([0, o.D0])) + ' represent?', [
              { html: 'The total distance of the trip, ' + t(o.D0) + ' km, before any driving.', right: true },
              { html: 'Priya’s speed.', why: 'Her speed is how fast the distance drops each hour (' + t(o.step) + ' km per hour). At ' + t(ptT([0, o.D0])) + ' no time has passed.' },
              { html: 'The time the trip takes.', why: 'The time the trip takes is where ' + t('D=0') + ' — the ' + t('t') + '-intercept.' },
              { html: 'The distance she has already driven.', why: 'The graph shows the distance <b>left</b>. At ' + t('t=0') + ' she has driven nothing, and all ' + t(o.D0) + ' km are left.' }],
              'At ' + t('t=0') + ' Priya hasn’t driven yet, so ' + t(o.D0) + ' km remain: the ' + t('D') + '-intercept is the <b>total length of the trip</b>.', ['At this point, how long has she been driving?'], 'trip D-int meaning');
          } },
          { id: '10b', sub: 'b', level: 'BEG', make: function (r, o) {
            return interceptsPart('What is the ' + t('x') + '-intercept of the graph (on the ' + t('t') + '-axis)? Write it as an ordered pair ' + t('(t,\\ D)') + '.', [o.T], [o.D0], { only: 'x', none: false, names: { x: 't', y: 'D' }, text: 'trip t-int',
              sol: 'The graph meets the ' + t('t') + '-axis at ' + t(o.T) + ': the point ' + t(ptT([o.T, 0])) + '.', hints: ['Where does the line meet the horizontal (time) axis?'] });
          } },
          { id: '10b2', sub: 'b, meaning', level: 'BEG', make: function (r, o) {
            return mcPart(r, 'What does the ' + t('t') + '-intercept ' + t(ptT([o.T, 0])) + ' represent?', [
              { html: 'After ' + t(o.T) + ' hours, ' + t('0') + ' km remain: Priya has arrived.', right: true },
              { html: 'Priya has driven ' + t(o.T) + ' km.', why: 'The ' + t(o.T) + ' is on the time axis: it is ' + t(o.T) + ' <b>hours</b>.' },
              { html: 'Priya stops for a break after ' + t(o.T) + ' hours.', why: 'At this point the distance left is ' + t('0') + '. What does that mean for the trip?' },
              { html: 'The trip is ' + t(o.T) + ' km long.', why: 'The trip’s length is the ' + t('D') + '-intercept, ' + t(o.D0) + ' km. Here ' + t('D=0') + '.' }],
              'At ' + t(ptT([o.T, 0])) + ' the distance remaining is ' + t('0') + ' km, so Priya <b>reaches her destination</b> after ' + t(o.T) + ' hours.', ['What is the distance left at this point?'], 'trip t-int meaning');
          } },
          { id: '10c', sub: 'c', level: 'EMG', outcome: 'RF1', make: function (r, o) {
            var x = o.t1, D = o.D0 - o.step * x;
            return numPart('Use the graph to estimate the distance remaining after ' + t(x) + ' hours.', D, [[o.step * x, 'ctx-used', t(o.step * x) + ' km is how far she has <b>driven</b>. The graph shows the distance <b>left</b>: read the height of the line at ' + t('t=' + x) + '.'], [o.D0 - o.step * (o.T - x), 'u5l4-time-left', 'Check where you started: go to ' + t('t=' + x) + ' on the time axis, then straight up to the line.']],
              'Go up from ' + t('t=' + x) + ' to the line, then across to the ' + t('D') + '-axis: about ' + t(D) + ' km remain.', ['Find ' + t(x) + ' on the time axis, go straight up to the line, then across to read ' + t('D') + '.', 'Each grid line on the ' + t('D') + '-axis is ' + t(o.step) + ' km.'], 'trip D at ' + x, { after: 'km' });
          } },
          { id: '10d', sub: 'd', level: 'PRG', outcome: 'RF1', make: function (r, o) {
            var x = o.t2;
            return numPart('Use the graph to estimate after how many hours only ' + t(o.Dd) + ' km remain.', x, [[o.T - x, 'u5l4-time-left', 'That is how long she still has to drive. Start at ' + t(o.Dd) + ' km on the ' + t('D') + '-axis, go across to the line, then down to the time axis.'], [o.Dd, 'ctx-eval', 'The answer is a time (hours). Go across from ' + t(o.Dd) + ' km to the line, then down.']],
              'Go across from ' + t('D=' + o.Dd) + ' to the line, then down to the time axis: about ' + t(x) + ' hours.', ['Start on the ' + t('D') + '-axis at ' + t(o.Dd) + ', go across to the line, then straight down.'], 'trip t for ' + o.Dd, { after: 'h' });
          } }] },
      /* ---------------- Questions 11–12: multiple choice ---------------- */
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'BEG', make: function (r) {
          var bk = r.chance(0.25), k = bk ? -3 : r.pick(pm(1, 9)), a = bk ? 7 : r.pick(pm(1, 9)), b = bk ? [2, 5] : [r.pick(pm(1, 6)), r.pick(pm(1, 6))], d = bk ? -1 : r.pick(pm(1, 9).filter(function (z) { return z !== a; }));
          return mcPart(r, 'Which ordered pair could be the ' + t('x') + '-intercept of a graph?', [
            { html: t('(0,\\ ' + a + ')'), why: t('(0,\\ ' + a + ')') + ' has ' + t('x=0') + ': it is on the ' + t('y') + '-axis, so it could be a ' + t('y') + '-intercept.' },
            { html: t('(' + k + ',\\ 0)'), right: true },
            { html: t('(' + b[0] + ',\\ ' + b[1] + ')'), why: 'Neither coordinate is ' + t('0') + ', so ' + t('(' + b[0] + ',\\ ' + b[1] + ')') + ' isn’t on either axis.' },
            { html: t('(0,\\ ' + d + ')'), why: t('(0,\\ ' + d + ')') + ' has ' + t('x=0') + ': it is on the ' + t('y') + '-axis.' }],
            'An ' + t('x') + '-intercept is on the ' + t('x') + '-axis, so its ' + t('y') + '-coordinate is ' + t('0') + ': ' + t('(' + k + ',\\ 0)') + '.', [HX[1]], 'MC x-int', bk);
        } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'BEG', make: function (r) {
          var bk = r.chance(0.25), k = bk ? -9 : r.pick(pm(1, 9)), a = bk ? 6 : r.pick(pm(1, 9)), c = bk ? -2 : r.pick(pm(1, 6)), d = bk ? 4 : r.pick(pm(1, 9).filter(function (z) { return z !== a; }));
          return mcPart(r, 'Which ordered pair could be the ' + t('y') + '-intercept of a graph?', [
            { html: t('(' + a + ',\\ 0)'), why: t('(' + a + ',\\ 0)') + ' has ' + t('y=0') + ': it is on the ' + t('x') + '-axis, so it could be an ' + t('x') + '-intercept.' },
            { html: t('(0,\\ ' + k + ')'), right: true },
            { html: t('(' + c + ',\\ ' + c + ')'), why: 'Neither coordinate is ' + t('0') + ', so ' + t('(' + c + ',\\ ' + c + ')') + ' isn’t on either axis.' },
            { html: t('(' + d + ',\\ 0)'), why: t('(' + d + ',\\ 0)') + ' has ' + t('y=0') + ': it is on the ' + t('x') + '-axis.' }],
            'A ' + t('y') + '-intercept is on the ' + t('y') + '-axis, so its ' + t('x') + '-coordinate is ' + t('0') + ': ' + t('(0,\\ ' + k + ')') + '.', [HY[1]], 'MC y-int', bk);
        } }] },
      { num: '13', stem: function () { return 'A student says, “A straight line can cross the ' + t('x') + '-axis at two different points, just like the curve in Question 5.”'; }, parts: [
        { id: '13', level: 'PRG', make: function (r) {
          return mcPart(r, 'Is the student correct? (Hint: try to draw one.)', [
            { html: '<b>No.</b> A straight line never bends back, so once it has crossed the ' + t('x') + '-axis it keeps going away from it: it can cross at most once (unless the line lies along the ' + t('x') + '-axis itself). Only a curve that turns around can cross twice.', right: true },
            { html: '<b>Yes.</b> Any graph can cross the ' + t('x') + '-axis as often as it likes.', why: 'Try to draw a straight line that crosses the ' + t('x') + '-axis twice. To come back, it would have to bend.' },
            { html: '<b>Yes,</b> if the line is steep enough.', why: 'A steep line crosses the ' + t('x') + '-axis once and then keeps moving away from it. Steepness doesn’t make it come back.' },
            { html: '<b>No,</b> because a straight line never crosses the ' + t('x') + '-axis.', why: 'Most straight lines do cross the ' + t('x') + '-axis — exactly once (Question 4). The question is whether they can cross twice.' }],
            '<b>No.</b> A straight line heads in one direction forever and never turns around, so after it crosses the ' + t('x') + '-axis it keeps moving away from it. A slanted line crosses the ' + t('x') + '-axis exactly once (a horizontal line crosses it never, unless the line lies along the ' + t('x') + '-axis itself); a curve like the one in Question 5 can cross twice because it turns around.',
            ['Try to draw one.', 'Picture a line crossing the ' + t('x') + '-axis. What would it have to do to come back and cross again?'], 'line crosses twice?');
        } }] }
    ],
    extra: EXTRA()
  });

  /* =============================== Extra practice (u5_EP04) =============================== */
  /* both intercepts of a line from its equation, as ordered pairs (exact fractions) */
  function eqInts(eqTex, xi, yi, sol, text, o) {
    o = o || {};
    return interceptsPart(t(eqTex), xi == null ? null : [xi], yi == null ? null : [yi], { none: false, exact: true, text: text, sol: sol, hints: o.hints || HEQ,
      xDiag: function (A) { if (A.length === 1 && same(A[0][1], 0) && yi != null && same(A[0][0], yi) && !same(yi, xi)) return { code: 'int-gave-y', hint: 'That number is the ' + t('y') + '-intercept value. For the ' + t('x') + '-intercept substitute ' + t('y=0') + ' and solve for ' + t('x') + '.' }; return o.xDiag ? o.xDiag(A) : null; },
      yDiag: function (A) { if (A.length === 1 && same(A[0][0], 0) && xi != null && same(A[0][1], xi) && !same(yi, xi)) return { code: 'int-gave-x', hint: 'That number is the ' + t('x') + '-intercept value. For the ' + t('y') + '-intercept substitute ' + t('x=0') + '.' }; return o.yDiag ? o.yDiag(A) : null; } });
  }
  function mxbInts(m, b, text) { // y = mx + b
    var xi = -b / (Array.isArray(m) ? m[0] / m[1] : m), eq = mxb(m, b), mt = Array.isArray(m) ? ex.texRat(ex.norm(m[0], m[1])) : String(m);
    var sol = t('x') + '-intercept, ' + t('y=0') + ': ' + t('0=' + eq.slice(2)) + ', so ' + t((Array.isArray(m) ? '\\left(' + mt + '\\right)' : cTex(m)) + 'x=' + nT(-b)) + ' and ' + t('x=' + vt(xi)) + '. Point ' + t(ptT([xi, 0])) + '.<br>' +
      t('y') + '-intercept, ' + t('x=0') + ': ' + t('y=' + (Array.isArray(m) ? mt : m) + '(0)' + sg(b) + '=' + nT(b)) + '. Point ' + t(ptT([0, b])) + '.';
    var mv = Array.isArray(m) ? m[0] / m[1] : m;
    return eqInts(eq, xi, b, sol, text || 'ints of ' + eq, { xDiag: function (A) {
      if (A.length === 1 && same(A[0][1], 0) && same(A[0][0], b / mv) && !same(b / mv, xi)) return { code: 'int-sign', hint: 'Check the sign: move ' + t(nT(b)) + ' to the other side first, so ' + t(cTex(Array.isArray(m) ? m : mv) + 'x=' + nT(-b)) + '.' };
      if (A.length === 1 && same(A[0][1], 0) && same(A[0][0], -b * mv) && !same(-b * mv, xi)) return { code: 'ctx-mult', hint: 'Divide by the number in front of ' + t('x') + ' — don’t multiply.' };
      if (A.length === 1 && same(A[0][1], 0) && same(A[0][0], -b) && !same(-b, xi)) return { code: 'int-no-divide', hint: 'You have ' + t(cTex(Array.isArray(m) ? m : mv) + 'x=' + nT(-b)) + ' — now divide by the number in front of ' + t('x') + '.' };
      return null; } });
  }
  function gfInts(A, Bc, C, text) { // Ax + By = C
    var xi = C / A, yi = C / Bc, eq = genForm(A, Bc, C);
    var sol = t('x') + '-intercept: cover up the ' + t('y') + '-term (' + t('y=0') + '): ' + t((A === 1 ? '' : A) + 'x=' + C) + ', so ' + t('x=' + vt(xi)) + '. Point ' + t(ptT([xi, 0])) + '.<br>' +
      t('y') + '-intercept: cover up the ' + t('x') + '-term (' + t('x=0') + '): ' + t((Bc === 1 ? '' : Bc === -1 ? '-' : Bc) + 'y=' + C) + ', so ' + t('y=' + vt(yi)) + '. Point ' + t(ptT([0, yi])) + '.';
    return eqInts(eq, xi, yi, sol, text || 'ints of ' + eq, {
      xDiag: function (P) { if (P.length === 1 && same(P[0][1], 0) && same(P[0][0], A / C) && !same(A / C, xi)) return { code: 'ctx-mult', hint: 'Upside down: ' + t(A + 'x=' + C) + ' gives ' + t('x=\\frac{' + C + '}{' + A + '}') + '.' }; if (P.length === 1 && same(P[0][1], 0) && same(P[0][0], C) && !same(C, xi)) return { code: 'int-no-divide', hint: 'You still have to divide by ' + t(A) + '.' }; return null; },
      yDiag: function (P) { if (P.length === 1 && same(P[0][0], 0) && same(P[0][1], -yi)) return { code: 'int-sign', hint: 'Check the sign: ' + t(Bc + 'y=' + C) + ' — dividing by a negative number changes the sign.' }; if (P.length === 1 && same(P[0][0], 0) && same(P[0][1], C) && !same(C, yi)) return { code: 'int-no-divide', hint: 'You still have to divide by ' + t(Bc) + '.' }; if (P.length === 1 && same(P[0][0], 0) && same(P[0][1], Bc) && !same(Bc, yi)) return { code: 'u5l4-coef', hint: t(Bc) + ' is the number in front of ' + t('y') + ', not the intercept. Substitute ' + t('x=0') + ' and solve.' }; return null; } });
  }

  function EXTRA() {
    return [
      /* ---------- Part A: from an equation ---------- */
      { num: '1', section: 'Extra Practice A — Intercepts from an Equation', stem: 'Determine the ' + t('x') + '-intercept and the ' + t('y') + '-intercept of each line. Substitute ' + t('y=0') + ' for the ' + t('x') + '-intercept and ' + t('x=0') + ' for the ' + t('y') + '-intercept. Write every answer as an <b>ordered pair</b>.', parts: [
        { id: 'e1a', level: 'EMG', make: function (r) { var o = r.chance(0.25) ? [3, 4] : [r.int(2, 6), r.int(1, 6)]; return mxbInts(o[0], -o[0] * o[1]); } },
        { id: 'e1b', level: 'EMG', make: function (r) { var o = r.chance(0.25) ? [2, 5] : [r.int(2, 6), r.int(1, 6)]; return mxbInts(-o[0], o[0] * o[1]); } },
        { id: 'e1c', level: 'PRG', make: function (r) { var o = r.chance(0.25) ? [[1, 2], 3] : [r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 2], [3, 4], [2, 5], [5, 2]]), r.int(1, 4)]; return mxbInts(o[0], -o[0][0] * o[1]); } },
        { id: 'e1d', level: 'PRG', make: function (r) { var o = r.chance(0.25) ? [[3, 4], 2] : [r.pick([[3, 4], [1, 2], [2, 3], [3, 2], [1, 3], [5, 2], [1, 4], [2, 5], [4, 3]]), r.int(1, 3)]; var m = o[0]; return mxbInts([-m[0], m[1]], m[0] * o[1]); } }] },
      { num: '2', stem: 'Determine both intercepts. Here the ' + t('x') + '-intercepts are <b>not</b> whole numbers — leave each one as an exact fraction (use the fraction key), not a rounded decimal.', parts: [
        { id: 'e2a', level: 'PRG', make: function (r) { var o = r.chance(0.25) ? [4, -6] : pickWhere(function () { return [r.int(2, 6), -r.int(1, 9)]; }, function (z) { return z[1] % z[0] !== 0; }); return mxbInts(o[0], o[1]); } },
        { id: 'e2b', level: 'PRG', make: function (r) { var o = r.chance(0.25) ? [-5, 2] : pickWhere(function () { return [-r.int(2, 7), r.int(1, 9)]; }, function (z) { return z[1] % z[0] !== 0; }); return mxbInts(o[0], o[1]); } },
        { id: 'e2c', level: 'PRG', make: function (r) { var o = r.chance(0.25) ? [[2, 3], 5] : pickWhere(function () { return [r.pick([[2, 3], [3, 4], [2, 5], [4, 3], [3, 5], [1, 2], [3, 2]]), r.int(1, 9)]; }, function (z) { return (z[1] * z[0][1]) % z[0][0] !== 0; }); return mxbInts(o[0], o[1]); } },
        { id: 'e2d', level: 'PRG', make: function (r) { var o = r.chance(0.25) ? [-6, -9] : pickWhere(function () { return [-r.int(2, 8), -r.int(1, 12)]; }, function (z) { return z[1] % z[0] !== 0; }); return mxbInts(o[0], o[1]); } }] },
      { num: '3', stem: 'An equation in <b>general form</b>, ' + t('Ax+By=C') + ', is quick: covering up one term leaves a one-step equation. Determine both intercepts of each line.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var o = r.chance(0.25) ? [3, 4, 24] : pickWhere(function () { var A = r.int(2, 6), Bc = r.int(2, 6); return [A, Bc, A * Bc * r.int(1, 2)]; }, function (z) { return z[0] !== z[1] && z[2] <= 60; }); return gfInts(o[0], o[1], o[2]); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var o = r.chance(0.25) ? [5, -2, 20] : pickWhere(function () { var A = r.int(2, 6), Bc = r.int(2, 6); return [A, -Bc, A * Bc * r.int(1, 2)]; }, function (z) { return z[0] !== -z[1] && z[2] <= 60; }); return gfInts(o[0], o[1], o[2]); } },
        { id: 'e3c', level: 'EMG', make: function (r) { var o = r.chance(0.25) ? [2, 7, -14] : pickWhere(function () { var A = r.int(2, 7), Bc = r.int(2, 7); return [A, Bc, -A * Bc]; }, function (z) { return z[0] !== z[1]; }); return gfInts(o[0], o[1], o[2]); } },
        { id: 'e3d', level: 'PRG', make: function (r) { var o = r.chance(0.25) ? [6, -5, 9] : pickWhere(function () { return [r.int(2, 8), -r.int(2, 7), r.int(3, 15)]; }, function (z) { return z[2] % z[0] !== 0 && z[2] % z[1] !== 0 && gcd(z[0], z[2]) < z[0]; }); return gfInts(o[0], o[1], o[2]); } }] },
      { num: '4', stem: 'More lines in general form.', parts: [
        { id: 'e4a', sub: 'a', level: 'PRG', make: function (r) { var o = r.chance(0.25) ? [4, 6, 15] : pickWhere(function () { return [r.int(2, 8), r.int(2, 8), r.int(5, 20)]; }, function (z) { return z[0] !== z[1] && z[2] % z[0] !== 0 && z[2] % z[1] !== 0; }); return gfInts(o[0], o[1], o[2]); } },
        { id: 'e4b', sub: 'b', level: 'PRG', make: function (r) { var o = r.chance(0.25) ? [8, -3, 12] : pickWhere(function () { var Bc = r.int(2, 6); return [r.int(3, 9), -Bc, Bc * r.int(2, 5)]; }, function (z) { return z[2] % z[0] !== 0; }); return gfInts(o[0], o[1], o[2]); } },
        { id: 'e4c', sub: 'c', level: 'PRG', make: function (r) {
          var A = r.pick([3, 4, 5]), Bc = r.pick([2, 6, 7]), C = A * Bc * 2, m = r.pick([2, 3]), b = r.pick([6, 8, 12]);
          return mcPart(r, 'Why does finding intercepts from ' + t('Ax+By=C') + ' (like ' + t(genForm(A, Bc, C)) + ') take fewer steps than from ' + t('y=mx+b') + ' (like ' + t('y=' + m + 'x-' + b) + ')?', [
            { html: 'In ' + t('Ax+By=C') + ', setting ' + t('x') + ' or ' + t('y') + ' to ' + t('0') + ' deletes a whole term and leaves one division (' + t(A + 'x=' + C) + '). In ' + t('y=mx+b') + ', the ' + t('x') + '-intercept needs two steps: move ' + t('b') + ' across, then divide.', right: true },
            { html: 'Because ' + t('Ax+By=C') + ' always has whole-number intercepts.', why: 'Not always — ' + t('6x-5y=9') + ' has fraction intercepts. The difference is the number of steps.' },
            { html: 'Because you don’t need to substitute ' + t('0') + ' in general form.', why: 'You still substitute ' + t('0') + ' — it just makes a whole term disappear at once.' },
            { html: 'Because ' + t('y=mx+b') + ' has no ' + t('y') + '-intercept.', why: 'It does: the ' + t('y') + '-intercept of ' + t('y=mx+b') + ' is ' + t('(0,\\ b)') + '. Compare the steps for the ' + t('x') + '-intercept.' }],
            'In ' + t('Ax+By=C') + ', ' + t('y=0') + ' removes the ' + t('y') + '-term and leaves ' + t('Ax=C') + ' — one division. In ' + t('y=mx+b') + ', ' + t('y=0') + ' gives ' + t('0=mx+b') + ': first move ' + t('b') + ' across, then divide, so the ' + t('x') + '-intercept takes an extra step.',
            ['Try both: find the ' + t('x') + '-intercept of each example and count the steps.'], 'why general form is quicker');
        } }] },
      /* ---------- Part B: tables, graphs, special lines ---------- */
      { num: '5', section: 'Extra Practice B — Intercepts from Tables, Graphs, and Special Lines', stem: 'State the ' + t('x') + '-intercept and the ' + t('y') + '-intercept of each relation.', parts: [
        { id: 'e5a', sub: 'a', level: 'EMG', make: function (r) {
          var bk = r.chance(0.25), m = bk ? 2 : r.pick([2, 3, -2, 4]), root = bk ? 3 : r.pick([1, 2, 3, -1, -2]), b = -m * root;
          var xs = bk ? [3, 0, -1, 5, 2] : (function () { var others = r.sample(range(-2, 5).filter(function (x) { return x !== 0 && x !== root; }), 3), s; do { s = r.shuffle([root, 0].concat(others)); } while (s.join() === s.slice().sort(function (p, q) { return p - q; }).join()); return s; })();
          var tab = 'The points are listed out of order.' + HW.valueTable([[t('x')].concat(xs.map(function (x) { return t(x); })), [t('y')].concat(xs.map(function (x) { return t(m * x + b); }))]);
          return interceptsPart(tab, [root], [b], { none: false, text: 'EP table ' + m + ',' + b, sol: 'The column with ' + t('y=0') + ' gives ' + t(ptT([root, 0])) + '; the column with ' + t('x=0') + ' gives ' + t(ptT([0, b])) + '.' });
        } },
        { id: 'e5b', sub: 'b', level: 'ADV', make: function (r) {
          var o = r.chance(0.25) ? [3, -5] : pickWhere(function () { return [r.pick([1, 3, 5, -3, -1, -5]), r.pick(pm(1, 9))]; }, function (z) { var x = -2 * z[1] / z[0]; return Math.abs(x - Math.round(x)) > 1e-9 && x > -2.5 && x < 6.5; });
          var d = o[0], b = o[1], xs = [-2, 0, 2, 4, 6], f = function (x) { return b + d * x / 2; }, xi = -2 * b / d;
          var tab = 'The relation is linear. No column is an ' + t('x') + '-intercept, so continue the pattern.' + HW.valueTable([[t('x')].concat(xs.map(function (x) { return t(x); })), [t('y')].concat(xs.map(function (x) { return t(f(x)); }))]);
          return interceptsPart(tab, [xi], [b], { none: false, exact: true, text: 'EP pattern ' + d + ',' + b,
            sol: 'The ' + t('y') + '-intercept is the column ' + t('x=0') + ': ' + t(ptT([0, b])) + '.<br>' + t('y') + ' changes by ' + t(d) + ' for every ' + t('2') + ' in ' + t('x') + ', so by ' + t(vt(d / 2)) + ' for every ' + t('1') + ' in ' + t('x') + '. From ' + t('y=' + b) + ' to ' + t('y=0') + ' is a change of ' + t(-b) + ', which takes ' + t(vt(-b) + '\\div ' + vt(d / 2) + '=' + vt(xi)) + ' in ' + t('x') + '.<br>The ' + t('x') + '-intercept is ' + t(ptT([xi, 0])) + '. (The equation is ' + t(mxb(fracOf(d / 2), b)) + '.)',
            hints: ['The ' + t('y') + '-intercept is in the table (the column ' + t('x=0') + ').', 'How much does ' + t('y') + ' change for each step of ' + t('1') + ' in ' + t('x') + '? How many such steps take ' + t('y') + ' from ' + t(b) + ' to ' + t('0') + '?'] });
        } }] },
      { num: '6', stem: 'State both intercepts of each line, then write the equation of the line in the form ' + t('y=mx+b') + ' and check your intercepts by substitution. (' + t('b') + ' is the ' + t('y') + '-intercept; find ' + t('m') + ' by substituting the ' + t('x') + '-intercept point.)',
        shared: function (r) {
          var A = r.chance(0.25) ? [-4, 3] : pickWhere(function () { return [-r.int(1, 6), r.int(1, 6)]; }, function (z) { return z[0] !== -z[1]; });
          var Bb = r.chance(0.25) ? [2, -4] : pickWhere(function () { return [r.int(1, 6), -r.int(1, 6)]; }, function (z) { return z[0] !== -z[1]; });
          return { a1: A[0], b1: A[1], a2: Bb[0], b2: Bb[1] };
        }, parts: [
        { id: 'e6a', sub: 'a', level: 'BEG', make: function (r, o) {
          return interceptsPart('(a)' + lineG([o.a1, 0], [0, o.b1]), [o.a1], [o.b1], { none: false, text: 'EP6a ints', sol: t('x') + '-intercept ' + t(ptT([o.a1, 0])) + ', ' + t('y') + '-intercept ' + t(ptT([0, o.b1])) + '.' });
        } },
        { id: 'e6a2', sub: 'a, equation', level: 'ADV', make: function (r, o) {
          return ymxbPart('(a)' + lineG([o.a1, 0], [0, o.b1]) + 'Write the equation of this line in the form ' + t('y=mx+b') + '.', -o.b1 / o.a1, o.b1, o.a1, backSol(o.a1, o.b1), HBACK, 'EP6a eq');
        } },
        { id: 'e6b', sub: 'b', level: 'BEG', make: function (r, o) {
          return interceptsPart('(b)' + lineG([o.a2, 0], [0, o.b2]), [o.a2], [o.b2], { none: false, text: 'EP6b ints', sol: t('x') + '-intercept ' + t(ptT([o.a2, 0])) + ', ' + t('y') + '-intercept ' + t(ptT([0, o.b2])) + '.' });
        } },
        { id: 'e6b2', sub: 'b, equation', level: 'ADV', make: function (r, o) {
          return ymxbPart('(b)' + lineG([o.a2, 0], [0, o.b2]) + 'Write the equation of this line in the form ' + t('y=mx+b') + '.', -o.b2 / o.a2, o.b2, o.a2, backSol(o.a2, o.b2), HBACK, 'EP6b eq');
        } }] },
      { num: '7', stem: 'Each equation describes a horizontal or vertical line, or a line through the origin. State every intercept it has (as ordered pairs); press <b>none</b> where an intercept is missing.',
        shared: function (r) { return { k: r.pick([5, 5].concat(pm(1, 10))), h: r.pick([-3, -3].concat(pm(1, 10))) }; }, parts: [
        { id: 'e7a', sub: 'a', level: 'EMG', make: function (r, o) {
          var k = o.k;
          return interceptsPart(t('y=' + k), null, [k], { text: 'ints of y=' + k, xNone: t('y=' + k) + ' is a horizontal line ' + t(Math.abs(k)) + ' units ' + (k > 0 ? 'above' : 'below') + ' the ' + t('x') + '-axis: it never meets the ' + t('x') + '-axis.',
            sol: 'Every point on ' + t('y=' + k) + ' has ' + t('y=' + k) + ': a horizontal line. It crosses the ' + t('y') + '-axis at ' + t(ptT([0, k])) + ' and never reaches the ' + t('x') + '-axis: ' + t('x') + '-intercept <b>none</b>.', hints: ['Sketch ' + t('y=' + k) + ': every point on it has ' + t('y=' + k) + '. Does it ever reach the ' + t('x') + '-axis?'] });
        } },
        { id: 'e7a2', sub: 'a, why', level: 'EMG', make: function (r, o) {
          var k = o.k;
          return mcPart(r, 'Why does ' + t('y=' + k) + ' have no ' + t('x') + '-intercept?', [
            { html: 'It is a horizontal line ' + t(Math.abs(k)) + ' units ' + (k > 0 ? 'above' : 'below') + ' the ' + t('x') + '-axis and stays there, so it never touches the ' + t('x') + '-axis.', right: true },
            { html: 'It has no ' + t('x') + ' in its equation, so it has no ' + t('x') + '-values.', why: 'Every ' + t('x') + '-value is allowed on ' + t('y=' + k) + ' — the line goes on forever left and right. The question is whether it ever reaches ' + t('y=0') + '.' },
            { html: 'It is a vertical line, parallel to the ' + t('y') + '-axis.', why: t('y=' + k) + ' is <b>horizontal</b>: every point has the same ' + t('y') + '-value.' },
            { html: 'Its ' + t('x') + '-intercept is too far away to see.', why: 'A horizontal line never gets closer to the ' + t('x') + '-axis, however far you go.' }],
            t('y=' + k) + ' is a horizontal line ' + t(Math.abs(k)) + ' units ' + (k > 0 ? 'above' : 'below') + ' the ' + t('x') + '-axis. It is parallel to the ' + t('x') + '-axis, so it never meets it.', ['What does the graph of ' + t('y=' + k) + ' look like?'], 'why y=k has no x-int');
        } },
        { id: 'e7b', sub: 'b', level: 'EMG', make: function (r, o) {
          var h = o.h;
          return interceptsPart(t('x=' + h), [h], null, { text: 'ints of x=' + h, yNone: t('x=' + h) + ' is a vertical line: it never meets the ' + t('y') + '-axis.',
            sol: 'Every point on ' + t('x=' + h) + ' has ' + t('x=' + h) + ': a vertical line. It crosses the ' + t('x') + '-axis at ' + t(ptT([h, 0])) + ' and never reaches the ' + t('y') + '-axis: ' + t('y') + '-intercept <b>none</b>.', hints: ['Sketch ' + t('x=' + h) + ': every point on it has ' + t('x=' + h) + '. Does it ever reach the ' + t('y') + '-axis?'] });
        } },
        { id: 'e7b2', sub: 'b, why', level: 'EMG', make: function (r, o) {
          var h = o.h;
          return mcPart(r, 'Why does ' + t('x=' + h) + ' have no ' + t('y') + '-intercept?', [
            { html: 'It is a vertical line ' + t(Math.abs(h)) + ' units to the ' + (h > 0 ? 'right' : 'left') + ' of the ' + t('y') + '-axis, always parallel to it, so it never touches the ' + t('y') + '-axis.', right: true },
            { html: 'It has no ' + t('y') + ' in its equation, so it has no ' + t('y') + '-values.', why: 'Every ' + t('y') + '-value is on ' + t('x=' + h) + ' — the line goes up and down forever. The question is whether it ever reaches ' + t('x=0') + '.' },
            { html: 'It is a horizontal line.', why: t('x=' + h) + ' is <b>vertical</b>: every point has the same ' + t('x') + '-value.' },
            { html: 'Its ' + t('y') + '-intercept is too high to see.', why: 'A vertical line never gets closer to the ' + t('y') + '-axis, however far it goes.' }],
            t('x=' + h) + ' is a vertical line ' + t(Math.abs(h)) + ' units to the ' + (h > 0 ? 'right' : 'left') + ' of the ' + t('y') + '-axis. It is parallel to the ' + t('y') + '-axis, so it never meets it.', ['What does the graph of ' + t('x=' + h) + ' look like?'], 'why x=h has no y-int');
        } },
        { id: 'e7c', sub: 'c', level: 'EMG', make: function (r) {
          var m = r.pick([-2, -2, 0.5, -0.5, 1.5].concat(pm(1, 9)));
          return interceptsPart(t(mxb(m, 0)), [0], [0], { text: 'ints of y=' + m + 'x', xSaidNone: 'Substitute ' + t('y=0') + ': ' + t('0=' + cTex(m) + 'x') + ' does have a solution.', ySaidNone: 'Substitute ' + t('x=0') + ': ' + t('y=' + m + '(0)') + ' has a value.',
            sol: t('y=0') + ' gives ' + t('x=0') + ', and ' + t('x=0') + ' gives ' + t('y=0') + '. Both intercepts are ' + t('(0,\\ 0)') + ': the line passes through the origin, which is on both axes.', hints: HEQ });
        } },
        { id: 'e7d', sub: 'd', level: 'PRG', make: function (r) {
          var xAxis = r.chance(0.7), eq = xAxis ? 'y=0' : 'x=0', a = xAxis ? 'x' : 'y', b = xAxis ? 'y' : 'x';
          return mcPart(r, 'Which describes the intercepts of ' + t(eq) + '?', [
            { html: 'The line <b>is</b> the ' + t(a) + '-axis, so every point on it is an ' + t(a) + '-intercept (infinitely many). Its ' + t(b) + '-intercept is ' + t('(0,\\ 0)') + '.', right: true },
            { html: 'No ' + t(a) + '-intercept; the ' + t(b) + '-intercept is ' + t('(0,\\ 0)') + '.', why: t(eq) + ' doesn’t miss the ' + t(a) + '-axis — it lies right on top of it.' },
            { html: 'One ' + t(a) + '-intercept, ' + t('(0,\\ 0)') + ', and nothing else.', why: 'Every point of ' + t(eq) + ' is on the ' + t(a) + '-axis, so there are far more than one.' },
            { html: 'No intercepts at all.', why: t(eq) + ' is one of the axes. It crosses the other axis at the origin and lies along its own axis.' }],
            t(eq) + ' <b>is</b> the ' + t(a) + '-axis: every point on it is an ' + t(a) + '-intercept, so there are infinitely many. It crosses the ' + t(b) + '-axis at the origin, ' + t('(0,\\ 0)') + '.', ['What does the graph of ' + t(eq) + ' look like?'], 'intercepts of ' + eq);
        } }] },
      /* ---------- Part C: intercepts that mean something ---------- */
      { num: '8', section: 'Extra Practice C — Intercepts That Mean Something', shared: function (r) {
          var o = r.chance(0.25) ? { rate: 4, T: 15 } : pickWhere(function () { return { rate: r.int(2, 6), T: r.pick([10, 12, 15, 20, 25]) }; }, function (z) { return z.rate * z.T <= 120 && z.rate * z.T >= 30; });
          o.V0 = o.rate * o.T; o.tb = o.T === 15 && o.rate === 4 ? 20 : o.T + r.pick([2, 5, 10]); o.Vb = o.V0 - o.rate * o.tb; return o;
        },
        stem: function (o) { return 'A water tank holds ' + t(o.V0) + ' L. A tap at the bottom is opened, and the volume of water remaining, ' + t('V') + ' litres, after ' + t('t') + ' minutes is given by ' + t('V=' + o.V0 + '-' + o.rate + 't') + '.'; },
        parts: [
          { id: 'e8a', sub: 'a', level: 'BEG', make: function (r, o) {
            return interceptsPart('Determine the ' + t('V') + '-intercept (the intercept on the vertical axis), as an ordered pair ' + t('(t,\\ V)') + '.', [o.T], [o.V0], { only: 'y', none: false, names: { x: 't', y: 'V' }, text: 'tank V-int',
              sol: 'Set ' + t('t=0') + ': ' + t('V=' + o.V0 + '-' + o.rate + '(0)=' + o.V0) + '. The ' + t('V') + '-intercept is ' + t(ptT([0, o.V0])) + '.', hints: ['On the ' + t('V') + '-axis, ' + t('t=0') + '. Substitute it.'] });
          } },
          { id: 'e8a2', sub: 'a, meaning', level: 'BEG', make: function (r, o) {
            return mcPart(r, 'What does the ' + t('V') + '-intercept represent?', [
              { html: 'The tank starts with ' + t(o.V0) + ' L, before any water has drained.', right: true },
              { html: 'The tank drains ' + t(o.V0) + ' L per minute.', why: 'It drains ' + t(o.rate) + ' L per minute. The ' + t('V') + '-intercept is the volume at ' + t('t=0') + '.' },
              { html: 'The tank is empty after ' + t(o.V0) + ' minutes.', why: 'Empty means ' + t('V=0') + ' — that is the ' + t('t') + '-intercept.' },
              { html: 'The water left after ' + t('1') + ' minute.', why: 'At the ' + t('V') + '-intercept, ' + t('t=0') + ', not ' + t('1') + '.' }],
              'At ' + t('t=0') + ' the tap has just opened, so the ' + t('V') + '-intercept, ' + t(o.V0) + ' L, is the <b>starting volume</b> (the tank is full).', ['What is ' + t('t') + ' at this point?'], 'tank V-int meaning');
          } },
          { id: 'e8b', sub: 'b', level: 'EMG', make: function (r, o) {
            return interceptsPart('Determine the ' + t('t') + '-intercept, as an ordered pair ' + t('(t,\\ V)') + '.', [o.T], [o.V0], { only: 'x', none: false, names: { x: 't', y: 'V' }, text: 'tank t-int',
              xDiag: function (A) { if (A.length === 1 && same(A[0][1], 0) && same(A[0][0], o.V0 * o.rate)) return { code: 'ctx-mult', hint: 'Divide by ' + t(o.rate) + ', don’t multiply.' }; if (A.length === 1 && same(A[0][1], 0) && same(A[0][0], -o.T)) return { code: 'int-sign', hint: 'Time can’t be negative — check the signs: ' + t('0=' + o.V0 + '-' + o.rate + 't') + ' gives ' + t(o.rate + 't=' + o.V0) + '.' }; return null; },
              sol: 'Set ' + t('V=0') + ': ' + t('0=' + o.V0 + '-' + o.rate + 't') + ', so ' + t(o.rate + 't=' + o.V0) + ' and ' + t('t=' + o.T) + '. The ' + t('t') + '-intercept is ' + t(ptT([o.T, 0])) + '.', hints: ['On the ' + t('t') + '-axis, ' + t('V=0') + '. Substitute ' + t('V=0') + ' and solve for ' + t('t') + '.'] });
          } },
          { id: 'e8b2', sub: 'b, meaning', level: 'BEG', make: function (r, o) {
            return mcPart(r, 'What does the ' + t('t') + '-intercept, ' + t(ptT([o.T, 0])) + ', represent?', [
              { html: 'The tank is empty after ' + t(o.T) + ' minutes.', right: true },
              { html: 'The tank holds ' + t(o.T) + ' L.', why: 'The tank holds ' + t(o.V0) + ' L (the ' + t('V') + '-intercept). The ' + t(o.T) + ' is a time.' },
              { html: 'The tap is opened after ' + t(o.T) + ' minutes.', why: 'The tap is opened at ' + t('t=0') + '. At ' + t(ptT([o.T, 0])) + ' the volume is ' + t('0') + '.' },
              { html: 'The tank drains ' + t(o.T) + ' L each minute.', why: 'It drains ' + t(o.rate) + ' L each minute.' }],
              'At ' + t(ptT([o.T, 0])) + ' the volume is ' + t('0') + ': the tank is <b>empty</b> after ' + t(o.T) + ' minutes.', ['What is ' + t('V') + ' at this point?'], 'tank t-int meaning');
          } },
          { id: 'e8c', sub: 'c', level: 'EMG', make: function (r, o) {
            return mcPart(r, 'The equation gives ' + t('V=' + o.Vb) + ' when ' + t('t=' + o.tb) + '. Why is that answer meaningless here?', [
              { html: 'A tank can’t hold a negative volume of water: it is already empty at ' + t('t=' + o.T) + ', and the draining stops there.', right: true },
              { html: 'Because ' + t(o.tb) + ' minutes is too long to wait.', why: 'Any amount of time is possible. Look at the value of ' + t('V') + ' that the equation gives.' },
              { html: 'Because ' + t('t') + ' can never be bigger than ' + t('V') + '.', why: 'There is no such rule. Look at the sign of ' + t('V=' + o.Vb) + '.' },
              { html: 'It isn’t meaningless: the tank owes ' + t(Math.abs(o.Vb)) + ' L.', why: 'A volume of water can’t be negative — once the tank is empty, there is nothing left to drain.' }],
              t('V=' + o.Vb) + ' would be a negative amount of water, which is impossible. The tank is empty at ' + t('t=' + o.T) + ' (the ' + t('t') + '-intercept), so the equation only describes the tank for ' + t('0\\le t\\le ' + o.T) + '.', ['Can a tank hold a negative amount of water?'], 'negative volume');
          } },
          { id: 'e8c2', sub: 'c, largest t', level: 'PRG', make: function (r, o) {
            return numPart('What is the largest value of ' + t('t') + ' that still makes sense?', o.T, [[o.tb, 'value', 'At ' + t('t=' + o.tb) + ' the volume would be negative. The tank is empty earlier — when ' + t('V=0') + '.'], [o.V0, 'int-gave-y', 'That is the starting volume. The largest time is when the tank becomes empty: ' + t('V=0') + '.']],
              'Draining stops when the tank is empty: ' + t('0=' + o.V0 + '-' + o.rate + 't') + ', ' + t('t=' + o.T) + '. The largest sensible value is ' + t('t=' + o.T) + ' minutes (the ' + t('t') + '-intercept).', ['When does the tank become empty?'], 'largest t', { after: 'min' });
          } },
          { id: 'e8d', sub: 'd', level: 'EMG', make: function (r, o) {
            var rows = [{ id: 'size', html: 'The size of the tank (' + t(o.V0) + ' L)' }, { id: 'time', html: 'How long the draining takes (' + t(o.T) + ' min)' }];
            var cols = [{ id: 'V', html: t('V') + '-intercept' }, { id: 't', html: t('t') + '-intercept' }];
            var p = B.grid('Which intercept tells you each fact?', rows, cols, { size: 'V', time: 't' }, { why: function (id) { return { code: 'row', hint: id === 'size' ? 'The size of the tank is how much it holds at the start, ' + t('t=0') + ': that point is on the ' + t('V') + '-axis.' : 'The draining is finished when ' + t('V=0') + ': that point is on the ' + t('t') + '-axis.' }; } },
              'The ' + t('V') + '-intercept, ' + t(ptT([0, o.V0])) + ', gives the size of the tank; the ' + t('t') + '-intercept, ' + t(ptT([o.T, 0])) + ', gives how long the draining takes.', ['The size is the volume at the start; the draining time is when the volume reaches ' + t('0') + '.'], 'which intercept');
            p.tries = 2; return p;
          } }] },
      { num: '9', shared: function (r) {
          var rate = r.chance(0.3) ? 8 : r.pick([3, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 11.5]);
          return { rate: rate, T: 100 / rate };
        },
        stem: function (o) { return 'A drone takes off with a full battery. Its charge, ' + t('C') + ' percent, after ' + t('t') + ' minutes of flight is ' + t('C=100-' + nT(o.rate) + 't') + '.'; },
        parts: [
          { id: 'e9a', sub: 'a', level: 'PRG', make: function (r, o) {
            var Tr = Math.round(o.T * 10) / 10, exact = Math.abs(o.T - Tr) < 1e-9;
            return interceptsPart('Determine both intercepts, as ordered pairs ' + t('(t,\\ C)') + '.' + (exact ? '' : ' Round the ' + t('t') + '-intercept to one decimal place.'), [Tr], [100], { none: false, names: { x: 't', y: 'C' }, tol: exact ? null : 0.0501, fmt: nT, text: 'drone ints ' + o.rate,
              sol: t('t=0') + ': ' + t('C=100') + ', so the ' + t('C') + '-intercept is ' + t('(0,\\ 100)') + '.<br>' + t('C=0') + ': ' + t('0=100-' + nT(o.rate) + 't') + ', ' + t(nT(o.rate) + 't=100') + ', ' + t('t=\\dfrac{100}{' + nT(o.rate) + '}' + (exact ? '=' : '\\approx ') + nT(Tr)) + '. The ' + t('t') + '-intercept is ' + t('(' + nT(Tr) + ',\\ 0)') + '.',
              hints: ['For the ' + t('C') + '-intercept substitute ' + t('t=0') + '; for the ' + t('t') + '-intercept substitute ' + t('C=0') + ' and solve.'] });
          } },
          { id: 'e9b', sub: 'b', level: 'PRG', make: function (r, o) {
            var Tr = Math.round(o.T * 10) / 10, wh = Math.floor(o.T);
            return mcPart(r, 'What does the ' + t('t') + '-intercept, about ' + t(nT(Tr)) + ', mean for the pilot, and why is it not a whole number of minutes?', [
              { html: 'The battery is flat after about ' + t(nT(Tr)) + ' minutes of flight. ' + t(100) + ' is not a multiple of ' + t(nT(o.rate)) + ', so it runs out partway through minute ' + t(wh + 1) + '.', right: true },
              { html: 'The drone can fly ' + t(nT(Tr)) + ' km. It isn’t whole because the drone slows down.', why: 'The ' + t('t') + '-axis is time in minutes. And the charge drops at a steady rate — the drone doesn’t slow down in this model.' },
              { html: 'The battery starts at ' + t(nT(Tr)) + '%. It isn’t whole because batteries are never exactly full.', why: 'The battery starts at ' + t('100\\%') + ' — the ' + t('C') + '-intercept. At the ' + t('t') + '-intercept the charge is ' + t('0') + '.' },
              { html: 'The battery loses ' + t(nT(Tr)) + '% each minute. It isn’t whole because of rounding.', why: 'It loses ' + t(nT(o.rate) + '\\%') + ' each minute. The ' + t('t') + '-intercept is the time when the charge reaches ' + t('0') + '.' }],
              'At the ' + t('t') + '-intercept the charge is ' + t('0') + ': the battery is flat after about ' + t(nT(Tr)) + ' minutes. Since ' + t('100\\div ' + nT(o.rate)) + ' is not a whole number, the battery runs out partway through minute ' + t(wh + 1) + '. (The ' + t('C') + '-intercept, ' + t('(0,\\ 100)') + ', is the full battery at take-off.)', ['What is the charge at the ' + t('t') + '-intercept?'], 'drone meaning');
          } }] },
      { num: '10', shared: function (r) {
          var o = r.chance(0.3) ? { fee: 4, rate: 2.5 } : pickWhere(function () { return { fee: r.pick([2, 3, 4, 5, 6, 3.5, 4.5]), rate: r.pick([1.25, 1.5, 2, 2.5, 3, 4, 5]) }; }, function (z) { var x = z.fee / z.rate; return Math.abs(x * 100 - Math.round(x * 100)) < 1e-9 && Math.abs(x - Math.round(x)) > 1e-9; });
          o.di = -o.fee / o.rate; return o;
        },
        stem: function (o) { return 'A taxi charges a flat pick-up fee plus a rate per kilometre. The fare, ' + t('C') + ' dollars, for a ride of ' + t('d') + ' kilometres is ' + t('C=' + nT(o.fee) + '+' + nT(o.rate) + 'd') + '.'; },
        parts: [
          { id: 'e10a', sub: 'a', level: 'PRG', make: function (r, o) {
            return interceptsPart('Determine both intercepts, as ordered pairs ' + t('(d,\\ C)') + '.', [o.di], [o.fee], { none: false, names: { x: 'd', y: 'C' }, fmt: nT, text: 'taxi ints',
              xDiag: function (A) { if (A.length === 1 && same(A[0][1], 0) && same(A[0][0], -o.di)) return { code: 'int-sign', hint: 'Check the sign: ' + t('0=' + nT(o.fee) + '+' + nT(o.rate) + 'd') + ' gives ' + t(nT(o.rate) + 'd=-' + nT(o.fee)) + '. The answer is negative — part (b) asks what that means.' }; return null; },
              sol: t('d=0') + ': ' + t('C=' + nT(o.fee)) + ', so the ' + t('C') + '-intercept is ' + t('(0,\\ ' + nT(o.fee) + ')') + '.<br>' + t('C=0') + ': ' + t('0=' + nT(o.fee) + '+' + nT(o.rate) + 'd') + ', ' + t(nT(o.rate) + 'd=-' + nT(o.fee)) + ', ' + t('d=' + nT(o.di)) + '. The ' + t('d') + '-intercept is ' + t('(' + nT(o.di) + ',\\ 0)') + '.',
              hints: ['For the ' + t('C') + '-intercept substitute ' + t('d=0') + '; for the ' + t('d') + '-intercept substitute ' + t('C=0') + ' and solve.', 'One of the intercepts comes out negative — that’s fine, write it down.'] });
          } },
          { id: 'e10b', sub: 'b', level: 'PRG', make: function (r, o) {
            return mcPart(r, 'One of these intercepts is meaningful and one is not. Which is which?', [
              { html: t('(0,\\ ' + nT(o.fee) + ')') + ' is meaningful: a ride of ' + t('0') + ' km still costs the $' + nT(o.fee) + ' pick-up fee. ' + t('(' + nT(o.di) + ',\\ 0)') + ' is not: a taxi can’t drive a negative distance, and the fare never reaches $0.', right: true },
              { html: t('(' + nT(o.di) + ',\\ 0)') + ' is meaningful: it is a free ride. ' + t('(0,\\ ' + nT(o.fee) + ')') + ' is not, because nobody rides ' + t('0') + ' km.', why: 'A distance of ' + t(nT(o.di)) + ' km is negative — impossible. And even a ' + t('0') + ' km ride costs the pick-up fee.' },
              { html: 'Both are meaningful.', why: 'Look at the ' + t('d') + '-intercept: ' + t('d=' + nT(o.di)) + ' km is a negative distance.' },
              { html: 'Neither is meaningful, because fares are never exactly whole dollars.', why: 'The ' + t('C') + '-intercept is the pick-up fee, $' + nT(o.fee) + ' — a real charge. Look at the sign of the ' + t('d') + '-intercept.' }],
              t('(0,\\ ' + nT(o.fee) + ')') + ' is meaningful: before any distance is driven, the fare is already the $' + nT(o.fee) + ' pick-up fee. ' + t('(' + nT(o.di) + ',\\ 0)') + ' is not: it would be a ride of ' + t(nT(o.di)) + ' km, a negative distance, and the fare never actually drops to $0.', ['Can a taxi ride be a negative number of kilometres?'], 'taxi meaning');
          } }] },
      /* ---------- Part D: errors, working backwards, stretch ---------- */
      { num: '11', section: 'Extra Practice D — Errors, Working Backwards, and Stretch', shared: function (r) { var o = r.chance(0.3) ? [2, 4] : [r.int(2, 6), r.int(1, 6)]; return { m: o[0], k: o[1], b: -o[0] * o[1] }; },
        stem: function (o) { return 'To find the ' + t('x') + '-intercept of ' + t(mxb(o.m, o.b)) + ', a student substitutes ' + t('x=0') + ' and writes “the ' + t('x') + '-intercept is ' + t(o.b) + '.”'; },
        parts: [
          { id: 'e11a', sub: 'a', level: 'EMG', make: function (r, o) {
            return mcPart(r, 'What is the student’s error?', [
              { html: 'Substituting ' + t('x=0') + ' finds the <b>' + t('y') + '-intercept</b>. An ' + t('x') + '-intercept sits on the ' + t('x') + '-axis, where ' + t('y=0') + ', so the student should substitute ' + t('y=0') + '.', right: true },
              { html: 'The student should have substituted ' + t('x=1') + '.', why: t('x=1') + ' gives just some point on the line. An intercept needs one coordinate to be ' + t('0') + '.' },
              { html: 'The student forgot to divide by ' + t(o.m) + '.', why: 'With ' + t('x=0') + ' there is nothing to divide. The real problem is which variable was set to ' + t('0') + '.' },
              { html: 'There is no error: ' + t(o.b) + ' is correct.', why: t('(0,\\ ' + o.b + ')') + ' is on the ' + t('y') + '-axis. What does it mean to be on the ' + t('x') + '-axis?' }],
              'The student used the ' + t('y') + '-intercept rule. On the ' + t('x') + '-axis ' + t('y=0') + ', so substitute ' + t('y=0') + ': ' + t('0=' + o.m + 'x' + sg(o.b)) + ' gives ' + t('x=' + o.k) + '. The ' + t(o.b) + ' they found is the ' + t('y') + '-intercept.', ['On the ' + t('x') + '-axis, which coordinate is ' + t('0') + '?'], 'error: x=0 for x-int');
          } },
          { id: 'e11b', sub: 'b', level: 'EMG', make: function (r, o) {
            return mxbInts(o.m, o.b, 'correct ints of ' + mxb(o.m, o.b));
          } }] },
      { num: '12', shared: function (r) { var o = r.chance(0.3) ? [3, 5] : pickWhere(function () { return [r.int(2, 7), r.int(2, 7)]; }, function (z) { return z[0] !== z[1]; }); return { A: o[0], B: o[1], C: o[0] * o[1] }; },
        stem: function (o) { return 'Sam says the line ' + t(genForm(o.A, o.B, o.C)) + ' has a ' + t('y') + '-intercept of ' + t(o.B) + ', “because the ' + t(o.B) + ' is the number beside the ' + t('y') + '.”'; },
        parts: [
          { id: 'e12', level: 'PRG', make: function (r, o) {
            var p = gfInts(o.A, o.B, o.C, 'Sam ' + genForm(o.A, o.B, o.C));
            p.prompt = 'Substitute to find the correct ' + t('y') + '-intercept (Sam is wrong), then state the ' + t('x') + '-intercept.';
            p.bad = (p.bad || []).concat([[ptKey([o.B, 0]), ptKey([0, o.B])]]);
            p.solution = t('x=0') + ': ' + t(o.B + 'y=' + o.C) + ', so ' + t('y=' + o.A) + '. The ' + t('y') + '-intercept is ' + t(ptT([0, o.A])) + ', not ' + t(o.B) + ' — the number beside ' + t('y') + ' is a coefficient, not an intercept.<br>' + t('y=0') + ': ' + t(o.A + 'x=' + o.C) + ', so ' + t('x=' + o.B) + '. The ' + t('x') + '-intercept is ' + t(ptT([o.B, 0])) + '.';
            return p;
          } }] },
      { num: '13', stem: 'Work backwards. Determine the equation of the line described, in the form ' + t('y=mx+b') + '. (' + t('b') + ' is the ' + t('y') + '-intercept; substitute the ' + t('x') + '-intercept point to find ' + t('m') + '.)', parts: [
        { id: 'e13a', sub: 'a', level: 'ADV', make: function (r) { var ab = r.chance(0.3) ? [4, -2] : pickWhere(function () { return [r.int(1, 8), -r.int(1, 6)]; }, function (z) { return z[0] !== -z[1]; }); return ymxbPart('The line has ' + t('x') + '-intercept ' + t(ab[0]) + ' and ' + t('y') + '-intercept ' + t(ab[1]) + '.', -ab[1] / ab[0], ab[1], ab[0], backSol(ab[0], ab[1]), HBACK, 'back ' + ab); } },
        { id: 'e13b', sub: 'b', level: 'ADV', make: function (r) { var ab = r.chance(0.3) ? [-3, 5] : pickWhere(function () { return [-r.int(1, 8), r.int(1, 6)]; }, function (z) { return z[0] !== -z[1]; }); return ymxbPart('The line has ' + t('x') + '-intercept ' + t(ab[0]) + ' and ' + t('y') + '-intercept ' + t(ab[1]) + '.', -ab[1] / ab[0], ab[1], ab[0], backSol(ab[0], ab[1]), HBACK, 'back ' + ab); } },
        { id: 'e13c', sub: 'c', level: 'ADV', make: function (r) { var a = r.chance(0.3) ? 6 : r.pick(pm(1, 10)); return ymxbPart('The line has ' + t('x') + '-intercept ' + t(a) + ' and ' + t('y') + '-intercept ' + t(a) + '.', -1, a, a, backSol(a, a), HBACK, 'back equal ' + a); } }] },
      { num: '14', shared: function (r) { var o = r.chance(0.3) ? [8, 4] : pickWhere(function () { var a = r.pick(pm(1, 6)); return [a * r.pick(pm(1, 4)), a]; }, function (z) { return Math.abs(z[0]) <= 12 && z[0] !== 0; }); return { b: o[0], a: o[1], m: -o[0] / o[1] }; },
        stem: function (o) { return 'The line ' + t('y=mx' + sg(o.b)) + ' has an ' + t('x') + '-intercept of ' + t(o.a) + '.'; },
        parts: [
          { id: 'e14', sub: 'a', level: 'ADV', make: function (r, o) {
            return numPart('Determine the value of ' + t('m') + '.', o.m, [[-o.m, 'eq-slope-sign', 'Check the sign: ' + t('0=' + o.a + 'm' + sg(o.b)) + ' gives ' + t(o.a + 'm=' + (-o.b)) + '.'], [o.a / -o.b, 'eq-slope-flip', 'Upside down: ' + t(o.a + 'm=' + (-o.b)) + ', so divide ' + t(-o.b) + ' by ' + t(o.a) + '.'], [o.b + o.a, 'value', 'Substitute the point ' + t(ptT([o.a, 0])) + ': ' + t('x=' + o.a) + ' and ' + t('y=0') + '.']],
              'The ' + t('x') + '-intercept point ' + t(ptT([o.a, 0])) + ' is on the line: ' + t('0=m(' + o.a + ')' + sg(o.b)) + ', so ' + t(o.a + 'm=' + (-o.b)) + ' and ' + t('m=' + vt(o.m)) + '.', ['The ' + t('x') + '-intercept point is ' + t(ptT([o.a, 0])) + '. Substitute ' + t('x=' + o.a) + ' and ' + t('y=0') + '.', 'Then solve the one-variable equation for ' + t('m') + '.'], 'find m', { before: t('m=') });
          } },
          { id: 'e14b', sub: 'b', level: 'EMG', make: function (r, o) {
            return ymxbPart('State the equation of the line.', o.m, o.b, o.a, 'With ' + t('m=' + vt(o.m)) + ': ' + t(mxb(fracOf(o.m), o.b)) + '. Check: ' + t('x=' + o.a) + ' gives ' + t('y=0') + ' ✓.', ['Put your value of ' + t('m') + ' into ' + t('y=mx' + sg(o.b)) + '.'], 'eq with m');
          } }] },
      { num: '15', shared: function (r) { var o = r.chance(0.3) ? [3, -2] : [r.pick(pm(1, 5)), r.pick(pm(1, 6))]; return { m: o[0], a: o[1], b: -o[0] * o[1] }; },
        stem: function (o) { return 'The line ' + t('y=' + cTex(o.m) + 'x+b') + ' has an ' + t('x') + '-intercept of ' + t(o.a) + '.'; },
        parts: [
          { id: 'e15', sub: 'a', level: 'ADV', make: function (r, o) {
            return numPart('Determine the value of ' + t('b') + '.', o.b, [[-o.b, 'int-sign', 'Check the sign: ' + t('0=' + o.m + '(' + o.a + ')+b') + ' gives ' + t('b=' + (-o.m * o.a)) + '.'], [o.a, 'eq-b-xint', t('b') + ' is the ' + t('y') + '-intercept, not the ' + t('x') + '-intercept. Substitute the point ' + t(ptT([o.a, 0])) + '.']],
              'The point ' + t(ptT([o.a, 0])) + ' is on the line: ' + t('0=' + o.m + '(' + o.a + ')+b') + ', so ' + t('0=' + (o.m * o.a) + '+b') + ' and ' + t('b=' + o.b) + '.', ['Substitute ' + t('x=' + o.a) + ' and ' + t('y=0') + ', then solve for ' + t('b') + '.'], 'find b', { before: t('b=') });
          } },
          { id: 'e15b', sub: 'b', level: 'EMG', make: function (r, o) {
            return ymxbPart('State the equation of the line.', o.m, o.b, o.a, t(mxb(o.m, o.b)) + '. Check: ' + t('x=' + o.a) + ' gives ' + t('y=' + o.m + '(' + o.a + ')' + sg(o.b) + '=0') + ' ✓.', ['Put your value of ' + t('b') + ' into ' + t('y=' + cTex(o.m) + 'x+b') + '.'], 'eq with b');
          } }] },
      { num: '16', section: 'Stretch', shared: function (r) {
          var o = r.chance(0.3) ? { A: 2, C: 12, y0: 3, X: 3 } : pickWhere(function () { var A = r.pick([2, 3, 4, 5]), C = A * r.pick([2, 3, 4, 5, 6, 7]); return { A: A, C: C, y0: r.pick([2, 3, 4, 6, -2, -3]), X: r.pick([1, 2, 3, 4, -2, -3]) }; }, function (z) { return z.C % z.y0 === 0 && z.C / z.y0 !== 1 && z.X !== z.C / z.A && z.C / z.y0 !== z.A; });
          o.k = o.C / o.y0; o.xi = o.C / o.A; return o;
        },
        stem: function (o) { return '<b>Stretch.</b> Consider the family of lines ' + t(o.A + 'x+ky=' + o.C) + ', where ' + t('k') + ' can be any non-zero number.'; },
        parts: [
          { id: 'e16a', sub: 'a', level: 'ADV', make: function (r, o) {
            return numPart('For what value of ' + t('k') + ' does the line have a ' + t('y') + '-intercept of ' + t(o.y0) + '?', o.k, [[o.y0 / o.C, 'eq-slope-flip', 'Upside down: ' + t(o.y0 + 'k=' + o.C) + ', so ' + t('k=\\frac{' + o.C + '}{' + o.y0 + '}') + '.'], [o.C - o.y0, 'value', 'Substitute the point ' + t('(0,\\ ' + o.y0 + ')') + ': ' + t(o.A + '(0)+k(' + o.y0 + ')=' + o.C) + ', so ' + t(o.y0 + 'k=' + o.C) + '.'], [o.C * o.y0, 'ctx-mult', 'Divide ' + t(o.C) + ' by ' + t(o.y0) + ', don’t multiply.']],
              'The ' + t('y') + '-intercept point ' + t('(0,\\ ' + o.y0 + ')') + ' is on the line: ' + t(o.A + '(0)+k(' + o.y0 + ')=' + o.C) + ', so ' + t(o.y0 + 'k=' + o.C) + ' and ' + t('k=' + vt(o.k)) + '.', ['Substitute the point ' + t('(0,\\ ' + o.y0 + ')') + ' into the equation and solve for ' + t('k') + '.'], 'k for y-int', { before: t('k=') });
          } },
          { id: 'e16b', sub: 'b', level: 'ADV', make: function (r, o) {
            return interceptsPart('Determine the ' + t('x') + '-intercept of ' + t(o.A + 'x+ky=' + o.C) + ' (as an ordered pair).', [o.xi], null, { only: 'x', none: false, text: 'family x-int',
              sol: 'Substitute ' + t('y=0') + ': ' + t(o.A + 'x+k(0)=' + o.C) + ', so ' + t(o.A + 'x=' + o.C) + ' and ' + t('x=' + vt(o.xi)) + '. The ' + t('k') + '-term disappears, so the ' + t('x') + '-intercept is ' + t(ptT([o.xi, 0])) + ' for <b>every</b> value of ' + t('k') + ': changing ' + t('k') + ' tilts the line about the fixed point ' + t(ptT([o.xi, 0])) + '.',
              hints: ['Substitute ' + t('y=0') + '. What happens to the term ' + t('ky') + '?'] });
          } },
          { id: 'e16c', sub: 'c', level: 'MAS', make: function (r, o) {
            var chk = function (resp) {
              var s = String(resp == null ? '' : resp).trim();
              if (!s) return form('empty', 'Type a value of ' + t('k') + ', or press <b>none</b> if no value works.');
              if (isNone(s)) return ok();
              var V = valueList(s);
              if (!V) return form('unreadable', 'Type one number, or press <b>none</b>.');
              return wrong('u5l4-k-none', 'Try it: with ' + t('k=' + vt(V[0])) + ', substitute ' + t('y=0') + ' — the ' + t('k') + '-term is ' + t('0') + ' and you still get ' + t(o.A + 'x=' + o.C) + ', so ' + t('x=' + vt(o.xi)) + '. Does ' + t('k') + ' change the ' + t('x') + '-intercept at all?');
            };
            return { prompt: 'For what value of ' + t('k') + ' is the ' + t('x') + '-intercept equal to ' + t(o.X) + '? If no value works, press <b>none</b>.', input: { type: 'fields', fields: [{ name: t('k'), label: t('k'), before: t('k='), mode: 'math', keys: 'fraction', none: true, placeholder: 'a number, or none' }] },
              check: K.fields([chk], { labels: [t('k')] }), key: ['none'], answer: '<b>No value</b> of ' + t('k') + ' works.', bad: [[String(o.k)], [String(o.C / o.X)]],
              solution: 'By part (b), the ' + t('x') + '-intercept is ' + t(ptT([o.xi, 0])) + ' for every value of ' + t('k') + ': substituting ' + t('y=0') + ' removes the ' + t('k') + '-term. So it can never equal ' + t(o.X) + ': <b>no value</b> of ' + t('k') + ' works.',
              hints: ['Look back at part (b): does the ' + t('x') + '-intercept depend on ' + t('k') + '?'], text: 'k for x-int: none' };
          } }] },
      { num: '17', shared: function (r) {
          var o = r.chance(0.3) ? { X: 6, b: 4 } : pickWhere(function () { return { X: r.int(2, 6), b: r.int(2, 6) }; }, function (z) { return z.b !== z.X; });
          o.A = o.X * o.b / 2; return o;
        },
        stem: function (o) { return '<b>Stretch.</b> A line crosses the ' + t('x') + '-axis at ' + t(ptT([o.X, 0])) + ' and the ' + t('y') + '-axis at ' + t('(0,\\ b)') + '. Together with the two axes it forms a right triangle whose area is ' + t(o.A) + ' square units.'; },
        parts: [
          { id: 'e17a', sub: 'a', level: 'MAS', make: function (r, o) {
            return B.valueSet('Determine the <b>two</b> possible values of ' + t('b') + '.', [o.b, -o.b], { v: 'b', diag: function (A) {
              if (A.length === 1 && Math.abs(Math.abs(A[0]) - o.b) < 1e-9) return { code: 'u5l4-one-b', hint: 'Correct so far — but the triangle could also be <b>below</b> the ' + t('x') + '-axis. There is a second value of ' + t('b') + '.' };
              if (A.some(function (v) { return Math.abs(Math.abs(v) - o.b / 2) < 1e-9; })) return { code: 'u5l4-area-half', hint: 'Area of a triangle = ' + t('\\frac{1}{2}\\times \\text{base}\\times \\text{height}') + ' — don’t forget the ' + t('\\frac{1}{2}') + '.' };
              return null; } },
              'The legs of the triangle are the base ' + t(o.X) + ' (along the ' + t('x') + '-axis) and the height ' + t('|b|') + ' (along the ' + t('y') + '-axis): ' + t('\\frac{1}{2}(' + o.X + ')|b|=' + o.A) + ', so ' + t(vt(o.X / 2) + '|b|=' + o.A) + ' and ' + t('|b|=' + o.b) + '. The triangle can be above or below the ' + t('x') + '-axis: ' + t('b=' + o.b) + ' or ' + t('b=-' + o.b) + '.',
              ['The triangle’s base is along the ' + t('x') + '-axis and its height along the ' + t('y') + '-axis. Use ' + t('\\text{Area}=\\frac{1}{2}\\times\\text{base}\\times\\text{height}') + '.', 'The ' + t('y') + '-intercept could be above <b>or below</b> the origin.'], 'triangle b values');
          } },
          { id: 'e17a2', sub: 'a, equations', level: 'ADV', make: function (r, o) {
            var m1 = -o.b / o.X, m2 = o.b / o.X, c1 = ymxbChk(m1, o.b, { xi: o.X }), c2 = ymxbChk(m2, -o.b, { xi: o.X }), k1 = mxb(fracOf(m1), o.b), k2 = mxb(fracOf(m2), -o.b);
            var fld = function (nm) { return { name: nm, label: nm, mode: 'math', keys: HW.widgets && HW.widgets.KEYSETS && HW.widgets.KEYSETS[EQK] ? EQK : 'expr', wide: true, placeholder: 'e.g. y = 2x - 4' }; };
            var p = B.fields('Give the equation of each line, in the form ' + t('y=mx+b') + '.', [fld('Line with ' + t('b>0')), fld('Line with ' + t('b<0'))], [c1, c2], [k1, k2], t(k1) + '<br>' + t(k2),
              'With ' + t('b=' + o.b) + ': ' + t('0=' + o.X + 'm+' + o.b) + ', ' + t('m=' + vt(m1)) + ', so ' + t(k1) + '.<br>With ' + t('b=-' + o.b) + ': ' + t('0=' + o.X + 'm-' + o.b) + ', ' + t('m=' + vt(m2)) + ', so ' + t(k2) + '.', HBACK, 'triangle equations');
            p.bad = [[k2, k1]];
            return p;
          } },
          { id: 'e17b', sub: 'b', level: 'ADV', make: function (r, o) {
            var L1 = segv([o.X, 0], [0, o.b], 'arrow', 'arrow'), L2 = segv([o.X, 0], [0, -o.b], 'arrow', 'arrow'), target = gv([], [L1, L2]);
            var check = exactChk(target, { wrong: [{ is: gv([], [L1]), code: 'int-missing', hint: 'That is one of the lines. Draw the other one too: through ' + t(ptT([o.X, 0])) + ' and ' + t('(0,\\ -' + o.b + ')') + '.' }, { is: gv([], [L2]), code: 'int-missing', hint: 'That is one of the lines. Draw the other one too: through ' + t(ptT([o.X, 0])) + ' and ' + t('(0,\\ ' + o.b + ')') + '.' }] });
            return drawPart('Sketch <b>both</b> lines on the grid. Use <b>╱ Line</b>: tap two points on each line.', LINEPAD, check, target,
              'Both lines go through ' + t(ptT([o.X, 0])) + '. One goes up to ' + t('(0,\\ ' + o.b + ')') + ', the other down to ' + t('(0,\\ -' + o.b + ')') + ': they are mirror images in the ' + t('x') + '-axis.',
              ['Each line goes through its two intercepts: ' + t(ptT([o.X, 0])) + ' and ' + t('(0,\\ \\pm ' + o.b + ')') + '.'], 'sketch both lines', [gv([], [L1]), gv([], [L2]), gv([], [segv([-o.X, 0], [0, o.b], 'arrow', 'arrow'), segv([-o.X, 0], [0, -o.b], 'arrow', 'arrow')])]);
          } },
          { id: 'e17b2', sub: 'b, why', level: 'PRG', make: function (r, o) {
            return mcPart(r, 'Why do the two triangles have the same area?', [
              { html: 'The two lines are reflections of each other in the ' + t('x') + '-axis, so both triangles have base ' + t(o.X) + ' and height ' + t(o.b) + ': only the sign of ' + t('b') + ' changes, not its size.', right: true },
              { html: 'Because both lines have the same slope.', why: 'One line goes down to the right and the other goes up: their slopes have opposite signs. Compare the base and height of the triangles.' },
              { html: 'Because both triangles are above the ' + t('x') + '-axis.', why: 'One triangle is above the ' + t('x') + '-axis and one is below. Compare their base and height.' },
              { html: 'Because every triangle made with the axes has area ' + t(o.A) + '.', why: 'A different line would make a different triangle. Compare the base and height of these two.' }],
              'Both triangles have the same base, ' + t(o.X) + ' (from the origin to ' + t(ptT([o.X, 0])) + '), and the same height, ' + t(o.b) + ' (up to ' + t('(0,\\ ' + o.b + ')') + ' or down to ' + t('(0,\\ -' + o.b + ')') + '). The lines are mirror images in the ' + t('x') + '-axis.', ['Compare the base and the height of the two triangles.'], 'same area why');
          } }] },
      { num: '18', stem: 'Straight lines and intercepts.', parts: [
        { id: 'e18', level: 'PRG', make: function (r) {
          var c = r.pick([2, 3, 4, 5, -2, -3]);
          return mcPart(r, 'Is it possible for a <b>straight line</b> to have no intercepts at all?', [
            { html: '<b>No.</b> A vertical line ' + t('x=' + c) + ' always crosses the ' + t('x') + '-axis, a horizontal line ' + t('y=' + c) + ' always crosses the ' + t('y') + '-axis, and a slanted line crosses both. To miss both axes a line would have to be parallel to both at once.', right: true },
            { html: '<b>Yes:</b> a horizontal line like ' + t('y=' + c) + ' has no intercepts.', why: t('y=' + c) + ' misses the ' + t('x') + '-axis, but it crosses the ' + t('y') + '-axis at ' + t('(0,\\ ' + c + ')') + '.' },
            { html: '<b>Yes:</b> a line far away from the origin misses both axes.', why: 'A line goes on forever. Unless it is parallel to an axis, it will cross it eventually.' },
            { html: '<b>No,</b> because every line passes through the origin.', why: 'Many lines miss the origin, like ' + t('y=x+' + Math.abs(c)) + '. The reason is about being parallel to the axes.' }],
            '<b>No.</b> A line misses an axis only if it is parallel to it. A vertical line is parallel to the ' + t('y') + '-axis but crosses the ' + t('x') + '-axis; a horizontal line is parallel to the ' + t('x') + '-axis but crosses the ' + t('y') + '-axis; a slanted line is parallel to neither, so it crosses both. No line is parallel to both axes.', ['When can a line miss an axis? Try a vertical, a horizontal and a slanted line.'], 'no intercepts possible?');
        } }] },
      { num: '19', stem: 'The line ' + t('y=0') + ' is the ' + t('x') + '-axis itself.', parts: [
        { id: 'e19', level: 'PRG', make: function (r) {
          var a = r.pick([2, 3, 5, -4, 7]);
          return mcPart(r, 'Why is saying “its ' + t('x') + '-intercept is ' + t('(0,\\ 0)') + '” not the whole truth?', [
            { html: 'Every point of ' + t('y=0') + ' has ' + t('y=0') + ', so <b>every</b> point on it is an ' + t('x') + '-intercept — infinitely many, like ' + t('(' + a + ',\\ 0)') + '. ' + t('(0,\\ 0)') + ' is only the one that is also the ' + t('y') + '-intercept.', right: true },
            { html: 'Because ' + t('y=0') + ' has no ' + t('x') + '-intercept at all.', why: 'It lies right on the ' + t('x') + '-axis, so it meets it everywhere.' },
            { html: 'Because its ' + t('x') + '-intercept is ' + t('(0,\\ 1)') + '.', why: t('(0,\\ 1)') + ' isn’t even on the line ' + t('y=0') + '.' },
            { html: 'Because ' + t('(0,\\ 0)') + ' is the ' + t('y') + '-intercept, so it can’t be an ' + t('x') + '-intercept.', why: 'The origin can be both (it is on both axes). The point is that there are many more ' + t('x') + '-intercepts.' }],
            'The line ' + t('y=0') + ' <b>is</b> the ' + t('x') + '-axis, so every one of its points is an ' + t('x') + '-intercept: ' + t('(a,\\ 0)') + ' for every number ' + t('a') + ' — infinitely many. ' + t('(0,\\ 0)') + ' is just the one that is also its ' + t('y') + '-intercept.', ['Which points of ' + t('y=0') + ' lie on the ' + t('x') + '-axis?'], 'y=0 x-intercepts');
        } }] }
    ];
  }
})(window);
