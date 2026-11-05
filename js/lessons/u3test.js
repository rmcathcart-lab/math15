/* Math 15 · Unit 3 Test (AN4) — Polynomial Operations, built the way the Math 10C Unit 3 Test was built (BEG / PRG / MAS
 * boxes, mostly typed answers, keys built from the generated numbers, `bad` answers with u3t- codes, worked solutions) but
 * pitched at Math 15 and NOT based on the Math 15 multiple-choice paper tests. 75 minutes, no calculator; 20 questions /
 * 34 parts (Beginning 7 / 11, Progressing 8 / 13, Mastery 5 / 10).
 *
 * How each box is pitched (numbers come from Ryan's Math 15 Lessons 1–7, assignments, extra practice and exit slips — those
 * numbers are possible values):
 *   Beginning  — each lesson's core skill as first taught: degree, coefficient and constant of a polynomial, sorting like
 *                terms, collecting like terms (one and two variables), adding two polynomials, a monomial × a monomial,
 *                3x(2x − 5), a monomial × a trinomial, FOIL on (x + 2)(x + 5) with each product in its own box,
 *                (x + 4)(x − 4), and which special-product pattern applies (Lesson 4 Example 5; no expanding).
 *   Progressing — the typical assignment question: subtracting a polynomial (horizontal or vertical), distribute then
 *                collect (two brackets, a negative multiplier), binomials with negative terms and coefficients,
 *                perfect squares (x − 7)² and (2x − 3)², binomial × trinomial (with the Lesson 5 grid, and plain), the
 *                area of a rectangle with expression sides and its value for a given x, and a lawn with a square bed cut
 *                from one corner (big area − small area).
 *   Mastery    — Math 15's hardest assignment / extra-practice items, clearly easier than the 10C Mastery box:
 *                2(x + 3)(x − 1) − (x − 2)² and (x + 4)(x² − 2x + 3) − (x² + 5x − 6) (Lesson 5 Part C); a box's volume
 *                with three expression edges and its lid "2 longer and 2 wider" (Lesson 6 Example 4 / #10); an
 *                equal-area equation set up, solved and used (Lesson 6 Example 3 / #7, EP 6 #16); the error in a worked
 *                expansion of k(x − a)² + mx (Lesson 7 #22, Lesson 5 #15) and the correct expansion; a missing term and
 *                coefficient, (x + a)(x − 5) = x² + bx − 15, and k so (x + k)(x − 6) has no x-term (EP 3 #15, #17, #18).
 * Coverage: L1 Q1, Q2, Q3, Q8 · L2 Q4, Q9 · L3 Q5, Q10 · L4 Q6, Q7, Q11 · L5 Q12, Q13, Q16b · L6 Q14, Q15, Q17, Q18 ·
 *           L7 (review) Q16, Q19, Q20.
 * Conversions to online: "state the degree / coefficient / constant" → three number boxes; "sort into groups of like
 * terms" → a table (each term → its group); "FOIL, fill in each step" → First / Outside / Inside / Last boxes, then the
 * product; "identify the pattern" → a table (difference of squares / perfect square / neither); the Lesson 5 grid → the
 * area-box widget, then the product as its own part; "write an equation and solve" → both areas expanded, then x, then the
 * common area; "describe the error" → multiple choice where each option is a claim about one line (the only Mastery MC),
 * then the correct expansion typed. Typing the question back earns nothing (TC.echoes, plus a check for the collecting and
 * adding questions, whose given expression has no brackets or powers to recognise). */
(function (root) {
  'use strict';
  var HW = root.HW, F = HW.fmt, K = HW.kit, KP = K.P, PL = HW.poly, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'u3t-deg-first': 'Degree: used the first term, not the highest-degree term', 'u3t-deg-sum': 'Degree: added the exponents of different terms (or counted terms)',
    'u3t-coef-sign': 'Coefficient without its sign', 'u3t-coef-hidden': 'Unwritten coefficient taken as 0', 'u3t-coef-exp': 'Gave the exponent instead of the coefficient',
    'u3t-const-sign': 'Constant term without its sign', 'u3t-like-row': 'Like terms: one term in the wrong group', 'u3t-like-rows': 'Like terms: two terms in the wrong groups',
    'u3t-like-many': 'Like terms: several terms in the wrong groups', 'u3t-not-collected': 'Like terms not collected (the expression copied)', 'u3t-unlike': 'Combined unlike terms',
    'u3t-term-sign': 'Lost the sign of a term while collecting', 'u3t-pat-row': 'Pattern: one product matched to the wrong pattern', 'u3t-pat-rows': 'Pattern: several products matched wrongly',
    'u3t-foil-box': 'FOIL: one of the four products wrong', 'u3t-sd-square': 'Wrote a sum × difference as a perfect square', 'u3t-sq-as-sd': 'Squared a binomial like a difference of squares',
    'u3t-area-perim': 'Gave the perimeter (or half of it) instead of the area', 'u3t-two-edges': 'Volume: multiplied only two of the three edges', 'u3t-lid-same': 'Lid: used the base’s sides (not 2 longer and 2 wider)',
    'u3t-lid-one': 'Lid: made only one side 2 longer', 'u3t-solve-sign': 'Solving: sign slip', 'u3t-solve-div': 'Solving: did not divide by the x-coefficient', 'u3t-area-x': 'Gave x instead of the area',
    'u3t-kept-error': 'Repeated the student’s error', 'u3t-a-sign': 'Working backwards: wrong sign on a', 'u3t-b-coef': 'Middle coefficient: left out the leading coefficient',
    'u3t-b-one': 'Middle coefficient: only one of the two middle products', 'u3t-b-sign': 'Middle coefficient: sign slip', 'u3t-k-sign': 'Wrong sign for k', 'u3t-k-coef': 'k: left out the leading coefficient',
    'u3t-add-exp': 'Added the exponents when adding like terms (x² + x² = 2x⁴)'
  });
  HW.addPartial({
    'u3t-deg-first': 'b', 'u3t-deg-sum': 'n', 'u3t-coef-sign': 's', 'u3t-coef-hidden': 'b', 'u3t-coef-exp': 'n', 'u3t-const-sign': 's',
    'u3t-like-row': 's', 'u3t-like-rows': 'b', 'u3t-like-many': 'n', 'u3t-not-collected': 'n', 'u3t-unlike': 'n', 'u3t-term-sign': 's',
    'u3t-pat-row': 'b', 'u3t-pat-rows': 'n', 'u3t-foil-box': 's', 'u3t-sd-square': 'n', 'u3t-sq-as-sd': 'n', 'u3t-area-perim': 'n',
    'u3t-two-edges': 'b', 'u3t-lid-same': 'b', 'u3t-lid-one': 's', 'u3t-solve-sign': 's', 'u3t-solve-div': 'b', 'u3t-area-x': 'n',
    'u3t-kept-error': 'n', 'u3t-a-sign': 's', 'u3t-b-coef': 'b', 'u3t-b-one': 'b', 'u3t-b-sign': 's', 'u3t-k-sign': 'b', 'u3t-k-coef': 'b', 'u3t-add-exp': 'n'
  });
  /* labels for shared codes this file uses (their partial-credit decisions are already in js/partial.js); kept if a lesson file set them */
  (function (o) { Object.keys(o).forEach(function (k) { if (!HW.CODES[k]) { var x = {}; x[k] = o[k]; HW.addCodes(x); } }); })({
    'first-only': 'Multiplied only the first term in the bracket', 'neg-first': 'Negative monomial: sign applied to the first term only', 'var-first': 'Variable of the monomial only on the first term',
    'fl-only': 'Expanded with only First and Last', 'one-middle': 'FOIL: one of the two middle products missing', 'last-sign': 'Wrong sign on the product of the last terms',
    'no-middle': 'Squared a binomial without the middle term', 'middle-once': 'Middle term of a square not doubled', 'sq-middle-sign': 'Wrong sign on the middle term of a square',
    'sq-last-neg': 'Made the last square negative', 'coef-not-squared': 'Coefficient not squared', 'sd-plus': 'Sum × difference gave a² + b²', 'sd-middle': 'Stray middle term in sum × difference',
    'add-coef': 'Added coefficients instead of multiplying', 'mult-exp': 'Multiplied exponents (should add)',
    'minus-first': 'Minus sign applied only to the first term', 'sub-first': 'Subtracted a bracket but changed only its first sign', 'minus-ignored': 'Added a product that is subtracted',
    'k-first': 'Number in front multiplied into only one term', 'k-forgot': 'Forgot the number in front', 'k-in-square': 'Number in front put inside the square',
    'not-subtracted': 'Did not subtract the removed area', 'whole-only': 'Used the whole rectangle (no piece removed)', perimeter: 'Gave the perimeter for an area', row: 'A row of the table wrong'
  });

  /* ---------- polynomial helpers ---------- */
  function xm(c, e, v) { var o = {}; o[v || 'x'] = e == null ? 1 : e; return PL.mono(c, o); } // c·x^e
  function M(c, vars) { return PL.mono(c, vars || {}); }
  function N(c) { return PL.num(c); }
  function lin(a, b, v) { return PL.add(xm(a, 1, v), N(b)); }
  var add = PL.add, mul = PL.mul, sub = PL.sub, neg = PL.neg;
  function tx(p) { return PL.tex(p); }
  function seq(list) { return PL.seq(list); }
  function br(list) { return '(' + seq(list) + ')'; }
  function bp(p) { return '(' + tx(p) + ')'; }
  function sumOf(list) { return add.apply(null, list); }
  function pf(p) { var s = tx(p); return PL.count(p) > 1 || s.charAt(0) === '-' ? '(' + s + ')' : s; }
  function dot(a, b) { return pf(a) + '\\cdot ' + pf(b); }
  function coefOf(m) { var ts = PL.terms(m); return ts.length ? ts[0].c[0] / ts[0].c[1] : 0; }
  function lab(p, i) { var s = tx(p); return i > 0 && s.charAt(0) !== '-' ? '+' + s : s; }
  function termsOf(p) { return PL.sorted(p).map(function (q) { return M(q.c, q.v); }); }
  function lead(p) { return termsOf(p)[0]; }
  function find(gen, test, fb) { for (var i = 0; i < 3000; i++) { var v = gen(); if (v != null && test(v)) return v; } return fb; }
  function nz(r, a, b) { return (r.chance(0.5) ? 1 : -1) * r.int(a, b); }
  function sg(n) { return n < 0 ? String(n) : '+' + n; }
  function cnum(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function plain(s) { return String(s).replace(/\\left|\\right|\\,|\\ /g, '').replace(/\\cdot/g, '·').replace(/[{}\\]/g, ''); }
  /* every term of A times every term of B, written out, then collected */
  function prods(A, B) { var ps = []; termsOf(A).forEach(function (a) { termsOf(B).forEach(function (b) { ps.push(mul(a, b)); }); }); return ps; }
  function distTex(A, B) { var s = seq(prods(A, B)), res = tx(mul(A, B)); return s === res ? s : s + '=' + res; }
  function sqNoMid(a) { var la = lead(a), rest = sub(a, la); return add(mul(la, la), mul(rest, rest)); }
  /* subtracting B but changing only the sign of its first term */
  function subFirstOnly(A, B) { var lb = lead(B); return add(A, neg(lb), sub(B, lb)); }

  /* ---------- part builders ---------- */
  function cleanWs(target, ws) {
    var seen = [PL.lift(target)], W = [];
    (ws || []).forEach(function (w) { if (!w || !w.is) return; var p = PL.lift(w.is); if (seen.some(function (s) { return PL.eq(s, p); })) return; seen.push(p); W.push({ is: p, code: w.code, hint: w.hint }); });
    return W;
  }
  /* polynomial answer: classic wrong answers that coincide with the key (or each other) are dropped; the rest are bad answers */
  function pp(prompt, target, ws, sol, hints, text, opt) {
    opt = opt || {};
    var W = cleanWs(target, ws);
    var part = KP.poly(prompt, target, Object.assign({}, opt, { wrong: W }), sol, hints, text);
    part.bad = W.map(function (w) { return tx(w.is); });
    if (PL.count(target) > 1) part.good = [PL.tex(target, { order: 'asc' })];
    return part;
  }
  function polyChk(target, ws, opt) { return K.poly(target, Object.assign({}, opt || {}, { wrong: cleanWs(target, ws) })); }
  function numChk(n, alts) {
    return K.number(n, function (v) { for (var i = 0; i < (alts || []).length; i++) if (alts[i] && v === alts[i].v && v !== n) return { code: alts[i].code, hint: alts[i].hint }; return null; });
  }
  function altVals(n, alts) { var seen = [n]; return (alts || []).filter(function (a) { if (!a || !isFinite(a.v) || seen.indexOf(a.v) >= 0) return false; seen.push(a.v); return true; }); }
  function pbox(label, vars, extra) { return Object.assign({ label: label, name: label.replace(/<[^>]*>|\\\(|\\\)/g, '').replace(/:$/, ''), mode: 'math', keys: 'poly', vars: vars || ['x'], wide: true }, extra || {}); }
  function nbox(label, extra) { return Object.assign({ label: label, name: label.replace(/<[^>]*>|\\\(|\\\)/g, '').replace(/:$/, '') }, extra || {}); }
  /* several boxes checked together (checks[i](value, all) → result); reports the first wrong box, else the first form issue */
  function boxes(prompt, fields, checks, keys, answer, sol, hints, text, bad, good) {
    var labels = fields.map(function (f) { return f.name || f.label; });
    return { prompt: prompt, input: { type: 'fields', fields: fields }, key: keys, answer: answer, solution: sol, hints: hints || [], text: text, bad: bad || [], good: good || [],
      check: function (resp) {
        resp = resp || []; var firstForm = null, firstWrong = null;
        for (var i = 0; i < checks.length; i++) {
          var r = checks[i](resp[i] == null ? '' : resp[i], resp); if (r.v === 'correct') continue;
          var out = { v: r.v, code: r.code, hint: '<b>' + labels[i] + ':</b> ' + (r.hint || 'Check this one again.') };
          if (r.v === 'form') { if (!firstForm) firstForm = out; } else if (!firstWrong) firstWrong = out;
        }
        return firstWrong || firstForm || ok();
      } };
  }
  function readT(s) { var a = HW.ex.parse(String(s == null ? '' : s).replace(/\\left|\\right/g, '')); if (!a.ok) return null; var q = PL.read(a.ast); return q.ok ? q.p : null; }

  /* ---------- "collect like terms": the given expression typed back (brackets dropped at most) shows no work ---------- */
  function writtenTerms(resp) {
    var a = K.read(resp); if (a.res) return null; var out = [];
    (function w(x, s) {
      if (x.t === 'paren') { w(x.a, s); return; }
      if (x.t === 'add') { w(x.a, s); w(x.b, s); return; }
      if (x.t === 'sub') { w(x.a, s); w(x.b, -s); return; }
      if (x.t === 'neg' && (x.a.t === 'add' || x.a.t === 'sub' || x.a.t === 'paren' || x.a.t === 'neg')) { w(x.a, -s); return; }
      var q = PL.read(x); out.push(q.ok ? PL.scale(q.p, s) : null);
    })(a.ast, 1);
    return out;
  }
  function sameTerms(A, B) {
    if (!A || A.length !== B.length) return false; var left = B.slice();
    return A.every(function (p) { if (!p) return false; for (var i = 0; i < left.length; i++) if (PL.eq(p, left[i])) { left.splice(i, 1); return true; } return false; });
  }
  function noCollect(part, orig) {
    var base = part.check;
    part.check = function (resp) {
      var res = base(resp);
      if (res && res.v === 'form' && sameTerms(writtenTerms(resp), orig)) return wrong('u3t-not-collected', 'That is the expression you were given. <b>Collect</b> the like terms: add the coefficients of the terms with the same variable part.');
      return res;
    };
    part.bad = (part.bad || []).concat([seq(orig)]);
    return part;
  }

  /* ---------- classic wrong answers ---------- */
  /* a monomial times a bracket */
  function monoWrongs(m, terms) {
    var out = [], prods0 = terms.map(function (q) { return mul(m, q); }), c = coefOf(m);
    if (terms.length > 1) {
      out.push({ is: sumOf([prods0[0]].concat(terms.slice(1))), code: 'first-only', hint: 'Multiply <b>every</b> term in the bracket by ' + t(tx(m)) + ', not just the first one.' });
      if (c < 0) out.push({ is: sumOf([prods0[0]].concat(terms.slice(1).map(function (q) { return mul(neg(m), q); }))), code: 'neg-first', hint: 'The negative sign is part of ' + t(tx(m)) + ', so it multiplies <b>every</b> term in the bracket. Check the signs after the first term.' });
      if (PL.vars(m).length) out.push({ is: sumOf([prods0[0]].concat(terms.slice(1).map(function (q) { return mul(N(c), q); }))), code: 'var-first', hint: 'The ' + t('x') + ' in ' + t(tx(m)) + ' multiplies every term in the bracket too, not just the first one.' });
    }
    return out;
  }
  /* binomial × binomial: (A + B)(C + D) */
  function foil(A, B, C, D) { var Fp = mul(A, C), O = mul(A, D), I = mul(B, C), L = mul(B, D); return { F: Fp, O: O, I: I, L: L, res: add(Fp, O, I, L) }; }
  function binWrongs(A, B, C, D) {
    var f = foil(A, B, C, D), bothNeg = coefOf(B) < 0 && coefOf(D) < 0, mid = 'You have only one of the two middle products. Find both the Outside product ' + t(dot(A, D)) + ' and the Inside product ' + t(dot(B, C)) + '.';
    return [{ is: add(f.F, f.L), code: 'fl-only', hint: 'You multiplied only the <b>First</b> terms and the <b>Last</b> terms. Two binomials give <b>four</b> products — the Outside and Inside products make the middle term.' },
      { is: add(f.F, f.O, f.L), code: 'one-middle', hint: mid }, { is: add(f.F, f.I, f.L), code: 'one-middle', hint: mid },
      { is: add(f.F, f.O, f.I, neg(f.L)), code: 'last-sign', hint: 'Check the sign of the last term: ' + t(dot(B, D)) + '.' + (bothNeg ? ' A negative times a negative is <b>positive</b>.' : '') }];
  }
  function foilSol(A, B, C, D) {
    var f = foil(A, B, C, D), s4 = seq([f.F, f.O, f.I, f.L]);
    return 'F: ' + t(dot(A, C) + '=' + tx(f.F)) + ', &nbsp;O: ' + t(dot(A, D) + '=' + tx(f.O)) + ', &nbsp;I: ' + t(dot(B, C) + '=' + tx(f.I)) + ', &nbsp;L: ' + t(dot(B, D) + '=' + tx(f.L)) + '<br>' + t(s4 + (s4 !== tx(f.res) ? '=' + tx(f.res) : ''));
  }
  var HB = ['Two binomials give <b>four</b> products — First, Outside, Inside, Last — then collect the like terms.', 'Check the sign of each of the four products on its own: (pos)(neg) is negative, (neg)(neg) is positive.'];
  /* the square of a binomial A + B */
  function sqWrongs(A, B) {
    var A2 = mul(A, A), B2 = mul(B, B), AB = mul(A, B), S = '(a\\pm b)^{2}=a^{2}\\pm 2ab+b^{2}';
    var out = [{ is: add(A2, B2), code: 'no-middle', hint: 'A square of a binomial is the binomial times <b>itself</b>: expand all four products. The Outside and Inside products give a middle term, ' + t('2ab') + '.' },
      { is: add(A2, AB, B2), code: 'middle-once', hint: 'The Outside and Inside products are the <b>same</b>, so that term appears <b>twice</b>: the middle term is ' + t('2ab') + '.' },
      { is: add(A2, PL.scale(AB, -2), B2), code: 'sq-middle-sign', hint: 'Check the <b>sign of the middle term</b>: it is ' + t('2ab') + ', using the signs of the two terms as written.' },
      { is: add(A2, PL.scale(AB, 2), neg(B2)), code: 'sq-last-neg', hint: 'The last term of a square is ' + t('b^{2}') + ', and a square is never negative.' },
      { is: sub(A2, B2), code: 'u3t-sq-as-sd', hint: 'This is a <b>square</b> — the same binomial twice — not a sum times a difference. Use ' + t(S) + ', which has a middle term.' }];
    var ca = Math.abs(coefOf(A));
    if (ca !== 1) out.push({ is: add(PL.scale(A2, [1, ca]), PL.scale(AB, 2), B2), code: 'coef-not-squared', hint: 'Square the <b>whole</b> first term, coefficient and all: ' + t('(' + tx(A) + ')^{2}=' + tx(A2)) + '.' });
    return out;
  }
  function sqSol(A, B) {
    var nb = coefOf(B) < 0, Bp = nb ? neg(B) : B, Ap = PL.count(A) === 1 && coefOf(A) === 1 ? tx(A) : '(' + tx(A) + ')', sqB = PL.vars(Bp).length ? '(' + tx(Bp) + ')' : tx(Bp);
    return 'Perfect square, ' + t('(a' + (nb ? '-' : '+') + 'b)^{2}=a^{2}' + (nb ? '-' : '+') + '2ab+b^{2}') + ':<br>' + t('(' + tx(add(A, B)) + ')^{2}=' + Ap + '^{2}' + (nb ? '-' : '+') + '2' + Ap + '(' + tx(Bp) + ')+' + sqB + '^{2}=' + tx(mul(add(A, B), add(A, B))));
  }

  /* ---------- the Lesson 5 grid (js/draw2.js areabox): rows = binomial terms, columns = trinomial terms ---------- */
  function gridSol(top, side) {
    var cells = side.map(function (s) { return top.map(function (q) { return tx(mul(q, s)); }); });
    return HW.areaModel(top.map(lab), side.map(lab), cells, { widths: top.map(function (p) { return PL.degree(p) > 0 ? 2 : 1.2; }), heights: side.map(function (p) { return PL.degree(p) > 0 ? 2 : 1.2; }), max: 320 });
  }
  function boxPart(prompt, cols, rows, o) {
    o = o || {};
    var Rt = rows.map(tx), Ct = cols.map(tx), Mp = rows.map(function (a) { return cols.map(function (b) { return mul(a, b); }); }), Mt = Mp.map(function (rw) { return rw.map(tx); });
    var inp = { rows: Rt.slice(), cols: Ct.slice(), cells: Mt.map(function (rw) { return rw.map(function () { return null; }); }), keys: 'poly', vars: ['x'] };
    var key = { rows: Rt.slice(), cols: Ct.slice(), cells: Mt.map(function (rw) { return rw.slice(); }) };
    var list = [];
    rows.forEach(function (a, i) { cols.forEach(function (b, j) { list.push(t(dot(a, b) + '=' + Mt[i][j])); }); });
    var p = KP.areabox(prompt, inp, {}, key, gridSol(cols, rows) + 'Each cell is (row term) × (column term): ' + list.join(', &nbsp;') + '.',
      ['Each cell is the term at the start of its row times the term at the top of its column — sign included.', 'Multiply the coefficients and add the exponents: ' + t('x\\cdot x^{2}=x^{3}') + '.'], o.text || 'grid');
    var copy = function () { return { rows: Rt.slice(), cols: Ct.slice(), cells: Mt.map(function (rw) { return rw.slice(); }) }; }, bads = [];
    var negC = null; rows.forEach(function (a, i) { cols.forEach(function (b, j) { if (!negC && coefOf(Mp[i][j]) < 0) negC = [i, j]; }); });
    if (negC) { var b1 = copy(); b1.cells[negC[0]][negC[1]] = tx(neg(Mp[negC[0]][negC[1]])); bads.push(b1); }
    var b2 = copy(); b2.cells[0][0] = tx(xm(1, 2)); bads.push(b2); // x · x² written as x²
    p.bad = bads;
    return p;
  }

  /* ---------- figures (inline SVG) ---------- */
  function svgBox(w, h, body, label, maxW) {
    return '<div style="margin:.4em 0 .2em"><svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" style="max-width:' + (maxW || w) + 'px;display:block" role="img" aria-label="' + HW.esc(label) + '" fill="none" stroke="currentColor" stroke-width="1.5" font-size="16" font-family="KaTeX_Main,\'Times New Roman\',serif">' + body + '</svg></div>';
  }
  function txt(x, y, s, o) { o = o || {}; return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" fill="currentColor" stroke="none" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central"' + (o.size ? ' font-size="' + o.size + '"' : '') + (o.bold ? ' font-weight="bold"' : '') + '>' + s + '</text>'; }
  /* plain SVG label: italic letters, superscript digits, real minus signs */
  function svgLab(p) {
    var s = typeof p === 'string' ? p : tx(p), out = '';
    s = s.replace(/\^\{(\d+)\}/g, function (m, d) { return d.split('').map(function (c) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'.charAt(+c); }).join(''); });
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      if (/[a-z]/.test(ch)) out += '<tspan font-style="italic">' + ch + '</tspan>';
      else if (ch === '+') out += ' + ';
      else if (ch === '-') out += i === 0 ? '−' : ' − ';
      else out += ch;
    }
    return out;
  }
  function withU(p, u) { return svgLab(p) + (u ? ' ' + u : ''); }
  /* a rectangle labelled below and on the left */
  function rectSvg(wLab, hLab, u) {
    var body = '<rect x="110" y="16" width="230" height="96" fill="rgba(110,150,200,0.18)" stroke-width="2"/>' + txt(225, 132, withU(wLab, u)) + txt(102, 64, withU(hLab, u), { anchor: 'end' });
    return svgBox(380, 146, body, 'a rectangle ' + plain(tx(wLab)) + ' long and ' + plain(tx(hLab)) + ' wide', 380);
  }
  /* a rectangle with a square cut from its top-right corner (shaded = what is left) */
  function cornerSvg(wLab, hLab, sLab, u) {
    var x0 = 110, y0 = 22, w = 240, h = 140, s = 70;
    var body = '<path d="M' + x0 + ' ' + y0 + ' H' + (x0 + w - s) + ' V' + (y0 + s) + ' H' + (x0 + w) + ' V' + (y0 + h) + ' H' + x0 + ' Z" fill="rgba(110,150,200,0.32)" stroke-width="2"/>' +
      '<rect x="' + (x0 + w - s) + '" y="' + y0 + '" width="' + s + '" height="' + s + '" stroke-dasharray="5 4" stroke-width="1.4"/>' +
      txt(x0 + w / 2, y0 + h + 18, withU(wLab, u)) + txt(x0 - 8, y0 + h / 2, withU(hLab, u), { anchor: 'end' }) + txt(x0 + w - s / 2, y0 + s / 2, svgLab(sLab), { size: 14 }) +
      txt(x0 + w - s / 2, y0 + s + 14, 'bed', { size: 12 });
    return svgBox(400, 196, body, 'a rectangle ' + plain(tx(wLab)) + ' by ' + plain(tx(hLab)) + ' with a square of side ' + plain(tx(sLab)) + ' cut from one corner', 400);
  }
  /* a rectangular prism: front width, height, depth */
  function prismSvg(wLab, hLab, dLab, u) {
    var x0 = 110, y0 = 130, w = 190, h = 92, dx = 62, dy = -38, P = function (x, y) { return x.toFixed(1) + ',' + y.toFixed(1); };
    var body = '<polygon points="' + P(x0, y0) + ' ' + P(x0 + w, y0) + ' ' + P(x0 + w, y0 - h) + ' ' + P(x0, y0 - h) + '" fill="rgba(110,150,200,0.18)" stroke-width="2"/>' +
      '<polygon points="' + P(x0, y0 - h) + ' ' + P(x0 + dx, y0 - h + dy) + ' ' + P(x0 + w + dx, y0 - h + dy) + ' ' + P(x0 + w, y0 - h) + '" fill="rgba(110,150,200,0.28)" stroke-width="2"/>' +
      '<polygon points="' + P(x0 + w, y0) + ' ' + P(x0 + w + dx, y0 + dy) + ' ' + P(x0 + w + dx, y0 - h + dy) + ' ' + P(x0 + w, y0 - h) + '" fill="rgba(110,150,200,0.36)" stroke-width="2"/>' +
      '<path d="M' + P(x0, y0) + ' L' + P(x0 + dx, y0 + dy) + ' L' + P(x0 + w + dx, y0 + dy) + ' M' + P(x0 + dx, y0 + dy) + ' L' + P(x0 + dx, y0 - h + dy) + '" stroke-dasharray="5 4" stroke-width="1.2"/>' +
      txt(x0 + w / 2, y0 + 18, withU(wLab, u)) + txt(x0 - 8, y0 - h / 2, withU(hLab, u), { anchor: 'end' }) + txt(x0 + w + dx / 2 + 10, y0 + dy / 2 + 10, withU(dLab, u), { anchor: 'start' });
    return svgBox(450, 160, body, 'a rectangular prism with edges ' + plain(tx(wLab)) + ', ' + plain(tx(hLab)) + ' and ' + plain(tx(dLab)), 450);
  }
  /* two rectangles side by side, A and B */
  function twoRectSvg(A1, A2, B1, B2, u) {
    var r = function (x0, w, h, l1, l2, name) { return '<rect x="' + x0 + '" y="' + (40 + (110 - h)) + '" width="' + w + '" height="' + h + '" fill="rgba(110,150,200,0.2)" stroke-width="2"/>' + txt(x0 + w / 2, 150 + 16, withU(l1, u)) + txt(x0 - 8, 40 + 110 - h / 2, withU(l2, u), { anchor: 'end' }) + txt(x0 + w / 2, 40 + (110 - h) + h / 2, name, { bold: true }); };
    var body = r(96, 150, 96, A1, A2, 'A') + r(372, 176, 80, B1, B2, 'B');
    return svgBox(580, 180, body, 'Plot A is ' + plain(tx(A1)) + ' by ' + plain(tx(A2)) + '; Plot B is ' + plain(tx(B1)) + ' by ' + plain(tx(B2)), 580);
  }
  /* one student's work, line by line */
  function workTable(name, lines) {
    var cell = 'border:1px solid currentColor;padding:.3em .8em;';
    return '<table class="u3t-work" style="border-collapse:collapse;margin:.5em 0"><tr><th style="' + cell + 'text-align:left" colspan="2">' + name + '’s work</th></tr>' +
      lines.map(function (l, i) { return '<tr><td style="' + cell + 'white-space:nowrap">' + (i ? 'Line ' + i : '') + '</td><td style="' + cell + '">' + t((i ? '=' : '') + l) + '</td></tr>'; }).join('') + '</table>';
  }

  /* ======================= shared question params ======================= */
  /* Q1: a 4-term polynomial; maybe not in descending order */
  function q1Shared(r) {
    var degs = r.pick([[3, 2, 1, 0], [4, 3, 1, 0], [3, 2, 1, 0], [4, 2, 1, 0], [5, 3, 2, 0], [4, 3, 2, 0]]);
    var coefs = degs.map(function () { return nz(r, 2, 9); });
    if (r.chance(0.45)) coefs[r.pick([1, 2])] = r.pick([1, -1]);
    if (coefs.every(function (c) { return c > 0; })) coefs[r.int(1, 3)] *= -1;
    var order = r.chance(0.55) ? [0, 1, 2, 3] : r.pick([[1, 0, 2, 3], [3, 0, 1, 2], [2, 0, 3, 1], [1, 3, 0, 2], [2, 1, 0, 3]]);
    var cand = [1, 2].filter(function (i) { return coefs[i] < 0 || Math.abs(coefs[i]) === 1; }), ask = cand.length ? r.pick(cand) : r.pick([1, 2]);
    var terms = degs.map(function (d, i) { return xm(coefs[i], d); });
    return { degs: degs, coefs: coefs, order: order, ask: ask, terms: terms, tex: seq(order.map(function (i) { return terms[i]; })) };
  }
  function q12Shared(r) { return find(function () { return { a: nz(r, 1, 5), b: nz(r, 1, 5), c: nz(r, 1, 6) }; }, function (v) { return v.a + v.b !== 0 && v.a * v.b + v.c !== 0 && v.a * v.c !== 0 && (v.a < 0 || v.b < 0 || v.c < 0) && Math.abs(v.c) !== 1; }, { a: 3, b: -2, c: 4 }); }
  function q14Shared(r) {
    var v = find(function () { return { a: r.int(1, 9), b: r.chance(0.2) ? -r.int(1, 4) : r.int(1, 9), n: r.int(2, 8) }; }, function (v) { return v.a !== v.b && v.n + v.b > 0 && v.a + v.b !== 0; }, { a: 4, b: 1, n: 5 });
    v.u = r.pick([['window', 'ft'], ['patio', 'm'], ['garden', 'm'], ['poster', 'dm'], ['deck', 'm'], ['rug', 'm']]);
    return v;
  }
  function q17Shared(r) {
    var v = find(function () { return { a: r.int(1, 6), b: r.int(1, 5), h: r.int(1, 5), sq: r.chance(0.3) }; }, function (v) { return v.sq ? true : v.a !== v.b && v.a + v.b + v.h <= 13; }, { a: 4, b: 1, h: 2, sq: false });
    if (v.sq) { v.b = v.a; v.h = 0; } // a square base (x + a) by (x + a), height x
    v.ctx = r.pick([{ w: 'fish tank', lid: 'glass lid', u: 'cm' }, { w: 'sandbox', lid: 'wooden cover', u: 'ft' }, { w: 'planter box', lid: 'lid', u: 'ft' }, { w: 'storage crate', lid: 'lid', u: 'cm' }]);
    return v;
  }
  function q18Shared(r) {
    var v = find(function () {
      var sq = r.chance(0.35), a = r.int(1, 9), b = sq ? a : r.int(1, 12), c = r.int(1, 12), d = r.int(1, 12);
      return { a: a, b: b, c: c, d: d, sq: sq };
    }, function (v) {
      var den = v.a + v.b - v.c - v.d, num = v.c * v.d - v.a * v.b;
      if (!den || num % den) return false; var x = num / den;
      return x >= 1 && x <= 9 && v.c < v.d && (v.sq || v.a < v.b) && !(v.a === v.c && v.b === v.d) && Math.abs(den) <= 4;
    }, { a: 3, b: 7, c: 2, d: 9, sq: false });
    v.x = (v.c * v.d - v.a * v.b) / (v.a + v.b - v.c - v.d);
    v.ctx = r.pick([{ w: 'garden plots', one: 'Plot', u: 'm' }, { w: 'rugs', one: 'Rug', u: 'ft' }, { w: 'rectangles', one: 'Rectangle', u: 'cm' }, { w: 'patios', one: 'Patio', u: 'm' }]);
    return v;
  }
  /* Q19: k(x + sa)² + mx, one student, one error (line 1, 2 or 3) */
  var NAMES = ['Malik', 'Sana', 'Jordan', 'Maya', 'Ravi', 'Tess', 'Owen', 'Lina', 'Priya', 'Marco'];
  function q19Shared(r) {
    var v = find(function () { return { k: r.int(2, 4), a: r.int(1, 5), s: r.pick([-1, -1, 1]), m: nz(r, 1, 9) }; }, function (v) { var mid = 2 * v.k * v.s * v.a; return mid + v.m !== 0 && mid - v.m !== 0 && Math.abs(v.m) !== Math.abs(mid) && v.a !== v.k; }, { k: 4, a: 2, s: -1, m: -3 });
    v.line = r.pick([1, 1, 2, 2, 3]);
    v.kind = v.line === 1 ? r.pick(['nomid', 'once', 'pre']) : v.line === 2 ? r.pick(['kfirst', 'klast']) : 'collect';
    v.name = r.pick(NAMES);
    return v;
  }
  function q19Work(v) {
    var k = v.k, X = xm(1), Aa = N(v.s * v.a), mx = xm(v.m), base = add(X, Aa), K0 = N(k);
    var sqC = mul(base, base), start = k + '(' + tx(base) + ')^{2}' + lab(mx, 1);
    var L1 = k + bp(sqC) + lab(mx, 1), L2t = termsOf(mul(K0, sqC)).concat([mx]), L2 = seq(L2t), res = add(mul(K0, sqC), mx), lines, out;
    if (v.kind === 'nomid') { var q = add(xm(1, 2), N(v.a * v.a)); out = add(mul(K0, q), mx); lines = [start, k + bp(q) + lab(mx, 1), seq(termsOf(mul(K0, q)).concat([mx])), tx(out)]; }
    else if (v.kind === 'once') { var q2 = add(xm(1, 2), xm(v.s * v.a), N(v.a * v.a)); out = add(mul(K0, q2), mx); lines = [start, k + bp(q2) + lab(mx, 1), seq(termsOf(mul(K0, q2)).concat([mx])), tx(out)]; }
    else if (v.kind === 'pre') { var kb = mul(K0, base), q3 = mul(kb, kb); out = add(q3, mx); lines = [start, '(' + tx(kb) + ')^{2}' + lab(mx, 1), seq(termsOf(q3).concat([mx])), tx(out)]; }
    else if (v.kind === 'kfirst') { var w2 = [xm(k, 2), xm(2 * v.s * v.a), N(v.a * v.a), mx]; out = sumOf(w2); lines = [start, L1, seq(w2), tx(out)]; }
    else if (v.kind === 'klast') { var w3 = [xm(k, 2), xm(2 * k * v.s * v.a), N(v.a * v.a), mx]; out = sumOf(w3); lines = [start, L1, seq(w3), tx(out)]; }
    else { out = add(xm(k, 2), xm(2 * k * v.s * v.a - v.m), N(k * v.a * v.a)); lines = [start, L1, L2, tx(out)]; }
    return { lines: lines, out: out, res: res, start: start, L1: L1, L2: L2 };
  }

  HW.defineTest({
    id: 'u3test', unit: 3, title: 'Unit 3 Test', outcome: 'AN4', calc: false,
    blurb: 'The Unit 3 outcomes-based test on AN4 (polynomial operations): like terms, adding and subtracting polynomials, monomial × polynomial, two binomials, special products, binomial × trinomial, and area, volume and equal-area applications — at the BEG, PRG and MAS levels.',
    questions: [
      /* ======================= Beginning ======================= */
      { num: '1', outcome: 'AN4', shared: q1Shared,
        stem: function (s) { return 'Use the polynomial ' + t(s.tex) + '.'; },
        parts: [
          { id: '1', outcome: 'AN4', level: 'BEG', make: function (r, s) {
            var deg = Math.max.apply(null, s.degs), first = s.degs[s.order[0]], sumD = s.degs.reduce(function (a, b) { return a + b; }, 0);
            var ai = s.ask, c = s.coefs[ai], d = s.degs[ai], vt = d === 1 ? 'x' : 'x^{' + d + '}', k = s.coefs[3];
            var degAlts = altVals(deg, [{ v: first, code: 'u3t-deg-first', hint: 'The degree of a polynomial is the degree of its <b>highest-degree</b> term, and that term isn’t always written first.' },
              { v: sumD, code: 'u3t-deg-sum', hint: 'Don’t add the exponents of different terms: the degree of the polynomial is the <b>largest</b> degree of any one term.' },
              { v: 4, code: 'u3t-deg-sum', hint: 'That is the number of terms. The degree is the largest exponent on ' + t('x') + '.' }]);
            var cAlts = altVals(c, [c < 0 ? { v: -c, code: 'u3t-coef-sign', hint: 'Each term keeps the sign in front of it: the coefficient is negative.' } : null,
              Math.abs(c) === 1 ? { v: 0, code: 'u3t-coef-hidden', hint: 'No number is written, but the coefficient of ' + t(c < 0 ? '-' + vt : vt) + ' is ' + t(c) + ', not ' + t('0') + '.' } : null,
              { v: d, code: 'u3t-coef-exp', hint: 'That is the exponent. The coefficient is the <b>number</b> multiplying the variable.' }]);
            var kAlts = altVals(k, [{ v: -k, code: 'u3t-const-sign', hint: 'The constant term keeps the sign in front of it.' }]);
            var p = KP.fields('State the degree of the polynomial, the coefficient of the ' + t(vt) + '-term, and the constant term.',
              [nbox('Degree of the polynomial:'), nbox('Coefficient of the ' + t(vt) + '-term:'), nbox('Constant term:')],
              [numChk(deg, degAlts), numChk(c, cAlts), numChk(k, kAlts)], [String(deg), String(c), String(k)],
              'degree ' + t(deg) + '; coefficient ' + t(c) + '; constant term ' + t(k),
              'The terms and their degrees: ' + s.order.map(function (i) { return t(tx(s.terms[i])) + ' (degree ' + s.degs[i] + ')'; }).join(', ') + '.<br>' +
                'The degree of the polynomial is the largest of these: ' + t(deg) + '.<br>The ' + t(vt) + '-term is ' + t(tx(s.terms[ai])) + ', so its coefficient is ' + t(c) + (Math.abs(c) === 1 ? ' (an unwritten coefficient is ' + t(c) + ')' : '') + '.<br>The constant term (no variable) is ' + t(k) + ' — it keeps its sign.',
              ['The degree of a term is its exponent; the degree of the polynomial is the largest one.', 'Each term keeps the sign in front of it.'], 'degree, coefficient, constant: ' + plain(s.tex));
            p.bad = degAlts.map(function (x) { return [String(x.v), String(c), String(k)]; }).concat(cAlts.map(function (x) { return [String(deg), String(x.v), String(k)]; }), kAlts.map(function (x) { return [String(deg), String(c), String(x.v)]; }));
            return p;
          } }] },
      { num: '2', outcome: 'AN4', stem: 'Like terms have exactly the same variable(s) with exactly the same exponent(s).', parts: [
        { id: '2', outcome: 'AN4', level: 'BEG', make: function (r) {
          var C = r.int(2, 9), items = [], used = {};
          var put = function (p, g) { var s = tx(p); if (used[s]) return false; used[s] = 1; items.push({ p: p, g: g }); return true; };
          put(xm(r.pick([1, -1]) * C, 1), 'x'); put(xm(r.pick([1, -1]) * C, 2), 'x2');
          put(xm(r.pick([1, -1]), 1), 'x');
          find(function () { return nz(r, 2, 9); }, function (c) { return put(xm(c, 2), 'x2'); }, 0);
          find(function () { return nz(r, 2, 9); }, function (c) { return put(xm(c, 1, 'y'), 'y'); }, 0);
          find(function () { return nz(r, 2, 9); }, function (c) { return put(N(c), 'c'); }, 0);
          if (r.chance(0.5)) find(function () { return nz(r, 1, 9); }, function (c) { return put(xm(c, 1, 'y'), 'y'); }, 0);
          else find(function () { return nz(r, 2, 9); }, function (c) { return put(N(c), 'c'); }, 0);
          items = r.shuffle(items);
          var G = { x: t('x') + '-terms', x2: t('x^{2}') + '-terms', y: t('y') + '-terms', c: 'Constants' };
          var rows = items.map(function (it, i) { return { id: 'r' + i, html: t(tx(it.p)), label: tx(it.p) }; }), want = {}, by = {};
          items.forEach(function (it, i) { want['r' + i] = it.g; by['r' + i] = it; });
          var cols = ['x', 'x2', 'y', 'c'].map(function (g) { return { id: g, html: G[g], label: g }; });
          var why = function (id) {
            var it = by[id], s = t(tx(it.p));
            return { code: 'u3t-like-row', hint: it.g === 'x2' ? s + ': like terms need the same variable <b>and</b> the same exponent, so ' + s + ' only goes with other ' + t('x^{2}') + '-terms.' :
              it.g === 'x' ? s + ' is ' + t('x') + ' to the power ' + t('1') + (Math.abs(coefOf(it.p)) === 1 ? ' (its coefficient is ' + t(coefOf(it.p)) + ')' : '') + ': it is an ' + t('x') + '-term.' :
              it.g === 'y' ? s + ' has a different letter, so it goes with the other ' + t('y') + '-terms, not the ' + t('x') + '-terms.' : s + ' has no variable at all: it is a constant.' };
          };
          var g = KP.grid('Sort the terms into groups of like terms: choose the group for each term.', rows, cols, want, { why: why, rowHead: 'Term' },
            ['x', 'x2', 'y', 'c'].map(function (gr) { return G[gr] + ': ' + items.filter(function (it) { return it.g === gr; }).map(function (it) { return t(tx(it.p)); }).join(', '); }).join('<br>') +
              '<br>(' + t(tx(items.filter(function (it) { return it.g === 'x'; })[0].p)) + ' and ' + t(tx(items.filter(function (it) { return it.g === 'x2'; })[0].p)) + ' are <b>not</b> like terms: the exponents differ.)',
            ['Look at the variable part only: same letter <b>and</b> same exponent means like terms.', 'A term with no variable is a constant.'], 'sort like terms');
          var base = g.check;
          g.check = function (resp) {
            var res = base(resp); if (res.v !== 'wrong') return res; resp = resp || {};
            var nBad = Object.keys(want).filter(function (k) { return resp[k] !== want[k]; }).length;
            if (nBad === 1) return res;
            return wrong(nBad === 2 ? 'u3t-like-rows' : 'u3t-like-many', res.hint);
          };
          var ids = Object.keys(want), sw = {}, one = {}; ids.forEach(function (k) { sw[k] = want[k]; one[k] = want[k]; });
          var kx2 = ids.filter(function (k) { return want[k] === 'x2'; })[0]; one[kx2] = 'x';
          ids.forEach(function (k) { if (want[k] === 'x2') sw[k] = 'x'; else if (want[k] === 'x') sw[k] = 'x2'; });
          g.bad = [one, sw];
          return g;
        } }] },
      { num: '3', outcome: 'AN4', stem: 'Simplify by collecting like terms.', parts: [
        { id: '3a', outcome: 'AN4', level: 'BEG', make: function (r) {
          var v = find(function () { return { A: r.int(2, 9), D: nz(r, 1, 7), B: nz(r, 1, 9), E: nz(r, 1, 9), C: nz(r, 1, 9), Fc: nz(r, 1, 9) }; },
            function (v) { return v.A + v.D !== 0 && v.B + v.E !== 0 && v.C + v.Fc !== 0 && (v.D < 0 || v.E < 0 || v.Fc < 0) && Math.abs(v.B) !== Math.abs(v.E); }, { A: 8, D: -2, B: -3, E: 1, C: 5, Fc: -9 });
          var T0 = [xm(v.A, 2), xm(v.B), N(v.C), xm(v.D, 2), xm(v.E), N(v.Fc)];
          var ord = r.pick([[0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5], [2, 0, 1, 5, 3, 4], [0, 2, 4, 1, 3, 5], [1, 0, 3, 2, 5, 4]]), shown = ord.map(function (i) { return T0[i]; });
          var T = sumOf(T0), ex0 = seq(shown);
          var negI = [3, 4, 5].filter(function (i) { return coefOf(T0[i]) < 0; })[0], slip = add(T, PL.scale(T0[negI], -2));
          var ws = [{ is: add(xm(v.A + v.D, 4), xm(v.B + v.E, 2), N(v.C + v.Fc)), code: 'u3t-add-exp', hint: 'When you add like terms the exponent stays the same: ' + t('3x^{2}+2x^{2}=5x^{2}') + ', not ' + t('5x^{4}') + '.' },
            { is: slip, code: 'u3t-term-sign', hint: 'Check the sign of ' + t(tx(T0[negI])) + ': each term keeps the sign in front of it.' },
            { is: add(xm(v.A + v.D + v.B + v.E, 2), N(v.C + v.Fc)), code: 'u3t-unlike', hint: t('x^{2}') + '-terms and ' + t('x') + '-terms are <b>unlike</b> terms (different exponents): they can’t be combined.' }];
          return noCollect(pp(t(ex0), T, ws,
            'Group the like terms, then add their coefficients:<br>' + t('(' + seq([T0[0], T0[3]]) + ')+(' + seq([T0[1], T0[4]]) + ')+(' + seq([T0[2], T0[5]]) + ')=' + tx(T)),
            ['Group the ' + t('x^{2}') + '-terms, the ' + t('x') + '-terms and the constants.', 'Add the coefficients in each group; the variable part stays the same.'], 'collect ' + plain(ex0)), shown);
        } },
        { id: '3b', outcome: 'AN4', level: 'BEG', make: function (r) {
          var L = r.pick([['a', 'b'], ['m', 'n'], ['x', 'y'], ['p', 'q']]), u = function (c, i) { return xm(c, 1, L[i]); };
          var v = find(function () { return { P: r.int(2, 9), Q: nz(r, 1, 8), R: nz(r, 1, 7), S: nz(r, 1, 8), T: nz(r, 1, 9) }; }, function (v) { return v.P + v.R !== 0 && v.Q + v.S !== 0 && (v.Q < 0 || v.R < 0 || v.S < 0); }, { P: 7, Q: -3, R: 2, S: 5, T: -4 });
          var T0 = [u(v.P, 0), u(v.Q, 1), u(v.R, 0), u(v.S, 1), N(v.T)], T = sumOf(T0), ex0 = seq(T0);
          var ws = [{ is: add(u(v.P + v.Q + v.R + v.S, 0), N(v.T)), code: 'u3t-unlike', hint: t(L[0]) + '-terms and ' + t(L[1]) + '-terms have different letters: they are <b>unlike</b> terms and stay separate.' },
            { is: add(u(v.P + v.R, 0), u(v.Q + v.S, 1)), code: 'missing-term', hint: 'Don’t lose the constant term, ' + t(v.T) + ': it has no like term, so it stays as it is.' },
            { is: add(u(v.P + v.R + v.T, 0), u(v.Q + v.S, 1)), code: 'u3t-unlike', hint: 'The constant ' + t(v.T) + ' is not a like term of the ' + t(L[0]) + '-terms.' }];
          return noCollect(pp(t(ex0), T, ws,
            t('(' + seq([T0[0], T0[2]]) + ')+(' + seq([T0[1], T0[3]]) + ')' + sg(v.T) + '=' + tx(T)) + '<br>The constant ' + t(v.T) + ' has no like term, so it stays.',
            ['Collect the ' + t(L[0]) + '-terms and the ' + t(L[1]) + '-terms separately.', 'Different letters are unlike terms.'], 'collect ' + plain(ex0), { vars: L }), T0);
        } },
        { id: '3c', outcome: 'AN4', level: 'BEG', make: function (r) {
          var v = find(function () { return { a1: r.int(2, 7), b1: nz(r, 1, 8), c1: nz(r, 1, 9), a2: r.int(1, 6), b2: nz(r, 1, 8), c2: nz(r, 1, 9) }; },
            function (v) { return v.b1 + v.b2 !== 0 && v.c1 + v.c2 !== 0 && (v.b2 < 0 || v.c2 < 0) && v.b1 !== v.b2; }, { a1: 2, b1: 3, c1: -5, a2: 4, b2: -1, c2: 7 });
          var P1 = [xm(v.a1, 2), xm(v.b1), N(v.c1)], P2 = [xm(v.a2, 2), xm(v.b2), N(v.c2)], A = sumOf(P1), B = sumOf(P2), T = add(A, B), vert = r.chance(0.35);
          var shown = vert ? t('\\begin{array}{r}' + seq(P1) + '\\\\ +\\ (' + seq(P2) + ')\\\\ \\hline\\end{array}') : t(br(P1) + '+' + br(P2));
          var ws = [{ is: add(xm(v.a1 + v.a2, 4), xm(v.b1 + v.b2, 2), N(v.c1 + v.c2)), code: 'u3t-add-exp', hint: 'When you add like terms the exponent stays the same: ' + t(tx(xm(v.a1, 2)) + '+' + tx(xm(v.a2, 2)) + '=' + tx(xm(v.a1 + v.a2, 2))) + '.' },
            { is: sub(A, B), code: 'minus-ignored', hint: 'This is an <b>addition</b>: the signs in the second polynomial don’t change.' }];
          return noCollect(pp((vert ? 'Add, using the vertical method:' : 'Add:') + '<br>' + shown, T, ws,
            (vert ? 'Like terms are lined up in columns; add down each column: ' : 'Adding never changes a sign, so drop the brackets and collect like terms:<br>' + t(seq(P1.concat(P2))) + '<br>') +
              t(seq([P1[0], P2[0]]) + '=' + tx(xm(v.a1 + v.a2, 2))) + ', ' + t(seq([P1[1], P2[1]]) + '=' + tx(xm(v.b1 + v.b2))) + ', ' + t(seq([P1[2], P2[2]]) + '=' + (v.c1 + v.c2)) + '.<br>Sum: ' + t(tx(T)),
            ['Add the ' + t('x^{2}') + '-terms, the ' + t('x') + '-terms and the constants separately.', 'Adding doesn’t change any signs.'], 'add ' + plain(seq(P1)) + ' and ' + plain(seq(P2))), P1.concat(P2));
        } }] },
      { num: '4', outcome: 'AN4', stem: 'Multiply or expand.', parts: [
        { id: '4a', outcome: 'AN4', level: 'BEG', make: function (r) {
          var v = find(function () { return { c1: nz(r, 2, 6), c2: r.int(2, 6), e1: r.int(1, 4), e2: r.int(2, 5), sw: r.chance(0.3) }; }, function (v) { return v.e1 * v.e2 !== v.e1 + v.e2 && v.e1 !== v.e2 && v.c1 + v.c2 !== 0 && v.c1 * v.c2 !== v.c1 + v.c2; }, { c1: -3, c2: 4, e1: 2, e2: 3, sw: false });
          if (v.sw) v.c2 = -v.c2;
          var m1 = xm(v.c1, v.e1), m2 = xm(v.c2, v.e2), T = mul(m1, m2), pr = tx(m1) + '\\times ' + pf(m2);
          return pp(t(pr), T, [{ is: xm(v.c1 * v.c2, v.e1 * v.e2), code: 'mult-exp', hint: 'When you multiply powers, <b>add</b> the exponents: ' + t('x^{' + v.e1 + '}\\times x^{' + v.e2 + '}=x^{' + (v.e1 + v.e2) + '}') + '.' },
            { is: xm(v.c1 + v.c2, v.e1 + v.e2), code: 'add-coef', hint: '<b>Multiply</b> the coefficients: ' + t(v.c1 + '\\times ' + cnum(v.c2)) + '.' }],
            'Multiply the coefficients and add the exponents:<br>' + t(pr + '=(' + v.c1 + '\\times ' + cnum(v.c2) + ')(x^{' + v.e1 + '}\\times x^{' + v.e2 + '})=' + tx(T)),
            ['Multiply the coefficients; add the exponents (the Product Law).', 'A negative times a positive is negative; a negative times a negative is positive.'], 'multiply ' + plain(pr));
        } },
        { id: '4b', outcome: 'AN4', level: 'BEG', make: function (r) {
          var c = r.int(2, 6), a = r.int(1, 5), b = nz(r, 1, 9), m = xm(c), terms = [xm(a), N(b)], T = mul(m, sumOf(terms)), pr = tx(m) + br(terms);
          return pp(t(pr), T, monoWrongs(m, terms).concat([{ is: add(xm(c * a), xm(c * b)), code: 'exponent', hint: t('x\\cdot x=x^{2}') + ': the first product has ' + t('x^{2}') + ', and ' + t(tx(m) + '\\cdot ' + cnum(b)) + ' has just one ' + t('x') + '.' }]),
            'Multiply ' + t(tx(m)) + ' by each term: ' + t(tx(m) + '\\cdot ' + pf(terms[0]) + '+' + tx(m) + '\\cdot ' + cnum(b) + '=' + tx(T)),
            ['Multiply ' + t(tx(m)) + ' by <b>each</b> term in the bracket.', t('x\\cdot x=x^{2}') + '. Signs travel with their term.'], 'expand ' + plain(pr));
        } },
        { id: '4c', outcome: 'AN4', level: 'BEG', make: function (r) {
          var kind = r.pick(['neg', 'x', 'negx']), k = r.int(2, 5), m = kind === 'neg' ? N(-k) : kind === 'x' ? xm(k) : xm(-r.int(1, 3));
          var v = find(function () { return { b: nz(r, 1, 6), c: nz(r, 1, 7) }; }, function (v) { return v.b < 0 || v.c < 0; }, { b: -2, c: 5 });
          var lead1 = kind === 'neg' && r.chance(0.4) ? r.int(2, 3) : 1, terms = [xm(lead1, 2), xm(v.b), N(v.c)], T = mul(m, sumOf(terms)), pr = tx(m) + br(terms);
          return pp(t(pr), T, monoWrongs(m, terms),
            'Multiply ' + t(tx(m)) + ' by each of the three terms:<br>' + t(terms.map(function (q, i) { var s2 = pf(m) + '\\cdot ' + pf(q); return i ? '+' + s2 : s2; }).join('') + '=' + seq(terms.map(function (q) { return mul(m, q); }))) + (PL.count(T) === 3 ? '' : '=' + t(tx(T))),
            ['A trinomial gives <b>three</b> products: multiply ' + t(tx(m)) + ' by each term.', coefOf(m) < 0 ? 'The negative changes the sign of <b>every</b> term.' : 'Add the exponents: ' + t('x\\cdot x^{2}=x^{3}') + '.'], 'expand ' + plain(pr));
        } }] },
      { num: '5', outcome: 'AN4', stem: 'Use FOIL.', parts: [
        { id: '5', outcome: 'AN4', level: 'BEG', make: function (r) {
          var v = find(function () { return { a: r.int(1, 9), b: r.int(2, 9) }; }, function (v) { return v.a !== v.b && v.a * v.b <= 45; }, { a: 3, b: 5 });
          var A = xm(1), B = N(v.a), C = xm(1), D = N(v.b), f = foil(A, B, C, D), pr = '(x+' + v.a + ')(x+' + v.b + ')';
          var rd = function (s) { var q = readT(s); return q; };
          var Fchk = function (val) { var q = rd(val); if (!q) return wrong('u3t-foil-box', 'Type the product of the First terms.'); if (PL.eq(q, f.F)) return ok(); return wrong('u3t-foil-box', 'Multiply the first terms: ' + t('x\\cdot x=x^{2}') + '.'); };
          var midChk = function (i) { return function (val, all) {
            var o = rd(all[1]), n = rd(all[2]), mine = i === 1 ? o : n;
            if (o && n && ((PL.eq(o, f.O) && PL.eq(n, f.I)) || (PL.eq(o, f.I) && PL.eq(n, f.O)))) return ok();
            if (mine && (PL.eq(mine, f.O) || PL.eq(mine, f.I)) && !(o && n && PL.eq(o, n))) return ok();
            return wrong('u3t-foil-box', (i === 1 ? 'The outside terms are ' + t('x') + ' and ' + t(v.b) + ': ' + t('x\\cdot ' + v.b + '=' + v.b + 'x') : 'The inside terms are ' + t(v.a) + ' and ' + t('x') + ': ' + t(v.a + '\\cdot x=' + v.a + 'x')) + '.');
          }; };
          var Lchk = function (val) { var q = rd(val); if (q && PL.eq(q, f.L)) return ok(); if (q && PL.eq(q, N(v.a + v.b))) return wrong('u3t-foil-box', '<b>Multiply</b> the last terms, ' + t(v.a + '\\cdot ' + v.b) + '.'); return wrong('u3t-foil-box', 'Multiply the last terms: ' + t(v.a + '\\cdot ' + v.b + '=' + v.a * v.b) + '.'); };
          var prod = polyChk(f.res, binWrongs(A, B, C, D));
          var keys = [tx(f.F), tx(f.O), tx(f.I), tx(f.L), tx(f.res)];
          var fb = function (lb) { return pbox(lb, ['x'], { wide: false, placeholder: 'one term' }); };
          return boxes('Expand ' + t(pr) + ' by filling in each FOIL product, then add them and collect like terms.',
            [fb('First:'), fb('Outside:'), fb('Inside:'), fb('Last:'), pbox('Product (simplified):', ['x'], { before: t(pr + '=') })],
            [Fchk, midChk(1), midChk(2), Lchk, function (val) { return prod(val); }], keys,
            'F ' + t(tx(f.F)) + ', O ' + t(tx(f.O)) + ', I ' + t(tx(f.I)) + ', L ' + t(tx(f.L)) + '; ' + t(pr + '=' + tx(f.res)),
            foilSol(A, B, C, D) + '<br>(The Outside and Inside products are like terms: ' + t(v.b + 'x+' + v.a + 'x=' + (v.a + v.b) + 'x') + '.)',
            ['First: ' + t('x\\cdot x') + '. Outside: the two end terms. Inside: the two middle terms. Last: the two numbers.', 'Add the four products and collect the two ' + t('x') + '-terms.'], 'FOIL ' + pr,
            [[keys[0], keys[1], keys[2], String(v.a + v.b), keys[4]], [keys[0], keys[1], keys[2], keys[3], tx(add(f.F, f.L))], ['2x', keys[1], keys[2], keys[3], keys[4]]],
            [[keys[0], keys[2], keys[1], keys[3], keys[4]], [keys[0], keys[1], keys[2], keys[3], PL.tex(f.res, { order: 'asc' })]]);
        } }] },
      { num: '6', outcome: 'AN4', stem: 'Expand using the difference of squares pattern, ' + t('(a+b)(a-b)=a^{2}-b^{2}') + '.', parts: [
        { id: '6', outcome: 'AN4', level: 'BEG', make: function (r) {
          var a = r.int(2, 12), v = r.pick(['x', 'x', 'x', 'y', 'm', 'a', 't']), first = r.chance(0.5), pr = first ? '(' + v + '+' + a + ')(' + v + '-' + a + ')' : '(' + v + '-' + a + ')(' + v + '+' + a + ')', T = add(xm(1, 2, v), N(-a * a));
          return pp(t(pr), T, [{ is: add(xm(1, 2, v), N(a * a)), code: 'sd-plus', hint: 'The last product is ' + t('(+' + a + ')(-' + a + ')') + ', which is negative.' },
            { is: add(xm(1, 2, v), xm(-2 * a, 1, v), N(-a * a)), code: 'sd-middle', hint: 'The Outside and Inside products are opposites, so they <b>cancel</b>: there is no middle term.' },
            { is: add(xm(1, 2, v), xm(2 * a, 1, v), N(a * a)), code: 'u3t-sd-square', hint: 'The brackets are not the same: one is a sum and one a difference. ' + t('(a+b)(a-b)=a^{2}-b^{2}') + '.' },
            { is: add(xm(1, 2, v), xm(-2 * a, 1, v), N(a * a)), code: 'u3t-sd-square', hint: 'The brackets are not the same: one is a sum and one a difference. ' + t('(a+b)(a-b)=a^{2}-b^{2}') + '.' }],
            'Difference of squares, ' + t('(a+b)(a-b)=a^{2}-b^{2}') + ':<br>' + t(pr + '=' + seq([xm(1, 2, v), xm(first ? -a : a, 1, v), xm(first ? a : -a, 1, v), N(-a * a)]) + '=' + tx(T)) + ' (the middle terms cancel).',
            ['Square the first term, square the second term, subtract.', 'The Outside and Inside products cancel: there is no middle term.'], 'expand ' + pr, { vars: [v] });
        } }] },
      { num: '7', outcome: 'AN4', stem: 'Look at each product before you expand it. (You do not need to expand.)', parts: [
        { id: '7', outcome: 'AN4', level: 'BEG', make: function (r) {
          var used = {}, items = [];
          var mk = function (kind) {
            for (var g = 0; g < 200; g++) {
              var a = r.int(2, 9), b = r.int(1, 9), p = r.pick([1, 1, 1, 2, 3]), v = 'x', X = (p === 1 ? '' : p) + v, s, why;
              if (kind === 'dos') { var st = r.pick(['xa', 'ax', 'pxa']); if (st === 'ax') { s = r.chance(0.5) ? '(' + a + '-x)(' + a + '+x)' : '(' + a + '+x)(' + a + '-x)'; } else s = r.chance(0.5) ? '(' + X + '+' + a + ')(' + X + '-' + a + ')' : '(' + X + '-' + a + ')(' + X + '+' + a + ')'; why = 'the same two terms, once added and once subtracted: ' + t('a^{2}-b^{2}'); }
              else if (kind === 'ps') { var sgn = r.pick(['+', '-']); s = r.chance(0.75) ? '(' + X + sgn + a + ')^{2}' : '(' + X + sgn + a + ')(' + X + sgn + a + ')'; why = 'the same binomial times itself: ' + t('a^{2}' + (sgn === '+' ? '+' : '-') + '2ab+b^{2}'); }
              else { if (a === b) continue; var s1 = r.pick(['+', '-']), s2 = r.pick(['+', '-']); if (s1 === s2 && r.chance(0.6)) s2 = s1 === '+' ? '-' : '+'; s = '(' + X + s1 + a + ')(' + X + s2 + b + ')'; why = 'the brackets have different numbers (' + t(a) + ' and ' + t(b) + '), so no shortcut: just FOIL'; }
              if (!used[s]) { used[s] = 1; return { s: s, kind: kind, why: why }; }
            }
            return null;
          };
          ['dos', 'ps', 'foil', r.pick(['dos', 'ps', 'foil'])].forEach(function (k) { var it = mk(k); if (it) items.push(it); });
          items = r.shuffle(items);
          var rows = items.map(function (it, i) { return { id: 'abcd'[i], html: t(it.s), label: 'abcd'[i] }; }), want = {}, by = {};
          items.forEach(function (it, i) { want['abcd'[i]] = it.kind; by['abcd'[i]] = it; });
          var cols = [{ id: 'dos', html: 'Difference of squares', label: 'dos' }, { id: 'ps', html: 'Perfect square', label: 'ps' }, { id: 'foil', html: 'Neither (just FOIL)', label: 'foil' }];
          var NAME = { dos: 'difference of squares', ps: 'perfect square', foil: 'neither' };
          var g = KP.grid('Which pattern applies to each product?', rows, cols, want, { why: function (id) { return { code: 'u3t-pat-row', hint: 'Look again at ' + t(by[id].s) + ': is it the <b>same</b> binomial twice, the same two terms with ' + t('+') + ' and ' + t('-') + ', or neither?' }; }, rowHead: 'Product' },
            items.map(function (it) { return t(it.s) + ': <b>' + NAME[it.kind] + '</b> — ' + it.why + '.'; }).join('<br>'),
            ['Same binomial twice → perfect square. Same two terms, one ' + t('+') + ' and one ' + t('-') + ' → difference of squares.', 'Anything else → neither: just FOIL.'], 'which pattern');
          var base = g.check;
          g.check = function (resp) { var res = base(resp); if (res.v !== 'wrong') return res; resp = resp || {}; var nBad = Object.keys(want).filter(function (k) { return resp[k] !== want[k]; }).length; return nBad > 1 ? wrong('u3t-pat-rows', res.hint) : res; };
          var one = {}, all = {}; Object.keys(want).forEach(function (k) { one[k] = want[k]; all[k] = 'foil'; }); var k0 = Object.keys(want).filter(function (k) { return want[k] !== 'foil'; })[0]; one[k0] = 'foil';
          g.bad = [one, all];
          return g;
        } }] },

      /* ======================= Progressing ======================= */
      { num: '8', outcome: 'AN4', stem: 'Subtracting a polynomial means subtracting <b>every</b> one of its terms.', parts: [
        { id: '8', outcome: 'AN4', level: 'PRG', make: function (r) {
          var v = find(function () { return { a1: r.int(3, 9), b1: nz(r, 1, 8), c1: nz(r, 1, 9), a2: r.int(1, 6), b2: nz(r, 1, 8), c2: nz(r, 1, 9) }; },
            function (v) { return v.a1 !== v.a2 && v.b1 !== v.b2 && v.c1 !== v.c2 && (v.b2 < 0 || v.c2 < 0) && v.b1 + v.b2 !== 0; }, { a1: 6, b1: -2, c1: 5, a2: 2, b2: -4, c2: -3 });
          var P1 = [xm(v.a1, 2), xm(v.b1), N(v.c1)], P2 = [xm(v.a2, 2), xm(v.b2), N(v.c2)], A = sumOf(P1), B = sumOf(P2), T = sub(A, B), vert = r.chance(0.3);
          var shown = vert ? t('\\begin{array}{r}' + seq(P1) + '\\\\ -\\ (' + seq(P2) + ')\\\\ \\hline\\end{array}') : t(br(P1) + '-' + br(P2));
          var ws = [{ is: subFirstOnly(A, B), code: 'sub-first', hint: 'Subtract <b>every</b> term of the second polynomial: change the sign of all three terms, not just the first.' },
            { is: add(A, B), code: 'minus-ignored', hint: 'This is a <b>subtraction</b>: add the opposite of every term of the second polynomial.' }];
          return pp((vert ? 'Subtract, using the vertical method:' : 'Subtract:') + '<br>' + shown, T, ws,
            'Subtracting means adding the opposite of <b>every</b> term: ' + t('-' + br(P2) + '=' + seq(P2.map(neg))) + '.<br>' + t(seq(P1.concat(P2.map(neg)))) + '<br>' + t('=' + tx(T)),
            ['Change the sign of <b>every</b> term in the second polynomial, then add.', 'Collect the ' + t('x^{2}') + '-terms, the ' + t('x') + '-terms and the constants.'], 'subtract ' + plain(seq(P1)) + ' − (' + plain(seq(P2)) + ')');
        } }] },
      { num: '9', outcome: 'AN4', stem: 'Expand and simplify.', parts: [
        { id: '9a', outcome: 'AN4', level: 'PRG', make: function (r) {
          var v = find(function () { return { c1: nz(r, 1, 5), a: nz(r, 1, 8), c2: r.int(2, 5), b: nz(r, 1, 8) }; }, function (v) { return v.c1 * v.a - v.c2 !== 0 && v.c1 * v.a + v.c2 !== 0 && v.c2 * v.b !== 0 && (v.c1 < 0 || v.b < 0 || v.a < 0); }, { c1: -2, a: -4, c2: 3, b: 2 });
          var m1 = xm(v.c1), t1 = [xm(1), N(v.a)], t2 = [xm(1), N(v.b)], P1 = mul(m1, sumOf(t1)), P2 = mul(N(v.c2), sumOf(t2)), T = sub(P1, P2), ex1 = tx(m1) + br(t1) + '-' + v.c2 + br(t2);
          var ws = [{ is: subFirstOnly(P1, P2), code: 'sub-first', hint: 'The ' + t('-' + v.c2) + ' multiplies <b>both</b> terms of ' + t(br(t2)) + ', so both signs change.' },
            { is: add(P1, P2), code: 'minus-ignored', hint: 'The second product is <b>subtracted</b>: multiply by ' + t('-' + v.c2) + ', not ' + t('+' + v.c2) + '.' },
            { is: sub(P1, add(xm(v.c2), N(v.b))), code: 'first-only', hint: 'Multiply <b>both</b> terms of ' + t(br(t2)) + ' by ' + t('-' + v.c2) + '.' },
            { is: sub(add(mul(m1, xm(1)), N(v.a)), P2), code: 'first-only', hint: 'Multiply <b>both</b> terms of ' + t(br(t1)) + ' by ' + t(tx(m1)) + '.' }];
          return pp(t(ex1), T, ws,
            'One bracket at a time:<br>' + t(tx(m1) + br(t1) + '=' + tx(P1)) + '<br>' + t('-' + v.c2 + br(t2) + '=' + tx(neg(P2))) + '<br>Then collect: ' + t(seq(termsOf(P1).concat(termsOf(neg(P2)))) + '=' + tx(T)),
            ['Expand each product first. The ' + t('-' + v.c2) + ' changes the sign of every term in its bracket.', 'Then collect the like terms.'], 'expand ' + plain(ex1));
        } },
        { id: '9b', outcome: 'AN4', level: 'PRG', make: function (r) {
          var v = find(function () { return { c1: nz(r, 1, 5), a1: r.int(1, 3), b1: nz(r, 1, 6), c2: r.int(1, 5), a2: r.int(1, 3), b2: nz(r, 1, 6) }; },
            function (v) { return v.c1 * v.a1 - v.c2 * v.a2 !== 0 && v.c1 * v.b1 - v.c2 * v.b2 !== 0 && v.c1 * v.b1 + v.c2 * v.b2 !== 0 && (v.a1 > 1 || v.a2 > 1); }, { c1: 4, a1: 2, b1: -1, c2: 3, a2: 1, b2: -2 });
          var m1 = xm(v.c1), m2 = xm(v.c2), t1 = [xm(v.a1), N(v.b1)], t2 = [xm(v.a2), N(v.b2)], P1 = mul(m1, sumOf(t1)), P2 = mul(m2, sumOf(t2)), T = sub(P1, P2), ex1 = tx(m1) + br(t1) + '-' + tx(m2) + br(t2);
          var ws = [{ is: subFirstOnly(P1, P2), code: 'sub-first', hint: 'The ' + t('-' + tx(m2)) + ' multiplies <b>both</b> terms of ' + t(br(t2)) + ', so both signs change.' },
            { is: add(P1, P2), code: 'minus-ignored', hint: 'The second product is <b>subtracted</b>.' },
            { is: sub(P1, add(mul(m2, t2[0]), N(v.c2 * v.b2))), code: 'var-first', hint: 'The ' + t('x') + ' in ' + t(tx(m2)) + ' multiplies the constant term too.' },
            { is: sub(add(mul(m1, t1[0]), N(v.c1 * v.b1)), P2), code: 'var-first', hint: 'The ' + t('x') + ' in ' + t(tx(m1)) + ' multiplies the constant term too.' }];
          return pp(t(ex1), T, ws,
            t(tx(m1) + br(t1) + '=' + tx(P1)) + '<br>' + t('-' + tx(m2) + br(t2) + '=' + tx(neg(P2))) + '<br>' + t(seq(termsOf(P1).concat(termsOf(neg(P2)))) + '=' + tx(T)),
            ['Expand each product, one bracket at a time. A negative multiplier changes every sign it reaches.', 'Collect the ' + t('x^{2}') + '-terms and the ' + t('x') + '-terms.'], 'expand ' + plain(ex1));
        } }] },
      { num: '10', outcome: 'AN4', stem: 'Expand and simplify.', parts: [
        { id: '10a', outcome: 'AN4', level: 'PRG', make: function (r) {
          var v = find(function () { return { a: nz(r, 1, 9), b: nz(r, 1, 9) }; }, function (v) { return v.a !== v.b && v.a + v.b !== 0 && (v.a < 0 || v.b < 0); }, { a: -3, b: 7 });
          var A = xm(1), B = N(v.a), C = xm(1), D = N(v.b), f = foil(A, B, C, D), pr = br([A, B]) + br([C, D]);
          return pp(t(pr), f.res, binWrongs(A, B, C, D), foilSol(A, B, C, D), HB, 'expand ' + pr);
        } },
        { id: '10b', outcome: 'AN4', level: 'PRG', make: function (r) {
          var v = find(function () { return { p: r.int(2, 5), q: nz(r, 1, 6), rr: r.int(1, 3), s: nz(r, 1, 6) }; }, function (v) { return v.p * v.s + v.q * v.rr !== 0 && !(v.p === v.rr && v.q === v.s) && (v.q < 0 || v.s < 0) && Math.abs(v.q * v.s) <= 30 && v.p * v.rr <= 12; }, { p: 3, q: -2, rr: 1, s: -4 });
          var A = xm(v.p), B = N(v.q), C = xm(v.rr), D = N(v.s), f = foil(A, B, C, D), pr = br([A, B]) + br([C, D]);
          return pp(t(pr), f.res, binWrongs(A, B, C, D), foilSol(A, B, C, D), HB, 'expand ' + pr);
        } }] },
      { num: '11', outcome: 'AN4', stem: 'Expand using the perfect square pattern, ' + t('(a\\pm b)^{2}=a^{2}\\pm 2ab+b^{2}') + '.', parts: [
        { id: '11a', outcome: 'AN4', level: 'PRG', make: function (r) {
          var a = r.int(2, 12), s = r.pick([1, -1, -1]), v = r.pick(['x', 'x', 'x', 'y', 'm', 'a']), A = xm(1, 1, v), B = N(s * a), T = mul(add(A, B), add(A, B)), pr = '(' + v + sg(s * a) + ')^{2}';
          return pp(t(pr), T, sqWrongs(A, B), sqSol(A, B), ['Square the first term, double the product of the two terms, square the last term.', 'The last term is a square, so it is positive.'], 'expand ' + pr, { vars: [v] });
        } },
        { id: '11b', outcome: 'AN4', level: 'PRG', make: function (r) {
          var v = find(function () { return { p: r.int(2, 5), q: r.int(1, 7), s: r.pick([1, -1]) }; }, function (v) { return HW.ex.gcd(v.p, v.q) === 1 && v.p * v.q <= 21; }, { p: 2, q: 3, s: -1 });
          var A = xm(v.p), B = N(v.s * v.q), T = mul(add(A, B), add(A, B)), pr = '(' + tx(add(A, B)) + ')^{2}';
          return pp(t(pr), T, sqWrongs(A, B), sqSol(A, B), ['Square the <b>whole</b> first term, coefficient and all: ' + t('(' + tx(A) + ')^{2}=' + tx(mul(A, A))) + '.', 'The middle term is ' + t('2ab') + '.'], 'expand ' + pr);
        } }] },
      { num: '12', outcome: 'AN4', shared: q12Shared,
        stem: function (s) { return 'Multiply ' + t(bp(lin(1, s.a)) + bp(add(xm(1, 2), xm(s.b), N(s.c)))) + ' using a grid: the binomial’s terms label the rows and the trinomial’s terms label the columns.'; },
        parts: [
          { id: '12a', outcome: 'AN4', level: 'PRG', make: function (r, s) {
            return boxPart('Fill in all six cells of the grid.', [xm(1, 2), xm(s.b), N(s.c)], [xm(1), N(s.a)], { text: 'grid (x' + sg(s.a) + ')(x^2' + sg(s.b) + 'x' + sg(s.c) + ')' });
          } },
          { id: '12b', outcome: 'AN4', level: 'PRG', make: function (r, s) {
            var A = lin(1, s.a), Q = add(xm(1, 2), xm(s.b), N(s.c)), T = mul(A, Q), pr = bp(A) + bp(Q), xp = mul(xm(1), Q), ap = mul(N(s.a), Q);
            return pp('Add the six cells and collect like terms: write ' + t(pr) + ' in simplified form.', T, [{ is: add(xp, N(s.a)), code: 'first-only', hint: 'Both terms of ' + t(bp(A)) + ' multiply every term of the trinomial: the bottom row of the grid is ' + t(tx(ap)) + '.' },
              { is: add(xm(1, 3), N(s.a * s.c)), code: 'fl-only', hint: 'Add <b>all six</b> cells of the grid, then collect like terms.' }, { is: sub(xp, ap), code: 'sign', hint: 'Check the signs of the bottom row: ' + t(s.a) + ' times each term.' }],
              gridSol([xm(1, 2), xm(s.b), N(s.c)], [xm(1), N(s.a)]) + t(seq(termsOf(xp).concat(termsOf(ap))) + '=' + tx(T)) + '<br>(' + t('x^{2}') + ': ' + t(seq([xm(s.b, 2), xm(s.a, 2)]) + '=' + tx(xm(s.a + s.b, 2))) + '; ' + t('x') + ': ' + t(seq([xm(s.c), xm(s.a * s.b)]) + '=' + tx(xm(s.c + s.a * s.b))) + ')',
              ['Add the six cells.', 'There is one ' + t('x^{3}') + '-term, two ' + t('x^{2}') + '-terms, two ' + t('x') + '-terms and one constant: collect two pairs.'], 'expand ' + pr, { before: t(pr + '=') });
          } }] },
      { num: '13', outcome: 'AN4', stem: 'Expand and simplify.', parts: [
        { id: '13', outcome: 'AN4', level: 'PRG', make: function (r) {
          var v = find(function () { return { p: r.int(2, 3), q: nz(r, 1, 5), b: nz(r, 1, 5), c: nz(r, 1, 5) }; }, function (v) { return v.p * v.b + v.q !== 0 && v.p * v.c + v.q * v.b !== 0 && (v.q < 0 || v.b < 0 || v.c < 0) && Math.abs(v.c) !== 1; }, { p: 2, q: -1, b: 3, c: -4 });
          var A = lin(v.p, v.q), Q = add(xm(1, 2), xm(v.b), N(v.c)), T = mul(A, Q), pr = bp(A) + bp(Q), xp = mul(xm(v.p), Q), qp = mul(N(v.q), Q);
          return pp(t(pr), T, [{ is: add(xp, N(v.q)), code: 'first-only', hint: 'Multiply ' + t(v.q) + ' by every term of the trinomial too.' }, { is: add(xp, neg(qp)), code: 'sign', hint: 'Check the signs of the products with ' + t(v.q) + '.' },
            { is: add(mul(xm(v.p), xm(1, 2)), mul(N(v.q), N(v.c))), code: 'fl-only', hint: 'Every term of the binomial multiplies every term of the trinomial: six products.' }],
            'Six partial products:<br>' + t(pr + '=' + seq(termsOf(xp).concat(termsOf(qp)))) + '<br>' + t('=' + tx(T)), ['Multiply each term of the binomial by each term of the trinomial: six products.', 'Check the sign of each product on its own, then collect like terms.'], 'expand ' + pr);
        } }] },
      { num: '14', outcome: 'AN4', shared: q14Shared,
        stem: function (s) { var W = lin(1, s.a), H = lin(1, s.b); return 'A rectangular ' + s.u[0] + ' is ' + t(bp(W)) + ' ' + s.u[1] + ' long and ' + t(bp(H)) + ' ' + s.u[1] + ' wide.' + rectSvg(W, H, s.u[1]); },
        parts: [
          { id: '14a', outcome: 'AN4', level: 'PRG', make: function (r, s) {
            var W = lin(1, s.a), H = lin(1, s.b), f = foil(xm(1), N(s.a), xm(1), N(s.b)), u = s.u[1];
            return pp('Write the area of the ' + s.u[0] + ' as a simplified trinomial.', f.res, binWrongs(xm(1), N(s.a), xm(1), N(s.b)).concat([{ is: PL.scale(add(W, H), 2), code: 'perimeter', hint: 'That is the perimeter. The area is length × width.' }, { is: add(W, H), code: 'perimeter', hint: 'That is length + width. The area is length × width.' }]),
              t('A=' + bp(W) + bp(H) + '=' + seq([f.F, f.O, f.I, f.L]) + '=' + tx(f.res)) + ' ' + u + t('^{2}'), ['Area = length × width.', 'Four products (FOIL), then collect the ' + t('x') + '-terms.'], 'rectangle area ' + plain(tx(W)) + ' by ' + plain(tx(H)), { before: t('A='), after: t('\\text{' + u + '}^{2}') });
          } },
          { id: '14b', outcome: 'AN4', level: 'PRG', make: function (r, s) {
            var L = s.n + s.a, Wd = s.n + s.b, A = L * Wd, u = s.u[1], f = foil(xm(1), N(s.a), xm(1), N(s.b));
            var p = KP.number('Find the area of the ' + s.u[0] + ' when ' + t('x=' + s.n) + '.', A, function (v) {
              if (v === 2 * (L + Wd) || v === L + Wd) return { code: 'u3t-area-perim', hint: 'That adds the sides. The area is length × width: ' + t(L + '\\times ' + Wd) + '.' };
              if (v === s.n * s.n + s.a * s.b) return { code: 'fl-only', hint: 'Your trinomial is missing its middle term. Check it by multiplying the side lengths at ' + t('x=' + s.n) + '.' };
              return null;
            }, 'At ' + t('x=' + s.n) + ': length ' + t(s.n + sg(s.a) + '=' + L) + ' ' + u + ', width ' + t(s.n + sg(s.b) + '=' + Wd) + ' ' + u + '.<br>Area ' + t('=' + L + '\\times ' + Wd + '=' + A) + ' ' + u + t('^{2}') + '.<br>(Or substitute into the trinomial: ' + t(tx(f.res).replace(/x/g, '(' + s.n + ')') + '=' + A) + '.)',
              ['Substitute ' + t('x=' + s.n) + ' into each side, then multiply.', 'Or substitute into your trinomial from part (a).'], 'area at x=' + s.n, { after: t('\\text{' + u + '}^{2}') });
            p.bad = [2 * (L + Wd), L + Wd].filter(function (x) { return x !== A; }).map(String);
            return p;
          } }] },
      { num: '15', outcome: 'AN4', stem: 'Write the shaded area as a simplified polynomial.', parts: [
        { id: '15', outcome: 'AN4', level: 'PRG', make: function (r) {
          var v = find(function () { return { a: r.int(3, 10), b: r.int(3, 9), c: r.int(1, 5) }; }, function (v) { return v.a !== v.b && v.c < Math.min(v.a, v.b) && v.a * v.b <= 70; }, { a: 8, b: 5, c: 2 });
          var ctx = r.pick([{ big: 'A rectangular lawn', hole: 'a square flower bed', what: 'the area of grass (shaded)', u: 'm' }, { big: 'A rectangular yard', hole: 'a square shed', what: 'the area of the yard left (shaded)', u: 'm' }, { big: 'A rectangular poster', hole: 'a square photo', what: 'the area of the poster still showing (shaded)', u: 'cm' }, { big: 'A rectangular floor', hole: 'a square rug', what: 'the area of floor not covered (shaded)', u: 'ft' }]);
          var Wd = lin(1, v.a), Hd = lin(1, v.b), S = lin(1, v.c), Big = mul(Wd, Hd), Sq = mul(S, S), T = sub(Big, Sq);
          var ws = [{ is: add(Big, Sq), code: 'not-subtracted', hint: 'The square is <b>removed</b>: subtract its area.' }, { is: Big, code: 'whole-only', hint: 'That is the whole rectangle. Subtract the square’s area.' },
            { is: subFirstOnly(Big, Sq), code: 'minus-first', hint: 'Subtract <b>every</b> term of ' + t(tx(Sq)) + ' — put it in brackets first.' }, { is: sub(Big, sqNoMid(S)), code: 'no-middle', hint: t('(' + tx(S) + ')^{2}') + ' has a middle term: ' + t(tx(Sq)) + '.' },
            { is: sub(Big, add(xm(1, 2), N(v.c * v.c))), code: 'no-middle', hint: t('(' + tx(S) + ')^{2}') + ' has a middle term: ' + t(tx(Sq)) + '.' }];
          return pp(ctx.big + ' measures ' + t(bp(Wd)) + ' ' + ctx.u + ' by ' + t(bp(Hd)) + ' ' + ctx.u + '. ' + ctx.hole.charAt(0).toUpperCase() + ctx.hole.slice(1) + ' with side ' + t(bp(S)) + ' ' + ctx.u + ' takes up one corner. Write ' + ctx.what + ' as a simplified polynomial.' + cornerSvg(Wd, Hd, S, ctx.u).replace('>bed<', '>' + ctx.hole.split(' ').pop() + '<'), T, ws,
            'Whole rectangle: ' + t(bp(Wd) + bp(Hd) + '=' + tx(Big)) + '<br>Square: ' + t('(' + tx(S) + ')^{2}=' + tx(Sq)) + '<br>Shaded ' + t('=' + tx(Big) + '-(' + tx(Sq) + ')=' + seq(termsOf(Big).concat(termsOf(neg(Sq)))) + '=' + tx(T)) + ' ' + ctx.u + t('^{2}') + '<br>(The ' + t('x^{2}') + '-terms cancel.)',
            ['Shaded area = whole rectangle − square.', 'Put the square’s area in brackets before you subtract it.'], 'shaded ' + plain(tx(Wd)) + ' by ' + plain(tx(Hd)) + ' minus (' + plain(tx(S)) + ')^2', { after: t('\\text{' + ctx.u + '}^{2}') });
        } }] },

      /* ======================= Mastery ======================= */
      { num: '16', outcome: 'AN4', stem: 'Expand and simplify.', parts: [
        { id: '16a', outcome: 'AN4', level: 'MAS', make: function (r) {
          var v = find(function () { return { k: r.int(2, 3), a: nz(r, 1, 5), b: nz(r, 1, 5), c: nz(r, 1, 5) }; }, function (v) {
            if (v.a === v.b || v.a + v.b === 0) return false; var x1 = v.k * (v.a + v.b) - 2 * v.c, c0 = v.k * v.a * v.b - v.c * v.c; return x1 !== 0 && c0 !== 0 && (v.a < 0 || v.b < 0 || v.c < 0); }, { k: 2, a: 3, b: -1, c: -2 });
          var F1 = lin(1, v.a), F2 = lin(1, v.b), S = lin(1, v.c), P = mul(F1, F2), KP0 = PL.scale(P, v.k), S2 = mul(S, S), T = sub(KP0, S2), pr = v.k + bp(F1) + bp(F2) + '-(' + tx(S) + ')^{2}';
          var ws = [{ is: sub(KP0, sqNoMid(S)), code: 'no-middle', hint: t('(' + tx(S) + ')^{2}') + ' has a middle term: ' + t('(' + tx(S) + ')^{2}=' + tx(S2)) + '.' },
            { is: subFirstOnly(KP0, S2), code: 'minus-first', hint: 'The minus sign in front of ' + t('(' + tx(S) + ')^{2}') + ' changes the sign of <b>every</b> term of ' + t(tx(S2)) + '.' },
            { is: sub(add(PL.scale(lead(P), v.k), sub(P, lead(P))), S2), code: 'k-first', hint: 'Multiply <b>every</b> term of ' + t(tx(P)) + ' by ' + t(v.k) + '.' },
            { is: add(KP0, S2), code: 'minus-ignored', hint: 'The square is <b>subtracted</b>.' },
            { is: sub(P, S2), code: 'k-forgot', hint: 'Don’t forget the ' + t(v.k) + ' in front of the first product.' },
            { is: sub(PL.scale(add(xm(1, 2), N(v.a * v.b)), v.k), S2), code: 'fl-only', hint: t(bp(F1) + bp(F2)) + ' needs all four products: First, Outside, Inside, Last.' }];
          return pp(t(pr), T, ws,
            'Expand each product first:<br>' + t(v.k + bp(F1) + bp(F2) + '=' + v.k + bp(P) + '=' + tx(KP0)) + '<br>' + t('(' + tx(S) + ')^{2}=' + tx(S2)) + '<br>Then subtract every term of the square:<br>' + t(tx(KP0) + '-(' + tx(S2) + ')=' + seq(termsOf(KP0).concat(termsOf(neg(S2)))) + '=' + tx(T)),
            ['Expand ' + t(bp(F1) + bp(F2)) + ' and multiply it by ' + t(v.k) + '; expand the square separately.', 'Put the square in brackets and subtract every term, then collect like terms.'], 'expand ' + plain(pr));
        } },
        { id: '16b', outcome: 'AN4', level: 'MAS', make: function (r) {
          var v = find(function () { return { a: nz(r, 1, 4), b: nz(r, 1, 4), c: nz(r, 1, 6), d: nz(r, 1, 6), e: nz(r, 1, 9), plus: false }; }, function (v) {
            var s = v.plus ? 1 : -1, x2 = v.a + v.b + s, x1 = v.a * v.b + v.c + s * v.d, x0 = v.a * v.c + s * v.e; return x2 !== 0 && x1 !== 0 && x0 !== 0 && Math.abs(v.c) !== 1 && (v.a < 0 || v.b < 0 || v.c < 0); }, { a: 4, b: -2, c: 3, d: 5, e: -6, plus: false });
          var A = lin(1, v.a), Q = add(xm(1, 2), xm(v.b), N(v.c)), R = add(xm(1, 2), xm(v.d), N(v.e)), P = mul(A, Q), T = v.plus ? add(P, R) : sub(P, R), pr = bp(A) + bp(Q) + (v.plus ? '+' : '-') + bp(R);
          var ws = v.plus ? [{ is: add(add(mul(xm(1), Q), N(v.a)), R), code: 'first-only', hint: 'Multiply ' + t(v.a) + ' by every term of ' + t(bp(Q)) + ' too.' }, { is: sub(P, R), code: 'sign', hint: 'The trinomial is <b>added</b>: its signs don’t change.' }, { is: add(add(xm(1, 3), N(v.a * v.c)), R), code: 'fl-only', hint: 'Every term of ' + t(bp(A)) + ' multiplies every term of ' + t(bp(Q)) + ': six products.' }]
            : [{ is: subFirstOnly(P, R), code: 'sub-first', hint: 'The minus sign changes the sign of <b>every</b> term of ' + t(bp(R)) + '.' }, { is: add(P, R), code: 'minus-ignored', hint: 'The trinomial is <b>subtracted</b>: change the sign of every one of its terms.' },
              { is: sub(add(mul(xm(1), Q), N(v.a)), R), code: 'first-only', hint: 'Multiply ' + t(v.a) + ' by every term of ' + t(bp(Q)) + ' too.' }, { is: sub(add(xm(1, 3), N(v.a * v.c)), R), code: 'fl-only', hint: 'Every term of ' + t(bp(A)) + ' multiplies every term of ' + t(bp(Q)) + ': six products.' }];
          return pp(t(pr), T, ws,
            'Expand the product completely first (six partial products):<br>' + t(bp(A) + bp(Q) + '=' + distTex(A, Q)) + '<br>Then ' + (v.plus ? 'add' : 'subtract') + ' the trinomial' + (v.plus ? '' : ' (change every sign)') + ':<br>' + t(tx(P) + (v.plus ? '+' : '-') + bp(R) + '=' + seq(termsOf(P).concat(termsOf(v.plus ? R : neg(R)))) + '=' + tx(T)),
            ['Expand and simplify the binomial × trinomial first: six products.', v.plus ? 'Then add the trinomial and collect like terms.' : 'Then subtract: the minus sign changes the sign of <b>every</b> term in the last bracket.'], 'expand ' + plain(pr));
        } }] },
      { num: '17', outcome: 'AN4', shared: q17Shared,
        stem: function (s) {
          var c = s.ctx, L = lin(1, s.a), Wd = lin(1, s.b), H = s.sq ? xm(1) : lin(1, s.h);
          return 'A ' + c.w + ' is a rectangular prism. Its base is ' + t(bp(L)) + ' ' + c.u + ' long and ' + t(bp(Wd)) + ' ' + c.u + ' wide' + (s.sq ? ' (a square)' : '') + ', and its height is ' + t(s.sq ? 'x' : bp(H)) + ' ' + c.u + '. A ' + c.lid + ' is made ' + t('2') + ' ' + c.u + ' longer and ' + t('2') + ' ' + c.u + ' wider than the base, so it overhangs.' + prismSvg(L, H, Wd, c.u);
        },
        parts: [
          { id: '17a', outcome: 'AN4', level: 'MAS', make: function (r, s) {
            var c = s.ctx, L = lin(1, s.a), Wd = lin(1, s.b), H = s.sq ? xm(1) : lin(1, s.h), Bs = mul(L, Wd), V = mul(Bs, H);
            var ws = [{ is: Bs, code: 'u3t-two-edges', hint: 'That is the area of the base. The volume uses <b>all three</b> edges: multiply by the height, ' + t(tx(H)) + ', too.' },
              { is: mul(add(xm(1, 2), N(s.a * s.b)), H), code: 'fl-only', hint: t(bp(L) + bp(Wd)) + ' has a middle term: ' + t(tx(xm(s.a + s.b))) + '.' },
              { is: add(mul(lead(Bs), H), sub(Bs, lead(Bs))), code: 'first-only', hint: 'Multiply <b>every</b> term of the base area ' + t(tx(Bs)) + ' by the height.' },
              { is: add(L, Wd, H), code: 'u3t-two-edges', hint: 'Volume is length × width × height — multiply, don’t add.' }];
            return pp('Write the volume of the ' + c.w + ' as a simplified polynomial.', V, ws,
              'Multiply two edges first (the base), then the third:<br>' + t(bp(L) + bp(Wd) + '=' + tx(Bs)) + '<br>' + t('V=' + bp(Bs) + (s.sq ? 'x' : bp(H)) + '=' + distTex(Bs, H)) + ' ' + c.u + t('^{3}'),
              ['Volume = length × width × height. Multiply the base’s two sides first.', 'Then multiply that trinomial by the height' + (s.sq ? '' : ': six products') + '.'], 'volume ' + plain(tx(L)) + ' by ' + plain(tx(Wd)) + ' by ' + plain(tx(H)), { before: t('V='), after: t('\\text{' + c.u + '}^{3}') });
          } },
          { id: '17b', outcome: 'AN4', level: 'MAS', make: function (r, s) {
            var c = s.ctx, L = lin(1, s.a), Wd = lin(1, s.b), L2 = lin(1, s.a + 2), W2 = lin(1, s.b + 2), A = mul(L2, W2), Bs = mul(L, Wd);
            var ws = [{ is: Bs, code: 'u3t-lid-same', hint: 'That is the area of the base. The lid is ' + t('2') + ' ' + c.u + ' longer <b>and</b> ' + t('2') + ' ' + c.u + ' wider: its sides are ' + t(bp(L2)) + ' and ' + t(bp(W2)) + '.' },
              { is: mul(L2, Wd), code: 'u3t-lid-one', hint: 'The lid is ' + t('2') + ' ' + c.u + ' wider as well as ' + t('2') + ' ' + c.u + ' longer.' }, { is: mul(L, W2), code: 'u3t-lid-one', hint: 'The lid is ' + t('2') + ' ' + c.u + ' longer as well as ' + t('2') + ' ' + c.u + ' wider.' },
              { is: add(Bs, N(4)), code: 'u3t-lid-same', hint: 'Add ' + t('2') + ' to each <b>side</b> first, then multiply the new sides.' },
              { is: add(xm(1, 2), N((s.a + 2) * (s.b + 2))), code: 'fl-only', hint: t(bp(L2) + bp(W2)) + ' has a middle term.' }];
            return pp('Write the area of the ' + c.lid + ' as a simplified trinomial.', A, ws,
              'The lid’s sides are ' + t(bp(L) + '+2=' + tx(L2)) + ' and ' + t(bp(Wd) + '+2=' + tx(W2)) + '.<br>' + t('A=' + bp(L2) + bp(W2) + '=' + seq(prods(L2, W2)) + '=' + tx(A)) + ' ' + c.u + t('^{2}'),
              ['Change each side first: add ' + t('2') + ' to the length and ' + t('2') + ' to the width.', 'Then multiply the two new sides.'], 'lid area', { before: t('A='), after: t('\\text{' + c.u + '}^{2}') });
          } }] },
      { num: '18', outcome: 'AN4', shared: q18Shared,
        stem: function (s) {
          var c = s.ctx, A1 = lin(1, s.a), A2 = lin(1, s.b), B1 = lin(1, s.c), B2 = lin(1, s.d);
          return 'Two ' + c.w + ' have exactly the same area. ' + c.one + ' A ' + (s.sq ? 'is a square with side ' + t(bp(A1)) + ' ' + c.u : 'measures ' + t(bp(A1)) + ' ' + c.u + ' by ' + t(bp(A2)) + ' ' + c.u) + '; ' + c.one + ' B measures ' + t(bp(B1)) + ' ' + c.u + ' by ' + t(bp(B2)) + ' ' + c.u + '.' + twoRectSvg(A2, A1, B2, B1, c.u);
        },
        parts: [
          { id: '18a', outcome: 'AN4', level: 'MAS', make: function (r, s) {
            var c = s.ctx, A1 = lin(1, s.a), A2 = lin(1, s.b), B1 = lin(1, s.c), B2 = lin(1, s.d), PA = mul(A1, A2), PB = mul(B1, B2), x = s.x, den = s.a + s.b - s.c - s.d, num = s.c * s.d - s.a * s.b;
            var xAlts = altVals(x, [{ v: -x, code: 'u3t-solve-sign', hint: 'Check the signs as you move the terms across: ' + t(tx(xm(s.a + s.b)) + sg(s.a * s.b) + '=' + tx(xm(s.c + s.d)) + sg(s.c * s.d)) + '.' }, Math.abs(den) !== 1 ? { v: num, code: 'u3t-solve-div', hint: 'Finish solving: divide both sides by the coefficient of ' + t('x') + '.' } : null, Math.abs(den) !== 1 ? { v: -num, code: 'u3t-solve-div', hint: 'Finish solving: divide both sides by the coefficient of ' + t('x') + '.' } : null]);
            var eqL = tx(PA) + '=' + tx(PB), lin1 = seq([xm(den), N(-num)]) + '=0';
            var p = KP.fields('Write each area as a simplified trinomial, then set them equal and solve for ' + t('x') + '.',
              [pbox('Area of ' + c.one + ' A:', ['x'], { before: t(s.sq ? '(' + tx(A1) + ')^{2}=' : bp(A1) + bp(A2) + '=') }), pbox('Area of ' + c.one + ' B:', ['x'], { before: t(bp(B1) + bp(B2) + '=') }), nbox(t('x='))],
              [polyChk(PA, s.sq ? sqWrongs(xm(1), N(s.a)) : binWrongs(xm(1), N(s.a), xm(1), N(s.b))), polyChk(PB, binWrongs(xm(1), N(s.c), xm(1), N(s.d))), numChk(x, xAlts)],
              [tx(PA), tx(PB), String(x)], t(tx(PA)) + ', ' + t(tx(PB)) + '; ' + t('x=' + x),
              (s.sq ? t('(' + tx(A1) + ')^{2}=' + tx(PA)) : t(bp(A1) + bp(A2) + '=' + tx(PA))) + ' and ' + t(bp(B1) + bp(B2) + '=' + tx(PB)) + '.<br>Set them equal: ' + t(eqL) + '.<br>The ' + t('x^{2}') + '-terms cancel: ' + t(tx(xm(s.a + s.b)) + sg(s.a * s.b) + '=' + tx(xm(s.c + s.d)) + sg(s.c * s.d)) + ', so ' + t(lin1) + ' and ' + t('x=' + x) + '.<br>Check: ' + t((x + s.a) + '\\times ' + (x + s.b) + '=' + (x + s.a) * (x + s.b)) + ' and ' + t((x + s.c) + '\\times ' + (x + s.d) + '=' + (x + s.c) * (x + s.d)) + ' ✓',
              ['Expand both areas. When you set them equal, the ' + t('x^{2}') + '-terms cancel.', 'Collect the ' + t('x') + '-terms on one side and the numbers on the other, then divide.'], 'equal areas ' + plain(eqL));
            p.bad = xAlts.map(function (a) { return [tx(PA), tx(PB), String(a.v)]; }).concat([[tx(add(xm(1, 2), N(s.a * s.b))), tx(PB), String(x)]]);
            return p;
          } },
          { id: '18b', outcome: 'AN4', level: 'MAS', make: function (r, s) {
            var c = s.ctx, x = s.x, L = x + s.a, W = x + s.b, A = L * W;
            var p = KP.number('Use your value of ' + t('x') + ' to find the area of each ' + c.one.toLowerCase() + ' (they are equal).', A, function (v) {
              if (v === x) return { code: 'u3t-area-x', hint: 'That is ' + t('x') + '. Substitute it into the side lengths and multiply.' };
              if (v === 2 * (L + W) || v === L + W) return { code: 'u3t-area-perim', hint: 'That adds the sides. Area = length × width.' };
              return null;
            }, c.one + ' A: ' + t((s.sq ? '(' + x + '+' + s.a + ')^{2}=' + L + '^{2}' : '(' + x + '+' + s.a + ')(' + x + '+' + s.b + ')=' + L + '\\times ' + W) + '=' + A) + ' ' + c.u + t('^{2}') + '.<br>' + c.one + ' B: ' + t('(' + x + '+' + s.c + ')(' + x + '+' + s.d + ')=' + (x + s.c) + '\\times ' + (x + s.d) + '=' + (x + s.c) * (x + s.d)) + ' ' + c.u + t('^{2}') + ' — the same ✓',
              ['Substitute ' + t('x') + ' into the side lengths of one shape, then multiply.', 'Check with the other shape: the areas must match.'], 'common area', { after: t('\\text{' + c.u + '}^{2}') });
            p.bad = [x, 2 * (L + W)].filter(function (y) { return y !== A; }).map(String);
            return p;
          } }] },
      { num: '19', outcome: 'AN4', shared: q19Shared,
        stem: function (s) { var w = q19Work(s); return s.name + ' expanded and simplified ' + t(w.start) + '. Each line should be equal to the line before it, but ' + s.name + ' made <b>one</b> error.' + workTable(s.name, w.lines); },
        parts: [
          { id: '19a', outcome: 'AN4', level: 'MAS', make: function (r, s) {
            var w = q19Work(s), k = s.k, a = s.a, sa = s.s * s.a, bt = '(x' + sg(sa) + ')^{2}', mid2 = 2 * k * sa;
            var true1 = s.kind === 'nomid' ? 'Line 1 is wrong: ' + t(bt) + ' has a middle term, so the bracket should be ' + t(tx(add(xm(1, 2), xm(2 * sa), N(a * a)))) + '.'
              : s.kind === 'once' ? 'Line 1 is wrong: the middle term of ' + t(bt) + ' is ' + t('2(x)(' + sa + ')=' + tx(xm(2 * sa))) + ', not ' + t(tx(xm(sa))) + '.'
              : 'Line 1 is wrong: the ' + t(k) + ' must not go inside the square. Square the bracket first, then multiply by ' + t(k) + '.';
            var true2 = s.kind === 'kfirst' ? 'Line 2 is wrong: the ' + t(k) + ' must multiply <b>every</b> term in the bracket, not just ' + t('x^{2}') + '.' : 'Line 2 is wrong: the ' + t(k) + ' must multiply the last term too: ' + t(k + '\\times ' + a * a + '=' + k * a * a) + '.';
            var c3 = mid2 + s.m, wrong3 = mid2 - s.m;
            var true3 = 'Line 3 is wrong: ' + t(seq([xm(mid2), xm(s.m)]) + '=' + tx(xm(c3))) + ', not ' + t(tx(xm(wrong3))) + '.';
            var false1 = 'Line 1 is wrong: ' + t(bt) + ' should be ' + t('x^{2}' + (s.s < 0 ? '-' : '+') + a * a) + '.';
            var false2 = 'Line 2 is wrong: ' + t(k + '\\times ' + a * a) + ' should be ' + t('(' + k + '\\times ' + a + ')^{2}=' + k * k * a * a) + '.';
            var false3 = 'Line 3 is wrong: ' + t(tx(xm(s.line === 1 ? 1 : mid2))) + ' and ' + t(tx(xm(s.m))) + ' are not like terms, so they can’t be combined.';
            if (s.line === 1) false3 = 'Line 3 is wrong: the ' + t('x') + '-terms are not like terms, so they can’t be combined.';
            if (s.line !== 3) false3 = 'Line 3 is wrong: the two ' + t('x') + '-terms are not like terms, so they can’t be combined.';
            var opts = [{ html: s.line === 1 ? true1 : false1, right: s.line === 1, why: s.line === 1 ? null : 'A square of a binomial has three terms: ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + '. Check Line 1 against that.' },
              { html: s.line === 2 ? true2 : false2, right: s.line === 2, why: s.line === 2 ? null : 'Order of operations: square the bracket first, then multiply each term by ' + t(k) + '. ' + t(k + '\\times ' + a * a + '=' + k * a * a) + ' is right.' },
              { html: s.line === 3 ? true3 : false3, right: s.line === 3, why: s.line === 3 ? null : 'Two ' + t('x') + '-terms are like terms: they can be combined. Look for the error in an earlier line.' },
              { html: 'There is no error: the work is correct.', right: false, why: 'Check each line by expanding ' + t(w.start) + ' yourself: ' + t('=' + tx(w.res)) + '.' }];
            var p = KP.mc(r, 'Which statement correctly describes ' + s.name + '’s error?', opts,
              '<b>' + (s.line === 1 ? true1 : s.line === 2 ? true2 : true3) + '</b><br>The correct work: ' + t(w.start + '=' + w.L1 + '=' + w.L2 + '=' + tx(w.res)) + '.',
              ['Redo the expansion yourself, line by line: square first, then multiply by ' + t(k) + ', then collect.', 'Compare each of ' + s.name + '’s lines with yours.'], 'error line ' + s.line + ' (' + s.kind + ')', true);
            return p;
          } },
          { id: '19b', outcome: 'AN4', level: 'MAS', make: function (r, s) {
            var w = q19Work(s), k = s.k, X = xm(1), Aa = N(s.s * s.a), mx = xm(s.m), base = add(X, Aa), T = w.res;
            var ws = [{ is: w.out, code: 'u3t-kept-error', hint: 'That is ' + s.name + '’s answer, with the error still in it.' }].concat(sqWrongs(X, Aa).map(function (x0) { return { is: add(PL.scale(x0.is, k), mx), code: x0.code, hint: x0.hint }; }),
              [{ is: add(mul(base, base), mx), code: 'k-forgot', hint: 'Multiply every term of the square by the ' + t(k) + ' in front.' }, { is: add(PL.pow(PL.scale(base, k), 2), mx), code: 'k-in-square', hint: 'Square the bracket <b>first</b>, then multiply by ' + t(k) + ' (order of operations).' },
                { is: add(xm(k, 2), xm(2 * s.s * s.a), N(s.a * s.a), mx), code: 'k-first', hint: 'Multiply <b>every</b> term of the square by ' + t(k) + '.' }, { is: sub(mul(N(k), base, base), mx), code: 'sign', hint: 'Check the sign of the ' + t(tx(mx)) + ' term.' }]);
            return pp('Write the correct expansion of ' + t(w.start) + ', simplified.', T, ws,
              'Square first, then multiply by ' + t(k) + ', then collect:<br>' + t(w.start + '=' + w.L1 + '=' + w.L2 + '=' + tx(T)) + '<br>(Check with ' + t('x=1') + ': ' + t(k + '(' + (1 + s.s * s.a) + ')^{2}' + sg(s.m) + '=' + (k * (1 + s.s * s.a) * (1 + s.s * s.a) + s.m)) + ' and ' + t(PL.at(T, { x: 1 })) + '.)',
              ['Expand ' + t('(x' + sg(s.s * s.a) + ')^{2}') + ' first — it has a middle term.', 'Then multiply every term by ' + t(k) + ' and collect the ' + t('x') + '-terms.'], 'correct expansion ' + plain(w.start));
          } }] },
      { num: '20', outcome: 'AN4', stem: 'Find the missing numbers.', parts: [
        { id: '20a', outcome: 'AN4', level: 'MAS', make: function (r) {
          var v = find(function () { return { p: r.pick([1, 1, 2]), q: nz(r, 1, 6), a: nz(r, 1, 7) }; }, function (v) { var b = v.p * v.q + v.a; return b !== 0 && Math.abs(v.a * v.q) >= 4 && Math.abs(v.a * v.q) <= 40 && Math.abs(v.a) !== Math.abs(v.q) && b !== v.a + v.q - (v.p === 1 ? 0 : 1e9); }, { p: 1, q: -5, a: 3 });
          var p = v.p, q = v.q, a = v.a, c = a * q, b = p * q + a, P0 = p === 1 ? '' : String(p), lhs = '(' + P0 + 'x+a)(x' + sg(q) + ')', rhs = P0 + 'x^{2}+bx' + sg(c);
          var aAlts = altVals(a, [{ v: -a, code: 'u3t-a-sign', hint: 'Check the sign: ' + t('a\\times' + cnum(q) + '=' + c) + '.' }, { v: c - q, code: 'u3t-a-sign', hint: 'The constant term is a <b>product</b>: ' + t('a\\times' + cnum(q) + '=' + c) + ', so divide.' }]);
          var bAlts = altVals(b, [p !== 1 ? { v: a + q, code: 'u3t-b-coef', hint: 'The outside product is ' + t(p + 'x\\cdot' + cnum(q) + '=' + p * q + 'x') + ': include the ' + t(p) + '.' } : null, { v: p * q, code: 'u3t-b-one', hint: t('b') + ' is the sum of <b>both</b> middle products: the outside ' + t(tx(xm(p * q))) + ' and the inside ' + t('a\\cdot x') + '.' }, { v: a, code: 'u3t-b-one', hint: t('b') + ' is the sum of <b>both</b> middle products: the outside ' + t(tx(xm(p)) + '\\cdot' + cnum(q)) + ' and the inside ' + t('a\\cdot x') + '.' }, { v: p * q - a, code: 'u3t-b-sign', hint: 'Check the sign of the inside product, ' + t('a\\cdot x') + ', with ' + t('a=' + a) + '.' }, { v: c, code: 'u3t-b-one', hint: t('b') + ' is the coefficient of ' + t('x') + ': the sum of the outside and inside products.' }]);
          var P1 = KP.fields('Find ' + t('a') + ' and ' + t('b') + ' so that ' + t(lhs + '=' + rhs) + ' for every value of ' + t('x') + '.', [nbox(t('a=')), nbox(t('b='))], [numChk(a, aAlts), numChk(b, bAlts)], [String(a), String(b)], t('a=' + a) + ', ' + t('b=' + b),
            'The last terms multiply to the constant: ' + t('a\\times' + cnum(q) + '=' + c) + ', so ' + t('a=' + a) + '.<br>Then ' + t('(' + tx(lin(p, a)) + ')(x' + sg(q) + ')=' + seq([xm(p, 2), xm(p * q), xm(a), N(c)]) + '=' + tx(add(xm(p, 2), xm(b), N(c)))) + ', so ' + t('b=' + b) + '. (' + t('b') + ' is the sum of the Outside and Inside products.)',
            ['Match the constant terms first: the last terms of the brackets multiply to ' + t(c) + '.', 'Then expand with your ' + t('a') + ' and read off the coefficient of ' + t('x') + '.'], 'find a and b: ' + lhs + '=' + rhs);
          P1.bad = aAlts.map(function (x) { return [String(x.v), String(b)]; }).concat(bAlts.map(function (x) { return [String(a), String(x.v)]; }));
          return P1;
        } },
        { id: '20b', outcome: 'AN4', level: 'MAS', make: function (r) {
          var m = r.pick([1, 1, 1, 2, 3]), q = m === 1 ? nz(r, 2, 9) : nz(r, 1, 4), k = -m * q, Fk = lin(m, k), F2 = lin(1, q), T = mul(Fk, F2), M0 = m === 1 ? '' : String(m);
          var shown = '(' + M0 + 'x+k)(x' + sg(q) + ')';
          var kAlts = altVals(k, [{ v: -k, code: 'u3t-k-sign', hint: 'The two ' + t('x') + '-terms, ' + t(tx(xm(m * q))) + ' and ' + t('kx') + ', cancel only when they are <b>opposites</b>.' }, m !== 1 ? { v: -q, code: 'u3t-k-coef', hint: 'The Outside product is ' + t(M0 + 'x\\cdot ' + cnum(q) + '=' + tx(xm(m * q))) + ': include the ' + t(m) + '. Solve ' + t(m * q + '+k=0') + '.' } : null]);
          var P1 = KP.fields('Find the value of ' + t('k') + ' so that the expansion of ' + t(shown) + ' has <b>no</b> ' + t('x') + '-term. Then expand the product using your value of ' + t('k') + '.',
            [nbox(t('k=')), pbox('Expansion:', ['x'], { before: t('(' + tx(Fk) + ')(' + tx(F2) + ')=') })],
            [numChk(k, kAlts), polyChk(T, [{ is: add(T, xm(2 * m * q)), code: 'sd-middle', hint: 'With this ' + t('k') + ' the Outside and Inside products cancel: there is no ' + t('x') + '-term.' }, { is: add(xm(m, 2), N(-k * q)), code: 'sd-plus', hint: 'The last product is ' + t(cnum(k) + '\\cdot ' + cnum(q)) + ', which is negative.' }])],
            [String(k), tx(T)], t('k=' + k) + '; ' + t('(' + tx(Fk) + ')(' + tx(F2) + ')=' + tx(T)),
            'The ' + t('x') + '-terms come from the Outside and Inside products: ' + t(M0 + 'x\\cdot ' + cnum(q) + '=' + tx(xm(m * q))) + ' and ' + t('k\\cdot x=kx') + '.<br>They cancel when ' + t(m * q + '+k=0') + ', so ' + t('k=' + k) + '.<br>' + t('(' + tx(Fk) + ')(' + tx(F2) + ')=' + seq(prods(Fk, F2)) + '=' + tx(T)) + ' — only two terms.',
            ['Write the two products that give ' + t('x') + '-terms; they must add to ' + t('0') + '.', 'Then expand with that ' + t('k') + ': the middle terms cancel.'], 'no x-term: ' + shown);
          P1.bad = kAlts.map(function (x) { return [String(x.v), tx(T)]; }).concat([[String(k), tx(add(T, xm(2 * m * q)))]]);
          return P1;
        } }] }
    ]
  });
})(window);
