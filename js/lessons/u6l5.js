/* Math 15 · Unit 6 · Lesson 5 — Applications: Distance, Midpoint, and Finding a Missing Endpoint (outcome RF3 on every part)
 * Assignment 5 (u6_L05.tex, Questions 1–16) and the Lesson 5 Extra Practice (u6_EP05.tex, Questions 1–18).
 * Every part is a generator: same structure, idea and difficulty as the booklet question (the booklet's own numbers are
 * among the possible versions), new numbers from the seed. Model: Math 10C u6l1.js (distance-and-midpoint scope: point
 * checker, distance/midpoint/endpoint diagnoses and their wrong-answer codes are copied from there).
 * Conversions: "explain / justify / classify / what does this show" -> multiple choice whose options are reasons;
 * "give an example" -> two point boxes, any correct example accepted; several answers -> one box with the points
 * separated by commas (any order) or labelled boxes.
 * Changed from the booklet: Extra 17 (numerical response) always has a positive answer — the booklet's answer is −8,
 * which a numerical-response grid can't hold (see the report). Map distances: an exact radical or a decimal to the
 * nearest tenth is accepted unless the question asks for one form.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 4(b) (both endpoints from a length and a midpoint on an axis)
 * and Extra 14(b) (the point on the y-axis equidistant from two points). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u6l5';

  HW.addCodes({
    'd-no-root': 'Distance: forgot the square root (gave d²)', 'd-legs': 'Distance: added the run and rise', 'd-no-square': 'Distance: didn’t square the differences',
    'd-added': 'Distance: added the coordinates instead of subtracting', 'd-sign': 'Distance: sign slip subtracting a negative coordinate', 'd-half': 'Gave half the distance',
    'd-units': 'Distance in grid units, not converted with the scale', 'd-metres': 'Gave metres instead of kilometres', 'd-scale-div': 'Divided by the scale instead of multiplying',
    'd-straight': 'Gave the straight-line distance instead of the route', 'per-side': 'Perimeter missing a side',
    'mid-subtract': 'Midpoint: subtracted the coordinates', 'mid-no-halve': 'Midpoint: didn’t divide by 2', 'mid-wrong-seg': 'Midpoint of the wrong segment',
    'end-average': 'Missing endpoint: averaged instead of doubling and subtracting', 'end-step': 'Missing endpoint: gave the step from A to M', 'end-sign': 'Missing endpoint: added instead of subtracting',
    'end-sum': 'Missing endpoint: added the midpoint and the endpoint', 'end-double': 'Missing endpoint: doubled the midpoint but didn’t subtract', 'end-gave-y': 'Gave the y-value instead of x',
    'pt-swap': 'Coordinates swapped', 'pt-x': 'Wrong x-coordinate', 'pt-y': 'Wrong y-coordinate', pt: 'Wrong point', 'pt-not-pair': 'Gave one number for a point', 'pt-brackets': 'Point without brackets',
    'pt-many': 'Gave several points for one', 'pts-missing': 'Missed a point', 'pts-extra': 'A point that doesn’t work', pts: 'Wrong points', 'ax-one': 'Gave only one of two points',
    'ax-no-leg': 'Left out the other coordinate’s difference', 'ax-sign': 'Sign slip solving (x − h)² = …', 'ax-no-root': 'Didn’t take the square root',
    'eq-gave-mid': 'Gave the midpoint of AB', 'eq-mid-y': 'Used the average of the y-coordinates', 'exact-not-dec': 'Gave the exact value where the decimal was asked',
    'u6l4-mid-sign': 'Midpoint: sign slip adding a negative coordinate', 'u6l4-round-half': 'Rounded a half-unit midpoint to a whole number',
    'u6l5-same-pt': 'Example: the two endpoints are the same point', 'u6l5-not-axis': 'Example: the midpoint is not on the required axis', 'u6l5-not-origin': 'Example: the midpoint is not the origin',
    'u6l5-cost-one': 'Costed one brace instead of two', 'u6l5-cost-length': 'Gave the length instead of the cost', 'u6l5-route-total': 'Gave a route length instead of the difference',
    'u6l5-radius-diam': 'Gave the diameter for the radius (or reverse)', 'u6l5-k-sign': 'Sign slip solving for k', 'u6l5-k-no-y': 'Gave the point instead of k (or reverse)'
  });
  HW.addPartial({ 'u6l4-mid-sign': 's', 'u6l4-round-half': 's', 'u6l5-same-pt': 'n', 'u6l5-not-axis': 'n', 'u6l5-not-origin': 'n', 'u6l5-cost-one': 'b', 'u6l5-cost-length': 'b',
    'u6l5-route-total': 'b', 'u6l5-radius-diam': 's', 'u6l5-k-sign': 's', 'u6l5-k-no-y': 's' });

  /* ======================= shared helpers (copied from Math 10C u6l1.js, DM scope) ======================= */
  function cl(x) { return Math.round(x * 1e6) / 1e6; }
  function same(a, b) { return Math.abs(a - b) < 1e-7; }
  function nT(x) { return F(cl(x)); }
  function sgp(x) { x = cl(x); return x < 0 ? '(' + nT(x) + ')' : nT(x); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function pm(a, b) { return range(a, b).concat(range(a, b).map(function (x) { return -x; })); }
  function pickWhere(gen, okf) { for (var i = 0; i < 4000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function isSq(n) { var q = Math.round(Math.sqrt(n)); return q * q === n; }
  function radParts(n) { var k = 1, m = n; for (var f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; } return { k: k, m: m }; }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function even(n) { return Math.abs(Math.round(n)) % 2 === 0; }
  /* a coordinate as LaTeX: halves (and other simple fractions) as fractions when frac is set */
  function cT(x, frac) {
    x = cl(x); if (!frac || isInt(x)) return nT(x);
    for (var q = 2; q <= 8; q++) { var p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return (p < 0 ? '-' : '') + '\\tfrac{' + Math.abs(p) + '}{' + q + '}'; }
    return nT(x);
  }
  function ptT(p, frac) { return '(' + cT(p[0], frac) + ',\\ ' + cT(p[1], frac) + ')'; }
  function nm(name, p, frac) { return name + ptT(p, frac); }
  function ptKey(p) { return '(' + cl(p[0]) + ', ' + cl(p[1]) + ')'; }
  function fracKey(p) { // the same point typed with fractions, for the 'good' list
    var c = function (x) { x = cl(x); if (isInt(x)) return String(Math.round(x)); var q = 2; while (!isInt(x * q) && q < 8) q++; var pp = Math.round(x * q); return (pp < 0 ? '-' : '') + '\\frac{' + Math.abs(pp) + '}{' + q + '}'; };
    return '\\left(' + c(p[0]) + ',' + c(p[1]) + '\\right)';
  }
  function samePt(a, b) { return same(a[0], b[0]) && same(a[1], b[1]); }
  function mid(a, b) { return [cl((a[0] + b[0]) / 2), cl((a[1] + b[1]) / 2)]; }
  function add(a, b) { return [cl(a[0] + b[0]), cl(a[1] + b[1])]; }
  function sub(a, b) { return [cl(a[0] - b[0]), cl(a[1] - b[1])]; }
  function scl(a, k) { return [cl(a[0] * k), cl(a[1] * k)]; }
  function d2(a, b) { return cl((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])); }
  function dist(a, b) { return Math.sqrt(d2(a, b)); }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function fx(x, dp) { return rd(x, dp).toFixed(dp); }
  /* exact length √n / den in simplest form */
  function lenSpec(n, den) { den = den || 1; var r = radParts(n), g = gcd(r.k, den); return { k: [r.k / g, den / g], m: r.m }; }
  function lenTex(n, den) {
    var s = lenSpec(n, den), p = s.k[0], q = s.k[1], core = s.m === 1 ? String(p) : (p === 1 ? '' : p) + '\\sqrt{' + s.m + '}';
    return q === 1 ? core : '\\dfrac{' + core + '}{' + q + '}';
  }
  function lenKey(n, den) {
    var s = lenSpec(n, den), p = s.k[0], q = s.k[1], core = s.m === 1 ? String(p) : (p === 1 ? '' : p) + '\\sqrt{' + s.m + '}';
    return q === 1 ? core : '\\frac{' + core + '}{' + q + '}';
  }
  /* "= √(4 × 10) = 2√10" (the steps after √n) */
  function simpTail(n) {
    if (isSq(n)) return '=' + Math.round(Math.sqrt(n));
    var r = radParts(n); return r.k === 1 ? '' : '=\\sqrt{' + (r.k * r.k) + '\\times ' + r.m + '}=' + r.k + '\\sqrt{' + r.m + '}';
  }
  function dLine(p, q, name) {
    var dx = cl(q[0] - p[0]), dy = cl(q[1] - p[1]);
    return (name ? name + '=' : '') + '\\sqrt{(' + nT(q[0]) + '-' + sgp(p[0]) + ')^{2}+(' + nT(q[1]) + '-' + sgp(p[1]) + ')^{2}}=\\sqrt{' + sgp(dx) + '^{2}+' + sgp(dy) + '^{2}}=\\sqrt{' + nT(dx * dx) + '+' + nT(dy * dy) + '}=\\sqrt{' + nT(dx * dx + dy * dy) + '}';
  }
  function dSteps(p, q) {
    var dx = cl(q[0] - p[0]), dy = cl(q[1] - p[1]);
    return t('x_2-x_1=' + nT(q[0]) + '-' + sgp(p[0]) + '=' + nT(dx)) + ', &nbsp;' + t('y_2-y_1=' + nT(q[1]) + '-' + sgp(p[1]) + '=' + nT(dy)) + '.';
  }
  function mLine(p, q, name, frac) {
    return (name ? name + '=' : '') + '\\left(\\dfrac{' + nT(p[0]) + '+' + sgp(q[0]) + '}{2},\\ \\dfrac{' + nT(p[1]) + '+' + sgp(q[1]) + '}{2}\\right)=\\left(\\dfrac{' + nT(p[0] + q[0]) + '}{2},\\ \\dfrac{' + nT(p[1] + q[1]) + '}{2}\\right)=' + ptT(mid(p, q), frac);
  }
  var HD = ['Distance formula: ' + t('d=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}}') + '. Find the run and the rise, square each, add, then take the square root.',
    'Watch the signs: subtracting a negative coordinate means adding, e.g. ' + t('3-(-3)=6') + '.'];
  var HM = ['Midpoint formula: ' + t('M\\left(\\dfrac{x_1+x_2}{2},\\ \\dfrac{y_1+y_2}{2}\\right)') + ' — average the ' + t('x') + '-coordinates and average the ' + t('y') + '-coordinates.',
    'Add the coordinates (don’t subtract), then divide each sum by ' + t('2') + '.'];
  var HE = ['If ' + t('M') + ' is the midpoint of ' + t('\\overline{AB}') + ', then ' + t('x_M=\\dfrac{x_A+x_B}{2}') + ', so ' + t('x_B=2x_M-x_A') + ': <b>double the midpoint, then subtract the endpoint you have</b>.',
    'Do the same with the ' + t('y') + '-coordinates. Averaging again is the classic wrong move — the missing endpoint lies <i>beyond</i> the midpoint.'];

  /* ---------------- typical wrong distances ---------------- */
  function dCands(p, q, scale) {
    scale = scale || 1;
    var dx = cl(q[0] - p[0]), dy = cl(q[1] - p[1]), D = Math.sqrt(dx * dx + dy * dy) * scale, out = [];
    function put(v, code, hint) { if (!isFinite(v) || v <= 0 || Math.abs(v - D) < 1e-6 || out.some(function (o) { return Math.abs(o[0] - v) < 1e-6; })) return; out.push([v, code, hint]); }
    if (scale === 1) put(dx * dx + dy * dy, 'd-no-root', 'That is ' + t('d^{2}') + ' — the last step of the distance formula is to take the <b>square root</b>.');
    put((Math.abs(dx) + Math.abs(dy)) * scale, 'd-legs', 'You added the run and the rise. The segment is the <b>hypotenuse</b> of a right triangle: square the run and the rise, add, then take the square root.');
    put(Math.sqrt(Math.abs(dx) + Math.abs(dy)) * scale, 'd-no-square', 'Square each difference before you add them: ' + t('\\sqrt{(\\Delta x)^{2}+(\\Delta y)^{2}}') + '.');
    var sx = cl(q[0] + p[0]), sy = cl(q[1] + p[1]);
    put(Math.sqrt(sx * sx + sy * sy) * scale, 'd-added', 'The distance formula <b>subtracts</b> the coordinates (' + t('x_2-x_1') + ' and ' + t('y_2-y_1') + ') — it doesn’t add them.');
    var ex1 = p[0] < 0 ? t(nT(q[0]) + '-' + sgp(p[0]) + '=' + nT(dx)) : p[1] < 0 ? t(nT(q[1]) + '-' + sgp(p[1]) + '=' + nT(dy)) : q[0] < 0 ? t(nT(p[0]) + '-' + sgp(q[0]) + '=' + nT(-dx)) : t(nT(p[1]) + '-' + sgp(q[1]) + '=' + nT(-dy));
    var sh = 'Check your subtraction — subtracting a negative coordinate means adding: ' + ex1 + '.';
    put(Math.sqrt(sx * sx + dy * dy) * scale, 'd-sign', sh);
    put(Math.sqrt(dx * dx + sy * sy) * scale, 'd-sign', sh);
    return out;
  }
  function matchDiag(cands, dp) {
    return function (v) {
      for (var i = 0; i < cands.length; i++) {
        var c = cands[i][0];
        if (dp == null ? Math.abs(v - c) < 1e-6 : Math.abs(v - rd(c, dp)) < 1e-9 || Math.abs(v - c) < 1e-6) return { code: cands[i][1], hint: cands[i][2] };
      }
      return null;
    };
  }
  /* an exact length √n/den: integer, fraction or simplest mixed radical. o.cands (wrong values). o.dec: also accept a
   * decimal within ±0.05 (written with at least one decimal place) — the Math 15 rule when the booklet doesn't ask for
   * exact form. Without o.dec a decimal gets the gentle "give the exact value" nudge. */
  function lenCheck(n, den, o) {
    o = o || {}; den = den || 1;
    var s = lenSpec(n, den), L = Math.sqrt(n) / den, dg = matchDiag(o.cands || [], o.dec ? 1 : null);
    var base = s.m === 1 ? (s.k[1] === 1 ? K.value(s.k[0], { only: 'integer', diag: dg }) : K.fraction(s.k, { decimalOk: true, diag: dg })) : K.radical({ k: s.k, n: 2, m: s.m }, 'mixed', { diag: dg });
    return function (resp) {
      var pn = HW.parse.number(String(resp == null ? '' : resp));
      if (pn.ok && s.m !== 1) {
        var str = HW.parse.plain(String(resp)).replace(/\s/g, ''), dp = (str.split('.')[1] || '').length;
        if (o.dec) { if (dp >= 1 && Math.abs(pn.value - L) <= 0.05 + 1e-9) return ok(); if (dp === 0 && Math.abs(pn.value - L) < 0.5) return form('places', 'Round to the nearest tenth (one decimal place), or give the exact value with the ' + t('\\sqrt{\\ }') + ' key.'); }
        else if (Math.abs(pn.value - L) <= 0.06) return form('decimal', 'That’s a decimal approximation. This part asks for the <b>exact</b> value: keep the square root (use the ' + t('\\sqrt{\\ }') + ' key) and simplify it.');
        var h = dg(pn.value); if (h) return wrong(h.code, h.hint);
      }
      return base(resp);
    };
  }
  /* a decimal length to dp places (the exact value is not accepted here: the box asks for the rounded value) */
  function decCheck(n, dp, o) {
    o = o || {}; var L = Math.sqrt(n) * (o.scale || 1);
    var inner = K.approx(L, dp, { diag: matchDiag(o.cands || [], dp) });
    return function (resp) {
      var a = HW.parse.number(String(resp == null ? '' : resp));
      if (!a.ok) { var rr = K.read(resp); if (!rr.res && Math.abs(rr.val - L) < 1e-6) return form('exact-not-dec', 'That’s the exact value — this box wants the decimal, rounded to the nearest ' + (dp === 1 ? 'tenth' : dp === 0 ? 'whole number' : 'hundredth') + '.'); }
      return inner(resp);
    };
  }
  function lenField(label, after) { return { label: t(label + '='), name: label, mode: 'math', keys: 'radical', after: after }; }
  function decField(label, after) { return { label: t(label + '\\approx'), name: label + ' (decimal)', after: after }; }

  /* ---------------- points ---------------- */
  function stripP(s) {
    return String(s == null ? '' : s).replace(/\\(left|right)\b\.?/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\[,;!: ]/g, '').replace(/−/g, '-')
      .replace(/\\\{|\\\}|\\lbrace|\\rbrace/g, ' ').replace(/\\text\{\s*and\s*\}/g, ',').replace(/^\s*[A-Za-z]('|_\{?\d\}?)?\s*=?\s*(?=\()/, '').trim();
  }
  function simpleNum(ast) { var sh = ex.shape(ast); if (sh.bare) return true; var pf = ex.plainFraction(ast); return !!(pf && pf[1] > 1 && gcd(pf[0], pf[1]) === 1 && !sh.decimals); }
  function coordVal(str) {
    var a = ex.parse(str.trim()); if (!a.ok) return null;
    var mv = ex.mixedValue ? ex.mixedValue(a.ast) : null;
    if (mv != null && isFinite(mv)) return { v: mv, simple: false, mixed: true };
    var v = ex.value(a.ast); if (!isFinite(v)) return null;
    return { v: v, simple: simpleNum(a.ast) };
  }
  function coordPair(str) {
    var xy = str.split(','); if (xy.length !== 2 || !xy[0].trim() || !xy[1].trim()) return null;
    var a = coordVal(xy[0]), b = coordVal(xy[1]); if (!a || !b) return null;
    return { x: a.v, y: b.v, simple: a.simple && b.simple, mixed: a.mixed || b.mixed };
  }
  function readPts(resp) {
    var s = stripP(resp);
    if (/^\{[\s\S]*\}$/.test(s) && !/^\{[^{}]*\}\{/.test(s)) s = s.slice(1, -1).trim();
    if (!s) return { empty: true };
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) { var c = coordPair(m[1]); if (!c) return { bad: true }; out.push(c); }
    if (!out.length) {
      var c2 = coordPair(s); if (c2) return { pts: [c2], noParen: true };
      var one = ex.parse(s); if (one.ok && isFinite(ex.value(one.ast))) return { single: true };
      return { bad: true };
    }
    if (s.replace(re, '').replace(/[,;\s]|and/g, '').length) return { bad: true };
    return { pts: out };
  }
  function readRes(L) {
    if (L.empty) return form('empty', 'Type your answer first.');
    if (L.single) return form('pt-not-pair', 'A point needs two coordinates: write it as an ordered pair ' + t('(x,\\ y)') + '.');
    if (L.bad) return form('unreadable', 'Write the point as an ordered pair in brackets, e.g. ' + t('(3,\\ -2)') + ' (press <b>( )</b>, type x, comma, y).');
    return null;
  }
  /* one point. o.cands: [[pt, code, hint]], o.swapHint, o.xHint, o.yHint */
  function ptCheck(W, o) {
    o = o || {};
    return function (resp) {
      var L = readPts(resp), rr = readRes(L); if (rr) return rr;
      if (L.pts.length !== 1) return form('pt-many', 'Give just one point.');
      var p = L.pts[0], Q = [p.x, p.y];
      if (samePt(Q, W)) {
        if (p.mixed) return form('mixed-num', 'Right point — but write each half as an improper fraction or a decimal (for example ' + t('\\frac{-5}{2}') + ' or ' + t('-2.5') + '), not a mixed number.');
        if (!p.simple) return form('simplify', 'Right point — now simplify each coordinate to a single number (for example ' + t('\\frac{12}{2}=6') + ').');
        if (L.noParen) return form('pt-brackets', 'Right coordinates — write the point in brackets: ' + t('(x,\\ y)') + '.');
        return ok();
      }
      var c = o.cands || [];
      for (var i = 0; i < c.length; i++) if (c[i][0] && samePt(Q, c[i][0])) return wrong(c[i][1], c[i][2]);
      if (o.round && (same(Q[0], Math.round(W[0])) || same(Q[0], Math.floor(W[0])) || same(Q[0], Math.ceil(W[0]))) && (same(Q[1], Math.floor(W[1])) || same(Q[1], Math.ceil(W[1]))) && (!isInt(W[0]) || !isInt(W[1])))
        return wrong('u6l4-round-half', 'Don’t round: a midpoint can sit halfway between two grid lines. Keep the half exactly, as a fraction like ' + t('\\frac{-5}{2}') + ' or a decimal like ' + t('-2.5') + '.');
      if (same(Q[0], W[1]) && same(Q[1], W[0])) return wrong('pt-swap', o.swapHint || 'Your coordinates are in the wrong order: the ' + t('x') + '-coordinate comes first, then the ' + t('y') + '-coordinate.');
      if (same(Q[0], W[0])) return wrong('pt-y', 'Your ' + t('x') + '-coordinate is right — check the ' + (same(Q[1], -W[1]) ? '<b>sign</b> of the ' : '') + t('y') + '-coordinate.' + (o.yHint ? ' ' + o.yHint : ''));
      if (same(Q[1], W[1])) return wrong('pt-x', 'Your ' + t('y') + '-coordinate is right — check the ' + (same(Q[0], -W[0]) ? '<b>sign</b> of the ' : '') + t('x') + '-coordinate.' + (o.xHint ? ' ' + o.xHint : ''));
      return wrong('pt', null);
    };
  }
  function ptPart(prompt, W, o, sol, hints, text) {
    o = o || {};
    var good = ['\\left(' + cl(W[0]) + ',' + cl(W[1]) + '\\right)'], bad = [];
    if ((!isInt(W[0]) || !isInt(W[1])) && isInt(2 * W[0]) && isInt(2 * W[1])) good.push(fracKey(W));
    [[W[1], W[0]]].concat((o.cands || []).map(function (c) { return c[0]; })).forEach(function (q) { if (q && !samePt(q, W)) bad.push(ptKey(q)); });
    return { prompt: prompt, input: { type: 'math', keys: 'pairs', before: o.before, placeholder: 'e.g. (3, -2)' }, check: ptCheck(W, o), key: ptKey(W), answer: t((o.name || '') + ptT(W, o.frac)),
      solution: sol, hints: hints || HM, text: text, good: good, bad: bad };
  }
  function ptField(label, name) { return { label: label, name: name || label.replace(/\\\(|\\\)/g, ''), mode: 'math', keys: 'pairs', placeholder: 'e.g. (3, -2)' }; }
  /* typical wrong midpoints of a and b */
  function midCands(a, b) {
    var h = [cl((b[0] - a[0]) / 2), cl((b[1] - a[1]) / 2)], hs = 'You subtracted the coordinates. The midpoint formula <b>adds</b> them and divides by ' + t('2') + ' — it averages each coordinate.';
    var out = [[h, 'mid-subtract', hs], [scl(h, -1), 'mid-subtract', hs], [add(a, b), 'mid-no-halve', 'You added the coordinates — now divide each sum by ' + t('2') + '.'],
      [[cl(a[0] + b[0]), cl((a[1] + b[1]) / 2)], 'mid-no-halve', 'Your ' + t('y') + '-coordinate is right. Divide the sum of the ' + t('x') + '-coordinates by ' + t('2') + ' as well.'],
      [[cl((a[0] + b[0]) / 2), cl(a[1] + b[1])], 'mid-no-halve', 'Your ' + t('x') + '-coordinate is right. Divide the sum of the ' + t('y') + '-coordinates by ' + t('2') + ' as well.']];
    /* a sign slip adding a negative coordinate: one coordinate added as if positive */
    var sg = 'Check the signs when you add: a negative coordinate stays negative, e.g. ' + t('\\dfrac{' + nT(a[0]) + '+' + sgp(b[0]) + '}{2}=\\dfrac{' + nT(a[0] + b[0]) + '}{2}') + '.';
    var sgy = 'Check the signs when you add: a negative coordinate stays negative, e.g. ' + t('\\dfrac{' + nT(a[1]) + '+' + sgp(b[1]) + '}{2}=\\dfrac{' + nT(a[1] + b[1]) + '}{2}') + '.';
    var mx = cl((a[0] + b[0]) / 2), my = cl((a[1] + b[1]) / 2);
    [[Math.abs(a[0]) + Math.abs(b[0]), 0], [-(Math.abs(a[0]) + Math.abs(b[0])), 0]].forEach(function (s) { var v = cl(s[0] / 2); if (!same(v, mx) && (a[0] < 0 || b[0] < 0)) out.push([[v, my], 'u6l4-mid-sign', sg]); });
    [[Math.abs(a[1]) + Math.abs(b[1])], [-(Math.abs(a[1]) + Math.abs(b[1]))]].forEach(function (s) { var v = cl(s[0] / 2); if (!same(v, my) && (a[1] < 0 || b[1] < 0)) out.push([[mx, v], 'u6l4-mid-sign', sgy]); });
    return out.filter(function (c) { return !samePt(c[0], mid(a, b)); });
  }
  function endCands(a, m) {
    return [[mid(a, m), 'end-average', 'You averaged the endpoint and the midpoint — that gives the point halfway between them. The missing endpoint is <i>beyond</i> the midpoint: double the midpoint, then subtract the endpoint you have.'],
      [sub(m, a), 'end-step', 'That is the step from the known endpoint to the midpoint. The missing endpoint is one more such step past the midpoint: ' + t('B=2M-A') + '.'],
      [add(scl(m, 2), a), 'end-sign', 'Double the midpoint, then <b>subtract</b> the endpoint you have — watch the signs.'],
      [add(m, a), 'end-sum', 'Double the midpoint first, then subtract the known endpoint: ' + t('x_B=2x_M-x_A') + '.'],
      [scl(m, 2), 'end-double', 'You doubled the midpoint — now subtract the known endpoint.'],
      [sub(a, scl(m, 2)), 'end-sign', 'Subtract in the right order: double the midpoint, then take away the known endpoint, ' + t('2x_M-x_A') + ' (not ' + t('x_A-2x_M') + ').']].filter(function (c) { return !samePt(c[0], sub(scl(m, 2), a)); });
  }
  function endNum(xA, xM) {
    return [[(xA + xM) / 2, 'end-average', 'You averaged again. The midpoint’s coordinate is the average of the endpoints, so solve ' + t('\\dfrac{' + nT(xA) + '+x}{2}=' + nT(xM)) + ': multiply by ' + t('2') + ', then subtract ' + t(sgp(xA)) + '.'],
      [xM - xA, 'end-step', 'Multiply both sides by ' + t('2') + ' first: ' + t(nT(xA) + '+x=' + nT(2 * xM)) + ', then subtract.'],
      [2 * xM + xA, 'end-sign', 'After doubling, <b>subtract</b> ' + t(sgp(xA)) + ' (it moves to the other side): ' + t('x=' + nT(2 * xM) + '-' + sgp(xA)) + '.'],
      [xM + xA, 'end-sum', 'Double the midpoint coordinate first: ' + t('x=2(' + nT(xM) + ')-' + sgp(xA)) + '.'],
      [2 * xM, 'end-double', 'You doubled the midpoint coordinate — now subtract ' + t(sgp(xA)) + '.']].filter(function (c) { return !same(c[0], 2 * xM - xA); });
  }
  function numDiag(list) { return function (v) { for (var i = 0; i < list.length; i++) if (isFinite(list[i][0]) && same(v, list[i][0])) return { code: list[i][1], hint: list[i][2] }; return null; }; }
  /* the endpoint-recovery working, one line per coordinate */
  function endSol(A, M, nmB, frac) {
    var Bp = sub(scl(M, 2), A);
    return t('x=2x_M-x_A=2' + (M[0] < 0 || !isInt(M[0]) ? '\\left(' + cT(M[0], frac) + '\\right)' : '(' + nT(M[0]) + ')') + '-' + sgp(A[0]) + '=' + nT(2 * M[0]) + (A[0] < 0 ? '+' + nT(-A[0]) : '-' + nT(A[0])) + '=' + nT(Bp[0])) + '<br>' +
      t('y=2y_M-y_A=2' + (M[1] < 0 || !isInt(M[1]) ? '\\left(' + cT(M[1], frac) + '\\right)' : '(' + nT(M[1]) + ')') + '-' + sgp(A[1]) + '=' + nT(2 * M[1]) + (A[1] < 0 ? '+' + nT(-A[1]) : '-' + nT(A[1])) + '=' + nT(Bp[1])) + '<br>' +
      'So ' + t((nmB || '') + ptT(Bp)) + '. Check: ' + t(mLine(A, Bp, null, frac)) + ' ✓';
  }
  /* a coordinate grid around some points (even bounds) */
  function win(pts, padv) {
    padv = padv == null ? 1 : padv;
    var xs = pts.map(function (p) { return p[0]; }).concat([0]), ys = pts.map(function (p) { return p[1]; }).concat([0]);
    var lo = function (v) { return Math.floor((Math.min.apply(null, v) - padv) / 2) * 2; }, hi = function (v) { return Math.ceil((Math.max.apply(null, v) + padv) / 2) * 2; };
    return { x: [lo(xs), hi(xs)], y: [lo(ys), hi(ys)] };
  }
  function figPoly(pts, names, o) {
    o = o || {};
    var w = o.win || win(pts, 1.5), segs = [];
    if (o.closed) segs.push({ pts: pts.concat([pts[0]]), start: 'none', end: 'none' });
    else if (o.segs) o.segs.forEach(function (s) { segs.push({ pts: s, start: 'none', end: 'none', dash: s.dash }); });
    (o.dash || []).forEach(function (s) { segs.push({ pts: s, start: 'none', end: 'none', dash: true, color: '#c4532a' }); });
    var span = Math.max(w.x[1] - w.x[0], w.y[1] - w.y[0]);
    return '<div class="fig">' + HW.graph({ x: w.x, y: w.y, grid: 1, labels: span > 16 ? 4 : 2, points: pts.map(function (p, i) { return { x: p[0], y: p[1], label: names[i] }; }), segs: segs, max: o.max || 340 }) + '</div>';
  }
  function mcPart(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }

  /* ======================= lesson-specific helpers ======================= */
  function sq(x) { return x * x; }
  function pairTex(n1, P, n2, Q) { return t(nm(n1, P) + ',\\ ' + nm(n2, Q)); }
  function midP(prompt, P, Q, text, o) {
    o = o || {};
    var W = mid(P, Q);
    return ptPart(prompt, W, { cands: midCands(P, Q).concat(o.cands || []), frac: o.frac, round: o.frac, before: o.before }, (o.pre || '') + t(mLine(P, Q, 'M', o.frac)) + '.' + (o.post || ''), o.hints || HM, text);
  }
  /* the other endpoint from A and M */
  function endPart(A, M, nb, text, frac, na, prompt, extra) {
    na = na || 'A';
    var Bp = sub(scl(M, 2), A);
    return ptPart(prompt || t(nm(na, A)) + ' is an endpoint of ' + t('\\overline{' + na + nb + '}') + ', with midpoint ' + t(nm('M', M, frac)) + '. Find ' + t(nb) + '.', Bp, { cands: endCands(A, M).concat(extra || []), before: nb + ' =' }, endSol(A, M, nb, frac), HE, text);
  }
  /* a triple-based vector: legs [a, b] with a² + b² a perfect square */
  var TRI = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [9, 12], [12, 9], [8, 15], [15, 8], [12, 16], [16, 12], [7, 24], [24, 7]];
  function triple(r, maxLeg) { var c = TRI.filter(function (p) { return p[0] <= maxLeg && p[1] <= maxLeg; }); return r.pick(c).slice(); }
  function sgn(r, p) { return [p[0] * (r.chance(0.5) ? 1 : -1), p[1] * (r.chance(0.5) ? 1 : -1)]; }
  /* a distance on a map with a scale: s units per grid unit; km: answer in kilometres when the scale is in metres (div 1000) */
  function scaledPart(prompt, A, Bq, s, unit, o) {
    o = o || {};
    var n = d2(A, Bq), u = Math.sqrt(n), D = u * s / (o.div || 1), dx = cl(Bq[0] - A[0]), dy = cl(Bq[1] - A[1]);
    var c = [[u, 'd-units', 'That is the distance in <b>grid units</b>. Multiply by the scale, ' + t(F(s)) + (o.su ? '&nbsp;' + o.su : '') + ' per unit' + (o.div ? ', then convert to ' + unit : '') + '.'],
      [u / s / (o.div || 1), 'd-scale-div', 'Each grid unit stands for ' + t(F(s)) + (o.su ? '&nbsp;' + o.su : '') + ', so <b>multiply</b> the number of units by ' + t(F(s)) + '.'],
      [n * s / (o.div || 1), 'd-no-root', 'Take the square root first (that gives the grid units), then multiply by the scale.']].concat(dCands(A, Bq, s / (o.div || 1)).filter(function (x) { return x[1] !== 'd-no-root'; }));
    if (o.div) c.push([u * s, 'd-metres', 'That is in metres. Divide by ' + t('1000') + ' to get kilometres.']);
    (o.cands || []).forEach(function (x) { c.push(x); });
    var sol = dSteps(A, Bq) + '<br>' + t('d=\\sqrt{' + sgp(dx) + '^{2}+' + sgp(dy) + '^{2}}=\\sqrt{' + nT(dx * dx) + '+' + nT(dy * dy) + '}=\\sqrt{' + nT(n) + '}' + (isSq(n) ? '=' + Math.round(u) : '\\approx ' + fx(u, 3))) + ' grid units.<br>' +
      t((isSq(n) ? Math.round(u) : fx(u, 3)) + '\\times ' + F(s) + (isSq(n) ? '=' : '\\approx ') + F(cl(u * s)) ) + (o.su ? '&nbsp;' + o.su : '') + (o.div ? ' ' + t('=' + F(cl(u * s / o.div))) + '&nbsp;' + unit : '') + '.';
    var hints = ['First find the distance in grid units with the distance formula.', 'Then multiply by the scale' + (o.div ? ' and convert metres to kilometres (÷ 1000)' : '') + '.'];
    if (isInt(cl(D))) return B.number(prompt, cl(D), matchDiag(c), sol, hints, o.text, { after: unit });
    return B.approx(prompt, D, o.dp == null ? 1 : o.dp, { after: unit, diag: matchDiag(c, o.dp == null ? 1 : o.dp) }, sol, hints, o.text);
  }
  /* an exact distance (whole number or simplest radical); dec: also accept a decimal to the nearest tenth */
  function distPart(prompt, A, Bq, text, o) {
    o = o || {};
    var n = d2(A, Bq), p = { prompt: prompt, input: { type: 'math', keys: 'radical', before: o.before, after: o.after }, check: lenCheck(n, 1, { dec: o.dec, cands: dCands(A, Bq).concat(o.cands || []) }), key: lenKey(n),
      answer: t((o.name ? o.name + '=' : '') + lenTex(n) + (isSq(n) ? '' : '\\approx ' + fx(Math.sqrt(n), 1))), solution: dSteps(A, Bq) + '<br>' + t(dLine(A, Bq, o.name || 'd') + simpTail(n) + (isSq(n) ? '' : '\\approx ' + fx(Math.sqrt(n), 1))) + '.', hints: HD, text: text };
    p.bad = [String(n), String(Math.abs(Bq[0] - A[0]) + Math.abs(Bq[1] - A[1]))].filter(function (b) { return Math.abs(Number(b) - Math.sqrt(n)) > 0.06; });
    if (!isSq(n)) p.good = [fx(Math.sqrt(n), 1)].filter(function () { return !!o.dec; });
    return p;
  }
  /* money: any amount equal to the cents (with or without $ and trailing zeros) */
  function moneyCheck(v, cands) {
    return function (resp) {
      var raw = String(resp == null ? '' : resp).replace(/\\\$|\$|\\text\{\s*\\?\$\s*\}/g, '').replace(/,/g, '').trim(), p = HW.parse.number(raw);
      if (!p.ok) return form(p.code === 'empty' ? 'empty' : 'notnumber', p.code === 'empty' ? 'Type your answer first.' : 'Enter the amount as a number of dollars, e.g. 43.50.');
      if (Math.abs(p.value - v) < 0.005) return ok();
      var h = matchDiag(cands || [], 2)(p.value); if (h) return wrong(h.code, h.hint);
      if (Math.abs(p.value - v) < 0.6) return form('round', 'Close — work to the cent: keep the decimals until the end.');
      return wrong('value', null);
    };
  }
  function moneyPart(prompt, v, cands, sol, hints, text) {
    return { prompt: prompt, input: { type: 'number', before: '$' }, check: moneyCheck(v, cands), key: v.toFixed(2), answer: t('\\$' + v.toFixed(2)), solution: sol, hints: hints, text: text, good: [String(cl(v))], bad: (cands || []).map(function (c) { return c[0].toFixed(2); }) };
  }
  /* ======================= Assignment 5 ======================= */
  var QUESTIONS = [
    { num: '1', section: 'Part A — Finding a missing endpoint', stem: 'In each case, one endpoint and the midpoint of a segment are given. Determine the coordinates of the other endpoint.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { var o = r.chance(0.15) ? { A: [3, 2], M: [8, 6] } : pickWhere(function () { var A = [r.int(1, 7), r.int(1, 7)]; return { A: A, M: [A[0] + r.int(2, 6), A[1] + r.int(2, 6)] }; }, function () { return true; }); return endPart(o.A, o.M, 'Q', 'missing endpoint (a)', false, 'P'); } },
      { id: '1b', level: 'BEG', make: function (r) { var o = r.chance(0.15) ? { A: [6, 9], M: [10, 4] } : pickWhere(function () { var A = [r.int(2, 8), r.int(5, 10)]; return { A: A, M: [A[0] + r.int(2, 6), r.int(2, A[1] - 2)] }; }, function (z) { return 2 * z.M[1] - z.A[1] < 0 || r.chance(0.4); }); return endPart(o.A, o.M, 'B', 'missing endpoint (b)'); } }] },
    { num: '2', stem: 'Same idea, but the coordinates involve negative numbers — the method is the same, just be careful adding signed numbers.', parts: [
      { id: '2a', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { A: [-5, -3], M: [0, 2] } : pickWhere(function () { return { A: [-r.int(1, 8), -r.int(1, 8)], M: [r.int(-2, 3), r.int(-1, 4)] }; }, function (z) { return z.M[0] !== z.A[0] && z.M[1] !== z.A[1]; }); return endPart(o.A, o.M, 'D', 'missing endpoint, negatives (a)', false, 'C'); } },
      { id: '2b', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { A: [-8, 6], M: [-2, -1] } : pickWhere(function () { return { A: [-r.int(2, 10), r.int(1, 9)], M: [-r.int(1, 4), -r.int(1, 5)] }; }, function (z) { return z.M[0] !== z.A[0]; }); return endPart(o.A, o.M, 'F', 'missing endpoint, negatives (b)', false, 'E'); } }] },
    { num: '3', parts: [
      { id: '3', level: 'EMG', make: function (r) {
        var o = r.chance(0.15) ? { A: [1, 3], M: [5, 9] } : pickWhere(function () { var A = [r.int(0, 6), r.int(0, 6)]; return { A: A, M: [A[0] + r.int(2, 7), A[1] + r.int(2, 7)] }; }, function () { return true; });
        return endPart(o.A, o.M, 'H', 'canal harbour', false, 'R', 'A canal has a lock built at its midpoint, ' + t(nm('M', o.M)) + '. One end of the canal, at the reservoir, is located at ' + t(nm('R', o.A)) + '. Determine the coordinates of the harbour, ' + t('H') + ', at the other end of the canal.');
      } }] },
    { num: '4', parts: [
      { id: '4', level: 'EMG', make: function (r) {
        var o = r.chance(0.15) ? { A: [-10, 1], M: [-4, 7] } : pickWhere(function () { return { A: [-r.int(4, 12), r.pick(pm(1, 6))], M: [-r.int(1, 6), r.int(2, 9)] }; }, function (z) { return z.M[0] > z.A[0] && z.M[1] !== z.A[1]; });
        return endPart(o.A, o.M, 'T', 'pipeline storage tank', false, 'P', 'An underground pipeline runs from a pumping station to a storage tank. A shut-off valve sits at the pipeline’s midpoint, ' + t(nm('M', o.M)) + '. The pumping station is at ' + t(nm('P', o.A)) + '. Determine the coordinates of the storage tank, ' + t('T') + '.');
      } }] },
    /* ---------------- Part B ---------------- */
    { num: '5', section: 'Part B — Distance and map applications', stem: 'Determine the exact distance between each pair of points.', parts: [
      { id: '5a', level: 'BEG', make: function (r) { var o = r.chance(0.15) ? { A: [1, 2], v: [8, 6] } : { A: [r.int(0, 6), r.int(0, 6)], v: triple(r, 9) }; var Bq = add(o.A, o.v); return distPart(pairTex('A', o.A, 'B', Bq), o.A, Bq, 'exact distance (a)', { before: 'AB =', name: 'AB' }); } },
      { id: '5b', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { A: [-3, 5], v: [8, -15] } : pickWhere(function () { var v = triple(r, 16); return { A: [-r.int(1, 7), r.int(1, 8)], v: [v[0], -v[1]] }; }, function (z) { return Math.abs(z.A[1] + z.v[1]) <= 15; }); var Bq = add(o.A, o.v); return distPart(pairTex('C', o.A, 'D', Bq), o.A, Bq, 'exact distance (b)', { before: 'CD =', name: 'CD' }); } }] },
    { num: '6', parts: [
      { id: '6', level: 'EMG', make: function (r) {
        var o = r.chance(0.15) ? { A: [2, 3], Bq: [9, -4] } : pickWhere(function () { return { A: [r.int(0, 6), r.int(1, 7)], Bq: [r.int(4, 12), -r.int(1, 8)] }; }, function (z) { var n = d2(z.A, z.Bq); return !isSq(n) && z.Bq[0] > z.A[0] + 1; });
        var D = dist(o.A, o.Bq);
        return B.approx('Determine the distance between ' + t(nm('E', o.A)) + ' and ' + t(nm('F', o.Bq)) + ', to the nearest tenth.', D, 1, { after: 'units', diag: matchDiag(dCands(o.A, o.Bq), 1) }, dSteps(o.A, o.Bq) + '<br>' + t(dLine(o.A, o.Bq, 'EF') + '\\approx ' + fx(D, 1)) + ' units.', HD, 'distance to the nearest tenth');
      } }] },
    { num: '7', parts: [
      { id: '7', level: 'PRG', make: function (r) {
        var o = r.chance(0.15) ? { A: [2, 5], v: [12, 5], s: 300 } : { A: [r.int(0, 6), r.int(0, 6)], v: triple(r, 12), s: r.pick([100, 200, 250, 300, 400, 500]) };
        var Bq = add(o.A, o.v);
        return scaledPart('A ferry travels from a dock at ' + t(ptT(o.A)) + ' to an island at ' + t(ptT(Bq)) + ' on a lake map, where each grid unit represents ' + t(o.s) + '&nbsp;m. Determine the length of the ferry’s route, in metres.', o.A, Bq, o.s, 'm', { su: 'm', text: 'ferry route in metres' });
      } }] },
    { num: '8', parts: [
      { id: '8', level: 'PRG', make: function (r) {
        var o = r.chance(0.15) ? { A: [-10, -5], v: [24, 7], s: 3 } : pickWhere(function () { return { A: [-r.int(2, 12), -r.int(1, 8)], v: triple(r, 24), s: r.pick([2, 3, 4, 5, 10]) }; }, function (z) { return z.A[0] + z.v[0] > 0; });
        var Bq = add(o.A, o.v);
        return scaledPart('An airplane’s flight path is tracked from an airport at ' + t(ptT(o.A)) + ' to a beacon tower at ' + t(ptT(Bq)) + ', where each grid unit represents ' + t(o.s) + '&nbsp;km. Determine the flight distance, in kilometres.', o.A, Bq, o.s, 'km', { su: 'km', text: 'flight distance in km' });
      } }] },
    /* ---------------- Part C ---------------- */
    { num: '9', section: 'Part C — Midpoint applications', parts: [
      { id: '9', level: 'EMG', make: function (r) {
        var o = r.chance(0.15) ? { P: [-8, 5], Q: [10, -3] } : pickWhere(function () { return { P: [-r.int(2, 12), r.int(1, 10)], Q: [r.int(2, 12), -r.int(1, 10)] }; }, function (z) { return even(z.P[0] + z.Q[0]) && even(z.P[1] + z.Q[1]) && z.P[0] + z.Q[0] !== 0; });
        return midP('Two friends, Jasmine at ' + t(nm('J', o.P)) + ' and Kyle at ' + t(nm('K', o.Q)) + ', want to meet at a coffee shop exactly halfway between their houses (1 grid unit represents 1 block). Determine the coordinates of the coffee shop.', o.P, o.Q, 'coffee shop midpoint');
      } }] },
    { num: '10', parts: [
      { id: '10', level: 'EMG', make: function (r) {
        var o = r.chance(0.15) ? { P: [-14, 20], Q: [22, -8] } : pickWhere(function () { return { P: [-r.int(4, 24), r.int(4, 26)], Q: [r.int(4, 26), -r.int(2, 20)] }; }, function (z) { return even(z.P[0] + z.Q[0]) && even(z.P[1] + z.Q[1]) && z.P[0] + z.Q[0] !== 0 && z.P[1] + z.Q[1] !== 0; });
        return midP('A straight road connects Elm Junction at ' + t(ptT(o.P)) + ' and Birch Junction at ' + t(ptT(o.Q)) + '. A rest stop is to be built at the midpoint of the road. Determine the coordinates of the rest stop.', o.P, o.Q, 'rest stop midpoint');
      } }] },
    /* ---------------- Part D ---------------- */
    { num: '11', section: 'Part D — Combining both formulas', shared: function (r) {
        if (r.chance(0.15)) return { A: [3, 2], h: [6, 8], s: 25 };
        return { A: [r.int(0, 6), r.int(0, 6)], h: triple(r, 9), s: r.pick([10, 20, 25, 40, 50]) };
      },
      stem: function (o) { return 'A hiking trail begins at trailhead ' + t(nm('A', o.A)) + '. The midpoint rest bench is located at ' + t(nm('M', add(o.A, o.h))) + '. Each grid unit represents ' + t(o.s) + '&nbsp;m.'; },
      parts: [
        { id: '11a', sub: 'a', level: 'EMG', make: function (r, o) { var M = add(o.A, o.h); return endPart(o.A, M, 'B', 'far end of the trail', false, 'A', 'Determine the coordinates of the far end of the trail, ' + t('B') + '.'); } },
        { id: '11b', sub: 'b', level: 'ADV', make: function (r, o) {
          var M = add(o.A, o.h), Bq = sub(scl(M, 2), o.A), half = dist(o.A, M) * o.s;
          return scaledPart('Determine the total length of the trail, in metres.', o.A, Bq, o.s, 'm', { su: 'm', text: 'trail length in metres', cands: [[half, 'd-half', 'That is the distance from the trailhead to the bench — only half the trail. Use ' + t('A') + ' and ' + t('B') + ', or double it.'], [dist(o.A, mid(o.A, M)) * o.s, 'd-half', 'Use the endpoints ' + t('A') + ' and ' + t('B') + ' (from part a).']] });
        } }] },
    { num: '12', shared: function (r) {
        if (r.chance(0.15)) return { P: [-7, -9], v: [16, 12], s: 5 };
        return pickWhere(function () { var v = sgn(r, triple(r, 16)); v = [Math.abs(v[0]), v[1]]; return { P: [-r.int(2, 10), v[1] > 0 ? -r.int(2, 10) : r.int(2, 10)], v: v, s: r.pick([2, 3, 4, 5, 10]) }; }, function (z) { return even(z.v[0]) && even(z.v[1]); });
      },
      stem: function (o) { return 'A fence is to be built between two posts at ' + t(nm('P', o.P)) + ' and ' + t(nm('Q', add(o.P, o.v))) + ', where each grid unit represents ' + t(o.s) + '&nbsp;m.'; },
      parts: [
        { id: '12a', sub: 'a', level: 'BEG', make: function (r, o) { return midP('Determine the coordinates of the midpoint post, ' + t('M') + '.', o.P, add(o.P, o.v), 'fence midpoint post', { before: 'M =' }); } },
        { id: '12b', sub: 'b', level: 'PRG', make: function (r, o) { var Q = add(o.P, o.v); return scaledPart('Determine the total length of the fence, in metres.', o.P, Q, o.s, 'm', { su: 'm', text: 'fence length in metres', cands: [[dist(o.P, Q) * o.s / 2, 'd-half', 'That is half the fence (to the midpoint post). The fence runs from ' + t('P') + ' to ' + t('Q') + '.']] }); } }] },
    /* ---------------- Part E ---------------- */
    { num: '13', section: 'Part E — Multiple choice and numerical response', parts: [
      { id: '13', level: 'EMG', make: function (r) {
        var o = r.chance(0.2) ? { A: [10, 3], M: [4, -1] } : pickWhere(function () { return { A: [r.int(3, 12), r.int(1, 8)], M: [r.int(-2, 6), -r.int(1, 6)] }; }, function (z) { return z.A[0] !== z.M[0] && even(z.A[0] + z.M[0]) && even(z.A[1] + z.M[1]); });
        var Bq = sub(scl(o.M, 2), o.A), dis = [[mid(o.A, o.M), 'You averaged ' + t('A') + ' and ' + t('M') + ' — that point is between them. ' + t('B') + ' is beyond ' + t('M') + ': ' + t('B=2M-A') + '.'], [[Bq[0], 2 * o.M[1] + o.A[1]], 'Check the ' + t('y') + '-coordinate: double the midpoint, then <b>subtract</b> ' + t(sgp(o.A[1])) + '.'],
          [[-Bq[0], Bq[1]], 'Check the sign of the ' + t('x') + '-coordinate: ' + t('2(' + nT(o.M[0]) + ')-' + sgp(o.A[0]) + '=' + nT(Bq[0])) + '.'], [sub(o.M, o.A), 'That is the step from ' + t('A') + ' to ' + t('M') + '. Take the step again from ' + t('M') + '.'], [add(scl(o.M, 2), o.A), 'Subtract the endpoint after doubling the midpoint.']];
        var opts = [{ html: t(ptT(Bq)), right: true }], seen = [ptKey(Bq)];
        dis.forEach(function (d) { if (opts.length < 4 && seen.indexOf(ptKey(d[0])) < 0) { seen.push(ptKey(d[0])); opts.push({ html: t(ptT(d[0])), why: d[1] }); } });
        return mcPart(r, '<i>(Multiple Choice)</i> The midpoint of ' + t('\\overline{AB}') + ' is ' + t(nm('M', o.M)) + '. If ' + t('A') + ' is ' + t(ptT(o.A)) + ', the coordinates of ' + t('B') + ' are', opts, endSol(o.A, o.M, 'B'), HE, 'MC missing endpoint');
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'BEG', make: function (r) {
        var o = r.chance(0.2) ? { A: [1, 1], v: [4, 3] } : { A: [r.int(-3, 5), r.int(-3, 5)], v: triple(r, 12) };
        var Bq = add(o.A, o.v), a = o.v[0], b = o.v[1], D = Math.sqrt(a * a + b * b);
        return mcPart(r, '<i>(Multiple Choice)</i> The distance between the points ' + t(ptT(o.A)) + ' and ' + t(ptT(Bq)) + ' is', [
          { html: t(D), right: true }, { html: t(a + b), why: 'That adds the run and the rise. The distance is the hypotenuse: ' + t('\\sqrt{' + a + '^{2}+' + b + '^{2}}') + '.' },
          { html: t('\\sqrt{' + (a + b) + '}'), why: 'Square the run and the rise <b>before</b> adding: ' + t('\\sqrt{' + a + '^{2}+' + b + '^{2}}') + '.' }, { html: t(a * a + b * b), why: 'That is ' + t('d^{2}') + '. Take the square root.' }],
          dSteps(o.A, Bq) + '<br>' + t(dLine(o.A, Bq, 'd') + '=' + D) + '.', HD, 'MC distance');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var o = r.chance(0.2) ? { C: [-2, -4], M: [6, 2] } : pickWhere(function () { return { C: [r.pick(pm(1, 8)), -r.int(1, 9)], M: [r.int(1, 9), r.int(-2, 6)] }; }, function (z) { var y = 2 * z.M[1] - z.C[1]; return y > 0 && y < 100 && z.M[0] !== z.C[0]; });
        var y = 2 * o.M[1] - o.C[1], x = 2 * o.M[0] - o.C[0];
        var c = endNum(o.C[1], o.M[1]).concat([[x, 'end-gave-y', 'That is the ' + t('x') + '-coordinate of ' + t('D') + '. The question asks for the ' + t('y') + '-coordinate.']]);
        return B.nr('<i>(Numerical Response)</i> ' + t(nm('M', o.M)) + ' is the midpoint of ' + t('\\overline{CD}') + '. If ' + t('C') + ' is ' + t(ptT(o.C)) + ', the ' + t('y') + '-coordinate of ' + t('D') + ' is ______.', y, numDiag(c),
          t('y_D=2y_M-y_C=2(' + nT(o.M[1]) + ')-' + sgp(o.C[1]) + '=' + nT(y)) + '. (The whole point is ' + t(nm('D', [x, y])) + '.)', HE, 'NR missing endpoint y');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'BEG', make: function (r) {
        var v = r.chance(0.2) ? [9, 12] : triple(r, 16), O = r.chance(0.7) ? [0, 0] : [r.int(-3, 3), r.int(-3, 3)], Bq = add(O, v), D = Math.sqrt(d2(O, Bq));
        return B.nr('<i>(Numerical Response)</i> The distance between ' + t(ptT(O)) + ' and ' + t(ptT(Bq)) + ' is ______ units.', D, matchDiag(dCands(O, Bq)), dSteps(O, Bq) + '<br>' + t(dLine(O, Bq, 'd') + '=' + D) + '.', HD, 'NR distance');
      } }] }
  ];

  /* ======================= Extra Practice 5 ======================= */
  var EXTRA = [
    /* ---- EP 1 ---- */
    { num: '1', section: 'Part A — Missing endpoints and multi-step chains', stem: 'One endpoint and the midpoint of a segment are given. Determine the other endpoint. Watch the signs in (a) and (b); in (c) the midpoint lands on a half-unit.', parts: [
      { id: 'e1a', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { A: [-7, 4], M: [-2, -3] } : pickWhere(function () { return { A: [-r.int(2, 9), r.int(1, 8)], M: [-r.int(0, 4), -r.int(1, 6)] }; }, function (z) { return z.M[0] > z.A[0]; }); return endPart(o.A, o.M, 'B', 'endpoint, signs (a)'); } },
      { id: 'e1b', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { A: [5, -11], M: [-1, -4] } : pickWhere(function () { return { A: [r.int(1, 8), -r.int(4, 12)], M: [-r.int(1, 5), -r.int(1, 6)] }; }, function (z) { return z.M[1] > z.A[1]; }); return endPart(o.A, o.M, 'D', 'endpoint, signs (b)', false, 'C'); } },
      { id: 'e1c', level: 'PRG', make: function (r) { var o = r.chance(0.15) ? { A: [3, 8], M: [0.5, 2.5] } : pickWhere(function () { return { A: [r.int(1, 8), r.int(2, 9)], M: [r.int(-2, 3) + 0.5, r.int(-2, 4) + 0.5] }; }, function (z) { return z.M[0] < z.A[0]; }); return endPart(o.A, o.M, 'F', 'endpoint, half-unit midpoint (c)', true, 'E'); } }] },
    /* ---- EP 2 ---- */
    { num: '2', shared: function (r) {
        if (r.chance(0.2)) return { A: [1, 2], M: [5, 8] };
        return pickWhere(function () { var A = [r.int(-4, 4), r.int(-4, 4)]; return { A: A, M: [A[0] + r.int(1, 5), A[1] + r.int(2, 6)] }; }, function (z) { var Bq = sub(scl(z.M, 2), z.A), n = d2(z.A, Bq); return !isSq(n) && radParts(n).k >= 2; });
      },
      stem: function (o) { return '<b>Three steps in a row.</b> ' + t(nm('A', o.A)) + ' is one endpoint of ' + t('\\overline{AB}') + ', and ' + t(nm('M', o.M)) + ' is the midpoint of ' + t('\\overline{AB}') + '.'; },
      parts: [
        { id: 'e2a', sub: 'a', level: 'EMG', make: function (r, o) { return endPart(o.A, o.M, 'B', 'B (three steps)', false, 'A', 'Determine the coordinates of ' + t('B') + '.'); } },
        { id: 'e2b', sub: 'b', level: 'PRG', make: function (r, o) {
          var Bq = sub(scl(o.M, 2), o.A), n = d2(o.A, Bq), c = dCands(o.A, Bq).concat([[dist(o.A, o.M), 'd-half', 'That is ' + t('AM') + ' — half the segment. Use ' + t('A') + ' and ' + t('B') + '.']]);
          return B.fields('Determine the exact length of ' + t('\\overline{AB}') + ' in simplest radical form, then round to the nearest tenth.', [lenField('AB'), decField('AB')], [lenCheck(n, 1, { cands: c }), decCheck(n, 1, { cands: c })], [lenKey(n), fx(Math.sqrt(n), 1)],
            t('AB=' + lenTex(n) + '\\approx ' + fx(Math.sqrt(n), 1)), dSteps(o.A, Bq) + '<br>' + t(dLine(o.A, Bq, 'AB') + simpTail(n) + '\\approx ' + fx(Math.sqrt(n), 1)) + '.', HD.concat(['To simplify ' + t('\\sqrt{' + n + '}') + ', look for its largest perfect-square factor.']), 'AB exact and decimal');
        } },
        { id: 'e2c', sub: 'c', level: 'EMG', make: function (r, o) {
          var Bq = sub(scl(o.M, 2), o.A);
          return midP('Determine the midpoint of ' + t('\\overline{MB}') + ' — the point one-quarter of the way along ' + t('\\overline{AB}') + ', measuring from ' + t('B') + '.', o.M, Bq, 'midpoint of MB', { frac: true, cands: [[mid(o.A, o.M), 'mid-wrong-seg', 'That is the midpoint of ' + t('\\overline{AM}') + '. Use ' + t('M') + ' and ' + t('B') + '.'], [o.M, 'mid-wrong-seg', 'That is ' + t('M') + ', the midpoint of ' + t('\\overline{AB}') + '. Now find the midpoint of ' + t('M') + ' and ' + t('B') + '.']], pre: 'Use ' + t(nm('B', Bq)) + ' from (a): ' });
        } }] },
    /* ---- EP 3: Devon ---- */
    { num: '3', shared: function (r) {
        if (r.chance(0.2)) return { A: [3, -4], M: [7, 1] };
        return pickWhere(function () { return { A: [r.int(-3, 5), -r.int(1, 7)], M: [r.int(2, 9), r.int(-1, 5)] }; }, function (z) { var d = sub(z.M, z.A); return d[0] > 0 && d[1] > 0 && (!even(z.A[0] + d[0]) || !even(z.A[1] + d[1])) && !samePt(d, z.M); });
      },
      stem: function (o) { var d = sub(o.M, o.A); return '<b>Error analysis.</b> Devon is told that ' + t(nm('A', o.A)) + ' is one endpoint of ' + t('\\overline{AB}') + ' and that ' + t(nm('M', o.M)) + ' is the midpoint. He writes \\[B=(' + nT(o.M[0]) + '-' + sgp(o.A[0]) + ',\\ ' + nT(o.M[1]) + '-' + sgp(o.A[1]) + ')=' + ptT(d) + '.\\]'; },
      parts: [
        { id: 'e3a', sub: 'a', level: 'EMG', make: function (r, o) {
          var d = sub(o.M, o.A), W = mid(o.A, d);
          return midP('Show that Devon’s point is not correct: find the midpoint of ' + t('\\overline{AB}') + ' using his answer for ' + t('B') + ', ' + t(ptT(d)) + '.', o.A, d, 'midpoint with Devon’s B', { frac: true, cands: [[o.M, 'pt', 'That is the midpoint Devon was given — but it’s not what his ' + t('B') + ' produces. Average ' + t('A') + ' and his point ' + t(ptT(d)) + '.']], post: ' That is not ' + t(nm('M', o.M)) + ', so Devon’s ' + t('B') + ' is wrong.' });
        } },
        { id: 'e3b', sub: 'b', level: 'PRG', make: function (r, o) {
          var d = sub(o.M, o.A);
          return mcPart(r, 'What did Devon actually calculate?', [
            { html: 'The <b>change</b> from ' + t('A') + ' to ' + t('M') + ' (' + t(F(d[0])) + ' right, ' + t(F(d[1])) + ' up). That step has to be taken <b>again</b> from ' + t('M') + ' to reach ' + t('B') + '.', right: true },
            { html: 'The midpoint of ' + t('\\overline{AM}') + '.', why: 'The midpoint of ' + t('\\overline{AM}') + ' would <b>average</b> the coordinates. Devon <b>subtracted</b> them, which gives the change from ' + t('A') + ' to ' + t('M') + '.' },
            { html: 'The length of ' + t('\\overline{AM}') + '.', why: 'A length is one number. Devon’s two numbers are how far right and up ' + t('M') + ' is from ' + t('A') + '.' },
            { html: 'The correct endpoint, with the coordinates in the wrong order.', why: 'Swapping his coordinates still doesn’t give a point whose midpoint with ' + t('A') + ' is ' + t('M') + '. He found the step from ' + t('A') + ' to ' + t('M') + '.' }],
            t(nT(o.M[0]) + '-' + sgp(o.A[0]) + '=' + nT(d[0])) + ' and ' + t(nT(o.M[1]) + '-' + sgp(o.A[1]) + '=' + nT(d[1])) + ' are the change from ' + t('A') + ' to ' + t('M') + ' (' + t(F(d[0])) + ' right, ' + t(F(d[1])) + ' up). Since ' + t('M') + ' is halfway, the same change takes you from ' + t('M') + ' to ' + t('B') + ': ' + t('B=' + ptT(o.M) + '+' + ptT(d) + '=' + ptT(add(o.M, d))) + '.', ['Compare his working with ' + t('x_B=2x_M-x_A') + '.'], 'what Devon calculated');
        } },
        { id: 'e3b2', sub: 'b, correct B', level: 'EMG', make: function (r, o) { return endPart(o.A, o.M, 'B', 'correct B (Devon)', false, 'A', 'Find the correct coordinates of ' + t('B') + '.', [[sub(o.M, o.A), 'end-step', 'That is Devon’s answer — the step from ' + t('A') + ' to ' + t('M') + '. Take that step again, starting at ' + t('M') + '.']]); } }] },
    /* ---- EP 4: work backwards (Mastery) ---- */
    { num: '4', shared: function (r) {
        if (r.chance(0.2)) return { P: [2, 3], tr: [6, 8, 10], ax: 'x' };
        var tr = r.pick([[6, 8, 10], [8, 6, 10], [6, 8, 10], [10, 24, 26], [4, 3, 5], [8, 15, 17]]), ax = r.chance(0.7) ? 'x' : 'y';
        return pickWhere(function () { return { P: [r.pick(pm(1, 6)), r.pick(pm(1, 6))], tr: tr, ax: ax }; }, function (z) { var h = z.tr[0]; return ax === 'x' ? Math.abs(z.P[1]) * 2 === h : Math.abs(z.P[0]) * 2 === h; });
      },
      stem: function (o) { return '<b>Work backwards.</b> A segment has one endpoint at ' + t(nm('P', o.P)) + ', has a length of ' + t(o.tr[2]) + ' units, and its midpoint lies on the ' + t(o.ax) + '-axis.'; },
      parts: [
        { id: 'e4a', sub: 'a', level: 'PRG', make: function (r, o) {
          var i = o.ax === 'x' ? 1 : 0, c = o.ax === 'x' ? 'y' : 'x', v = o.P[i], w = -v;
          return mcPart(r, 'Explain why the ' + t(c) + '-coordinate of the other endpoint must be ' + t(nT(w)) + '.', [
            { html: 'A point on the ' + t(o.ax) + '-axis has ' + t(c + '=0') + ', so the midpoint’s ' + t(c) + '-coordinate is ' + t('0') + ': ' + t('\\tfrac{' + nT(v) + '+' + c + '_2}{2}=0') + ' gives ' + t(c + '_2=' + nT(w)) + '.', right: true },
            { html: 'The other endpoint must be on the ' + t(o.ax) + '-axis too.', why: 'Then its ' + t(c) + '-coordinate would be ' + t('0') + ', not ' + t(nT(w)) + '. It is the <b>midpoint</b> that is on the axis.' },
            { html: 'The length ' + t(o.tr[2]) + ' tells us the ' + t(c) + '-coordinate directly.', why: 'The length involves both coordinates. The ' + t(c) + '-coordinate comes from the midpoint being on the ' + t(o.ax) + '-axis.' },
            { html: 'Every segment’s endpoints have opposite ' + t(c) + '-coordinates.', why: 'Not in general. It happens here because the midpoint is on the ' + t(o.ax) + '-axis, where ' + t(c + '=0') + '.' }],
            'The midpoint is on the ' + t(o.ax) + '-axis, so its ' + t(c) + '-coordinate is ' + t('0') + ': ' + t('\\tfrac{' + nT(v) + '+' + c + '_2}{2}=0\\Rightarrow ' + nT(v) + '+' + c + '_2=0\\Rightarrow ' + c + '_2=' + nT(w)) + '.', ['What is the ' + t(c) + '-coordinate of every point on the ' + t(o.ax) + '-axis?'], 'why the coordinate is the opposite');
        } },
        { id: 'e4b', sub: 'b', level: 'MAS', make: function (r, o) {
          var xa = o.ax === 'x', i = xa ? 1 : 0, j = 1 - i, v = o.P[i], w = -v, h = Math.abs(w - v), s = o.tr[1], L = o.tr[2];
          var W = [0, 1].map(function (k) { var p = [0, 0]; p[i] = w; p[j] = o.P[j] + (k ? -s : s); return p; });
          var c = xa ? 'y' : 'x', u = xa ? 'x' : 'y';
          var chk = ptsCheck(W, { missCode: 'ax-one', missHint: 'Correct so far — but ' + t('(' + u + '_2-' + sgp(o.P[j]) + ')^{2}=' + s * s) + ' gives <b>two</b> values. Find the other endpoint.', diag: function (Lp) {
            if (Lp.some(function (p) { return !same(p[i], w); })) return { code: 'pts', hint: 'Both possible endpoints have ' + t(c + '=' + nT(w)) + ' (part a).' };
            var us = Lp.map(function (p) { return p[j]; });
            if (us.some(function (x) { return same(x, o.P[j] + L) || same(x, o.P[j] - L); })) return { code: 'ax-no-leg', hint: 'Include the ' + t(c) + '-difference: ' + t('(' + u + '_2-' + sgp(o.P[j]) + ')^{2}+(' + nT(w) + '-' + sgp(v) + ')^{2}=' + L + '^{2}') + '.' };
            if (us.some(function (x) { return same(x, -o.P[j] + s) || same(x, -o.P[j] - s); })) return { code: 'ax-sign', hint: 'Check the signs: ' + t(u + '_2-' + sgp(o.P[j]) + '=\\pm ' + s) + ', so ' + t(u + '_2=' + nT(o.P[j]) + '\\pm ' + s) + '.' };
            if (us.some(function (x) { return same(x, o.P[j] + s * s) || same(x, o.P[j] - s * s); })) return { code: 'ax-no-root', hint: 'Take the square root: ' + t('(' + u + '_2-' + sgp(o.P[j]) + ')^{2}=' + s * s) + ' means ' + t(u + '_2-' + sgp(o.P[j]) + '=\\pm ' + s) + '.' };
            return null; } });
          var eq = xa ? '(x_2-' + sgp(o.P[0]) + ')^{2}+(' + nT(w) + '-' + sgp(v) + ')^{2}=' + L + '^{2}' : '(' + nT(w) + '-' + sgp(v) + ')^{2}+(y_2-' + sgp(o.P[1]) + ')^{2}=' + L + '^{2}';
          return { prompt: 'Use the distance formula to find <b>both</b> possible locations of the other endpoint. (Separate the two points with a comma.)', input: { type: 'math', keys: 'pairs', placeholder: 'e.g. (3, -1), (-5, -1)' }, check: chk,
            key: ptKey(W[0]) + ', ' + ptKey(W[1]), answer: t(ptT(W[0])) + ' or ' + t(ptT(W[1])), text: 'both endpoints from a length', good: [ptKey(W[1]) + ', ' + ptKey(W[0])], bad: [ptKey(W[0]), ptKey(W[1])],
            hints: ['The other endpoint is ' + t(xa ? '(x_2,\\ ' + nT(w) + ')' : '(' + nT(w) + ',\\ y_2)') + '. Put it and ' + t('P') + ' into the distance formula and set it equal to ' + t(L) + '.', 'Square both sides. A squared bracket equal to a number gives <b>two</b> answers (±).'],
            solution: 'The other endpoint is ' + t(xa ? '(x_2,\\ ' + nT(w) + ')' : '(' + nT(w) + ',\\ y_2)') + '.<br>' + t(eq) + '<br>' + t('(' + u + '_2-' + sgp(o.P[j]) + ')^{2}+' + h * h + '=' + L * L) + ', so ' + t('(' + u + '_2-' + sgp(o.P[j]) + ')^{2}=' + s * s) + '<br>' + t(u + '_2-' + sgp(o.P[j]) + '=\\pm ' + s) + ', so ' + t(u + '_2=' + nT(W[0][j]) + '\\text{ or }' + nT(W[1][j])) + ': ' + t(ptT(W[0])) + ' or ' + t(ptT(W[1])) + '.' };
        } },
        { id: 'e4c', sub: 'c', level: 'ADV', make: function (r, o) {
          var xa = o.ax === 'x', i = xa ? 1 : 0, j = 1 - i, w = -o.P[i], s = o.tr[1];
          var W = [0, 1].map(function (k) { var p = [0, 0]; p[i] = w; p[j] = o.P[j] + (k ? -s : s); return p; }), Ms = W.map(function (q) { return mid(o.P, q); });
          return B.fields('State the midpoint that goes with each of your two answers, ' + t(ptT(W[0])) + ' and ' + t(ptT(W[1])) + '.', [ptField('With ' + t(ptT(W[0])) + ':', 'M1'), ptField('With ' + t(ptT(W[1])) + ':', 'M2')],
            [ptCheck(Ms[0], { cands: midCands(o.P, W[0]).concat([[Ms[1], 'mid-wrong-seg', 'That midpoint goes with the <b>other</b> endpoint.']]) }), ptCheck(Ms[1], { cands: midCands(o.P, W[1]).concat([[Ms[0], 'mid-wrong-seg', 'That midpoint goes with the <b>other</b> endpoint.']]) })], Ms.map(ptKey),
            t(ptT(W[0]) + '\\to ' + ptT(Ms[0])) + ', ' + t(ptT(W[1]) + '\\to ' + ptT(Ms[1])), t(mLine(o.P, W[0])) + '<br>' + t(mLine(o.P, W[1])) + '<br>Both lie on the ' + t(o.ax) + '-axis ✓', HM, 'midpoints for both answers');
        } }] },
    /* ---- EP 5: reasoning ---- */
    { num: '5', stem: '<b>Reasoning.</b> Consider a segment with endpoints ' + t('(x_1,\\ y_1)') + ' and ' + t('(x_2,\\ y_2)') + '.', parts: [
      { id: 'e5a', sub: 'a', level: 'EMG', make: function (r) { return condMC(r, 'x'); } },
      { id: 'e5a2', sub: 'a, example', level: 'PRG', make: function (r) { return exPart(r, 'x'); } },
      { id: 'e5b', sub: 'b', level: 'EMG', make: function (r) { return condMC(r, 'y'); } },
      { id: 'e5b2', sub: 'b, example', level: 'PRG', make: function (r) { return exPart(r, 'y'); } },
      { id: 'e5c', sub: 'c', level: 'EMG', make: function (r) { return condMC(r, 'o'); } },
      { id: 'e5c2', sub: 'c, example', level: 'PRG', make: function (r) { return exPart(r, 'o'); } }] },
    /* ---- EP 6: map ---- */
    { num: '6', section: 'Part B — Maps, routes, and costs', shared: function (r) {
        if (r.chance(0.2)) return { L: [-6, 2], R: [6, 7], G: [2, -6], s: 100 };
        return pickWhere(function () { return { L: [-r.int(3, 8), r.int(-2, 4)], R: [r.int(3, 8), r.int(3, 9)], G: [r.int(-2, 5), -r.int(3, 8)], s: r.pick([50, 100, 100, 200]) }; }, function (z) {
          var n = [d2(z.L, z.R), d2(z.L, z.G), d2(z.R, z.G)], s = n.slice().sort(function (a, b) { return a - b; }), k = n.indexOf(s[0]), pr = [[z.L, z.R], [z.L, z.G], [z.R, z.G]][k];
          return Math.sqrt(s[1]) - Math.sqrt(s[0]) > 0.4 && Math.sqrt(s[2]) - Math.sqrt(s[1]) > 0.4 && even(pr[0][0] + pr[1][0]) && even(pr[0][1] + pr[1][1]) && !isSq(s[0]) && n.some(function (x) { return !isSq(x); });
        });
      },
      stem: function (o) { return 'On a city map, the library sits at ' + t(nm('L', o.L)) + ', the rink at ' + t(nm('R', o.R)) + ', and the gym at ' + t(nm('G', o.G)) + '. Each grid unit represents ' + t(o.s) + '&nbsp;m.' + figPoly([o.L, o.R, o.G], ['L', 'R', 'G'], { max: 280 }); },
      parts: [
        { id: 'e6a', sub: 'a', level: 'PRG', make: function (r, o) {
          var S = [['L', 'R'], ['L', 'G'], ['R', 'G']], n = S.map(function (s) { return d2(o[s[0]], o[s[1]]); });
          return B.fields('Determine the exact distance between each of the three pairs of buildings (in grid units). Leave radicals in simplest form.', S.map(function (s) { return lenField(s[0] + s[1]); }), S.map(function (s, i) { return lenCheck(n[i], 1, { cands: dCands(o[s[0]], o[s[1]]) }); }), n.map(function (x) { return lenKey(x); }),
            S.map(function (s, i) { return t(s[0] + s[1] + '=' + lenTex(n[i])); }).join(', '), S.map(function (s, i) { return t(dLine(o[s[0]], o[s[1]], s[0] + s[1]) + simpTail(n[i])); }).join('<br>'), HD, 'three exact distances');
        } },
        { id: 'e6b', sub: 'b', level: 'EMG', make: function (r, o) {
          var S = [['L', 'R', 'library and the rink'], ['L', 'G', 'library and the gym'], ['R', 'G', 'rink and the gym']], n = S.map(function (s) { return d2(o[s[0]], o[s[1]]); }), mn = Math.min.apply(null, n), mx = Math.max.apply(null, n);
          var list = S.map(function (s, i) { return t(s[0] + s[1] + '\\approx ' + fx(Math.sqrt(n[i]), 1)); }).join(', ');
          return mcPart(r, 'Which two buildings are closest together? (Compare the three distances to the nearest tenth of a unit.)', S.map(function (s, i) { return { html: 'The ' + s[2] + ' (' + t(s[0] + s[1] + '\\approx ' + fx(Math.sqrt(n[i]), 1)) + ')', right: n[i] === mn, why: n[i] === mx ? 'That is the <b>farthest</b> pair. Closest means the smallest distance.' : 'Compare: ' + list + '. Which is smallest?' }; }),
            'To the nearest tenth: ' + list + '. The smallest is ' + t(S[n.indexOf(mn)][0] + S[n.indexOf(mn)][1]) + ', so the <b>' + S[n.indexOf(mn)][2] + '</b> are closest.', ['Round each exact distance from part (a) to one decimal place and compare.'], 'closest pair', true);
        } },
        { id: 'e6c', sub: 'c', level: 'EMG', make: function (r, o) {
          var pr = closest(o);
          return midP('Two students want to meet exactly halfway between the <b>closest</b> pair. Determine the coordinates of that meeting point.', pr[0], pr[1], 'meeting point of the closest pair', { pre: 'The closest pair is ' + t(pr[2] + pr[3]) + ': ' });
        } },
        { id: 'e6d', sub: 'd', level: 'ADV', make: function (r, o) {
          var pr = closest(o), n = d2(pr[0], pr[1]), h = Math.sqrt(n) / 2, D = h * o.s;
          var c = [[Math.sqrt(n) * o.s, 'd-half', 'That is the whole distance between the two buildings. Each student walks only to the halfway point.'], [h, 'd-units', 'That is in grid units. Multiply by ' + t(o.s) + '&nbsp;m.'], [n / 4 * o.s, 'd-no-root', 'Take the square root before multiplying by the scale.']];
          return B.approx('How far, in metres, would each student walk to reach the meeting point? Round to the nearest metre.', D, 0, { after: 'm', diag: matchDiag(c, 0) },
            'Each student walks half of ' + t(pr[2] + pr[3] + '=' + lenTex(n)) + ': ' + t('\\tfrac{1}{2}\\times ' + lenTex(n) + '=' + lenTex(n, 2) + '\\approx ' + fx(h, 4)) + ' units.<br>' + t(fx(h, 4) + '\\times ' + o.s + '\\approx ' + fx(D, 0)) + '&nbsp;m each.', ['The meeting point is the midpoint: each student walks half the distance.', 'Convert grid units to metres at the end, then round.'], 'each student walks');
        } }] },
    /* ---- EP 7: gate ---- */
    { num: '7', shared: function (r) {
        if (r.chance(0.2)) return { w: 2.4, h: 1.8, c: 14.5 };
        var D = [[4, 3, 0.2], [4, 3, 0.3], [4, 3, 0.4], [4, 3, 0.5], [4, 3, 0.6], [4, 3, 0.7], [4, 3, 0.8], [3, 4, 0.3], [3, 4, 0.4], [3, 4, 0.5], [3, 4, 0.6], [8, 6, 0.1], [8, 6, 0.2], [8, 6, 0.3], [12, 5, 0.1], [12, 5, 0.2], [15, 8, 0.1], [24, 7, 0.1], [12, 9, 0.1], [12, 9, 0.2]];
        return pickWhere(function () { var d = r.pick(D); return { w: cl(d[0] * d[2]), h: cl(d[1] * d[2]), c: r.pick([9.5, 11.25, 12.5, 14.5, 16.75, 18, 21.5, 24, 8.75]) }; }, function (z) { return isInt(cl(Math.hypot(z.w, z.h) * z.c * 100)); });
      },
      stem: function (o) { return 'A rectangular gate is ' + t(nT(o.w)) + '&nbsp;m wide and ' + t(nT(o.h)) + '&nbsp;m tall. Place the bottom-left corner at ' + t('(0,\\ 0)') + ', so the top-right corner is at ' + t(ptT([o.w, o.h])) + '. A diagonal brace runs corner to corner.' + gateFig(o); },
      parts: [
        { id: 'e7a', sub: 'a', level: 'EMG', make: function (r, o) {
          var L = cl(Math.hypot(o.w, o.h));
          return B.number('Use the distance formula to determine the exact length of the brace.', L, numDiag([[o.w + o.h, 'd-legs', 'You added the width and the height. The brace is the hypotenuse: ' + t('\\sqrt{' + nT(o.w) + '^{2}+' + nT(o.h) + '^{2}}') + '.'], [cl(o.w * o.w + o.h * o.h), 'd-no-root', 'Take the square root.']]),
            t('d=\\sqrt{(' + nT(o.w) + '-0)^{2}+(' + nT(o.h) + '-0)^{2}}=\\sqrt{' + nT(o.w * o.w) + '+' + nT(o.h * o.h) + '}=\\sqrt{' + nT(o.w * o.w + o.h * o.h) + '}=' + nT(L)) + '&nbsp;m.', HD.concat(['With decimals: ' + t(nT(o.w) + '^{2}=' + nT(o.w * o.w)) + '.']), 'brace length', { after: 'm' });
        } },
        { id: 'e7b', sub: 'b', level: 'EMG', make: function (r, o) {
          var L = cl(Math.hypot(o.w, o.h)), v = cl(L * o.c);
          return moneyPart('Brace stock costs ' + t('\\$' + o.c.toFixed(2)) + ' per metre. Determine the cost of one brace.', v, [[L, 'u6l5-cost-length', 'That is the length of the brace. Multiply it by the price per metre.'], [cl((o.w + o.h) * o.c), 'd-legs', 'The brace is the diagonal, ' + t(nT(L)) + '&nbsp;m long — not the width plus the height.']],
            t(nT(L) + '\\times \\$' + o.c.toFixed(2) + '=\\$' + v.toFixed(2)) + '.', ['Cost = length × price per metre.'], 'cost of one brace');
        } },
        { id: 'e7c', sub: 'c', level: 'EMG', make: function (r, o) {
          var L = cl(Math.hypot(o.w, o.h)), v = cl(2 * L * o.c);
          return moneyPart('The builder decides to add a second brace running from ' + t(ptT([0, o.h])) + ' to ' + t(ptT([o.w, 0])) + ', forming an X. At ' + t('\\$' + o.c.toFixed(2)) + ' per metre, determine the total cost of both braces.', v, [[cl(L * o.c), 'u6l5-cost-one', 'That is one brace. The second brace is the other diagonal — the same length — so double it.']],
            'The second brace is the other diagonal: ' + t('\\sqrt{(' + nT(o.w) + '-0)^{2}+(0-' + nT(o.h) + ')^{2}}=' + nT(L)) + '&nbsp;m, the same length.<br>' + t('2\\times \\$' + cl(L * o.c).toFixed(2) + '=\\$' + v.toFixed(2)) + '.', ['How long is the second brace?'], 'cost of two braces');
        } }] },
    /* ---- EP 8: courier ---- */
    { num: '8', shared: function (r) {
        if (r.chance(0.2)) return { D: [-6, -3], A: [2, 3], B: [6, 0], C: [6, -8], s: 500 };
        return pickWhere(function () {
          var v1 = r.pick([[8, 6], [6, 8], [4, 3], [3, 4], [12, 5]]), v2 = sgn(r, r.pick([[4, 3], [3, 4], [6, 8], [5, 12]])), v3 = r.chance(0.5) ? [0, -r.int(4, 10)] : [r.int(3, 9), 0];
          var D = [r.int(-8, -4), r.int(-6, 0)], A = add(D, v1), Bq = add(A, v2), C = add(Bq, v3);
          return { D: D, A: A, B: Bq, C: C, s: r.pick([250, 500, 500, 200]) };
        }, function (z) { var n = d2(z.D, z.C); return isSq(n) && n > 0 && [z.A, z.B, z.C].every(function (p) { return Math.abs(p[0]) <= 12 && Math.abs(p[1]) <= 12; }) && Math.sqrt(n) < dist(z.D, z.A) + dist(z.A, z.B) + dist(z.B, z.C) - 1; });
      },
      stem: function (o) { return 'A courier leaves the depot at ' + t(nm('D', o.D)) + ', drives to ' + t(nm('A', o.A)) + ', then to ' + t(nm('B', o.B)) + ', then to ' + t(nm('C', o.C)) + '. Each grid unit represents ' + t(o.s) + '&nbsp;m.' + figPoly([o.D, o.A, o.B, o.C], ['D', 'A', 'B', 'C'], { segs: [[o.D, o.A, o.B, o.C]], max: 300 }); },
      parts: [
        { id: 'e8a', sub: 'a', level: 'EMG', make: function (r, o) {
          var S = [['D', 'A'], ['A', 'B'], ['B', 'C']], n = S.map(function (s) { return d2(o[s[0]], o[s[1]]); });
          return B.fields('Determine the length of each of the three legs, in grid units.', S.map(function (s) { return lenField(s[0] + s[1]); }), S.map(function (s, i) { return lenCheck(n[i], 1, { cands: dCands(o[s[0]], o[s[1]]) }); }), n.map(function (x) { return lenKey(x); }),
            S.map(function (s, i) { return t(s[0] + s[1] + '=' + lenTex(n[i])); }).join(', '), S.map(function (s, i) { return t(dLine(o[s[0]], o[s[1]], s[0] + s[1]) + simpTail(n[i])); }).join('<br>'), HD.concat(['A leg along a grid line (horizontal or vertical) is just a difference of coordinates.']), 'three legs');
        } },
        { id: 'e8b', sub: 'b', level: 'PRG', make: function (r, o) {
          var u = routeU(o), km = cl(u * o.s / 1000);
          return kmPart('Determine the total distance driven, in kilometres.', km, [[u, 'd-units', 'That is in grid units. Multiply by ' + t(o.s) + '&nbsp;m, then divide by ' + t('1000') + ' for kilometres.'], [u * o.s, 'd-metres', 'That is in metres. Divide by ' + t('1000') + ' to get kilometres.'], [cl(dist(o.D, o.C) * o.s / 1000), 'd-straight', 'That is the straight-line distance from ' + t('D') + ' to ' + t('C') + '. Add the three legs.']],
            'Total ' + t('=' + nT(dist(o.D, o.A)) + '+' + nT(dist(o.A, o.B)) + '+' + nT(dist(o.B, o.C)) + '=' + nT(u)) + ' units ' + t('\\times ' + o.s + '=' + F(cl(u * o.s))) + '&nbsp;m ' + t('=' + nT(km)) + '&nbsp;km.', 'total route in km');
        } },
        { id: 'e8c', sub: 'c', level: 'PRG', make: function (r, o) {
          var u = dist(o.D, o.C), km = cl(u * o.s / 1000);
          return kmPart('Determine the straight-line distance from ' + t('D') + ' directly to ' + t('C') + ', in kilometres.', km, [[u, 'd-units', 'That is in grid units. Multiply by ' + t(o.s) + '&nbsp;m, then divide by ' + t('1000') + '.'], [u * o.s, 'd-metres', 'That is in metres. Divide by ' + t('1000') + '.'], [cl((Math.abs(o.C[0] - o.D[0]) + Math.abs(o.C[1] - o.D[1])) * o.s / 1000), 'd-legs', 'You added the run and the rise. Use the distance formula.']],
            dSteps(o.D, o.C) + '<br>' + t(dLine(o.D, o.C, 'DC') + '=' + nT(u)) + ' units ' + t('\\times ' + o.s + '=' + F(cl(u * o.s))) + '&nbsp;m ' + t('=' + nT(km)) + '&nbsp;km.', 'direct distance in km');
        } },
        { id: 'e8d', sub: 'd', level: 'EMG', make: function (r, o) {
          var a = cl(routeU(o) * o.s / 1000), b = cl(dist(o.D, o.C) * o.s / 1000), v = cl(a - b);
          return kmPart('How much shorter is the direct route, in kilometres?', v, [[a, 'u6l5-route-total', 'That is the whole route. Subtract the direct distance from it.'], [b, 'u6l5-route-total', 'That is the direct distance. Subtract it from the route length.'], [cl(a + b), 'u6l5-route-total', 'Subtract the two distances, don’t add them.']],
            t(nT(a) + '-' + nT(b) + '=' + nT(v)) + '&nbsp;km shorter.', 'how much shorter');
        } },
        { id: 'e8d2', sub: 'd, why', level: 'EMG', make: function (r) {
          return mcPart(r, 'Why must the direct route be shorter than any route that detours through other stops?', [
            { html: 'A straight line is the shortest path between two points, so any detour adds distance.', right: true },
            { html: 'Because the direct route has fewer coordinates to subtract.', why: 'The number of calculations doesn’t make a path shorter. The straight segment is the shortest possible path.' },
            { html: 'It isn’t always shorter — it depends on the scale of the map.', why: 'The scale multiplies every distance by the same number, so it can’t change which route is shorter.' },
            { html: 'Because the courier drives faster on the direct route.', why: 'Speed affects time, not distance.' }],
            'The straight segment from ' + t('D') + ' to ' + t('C') + ' is the shortest path between them; going through other stops bends the path and adds distance (unless the stops lie on that segment).', ['Think of a triangle: is one side ever longer than the other two put together?'], 'why direct is shorter');
        } }] },
    /* ---- EP 9: cell tower ---- */
    { num: '9', shared: function (r) {
        if (r.chance(0.2)) return { A: [-11, 6], B: [5, -6], s: 2, ax: 'x' };
        var ax = r.chance(0.7) ? 'x' : 'y';
        return pickWhere(function () { var T = r.pick([[16, 12], [12, 16], [6, 8], [8, 6], [12, 5], [10, 24], [24, 10]]), a = -r.int(2, 12); return ax === 'x' ? { A: [a, T[1] / 2], B: [a + T[0], -T[1] / 2], s: r.pick([2, 3, 5]), ax: 'x' } : { A: [T[0] / 2, a], B: [-T[0] / 2, a + T[1]], s: r.pick([2, 3, 5]), ax: 'y' }; },
          function (z) { return isInt(z.A[0]) && isInt(z.A[1]) && even(z.A[0] + z.B[0]) && even(z.A[1] + z.B[1]) && Math.abs(z.B[0]) <= 15 && Math.abs(z.B[1]) <= 15 && !samePt(mid(z.A, z.B), [0, 0]); });
      },
      stem: function (o) { return 'Two towns, Ashford at ' + t(nm('A', o.A)) + ' and Baxter at ' + t(nm('B', o.B)) + ', agree to share a cell tower placed exactly halfway between them. Each grid unit represents ' + t(o.s) + '&nbsp;km.'; },
      parts: [
        { id: 'e9a', sub: 'a', level: 'BEG', make: function (r, o) { return midP('Determine the coordinates of the tower.', o.A, o.B, 'tower midpoint'); } },
        { id: 'e9b', sub: 'b', level: 'PRG', make: function (r, o) { return scaledPart('Determine the distance between the two towns, in kilometres.', o.A, o.B, o.s, 'km', { su: 'km', text: 'distance between towns, km' }); } },
        { id: 'e9c', sub: 'c', level: 'EMG', make: function (r, o) { var M = mid(o.A, o.B); return scaledPart('Determine the distance from Ashford to the tower, in kilometres, and confirm that it is exactly half of your answer to (b).', o.A, M, o.s, 'km', { su: 'km', text: 'Ashford to tower, km', cands: [[dist(o.A, o.B) * o.s, 'd-half', 'That is the whole distance between the towns. The tower is halfway.']] }); } },
        { id: 'e9d', sub: 'd', level: 'EMG', make: function (r, o) {
          var M = mid(o.A, o.B), xa = o.ax === 'x', c = xa ? 'y' : 'x';
          return mcPart(r, 'The tower ends up on one of the axes. Which one, and what does that tell you about the towns?', [
            { html: 'The ' + t(o.ax) + '-axis: the towns’ ' + t(c) + '-coordinates (' + t(nT(o.A[xa ? 1 : 0])) + ' and ' + t(nT(o.B[xa ? 1 : 0])) + ') are opposites, so they add to ' + t('0') + '.', right: true },
            { html: 'The ' + t(c) + '-axis: the towns’ ' + t(o.ax) + '-coordinates are opposites.', why: 'The tower is ' + t(ptT(M)) + ': its ' + t(c) + '-coordinate is ' + t('0') + ', so it is on the ' + t(o.ax) + '-axis.' },
            { html: 'The ' + t(o.ax) + '-axis: both towns are on that axis too.', why: 'Neither town is on an axis. The tower lands there because the towns’ ' + t(c) + '-coordinates cancel.' },
            { html: 'The ' + t(o.ax) + '-axis: the towns are the same distance from the origin.', why: 'That isn’t what puts the tower on an axis. Look at the ' + t(c) + '-coordinates: they add to ' + t('0') + '.' }],
            'The tower ' + t(ptT(M)) + ' has ' + t(c + '=0') + ', so it is on the ' + t(o.ax) + '-axis. That happens because ' + t(nT(o.A[xa ? 1 : 0]) + '+' + sgp(o.B[xa ? 1 : 0]) + '=0') + ': the towns’ ' + t(c) + '-coordinates are opposites.', ['Which coordinate of the tower is ' + t('0') + '?'], 'which axis');
        } }] },
    /* ---- EP 10: quadrilateral ---- */
    { num: '10', section: 'Part C — Geometry on the coordinate grid', shared: function (r) {
        if (r.chance(0.2)) return { A: [-6, -1], u: [4, 6], w: [8, -2] };
        return pickWhere(function () { return { A: [r.int(-7, -4), r.int(-4, 1)], u: [r.int(1, 5), r.int(3, 7)], w: [r.int(5, 9), r.int(-3, 2)] }; }, function (z) {
          var C = add(add(z.A, z.u), z.w), D = add(z.A, z.w), a = sq(z.u[0]) + sq(z.u[1]), b = sq(z.w[0]) + sq(z.w[1]);
          return even(z.u[0] + z.w[0]) && even(z.u[1] + z.w[1]) && C[0] <= 9 && Math.abs(C[1]) <= 9 && Math.abs(D[1]) <= 9 && a !== b && z.u[0] * z.w[0] + z.u[1] * z.w[1] !== 0;
        });
      },
      stem: function (o) { var Q = { A: o.A, B: add(o.A, o.u), C: add(add(o.A, o.u), o.w), D: add(o.A, o.w) }; return 'Quadrilateral ' + t('ABCD') + ' has vertices ' + ['A', 'B', 'C', 'D'].map(function (n) { return t(nm(n, Q[n])); }).join(', ') + '.'; },
      parts: [
        { id: 'e10a', sub: 'a', level: 'BEG', make: function (r, o) { var C = add(add(o.A, o.u), o.w); return midP('Determine the midpoint of diagonal ' + t('\\overline{AC}') + '.', o.A, C, 'midpoint AC', { before: 'M =' }); } },
        { id: 'e10b', sub: 'b', level: 'BEG', make: function (r, o) { return midP('Determine the midpoint of diagonal ' + t('\\overline{BD}') + '.', add(o.A, o.u), add(o.A, o.w), 'midpoint BD', { before: 'M =' }); } },
        { id: 'e10c', sub: 'c', level: 'EMG', make: function (r, o) {
          var M = mid(o.A, add(add(o.A, o.u), o.w));
          return mcPart(r, 'Both diagonals have the midpoint ' + t(ptT(M)) + '. What does this show about the two diagonals?', [
            { html: 'They <b>bisect</b> each other: they cross at the midpoint of each, so each diagonal cuts the other exactly in half.', right: true },
            { html: 'They are the same length.', why: 'A shared midpoint says where they cross, not how long they are.' },
            { html: 'They are perpendicular.', why: 'A shared midpoint says nothing about the angle between them.' },
            { html: 'They are parallel.', why: 'Two diagonals that share a point cross each other — they can’t be parallel.' }],
            'The diagonals share the midpoint ' + t(ptT(M)) + ', so each one is cut exactly in half where they cross: the diagonals <b>bisect</b> each other.', ['What does it mean for a segment to be cut at its midpoint?'], 'diagonals bisect');
        } },
        { id: 'e10d', sub: 'd', level: 'PRG', make: function (r, o) {
          var Q = { A: o.A, B: add(o.A, o.u), C: add(add(o.A, o.u), o.w), D: add(o.A, o.w) }, S = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], n = S.map(function (s) { return d2(Q[s[0]], Q[s[1]]); });
          return B.fields('Determine the exact lengths of all four sides.', S.map(function (s) { return lenField(s[0] + s[1]); }), S.map(function (s, i) { return lenCheck(n[i], 1, { cands: dCands(Q[s[0]], Q[s[1]]) }); }), n.map(function (x) { return lenKey(x); }),
            S.map(function (s, i) { return t(s[0] + s[1] + '=' + lenTex(n[i])); }).join(', '), S.map(function (s, i) { return t(dLine(Q[s[0]], Q[s[1]], s[0] + s[1]) + simpTail(n[i])); }).join('<br>'), HD, 'four sides');
        } },
        { id: 'e10d2', sub: 'd, classify', level: 'EMG', make: function (r, o) {
          var a = sq(o.u[0]) + sq(o.u[1]), b = sq(o.w[0]) + sq(o.w[1]);
          return mcPart(r, 'The sides are ' + t('AB=CD=' + lenTex(a)) + ' and ' + t('BC=DA=' + lenTex(b)) + '. What kind of quadrilateral does this confirm ' + t('ABCD') + ' is?', [
            { html: 'A parallelogram: both pairs of opposite sides are equal (and the diagonals bisect each other).', right: true },
            { html: 'A rhombus.', why: 'A rhombus needs all four sides equal; here ' + t(lenTex(a) + '\\ne ' + lenTex(b)) + '.' },
            { html: 'A square.', why: 'A square needs four equal sides and right angles.' },
            { html: 'A trapezoid.', why: 'Both pairs of opposite sides are equal here — that makes a parallelogram.' }],
            'Opposite sides are equal (' + t('AB=CD') + ', ' + t('BC=DA') + ') and the diagonals bisect each other, so ' + t('ABCD') + ' is a <b>parallelogram</b>.', ['Which sides are equal to each other?'], 'classify ABCD');
        } }] },
    /* ---- EP 11: garden pentagon ---- */
    { num: '11', shared: function (r) {
        if (r.chance(0.2)) return { a: 4, b: -3, c: 3, h: 3, cost: 23 };
        var ah = r.pick([[4, 3], [3, 4], [6, 8]]); return pickWhere(function () { return { a: ah[0], b: -r.int(2, 5), c: r.int(1, 4), h: ah[1], cost: r.pick([15, 18, 19, 23, 25, 32]) }; }, function (z) { return z.c + z.h <= 10; });
      },
      stem: function (o) { var V = pent(o); return 'A garden plot is the pentagon ' + t('PQRST') + ' shown, with ' + ['P', 'Q', 'R', 'S', 'T'].map(function (n) { return t(nm(n, V[n])); }).join(', ') + '. Each grid unit represents ' + t('1') + '&nbsp;m.' + figPoly(['P', 'Q', 'R', 'S', 'T'].map(function (n) { return V[n]; }), ['P', 'Q', 'R', 'S', 'T'], { closed: true, max: 280 }); },
      parts: [
        { id: 'e11a', sub: 'a', level: 'BEG', make: function (r, o) {
          var V = pent(o), S = [['P', 'Q'], ['Q', 'R'], ['T', 'P']], n = S.map(function (s) { return d2(V[s[0]], V[s[1]]); });
          return B.fields('Three of the five sides are parallel to an axis: ' + t('\\overline{PQ}') + ', ' + t('\\overline{QR}') + ' and ' + t('\\overline{TP}') + '. State their lengths without using the distance formula.', S.map(function (s) { return lenField(s[0] + s[1], 'm'); }), S.map(function (s, i) { return lenCheck(n[i], 1, { cands: dCands(V[s[0]], V[s[1]]) }); }), n.map(function (x) { return lenKey(x); }),
            S.map(function (s, i) { return t(s[0] + s[1] + '=' + lenTex(n[i])); }).join(', ') + '&nbsp;m', t('\\overline{PQ}') + ' is horizontal: ' + t('PQ=|' + nT(V.Q[0]) + '-' + sgp(V.P[0]) + '|=' + nT(Math.abs(V.Q[0] - V.P[0]))) + '. ' + t('\\overline{QR}') + ' and ' + t('\\overline{TP}') + ' are vertical: ' + t('QR=|' + nT(V.R[1]) + '-' + sgp(V.Q[1]) + '|=' + nT(Math.abs(V.R[1] - V.Q[1]))) + ', ' + t('TP=' + nT(Math.abs(V.T[1] - V.P[1]))) + '.', ['Horizontal: subtract the ' + t('x') + '-coordinates. Vertical: subtract the ' + t('y') + '-coordinates.'], 'axis-parallel sides');
        } },
        { id: 'e11b', sub: 'b', level: 'EMG', make: function (r, o) {
          var V = pent(o), S = [['R', 'S'], ['S', 'T']], n = S.map(function (s) { return d2(V[s[0]], V[s[1]]); });
          return B.fields('Use the distance formula on the remaining two sides.', S.map(function (s) { return lenField(s[0] + s[1], 'm'); }), S.map(function (s, i) { return lenCheck(n[i], 1, { cands: dCands(V[s[0]], V[s[1]]) }); }), n.map(function (x) { return lenKey(x); }),
            S.map(function (s, i) { return t(s[0] + s[1] + '=' + lenTex(n[i])); }).join(', ') + '&nbsp;m', S.map(function (s, i) { return t(dLine(V[s[0]], V[s[1]], s[0] + s[1]) + simpTail(n[i])); }).join('<br>'), HD, 'slanted sides');
        } },
        { id: 'e11c', sub: 'c', level: 'EMG', make: function (r, o) {
          var p = perim(o), V = pent(o), sides = [2 * o.a, o.c - o.b, Math.hypot(o.a, o.h), Math.hypot(o.a, o.h), o.c - o.b];
          return B.number('Determine the perimeter of the plot, in metres.', p, numDiag([[p - sides[1], 'per-side', 'Add <b>all five</b> sides.'], [p - sides[2], 'per-side', 'Add <b>all five</b> sides.'], [p - sides[0], 'per-side', 'Add <b>all five</b> sides.'], [2 * o.a + 2 * (o.c - o.b), 'per-side', 'That is the rectangle part only — the roof has two slanted sides, ' + t('RS') + ' and ' + t('ST') + ', instead of a top side.']]),
            t(sides.map(function (s) { return nT(s); }).join('+') + '=' + nT(p)) + '&nbsp;m.', ['Add the five side lengths from (a) and (b).'], 'perimeter', { after: 'm' });
        } },
        { id: 'e11d', sub: 'd', level: 'EMG', make: function (r, o) {
          var p = perim(o), v = p * o.cost;
          return moneyPart('Fencing costs ' + t('\\$' + o.cost) + ' per metre. Determine the cost of fencing the plot.', v, [[p, 'u6l5-cost-length', 'That is the perimeter. Multiply it by the price per metre.']], t(nT(p) + '\\times \\$' + o.cost + '=\\$' + F(v)) + '.', ['Cost = perimeter × price per metre.'], 'fencing cost');
        } }] },
    /* ---- EP 12: triangle and median ---- */
    { num: '12', shared: function (r) {
        if (r.chance(0.2)) return { A: [-2, 3], B: [4, 1], C: [0, -3] };
        var iso = r.chance(0.7);
        return pickWhere(function () { return { A: [r.int(-6, 0), r.int(0, 6)], B: [r.int(1, 6), r.int(-3, 5)], C: [r.int(-3, 3), r.int(-6, -1)] }; }, function (z) {
          var n = [d2(z.A, z.B), d2(z.B, z.C), d2(z.C, z.A)], eq = (n[0] === n[1]) + (n[1] === n[2]) + (n[0] === n[2]);
          var area2 = Math.abs((z.B[0] - z.A[0]) * (z.C[1] - z.A[1]) - (z.C[0] - z.A[0]) * (z.B[1] - z.A[1]));
          return area2 > 0 && even(z.B[0] + z.C[0]) && even(z.B[1] + z.C[1]) && (iso ? eq === 1 : eq === 0) && n.filter(isSq).length <= 1;
        });
      },
      stem: function (o) { return 'A triangle has vertices ' + t(nm('A', o.A)) + ', ' + t(nm('B', o.B)) + ', and ' + t(nm('C', o.C)) + '.'; },
      parts: [
        { id: 'e12a', sub: 'a', level: 'PRG', make: function (r, o) {
          var S = [['A', 'B'], ['B', 'C'], ['C', 'A']], n = S.map(function (s) { return d2(o[s[0]], o[s[1]]); });
          return B.fields('Determine the exact length of each side in simplest radical form.', S.map(function (s) { return lenField(s[0] + s[1]); }), S.map(function (s, i) { return lenCheck(n[i], 1, { cands: dCands(o[s[0]], o[s[1]]) }); }), n.map(function (x) { return lenKey(x); }),
            S.map(function (s, i) { return t(s[0] + s[1] + '=' + lenTex(n[i])); }).join(', '), S.map(function (s, i) { return t(dLine(o[s[0]], o[s[1]], s[0] + s[1]) + simpTail(n[i])); }).join('<br>'), HD, 'triangle sides');
        } },
        { id: 'e12b', sub: 'b', level: 'EMG', make: function (r, o) {
          var n = [d2(o.A, o.B), d2(o.B, o.C), d2(o.C, o.A)], iso = n[0] === n[1] || n[1] === n[2] || n[0] === n[2];
          var L = 'AB=' + lenTex(n[0]) + ',\\ BC=' + lenTex(n[1]) + ',\\ CA=' + lenTex(n[2]);
          return mcPart(r, 'The sides are ' + t(L) + '. Classify the triangle.', [
            { html: '<b>Isosceles</b> — exactly two sides are equal.', right: iso, why: iso ? null : 'All three lengths are different: ' + t(L) + '.' },
            { html: '<b>Scalene</b> — all three sides are different.', right: !iso, why: iso ? 'Look again: two of the lengths are equal.' : null },
            { html: '<b>Equilateral</b> — all three sides are equal.', why: 'The three lengths are not all equal: ' + t(L) + '.' }],
            (iso ? 'Two sides are equal and the third is different, so the triangle is <b>isosceles</b>.' : 'All three sides are different, so the triangle is <b>scalene</b>.') + ' (' + t(L) + ')', ['Compare the three lengths from part (a).'], 'classify the triangle', true);
        } },
        { id: 'e12c', sub: 'c', level: 'PRG', make: function (r, o) {
          var M = mid(o.B, o.C), n = d2(o.A, M);
          return B.fields('A <b>median</b> joins a vertex to the midpoint of the opposite side. Determine the midpoint of ' + t('\\overline{BC}') + ', then the exact length of the median drawn from ' + t('A') + '.', [ptField('Midpoint of ' + t('\\overline{BC}') + ':', 'M'), lenField('AM')],
            [ptCheck(M, { cands: midCands(o.B, o.C).concat([[mid(o.A, o.B), 'mid-wrong-seg', 'That is the midpoint of ' + t('\\overline{AB}') + '. The median from ' + t('A') + ' goes to the midpoint of the <b>opposite</b> side, ' + t('\\overline{BC}') + '.'], [mid(o.A, o.C), 'mid-wrong-seg', 'That is the midpoint of ' + t('\\overline{AC}') + '. Use the side opposite ' + t('A') + ': ' + t('\\overline{BC}') + '.']]) }),
              lenCheck(n, 1, { cands: dCands(o.A, M) })], [ptKey(M), lenKey(n)], t('M' + ptT(M)) + ', ' + t('AM=' + lenTex(n)),
            t(mLine(o.B, o.C, 'M')) + '<br>' + t(dLine(o.A, M, 'AM') + simpTail(n)), ['The side opposite ' + t('A') + ' is ' + t('\\overline{BC}') + '. Find its midpoint first.', 'Then use the distance formula from ' + t('A') + ' to that midpoint.'], 'median');
        } }] },
    /* ---- EP 13: circle ---- */
    { num: '13', shared: function (r) {
        if (r.chance(0.2)) return { P: [-5, 2], v: [12, -5] };
        return pickWhere(function () { var v = r.pick([[12, -5], [5, -12], [12, 5], [8, -6], [6, 8], [8, 15], [15, -8], [4, -3]]); return { P: [-r.int(2, 8), r.int(-4, 5)], v: v }; }, function (z) { return !even(z.v[0]) || !even(z.v[1]); });
      },
      stem: function (o) { return 'The points ' + t(ptT(o.P)) + ' and ' + t(ptT(add(o.P, o.v))) + ' are the endpoints of a <b>diameter</b> of a circle.'; },
      parts: [
        { id: 'e13a', sub: 'a', level: 'EMG', make: function (r, o) { return midP('Determine the coordinates of the centre of the circle.', o.P, add(o.P, o.v), 'centre of the circle', { frac: true, pre: 'The centre is the midpoint of the diameter: ' }); } },
        { id: 'e13b', sub: 'b', level: 'PRG', make: function (r, o) {
          var Q = add(o.P, o.v), D = dist(o.P, Q), R = D / 2;
          return B.fields('Determine the length of the diameter, then the radius.', [{ label: 'Diameter =', name: 'diameter', mode: 'math', keys: 'radical', after: 'units' }, { label: 'Radius =', name: 'radius', mode: 'math', keys: 'radical', after: 'units' }],
            [lenCheck(d2(o.P, Q), 1, { cands: dCands(o.P, Q).concat([[R, 'u6l5-radius-diam', 'That is the radius. The diameter is the whole segment between the two given points.']]) }), lenCheck(d2(o.P, Q), 2, { cands: [[D, 'u6l5-radius-diam', 'That is the diameter. The radius is half of it.']] })], [lenKey(d2(o.P, Q)), lenKey(d2(o.P, Q), 2)],
            'Diameter ' + t(nT(D)) + ', radius ' + t(lenTex(d2(o.P, Q), 2) + '=' + nT(R)), dSteps(o.P, Q) + '<br>' + t(dLine(o.P, Q, 'd') + '=' + nT(D)) + '. Radius ' + t('=\\tfrac{' + nT(D) + '}{2}=' + nT(R)) + '.', HD.concat(['The radius is half the diameter.']), 'diameter and radius');
        } }] },
    /* ---- EP 14: equidistant point on the y-axis (Mastery) ---- */
    { num: '14', section: 'Part D — Stretch, multiple choice, and numerical response', shared: function (r) {
        if (r.chance(0.2)) return { A: [-4, 1], B: [2, 5] };
        return pickWhere(function () { return { A: [-r.int(1, 6), r.int(-3, 4)], B: [r.int(1, 6), r.int(-2, 7)] }; }, function (z) {
          if (z.B[1] === z.A[1]) return false; var k = (sq(z.B[0]) + sq(z.B[1]) - sq(z.A[0]) - sq(z.A[1])) / (2 * (z.B[1] - z.A[1])); return isInt(2 * k) && Math.abs(k) <= 8 && Math.abs(z.A[0]) !== Math.abs(z.B[0]);
        });
      },
      stem: function (o) { return '<b>Stretch.</b> A point ' + t('P') + ' lies on the ' + t('y') + '-axis and is the same distance from ' + t(nm('A', o.A)) + ' as it is from ' + t(nm('B', o.B)) + '. Because ' + t('P') + ' is on the ' + t('y') + '-axis, its coordinates can be written ' + t('P(0,\\ k)') + '.'; },
      parts: [
        { id: 'e14a', sub: 'a', level: 'PRG', make: function (r, o) {
          var A = o.A, Bq = o.B, eq = function (p, q) { return '\\sqrt{(0-' + sgp(p[0]) + ')^{2}+(k-' + sgp(p[1]) + ')^{2}}=\\sqrt{(0-' + sgp(q[0]) + ')^{2}+(k-' + sgp(q[1]) + ')^{2}}'; };
          return mcPart(r, 'Which equation says that the distance ' + t('PA') + ' equals the distance ' + t('PB') + '?', [
            { html: t(eq(A, Bq)), right: true },
            { html: t('\\sqrt{(0-' + sgp(A[0]) + ')^{2}+(k-' + sgp(Bq[1]) + ')^{2}}=\\sqrt{(0-' + sgp(Bq[0]) + ')^{2}+(k-' + sgp(A[1]) + ')^{2}}'), why: 'Each distance uses the coordinates of <b>one</b> point: ' + t('PA') + ' uses ' + t('A') + '’s ' + t('x') + ' and ' + t('y') + '.' },
            { html: t('\\tfrac{0+' + sgp(A[0]) + '}{2}=\\tfrac{0+' + sgp(Bq[0]) + '}{2}'), why: 'That compares midpoints, not distances. Use the distance formula for ' + t('PA') + ' and ' + t('PB') + '.' },
            { html: t('(0-' + sgp(A[0]) + ')+(k-' + sgp(A[1]) + ')=(0-' + sgp(Bq[0]) + ')+(k-' + sgp(Bq[1]) + ')'), why: 'A distance needs the squares and the square root: ' + t('\\sqrt{(\\Delta x)^{2}+(\\Delta y)^{2}}') + '.' }],
            t('PA=PB') + ': ' + t(eq(A, Bq)) + '. Squaring both sides removes both radicals.', ['Write the distance formula from ' + t('P(0,\\ k)') + ' to ' + t('A') + ', and from ' + t('P') + ' to ' + t('B') + ', and set them equal.'], 'equal-distance equation');
        } },
        { id: 'e14b', sub: 'b', level: 'MAS', make: function (r, o) {
          var A = o.A, Bq = o.B, a2 = sq(A[0]) + sq(A[1]), b2 = sq(Bq[0]) + sq(Bq[1]), den = 2 * (Bq[1] - A[1]), k = (b2 - a2) / den, Mab = mid(A, Bq);
          var sol = 'Square both sides: ' + t(nT(sq(A[0])) + '+(k-' + sgp(A[1]) + ')^{2}=' + nT(sq(Bq[0])) + '+(k-' + sgp(Bq[1]) + ')^{2}') + '.<br>Expand: ' + t(nT(sq(A[0])) + '+k^{2}' + (A[1] === 0 ? '' : (A[1] > 0 ? '-' : '+') + Math.abs(2 * A[1]) + 'k') + '+' + sq(A[1]) + '=' + nT(sq(Bq[0])) + '+k^{2}' + (Bq[1] === 0 ? '' : (Bq[1] > 0 ? '-' : '+') + Math.abs(2 * Bq[1]) + 'k') + '+' + sq(Bq[1])) + '.<br>The ' + t('k^{2}') + ' terms cancel: ' + t(nT(den) + 'k=' + nT(b2 - a2)) + ', so ' + t('k=' + cT(k, true)) + '.<br>' + t('P' + ptT([0, k], true)) + '.';
          var c = [[Mab[1], 'eq-mid-y', 'Averaging the ' + t('y') + '-coordinates doesn’t work here — that would be the midpoint of ' + t('\\overline{AB}') + ', which isn’t on the ' + t('y') + '-axis. Set the squared distances equal and solve.'], [-k, 'u6l5-k-sign', 'Check the signs when you expand ' + t('(k-a)^{2}=k^{2}-2ak+a^{2}') + ' and when you collect the ' + t('k') + '-terms.'],
            [(b2 - a2) / (-den), 'u6l5-k-sign', 'Check the signs when you move the ' + t('k') + '-terms to one side.']].filter(function (x) { return !same(x[0], k); });
          var chk = function (resp) {
            var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\s/g, ''), m = /^k=(.*)$/.exec(s); if (m) s = m[1];
            var L = readPts(s); if (!L.empty && !L.bad && !L.single && L.pts && L.pts.length === 1) { var p = L.pts[0]; if (same(p.x, 0) && same(p.y, k)) return form('u6l5-k-no-y', 'Right point! This box asks for the value of ' + t('k') + ' only.'); }
            return K.fraction(isInt(k) ? [k, 1] : [Math.round(2 * k), 2], { decimalOk: true, diag: numDiag(c) })(s);
          };
          return { prompt: 'Solve your equation for ' + t('k') + '. (Squaring both sides removes both radicals.)', input: { type: 'math', keys: 'fraction', before: 'k =' }, check: chk, key: isInt(k) ? String(k) : (k < 0 ? '-' : '') + '\\frac{' + Math.abs(Math.round(2 * k)) + '}{2}', answer: t('k=' + cT(k, true)) + ', so ' + t('P' + ptT([0, k], true)), solution: sol,
            hints: ['Square both sides, then expand each ' + t('(k-a)^{2}') + ' as ' + t('k^{2}-2ak+a^{2}') + '.', 'The ' + t('k^{2}') + ' terms cancel, leaving a one-step equation.'], text: 'solve for k', good: [String(k), 'k=' + k], bad: [String(-k)].filter(function (x) { return !same(Number(x), k); }) };
        } },
        { id: 'e14c', sub: 'c', level: 'ADV', make: function (r, o) {
          var A = o.A, Bq = o.B, k = (sq(Bq[0]) + sq(Bq[1]) - sq(A[0]) - sq(A[1])) / (2 * (Bq[1] - A[1])), P = [0, k], n4 = Math.round(4 * d2(P, A)); // PA² = n4 / 4
          var exact = lenTex(n4, 2), dec = fx(Math.sqrt(n4) / 2, 1);
          return B.fields('Check your answer by computing both distances, ' + t('PA') + ' and ' + t('PB') + ', with ' + t('P' + ptT(P, true)) + ' (exact, or to the nearest tenth).', [lenField('PA'), lenField('PB')], [lenCheck(n4, 2, { dec: true }), lenCheck(n4, 2, { dec: true })], [lenKey(n4, 2), lenKey(n4, 2)],
            t('PA=PB=' + exact + '\\approx ' + dec),
            t('PA=\\sqrt{(0-' + sgp(A[0]) + ')^{2}+(' + cT(k, true) + '-' + sgp(A[1]) + ')^{2}}=\\sqrt{' + nT(d2(P, A)) + '}=' + exact) + '<br>' + t('PB=\\sqrt{(0-' + sgp(Bq[0]) + ')^{2}+(' + cT(k, true) + '-' + sgp(Bq[1]) + ')^{2}}=\\sqrt{' + nT(d2(P, Bq)) + '}=' + exact) + ' ✓ equal.',
            HD.concat(['With a half: ' + t('\\left(\\tfrac{3}{2}-1\\right)^{2}=\\left(\\tfrac{1}{2}\\right)^{2}=\\tfrac{1}{4}') + '. A decimal answer to the nearest tenth is fine.']), 'check PA = PB');
        } }] },
    /* ---- EP 15–18 ---- */
    { num: '15', parts: [
      { id: 'e15', level: 'EMG', make: function (r) {
        var o = r.chance(0.2) ? { A: [-3, 8], M: [1, 2] } : pickWhere(function () { return { A: [-r.int(1, 8), r.int(2, 10)], M: [r.int(-1, 4), r.int(-2, 4)] }; }, function (z) { return z.M[1] < z.A[1] && z.M[0] > z.A[0]; });
        var Bq = sub(scl(o.M, 2), o.A), dis = [[mid(o.A, o.M), 'You averaged the endpoint and the midpoint. The other endpoint is beyond the midpoint: ' + t('B=2M-A') + '.'], [sub(o.M, o.A), 'That is the step from the endpoint to the midpoint. Take the step again from ' + t('M') + '.'],
          [add(scl(o.M, 2), o.A), 'After doubling the midpoint, <b>subtract</b> the known endpoint.'], [add(o.M, o.A), 'Double the midpoint first, then subtract.']];
        var opts = [{ html: t(ptT(Bq)), right: true }], seen = [ptKey(Bq)];
        dis.forEach(function (d) { if (opts.length < 4 && seen.indexOf(ptKey(d[0])) < 0) { seen.push(ptKey(d[0])); opts.push({ html: t(ptT(d[0], true)), why: d[1] }); } });
        return mcPart(r, '<i>(Multiple Choice)</i> One endpoint of a segment is ' + t(ptT(o.A)) + ' and the midpoint is ' + t(ptT(o.M)) + '. The other endpoint is', opts, endSol(o.A, o.M), HE, 'MC other endpoint');
      } }] },
    { num: '16', parts: [
      { id: 'e16', level: 'BEG', make: function (r) {
        var o = r.chance(0.2) ? { A: [-6, -2], v: [8, 6] } : { A: [-r.int(1, 8), -r.int(1, 6)], v: triple(r, 12) };
        var Bq = add(o.A, o.v), a = o.v[0], b = o.v[1], D = Math.sqrt(a * a + b * b);
        return mcPart(r, '<i>(Multiple Choice)</i> The distance between ' + t(ptT(o.A)) + ' and ' + t(ptT(Bq)) + ' is', [
          { html: t(D), right: true }, { html: t('\\sqrt{' + D + '}'), why: t(nT(a * a) + '+' + nT(b * b) + '=' + (a * a + b * b)) + ', and ' + t('\\sqrt{' + (a * a + b * b) + '}=' + D) + '. You took one square root too many.' },
          { html: t(a + b), why: 'That adds the run and the rise. Square them, add, then take the square root.' }, { html: t(a * a + b * b), why: 'That is ' + t('d^{2}') + '. Take the square root.' }],
          dSteps(o.A, Bq) + '<br>' + t(dLine(o.A, Bq, 'd') + '=' + D) + '.', HD, 'MC distance');
      } }] },
    { num: '17', parts: [
      { id: 'e17', level: 'EMG', make: function (r) {
        /* the booklet's answer is negative (−8); here the x-coordinate of D is always positive so it fits a numerical-response grid */
        var o = r.chance(0.2) ? { M: [2, 5], C: [-4, -1] } : pickWhere(function () { return { M: [r.int(1, 7), r.int(-3, 7)], C: [-r.int(1, 8), r.int(-6, 8)] }; }, function (z) { return z.M[1] !== z.C[1]; });
        var x = 2 * o.M[0] - o.C[0], y = 2 * o.M[1] - o.C[1];
        var c = endNum(o.C[0], o.M[0]).concat([[y, 'end-gave-y', 'That is the ' + t('y') + '-coordinate of ' + t('D') + '. The question asks for ' + t('x') + '.']]);
        return B.nr('<i>(Numerical Response)</i> ' + t(nm('M', o.M)) + ' is the midpoint of ' + t('\\overline{CD}') + ' and ' + t('C') + ' is ' + t(ptT(o.C)) + '. The ' + t('x') + '-coordinate of ' + t('D') + ' is ______.', x, numDiag(c),
          t('x_D=2x_M-x_C=2(' + o.M[0] + ')-' + sgp(o.C[0]) + '=' + nT(x)) + ' (and ' + t('y_D=' + nT(y)) + ').', HE, 'NR missing endpoint x');
      } }] },
    { num: '18', parts: [
      { id: 'e18', level: 'EMG', make: function (r) {
        var o = r.chance(0.2) ? { A: [-5, 7], v: [12, -9] } : pickWhere(function () { var v = triple(r, 16); return { A: [-r.int(1, 8), r.int(1, 9)], v: [v[0], -v[1]] }; }, function () { return true; });
        var Bq = add(o.A, o.v), D = dist(o.A, Bq);
        return B.nr('<i>(Numerical Response)</i> The distance between ' + t(ptT(o.A)) + ' and ' + t(ptT(Bq)) + ' is ______ units.', D, matchDiag(dCands(o.A, Bq)), dSteps(o.A, Bq) + '<br>' + t(dLine(o.A, Bq, 'd') + '=' + D) + '.', HD, 'NR distance with negatives');
      } }] }
  ];
  /* MC for EP 5: condition for the midpoint to be on the x-axis ('x'), the y-axis ('y') or the origin ('o') */
  function condMC(r, w) {
    var a = r.int(1, 7), b = r.int(1, 8), c = r.int(1, 7) * r.pick([1, -1]);
    var R = { x: { html: t('y_1') + ' and ' + t('y_2') + ' are opposites (' + t('y_1+y_2=0') + '), e.g. ' + t(ptT([a, b])) + ' and ' + t(ptT([c, -b])) + '.', where: 'on the ' + t('x') + '-axis', sol: 'A point on the ' + t('x') + '-axis has ' + t('y=0') + ', so ' + t('\\tfrac{y_1+y_2}{2}=0') + ', i.e. ' + t('y_1+y_2=0') + ': the ' + t('y') + '-coordinates are opposites. E.g. ' + t(ptT([a, b])) + ' and ' + t(ptT([c, -b])) + ' have midpoint ' + t(ptT(mid([a, b], [c, -b]), true)) + '.' },
      y: { html: t('x_1') + ' and ' + t('x_2') + ' are opposites (' + t('x_1+x_2=0') + '), e.g. ' + t(ptT([a, b])) + ' and ' + t(ptT([-a, c])) + '.', where: 'on the ' + t('y') + '-axis', sol: 'A point on the ' + t('y') + '-axis has ' + t('x=0') + ', so ' + t('x_1+x_2=0') + ': the ' + t('x') + '-coordinates are opposites. E.g. ' + t(ptT([a, b])) + ' and ' + t(ptT([-a, c])) + ' have midpoint ' + t(ptT(mid([a, b], [-a, c]), true)) + '.' },
      o: { html: 'Both: ' + t('x_1+x_2=0') + ' <b>and</b> ' + t('y_1+y_2=0') + ' — the endpoints are opposite points, e.g. ' + t(ptT([a, b])) + ' and ' + t(ptT([-a, -b])) + '.', where: 'at the origin', sol: 'The origin has ' + t('x=0') + ' and ' + t('y=0') + ', so both ' + t('x_1+x_2=0') + ' and ' + t('y_1+y_2=0') + ': e.g. ' + t(ptT([a, b])) + ' and ' + t(ptT([-a, -b])) + '.' } };
    var W = [
      { html: t('y_1=y_2') + ', e.g. ' + t(ptT([a, b])) + ' and ' + t(ptT([c, b])) + '.', why: 'Equal ' + t('y') + '’s make the midpoint’s ' + t('y') + ' equal to them too — ' + t(b) + ', not ' + t('0') + '.' },
      { html: t('x_1=x_2') + ', e.g. ' + t(ptT([a, b])) + ' and ' + t(ptT([a, c])) + '.', why: 'Equal ' + t('x') + '’s keep the midpoint’s ' + t('x') + ' at ' + t(a) + ', not ' + t('0') + '.' },
      { html: 'One endpoint must be on that axis, e.g. ' + t(ptT([a, 0])) + ' and ' + t(ptT([c, b])) + '.', why: 'The midpoint of ' + t(ptT([a, 0])) + ' and ' + t(ptT([c, b])) + ' is ' + t(ptT(mid([a, 0], [c, b]), true)) + ' — not on an axis. What matters is that the coordinates cancel.' }];
    var opts = [{ html: R[w].html, right: true }].concat(w === 'x' ? [{ html: R.y.html, why: 'Opposite ' + t('x') + '’s put the midpoint on the <b>' + t('y') + '-axis</b> (' + t('x=0') + ').' }, W[0], W[2]] : w === 'y' ? [{ html: R.x.html, why: 'Opposite ' + t('y') + '’s put the midpoint on the <b>' + t('x') + '-axis</b> (' + t('y=0') + ').' }, W[1], W[2]] :
      [{ html: R.x.html, why: 'That only makes ' + t('y=0') + ' (the ' + t('x') + '-axis). The origin needs ' + t('x=0') + ' as well.' }, { html: R.y.html, why: 'That only makes ' + t('x=0') + '. The origin needs ' + t('y=0') + ' too.' }, { html: 'One endpoint must be the origin.', why: 'If one endpoint is ' + t('(0,\\ 0)') + ', the midpoint is halfway to the other endpoint — not the origin.' }]);
    return mcPart(r, 'What must be true for the midpoint to land ' + R[w].where + '?', opts, R[w].sol, ['The midpoint’s coordinates are ' + t('\\tfrac{x_1+x_2}{2}') + ' and ' + t('\\tfrac{y_1+y_2}{2}') + '. When is each one ' + t('0') + '?'], 'condition: midpoint ' + w);
  }
  /* EP 5 examples: one endpoint is given, the student chooses the other (any point that works) */
  function exPart(r, w) {
    var P = [r.pick(pm(1, 8)), r.pick(pm(1, 8))], c = r.pick(pm(1, 6)), Q = w === 'x' ? [c, -P[1]] : w === 'y' ? [-P[0], c] : [-P[0], -P[1]];
    var where = w === 'x' ? 'on the ' + t('x') + '-axis' : w === 'y' ? 'on the ' + t('y') + '-axis' : 'at the origin';
    var okf = exChk(w);
    var chk = function (resp) {
      var L = readPts(resp), rr = readRes(L); if (rr) return rr;
      if (L.pts.length !== 1) return form('pt-many', 'Give just one point: the other endpoint.');
      var q = [L.pts[0].x, L.pts[0].y];
      if (samePt(q, P)) return wrong('u6l5-same-pt', 'That is the endpoint you were given. Choose a <b>different</b> point for the other end.');
      var h = okf(P, q); if (h) return wrong(h.code, h.hint);
      return L.noParen ? form('pt-brackets', 'That works — write the point in brackets: ' + t('(x,\\ y)') + '.') : ok();
    };
    var rule = w === 'x' ? 'its ' + t('y') + '-coordinate must be ' + t(nT(-P[1])) + ' (the opposite of ' + t(nT(P[1])) + '); its ' + t('x') + '-coordinate can be anything' : w === 'y' ? 'its ' + t('x') + '-coordinate must be ' + t(nT(-P[0])) + ' (the opposite of ' + t(nT(P[0])) + '); its ' + t('y') + '-coordinate can be anything' : 'both coordinates must be opposites: ' + t(ptT(Q));
    return { prompt: 'Give an example. One endpoint is ' + t(ptT(P)) + '. Choose the other endpoint so that the midpoint lands ' + where + '.' + (w === 'o' ? '' : ' (Many answers work.)'), input: { type: 'math', keys: 'pairs', placeholder: 'e.g. (3, -2)', before: 'Other endpoint:' },
      check: chk, key: ptKey(Q), answer: (w === 'o' ? '' : 'For example ') + t(ptT(Q)) + (w === 'o' ? '' : ' — any point where ' + rule), solution: 'For the other endpoint, ' + rule + '. E.g. ' + t(mLine(P, Q, 'M', true)) + ' ✓',
      hints: ['The midpoint’s coordinates are ' + t('\\tfrac{x_1+x_2}{2}') + ' and ' + t('\\tfrac{y_1+y_2}{2}') + '. Which of them has to be ' + t('0') + '?', 'A sum is ' + t('0') + ' when the two numbers are opposites.'], text: 'example: midpoint ' + w,
      good: w === 'o' ? [] : [ptKey(w === 'x' ? [c + 7, -P[1]] : [-P[0], c + 7])], bad: [ptKey(P), ptKey(w === 'y' ? [P[0], -P[1]] : [-P[0], P[1]])] };
  }
  function exChk(w) {
    return function (P, Q) {
      var M = mid(P, Q);
      if (w === 'x' && !same(M[1], 0)) return { code: 'u6l5-not-axis', hint: 'The midpoint of your points is ' + t(ptT(M, true)) + ', which is not on the ' + t('x') + '-axis. Make the ' + t('y') + '-coordinates opposites.' };
      if (w === 'y' && !same(M[0], 0)) return { code: 'u6l5-not-axis', hint: 'The midpoint of your points is ' + t(ptT(M, true)) + ', which is not on the ' + t('y') + '-axis. Make the ' + t('x') + '-coordinates opposites.' };
      if (w === 'o' && !samePt(M, [0, 0])) return { code: 'u6l5-not-origin', hint: 'The midpoint of your points is ' + t(ptT(M, true)) + ', not ' + t('(0,\\ 0)') + '. Change the sign of <b>both</b> coordinates.' };
      return null;
    };
  }
  function closest(o) {
    var S = [[o.L, o.R, 'L', 'R'], [o.L, o.G, 'L', 'G'], [o.R, o.G, 'R', 'G']]; S.sort(function (a, b) { return d2(a[0], a[1]) - d2(b[0], b[1]); }); return S[0];
  }
  function routeU(o) { return cl(dist(o.D, o.A) + dist(o.A, o.B) + dist(o.B, o.C)); }
  function kmPart(prompt, km, cands, sol, text) {
    return B.number(prompt, km, matchDiag(cands), sol, ['Find the distances in grid units first.', 'Grid units × the scale gives metres; divide by 1000 for kilometres.'], text, { after: 'km' });
  }
  function pent(o) { return { P: [-o.a, o.b], Q: [o.a, o.b], R: [o.a, o.c], S: [0, o.c + o.h], T: [-o.a, o.c] }; }
  function perim(o) { return cl(2 * o.a + 2 * (o.c - o.b) + 2 * Math.hypot(o.a, o.h)); }
  function gateFig(o) {
    var W = 240, H = 170, sc = Math.min(150 / o.w, 110 / o.h), X = function (x) { return 40 + x * sc; }, Y = function (y) { return H - 30 - y * sc; };
    var g = '<rect x="' + X(0) + '" y="' + Y(o.h) + '" width="' + o.w * sc + '" height="' + o.h * sc + '" fill="none" stroke="#2b3340" stroke-width="2.2"/>' +
      '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(o.w) + '" y2="' + Y(o.h) + '" stroke="#2b55a0" stroke-width="2.4"/>' +
      '<circle cx="' + X(0) + '" cy="' + Y(0) + '" r="3" fill="#2b3340"/><circle cx="' + X(o.w) + '" cy="' + Y(o.h) + '" r="3" fill="#2b3340"/>' +
      '<text x="' + (X(0) - 4) + '" y="' + (Y(0) + 15) + '" font-size="12" text-anchor="end" fill="#2b3340">(0, 0)</text>' +
      '<text x="' + (X(o.w) - 4) + '" y="' + (Y(o.h) - 7) + '" font-size="12" text-anchor="middle" fill="#2b3340">(' + o.w + ', ' + o.h + ')</text>' +
      '<text x="' + X(o.w / 2) + '" y="' + (Y(0) + 17) + '" font-size="12" text-anchor="middle" fill="#2b3340">' + o.w + ' m</text>' +
      '<text x="' + (X(0) - 6) + '" y="' + Y(o.h / 2) + '" font-size="12" text-anchor="end" fill="#2b3340">' + o.h + ' m</text>';
    return '<div class="fig"><svg class="fig-svg" viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:260px" role="img" aria-label="gate with a diagonal brace">' + g + '</svg></div>';
  }
  /* several points in one box (any order). o.diag(list) -> {code, hint}, o.missHint */
  function ptsCheck(want, o) {
    o = o || {};
    return function (resp) {
      var L = readPts(resp), rr = readRes(L); if (rr) return rr;
      var A = []; L.pts.forEach(function (p) { if (!A.some(function (q) { return samePt([q.x, q.y], [p.x, p.y]); })) A.push(p); });
      var miss = want.filter(function (w) { return !A.some(function (p) { return samePt([p.x, p.y], w); }); });
      var extra = A.filter(function (p) { return !want.some(function (w) { return samePt([p.x, p.y], w); }); });
      if (!miss.length && !extra.length) {
        if (A.some(function (p) { return !p.simple; })) return form('simplify', 'Right points — now simplify each coordinate to a single number.');
        if (L.noParen) return form('pt-brackets', 'Right coordinates — write each point in brackets: ' + t('(x,\\ y)') + '.');
        return ok();
      }
      if (o.diag) { var h = o.diag(A.map(function (p) { return [p.x, p.y]; })); if (h) return wrong(h.code, h.hint); }
      if (miss.length && !extra.length) return wrong(o.missCode || 'pts-missing', o.missHint || 'Correct so far — but ' + (miss.length === 1 ? 'there is another point' : 'there are more points') + ' that works.');
      if (extra.length && !miss.length) return wrong('pts-extra', 'One of your points doesn’t satisfy the conditions — check each one.');
      return wrong('pts', null);
    };
  }

  HW.defineLesson({ id: 'u6l5', unit: 6, num: 5, title: 'Applications: Distance, Midpoint, and Finding a Missing Endpoint', outcome: 'RF3', questions: QUESTIONS, extra: EXTRA });
})(window);
