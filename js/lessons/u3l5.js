/* Math 15 · Unit 3 · Lesson 5 — Multiplying a Binomial by a Trinomial (AN4)
 * Assignment 5, questions 1–16 (u3_L05.tex) and the whole Lesson 5 Extra Practice (u3_EP05.tex, Parts A–E, Q1–19).
 * Built on the Math 10C Unit 3 Lesson 4 practice (binomial × trinomial): the same polynomial helpers, area box,
 * distribution solutions, classic wrong answers (FOIL only, second term only partly distributed, a subtracted bracket
 * with only its first sign changed, constant factor lost or doubled, cube on each term, square without its middle term)
 * and wrong-answer codes. Every part is a generator that keeps the booklet question's structure (which bracket has a
 * coefficient, where the negative signs are, one or two letters) and changes the numbers; the booklet's numbers are among
 * the possible values. Math 15 pitch: small coefficients, no calculator, any term order accepted unless the question asks
 * for descending order. Q1 starts with the 2 × 3 grid (area box) from Example 2, then the expansion.
 * Levels (calibrated for Math 15): LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, t = K.t;
  /* HW.poly, but factors may also be given as arrays of terms (summed first) */
  var P = Object.create(HW.poly);
  function fx(a) { return Array.isArray(a) && a.length && typeof a[0] === 'object' ? HW.poly.add.apply(null, a) : a; }
  ['mul', 'add', 'sub', 'eq'].forEach(function (f) { P[f] = function () { return HW.poly[f].apply(null, Array.prototype.map.call(arguments, fx)); }; });
  P.pow = function (a, n) { return HW.poly.pow(fx(a), n); };

  HW.addCodes({
    'foil-only': 'Only 4 partial products (FOIL) — missed the trinomial’s middle term', 'second-partial': 'Second term of the binomial multiplied by only part of the trinomial',
    'minus-first': 'Minus sign applied only to the first term', 'const-both': 'Multiplied the constant factor into both brackets', 'const-lost': 'Dropped the constant factor',
    'cube-each': 'Cubed each term: (a+b)³ = a³+b³', 'square-middle': 'Squared a binomial without the middle term', 'exp-mult': 'Multiplied exponents instead of adding',
    'student-ans': 'Repeated the student’s error', 'added-prod': 'Added instead of subtracting', 'only-last': 'Multiplied the monomial into only one term',
    'no-x': 'Left out the height factor x', 'reverse': 'Subtracted in the wrong order', 'face-area': 'Gave the area of one face, not the volume', 'two-dims': 'Multiplied only two of the three dimensions',
    'u3l5-one-group': 'Used only one of the two products that make a term', 'u3l5-sum-not-prod': 'Counted terms by adding (2 + 3) instead of multiplying (2 × 3)',
    'u3l5-k-sign': 'Sign of the missing number', 'u3l5-no-collect': 'Gave the number of terms before collecting like terms'
  });
  HW.addPartial({ 'u3l5-one-group': 'b', 'u3l5-sum-not-prod': 'n', 'u3l5-k-sign': 's', 'u3l5-no-collect': 'b' });

  /* ---------------- polynomial helpers ---------------- */
  function M(c, v, e) { var o = {}; if (v) o[v] = e == null ? 1 : e; return P.mono(c, o); } // c·v^e
  function MM(c, vs) { return P.mono(c, vs); }                                              // c·x^a·y^b
  function N(c) { return P.num(c); }
  function sum(arr) { return P.add.apply(null, arr); }
  function seq(arr) { return P.seq(arr); }
  function br(arr) { return arr.length > 1 ? '\\left(' + seq(arr) + '\\right)' : seq(arr); }
  function tx(p, o) { return P.tex(p, o); }
  function termsOf(p, o) { return P.sorted(p, o || {}).map(function (T) { return P.mono(T.c, T.v); }); }
  function signedTex(m, first) { var s = P.tex(m); return first || s.charAt(0) === '-' ? s : '+' + s; }
  function pickWhere(gen, test) { for (var i = 0; i < 4000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u3l5: pickWhere failed'); }
  function cnt(p) { return P.count(p); }
  function co(p, vs) { var c = P.coef(p, vs || {}); return c[0] / c[1]; }
  function plain(s) { return s.replace(/\\left|\\right/g, '').replace(/\\cdot/g, '·').replace(/[{}]/g, ''); }
  function lin(a, b, v) { return [M(a, v || 'x'), N(b)].filter(function (m) { return !P.isZero(m); }); }   // [a v, b]
  function lin2(a, u, b, w) { return [M(a, u), M(b, w)]; }                                                     // [a u, b w]
  function quad(a, b, c, v) { return [M(a, v || 'x', 2), M(b, v || 'x'), N(c)].filter(function (m) { return !P.isZero(m); }); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t2 = a % b; a = b; b = t2; } return a; }
  function gcd3(a, b, c) { return gcd(gcd(a, b), c); }
  function pv(n) { return n < 0 ? '(' + n + ')' : String(n); }
  var LETTERS = ['x', 'x', 'x', 'a', 'm', 'n', 'p', 't', 'y', 'k', 'w'];
  var PAIRS = [['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['s', 't'], ['u', 'v'], ['c', 'd'], ['g', 'h'], ['r', 's'], ['w', 'z'], ['a', 'c'], ['x', 'z'], ['b', 'c'], ['m', 'p'], ['f', 'g'], ['h', 'k'], ['a', 'd'], ['p', 'r'], ['x', 'w'], ['c', 'x'], ['n', 't'], ['y', 'z'], ['a', 'k']];

  /* partial products, like-term notes, distribution and grid solutions */
  function partials(A, B) { var out = []; A.forEach(function (a) { B.forEach(function (b) { out.push(P.mul(a, b)); }); }); return out; }
  function collectNote(parts) {
    var g = {}, order = [];
    parts.forEach(function (p) { var k = Object.keys(p)[0]; if (k == null) return; if (!g[k]) { g[k] = []; order.push(k); } g[k].push(p); });
    return order.filter(function (k) { return g[k].length > 1; }).map(function (k) { var s = sum(g[k]); return seq(g[k]) + '=' + (P.isZero(s) ? '0' : tx(s)); }).join(';\\ \\ ');
  }
  /* lead = LaTeX of the product being expanded; A's terms are distributed over B */
  function distSol(A, B, lead, o) {
    o = o || {};
    var l1 = A.map(function (a, i) { return signedTex(a, i === 0) + br(B); }).join('');
    var l2 = A.map(function (a) { return '\\left(' + seq(B.map(function (b) { return P.mul(a, b); })) + '\\right)'; }).join('+');
    var parts = partials(A, B), note = collectNote(parts), res = P.mul(sum(A), sum(B));
    var s = t((lead ? lead : '') + '=' + l1) + '<br>' + t('=' + l2);
    if (note) s += '<br>Collect like terms: ' + t(note);
    return s + '<br>' + t('=' + tx(res, o));
  }
  function grid(A, B, fill) {
    return HW.areaModel(B.map(function (b) { return tx(b); }), A.map(function (a) { return tx(a); }),
      A.map(function (a) { return B.map(function (b) { return fill ? tx(P.mul(a, b)) : ''; }); }), { max: 380 });
  }
  /* area box (js/draw2.js areabox): A's terms down the side, B's terms along the top; the student fills every box. */
  function boxPart(prompt, A, B, text, hints) {
    var Rt = A.map(function (a) { return tx(a); }), Ct = B.map(function (b) { return tx(b); }), Mp = A.map(function (a) { return B.map(function (b) { return P.mul(a, b); }); });
    var Mt = Mp.map(function (rw) { return rw.map(function (q) { return tx(q); }); }), vs = HW.poly.vars(sum(A.concat(B)));
    var key = { rows: Rt, cols: Ct, cells: Mt };
    var list = []; A.forEach(function (a, i) { B.forEach(function (b, j) { list.push(t('(' + tx(a) + ')(' + tx(b) + ')=' + Mt[i][j])); }); });
    var p = KP.areabox(prompt, { rows: Rt, cols: Ct, cells: Mt.map(function (rw) { return rw.map(function () { return null; }); }), keys: 'poly', vars: vs.length ? vs : ['x'] }, {}, key,
      grid(A, B, true) + 'Each box is (row term) × (column term): ' + list.join(', &nbsp;') + '.', hints || ['Each box is its row term times its column term — six boxes in all.', 'Multiply the numbers and add the exponents: ' + t('x\\cdot x^{2}=x^{3}') + '.'], text);
    var copy = function () { return { rows: Rt.slice(), cols: Ct.slice(), cells: Mt.map(function (rw) { return rw.slice(); }) }; }, bads = [];
    var T00 = HW.poly.terms(Mp[0][0])[0], v00 = {}; Object.keys(T00.v).forEach(function (k) { v00[k] = T00.v[k] === 3 ? 2 : T00.v[k]; });
    var b1 = copy(); b1.cells[0][0] = tx(MM(T00.c, v00)); bads.push(b1); // x·x² written as x²
    var b2 = copy(); b2.cells[1][2] = tx(P.neg(Mp[1][2])); bads.push(b2);
    p.bad = bads;
    return p;
  }

  /* ---------------- the poly part, with classic wrong answers ---------------- */
  function cleanW(T, ws) {
    var out = [];
    (ws || []).forEach(function (w) {
      if (!w || !w.is) return; var p = P.lift(fx(w.is));
      if (P.eq(p, T) || out.some(function (o) { return P.eq(o.is, p); })) return;
      out.push({ is: p, code: w.code, hint: w.hint });
    });
    return out;
  }
  function polyPart(prompt, target, wrongs, sol, hints, text, o) {
    o = o || {}; var T = P.lift(target), ws = cleanW(T, wrongs);
    var p = KP.poly(prompt, T, { wrong: ws, order: o.order, var: o.var, keyTex: o.keyTex, before: o.before, vars: o.vars }, sol, hints, text);
    p.bad = ws.map(function (w) { return tx(w.is); }).concat(o.bad || []);
    p.good = (o.order ? [] : [tx(T, { order: 'asc' })]).concat(o.good || []);
    return p;
  }
  /* boxes for a fields part */
  function box(label, vars, o) { o = o || {}; return { name: o.name || label.replace(/<[^>]*>|\\\(|\\\)/g, ''), label: label, mode: 'math', keys: 'poly', vars: vars || ['x'], wide: o.wide !== false, before: o.before }; }
  function nbox(label, name) { return { name: name || label.replace(/<[^>]*>|\\\(|\\\)/g, ''), label: label }; }
  function intChk(n, diag) { return K.value(n, { only: 'integer', diag: diag ? function (v) { return diag(v); } : null }); }
  function polyChk(T, wrongs, o) { o = o || {}; T = P.lift(T); return K.poly(T, { wrong: cleanW(T, wrongs), order: o.order, var: o.var }); }
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return KP.mc(r, prompt, opts, sol, hints, text, keepOrder); }

  /* classic wrong answers */
  function wFoil(A, B) { // binomial × trinomial with only FOIL's four products (the trinomial's middle term skipped)
    var bi = A.length === 2 ? A : B, tr = A.length === 2 ? B : A;
    if (bi.length !== 2 || tr.length !== 3) return null;
    return { is: sum([P.mul(bi[0], tr[0]), P.mul(bi[0], tr[2]), P.mul(bi[1], tr[0]), P.mul(bi[1], tr[2])]), code: 'foil-only',
      hint: 'You have only four partial products — that’s FOIL. A binomial × trinomial needs ' + t('2\\times 3=6') + ': both terms of ' + t(br(bi)) + ' must also multiply the middle term ' + t(tx(tr[1])) + '.' };
  }
  function wSecond(A, B) { // second term of the binomial multiplied only by the last term of the trinomial
    var bi = A.length === 2 ? A : B, tr = A.length === 2 ? B : A;
    if (bi.length !== 2 || tr.length !== 3) return null;
    return { is: P.add(P.mul(bi[0], sum(tr)), P.mul(bi[1], tr[2])), code: 'second-partial',
      hint: t(tx(bi[1])) + ' must multiply <b>every</b> term of ' + t(br(tr)) + ', not just the last one — that’s three more partial products.' };
  }
  function wMinusFirst(A, B) { // A = [lead, negative const]: the second row with only its first sign changed
    var c = A[1], cv = co(c); if (!(cv < 0)) return null;
    var row = B.map(function (b) { return P.mul(P.neg(c), b); }), bad = P.mul(A[0], sum(B));
    row.forEach(function (m, i) { bad = i === 0 ? P.sub(bad, m) : P.add(bad, m); });
    return { is: bad, code: 'minus-first', hint: 'Check the ' + t(tx(c)) + ' row: ' + t(tx(c)) + ' times <b>every</b> term of ' + t(br(B)) + ' — a negative times a negative is positive, so check each sign on its own.' };
  }
  function wExp(A, B) { // x·x² written as x² (exponents multiplied / not added)
    var bad = sum(partials(A, B).map(function (m) { var T = HW.poly.terms(m)[0]; if (!T) return m; var v = {}; Object.keys(T.v).forEach(function (k) { v[k] = T.v[k] === 3 ? 2 : T.v[k]; }); return MM(T.c, v); }));
    return { is: bad, code: 'exp-mult', hint: 'Check the exponents: ' + t('x\\cdot x^{2}=x^{3}') + ' — when you multiply powers of the same letter you <b>add</b> the exponents.' };
  }

  var H_BT = ['Multiply each term of the binomial by every term of the trinomial: ' + t('2\\times 3=6') + ' partial products. Then collect like terms.',
    'Add the exponents when you multiply (' + t('x\\cdot x^{2}=x^{3}') + '). Find the sign of each product on its own: a negative times a negative is positive.'];

  /* expand A·B (arrays); o.k: constant/monomial in front; o.wrong: extra wrongs; o.lead: display */
  function expandPart(A, B, o) {
    o = o || {};
    var AB = P.mul(sum(A), sum(B)), T = o.k ? P.mul(o.k, AB) : AB;
    var lead = o.lead || br(A) + br(B);
    var ws = [];
    function sc(w) { return w ? { is: o.k ? P.mul(o.k, w.is) : w.is, code: w.code, hint: w.hint } : null; }
    ws.push(sc(wFoil(A, B))); ws.push(sc(wSecond(A, B)));
    if (A.length === 2) ws.push(sc(wMinusFirst(A, B)));
    if (o.exp !== false && P.degree(sum(A)) === 1 && P.degree(sum(B)) === 2) ws.push(sc(wExp(A, B)));
    ws = ws.concat(o.wrong || []);
    var sol = distSol(A, B, o.k ? br(A) + br(B) : lead, o.solOpt);
    if (o.k) sol = 'Multiply the two brackets first:<br>' + sol + '<br>Then multiply every term by ' + t(tx(o.k)) + ':<br>' + t(lead + '=' + tx(o.k) + '\\left(' + tx(AB) + '\\right)=' + tx(T, o.solOpt));
    return polyPart(o.prompt || t(lead), T, ws, (o.solPre || '') + sol, o.hints || H_BT, o.text || 'expand ' + plain(lead), o);
  }

  /* ---------------- figures ---------------- */
  function svgLab(s) { return String(s).replace(/\+/g, ' + ').replace(/(.)-/g, '$1 − ').replace(/^-/, '−').replace(/([a-z])/g, '<tspan font-style="italic">$1</tspan>'); }
  function boxSvg(o) {
    var S = o.S || 40, w = o.w * S, h = o.h * S, dx = o.d[0] * S, dy = o.d[1] * S, u0 = o.units ? 3 : 0, L = o.left ? 16 + 8.2 * (String(o.left).length + 2 + u0) : 16, R = o.right ? 8.2 * (String(o.right).length + 2 + u0) : 16, T = 10, B = o.bottom || o.right ? 30 : 10;
    var W = L + w + dx + R, H = T + dy + h + B, x0 = L, y0 = T + dy + h, u = o.units ? ' ' + o.units : '';
    function pt(p) { return (x0 + p[0]).toFixed(1) + ',' + (y0 - p[1]).toFixed(1); }
    function sh(p) { return [p[0] + dx, p[1] + dy]; }
    var A = [0, 0], Bp = [w, 0], C = [w, h], D = [0, h];
    var solid = 'M' + pt(A) + 'L' + pt(Bp) + 'L' + pt(C) + 'L' + pt(D) + 'Z M' + pt(D) + 'L' + pt(sh(D)) + 'L' + pt(sh(C)) + 'L' + pt(C) + ' M' + pt(Bp) + 'L' + pt(sh(Bp)) + 'L' + pt(sh(C));
    var dash = 'M' + pt(A) + 'L' + pt(sh(A)) + ' M' + pt(sh(A)) + 'L' + pt(sh(Bp)) + ' M' + pt(sh(A)) + 'L' + pt(sh(D));
    var s = '<svg class="fig-svg" viewBox="0 0 ' + Math.ceil(W) + ' ' + Math.ceil(H) + '" style="max-width:' + Math.min(440, Math.ceil(W * 1.05)) + 'px" role="img" aria-label="' + (o.aria || 'rectangular prism') + '" font-size="15" font-family="KaTeX_Main,\'Times New Roman\',serif">';
    s += '<path d="' + solid + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="' + dash + '" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="5 4"/>';
    if (o.bottom) s += '<text x="' + (x0 + w / 2).toFixed(1) + '" y="' + (y0 + 21) + '" text-anchor="middle" fill="currentColor">' + svgLab(o.bottom) + u + '</text>';
    if (o.left) s += '<text x="' + (x0 - 8) + '" y="' + (y0 - h / 2 + 5).toFixed(1) + '" text-anchor="end" fill="currentColor">' + svgLab(o.left) + u + '</text>';
    if (o.right) s += '<text x="' + (x0 + w + dx / 2 + 6).toFixed(1) + '" y="' + (y0 - dy / 2 + 17).toFixed(1) + '" text-anchor="start" fill="currentColor">' + svgLab(o.right) + u + '</text>';
    return s + '</svg>';
  }
  /* a student's work, line by line */
  function workTable(lines) {
    return '<table style="margin:6px 0 8px;border-collapse:collapse">' + lines.map(function (l) { return '<tr><td>' + t(l[0]) + '</td><td style="padding-left:18px">' + (l[1] || '') + '</td></tr>'; }).join('') + '</table>';
  }
  /* p evaluated at x = val, written term by term */
  function atTex(p, val, x) {
    return P.sorted(p).map(function (T, i) { var e = T.v[x] || 0, c = T.c[0], a = Math.abs(c); var cs = e === 0 ? String(a) : a === 1 ? '' : String(a); return (c < 0 ? '-' : i ? '+' : '') + cs + (e ? '(' + pv(val) + ')' + (e > 1 ? '^{' + e + '}' : '') : ''); }).join('');
  }
  function valAt(p, v, x) { var env = {}; env[x || 'x'] = v; return Math.round(P.at(P.lift(p), env)); }

  /* ---------------- Q15 / EP7 / EP8 student work ---------------- */
  function errLineMC(r) {
    var g = pickWhere(function () { return { k: r.int(2, 5), b: r.int(2, 5), c: r.int(1, 6) }; }, function (g) { return g.k !== g.b && g.k * g.b !== g.k + g.b; });
    var kind = r.pick(['L3', 'L3', 'L3', 'L2', 'L2', 'L1', 'OK']);
    var A = lin(1, g.k), B = quad(1, g.b, g.c), lead = br(A) + br(B), T = P.mul(sum(A), sum(B));
    var row1 = B.map(function (m) { return P.mul(A[0], m); }), row2 = B.map(function (m) { return P.mul(A[1], m); });
    var l1 = 'x' + br(B) + '+' + g.k + br(B), six = row1.concat(row2), l3 = T, note = '';
    if (kind === 'L1') { l1 = 'x' + br(B) + '+' + g.k + br([B[0], B[1]]); six = row1.concat(row2.slice(0, 2)); l3 = sum(six); note = 'In Line 1 the ' + t(g.k) + ' was multiplied by only ' + t(br([B[0], B[1]])) + ' — the ' + t('+' + g.c) + ' was dropped from the second bracket. Lines 2 and 3 follow correctly from that mistake, so the error is in <b>Line 1</b>.'; }
    if (kind === 'L2') { six = row1.concat([row2[0], M(g.k + g.b, 'x'), row2[2]]); l3 = sum(six); note = 'In Line 2, ' + t(g.k + '\\cdot ' + g.b + 'x') + ' was written as ' + t((g.k + g.b) + 'x') + ' (added instead of multiplied); it should be ' + t(g.k * g.b + 'x') + '. Line 3 collects Line 2 correctly, so the error is in <b>Line 2</b>.'; }
    if (kind === 'L3') { var off = r.pick([1, -1]), which = r.pick(['x', 'x', 'x2']); l3 = P.add(T, which === 'x' ? M(off, 'x') : M(off, 'x', 2)); note = 'Lines 1 and 2 are correct, but the ' + (which === 'x' ? t('x') : t('x^{2}')) + ' terms were collected wrongly in Line 3: ' + (which === 'x' ? t(g.c + 'x+' + g.k * g.b + 'x=' + (g.c + g.k * g.b) + 'x') : t(g.b + 'x^{2}+' + g.k + 'x^{2}=' + (g.b + g.k) + 'x^{2}')) + '. The error is in <b>Line 3</b>; it should read ' + t(tx(T)) + '.'; }
    if (kind === 'OK') note = 'Line 1 distributes both terms, Line 2 has all six products with the right signs, and Line 3 collects them correctly: ' + t(lead + '=' + tx(T)) + '. The expansion is <b>correct</b>.';
    var work = workTable([[lead, ''], ['=' + l1, 'Line 1'], ['=' + seq(six), 'Line 2'], ['=' + tx(l3), 'Line 3']]);
    var right = { L1: 0, L2: 1, L3: 2, OK: 3 }[kind];
    var opts = [{ html: 'There is an error in Line 1.', right: right === 0, why: 'Line 1 is correct: ' + t('x') + ' and ' + t(g.k) + ' each multiply the <b>whole</b> trinomial.' },
      { html: 'There is an error in Line 2.', right: right === 1, why: 'Check each of the six products in Line 2 against Line 1 — they are all right.' },
      { html: 'There is an error in Line 3.', right: right === 2, why: kind === 'OK' ? 'Collect the like terms of Line 2 yourself: you get the same as Line 3.' : 'Line 3 collects Line 2 correctly. The mistake happened earlier.' },
      { html: 'The expansion is correct.', right: right === 3, why: 'Expand ' + t(lead) + ' yourself and compare with each line.' }];
    return mc(r, 'A student expands ' + t(lead) + ' as shown.' + work + 'Which statement is true?', opts, note,
      ['Check one line at a time: does each line follow from the line above it?', 'Collect the like terms of Line 2 yourself and compare with Line 3.'], 'error line in ' + plain(lead) + ' [' + kind + ']', true);
  }

  /* ---------------- Q16 numerical response ---------------- */
  var NR_FORMS = [['a+b', function (a, b) { return a + b; }], ['a+b', function (a, b) { return a + b; }], ['a+b', function (a, b) { return a + b; }], ['b+c', function (a, b, c) { return b + c; }], ['a+c', function (a, b, c) { return a + c; }]];

  /* ---------------- cube in two stages (EP13, EP14) ---------------- */
  function cubeStages(A, v) {
    var sq = P.pow(sum(A), 2), cube = P.pow(sum(A), 3), a0 = HW.poly.terms(A[0])[0].c[0], b0 = HW.poly.terms(A[1])[0].c[0];
    var noMid = P.add(M(a0 * a0, v, 2), N(b0 * b0)), eachCube = P.add(M(a0 * a0 * a0, v, 3), N(b0 * b0 * b0));
    var mid = M(2 * a0 * b0, v);
    var p = KP.fields('Show both stages for ' + t(br(A) + '^{3}') + '.', [box('Stage 1: ' + t(br(A) + '^{2}='), [v], { name: 'Square' }), box('Stage 2: ' + t(br(A) + '^{3}='), [v], { name: 'Cube' })],
      [polyChk(sq, [{ is: noMid, code: 'square-middle', hint: t(br(A) + '^{2}=' + br(A) + br(A)) + ' has a middle term: ' + t('2(' + tx(A[0]) + ')(' + b0 + ')=' + tx(mid)) + '.' },
        { is: P.add(M(a0, v, 2), N(b0 * b0), mid), code: 'exp-mult', hint: 'Square the whole first term: ' + t('(' + tx(A[0]) + ')^{2}=' + tx(M(a0 * a0, v, 2))) + '.' }]),
        polyChk(cube, [{ is: eachCube, code: 'cube-each', hint: 'The cube doesn’t go onto each term. Multiply your square by ' + t(br(A)) + ' — six partial products.' },
          { is: P.mul(noMid, sum(A)), code: 'square-middle', hint: 'Check your square first: ' + t(br(A) + '^{2}=' + tx(sq)) + ' — it has a middle term.' }, wFoil(A, termsOf(sq))])],
      [tx(sq), tx(cube)], t(br(A) + '^{2}=' + tx(sq)) + ', ' + t(br(A) + '^{3}=' + tx(cube)),
      'Stage 1 (Lesson 4 special product): ' + t(br(A) + '^{2}=' + tx(sq)) + '<br>Stage 2 (binomial × trinomial):<br>' + distSol(A, termsOf(sq), br(A) + '\\left(' + tx(sq) + '\\right)'),
      ['Stage 1: square the binomial with ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + ' (don’t forget the middle term).', 'Stage 2: multiply that trinomial by ' + t(br(A)) + ' — six partial products, then collect.'], 'cube in stages ' + plain(br(A)) + '^3');
    p.bad = [[tx(noMid), tx(eachCube)]];
    return p;
  }

  /* ---------------- EP16: find the missing bracket ---------------- */
  function missingTri(r) {
    var g = pickWhere(function () { return { a: r.int(1, 5), b: r.int(-4, 4), c: r.int(-7, 7) }; }, function (g) { return g.b !== 0 && g.c !== 0 && cnt(P.mul(lin(1, g.a), quad(1, g.b, g.c))) === 4 && gcd(g.a, g.c) <= 3; });
    var A = lin(1, g.a), Q = quad(1, g.b, g.c), T = P.mul(sum(A), sum(Q)), x2 = co(T, { x: 2 }), c0 = co(T);
    return polyPart(t(br(A) + '\\left(\\rule{1.6cm}{0.4pt}\\right)=' + tx(T)) + '<br>Find the missing trinomial.', sum(Q), [
      { is: quad(1, x2, c0), code: 'u3l5-one-group', hint: 'The ' + t('x^{2}') + ' term of the answer comes from <b>two</b> products, ' + t('x\\cdot bx') + ' and ' + t(g.a + '\\cdot x^{2}') + '. Work out the constant first (' + t(g.a + '\\times c=' + c0) + '), then ' + t('b') + ' from ' + t('b+' + g.a + '=' + x2) + '.' },
      { is: quad(1, x2 - g.a, -g.c), code: 'sign', hint: 'Check the constant: ' + t(g.a + '\\times c=' + c0) + ', so ' + t('c=' + g.c) + '.' },
      { is: quad(1, -g.b, g.c), code: 'sign', hint: 'Check the middle term: the ' + t('x^{2}') + ' terms of the product are ' + t('bx^{2}+' + g.a + 'x^{2}=' + tx(M(x2, 'x', 2))) + ', so ' + t('b=' + x2 + '-' + g.a + '=' + g.b) + '.' }],
      'The missing bracket is a trinomial ' + t('x^{2}+bx+c') + ' (only ' + t('x\\cdot x^{2}') + ' gives ' + t('x^{3}') + ').<br>' +
      'Constant: only ' + t(g.a + '\\cdot c') + ' has no ' + t('x') + ', so ' + t(g.a + 'c=' + c0) + ' and ' + t('c=' + g.c) + '.<br>' +
      t('x^{2}') + ' terms: ' + t('x\\cdot bx+' + g.a + '\\cdot x^{2}=(b+' + g.a + ')x^{2}') + ', so ' + t('b+' + g.a + '=' + x2) + ' and ' + t('b=' + g.b) + '.<br>Check: ' + t(br(A) + br(Q) + '=' + tx(T)) + ' ✓',
      ['Start with the highest-degree term and the constant term — each comes from only one product.', 'Then use the ' + t('x^{2}') + ' term to find the middle coefficient.'], 'missing trinomial');
  }
  function missingBin(r) {
    var g = pickWhere(function () { return { p: r.int(2, 3), q: r.int(1, 5), b: r.int(1, 3), c: r.int(2, 6) }; }, function (g) { return gcd(g.p, g.q) === 1 && cnt(P.mul(lin(g.p, -g.q), quad(1, -g.b, g.c))) === 4; });
    var A = lin(g.p, -g.q), Q = quad(1, -g.b, g.c), T = P.mul(sum(A), sum(Q)), c0 = co(T);
    return polyPart(t('\\left(\\rule{1.6cm}{0.4pt}\\right)' + br(Q) + '=' + tx(T)) + '<br>Find the missing binomial.', sum(A), [
      { is: lin(g.p, g.q), code: 'u3l5-k-sign', hint: 'Check the constant: ' + t('(?)\\times ' + g.c + '=' + c0) + ', so the number in the binomial is ' + t(-g.q) + '.' },
      { is: lin(1, -g.q), code: 'value', hint: 'Check the first term: it times ' + t('x^{2}') + ' must give ' + t(tx(M(g.p, 'x', 3))) + '.' }],
      'The missing bracket is a binomial ' + t('px+q') + '.<br>' + t('px\\cdot x^{2}=' + tx(M(g.p, 'x', 3))) + ', so ' + t('p=' + g.p) + '. ' + t('q\\cdot ' + g.c + '=' + c0) + ', so ' + t('q=' + (-g.q)) + '.<br>Check: ' + distSol(A, Q, br(A) + br(Q)) + ' ✓',
      ['The ' + t('x^{3}') + ' term comes only from (first term) × ' + t('x^{2}') + '; the constant only from (number) × ' + t(g.c) + '.', 'Then check by expanding.'], 'missing binomial', { order: null, bad: [] });
  }

  HW.defineLesson({
    id: 'u3l5', unit: 3, num: '5', title: 'Multiplying a Binomial by a Trinomial', outcome: 'AN4',
    blurb: 'Six partial products every time — in a 2 × 3 grid or a list — then collect the two pairs of like terms. Watch the sign of each product on its own.',
    questions: [
      /* ---------- Part A ---------- */
      { num: '1', section: 'Part A — Six Partial Products, then Collect', stem: function (sh) { return 'Expand and simplify ' + t(sh.lead) + '. Use a grid (Example 2).'; },
        shared: function (r) {
          var g = pickWhere(function () { return { p: r.int(1, 4), b: r.int(1, 5), c: r.int(1, 6) }; }, function (g) { return g.b !== g.p && !(g.p === 2 && g.b === 4 && g.c === 5); }); // not Example 2
          var A = lin(1, g.p), B = quad(1, g.b, g.c);
          return { A: A, B: B, lead: br(A) + br(B) };
        },
        parts: [
          { id: '1grid', sub: 'a', level: 'BEG', make: function (r, sh) {
            return boxPart('Fill in all six boxes of the grid: ' + t(br(sh.A)) + ' down the side, ' + t(br(sh.B)) + ' along the top.', sh.A, sh.B, 'grid ' + plain(sh.lead),
              ['Each box is its row term times its column term — six boxes in all.', 'Multiply the numbers and add the exponents: ' + t('x\\cdot x^{2}=x^{3}') + ', ' + t('x\\cdot x=x^{2}') + '.']);
          } },
          { id: '1', sub: 'b', level: 'BEG', make: function (r, sh) {
            var T = P.mul(sum(sh.A), sum(sh.B));
            return polyPart('Add the six boxes and collect like terms.', T, [wFoil(sh.A, sh.B), wSecond(sh.A, sh.B), wExp(sh.A, sh.B)],
              'Fill each box with (row term) × (column term):' + grid(sh.A, sh.B, true) + 'Add the six boxes and collect like terms: ' + t(collectNote(partials(sh.A, sh.B))) + '<br>' + t(sh.lead + '=' + tx(T)),
              ['Add all six boxes.', 'There are two ' + t('x^{2}') + ' terms and two ' + t('x') + ' terms to collect.'], 'expand ' + plain(sh.lead), { before: t(sh.lead + '=') });
          } }] },
      { num: '2', stem: 'Expand and simplify. Use a grid or the distributive property.', parts: [
        { id: '2', level: 'BEG', make: function (r) {
          var g = pickWhere(function () { return { p: r.int(2, 6), b: r.pick([1, 1, 2, 3]), c: r.int(1, 5) }; }, function (g) { return g.b !== g.p; });
          return expandPart(lin(1, g.p), quad(1, g.b, g.c));
        } }] },
      { num: '3', stem: 'Expand and simplify.', parts: [
        { id: '3', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { b: r.int(1, 5), c: r.int(1, 5), q: r.pick([1, 1, 3]) }; }, function (g) { return gcd3(1, g.b, g.c) === 1; });
          return expandPart(lin(2, g.q), quad(1, g.b, g.c));
        } }] },
      { num: '4', stem: 'Expand and simplify.', parts: [
        { id: '4', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { q: r.pick([1, 2, 2, 4]), b: r.int(1, 4), c: r.int(1, 4) }; }, function (g) { return gcd(3, g.q) === 1; });
          return expandPart(lin(3, g.q), quad(1, g.b, g.c));
        } }] },
      { num: '5', stem: 'Expand and simplify.', parts: [
        { id: '5', level: 'BEG', make: function (r) {
          var g = pickWhere(function () { return { p: r.int(4, 7), b: r.int(2, 5), c: r.int(3, 8) }; }, function (g) { return g.b !== g.p; });
          return expandPart(lin(1, g.p), quad(1, g.b, g.c));
        } }] },
      { num: '6', stem: 'Expand and simplify.', parts: [
        { id: '6', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { k: r.pick([2, 2, 3]), q: r.int(1, 5), b: r.int(2, 5), c: r.int(1, 4) }; }, function (g) { return gcd(g.k, g.q) === 1 && g.q > 1; });
          return expandPart(lin(g.k, g.q), quad(1, g.b, g.c));
        } }] },
      /* ---------- Part B ---------- */
      { num: '7', section: 'Part B — Products with Negative Terms', stem: 'Expand and simplify. Check the sign of every partial product.', parts: [
        { id: '7', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(1, 5), b: r.int(1, 5), c: r.int(2, 6) }; }, function (g) { return g.a !== g.b && cnt(P.mul(lin(1, -g.a), quad(1, g.b, g.c))) === 4; });
          return expandPart(lin(1, -g.a), quad(1, g.b, g.c));
        } }] },
      { num: '8', stem: 'Expand and simplify. Check the sign of every partial product.', parts: [
        { id: '8', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 6), b: r.int(1, 4), c: r.int(1, 6) }; }, function (g) { return cnt(P.mul(lin(1, -g.a), quad(1, -g.b, g.c))) === 4; });
          return expandPart(lin(1, -g.a), quad(1, -g.b, g.c));
        } }] },
      { num: '9', stem: 'Expand and simplify. Check the sign of every partial product.', parts: [
        { id: '9', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { k: r.pick([2, 2, 3]), q: r.int(1, 3), b: r.int(1, 4), c: r.int(1, 5) }; }, function (g) { return gcd(g.k, g.q) === 1 && cnt(P.mul(lin(g.k, -g.q), quad(1, g.b, -g.c))) === 4; });
          return expandPart(lin(g.k, -g.q), quad(1, g.b, -g.c));
        } }] },
      { num: '10', stem: 'Expand and simplify. Check the sign of every partial product.', parts: [
        { id: '10', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { k: r.pick([2, 3, 3]), q: r.int(1, 4), b: r.int(1, 3), c: r.int(2, 6) }; }, function (g) { return gcd(g.k, g.q) === 1 && cnt(P.mul(lin(g.k, -g.q), quad(1, -g.b, g.c))) === 4; });
          return expandPart(lin(g.k, -g.q), quad(1, -g.b, g.c));
        } }] },
      { num: '11', stem: 'Expand and simplify. Check the sign of every partial product.', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(1, 6), b: r.int(1, 5), c: r.int(1, 5) }; }, function (g) { return g.a !== g.b && cnt(P.mul(lin(1, -g.a), quad(1, -g.b, -g.c))) === 4; });
          return expandPart(lin(1, -g.a), quad(1, -g.b, -g.c));
        } }] },
      { num: '12', stem: 'Expand and simplify. Check the sign of every partial product.', parts: [
        { id: '12', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { k: r.pick([2, 2, 3]), q: r.int(1, 5), b: r.int(1, 3), c: r.int(1, 4) }; }, function (g) { return gcd(g.k, g.q) === 1 && cnt(P.mul(lin(g.k, -g.q), quad(1, -g.b, -g.c))) >= 3; });
          return expandPart(lin(g.k, -g.q), quad(1, -g.b, -g.c));
        } }] },
      /* ---------- Part C ---------- */
      { num: '13', section: 'Part C — Combining and Extending', stem: 'Expand and simplify. Expand the product completely first, then combine it with the other polynomial.', parts: [
        { id: '13', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(1, 5), b: r.int(1, 4), c: r.int(1, 5), d: r.int(-5, 5), e: r.int(1, 7) }; }, function (g) { return g.d !== 0 && g.a !== g.b; });
          var A = lin(1, g.a), B = quad(1, g.b, g.c), C = quad(1, g.d, g.e), X = P.mul(sum(A), sum(B)), T = P.add(X, sum(C)), lead = br(A) + br(B) + '+' + br(C);
          return polyPart(t(lead), T, [{ is: P.add(wFoil(A, B).is, sum(C)), code: 'foil-only', hint: wFoil(A, B).hint }, { is: X, code: 'value', hint: 'You expanded the product — now add ' + t(br(C)) + ' too.' }, { is: P.mul(sum(A), P.add(sum(B), sum(C))), code: 'value', hint: 'Only the trinomial right after ' + t(br(A)) + ' is multiplied. Expand that product first, then <b>add</b> ' + t(br(C)) + '.' }],
            distSol(A, B, br(A) + br(B)) + '<br>Now add ' + t(br(C)) + ': ' + t('\\left(' + tx(X) + '\\right)+' + br(C) + '=' + tx(T)),
            ['Expand ' + t(br(A) + br(B)) + ' first (six products), and collect.', 'Then add the other polynomial: collect like terms again.'], 'expand ' + plain(lead));
        } }] },
      { num: '14', stem: 'Expand and simplify. A subtraction sign in front of a bracket changes the sign of <b>every</b> term inside it.', parts: [
        { id: '14', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(1, 5), b: r.int(1, 3), c: r.int(1, 4), d: r.int(1, 3), e: r.int(-4, 4), f: r.int(1, 6) }; }, function (g) { return g.e !== 0 && cnt(P.sub(P.mul(lin(1, -g.a), quad(1, g.b, g.c)), quad(g.d, g.e, g.f))) === 4; });
          var A = lin(1, -g.a), B = quad(1, g.b, g.c), C = quad(g.d, g.e, g.f), X = P.mul(sum(A), sum(B)), T = P.sub(X, sum(C)), lead = br(A) + br(B) + '-' + br(C);
          var badFirst = P.add(X, sum(C), M(-2 * g.d, 'x', 2));
          return polyPart(t(lead), T, [{ is: badFirst, code: 'minus-first', hint: 'The minus sign in front of ' + t(br(C)) + ' changes the sign of <b>every</b> term: ' + t('-' + br(C) + '=' + tx(P.neg(sum(C)))) + '.' },
            { is: P.add(X, sum(C)), code: 'added-prod', hint: 'There is a minus sign in front of ' + t(br(C)) + ': subtract it.' }, { is: P.sub(wFoil(A, B).is, sum(C)), code: 'foil-only', hint: wFoil(A, B).hint }],
            distSol(A, B, br(A) + br(B)) + '<br>Subtract every term of ' + t(br(C)) + ': ' + t('-' + br(C) + '=' + tx(P.neg(sum(C)))) + '<br>' + t('\\left(' + tx(X) + '\\right)-' + br(C) + '=' + tx(X) + signedTex(P.neg(sum(C)), false).replace(/^\+\+/, '+') + '=' + tx(T)),
            ['Expand the product first and collect.', 'Then change the sign of every term in ' + t(br(C)) + ' and collect again.'], 'expand ' + plain(lead));
        } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'EMG', make: function (r) { return errLineMC(r); } }] },
      { num: '16', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '16', level: 'ADV', make: function (r) {
          var fm = r.pick(NR_FORMS);
          var g = pickWhere(function () { return { p: r.int(1, 4), b: r.int(1, 3), c: -r.int(1, 3), q: r.int(1, 3), d: r.int(1, 3), e: r.int(2, 5) }; }, function (g) {
            var S = P.add(P.mul(lin(1, g.p), quad(1, g.b, g.c)), P.mul(lin(1, -g.q), quad(1, -g.d, g.e)));
            var v = fm[1](co(S, { x: 3 }), co(S, { x: 2 }), co(S, { x: 1 })); return v >= 1 && v <= 60 && cnt(S) === 4;
          });
          var A1 = lin(1, g.p), B1 = quad(1, g.b, g.c), A2 = lin(1, -g.q), B2 = quad(1, -g.d, g.e);
          var X1 = P.mul(sum(A1), sum(B1)), X2 = P.mul(sum(A2), sum(B2)), S = P.add(X1, X2);
          function val(Q) { return fm[1](co(Q, { x: 3 }), co(Q, { x: 2 }), co(Q, { x: 1 })); }
          var ans = val(S), a = co(S, { x: 3 }), b = co(S, { x: 2 }), c = co(S, { x: 1 }), d = co(S);
          var diags = [[val(P.sub(X1, X2)), 'added-prod', 'The two products are <b>added</b>, not subtracted.'], [val(P.add(wFoil(A1, B1).is, wFoil(A2, B2).is)), 'foil-only', 'Each product has ' + t('2\\times 3=6') + ' partial products — don’t skip the middle term of the trinomial.'],
            [val(X1), 'value', 'That uses only the first product. Add the second product too.']];
          return KP.nr('Adding the product of ' + t(br(A1)) + ' and ' + t(br(B1)) + ' to the product of ' + t(br(A2)) + ' and ' + t(br(B2)) + ' gives a polynomial of the form ' + t('ax^{3}+bx^{2}+cx+d') + '. The value of ' + t(fm[0]) + ' is ________.', ans,
            function (v) { for (var i = 0; i < diags.length; i++) if (v === diags[i][0] && v !== ans) return { code: diags[i][1], hint: diags[i][2] }; return null; },
            t(br(A1) + br(B1) + '=' + seq(partials(A1, B1)) + '=' + tx(X1)) + '<br>' + t(br(A2) + br(B2) + '=' + seq(partials(A2, B2)) + '=' + tx(X2)) +
            '<br>Sum: ' + t(tx(S)) + ', so ' + t('a=' + a + ',\\ b=' + b + ',\\ c=' + c + ',\\ d=' + d) + ' and ' + t(fm[0] + '=' + ans) + '.',
            ['Expand each product (six partial products each), then add them and collect.', 'Read ' + t('a') + ', ' + t('b') + ', ' + t('c') + ' from your answer, signs included.'], 'NR sum of products, ' + fm[0]);
        } }] }
    ],

    extra: [
      /* ---------- EP Part A ---------- */
      { num: '1', section: 'Extra practice A — Leading coefficients in both brackets', stem: 'Both brackets have a coefficient in front of the variable. Expand and simplify, writing each answer in <b>descending order of degree</b>.', parts: [
        { id: 'e1a', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { p: r.int(2, 3), q: r.int(1, 5), a: r.int(2, 3), b: r.int(1, 3), c: r.int(1, 5) }; }, function (g) { return gcd(g.p, g.q) === 1 && gcd3(g.a, g.b, g.c) === 1 && cnt(P.mul(lin(g.p, -g.q), quad(g.a, g.b, -g.c))) === 4; });
          return expandPart(lin(g.p, -g.q), quad(g.a, g.b, -g.c), { order: 'desc', var: 'x' });
        } },
        { id: 'e1b', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { p: r.int(2, 4), q: r.int(1, 3), a: r.int(2, 3), b: r.int(1, 4), c: r.int(1, 6) }; }, function (g) { return gcd(g.p, g.q) === 1 && gcd3(g.a, g.b, g.c) === 1 && cnt(P.mul(lin(g.p, g.q), quad(g.a, -g.b, g.c))) === 4; });
          return expandPart(lin(g.p, g.q), quad(g.a, -g.b, g.c), { order: 'desc', var: 'x' });
        } }] },
      { num: '2', stem: 'Expand and simplify, in descending order of degree.', parts: [
        { id: 'e2a', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { p: r.int(2, 3), q: r.int(1, 4), a: r.int(2, 3), b: r.int(2, 5), c: r.int(1, 3) }; }, function (g) { return gcd(g.p, g.q) === 1 && gcd3(g.a, g.b, g.c) === 1 && cnt(P.mul(lin(g.p, -g.q), quad(g.a, -g.b, -g.c))) === 4; });
          return expandPart(lin(g.p, -g.q), quad(g.a, -g.b, -g.c), { order: 'desc', var: 'x' });
        } },
        { id: 'e2b', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { p: r.int(3, 5), q: r.int(1, 3), a: r.int(2, 3), b: r.int(1, 3), c: r.int(1, 3) }; }, function (g) { return gcd(g.p, g.q) === 1 && gcd3(g.a, g.b, g.c) === 1 && cnt(P.mul(lin(g.p, g.q), quad(g.a, g.b, -g.c))) === 4; });
          return expandPart(lin(g.p, g.q), quad(g.a, g.b, -g.c), { order: 'desc', var: 'x' });
        } }] },
      { num: '3', stem: 'Expand and simplify, in descending order of degree.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { p: r.int(2, 3), q: r.int(1, 5), a: r.int(2, 4), b: r.int(1, 3), c: r.int(1, 4) }; }, function (g) { return gcd(g.p, g.q) === 1 && gcd3(g.a, g.b, g.c) === 1 && cnt(P.mul(lin(g.p, g.q), quad(g.a, -g.b, g.c))) === 4; });
          return expandPart(lin(g.p, g.q), quad(g.a, -g.b, g.c), { order: 'desc', var: 'x' });
        } },
        { id: 'e3b', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { p: r.int(3, 6), b: r.int(1, 3), c: r.int(1, 4) }; }, function (g) { return cnt(P.mul(lin(g.p, -1), quad(1, -g.b, -g.c))) === 4; });
          return expandPart(lin(g.p, -1), quad(1, -g.b, -g.c), { order: 'desc', var: 'x' });
        } }] },
      { num: '4', stem: function (sh) { return '<b>Before you multiply.</b> Think about the product ' + t(sh.lead) + '.'; },
        shared: function (r) {
          var g = pickWhere(function () { return { p: r.int(2, 4), q: r.int(1, 5), a: r.int(2, 3), b: r.int(1, 3), c: r.int(2, 6) }; }, function (g) { return gcd(g.p, g.q) === 1 && gcd3(g.a, g.b, g.c) === 1 && cnt(P.mul(lin(g.p, g.q), quad(g.a, -g.b, g.c))) === 4 && g.a * g.q !== g.p * g.b; });
          var A = lin(g.p, g.q), B = quad(g.a, -g.b, g.c); return { A: A, B: B, lead: br(A) + br(B) };
        },
        parts: [
          { id: 'e4a', level: 'BEG', make: function (r, sh) {
            return KP.number('<b>Without expanding</b>: how many partial products does a binomial times a trinomial give before any like terms are collected?', 6, function (v) {
              if (v === 5) return { code: 'u3l5-sum-not-prod', hint: 'Every term of the binomial meets every term of the trinomial: ' + t('2\\times 3') + ', not ' + t('2+3') + '.' };
              if (v === 4) return { code: 'foil-only', hint: 'That’s FOIL — two terms times two terms. Here the second bracket has <b>three</b> terms.' };
              return null;
            }, 'Each of the ' + t('2') + ' binomial terms multiplies each of the ' + t('3') + ' trinomial terms: ' + t('2\\times 3=6') + ' partial products.',
              ['Each term of the first bracket multiplies each term of the second.'], 'count partial products');
          } },
          { id: 'e4b', level: 'EMG', make: function (r, sh) {
            return KP.fields('<b>Without expanding</b> ' + t(sh.lead) + ': what is the degree of the simplified answer, and <b>at most</b> how many terms can it have once like terms are collected?', [nbox('Degree:', 'Degree'), nbox('Number of terms (at most):', 'Terms')],
              [intChk(3, function (v) { return v === 2 ? { code: 'exp-mult', hint: 'The highest term is ' + t('x\\cdot x^{2}') + ': add the exponents, ' + t('1+2=3') + '.' } : v === 6 ? { code: 'value', hint: 'The degree is the highest power of ' + t('x') + ', not the number of products.' } : null; }),
                intChk(4, function (v) { return v === 6 ? { code: 'u3l5-no-collect', hint: 'Six products before collecting — but two pairs are like terms. After collecting: one ' + t('x^{3}') + ', one ' + t('x^{2}') + ', one ' + t('x') + ' and one constant.' } : null; })],
              ['3', '4'], 'Degree ' + t('3') + ', at most ' + t('4') + ' terms',
              'The highest-degree product is ' + t('x\\cdot x^{2}=x^{3}') + ', so the degree is ' + t('3') + '.<br>The six products are one ' + t('x^{3}') + ' term, two ' + t('x^{2}') + ' terms, two ' + t('x') + ' terms and one constant, so collecting leaves at most ' + t('4') + ' terms (fewer if a pair cancels).',
              ['Which two terms multiply to give the highest power?', 'Sort the six products by kind: how many kinds of term are there?'], 'degree and terms');
          } },
          { id: 'e4c', level: 'EMG', make: function (r, sh) {
            var T = P.mul(sum(sh.A), sum(sh.B)), c2 = co(T, { x: 2 }), f = wFoil(sh.A, sh.B);
            return KP.fields('Now expand and simplify ' + t(sh.lead) + ', and state the coefficient of ' + t('x^{2}') + ' in your answer.', [box(t(sh.lead + '='), ['x'], { name: 'Expansion' }), nbox('Coefficient of ' + t('x^{2}') + ':', 'Coefficient of x²')],
              [polyChk(T, [f, wSecond(sh.A, sh.B)]), intChk(c2, function (v) { var a1 = co(P.mul(sh.A[0], sh.B[1]), { x: 2 }), a2 = co(P.mul(sh.A[1], sh.B[0]), { x: 2 }); return v === a1 || v === a2 ? { code: 'u3l5-one-group', hint: 'Two products give ' + t('x^{2}') + ': ' + t(tx(P.mul(sh.A[0], sh.B[1]))) + ' and ' + t(tx(P.mul(sh.A[1], sh.B[0]))) + '. Add them.' } : null; })],
              [tx(T), String(c2)], t(tx(T)) + '; coefficient of ' + t('x^{2}') + ' is ' + t(c2),
              distSol(sh.A, sh.B, sh.lead) + '<br>The coefficient of ' + t('x^{2}') + ' is ' + t(c2) + '.', H_BT, 'expand ' + plain(sh.lead));
          } }] },
      /* ---------- EP Part B ---------- */
      { num: '5', section: 'Extra practice B — Negative signs throughout', stem: 'The trinomial (or the binomial) can start with a negative term. Find the sign of <b>each</b> of the six products separately, then collect.', parts: [
        { id: 'e5a', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(1, 5), b: r.int(2, 5), c: r.int(1, 6) }; }, function (g) { return g.a !== g.b && cnt(P.mul(lin(1, -g.a), quad(-1, g.b, -g.c))) === 4; });
          return expandPart(lin(1, -g.a), quad(-1, g.b, -g.c));
        } },
        { id: 'e5b', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { p: r.int(2, 3), q: r.int(1, 3), b: r.int(1, 4), c: r.int(2, 6) }; }, function (g) { return gcd(g.p, g.q) === 1 && cnt(P.mul(lin(-g.p, g.q), quad(1, -g.b, -g.c))) === 4; });
          return expandPart(lin(-g.p, g.q), quad(1, -g.b, -g.c));
        } }] },
      { num: '6', stem: 'Expand and simplify. Find the sign of each partial product on its own.', parts: [
        { id: 'e6a', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(1, 5), b: r.int(1, 4), c: r.int(2, 7) }; }, function (g) { return cnt(P.mul(lin(-1, -g.a), quad(-1, -g.b, g.c))) >= 3; });
          return expandPart(lin(-1, -g.a), quad(-1, -g.b, g.c));
        } },
        { id: 'e6b', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { p: r.int(2, 3), q: r.int(1, 7), a: r.int(2, 3), b: r.int(1, 3), c: r.int(1, 4) }; }, function (g) { return gcd(g.p, g.q) === 1 && gcd3(g.a, g.b, g.c) === 1 && cnt(P.mul(lin(g.p, -g.q), quad(-g.a, g.b, -g.c))) === 4; });
          return expandPart(lin(g.p, -g.q), quad(-g.a, g.b, -g.c));
        } }] },
      { num: '7', stem: function (sh) { return '<b>Error analysis.</b> Jasleen expanded ' + t(sh.lead) + ' as shown. Her answer is wrong.' + workTable([[sh.lead, ''], ['=' + seq(sh.five), 'Line 1'], ['=' + tx(sum(sh.five)), 'Line 2']]); },
        shared: function (r) {
          var g = pickWhere(function () { return { k: r.int(2, 6), b: r.int(2, 4), c: r.int(1, 5) }; }, function (g) { return g.k !== g.b && g.c !== g.k * g.b; });
          var A = lin(1, g.k), B = quad(1, g.b, g.c), all = partials(A, B), miss = r.pick([4, 4, 2, 3]), five = all.filter(function (m, i) { return i !== miss; });
          return { A: A, B: B, lead: br(A) + br(B), all: all, miss: miss, five: five, T: P.mul(sum(A), sum(B)), g: g };
        },
        parts: [
          { id: 'e7a', level: 'BEG', make: function (r, sh) {
            return KP.fields('How many partial products should Line 1 contain, and how many does it contain?', [nbox('Should contain:', 'Should contain'), nbox('Line 1 contains:', 'Contains')],
              [intChk(6, function (v) { return v === 5 ? { code: 'u3l5-sum-not-prod', hint: t('2\\times 3') + ', not ' + t('2+3') + '.' } : null; }), intChk(5)], ['6', '5'], t('6') + ' needed, ' + t('5') + ' written',
              'A binomial × trinomial has ' + t('2\\times 3=6') + ' partial products. Line 1 has only ' + t('5') + '.', ['Count the terms in Line 1.'], 'count Jasleen’s products');
          } },
          { id: 'e7b', level: 'EMG', make: function (r, sh) {
            var m = sh.all[sh.miss], i = Math.floor(sh.miss / 3), j = sh.miss % 3;
            return polyPart('Write the partial product she left out.', m, [{ is: P.neg(m), code: 'sign', hint: 'Both factors are positive here.' }],
              'The six products are ' + t(seq(sh.all)) + '. Line 1 is missing ' + t('(' + tx(sh.A[i]) + ')(' + tx(sh.B[j]) + ')=' + tx(m)) + '.',
              ['List the six products: ' + t('x') + ' times each trinomial term, then ' + t(sh.g.k) + ' times each trinomial term.', 'Which one isn’t in Line 1?'], 'missing product');
          } },
          { id: 'e7c', level: 'BEG', make: function (r, sh) {
            return polyPart('Write the corrected expansion of ' + t(sh.lead) + '.', sh.T, [{ is: sum(sh.five), code: 'student-ans', hint: 'That’s Jasleen’s answer — one product is still missing.' }, wFoil(sh.A, sh.B)],
              distSol(sh.A, sh.B, sh.lead), H_BT, 'correct ' + plain(sh.lead));
          } }] },
      { num: '8', stem: function (sh) { return '<b>Error analysis.</b> Owen expanded ' + t(sh.lead) + ' as shown.' + workTable([[sh.lead, ''], ['=' + seq(sh.owen), 'Line 1'], ['=' + tx(sum(sh.owen)), 'Line 2']]); },
        shared: function (r) {
          var g = pickWhere(function () { return { k: r.int(2, 5), b: r.int(2, 5), c: r.int(1, 5) }; }, function (g) { return g.k !== g.b && cnt(P.mul(lin(1, -g.k), quad(1, -g.b, g.c))) === 4; });
          var A = lin(1, -g.k), B = quad(1, -g.b, g.c), owen = partials([A[0], N(g.k)], B);
          return { A: A, B: B, lead: br(A) + br(B), owen: owen, T: P.mul(sum(A), sum(B)), g: g };
        },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r, sh) {
            var k = sh.g.k, wrong3 = sh.owen.slice(3).map(function (m) { return t(tx(m)); }).join(', '), right3 = partials([sh.A[1]], sh.B).map(function (m) { return t(tx(m)); }).join(', ');
            return mc(r, 'Which of Owen’s six partial products are wrong, and why?', [
              { html: 'The last three (' + wrong3 + '): he multiplied by ' + t('+' + k) + ' instead of ' + t('-' + k) + '.', right: true },
              { html: 'The first three: ' + t('x') + ' should not multiply every term.', why: t('x\\cdot x^{2}') + ', ' + t('x\\cdot(-' + sh.g.b + 'x)') + ' and ' + t('x\\cdot ' + sh.g.c) + ' are all correct.' },
              { html: 'Only the last one: ' + t(k + '\\cdot ' + sh.g.c) + ' should be negative.', why: 'Check all three products from the second term: the sign of ' + t('-' + k) + ' flips each of them.' },
              { html: 'None — only the collecting in Line 2 is wrong.', why: 'Compare each product with what ' + t('-' + k) + ' times each trinomial term really gives.' }],
              'The second term of the binomial is ' + t('-' + k) + ', but Owen used ' + t('+' + k) + '. So all three products from it have the wrong sign: they should be ' + right3 + '.',
              ['Look at the products that come from the second term of the binomial. What sign is that term?'], 'Owen’s error');
          } },
          { id: 'e8b', level: 'EMG', make: function (r, sh) {
            return polyPart('Write the corrected expansion of ' + t(sh.lead) + '.', sh.T, [{ is: sum(sh.owen), code: 'student-ans', hint: 'That’s Owen’s answer. The second term is ' + t('-' + sh.g.k) + ': it changes the sign of all three of its products.' }, wMinusFirst(sh.A, sh.B), wFoil(sh.A, sh.B)],
              distSol(sh.A, sh.B, sh.lead), H_BT, 'correct ' + plain(sh.lead));
          } }] },
      /* ---------- EP Part C ---------- */
      { num: '9', section: 'Extra practice C — Two variables: a result worth remembering', stem: function (sh) { return 'Nothing changes with a second variable: ' + t(sh.u + '\\cdot ' + sh.v + '=' + sh.u + sh.v) + ', and ' + t(sh.u + sh.v) + ' terms collect only with other ' + t(sh.u + sh.v) + ' terms. Expand and simplify completely.'; },
        shared: function (r) { var pr = r.pick(PAIRS); return { u: pr[0], v: pr[1] }; },
        parts: [
          { id: 'e9a', level: 'PRG', make: function (r, sh) {
            var u = sh.u, v = sh.v, o = function (a, b) { var x = {}; if (a) x[u] = a; if (b) x[v] = b; return x; };
            var A = lin2(1, u, 1, v), B = [MM(1, o(2, 0)), MM(-1, o(1, 1)), MM(1, o(0, 2))];
            return expandPart(A, B, { vars: [u, v], exp: false, hints: ['Multiply ' + t(u) + ' by all three terms, then ' + t(v) + ' by all three terms.', 'Collect: ' + t(u + '^{2}' + v) + ' terms with each other, ' + t(u + v + '^{2}') + ' terms with each other. Something surprising happens.'] });
          } },
          { id: 'e9b', level: 'PRG', make: function (r, sh) {
            var u = sh.u, v = sh.v, o = function (a, b) { var x = {}; if (a) x[u] = a; if (b) x[v] = b; return x; };
            var A = lin2(1, u, -1, v), B = [MM(1, o(2, 0)), MM(1, o(1, 1)), MM(1, o(0, 2))];
            return expandPart(A, B, { vars: [u, v], exp: false, hints: ['Multiply ' + t(u) + ' by all three terms, then ' + t('-' + v) + ' by all three terms.', 'Collect the ' + t(u + '^{2}' + v) + ' terms and the ' + t(u + v + '^{2}') + ' terms.'] });
          } },
          { id: 'e9c', level: 'EMG', make: function (r, sh) {
            var u = sh.u, v = sh.v;
            return mc(r, 'Both answers are only two terms long. What happened to the four middle terms, and which two patterns have you shown? (They are the <b>sum</b> and <b>difference of cubes</b>.)', [
              { html: 'The two ' + t(u + '^{2}' + v) + ' terms are opposites and cancel, and so do the two ' + t(u + v + '^{2}') + ' terms: ' + t('(' + u + '+' + v + ')(' + u + '^{2}-' + u + v + '+' + v + '^{2})=' + u + '^{3}+' + v + '^{3}') + ' and ' + t('(' + u + '-' + v + ')(' + u + '^{2}+' + u + v + '+' + v + '^{2})=' + u + '^{3}-' + v + '^{3}') + '.', right: true },
              { html: 'The middle terms are all zero because ' + t(u + v + '=0') + '.', why: t(u) + ' and ' + t(v) + ' can be any numbers. The terms cancel in <b>pairs</b>.' },
              { html: 'The middle terms cancel, giving ' + t('(' + u + '+' + v + ')(' + u + '^{2}-' + u + v + '+' + v + '^{2})=' + u + '^{3}-' + v + '^{3}') + '.', why: 'Look at the last product: ' + t(v + '\\cdot ' + v + '^{2}=+' + v + '^{3}') + '.' },
              { html: 'FOIL was used, so the middle terms were never formed.', why: 'All six products were formed — four of them cancel in pairs.' }],
              'In ' + t('(' + u + '+' + v + ')(' + u + '^{2}-' + u + v + '+' + v + '^{2})') + ' the products ' + t('-' + u + '^{2}' + v) + ' and ' + t('+' + u + '^{2}' + v) + ' cancel, and so do ' + t('+' + u + v + '^{2}') + ' and ' + t('-' + u + v + '^{2}') + ', leaving ' + t(u + '^{3}+' + v + '^{3}') + '. The same happens with the signs swapped, leaving ' + t(u + '^{3}-' + v + '^{3}') + '.',
              ['Write out all six products of one of them and pair up the like terms.'], 'sum and difference of cubes');
          } }] },
      { num: '10', stem: 'Each product is a disguised version of one of the patterns from question 9. Expand and simplify.',
        shared: function (r) { var pr = r.pick(PAIRS), k = r.int(2, 4), j; do { j = r.int(2, 3); } while (j === k && r.chance(0.5)); return { u: pr[0], v: pr[1], k: k, j: j }; },
        parts: [
          { id: 'e10a', level: 'PRG', make: function (r, sh) {
            var u = sh.u, v = sh.v, k = sh.k, o = function (a, b) { var x = {}; if (a) x[u] = a; if (b) x[v] = b; return x; };
            var A = [MM(1, o(1, 0)), MM(k, o(0, 1))], B = [MM(1, o(2, 0)), MM(-k, o(1, 1)), MM(k * k, o(0, 2))];
            return expandPart(A, B, { vars: [u, v], exp: false, wrong: [{ is: P.add(MM(1, o(3, 0)), MM(k, o(0, 3))), code: 'cube-each', hint: 'The last product is ' + t(k + v + '\\cdot ' + k * k + v + '^{2}') + ': multiply the numbers too, ' + t(k + '\\times ' + k * k + '=' + k * k * k) + '.' }],
              hints: ['Expand fully: six products, and four of them cancel in pairs.', 'The last product is ' + t('(' + k + v + ')(' + k * k + v + '^{2})') + '.'] });
          } },
          { id: 'e10b', level: 'PRG', make: function (r, sh) {
            var u = sh.u, v = sh.v, k = sh.j, o = function (a, b) { var x = {}; if (a) x[u] = a; if (b) x[v] = b; return x; };
            var A = [MM(k, o(1, 0)), MM(-1, o(0, 1))], B = [MM(k * k, o(2, 0)), MM(k, o(1, 1)), MM(1, o(0, 2))];
            return expandPart(A, B, { vars: [u, v], exp: false, wrong: [{ is: P.sub(MM(k, o(3, 0)), MM(1, o(0, 3))), code: 'cube-each', hint: 'The first product is ' + t(k + u + '\\cdot ' + k * k + u + '^{2}') + ': ' + t(k + '\\times ' + k * k + '=' + k * k * k) + '.' }],
              hints: ['Expand fully: six products, and four of them cancel in pairs.', 'The first product is ' + t('(' + k + u + ')(' + k * k + u + '^{2})') + '.'] });
          } },
          { id: 'e10c', level: 'EMG', make: function (r, sh) {
            var u = sh.u, v = sh.v, k = sh.k, j = sh.j;
            return mc(r, 'Which pattern did each product match: (a) ' + t('(' + u + '+' + k + v + ')(' + u + '^{2}-' + k + u + v + '+' + k * k + v + '^{2})') + ' and (b) ' + t('(' + j + u + '-' + v + ')(' + j * j + u + '^{2}+' + j + u + v + '+' + v + '^{2})') + '?', [
              { html: '(a) is a <b>sum</b> of cubes with ' + t(k + v) + ' in place of ' + t(v) + '; (b) is a <b>difference</b> of cubes with ' + t(j + u) + ' in place of ' + t(u) + '.', right: true },
              { html: '(a) is a difference of cubes; (b) is a sum of cubes.', why: 'Look at the sign in each binomial: (a) has ' + t('+') + ', (b) has ' + t('-') + '.' },
              { html: 'Both are sums of cubes.', why: 'Check the sign between the two cubes in your answer to (b).' },
              { html: 'Neither — the numbers stop them matching the patterns.', why: 'Your answers to (a) and (b) have only two terms each, just like question 9.' }],
              '(a) ' + t('(' + u + '+' + k + v + ')(' + u + '^{2}-' + k + u + v + '+' + k * k + v + '^{2})=' + u + '^{3}+' + k * k * k + v + '^{3}=' + u + '^{3}+(' + k + v + ')^{3}') + ': a sum of cubes.<br>(b) ' + t('(' + j + u + '-' + v + ')(' + j * j + u + '^{2}+' + j + u + v + '+' + v + '^{2})=' + j * j * j + u + '^{3}-' + v + '^{3}=(' + j + u + ')^{3}-' + v + '^{3}') + ': a difference of cubes.',
              ['Compare the sign in each binomial with the patterns in question 9.'], 'which cube pattern');
          } }] },
      { num: '11', stem: 'These look like question 10 but do <b>not</b> match either pattern. Expand and simplify.',
        shared: function (r) {
          var pr = r.pick(PAIRS), u = pr[0], v = pr[1], o = function (a, b) { var x = {}; if (a) x[u] = a; if (b) x[v] = b; return x; };
          var g = pickWhere(function () { return { a: r.int(2, 3), b: r.int(1, 3), c: r.int(2, 6) }; }, function (g) { return !(g.b === g.a && g.c === g.a * g.a) && cnt(P.mul(sum([MM(1, o(1, 0)), MM(g.a, o(0, 1))]), sum([MM(1, o(2, 0)), MM(-g.b, o(1, 1)), MM(g.c, o(0, 2))]))) === 4; });
          var pr2 = r.pick(PAIRS), p = pr2[0], q = pr2[1], o2 = function (a, b) { var x = {}; if (a) x[p] = a; if (b) x[q] = b; return x; };
          var h = pickWhere(function () { return { a: r.int(2, 3), b: r.int(1, 4), c: r.int(1, 3) }; }, function (h) { return cnt(P.mul(sum([MM(h.a, o2(1, 0)), MM(-1, o2(0, 1))]), sum([MM(1, o2(2, 0)), MM(h.b, o2(1, 1)), MM(-h.c, o2(0, 2))]))) === 4; });
          return { u: u, v: v, p: p, q: q, A1: [MM(1, o(1, 0)), MM(g.a, o(0, 1))], B1: [MM(1, o(2, 0)), MM(-g.b, o(1, 1)), MM(g.c, o(0, 2))],
            A2: [MM(h.a, o2(1, 0)), MM(-1, o2(0, 1))], B2: [MM(1, o2(2, 0)), MM(h.b, o2(1, 1)), MM(-h.c, o2(0, 2))] };
        },
        parts: [
          { id: 'e11a', level: 'PRG', make: function (r, sh) { return expandPart(sh.A1, sh.B1, { vars: [sh.u, sh.v], exp: false }); } },
          { id: 'e11b', level: 'PRG', make: function (r, sh) { return expandPart(sh.A2, sh.B2, { vars: [sh.p, sh.q], exp: false }); } },
          { id: 'e11c', level: 'EMG', make: function (r, sh) {
            return mc(r, 'In (a) ' + t(br(sh.A1) + br(sh.B1)) + ' and (b) ' + t(br(sh.A2) + br(sh.B2)) + ' the middle terms do <b>not</b> all cancel. Why do they survive this time?', [
              { html: 'The trinomial isn’t the exact partner of the binomial: in the patterns, its last term is the square of the binomial’s second term and its middle term is the product of the two terms with the opposite sign — that is what makes the middle products opposites.', right: true },
              { html: 'Because the second variable has a coefficient.', why: 'Question 10 had coefficients too, and the middle terms still cancelled.' },
              { html: 'Because there are only four partial products this time.', why: 'There are still ' + t('2\\times 3=6') + ' products. They just don’t cancel in pairs.' },
              { html: 'Because the answer can never have more than two terms.', why: 'Your answers have four terms — the pattern only gives two terms when the brackets are exact partners.' }],
              'In ' + t('(x+y)(x^{2}-xy+y^{2})') + ' the middle products are ' + t('-x^{2}y') + ' and ' + t('+x^{2}y') + ' (and ' + t('+xy^{2}') + ', ' + t('-xy^{2}') + '): they cancel only because the trinomial is built from the binomial — last term ' + t('y^{2}') + ' (the square of ' + t('y') + '), middle term ' + t('-xy') + '. Change those numbers and the middle products no longer match.',
              ['Compare the trinomial with the one in question 9: is its last term the square of the binomial’s second term?'], 'why the middle terms survive');
          } }] },
      /* ---------- EP Part D ---------- */
      { num: '12', section: 'Extra practice D — Monomials in front, and cubing a binomial', stem: 'A monomial in front makes this a three-factor product. Multiply the two brackets first, then distribute the monomial over every term. The degree climbs to 4.', parts: [
        { id: 'e12a', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { m: r.int(2, 4), a: r.int(1, 4), b: r.int(1, 4), c: r.int(1, 5) }; }, function (g) { return cnt(P.mul(lin(1, g.a), quad(1, -g.b, g.c))) >= 3 && g.a !== g.b; });
          var A = lin(1, g.a), B = quad(1, -g.b, g.c), k = M(g.m, 'x'), AB = P.mul(sum(A), sum(B));
          return expandPart(A, B, { k: k, lead: tx(k) + br(A) + br(B), wrong: [{ is: P.mul(N(g.m), AB), code: 'no-x', hint: 'Don’t forget the ' + t('x') + ' in ' + t(tx(k)) + ': every term goes up one degree.' }, { is: AB, code: 'const-lost', hint: 'Multiply every term by ' + t(tx(k)) + ' at the end.' }, { is: P.add(AB, P.mul(k, termsOf(AB)[0]), P.neg(termsOf(AB)[0])), code: 'only-last', hint: t(tx(k)) + ' multiplies <b>every</b> term, not just the first.' }] });
        } },
        { id: 'e12b', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { m: r.int(2, 4), a: r.int(1, 4), b: r.int(1, 3), c: r.int(1, 4) }; }, function (g) { return cnt(P.mul(lin(1, -g.a), quad(1, g.b, -g.c))) === 4; });
          var A = lin(1, -g.a), B = quad(1, g.b, -g.c), k = M(-g.m, 'x'), AB = P.mul(sum(A), sum(B));
          return expandPart(A, B, { k: k, lead: tx(k) + br(A) + br(B), wrong: [{ is: P.mul(N(-g.m), AB), code: 'no-x', hint: 'Don’t forget the ' + t('x') + ' in ' + t(tx(k)) + '.' }, { is: P.mul(M(g.m, 'x'), AB), code: 'sign', hint: 'The monomial is ' + t(tx(k)) + ' — negative — so every sign changes.' }, { is: AB, code: 'const-lost', hint: 'Multiply every term by ' + t(tx(k)) + ' at the end.' }] });
        } }] },
      { num: '13', stem: function () { return '<b>Cubing a binomial.</b> ' + t('(x+1)^{3}') + ' means ' + t('(x+1)(x+1)(x+1)') + '. Square first using the Lesson 4 special product, which turns it into a binomial times a trinomial: ' + t('(x+1)^{3}=(x+1)(x^{2}+2x+1)') + '.'; },
        parts: [
          { id: 'e13a', level: 'EMG', make: function (r) { var v = r.pick(LETTERS); return cubeStages(lin(1, r.int(2, 6), v), v); } },
          { id: 'e13b', level: 'EMG', make: function (r) { var v = r.pick(LETTERS); return cubeStages(lin(1, -r.int(1, 5), v), v); } }] },
      { num: '14', stem: 'Cube each binomial with the same two-stage method. Take care with the coefficients when you square.', parts: [
        { id: 'e14a', level: 'PRG', make: function (r) { var v = r.pick(LETTERS), pq = pickWhere(function () { return [r.int(2, 3), r.int(1, 3)]; }, function (a) { return gcd(a[0], a[1]) === 1; }); return cubeStages(lin(pq[0], -pq[1], v), v); } },
        { id: 'e14b', level: 'PRG', make: function (r) { var v = r.pick(LETTERS), pq = pickWhere(function () { return [r.int(2, 3), r.int(1, 3)]; }, function (a) { return gcd(a[0], a[1]) === 1; }); return cubeStages(lin(pq[0], pq[1], v), v); } }] },
      { num: '15', stem: function (sh) { return '<b>Checking by substitution.</b> An expansion is an identity: the original expression and the simplified answer give the same value for every number substituted. Consider ' + t(sh.lead) + '.'; },
        shared: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 3), c: r.int(1, 4), x0: r.pick([2, 2, 3, -1]) }; }, function (g) { return g.a !== g.x0 && cnt(P.mul(lin(1, -g.a), quad(1, g.b, -g.c))) === 4 && (g.x0 * g.x0 + g.b * g.x0 - g.c) !== 0; });
          var A = lin(1, -g.a), B = quad(1, g.b, -g.c);
          return { A: A, B: B, lead: br(A) + br(B), T: P.mul(sum(A), sum(B)), g: g };
        },
        parts: [
          { id: 'e15a', level: 'EMG', make: function (r, sh) { return expandPart(sh.A, sh.B, { prompt: 'Expand and simplify ' + t(sh.lead) + '.' }); } },
          { id: 'e15b', level: 'BEG', make: function (r, sh) {
            var x0 = sh.g.x0, f1 = x0 - sh.g.a, f2 = x0 * x0 + sh.g.b * x0 - sh.g.c, v = f1 * f2;
            var wrongT = P.add(sh.T, M(1, 'x')), vw = valAt(wrongT, x0);
            var p = KP.fields('Evaluate at ' + t('x=' + x0) + ': the <b>original</b> expression (work out each bracket first) and your <b>expanded</b> answer.', [nbox('Original ' + t(sh.lead) + ' at ' + t('x=' + x0) + ':', 'Original'), nbox('Expanded answer at ' + t('x=' + x0) + ':', 'Expanded')],
              [intChk(v, function (z) { return z === -v ? { code: 'sign', hint: 'Check the sign: the first bracket is ' + t(pv(f1)) + '.' } : null; }), intChk(v, function (z) { return z === -v ? { code: 'sign', hint: 'Use brackets when you substitute: ' + t('(' + pv(x0) + ')^{3}') + '.' } : null; })],
              [String(v), String(v)], 'Both give ' + t(v),
              'Original: ' + t('(' + pv(x0) + '-' + sh.g.a + ')(' + pv(x0) + '^{2}+' + sh.g.b + '(' + pv(x0) + ')-' + sh.g.c + ')=(' + f1 + ')(' + f2 + ')=' + v) + '<br>Expanded: ' + t(atTex(sh.T, x0, 'x') + '=' + v) + '<br>The two values agree ✓',
              ['Replace every ' + t('x') + ' with ' + t(pv(x0)) + ' (in brackets). Work out each bracket of the original, then multiply.', 'If the two values don’t match, the expansion has an error.'], 'check at x=' + x0);
            p.bad = [[String(v), String(vw === v ? v + 1 : vw)].map(String), [String(-v), String(-v)]];
            return p;
          } },
          { id: 'e15c', level: 'EMG', make: function (r, sh) {
            return mc(r, 'A classmate says a check that works at ' + t('x=' + sh.g.x0) + ' <b>proves</b> the expansion is correct. Which response is best?', [
              { html: 'One check is good evidence, not a proof: a wrong expansion can still give the right value at one particular number. Checking a few more values (like ' + t('x=0') + ', ' + t('x=1') + ', ' + t('x=-1') + ') makes it more convincing; re-expanding carefully is the real proof.', right: true },
              { html: 'The classmate is right: if one value works, every value works.', why: 'Different polynomials can agree at one number. For example ' + t('x^{2}') + ' and ' + t('2x') + ' are both ' + t('4') + ' at ' + t('x=2') + '.' },
              { html: 'A substitution check is useless; only the answer key can tell.', why: 'A check that <b>fails</b> proves there is an error, and several that pass are strong evidence.' },
              { html: 'The check only works if you substitute ' + t('x=0') + '.', why: t('x=0') + ' only tests the constant term — it is the weakest check, not the only one.' }],
              'Two different polynomials can give the same value at one number (e.g. ' + t('x^{2}') + ' and ' + t('2x') + ' at ' + t('x=2') + '), so one matching value can’t prove the expansion. Testing several values makes it very likely to be right; a failed test proves it is wrong.',
              ['Can two different expressions give the same value at one number?'], 'one check is not a proof');
          } }] },
      /* ---------- EP Part E ---------- */
      { num: '16', section: 'Extra practice E — Working backwards, volume, and a stretch', stem: '<b>Find the missing bracket.</b> A binomial and a trinomial were multiplied to give the polynomial shown. Start with the highest-degree term and the constant term — each comes from only one product.', parts: [
        { id: 'e16a', level: 'ADV', make: function (r) { return missingTri(r); } },
        { id: 'e16b', level: 'MAS', make: function (r) { return missingBin(r); } }] },
      { num: '17', stem: function (sh) { return '<b>Volume.</b> A rectangular box has height ' + t('x') + ' cm, width ' + t('(x+' + sh.a + ')') + ' cm and length ' + t('(x+' + sh.b + ')') + ' cm.' + boxSvg({ w: 2.6, h: 1.5, d: [1.1, 0.7], bottom: 'x+' + sh.b, left: 'x', right: 'x+' + sh.a, units: 'cm', aria: 'rectangular box' }); },
        shared: function (r) { var a = r.int(1, 5), b; do { b = r.int(2, 7); } while (b === a); return { a: a, b: b, X: r.int(2, 5) }; },
        parts: [
          { id: 'e17a', level: 'BEG', make: function (r, sh) {
            var A = lin(1, sh.a), B = lin(1, sh.b), T = P.mul(sum(A), sum(B));
            return polyPart('Multiply the width and the length to get a trinomial for the area of the base (in cm²).', T, [{ is: P.add(M(1, 'x', 2), N(sh.a * sh.b)), code: 'fl-only', hint: 'You need all four products (FOIL): the Outer and Inner give the ' + t('x') + ' terms.' }, { is: P.add(sum(A), sum(B)), code: 'perimeter', hint: 'Area multiplies the two lengths — don’t add them.' }],
              t(br(A) + br(B) + '=' + seq(partials(A, B)) + '=' + tx(T)) + ' cm²', ['Area of the base = width × length. Use FOIL.'], 'base area');
          } },
          { id: 'e17b', level: 'EMG', make: function (r, sh) {
            var Bs = P.mul(sum(lin(1, sh.a)), sum(lin(1, sh.b))), T = P.mul(Bs, M(1, 'x'));
            return polyPart('Multiply that trinomial by the height to get a polynomial for the volume (in cm³), in descending order.', T, [{ is: Bs, code: 'face-area', hint: 'That is the area of the base. Multiply it by the height ' + t('x') + '.' }, { is: P.add(Bs, M(1, 'x')), code: 'two-dims', hint: 'Multiply by the height — don’t add it.' }],
              t('V=x\\left(' + tx(Bs) + '\\right)=' + tx(T)) + ' cm³', ['Volume = (area of base) × height. Multiply every term of the trinomial by ' + t('x') + '.'], 'box volume', { order: 'desc', var: 'x', before: t('V=') });
          } },
          { id: 'e17c', level: 'BEG', make: function (r, sh) {
            var X = sh.X, V = X * (X + sh.a) * (X + sh.b), T = P.mul(M(1, 'x'), lin(1, sh.a), lin(1, sh.b));
            return KP.fields('Find the volume when ' + t('x=' + X) + ' cm using your polynomial, then check it by multiplying the three actual dimensions.', [nbox('Volume from the polynomial (cm³):', 'From the polynomial'), nbox('Product of the three dimensions (cm³):', 'Product of dimensions')],
              [intChk(V, function (v) { return v === (X + sh.a) * (X + sh.b) ? { code: 'face-area', hint: 'That is the base area. Multiply by the height too.' } : null; }), intChk(V, function (v) { return v === (X + sh.a) * (X + sh.b) ? { code: 'two-dims', hint: 'Multiply all <b>three</b> dimensions.' } : null; })],
              [String(V), String(V)], 'Both ' + t(V) + ' cm³',
              'Polynomial: ' + t(atTex(T, X, 'x') + '=' + V) + '<br>Dimensions: ' + t(X + '\\times ' + (X + sh.a) + '\\times ' + (X + sh.b) + '=' + V) + ' ✓',
              ['Substitute ' + t('x=' + X) + ' into ' + t('x^{3}') + ', ' + t('x^{2}') + ' and ' + t('x') + '.', 'The dimensions at ' + t('x=' + X) + ' are ' + t(X) + ', ' + t(X + '+' + sh.a) + ' and ' + t(X + '+' + sh.b) + '.'], 'volume at x=' + X);
          } },
          { id: 'e17d', level: 'EMG', make: function (r, sh) {
            return mc(r, 'Why can’t ' + t('x') + ' be ' + t('0') + ' or a negative number here?', [
              { html: t('x') + ' is the height of a real box, and a length must be positive. At ' + t('x=0') + ' the box would have no height and no volume.', right: true },
              { html: 'Because the polynomial can’t be evaluated at ' + t('x=0') + '.', why: 'You can substitute ' + t('0') + ' into any polynomial (you get ' + t('0') + ' here). The problem is the measurement, not the algebra.' },
              { html: 'Because negative numbers can’t be cubed.', why: 'They can: ' + t('(-2)^{3}=-8') + '. The issue is that a length can’t be negative.' },
              { html: 'Because ' + t('x') + ' must be bigger than ' + t(sh.b) + '.', why: 'Any positive ' + t('x') + ' gives a real box — all three dimensions are then positive.' }],
              t('x') + ' is a length (the height). A length must be positive, so ' + t('x>0') + '; ' + t('x=0') + ' would flatten the box to nothing, and a negative ' + t('x') + ' has no meaning as a measurement.',
              ['What does ' + t('x') + ' measure in this box?'], 'x must be positive');
          } }] },
      { num: '18', stem: '<b>Targeting one coefficient.</b> Sometimes only one coefficient is needed, and expanding everything is wasted work.', parts: [
        { id: 'e18a', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { p: r.int(2, 3), q: r.int(2, 5), a: r.int(2, 3), b: r.int(1, 4), c: r.int(1, 3) }; }, function (g) { return gcd(g.p, g.q) === 1 && gcd3(g.a, g.b, g.c) === 1 && g.p * g.b !== g.q * g.a; });
          var A = lin(g.p, -g.q), B = quad(g.a, g.b, -g.c), T = P.mul(sum(A), sum(B)), c2 = co(T, { x: 2 }), c0 = co(T), lead = br(A) + br(B);
          var p = KP.fields('In the expansion of ' + t(lead) + ', find the coefficient of ' + t('x^{2}') + ' and the constant term <b>without</b> writing out all six products.', [nbox('Coefficient of ' + t('x^{2}') + ':', 'Coefficient of x²'), nbox('Constant term:', 'Constant term')],
            [intChk(c2, function (v) { return v === g.p * g.b || v === -g.q * g.a ? { code: 'u3l5-one-group', hint: 'Two products give ' + t('x^{2}') + ': ' + t('(' + g.p + 'x)(' + g.b + 'x)') + ' and ' + t('(-' + g.q + ')(' + g.a + 'x^{2})') + '. Add them.' } : v === g.p * g.b + g.q * g.a ? { code: 'sign', hint: t('(-' + g.q + ')(' + g.a + 'x^{2})') + ' is negative.' } : null; }),
              intChk(c0, function (v) { return v === -c0 ? { code: 'sign', hint: 'A negative times a negative is positive: ' + t('(-' + g.q + ')(-' + g.c + ')') + '.' } : null; })],
            [String(c2), String(c0)], t('x^{2}') + ' coefficient ' + t(c2) + ', constant ' + t(c0),
            t('x^{2}') + ' comes only from ' + t('(' + g.p + 'x)(' + g.b + 'x)=' + g.p * g.b + 'x^{2}') + ' and ' + t('(-' + g.q + ')(' + g.a + 'x^{2})=' + (-g.q * g.a) + 'x^{2}') + ': ' + t(g.p * g.b + '-' + g.q * g.a + '=' + c2) + '.<br>The constant comes only from ' + t('(-' + g.q + ')(-' + g.c + ')=' + c0) + '.<br>(Full expansion, for checking: ' + t(tx(T)) + '.)',
            ['Which pairs of terms multiply to give ' + t('x^{2}') + '? (degree 1 × degree 1, and degree 0 × degree 2)', 'Only the two numbers multiply to give the constant.'], 'target coefficients');
          p.bad = [[String(g.p * g.b), String(c0)], [String(c2), String(-c0)]];
          return p;
        } },
        { id: 'e18b', level: 'MAS', make: function (r) {
          var g = pickWhere(function () { return { k: r.int(1, 6), b: r.int(2, 4), c: r.int(1, 5) }; }, function (g) { return g.k * g.b - g.c > 0 && g.k !== g.b && cnt(P.mul(lin(1, g.k), quad(1, g.b, -g.c))) === 4; });
          var A = lin(1, g.k), B = quad(1, g.b, -g.c), T = P.mul(sum(A), sum(B)), c1 = co(T, { x: 1 });
          var p = KP.fields('In the expansion of ' + t('(x+k)' + br(B)) + ', the coefficient of ' + t('x') + ' is ' + t(c1) + '. Determine ' + t('k') + ', then write the full expansion.', [nbox(t('k='), 'k'), box('Full expansion:', ['x'], { name: 'Expansion' })],
            [intChk(g.k, function (v) { return v === (c1 + g.c) && g.b !== 1 ? { code: 'value', hint: t(g.b + 'k-' + g.c + '=' + c1) + ' gives ' + t(g.b + 'k=' + (c1 + g.c)) + ': now divide by ' + t(g.b) + '.' } : v === (c1 - g.c) / g.b ? { code: 'u3l5-k-sign', hint: 'The other ' + t('x') + ' product is ' + t('x\\cdot(-' + g.c + ')=-' + g.c + 'x') + ', so ' + t(g.b + 'k-' + g.c + '=' + c1) + '.' } : null; }), polyChk(T, [wFoil(A, B)])],
            [String(g.k), tx(T)], t('k=' + g.k) + '; ' + t(tx(T)),
            'The ' + t('x') + ' terms come from ' + t('x\\cdot(-' + g.c + ')=-' + g.c + 'x') + ' and ' + t('k\\cdot ' + g.b + 'x=' + g.b + 'kx') + '.<br>So ' + t(g.b + 'k-' + g.c + '=' + c1) + ', ' + t(g.b + 'k=' + (c1 + g.c)) + ', ' + t('k=' + g.k) + '.<br>' + distSol(A, B, br(A) + br(B)) + ' — it has ' + t(c1 + 'x') + ' ✓',
            ['Which two of the six products give an ' + t('x') + ' term? Write their sum in terms of ' + t('k') + '.', 'Set that sum equal to ' + t(c1) + ' and solve.'], 'find k from the x coefficient');
          p.bad = [[String((c1 - g.c) / g.b), tx(T)]];
          return p;
        } }] },
      { num: '19', stem: '<b>Stretch.</b> The same distributive idea, past three terms.', parts: [
        { id: 'e19a', level: 'ADV', make: function (r) {
          var v = r.pick(LETTERS), k = r.int(1, 3), s = r.pick([1, -1]);
          var A = lin(1, s * k, v), B = [M(1, v, 3), M(-s * k, v, 2), M(k * k, v), N(-s * k * k * k)], T = P.mul(sum(A), sum(B)), lead = br(A) + br(B);
          var p = KP.fields('Expand and simplify ' + t(lead) + '. How many partial products are there this time?', [nbox('Number of partial products:', 'Partial products'), box(t(lead + '='), [v], { name: 'Expansion' })],
            [intChk(8, function (n) { return n === 6 ? { code: 'u3l5-sum-not-prod', hint: 'The second bracket has <b>four</b> terms, and each meets both terms of the first: ' + t('2\\times 4') + ', not ' + t('2+4') + '.' } : null; }), polyChk(T)],
            ['8', tx(T)], t('8') + ' products; ' + t(tx(T)),
            t('2\\times 4=8') + ' partial products.<br>' + distSol(A, B, lead) + '<br>Every middle pair cancels, leaving only two terms.',
            ['Each of the 2 terms multiplies each of the 4 terms.', 'Line up the like terms: they cancel in pairs.'], 'eight products ' + plain(lead));
          return p;
        } },
        { id: 'e19b', level: 'ADV', make: function (r) {
          var pr = r.pick(PAIRS), u = pr[0], v = pr[1], o = function (a, b) { var x = {}; if (a) x[u] = a; if (b) x[v] = b; return x; };
          var plus = P.pow(P.add(M(1, u), M(1, v)), 3), minus = P.pow(P.sub(M(1, u), M(1, v)), 3);
          return KP.fields('Show that ' + t('(' + u + '+' + v + ')^{3}=' + u + '^{3}+3' + u + '^{2}' + v + '+3' + u + v + '^{2}+' + v + '^{3}') + ' by squaring ' + t('(' + u + '+' + v + ')') + ' first and then multiplying the trinomial by ' + t('(' + u + '+' + v + ')') + '. Then use the result to write ' + t('(' + u + '-' + v + ')^{3}') + ' (replace ' + t(v) + ' with ' + t('-' + v) + ').',
            [box(t('(' + u + '+' + v + ')^{2}='), [u, v], { name: 'Square' }), box(t('(' + u + '-' + v + ')^{3}='), [u, v], { name: '(a−b)³' })],
            [polyChk(P.pow(P.add(M(1, u), M(1, v)), 2), [{ is: P.add(M(1, u, 2), M(1, v, 2)), code: 'square-middle', hint: 'Don’t forget the middle term ' + t('2' + u + v) + '.' }]),
              polyChk(minus, [{ is: P.sub(M(1, u, 3), M(1, v, 3)), code: 'cube-each', hint: 'Four terms, not two: use ' + t(u + '^{3}+3' + u + '^{2}' + v + '+3' + u + v + '^{2}+' + v + '^{3}') + ' with ' + t('-' + v) + ' in place of ' + t(v) + '.' },
                { is: plus, code: 'sign', hint: 'Replacing ' + t(v) + ' with ' + t('-' + v) + ' flips the sign of every term with an <b>odd</b> power of ' + t(v) + '.' }, { is: P.sub(P.sub(M(1, u, 3), MM(3, o(2, 1))), P.sub(MM(3, o(1, 2)), M(1, v, 3))), code: 'sign', hint: 'Only the terms with an odd power of ' + t(v) + ' change sign: ' + t('(-' + v + ')^{2}=+' + v + '^{2}') + '.' }])],
            [tx(P.pow(P.add(M(1, u), M(1, v)), 2)), tx(minus)], t('(' + u + '+' + v + ')^{2}=' + u + '^{2}+2' + u + v + '+' + v + '^{2}') + '; ' + t('(' + u + '-' + v + ')^{3}=' + tx(minus)),
            t('(' + u + '+' + v + ')^{2}=' + u + '^{2}+2' + u + v + '+' + v + '^{2}') + '<br>' + t('(' + u + '+' + v + ')(' + u + '^{2}+2' + u + v + '+' + v + '^{2})=' + u + '^{3}+2' + u + '^{2}' + v + '+' + u + v + '^{2}+' + u + '^{2}' + v + '+2' + u + v + '^{2}+' + v + '^{3}=' + tx(plus)) +
            '<br>Replace ' + t(v) + ' with ' + t('-' + v) + ': the terms with ' + t(v) + ' or ' + t(v + '^{3}') + ' (odd powers) change sign, so ' + t('(' + u + '-' + v + ')^{3}=' + tx(minus)) + '.',
            ['Square first: ' + t('(' + u + '+' + v + ')^{2}') + ' has three terms.', 'For the difference, an odd power of ' + t('-' + v) + ' is negative and an even power is positive.'], 'cube of a sum and a difference');
        } }] }
    ]
  });
})(window);
