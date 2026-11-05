/* Math 15 · Unit 3 (Polynomial Operations, AN4) — exit slips for Lessons 1–7 (u3l1x … u3l7x), written in test mode.
 * Each slip is Ryan's own Math 15 exit slip for that lesson (his older exit-slip app, Versions A and B), turned into
 * generators: the same questions, skills and levels (his tags), with his Version A and B numbers among the possible values.
 * Every part has a key built from the generated values, a worked solution, hints, and `bad` answers with u3x- codes
 * (his wrong-answer tags became the codes; his "not fully collected" feedback is the engine's 'form' nudge).
 * Where his slip had only Beginning/Progressing questions (Lessons 1–5), one short Mastery question was added at Math 15
 * difficulty, taken from the lesson's hardest assignment items (a missing side from a perimeter, a missing number in a
 * distribution, a difference of two binomial products, a perfect square worked backwards, a product minus a trinomial).
 * His two multiple-choice questions (like terms; which pattern) stay multiple choice: they test recognition.
 * Lesson 6: his lawn question had two parts at different levels (expression MAS, value PRG); they are now two questions,
 * each with its own lawn and figure, because each question gets its own numbers. No calculator. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, PL = HW.poly, t = K.t, wrong = K.wrong;

  HW.addCodes({
    'u3x-coef-one': 'Collected an x-term as if the unwritten coefficient 1 were not there', 'u3x-lost-sign': 'Lost the minus sign in front of a term when collecting',
    'u3x-const-sign': 'Sign slip combining the constants', 'u3x-term-sign': 'Sign slip combining the x-terms',
    'u3x-added-c': 'Added the polynomial that should be subtracted', 'u3x-first-sign': 'Subtracted a bracket but changed only its first sign',
    'u3x-one-sign': 'Subtracted a bracket but left one of its signs unchanged',
    'u3x-tri-one': 'Third side: subtracted only one of the given sides', 'u3x-tri-added': 'Third side: added the given sides to the perimeter',
    'u3x-tri-sign': 'Third side: a constant’s sign not changed when subtracting a side',
    'u3x-exp-mult': 'Multiplied the exponents instead of adding them', 'u3x-coef-add': 'Added the coefficients instead of multiplying them', 'u3x-prod-sign': 'Sign of a product wrong',
    'u3x-first-only': 'Multiplied only the first term in the bracket', 'u3x-drop-x': 'Dropped the variable of the monomial on a product',
    'u3x-drop-coef': 'Dropped the number of the monomial on a product', 'u3x-xx-x': 'Wrote x × x as x (not x²)',
    'u3x-miss-other': 'Missing number: ignored the x-term from the other bracket', 'u3x-miss-sign': 'Missing number: sign slip with the other bracket’s x-term',
    'u3x-miss-nodiv': 'Missing number: didn’t divide by the coefficient in front',
    'u3x-fl-only': 'Two binomials: only First and Last (no middle term)', 'u3x-one-middle': 'Two binomials: one of the two middle products missing',
    'u3x-last-sign': 'Wrong sign on the product of the last terms', 'u3x-last-add': 'Added the last terms instead of multiplying', 'u3x-io-sign': 'Sign slip on a middle (Outside or Inside) product',
    'u3x-sub-first': 'Subtracted a product but changed only its first sign', 'u3x-added': 'Added a product that should be subtracted',
    'u3x-no-middle': 'Squared a binomial as a² + b² (no middle term)', 'u3x-middle-once': 'Square of a binomial: middle term not doubled',
    'u3x-last-neg': 'Square of a binomial: last term made negative', 'u3x-mid-sign': 'Square of a binomial: wrong sign on the middle term',
    'u3x-ps-dos': 'Used the difference of squares pattern on a square', 'u3x-dsq-plus': 'Sum × difference: + between the squares',
    'u3x-coef-sq': 'Squared the variable but not its coefficient', 'u3x-doubled': 'Doubled instead of squaring',
    'u3x-ps-half': 'Perfect square backwards: didn’t halve the middle coefficient', 'u3x-ps-asign': 'Perfect square backwards: number with the wrong sign',
    'u3x-c-unsq': 'Perfect square backwards: last term not squared',
    'u3x-p-sign': 'Binomial × trinomial: sign slip on one product', 'u3x-second-partial': 'Binomial × trinomial: second term of the binomial not multiplied into the trinomial',
    'u3x-foil-only': 'Binomial × trinomial: only four of the six products', 'u3x-collect-sign': 'Sign slip collecting the x-terms',
    'u3x-prod-only': 'Expanded the product but left out the other polynomial',
    'u3x-outer-only': 'Gave the whole outer area (nothing subtracted)', 'u3x-gave-part': 'Gave the cut-out area instead of what is left',
    'u3x-sub-x2': 'Left the x² term that cancels', 'u3x-k-inside': 'Multiplied the height in before squaring', 'u3x-k-lost': 'Forgot to multiply by the height',
    'u3x-add-h': 'Added the height instead of multiplying'
  });
  HW.addPartial({
    'u3x-coef-one': 's', 'u3x-lost-sign': 's', 'u3x-const-sign': 's', 'u3x-term-sign': 's',
    'u3x-added-c': 'b', 'u3x-first-sign': 'b', 'u3x-one-sign': 's', 'u3x-tri-one': 'n', 'u3x-tri-added': 'n', 'u3x-tri-sign': 's',
    'u3x-exp-mult': 'b', 'u3x-coef-add': 'b', 'u3x-prod-sign': 's', 'u3x-first-only': 'b', 'u3x-drop-x': 'b', 'u3x-drop-coef': 'b', 'u3x-xx-x': 'b',
    'u3x-miss-other': 'b', 'u3x-miss-sign': 's', 'u3x-miss-nodiv': 'b',
    'u3x-fl-only': 'b', 'u3x-one-middle': 'b', 'u3x-last-sign': 's', 'u3x-last-add': 'b', 'u3x-io-sign': 's', 'u3x-sub-first': 'b', 'u3x-added': 'b',
    'u3x-no-middle': 'b', 'u3x-middle-once': 'b', 'u3x-last-neg': 'b', 'u3x-mid-sign': 's', 'u3x-ps-dos': 'n', 'u3x-dsq-plus': 'b', 'u3x-coef-sq': 'b', 'u3x-doubled': 'n',
    'u3x-ps-half': 'b', 'u3x-ps-asign': 's', 'u3x-c-unsq': 'b',
    'u3x-p-sign': 's', 'u3x-second-partial': 'b', 'u3x-foil-only': 'b', 'u3x-collect-sign': 's', 'u3x-prod-only': 'b',
    'u3x-outer-only': 'n', 'u3x-gave-part': 'n', 'u3x-sub-x2': 's', 'u3x-k-inside': 'b', 'u3x-k-lost': 's', 'u3x-add-h': 'n'
  });

  /* ---------- polynomial helpers ---------- */
  function V(v, e) { var o = {}; o[v || 'x'] = e == null ? 1 : e; return PL.mono(1, o); }
  function T(c, v, e) { if (!e) return PL.num(c); var o = {}; o[v] = e; return PL.mono(c, o); } // c·v^e
  function M(c, vars) { return PL.mono(c, vars || {}); }
  function N(c) { return PL.num(c); }
  function lin(a, b, v) { return PL.add(T(a, v || 'x', 1), N(b)); }
  var add = PL.add, mul = PL.mul, sub = PL.sub, neg = PL.neg, scale = PL.scale;
  function tx(p) { return PL.tex(p); }
  function seq(list) { return PL.seq(list); }
  function br(p) { return '(' + tx(p) + ')'; }
  function pf(p) { var s = tx(p); return PL.count(p) > 1 || s.charAt(0) === '-' ? '(' + s + ')' : s; }
  function sumOf(list) { return add.apply(null, list); }
  function lab(p, i) { var s = tx(p); return i > 0 && s.charAt(0) !== '-' ? '+' + s : s; }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function pickWhere(gen, test) { for (var i = 0; i < 3000; i++) { var v = gen(); if (v && test(v)) return v; } throw new Error('u3 exits: no instance found'); }
  function coefs(p, v, n) { var o = []; for (var e = n; e >= 0; e--) { var w = {}; if (e) w[v] = e; var c = PL.coef(p, w); o.push(c[0] / c[1]); } return o; }
  function allNz(p, v, n) { return coefs(p, v, n).every(function (c) { return c !== 0 && Math.abs(c) <= 99; }); }
  function sgn(n) { return n < 0 ? '-' + (-n) : '+' + n; }
  function cat(a, b) { return b.charAt(0) === '-' ? a + b : a + '+' + b; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function cx(c, v) { return c === 1 ? v : c === -1 ? '-' + v : c + v; } // 3x, x, -x
  function up(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* wrong answers: those equal to the key (or to each other) are dropped */
  function wlist(target, ws) {
    var seen = [PL.lift(target)], W = [];
    (ws || []).forEach(function (w) { if (!w || !w.is) return; var p = PL.lift(w.is); if (seen.some(function (s) { return PL.eq(s, p); })) return; seen.push(p); W.push({ is: p, code: w.code, hint: w.hint }); });
    return W;
  }
  /* the given expression typed back unchanged would be "right value, wrong form" (2/3): mark it wrong, no credit */
  function givenGuard(prompt, chk, msg) {
    var gs = (String(prompt).replace(/<svg[\s\S]*?<\/svg>/g, '').match(/\\\(([\s\S]*?)\\\)/g) || []).map(function (m) { var q = HW.ex.parse(m.slice(2, -2)); return q.ok ? JSON.stringify(q.ast) : null; }).filter(Boolean);
    return function (resp) {
      var res = chk(resp);
      if (res && res.v === 'form' && typeof resp === 'string') { var q = HW.ex.parse(resp); if (q.ok && gs.indexOf(JSON.stringify(q.ast)) >= 0) return wrong('unchanged', msg || 'That is the expression you were given. <b>Expand</b> it: multiply out the brackets, then collect like terms.'); }
      return res;
    };
  }
  function pp(prompt, target, ws, sol, hints, text, opt) {
    opt = opt || {};
    var W = wlist(target, ws), part = KP.poly(prompt, target, Object.assign({}, opt, { wrong: W }), sol, hints, text);
    part.check = givenGuard(prompt, part.check, opt.guard);
    part.bad = W.map(function (w) { return tx(w.is); });
    return part;
  }
  function nbox(label, extra) { return Object.assign({ label: label, name: label.replace(/\\\(|\\\)|<[^>]+>/g, '').replace(/:$/, '') }, extra || {}); }
  function cleanAlts(ans, alts) { var seen = [ans], out = []; alts.forEach(function (a) { if (!a || typeof a.v !== 'number' || !isFinite(a.v) || seen.indexOf(a.v) >= 0) return; seen.push(a.v); out.push(a); }); return out; }
  function numChk(ans, alts) { alts = cleanAlts(ans, alts); return K.number(ans, function (v) { for (var i = 0; i < alts.length; i++) if (v === alts[i].v) return { code: alts[i].code, hint: alts[i].hint }; return null; }); }
  function numPart(prompt, ans, alts, sol, hints, text, inp) {
    alts = cleanAlts(ans, alts);
    var p = KP.number(prompt, ans, function (v) { for (var i = 0; i < alts.length; i++) if (v === alts[i].v) return { code: alts[i].code, hint: alts[i].hint }; return null; }, sol, hints, text, inp);
    p.bad = alts.map(function (a) { return String(a.v); });
    return p;
  }
  function badRows(key, i, vals) { var out = []; vals.forEach(function (v) { if (v == null || String(v) === String(key[i])) return; var row = key.slice(); row[i] = String(v); if (!out.some(function (o) { return o.join() === row.join(); })) out.push(row); }); return out; }
  function sq(u) { return t('\\text{' + u + '}^{2}'); }
  function cube(u) { return t('\\text{' + u + '}^{3}'); }

  /* ---------- binomial products ---------- */
  function foil(A, B, C, D) { var Fp = mul(A, C), O = mul(A, D), I = mul(B, C), L = mul(B, D); return { F: Fp, O: O, I: I, L: L, res: add(Fp, O, I, L) }; }
  function binWrongs(A, B, C, D) {
    var f = foil(A, B, C, D), mid = 'You have only one of the two middle products. Find both the Outside product and the Inside product, then collect them.';
    return [
      { is: add(f.F, f.L), code: 'u3x-fl-only', hint: 'Two binomials make <b>four</b> products. You have the First and Last ones — the Outside and Inside products give the middle term.' },
      { is: add(f.F, f.O, f.L), code: 'u3x-one-middle', hint: mid }, { is: add(f.F, f.I, f.L), code: 'u3x-one-middle', hint: mid },
      { is: add(f.F, f.O, f.I, neg(f.L)), code: 'u3x-last-sign', hint: 'Check the sign of the last term: ' + t(pf(B) + '\\cdot ' + pf(D)) + '. A negative times a negative is positive.' },
      { is: add(f.F, f.O, neg(f.I), f.L), code: 'u3x-io-sign', hint: 'Check the sign of the Inside product: ' + t(pf(B) + '\\cdot ' + pf(C) + '=' + tx(f.I)) + '.' },
      { is: add(f.F, neg(f.O), f.I, f.L), code: 'u3x-io-sign', hint: 'Check the sign of the Outside product: ' + t(pf(A) + '\\cdot ' + pf(D) + '=' + tx(f.O)) + '.' }];
  }
  function foilSol(A, B, C, D) {
    var f = foil(A, B, C, D), s4 = seq([f.F, f.O, f.I, f.L]);
    return 'FOIL: First ' + t(tx(f.F)) + ', Outside ' + t(tx(f.O)) + ', Inside ' + t(tx(f.I)) + ', Last ' + t(tx(f.L)) + '.<br>' + t('(' + seq([A, B]) + ')(' + seq([C, D]) + ')=' + s4 + (s4 !== tx(f.res) ? '=' + tx(f.res) : ''));
  }
  var FOIL_HINTS = ['Multiply each term of the first bracket by each term of the second: First, Outside, Inside, Last.', 'Then collect the two middle (like) terms. Watch the signs.'];
  function sqWrongs(A, B) { // (A + B)²
    var A2 = mul(A, A), B2 = mul(B, B), AB = mul(A, B), mid = t('2\\cdot ' + pf(A) + '\\cdot ' + pf(B));
    return [{ is: add(A2, B2), code: 'u3x-no-middle', hint: 'Squaring a binomial means multiplying it by <b>itself</b>: ' + t('(a+b)^{2}\\ne a^{2}+b^{2}') + '. The Outside and Inside products give a middle term, ' + mid + '.' },
      { is: add(A2, AB, B2), code: 'u3x-middle-once', hint: 'The Outside and Inside products are equal, so the middle term is <b>doubled</b>: ' + mid + '.' },
      { is: add(A2, scale(AB, 2), neg(B2)), code: 'u3x-last-neg', hint: 'The last term is ' + t(pf(B) + '^{2}') + ': a square is never negative.' },
      { is: add(A2, scale(AB, -2), B2), code: 'u3x-mid-sign', hint: 'Check the sign of the middle term: ' + mid + '.' }];
  }
  function sqSol(A, B) {
    var A2 = mul(A, A), B2 = mul(B, B), AB2 = scale(mul(A, B), 2), neg2 = tx(B).charAt(0) === '-';
    var bAbs = neg2 ? neg(B) : B;
    return 'Perfect square: ' + t(neg2 ? '(a-b)^{2}=a^{2}-2ab+b^{2}' : '(a+b)^{2}=a^{2}+2ab+b^{2}') + ' with ' + t('a=' + tx(A)) + ' and ' + t('b=' + tx(bAbs)) + '.<br>' +
      t('(' + seq([A, B]) + ')^{2}=' + pf(A) + '^{2}' + (neg2 ? '-' : '+') + '2' + pf(A) + '(' + tx(bAbs) + ')+' + pf(bAbs) + '^{2}=' + seq([A2, AB2, B2]));
  }

  /* binomial (X + P) × trinomial: the classic wrong answers */
  function btWrongs(X, P, tri) {
    var xs = tri.map(function (q) { return mul(X, q); }), ps = tri.map(function (q) { return mul(P, q); }), out = [];
    tri.forEach(function (q, i) {
      var flip = ps.map(function (p, j) { return j === i ? neg(p) : p; });
      out.push({ is: sumOf(xs.concat(flip)), code: 'u3x-p-sign', hint: 'Check the sign of ' + t(pf(P) + '\\cdot ' + pf(q) + '=' + tx(ps[i])) + '. A negative times a negative is positive; a negative times a positive is negative.' });
    });
    out.push({ is: add(sumOf(xs), P), code: 'u3x-second-partial', hint: 'Both terms of ' + t(br(add(X, P))) + ' multiply <b>all three</b> terms of the trinomial: ' + t(tx(P)) + ' needs three products too. That makes ' + t('2\\times 3=6') + ' products.' });
    out.push({ is: add(xs[0], xs[2], ps[0], ps[2]), code: 'u3x-foil-only', hint: 'FOIL gives only four products, but a binomial times a trinomial needs ' + t('2\\times 3=6') + '. The middle term of the trinomial must be multiplied too.' });
    return out;
  }
  function btSol(X, P, tri) {
    var xs = tri.map(function (q) { return mul(X, q); }), ps = tri.map(function (q) { return mul(P, q); }), res = mul(add(X, P), sumOf(tri));
    return 'Multiply each term of the trinomial by ' + t(tx(X)) + ', then by ' + t(tx(P)) + ' (six products):<br>' + t(cat(seq(xs), seq(ps))) + '<br>Collect like terms: ' + t('=' + tx(res));
  }

  /* ---------- figures (inline SVG; italic letters, like the Math 10C exit slips) ---------- */
  var INK = '#1c2230', SH = '#d3d8df', SH2 = '#e9ecf0';
  function f1(n) { return Math.round(n * 10) / 10; }
  function svgLab(s) {
    var out = '';
    s = String(s).replace(/\\left|\\right|\\,/g, '');
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === '^') { var mm = /^\^\{([^}]*)\}/.exec(s.slice(i)) || /^\^(.)/.exec(s.slice(i)); out += '<tspan dy="-6" font-size="11">' + HW.esc(mm[1]) + '</tspan><tspan dy="6"> </tspan>'; i += mm[0].length - 1; continue; }
      if (/[a-z]/i.test(c)) { out += '<tspan font-style="italic">' + c + '</tspan>'; continue; }
      if ((c === '-' || c === '+') && i > 0 && s[i - 1] !== '(') { out += ' ' + (c === '-' ? '−' : '+') + ' '; continue; }
      if (c === '-') { out += '−'; continue; }
      out += HW.esc(c);
    }
    return out;
  }
  function textEl(x, y, s, o) {
    o = o || {};
    var px = o.rot ? x + 5 : x, py = o.rot ? y : y + 5;
    return '<text x="' + f1(px) + '" y="' + f1(py) + '" text-anchor="' + (o.anchor || 'middle') + '"' + (o.rot ? ' transform="rotate(-90 ' + f1(px) + ' ' + f1(py) + ')"' : '') + (o.size ? ' font-size="' + o.size + '"' : '') + (o.fill ? ' fill="' + o.fill + '"' : '') + '>' + svgLab(s) + (o.unit ? ' ' + HW.esc(o.unit) : '') + '</text>';
  }
  function wordEl(x, y, s, size) { return '<text x="' + f1(x) + '" y="' + f1(y + 4) + '" text-anchor="middle" font-size="' + (size || 13) + '" font-style="italic" fill="#4a5262">' + HW.esc(s) + '</text>'; }
  function rectEl(x, y, w, h, fill, o) { o = o || {}; return '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h) + '" fill="' + fill + '" stroke="' + INK + '" stroke-width="' + (o.w || 2) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'; }
  function polyEl(pts, fill) { return '<polygon points="' + pts.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' ') + '" fill="' + fill + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/>'; }
  function svgWrap(w, h, body, label, maxw) {
    return '<svg class="fig-svg" viewBox="0 0 ' + f1(w) + ' ' + f1(h) + '" width="100%" style="max-width:' + (maxw || Math.round(w * 1.2)) + 'px" role="img" aria-label="' + HW.esc(label) + '" font-family="KaTeX_Main, \'Times New Roman\', Times, serif" font-size="16" fill="' + INK + '">' + body + '</svg>';
  }
  /* a rectangle with a square cut out of its top-left corner (shaded = what is left) */
  function cornerFig(o) {
    var W = o.W || 250, H = o.H || 165, s = o.s || 100, L = 40, Tp = 30, w = L + W + 14, h = Tp + H + 12, body = '';
    body += rectEl(L, Tp, W, H, SH);
    body += rectEl(L, Tp, s, s, '#ffffff', { w: 1.8, dash: o.cut ? '6 4' : null });
    body += textEl(L + W / 2, Tp - 14, o.top, { unit: o.unit }) + textEl(L - 16, Tp + H / 2, o.left, { rot: true, unit: o.unit });
    body += textEl(L + s / 2, Tp + s + 15, o.inner, { size: 14 }) + textEl(L + s + 6, Tp + s / 2, o.inner, { anchor: 'start', size: 14 });
    body += wordEl(L + s / 2, Tp + s / 2, o.word) + wordEl(L + W - 34, Tp + H - 14, o.rest);
    return svgWrap(w, h, body, o.label || 'rectangle with a square cut from one corner', o.maxw || 320);
  }
  /* a box (rectangular prism) with a square base */
  function boxFig(side, hgt, unit) {
    var x0 = 34, y0 = 56, fw = 160, fh = 52, dx = 58, dy = -40, body = '';
    body += polyEl([[x0, y0], [x0 + dx, y0 + dy], [x0 + fw + dx, y0 + dy], [x0 + fw, y0]], '#f3f5f8');
    body += polyEl([[x0 + fw, y0], [x0 + fw + dx, y0 + dy], [x0 + fw + dx, y0 + dy + fh], [x0 + fw, y0 + fh]], SH);
    body += rectEl(x0, y0, fw, fh, SH2);
    body += textEl(x0 + fw / 2, y0 + fh + 16, side, { unit: unit });
    body += textEl(x0 + fw + dx / 2 + 8, y0 + fh + dy / 2 + 2, side, { unit: unit, anchor: 'start' });
    body += textEl(x0 - 14, y0 + fh / 2, hgt, { rot: true, unit: unit });
    return svgWrap(x0 + fw + dx + 120, y0 + fh + 28, body, 'box with a square base', 360);
  }
  /* a triangle with two sides labelled and the third marked ? */
  function triFig(s1, s2, unit) {
    var A = [120, 150], B = [360, 150], C = [200, 30], body = polyEl([A, B, C], SH2);
    body += textEl((A[0] + C[0]) / 2 - 12, (A[1] + C[1]) / 2 - 4, s1, { unit: unit, anchor: 'end' });
    body += textEl((B[0] + C[0]) / 2 + 12, (B[1] + C[1]) / 2 - 4, s2, { unit: unit, anchor: 'start' });
    body += textEl((A[0] + B[0]) / 2, A[1] + 16, '?', { size: 18 });
    return svgWrap(470, 178, body, 'triangle with two sides labelled', 380);
  }

  /* ======================= Lesson 1: like terms, adding and subtracting ======================= */
  function l1q1(r) { // which pair are like terms (Ryan: 5xy and −2xy · −3ab and 8ab) — recognition, kept as MC
    var vs = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['c', 'd']]), u = vs[0], w = vs[1];
    var kind = r.pick(['prod', 'prod', 'sq']), c = pickWhere(function () { return [nz(r, 2, 9), nz(r, 2, 9)]; }, function (c) { return Math.abs(c[0]) !== Math.abs(c[1]); });
    var uw = {}; uw[u] = 1; uw[w] = 1;
    var right = kind === 'prod' ? [M(c[0], uw), M(c[1], uw)] : [T(c[0], u, 2), T(c[1], u, 2)], vpart = kind === 'prod' ? M(1, uw) : V(u, 2);
    var k = [r.int(2, 9), r.int(2, 9), r.int(2, 9)], hi = r.pick([2, 3]);
    function pair(a, b) { return t(tx(a)) + ' and ' + t(tx(b)); }
    var whyE = 'Like terms need the same variable <b>and</b> the same exponent. ' + t(tx(V(u, hi))) + ' and ' + t(tx(V(u, hi - 1))) + ' have different exponents, so these are unlike, even though both have a ' + t(k[0]) + '.';
    var whyV = 'The variables must match. ' + t(u) + ' and ' + t(w) + ' are different variables, so ' + pair(T(k[1], u, 1), T(k[1], w, 1)) + ' are unlike terms.';
    var whyC = t(k[2]) + ' is a constant (no variable) and ' + t(tx(T(k[2], w, 1))) + ' has a ' + t(w) + ', so they are unlike. In like terms only the coefficients may differ.';
    var opts = [{ html: pair(right[0], right[1]), right: true },
      { html: pair(T(k[0], u, hi), T(k[0], u, hi - 1)), why: whyE, code: 'exp' },
      { html: pair(T(k[1], u, 1), T(k[1], w, 1)), why: whyV, code: 'var' },
      { html: pair(T(k[2], w, 1), N(k[2])), why: whyC, code: 'const' }];
    return KP.mc(r, 'Which pair are <b>like terms</b>?', opts,
      pair(right[0], right[1]) + ' have exactly the same variable part, ' + t(tx(vpart)) + '; only the coefficients differ, so they are like terms.<br>The others are unlike: ' + pair(T(k[0], u, hi), T(k[0], u, hi - 1)) + ' (different exponents), ' + pair(T(k[1], u, 1), T(k[1], w, 1)) + ' (different variables), ' + pair(T(k[2], w, 1), N(k[2])) + ' (a constant has no variable).',
      ['Like terms have exactly the same variables with exactly the same exponents.', 'Only the coefficients (the numbers in front) may be different.'], 'identify like terms');
  }
  function l1q2(r) { // collect like terms (Ryan: 8x²−3x+5−2x²+x−9 · 5x²−4x+7−3x²+x−2)
    var v = r.pick(['x', 'x', 'x', 'y', 'a', 'm']);
    var s = pickWhere(function () { var a = r.int(4, 9); return { a: a, d: r.int(1, a - 2), b: r.int(2, 6), e: r.pick([1, 1, -1]), c: r.int(2, 9), f: r.int(2, 9) }; }, function (s) { return s.c !== s.f; });
    var terms = [T(s.a, v, 2), T(-s.b, v, 1), N(s.c), T(-s.d, v, 2), T(s.e, v, 1), N(-s.f)];
    var A2 = s.a - s.d, A1 = -s.b + s.e, A0 = s.c - s.f, res = add(T(A2, v, 2), T(A1, v, 1), N(A0));
    var one = s.e === 1 ? v : '-' + v, oneC = s.e === 1 ? '1' + v : '-1' + v;
    return pp('Simplify by collecting like terms: ' + t(seq(terms)), res,
      [{ is: add(T(A2, v, 2), T(-s.b, v, 1), N(A0)), code: 'u3x-coef-one', hint: 'The term ' + t(one) + ' means ' + t(oneC) + ', so the ' + t(v) + '-terms are ' + t(-s.b + v + sgn(s.e) + v + '=' + cx(A1, v)) + '.' },
        { is: add(T(s.a + s.d, v, 2), T(A1, v, 1), N(A0)), code: 'u3x-lost-sign', hint: 'Each term keeps the sign in front of it, so the ' + t(v + '^{2}') + '-terms are ' + t(cx(s.a, v + '^{2}') + '-' + cx(s.d, v + '^{2}')) + '.' },
        { is: add(T(A2, v, 2), T(A1, v, 1), N(-A0)), code: 'u3x-const-sign', hint: 'Check the constants: ' + t(s.c + '-' + s.f + '=' + A0) + '.' },
        { is: add(T(A2, v, 2), T(-s.b - s.e, v, 1), N(A0)), code: 'u3x-term-sign', hint: 'Check the ' + t(v) + '-terms: ' + t(-s.b + v + sgn(s.e) + v) + ' — the ' + t(one) + ' keeps its own sign.' }],
      'Group the like terms, keeping each term’s sign:<br>' + t('(' + cx(s.a, v + '^{2}') + '-' + cx(s.d, v + '^{2}') + ')+(' + cx(-s.b, v) + (s.e === 1 ? '+' : '-') + v + ')+(' + s.c + '-' + s.f + ')') + '<br>' + t('=' + tx(res)),
      ['Group the ' + t(v + '^{2}') + '-terms, the ' + t(v) + '-terms and the constants. Each term keeps the sign in front of it.', 'A letter with no number in front has coefficient 1: ' + t(v + '=1' + v) + '.'], 'collect like terms',
      { guard: 'That is the expression you were given. <b>Collect</b> the like terms so there is one term of each kind.' });
  }
  function l1q3(r) { // subtract (Ryan: (6x²−2x+5)−(2x²−4x−3) · (5x²−3x+2)−(x²−6x−4))
    var v = r.pick(['x', 'x', 'x', 'y', 'a']);
    var s = pickWhere(function () { var a = r.int(3, 8); return { a: a, d: r.int(1, a - 1), b: nz(r, 1, 7), c: nz(r, 1, 9), e: r.int(1, 8), f: r.pick([-1, -1, 1]) * r.int(1, 9) }; },
      function (s) { return s.b + s.e !== 0 && s.c - s.f !== 0 && s.b !== s.e && s.c !== -s.f && s.b - s.e !== 0 && s.c + s.f !== 0; });
    var A = add(T(s.a, v, 2), T(s.b, v, 1), N(s.c)), B = add(T(s.d, v, 2), T(-s.e, v, 1), N(s.f)), res = sub(A, B);
    var opp = neg(B);
    return pp('Subtract and simplify: ' + t(br(A) + '-' + br(B)), res,
      [{ is: add(A, T(-s.d, v, 2), T(-s.e, v, 1), N(s.f)), code: 'u3x-first-sign', hint: 'The minus sign goes to <b>every</b> term: ' + t('-' + br(B) + '=' + tx(opp)) + '.' },
        { is: add(A, B), code: 'u3x-added-c', hint: 'This is subtraction, so add the <b>opposite</b> of each term in the second bracket: ' + t(tx(opp)) + '.' },
        { is: add(A, T(-s.d, v, 2), T(s.e, v, 1), N(s.f)), code: 'u3x-one-sign', hint: 'Every term in the second bracket changes sign, including the constant ' + t(s.f) + ', which becomes ' + t(-s.f) + '.' },
        { is: add(A, T(-s.d, v, 2), T(-s.e, v, 1), N(-s.f)), code: 'u3x-one-sign', hint: 'Every term in the second bracket changes sign, including ' + t(cx(-s.e, v)) + ', which becomes ' + t(cx(s.e, v)) + '.' }],
      'Change the sign of every term in the second bracket, then collect like terms:<br>' + t(tx(A) + (tx(opp).charAt(0) === '-' ? '' : '+') + tx(opp)) + '<br>' + t('=' + tx(res)),
      ['Subtracting a bracket means adding the opposite of <b>every</b> term in it.', 'Then collect the ' + t(v + '^{2}') + '-terms, the ' + t(v) + '-terms and the constants.'], 'subtract two trinomials');
  }
  function l1q4(r) { // added Mastery question: the third side from the perimeter (assignment 1 #13)
    var u = r.pick(['cm', 'cm', 'm']);
    var s = pickWhere(function () { return { a1: r.int(2, 5), b1: nz(r, 1, 8), a2: r.int(1, 4), b2: nz(r, 1, 8), a3: r.int(1, 5), b3: nz(r, 1, 8) }; },
      function (s) { var P0 = s.b1 + s.b2 + s.b3; return (s.b1 < 0 || s.b2 < 0) && P0 !== 0 && s.a1 !== s.a2 && Math.abs(s.b1) !== Math.abs(s.b2) && s.a1 + s.a2 + s.a3 <= 12; });
    var s1 = lin(s.a1, s.b1), s2 = lin(s.a2, s.b2), s3 = lin(s.a3, s.b3), P = add(s1, s2, s3);
    var ws = [{ is: sub(P, s1), code: 'u3x-tri-one', hint: 'Subtract <b>both</b> given sides from the perimeter: third side = perimeter − first side − second side.' },
      { is: sub(P, s2), code: 'u3x-tri-one', hint: 'Subtract <b>both</b> given sides from the perimeter: third side = perimeter − first side − second side.' },
      { is: add(P, s1, s2), code: 'u3x-tri-added', hint: 'The perimeter is the <b>total</b> of all three sides, so the third side is what is left after you <b>subtract</b> the other two.' }];
    if (s.b1 < 0) ws.push({ is: add(s3, N(2 * s.b1)), code: 'u3x-tri-sign', hint: 'When you subtract ' + t(br(s1)) + ', every sign changes: ' + t('-' + br(s1) + '=' + tx(neg(s1))) + '.' });
    if (s.b2 < 0) ws.push({ is: add(s3, N(2 * s.b2)), code: 'u3x-tri-sign', hint: 'When you subtract ' + t(br(s2)) + ', every sign changes: ' + t('-' + br(s2) + '=' + tx(neg(s2))) + '.' });
    ws.push({ is: add(s3, N(2 * s.b1 + 2 * s.b2)), code: 'u3x-first-sign', hint: 'A minus sign in front of a bracket changes the sign of <b>every</b> term inside, not just the first: ' + t('-' + br(s1) + '=' + tx(neg(s1))) + '.' });
    var fig = triFig('(' + tx(s1) + ')', '(' + tx(s2) + ')', u);
    return pp('A triangle has a perimeter of ' + t(br(P)) + ' ' + u + '. Two of its sides measure ' + t(br(s1)) + ' ' + u + ' and ' + t(br(s2)) + ' ' + u + '.' + fig + 'Write and simplify an expression for the length of the third side.', s3, ws,
      'Third side = perimeter − first side − second side:<br>' + t(br(P) + '-' + br(s1) + '-' + br(s2)) + '<br>' + t('=' + tx(P) + (tx(neg(s1)).charAt(0) === '-' ? '' : '+') + tx(neg(s1)) + (tx(neg(s2)).charAt(0) === '-' ? '' : '+') + tx(neg(s2))) + '<br>' + t('=' + tx(s3)) + ' ' + u + '<br>Check: ' + t(br(s1) + '+' + br(s2) + '+' + br(s3) + '=' + tx(P)) + ' ✓',
      ['The perimeter is the sum of all three sides, so subtract the two sides you know from it.', 'Subtracting a bracket changes the sign of <b>every</b> term in it.'], 'third side from the perimeter', { after: u });
  }

  /* ======================= Lesson 2: monomial × polynomial ======================= */
  function l2q1(r) { // monomial × monomial (Ryan: −3x²×4x³ · −5x³×2x⁴)
    var v = r.pick(['x', 'x', 'x', 'y', 'a', 'm']);
    var s = pickWhere(function () { var pat = r.pick([[-1, 1], [-1, 1], [1, -1], [-1, -1]]); return { a: pat[0] * r.int(2, 6), b: pat[1] * r.int(2, 6), m: r.int(1, 5), n: r.int(2, 5) }; },
      function (s) { return s.m !== s.n && s.m * s.n !== s.m + s.n && Math.abs(s.a) !== Math.abs(s.b) && s.m + s.n <= 9; });
    var A = T(s.a, v, s.m), B = T(s.b, v, s.n), res = mul(A, B), p = s.a * s.b;
    return pp('Multiply: ' + t(tx(A) + '\\times ' + pf(B)), res,
      [{ is: T(p, v, s.m * s.n), code: 'u3x-exp-mult', hint: 'Product Law: when you multiply powers of the same base, <b>add</b> the exponents: ' + t(tx(V(v, s.m)) + '\\times ' + tx(V(v, s.n)) + '=' + v + '^{' + (s.m + s.n) + '}') + '.' },
        { is: T(s.a + s.b, v, s.m + s.n), code: 'u3x-coef-add', hint: '<b>Multiply</b> the coefficients: ' + t(par(s.a) + '\\times ' + par(s.b) + '=' + p) + '. Adding them does not give the product.' },
        { is: T(-p, v, s.m + s.n), code: 'u3x-prod-sign', hint: 'Check the sign: ' + (s.a < 0 && s.b < 0 ? 'a negative times a negative is positive.' : 'a negative times a positive is negative.') }],
      'Multiply the coefficients and add the exponents:<br>' + t('(' + par(s.a) + '\\times ' + par(s.b) + ')(' + v + '^{' + s.m + '+' + s.n + '})=' + tx(res)),
      ['Multiply the numbers, then multiply the powers of ' + t(v) + '.', 'When you multiply powers of the same base, <b>add</b> the exponents.'], 'monomial × monomial',
      { guard: 'That is the product you were given. <b>Multiply</b> it out to a single term.' });
  }
  function l2q2(r) { // area model, monomial × binomial (Ryan: 3x by x+5 · 4x by x+3)
    var c = r.int(2, 5), k = r.int(2, 9), X = V('x'), m = T(c, 'x', 1);
    var p1 = mul(m, X), p2 = scale(m, k), res = add(p1, p2);
    function grid(cells) { return HW.areaModel(['x', String(k)], [c + 'x'], [cells], { widths: [1.7, 1], max: 300 }); }
    return pp('This rectangle is ' + t(c + 'x') + ' tall and ' + t('x+' + k) + ' long. It is split into two pieces.' + grid(['', '']) + 'Write the total area as a simplified polynomial.', res,
      [{ is: add(p1, N(k)), code: 'u3x-first-only', hint: 'The height ' + t(c + 'x') + ' multiplies <b>both</b> pieces: ' + t(c + 'x\\times ' + k + '=' + tx(p2)) + ' as well as ' + t(c + 'x\\times x=' + tx(p1)) + '.' },
        { is: add(p1, N(c * k)), code: 'u3x-drop-x', hint: 'The right piece is ' + t(c + 'x') + ' by ' + t(k) + ', so its area is ' + t(c + 'x\\times ' + k + '=' + tx(p2)) + ': keep the ' + t('x') + '.' },
        { is: T(c + c * k, 'x', 1), code: 'u3x-xx-x', hint: 'Two ' + t('x') + '’s multiplied give ' + t('x^{2}') + ', so the left piece is ' + t(tx(p1)) + '. It is not a like term with ' + t(tx(p2)) + '.' },
        { is: add(p1, T(k, 'x', 1)), code: 'u3x-drop-coef', hint: 'The right piece is ' + t(c + 'x') + ' by ' + t(k) + ': its area is ' + t(c + '\\times ' + k + '\\times x=' + tx(p2)) + '.' }],
      'Area of each piece = height × length: ' + t(c + 'x\\times x=' + tx(p1)) + ' and ' + t(c + 'x\\times ' + k + '=' + tx(p2)) + '.' + grid([tx(p1), tx(p2)]) + 'Total: ' + t(c + 'x(x+' + k + ')=' + tx(res)),
      ['Find the area of each piece (height × length), then add them.', t('x\\times x=x^{2}') + ', and ' + t(c + 'x\\times ' + k) + ' keeps its ' + t('x') + '.'], 'area model: monomial × binomial');
  }
  function l2q3(r) { // two distributions, negative monomials (Ryan: −2x(x−4)−3(x+2) · −3x(x−5)−2(x+4))
    var s = pickWhere(function () { return { a: r.int(2, 5), s1: r.pick([-1, -1, 1]), b: r.int(2, 7), c: r.int(2, 5), s2: r.pick([1, 1, -1]), d: r.int(1, 6) }; },
      function (s) { var B = -s.a * s.s1 * s.b - s.c; return B !== 0 && s.b !== s.d && Math.abs(B) !== s.a; });
    var a = s.a, b = s.s1 * s.b, c = s.c, d = s.s2 * s.d, X = V('x');
    var m1 = T(-a, 'x', 1), in1 = lin(1, b), in2 = lin(1, d), e1 = mul(m1, in1), e2 = scale(in2, -c), res = add(e1, e2);
    var prompt = 'Expand and simplify: ' + t('-' + a + 'x(x' + sgn(b) + ')-' + c + '(x' + sgn(d) + ')');
    return pp(prompt, res,
      [{ is: add(T(-a, 'x', 2), T(a * b, 'x', 1), e2), code: 'u3x-prod-sign', hint: 'Check ' + t('(-' + a + 'x)(' + sgn(b) + ')=' + tx(T(-a * b, 'x', 1))) + ': ' + (b < 0 ? 'negative × negative is positive.' : 'negative × positive is negative.') },
        { is: add(e1, T(-c, 'x', 1), N(d)), code: 'u3x-first-only', hint: 'The ' + t('-' + c) + ' multiplies <b>both</b> terms: ' + t('-' + c + '(x' + sgn(d) + ')=' + tx(e2)) + '.' },
        { is: add(e1, T(-c, 'x', 1), N(c * d)), code: 'u3x-prod-sign', hint: 'Check ' + t('(-' + c + ')(' + sgn(d) + ')=' + (-c * d)) + ': ' + (d < 0 ? 'negative × negative is positive.' : 'negative × positive is negative.') },
        { is: add(T(-a - a * b - c, 'x', 1), N(-c * d)), code: 'u3x-xx-x', hint: t('(-' + a + 'x)(x)=-' + a + 'x^{2}') + '. The ' + t('x^{2}') + '-term stays separate from the ' + t('x') + '-terms.' }],
      'Distribute each monomial to every term in its bracket:<br>' + t('-' + a + 'x(x' + sgn(b) + ')=' + tx(e1)) + ' and ' + t('-' + c + '(x' + sgn(d) + ')=' + tx(e2)) + '<br>Collect like terms: ' + t(cat(tx(e1), tx(e2)) + '=' + tx(res)),
      ['Expand one bracket at a time. A negative monomial changes the sign of <b>every</b> term it multiplies.', 'Then collect the ' + t('x') + '-terms.'], 'two distributions with negatives');
  }
  function l2q4(r) { // added Mastery question: the missing number in a distribution (booklet: a missing term to find)
    var s = pickWhere(function () { return { a: r.int(2, 5), k: r.int(1, 7), c: r.int(2, 6), d: nz(r, 1, 8) }; },
      function (s) { var B = s.a * s.k - s.c; return B > 0 && B !== s.a * s.k && s.k !== s.c; });
    var a = s.a, k = s.k, c = s.c, d = s.d, B = a * k - c, res = add(T(a, 'x', 2), T(B, 'x', 1), N(-c * d));
    var alts = [];
    if (B % a === 0) alts.push({ v: B / a, code: 'u3x-miss-other', hint: 'The ' + t('x') + '-terms come from <b>both</b> brackets: ' + t(a + 'x\\times\\square') + ' and ' + t('-' + c + '\\times x=-' + c + 'x') + '. Together they make ' + t(B + 'x') + '.' });
    if ((B - c) % a === 0) alts.push({ v: (B - c) / a, code: 'u3x-miss-sign', hint: 'The second bracket gives ' + t('-' + c + 'x') + ', so the box’s product must be ' + t(c + 'x') + ' <b>more</b> than ' + t(B + 'x') + '.' });
    alts.push({ v: B + c, code: 'u3x-miss-nodiv', hint: 'You found ' + t(a + 'x\\times\\square=' + (B + c) + 'x') + ' ✓. Now divide by ' + t(a) + ' to find the number in the box.' });
    return numPart('Find the number that goes in the box: ' + t(a + 'x(x+\\square)-' + c + '(x' + sgn(d) + ')=' + tx(res)), k, alts,
      'Expand the left side, writing the box as a number: ' + t(a + 'x\\cdot x+' + a + 'x\\cdot\\square-' + c + 'x' + sgn(-c * d) + '=' + a + 'x^{2}+(' + a + '\\square-' + c + ')x' + sgn(-c * d)) + '.<br>The ' + t('x') + '-terms must match: ' + t(a + '\\square-' + c + '=' + B) + ', so ' + t(a + '\\square=' + (B + c)) + ' and ' + t('\\square=' + k) + '.<br>Check: ' + t(a + 'x(x+' + k + ')-' + c + '(x' + sgn(d) + ')=' + tx(T(a, 'x', 2)) + '+' + a * k + 'x-' + c + 'x' + sgn(-c * d) + '=' + tx(res)) + ' ✓',
      ['Expand the left side as if the box were a number. Which terms give ' + t('x') + '-terms?', 'The ' + t('x') + '-terms on the left must add up to ' + t(B + 'x') + '.'], 'missing number in a distribution');
  }

  /* ======================= Lesson 3: two binomials ======================= */
  function l3q1(r) { // area model, (x+p)(x+q) (Ryan: x+2 by x+6 · x+3 by x+5)
    var s = pickWhere(function () { return { p: r.int(1, 6), q: r.int(2, 9) }; }, function (s) { return s.p !== s.q && s.p * s.q !== s.p + s.q; });
    var p = s.p, q = s.q, X = V('x'), f = foil(X, N(p), X, N(q)), res = f.res;
    function grid(cells) { return HW.areaModel(['x', String(q)], ['x', String(p)], cells, { widths: [1.7, 1], heights: [1.7, 1], max: 300 }); }
    return pp('This rectangle is ' + t('x+' + p) + ' tall and ' + t('x+' + q) + ' long, split into four pieces.' + grid([['', ''], ['', '']]) + 'Write its total area as a simplified trinomial.', res,
      [{ is: add(f.F, f.L), code: 'u3x-fl-only', hint: 'There are <b>four</b> pieces, not two. The two side pieces are ' + t(tx(f.O)) + ' and ' + t(tx(f.I)) + ', which add to ' + t(tx(add(f.O, f.I))) + '.' },
        { is: add(f.F, f.O, f.I, N(p + q)), code: 'u3x-last-add', hint: 'The bottom-right piece is ' + t(p) + ' by ' + t(q) + ', so its area is ' + t(p + '\\times ' + q + '=' + p * q) + ', not ' + t(p + '+' + q) + '.' },
        { is: add(f.F, f.O, f.L), code: 'u3x-one-middle', hint: 'Count all four pieces: ' + t('x^{2}') + ', ' + t(tx(f.O)) + ', ' + t(tx(f.I)) + ' and ' + t(p * q) + '. The two ' + t('x') + '-pieces combine.' },
        { is: add(f.F, f.I, f.L), code: 'u3x-one-middle', hint: 'Count all four pieces: ' + t('x^{2}') + ', ' + t(tx(f.O)) + ', ' + t(tx(f.I)) + ' and ' + t(p * q) + '. The two ' + t('x') + '-pieces combine.' }],
      'Area of each piece = height × length:' + grid([[tx(f.F), tx(f.O)], [tx(f.I), String(p * q)]]) + 'Total: ' + t(seq([f.F, f.O, f.I, f.L]) + '=' + tx(res)),
      ['Find the area of each of the four pieces (height × length).', 'Add them, and collect the two ' + t('x') + '-pieces.'], 'area model: (x + p)(x + q)');
  }
  function l3q2(r) { // FOIL with negatives (Ryan: (3x−2)(x−4) · (2x−5)(x−3))
    var s = pickWhere(function () { var pat = r.pick([[-1, -1], [-1, -1], [-1, 1], [1, -1]]); return { a: r.int(2, 4), b: pat[0] * r.int(1, 7), c: pat[1] * r.int(2, 7) }; },
      function (s) { var m = s.a * s.c + s.b; return m !== 0 && Math.abs(s.b) !== Math.abs(s.c) && Math.abs(s.b) !== s.a && Math.abs(s.a * s.c) !== Math.abs(s.b) && HW.ex.gcd(s.a, Math.abs(s.b)) === 1; });
    var A = T(s.a, 'x', 1), B = N(s.b), C = V('x'), D = N(s.c);
    return pp('Expand and simplify using FOIL: ' + t('(' + seq([A, B]) + ')(' + seq([C, D]) + ')'), foil(A, B, C, D).res, binWrongs(A, B, C, D), foilSol(A, B, C, D),
      FOIL_HINTS.slice(0, 1).concat(['Check the sign of each of the four products, then collect the Outside and Inside terms.']), 'binomial × binomial with negatives');
  }
  function l3q3(r) { // added Mastery question: a difference of two binomial products (assignment 3 #11)
    var s = pickWhere(function () {
      if (r.chance(0.6)) return { a: r.int(1, 9), b: r.int(1, 9), c: r.int(1, 9), d: r.int(1, 9) };
      return { a: r.int(2, 9), b: -r.int(1, 4), c: -r.int(1, 4), d: r.int(1, 6) };
    }, function (s) { var B = s.a + s.b - s.c - s.d, C = s.a * s.b - s.c * s.d; return B !== 0 && C !== 0 && s.a !== s.b && s.c !== s.d && [s.a, s.b].sort().join() !== [s.c, s.d].sort().join() && s.a + s.b + s.c + s.d <= 22; });
    var X = V('x'), P1 = mul(lin(1, s.a), lin(1, s.b)), P2 = mul(lin(1, s.c), lin(1, s.d)), res = sub(P1, P2);
    var e1 = '(x' + sgn(s.a) + ')(x' + sgn(s.b) + ')', e2 = '(x' + sgn(s.c) + ')(x' + sgn(s.d) + ')';
    return pp('Expand and simplify: ' + t(e1 + '-' + e2), res,
      [{ is: add(P1, neg(mul(X, X)), T(s.c + s.d, 'x', 1), N(s.c * s.d)), code: 'u3x-sub-first', hint: 'Put the second product in brackets before subtracting: ' + t('-(' + tx(P2) + ')=' + tx(neg(P2))) + '. The minus sign changes <b>every</b> sign.' },
        { is: add(P1, P2), code: 'u3x-added', hint: 'The second product is <b>subtracted</b>: ' + t('-(' + tx(P2) + ')=' + tx(neg(P2))) + '.' },
        { is: sub(P1, add(mul(X, X), N(s.c * s.d))), code: 'u3x-fl-only', hint: 'Check ' + t(e2) + ': it has a middle term, ' + t(tx(T(s.c + s.d, 'x', 1))) + '.' },
        { is: sub(add(mul(X, X), N(s.a * s.b)), P2), code: 'u3x-fl-only', hint: 'Check ' + t(e1) + ': it has a middle term, ' + t(tx(T(s.a + s.b, 'x', 1))) + '.' }],
      'Expand both products completely first:<br>' + t(e1 + '=' + tx(P1)) + ' and ' + t(e2 + '=' + tx(P2)) + '<br>Subtract the second one (change every sign): ' + t('(' + tx(P1) + ')-(' + tx(P2) + ')=' + tx(P1) + (tx(neg(P2)).charAt(0) === '-' ? '' : '+') + tx(neg(P2))) + '<br>' + t('=' + tx(res)) + ' (the ' + t('x^{2}') + '-terms cancel).',
      ['Expand <b>both</b> products completely before you subtract.', 'A minus sign in front of a product changes the sign of every one of its terms.'], 'difference of two binomial products');
  }

  /* ======================= Lesson 4: special products ======================= */
  function l4q1(r) { // perfect square (Ryan: (x−7)² · (x−6)²)
    var a = r.int(2, 12), sg = r.chance(0.7) ? -1 : 1, X = V('x'), B = N(sg * a), res = mul(add(X, B), add(X, B));
    return pp('Expand: ' + t('(x' + sgn(sg * a) + ')^{2}'), res,
      sqWrongs(X, B).concat([{ is: sub(mul(X, X), N(a * a)), code: 'u3x-ps-dos', hint: 'Difference of squares is for ' + t('(a+b)(a-b)') + '. Here the <b>same</b> bracket is squared, so use ' + t(sg < 0 ? 'a^{2}-2ab+b^{2}' : 'a^{2}+2ab+b^{2}') + ', which has a middle term.' }]),
      sqSol(X, B) + '<br>(Or FOIL ' + t('(x' + sgn(sg * a) + ')(x' + sgn(sg * a) + ')') + ': the Outside and Inside products are both ' + t(tx(T(sg * a, 'x', 1))) + '.)',
      ['Write it as ' + t('(x' + sgn(sg * a) + ')(x' + sgn(sg * a) + ')') + ', or use ' + t(sg < 0 ? '(a-b)^{2}=a^{2}-2ab+b^{2}' : '(a+b)^{2}=a^{2}+2ab+b^{2}') + '.', 'The middle term is <b>twice</b> the product of the two terms; the last term is a square, so it is positive.'], 'perfect square (x ± a)²');
  }
  function l4q2(r) { // difference of squares with a coefficient (Ryan: (3x+4)(3x−4) · (2x+5)(2x−5))
    var s = pickWhere(function () { return { b: r.int(2, 5), a: r.int(1, 9) }; }, function (s) { return s.a !== s.b && HW.ex.gcd(s.a, s.b) === 1; });
    var b = s.b, a = s.a, plusFirst = r.chance(0.6), res = sub(T(b * b, 'x', 2), N(a * a));
    var e = plusFirst ? '(' + b + 'x+' + a + ')(' + b + 'x-' + a + ')' : '(' + b + 'x-' + a + ')(' + b + 'x+' + a + ')';
    return pp('Expand: ' + t(e), res,
      [{ is: sub(T(b, 'x', 2), N(a * a)), code: 'u3x-coef-sq', hint: 'Square the <b>whole</b> first term: ' + t('(' + b + 'x)^{2}=' + b * b + 'x^{2}') + ', not ' + t(b + 'x^{2}') + '.' },
        { is: add(T(b * b, 'x', 2), N(a * a)), code: 'u3x-dsq-plus', hint: 'The pattern is ' + t('(a+b)(a-b)=a^{2}-b^{2}') + '. The Last product is ' + t('(' + a + ')(-' + a + ')=-' + a * a) + '.' },
        { is: sub(T(2 * b, 'x', 2), N(2 * a)), code: 'u3x-doubled', hint: 'Squaring means multiplying a term by itself: ' + t('(' + b + 'x)(' + b + 'x)=' + b * b + 'x^{2}') + ' and ' + t('(' + a + ')(' + a + ')=' + a * a) + '. Then subtract.' }],
      'Difference of squares: ' + t('(a+b)(a-b)=a^{2}-b^{2}') + ' with ' + t('a=' + b + 'x') + ' and ' + t('b=' + a) + '.<br>' + t('(' + b + 'x)^{2}-' + a + '^{2}=' + tx(res)) + '<br>The Outside and Inside terms ' + t(-a * b + 'x') + ' and ' + t('+' + a * b + 'x') + ' cancel.',
      ['The two brackets have the same terms, once with ' + t('+') + ' and once with ' + t('-') + ': use ' + t('a^{2}-b^{2}') + '.', 'Square the whole first term, coefficient and all: ' + t('(' + b + 'x)^{2}') + '.'], 'difference of squares (bx + a)(bx − a)');
  }
  function l4q3(r) { // which pattern (Ryan: (x+6)(x−2) → neither · (x−4)(x+4) → difference of squares) — recognition, kept as MC
    var kind = r.pick(['dos', 'ps', 'neither']), a = r.int(2, 9), e, res, X = V('x');
    if (kind === 'dos') { e = r.chance(0.5) ? '(x+' + a + ')(x-' + a + ')' : '(x-' + a + ')(x+' + a + ')'; res = sub(mul(X, X), N(a * a)); }
    else if (kind === 'ps') { var sg = r.pick([1, -1]); e = r.chance(0.5) ? '(x' + sgn(sg * a) + ')^{2}' : '(x' + sgn(sg * a) + ')(x' + sgn(sg * a) + ')'; res = mul(lin(1, sg * a), lin(1, sg * a)); }
    else { var b = pickWhere(function () { return r.int(1, 9); }, function (b) { return b !== a; }), s1 = r.pick([1, -1]), s2 = r.pick([1, -1, -s1]); e = '(x' + sgn(s1 * a) + ')(x' + sgn(s2 * b) + ')'; res = mul(lin(1, s1 * a), lin(1, s2 * b)); }
    var why = {
      dos: 'Difference of squares needs the <b>same</b> two terms, once added and once subtracted, like ' + t('(x+' + a + ')(x-' + a + ')') + '. ' + (kind === 'ps' ? 'Here the same bracket is multiplied by itself, so its middle terms add instead of cancelling.' : 'Here the numbers in the brackets are different, so the middle terms don’t cancel.'),
      ps: 'A perfect square is one binomial times <b>itself</b>, like ' + t('(x+' + a + ')^{2}') + '. ' + (kind === 'dos' ? 'These brackets have different signs, so they are not the same binomial.' : 'These brackets are different, so it is not a square.'),
      neither: 'A pattern does apply here: ' + (kind === 'dos' ? 'the brackets have the same two terms, once with + and once with −, so it is a difference of squares.' : 'the same binomial is multiplied by itself, so it is a perfect square.')
    };
    var names = { dos: 'Difference of squares', ps: 'Perfect square trinomial', neither: 'Neither: just use FOIL' };
    var opts = ['dos', 'ps', 'neither'].map(function (k) { return { html: names[k], right: k === kind, why: k === kind ? null : why[k], code: k }; });
    var sol = kind === 'dos' ? 'The brackets have the same two terms, once added and once subtracted: a <b>difference of squares</b>.<br>' + t(e + '=x^{2}-' + a + '^{2}=' + tx(res)) + ' (the middle terms cancel).'
      : kind === 'ps' ? 'The same binomial is multiplied by itself: a <b>perfect square trinomial</b>.<br>' + t(e + '=' + tx(res))
        : 'The brackets have different numbers, so no shortcut applies: <b>just use FOIL</b>.<br>' + t(e + '=' + tx(res));
    return KP.mc(r, 'Which pattern should you use to expand ' + t(e) + '?', opts, sol,
      ['Difference of squares: the same two terms, once with + and once with −. Perfect square: the same binomial twice.', 'If the numbers in the brackets are different, no shortcut applies.'], 'choose the special-product pattern', true);
  }
  function l4q4(r) { // added Mastery question: a perfect square worked backwards (assignment 4 #16 style)
    var a = r.int(2, 12), sg = r.pick([1, -1]), m = 2 * a;
    var key = [String(a), String(a * a)];
    var lhs = '(x' + (sg < 0 ? '-' : '+') + 'a)^{2}', rhs = 'x^{2}' + (sg < 0 ? '-' : '+') + m + 'x+c';
    var pt = KP.fields('Find the whole numbers ' + t('a') + ' and ' + t('c') + ' so that ' + t(lhs + '=' + rhs) + ' for every value of ' + t('x') + '.',
      [nbox(t('a=')), nbox(t('c='))],
      [numChk(a, [{ v: m, code: 'u3x-ps-half', hint: 'The middle term of a perfect square is <b>twice</b> the product: ' + t('2\\cdot x\\cdot a=' + m + 'x') + '. So ' + t('2a=' + m) + '.' },
        { v: -a, code: 'u3x-ps-asign', hint: 'The sign is already written in the bracket ' + t(lhs) + ', so ' + t('a') + ' is a positive whole number.' }]),
      numChk(a * a, [{ v: a, code: 'u3x-c-unsq', hint: 'The last term of ' + t(lhs) + ' is ' + t('a^{2}') + ', so square your value of ' + t('a') + '.' },
        { v: m * m, code: 'u3x-ps-half', hint: 'First find ' + t('a') + ': ' + t('2a=' + m) + ', so ' + t('a=' + a) + '. Then ' + t('c=a^{2}') + '.' },
        { v: m, code: 'u3x-doubled', hint: t('c=a^{2}') + ': square ' + t('a') + ', don’t double it.' },
        { v: -a * a, code: 'u3x-last-neg', hint: 'The last term of a perfect square is ' + t('a^{2}') + ', and a square is never negative.' }])],
      key, t('a=' + a) + ', ' + t('c=' + a * a),
      'Use the pattern: ' + t(lhs + '=x^{2}' + (sg < 0 ? '-' : '+') + '2ax+a^{2}') + '.<br>Middle terms: ' + t('2a=' + m) + ', so ' + t('a=' + a) + '.<br>Last terms: ' + t('c=a^{2}=' + a + '^{2}=' + a * a) + '.<br>Check: ' + t('(x' + sgn(sg * a) + ')^{2}=' + tx(mul(lin(1, sg * a), lin(1, sg * a)))) + ' ✓',
      ['Expand ' + t(lhs) + ' with the pattern ' + t(sg < 0 ? '(a-b)^{2}=a^{2}-2ab+b^{2}' : '(a+b)^{2}=a^{2}+2ab+b^{2}') + ' and compare it with the right side.', 'The middle term is ' + t('2a') + ' times ' + t('x') + '; the last term is ' + t('a^{2}') + '.'], 'perfect square worked backwards');
    pt.bad = badRows(key, 0, [m, -a]).concat(badRows(key, 1, [a, m * m]), [[String(m), String(m * m)]]);
    return pt;
  }

  /* ======================= Lesson 5: binomial × trinomial ======================= */
  function l5q1(r) { // with a grid (Ryan: (x+3)(x²−2x+4) · (x+2)(x²−3x+5))
    var s = pickWhere(function () { return { p: r.int(1, 5), b: r.pick([-1, -1, 1]) * r.int(1, 5), c: r.pick([1, 1, -1]) * r.int(1, 7) }; },
      function (s) { var res = mul(lin(1, s.p), add(T(1, 'x', 2), T(s.b, 'x', 1), N(s.c))); return allNz(res, 'x', 3) && Math.abs(s.b) !== s.p && Math.abs(s.c) !== s.p && Math.abs(s.c + s.p * s.b) !== Math.abs(s.c - s.p * s.b); });
    var X = V('x'), P = N(s.p), tri = [T(1, 'x', 2), T(s.b, 'x', 1), N(s.c)], res = mul(add(X, P), sumOf(tri));
    var xs = tri.map(function (q) { return mul(X, q); }), ps = tri.map(function (q) { return mul(P, q); });
    function grid(cells) { return HW.areaModel(tri.map(lab), ['x', lab(P, 1)], cells, { widths: [1.3, 1.1, 0.8], max: 320 }); }
    var c1 = s.c + s.p * s.b;
    var ws = btWrongs(X, P, tri).concat([{ is: add(T(1, 'x', 3), T(s.b + s.p, 'x', 2), T(-c1, 'x', 1), N(s.p * s.c)), code: 'u3x-collect-sign', hint: 'Check the ' + t('x') + '-terms: ' + t(cat(tx(xs[2]), tx(ps[1])) + '=' + tx(T(c1, 'x', 1))) + '.' }]);
    return pp('Expand and simplify ' + t('(x+' + s.p + ')(' + seq(tri) + ')') + '. You can use the grid:' + grid([['', '', ''], ['', '', '']]), res, ws,
      'Each box is (side term) × (top term):' + grid([xs.map(tx), ps.map(tx)]) + 'Add the six boxes: ' + t(cat(seq(xs), seq(ps))) + '<br>Collect like terms (two ' + t('x^{2}') + '-terms, two ' + t('x') + '-terms): ' + t('=' + tx(res)),
      ['Fill all six boxes: each box is the term on its side times the term on its top.', 'Then collect the ' + t('x^{2}') + '-boxes and the ' + t('x') + '-boxes.'], 'binomial × trinomial with a grid');
  }
  function l5q2(r) { // negative terms (Ryan: (2x−1)(x²+3x−4) · (3x−2)(x²+2x−5))
    var s = pickWhere(function () { return { a: r.int(2, 3), q: r.int(1, 3), b: r.pick([1, 1, -1]) * r.int(1, 4), c: r.pick([-1, -1, 1]) * r.int(2, 6) }; },
      function (s) { var res = mul(lin(s.a, -s.q), add(T(1, 'x', 2), T(s.b, 'x', 1), N(s.c))); return allNz(res, 'x', 3) && s.a !== s.q && Math.abs(s.b) !== s.q && HW.ex.gcd(s.a, s.q) === 1; });
    var X = T(s.a, 'x', 1), P = N(-s.q), tri = [T(1, 'x', 2), T(s.b, 'x', 1), N(s.c)], res = mul(add(X, P), sumOf(tri));
    return pp('Expand and simplify: ' + t('(' + seq([X, P]) + ')(' + seq(tri) + ')'), res, btWrongs(X, P, tri), btSol(X, P, tri),
      ['Multiply each term of the trinomial by ' + t(tx(X)) + ', then each by ' + t(tx(P)) + ': six products.', 'Check the sign of every product on its own, then collect like terms.'], 'binomial × trinomial with negatives');
  }
  function l5q3(r) { // added Mastery question: a product minus a trinomial (assignment 5 #14)
    var s = pickWhere(function () { return { p: nz(r, 1, 4), b: nz(r, 1, 4), c: nz(r, 1, 5), k: r.int(1, 3), d: nz(r, 1, 6), e: nz(r, 1, 9) }; },
      function (s) { var Pr = mul(lin(1, s.p), add(T(1, 'x', 2), T(s.b, 'x', 1), N(s.c))), Q = add(T(s.k, 'x', 2), T(s.d, 'x', 1), N(s.e)), res = sub(Pr, Q); return allNz(Pr, 'x', 3) && allNz(res, 'x', 3) && Math.abs(s.b) !== Math.abs(s.p); });
    var X = V('x'), P = N(s.p), tri = [T(1, 'x', 2), T(s.b, 'x', 1), N(s.c)], Pr = mul(add(X, P), sumOf(tri)), Q = add(T(s.k, 'x', 2), T(s.d, 'x', 1), N(s.e)), res = sub(Pr, Q);
    var e1 = '(x' + sgn(s.p) + ')(' + seq(tri) + ')';
    var ps = tri.map(function (q) { return mul(P, q); }), xs = tri.map(function (q) { return mul(X, q); });
    return pp('Expand and simplify: ' + t(e1 + '-(' + tx(Q) + ')'), res,
      [{ is: add(Pr, T(-s.k, 'x', 2), T(s.d, 'x', 1), N(s.e)), code: 'u3x-sub-first', hint: 'The minus sign in front of ' + t(br(Q)) + ' changes the sign of <b>every</b> term inside: ' + t('-' + br(Q) + '=' + tx(neg(Q))) + '.' },
        { is: add(Pr, Q), code: 'u3x-added', hint: 'The trinomial is <b>subtracted</b>: ' + t('-' + br(Q) + '=' + tx(neg(Q))) + '.' },
        { is: Pr, code: 'u3x-prod-only', hint: 'Your product ' + t(tx(Pr)) + ' is right ✓. Now subtract ' + t(br(Q)) + ' from it.' },
        { is: sub(sumOf(xs.concat(ps.map(function (p, j) { return j === 2 ? neg(p) : p; }))), Q), code: 'u3x-p-sign', hint: 'Check the sign of ' + t(pf(P) + '\\cdot ' + pf(tri[2]) + '=' + tx(ps[2])) + ' in the product.' }],
      'Expand the product completely first (six products):<br>' + t(e1 + '=' + cat(seq(xs), seq(ps)) + '=' + tx(Pr)) + '<br>Then subtract the trinomial (change every sign): ' + t(tx(Pr) + (tx(neg(Q)).charAt(0) === '-' ? '' : '+') + tx(neg(Q))) + '<br>' + t('=' + tx(res)),
      ['Expand the binomial × trinomial completely first, then deal with the other bracket.', 'A minus sign in front of a bracket changes the sign of every term inside it.'], 'product minus a trinomial');
  }

  /* ======================= Lesson 6: area and volume ======================= */
  function lawnShared(r) {
    return pickWhere(function () { var a = r.int(4, 10); return { a: a, b: r.int(3, a - 1), c: r.int(1, 4), n: r.int(2, 6), u: r.pick(['m', 'm', 'ft']), what: r.pick(['flower bed', 'flower bed', 'vegetable patch', 'sandbox']) }; },
      function (s) { return s.c < s.b - 1 && s.a + s.b - 2 * s.c > 0 && s.a * s.b - s.c * s.c > 0; });
  }
  function lawnFig(s) {
    var W = 250, H = Math.round(250 * (s.b + 6) / (s.a + 6)), sz = Math.round(250 * (s.c + 6) / (s.a + 6) * 0.9);
    H = Math.max(120, Math.min(H, 190)); sz = Math.min(sz, H - 40, W - 90);
    return cornerFig({ top: '(x+' + s.a + ')', left: '(x+' + s.b + ')', inner: 'x+' + s.c, unit: s.u, W: W, H: H, s: sz, word: s.what, rest: 'grass', label: 'lawn with a square ' + s.what + ' in one corner' });
  }
  function lawnText(s) { return 'A lawn is ' + t('(x+' + s.a + ')') + ' ' + s.u + ' by ' + t('(x+' + s.b + ')') + ' ' + s.u + '. A square ' + s.what + ' with sides of ' + t('(x+' + s.c + ')') + ' ' + s.u + ' is cut out of one corner.' + lawnFig(s); }
  function l6q1(r) { // Ryan's Mastery: the grass area as a polynomial (Ryan: lawn x+8 by x+5, bed x+2 · x+7 by x+4, bed x+1)
    var s = lawnShared(r), X = V('x'), Lw = mul(lin(1, s.a), lin(1, s.b)), Bd = mul(lin(1, s.c), lin(1, s.c)), res = sub(Lw, Bd), U = sq(s.u);
    return pp(lawnText(s) + 'Write a simplified expression for the area of <b>grass</b>.', res,
      [{ is: Lw, code: 'u3x-outer-only', hint: t(tx(Lw)) + ' is the whole lawn. Subtract the ' + s.what + ': ' + t('(x+' + s.c + ')^{2}=' + tx(Bd)) + '.' },
        { is: sub(Lw, add(mul(X, X), N(s.c * s.c))), code: 'u3x-no-middle', hint: t('(x+' + s.c + ')^{2}=' + tx(Bd)) + ', with a middle term ' + t('2(x)(' + s.c + ')=' + 2 * s.c + 'x') + '.' },
        { is: add(Lw, neg(mul(X, X)), T(2 * s.c, 'x', 1), N(s.c * s.c)), code: 'u3x-sub-first', hint: 'Subtract <b>all</b> of the ' + s.what + ': ' + t('-(' + tx(Bd) + ')=' + tx(neg(Bd))) + '.' },
        { is: add(res, mul(X, X)), code: 'u3x-sub-x2', hint: 'Subtract the ' + t('x^{2}') + ' of the ' + s.what + ' too: the ' + t('x^{2}') + '-terms cancel.' }],
      'Grass = whole lawn − ' + s.what + '.<br>Lawn: ' + t('(x+' + s.a + ')(x+' + s.b + ')=' + tx(Lw)) + '.<br>' + up(s.what) + ': ' + t('(x+' + s.c + ')^{2}=' + tx(Bd)) + '.<br>Grass: ' + t('(' + tx(Lw) + ')-(' + tx(Bd) + ')=' + tx(res)) + ' ' + U + ' (the ' + t('x^{2}') + '-terms cancel).',
      ['Area of grass = area of the whole lawn − area of the ' + s.what + '.', 'Expand both products, then subtract the second one in brackets (change every sign).'], 'shaded area: rectangle minus square', { after: U });
  }
  function l6q2(r) { // Ryan's value question (Ryan: x = 4 → 72 · x = 3 → 54); its own lawn, since each question gets its own numbers
    var s = lawnShared(r), n = s.n, Lv = (n + s.a) * (n + s.b), Bv = (n + s.c) * (n + s.c), ans = Lv - Bv, U = sq(s.u);
    return numPart(lawnText(s) + 'Find the area of grass when ' + t('x=' + n) + '.', ans,
      [{ v: Lv, code: 'u3x-outer-only', hint: t(Lv) + ' is the whole lawn ' + t('(' + (n + s.a) + '\\times ' + (n + s.b) + ')') + '. Subtract the ' + s.what + '.' },
        { v: Bv, code: 'u3x-gave-part', hint: t(Bv) + ' is the ' + s.what + '. The question asks for the grass: lawn − ' + s.what + '.' },
        { v: Lv - (n * n + s.c * s.c), code: 'u3x-no-middle', hint: 'The ' + s.what + ' is ' + t((n + s.c) + '\\times ' + (n + s.c) + '=' + Bv) + ' when ' + t('x=' + n) + ', not ' + t(n + '^{2}+' + s.c + '^{2}') + '.' },
        { v: Lv - n * n + 2 * s.c * n + s.c * s.c, code: 'u3x-sub-first', hint: 'Subtract the whole ' + s.what + '. Easiest check: lawn ' + t((n + s.a) + '\\times ' + (n + s.b) + '=' + Lv) + ', ' + s.what + ' ' + t((n + s.c) + '\\times ' + (n + s.c) + '=' + Bv) + '.' }],
      'When ' + t('x=' + n) + ': lawn ' + t((n + s.a) + '\\times ' + (n + s.b) + '=' + Lv) + ', ' + s.what + ' ' + t((n + s.c) + '\\times ' + (n + s.c) + '=' + Bv) + '.<br>Grass: ' + t(Lv + '-' + Bv + '=' + ans) + ' ' + U + '.<br>(Check with the expression: ' + t('(x+' + s.a + ')(x+' + s.b + ')-(x+' + s.c + ')^{2}=' + tx(sub(mul(lin(1, s.a), lin(1, s.b)), mul(lin(1, s.c), lin(1, s.c))))) + ', and ' + t(tx(sub(mul(lin(1, s.a), lin(1, s.b)), mul(lin(1, s.c), lin(1, s.c)))).replace(/x/g, '(' + n + ')') + '=' + ans) + '.)',
      ['Substitute ' + t('x=' + n) + ' into each side length first.', 'Grass = lawn − ' + s.what + ': multiply each pair of sides, then subtract.'], 'shaded area value at x', { after: U });
  }
  function l6q3(r) { // box with a square base (Ryan: base x+3, height 2 · base x+4, height 3)
    var a = r.int(1, 6), h = r.int(2, 5), u = r.pick(['cm', 'cm', 'm']), X = V('x'), E = lin(1, a), Bs = mul(E, E), res = scale(Bs, h), U = cube(u);
    var what = r.pick(['box', 'box', 'crate', 'planter']);
    return pp('A ' + what + ' has a square base with sides of ' + t('(x+' + a + ')') + ' ' + u + ' and a height of ' + t(h) + ' ' + u + '.' + boxFig('(x+' + a + ')', String(h), u) + 'Write its volume as a simplified polynomial.', res,
      [{ is: scale(add(mul(X, X), N(a * a)), h), code: 'u3x-no-middle', hint: t('(x+' + a + ')^{2}=' + tx(Bs)) + ', with a middle term. Then multiply every term by ' + t(h) + '.' },
        { is: scale(add(mul(X, X), T(a, 'x', 1), N(a * a)), h), code: 'u3x-middle-once', hint: 'The middle term of ' + t('(x+' + a + ')^{2}') + ' is ' + t('2(x)(' + a + ')=' + 2 * a + 'x') + ', so the base is ' + t(tx(Bs)) + '.' },
        { is: mul(lin(h, h * a), lin(h, h * a)), code: 'u3x-k-inside', hint: 'Find the base area first, ' + t('(x+' + a + ')^{2}=' + tx(Bs)) + ', then multiply by the height ' + t(h) + '. ' + t('(' + h + 'x+' + h * a + ')^{2}') + ' is a different expression.' },
        { is: add(Bs, N(h)), code: 'u3x-add-h', hint: 'Volume is length × width × height, so <b>multiply</b> the base ' + t(tx(Bs)) + ' by ' + t(h) + '.' },
        { is: Bs, code: 'u3x-k-lost', hint: t(tx(Bs)) + ' is the area of the base ✓. Multiply it by the height, ' + t(h) + '.' }],
      'Volume = length × width × height ' + t('=(x+' + a + ')(x+' + a + ')(' + h + ')') + '.<br>Base: ' + t('(x+' + a + ')^{2}=' + tx(Bs)) + '.<br>Volume: ' + t(h + '(' + tx(Bs) + ')=' + tx(res)) + ' ' + U,
      ['Volume = length × width × height. The base is a square, so length and width are both ' + t('(x+' + a + ')') + '.', 'Expand ' + t('(x+' + a + ')^{2}') + ' first, then multiply every term by ' + t(h) + '.'], 'volume of a box with a square base', { after: U });
  }

  /* ======================= Lesson 7: unit review ======================= */
  function l7q1(r) { // monomial × binomial minus a binomial product (Ryan: 5x(x−2)−(x+3)(x−4) · 4x(x−3)−(x+2)(x−5))
    var s = pickWhere(function () { return { a: r.int(2, 5), b: nz(r, 1, 6), c: r.int(1, 5), d: r.int(2, 6) }; },
      function (s) { var B = -s.a * s.b - (s.c - s.d); return s.c !== s.d && B !== 0 && s.c - s.d !== 0 && Math.abs(s.b) !== s.c && Math.abs(s.b) !== s.d; });
    var X = V('x'), Mm = mul(T(s.a, 'x', 1), lin(1, s.b)), Q = mul(lin(1, s.c), lin(1, -s.d)), res = sub(Mm, Q);
    var e1 = s.a + 'x(x' + sgn(s.b) + ')', e2 = '(x+' + s.c + ')(x-' + s.d + ')';
    var Qbad = add(mul(X, X), T(s.d - s.c, 'x', 1), N(-s.c * s.d));
    return pp('Expand and simplify: ' + t(e1 + '-' + e2), res,
      [{ is: add(Mm, neg(mul(X, X)), T(s.c - s.d, 'x', 1), N(-s.c * s.d)), code: 'u3x-sub-first', hint: 'First ' + t(e2 + '=' + tx(Q)) + '. The minus sign changes <b>every</b> sign: ' + t(tx(neg(Q))) + '.' },
        { is: add(Mm, Q), code: 'u3x-added', hint: 'The minus sign in front of ' + t(e2) + ' means subtract it: ' + t('-(' + tx(Q) + ')=' + tx(neg(Q))) + '.' },
        { is: sub(Mm, Qbad), code: 'u3x-io-sign', hint: 'In ' + t(e2) + ': Outside ' + t(-s.d + 'x') + ', Inside ' + t('+' + s.c + 'x') + ', so the middle term is ' + t(tx(T(s.c - s.d, 'x', 1))) + '. Subtracting it gives ' + t(tx(T(s.d - s.c, 'x', 1))) + '.' }],
      'Expand each part:<br>' + t(e1 + '=' + tx(Mm)) + ' and ' + t(e2 + '=' + tx(Q)) + '<br>Subtract the product (change every sign): ' + t(tx(Mm) + (tx(neg(Q)).charAt(0) === '-' ? '' : '+') + tx(neg(Q))) + '<br>' + t('=' + tx(res)),
      ['Expand ' + t(e1) + ' and ' + t(e2) + ' completely first.', 'Put the product in brackets before subtracting: the minus sign changes every one of its signs.'], 'monomial product minus a binomial product');
  }
  function l7q2(r) { // binomial × trinomial (Ryan: (x−3)(2x²+x−4) · (x−2)(3x²+x−5))
    var s = pickWhere(function () { return { p: r.int(1, 4), a: r.int(2, 3), b: r.pick([1, 1, -1]) * r.int(1, 3), c: r.pick([-1, -1, 1]) * r.int(2, 6) }; },
      function (s) { var res = mul(lin(1, -s.p), add(T(s.a, 'x', 2), T(s.b, 'x', 1), N(s.c))); return allNz(res, 'x', 3) && s.p !== s.a && Math.abs(s.b) !== s.p && HW.ex.gcd(HW.ex.gcd(s.a, Math.abs(s.b)), Math.abs(s.c)) === 1; });
    var X = V('x'), P = N(-s.p), tri = [T(s.a, 'x', 2), T(s.b, 'x', 1), N(s.c)], res = mul(add(X, P), sumOf(tri));
    return pp('Expand and simplify: ' + t('(x-' + s.p + ')(' + seq(tri) + ')'), res, btWrongs(X, P, tri), btSol(X, P, tri),
      ['Multiply each term of the trinomial by ' + t('x') + ', then each by ' + t(tx(P)) + ': six products.', 'Check the sign of every product, then collect like terms.'], 'binomial × trinomial');
  }
  function l7q3(r) { // Ryan's Mastery: a square cut from a square (Ryan: side x+5 · x+4)
    var a = r.int(2, 12), u = r.pick(['cm', 'cm', 'm']), what = r.pick(['poster', 'poster', 'sheet of plywood', 'tile', 'quilt']), X = V('x'), Sq = mul(lin(1, a), lin(1, a)), res = sub(Sq, mul(X, X)), U = sq(u);
    var fig = cornerFig({ top: '(x+' + a + ')', left: '(x+' + a + ')', inner: 'x', unit: u, W: 190, H: 190, s: 112, cut: true, word: 'cut out', rest: '', label: 'square with a smaller square cut from one corner', maxw: 280 });
    return pp('A square ' + what + ' has sides of ' + t('(x+' + a + ')') + ' ' + u + '. A square with sides of ' + t('x') + ' ' + u + ' is cut from one corner.' + fig + 'Write a simplified expression for the area that is left.', res,
      [{ is: Sq, code: 'u3x-outer-only', hint: t(tx(Sq)) + ' is the whole ' + what + '. Subtract the cut-out square: ' + t('x\\times x=x^{2}') + '.' },
        { is: N(a * a), code: 'u3x-no-middle', hint: t('(x+' + a + ')^{2}=' + tx(Sq)) + ', with a middle term ' + t('2(x)(' + a + ')=' + 2 * a + 'x') + '. Then subtract ' + t('x^{2}') + '.' },
        { is: add(T(a, 'x', 1), N(a * a)), code: 'u3x-middle-once', hint: 'The middle term of ' + t('(x+' + a + ')^{2}') + ' is ' + t('2ab=2(x)(' + a + ')=' + 2 * a + 'x') + ', not ' + t(a + 'x') + '.' }],
      'Area left = whole square − cut-out square.<br>' + t('(x+' + a + ')^{2}=' + tx(Sq)) + ' and the cut-out square is ' + t('x^{2}') + '.<br>' + t('(' + tx(Sq) + ')-x^{2}=' + tx(res)) + ' ' + U,
      ['Area left = area of the whole square − area of the cut-out square.', t('(x+' + a + ')^{2}') + ' has a middle term: use ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + '.'], 'square minus a square', { after: U });
  }

  /* ======================= the exit slips ======================= */
  function Q(num, stem, level, make) { return { num: String(num), outcome: 'AN4', stem: stem, parts: [{ id: String(num), outcome: 'AN4', level: level, make: make }] }; }

  HW.defineExit({ lesson: 'u3l1', calc: false, outcome: 'AN4',
    blurb: 'Recognizing like terms, collecting like terms, subtracting a trinomial, and a missing side from a perimeter.',
    questions: [Q(1, 'Like terms.', 'BEG', l1q1), Q(2, 'Collect like terms.', 'BEG', l1q2), Q(3, 'Subtract.', 'PRG', l1q3), Q(4, 'A missing side.', 'MAS', l1q4)] });

  HW.defineExit({ lesson: 'u3l2', calc: false, outcome: 'AN4',
    blurb: 'Monomial × monomial, an area model for monomial × binomial, two distributions with negatives, and a missing number.',
    questions: [Q(1, 'Multiply.', 'BEG', l2q1), Q(2, 'An area model.', 'BEG', l2q2), Q(3, 'Expand and simplify.', 'PRG', l2q3), Q(4, 'The missing number.', 'MAS', l2q4)] });

  HW.defineExit({ lesson: 'u3l3', calc: false, outcome: 'AN4',
    blurb: 'An area model for (x + p)(x + q), FOIL with negative terms, and a difference of two binomial products.',
    questions: [Q(1, 'An area model.', 'BEG', l3q1), Q(2, 'FOIL.', 'PRG', l3q2), Q(3, 'Expand and simplify.', 'MAS', l3q3)] });

  HW.defineExit({ lesson: 'u3l4', calc: false, outcome: 'AN4',
    blurb: 'Choosing the pattern, a perfect square, a difference of squares, and a perfect square worked backwards.',
    questions: [Q(1, 'Expand.', 'PRG', l4q1), Q(2, 'Expand.', 'PRG', l4q2), Q(3, 'Which pattern?', 'BEG', l4q3), Q(4, 'Working backwards.', 'MAS', l4q4)] });

  HW.defineExit({ lesson: 'u3l5', calc: false, outcome: 'AN4',
    blurb: 'Binomial × trinomial with a grid and with negative terms, then a product minus a trinomial.',
    questions: [Q(1, 'Binomial × trinomial.', 'PRG', l5q1), Q(2, 'Expand and simplify.', 'PRG', l5q2), Q(3, 'Expand and simplify.', 'MAS', l5q3)] });

  HW.defineExit({ lesson: 'u3l6', calc: false, outcome: 'AN4',
    blurb: 'The area of a lawn with a flower bed cut out (a value, then a polynomial) and the volume of a box with a square base.',
    questions: [Q(1, 'Area of grass.', 'MAS', l6q1), Q(2, 'Area of grass.', 'PRG', l6q2), Q(3, 'Volume of a box.', 'PRG', l6q3)] });

  HW.defineExit({ lesson: 'u3l7', calc: false, outcome: 'AN4',
    blurb: 'Unit review: a product subtracted from a product, binomial × trinomial, and a square cut from a square.',
    questions: [Q(1, 'Expand and simplify.', 'PRG', l7q1), Q(2, 'Expand and simplify.', 'PRG', l7q2), Q(3, 'Area left over.', 'MAS', l7q3)] });
})(window);
