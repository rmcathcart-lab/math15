/* Math 15 · Unit 3 · Lesson 1 — Like Terms, and Adding/Subtracting Polynomials (AN4)
 * Assignment 1 (u3_L01.tex, Questions 1–15) and the Lesson 1 Extra Practice (u3_EP01.tex, Questions 1–17).
 * Every part is a generator that keeps the booklet question's structure (which terms, which signs, which brackets are
 * subtracted) and changes the numbers; the booklet's own numbers are among the possible values. Keys are built with
 * HW.poly (js/poly.js) from the generated numbers, so a key is always the simplified question. Built like the Math 10C
 * Unit 3 Lesson 1 practice (same checkers, wrong-answer codes and hints), at the Math 15 pitch.
 * Conversions: "classify" → multiple choice; "sort into groups of like terms" → a table (one column per group);
 * "like terms? if not, explain" → a table whose columns are the reasons; "identify the mistake" → multiple choice plus
 * the corrected answer; "explain" → multiple choice whose options are reasons; "give an example" → math boxes checked
 * against every condition; several answers → labelled boxes.
 * Changed from the booklet: Assignment 3(b) asks for the coefficients of the three variable terms (the constant term is
 * part (c)); Extra 1 adds a decoy column to the sorting table, so "how many groups" is still a real question.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 12 (find the missing coefficients). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, ex = HW.ex, P = HW.poly, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'deg-coef': 'Used the coefficient as the degree', 'deg-max': 'Took the largest exponent instead of the sum', 'deg-const': 'Gave a constant a degree other than 0',
    'deg-sum-all': 'Added the exponents of every term (degree of a polynomial)', 'deg-terms': 'Gave the number of terms as the degree',
    'u3l1-name': 'Wrong name for the polynomial', 'u3l1-count': 'Miscounted the terms', 'u3l1-coef-hidden': 'Missed a hidden coefficient of 1',
    'u3l1-add-exp': 'Added the exponents when adding like terms', 'unlike-combined': 'Combined unlike terms', 'u3l1-reversed': 'Subtracted in the wrong order',
    'u3l1-inverse': 'Working backwards: used the wrong operation', 'u3l1-other-coef': 'Gave the coefficient of a different term', 'u3l1-ab-sign': 'Missing coefficient with the wrong sign',
    'u3l1-deg-early': 'Classified before simplifying', 'u3l1-half': 'Perimeter: added only one length and one width', 'u3l1-ex-terms': 'Example: a polynomial with the wrong number of terms',
    'u3l1-ex-sum': 'Example: the sum doesn’t have the required number of terms', 'u3l1-ex-degree': 'Example: wrong degree', 'u3l1-x2': 'Substitution: worked out x² as 2x'
  });
  HW.addPartial({ 'deg-coef': 'n', 'deg-max': 'b', 'deg-const': 'n', 'deg-sum-all': 'b', 'deg-terms': 'n', 'u3l1-name': 'n', 'u3l1-count': 's', 'u3l1-coef-hidden': 's',
    'u3l1-add-exp': 's', 'unlike-combined': 'n', 'u3l1-reversed': 'n', 'u3l1-inverse': 'n', 'u3l1-other-coef': 'n', 'u3l1-ab-sign': 's', 'u3l1-deg-early': 'b', 'u3l1-half': 'b',
    'u3l1-ex-terms': 'n', 'u3l1-ex-sum': 'n', 'u3l1-ex-degree': 'n', 'u3l1-x2': 's' });

  /* ---------------- small helpers (as in the Math 10C Unit 3 practice) ---------------- */
  function T(c, x, e) { var v = {}; if (x && e) v[x] = e; return P.mono(c, v); }            // c·xᵉ (e = 0 → constant)
  function M(c, v) { return P.mono(c, v || {}); }                                              // c·(monomial)
  function S(arr) { return P.add.apply(null, arr); }                                          // the polynomial of a written term list
  function W(arr) { return P.seq(arr); }                                                      // LaTeX of a term list in the order written
  function NEG(arr) { return arr.map(P.neg); }
  function tx(p) { return P.tex(p); }
  function termsOf(p) { return P.sorted(p).map(function (q) { return M(q.c, q.v); }); }
  function nz(r, a, b) { var v = 0; while (v === 0) v = r.int(a, b); return v; }
  function plain(s) { return String(s).replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)').replace(/\\[a-z]+/g, ' ').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim(); }
  function plainPoly(p) { return plain(tx(p)); }
  function cf(p, v) { return P.coef(p, v)[0]; }
  var PH = 'e.g. 3x^2 - 5x + 4';
  var NAME = { 1: 'monomial', 2: 'binomial', 3: 'trinomial' };
  function nameOf(n) { return NAME[n] || 'polynomial'; }
  function termsCount(n) { return n + ' term' + (n === 1 ? '' : 's'); }
  function sgn(n) { return n < 0 ? String(n) : '+' + n; }

  /* collect like terms: one line per group, in descending order */
  function groupsTex(list) {
    var by = {}, vs = {}, keys = [];
    list.forEach(function (p) { P.terms(p).forEach(function (q) { if (!by[q.key]) { by[q.key] = []; vs[q.key] = q.v; keys.push(q.key); } by[q.key].push(q.c); }); });
    var dummy = {}; keys.forEach(function (k) { dummy[k] = { c: [1, 1], v: vs[k] }; });
    return P.sorted(dummy).map(function (d) {
      var k = d.key, cs = by[k], s = cs.reduce(function (a, c) { return ex.norm(a[0] * c[1] + c[0] * a[1], a[1] * c[1]); }, [0, 1]);
      var lab = k ? P.monoTex(vs[k]) : '\\text{const.}';
      var body = cs.map(function (c, i) { var x = K.ratTex(c); return i && x.charAt(0) !== '-' ? '+' + x : x; }).join('');
      return t(lab + ':\\ ' + (cs.length > 1 ? body + '=' + K.ratTex(s) : body));
    }).join(';&nbsp; ');
  }
  /* worked solution for a sum/difference of brackets. parts: [{ s: +1|-1, a: termList }] */
  function bracketSol(parts, ans, lead) {
    var flat = [], anySub = false;
    parts.forEach(function (q) { if (q.s < 0) anySub = true; flat = flat.concat(q.s < 0 ? NEG(q.a) : q.a); });
    return (lead ? lead + '<br>' : '') + (anySub ? 'Subtracting a bracket means adding its opposite — change the sign of <b>every</b> term inside it:<br>' : 'Addition changes no signs — remove the brackets:<br>') + t(W(flat)) +
      '<br>Collect like terms: ' + groupsTex(flat) + '<br>' + t('=' + tx(ans));
  }
  function bracketsTex(parts) { return parts.map(function (q, i) { return (q.s < 0 ? '-' : i ? '+' : '') + '(' + W(q.a) + ')'; }).join(''); }

  /* wrong-answer list for K.poly: drop entries equal to the target or to each other */
  function wl(target, list) {
    var out = [];
    (list || []).forEach(function (w) { if (!w || !w.is) return; var p = P.lift(w.is); if (P.eq(p, target)) return; if (out.some(function (o) { return P.eq(o.is, p); })) return; out.push({ is: p, code: w.code, hint: w.hint }); });
    return out;
  }
  /* a polynomial-answer part. o: { wrong, vars, sol, hints, text, bad, after } */
  function pp(prompt, target, o) {
    o = o || {};
    var ws = wl(target, o.wrong);
    var part = KP.poly(prompt, target, { vars: o.vars, wrong: ws, diag: o.diag, after: o.after }, o.sol, o.hints || [], o.text);
    part.bad = ws.map(function (w) { return tx(w.is); }).concat(o.bad || []);
    if (P.count(target) > 1) part.good = [P.tex(target, { order: 'asc' })];
    part.input.placeholder = PH;
    return part;
  }
  /* the "added the exponents" slip: every group of two or more like terms (one letter) gets its exponents added */
  function addExpWrong(terms) {
    var by = {};
    terms.forEach(function (q) { P.terms(q).forEach(function (u) { (by[u.key] = by[u.key] || []).push(u); }); });
    var out = [], changed = false;
    Object.keys(by).forEach(function (k) {
      var g = by[k], c = g.reduce(function (a, u) { return a + u.c[0] / u.c[1]; }, 0), ls = Object.keys(g[0].v);
      if (g.length >= 2 && ls.length === 1 && c !== 0) { var v = {}; v[ls[0]] = g[0].v[ls[0]] * g.length; out.push(M(c, v)); changed = true; }
      else out.push(S(g.map(function (u) { return M(u.c, u.v); })));
    });
    return changed ? S(out) : null;
  }
  var ADDEXP = 'When you collect like terms, add the <b>coefficients</b> and keep the variable part — exponent included — the same: ' + t('x^{2}+x^{2}=2x^{2}') + ', not ' + t('2x^{4}') + '.';
  /* add/subtract part: parts [{s, a}] */
  function addSub(prompt, parts, o) {
    o = o || {};
    var ans = P.add.apply(null, parts.map(function (q) { return q.s < 0 ? P.neg(S(q.a)) : S(q.a); }));
    var ws = (o.wrong || []).slice();
    var firstOnly = P.add.apply(null, parts.map(function (q) { return q.s < 0 ? P.add(P.neg(q.a[0]), S(q.a.slice(1))) : S(q.a); }));
    var noChange = P.add.apply(null, parts.map(function (q) { return S(q.a); }));
    if (parts.some(function (q) { return q.s < 0 && q.a.length > 1; })) ws.push({ is: firstOnly, code: 'sub-first', hint: 'A minus sign in front of a bracket changes the sign of <b>every</b> term inside it, not just the first one.' });
    if (parts.some(function (q) { return q.s < 0; })) ws.push({ is: noChange, code: 'no-change', hint: 'It looks like you <b>added</b> the bracket after the minus sign. To subtract, change the sign of every term inside it (add the opposite).' });
    var flat = []; parts.forEach(function (q) { flat = flat.concat(q.s < 0 ? NEG(q.a) : q.a); });
    var ae = addExpWrong(flat); if (ae) ws.push({ is: ae, code: 'u3l1-add-exp', hint: ADDEXP });
    return pp(prompt === null ? t(bracketsTex(parts)) : prompt, ans, { wrong: ws, vars: o.vars, sol: o.sol || bracketSol(parts, ans, o.lead), text: o.text || plainPoly(ans), after: o.after,
      hints: o.hints || ['Remove the brackets first' + (parts.some(function (q) { return q.s < 0; }) ? ': a minus sign in front of a bracket changes the sign of <b>every</b> term inside it.' : ' — adding changes no signs.'), 'Then collect like terms: same variables with the same exponents. Add their coefficients.'] });
  }
  function vertTex(top, bottom, op) { return '\\begin{array}{r} ' + W(top) + ' \\\\ ' + (op < 0 ? '-' : '+') + '\\ (' + W(bottom) + ') \\\\ \\hline \\end{array}'; }

  /* "collect like terms" part. o.wrong extra wrongs */
  function likePart(terms, o) {
    o = o || {};
    var ans = S(terms), ws = (o.wrong || []).slice(), ae = addExpWrong(terms);
    if (ae) ws.push({ is: ae, code: 'u3l1-add-exp', hint: ADDEXP });
    return pp(t(W(terms)), ans, { wrong: ws, text: 'collect ' + plain(W(terms)), sol: 'Group the like terms (each term keeps the sign in front of it):<br>' + groupsTex(terms) + '<br>' + t('=' + tx(ans)),
      hints: o.hints || ['Sort the terms into groups with exactly the same variable part, keeping the sign in front of each term.', 'Add the coefficients in each group. Unlike terms are left alone.'] });
  }
  /* every variable term lumped into the first variable part (unlike terms combined) */
  function lumpWrong(terms, withConst) {
    var vt = terms.filter(function (q) { return P.vars(q).length; }), c0 = terms.filter(function (q) { return !P.vars(q).length; });
    var v = P.terms(vt[0])[0].v, s = 0;
    (withConst ? terms : vt).forEach(function (q) { P.terms(q).forEach(function (u) { s += u.c[0] / u.c[1]; }); });
    if (!s) return null;
    return withConst ? M(s, v) : P.add(M(s, v), S(c0.length ? c0 : [P.num(0)]));
  }
  var LUMP = 'Only <b>like</b> terms combine: they need the same letters with the same exponents. A constant can’t join an ' + t('x') + '-term, and ' + t('x^{2}') + ' can’t join ' + t('x') + '.';

  /* "monomial / binomial / trinomial / polynomial" typed as a word */
  function nameChk(n, early) {
    return function (resp) {
      var s = String(resp || '').replace(/\\text\{([^}]*)\}/g, '$1').trim().toLowerCase();
      if (!s) return form('empty', 'Type the name.');
      var got = /^mono/.test(s) ? 1 : /^bi/.test(s) ? 2 : /^tri/.test(s) ? 3 : /poly|four|^4/.test(s) ? 4 : 0;
      if (!got) return form('name-word', 'Type one of: monomial, binomial, trinomial, polynomial.');
      var want = Math.min(n, 4);
      if (got === want) return ok();
      if (got === 4 && n < 4) return form('name-special', 'True, every one of these is a polynomial — but use the special name for a polynomial with ' + termsCount(n) + '.');
      if (early && got === Math.min(early, 4)) return wrong('u3l1-deg-early', 'That’s the name of the expression <b>before</b> simplifying. Simplify first, then count the terms that are left.');
      return wrong('u3l1-name', 'Count the terms (the pieces separated by ' + t('+') + ' or ' + t('-') + ' signs): there ' + (n === 1 ? 'is 1 term' : 'are ' + n + ' terms') + '.');
    };
  }
  /* Q1: name by number of terms (multiple choice) */
  function namePart(r, polyTex, n, extraWhy) {
    var opts = [1, 2, 3, 4].map(function (k) {
      var why = k === n ? null : 'Count the terms — the pieces separated by ' + t('+') + ' or ' + t('-') + ' signs. ' + t(polyTex) + ' has ' + termsCount(n) + '.' + (extraWhy && k > n ? ' ' + extraWhy : '');
      return { html: k === 4 ? 'a polynomial with 4 or more terms' : 'a ' + NAME[k], right: k === n, why: why };
    });
    return KP.mc(r, 'Classify ' + t(polyTex) + ' as a monomial, a binomial, or a trinomial.', opts,
      t(polyTex) + ' has ' + termsCount(n) + ', so it is a <b>' + nameOf(n) + '</b>.', ['Terms are separated by ' + t('+') + ' and ' + t('-') + ' signs. 1 term: monomial; 2: binomial; 3: trinomial.'], 'name of ' + plain(polyTex), true);
  }
  /* degree of a monomial. vs = [[letter, exp]] */
  function degPart(coefTex, vs, extraDiag) {
    var d = vs.reduce(function (s, v) { return s + v[1]; }, 0), body = coefTex + vs.map(function (v) { return v[1] === 1 ? v[0] : v[0] + '^{' + v[1] + '}'; }).join('');
    var mx = vs.length ? Math.max.apply(null, vs.map(function (v) { return v[1]; })) : 0, pr = vs.reduce(function (s, v) { return s * v[1]; }, 1);
    var hid = vs.filter(function (v) { return v[1] === 1; }).length, shown = d - hid;
    return KP.number('State the degree of ' + t(body) + '.', d, function (v) {
      if (extraDiag) { var h = extraDiag(v); if (h) return h; }
      if (!vs.length) { if (v !== 0) return { code: 'deg-const', hint: 'The degree counts the exponents on the <b>variables</b>. A constant has no variable, so its degree is ' + t('0') + '.' }; return null; }
      if (hid && v === shown) return { code: 'deg-hidden1', hint: 'A variable with no exponent showing has exponent ' + t('1') + ' (' + t('x=x^{1}') + '). Count it too.' };
      if (vs.length > 1 && v === mx) return { code: 'deg-max', hint: 'The degree of a term is the <b>sum</b> of the exponents of all its variables, not the largest one.' };
      if (vs.length > 1 && v === pr && pr !== d) return { code: 'deg-prod', hint: '<b>Add</b> the exponents, don’t multiply them.' };
      return null;
    }, 'Degree = sum of the exponents of the variables' + (vs.length ? ': ' + t(vs.map(function (v) { return v[1]; }).join('+') + '=' + d) + (hid ? ' (a variable with no exponent shown has exponent ' + t('1') + ')' : '') : ': there is no variable, so the degree is ' + t('0')) + '. The coefficient doesn’t count.',
    ['Add the exponents of all the variables. The number in front doesn’t count.'], 'degree of ' + plain(body));
  }
  function degCoefDiag(c) { return function (v) { return v === c ? { code: 'deg-coef', hint: 'That’s the coefficient. The degree comes from the <b>exponents</b> of the variables.' } : null; }; }
  function degSumTex(q) { var v = P.terms(q)[0].v, ks = Object.keys(v).filter(function (x) { return v[x]; }).sort(); return ks.length ? ks.map(function (x) { return v[x]; }).join('+') + '=' + P.degree(q) : '0'; }
  function degTermDiag(q) {
    var v = P.terms(q)[0].v, ks = Object.keys(v).filter(function (x) { return v[x]; }), mx = ks.length ? Math.max.apply(null, ks.map(function (x) { return v[x]; })) : 0, c = Math.abs(P.terms(q)[0].c[0]);
    return function (x) {
      if (ks.length > 1 && x === mx) return { code: 'deg-max', hint: 'Add the exponents of <b>all</b> the variables in the term (' + t(degSumTex(q)) + ').' };
      if (!ks.length && x !== 0) return { code: 'deg-const', hint: 'A constant has no variable, so its degree is ' + t('0') + '.' };
      if (x === c && c !== P.degree(q)) return { code: 'deg-coef', hint: 'The coefficient doesn’t count. Add the exponents.' };
      return null;
    };
  }
  /* EP3: degree of each term, degree of the polynomial, name (terms shown in the booklet's order) */
  function twoVarPart(terms) {
    var Sp = S(terms), d = P.degree(Sp), n = terms.length;
    var fl = terms.map(function (q, i) { return { name: 'Degree of term ' + (i + 1), label: 'Degree of ' + t(tx(q)) }; }).concat([{ name: 'Degree of the polynomial', label: 'Degree of the polynomial' }, { name: 'Name', label: 'Name', mode: 'text', placeholder: 'e.g. binomial' }]);
    var chks = terms.map(function (q) { return K.number(P.degree(q), degTermDiag(q)); }).concat([K.number(d, function (v) { var all = terms.reduce(function (s, q) { return s + P.degree(q); }, 0); return v === all ? { code: 'deg-sum-all', hint: 'The degree of the polynomial is the degree of its <b>highest</b> term, not the total.' } : v === n && n !== d ? { code: 'deg-terms', hint: 'That’s the number of terms. The degree of the polynomial is its highest term degree.' } : null; }), nameChk(n)]);
    return KP.fields(t(W(terms)), fl, chks, terms.map(function (q) { return String(P.degree(q)); }).concat([String(d), nameOf(n)]),
      terms.map(function (q) { return t(tx(q)) + ': ' + t(P.degree(q)); }).join(', ') + '; degree ' + t(d) + '; ' + nameOf(n),
      terms.map(function (q) { return t(tx(q)) + ': ' + t(degSumTex(q)); }).join(';&nbsp; ') + '.<br>The highest is ' + t(d) + ', so the polynomial has degree ' + t(d) + '. It has ' + termsCount(n) + ': a <b>' + nameOf(n) + '</b>' + (n > 3 ? ' (no special name)' : '') + '.',
      ['Degree of a term: <b>add</b> the exponents of its variables (' + t('x=x^{1}') + '). Degree of the polynomial: the highest term degree.', 'Name: 1 term monomial, 2 binomial, 3 trinomial, 4 or more polynomial.'], 'degrees & name of ' + plain(W(terms)));
  }
  /* like / unlike table. rows [{ tex, w: 'like'|'exp'|'var', why }] */
  function likeGrid(rows, text) {
    var cols = [{ id: 'like', html: 'Like' }, { id: 'exp', html: 'Unlike: exponents differ' }, { id: 'var', html: 'Unlike: variables differ' }], want = {};
    var rr = rows.map(function (x, i) { want['r' + i] = x.w; return { id: 'r' + i, html: '(' + String.fromCharCode(97 + i) + ') ' + t(x.tex), label: plain(x.tex) }; });
    var p = KP.grid('Like terms, or not? If not, choose the reason.', rr, cols, want, { tries: 2, why: function (row) { return { code: 'row', hint: rows[Number(row.slice(1))].why }; } },
      rows.map(function (x, i) { return '(' + String.fromCharCode(97 + i) + ') ' + t(x.tex) + ': <b>' + cols.filter(function (c) { return c.id === x.w; })[0].html + '</b> — ' + x.why; }).join('<br>'),
      ['Like terms have exactly the same variables with exactly the same exponents. The coefficients (and the order of the letters) don’t matter.'], text);
    var b = {}; Object.keys(want).forEach(function (k) { b[k] = want[k]; }); b.r0 = want.r0 === 'like' ? 'exp' : 'like'; p.bad = [b];
    return p;
  }
  /* sort terms into columns. items [{ p: poly, col }], cols [{ id, html }] */
  function sortGrid(prompt, items, cols, sol, text, whyFn) {
    var want = {}, rows = items.map(function (it, i) { want['r' + i] = it.col; return { id: 'r' + i, html: t(tx(it.p)), label: plainPoly(it.p) }; });
    var p = KP.grid(prompt, rows, cols, want, { tries: 3, why: function (row, got) { var it = items[Number(row.slice(1))]; return { code: 'row', hint: whyFn(it, got) }; } }, sol,
      ['Look only at the <b>variable part</b> of each term (letters and exponents). The coefficient and its sign don’t decide the group.', 'A term with no variable at all is a constant.'], text);
    var b = {}; Object.keys(want).forEach(function (k) { b[k] = want[k]; }); b.r0 = cols.filter(function (c) { return c.id !== want.r0; })[0].id; p.bad = [b];
    return p;
  }
  /* "give an example": two polynomials, each a given kind, whose sum has a given number of terms (or a lower degree) */
  function readPoly(s) { var a = K.read(s); if (a.res) return { res: a.res }; var r = P.read(a.ast); if (!r.ok) return { res: wrong('not-poly', 'Type a polynomial (whole-number exponents, no variable in a denominator).') }; if (P.formIssue(a.ast)) return { res: form('simplify', 'Write each polynomial in simplest form (like terms collected) so its terms can be counted.') }; return { p: r.p }; }
  function exampleFields(spec) {
    return function (resp) {
      resp = resp || [];
      var a = readPoly(resp[0] || ''), b = readPoly(resp[1] || '');
      if (a.res) return { v: a.res.v, code: a.res.code, hint: '<b>First:</b> ' + (a.res.hint || 'Check this one.') };
      if (b.res) return { v: b.res.v, code: b.res.code, hint: '<b>Second:</b> ' + (b.res.hint || 'Check this one.') };
      var c = spec.each(a.p, 'First') || spec.each(b.p, 'Second'); if (c) return c;
      return spec.sum(P.add(a.p, b.p)) || ok();
    };
  }

  /* ---------------- drawings ---------------- */
  function svgLabel(s) { return String(s).replace(/\^\{?(\d)\}?/g, function (m, d) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'.charAt(+d); }).replace(/-/g, ' − ').replace(/\+/g, ' + ').replace(/^ − /, '−').replace(/([a-z])/g, '<tspan font-style="italic">$1</tspan>'); }
  function svgText(x, y, s, anchor) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" font-size="16" font-family="serif" fill="currentColor">' + svgLabel(s) + '</text>'; }
  function triSvg(a, b, c) { // a: base, b: left side, c: right side (labels)
    return '<svg class="fig-svg" viewBox="0 0 300 180" width="100%" style="max-width:320px" role="img" aria-label="triangle with sides ' + a + ', ' + b + ' and ' + c + '">' +
      '<polygon points="40,145 260,145 105,30" fill="rgba(110,150,200,0.15)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
      svgText(150, 170, a) + svgText(66, 82, b, 'end') + svgText(190, 82, c, 'start') + '</svg>';
  }
  function quadSvg(s) { // s: [bottom, right, top, left]
    return '<svg class="fig-svg" viewBox="0 0 360 200" width="100%" style="max-width:380px" role="img" aria-label="quadrilateral with sides ' + s.join(', ') + '">' +
      '<polygon points="70,150 250,150 286,78 106,56" fill="rgba(110,150,200,0.15)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
      svgText(160, 174, s[0]) + svgText(274, 122, s[1], 'start') + svgText(196, 54, s[2]) + svgText(82, 104, s[3], 'end') + '</svg>';
  }
  function rectSvg(len, wid) {
    return '<svg class="fig-svg" viewBox="0 0 320 160" width="100%" style="max-width:320px" role="img" aria-label="rectangle ' + len + ' by ' + wid + '">' +
      '<rect x="40" y="25" width="200" height="100" fill="rgba(110,150,200,0.15)" stroke="currentColor" stroke-width="2"/>' +
      svgText(140, 148, len) + svgText(248, 80, wid, 'start') + '</svg>';
  }

  /* ---------------- question makers ---------------- */
  /* Q4: sort into x / x² / y / constants */
  var Q4COLS = [{ id: 'x', html: t('x') + '-terms' }, { id: 'x2', html: t('x^{2}') + '-terms' }, { id: 'y', html: t('y') + '-terms' }, { id: 'c', html: 'Constants' }];
  function q4Why(it, got) {
    var want = it.col;
    if (want === 'c') return t(tx(it.p)) + ' has no variable at all, so it is a <b>constant</b>.';
    if (want === 'x' && got === 'x2') return t(tx(it.p)) + ' has ' + t('x') + ' to the exponent ' + t('1') + ', not ' + t('2') + '.';
    if (want === 'x2' && got === 'x') return 'Look at the exponent: ' + t(tx(it.p)) + ' has ' + t('x^{2}') + ', so it is an ' + t('x^{2}') + '-term.';
    if (got === 'c') return t(tx(it.p)) + ' has a variable, so it isn’t a constant.';
    return 'Check the letter in ' + t(tx(it.p)) + '.';
  }
  function q4(r) {
    var used = {}, items = [];
    function add(p, col) { var k = tx(p); if (used[k]) return false; used[k] = 1; items.push({ p: p, col: col }); return true; }
    var g = 0;
    while (items.length < 8 && g++ < 500) {
      items = []; used = {};
      add(T(r.int(2, 9), 'x', 1), 'x'); add(T(r.pick([1, 1, -1, -r.int(2, 6)]), 'x', 1), 'x');
      add(T(-r.int(2, 9), 'x', 2), 'x2'); add(T(nz(r, -6, 6), 'x', 2), 'x2');
      add(T(r.int(2, 9), 'y', 1), 'y'); add(T(nz(r, -9, 9), 'y', 1), 'y');
      add(T(r.int(2, 12)), 'c'); add(T(-r.int(2, 12)), 'c');
    }
    if (r.chance(0.15)) items = [{ p: T(3, 'x', 1), col: 'x' }, { p: T(-5, 'x', 2), col: 'x2' }, { p: T(8), col: 'c' }, { p: T(1, 'x', 1), col: 'x' }, { p: T(-2, 'x', 2), col: 'x2' }, { p: T(4, 'y', 1), col: 'y' }, { p: T(-9), col: 'c' }, { p: T(6, 'y', 1), col: 'y' }];
    else { var sh; do { sh = r.shuffle(items); } while (sh[0].col === sh[1].col && sh[1].col === sh[2].col); items = sh; }
    var sol = Q4COLS.map(function (c) { return c.html + ': ' + items.filter(function (it) { return it.col === c.id; }).map(function (it) { return t(tx(it.p)); }).join(', '); }).join('<br>') + '<br>Like terms have the same variable part; the coefficient (with its sign) can be anything.';
    return sortGrid('Sort the terms into groups of like terms: put each one in its column.', items, Q4COLS, sol, 'sort x / x² / y / constants', q4Why);
  }
  /* Q12 / EP9 student error: A − B with only the first sign of B changed */
  function errShared(r, A, Bq) { return { A: A, B: Bq, stu: P.add(S(A), P.neg(Bq[0]), Bq[1], Bq[2]), ans: P.sub(S(A), S(Bq)) }; }
  function errMC(r, sh) {
    var b1 = sh.B[1], b2 = sh.B[2];
    return KP.mc(r, 'What mistake did the student make?', [
      { html: 'Only the sign of the first term of the second bracket was changed: ' + t(tx(b1)) + ' and ' + t(tx(b2)) + ' should have become ' + t(tx(P.neg(b1))) + ' and ' + t(tx(P.neg(b2))) + '.', right: true },
      { html: 'The sign of ' + t(tx(sh.B[0])) + ' should not have been changed.', why: 'Changing that sign was right. Look at the <b>other</b> terms of the second bracket.' },
      { html: 'The like terms were collected incorrectly.', why: 'Given the line the student wrote, the collecting is right. The mistake is earlier, when the brackets were removed.' },
      { html: 'There is no mistake.', why: 'Substitute ' + t('x=1') + ' into the original and into the student’s answer — do you get the same value?' }],
      'The minus sign in front of the bracket must reach <b>every</b> term: ' + t('-(' + W(sh.B) + ')=' + W(NEG(sh.B))) + '. The student changed only the first sign.', ['Write the opposite of the whole second bracket and compare it with what the student wrote.'], 'identify subtraction error');
  }
  function errFix(sh, prompt) {
    return pp(prompt || 'Give the correct simplified answer.', sh.ans, { text: 'correct the subtraction', wrong: [{ is: sh.stu, code: 'sub-first', hint: 'That’s the student’s answer. Change the sign of <b>every</b> term in the second bracket.' }, { is: P.add(S(sh.A), S(sh.B)), code: 'no-change', hint: 'Subtract the second bracket: change the sign of every term inside it.' }],
      sol: t('-(' + W(sh.B) + ')=' + W(NEG(sh.B))) + ', so<br>' + t(W(sh.A.concat(NEG(sh.B))) + '=' + tx(sh.ans)), hints: ['Write the opposite of the whole second bracket (every sign changes), then collect like terms.'] });
  }
  /* missing coefficient boxes */
  function coefBox(label) { return { name: label, label: t(label) }; }

  /* ======================== EXTRA PRACTICE ======================== */
  var EP1COLS = [{ id: 'a', html: t('x^{2}y') }, { id: 'b', html: t('xy^{2}') }, { id: 'c', html: t('xy') }, { id: 'd', html: t('x^{2}') }, { id: 'e', html: t('x^{2}y^{2}') }];
  var EXTRA = [
    { num: '1', section: 'Extra practice A — Like Terms When There Is More Than One Variable', stem: 'Two terms are <b>like</b> only when <b>every</b> variable carries <b>exactly</b> the same exponent: ' + t('5x^{2}y') + ' and ' + t('5xy^{2}') + ' are <b>unlike</b>.',
      shared: function (r) {
        var vs = [{ x: 2, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 1 }, { x: 2 }], cols = ['a', 'b', 'c', 'd'], sizes = r.chance(0.5) ? [3, 2, 2, 1] : r.shuffle([3, 2, 2, 1]), items = [], used = {};
        if (sizes[3] === 3 && r.chance(0.7)) sizes = [3, 2, 2, 1];
        vs.forEach(function (v, i) { for (var k = 0; k < sizes[i]; k++) { var p, g = 0; do { p = M(r.pick([1, -1, 2, -3, 4, 5, -8, 7, -2, 3, 6, -5]), v); g++; } while (used[tx(p)] && g < 50); used[tx(p)] = 1; items.push({ p: p, col: cols[i] }); } });
        return { items: r.shuffle(items), groups: sizes.filter(function (s) { return s > 0; }).length };
      },
      parts: [
        { id: 'e1a', level: 'EMG', make: function (r, sh) {
          var items = sh.items;
          return sortGrid('Sort the terms into groups of like terms. (One column stays empty.)', items, EP1COLS,
            EP1COLS.map(function (c) { var g = items.filter(function (it) { return it.col === c.id; }); return c.html + ': ' + (g.length ? g.map(function (it) { return t(tx(it.p)); }).join(', ') : '—'); }).join('<br>') + '<br>' + t('x^{2}y') + ' and ' + t('xy^{2}') + ' use the same letters, but the exponents are swapped, so they are different groups.',
            'sort two-variable like terms', function (it, got) {
              var v = P.terms(it.p)[0].v;
              return 'Read the exponents in ' + t(tx(it.p)) + ': ' + t('x') + ' has exponent ' + t(v.x || 0) + ' and ' + t('y') + ' has exponent ' + t(v.y || 0) + (v.y ? '' : ' (there is no ' + t('y') + ')') + '. Find the column with exactly those exponents.';
            });
        } },
        { id: 'e1b', level: 'BEG', make: function (r, sh) {
          return KP.number('How many groups of like terms are there?', sh.groups, function (v) { return v === 5 ? { code: 'u3l1-count', hint: 'One column is empty — an empty column isn’t a group.' } : v === 8 ? { code: 'u3l1-count', hint: 'Count groups, not terms.' } : null; },
            'The terms fall into ' + t(sh.groups) + ' groups: ' + t('x^{2}y') + ', ' + t('xy^{2}') + ', ' + t('xy') + ' and ' + t('x^{2}') + '. The ' + t('x^{2}y^{2}') + ' column is empty.', ['Count the columns that have at least one term in them.'], 'number of groups');
        } }] },
    { num: '2', stem: 'Collect like terms. Watch the exponents carefully — not everything that looks similar can be combined.', parts: [
      { id: 'e2a', level: 'EMG', make: function (r) {
        var a = r.int(2, 6), b = r.int(2, 5), c = r.int(1, 4), d; do { d = r.int(1, 4); } while (d === b);
        var terms = [M(a, { x: 2, y: 1 }), M(-b, { x: 1, y: 2 }), M(c, { x: 2, y: 1 }), M(d, { x: 1, y: 2 })];
        if (r.chance(0.15)) terms = [M(5, { x: 2, y: 1 }), M(-3, { x: 1, y: 2 }), M(2, { x: 2, y: 1 }), M(1, { x: 1, y: 2 })];
        return likePart(terms, { wrong: [{ is: M(cf(S(terms), { x: 2, y: 1 }) + cf(S(terms), { x: 1, y: 2 }), { x: 2, y: 1 }), code: 'unlike-combined', hint: t('x^{2}y') + ' and ' + t('xy^{2}') + ' are <b>unlike</b>: the exponents on ' + t('x') + ' and ' + t('y') + ' are swapped.' }] });
      } },
      { id: 'e2b', level: 'EMG', make: function (r) {
        var a = r.int(3, 8), b = r.int(2, 5), c = r.int(1, 2), d, e = r.int(2, 5); do { d = r.int(3, 9); } while (d === b);
        var terms = [M(a, { a: 2, b: 1 }), M(b, { a: 1, b: 2 }), M(-c, { a: 2, b: 1 }), M(-d, { a: 1, b: 2 }), M(e, { a: 1, b: 1 })];
        if (r.chance(0.15)) terms = [M(6, { a: 2, b: 1 }), M(4, { a: 1, b: 2 }), M(-1, { a: 2, b: 1 }), M(-9, { a: 1, b: 2 }), M(2, { a: 1, b: 1 })];
        return likePart(terms, { wrong: [{ is: P.add(M(a - c + b - d, { a: 2, b: 1 }), M(e, { a: 1, b: 1 })), code: 'unlike-combined', hint: t('a^{2}b') + ' and ' + t('ab^{2}') + ' are <b>unlike</b> terms. Keep them in separate groups.' }] });
      } },
      { id: 'e2c', level: 'EMG', make: function (r) {
        var a = r.int(2, 5), b = r.int(6, 9), c = r.int(3, 6), d = r.int(1, 3), e = r.int(1, 3), f = r.int(4, 8);
        var terms = [M(a, { m: 1, n: 1 }), M(-c, { m: 1 }), M(e, { n: 1 }), M(-b, { m: 1, n: 1 }), M(d, { m: 1 }), M(-f, { n: 1 })];
        if (r.chance(0.15)) terms = [M(3, { m: 1, n: 1 }), M(-5, { m: 1 }), M(2, { n: 1 }), M(-8, { m: 1, n: 1 }), M(1, { m: 1 }), M(-7, { n: 1 })];
        return likePart(terms, { wrong: [{ is: P.add(M(cf(S(terms), { m: 1, n: 1 }), { m: 1, n: 1 }), M(cf(S(terms), { m: 1 }) + cf(S(terms), { n: 1 }), { m: 1, n: 1 })), code: 'unlike-combined', hint: t('m') + ', ' + t('n') + ' and ' + t('mn') + ' are three different groups.' }] });
      } },
      { id: 'e2d', level: 'EMG', make: function (r) {
        var a = r.int(2, 6), b = r.int(2, 9), c = r.int(1, 3), d = r.int(a + 1, a + 6), e = r.int(c + 1, 5);
        var terms = [M(-a, { x: 2 }), M(b, { x: 1, y: 1 }), M(-c, { y: 2 }), M(d, { x: 2 }), M(-b, { x: 1, y: 1 }), M(e, { y: 2 })];
        if (r.chance(0.15)) terms = [M(-4, { x: 2 }), M(7, { x: 1, y: 1 }), M(-1, { y: 2 }), M(9, { x: 2 }), M(-7, { x: 1, y: 1 }), M(3, { y: 2 })];
        return likePart(terms, { hints: ['Sort the terms into three groups: ' + t('x^{2}') + ', ' + t('xy') + ' and ' + t('y^{2}') + '.', 'If a group adds to ' + t('0') + ', it disappears from the answer.'] });
      } }] },
    { num: '3', stem: 'For each polynomial, state the degree of <b>each term</b>, the degree of the <b>whole polynomial</b>, and its name (monomial, binomial, trinomial, or polynomial). The degree of a term is the <b>sum</b> of its exponents.', parts: [
      { id: 'e3a', level: 'EMG', make: function (r) { var p = r.int(1, 2), q = r.int(2, 3), d = r.pick([3, 4].filter(function (v) { return v !== p + q; })); if (r.chance(0.15)) { p = 2; q = 3; d = 4; } return twoVarPart([M(r.int(2, 9), { x: p, y: q }), M(-r.int(2, 6), { x: d }), T(r.int(2, 9))]); } },
      { id: 'e3b', level: 'EMG', make: function (r) { var p = r.pick([[2, 2], [1, 3], [3, 1]]), e = r.pick([3, 2]); return twoVarPart([M(-r.int(2, 6), { a: p[0], b: p[1] }), M(1, { a: 1, b: 1 }), M(-r.int(2, 9), { a: e === 2 ? 3 : e })]); } },
      { id: 'e3c', level: 'BEG', make: function (r) { var a = r.int(2, 3), b = r.int(3, 5), n = r.int(a + b - 2, a + b - 1); return twoVarPart([M(r.int(2, 9), { m: n }), M(-1, { m: a, n: b })]); } },
      { id: 'e3d', level: 'EMG', make: function (r) { var a = r.int(2, 3), b = r.int(2, 9), c = r.int(2, 6); return twoVarPart([M(1, { x: a, y: 1 }), M(-b, { x: 1, y: 1 }), M(c, { y: 2 }), M(-1, { x: 1 })]); } }] },
    { num: '4', stem: 'State whether each pair is a pair of like terms. If not, choose exactly what differs.', parts: [
      { id: 'e4', level: 'EMG', make: function (r) {
        var a = r.int(2, 9), b = r.int(2, 9), k = r.int(2, 9), m = r.int(2, 9), c = r.int(2, 9), L = r.pick([['a', 'b'], ['p', 'q'], ['m', 'n']]);
        var rows = [{ tex: a + 'x^{2}y,\\ -' + b + 'x^{2}y', w: 'like', why: 'Both are ' + t('x^{2}y') + '; only the coefficients differ.' },
          { tex: k + L[0] + L[1] + ',\\ ' + k + L[1] + L[0], w: 'like', why: t(L[0] + L[1]) + ' and ' + t(L[1] + L[0]) + ' are the same product — the order of the letters doesn’t matter.' },
          { tex: m + 'x^{2}y,\\ ' + m + 'xy^{2}', w: 'exp', why: t('x') + ' has exponent ' + t('2') + ' in one and ' + t('1') + ' in the other (and ' + t('y') + ' the other way round). Equal coefficients don’t make terms like.' },
          { tex: '-' + c + 'mn,\\ ' + r.int(2, 9) + 'mn^{2}', w: 'exp', why: t('n') + ' has exponent ' + t('1') + ' in one and ' + t('2') + ' in the other.' }];
        return likeGrid(rows, 'like pairs, two variables');
      } }] },
    { num: '5', section: 'Extra practice B — Three Polynomials, Nested Brackets, and the Minus Sign', stem: 'Simplify. Each expression contains <b>three</b> polynomials: change the sign of every term in each bracket that follows a minus.', parts: [
      { id: 'e5a', level: 'EMG', make: function (r) {
        var A = [T(r.int(2, 6), 'x', 2), T(-r.int(2, 5), 'x', 1), T(r.int(2, 9))], Bq = [T(r.int(1, 4), 'x', 2), T(r.int(2, 6), 'x', 1), T(-r.int(1, 4))], C = [T(1, 'x', 2), T(-r.int(1, 4), 'x', 1), T(r.int(2, 9))], g = 0;
        while (g++ < 50 && P.count(P.sub(P.add(S(A), S(Bq)), S(C))) < 3) C[2] = T(r.int(2, 9));
        if (r.chance(0.15)) { A = [T(4, 'x', 2), T(-3, 'x', 1), T(7)]; Bq = [T(2, 'x', 2), T(5, 'x', 1), T(-1)]; C = [T(1, 'x', 2), T(-2, 'x', 1), T(9)]; }
        return addSub(null, [{ s: 1, a: A }, { s: 1, a: Bq }, { s: -1, a: C }]);
      } },
      { id: 'e5b', level: 'PRG', make: function (r) {
        var a = r.int(5, 8), c = r.int(1, 2), e = r.int(1, a - c - 1), b = r.int(1, 3), d = r.int(2, 5), f = b + d, k = r.int(5, 9), m = r.int(1, k - 2), n = k - m;
        var A = [T(a, 'y', 2), T(b, 'y', 1), T(-k)], Bq = [T(c, 'y', 2), T(-d, 'y', 1), T(m)], C = [T(e, 'y', 2), T(f, 'y', 1), T(-n)];
        if (r.chance(0.15)) { A = [T(6, 'y', 2), T(1, 'y', 1), T(-8)]; Bq = [T(3, 'y', 2), T(-4, 'y', 1), T(2)]; C = [T(1, 'y', 2), T(5, 'y', 1), T(-10)]; }
        return addSub(null, [{ s: 1, a: A }, { s: -1, a: Bq }, { s: -1, a: C }], { hints: ['Change the signs of every term in <b>both</b> subtracted brackets, then collect.', 'Some groups may add to ' + t('0') + ' and disappear.'] });
      } },
      { id: 'e5c', level: 'PRG', make: function (r) {
        var b = r.int(2, 6), a = r.int(2, 5), c = a - 1, d = r.int(1, 4), k = r.int(3, 9), q = r.int(1, 3);
        // (x² + bx) − (ax² − dx + k) + ((a − 1)x² − (b + d)x − q): every variable term cancels
        var A = [T(1, 'x', 2), T(b, 'x', 1)], Bq = [T(a, 'x', 2), T(-d, 'x', 1), T(k)], C = [T(c, 'x', 2), T(-(b + d), 'x', 1), T(-q)];
        if (r.chance(0.15)) { A = [T(1, 'x', 2), T(2, 'x', 1)]; Bq = [T(3, 'x', 2), T(-1, 'x', 1), T(5)]; C = [T(2, 'x', 2), T(-3, 'x', 1), T(-4)]; }
        return addSub(null, [{ s: 1, a: A }, { s: -1, a: Bq }, { s: 1, a: C }], { hints: ['Change the signs in the bracket after the minus only; the last bracket is added.', 'Collect each group. Everything with a variable may cancel!'] });
      } }] },
    { num: '6', stem: 'Simplify. Remove the <b>inner</b> brackets first, collect what you can, and only then deal with the outer bracket.', parts: [
      { id: 'e6a', level: 'PRG', make: function (r) {
        var A = [T(r.int(2, 5), 'x', 2), T(-r.int(1, 3), 'x', 1), T(r.int(2, 6))], p = r.int(1, 2), q = r.int(1, 4), k = r.int(2, 9), s = r.int(1, 3);
        if (r.chance(0.15)) { A = [T(3, 'x', 2), T(-1, 'x', 1), T(4)]; p = 1; q = 2; k = 5; s = 1; }
        var Bq = [T(p, 'x', 2), T(q, 'x', 1)], C = [T(k), T(-s, 'x', 1)], inner = P.sub(S(Bq), S(C)), ans = P.sub(S(A), inner);
        var prompt = t('(' + W(A) + ')-\\left[(' + W(Bq) + ')-(' + W(C) + ')\\right]');
        return pp(prompt, ans, { text: 'nested brackets', wrong: [{ is: P.sub(P.sub(S(A), S(Bq)), S(C)), code: 'inner-sign', hint: 'The minus in front of the square bracket reaches everything inside it. Simplify the inner bracket <b>first</b>: ' + t('(' + W(Bq) + ')-(' + W(C) + ')') + '.' }, { is: P.add(S(A), P.neg(Bq[0]), P.neg(Bq[1]), S(C)), code: 'sub-first', hint: 'Simplify the inner bracket first: ' + t('-(' + W(C) + ')') + ' changes the signs inside it. Then the minus in front of the square bracket changes <b>every</b> sign of the result.' }],
          sol: 'Inner bracket first: ' + t('(' + W(Bq) + ')-(' + W(C) + ')=' + W(Bq.concat(NEG(C))) + '=' + tx(inner)) + '.<br>Then subtract it, changing every sign: ' + t('(' + W(A) + ')-(' + tx(inner) + ')=' + W(A.concat(NEG(termsOf(inner)))) + '=' + tx(ans)) + '.', hints: ['Simplify the inner bracket ' + t('[\\ \\ ]') + ' first.', 'Then subtract that result: the minus changes the sign of every one of its terms.'] });
      } },
      { id: 'e6b', level: 'PRG', make: function (r) {
        var p = r.int(3, 6), q = r.int(1, 3), rr = r.int(q + 1, q + 3), s = r.int(2, 9), u = r.int(1, 6);
        if (r.chance(0.15)) { p = 5; q = 2; rr = 3; s = 7; u = 4; }
        var inner = P.sub(T(q, 'a', 1), S([T(rr, 'a', 1), T(-s)])), ans = P.add(T(p, 'a', 1), P.neg(inner), T(u));
        var prompt = t(p + 'a-\\left[' + tx(T(q, 'a', 1)) + '-(' + W([T(rr, 'a', 1), T(-s)]) + ')\\right]+' + u);
        return pp(prompt, ans, { text: 'nested a', wrong: [{ is: P.add(T(p, 'a', 1), T(-q, 'a', 1), P.neg(S([T(rr, 'a', 1), T(-s)])), T(u)), code: 'inner-sign', hint: 'The minus in front of the square bracket changes the sign of <b>everything</b> inside it, including the inner bracket. Simplify inside the square bracket first.' }],
          sol: 'Inside the square bracket: ' + t(tx(T(q, 'a', 1)) + '-(' + W([T(rr, 'a', 1), T(-s)]) + ')=' + W([T(q, 'a', 1), T(-rr, 'a', 1), T(s)]) + '=' + tx(inner)) + '.<br>Then ' + t(p + 'a-(' + tx(inner) + ')+' + u + '=' + W([T(p, 'a', 1)].concat(NEG(termsOf(inner)), [T(u)])) + '=' + tx(ans)) + '.', hints: ['Work from the inside out: simplify ' + t(tx(T(q, 'a', 1)) + '-(' + W([T(rr, 'a', 1), T(-s)]) + ')') + ' first.'] });
      } },
      { id: 'e6c', level: 'ADV', make: function (r) {
        var g = r.int(1, 2), c = r.int(1, 2), a = g + c, h = r.int(1, 2), e = r.int(2, 5), b = e + h, d = r.int(2, 6), f = r.int(2, 7);
        if (r.chance(0.15)) { a = 2; c = 1; g = 1; b = 5; d = 3; e = 4; f = 6; h = 1; }
        var X = [T(a, 'x', 2), T(b, 'x', 1)], Y = [T(c, 'x', 2), T(-d)], U = [T(e, 'x', 1), T(-f)], V = [T(g, 'x', 2), T(h, 'x', 1)];
        var one = P.sub(S(X), S(Y)), two = P.add(S(U), S(V)), ans = P.sub(one, two);
        var prompt = t('\\left[(' + W(X) + ')-(' + W(Y) + ')\\right]-\\left[(' + W(U) + ')+(' + W(V) + ')\\right]');
        return pp(prompt, ans, { text: 'two square brackets', wrong: [{ is: P.add(one, P.neg(U[0]), U[1], S(V)), code: 'sub-first', hint: 'The minus in front of the second square bracket reaches <b>every</b> term inside it — work the bracket out first, then change all its signs.' }, { is: P.add(one, two), code: 'no-change', hint: 'The second square bracket is <b>subtracted</b>: change the sign of every term in it.' }],
          sol: 'First square bracket: ' + t(W(X.concat(NEG(Y))) + '=' + tx(one)) + '.<br>Second square bracket: ' + t(W(U.concat(V)) + '=' + tx(two)) + '.<br>' + t('(' + tx(one) + ')-(' + tx(two) + ')=' + W(termsOf(one).concat(NEG(termsOf(two)))) + '=' + tx(ans)) + ' — every variable term cancels.', hints: ['Simplify each square bracket on its own first.', 'Then subtract the second result from the first, changing every sign of the second.'] });
      } }] },
    { num: '7', stem: 'Simplify. A minus sign sits in front of a bracket — in some parts, in front of the <b>very first</b> bracket.', parts: [
      { id: 'e7a', level: 'EMG', make: function (r) {
        var A = [T(r.int(3, 6), 'x', 2), T(-r.int(4, 9), 'x', 1), T(r.int(1, 5))], Bq = [T(r.int(1, 2), 'x', 2), T(-r.int(1, 3), 'x', 1)];
        if (r.chance(0.15)) { A = [T(4, 'x', 2), T(-7, 'x', 1), T(2)]; Bq = [T(1, 'x', 2), T(-3, 'x', 1)]; }
        return addSub(null, [{ s: -1, a: A }, { s: 1, a: Bq }], { hints: ['The minus in front of the first bracket changes the sign of every term inside it.', 'The second bracket is added: its signs stay.'] });
      } },
      { id: 'e7b', level: 'EMG', make: function (r) {
        var m = function (c, e) { return T(c, 'm', e); }, A = [m(r.int(2, 5), 2), m(-r.int(2, 6), 1)], Bq = [m(-r.int(1, 4), 2), m(r.int(1, 3), 1), T(-r.int(2, 9))];
        if (r.chance(0.15)) { A = [m(2, 2), m(-5, 1)]; Bq = [m(-3, 2), m(1, 1), T(-8)]; }
        return addSub(null, [{ s: 1, a: A }, { s: -1, a: Bq }]);
      } },
      { id: 'e7c', level: 'EMG', make: function (r) {
        var a = r.int(1, 3), b = r.int(2, 7), c = r.int(2, 6), A = [T(a === 1 ? 1 : a, 'x', 2), T(b, 'x', 1), T(-c)], Bq = [T(r.int(2, 4), 'x', 2), T(-b, 'x', 1), T(c)];
        if (r.chance(0.15)) { A = [T(1, 'x', 2), T(6, 'x', 1), T(-4)]; Bq = [T(3, 'x', 2), T(-6, 'x', 1), T(4)]; }
        return addSub(null, [{ s: -1, a: A }, { s: -1, a: Bq }], { hints: ['Both brackets are subtracted: change every sign in both.', 'Some groups may cancel to ' + t('0') + '.'] });
      } },
      { id: 'e7d', level: 'EMG', make: function (r) {
        var k = r.int(3, 12), A = [T(r.int(2, 7), 'x', 2), T(-r.int(1, 5), 'x', 1), T(k)];
        if (r.chance(0.15)) { k = 8; A = [T(5, 'x', 2), T(-2, 'x', 1), T(8)]; }
        return addSub(t(k + '-(' + W(A) + ')'), [{ s: 1, a: [T(k)] }, { s: -1, a: A }], { hints: ['Change the sign of every term in the bracket.', 'Then collect: the constants may cancel.'] });
      } }] },
    { num: '8', stem: 'Simplify each expression, then classify the <b>answer</b> by its degree and by its number of terms. Don’t classify before you simplify — the degree can drop.', parts: [
      { id: 'e8a', level: 'PRG', make: function (r) { var a = r.int(2, 5), b = r.int(1, 3), c = r.int(1, 2), d = r.int(2, 6); return classPart([T(a, 'x', 4), T(b, 'x', 2), T(-1, 'x', 1)], -1, [T(a, 'x', 4), T(-c, 'x', 2), T(d)]); } },
      { id: 'e8b', level: 'PRG', make: function (r) { var b = r.int(2, 6), k = r.int(2, 9); return classPart([T(1, 'x', 3), T(b, 'x', 2)], -1, [T(1, 'x', 3), T(b, 'x', 2), T(-k, 'x', 1)]); } },
      { id: 'e8c', level: 'EMG', make: function (r) { var a = r.int(2, 5), b = r.int(2, 6), c = r.int(1, 6); return classPart([M(a, { x: 2, y: 1 }), M(b, { x: 1, y: 1 })], 1, [M(c, { x: 1, y: 1 }), M(-a, { x: 2, y: 1 })]); } },
      { id: 'e8d', level: 'PRG', make: function (r) { var a = r.int(2, 7), b = r.int(1, 3), k = r.int(2, 9); return classPart([T(a, 'x', 5), T(-b, 'x', 3), T(k)], -1, [T(a, 'x', 5), T(-b, 'x', 3)]); } }] },
    { num: '9', section: 'Extra practice C — Working Backwards and Finding the Error', stem: function (sh) { return 'A student simplified ' + t(bracketsTex([{ s: 1, a: sh.A }, { s: -1, a: sh.B }])) + ' like this:\\[' + W(sh.A.concat([P.neg(sh.B[0]), sh.B[1], sh.B[2]])) + '=' + tx(sh.stu) + '\\]'; },
      shared: function (r) {
        var A, Bq, sh, g = 0;
        do {
          A = [T(r.int(4, 8), 'x', 2), T(-r.int(1, 5), 'x', 1), T(r.int(3, 9))]; Bq = [T(r.int(1, 3), 'x', 2), T(-r.int(2, 7), 'x', 1), T(r.int(1, 5))]; sh = errShared(r, A, Bq); g++;
        } while (g < 100 && (P.count(sh.ans) < 3 || P.count(sh.stu) < 3));
        if (r.chance(0.15)) sh = errShared(r, [T(7, 'x', 2), T(-2, 'x', 1), T(9)], [T(3, 'x', 2), T(-5, 'x', 1), T(4)]);
        return sh;
      },
      parts: [
        { id: 'e9a', level: 'EMG', make: function (r, sh) {
          return KP.mc(r, 'Which terms of the second bracket did the student fail to change?', [
            { html: t(tx(sh.B[1])) + ' and ' + t(tx(sh.B[2])), right: true },
            { html: 'only ' + t(tx(sh.B[0])), why: 'The student did change ' + t(tx(sh.B[0])) + ' to ' + t(tx(P.neg(sh.B[0]))) + '. Look at the other two terms.' },
            { html: 'only ' + t(tx(sh.B[2])), why: 'Compare ' + t(tx(sh.B[1])) + ' in the bracket with what the student wrote after removing the bracket.' },
            { html: 'none — every sign was changed', why: 'Compare the second bracket with the student’s line term by term.' }],
            'The student wrote ' + t(W([P.neg(sh.B[0]), sh.B[1], sh.B[2]])) + ' for ' + t('-(' + W(sh.B) + ')') + ': only ' + t(tx(sh.B[0])) + ' was changed, so ' + t(tx(sh.B[1])) + ' and ' + t(tx(sh.B[2])) + ' were left alone.', ['The minus sign should change <b>every</b> term. Which ones still have their original sign?'], 'which terms unchanged');
        } },
        { id: 'e9b', level: 'EMG', make: function (r, sh) { return errFix(sh, 'Rewrite the subtraction correctly and give the correct simplified answer.'); } },
        { id: 'e9c', level: 'EMG', make: function (r, sh) {
          var a1 = P.at(S(sh.A), { x: 1 }), b1 = P.at(S(sh.B), { x: 1 }), o = a1 - b1, s = P.at(sh.stu, { x: 1 });
          var fl = [{ name: 'Original', label: 'Original at ' + t('x=1') }, { name: 'Student', label: 'Student’s answer at ' + t('x=1') }];
          return KP.fields('Substitute ' + t('x=1') + ' into the original expression and into the student’s answer.', fl, [K.number(o, function (v) { return v === a1 + b1 ? { code: 'no-change', hint: 'Work out each bracket at ' + t('x=1') + ', then <b>subtract</b>: ' + t('(' + a1 + ')-(' + b1 + ')') + '.' } : null; }), K.number(s)], [String(o), String(s)], t(o) + ' and ' + t(s),
            'Original: ' + t('(' + a1 + ')-(' + b1 + ')=' + o) + '. Student: ' + t(tx(sh.stu) + '\\to ' + s) + '. They are not equal, so the student’s answer is wrong. (The correct answer ' + t(tx(sh.ans)) + ' gives ' + t(P.at(sh.ans, { x: 1 })) + '.)', ['At ' + t('x=1') + ' every power of ' + t('x') + ' is ' + t('1') + ': just add up the coefficients, with their signs.'], 'check at x=1');
        } }] },
    { num: '10', stem: 'Find the missing polynomial that makes each statement true. (Check by substituting it back in.)', parts: [
      { id: 'e10a', level: 'PRG', make: function (r) {
        var A = [T(r.int(1, 4), 'x', 2), T(r.int(2, 6), 'x', 1), T(-r.int(1, 5))], R = [T(r.int(5, 8), 'x', 2), T(-r.int(1, 3), 'x', 1)];
        if (r.chance(0.15)) { A = [T(2, 'x', 2), T(5, 'x', 1), T(-3)]; R = [T(5, 'x', 2), T(-1, 'x', 1)]; }
        var ans = P.sub(S(R), S(A));
        return pp(t('(' + W(A) + ')+\\square=' + W(R)), ans, { text: 'A + ? = R', wrong: [{ is: P.sub(S(A), S(R)), code: 'u3l1-reversed', hint: 'Check: ' + t('(' + W(A) + ')+(\\text{your answer})') + ' should give ' + t(W(R)) + '. The missing piece is (result) − (start).' }, { is: P.add(S(A), S(R)), code: 'u3l1-inverse', hint: 'To undo adding ' + t('(' + W(A) + ')') + ', <b>subtract</b> it from the result.' }],
          sol: t('\\square=(' + W(R) + ')-(' + W(A) + ')=' + W(R.concat(NEG(A))) + '=' + tx(ans)) + '.<br>Check: ' + t('(' + W(A) + ')+(' + tx(ans) + ')=' + W(R)) + ' ✓', hints: ['If ' + t('A+\\square=R') + ', then ' + t('\\square=R-A') + '.'] });
      } },
      { id: 'e10b', level: 'ADV', make: function (r) {
        var Bq = [T(1, 'x', 2), T(-r.int(2, 6), 'x', 1), T(r.int(3, 9))], R = [T(r.int(2, 4), 'x', 2), T(r.int(1, 3), 'x', 1), T(-r.int(1, 3))];
        if (r.chance(0.15)) { Bq = [T(1, 'x', 2), T(-4, 'x', 1), T(7)]; R = [T(2, 'x', 2), T(1, 'x', 1), T(-1)]; }
        var ans = P.add(S(R), S(Bq));
        return pp(t('\\square-(' + W(Bq) + ')=' + W(R)), ans, { text: '? − B = R', wrong: [{ is: P.sub(S(R), S(Bq)), code: 'u3l1-inverse', hint: 'To undo <b>subtracting</b> ' + t('(' + W(Bq) + ')') + ', <b>add</b> it back to the result.' }, { is: P.sub(S(Bq), S(R)), code: 'u3l1-reversed', hint: 'Check by substituting your answer back in. Undo the subtraction by adding ' + t('(' + W(Bq) + ')') + ' to the result.' }],
          sol: 'Undo the subtraction by adding: ' + t('\\square=(' + W(R) + ')+(' + W(Bq) + ')=' + tx(ans)) + '.<br>Check: ' + t('(' + tx(ans) + ')-(' + W(Bq) + ')=' + W(termsOf(ans).concat(NEG(Bq))) + '=' + W(R)) + ' ✓', hints: ['If ' + t('\\square-B=R') + ', then ' + t('\\square=R+B') + '.'] });
      } },
      { id: 'e10c', level: 'ADV', make: function (r) {
        var A = [T(r.int(3, 6), 'a', 2), T(-r.int(1, 3), 'a', 1), T(r.int(2, 9))], R = [T(r.int(1, 2), 'a', 2), T(r.int(1, 5), 'a', 1)];
        if (r.chance(0.15)) { A = [T(4, 'a', 2), T(-1, 'a', 1), T(6)]; R = [T(1, 'a', 2), T(3, 'a', 1)]; }
        var ans = P.sub(S(A), S(R));
        return pp(t('(' + W(A) + ')-\\square=' + W(R)), ans, { text: 'A − ? = R', wrong: [{ is: P.sub(S(R), S(A)), code: 'u3l1-reversed', hint: 'The missing polynomial is what is taken <b>away</b> from ' + t('(' + W(A) + ')') + ': ' + t('\\square=A-R') + ', not ' + t('R-A') + '.' }, { is: P.add(S(A), S(R)), code: 'u3l1-inverse', hint: 'Check: ' + t('A-\\square') + ' must give ' + t(W(R)) + '. The missing piece is ' + t('A-R') + '.' }],
          sol: 'What is taken away is the difference: ' + t('\\square=(' + W(A) + ')-(' + W(R) + ')=' + W(A.concat(NEG(R))) + '=' + tx(ans)) + '.<br>Check: ' + t('(' + W(A) + ')-(' + tx(ans) + ')=' + W(R)) + ' ✓', hints: ['If ' + t('A-\\square=R') + ', then ' + t('\\square=A-R') + '.'] });
      } }] },
    { num: '11', stem: 'Working backwards with words.', parts: [
      { id: 'e11a', level: 'PRG', make: function (r) {
        var A = [T(r.int(2, 5), 'x', 2), T(-r.int(3, 9), 'x', 1), T(r.int(1, 4))], Bq = [T(1, 'x', 2), T(r.int(2, 6))];
        if (r.chance(0.15)) { A = [T(3, 'x', 2), T(-8, 'x', 1), T(2)]; Bq = [T(1, 'x', 2), T(4)]; }
        var ans = P.sub(S(Bq), S(A));
        return pp('What must be <b>added to</b> ' + t(W(A)) + ' to give ' + t(W(Bq)) + '?', ans, { text: 'what must be added', wrong: [{ is: P.sub(S(A), S(Bq)), code: 'u3l1-reversed', hint: 'Check: ' + t('(' + W(A) + ')+(\\text{your answer})') + ' should give ' + t(W(Bq)) + '. You need target − start.' }, { is: P.add(S(A), S(Bq)), code: 'u3l1-inverse', hint: 'The missing piece is the <b>difference</b>: target − start.' }],
          sol: 'Missing = target − start: ' + t('(' + W(Bq) + ')-(' + W(A) + ')=' + W(Bq.concat(NEG(A))) + '=' + tx(ans)) + '.<br>Check: ' + t('(' + W(A) + ')+(' + tx(ans) + ')=' + W(Bq)) + ' ✓', hints: ['If ' + t('A+?=B') + ', then ' + t('?=B-A') + '.'] });
      } },
      { id: 'e11b', level: 'ADV', make: function (r) {
        var y = function (c, e) { return T(c, 'y', e); }, A = [y(r.int(4, 8), 2), y(r.int(1, 3), 1), T(-r.int(2, 9))], R = [y(r.int(1, 3), 2), y(-r.int(1, 5), 1)];
        if (r.chance(0.15)) { A = [y(6, 2), y(1, 1), T(-5)]; R = [y(2, 2), y(-3, 1)]; }
        var ans = P.sub(S(A), S(R));
        return pp('What must be <b>subtracted from</b> ' + t(W(A)) + ' to give ' + t(W(R)) + '?', ans, { text: 'what must be subtracted', wrong: [{ is: P.sub(S(R), S(A)), code: 'u3l1-reversed', hint: 'Check: ' + t('(' + W(A) + ')-(\\text{your answer})') + ' should give ' + t(W(R)) + '. What is taken away is (start) − (result).' }, { is: P.add(S(A), S(R)), code: 'u3l1-inverse', hint: 'What is taken away is the <b>difference</b> (start) − (result).' }],
          sol: 'What is taken away = start − result: ' + t('(' + W(A) + ')-(' + W(R) + ')=' + W(A.concat(NEG(R))) + '=' + tx(ans)) + '.<br>Check: ' + t('(' + W(A) + ')-(' + tx(ans) + ')=' + W(R)) + ' ✓', hints: ['If ' + t('A-?=R') + ', then ' + t('?=A-R') + '.'] });
      } },
      { id: 'e11c', level: 'PRG', make: function (r) {
        return KP.mc(r, 'In part (b), why is the answer <b>not</b> simply (result) − (start), the difference taken the other way around?', [
          { html: 'The missing polynomial is what is taken <b>away</b> from the start, so it is (start) − (result). The other way around gives its <b>opposite</b>: every sign changes.', right: true },
          { html: 'It is the same answer either way, because subtraction can be done in any order.', why: 'Try it with numbers: ' + t('10-?=4') + ' gives ' + t('?=6') + ', but ' + t('4-10=-6') + '. Order matters in subtraction.' },
          { html: 'Because you always subtract the smaller polynomial from the larger one.', why: 'Polynomials aren’t “larger” or “smaller”. The order comes from what the question says is taken away.' },
          { html: 'Because subtracting means adding the two polynomials.', why: 'Subtracting means adding the <b>opposite</b>, not adding. Think about ' + t('10-?=4') + '.' }],
          'Like ' + t('10-?=4') + ' (where ' + t('?=10-4=6') + ', not ' + t('4-10=-6') + '), the missing piece is (start) − (result). Reversing the subtraction gives the opposite polynomial, with every sign changed.', ['Try the same question with numbers: what must be subtracted from ' + t('10') + ' to give ' + t('4') + '?'], 'why order matters');
      } }] },
    { num: '12', section: 'Mastery challenge', stem: 'Determine the missing coefficients.', parts: [
      { id: 'e12a', level: 'MAS', make: function (r) {
        var q = r.int(1, 4), rr = r.int(1, 4), p = r.int(1, 6), s = -r.int(1, 6), a = q + rr, b = p - s;
        if (r.chance(0.15)) { q = 2; rr = 1; p = 3; s = -5; a = 3; b = 8; }
        var e = t('(ax^{2}+' + p + 'x)-(' + (q === 1 ? '' : q) + 'x^{2}+bx)=' + W([T(rr, 'x', 2), T(s, 'x', 1)]));
        return KP.fields('Find ' + t('a') + ' and ' + t('b') + ' so that ' + e + '.', [coefBox('a'), coefBox('b')],
          [K.number(a, function (v) { return v === rr - q ? { code: 'u3l1-ab-sign', hint: 'The ' + t('x^{2}') + '-terms give ' + t('a-' + q + '=' + rr) + ': to undo subtracting ' + t(q) + ', <b>add</b> ' + t(q) + '.' } : v === rr ? { code: 'u3l1-inverse', hint: 'Collect the ' + t('x^{2}') + '-terms first: ' + t('a-' + q) + ' must equal ' + t(rr) + '.' } : null; }),
            K.number(b, function (v) { return v === -b ? { code: 'u3l1-ab-sign', hint: 'Check the sign: the ' + t('x') + '-terms give ' + t(p + '-b=' + s) + ', so ' + t('b=' + p + '-(' + s + ')') + '.' } : v === p + s ? { code: 'u3l1-inverse', hint: t(p + '-b=' + s) + ' — what must be taken away from ' + t(p) + ' to leave ' + t(s) + '?' } : null; })],
          [String(a), String(b)], t('a=' + a) + ', ' + t('b=' + b),
          'Collect like terms on the left: ' + t('(a-' + q + ')x^{2}+(' + p + '-b)x') + '.<br>' + t('x^{2}') + ': ' + t('a-' + q + '=' + rr) + ', so ' + t('a=' + a) + '.<br>' + t('x') + ': ' + t(p + '-b=' + s) + ', so ' + t('b=' + p + '-(' + s + ')=' + b) + '.<br>Check: ' + t('(' + a + 'x^{2}+' + p + 'x)-(' + (q === 1 ? '' : q) + 'x^{2}+' + b + 'x)=' + W([T(rr, 'x', 2), T(s, 'x', 1)])) + ' ✓',
          ['Collect the ' + t('x^{2}') + '-terms on the left and match them with the right side; then do the same for the ' + t('x') + '-terms.', 'Each match is a small equation, e.g. ' + t('a-2=1') + '.'], 'find a and b');
      } },
      { id: 'e12b', level: 'MAS', make: function (r) {
        var Pp = r.int(2, 6), R = Pp + r.int(1, 4), S1 = r.int(-3, 4), Q = r.int(1, 4), Kk = r.int(3, 9), Tt = r.int(1, Kk - 1);
        if (r.chance(0.15)) { Pp = 5; R = 8; S1 = 1; Q = 2; Kk = 7; Tt = 3; }
        var a = S1 + Q, b = R - Pp, c = Kk - Tt;
        if (a === 0) { S1 += 1; a = S1 + Q; }
        var rhs = W([T(R, 'x', 2), T(S1, 'x', 1), T(-Tt)]);
        return KP.fields('Find ' + t('a') + ', ' + t('b') + ' and ' + t('c') + ' so that ' + t('(' + Pp + 'x^{2}+ax-' + Kk + ')+(bx^{2}-' + (Q === 1 ? '' : Q) + 'x+c)=' + rhs) + '.', [coefBox('a'), coefBox('b'), coefBox('c')],
          [K.number(a, function (v) { return v === S1 - Q ? { code: 'u3l1-ab-sign', hint: 'The ' + t('x') + '-terms give ' + t('a-' + Q + '=' + S1) + ', so add ' + t(Q) + ' to both sides.' } : null; }),
            K.number(b, function (v) { return v === R + Pp ? { code: 'u3l1-inverse', hint: t(Pp + '+b=' + R) + ': what must be added to ' + t(Pp) + ' to make ' + t(R) + '?' } : null; }),
            K.number(c, function (v) { return v === -c || v === Kk + Tt ? { code: 'u3l1-ab-sign', hint: 'The constants give ' + t('-' + Kk + '+c=-' + Tt) + ', so ' + t('c=-' + Tt + '+' + Kk) + '.' } : null; })],
          [String(a), String(b), String(c)], t('a=' + a + ',\\ b=' + b + ',\\ c=' + c),
          'Collect like terms on the left: ' + t('(' + Pp + '+b)x^{2}+(a-' + Q + ')x+(c-' + Kk + ')') + '.<br>' + t('x^{2}') + ': ' + t(Pp + '+b=' + R) + ', so ' + t('b=' + b) + '.&nbsp; ' + t('x') + ': ' + t('a-' + Q + '=' + S1) + ', so ' + t('a=' + a) + '.&nbsp; Constants: ' + t('c-' + Kk + '=-' + Tt) + ', so ' + t('c=' + c) + '.',
          ['Match the like terms on both sides: ' + t('x^{2}') + '-terms, ' + t('x') + '-terms, constants.', 'Each match is a one-step equation.'], 'find a, b and c');
      } }] },
    { num: '13', section: 'Extra practice D — Applications, Checking, and Reasoning', stem: function (sh) { return 'The quadrilateral below has its four side lengths given in centimetres.<div class="fig">' + quadSvg(sh.s.map(function (q) { return plain(W(q)); })) + '</div>'; },
      shared: function (r) {
        var s, per, v, vals, g = 0;
        do {
          s = [[T(r.int(1, 3), 'x', 2), T(r.int(1, 4), 'x', 1), T(-r.int(1, 3))], [T(1, 'x', 2), T(-r.int(1, 2), 'x', 1), T(r.int(2, 6))], [T(r.int(2, 4), 'x', 1), T(r.int(1, 5))], [T(r.int(1, 2), 'x', 2), T(-r.int(2, 6))]];
          per = P.add(S(s[0]), S(s[1]), S(s[2]), S(s[3])); v = r.pick([2, 3, 3]); g++;
          vals = s.map(function (q) { return P.at(S(q), { x: v }); });
        } while (g < 200 && (P.count(per) < 2 || vals.some(function (a) { return a <= 0 || 2 * a >= vals[0] + vals[1] + vals[2] + vals[3]; })));
        if (r.chance(0.15)) { s = [[T(2, 'x', 2), T(3, 'x', 1), T(-1)], [T(1, 'x', 2), T(-1, 'x', 1), T(4)], [T(3, 'x', 1), T(2)], [T(2, 'x', 2), T(-5)]]; per = P.add(S(s[0]), S(s[1]), S(s[2]), S(s[3])); v = 3; }
        return { s: s, per: per, v: v };
      },
      parts: [
        { id: 'e13a', level: 'EMG', make: function (r, sh) {
          var parts = sh.s.map(function (q) { return { s: 1, a: q }; });
          return addSub('Write and simplify an expression for the perimeter.', parts, { text: 'quadrilateral perimeter', after: t('\\text{ cm}'), lead: 'Perimeter = the sum of the four sides.' });
        } },
        { id: 'e13b', level: 'EMG', make: function (r, sh) {
          var v = sh.v, val = P.at(sh.per, { x: v }), a = cf(sh.per, { x: 2 }), b = cf(sh.per, { x: 1 }), c = P.constant(sh.per)[0];
          return KP.number('Determine the perimeter when ' + t('x=' + v) + '.', val, function (x) { return x === a * 2 * v + b * v + c ? { code: 'u3l1-x2', hint: t('x^{2}') + ' at ' + t('x=' + v) + ' is ' + t(v + '\\times ' + v + '=' + v * v) + ', not ' + t(2 * v) + '.' } : null; },
            'Use the simplified perimeter ' + t(tx(sh.per)) + ' at ' + t('x=' + v) + ': ' + t(tx(sh.per).replace(/x/g, '(' + v + ')') + '=' + val) + ' cm.', ['Substitute into your simplified perimeter from (a). Square first, then multiply.'], 'perimeter at x=' + v, { after: 'cm' });
        } }] },
    { num: '14', stem: function (sh) { return 'A rectangle has a length of ' + t('(' + W(sh.L) + ')') + ' m and a width of ' + t('(' + W(sh.Wd) + ')') + ' m.<div class="fig">' + rectSvg(plain(W(sh.L)), plain(W(sh.Wd))) + '</div>'; },
      shared: function (r) { var p = r.int(2, 4), q = r.int(1, 8), s = r.int(1, 3), v = r.int(s + 2, s + 4); if (r.chance(0.15)) { p = 3; q = 7; s = 2; v = 5; } return { L: [T(p, 'x', 1), T(q)], Wd: [T(1, 'x', 1), T(-s)], p: p, q: q, s: s, v: v }; },
      parts: [
        { id: 'e14a', level: 'EMG', make: function (r, sh) {
          var parts = [sh.L, sh.Wd, sh.L, sh.Wd].map(function (q) { return { s: 1, a: q }; });
          return addSub('By adding all four sides, write and simplify an expression for the perimeter.', parts, { text: 'rectangle perimeter', after: t('\\text{ m}'), lead: 'A rectangle has two lengths and two widths.',
            wrong: [{ is: P.add(S(sh.L), S(sh.Wd)), code: 'u3l1-half', hint: 'That’s one length plus one width. A rectangle has <b>four</b> sides: two lengths and two widths.' }] });
        } },
        { id: 'e14b', level: 'BEG', make: function (r, sh) {
          var per = P.scale(P.add(S(sh.L), S(sh.Wd)), 2), val = P.at(per, { x: sh.v });
          return KP.number('Determine the perimeter when ' + t('x=' + sh.v) + '.', val, function (v) { return v === val / 2 ? { code: 'u3l1-half', hint: 'Use all four sides (your answer from part (a)).' } : null; },
            t(tx(per).replace(/x/g, '(' + sh.v + ')') + '=' + val) + ' m. (Length ' + t(P.at(S(sh.L), { x: sh.v })) + ' m, width ' + t(P.at(S(sh.Wd), { x: sh.v })) + ' m.)', ['Substitute into your perimeter from (a).'], 'perimeter at x=' + sh.v, { after: 'm' });
        } },
        { id: 'e14c', level: 'EMG', make: function (r, sh) {
          var w1 = 1 - sh.s;
          return KP.mc(r, 'Why would ' + t('x=1') + ' not make sense here?', [
            { html: 'The width would be ' + t('1-' + sh.s + '=' + w1) + ' m, and a length can’t be ' + (w1 === 0 ? 'zero' : 'negative') + '.', right: true },
            { html: 'The length would be negative.', why: 'Work it out: the length is ' + t(sh.p + '(1)+' + sh.q + '=' + (sh.p + sh.q)) + ' m. Look at the width.' },
            { html: 'You can’t substitute ' + t('1') + ' into a polynomial.', why: 'You can substitute any number. The problem is what the side lengths turn out to be.' },
            { html: 'The perimeter would be ' + t('0') + '.', why: 'At ' + t('x=1') + ' the perimeter expression gives ' + t(2 * (sh.p + sh.q + 1 - sh.s)) + '. Look at each side instead.' }],
            'At ' + t('x=1') + ' the width is ' + t('1-' + sh.s + '=' + w1) + ' m. A side length must be positive, so ' + t('x=1') + ' is impossible.', ['Substitute ' + t('x=1') + ' into the length and into the width.'], 'why x=1 impossible');
        } }] },
    { num: '15', stem: function (sh) { return '<b>Substitution check.</b> Simplifying doesn’t change the value of an expression, so the original and the simplified form must agree for every value of the variable. Consider ' + t(bracketsTex([{ s: 1, a: sh.A }, { s: -1, a: sh.B }])) + '.'; },
      shared: function (r) {
        var A = [T(r.int(3, 6), 'x', 2), T(-r.int(2, 5), 'x', 1), T(r.int(2, 9))], Bq = [T(r.int(1, 2), 'x', 2), T(r.int(2, 5), 'x', 1), T(-r.int(1, 4))], v = r.pick([-2, -2, -1, -3]);
        if (r.chance(0.15)) { A = [T(5, 'x', 2), T(-3, 'x', 1), T(8)]; Bq = [T(2, 'x', 2), T(4, 'x', 1), T(-1)]; v = -2; }
        return { A: A, B: Bq, ans: P.sub(S(A), S(Bq)), v: v };
      },
      parts: [
        { id: 'e15a', level: 'EMG', make: function (r, sh) { var p = addSub('(a) Simplify.', [{ s: 1, a: sh.A }, { s: -1, a: sh.B }]); return p; } },
        { id: 'e15b', level: 'EMG', make: function (r, sh) {
          var env = { x: sh.v }, a = P.at(S(sh.A), env), b = P.at(S(sh.B), env), o = a - b, flipA = P.at(S(sh.A), { x: -sh.v }), flipB = P.at(S(sh.B), { x: -sh.v });
          var neg = function (want, flip) { return function (v) { return v === flip && flip !== want ? { code: 'neg-sub', hint: 'Substitute the negative in brackets: ' + t('(' + sh.v + ')^{2}=' + sh.v * sh.v) + ' and ' + t('-k(' + sh.v + ')') + ' is positive.' } : null; }; };
          return KP.fields('(b) Evaluate the <b>original</b> expression at ' + t('x=' + sh.v) + ': work out each bracket separately, then subtract.', [{ name: 'First bracket', label: 'First bracket' }, { name: 'Second bracket', label: 'Second bracket' }, { name: 'Original', label: 'First − second' }],
            [K.number(a, neg(a, flipA)), K.number(b, neg(b, flipB)), K.number(o, function (v) { return v === a + b ? { code: 'neg-sub', hint: 'Subtract the second value: ' + t(a + '-(' + b + ')') + '.' } : null; })], [String(a), String(b), String(o)], t(a) + ', ' + t(b) + ', ' + t(o),
            'First: ' + t(W(sh.A).replace(/x/g, '(' + sh.v + ')') + '=' + a) + '.<br>Second: ' + t(W(sh.B).replace(/x/g, '(' + sh.v + ')') + '=' + b) + '.<br>' + t(a + '-(' + b + ')=' + o) + '.', ['Put ' + t('(' + sh.v + ')') + ' in brackets wherever ' + t('x') + ' appears. A negative squared is positive.'], 'original at x=' + sh.v);
        } },
        { id: 'e15c', level: 'EMG', make: function (r, sh) {
          var val = P.at(sh.ans, { x: sh.v });
          return KP.number('(c) Evaluate the simplified answer ' + t(tx(sh.ans)) + ' at ' + t('x=' + sh.v) + '. (It should agree with (b).)', val, function (v) { return v === P.at(sh.ans, { x: -sh.v }) && v !== val ? { code: 'neg-sub', hint: 'Substitute ' + t('(' + sh.v + ')') + ' in brackets: ' + t('-k(' + sh.v + ')') + ' is positive.' } : null; },
            t(tx(sh.ans).replace(/x/g, '(' + sh.v + ')') + '=' + val) + ' — the same as the original, so the simplification checks out.', ['Square first, then multiply, then add.'], 'simplified at x=' + sh.v);
        } },
        { id: 'e15d', level: 'PRG', make: function (r) {
          return KP.mc(r, '(d) If the two values had <b>disagreed</b>, what would that tell you? And what would agreeing at only ' + t('x=0') + ' prove?', [
            { html: 'Disagreeing means a mistake was made in simplifying. Agreeing at one value (such as ' + t('x=0') + ') proves nothing on its own — different expressions can match at one point. It is a check, not a proof.', right: true },
            { html: 'Disagreeing means the original expression is wrong. Agreeing at ' + t('x=0') + ' proves the answer is right.', why: 'The original is given, so it can’t be “wrong”. And two different expressions can match at a single value: try ' + t('x^{2}') + ' and ' + t('x') + ' at ' + t('x=0') + '.' },
            { html: 'Disagreeing is normal, since substituting changes the value. Agreeing at ' + t('x=0') + ' proves the answer is right.', why: 'Simplifying never changes the value, so equal expressions always agree. A disagreement means an error.' },
            { html: 'Disagreeing means a mistake was made. Agreeing at ' + t('x=0') + ' proves the answer is right for every ' + t('x') + '.', why: 'At ' + t('x=0') + ' only the constant terms matter, so a wrong ' + t('x^{2}') + '- or ' + t('x') + '-term would never show up.' }],
            'Equivalent expressions agree for <b>every</b> value, so a disagreement shows an error (often a sign). But agreeing at one value only is not a proof: at ' + t('x=0') + ', for instance, only the constant terms are compared.', ['What happens to the ' + t('x^{2}') + '- and ' + t('x') + '-terms when ' + t('x=0') + '?'], 'what a check proves');
        } }] },
    { num: '16', stem: 'Subtract using the <b>vertical method</b>. The first polynomial has no ' + t('x^{2}') + '-term — leave a gap in that column, or write ' + t('0x^{2}') + '.', parts: [
      { id: 'e16', level: 'EMG', make: function (r) {
        var A = [T(r.int(4, 8), 'x', 3), T(-r.int(2, 6), 'x', 1), T(r.int(1, 5))], Bq = [T(r.int(1, 3), 'x', 3), T(r.int(2, 6), 'x', 2), T(-r.int(1, 4))];
        if (r.chance(0.15)) { A = [T(6, 'x', 3), T(-4, 'x', 1), T(1)]; Bq = [T(2, 'x', 3), T(5, 'x', 2), T(-1)]; }
        return addSub(t(vertTex(A, Bq, -1)), [{ s: 1, a: A }, { s: -1, a: Bq }], { lead: 'Change every sign in the bottom row (' + t(W(NEG(Bq))) + '), then add down the columns. The top row has ' + t('0x^{2}') + '.' });
      } }] },
    { num: '17', stem: '<b>Reasoning.</b>', parts: [
      { id: 'e17a', level: 'ADV', make: function (r) {
        return examplePart('(a) Can the sum of two trinomials be a <b>binomial</b>? Show that it can: give two trinomials whose sum is a binomial.', 3, function (Sp) {
          var n = P.count(Sp); return n === 2 ? null : wrong('u3l1-ex-sum', 'The sum of your trinomials ' + (n ? 'has ' + termsCount(n) : 'is ' + t('0')) + '. Make exactly <b>one</b> pair of like terms cancel (opposite coefficients), so 2 terms are left.');
        }, ['x^{2}+3x+5', '2x^{2}-3x+1'], [['x^2+3x+5', '2x^2+3x+1'], ['x^2+3x+5', '-x^2-3x-5']], 'Yes. One pair of like terms can cancel, e.g. ' + t('(x^{2}+3x+5)+(2x^{2}-3x+1)=3x^{2}+6') + ': the ' + t('x') + '-terms are opposites.', ['Choose the second trinomial so that one of its terms is the <b>opposite</b> of a term in the first.']);
      } },
      { id: 'e17b', level: 'ADV', make: function (r) {
        return examplePart('(b) Can the sum of two trinomials be a <b>monomial</b>? Show that it can: give two trinomials whose sum is a monomial.', 3, function (Sp) {
          var n = P.count(Sp); return n === 1 ? null : wrong('u3l1-ex-sum', 'The sum of your trinomials ' + (n ? 'has ' + termsCount(n) : 'is ' + t('0') + ' — that has no terms at all') + '. Make exactly <b>two</b> pairs of like terms cancel, so one term is left.');
        }, ['x^{2}+3x+5', '2x^{2}-3x-5'], [['x^2+3x+5', '2x^2-3x+1'], ['x^2+3x+5', '-x^2-3x-5']], 'Yes. Two pairs can cancel, e.g. ' + t('(x^{2}+3x+5)+(2x^{2}-3x-5)=3x^{2}') + '.', ['Make two of the second trinomial’s terms the <b>opposites</b> of two terms in the first, and keep the third pair from cancelling.']);
      } },
      { id: 'e17c', level: 'PRG', make: function (r) {
        var p = r.pick([4, 3, 2]), q = r.pick([6, 7, 5].filter(function (v) { return v > p; }));
        return KP.mc(r, '(c) A polynomial of degree ' + t(p) + ' is added to a polynomial of degree ' + t(q) + '. What is the degree of the sum?', [
          { html: t(q) + ': the degree-' + t(q) + ' term has nothing of the same degree to cancel with, so it survives.', right: true },
          { html: t(p + q) + ': the degrees add.', why: 'Adding polynomials only combines <b>like</b> terms; exponents never add. (They add when you multiply.)' },
          { html: t(p) + ': the smaller degree wins.', why: 'The degree is the highest term degree. Is the degree-' + t(q) + ' term still there after adding?' },
          { html: 'It can’t be known without the actual polynomials.', why: 'Only like terms can cancel, and the first polynomial has no term of degree ' + t(q) + '.' }],
          'Only like terms combine. The first polynomial has no term of degree ' + t(q) + ', so the second polynomial’s degree-' + t(q) + ' term survives, and nothing higher can appear. The sum has degree ' + t(q) + '.', ['Can the highest term of the second polynomial cancel with anything?'], 'degree of a sum');
      } },
      { id: 'e17d', level: 'PRG', make: function (r) {
        return KP.mc(r, '(d) Two polynomials of degree ' + t('5') + ' are added. What is the <b>highest possible</b> degree of the sum?', [
          { html: t('5') + ', and it can be lower if the two ' + t('x^{5}') + '-terms are opposites and cancel.', right: true },
          { html: t('10') + ', because ' + t('5+5=10') + '.', why: 'Adding never adds exponents: ' + t('2x^{5}+3x^{5}=5x^{5}') + '.' },
          { html: t('5') + ', and it is always exactly ' + t('5') + '.', why: 'Try ' + t('(2x^{5}+x)+(-2x^{5}+3)') + ': the ' + t('x^{5}') + '-terms cancel.' },
          { html: t('6') + ', because there are two polynomials.', why: 'Adding like terms keeps the exponent: ' + t('x^{5}+x^{5}=2x^{5}') + '.' }],
          'Adding never raises an exponent, so the degree is at most ' + t('5') + '. It is lower when the ' + t('x^{5}') + '-terms cancel, e.g. ' + t('(2x^{5}+3x^{2}-1)+(-2x^{5}+x+4)=3x^{2}+x+3') + ' (degree ' + t('2') + ').', ['Can adding ever create a higher power? Can the highest terms cancel?'], 'highest degree of a sum');
      } },
      { id: 'e17e', sub: 'd ii', level: 'ADV', make: function (r) {
        var p = KP.fields('(d) Give an example: two polynomials of degree ' + t('5') + ' whose sum has a degree <b>lower</b> than ' + t('5') + '.', [{ name: 'First', label: 'First', mode: 'math', keys: 'poly', vars: ['x'], placeholder: 'e.g. 2x^5 + ...' }, { name: 'Second', label: 'Second', mode: 'math', keys: 'poly', vars: ['x'] }], [], ['2x^{5}+3x^{2}-1', '-2x^{5}+x+4'],
          'For example ' + t('(2x^{5}+3x^{2}-1)+(-2x^{5}+x+4)=3x^{2}+x+3') + ', degree ' + t('2') + '.', 'The ' + t('x^{5}') + '-terms are opposites, so they cancel: ' + t('(2x^{5}+3x^{2}-1)+(-2x^{5}+x+4)=3x^{2}+x+3') + ', which has degree ' + t('2') + '.', ['Give the two polynomials opposite ' + t('x^{5}') + '-terms.'], 'example: degree drops');
        p.check = exampleFields({ each: function (q, w) { return P.degree(q) === 5 ? null : wrong('u3l1-ex-degree', '<b>' + w + ':</b> it must have degree ' + t('5') + ' (its highest power is ' + (P.isZero(q) ? 'missing' : t('x^{' + P.degree(q) + '}')) + ').'); },
          sum: function (s) { return !P.isZero(s) && P.degree(s) < 5 ? null : P.isZero(s) ? wrong('u3l1-ex-sum', 'Your sum is ' + t('0') + ', which has no degree at all. Keep at least one term that doesn’t cancel.') : wrong('u3l1-ex-sum', 'Your sum still has degree ' + t('5') + '. Make the ' + t('x^{5}') + '-terms cancel.'); } });
        p.bad = [['2x^5+3x^2-1', '2x^5+x+4'], ['2x^5+3x^2-1', '-2x^5-3x^2+1'], ['2x^4+1', '-2x^4+x']];
        p.good = [['x^5+x', '-x^5+1'], ['-3x^5+x^4', '3x^5+2']];
        return p;
      } }] }
  ];

  /* EP17 (a)(b): two trinomials whose sum has a required number of terms */
  function examplePart(prompt, n, sumChk, key, bad, sol, hints) {
    var p = KP.fields(prompt, [{ name: 'First trinomial', label: 'First trinomial', mode: 'math', keys: 'poly', vars: ['x'], placeholder: PH }, { name: 'Second trinomial', label: 'Second trinomial', mode: 'math', keys: 'poly', vars: ['x'] }], [], key, 'For example ' + t('(' + key[0] + ')+(' + key[1] + ')'), sol, hints, 'example: trinomials');
    p.check = exampleFields({ each: function (q, w) { var k = P.count(q); return k === n ? null : wrong('u3l1-ex-terms', '<b>' + w + ':</b> a trinomial has exactly 3 terms; yours has ' + termsCount(k) + '.'); }, sum: sumChk });
    p.bad = bad;
    return p;
  }
  /* EP8: simplify, then degree and name of the answer. op: +1 | −1 */
  function classPart(A, op, Bq) {
    var parts = [{ s: 1, a: A }, { s: op, a: Bq }], ans = op < 0 ? P.sub(S(A), S(Bq)) : P.add(S(A), S(Bq)), d = P.degree(ans), n = P.count(ans);
    var raw = P.add(S(A), op < 0 ? P.neg(S(Bq)) : S(Bq)), d0 = Math.max(P.degree(S(A)), P.degree(S(Bq))), n0 = Math.max(P.count(S(A)), P.count(S(Bq)));
    var noChange = P.add(S(A), S(Bq)), firstOnly = op < 0 ? P.add(S(A), P.neg(Bq[0]), S(Bq.slice(1))) : null;
    var fl = [{ name: 'Simplified', label: 'Simplified', mode: 'math', keys: 'poly', vars: P.vars(raw).length ? P.vars(raw) : ['x'], placeholder: PH, wide: true }, { name: 'Degree', label: 'Degree' }, { name: 'Name', label: 'Name', mode: 'text', placeholder: 'e.g. binomial' }];
    var pc = K.poly(ans, { wrong: wl(ans, [op < 0 ? { is: noChange, code: 'no-change', hint: 'The second bracket is subtracted: change the sign of every term inside it.' } : null, firstOnly ? { is: firstOnly, code: 'sub-first', hint: 'Change the sign of <b>every</b> term in the subtracted bracket.' } : null]) });
    var dc = K.number(d, function (v) { return v === d0 && d0 !== d ? { code: 'u3l1-deg-early', hint: 'That’s the degree <b>before</b> simplifying. After collecting, the highest terms cancel — what is the highest power left?' } : null; });
    var expr = bracketsTex(parts);
    var p = KP.fields(t(expr), fl, [pc, dc, nameChk(n, n0 !== n ? n0 : null)], [tx(ans), String(d), nameOf(n)], t(tx(ans)) + '; degree ' + t(d) + '; ' + nameOf(n),
      bracketSol(parts, ans) + '<br>The answer has degree ' + t(d) + (d < d0 ? ' (the higher terms cancelled)' : '') + ' and ' + termsCount(n) + ': a <b>' + nameOf(n) + '</b>' + (d === 0 ? ' (a constant)' : '') + '.',
      ['Simplify first: change the signs of a subtracted bracket, then collect like terms.', 'Then classify what is <b>left</b>: its highest term degree, and its number of terms.'], 'simplify then classify');
    p.bad = [[tx(ans), String(d0 === d ? d + 1 : d0), nameOf(n)], [tx(ans), String(d), nameOf(n0 === n ? n + 1 : n0)]];
    return p;
  }

  HW.defineLesson({
    id: 'u3l1', unit: 3, num: '1', title: 'Like Terms, and Adding/Subtracting Polynomials', outcome: 'AN4',
    blurb: 'Naming every piece of a polynomial, then collecting, adding and subtracting them.',
    questions: [
      /* ================= Part A ================= */
      { num: '1', section: 'Part A — Vocabulary and Like Terms', stem: 'Classify each polynomial as a monomial, binomial, or trinomial.', parts: [
        { id: '1a', level: 'LIM', make: function (r) {
          var y = r.pick(['x', 'x', 'y', 'm', 'a']), k = r.int(2, 9), c = nz(r, -9, 9);
          return namePart(r, W([T(k, y, 1), T(c)]), 2);
        } },
        { id: '1b', level: 'LIM', make: function (r) {
          var y = r.pick(['x', 'x', 'y', 'p']), k = r.int(2, 9) * (r.chance(0.25) ? -1 : 1), e = r.int(2, 5);
          return namePart(r, W([T(k, y, e)]), 1, 'An exponent doesn’t create extra terms.');
        } },
        { id: '1c', level: 'LIM', make: function (r) {
          var y = r.pick(['x', 'x', 'y', 'm']);
          return namePart(r, W([T(1, y, 2), T(-r.int(2, 9), y, 1), T(r.int(1, 9))]), 3);
        } }] },
      { num: '2', stem: 'State the degree of each term.', parts: [
        { id: '2a', level: 'LIM', make: function (r) { var c = r.int(2, 12), v = r.pick(['x', 'x', 'y', 'm']); return degPart(String(c), [[v, 1]], function (x) { return x === c ? { code: 'deg-coef', hint: 'That’s the coefficient. The degree comes from the exponent on the variable.' } : x === 0 ? { code: 'deg-hidden1', hint: t(v + '=' + v + '^{1}') + ': the exponent is ' + t('1') + ' even though it isn’t written.' } : null; }); } },
        { id: '2b', level: 'LIM', make: function (r) { var c = r.int(2, 9), e = r.int(2, 4), v = r.pick(['x', 'x', 'y']); if (c === e) c++; return degPart(String(c), [[v, e]], degCoefDiag(c)); } },
        { id: '2c', level: 'BEG', make: function (r) { var c = r.int(2, 25); return degPart('-' + c, [], function (v) { return v === c || v === -c ? { code: 'deg-coef', hint: 'That’s the value of the constant, not its degree. The degree counts exponents on variables — there aren’t any.' } : v === 1 ? { code: 'deg-const', hint: 'There is no variable at all, so the degree is ' + t('0') + '.' } : null; }); } },
        { id: '2d', level: 'BEG', make: function (r) { var c = r.int(2, 12), v = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]); if (c === 2) c = 5; return degPart(String(c), [[v[0], 1], [v[1], 1]], function (x) { return x === c ? { code: 'deg-coef', hint: 'That’s the coefficient. Add the exponents of the variables.' } : x === 1 ? { code: 'deg-max', hint: 'There are two variables, each with exponent ' + t('1') + ': add them.' } : null; }); } },
        { id: '2e', level: 'LIM', make: function (r) { var e = r.int(2, 6), v = r.pick(['x', 'x', 'y', 'a', 'm', 'n', 't']); return degPart('', [[v, e]], function (x) { return x === 1 ? { code: 'deg-coef', hint: 'The hidden coefficient ' + t('1') + ' doesn’t matter. The degree is the exponent.' } : null; }); } }] },
      { num: '3', stem: function (sh) { return 'For the polynomial ' + t(W(sh.terms)) + ', state:'; },
        shared: function (r) {
          var a = r.pick([2, 3, 5, 6, 7, 8, 9]), b = r.int(2, 7), sx = r.chance(0.75) ? 1 : -1, c = r.pick([2, 3, 5, 6, 7, 8, 9]);
          if (r.chance(0.15)) { a = 6; b = 4; sx = 1; c = 8; }
          return { terms: [T(a, 'x', 3), T(-b, 'x', 2), T(sx, 'x', 1), T(-c)], a: a, b: b, sx: sx, c: c };
        },
        parts: [
        { id: '3a', level: 'LIM', make: function (r, sh) { return KP.number('(a) the number of terms.', 4, function (v) { return v === 3 ? { code: 'u3l1-count', hint: 'That’s the degree. Count the pieces separated by ' + t('+') + ' and ' + t('-') + ' signs; the constant counts too.' } : null; }, t(W(sh.terms)) + ' has the terms ' + sh.terms.map(function (q) { return t(tx(q)); }).join(', ') + ': ' + t('4') + ' terms.', ['Terms are separated by ' + t('+') + ' and ' + t('-') + ' signs.'], 'number of terms'); } },
        { id: '3b', level: 'BEG', make: function (r, sh) {
          var ws = [[sh.a, 'x^{3}'], [-sh.b, 'x^{2}'], [sh.sx, 'x']];
          var fl = ws.map(function (w) { return { name: 'Coefficient of the ' + w[1] + '-term', label: 'Coefficient of the ' + t(w[1]) + '-term' }; });
          return KP.fields('(b) the coefficient of each term with a variable.', fl, ws.map(function (w) { return K.number(w[0], function (v) { if (v === -w[0]) return { code: 'coef-sign', hint: 'A term keeps the sign in front of it: the coefficient is ' + t(w[0]) + '.' }; if (Math.abs(w[0]) === 1 && v === 0) return { code: 'u3l1-coef-hidden', hint: 'An unwritten coefficient is ' + t('1') + ' (or ' + t('-1') + ' for ' + t('-x') + ').' }; return null; }); }),
            ws.map(function (w) { return String(w[0]); }), ws.map(function (w) { return t(w[0]); }).join(', '),
            'The coefficients are the numbers multiplying the variables, signs included: ' + ws.map(function (w) { return t(tx(T(w[0], 'x', w[1] === 'x' ? 1 : +w[1].replace(/\D/g, '')))) + ' → ' + t(w[0]); }).join(', ') + (Math.abs(sh.sx) === 1 ? ' (an unwritten coefficient is ' + t(sh.sx > 0 ? '1' : '-1') + ')' : '') + '.', ['Each term keeps the sign in front of it.', 'An ' + t('x') + ' with no number in front has coefficient ' + t('1') + '.'], 'coefficients');
        } },
        { id: '3c', level: 'LIM', make: function (r, sh) { return KP.number('(c) the constant term.', -sh.c, function (v) { return v === sh.c ? { code: 'ct-sign', hint: 'The constant term keeps its sign: it is ' + t(-sh.c) + '.' } : null; }, 'The term with no variable is ' + t(-sh.c) + ' (sign included).', ['Which term has no variable?'], 'constant term'); } },
        { id: '3d', level: 'BEG', make: function (r, sh) { return KP.number('(d) the degree of the polynomial.', 3, function (v) { return v === 4 ? { code: 'deg-terms', hint: 'That’s the number of terms. The degree is the highest term degree.' } : v === 6 ? { code: 'deg-sum-all', hint: 'The degree of a polynomial is its <b>highest</b> term degree, not the sum of all the exponents.' } : v === sh.a ? { code: 'deg-coef', hint: 'That’s a coefficient. Look at the exponents.' } : null; }, 'The term degrees are ' + t('3, 2, 1, 0') + '; the largest is ' + t('3') + ', so the polynomial has degree ' + t('3') + '.', ['Find the degree of each term; the polynomial’s degree is the largest one.'], 'degree of polynomial'); } }] },
      { num: '4', stem: 'Sort the terms into groups of like terms.', parts: [
        { id: '4', level: 'BEG', make: function (r) { return q4(r); } }] },
      { num: '5', stem: 'State whether each pair is a pair of like terms. If not, choose why not.', parts: [
        { id: '5', level: 'BEG', make: function (r) {
          var a = r.int(2, 9), b, c = r.int(2, 9), p = r.int(2, 9), q = r.int(2, 9), k = r.int(2, 9), L = r.pick([['a', 'b'], ['m', 'n'], ['p', 'q'], ['x', 'y']]); do { b = r.int(2, 9); } while (b === a);
          if (r.chance(0.15)) { a = 4; b = 9; c = 3; p = 5; q = 2; k = 6; L = ['a', 'b']; }
          var rows = [{ tex: a + 'x\\ \\text{and}\\ ' + b + 'x', w: 'like', why: 'Both are ' + t('x') + '-terms (exponent ' + t('1') + '); only the coefficients differ.' },
            { tex: c + 'x^{2}\\ \\text{and}\\ ' + c + 'x', w: 'exp', why: 'Same letter, but the exponents are different (' + t('2') + ' and ' + t('1') + '). Equal coefficients don’t make terms like.' },
            { tex: p + 'xy\\ \\text{and}\\ -' + q + 'xy', w: 'like', why: 'Both are ' + t('xy') + '-terms; the coefficients (and their signs) may differ.' },
            { tex: k + L[0] + '\\ \\text{and}\\ ' + k + L[1], w: 'var', why: 'Different variables: ' + t(L[0]) + ' and ' + t(L[1]) + '. Equal coefficients don’t make terms like.' }];
          return likeGrid(rows, 'like or unlike pairs');
        } }] },
      /* ================= Part B ================= */
      { num: '6', section: 'Part B — Collecting, Adding and Subtracting', stem: 'Simplify each expression by collecting like terms.', parts: [
        { id: '6a', level: 'BEG', make: function (r) {
          var a = r.int(3, 9), c = r.int(1, a - 1), b = r.int(1, 9), d = r.int(1, 9);
          if (r.chance(0.15)) { a = 5; c = 3; b = 8; d = 2; }
          var terms = [T(a, 'x', 1), T(b), T(-c, 'x', 1), T(d)];
          return likePart(terms, { wrong: [{ is: T(a - c + b + d, 'x', 1), code: 'unlike-combined', hint: LUMP }, { is: P.add(T(a + c, 'x', 1), T(b + d)), code: 'sign', hint: 'Each term keeps the sign in front of it: ' + t('-' + c + 'x') + ' is negative.' }] });
        } },
        { id: '6b', level: 'BEG', make: function (r) {
          var p = r.int(2, 9), q = r.int(2, 6), rr = r.int(1, 5), s, u = r.int(1, 9); do { s = r.int(2, 9); } while (s === q);
          if (r.chance(0.15)) { p = 9; q = 4; rr = 3; s = 6; u = 5; }
          var terms = [T(p, 'y', 2), T(-q, 'y', 1), T(rr, 'y', 2), T(s, 'y', 1), T(-u)];
          return likePart(terms, { wrong: [lumpWrong(terms) ? { is: lumpWrong(terms), code: 'unlike-combined', hint: LUMP } : null] });
        } },
        { id: '6c', level: 'BEG', make: function (r) {
          var a = r.int(2, 6), b = r.int(4, 9), c = r.int(1, 5), d = r.int(1, b - 1), e = r.int(1, 9);
          if (r.chance(0.15)) { a = 4; b = 7; c = 3; d = 2; e = 1; }
          var terms = [T(a, 'a', 1), T(-b, 'b', 1), T(c, 'a', 1), T(d, 'b', 1), T(-e)];
          return likePart(terms, { wrong: [{ is: P.add(M(a + c - b + d, { a: 1, b: 1 }), T(-e)), code: 'unlike-combined', hint: t('a') + '-terms and ' + t('b') + '-terms are <b>unlike</b> (different letters). Collect them separately.' }, { is: P.add(T(a + c, 'a', 1), T(-b - d, 'b', 1), T(-e)), code: 'sign', hint: 'Each term keeps the sign in front of it: ' + t('+' + d + 'b') + ' is positive.' }] });
        } },
        { id: '6d', level: 'EMG', make: function (r) {
          var a = r.int(5, 9), d = r.int(2, a - 1), b = r.int(2, 6), e = r.int(1, 3), c = r.int(2, 9), f = r.int(2, 9);
          if (r.chance(0.15)) { a = 8; d = 6; b = 3; e = 1; c = 5; f = 9; }
          var terms = [T(a, 'x', 2), T(-b, 'x', 1), T(c), T(-d, 'x', 2), T(-e, 'x', 1), T(f)];
          return likePart(terms, { wrong: [{ is: P.add(T(a - d, 'x', 2), T(-b + e, 'x', 1), T(c + f)), code: 'sign', hint: 'Each term keeps the sign in front of it: ' + t('-' + (e === 1 ? '' : e) + 'x') + ' is negative.' }] });
        } },
        { id: '6e', level: 'EMG', make: function (r) {
          var c1 = r.int(2, 9), a = r.int(1, 4), b = r.int(5, 9), c2 = r.int(c1 + 1, c1 + 9), d = r.int(a + 1, a + 4), e = r.int(1, b - 1);
          if (r.chance(0.15)) { c1 = 6; a = 2; b = 9; c2 = 11; d = 5; e = 4; }
          var terms = [T(-c1), T(a, 'x', 2), T(-b, 'x', 1), T(c2), T(-d, 'x', 2), T(e, 'x', 1)];
          return likePart(terms, { hints: ['The terms are mixed up: sort them into ' + t('x^{2}') + '-terms, ' + t('x') + '-terms and constants, each with the sign in front of it.', 'Add the coefficients in each group. (Writing the answer in descending order is a good habit.)'] });
        } }] },
      { num: '7', stem: 'Add each pair of polynomials (horizontal method).', parts: [
        { id: '7a', level: 'BEG', make: function (r) {
          var A = [T(r.int(2, 5), 'x', 2), T(r.int(1, 5), 'x', 1), T(-r.int(2, 9))], Bq = [T(r.int(1, 3), 'x', 2), T(-r.int(2, 8), 'x', 1), T(r.int(1, 9))], g = 0;
          while (g++ < 50 && P.count(P.add(S(A), S(Bq))) < 3) Bq[1] = T(-r.int(2, 8), 'x', 1);
          if (r.chance(0.15)) { A = [T(3, 'x', 2), T(2, 'x', 1), T(-5)]; Bq = [T(1, 'x', 2), T(-6, 'x', 1), T(4)]; }
          return addSub(null, [{ s: 1, a: A }, { s: 1, a: Bq }]);
        } },
        { id: '7b', level: 'BEG', make: function (r) {
          var a = r.int(3, 8), b = r.int(1, 4), c = r.int(1, 6), d = r.int(1, a - 1), e = r.int(b + 1, b + 5), f = r.int(c + 1, c + 6);
          if (r.chance(0.15)) { a = 5; b = 2; c = 3; d = 1; e = 4; f = 7; }
          return addSub(null, [{ s: 1, a: [T(a, 'a', 1), T(-b, 'b', 1), T(c)] }, { s: 1, a: [T(-d, 'a', 1), T(e, 'b', 1), T(-f)] }]);
        } }] },
      { num: '8', stem: 'Add using the vertical method.', parts: [
        { id: '8', level: 'BEG', make: function (r) {
          var A = [T(r.int(3, 7), 'x', 2), T(-r.int(2, 6), 'x', 1), T(r.int(1, 6))], Bq = [T(r.int(1, 4), 'x', 2), T(r.int(1, 5), 'x', 1), T(-r.int(2, 9))], g = 0;
          while (g++ < 50 && P.count(P.add(S(A), S(Bq))) < 3) Bq[1] = T(r.int(1, 5), 'x', 1);
          if (r.chance(0.15)) { A = [T(6, 'x', 2), T(-5, 'x', 1), T(2)]; Bq = [T(2, 'x', 2), T(3, 'x', 1), T(-8)]; }
          return addSub(t(vertTex(A, Bq, 1)), [{ s: 1, a: A }, { s: 1, a: Bq }], { lead: 'Like terms sit in the same column: add straight down each column.' });
        } }] },
      { num: '9', stem: 'Subtract each pair of polynomials (horizontal method).', parts: [
        { id: '9a', level: 'BEG', make: function (r) {
          var A = [T(r.int(5, 9), 'x', 2), T(r.int(2, 6), 'x', 1), T(-r.int(1, 5))], Bq = [T(r.int(1, 4), 'x', 2), T(r.int(3, 9), 'x', 1), T(-r.int(2, 9))], g = 0;
          while (g++ < 50 && P.count(P.sub(S(A), S(Bq))) < 3) Bq[2] = T(-r.int(2, 9));
          if (r.chance(0.15)) { A = [T(7, 'x', 2), T(4, 'x', 1), T(-3)]; Bq = [T(2, 'x', 2), T(6, 'x', 1), T(-5)]; }
          return addSub(null, [{ s: 1, a: A }, { s: -1, a: Bq }]);
        } },
        { id: '9b', level: 'EMG', make: function (r) {
          var y = function (c, e) { return T(c, 'y', e); }, A = [y(r.int(3, 7), 2), y(-r.int(1, 5), 1), T(r.int(2, 9))], Bq = [y(-r.int(1, 4), 2), y(r.int(2, 6), 1), T(-r.int(2, 9))];
          if (r.chance(0.15)) { A = [y(5, 2), y(-3, 1), T(8)]; Bq = [y(-2, 2), y(4, 1), T(-6)]; }
          return addSub(null, [{ s: 1, a: A }, { s: -1, a: Bq }], { hints: ['Change the sign of <b>every</b> term in the second bracket — negative terms become positive.', 'Then collect like terms.'] });
        } }] },
      { num: '10', stem: 'Subtract using the vertical method.', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var A = [T(r.int(5, 9), 'x', 2), T(-r.int(1, 4), 'x', 1), T(r.int(2, 9))], Bq = [T(r.int(1, 4), 'x', 2), T(r.int(2, 7), 'x', 1), T(-r.int(1, 6))];
          if (r.chance(0.15)) { A = [T(8, 'x', 2), T(-2, 'x', 1), T(6)]; Bq = [T(3, 'x', 2), T(5, 'x', 1), T(-4)]; }
          return addSub(t(vertTex(A, Bq, -1)), [{ s: 1, a: A }, { s: -1, a: Bq }], { lead: 'Change the sign of every term in the bottom row (' + t(W(NEG(Bq))) + '), then add down the columns.' });
        } }] },
      /* ================= Part C ================= */
      { num: '11', section: 'Part C — Putting It Together', stem: 'Simplify.', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var A, Bq, C, ans, g = 0;
          do {
            A = [T(r.int(3, 6), 'x', 2), T(r.int(1, 5), 'x', 1), T(-r.int(1, 5))]; Bq = [T(r.int(2, 7), 'x', 1), T(-r.int(2, 9))]; C = [T(r.int(1, 3), 'x', 2), T(-r.int(1, 3), 'x', 1), T(r.int(2, 9))];
            ans = P.sub(P.add(S(A), S(Bq)), S(C)); g++;
          } while (g < 100 && P.count(ans) < 3);
          if (r.chance(0.15)) { A = [T(4, 'x', 2), T(3, 'x', 1), T(-2)]; Bq = [T(5, 'x', 1), T(-7)]; C = [T(2, 'x', 2), T(-1, 'x', 1), T(6)]; }
          return addSub(null, [{ s: 1, a: A }, { s: 1, a: Bq }, { s: -1, a: C }], { hints: ['Remove the brackets: the first two are added (no sign changes); the last is subtracted (every sign changes).', 'Then collect like terms. The middle bracket has no ' + t('x^{2}') + '-term.'] });
        } }] },
      { num: '12', stem: function (sh) { return 'A student simplified ' + t(bracketsTex([{ s: 1, a: sh.A }, { s: -1, a: sh.B }])) + ' as\\[' + W(sh.A.concat([P.neg(sh.B[0]), sh.B[1], sh.B[2]])) + '=' + tx(sh.stu) + '\\]'; },
        shared: function (r) {
          var sh, g = 0;
          do { sh = errShared(r, [T(r.int(4, 8), 'x', 2), T(r.int(2, 6), 'x', 1), T(-r.int(1, 5))], [T(r.int(1, 3), 'x', 2), T(-r.int(2, 6), 'x', 1), T(r.int(1, 4))]); g++; } while (g < 100 && (P.count(sh.ans) < 3 || P.count(sh.stu) < 3));
          if (r.chance(0.15)) sh = errShared(r, [T(6, 'x', 2), T(5, 'x', 1), T(-3)], [T(2, 'x', 2), T(-4, 'x', 1), T(1)]);
          return sh;
        },
        parts: [
          { id: '12err', sub: 'mistake', level: 'EMG', make: function (r, sh) { return errMC(r, sh); } },
          { id: '12', sub: 'correct', level: 'EMG', make: function (r, sh) { return errFix(sh); } }] },
      { num: '13', stem: function (sh) { return 'A triangle has a perimeter of ' + t('(' + W(sh.per) + ')') + ' cm. Two of its sides measure ' + t('(' + W(sh.s1) + ')') + ' cm and ' + t('(' + W(sh.s2) + ')') + ' cm.<div class="fig">' + triSvg('?', plain(W(sh.s1)), plain(W(sh.s2))) + '</div>'; },
        shared: function (r) {
          var a1, b1, a2, b2, a3, b3, g = 0;
          do { a1 = r.int(2, 4); b1 = -r.int(1, 4); a2 = r.int(1, 3); b2 = r.int(1, 6); a3 = r.int(2, 5); b3 = r.int(-2, 4); g++; } while (g < 200 && (b3 === 0 || b1 + b2 + b3 <= 0));
          if (r.chance(0.15)) { a1 = 3; b1 = -2; a2 = 2; b2 = 5; a3 = 4; b3 = 1; }
          return { s1: [T(a1, 'x', 1), T(b1)], s2: [T(a2, 'x', 1), T(b2)], s3: S([T(a3, 'x', 1), T(b3)]), per: [T(a1 + a2 + a3, 'x', 1), T(b1 + b2 + b3)] };
        },
        parts: [
          { id: '13', level: 'PRG', make: function (r, sh) {
            var parts = [{ s: 1, a: sh.per }, { s: -1, a: sh.s1 }, { s: -1, a: sh.s2 }];
            return addSub('Write and simplify an expression for the length of the third side.', parts, { text: 'third side of triangle', after: t('\\text{ cm}'),
              lead: 'Third side = perimeter − the other two sides: ' + t(bracketsTex(parts)),
              wrong: [{ is: P.add(P.sub(S(sh.per), S(sh.s1)), S(sh.s2)), code: 'second-added', hint: '<b>Both</b> known sides must be subtracted from the perimeter.' }, { is: P.sub(P.add(S(sh.s1), S(sh.s2)), S(sh.per)), code: 'u3l1-reversed', hint: 'Third side = perimeter − (the two known sides), not the other way around.' }],
              hints: ['The three sides add up to the perimeter, so the third side is the perimeter minus the other two.', 'Change the sign of every term in each subtracted bracket.'] });
          } }] },
      { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '14', level: 'EMG', make: function (r) {
          var a, b, c, d, e, f, g = 0, opts;
          do {
            a = r.int(3, 7); d = r.int(1, a - 1); b = r.int(1, 5); e = r.int(1, 6); c = r.int(1, 5); f = r.int(2, 8);
            if (g === 0 && r.chance(0.15)) { a = 5; b = 3; c = 1; d = 2; e = 4; f = 6; }
            var X = function (p, q, s) { return S([T(p, 'x', 2), T(q, 'x', 1), T(s)]); };
            opts = [{ v: X(a - d, -b - e, c + f), right: true },
              { v: X(a - d, -b + e, c - f), why: 'This changes the sign of only the <b>first</b> term of the second bracket.' },
              { v: X(a - d, -b - e, c - f), why: 'Check the constant: ' + t('-(' + -f + ')=+' + f) + '. Every sign in the second bracket changes.' },
              { v: X(a + d, -b + e, c - f), why: 'This <b>adds</b> the second bracket. To subtract, change the sign of every term in it.' }];
            g++;
          } while (g < 100 && opts.some(function (o, i) { return opts.some(function (q, j) { return j > i && P.eq(o.v, q.v); }) || P.count(o.v) < 3; }));
          var A = [T(a, 'x', 2), T(-b, 'x', 1), T(c)], Bq = [T(d, 'x', 2), T(e, 'x', 1), T(-f)];
          return KP.mc(r, 'Which expression is the correct simplification of ' + t(bracketsTex([{ s: 1, a: A }, { s: -1, a: Bq }])) + '?', opts.map(function (o) { return { html: t(tx(o.v)), right: !!o.right, why: o.why }; }),
            t('-(' + W(Bq) + ')=' + W(NEG(Bq))) + ', so ' + t(W(A.concat(NEG(Bq))) + '=' + tx(opts[0].v)) + '.', ['Change the sign of every term in the second bracket, then collect like terms.'], 'MC subtraction');
        } }] },
      { num: '15', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '15', level: 'PRG', make: function (r) {
          var a, b, c, d, e, f, k, g = 0;
          do { a = r.int(2, 5); b = r.int(5, 9); c = r.int(2, 7); d = r.int(1, b - 1); e = r.int(1, 4); f = r.int(1, 3); k = r.int(2, 9); g++; } while (g < 100 && (b - d === a - 1 + f || b + d === b - d));
          if (r.chance(0.15)) { a = 4; b = 9; c = 5; d = 3; e = 2; f = 1; k = 6; }
          var A = [T(a, 'x', 2), T(b, 'x', 1), T(-c)], Bq = [T(1, 'x', 2), T(d, 'x', 1), T(-e)], C = [T(f, 'x', 2), T(-k)];
          var parts = [{ s: 1, a: A }, { s: -1, a: Bq }, { s: 1, a: C }], ans = P.add(S(A), P.neg(S(Bq)), S(C)), co = b - d;
          return KP.nr('Simplify ' + t(bracketsTex(parts)) + '. The coefficient of the ' + t('x') + '-term in the simplified answer is ________.', co, function (v) {
            if (v === b + d) return { code: 'no-change', hint: 'The second bracket is subtracted: ' + t('-(' + d + 'x)=-' + d + 'x') + '.' };
            if (v === cf(ans, { x: 2 })) return { code: 'u3l1-other-coef', hint: 'That’s the coefficient of ' + t('x^{2}') + '. The question asks for the ' + t('x') + '-term.' };
            return null;
          }, bracketSol(parts, ans) + '<br>The ' + t('x') + '-term is ' + t(tx(T(co, 'x', 1))) + ', so the coefficient is <b>' + co + '</b>.', ['Remove the brackets (change every sign in the subtracted one), collect like terms, then read off the number in front of ' + t('x') + '.'], 'NR coefficient of x');
        } }] }
    ],
    extra: EXTRA
  });
})(window);
