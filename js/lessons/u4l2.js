/* Math 15 · Unit 4 · Lesson 2 — Common Factors: Finding and Removing the GCF (AN5)
 * Assignment 2 (u4_L02.tex, Questions 1–14) and the Lesson 2 Extra Practice (u4_EP02.tex, Questions 1–18).
 * Every part is a generator that keeps the booklet question's structure (number of terms, letters, which letter is
 * missing, the sign pattern, a term equal to the GCF, a GCF with one or two letters, a negative GCF) and changes the
 * numbers; the booklet's own numbers are among the possible values. Keys are built from GCF × bracket, so they always
 * expand to the question.
 * Math 15 sign convention (booklet Lesson 2, section 4): when the first (leading) term is negative, take out a negative
 * GCF so the bracket starts with a positive term; a positive GCF in that case, or a negative one when the first term is
 * positive, gets a nudge (no try used).
 * Conversions: "identify the error" / "explain" → multiple choice (a hint for each wrong option) plus the corrected
 * factoring; "write a polynomial with this GCF" → two boxes (any correct polynomial accepted, then its factored form);
 * "is it finished?" → a table of choices plus the finished factorings.
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
    'not-subst': 'Substitution slip', 'gcf-lcm': 'Gave the LCM instead of the GCF', 'sign': 'Wrong sign', 'c-sign': 'Ignored the sign of a coefficient'
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
  function pickWhere(gen, test) { for (var i = 0; i < 4000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u4l2: pickWhere failed'); }
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

  /* blank = the bracket (or part of it) after a given common factor */
  function backPart(terms, g, opt) {
    opt = opt || {};
    var br = terms.map(function (m) { return divM(m, g); }), B = sum(br), target = B;
    var gT = gTex(g), polyT = opt.polyTex || seq(terms), pre = gT + '(', post = ')';
    var diag = function (S) {
      var E = PL.mul(g, S);
      return PL.eq(E, PL.mul(g, B)) ? null : { code: 'not-factor', hint: 'Check by expanding: ' + t(pg(g) + '(' + tx(S) + ')=' + tx(E)) + ', not ' + t(polyT) + '.' };
    };
    var ws = (opt.wrong || []).slice();
    br.forEach(function (b, i) { if (br.length > 1 && Math.abs(cv(b)) === 1 && !PL.vars(b).length) ws.push({ is: sum(br.filter(function (x) { return !PL.eq(x, b); })), code: 'drop-one', hint: t(pg(terms[i]) + '\\div ' + pg(g) + '=' + tx(b)) + ': that ' + t(tx(b)) + ' must stay in the bracket (it doesn’t just disappear).' }); });
    if (br.length > 1 && isNeg(g)) ws.push({ is: sum(br.map(function (b) { return PL.neg(b); })), code: 'neg-signs', hint: 'The common factor is <b>negative</b>, so every sign inside the bracket is the <b>opposite</b> of the sign in the question.' });
    if (Object.keys(vOf(g)).length) ws.push({ is: sum(br.map(function (b) { return PL.mul(b, M(1, vOf(g))); })), code: 'kept-var', hint: 'Divide the letters too: ' + t(pg(terms[0]) + '\\div ' + pg(g) + '=' + tx(br[0])) + '.' });
    var divs = terms.map(function (m, i) { return t(pg(m) + '\\div ' + pg(g) + '=' + tx(br[i])); }).join(', &nbsp;');
    var keyTex = opt.keyTex || seq(br);
    var p = boxPart(opt.prompt || t(polyT + '=' + pre + '\\underline{\\qquad\\quad}' + post), target, { wrong: ws, diag: diag, before: pre, after: post, vars: lettersOf(terms), answerTex: polyT + '=' + gT + '(' + seq(br) + ')', keyTex: keyTex, good: br.length > 1 ? [seq(br.slice().reverse())] : null },
      'Divide each term by ' + t(gT) + ': ' + divs + '.<br>' + t(polyT + '=' + gT + '(\\mathbf{' + seq(br) + '})') + (isNeg(g) ? ' — the factor is negative, so every sign changed.' : '') + '<br>Check: ' + t(gT + '(' + seq(br) + ')=' + polyT) + ' ✓',
      opt.hints || ['Divide each term of the polynomial by the common factor in front of the bracket.', isNeg(g) ? 'Dividing by a negative changes the sign of every term.' : 'Check by expanding: the factor times your bracket must give the polynomial back.'],
      opt.text || 'complete the bracket: ' + plain(polyT + '=' + pre + '__' + post));
    return p;
  }

  /* "write a polynomial whose GCF is G (containing the term T), then factor it" — any correct polynomial is accepted */
  HW.addCodes({ 'u4l2-terms': 'Wrong number of terms in the polynomial asked for', 'u4l2-no-term': 'Left out the given term', 'u4l2-gcf-big': 'Polynomial’s GCF is larger than asked', 'u4l2-gcf-wrong': 'Polynomial’s GCF is not the one asked for', 'u4l2-gcf-sign': 'GCF sign wrong (first term’s sign)', 'u4l2-whole': 'Fractional coefficient in a written polynomial', 'u4l2-opp-sign': 'Opposite brackets: sign not changed when taking out −1', 'u4l2-nr-add': 'NR: added a, b, c instead of multiplying' });
  HW.addPartial({ 'u4l2-terms': 's', 'u4l2-no-term': 's', 'u4l2-gcf-big': 'b', 'u4l2-gcf-wrong': 'n', 'u4l2-gcf-sign': 's', 'u4l2-whole': 'n', 'u4l2-opp-sign': 's', 'u4l2-nr-add': 'b' });
  function writtenTerms(resp) {
    var a = K.read(resp); if (a.res) return { res: a.res };
    var rd = PL.read(a.ast); if (!rd.ok) return { res: wrong('not-poly', 'That isn’t a polynomial. Write a sum of terms like ' + t('8x^{3}+4x^{2}') + '.') };
    var fi = PL.formIssue(a.ast); if (fi && fi.code !== 'not-poly') return { res: form(fi.code, fi.msg || 'Simplify your polynomial: collect like terms and multiply out any brackets.') };
    var order = PL.writtenOrder(a.ast), p = rd.p, list = [];
    (order || Object.keys(p)).forEach(function (k) { if (p[k] && !list.some(function (m) { return PL.eq(m, M(p[k].c, p[k].v)); })) list.push(M(p[k].c, p[k].v)); });
    if (list.length !== PL.count(p)) list = PL.sorted(p).map(function (T) { return M(T.c, T.v); });
    return { p: p, list: list };
  }
  function writePolyPart(G, given, n, key, sol, hints, text, prompt) {
    var neg = isNeg(G);
    function polyCheck(resp) {
      var w = writtenTerms(resp); if (w.res) return w.res;
      if (w.list.length !== n) return wrong('u4l2-terms', 'Write a polynomial with exactly <b>' + n + '</b> terms (yours has ' + w.list.length + ').');
      if (w.list.some(function (m) { return cOf(m)[1] !== 1; })) return wrong('u4l2-whole', 'Use whole-number coefficients.');
      if (given && !w.list.some(function (m) { return PL.eq(m, given); })) return wrong('u4l2-no-term', 'One of the terms must be ' + t(tx(given)) + '.');
      var g = gcfOf(w.list);
      if (PL.eq(g, G)) return ok();
      if (PL.eq(g, PL.neg(G))) return (neg ? wrong : form)('u4l2-gcf-sign', 'With ' + t(tx(w.list[0])) + ' first, the GCF is ' + t(tx(g)) + '. ' + (neg ? 'For a GCF of ' + t(tx(G)) + ' the first term must be <b>negative</b>.' : 'Start with a positive term.'));
      var q = divM(g, G), qc = cOf(q);
      if (qc[1] === 1 && Object.keys(vOf(q)).every(function (x) { return vOf(q)[x] > 0; }) && (Math.abs(qc[0]) > 1 || Object.keys(vOf(q)).length)) return wrong('u4l2-gcf-big', 'The GCF of your terms is ' + t(tx(g)) + ', which is <b>bigger</b> than ' + t(tx(G)) + ' — your terms share an extra factor of ' + t(tx(M(Math.abs(qc[0]), vOf(q)))) + '. Change one term so they don’t.');
      return wrong('u4l2-gcf-wrong', 'The GCF of your terms is ' + t(tx(g)) + ', not ' + t(tx(G)) + '. Every term must be ' + t(tx(G)) + ' times something, with nothing more in common.');
    }
    var check = function (resp) {
      resp = resp || [];
      var r0 = polyCheck(resp[0] == null ? '' : resp[0]);
      if (r0.v !== 'correct') return { v: r0.v, code: r0.code, hint: '<b>Polynomial:</b> ' + (r0.hint || 'Check it again.') };
      var w = writtenTerms(resp[0]), br = sum(w.list.map(function (m) { return divM(m, G); }));
      var fc = convCheck(K.factored([G, br], { gcfOnly: true }), neg)(resp[1] == null ? '' : resp[1]);
      if (fc.v !== 'correct') return { v: fc.v, code: fc.code, hint: '<b>Factored form:</b> ' + (fc.hint || 'Factor your polynomial: take out ' + t(tx(G)) + '.') };
      return ok();
    };
    var vars = lettersOf([G].concat(given ? [given] : []));
    return { prompt: prompt, input: { type: 'fields', fields: [mathField('Polynomial', vars, 'your polynomial'), mathField('Factored form', vars, 'e.g. 2x(x + 3)')] }, check: check, key: key,
      answer: 'For example ' + t(key[0] + '=' + key[1]) + ' (many answers work).', solution: sol, hints: hints, text: text };
  }

  /* a common bracket: A·X + B·X → X(A + B) */
  function binCommonPart(Ab, Bb, X, shown, opt) {
    opt = opt || {};
    var target = [X, sum([Ab, Bb])], full = PL.mul(X, sum([Ab, Bb])), Xt = '(' + tx(X) + ')', In = sum([Ab, Bb]);
    var ws = [];
    if (PL.count(Bb) === 1 && !PL.vars(Bb).length && Math.abs(cv(Bb)) === 1) ws.push({ is: [X, Ab], code: 'drop-one', hint: t(Xt + '\\div ' + Xt + '=1') + ': the term ' + t((cv(Bb) < 0 ? '-' : '+') + Xt) + ' leaves ' + t(cv(Bb) < 0 ? '-1' : '1') + ' in the second bracket, not nothing.' });
    ws.push({ is: [X, sum([Ab, PL.neg(Bb)])], code: 'sign', hint: 'Keep the sign in front of each term: the second bracket is ' + t('(' + tx(In) + ')') + '.' });
    var chk = convCheck(K.factored(target, { wrong: dedupW(full, ws).map(function (w) { return { is: w.p, code: w.code, hint: w.hint }; }) }), leadNeg(full));
    var key = '(' + tx(X) + ')(' + tx(In) + ')';
    var p = KP.math(opt.prompt || t(shown), chk, key,
      'The bracket ' + t(Xt) + ' is a factor of both terms, so it is the common factor. What is left from each term: ' + t(tx(Ab)) + ' and ' + t(tx(Bb)) + '.<br>' + t(shown + '=\\mathbf{' + key + '}') + (opt.solMore || ''),
      opt.hints || ['The whole bracket ' + t(Xt) + ' is in both terms — take it out like any common factor.', 'Collect what is left from each term (with its sign) in a second bracket.'], opt.text || 'common bracket ' + plain(shown), { keys: 'poly', vars: lettersOf([full]), placeholder: 'e.g. (x - 4)(7x + 3)' });
    p.good = ['(' + tx(In) + ')(' + tx(X) + ')'];
    p.bad = [key.replace(/\)\(.*$/, ')') + '(' + tx(sum([Ab, PL.neg(Bb)])) + ')'];
    return p;
  }
  /* grouping: (p x + q)(r x² + s) style, built from its two factors */
  function groupPart(F1, F2, shownTerms, opt) {
    opt = opt || {};
    var full = PL.mul(F1, F2), key = '(' + tx(F1) + ')(' + tx(F2) + ')';
    var chk = convCheck(K.factored([F1, F2], {}), leadNeg(full));
    var sol = opt.sol;
    var p = KP.math(opt.prompt || t(seq(shownTerms)), chk, key, sol,
      opt.hints || ['Group the first two terms and the last two terms. Take the GCF out of each pair.', 'If the same bracket appears twice, take that bracket out as a common factor.'], opt.text || 'group ' + plain(seq(shownTerms)), { keys: 'poly', vars: lettersOf([full]), placeholder: 'e.g. (x + 2)(x^2 + 3)' });
    p.good = ['(' + tx(F2) + ')(' + tx(F1) + ')'];
    return p;
  }
  /* written pairs for a grouping solution: [a, b, c, d] terms; g1 = GCF of the first pair, g2 of the second (negative if c < 0) */
  function groupSol(terms, F1) {
    var g1 = gcfOf(terms.slice(0, 2)), g2 = gcfOf(terms.slice(2)), b1 = sum(terms.slice(0, 2).map(function (m) { return divM(m, g1); })), b2 = sum(terms.slice(2).map(function (m) { return divM(m, g2); }));
    var g2t = tx(g2), rest = PL.add(g1, g2);
    return 'Group in pairs: ' + t('(' + seq(terms.slice(0, 2)) + ')+(' + seq(terms.slice(2)) + ')') + '.<br>Take the GCF out of each pair' + (isNeg(g2) ? ' (the third term is negative, so take out a negative factor)' : '') + ': ' + t(gTex(g1) + '(' + tx(b1) + ')' + (g2t.charAt(0) === '-' ? '' : '+') + gTex(g2) + '(' + tx(b2) + ')') + '.<br>Both brackets are ' + t('(' + tx(F1) + ')') + ', so ' + t(seq(terms) + '=\\mathbf{(' + tx(F1) + ')(' + tx(rest) + ')}') + '.';
  }

  /* ================= Lesson 2 generators ================= */
  var L1 = ['x', 'a', 'm', 'y', 'p', 't'];
  var PAIRS = [['a', 'b'], ['x', 'y'], ['m', 'n'], ['p', 'q']];
  function cop2(r, lo, hi) { return pickWhere(function () { return [r.int(lo, hi), r.int(lo, hi)]; }, function (p) { return p[0] !== p[1] && gcd(p[0], p[1]) === 1; }); }
  function cop3(r, lo, hi) { return pickWhere(function () { return [r.int(lo, hi), r.int(lo, hi), r.int(lo, hi)]; }, function (p) { return gcdA(p) === 1 && p[0] !== p[1] && p[1] !== p[2] && p[0] !== p[2]; }); }
  function X(c, v, e) { var o = {}; o[v] = e == null ? 1 : e; return M(c, o); }
  function XY(c, a, b, e1, e2) { var o = {}; if (e1) o[a] = e1; if (e2) o[b] = e2; return M(c, o); }
  /* GCF parts: build from G times coprime brackets */
  function fp(terms, opt) { return factorPart(terms, Object.assign({ verify: true }, opt || {})); }
  /* the polynomial g·x^e·(c1 x^k1 ± …) as a list of terms */
  function gl(G, list) { return list.map(function (m) { return PL.mul(G, m); }); }

  /* Extra practice 7: three students' errors */
  function errQ(sub, who, kind) {
    return { num: '7',
      stem: function (sh) { return '<b>Error analysis.</b> (' + sub + ') ' + who + ': ' + t(sh.Ttx + '=' + sh.shown); },
      shared: function (r) {
        var v = r.pick(['x', 'x', 'a', 'y', 'm']), o, G, br, shown;
        if (kind === 'kept') { // 4x² + 6x = 2x(2x + 3x): divided the first term only by the number
          o = pickWhere(function () { return { g: r.int(2, 5), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; });
          G = X(o.g, v); br = [X(o.c[0], v), N(o.c[1])]; shown = gTex(G) + '(' + o.c[0] + v + '+' + o.c[1] + v + ')';
        } else if (kind === 'drop') { // 5x² + 5x = 5x(x)
          o = { g: r.int(2, 9) }; G = X(o.g, v); br = [V(v), N(1)]; shown = gTex(G) + '(' + v + ')';
        } else { // 12x³ + 18x² = 2x²(6x + 9)
          o = pickWhere(function () { return { g: r.pick([2, 3]), k: r.pick([2, 3]), c: cop2(r, 2, 5) }; }, function (o) { return o.g * o.k * Math.max(o.c[0], o.c[1]) <= 40; });
          G = X(o.g * o.k, v, 2); br = [X(o.c[0], v), N(o.c[1])]; shown = gTex(X(o.g, v, 2)) + '(' + o.k * o.c[0] + v + '+' + o.k * o.c[1] + ')';
        }
        var terms = gl(G, br);
        return { v: v, o: o, G: G, br: br, terms: terms, Ttx: seq(terms), shown: shown, kind: kind };
      },
      parts: [
        { id: 'e7' + sub + '1', sub: sub + ' i', level: 'EMG', make: function (r, sh) { return errWhat(r, sh, who); } },
        { id: 'e7' + sub + '2', sub: sub + ' ii', level: 'BEG', make: function (r, sh) {
          var ws = [{ is: [sh.kind === 'gcf' ? X(sh.o.g, sh.v, 2) : sh.G, sh.kind === 'kept' ? sum([X(sh.o.c[0], sh.v), X(sh.o.c[1], sh.v)]) : sh.kind === 'drop' ? V(sh.v) : sum([X(sh.o.k * sh.o.c[0], sh.v), N(sh.o.k * sh.o.c[1])])], code: 'kept-error', hint: 'That is ' + who + '’s answer — ' + (sh.kind === 'gcf' ? 'it is equal, but the bracket still has a common factor.' : 'expand it: it doesn’t give back ' + t(sh.Ttx) + '.'), tex: sh.shown }];
          return fp(sh.terms, { prompt: 'Write the correct factored form of ' + t(sh.Ttx) + '.', wrong: ws });
        } }] };
  }
  function errWhat(r, sh, who) {
    var v = sh.v, o = sh.o, opts;
    if (sh.kind === 'kept') opts = [
      { html: who + ' divided ' + t(o.g * o.c[1] + v) + ' by ' + t(o.g) + ' but not by ' + t(v) + ': ' + t(o.g * o.c[1] + v + '\\div ' + o.g + v + '=' + o.c[1]) + ', not ' + t(o.c[1] + v) + '.', right: true },
      { html: 'The GCF should be ' + t(o.g) + ', not ' + t(o.g + v) + '.', why: t(v) + ' is in both terms, so ' + t(o.g + v) + ' is the GCF. The mistake is inside the bracket.' },
      { html: 'The first term in the bracket should be ' + t(o.c[0] + v + '^{2}') + '.', why: t(o.g * o.c[0] + v + '^{2}\\div ' + o.g + v + '=' + o.c[0] + v) + ' — the first term is right.' },
      { html: 'There is no mistake.', why: 'Expand it: the second term becomes ' + t(o.g * o.c[1] + v + '^{2}') + ', not ' + t(o.g * o.c[1] + v) + '.' }];
    else if (sh.kind === 'drop') opts = [
      { html: who + ' dropped the ' + t('1') + ' left by ' + t(o.g + v + '\\div ' + o.g + v + '=1') + '; it must stay in the bracket.', right: true },
      { html: 'The GCF should be ' + t(o.g) + ', not ' + t(o.g + v) + '.', why: t(v) + ' is in both terms, so it belongs in the GCF. Expand ' + who + '’s answer: how many terms come back?' },
      { html: 'A term divided by itself gives ' + t('0') + ', so the answer is right.', why: 'A term divided by itself gives ' + t('1') + ', not ' + t('0') + '. Expanding ' + t(sh.shown) + ' gives only ' + t(o.g + v + '^{2}') + '.' },
      { html: 'The bracket should be ' + t('(' + v + '^{2}+' + v + ')') + '.', why: 'Divide each term by ' + t(o.g + v) + ': ' + t(o.g + v + '^{2}\\div ' + o.g + v + '=' + v) + ' and ' + t(o.g + v + '\\div ' + o.g + v + '=1') + '.' }];
    else opts = [
      { html: t(o.g + v + '^{2}') + ' is a common factor, but not the <b>greatest</b>: ' + t(o.k * o.c[0] + v + '+' + o.k * o.c[1]) + ' still has a common factor of ' + t(o.k) + '.', right: true },
      { html: 'It doesn’t expand back to ' + t(sh.Ttx) + '.', why: 'It does: ' + t(sh.shown + '=' + sh.Ttx) + '. Look inside the bracket.' },
      { html: 'The GCF should not include ' + t(v + '^{2}') + '.', why: t(v + '^{2}') + ' is the lowest power of ' + t(v) + ', so it belongs in the GCF. Look at the numbers in the bracket.' },
      { html: 'There is no mistake.', why: 'The bracket ' + t(o.k * o.c[0] + v + '+' + o.k * o.c[1]) + ' still has a common factor of ' + t(o.k) + '.' }];
    var G = sh.G, sol = sh.kind === 'gcf' ? who + '’s answer expands back correctly, but the bracket still has a common factor of ' + t(o.k) + ': ' + t(o.g + v + '^{2}') + ' is common, but not <b>greatest</b>. The GCF is ' + t(tx(G)) + '.'
      : 'Expanding ' + who + '’s answer gives ' + t(tx(sh.kind === 'drop' ? X(o.g, v, 2) : PL.mul(G, sum([X(o.c[0], v), X(o.c[1], v)])))) + ', not ' + t(sh.Ttx) + '. ' + (sh.kind === 'drop' ? 'The ' + t('1') + ' from ' + t(o.g + v + '\\div ' + o.g + v) + ' was dropped.' : 'The second term was not divided by ' + t(v) + '.');
    return mcPart(r, 'What went wrong?', opts, sol, ['Expand ' + who + '’s answer and compare it with ' + t(sh.Ttx) + '.'], who + ' error');
  }

  HW.defineLesson({
    id: 'u4l2', unit: 4, num: '2', title: 'Common Factors: Finding and Removing the GCF', outcome: 'AN5',
    blurb: 'Find the GCF (numbers and letters), divide every term by it, and check by expanding — with a negative GCF when the first term is negative.',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A — Finding and Removing a GCF', stem: 'State the greatest common factor of each set of monomials.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { var v = r.pick(L1), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5), e: r.pick([[1, 2], [2, 1], [1, 3], [2, 3]]) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; });
          return gcfPart([X(o.g * o.c[0], v, o.e[0]), X(o.g * o.c[1], v, o.e[1])]); } },
        { id: '1b', level: 'BEG', make: function (r) { var v = r.pick(L1), o = pickWhere(function () { return { g: r.int(2, 7), c: cop2(r, 2, 5), e: r.pick([[3, 1], [1, 3], [3, 2], [4, 1], [4, 2]]) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 35; });
          return gcfPart([X(o.g * o.c[0], v, o.e[0]), X(o.g * o.c[1], v, o.e[1])]); } },
        { id: '1c', level: 'EMG', make: function (r) { var L = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']]), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; });
          return gcfPart([XY(o.g * o.c[0], L[0], L[1], 1, r.int(1, 2)), X(o.g * o.c[1], L[1])]); } },
        { id: '1d', level: 'PRG', make: function (r) { var L = r.pick(PAIRS), o = pickWhere(function () { return { g: r.int(2, 9), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 36; }), e = r.pick([[2, 1, 1, 2], [2, 2, 1, 3], [1, 2, 2, 1], [3, 1, 1, 2]]);
          return gcfPart([XY(-o.g * o.c[0], L[0], L[1], e[0], e[1]), XY(-o.g * o.c[1], L[0], L[1], e[2], e[3])]); } }] },
      { num: '2', stem: 'In each case the GCF has been removed. Complete the factoring.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 9), c: cop2(r, 2, 7) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 45; }), B = sum([X(o.c[0], 'x'), N(o.c[1])]); return frontPart(PL.mul(N(o.g), B), N(o.g), B); } },
        { id: '2b', level: 'BEG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), o = pickWhere(function () { return { g: r.int(2, 9), c: cop2(r, 2, 7) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 45; }), B = sum([X(o.c[0], v), N(-o.c[1])]); return frontPart(PL.mul(N(o.g), B), N(o.g), B); } },
        { id: '2c', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 5), c: cop2(r, 2, 7) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 35; }), G = X(o.g, 'x'); return backPart(gl(G, [X(o.c[0], 'x'), N(o.c[1])]), G); } },
        { id: '2d', level: 'EMG', make: function (r) { var v = r.pick(['y', 'y', 'x', 'a']), o = pickWhere(function () { return { g: r.int(2, 7), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 36; }), G = X(o.g, v); return backPart(gl(G, [N(o.c[0]), X(-o.c[1], v)]), G); } }] },
      { num: '3', stem: 'Factor each binomial by removing the GCF. Verify your answer by expanding.', parts: [
        { id: '3a', level: 'LIM', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 9), c: cop2(r, 2, 7) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 40; }); return fp([X(o.g * o.c[0], 'x'), N(o.g * o.c[1])]); } },
        { id: '3b', level: 'BEG', make: function (r) { var v = r.pick(['y', 'y', 'x', 'p']), o = pickWhere(function () { return { g: r.int(2, 9), c: cop2(r, 2, 7) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 45; }); return fp([X(o.g * o.c[0], v), N(-o.g * o.c[1])]); } },
        { id: '3c', level: 'BEG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'k']), o = pickWhere(function () { return { g: r.int(2, 9), c: cop2(r, 2, 7) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 45; }); return fp([X(o.g * o.c[0], v), N(o.g * o.c[1])]); } },
        { id: '3d', level: 'BEG', make: function (r) { var v = r.pick(['b', 'b', 'x', 'n']), o = pickWhere(function () { return { g: r.int(3, 9), c: cop2(r, 2, 5) }; }, function (o) { return o.c[0] > o.c[1] && o.g * o.c[0] <= 45; }); return fp([X(o.g * o.c[0], v), N(-o.g * o.c[1])]); } },
        { id: '3e', level: 'BEG', make: function (r) { var v = r.pick(['x', 'x', 'a', 'y']), g = r.int(2, 12); return fp([X(g, v), N(g)]); } },
        { id: '3f', level: 'BEG', make: function (r) { var v = r.pick(['m', 'm', 'x', 't']), o = pickWhere(function () { return { g: r.pick([4, 6, 8, 9, 10, 12]), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 50; }); return fp([X(o.g * o.c[0], v), N(-o.g * o.c[1])]); } }] },
      { num: '4', stem: 'Factor each trinomial by removing the GCF.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { var o = { g: r.int(2, 5), b: r.int(1, 5), c: r.int(2, 6) }; return fp([X(o.g, 'x', 2), X(o.g * o.b, 'x'), N(o.g * o.c)]); } },
        { id: '4b', level: 'BEG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), o = { g: r.int(2, 6), b: r.int(1, 5), c: r.int(2, 6) }; return fp([X(o.g, v, 2), X(-o.g * o.b, v), N(o.g * o.c)]); } },
        { id: '4c', level: 'EMG', make: function (r) { var v = r.pick(['y', 'y', 'x', 'n']), o = pickWhere(function () { return { g: r.int(2, 5), a: r.int(2, 4), b: r.int(1, 4), c: r.int(2, 6) }; }, function (o) { return gcdA([o.a, o.b, o.c]) === 1; }); return fp([X(o.g * o.a, v, 2), X(o.g * o.b, v), N(-o.g * o.c)]); } },
        { id: '4d', level: 'BEG', make: function (r) { var v = r.pick(['m', 'm', 'x', 'p']), o = { g: r.int(2, 7), b: r.int(1, 4), c: r.int(2, 5) }; return fp([X(o.g, v, 2), X(-o.g * o.b, v), N(-o.g * o.c)]); } }] },
      /* ---------------- Part B ---------------- */
      { num: '5', section: 'Part B — GCFs That Include Variables', stem: 'Factor each polynomial. The GCF includes a variable.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 5), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return fp(gl(X(o.g, 'x', 2), [X(o.c[0], 'x'), N(o.c[1])])); } },
        { id: '5b', level: 'BEG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return fp(gl(X(o.g, v, 3), [X(o.c[0], v), N(-o.c[1])])); } },
        { id: '5c', level: 'EMG', make: function (r) { var v = r.pick(['y', 'y', 'x', 'k']), o = { g: r.int(2, 9), a: r.int(2, 5) }; return fp(gl(X(o.g, v, 2), [X(o.a, v), N(1)])); } },
        { id: '5d', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return fp(gl(X(o.g, 'x', 2), [X(o.c[0], 'x'), N(-o.c[1])])); } },
        { id: '5e', level: 'BEG', make: function (r) { var v = r.pick(['m', 'm', 'x', 'a']), o = { g: r.int(2, 9), k: r.int(2, 9) }; return fp(gl(X(o.g, v, 2), [V(v), N(o.k)])); } },
        { id: '5f', level: 'EMG', make: function (r) { var o = { g: r.int(2, 6), b: r.int(1, 5), c: r.int(2, 6) }; return fp(gl(X(o.g, 'x'), [V('x', 2), X(o.b, 'x'), N(o.c)])); } }] },
      { num: '6', stem: 'Factor each polynomial. The GCF includes two variables.', parts: [
        { id: '6a', level: 'EMG', make: function (r) { var L = r.pick(PAIRS), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return fp(gl(XY(o.g, L[0], L[1], 1, 1), [X(o.c[0], L[0]), X(o.c[1], L[1])])); } },
        { id: '6b', level: 'EMG', make: function (r) { var L = r.pick(PAIRS), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return fp(gl(XY(o.g, L[0], L[1], 1, 1), [X(o.c[0], L[0]), X(-o.c[1], L[1])])); } },
        { id: '6c', level: 'PRG', make: function (r) { var L = r.pick(PAIRS), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return fp(gl(XY(o.g, L[0], L[1], 1, 2), [X(o.c[0], L[0]), X(o.c[1], L[1])])); } }] },
      /* ---------------- Part C ---------------- */
      { num: '7', section: 'Part C — Negative GCFs', stem: 'Factor each binomial by removing a <b>negative</b> GCF.', parts: [
        { id: '7a', level: 'BEG', make: function (r) { var g = r.int(2, 9), k = r.int(1, 9); return fp([X(-g, 'x'), N(-g * k)]); } },
        { id: '7b', level: 'BEG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'n']), g = r.int(2, 9), k = r.int(1, 9); return fp([X(-g, v), N(g * k)]); } },
        { id: '7c', level: 'BEG', make: function (r) { var v = r.pick(['y', 'y', 'x', 'b']), g = r.int(2, 9), k = r.int(2, 9); return fp([X(-g, v), N(-g * k)]); } },
        { id: '7d', level: 'EMG', make: function (r) { var v = r.pick(['m', 'm', 'x', 't']), o = pickWhere(function () { return { g: r.int(2, 7), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return fp([X(-o.g * o.c[0], v), N(o.g * o.c[1])]); } }] },
      { num: '8', stem: 'Factor each trinomial by removing a <b>negative</b> GCF.', parts: [
        { id: '8a', level: 'EMG', make: function (r) { var o = { g: r.int(2, 6), b: r.int(1, 5), c: r.int(2, 6) }; return fp([X(-o.g, 'x', 2), X(o.g * o.b, 'x'), N(-o.g * o.c)]); } },
        { id: '8b', level: 'EMG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), o = { g: r.int(2, 6), b: r.int(1, 5), c: r.int(2, 6) }; return fp([X(-o.g, v, 2), X(-o.g * o.b, v), N(o.g * o.c)]); } },
        { id: '8c', level: 'EMG', make: function (r) { var v = r.pick(['y', 'y', 'x', 'p']), o = { g: r.int(2, 6), b: r.int(1, 5), c: r.int(2, 6) }; return fp([X(-o.g, v, 2), X(o.g * o.b, v), N(o.g * o.c)]); } }] },
      { num: '9', stem: 'Factor each polynomial completely. The GCF is negative and includes a variable.', parts: [
        { id: '9a', level: 'EMG', make: function (r) { var o = { g: r.int(2, 9), k: r.int(1, 9) }; return fp(gl(X(-o.g, 'x', 2), [V('x'), N(o.k)])); } },
        { id: '9b', level: 'PRG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return fp(gl(X(-o.g, v, 2), [X(o.c[0], v), N(-o.c[1])])); } },
        { id: '9c', level: 'PRG', make: function (r) { var L = r.pick(PAIRS), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return fp(gl(XY(-o.g, L[0], L[1], 1, 1), [X(o.c[0], L[0]), X(o.c[1], L[1])])); } },
        { id: '9d', level: 'PRG', make: function (r) { var v = r.pick(['m', 'm', 'x', 'y']), o = pickWhere(function () { return { g: r.int(2, 7), b: r.int(1, 5), c: r.int(2, 6) }; }, function (o) { return true; }); return fp(gl(X(-o.g, v), [V(v, 2), X(-o.b, v), N(o.c)])); } }] },
      /* ---------------- Part D ---------------- */
      { num: '10', section: 'Part D — Applications and Review', stem: function (sh) { return 'A rectangular flower bed has area ' + t('A=' + sh.Ttx) + ' (square metres), where ' + t('x') + ' is a positive number of metres.'; },
        shared: function (r) { var o = pickWhere(function () { return { g: r.int(2, 5), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }), G = X(o.g, 'x'), br = [X(o.c[0], 'x'), N(o.c[1])], terms = gl(G, br); return { o: o, G: G, br: br, terms: terms, Ttx: seq(terms), x: r.int(2, 6) }; },
        parts: [
          { id: '10a', level: 'BEG', make: function (r, sh) { return fp(sh.terms, { prompt: 'Factor ' + t('A') + ' completely.', inBefore: t('A='), before: 'A=', text: 'factor flower bed A' }); } },
          { id: '10b', level: 'BEG', make: function (r, sh) {
            var x = sh.x, o = sh.o, f1 = o.g * x, f2 = o.c[0] * x + o.c[1], A = f1 * f2;
            return KP.number('Use the factored form to find ' + t('A') + ' when ' + t('x=' + x) + '.', A, function (v) {
              if (v === o.g * o.c[0] * x * x + o.c[1]) return { code: 'first-only', hint: 'Substitute into both factors: ' + t(o.g + 'x=' + f1) + ' and ' + t(o.c[0] + 'x+' + o.c[1] + '=' + f2) + ', then multiply.' };
              if (v === f1 + f2) return { code: 'value', hint: 'The factors are <b>multiplied</b>: ' + t(f1 + '\\times ' + f2) + '.' };
              return null;
            }, t('A=' + o.g + 'x(' + o.c[0] + 'x+' + o.c[1] + ')=' + o.g + '(' + x + ')(' + o.c[0] + '(' + x + ')+' + o.c[1] + ')=' + f1 + '\\times ' + f2 + '=\\mathbf{' + A + '}') + ' square metres.',
            ['Substitute ' + t('x=' + x) + ' into each factor, then multiply the two results.'], 'flower bed A at x=' + x, { after: t('\\text{m}^{2}') });
          } }] },
      { num: '11', stem: function (sh) { return 'A student factored ' + t(sh.Ttx) + ' as ' + t(sh.shown) + '.'; },
        shared: function (r) { var o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 7) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 40; }), v = r.pick(['x', 'x', 'a', 'y']);
          /* the student's claim −g(c₀v − c₁) for −g·c₀v − g·c₁: the last sign is wrong (it expands to −g·c₀v + g·c₁) */
          var terms = [X(-o.g * o.c[0], v), N(-o.g * o.c[1])], gc = o.g * o.c[1];
          return { o: o, v: v, terms: terms, Ttx: seq(terms), shown: '-' + o.g + '(' + o.c[0] + v + '-' + o.c[1] + ')', E: '-' + o.g * o.c[0] + v + '+' + gc, right: '-' + o.g + '(' + o.c[0] + v + '+' + o.c[1] + ')', gc: gc }; },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) {
            var g = sh.o.g, c1 = sh.o.c[1];
            return mcPart(r, 'Identify the error in the student’s work.', [
              { html: 'The sign of the last term is wrong: ' + t(sh.shown + '=' + sh.E) + ', not ' + t(sh.Ttx) + '. Dividing ' + t('-' + sh.gc) + ' by ' + t('-' + g) + ' gives ' + t('+' + c1) + ', not ' + t('-' + c1) + '.', right: true },
              { html: 'The GCF should be positive: ' + t(g) + ', not ' + t('-' + g) + '.', why: 'The first term ' + t(tx(sh.terms[0])) + ' is negative, so taking out ' + t('-' + g) + ' is right. Expand the student’s answer and compare the <b>last</b> term with ' + t(tx(sh.terms[1])) + '.' },
              { html: t(g) + ' is not the greatest common factor.', why: t('\\gcd(' + g * sh.o.c[0] + ',' + sh.gc + ')=' + g) + ' — the size is right. Expand the student’s answer and compare the signs.' },
              { html: 'There is no error.', why: 'Expand it: ' + t('-' + g + '\\times(-' + c1 + ')=+' + sh.gc) + ', so ' + t(sh.shown + '=' + sh.E) + ', not ' + t(sh.Ttx) + '.' }],
              'Check by expanding: ' + t(sh.shown + '=' + sh.E) + ', but the last term should be ' + t(tx(sh.terms[1])) + '.<br>Dividing ' + t('-' + sh.gc) + ' by ' + t('-' + g) + ' gives ' + t('+' + c1) + ', not ' + t('-' + c1) + '.<br>Correct: ' + t(sh.Ttx + '=' + sh.right) + '.',
              ['Expand the student’s answer and compare it with ' + t(sh.Ttx) + ' term by term.', 'A negative divided by a negative is positive.'], 'sign error in a negative GCF');
          } },
          { id: '11b', level: 'BEG', make: function (r, sh) { return fp(sh.terms, { prompt: 'Write the correct factored form of ' + t(sh.Ttx) + '.',
            hints: ['The first term is negative, so take out ' + t('-' + sh.o.g) + '. Then divide <b>each</b> term by it.', 'A negative divided by a negative is positive: ' + t('-' + sh.gc + '\\div(-' + sh.o.g + ')=+' + sh.o.c[1]) + '.'] }); } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'EMG', make: function (r) {
          var o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }), v = r.pick(['x', 'x', 'a', 'y']), terms = [X(-o.g * o.c[0], v, 2), X(-o.g * o.c[1], v)], poly = seq(terms);
          return mcPart(r, 'Following the convention in this lesson, what is the correct GCF to remove from ' + t(poly) + '?', [
            { html: t(o.g + v), why: 'The size is right, but the first term is negative, so take the GCF <b>negative</b>.' },
            { html: t('-' + o.g + v), right: true },
            { html: t(o.g), why: t(v) + ' is in both terms, so it belongs in the GCF — and the first term is negative.' },
            { html: t('-' + o.g), why: t(v) + ' is in both terms, so it belongs in the GCF.' }],
            t('\\gcd(' + o.g * o.c[0] + ',' + o.g * o.c[1] + ')=' + o.g) + ', the lowest power of ' + t(v) + ' is ' + t(v) + ', and the first term is negative, so the GCF is ' + t('-' + o.g + v) + ': ' + t(poly + '=-' + o.g + v + '(' + o.c[0] + v + '+' + o.c[1] + ')') + '.', ['Find the size of the GCF first, then decide its sign from the first term.'], 'MC negative GCF', true);
        } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '13', level: 'PRG', make: function (r) {
          var o = pickWhere(function () { return { g: r.int(2, 9), b: r.int(2, 5), c: r.int(2, 7) }; }, function (o) { return gcd(o.b, o.c) === 1 && o.g * Math.max(o.b, o.c) <= 50; });
          /* −g·b x³ + g·c x² = −g x²(b x − c): a = −g, b = b, c = −c, so a×b×c = g·b·c (always positive, an NR bubble answer) */
          var terms = [X(-o.g * o.b, 'x', 3), X(o.g * o.c, 'x', 2)], ans = o.g * o.b * o.c, g = o.g;
          return KP.nr('When ' + t(seq(terms)) + ' is factored by removing the GCF, the result has the form ' + t('ax^{2}(bx+c)') + '. The value of ' + t('a\\times b\\times c') + ' is ________.', ans, function (v) {
            if (v === -g + o.b - o.c || v === g - o.b + o.c) return { code: 'u4l2-nr-add', hint: 'That is ' + t('a+b+c') + '. This question asks for the <b>product</b> ' + t('a\\times b\\times c') + '.' };
            if (v === -ans) return { code: 'neg-rule', hint: 'Your product is negative, so one sign is off. The first term is negative, so the GCF is negative: ' + t('a=-' + g) + '. Then dividing ' + t(o.g * o.c + 'x^{2}') + ' by ' + t('-' + g + 'x^{2}') + ' gives ' + t('c=-' + o.c) + ' — two negatives in the product.' };
            for (var d = 1; d < g; d++) if (g % d === 0 && v === ans * g / d) return { code: 'not-greatest', hint: 'Check the GCF: ' + t('\\gcd(' + g * o.b + ',' + g * o.c + ')=' + g) + ', so ' + t('a=-' + g) + '. With a smaller common factor the bracket can still be factored.' };
            return null;
          }, 'The first term is negative, so the GCF is ' + t('-' + g + 'x^{2}') + ': ' + t(seq(terms) + '=-' + g + 'x^{2}(' + o.b + 'x-' + o.c + ')') + '.<br>' + t('a=-' + g + ',\\ b=' + o.b + ',\\ c=-' + o.c) + ', so ' + t('a\\times b\\times c=(-' + g + ')(' + o.b + ')(-' + o.c + ')=\\mathbf{' + ans + '}') + '.',
          ['Take out a negative GCF (the first term is negative). Then read off ' + t('a') + ', ' + t('b') + ' and ' + t('c') + ' with their signs.', 'Multiply the three numbers: two negative factors make a positive product.'], 'NR negative GCF a×b×c');
        } }] },
      { num: '14', stem: 'Factor each polynomial completely. Verify your answers by expanding.', parts: [
        { id: '14a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return fp(gl(X(o.g, 'x'), [X(o.c[0], 'x'), N(o.c[1])])); } },
        { id: '14b', level: 'EMG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), o = { g: r.int(2, 9), k: r.int(1, 9) }; return fp(gl(X(-o.g, v), [V(v), N(o.k)])); } },
        { id: '14c', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return fp(gl(X(o.g, 'x', 2), [X(o.c[0], 'x'), N(-o.c[1])])); } },
        { id: '14d', level: 'PRG', make: function (r) { var v = r.pick(['y', 'y', 'x', 'm']), o = { g: r.int(2, 7), b: r.int(1, 5), c: r.int(2, 6) }; return fp(gl(X(-o.g, v), [V(v, 2), X(-o.b, v), N(o.c)])); } }] }
    ],
    extra: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Extra practice A — Longer polynomials, more variables, negative GCFs', stem: 'State the greatest common factor of each set of monomials. Where every monomial is negative, give a <b>negative</b> GCF.', parts: [
        { id: 'e1a', level: 'EMG', make: function (r) { var L = r.pick(PAIRS), g = r.pick([6, 8, 10, 12]), c = r.pick([[2, 3, 5], [3, 2, 5], [2, 5, 3], [3, 4, 5]]), a = r.int(2, 3), b = r.int(1, 2);
          return gcfPart([XY(g * c[0], L[0], L[1], a + 2, b + 1), XY(g * c[1], L[0], L[1], a + 1, b + 2), XY(g * c[2], L[0], L[1], a, b)]); } },
        { id: 'e1b', level: 'EMG', make: function (r) { var L = r.pick(PAIRS), g = r.pick([6, 8, 9, 10]), c = r.pick([[2, 3, 5], [3, 2, 5], [2, 5, 3]]), a = r.int(1, 2), b = r.int(1, 2);
          return gcfPart([XY(g * c[0], L[0], L[1], a + 3, b), XY(g * c[1], L[0], L[1], a + 1, b + 3), XY(g * c[2], L[0], L[1], a, b + 1)]); } },
        { id: 'e1c', level: 'PRG', make: function (r) { var L = r.pick(PAIRS), g = r.pick([5, 6, 7, 9]), c = r.pick([[2, 3, 5], [3, 2, 5], [2, 5, 3]]), a = r.int(1, 2), b = r.int(1, 2);
          return gcfPart([XY(-g * c[0], L[0], L[1], a + 1, b + 1), XY(-g * c[1], L[0], L[1], a, b + 2), XY(-g * c[2], L[0], L[1], a + 2, b)]); } },
        { id: 'e1d', level: 'PRG', make: function (r) { var L = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]), g = r.pick([5, 10, 15, 6, 12]), c = r.pick([[2, 3, 5], [3, 2, 5], [2, 5, 3], [3, 4, 5]]);
          return gcfPart([XY(g * c[0], L[0], L[1], 3, 0), XY(g * c[1], L[0], L[1], 2, 1), XY(g * c[2], L[0], L[1], 1, 2)]); } }] },
      { num: '2', stem: 'Factor each <b>four-term</b> polynomial by removing the GCF. Verify by expanding.', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { var g = r.int(2, 9), c = r.pick([[2, 3, 4], [3, 2, 5], [2, 5, 3], [4, 3, 2], [3, 4, 5]]); return fp(gl(X(g, 'x'), [X(c[0], 'x', 3), X(-c[1], 'x', 2), X(c[2], 'x'), N(-1)])); } },
        { id: 'e2b', level: 'EMG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), g = r.int(2, 10), c = r.pick([[2, 3, 5], [3, 2, 4], [2, 5, 3], [4, 3, 2]]); return fp(gl(X(g, v, 2), [X(c[0], v, 3), X(c[1], v, 2), X(-c[2], v), N(1)])); } },
        { id: 'e2c', level: 'EMG', make: function (r) { var v = r.pick(['y', 'y', 'x', 'k']), g = r.int(2, 9), c = r.pick([[3, 2, 5], [2, 3, 4], [4, 2, 5], [3, 4, 2]]); return fp(gl(X(g, v), [V(v, 3), X(-c[0], v, 2), X(c[1], v), N(-c[2])])); } }] },
      { num: '3', stem: 'Factor each polynomial. In every case the GCF contains <b>both</b> variables, each at its lowest exponent.', parts: [
        { id: 'e3a', level: 'PRG', make: function (r) { var L = r.pick(PAIRS), g = r.int(2, 9), c = cop3(r, 2, 5); return fp(gl(XY(g, L[0], L[1], 2, 2), [X(c[0], L[0]), X(-c[1], L[1]), N(c[2])])); } },
        { id: 'e3b', level: 'PRG', make: function (r) { var L = r.pick(PAIRS), g = r.int(2, 12), c = r.pick([[2, 3, 1], [3, 2, 1], [2, 5, 1], [4, 3, 1]]); return fp(gl(XY(g, L[0], L[1], 2, 2), [X(c[0], L[0]), X(-c[1], L[1]), N(c[2])])); } },
        { id: 'e3c', level: 'PRG', make: function (r) { var L = r.pick(PAIRS), g = r.int(2, 9), c = cop3(r, 2, 5); return fp(gl(XY(g, L[0], L[1], 2, 2), [X(c[0], L[0], 2), XY(c[1], L[0], L[1], 1, 1), X(-c[2], L[1], 2)])); } }] },
      { num: '4', stem: 'Each leading term is negative, so remove a <b>negative</b> GCF and leave a positive leading term inside the bracket.', parts: [
        { id: 'e4a', level: 'PRG', make: function (r) { var g = r.int(2, 9), c = r.pick([[2, 3, 5], [3, 2, 4], [2, 5, 3], [3, 4, 5]]); return fp(gl(X(-g, 'x'), [X(c[0], 'x', 2), X(-c[1], 'x'), N(c[2])])); } },
        { id: 'e4b', level: 'PRG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), g = r.int(2, 7), c = r.pick([[3, 4, 5], [2, 3, 4], [3, 2, 5], [4, 3, 2]]); return fp(gl(X(-g, v, 2), [X(c[0], v, 2), X(c[1], v), N(-c[2])])); } },
        { id: 'e4c', level: 'PRG', make: function (r) { var L = r.pick(PAIRS), g = r.int(2, 7), c = r.pick([[2, 3, 5], [3, 2, 4], [2, 5, 3], [4, 3, 5]]); return fp(gl(XY(-g, L[0], L[1], 1, 1), [X(c[0], L[0], 2), XY(-c[1], L[0], L[1], 1, 1), X(c[2], L[1], 2)])); } },
        { id: 'e4d', level: 'PRG', make: function (r) { var v = r.pick(['m', 'm', 'x', 'y']), g = r.int(2, 8), c = r.pick([[2, 5, 3], [3, 2, 4], [2, 3, 5], [4, 5, 3]]); return fp(gl(X(-g, v, 2), [X(c[0], v, 3), X(-c[1], v), N(c[2])])); } }] },
      /* ---------------- Part B ---------------- */
      { num: '5', section: 'Extra practice B — Working backwards, and the vanishing 1', stem: 'Fill in each blank so that the statement is true. Check each answer by expanding.', parts: [
        { id: 'e5a', level: 'BEG', make: function (r) { var v = r.pick(['x', 'x', 'a', 'y']), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }), G = X(o.g, v), B = sum([X(o.c[0], v), N(-o.c[1])]), P = PL.mul(G, B);
          return frontPart(P, G, B, { prompt: t('\\underline{\\qquad}\\,(' + tx(B) + ')=' + tx(P)) }); } },
        { id: 'e5b', level: 'EMG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), o = pickWhere(function () { return { g: r.int(2, 9), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 40; }), G = N(-o.g), B = sum([X(o.c[0], v), N(o.c[1])]), P = PL.mul(G, B);
          return frontPart(P, G, B, { prompt: t('\\underline{\\qquad}\\,(' + tx(B) + ')=' + tx(P)), wrong: [{ is: N(o.g), code: 'neg-rule', hint: 'Check the signs by expanding: ' + t(o.g + '(' + tx(B) + ')=' + tx(PL.mul(N(o.g), B))) + '. The terms are negative, so the factor is negative.' }] }); } },
        { id: 'e5c', level: 'EMG', make: function (r) { var L = r.pick(PAIRS), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }), G = XY(o.g, L[0], L[1], 2, 1);
          return backPart(gl(G, [X(o.c[0], L[0]), X(-o.c[1], L[1])]), G, { prompt: t(tx(G) + '(\\underline{\\qquad\\quad})=' + seq(gl(G, [X(o.c[0], L[0]), X(-o.c[1], L[1])]))) }); } },
        { id: 'e5d', level: 'PRG', make: function (r) { var v = r.pick(['m', 'm', 'x', 'a']), g = r.int(2, 7), c = r.pick([[3, 4, 2], [2, 3, 5], [4, 3, 2], [3, 2, 4]]), G = X(-g, v, 2), terms = gl(G, [X(c[0], v, 2), X(-c[1], v), N(c[2])]);
          return backPart(terms, G, { prompt: t(tx(G) + '(\\underline{\\qquad\\quad})=' + seq(terms)) }); } }] },
      { num: '6', stem: '<b>The vanishing 1.</b> When a term is <i>exactly</i> the GCF, dividing it leaves ' + t('1') + ' — and that ' + t('1') + ' must be written. Factor each polynomial; every one leaves a ' + t('1') + ' or a ' + t('-1') + ' behind.', parts: [
        { id: 'e6a', level: 'BEG', make: function (r) { var v = r.pick(['x', 'x', 'a', 'y']), g = r.int(2, 12); return fp(gl(X(g, v), [V(v), N(1)])); } },
        { id: 'e6b', level: 'BEG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), g = r.int(2, 12); return fp(gl(X(g, v, 2), [V(v), N(-1)])); } },
        { id: 'e6c', level: 'EMG', make: function (r) { var v = r.pick(['y', 'y', 'x', 'k']), g = r.int(2, 6), a = r.int(2, 5), b = r.int(1, 4); return fp(gl(X(g, v), [X(a, v, 2), X(b, v), N(-1)])); } },
        { id: 'e6d', level: 'PRG', make: function (r) { var v = r.pick(['m', 'm', 'x', 'y']), g = r.int(2, 9), e = r.int(1, 2); return fp(gl(X(-g, v, e), [V(v, 2), X(-1, v), N(1)])); } }] },
      errQ('a', 'Sam', 'kept'),
      errQ('b', 'Kara', 'drop'),
      errQ('c', 'Dev', 'gcf'),
      { num: '8', stem: function (sh) { return 'A polynomial has a GCF of ' + t(tx(sh.G)) + ', and one of its terms is ' + t(tx(sh.T)) + '.'; },
        shared: function (r) { var v = r.pick(['x', 'x', 'a', 'y']), g = r.pick([2, 3, 4, 4, 5, 6]), e = r.int(1, 3), k = r.int(2, 3), d = r.int(1, 2); return { v: v, g: g, e: e, G: X(g, v, e), T: X(g * k, v, e + d), k: k, d: d }; },
        parts: [
          { id: 'e8a', level: 'MAS', make: function (r, sh) {
            var G = sh.G, v = sh.v, g = sh.g, e = sh.e, a = pickWhere(function () { return r.int(2, 5); }, function (x) { return gcd(x, sh.k) === 1; }), list = [X(g * a, v, e + 3), sh.T, X(g, v, e)].filter(function (m, i, arr) { return !arr.slice(0, i).some(function (q) { return PL.eq(q, m); }); });
            if (list.length < 3) list = [X(g * a, v, e + sh.d + 1), sh.T, X(g, v, e)];
            var terms = PL.sorted(sum(list)).map(function (T) { return M(T.c, T.v); }), br = terms.map(function (m) { return divM(m, G); });
            var key = [seq(terms), gTex(G) + '(' + seq(br) + ')'];
            var p = writePolyPart(G, sh.T, 3, key,
              'For example ' + t(key[0] + '=' + key[1]) + '. The coefficients ' + t(terms.map(function (m) { return cOf(m)[0]; }).join(',\\ ')) + ' have GCF ' + t(g) + ', the lowest power of ' + t(v) + ' is ' + t(powTex(v, e)) + ', and the bracket ' + t(seq(br)) + ' has no common factor left — so the GCF is exactly ' + t(tx(G)) + '. (A term equal to ' + t(tx(G)) + ' is an easy way to keep the GCF from getting bigger.)',
              ['Every term must be ' + t(tx(G)) + ' times something. Include ' + t(tx(sh.T)) + '.', 'Make sure the three terms share nothing more than ' + t(tx(G)) + ': for example, use a term that <b>is</b> ' + t(tx(G)) + ' (then the bracket has a ' + t('1') + ').'], 'write polynomial with GCF ' + tx(G),
              'Write a possible three-term polynomial with this GCF (one term must be ' + t(tx(sh.T)) + '), then factor it.');
            p.good = [[seq([sh.T, X(g, v, e), X(g * 3, v, e + 5)].sort(function () { return 0; })), null]].map(function () { var l = [sh.T, X(g * (sh.k === 3 ? 2 : 3), v, e + 4), X(-g, v, e)]; return [seq(l), gTex(G) + '(' + seq(l.map(function (m) { return divM(m, G); })) + ')']; });
            p.bad = [[seq([sh.T, X(g * sh.k * 2, v, e + 4), X(g * sh.k, v, e + 1)]), ''], [seq([X(g, v, e + 2), X(g, v, e + 1), X(g, v, e)]), gTex(G) + '(' + v + '^{2}+' + v + '+1)']];
            return p;
          } },
          { id: 'e8b', level: 'PRG', make: function (r, sh) {
            var G = sh.G, v = sh.v, g = sh.g, h = pickWhere(function () { return r.int(3, 15); }, function (x) { return x % g !== 0; }), Bt = X(h, v, sh.e + 3);
            return mcPart(r, 'Why can a polynomial whose GCF is ' + t(tx(G)) + ' never contain the term ' + t(tx(Bt)) + '?', [
              { html: t(tx(Bt) + '\\div ' + tx(G) + '=\\tfrac{' + h / gcd(h, g) + '}{' + g / gcd(h, g) + '}' + powTex(v, 3)) + ' — not a whole-number coefficient, so ' + t(tx(G)) + ' is not a factor of ' + t(tx(Bt)) + '.', right: true },
              { html: 'The exponent of ' + t(tx(Bt)) + ' is too high.', why: 'High powers are fine: ' + t(powTex(v, sh.e + 3)) + ' is divisible by ' + t(powTex(v, sh.e)) + '. Look at the coefficient.' },
              { html: 'Every term must have the same exponent as the GCF.', why: 'Terms can have higher powers — the GCF uses the <b>lowest</b>. The problem is the number ' + t(h) + '.' },
              { html: 'It could contain it — any term can be added.', why: 'The GCF divides <b>every</b> term exactly. Does ' + t(g) + ' divide ' + t(h) + '?' }],
              'The GCF must divide every term exactly. ' + t(h + '\\div ' + g) + ' is not a whole number, so ' + t(tx(G)) + ' does not divide ' + t(tx(Bt)) + ' and that term can’t be in such a polynomial.', ['Divide the term by the GCF.'], 'why a term cannot appear');
          } }] },
      { num: '9', stem: function (sh) { return 'Write a three-term polynomial whose GCF is ' + t(tx(sh.G)) + ', then factor it. (Check by expanding.)'; },
        shared: function (r) { var L = r.pick(PAIRS), g = r.int(2, 6); return { L: L, g: g, G: XY(-g, L[0], L[1], 1, 1) }; },
        parts: [
          { id: 'e9', level: 'ADV', make: function (r, sh) {
            var L = sh.L, a = L[0], b = L[1], g = sh.g, c = cop2(r, 2, 5), br = [X(c[0], a), X(-c[1], b), N(1)], terms = gl(sh.G, br);
            var key = [seq(terms), gTex(sh.G) + '(' + seq(br) + ')'];
            var p = writePolyPart(sh.G, null, 3, key,
              'For example ' + t(key[0] + '=' + key[1]) + '.<br>Check: ' + br.map(function (m) { return t(pg(sh.G) + '(' + tx(m) + ')=' + tx(PL.mul(sh.G, m))); }).join(', ') + ' ✓<br>The first term is negative and the terms share exactly ' + t(g + a + b) + ', so the GCF is ' + t(tx(sh.G)) + '.',
              ['Start with ' + t(tx(sh.G)) + ' times a bracket of three terms with no common factor, then expand. The first term must come out <b>negative</b>.', 'Including ' + t('1') + ' in the bracket keeps the GCF from getting bigger.'], 'write polynomial GCF ' + tx(sh.G), 'Polynomial and its factored form:');
            var l2 = gl(sh.G, [X(2, a, 2), XY(1, a, b, 1, 1), N(-1)]);
            p.good = [[seq(l2), gTex(sh.G) + '(2' + a + '^{2}+' + a + b + '-1)']];
            p.bad = [[seq(terms.map(function (m) { return PL.neg(m); })), ''], [seq(gl(XY(-2 * g, a, b, 1, 1), [X(1, a), X(1, b), N(1)])), '']];
            return p;
          } }] },
      /* ---------------- Part C ---------------- */
      { num: '10', section: 'Extra practice C — When the common factor is a whole bracket', stem: 'A common factor does not have to be a monomial: in ' + t('3x(x+2)+5(x+2)') + ' the bracket ' + t('(x+2)') + ' is in both terms, so ' + t('3x(x+2)+5(x+2)=(x+2)(3x+5)') + '. Factor each expression by removing the common binomial factor.', parts: [
        { id: 'e10a', level: 'EMG', make: function (r) { var v = 'x', a = r.int(2, 9), b = pickWhere(function () { return r.int(1, 9); }, function (x) { return gcd(a, x) === 1; }), k = r.int(1, 9), Xb = sum([V(v), N(-k)]); return binCommonPart(X(a, v), N(b), Xb, a + v + '(' + tx(Xb) + ')+' + (b === 1 ? '' : b) + '(' + tx(Xb) + ')'); } },
        { id: 'e10b', level: 'EMG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), a = r.int(2, 9), b = pickWhere(function () { return r.int(1, 9); }, function (x) { return gcd(a, x) === 1; }), k = r.int(1, 9), Xb = sum([V(v), N(k)]); return binCommonPart(X(a, v), N(-b), Xb, a + v + '(' + tx(Xb) + ')-' + (b === 1 ? '' : b) + '(' + tx(Xb) + ')'); } },
        { id: 'e10c', level: 'PRG', make: function (r) { var v = r.pick(['m', 'm', 'x', 'y']), a = r.int(2, 9), k = r.int(1, 9), Xb = sum([V(v), N(k)]); return binCommonPart(X(a, v), N(1), Xb, a + v + '(' + tx(Xb) + ')+(' + tx(Xb) + ')'); } },
        { id: 'e10d', level: 'EMG', make: function (r) { var v = 'x', o = pickWhere(function () { return { p: r.int(2, 5), q: r.int(1, 5), a: r.int(2, 9), b: r.int(1, 9) }; }, function (o) { return gcd(o.p, o.q) === 1 && gcd(o.a, o.b) === 1; }), Xb = sum([X(o.p, v), N(-o.q)]);
          return binCommonPart(X(o.a, v), N(-o.b), Xb, o.a + v + '(' + tx(Xb) + ')-' + (o.b === 1 ? '' : o.b) + '(' + tx(Xb) + ')'); } }] },
      { num: '11', stem: '<b>Factoring by grouping.</b> Split the four terms into two pairs, remove the GCF from each pair, and if the same bracket appears twice, remove <i>it</i>: ' + t('x^{3}+2x^{2}+3x+6=x^{2}(x+2)+3(x+2)=(x+2)(x^{2}+3)') + '. Use grouping to factor each polynomial.', parts: [
        { id: 'e11a', level: 'PRG', make: function (r) { var p = r.int(1, 9), q = r.int(1, 9); return grp([V('x'), N(p)], [V('x', 2), N(q)]); } },
        { id: 'e11b', level: 'PRG', make: function (r) { var p = r.int(1, 9), q = r.int(1, 9); return grp([V('x'), N(p)], [V('x', 2), N(q)]); } },
        { id: 'e11c', level: 'PRG', make: function (r) { var a = r.int(2, 5), p = r.int(1, 7), q = r.int(1, 9); if (gcd(a, p) !== 1) p = 1; return grp([X(a, 'x'), N(p)], [V('x', 2), N(q)]); } }] },
      { num: '12', stem: 'Group and factor. Watch the signs: when the third term is negative, the GCF you remove from the second pair must be negative too.', parts: [
        { id: 'e12a', level: 'PRG', make: function (r) { var p = r.int(1, 9), q = r.int(2, 9); return grp([V('x'), N(-p)], [V('x', 2), N(q)]); } },
        { id: 'e12b', level: 'ADV', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), p: r.int(1, 5), b: r.int(2, 3), q: r.int(2, 7) }; }, function (o) { return gcd(o.a, o.p) === 1 && !(isSq(o.b) && isSq(o.q)) && gcd(o.b, o.q) === 1; }); return grp([X(o.a, 'x'), N(-o.p)], [X(o.b, 'x', 2), N(-o.q)]); } },
        { id: 'e12c', level: 'PRG', make: function (r) { var p = r.int(1, 9), q = r.int(1, 9); return grpTwo(p, q); } },
        { id: 'e12d', level: 'ADV', make: function (r) { var o = pickWhere(function () { return { p: r.int(1, 7), b: r.int(2, 6), q: r.int(2, 7) }; }, function (o) { return !(isSq(o.b) && isSq(o.q)) && gcd(o.b, o.q) === 1; }); return grp([V('x'), N(o.p)], [X(o.b, 'x', 2), N(-o.q)]); } }] },
      { num: '13', stem: '<b>Stretch: brackets that look different but are not.</b> ' + t('(x-3)') + ' and ' + t('(3-x)') + ' are opposites: ' + t('3-x=-(x-3)') + '. Taking ' + t('-1') + ' out of one bracket turns it into the other, and a common factor appears. Factor each expression completely.', parts: [
        { id: 'e13a', level: 'ADV', make: function (r) { var v = 'x', a = r.int(2, 9), b = pickWhere(function () { return r.int(1, 9); }, function (x) { return gcd(a, x) === 1; }), k = r.int(1, 9); return oppPart(v, X(a, v), [V(v), N(-k)], -b); } },
        { id: 'e13b', level: 'ADV', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), a = r.int(2, 9), b = pickWhere(function () { return r.int(1, 9); }, function (x) { return gcd(a, x) === 1; }), k = r.int(1, 9); return oppPart(v, X(a, v), [V(v), N(-k)], b); } },
        { id: 'e13c', level: 'MAS', make: function (r) { var v = r.pick(['y', 'y', 'x', 'a']), o = pickWhere(function () { return { p: r.int(2, 5), q: r.int(1, 7), a: r.int(2, 9), b: r.int(1, 9) }; }, function (o) { return gcd(o.p, o.q) === 1 && gcd(o.a, o.b) === 1; }); return oppPart(v, X(o.a, v), [X(o.p, v), N(-o.q)], -o.b); } }] },
      /* ---------------- Part D ---------------- */
      { num: '14', section: 'Extra practice D — Applications and reasoning', stem: 'Each expression is the area of a rectangle. One side length is given; determine the other by removing that side as a factor.', parts: [
        { id: 'e14a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 5), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }), w = X(o.g, 'x'); return sidePart(gl(w, [X(o.c[0], 'x'), N(o.c[1])]), w); } },
        { id: 'e14b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }), w = X(o.g, 'x', 2); return sidePart(gl(w, [X(o.c[0], 'x'), N(-o.c[1])]), w); } },
        { id: 'e14c', level: 'EMG', make: function (r) { var L = r.pick(PAIRS), o = pickWhere(function () { return { g: r.int(2, 7), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 35; }), w = XY(o.g, L[0], L[1], 1, 1); return sidePart(gl(w, [X(o.c[0], L[0]), X(o.c[1], L[1])]), w); } }] },
      { num: '15', stem: function (sh) { return 'A rectangular garden has area ' + t('A=' + sh.Ttx) + ' square metres, where ' + t('x') + ' is a positive number of metres.'; },
        shared: function (r) { var o = pickWhere(function () { return { g: r.pick([2, 3]), k: r.int(2, 3), c: cop2(r, 2, 5), x: r.int(2, 7) }; }, function (o) { return o.g * o.k * Math.max(o.c[0], o.c[1]) <= 30; }), G = X(o.g * o.k, 'x'), br = [X(o.c[0], 'x'), N(o.c[1])], terms = gl(G, br);
          return { o: o, G: G, br: br, terms: terms, Ttx: seq(terms), half: gTex(X(o.g, 'x')) + '(' + seq(br.map(function (m) { return PL.scale(m, o.k); })) + ')' }; },
        parts: [
          { id: 'e15a1', sub: 'a i', level: 'EMG', make: function (r, sh) { return fp(sh.terms, { prompt: 'Factor ' + t('A') + ' completely to give the dimensions of the garden.', inBefore: t('A='), before: 'A=', wrong: [{ is: [X(sh.o.g, 'x'), sum(sh.br.map(function (m) { return PL.scale(m, sh.o.k); }))], code: 'not-greatest', hint: 'Equal — but the bracket still has a common factor of ' + t(sh.o.k) + '.' }] }); } },
          { id: 'e15a2', sub: 'a ii', level: 'EMG', make: function (r, sh) {
            return mcPart(r, 'Why is ' + t(sh.half) + ', although a true factoring, not the answer wanted?', [
              { html: 'Its bracket still has a common factor of ' + t(sh.o.k) + ', so ' + t(sh.o.g + 'x') + ' is common but not the <b>greatest</b> common factor — the factoring is not complete.', right: true },
              { html: 'It doesn’t expand back to ' + t(sh.Ttx) + '.', why: 'It does: ' + t(sh.half + '=' + sh.Ttx) + '. Look inside the bracket.' },
              { html: 'Dimensions can’t contain ' + t('x') + '.', why: 'Both factors contain ' + t('x') + ' in the correct answer too. The issue is the bracket.' },
              { html: 'The factor in front should be a number, not ' + t(sh.o.g + 'x') + '.', why: t('x') + ' is common to both terms, so it belongs in the GCF.' }],
              t(sh.half + '=' + sh.Ttx) + ' is true, but ' + t(seq(sh.br.map(function (m) { return PL.scale(m, sh.o.k); }))) + ' still has a common factor of ' + t(sh.o.k) + '. The complete factoring is ' + t(tx(sh.G) + '(' + seq(sh.br) + ')') + '.', [], 'why not complete');
          } },
          { id: 'e15b', level: 'EMG', make: function (r, sh) {
            var x = sh.o.x, d1 = PL.at(sh.G, { x: x }), d2 = PL.at(sum(sh.br), { x: x }), P = 2 * (d1 + d2);
            return KP.fields('Find the two dimensions and the perimeter of the garden when ' + t('x=' + x) + '.', [numField(t(tx(sh.G)), t('\\text{m}')), numField(t(seq(sh.br)), t('\\text{m}')), numField('Perimeter', t('\\text{m}'))],
              [K.number(d1), K.number(d2), K.number(P, function (v) { return v === d1 + d2 ? { code: 'value', hint: 'The perimeter goes all the way round: ' + t('2(' + d1 + '+' + d2 + ')') + '.' } : v === d1 * d2 ? { code: 'value', hint: 'That is the area. The perimeter is the distance around.' } : null; })], [String(d1), String(d2), String(P)],
              t(d1) + ' m, ' + t(d2) + ' m; perimeter ' + t(P) + ' m',
              t(tx(sh.G) + '=' + tx(sh.G).replace('x', '(' + x + ')') + '=' + d1) + ' m and ' + t(seq(sh.br).replace('x', '(' + x + ')') + '=' + d2) + ' m. Check the area: ' + t(d1 + '\\times ' + d2 + '=' + d1 * d2) + ' and ' + t(sh.Ttx.replace(/x\^\{2\}/, '(' + x + ')^{2}').replace(/x(?!\})/g, '(' + x + ')') + '=' + d1 * d2) + ' ✓.<br>Perimeter ' + t('=2(' + d1 + '+' + d2 + ')=' + P) + ' m.',
              ['Substitute ' + t('x=' + x) + ' into each factor.', 'Perimeter ' + t('=2(\\text{length}+\\text{width})') + '.'], 'garden at x=' + x);
          } }] },
      { num: '16', stem: function (sh) { return '<b>Is it finished?</b> A factoring is complete when the bracket has no common factor other than ' + t('1') + '.<br>(a) ' + t(sh.f[0].shown) + ' &nbsp; (b) ' + t(sh.f[1].shown) + ' &nbsp; (c) ' + t(sh.f[2].shown) + ' &nbsp; (d) ' + t(sh.f[3].shown); },
        shared: function (r) {
          var a = { g: r.int(2, 5), k: r.pick([2, 3, 4]), m: r.int(1, 3) }, b = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function () { return true; }), c = pickWhere(function () { return { g: r.int(2, 3), k: r.pick([2, 3]), c: cop2(r, 2, 5) }; }, function () { return true; }), d = { g: r.int(2, 6), c: cop2(r, 2, 7) };
          var vs = r.pick([['x', 'a', 'y', 'm'], ['x', 'a', 'y', 'm'], ['p', 'x', 'a', 'n']]);
          var f = [
            { G: X(a.g, vs[0]), br: [X(a.k, vs[0]), N(a.k * a.m * 2)], done: false },
            { G: X(b.g, vs[1], 2), br: [X(b.c[0], vs[1]), N(-b.c[1])], done: true },
            { G: X(c.g, vs[2]), br: [X(c.k * c.c[0], vs[2], 2), X(-c.k * c.c[1], vs[2])], done: false },
            { G: X(-d.g, vs[3]), br: [X(d.c[0], vs[3]), N(d.c[1])], done: true }];
          f.forEach(function (x) { x.shown = gTex(x.G) + '(' + seq(x.br) + ')'; x.terms = x.br.map(function (b2) { return PL.mul(x.G, b2); }); });
          return { f: f };
        },
        parts: [{ id: 'e16', sub: 'decide', level: 'EMG', make: function (r, sh) {
          var want = {}; sh.f.forEach(function (x, i) { want['abcd'[i]] = x.done ? 'yes' : 'no'; });
          return KP.grid('Decide whether each factoring is complete.', sh.f.map(function (x, i) { return { id: 'abcd'[i], html: '(' + 'abcd'[i] + ') ' + t(x.shown) }; }), [{ id: 'yes', html: 'complete' }, { id: 'no', html: 'not complete' }], want,
            { why: function (row) { var x = sh.f['abcd'.indexOf(row)]; return { code: 'row', hint: '(' + row + ') ' + (x.done ? 'The bracket ' + t(seq(x.br)) + ' has no common factor left.' : 'The bracket ' + t(seq(x.br)) + ' still has a common factor.') }; }, tries: 2 },
            sh.f.map(function (x, i) { return '(' + 'abcd'[i] + ') ' + (x.done ? '<b>complete</b>' : '<b>not complete</b>: ' + t(seq(x.br)) + ' still has a common factor'); }).join('<br>'), ['Look inside each bracket: is there still a common factor (a number or a letter)?'], 'which are complete');
        } }].concat(['a', 'b', 'c', 'd'].map(function (L, i) {
          return { id: 'e16' + L, sub: L, level: i === 1 || i === 3 ? 'BEG' : 'EMG', make: function (r, sh) { var x = sh.f[i]; return fp(x.terms, { prompt: '(' + L + ') Write ' + t(x.shown) + ' in completely factored form' + (x.done ? ' (if it is already complete, write it again).' : '.'), text: 'finish ' + plain(x.shown) }); } };
        })) },
      { num: '17', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e17', level: 'EMG', make: function (r) { var v = r.pick(['x', 'x', 'a', 'y', 'm']), a = r.int(2, 4), b = r.int(a + 2, 9);
          return mcPart(r, 'Why is the GCF of ' + t(v + '^{' + a + '}') + ' and ' + t(v + '^{' + b + '}') + ' equal to ' + t(v + '^{' + a + '}') + ' — the <b>lower</b> exponent — even though ' + t(v + '^{' + b + '}') + ' is larger?', [
            { html: 'A factor must divide <b>both</b> exactly. They share only ' + t(a) + ' factors of ' + t(v) + ', so ' + t(v + '^{' + a + '}') + ' divides both, but ' + t(v + '^{' + b + '}') + ' does not divide ' + t(v + '^{' + a + '}') + '.', right: true },
            { html: 'The GCF is always the smaller of the two expressions.', why: 'Not always — the GCF of ' + t('6x') + ' and ' + t('9x^{2}') + ' is ' + t('3x') + ', smaller than both. The point is what divides both.' },
            { html: 'Because you subtract the exponents: ' + t(b + '-' + a) + '.', why: 'Subtracting would give ' + t(v + '^{' + (b - a) + '}') + '. The GCF uses the <b>lowest</b> exponent that appears.' },
            { html: 'Because ' + t(v + '^{' + b + '}') + ' is too large to be a factor of anything.', why: t(v + '^{' + b + '}') + ' is a factor of itself — just not of ' + t(v + '^{' + a + '}') + '.' }],
            t(v + '^{' + a + '}=' + Array(a + 1).join(v + '\\cdot ').slice(0, -6)) + ' and ' + t(v + '^{' + b + '}=' + Array(b + 1).join(v + '\\cdot ').slice(0, -6)) + '. They share ' + t(a) + ' copies of ' + t(v) + ', so the common factor is ' + t(v + '^{' + a + '}') + '. The common part can never be bigger than the smaller expression.', [], 'why the lower exponent'); } }] },
      { num: '18', stem: 'Answer each.', parts: [
        { id: 'e18a', level: 'EMG', make: function (r) {
          var o = pickWhere(function () { return { g: r.pick([4, 6, 10, 10, 14]), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 50; }), v = r.pick(['x', 'x', 'a', 'y']), g = o.g, a = o.c[0], b = o.c[1];
          var poly = seq([X(-g * a, v, 3), X(g * b, v, 2)]), right = '-' + g + v + '^{2}(' + a + v + '-' + b + ')';
          return mcPart(r, '<i>(Multiple Choice)</i> Following the convention in this course, which is the complete factoring of ' + t(poly) + '?', [
            { html: t(right), right: true },
            { html: t(g + v + '^{2}(-' + a + v + '+' + b + ')'), why: 'Equal, but the first term is negative, so take out a <b>negative</b> GCF; then the bracket starts with a positive term.' },
            { html: t('-' + g / 2 + v + '^{2}(' + 2 * a + v + '-' + 2 * b + ')'), why: 'The bracket ' + t(2 * a + v + '-' + 2 * b) + ' still has a common factor of ' + t(2) + ': not the <b>greatest</b> common factor.' },
            { html: t('-' + g + v + '(' + a + v + '^{2}-' + b + v + ')'), why: 'The bracket still has a common factor of ' + t(v) + ': use the lowest power, ' + t(v + '^{2}') + '.' }],
            'The first term is negative; ' + t('\\gcd(' + g * a + ',' + g * b + ')=' + g) + ' and the lowest power is ' + t(v + '^{2}') + ', so the GCF is ' + t('-' + g + v + '^{2}') + ': ' + t(poly + '=' + right) + '.', ['Find the GCF (number, letters, sign), then check each option for a common factor left in the bracket.'], 'MC complete factoring with negative GCF');
        } },
        { id: 'e18b', level: 'PRG', make: function (r) {
          var g = r.pick([6, 8, 10, 12, 12, 9]), c = r.pick([[2, 3, 5], [3, 2, 4], [2, 5, 3], [4, 3, 5], [3, 4, 2]]), terms = gl(X(g, 'x', 2), [X(c[0], 'x', 2), X(-c[1], 'x'), N(c[2])]), ans = g + c[0] - c[1] + c[2];
          return KP.nr('<i>(Numerical Response)</i> When ' + t(seq(terms)) + ' is factored completely, the result has the form ' + t('ax^{2}(bx^{2}+cx+d)') + '. The value of ' + t('a+b+c+d') + ' is ________.', ans, function (v) {
            if (v === g + c[0] + c[1] + c[2]) return { code: 'c-sign', hint: 'Check the sign of ' + t('c') + ': the middle term is negative, so ' + t('c=-' + c[1]) + '.' };
            if (v === c[0] - c[1] + c[2]) return { code: 'nr-sum', hint: 'Include ' + t('a') + ', the GCF’s coefficient.' };
            return null;
          }, t(seq(terms) + '=' + g + 'x^{2}(' + c[0] + 'x^{2}-' + c[1] + 'x+' + c[2] + ')') + ', so ' + t('a+b+c+d=' + g + '+' + c[0] + '+(-' + c[1] + ')+' + c[2] + '=\\mathbf{' + ans + '}') + '.', ['Factor out the GCF, then read off each coefficient with its sign.'], 'NR a+b+c+d');
        } }] }
    ]
  });

  /* ---------- part makers that use the lesson tools above ---------- */
  function sidePart(terms, w) {
    var Ttx = seq(terms), br = terms.map(function (m) { return divM(m, w); }), B = sum(br);
    var ws = [];
    terms.forEach(function (m, i) { if (i && !PL.eq(m, br[i])) ws.push({ is: sum(br.map(function (b, j) { return j === i ? m : b; })), code: 'no-divide', hint: 'Divide <b>every</b> term of the area by the width: ' + t(pg(m) + '\\div ' + pg(w) + '=' + tx(br[i])) + '.' }); });
    if (Object.keys(vOf(w)).length) ws.push({ is: sum(br.map(function (b) { return PL.mul(b, M(1, vOf(w))); })), code: 'kept-var', hint: 'Divide the letters too: ' + t(pg(terms[0]) + '\\div ' + pg(w) + '=' + tx(br[0])) + '.' });
    var W = dedupW(B, ws);
    var p = KP.poly('Area ' + t('A=' + Ttx) + ', width ' + t(tx(w)) + '. Find the length.', B, { wrong: W.map(function (x) { return { is: x.p, code: x.code, hint: x.hint }; }) },
      'Remove the width as a factor: ' + t(Ttx + '=' + gTex(w) + '(' + seq(br) + ')') + ', so the length is ' + t('\\mathbf{' + seq(br) + '}') + '.<br>Check: ' + t(gTex(w) + '(' + seq(br) + ')=' + Ttx) + ' ✓',
      ['Area = length × width, so divide each term of the area by the width.', 'Check by multiplying your length by the width.'], 'other side of ' + plain(Ttx));
    p.bad = W.map(function (x) { return tx(x.p); });
    return p;
  }
  /* grouping from two factors: F1 = (a x + p) (or x + p), F2 = (b x² + q) */
  function grp(f1, f2) {
    var F1 = sum(f1), F2 = sum(f2), terms = [PL.mul(f2[0], f1[0]), PL.mul(f2[0], f1[1]), PL.mul(f2[1], f1[0]), PL.mul(f2[1], f1[1])];
    var shown = seq(terms), key = '(' + tx(F1) + ')(' + tx(F2) + ')';
    var p = groupPart(F1, F2, terms, { prompt: t(shown), sol: groupSol(terms, F1) });
    var g2 = gcfOf(terms.slice(2));
    p.bad = [key.replace('(' + tx(F2) + ')', '(' + tx(sum([f2[0], PL.neg(f2[1])])) + ')')];
    return p;
  }
  function grpTwo(p, q) { // ab + 3a + 2b + 6 = (b + 3)(a + 2)
    var F1 = sum([V('b'), N(p)]), F2 = sum([V('a'), N(q)]), terms = [M(1, { a: 1, b: 1 }), M(p, { a: 1 }), M(q, { b: 1 }), N(p * q)];
    var part = groupPart(F1, F2, terms, { prompt: t(seq(terms)), sol: 'Group in pairs: ' + t('(ab+' + p + 'a)+(' + q + 'b+' + p * q + ')') + '.<br>Take the GCF out of each pair: ' + t('a(b+' + p + ')+' + q + '(b+' + p + ')') + '.<br>Both brackets are ' + t('(b+' + p + ')') + ', so ' + t(seq(terms) + '=\\mathbf{(b+' + p + ')(a+' + q + ')}') + '.' });
    return part;
  }
  /* A·v·(X) ± b·(opposite of X): bracket list [v-term, -k] */
  function oppPart(v, Am, xb, b) {
    var Xp = sum(xb), Xo = PL.neg(Xp), Xt = tx(Xp), Ot = tx(Xo, { order: 'asc' });
    var B1 = Math.abs(b) === 1 ? '' : String(Math.abs(b)), shown = tx(Am) + '(' + Xt + ')' + (b < 0 ? '-' : '+') + B1 + '(' + Ot + ')';
    var In = sum([Am, N(-b)]), full = PL.mul(Xp, In);
    var ws = [{ is: [Xp, sum([Am, N(b)])], code: 'u4l2-opp-sign', hint: 'Turning ' + t('(' + Ot + ')') + ' into ' + t('(' + Xt + ')') + ' takes out a ' + t('-1') + ', so the sign in front of ' + t(Math.abs(b)) + ' changes: ' + t((b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + '(' + Ot + ')=' + (b < 0 ? '+' : '-') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + '(' + Xt + ')') + '.' }];
    var chk = convCheck(K.factored([Xp, In], { wrong: ws.map(function (w) { return { is: FA.product(w.is), code: w.code, hint: w.hint }; }) }), leadNeg(full));
    var key = '(' + Xt + ')(' + tx(In) + ')';
    var p = KP.math(t(shown), chk, key,
      t('(' + Ot + ')=-(' + Xt + ')') + ', so ' + t((b < 0 ? '-' : '+') + B1 + '(' + Ot + ')=' + (b < 0 ? '+' : '-') + B1 + '(' + Xt + ')') + '.<br>' + t(shown + '=' + tx(Am) + '(' + Xt + ')' + (b < 0 ? '+' : '-') + B1 + '(' + Xt + ')=\\mathbf{' + key + '}'),
      ['Write ' + t('(' + Ot + ')') + ' as ' + t('-(' + Xt + ')') + '. What happens to the sign in front of ' + t(Math.abs(b)) + '?', 'Then ' + t('(' + Xt + ')') + ' is a common factor of both terms.'], 'opposite brackets ' + plain(shown), { keys: 'poly', vars: [v], placeholder: 'e.g. (x - 3)(2x + 5)' });
    p.good = ['(' + tx(In) + ')(' + Xt + ')', '(' + Ot + ')(' + tx(PL.neg(In)) + ')'].filter(function () { return true; });
    p.good = [p.good[0]];
    p.bad = ['(' + Xt + ')(' + tx(sum([Am, N(b)])) + ')'];
    return p;
  }
})(window);
