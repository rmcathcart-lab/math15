/* Math 15 · Unit 6 (Characteristics of Linear Relations: Pythagoras, length, distance, midpoint, slope) — exit slips for
 * Lessons 1–10 (u6l1x … u6l10x), written in test mode. All questions are RF3 (Ryan's tags).
 * Each slip is Ryan's own Math 15 exit slip for that lesson (his older exit-slip app, Versions A and B), turned into
 * generators: the same questions, skills, outcomes and levels (his tags), with his Version A and B numbers and graphs
 * among the possible values. Every part has a key built from the generated values, a worked solution, hints, and `bad`
 * answers with u6x- codes (labels and partial-credit decisions below). Grids are drawn with HW.graph like the 10C slips
 * (every unit labelled, so the endpoints can be read), with each point's name pushed clear of its segment.
 * Changes from his slips:
 *  - Where his slip had only Beginning/Progressing questions, one short Mastery question was added at Math 15
 *    difficulty, taken from the lesson's own harder assignment items: L1 is it a right triangle (a² + b² vs c², Q15),
 *    L2 both possible endpoints of a segment of a given length (Q12), L4 a midpoint from directions east/west/north/south
 *    (Q9), L6 the grade of a hill as a fraction and a percent (Q6), L7 the missing coordinates that make a slope zero or
 *    undefined, L9 a missing coordinate that makes two segments perpendicular (Q12). L3, L5, L8 and L10 already had one.
 *  - Multiple choice kept where it tests recognition: L7 which graph has a zero/undefined slope and the type of slope
 *    from two points, L8 the slope test with a reason in each option, L9 parallel/perpendicular/neither from two slopes.
 *    L10 Q3 (his Mastery MC "parallel / perpendicular / neither" from four points) became typed: both slopes, then the
 *    conclusion in a word (MC is not used in the Mastery box).
 *  - L7 Q1 asks for the zero slope (his) or, in some versions, the undefined slope.
 * Answers: lengths are exact where his slip asks for a mixed radical in simplest form (an unsimplified radical or a
 * decimal is "right value, wrong form"); slopes accept equivalent fractions and decimals (as his old slips did) and
 * "undefined"; points may be typed with or without brackets. A scientific calculator is allowed. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, LN = HW.lines;

  HW.addCodes({
    'u6x-py-sum': 'Added the side lengths (no squares)', 'u6x-py-diff': 'Subtracted the side lengths (no squares)', 'u6x-py-noroot': 'Pythagoras: forgot the square root',
    'u6x-py-sub-hyp': 'Subtracted squares when finding the hypotenuse', 'u6x-py-add-leg': 'Added squares when finding a leg',
    'u6x-sq-double': 'Doubled a side instead of squaring it', 'u6x-conv-longest': 'Did not use the longest side as c', 'u6x-conv-yesno': 'Wrong right-triangle conclusion',
    'u6x-len-dropneg': 'Length: dropped the negative sign of a coordinate', 'u6x-len-points': 'Counted grid points instead of spaces', 'u6x-len-neg': 'Gave a negative length',
    'u6x-len-same': 'Subtracted the coordinates that are equal', 'u6x-per-half': 'Perimeter: added only two sides', 'u6x-per-area': 'Found the area instead of the perimeter',
    'u6x-per-sign': 'Perimeter: sign slip in a side length', 'u6x-one-val': 'Gave only one of the two values', 'u6x-len-pm': 'Gave ± the length instead of the coordinates',
    'u6x-len-sign': 'Sign slip finding the coordinates', 'u6x-list-extra': 'Extra value in the list',
    'u6x-d-legs': 'Added the run and the rise (no Pythagoras)', 'u6x-d-noroot': 'Distance: forgot the square root', 'u6x-d-subsq': 'Distance: subtracted the squares instead of adding',
    'u6x-d-sign': 'Distance: sign slip in the run or the rise', 'u6x-sc-noscale': 'Forgot to multiply by the map scale',
    'u6x-mid-nohalf': 'Midpoint: did not divide by 2', 'u6x-mid-sub': 'Midpoint: subtracted the coordinates', 'u6x-mid-own': 'Midpoint: averaged each point’s own x and y',
    'u6x-pt-swap': 'Point written as (y, x)', 'u6x-pt-sign': 'Sign slip in a coordinate', 'u6x-dir-sign': 'West/south not written as negative',
    'u6x-end-avg': 'Missing endpoint: averaged the endpoint and the midpoint', 'u6x-end-step': 'Missing endpoint: gave the step from the endpoint to the midpoint',
    'u6x-end-dblA': 'Missing endpoint: doubled the endpoint, not the midpoint', 'u6x-end-addA': 'Missing endpoint: added the endpoint instead of subtracting',
    'u6x-end-half': 'Gave half the length (endpoint to midpoint)',
    'u6x-sl-points': 'Slope: counted grid points instead of spaces', 'u6x-sl-runsign': 'Slope: sign slip in the run', 'u6x-sl-risesign': 'Slope: sign slip in the rise',
    'u6x-sl-flip-sign': 'Slope: run over rise and lost the sign', 'u6x-pct-dec': 'Grade given as a decimal, not a percent', 'u6x-pct-flip': 'Grade from run over rise',
    'u6x-zu-swap': 'Mixed up zero and undefined slope', 'u6x-zu-zero': 'Thought a slope of 0 means a coordinate of 0',
    'u6x-col-flip': 'Collinear: solved with run over rise', 'u6x-col-noadd': 'Collinear: forgot to add the starting y-value', 'u6x-col-run': 'Collinear: used the wrong run',
    'u6x-col-sign': 'Collinear: sign slip in the slope', 'u6x-perp-same': 'Perpendicular: gave the same slope', 'u6x-perp-recip': 'Perpendicular: flipped but kept the sign',
    'u6x-perp-sign': 'Perpendicular: changed the sign but did not flip', 'u6x-k-par': 'Used the parallel slope instead of the perpendicular one',
    'u6x-k-recip': 'Perpendicular slope with the wrong sign', 'u6x-k-flip': 'Solved for the unknown with run over rise', 'u6x-rel-wrong': 'Wrong parallel / perpendicular / neither decision'
  });
  HW.addPartial({
    'u6x-py-sum': 'n', 'u6x-py-diff': 'n', 'u6x-py-noroot': 'b', 'u6x-py-sub-hyp': 'n', 'u6x-py-add-leg': 'n', 'u6x-sq-double': 'b', 'u6x-conv-longest': 'b', 'u6x-conv-yesno': 'n',
    'u6x-len-dropneg': 's', 'u6x-len-points': 's', 'u6x-len-neg': 's', 'u6x-len-same': 'n', 'u6x-per-half': 'b', 'u6x-per-area': 'n', 'u6x-per-sign': 's',
    'u6x-one-val': 'b', 'u6x-len-pm': 'b', 'u6x-len-sign': 's', 'u6x-list-extra': 'b',
    'u6x-d-legs': 'n', 'u6x-d-noroot': 'b', 'u6x-d-subsq': 'n', 'u6x-d-sign': 's', 'u6x-sc-noscale': 'b',
    'u6x-mid-nohalf': 'b', 'u6x-mid-sub': 'n', 'u6x-mid-own': 'n', 'u6x-pt-swap': 'b', 'u6x-pt-sign': 's', 'u6x-dir-sign': 'b',
    'u6x-end-avg': 'n', 'u6x-end-step': 'b', 'u6x-end-dblA': 'n', 'u6x-end-addA': 's', 'u6x-end-half': 'b',
    'u6x-sl-points': 's', 'u6x-sl-runsign': 's', 'u6x-sl-risesign': 's', 'u6x-sl-flip-sign': 'n', 'u6x-pct-dec': 's', 'u6x-pct-flip': 'b',
    'u6x-zu-swap': 'n', 'u6x-zu-zero': 'n', 'u6x-col-flip': 'b', 'u6x-col-noadd': 'b', 'u6x-col-run': 'n', 'u6x-col-sign': 's',
    'u6x-perp-same': 'n', 'u6x-perp-recip': 'b', 'u6x-perp-sign': 'b', 'u6x-k-par': 'n', 'u6x-k-recip': 'b', 'u6x-k-flip': 'b', 'u6x-rel-wrong': 'n'
  });

  /* ================= numbers and LaTeX ================= */
  function cl(x) { return Math.round(x * 1e6) / 1e6; }
  function same(a, b) { return Math.abs(a - b) < 1e-7; }
  function nT(x) { return F(cl(x)); }
  function sgp(x) { x = cl(x); return x < 0 ? '(' + nT(x) + ')' : nT(x); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nz(a, b) { return range(a, b).filter(function (x) { return x !== 0; }); }
  function pickWhere(gen, okf) { for (var i = 0; i < 5000; i++) { var o = gen(); if (o != null && okf(o)) return o; } throw new Error('u6 exits: no valid numbers'); }
  function ptT(p) { return '(' + nT(p[0]) + ',\\ ' + nT(p[1]) + ')'; }
  function ptKey(p) { return '(' + cl(p[0]) + ', ' + cl(p[1]) + ')'; }
  function samePt(a, b) { return same(a[0], b[0]) && same(a[1], b[1]); }
  function mid(a, b) { return [cl((a[0] + b[0]) / 2), cl((a[1] + b[1]) / 2)]; }
  function add(a, b) { return [cl(a[0] + b[0]), cl(a[1] + b[1])]; }
  function sub(a, b) { return [cl(a[0] - b[0]), cl(a[1] - b[1])]; }
  function scl(a, k) { return [cl(a[0] * k), cl(a[1] * k)]; }
  function red(p, q) { if (q === 0) return null; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [cl(p / g), cl(q / g)]; }
  function frT(p, q) { return LN.frT(p, q); }
  function slT(s) { return s == null ? '\\text{undefined}' : frT(s[0], s[1]); }
  function sval(s) { return s == null ? null : s[0] / s[1]; }
  function rawFr(p, q) { return '\\frac{' + nT(p) + '}{' + nT(q) + '}'; }
  function fracSteps(p, q) { var s = rawFr(p, q); if (q === 0) return s; var r2 = slT(red(p, q)); return r2 === s ? s : s + '=' + r2; }
  function subT(a, b) { return nT(a) + '-' + (b < 0 ? '(' + nT(b) + ')' : nT(b)); }
  function formulaT(A, Bp) { return '\\frac{' + subT(Bp[1], A[1]) + '}{' + subT(Bp[0], A[0]) + '}'; }
  function slopeOf(A, Bp) { return red(cl(Bp[1] - A[1]), cl(Bp[0] - A[0])); }
  function slopeLine(A, Bp, nm) { return (nm ? 'm_{' + nm + '}=' : '') + formulaT(A, Bp) + '=' + fracSteps(cl(Bp[1] - A[1]), cl(Bp[0] - A[0])); }
  function simp(n) { var k = 1, m = n; for (var f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; } return [k, m]; }
  function radT(n) { var s = simp(n); return s[1] === 1 ? String(s[0]) : (s[0] === 1 ? '' : s[0]) + '\\sqrt{' + s[1] + '}'; }
  function nw(html) { return '<span style="white-space:nowrap">' + html + '</span>'; }
  function Q(num, level, stem, make) { return { num: String(num), outcome: 'RF3', stem: stem, parts: [{ id: String(num), outcome: 'RF3', level: level, make: make }] }; }
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }

  /* ================= checkers ================= */
  /* a number typed as a decimal, a fraction or a radical; "h = 12" after a printed "h =" is fine */
  function numVal(resp) {
    var s = String(resp == null ? '' : resp).replace(/^\s*[a-zA-Z]\s*=\s*(?=[-−+.\d\\])/, '');
    var pn = HW.parse.number(s); if (pn.ok) return { v: pn.value, dec: true };
    if (pn.code === 'empty') return { res: form('empty', 'Type your answer first.') };
    var r0 = K.number(0)(s); if (r0.v === 'form' && r0.code === 'units') return { res: r0 };
    var a = K.read(s); if (a.res) return { res: a.res };
    if (!isFinite(a.val)) return { res: form('notnumber', 'Enter a single number.') };
    return { v: a.val, dec: false };
  }
  /* dl = [[wrongValue, code, hint], …]; an irrational wrong value also matches its decimal to one place */
  function numChk(ans, dl) {
    ans = cl(ans); var L = (dl || []).filter(function (d) { return d && isFinite(d[0]) && Math.abs(d[0] - ans) > 0.06; });
    return function (resp) {
      var n = numVal(resp); if (n.res) return n.res;
      if (Math.abs(n.v - ans) < 1e-6) return ok();
      for (var i = 0; i < L.length; i++) { var w = L[i][0], tol = n.dec && Math.abs(w - Math.round(w * 10) / 10) > 1e-9 ? 0.051 : 1e-6; if (Math.abs(n.v - w) < tol) return wrong(L[i][1], L[i][2]); }
      return wrong('value', null);
    };
  }
  function badOf(ans, dl) {
    return (dl || []).filter(function (d) { return d && isFinite(d[0]) && Math.abs(d[0] - ans) > 0.06; }).map(function (d) { var w = d[0]; return Math.abs(w - Math.round(w * 10) / 10) > 1e-9 ? (Math.round(w * 10) / 10).toFixed(1) : String(cl(w)); })
      .filter(function (s, i, a) { return a.indexOf(s) === i; });
  }
  function numPart(prompt, ans, dl, sol, hints, text, inp) {
    inp = inp || {};
    return { prompt: prompt, input: Object.assign({ type: 'number' }, inp), check: numChk(ans, dl), key: String(cl(ans)), answer: t((inp.ansPre || '') + nT(ans)) + (inp.after ? ' ' + inp.after : ''), solution: sol, hints: hints || [], text: text, bad: badOf(ans, dl) };
  }
  function ynChk(want, code, hint) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').trim().toLowerCase().replace(/[.!]+$/, '');
      if (!s) return form('empty', 'Type <b>yes</b> or <b>no</b>.');
      var y = /^(y|yes|yep|yeah|true)$/.test(s), n = /^(n|no|nope|false)$/.test(s);
      if (!y && !n) return form('yes-no', 'Type <b>yes</b> or <b>no</b>.');
      return y === (want === 'yes') ? ok() : wrong(code, hint);
    };
  }
  /* slope: equivalent fractions and decimals accepted; diag(v) → {code, hint} for known wrong values */
  function slopeChk(sl, diag, o) { o = o || {}; return K.slope(sl, { lowest: o.lowest === true, diag: diag, signHint: o.signHint }); }
  function slopePart(prompt, sl, diag, bad, sol, hints, text, o) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'math', keys: 'slope', before: o.before || t('m='), placeholder: 'e.g. 3/4 or -2/3' }, check: slopeChk(sl, diag, o), key: slT(sl), answer: t((o.ansPre || 'm=') + slT(sl)), solution: sol, hints: hints || [], text: text };
    p.bad = (bad || []).filter(function (b, i, a) { return b !== p.key && a.indexOf(b) === i; });
    return p;
  }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }

  /* ---------- one ordered pair: "(3, -2)", "3, -2" or "M = (3, -2)"; dl = [[point, code, hint]] ---------- */
  function cleanR(s) { return String(s == null ? '' : s).replace(/\\left|\\right/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')').replace(/\\[,;:! ]|~/g, ' ').replace(/−/g, '-').trim(); }
  function numOf(s) { var q = ex.parse(String(s).trim()); if (!q.ok) return NaN; var v = ex.value(q.ast); return isFinite(v) ? v : NaN; }
  function readPt(resp) {
    var s = cleanR(resp).replace(/^[A-Za-z]\s*=?\s*(?=\()/, '');
    if (!s) return { empty: true };
    var m = /^\(\s*([^(),]+)\s*,\s*([^(),]+)\s*\)$/.exec(s) || /^([^(),]+),([^(),]+)$/.exec(s);
    if (m) { var a = numOf(m[1]), b = numOf(m[2]); return isFinite(a) && isFinite(b) ? { pt: [a, b] } : { bad: true }; }
    var v = numOf(s.replace(/^[a-zA-Z]\s*=\s*/, '')); if (isFinite(v)) return { val: v };
    return { bad: true };
  }
  function ptChk(T, o) {
    o = o || {}; var dl = (o.dl || []).filter(function (d) { return !samePt(d[0], T); });
    return function (resp) {
      var r = readPt(resp);
      if (r.empty) return form('empty', 'Type your answer first.');
      if (r.bad) return form('pt-unreadable', 'Write the point as an ordered pair in brackets, like ' + t('(3,\\ -2)') + '.');
      if (r.val != null) return form('pt-not-pair', 'A point needs two coordinates: write it as an ordered pair, like ' + t('(3,\\ -2)') + '.');
      var p = r.pt;
      if (samePt(p, T)) return ok();
      for (var i = 0; i < dl.length; i++) if (samePt(p, dl[i][0])) return wrong(dl[i][1], dl[i][2]);
      if (same(p[0], T[1]) && same(p[1], T[0])) return wrong('u6x-pt-swap', 'Your coordinates are in the wrong order: the ' + t('x') + '-coordinate comes first, then the ' + t('y') + '-coordinate.');
      if (same(Math.abs(p[0]), Math.abs(T[0])) && same(Math.abs(p[1]), Math.abs(T[1]))) return wrong('u6x-pt-sign', 'Check the signs of your coordinates.');
      if (same(p[0], T[0])) return wrong('pt-y', 'Your ' + t('x') + '-coordinate is right — check the ' + t('y') + '-coordinate.');
      if (same(p[1], T[1])) return wrong('pt-x', 'Your ' + t('y') + '-coordinate is right — check the ' + t('x') + '-coordinate.');
      return wrong('value', null);
    };
  }
  function ptPart(prompt, T, o, sol, hints, text) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'math', keys: 'pairs', placeholder: 'e.g. (3, -2)', before: o.before }, check: ptChk(T, o), key: ptKey(T), answer: t((o.name || '') + ptT(T)), solution: sol, hints: hints || [], text: text };
    var bad = (o.dl || []).map(function (d) { return ptKey(d[0]); }); if (!same(T[0], T[1])) bad.push(ptKey([T[1], T[0]]));
    p.bad = bad.filter(function (b, i, a) { return a.indexOf(b) === i && b !== ptKey(T); });
    p.good = ['\\left(' + cl(T[0]) + ',' + cl(T[1]) + '\\right)', cl(T[0]) + ',' + cl(T[1])];
    return p;
  }

  /* ---------- a list of values in any order ("x = 5 or x = -11") ---------- */
  function readList(resp) {
    var s = cleanR(resp).replace(/\\\{|\\\}|\\lbrace|\\rbrace|[{}]/g, ' ').replace(/\\text\{\s*(or|and)\s*\}/gi, ',').replace(/\\text\{([^{}]*)\}/g, '$1');
    s = s.replace(/\b(or|and)\b/gi, ',').replace(/[a-zA-Z]\s*=\s*/g, '');
    if (!s.trim()) return { empty: true };
    var out = [], ps = s.split(/[,;]/);
    for (var i = 0; i < ps.length; i++) { var q = ps[i].trim(); if (!q) continue; var v = numOf(q); if (!isFinite(v)) return { bad: true }; out.push(v); }
    return out.length ? { vals: out } : { empty: true };
  }
  function uniq(a) { var s = a.slice().sort(function (x, y) { return x - y; }); return s.filter(function (x, i) { return i === 0 || Math.abs(x - s[i - 1]) > 1e-9; }); }
  function setSame(A, Bs) { A = uniq(A); Bs = uniq(Bs); return A.length === Bs.length && A.every(function (x, i) { return Math.abs(x - Bs[i]) < 1e-6; }); }
  function listPart(prompt, vals, o, sol, hints, text) {
    o = o || {}; var T = uniq(vals), dl = (o.dl || []).filter(function (d) { return !setSame(d[0], T); }), v = o.v || 'x';
    var check = function (resp) {
      var r = readList(resp);
      if (r.empty) return form('empty', 'Type your answer first.');
      if (r.bad) return form('list-unreadable', 'Type the values separated by a comma, like ' + t(v + '=5,\\ ' + v + '=-11') + '.');
      var A = uniq(r.vals);
      if (setSame(A, T)) return ok();
      for (var i = 0; i < dl.length; i++) if (setSame(A, dl[i][0])) return wrong(dl[i][1], dl[i][2]);
      var miss = T.filter(function (x) { return !A.some(function (y) { return same(x, y); }); }), extra = A.filter(function (x) { return !T.some(function (y) { return same(x, y); }); });
      if (miss.length && !extra.length) return wrong('u6x-one-val', o.missHint || 'That value works — but there is a second one.');
      if (extra.length && !miss.length) return wrong('u6x-list-extra', 'One of your values doesn’t work — check each one.');
      return wrong('value', null);
    };
    var p = { prompt: prompt, input: { type: 'math', keys: 'solutions', vars: [v], placeholder: 'e.g. ' + v + ' = 5, ' + v + ' = -11', before: o.before }, check: check, key: T.map(function (x) { return v + '=' + cl(x); }).join(', '),
      answer: t(T.map(function (x) { return v + '=' + nT(x); }).join(',\\ ')), solution: sol, hints: hints || [], text: text };
    p.bad = dl.map(function (d) { return uniq(d[0]).map(function (x) { return v + '=' + cl(x); }).join(', '); }).concat([v + '=' + cl(T[0])]);
    return p;
  }

  /* ================= figures ================= */
  var INK = '#2b3340', RED = '#c0392b', BLUE = '#2b55a0', FONT = 'font-family="KaTeX_Main, \'Times New Roman\', serif"';
  function winOf(pts) {
    var xs = pts.map(function (p) { return p[0]; }).concat([0]), ys = pts.map(function (p) { return p[1]; }).concat([0]);
    var x0 = Math.min.apply(null, xs) - 1, x1 = Math.max.apply(null, xs) + 1, y0 = Math.min.apply(null, ys) - 1, y1 = Math.max.apply(null, ys) + 1;
    while (x1 - x0 < 7) { x0--; if (x1 - x0 < 7) x1++; }
    while (y1 - y0 < 7) { y0--; if (y1 - y0 < 7) y1++; }
    return { x: [x0, x1], y: [y0, y1] };
  }
  function labTxt(x, y, s) { return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="14" font-weight="700" font-style="italic" text-anchor="middle" dominant-baseline="central" fill="' + INK + '" paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round">' + s + '</text>'; }
  /* points on a grid, labelled; o.segs: [[i, j]] segments to draw; each name is pushed away from the other end of its
     segment (o.away), from the middle of all the points, or (o.perp) above the line through the first and last point */
  function gridFig(pts, names, o) {
    o = o || {}; var w = o.win || winOf(pts);
    var svg = HW.graph({ x: w.x, y: w.y, labels: 1, segs: (o.segs || []).map(function (s) { return { pts: [pts[s[0]], pts[s[1]]] }; }), points: pts.map(function (p) { return { x: p[0], y: p[1] }; }), max: o.max || 330, aria: o.aria || 'points on a coordinate grid' });
    var L = HW.graph.last, extra = '';
    var cx = pts.reduce(function (s, p) { return s + L.X(p[0]); }, 0) / pts.length, cy = pts.reduce(function (s, p) { return s + L.Y(p[1]); }, 0) / pts.length;
    var last = pts[pts.length - 1], nx = -(L.Y(last[1]) - L.Y(pts[0][1])), ny = L.X(last[0]) - L.X(pts[0][0]);
    if (ny > 0 || (ny === 0 && nx > 0)) { nx = -nx; ny = -ny; }
    pts.forEach(function (p, i) {
      var ax = L.X(p[0]), ay = L.Y(p[1]), dx, dy;
      if (o.perp) { dx = nx; dy = ny; } else if (o.away && o.away[i]) { dx = ax - L.X(o.away[i][0]); dy = ay - L.Y(o.away[i][1]); } else { dx = ax - cx; dy = ay - cy; }
      var len = Math.hypot(dx, dy); if (len < 1) { dx = 1; dy = -1; len = Math.SQRT2; }
      var x = Math.max(9, Math.min(L.W - 9, ax + dx / len * 15)), y = Math.max(9, Math.min(L.H - 9, ay + dy / len * 15));
      extra += labTxt(x, y, names[i]);
    });
    return '<div class="fig">' + svg.replace(/<\/svg>$/, extra + '</svg>') + '</div>';
  }
  function segFig(A, Bp, nm, o) { o = o || {}; return gridFig([A, Bp], [nm.charAt(0), nm.charAt(1)], Object.assign({ segs: [[0, 1]], away: [Bp, A] }, o)); }
  /* a right triangle drawn to scale: legs base (across) and ht (up), right angle at the bottom left or right */
  function triFig(base, ht, u, rightLeft) {
    var s = Math.min(170 / base, 125 / ht), W = base * s, H = ht * s, x0 = 72, yb = 22 + H;
    var xc = rightLeft ? x0 : x0 + W, xo = rightLeft ? x0 + W : x0, yt = yb - H, sg = rightLeft ? 1 : -1;
    var b = '<polygon points="' + xc + ',' + yb + ' ' + xo.toFixed(1) + ',' + yb.toFixed(1) + ' ' + xc.toFixed(1) + ',' + yt.toFixed(1) + '" fill="#eef0f2" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>';
    b += '<path d="M' + (xc + sg * 11) + ' ' + yb + 'V' + (yb - 11) + 'H' + xc + '" fill="none" stroke="' + INK + '" stroke-width="1.3"/>';
    b += '<text x="' + ((xc + xo) / 2).toFixed(1) + '" y="' + (yb + 20).toFixed(1) + '" text-anchor="middle" fill="' + INK + '">' + base + ' ' + u + '</text>';
    b += '<text x="' + (xc - sg * 8).toFixed(1) + '" y="' + ((yb + yt) / 2 + 5).toFixed(1) + '" text-anchor="' + (rightLeft ? 'end' : 'start') + '" fill="' + INK + '">' + ht + ' ' + u + '</text>';
    var mx = (xo + xc) / 2, my = (yb + yt) / 2, dx = mx - xc, dy = my - yb, l = Math.hypot(dx, dy);
    b += '<text x="' + (mx + dx / l * 15).toFixed(1) + '" y="' + (my + dy / l * 15 + 5).toFixed(1) + '" text-anchor="middle" font-size="18" font-style="italic" font-weight="700" fill="' + RED + '">c</text>';
    var Wv = x0 + W + 75, Hv = yb + 30;
    return '<div style="margin:.4em 0"><svg viewBox="0 0 ' + Wv.toFixed(0) + ' ' + Hv.toFixed(0) + '" width="100%" style="max-width:' + Math.min(320, Wv * 1.15).toFixed(0) + 'px;display:block" role="img" aria-label="right triangle with legs ' + base + ' and ' + ht + ' ' + u + ' and hypotenuse c" ' + FONT + ' font-size="15">' + b + '</svg></div>';
  }
  /* a ladder / wire / kite string leaning from a vertical height h to a point d along the ground */
  function leanFig(kind, d, h, L) {
    var s = Math.min(150 / h, 125 / d), gx = 64, top = 26, gy = top + h * s, fx = gx + d * s, b = '';
    if (kind === 'ladder') b += '<rect x="' + (gx - 18) + '" y="' + (top - 16) + '" width="18" height="' + (gy - top + 16).toFixed(1) + '" fill="#e3e8f0" stroke="' + INK + '" stroke-width="1.3"/><text x="' + (gx - 9) + '" y="' + (top - 21) + '" text-anchor="middle" font-size="13" fill="' + INK + '">wall</text>';
    if (kind === 'pole') b += '<rect x="' + (gx - 6) + '" y="' + (top - 4) + '" width="6" height="' + (gy - top + 4).toFixed(1) + '" fill="#cfd5de" stroke="' + INK + '" stroke-width="1.2"/><text x="' + (gx - 3) + '" y="' + (top - 9) + '" text-anchor="middle" font-size="13" fill="' + INK + '">pole</text>';
    if (kind === 'kite') b += '<path d="M' + gx + ' ' + (top - 14) + ' l9 14 l-9 14 l-9 -14 z" fill="#f3d9a4" stroke="' + INK + '" stroke-width="1.2"/>';
    b += '<line x1="' + (gx - 34) + '" y1="' + gy.toFixed(1) + '" x2="' + (fx + 40).toFixed(1) + '" y2="' + gy.toFixed(1) + '" stroke="' + INK + '" stroke-width="2.4"/>';
    b += '<line x1="' + gx + '" y1="' + top + '" x2="' + fx.toFixed(1) + '" y2="' + gy.toFixed(1) + '" stroke="' + BLUE + '" stroke-width="' + (kind === 'ladder' ? 4.5 : 2.2) + '" stroke-linecap="round"/>';
    b += '<line x1="' + gx + '" y1="' + top + '" x2="' + gx + '" y2="' + gy.toFixed(1) + '" stroke="' + RED + '" stroke-width="2.2" stroke-dasharray="6 4"/>';
    b += '<path d="M' + (gx + 11) + ' ' + gy.toFixed(1) + 'V' + (gy - 11).toFixed(1) + 'H' + gx + '" fill="none" stroke="' + INK + '" stroke-width="1.3"/>';
    b += '<text x="' + (gx + 9) + '" y="' + ((top + gy) / 2 + 22).toFixed(1) + '" font-size="18" font-style="italic" font-weight="700" fill="' + RED + '">h</text>';
    b += '<text x="' + ((gx + fx) / 2).toFixed(1) + '" y="' + (gy + 19).toFixed(1) + '" text-anchor="middle" fill="' + INK + '">' + nT(d) + ' m</text>';
    var mx = (gx + fx) / 2, my = (top + gy) / 2, nxx = (gy - top), nyy = -(fx - gx), l = Math.hypot(nxx, nyy);
    b += '<text x="' + (mx + nxx / l * 12).toFixed(1) + '" y="' + (my + nyy / l * 12 - 2).toFixed(1) + '" fill="' + BLUE + '" font-size="14">' + nT(L) + ' m ' + (kind === 'ladder' ? 'ladder' : kind === 'pole' ? 'wire' : 'string') + '</text>';
    var Wv = fx + 120, Hv = gy + 28;
    return '<div style="margin:.4em 0"><svg viewBox="0 0 ' + Wv.toFixed(0) + ' ' + Hv.toFixed(0) + '" width="100%" style="max-width:' + Math.min(330, Wv * 1.1).toFixed(0) + 'px;display:block" role="img" aria-label="' + kind + ' of length ' + L + ' m, ' + d + ' m along the ground, height h" ' + FONT + ' font-size="15">' + b + '</svg></div>';
  }

  /* =====================================================================================================
   * Lesson 1 — Review: the Pythagorean theorem
   * ===================================================================================================== */
  var HPY = ['In a right triangle, ' + t('a^{2}+b^{2}=c^{2}') + ', where ' + t('c') + ' is the <b>hypotenuse</b> (the longest side, across from the right angle).',
    'Square both legs, <b>add</b>, then take the square root.'];
  function l1q1(r) { // Ryan: legs 12 and 16 → 20 · 9 and 12 → 15
    var tr = r.pick([[12, 16, 20], [9, 12, 15], [3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [10, 24, 26], [15, 20, 25], [12, 9, 15], [16, 12, 20]]), sw = r.chance(0.5);
    var a = sw ? tr[1] : tr[0], b = sw ? tr[0] : tr[1], c = tr[2], u = r.pick(['cm', 'cm', 'm']);
    var dl = [[a + b, 'u6x-py-sum', 'The legs are not added directly. Square each leg first: ' + t(a + '^{2}+' + b + '^{2}') + ', then take the square root.'],
      [c * c, 'u6x-py-noroot', t(c * c) + ' is ' + t('c^{2}') + ', not ' + t('c') + '. Take the square root.'],
      [Math.sqrt(Math.abs(a * a - b * b)), 'u6x-py-sub-hyp', 'Subtract only when you are finding a <b>leg</b>. For the hypotenuse, <b>add</b> the squares.'],
      [Math.abs(a - b), 'u6x-py-diff', 'Square the legs and add them: ' + t(a + '^{2}+' + b + '^{2}') + ', then take the square root.']];
    return numPart('Find the length of the hypotenuse, ' + t('c') + '.' + triFig(a, b, u, r.chance(0.5)), c, dl,
      t('c^{2}=' + a + '^{2}+' + b + '^{2}=' + a * a + '+' + b * b + '=' + c * c) + ', so ' + t('c=\\sqrt{' + c * c + '}=' + c) + ' ' + u + '.', HPY, 'hypotenuse from two legs', { before: t('c='), after: u });
  }
  var LEAN = {
    ladder: { tr: [[5, 12, 13], [6, 8, 10], [3, 4, 5], [9, 12, 15], [8, 15, 17], [4.5, 6, 7.5], [2.5, 6, 6.5]], txt: function (L, d) { return 'A ' + t(nT(L)) + ' m ladder leans against a wall. Its foot is ' + t(nT(d)) + ' m from the wall. How high up the wall does the ladder reach? Find ' + t('h') + ', in metres.'; } },
    pole: { tr: [[5, 12, 13], [6, 8, 10], [9, 12, 15], [8, 15, 17], [7, 24, 25], [10, 24, 26], [12, 16, 20]], txt: function (L, d) { return 'A ' + t(nT(L)) + ' m wire runs from the top of a pole straight to a stake in the ground ' + t(nT(d)) + ' m from the bottom of the pole. How tall is the pole? Find ' + t('h') + ', in metres.'; } },
    kite: { tr: [[12, 16, 20], [15, 20, 25], [18, 24, 30], [24, 32, 40], [21, 28, 35], [30, 40, 50], [20, 48, 52]], txt: function (L, d) { return 'A kite is on a tight ' + t(nT(L)) + ' m string. It is straight above a spot ' + t(nT(d)) + ' m along the ground from the end of the string. How high is the kite? Find ' + t('h') + ', in metres.'; } } };
  function l1q2(r) { // Ryan: 13 m ladder, foot 5 m → 12 · 10 m ladder, foot 6 m → 8
    var kind = r.pick(['ladder', 'ladder', 'pole', 'kite']), c = LEAN[kind], tr = r.pick(c.tr), d = tr[0], h = tr[1], L = tr[2];
    var dl = [[Math.sqrt(L * L + d * d), 'u6x-py-add-leg', 'To find a <b>leg</b>, subtract: ' + t('h^{2}=' + nT(L) + '^{2}-' + nT(d) + '^{2}') + '. The ' + (kind === 'ladder' ? 'ladder' : kind === 'pole' ? 'wire' : 'string') + ' is the hypotenuse.'],
      [h * h, 'u6x-py-noroot', 'That is ' + t('h^{2}') + '. Take the square root to find ' + t('h') + '.'],
      [L - d, 'u6x-py-diff', 'Square the sides first: ' + t('h^{2}=' + nT(L) + '^{2}-' + nT(d) + '^{2}') + ', then take the square root.'],
      [L + d, 'u6x-py-sum', 'Use the Pythagorean theorem: the ' + (kind === 'ladder' ? 'ladder' : kind === 'pole' ? 'wire' : 'string') + ' is the hypotenuse, so ' + t('h^{2}=' + nT(L) + '^{2}-' + nT(d) + '^{2}') + '.']];
    return numPart(c.txt(L, d) + leanFig(kind, d, h, L), h, dl,
      'The ' + (kind === 'ladder' ? 'ladder' : kind === 'pole' ? 'wire' : 'string') + ' is the hypotenuse: ' + t('h^{2}+' + nT(d) + '^{2}=' + nT(L) + '^{2}') + ', so ' + t('h^{2}=' + nT(L * L) + '-' + nT(d * d) + '=' + nT(h * h)) + ' and ' + t('h=\\sqrt{' + nT(h * h) + '}=' + nT(h)) + ' m.',
      ['The slanted ' + (kind === 'ladder' ? 'ladder' : kind === 'pole' ? 'wire' : 'string') + ' is across from the right angle, so it is the hypotenuse ' + t('c') + '.', 'To find a leg, <b>subtract</b>: ' + t('h^{2}=c^{2}-a^{2}') + ', then take the square root.'], 'missing leg in context', { before: t('h='), after: 'm' });
  }
  var RIGHTS = [[5, 12, 13], [8, 15, 17], [9, 12, 15], [6, 8, 10], [12, 16, 20], [7, 24, 25], [20, 21, 29], [10, 24, 26], [15, 20, 25], [12, 35, 37]];
  var NOTS = [[6, 7, 9], [5, 6, 8], [7, 8, 11], [4, 5, 7], [8, 9, 12], [5, 9, 10], [6, 8, 11], [9, 10, 13], [10, 11, 15], [7, 9, 12], [6, 10, 12], [5, 12, 14], [8, 15, 18], [6, 8, 9], [9, 12, 16], [4, 6, 7], [11, 12, 16], [7, 10, 12]];
  function l1q3(r) { // added (Mastery): assignment Q15, sides 6, 7, 9 — is it a right triangle?
    var right = r.chance(0.5), tr = r.pick(right ? RIGHTS : NOTS), a = tr[0], b = tr[1], c = tr[2], shown = r.shuffle([a, b, c]), u = r.pick(['cm', 'm']);
    var S = a * a + b * b, C2 = c * c, want = right ? 'yes' : 'no';
    var c1 = numChk(S, [[2 * a + 2 * b, 'u6x-sq-double', t('a^{2}') + ' means ' + t('a\\times a') + ', not ' + t('2\\times a') + '.'], [C2 + a * a, 'u6x-conv-longest', t('c') + ' must be the <b>longest</b> side (the hypotenuse). Add the squares of the two <b>shorter</b> sides.'], [C2 + b * b, 'u6x-conv-longest', t('c') + ' must be the <b>longest</b> side (the hypotenuse). Add the squares of the two <b>shorter</b> sides.'], [a + b, 'u6x-py-sum', 'Square each of the two shorter sides, then add.']]);
    var c2 = numChk(C2, [[2 * c, 'u6x-sq-double', t('c^{2}') + ' means ' + t(c + '\\times' + c) + '.'], [a * a, 'u6x-conv-longest', t('c') + ' is the <b>longest</b> side.'], [b * b, 'u6x-conv-longest', t('c') + ' is the <b>longest</b> side.']]);
    var c3 = ynChk(want, 'u6x-conv-yesno', right ? 'The two sides of the equation are equal: ' + t(S + '=' + C2) + ', so the theorem holds — it <b>is</b> a right triangle.' : t(S + '\\ne' + C2) + ': the theorem does not hold, so it is <b>not</b> a right triangle.');
    var p = B.fields('A triangle has sides of length ' + t(shown[0]) + ' ' + u + ', ' + t(shown[1]) + ' ' + u + ' and ' + t(shown[2]) + ' ' + u + '. Use the Pythagorean theorem to decide whether it is a right triangle.',
      [{ label: t('a^{2}+b^{2}='), name: 'a² + b²', mode: 'number' }, { label: t('c^{2}='), name: 'c²', mode: 'number' }, { label: 'Right triangle?', name: 'Right triangle?', mode: 'text', placeholder: 'yes/no' }],
      [c1, c2, c3], [String(S), String(C2), want], t('a^{2}+b^{2}=' + S) + ', ' + t('c^{2}=' + C2) + ': <b>' + want + '</b>',
      'The hypotenuse would be the longest side, ' + t('c=' + c) + '. ' + t('a^{2}+b^{2}=' + a + '^{2}+' + b + '^{2}=' + a * a + '+' + b * b + '=' + S) + ' and ' + t('c^{2}=' + c + '^{2}=' + C2) + '.<br>' +
        (right ? 'They are equal, so the Pythagorean theorem holds: <b>yes</b>, it is a right triangle.' : 'Since ' + t(S + '\\ne' + C2) + ', the theorem does not hold: <b>no</b>, it is not a right triangle.'),
      ['Let ' + t('c') + ' be the <b>longest</b> side; ' + t('a') + ' and ' + t('b') + ' are the other two.', 'If ' + t('a^{2}+b^{2}') + ' equals ' + t('c^{2}') + ', it is a right triangle; if not, it isn’t.'], 'is it a right triangle');
    p.bad = [[String(2 * a + 2 * b), String(2 * c), want], [String(S), String(C2), right ? 'no' : 'yes']];
    return p;
  }
  HW.defineExit({ lesson: 'u6l1', calc: true, outcome: 'RF3',
    blurb: 'The Pythagorean theorem: a hypotenuse from two legs, a missing leg in context, and whether three sides make a right triangle.',
    questions: [Q(1, 'BEG', 'The hypotenuse.', l1q1), Q(2, 'PRG', 'A missing leg.', l1q2), Q(3, 'MAS', 'A right triangle?', l1q3)] });

  /* =====================================================================================================
   * Lesson 2 — Measuring the length of a horizontal or vertical line segment
   * ===================================================================================================== */
  function l2q1(r) { // Ryan: P(2, −3), Q(2, 4) → 7 · P(−2, 2), Q(4, 2) → 6
    var s = pickWhere(function () { return { vert: r.chance(0.5), c: r.pick(nz(-5, 5)), lo: r.int(-5, -1), hi: r.int(1, 5), sw: r.chance(0.5) }; }, function (s) { return s.hi - s.lo >= 4 && s.hi + s.lo !== 0; });
    var len = s.hi - s.lo, P0 = s.vert ? [s.c, s.lo] : [s.lo, s.c], Q0 = s.vert ? [s.c, s.hi] : [s.hi, s.c];
    if (s.sw) { var tmp = P0; P0 = Q0; Q0 = tmp; }
    var v = s.vert ? 'y' : 'x', i = s.vert ? 1 : 0;
    var dl = [[Math.abs(s.hi + s.lo), 'u6x-len-dropneg', 'One endpoint has a <b>negative</b> ' + t(v) + '-coordinate. Subtracting a negative adds: ' + t(subT(Q0[i], P0[i])) + '. Or count the squares across the axis.'],
      [len + 1, 'u6x-len-points', 'Count the <b>spaces</b> (units) between the endpoints, not the grid lines.'],
      [-len, 'u6x-len-neg', 'A length is never negative: take the absolute value of the difference.'],
      [0, 'u6x-len-same', 'Those coordinates are the same for both points. Subtract the coordinates that <b>change</b> (the ' + t(v) + '-coordinates).']];
    return numPart('Read the endpoints from the grid. What is the length of segment ' + t('PQ') + '?' + segFig(P0, Q0, 'PQ', { aria: 'segment PQ on a grid' }), len, dl,
      t('P' + ptT(P0)) + ' and ' + t('Q' + ptT(Q0)) + ' have the same ' + t(s.vert ? 'x' : 'y') + '-coordinate, so ' + t('PQ') + ' is ' + (s.vert ? 'vertical' : 'horizontal') + '.<br>' + t('PQ=|' + subT(Q0[i], P0[i]) + '|=' + len) + ' units.',
      ['Read both endpoints. Which coordinate is the same? The other one changes along the segment.', 'Length ' + t('=|' + v + '_2-' + v + '_1|') + ' — or count the squares from one endpoint to the other.'], 'length of a horizontal/vertical segment', { after: 'units' });
  }
  var RECT = ['WXYZ', 'ABCD', 'PQRS', 'EFGH', 'JKLM'];
  function l2q2(r) { // Ryan: W(−5, −2), X(6, −2), Y(6, 4), Z(−5, 4) → 34 · A(−4, −3) … D(−4, 2) → 28
    var s = pickWhere(function () { return { x1: r.int(-8, -2), x2: r.int(2, 9), y1: r.int(-6, -2), y2: r.int(2, 7), n: r.pick(RECT) }; }, function (s) { return s.x2 - s.x1 !== s.y2 - s.y1 && s.x2 + s.x1 !== 0 && s.y2 + s.y1 !== 0; });
    var w = s.x2 - s.x1, h = s.y2 - s.y1, n = s.n, V = [[s.x1, s.y1], [s.x2, s.y1], [s.x2, s.y2], [s.x1, s.y2]], P = 2 * w + 2 * h;
    var dl = [[w + h, 'u6x-per-half', 'That is only two of the four sides. A rectangle has two sides of each length: ' + t('P=2(' + w + ')+2(' + h + ')') + '.'],
      [w * h, 'u6x-per-area', 'That is the area (length × width). The perimeter is the distance <b>around</b>: add all four sides.'],
      [2 * Math.abs(s.x2 + s.x1) + 2 * h, 'u6x-per-sign', 'Check the horizontal side: ' + t(subT(s.x2, s.x1) + '=' + w) + ' (subtracting a negative adds).'],
      [2 * w + 2 * Math.abs(s.y2 + s.y1), 'u6x-per-sign', 'Check the vertical side: ' + t(subT(s.y2, s.y1) + '=' + h) + ' (subtracting a negative adds).']];
    return numPart('Rectangle ' + t(n) + ' has vertices ' + V.slice(0, 3).map(function (p, i) { return nw(t(n.charAt(i) + ptT(p))); }).join(', ') + ' and ' + nw(t(n.charAt(3) + ptT(V[3]))) + '. What is its perimeter?', P, dl,
      t(n.charAt(0) + n.charAt(1) + '=|' + subT(s.x2, s.x1) + '|=' + w) + ' (horizontal) and ' + t(n.charAt(1) + n.charAt(2) + '=|' + subT(s.y2, s.y1) + '|=' + h) + ' (vertical).<br>' + t('P=2(' + w + ')+2(' + h + ')=' + P) + ' units.',
      ['Find one horizontal side (same ' + t('y') + ': subtract the ' + t('x') + '-coordinates) and one vertical side (same ' + t('x') + ': subtract the ' + t('y') + '-coordinates).', 'The perimeter adds all four sides: two of each length.'], 'rectangle perimeter from vertices', { after: 'units' });
  }
  function l2q3(r) { // added (Mastery): assignment Q12 — C(−3, 5), D(x, 5), CD = 8 → x = 5 or x = −11
    var s = pickWhere(function () { return { horiz: r.chance(0.5), a: r.pick(nz(-8, 8)), b: r.pick(nz(-8, 8)), L: r.int(3, 12), n: r.pick([['C', 'D'], ['J', 'K'], ['E', 'F'], ['R', 'S']]) }; }, function (s) { return Math.abs(s.a) !== s.L && s.a !== s.b && Math.abs(s.a) !== Math.abs(s.b); });
    var v = s.horiz ? 'x' : 'y', a = s.horiz ? s.a : s.b, L = s.L, n = s.n, P0 = [s.a, s.b], vals = [a - L, a + L];
    var other = s.horiz ? n[1] + '(x,\\ ' + s.b + ')' : n[1] + '(' + s.a + ',\\ y)';
    return listPart('A ' + (s.horiz ? 'horizontal' : 'vertical') + ' segment ' + t(n[0] + n[1]) + ' has endpoints ' + t(n[0] + ptT(P0)) + ' and ' + t(other) + '. Its length is ' + t(L) + ' units. Determine <b>both</b> possible values of ' + t(v) + '.', vals,
      { v: v, dl: [[[L, -L], 'u6x-len-pm', 'You found the change, ' + t('\\pm' + L) + '. Now move that far from ' + t(n[0]) + ': start at ' + t(v + '=' + a) + '.'], [[-a - L, -a + L], 'u6x-len-sign', 'Check the sign: ' + t(n[0]) + ' has ' + t(v + '=' + a) + '. Count ' + t(L) + ' units both ways from there.']],
        missHint: 'That value works — but ' + t(n[1]) + ' could also be ' + t(L) + ' units on the <b>other</b> side of ' + t(n[0]) + '.' },
      t(n[1]) + ' is ' + t(L) + ' units ' + (s.horiz ? 'to the left or right of ' : 'below or above ') + t(n[0]) + ', so ' + t(v + '=' + a + '-' + L + '=' + (a - L)) + ' or ' + t(v + '=' + a + '+' + L + '=' + (a + L)) + '.<br>Check: ' + t('|' + subT(a + L, a) + '|=' + L) + ' and ' + t('|' + subT(a - L, a) + '|=' + L) + ' ✓',
      ['Sketch it: the segment is ' + (s.horiz ? 'horizontal, so only ' + t('x') + ' changes' : 'vertical, so only ' + t('y') + ' changes') + '.', t(n[1]) + ' can be on either side of ' + t(n[0]) + ': add the length, and subtract it.'], 'both endpoints at a given length');
  }
  HW.defineExit({ lesson: 'u6l2', calc: true, outcome: 'RF3',
    blurb: 'Lengths of horizontal and vertical segments: from a grid, the perimeter of a rectangle, and both endpoints at a given length.',
    questions: [Q(1, 'BEG', 'A length from the grid.', l2q1), Q(2, 'PRG', 'A perimeter.', l2q2), Q(3, 'MAS', 'A missing endpoint.', l2q3)] });

  /* =====================================================================================================
   * Lesson 3 — Diagonal segments and the distance formula
   * ===================================================================================================== */
  var RR = [[6, 4], [5, 5], [6, 3], [6, 2], [4, 2], [3, 3], [2, 2], [4, 4], [6, 6], [8, 4], [7, 7], [8, 2]];
  function lenShared(r, lim) { // a diagonal segment whose length is a mixed radical (Ryan: A(−3, −1), B(3, 3) · A(−3, 2), B(2, −3))
    return pickWhere(function () {
      var rr = r.pick(RR), sw = r.chance(0.5), run = sw ? rr[1] : rr[0], rise = (sw ? rr[0] : rr[1]) * (r.chance(0.5) ? 1 : -1);
      var A = [r.int(-lim, lim - run), r.int(-lim, lim)], Bp = [A[0] + run, A[1] + rise];
      if (r.chance(0.5)) { var tmp = A; A = Bp; Bp = tmp; }
      return { A: A, Bp: Bp };
    }, function (s) { var A = s.A, Bp = s.Bp; return Math.abs(Bp[1]) <= lim && Math.abs(A[1]) <= lim && (A[0] < 0 || Bp[0] < 0) && (A[1] < 0 || Bp[1] < 0) && A.concat(Bp).every(function (c) { return c !== 0; }); });
  }
  function lenPart(nm, A, Bp, fig) {
    var run = Bp[0] - A[0], rise = Bp[1] - A[1], d2 = run * run + rise * rise, sp = simp(d2), V = Math.sqrt(d2);
    var runS = (A[0] < 0 || Bp[0] < 0) ? Bp[0] + A[0] : null, riseS = (A[1] < 0 || Bp[1] < 0) ? Bp[1] + A[1] : null;
    var W = [[Math.abs(run) + Math.abs(rise), 'u6x-d-legs', 'You added the run and the rise. The segment is the <b>hypotenuse</b> of a right triangle: square the run and the rise, add, then take the square root.'],
      [d2, 'u6x-d-noroot', 'That is ' + t('d^{2}') + ' — take the square root, then simplify the radical.'],
      [Math.sqrt(Math.abs(run * run - rise * rise)), 'u6x-d-subsq', 'Add the squares of the run and the rise — don’t subtract them.']];
    if (runS != null && Math.abs(runS) !== Math.abs(run)) W.push([Math.sqrt(runS * runS + rise * rise), 'u6x-d-sign', 'Check the run: ' + t(subT(Bp[0], A[0]) + '=' + run) + ' (subtracting a negative adds).']);
    if (riseS != null && Math.abs(riseS) !== Math.abs(rise)) W.push([Math.sqrt(run * run + riseS * riseS), 'u6x-d-sign', 'Check the rise: ' + t(subT(Bp[1], A[1]) + '=' + rise) + ' (subtracting a negative adds).']);
    W = W.filter(function (w) { return w[0] > 0 && Math.abs(w[0] - V) > 1e-6; });
    var base = K.radical({ k: sp[0], n: 2, m: sp[1] }, 'mixed', { diag: function (v) { for (var i = 0; i < W.length; i++) if (Math.abs(v - W[i][0]) < 1e-6) return { code: W[i][1], hint: W[i][2] }; return null; } });
    var check = function (resp) {
      var res = base(String(resp == null ? '' : resp).replace(/^\s*[a-zA-Z]{1,2}\s*=\s*/, ''));
      if (res.v === 'form' && res.code === 'unchanged') return form('not-simplest', 'Right value — now simplify the radical: ' + t('\\sqrt{' + d2 + '}=\\sqrt{' + sp[0] * sp[0] + '\\times' + sp[1] + '}') + '. Take out the largest perfect square factor.');
      return res;
    };
    var key = radT(d2);
    return { prompt: 'Read the endpoints from the grid. Find the exact length of ' + t(nm) + ' as a mixed radical in simplest form.' + fig, input: { type: 'math', keys: 'radical', before: t(nm + '='), placeholder: 'e.g. 2√13' }, check: check, key: key, answer: t(nm + '=' + key),
      solution: t(nm.charAt(0) + ptT(A)) + ', ' + t(nm.charAt(1) + ptT(Bp)) + ': run ' + t('=' + subT(Bp[0], A[0]) + '=' + run) + ', rise ' + t('=' + subT(Bp[1], A[1]) + '=' + rise) + '.<br>' +
        t(nm + '=\\sqrt{' + sgp(run) + '^{2}+' + sgp(rise) + '^{2}}=\\sqrt{' + run * run + '+' + rise * rise + '}=\\sqrt{' + d2 + '}=\\sqrt{' + sp[0] * sp[0] + '\\times' + sp[1] + '}=' + key),
      hints: ['Read both endpoints. Run ' + t('=x_2-x_1') + ', rise ' + t('=y_2-y_1') + '; then ' + t('d=\\sqrt{\\text{run}^{2}+\\text{rise}^{2}}') + '.', 'Simplify: find the largest perfect square factor under the root (4, 9, 16, 25, 36, 49 …) and take its square root out front.'],
      text: 'exact length from a grid', bad: W.map(function (w) { return Math.abs(w[0] - Math.round(w[0])) < 1e-9 ? String(Math.round(w[0])) : radT(Math.round(w[0] * w[0])); }).concat(['\\sqrt{' + d2 + '}']) };
  }
  function l3q1(r) { var s = lenShared(r, 5); return lenPart('AB', s.A, s.Bp, segFig(s.A, s.Bp, 'AB', { aria: 'segment AB on a grid' })); }
  var MAPS = [{ map: 'a park map', a: 'the picnic shelter', b: 'the swimming dock' }, { map: 'a trail map', a: 'the trailhead', b: 'the lookout' }, { map: 'a campground map', a: 'the campsite', b: 'the boat launch' }, { map: 'a town map', a: 'the school', b: 'the library' }];
  function l3q2(r) { // Ryan: (1, 2) to (7, 10), 25 m per unit → 250 · (2, 1) to (11, 13), 20 m → 300
    var s = pickWhere(function () { var tr = r.pick([[6, 8, 10], [8, 6, 10], [9, 12, 15], [12, 9, 15], [5, 12, 13], [12, 5, 13], [3, 4, 5], [4, 3, 5], [8, 15, 17], [15, 8, 17]]), A = [r.int(0, 6), r.int(0, 6)]; return { tr: tr, A: A, Bp: [A[0] + tr[0], A[1] + tr[1]], sc: r.pick([10, 20, 25, 40, 50]), c: r.pick(MAPS) }; }, function (s) { return s.Bp[0] <= 20 && s.Bp[1] <= 20; });
    var run = s.tr[0], rise = s.tr[1], d = s.tr[2], sc = s.sc, ans = d * sc;
    return numPart('On ' + s.c.map + ', ' + s.c.a + ' is at ' + t(ptT(s.A)) + ' and ' + s.c.b + ' is at ' + t(ptT(s.Bp)) + '. Each grid unit is ' + t(sc) + ' m. How far apart are they, in metres?', ans,
      [[d, 'u6x-sc-noscale', 'That is the distance in grid units. Each unit is ' + t(sc) + ' m: multiply by ' + t(sc) + '.'], [(run + rise) * sc, 'u6x-d-legs', 'You added the run and the rise. Use the distance formula: square them, add, and take the square root.'], [d * d * sc, 'u6x-d-noroot', 'Take the square root of ' + t(d * d) + ' before you multiply by the scale.'], [d * d, 'u6x-d-noroot', 'Take the square root of ' + t(d * d) + ', then multiply by the scale.']],
      'Run ' + t('=' + s.Bp[0] + '-' + s.A[0] + '=' + run) + ', rise ' + t('=' + s.Bp[1] + '-' + s.A[1] + '=' + rise) + ': ' + t('d=\\sqrt{' + run + '^{2}+' + rise + '^{2}}=\\sqrt{' + run * run + '+' + rise * rise + '}=\\sqrt{' + d * d + '}=' + d) + ' units.<br>' + t(d + '\\times' + sc + '=' + F(ans)) + ' m.',
      ['First find the distance in grid units with the distance formula.', 'Then change units to metres: multiply by the scale, ' + t(sc) + ' m per unit.'], 'map distance with a scale', { after: 'm' });
  }
  HW.defineExit({ lesson: 'u6l3', calc: true, outcome: 'RF3',
    blurb: 'The distance formula: an exact length as a mixed radical from a grid, and a distance on a map with a scale.',
    questions: [Q(1, 'PRG', 'An exact length.', l3q1), Q(2, 'MAS', 'A distance on a map.', l3q2)] });

  /* =====================================================================================================
   * Lesson 4 — The midpoint formula
   * ===================================================================================================== */
  var HM = ['Midpoint formula: ' + t('M\\left(\\dfrac{x_1+x_2}{2},\\ \\dfrac{y_1+y_2}{2}\\right)') + ' — average the ' + t('x') + '-coordinates and average the ' + t('y') + '-coordinates.',
    'Add the coordinates (don’t subtract), then divide each sum by ' + t('2') + '.'];
  function mLine(p, q, name) {
    return (name ? name + '=' : '') + '\\left(\\dfrac{' + nT(p[0]) + '+' + sgp(q[0]) + '}{2},\\ \\dfrac{' + nT(p[1]) + '+' + sgp(q[1]) + '}{2}\\right)=\\left(\\dfrac{' + nT(p[0] + q[0]) + '}{2},\\ \\dfrac{' + nT(p[1] + q[1]) + '}{2}\\right)=' + ptT(mid(p, q));
  }
  function midDl(a, b) {
    var h = [cl((b[0] - a[0]) / 2), cl((b[1] - a[1]) / 2)], hs = 'You subtracted the coordinates. The midpoint formula <b>adds</b> them and divides by ' + t('2') + '.';
    return [[add(a, b), 'u6x-mid-nohalf', 'You added the coordinates — now divide each sum by ' + t('2') + '.'], [h, 'u6x-mid-sub', hs], [scl(h, -1), 'u6x-mid-sub', hs],
      [[cl((a[0] + a[1]) / 2), cl((b[0] + b[1]) / 2)], 'u6x-mid-own', 'Average the two <b>' + t('x') + '-coordinates</b> together, and the two <b>' + t('y') + '-coordinates</b> together — not each point’s own ' + t('x') + ' and ' + t('y') + '.']];
  }
  function l4q1(r) { // Ryan: A(−5, 4), B(3, −2) → (−1, 1) · A(−6, 1), B(2, −3) → (−2, −1)
    var s = pickWhere(function () { return { A: [r.int(-6, 6), r.int(-5, 5)], Bp: [r.int(-6, 6), r.int(-5, 5)] }; }, function (s) {
      var A = s.A, Bp = s.Bp; return A[0] * Bp[0] < 0 && A[1] * Bp[1] < 0 && (A[0] + Bp[0]) % 2 === 0 && (A[1] + Bp[1]) % 2 === 0 && Math.abs(A[0] - Bp[0]) >= 4 && Math.abs(A[1] - Bp[1]) >= 4 && A[0] + Bp[0] !== 0 && A[1] + Bp[1] !== 0; });
    var A = s.A, Bp = s.Bp, M = mid(A, Bp);
    return ptPart('Read the endpoints from the grid. Find the midpoint of ' + t('AB') + '. Type it as an ordered pair.' + segFig(A, Bp, 'AB', { aria: 'segment AB on a grid' }), M, { dl: midDl(A, Bp), before: t('M=') },
      t('A' + ptT(A)) + ', ' + t('B' + ptT(Bp)) + ':<br>' + t(mLine(A, Bp, 'M')) + '.', HM, 'midpoint from a grid');
  }
  var TOWNS = [['Fairview', 'Oakdale'], ['Hillcrest', 'Lakeview'], ['Riverside', 'Pinecrest'], ['Maple Ridge', 'Cedarville'], ['Brookfield', 'Elmwood']];
  var FAC = ['a rest area', 'a gas station', 'a picnic site', 'a bus shelter', 'a fire lookout'];
  function l4q2(r) { // Ryan: Fairview (−14, 20), Oakdale (30, −6) → (8, 7) · Hillcrest (−18, 12), Lakeview (24, −20) → (3, −4)
    var s = pickWhere(function () { return { A: [r.int(-20, -6), r.int(6, 24)], Bp: [r.int(10, 32), r.int(-22, -4)], fl: r.chance(0.5), n: r.pick(TOWNS), f: r.pick(FAC) }; }, function (s) {
      var A = s.A, Bp = s.Bp; return (A[0] + Bp[0]) % 2 === 0 && (A[1] + Bp[1]) % 2 === 0 && A[0] + Bp[0] !== 0 && A[1] + Bp[1] !== 0 && Math.abs(A[0] + Bp[0]) !== Math.abs(A[1] + Bp[1]); });
    var A = s.A, Bp = s.Bp; if (s.fl) { A = [A[0], -A[1]]; Bp = [Bp[0], -Bp[1]]; }
    var M = mid(A, Bp), n = s.n;
    return ptPart('On a map, ' + n[0] + ' is at ' + t(ptT(A)) + ' and ' + n[1] + ' is at ' + t(ptT(Bp)) + '. ' + s.f.charAt(0).toUpperCase() + s.f.slice(1) + ' will be built exactly halfway between the towns. Find its coordinates.', M, { dl: midDl(A, Bp) },
      'Exactly halfway is the midpoint: ' + t(mLine(A, Bp)) + '.', HM, 'midpoint in context');
  }
  var HOUSES = [['Jasmine', 'Tyler'], ['Aisha', 'Marcus'], ['Leah', 'Sam'], ['Priya', 'Noah'], ['Mei', 'Jordan']];
  function dirW(p) { return t(Math.abs(p[0])) + ' blocks ' + (p[0] > 0 ? 'east' : 'west') + ' and ' + t(Math.abs(p[1])) + ' blocks ' + (p[1] > 0 ? 'north' : 'south'); }
  function l4q3(r) { // added (Mastery): assignment Q9 — 6 E 10 N and 8 W 2 S of the community centre → (−1, 4)
    var s = pickWhere(function () { return { A: [r.pick(nz(-12, 12)), r.pick(nz(-12, 12))], Bp: [r.pick(nz(-12, 12)), r.pick(nz(-12, 12))], n: r.pick(HOUSES) }; }, function (s) {
      var A = s.A, Bp = s.Bp; return A[0] * Bp[0] < 0 && A[1] * Bp[1] < 0 && (A[0] + Bp[0]) % 2 === 0 && (A[1] + Bp[1]) % 2 === 0 && A[0] + Bp[0] !== 0 && A[1] + Bp[1] !== 0 && Math.abs(A[0] + Bp[0]) !== Math.abs(A[1] + Bp[1]) && Math.abs(A[0]) >= 2 && Math.abs(Bp[0]) >= 2 && Math.abs(A[1]) >= 2 && Math.abs(Bp[1]) >= 2; });
    var A = s.A, Bp = s.Bp, n = s.n, M = mid(A, Bp), Aa = [Math.abs(A[0]), Math.abs(A[1])], Ba = [Math.abs(Bp[0]), Math.abs(Bp[1])];
    var dl = [[mid(Aa, Ba), 'u6x-dir-sign', 'With the community centre at the origin, <b>west</b> and <b>south</b> are negative: ' + n[0] + ' is at ' + t(ptT(A)) + ' and ' + n[1] + ' at ' + t(ptT(Bp)) + '.']].concat(midDl(A, Bp));
    return ptPart(n[0] + '’s house is ' + dirW(A) + ' of the community centre. ' + n[1] + '’s house is ' + dirW(Bp) + ' of it. Using the community centre as the origin (east and north positive), find the point exactly halfway between their houses.', M, { dl: dl },
      'East/north are positive, west/south negative: ' + t(n[0].charAt(0) + ptT(A)) + ' and ' + t(n[1].charAt(0) + ptT(Bp)) + '.<br>' + t(mLine(A, Bp, 'M')) + '.',
      ['Write each house as a point: east is ' + t('+x') + ', west is ' + t('-x') + ', north is ' + t('+y') + ', south is ' + t('-y') + '.', 'Then use the midpoint formula: average the ' + t('x') + '-coordinates and the ' + t('y') + '-coordinates.'], 'midpoint from directions');
  }
  HW.defineExit({ lesson: 'u6l4', calc: true, outcome: 'RF3',
    blurb: 'The midpoint formula: from a grid, halfway between two towns, and halfway between two houses given by directions.',
    questions: [Q(1, 'BEG', 'A midpoint from the grid.', l4q1), Q(2, 'PRG', 'Halfway between two towns.', l4q2), Q(3, 'MAS', 'Halfway between two houses.', l4q3)] });

  /* =====================================================================================================
   * Lesson 5 — Applications: distance, midpoint, and finding a missing endpoint
   * ===================================================================================================== */
  var HE = ['If ' + t('M') + ' is the midpoint of ' + t('AB') + ', then ' + t('x_B=2x_M-x_A') + ' and ' + t('y_B=2y_M-y_A') + ': <b>double the midpoint, then subtract the endpoint you have</b>.',
    'The missing endpoint is past the midpoint: the step from ' + t('A') + ' to ' + t('M') + ' is repeated from ' + t('M') + ' to ' + t('B') + '.'];
  function endDl(a, m, na, nb) {
    na = na || 'A'; nb = nb || 'B';
    return [[mid(a, m), 'u6x-end-avg', 'You found the point halfway between ' + t(na) + ' and ' + t('M') + '. The missing endpoint is <i>past</i> the midpoint: double the midpoint, then subtract the endpoint.'],
      [sub(m, a), 'u6x-end-step', 'That is the step from the endpoint to the midpoint. Double the midpoint first, then subtract: ' + t('x_' + nb + '=2x_M-x_' + na) + '.'],
      [sub(scl(a, 2), m), 'u6x-end-dblA', 'Double the <b>midpoint</b> (not the endpoint), then subtract the endpoint.'],
      [add(scl(m, 2), a), 'u6x-end-addA', 'Double the midpoint, then <b>subtract</b> the endpoint — watch the signs.']];
  }
  function endSol(A, M, Bp, na, nb) {
    na = na || 'A'; nb = nb || 'B';
    return t('x_{' + nb + '}=2(' + nT(M[0]) + ')-' + sgp(A[0]) + '=' + nT(Bp[0])) + ', ' + t('y_{' + nb + '}=2(' + nT(M[1]) + ')-' + sgp(A[1]) + '=' + nT(Bp[1])) + ', so ' + t(nb + ptT(Bp)) + '.<br>Check: ' + t(mLine(A, Bp)) + ' ✓';
  }
  function l5q1(r) { // Ryan: A(−4, −2), M(1, 1) → B(6, 4) · A(−5, 3), M(−1, 1) → B(3, −1)
    var s = pickWhere(function () { var A = [r.int(-6, 3), r.int(-5, 5)], st = [r.pick(nz(-5, 5)), r.pick(nz(-4, 4))]; return { A: A, M: add(A, st), st: st }; }, function (s) {
      var A = s.A, M = s.M; return Math.abs(M[0]) <= 5 && Math.abs(M[1]) <= 5 && (A[0] < 0 || A[1] < 0) && Math.abs(s.st[0]) + Math.abs(s.st[1]) >= 4 && M[0] !== 0 && M[1] !== 0 && A[0] !== 0 && A[1] !== 0; });
    var A = s.A, M = s.M, Bp = sub(scl(M, 2), A);
    return ptPart(t('M') + ' is the midpoint of segment ' + t('AB') + '. Read ' + t('A') + ' and ' + t('M') + ' from the grid, then find the endpoint ' + t('B') + '. Type it as an ordered pair.' + gridFig([A, M], ['A', 'M'], { segs: [[0, 1]], away: [M, A], aria: 'point A and midpoint M on a grid' }), Bp, { dl: endDl(A, M), before: t('B=') },
      t('A' + ptT(A)) + ', ' + t('M' + ptT(M)) + '.<br>' + endSol(A, M, Bp), HE, 'missing endpoint from a grid');
  }
  var PATHS = [{ p: 'A hiking trail', m: 'The rest bench at its midpoint', w: 'trail' }, { p: 'A bike path', m: 'The water fountain at its midpoint', w: 'path' }, { p: 'A straight canal', m: 'A lock at its midpoint', w: 'canal' }, { p: 'A zip line', m: 'A rest platform at its midpoint', w: 'zip line' }];
  function l5q2(r) { // Ryan: A(3, 2), M(6, 6), 40 m per unit → 400 · A(1, 3), M(4, 7), 50 m → 500
    var c = r.pick(PATHS), st = r.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]), A = [r.int(0, 6), r.int(0, 6)], M = add(A, st), Bp = sub(scl(M, 2), A), sc = r.pick([10, 20, 25, 40, 50]);
    var am = Math.hypot(st[0], st[1]), ab = 2 * am, ans = ab * sc;
    return numPart(c.p + ' starts at ' + t('A' + ptT(A)) + '. ' + c.m + ' is ' + t('M' + ptT(M)) + '. Each grid unit is ' + t(sc) + ' m. How long is the whole ' + c.w + ', from ' + t('A') + ' to the far end ' + t('B') + ', in metres?', ans,
      [[am * sc, 'u6x-end-half', 'That is the length from ' + t('A') + ' to the midpoint — only half of the ' + c.w + '.'], [ab, 'u6x-sc-noscale', 'That is the length in grid units. Multiply by the scale, ' + t(sc) + ' m per unit.'], [2 * (st[0] + st[1]) * sc, 'u6x-d-legs', 'You added the run and the rise. Use the distance formula: square them, add, and take the square root.'], [ab * ab * sc, 'u6x-d-noroot', 'Take the square root of ' + t(ab * ab) + ' before you multiply by the scale.']],
      'Far end: ' + t('B=(2(' + M[0] + ')-' + A[0] + ',\\ 2(' + M[1] + ')-' + A[1] + ')=' + ptT(Bp)) + '.<br>' + t('AB=\\sqrt{' + 2 * st[0] + '^{2}+' + 2 * st[1] + '^{2}}=\\sqrt{' + ab * ab + '}=' + ab) + ' units, and ' + t(ab + '\\times' + sc + '=' + F(ans)) + ' m.<br>(Or: ' + t('AM=' + am) + ' units is half of it, so ' + t('AB=2\\times' + am + '=' + ab) + '.)',
      ['Find the far end ' + t('B') + ' first: double the midpoint and subtract ' + t('A') + '.', 'Then use the distance formula for ' + t('AB') + ' and multiply by the scale.'], 'missing endpoint and distance with a scale', { after: 'm' });
  }
  HW.defineExit({ lesson: 'u6l5', calc: true, outcome: 'RF3',
    blurb: 'Running the midpoint formula backward for a missing endpoint, then the length of a whole trail on a map.',
    questions: [Q(1, 'PRG', 'A missing endpoint.', l5q1), Q(2, 'MAS', 'The whole trail.', l5q2)] });

  /* =====================================================================================================
   * Lesson 6 — Rise over run: the slope of a line segment (every slope here is positive)
   * ===================================================================================================== */
  var HSL = ['Slope ' + t('m=\\dfrac{\\text{rise}}{\\text{run}}') + ': the vertical change on top, the horizontal change on the bottom.', 'Count the squares (spaces) up and across, then reduce the fraction if you can.'];
  function gridSlopeDiag(P0, Q0) {
    var rise = Q0[1] - P0[1], run = Q0[0] - P0[0], W = [];
    W.push([(rise + Math.sign(rise)) / (run + 1), 'u6x-sl-points', 'Count the <b>spaces</b> between the grid lines, not the grid lines (points) themselves.']);
    if ((P0[0] < 0) !== (Q0[0] < 0) && Q0[0] + P0[0] !== 0) W.push([rise / (Q0[0] + P0[0]), 'u6x-sl-runsign', 'Check the run: the segment crosses the ' + t('y') + '-axis, so the run is ' + t(subT(Q0[0], P0[0]) + '=' + run) + '.']);
    if ((P0[1] < 0) !== (Q0[1] < 0) && Q0[1] + P0[1] !== 0) W.push([(Q0[1] + P0[1]) / run, 'u6x-sl-risesign', 'Check the rise: the segment crosses the ' + t('x') + '-axis, so the rise is ' + t(subT(Q0[1], P0[1]) + '=' + rise) + '.']);
    var mv = rise / run; W = W.filter(function (w) { return isFinite(w[0]) && !near(w[0], mv) && !near(w[0], -mv) && !near(w[0], 1 / mv); });
    return { W: W, diag: function (v) { for (var i = 0; i < W.length; i++) if (near(v, W[i][0])) return { code: W[i][1], hint: W[i][2] }; return null; } };
  }
  function l6q1(r) { // Ryan: P(−2, −3), Q(4, 1) → 2/3 · P(−2, −2), Q(3, 2) → 4/5
    var s = pickWhere(function () { var P0 = [r.int(-5, -1), r.int(-5, -1)], rise = r.int(2, 6), run = r.int(2, 7); return { P0: P0, Q0: [P0[0] + run, P0[1] + rise] }; }, function (s) { var Q0 = s.Q0, P0 = s.P0; return Q0[0] <= 5 && Q0[1] <= 5 && Q0[0] - P0[0] !== Q0[1] - P0[1] && Q0[0] !== 0 && Q0[1] !== 0; });
    var P0 = s.P0, Q0 = s.Q0, rise = Q0[1] - P0[1], run = Q0[0] - P0[0], sl = red(rise, run), D = gridSlopeDiag(P0, Q0);
    return slopePart('Count the rise and the run on the grid. What is the slope of segment ' + t('PQ') + '?' + segFig(P0, Q0, 'PQ', { aria: 'segment PQ on a grid' }), sl, D.diag,
      [slT(red(run, rise))].concat(D.W.map(function (w) { var f = LN.toFr(w[0]); return frT(f[0], f[1]); })),
      'From ' + t('P' + ptT(P0)) + ' to ' + t('Q' + ptT(Q0)) + ': ' + t(rise) + ' up (rise ' + t(rise) + ') and ' + t(run) + ' right (run ' + t(run) + ').<br>' + t('m=\\dfrac{\\text{rise}}{\\text{run}}=' + fracSteps(rise, run)) + '.', HSL, 'slope from a grid');
  }
  function l6q2(r) { // Ryan: R(−5, −7), S(3, −1) → 3/4 · R(−4, −6), S(2, −2) → 2/3
    var s = pickWhere(function () { var R0 = [r.int(-8, -2), r.int(-9, -3)], run = r.int(3, 10), rise = r.int(2, 9); return { R0: R0, S0: [R0[0] + run, R0[1] + rise] }; }, function (s) {
      var R0 = s.R0, S0 = s.S0, run = S0[0] - R0[0], rise = S0[1] - R0[1]; return run !== rise && S0[0] > 0 && S0[0] + R0[0] !== 0 && S0[1] <= 2 && S0[1] !== 0 && S0[1] + R0[1] !== 0; });
    var R0 = s.R0, S0 = s.S0, rise = S0[1] - R0[1], run = S0[0] - R0[0], sl = red(rise, run), mv = rise / run;
    var W = [[(S0[1] + R0[1]) / run, 'u6x-sl-risesign', 'Check the top: ' + t(subT(S0[1], R0[1]) + '=' + rise) + ' (subtracting a negative adds).'], [rise / (S0[0] + R0[0]), 'u6x-sl-runsign', 'Check the bottom: ' + t(subT(S0[0], R0[0]) + '=' + run) + ' (subtracting a negative adds).']]
      .filter(function (w) { return isFinite(w[0]) && !near(w[0], mv) && !near(w[0], -mv) && !near(w[0], 1 / mv); });
    return slopePart('Find the slope of the segment joining ' + t('R' + ptT(R0)) + ' and ' + t('S' + ptT(S0)) + '.', sl, function (v) { for (var i = 0; i < W.length; i++) if (near(v, W[i][0])) return { code: W[i][1], hint: W[i][2] }; return null; },
      [slT(red(run, rise)), slT(red(-rise, run))].concat(W.map(function (w) { var f = LN.toFr(w[0]); return frT(f[0], f[1]); })),
      t('m=\\dfrac{y_2-y_1}{x_2-x_1}=' + formulaT(R0, S0) + '=' + fracSteps(rise, run)) + '.',
      ['Use ' + t('m=\\dfrac{y_2-y_1}{x_2-x_1}') + ', subtracting in the <b>same order</b> on the top and the bottom.', 'Subtracting a negative means adding: ' + t('a-(-b)=a+b') + '.'], 'slope formula with negatives',
      { signHint: 'Check the sign: subtract in the <b>same order</b> on the top and the bottom. This segment rises from ' + t('R') + ' to ' + t('S') + ', so its slope is positive.' });
  }
  var HILLS = [{ w: 'A road', v: 'climbs', g: [5, 6, 8, 10, 12] }, { w: 'A bike trail', v: 'climbs', g: [4, 5, 8, 10, 15, 20] }, { w: 'A driveway', v: 'rises', g: [5, 8, 10, 12, 15] }, { w: 'A ski hill', v: 'rises', g: [15, 20, 25, 30, 40] }];
  function l6q3(r) { // added (Mastery): assignment Q6 — rises 50 m over 250 m → 1/5, or 20 %
    var c = r.pick(HILLS), s = pickWhere(function () { var g = r.pick(c.g), H = r.pick([100, 120, 150, 200, 240, 250, 300, 400, 500, 600, 800]); return { g: g, H: H, R: H * g / 100 }; }, function (s) { return s.R % 1 === 0; });
    var g = s.g, H = s.H, R = s.R, sl = red(R, H);
    var cg = numChk(g, [[R / H, 'u6x-pct-dec', 'That is the slope as a decimal. A percent is out of ' + t('100') + ': multiply by ' + t('100') + '.'], [100 * H / R, 'u6x-pct-flip', 'The grade is <b>rise over run</b> (times ' + t('100') + '), not run over rise.'], [H / R, 'u6x-pct-flip', 'The grade is rise over run, times ' + t('100') + '.']]);
    var p = B.fields(c.w + ' ' + c.v + ' ' + t(R) + ' m over a horizontal distance of ' + t(F(H)) + ' m. Determine its slope (grade) as a fraction in lowest terms, and also as a percent.',
      [{ label: 'Slope:', name: 'Slope', mode: 'math', keys: 'slope', placeholder: 'e.g. 1/5' }, { label: 'Grade:', name: 'Grade', mode: 'number', after: '%' }],
      [K.slope(sl), cg], [slT(sl), String(g)], 'Slope ' + t(slT(sl)) + ', grade ' + t(g + '\\%'),
      t('m=\\dfrac{\\text{rise}}{\\text{run}}=' + rawFr(R, H) + '=' + slT(sl)) + '.<br>As a percent: ' + t(slT(sl) + '\\times 100\\%=' + g + '\\%') + ' (it rises ' + t(g) + ' m for every ' + t('100') + ' m across).',
      ['The rise is the vertical climb, the run is the horizontal distance: ' + t('m=\\dfrac{\\text{rise}}{\\text{run}}') + '. Reduce the fraction.', 'For a percent, multiply the slope by ' + t('100') + '.'], 'grade as a fraction and a percent');
    p.bad = [[slT(red(H, R)), String(cl(100 * H / R))], [slT(sl), String(cl(R / H))]];
    return p;
  }
  HW.defineExit({ lesson: 'u6l6', calc: true, outcome: 'RF3',
    blurb: 'Rise over run: a slope from a grid, the slope formula with negative coordinates, and the grade of a hill as a fraction and a percent.',
    questions: [Q(1, 'BEG', 'Slope from the grid.', l6q1), Q(2, 'PRG', 'The slope formula.', l6q2), Q(3, 'MAS', 'The grade of a hill.', l6q3)] });

  /* =====================================================================================================
   * Lesson 7 — Types of slope: positive, negative, zero and undefined
   * ===================================================================================================== */
  function edgeLine(m, b, w) { // the part of y = mx + b inside [−w, w]²
    var pts = []; [-w, w].forEach(function (x) { var y = m * x + b; if (Math.abs(y) <= w + 1e-9) pts.push([x, y]); });
    [-w, w].forEach(function (y) { var x = (y - b) / m; if (Math.abs(x) <= w + 1e-9 && !pts.some(function (p) { return Math.abs(p[0] - x) < 1e-6 && Math.abs(p[1] - y) < 1e-6; })) pts.push([x, y]); });
    pts.sort(function (a, c) { return a[0] - c[0]; }); return [pts[0], pts[pts.length - 1]];
  }
  function miniG(seg, aria) { return HW.graph({ x: [-5, 5], y: [-5, 5], labels: 0, segs: [{ pts: seg, start: 'arrow', end: 'arrow' }], max: 140, aria: aria }); }
  function l7q1(r) { // Ryan: which graph shows a slope of zero (vertical, rising, horizontal, falling lines)
    var want = r.chance(0.7) ? 'zero' : 'und', w = 4.6;
    var kv = r.pick(nz(-3, 3)), kh = r.pick(nz(-3, 3)), mp = r.pick([0.5, 2 / 3, 1, 1.5, 2]), mn = -r.pick([0.5, 2 / 3, 1, 1.5, 2]);
    var gs = { und: miniG([[kv, -w], [kv, w]], 'a vertical line'), zero: miniG([[-w, kh], [w, kh]], 'a horizontal line'), pos: miniG(edgeLine(mp, r.int(-2, 2), w), 'a line rising to the right'), neg: miniG(edgeLine(mn, r.int(-2, 2), w), 'a line falling to the right') };
    var Z = 'A horizontal line has a rise of ' + t('0') + ', so ' + t('m=\\frac{0}{\\text{run}}=0') + '. A vertical line has a run of ' + t('0') + ', and you can’t divide by ' + t('0') + ': its slope is undefined.';
    var why = {
      und: want === 'zero' ? 'That line is vertical: its run is ' + t('0') + ', so its slope is <b>undefined</b>, not zero. ' + Z : null,
      zero: want === 'und' ? 'That line is horizontal: its rise is ' + t('0') + ', so its slope is <b>zero</b>, not undefined. ' + Z : null,
      pos: 'That line rises from left to right, so its slope is <b>positive</b>. ' + Z, neg: 'That line falls from left to right, so its slope is <b>negative</b>. ' + Z };
    var opts = ['und', 'pos', 'zero', 'neg'].map(function (k) { return { html: gs[k], right: k === want, why: why[k], code: k }; });
    var p = mc(r, 'Which graph shows a line with ' + (want === 'zero' ? 'a slope of <b>zero</b>' : 'an <b>undefined</b> slope') + '?', opts, Z,
      ['Zero slope: no rise at all (flat). Undefined slope: no run at all (straight up and down).', 'Positive slopes rise from left to right; negative slopes fall.'], 'which graph: ' + want + ' slope');
    p.input.columns = 2;
    return p;
  }
  function l7q2(r) { // Ryan: E(−3, 3), F(3, −1) → −2/3 · E(−3, 2), F(2, −1) → −3/5
    var s = pickWhere(function () { var E0 = [r.int(-5, -1), r.int(1, 5)], rise = -r.int(2, 6), run = r.int(2, 7); return { E0: E0, F0: [E0[0] + run, E0[1] + rise] }; }, function (s) { var F0 = s.F0, E0 = s.E0; return F0[0] <= 5 && F0[1] >= -5 && F0[0] - E0[0] !== E0[1] - F0[1] && F0[0] !== 0 && F0[1] !== 0; });
    var E0 = s.E0, F0 = s.F0, rise = F0[1] - E0[1], run = F0[0] - E0[0], sl = red(rise, run), mv = rise / run, D = gridSlopeDiag(E0, F0);
    var diag = function (v) { if (near(v, -1 / mv)) return { code: 'u6x-sl-flip-sign', hint: 'Two things: slope is <b>rise over run</b>, and this segment falls from left to right, so its slope is <b>negative</b>.' }; return D.diag(v); };
    return slopePart('Count the rise and the run on the grid. What is the slope of segment ' + t('EF') + '?' + segFig(E0, F0, 'EF', { aria: 'segment EF on a grid' }), sl, diag,
      [slT(red(-rise, run)), slT(red(run, rise)), slT(red(-run, rise))],
      'From ' + t('E' + ptT(E0)) + ' to ' + t('F' + ptT(F0)) + ': ' + t(-rise) + ' down (rise ' + t(rise) + ') and ' + t(run) + ' right (run ' + t(run) + ').<br>' + t('m=\\dfrac{' + rise + '}{' + run + '}' + (slT(sl) === '\\frac{' + rise + '}{' + run + '}' ? '' : '=' + slT(sl))) + ' — the segment falls from left to right, so the slope is negative.',
      ['Count down from ' + t('E') + ' to the level of ' + t('F') + ' (down is a negative rise), then across to ' + t('F') + '.', 'A segment that falls from left to right has a negative slope.'], 'negative slope from a grid',
      { signHint: 'Check the sign: the segment falls from left to right, so its slope is <b>negative</b> (the rise is down).' });
  }
  function l7q3(r) { // Ryan: (4, −3) and (4, 6) → undefined · (−2, 5) and (6, 5) → zero
    var vert = r.chance(0.5), c = r.pick(nz(-7, 7)), a = r.int(-8, -1), b = r.int(1, 9), P0 = vert ? [c, a] : [a, c], Q0 = vert ? [c, b] : [b, c];
    if (r.chance(0.5)) { var tmp = P0; P0 = Q0; Q0 = tmp; }
    var ans = vert ? 'Undefined' : 'Zero', m = vert ? t('m=' + formulaT(P0, Q0) + '=\\frac{' + (Q0[1] - P0[1]) + '}{0}') : t('m=' + formulaT(P0, Q0) + '=\\frac{0}{' + (Q0[0] - P0[0]) + '}=0');
    var expl = vert ? 'Both ' + t('x') + '-coordinates are ' + t(c) + ', so the segment is vertical: ' + m + ', and you can’t divide by ' + t('0') + '. The slope is <b>undefined</b>.' : 'Both ' + t('y') + '-coordinates are ' + t(c) + ', so the segment is horizontal: ' + m + '. The slope is <b>zero</b>.';
    var opts = [{ html: 'Positive', right: false, why: (vert ? 'The ' + t('y') + '-values do increase, but the run is ' + t('0') + '. ' : 'Positive coordinates don’t make a positive slope. ') + expl, code: 'pos' },
      { html: 'Negative', right: false, why: 'A negative coordinate doesn’t make the slope negative. ' + expl, code: 'neg' },
      { html: 'Zero', right: !vert, why: vert ? 'Zero slope is a horizontal segment (rise ' + t('0') + '). ' + expl : null, code: 'zero' },
      { html: 'Undefined', right: vert, why: vert ? null : 'Undefined slope is a vertical segment (run ' + t('0') + '). ' + expl, code: 'und' }];
    return mc(r, 'What type of slope does the segment joining ' + t(ptT(P0)) + ' and ' + t(ptT(Q0)) + ' have?', opts, expl,
      ['Compare the coordinates: if the ' + t('x') + '-values are equal the segment is vertical; if the ' + t('y') + '-values are equal it is horizontal.', 'Horizontal: rise ' + t('0') + ', slope ' + t('0') + '. Vertical: run ' + t('0') + ', slope undefined.'], 'type of slope from two points', true);
  }
  function l7q4(r) { // added (Mastery): the missing coordinates that make a slope zero and undefined (assignment Q7, Q14, Q15 run backward)
    var s = pickWhere(function () { return { A: [r.pick(nz(-8, 8)), r.pick(nz(-8, 8))], bx: r.pick(nz(-9, 9)), cy: r.pick(nz(-9, 9)) }; }, function (s) { return Math.abs(s.A[0]) !== Math.abs(s.A[1]) && s.bx !== s.A[0] && s.cy !== s.A[1] && s.bx !== s.A[1] && s.cy !== s.A[0]; });
    var A = s.A, k = A[1], h = A[0];
    var ck = numChk(k, [[A[0], 'u6x-zu-swap', 'A slope of zero is a <b>horizontal</b> segment: ' + t('A') + ' and ' + t('B') + ' need the same <b>' + t('y') + '-coordinate</b>.'], [0, 'u6x-zu-zero', 'A slope of ' + t('0') + ' means the rise is ' + t('0') + ': ' + t('B') + ' is at the same height as ' + t('A') + ', not on the axis.']]);
    var ch = numChk(h, [[A[1], 'u6x-zu-swap', 'An undefined slope is a <b>vertical</b> segment: ' + t('A') + ' and ' + t('C') + ' need the same <b>' + t('x') + '-coordinate</b>.'], [0, 'u6x-zu-zero', 'An undefined slope means the run is ' + t('0') + ': ' + t('C') + ' is straight above or below ' + t('A') + ', not on the axis.']]);
    var p = B.fields('Point ' + t('A' + ptT(A)) + ' is given. Find ' + t('k') + ' so that the segment from ' + t('A') + ' to ' + t('B(' + s.bx + ',\\ k)') + ' has a slope of <b>zero</b>, and ' + t('h') + ' so that the segment from ' + t('A') + ' to ' + t('C(h,\\ ' + s.cy + ')') + ' has an <b>undefined</b> slope.',
      [{ label: t('k='), name: 'k', mode: 'number' }, { label: t('h='), name: 'h', mode: 'number' }], [ck, ch], [String(k), String(h)], t('k=' + k) + ', ' + t('h=' + h),
      'Zero slope means a rise of ' + t('0') + ': ' + t('m_{AB}=\\dfrac{k-' + sgp(A[1]) + '}{' + s.bx + '-' + sgp(A[0]) + '}=0') + ' only when ' + t('k=' + k) + ' (a horizontal segment).<br>Undefined slope means a run of ' + t('0') + ': ' + t('m_{AC}=\\dfrac{' + s.cy + '-' + sgp(A[1]) + '}{h-' + sgp(A[0]) + '}') + ' has a zero denominator when ' + t('h=' + h) + ' (a vertical segment).',
      ['A slope of zero is horizontal: both points have the same ' + t('y') + '-coordinate.', 'An undefined slope is vertical: both points have the same ' + t('x') + '-coordinate.'], 'coordinates for a zero / undefined slope');
    p.bad = [[String(A[0]), String(A[1])], ['0', '0']];
    return p;
  }
  HW.defineExit({ lesson: 'u6l7', calc: true, outcome: 'RF3',
    blurb: 'The four types of slope: which graph is zero or undefined, a negative slope from a grid, the type from two points, and coordinates that make a slope zero or undefined.',
    questions: [Q(1, 'BEG', 'Which graph?', l7q1), Q(2, 'BEG', 'A negative slope.', l7q2), Q(3, 'BEG', 'The type of slope.', l7q3), Q(4, 'MAS', 'Zero or undefined.', l7q4)] });

  /* =====================================================================================================
   * Lesson 8 — Determining collinearity using slope
   * ===================================================================================================== */
  function l8q1(r) { // Ryan: A(−5, −3), B(−1, 0), C(5, 4) — 3/4 vs 2/3, not collinear · A(−4, −3), B(0, −1), C(6, 2) — 1/2 = 3/6, collinear
    var col = r.chance(0.5), s;
    if (col) s = pickWhere(function () { var m = r.pick([[1, 2], [1, 3], [2, 3], [3, 2], [2, 1], [-1, 2], [-2, 3], [-3, 2], [-1, 3]]), i = r.int(1, 3), j = r.int(1, 3), A = [r.int(-7, -2), r.int(-6, 6)]; var Bp = [A[0] + m[1] * i, A[1] + m[0] * i]; return { m: m, i: i, j: j, A: A, Bp: Bp, C: [Bp[0] + m[1] * j, Bp[1] + m[0] * j] }; },
      function (s) { return s.i !== s.j && [s.A, s.Bp, s.C].every(function (p) { return Math.abs(p[0]) <= 7 && Math.abs(p[1]) <= 7 && p[0] !== 0 && p[1] !== 0; }) && s.A[0] * s.Bp[1] - s.A[1] * s.Bp[0] !== 0 && (s.i > 1 || s.j > 1); });
    else s = pickWhere(function () { var pr = r.pick([[[3, 4], [2, 3]], [[1, 2], [2, 3]], [[2, 3], [3, 5]], [[3, 4], [4, 5]], [[1, 2], [3, 5]], [[3, 2], [4, 3]], [[2, 3], [3, 4]], [[4, 3], [3, 2]], [[2, 5], [1, 2]], [[3, 5], [2, 3]]]), sg = r.chance(0.6) ? 1 : -1, k = r.int(1, 2), A = [r.int(-7, -2), sg > 0 ? r.int(-6, -1) : r.int(1, 6)];
      if (r.chance(0.5)) pr = [pr[1], pr[0]];
      var Bp = [A[0] + pr[0][1] * (pr[0][1] <= 2 ? k : 1), A[1] + sg * pr[0][0] * (pr[0][1] <= 2 ? k : 1)], k2 = pr[1][1] <= 2 ? r.int(1, 2) : 1; return { pr: pr, sg: sg, A: A, Bp: Bp, C: [Bp[0] + pr[1][1] * k2, Bp[1] + sg * pr[1][0] * k2] }; },
      function (s) { return [s.A, s.Bp, s.C].every(function (p) { return Math.abs(p[0]) <= 7 && Math.abs(p[1]) <= 7 && p[0] !== 0 && p[1] !== 0; }); });
    var A = s.A, Bp = s.Bp, C = s.C, m1 = slopeOf(A, Bp), m2 = slopeOf(Bp, C), r1 = rawFr(Bp[1] - A[1], Bp[0] - A[0]), r2 = rawFr(C[1] - Bp[1], C[0] - Bp[0]);
    var sol = t(slopeLine(A, Bp, 'AB')) + ', ' + t(slopeLine(Bp, C, 'BC')) + '.<br>' + (col ? 'The slopes are equal and the segments share point ' + t('B') + ', so ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ' <b>are</b> collinear.' : 'The slopes are not equal, so the points are <b>not</b> collinear (the path bends at ' + t('B') + ').');
    var opts;
    if (col) opts = [{ html: 'Yes, because ' + t('m_{AB}=m_{BC}=' + slT(m1)), right: true },
      { html: 'No, because ' + t('m_{AB}=' + r1) + ' but ' + t('m_{BC}=' + r2), why: 'Reduce the slopes before you compare them: both equal ' + t(slT(m1)) + '.', code: 'nosimp' },
      { html: 'No, because the points are not evenly spaced', why: 'Collinear points don’t have to be evenly spaced — only the slopes matter. Here ' + t('m_{AB}=m_{BC}=' + slT(m1)) + '.', code: 'spaced' },
      { html: 'No, because the line does not pass through the origin', why: 'A line doesn’t have to pass through the origin. Use the slope test: ' + t('m_{AB}=m_{BC}=' + slT(m1)) + '.', code: 'origin' }];
    else opts = [{ html: 'No, because ' + t('m_{AB}=' + slT(m1)) + ' but ' + t('m_{BC}=' + slT(m2)), right: true },
      { html: 'Yes, because ' + t('m_{AB}=m_{BC}=' + slT(m1)), why: 'Check ' + t('m_{BC}') + ' too: ' + t(slopeLine(Bp, C)) + ', which is not ' + t(slT(m1)) + '.', code: 'assumed' },
      { html: 'Yes, because all three points ' + (s.sg > 0 ? 'rise' : 'fall') + ' from left to right', why: 'Points can all ' + (s.sg > 0 ? 'rise' : 'fall') + ' and still not be on one line. Compare the slopes: ' + t(slT(m1)) + ' and ' + t(slT(m2)) + '.', code: 'rise' },
      { html: 'Yes, because they look like they are on one line', why: 'A picture can fool you. Use the slope test: ' + t('m_{AB}=' + slT(m1)) + ' but ' + t('m_{BC}=' + slT(m2)) + '.', code: 'look' }];
    return mc(r, 'Points ' + t('A') + ', ' + t('B') + ' and ' + t('C') + ' are graphed. Use the slope test: are they collinear?' + gridFig([A, Bp, C], ['A', 'B', 'C'], { perp: true, aria: 'points A, B and C on a grid' }), opts, sol,
      ['Find ' + t('m_{AB}') + ' and ' + t('m_{BC}') + ' (count the rise and the run, or use the slope formula).', 'Reduce both slopes. Equal slopes through the shared point ' + t('B') + ' mean the points are collinear.'], col ? 'slope test: collinear' : 'slope test: not collinear');
  }
  function l8q2(r) { // Ryan: J(−2, −1), K(1, 1), L(7, k) → 5 · J(−3, −1), K(1, 1), L(7, k) → 4
    var s = pickWhere(function () { var m = r.pick([[2, 3], [1, 2], [3, 4], [1, 3], [3, 2], [2, 5], [4, 3], [-2, 3], [-1, 2], [-3, 4]]), i = r.int(1, 2), j = r.int(1, 3), J = [r.int(-6, -1), r.int(-5, 3)]; var K0 = [J[0] + m[1] * i, J[1] + m[0] * i]; return { m: m, i: i, j: j, J: J, K0: K0, xL: K0[0] + m[1] * j, k: K0[1] + m[0] * j }; },
      function (s) { return (s.J[1] < 0 || s.K0[1] < 0) && Math.abs(s.k) <= 15 && s.xL <= 14 && s.i !== s.j && s.K0[0] !== 0 && s.J[1] !== 0; });
    var J = s.J, K0 = s.K0, xL = s.xL, k = s.k, m = slopeOf(J, K0), mv = sval(m), dx = xL - K0[0], rk = K0[1] - J[1], mS = (J[1] < 0 || K0[1] < 0) ? (K0[1] + J[1]) / (K0[0] - J[0]) : null;
    var dl = [[K0[1] + dx / mv, 'u6x-col-flip', 'Slope is rise over run: ' + t('\\dfrac{k-' + sgp(K0[1]) + '}{' + xL + '-' + sgp(K0[0]) + '}=' + slT(m)) + ', so the change in ' + t('y') + ' is ' + t(slT(m) + '\\times' + dx) + '.'],
      [mv * dx, 'u6x-col-noadd', 'That is the rise from ' + t('K') + ' to ' + t('L') + '. Add it to ' + t('K') + '’s ' + t('y') + '-coordinate to get ' + t('k') + '.'],
      [K0[1] + rk, 'u6x-col-run', 'The run from ' + t('K') + ' to ' + t('L') + ' is ' + t(xL + '-' + sgp(K0[0]) + '=' + dx) + ', not the run of ' + t('JK') + '.']];
    if (mS != null && !near(mS, mv)) dl.push([K0[1] + mS * dx, 'u6x-col-sign', 'Check ' + t('m_{JK}') + ': ' + t(formulaT(J, K0) + '=' + slT(m)) + ' (subtracting a negative adds).']);
    return numPart('The points ' + t('J' + ptT(J)) + ', ' + t('K' + ptT(K0)) + ' and ' + t('L(' + xL + ',\\ k)') + ' are collinear. Find ' + t('k') + '.', k, dl,
      t(slopeLine(J, K0, 'JK')) + '.<br>Collinear, so ' + t('m_{KL}=' + slT(m)) + ': ' + t('\\dfrac{k-' + sgp(K0[1]) + '}{' + xL + '-' + sgp(K0[0]) + '}=' + slT(m)) + ', so ' + t('k-' + sgp(K0[1]) + '=' + slT(m) + '\\times' + dx + '=' + nT(mv * dx)) + ' and ' + t('k=' + k) + '.',
      ['Collinear points have the same slope between any two of them. Find ' + t('m_{JK}') + ' first.', 'Set ' + t('m_{KL}') + ' (with ' + t('k') + ' on top) equal to it and solve.'], 'collinear: find k', { before: t('k=') });
  }
  HW.defineExit({ lesson: 'u6l8', calc: true, outcome: 'RF3',
    blurb: 'The slope test for collinear points on a grid, and the missing coordinate that makes three points collinear.',
    questions: [Q(1, 'PRG', 'The slope test.', l8q1), Q(2, 'MAS', 'A missing coordinate.', l8q2)] });

  /* =====================================================================================================
   * Lesson 9 — Parallel and perpendicular lines
   * ===================================================================================================== */
  function l9q1(r) { // Ryan: A(−3, −1), B(3, 3) → m 2/3, perpendicular −3/2 · A(−3, 2), B(3, −2) → −2/3, perpendicular 3/2
    var s = pickWhere(function () { var rise = r.pick(nz(-6, 6)), run = r.int(2, 7), A = [r.int(-6, 0), r.int(-6, 6)]; return { A: A, Bp: [A[0] + run, A[1] + rise] }; }, function (s) {
      var A = s.A, Bp = s.Bp, rise = Bp[1] - A[1], run = Bp[0] - A[0]; return Math.abs(rise) !== run && Math.abs(Bp[1]) <= 6 && Bp[0] <= 6 && Math.abs(rise) >= 2 && (A[0] < 0 || A[1] < 0) && A[0] !== 0 && Bp[0] !== 0 && A[1] !== 0 && Bp[1] !== 0; });
    var A = s.A, Bp = s.Bp, m = slopeOf(A, Bp), mv = sval(m), pm = red(-m[1], m[0]);
    var diag = function (v) {
      if (near(v, mv)) return { code: 'u6x-perp-same', hint: 'That is the slope of ' + t('AB') + ' itself (a parallel line). Perpendicular slopes are <b>negative reciprocals</b>: flip the fraction and change the sign.' };
      if (near(v, 1 / mv)) return { code: 'u6x-perp-recip', hint: 'You flipped the fraction — now also change the <b>sign</b>.' };
      if (near(v, -mv)) return { code: 'u6x-perp-sign', hint: 'You changed the sign — now also <b>flip</b> the fraction.' };
      return null;
    };
    return slopePart('Find the slope of segment ' + t('AB') + ' from the grid. What is the slope of a line <b>perpendicular</b> to ' + t('AB') + '?' + segFig(A, Bp, 'AB', { aria: 'segment AB on a grid' }), pm, diag, [slT(m), slT(red(m[1], m[0])), slT(red(-m[0], m[1]))],
      'From ' + t('A') + ' to ' + t('B') + ': ' + t('m_{AB}=\\dfrac{\\text{rise}}{\\text{run}}=' + fracSteps(Bp[1] - A[1], Bp[0] - A[0])) + '.<br>Flip it and change the sign: ' + t('m_{\\perp}=' + slT(pm)) + '. (Check: ' + t(slT(m) + '\\times\\left(' + slT(pm) + '\\right)=-1') + '.)',
      ['Count the rise and the run from ' + t('A') + ' to ' + t('B') + ' to find ' + t('m_{AB}') + '.', 'Perpendicular slopes are negative reciprocals: “flip it, and change the sign.”'], 'perpendicular slope from a grid', { before: t('m_{\\perp}='), ansPre: 'm_{\\perp}=' });
  }
  function l9q2(r) { // Ryan: 5/6 and 6/5 → neither · 4/7 and −7/4 → perpendicular
    var s = pickWhere(function () { return { p: r.pick(nz(-7, 7)), q: r.int(2, 9), kind: r.pick(['perp', 'perp', 'recip', 'recip', 'par', 'sign']) }; }, function (s) { return gcd(s.p, s.q) === 1 && Math.abs(s.p) !== s.q && Math.abs(s.p) > 1; });
    var p = s.p, q = s.q, m1 = [p, q], m2 = s.kind === 'perp' ? red(-q, p) : s.kind === 'recip' ? red(q, p) : s.kind === 'par' ? [p, q] : [-p, q];
    var ans = s.kind === 'perp' ? 'Perpendicular' : s.kind === 'par' ? 'Parallel' : 'Neither', prod = '\\left(' + slT(m1) + '\\right)\\times\\left(' + slT(m2) + '\\right)=' + slT(red(m1[0] * m2[0], m1[1] * m2[1]));
    var expl = s.kind === 'par' ? 'The slopes are equal, so the segments are <b>parallel</b>.' : s.kind === 'perp' ? t(prod) + ': the slopes are negative reciprocals, so the segments are <b>perpendicular</b>.'
      : 'The slopes are not equal, so not parallel; ' + t(prod) + ', not ' + t('-1') + ', so not perpendicular: <b>neither</b>.';
    var why = {
      Parallel: s.kind === 'par' ? null : s.kind === 'recip' ? 'The same digits don’t make equal slopes: ' + t(slT(m1) + '\\ne' + slT(m2)) + '. ' + expl : 'Parallel slopes are <b>equal</b>; these are not. ' + expl,
      Perpendicular: s.kind === 'perp' ? null : s.kind === 'recip' ? 'The fraction is flipped, but a perpendicular slope also has the <b>opposite sign</b>. ' + expl : s.kind === 'sign' ? 'The sign changed, but the fraction is not flipped. ' + expl : 'Perpendicular slopes are negative reciprocals (product ' + t('-1') + '). ' + expl,
      Neither: s.kind === 'perp' ? 'These slopes are negative reciprocals: ' + expl : s.kind === 'par' ? 'Equal slopes mean parallel. ' + expl : null };
    var opts = ['Parallel', 'Perpendicular', 'Neither'].map(function (k) { return { html: k, right: k === ans, why: why[k], code: k.toLowerCase() }; });
    return mc(r, 'One segment has slope ' + t(slT(m1)) + ' and another has slope ' + t(slT(m2)) + '. The segments are:', opts, expl,
      ['Parallel: equal slopes. Perpendicular: negative reciprocals (flip and change the sign; their product is ' + t('-1') + ').', 'Multiply the two slopes: is the product ' + t('-1') + '?'], 'parallel/perpendicular/neither: ' + s.kind, true);
  }
  function l9q3(r) { // added (Mastery): assignment Q12 — U(−2, 3), V(6, k), P(1, 5), Q(5, 3), UV ⊥ PQ → k = 19
    var s = pickWhere(function () { var m = r.pick([[-1, 2], [1, 2], [-1, 3], [2, 3], [-2, 3], [3, 4], [-3, 2], [1, 4], [-2, 1], [3, 1]]), P0 = [r.int(-4, 4), r.int(-4, 6)], i = r.int(1, 2), U = [r.int(-6, 2), r.int(-6, 6)], j = r.int(1, 3);
      var pm = red(-m[1], m[0]); return { m: m, pm: pm, P0: P0, Q0: [P0[0] + m[1] * i, P0[1] + m[0] * i], U: U, xV: U[0] + pm[1] * j, k: U[1] + pm[0] * j }; },
      function (s) { return Math.abs(s.k) <= 20 && s.xV <= 12 && s.xV !== 0 && s.k !== s.U[1]; });
    var m = s.m, pm = s.pm, P0 = s.P0, Q0 = s.Q0, U = s.U, xV = s.xV, k = s.k, dx = xV - U[0], mv = sval(m), pv = sval(pm);
    var dl = [[U[1] + mv * dx, 'u6x-k-par', 'Perpendicular segments don’t have equal slopes. ' + t('m_{UV}') + ' must be the negative reciprocal of ' + t('m_{PQ}=' + slT(m)) + ': ' + t(slT(pm)) + '.'],
      [U[1] - pv * dx, 'u6x-k-recip', 'Check the sign of the perpendicular slope: flip ' + t(slT(m)) + ' <b>and</b> change its sign: ' + t(slT(pm)) + '.'],
      [U[1] + dx / pv, 'u6x-k-flip', 'Slope is rise over run: ' + t('\\dfrac{k-' + sgp(U[1]) + '}{' + xV + '-' + sgp(U[0]) + '}=' + slT(pm)) + ', with ' + t('k') + ' on the top.']];
    return numPart('Segment ' + t('UV') + ' has endpoints ' + t('U' + ptT(U)) + ' and ' + t('V(' + xV + ',\\ k)') + '. Segment ' + t('PQ') + ' has endpoints ' + t('P' + ptT(P0)) + ' and ' + t('Q' + ptT(Q0)) + '. If ' + t('UV') + ' is perpendicular to ' + t('PQ') + ', find the value of ' + t('k') + '.', k, dl,
      t(slopeLine(P0, Q0, 'PQ')) + ', so ' + t('m_{UV}=' + slT(pm)) + ' (flip and change the sign).<br>' + t('\\dfrac{k-' + sgp(U[1]) + '}{' + xV + '-' + sgp(U[0]) + '}=' + slT(pm)) + ', so ' + t('k-' + sgp(U[1]) + '=' + slT(pm) + '\\times' + dx + '=' + nT(pv * dx)) + ' and ' + t('k=' + k) + '.',
      ['Find ' + t('m_{PQ}') + ', then the perpendicular slope (flip it and change the sign) — that is ' + t('m_{UV}') + '.', 'Write ' + t('m_{UV}') + ' with the slope formula (with ' + t('k') + ' on top), set it equal to that slope, and solve.'], 'perpendicular: find k', { before: t('k=') });
  }
  HW.defineExit({ lesson: 'u6l9', calc: true, outcome: 'RF3',
    blurb: 'Parallel and perpendicular slopes: a perpendicular slope from a grid, parallel / perpendicular / neither from two slopes, and a missing coordinate that makes segments perpendicular.',
    questions: [Q(1, 'PRG', 'A perpendicular slope.', l9q1), Q(2, 'BEG', 'Parallel, perpendicular or neither?', l9q2), Q(3, 'MAS', 'A missing coordinate.', l9q3)] });

  /* =====================================================================================================
   * Lesson 10 — Unit review: coordinate geometry
   * ===================================================================================================== */
  function l10q1(r) { var s = lenShared(r, 5); return lenPart('JK', s.A, s.Bp, segFig(s.A, s.Bp, 'JK', { aria: 'segment JK on a grid' })); } // Ryan: J(−3, −2), K(3, 1) → 3√5 · J(−4, 1), K(2, −1) → 2√10
  function l10q2(r) { // Ryan: M(−2, 3), P(−7, 1) → Q(3, 5) · M(1, −2), P(−3, 2) → Q(5, −6)
    var s = pickWhere(function () { var P0 = [r.int(-9, 4), r.int(-6, 6)], st = [r.pick(nz(-6, 6)), r.pick(nz(-5, 5))]; return { P0: P0, M: add(P0, st), st: st }; }, function (s) {
      return (s.P0[0] < 0 || s.P0[1] < 0) && (s.M[0] < 0 || s.M[1] < 0 || s.P0[0] < 0) && Math.abs(s.st[0]) + Math.abs(s.st[1]) >= 4 && s.M[0] !== 0 && s.M[1] !== 0 && Math.abs(s.M[0]) <= 8 && Math.abs(s.M[1]) <= 8; });
    var P0 = s.P0, M = s.M, Q0 = sub(scl(M, 2), P0);
    var dl = endDl(P0, M, 'P', 'Q');
    return ptPart(t('M' + ptT(M)) + ' is the midpoint of segment ' + t('PQ') + '. If ' + t('P') + ' is ' + t(ptT(P0)) + ', find ' + t('Q') + '. Type it as an ordered pair.', Q0, { dl: dl, before: t('Q=') },
      endSol(P0, M, Q0, 'P', 'Q'), ['If ' + t('M') + ' is the midpoint of ' + t('PQ') + ', then ' + t('x_Q=2x_M-x_P') + ' and ' + t('y_Q=2y_M-y_P') + ': double the midpoint, then subtract the endpoint you have.', 'The missing endpoint is past the midpoint: the step from ' + t('P') + ' to ' + t('M') + ' is repeated from ' + t('M') + ' to ' + t('Q') + '.'], 'missing endpoint');
  }
  var RELW = { par: 'parallel', perp: 'perpendicular', nei: 'neither' };
  function relChk(want, hint) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').trim().toLowerCase().replace(/[.!]+$/, '');
      if (!s) return form('empty', 'Type parallel, perpendicular or neither.');
      var k = /^par/.test(s) ? 'par' : /^perp/.test(s) ? 'perp' : /^(nei|none|nor)/.test(s) ? 'nei' : null;
      if (!k) return form('word', 'Type one word: <b>parallel</b>, <b>perpendicular</b> or <b>neither</b>.');
      return k === want ? ok() : wrong('u6x-rel-wrong', hint);
    };
  }
  function l10q3(r) { // Ryan (MC → typed): E(−4, 5), F(2, −3), G(−1, −2), H(7, 4) → perpendicular · E(−3, −2), F(3, 2), G(−4, 1), H(5, 7) → parallel
    var s = pickWhere(function () {
      var kind = r.pick(['perp', 'perp', 'par', 'par', 'nei']), m = r.pick([[2, 3], [3, 4], [1, 2], [3, 2], [4, 3], [1, 3], [2, 5], [-2, 3], [-3, 4], [-1, 2], [-4, 3]]), i = r.int(1, 2), j = r.int(1, 3);
      var m2 = kind === 'perp' ? red(-m[1], m[0]) : kind === 'par' ? m : red(m[1], m[0]);
      var E0 = [r.int(-6, 0), r.int(-6, 6)], G0 = [r.int(-6, 2), r.int(-6, 6)];
      return { kind: kind, m: m, m2: m2, E0: E0, F0: [E0[0] + m[1] * i, E0[1] + m[0] * i], G0: G0, H0: [G0[0] + m2[1] * j, G0[1] + m2[0] * j], i: i, j: j };
    }, function (s) { return [s.F0, s.H0].every(function (p) { return Math.abs(p[0]) <= 9 && Math.abs(p[1]) <= 9; }) && (s.i > 1 || s.j > 1) && !(s.E0[0] === s.G0[0] && s.E0[1] === s.G0[1]); });
    var E0 = s.E0, F0 = s.F0, G0 = s.G0, H0 = s.H0, m1 = slopeOf(E0, F0), m2 = slopeOf(G0, H0), want = s.kind;
    var prod = slT(m1) + '\\times\\left(' + slT(m2) + '\\right)=' + slT(red(m1[0] * m2[0], m1[1] * m2[1]));
    var concl = want === 'par' ? 'The slopes are equal, so the segments are <b>parallel</b>.' : want === 'perp' ? t(prod) + ', so the slopes are negative reciprocals: <b>perpendicular</b>.' : 'The slopes are not equal and ' + t(prod) + ' (not ' + t('-1') + '): <b>neither</b>.';
    var p = B.fields('Segment ' + t('EF') + ' joins ' + t('E' + ptT(E0)) + ' and ' + t('F' + ptT(F0)) + '. Segment ' + t('GH') + ' joins ' + t('G' + ptT(G0)) + ' and ' + t('H' + ptT(H0)) + '. Find both slopes, then decide whether the segments are parallel, perpendicular or neither.',
      [{ label: t('m_{EF}='), name: 'Slope of EF', mode: 'math', keys: 'slope', placeholder: 'e.g. -4/3' }, { label: t('m_{GH}='), name: 'Slope of GH', mode: 'math', keys: 'slope', placeholder: 'e.g. 3/4' }, { label: 'The segments are', name: 'Parallel, perpendicular or neither', mode: 'text', wide: true, placeholder: 'one word' }],
      [slopeChk(m1), slopeChk(m2), relChk(want, (want === 'par' ? 'Equal slopes mean parallel. ' : want === 'perp' ? 'Negative reciprocal slopes (product ' + t('-1') + ') mean perpendicular. ' : 'Parallel needs equal slopes; perpendicular needs a product of ' + t('-1') + '. ') + concl)],
      [slT(m1), slT(m2), RELW[want]], t('m_{EF}=' + slT(m1)) + ', ' + t('m_{GH}=' + slT(m2)) + ': <b>' + RELW[want] + '</b>',
      t(slopeLine(E0, F0, 'EF')) + ', ' + t(slopeLine(G0, H0, 'GH')) + '.<br>' + concl,
      ['Use ' + t('m=\\dfrac{y_2-y_1}{x_2-x_1}') + ' for each segment, and reduce both slopes.', 'Equal slopes: parallel. Product ' + t('-1') + ' (flip and change the sign): perpendicular. Otherwise neither.'], 'parallel/perpendicular/neither from points: ' + want);
    p.bad = [[slT(m1), slT(m2), RELW[want === 'par' ? 'perp' : 'par']], [slT(red(-m1[0], m1[1])), slT(m2), RELW[want]]];
    return p;
  }
  HW.defineExit({ lesson: 'u6l10', calc: true, outcome: 'RF3',
    blurb: 'Unit 6 review: an exact length as a mixed radical, a missing endpoint, and parallel / perpendicular / neither from four points.',
    questions: [Q(1, 'PRG', 'An exact length.', l10q1), Q(2, 'PRG', 'A missing endpoint.', l10q2), Q(3, 'MAS', 'Parallel or perpendicular?', l10q3)] });
})(window);
