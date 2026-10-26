/* Math 15 · Unit 4 · Lesson 1 — Multiplying and Factoring: The Reverse Relationship (AN5)
 * Assignment 1 (u4_L01.tex, Questions 1–13) and the Lesson 1 Extra Practice (u4_EP01.tex, Questions 1–18).
 * Every part is a generator that keeps the booklet question's structure (a multiplication fact read backwards, a GCF of
 * two numbers or monomials, a claimed factoring to check by expanding, a round trip expand → factor) and changes the
 * numbers; the booklet's own numbers are among the possible values. Keys are built from the factors, so the factored
 * key always expands to the question.
 * Math 15 sign convention (booklet Lesson 2): when the first term is negative, take out a negative common factor.
 * Conversions: "is it correct? if not, write the correct form" → a multiple-choice verdict (the options are the
 * expansions) plus the correct factored form; "explain" → multiple choice; "list the pairs" → number boxes;
 * area model → the area-box input; matching / sorting → a table of choices.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. The Extra Practice uses no trinomial factoring (taught in Lesson 3): its round
 * trips expand and check by substituting a number, its "incorrect" claims ask what the proposed form really expands to,
 * working backwards is ax(x + b) = Ax² + Bx, and the stretch (extra 18, MAS list) is every k giving 12x² + kx a GCF of 4x. */
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
    'not-subst': 'Substitution slip', 'gcf-lcm': 'Gave the LCM instead of the GCF', 'u4l1-pairs-half': 'Counted only the positive factor pairs',
    'u4l1-mid-sign': 'Expansion: middle term with the wrong sign', 'u4l1-last-sign': 'Expansion: constant term with the wrong sign', 'u4l1-g-twice': 'Multiplied the number in front into both brackets',
    'u4l1-gave-target': 'Gave the expression being checked instead of the real expansion', 'u4l1-ab-swap': 'Working backwards: a and b swapped',
    'u4l1-k-not-mult': 'GCF list: a k that is not a multiple of the GCF’s number', 'u4l1-k-gcf-big': 'GCF list: a k that makes the GCF larger', 'u4l1-k-range': 'GCF list: a k outside the allowed range',
    'u4l1-k-missing': 'GCF list: missed some values of k'
  });
  HW.addPartial({ 'gcf-lcm': 'n', 'u4l1-pairs-half': 'b', 'u4l1-mid-sign': 's', 'u4l1-last-sign': 's', 'u4l1-g-twice': 'b', 'u4l1-gave-target': 'n', 'u4l1-ab-swap': 's',
    'u4l1-k-not-mult': 'n', 'u4l1-k-gcf-big': 'b', 'u4l1-k-range': 's', 'u4l1-k-missing': 's' });

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
  function pickWhere(gen, test) { for (var i = 0; i < 4000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u4l1: pickWhere failed'); }
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

  /* ================= Lesson 1 generators ================= */
  var L1 = ['x', 'a', 'm', 'y', 'p', 't'];
  var PAIRS = [['a', 'b'], ['x', 'y'], ['m', 'n'], ['p', 'q']];
  function cop2(r, lo, hi) { return pickWhere(function () { return [r.int(lo, hi), r.int(lo, hi)]; }, function (p) { return p[0] !== p[1] && gcd(p[0], p[1]) === 1; }); }
  function setOf(r, o) {
    var g = r.pick(o.g), mu = o.mu, list = [];
    for (var i = 0; i < mu.length; i++) {
      var v = {};
      o.pres.forEach(function (row, j) { var rg = row[i]; if (rg) v[o.L[j]] = Array.isArray(rg) ? r.int(rg[0], rg[1]) : rg; });
      list.push(M(g * mu[i], v));
    }
    return list;
  }
  function setWhere(r, o, test) { return pickWhere(function () { return setOf(r, Object.assign({}, o, { mu: typeof o.mu === 'function' ? o.mu() : r.pick(o.mu) })); }, function (l) { return (!test || test(l)) && !PL.eq(l[0], l[1]); }); }
  function spread(list, x) { var e = list.map(function (m) { return vOf(m)[x] || 0; }); return Math.max.apply(null, e) !== Math.min.apply(null, e); }

  /* Question 1: read a multiplication fact backwards */
  function readBack(G, br, level) {
    var terms = br.map(function (b) { return PL.mul(G, b); }), prod = gTex(G) + '(' + seq(br) + ')';
    return factorPart(terms, { prompt: 'Since ' + t(prod + '=' + seq(terms)) + ', write the matching factoring fact.', inBefore: t(seq(terms) + '='),
      sol: 'Factoring runs the multiplication backwards: ' + t(prod + '=' + seq(terms)) + ', so ' + t(seq(terms) + '=\\mathbf{' + prod + '}') + '.',
      hints: ['The factored form is the product you started with in the multiplication fact.', 'Check: expanding your answer must give ' + t(seq(terms)) + '.'], text: 'read back ' + plain(prod) });
  }
  /* Question 2: GCF of two numbers */
  function gcfNumPart(g, m) {
    var a = g * m[0], b = g * m[1], l = a / g * b, pa = nt.primeList(a), pb = nt.primeList(b), com = [], bb = pb.slice();
    pa.forEach(function (p) { var i = bb.indexOf(p); if (i >= 0) { com.push(p); bb.splice(i, 1); } });
    var p = KP.number(t(a + ',\\ ' + b), g, function (v) {
      if (v === l) return { code: 'gcf-lcm', hint: t(l) + ' is a <b>multiple</b> of both numbers (the LCM). The GCF is the greatest number that <b>divides into</b> both.' };
      if (v > 0 && v < g && a % v === 0 && b % v === 0) return { code: 'not-greatest', hint: t(v) + ' divides both numbers, but it isn’t the <b>greatest</b> one that does. Try a bigger one.' };
      if (v > 0 && (a % v || b % v)) return { code: 'value', hint: t(v) + ' doesn’t divide ' + (a % v ? t(a) : t(b)) + ' evenly.' };
      return null;
    }, t(a + '=' + pa.join('\\times ')) + ', &nbsp;' + t(b + '=' + pb.join('\\times ')) + '.<br>Common primes: ' + t(com.join(',\\ ')) + ', so the GCF is ' + t((com.length > 1 ? com.join('\\times ') + '=' : '') + '\\mathbf{' + g + '}') + '.',
      ['Write each number as a product of primes, then multiply the primes that appear in <b>both</b> lists.', 'The GCF divides both numbers exactly.'], 'GCF of ' + a + ' and ' + b);
    return p;
  }
  function gcfNumGen(gs, ms) { return function (r) { var o = pickWhere(function () { return { g: r.pick(gs), m: r.pick(ms) }; }, function (o) { return o.g * Math.max(o.m[0], o.m[1]) <= 45; }); return gcfNumPart(o.g, o.m); }; }

  /* Question 6 / 13 claims */
  function claimXK(r, kind) {
    var g = r.int(2, 9), k = r.int(2, 9), truth = r.chance(0.5), k2 = truth ? k : wrongK(r, k);
    if (kind === 'xx') { var gx = M(g, { x: 1 }); return gcfClaim([M(g, { x: 2 }), M(g * k, { x: 1 })], gx, [V('x'), N(k2)], truth); }
    if (kind === 'ax') { var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 7), g: r.int(2, 6) }; }, function (o) { return gcd(o.a, o.b) === 1 && o.g * o.a <= 30; }), b2 = truth ? o.b : wrongK(r, o.b);
      return gcfClaim([M(o.g * o.a, { x: 1 }), N(o.g * o.b)], N(o.g), [M(o.a, { x: 1 }), N(b2)], truth); }
    return gcfClaim([M(g, { x: 1 }), N(g * k)], N(g), [V('x'), N(k2)], truth);
  }
  function claimQ(num, letter, kind, levels, section) {
    return { num: num, section: section, stem: function (sh) { return (letter ? '(' + letter + ') &nbsp;' : '') + 'Is ' + t(sh.Ttx + '=' + sh.claimTex) + ' correct? Expand to check; if it does not match, write the correct factored form.'; },
      shared: function (r) { return claimXK(r, kind); },
      parts: [
        { id: num + letter + '1', sub: (letter || '') + ' i', level: levels[0], make: function (r, sh) { return verdictPart(r, sh); } },
        { id: num + letter + '2', sub: (letter || '') + ' ii', level: levels[1], make: function (r, sh) { return correctFormPart(sh); } }] };
  }

  /* Extra practice: completeness claims (EP 6) */
  function compClaim(r, kind) {
    var o;
    if (kind === 'incomplete') { // 12x + 18 = 2(6x + 9)
      o = pickWhere(function () { return { g: r.pick([2, 3]), k: r.int(2, 4), a: r.int(2, 5), b: r.int(1, 7) }; }, function (o) { return gcd(o.a, o.b) === 1 && o.g * o.k * o.a <= 40 && o.g * o.k * o.b <= 45; });
      var G = o.g * o.k; return { terms: [M(G * o.a, { x: 1 }), N(G * o.b)], claimG: N(o.g), claimBr: [M(o.k * o.a, { x: 1 }), N(o.k * o.b)], type: 'incomplete' };
    }
    if (kind === 'wrong') { // 14x + 21 = 7(2x + 4)
      o = pickWhere(function () { return { g: r.int(3, 9), a: r.int(2, 5), b: r.int(1, 7) }; }, function (o) { return gcd(o.a, o.b) === 1 && o.g * o.a <= 40; });
      var b2 = wrongK(r, o.b); return { terms: [M(o.g * o.a, { x: 1 }), N(o.g * o.b)], claimG: N(o.g), claimBr: [M(o.a, { x: 1 }), N(b2)], type: 'wrong' };
    }
    if (kind === 'xsq') { // 10x² − 15x = 5x(2x − 3)
      o = pickWhere(function () { return { g: r.int(2, 7), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 40; });
      var gx = M(o.g, { x: 1 }); return { terms: [M(o.g * o.c[0], { x: 2 }), M(-o.g * o.c[1], { x: 1 })], claimG: gx, claimBr: [M(o.c[0], { x: 1 }), N(-o.c[1])], type: 'ok' };
    }
    o = pickWhere(function () { return { g: r.int(2, 5), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); // 4x³ + 6x² = 2x²(2x + 3)
    var g2 = M(o.g, { x: 2 }); return { terms: [M(o.g * o.c[0], { x: 3 }), M(o.g * o.c[1], { x: 2 })], claimG: g2, claimBr: [M(o.c[0], { x: 1 }), N(o.c[1])], type: 'ok' };
  }
  function compVerdict(r, c) {
    var claimTex = gTex(c.claimG) + '(' + seq(c.claimBr) + ')', E = PL.mul(c.claimG, sum(c.claimBr)), Ttx = seq(c.terms), G = gcfOf(c.terms);
    var fo = sum([PL.mul(c.claimG, c.claimBr[0])].concat(c.claimBr.slice(1)));
    return mcPart(r, 'Is ' + t(Ttx + '=' + claimTex) + '? Expand to check, and decide whether it is completely factored.', [
      { html: 'Correct, and completely factored.', right: c.type === 'ok', why: c.type === 'wrong' ? 'Expand it: ' + t(claimTex + '=' + tx(E)) + ', not ' + t(Ttx) + '.' : 'It expands back correctly, but look inside the bracket: ' + t(seq(c.claimBr)) + ' still has a common factor, so ' + t(tx(c.claimG)) + ' is not the GCF.' },
      { html: 'It expands back correctly, but it is <b>not</b> completely factored.', right: c.type === 'incomplete', why: c.type === 'wrong' ? 'It doesn’t even expand back: ' + t(claimTex + '=' + tx(E)) + '.' : 'The bracket ' + t(seq(c.claimBr)) + ' has no common factor left, and the factor in front is the GCF ' + t(tx(G)) + '.' },
      { html: '<b>Incorrect:</b> ' + t(claimTex + '=' + tx(c.type === 'wrong' ? E : fo)), right: c.type === 'wrong', why: c.type === 'wrong' ? null : 'Multiply the factor by <b>every</b> term in the bracket: ' + t(claimTex + '=' + Ttx) + '.' }],
      'Expand: ' + t(claimTex + '=' + tx(E)) + '. ' + (c.type === 'wrong' ? 'That is not ' + t(Ttx) + ', so it is <b>incorrect</b>.' : c.type === 'incomplete' ? 'That matches, but the bracket ' + t(seq(c.claimBr)) + ' still has a common factor, so it is <b>not complete</b>: the GCF is ' + t(tx(G)) + '.' : 'That matches, and the bracket has no common factor left: <b>correct and complete</b>.'),
      ['Expand first. If it matches, check whether the bracket still has a common factor.'], 'complete? ' + plain(Ttx + '=' + claimTex), true);
  }

  /* Extra practice 9: matching table */
  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  /* Extra practice 10: sorting table */
  function sortRows(r) {
    var p = r.int(2, 7), q = pickWhere(function () { return r.int(2, 9); }, function (v) { return v !== p; }), k = r.int(2, 5), m = r.int(2, 7), n = r.int(3, 9);
    var s1 = spec({ p: p, q: q }), s2 = spec({ p: r.int(1, 4), q: r.int(5, 9) });
    return [
      { id: 'a', tex: s1.key, kind: 'fac', why: 'It is one product of two brackets.' },
      { id: 'b', tex: tx(s2.full), kind: 'exp', why: 'It is a sum of single terms, all multiplied out.' },
      { id: 'c', tex: k + '(x^{2}+' + m + 'x)', kind: 'nei', why: 'It is a product, but the bracket ' + t('x^{2}+' + m + 'x') + ' still has the common factor ' + t('x') + ', so the factoring is unfinished.' },
      { id: 'd', tex: k + 'x(x+' + m + ')', kind: 'fac', why: 'It is a single product, and the bracket has no common factor left.' },
      { id: 'e', tex: k + 'x^{2}+' + (k * m) + 'x', kind: 'exp', why: 'It is a sum of single terms.' },
      { id: 'f', tex: 'x(x+' + p + ')+' + q + '(x+' + p + ')', kind: 'nei', why: 'It is a <b>sum</b> of two products, not a single product (it becomes ' + t('(x+' + p + ')(x+' + q + ')') + ').' },
      { id: 'g', tex: k + '(x+' + p + ')(x+' + q + ')', kind: 'fac', why: 'It is one product of three factors.' },
      { id: 'h', tex: 'x^{2}-' + (n * n), kind: 'exp', why: 'It is a difference of single terms, all multiplied out.' }];
  }

  HW.defineLesson({
    id: 'u4l1', unit: 4, num: '1', title: 'Multiplying and Factoring: The Reverse Relationship', outcome: 'AN5',
    blurb: 'Factoring is multiplying run backwards: find the greatest common factor, divide, write, and check by expanding.',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A — From Multiplying to Factoring', stem: 'Each multiplication fact is done for you. Use it to write the matching factoring fact.', parts: [
        { id: '1a', level: 'LIM', make: function (r) { return readBack(N(r.int(2, 9)), [V('x'), N(r.int(1, 9))]); } },
        { id: '1b', level: 'LIM', make: function (r) { var v = r.pick(['y', 'y', 'a', 'm', 't']); return readBack(N(r.int(2, 9)), [V(v), N(-r.int(1, 9))]); } },
        { id: '1c', level: 'LIM', make: function (r) { var v = r.pick(['x', 'x', 'a', 'y', 'm']); return readBack(V(v), [V(v), N(r.int(2, 12))]); } },
        { id: '1d', level: 'BEG', make: function (r) { return readBack(M(r.int(2, 6), { x: 1 }), [V('x'), N(-r.int(1, 9))]); } },
        { id: '1e', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 9), a: r.int(2, 5), b: r.pick([1, 1, 3, 5, 7]) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return readBack(N(o.g), [M(o.a, { x: 1 }), N(o.b)]); } },
        { id: '1f', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 5), a: r.int(2, 5), b: r.int(1, 7) }; }, function (o) { return gcd(o.a, o.b) === 1; }); return readBack(M(o.g, { x: 1 }), [M(o.a, { x: 1 }), N(o.b)]); } }] },
      /* ---------------- Part B ---------------- */
      { num: '2', section: 'Part B — Greatest Common Factors', stem: 'State the greatest common factor of each pair of numbers.', parts: [
        { id: '2a', level: 'LIM', outcome: '', make: gcfNumGen([2, 3, 4, 5, 6], [[2, 3], [3, 4], [2, 5], [3, 5], [3, 2]]) },
        { id: '2b', level: 'LIM', outcome: '', make: gcfNumGen([3, 4, 5, 6, 7], [[3, 4], [2, 3], [3, 5], [4, 5]]) },
        { id: '2c', level: 'LIM', outcome: '', make: gcfNumGen([2, 3, 4, 5], [[3, 7], [2, 7], [5, 7], [2, 9], [4, 7], [7, 3], [7, 2], [4, 9], [3, 8]]) },
        { id: '2d', level: 'BEG', outcome: '', make: gcfNumGen([4, 5, 6, 7, 8], [[2, 5], [3, 5], [2, 3], [3, 4], [5, 2], [5, 3]]) },
        { id: '2e', level: 'BEG', outcome: '', make: gcfNumGen([6, 7, 8, 9, 10, 12], [[2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2]]) },
        { id: '2f', level: 'BEG', outcome: '', make: gcfNumGen([6, 8, 9, 10, 12, 15], [[2, 3], [3, 2], [3, 4], [2, 5], [3, 5]]) }] },
      { num: '3', stem: function (sh) { return 'Consider the monomials ' + t(tx(sh.m[0])) + ' and ' + t(tx(sh.m[1])) + '.'; },
        shared: function (r) {
          return pickWhere(function () { var g = r.int(2, 6), m = r.pick([[2, 3], [3, 2], [3, 4], [2, 5], [4, 3], [3, 5]]), e = r.sample([1, 2, 3, 4], 2), v = r.pick(['x', 'x', 'a', 'y', 'm']);
            var o1 = {}, o2 = {}; o1[v] = e[0]; o2[v] = e[1]; return { m: [M(g * m[0], o1), M(g * m[1], o2)] }; },
          function (s) { return cv(s.m[0]) <= 40 && cv(s.m[1]) <= 40; });
        },
        parts: [
          { id: '3a', level: 'BEG', make: function (r, sh) { return primeFields(sh.m); } },
          { id: '3b', level: 'BEG', make: function (r, sh) { var p = gcfPart(sh.m, { prompt: 'Use the prime factorizations to determine the greatest common factor of ' + t(tx(sh.m[0])) + ' and ' + t(tx(sh.m[1])) + '.' }); p.solution = commonPrimeSol(sh.m, gcfOf(sh.m)); return p; } }] },
      { num: '4', stem: 'State the greatest common factor of each set of monomials by inspection.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { var e = r.pick([[1, 2], [2, 1], [1, 3]]); return gcfPart(setWhere(r, { g: [2, 3, 4, 5], mu: [[2, 3], [3, 2], [2, 5], [3, 4], [4, 5]], L: [r.pick(L1)], pres: [e] }, function (l) { return cv(l[1]) <= 40 && cv(l[0]) <= 40; })); } },
        { id: '4b', level: 'BEG', make: function (r) { var e = r.pick([[2, 1], [3, 1], [3, 2], [2, 3]]); return gcfPart(setWhere(r, { g: [2, 3, 4, 5], mu: [[2, 3], [3, 4], [2, 5], [4, 3]], L: [r.pick(L1)], pres: [e] }, function (l) { return cv(l[1]) <= 40 && cv(l[0]) <= 40; })); } },
        { id: '4c', level: 'EMG', make: function (r) { var L = r.pick(PAIRS), a = r.pick([[2, 1], [1, 2], [3, 1]]), b = r.pick([[1, 2], [2, 1], [1, 3]]); return gcfPart(setWhere(r, { g: [2, 3, 4], mu: [[2, 3], [3, 2], [2, 5], [3, 4]], L: L, pres: [a, b] })); } },
        { id: '4d', level: 'BEG', make: function (r) { var e = r.pick([[3, 2], [2, 3], [4, 2], [3, 1], [4, 3]]); return gcfPart(setWhere(r, { g: [4, 5, 6, 7], mu: [[2, 3], [3, 2], [3, 4]], L: [r.pick(L1)], pres: [e] }, function (l) { return cv(l[1]) <= 40 && cv(l[0]) <= 40; })); } },
        { id: '4e', level: 'EMG', make: function (r) { var L = r.pick(PAIRS), a = r.pick([[1, 2], [2, 1]]), b = r.pick([[2, 1], [1, 2]]); return gcfPart(setWhere(r, { g: [3, 4, 5, 6, 7, 8, 9], mu: [[1, 3], [1, 2], [1, 4], [3, 1], [2, 1]], L: L, pres: [a, b] }, function (l) { return spread(l, L[0]) && cv(l[0]) <= 40 && cv(l[1]) <= 40; })); } },
        { id: '4f', level: 'EMG', make: function (r) { var L = r.pick(PAIRS), a = r.pick([[2, 1], [1, 2], [2, 3]]), b = r.pick([[2, 3], [3, 2], [1, 2]]); return gcfPart(setWhere(r, { g: [2, 3, 4], mu: [[2, 5], [2, 3], [3, 4], [3, 5]], L: L, pres: [a, b] }, function (l) { return cv(l[1]) <= 40 && cv(l[0]) <= 40; })); } }] },
      /* ---------------- Part C ---------------- */
      { num: '5', section: 'Part C — Factoring and Checking', stem: 'Complete the factoring in each case.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 9), c: cop2(r, 2, 7) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 45; }), B = sum([M(o.c[0], { x: 1 }), N(o.c[1])]); return frontPart(PL.mul(N(o.g), B), N(o.g), B); } },
        { id: '5b', level: 'EMG', make: function (r) { var v = r.pick(['a', 'a', 'x', 'm']), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }), B = sum([M(o.c[0], { [v]: 1 }), N(-o.c[1])]), G = M(o.g, { [v]: 1 }); return frontPart(PL.mul(G, B), G, B); } },
        { id: '5c', level: 'EMG', make: function (r) { var L = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }), B = sum([M(o.c[0], { [L[1]]: 1 }), N(o.c[1])]), G = M(o.g, { [L[0]]: 1 }); return frontPart(PL.mul(G, B), G, B); } },
        { id: '5d', level: 'BEG', make: function (r) { var v = r.pick(['m', 'm', 'x', 'a']), g = r.int(2, 6), a = r.int(2, 5), b = r.int(2, 5), B = sum([M(a, { [v]: 2 }), M(b, { [v]: 1 }), N(1)]); return frontPart(PL.mul(N(g), B), N(g), B); } }] },
      claimQ('6', 'a', 'xk', ['BEG', 'BEG']),
      claimQ('6', 'b', 'xk', ['BEG', 'BEG']),
      claimQ('6', 'c', 'xx', ['BEG', 'EMG']),
      claimQ('6', 'd', 'ax', ['BEG', 'EMG']),
      { num: '7', stem: 'Factor each expression completely, and verify your answer by expanding it back out.', parts: [
        { id: '7a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 9), a: r.int(2, 5), b: r.int(1, 9) }; }, function (o) { return gcd(o.a, o.b) === 1 && o.g * Math.max(o.a, o.b) <= 45; }); return factorPart([M(o.g * o.a, { x: 1 }), N(o.g * o.b)], { verify: true }); } },
        { id: '7b', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 9), a: r.int(2, 5), b: r.int(3, 9) }; }, function (o) { return gcd(o.a, o.b) === 1 && o.g * Math.max(o.a, o.b) <= 50; }); return factorPart([M(o.g * o.a, { x: 1 }), N(o.g * o.b)], { verify: true }); } },
        { id: '7c', level: 'EMG', make: function (r) { var g = r.int(2, 9), k = r.int(2, 9); return factorPart([M(g, { x: 2 }), M(g * k, { x: 1 })], { verify: true }); } },
        { id: '7d', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return factorPart([M(o.g * o.c[0], { x: 2 }), M(o.g * o.c[1], { x: 1 })], { verify: true }); } }] },
      /* ---------------- Part D ---------------- */
      { num: '8', section: 'Part D — Applications, Errors and Review', stem: function (sh) { return 'The cost, in dollars, of manufacturing ' + t('x') + ' items is given by ' + t('C=' + sh.g + 'x+' + sh.g * sh.k) + '.'; },
        shared: function (r) { return { g: r.int(2, 9), k: r.int(2, 9), x: r.int(4, 12) }; },
        parts: [
          { id: '8a', level: 'BEG', make: function (r, sh) { return factorPart([M(sh.g, { x: 1 }), N(sh.g * sh.k)], { prompt: 'Factor ' + t('C') + ' completely.', inBefore: t('C='), before: 'C=', text: 'factor C' }); } },
          { id: '8b', level: 'LIM', make: function (r, sh) {
            var T = sum([M(sh.g, { x: 1 }), N(sh.g * sh.k)]);
            var p = KP.poly('Verify your factoring: expand ' + t(sh.g + '(x+' + sh.k + ')') + '.', T, { wrong: [{ is: sum([M(sh.g, { x: 1 }), N(sh.k)]), code: 'first-only', hint: 'Multiply ' + t(sh.g) + ' by <b>both</b> terms in the bracket: ' + t(sh.g + '\\times ' + sh.k + '=' + sh.g * sh.k) + '.' }] },
              t(sh.g + '(x+' + sh.k + ')=' + sh.g + 'x+' + sh.g * sh.k) + ' — exactly ' + t('C') + ' ✓, so the factoring is right.', ['Multiply ' + t(sh.g) + ' by each term in the bracket.'], 'expand ' + sh.g + '(x+' + sh.k + ')');
            p.bad = [sh.g + 'x+' + sh.k]; return p;
          } },
          { id: '8c', level: 'BEG', make: function (r, sh) {
            var C = sh.g * (sh.x + sh.k);
            return KP.number('Use the factored form to find the cost when ' + t('x=' + sh.x) + '.', C, function (v) {
              if (v === sh.g * sh.x + sh.k) return { code: 'first-only', hint: 'Work out the bracket first: ' + t(sh.x + '+' + sh.k + '=' + (sh.x + sh.k)) + ', then multiply by ' + t(sh.g) + '.' };
              if (v === sh.x + sh.k) return { code: 'value', hint: 'Don’t forget to multiply the bracket by ' + t(sh.g) + '.' };
              return null;
            }, t('C=' + sh.g + '(x+' + sh.k + ')=' + sh.g + '(' + sh.x + '+' + sh.k + ')=' + sh.g + '(' + (sh.x + sh.k) + ')=\\mathbf{' + C + '}') + ', so the cost is $' + C + '.',
            ['Substitute ' + t('x=' + sh.x) + ' into ' + t(sh.g + '(x+' + sh.k + ')') + ': bracket first, then multiply.'], 'cost at x=' + sh.x, { before: t('\\$') });
          } }] },
      { num: '9', stem: function (sh) { return 'A student factored ' + t(sh.Ttx) + ' as ' + t(sh.claimTex) + '.'; },
        shared: function (r) { var o = pickWhere(function () { return { g: r.int(2, 5), a: r.int(2, 5), b: r.int(1, 7) }; }, function (o) { return gcd(o.a, o.b) === 1 && o.g * o.a <= 25 && o.g * o.b <= 35; });
          var c = gcfClaim([M(o.g * o.a, { x: 1 }), N(o.g * o.b)], N(o.g), [M(o.a, { x: 1 }), N(o.g * o.b)], false); c.o = o; return c; },
        parts: [
          { id: '9a', level: 'BEG', make: function (r, sh) { var o = sh.o, gb = o.g * o.b;
            return mcPart(r, 'Identify the mistake.', [
              { html: 'The second term was not divided by ' + t(o.g) + ': ' + t(gb + '\\div ' + o.g + '=' + o.b) + ', not ' + t(gb) + '.', right: true },
              { html: 'The first term was not divided by ' + t(o.g) + '.', why: t(o.g * o.a + 'x\\div ' + o.g + '=' + o.a + 'x') + ' — the first term is right. Expand the student’s answer: ' + t(sh.claimTex + '=' + tx(sh.E)) + '.' },
              { html: t(o.g) + ' is not the greatest common factor.', why: t('\\gcd(' + o.g * o.a + ',' + gb + ')=' + o.g) + ', so the factor in front is right. Look at the bracket.' },
              { html: 'There is no mistake.', why: 'Expand it: ' + t(sh.claimTex + '=' + tx(sh.E)) + ', not ' + t(sh.Ttx) + '.' }],
              'Expanding the student’s answer gives ' + t(sh.claimTex + '=' + tx(sh.E)) + ', not ' + t(sh.Ttx) + '. The student divided the first term by ' + t(o.g) + ' but not the second: ' + t(gb + '\\div ' + o.g + '=' + o.b) + '.', ['Expand the student’s answer and compare it with ' + t(sh.Ttx) + '.'], 'mistake: second term not divided'); } },
          { id: '9b', level: 'BEG', make: function (r, sh) { return correctFormPart(sh, { prompt: 'Write the correct factored form of ' + t(sh.Ttx) + '.' }); } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'BEG', make: function (r) {
          var o = pickWhere(function () { return { g: r.pick([4, 4, 6, 8, 10]), a: r.int(2, 5), b: r.int(1, 7) }; }, function (o) { return gcd(o.a, o.b) === 1 && o.a !== o.b && o.g * o.a <= 40 && o.g * o.b <= 50; });
          var g = o.g, A = g * o.a, Bn = g * o.b, h = g / 2, poly = A + 'x+' + Bn;
          return mcPart(r, 'Which expression shows ' + t(poly) + ' factored completely, using the greatest common factor?', [
            { html: t(g + '(' + o.a + 'x+' + o.b + ')'), right: true },
            { html: t(h + '(' + 2 * o.a + 'x+' + 2 * o.b + ')'), why: 'It expands back correctly, but ' + t(2 * o.a + 'x+' + 2 * o.b) + ' still has a common factor of ' + t(2) + ': ' + t(h) + ' is not the <b>greatest</b> common factor.' },
            { html: t(g + '(' + o.a + 'x+' + Bn + ')'), why: 'Expand it: ' + t(g + '\\times ' + Bn + '=' + g * Bn) + '. The second term must be divided by ' + t(g) + ' too.' },
            { html: t(g + 'x+' + o.b), why: 'That isn’t a product at all — and it is not equal to ' + t(poly) + '.' }],
            t('\\gcd(' + A + ',' + Bn + ')=' + g) + ', so ' + t(poly + '=' + g + '(' + o.a + 'x+' + o.b + ')') + '. Check: ' + t(g + '(' + o.a + 'x+' + o.b + ')=' + poly) + ' ✓',
            ['Find the GCF of the two terms, divide each term by it, and expand each option to check.'], 'MC complete factoring of ' + poly);
        } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var o = pickWhere(function () { return { g: r.int(2, 9), b: r.int(2, 5), c: r.int(1, 7) }; }, function (o) { return gcd(o.b, o.c) === 1 && o.g * o.b <= 40 && o.g * o.c <= 50; });
          var A = o.g * o.b, C = o.g * o.c, ans = o.g + o.b + o.c;
          return KP.nr('When ' + t(A + 'x+' + C) + ' is factored completely by removing the GCF, the result can be written as ' + t('a(bx+c)') + '. The value of ' + t('a+b+c') + ' is ________.', ans, function (v) {
            if (v === o.b + o.c) return { code: 'nr-sum', hint: 'That is ' + t('b+c') + '. Add ' + t('a') + ', the GCF, as well.' };
            if (o.g % 2 === 0 && v === o.g / 2 + 2 * o.b + 2 * o.c) return { code: 'not-greatest', hint: t(o.g / 2) + ' is a common factor, but not the <b>greatest</b>.' };
            return null;
          }, t('\\gcd(' + A + ',' + C + ')=' + o.g) + ', so ' + t(A + 'x+' + C + '=' + o.g + '(' + o.b + 'x+' + o.c + ')') + ': ' + t('a=' + o.g + ',\\ b=' + o.b + ',\\ c=' + o.c) + '.<br>' + t('a+b+c=' + o.g + '+' + o.b + '+' + o.c + '=\\mathbf{' + ans + '}'),
          ['Factor out the GCF, then read off ' + t('a') + ', ' + t('b') + ' and ' + t('c') + '.'], 'NR a+b+c for ' + A + 'x+' + C);
        } }] },
      { num: '12', stem: 'Factor each expression completely, and verify your answer by expanding it back out.', parts: [
        { id: '12a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 5), c: cop2(r, 2, 7) }; }, function (o) { return o.c[0] < o.c[1] && o.g * o.c[1] <= 35; }); return factorPart([M(o.g * o.c[0], { x: 2 }), M(o.g * o.c[1], { x: 1 })], { verify: true }); } },
        { id: '12b', level: 'PRG', make: function (r) { var L = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]), o = pickWhere(function () { return { g: r.int(2, 7), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 35; });
          return factorPart([M(o.g * o.c[0], { [L[0]]: 2, [L[1]]: 1 }), M(o.g * o.c[1], { [L[0]]: 1, [L[1]]: 2 })], { verify: true }); } },
        { id: '12c', level: 'PRG', make: function (r) { var v = r.pick(['m', 'm', 'x', 'a']), o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5), e: r.int(2, 3) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; });
          return factorPart([M(o.g * o.c[0], { [v]: o.e + 1 }), M(-o.g * o.c[1], { [v]: o.e })], { verify: true }); } }] },
      { num: '13', stem: function (sh) { return 'Checking a factoring. Consider the claim ' + t(sh.Ttx + '=' + sh.claimTex) + '.'; },
        shared: function (r) { return claimXK(r, 'xk'); },
        parts: [
          { id: '13a', level: 'EMG', make: function (r, sh) {
            return mcPart(r, 'Why is expanding the factored form a good way to check a factoring?', [
              { html: 'Factoring and expanding are reverses of each other, so expanding a correct factored form must give back the original expression <b>exactly</b>.', right: true },
              { html: 'Expanding always gives a simpler expression than the original.', why: 'Expanding gives back the original expression — no simpler, no harder. That is why it works as a check.' },
              { html: 'If the first terms match, the whole factoring must be correct.', why: 'Every term has to match. For example ' + t('7(x+2)') + ' and ' + t('7(x+3)') + ' both start with ' + t('7x') + '.' },
              { html: 'Expanding finds the greatest common factor for you.', why: 'Expanding multiplies the factors back out; it doesn’t find the GCF. It tells you whether the factored form is <b>equal</b> to the original.' }],
              'Expanding undoes factoring. If ' + t('(\\text{factor})(\\text{bracket})') + ' multiplies back to the original exactly, the factoring is correct; if any term is different, it is not.', [], 'why expanding checks');
          } },
          { id: '13b', level: 'BEG', make: function (r, sh) { return verdictPart(r, sh); } },
          { id: '13c', level: 'BEG', make: function (r, sh) { return correctFormPart(sh); } }] }
    ],
    extra: [
      /* ---------------- Part A — Round trips ---------------- */
      { num: '1', section: 'Extra practice A — Round trips: expand, factor, and check', stem: 'Expand each product. Then check your expansion by substituting ' + t('x=2') + ' into both the product and your expanded answer — the two values must match.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return [r.int(1, 6), r.int(2, 9)]; }, function (o) { return o[0] < o[1]; }); return expandPart(spec({ p: o[0], q: o[1] }), 2); } },
        { id: 'e1b', level: 'BEG', make: function (r) { var o = pickWhere(function () { return [r.int(1, 4), r.int(5, 12)]; }, function (o) { return o[0] * o[1] <= 60; }); return expandPart(spec({ p: o[0], q: o[1] }), 2); } },
        { id: 'e1c', level: 'BEG', make: function (r) { var o = pickWhere(function () { return [r.int(2, 6), r.int(3, 9)]; }, function (o) { return o[0] < o[1]; }); return expandPart(spec({ p: -o[0], q: -o[1] }), 2); } },
        { id: 'e1d', level: 'EMG', make: function (r) { var o = pickWhere(function () { return [r.int(3, 9), r.int(1, 8)]; }, function (o) { return o[0] !== o[1]; }); return expandPart(spec({ p: o[0], q: -o[1] }), 2); } }] },
      { num: '2', stem: function (sh) { return 'Expand each product, then factor the result <b>completely</b>. In one of these four, the starting form was not completely factored — find it.<br>(a) ' + t(sh.f[0].shown) + ' &nbsp; (b) ' + t(sh.f[1].shown) + ' &nbsp; (c) ' + t(sh.f[2].shown) + ' &nbsp; (d) ' + t(sh.f[3].shown); },
        shared: function (r) {
          var a = pickWhere(function () { return { g: r.int(2, 7), c: cop2(r, 2, 7) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 35; });
          var b = { g: r.int(2, 6), k: r.int(2, 9) }, c = pickWhere(function () { return { g: r.int(2, 5), c: cop2(r, 2, 9) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 40; }), d = { g: r.int(2, 9), k: r.int(2, 9) };
          var f = [
            { G: N(a.g), br: [M(a.c[0], { x: 1 }), N(a.c[1])] },
            { G: M(b.g, { x: 1 }), br: [V('x'), N(-b.k)] },
            { G: M(c.g, { x: 1 }), br: [M(c.c[0], { x: 1 }), N(c.c[1])] },
            { G: N(d.g), br: [V('x', 2), M(-d.k, { x: 1 })] }];
          f.forEach(function (x) { x.shown = gTex(x.G) + '(' + seq(x.br) + ')'; x.terms = x.br.map(function (b2) { return PL.mul(x.G, b2); }); });
          return { f: f };
        },
        parts: ['a', 'b', 'c', 'd'].map(function (L, i) {
          return { id: 'e2' + L, sub: L, level: i === 3 ? 'EMG' : 'BEG', make: function (r, sh) { return expandFactorPart(sh.f[i], '(' + L + ') '); } };
        }).concat([{ id: 'e2e', sub: 'e', level: 'EMG', make: function (r, sh) {
          return mcPart(r, 'Which starting form was <b>not</b> completely factored?', sh.f.map(function (x, i) { return { html: '(' + 'abcd'[i] + ') ' + t(x.shown), right: i === 3, why: i === 3 ? null : 'The bracket ' + t(seq(x.br)) + ' has no common factor left, so this one was complete.' }; }),
            'In (d), the bracket ' + t(seq(sh.f[3].br)) + ' still has a common factor of ' + t('x') + ': ' + t(sh.f[3].shown + '=' + tx(sum(sh.f[3].terms)) + '=' + gTex(gcfOf(sh.f[3].terms)) + '(' + seq(sh.f[3].terms.map(function (m) { return divM(m, gcfOf(sh.f[3].terms)); })) + ')') + '.', ['Look inside each bracket: does it still have a common factor?'], 'which was incomplete', true);
        } }]) },
      { num: '3', stem: 'Now run the trip the other way. Factor each expression, then expand your factored form to verify it reproduces the original exactly.', parts: [
        { id: 'e3a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return factorPart([M(o.g * o.c[0], { x: 2 }), M(o.g * o.c[1], { x: 1 })], { verify: true }); } },
        /* (b) A x² − B x and (c) A x³ + B x² with GCF g x²: GCF factoring only (trinomials are Lesson 3) */
        { id: 'e3b', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return factorPart([M(o.g * o.c[0], { x: 2 }), M(-o.g * o.c[1], { x: 1 })], { verify: true }); } },
        { id: 'e3c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 2, 5) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 30; }); return factorPart([M(o.g * o.c[0], { x: 3 }), M(o.g * o.c[1], { x: 2 })], { verify: true }); } }] },
      { num: '4', stem: 'Each product below has <b>three</b> factors. Expand it completely, then check your answer by substituting ' + t('x=1') + ' into both the product and your expanded form.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return [r.int(1, 4), r.int(2, 7)]; }, function (o) { return o[0] < o[1]; }); return expandPart(spec({ G: N(r.int(2, 5)), p: o[0], q: o[1] }), 1); } },
        { id: 'e4b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return [r.int(1, 5), r.int(1, 5)]; }, function (o) { return o[0] !== o[1]; }); return expandPart(spec({ G: N(r.int(2, 5)), p: o[0], q: -o[1] }), 1); } }] },
      /* ---------------- Part B — Checking ---------------- */
      triClaimQ('5', 'a', function (r) { var o = pickWhere(function () { return [r.int(1, 5), r.int(2, 9)]; }, function (o) { return o[0] < o[1]; }); return o; }, ['BEG', 'BEG'], 'Extra practice B — Checking a factorization by expanding'),
      triClaimQ('5', 'b', function (r) { var o = pickWhere(function () { return [r.int(1, 5), r.int(2, 9)]; }, function (o) { return o[0] < o[1]; }); return [-o[0], -o[1]]; }, ['BEG', 'EMG']),
      triClaimQ('5', 'c', function (r) { var o = pickWhere(function () { return [r.int(1, 3), r.int(6, 12)]; }, function (o) { return posPairs(o[0] * o[1]).length >= 3; }); return o; }, ['BEG', 'BEG']),
      triClaimQ('5', 'd', function (r) { var o = pickWhere(function () { return [r.int(3, 7), r.int(2, 6)]; }, function (o) { return o[0] !== o[1]; }); return [-o[0], o[1]]; }, ['BEG', 'EMG']),
      triClaimQ('5', 'e', function (r) { var o = pickWhere(function () { return [r.int(3, 7), r.int(1, 5)]; }, function (o) { return o[0] > o[1]; }); return [o[0], -o[1]]; }, ['BEG', 'EMG']),
      triClaimQ('5', 'f', function (r) { var o = pickWhere(function () { return [r.int(2, 5), r.int(3, 8)]; }, function (o) { return o[0] < o[1]; }); return [-o[0], -o[1]]; }, ['BEG', 'EMG']),
      compQ('a', 'incomplete', 'Extra practice B — Correct, and complete?'),
      compQ('b', 'xsq'),
      compQ('c', 'wrong'),
      compQ('d', 'cube'),
      { num: '7', stem: function (sh) { var v = sh.v, k = sh.k; return '<b>Error analysis.</b> A student claims that ' + t(v + '^{2}+' + k * k + '=(' + v + '+' + k + ')(' + v + '+' + k + ')') + ', reasoning that “' + t(k + '\\times ' + k + '=' + k * k) + '.”'; },
        shared: function (r) { return { k: r.int(2, 9), v: r.pick(['x', 'x', 'y', 'a', 'm']) }; },
        parts: [
          { id: 'e7a', level: 'BEG', make: function (r, sh) { var k = sh.k, v = sh.v, s = spec({ v: v, p: k, q: k }), sq = '(' + v + '+' + k + ')(' + v + '+' + k + ')';
            return KP.poly('Expand ' + t(sq) + '.', s.inner, { wrong: [{ is: PL.add(V(v, 2), N(k * k)), code: 'fl-only', hint: 'That is only the First and Last products. Add the Outer and Inner products: ' + t(k + v + '+' + k + v) + '.' }] },
              t(sq + '=' + v + '^{2}+' + k + v + '+' + k + v + '+' + k * k + '=\\mathbf{' + v + '^{2}+' + 2 * k + v + '+' + k * k + '}') + ', not ' + t(v + '^{2}+' + k * k) + '.', ['Use FOIL: First, Outer, Inner, Last.'], 'expand (' + v + '+' + k + ')^2'); } },
          { id: 'e7b', level: 'EMG', make: function (r, sh) { var k = sh.k, v = sh.v, sq = '(' + v + '+' + k + ')(' + v + '+' + k + ')';
            return mcPart(r, 'Which term did the student forget about?', [
              { html: 'The middle term ' + t(2 * k + v) + ': the Outer and Inner products ' + t(k + v) + ' and ' + t(k + v) + '.', right: true },
              { html: 'The ' + t(v + '^{2}') + ' term.', why: t(v + '\\cdot ' + v + '=' + v + '^{2}') + ' — that term is in the claim. Look at the Outer and Inner products.' },
              { html: 'The constant term.', why: t(k + '\\times ' + k + '=' + k * k) + ' is there. What about ' + t(v + '\\cdot ' + k) + ' and ' + t(k + '\\cdot ' + v) + '?' },
              { html: 'No term is missing; the claim is correct.', why: 'Expand: ' + t(sq + '=' + v + '^{2}+' + 2 * k + v + '+' + k * k) + '.' }],
              'The student multiplied only the First and Last terms. The Outer and Inner products ' + t(k + v + '+' + k + v + '=' + 2 * k + v) + ' were forgotten. (In fact ' + t(v + '^{2}+' + k * k) + ' does not factor over the integers.)', ['Write out all four FOIL products.'], 'forgot middle term'); } },
          { id: 'e7c', level: 'BEG', make: function (r, sh) { var k = sh.k, v = sh.v, L = 1 + k * k, R = (1 + k) * (1 + k);
            return KP.fields('Check the claim a second way: substitute ' + t(v + '=1') + ' into both sides.', [numField(t(v + '^{2}+' + k * k)), numField(t('(' + v + '+' + k + ')(' + v + '+' + k + ')'))], [K.number(L), K.number(R, function (x) { return x === L ? { code: 'fl-only', hint: 'Work out each bracket first: ' + t('1+' + k + '=' + (1 + k)) + ', then multiply.' } : null; })], [String(L), String(R)],
              t(L) + ' and ' + t(R), 'Left: ' + t('1^{2}+' + k * k + '=' + L) + '. Right: ' + t('(1+' + k + ')(1+' + k + ')=' + (1 + k) + '\\times ' + (1 + k) + '=' + R) + '.<br>' + t(L + '\\neq ' + R) + ', so the claim is false.',
              ['Replace every ' + t(v) + ' with ' + t('1') + ', then calculate.'], 'substitute 1 both sides'); } }] },
      { num: '8', stem: '<b>Substitution as a check.</b> A factored form and an expanded form describe the same expression, so they must give the same value at <i>every</i> value of ' + t('x') + '.',
        shared: function (r) { return e8b(r); },
        parts: [
        { id: 'e8a', level: 'BEG', make: function (r) {
          var o = pickWhere(function () { return [r.int(1, 4), r.int(3, 7)]; }, function (o) { return o[0] < o[1]; }), s = spec({ p: o[0], q: o[1] }), x2 = r.int(2, 4);
          var vals = [1, x2].map(function (x) { return PL.at(s.inner, { x: x }); });
          return KP.fields('Verify that ' + t(tx(s.inner)) + ' and ' + t(s.key) + ' agree by substituting ' + t('x=1') + ' and then ' + t('x=' + x2) + ' into both forms.',
            [numField('x = 1, ' + t(tx(s.inner))), numField('x = 1, ' + t(s.key)), numField('x = ' + x2 + ', ' + t(tx(s.inner))), numField('x = ' + x2 + ', ' + t(s.key))],
            [K.number(vals[0]), K.number(vals[0]), K.number(vals[1]), K.number(vals[1])], [vals[0], vals[0], vals[1], vals[1]].map(String),
            t('x=1') + ': ' + t(vals[0]) + ' and ' + t(vals[0]) + '; ' + t('x=' + x2) + ': ' + t(vals[1]) + ' and ' + t(vals[1]),
            [1, x2].map(function (x, i) { return t('x=' + x) + ': ' + t(x + '^{2}+' + s.b + '(' + x + ')+' + s.c + '=' + vals[i]) + ' and ' + t('(' + x + '+' + o[0] + ')(' + x + '+' + o[1] + ')=' + (x + o[0]) + '\\times ' + (x + o[1]) + '=' + vals[i]) + ' ✓'; }).join('<br>'),
            ['Replace every ' + t('x') + ' with the number. In the factored form, work out each bracket first.'], 'substitution check');
        } },
        { id: 'e8b1', sub: 'b i', level: 'BEG', make: function (r, sh) { var c = sh;
          return KP.fields('Substitute ' + t('x=0') + ' and then ' + t('x=1') + ' into ' + t(c.Ttx) + ' and into ' + t(c.claimTex) + '.', [numField('x = 0, ' + t(c.Ttx)), numField('x = 0, ' + t(c.claimTex)), numField('x = 1, ' + t(c.Ttx)), numField('x = 1, ' + t(c.claimTex))],
            [K.number(c.v0), K.number(c.v0), K.number(c.t1), K.number(c.c1)], [c.v0, c.v0, c.t1, c.c1].map(String), t('x=0') + ': ' + t(c.v0) + ' and ' + t(c.v0) + '; ' + t('x=1') + ': ' + t(c.t1) + ' and ' + t(c.c1),
            t('x=0') + ': both give ' + t(c.v0) + ' (only the constants are left).<br>' + t('x=1') + ': ' + t('1^{2}' + (c.b < 0 ? '' : '+') + c.b + '(1)-' + c.p * c.q + '=' + c.t1) + ' but ' + t(c.claimTex.replace(/x/g, '1') + '=' + c.c1) + '.', ['Replace every ' + t('x') + ' with the number and calculate carefully.'], 'substitute x=0 and x=1'); } },
        { id: 'e8b2', sub: 'b ii', level: 'EMG', make: function (r, sh) { var c = sh;
          return mcPart(r, 'At ' + t('x=0') + ' the values of ' + t(c.Ttx) + ' and ' + t(c.claimTex) + ' match, but at ' + t('x=1') + ' they do not. What does this show?', [
            { html: 'The factoring is wrong. Agreeing at one value proves nothing; a correct factoring must agree at <b>every</b> value, so one mismatch disproves it.', right: true },
            { html: 'The factoring is right, because the values matched at ' + t('x=0') + '.', why: 'Matching at one value is not enough — at ' + t('x=1') + ' they give ' + t(c.t1) + ' and ' + t(c.c1) + '.' },
            { html: 'You made an arithmetic mistake, because equal expressions always match.', why: 'Equal expressions do always match — that is the point. Since these don’t match at ' + t('x=1') + ', they are not equal.' },
            { html: 'Substitution can never be used to check a factoring.', why: 'Substitution is a good check: one value that doesn’t match is enough to show the factoring is wrong.' }],
            'At ' + t('x=0') + ' only the constant terms count, and they match. At ' + t('x=1') + ' the values are ' + t(c.t1) + ' and ' + t(c.c1) + ', so the two expressions are <b>not</b> equal: ' + t(c.Ttx + '=' + c.s.key) + '.', [], 'one value is not enough'); } }] },
      /* ---------------- Part C — Sorting and matching ---------------- */
      { num: '9', section: 'Extra practice C — Sorting and matching', stem: 'Match each expanded expression with its factored form.', parts: [
        { id: 'e9', level: 'EMG', make: function (r) {
          var p = r.int(4, 9), q = r.int(2, p - 1), k = r.pick([2, 3]);
          var pairs = [
            { e: triTex('x', p + q, p * q), f: '(x+' + p + ')(x+' + q + ')' }, { e: triTex('x', p - q, -p * q), f: '(x+' + p + ')(x-' + q + ')' },
            { e: triTex('x', -(p + q), p * q), f: '(x-' + p + ')(x-' + q + ')' }, { e: triTex('x', q - p, -p * q), f: '(x-' + p + ')(x+' + q + ')' },
            { e: k + 'x^{2}+' + k * p + 'x', f: k + 'x(x+' + p + ')' }, { e: 'x^{2}-' + p * p, f: '(x-' + p + ')(x+' + p + ')' }];
          var order = r.shuffle([0, 1, 2, 3, 4, 5]), want = {};
          pairs.forEach(function (pr, i) { want['ABCDEF'[i]] = ROMAN[order.indexOf(i)]; });
          var rows = pairs.map(function (pr, i) { return { id: 'ABCDEF'[i], html: 'ABCDEF'[i] + '. ' + t(pr.e) }; });
          var cols = ROMAN.map(function (R) { return { id: R, html: R }; });
          var list = order.map(function (i, j) { return '<span style="display:inline-block;min-width:10.5em;white-space:nowrap">' + ROMAN[j] + '. ' + t(pairs[i].f) + '</span>'; }).join(' ');
          return KP.grid('Factored forms:<br>' + list + '<br>Choose the factored form for each expanded expression.', rows, cols, want,
            { why: function (row) { var i = 'ABCDEF'.indexOf(row); return { code: 'row', hint: 'Check ' + row + ': expand the factored form you chose and compare the middle term and the constant (watch the signs).' }; } },
            pairs.map(function (pr, i) { return 'ABCDEF'[i] + ' — ' + ROMAN[order.indexOf(i)] + ': ' + t(pr.f + '=' + pr.e); }).join('<br>'),
            ['Expand each factored form (FOIL) and match it. The signs of the middle term and the constant tell the pairs apart.'], 'match expanded/factored');
        } }] },
      { num: '10', stem: 'Sort each expression as <b>expanded</b>, <b>factored</b>, or <b>neither</b>. An expression is “neither” when it is a sum of products that are not fully multiplied out, or a product that is not finished.', parts: [
        { id: 'e10', level: 'EMG', make: function (r) {
          var rows = sortRows(r), want = {}, why = {};
          rows.forEach(function (x) { want[x.id] = x.kind; why[x.id] = x.why; });
          return KP.grid('Sort each expression.', rows.map(function (x) { return { id: x.id, html: '(' + x.id + ') ' + t(x.tex) }; }), [{ id: 'exp', html: 'expanded' }, { id: 'fac', html: 'factored' }, { id: 'nei', html: 'neither' }], want,
            { why: function (row) { return { code: 'row', hint: '(' + row + ') ' + why[row] }; } },
            rows.map(function (x) { return '(' + x.id + ') <b>' + { exp: 'expanded', fac: 'factored', nei: 'neither' }[x.kind] + '</b> — ' + x.why; }).join('<br>'),
            ['Expanded: a sum of single terms. Factored: one finished product. Neither: a sum of products, or a product whose bracket can still be factored.'], 'sort expanded/factored/neither');
        } }] },
      { num: '11', stem: function (sh) { return 'Each expression below is a product, so it looks factored — but only some are <b>completely</b> factored.<br>(a) ' + t(sh.f[0].shown) + ' &nbsp; (b) ' + t(sh.f[1].shown) + ' &nbsp; (c) ' + t(sh.f[2].shown) + ' &nbsp; (d) ' + t(sh.f[3].shown); },
        shared: function (r) {
          var a = pickWhere(function () { return { g: r.int(2, 4), k: r.pick([2, 3]), m: r.int(1, 5) }; }, function (o) { return true; }), b = { g: r.int(2, 6), m: r.int(1, 9) }, c = { k: r.int(2, 5), m: r.int(1, 5) }, d = { g: r.int(2, 9), m: r.int(2, 9) };
          var f = [
            { G: N(a.g), br: [M(a.k, { x: 1 }), N(a.k * a.m)], done: false },
            { G: M(b.g, { x: 1 }), br: [V('x'), N(b.m)], done: true },
            { G: V('x'), br: [M(c.k, { x: 1 }), N(c.k * c.m)], done: false },
            { G: N(d.g), br: [V('x', 2), M(d.m, { x: 1 })], done: false }];
          f.forEach(function (x) { x.shown = gTex(x.G) + '(' + seq(x.br) + ')'; x.terms = x.br.map(function (b2) { return PL.mul(x.G, b2); }); });
          return { f: f };
        },
        parts: [{ id: 'e11', sub: 'decide', level: 'EMG', make: function (r, sh) {
          var want = {}; sh.f.forEach(function (x, i) { want['abcd'[i]] = x.done ? 'yes' : 'no'; });
          return KP.grid('Decide which are completely factored.', sh.f.map(function (x, i) { return { id: 'abcd'[i], html: '(' + 'abcd'[i] + ') ' + t(x.shown) }; }), [{ id: 'yes', html: 'complete' }, { id: 'no', html: 'not complete' }], want,
            { why: function (row) { var x = sh.f['abcd'.indexOf(row)]; return { code: 'row', hint: '(' + row + ') ' + (x.done ? 'The bracket ' + t(seq(x.br)) + ' has no common factor left.' : 'The bracket ' + t(seq(x.br)) + ' still has a common factor.') }; }, tries: 2 },
            sh.f.map(function (x, i) { return '(' + 'abcd'[i] + ') ' + (x.done ? '<b>complete</b>' : '<b>not complete</b>: ' + t(seq(x.br)) + ' still has a common factor'); }).join('<br>'), ['Look inside each bracket: is there still a common factor?'], 'which are complete');
        } }].concat(['a', 'b', 'c', 'd'].map(function (L, i) {
          return { id: 'e11' + L, sub: L, level: i === 1 ? 'BEG' : 'EMG', make: function (r, sh) { var x = sh.f[i]; return factorPart(x.terms, { prompt: '(' + L + ') Write ' + t(x.shown) + ' in completely factored form' + (x.done ? ' (if it is already complete, write it again).' : '.'), text: 'complete ' + plain(x.shown) }); } };
        })) },
      /* ---------------- Part D — Area models, working backwards, reasoning ---------------- */
      { num: '12', section: 'Extra practice D — Area models, working backwards, and reasoning', stem: function (sh) { return '<b>Area model.</b> A rectangle has an area of ' + t(tx(sh.s.inner)) + ' square units. It is cut into four smaller rectangles, one for each term of the expansion.'; },
        shared: function (r) { var o = pickWhere(function () { return [r.int(1, 5), r.int(2, 9)]; }, function (o) { return o[0] < o[1]; }); return { s: spec({ p: o[0], q: o[1] }) }; },
        parts: [
          { id: 'e12a', level: 'EMG', make: function (r, sh) {
            var s = sh.s, inp = { rows: [null, null], cols: [null, null], cells: [['x^{2}', null], [null, String(s.c)]], keys: 'poly', vars: ['x'] };
            var key = { rows: ['x', String(s.p)], cols: ['x', String(s.q)], cells: [['x^{2}', s.q + 'x'], [s.p + 'x', String(s.c)]] };
            var p = KP.areabox('Fill in the two missing inside areas, the side lengths along the top and the side lengths down the left.', inp, { product: tx(s.inner), factor: true }, key,
              'The two missing areas add to the middle term ' + t(s.b + 'x') + ' and multiply to ' + t('x^{2}\\times ' + s.c + '=' + s.c + 'x^{2}') + ': ' + t(s.q + 'x') + ' and ' + t(s.p + 'x') + '.<br>Top: ' + t('x') + ' and ' + t(s.q) + '; left side: ' + t('x') + ' and ' + t(s.p) + '. The rectangle is ' + t('(x+' + s.q + ')') + ' by ' + t('(x+' + s.p + ')') + '.',
              ['The side lengths along the top times the side lengths down the left must give each inside area. Start with ' + t('x\\cdot x=x^{2}') + '.', 'The two numbers on the sides multiply to ' + t(s.c) + ' and add to ' + t(s.b) + '.'], 'area model ' + tx(s.inner));
            p.good = [{ rows: ['x', String(s.q)], cols: ['x', String(s.p)], cells: [['x^{2}', s.p + 'x'], [s.q + 'x', String(s.c)]] }];
            return p;
          } },
          { id: 'e12b', level: 'BEG', make: function (r, sh) { return facPart(sh.s, { prompt: 'Write the area as a product of the two side lengths.', check: true, text: 'area model product' }); } }] },
      { num: '13', stem: 'Each rectangle’s area and one side length are given. Find the other side length by factoring, then check by multiplying the two sides together.', parts: [
        { id: 'e13a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 5), c: cop2(r, 2, 7) }; }, function (o) { return o.g * Math.max(o.c[0], o.c[1]) <= 35; }); return sidePart([M(o.g * o.c[0], { x: 2 }), M(o.g * o.c[1], { x: 1 })], M(o.g, { x: 1 })); } },
        { id: 'e13b', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { g: r.int(2, 6), c: cop2(r, 1, 7) }; }, function (o) { return o.c[0] > 1 && o.g * Math.max(o.c[0], o.c[1]) <= 42; }); return sidePart([M(o.g * o.c[0], { x: 1 }), N(o.g * o.c[1])], N(o.g)); } },
        { id: 'e13c', level: 'BEG', make: function (r) { var k = r.int(2, 12), v = r.pick(['x', 'x', 'a', 'y']); return sidePart([V(v, 2), M(k, { [v]: 1 })], V(v)); } }] },
      { num: '14', stem: function (sh) { return '<b>Working backwards.</b> Suppose ' + t('ax(x+b)=' + sh.A + 'x^{2}+' + sh.AB + 'x') + ', where ' + t('a') + ' and ' + t('b') + ' are positive whole numbers.'; },
        shared: function (r) { var a = r.int(2, 9), b = pickWhere(function () { return r.int(2, 9); }, function (v) { return v !== a; }); return { a: a, b: b, A: a, AB: a * b }; },
        parts: [
          { id: 'e14a', level: 'PRG', make: function (r, sh) {
            var A = sh.A, AB = sh.AB;
            return mcPart(r, 'Expand ' + t('ax(x+b)') + '. What must ' + t('a') + ' and ' + t('a\\times b') + ' equal?', [
              { html: t('ax(x+b)=ax^{2}+abx') + ', so ' + t('a=' + A) + ' and ' + t('a\\times b=' + AB), right: true },
              { html: t('ax(x+b)=ax^{2}+abx') + ', so ' + t('a=' + AB) + ' and ' + t('a\\times b=' + A), why: 'Match term by term: ' + t('a') + ' is the coefficient of ' + t('x^{2}') + ', which is ' + t(A) + '; ' + t('ab') + ' is the coefficient of ' + t('x') + ', ' + t(AB) + '.' },
              { html: t('ax(x+b)=ax^{2}+bx') + ', so ' + t('a=' + A) + ' and ' + t('b=' + AB), why: t('ax') + ' multiplies <b>both</b> terms in the bracket: ' + t('ax\\times b=abx') + ', not ' + t('bx') + '.' },
              { html: t('ax(x+b)=ax+abx') + ', so ' + t('a+a\\times b=' + (A + AB)), why: t('ax\\times x=ax^{2}') + ', not ' + t('ax') + '. Then compare the ' + t('x^{2}') + '-terms and the ' + t('x') + '-terms separately.' }],
              t('ax(x+b)=ax\\cdot x+ax\\cdot b=ax^{2}+abx') + '. Matching with ' + t(A + 'x^{2}+' + AB + 'x') + ': the ' + t('x^{2}') + '-terms give ' + t('a=' + A) + ' and the ' + t('x') + '-terms give ' + t('a\\times b=' + AB) + '.', ['Multiply ' + t('ax') + ' by each term in the bracket, then compare coefficients term by term.'], 'what a and ab equal');
          } },
          { id: 'e14b', level: 'ADV', make: function (r, sh) {
            var A = sh.A, Bv = sh.b, AB = sh.AB;
            var check = function (resp) {
              resp = resp || [];
              var x = HW.parse.number(resp[0] == null ? '' : resp[0]), y = HW.parse.number(resp[1] == null ? '' : resp[1]);
              if (!x.ok || !y.ok) return form('empty', 'Enter one number in each box.');
              if (x.value === A && y.value === Bv) return ok();
              if (x.value === A && y.value === AB) return wrong('gave-product', t(AB) + ' is ' + t('a\\times b') + '. Divide by ' + t('a') + ' to get ' + t('b') + ': ' + t('b=' + AB + '\\div ' + A) + '.');
              if (x.value === Bv && y.value === A) return wrong('u4l1-ab-swap', 'Swapped: ' + t('a') + ' is the coefficient of ' + t('x^{2}') + ', so ' + t('a=' + A) + '.');
              if (x.value !== A) return wrong('value', t('a') + ' is the coefficient of ' + t('x^{2}') + ' in ' + t(A + 'x^{2}+' + AB + 'x') + '.');
              return wrong('value', 'With ' + t('a=' + A) + ', you need ' + t(A + '\\times b=' + AB) + '.');
            };
            return { prompt: 'Use part (a) to find ' + t('a') + ' and ' + t('b') + '.', input: { type: 'fields', fields: [numField(t('a=')), numField(t('b='))] }, check: check,
              key: [String(A), String(Bv)], answer: t('a=' + A + ',\\ b=' + Bv),
              solution: 'From part (a): ' + t('a=' + A) + ', and ' + t('a\\times b=' + AB) + ', so ' + t(A + '\\times b=' + AB) + ' and ' + t('b=' + AB + '\\div ' + A + '=\\mathbf{' + Bv + '}') + '.',
              hints: ['Read ' + t('a') + ' straight from the ' + t('x^{2}') + '-term.', 'Then ' + t('a\\times b=' + AB) + ': divide to find ' + t('b') + '.'], text: 'find a and b from ' + A + 'x^2+' + AB + 'x',
              bad: [[String(A), String(AB)], [String(Bv), String(A)]] };
          } },
          { id: 'e14c', level: 'PRG', make: function (r, sh) {
            return factorPart([M(sh.A, { x: 2 }), M(sh.AB, { x: 1 })], { verify: true, prompt: 'Write the factored form of ' + t(sh.A + 'x^{2}+' + sh.AB + 'x') + ', then expand it to verify that you get ' + t(sh.A + 'x^{2}+' + sh.AB + 'x') + ' back.',
              sol: 'With ' + t('a=' + sh.A) + ' and ' + t('b=' + sh.b) + ': ' + t('ax(x+b)=\\mathbf{' + sh.A + 'x(x+' + sh.b + ')}') + '.<br>Check by expanding: ' + t(sh.A + 'x(x+' + sh.b + ')=' + sh.A + 'x\\cdot x+' + sh.A + 'x\\cdot ' + sh.b + '=' + sh.A + 'x^{2}+' + sh.AB + 'x') + ' ✓',
              hints: ['Put your ' + t('a') + ' and ' + t('b') + ' into ' + t('ax(x+b)') + '.', 'The GCF of ' + t(sh.A + 'x^{2}') + ' and ' + t(sh.AB + 'x') + ' is ' + t(sh.A + 'x') + '.'], text: 'factored form ' + sh.A + 'x(x+' + sh.b + ')' });
          } }] },
      { num: '15', stem: 'Fill in each blank so that the statement is true. Expand to check every answer.', parts: [
        { id: 'e15a', level: 'PRG', make: function (r) { var p = r.int(2, 6), q = pickWhere(function () { return r.int(2, 9); }, function (v) { return v !== p; });
          return blanksPart('(x+' + p + ')(x+\\underline{\\quad})=x^{2}+\\underline{\\quad}x+' + p * q, [q, p + q], p, q, ['First blank', 'Second blank']); } },
        { id: 'e15b', level: 'ADV', make: function (r) { var p = r.int(2, 7), q = r.int(p + 1, 10);
          return blanksPart('(x-' + p + ')(x+\\underline{\\quad})=x^{2}+\\underline{\\quad}x-' + p * q, [q, q - p], -p, q, ['First blank', 'Second blank']); } },
        { id: 'e15c', level: 'PRG', make: function (r) { var p = r.int(2, 6), q = pickWhere(function () { return r.int(2, 9); }, function (v) { return v !== p; });
          return sumBlanksPart(p, q); } },
        { id: 'e15d', level: 'BEG', make: function (r) { var g = r.int(2, 9), k = r.int(2, 9), B = sum([V('x'), N(k)]); return frontPart(PL.mul(N(g), B), N(g), B, { prompt: t('\\underline{\\qquad}\\,(x+' + k + ')=' + g + 'x+' + g * k) }); } }] },
      { num: '16', stem: '<b>Reasoning.</b>', parts: [
        { id: 'e16a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return [r.int(1, 6), r.int(3, 9)]; }, function (o) { return o[0] < o[1]; }), s = spec({ p: o[0], q: o[1] });
          return mcPart(r, 'Expanding a product is a straightforward procedure, but factoring often requires searching. Why? Use ' + t(s.key) + ' and ' + t(tx(s.inner)) + '.', [
            { html: 'Expanding ' + t(s.key) + ' is a fixed routine with one answer. Factoring ' + t(tx(s.inner)) + ' runs backwards: you must <b>search</b> for two numbers with product ' + t(s.c) + ' and sum ' + t(s.b) + ', testing pairs until one works.', right: true },
            { html: 'Factoring is just expanding written in a different order, so there is no searching.', why: 'Factoring starts from the answer of a multiplication and has to find what was multiplied — that needs a search.' },
            { html: 'Expanding needs searching, because there are many ways to multiply.', why: 'Expanding always works the same way: multiply every term by every term and collect. The search is in factoring.' },
            { html: 'Factoring needs searching only because the numbers are big.', why: 'Even with small numbers you have to find the right pair among the factor pairs of ' + t(s.c) + ' (' + t(pairsTex(s.c)) + ').' }],
            'Expanding: ' + t(s.key + '=' + foilTex(s) + '=' + tx(s.inner)) + ' — one routine, one answer. Factoring: look through the factor pairs of ' + t(s.c) + ' (' + t(pairsTex(s.c)) + ') for the one that adds to ' + t(s.b) + '.', [], 'why factoring needs searching'); } },
        { id: 'e16b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { g: r.pick([2, 3]), k: r.pick([2, 3]), a: r.int(2, 5), b: r.int(1, 7) }; }, function (o) { return gcd(o.a, o.b) === 1; }), G = o.g * o.k;
          var poly = G * o.a + 'x+' + G * o.b, bad = o.g + '(' + o.k * o.a + 'x+' + o.k * o.b + ')', good = G + '(' + o.a + 'x+' + o.b + ')';
          return mcPart(r, 'What does it mean for a factorization to be <b>complete</b>? Think about ' + t(poly + '=' + bad) + '.', [
            { html: 'No factor can be broken down any further. ' + t(bad) + ' expands back correctly, but ' + t(o.k * o.a + 'x+' + o.k * o.b) + ' still has a common factor of ' + t(o.k) + ', so the complete answer is ' + t(good) + '.', right: true },
            { html: 'It is complete whenever it expands back to the original.', why: 'Expanding back shows it is <b>correct</b>, not that it is <b>complete</b>: ' + t(bad) + ' expands correctly, yet its bracket still has a common factor.' },
            { html: 'It is complete when the factor in front is a prime number.', why: 'The factor in front must be the <b>greatest</b> common factor, ' + t(G) + ', which need not be prime.' },
            { html: 'It is complete when the bracket has two terms.', why: 'The number of terms doesn’t matter; what matters is whether a common factor is left in the bracket.' }],
            t(bad) + ' is a true factoring, but ' + t(o.k * o.a + 'x+' + o.k * o.b + '=' + o.k + '(' + o.a + 'x+' + o.b + ')') + ', so a common factor was left inside. The complete answer is ' + t(poly + '=' + good) + '.', [], 'what complete means'); } }] },
      { num: '17', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e17', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { b: r.int(2, 9), c: r.pick([3, 5, 7, 11, 2, 6, 10]) }; }, function (o) { return !factorable(o.b, o.c); }), T = triTex('x', o.b, o.c);
          return mcPart(r, 'Ravi says, “Every polynomial can be factored, because you can always write it as ' + t('1') + ' times itself.” Why is ' + t(T + '=1(' + T + ')') + ' not a useful factoring?', [
            { html: 'Multiplying by ' + t('1') + ' changes nothing — no factor has been broken off. A useful factoring writes the expression as a product of factors of <b>lower degree</b> (or a number greater than ' + t('1') + ').', right: true },
            { html: 'Because ' + t('1(' + T + ')') + ' is not equal to ' + t(T) + '.', why: 'It is equal — that is not the problem. The problem is that nothing has been factored out.' },
            { html: 'Because ' + t('1') + ' is a prime number.', why: t('1') + ' is not prime. Multiplying by ' + t('1') + ' simply leaves the expression unchanged.' },
            { html: 'Because a factoring must always have exactly two brackets.', why: 'Factorings like ' + t('5(x+3)') + ' have one bracket. What matters is that real factors are broken off.' }],
            t('1(' + T + ')') + ' is always true but gives no new information. A useful factoring breaks the expression into factors of lower degree (or takes out a number greater than ' + t('1') + '), each of which cannot be factored further.', [], 'why 1·P is not useful'); } }] },
      { num: '18', stem: function (sh) { return '<b>Stretch.</b> In the expression ' + t(sh.L + 'x^{2}+kx') + ', the number ' + t('k') + ' is a positive whole number less than ' + t(sh.K) + '.'; },
        shared: function (r) { return gcfFamily(r); },
        parts: [
          { id: 'e18a', sub: 'a', level: 'MAS', make: function (r, sh) {
            var L = sh.L, d = sh.d, K = sh.K, list = sh.list;
            var p = KP.valueSet('List <b>every</b> value of ' + t('k') + ' for which the GCF of ' + t(L + 'x^{2}+kx') + ' is exactly ' + t(d + 'x') + '. (Separate them with commas.)', list, { v: 'k', keyTex: list.join(',\\ '), diag: function (A) {
                var out = A.filter(function (v) { return v <= 0 || v >= K || v % 1; })[0];
                if (out != null) return { code: 'u4l1-k-range', hint: t('k') + ' must be a positive whole number less than ' + t(K) + ', so ' + t(out) + ' is not allowed.' };
                var nm = A.filter(function (v) { return v % d; })[0];
                if (nm != null) return { code: 'u4l1-k-not-mult', hint: t(nm) + ' is not a multiple of ' + t(d) + ', so ' + t(d + 'x') + ' is not a factor of ' + t(nm + 'x') + '. The GCF is ' + t(gcfTex(L, nm)) + '.' };
                var big = A.filter(function (v) { return gcd(L, v) > d; })[0];
                if (big != null) return { code: 'u4l1-k-gcf-big', hint: 'For ' + t('k=' + big) + ' the GCF of ' + t(L + 'x^{2}+' + big + 'x') + ' is ' + t(gcfTex(L, big)) + ' — bigger than ' + t(d + 'x') + ', because ' + t(L) + ' and ' + t(big) + ' share the factor ' + t(gcd(L, big)) + '.' };
                return { code: 'u4l1-k-missing', hint: 'You have ' + A.length + ' of the ' + list.length + ' values. Go through <b>every</b> multiple of ' + t(d) + ' below ' + t(K) + ' and check the GCF of each.' };
              } },
              'For the GCF to be ' + t(d + 'x') + ', ' + t(d) + ' must divide ' + t('k') + ', so ' + t('k') + ' is a multiple of ' + t(d) + '; but ' + t(L) + ' and ' + t('k') + ' must share nothing more.<br>Multiples of ' + t(d) + ' less than ' + t(K) + ', with the GCF of ' + t(L) + ' and each:<br>' + sh.mults.map(function (k) { var g = gcd(L, k); return t(k) + ': ' + t(g) + (g === d ? ' ✓' : ''); }).join(', &nbsp;') + '<br>So ' + t('k=\\mathbf{' + list.join(',\\ ') + '}') + '.',
              ['' + t('k') + ' must be a multiple of ' + t(d) + ' (otherwise ' + t(d) + ' does not divide ' + t('k') + ').', 'Cross out each multiple of ' + t(d) + ' that shares an extra factor with ' + t(L) + ' — then the GCF would be bigger than ' + t(d + 'x') + '.'], 'all k with GCF ' + d + 'x of ' + L + 'x^2+kx');
            p.good = [list.slice().reverse().join(', '), list.map(function (v) { return 'k=' + v; }).join(', ')];
            p.bad = [sh.mults.join(', '), list.slice(0, -1).join(', '), list.concat([sh.kstar]).join(', '), list.concat([d + 1]).join(', ')];
            return p;
          } },
          { id: 'e18b', sub: 'b', level: 'PRG', make: function (r, sh) {
            var km = sh.list[sh.list.length - 1], L = sh.L, d = sh.d;
            return factorPart([M(L, { x: 2 }), M(km, { x: 1 })], { verify: true, prompt: 'For the <b>largest</b> ' + t('k') + ' on your list (the GCF is exactly ' + t(d + 'x') + '), write ' + t(L + 'x^{2}+kx') + ' in factored form, and expand to check.',
              sol: 'The largest value is ' + t('k=' + km) + '. The GCF of ' + t(L + 'x^{2}+' + km + 'x') + ' is ' + t(d + 'x') + ': ' + t(L + 'x^{2}\\div ' + d + 'x=' + L / d + 'x') + ' and ' + t(km + 'x\\div ' + d + 'x=' + km / d) + '.<br>' + t(L + 'x^{2}+' + km + 'x=\\mathbf{' + d + 'x(' + L / d + 'x+' + km / d + ')}') + '<br>Check: ' + t(d + 'x(' + L / d + 'x+' + km / d + ')=' + L + 'x^{2}+' + km + 'x') + ' ✓',
              hints: ['Use the largest ' + t('k') + ' from part (a). Its GCF is ' + t(d + 'x') + '.', 'Divide each term by ' + t(d + 'x') + ', then expand to check.'], text: 'factor ' + L + 'x^2+' + km + 'x' });
          } },
          { id: 'e18c', sub: 'c i', level: 'PRG', make: function (r, sh) {
            var L = sh.L, d = sh.d, ks = sh.kstar, G = gcd(L, ks), K = sh.K;
            return mcPart(r, 'Why is ' + t('k=' + ks) + ' <b>not</b> on your list?', [
              { html: (ks === L ? 'Both coefficients are ' + t(L) + ', so ' + t(L) + ' divides both numbers — and ' + t(L) + ' is bigger than ' + t(d) + '. So' : ks % L === 0 ? t(ks) + ' is a multiple of ' + t(L) + ', so ' + t(L) + ' divides both numbers — and ' + t(L) + ' is bigger than ' + t(d) + '. So' : t(ks) + ' and ' + t(L) + ' share the factor ' + t(G) + ', which is bigger than ' + t(d) + '. So') + ' the GCF of ' + t(L + 'x^{2}+' + ks + 'x') + ' is ' + t(G + 'x') + ', not ' + t(d + 'x') + '.', right: true },
              { html: t(ks) + ' is not a multiple of ' + t(d) + '.', why: 'It is: ' + t(ks + '=' + d + '\\times ' + ks / d) + '. The problem is that ' + t(L) + ' and ' + t(ks) + ' share an even <b>bigger</b> factor.' },
              { html: t(ks) + ' is not less than ' + t(K) + '.', why: t(ks + '<' + K) + ', so it is allowed. Find the GCF of ' + t(L) + ' and ' + t(ks) + '.' },
              { html: t(ks + 'x') + ' has no ' + t('x^{2}') + ', so the GCF has no ' + t('x') + '.', why: 'Both terms contain ' + t('x') + ' (the lowest power is ' + t('x') + '), so ' + t('x') + ' is in the GCF. Look at the numbers.' }],
              t('\\gcd(' + L + ',' + ks + ')=' + G) + ', which is bigger than ' + t(d) + '. So ' + t(L + 'x^{2}+' + ks + 'x=' + G + 'x(' + (L / G === 1 ? '' : L / G) + 'x+' + ks / G + ')') + ' — its GCF is ' + t(G + 'x') + ', not ' + t(d + 'x') + '.', ['Find the greatest number that divides both ' + t(L) + ' and ' + t(ks) + '.'], 'why k=' + ks + ' is not on the list');
          } },
          { id: 'e18d', sub: 'c ii', level: 'EMG', make: function (r, sh) {
            return gcfPart([M(sh.L, { x: 2 }), M(sh.kstar, { x: 1 })], { prompt: 'Give the GCF of ' + t(sh.L + 'x^{2}+' + sh.kstar + 'x') + '.', text: 'GCF of ' + sh.L + 'x^2+' + sh.kstar + 'x' });
          } }] }
    ]
  });

  /* ---------- part makers that use the lesson tools above ---------- */
  /* Extra 1 and 4: expand a product (x + p)(x + q) or G(x + p)(x + q); the check by substituting x0 is in the solution */
  function valsSeq(vals) { return vals.map(function (v, i) { return i && v >= 0 ? '+' + v : String(v); }).join(''); }
  function expandPart(s, x0) {
    var G = s.G, g = s.g1 ? 1 : cv(G), b = s.b, c = s.c, x2 = V('x', 2), x1 = V('x');
    var Gm = function (q) { return PL.mul(G, q); };
    var ws = [{ is: Gm(PL.add(x2, N(c))), code: 'fl-only', hint: 'That is only the First and Last products. The Outer and Inner products make the middle term: ' + t(par(s.q) + 'x+' + par(s.p) + 'x') + '.' }];
    if (b) ws.push({ is: Gm(PL.add(x2, PL.scale(x1, -b), N(c))), code: 'u4l1-mid-sign', hint: 'Check the sign of the middle term: the Outer and Inner products are ' + t(tx(PL.scale(x1, s.q)) + '\\ \\text{and}\\ ' + tx(PL.scale(x1, s.p))) + ', which add to ' + t(tx(PL.scale(x1, b))) + '.' });
    ws.push({ is: Gm(PL.add(x2, PL.scale(x1, b), N(-c))), code: 'u4l1-last-sign', hint: 'Check the last term: ' + t(par(s.p) + '\\times ' + par(s.q) + '=' + c) + '.' });
    if (!s.g1) {
      ws.push({ is: s.inner, code: 'gcf-dropped', hint: 'Your brackets are expanded correctly, but the ' + t(g) + ' in front is missing: multiply every term by ' + t(g) + '.' });
      ws.push({ is: PL.mul(G, G, s.inner), code: 'u4l1-g-twice', hint: 'The ' + t(g) + ' in front multiplies the product only <b>once</b>. Expand the two brackets first, then multiply every term by ' + t(g) + '.' });
      ws.push({ is: PL.add(Gm(x2), PL.scale(x1, b), N(c)), code: 'first-only', hint: 'Multiply ' + t(g) + ' by <b>every</b> term of ' + t(tx(s.inner)) + ', not just the first.' });
    }
    var W = dedupW(s.full, ws);
    var at = function (P) { return PL.at(P, { x: x0 }); };
    var brV = [x0 + s.p, x0 + s.q], P0 = g * brV[0] * brV[1];
    var termVals = PL.sorted(s.full).map(function (T) { return at(M(T.c, T.v)); });
    var prodTex = s.key.replace(/x/g, String(x0)) + '=' + (s.g1 ? (brV.some(function (v) { return v < 0; }) ? '(' + brV[0] + ')(' + brV[1] + ')' : brV[0] + '\\times ' + brV[1]) : g + '(' + brV[0] + ')(' + brV[1] + ')') + '=' + P0;
    var sol = (s.g1 ? t(s.key + '=' + foilTex(s) + '=\\mathbf{' + tx(s.full) + '}')
      : 'Expand the two brackets first: ' + t('(' + tx(s.A) + ')(' + tx(s.B) + ')=' + foilTex(s) + '=' + tx(s.inner)) + '.<br>Then multiply every term by ' + t(g) + ': ' + t(s.key + '=' + g + '(' + tx(s.inner) + ')=\\mathbf{' + tx(s.full) + '}'))
      + '<br>Check at ' + t('x=' + x0) + ': ' + t(prodTex) + ' and ' + t(valsSeq(termVals) + '=' + at(s.full)) + ' ✓';
    var p = KP.poly('Expand ' + t(s.key) + '.', s.full, { wrong: W.map(function (w) { return { is: w.p, code: w.code, hint: w.hint }; }) }, sol,
      s.g1 ? ['Use FOIL (First, Outer, Inner, Last), then collect the two middle terms.', 'Check: substitute ' + t('x=' + x0) + ' into the product and into your answer — the values must match.']
        : ['Expand the two brackets first (FOIL), then multiply every term by ' + t(g) + '.', 'Check: substitute ' + t('x=' + x0) + ' into the product and into your answer — the values must match.'], 'expand ' + s.key);
    p.bad = W.map(function (w) { return tx(w.p); });
    return p;
  }
  /* Extra 5 ii: what the proposed form really expands to (the same question for a correct and an incorrect claim) */
  function claimExpandPart(c) {
    var cs = c.cs, x2 = V('x', 2), x1 = V('x'), m = cs.b, n = cs.c, ws = [];
    if (!c.truth) ws.push({ is: c.s.full, code: 'u4l1-gave-target', hint: 'That is the trinomial in the question — the claim is that the two are equal. Expand ' + t(c.claimTex) + ' itself (FOIL) and see what it really gives.' });
    ws.push({ is: PL.add(x2, N(n)), code: 'fl-only', hint: 'That is only the First and Last products. Add the Outer and Inner products to get the middle term.' });
    if (m) ws.push({ is: PL.add(x2, PL.scale(x1, -m), N(n)), code: 'u4l1-mid-sign', hint: 'Check the sign of the middle term: the Outer and Inner products are ' + t(tx(PL.scale(x1, cs.q)) + '\\ \\text{and}\\ ' + tx(PL.scale(x1, cs.p))) + '.' });
    ws.push({ is: PL.add(x2, PL.scale(x1, m), N(-n)), code: 'u4l1-last-sign', hint: 'Check the last term: ' + t(par(cs.p) + '\\times ' + par(cs.q) + '=' + n) + '.' });
    var W = dedupW(c.E, ws);
    var p = KP.poly('Write what ' + t(c.claimTex) + ' really expands to.', c.E, { wrong: W.map(function (w) { return { is: w.p, code: w.code, hint: w.hint }; }) },
      'FOIL: ' + t(c.claimTex + '=' + foilTex(cs) + '=\\mathbf{' + tx(c.E) + '}') + '.<br>' + (c.truth ? 'That is exactly ' + t(c.Ttx) + ', so the claim is <b>correct</b>.' : 'That is not ' + t(c.Ttx) + ', so the claim is <b>incorrect</b>.'),
      ['Use FOIL (First, Outer, Inner, Last), then collect the two middle terms.', 'Watch the signs: the last term is the product of the two numbers in the brackets.'], 'expand claim ' + plain(c.claimTex));
    p.bad = W.map(function (w) { return tx(w.p); });
    return p;
  }
  /* Extra 15(c): (x + __)(x + p) = x² + s x + __ */
  function sumBlanksPart(p, q) {
    var s0 = p + q, c = p * q, sp = spec({ p: q, q: p });
    var c1 = K.number(q, function (v) {
      if (v === s0) return { code: 'gave-sum', hint: t(s0) + ' is the middle coefficient. The numbers in the brackets <b>add</b> to it: ' + t('\\square+' + p + '=' + s0) + '.' };
      if (v === s0 + p) return { code: 'value', hint: 'The two numbers in the brackets add to the middle coefficient: ' + t('\\square+' + p + '=' + s0) + ', so <b>subtract</b> ' + t(p) + '.' };
      return { code: 'value', hint: 'The two numbers in the brackets add to the middle coefficient: ' + t('\\square+' + p + '=' + s0) + '.' };
    });
    var c2 = K.number(c, function (v) {
      if (v === s0) return { code: 'gave-sum', hint: 'The constant term is the <b>product</b> of the two numbers in the brackets, not their sum.' };
      if (v === p * s0) return { code: 'gave-product', hint: 'Multiply the two numbers in the <b>brackets</b> (' + t(q) + ' and ' + t(p) + '), not ' + t(p) + ' and the middle coefficient.' };
      return { code: 'value', hint: 'The constant term is the product of the two numbers in the brackets.' };
    });
    var eqTex = '(x+\\underline{\\quad})(x+' + p + ')=x^{2}+' + s0 + 'x+\\underline{\\quad}';
    var part = KP.fields(t(eqTex), [numField('First blank'), numField('Second blank')], [c1, c2], [String(q), String(c)], t(q) + ' and ' + t(c),
      'The numbers in the brackets add to the middle coefficient: ' + t('\\square+' + p + '=' + s0) + ', so the first blank is ' + t(s0 + '-' + p + '=' + q) + '.<br>They multiply to the constant: ' + t(q + '\\times ' + p + '=' + c) + ', so the second blank is ' + t(c) + '.<br>Check: ' + t('(x+' + q + ')(x+' + p + ')=' + foilTex(sp) + '=' + tx(sp.inner)) + ' ✓',
      ['The middle coefficient is the <b>sum</b> of the two numbers in the brackets.', 'The constant term is their <b>product</b>.'], 'fill blanks ' + plain(eqTex));
    part.bad = [[String(s0), String(c)], [String(q), String(s0)]];
    return part;
  }
  /* Extra 18: families (L, d, K) for "every k < K with GCF of Lx² + kx exactly dx" (at least 3 answers); k* = a multiple of d with a bigger GCF */
  var GCF_FAM = [[12, 4, 30], [12, 4, 30], [12, 4, 25], [12, 3, 30], [12, 3, 40], [12, 6, 50], [18, 6, 40], [18, 6, 50], [18, 3, 30], [20, 4, 30], [20, 4, 25], [20, 5, 40],
    [8, 4, 40], [16, 4, 40], [24, 4, 50], [24, 8, 50], [24, 6, 50], [30, 6, 50], [30, 5, 50], [15, 5, 40], [10, 5, 50], [14, 7, 50], [16, 8, 50], [18, 9, 50], [24, 6, 40], [16, 4, 30], [30, 10, 50], [10, 5, 40]];
  function gcfFamily(r) {
    var f = r.pick(GCF_FAM), L = f[0], d = f[1], K = f[2], mults = [], list = [], big = [];
    for (var k = d; k < K; k += d) { mults.push(k); if (gcd(L, k) === d) list.push(k); else big.push(k); }
    var kstar = L < K && L % d === 0 && r.chance(0.5) ? L : r.pick(big);
    if (L === 12 && d === 4 && K === 30 && r.chance(0.6)) kstar = 24;
    return { L: L, d: d, K: K, mults: mults, list: list, big: big, kstar: kstar };
  }
  function gcfTex(L, k) { var g = gcd(L, k); return (g === 1 ? '' : g) + 'x'; }
  function expandFactorPart(f, lab) {
    var T = sum(f.terms), fp = factorPart(f.terms);
    var p = roundTrip(lab + 'Expand ' + t(f.shown) + ', then factor the result <b>completely</b>.', T, fp.check, [seq(f.terms), fp.key], 'Expanded: ' + t(seq(f.terms)) + '; completely factored: ' + t(fp.key),
      'Expand: ' + t(f.shown + '=' + seq(f.terms)) + '.<br>' + fp.solution, ['Multiply the factor in front by each term in the bracket.', 'Then take out the <b>greatest</b> common factor of the expanded terms.'], 'expand/factor ' + plain(f.shown), { l2: 'Factored completely', wrong: [{ is: sum([PL.mul(f.G, f.br[0])].concat(f.br.slice(1))), code: 'first-only', hint: 'Multiply the factor in front by <b>every</b> term in the bracket.' }] });
    return p;
  }
  function triClaimQ(letter, sub, gen, levels, section) {
    return { num: '5', section: section, stem: function (sh) { return 'Expand the proposed factored form to decide whether it is correct, and write what it really expands to.<br>(' + sub + ') &nbsp;Is ' + t(sh.Ttx + '=' + sh.claimTex) + '?'; },
      shared: function (r) {
        var pq = gen(r), p = pq[0], q = pq[1], truth = r.chance(0.5);
        if (truth) return triClaim(p, q, p, q);
        var c = p * q, alt = [];
        posPairs(c).forEach(function (x) { var sgn = c > 0 ? (p + q > 0 ? 1 : -1) : 1; if (c > 0) alt.push([sgn * x[0], sgn * x[1]]); else { alt.push([x[0], -x[1]]); alt.push([-x[0], x[1]]); } });
        alt.push([-p, -q]);
        alt = alt.filter(function (m) { return m[0] + m[1] !== p + q && m[0] + m[1] !== 0; });
        var m = r.pick(alt);
        return triClaim(p, q, m[0], m[1]);
      },
      parts: [
        { id: 'e5' + sub + '1', sub: sub + ' i', level: levels[0], make: function (r, sh) { return triVerdict(r, sh); } },
        { id: 'e5' + sub + '2', sub: sub + ' ii', level: levels[1], make: function (r, sh) { return claimExpandPart(sh); } }] };
  }
  function compQ(sub, kind, section) {
    return { num: '6', section: section, stem: function (sh) { return 'Expand to check each proposed factoring. One of them expands back correctly but is still <b>not completely factored</b>.<br>(' + sub + ') &nbsp;Is ' + t(seq(sh.terms) + '=' + gTex(sh.claimG) + '(' + seq(sh.claimBr) + ')') + '?'; },
      shared: function (r) { return compClaim(r, kind); },
      parts: [
        { id: 'e6' + sub + '1', sub: sub + ' i', level: 'EMG', make: function (r, sh) { return compVerdict(r, sh); } },
        { id: 'e6' + sub + '2', sub: sub + ' ii', level: kind === 'incomplete' || kind === 'wrong' ? 'EMG' : 'BEG', make: function (r, sh) {
          var ws = sh.type === 'ok' ? [] : [{ is: [sh.claimG, sum(sh.claimBr)], code: 'kept-error', hint: sh.type === 'wrong' ? 'That is the claimed form, and it doesn’t expand back to the original.' : 'That is the claimed form. It is equal, but its bracket still has a common factor.', tex: gTex(sh.claimG) + '(' + seq(sh.claimBr) + ')' }];
          return factorPart(sh.terms, { prompt: 'Write the correct, completely factored form of ' + t(seq(sh.terms)) + '.', wrong: ws, verify: true });
        } }] };
  }
  function e8b(r) {
    var o = pickWhere(function () { return [r.int(3, 9), r.int(1, 6)]; }, function (o) { return o[0] > o[1]; }), p = o[0], q = o[1];
    var s = spec({ p: p, q: -q }), cs = spec({ p: q, q: -p });
    return { s: s, p: p, q: q, b: p - q, Ttx: tx(s.full), claimTex: cs.key, v0: -p * q, t1: 1 + (p - q) - p * q, c1: (1 + q) * (1 - p) };
  }
  function sidePart(terms, w) {
    var Ttx = seq(terms), br = terms.map(function (m) { return divM(m, w); }), B = sum(br);
    var ws = [];
    terms.forEach(function (m, i) { if (i && !PL.eq(m, br[i])) ws.push({ is: sum(br.map(function (b, j) { return j === i ? m : b; })), code: 'no-divide', hint: 'Divide <b>every</b> term of the area by the width: ' + t(pg(m) + '\\div ' + pg(w) + '=' + tx(br[i])) + '.' }); });
    if (Object.keys(vOf(w)).length) ws.push({ is: sum(br.map(function (b, j) { return j ? PL.mul(b, M(1, vOf(w))) : b; })), code: 'kept-var', hint: 'The width ' + t(tx(w)) + ' divides the letter out of every term: ' + t(pg(terms[terms.length - 1]) + '\\div ' + pg(w) + '=' + tx(br[br.length - 1])) + '.' });
    var W = dedupW(B, ws);
    var p = KP.poly('Area ' + t('=' + Ttx) + ', width ' + t('=' + tx(w)) + '. Find the length.', B, { wrong: W.map(function (x) { return { is: x.p, code: x.code, hint: x.hint }; }) },
      'Factor out the width: ' + t(Ttx + '=' + gTex(w) + '(' + seq(br) + ')') + ', so the length is ' + t('\\mathbf{' + seq(br) + '}') + '.<br>Check: ' + t(gTex(w) + '(' + seq(br) + ')=' + Ttx) + ' ✓',
      ['Area = length × width, so divide each term of the area by the width.', 'Check by multiplying your length by the width.'], 'other side of ' + plain(Ttx));
    p.bad = W.map(function (x) { return tx(x.p); });
    return p;
  }
  function blanksPart(eqTex, want, p, q, labels) {
    var c = p * q, s = p + q;
    var c1 = K.number(want[0], function (v) {
      if (v === Math.abs(s) && v !== want[0]) return { code: 'gave-sum', hint: 'The first blank is the number in the bracket — it times ' + t(par(p)) + ' must give the constant ' + t(c) + '.' };
      if (v === -want[0]) return { code: 'sign', hint: 'Check the sign: ' + t(par(p) + '\\times ' + par(-want[0]) + '=' + (-p * want[0])) + ', not ' + t(c) + '.' };
      return { code: 'value', hint: 'Expand: ' + t(par(p) + '\\times ' + par(v) + '=' + p * v) + ', but the constant term is ' + t(c) + '. Which number times ' + t(par(p)) + ' gives ' + t(c) + '?' };
    });
    var c2 = K.number(want[1], function (v) {
      if (v === Math.abs(c)) return { code: 'gave-product', hint: 'The middle coefficient comes from <b>adding</b> the Outer and Inner products: ' + t(par(p) + '+' + par(q) + '=' + s) + '.' };
      if (v === -want[1]) return { code: 'sign', hint: 'Check the sign of the middle term: ' + t(par(p) + '+' + par(q) + '=' + s) + '.' };
      return { code: 'value', hint: 'The middle coefficient is the Outer plus Inner products: add the two numbers in the brackets.' };
    });
    var key = [String(want[0]), String(want[1])];
    var s0 = spec({ p: p, q: q });
    return KP.fields(t(eqTex), [numField(labels[0]), numField(labels[1])], [c1, c2], key, t(want[0]) + ' and ' + t(want[1]),
      'The numbers in the brackets multiply to the constant: ' + t(par(p) + '\\times ' + par(q) + '=' + c) + ', so the first blank is ' + t(want[0]) + '. They add to the middle coefficient: ' + t(par(p) + '+' + par(q) + '=' + s) + '.<br>Check: ' + t(s0.key + '=' + foilTex(s0) + '=' + tx(s0.inner)) + ' ✓',
      ['The constant term is the product of the two numbers in the brackets.', 'The middle coefficient is their sum.'], 'fill blanks ' + plain(eqTex));
  }
})(window);
