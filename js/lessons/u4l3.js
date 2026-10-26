/* Math 15 · Unit 4 · Lesson 3 — Factoring Trinomials x² + bx + c, Part 1: c Positive (AN5)
 * Assignment 3 (u4_L03.tex, Questions 1–15) and the Lesson 3 Extra Practice (u4_EP03.tex, Questions 1–18).
 * Every trinomial is built from its factors (spec), so the key is the factorization the question was made from; the
 * booklet's own numbers are among the possible values. Structure kept: the sign of b with c positive, a common factor to
 * take out first (number, letter, negative), a second variable, x⁴ in disguise, a trinomial that does not factor.
 * Wrong factorizations are diagnosed from the student's two numbers (right product / wrong sum, right sum / wrong
 * product, wrong signs, b and c swapped), a dropped common factor and a missing second variable.
 * "Factor where possible" parts use one box with a none key, so the input never gives away which ones factor.
 * Math 15 sign convention: when the leading coefficient is negative, take out a negative common factor.
 * Conversions: "check the claim with FOIL; if incorrect, give the correct factorization" → a multiple-choice verdict
 * (the options are expansions) plus the correct factorization; "explain" → multiple choice; "list every value" → a list
 * of numbers (any order).
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, F = HW.fmt, K = HW.kit, KP = K.P, PL = HW.poly, FA = HW.factor, ex = HW.ex, nt = HW.nt,
    t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'max-exp': 'GCF: used the highest power instead of the lowest', 'missing-var': 'GCF: included a letter missing from a term',
    'neg-rule': 'GCF: positive although the first term is negative', 'neg-mixed': 'GCF: negative although the first term is positive',
    'not-mono': 'GCF given as more than one term', 'not-greatest': 'A common factor, but not the greatest', 'gcf-coef': 'GCF coefficient doesn’t divide every coefficient',
    'drop-var': 'GCF: left out a common letter', 'drop-one': 'Dropped the 1 left by a term equal to the GCF', 'neg-signs': 'Negative factor: signs inside the bracket not all changed',
    'neg-factor': 'Didn’t take out a negative common factor (first term negative)', 'pos-factor': 'Took out a negative factor although the first term is positive',
    'neg-bracket': 'A bracket with every term negative', 'not-product': 'Prime factorization not written as a product', composite: 'Composite number left in a prime factorization',
    'pf-coef': 'Prime factors multiply to the wrong number', 'pf-vars': 'Wrong letters in a prime factorization', 'kept-error': 'Repeated the error being corrected',
    'not-factor': 'Factor doesn’t give the polynomial when expanded', 'kept-var': 'Kept a letter that divides out', 'no-divide': 'Didn’t divide a term by the common factor',
    'gcf-high': 'GCF exponent too high', 'first-only': 'Multiplied only the first term in the bracket', 'nr-sum': 'Added the wrong quantities',
    'pair-sum': 'Pair with the right product but the wrong sum', 'pair-product': 'Pair with the right sum but the wrong product', 'pair-signs': 'Pair with the wrong signs',
    'swap-bc': 'Numbers multiply to b and add to c (roles swapped)', 'gcf-dropped': 'Dropped the common factor', 'gcf-part': 'Took out only part of the GCF',
    'gave-sum': 'Gave the sum instead of the missing number', 'gave-product': 'Gave the product instead of the missing number',
    'not-b': 'Listed a value that isn’t a pair sum', 'missing-b': 'Missed some values of b', 'no-negatives': 'Forgot the negative values', 'fl-only': 'Expanded with only First and Last',
    'not-subst': 'Substitution slip', 'gcf-lcm': 'Gave the LCM instead of the GCF', 'sign': 'Wrong sign'
  });
  

  /* ================= shared helpers (Math 15 Unit 4) ================= */
  function M(c, v) { return PL.mono(c, v || {}); }
  function N(c) { return PL.num(c); }
  function tx(p, o) { return PL.tex(p, o); }
  function sum(list) { return PL.add.apply(null, list); }
  function seq(list) { var out = ''; list.forEach(function (x) { var s = PL.tex(x); if (s === '0') return; out += out && s.charAt(0) !== '-' ? '+' + s : s; }); return out || '0'; }
  function cOf(m) { var T = PL.terms(m)[0]; return T ? T.c : [0, 1]; }
  function vOf(m) { var T = PL.terms(m)[0]; return T ? T.v : {}; }
  function cv(m) { var c = cOf(m); return c[0] / c[1]; }
  function isNeg(m) { return cOf(m)[0] < 0; }
  function gcd(a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); }
  function gcdA(arr) { return arr.reduce(function (g, x) { return gcd(g, x); }, 0); }
  function pickWhere(gen, test) { for (var i = 0; i < 4000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u4l3: pickWhere failed'); }
  function plain(s) { return String(s).replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)').replace(/\\(quad|qquad|,|;)/g, ' ').replace(/\\underline\{[^}]*\}/g, '__').replace(/\\[a-z]+/g, ' ').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim(); }
  function pg(m) { var s = tx(m); return s.charAt(0) === '-' ? '\\left(' + s + '\\right)' : s; }
  function gTex(g) { var s = tx(g); return s === '1' ? '' : s === '-1' ? '-' : s; }
  function divM(m, g) {
    var a = PL.terms(m)[0], b = PL.terms(g)[0], v = {};
    Object.keys(a.v).forEach(function (x) { var e = a.v[x] - (b.v[x] || 0); if (e) v[x] = e; });
    return M(ex.norm(a.c[0] * b.c[1], a.c[1] * b.c[0]), v);
  }
  function lettersOf(list) {
    var s = {}; list.forEach(function (p) { PL.vars(PL.lift(p)).forEach(function (x) { s[x] = 1; }); });
    var out = Object.keys(s).sort(); return out.length ? out : ['x'];
  }
  function dedupW(target, ws) {
    var seen = [PL.lift(target)], out = [];
    (ws || []).forEach(function (w) { if (!w || !w.is) return; var p = Array.isArray(w.is) ? FA.product(w.is) : PL.lift(w.is); if (seen.some(function (q) { return PL.eq(q, p); })) return; seen.push(p); out.push({ is: w.is, p: p, code: w.code, hint: w.hint, tex: w.tex }); });
    return out;
  }
  function lead(p) { var T = PL.sorted(PL.lift(p))[0]; return M(T.c, T.v); }
  function leadNeg(p) { return PL.sorted(PL.lift(p))[0].c[0] < 0; }

  /* ---------- GCF of a set of monomials. Math 15: negative when the first (leading) monomial is negative ---------- */
  function gcfOf(list) {
    var G = gcdA(list.map(function (m) { return cOf(m)[0]; })), v = null;
    list.forEach(function (m) { var w = vOf(m); if (!v) { v = {}; Object.keys(w).forEach(function (x) { v[x] = w[x]; }); } else Object.keys(v).forEach(function (x) { v[x] = Math.min(v[x], w[x] || 0); if (!v[x]) delete v[x]; }); });
    return M(isNeg(list[0]) ? -G : G, v || {});
  }
  function powTex(x, e) { return x + (e > 1 ? '^{' + e + '}' : ''); }
  function gcfLines(list, opt) {
    opt = opt || {};
    var allV = {}, lines = [], ns = list.map(function (m) { return Math.abs(cOf(m)[0]); }), g = gcdA(ns);
    list.forEach(function (m) { Object.keys(vOf(m)).forEach(function (x) { allV[x] = 1; }); });
    lines.push('Coefficients: ' + t('\\gcd(' + ns.join(',') + ')=' + g) + (g === 1 ? ' — no common number factor.' : '.'));
    Object.keys(allV).sort().forEach(function (x) {
      var miss = list.filter(function (m) { return !vOf(m)[x]; });
      if (miss.length) lines.push(t(x) + ' is missing from ' + t(tx(miss[0])) + ', so it is not common.');
      else { var e = Math.min.apply(null, list.map(function (m) { return vOf(m)[x]; })); lines.push(t(x) + ': the lowest power is ' + t(powTex(x, e)) + '.'); }
    });
    var neg = list.filter(isNeg).length;
    if (opt.signNote) lines.push(opt.signNote);
    else if (neg === list.length) lines.push('Every term is negative, so the GCF is negative.');
    else if (isNeg(list[0])) lines.push('The first term is negative, so take the GCF <b>negative</b> (the bracket then starts with a positive term).');
    else if (neg) lines.push('The first term is positive, so the GCF is positive.');
    return lines.join('<br>');
  }
  function gcfDiag(list, g) {
    var gc = Math.abs(cOf(g)[0]), gv = vOf(g), coefs = list.map(function (m) { return Math.abs(cOf(m)[0]); });
    return function (S) {
      if (PL.count(S) !== 1) return { code: 'not-mono', hint: 'The GCF is a <b>single term</b> (a monomial), not a sum or difference.' };
      var sc = cOf(S), sv = vOf(S), letters = {};
      Object.keys(sv).concat(Object.keys(gv)).forEach(function (x) { letters[x] = 1; });
      var badV = Object.keys(letters).filter(function (x) { return (sv[x] || 0) !== (gv[x] || 0); });
      if (!badV.length && sc[1] === 1 && Math.abs(sc[0]) !== gc) {
        if (coefs.every(function (c) { return c % Math.abs(sc[0]) === 0; })) return { code: 'not-greatest', hint: t(Math.abs(sc[0])) + ' divides every coefficient, but it isn’t the <b>greatest</b> number that does. Try a bigger one.' };
        return { code: 'gcf-coef', hint: t(Math.abs(sc[0])) + ' doesn’t divide every coefficient (' + t(coefs.join(',\\ ')) + '). The GCF’s number must divide all of them.' };
      }
      if (badV.length && Math.abs(sc[0]) === gc && sc[1] === 1) {
        var x = badV[0], mn = list.filter(function (m) { return !vOf(m)[x]; })[0];
        if (mn && sv[x]) return { code: 'missing-var', hint: t(x) + ' is missing from ' + t(tx(mn)) + ', so it can’t be part of the GCF.' };
        if ((sv[x] || 0) > (gv[x] || 0)) return { code: 'gcf-high', hint: 'Check ' + t(x) + ': use the <b>lowest</b> power that appears in every term.' };
        if ((sv[x] || 0) < (gv[x] || 0)) return { code: 'drop-var', hint: t(x) + ' appears in every term, so it belongs in the GCF (to its lowest power).' };
      }
      return null;
    };
  }
  function gcfWrongs(list, g) {
    var gc = cOf(g)[0], gv = vOf(g), W = [], hi = {}, all = {};
    Object.keys(gv).forEach(function (x) { hi[x] = Math.max.apply(null, list.map(function (m) { return vOf(m)[x]; })); });
    W.push({ is: M(gc, hi), code: 'max-exp', hint: 'For the GCF use the <b>lowest</b> power of each common letter — a higher power doesn’t divide every term.' });
    list.forEach(function (m) { var w = vOf(m); Object.keys(w).forEach(function (x) { all[x] = all[x] == null ? w[x] : Math.min(all[x], w[x]); }); });
    W.push({ is: M(gc, all), code: 'missing-var', hint: 'A letter that is missing from even one term is not common to all of them, so it can’t be in the GCF.' });
    if (isNeg(list[0])) W.push({ is: M(-gc, gv), code: 'neg-rule', hint: list.every(isNeg) ? 'Every monomial is negative, so take the GCF <b>negative</b> too.' : 'The first term is negative, so take the GCF <b>negative</b>.' });
    else if (list.some(isNeg)) W.push({ is: M(-gc, gv), code: 'neg-mixed', hint: 'The first term is positive, so the GCF is positive.' });
    return W;
  }
  function gcfPart(list, opt) {
    opt = opt || {};
    var g = gcfOf(list), W = dedupW(g, gcfWrongs(list, g)), shown = list.map(function (m) { return tx(m); }).join(',\\quad ');
    var p = KP.poly(opt.prompt || t(shown), g, { wrong: W.map(function (w) { return { is: w.p, code: w.code, hint: w.hint }; }), diag: gcfDiag(list, g), vars: lettersOf(list) },
      opt.sol || gcfLines(list) + '<br>GCF ' + t('=\\mathbf{' + tx(g) + '}'),
      ['Find the greatest number that divides every coefficient. Then take each letter that is in <b>every</b> term, to its <b>lowest</b> power.', list.every(isNeg) ? 'Every term is negative, so make the GCF negative.' : 'Check: your GCF must divide every monomial exactly.'],
      opt.text || 'GCF of ' + plain(shown));
    p.bad = W.map(function (w) { return tx(w.p); });
    return p;
  }

  /* ---------- prime factorizations of monomials ---------- */
  function primeTex(c, v) {
    var out = nt.primeList(c).map(String);
    Object.keys(v).sort().forEach(function (x) { for (var i = 0; i < v[x]; i++) out.push(x); });
    return out.join('\\times ');
  }
  function primeCheck(c, v) {
    var want = PL.monoTex(v);
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var fs = [], other = false, nums = [], vars = {};
      (function w(x) { while (x.t === 'paren') x = x.a; if (x.t === 'mul') { w(x.a); w(x.b); return; } fs.push(x); })(a.ast);
      fs.forEach(function (f) {
        var e = 1, b = f;
        if (f.t === 'pow') { var r = ex.rat(f.b); if (!r || r[1] !== 1 || r[0] < 1) { other = true; return; } e = r[0]; b = f.a; while (b.t === 'paren') b = b.a; }
        if (b.t === 'num') { var nv = ex.rat(b); if (!nv || nv[1] !== 1) { other = true; return; } for (var i = 0; i < e; i++) nums.push(nv[0]); }
        else if (b.t === 'var') vars[b.n] = (vars[b.n] || 0) + e;
        else other = true;
      });
      if (other) return form('not-product', 'Write it as a <b>product</b>: prime numbers and single letters joined by ' + t('\\times') + ', for example ' + t('2\\times 2\\times 3\\times x\\times x') + '.');
      var prod = nums.reduce(function (m, x) { return m * x; }, 1), vs = PL.monoTex(vars), vOk = vs === want;
      if (prod === c && vOk) {
        if (nums.indexOf(1) >= 0) return form('one', 'Leave ' + t('1') + ' out: it isn’t prime, and multiplying by ' + t('1') + ' changes nothing.');
        var comp = nums.filter(function (x) { return !nt.isPrime(x); })[0];
        if (comp) return wrong('composite', 'Your factors multiply to the right monomial, but ' + t(comp) + ' isn’t prime. Break it down: ' + t(comp + '=' + nt.primeList(comp).join('\\times ')) + '.');
        return ok();
      }
      if (vOk) return wrong('pf-coef', 'The letters are right, but your numbers multiply to ' + t(F(prod)) + ', not ' + t(c) + '.');
      if (prod === c) return wrong('pf-vars', 'The numbers are right — now check the letters: ' + t(c + want) + ' has ' + Object.keys(v).sort().map(function (x) { return v[x] + ' factor' + (v[x] > 1 ? 's' : '') + ' of ' + t(x); }).join(' and ') + '.');
      return wrong('value', 'Your factors multiply to ' + t(F(prod) + vs) + ', not ' + t(c + want) + '.');
    };
  }
  function primeFields(monos) {
    var fields = monos.map(function (m) { var s = tx(m); return { label: t(s + '='), name: s, mode: 'math', keys: 'expo', vars: lettersOf(monos), wide: true }; });
    var keys = monos.map(function (m) { return primeTex(cOf(m)[0], vOf(m)); });
    return KP.fields('Write each monomial as a product of prime factors (write the letters out too, e.g. ' + t('x\\times x') + ').', fields, monos.map(function (m) { return primeCheck(cOf(m)[0], vOf(m)); }), keys,
      monos.map(function (m, i) { return t(tx(m) + '=' + keys[i]); }).join('<br>'),
      monos.map(function (m, i) { return t(tx(m) + '=' + keys[i]); }).join('<br>') + '<br>Break the number into primes (a factor tree or division ladder), then write each letter as many times as its exponent says.',
      ['Factor each coefficient into primes, e.g. ' + t('12=2\\times 2\\times 3') + '.', 'A power such as ' + t('x^{3}') + ' is ' + t('x\\times x\\times x') + '.'], 'prime factorizations of ' + monos.map(tx).join(', '));
  }
  function commonPrimeSol(monos, g) {
    var a = nt.primeList(cOf(monos[0])[0]), b = nt.primeList(cOf(monos[1])[0]), com = [], bb = b.slice();
    a.forEach(function (p) { var i = bb.indexOf(p); if (i >= 0) { com.push(String(p)); bb.splice(i, 1); } });
    var gv = vOf(g); Object.keys(gv).sort().forEach(function (x) { for (var i = 0; i < gv[x]; i++) com.push(x); });
    return monos.map(function (m) { return t(tx(m) + '=' + primeTex(cOf(m)[0], vOf(m))); }).join('<br>') + '<br>Prime factors common to both: ' + t(com.join(',\\ ')) + '.<br>GCF ' + t('=' + com.join('\\times ') + '=\\mathbf{' + tx(g) + '}');
  }

  /* ---------- the Math 15 sign convention on a factored answer ---------- */
  function signInfo(resp) {
    var a = K.read(resp); if (a.res) return null;
    var sp = FA.split(a.ast); if (!sp.ok) return null;
    var sign = 1, allNegBr = false;
    sp.factors.forEach(function (f) {
      if (PL.count(f.p) === 1) { if (cOf(f.p)[0] < 0 && f.k % 2) sign = -sign; }
      else if (PL.terms(f.p).every(function (T) { return T.c[0] < 0; })) allNegBr = true;
    });
    return { sign: sign, allNegBr: allNegBr };
  }
  function convCheck(base, neg, negMsg) {
    return function (resp) {
      var res = base(resp); if (res.v !== 'correct') return res;
      var si = signInfo(resp); if (!si) return res;
      if (neg && si.sign > 0) return form('neg-factor', negMsg || 'Equal — but the first term is negative, so take out a <b>negative</b> common factor. Then the bracket starts with a positive term.');
      if (!neg && si.sign < 0) return form('pos-factor', 'Equal — but the first term is positive, so take out a <b>positive</b> common factor.');
      if (si.allNegBr) return form('neg-bracket', 'Equal — but every term in one of your brackets is negative. Take that negative out in front so the bracket starts with a positive term.');
      return res;
    };
  }

  /* ---------- factoring by removing the GCF ---------- */
  function factorPart(terms, opt) {
    opt = opt || {};
    var g = opt.g || gcfOf(terms), br = terms.map(function (m) { return divM(m, g); }), B = sum(br), target = [g, B];
    var gT = gTex(g), keyTex = opt.keyTex || gT + '(' + seq(br) + ')';
    var W = [];
    br.forEach(function (b, i) {
      if (br.length > 1 && PL.count(b) === 1 && !PL.vars(b).length && Math.abs(cv(b)) === 1) W.push({ is: [g, sum(br.filter(function (x, j) { return j !== i; }))], code: 'drop-one', hint: t(pg(terms[i]) + '\\div ' + pg(g) + '=' + tx(b)) + ': that ' + t(tx(b)) + ' must stay in the bracket. A term that matches the common factor leaves ' + t('1') + ' or ' + t('-1') + ', not ' + t('0') + '.' });
    });
    if (isNeg(g) && br.length > 1) W.push({ is: [g, sum(br.map(function (b, i) { return i ? PL.neg(b) : b; }))], code: 'neg-signs', hint: 'You took out a <b>negative</b> factor, so <b>every</b> sign inside the bracket changes. Expand your answer and compare the signs with the question.' });
    if (br.length > 1) terms.forEach(function (m, i) { if (i && !PL.eq(m, br[i])) W.push({ is: [g, sum(br.map(function (b, j) { return j === i ? m : b; }))], code: 'no-divide', hint: 'Divide <b>every</b> term by the common factor: ' + t(pg(m) + '\\div ' + pg(g) + '=' + tx(br[i])) + '.' }); });
    W = W.concat(opt.wrong || []);
    W = dedupW(PL.mul(g, B), W).map(function (w) { if (!w.tex && Array.isArray(w.is)) w.tex = gTex(w.is[0]) + '(' + tx(w.is[1]) + ')'; return w; });
    var neg = opt.mustNeg != null ? opt.mustNeg : isNeg(terms[0]);
    var check = convCheck(K.factored(target, { gcfOnly: true, wrong: W.map(function (w) { return { is: w.p, code: w.code, hint: w.hint }; }) }), neg);
    var shown = opt.prompt || t(seq(terms));
    var divs = terms.map(function (m, i) { return t(pg(m) + '\\div ' + pg(g) + '=' + tx(br[i])); }).join(', &nbsp;');
    var sol = opt.sol || (gcfLines(terms) + '<br>So remove ' + t(gT || '1') + '.') + '<br>Divide every term by it: ' + divs + '.<br>' + t((opt.before || '') + seq(terms) + '=\\mathbf{' + keyTex + '}') + (opt.verify ? '<br>Check by expanding: ' + t(keyTex + '=' + seq(terms)) + ' ✓' : '');
    var hints = opt.hints || ['Find the GCF of the terms first: the greatest number that divides every coefficient, and each letter that is in every term to its lowest power.', neg ? 'The first term is negative, so take out a negative GCF — then <b>every</b> sign in the bracket changes.' : 'Divide <b>each</b> term by the GCF to get the bracket. Check by expanding.'];
    var p = KP.math(shown, check, keyTex, sol, hints, opt.text || 'factor ' + plain(seq(terms)), { keys: 'poly', vars: lettersOf(terms), before: opt.inBefore, placeholder: 'e.g. 4x(2x - 3)' });
    p.bad = W.map(function (w) { return w.tex; });
    if (PL.count(B) > 1) { var altB = tx(B, { order: 'asc' }); p.good = [gT + '(' + altB + ')']; }
    return p;
  }
  /* one box between given pieces */
  function boxPart(prompt, target, opt, sol, hints, text) {
    opt = opt || {};
    var W = dedupW(target, opt.wrong), key = opt.keyTex || tx(target);
    var chk = K.poly(target, { wrong: W.map(function (w) { return { is: w.p, code: w.code, hint: w.hint }; }), diag: opt.diag });
    var p = KP.fields(prompt, [{ label: '', name: '', before: opt.before ? t(opt.before) : undefined, after: opt.after ? t(opt.after) : undefined, mode: 'math', keys: 'poly', vars: opt.vars || ['x'], wide: true }], [chk], [key],
      t(opt.answerTex), sol, hints, text);
    p.bad = W.map(function (w) { return [tx(w.p)]; });
    if (opt.good) p.good = opt.good.map(function (g) { return [g]; });
    return p;
  }
  /* blank = the common factor in front of a given bracket */
  function frontPart(poly, g, bracket, opt) {
    opt = opt || {};
    var polyT = opt.polyTex || tx(poly), brT = '(' + (opt.brTex || tx(bracket)) + ')', gT = tx(g);
    var diag = function (S) {
      var E = PL.mul(S, bracket);
      if (PL.eq(E, poly)) return null;
      return { code: 'not-factor', hint: 'Check by expanding: ' + t(pg(S) + brT + '=' + tx(E)) + ', not ' + t(polyT) + '.' };
    };
    var ws = (opt.wrong || []).slice();
    var cg = cOf(g); if (Object.keys(vOf(g)).length) ws.push({ is: M(cg, {}), code: 'drop-var', hint: 'The number is right — but the terms also share a letter. Check by expanding: ' + t(tx(M(cg, {})) + brT + '=' + tx(PL.mul(M(cg, {}), bracket))) + '.' });
    return boxPart(opt.prompt || t(polyT + '=\\underline{\\qquad}\\,' + brT), g, { wrong: ws, diag: diag, after: brT, vars: lettersOf([poly]), keyTex: gT, answerTex: polyT + '=' + (gT === '1' ? '' : gT) + brT },
      'The missing factor times each term of the bracket must give a term of the polynomial. Divide the first terms: ' + t(tx(lead(poly)) + '\\div ' + pg(lead(bracket)) + '=' + gT) + '.<br>Check: ' + t(pg(g) + brT + '=' + polyT) + ' ✓<br>Missing factor: ' + t('\\mathbf{' + gT + '}'),
      ['Divide the first term of the polynomial by the first term in the bracket.', 'Check by expanding your factor times the bracket.'], opt.text || 'missing factor: ' + plain(polyT + '=__' + brT));
  }
  function mcPart(r, prompt, opts, sol, hints, text, keepOrder) { return KP.mc(r, prompt, opts, sol, hints, text, keepOrder); }

  /* ---------- a claimed GCF factoring to check by expanding ---------- */
  function gcfClaim(terms, claimG, claimBr, truth) {
    var T = sum(terms), cB = sum(claimBr), E = PL.mul(claimG, cB);
    return { terms: terms, T: T, Ttx: seq(terms), claimG: claimG, claimBr: claimBr, claimTex: gTex(claimG) + '(' + seq(claimBr) + ')', E: E, truth: truth,
      firstOnly: sum([PL.mul(claimG, claimBr[0])].concat(claimBr.slice(1))) };
  }
  function verdictPart(r, c, level) {
    var W = c.truth ? c.firstOnly : c.E, G = gcfOf(c.terms);
    return mcPart(r, 'Expand ' + t(c.claimTex) + '. Is the factoring correct?', [
      { html: '<b>Correct:</b> ' + t(c.claimTex + '=' + c.Ttx), right: c.truth, why: c.truth ? null : 'Expand it carefully: ' + t(c.claimTex + '=' + tx(c.E)) + ', which is not ' + t(c.Ttx) + '.' },
      { html: '<b>Incorrect:</b> ' + t(c.claimTex + '=' + tx(W)), right: !c.truth, why: c.truth ? 'Multiply ' + t(pg(c.claimG)) + ' by <b>every</b> term in the bracket: ' + t(c.claimTex + '=' + c.Ttx) + '.' : null },
      { html: '<b>Incorrect:</b> the factor in front should not be ' + t(tx(c.claimG)) + '.', why: 'The GCF of the terms is ' + t(tx(G)) + ', so the factor in front is fine. Expand the bracket and compare with ' + t(c.Ttx) + '.' }],
      'Expand: ' + t(c.claimTex + '=' + tx(c.E)) + '. ' + (c.truth ? 'That is exactly ' + t(c.Ttx) + ', so the factoring is <b>correct</b>.' : 'That is not ' + t(c.Ttx) + ', so the factoring is <b>incorrect</b>.'),
      ['Multiply the factor in front by each term in the bracket, then compare with the original expression term by term.'], 'check claim ' + plain(c.Ttx + '=' + c.claimTex));
  }
  function correctFormPart(c, opt) {
    opt = opt || {};
    var ws = c.truth ? [] : [{ is: [c.claimG, sum(c.claimBr)], code: 'kept-error', hint: 'That is the claimed form, and it is not correct: ' + t(c.claimTex + '=' + tx(c.E)) + '. Divide each term of ' + t(c.Ttx) + ' by the GCF.', tex: c.claimTex }];
    return factorPart(c.terms, { prompt: opt.prompt || 'Write the correct factored form of ' + t(c.Ttx) + '. (If the claim was correct, it is the claimed form.)', wrong: ws, verify: true, text: 'correct form ' + plain(c.Ttx) });
  }
  function wrongK(r, k) { return r.pick([k - 1, k + 1, k + 2, k - 2].filter(function (x) { return x > 0 && x !== k; })); }

  /* ---------- trinomials x² + bx + c (from their factors) ---------- */
  function sg(n) { return n < 0 ? '-' + (-n) : '+' + n; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function V(v, e) { var o = {}; o[v] = e || 1; return PL.mono(1, o); }
  function bin(u, n, w) { return PL.add(u, PL.scale(w || PL.num(1), n)); }
  function isSq(n) { if (n < 0) return false; var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function factorable(b, c) { return isSq(b * b - 4 * c); }
  function posPairs(n) { n = Math.abs(n); var o = []; for (var u = 1; u * u <= n; u++) if (n % u === 0) o.push([u, n / u]); return o; }
  function pairsTex(n) { return posPairs(n).map(function (pq) { return pq[0] + '\\times ' + pq[1]; }).join(',\\ \\ '); }
  function triTex(v, b, c) { return tx(PL.add(V(v, 2), PL.scale(V(v), b), PL.num(c))); }
  function varsOf(p) { var vs = PL.vars(p); return vs.length ? vs : ['x']; }
  function signHint(b, c) {
    if (c > 0) return b > 0 ? 'The product is positive and the sum is positive, so <b>both</b> numbers are positive.' : 'The product is positive but the sum is negative, so <b>both</b> numbers are negative.';
    return 'The product is negative, so one number is positive and one is negative; the one further from ' + t('0') + ' has the same sign as the sum, ' + t(b) + '.';
  }
  function spec(o) {
    var u = o.u || V(o.v || 'x', o.e || 1), w = o.y ? V(o.y) : null, G = o.G || PL.num(1);
    var A = bin(u, o.p, w), Bq = bin(u, o.q, w), inner = PL.mul(A, Bq), full = PL.mul(G, inner), g1 = PL.eq(G, PL.num(1));
    var list = o.p === o.q ? [{ p: A, k: 2 }] : [A, Bq];
    if (!g1) list = [G].concat(list);
    var gt = tx(G);
    return { u: u, w: w, G: G, g1: g1, p: o.p, q: o.q, b: o.p + o.q, c: o.p * o.q, A: A, B: Bq, inner: inner, full: full, list: list, key: FA.tex(list), gtex: gt, gpre: gt === '-1' ? '-' : gt };
  }
  function coefRel(S, m) { var tm = PL.terms(m)[0], c = PL.coef(S, tm.v); return (c[0] * tm.c[1]) / (c[1] * tm.c[0]); }
  function pairDiag(s) {
    var m2 = PL.mul(s.G, PL.pow(s.u, 2)), m1 = PL.mul(s.G, s.u, s.w || PL.num(1)), m0 = PL.mul(s.G, s.w ? PL.pow(s.w, 2) : PL.num(1));
    var b = s.b, c = s.c, inside = s.g1 ? '' : ' (inside the bracket)';
    return function (S) {
      var L = coefRel(S, m2), Mi = coefRel(S, m1), C = coefRel(S, m0);
      if (L !== 1 || Mi % 1 || C % 1) return null;
      if (!PL.eq(S, PL.add(m2, PL.scale(m1, Mi), PL.scale(m0, C)))) return null;
      var pre = 'Your factors multiply to ' + t(tx(S)) + ', not ' + t(tx(s.full)) + '. ';
      if (C === c && Mi === -b) return { code: 'pair-signs', hint: pre + 'Your numbers multiply to ' + t(c) + ' but add to ' + t(-b) + ', not ' + t(b) + ': the signs are backwards. ' + signHint(b, c) };
      if (Mi === c && C === b && b !== c) return { code: 'swap-bc', hint: pre + 'Your numbers multiply to ' + t(b) + ' and add to ' + t(c) + ' — the wrong way round. They must <b>multiply to the constant</b> ' + t(c) + ' and <b>add to the middle coefficient</b> ' + t(b) + inside + '.' };
      if (C === c) return { code: 'pair-sum', hint: pre + 'Your numbers multiply to ' + t(c) + ' ✓ but add to ' + t(Mi) + ', not ' + t(b) + '. Try another factor pair of ' + t(Math.abs(c)) + '.' };
      if (Mi === b && C === -c) return { code: 'pair-signs', hint: pre + 'Your numbers add to ' + t(b) + ' ✓ but multiply to ' + t(-c) + ', not ' + t(c) + '. ' + (c > 0 ? 'A positive product needs two numbers with the <b>same</b> sign.' : 'A negative product needs one positive and one negative number.') };
      if (Mi === b) return { code: 'pair-product', hint: pre + 'Your numbers add to ' + t(b) + ' ✓ but multiply to ' + t(C) + ', not ' + t(c) + '. The last terms of the brackets must multiply to the constant term' + inside + '.' };
      return null;
    };
  }
  function stdWrongs(s) {
    var out = [];
    if (!s.g1) out.push({ is: s.inner, code: 'gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(s.gtex) + ' is missing. Multiply your answer out: you get ' + t(tx(s.inner)) + ', not ' + t(tx(s.full)) + '.' });
    return out.filter(function (w) { return !PL.eq(w.is, s.full); });
  }
  function foilTex(s) {
    var w = s.w || PL.num(1);
    return PL.seq([PL.pow(s.u, 2), PL.mul(s.u, w, PL.num(s.q)), PL.mul(s.u, w, PL.num(s.p)), PL.mul(PL.pow(w, 2), PL.num(s.c))].filter(function (x) { return PL.count(x); }));
  }
  function solFac(s, opt) {
    opt = opt || {};
    var out = [];
    if (!s.g1) out.push('Take out the common factor ' + t(s.gtex) + ' first: ' + t(tx(s.full) + '=' + s.gpre + '(' + tx(s.inner) + ')') + '.');
    out.push('Two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + ': ' + t(sg(s.p)) + ' and ' + t(sg(s.q)) + '.');
    out.push(t(tx(s.full) + '=' + s.key));
    if (opt.check) out.push('Check: ' + t('(' + tx(s.A) + ')(' + tx(s.B) + ')=' + foilTex(s) + '=' + tx(s.inner)) + ' ✓');
    return out.join('<br>');
  }
  function hintsFac(s) {
    var pair = 'Look for two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + ' (they go in the brackets ' + t('(x+\\square)(x+\\square)') + ').';
    if (!s.g1) return ['Every term has a common factor of ' + t(s.gtex) + '. Take it out first, then factor the trinomial left in the bracket.', pair + ' ' + signHint(s.b, s.c)];
    return [pair, signHint(s.b, s.c)];
  }
  function facPart(s, opt) {
    opt = opt || {};
    var part = KP.factored(opt.prompt || t(tx(s.full)), s.list, { wrong: stdWrongs(s).concat(opt.wrong || []), diag: pairDiag(s), keyTex: s.key, vars: varsOf(s.full) },
      opt.sol || solFac(s, opt), opt.hints || hintsFac(s), opt.text || 'factor ' + tx(s.full));
    part.check = convCheck(part.check, leadNeg(s.full));
    var A = '(' + tx(s.A) + ')', Bt = '(' + tx(s.B) + ')', pre = s.g1 ? '' : s.gpre;
    part.good = [pre + Bt + A];
    if (s.p === s.q) part.good.push(pre + A + A);
    var flip = PL.mul(s.G, bin(s.u, -s.p, s.w), bin(s.u, -s.q, s.w)), bad = [];
    if (!PL.eq(flip, s.full)) bad.push(pre + '(' + tx(bin(s.u, -s.p, s.w)) + ')(' + tx(bin(s.u, -s.q, s.w)) + ')');
    if (!s.g1) bad.push(A + Bt);
    part.bad = bad.concat(opt.bad || []);
    return part;
  }
  /* a claimed trinomial factoring (x+m)(x+n) of the trinomial built from (x+p)(x+q) */
  function triClaim(p, q, m, n) {
    var s = spec({ p: p, q: q }), cs = spec({ p: m, q: n }), truth = PL.eq(s.full, cs.full);
    return { s: s, cs: cs, truth: truth, Ttx: tx(s.full), claimTex: cs.key, E: cs.full,
      fl: PL.add(V('x', 2), PL.num(m * n)), flip: PL.add(V('x', 2), PL.scale(V('x'), -(m + n)), PL.num(m * n)) };
  }
  function triVerdict(r, c) {
    var B2 = c.truth ? c.flip : c.E;
    return mcPart(r, 'Expand ' + t(c.claimTex) + '. Is the factoring correct?', [
      { html: '<b>Correct:</b> ' + t(c.claimTex + '=' + c.Ttx), right: c.truth, why: c.truth ? null : 'Expand all four products (FOIL): ' + t(c.claimTex + '=' + foilTex(c.cs) + '=' + tx(c.E)) + ', which is not ' + t(c.Ttx) + '.' },
      { html: '<b>Incorrect:</b> ' + t(c.claimTex + '=' + tx(B2)), right: !c.truth, why: c.truth ? 'Check the signs of the outer and inner products: ' + t(c.claimTex + '=' + foilTex(c.cs) + '=' + c.Ttx) + '.' : null },
      { html: '<b>Incorrect:</b> ' + t(c.claimTex + '=' + tx(c.fl)), why: 'That uses only the First and Last products. The Outer and Inner products make the middle term: ' + t(c.claimTex + '=' + foilTex(c.cs) + '=' + tx(c.E)) + '.' }],
      'FOIL: ' + t(c.claimTex + '=' + foilTex(c.cs) + '=' + tx(c.E)) + '. ' + (c.truth ? 'That is exactly ' + t(c.Ttx) + ', so the factoring is <b>correct</b>.' : 'That is not ' + t(c.Ttx) + ', so the factoring is <b>incorrect</b>.'),
      ['Expand with FOIL (First, Outer, Inner, Last) and collect like terms. Compare with the trinomial term by term.'], 'check claim ' + plain(c.Ttx + '=' + c.claimTex));
  }
  function triCorrect(c, level) {
    var ws = c.truth ? [] : [{ is: c.E, code: 'kept-error', hint: 'That is the claimed form, and it is not correct: it expands to ' + t(tx(c.E)) + '.' }];
    return facPart(c.s, { prompt: 'Write the correct factored form of ' + t(c.Ttx) + '. (If the claim was correct, it is the claimed form.)', wrong: ws, check: true, text: 'correct form ' + plain(c.Ttx) });
  }
  /* two polynomial boxes: expanded, then factored back */
  function mathField(label, vars, ph) { return { name: label, label: label, mode: 'math', keys: 'poly', vars: vars || ['x'], wide: true, placeholder: ph }; }
  function roundTrip(prompt, expanded, factorCheck, keys, answer, sol, hints, text, opt) {
    opt = opt || {};
    var vars = varsOf(expanded);
    var p = KP.fields(prompt, [mathField(opt.l1 || 'Expanded', vars, 'e.g. x^2 + 5x + 6'), mathField(opt.l2 || 'Factored back', vars, 'e.g. (x + 2)(x + 3)')], [K.poly(expanded, { wrong: opt.wrong || [] }), factorCheck], keys, answer, sol, hints, text);
    return p;
  }
  function numField(label, after) { return { name: label, label: label, after: after }; }
  function setCheck(want, diag) {
    return function (resp) {
      resp = resp || [];
      var vals = [];
      for (var i = 0; i < want.length; i++) { var pn = HW.parse.number(resp[i] == null ? '' : resp[i]); if (!pn.ok) return form('empty', 'Enter one number in each box.'); vals.push(pn.value); }
      var a = vals.slice().sort(function (x, y) { return x - y; }).join(','), b = want.slice().sort(function (x, y) { return x - y; }).join(',');
      if (a === b) return ok();
      var h = diag ? diag(vals) : null;
      return h ? wrong(h.code, h.hint) : wrong('value', null);
    };
  }

  HW.addCodes({ 'said-none': 'Said it can’t be factored (it can)', 'no-pair': 'Wrote factors for a trinomial that doesn’t factor', 'use-none': 'Retyped a trinomial that doesn’t factor',
    'sign-in-blank': 'Typed a sign the bracket already shows', 'whole-bracket': 'Typed only the number, not the whole bracket', 'swap-dims': 'Length and width swapped', 'y-missing': 'Second variable missing from a bracket',
    'not-largest': 'Gave a valid value that isn’t the one asked for', 'gave-c': 'Gave c instead of b', 'u4l3-c-list': 'Listed a value of c that doesn’t work', 'u4l3-c-missing': 'Missed some values of c',
    'u4l3-pairs-neg': 'Counted negative pairs although b and c are positive', 'u4l3-perim': 'Perimeter: added the two sides only once', 'u4l3-perim-area': 'Gave the area instead of the perimeter' });
  HW.addPartial({ 'u4l3-c-list': 'n', 'u4l3-c-missing': 'b', 'u4l3-pairs-neg': 'b', 'u4l3-perim': 'b', 'u4l3-perim-area': 'n' });

  /* ---------- "factor where possible": one box with a none key ---------- */
  function noneField(vars) { return [{ name: 'Factored form', label: 'Factored form', mode: 'math', keys: 'poly', vars: vars, none: true, wide: true, placeholder: 'e.g. (x - 4)(x - 2)' }]; }
  function noneVal(resp) { var v = String((resp || [])[0] || '').trim(); return /^\\(text|mathrm)\{\s*none\s*\}$/i.test(v) ? 'none' : v; }
  var NONE_EMPTY = 'Type the factored form, or press <b>none</b> if it can’t be factored over the integers.';
  function signedPairs(c) { var o = []; posPairs(c).forEach(function (pq) { if (c > 0) { o.push([pq[0], pq[1]]); o.push([-pq[0], -pq[1]]); } else { o.push([pq[0], -pq[1]]); o.push([-pq[0], pq[1]]); } }); return o; }
  function canPart(s, opt) {
    var base = facPart(s, opt), chk = base.check;
    return { prompt: base.prompt, input: { type: 'fields', fields: noneField(varsOf(s.full)) }, key: [base.key], answer: base.answer, solution: base.solution, hints: base.hints, text: base.text,
      check: function (resp) {
        var v = noneVal(resp);
        if (!v) return form('empty', NONE_EMPTY);
        if (/^none$/i.test(v)) return wrong('said-none', 'It <b>can</b> be factored: there is a pair of integers with product ' + t(s.c) + ' and sum ' + t(s.b) + '. Go through the factor pairs of ' + t(Math.abs(s.c)) + ' again. ' + signHint(s.b, s.c));
        return chk(v);
      },
      good: base.good.map(function (g) { return [g]; }), bad: [['none']].concat(base.bad.map(function (b) { return [b]; })) };
  }
  function nonePart(v, b, c, opt) {
    opt = opt || {};
    var T = PL.add(V(v, 2), PL.scale(V(v), b), PL.num(c)), sp = c > 0 ? posPairs(c).map(function (pq) { return b > 0 ? pq : [-pq[0], -pq[1]]; }) : signedPairs(c);
    var sol = 'Need two integers with product ' + t(c) + ' and sum ' + t(b) + (c > 0 ? ' (' + (b > 0 ? 'both positive' : 'both negative') + ')' : '') + '.<br>Pairs with product ' + t(c) + ': ' + sp.map(function (pq) { return t(pq[0] + '\\times ' + par(pq[1])) + ' (sum ' + t(pq[0] + pq[1]) + ')'; }).join(', ') + '.<br>No pair has sum ' + t(b) + ', so ' + t(tx(T)) + ' <b>cannot be factored</b> over the integers.';
    var near = sp.slice().sort(function (x, y) { return Math.abs(x[0] + x[1] - b) - Math.abs(y[0] + y[1] - b); })[0];
    return { prompt: opt.prompt || t(tx(T)), input: { type: 'fields', fields: noneField([v]) }, key: ['none'], answer: 'It cannot be factored over the integers.', solution: sol,
      hints: ['List every pair of integers with product ' + t(c) + ' and add each pair. Is any sum equal to ' + t(b) + '?', 'If no pair works, the trinomial cannot be factored over the integers — press <b>none</b>.'], text: opt.text || 'factor where possible ' + tx(T) + ' (none)',
      check: function (resp) {
        var s = noneVal(resp);
        if (!s) return form('empty', NONE_EMPTY);
        if (/^none$/i.test(s)) return ok();
        var a = K.read(s); if (a.res) return a.res;
        var spl = FA.split(a.ast); if (!spl.ok) return wrong('value', null);
        var S = spl.factors.reduce(function (acc, f) { return PL.mul(acc, PL.pow(f.p, f.k)); }, PL.num(1));
        if (PL.eq(S, T)) return form('use-none', 'That is the trinomial itself. If no pair of integers works, press <b>none</b>.');
        return wrong('no-pair', 'Your factors multiply to ' + t(tx(S)) + ', not ' + t(tx(T)) + '. Test every pair of integers with product ' + t(c) + ': does any pair add to ' + t(b) + '?');
      },
      bad: [['(' + tx(bin(V(v), near[0])) + ')(' + tx(bin(V(v), near[1])) + ')'], [tx(T)]] };
  }
  /* ---------- two integers with a given sum and product ---------- */
  function pairSol(p, q) {
    var s = p + q, c = p * q;
    return signHint(s, c) + '<br>Factor pairs of ' + t(Math.abs(c)) + ': ' + t(pairsTex(c)) + '.<br>' + t(sg(p)) + ' and ' + t(sg(q)) + ': product ' + t(par(p) + '\\times ' + par(q) + '=' + c) + ', sum ' + t(par(p) + '+' + par(q) + '=' + s) + ' ✓';
  }
  function pairCheck(p, q) {
    var s = p + q, c = p * q;
    return function (resp) {
      resp = resp || [];
      var A = HW.parse.number(resp[0] == null ? '' : resp[0]), Bn = HW.parse.number(resp[1] == null ? '' : resp[1]);
      if (!A.ok || !Bn.ok) return form('empty', 'Enter one integer in each box.');
      var x = A.value, y = Bn.value;
      if ((x === p && y === q) || (x === q && y === p)) return ok();
      var both = 'Yours: ' + t(par(x) + '\\times ' + par(y) + '=' + x * y) + ' and ' + t(par(x) + '+' + par(y) + '=' + (x + y)) + '. ';
      if (x * y === c && x + y === -s) return wrong('pair-signs', both + 'Right product, but the sum must be ' + t(s) + ', not ' + t(-s) + '. ' + signHint(s, c));
      if (x * y === c) return wrong('pair-sum', both + 'The product is right ✓ but the sum must be ' + t(s) + '. Try another factor pair of ' + t(Math.abs(c)) + '.');
      if (x + y === s) return wrong('pair-product', both + 'The sum is right ✓ but the product must be ' + t(c) + '. Start from the factor pairs of ' + t(Math.abs(c)) + ' instead.');
      return wrong('value', both + 'Find two integers that multiply to ' + t(c) + ' and add to ' + t(s) + '.');
    };
  }
  function pairPart(p, q, opt) {
    opt = opt || {};
    var s = p + q, c = p * q, lab = ['Integer 1', 'Integer 2'], lo = Math.min(p, q), hi = Math.max(p, q);
    return { prompt: opt.prompt || 'Sum ' + t(s) + ', product ' + t(c) + '.', input: { type: 'fields', fields: [{ name: lab[0], label: lab[0] }, { name: lab[1], label: lab[1] }] },
      check: pairCheck(p, q), key: [String(lo), String(hi)], answer: t(lo + ',\\ ' + hi), solution: pairSol(p, q),
      hints: ['List the factor pairs of ' + t(Math.abs(c)) + ' and add each pair.', signHint(s, c)], text: 'pair: sum ' + s + ', product ' + c,
      good: [[String(hi), String(lo)]], bad: [[String(-hi), String(-lo)], [String(c), String(1)]].filter(function (b) { var x = +b[0], y = +b[1]; return !((x === p && y === q) || (x === q && y === p)); }) };
  }
  /* ---------- blanks inside the brackets ---------- */
  function blankNumPart(s, given, missing, bracketSign, prompt, text) {
    var want = Math.abs(missing), full = facPart(s), v = tx(s.u);
    return { prompt: prompt, input: { type: 'number', before: 'Blank =' }, key: String(want), answer: t(want) + ', so ' + t(s.key),
      check: function (resp) {
        var pn = HW.parse.number(resp);
        if (!pn.ok) return form(pn.code === 'empty' ? 'empty' : 'notnumber', pn.code === 'empty' ? 'Type your answer first.' : 'Enter a single number.');
        var e = pn.value, n = bracketSign * e;
        if (n === missing) return ok();
        if (bracketSign < 0 && e === missing) return form('sign-in-blank', 'The bracket already shows the minus sign, so type just the number: ' + t('(' + v + '-3)') + ' means the integer ' + t('-3') + '.');
        if (e === s.b || e === -s.b) return wrong('gave-sum', t(Math.abs(s.b)) + ' comes from the middle term — it is the <b>sum</b>. The blank holds the number that pairs with ' + t(sg(given)) + ': together they multiply to ' + t(s.c) + ' and add to ' + t(s.b) + '.');
        if (e === s.c || e === -s.c) return wrong('gave-product', t(Math.abs(s.c)) + ' is the <b>product</b> of the two numbers. Which number times ' + t(par(given)) + ' gives ' + t(s.c) + '?');
        return full.check('(' + tx(bin(s.u, given)) + ')(' + tx(bin(s.u, n)) + ')');
      },
      solution: 'Two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + ': ' + t(sg(given)) + ' and ' + t(sg(missing)) + '.<br>The bracket shows the sign already, so the blank is ' + t(want) + ': ' + t(tx(s.full) + '=' + s.key) + '.',
      hints: ['The two numbers in the brackets multiply to ' + t(s.c) + ' and add to ' + t(s.b) + '. One of them is ' + t(sg(given)) + '.', 'What times ' + t(par(given)) + ' gives ' + t(s.c) + '?'], text: text,
      bad: [String(Math.abs(s.b)), String(-want)] };
  }
  function blankPairPart(s, bracketSign, prompt, text) {
    var full = facPart(s), v = tx(s.u), w1 = Math.abs(s.p), w2 = Math.abs(s.q), lab = ['First blank', 'Second blank'];
    return { prompt: prompt, input: { type: 'fields', fields: [{ name: lab[0], label: lab[0] }, { name: lab[1], label: lab[1] }] }, key: [String(Math.min(w1, w2)), String(Math.max(w1, w2))],
      answer: t(Math.min(w1, w2)) + ' and ' + t(Math.max(w1, w2)) + ', so ' + t(s.key),
      check: function (resp) {
        resp = resp || [];
        var A = HW.parse.number(resp[0] == null ? '' : resp[0]), Bn = HW.parse.number(resp[1] == null ? '' : resp[1]);
        if (!A.ok || !Bn.ok) return form('empty', 'Enter one number in each blank.');
        var x = bracketSign * A.value, y = bracketSign * Bn.value;
        if ((x === s.p && y === s.q) || (x === s.q && y === s.p)) return ok();
        if (bracketSign < 0 && ((-x === s.p && -y === s.q) || (-x === s.q && -y === s.p))) return form('sign-in-blank', 'The brackets already show the minus signs, so type just the numbers: ' + t('(' + v + '-3)') + ' means the integer ' + t('-3') + '.');
        return full.check('(' + tx(bin(s.u, x)) + ')(' + tx(bin(s.u, y)) + ')');
      },
      solution: 'Two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + ': ' + t(sg(s.p)) + ' and ' + t(sg(s.q)) + '.' + (bracketSign < 0 ? ' The brackets already carry the minus signs, so the blanks are ' + t(w1) + ' and ' + t(w2) + '.' : '') + '<br>' + t(tx(s.full) + '=' + s.key),
      hints: ['The two numbers multiply to ' + t(s.c) + ' and add to ' + t(s.b) + '.', 'List the factor pairs of ' + t(Math.abs(s.c)) + ' and add each pair.'], text: text,
      good: [[String(Math.max(w1, w2)), String(Math.min(w1, w2))]], bad: [[String(Math.abs(s.b)), String(Math.abs(s.c))]] };
  }
  function blankBinPart(s, given, missing, prompt, text) {
    var full = facPart(s), v = tx(s.u), Mb = bin(s.u, missing), vs = varsOf(s.full);
    var p = KP.math(prompt, function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (!/[a-z]/i.test(String(resp))) return form('whole-bracket', 'Write the whole bracket, e.g. ' + t(v + '+4') + ' — not just the number.');
      return full.check('(' + tx(bin(s.u, given)) + ')(' + String(resp) + ')');
    }, tx(Mb), 'Two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + ': ' + t(sg(given)) + ' and ' + t(sg(missing)) + '.<br>So the missing factor is ' + t('(' + tx(Mb) + ')') + ' and ' + t(tx(s.full) + '=' + s.key) + '.',
    ['The numbers in the two brackets multiply to ' + t(s.c) + ' and add to ' + t(s.b) + '.', 'One of them is ' + t(sg(given)) + '. Which number goes with it?'], text, { keys: 'poly', vars: vs, before: t('(' + tx(bin(s.u, given)) + ')') });
    p.good = ['(' + tx(Mb) + ')', missing + (missing < 0 ? '' : '') + '+' + v];
    p.good[1] = tx(PL.add(PL.num(missing), s.u), { order: 'asc' });
    p.bad = [tx(bin(s.u, -missing)), String(Math.abs(missing))];
    return p;
  }
  function triList(v, b, c) { return t(tx(PL.add(V(v, 2), PL.scale(V(v), b), PL.num(c)))); }
  function numBoxes(labels, after) { return labels.map(function (l) { return { name: l, label: l, after: after }; }); }
  /* a list of integers (chips) with diagnoses */
  function listPart(prompt, want, opt) {
    opt = opt || {};
    var sorted = want.slice().sort(function (a, b) { return a - b; });
    return { prompt: prompt, input: { type: 'list' }, key: sorted, answer: t(sorted.join(',\\ ')),
      check: function (resp) {
        if (!resp || !resp.length) return form('empty', 'Add the values one at a time (press Enter or comma after each).');
        var seen = {}; for (var i = 0; i < resp.length; i++) { if (seen[resp[i]]) return form('duplicate', 'You listed ' + t(resp[i]) + ' more than once.'); seen[resp[i]] = 1; }
        var bad = resp.filter(function (v) { return want.indexOf(v) < 0; });
        if (bad.length) return wrong(opt.badCode || 'not-b', opt.badHint(bad[0]));
        if (opt.negHint && resp.every(function (v) { return v > 0; }) && want.some(function (v) { return v < 0; })) return wrong('no-negatives', opt.negHint);
        if (resp.length < want.length) return wrong(opt.missCode || 'missing-b', 'You have ' + resp.length + ' of the ' + want.length + ' values. ' + (opt.missHint || 'Go through every factor pair in order.'));
        return ok();
      },
      solution: opt.sol, hints: opt.hints || [], text: opt.text, bad: opt.bad || [sorted.slice(1)] };
  }

  /* ================= Lesson 3 generators ================= */
  function sp(p, q, o) { return spec(Object.assign({ p: p, q: q }, o || {})); }
  var LV = ['x', 'x', 'x', 'a', 'y', 'm', 'n', 't', 'k'];
  function lv(r) { return r.pick(LV); }
  var YV = [['x', 'y'], ['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']];
  function spv(r, p, q, o) { return sp(p, q, Object.assign({ v: lv(r) }, o || {})); }
  function pq(r, lo1, hi1, lo2, hi2, test) { return pickWhere(function () { return [r.int(lo1, hi1), r.int(lo2, hi2)]; }, function (o) { return o[0] < o[1] && (!test || test(o)); }); }
  function dims(s, x, prompt) {
    var L = x + Math.max(s.p, s.q), W = x + Math.min(s.p, s.q), area = L * W;
    return { prompt: prompt, input: { type: 'fields', fields: numBoxes(['Length', 'Width'], t('\\text{m}')) },
      key: [String(L), String(W)], answer: 'Length ' + t(L + '\\text{ m}') + ', width ' + t(W + '\\text{ m}'),
      check: function (resp) {
        resp = resp || [];
        var a = HW.parse.number(resp[0] == null ? '' : resp[0]), b = HW.parse.number(resp[1] == null ? '' : resp[1]);
        if (!a.ok || !b.ok) return form('empty', 'Enter a number in each box.');
        if (a.value === L && b.value === W) return ok();
        if (a.value === W && b.value === L) return form('swap-dims', 'Right numbers — the length is the longer side, so swap them.');
        if (a.value === Math.max(s.p, s.q) || b.value === Math.min(s.p, s.q)) return wrong('not-subst', 'Substitute ' + t('x=' + x) + ' into each binomial: ' + t('x+' + Math.max(s.p, s.q)) + ' becomes ' + t(x + '+' + Math.max(s.p, s.q)) + '.');
        if (a.value * b.value === area) return wrong('value', 'Those multiply to the right area, ' + t(area) + ', but they aren’t the binomials evaluated at ' + t('x=' + x) + '. Substitute into each factor.');
        return wrong('value', 'Substitute ' + t('x=' + x) + ' into each of your two factors.');
      },
      solution: 'Length ' + t('=' + x + '+' + Math.max(s.p, s.q) + '=' + L) + ' m, width ' + t('=' + x + '+' + Math.min(s.p, s.q) + '=' + W) + ' m.<br>Check: ' + t(L + '\\times ' + W + '=' + area) + ' and ' + t(x + '^{2}+' + s.b + '(' + x + ')+' + s.c + '=' + area) + ' ✓',
      hints: ['Use your factors: substitute ' + t('x=' + x) + ' into each one. The length is the longer side.'], text: 'dimensions at x=' + x, bad: [[String(W), String(L)], [String(Math.max(s.p, s.q)), String(Math.min(s.p, s.q))]] };
  }
  function stdWrongsY(s) {
    if (!s.w) return [];
    var yh = 'Each bracket needs its own ' + t(tx(s.w)) + ': the last term ' + t(tx(PL.mul(PL.num(s.c), PL.pow(s.w, 2)))) + ' comes from multiplying the two last terms, so each must supply one ' + t(tx(s.w)) + '.';
    return [{ is: PL.mul(s.G, bin(s.u, s.p), bin(s.u, s.q, s.w)), code: 'y-missing', hint: yh }, { is: PL.mul(s.G, bin(s.u, s.p, s.w), bin(s.u, s.q)), code: 'y-missing', hint: yh },
      { is: PL.mul(s.G, bin(s.u, s.p), bin(s.u, s.q)), code: 'y-missing', hint: 'Don’t leave out ' + t(tx(s.w)) + ': it rides along with the second term of each bracket.' }].filter(function (w) { return !PL.eq(w.is, s.full); });
  }
  function fac(s, opt) { opt = opt || {}; return facPart(s, Object.assign({}, opt, { wrong: stdWrongsY(s).concat(opt.wrong || []) })); }
  function gcfFac(G, p, q, v) { return fac(sp(p, q, { G: G, v: v })); }

  HW.defineLesson({
    id: 'u4l3', unit: 4, num: '3', title: 'Factoring Trinomials x² + bx + c, Part 1: c Positive', outcome: 'AN5',
    blurb: 'Run FOIL backwards: find two numbers that multiply to c and add to b. With c positive, both numbers have the sign of b.',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A — FOIL and the Sum–Product Pattern', stem: 'Expand each product using FOIL.', parts: [
        { id: '1a', level: 'LIM', make: function (r) { var o = pq(r, 1, 6, 2, 9); return expandPart(spv(r, o[0], o[1])); } },
        { id: '1b', level: 'BEG', make: function (r) { var k = r.int(2, 9); return expandPart(spv(r, k, k)); } }] },
      { num: '2', stem: 'Find two <b>positive</b> integers with the given sum and product.', parts: [
        { id: '2a', level: 'LIM', make: function (r) { var o = pq(r, 1, 5, 2, 9, function (o) { return o[0] * o[1] <= 30; }); return pairPart(o[0], o[1]); } },
        { id: '2b', level: 'LIM', make: function (r) { var o = pq(r, 1, 5, 3, 10, function (o) { return o[0] * o[1] <= 40 && posPairs(o[0] * o[1]).length >= 2; }); return pairPart(o[0], o[1]); } },
        { id: '2c', level: 'BEG', make: function (r) { var o = pq(r, 2, 5, 5, 12, function (o) { return posPairs(o[0] * o[1]).length >= 3 && o[0] * o[1] <= 60; }); return pairPart(o[0], o[1]); } },
        { id: '2d', level: 'BEG', make: function (r) { var o = pq(r, 3, 7, 5, 12, function (o) { return posPairs(o[0] * o[1]).length >= 3 && o[0] * o[1] <= 72; }); return pairPart(o[0], o[1]); } }] },
      { num: '3', stem: 'Complete the following.', parts: [
        { id: '3a', level: 'LIM', make: function (r) { var o = pickWhere(function () { return [r.int(2, 6), r.int(3, 9)]; }, function (o) { return o[0] !== o[1]; }), s = spv(r, o[0], o[1]), v = tx(s.u); return blankNumPart(s, o[0], o[1], 1, t(tx(s.full) + '=(' + v + '+' + o[0] + ')(' + v + '+\\underline{\\quad\\;})'), 'fill blank (x+a)(x+_)'); } },
        { id: '3b', level: 'BEG', make: function (r) { var o = pq(r, 1, 4, 4, 12, function (o) { return o[0] * o[1] <= 40 && posPairs(o[0] * o[1]).length >= 2; }), s = spv(r, o[0], o[1]), v = tx(s.u); return blankPairPart(s, 1, t(tx(s.full) + '=(' + v + '+\\underline{\\quad\\;})(' + v + '+\\underline{\\quad\\;})'), 'fill blanks (x+_)(x+_)'); } },
        { id: '3c', level: 'BEG', make: function (r) { var p = r.int(2, 5), q = r.int(p + 2, 12), s = spv(r, -p, -q), v = tx(s.u); return blankNumPart(s, -p, -q, -1, t(tx(s.full) + '=(' + v + '-' + p + ')(' + v + '-\\underline{\\quad\\;})'), 'fill blank (x-a)(x-_)'); } },
        { id: '3d', level: 'BEG', make: function (r) { var q = r.pick([6, 8, 10, 12, 14, 15, 18, 20, 9, 16, 21, 22, 24, 11, 13]), v = r.pick(['t', 't', 'x', 'n', 'k']), s = sp(-1, -q, { v: v }); return blankPairPart(s, -1, t(tx(s.full) + '=(' + v + '-\\underline{\\quad\\;})(' + v + '-\\underline{\\quad\\;})'), 'fill blanks (t-_)(t-_)'); } },
        { id: '3e', level: 'BEG', make: function (r) { var p = r.int(2, 5), q = pickWhere(function () { return r.int(3, 12); }, function (v) { return v !== p; }), s = sp(p, q, { v: 'z' }); return blankBinPart(s, p, q, t(tx(s.full) + '=(z+' + p + ')(\\underline{\\qquad})'), 'missing factor (z+a)(__)'); } },
        { id: '3f', level: 'BEG', make: function (r) { var p = r.int(2, 4), q = r.int(5, 14), s = sp(-p, -q, { v: 'b' }); return blankBinPart(s, -p, -q, t(tx(s.full) + '=(b-' + p + ')(\\underline{\\qquad})'), 'missing factor (b-a)(__)'); } }] },
      /* ---------------- Part B ---------------- */
      { num: '4', section: 'Part B — Factoring x² + bx + c', stem: 'Factor each trinomial. (In each case, ' + t('b') + ' and ' + t('c') + ' are both positive.)', parts: [
        { id: '4a', level: 'LIM', make: function (r) { var o = pq(r, 1, 3, 2, 6); return fac(spv(r, o[0], o[1])); } },
        { id: '4b', level: 'BEG', make: function (r) { var q = r.int(4, 14); return fac(spv(r, 1, q)); } },
        { id: '4c', level: 'BEG', make: function (r) { var o = pq(r, 2, 3, 5, 9); return fac(spv(r, o[0], o[1])); } },
        { id: '4d', level: 'BEG', make: function (r) { var q = r.pick([10, 12, 14, 15, 16, 18, 20, 21, 22]); return fac(spv(r, 1, q)); } },
        { id: '4e', level: 'BEG', make: function (r) { var o = pq(r, 2, 4, 6, 12, function (o) { return o[0] * o[1] <= 40; }); return fac(spv(r, o[0], o[1])); } },
        { id: '4f', level: 'BEG', make: function (r) { var o = pq(r, 2, 4, 8, 14, function (o) { return o[0] * o[1] <= 48 && posPairs(o[0] * o[1]).length >= 4; }); return fac(spv(r, o[0], o[1])); } }] },
      { num: '5', stem: 'Factor each trinomial. (In each case, ' + t('b') + ' is negative and ' + t('c') + ' is positive.)', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var o = pq(r, 1, 3, 2, 6); return fac(spv(r, -o[0], -o[1])); } },
        { id: '5b', level: 'BEG', make: function (r) { var q = r.int(4, 14); return fac(spv(r, -1, -q)); } },
        { id: '5c', level: 'BEG', make: function (r) { var o = pq(r, 2, 3, 5, 9); return fac(spv(r, -o[0], -o[1])); } },
        { id: '5d', level: 'BEG', make: function (r) { var q = r.pick([10, 12, 14, 15, 16, 18, 20, 21, 22]); return fac(spv(r, -1, -q)); } },
        { id: '5e', level: 'BEG', make: function (r) { var o = pq(r, 2, 4, 6, 12, function (o) { return o[0] * o[1] <= 40; }); return fac(spv(r, -o[0], -o[1])); } },
        { id: '5f', level: 'BEG', make: function (r) { var o = pq(r, 2, 4, 8, 14, function (o) { return o[0] * o[1] <= 48 && posPairs(o[0] * o[1]).length >= 4; }); return fac(spv(r, -o[0], -o[1])); } }] },
      { num: '6', stem: 'Factor where possible. If a trinomial can’t be factored over the integers, press <b>none</b>.',
        shared: function (r) { var o = pq(r, 2, 3, 6, 11); return { p: o[0], q: o[1], r: pq(r, 1, 2, 9, 13) }; },
        parts: [
          { id: '6a', level: 'BEG', make: function (r, sh) { return canPart(spv(r, sh.p, sh.q)); } },
          { id: '6b', level: 'BEG', make: function (r, sh) { return canPart(spv(r, -sh.p, -sh.q)); } },
          { id: '6c', level: 'BEG', make: function (r, sh) { return canPart(spv(r, sh.r[0], sh.r[1])); } },
          { id: '6d', level: 'BEG', make: function (r, sh) { return canPart(spv(r, -sh.r[0], -sh.r[1])); } },
          { id: '6e', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { c: r.pick([15, 10, 14, 21, 22, 6, 26, 33, 35, 12, 18, 20]), b: r.int(3, 20) }; }, function (o) { var sm = posPairs(o.c).map(function (x) { return x[0] + x[1]; }); return !factorable(o.b, o.c) && o.b > Math.min.apply(null, sm) && o.b < Math.max.apply(null, sm); }); return nonePart(lv(r), o.b, o.c); } },
          { id: '6f', level: 'BEG', make: function (r) { var q = r.pick([5, 7, 11, 13, 3, 17, 19]); return canPart(spv(r, -1, -q)); } },
          { id: '6g', level: 'BEG', make: function (r) { var q = r.pick([12, 14, 15, 16, 18, 20, 21, 24]); return canPart(spv(r, 1, q)); } },
          { id: '6h', level: 'EMG', make: function (r) { var o = pq(r, 2, 4, 9, 14, function (o) { return posPairs(o[0] * o[1]).length >= 4 && o[0] * o[1] <= 56; }); return canPart(spv(r, -o[0], -o[1])); } }] },
      { num: '7', stem: 'Factor completely. (Remove any common factor first.)', parts: [
        { id: '7a', level: 'EMG', make: function (r) { var o = pq(r, 1, 4, 3, 7); return gcfFac(N(r.pick([2, 3, 5])), o[0], o[1]); } },
        { id: '7b', level: 'PRG', make: function (r) { var o = pq(r, 2, 5, 3, 8); return gcfFac(N(r.pick([2, 3, 4])), -o[0], -o[1]); } },
        { id: '7c', level: 'EMG', make: function (r) { var o = pq(r, 1, 4, 5, 9); return gcfFac(N(r.pick([2, 3, 4, 5])), o[0], o[1]); } },
        { id: '7d', level: 'PRG', make: function (r) { var o = pq(r, 1, 4, 3, 9); return gcfFac(V(r.pick(['a', 'a', 'k', 'm'])), o[0], o[1]); } },
        { id: '7e', level: 'ADV', make: function (r) { var o = pq(r, 1, 5, 2, 7); return gcfFac(M(-r.pick([2, 3, 4]), { x: 1 }), o[0], o[1]); } }] },
      /* ---------------- Part C ---------------- */
      claimQ('8', 'a', function (r) { return pq(r, 2, 4, 5, 10, function (o) { return posPairs(o[0] * o[1]).length >= 2; }); }, 'Part C — Checking, Applications and Mixed Practice'),
      claimQ('8', 'b', function (r) { return pq(r, 2, 5, 3, 8, function (o) { return posPairs(o[0] * o[1]).length >= 3; }); }),
      { num: '9', stem: function (sh) { return 'A rectangular garden has an area of ' + t(tx(sh.s.full)) + ' square metres.'; },
        shared: function (r) { var o = pq(r, 1, 6, 3, 10, function (o) { return o[0] * o[1] <= 48; }); return { s: sp(o[0], o[1]), x: r.int(3, 8) }; },
        parts: [
          { id: '9a', level: 'BEG', make: function (r, sh) { var f = fac(sh.s, { prompt: 'Factor ' + t(tx(sh.s.full)) + ' to find binomials representing the length and width of the garden.', text: 'garden factor' }); f.solution += '<br>So the garden is ' + t('(' + tx(sh.s.B) + ')') + ' m by ' + t('(' + tx(sh.s.A) + ')') + ' m.'; return f; } },
          { id: '9b', level: 'BEG', make: function (r, sh) { return dims(sh.s, sh.x, 'If ' + t('x=' + sh.x) + ', determine the length and width of the garden.'); } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'BEG', make: function (r) {
          var o = pickWhere(function () { var c = r.pick([36, 24, 30, 40, 48, 60, 72, 20, 28, 42]); return { c: c, pp: posPairs(c) }; }, function (o) { return o.pp.length >= 4; });
          var pick = r.sample(o.pp, 4), right = pick[0], s = sp(right[0], right[1]);
          return mcPart(r, 'The correct factorization of ' + t(tx(s.full)) + ' is', pick.map(function (pr, i) { return { html: t('(x+' + pr[0] + ')(x+' + pr[1] + ')'), right: i === 0, why: i === 0 ? null : 'Both numbers multiply to ' + t(o.c) + ', but ' + t(pr[0] + '+' + pr[1] + '=' + (pr[0] + pr[1])) + ', not ' + t(s.b) + '.' }; }),
            'Pairs with product ' + t(o.c) + ': ' + t(pairsTex(o.c)) + '. The one with sum ' + t(s.b) + ' is ' + t(right[0] + ',\\ ' + right[1]) + ', so ' + t(tx(s.full) + '=' + s.key) + '.', ['All the options multiply to the right constant. Which pair also adds to ' + t(s.b) + '?'], 'MC factorization');
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var k = r.pick([2, 3, 5]), o = pickWhere(function () { return [r.int(2, 8), r.int(3, 9)]; }, function (o) { return o[0] < o[1] && o[0] * o[1] <= 60; }), p = o[0], q = o[1];
          var cand = []; for (var d = 2; d <= 9; d++) if (d !== p && d !== q) cand.push(d);
          var divs = cand.filter(function (d) { return (p * q) % d === 0; }), rr = r.pick(divs.length ? divs : cand), s = sp(-p, -q, { G: N(k) });
          var fh = 'Factor completely: ' + t(tx(s.full) + '=' + s.key) + '. That one <b>is</b> a factor.';
          return mcPart(r, 'Which of the following is <b>not</b> a factor of ' + t(tx(s.full)) + '?', [
            { html: t('x-' + rr), right: true }, { html: t('x-' + p), why: fh }, { html: t('x-' + q), why: fh }, { html: t(k), why: 'The common factor ' + t(k) + ' is a factor: ' + t(tx(s.full) + '=' + s.key) + '.' }],
            'Common factor ' + t(k) + ': ' + t(k + '(' + tx(s.inner) + ')') + '. Product ' + t(s.c) + ', sum ' + t(s.b) + ': ' + t(-p) + ' and ' + t(-q) + '.<br>' + t(tx(s.full) + '=' + s.key) + '. The factors are ' + t(k) + ', ' + t('x-' + p) + ' and ' + t('x-' + q) + '; ' + t('x-' + rr) + ' is not one of them.',
            ['Factor completely first: take out the common factor, then factor the trinomial.'], 'MC not a factor');
        } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '12', level: 'PRG', make: function (r) {
          var c = r.pick([24, 18, 20, 30, 36, 40, 48, 60, 28, 32, 42, 54, 56, 64, 72, 80, 45, 50, 63, 84]), sums = posPairs(c).map(function (x) { return x[0] + x[1]; }), ans = Math.min.apply(null, sums), big = Math.max.apply(null, sums);
          return KP.nr('The trinomial ' + t('x^{2}+bx+' + c) + ' can be factored over the integers for several positive values of ' + t('b') + '. The <b>smallest</b> possible positive value of ' + t('b') + ' is ________.', ans, function (v) {
            if (v === big) return { code: 'not-largest', hint: 'That is the <b>largest</b> value (from ' + t('1\\times ' + c) + '). Which pair has the smallest sum?' };
            if (sums.indexOf(v) >= 0) return { code: 'not-largest', hint: t(v) + ' works, but it isn’t the smallest. Check every factor pair of ' + t(c) + '.' };
            if (v === c) return { code: 'gave-c', hint: t('b') + ' is the <b>sum</b> of a factor pair of ' + t(c) + ', not ' + t(c) + ' itself.' };
            return null;
          }, 'Each positive factor pair of ' + t(c) + ' gives a value of ' + t('b') + ' (its sum): ' + posPairs(c).map(function (x) { return t(x[0] + '\\times ' + x[1]) + ' → ' + t(x[0] + x[1]); }).join(', ') + '. The smallest is ' + t('\\mathbf{' + ans + '}') + ' (the pair closest together).',
          ['List the factor pairs of ' + t(c) + ' and add each pair.', 'The pair whose numbers are closest together has the smallest sum.'], 'NR smallest b for c=' + c);
        } }] },
      { num: '13', stem: 'Factor each trinomial where possible. If one can’t be factored over the integers, press <b>none</b>.',
        shared: function (r) { return { a: r.pick([5, 7, 11, 13, 3, 17]), c: pq(r, 2, 4, 5, 12, function (o) { return o[0] * o[1] <= 40; }), e: r.pick([12, 14, 15, 16, 18, 20, 22]), g: r.int(3, 9) }; },
        parts: [
          { id: '13a', level: 'BEG', make: function (r, sh) { return canPart(spv(r, 1, sh.a)); } },
          { id: '13b', level: 'BEG', make: function (r, sh) { return canPart(spv(r, -1, -sh.a)); } },
          { id: '13c', level: 'BEG', make: function (r, sh) { return canPart(spv(r, sh.c[0], sh.c[1])); } },
          { id: '13d', level: 'BEG', make: function (r, sh) { return canPart(spv(r, -sh.c[0], -sh.c[1])); } },
          { id: '13e', level: 'BEG', make: function (r, sh) { return canPart(spv(r, 1, sh.e)); } },
          { id: '13f', level: 'BEG', make: function (r, sh) { return canPart(spv(r, -1, -sh.e)); } },
          { id: '13g', level: 'EMG', make: function (r, sh) { return canPart(spv(r, sh.g, sh.g)); } },
          { id: '13h', level: 'EMG', make: function (r, sh) { return canPart(spv(r, -sh.g, -sh.g)); } }] },
      { num: '14', stem: 'Factor where possible. If a trinomial can’t be factored over the integers, press <b>none</b>.',
        shared: function (r) { return { o: pq(r, 2, 5, 5, 9, function (o) { return o[0] * o[1] <= 40; }) }; },
        parts: [
          { id: '14a', level: 'BEG', make: function (r, sh) { return canPart(spv(r, sh.o[0], sh.o[1])); } },
          { id: '14b', level: 'BEG', make: function (r, sh) { return canPart(spv(r, -sh.o[0], -sh.o[1])); } },
          { id: '14c', level: 'BEG', make: function (r) { var o = pq(r, 2, 5, 5, 9); return canPart(spv(r, o[0], o[1])); } },
          { id: '14d', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { c: r.pick([20, 12, 18, 24, 28, 30, 10, 14, 15, 21]), b: r.int(2, 12) }; }, function (o) { return !factorable(o.b, o.c) && o.b < o.c + 1; }); return nonePart(lv(r), o.b, o.c); } },
          { id: '14e', level: 'BEG', make: function (r) { var o = pq(r, 3, 6, 7, 12, function (o) { return o[0] * o[1] <= 60; }); return canPart(spv(r, -o[0], -o[1])); } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'PRG', make: function (r) {
          var k = r.pick([9, 9, 7, 8, 10, 11, 12, 13, 14]), prods = []; for (var p = 1; p < k / 2; p++) prods.push(p * (k - p));
          var notc = pickWhere(function () { return r.int(Math.min.apply(null, prods) + 1, Math.max.apply(null, prods) + 2); }, function (c) { return prods.indexOf(c) < 0 && !factorable(-k, c); });
          var three = r.sample(prods, 3), v = r.pick(['x', 'x', 'm', 'y', 'a', 't']);
          return mcPart(r, 'The trinomial ' + t(v + '^{2}-' + k + v + '+c') + ' <b>cannot</b> be factored over the integers if ' + t('c') + ' has the value', three.map(function (c) { var a = prods.indexOf(c) + 1; return { html: t(c), why: 'It can: ' + t('-' + a + '\\times(-' + (k - a) + ')=' + c) + ' and ' + t('-' + a + '+(-' + (k - a) + ')=-' + k) + ', so ' + t(v + '^{2}-' + k + v + '+' + c + '=(' + v + '-' + a + ')(' + v + '-' + (k - a) + ')') + '.' }; }).concat([{ html: t(notc), right: true }]),
            'The two numbers must both be negative and add to ' + t(-k) + ': ' + prods.map(function (c, i) { return t('-' + (i + 1) + ',\\ -' + (k - i - 1)) + ' (product ' + t(c) + ')'; }).join(', ') + '. ' + t(notc) + ' is not one of these products, so ' + t(v + '^{2}-' + k + v + '+' + notc) + ' cannot be factored.',
            ['For each choice of ' + t('c') + ', look for two negative numbers with product ' + t('c') + ' and sum ' + t(-k) + '.'], 'MC which c fails');
        } }] }
    ],
    extra: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Extra practice A — Larger constants: when the search is the work', stem: 'Factor each trinomial. (Here ' + t('b') + ' and ' + t('c') + ' are both positive, so both numbers are positive.) Work through the factor pairs of ' + t('c') + ' in order.', parts: [
        { id: 'e1a', level: 'EMG', make: function (r) { var o = pq(r, 3, 6, 6, 12, function (o) { return o[0] * o[1] >= 24 && posPairs(o[0] * o[1]).length >= 4; }); return fac(spv(r, o[0], o[1])); } },
        { id: 'e1b', level: 'EMG', make: function (r) { var o = pq(r, 6, 9, 7, 12, function (o) { return o[1] - o[0] <= 3; }); return fac(spv(r, o[0], o[1])); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var o = pq(r, 3, 6, 12, 20, function (o) { return posPairs(o[0] * o[1]).length >= 4 && o[0] * o[1] <= 100; }); return fac(spv(r, o[0], o[1])); } },
        { id: 'e1d', level: 'EMG', make: function (r) { var o = pq(r, 5, 9, 6, 12, function (o) { return o[1] - o[0] <= 3 && o[0] * o[1] >= 40; }); return fac(spv(r, o[0], o[1])); } }] },
      { num: '2', stem: 'Factor each trinomial. (Here ' + t('b') + ' is negative and ' + t('c') + ' is positive, so <b>both</b> numbers must be negative.)', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { var o = pq(r, 2, 4, 6, 12, function (o) { return posPairs(o[0] * o[1]).length >= 4; }); return fac(spv(r, -o[0], -o[1])); } },
        { id: 'e2b', level: 'EMG', make: function (r) { var o = pq(r, 3, 6, 12, 20, function (o) { return posPairs(o[0] * o[1]).length >= 4 && o[0] * o[1] <= 100; }); return fac(spv(r, -o[0], -o[1])); } },
        { id: 'e2c', level: 'EMG', make: function (r) { var o = pq(r, 2, 4, 12, 18, function (o) { return posPairs(o[0] * o[1]).length >= 4; }); return fac(spv(r, -o[0], -o[1])); } },
        { id: 'e2d', level: 'EMG', make: function (r) { var o = pq(r, 3, 6, 12, 20, function (o) { return posPairs(o[0] * o[1]).length >= 5 && o[0] * o[1] <= 100; }); return fac(spv(r, -o[0], -o[1])); } }] },
      { num: '3', stem: 'Factor each trinomial. The two numbers are very far apart, so the pair you want is near the start or the end of your list.', parts: [
        { id: 'e3a', level: 'PRG', make: function (r) { var o = pq(r, 2, 3, 15, 30, function (o) { return o[0] * o[1] <= 90; }); return fac(spv(r, o[0], o[1])); } },
        { id: 'e3b', level: 'PRG', make: function (r) { var o = pq(r, 2, 3, 14, 30, function (o) { return o[0] * o[1] <= 90; }); return fac(spv(r, -o[0], -o[1])); } },
        { id: 'e3c', level: 'PRG', make: function (r) { var o = pq(r, 2, 4, 20, 32, function (o) { return o[0] * o[1] <= 100; }); return fac(spv(r, o[0], o[1])); } },
        { id: 'e3d', level: 'PRG', make: function (r) { var o = pq(r, 2, 4, 18, 30, function (o) { return o[0] * o[1] <= 100; }); return fac(spv(r, -o[0], -o[1])); } }] },
      /* ---------------- Part B ---------------- */
      { num: '4', section: 'Extra practice B — Common factor first, then the trinomial', stem: 'Factor completely. Remove the common factor first, then factor the trinomial.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) { var o = pq(r, 1, 4, 3, 8); return gcfFac(N(r.pick([2, 3, 4, 5])), o[0], o[1]); } },
        { id: 'e4b', level: 'EMG', make: function (r) { var o = pq(r, 2, 4, 4, 8); return gcfFac(N(r.pick([2, 3, 4, 5])), -o[0], -o[1]); } },
        { id: 'e4c', level: 'EMG', make: function (r) { var o = pq(r, 4, 7, 5, 9); return gcfFac(N(r.pick([2, 3])), o[0], o[1]); } }] },
      { num: '5', stem: 'Factor completely. In part (c) the leading coefficient is negative, so remove a <b>negative</b> common factor.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) { var o = pq(r, 2, 5, 3, 8); return gcfFac(N(r.pick([2, 3, 4])), -o[0], -o[1]); } },
        { id: 'e5b', level: 'EMG', make: function (r) { var o = pq(r, 2, 4, 4, 7); return gcfFac(N(r.pick([5, 6, 7])), o[0], o[1]); } },
        { id: 'e5c', level: 'PRG', make: function (r) { var o = pq(r, 1, 4, 2, 7); return gcfFac(N(-r.pick([2, 3, 4, 5])), o[0], o[1]); } }] },
      { num: '6', stem: 'Factor completely. Here the common factor contains a variable.', parts: [
        { id: 'e6a', level: 'PRG', make: function (r) { var o = pq(r, 2, 6, 3, 9); return gcfFac(V('x'), o[0], o[1]); } },
        { id: 'e6b', level: 'PRG', make: function (r) { var o = pq(r, 2, 6, 3, 9); return gcfFac(M(r.pick([2, 3]), { x: 1 }), -o[0], -o[1]); } },
        { id: 'e6c', level: 'PRG', make: function (r) { var o = pq(r, 1, 4, 3, 7), L = r.pick(['a', 'a', 'k', 'm']); return gcfFac(M(r.pick([2, 3, 4]), { [L]: 1 }), o[0], o[1]); } }] },
      /* ---------------- Part C ---------------- */
      { num: '7', section: 'Extra practice C — Two variables and higher powers', stem: 'The sum–product rule doesn’t care what the variable is called: in ' + t('x^{2}+7xy+12y^{2}') + ' the pattern is ' + t('(x+py)(x+qy)') + ' with ' + t('pq=12') + ' and ' + t('p+q=7') + '. Factor each trinomial in two variables.', parts: [
        { id: 'e7a', level: 'PRG', make: function (r) { var o = pq(r, 1, 5, 3, 8), L = r.pick(YV); return fac(sp(o[0], o[1], { v: L[0], y: L[1] })); } },
        { id: 'e7b', level: 'PRG', make: function (r) { var o = pq(r, 2, 6, 5, 10), L = r.pick(YV); return fac(sp(-o[0], -o[1], { v: L[0], y: L[1] })); } },
        { id: 'e7c', level: 'PRG', make: function (r) { var o = pq(r, 4, 8, 6, 11), L = r.pick(YV); return fac(sp(o[0], o[1], { v: L[0], y: L[1] })); } },
        { id: 'e7d', level: 'PRG', make: function (r) { var o = pq(r, 3, 7, 6, 11), L = r.pick(YV); return fac(sp(-o[0], -o[1], { v: L[0], y: L[1] })); } }] },
      { num: '8', stem: '<b>Stretch.</b> In ' + t('x^{4}+7x^{2}+12') + ', notice that ' + t('x^{4}=(x^{2})^{2}') + '. If the “variable” is ' + t('x^{2}') + ', the expression is ' + t('(\\square)^{2}+7(\\square)+12') + ' and the usual rule applies. Factor each into two brackets.', parts: [
        { id: 'e8a', level: 'ADV', make: function (r) { var o = pq(r, 1, 5, 2, 8); return stretchPart(sp(o[0], o[1], { v: r.pick(['x', 'x', 'a', 'm']), e: 2 })); } },
        { id: 'e8b', level: 'ADV', make: function (r) { var o = pq(r, 2, 5, 3, 9, function (o) { return !isSq(o[0]) || !isSq(o[1]); }); return stretchPart(sp(o[0], o[1], { v: r.pick(['y', 'y', 'x', 'n']), e: 2 })); } },
        { id: 'e8c', level: 'ADV', make: function (r) { var o = pickWhere(function () { return r.sample([1, 4, 9, 16, 25], 2); }, function (o) { return o[0] < o[1] && o[0] * o[1] <= 144; }); return stretchPart(sp(-o[0], -o[1], { v: r.pick(['x', 'x', 'y', 'a']), e: 2 }), true); } }] },
      /* ---------------- Part D ---------------- */
      { num: '9', section: 'Extra practice D — Knowing when to stop', stem: 'Factor each trinomial if possible. If it cannot be factored over the integers, press <b>none</b> — only after checking <b>every</b> factor pair of ' + t('c') + '.', parts: [
        { id: 'e9a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { c: r.pick([7, 5, 11, 13, 3]), b: r.int(2, 9) }; }, function (o) { return !factorable(o.b, o.c); }); return nonePart(lv(r), o.b, o.c); } },
        { id: 'e9b', level: 'EMG', make: function (r) { var o = pq(r, 3, 6, 7, 12, function (o) { return posPairs(o[0] * o[1]).length >= 4; }); return canPart(spv(r, o[0], o[1])); } },
        { id: 'e9c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { c: r.pick([11, 13, 17, 7, 19]), b: -r.int(2, 10) }; }, function (o) { return !factorable(o.b, o.c); }); return nonePart(lv(r), o.b, o.c); } },
        { id: 'e9d', level: 'EMG', make: function (r) { var o = pq(r, 4, 7, 8, 12, function (o) { return posPairs(o[0] * o[1]).length >= 4; }); return canPart(spv(r, -o[0], -o[1])); } },
        { id: 'e9e', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { c: r.pick([14, 10, 15, 21, 22, 26, 33, 35]), b: r.int(3, 12) }; }, function (o) { return !factorable(o.b, o.c); }); return nonePart(lv(r), o.b, o.c); } },
        { id: 'e9f', level: 'EMG', make: function (r) { var q = r.pick([17, 19, 13, 11, 23]), p = r.pick([2, 3]); return canPart(spv(r, p, q)); } }] },
      { num: '10', stem: function (sh) { return 'Nadia says, “I tried ' + sh.pp.map(function (x) { return t(x[0] + '\\times ' + x[1]); }).reverse().join(' and ') + ' for ' + t(sh.T) + ' and neither worked, so I will try some decimals next.”'; },
        shared: function (r) { var o = pickWhere(function () { return { c: r.pick([14, 10, 15, 21, 22, 26, 33, 35, 6, 34, 38, 39]), b: r.int(2, 14) }; }, function (o) { return !factorable(o.b, o.c) && o.b !== o.c + 1; }); o.pp = posPairs(o.c); o.T = triTex('x', o.b, o.c); return o; },
        parts: [
          { id: 'e10a', level: 'EMG', make: function (r, sh) {
            return mcPart(r, 'Why are decimals not what is being asked for?', [
              { html: 'The question asks for a factorization <b>over the integers</b>, so only whole-number factor pairs count.', right: true },
              { html: 'Decimals never multiply to a whole number.', why: 'They can: ' + t('2.5\\times 4=10') + '. The reason is what kind of factorization is asked for.' },
              { html: 'Decimals would give the same pairs again.', why: 'Decimals give infinitely many new pairs — but they aren’t allowed here.' },
              { html: 'Nadia should try fractions instead.', why: 'Fractions aren’t integers either. A factorization <b>over the integers</b> uses whole numbers only.' }],
              'Factoring over the integers means both numbers must be integers. Decimal pairs aren’t part of the question (and there would be infinitely many).', [], 'why not decimals');
          } },
          { id: 'e10b', level: 'EMG', make: function (r, sh) { var n = sh.pp.length;
            return KP.number('How many factor pairs did Nadia need to check before she could safely say “not factorable”?', n, function (v) {
              if (v === 2 * n) return { code: 'u4l3-pairs-neg', hint: 'With ' + t('b') + ' and ' + t('c') + ' both positive, both numbers must be positive — negative pairs can’t add to ' + t(sh.b) + '.' };
              return null;
            }, t(sh.c + '=' + sh.pp.map(function (x) { return x[0] + '\\times ' + x[1]; }).join('=')) + ': there ' + (n === 1 ? 'is' : 'are') + ' exactly ' + t(n) + ' positive pair' + (n === 1 ? '' : 's') + '. With ' + t('b>0') + ' and ' + t('c>0') + ' both numbers must be positive, so after checking ' + (n === 1 ? 'that pair' : 'those ' + n + ' pairs') + ' she could stop.',
            ['List the positive factor pairs of ' + t(sh.c) + '.', 'Can two negative numbers add to a positive ' + t('b') + '?'], 'pairs to check for c=' + sh.c);
          } }] },
      /* ---------------- Part E ---------------- */
      { num: '11', section: 'Extra practice E — Working backwards', stem: function (sh) { return 'Consider ' + t(sh.v + '^{2}+b' + sh.v + '+' + sh.c) + ', where ' + t('b') + ' is an integer.'; },
        shared: function (r) { return { c: r.pick([15, 15, 10, 14, 21, 22, 26, 33, 35, 6, 34, 38, 39, 46, 51, 55, 57, 58]), v: r.pick(['x', 'x', 'y', 'm']) }; },
        parts: [
          { id: 'e11a', level: 'MAS', make: function (r, sh) {
            var c = sh.c, want = []; posPairs(c).forEach(function (x) { want.push(x[0] + x[1], -(x[0] + x[1])); });
            want.sort(function (a, b) { return b - a; });
            var p = KP.valueSet('List <b>every</b> integer value of ' + t('b') + ' for which this trinomial can be factored over the integers. (Separate them with commas, or use ' + t('\\pm') + '.)', want, { v: 'b', keyTex: 'b=' + posPairs(c).map(function (pq) { return '\\pm ' + (pq[0] + pq[1]); }).join(',\\ '), diag: function (A) {
                var bad = A.filter(function (v) { return want.indexOf(v) < 0; });
                if (bad.length) return { code: 'not-b', hint: t(bad[0]) + ' is not the sum of a pair of integers with product ' + t(c) + '.' + (Math.abs(bad[0]) === c ? ' ' + t(c) + ' is the constant, not a sum.' : '') };
                if (A.every(function (v) { return v > 0; })) return { code: 'no-negatives', hint: 'Don’t forget the negative values: two negative numbers also multiply to ' + t(c) + '.' };
                return { code: 'missing-b', hint: 'You have ' + A.length + ' of the ' + want.length + ' values. Go through every factor pair of ' + t(c) + ', positive and negative.' };
              } },
              'Integer pairs with product ' + t(c) + ': ' + posPairs(c).map(function (x) { return t(x[0] + '\\times ' + x[1]) + ' (sum ' + t(x[0] + x[1]) + ') and ' + t('(-' + x[0] + ')(-' + x[1] + ')') + ' (sum ' + t(-(x[0] + x[1])) + ')'; }).join('; ') + '.<br>So ' + t('b=' + want.join(',\\ ')) + '.',
              ['List every factor pair of ' + t(c) + ' — positive and negative — and add each pair.'], 'all b for c=' + c);
            p.good = [posPairs(c).map(function (x) { return '\\pm ' + (x[0] + x[1]); }).join(', ')];
            p.bad = [want.filter(function (x) { return x > 0; }).join(', '), c + ', -' + c];
            return p;
          } },
          { id: 'e11b', level: 'PRG', make: function (r, sh) {
            var c = sh.c, v = sh.v, list = []; posPairs(c).forEach(function (x) { list.push(sp(x[0], x[1], { v: v })); list.push(sp(-x[0], -x[1], { v: v })); });
            list.sort(function (a, b) { return b.b - a.b; });
            var parts = list.map(function (s) { return fac(s); });
            return KP.fields('Write the factored form that goes with each value of ' + t('b') + '.', list.map(function (s) { return mathField(t('b=' + s.b), [v], 'e.g. (x + 2)(x + 3)'); }), parts.map(function (p) { return p.check; }), list.map(function (s) { return s.key; }),
              list.map(function (s) { return t('b=' + s.b) + ': ' + t(s.key); }).join('<br>'), list.map(function (s) { return t(v + '^{2}' + (s.b < 0 ? '' : '+') + s.b + v + '+' + c + '=' + s.key); }).join('<br>'),
              ['Each value of ' + t('b') + ' comes from one pair: the pair goes in the brackets.'], 'forms for each b, c=' + c);
          } }] },
      { num: '12', stem: function (sh) { return 'Consider ' + t(sh.v + '^{2}+' + sh.b + sh.v + '+c') + ', where ' + t('c') + ' is a positive integer less than ' + t(sh.max) + '.'; },
        shared: function (r) { var b = r.pick([9, 9, 7, 8, 10, 11]), prods = []; for (var p = 1; 2 * p < b; p++) prods.push({ p: p, q: b - p, c: p * (b - p) }); var max = Math.floor(b / 2) * Math.ceil(b / 2); return { b: b, max: max, list: prods.filter(function (x) { return x.c < max; }), v: r.pick(['x', 'x', 'y', 'm', 'a', 't']) }; },
        parts: [
          { id: 'e12a', level: 'ADV', make: function (r, sh) {
            var want = sh.list.map(function (x) { return x.c; });
            return listPart('List every value of ' + t('c') + ' that makes the trinomial factorable over the integers.', want, { badCode: 'u4l3-c-list', missCode: 'u4l3-c-missing',
              badHint: function (c) { return 'For ' + t('c=' + c) + ' you need two positive numbers with product ' + t(c) + ' and sum ' + t(sh.b) + ' — there is no such pair.'; },
              missHint: 'Split ' + t(sh.b) + ' into two positive whole numbers in every way: ' + t('1+' + (sh.b - 1)) + ', ' + t('2+' + (sh.b - 2)) + ', … and multiply each pair.',
              sol: 'Both numbers are positive and add to ' + t(sh.b) + ': ' + sh.list.map(function (x) { return t(x.p + '+' + x.q) + ' → ' + t('c=' + x.c); }).join(', ') + (sh.b % 2 ? ', ' + t(Math.floor(sh.b / 2) + '+' + Math.ceil(sh.b / 2)) + ' → ' + t(sh.max) + ' (not less than ' + t(sh.max) + ')' : ', ' + t(sh.b / 2 + '+' + sh.b / 2) + ' → ' + t(sh.max) + ' (not less than ' + t(sh.max) + ')') + '.',
              hints: ['Work from the sum: write ' + t(sh.b) + ' as the sum of two positive whole numbers in every way, then multiply each pair.'], text: 'c values for b=' + sh.b, bad: [want.slice(1), want.concat([sh.max])] });
          } },
          { id: 'e12b', level: 'PRG', make: function (r, sh) {
            var ss = sh.list.map(function (x) { return sp(x.p, x.q, { v: sh.v }); });
            return KP.fields('Give the factored form for each of those values of ' + t('c') + '.', ss.map(function (s) { return mathField(t('c=' + s.c), [sh.v], 'e.g. (x + 2)(x + 3)'); }), ss.map(function (s) { return fac(s).check; }), ss.map(function (s) { return s.key; }),
              ss.map(function (s) { return t('c=' + s.c) + ': ' + t(s.key); }).join('<br>'), ss.map(function (s) { return t(tx(s.full) + '=' + s.key); }).join('<br>'), ['The pair that adds to ' + t(sh.b) + ' and multiplies to ' + t('c') + ' goes in the brackets.'], 'forms for b=' + sh.b);
          } },
          { id: 'e12c', level: 'PRG', make: function (r, sh) {
            var h = Math.floor(sh.b / 2), k = Math.ceil(sh.b / 2);
            return mcPart(r, 'The value ' + t('c=' + sh.max) + ' also works. Why is it the <b>largest</b> value of ' + t('c') + ' that can work when ' + t('b=' + sh.b) + ' and both numbers are positive?', [
              { html: 'The two numbers must add to ' + t(sh.b) + ', and their product is largest when they are as close together as possible: ' + t(h + '\\times ' + k + '=' + sh.max) + '.', right: true },
              { html: 'Because ' + t(sh.max) + ' has the most factor pairs.', why: 'The number of factor pairs doesn’t matter. With a fixed sum of ' + t(sh.b) + ', look at how the product changes as the numbers move apart.' },
              { html: 'Because the numbers must be ' + t(1) + ' and ' + t(sh.b - 1) + '.', why: t('1\\times ' + (sh.b - 1) + '=' + (sh.b - 1)) + ' is the <b>smallest</b> product with sum ' + t(sh.b) + ', not the largest.' },
              { html: 'Because ' + t('c') + ' can never be bigger than ' + t('2b') + '.', why: 'That is not a rule. Compare the products of pairs that add to ' + t(sh.b) + '.' }],
              'Pairs adding to ' + t(sh.b) + ': ' + sh.list.map(function (x) { return t(x.p + '\\times ' + x.q + '=' + x.c); }).concat([t(h + '\\times ' + k + '=' + sh.max)]).join(', ') + '. The products grow as the numbers get closer, so ' + t(h + '\\times ' + k + '=' + sh.max) + ' is the largest; a bigger ' + t('c') + ' has no positive pair adding to ' + t(sh.b) + '.', ['Write out the products of every pair that adds to ' + t(sh.b) + '.'], 'why c max');
          } }] },
      { num: '13', stem: 'Complete each of the following.', parts: [
        { id: 'e13a', level: 'ADV', make: function (r) {
          var c = r.pick([40, 40, 24, 36, 30, 48, 60, 72, 20, 28, 42, 44, 45, 50, 54, 56, 63, 64, 66, 70, 80, 84, 90]), want = posPairs(c).map(function (x) { return x[0] + x[1]; });
          return listPart('List every <b>positive</b> value of ' + t('b') + ' for which ' + t('x^{2}+bx+' + c) + ' factors over the integers.', want, {
            badHint: function (b) { return t(b) + ' is not the sum of a positive factor pair of ' + t(c) + '.' },
            missHint: 'Go through the factor pairs of ' + t(c) + ' in order: ' + t('1\\times ' + c) + ', ' + t('2\\times ?') + ', …',
            sol: posPairs(c).map(function (x) { return t(x[0] + '\\times ' + x[1]) + ' → ' + t(x[0] + x[1]); }).join(', ') + '.<br>So ' + t('b=' + want.slice().sort(function (a, b) { return a - b; }).join(',\\ ')) + ': smallest ' + t(Math.min.apply(null, want)) + ', largest ' + t(Math.max.apply(null, want)) + '.',
            hints: ['List the positive factor pairs of ' + t(c) + ' and add each pair.'], text: 'positive b for c=' + c, bad: [want.slice(1), [c, c + 1]] });
        } },
        { id: 'e13b', level: 'MAS', make: function (r, sh) {
          var o = e13(r), want = o.list.map(function (x) { return x.c; });
          return listPart('List every <b>positive</b> value of ' + t('c') + ' for which ' + t(o.v + '^{2}-' + o.b + o.v + '+c') + ' factors over the integers.', want, { badCode: 'u4l3-c-list', missCode: 'u4l3-c-missing',
            badHint: function (c) { return 'For ' + t('c=' + c) + ' you need two negative numbers with product ' + t(c) + ' and sum ' + t(-o.b) + ' — there is no such pair.'; },
            missHint: 'Both numbers are negative and add to ' + t(-o.b) + ': try ' + t('-1,\\ -' + (o.b - 1)) + ', ' + t('-2,\\ -' + (o.b - 2)) + ', … and multiply each pair.',
            sol: 'With ' + t('c>0') + ' and the middle coefficient ' + t(-o.b) + ', both numbers are negative and add to ' + t(-o.b) + ': ' + o.list.map(function (x) { return t('(-' + x.p + ')(-' + x.q + ')=' + x.c); }).join(', ') + '.<br>So ' + t('c=' + want.join(',\\ ')) + '.',
            hints: ['Write ' + t(o.b) + ' as the sum of two positive whole numbers in every way; the numbers in the brackets are their negatives. Multiply each pair to get ' + t('c') + '.'], text: 'positive c for b=-' + o.b, bad: [want.slice(1), want.slice(0, -1)] });
        } },
        { id: 'e13c', level: 'PRG', make: function (r) {
          var o = e13(r), h = o.b / 2, s = sp(-h, -h, { v: o.v });
          var p = fac(s, { prompt: 'For ' + t(o.v + '^{2}-' + o.b + o.v + '+c') + ', one positive value of ' + t('c') + ' gives two identical brackets. Write that trinomial’s factored form.', text: 'identical brackets b=-' + o.b,
            sol: 'Identical brackets need equal numbers: ' + t('-' + h + '+(-' + h + ')=-' + o.b) + ', so ' + t('c=(-' + h + ')^{2}=' + h * h) + ' and ' + t(tx(s.full) + '=' + s.key) + '.' });
          return p;
        } }] },
      /* ---------------- Part F ---------------- */
      { num: '14', section: 'Extra practice F — Checking, area, and reasoning', stem: function (sh) { return '<b>Error analysis.</b> Dev factors ' + t(tx(sh.s.full)) + ' and gets ' + t(sh.s.key) + '. To check, he writes “' + t(sh.s.p + '\\times ' + sh.s.q + '=' + sh.s.c) + ', so the answer expands to ' + t('x^{2}+' + sh.s.c) + '.”'; },
        shared: function (r) { var o = pq(r, 2, 5, 4, 9); return { s: sp(o[0], o[1]) }; },
        parts: [
          { id: 'e14a', level: 'BEG', make: function (r, sh) { var s = sh.s;
            var p = KP.poly('Expand ' + t(s.key) + ' properly with FOIL.', s.inner, { wrong: [{ is: PL.add(V('x', 2), N(s.c)), code: 'fl-only', hint: 'That is Dev’s mistake: only the First and Last products. Add the Outer and Inner products.' }] },
              t(s.key + '=' + foilTex(s) + '=\\mathbf{' + tx(s.inner) + '}'), ['First, Outer, Inner, Last: four products, then collect the two middle ones.'], 'expand ' + s.key);
            p.bad = ['x^{2}+' + s.c]; return p; } },
          { id: 'e14b', level: 'EMG', make: function (r, sh) { var s = sh.s;
            return mcPart(r, 'Which terms did Dev leave out, and why must a correct check give three terms?', [
              { html: 'The Outer and Inner products, ' + t(s.q + 'x') + ' and ' + t(s.p + 'x') + '. Together they make the middle term ' + t(s.b + 'x') + ', so a correct check has three terms.', right: true },
              { html: 'The ' + t('x^{2}') + ' term; a check always has three terms because there are three numbers.', why: 'Dev kept ' + t('x^{2}') + ' (the First product). He dropped the Outer and Inner products.' },
              { html: 'The constant term; ' + t(s.p + '\\times ' + s.q) + ' should not be multiplied.', why: 'The Last product ' + t(s.p + '\\times ' + s.q + '=' + s.c) + ' is right. What about ' + t('x\\cdot ' + s.q) + ' and ' + t(s.p + '\\cdot x') + '?' },
              { html: 'Nothing — two terms are enough, because the factoring is correct.', why: 'His check gives ' + t('x^{2}+' + s.c) + ', which doesn’t match ' + t(tx(s.full)) + ' — so it can’t confirm anything.' }],
              'FOIL has four products: ' + t(foilTex(s)) + '. Dev kept only the First and Last. The Outer and Inner products ' + t(s.q + 'x+' + s.p + 'x=' + s.b + 'x') + ' build the middle term, so a correct check has three terms.', [], 'Dev missing terms');
          } }] },
      { num: '15', stem: function (sh) { return '<b>Error analysis.</b> Priya factors ' + t(tx(sh.s.full)) + ' and writes ' + t(sh.w.key) + ', saying “' + t(sh.w.p + '\\times ' + sh.w.q + '=' + sh.s.c) + ', which is the constant I need.”'; },
        shared: function (r) { return pickWhere(function () { var c = r.pick([48, 48, 24, 36, 40, 60, 30, 72, 20, 28, 42, 54, 56, 64]), pp = posPairs(c).filter(function (x) { return x[0] !== x[1]; }), two = r.sample(pp, 2); return { s: sp(two[0][0], two[0][1]), w: sp(two[1][0], two[1][1]) }; }, function (o) { return o.s.p !== o.w.p; }); },
        parts: [
          { id: 'e15a1', sub: 'a i', level: 'BEG', make: function (r, sh) { var w = sh.w;
            var p = KP.poly('Expand ' + t(w.key) + '.', w.inner, { wrong: [{ is: PL.add(V('x', 2), N(w.c)), code: 'fl-only', hint: 'Add the Outer and Inner products for the middle term.' }] }, t(w.key + '=' + foilTex(w) + '=\\mathbf{' + tx(w.inner) + '}'), ['Use FOIL.'], 'expand ' + w.key);
            return p; } },
          { id: 'e15a2', sub: 'a ii', level: 'EMG', make: function (r, sh) { var w = sh.w, s = sh.s;
            return mcPart(r, 'Which of the two conditions did Priya satisfy, and which did she ignore?', [
              { html: 'She satisfied the <b>product</b> (' + t(w.p + '\\times ' + w.q + '=' + s.c) + ') but ignored the <b>sum</b> (' + t(w.p + '+' + w.q + '=' + w.b) + ', not ' + t(s.b) + ').', right: true },
              { html: 'She satisfied the sum but ignored the product.', why: 'Her product ' + t(w.p + '\\times ' + w.q + '=' + s.c) + ' is right. Check the sum: ' + t(w.p + '+' + w.q + '=' + w.b) + '.' },
              { html: 'She satisfied both; the factoring is correct.', why: 'Expand: ' + t(w.key + '=' + tx(w.inner)) + ', not ' + t(tx(s.full)) + '.' },
              { html: 'She satisfied neither.', why: t(w.p + '\\times ' + w.q + '=' + s.c) + ' — the product is right.' }],
              t(w.key + '=' + tx(w.inner)) + ': the constant ' + t(s.c) + ' is right (product), but the middle term is ' + t(w.b + 'x') + ' instead of ' + t(s.b + 'x') + ' (sum).', [], 'Priya condition');
          } },
          { id: 'e15b', level: 'BEG', make: function (r, sh) { var s = sh.s; return fac(s, { prompt: 'Give the correct factorization of ' + t(tx(s.full)) + '. (Which factor pair of ' + t(s.c) + ' should she have chosen?)', wrong: [{ is: sh.w.inner, code: 'kept-error', hint: 'That is Priya’s answer — its numbers add to ' + t(sh.w.b) + ', not ' + t(s.b) + '.' }], check: true }); } }] },
      { num: '16', stem: function (sh) { return 'A rectangle has an area of ' + t(tx(sh.s.full)) + ' square metres.'; },
        shared: function (r) { var o = pq(r, 2, 6, 3, 9); return { s: sp(o[0], o[1]), x: r.int(3, 9) }; },
        parts: [
          { id: 'e16a', level: 'BEG', make: function (r, sh) { var f = fac(sh.s, { prompt: 'Factor the area to find binomial expressions for the length and the width.', text: 'rectangle factor' }); f.solution += '<br>So the dimensions are ' + t('(' + tx(sh.s.B) + ')') + ' m and ' + t('(' + tx(sh.s.A) + ')') + ' m.'; return f; } },
          { id: 'e16b', level: 'EMG', make: function (r, sh) { var s = sh.s, P = PL.scale(sum([s.A, s.B]), 2);
            var p = KP.poly('Write a simplified expression for the perimeter of the rectangle.', P, { wrong: [{ is: sum([s.A, s.B]), code: 'u4l3-perim', hint: 'A rectangle has <b>two</b> lengths and <b>two</b> widths: ' + t('P=2(\\text{length}+\\text{width})') + '.' }, { is: s.inner, code: 'u4l3-perim-area', hint: 'That is the area. The perimeter <b>adds</b> the four sides.' }] },
              t('P=2[(' + tx(s.B) + ')+(' + tx(s.A) + ')]=2(' + tx(sum([s.A, s.B])) + ')=\\mathbf{' + tx(P) + '}') + ' m.', ['Perimeter ' + t('=2(\\text{length}+\\text{width})') + '. Add the two binomials, then double.'], 'perimeter expression');
            p.bad = [tx(sum([s.A, s.B]))]; return p; } },
          { id: 'e16c', level: 'EMG', make: function (r, sh) { var s = sh.s, x = sh.x, L = x + s.q, W = x + s.p, A = L * W, P = 2 * (L + W);
            return KP.fields('If ' + t('x=' + sh.x) + ', find the length, the width, the area and the perimeter.', [numField('Length', t('\\text{m}')), numField('Width', t('\\text{m}')), numField('Area', t('\\text{m}^{2}')), numField('Perimeter', t('\\text{m}'))],
              [K.number(L), K.number(W), K.number(A, function (v) { return v === P ? { code: 'value', hint: 'That is the perimeter. The area is length × width.' } : null; }), K.number(P, function (v) { return v === L + W ? { code: 'u4l3-perim', hint: 'Go all the way round: ' + t('2(' + L + '+' + W + ')') + '.' } : v === A ? { code: 'u4l3-perim-area', hint: 'That is the area.' } : null; })], [L, W, A, P].map(String),
              'Length ' + t(L) + ' m, width ' + t(W) + ' m, area ' + t(A) + ' m², perimeter ' + t(P) + ' m',
              'Length ' + t(x + '+' + s.q + '=' + L) + ' m, width ' + t(x + '+' + s.p + '=' + W) + ' m.<br>Area ' + t(L + '\\times ' + W + '=' + A) + ' m² (check: ' + t(x + '^{2}+' + s.b + '(' + x + ')+' + s.c + '=' + A) + ' ✓).<br>Perimeter ' + t('2(' + L + '+' + W + ')=' + P) + ' m (check: ' + t(tx(PL.scale(sum([s.A, s.B]), 2)).replace('x', '(' + x + ')') + '=' + P) + ' ✓).',
              ['Substitute ' + t('x=' + x) + ' into each factor.', 'Area = length × width; perimeter = ' + t('2(\\text{length}+\\text{width})') + '.'], 'rectangle at x=' + x);
          } }] },
      { num: '17', stem: function (sh) { return '<b>Reasoning about signs.</b> Suppose ' + t('x^{2}+bx+c') + ' factors as ' + t('(x+p)(x+q)') + ', where ' + t('c>0') + '. (For example ' + t(tx(sh.a.full) + '=' + sh.a.key) + ' and ' + t(tx(sh.b.full) + '=' + sh.b.key) + '.)'; },
        shared: function (r) { var o = pq(r, 1, 6, 2, 9); return { a: sp(o[0], o[1]), b: sp(-o[0], -o[1]) }; },
        parts: [
        { id: 'e17a', level: 'EMG', make: function (r) {
          return mcPart(r, '(a) Why must ' + t('p') + ' and ' + t('q') + ' have the <b>same</b> sign?', [
            { html: t('pq=c') + ' and ' + t('c>0') + '; a positive product comes only from two positives or two negatives.', right: true },
            { html: t('p+q=b') + ', and a sum is positive only when both numbers are positive.', why: 'The sum can be positive with one negative number (' + t('5+(-2)=3') + '). The product decides whether the signs match.' },
            { html: 'Because the first term ' + t('x^{2}') + ' is positive.', why: 'The ' + t('x^{2}') + ' term doesn’t involve ' + t('p') + ' or ' + t('q') + '. Look at ' + t('c=pq') + '.' },
            { html: 'They don’t have to: ' + t('3') + ' and ' + t('-4') + ' can multiply to a positive number.', why: t('3\\times(-4)=-12') + ', which is negative.' }],
            t('(x+p)(x+q)=x^{2}+(p+q)x+pq') + ', so ' + t('c=pq') + '. A positive product needs two numbers with the same sign.', [], 'why same sign');
        } },
        { id: 'e17b', level: 'EMG', make: function (r) {
          return mcPart(r, '(b) If ' + t('b>0') + ' as well, what sign are ' + t('p') + ' and ' + t('q') + '?', [
            { html: 'Both positive: they share a sign, and two negatives would give ' + t('p+q=b<0') + '.', right: true },
            { html: 'Both negative: a positive ' + t('b') + ' comes from negatives.', why: 'Two negatives add to a <b>negative</b> number, but ' + t('b>0') + '.' },
            { html: 'One positive and one negative.', why: 'Then ' + t('pq') + ' would be negative, but ' + t('c>0') + '.' },
            { html: 'It depends on the size of ' + t('c') + '.', why: 'The size of ' + t('c') + ' doesn’t change the signs: they match (part a), and the sum ' + t('b') + ' is positive.' }],
            'They share a sign (part a) and ' + t('p+q=b>0') + ', so both are positive.', [], 'b>0 signs');
        } },
        { id: 'e17c', level: 'EMG', make: function (r) {
          return mcPart(r, '(c) If ' + t('b<0') + ', what sign are ' + t('p') + ' and ' + t('q') + '?', [
            { html: 'Both negative: two positives would give ' + t('b>0') + ', so the shared sign must be negative.', right: true },
            { html: 'Both positive, because ' + t('c') + ' is positive.', why: 'Two positives add to a positive number, but ' + t('b<0') + '.' },
            { html: 'One positive and one negative.', why: 'Then ' + t('c=pq') + ' would be negative.' },
            { html: 'The larger one is negative and the smaller one positive.', why: 'That gives a negative product, but ' + t('c>0') + '.' }],
            'Same sign (part a) and ' + t('p+q=b<0') + ', so both are negative.', [], 'b<0 signs');
        } }] },
      { num: '18', stem: function (sh) { return 'Expand ' + t('(' + sh.x + '+' + sh.p + ')(' + sh.x + '+' + sh.q + ')') + ' using FOIL and collect like terms, where ' + t(sh.p) + ' and ' + t(sh.q) + ' stand for any two numbers.'; },
        shared: function (r) { var L = r.pick([['x', 'p', 'q'], ['x', 'p', 'q'], ['x', 'm', 'n'], ['x', 'r', 's'], ['y', 'p', 'q'], ['x', 'h', 'k'], ['t', 'a', 'b'], ['y', 'm', 'n'], ['x', 'c', 'd'], ['m', 'p', 'q'], ['x', 'a', 'b'], ['y', 'r', 's'], ['a', 'm', 'n'], ['t', 'p', 'q'], ['n', 'h', 'k'], ['x', 'u', 'w'], ['z', 'p', 'q'], ['y', 'a', 'b'], ['m', 'r', 's'], ['k', 'p', 'q'], ['x', 'd', 'e'], ['b', 'm', 'n'], ['y', 'c', 'd']]); return { x: L[0], p: L[1], q: L[2] }; },
        parts: [
        { id: 'e18a', level: 'EMG', make: function (r, sh) {
          var xs = sh.x, ps = sh.p, qs = sh.q, x = V(xs), P = V(ps), Q = V(qs), T = PL.mul(PL.add(x, P), PL.add(x, Q)), prod = '(' + xs + '+' + ps + ')(' + xs + '+' + qs + ')';
          var p = KP.poly('Expand ' + t(prod) + '.', T, { vars: [xs, ps, qs], wrong: [{ is: PL.add(PL.pow(x, 2), PL.mul(P, Q)), code: 'fl-only', hint: 'Add the Outer and Inner products: ' + t(qs + xs) + ' and ' + t(ps + xs) + '.' }] },
            t(prod + '=' + xs + '^{2}+' + qs + xs + '+' + ps + xs + '+' + ps + qs + '=\\mathbf{' + xs + '^{2}+(' + ps + '+' + qs + ')' + xs + '+' + ps + qs + '}') + '.', ['First ' + t(xs + '^{2}') + ', Outer ' + t(qs + xs) + ', Inner ' + t(ps + xs) + ', Last ' + t(ps + qs) + '.'], 'expand ' + prod);
          p.key = xs + '^{2}+' + ps + xs + '+' + qs + xs + '+' + ps + qs; p.answer = t(xs + '^{2}+(' + ps + '+' + qs + ')' + xs + '+' + ps + qs); p.good = [xs + '^{2}+' + qs + xs + '+' + ps + xs + '+' + ps + qs]; p.bad = [xs + '^{2}+' + ps + qs];
          return p;
        } },
        { id: 'e18b', level: 'EMG', make: function (r, sh) {
          var o = pq(r, 1, 6, 2, 9), ex1 = sp(o[0], o[1]);
          return mcPart(r, 'Use your result to explain why, when ' + t('x^{2}+bx+c=(x+p)(x+q)') + ', the two numbers must multiply to ' + t('c') + ' and add to ' + t('b') + '. (For example, ' + t(ex1.key + '=' + tx(ex1.inner)) + '.)', [
            { html: t('(x+p)(x+q)=x^{2}+(p+q)x+pq') + '. Matching with ' + t('x^{2}+bx+c') + ' term by term gives ' + t('b=p+q') + ' and ' + t('c=pq') + '.', right: true },
            { html: 'Because the constant term is always the sum of the numbers in the brackets.', why: 'The constant is the Last product ' + t('pq') + ' — a product, not a sum.' },
            { html: 'Because ' + t('b') + ' is the product of the Outer and Inner terms.', why: 'The Outer and Inner products are <b>added</b>: ' + t('qx+px=(p+q)x') + '.' },
            { html: 'It is just a rule to memorize; it can’t be explained.', why: 'Expanding shows exactly where it comes from: ' + t('x^{2}+(p+q)x+pq') + '.' }],
            'The constant term is the Last product, ' + t('pq') + ', and the ' + t('x') + '-term is built by adding the two middle products, ' + t('(p+q)x') + '. So ' + t('c=pq') + ' and ' + t('b=p+q') + '.', [], 'why product and sum');
        } }] }
    ]
  });

  /* ---------- part makers that use the lesson tools above ---------- */
  function expandPart(s) {
    var wr = [{ is: PL.add(PL.pow(s.u, 2), N(s.c)), code: 'fl-only', hint: 'That is only the First and Last products. Add the Outer and Inner products: they make the middle term.' }];
    var v = tx(s.u), shown = s.p === s.q ? '(' + v + '+' + s.p + ')(' + v + '+' + s.p + ')' : s.key;
    var p = KP.poly('Expand ' + t(shown) + '.', s.inner, { wrong: wr },
      t(shown + '=' + foilTex(s) + '=\\mathbf{' + tx(s.inner) + '}') + '.<br>Notice: ' + t(s.b) + ' is the <b>sum</b> ' + t(s.p + '+' + s.q) + ' and ' + t(s.c) + ' is the <b>product</b> ' + t(s.p + '\\times ' + s.q) + '.',
      ['FOIL: First, Outer, Inner, Last — then collect the two middle terms.'], 'expand ' + s.key);
    p.bad = [tx(PL.add(PL.pow(s.u, 2), N(s.c)))];
    return p;
  }
  function claimQ(num, sub, gen, section) {
    return { num: num, section: section, stem: function (sh) { return 'Check each claimed factorization by expanding it with FOIL. If it is incorrect, give the correct factorization.<br>(' + sub + ') &nbsp;' + t(sh.Ttx + '\\stackrel{?}{=}' + sh.claimTex); },
      shared: function (r) {
        var o = gen(r), p = o[0], q = o[1], truth = r.chance(0.5);
        if (truth) return triClaim(p, q, p, q);
        var c = p * q, alt = posPairs(c).filter(function (x) { return x[0] !== p && x[0] !== q; });
        var m = alt.length && r.chance(0.6) ? r.pick(alt) : pickWhere(function () { var d = r.pick([-1, 1, 2]); return [p, q + d]; }, function (m) { return m[1] > 0 && m[1] !== q && m[1] !== p; });
        return triClaim(p, q, m[0], m[1]);
      },
      parts: [
        { id: num + sub + '1', sub: sub + ' i', level: 'BEG', make: function (r, sh) { return triVerdict(r, sh); } },
        { id: num + sub + '2', sub: sub + ' ii', level: 'BEG', make: function (r, sh) { return triCorrect(sh); } }] };
  }
  function stretchPart(s, allowFull) {
    var f = fac(s, { sol: 'Think of it as a trinomial in ' + t(tx(s.u)) + ': ' + t('(' + tx(s.u) + ')^{2}=' + tx(PL.pow(s.u, 2))) + '.<br>Two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + ': ' + t(sg(s.p)) + ' and ' + t(sg(s.q)) + '.<br>' + t(tx(s.full) + '=' + s.key) + (allowFull ? '<br>(Each bracket here is a difference of squares, so it can be factored further — you will do that in Lesson 5.)' : ''),
      hints: ['Let the “variable” be ' + t(tx(s.u)) + ': find two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + '.', 'Each bracket looks like ' + t('(' + tx(s.u) + '+\\square)') + '.'] });
    if (allowFull) { var base = f.check; f.check = function (resp) { var res = base(resp); return res.v === 'form' && res.code === 'factor-more' ? ok() : res; }; }
    return f;
  }
  function e13(r) { var b = r.pick([12, 12, 8, 10, 14, 16, 18]), v = r.pick(['x', 'x', 'y', 'm', 'a', 't']), list = []; for (var p = 1; 2 * p <= b; p++) list.push({ p: p, q: b - p, c: p * (b - p) }); return { b: b, v: v, list: list }; }
})(window);
