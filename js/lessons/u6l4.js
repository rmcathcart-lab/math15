/* Math 15 · Unit 6 · Lesson 4 — The Midpoint Formula (outcome RF3 on every part)
 * Assignment 4 (u6_L04.tex, Questions 1–15) and the Lesson 4 Extra Practice (u6_EP04.tex, Questions 1–18).
 * Every part is a generator: same structure, idea and difficulty as the booklet question (the booklet's own numbers are
 * among the possible versions), new numbers from the seed. Model: Math 10C u6l1.js (its distance-and-midpoint scope:
 * the point checker, midpoint/endpoint diagnoses and wrong-answer codes are copied from there).
 * Conversions: "explain" / "check the claim" / error analysis / reasoning -> multiple choice whose options are reasons;
 * "mark the midpoint on the grid" -> the graph pad (points snap to half units); "state the endpoints" -> point boxes.
 * Changed from the booklet: Q14 (numerical response) always has a positive answer — the booklet's answer is −6, which
 * a numerical-response grid can't hold (see the report). Halves are accepted as fractions or decimals; a mixed number
 * gets a nudge.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 13(a) (three points that cut a segment into four equal parts). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u6l4';

  /* labels for the codes used here (a code another file already labels keeps its label) */
  var CODES = {
    'd-no-root': 'Distance: forgot the square root (gave d²)', 'd-legs': 'Distance: added the run and rise', 'd-no-square': 'Distance: didn’t square the differences',
    'd-added': 'Distance: added the coordinates instead of subtracting', 'd-sign': 'Distance: sign slip subtracting a negative coordinate', 'd-half': 'Gave half the distance',
    'mid-subtract': 'Midpoint: subtracted the coordinates', 'mid-no-halve': 'Midpoint: didn’t divide by 2', 'mid-wrong-seg': 'Midpoint of the wrong segment',
    'end-average': 'Missing endpoint: averaged instead of doubling and subtracting', 'end-step': 'Missing endpoint: gave the step from A to M', 'end-sign': 'Missing endpoint: added instead of subtracting',
    'end-sum': 'Missing endpoint: added the midpoint and the endpoint', 'end-double': 'Missing endpoint: doubled the midpoint but didn’t subtract', 'end-gave-y': 'Gave the y-value instead of x',
    'pt-swap': 'Coordinates swapped', 'pt-x': 'Wrong x-coordinate', 'pt-y': 'Wrong y-coordinate', pt: 'Wrong point', 'pt-not-pair': 'Gave one number for a point', 'pt-brackets': 'Point without brackets',
    'pt-many': 'Gave several points for one', 'pt-dir': 'West/south not written as negative', 'pts-missing': 'Missed a point', 'pts-extra': 'A point that doesn’t work', pts: 'Wrong points',
    'graph-swap': 'Plotted (y, x) instead of (x, y)', 'exact-not-dec': 'Gave the exact value where the decimal was asked',
    'u6l4-mid-sign': 'Midpoint: sign slip adding a negative coordinate', 'u6l4-round-half': 'Rounded a half-unit midpoint to a whole number',
    'u6l4-count-step': 'Gave the number of squares to count, not the point', 'u6l4-gave-sum': 'Gave the sum of the coordinates instead of one coordinate',
    'u6l4-other-coord': 'Gave the other coordinate', 'u6l4-quarter-wrong': 'Quarter point: halved the wrong segment', 'u6l4-not-ordered': 'Points not in order from A to B'
  };
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  HW.addPartial({ 'u6l4-mid-sign': 's', 'u6l4-round-half': 's', 'u6l4-count-step': 'b', 'u6l4-gave-sum': 'b', 'u6l4-other-coord': 'n', 'u6l4-quarter-wrong': 'b', 'u6l4-not-ordered': 's' });

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
  /* typical wrong answers (from a diagnosis list [[value, code, hint]]) as the part's bad list */
  function withBad(p, cands, dp) { p.bad = (p.bad || []).concat((cands || []).filter(function (c) { return isFinite(c[0]) && Math.abs(c[0] - Number(p.key)) > 1e-6; }).map(function (c) { return dp == null ? String(cl(c[0])) : rd(c[0], dp).toFixed(Math.max(dp, 0)); }).filter(function (b) { return Math.abs(Number(b) - Number(p.key)) > 1e-9; })); return p; }
  function mcPart(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }

  /* ======================= lesson-specific helpers ======================= */
  /* a midpoint part from two named endpoints */
  function midP(prompt, P, Q, text, o) {
    o = o || {};
    var W = mid(P, Q);
    return ptPart(prompt, W, { cands: midCands(P, Q).concat(o.cands || []), frac: o.frac, round: o.frac, before: o.before }, (o.pre || '') + t(mLine(P, Q, 'M', o.frac)) + '.' + (o.post || ''), o.hints || HM, text);
  }
  function pairTex(n1, P, n2, Q) { return t(nm(n1, P) + ',\\ ' + nm(n2, Q)); }
  /* tenths as numbers: k/10 */
  function tn(k) { return cl(k / 10); }
  function hasNeg(P, Q) { return P[0] < 0 || P[1] < 0 || Q[0] < 0 || Q[1] < 0; }
  /* a pair with whole-number midpoint: signs sx = [sx1, sy1, sx2, sy2] (+1 / -1), magnitudes in [lo, hi] */
  function signedPair(r, sg, lo, hi) {
    return pickWhere(function () { return { P: [sg[0] * r.int(lo, hi), sg[1] * r.int(lo, hi)], Q: [sg[2] * r.int(lo, hi), sg[3] * r.int(lo, hi)] }; },
      function (z) { return even(z.P[0] + z.Q[0]) && even(z.P[1] + z.Q[1]) && z.P[0] !== z.Q[0] && z.P[1] !== z.Q[1] && !samePt(mid(z.P, z.Q), [0, 0]) && !isEx4(z); });
  }
  /* never the lesson's own Example 4 pairs */
  var EX4 = [[[-6, 3], [2, -7]], [[-9, -4], [3, -10]], [[-3, 4], [2, -1]]];
  function isEx4(z) { return EX4.some(function (e) { return (samePt(z.P, e[0]) && samePt(z.Q, e[1])) || (samePt(z.P, e[1]) && samePt(z.Q, e[0])); }); }
  function nonnegPair(r, dirX, dirY) {
    return pickWhere(function () { var P = [r.int(0, 12), r.int(0, 12)]; return { P: P, Q: [P[0] + dirX * 2 * r.int(1, 6), P[1] + dirY * 2 * r.int(1, 6)] }; },
      function (z) { return z.Q[0] >= 0 && z.Q[0] <= 14 && z.Q[1] >= 0 && z.Q[1] <= 14; });
  }
  function gridFig(segPts, labels, w) {
    return '<div class="fig">' + HW.graph({ x: w.x, y: w.y, grid: 1, labels: 2, max: 300, segs: [{ pts: segPts, start: 'none', end: 'none' }], points: segPts.map(function (p, i) { return { x: p[0], y: p[1], label: labels[i] }; }) }) + '</div>';
  }
  var W8 = { x: [-8, 8], y: [-8, 8] }, W6 = { x: [-6, 6], y: [-6, 6] };

  /* Q1: horizontal / vertical segment, midpoint by counting */
  function countPart(r, hor, bk, n1, n2) {
    var o = r.chance(0.15) ? bk : pickWhere(function () {
      var c = r.pick(pm(1, 6)), a = r.int(-7, 5), L = 2 * r.int(2, 6), s = r.chance(0.5);
      var p = s ? a : a + L, q = s ? a + L : a;
      return hor ? { P: [p, c], Q: [q, c] } : { P: [c, p], Q: [c, q] };
    }, function (z) { return [z.P, z.Q].every(function (p) { return Math.abs(p[0]) <= 7 && Math.abs(p[1]) <= 7; }); });
    var P = o.P, Q = o.Q, i = hor ? 0 : 1, L = Math.abs(Q[i] - P[i]), W = mid(P, Q), c = hor ? 'x' : 'y', oc = hor ? 'y' : 'x';
    var lo = P[i] < Q[i] ? P : Q, nlo = P[i] < Q[i] ? n1 : n2;
    var stepPt = hor ? [L / 2, P[1]] : [P[0], L / 2];
    var cands = midCands(P, Q).concat([[stepPt, 'u6l4-count-step', t(F(L / 2)) + ' is the number of squares to step from an endpoint — now take that step: start at ' + t(nlo) + ' and count ' + t(F(L / 2)) + ' squares ' + (hor ? 'right' : 'up') + '.']]);
    var sol = 'The segment is ' + (hor ? 'horizontal' : 'vertical') + ': both endpoints have ' + t(oc + '=' + nT(P[1 - i])) + ', so the midpoint does too.<br>From ' + t(nm(n1, P)) + ' to ' + t(nm(n2, Q)) + ' is ' + t(F(L)) + ' squares, so step half of that, ' + t(F(L / 2)) + ' squares, from ' + t(nlo) + ': ' + t(c + '=' + nT(lo[i]) + '+' + F(L / 2) + '=' + nT(W[i])) + '.<br>' + t('M' + ptT(W)) + '. (Averaging gives the same: ' + t('\\dfrac{' + nT(P[i]) + '+' + sgp(Q[i]) + '}{2}=' + nT(W[i])) + '.)';
    var p = ptPart((hor ? 'Horizontal' : 'Vertical') + ' segment: ' + pairTex(n1, P, n2, Q) + '.' + gridFig([P, Q], [n1, n2], W8), W, { cands: cands, before: 'M =' }, sol,
      ['Count the squares between the endpoints, then step <b>half</b> that many from one end.', 'The ' + t(oc) + '-coordinate doesn’t change along a ' + (hor ? 'horizontal' : 'vertical') + ' segment.'], (hor ? 'horizontal' : 'vertical') + ' midpoint by counting');
    return p;
  }

  /* ======================= Assignment 4 ======================= */
  var QUESTIONS = [
    { num: '1', section: 'Part A — Finding midpoints', stem: 'Each segment is horizontal or vertical. Without using the midpoint formula, determine the midpoint by counting squares on the grid.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return countPart(r, true, { P: [-7, 3], Q: [1, 3] }, 'A', 'B'); } },
      { id: '1b', level: 'BEG', make: function (r) { return countPart(r, false, { P: [4, 7], Q: [4, -5] }, 'C', 'D'); } }] },
    { num: '2', stem: 'Use the midpoint formula to determine the midpoint of the segment with each pair of endpoints.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { var o = r.chance(0.15) ? { P: [3, 5], Q: [9, 11] } : nonnegPair(r, 1, 1); return midP(pairTex('A', o.P, 'B', o.Q), o.P, o.Q, 'midpoint, whole numbers (a)'); } },
      { id: '2b', level: 'BEG', make: function (r) { var o = r.chance(0.15) ? { P: [2, 10], Q: [8, 4] } : nonnegPair(r, 1, -1); return midP(pairTex('C', o.P, 'D', o.Q), o.P, o.Q, 'midpoint, whole numbers (b)'); } },
      { id: '2c', level: 'BEG', make: function (r) { var o = r.chance(0.15) ? { P: [1, 7], Q: [11, 3] } : nonnegPair(r, 1, -1); return midP(pairTex('E', o.P, 'F', o.Q), o.P, o.Q, 'midpoint, whole numbers (c)'); } },
      { id: '2d', level: 'BEG', make: function (r) { var o = r.chance(0.15) ? { P: [6, 2], Q: [0, 14] } : nonnegPair(r, -1, 1); return midP(pairTex('G', o.P, 'H', o.Q), o.P, o.Q, 'midpoint, whole numbers (d)'); } }] },
    { num: '3', stem: 'Determine the midpoint of the segment with each pair of endpoints. Each pair involves at least one negative coordinate.', parts: [
      { id: '3a', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { P: [-4, 6], Q: [2, -8] } : signedPair(r, [-1, 1, 1, -1], 1, 12); return midP(pairTex('A', o.P, 'B', o.Q), o.P, o.Q, 'midpoint with negatives (a)'); } },
      { id: '3b', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { P: [-10, -3], Q: [6, -11] } : signedPair(r, [-1, -1, 1, -1], 1, 12); return midP(pairTex('C', o.P, 'D', o.Q), o.P, o.Q, 'midpoint with negatives (b)'); } },
      { id: '3c', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { P: [-7, 9], Q: [-1, -5] } : signedPair(r, [-1, 1, -1, -1], 1, 12); return midP(pairTex('E', o.P, 'F', o.Q), o.P, o.Q, 'midpoint with negatives (c)'); } },
      { id: '3d', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { P: [5, -6], Q: [-11, -12] } : signedPair(r, [1, -1, -1, -1], 1, 12); return midP(pairTex('G', o.P, 'H', o.Q), o.P, o.Q, 'midpoint with negatives (d)'); } }] },
    { num: '4', stem: 'Determine the midpoint of the segment with each pair of endpoints.', parts: [
      { id: '4a', level: 'EMG', make: function (r) {
        var o = r.chance(0.15) ? { P: [-2.5, 3.6], Q: [4.5, -7.6] } : pickWhere(function () { return { P: [-(r.int(0, 6) + 0.5), tn(r.int(11, 89))], Q: [r.int(0, 6) + 0.5, -tn(r.int(11, 99))] }; },
          function (z) { var sx = cl(z.P[0] + z.Q[0]), sy = cl(z.P[1] + z.Q[1]); return isInt(sx) && even(sx) && isInt(sy) && even(sy) && !isInt(z.P[1]) && sx !== 0 && sy !== 0; });
        return midP(pairTex('P', o.P, 'Q', o.Q), o.P, o.Q, 'midpoint with decimals (whole answer)');
      } },
      { id: '4b', level: 'EMG', make: function (r) {
        var o = r.chance(0.15) ? { P: [5.4, -2.2], Q: [-1.8, 6.6] } : pickWhere(function () { return { P: [tn(r.int(11, 79)), -tn(r.int(11, 59))], Q: [-tn(r.int(11, 49)), tn(r.int(11, 89))] }; },
          function (z) { var sx = Math.round((z.P[0] + z.Q[0]) * 10), sy = Math.round((z.P[1] + z.Q[1]) * 10); return even(sx) && even(sy) && sx % 20 !== 0 && sy % 20 !== 0 && sx > 0 && sy > 0 && [z.P[0], z.P[1], z.Q[0], z.Q[1]].every(function (v) { return !isInt(v); }); });
        return midP(pairTex('R', o.P, 'S', o.Q), o.P, o.Q, 'midpoint with decimals (decimal answer)');
      } }] },
    { num: '5', stem: 'Mixed review: determine the midpoint of the segment with each pair of endpoints.', parts: [
      { id: '5a', level: 'BEG', make: function (r) { var o = r.chance(0.15) ? { P: [8, 1], Q: [2, 9] } : nonnegPair(r, -1, 1); return midP(pairTex('A', o.P, 'B', o.Q), o.P, o.Q, 'mixed review (a)'); } },
      { id: '5b', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { P: [-9, 4], Q: [-1, -10] } : signedPair(r, [-1, 1, -1, -1], 1, 12); return midP(pairTex('C', o.P, 'D', o.Q), o.P, o.Q, 'mixed review (b)'); } },
      { id: '5c', level: 'EMG', make: function (r) {
        var o = r.chance(0.15) ? { P: [3.2, -4.8], Q: [-1.2, 0.8] } : pickWhere(function () { var f = r.int(1, 9), g = r.int(1, 9); return { P: [tn(10 * r.int(1, 6) + f), -tn(10 * r.int(1, 6) + g)], Q: [-tn(10 * r.int(0, 4) + f), tn(10 * r.int(0, 4) + g)] }; },
          function (z) { var sx = cl(z.P[0] + z.Q[0]), sy = cl(z.P[1] + z.Q[1]); return isInt(sx) && even(sx) && isInt(sy) && even(sy) && sx !== 0 && sy !== 0; });
        return midP(pairTex('E', o.P, 'F', o.Q), o.P, o.Q, 'mixed review (c), decimals');
      } }] },
    /* ---------------- Part B ---------------- */
    { num: '6', section: 'Part B — Explaining, checking and applying', parts: [
      { id: '6a', sub: 'a', level: 'BEG', make: function (r) {
        var P = [r.pick(pm(1, 6)), r.pick(pm(1, 6))], v = [2 * r.int(1, 4), 2 * r.int(1, 4) * r.pick([1, -1])], Q = add(P, v), M = mid(P, Q);
        return mcPart(r, 'Which statement describes the <b>midpoint</b> of a line segment? (For example, the midpoint of ' + t(nm('P', P)) + ' and ' + t(nm('Q', Q)) + ' is ' + t(nm('M', M)) + '.)', [
          { html: 'The point on the segment exactly halfway between the endpoints, so it is the same distance from each end and splits the segment into two equal pieces.', right: true },
          { html: 'Any point that is the same distance from both endpoints.', why: 'Lots of points are the same distance from both ends (above or below the segment). The midpoint is the one that is also <b>on</b> the segment, halfway along.' },
          { html: 'The length of the segment divided by ' + t('2') + '.', why: 'Half the length is a <b>distance</b> (a number). The midpoint is a <b>point</b> — a location with two coordinates.' },
          { html: 'The point where the segment crosses an axis.', why: 'A segment may not cross an axis at all. The midpoint is the point exactly halfway between the two endpoints.' }],
          'The midpoint ' + t('M') + ' of ' + t('\\overline{PQ}') + ' is the point on the segment exactly halfway between ' + t('P') + ' and ' + t('Q') + ': ' + t('PM=MQ') + ', so it splits the segment into two equal pieces.', ['A midpoint is a <b>point</b>, and it is <b>on</b> the segment.'], 'what a midpoint is');
      } },
      { id: '6b', sub: 'b', level: 'PRG', make: function (r) {
        var a = r.pick(pm(1, 9)), b = pickWhere(function () { return r.pick(pm(1, 11)); }, function (z) { return z !== a && even(z + a) && z + a !== 0; }), lo = Math.min(a, b), hi = Math.max(a, b), m = (a + b) / 2;
        return mcPart(r, 'Why does averaging the endpoints’ ' + t('x') + '-coordinates give the ' + t('x') + '-coordinate of the midpoint? (Example: endpoints with ' + t('x=' + nT(a)) + ' and ' + t('x=' + nT(b)) + '.)', [
          { html: 'The average of two numbers is exactly halfway between them on a number line (' + t('\\tfrac{' + nT(a) + '+' + sgp(b) + '}{2}=' + nT(m)) + ' is ' + t(F(Math.abs(m - lo))) + ' from each), and the midpoint’s ' + t('x') + '-position must be halfway between the endpoints’ ' + t('x') + '-positions.', right: true },
          { html: 'Averaging gives the distance between the endpoints.', why: 'The distance comes from <b>subtracting</b> (the distance formula). Averaging gives the number halfway between the two ' + t('x') + '-values: ' + t(nT(m)) + '.' },
          { html: 'The midpoint’s ' + t('x') + '-coordinate is always half of the larger ' + t('x') + '-coordinate.', why: 'Half of ' + t(nT(hi)) + ' is ' + t(nT(hi / 2)) + ', but the number halfway between ' + t(nT(lo)) + ' and ' + t(nT(hi)) + ' is ' + t(nT(m)) + '. Both endpoints count.' },
          { html: 'Averaging works only when both coordinates are positive.', why: 'It works for any numbers: ' + t(nT(m)) + ' is exactly halfway between ' + t(nT(lo)) + ' and ' + t(nT(hi)) + ' (' + t(F(Math.abs(m - lo))) + ' from each).' }],
          'Adding two numbers and halving lands exactly halfway between them: here ' + t('\\tfrac{' + nT(a) + '+' + sgp(b) + '}{2}=' + nT(m)) + ', which is ' + t(F(Math.abs(m - lo))) + ' units from both ' + t(nT(lo)) + ' and ' + t(nT(hi)) + '. The midpoint is halfway between the endpoints, so its ' + t('x') + '-coordinate is halfway between their ' + t('x') + '-coordinates — the average. (The same goes for ' + t('y') + '.)',
          ['Picture the two ' + t('x') + '-values on a number line. Where is their average?'], 'why averaging works');
      } }] },
    { num: '7', shared: function (r) {
        if (r.chance(0.15)) return { S: [-6, 10], T: [8, -2], kind: 'halfX' };
        var o = signedPair(r, r.pick([[-1, 1, 1, -1], [1, 1, -1, -1], [-1, -1, 1, 1], [1, -1, -1, 1]]), 1, 12);
        return { S: o.P, T: o.Q, kind: r.pick(['halfX', 'halfY', 'sub', 'signX', 'signY', 'right']) };
      },
      stem: function (o) { var c = claimOf(o); return 'A city planner claims that the midpoint of the segment joining ' + t(nm('S', o.S)) + ' and ' + t(nm('T', o.T)) + ' is ' + t(ptT(c)) + '.'; },
      parts: [
        { id: '7a', sub: 'a', level: 'EMG', make: function (r, o) {
          var M = mid(o.S, o.T), c = claimOf(o), xr = same(c[0], M[0]), yr = same(c[1], M[1]);
          var opts = [
            { html: 'The claim is correct.', right: xr && yr, why: 'Average each coordinate yourself: ' + t(mLine(o.S, o.T, 'M')) + '.' },
            { html: 'The claim is incorrect — the ' + t('x') + '-coordinate is wrong.', right: !xr && yr, why: xr ? 'The ' + t('x') + '-coordinate, ' + t(nT(c[0])) + ', is right: ' + t('\\tfrac{' + nT(o.S[0]) + '+' + sgp(o.T[0]) + '}{2}=' + nT(M[0])) + '.' : 'Check the ' + t('y') + '-coordinate too.' },
            { html: 'The claim is incorrect — the ' + t('y') + '-coordinate is wrong.', right: xr && !yr, why: yr ? 'The ' + t('y') + '-coordinate, ' + t(nT(c[1])) + ', is right: ' + t('\\tfrac{' + nT(o.S[1]) + '+' + sgp(o.T[1]) + '}{2}=' + nT(M[1])) + '.' : 'Check the ' + t('x') + '-coordinate too.' },
            { html: 'The claim is incorrect — both coordinates are wrong.', right: !xr && !yr, why: 'Compare each coordinate with the averages: ' + t(mLine(o.S, o.T, 'M')) + '.' }];
          return mcPart(r, 'Use the midpoint formula to check the claim.', opts,
            t(mLine(o.S, o.T, 'M')) + '. The planner’s point is ' + t(ptT(c)) + ', so ' + (xr && yr ? 'the claim is <b>correct</b>.' : 'the claim is <b>incorrect</b>' + (!xr && !yr ? ' (both coordinates are wrong).' : !xr ? ' (the ' + t('x') + '-coordinate is wrong).' : ' (the ' + t('y') + '-coordinate is wrong).')),
            HM, 'check the planner’s claim', true);
        } },
        { id: '7b', sub: 'b', level: 'EMG', make: function (r, o) {
          var c = claimOf(o), M = mid(o.S, o.T), cands = midCands(o.S, o.T);
          if (!samePt(c, M)) cands.unshift([c, 'pt', 'That is the planner’s point. Calculate the midpoint yourself: average the ' + t('x') + '-coordinates, then the ' + t('y') + '-coordinates.']);
          return ptPart('State the correct midpoint of ' + t('\\overline{ST}') + '.', M, { cands: cands, before: 'M =' }, t(mLine(o.S, o.T, 'M')) + '.' + (samePt(c, M) ? ' (The planner was right.)' : ' The planner’s ' + t(ptT(c)) + ' is incorrect.'), HM, 'correct midpoint ST');
        } }] },
    { num: '8', parts: [
      { id: '8', level: 'EMG', make: function (r) {
        var o = r.chance(0.15) ? { P: [-18, 12], Q: [24, -6] } : signedPair(r, [-1, 1, 1, -1], 4, 30);
        return midP('Two trailheads, Riverside at ' + t(ptT(o.P)) + ' and Summit View at ' + t(ptT(o.Q)) + ', are joined by a straight trail on a map where each unit is ' + t('1') + '&nbsp;km. Rangers want a rest shelter exactly halfway between them. Determine its coordinates.', o.P, o.Q, 'rest shelter midpoint', { pre: '“Exactly halfway between” is the midpoint of the trail.<br>' });
      } }] },
    { num: '9', parts: [
      { id: '9', level: 'PRG', make: function (r) {
        var o = r.chance(0.15) ? { a: 6, ae: 1, b: 10, bn: 1, c: 8, ce: -1, d: 2, dn: -1 } : pickWhere(function () {
          var ae = r.pick([1, 1, -1]), bn = r.pick([1, 1, -1]); return { a: r.int(2, 12), ae: ae, b: r.int(2, 12), bn: bn, c: r.int(2, 12), ce: -ae, d: r.int(2, 12), dn: -bn };
        }, function (z) { return even(z.ae * z.a + z.ce * z.c) && even(z.bn * z.b + z.dn * z.d) && z.a !== z.c && z.b !== z.d; });
        var J = [o.ae * o.a, o.bn * o.b], T = [o.ce * o.c, o.dn * o.d], M = mid(J, T);
        var ew = function (s) { return s > 0 ? 'east' : 'west'; }, ns = function (s) { return s > 0 ? 'north' : 'south'; };
        var dirHint = 'East and north are positive; <b>west and south are negative</b>. Write each house as a point first.';
        var cands = midCands(J, T).concat([[mid([o.a, o.b], [o.c, o.d]), 'pt-dir', dirHint], [mid(J, [-T[0], T[1]]), 'pt-dir', dirHint], [mid(J, [T[0], -T[1]]), 'pt-dir', dirHint], [mid([J[1], J[0]], [T[1], T[0]]), 'pt-swap', 'East–west distances are ' + t('x') + '-coordinates and north–south distances are ' + t('y') + '-coordinates: write each house as (east, north).']]);
        return ptPart('Jasmine’s house is ' + t(o.a) + ' blocks ' + ew(o.ae) + ' and ' + t(o.b) + ' blocks ' + ns(o.bn) + ' of the community centre. Tyler’s house is ' + t(o.c) + ' blocks ' + ew(o.ce) + ' and ' + t(o.d) + ' blocks ' + ns(o.dn) + ' of the community centre. Using the community centre as the origin, determine the coordinates of the point exactly halfway between their houses.', M, { cands: cands },
          'East is ' + t('+x') + ', north is ' + t('+y') + '; west and south are negative.<br>Jasmine: ' + t(ptT(J)) + ', Tyler: ' + t(ptT(T)) + '.<br>' + t(mLine(J, T, 'M')) + '.',
          ['Write each house as a point first: east/west is the ' + t('x') + '-coordinate, north/south is the ' + t('y') + '-coordinate, and west/south are negative.', HM[0]], 'halfway between the houses');
      } }] },
    { num: '10', parts: [
      { id: '10', level: 'BEG', make: function (r) {
        var o = r.chance(0.2) ? { P: [2, -3], Q: [10, 7] } : pickWhere(function () { return { P: [r.int(1, 6), -r.int(1, 8)], Q: [r.int(7, 14), r.int(1, 10)] }; },
          function (z) { return even(z.P[0] + z.Q[0]) && even(z.P[1] + z.Q[1]); });
        var M = mid(o.P, o.Q), h = scl(sub(o.Q, o.P), 0.5), s = add(o.P, o.Q), d = sub(o.Q, o.P);
        var opts = [{ html: t(ptT(M)), right: true }, { html: t(ptT(h)), why: 'That is half the <b>difference</b> of each coordinate. The midpoint <b>adds</b> the coordinates, then halves.' },
          { html: t(ptT(s)), why: 'You added the coordinates — now divide each sum by ' + t('2') + '.' }, { html: t(ptT(d)), why: 'Those are the differences of the coordinates (the run and the rise). Add the coordinates and halve.' }];
        var seen = []; opts = opts.filter(function (x) { var k = x.html; if (seen.indexOf(k) >= 0) return false; seen.push(k); return true; });
        while (opts.length < 4) { var q = [M[0] + r.pick([-2, -1, 1, 2]), M[1] + r.pick([-3, -1, 1, 3])], k2 = t(ptT(q)); if (seen.indexOf(k2) < 0) { seen.push(k2); opts.push({ html: k2, why: 'Average each coordinate: ' + t(mLine(o.P, o.Q, 'M')) + '.' }); } }
        return mcPart(r, '<i>(Multiple Choice)</i> The midpoint of the segment joining ' + t(ptT(o.P)) + ' and ' + t(ptT(o.Q)) + ' is', opts, t(mLine(o.P, o.Q, 'M')) + '.', HM, 'MC midpoint');
      } }] },
    { num: '11', parts: [
      { id: '11', level: 'EMG', make: function (r) {
        var a, b; if (r.chance(0.2)) { a = 3; b = 5; } else { var o = pickWhere(function () { return [r.int(1, 9), r.int(1, 9)]; }, function (z) { return z[0] !== z[1]; }); a = o[0]; b = o[1]; }
        var P = [a, b];
        return mcPart(r, '<i>(Multiple Choice)</i> Which pair of points has a midpoint at the origin, ' + t('(0,\\ 0)') + '?', [
          { html: t(ptT(P)) + ' and ' + t(ptT([-a, -b])), right: true },
          { html: t(ptT(P)) + ' and ' + t(ptT([a, -b])), why: 'The ' + t('y') + '-coordinates cancel, but the ' + t('x') + '-coordinates average to ' + t('\\tfrac{' + a + '+' + a + '}{2}=' + a) + ', so the midpoint is ' + t(ptT([a, 0])) + '.' },
          { html: t(ptT(P)) + ' and ' + t(ptT([-a, b])), why: 'The ' + t('x') + '-coordinates cancel, but the ' + t('y') + '-coordinates average to ' + t(b) + ', so the midpoint is ' + t(ptT([0, b])) + '.' },
          { html: t(ptT(P)) + ' and ' + t(ptT([b, a])), why: 'Swapping the coordinates gives the midpoint ' + t(ptT(mid(P, [b, a]))) + ', not the origin.' }],
          'For the midpoint to be ' + t('(0,\\ 0)') + ', each pair of coordinates must add to ' + t('0') + ': ' + t('\\left(\\dfrac{' + a + '+(' + (-a) + ')}{2},\\ \\dfrac{' + b + '+(' + (-b) + ')}{2}\\right)=(0,\\ 0)') + '. The two points are opposites: ' + t(ptT(P)) + ' and ' + t(ptT([-a, -b])) + '.',
          ['For each option, average the ' + t('x') + '-coordinates and the ' + t('y') + '-coordinates. Both averages must be ' + t('0') + '.'], 'MC midpoint at the origin');
      } }] },
    { num: '12', parts: [
      { id: '12', level: 'LIM', make: function (r) {
        var L = r.pick([['1', '2'], ['A', 'B'], ['P', 'Q'], ['C', 'D'], ['E', 'F'], ['R', 'S'], ['J', 'K']]), x1 = 'x_{' + L[0] + '}', x2 = 'x_{' + L[1] + '}', y1 = 'y_{' + L[0] + '}', y2 = 'y_{' + L[1] + '}';
        var WRONG = [
          { html: t('\\left(' + x2 + '-' + x1 + ',\\ ' + y2 + '-' + y1 + '\\right)'), why: 'Those are the run and the rise (differences). The midpoint <b>adds</b> the coordinates and halves.' },
          { html: t('\\sqrt{(' + x2 + '-' + x1 + ')^{2}+(' + y2 + '-' + y1 + ')^{2}}'), why: 'That is the <b>distance</b> formula — it gives a length, not a point.' },
          { html: t('\\left(\\dfrac{' + x1 + '+' + y1 + '}{2},\\ \\dfrac{' + x2 + '+' + y2 + '}{2}\\right)'), why: 'That averages each point’s own two coordinates. Average the two ' + t('x') + '-coordinates together, and the two ' + t('y') + '-coordinates together.' },
          { html: t('\\left(\\dfrac{' + x2 + '-' + x1 + '}{2},\\ \\dfrac{' + y2 + '-' + y1 + '}{2}\\right)'), why: 'That is half the run and half the rise — the <b>step</b> from one endpoint to the midpoint, not the midpoint itself.' },
          { html: t('\\left(' + x1 + '+' + x2 + ',\\ ' + y1 + '+' + y2 + '\\right)'), why: 'Right idea, but each sum still has to be divided by ' + t('2') + '.' },
          { html: t('\\left(\\dfrac{' + x1 + '+' + x2 + '}{2},\\ \\dfrac{' + y1 + '-' + y2 + '}{2}\\right)'), why: 'The ' + t('y') + '-coordinates are <b>added</b> too, just like the ' + t('x') + '-coordinates.' }];
        var ws = r.chance(0.3) ? WRONG.slice(0, 3) : r.sample(WRONG, 3);
        return mcPart(r, '<i>(Multiple Choice)</i> Which of the following correctly calculates the midpoint of a segment with endpoints ' + t('(' + x1 + ',\\ ' + y1 + ')') + ' and ' + t('(' + x2 + ',\\ ' + y2 + ')') + '?',
          [{ html: t('\\left(\\dfrac{' + x1 + '+' + x2 + '}{2},\\ \\dfrac{' + y1 + '+' + y2 + '}{2}\\right)'), right: true }].concat(ws),
          'The midpoint averages the ' + t('x') + '-coordinates and averages the ' + t('y') + '-coordinates: ' + t('M\\left(\\dfrac{' + x1 + '+' + x2 + '}{2},\\ \\dfrac{' + y1 + '+' + y2 + '}{2}\\right)') + '.', ['Add the two ' + t('x') + '’s and halve; add the two ' + t('y') + '’s and halve.'], 'MC midpoint formula');
      } }] },
    { num: '13', parts: [
      { id: '13', level: 'EMG', make: function (r) {
        var o = r.chance(0.2) ? { P: [-9, 4], Q: [15, -12] } : pickWhere(function () { return { P: [-r.int(2, 14), r.int(1, 12)], Q: [r.int(4, 20), -r.int(1, 14)] }; }, function (z) { return even(z.P[0] + z.Q[0]) && even(z.P[1] + z.Q[1]) && z.P[0] + z.Q[0] > 0; });
        var M = mid(o.P, o.Q);
        var c = [[(o.Q[0] - o.P[0]) / 2, 'mid-subtract', 'You subtracted. The midpoint’s ' + t('x') + '-coordinate is the <b>average</b>: add the two ' + t('x') + '-coordinates, then divide by ' + t('2') + '.'], [o.P[0] + o.Q[0], 'mid-no-halve', 'Divide the sum by ' + t('2') + '.'],
          [M[1], 'u6l4-other-coord', 'That is the ' + t('y') + '-coordinate. The question asks for the ' + t('x') + '-coordinate.']].filter(function (x) { return !same(x[0], M[0]); });
        return withBad(B.nr('<i>(Numerical Response)</i> The midpoint of the segment joining ' + t(ptT(o.P)) + ' and ' + t(ptT(o.Q)) + ' has ' + t('x') + '-coordinate ______.', M[0], numDiag(c),
          t('x_M=\\dfrac{' + nT(o.P[0]) + '+' + sgp(o.Q[0]) + '}{2}=\\dfrac{' + nT(o.P[0] + o.Q[0]) + '}{2}=' + nT(M[0])) + '. (The full midpoint is ' + t(ptT(M)) + '.)', HM, 'NR midpoint x'), c);
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        /* the booklet's version is (6, 17) and (−2, −5), y-coordinate 6; the y-coordinate is always positive so it fits a numerical-response grid */
        var o = pickWhere(function () { return { P: [r.int(1, 12), r.int(5, 20)], Q: [-r.int(1, 10), -r.int(1, 12)] }; }, function (z) { return even(z.P[0] + z.Q[0]) && even(z.P[1] + z.Q[1]) && z.P[1] + z.Q[1] > 0; });
        if (r.chance(0.15)) o = { P: [6, 17], Q: [-2, -5] };
        var M = mid(o.P, o.Q);
        var c = [[(o.P[1] - o.Q[1]) / 2, 'mid-subtract', 'You subtracted. Add the two ' + t('y') + '-coordinates, then divide by ' + t('2') + '.'], [o.P[1] + o.Q[1], 'mid-no-halve', 'Divide the sum by ' + t('2') + '.'],
          [M[0], 'u6l4-other-coord', 'That is the ' + t('x') + '-coordinate. The question asks for the ' + t('y') + '-coordinate.']].filter(function (x) { return !same(x[0], M[1]); });
        return withBad(B.nr('<i>(Numerical Response)</i> The midpoint of the segment joining ' + t(ptT(o.P)) + ' and ' + t(ptT(o.Q)) + ' has ' + t('y') + '-coordinate ______.', M[1], numDiag(c),
          t('y_M=\\dfrac{' + nT(o.P[1]) + '+' + sgp(o.Q[1]) + '}{2}=\\dfrac{' + nT(o.P[1] + o.Q[1]) + '}{2}=' + nT(M[1])) + '. (The full midpoint is ' + t(ptT(M)) + '.)', HM, 'NR midpoint y'), c);
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var o = r.chance(0.2) ? { P: [-4, 9], Q: [10, -3] } : pickWhere(function () { return { P: [-r.int(1, 10), r.int(3, 14)], Q: [r.int(4, 16), -r.int(1, 10)] }; }, function (z) { var M = mid(z.P, z.Q); return even(z.P[0] + z.Q[0]) && even(z.P[1] + z.Q[1]) && M[0] + M[1] > 0 && M[0] !== 0 && M[1] !== 0; });
        var M = mid(o.P, o.Q), S = M[0] + M[1];
        var c = [[o.P[0] + o.Q[0] + o.P[1] + o.Q[1], 'mid-no-halve', 'Halve each sum first to get the midpoint, then add its two coordinates.'], [M[0], 'u6l4-gave-sum', 'That is only the ' + t('x') + '-coordinate. Add the ' + t('y') + '-coordinate to it.'], [M[1], 'u6l4-gave-sum', 'That is only the ' + t('y') + '-coordinate. Add the ' + t('x') + '-coordinate to it.'],
          [(o.Q[0] - o.P[0]) / 2 + (o.P[1] - o.Q[1]) / 2, 'mid-subtract', 'You subtracted. The midpoint adds the coordinates and halves.'], [(o.Q[0] - o.P[0]) / 2 + (o.Q[1] - o.P[1]) / 2, 'mid-subtract', 'You subtracted. The midpoint adds the coordinates and halves.']].filter(function (x) { return !same(x[0], S); });
        return withBad(B.nr('<i>(Numerical Response)</i> ' + t(nm('E', o.P)) + ' and ' + t(nm('F', o.Q)) + ' are two corners of a garden, each unit ' + t('1') + '&nbsp;m. A sprinkler sits at the midpoint of ' + t('\\overline{EF}') + '. The sum of its ' + t('x') + '- and ' + t('y') + '-coordinates is ______.', S, numDiag(c),
          t(mLine(o.P, o.Q, 'M')) + '.<br>Sum: ' + t(nT(M[0]) + '+' + sgp(M[1]) + '=' + nT(S)) + '.', ['First find the sprinkler’s position (the midpoint), then add its two coordinates.', HM[0]], 'NR sum of midpoint coordinates'), c);
      } }] }
  ];
  function claimOf(o) {
    var M = mid(o.S, o.T), sx = o.S[0] + o.T[0], sy = o.S[1] + o.T[1];
    var c = o.kind === 'halfX' ? [sx, M[1]] : o.kind === 'halfY' ? [M[0], sy] : o.kind === 'sub' ? [(o.T[0] - o.S[0]) / 2, (o.T[1] - o.S[1]) / 2] :
      o.kind === 'signX' ? [(Math.abs(o.S[0]) + Math.abs(o.T[0])) / 2 * (sx < 0 ? -1 : 1), M[1]] : o.kind === 'signY' ? [M[0], (Math.abs(o.S[1]) + Math.abs(o.T[1])) / 2 * (sy < 0 ? -1 : 1)] : M;
    if (o.kind !== 'right' && samePt(c, M)) c = [sx, M[1]];
    if (o.kind !== 'right' && samePt(c, M)) c = [M[0] + 2, M[1]];
    return [cl(c[0]), cl(c[1])];
  }

  /* ======================= Extra Practice 4 ======================= */
  /* a pair whose coordinate sums have the given parities: px/py = 'odd' (half midpoint) or 'even' (whole) */
  function parityPair(r, px, py, lim) {
    lim = lim || 11;
    return pickWhere(function () { return { P: [r.pick(pm(1, lim)), r.pick(pm(1, lim))], Q: [r.pick(pm(1, lim)), r.pick(pm(1, lim))] }; }, function (z) {
      var sx = z.P[0] + z.Q[0], sy = z.P[1] + z.Q[1];
      return (px === 'odd') === !even(sx) && (py === 'odd') === !even(sy) && z.P[0] !== z.Q[0] && z.P[1] !== z.Q[1] && (z.P[0] < 0 || z.Q[0] < 0 || z.P[1] < 0 || z.Q[1] < 0);
    });
  }
  function halfMid(prompt, P, Q, text, o) { o = o || {}; o.frac = true; return midP(prompt, P, Q, text, o); }
  var HH = ['Add the two coordinates and divide by ' + t('2') + '. If the sum is odd, the answer is a half — keep it exactly (a fraction like ' + t('\\tfrac{-5}{2}') + ' or a decimal like ' + t('-2.5') + ').', HM[0]];
  /* Owen / Priya / Q3 shared data */
  function e3seg(r, bk) {
    if (r.chance(0.2)) return bk;
    return pickWhere(function () { var P = [r.int(-5, 5), r.int(-5, 5)], v = [r.pick([1, 3, 5, 7]) * r.pick([1, -1]), r.pick([1, 3, 5, 7]) * r.pick([1, -1])]; return { P: P, Q: add(P, v) }; },
      function (z) { return Math.abs(z.Q[0]) <= 5 && Math.abs(z.Q[1]) <= 5 && Math.abs(z.Q[0] - z.P[0]) >= 3 && Math.abs(z.Q[1] - z.P[1]) >= 3; });
  }
  function e3parts(L, key) {
    var n1 = L[0], n2 = L[1];
    return [
      { id: 'e3' + key, sub: key, level: 'EMG', make: function (r, sh) {
        var o = sh[key], M = mid(o.P, o.Q), cands = midCands(o.P, o.Q);
        return B.fields('Segment ' + t(n1 + n2) + ': state the coordinates of the two endpoints, then use the formula to determine the midpoint ' + t('M') + '.' + gridFig([o.P, o.Q], [n1, n2], W6),
          [ptField(t(n1), n1), ptField(t(n2), n2), ptField(t('M'), 'M')], [ptCheck(o.P), ptCheck(o.Q), ptCheck(M, { cands: cands, round: true })], [ptKey(o.P), ptKey(o.Q), ptKey(M)],
          t(nm(n1, o.P)) + ', ' + t(nm(n2, o.Q)) + ', ' + t('M' + ptT(M, true)),
          'Read the endpoints: ' + t(nm(n1, o.P)) + ' and ' + t(nm(n2, o.Q)) + '.<br>' + t(mLine(o.P, o.Q, 'M', true)) + '.', HH, 'graphed segment ' + n1 + n2 + ': endpoints and midpoint');
      } },
      { id: 'e3' + key + '2', sub: key + ', mark', level: 'EMG', make: function (r, sh) {
        var o = sh[key], M = mid(o.P, o.Q);
        var inp = { x: W6.x, y: W6.y, grid: 1, labels: 2, snap: 0.5, bg: { segs: [{ pts: [o.P, o.Q], start: 'none', end: 'none' }], points: [{ x: o.P[0], y: o.P[1], label: n1 }, { x: o.Q[0], y: o.Q[1], label: n2 }] }, help: 'Tap to place the midpoint (points snap to half units). Tap it again to remove it.' };
        var p = B.points('Mark the midpoint ' + t('M' + ptT(M, true)) + ' of ' + t('\\overline{' + n1 + n2 + '}') + ' on the grid with a dot. (It does <b>not</b> land on a grid crossing.)', inp, [M],
          t('M' + ptT(M, true)) + ' is halfway between the grid lines: ' + t('x=' + cT(M[0], true)) + ' is halfway between ' + t(Math.floor(M[0])) + ' and ' + t(Math.ceil(M[0])) + ', and ' + t('y=' + cT(M[1], true)) + ' is halfway between ' + t(Math.floor(M[1])) + ' and ' + t(Math.ceil(M[1])) + '.',
          ['A half like ' + t('\\tfrac{1}{2}') + ' sits exactly between two grid lines.', 'Check: the dot should sit right in the middle of the segment.'], 'mark the midpoint ' + n1 + n2,
          { what: 'midpoint', pointHint: function (q) { if (samePt(q, [Math.round(M[0]), Math.round(M[1])]) || (isInt(q[0]) && isInt(q[1]))) return { code: 'u6l4-round-half', hint: 'That dot is on a grid crossing. The midpoint ' + t(ptT(M, true)) + ' sits halfway between grid lines.' }; return null; } });
        return p;
      } }];
  }

  var EXTRA = [
    /* ---- EP 1 ---- */
    { num: '1', section: 'Part A — Midpoints that land between the grid lines', stem: 'Determine the midpoint of the segment with each pair of endpoints. When a sum is odd, the midpoint coordinate is a half: <b>leave it as an exact fraction (or an exact decimal) — do not round.</b>', parts: [
      { id: 'e1a', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { P: [-7, 3], Q: [2, -6] } : parityPair(r, 'odd', 'odd'); return halfMid(pairTex('A', o.P, 'B', o.Q), o.P, o.Q, 'half midpoint (a)', { hints: HH }); } },
      { id: 'e1b', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { P: [-5, -8], Q: [1, 3] } : parityPair(r, 'even', 'odd'); return halfMid(pairTex('C', o.P, 'D', o.Q), o.P, o.Q, 'half midpoint (b)', { hints: HH }); } },
      { id: 'e1c', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { P: [4, -9], Q: [-3, -1] } : parityPair(r, 'odd', 'even'); return halfMid(pairTex('E', o.P, 'F', o.Q), o.P, o.Q, 'half midpoint (c)', { hints: HH }); } }] },
    /* ---- EP 2 ---- */
    { num: '2', stem: 'Determine the midpoint of the segment with each pair of endpoints. (Exactly one of the six coordinates you produce is a whole number.)',
      shared: function (r) {
        var N = [['G', 'H'], ['J', 'K'], ['L', 'M']];
        if (r.chance(0.15)) return { N: N, pr: [{ P: [-11, 6], Q: [-2, -3] }, { P: [-6, 7], Q: [5, 7] }, { P: [-8, -5], Q: [3, -4] }], wi: 1, wc: 1 };
        var wi = r.int(0, 2), wc = r.int(0, 1), pr = [0, 1, 2].map(function (i) { return parityPair(r, i === wi && wc === 0 ? 'even' : 'odd', i === wi && wc === 1 ? 'even' : 'odd'); });
        return { N: N, pr: pr, wi: wi, wc: wc };
      },
      parts: [0, 1, 2].map(function (i) {
        return { id: 'e2' + 'abc'[i], sub: 'abc'[i], level: 'EMG', make: function (r, sh) { var o = sh.pr[i]; return halfMid('(' + 'abc'[i] + ') ' + pairTex(sh.N[i][0], o.P, sh.N[i][1], o.Q), o.P, o.Q, 'half midpoints set (' + 'abc'[i] + ')', { hints: HH }); } };
      }).concat([
        { id: 'e2d', sub: 'd', level: 'EMG', make: function (r, sh) {
          var Ms = sh.pr.map(function (o) { return mid(o.P, o.Q); }), opts = [];
          [0, 1, 2].forEach(function (i) { [0, 1].forEach(function (c) { var v = Ms[i][c], right = i === sh.wi && c === sh.wc; opts.push({ html: 'The ' + t(c ? 'y' : 'x') + '-coordinate in (' + 'abc'[i] + '), ' + t(cT(v, true)), right: right, why: right ? null : t(cT(v, true)) + ' is a half, not a whole number.' }); }); });
          var rightO = opts.filter(function (x) { return x.right; })[0], others = r.sample(opts.filter(function (x) { return !x.right; }), 3);
          return mcPart(r, 'The three segments were ' + [0, 1, 2].map(function (i) { return '(' + 'abc'[i] + ') ' + pairTex(sh.N[i][0], sh.pr[i].P, sh.N[i][1], sh.pr[i].Q); }).join(', &nbsp;') + '. Exactly one of the six midpoint coordinates is a whole number. Which one?', [rightO].concat(others),
            'The midpoints are ' + Ms.map(function (M, i) { return '(' + 'abc'[i] + ') ' + t(ptT(M, true)); }).join(', ') + '. The only whole number is the ' + t(sh.wc ? 'y' : 'x') + '-coordinate in (' + 'abc'[sh.wi] + '), ' + t(nT(Ms[sh.wi][sh.wc])) + '.', HH, 'which coordinate is whole');
        } },
        { id: 'e2e', sub: 'e', level: 'PRG', make: function (r, sh) {
          var o = sh.pr[sh.wi], c = sh.wc, a = o.P[c], b = o.Q[c];
          return mcPart(r, 'In (' + 'abc'[sh.wi] + ') the ' + t(c ? 'y' : 'x') + '-coordinates ' + t(nT(a)) + ' and ' + t(nT(b)) + ' average to a whole number. What has to be true of two whole numbers for their average to come out whole?', [
            { html: 'They are both even or both odd, so their sum is even and halves exactly.', right: true },
            { html: 'One is even and the other is odd.', why: 'Then the sum is odd, e.g. ' + t('3+4=7') + ', and ' + t('\\tfrac{7}{2}=3.5') + ' is a half. Look at ' + t(nT(a)) + ' and ' + t(nT(b)) + '.' },
            { html: 'They must be equal.', why: 'Equal numbers do average to a whole number, but so do ' + t('3') + ' and ' + t('7') + ' (average ' + t('5') + '). What do ' + t('3') + ' and ' + t('7') + ' have in common?' },
            { html: 'They must both be positive.', why: 'Signs don’t matter: ' + t('\\tfrac{-3+7}{2}=2') + ' is whole, but ' + t('\\tfrac{3+4}{2}=3.5') + ' isn’t. It’s about even and odd.' }],
            t(nT(a) + '+' + sgp(b) + '=' + nT(a + b)) + ' is even, so it halves to a whole number. A sum is even exactly when the two numbers are both even or both odd; then their average is whole. One even and one odd gives an odd sum and a half.', ['Try a few pairs: ' + t('3') + ' and ' + t('7') + ', ' + t('4') + ' and ' + t('10') + ', ' + t('3') + ' and ' + t('4') + '. Which averages are whole?'], 'parity reason');
        } }]) },
    /* ---- EP 3 ---- */
    { num: '3', stem: 'For each segment graphed below: state the coordinates of the two endpoints, determine the midpoint using the formula, and mark it on the grid with a dot.',
      shared: function (r) { return { a: e3seg(r, { P: [-5, -3], Q: [2, 4] }), b: e3seg(r, { P: [-4, 5], Q: [3, -2] }) }; },
      parts: e3parts(['A', 'B'], 'a').concat(e3parts(['C', 'D'], 'b')) },
    /* ---- EP 4: Owen ---- */
    { num: '4', shared: function (r) { if (r.chance(0.2)) return { A: [-6, 5], B: [2, -3] }; var o = signedPair(r, [-1, 1, 1, -1], 1, 10); return { A: o.P, B: o.Q }; },
      stem: function (o) { var h = scl(sub(o.B, o.A), 0.5); return '<b>Error analysis.</b> Asked for the midpoint of ' + t(nm('A', o.A)) + ' and ' + t(nm('B', o.B)) + ', Owen wrote \\[M=\\left(\\frac{' + nT(o.B[0]) + '-' + sgp(o.A[0]) + '}{2},\\ \\frac{' + nT(o.B[1]) + '-' + sgp(o.A[1]) + '}{2}\\right)=' + ptT(h) + '.\\]'; },
      parts: [
        { id: 'e4a', sub: 'a', level: 'EMG', make: function (r, o) {
          return mcPart(r, 'What did Owen confuse the midpoint formula with?', [
            { html: 'He <b>subtracted</b> the coordinates, as in the distance formula. The midpoint formula <b>adds</b> them, then divides by ' + t('2') + '.', right: true },
            { html: 'He forgot to divide by ' + t('2') + '.', why: 'He did divide by ' + t('2') + '. Look at the sign between the coordinates on top.' },
            { html: 'He put the ' + t('x') + '- and ' + t('y') + '-coordinates in the wrong order.', why: 'His ' + t('x') + '’s and ' + t('y') + '’s are in the right places. The problem is the operation: he subtracted.' },
            { html: 'He used the wrong endpoints.', why: 'He used ' + t('A') + ' and ' + t('B') + '. The problem is that he subtracted their coordinates.' }],
            'Owen subtracted the coordinates — that is how the <b>distance</b> formula starts ' + t('(x_2-x_1,\\ y_2-y_1)') + '. The midpoint formula <b>adds</b> the coordinates and halves: ' + t('\\left(\\tfrac{x_1+x_2}{2},\\ \\tfrac{y_1+y_2}{2}\\right)') + '.', ['Compare Owen’s working with ' + t('M\\left(\\tfrac{x_1+x_2}{2},\\ \\tfrac{y_1+y_2}{2}\\right)') + '.'], 'Owen’s confusion');
        } },
        { id: 'e4b', sub: 'b', level: 'PRG', make: function (r, o) {
          var h = scl(sub(o.B, o.A), 0.5), M = mid(o.A, o.B);
          return mcPart(r, 'What do Owen’s numbers ' + t(nT(h[0])) + ' and ' + t(nT(h[1])) + ' actually represent?', [
            { html: 'Half the run and half the rise: the <b>step</b> from ' + t('A') + ' to the midpoint (' + t(nT(h[0])) + ' across, ' + t(nT(h[1])) + ' up/down), not a location.', right: true },
            { html: 'The coordinates of the midpoint.', why: 'The midpoint is ' + t(ptT(M)) + '. Owen’s numbers tell you how far to <b>move</b> from ' + t('A') + ' to get there.' },
            { html: 'The length of ' + t('\\overline{AB}') + '.', why: 'A length is one positive number from the distance formula. Owen’s two numbers are half of each coordinate change.' },
            { html: 'The other endpoint of the segment.', why: 'The endpoints are ' + t('A') + ' and ' + t('B') + '. Owen’s numbers are half of the change from ' + t('A') + ' to ' + t('B') + '.' }],
            t(nT(o.B[0]) + '-' + sgp(o.A[0]) + '=' + nT(o.B[0] - o.A[0])) + ' is the run and ' + t(nT(o.B[1]) + '-' + sgp(o.A[1]) + '=' + nT(o.B[1] - o.A[1])) + ' is the rise; halving gives ' + t(nT(h[0])) + ' and ' + t(nT(h[1])) + ' — the step from ' + t('A') + ' to the midpoint. Check: ' + t(ptT(o.A) + '+' + ptT(h) + '=' + ptT(M)) + ', the real midpoint.', ['What does ' + t('x_2-x_1') + ' measure on a grid?'], 'what Owen’s numbers mean');
        } },
        { id: 'e4c', sub: 'c', level: 'EMG', make: function (r, o) {
          var h = scl(sub(o.B, o.A), 0.5);
          return midP('Give the correct midpoint of ' + t('\\overline{AB}') + '.', o.A, o.B, 'correct midpoint (Owen)', { cands: [[h, 'mid-subtract', 'That is Owen’s answer. Add the coordinates instead of subtracting.']], before: 'M =' });
        } }] },
    /* ---- EP 5 ---- */
    { num: '5', section: 'Part B — Running the formula backwards', stem: 'Each question gives one endpoint ' + t('A') + ' and the midpoint ' + t('M') + '. Determine the <b>other</b> endpoint ' + t('B') + '. (Algebra: ' + t('x_B=2x_M-x_A') + ', and likewise for ' + t('y') + '. Counting: whatever step takes you from ' + t('A') + ' to ' + t('M') + ', take the same step again.)', parts: [
      { id: 'e5a', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { A: [-3, 2], M: [1, -1] } : pickWhere(function () { return { A: [-r.int(1, 8), r.int(1, 8)], M: [r.int(1, 6), -r.int(1, 6)] }; }, function () { return true; }); return endPart(o.A, o.M, 'B', 'endpoint from A and M (a)'); } },
      { id: 'e5b', level: 'EMG', make: function (r) { var o = r.chance(0.15) ? { A: [4, -7], M: [-2, -1] } : pickWhere(function () { return { A: [r.int(1, 8), -r.int(2, 9)], M: [-r.int(1, 6), -r.int(1, 4)] }; }, function (z) { return z.M[1] !== z.A[1]; }); return endPart(o.A, o.M, 'B', 'endpoint from A and M (b)'); } }] },
    /* ---- EP 6 ---- */
    { num: '6', stem: 'Determine the other endpoint. The midpoints here are half-integers.', parts: [
      { id: 'e6a', level: 'PRG', make: function (r) { var o = r.chance(0.15) ? { A: [-5, -4], M: [-0.5, 3] } : pickWhere(function () { return { A: [-r.int(1, 8), -r.int(1, 8)], M: [r.pick(pm(0, 4)) + 0.5, r.int(1, 6)] }; }, function () { return true; }); return endPart(o.A, o.M, 'B', 'endpoint with a half midpoint (a)', true, 'A'); } },
      { id: 'e6b', level: 'PRG', make: function (r) { var o = r.chance(0.15) ? { A: [6, -3], M: [1.5, -5.5] } : pickWhere(function () { return { A: [r.int(1, 8), -r.int(1, 8)], M: [r.pick(pm(0, 3)) + 0.5, -r.int(1, 7) - 0.5] }; }, function () { return true; }); return endPart(o.A, o.M, '', 'endpoint with half midpoints (b)', true, 'P'); } }] },
    /* ---- EP 7 ---- */
    { num: '7', shared: function (r) {
        if (r.chance(0.2)) return { A: [-3, 4], M: [2, -1] };
        return pickWhere(function () { return { A: [-r.int(1, 7), r.int(1, 7)], M: [r.int(0, 5), -r.int(0, 5)] }; }, function (z) { var Bp = sub(scl(z.M, 2), z.A), n = d2(z.A, Bp); return !isSq(n) && radParts(n).k >= 2; });
      },
      stem: function (o) { return 'The midpoint of ' + t('\\overline{AB}') + ' is ' + t(ptT(o.M)) + ' and ' + t('A') + ' is ' + t(ptT(o.A)) + '.'; },
      parts: [
        { id: 'e7a', sub: 'a', level: 'EMG', make: function (r, o) { return endPart(o.A, o.M, 'B', 'find B (then verify)', false, 'A', 'Determine the coordinates of ' + t('B') + '.'); } },
        { id: 'e7b', sub: 'b', level: 'EMG', make: function (r, o) {
          var Bp = sub(scl(o.M, 2), o.A), q = mid(o.A, o.M);
          return mcPart(r, 'You found ' + t(nm('B', Bp)) + '. Which calculation <b>verifies</b> this answer?', [
            { html: t('\\left(\\dfrac{' + nT(o.A[0]) + '+' + sgp(Bp[0]) + '}{2},\\ \\dfrac{' + nT(o.A[1]) + '+' + sgp(Bp[1]) + '}{2}\\right)=' + ptT(o.M)) + ' — the midpoint of ' + t('A') + ' and ' + t('B') + ' is the given ' + t('M') + '.', right: true },
            { html: t('\\left(\\dfrac{' + nT(o.A[0]) + '+' + sgp(o.M[0]) + '}{2},\\ \\dfrac{' + nT(o.A[1]) + '+' + sgp(o.M[1]) + '}{2}\\right)=' + ptT(q)), why: 'That averages ' + t('A') + ' and ' + t('M') + '. To verify ' + t('B') + ', put both <b>endpoints</b> ' + t('A') + ' and ' + t('B') + ' into the midpoint formula and see if you get ' + t('M') + '.' },
            { html: t('\\left(' + nT(Bp[0]) + '-' + sgp(o.A[0]) + ',\\ ' + nT(Bp[1]) + '-' + sgp(o.A[1]) + '\\right)=' + ptT(sub(Bp, o.A))), why: 'That is the change from ' + t('A') + ' to ' + t('B') + ', not a check of the midpoint. Average ' + t('A') + ' and ' + t('B') + '.' },
            { html: t('2' + ptT(o.M) + '=' + ptT(scl(o.M, 2))), why: 'Doubling the midpoint is only the first step of finding ' + t('B') + '; it doesn’t check anything. Average ' + t('A') + ' and ' + t('B') + '.' }],
            'Substitute ' + t('A') + ' and ' + t('B') + ' into the midpoint formula: ' + t(mLine(o.A, Bp)) + ' ' + t('=M') + ' ✓', ['If ' + t('B') + ' is right, what is the midpoint of ' + t('A') + ' and ' + t('B') + '?'], 'verify B');
        } },
        { id: 'e7c', sub: 'c', level: 'PRG', make: function (r, o) {
          var Bp = sub(scl(o.M, 2), o.A), n = d2(o.A, Bp), cands = dCands(o.A, Bp).concat([[dist(o.A, o.M), 'd-half', 'That is ' + t('AM') + ', only half of the segment. Use the endpoints ' + t('A') + ' and ' + t('B') + '.']]);
          return B.fields('Determine the exact length of ' + t('AB') + ', as a mixed radical in simplest form, and then to the nearest tenth.', [lenField('AB', 'units'), decField('AB', 'units')],
            [lenCheck(n, 1, { cands: cands }), decCheck(n, 1, { cands: cands })], [lenKey(n), fx(Math.sqrt(n), 1)], t('AB=' + lenTex(n) + '\\approx ' + fx(Math.sqrt(n), 1)) + ' units',
            dSteps(o.A, Bp) + '<br>' + t(dLine(o.A, Bp, 'AB') + simpTail(n) + '\\approx ' + fx(Math.sqrt(n), 1)) + ' units.', [HD[0], 'To simplify ' + t('\\sqrt{' + n + '}') + ', look for its largest perfect-square factor; round only at the end.'], 'length AB exact and decimal');
        } }] },
    /* ---- EP 8: rectangle ---- */
    { num: '8', shared: function (r) {
        if (r.chance(0.2)) return { x1: -4, x2: 5, y1: -3, y2: 3 };
        return pickWhere(function () { var x1 = -r.int(1, 6), y1 = -r.int(1, 5); return { x1: x1, x2: x1 + r.int(4, 10), y1: y1, y2: y1 + r.int(3, 8) }; },
          function (z) { var n = sq(z.x2 - z.x1) + sq(z.y2 - z.y1); return !isSq(n) && z.x2 <= 7 && z.y2 <= 7 && z.x2 > 0 && z.y2 > 0 && z.x2 - z.x1 !== z.y2 - z.y1 && (!even(z.x1 + z.x2) || !even(z.y1 + z.y2)); });
      },
      stem: function (o) { var P = rectPts(o); return '<b>The centre of a rectangle.</b> A rectangle has vertices ' + t(nm('A', P.A)) + ', ' + t(nm('B', P.B)) + ', ' + t(nm('C', P.C)) + ', and ' + t(nm('D', P.D)) + '. A diagonal of a rectangle passes through its centre, so the midpoint of <i>either</i> diagonal should be the same point.' + figPoly([P.A, P.B, P.C, P.D], ['A', 'B', 'C', 'D'], { closed: true, dash: [[P.A, P.C], [P.B, P.D]], max: 300 }); },
      parts: [
        { id: 'e8a', sub: 'a', level: 'EMG', make: function (r, o) { var P = rectPts(o); return halfMid('Determine the midpoint of diagonal ' + t('\\overline{AC}') + '.', P.A, P.C, 'rectangle diagonal AC midpoint', { hints: HH, before: 'M =', cands: [[mid(P.A, P.B), 'mid-wrong-seg', 'That is the midpoint of side ' + t('\\overline{AB}') + '. A diagonal joins opposite corners: ' + t('A') + ' and ' + t('C') + '.'], [mid(P.A, P.D), 'mid-wrong-seg', 'That is the midpoint of side ' + t('\\overline{AD}') + '. The diagonal joins ' + t('A') + ' and ' + t('C') + '.']] }); } },
        { id: 'e8b', sub: 'b', level: 'EMG', make: function (r, o) { var P = rectPts(o); return halfMid('Determine the midpoint of diagonal ' + t('\\overline{BD}') + '.', P.B, P.D, 'rectangle diagonal BD midpoint', { hints: HH, before: 'M =', cands: [[mid(P.B, P.C), 'mid-wrong-seg', 'That is the midpoint of side ' + t('\\overline{BC}') + '. The diagonal joins ' + t('B') + ' and ' + t('D') + '.']] }); } },
        { id: 'e8b2', sub: 'b, compare', level: 'EMG', make: function (r, o) {
          var P = rectPts(o), M = mid(P.A, P.C);
          return mcPart(r, 'Both diagonals have the midpoint ' + t(ptT(M, true)) + '. What does that tell you?', [
            { html: 'The two diagonals cross at their midpoints: that shared point is the centre of the rectangle, and each diagonal cuts the other in half.', right: true },
            { html: 'The two diagonals are perpendicular.', why: 'A shared midpoint tells you <b>where</b> the diagonals cross, not the angle between them (a rectangle’s diagonals usually aren’t perpendicular).' },
            { html: 'The rectangle is a square.', why: 'Every rectangle’s diagonals share a midpoint; that doesn’t make the sides equal.' },
            { html: 'Nothing — it is a coincidence.', why: 'It’s no coincidence: the centre of a rectangle is halfway along both diagonals.' }],
            'The diagonals ' + t('\\overline{AC}') + ' and ' + t('\\overline{BD}') + ' have the same midpoint ' + t(ptT(M, true)) + ', so they pass through the same centre point and cut each other in half there.', ['Where do the two diagonals cross?'], 'shared midpoint = centre');
        } },
        { id: 'e8c', sub: 'c', level: 'PRG', make: function (r, o) {
          var P = rectPts(o), n = d2(P.A, P.C), c1 = dCands(P.A, P.C), c2 = dCands(P.B, P.D);
          return B.fields('Determine the exact length of each diagonal.', [lenField('AC'), lenField('BD')], [lenCheck(n, 1, { cands: c1 }), lenCheck(n, 1, { cands: c2 })], [lenKey(n), lenKey(n)],
            t('AC=BD=' + lenTex(n)) + ' units', t(dLine(P.A, P.C, 'AC') + simpTail(n)) + '<br>' + t(dLine(P.B, P.D, 'BD') + simpTail(n)), HD, 'rectangle diagonal lengths');
        } },
        { id: 'e8c2', sub: 'c, why', level: 'EMG', make: function (r, o) {
          var P = rectPts(o), n = d2(P.A, P.C);
          return mcPart(r, 'Both diagonals have length ' + t(lenTex(n)) + '. Are they equal, and should they be?', [
            { html: 'Yes, they are equal — and they should be: the diagonals of a rectangle are always the same length.', right: true },
            { html: 'They are equal only because the rectangle happens to be placed on a grid.', why: 'The diagonals of <b>every</b> rectangle are equal, wherever it is drawn.' },
            { html: 'They are equal, but they shouldn’t be — one diagonal is always longer.', why: 'In a rectangle each diagonal is the hypotenuse of a right triangle with the same two legs (the length and the width), so they are equal.' },
            { html: 'They are not equal.', why: 'Check: both are ' + t(lenTex(n)) + '.' }],
            'Each diagonal is the hypotenuse of a right triangle with legs ' + t(F(o.x2 - o.x1)) + ' and ' + t(F(o.y2 - o.y1)) + ', so both are ' + t('\\sqrt{' + sq(o.x2 - o.x1) + '+' + sq(o.y2 - o.y1) + '}=' + lenTex(n)) + '. The diagonals of a rectangle are always equal.', ['What are the legs of the right triangle for each diagonal?'], 'rectangle diagonals equal');
        } }] },
    /* ---- EP 9: stretch, parallelogram or rhombus ---- */
    { num: '9', shared: function (r) {
        if (r.chance(0.2)) return { A: [-5, -3], u: [4, 5], w: [5, 1] };
        var RH = [[[3, 4], [5, 0]], [[4, 3], [0, 5]], [[3, 4], [4, 3]], [[1, 2], [2, 1]], [[1, 3], [3, 1]], [[2, 1], [1, 2]], [[4, 3], [5, 0]]];
        return pickWhere(function () {
          var rh = r.chance(0.3), u, w;
          if (rh) { var p = r.pick(RH); u = p[0].slice(); w = p[1].slice(); }
          else { u = [r.int(1, 5), r.int(2, 6)]; w = [r.int(3, 6), r.int(-2, 2)]; }
          return { A: [r.int(-6, -3), r.int(-5, -2)], u: u, w: w };
        }, function (z) { var C = add(add(z.A, z.u), z.w), D = add(z.A, z.w), dot = z.u[0] * z.w[0] + z.u[1] * z.w[1]; return dot !== 0 && [C, D].every(function (p) { return Math.abs(p[0]) <= 8 && Math.abs(p[1]) <= 8; }) && z.u[0] * z.w[1] - z.u[1] * z.w[0] !== 0; });
      },
      stem: function (o) { var Q = paraPts(o); return '<b>Stretch.</b> A quadrilateral has vertices ' + t(nm('A', Q.A)) + ', ' + t(nm('B', Q.B)) + ', ' + t(nm('C', Q.C)) + ', and ' + t(nm('D', Q.D)) + ', listed in order, so its diagonals are ' + t('\\overline{AC}') + ' and ' + t('\\overline{BD}') + '.'; },
      parts: [
        { id: 'e9a', sub: 'a', level: 'EMG', make: function (r, o) {
          var Q = paraPts(o), m1 = mid(Q.A, Q.C), m2 = mid(Q.B, Q.D);
          return B.fields('Determine the midpoint of each diagonal.', [ptField(t('\\overline{AC}'), 'AC'), ptField(t('\\overline{BD}'), 'BD')], [ptCheck(m1, { cands: midCands(Q.A, Q.C), round: true }), ptCheck(m2, { cands: midCands(Q.B, Q.D), round: true })], [ptKey(m1), ptKey(m2)],
            t('\\overline{AC}') + ': ' + t(ptT(m1, true)) + ', ' + t('\\overline{BD}') + ': ' + t(ptT(m2, true)), t(mLine(Q.A, Q.C, null, true)) + '<br>' + t(mLine(Q.B, Q.D, null, true)), HH, 'diagonal midpoints');
        } },
        { id: 'e9b', sub: 'b', level: 'EMG', make: function (r, o) {
          var Q = paraPts(o), m1 = mid(Q.A, Q.C);
          return mcPart(r, 'Both diagonals have the midpoint ' + t(ptT(m1, true)) + '. What does this show?', [
            { html: 'The diagonals <b>bisect each other</b>: each one cuts the other exactly in half.', right: true },
            { html: 'The diagonals are equal in length.', why: 'Midpoints tell you where the diagonals cross, not how long they are.' },
            { html: 'The diagonals are perpendicular.', why: 'Midpoints say nothing about the angle between the diagonals.' },
            { html: 'The quadrilateral is a rectangle.', why: 'That would need equal diagonals (or right angles) — a shared midpoint alone doesn’t show it.' }],
            'The two diagonals have the same midpoint, so they cross at the halfway point of each: the diagonals bisect each other.', ['What does it mean when two segments share a midpoint?'], 'diagonals bisect each other');
        } },
        { id: 'e9c', sub: 'c', level: 'ADV', make: function (r, o) {
          var Q = paraPts(o), S = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']], n = S.map(function (s) { return d2(Q[s[0]], Q[s[1]]); });
          return B.fields('Find all four side lengths (exact values).', S.map(function (s) { return lenField(s[0] + s[1]); }), S.map(function (s, i) { return lenCheck(n[i], 1, { cands: dCands(Q[s[0]], Q[s[1]]) }); }), n.map(function (x) { return lenKey(x); }),
            S.map(function (s, i) { return t(s[0] + s[1] + '=' + lenTex(n[i])); }).join(', '), S.map(function (s, i) { return t(dLine(Q[s[0]], Q[s[1]], s[0] + s[1]) + simpTail(n[i])); }).join('<br>'), HD, 'four side lengths');
        } },
        { id: 'e9d', sub: 'd', level: 'PRG', make: function (r, o) {
          var Q = paraPts(o), a = d2(Q.A, Q.B), b = d2(Q.B, Q.C), rh = a === b;
          return mcPart(r, 'The sides are ' + t('AB=CD=' + lenTex(a)) + ' and ' + t('BC=DA=' + lenTex(b)) + ', and the diagonals bisect each other. What kind of quadrilateral is ' + t('ABCD') + '?', [
            { html: 'A parallelogram that is not a rhombus: opposite sides are equal, but neighbouring sides are not.', right: !rh, why: rh ? 'Look again: all four sides are ' + t(lenTex(a)) + '.' : null },
            { html: 'A rhombus: all four sides are equal.', right: rh, why: rh ? null : t(lenTex(a) + '\\ne ' + lenTex(b)) + ', so the four sides are not all equal.' },
            { html: 'A rectangle: the diagonals bisect each other.', why: 'Every parallelogram’s diagonals bisect each other. A rectangle also needs equal diagonals (right angles).' },
            { html: 'A trapezoid: only one pair of sides is equal.', why: 'Both pairs of opposite sides are equal here, and the diagonals bisect each other — that is a parallelogram.' }],
            'The diagonals bisect each other and opposite sides are equal, so ' + t('ABCD') + ' is a parallelogram. ' + (rh ? 'All four sides are ' + t(lenTex(a)) + ', so it is a <b>rhombus</b>.' : 'Neighbouring sides differ (' + t(lenTex(a) + '\\ne ' + lenTex(b)) + '), so it is <b>not</b> a rhombus — just a parallelogram.'), ['Compare all four sides.'], 'classify ABCD');
        } }] },
    /* ---- EP 10–11: midpoint and distance together ---- */
    { num: '10', shared: function (r) {
        if (r.chance(0.2)) return { A: [-6, -2], h: [4, 3] };
        var T = r.pick([[3, 4], [4, 3], [4, -3], [3, -4]]); return { A: [r.int(-7, -3), T[1] > 0 ? r.int(-6, -2) : r.int(2, 6)], h: T };
      },
      stem: function (o) { var Bp = add(o.A, scl(o.h, 2)); return '<b>Midpoint and distance together.</b> ' + t(nm('A', o.A)) + ' and ' + t(nm('B', Bp)) + '. If ' + t('M') + ' really is the midpoint of ' + t('\\overline{AB}') + ', then ' + t('AM') + ' must be exactly half of ' + t('AB') + '.'; },
      parts: [
        { id: 'e10a', sub: 'a', level: 'BEG', make: function (r, o) { var Bp = add(o.A, scl(o.h, 2)); return midP('Find ' + t('M') + '.', o.A, Bp, 'M for the halving check', { before: 'M =' }); } },
        { id: 'e10b', sub: 'b', level: 'EMG', make: function (r, o) {
          var Bp = add(o.A, scl(o.h, 2)), M = mid(o.A, Bp), D = dist(o.A, M);
          return B.fields('Find ' + t('AM') + ' and ' + t('MB') + '.', [lenField('AM'), lenField('MB')], [lenCheck(d2(o.A, M), 1, { cands: dCands(o.A, M) }), lenCheck(d2(M, Bp), 1, { cands: dCands(M, Bp) })], [String(D), String(D)], t('AM=MB=' + D),
            t(dLine(o.A, M, 'AM') + simpTail(d2(o.A, M))) + '<br>' + t(dLine(M, Bp, 'MB') + simpTail(d2(M, Bp))), HD, 'AM and MB');
        } },
        { id: 'e10c', sub: 'c', level: 'EMG', make: function (r, o) {
          var Bp = add(o.A, scl(o.h, 2)), D = dist(o.A, Bp);
          return B.number('Find ' + t('AB') + '. (Then confirm the halving check: ' + t('AB=2\\,AM') + '.)', D, matchDiag(dCands(o.A, Bp).concat([[D / 2, 'd-half', 'That is ' + t('AM') + '. Use the two endpoints ' + t('A') + ' and ' + t('B') + '.']])),
            t(dLine(o.A, Bp, 'AB') + simpTail(d2(o.A, Bp))) + ' units, and ' + t('2\\times ' + (D / 2) + '=' + D) + ' ✓ — so ' + t('AB=2\\,AM') + '.', HD, 'AB and the halving check', { after: 'units' });
        } }] },
    { num: '11', shared: function (r) {
        if (r.chance(0.2)) return { A: [-5, 3], h: [4, -4] };
        return pickWhere(function () { return { A: [r.int(-7, -2), r.int(-6, 6)], h: [r.int(1, 5), r.pick(pm(1, 5))] }; }, function (z) { var n = sq(z.h[0]) + sq(z.h[1]), Bp = add(z.A, scl(z.h, 2)); return !isSq(n) && radParts(n).k >= 2 && Math.abs(Bp[0]) <= 10 && Math.abs(Bp[1]) <= 10; });
      },
      stem: function (o) { return t(nm('A', o.A)) + ' and ' + t(nm('B', add(o.A, scl(o.h, 2)))) + '.'; },
      parts: [
        { id: 'e11a', sub: 'a', level: 'BEG', make: function (r, o) { var Bp = add(o.A, scl(o.h, 2)); return midP('Find ' + t('M') + '.', o.A, Bp, 'M (mixed radical check)', { before: 'M =' }); } },
        { id: 'e11b', sub: 'b', level: 'PRG', make: function (r, o) {
          var Bp = add(o.A, scl(o.h, 2)), M = mid(o.A, Bp), n = d2(o.A, M);
          return B.radical('Find the exact value of ' + t('AM') + ' as a mixed radical.', { k: [radParts(n).k, 1], n: 2, m: radParts(n).m }, 'mixed', t(dLine(o.A, M, 'AM') + simpTail(n)) + '.', HD, 'AM as a mixed radical', { diag: matchDiag(dCands(o.A, M)), before: 'AM =' });
        } },
        { id: 'e11c', sub: 'c', level: 'PRG', make: function (r, o) {
          var Bp = add(o.A, scl(o.h, 2)), n = d2(o.A, Bp), nh = d2(o.A, mid(o.A, Bp));
          return B.radical('Find the exact value of ' + t('AB') + ' and confirm ' + t('AB=2\\,AM') + '.', { k: [radParts(n).k, 1], n: 2, m: radParts(n).m }, 'mixed', t(dLine(o.A, Bp, 'AB') + simpTail(n)) + ', and ' + t('2\\times ' + lenTex(nh) + '=' + lenTex(n)) + ' ✓', HD, 'AB as a mixed radical', { diag: matchDiag(dCands(o.A, Bp).concat([[Math.sqrt(nh), 'd-half', 'That is ' + t('AM') + '. Use the endpoints ' + t('A') + ' and ' + t('B') + '.']])), before: 'AB =' });
        } }] },
    /* ---- EP 12: quarter points ---- */
    { num: '12', section: 'Part C — Quarter points, context, and reasoning', shared: function (r) {
        if (r.chance(0.2)) return { A: [-7, -3], v: [3, 3] };
        return pickWhere(function () { return { A: [r.int(-8, -3), r.int(-6, 4)], v: [r.int(1, 4), r.pick(pm(1, 4))] }; }, function (z) { var Bp = add(z.A, scl(z.v, 4)); return Math.abs(Bp[0]) <= 12 && Math.abs(Bp[1]) <= 12 && !isSq(sq(z.v[0]) + sq(z.v[1])); });
      },
      stem: function (o) { return '<b>Stretch — one quarter of the way.</b> The midpoint formula only ever cuts a segment in half, but halving twice gives a quarter. Let ' + t(nm('A', o.A)) + ' and ' + t(nm('B', add(o.A, scl(o.v, 4)))) + '.'; },
      parts: [
        { id: 'e12a', sub: 'a', level: 'BEG', make: function (r, o) { var Bp = add(o.A, scl(o.v, 4)); return midP('Find ' + t('M') + ', the midpoint of ' + t('\\overline{AB}') + '.', o.A, Bp, 'M of AB (quarters)', { before: 'M =' }); } },
        { id: 'e12b', sub: 'b', level: 'EMG', make: function (r, o) {
          var Bp = add(o.A, scl(o.v, 4)), M = mid(o.A, Bp), Q1 = mid(o.A, M);
          return midP('Find the midpoint of ' + t('A') + ' and ' + t('M') + '. This is the point one quarter of the way from ' + t('A') + ' to ' + t('B') + '.', o.A, M, 'quarter point', { cands: [[mid(M, Bp), 'u6l4-quarter-wrong', 'That is the midpoint of ' + t('M') + ' and ' + t('B') + ' (three quarters of the way). Average ' + t('A') + ' and ' + t('M') + '.'], [M, 'u6l4-quarter-wrong', 'That is ' + t('M') + ' itself. Now find the midpoint of ' + t('A') + ' and ' + t('M') + '.']], pre: 'Use ' + t(nm('M', M)) + ' from (a): ' });
        } },
        { id: 'e12c', sub: 'c', level: 'EMG', make: function (r, o) {
          var Bp = add(o.A, scl(o.v, 4)), M = mid(o.A, Bp);
          return midP('Find the midpoint of ' + t('M') + ' and ' + t('B') + ' — the point three quarters of the way from ' + t('A') + ' to ' + t('B') + '.', M, Bp, 'three-quarter point', { cands: [[mid(o.A, M), 'u6l4-quarter-wrong', 'That is the midpoint of ' + t('A') + ' and ' + t('M') + ' (one quarter of the way). Average ' + t('M') + ' and ' + t('B') + '.']], pre: 'Use ' + t(nm('M', M)) + ' from (a): ' });
        } },
        { id: 'e12d', sub: 'd', level: 'PRG', make: function (r, o) {
          var Bp = add(o.A, scl(o.v, 4)), Q1 = mid(o.A, mid(o.A, Bp)), n = d2(o.A, Bp), nq = d2(o.A, Q1);
          return B.fields('Find ' + t('AB') + ' and the distance from ' + t('A') + ' to your answer in (b), ' + t(ptT(Q1)) + ' (exact values, or to the nearest tenth). Is the second exactly one quarter of the first?', [lenField('AB'), lenField('AQ')],
            [lenCheck(n, 1, { dec: true, cands: dCands(o.A, Bp) }), lenCheck(nq, 1, { dec: true, cands: dCands(o.A, Q1).concat([[Math.sqrt(n) / 2, 'd-half', 'That is half of ' + t('AB') + ' (the distance to ' + t('M') + '). ' + t('Q') + ' is only a quarter of the way.']]) })], [lenKey(n), lenKey(nq)],
            t('AB=' + lenTex(n) + '\\approx ' + fx(Math.sqrt(n), 1)) + ', ' + t('AQ=' + lenTex(nq) + '\\approx ' + fx(Math.sqrt(nq), 1)) + '; yes, ' + t('4\\times ' + lenTex(nq) + '=' + lenTex(n)) + '.',
            'Call the quarter point ' + t('Q' + ptT(Q1)) + '.<br>' + t(dLine(o.A, Bp, 'AB') + simpTail(n)) + '<br>' + t(dLine(o.A, Q1, 'AQ') + simpTail(nq)) + '<br>' + t('4\\times ' + lenTex(nq) + '=' + lenTex(n)) + ', so ' + t('AQ') + ' is exactly one quarter of ' + t('AB') + '.', HD, 'AB and A to the quarter point');
        } }] },
    /* ---- EP 13: four equal parts (Mastery) ---- */
    { num: '13', shared: function (r) {
        if (r.chance(0.2)) return { A: [-8, -6], v: [4, 4] };
        return pickWhere(function () { return { A: [r.int(-9, -4), r.pick(pm(2, 8))], v: [r.int(2, 5), r.pick(pm(1, 5))] }; }, function (z) { var Bp = add(z.A, scl(z.v, 4)); return Math.abs(Bp[0]) <= 12 && Math.abs(Bp[1]) <= 12 && !isSq(sq(z.v[0]) + sq(z.v[1])); });
      },
      stem: function (o) { return '<b>Stretch.</b> ' + t(nm('A', o.A)) + ' and ' + t(nm('B', add(o.A, scl(o.v, 4)))) + '.'; },
      parts: [
        { id: 'e13a', sub: 'a', level: 'MAS', make: function (r, o) {
          var Bp = add(o.A, scl(o.v, 4)), M = mid(o.A, Bp), Q1 = mid(o.A, M), Q3 = mid(M, Bp), W = [Q1, M, Q3];
          var chk = function (i) { var others = W.filter(function (_, j) { return j !== i; }); return function (resp) { var L = readPts(resp); if (!L.empty && !L.bad && !L.single && L.pts.length === 1 && others.some(function (q) { return samePt([L.pts[0].x, L.pts[0].y], q); })) return wrong('u6l4-not-ordered', 'That is one of the three points, but not the ' + ['first', 'second', 'third'][i] + ' one from ' + t('A') + '. List them in order from ' + t('A') + ' to ' + t('B') + '.'); return ptCheck(W[i], { cands: i === 1 ? midCands(o.A, Bp) : [] })(resp); }; };
          return B.fields('Use repeated halving to find the three points that divide ' + t('\\overline{AB}') + ' into <b>four equal parts</b>. List them in order from ' + t('A') + ' to ' + t('B') + '.', [ptField('1st point', 'P1'), ptField('2nd point', 'P2'), ptField('3rd point', 'P3')], [chk(0), chk(1), chk(2)], W.map(ptKey),
            W.map(function (q) { return t(ptT(q)); }).join(', '), 'Halve once: ' + t(mLine(o.A, Bp, 'M')) + ' — the middle point.<br>Halve each half: ' + t(mLine(o.A, M)) + ' and ' + t(mLine(M, Bp)) + '.<br>In order from ' + t('A') + ': ' + W.map(function (q) { return t(ptT(q)); }).join(', ') + '.',
            ['The midpoint of ' + t('\\overline{AB}') + ' is the middle one of the three points.', 'Then find the midpoint of each half: ' + t('A') + ' to ' + t('M') + ', and ' + t('M') + ' to ' + t('B') + '.'], 'four equal parts');
        } },
        { id: 'e13b', sub: 'b', level: 'ADV', make: function (r, o) {
          var Bp = add(o.A, scl(o.v, 4)), M = mid(o.A, Bp), Q1 = mid(o.A, M), n = d2(o.A, Q1);
          return B.fields('Verify: find the distance from ' + t('A') + ' to the first point ' + t(ptT(Q1)) + ', and from the first point to the second point ' + t(ptT(M)) + ' (exact values).', [lenField('d_1'), lenField('d_2')], [lenCheck(n, 1, { cands: dCands(o.A, Q1) }), lenCheck(n, 1, { cands: dCands(Q1, M) })], [lenKey(n), lenKey(n)],
            t('d_1=d_2=' + lenTex(n)) + ' — the same distance.', t(dLine(o.A, Q1, 'd_1') + simpTail(n)) + '<br>' + t(dLine(Q1, M, 'd_2') + simpTail(n)) + '<br>They are equal ✓ (and ' + t('AB=4\\times ' + lenTex(n) + '=' + lenTex(16 * n)) + ').', HD, 'equal parts check');
        } }] },
    /* ---- EP 14: Priya ---- */
    { num: '14', shared: function (r) { if (r.chance(0.2)) return { A: [-4, 1], M: [2, 5] }; return pickWhere(function () { return { A: [-r.int(1, 8), r.pick(pm(1, 6))], M: [r.int(0, 6), r.pick(pm(1, 7))] }; }, function (z) { return even(z.A[0] + z.M[0]) && even(z.A[1] + z.M[1]) && z.A[1] !== z.M[1]; }); },
      stem: function (o) { return '<b>Error analysis.</b> One endpoint of a segment is ' + t(nm('A', o.A)) + ' and the midpoint is ' + t(nm('M', o.M)) + '. Asked for the other endpoint, Priya averaged ' + t('A') + ' and ' + t('M') + ' and answered ' + t(ptT(mid(o.A, o.M))) + '.'; },
      parts: [
        { id: 'e14a', sub: 'a', level: 'PRG', make: function (r, o) {
          var q = mid(o.A, o.M);
          return mcPart(r, 'Why is averaging the wrong move, and what is Priya’s point ' + t(ptT(q)) + ' actually?', [
            { html: 'Averaging ' + t('A') + ' and ' + t('M') + ' finds the point halfway between <i>them</i> — one quarter of the way from ' + t('A') + ' to ' + t('B') + '. The other endpoint lies <b>beyond</b> ' + t('M') + ', so go backwards: double ' + t('M') + ' and subtract ' + t('A') + '.', right: true },
            { html: 'Averaging is right, but she should have averaged ' + t('M') + ' with the origin.', why: 'The origin has nothing to do with this segment. The missing endpoint is past ' + t('M') + ': ' + t('B=2M-A') + '.' },
            { html: 'Her point is the midpoint of ' + t('\\overline{AB}') + '.', why: 'The midpoint of ' + t('\\overline{AB}') + ' is ' + t('M') + ', which was given. Her point is halfway between ' + t('A') + ' and ' + t('M') + '.' },
            { html: 'Her point is correct; it just needs to be doubled.', why: 'Doubling her point gives ' + t(ptT(scl(q, 2))) + ' = ' + t('A+M') + ', not the endpoint. Double ' + t('M') + ', then subtract ' + t('A') + '.' }],
            'Averaging answers a different question: it gives the point halfway between ' + t('A') + ' and ' + t('M') + ', which is a quarter of the way along ' + t('\\overline{AB}') + '. To go past ' + t('M') + ' to the other end, run the formula backwards: ' + t('B=(2x_M-x_A,\\ 2y_M-y_A)') + '.', ['Where does ' + t(ptT(q)) + ' sit on the segment: before or after ' + t('M') + '?'], 'why averaging is wrong');
        } },
        { id: 'e14b', sub: 'b', level: 'EMG', make: function (r, o) { return endPart(o.A, o.M, 'B', 'correct endpoint (Priya)', false, 'A', 'Give the correct other endpoint.'); } }] },
    /* ---- EP 15: hiking map ---- */
    { num: '15', shared: function (r) {
        if (r.chance(0.2)) return { P: [-14, 8], Q: [22, -4] };
        return pickWhere(function () { var g = r.int(2, 6), p = r.int(1, 4), q = r.pick(pm(1, 4)), P = [-r.int(4, 16), q < 0 ? r.int(4, 14) : -r.int(2, 10)]; return { P: P, Q: add(P, [2 * g * p, 2 * g * q]) }; },
          function (z) { var v = sub(z.Q, z.P), g = gcd(v[0], v[1]), n = (v[0] / g) * (v[0] / g) + (v[1] / g) * (v[1] / g); return !isSq(n) && radParts(n).k === 1 && Math.abs(z.Q[0]) <= 30 && Math.abs(z.Q[1]) <= 30 && even(g); });
      },
      stem: function (o) { return 'A hiking map is drawn on a coordinate grid where each unit is ' + t('1') + '&nbsp;km. The trailhead is at ' + t(ptT(o.P)) + ' and the lookout is at ' + t(ptT(o.Q)) + ', joined by a straight trail.'; },
      parts: [
        { id: 'e15a', sub: 'a', level: 'BEG', make: function (r, o) { return midP('A rest stop is to be built exactly halfway along the trail. Give its coordinates.', o.P, o.Q, 'rest stop midpoint'); } },
        { id: 'e15b', sub: 'b', level: 'PRG', make: function (r, o) {
          var n = d2(o.P, o.Q), c = dCands(o.P, o.Q);
          return B.fields('Determine the exact total length of the trail, as a mixed radical, and to the nearest tenth of a kilometre.', [lenField('d', 'km'), decField('d', 'km')], [lenCheck(n, 1, { cands: c }), decCheck(n, 1, { cands: c })], [lenKey(n), fx(Math.sqrt(n), 1)],
            t('d=' + lenTex(n) + '\\approx ' + fx(Math.sqrt(n), 1)) + '&nbsp;km', dSteps(o.P, o.Q) + '<br>' + t(dLine(o.P, o.Q, 'd') + simpTail(n) + '\\approx ' + fx(Math.sqrt(n), 1)) + '&nbsp;km.', HD, 'trail length');
        } },
        { id: 'e15c', sub: 'c', level: 'PRG', make: function (r, o) {
          var M = mid(o.P, o.Q), n = d2(o.P, M), c = dCands(o.P, M).concat([[dist(o.P, o.Q), 'd-half', 'That is the whole trail. The rest stop is halfway, so it is half as far.']]);
          return B.fields('How far is the rest stop from the trailhead? Answer exactly and to the nearest tenth.', [lenField('d', 'km'), decField('d', 'km')], [lenCheck(n, 1, { cands: c }), decCheck(n, 1, { cands: c })], [lenKey(n), fx(Math.sqrt(n), 1)],
            t('d=' + lenTex(n) + '\\approx ' + fx(Math.sqrt(n), 1)) + '&nbsp;km', 'From the trailhead to the rest stop ' + t(ptT(M)) + ':<br>' + t(dLine(o.P, M, 'd') + simpTail(n) + '\\approx ' + fx(Math.sqrt(n), 1)) + '&nbsp;km — exactly half of (b), ' + t('\\tfrac{1}{2}\\times ' + lenTex(d2(o.P, o.Q)) + '=' + lenTex(n)) + '.', [HD[0], 'Shortcut: the rest stop is the midpoint, so the answer is half of part (b).'], 'trailhead to rest stop');
        } }] },
    /* ---- EP 16: towns ---- */
    { num: '16', shared: function (r) {
        if (r.chance(0.2)) return { P: [-9, -5], Q: [7, 3] };
        return pickWhere(function () { var P = [-r.int(3, 12), -r.int(2, 9)]; return { P: P, Q: add(P, [2 * r.int(2, 9), 2 * r.int(1, 7)]) }; }, function (z) { var n = d2(z.P, z.Q); return !isSq(n) && radParts(n).k >= 2 && Math.abs(z.Q[0]) <= 14 && Math.abs(z.Q[1]) <= 12; });
      },
      stem: function (o) { return 'Two towns sit on a regional map where each unit is ' + t('1') + '&nbsp;km: Ashcroft at ' + t(ptT(o.P)) + ' and Bellmere at ' + t(ptT(o.Q)) + '. Residents of both towns agree to meet at the point exactly halfway between them.'; },
      parts: [
        { id: 'e16a', sub: 'a', level: 'BEG', make: function (r, o) { return midP('Determine the coordinates of the meeting point.', o.P, o.Q, 'meeting point'); } },
        { id: 'e16b', sub: 'b', level: 'PRG', make: function (r, o) {
          var n = d2(o.P, o.Q), c = dCands(o.P, o.Q);
          return B.fields('Determine the straight-line distance between the two towns, exactly and to the nearest tenth.', [lenField('d', 'km'), decField('d', 'km')], [lenCheck(n, 1, { cands: c }), decCheck(n, 1, { cands: c })], [lenKey(n), fx(Math.sqrt(n), 1)],
            t('d=' + lenTex(n) + '\\approx ' + fx(Math.sqrt(n), 1)) + '&nbsp;km', dSteps(o.P, o.Q) + '<br>' + t(dLine(o.P, o.Q, 'd') + simpTail(n) + '\\approx ' + fx(Math.sqrt(n), 1)) + '&nbsp;km.', HD, 'distance between towns');
        } },
        { id: 'e16c', sub: 'c', level: 'EMG', make: function (r, o) {
          var n = d2(o.P, o.Q), nh = d2(o.P, mid(o.P, o.Q)), c = [[Math.sqrt(n), 'd-half', 'That is the whole distance between the towns. Each group goes only halfway.']];
          return B.fields('How far does each group travel? (Exact and to the nearest tenth.)', [lenField('d', 'km'), decField('d', 'km')], [lenCheck(nh, 1, { cands: c }), decCheck(nh, 1, { cands: c })], [lenKey(nh), fx(Math.sqrt(nh), 1)],
            t('d=' + lenTex(nh) + '\\approx ' + fx(Math.sqrt(nh), 1)) + '&nbsp;km each', 'The meeting point is the midpoint, so each group travels half of ' + t(lenTex(n)) + ': ' + t('\\tfrac{1}{2}\\times ' + lenTex(n) + '=' + lenTex(nh) + '\\approx ' + fx(Math.sqrt(nh), 1)) + '&nbsp;km.', ['The meeting point is halfway — how does each group’s trip compare with the whole distance?'], 'each group’s distance');
        } },
        { id: 'e16c2', sub: 'c, explain', level: 'EMG', make: function (r, o) {
          return mcPart(r, 'How do you know each group’s distance without recomputing a distance?', [
            { html: 'The meeting point is the midpoint, so it is exactly halfway: each group travels half of the total distance.', right: true },
            { html: 'Both towns are the same distance from the origin.', why: 'The towns’ distances from the origin don’t matter. The meeting point is the <b>midpoint</b> of the segment joining them.' },
            { html: 'You can’t know without the distance formula.', why: 'You can: the midpoint is the same distance from both endpoints — half the whole length.' },
            { html: 'Each group travels the full distance, because they both go to the same place.', why: 'Each group starts at its own town and stops at the middle, so each covers only half.' }],
            'The meeting point is the midpoint of the segment joining the towns, so it is the same distance from each town: half of the total distance.', ['What is special about a midpoint?'], 'why half the distance');
        } }] },
    /* ---- EP 17: reasoning ---- */
    { num: '17', stem: '<b>Reasoning.</b>', parts: [
      { id: 'e17a', sub: 'a', level: 'PRG', make: function (r) {
        var a = r.pick(pm(1, 9)), b = pickWhere(function () { return r.pick(pm(1, 9)); }, function (z) { return z !== a && even(z + a); });
        return mcPart(r, 'Is the midpoint of a segment <b>always</b> between the two endpoints? (For example, ' + t('\\tfrac{' + nT(a) + '+' + sgp(b) + '}{2}=' + nT((a + b) / 2)) + '.)', [
          { html: 'Yes. Each coordinate of the midpoint is the average of two numbers, and an average always lies between the two numbers (or equals both when they are the same) — so the midpoint is on the segment, never past an end.', right: true },
          { html: 'No. When the coordinates are negative, the average can land outside the segment.', why: 'Averages of negatives still land between them: ' + t('\\tfrac{-6+(-2)}{2}=-4') + ' is between ' + t('-6') + ' and ' + t('-2') + '.' },
          { html: 'No. On a vertical segment the midpoint’s ' + t('x') + '-coordinate equals both endpoints’, so it is not between them.', why: 'Equal ' + t('x') + '-coordinates average to that same value — the midpoint is still on the segment, halfway up.' },
          { html: 'Only if both endpoints are in the same quadrant.', why: 'The quadrants don’t matter: ' + t('\\tfrac{-4+6}{2}=1') + ' is between ' + t('-4') + ' and ' + t('6') + '.' }],
          'The average of two numbers is always between them (here ' + t(nT((a + b) / 2)) + ' is between ' + t(nT(Math.min(a, b))) + ' and ' + t(nT(Math.max(a, b))) + '), or equal to both when the numbers are the same. Both coordinates of ' + t('M') + ' behave that way, so ' + t('M') + ' always lands on the segment.', ['Where does the average of two numbers sit on a number line?'], 'midpoint always between');
      } },
      { id: 'e17b', sub: 'b', level: 'PRG', make: function (r) {
        var A = [r.pick(pm(1, 8)), r.pick(pm(1, 8))];
        return mcPart(r, 'Can the midpoint ever be equal to one of the endpoints? Use ' + t('M=\\left(\\tfrac{x_1+x_2}{2},\\ \\tfrac{y_1+y_2}{2}\\right)') + '. (For example, take ' + t(nm('A', A)) + ' as one endpoint.)', [
          { html: 'Only when the two “endpoints” are the same point: then ' + t('\\tfrac{x_1+x_1}{2}=x_1') + ' and ' + t('\\tfrac{y_1+y_1}{2}=y_1') + ', so ' + t('M=A=B') + ' and the segment has length ' + t('0') + '.', right: true },
          { html: 'Yes, when the segment is vertical or horizontal.', why: 'A vertical segment from ' + t(ptT(A)) + ' to ' + t(ptT([A[0], A[1] + 4])) + ' has midpoint ' + t(ptT([A[0], A[1] + 2])) + ' — not an endpoint.' },
          { html: 'Yes, when one endpoint is the origin.', why: 'The midpoint of ' + t(ptT(A)) + ' and ' + t('(0,\\ 0)') + ' is ' + t(ptT(scl(A, 0.5), true)) + ' — halfway, not at either end.' },
          { html: 'Never, under any circumstances.', why: 'There is one (degenerate) case: if both endpoints are the same point, the “midpoint” is that point too.' }],
          'For ' + t('M') + ' to equal ' + t('A(x_1,\\ y_1)') + ' we need ' + t('\\tfrac{x_1+x_2}{2}=x_1') + ', so ' + t('x_2=x_1') + ', and likewise ' + t('y_2=y_1') + '. That only happens when ' + t('B') + ' is the same point as ' + t('A') + ' — a “segment” of length ' + t('0') + '.', ['Solve ' + t('\\tfrac{x_1+x_2}{2}=x_1') + ' for ' + t('x_2') + '.'], 'midpoint equal to an endpoint');
      } }] },
    /* ---- EP 18: which quadrant ---- */
    { num: '18', shared: function (r) {
        if (r.chance(0.2)) return { A: [-6, 4], B: [2, -8] };
        return pickWhere(function () { return { A: [-r.int(3, 10), r.int(1, 8)], B: [r.int(1, 8), -r.int(3, 10)] }; }, function (z) { var M = mid(z.A, z.B); return even(z.A[0] + z.B[0]) && even(z.A[1] + z.B[1]) && M[0] < 0 && M[1] < 0; });
      },
      stem: function (o) { return '<b>Reasoning stretch — which quadrant?</b> ' + t(nm('A', o.A)) + ' lies in quadrant II and ' + t(nm('B', o.B)) + ' lies in quadrant IV.'; },
      parts: [
        { id: 'e18a', sub: 'a', level: 'BEG', make: function (r, o) { return midP('Find the midpoint of ' + t('\\overline{AB}') + '.', o.A, o.B, 'midpoint QII–QIV', { before: 'M =' }); } },
        { id: 'e18a2', sub: 'a, quadrant', level: 'BEG', make: function (r, o) {
          var M = mid(o.A, o.B);
          return mcPart(r, 'The midpoint is ' + t(nm('M', M)) + '. Which quadrant is it in?', [{ html: 'Quadrant III — neither endpoint’s quadrant', right: true }, { html: 'Quadrant II, like ' + t('A'), why: 'Quadrant II needs ' + t('y>0') + '; here ' + t('y=' + nT(M[1])) + '.' }, { html: 'Quadrant IV, like ' + t('B'), why: 'Quadrant IV needs ' + t('x>0') + '; here ' + t('x=' + nT(M[0])) + '.' }, { html: 'Quadrant I', why: 'Both coordinates are negative.' }],
            'Both coordinates of ' + t(ptT(M)) + ' are negative, ' + t('(-,\\ -)') + ', so ' + t('M') + ' is in quadrant III — not in either endpoint’s quadrant.', ['Look at the signs of the two coordinates.'], 'quadrant of the midpoint', true);
        } },
        { id: 'e18b', sub: 'b', level: 'PRG', make: function (r, o) {
          return mcPart(r, 'Explain how the midpoint of a quadrant II point and a quadrant IV point can land in quadrant III.', [
            { html: 'The quadrant II point has the negative ' + t('x') + ' and the quadrant IV point has the negative ' + t('y') + '. If the negative ' + t('x') + ' outweighs the other positive ' + t('x') + ', and the negative ' + t('y') + ' outweighs the other positive ' + t('y') + ', both averages come out negative.', right: true },
            { html: 'Averaging always flips the signs of the coordinates.', why: 'Averaging doesn’t flip signs: the midpoint of ' + t('(1,\\ 2)') + ' and ' + t('(3,\\ 4)') + ' is ' + t('(2,\\ 3)') + '. It depends on which numbers are bigger.' },
            { html: 'Because quadrant III lies between quadrants II and IV.', why: 'Quadrant I lies “between” them too. What decides it is the size of the negative coordinates compared with the positive ones.' },
            { html: 'It can’t — the midpoint must be in quadrant II or IV.', why: 'Check part (a): the midpoint had two negative coordinates.' }],
            'In ' + t(nm('A', o.A)) + ' the ' + t('x') + ' is negative; in ' + t(nm('B', o.B)) + ' the ' + t('y') + ' is negative. ' + t('\\tfrac{' + nT(o.A[0]) + '+' + nT(o.B[0]) + '}{2}<0') + ' because ' + t(F(Math.abs(o.A[0]))) + ' > ' + t(F(o.B[0])) + ', and ' + t('\\tfrac{' + nT(o.A[1]) + '+' + sgp(o.B[1]) + '}{2}<0') + ' because ' + t(F(Math.abs(o.B[1]))) + ' > ' + t(F(o.A[1])) + '. Both negative → quadrant III.', ['Compare the size of each negative coordinate with the positive one it is averaged with.'], 'QII + QIV → QIII');
        } },
        { id: 'e18c', sub: 'c', level: 'PRG', make: function (r) {
          return mcPart(r, 'Explain why the midpoint of two quadrant III points <b>must</b> always be in quadrant III.', [
            { html: 'Both ' + t('x') + '’s are negative and both ' + t('y') + '’s are negative; the average of two negatives is always negative, so the midpoint has ' + t('x<0') + ' and ' + t('y<0') + '.', right: true },
            { html: 'Because the midpoint is always in the same quadrant as its endpoints.', why: 'Not always — part (a) showed a midpoint outside both endpoints’ quadrants. Here it works because both coordinates are negative in <b>both</b> points.' },
            { html: 'Because the sum of two negatives is positive, and halving keeps it positive.', why: 'The sum of two negatives is <b>negative</b>, e.g. ' + t('-3+(-5)=-8') + '.' },
            { html: 'It doesn’t have to be: it could land on an axis.', why: 'To land on an axis, one average would have to be ' + t('0') + ' — impossible when both numbers are negative.' }],
            'For two quadrant III points both ' + t('x') + '-coordinates are negative, so their sum and its half are negative; the same holds for the ' + t('y') + '-coordinates. So the midpoint has ' + t('x<0,\\ y<0') + ': quadrant III.', ['What is the sign of the average of two negative numbers?'], 'two QIII points');
        } }] }
  ];
  function sq(x) { return x * x; }
  function rectPts(o) { return { A: [o.x1, o.y1], B: [o.x2, o.y1], C: [o.x2, o.y2], D: [o.x1, o.y2] }; }
  function paraPts(o) { var A = o.A, Bq = add(A, o.u), D = add(A, o.w), C = add(Bq, o.w); return { A: A, B: Bq, C: C, D: D }; }
  /* the other endpoint from A and M: prompt (or default), name of B */
  function endPart(A, M, nb, text, frac, na, prompt) {
    na = na || 'A';
    var Bp = sub(scl(M, 2), A);
    return ptPart(prompt || t(nm(na, A) + ',\\ \\text{midpoint }' + nm('M', M, frac)), Bp, { cands: endCands(A, M), before: nb ? nb + ' =' : 'Other endpoint:' }, endSol(A, M, nb, frac), HE, text);
  }

  HW.defineLesson({ id: 'u6l4', unit: 6, num: 4, title: 'The Midpoint Formula', outcome: 'RF3', questions: QUESTIONS, extra: EXTRA });
})(window);
