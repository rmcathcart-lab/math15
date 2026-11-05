/* Math 15 · Unit 3 · Lesson 3 — Multiplying Two Binomials (AN4)
 * Assignment 3 (u3_L03.tex, Questions 1–16) and the Lesson 3 Extra Practice (u3_EP03.tex, Questions 1–24).
 * Every part is a generator that keeps the booklet question's structure (signs, which bracket carries a coefficient,
 * letters, a number or monomial in front, added/subtracted products) and changes the numbers; the booklet's own numbers
 * are among the possible values. Keys are built with HW.poly. Built like the Math 10C Unit 3 Lessons 2–3 practice:
 * expressions are lists of signed products (T below), and the classic wrong answers (only First and Last, one middle
 * product, last sign, a middle product's sign dropped, a subtracted product with only its first sign changed, the number
 * in front forgotten / put into both brackets) are computed from the generated numbers and get targeted hints.
 * Special-product patterns are not taught until Lesson 4, so every product here is explained with FOIL.
 * Conversions: "show both distributing steps" / "by the distributive property and by FOIL" → boxes for each step;
 * "identify the error" → a multiple-choice reason plus the corrected expansion; "explain" → multiple choice whose options
 * are reasons; "how many terms" → a table of choices; substitution checks → the two values as numbers.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 16(a), 16(b) (the missing binomial when both binomials carry
 * a coefficient — working backwards from the product). */
(function (root) {
  'use strict';
  var HW = root.HW, F = HW.fmt, K = HW.kit, KP = K.P, P = HW.poly, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'first-only': 'Multiplied only the first term in the bracket', 'neg-first': 'Negative monomial: sign applied to the first term only', 'var-first': 'Variable of the monomial only on the first term',
    'fl-only': 'FOIL: only First and Last (no middle term)', 'one-middle': 'FOIL: one of the two middle products missing', 'last-sign': 'Wrong sign on the product of the last terms',
    'u3l3-mid-sign': 'Middle products combined with a sign dropped', 'u3l3-last-add': 'Added the last terms instead of multiplying them',
    'dist-first': 'Multiplied only the first term in the bracket', 'k-first': 'Number in front multiplied into only one term', 'k-forgot': 'Forgot the number in front',
    'k-both': 'Number in front multiplied into both brackets', 'minus-first': 'Subtracted product: only the first sign changed', 'minus-ignored': 'Added a product that is subtracted',
    'kept-error': 'Repeated the error being corrected', 'check-product': 'Factor doesn’t give the product when expanded', 'not-binomial': 'A factor that isn’t a binomial',
    'asked-other': 'Combined the coefficients the wrong way', 'lhs-value': 'Gave the other side’s value', 'not-subst': 'Substitution slip',
    'pair-sum': 'Pair with the right product but the wrong sum', 'pair-product': 'Pair with the right sum but the wrong product', 'pair-signs': 'Pair with the wrong signs',
    perimeter: 'Used perimeter instead of area', 'u3l3-area-for-perim': 'Gave the area instead of the perimeter', 'u3l3-half-perim': 'Perimeter: added each side only once',
    'new-area': 'Gave the new area instead of the increase', 'whole-only': 'Used the whole rectangle (no piece removed)', 'u3l3-path-once': 'Path width added to only one side',
    'u3l3-per-m2': 'Cost: forgot to multiply by the price per square metre', 'u3l3-k-sign': 'Value with the wrong sign'
  });
  HW.addPartial({ 'u3l3-mid-sign': 's', 'u3l3-last-add': 'b', 'u3l3-area-for-perim': 'n', 'u3l3-half-perim': 'b', 'u3l3-path-once': 'b', 'u3l3-per-m2': 'b', 'u3l3-k-sign': 's' });

  /* ---------------- polynomial helpers ---------------- */
  function V(c, vars) { var v = {}; if (typeof vars === 'string') { if (vars) v[vars] = 1; } else if (vars) v = vars; return P.mono(c, v); }
  var X = V(1, 'x');
  function lin(a, b, v) { return P.add(V(a, v || 'x'), V(b)); }
  function tx(p) { return P.tex(p); }
  function seq(list) { return P.seq(list); }
  function br(list) { return '(' + seq(list) + ')'; }
  function sumOf(list) { return P.add.apply(null, list); }
  function pf(p) { var s = tx(p); return P.count(p) > 1 || s.charAt(0) === '-' ? '(' + s + ')' : s; }
  function dot(a, b) { return pf(a) + '\\cdot ' + pf(b); }
  function cof(m) { var ts = P.terms(m); return ts.length ? ts[0].c[0] / ts[0].c[1] : 0; }
  function pickWhere(gen, test) { for (var i = 0; i < 4000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('pickWhere failed'); }
  function termsOf(p) { return P.sorted(p).map(function (q) { return P.mono(q.c, q.v); }); }
  function two(r, a, b) { var x = r.int(a, b), y; do { y = r.int(a, b); } while (y === x); return [x, y]; }
  function nbox(label, extra) { return Object.assign({ label: label, name: label.replace(/\\\(|\\\)/g, '') }, extra || {}); }
  function pbox(label, vars, extra) { return Object.assign({ label: label, name: label.replace(/\\\(|\\\)/g, ''), mode: 'math', keys: 'poly', vars: vars || ['x'], wide: true }, extra || {}); }
  function numDiag(rows) { return function (v) { for (var i = 0; i < rows.length; i++) if (Math.abs(v - rows[i][0]) < 1e-9) return { code: rows[i][1], hint: rows[i][2] }; return null; }; }
  function sgnNum(n) { return n < 0 ? '(' + n + ')' : String(n); }

  /* a polynomial part: drops classic wrong answers that equal the key (or each other), tests them as bad answers */
  function pp(prompt, target, ws, sol, hints, text, opt) {
    opt = opt || {};
    var seen = [target], W = [];
    (ws || []).forEach(function (w) { if (!w || !w.is) return; var p = P.lift(w.is); if (seen.some(function (s) { return P.eq(s, p); })) return; seen.push(p); W.push({ is: p, code: w.code, hint: w.hint }); });
    var part = KP.poly(prompt, target, Object.assign({}, opt, { wrong: W }), sol, hints, text);
    part.bad = W.slice(0, 8).map(function (w) { return tx(w.is); });
    if (P.count(target) > 1 && !opt.order) part.good = [P.tex(target, { order: 'asc' })];
    return part;
  }
  function chk(target, ws) {
    var seen = [P.lift(target)], W = [];
    (ws || []).forEach(function (w) { var p = P.lift(w.is); if (seen.some(function (s) { return P.eq(s, p); })) return; seen.push(p); W.push({ is: p, code: w.code, hint: w.hint }); });
    return K.poly(target, { wrong: W });
  }

  /* ---------------- monomial × polynomial (Q1 recall, Q2 steps) ---------------- */
  function monoWrongs(m, terms) {
    var out = [], prods = terms.map(function (q) { return P.mul(m, q); }), c = cof(m);
    if (terms.length > 1) {
      out.push({ is: sumOf([prods[0]].concat(terms.slice(1))), code: 'first-only', hint: 'Multiply <b>every</b> term in the bracket by ' + t(tx(m)) + ', not just the first one.' });
      if (c < 0) out.push({ is: sumOf([prods[0]].concat(terms.slice(1).map(function (q) { return P.mul(P.neg(m), q); }))), code: 'neg-first', hint: 'The negative sign is part of ' + t(tx(m)) + ', so it multiplies <b>every</b> term in the bracket. Check the sign of the second term.' });
      if (P.vars(m).length) out.push({ is: sumOf([prods[0]].concat(terms.slice(1).map(function (q) { return P.mul(V(c), q); }))), code: 'var-first', hint: 'The ' + t('x') + ' in ' + t(tx(m)) + ' multiplies every term in the bracket too, not just the first one.' });
    }
    return out;
  }
  function expandMono(m, terms) {
    var prods = terms.map(function (q) { return P.mul(m, q); }), T0 = sumOf(prods), lhs = (tx(m) === '-1' ? '-' : tx(m) === '1' ? '' : tx(m)) + br(terms);
    var l1 = terms.map(function (q, i) { var s = pf(m) + '(' + tx(q) + ')'; return i ? '+' + s : s; }).join('');
    return pp(t(lhs), T0, monoWrongs(m, terms), 'Multiply ' + t(tx(m)) + ' by each term in the bracket:<br>' + t(lhs + '=' + l1 + '=' + seq(prods)),
      ['Multiply ' + t(tx(m)) + ' by <b>each</b> term in the bracket: multiply the numbers, and ' + t('x\\cdot x=x^{2}') + '.', 'Watch the signs: a negative times a negative is positive.'], 'expand ' + lhs);
  }

  /* ---------------- binomial × binomial: FOIL ---------------- */
  function foil(A, B, C, D) { var Fp = P.mul(A, C), O = P.mul(A, D), I = P.mul(B, C), L = P.mul(B, D); return { F: Fp, O: O, I: I, L: L, res: P.add(Fp, O, I, L) }; }
  function likeTerms(a, b) { var ta = P.terms(a)[0], tb = P.terms(b)[0]; return !!(ta && tb && ta.key === tb.key); }
  /* the classic wrong answers for (A + B)(C + D) */
  function binWrongs(A, B, C, D) {
    var f = foil(A, B, C, D), out = [], both = cof(B) < 0 && cof(D) < 0, oneMid = 'You have only one of the two middle products. Find both the Outer product ' + t(dot(A, D)) + ' and the Inner product ' + t(dot(B, C)) + '.';
    out.push({ is: P.add(f.F, f.L), code: 'fl-only', hint: 'You multiplied only the <b>First</b> terms and the <b>Last</b> terms. Two binomials give <b>four</b> products — the Outer and Inner products make the middle term.' });
    out.push({ is: P.add(f.F, f.O, f.L), code: 'one-middle', hint: oneMid });
    out.push({ is: P.add(f.F, f.I, f.L), code: 'one-middle', hint: oneMid });
    out.push({ is: P.add(f.F, f.O, f.I, P.neg(f.L)), code: 'last-sign', hint: 'Check the sign of the Last product: ' + t(dot(B, D) + '=' + tx(f.L)) + '.' + (both ? ' A negative times a negative is <b>positive</b>.' : '') });
    if (likeTerms(f.O, f.I) && cof(f.O) * cof(f.I) < 0) {
      var h = 'Check the signs of the two middle products before you combine them: O ' + t('=' + dot(A, D) + '=' + tx(f.O)) + ' and I ' + t('=' + dot(B, C) + '=' + tx(f.I)) + ', so together they make ' + t(tx(P.add(f.O, f.I)) || '0') + '.';
      out.push({ is: P.add(f.F, f.O, P.neg(f.I), f.L), code: 'u3l3-mid-sign', hint: h });
      out.push({ is: P.add(f.F, P.neg(f.O), f.I, f.L), code: 'u3l3-mid-sign', hint: h });
    }
    return out;
  }
  function foilSol(A, B, C, D) {
    var f = foil(A, B, C, D), s4 = seq([f.F, f.O, f.I, f.L]);
    return 'F: ' + t(dot(A, C) + '=' + tx(f.F)) + ', &nbsp;O: ' + t(dot(A, D) + '=' + tx(f.O)) + ', &nbsp;I: ' + t(dot(B, C) + '=' + tx(f.I)) + ', &nbsp;L: ' + t(dot(B, D) + '=' + tx(f.L)) + '<br>' + t(s4 + (s4 !== tx(f.res) ? '=' + tx(f.res) : '')) + (s4 === tx(f.res) ? ' (no like terms to collect)' : '');
  }
  function distBinSol(A, B, C, D) {
    var f = foil(A, B, C, D), c = tx(P.add(C, D)), s4 = seq([f.F, f.O, f.I, f.L]), bs = tx(B);
    return t(pf(P.add(A, B)) + '(' + c + ')=' + pf(A) + '(' + c + ')' + (bs.charAt(0) === '-' ? '' : '+') + bs + '(' + c + ')') + '<br>' + t('=' + s4 + (s4 !== tx(f.res) ? '=' + tx(f.res) : ''));
  }
  var HB = ['Two binomials give <b>four</b> products — First, Outer, Inner, Last — then collect the like terms (usually the Outer and Inner products).', 'Check: put a small number such as ' + t('x=1') + ' into the product and into your answer — the two values must match.'];
  function expandBin(A, B, C, D, opt) {
    opt = opt || {};
    var f = foil(A, B, C, D), prodTex = br([A, B]) + br([C, D]);
    return pp((opt.pre || '') + t(prodTex), f.res, (opt.wrong || []).concat(binWrongs(A, B, C, D)), (opt.solPre || '') + (opt.dist ? distBinSol(A, B, C, D) : foilSol(A, B, C, D)), opt.hints || HB, opt.text || 'expand ' + prodTex, opt.popt);
  }

  /* ---------------- expressions as signed products (from Math 10C u3l3) ----------------
     T(s, k, f): s = +1/−1 (sign in front), k = positive number in front, f = binomial factors (bin). Lesson 3 explains every
     product with FOIL (no special-product patterns yet). */
  function bin(a, b) { return { p: P.add(a, b), tex: '(' + P.seq([a, b]) + ')', terms: [a, b] }; }
  function T(s, k, f) { return { s: s, k: k == null ? 1 : k, f: f || [] }; }
  function bodyTex(tm) { return tm.f.map(function (f) { return f.tex; }).join(''); }
  function termTex(tm, first) { var op = tm.s < 0 ? '-' : first ? '' : '+'; if (!tm.f.length) return op + tm.k; return op + (tm.k !== 1 ? tm.k : '') + bodyTex(tm); }
  function exprTex(terms) { return terms.map(function (tm, i) { return termTex(tm, i === 0); }).join(''); }
  function innerOf(tm) { if (!tm.f.length) return P.num(1); return P.mul.apply(null, tm.f.map(function (f) { return f.p; })); }
  function firstTerm(p) { var ts = P.sorted(p); return P.mono(ts[0].c, ts[0].v); }
  function isFoil(tm) { return tm.f.length === 2 && tm.f[0].terms.length === 2 && tm.f[1].terms.length === 2; }
  function termInfo(tm, first) {
    var inner = innerOf(tm), m = tm.s * tm.k, vs = [], body = bodyTex(tm), full = (tm.k !== 1 ? tm.k : '') + body;
    if (isFoil(tm)) binWrongs(tm.f[0].terms[0], tm.f[0].terms[1], tm.f[1].terms[0], tm.f[1].terms[1]).forEach(function (w) { vs.push({ p: P.scale(w.is, m), code: w.code, hint: w.hint }); });
    if (tm.f.length && tm.k !== 1) {
      var t1 = firstTerm(inner), kk = first ? m : tm.k, sg = first ? 1 : tm.s;
      if (P.count(inner) > 1) vs.push({ p: P.scale(P.add(P.scale(t1, kk), P.sub(inner, t1)), sg), code: 'k-first', hint: 'Multiply <b>every</b> term of the expansion by ' + t(kk) + ', not just the first term.' });
      vs.push({ p: P.scale(inner, tm.s), code: 'k-forgot', hint: 'Don’t forget the ' + t(kk) + ' in front of ' + t(body) + ': expand the brackets, then multiply every term by it.' });
      var both = 'The ' + t(kk) + ' multiplies the product <b>once</b>. Multiplying it into both brackets multiplies by ' + t(tm.k * tm.k) + '. Expand the brackets first, then multiply every term by ' + t(kk) + '.';
      vs.push({ p: P.scale(inner, tm.s * tm.k * tm.k), code: 'k-both', hint: both });
    }
    if (tm.s < 0 && tm.f.length) {
      var E = P.scale(inner, tm.k);
      if (P.count(E) > 1) { var e1 = firstTerm(E); vs.push({ p: P.add(P.neg(e1), P.sub(E, e1)), code: 'minus-first', hint: 'The minus sign in front of ' + t(full) + ' changes the sign of <b>every</b> term that comes out of it, not just the first. Keep the expansion in brackets, then subtract.' }); }
      vs.push({ p: E, code: 'minus-ignored', hint: 'Check the sign in front of ' + t(full) + ': ' + (first ? 'the negative multiplies every term of the expansion.' : 'that whole product is <b>subtracted</b>.') });
    }
    return { tm: tm, first: first, inner: inner, m: m, val: P.scale(inner, m), vs: vs, body: body, full: full };
  }
  function solve(infos, target) {
    var lines = [];
    infos.forEach(function (I) {
      var tm = I.tm; if (!tm.f.length) return;
      var inT = P.tex(I.inner), st = isFoil(tm) ? (function () { var a = tm.f[0].terms, b = tm.f[1].terms; return P.seq([P.mul(a[0], b[0]), P.mul(a[0], b[1]), P.mul(a[1], b[0]), P.mul(a[1], b[1])]); })() : null;
      var line = t(I.body + '=' + (st && st !== inT ? st + '=' : '') + inT);
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
  var HM = ['Expand <b>each</b> product completely first (FOIL), keep each result in brackets, then collect like terms.', 'A minus sign in front of a product changes the sign of <b>every</b> term that comes out of it. Check by putting ' + t('x=1') + ' into the question and into your answer.'];
  /* o: prompt, sol, hints, text, after, before, extra (more wrongs) */
  function ex(terms, o) {
    o = o || {};
    var A = analyse(terms, o.extra), one = terms.length === 1 && terms[0].k === 1 && terms[0].s > 0 && isFoil(terms[0]);
    var sol = o.sol || (one ? foilSol(terms[0].f[0].terms[0], terms[0].f[0].terms[1], terms[0].f[1].terms[0], terms[0].f[1].terms[1]) : A.sol);
    var p = KP.poly(o.prompt || t(A.tex), A.target, { wrong: A.wrongs, vars: A.vars, after: o.after, before: o.before }, sol, o.hints || (terms.length > 1 || terms[0].k !== 1 ? HM : HB), o.text || ('expand ' + A.tex));
    p.bad = A.wrongs.slice(0, 8).map(function (w) { return P.tex(w.is); });
    if (P.count(A.target) > 1) p.good = [P.tex(A.target, { order: 'asc' })];
    p.target = A.target;
    return p;
  }
  function B2(a, b, c, d, v) { return T(1, 1, [bin(V(a, v || 'x'), V(b)), bin(V(c, v || 'x'), V(d))]); }

  /* ---------------- figures ---------------- */
  function svgLab(s) {
    var out = '';
    s = s.replace(/\^\{(\d+)\}/g, function (m, d) { return d.split('').map(function (c) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'.charAt(+c); }).join(''); });
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      if (/[a-z]/.test(ch) && !/[a-z]/.test(s.charAt(i + 1)) && !/[a-z]/.test(s.charAt(i - 1))) out += '<tspan font-style="italic">' + ch + '</tspan>';
      else if (ch === '+') out += ' + ';
      else if (ch === '-') out += i === 0 ? '−' : ' − ';
      else out += ch;
    }
    return out;
  }
  /* a rectangle (optionally with a frame of width `frame` units around it): labels for the width (below) and height (right) */
  function rectFig(wLab, hLab, o) {
    o = o || {};
    var W = o.W || 6, H = o.H || 3.6, S = 34, fr = o.frame || 0, L = 24, R = 96, Tp = 22, Bt = 40;
    var ox = L + fr * S, oy = Tp + fr * S, w = W * S, h = H * S, tw = L + (W + 2 * fr) * S + R, th = Tp + (H + 2 * fr) * S + Bt, s = '';
    if (fr) s += '<rect x="' + L + '" y="' + Tp + '" width="' + (W + 2 * fr) * S + '" height="' + (H + 2 * fr) * S + '" fill="rgba(150,150,150,0.30)" stroke="currentColor" stroke-width="2"/>';
    s += '<rect x="' + ox + '" y="' + oy + '" width="' + w + '" height="' + h + '" fill="' + (o.fill || 'rgba(110,150,200,0.18)') + '" stroke="currentColor" stroke-width="2"/>';
    if (fr) { // garden labels just inside the garden's edges, so they don't sit on the path
      s += '<text x="' + (ox + w / 2) + '" y="' + (oy + h - 10) + '" text-anchor="middle" font-size="15" fill="currentColor">' + svgLab(wLab) + '</text>';
      s += '<text x="' + (ox + w - 8) + '" y="' + (oy + h / 2) + '" text-anchor="end" dominant-baseline="middle" font-size="15" fill="currentColor">' + svgLab(hLab) + '</text>';
    } else {
      s += '<text x="' + (ox + w / 2) + '" y="' + (oy + h + 24) + '" text-anchor="middle" font-size="16" fill="currentColor">' + svgLab(wLab) + '</text>';
      s += '<text x="' + (ox + w + 8) + '" y="' + (oy + h / 2) + '" dominant-baseline="middle" font-size="16" fill="currentColor">' + svgLab(hLab) + '</text>';
    }
    if (o.inner) s += '<text x="' + (ox + w * 0.35) + '" y="' + (oy + h * 0.3) + '" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="currentColor">' + o.inner + '</text>';
    if (fr) { // the path's width, marked across the top band
      s += '<line x1="' + (ox + w / 2) + '" y1="' + Tp + '" x2="' + (ox + w / 2) + '" y2="' + oy + '" stroke="currentColor" stroke-width="1.2"/>';
      s += '<text x="' + (ox + w / 2 + 6) + '" y="' + (Tp + fr * S / 2) + '" dominant-baseline="middle" font-size="12" fill="currentColor">path ' + (o.frLab || '') + '</text>';
    }
    return '<svg class="fig-svg" viewBox="0 0 ' + Math.ceil(tw) + ' ' + Math.ceil(th) + '" style="max-width:' + Math.round(Math.min(380, tw * 1.05)) + 'px" role="img" aria-label="' + (o.aria || 'rectangle') + '">' + s + '</svg>';
  }

  /* ---------------- question makers ---------------- */
  /* Q2 / Q15(i): the two distributing steps, then the product */
  function distSteps(prompt, A, B, C, D, opt) {
    opt = opt || {};
    var L = P.add(C, D), P1 = P.mul(A, L), P2 = P.mul(B, L), f = foil(A, B, C, D), Lt = br([C, D]), vs = P.vars(f.res);
    var bt = tx(B), fields = [pbox(t(tx(A) + Lt + '='), vs), pbox(t((bt.charAt(0) === '-' ? '(' + bt + ')' : bt) + Lt + '='), vs), pbox(opt.lastLabel || 'Simplified product', vs, { after: opt.after })];
    var p = KP.fields(prompt, fields, [chk(P1, monoWrongs(A, [C, D])), chk(P2, monoWrongs(B, [C, D])), chk(f.res, binWrongs(A, B, C, D))], [tx(P1), tx(P2), tx(f.res)],
      t(tx(A) + Lt + '=' + tx(P1)) + ', ' + t(pf(B) + Lt + '=' + tx(P2)) + ', product ' + t(tx(f.res)),
      distBinSol(A, B, C, D) + (opt.solPost || ''), ['Multiply ' + t(tx(A)) + ' by both terms of ' + t(Lt) + ', then ' + t(tx(B)) + ' by both terms.', 'Add the two results and collect the ' + t('x') + '-terms.'], opt.text || 'distribute twice');
    p.bad = [[tx(P1), tx(P2), tx(P.add(f.F, f.L))], [tx(P.add(P.mul(A, C), D)), tx(P2), tx(f.res)]];
    return p;
  }
  /* Q15(ii): the four FOIL products, then the product */
  function foilFields(prompt, A, B, C, D, opt) {
    opt = opt || {};
    var f = foil(A, B, C, D), vs = P.vars(f.res), fields = ['First', 'Outer', 'Inner', 'Last'].map(function (n) { return pbox(n, vs); }).concat([pbox(opt.lastLabel || 'Product', vs, { after: opt.after })]);
    var p = KP.fields(prompt, fields, [K.poly(f.F), K.poly(f.O), K.poly(f.I), K.poly(f.L), chk(f.res, binWrongs(A, B, C, D))],
      [tx(f.F), tx(f.O), tx(f.I), tx(f.L), tx(f.res)], 'F ' + t(tx(f.F)) + ', O ' + t(tx(f.O)) + ', I ' + t(tx(f.I)) + ', L ' + t(tx(f.L)) + '; ' + t(tx(f.res)),
      foilSol(A, B, C, D) + (opt.solPost || ''), ['First: first × first. Outer: first × last. Inner: last × first. Last: last × last.'], opt.text || 'FOIL step by step');
    p.bad = [[tx(f.F), tx(f.O), tx(f.I), tx(f.L), tx(P.add(f.F, f.L))]];
    return p;
  }

  /* "identify the error": kind = 'fl' (no middle term), 'mid' (middle signs), 'last' (last sign), 'lastadd' (last terms added), 'cancel' (O and I should cancel) */
  function slipOf(A, B, C, D, kind) {
    var f = foil(A, B, C, D);
    if (kind === 'fl') return P.add(f.F, f.L);
    if (kind === 'mid' || kind === 'cancel') { // the two middle sizes added, with one sign (the larger product's sign; the negative one for "cancel")
      var mid = Math.abs(cof(f.O)) + Math.abs(cof(f.I)), big = Math.abs(cof(f.O)) >= Math.abs(cof(f.I)) ? f.O : f.I, sg = kind === 'cancel' ? -1 : (cof(big) < 0 ? -1 : 1);
      return P.add(f.F, V(sg * mid, P.terms(f.O)[0].v), f.L);
    }
    if (kind === 'last') return P.add(f.F, f.O, f.I, P.neg(f.L));
    if (kind === 'lastadd') return P.add(f.F, f.O, f.I, P.add(B, D));
    return f.res;
  }
  function errMC(r, A, B, C, D, kind, shown) {
    var f = foil(A, B, C, D), prod = br([A, B]) + br([C, D]), mid = P.add(f.O, f.I);
    var R = {
      fl: 'Only the <b>First</b> and <b>Last</b> products were found — the Outer ' + t(tx(f.O)) + ' and Inner ' + t(tx(f.I)) + ' products (the middle term) were skipped.',
      mid: 'The middle products were combined with the wrong sign: ' + t(tx(f.O) + (cof(f.I) < 0 ? '' : '+') + tx(f.I) + '=' + tx(mid)) + ', not ' + t(tx(P.sub(shown, P.add(f.F, f.L)))) + '.',
      cancel: 'The Outer and Inner products are ' + t(tx(f.O)) + ' and ' + t(tx(f.I)) + ': they <b>cancel</b>, so there is no middle term.',
      last: 'Sign error on the <b>Last</b> product: ' + t(dot(B, D) + '=' + tx(f.L)) + '.',
      lastadd: 'The <b>Last</b> terms were added instead of multiplied: ' + t(dot(B, D) + '=' + tx(f.L)) + ', not ' + t(tx(P.add(B, D))) + '.'
    }[kind];
    var opts = [{ html: R, right: true }];
    opts.push({ html: 'The <b>First</b> product is wrong: it should be ' + t(tx(P.scale(f.F, 2))) + '.', why: 'Check the First product: ' + t(dot(A, C) + '=' + tx(f.F)) + ' — that part is right.' });
    if (kind !== 'last' && kind !== 'lastadd') opts.push({ html: 'Sign error on the <b>Last</b> product: it should be ' + t(tx(P.neg(f.L))) + '.', why: 'Check the Last product: ' + t(dot(B, D) + '=' + tx(f.L)) + ' — that part is right.' });
    else opts.push({ html: 'The middle term is wrong: it should be ' + t(tx(P.scale(mid, -1)) === '0' ? '0' : tx(P.neg(mid))) + '.', why: 'Check the middle: ' + t(tx(f.O) + (cof(f.I) < 0 ? '' : '+') + tx(f.I) + '=' + tx(mid)) + ' — that part is right.' });
    opts.push({ html: 'There is no error.', why: 'Expand ' + t(prod) + ' yourself with FOIL and compare it term by term.' });
    return KP.mc(r, 'A student wrote ' + t(prod + '=' + tx(shown)) + '.<br>Which statement describes the error?', opts,
      foilSol(A, B, C, D) + '<br>The student wrote ' + t(tx(shown)) + '. ' + R, ['Redo the four FOIL products yourself and compare each one with the student’s answer.'], 'find the error (' + kind + ')');
  }
  function errFix(A, B, C, D, shown) {
    var prod = br([A, B]) + br([C, D]);
    return expandBin(A, B, C, D, { pre: 'Give the correct expansion of ', wrong: [{ is: shown, code: 'kept-error', hint: 'That’s the student’s answer. Redo all four FOIL products and check each sign.' }], text: 'correct: ' + prod });
  }

  /* the missing binomial (Extra 16): fT = terms of the missing factor, gT = terms of the given one; missFirst = the box comes first */
  function missingFactor(fT, gT, missFirst) {
    var Fp = sumOf(fT), G = sumOf(gT), T0 = P.mul(Fp, G), f = foil(gT[0], gT[1], fT[0], fT[1]);
    var c1 = K.poly(Fp, { diag: function (S) { if (P.count(S) !== 2) return { code: 'not-binomial', hint: 'The missing factor is a binomial (two terms).' }; return { code: 'check-product', hint: 'Check by expanding: ' + t(pf(G) + pf(S) + '=' + tx(P.mul(G, S))) + ', not ' + t(tx(T0)) + '.' }; } });
    var shownL = missFirst ? '(\\square)' + pf(G) : pf(G) + '(\\square)';
    var bad1 = P.add(fT[0], P.neg(fT[1]));
    return { prompt: 'Determine the missing binomial: ' + t(shownL + '=' + tx(T0)), input: { type: 'math', keys: 'poly', vars: P.vars(T0) }, key: tx(Fp), answer: t(tx(Fp)), text: 'missing binomial: ' + tx(T0), check: c1,
      bad: [tx(bad1), tx(P.add(fT[0], V(cof(fT[1]) + 1)))],
      solution: 'First terms: ' + t(tx(gT[0]) + '\\cdot ? =' + tx(f.F)) + ', so the first term is ' + t(tx(fT[0])) + '. Last terms: ' + t(pf(gT[1]) + '\\cdot ? =' + tx(f.L)) + ', so the last term is ' + t(tx(fT[1])) + '.<br>Check the middle term: ' + t(pf(G) + pf(Fp) + '=' + seq([f.F, f.O, f.I, f.L]) + '=' + tx(T0)) + ' ✓',
      hints: ['First terms: what times ' + t(tx(gT[0])) + ' makes ' + t(tx(f.F)) + '?', 'Last terms: what times ' + t(tx(gT[1])) + ' makes ' + t(tx(f.L)) + '? Then expand to check the middle term.'] };
  }
  /* three binomials (Extra 23) */
  function threeBin(facs) {
    var Q = P.mul(facs[0], facs[1]), T0 = P.mul(Q, facs[2]), prod = facs.map(pf).join(''), qt = termsOf(Q), pieces = qt.map(function (q) { return P.mul(q, facs[2]); });
    var a = termsOf(facs[0]), b = termsOf(facs[1]), fF = foil(a[0], a[1], b[0], b[1]);
    return pp(t(prod), T0, [{ is: P.mul(P.add(fF.F, fF.L), facs[2]), code: 'fl-only', hint: 'Check your first product: ' + t(pf(facs[0]) + pf(facs[1])) + ' needs all four FOIL products, including the middle term.' },
      { is: P.add(P.mul(qt[0], facs[2]), sumOf(qt.slice(1))), code: 'first-only', hint: 'Every term of ' + t(tx(Q)) + ' must be multiplied by ' + t(pf(facs[2])) + ', not just the first one.' }],
      'First pair: ' + t(pf(facs[0]) + pf(facs[1]) + '=' + tx(Q)) + '.<br>Multiply each term by ' + t(pf(facs[2])) + ': ' + t(qt.map(function (q, i) { var s = tx(q); return (i && s.charAt(0) !== '-' ? '+' : '') + s + pf(facs[2]); }).join('')) + '<br>' + t('=' + seq(pieces.reduce(function (acc, pc) { return acc.concat(termsOf(pc)); }, [])) + '=' + tx(T0)),
      ['Multiply two of the binomials first (FOIL) to get a trinomial.', 'Then multiply each term of the trinomial by the third binomial and collect like terms.'], 'three binomials ' + prod);
  }
  /* a monomial times two binomials (Extra 4–6): m(A+B)(C+D) */
  function monoBin(m, A, B, C, D) {
    var f = foil(A, B, C, D), Q = f.res, T0 = P.mul(m, Q), qt = termsOf(Q), mt = tx(m), lhs = (mt === '-1' ? '-' : mt) + br([A, B]) + br([C, D]);
    var ws = [
      { is: P.mul(m, P.add(f.F, f.L)), code: 'fl-only', hint: 'Check the product of the two binomials: it needs all four FOIL products, including the middle term.' },
      { is: P.add(P.mul(m, qt[0]), sumOf(qt.slice(1))), code: 'k-first', hint: 'Multiply <b>every</b> term of ' + t(tx(Q)) + ' by ' + t(mt) + ', not just the first term.' },
      { is: Q, code: 'k-forgot', hint: 'Don’t forget the ' + t(mt) + ' in front: expand the binomials, then multiply every term by it.' },
      { is: P.mul(m, m, Q), code: 'k-both', hint: 'The ' + t(mt) + ' multiplies the product <b>once</b> — not into both brackets. Expand the binomials first, then multiply by ' + t(mt) + '.' }];
    if (cof(m) < 0) ws.push({ is: P.add(P.mul(m, qt[0]), P.mul(P.neg(m), sumOf(qt.slice(1)))), code: 'neg-first', hint: 'The negative sign in ' + t(mt) + ' multiplies <b>every</b> term. Check the signs after the first term.' });
    return pp(t(lhs), T0, ws, 'Binomials first: ' + t(br([A, B]) + br([C, D]) + '=' + seq([f.F, f.O, f.I, f.L]) + '=' + tx(Q)) + '.<br>Then distribute ' + t(mt) + ': ' + t(pf(m) + '(' + tx(Q) + ')=' + tx(T0)) + '.',
      ['Expand the two binomials first (FOIL) to get a trinomial.', 'Then multiply every term of the trinomial by ' + t(mt) + ': multiply the numbers and add the exponents.'], 'monomial times two binomials');
  }
  /* find a and b in (x+a)(x+b) = x² + sx + p (Extra 15) */
  function findAB(a, b) {
    var s = a + b, pr = a * b, T0 = P.mul(lin(1, a), lin(1, b));
    return { prompt: t('(x+a)(x+b)=' + tx(T0)) + '. Find the numbers ' + t('a') + ' and ' + t('b') + '.', input: { type: 'fields', fields: [nbox(t('a')), nbox(t('b'))] }, key: [String(a), String(b)], answer: t('a=' + a + ',\\ b=' + b) + ' (either order)', text: 'find a and b',
      check: function (resp) {
        resp = resp || []; var u = HW.parse.number(resp[0] || ''), v = HW.parse.number(resp[1] || '');
        if (!u.ok || !v.ok) return form('incomplete', 'Fill in both boxes with a number.');
        var x = u.value, y = v.value;
        if (x + y === s && x * y === pr) return ok();
        if (x * y === pr && x + y === -s) return wrong('pair-signs', 'Your numbers multiply to ' + t(pr) + ', but they add to ' + t(x + y) + ', not ' + t(s) + '. Change both signs.');
        if (x * y === pr) return wrong('pair-sum', 'Those multiply to ' + t(pr) + ' (the last number), but the middle coefficient is ' + t('a+b=' + s) + ': ' + t(sgnNum(x) + '+' + sgnNum(y) + '=' + (x + y)) + '. Try another factor pair of ' + t(pr) + '.');
        if (x + y === s) return wrong('pair-product', 'Those add to ' + t(s) + ', but the last number is ' + t('ab=' + pr) + ': ' + t(sgnNum(x) + '\\times ' + sgnNum(y) + '=' + x * y) + '.');
        return wrong('value', 'Expand ' + t('(x+a)(x+b)=x^{2}+(a+b)x+ab') + ': you need ' + t('ab=' + pr) + ' and ' + t('a+b=' + s) + '.');
      },
      good: [[String(b), String(a)]], bad: [[String(-a), String(-b)], [String(s), String(pr)]],
      solution: t('(x+a)(x+b)=x^{2}+bx+ax+ab=x^{2}+(a+b)x+ab') + ', so ' + t('ab=' + pr) + ' and ' + t('a+b=' + s) + '.<br>The factor pair of ' + t(pr) + ' that adds to ' + t(s) + ' is ' + t(a) + ' and ' + t(b) + ' (in either order).<br>Check: ' + t(br([X, V(a)]) + br([X, V(b)]) + '=' + tx(T0)) + ' ✓',
      hints: ['The last number is ' + t('ab') + ' and the middle coefficient is ' + t('a+b') + '.', 'List the factor pairs of ' + t(pr) + ' (signs included) and find the pair that adds to ' + t(s) + '.'] };
  }

  /* ================================================================================================ */
  HW.defineLesson({
    id: 'u3l3', unit: 3, num: '3', title: 'Multiplying Two Binomials', outcome: 'AN4',
    blurb: 'Distribute twice, or use FOIL — First, Outer, Inner, Last — then collect the like terms. Watch every sign.',
    questions: [
      { num: '1', section: 'Part A — Distributing and FOIL', stem: '<i>(Recall)</i> Use the distributive property to expand.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { var a = r.int(2, 9), b = r.int(2, 9); return expandMono(V(a), [X, V(b)]); } },
        { id: '1b', level: 'BEG', make: function (r) { var a = r.int(2, 9), b = r.int(2, 9); return expandMono(V(-a), [X, V(b)]); } },
        { id: '1c', level: 'BEG', make: function (r) { var a = r.int(2, 6), b = r.int(2, 9); return expandMono(V(a, 'x'), [X, V(b)]); } },
        { id: '1d', level: 'EMG', make: function (r) { var b = r.int(2, 20), v = r.pick(['x', 'x', 'a', 'm', 'y']); return expandMono(V(-1, v), [V(1, v), V(-b)]); } }] },
      { num: '2', stem: 'Show <b>both</b> distributing steps — distribute the whole first binomial, then distribute each of its terms — before writing the final simplified answer.', parts: ['a', 'b'].map(function (k) {
        return { id: '2' + k, level: 'BEG', make: function (r) {
          var ab = k === 'a' && r.chance(0.12) ? [4, 5] : k === 'b' && r.chance(0.12) ? [7, 2] : two(r, 2, 9), A = X, B = V(ab[0]), C = X, D = V(ab[1]);
          return distSteps(t(br([A, B]) + br([C, D]) + '=x' + br([C, D]) + '+' + ab[0] + br([C, D])), A, B, C, D, { text: 'distribute twice (x+a)(x+b)' });
        } };
      }) },
      { num: '3', stem: 'Use the distributive property or FOIL to determine each product.', parts: ['a', 'b', 'c', 'd'].map(function (k) {
        return { id: '3' + k, level: 'BEG', make: function (r) { var ab = two(r, 2, 10); return expandBin(X, V(ab[0]), X, V(ab[1])); } };
      }) },
      { num: '4', stem: 'Use FOIL to determine each product.', parts: ['a', 'b', 'c', 'd'].map(function (k, i) {
        return { id: '4' + k, level: 'BEG', make: function (r) { var a = [2, 3, 4, 5][i] + (r.chance(0.5) ? 0 : r.pick([-1, 1])), b = r.int(1, 5), c = r.int(1, 6); if (a < 2) a = 2; return expandBin(V(a, 'x'), V(b), X, V(c)); } };
      }) },
      { num: '5', stem: 'Use FOIL to determine each product.', parts: ['a', 'b', 'c', 'd'].map(function (k) {
        return { id: '5' + k, level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 5), c: r.int(2, 3), d: r.int(1, 5) }; }, function (o) { return o.a * o.d !== o.b * o.c; }); return expandBin(V(o.a, 'x'), V(o.b), V(o.c, 'x'), V(o.d)); } };
      }) },
      { num: '6', section: 'Part B — Negative Terms and Two Variables', stem: 'Expand each product. Watch your signs carefully.', parts: [
        { id: '6a', level: 'EMG', make: function (r) { var ab = two(r, 2, 9); return expandBin(X, V(-ab[0]), X, V(ab[1])); } },
        { id: '6b', level: 'EMG', make: function (r) { var ab = two(r, 2, 9); return expandBin(X, V(ab[0]), X, V(-ab[1])); } },
        { id: '6c', level: 'EMG', make: function (r) { var ab = two(r, 2, 9); return expandBin(X, V(-ab[0]), X, V(-ab[1])); } },
        { id: '6d', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 5), c: r.int(2, 9) }; }, function (o) { return o.a * o.c !== o.b; }); return expandBin(V(o.a, 'x'), V(-o.b), X, V(o.c)); } },
        { id: '6e', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 5), c: r.int(2, 9) }; }, function (o) { return o.a * o.c !== o.b; }); return expandBin(V(o.a, 'x'), V(o.b), X, V(-o.c)); } },
        { id: '6f', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 5), c: r.int(2, 4), d: r.int(1, 5) }; }, function (o) { return o.a !== o.c || o.b !== o.d; }); return expandBin(V(o.a, 'x'), V(-o.b), V(o.c, 'x'), V(-o.d)); } }] },
      { num: '7', stem: 'Expand each product, involving two variables.', parts: [
        { id: '7a', level: 'EMG', make: function (r) { var ab = two(r, 1, 7); return expandBin(X, V(ab[0], 'y'), X, V(ab[1], 'y')); } },
        { id: '7b', level: 'PRG', make: function (r) { var ab = two(r, 1, 7); return expandBin(X, V(ab[0], 'y'), X, V(-ab[1], 'y')); } },
        { id: '7c', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), c: r.int(1, 7) }; }, function (o) { return o.a !== o.c; }); return expandBin(V(o.a, 'x'), V(1, 'y'), X, V(o.c, 'y')); } }] },
      { num: '8', stem: 'Expand and simplify.', parts: [[-1, 1], [1, -1], [-1, -1], [-1, -1]].map(function (sg, i) { // booklet: (3x−4)(2x+5), (4x+3)(3x−2), (5x−2)(2x−3), (3x−1)(4x−5)
        return { id: '8' + 'abcd'.charAt(i), level: 'PRG', make: function (r) {
          var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 5), c: r.int(2, 4), d: r.int(1, 5) }; }, function (o) { return o.a * o.d * sg[1] + o.b * o.c * sg[0] !== 0 && HW.ex.gcd(o.a, o.b) === 1 && HW.ex.gcd(o.c, o.d) === 1; });
          return expandBin(V(o.a, 'x'), V(sg[0] * o.b), V(o.c, 'x'), V(sg[1] * o.d));
        } };
      }) },
      { num: '9', stem: 'Identify the error in each expansion and give the correct result.',
        shared: function (r) {
          var ab = two(r, 2, 9), cd = pickWhere(function () { return two(r, 2, 9); }, function (v) { return v[0] < v[1]; }), e = { a: r.int(2, 3), b: r.int(1, 5), c: r.int(2, 6) };
          if (r.chance(0.12)) { ab = [5, 3]; cd = [2, 7]; e = { a: 2, b: 3, c: 4 }; }
          return { a: [X, V(ab[0]), X, V(ab[1])], b: [X, V(-cd[0]), X, V(cd[1])], c: [V(e.a, 'x'), V(-e.b), X, V(-e.c)] };
        },
        parts: [['a', 'fl'], ['b', 'mid'], ['c', 'last']].map(function (q) {
          return [{ id: '9' + q[0] + 'err', sub: q[0] + ' error', level: 'EMG', make: function (r, sh) { var f = sh[q[0]]; return errMC(r, f[0], f[1], f[2], f[3], q[1], slipOf(f[0], f[1], f[2], f[3], q[1])); } },
            { id: '9' + q[0], sub: q[0] + ' fix', level: q[0] === 'a' ? 'BEG' : 'EMG', make: function (r, sh) { var f = sh[q[0]]; return errFix(f[0], f[1], f[2], f[3], slipOf(f[0], f[1], f[2], f[3], q[1])); } }];
        }).reduce(function (a, b) { return a.concat(b); }, []) },
      { num: '10', section: 'Part C — Expanding and Simplifying Further', stem: 'Expand and simplify.', parts: [
        { id: '10a', level: 'EMG', make: function (r) { var a = two(r, 1, 9), b = two(r, 1, 9); return ex([B2(1, a[0], 1, a[1]), B2(1, b[0], 1, b[1])]); } },
        { id: '10b', level: 'EMG', make: function (r) { var a = two(r, 1, 9), b = two(r, 1, 9); return ex([B2(1, a[0], 1, a[1]), B2(1, b[0], 1, b[1])]); } },
        { id: '10c', level: 'PRG', make: function (r) { var a, b; do { a = two(r, 1, 7); b = two(r, 1, 7); } while (a[1] - a[0] + b[0] - b[1] === 0); return ex([B2(1, -a[0], 1, a[1]), B2(1, b[0], 1, -b[1])]); } }] },
      { num: '11', stem: 'Expand and simplify.', parts: [
        { id: '11a', level: 'PRG', make: function (r) { var o = pickWhere(function () { return [two(r, 1, 9), two(r, 1, 6)]; }, function (o) { return o[0][0] + o[0][1] !== o[1][0] + o[1][1] && o[0][0] * o[0][1] !== o[1][0] * o[1][1]; }); return ex([B2(1, o[0][0], 1, o[0][1]), T(-1, 1, [bin(X, V(o[1][0])), bin(X, V(o[1][1]))])]); } },
        { id: '11b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return [two(r, 1, 9), two(r, 1, 6)]; }, function (o) { return o[0][0] + o[0][1] !== o[1][0] + o[1][1] && o[0][0] * o[0][1] !== o[1][0] * o[1][1]; }); return ex([B2(1, o[0][0], 1, o[0][1]), T(-1, 1, [bin(X, V(o[1][0])), bin(X, V(o[1][1]))])]); } },
        { id: '11c', level: 'ADV', make: function (r) {
          var o = pickWhere(function () { return { a: r.int(3, 9), b: r.int(1, 4), c: r.int(1, 5), d: r.int(1, 5) }; }, function (o) { return (o.a - o.b) !== (o.d - o.c) && o.a !== o.b && o.c !== o.d && o.a * o.b !== o.c * o.d; });
          if (r.chance(0.12)) o = { a: 8, b: 1, c: 2, d: 3 };
          return ex([B2(1, o.a, 1, -o.b), T(-1, 1, [bin(X, V(-o.c)), bin(X, V(o.d))])]);
        } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'EMG', make: function (r) {
          var o = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 5), c: r.int(2, 6) }; }, function (o) { return o.a * o.c - o.b > 0 && o.b !== o.a * o.c; });
          if (r.chance(0.12)) o = { a: 2, b: 3, c: 4 };
          var A = V(o.a, 'x'), B = V(-o.b), C = X, D = V(o.c), f = foil(A, B, C, D), x2 = V(o.a, { x: 2 }), L = V(-o.b * o.c);
          var opts = [{ html: t(tx(f.res)), right: true },
            { html: t(tx(P.add(x2, V(o.a * o.c + o.b, 'x'), L))), why: 'The Inner product is ' + t(dot(B, C) + '=' + tx(f.I)) + ' — it is negative, so it is subtracted from the Outer product ' + t(tx(f.O)) + '.' },
            { html: t(tx(P.add(x2, V(-(o.a * o.c - o.b), 'x'), L))), why: 'Check the sign of the middle term: ' + t(tx(f.O) + tx(f.I) + '=' + tx(P.add(f.O, f.I))) + '.' },
            { html: t(tx(P.add(x2, V(o.a * o.c - o.b, 'x'), V(o.b * o.c)))), why: 'Check the Last product: ' + t(dot(B, D) + '=' + tx(f.L)) + ' — a negative times a positive is negative.' }];
          return KP.mc(r, 'Which of the following is the correct expansion of ' + t(br([A, B]) + br([C, D])) + '?', opts, foilSol(A, B, C, D), ['Find all four FOIL products, each with its sign, then collect the middle terms.'], 'MC correct expansion');
        } }] },
      { num: '13', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '13', level: 'PRG', make: function (r) {
          var a = two(r, 2, 6), b = two(r, 2, 7), e = r.int(2, 6), g = r.int(2, 7), err = r.int(0, 3), kind = r.pick(['last', 'last', 'mid']);
          if (b[0] === b[1]) b[1]++;
          if (r.chance(0.12)) { a = [4, 3]; b = [5, 2]; e = 3; g = 5; err = 3; kind = 'last'; }
          var S = [[X, V(a[0]), X, V(a[1])], [X, V(-b[0]), X, V(b[1])], [V(2, 'x'), V(1), X, V(-e)], [V(3, 'x'), V(-2), X, V(g)]];
          var items = S.map(function (s, j) {
            var f = foil(s[0], s[1], s[2], s[3]), mid = P.add(f.O, f.I), k = j === err ? kind : null, shown = f.res;
            if (k === 'last') shown = P.add(f.F, mid, P.neg(f.L));
            if (k === 'mid') shown = P.add(f.F, P.isZero(mid) ? V(2 * Math.abs(cof(f.O)), 'x') : P.neg(mid), f.L);
            return { s: s, f: f, shown: shown, lhs: br([s[0], s[1]]) + br([s[2], s[3]]), bad: !!k, kind: k };
          });
          var opts = items.map(function (it) { return { html: t(it.lhs + '=' + tx(it.shown)), right: it.bad, why: it.bad ? null : 'Check it: ' + t(seq([it.f.F, it.f.O, it.f.I, it.f.L]) + '=' + tx(it.f.res)) + ' — this expansion is correct.' }; });
          var B0 = items[err];
          return KP.mc(r, 'Which of the following expansions is <b>incorrect</b>?', opts, 'Expand each one with FOIL. The incorrect one is ' + t(B0.lhs) + ': ' + foilSol(B0.s[0], B0.s[1], B0.s[2], B0.s[3]) + '<br>' + (B0.kind === 'last' ? 'The Last product has the wrong sign.' : 'The middle term has the wrong sign.'),
            ['Expand each product yourself, sign included, and compare.'], 'MC which expansion is wrong', true);
        } }] },
      { num: '14', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '14', level: 'PRG', make: function (r) {
          var a = two(r, 1, 7), b = two(r, 1, 6);
          if (r.chance(0.12)) { a = [5, 2]; b = [3, 1]; }
          var T0 = P.add(P.mul(lin(1, a[0]), lin(1, a[1])), P.mul(lin(1, b[0]), lin(1, b[1]))), A2 = 2, B1 = a[0] + a[1] + b[0] + b[1], C0 = a[0] * a[1] + b[0] * b[1], ans = A2 + B1 + C0;
          var ex0 = br([X, V(a[0])]) + br([X, V(a[1])]) + '+' + br([X, V(b[0])]) + br([X, V(b[1])]);
          return KP.nr('The expression ' + t(ex0) + ' can be written in the form ' + t('ax^{2}+bx+c') + '. The value of ' + t('a+b+c') + ' is ____.', ans,
            numDiag([[A2 + C0, 'fl-only', 'Each product needs its middle term too: the Outer and Inner products give the ' + t('x') + '-terms.'], [1 + a[0] + a[1] + a[0] * a[1], 'asked-other', 'That is only the first product. Expand <b>both</b> products and add them.'], [1 + B1 + C0, 'asked-other', 'Check ' + t('a') + ': there is an ' + t('x^{2}') + ' in <b>each</b> product, so ' + t('a=2') + '.']]),
            t(br([X, V(a[0])]) + br([X, V(a[1])]) + '=' + tx(P.mul(lin(1, a[0]), lin(1, a[1])))) + ' and ' + t(br([X, V(b[0])]) + br([X, V(b[1])]) + '=' + tx(P.mul(lin(1, b[0]), lin(1, b[1])))) + '.<br>Sum: ' + t(tx(T0)) + ', so ' + t('a=2,\\ b=' + B1 + ',\\ c=' + C0) + ' and ' + t('a+b+c=' + ans) + '.',
            ['Expand both products with FOIL, add them and collect like terms.', 'Then read off ' + t('a') + ', ' + t('b') + ' and ' + t('c') + ' and add them.'], 'NR a+b+c');
        } }] },
      { num: '15', stem: function (sh) { return rectFig('x+' + sh.a, 'x+' + sh.b, { aria: 'deck' }) + 'A rectangular deck has length ' + t('(x+' + sh.a + ')') + ' m and width ' + t('(x+' + sh.b + ')') + ' m. Determine an expression for its area, in ' + t('\\text{m}^{2}') + ', by each method. Both methods must agree.'; },
        shared: function (r) { var ab = two(r, 2, 9); if (r.chance(0.12)) ab = [8, 5]; return { a: Math.max(ab[0], ab[1]), b: Math.min(ab[0], ab[1]) }; },
        parts: [
          { id: '15i', sub: 'i', level: 'BEG', make: function (r, sh) { return distSteps('(i) Use the distributive property: ' + t('(x+' + sh.a + ')(x+' + sh.b + ')=x(x+' + sh.b + ')+' + sh.a + '(x+' + sh.b + ')') + '.', X, V(sh.a), X, V(sh.b), { lastLabel: 'Area', after: t('\\text{ m}^{2}'), text: 'deck area by distributing' }); } },
          { id: '15ii', sub: 'ii', level: 'BEG', make: function (r, sh) { return foilFields('(ii) Use FOIL on ' + t('(x+' + sh.a + ')(x+' + sh.b + ')') + '.', X, V(sh.a), X, V(sh.b), { lastLabel: 'Area', after: t('\\text{ m}^{2}'), solPost: ' m². Both methods give the same area — FOIL is just a checklist for the same four products.', text: 'deck area by FOIL' }); } }] },
      { num: '16', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '16', level: 'BEG', make: function (r) {
          var o = pickWhere(function () { return two(r, 1, 8); }, function (v) { return v[0] + v[1] < 10 && v[0] * v[1] < 10; });
          if (r.chance(0.12)) o = [1, 6];
          var p = o[0] + o[1], q = o[0] * o[1];
          var part = KP.fields('The area of a rectangle with length ' + t('(x+' + o[0] + ')') + ' cm and width ' + t('(x+' + o[1] + ')') + ' cm can be written as ' + t('x^{2}+px+q') + ', where ' + t('p') + ' and ' + t('q') + ' are natural numbers less than ' + t('10') + '. Enter ' + t('p') + ' and ' + t('q') + '.', [nbox(t('p')), nbox(t('q'))],
            [K.number(p, numDiag([[q, 'swap', 'That is the constant term. ' + t('p') + ' is the coefficient of ' + t('x') + ': ' + t(o[0] + 'x+' + o[1] + 'x') + '.'], [o[0], 'one-middle', 'The ' + t('x') + '-term comes from <b>two</b> products: ' + t('x\\cdot ' + o[1]) + ' and ' + t(o[0] + '\\cdot x') + '.'], [o[1], 'one-middle', 'The ' + t('x') + '-term comes from <b>two</b> products: ' + t('x\\cdot ' + o[1]) + ' and ' + t(o[0] + '\\cdot x') + '.']])),
              K.number(q, numDiag([[p, 'swap', 'That is the coefficient of ' + t('x') + '. ' + t('q') + ' is the constant term: ' + t(o[0] + '\\times ' + o[1]) + '.']]))],
            [String(p), String(q)], t('p=' + p + ',\\ q=' + q) + ' (recorded as ' + p + q + ')', 'Area ' + t('=(x+' + o[0] + ')(x+' + o[1] + ')=x^{2}+' + o[1] + 'x+' + o[0] + 'x+' + q + '=x^{2}+' + p + 'x+' + q) + ', so ' + t('p=' + p) + ' and ' + t('q=' + q) + '.', HB, 'NR area p q');
          part.bad = [[String(q), String(p)], [String(o[0]), String(q)]];
          return part;
        } }] }
    ],

    extra: [
      { num: '1', section: 'Extra practice A — Heavier Coefficients and Two Variables', stem: 'Expand and simplify. Every one of these has a coefficient in front of ' + t('x') + ' in <b>both</b> binomials, so all four FOIL products need care.', parts: [[-1, 1], [-1, -1], [1, -1], [-1, 1], [1, -1], [-1, -1]].map(function (sg, i) {
        return { id: 'e1' + 'abcdef'.charAt(i), level: 'PRG', make: function (r) {
          var hi = i < 3 ? 5 : 8, o = pickWhere(function () { return { a: r.int(2, hi), b: r.int(1, 9), c: r.int(2, i < 3 ? 4 : 5), d: r.int(1, 9) }; }, function (o) { return o.a * o.d * sg[1] + o.b * o.c * sg[0] !== 0 && HW.ex.gcd(o.a, o.b) === 1 && HW.ex.gcd(o.c, o.d) === 1; });
          return expandBin(V(o.a, 'x'), V(sg[0] * o.b), V(o.c, 'x'), V(sg[1] * o.d));
        } };
      }) },
      { num: '2', stem: 'Expand and simplify. Treat the second variable exactly like a number you cannot combine with the first — the middle terms are products of two letters and the last term carries a square.', parts: [
        { id: 'e2a', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 3), b: r.int(1, 5), d: r.int(2, 6) }; }, function (o) { return o.a * o.d !== o.b; }); return expandBin(V(o.a, 'x'), V(o.b, 'y'), X, V(-o.d, 'y')); } },
        { id: 'e2b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 4), c: r.int(2, 4) }; }, function (o) { return o.a !== o.b * o.c; }); return expandBin(V(o.a, 'a'), V(-o.b, 'b'), V(o.c, 'a'), V(1, 'b')); } },
        { id: 'e2c', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 5), c: r.int(2, 3), d: r.int(1, 6) }; }, function (o) { return o.a * o.d !== o.b * o.c; }); return expandBin(V(o.a, 'm'), V(o.b, 'n'), V(o.c, 'm'), V(-o.d, 'n')); } }] },
      { num: '3', stem: 'Expand and simplify.', parts: [
        { id: 'e3a', level: 'PRG', make: function (r) { var ab = two(r, 2, 9); return expandBin(V(ab[0], 'p'), V(-ab[1], 'q'), V(ab[0], 'p'), V(ab[1], 'q'), { hints: ['Use FOIL. Look closely at the Outer and Inner products before you collect them.', HB[1]] }); } },
        { id: 'e3b', level: 'PRG', make: function (r) { var a = r.int(2, 4), b = r.int(1, 9), c = r.int(1, 6); return expandBin(V(a, { x: 2 }), V(b), X, V(-c), { pre: '<b>Stretch.</b> ', hints: ['Use FOIL: ' + t(a + 'x^{2}\\cdot x=' + a + 'x^{3}') + ' (add the exponents).', 'None of the four products are like terms, so the answer has four terms.'] }); } },
        { id: 'e3c', level: 'PRG', make: function (r) { var a = r.int(1, 9), b = r.int(1, 9); return expandBin(X, V(a), V(1, { x: 2 }), V(-b), { pre: '<b>Stretch.</b> ', hints: ['Use FOIL: ' + t('x\\cdot x^{2}=x^{3}') + '.', 'None of the four products are like terms, so the answer has four terms (write them in descending order of degree if you like).'] }); } }] },
      { num: '4', section: 'Extra practice B — A Monomial in Front', stem: 'Each expression is a monomial multiplied by <b>two</b> binomials. Expand the two binomials first, then distribute the monomial through the trinomial you get.', parts: [
        { id: 'e4a', level: 'PRG', make: function (r) { var k = r.int(2, 5), ab = two(r, 1, 7); return monoBin(V(k, 'x'), X, V(ab[0]), X, V(-ab[1])); } },
        { id: 'e4b', level: 'PRG', make: function (r) { var k = r.int(2, 4), ab = two(r, 1, 7); return monoBin(V(-k, 'x'), X, V(-ab[0]), X, V(ab[1])); } },
        { id: 'e4c', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { k: r.int(2, 5), b: r.int(1, 5), c: r.int(1, 5) }; }, function (o) { return 2 * o.c !== o.b; }); return monoBin(V(o.k, 'y'), V(2, 'y'), V(-o.b), V(1, 'y'), V(o.c)); } },
        { id: 'e4d', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { k: r.int(2, 6), b: r.int(1, 5), c: r.int(2, 9) }; }, function (o) { return 2 * o.c !== o.b; }); return monoBin(V(-o.k), V(2, 'x'), V(-o.b), X, V(-o.c)); } }] },
      { num: '5', stem: function (sh) { return 'Ravi expanded ' + t(sh.lhs) + ' by first multiplying ' + t(sh.k + 'x') + ' by ' + t('(x+' + sh.a + ')') + ', and then multiplying that result by ' + t('(x-' + sh.b + ')') + '. Ali expanded the two binomials first and then distributed the ' + t(sh.k + 'x') + '.'; },
        shared: function (r) { var k = r.int(2, 5), ab = two(r, 1, 7); if (r.chance(0.12)) { k = 3; ab = [2, 5]; } var m = V(k, 'x'), b1 = lin(1, ab[0]), b2 = lin(1, -ab[1]); return { k: k, a: ab[0], b: ab[1], m: m, b1: b1, b2: b2, lhs: k + 'x(x+' + ab[0] + ')(x-' + ab[1] + ')', T: P.mul(m, b1, b2) }; },
        parts: [
          { id: 'e5a', sub: 'a', level: 'PRG', make: function (r, sh) {
            var R1 = P.mul(sh.m, sh.b1), rt = termsOf(R1), f = foil(rt[0], rt[1], X, V(-sh.b));
            var p = KP.fields('Follow Ravi’s way.', [pbox(t(sh.k + 'x(x+' + sh.a + ')='), ['x']), pbox(t('(' + tx(R1) + ')(x-' + sh.b + ')='), ['x'])],
              [chk(R1, monoWrongs(sh.m, [X, V(sh.a)])), chk(sh.T, binWrongs(rt[0], rt[1], X, V(-sh.b)))], [tx(R1), tx(sh.T)], t(tx(R1)) + ', then ' + t(tx(sh.T)),
              t(sh.k + 'x(x+' + sh.a + ')=' + tx(R1)) + '<br>' + t('(' + tx(R1) + ')(x-' + sh.b + ')=' + seq([f.F, f.O, f.I, f.L]) + '=' + tx(sh.T)), ['Multiply ' + t(sh.k + 'x') + ' by both terms of ' + t('(x+' + sh.a + ')') + '.', 'Then FOIL the binomial you get with ' + t('(x-' + sh.b + ')') + ': ' + t(sh.k + 'x^{2}\\cdot x=' + sh.k + 'x^{3}') + '.'], 'Ravi’s way');
            p.bad = [[tx(R1), tx(P.mul(sh.m, sh.m, sh.b1, sh.b2))]];
            return p;
          } },
          { id: 'e5b', sub: 'b', level: 'PRG', make: function (r, sh) {
            var Q = P.mul(sh.b1, sh.b2);
            var p = KP.fields('Follow Ali’s way.', [pbox(t('(x+' + sh.a + ')(x-' + sh.b + ')='), ['x']), pbox(t(sh.k + 'x(' + tx(Q) + ')='), ['x'])],
              [chk(Q, binWrongs(X, V(sh.a), X, V(-sh.b))), chk(sh.T, monoWrongs(sh.m, termsOf(Q)))], [tx(Q), tx(sh.T)], t(tx(Q)) + ', then ' + t(tx(sh.T)),
              foilSol(X, V(sh.a), X, V(-sh.b)) + '<br>' + t(sh.k + 'x(' + tx(Q) + ')=' + tx(sh.T)), ['FOIL the two binomials first.', 'Then multiply every term of the trinomial by ' + t(sh.k + 'x') + '.'], 'Ali’s way');
            p.bad = [[tx(Q), tx(P.add(P.mul(sh.m, termsOf(Q)[0]), sumOf(termsOf(Q).slice(1))))]];
            return p;
          } },
          { id: 'e5c', sub: 'c', level: 'EMG', make: function (r, sh) {
            return KP.mc(r, 'Do Ravi and Ali get the same answer? Why?', [
              { html: 'Yes. Multiplication can be grouped and ordered in any way, so the three factors can be multiplied in any order.', right: true },
              { html: 'No. Ravi’s answer has an ' + t('x^{3}') + ' term but Ali’s does not.', why: 'Both answers start with ' + t(sh.k + 'x^{3}') + ': in Ali’s way, ' + t(sh.k + 'x\\cdot x^{2}=' + sh.k + 'x^{3}') + '.' },
              { html: 'Yes, but only because the numbers in this question happen to work out.', why: 'It always works: the order in which you multiply factors never changes the product.' },
              { html: 'No. The monomial must always be multiplied last.', why: 'You may multiply in any order — compare your two answers in (a) and (b).' }],
              'Both give ' + t(tx(sh.T)) + '. Multiplication is commutative and associative: the factors ' + t(sh.k + 'x') + ', ' + t('(x+' + sh.a + ')') + ' and ' + t('(x-' + sh.b + ')') + ' can be grouped in any order.', ['Compare your two answers from (a) and (b).'], 'order does not matter (MC)');
          } }] },
      { num: '6', stem: function (sh) { return 'Compare ' + t(sh.k + 'x(x+' + sh.a + ')(x+' + sh.b + ')') + ' with ' + t(sh.k + '(x+' + sh.a + ')(x+' + sh.b + ')') + '.'; },
        shared: function (r) { var ab = two(r, 1, 6); if (r.chance(0.12)) return { k: 2, a: 1, b: 3 }; return { k: r.int(2, 4), a: ab[0], b: ab[1] }; },
        parts: [
          { id: 'e6a', sub: 'a', level: 'PRG', make: function (r, sh) { return monoBin(V(sh.k, 'x'), X, V(sh.a), X, V(sh.b)); } },
          { id: 'e6b', sub: 'b', level: 'EMG', make: function (r, sh) { return monoBin(V(sh.k), X, V(sh.a), X, V(sh.b)); } },
          { id: 'e6c', sub: 'c', level: 'EMG', make: function (r, sh) {
            var A = P.mul(V(sh.k), lin(1, sh.a), lin(1, sh.b)), Bx = P.mul(V(sh.k, 'x'), lin(1, sh.a), lin(1, sh.b));
            return KP.mc(r, 'Exactly what does the extra factor of ' + t('x') + ' do to each term of the answer?', [
              { html: 'It multiplies every term by ' + t('x') + ', so every exponent goes up by ' + t('1') + ' and the coefficients stay the same.', right: true },
              { html: 'It doubles every coefficient.', why: 'Compare the coefficients of your two answers: they are the same numbers.' },
              { html: 'It adds one extra ' + t('x') + '-term to the answer.', why: 'Both answers have three terms. Each term changes — none is added.' },
              { html: 'It changes only the first term.', why: 'The ' + t('x') + ' multiplies <b>every</b> term: compare all three pairs of terms.' }],
              t(sh.k + '(x+' + sh.a + ')(x+' + sh.b + ')=' + tx(A)) + ' and ' + t(sh.k + 'x(x+' + sh.a + ')(x+' + sh.b + ')=' + tx(Bx)) + '. The extra ' + t('x') + ' multiplies every term, raising the degree of each term by one.', ['Line up your answers from (a) and (b) term by term.'], 'extra factor x (MC)');
          } }] },
      { num: '7', section: 'Extra practice C — Two Products at Once', stem: 'Expand <b>both</b> products completely before you collect like terms. A subtraction sign in front of a product flips the sign of all four of its terms.', parts: [
        { id: 'e7a', level: 'PRG', make: function (r) { var o = pickWhere(function () { return [two(r, 2, 9), two(r, 1, 5)]; }, function (o) { return o[0][0] + o[0][1] !== o[1][0] + o[1][1] && o[0][0] * o[0][1] !== o[1][0] * o[1][1]; }); return ex([B2(1, o[0][0], 1, o[0][1]), T(-1, 1, [bin(X, V(o[1][0])), bin(X, V(o[1][1]))])]); } },
        { id: 'e7b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(3, 9), b: r.int(1, 5), c: r.int(2, 7), d: r.int(2, 8) }; }, function (o) { return o.a - o.b !== o.c - o.d && o.c !== o.d && o.a * o.b !== o.c * o.d; }); return ex([B2(1, o.a, 1, -o.b), T(-1, 1, [bin(X, V(o.c)), bin(X, V(-o.d))])]); } },
        { id: 'e7c', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 3), b: r.int(1, 4), c: r.int(1, 6), d: r.int(1, 5), e: r.int(1, 5) }; }, function (o) { return o.a * o.c + o.b !== o.d + o.e && o.b * o.c !== o.d * o.e && o.d !== o.e; }); return ex([B2(o.a, o.b, 1, o.c), T(-1, 1, [bin(X, V(o.d)), bin(X, V(o.e))])]); } },
        { id: 'e7d', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 5), c: r.int(1, 6), d: r.int(1, 5), e: r.int(2, 9) }; }, function (o) { return o.a * o.c !== o.b && o.d !== o.e; }); return ex([B2(o.a, -o.b, 1, o.c), B2(1, -o.d, 1, o.e)]); } }] },
      { num: '8', stem: 'Expand and simplify.', parts: [
        { id: 'e8a', level: 'ADV', make: function (r) {
          // booklet: (4x−3)(2x+1) − (3x+2)(x−5): (ax−b)(cx+d) − (ex+g)(x−f)
          var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 5), c: r.int(2, 3), d: r.int(1, 3), e: r.int(2, 4), g: r.int(1, 4), f: r.int(1, 6) }; }, function (o) {
            var P1 = P.mul(lin(o.a, -o.b), lin(o.c, o.d)), P2 = P.mul(lin(o.e, o.g), lin(1, -o.f)), D = P.sub(P1, P2);
            return P.count(D) === 3 && P.count(P1) === 3 && P.count(P2) === 3 && HW.ex.gcd(o.a, o.b) === 1 && HW.ex.gcd(o.e, o.g) === 1;
          });
          if (r.chance(0.12)) o = { a: 4, b: 3, c: 2, d: 1, e: 3, g: 2, f: 5 };
          return ex([B2(o.a, -o.b, o.c, o.d), T(-1, 1, [bin(V(o.e, 'x'), V(o.g)), bin(X, V(-o.f))])]);
        } },
        { id: 'e8b', level: 'ADV', make: function (r) {
          var o = pickWhere(function () { return { k: r.int(2, 3), a: r.int(1, 6), b: r.int(1, 5), j: r.int(2, 4), c: r.int(1, 4), d: r.int(1, 4) }; }, function (o) { return o.k !== o.j && o.a !== o.b && o.c !== o.d && o.k * (o.a - o.b) !== o.j * (o.c - o.d) && o.k * o.a * o.b !== o.j * o.c * o.d; });
          return ex([T(1, o.k, [bin(X, V(o.a)), bin(X, V(-o.b))]), T(-1, o.j, [bin(X, V(o.c)), bin(X, V(-o.d))])]);
        } }] },
      { num: '9', stem: 'In Extra 7(a) the ' + t('x^{2}') + ' terms vanished completely.',
        shared: function (r) { var o = pickWhere(function () { return [two(r, 1, 9), two(r, 1, 6)]; }, function (o) { return o[0][0] + o[0][1] !== o[1][0] + o[1][1]; }); if (r.chance(0.12)) o = [[7, 1], [4, 2]]; return { a: o[0], b: o[1] }; },
        parts: [
          { id: 'e9a', sub: 'a', level: 'PRG', make: function (r, sh) { var p = ex([B2(1, sh.a[0], 1, sh.a[1]), T(-1, 1, [bin(X, V(sh.b[0])), bin(X, V(sh.b[1]))])]); p.prompt = 'Expand ' + p.prompt + ' and show that the same thing happens.'; return p; } },
          { id: 'e9b', sub: 'b', level: 'EMG', make: function (r, sh) {
            return KP.mc(r, 'In (a), ' + t('(x+' + sh.a[0] + ')(x+' + sh.a[1] + ')-(x+' + sh.b[0] + ')(x+' + sh.b[1] + ')') + ' lost its ' + t('x^{2}') + ' term. Why does subtracting any two products of the form ' + t('(x+a)(x+b)-(x+c)(x+d)') + ' always remove the ' + t('x^{2}') + ' term?', [
              { html: 'Each First product is ' + t('x\\cdot x=x^{2}') + ', so both expansions start with the same ' + t('x^{2}') + '; subtracting removes it.', right: true },
              { html: 'Because the Last products ' + t('ab') + ' and ' + t('cd') + ' always cancel.', why: 'The Last products are usually different numbers — in (a) they don’t cancel. Look at the First products.' },
              { html: 'Because the Outer and Inner products cancel.', why: 'Those make the ' + t('x') + '-terms, not the ' + t('x^{2}') + ' term. Look at the First products.' },
              { html: 'It only happens when ' + t('a+b=c+d') + '.', why: 'In (a) the ' + t('x^{2}') + ' terms cancelled with different sums. Look at the First products.' }],
              'The First product of each is ' + t('x\\cdot x=x^{2}') + '. So ' + t('(x+a)(x+b)-(x+c)(x+d)=(x^{2}+\\ldots)-(x^{2}+\\ldots)') + ' and the ' + t('x^{2}') + ' terms always cancel, leaving at most a linear expression.', ['Which FOIL product makes the ' + t('x^{2}') + ' term? Is it the same in both products?'], 'why x^2 cancels (MC)');
          } }] },
      { num: '10', section: 'Extra practice D — Checking, Errors, and a Shortcut Worth Noticing', stem: function (sh) { return '<b>Error analysis.</b> A student writes ' + t('(x+' + sh.a + ')(x+' + sh.b + ')=x^{2}+' + sh.a * sh.b) + '. This is the single most common mistake in this course.'; },
        shared: function (r) { var ab = two(r, 2, 9); if (r.chance(0.12)) ab = [3, 4]; return { a: ab[0], b: ab[1] }; },
        parts: [
          { id: 'e10a', sub: 'a', level: 'BEG', make: function (r, sh) {
            return KP.mc(r, 'Which two of the four FOIL products were left out?', [
              { html: 'The <b>Outer</b> and <b>Inner</b> products, ' + t(sh.b + 'x') + ' and ' + t(sh.a + 'x') + '.', right: true },
              { html: 'The <b>First</b> and <b>Last</b> products.', why: 'Those are the two the student <b>did</b> find: ' + t('x^{2}') + ' and ' + t(sh.a * sh.b) + '.' },
              { html: 'The <b>First</b> and <b>Outer</b> products.', why: 'The First product ' + t('x^{2}') + ' is in the student’s answer.' },
              { html: 'The <b>Inner</b> and <b>Last</b> products.', why: 'The Last product ' + t(sh.a * sh.b) + ' is in the student’s answer.' }],
              'F ' + t('x^{2}') + ' and L ' + t(sh.a * sh.b) + ' are there; the Outer product ' + t('x\\cdot ' + sh.b + '=' + sh.b + 'x') + ' and the Inner product ' + t(sh.a + '\\cdot x=' + sh.a + 'x') + ' are missing.', ['Write out all four FOIL products and tick off the ones in the student’s answer.'], 'which products were left out (MC)');
          } },
          { id: 'e10b', sub: 'b', level: 'BEG', make: function (r, sh) { return expandBin(X, V(sh.a), X, V(sh.b), { pre: 'Give the correct expansion of ', text: 'correct (x+a)(x+b)' }); } },
          { id: 'e10c', sub: 'c', level: 'BEG', make: function (r, sh) {
            var s = 1 + sh.a * sh.b, c = (1 + sh.a) * (1 + sh.b);
            var p = KP.fields('Substitute ' + t('x=1') + ' into the student’s answer and into the correct expansion to show they are different.', [nbox(t('x^{2}+' + sh.a * sh.b + '=')), nbox(t(tx(P.mul(lin(1, sh.a), lin(1, sh.b))) + '='))],
              [K.number(s, numDiag([[c, 'lhs-value', 'That is the value of the correct expansion. Put ' + t('x=1') + ' into the student’s ' + t('x^{2}+' + sh.a * sh.b) + '.']])), K.number(c, numDiag([[s, 'lhs-value', 'That is the student’s value. Put ' + t('x=1') + ' into the correct expansion.']]))],
              [String(s), String(c)], t(s) + ' and ' + t(c),
              'Student: ' + t('1^{2}+' + sh.a * sh.b + '=' + s) + '. Correct: ' + t('1^{2}+' + (sh.a + sh.b) + '(1)+' + sh.a * sh.b + '=' + c) + ', and the product ' + t('(1+' + sh.a + ')(1+' + sh.b + ')=' + (1 + sh.a) + '\\times ' + (1 + sh.b) + '=' + c) + ' agrees. Since ' + t(s + '\\neq ' + c) + ', the student’s answer is wrong.',
              ['Replace every ' + t('x') + ' with ' + t('1') + ': ' + t('x^{2}=1') + '.'], 'check at x=1');
            p.bad = [[String(c), String(s)]];
            return p;
          } }] },
      { num: '11', stem: 'Identify the error in each expansion and give the correct result.',
        shared: function (r) {
          var a = pickWhere(function () { return { p: r.int(2, 3), q: r.int(2, 7), s: r.int(2, 4), u: r.int(2, 7) }; }, function (o) { return o.p !== o.s && HW.ex.gcd(o.p, o.q) === 1 && HW.ex.gcd(o.s, o.u) === 1; });
          var n = r.int(2, 12), lv = r.pick(['x', 'x', 'y', 'a', 'm']), c = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 5), d: r.int(2, 6) }; }, function (o) { return o.b + o.d !== o.b * o.d; });
          if (r.chance(0.12)) { a = { p: 2, q: 5, s: 3, u: 4 }; n = 6; c = { a: 3, b: 2, d: 5 }; lv = 'x'; }
          return { a: [V(a.p, 'x'), V(-a.q), V(a.s, 'x'), V(-a.u)], b: [V(1, lv), V(n), V(1, lv), V(-n)], c: [V(c.a, 'x'), V(c.b), X, V(c.d)] };
        },
        parts: [['a', 'last'], ['b', 'cancel'], ['c', 'lastadd']].map(function (q) {
          return [{ id: 'e11' + q[0] + 'err', sub: q[0] + ' error', level: 'EMG', make: function (r, sh) { var f = sh[q[0]]; return errMC(r, f[0], f[1], f[2], f[3], q[1], slipOf(f[0], f[1], f[2], f[3], q[1])); } },
            { id: 'e11' + q[0], sub: q[0] + ' fix', level: q[0] === 'c' ? 'BEG' : 'EMG', make: function (r, sh) { var f = sh[q[0]]; return errFix(f[0], f[1], f[2], f[3], slipOf(f[0], f[1], f[2], f[3], q[1])); } }];
        }).reduce(function (a, b) { return a.concat(b); }, []) },
      { num: '12', stem: function (sh) { return '<b>Substitution check.</b> Expand ' + t('(' + sh.a + 'x-' + sh.b + ')(' + sh.c + 'x+' + sh.d + ')') + ', then check it at ' + t('x=' + sh.x) + '.'; },
        shared: function (r) { var o = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 5), c: r.int(2, 3), d: r.int(1, 6), x: r.int(2, 3) }; }, function (o) { return o.a * o.d !== o.b * o.c && o.a * o.x - o.b > 0; }); if (r.chance(0.12)) o = { a: 3, b: 4, c: 2, d: 5, x: 2 }; return o; },
        parts: [
          { id: 'e12a', sub: 'a', level: 'EMG', make: function (r, sh) { return expandBin(V(sh.a, 'x'), V(-sh.b), V(sh.c, 'x'), V(sh.d), { pre: 'Expand ', text: 'expand for substitution check' }); } },
          { id: 'e12b', sub: 'b', level: 'BEG', make: function (r, sh) {
            var T0 = P.mul(lin(sh.a, -sh.b), lin(sh.c, sh.d)), v = P.at(T0, { x: sh.x }), x = sh.x, l1 = sh.a * x - sh.b, l2 = sh.c * x + sh.d;
            var p = KP.fields('Evaluate the <b>original</b> product and your <b>expanded</b> answer, both at ' + t('x=' + x) + '.', [nbox('Original product'), nbox('Expanded answer')],
              [K.number(v, numDiag([[l1 + l2, 'not-subst', 'The two brackets are <b>multiplied</b>: ' + t(l1 + '\\times ' + l2) + '.']])), K.number(v, numDiag([[P.at(P.mul(lin(sh.a, sh.b), lin(sh.c, sh.d)), { x: x }), 'sign', 'Check the signs in your expansion first.'], [P.coef(T0, { x: 2 })[0] * x + P.coef(T0, { x: 1 })[0] * x + P.constant(T0)[0], 'not-subst', t('x^{2}') + ' means ' + t(x + '^{2}=' + x * x) + '.']]))],
              [String(v), String(v)], 'both ' + t(v),
              'Original: ' + t('(' + sh.a + '(' + x + ')-' + sh.b + ')(' + sh.c + '(' + x + ')+' + sh.d + ')=(' + l1 + ')(' + l2 + ')=' + v) + '.<br>Expanded: ' + t(tx(T0).replace(/x/g, '(' + x + ')') + '=' + v) + ' ✓ The values match.',
              ['Replace every ' + t('x') + ' with ' + t(x) + '. In the original, work out each bracket first, then multiply.'], 'values at x');
            p.bad = [[String(l1 + l2), String(v)]];
            return p;
          } },
          { id: 'e12c', sub: 'c', level: 'EMG', make: function (r) {
            return KP.mc(r, 'The two values match. Why is that strong evidence that the expansion is right, but not a proof?', [
              { html: 'Two different expressions can still happen to agree at one value of ' + t('x') + '; a full, careful expansion is what proves they are equal for <b>every</b> ' + t('x') + '.', right: true },
              { html: 'It is a proof: if the values match at one ' + t('x') + ', the expressions are always equal.', why: 'Not quite: ' + t('x^{2}') + ' and ' + t('x') + ' agree at ' + t('x=1') + ' but are different expressions.' },
              { html: 'It isn’t evidence at all, because ' + t('x') + ' could be any number.', why: 'A match is good evidence — a wrong expansion usually gives a different value. It just isn’t a proof.' },
              { html: 'Substitution only works for ' + t('x=0') + '.', why: 'Any value can be substituted. (In fact ' + t('x=0') + ' is a weak check: it only tests the constant term.)' }],
              'A matching value rules out most mistakes, but two different polynomials can agree at a single point (for example ' + t('x^{2}') + ' and ' + t('x') + ' at ' + t('x=1') + '). Expanding correctly is what shows the two are equal for every ' + t('x') + '.', ['Can two different expressions give the same value for one particular ' + t('x') + '?'], 'evidence vs proof (MC)');
          } }] },
      { num: '13', stem: function (sh) { return 'Use a substitution check at ' + t('x=3') + ' to decide whether each expansion is correct.<br>(a) ' + t(sh.a.lhs + '=' + tx(sh.a.shown)) + ' &nbsp;&nbsp; (b) ' + t(sh.b.lhs + '=' + tx(sh.b.shown)); },
        shared: function (r) {
          var p = r.int(1, 4), q = pickWhere(function () { return r.int(2, 9); }, function (v) { return v !== p; }), c = r.int(2, 3), d = r.int(1, 7), e = pickWhere(function () { return r.int(2, 6); }, function (v) { return v * c !== d && v !== 3; });
          if (r.chance(0.12)) { p = 1; q = 8; c = 2; d = 3; e = 4; }
          var A = { f: [X, V(-p), X, V(q)] }, Bq = { f: [V(c, 'x'), V(d), X, V(-e)] };
          [A, Bq].forEach(function (o) { var f = foil(o.f[0], o.f[1], o.f[2], o.f[3]); o.T = f.res; o.lhs = br([o.f[0], o.f[1]]) + br([o.f[2], o.f[3]]); });
          A.shown = A.T; Bq.shown = P.add(Bq.T, P.scale(foil(Bq.f[0], Bq.f[1], Bq.f[2], Bq.f[3]).L, -2));
          return { a: A, b: Bq };
        },
        parts: ['a', 'b'].map(function (k) {
          var list = [{ id: 'e13' + k, sub: k + ' values', level: 'BEG', make: function (r, sh) {
              var o = sh[k], L = P.at(o.T, { x: 3 }), R = P.at(o.shown, { x: 3 }), f = o.f, l1 = P.at(P.add(f[0], f[1]), { x: 3 }), l2 = P.at(P.add(f[2], f[3]), { x: 3 });
              var p = KP.fields('(' + k + ') Evaluate both sides of ' + t(o.lhs + '=' + tx(o.shown)) + ' at ' + t('x=3') + '.', [nbox('Left side'), nbox('Right side')],
                [K.number(L, numDiag([[l1 + l2, 'not-subst', 'The brackets are multiplied: ' + t(sgnNum(l1) + '\\times ' + sgnNum(l2)) + '.']])), K.number(R, numDiag([[L === R ? NaN : L, 'lhs-value', 'That is the value of the left side. Put ' + t('x=3') + ' into ' + t(tx(o.shown)) + '.']]))],
                [String(L), String(R)], 'left ' + t(L) + ', right ' + t(R),
                'Left: ' + t('(' + tx(P.add(f[0], f[1])).replace(/x/g, '(3)') + ')(' + tx(P.add(f[2], f[3])).replace(/x/g, '(3)') + ')=(' + l1 + ')(' + l2 + ')=' + L) + '.<br>Right: ' + t(tx(o.shown).replace(/x/g, '(3)') + '=' + R) + '.',
                ['Replace every ' + t('x') + ' with ' + t('3') + '. ' + t('x^{2}=9') + '.'], 'substitution values ' + k);
              p.bad = [[String(R + 1), String(R)]];
              return p;
            } },
            { id: 'e13' + k + 'tf', sub: k + ' verdict', level: 'BEG', make: function (r, sh) {
              var o = sh[k], L = P.at(o.T, { x: 3 }), R = P.at(o.shown, { x: 3 }), good = P.eq(o.T, o.shown);
              return KP.tf(r, '(' + k + ') The expansion ' + t(o.lhs + '=' + tx(o.shown)) + ' is correct.', good, good ? 'At ' + t('x=3') + ' both sides give ' + t(L) + ' — the check passes.' : 'At ' + t('x=3') + ' the left side is ' + t(L) + ' but the right side is ' + t(R) + ' — they don’t match.',
                'At ' + t('x=3') + ': left ' + t(L) + ', right ' + t(R) + '. ' + (good ? 'They match, so the expansion checks: <b>true</b>.' : 'They differ, so the expansion is wrong: <b>false</b>.'), ['Compare your two values from the previous part.'], 'verdict ' + k);
            } }];
          if (k === 'b') list.push({ id: 'e13bfix', sub: 'b fix', level: 'EMG', make: function (r, sh) { var f = sh.b.f; return expandBin(f[0], f[1], f[2], f[3], { pre: '(b) Expand it properly: ', wrong: [{ is: sh.b.shown, code: 'kept-error', hint: 'That is the expansion that failed the check. Look at the sign of the Last product.' }], text: 'fix after check' }); } });
          return list;
        }).reduce(function (a, b) { return a.concat(b); }, []) },
      { num: '14', stem: '<b>A shortcut to come.</b> Expand each product the long way with FOIL.', parts: [
        { id: 'e14a', level: 'BEG', make: function (r) { var n = r.int(2, 12), v = r.pick(['x', 'x', 'y', 'a', 'm']); return expandBin(V(1, v), V(n), V(1, v), V(n)); } },
        { id: 'e14b', level: 'EMG', make: function (r) { var n = r.int(2, 12), v = r.pick(['x', 'x', 'y', 'a', 'm']); return expandBin(V(1, v), V(-n), V(1, v), V(-n)); } },
        { id: 'e14c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 6), b: r.int(1, 7) }; }, function (o) { return HW.ex.gcd(o.a, o.b) === 1; }); return expandBin(V(o.a, 'x'), V(o.b), V(o.a, 'x'), V(o.b)); } },
        { id: 'e14d', level: 'EMG', make: function (r) {
          var a = r.int(2, 9);
          return KP.mc(r, 'Look at your three answers beside the binomials that produced them. Which rule describes ' + t('(a+b)(a+b)') + '?', [
            { html: t('a^{2}+2ab+b^{2}') + ': square the first term, square the second term, and the middle term is <b>twice</b> their product.', right: true },
            { html: t('a^{2}+b^{2}') + ': square each term.', why: 'Check with (a): ' + t('(x+' + a + ')(x+' + a + ')') + ' has a middle term ' + t(2 * a + 'x') + '.' },
            { html: t('a^{2}+ab+b^{2}') + ': the middle term is the product of the two terms.', why: 'The Outer and Inner products are <b>both</b> ' + t('ab') + ', so the middle term is ' + t('2ab') + '.' },
            { html: t('a^{2}-b^{2}') + ': the middle terms cancel.', why: 'They cancel only when one bracket has a minus sign and the other a plus. Here both Outer and Inner are ' + t('ab') + ', so they add.' }],
            'In ' + t('(a+b)(a+b)') + ': F ' + t('=a^{2}') + ', O ' + t('=ab') + ', I ' + t('=ab') + ', L ' + t('=b^{2}') + ', so ' + t('(a+b)(a+b)=a^{2}+2ab+b^{2}') + '. For example ' + t('(x+' + a + ')(x+' + a + ')=x^{2}+' + 2 * a + 'x+' + a * a) + '. This is the shortcut you will meet in Lesson 4.', ['Compare the middle term of each answer with the two terms of its binomial.'], 'the square pattern (MC)');
        } }] },
      { num: '15', section: 'Extra practice E — Working Backwards', stem: 'Find the numbers ' + t('a') + ' and ' + t('b') + ' in each case. <i>Hint:</i> the last number is ' + t('ab') + ' and the middle coefficient is ' + t('a+b') + ' — look for a factor pair of the last number that adds to the middle coefficient.', parts: [
        { id: 'e15a', level: 'PRG', make: function (r) { var ab = two(r, 2, 9); return findAB(ab[0], ab[1]); } },
        { id: 'e15b', level: 'ADV', make: function (r) { var o = pickWhere(function () { return two(r, 2, 9); }, function (v) { return v[0] > v[1]; }); return findAB(o[0], -o[1]); } },
        { id: 'e15c', level: 'ADV', make: function (r) { var ab = two(r, 2, 9); return findAB(-ab[0], -ab[1]); } }] },
      { num: '16', stem: 'Determine the missing binomial in each product.', parts: [
        { id: 'e16a', level: 'MAS', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 3), b: r.int(1, 5), c: r.int(2, 4), d: r.int(1, 7) }; }, function (o) { return o.a !== o.c && HW.ex.gcd(o.a, o.b) === 1 && HW.ex.gcd(o.c, o.d) === 1 && o.a * o.d !== o.b * o.c; }); if (r.chance(0.12)) o = { a: 2, b: 3, c: 3, d: 4 }; return missingFactor([V(o.c, 'x'), V(-o.d)], [V(o.a, 'x'), V(o.b)], false); } },
        { id: 'e16b', level: 'MAS', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 7), d: r.int(2, 9) }; }, function (o) { return HW.ex.gcd(o.a, o.b) === 1 && o.a * o.d !== o.b; }); if (r.chance(0.12)) o = { a: 4, b: 3, d: 5 }; return missingFactor([V(o.a, 'x'), V(o.b)], [X, V(-o.d)], true); } },
        { id: 'e16c', level: 'ADV', make: function (r) { var o = pickWhere(function () { return two(r, 2, 9); }, function (v) { return true; }); return missingFactor([X, V(-o[1])], [X, V(o[0])], false); } }] },
      { num: '17', stem: '', parts: [
        { id: 'e17', level: 'ADV', make: function (r) {
          var m = r.int(2, 15), sk = r.pick([1, -1]), kFirst = r.chance(0.5); if (r.chance(0.12)) { m = 6; sk = 1; kFirst = true; }
          var kB = '(x' + (sk > 0 ? '+' : '-') + 'k)', oB = '(x' + (sk > 0 ? '-' : '+') + m + ')', prod = kFirst ? kB + oB : oB + kB;
          var kV = '(x' + (sk > 0 ? '+' : '-') + m + ')', fin = kFirst ? kV + oB : oB + kV, coefTex = sk > 0 ? '(k-' + m + ')' : '(' + m + '-k)';
          var exp = sk > 0 ? 'x^{2}-' + m + 'x+kx-' + m + 'k' : 'x^{2}+' + m + 'x-kx-' + m + 'k';
          var p = KP.fields('Determine the value of ' + t('k') + ' so that the expansion of ' + t(prod) + ' has <b>no ' + t('x') + '-term</b>. Then expand the product using your value of ' + t('k') + ' and state the two-term answer.', [nbox(t('k')), pbox('Two-term answer', ['x'])],
            [K.number(m, numDiag([[-m, 'u3l3-k-sign', 'With ' + t('k=-' + m) + ' both brackets are the same, so the two ' + t('x') + '-terms <b>add</b> instead of cancelling. The ' + t('x') + '-term is ' + t(coefTex + 'x') + '.'], [m * m, 'asked-other', 'The ' + t('x') + '-term is ' + t(coefTex + 'x') + ', so ' + t(coefTex + '=0') + '.']])),
              chk(P.add(V(1, { x: 2 }), V(-m * m)), [{ is: P.add(V(1, { x: 2 }), V(m * m)), code: 'last-sign', hint: 'The Last product is ' + t(m + '\\cdot(-' + m + ')=-' + m * m) + '.' }])],
            [String(m), 'x^{2}-' + m * m], t('k=' + m) + '; ' + t('x^{2}-' + m * m),
            t(prod + '=' + exp + '=x^{2}+' + coefTex + 'x-' + m + 'k') + '.<br>No ' + t('x') + '-term means ' + t(coefTex + '=0') + ', so ' + t('k=' + m) + '.<br>' + t(fin + '=x^{2}-' + m * m) + ' (the ' + t(m + 'x') + ' terms cancel).',
            ['Expand with ' + t('k') + ' as a letter and collect the two ' + t('x') + '-terms.', 'They cancel when they are opposites.'], 'k with no x-term');
          p.bad = [[String(-m), 'x^{2}-' + m * m], [String(m), 'x^{2}+' + m * m]];
          return p;
        } }] },
      { num: '18', stem: '', parts: [
        { id: 'e18', level: 'ADV', make: function (r) {
          var o = pickWhere(function () { return { a: r.int(2, 3), d: r.int(2, 6), c: r.int(1, 7) }; }, function (o) { return o.a * o.d !== o.c && HW.ex.gcd(o.a, o.c) >= 1; });
          if (r.chance(0.12)) o = { a: 2, d: 5, c: 4 };
          var cst = -o.c * o.d, T0 = P.mul(lin(o.a, -o.c), lin(1, o.d));
          var p = KP.fields('Determine the value of ' + t('c') + ' so that ' + t('(' + o.a + 'x+c)(x+' + o.d + ')') + ' expands to a trinomial whose constant term is ' + t(cst) + '. Then state the full expansion.', [nbox(t('c')), pbox('Expansion', ['x'])],
            [K.number(-o.c, numDiag([[o.c, 'u3l3-k-sign', 'Check the sign: ' + t(sgnNum(o.c) + '\\times ' + o.d + '=' + o.c * o.d) + ', not ' + t(cst) + '.'], [cst, 'asked-other', t(cst) + ' is the constant term itself. The constant term is ' + t('c\\times ' + o.d) + '; solve ' + t(o.d + 'c=' + cst) + '.'], [cst + o.d, 'u3l3-last-add', 'The Last terms multiply: ' + t('c\\times ' + o.d + '=' + cst) + '.']])),
              chk(T0, binWrongs(V(o.a, 'x'), V(-o.c), X, V(o.d)))],
            [String(-o.c), tx(T0)], t('c=' + (-o.c)) + '; ' + t(tx(T0)),
            'The constant term is the Last product: ' + t('c\\times ' + o.d + '=' + cst) + ', so ' + t('c=' + (-o.c)) + '.<br>' + foilSol(V(o.a, 'x'), V(-o.c), X, V(o.d)),
            ['Which two terms multiply to give the constant term?', 'Then expand ' + t('(' + o.a + 'x' + (-o.c) + ')(x+' + o.d + ')') + ' with FOIL.'], 'find c from constant');
          p.bad = [[String(o.c), tx(P.mul(lin(o.a, o.c), lin(1, o.d)))]];
          return p;
        } }] },
      { num: '19', stem: '<b>Reasoning.</b> The distributive property always produces four products, yet the final answer rarely has four terms.',
        shared: function (r) { var a = two(r, 2, 9), n = r.int(2, 9), k = r.int(2, 4), b = r.int(1, 5), c = r.int(2, 7), d = two(r, 1, 6); return { a: a, n: n, k: k, b: b, c: c, d: d }; },
        parts: [
          { id: 'e19a', sub: 'a', level: 'EMG', make: function (r, sh) {
            var mk = function (A, B, C, D, w) { return { q: br([A, B]) + br([C, D]), p: P.mul(P.add(A, B), P.add(C, D)), w: w }; };
            var c = sh.k * sh.c === sh.b ? sh.c + 1 : sh.c;
            var rows = [mk(X, V(sh.a[0]), X, V(sh.a[1]), 'three'), mk(X, V(sh.n), X, V(-sh.n), 'two'), mk(X, V(sh.d[0]), V(1, 'y'), V(sh.d[1]), 'four'),
              mk(V(sh.k, 'x'), V(-sh.b), X, V(c), 'three'), mk(V(1, 'a'), V(sh.d[1]), V(1, 'b'), V(-sh.d[0]), 'four')];
            var cols = [{ id: 'two', html: '2 terms' }, { id: 'three', html: '3 terms' }, { id: 'four', html: '4 terms' }], want = {};
            var R = rows.map(function (q, i) { var id = String.fromCharCode(97 + i); want[id] = q.w; return { id: id, html: '(' + id + ') ' + t(q.q) }; });
            var expand = function (q) { return t(q.q + '=' + tx(q.p)); };
            return KP.grid('After expanding and collecting like terms, how many terms does each product have?', R, cols, want, { why: function (row) { var q = rows[row.charCodeAt(0) - 97]; return { code: 'row', hint: 'Expand ' + t(q.q) + ' with FOIL and collect: ' + (q.w === 'four' ? 'the Outer and Inner products have different letters, so nothing collects.' : q.w === 'two' ? 'the Outer and Inner products are opposites — they cancel.' : 'the Outer and Inner products are like terms that don’t cancel.') }; } },
              rows.map(function (q, i) { return '(' + String.fromCharCode(97 + i) + ') ' + expand(q) + ' — <b>' + q.w + '</b> terms'; }).join('<br>') + '<br>Three terms when the Outer and Inner products are like terms that don’t cancel; two when they cancel; four when they are not like terms.',
              ['Find the Outer and Inner products. Are they like terms? Do they cancel?'], 'how many terms (table)');
          } },
          { id: 'e19b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var n = sh.n;
            return KP.mc(r, 'When does the product of two binomials collapse to only <b>two</b> terms? Choose the example and the description of the pattern (you’ll meet its name in Lesson 4).', [
              { html: 'When the Outer and Inner products are opposites and cancel — the same two terms, once added and once subtracted, as in ' + t('(x+' + n + ')(x-' + n + ')=x^{2}-' + n * n) + '.', right: true },
              { html: 'When both binomials are the same, as in ' + t('(x+' + n + ')(x+' + n + ')') + '.', why: t('(x+' + n + ')(x+' + n + ')=x^{2}+' + 2 * n + 'x+' + n * n) + ' — three terms: the Outer and Inner products add.' },
              { html: 'When the binomials have different letters, as in ' + t('(x+' + n + ')(y+1)') + '.', why: 'Different letters give <b>four</b> terms: nothing can be collected.' },
              { html: 'Never — the answer always has at least three terms.', why: 'Try ' + t('(x+' + n + ')(x-' + n + ')') + ': the ' + t(n + 'x') + ' terms cancel.' }],
              t('(x+' + n + ')(x-' + n + ')=x^{2}-' + n + 'x+' + n + 'x-' + n * n + '=x^{2}-' + n * n) + ': the Outer and Inner products are opposites, so only two terms remain. In Lesson 4 this pattern gets its name: a <b>difference of squares</b>.', ['Which kind of pair makes the two middle products cancel?'], 'two terms (MC)');
          } }] },
      { num: '20', section: 'Extra practice F — Area Applications and a Stretch', stem: function (sh) { return rectFig(sh.l, sh.w, { aria: 'rectangle', W: 4.6, H: 3 }) + 'A rectangle has length ' + t('(' + sh.l + ')') + ' cm and width ' + t('(' + sh.w + ')') + ' cm.'; },
        shared: function (r) { var o = pickWhere(function () { return { a: r.int(2, 3), b: r.int(1, 3), c: r.int(1, 6), x: r.int(3, 6) }; }, function (o) { var x = o.x; return (o.a * x - o.b) * (x + o.c) !== 2 * (o.a * x - o.b + x + o.c); }); if (r.chance(0.12)) o = { a: 2, b: 1, c: 3, x: 4 }; o.l = o.a + 'x-' + o.b; o.w = 'x+' + o.c; o.L = lin(o.a, -o.b); o.W = lin(1, o.c); o.A = P.mul(o.L, o.W); o.P = P.scale(P.add(o.L, o.W), 2); return o; },
        parts: [
          { id: 'e20a', sub: 'a', level: 'EMG', make: function (r, sh) { return expandBin(V(sh.a, 'x'), V(-sh.b), X, V(sh.c), { pre: '(a) Determine a simplified expression for its area: ', wrong: [{ is: sh.P, code: 'perimeter', hint: 'That is the perimeter. Area = length × width.' }], popt: { after: t('\\text{ cm}^{2}') }, text: 'rectangle area' }); } },
          { id: 'e20b', sub: 'b', level: 'EMG', make: function (r, sh) {
            return pp('(b) Determine a simplified expression for its perimeter.', sh.P, [{ is: sh.A, code: 'u3l3-area-for-perim', hint: 'That is the area. The perimeter is the distance around: add all four sides.' }, { is: P.add(sh.L, sh.W), code: 'u3l3-half-perim', hint: 'A rectangle has <b>two</b> lengths and <b>two</b> widths: ' + t('P=2l+2w') + '.' }],
              t('P=2(' + sh.l + ')+2(' + sh.w + ')=' + seq([V(2 * sh.a, 'x'), V(-2 * sh.b), V(2, 'x'), V(2 * sh.c)]) + '=' + tx(sh.P)) + ' cm', ['Perimeter ' + t('=2l+2w') + '.', 'Collect the ' + t('x') + '-terms and the numbers.'], 'rectangle perimeter', { after: t('\\text{ cm}') });
          } },
          { id: 'e20c', sub: 'c', level: 'BEG', make: function (r, sh) {
            var x = sh.x, A = P.at(sh.A, { x: x }), Pm = P.at(sh.P, { x: x });
            var p = KP.fields('(c) Evaluate both when ' + t('x=' + x) + '.', [nbox('Area', { after: t('\\text{ cm}^{2}') }), nbox('Perimeter', { after: t('\\text{ cm}') })],
              [K.number(A, numDiag([[Pm, 'perimeter', 'That is the perimeter.']])), K.number(Pm, numDiag([[A, 'u3l3-area-for-perim', 'That is the area.'], [Pm / 2, 'u3l3-half-perim', 'Add all four sides: two lengths and two widths.']]))],
              [String(A), String(Pm)], 'area ' + t(A) + ' cm², perimeter ' + t(Pm) + ' cm',
              'Length ' + t(sh.a + '(' + x + ')-' + sh.b + '=' + (sh.a * x - sh.b)) + ' cm, width ' + t(x + '+' + sh.c + '=' + (x + sh.c)) + ' cm.<br>Area ' + t('=' + (sh.a * x - sh.b) + '\\times ' + (x + sh.c) + '=' + A) + ' cm² (and ' + t(tx(sh.A).replace(/x/g, '(' + x + ')') + '=' + A) + ' ✓); perimeter ' + t('=' + tx(sh.P).replace(/x/g, '(' + x + ')') + '=' + Pm) + ' cm.',
              ['Substitute ' + t('x=' + x) + ' into your expressions from (a) and (b) — or find the length and width first.'], 'evaluate area and perimeter');
            p.bad = [[String(Pm), String(A)]];
            return p;
          } }] },
      { num: '21', stem: function (sh) { return 'A rectangular photo measures ' + t('(x+' + sh.a + ')') + ' cm by ' + t('(x+' + sh.b + ')') + ' cm. It is enlarged so that the length and the width each increase by ' + t(sh.n) + ' cm.'; },
        shared: function (r) { var ab = two(r, 1, 6), n = r.int(2, 5); if (r.chance(0.12)) { ab = [2, 5]; n = 3; } return { a: Math.min(ab[0], ab[1]), b: Math.max(ab[0], ab[1]), n: n }; },
        parts: [
          { id: 'e21a', sub: 'a', level: 'PRG', make: function (r, sh) {
            var a2 = sh.a + sh.n, b2 = sh.b + sh.n;
            return expandBin(X, V(a2), X, V(b2), { pre: '(a) Write and expand an expression for the new area. ', popt: { after: t('\\text{ cm}^{2}') }, wrong: [{ is: P.add(P.mul(lin(1, sh.a), lin(1, sh.b)), V(sh.n)), code: 'not-subst', hint: 'The new sides are ' + t('(x+' + a2 + ')') + ' and ' + t('(x+' + b2 + ')') + ': add ' + t(sh.n) + ' to each side, then multiply.' }],
              solPre: 'New sides: ' + t('(x+' + sh.a + '+' + sh.n + ')=(x+' + a2 + ')') + ' and ' + t('(x+' + b2 + ')') + '.<br>', text: 'photo new area' });
          } },
          { id: 'e21b', sub: 'b', level: 'PRG', make: function (r, sh) {
            var a2 = sh.a + sh.n, b2 = sh.b + sh.n, N0 = P.mul(lin(1, a2), lin(1, b2)), O0 = P.mul(lin(1, sh.a), lin(1, sh.b)), D = P.sub(N0, O0);
            return pp('(b) Determine a simplified expression for how much the area increased.', D, [{ is: N0, code: 'new-area', hint: 'That is the new area. The increase is the new area minus the old area, ' + t(tx(O0)) + '.' }, { is: P.add(N0, O0), code: 'minus-ignored', hint: 'The old area is <b>subtracted</b> from the new area.' }, { is: P.add(N0, V(-1, { x: 2 }), V(sh.a + sh.b, 'x'), V(sh.a * sh.b)), code: 'minus-first', hint: 'Subtract the <b>whole</b> old area: ' + t('-(' + tx(O0) + ')') + ' changes the sign of every term.' }],
              'New area ' + t('=' + tx(N0)) + '; old area ' + t('=(x+' + sh.a + ')(x+' + sh.b + ')=' + tx(O0)) + '.<br>Increase ' + t('=(' + tx(N0) + ')-(' + tx(O0) + ')=' + tx(D)) + ' cm²',
              ['Increase = new area − old area.', 'Put the old area in brackets before subtracting.'], 'photo increase', { after: t('\\text{ cm}^{2}') });
          } }] },
      { num: '22', stem: function (sh) { return rectFig('x+' + sh.b, 'x+' + sh.a, { frame: 0.55, frLab: '1 m', aria: 'garden with path', inner: 'garden', W: 4.6, H: 2.8 }) + 'A rectangular garden measures ' + t('(x+' + sh.b + ')') + ' m by ' + t('(x+' + sh.a + ')') + ' m. A concrete path ' + t('1') + ' m wide is poured all the way around the <b>outside</b> of the garden.'; },
        shared: function (r) { var ab = two(r, 1, 8), x = r.int(4, 9), c = r.pick([25, 30, 35, 40, 45, 50]); if (r.chance(0.12)) { ab = [2, 5]; x = 6; c = 35; } return { a: Math.min(ab[0], ab[1]), b: Math.max(ab[0], ab[1]), x: x, c: c }; },
        parts: [
          { id: 'e22a', sub: 'a', level: 'EMG', make: function (r, sh) {
            var L = lin(1, sh.b + 2), W = lin(1, sh.a + 2), c1 = K.poly(L, { wrong: [{ is: lin(1, sh.b + 1), code: 'u3l3-path-once', hint: 'The path is on <b>both</b> ends: add ' + t('1') + ' m twice.' }] }), c2 = K.poly(W, { wrong: [{ is: lin(1, sh.a + 1), code: 'u3l3-path-once', hint: 'The path is on <b>both</b> sides: add ' + t('1') + ' m twice.' }] });
            var p = KP.fields('(a) Write expressions for the length and the width of the outer rectangle (garden plus path).', [pbox('Length', ['x'], { after: t('\\text{ m}') }), pbox('Width', ['x'], { after: t('\\text{ m}') })], [c1, c2], [tx(L), tx(W)], t(tx(L)) + ' m by ' + t(tx(W)) + ' m',
              'Length ' + t('(x+' + sh.b + ')+1+1=x+' + (sh.b + 2)) + ' m; width ' + t('(x+' + sh.a + ')+1+1=x+' + (sh.a + 2)) + ' m.', ['The path adds ' + t('1') + ' m at <b>each</b> end of every side.'], 'outer rectangle');
            p.check = (function (base) { return function (resp) { resp = resp || []; var a = base(resp); if (a.v === 'correct') return a; var b = base([resp[1], resp[0]]); return b.v === 'correct' ? b : a; }; })(p.check);
            p.good = [[tx(W), tx(L)]]; p.bad = [[tx(lin(1, sh.b + 1)), tx(lin(1, sh.a + 1))]];
            return p;
          } },
          { id: 'e22b', sub: 'b', level: 'ADV', make: function (r, sh) {
            var Ob = P.mul(lin(1, sh.b + 2), lin(1, sh.a + 2)), G = P.mul(lin(1, sh.b), lin(1, sh.a)), D = P.sub(Ob, G), O1 = P.mul(lin(1, sh.b + 1), lin(1, sh.a + 1));
            return pp('(b) Determine a simplified expression for the area of the path alone.', D, [{ is: Ob, code: 'whole-only', hint: 'That is the area of the whole outer rectangle. Subtract the garden’s area to leave the path.' }, { is: P.sub(O1, G), code: 'u3l3-path-once', hint: 'The outer rectangle is ' + t('2') + ' m longer and ' + t('2') + ' m wider than the garden (the path is on both sides).' }, { is: P.add(Ob, G), code: 'not-subtracted', hint: 'The garden’s area must be <b>subtracted</b> from the outer rectangle.' }],
              'Outer: ' + t('(x+' + (sh.b + 2) + ')(x+' + (sh.a + 2) + ')=' + tx(Ob)) + '. Garden: ' + t('(x+' + sh.b + ')(x+' + sh.a + ')=' + tx(G)) + '.<br>Path ' + t('=(' + tx(Ob) + ')-(' + tx(G) + ')=' + tx(D)) + ' m²',
              ['Path area = outer rectangle − garden.', 'Expand both products, put the garden in brackets, then subtract.'], 'path area', { after: t('\\text{ m}^{2}') });
          } },
          { id: 'e22c', sub: 'c', level: 'ADV', make: function (r, sh) {
            var D = P.sub(P.mul(lin(1, sh.b + 2), lin(1, sh.a + 2)), P.mul(lin(1, sh.b), lin(1, sh.a))), area = P.at(D, { x: sh.x }), cost = area * sh.c;
            return KP.number('(c) The path costs ' + t('\\$' + sh.c) + ' per square metre. If ' + t('x=' + sh.x) + ', what is the total cost?', cost,
              numDiag([[area, 'u3l3-per-m2', 'That is the path’s area in square metres. Multiply by ' + t('\\$' + sh.c) + ' per square metre.'], [P.at(P.mul(lin(1, sh.b + 2), lin(1, sh.a + 2)), { x: sh.x }) * sh.c, 'whole-only', 'That prices the whole outer rectangle. Only the path is concrete: subtract the garden.']]),
              'Path area at ' + t('x=' + sh.x) + ': ' + t(tx(D).replace(/x/g, '(' + sh.x + ')') + '=' + area) + ' m².<br>Cost ' + t('=' + area + '\\times\\$' + sh.c + '=\\$' + F(cost)) + '.',
              ['Substitute ' + t('x=' + sh.x) + ' into your path area from (b).', 'Then multiply by the price per square metre.'], 'path cost', { before: t('\\$') });
          } }] },
      { num: '23', stem: '<b>Stretch.</b> Three binomials can be multiplied by expanding two of them first, then distributing the trinomial that results over the remaining binomial.', parts: [
        { id: 'e23a', level: 'ADV', make: function (r) { var abc = r.sample([1, 2, 3, 4, 5, 6], 3).sort(function (u, w) { return u - w; }); return threeBin([lin(1, abc[0]), lin(1, abc[1]), lin(1, abc[2])]); } },
        { id: 'e23b', level: 'ADV', make: function (r) { var o = pickWhere(function () { return { a: r.int(1, 4), b: r.int(1, 5), c: r.int(1, 3) }; }, function (o) { return o.a !== o.b; }); return threeBin([lin(1, -o.a), lin(1, o.b), lin(2, -o.c)]); } }] },
      { num: '24', stem: function (sh) { return '<b>Stretch.</b> A student claims that some <b>positive</b> value of ' + t('k') + ' makes ' + t(sh.kFirst ? '(x+k)(x+' + sh.m + ')' : '(x+' + sh.m + ')(x+k)') + ' expand with no ' + t('x') + '-term.'; },
        shared: function (r) { var m = r.int(2, 15); if (r.chance(0.12)) m = 6; return { m: m, kFirst: r.chance(0.75) }; },
        parts: [
          { id: 'e24a', sub: 'a', level: 'PRG', make: function (r, sh) {
            var m = sh.m;
            return KP.mc(r, 'Why can no positive ' + t('k') + ' work?', [
              { html: t('(x+k)(x+' + m + ')=x^{2}+(k+' + m + ')x+' + m + 'k') + '. If ' + t('k>0') + ', then ' + t('k+' + m + '>' + m) + ', so the ' + t('x') + '-term can never be ' + t('0') + '.', right: true },
              { html: 'Because the constant term ' + t(m + 'k') + ' would be positive.', why: 'The constant term doesn’t decide whether there is an ' + t('x') + '-term. Look at the coefficient of ' + t('x') + ': ' + t('k+' + m) + '.' },
              { html: 'Because ' + t('k') + ' must equal ' + t(m) + ' to cancel.', why: 'With ' + t('k=' + m) + ' the ' + t('x') + '-terms are ' + t(m + 'x+' + m + 'x=' + 2 * m + 'x') + ' — they add, they don’t cancel.' },
              { html: 'A positive ' + t('k') + ' does work if it is large enough.', why: 'The bigger ' + t('k') + ' is, the bigger ' + t('k+' + m) + ' gets. It can’t reach ' + t('0') + '.' }],
              'Expand: ' + t('(x+k)(x+' + m + ')=x^{2}+' + m + 'x+kx+' + m + 'k=x^{2}+(k+' + m + ')x+' + m + 'k') + '. For a positive ' + t('k') + ', ' + t('k+' + m) + ' is bigger than ' + t(m) + ', so it is never ' + t('0') + '.', ['Expand with ' + t('k') + ' as a letter and look at the coefficient of ' + t('x') + '.'], 'no positive k (MC)');
          } },
          { id: 'e24b', sub: 'b', level: 'ADV', make: function (r, sh) {
            var m = sh.m;
            var p = KP.fields('Find the one value of ' + t('k') + ' that does work, and state the resulting two-term product.', [nbox(t('k')), pbox('Two-term product', ['x'])],
              [K.number(-m, numDiag([[m, 'u3l3-k-sign', 'With ' + t('k=' + m) + ' the ' + t('x') + '-terms add: ' + t(m + 'x+' + m + 'x') + '. You need ' + t('k+' + m + '=0') + '.']])), chk(P.add(V(1, { x: 2 }), V(-m * m)), [{ is: P.add(V(1, { x: 2 }), V(m * m)), code: 'last-sign', hint: 'The Last product is ' + t('(-' + m + ')(' + m + ')=-' + m * m) + '.' }])],
              [String(-m), 'x^{2}-' + m * m], t('k=-' + m) + '; ' + t('x^{2}-' + m * m),
              t('k+' + m + '=0') + ' gives ' + t('k=-' + m) + '. Then ' + t('(x-' + m + ')(x+' + m + ')=x^{2}+' + m + 'x-' + m + 'x-' + m * m + '=x^{2}-' + m * m) + '. A zero ' + t('x') + '-term needs the two constants to be <b>opposites</b> — the same arrangement as in Extra 17.',
              ['Set the coefficient of ' + t('x') + ', ' + t('k+' + m) + ', equal to ' + t('0') + '.'], 'the k that works');
            p.bad = [[String(m), 'x^{2}-' + m * m]];
            return p;
          } }] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
