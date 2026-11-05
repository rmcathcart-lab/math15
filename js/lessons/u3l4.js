/* Math 15 · Unit 3 · Lesson 4 — Special Products: Difference of Squares & Perfect Squares (AN4)
 * Assignment 4 (u3_L04.tex, Questions 1–16) and the Lesson 4 Extra Practice (u3_EP04.tex, Questions 1–25).
 * Every part is a generator that keeps the booklet question's structure (which pattern, the sign, which term carries a
 * coefficient, the term order — e.g. (6 − x)(6 + x) — a number in front, added/subtracted products) and changes the
 * numbers; the booklet's own numbers are among the possible values. Built like the Math 10C Unit 3 Lesson 3 practice:
 * expressions are lists of signed products (T below) classified as square / sum × difference / plain FOIL, and the
 * classic wrong answers (no middle term, middle term not doubled or with the wrong sign, a negative last square, a square
 * treated as a sum × difference and back, a coefficient not squared, only the first sign of a subtracted product changed,
 * the number in front forgotten or squared) are computed from the generated numbers and get targeted hints.
 * Conversions: "write which case it is" → a table of choices; "explain" → multiple choice whose options are reasons;
 * "find both values" → two boxes in any order; "what belongs in the box" → the term itself, checked by putting it back
 * into the product (so −2x is accepted where it also works); substitution and mental arithmetic → numbers.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 19(b), 19(c) (rebuilding a perfect square trinomial from
 * part of it — working backwards). */
(function (root) {
  'use strict';
  var HW = root.HW, F = HW.fmt, K = HW.kit, KP = K.P, P = HW.poly, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'sq-no-middle': 'Squared a binomial without the middle term', 'sq-not-doubled': 'Middle term of a square not doubled',
    'sq-middle-sign': 'Wrong sign on the middle term of a square', 'sq-last-neg': 'Made the last square negative',
    'sq-as-sd': 'Treated a square as sum × difference', 'coef-not-squared': 'Coefficient not squared', 'neg-square': 'Square of a negative term written as negative',
    'sd-middle': 'Stray middle term in sum × difference', 'sd-plus': 'Sum × difference gave a² + b²', 'sd-as-square': 'Treated sum × difference as a square',
    'fl-only': 'FOIL with only First and Last', 'one-middle': 'FOIL: one of the two middle products missing', 'last-sign': 'Wrong sign on the product of the last terms',
    'u3l3-mid-sign': 'Middle products combined with a sign dropped',
    'k-first': 'Number in front multiplied into only one term', 'k-forgot': 'Forgot the number in front', 'k-both': 'Number in front multiplied into both brackets',
    'k-in-square': 'Number in front put inside the square', 'minus-first': 'Subtracted product: only the first sign changed', 'minus-ignored': 'Added a product that is subtracted',
    'not-subtracted': 'Did not subtract the old area', 'whole-only': 'Used the whole rectangle (no piece removed)', 'new-area': 'Gave the new area instead of the increase',
    'lhs-value': 'Gave the other side’s value', 'not-sq': 'Did not square', 'sum-squares': 'Added the squares instead of subtracting', 'no-square-d': 'Did not square d',
    'n-d': 'Wrong N or d', 'mid-missing': 'Left out the middle piece (2Nd)', 'mid-not-doubled': 'Middle piece not doubled', 'mid-sign': 'Wrong sign on the middle piece',
    'no-group-middle': 'Squared the grouped binomial without its middle term', 'one-root': 'Gave only one of two answers', 'asked-other': 'Combined the coefficients the wrong way',
    'check-product': 'Factor doesn’t give the product when expanded', 'kept-error': 'Repeated the error being corrected', 'not-subst': 'Substitution slip',
    'u3l4-not-one': 'Product is one less than the square: subtracted the wrong amount', 'u3l4-box-sq': 'Box term squared gives the wrong first term'
  });
  HW.addPartial({ 'u3l4-not-one': 'b', 'u3l4-box-sq': 'b' });

  /* ---------------- helpers ---------------- */
  function V(c, vars) { var v = {}; if (typeof vars === 'string') { if (vars) v[vars] = 1; } else if (vars) v = vars; return P.mono(c, v); }
  var X = V(1, 'x');
  function tx(p) { return P.tex(p); }
  function seq(list) { return P.seq(list); }
  function cof(m) { var ts = P.terms(m); return ts.length ? ts[0].c[0] / ts[0].c[1] : 0; }
  function pickWhere(gen, test) { for (var i = 0; i < 4000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('pickWhere failed'); }
  function two(r, a, b) { var x = r.int(a, b), y; do { y = r.int(a, b); } while (y === x); return [x, y]; }
  function gcd(a, b) { return HW.ex.gcd(a, b); }
  function nbox(label, extra) { return Object.assign({ label: label, name: label.replace(/\\\(|\\\)/g, '') }, extra || {}); }
  function pbox(label, vars, extra) { return Object.assign({ label: label, name: label.replace(/\\\(|\\\)/g, ''), mode: 'math', keys: 'poly', vars: vars || ['x'], wide: true }, extra || {}); }
  function numDiag(rows) { return function (v) { for (var i = 0; i < rows.length; i++) if (Math.abs(v - rows[i][0]) < 1e-9) return { code: rows[i][1], hint: rows[i][2] }; return null; }; }
  var LET = ['x', 'x', 'x', 'x', 'y', 'a', 'm', 'n', 'p', 't'];
  function letter(r) { return r.pick(LET); }
  /* rename the variable x to v inside the math of a part's text (numbers / multiple choice only — a polynomial part is built in v) */
  function relab(s, v) { return v === 'x' || typeof s !== 'string' ? s : s.replace(/\\\(([^]*?)\\\)/g, function (m, inner) { return '\\(' + inner.replace(/(\\[a-zA-Z]+)|x/g, function (mm, cmd) { return cmd || v; }) + '\\)'; }); }
  function relabPart(p, v) {
    if (v === 'x') return p;
    ['prompt', 'solution', 'answer'].forEach(function (k) { p[k] = relab(p[k], v); });
    p.hints = (p.hints || []).map(function (h) { return relab(h, v); });
    if (p.input && p.input.before) p.input.before = relab(p.input.before, v);
    if (p.input && p.input.options) p.input.options.forEach(function (o) { o.html = relab(o.html, v); o.why = relab(o.why, v); });
    if (p.input && p.input.fields) p.input.fields.forEach(function (f) { f.label = relab(f.label, v); f.before = relab(f.before, v); });
    var chk = p.check; p.check = function (resp) { var res = chk(resp); if (res && res.hint) res = Object.assign({}, res, { hint: relab(res.hint, v) }); return res; };
    return p;
  }
  /* a polynomial part with its own wrong answers (deduplicated against the key) */
  function pp(prompt, target, ws, sol, hints, text, opt) {
    opt = opt || {};
    var seen = [target], W = [];
    (ws || []).forEach(function (w) { if (!w || !w.is) return; var p = P.lift(w.is); if (seen.some(function (s) { return P.eq(s, p); })) return; seen.push(p); W.push({ is: p, code: w.code, hint: w.hint }); });
    var part = KP.poly(prompt, target, Object.assign({}, opt, { wrong: W }), sol, hints, text);
    part.bad = W.slice(0, 8).map(function (w) { return tx(w.is); });
    if (P.count(target) > 1 && !opt.order) part.good = [P.tex(target, { order: 'asc' })];
    return part;
  }

  /* ---------------- expressions as signed products (from Math 10C u3l3) ---------------- */
  function bin(a, b) { return { p: P.add(a, b), tex: '(' + P.seq([a, b]) + ')', terms: [a, b] }; }
  function T(s, k, f, sq) { return { s: s, k: k == null ? 1 : k, f: f || [], sq: !!sq }; }
  function bodyTex(tm) { return tm.f.map(function (f) { return f.tex; }).join('') + (tm.sq ? '^{2}' : ''); }
  function termTex(tm, first) { var op = tm.s < 0 ? '-' : first ? '' : '+'; if (!tm.f.length) return op + tm.k; return op + (tm.k !== 1 ? tm.k : '') + bodyTex(tm); }
  function exprTex(terms) { return terms.map(function (tm, i) { return termTex(tm, i === 0); }).join(''); }
  function innerOf(tm) { if (!tm.f.length) return P.num(1); if (tm.sq) return P.pow(tm.f[0].p, 2); return P.mul.apply(null, tm.f.map(function (f) { return f.p; })); }
  function pos(m) { return cof(m) < 0 ? P.neg(m) : m; }
  function unsq(m) { var tt = P.terms(m)[0], v = {}; Object.keys(tt.v).forEach(function (x) { v[x] = 2 * tt.v[x]; }); return P.mono([Math.abs(tt.c[0]), tt.c[1]], v); }
  function firstTerm(p) { var ts = P.sorted(p); return P.mono(ts[0].c, ts[0].v); }
  function sqp(m) { var s = P.tex(m); return /^([a-z]|\d+)$/.test(s) ? s : '(' + s + ')'; }
  function ppar(m) { return '(' + P.tex(m) + ')'; }
  function isBin(f) { return f.terms.length === 2; }
  var SQ = t('(a\\pm b)^{2}=a^{2}\\pm 2ab+b^{2}'), SD = t('(a+b)(a-b)=a^{2}-b^{2}');

  function classify(tm) {
    var f = tm.f;
    if (tm.sq && isBin(f[0])) return { kind: 'sq', A: f[0].terms[0], B: f[0].terms[1], sqT: f[0].tex + '^{2}', two: f[0].tex + f[0].tex };
    if (f.length === 2 && isBin(f[0]) && isBin(f[1])) {
      if (P.eq(f[0].p, f[1].p)) return { kind: 'sq', same: true, A: f[0].terms[0], B: f[0].terms[1], sqT: f[0].tex + f[1].tex, two: f[0].tex + f[1].tex };
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++)
        if (P.eq(f[0].terms[i], f[1].terms[j]) && P.eq(f[0].terms[1 - i], P.neg(f[1].terms[1 - j]))) return { kind: 'sd', A: f[0].terms[i], B: f[0].terms[1 - i], sdT: f[0].tex + f[1].tex, swapped: i !== 0 || j !== 0 };
      return { kind: 'foil', a: f[0].terms, b: f[1].terms, T: f[0].tex + f[1].tex };
    }
    return { kind: 'other' };
  }
  function innerVariants(cl) {
    var out = [];
    function add(p, code, hint) { out.push({ p: p, code: code, hint: hint }); }
    if (cl.kind === 'sq' || cl.kind === 'sd') {
      var A = cl.A, Bm = cl.B, A2 = P.pow(A, 2), B2 = P.pow(Bm, 2), AB = P.mul(A, Bm), AB2 = P.scale(AB, 2);
      var notSq = function (Xm) { if (cl.kind === 'sd') Xm = pos(Xm); if (!P.vars(Xm).length) return 'Don’t forget to <b>square</b> the last term: ' + t('(' + P.tex(Xm) + ')^{2}') + ' is not ' + t(P.tex(unsq(Xm))) + '.';
        return 'Square the <b>whole</b> term, coefficient and all: ' + t('(' + P.tex(Xm) + ')^{2}') + ' is not ' + t(P.tex(unsq(Xm))) + '.'; };
      var negSq = 'A square is never negative: ' + t('(' + P.tex(A) + ')^{2}') + ' is positive, because a negative times a negative is positive.';
      if (cl.kind === 'sq') {
        var S = cl.sqT;
        add(P.add(A2, B2), 'sq-no-middle', 'Squaring a binomial always gives a <b>middle term</b>. ' + t(S) + ' means ' + t(cl.two) + ', and the outer and inner products don’t cancel. Use ' + SQ + '.');
        add(P.add(A2, AB, B2), 'sq-not-doubled', 'Check the middle term: it is <b>twice</b> the product of the two terms, ' + t('2ab') + '. The outer and inner products are equal, and you need both of them.');
        add(P.add(A2, P.neg(AB2), B2), 'sq-middle-sign', 'Check the <b>sign of the middle term</b>. It is ' + t('2ab') + ' using the signs of the two terms as written: ' + (cof(AB) < 0 ? 'one of them is negative, so the middle term is negative.' : 'they have the same sign, so the middle term is positive.'));
        add(P.add(A2, AB2, P.neg(B2)), 'sq-last-neg', 'The last term of a square is ' + t('b^{2}') + ', and a square is never negative: ' + t('(' + P.tex(Bm) + ')^{2}') + ' is positive.');
        add(P.sub(A2, B2), 'sq-as-sd', t(S) + ' is a <b>square</b> — the same binomial times itself — not a sum times a difference. Use ' + SQ + ', which has a middle term.');
        if (Math.abs(cof(A)) !== 1 || P.degree(A) > 1) add(P.add(unsq(A), AB2, B2), 'coef-not-squared', notSq(A));
        if (Math.abs(cof(Bm)) !== 1 || P.degree(Bm) > 1) add(P.add(A2, AB2, unsq(Bm)), 'coef-not-squared', notSq(Bm));
        if (cof(A) < 0) add(P.add(P.neg(A2), AB2, B2), 'neg-square', negSq);
      } else {
        var D = cl.sdT;
        add(P.add(A2, AB2, P.neg(B2)), 'sd-middle', 'In ' + t(D) + ' the outer and inner products are opposites, so they <b>cancel</b>: a sum times a difference has no middle term. ' + SD + '.');
        add(P.sub(P.sub(A2, AB2), B2), 'sd-middle', 'In ' + t(D) + ' the outer and inner products are opposites, so they <b>cancel</b>: a sum times a difference has no middle term. ' + SD + '.');
        add(P.add(A2, B2), 'sd-plus', t(D) + ' is a sum times a difference, so the result is a <b>difference</b> of squares, ' + t('a^{2}-b^{2}') + '. The two last terms have opposite signs, so their product is negative.');
        add(P.add(A2, AB2, B2), 'sd-as-square', 'The two brackets are not the same: they have the same two terms with <b>opposite</b> signs on one of them. That is a sum times a difference, ' + SD + ' — no middle term.');
        add(P.add(P.sub(A2, AB2), B2), 'sd-as-square', 'The two brackets are not the same: they have the same two terms with <b>opposite</b> signs on one of them. That is a sum times a difference, ' + SD + ' — no middle term.');
        if (Math.abs(cof(A)) !== 1 || P.degree(A) > 1) add(P.sub(unsq(A), B2), 'coef-not-squared', notSq(A));
        if (Math.abs(cof(Bm)) !== 1 || P.degree(Bm) > 1) add(P.sub(A2, unsq(Bm)), 'coef-not-squared', notSq(Bm));
        if (cof(A) < 0) add(P.sub(P.neg(A2), B2), 'neg-square', negSq);
        add(P.sub(B2, A2), 'sign-all', 'Which term is squared and which is subtracted? In ' + t(D) + ' the term that keeps the <b>same</b> sign in both brackets is ' + t('a') + ' (here ' + t(P.tex(A)) + '); the one whose sign changes is ' + t('b') + '. The answer is ' + t('a^{2}-b^{2}') + '.');
      }
    } else if (cl.kind === 'foil') {
      var a0 = cl.a[0], a1 = cl.a[1], b0 = cl.b[0], b1 = cl.b[1], Fp = P.mul(a0, b0), O = P.mul(a0, b1), I = P.mul(a1, b0), L = P.mul(a1, b1), oneMid = 'You have only one of the two middle products. ' + t(cl.T) + ' needs both the Outer and the Inner products.';
      add(P.add(Fp, L), 'fl-only', 'You have only the <b>First</b> and <b>Last</b> products. ' + t(cl.T) + ' is not a special product, so it also needs the <b>Outer</b> and <b>Inner</b> products — together they make the middle term.');
      add(P.add(Fp, O, L), 'one-middle', oneMid); add(P.add(Fp, I, L), 'one-middle', oneMid);
      add(P.add(Fp, O, I, P.neg(L)), 'last-sign', 'Check the sign of the Last product: ' + t('(' + P.tex(a1) + ')(' + P.tex(b1) + ')=' + P.tex(L)) + '.');
      var ta = P.terms(O)[0], tb = P.terms(I)[0];
      if (ta && tb && ta.key === tb.key && cof(O) * cof(I) < 0) {
        var h = 'Check the signs of the two middle products before you combine them: ' + t(P.tex(O)) + ' and ' + t(P.tex(I)) + '.';
        add(P.add(Fp, O, P.neg(I), L), 'u3l3-mid-sign', h); add(P.add(Fp, P.neg(O), I, L), 'u3l3-mid-sign', h);
      }
    }
    return out;
  }
  function termInfo(tm, first) {
    var inner = innerOf(tm), m = tm.s * tm.k, cl = classify(tm), vs = [], body = bodyTex(tm), full = (tm.k !== 1 ? tm.k : '') + body;
    innerVariants(cl).forEach(function (v) { vs.push({ p: P.scale(v.p, m), code: v.code, hint: v.hint }); });
    if (tm.f.length && tm.k !== 1) {
      var t1 = firstTerm(inner), kk = first ? m : tm.k, sg = first ? 1 : tm.s;
      if (P.count(inner) > 1) vs.push({ p: P.scale(P.add(P.scale(t1, kk), P.sub(inner, t1)), sg), code: 'k-first', hint: 'Multiply <b>every</b> term of the expansion by ' + t(kk) + ', not just the first term.' });
      vs.push({ p: P.scale(inner, tm.s), code: 'k-forgot', hint: 'Don’t forget the ' + t(kk) + ' in front of ' + t(body) + ': expand the brackets, then multiply every term by it.' });
      if (cl.kind === 'sq') vs.push({ p: P.scale(inner, first ? m * m : tm.s * tm.k * tm.k), code: 'k-in-square', hint: 'Expand the square <b>first</b>, then multiply by ' + t(tm.k) + '. Putting ' + t(tm.k) + ' inside the bracket before squaring multiplies by ' + t(tm.k + '^{2}=' + tm.k * tm.k) + ' instead.' });
      else if (tm.f.length >= 2) vs.push({ p: P.scale(inner, tm.s * tm.k * tm.k), code: 'k-both', hint: 'The ' + t(kk) + ' multiplies the product <b>once</b>. Multiplying it into both brackets multiplies by ' + t(tm.k * tm.k) + '. Expand the brackets first, then multiply every term by ' + t(kk) + '.' });
    }
    if (tm.s < 0 && tm.f.length) {
      var E = P.scale(inner, tm.k);
      if (P.count(E) > 1) { var e1 = firstTerm(E); vs.push({ p: P.add(P.neg(e1), P.sub(E, e1)), code: 'minus-first', hint: 'The minus sign in front of ' + t(full) + ' changes the sign of <b>every</b> term that comes out of it, not just the first. Keep the expansion in brackets, then subtract.' }); }
      vs.push({ p: E, code: 'minus-ignored', hint: 'Check the sign in front of ' + t(full) + ': ' + (first ? 'the negative multiplies every term of the expansion.' : 'that whole product is <b>subtracted</b>.') });
    }
    return { tm: tm, first: first, inner: inner, m: m, val: P.scale(inner, m), cl: cl, vs: vs, body: body, full: full };
  }
  function sqSteps(A, Bm) {
    if (cof(Bm) < 0 && cof(A) > 0) { var nb = P.neg(Bm); return sqp(A) + '^{2}-2' + ppar(A) + ppar(nb) + '+' + sqp(nb) + '^{2}'; }
    return sqp(A) + '^{2}+2' + ppar(A) + ppar(Bm) + '+' + sqp(Bm) + '^{2}';
  }
  function steps(info) {
    var cl = info.cl;
    if (cl.kind === 'sq') return sqSteps(cl.A, cl.B);
    if (cl.kind === 'sd') return sqp(cl.A) + '^{2}-' + sqp(pos(cl.B)) + '^{2}';
    if (cl.kind === 'foil') return P.seq([P.mul(cl.a[0], cl.b[0]), P.mul(cl.a[0], cl.b[1]), P.mul(cl.a[1], cl.b[0]), P.mul(cl.a[1], cl.b[1])]);
    return null;
  }
  function solve(infos, target) {
    var lines = [];
    infos.forEach(function (I) {
      var tm = I.tm; if (!tm.f.length) return;
      var st = steps(I), cl = I.cl, inT = P.tex(I.inner), pre = '';
      if (cl.kind === 'sq' && cl.same) pre = 'Same binomial twice, so it is a perfect square: ';
      else if (cl.kind === 'sq') pre = 'Perfect square: ';
      else if (cl.kind === 'sd') pre = cl.swapped ? 'Difference of squares (same two terms ' + t(P.tex(cl.A)) + ' and ' + t(P.tex(pos(cl.B))) + ', opposite signs on ' + t(P.tex(pos(cl.B))) + '): ' : 'Difference of squares: ';
      else if (cl.kind === 'foil') pre = 'Neither pattern — FOIL: ';
      var inShow = (infos.length === 1 && tm.k === 1 && tm.s > 0 && cl.kind === 'sq') ? P.seq([P.pow(cl.A, 2), P.scale(P.mul(cl.A, cl.B), 2), P.pow(cl.B, 2)])
        : (infos.length === 1 && tm.k === 1 && tm.s > 0 && cl.kind === 'sd') ? P.seq([P.pow(cl.A, 2), P.neg(P.pow(cl.B, 2))]) : inT;
      var line = pre + t(I.body + '=' + (st && st !== inShow ? st + '=' : '') + inShow);
      if (tm.k !== 1) { var kk = I.first ? I.m : tm.k; line += ', so ' + t(kk + '(' + inT + ')=' + P.tex(P.scale(I.inner, kk))); }
      lines.push(line);
    });
    if (infos.length > 1) {
      var parts = infos.map(function (I) {
        var E = I.first ? I.val : P.scale(I.inner, I.tm.k), s = P.tex(E);
        if (I.first) return s;
        return (I.tm.s < 0 ? '-' : '+') + (P.count(E) > 1 || cof(E) < 0 ? '(' + s + ')' : s);
      });
      var flat = [];
      infos.forEach(function (I) { var E = I.first ? I.val : P.scale(I.inner, I.tm.s * I.tm.k); P.sorted(E).forEach(function (q) { flat.push(P.mono(q.c, q.v)); }); });
      lines.push('Now combine: ' + t(parts.join('')));
      var flatT = P.seq(flat);
      if (flatT !== parts.join('')) lines.push(t('=' + flatT));
      lines.push(t('=' + P.tex(target)));
    }
    return lines.join('<br>');
  }
  function analyse(terms, extra) {
    var infos = terms.map(function (tm, i) { return termInfo(tm, i === 0); });
    var target = P.add.apply(null, infos.map(function (I) { return I.val; }));
    var wrongs = [], seen = [target];
    function push(p, code, hint) { if (seen.some(function (q) { return P.eq(q, p); })) return; seen.push(p); wrongs.push({ is: p, code: code, hint: hint }); }
    (extra || []).forEach(function (w) { push(P.lift(w.is), w.code, w.hint); });
    infos.forEach(function (I) { I.vs.forEach(function (v) { push(P.add(P.sub(target, I.val), v.p), v.code, v.hint); }); });
    var codes = {};
    infos.forEach(function (I, i) { var done = {}; I.vs.forEach(function (v) { if (done[v.code]) return; done[v.code] = 1; (codes[v.code] = codes[v.code] || []).push({ i: i, v: v }); }); });
    Object.keys(codes).forEach(function (c) {
      if (codes[c].length < 2) return;
      var W = target; codes[c].forEach(function (o) { W = P.add(W, P.sub(o.v.p, infos[o.i].val)); });
      push(W, c, codes[c][0].v.hint);
    });
    var vars = [];
    terms.forEach(function (tm) { tm.f.forEach(function (f) { P.vars(f.p).forEach(function (v) { if (vars.indexOf(v) < 0) vars.push(v); }); }); });
    return { target: target, wrongs: wrongs, tex: exprTex(terms), sol: solve(infos, target), vars: vars.sort(), infos: infos };
  }
  function defaultHints(terms) {
    if (terms.length === 1) {
      var cl = classify(terms[0]);
      var h0 = cl.kind === 'sq' ? 'This is a perfect square: ' + SQ + '. Square the first term, double the product of the two terms, square the last term.'
        : cl.kind === 'sd' ? 'Same two terms, opposite signs: ' + SD + '. The middle terms cancel.'
          : 'Neither special pattern fits (the two brackets don’t have the same two terms), so use FOIL: First, Outer, Inner, Last, then collect like terms.';
      if (terms[0].k !== 1) h0 += ' Then multiply every term by the number in front.';
      return [h0, 'Check: put a small number such as ' + t('1') + ' in for the variable in the question and in your answer — the two values must match.'];
    }
    return ['Expand <b>every</b> product completely first (use ' + SQ + ' and ' + SD + ' where they fit), keep each result in brackets, then collect like terms.',
      'A minus sign in front of a product changes the sign of <b>every</b> term that comes out of it. Check by putting ' + t('1') + ' in for the variable.'];
  }
  /* o: prompt, sol, hints, text, after, before, extra (more wrongs) */
  function ex(terms, o) {
    o = o || {};
    var A = analyse(terms, o.extra), opt = { wrong: A.wrongs, vars: A.vars, after: o.after, before: o.before };
    if (terms.length === 1 && terms[0].k === 1 && terms[0].s > 0) { // key in the pattern's own order: a² ± 2ab + b², a² − b²
      var cl = A.infos[0].cl;
      if (cl.kind === 'sq') opt.keyTex = P.seq([P.pow(cl.A, 2), P.scale(P.mul(cl.A, cl.B), 2), P.pow(cl.B, 2)]);
      if (cl.kind === 'sd') opt.keyTex = P.seq([P.pow(cl.A, 2), P.neg(P.pow(cl.B, 2))]);
    }
    var p = KP.poly(o.prompt || t(A.tex), A.target, opt, o.sol || A.sol, o.hints || defaultHints(terms), o.text || ('expand ' + A.tex));
    p.bad = A.wrongs.slice(0, 8).map(function (w) { return P.tex(w.is); });
    if (P.count(A.target) > 1) p.good = [P.tex(A.target, { order: 'asc' })];
    p.target = A.target;
    return p;
  }
  /* shorthands: (a·v + b)², (a·v + b)(c·v + d) */
  function SQb(a, b, v) { return T(1, 1, [bin(V(a, v || 'x'), V(b))], true); }
  function PR(a, b, c, d, v) { return T(1, 1, [bin(V(a, v || 'x'), V(b)), bin(V(c, v || 'x'), V(d))]); }

  /* ---------------- mental arithmetic (from Math 10C u3l3) ---------------- */
  function sdArith(r, N, d, a0) {
    var a = N + d, b = N - d, ans = N * N - d * d, first = a0 == null ? r.chance(0.5) : a0;
    var shown = first ? F(b) + '\\times ' + F(a) : F(a) + '\\times ' + F(b);
    return KP.fields('Write ' + t(shown) + ' as ' + t('(N-d)(N+d)') + ' with a round number ' + t('N') + ', then evaluate it as ' + t('N^{2}-d^{2}') + '.',
      [{ name: 'N', before: t('N=') }, { name: 'd', before: t('d=') }, { name: 'Product', before: t(shown + '='), wide: true }],
      [K.number(N, numDiag([[a, 'n-d', 'N is the round number in the <b>middle</b>, halfway between the two factors.'], [b, 'n-d', 'N is the round number in the <b>middle</b>, halfway between the two factors.']])),
        K.number(d, numDiag([[2 * d, 'n-d', 'd is the distance from ' + t('N') + ' to <b>each</b> factor, not the distance between the factors.']])),
        K.number(ans, numDiag([[N * N + d * d, 'sum-squares', 'It is a <b>difference</b> of squares: ' + t('N^{2}-d^{2}') + '.'], [N * N - d, 'no-square-d', 'Square ' + t('d') + ' too: subtract ' + t('d^{2}') + '.'], [N * N, 'no-square-d', 'Don’t forget to subtract ' + t('d^{2}') + '.']]))],
      [String(N), String(d), String(ans)], t('N=' + F(N) + ',\\ d=' + d) + '; ' + t(shown + '=' + F(ans)),
      t(shown + '=(' + F(N) + '-' + d + ')(' + F(N) + '+' + d + ')') + '<br>' + t('=' + F(N) + '^{2}-' + d + '^{2}=' + F(N * N) + '-' + F(d * d) + '=' + F(ans)),
      ['Find the number exactly halfway between the two factors: that is ' + t('N') + '. Each factor is ' + t('d') + ' away from it.'], 'difference of squares: ' + a + '×' + b);
  }
  function sqArith(N, d) {
    var num = N + d, ans = num * num, ad = Math.abs(d), sgn = d < 0 ? '-' : '+', N2 = N * N, mid = 2 * N * ad, d2 = d * d;
    var rows = [[N2 + d2, 'mid-missing', 'You left out the middle piece ' + t('2Nd') + ': ' + t('(N\\pm d)^{2}') + ' is not ' + t('N^{2}+d^{2}') + '.'],
      [d < 0 ? N2 - mid / 2 + d2 : N2 + mid / 2 + d2, 'mid-not-doubled', 'The middle piece is ' + t('2Nd') + ' — don’t forget the ' + t('2') + '.'],
      [d < 0 ? N2 + mid + d2 : N2 - mid + d2, 'mid-sign', 'Check the sign of the middle piece: it is ' + t(sgn + '2Nd') + ' here.'],
      [d < 0 ? N2 - mid - d2 : N2 + mid - d2, 'sq-last-neg', 'The last piece is ' + t('d^{2}') + ', which is always added.']];
    return KP.number('Rewrite ' + t(F(num) + '^{2}') + ' as ' + t('(N\\pm d)^{2}') + ' with a round ' + t('N') + ', then evaluate it mentally with ' + t('(N\\pm d)^{2}=N^{2}\\pm 2Nd+d^{2}') + '.', ans, numDiag(rows),
      t(F(num) + '=' + F(N) + sgn + ad) + '<br>' + t('(' + F(N) + sgn + ad + ')^{2}=' + F(N) + '^{2}' + sgn + '2(' + F(N) + ')(' + ad + ')+' + ad + '^{2}') + '<br>' + t('=' + F(N2) + sgn + F(mid) + '+' + d2 + '=' + F(ans)),
      ['Write the three pieces ' + t('N^{2}') + ', ' + t('2Nd') + ' and ' + t('d^{2}') + ' first, then add (or subtract the middle one).'], 'square by pattern: ' + num + '^2', { before: t(F(num) + '^{2}=') });
  }

  /* ---------------- figures ---------------- */
  function lab(s) { return s.replace(/-/g, '−').replace(/([a-z])/g, '<tspan font-style="italic">$1</tspan>').replace(/\+/g, ' + ').replace(/−/g, ' − '); }
  function svgWrap(w, h, body, aria) { return '<svg class="fig-svg" viewBox="0 0 ' + w + ' ' + h + '" style="max-width:' + Math.round(Math.min(360, w * 1.05)) + 'px" role="img" aria-label="' + aria + '">' + body + '</svg>'; }
  function txt(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || 'middle') + '" dominant-baseline="middle" font-size="' + (o.fs || 15) + '" fill="currentColor">' + s + '</text>'; }
  var FILL = 'rgba(110,150,200,0.18)', CUT = 'rgba(192,57,43,0.10)';
  /* a square of side (x+n) with an n×n corner cut away (top right) */
  function cornerFig(n) {
    var S = 150, c = 46, L = 64, Tp = 26, s = '';
    s += '<polygon points="' + [[L, Tp], [L + S - c, Tp], [L + S - c, Tp + c], [L + S, Tp + c], [L + S, Tp + S], [L, Tp + S]].map(function (p) { return p.join(','); }).join(' ') + '" fill="' + FILL + '" stroke="currentColor" stroke-width="2"/>';
    s += '<rect x="' + (L + S - c) + '" y="' + Tp + '" width="' + c + '" height="' + c + '" fill="' + CUT + '" stroke="#c0392b" stroke-width="1.6" stroke-dasharray="5 3"/>';
    s += txt(L + S / 2, Tp + S + 18, lab('x+' + n)) + txt(L - 8, Tp + S / 2, lab('x+' + n), { a: 'end' }) + txt(L + S - c / 2, Tp - 10, String(n), { fs: 13 }) + txt(L + S + 6, Tp + c / 2, String(n), { a: 'start', fs: 13 }) + txt(L + S - c / 2, Tp + c / 2, 'cut', { fs: 11 });
    return svgWrap(L + S + 40, Tp + S + 34, s, 'square with a corner cut out');
  }
  /* a square garden of side s, extended by n on two sides */
  function growFig(n) {
    var S = 120, g = 36, L = 20, Tp = 16, s = '';
    s += '<rect x="' + L + '" y="' + Tp + '" width="' + (S + g) + '" height="' + (S + g) + '" fill="' + CUT + '" stroke="currentColor" stroke-width="1.6" stroke-dasharray="6 4"/>';
    s += '<rect x="' + L + '" y="' + (Tp + g) + '" width="' + S + '" height="' + S + '" fill="' + FILL + '" stroke="currentColor" stroke-width="2"/>';
    s += txt(L + S / 2, Tp + g + S / 2, lab('s'), { fs: 16 }) + txt(L + S / 2, Tp + g + S + 16, lab('s')) + txt(L + S + g / 2, Tp + g + S + 16, String(n), { fs: 13 }) + txt(L + S + g + 8, Tp + g / 2, String(n), { a: 'start', fs: 13 }) + txt(L + S + g + 8, Tp + g + S / 2, lab('s'), { a: 'start' });
    return svgWrap(L + S + g + 40, Tp + S + g + 30, s, 'square garden with each side increased');
  }
  /* a square of side x beside a rectangle (x+n) by (x−n) */
  function compareFig(n) {
    var S = 110, d = 26, L = 16, Tp = 14, gap = 70, s = '';
    s += '<rect x="' + L + '" y="' + (Tp + d) + '" width="' + S + '" height="' + S + '" fill="' + FILL + '" stroke="currentColor" stroke-width="2"/>';
    s += txt(L + S / 2, Tp + d + S + 16, lab('x')) + txt(L + S + 6, Tp + d + S / 2, lab('x'), { a: 'start' });
    var x2 = L + S + gap;
    s += '<rect x="' + x2 + '" y="' + (Tp + 2 * d) + '" width="' + (S + d) + '" height="' + (S - d) + '" fill="' + FILL + '" stroke="currentColor" stroke-width="2"/>';
    s += txt(x2 + (S + d) / 2, Tp + d + S + 16, lab('x+' + n)) + txt(x2 + S + d + 6, Tp + 2 * d + (S - d) / 2, lab('x-' + n), { a: 'start' });
    return svgWrap(x2 + S + d + 56, Tp + d + S + 30, s, 'a square and a rectangle');
  }

  /* ---------------- question makers ---------------- */
  /* "what belongs in the box": tpl(S) = the product with S in the box; keyS = the booklet answer; every S with tpl(S) = target is accepted */
  function boxPart(prompt, tpl, keyS, target, sol, hints, text, diag) {
    var vs = P.vars(target);
    return { prompt: prompt, input: { type: 'math', keys: 'poly', vars: vs.length ? vs : ['x'] }, key: tx(keyS), answer: t(tx(keyS)), text: text, solution: sol, hints: hints,
      check: function (resp) {
        var a = K.read(resp); if (a.res) return a.res;
        var q = P.read(a.ast); if (!q.ok) return wrong('value', 'Type a single term, like ' + t('3x') + ' or ' + t('5') + '.');
        if (P.count(q.p) > 1) return wrong('value', 'Only <b>one term</b> goes in the box.');
        var got = tpl(q.p);
        if (P.eq(got, target)) { var fi = P.formIssue(a.ast); return fi && fi.code !== 'not-poly' ? form(fi.code, fi.msg || 'Simplify the term.') : ok(); }
        var h = diag ? diag(q.p, got) : null; if (h) return wrong(h.code, h.hint);
        return wrong('check-product', 'Put your term in the box and expand: you get ' + t(tx(got)) + ', not ' + t(tx(target)) + '.');
      },
      bad: [tx(P.scale(keyS, 2)), tx(P.add(keyS, V(1)))] };
  }
  /* two values in either order (both values of k) */
  function twoVals(prompt, vals, diag, sol, hints, text) {
    var fields = [nbox(t('k=')), nbox('or ' + t('k='))];
    return { prompt: prompt, input: { type: 'fields', fields: fields }, key: [String(vals[0]), String(vals[1])], answer: t('k=' + vals[0]) + ' or ' + t('k=' + vals[1]), text: text,
      check: function (resp) {
        resp = resp || []; var u = HW.parse.number(resp[0] || ''), w = HW.parse.number(resp[1] || '');
        if (!u.ok || !w.ok) return form('incomplete', 'Fill in both boxes with a number.');
        var g = [u.value, w.value], good = function (x) { return vals.indexOf(x) >= 0; };
        if (good(g[0]) && good(g[1]) && g[0] !== g[1]) return ok();
        if (good(g[0]) && good(g[1])) return wrong('one-root', 'One value is right. There is another: the middle term can be positive <b>or</b> negative.');
        for (var i = 0; i < 2; i++) { var h = diag(g[i]); if (h) return wrong(h.code, h.hint); }
        if (good(g[0]) || good(g[1])) return wrong('one-root', 'One value is right. The other is the same size with the opposite sign.');
        return wrong('value', null);
      },
      good: [[String(vals[1]), String(vals[0])]], bad: [[String(vals[0]), String(vals[0])], [String(vals[0] / 2), String(vals[1] / 2)]], solution: sol, hints: hints };
  }

  /* ================================================================================================ */
  var STEM = 'Expand and simplify. Use ' + SD + ' or ' + SQ + ' wherever the pattern applies.';
  function A1(id, lvl, mk) { return { id: id, level: lvl, make: mk }; }
  HW.defineLesson({
    id: 'u3l4', unit: 3, num: '4', title: 'Special Products: Difference of Squares & Perfect Squares', outcome: 'AN4',
    blurb: 'Two FOIL results worth memorizing: (a + b)(a − b) = a² − b² has no middle term, and (a ± b)² = a² ± 2ab + b² always has one.',
    questions: [
      { num: '1', section: 'Part A — Expand and Simplify', stem: STEM, parts: [A1('1', 'BEG', function (r) { var a = r.int(2, 12), v = letter(r); return ex([T(1, 1, [bin(V(1, v), V(a)), bin(V(1, v), V(-a))])]); })] },
      { num: '2', stem: STEM, parts: [A1('2', 'BEG', function (r) { var a = r.int(2, 12), v = letter(r); return ex([T(1, 1, [bin(V(1, v), V(-a)), bin(V(1, v), V(a))])]); })] },
      { num: '3', stem: STEM, parts: [A1('3', 'BEG', function (r) { return ex([SQb(1, r.int(2, 12), letter(r))]); })] },
      { num: '4', stem: STEM, parts: [A1('4', 'BEG', function (r) { return ex([SQb(1, -r.int(2, 12), letter(r))]); })] },
      { num: '5', stem: STEM, parts: [A1('5', 'BEG', function (r) { var a = r.int(2, 12), v = letter(r); return ex([T(1, 1, [bin(V(1, v), V(a)), bin(V(1, v), V(-a))])]); })] },
      { num: '6', stem: STEM, parts: [A1('6', 'BEG', function (r) { return ex([SQb(1, r.int(2, 12), letter(r))]); })] },
      { num: '7', stem: STEM, parts: [A1('7', 'BEG', function (r) { return ex([SQb(1, -r.int(6, 15), letter(r))]); })] },
      { num: '8', stem: STEM, parts: [A1('8', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); var v = letter(r); return ex([T(1, 1, [bin(V(o.a, v), V(o.b)), bin(V(o.a, v), V(-o.b))])]); })] },
      { num: '9', stem: STEM, parts: [A1('9', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 7), b: r.pick([1, 1, 2, 3]) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return ex([SQb(o.a, o.b, letter(r))]); })] },
      { num: '10', stem: STEM, parts: [A1('10', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 7), b: r.pick([1, 1, 2, 3]) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return ex([SQb(o.a, -o.b, letter(r))]); })] },
      { num: '11', stem: STEM, parts: [A1('11', 'EMG', function (r) { var a = r.int(2, 12), v = letter(r); return ex([T(1, 1, [bin(V(a), V(-1, v)), bin(V(a), V(1, v))])]); })] },
      { num: '12', stem: STEM, parts: [A1('12', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(3, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return ex([SQb(o.a, o.b, letter(r))]); })] },
      { num: '13', stem: STEM, parts: [A1('13', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 6), b: r.int(1, 7) }; }, function (o) { return gcd(o.a, o.b) === 1 && o.b > 1; }); return ex([SQb(o.a, -o.b, letter(r))]); })] },
      { num: '14', stem: STEM + ' <i>(Careful — does either special pattern apply here?)</i>', parts: [A1('14', 'EMG', function (r) { var ab = two(r, 2, 9); return ex([PR(1, ab[0], 1, -ab[1])], { extra: [{ is: P.add(V(1, { x: 2 }), V(-ab[0] * ab[0])), code: 'sd-plus', hint: 'This is <b>not</b> a difference of squares: the two brackets have different numbers (' + t(ab[0]) + ' and ' + t(ab[1]) + '). Use FOIL.' }] }); })] },
      { num: '15', section: 'Part B — Reasoning', stem: '<i>(Multiple Choice)</i>', parts: [A1('15', 'EMG', function (r) {
        var n = r.int(3, 15), x = r.pick(['x', 'x', 'y', 'a', 'm']); if (r.chance(0.12)) { n = 8; x = 'x'; }
        return KP.mc(r, 'A student expanded ' + t('('+x+'+' + n + ')^{2}') + ' and wrote ' + t('('+x+'+' + n + ')^{2}=x^{2}+' + n * n) + '. Which statement correctly describes the student’s mistake?', [
          { html: 'The student forgot the middle term ' + t('2ab=' + 2 * n + x) + '; the correct expansion is ' + t(x+'^{2}+' + 2 * n + x+'+' + n * n) + '.', right: true },
          { html: 'The student computed ' + t(n + '^{2}') + ' incorrectly.', why: t(n + '^{2}=' + n * n) + ' — that part is right. Something is missing.' },
          { html: 'The student used the difference of squares pattern instead of the perfect square pattern.', why: 'The difference of squares pattern would give ' + t(x+'^{2}-' + n * n) + ', with a minus sign. The student’s answer has a plus.' },
          { html: 'The student forgot to square the first term ' + t(x) + '.', why: 'The student’s answer starts with ' + t(x+'^{2}') + ' — the first term was squared.' }],
          t('('+x+'+' + n + ')^{2}=x^{2}+2(x)(' + n + ')+' + n * n + '='+x+'^{2}+' + 2 * n + x+'+' + n * n) + '. Check at ' + t(x+'=1') + ': ' + t('(1+' + n + ')^{2}=' + (n + 1) * (n + 1)) + ' and ' + t('1+' + 2 * n + '+' + n * n + '=' + (n + 1) * (n + 1)) + ', while ' + t(x+'^{2}+' + n * n) + ' gives only ' + t(1 + n * n) + '. Answer <b>A</b>-type: the middle term is missing.',
          ['Expand ' + t('('+x+'+' + n + ')(x+' + n + ')') + ' with FOIL and compare with the student’s answer.'], 'MC missing middle term');
      })] },
      { num: '16', stem: '<i>(Numerical Response)</i>', parts: [A1('16', 'PRG', function (r) {
        var a = r.int(2, 20), x = r.pick(['x', 'x', 'y', 'm', 't', 'n']); if (r.chance(0.12)) { a = 8; x = 'x'; }
        return KP.nr('Given that ' + t('(' + x + '+a)(' + x + '-a)=' + x + '^{2}-' + a * a) + ' for every value of ' + t(x) + ', and ' + t('a>0') + ', the value of ' + t('a') + ' must be ____.', a,
          numDiag([[a * a, 'asked-other', t(a * a) + ' is ' + t('a^{2}') + '. Find ' + t('a') + ': which positive number squared gives ' + t(a * a) + '?'], [a * a / 2, 'not-sq', t('a^{2}') + ' means ' + t('a\\times a') + ', not ' + t('2a') + '.']]),
          t('(' + x + '+a)(' + x + '-a)=' + x + '^{2}-a^{2}') + ', so ' + t('a^{2}=' + a * a) + ' and, since ' + t('a>0') + ', ' + t('a=' + a) + '.', ['Expand ' + t('(' + x + '+a)(' + x + '-a)') + ' with the difference of squares pattern and compare.'], 'NR find a');
      })] }
    ],

    extra: [
      { num: '1', section: 'Extra practice A — Leading Coefficients and Two Variables', stem: 'Expand using the difference of squares pattern. In ' + t('(3x+5)(3x-5)') + ' the first term is ' + t('a=3x') + ', so ' + t('a^{2}=9x^{2}') + ' — the coefficient gets squared too.', parts: [
        A1('e1a', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return ex([PR(o.a, o.b, o.a, -o.b)]); }),
        A1('e1b', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return ex([PR(o.a, o.b, o.a, -o.b, 'y')]); }),
        A1('e1c', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(5, 13) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return ex([PR(o.a, -o.b, o.a, o.b)]); }),
        A1('e1d', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 7), b: r.int(2, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return ex([PR(o.a, o.b, o.a, -o.b, 'a')]); })] },
      { num: '2', stem: 'Expand using the perfect square trinomial pattern.', parts: [
        A1('e2a', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 6), b: r.int(3, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return ex([SQb(o.a, -o.b)]); }),
        A1('e2b', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 7), b: r.int(3, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return ex([SQb(o.a, o.b)]); }),
        A1('e2c', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.int(3, 9), b: r.int(1, 5) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return ex([SQb(o.a, -o.b)]); }),
        A1('e2d', 'EMG', function (r) { var o = pickWhere(function () { return { a: r.pick([10, 10, 3, 4, 5, 6]), b: r.int(1, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return ex([SQb(o.a, o.b)]); })] },
      { num: '3', stem: 'Now both terms carry a variable. Square each term completely — including its letter.', parts: [
        A1('e3a', 'EMG', function (r) { var ab = two(r, 2, 7); return ex([T(1, 1, [bin(V(ab[0], 'a'), V(-ab[1], 'b')), bin(V(ab[0], 'a'), V(ab[1], 'b'))])]); }),
        A1('e3b', 'EMG', function (r) { var ab = two(r, 2, 9); return ex([T(1, 1, [bin(V(ab[0], 'p'), V(ab[1], 'q')), bin(V(ab[0], 'p'), V(-ab[1], 'q'))])]); }),
        A1('e3c', 'PRG', function (r) { var ab = two(r, 1, 5); return ex([T(1, 1, [bin(V(ab[0], 'x'), V(ab[1], 'y'))], true)]); }),
        A1('e3d', 'PRG', function (r) { var ab = two(r, 2, 6); return ex([T(1, 1, [bin(V(ab[0], 'm'), V(ab[1], 'n'))], true)]); })] },
      { num: '4', stem: 'The terms being squared can be anything at all. <i>Recall that ' + t('(x^{2})^{2}=x^{4}') + '.</i>', parts: [
        A1('e4a', 'PRG', function (r) { var ab = two(r, 2, 7); return ex([T(1, 1, [bin(V(ab[0], 'c'), V(-ab[1], 'd'))], true)]); }),
        A1('e4b', 'PRG', function (r) { var n = r.int(2, 12), v = {}; v[r.pick(['x', 'x', 'y', 'a', 'm'])] = 2; return ex([T(1, 1, [bin(V(1, v), V(n)), bin(V(1, v), V(-n))])]); }),
        A1('e4c', 'PRG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return ex([T(1, 1, [bin(V(o.a, { x: 2 }), V(-o.b))], true)]); }),
        A1('e4d', 'PRG', function (r) { var n = r.int(2, 12), lp = r.pick([['a', 'b'], ['a', 'b'], ['x', 'y'], ['m', 'n'], ['p', 'q']]), v = {}; v[lp[0]] = 1; v[lp[1]] = 1; return ex([T(1, 1, [bin(V(1, v), V(n)), bin(V(1, v), V(-n))])]); })] },
      { num: '5', section: 'Extra practice B — Deciding Which Pattern Applies', stem: 'For each product, first decide which case it is — <b>difference of squares</b>, <b>perfect square</b>, or <b>neither</b> — then expand and simplify.',
        shared: function (r) {
          var a = pickWhere(function () { return { p: r.int(2, 6), q: r.int(3, 11) }; }, function (o) { return gcd(o.p, o.q) === 1; }), b = r.int(2, 10), bq = r.pick([1, 1, 1, 2, 3]), c = two(r, 2, 9), d = pickWhere(function () { return { p: r.int(2, 6), q: r.int(2, 11) }; }, function (o) { return gcd(o.p, o.q) === 1 && o.p !== a.p; }), e = pickWhere(function () { return { p: r.int(2, 7), q: r.int(1, 9) }; }, function (o) { return gcd(o.p, o.q) === 1; }), f = pickWhere(function () { return two(r, 1, 9); }, function (v) { return v[0] % 2 === 1 || v[1] % 2 === 1; });
          if (gcd(b, bq) !== 1) bq = 1;
          if (r.chance(0.12)) { a = { p: 4, q: 9 }; b = 5; bq = 1; c = [7, 3]; d = { p: 3, q: 8 }; e = { p: 6, q: 5 }; f = [7, 5]; }
          var list = [[T(1, 1, [bin(V(a.p, 'x'), V(a.q)), bin(V(a.p, 'x'), V(-a.q))])], [SQb(b, -bq)], [PR(1, c[0], 1, -c[1])], [T(1, 1, [bin(V(d.p, 'x'), V(-d.q)), bin(V(d.p, 'x'), V(d.q))])], [SQb(e.p, e.q)], [PR(2, -f[0], 2, f[1])]];
          return { list: list, kinds: ['sd', 'sq', 'neither', 'sd', 'sq', 'neither'] };
        },
        parts: [
          A1('e5', 'EMG', function (r, sh) {
            var cols = [{ id: 'sd', html: 'difference of squares' }, { id: 'sq', html: 'perfect square' }, { id: 'neither', html: 'neither' }], want = {};
            var rows = sh.list.map(function (terms, i) { var id = String.fromCharCode(97 + i); want[id] = sh.kinds[i]; return { id: id, html: '(' + id + ') ' + t(exprTex(terms)) }; });
            var sol = sh.list.map(function (terms, i) { var cl = classify(terms[0]), id = String.fromCharCode(97 + i);
              return '(' + id + ') ' + t(exprTex(terms)) + ': ' + (cl.kind === 'sq' ? '<b>perfect square</b> — the same binomial squared' : cl.kind === 'sd' ? '<b>difference of squares</b> — the same two terms, once added and once subtracted' : '<b>neither</b> — the two brackets don’t have the same two terms, so just FOIL'); }).join('<br>');
            return KP.grid('Choose the case for each product.', rows, cols, want, { why: function (row, got, w) {
              var tx0 = t(exprTex(sh.list[row.charCodeAt(0) - 97]));
              if (w === 'neither') return { code: 'row', hint: 'Look at ' + tx0 + ' again: the two brackets don’t contain the same two terms (the numbers are different), so no shortcut applies.' };
              if (w === 'sq') return { code: 'row', hint: tx0 + ' is one binomial squared — a perfect square.' };
              return { code: 'row', hint: tx0 + ': the same two terms, once with ' + t('+') + ' and once with ' + t('-') + '. That is a difference of squares.' };
            } }, sol, ['Difference of squares: the same two terms, once with + and once with −. Perfect square: a binomial squared. Anything else: neither.'], 'classify six products');
          })].concat(['a', 'b', 'c', 'd', 'e', 'f'].map(function (k, i) { return A1('e5' + k, i === 5 ? 'PRG' : 'EMG', function (r, sh) { return ex(sh.list[i]); }); })) },
      { num: '6', stem: function (sh) { return 'Look back at your six answers in Extra 5. Two of them have only <b>two</b> terms and four of them have <b>three</b>.'; },
        parts: [A1('e6', 'EMG', function (r) {
          var n = r.int(2, 9);
          return KP.mc(r, 'Which pattern produces a two-term answer, and why does the middle term vanish for that one but not the others?', [
            { html: 'The <b>difference of squares</b>: its Outer and Inner products are ' + t('-ab') + ' and ' + t('+ab') + ', opposites, so they cancel. In the others they are equal or simply different, so they don’t cancel.', right: true },
            { html: 'The <b>perfect square</b>: squaring makes the middle term disappear.', why: 'A perfect square always has a middle term ' + t('2ab') + ' — e.g. ' + t('(x+' + n + ')^{2}=x^{2}+' + 2 * n + 'x+' + n * n) + '.' },
            { html: 'The <b>neither</b> cases: FOIL with different numbers loses the middle term.', why: 'Try ' + t('(x+' + n + ')(x-' + (n + 1) + ')') + ': the middle products ' + t('-' + (n + 1) + 'x') + ' and ' + t(n + 'x') + ' leave ' + t('-x') + '.' },
            { html: 'The difference of squares, because its last term is negative.', why: 'A negative last term doesn’t remove anything. Look at what the Outer and Inner products do.' }],
            'In ' + t('(a+b)(a-b)') + ': O ' + t('=-ab') + ' and I ' + t('=+ab') + ' cancel, leaving ' + t('a^{2}-b^{2}') + '. In a perfect square the O and I products are <b>equal</b> and add to ' + t('2ab') + '; in the "neither" cases they are different and still combine to a middle term.', ['For each case, write the Outer and Inner products and add them.'], 'which pattern has two terms (MC)');
        })] },
      { num: '7', stem: '', parts: [A1('e7', 'EMG', function (r) {
        var n = r.int(2, 15), lv = letter(r); if (r.chance(0.12)) { n = 6; lv = 'x'; }
        return relabPart(KP.mc(r, 'Without expanding: why must ' + t('(x+' + n + ')(x-' + n + ')') + ' and ' + t('(x-' + n + ')(x+' + n + ')') + ' give the same answer, while ' + t('(x+' + n + ')^{2}') + ' and ' + t('(x-' + n + ')^{2}') + ' must <b>not</b>?', [
          { html: 'The first two are the same two factors multiplied in a different order (order doesn’t matter in multiplication). The two squares are different products: their middle terms ' + t('+' + 2 * n + 'x') + ' and ' + t('-' + 2 * n + 'x') + ' have opposite signs.', right: true },
          { html: 'All four give ' + t('x^{2}-' + n * n) + '.', why: 'A square has a middle term: ' + t('(x+' + n + ')^{2}=x^{2}+' + 2 * n + 'x+' + n * n) + '.' },
          { html: 'The squares are the same too, because ' + t('(-' + n + ')^{2}=' + n + '^{2}') + '.', why: 'The <b>last</b> terms match, but the middle terms are ' + t('2(x)(' + n + ')') + ' and ' + t('2(x)(-' + n + ')') + ' — opposite signs.' },
          { html: 'The first two only match because ' + t(n) + ' is a whole number.', why: 'Swapping the order of two factors never changes a product, whatever the numbers are.' }],
          t('(x+' + n + ')(x-' + n + ')') + ' and ' + t('(x-' + n + ')(x+' + n + ')') + ' are literally the same product (multiplication is commutative): both are ' + t('x^{2}-' + n * n) + '. But ' + t('(x+' + n + ')^{2}=x^{2}+' + 2 * n + 'x+' + n * n) + ' and ' + t('(x-' + n + ')^{2}=x^{2}-' + 2 * n + 'x+' + n * n) + ' differ in the middle term.', ['Is the first pair the same two factors? What is different about the middle term of the two squares?'], 'same factors vs different squares (MC)'), lv);
      })] },
      { num: '8', section: 'Extra practice C — The Missing Middle Term', stem: function (sh) { return relab('The single most common error in this lesson is writing ' + t('(x+' + sh.n + ')^{2}=x^{2}+' + sh.n * sh.n) + '. Substitute ' + t('x=1') + ' into both expressions and compare.', sh.v); },
        shared: function (r) { var n = r.int(2, 12), v = letter(r); if (r.chance(0.12)) { n = 5; v = 'x'; } return { n: n, v: v }; },
        parts: [
          A1('e8a', 'BEG', function (r, sh) { var n = sh.n, v = (1 + n) * (1 + n); return relabPart(KP.number('(a) Evaluate ' + t('(x+' + n + ')^{2}') + ' at ' + t('x=1') + '.', v, numDiag([[1 + n * n, 'sq-no-middle', 'Add first, then square: ' + t('(1+' + n + ')^{2}=' + (1 + n) + '^{2}') + '.'], [2 * (1 + n), 'not-sq', 'Squaring means multiplying by itself: ' + t((1 + n) + '\\times ' + (1 + n)) + '.']]), t('(1+' + n + ')^{2}=' + (1 + n) + '^{2}=' + v), ['Work out the bracket first, then square.'], 'value of (x+n)^2 at 1', { before: t('(1+' + n + ')^{2}=') }), sh.v); }),
          A1('e8b', 'BEG', function (r, sh) { var n = sh.n, v = 1 + n * n; return relabPart(KP.number('(b) Evaluate ' + t('x^{2}+' + n * n) + ' at ' + t('x=1') + '.', v, numDiag([[(1 + n) * (1 + n), 'lhs-value', 'That is the value of ' + t('(x+' + n + ')^{2}') + '. Evaluate ' + t('x^{2}+' + n * n) + '.']]), t('1^{2}+' + n * n + '=' + v) + ' — not the same as (a).', [t('1^{2}=1') + '.'], 'value of x^2+n^2 at 1', { before: t('1^{2}+' + n * n + '=') }), sh.v); }),
          A1('e8c', 'BEG', function (r, sh) { return ex([SQb(1, sh.n, sh.v)], { prompt: '(c) Expand ' + t('(' + sh.v + '+' + sh.n + ')^{2}') + ' correctly.' }); }),
          A1('e8d', 'BEG', function (r, sh) { var n = sh.n, v = 1 + 2 * n + n * n; return relabPart(KP.number('(d) Check your answer to (c) at ' + t('x=1') + ': evaluate ' + t('x^{2}+' + 2 * n + 'x+' + n * n) + '.', v, numDiag([[1 + n * n, 'sq-no-middle', 'Include the middle term ' + t(2 * n + 'x') + ': at ' + t('x=1') + ' it is ' + t(2 * n) + '.']]), t('1+' + 2 * n + '+' + n * n + '=' + v) + ', which matches (a) — so the expansion is right and ' + t('x^{2}+' + n * n) + ' is wrong.', ['Replace ' + t('x') + ' with ' + t('1') + ' in each term.'], 'check expansion at 1'), sh.v); })] },
      { num: '9', stem: '', parts: [A1('e9', 'PRG', function (r) {
        var n = r.int(2, 12), sg = r.pick([1, 1, -1]), b = sg * n, lv = letter(r);
        return relabPart(KP.number('The correct expansion ' + t('(x' + (sg > 0 ? '+' : '-') + n + ')^{2}=x^{2}' + (sg > 0 ? '+' : '-') + 2 * n + 'x+' + n * n) + ' and the wrong version ' + t('x^{2}+' + n * n) + ' differ by exactly one term. Set the two expressions equal to each other and solve, to find the <b>only</b> value of ' + t('x') + ' for which the wrong answer happens to be right.', 0,
          numDiag([[n * n, 'asked-other', 'Set ' + t('x^{2}' + (sg > 0 ? '+' : '-') + 2 * n + 'x+' + n * n + '=x^{2}+' + n * n) + ' and subtract ' + t('x^{2}+' + n * n) + ' from both sides.'], [2 * b, 'asked-other', 'You have ' + t((sg > 0 ? '' : '-') + 2 * n + 'x=0') + '. What must ' + t('x') + ' be?'], [-b, 'asked-other', 'Solve ' + t((sg > 0 ? '' : '-') + 2 * n + 'x=0') + ': divide both sides by ' + t((sg > 0 ? '' : '-') + 2 * n) + '.']]),
          t('x^{2}' + (sg > 0 ? '+' : '-') + 2 * n + 'x+' + n * n + '=x^{2}+' + n * n) + '<br>Subtract ' + t('x^{2}+' + n * n) + ' from both sides: ' + t((sg > 0 ? '' : '-') + 2 * n + 'x=0') + ', so ' + t('x=0') + '.<br>Only at ' + t('x=0') + ' is the missing middle term worth nothing.', ['Subtract ' + t('x^{2}') + ' and ' + t(n * n) + ' from both sides.'], 'when the wrong answer is right', { before: t('x=') }), lv);
      })] },
      { num: '10', stem: function (sh) { return '<b>Error analysis.</b> A student wrote ' + t('(' + sh.p + 'x-' + sh.q + ')^{2}=' + sh.p * sh.p + 'x^{2}-' + sh.q * sh.q) + '.'; },
        shared: function (r) { var o = pickWhere(function () { return { p: r.int(2, 6), q: r.int(2, 9) }; }, function (o) { return gcd(o.p, o.q) === 1 && o.p !== o.q; }); if (r.chance(0.12)) o = { p: 2, q: 5 }; return o; },
        parts: [
          A1('e10a', 'EMG', function (r, sh) { var p = sh.p, q = sh.q;
            return KP.mc(r, '(a) Name the mistake.', [
              { html: 'The student squared each term and lost the middle term ' + t('2ab=2(' + p + 'x)(-' + q + ')=-' + 2 * p * q + 'x') + ' — and wrote the last term as ' + t('-' + q * q) + ' instead of ' + t('+' + q * q) + '. That is the difference of squares answer, not a square.', right: true },
              { html: 'The student didn’t square the coefficient ' + t(p) + '.', why: t('(' + p + 'x)^{2}=' + p * p + 'x^{2}') + ' — the student did square it.' },
              { html: 'There is no mistake: ' + t('(a-b)^{2}=a^{2}-b^{2}') + '.', why: t('(a-b)^{2}') + ' means ' + t('(a-b)(a-b)') + ': it has a middle term ' + t('-2ab') + ' and ends in ' + t('+b^{2}') + '.' },
              { html: 'Only the sign of the last term is wrong.', why: 'The middle term ' + t('-' + 2 * p * q + 'x') + ' is missing as well.' }],
              t('(' + p + 'x-' + q + ')^{2}=(' + p + 'x)^{2}-2(' + p + 'x)(' + q + ')+' + q + '^{2}=' + p * p + 'x^{2}-' + 2 * p * q + 'x+' + q * q) + '. The student wrote ' + t('a^{2}-b^{2}') + ' — the difference of squares result — which has no middle term and a negative last term.', ['Expand ' + t('(' + p + 'x-' + q + ')(' + p + 'x-' + q + ')') + ' and compare.'], 'name the mistake (MC)'); }),
          A1('e10b', 'EMG', function (r, sh) { return ex([SQb(sh.p, -sh.q)], { prompt: '(b) Give the correct expansion of ' + t('(' + sh.p + 'x-' + sh.q + ')^{2}') + '.', extra: [{ is: P.add(V(sh.p * sh.p, { x: 2 }), V(-sh.q * sh.q)), code: 'kept-error', hint: 'That is the student’s answer. A square has a middle term ' + t('2ab') + ', and its last term is positive.' }] }); }),
          A1('e10c', 'BEG', function (r, sh) {
            var p = sh.p, q = sh.q, st = p * p - q * q, tr = (p - q) * (p - q);
            var f = KP.fields('(c) Substitute ' + t('x=1') + ' into the student’s answer and into the correct expansion to show they disagree.', [nbox('Student’s answer', { before: t(p * p + 'x^{2}-' + q * q + '=') }), nbox('Correct expansion', { before: t(tx(P.pow(P.add(V(p, 'x'), V(-q)), 2)) + '=') })],
              [K.number(st, numDiag([[tr, 'lhs-value', 'That is the value of the correct expansion.']])), K.number(tr, numDiag([[-tr, 'neg-square', 'Add carefully: ' + t(p * p + '-' + 2 * p * q + '+' + q * q) + '. The value of a square is never negative.'], [st, 'lhs-value', 'That is the student’s value.']]))],
              [String(st), String(tr)], t(st) + ' and ' + t(tr),
              'Student: ' + t(p * p + '-' + q * q + '=' + st) + '. Correct: ' + t(p * p + '-' + 2 * p * q + '+' + q * q + '=' + tr) + ', and ' + t('(' + p + '-' + q + ')^{2}=(' + (p - q) + ')^{2}=' + tr) + ' agrees. The student is wrong.',
              ['Replace ' + t('x') + ' with ' + t('1') + ': ' + t('x^{2}=1') + '.'], 'student vs correct at x=1');
            f.bad = [[String(tr), String(st)]];
            return f;
          })] },
      { num: '11', section: 'Extra practice D — Special Products as Mental Arithmetic', stem: 'To find ' + t('49\\times 51') + ', notice that both numbers sit one step from ' + t('50') + ': ' + t('49\\times 51=(50-1)(50+1)=50^{2}-1^{2}=2499') + '. Rewrite each product as ' + t('(N-d)(N+d)') + ' and evaluate it mentally.', parts: [
        A1('e11a', 'BEG', function (r) { return sdArith(r, 10 * r.int(3, 9), r.int(1, 3)); }),
        A1('e11b', 'BEG', function (r) { return sdArith(r, r.pick([100, 100, 50]), r.int(1, 9)); }),
        A1('e11c', 'EMG', function (r) { return sdArith(r, 100 * r.int(2, 5), r.pick([2, 3, 4, 5, 5])); }),
        A1('e11d', 'EMG', function (r) { return sdArith(r, r.pick([1000, 1000, 500]), r.int(1, 9)); })] },
      { num: '12', stem: 'Squares work the same way: ' + t('21^{2}=(20+1)^{2}=400+2(20)(1)+1=441') + '.', parts: [
        A1('e12a', 'BEG', function (r) { return sqArith(10 * r.int(2, 15), r.pick([-1, -1, 1])); }),
        A1('e12b', 'BEG', function (r) { return sqArith(r.pick([100, 100, 1000]), r.pick([1, 2, 3, 4, 5, 6, -1, -2, -3, -4, -5])); }),
        A1('e12c', 'EMG', function (r) { return sqArith(10 * r.int(2, 12), r.pick([-2, -2, -3])); }),
        A1('e12d', 'EMG', function (r) { return sqArith(10 * r.int(2, 12), r.pick([2, 3])); })] },
      { num: '13', stem: function (sh) { return 'You know that ' + t(sh.N + '^{2}=' + F(sh.N * sh.N)) + '.'; },
        shared: function (r) { var N = r.pick([15, 25, 35, 45, 55, 65, 75, 85, 95, 20, 30, 40, 50, 60, 70, 80, 90, 11, 12, 13, 14, 16, 18, 21, 22, 24, 105, 110]); if (r.chance(0.12)) N = 35; return { N: N }; },
        parts: [
          A1('e13a', 'BEG', function (r, sh) { var N = sh.N, v = N * N - 1;
            return KP.number('Use the difference of squares pattern to write down ' + t((N - 1) + '\\times ' + (N + 1)) + ' in one step.', v, numDiag([[N * N + 1, 'sum-squares', 'It is ' + t(N + '^{2}-1^{2}') + ': subtract.'], [N * N, 'no-square-d', 'Subtract ' + t('1^{2}=1') + '.'], [N * N - 2, 'u3l4-not-one', 'Each factor is ' + t('1') + ' away from ' + t(N) + ', so subtract ' + t('1^{2}=1') + ', not ' + t('2') + '.']]),
              t((N - 1) + '\\times ' + (N + 1) + '=(' + N + '-1)(' + N + '+1)=' + N + '^{2}-1^{2}=' + F(N * N) + '-1=' + F(v)), ['Both factors are ' + t('1') + ' away from ' + t(N) + '.'], 'one less than a square', { before: t((N - 1) + '\\times ' + (N + 1) + '=') }); }),
          A1('e13b', 'EMG', function (r, sh) { var N = sh.N;
            return KP.mc(r, 'Why is ' + t((N - 1) + '\\times ' + (N + 1)) + ' exactly ' + t('1') + ' less than ' + t(F(N * N)) + '?', [
              { html: t('(' + N + '-1)(' + N + '+1)=' + N + '^{2}-1^{2}') + ': the pattern subtracts ' + t('b^{2}=1^{2}=1') + ' from the square.', right: true },
              { html: 'Because ' + t(N - 1) + ' is ' + t('1') + ' less than ' + t(N) + '.', why: 'The other factor is ' + t('1') + ' <b>more</b> than ' + t(N) + '. The pattern ' + t('a^{2}-b^{2}') + ' explains the result.' },
              { html: 'Because the middle terms add to ' + t('-1') + '.', why: 'The middle terms ' + t('-' + N) + ' and ' + t('+' + N) + ' cancel completely. The ' + t('-1') + ' is ' + t('-b^{2}') + '.' },
              { html: 'It is a coincidence for this number.', why: 'It always happens: ' + t('(N-1)(N+1)=N^{2}-1') + ' for every ' + t('N') + '.' }],
              t('(' + N + '-1)(' + N + '+1)=' + N + '^{2}-' + N + '+' + N + '-1=' + N + '^{2}-1') + '. The middle terms cancel, and ' + t('b^{2}=1') + ' is subtracted — so the product is always exactly ' + t('1') + ' below ' + t(N + '^{2}') + '.', ['Write the product as ' + t('(a-b)(a+b)') + ' with ' + t('a=' + N) + '. What is ' + t('b^{2}') + '?'], 'why one less (MC)'); })] },
      { num: '14', stem: 'The trick in Extra 11 needs the two numbers to be the <i>same distance</i> from a round number.', parts: [
        A1('e14a', 'EMG', function (r) {
          var N = r.int(12, 60), d = 1;
          return KP.mc(r, 'Why can ' + t((N - 1) + '\\times ' + (N + 1)) + ' be done this way but ' + t((N - 1) + '\\times ' + (N + 2)) + ' cannot?', [
            { html: t(N - 1) + ' and ' + t(N + 1) + ' are both ' + t('1') + ' away from ' + t(N) + '. ' + t(N - 1) + ' and ' + t(N + 2) + ' have no whole number exactly halfway between them (the midpoint is ' + t(N + 0.5) + '), so they can’t be written as ' + t('(a-b)(a+b)') + ' with whole numbers.', right: true },
            { html: 'Because ' + t(N + 2) + ' is not close enough to a multiple of ' + t('10') + '.', why: 'Closeness to 10s isn’t the issue: the two factors must be the same distance from one middle number.' },
            { html: 'Because one of the numbers is odd.', why: t(N - 1) + ' and ' + t(N + 1) + ' are both even and ' + t((N - 1) + '\\times ' + (N + 1)) + ' works; what matters is a whole-number midpoint.' },
            { html: 'It can: ' + t((N - 1) + '\\times ' + (N + 2) + '=' + N + '^{2}-2^{2}') + '.', why: 'Check: ' + t(N + '^{2}-4=' + (N * N - 4)) + ', but ' + t((N - 1) + '\\times ' + (N + 2) + '=' + (N - 1) * (N + 2)) + '.' }],
            'For ' + t('(a-b)(a+b)') + ' the two factors must sit the same distance ' + t('b') + ' either side of ' + t('a') + '. ' + t((N - 1) + ',\\ ' + (N + 1)) + ' are centred on ' + t(N) + '; ' + t((N - 1) + ',\\ ' + (N + 2)) + ' would be centred on ' + t(N + 0.5) + ', not a whole number.', ['Find the number exactly halfway between the two factors.'], 'when the trick works (MC)');
        }),
        A1('e14b', 'BEG', function (r) { return sdArith(r, 10 * r.int(3, 9), r.int(1, 4)); })] },
      { num: '15', section: 'Extra practice E — Combining Special Products', stem: 'Expand each special product <b>fully</b> first, then collect like terms. Something surprising usually happens.', parts: [
        A1('e15a', 'PRG', function (r) { var n = r.int(2, 9), v = letter(r); return ex([SQb(1, n, v), T(-1, 1, [bin(V(1, v), V(-n))], true)]); }),
        A1('e15b', 'PRG', function (r) { var n = r.int(2, 9), v = letter(r); return ex([SQb(1, n, v), SQb(1, -n, v)]); })] },
      { num: '16', stem: 'Expand and simplify. Watch the signs when you subtract a whole trinomial.', parts: [
        A1('e16a', 'PRG', function (r) { var a = r.int(2, 5), b = r.pick([1, 1, 2, 3]), v = letter(r); if (gcd(a, b) !== 1) b = 1; return ex([SQb(a, b, v), T(-1, 1, [bin(V(a, v), V(-b))], true)]); }),
        A1('e16b', 'PRG', function (r) { var n = r.int(2, 9), v = letter(r); return ex([PR(1, n, 1, -n, v), SQb(1, n, v)]); })] },
      { num: '17', stem: 'Expand and simplify. In part (b), multiply through by the number in front <i>after</i> expanding the bracket.', parts: [
        A1('e17a', 'PRG', function (r) { var ab = two(r, 1, 9), v = letter(r); return ex([SQb(1, ab[0], v), T(-1, 1, [bin(V(1, v), V(ab[1])), bin(V(1, v), V(-ab[1]))])]); }),
        A1('e17b', 'ADV', function (r) { var o = pickWhere(function () { return { k: r.int(2, 4), a: r.int(1, 5), j: r.int(2, 3), b: r.int(1, 4) }; }, function (o) { return o.k !== o.j; }); return ex([T(1, o.k, [bin(X, V(-o.a))], true), T(-1, o.j, [bin(X, V(o.b)), bin(X, V(-o.b))])]); })] },
      { num: '18', section: 'Extra practice F — Working Backwards', stem: 'Each expansion below is already finished. Determine what belongs in the box.', parts: [
        A1('e18a', 'PRG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); var A = V(o.a, 'x'), Tg = P.sub(P.pow(A, 2), V(o.b * o.b));
          return boxPart(t('(\\square+' + o.b + ')(\\square-' + o.b + ')=' + tx(Tg)), function (S) { return P.mul(P.add(S, V(o.b)), P.add(S, V(-o.b))); }, A, Tg,
            'The pattern gives ' + t('\\square^{2}-' + o.b * o.b) + ', so ' + t('\\square^{2}=' + o.a * o.a + 'x^{2}') + ' and the box is ' + t(o.a + 'x') + ' (because ' + t('(' + o.a + 'x)^{2}=' + o.a * o.a + 'x^{2}') + '). ' + t('-' + o.a + 'x') + ' also works.<br>Check: ' + t('(' + o.a + 'x+' + o.b + ')(' + o.a + 'x-' + o.b + ')=' + tx(Tg)) + ' ✓',
            ['The product is a difference of squares: ' + t('\\square^{2}-' + o.b * o.b) + '.', 'What squared gives ' + t(o.a * o.a + 'x^{2}') + '?'], 'box: (□+b)(□−b)',
            function (S) { if (P.eq(S, V(o.a * o.a, 'x'))) return { code: 'u3l4-box-sq', hint: 'The box gets <b>squared</b>: ' + t('(' + o.a * o.a + 'x)^{2}=' + o.a * o.a * o.a * o.a + 'x^{2}') + '. You need a term whose square is ' + t(o.a * o.a + 'x^{2}') + '.' }; return null; }); }),
        A1('e18b', 'PRG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 7), b: r.int(2, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); var A = V(o.a, 'x'), Tg = P.sub(P.pow(A, 2), V(o.b * o.b));
          return boxPart(t('(\\square-' + o.b + ')(\\square+' + o.b + ')=' + tx(Tg)), function (S) { return P.mul(P.add(S, V(-o.b)), P.add(S, V(o.b))); }, A, Tg,
            t('\\square^{2}=' + o.a * o.a + 'x^{2}') + ', so the box is ' + t(o.a + 'x') + ' (or ' + t('-' + o.a + 'x') + ').<br>Check: ' + t('(' + o.a + 'x-' + o.b + ')(' + o.a + 'x+' + o.b + ')=' + tx(Tg)) + ' ✓',
            ['The product is a difference of squares: ' + t('\\square^{2}-' + o.b * o.b) + '.', 'What squared gives ' + t(o.a * o.a + 'x^{2}') + '?'], 'box: (□−b)(□+b)',
            function (S) { if (P.eq(S, V(o.a * o.a, 'x'))) return { code: 'u3l4-box-sq', hint: 'The box gets <b>squared</b>. You need a term whose square is ' + t(o.a * o.a + 'x^{2}') + '.' }; return null; }); }),
        A1('e18c', 'PRG', function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); var A = V(o.a, 'x'), Tg = P.pow(P.add(A, V(o.b)), 2);
          return boxPart(t('(\\square+' + o.b + ')^{2}=' + tx(Tg)), function (S) { return P.pow(P.add(S, V(o.b)), 2); }, A, Tg,
            'The first term ' + t(o.a * o.a + 'x^{2}') + ' is ' + t('\\square^{2}') + ', so the box is ' + t(o.a + 'x') + ' or ' + t('-' + o.a + 'x') + '. The middle term ' + t('2(\\square)(' + o.b + ')=' + 2 * o.a * o.b + 'x') + ' is positive, so the box is ' + t(o.a + 'x') + '.<br>Check: ' + t('(' + o.a + 'x+' + o.b + ')^{2}=' + tx(Tg)) + ' ✓',
            ['The first term of the trinomial is the box squared.', 'Then check the middle term: ' + t('2(\\square)(' + o.b + ')') + ' must be ' + t(2 * o.a * o.b + 'x') + '.'], 'box: (□+b)^2',
            function (S) { if (P.eq(S, V(-o.a, 'x'))) return { code: 'sq-middle-sign', hint: 'Then the middle term would be ' + t('2(-' + o.a + 'x)(' + o.b + ')=-' + 2 * o.a * o.b + 'x') + ', but it is positive.' }; if (P.eq(S, V(o.a * o.a, 'x'))) return { code: 'u3l4-box-sq', hint: 'The box gets <b>squared</b>: you need a term whose square is ' + t(o.a * o.a + 'x^{2}') + '.' }; return null; }); }),
        A1('e18d', 'PRG', function (r) { var n = r.int(2, 15), lv = letter(r); if (r.chance(0.12)) { n = 7; lv = 'x'; } var Xv = V(1, lv), Tg = P.pow(P.add(Xv, V(-n)), 2);
          return relabPart(boxPart(t('(x-\\square)^{2}=' + tx(Tg)), function (S) { return P.pow(P.sub(Xv, S), 2); }, V(n), Tg,
            'The last term ' + t(n * n) + ' is ' + t('\\square^{2}') + ', and the middle term ' + t('-2(x)(\\square)=-' + 2 * n + 'x') + ', so the box is ' + t(n) + '.<br>Check: ' + t('(x-' + n + ')^{2}=' + tx(Tg)) + ' ✓',
            ['The middle term is ' + t('-2(x)(\\square)') + '.', 'Or: the last term is the box squared.'], 'box: (x−□)^2',
            function (S) { if (P.eq(S, V(2 * n))) return { code: 'sq-not-doubled', hint: 'The middle term is ' + t('2') + ' times ' + t('x') + ' times the box: ' + t('2(' + 2 * n + ')=' + 4 * n) + ', not ' + t(2 * n) + '.' }; if (P.eq(S, V(n * n))) return { code: 'not-sq', hint: 'The box gets squared to make the last term ' + t(n * n) + '.' }; if (P.eq(S, V(-n))) return { code: 'sq-middle-sign', hint: 'With ' + t('-' + n) + ' in the box the bracket is ' + t('(x+' + n + ')') + ', and the middle term would be positive.' }; return null; }), lv); })] },
      { num: '19', stem: 'A trinomial is a <b>perfect square</b> when it comes from squaring a binomial. Use that idea to find the missing value in each case.', parts: [
        A1('e19a', 'ADV', function (r) { var n = r.int(2, 15); if (r.chance(0.12)) n = 6; var k = 2 * n;
          return relabPart(twoVals('(a) ' + t('x^{2}+kx+' + n * n) + ' is a perfect square trinomial. Find <b>both</b> values of ' + t('k') + '.', [k, -k],
            function (v) { if (Math.abs(v) === n) return { code: 'sq-not-doubled', hint: 'The middle term is ' + t('2ab') + ' — <b>twice</b> ' + t('x\\cdot ' + n) + '.' }; if (Math.abs(v) === n * n) return { code: 'asked-other', hint: t(n * n) + ' is the last term. It is ' + t('b^{2}') + ', so ' + t('b=' + n) + '; the middle coefficient is ' + t('2b') + '.' }; return null; },
            t(n * n + '=' + n + '^{2}') + ', so the trinomial is ' + t('(x+' + n + ')^{2}=x^{2}+' + k + 'x+' + n * n) + ' or ' + t('(x-' + n + ')^{2}=x^{2}-' + k + 'x+' + n * n) + '. So ' + t('k=' + k) + ' or ' + t('k=-' + k) + '.',
            ['The last term is ' + t('b^{2}') + '. What is ' + t('b') + '?', 'The middle coefficient is ' + t('\\pm 2b') + ' — it can be positive or negative.'], 'both k: x^2+kx+n^2'), r.pick(['x', 'x', 'y', 'a', 'm', 't'])); }),
        A1('e19b', 'MAS', function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); if (r.chance(0.12)) o = { a: 2, b: 5 }; var a = o.a, b = o.b, k = 2 * a * b;
          return twoVals('(b) ' + t(a * a + 'x^{2}+kx+' + b * b) + ' is a perfect square trinomial. Find <b>both</b> values of ' + t('k') + '.', [k, -k],
            function (v) { if (Math.abs(v) === a * b) return { code: 'sq-not-doubled', hint: 'The middle term is ' + t('2ab') + ' — <b>twice</b> ' + t('(' + a + 'x)(' + b + ')') + '.' }; if (Math.abs(v) === 2 * b || Math.abs(v) === 2 * a * a * b * b) return { code: 'coef-not-squared', hint: 'First find the two terms that are squared: ' + t(a * a + 'x^{2}=(' + a + 'x)^{2}') + ' and ' + t(b * b + '=' + b + '^{2}') + '. Then the middle term is ' + t('\\pm 2(' + a + 'x)(' + b + ')') + '.' }; return null; },
            t(a * a + 'x^{2}=(' + a + 'x)^{2}') + ' and ' + t(b * b + '=' + b + '^{2}') + ', so the trinomial is ' + t('(' + a + 'x\\pm ' + b + ')^{2}') + ' with middle term ' + t('\\pm 2(' + a + 'x)(' + b + ')=\\pm ' + k + 'x') + '. So ' + t('k=' + k) + ' or ' + t('k=-' + k) + '.',
            ['Write the first term as ' + t('a^{2}') + ' and the last term as ' + t('b^{2}') + '.', 'The middle term is ' + t('\\pm 2ab') + '.'], 'both k: a^2x^2+kx+b^2'); }),
        A1('e19c', 'MAS', function (r) { var o = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 9) }; }, function (o) { return gcd(o.a, o.b) === 1; }); if (r.chance(0.12)) o = { a: 3, b: 5 }; var a = o.a, b = o.b, B0 = P.add(V(a, 'x'), V(b));
          var cB = K.poly(B0, { wrong: [{ is: P.add(V(a, 'x'), V(b * b)), code: 'not-sq', hint: 'The bracket holds ' + t('b') + ', not ' + t('b^{2}') + '.' }, { is: P.add(V(a * a, 'x'), V(b)), code: 'coef-not-squared', hint: t('(' + a * a + 'x)^{2}=' + a * a * a * a + 'x^{2}') + '. Which term squared gives ' + t(a * a + 'x^{2}') + '?' }, { is: P.add(V(a, 'x'), V(-b)), code: 'sq-middle-sign', hint: 'The middle term ' + t('+' + 2 * a * b + 'x') + ' is positive, so the bracket has a plus sign.' }] });
          var cB2 = K.poly(P.neg(B0));
          var p = KP.fields('(c) ' + t(a * a + 'x^{2}+' + 2 * a * b + 'x+c') + ' is a perfect square trinomial. Find ' + t('c') + ', and name the binomial that was squared.', [nbox(t('c')), pbox('Binomial', ['x'], { before: t('(') , after: t(')^{2}') })],
            [K.number(b * b, numDiag([[b, 'not-sq', t('c') + ' is the last term ' + t('b^{2}') + ': square ' + t(b) + '.'], [2 * b, 'not-sq', t('b^{2}') + ' means ' + t(b + '\\times ' + b) + '.'], [a * b, 'asked-other', 'Find ' + t('b') + ' from the middle term ' + t('2(' + a + 'x)(b)=' + 2 * a * b + 'x') + ', then ' + t('c=b^{2}') + '.']])),
              function (resp) { var v = cB2(resp); return v.v === 'correct' ? v : cB(resp); }],
            [String(b * b), tx(B0)], t('c=' + b * b) + '; ' + t('(' + tx(B0) + ')^{2}'),
            'The first term is ' + t(a * a + 'x^{2}=(' + a + 'x)^{2}') + ', so ' + t('a=' + a + 'x') + '. The middle term is ' + t('2ab') + ': ' + t('2(' + a + 'x)(b)=' + 2 * a * b + 'x') + ', so ' + t('b=' + b) + '. Then ' + t('c=b^{2}=' + b * b) + ' and the trinomial is ' + t('(' + tx(B0) + ')^{2}') + '.<br>Check: ' + t('(' + tx(B0) + ')^{2}=' + tx(P.pow(B0, 2))) + ' ✓',
            ['The first term tells you ' + t('a') + '; the middle term ' + t('2ab') + ' then tells you ' + t('b') + '.', 'The last term is ' + t('b^{2}') + '.'], 'find c and the binomial');
          p.good = [[String(b * b), tx(P.neg(B0))]]; p.bad = [[String(b), tx(B0)], [String(b * b), tx(P.add(V(a, 'x'), V(-b)))]];
          return p; })] },
      { num: '20', stem: 'In Extra 19(a) there were two answers, but in 19(c) there was only one value of ' + t('c') + '.', parts: [A1('e20', 'EMG', function (r) {
        var n = r.int(2, 9);
        return KP.mc(r, 'What is the difference between asking for the <i>middle</i> term and asking for the <i>last</i> term of a perfect square trinomial?', [
          { html: 'The middle term is ' + t('2ab') + ', and ' + t('b') + ' may be positive or negative, so both signs work — two answers. The last term is ' + t('b^{2}') + ', and either sign of ' + t('b') + ' squares to the same positive number — one answer.', right: true },
          { html: 'The middle term always has two answers because it is in the middle.', why: 'Its position doesn’t matter. The reason is the sign: ' + t('(x+' + n + ')^{2}') + ' and ' + t('(x-' + n + ')^{2}') + ' have middle terms ' + t('\\pm ' + 2 * n + 'x') + '.' },
          { html: 'The last term can also be negative, so it should have two answers too.', why: 'The last term is a square, ' + t('b^{2}') + ', which is never negative.' },
          { html: 'There is no real difference; 19(c) just happened to have one answer.', why: 'It always happens: ' + t('(x+' + n + ')^{2}') + ' and ' + t('(x-' + n + ')^{2}') + ' both end in ' + t('+' + n * n) + ' but have opposite middle terms.' }],
          t('(x\\pm ' + n + ')^{2}=x^{2}\\pm ' + 2 * n + 'x+' + n * n) + ': the middle term changes sign with ' + t('b') + ', the last term ' + t('b^{2}') + ' doesn’t.', ['Compare ' + t('(x+' + n + ')^{2}') + ' and ' + t('(x-' + n + ')^{2}') + '.'], 'middle vs last (MC)');
      })] },
      { num: '21', stem: '', parts: [A1('e21', 'EMG', function (r) {
        var n = r.int(2, 12), lv = letter(r); if (r.chance(0.12)) { n = 3; lv = 'x'; }
        return relabPart(KP.mc(r, 'Why can ' + t('x^{2}+' + n * n) + ' <b>never</b> be written as ' + t('(x+a)(x-a)') + ' for any real number ' + t('a') + ', even though ' + t('x^{2}-' + n * n) + ' can?', [
          { html: t('(x+a)(x-a)=x^{2}-a^{2}') + ', so we would need ' + t('-a^{2}=' + n * n) + ', i.e. ' + t('a^{2}=-' + n * n) + '. No real number squares to a negative.', right: true },
          { html: 'Because ' + t(n * n) + ' is not a perfect square.', why: t(n * n + '=' + n + '^{2}') + ' is a perfect square. The problem is the sign.' },
          { html: 'It can: take ' + t('a=-' + n) + '.', why: 'Then ' + t('(x-' + n + ')(x+' + n + ')=x^{2}-' + n * n) + ' — still a minus sign.' },
          { html: 'Because ' + t('x^{2}+' + n * n) + ' has no middle term.', why: t('x^{2}-' + n * n) + ' has no middle term either, and it works. Look at the sign of the last term.' }],
          t('(x+a)(x-a)=x^{2}-a^{2}') + ' always ends in ' + t('-a^{2}') + ', which is never positive. For ' + t('x^{2}-' + n * n) + ' we need ' + t('a^{2}=' + n * n) + ', giving ' + t('a=' + n) + '; for ' + t('x^{2}+' + n * n) + ' we would need ' + t('a^{2}=-' + n * n) + ', which is impossible.', ['What would ' + t('a^{2}') + ' have to equal?'], 'sum of squares (MC)'), lv);
      })] },
      { num: '22', section: 'Extra practice G — Area and Geometry', stem: function (sh) { return cornerFig(sh.n) + 'A square piece of cardboard has side length ' + t('(x+' + sh.n + ')') + ' cm. A small square of side ' + t(sh.n) + ' cm is cut out of one corner and thrown away.'; },
        shared: function (r) { var n = r.int(2, 25); if (r.chance(0.12)) n = 4; return { n: n }; },
        parts: [
          A1('e22a', 'BEG', function (r, sh) { return ex([SQb(1, sh.n)], { prompt: '(a) Write an expression for the area of the original square, expanded and simplified.', after: t('\\text{ cm}^{2}'), extra: [{ is: P.add(V(4, 'x'), V(4 * sh.n)), code: 'perimeter', hint: 'That is the perimeter. Area of a square = side × side.' }] }); }),
          A1('e22b', 'EMG', function (r, sh) { var n = sh.n, A0 = P.pow(P.add(X, V(n)), 2), Tg = P.sub(A0, V(n * n));
            return pp('(b) Write and simplify an expression for the area that is left after the corner is removed.', Tg, [{ is: A0, code: 'whole-only', hint: 'That is the whole square. Subtract the corner’s area, ' + t(n + '\\times ' + n + '=' + n * n) + '.' }, { is: P.sub(A0, V(n)), code: 'not-sq', hint: 'The corner is a square of side ' + t(n) + ': its area is ' + t(n + '^{2}=' + n * n) + '.' }, { is: P.add(V(1, { x: 2 }), V(n, 'x')), code: 'sq-not-doubled', hint: 'Check ' + t('(x+' + n + ')^{2}') + ': its middle term is ' + t(2 * n + 'x') + '.' }, { is: V(1, { x: 2 }), code: 'sq-no-middle', hint: t('(x+' + n + ')^{2}') + ' has a middle term ' + t(2 * n + 'x') + ' — the two ' + t(n + '\\times x') + ' strips are still there.' }],
              'Original: ' + t('(x+' + n + ')^{2}=' + tx(A0)) + '. Corner: ' + t(n + '^{2}=' + n * n) + '.<br>Left: ' + t(tx(A0) + '-' + n * n + '=' + tx(Tg)) + ' cm²', ['Area left = original area − corner area.'], 'area left', { after: t('\\text{ cm}^{2}') }); })] },
      { num: '23', stem: function (sh) { return growFig(sh.n) + 'A square garden has side length ' + t('s') + ' metres. Each side is then increased by ' + t(sh.n) + ' m.'; },
        shared: function (r) { var n = r.int(2, 25); if (r.chance(0.12)) n = 3; return { n: n }; },
        parts: [
          A1('e23a', 'PRG', function (r, sh) { var n = sh.n, S = V(1, 's'), N0 = P.pow(P.add(S, V(n)), 2), Tg = P.sub(N0, P.pow(S, 2));
            return pp('(a) Write and simplify an expression for <b>how much the area increases</b>.', Tg, [{ is: N0, code: 'new-area', hint: 'That is the new area. The increase is the new area minus the old area, ' + t('s^{2}') + '.' }, { is: V(n * n), code: 'sq-no-middle', hint: t('(s+' + n + ')^{2}') + ' has a middle term ' + t(2 * n + 's') + ': the two ' + t(n + '\\times s') + ' strips are part of the increase.' }, { is: P.add(V(n, 's'), V(n * n)), code: 'sq-not-doubled', hint: 'There are <b>two</b> strips of area ' + t(n + 's') + ' — the middle term of ' + t('(s+' + n + ')^{2}') + ' is doubled.' }, { is: V(2 * n, 's'), code: 'not-sq', hint: 'Don’t forget the corner square ' + t(n + '\\times ' + n + '=' + n * n) + '.' }],
              'Increase ' + t('=(s+' + n + ')^{2}-s^{2}=(s^{2}+' + 2 * n + 's+' + n * n + ')-s^{2}=' + tx(Tg)) + ' m²', ['Increase = new area − old area. The old area is ' + t('s^{2}') + '.'], 'garden increase', { after: t('\\text{ m}^{2}') }); }),
          A1('e23b', 'EMG', function (r, sh) { var n = sh.n;
            return KP.mc(r, '(b) Is that increase the same for every garden, or does it depend on ' + t('s') + '?', [
              { html: 'It depends on ' + t('s') + ': the increase ' + t(2 * n + 's+' + n * n) + ' grows with ' + t('s') + ', so a bigger garden gains more area from the same ' + t(n) + ' m.', right: true },
              { html: 'It is the same for every garden: ' + t(n * n) + ' m².', why: 'That counts only the corner. The two strips along the sides have area ' + t(n + 's') + ' each, and they depend on ' + t('s') + '.' },
              { html: 'It is the same for every garden, because every side grows by the same ' + t(n) + ' m.', why: 'The strips are ' + t(n) + ' m wide but ' + t('s') + ' m long, so their area depends on ' + t('s') + '.' },
              { html: 'It depends on ' + t('s') + ': a bigger garden gains <b>less</b> area.', why: 'The increase ' + t(2 * n + 's+' + n * n) + ' gets <b>larger</b> as ' + t('s') + ' gets larger.' }],
              'The increase is ' + t(2 * n + 's+' + n * n) + ' m², which contains ' + t('s') + ': e.g. ' + t('s=10') + ' gives ' + t(20 * n + n * n) + ' m², ' + t('s=20') + ' gives ' + t(40 * n + n * n) + ' m².', ['Does your answer to (a) contain ' + t('s') + '?'], 'depends on s (MC)'); })] },
      { num: '24', stem: function (sh) { return compareFig(sh.n) + 'Compare a square with side ' + t('x') + ' to a rectangle measuring ' + t('(x+' + sh.n + ')') + ' by ' + t('(x-' + sh.n + ')') + '.'; },
        shared: function (r) { var n = r.int(2, 25); if (r.chance(0.12)) n = 5; return { n: n }; },
        parts: [
          A1('e24a', 'EMG', function (r, sh) { return ex([PR(1, sh.n, 1, -sh.n)], { prompt: '(a) Write the rectangle’s area as a simplified expression.' }); }),
          A1('e24b', 'PRG', function (r, sh) { var n = sh.n;
            return KP.number('(b) The square always has the larger area. Exactly how much larger is it? (The answer does not contain ' + t('x') + ' at all.)', n * n,
              numDiag([[n, 'not-sq', 'The rectangle’s area is ' + t('x^{2}-' + n + '^{2}') + ': the difference is ' + t(n + '^{2}') + '.'], [2 * n, 'not-sq', t(n + '^{2}') + ' means ' + t(n + '\\times ' + n) + '.'], [-n * n, 'sign', 'The square is the <b>larger</b> one: square minus rectangle.']]),
              'Square ' + t('=x^{2}') + '; rectangle ' + t('=(x+' + n + ')(x-' + n + ')=x^{2}-' + n * n) + '.<br>Difference ' + t('=x^{2}-(x^{2}-' + n * n + ')=' + n * n) + '. The square is always ' + t(n * n) + ' square units larger, whatever ' + t('x') + ' is.',
              ['Subtract the rectangle’s area from the square’s area.'], 'how much larger', { after: 'square units' }); })] },
      { num: '25', section: 'Extra practice H — Stretch', stem: 'The letters ' + t('a') + ' and ' + t('b') + ' in ' + t('(a+b)(a-b)=a^{2}-b^{2}') + ' can stand for <i>whole expressions</i>. In ' + t('(x+y+2)(x+y-2)') + ', treat the group ' + t('(x+y)') + ' as one object ' + t('a') + ' and ' + t('2') + ' as ' + t('b') + '.', parts: [
        A1('e25a', 'ADV', function (r) { var k = r.int(2, 12), L2 = r.pick([['x', 'y'], ['x', 'y'], ['m', 'n'], ['p', 'q']]); if (r.chance(0.12)) { k = 2; L2 = ['x', 'y']; } var u = L2[0], w = L2[1], S = P.parse(u + '+' + w), tg = P.sub(P.pow(S, 2), V(k * k));
          var p = pp('(a) Apply the pattern to get ' + t('(' + u + '+' + w + ')^{2}-' + k + '^{2}') + ', then expand and simplify ' + t('(' + u + '+' + w + '+' + k + ')(' + u + '+' + w + '-' + k + ')') + '.', tg, [
            { is: P.parse(u + '^2+' + w + '^2-' + k * k), code: 'no-group-middle', hint: t('(' + u + '+' + w + ')^{2}') + ' is a perfect square: it has a middle term ' + t('2' + u + w) + '.' },
            { is: P.sub(P.pow(S, 2), V(k)), code: 'not-sq', hint: 'Square ' + t('b=' + k) + ' too: ' + t('b^{2}=' + k * k) + '.' },
            { is: P.add(P.pow(S, 2), V(k * k)), code: 'sd-plus', hint: 'It is ' + t('a^{2}-b^{2}') + ': subtract ' + t(k * k) + '.' }],
            t('a=' + u + '+' + w + ',\\ b=' + k) + '<br>' + t('(a+b)(a-b)=a^{2}-b^{2}=(' + u + '+' + w + ')^{2}-' + k + '^{2}') + '<br>' + t('=' + tx(tg)), ['Let ' + t('a=' + u + '+' + w) + ': the product is ' + t('(a+' + k + ')(a-' + k + ')') + '.', 'Then expand ' + t('(' + u + '+' + w + ')^{2}') + ' with the perfect square pattern.'], '(x+y+k)(x+y-k)');
          return p; }),
        A1('e25b', 'ADV', function (r) { var k = r.int(2, 15), L2 = r.pick([['a', 'b'], ['a', 'b'], ['c', 'd'], ['r', 's']]); if (r.chance(0.12)) { k = 3; L2 = ['a', 'b']; } var u = L2[0], w = L2[1], S = P.parse(u + '+' + w), tg = P.sub(P.pow(S, 2), V(k * k));
          return pp('(b) Use the same idea on ' + t('(' + u + '+' + w + '+' + k + ')(' + u + '+' + w + '-' + k + ')') + '.', tg, [
            { is: P.parse(u + '^2+' + w + '^2-' + k * k), code: 'no-group-middle', hint: t('(' + u + '+' + w + ')^{2}') + ' has a middle term ' + t('2' + u + w) + '.' },
            { is: P.sub(P.pow(S, 2), V(k)), code: 'not-sq', hint: 'Square ' + t(k) + ' too.' },
            { is: P.add(P.pow(S, 2), V(k * k)), code: 'sd-plus', hint: 'It is a <b>difference</b> of squares: subtract ' + t(k * k) + '.' }],
            'Group: ' + t('[(' + u + '+' + w + ')+' + k + '][(' + u + '+' + w + ')-' + k + ']=(' + u + '+' + w + ')^{2}-' + k + '^{2}=' + tx(tg)), ['Treat ' + t('(' + u + '+' + w + ')') + ' as one object.'], '(a+b+k)(a+b-k)'); }),
        A1('e25c', 'ADV', function (r) { var o = pickWhere(function () { return { p: r.int(1, 5), k: r.int(2, 9) }; }, function (o) { return o.k !== o.p; }); if (r.chance(0.12)) o = { p: 1, k: 4 };
          var p0 = o.p, k = o.k, A = P.add(X, V(p0)), tg = P.sub(P.pow(A, 2), V(k * k));
          return pp('(c) Use the same idea on ' + t('\\big((x+' + p0 + ')+' + k + '\\big)\\big((x+' + p0 + ')-' + k + '\\big)') + ', treating ' + t('(x+' + p0 + ')') + ' as the single object ' + t('a') + '.', tg, [
            { is: P.sub(P.add(V(1, { x: 2 }), V(p0 * p0)), V(k * k)), code: 'no-group-middle', hint: t('(x+' + p0 + ')^{2}') + ' has a middle term ' + t(2 * p0 + 'x') + '.' },
            { is: P.add(P.pow(A, 2), V(k * k)), code: 'sd-plus', hint: 'It is ' + t('a^{2}-b^{2}') + ': subtract ' + t(k * k) + '.' },
            { is: P.sub(P.pow(A, 2), V(k)), code: 'not-sq', hint: 'Square ' + t(k) + ' too.' }],
            t('(x+' + p0 + ')^{2}-' + k + '^{2}=x^{2}+' + 2 * p0 + 'x+' + p0 * p0 + '-' + k * k + '=' + tx(tg)) + '.<br>Check directly: ' + t('(x+' + (p0 + k) + ')(x' + (p0 - k < 0 ? '' : '+') + (p0 - k) + ')=' + tx(P.mul(P.add(X, V(p0 + k)), P.add(X, V(p0 - k))))) + ' — they agree.',
            ['Apply ' + t('a^{2}-b^{2}') + ' with ' + t('a=x+' + p0) + ' and ' + t('b=' + k) + '.', 'Then expand ' + t('(x+' + p0 + ')^{2}') + ' and collect.'], '((x+p)+k)((x+p)-k)'); })] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
