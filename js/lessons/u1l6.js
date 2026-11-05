/* Math 15 · Unit 1 · Lesson 6 — Simplifying Square Roots: Entire and Mixed Radicals (AN2)
 * Assignment 6 (u1_L06.tex, Questions 1–14) and the Lesson 6 Extra Practice (u1_EP06.tex, Questions 1–22).
 * Every part is a generator: it keeps the idea and difficulty of the booklet question (the booklet's numbers are among
 * the possible values where practical) and changes the numbers. Built from the Math 10C Unit 1 Lesson 7 practice
 * (toMixed / toEntire checkers with their diagnoses and codes), at Math 15 pitch: square roots only, radicands that
 * use the perfect squares up to 225 (prime factorization for the big ones), no calculator except Q2.
 * Answers: mixed radicals in simplest form (k√m, m with no perfect-square factor), entire radicals as √n (a negative
 * sign stays outside the root). Conversions: "explain why it is not fully simplified / what is unusual / why √50 but
 * not √51" → multiple choice whose options are reasons; Q5 "use prime factorization (a division ladder or a factor
 * tree)" → a division ladder for (a) and a factor tree for (b), then the mixed radical; EP 1 "show the factorization"
 * → a box for the prime factorization and one for the mixed radical; EP 22 "list every n" → a list. */
(function (root) {
  'use strict';
  var HW = root.HW, nt = HW.nt, F = HW.fmt, K = HW.kit, ex = HW.ex, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'coef-forgot': 'Simplified the root but dropped the coefficient in front', 'coef-added': 'Added the outside numbers instead of multiplying', 'coef-power': 'Took the perfect square out without its square root',
    'frac-den': 'Forgot to divide by the coefficient’s denominator', 'frac-num': 'Forgot to multiply by the coefficient’s numerator', 'neg-inside': 'Put a negative under a square root',
    'no-power': 'Didn’t square the coefficient', 'den-square': 'Didn’t square the coefficient’s denominator', 'not-entire': 'Not an entire radical', 'not-simplest': 'Mixed radical not in simplest form', unchanged: 'Left the radical unchanged',
    'one-radical': 'Not written as a single radical', doubled: 'Doubled the number instead of squaring it', 'add-radicands': 'Added/subtracted the radicands', 'no-square': 'Didn’t square the coefficient',
    'mc-said-entire': 'Called a mixed radical entire', 'mc-said-mixed': 'Called an entire radical mixed', order: 'Two numbers in the wrong order',
    unfinished: 'Ladder or tree not finished', 'u1l6-decimal': 'Decimal not to three places / not the radical’s value', 'u1l6-perimeter': 'Perimeter: didn’t multiply the side by 4',
    'u1l6-hyp': 'Didn’t add the squares of the legs', 'u1l6-like': 'Combined unlike radicals', 'u1l6-coef-sum': 'Added the coefficients wrong', 'u1l6-list': 'Wrong list of numbers', 'u1l6-count': 'Miscounted',
    'u1l6-square-whole': 'Squared only the coefficient (or only the root)', 'u1l6-product': 'Multiplied wrong', 'u1l6-rational-pick': 'Chose the wrong rational results',
    'mc-why-wrong': 'Chose a wrong reason', 'mc-not-simplified': 'Said it isn’t simplified (it is)', 'mc-simplified': 'Said it is simplified (it isn’t)'
  });
  HW.addPartial({ 'no-power': 'b', 'not-entire': 'b', unfinished: 'n', 'u1l6-decimal': 's', 'u1l6-perimeter': 'b', 'u1l6-hyp': 'n', 'u1l6-like': 'n', 'u1l6-coef-sum': 's', 'u1l6-list': 'b', 'u1l6-count': 's',
    'u1l6-square-whole': 'b', 'add-radicands': 'n', doubled: 'n', 'u1l6-product': 'b', 'u1l6-rational-pick': 'n' });

  /* ---------- small helpers (from 10C u1l7) ---------- */
  function R(c) { return typeof c === 'number' ? [c, 1] : c; }
  function rv(c) { c = R(c); return c[0] / c[1]; }
  function mulR(a, b) { a = R(a); b = R(b); return ex.norm(a[0] * b[0], a[1] * b[1]); }
  function isOne(c) { c = R(c); return c[0] === 1 && c[1] === 1; }
  function big(n) { return ex.nthFactor(n, 2); }
  function sqFree(n) { return n > 1 && ex.simplest(n, 2); }
  function isSq(n) { var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function near(x, y) { return ex.eq(x, y, 1e-7); }
  function gcd(a, b) { return ex.gcd(a, b); }
  function sq(n) { return '\\sqrt{' + F(n) + '}'; }
  function cTex(c) { c = R(c); if (c[1] === 1) return c[0] === 1 ? '' : c[0] === -1 ? '-' : String(c[0]); return (c[0] < 0 ? '-' : '') + '\\dfrac{' + Math.abs(c[0]) + '}{' + c[1] + '}'; }
  function kTex(c) { c = R(c); if (c[1] === 1) return String(c[0]); return (c[0] < 0 ? '-' : '') + '\\tfrac{' + Math.abs(c[0]) + '}{' + c[1] + '}'; }
  function ansTex(k, m) { k = R(k); if (m === 1) return ex.texRat(k); if (k[1] === 1) return (k[0] === 1 ? '' : k[0] === -1 ? '-' : k[0]) + sq(m); return (k[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(k[0]) + '}{' + k[1] + '}' + sq(m); }
  function plain(k, m) { k = R(k); var c = k[1] === 1 ? (k[0] === 1 ? '' : k[0] === -1 ? '-' : String(k[0])) : (k[0] < 0 ? '-' : '') + '(' + Math.abs(k[0]) + '/' + k[1] + ')'; return m === 1 ? String(k[0] / k[1]) : c + 'sqrt(' + m + ')'; }
  var SF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];
  function gen(r, make, test, tries) { var v; for (var i = 0; i < (tries || 600); i++) { v = make(); if (test(v)) return v; } return v; }
  function mathPart(prompt, check, key, answer, sol, hints, text, extra) {
    var p = { prompt: prompt, input: { type: 'math', keys: 'radical' }, check: check, key: key, answer: answer, solution: sol, hints: hints, text: text };
    if (extra) Object.keys(extra).forEach(function (k) { p[k] = extra[k]; });
    return p;
  }
  /* three different numbers for the parts of one question */
  function distinct(r, makers) { for (var i = 0; i < 300; i++) { var v = makers.map(function (f) { return f(); }), okk = true; for (var a = 0; a < v.length; a++) for (var b = a + 1; b < v.length; b++) if (JSON.stringify(v[a]) === JSON.stringify(v[b])) okk = false; if (okk) return v; } return v; }
  var PSQ = '4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225';

  /* ---------- entire → mixed ---------- */
  function mixedSol(c, n, cd) {
    var s = big(n), m = n / (s * s), k = mulR(c, s);
    if (s === 1) return t(F(n) + '=' + K.fac(n)) + ': no prime appears twice, so no perfect square (other than ' + t('1') + ') divides ' + t(F(n)) + '.<br>' + t(cd + sq(n)) + ' is <b>already in simplest form</b>.';
    var out = m === 1 ? t(F(n) + '=' + s + '\\times ' + s) + ', so ' + t(sq(n) + '=' + s) + ' — no radical is left.'
      : 'The largest perfect square that divides ' + t(F(n)) + ' is ' + t(F(s * s)) + ': ' + t(F(n) + '=' + F(s * s) + '\\times ' + m) + '.<br>' + t(sq(n) + '=\\sqrt{' + F(s * s) + '}\\times\\sqrt{' + m + '}=' + ansTex(s, m)) + '.';
    if (!isOne(c)) out += '<br>' + t(cd + '\\times ' + (m === 1 ? s : ansTex(s, m)) + '=' + ansTex(k, m)) + '.';
    return out;
  }
  function mixedDiag(c, n, cd, more) {
    c = R(c);
    var s = big(n), m = n / (s * s), rm = Math.sqrt(m), cv = rv(c);
    return function (val, r) {
      if (!isFinite(val)) return null;
      if (more) { var h = more(val, r); if (h) return h; }
      if (s === 1) return null;
      if (!isOne(c) && near(Math.abs(val), s * rm)) return { code: 'coef-forgot', hint: 'Good start: ' + t(sq(n) + '=' + ansTex(s, m)) + '. Now multiply by the ' + t(cd) + ' in front.' };
      if (c[1] === 1 && Math.abs(c[0]) > 1 && near(Math.abs(val), (Math.abs(c[0]) + s) * rm)) return { code: 'coef-added', hint: 'The ' + t(s) + ' that comes out of the root <b>multiplies</b> the ' + t(Math.abs(c[0])) + ' already in front — don’t add them.' };
      if (near(Math.abs(val), Math.abs(cv) * s * s * rm)) return { code: 'coef-power', hint: t(F(s * s)) + ' comes out of the root as its square root: ' + t('\\sqrt{' + F(s * s) + '}=' + s) + ', not ' + t(F(s * s)) + '.' };
      if (c[1] > 1 && near(Math.abs(val), Math.abs(c[0]) * s * rm)) return { code: 'frac-den', hint: 'Don’t forget the denominator: the coefficient is ' + t(cd.replace(/^-/, '')) + ', so divide by ' + t(c[1]) + ' as well.' };
      if (c[1] > 1 && Math.abs(c[0]) > 1 && near(Math.abs(val), s / c[1] * rm)) return { code: 'frac-num', hint: 'Multiply by the numerator ' + t(Math.abs(c[0])) + ' of the coefficient as well.' };
      return null;
    };
  }
  function mixedCheck(c, n, o) {
    o = o || {}; c = R(c);
    var s = big(n), m = n / (s * s), k = mulR(c, s), cd = o.disp != null ? o.disp : cTex(c);
    return K.radical({ k: k, n: 2, m: m }, 'mixed', { diag: mixedDiag(c, n, cd, o.more) });
  }
  function toMixed(c, n, o) {
    o = o || {}; c = R(c);
    var s = big(n), m = n / (s * s), k = mulR(c, s), cd = o.disp != null ? o.disp : cTex(c);
    var bad = [];
    if (s > 1 && m > 1) { bad.push(ansTex(mulR(c, s * s), m)); if (isOne(c)) bad.push(sq(n)); else bad.push(ansTex(s, m)); }
    var small = s > 1 ? nt.divisors(s).filter(function (d) { return d > 1 && d < s; })[0] : null;
    if (small && isOne(c)) bad.push(small + sq(n / (small * small)));
    return mathPart(o.prompt || t(cd + sq(n)), mixedCheck(c, n, o), ex.texRadical(k, 2, m), t(ansTex(k, m)), o.sol || mixedSol(c, n, cd),
      o.hints || (s === 1 ? ['Look for a perfect square that divides ' + t(F(n)) + ' (try ' + t('4, 9, 25, 49, \\ldots') + '). Its prime factorization may help.', 'If no perfect square (other than 1) divides it, the radical is already in simplest form — type it unchanged.']
        : ['Find the <b>largest</b> perfect square that divides ' + t(F(n)) + ' (' + t(PSQ) + ').', 'Write ' + t(sq(n) + '=\\sqrt{\\square}\\times\\sqrt{\\square}') + ', take the square root of the perfect square' + (isOne(c) ? '.' : ', then multiply by the ' + t(cd) + ' in front.')]),
      o.text || 'simplify ' + cd.replace(/\\dfrac\{(\d+)\}\{(\d+)\}/, '$1/$2') + '√' + n, { good: [plain(k, m)], bad: bad });
  }

  /* ---------- mixed → entire ---------- */
  function entireCheck(c, m, o) {
    o = o || {}; c = R(c);
    var cv = rv(c), ca = [Math.abs(c[0]), c[1]], neg = cv < 0, V = cv * Math.sqrt(m);
    var diag = function (val, r) {
      if (o.more) { var h = o.more(val, r); if (h) return h; }
      if (!isFinite(val)) return null;
      var av = Math.abs(val);
      if (c[1] === 1 && ca[0] > 1 && near(av, Math.sqrt(ca[0] * m))) return { code: 'no-square', hint: 'Square the ' + t(ca[0]) + ' before it goes inside: ' + t(ca[0] + '=\\sqrt{' + ca[0] * ca[0] + '}') + ', so ' + t(ca[0] + '\\sqrt{' + m + '}=\\sqrt{' + ca[0] * ca[0] + '\\times ' + m + '}') + '.' };
      if (c[1] === 1 && ca[0] > 1 && near(av, Math.sqrt(2 * ca[0] * m))) return { code: 'doubled', hint: 'Squaring isn’t doubling: ' + t(ca[0] + '^{2}=' + ca[0] + '\\times ' + ca[0] + '=' + ca[0] * ca[0]) + '.' };
      if (c[1] > 1) {
        if (near(av, Math.sqrt(Math.abs(cv) * m))) return { code: 'no-power', hint: 'Square the coefficient before it goes inside: ' + t('\\left(\\tfrac{' + ca[0] + '}{' + ca[1] + '}\\right)^{2}=\\tfrac{' + ca[0] * ca[0] + '}{' + ca[1] * ca[1] + '}') + '.' };
        if (near(av, Math.sqrt(ca[0] * ca[0] * m)) || near(av, Math.sqrt(ca[0] * ca[0] * m / ca[1]))) return { code: 'den-square', hint: 'Square the whole coefficient, denominator too: ' + t('\\left(\\tfrac{' + ca[0] + '}{' + ca[1] + '}\\right)^{2}=\\tfrac{' + ca[0] * ca[0] + '}{' + ca[1] * ca[1] + '}') + '.' };
      }
      return null;
    };
    var base = K.radical({ k: ca, n: 2, m: m }, 'entire', { diag: diag });
    return function (resp) {
      var s = String(resp == null ? '' : resp);
      if (/\\sqrt\s*\{\s*-|sqrt\s*\(\s*-|√\s*-/.test(s)) return wrong('neg-inside', 'A negative number has no real square root, so the negative sign can’t go under the root. Leave it <b>outside</b>: ' + t('-a\\sqrt{b}=-\\sqrt{a^{2}b}') + '.');
      var a = K.read(resp); if (a.res) return a.res;
      var r = ex.radical(a.ast);
      if (ex.eq(a.val, V)) {
        if (r && r.n === 2 && Math.abs(r.k[0]) === 1 && r.k[1] === 1) return ok();
        if (o.notEntire) return o.notEntire;
        return form('not-entire', 'Right value, but an entire radical has nothing in front of the root' + (neg ? ' except the negative sign' : '') + '. Square the ' + t(kTex(ca)) + ' and multiply it into the number under the root.');
      }
      if (neg && ex.eq(a.val, -V)) return wrong('sign', 'The coefficient is negative, so the answer is negative. Keep the negative sign <b>outside</b> the root: ' + t('-\\sqrt{\\square}') + '.');
      return base(resp);
    };
  }
  function entireSol(c, m, cd) {
    c = R(c);
    var cv = rv(c), ca = [Math.abs(c[0]), c[1]], N = Math.round(cv * cv * m), neg = cv < 0;
    var sqc = ca[1] === 1 ? ca[0] + '^{2}=' + ca[0] * ca[0] : '\\left(\\tfrac{' + ca[0] + '}{' + ca[1] + '}\\right)^{2}=\\tfrac{' + ca[0] * ca[0] + '}{' + ca[1] * ca[1] + '}';
    return (neg ? 'The negative sign stays outside the root. ' : '') + 'Square the coefficient: ' + t(sqc) + '. Multiply it into the number under the root: ' + t((ca[1] === 1 ? ca[0] * ca[0] : '\\tfrac{' + ca[0] * ca[0] + '}{' + ca[1] * ca[1] + '}') + '\\times ' + F(m) + '=' + F(N)) + '.<br>' + t(cd + sq(m) + '=' + (neg ? '-' : '') + sq(N)) + '.';
  }
  function toEntire(c, m, o) {
    o = o || {}; c = R(c);
    var cv = rv(c), N = Math.round(cv * cv * m), neg = cv < 0, cd = o.disp != null ? o.disp : cTex(c), key = (neg ? '-' : '') + sq(N);
    var bad = [cd.replace(/\\dfrac/g, '\\frac') + sq(m)];
    if (c[1] === 1 && Math.abs(c[0]) > 1) bad.push((neg ? '-' : '') + sq(Math.abs(c[0]) * m));
    if (neg) bad.push(sq(N));
    return mathPart(o.prompt || t(cd + sq(m)), entireCheck(c, m, o), key, t(key), o.sol || entireSol(c, m, cd),
      ['To move a number inside a square root, <b>square</b> it first: ' + t('a\\sqrt{b}=\\sqrt{a^{2}}\\times\\sqrt{b}=\\sqrt{a^{2}b}') + '.', neg ? 'A negative coefficient stays outside: ' + t('-a\\sqrt{b}=-\\sqrt{a^{2}b}') + '.' : 'Then multiply the square by the number already under the root.'],
      o.text || 'entire form of ' + cd.replace(/\\dfrac\{(\d+)\}\{(\d+)\}/, '$1/$2') + '√' + m, { bad: bad });
  }
  function kindPart(r, tex, mixed, why) {
    var p = P.mc(r, t(tex), [{ html: 'Entire radical', right: !mixed, why: mixed ? why : null, code: 'said-entire' }, { html: 'Mixed radical', right: mixed, why: mixed ? null : why, code: 'said-mixed' }],
      mixed ? 'A number sits in front of the root (a coefficient), so ' + t(tex) + ' is a <b>mixed</b> radical.' : 'Nothing multiplies the root — the number sits alone under the root sign — so ' + t(tex) + ' is an <b>entire</b> radical.',
      ['Entire: the number is alone under the root, like ' + t('\\sqrt{31}') + '. Mixed: a coefficient sits in front, like ' + t('7\\sqrt{11}') + '.'], 'entire or mixed: ' + tex.replace(/\\sqrt\{([^}]*)\}/g, '√$1'), true);
    p.tries = 1; p.input.columns = 2;
    return p;
  }

  /* ---------- ordering by converting to entire radicals ---------- */
  function mixedPool(lo, hi, cs) { var out = []; (cs || [2, 3, 4, 5, 6]).forEach(function (c) { SF.forEach(function (m) { var v = c * c * m; if (v >= lo && v <= hi) out.push({ c: c, m: m, v: v }); }); }); return out; }
  function orderItems(r, nMixed, nEntire, lo, hi, neg) {
    var pool = mixedPool(lo, hi);
    for (var tries = 0; tries < 600; tries++) {
      var mixed = r.sample(pool, nMixed), used = mixed.map(function (x) { return x.v; }), ents = [];
      for (var j = 0; j < nEntire; j++) ents.push(r.int(lo, hi));
      var all = used.concat(ents), okk = ents.every(function (n) { return !isSq(n) && big(n) === 1; });
      for (var a = 0; a < all.length && okk; a++) for (var b = a + 1; b < all.length; b++) if (all[a] === all[b]) okk = false;
      if (!okk) continue;
      var sgn = neg ? '-' : '';
      var items = mixed.map(function (x, i) { return { id: 'm' + i, tex: sgn + x.c + sq(x.m), v: neg ? -x.v : x.v, N: x.v, conv: sgn + x.c + sq(x.m) + '=' + sgn + '\\sqrt{' + x.c * x.c + '\\times ' + x.m + '}=' + sgn + sq(x.v) }; });
      ents.forEach(function (n, i) { items.push({ id: 'e' + i, tex: sgn + sq(n), v: neg ? -n : n, N: n, conv: sgn + sq(n) + '\\ \\text{(already entire)}' }); });
      return r.shuffle(items);
    }
    return null;
  }
  function orderPart(r, items, desc, text) {
    var sorted = items.slice().sort(function (a, b) { return desc ? b.v - a.v : a.v - b.v; }), byId = {};
    items.forEach(function (x) { byId[x.id] = x; });
    var rel = desc ? '>' : '<', neg = items[0].v < 0;
    return P.order(r, (desc ? 'Arrange from <b>greatest to least</b>: ' : 'Arrange from <b>least to greatest</b>: ') + items.map(function (x) { return t(x.tex); }).join(',  ') + '. (No calculator.)', sorted, { first: desc ? 'greatest' : 'least', last: desc ? 'least' : 'greatest',
      why: function (a, b) { return t(byId[a].tex) + ' and ' + t(byId[b].tex) + ' are in the wrong order. Write each one as an entire radical, ' + t('a\\sqrt{b}=\\sqrt{a^{2}b}') + ', and compare the numbers under the roots.' + (neg ? ' With negatives, the bigger root gives the <b>smaller</b> number.' : ''); } },
      'Convert every radical to an entire radical:<br>' + items.map(function (x) { return t(x.conv); }).join('<br>') + '<br>' + (neg ? 'The bigger the number under the root, the bigger the root — so the <b>more negative</b> the number: ' : 'Compare the numbers under the roots: ') + t(sorted.map(function (x) { return (neg ? '-' : '') + sq(x.N); }).join(rel)) + ', so<br>' + t(sorted.map(function (x) { return x.tex; }).join('\\ ' + rel + '\\ ')) + '.',
      ['Convert every mixed radical to an entire radical: ' + t('a\\sqrt{b}=\\sqrt{a^{2}b}') + '.', neg ? 'For negatives, the order flips: ' + t('-\\sqrt{20}<-\\sqrt{18}') + '.' : 'Then the bigger number under the root gives the bigger radical.'], text || 'order radicals');
  }

  /* ---------- figures ---------- */
  function svgWrap(w, h, body) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" style="max-width:' + w + 'px;display:block;margin:6px 0" role="img" fill="none" stroke="currentColor" stroke-width="1.6" font-size="13" font-family="KaTeX_Main,\'Times New Roman\',serif">' + body + '</svg>'; }
  function txt(x, y, s, it) { return '<text x="' + x + '" y="' + y + '" fill="currentColor" stroke="none" text-anchor="middle"' + (it ? ' font-style="italic"' : '') + '>' + s + '</text>'; }
  function rectDiag(a, b, unit) {
    var W = 170, H = Math.max(50, Math.min(120, 170 * a / b)), x0 = 30, y0 = 12;
    return svgWrap(240, H + 40, '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '"/><line x1="' + x0 + '" y1="' + (y0 + H) + '" x2="' + (x0 + W) + '" y2="' + y0 + '" stroke-dasharray="5 4"/>' +
      txt(x0 + W / 2, y0 + H + 18, b + ' ' + unit) + txt(x0 - 4, y0 + H / 2 + 4, a + ' ' + unit).replace('text-anchor="middle"', 'text-anchor="end"') + txt(x0 + W / 2 + 10, y0 + H / 2 - 6, 'd', true));
  }
  function rightTri(a, b, unit) {
    var W = 170, H = Math.max(45, Math.min(130, 170 * a / b)), x0 = 34, y0 = 10;
    return svgWrap(240, H + 40, '<path d="M' + x0 + ' ' + y0 + ' L' + x0 + ' ' + (y0 + H) + ' L' + (x0 + W) + ' ' + (y0 + H) + ' Z"/><path stroke-width="1.2" d="M' + x0 + ' ' + (y0 + H - 10) + ' h10 v10"/>' +
      txt(x0 + W / 2, y0 + H + 18, b + ' ' + unit) + txt(x0 - 6, y0 + H / 2 + 4, a + ' ' + unit).replace('text-anchor="middle"', 'text-anchor="end"') + txt(x0 + W / 2 + 12, y0 + H / 2 - 4, 'c', true));
  }
  function squareFig(lab) {
    return svgWrap(150, 118, '<rect x="35" y="12" width="85" height="85"/>' + txt(77, 60, lab) + txt(77, 113, 's', true));
  }

  /* ---------- like radicals ---------- */
  /* terms: [{ s: ±1, a }] each term ±√(a²m); result (Σ s·a)√m */
  function likePart(terms, m, text, coefs) {
    coefs = coefs || terms.map(function () { return 1; });
    var tot = terms.reduce(function (acc, u, i) { return acc + u.s * u.a * coefs[i]; }, 0);
    var tex = terms.map(function (u, i) { return (u.s < 0 ? '-' : i ? '+' : '') + (coefs[i] > 1 ? coefs[i] : '') + sq(u.a * u.a * m); }).join('');
    var simp = terms.map(function (u, i) { var k = u.a * coefs[i]; return (u.s < 0 ? '-' : i ? '+' : '') + (k === 1 ? '' : k) + sq(m); }).join('');
    var radSum = terms.reduce(function (acc, u) { return acc + u.s * u.a * u.a * m; }, 0);
    var check = K.radical({ k: [tot, 1], n: 2, m: m }, 'mixed', { diag: function (val) {
      if (radSum > 0 && near(val, Math.sqrt(radSum))) return { code: 'add-radicands', hint: 'You can’t add (or subtract) the numbers under the roots: ' + t('\\sqrt{a}+\\sqrt{b}\\ne\\sqrt{a+b}') + '. Simplify each radical first; then they are like radicals you can count.' };
      if (near(Math.abs(val) / Math.sqrt(m), Math.round(Math.abs(val) / Math.sqrt(m)))) return { code: 'u1l6-coef-sum', hint: 'Right kind of answer — check the numbers in front: ' + t(simp) + '.' };
      return { code: 'u1l6-like', hint: 'Simplify each radical first: they should all become multiples of ' + t(sq(m)) + '.' };
    } });
    var key = ex.texRadical([tot, 1], 2, m);
    return mathPart(t(tex), check, key, t(tex + '=' + ansTex(tot, m)), 'Simplify each radical: ' + terms.map(function (u, i) { return t((coefs[i] > 1 ? coefs[i] : '') + sq(u.a * u.a * m) + '=' + (u.a * coefs[i] === 1 ? '' : u.a * coefs[i]) + sq(m)); }).join(', ') + '.<br>' + t(tex + '=' + simp + '=' + ansTex(tot, m)) + ' (count them like ' + t('2x+3x=5x') + ').',
      ['Simplify each radical so the number under each root is ' + t(m) + '.', 'Then add or subtract the numbers in front, like ' + t('2x+3x=5x') + '.'], text, { bad: [sq(Math.abs(radSum) || 1), ansTex(tot + 1, m)] });
  }

  /* ---------- the lesson ---------- */
  HW.defineLesson({
    id: 'u1l6', unit: 1, num: '6', title: 'Simplifying Square Roots: Entire and Mixed Radicals', outcome: 'AN2',
    blurb: 'Pulling the largest perfect square out from under the root sign, pushing coefficients back in, and comparing radicals.',
    questions: [
      /* ================= Part A — Vocabulary and Equivalence ================= */
      { num: '1', section: 'Part A — Vocabulary and Equivalence', stem: 'Is each radical <b>entire</b> or <b>mixed</b>?', parts: [
        { id: '1a', level: 'LIM', make: function (r) { var n = gen(r, function () { return r.int(20, 99); }, function (v) { return !isSq(v); }); return kindPart(r, sq(n), false, 'Nothing multiplies the root here: the number is alone under the root sign.'); } },
        { id: '1b', level: 'LIM', make: function (r) { return kindPart(r, r.int(2, 9) + sq(r.pick(SF)), true, 'There is a number <b>in front of</b> the root.'); } },
        { id: '1c', level: 'LIM', make: function (r) { var n = gen(r, function () { return r.int(20, 99); }, function (v) { return !isSq(v); }); return kindPart(r, sq(n), false, 'Nothing multiplies the root: the number is alone under the root sign.'); } },
        { id: '1d', level: 'LIM', make: function (r) { return kindPart(r, r.int(2, 9) + sq(r.pick([11, 13, 14, 15, 17, 19, 21, 22])), true, 'There is a number <b>in front of</b> the root.'); } }] },
      { num: '2', stem: function (sh) { return 'Compare ' + t(sq(sh.c * sh.c * sh.m)) + ' and ' + t(sh.c + sq(sh.m)) + '.'; },
        shared: function (r) { return { c: r.int(2, 9), m: r.pick([2, 3, 5, 6, 7, 10]) }; },
        parts: [
          { id: '2a', level: 'BEG', make: function (r, sh) {
            var N = sh.c * sh.c * sh.m, x = Math.sqrt(N), fx = function (v) { return K.roundTo(v, 3).toFixed(3); };
            var ck = function (v) { var base = K.approx(v, 3); return function (resp) { var res = base(resp); if (res.v === 'wrong') { var p = HW.parse.number(resp); if (p.ok && Math.abs(p.value - v) <= 0.0011) return ok(); } return res; }; };
            var p = P.fields('Use a calculator to evaluate each one as a decimal, rounded to three decimal places.', [{ name: 'Entire', label: t(sq(N) + '\\approx') }, { name: 'Mixed', label: t(sh.c + sq(sh.m) + '\\approx') }],
              [ck(x), ck(x)], [fx(x), fx(x)], t(sq(N) + '\\approx ' + fx(x)) + ' and ' + t(sh.c + sq(sh.m) + '\\approx ' + fx(x)),
              t(sq(N) + '=' + x.toFixed(5) + '\\ldots\\approx ' + fx(x)) + '.<br>' + t(sh.c + sq(sh.m) + '=' + sh.c + '\\times ' + Math.sqrt(sh.m).toFixed(5) + '\\ldots=' + x.toFixed(5) + '\\ldots\\approx ' + fx(x)) + '.',
              ['For the mixed radical, find ' + t(sq(sh.m)) + ' and multiply by ' + t(sh.c) + ' (or type ' + t(sh.c + '\\times\\sqrt{' + sh.m + '}') + ').', 'Answers within ' + t('0.001') + ' are accepted.'], 'decimal of sqrt' + N + ' and ' + sh.c + 'sqrt' + sh.m);
            p.bad = [[fx(x), fx(Math.sqrt(sh.c * sh.m))], [fx(Math.sqrt(sh.c * sh.m)), fx(x)]];
            return p;
          } },
          { id: '2b', level: 'LIM', make: function (r, sh) {
            var N = sh.c * sh.c * sh.m;
            return P.mc(r, 'What do you notice?', [
              { html: 'They are the same number: ' + t(sq(N) + '=' + sh.c + sq(sh.m)) + ', because ' + t(N + '=' + sh.c * sh.c + '\\times ' + sh.m) + ' and ' + t('\\sqrt{' + sh.c * sh.c + '}=' + sh.c) + '.', right: true },
              { html: 'The entire radical is bigger, because ' + t(N) + ' is bigger than ' + t(sh.m) + '.', why: 'Look at your decimals again: they match. The ' + t(sh.c) + ' in front makes up for the smaller number under the root.' },
              { html: 'The mixed radical is bigger, because it has a coefficient.', why: 'Your two decimals are the same.' },
              { html: 'They are close but not equal, because of rounding.', why: 'They aren’t just close — they are exactly equal: ' + t(sq(N) + '=\\sqrt{' + sh.c * sh.c + '}\\times\\sqrt{' + sh.m + '}=' + sh.c + sq(sh.m)) + '.' }],
              'Both are ' + t(Math.sqrt(N).toFixed(3) + '\\ldots') + '. They are equal: ' + t(sq(N) + '=\\sqrt{' + sh.c * sh.c + '\\times ' + sh.m + '}=\\sqrt{' + sh.c * sh.c + '}\\times\\sqrt{' + sh.m + '}=' + sh.c + sq(sh.m)) + '. An entire radical and a mixed radical can name the same number.', ['Compare your two decimals from (a).'], 'what do you notice: equal');
          } }] },

      /* ================= Part B — Entire Radicals to Mixed Radicals ================= */
      { num: '3', section: 'Part B — Entire Radicals to Mixed Radicals', stem: 'Convert each entire radical to a mixed radical in simplest form.',
        shared: function (r) { return { n: distinct(r, [function () { return 4 * r.pick([3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19]); }, function () { return r.pick([4, 9]) * r.pick([2, 3, 5, 6, 7, 10, 11]); }, function () { return 9 * r.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]); }]) }; },
        parts: [
          { id: '3a', level: 'BEG', make: function (r, sh) { return toMixed(1, sh.n[0]); } },
          { id: '3b', level: 'BEG', make: function (r, sh) { return toMixed(1, sh.n[1]); } },
          { id: '3c', level: 'BEG', make: function (r, sh) { return toMixed(1, sh.n[2]); } }] },
      { num: '4', stem: 'Convert each entire radical to a mixed radical in simplest form.', parts: [
        { id: '4a', level: 'EMG', make: function (r) { return toMixed(1, r.chance(0.8) ? 16 * r.pick([2, 3, 5, 6, 7, 10, 11, 13]) : 64 * r.pick([2, 3])); } },
        { id: '4b', level: 'EMG', make: function (r) { return toMixed(1, r.pick([36, 49]) * r.pick([2, 3, 5, 6, 7])); } },
        { id: '4c', level: 'BEG', make: function (r) { return toMixed(1, r.chance(0.8) ? 25 * r.pick([2, 3, 5, 6, 7, 10, 11]) : 100 * r.pick([2, 3])); } }] },
      { num: '5', stem: 'Use prime factorization to convert each entire radical to a mixed radical in simplest form.',
        shared: function (r) {
          var make = function () { var s = r.pick([2, 2, 3]), m = r.pick([2, 3, 5, 6]) * r.pick([11, 13, 17, 19]); return s * s * m; };
          var a = gen(r, make, function (n) { return n <= 400 && sqFree(n / Math.pow(big(n), 2)); }), b = gen(r, make, function (n) { return n !== a && n <= 400; });
          return { a: a, b: b };
        },
        parts: [
          { id: '5a1', sub: 'a i', level: 'BEG', make: function (r, sh) { return ladderPart(sh.a, 'ladder'); } },
          { id: '5a2', sub: 'a ii', level: 'EMG', make: function (r, sh) { return pfMixed(sh.a); } },
          { id: '5b1', sub: 'b i', level: 'BEG', make: function (r, sh) { return ladderPart(sh.b, 'tree'); } },
          { id: '5b2', sub: 'b ii', level: 'EMG', make: function (r, sh) { return pfMixed(sh.b); } }] },

      /* ================= Part C — Mixed Radicals to Entire Radicals ================= */
      { num: '6', section: 'Part C — Mixed Radicals to Entire Radicals', stem: 'Convert each mixed radical to an entire radical.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { return toEntire(r.int(2, 3), r.pick([2, 3, 5, 6, 7, 10, 11])); } },
        { id: '6b', level: 'BEG', make: function (r) { return toEntire(r.int(4, 5), r.pick([5, 6, 7, 10, 11, 13])); } },
        { id: '6c', level: 'BEG', make: function (r) { return toEntire(r.int(6, 7), r.pick([2, 3, 5, 6])); } }] },
      { num: '7', stem: 'Convert each mixed radical to an entire radical.', parts: [
        { id: '7a', level: 'BEG', make: function (r) { return toEntire(r.int(7, 12), r.pick([2, 3, 5])); } },
        { id: '7b', level: 'EMG', make: function (r) { var c = r.int(3, 7); return toEntire(c, r.chance(0.6) ? c : r.pick([5, 6, 7])); } }] },

      /* ================= Part D — Ordering, Applications, and Review ================= */
      { num: '8', section: 'Part D — Ordering, Applications, and Review', stem: '', parts: [
        { id: '8', level: 'PRG', make: function (r) { return orderPart(r, orderItems(r, 3, 1, 30, 110), false, 'order 4 radicals'); } }] },
      { num: '9', stem: function (sh) { return 'Priya simplified ' + t(sq(sh.n)) + ' this way: ' + t(sq(sh.n) + '=\\sqrt{' + sh.a * sh.a + '\\times ' + sh.rest + '}=' + sh.a + sq(sh.rest)) + '.'; },
        shared: function (r) {
          var o = r.pick([[6, 2], [6, 3], [4, 2], [10, 2], [10, 5], [6, 2]]), m = r.pick([2, 3, 5, 6, 7]), S = o[0], a = o[1];
          return { n: S * S * m, a: a, rest: S * S * m / (a * a), S: S, m: m };
        },
        parts: [
          { id: '9a', level: 'EMG', make: function (r, sh) {
            var b = sh.S / sh.a;
            return P.mc(r, 'Why is Priya’s answer not fully simplified?', [
              { html: t(F(sh.rest) + '=' + b * b + '\\times ' + sh.m) + ' still has a perfect-square factor, ' + t(b * b) + ', so more can come out of the root.', right: true },
              { html: 'A mixed radical can’t have a coefficient of ' + t(sh.a) + '.', why: 'Any whole number can be the coefficient. Look at the number still under the root.', code: 'why-wrong' },
              { html: 'She should have taken out ' + t(sh.rest) + ' instead.', why: t(sh.rest) + ' isn’t a perfect square, so it can’t come out of the root.', code: 'why-wrong' },
              { html: 'It is fully simplified: ' + t(sh.rest) + ' is not a perfect square.', why: 'It doesn’t have to be a perfect square to simplify — it only needs a perfect-square <b>factor</b>. Does ' + t(sh.rest) + ' have one?', code: 'simplified' }],
              t(F(sh.rest) + '=' + b * b + '\\times ' + sh.m) + ', and ' + t(b * b) + ' is a perfect square, so ' + t(sh.a + sq(sh.rest)) + ' is not finished. She should have used the <b>largest</b> perfect square, ' + t(sh.S * sh.S) + ', right away.', ['Does the number left under the root have a perfect-square factor (' + t('4, 9, 16, 25, \\ldots') + ')?'], 'why Priya not simplified');
          } },
          { id: '9b', level: 'EMG', make: function (r, sh) {
            var b = sh.S / sh.a;
            var p = toMixed(1, sh.n, { prompt: 'Finish simplifying ' + t(sq(sh.n)) + ' correctly.', more: function (val) { return near(val, sh.a * Math.sqrt(sh.rest)) && false ? null : null; } });
            p.solution = 'Keep going from Priya’s work: ' + t(sh.a + sq(sh.rest) + '=' + sh.a + '\\sqrt{' + b * b + '\\times ' + sh.m + '}=' + sh.a + '\\times ' + b + sq(sh.m) + '=' + sh.S + sq(sh.m)) + '.<br>Or in one step: ' + t(sq(sh.n) + '=\\sqrt{' + sh.S * sh.S + '}\\times\\sqrt{' + sh.m + '}=' + sh.S + sq(sh.m)) + '.';
            p.bad = (p.bad || []).concat([sh.a + sq(sh.rest)]);
            return p;
          } }] },
      { num: '10', stem: function (sh) { return 'Simplify ' + t(sq(sh.k * sh.k)) + '.'; },
        shared: function (r) { return { k: r.int(11, 20) }; },
        parts: [
          { id: '10a', level: 'BEG', make: function (r, sh) {
            var n = sh.k * sh.k, p = toMixed(1, n, { prompt: t(sq(n)), hints: ['Is ' + t(n) + ' a perfect square? Check the table of perfect squares.'] });
            p.bad = [String(sh.k + 1), String(n / 2)];
            return p;
          } },
          { id: '10b', level: 'BEG', make: function (r, sh) {
            var n = sh.k * sh.k;
            return P.mc(r, 'What is unusual about this answer, compared with Questions 3–5?', [
              { html: 'It is a whole number — no radical is left, because ' + t(n) + ' is a perfect square (' + t(sh.k + '\\times ' + sh.k) + ').', right: true },
              { html: 'It can’t be simplified at all.', why: 'It simplifies all the way: ' + t(sq(n) + '=' + sh.k) + '.' },
              { html: 'The answer is a mixed radical with a large coefficient.', why: 'There is nothing left under a root: ' + t(sq(n) + '=' + sh.k) + '.' },
              { html: 'The answer is irrational.', why: t(sh.k) + ' is a whole number, so it is rational.' }],
              t(n + '=' + sh.k + '\\times ' + sh.k) + ', so ' + t(sq(n) + '=' + sh.k) + ': a whole number with <b>no radical left</b>. The earlier radicands had only a perfect-square <i>factor</i>; ' + t(n) + ' <i>is</i> a perfect square.', ['Is anything left under a root?'], 'what is unusual: perfect square');
          } }] },
      { num: '11', stem: '', parts: [
        { id: '11', level: 'PRG', make: function (r) {
          var A = gen(r, function () { return Math.pow(r.int(2, 6), 2) * r.pick([2, 3, 5, 6, 7, 10, 11, 13]); }, function (v) { return v >= 40 && v <= 300; }), s = big(A), m = A / (s * s), unit = r.pick(['square units', 'square units', 'm²', 'cm²']);
          var p = toMixed(1, A, { prompt: squareFig('A = ' + A) + 'A square rug has an area of ' + t(A) + ' ' + unit + '. Determine the <b>exact</b> side length of the rug, in simplest mixed radical form.', text: 'rug side from area ' + A,
            more: function (val) { return near(val, A / 4) || near(val, A / 2) ? { code: 'sqrt-halved', hint: 'The side of a square is the <b>square root</b> of its area: ' + t('s=\\sqrt{A}') + '.' } : null; } });
          p.solution = t('s=\\sqrt{A}=' + sq(A)) + '.<br>' + mixedSol(1, A, '') + '<br>Side: ' + t(ansTex(s, m)) + ' ' + unit.replace('square ', '').replace('²', '') + '.';
          return p;
        } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'BEG', make: function (r) {
          var s = r.int(2, 6), m = r.pick([3, 5, 6, 7, 10, 11].filter(function (x) { return x !== s; })), n = s * s * m;
          return P.mc(r, 'The correct simplified mixed radical form of ' + t(sq(n)) + ' is', [
            { html: t(s + sq(m)), right: true },
            { html: t(m + sq(s)), why: 'The square root of the perfect square ' + t(s * s) + ' comes out: ' + t(sq(n) + '=\\sqrt{' + s * s + '}\\times\\sqrt{' + m + '}') + '.' },
            { html: t(s * s + sq(m)), why: t(s * s) + ' comes out as its <b>square root</b>, ' + t(s) + '.' },
            { html: t(s + sq(s * m)), why: 'Check: ' + t(s + sq(s * m) + '=\\sqrt{' + s * s * s * m + '}') + ', not ' + t(sq(n)) + '.' }],
            t(sq(n) + '=\\sqrt{' + s * s + '\\times ' + m + '}=\\sqrt{' + s * s + '}\\times\\sqrt{' + m + '}=' + s + sq(m)) + '.', ['Find the largest perfect square that divides ' + t(n) + '.'], 'MC simplest form of sqrt' + n, false);
        } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '13', level: 'BEG', make: function (r) {
          /* not a lesson conversion: Example 3 (4√3, 2√13, 3√7, 9√2) or 4√6 (notes, Example 5(a)); booklet 3√10 → 90 */
          var cm = gen(r, function () { return [r.int(2, 9), r.pick([2, 3, 5, 6, 7, 10, 11])]; }, function (v) { return ['4,3', '3,7', '9,2', '4,6'].indexOf(v.join()) < 0; }), c = cm[0], m = cm[1], N = c * c * m;
          return P.nr('Convert ' + t(c + sq(m)) + ' to an entire radical: ' + t('\\sqrt{\\ \\square\\ }') + '. The number under the root is ________.', N, function (v) { return v === c * m ? { code: 'no-square', hint: 'Square the ' + t(c) + ' first: ' + t(c + '^{2}=' + c * c) + ', then multiply by ' + t(m) + '.' } : v === 2 * c * m ? { code: 'doubled', hint: 'Squaring isn’t doubling: ' + t(c + '^{2}=' + c * c) + '.' } : null; },
            t(c + sq(m) + '=\\sqrt{' + c + '^{2}\\times ' + m + '}=\\sqrt{' + c * c + '\\times ' + m + '}=' + sq(N)) + '. Record ' + t(N) + '.', ['Square the coefficient and multiply it by the number under the root.'], 'NR entire of ' + c + 'sqrt' + m);
        } }] },
      { num: '14', stem: function (sh) { return 'Without doing any long calculations: why can ' + t(sq(sh.n)) + ' be written as a mixed radical with a whole-number coefficient, but ' + t(sq(sh.n2)) + ' cannot?'; },
        shared: function (r) {
          for (var i = 0; i < 400; i++) { var s = r.pick([2, 3, 5]), m = r.pick([2, 3, 5, 6, 7, 10, 11, 13]), n = s * s * m, n2 = n + r.pick([1, -1]); if (n2 > 1 && sqFree(n2) && n < 200) return { n: n, n2: n2, s: s, m: m }; }
          return { n: 50, n2: 51, s: 5, m: 2 };
        },
        parts: [
          { id: '14', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Choose the best explanation.', [
              { html: t(sh.n + '=' + sh.s * sh.s + '\\times ' + sh.m) + ' has the perfect-square factor ' + t(sh.s * sh.s) + '; ' + t(sh.n2 + '=' + K.fac(sh.n2)) + ' has no perfect-square factor except ' + t('1') + ', so ' + t(sq(sh.n2)) + ' is already in simplest form.', right: true },
              { html: t(sh.n) + ' is ' + (sh.n % 2 ? 'odd' : 'even') + ' and ' + t(sh.n2) + ' is ' + (sh.n2 % 2 ? 'odd' : 'even') + '.', why: 'Odd or even doesn’t decide it: ' + t('\\sqrt{45}=3\\sqrt{5}') + ' and ' + t('\\sqrt{12}=2\\sqrt{3}') + '. Look for a perfect-square factor.' },
              { html: t(sh.n) + ' is a perfect square and ' + t(sh.n2) + ' is not.', why: 'Neither one is a perfect square. What matters is a perfect-square <b>factor</b>.' },
              { html: t(sh.n2) + ' is a prime number.', why: (nt.isPrime(sh.n2) ? 'It is prime, but that’s not the whole story: ' : t(sh.n2 + '=' + K.fac(sh.n2)) + ' isn’t prime. ') + 'The test is whether it has a perfect-square factor.' }],
              t(sq(sh.n) + '=\\sqrt{' + sh.s * sh.s + '}\\times\\sqrt{' + sh.m + '}=' + sh.s + sq(sh.m)) + ' because ' + t(sh.s * sh.s) + ' is a perfect square that divides ' + t(sh.n) + '. ' + t(sh.n2 + '=' + K.fac(sh.n2)) + ': no prime appears twice, so no perfect square (other than ' + t('1') + ') divides it.', ['Which perfect squares (' + t('4, 9, 25, 49, \\ldots') + ') divide each number?'], 'why one simplifies and not the other');
          } }] }
    ],

    extra: [
      /* ================= Extra practice A — Large radicands ================= */
      { num: '1', section: 'Extra practice A — Large Radicands: When the Perfect Square Is Hidden', stem: 'Use prime factorization to convert each entire radical to a mixed radical in <b>simplest form</b>. Show the factorization.',
        shared: function (r) { var mk = function () { return gen(r, function () { return Math.pow(r.pick([6, 7, 9, 10, 12, 14, 15, 18, 21]), 2) * r.pick([2, 3, 5, 6, 7, 10, 15, 30]); }, function (v) { return v >= 300 && v <= 2500; }); }; return { n: distinct(r, [mk, mk, mk]) }; },
        parts: ['a', 'b', 'c'].map(function (L, i) {
        return { id: 'e1' + L, level: 'PRG', make: function (r, sh) {
          var n = sh.n[i];
          var s = big(n), m = n / (s * s);
          var p = P.fields(t(sq(n)), [{ name: 'Prime factorization', label: t(F(n) + '='), mode: 'math', wide: true }, { name: 'Mixed radical', label: t(sq(n) + '='), mode: 'math', keys: 'radical', wide: true }],
            [K.product(n, 'either'), mixedCheck(1, n)], [K.fac(n), ex.texRadical([s, 1], 2, m)], t(F(n) + '=' + K.fac(n)) + '; ' + t(sq(n) + '=' + ansTex(s, m)),
            t(F(n) + '=' + K.fac(n)) + '.<br>Each <b>pair</b> of equal primes gives one copy outside the root: ' + t(sq(n) + '=' + HW.texFactors(nt.factor(n).filter(function (pe) { return pe[1] > 1; }).map(function (pe) { return [pe[0], Math.floor(pe[1] / 2)]; })) + (m > 1 ? sq(m) : '') + '=' + ansTex(s, m)) + '.',
            ['Factor ' + t(F(n)) + ' with a division ladder.', 'Every pair of matching primes moves one copy outside the root; unpaired primes stay inside.'], 'factorize and simplify sqrt ' + n);
          p.bad = [[K.fac(n), sq(n)], [K.fac(n), ansTex(s * s, m)]];
          return p;
        } };
      }) },
      { num: '2', stem: 'Convert each entire radical to a mixed radical in simplest form.',
        shared: function (r) { var mk = function () { return Math.pow(r.int(11, 15), 2) * r.pick([2, 3, 5, 6, 7]); }; return { n: distinct(r, [mk, mk, mk]) }; },
        parts: ['a', 'b', 'c'].map(function (L, i) {
        return { id: 'e2' + L, level: 'PRG', make: function (r, sh) { return toMixed(1, sh.n[i]); } };
      }) },
      { num: '3', stem: 'Convert each entire radical to a mixed radical in simplest form.',
        shared: function (r) { var mk = function () { return Math.pow(r.pick([20, 25, 30, 35, 40]), 2) * r.pick([2, 3, 5]); }; return { n: distinct(r, [mk, mk, mk]) }; },
        parts: ['a', 'b', 'c'].map(function (L, i) {
        return { id: 'e3' + L, level: 'PRG', make: function (r, sh) { return toMixed(1, sh.n[i]); } };
      }) },
      { num: '4', stem: 'Is each entire radical <b>already in simplest form</b>? If it is, type it unchanged; if not, simplify it.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) { return toMixed(1, gen(r, function () { return r.int(100, 400); }, function (v) { return sqFree(v) && nt.factor(v).length >= 3; })); } },
        { id: 'e4b', level: 'EMG', make: function (r) { return toMixed(1, r.pick([25, 49, 36]) * r.pick([7, 11, 13, 6, 5])); } },
        { id: 'e4c', level: 'EMG', make: function (r) { return toMixed(1, gen(r, function () { return r.int(100, 400); }, function (v) { return sqFree(v) && nt.factor(v).length >= 2; })); } },
        { id: 'e4d', level: 'EMG', make: function (r) { return toMixed(1, r.pick([121, 81, 64, 169]) * r.pick([2, 3, 5])); } }] },

      /* ================= Extra practice B — Coefficients, signs, unfinished work ================= */
      { num: '5', section: 'Extra practice B — Coefficients, Signs, and Unfinished Work', stem: 'Simplify the radical part, then multiply the coefficients, so the final answer is a mixed radical in simplest form.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) { return toMixed(r.int(2, 5), 25 * r.pick([2, 3, 6, 7])); } },
        { id: 'e5b', level: 'EMG', make: function (r) { return toMixed(-r.int(2, 5), 49 * r.pick([2, 3, 5])); } },
        { id: 'e5c', level: 'PRG', make: function (r) { var q = r.pick([2, 2, 3, 4]), s = q * r.pick([1, 2]); return toMixed([1, q], s * s * r.pick([2, 3, 5, 7]) * (s === q ? r.pick([4, 9]) : 1)); } },
        { id: 'e5d', level: 'EMG', make: function (r) { return toMixed(r.int(2, 6), 16 * r.pick([5, 6, 7, 10])); } }] },
      { num: '6', stem: 'Each student pulled out a perfect square that was too small and stopped. Finish the job: write the fully simplified mixed radical.', parts: ['a', 'b', 'c'].map(function (L, i) {
        return { id: 'e6' + L, level: 'EMG', make: function (r) {
          var POOL = [[[8, 2], [8, 4], [6, 2], [6, 3], [10, 2], [10, 5]], [[12, 2], [12, 3], [12, 4], [12, 6], [9, 3], [15, 3], [15, 5]], [[22, 2], [14, 2], [18, 2], [18, 3], [20, 2], [20, 4], [16, 2], [16, 4]]][i];
          var o = gen(r, function () { var S = r.pick(POOL); return { S: S[0], a: S[1], m: r.pick([2, 3, 5, 6, 7]) }; }, function (o) { return o.S * o.S * o.m <= 2500; });
          var n = o.S * o.S * o.m, rest = n / (o.a * o.a);
          var p = toMixed(1, n, { prompt: t(sq(n) + '=' + o.a + sq(rest)) + ' — finish simplifying.' });
          p.solution = t(F(rest) + '=' + Math.pow(o.S / o.a, 2) + '\\times ' + o.m) + ' still has a perfect-square factor: ' + t(o.a + sq(rest) + '=' + o.a + '\\times ' + (o.S / o.a) + sq(o.m) + '=' + o.S + sq(o.m)) + '.<br>(In one step: ' + t(F(n) + '=' + F(o.S * o.S) + '\\times ' + o.m) + ', so ' + t(sq(n) + '=' + o.S + sq(o.m)) + '.)';
          p.bad = (p.bad || []).concat([o.a + sq(rest)]);
          return p;
        } };
      }) },
      { num: '7', stem: 'Convert each mixed radical to an <b>entire radical</b>. Keep any negative sign outside the root. In (c) and (d), you can simplify first.', parts: [
        { id: 'e7a', level: 'BEG', make: function (r) { return toEntire(r.pick([10, 10, 11, 12]), r.pick([2, 3, 5, 6, 7])); } },
        { id: 'e7b', level: 'EMG', make: function (r) { return toEntire(-r.int(3, 6), r.pick([2, 3, 5, 6, 7])); } },
        { id: 'e7c', level: 'PRG', make: function (r) { var q = r.pick([2, 3]), m = r.pick([2, 3, 5, 6, 7, 10, 11]); var p = toEntire([1, q], q * q * m); p.solution = 'Simplify first: ' + t(sq(q * q * m) + '=' + q + sq(m)) + ', so ' + t('\\tfrac{1}{' + q + '}\\times ' + q + sq(m) + '=' + sq(m)) + '.<br>(Or square the coefficient: ' + t('\\tfrac{1}{' + q * q + '}\\times ' + F(q * q * m) + '=' + m) + '.)'; return p; } },
        { id: 'e7d', level: 'PRG', make: function (r) { var q = 3, pq = r.pick([2, 2, 4]), m = r.pick([2, 5, 6, 7]); var p = toEntire([pq, q], q * q * m); p.solution = 'Simplify first: ' + t(sq(q * q * m) + '=' + q + sq(m)) + ', so ' + t('\\tfrac{' + pq + '}{' + q + '}\\times ' + q + sq(m) + '=' + pq + sq(m) + '=\\sqrt{' + pq * pq + '\\times ' + m + '}=' + sq(pq * pq * m)) + '.'; return p; } }] },
      { num: '8', stem: function (sh) { return 'Ravi converted ' + t(sh.c + sq(sh.m)) + ' to an entire radical and wrote ' + t(sq(sh.c * sh.m)) + '.'; },
        shared: function (r) { return { c: r.pick([10, 4, 5, 6, 7, 8, 9]), m: r.pick([3, 2, 5, 6, 7]) }; },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'What was his mistake?', [
              { html: 'He multiplied ' + t(sh.c) + ' by ' + t(sh.m) + ' without squaring the ' + t(sh.c) + ' first. Moving inside the root, ' + t(sh.c) + ' becomes ' + t(sh.c + '^{2}=' + sh.c * sh.c) + '.', right: true },
              { html: 'He should have added: ' + t(sq(sh.c + sh.m)) + '.', why: 'The coefficient multiplies: ' + t(sh.c + sq(sh.m) + '=\\sqrt{' + sh.c * sh.c + '}\\times\\sqrt{' + sh.m + '}') + '.', code: 'why-wrong' },
              { html: 'There is no mistake.', why: 'Check: ' + t(sq(sh.c * sh.m) + '\\approx ' + Math.sqrt(sh.c * sh.m).toFixed(2)) + ' but ' + t(sh.c + sq(sh.m) + '\\approx ' + (sh.c * Math.sqrt(sh.m)).toFixed(2)) + '.', code: 'why-wrong' },
              { html: 'He should have squared the ' + t(sh.m) + ' as well.', why: 'Only the coefficient moves inside, so only it gets squared.', code: 'why-wrong' }],
              'To move ' + t(sh.c) + ' inside the root, write it as ' + t('\\sqrt{' + sh.c * sh.c + '}') + ': ' + t(sh.c + sq(sh.m) + '=\\sqrt{' + sh.c * sh.c + '}\\times\\sqrt{' + sh.m + '}=' + sq(sh.c * sh.c * sh.m)) + '. Ravi forgot to square the ' + t(sh.c) + '.', ['What does ' + t(sh.c) + ' look like as a square root?'], 'Ravi mistake');
          } },
          { id: 'e8b', level: 'BEG', make: function (r, sh) { var p = toEntire(sh.c, sh.m, { prompt: 'Give the correct entire radical for ' + t(sh.c + sq(sh.m)) + '.' }); return p; } }] },
      { num: '9', stem: function (sh) { return 'Nadia wrote ' + t(sq(sh.n) + '=\\sqrt{' + sh.a * sh.a + '\\times ' + sh.rest + '}=' + sh.a + sq(sh.rest)) + '.'; },
        shared: function (r) { var o = r.pick([[6, 3], [6, 2], [10, 2], [12, 3], [4, 2]]), m = r.pick([5, 2, 3, 7]); return { n: o[0] * o[0] * m, a: o[1], rest: o[0] * o[0] * m / (o[1] * o[1]), S: o[0], m: m }; },
        parts: [
          { id: 'e9a', level: 'EMG', make: function (r, sh) {
            var b = sh.S / sh.a;
            return P.mc(r, 'Why is this not in simplest form?', [
              { html: t(sh.rest + '=' + b * b + '\\times ' + sh.m) + ' still holds the perfect-square factor ' + t(b * b) + '.', right: true },
              { html: 'The coefficient ' + t(sh.a) + ' should be inside the root.', why: 'Mixed radicals keep the coefficient outside. The problem is what’s left under the root.', code: 'why-wrong' },
              { html: t(sh.rest) + ' is not a perfect square, so it is finished.', why: 'It doesn’t need to be a perfect square — any perfect-square <b>factor</b> can still come out.', code: 'simplified' },
              { html: 'She should have used ' + t('\\sqrt{' + sh.n + '}=' + sh.n / 2) + '.', why: 'A square root isn’t half the number.', code: 'why-wrong' }],
              t(sh.rest + '=' + b * b + '\\times ' + sh.m) + ', so ' + t(sh.a + sq(sh.rest)) + ' isn’t finished.', ['Look at the number left under the root. Is any perfect square a factor of it?'], 'Nadia why not simplest');
          } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) {
            var b = sh.S / sh.a, p = toMixed(1, sh.n, { prompt: 'Finish simplifying ' + t(sq(sh.n)) + '.' });
            p.solution = t(sh.a + sq(sh.rest) + '=' + sh.a + '\\times ' + b + sq(sh.m) + '=' + sh.S + sq(sh.m)) + ', so ' + t(sq(sh.n) + '=' + sh.S + sq(sh.m)) + '.';
            p.bad = (p.bad || []).concat([sh.a + sq(sh.rest)]);
            return p;
          } }] },

      /* ================= Extra practice C — Multiplying and combining ================= */
      { num: '10', section: 'Extra practice C — Multiplying and Combining Radicals', stem: 'The rule ' + t('\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}') + ' works in both directions. Multiply, then write the result in simplest form.', parts: [
        { id: 'e10a', level: 'EMG', make: function (r) { var o = gen(r, function () { return r.sample([2, 3, 5, 6, 7, 10, 14, 15], 2); }, function (o) { var n = o[0] * o[1]; return big(n) > 1 && !isSq(n); }); return prodPart(o[0], o[1]); } },
        { id: 'e10b', level: 'EMG', make: function (r) { var a = r.pick([2, 3, 5, 6, 7]), k = r.int(2, 5); return prodPart(a, a * k * k); } },
        { id: 'e10c', level: 'EMG', make: function (r) {
          var c = r.int(2, 6), m = r.pick([2, 3, 5, 6, 7]), v = c * c * m;
          return P.number(t('\\left(' + c + sq(m) + '\\right)^{2}'), v, function (x) { if (x === c * m) return { code: 'u1l6-square-whole', hint: 'Square <b>both</b> parts: ' + t(c + '^{2}=' + c * c) + ' and ' + t('\\left(\\sqrt{' + m + '}\\right)^{2}=' + m) + '.' }; if (x === 2 * c * m) return { code: 'doubled', hint: 'Squaring isn’t doubling: ' + t('\\left(' + c + sq(m) + '\\right)^{2}=' + c + sq(m) + '\\times ' + c + sq(m)) + '.' }; if (x === c * c) return { code: 'u1l6-square-whole', hint: 'Don’t forget ' + t('\\left(\\sqrt{' + m + '}\\right)^{2}=' + m) + '.' }; return null; },
            t('\\left(' + c + sq(m) + '\\right)^{2}=' + c + sq(m) + '\\times ' + c + sq(m) + '=' + c + '^{2}\\times\\left(\\sqrt{' + m + '}\\right)^{2}=' + c * c + '\\times ' + m + '=' + v) + '.', ['Square the coefficient and square the root: ' + t('\\left(\\sqrt{a}\\right)^{2}=a') + '.'], 'square of ' + c + 'sqrt' + m);
        } },
        { id: 'e10d', level: 'PRG', make: function (r) { var o = r.pick([[15, 35], [6, 15], [10, 15], [14, 21], [6, 10], [10, 35], [15, 21], [6, 21], [14, 35], [21, 35]]); return prodPart(o[0], o[1]); } }] },
      { num: '11', stem: 'Multiply and simplify.',
        shared: function (r) {
          var a = r.int(2, 5), b = r.int(2, 5), p = r.pick([2, 3, 5]), q = r.pick([2, 3, 5, 6].filter(function (x) { return x !== p && !isSq(p * x); }));
          var c = r.int(2, 7), m = r.pick([2, 3, 5]), u = r.pick([2, 3, 5]), k1 = r.int(2, 3), k2 = gen(r, function () { return r.int(2, 4); }, function (x) { return x !== k1; });
          return { a: a, b: b, p: p, q: q, c: c, m: m, u: u, k1: k1, k2: k2 };
        },
        parts: [
          { id: 'e11a', level: 'PRG', make: function (r, sh) {
            var C = sh.a * sh.b, n = sh.p * sh.q, s = big(n), mm = n / (s * s);
            var p = toMixed(C, n, { prompt: t(sh.a + sq(sh.p) + '\\times ' + sh.b + sq(sh.q)), text: 'multiply ' + sh.a + 'sqrt' + sh.p + ' x ' + sh.b + 'sqrt' + sh.q });
            p.solution = 'Multiply the coefficients and the radicals: ' + t(sh.a + '\\times ' + sh.b + '=' + C) + ' and ' + t(sq(sh.p) + '\\times ' + sq(sh.q) + '=' + sq(n)) + ', so the product is ' + t(C + sq(n)) + '.<br>' + mixedSol(C, n, String(C));
            p.hints = ['Multiply the numbers in front, and multiply the numbers under the roots.', 'Then simplify the radical and multiply what comes out by the coefficient.'];
            return p;
          } },
          { id: 'e11b', level: 'EMG', make: function (r, sh) {
            var c = sh.c, m = sh.m, v = c * c * m;
            return P.number(t('\\left(' + c + sq(m) + '\\right)^{2}'), v, function (x) { return x === c * m ? { code: 'u1l6-square-whole', hint: 'Square both parts: ' + t(c + '^{2}') + ' and ' + t('\\left(\\sqrt{' + m + '}\\right)^{2}') + '.' } : x === 2 * c * m ? { code: 'doubled', hint: 'Squaring isn’t doubling.' } : null; },
              t('\\left(' + c + sq(m) + '\\right)^{2}=' + c + '^{2}\\times ' + m + '=' + c * c + '\\times ' + m + '=' + v) + ' — no radical left.', ['Square the coefficient and square the root.'], 'square ' + c + 'sqrt' + m);
          } },
          { id: 'e11c', level: 'EMG', make: function (r, sh) {
            var a = sh.u * sh.k1 * sh.k1, b = sh.u * sh.k2 * sh.k2, v = sh.u * sh.k1 * sh.k2;
            return P.number(t(sq(a) + '\\times ' + sq(b)), v, function (x) { return x === a * b ? { code: 'no-root', hint: t(sq(a) + '\\times ' + sq(b) + '=\\sqrt{' + a * b + '}') + ' — now take the square root.' } : null; },
              t(sq(a) + '\\times ' + sq(b) + '=\\sqrt{' + F(a * b) + '}=' + v) + ' (because ' + t(v + '\\times ' + v + '=' + F(a * b)) + ').', ['Multiply under one root: ' + t('\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}') + '. Is the result a perfect square?'], 'sqrt' + a + ' x sqrt' + b);
          } },
          { id: 'e11d', sub: 'which', level: 'BEG', make: function (r, sh) {
            var opts = [{ value: 'a', html: '(a) ' + t(sh.a + sq(sh.p) + '\\times ' + sh.b + sq(sh.q)) }, { value: 'b', html: '(b) ' + t('\\left(' + sh.c + sq(sh.m) + '\\right)^{2}') }, { value: 'c', html: '(c) ' + t(sq(sh.u * sh.k1 * sh.k1) + '\\times ' + sq(sh.u * sh.k2 * sh.k2)) }];
            var check = K.selectSet(['b', 'c'], function (extra, missing) { return extra.length ? { code: 'u1l6-rational-pick', hint: 'Part (a) still has a square root that doesn’t simplify away, so it is irrational.' } : { code: 'u1l6-rational-pick', hint: 'Look at your answers to (b) and (c): is any root left?' }; });
            return { prompt: 'Which of the three answers are <b>rational</b> (no radical left)?', input: { type: 'select', options: opts }, check: check, key: ['b', 'c'], answer: '(b) and (c)', bad: [['a', 'b', 'c'], ['b']],
              solution: '(b) and (c) work out to whole numbers, so they are rational. (a) still has a radical whose number has no perfect-square factor left, so it is irrational.', hints: ['A whole-number answer is rational; a simplified radical like ' + t('2\\sqrt{3}') + ' is irrational.'], text: 'which products rational' };
          } }] },
      { num: '12', stem: '<b>Like radicals.</b> Two radicals can be added or subtracted only when the number under the root is the same — then you count them, like ' + t('3x+5x=8x') + '. For example, ' + t('\\sqrt{8}+\\sqrt{32}=2\\sqrt{2}+4\\sqrt{2}=6\\sqrt{2}') + '. Simplify each radical first, then combine.', parts: [
        { id: 'e12a', level: 'EMG', make: function (r) { var m = r.pick([3, 2, 5, 6, 7]), ab = r.sample([1, 2, 3, 4], 2); if (ab[0] === 1 && ab[1] === 1) ab = [2, 3]; return likePart([{ s: 1, a: ab[0] }, { s: 1, a: ab[1] }], m, 'like radicals sum'); } },
        { id: 'e12b', level: 'EMG', make: function (r) { var m = r.pick([2, 3, 5, 6, 7]), a = r.int(3, 5), b = r.int(2, a - 1); return likePart([{ s: 1, a: a }, { s: -1, a: b }], m, 'like radicals difference'); } },
        { id: 'e12c', level: 'EMG', make: function (r) { var m = r.pick([5, 2, 3, 7]), ab = r.sample([2, 3, 4, 5], 2); return likePart([{ s: 1, a: ab[0] }, { s: 1, a: ab[1] }], m, 'like radicals sum 2'); } },
        { id: 'e12d', level: 'PRG', make: function (r) { var m = r.pick([2, 3, 5]), v = gen(r, function () { return [r.int(1, 3), r.int(2, 4), r.int(2, 5)]; }, function (v) { return v[0] + v[1] - v[2] > 0 && v[0] !== v[1] && v[1] !== v[2] && v[0] !== v[2]; }); return likePart([{ s: 1, a: v[0] }, { s: 1, a: v[1] }, { s: -1, a: v[2] }], m, 'like radicals three terms'); } }] },
      { num: '13', stem: 'Simplify each radical, then combine.', parts: [
        { id: 'e13a', level: 'PRG', make: function (r) { var m = r.pick([2, 3]), v = gen(r, function () { return [r.int(5, 7), r.int(2, 3), r.int(6, 10)]; }, function (v) { return v[0] !== v[2]; }); return likePart([{ s: 1, a: v[0] }, { s: -1, a: v[1] }, { s: 1, a: v[2] }], m, 'combine three'); } },
        { id: 'e13b', level: 'PRG', make: function (r) { var m = r.pick([3, 2, 5]), a = r.int(2, 3), b = r.int(2, 4); return likePart([{ s: 1, a: 3 }, { s: 1, a: b }], m, 'coefficient and like radicals', [a, 1]); } },
        { id: 'e13c', level: 'PRG', make: function (r) { var m = r.pick([6, 10, 5, 7]), ab = r.sample([2, 3, 4], 2); return likePart([{ s: 1, a: ab[0] }, { s: 1, a: ab[1] }], m, 'like radicals m=' + m); } }] },
      { num: '14', stem: function (sh) { return 'Is it true that ' + t('\\sqrt{a}+\\sqrt{b}=\\sqrt{a+b}') + '? Test it with ' + t('a=' + sh.a) + ' and ' + t('b=' + sh.b) + '.'; },
        shared: function (r) { return r.pick([{ a: 9, b: 16 }, { a: 36, b: 64 }, { a: 25, b: 144 }, { a: 81, b: 144 }, { a: 16, b: 9 }, { a: 64, b: 36 }, { a: 144, b: 256 }, { a: 64, b: 225 }, { a: 49, b: 576 }, { a: 144, b: 25 }, { a: 225, b: 64 }, { a: 400, b: 225 }]); },
        parts: [
          { id: 'e14a', level: 'BEG', make: function (r, sh) {
            var a = sh.a, b = sh.b, L = Math.sqrt(a) + Math.sqrt(b), Rr = Math.sqrt(a + b);
            return P.fields('Work out both sides.', [{ name: 'Left side', label: t('\\sqrt{' + a + '}+\\sqrt{' + b + '}=') }, { name: 'Right side', label: t('\\sqrt{' + a + '+' + b + '}=') }],
              [K.number(L, function (v) { return v === Rr ? { code: 'add-radicands', hint: 'On the left, take each root first: ' + t('\\sqrt{' + a + '}=' + Math.sqrt(a)) + '.' } : null; }), K.number(Rr, function (v) { return v === L ? { code: 'add-radicands', hint: 'On the right, add first: ' + t(a + '+' + b + '=' + (a + b)) + ', then take the root.' } : null; })],
              [String(L), String(Rr)], t(Math.sqrt(a) + '+' + Math.sqrt(b) + '=' + L) + ' and ' + t('\\sqrt{' + (a + b) + '}=' + Rr), t('\\sqrt{' + a + '}+\\sqrt{' + b + '}=' + Math.sqrt(a) + '+' + Math.sqrt(b) + '=' + L) + ', but ' + t('\\sqrt{' + a + '+' + b + '}=\\sqrt{' + (a + b) + '}=' + Rr) + '.', ['Left: take each root, then add. Right: add, then take the root.'], 'test sqrt a + sqrt b');
          } },
          { id: 'e14b', level: 'BEG', make: function (r, sh) {
            return P.mc(r, 'What is your conclusion?', [
              { html: 'It is <b>false</b>: the two sides are different, so ' + t('\\sqrt{a}+\\sqrt{b}\\ne\\sqrt{a+b}') + '. The rule works for multiplication, not addition.', right: true },
              { html: 'It is true: both sides are whole numbers.', why: 'Both are whole numbers, but are they the <b>same</b> whole number?' },
              { html: 'It is true for perfect squares only.', why: 'It just failed for two perfect squares.' },
              { html: 'You can’t tell from one example.', why: 'One counterexample is enough to show a rule is false.' }],
              t(Math.sqrt(sh.a) + Math.sqrt(sh.b) + '\\ne ' + Math.sqrt(sh.a + sh.b)) + ', so the rule is <b>false</b>. (' + t('\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}') + ' is the rule that works.)', ['Compare your two answers from (a).'], 'conclusion sqrt sum');
          } }] },
      { num: '15', stem: '', parts: [
        { id: 'e15', level: 'PRG', make: function (r) {
          var a = r.pick([2, 3, 5]), b = r.pick([3, 5, 7].filter(function (x) { return x !== a; })), k = r.pick([2, 3]);
          return P.mc(r, 'Why can’t ' + t(sq(a) + '+' + sq(b)) + ' be written as a single mixed radical — and what happens with ' + t(sq(a) + '+' + sq(k * k * b)) + '?', [
            { html: t(sq(a)) + ' and ' + t(sq(b)) + ' have different numbers under the roots and neither simplifies, so there is nothing to count. ' + t(sq(k * k * b) + '=' + k + sq(b)) + ', but ' + t(sq(a) + '+' + k + sq(b)) + ' still has different roots, so it can’t be combined either.', right: true },
              { html: 'Add the numbers under the roots: ' + t(sq(a) + '+' + sq(b) + '=' + sq(a + b)) + '.', why: t('\\sqrt{a}+\\sqrt{b}\\ne\\sqrt{a+b}') + ': try ' + t('\\sqrt{9}+\\sqrt{16}') + '.' },
              { html: 'The second one combines: ' + t(sq(a) + '+' + sq(k * k * b) + '=' + (k + 1) + sq(a)) + '.', why: 'After simplifying, the second root is ' + t(k + sq(b)) + ' — a different root from ' + t(sq(a)) + ', so they aren’t like radicals.' },
              { html: 'Both can be combined once you use a calculator.', why: 'A calculator gives a decimal, not a single exact mixed radical.' }],
            t(sq(a)) + ' and ' + t(sq(b)) + ' are unlike radicals (different numbers under the roots), so ' + t(sq(a) + '+' + sq(b)) + ' stays as it is. Simplifying gives ' + t(sq(a) + '+' + sq(k * k * b) + '=' + sq(a) + '+' + k + sq(b)) + ': the roots are still different, so it can’t be combined.', ['Simplify each radical. Are the numbers under the roots the same?'], 'why unlike radicals don’t combine');
        } }] },

      /* ================= Extra practice D — Ordering, geometry, reasoning ================= */
      { num: '16', section: 'Extra practice D — Ordering, Geometry, and Reasoning', stem: 'Convert each one to an entire radical first.', parts: [
        { id: 'e16', level: 'PRG', make: function (r) { return orderPart(r, orderItems(r, 4, 1, 40, 99), false, 'order 5 radicals'); } }] },
      { num: '17', stem: function (sh) { return 'Consider ' + sh.items.map(function (x) { return t(x.tex); }).join(',  ') + '.'; },
        shared: function (r) { return { items: orderItems(r, 2, 1, 15, 60, true) }; },
        parts: [
          { id: 'e17a', level: 'PRG', make: function (r, sh) { var p = orderPart(r, sh.items, true, 'order negative radicals'); p.prompt = 'Without a calculator, arrange them from <b>greatest to least</b>.'; return p; } },
          { id: 'e17b', level: 'EMG', make: function (r) {
            return P.mc(r, 'Why does the ordering reverse once the radicals are negative?', [
              { html: 'A bigger number under the root gives a bigger root, but the opposite of a bigger number is a <b>smaller</b> number (further left on the number line).', right: true },
              { html: 'Negative numbers can’t be compared.', why: 'They can: ' + t('-5<-3') + ' because ' + t('-5') + ' is further left.' },
              { html: 'The coefficients become negative, so you subtract them.', why: 'Convert to entire radicals as usual; the minus sign just flips the order at the end.' },
              { html: 'It doesn’t reverse: the biggest number under the root is still the greatest.', why: t('-\\sqrt{20}') + ' is further left than ' + t('-\\sqrt{17}') + ', so it is <b>smaller</b>.' }],
              'For positive radicals, a bigger number under the root means a bigger value. Taking the opposite flips that: if ' + t('\\sqrt{20}>\\sqrt{17}') + ', then ' + t('-\\sqrt{20}<-\\sqrt{17}') + '.', ['Think of ' + t('5>3') + ' and ' + t('-5<-3') + '.'], 'why order reverses');
          } }] },
      { num: '18', stem: function (sh) { return squareFig('A = ' + sh.A + ' cm²') + 'A square has an area of ' + t(sh.A) + ' square centimetres.'; },
        shared: function (r) { var s = r.int(2, 6), m = r.pick([2, 3, 5, 6, 7]); return { A: s * s * m, s: s, m: m }; },
        parts: [
          { id: 'e18a', level: 'EMG', make: function (r, sh) { var p = toMixed(1, sh.A, { prompt: 'Determine its exact side length in simplest mixed radical form.', text: 'side from area ' + sh.A }); p.input.after = 'cm'; return p; } },
          { id: 'e18b', level: 'PRG', make: function (r, sh) { return perimPart(sh.s, sh.m); } }] },
      { num: '19', stem: '', parts: [
        { id: 'e19', level: 'PRG', make: function (r) {
          var o = gen(r, function () { var g = r.int(2, 4), pq = r.sample([1, 2, 3, 4, 5], 2).sort(); return { g: g, p: pq[0], q: pq[1] }; }, function (o) { return sqFree(o.p * o.p + o.q * o.q) && o.g * o.q <= 16; });
          var a = o.g * o.p, b = o.g * o.q, S = a * a + b * b;
          var p = toMixed(1, S, { prompt: rectDiag(a, b, 'cm') + 'A rectangle measures ' + t(a) + ' cm by ' + t(b) + ' cm. Use the Pythagorean theorem to find the <b>exact</b> length of its diagonal in simplest mixed radical form.', text: 'rectangle diagonal ' + a + ' x ' + b,
            more: function (val) { return near(val, Math.sqrt(Math.abs(b * b - a * a))) ? { code: 'u1l6-hyp', hint: 'The diagonal is the hypotenuse: <b>add</b> the squares of the sides, ' + t('d^{2}=' + a + '^{2}+' + b + '^{2}') + '.' } : near(val, a + b) ? { code: 'u1l6-hyp', hint: 'Square the sides first: ' + t('d^{2}=' + a + '^{2}+' + b + '^{2}') + '.' } : null; } });
          p.input.after = 'cm';
          p.solution = t('d^{2}=' + a + '^{2}+' + b + '^{2}=' + a * a + '+' + b * b + '=' + S) + ', so ' + t('d=' + sq(S)) + '.<br>' + mixedSol(1, S, '');
          p.hints = ['The diagonal splits the rectangle into two right triangles: ' + t('d^{2}=a^{2}+b^{2}') + '.', 'Then simplify ' + t('\\sqrt{d^{2}}') + '.'];
          return p;
        } }] },
      { num: '20', stem: function (sh) { return squareFig('A = ' + sh.A + ' ft²') + 'A square tarp has an area of ' + t(sh.A) + ' square feet.'; },
        shared: function (r) { var s = r.int(6, 12), m = r.pick([2, 3, 2, 5]); return { A: s * s * m, s: s, m: m }; },
        parts: [
          { id: 'e20a', level: 'EMG', make: function (r, sh) { var p = toMixed(1, sh.A, { prompt: 'Determine the exact side length in simplest mixed radical form.', text: 'tarp side from area ' + sh.A }); p.input.after = 'ft'; return p; } },
          { id: 'e20b', level: 'PRG', make: function (r, sh) { var p = perimPart(sh.s, sh.m); p.input.after = 'ft'; p.solution = p.solution.replace(/cm/g, 'ft'); return p; } }] },
      { num: '21', stem: '', parts: [
        { id: 'e21', level: 'PRG', make: function (r) {
          var o = gen(r, function () { var g = r.int(2, 3), pq = r.sample([1, 2, 3, 4, 5, 6], 2).sort(); return { g: g, p: pq[0], q: pq[1] }; }, function (o) { var S = o.p * o.p + o.q * o.q; return sqFree(S) && o.g * o.q <= 15; });
          var a = o.g * o.p, b = o.g * o.q, S = a * a + b * b;
          var p = toMixed(1, S, { prompt: rightTri(a, b, 'm') + 'A right triangle has legs of ' + t(a) + ' m and ' + t(b) + ' m. Determine the <b>exact</b> length of the hypotenuse in simplest mixed radical form.', text: 'hypotenuse ' + a + ', ' + b,
            more: function (val) { return near(val, Math.sqrt(Math.abs(b * b - a * a))) ? { code: 'u1l6-hyp', hint: 'For the hypotenuse, <b>add</b> the squares of the legs: ' + t('c^{2}=' + a + '^{2}+' + b + '^{2}') + '.' } : near(val, a + b) ? { code: 'u1l6-hyp', hint: 'Square the legs first.' } : null; } });
          p.input.after = 'm';
          p.solution = t('c^{2}=' + a + '^{2}+' + b + '^{2}=' + a * a + '+' + b * b + '=' + S) + ', so ' + t('c=' + sq(S)) + '.<br>' + mixedSol(1, S, '');
          p.hints = ['Pythagorean theorem: ' + t('c^{2}=a^{2}+b^{2}') + '.', 'Then simplify ' + t('\\sqrt{c^{2}}') + '.'];
          return p;
        } }] },
      { num: '22', stem: function (sh) { return '<b>Stretch.</b> An entire radical ' + t('\\sqrt{n}') + ' can be rewritten as a mixed radical (or a whole number) exactly when ' + t('n') + ' has a perfect-square factor greater than ' + t('1') + '. Consider the whole numbers from ' + t('2') + ' to ' + t(sh.N) + '.'; },
        shared: function (r) { var N = r.int(36, 60); var list = []; for (var n = 2; n <= N; n++) if (big(n) > 1) list.push(n); return { N: N, list: list, sqs: list.filter(isSq) }; },
        parts: [
          { id: 'e22a', level: 'MAS', make: function (r, sh) {
            var want = sh.list;
            return { prompt: 'List every whole number ' + t('n') + ' from ' + t('2') + ' to ' + t(sh.N) + ' for which ' + t('\\sqrt{n}') + ' simplifies.', input: { type: 'list', help: 'Add each number with <b>Enter</b> or a comma. Tap a number to remove it.' }, key: want.map(String),
              check: function (resp) {
                if (!resp || !resp.length) return form('empty', 'Add the numbers one at a time (press Enter or comma after each).');
                var vals = resp.map(Number), seen = {};
                for (var i = 0; i < vals.length; i++) { if (seen[vals[i]]) return form('duplicate', 'You listed ' + t(vals[i]) + ' twice.'); seen[vals[i]] = 1; }
                var bad = vals.filter(function (v) { return want.indexOf(v) < 0; });
                if (bad.length) { var b = bad[0]; return wrong('u1l6-list', b < 2 || b > sh.N ? t(b) + ' is outside ' + t('2') + ' to ' + t(sh.N) + '.' : t(b + '=' + K.fac(b)) + ' has no perfect-square factor (no prime appears twice), so ' + t('\\sqrt{' + b + '}') + ' doesn’t simplify.'); }
                var miss = want.filter(function (v) { return vals.indexOf(v) < 0; });
                if (miss.length) { var d = [4, 9, 25, 49].filter(function (s) { return miss[0] % s === 0; })[0]; return wrong('u1l6-list', 'You’re missing ' + (miss.length === 1 ? 'one' : t(miss.length)) + '. Run through the multiples of ' + t('4') + ', then of ' + t('9') + ', then of ' + t('25') + ' and ' + t('49') + '. (For example, check the multiples of ' + t(d) + '.)'); }
                return ok();
              },
              answer: t(want.join(',\\ ')), solution: 'Multiples of ' + t('4') + ': ' + t(want.filter(function (n) { return n % 4 === 0; }).join(', ')) + '. Multiples of ' + t('9') + ' not yet listed: ' + t(want.filter(function (n) { return n % 9 === 0 && n % 4 !== 0; }).join(', ') || '\\text{none}') + '. Multiples of ' + t('25') + ': ' + t(want.filter(function (n) { return n % 25 === 0 && n % 4 && n % 9; }).join(', ') || '\\text{none}') + '. ' + t('49') + ': ' + t(sh.N >= 49 ? '49' : '\\text{none}') + '.<br>All together (' + t(want.length) + ' numbers): ' + t(want.join(', ')) + '.',
              hints: ['A perfect-square factor greater than 1 means a multiple of ' + t('4, 9, 25') + ' or ' + t('49') + ' (any other perfect square, like ' + t('16') + ' or ' + t('36') + ', is already a multiple of ' + t('4') + ' or ' + t('9') + ').', 'Don’t count a number twice (' + t('36') + ' is a multiple of both ' + t('4') + ' and ' + t('9') + ').'], text: 'list n that simplify to ' + sh.N,
              bad: [want.slice(1).map(String), want.concat([sh.N + 1 <= sh.N ? 2 : 6]).map(String), want.filter(function (n) { return n % 4 === 0; }).map(String)] };
          } },
          { id: 'e22b', level: 'ADV', make: function (r, sh) {
            return P.fields('How many numbers are on your list? Of those, how many give a whole-number answer with no radical left?', [{ name: 'On the list', label: 'Numbers on the list:' }, { name: 'Whole-number answers', label: 'Whole-number answers:' }],
              [K.number(sh.list.length, function (v) { return { code: 'u1l6-count', hint: 'Count your list from (a) again — the multiples of 4, then 9, then 25 and 49, each number once.' }; }), K.number(sh.sqs.length, function (v) { return v === sh.sqs.length + 1 ? { code: 'u1l6-count', hint: t('1') + ' isn’t on the list (it starts at ' + t('2') + ').' } : { code: 'u1l6-count', hint: 'Which numbers on your list are perfect squares?' }; })],
              [String(sh.list.length), String(sh.sqs.length)], t(sh.list.length) + ' numbers; ' + t(sh.sqs.length) + ' are perfect squares (' + t(sh.sqs.join(', ')) + ')',
              t(sh.list.length) + ' numbers from ' + t('2') + ' to ' + t(sh.N) + ' have a perfect-square factor. Of them, ' + t(sh.sqs.length) + ' are perfect squares themselves — ' + t(sh.sqs.join(', ')) + ' — so their roots are whole numbers with no radical left.', ['Count your list. Then count the perfect squares on it.'], 'count simplifiable to ' + sh.N);
          } }] }
    ]
  });

  /* ---------- part makers used above ---------- */
  function ladderPart(n, kind) {
    var p = { prompt: (kind === 'tree' ? 'Use a factor tree to write ' : 'Use a division ladder to write ') + t(F(n)) + ' as a product of primes.', input: { type: kind, n: n, exponent: false },
      check: (function (c) { return function (resp) { if (!resp || !resp.done) return form('unfinished', kind === 'tree' ? 'Finish the tree first: every branch must end in a circled prime.' : 'Finish the ladder first: keep dividing until the quotient is ' + t('1') + '.'); return c(resp.final); }; })(K.product(n, 'either')),
      key: { done: true, final: K.fac(n) }, answer: t(F(n) + '=' + K.fac(n)), text: (kind === 'tree' ? 'factor tree: ' : 'division ladder: ') + n,
      solution: (kind === 'tree' ? 'Any factor tree ends in the same primes. ' : 'Divide by the smallest prime each time:') + (kind === 'tree' ? '' : K.ladderSolution(n)) + t(F(n) + '=' + K.exp(n) + '=' + K.fac(n)),
      hints: [kind === 'tree' ? 'Split ' + t(F(n)) + ' into any factor pair and keep branching until every branch ends in a prime.' : 'Divide by the smallest prime that fits, then repeat with what is left.', 'Check: multiply your primes back together — do you get ' + t(F(n)) + '?'] };
    return p;
  }
  function pfMixed(n) {
    var s = big(n), m = n / (s * s), f = nt.factor(n);
    var p = toMixed(1, n, { prompt: 'Now write ' + t(sq(n)) + ' as a mixed radical in simplest form.', text: 'mixed radical from factorization ' + n });
    p.solution = t(F(n) + '=' + K.fac(n)) + '. The pair of ' + f.filter(function (pe) { return pe[1] > 1; }).map(function (pe) { return t(pe[0]) + '’s'; }).join(' and ') + ' gives ' + t(s) + ' outside the root; the unpaired primes stay inside: ' + t(sq(n) + '=' + s + '\\sqrt{' + nt.factor(m).map(function (pe) { return pe[0]; }).join('\\times ') + '}=' + ansTex(s, m)) + '.';
    p.hints = ['Look at your prime factorization: each <b>pair</b> of equal primes moves one copy outside the root.', 'Multiply the unpaired primes together under the root.'];
    return p;
  }
  function prodPart(a, b) {
    var n = a * b, p = toMixed(1, n, { prompt: t(sq(a) + '\\times ' + sq(b)), text: 'sqrt' + a + ' x sqrt' + b,
      more: function (val) { return near(val, Math.sqrt(a + b)) ? { code: 'add-radicands', hint: 'Multiply the numbers under the roots: ' + t('\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}') + '.' } : null; } });
    p.solution = t(sq(a) + '\\times ' + sq(b) + '=\\sqrt{' + a + '\\times ' + b + '}=' + sq(n)) + '.<br>' + mixedSol(1, n, '');
    p.hints = ['Multiply under one root: ' + t('\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}') + '.', 'Then simplify: find the largest perfect square that divides the product.'];
    return p;
  }
  function perimPart(s, m) {
    var P4 = 4 * s, check = K.radical({ k: [P4, 1], n: 2, m: m }, 'mixed', { diag: function (val) {
      if (near(val, s * Math.sqrt(m))) return { code: 'u1l6-perimeter', hint: 'That’s one side. The perimeter is ' + t('4') + ' sides: ' + t('4\\times ' + s + sq(m)) + '.' };
      if (near(val, 2 * s * Math.sqrt(m))) return { code: 'u1l6-perimeter', hint: 'A square has <b>four</b> sides.' };
      if (near(val, Math.sqrt(4 * s * s * m)) && false) return null;
      return null;
    } });
    return mathPart('Determine its exact perimeter.', check, ex.texRadical([P4, 1], 2, m), t(P4 + sq(m)), 'Perimeter ' + t('=4s=4\\times ' + s + sq(m) + '=' + P4 + sq(m)) + ' cm. (Multiply the coefficient by ' + t('4') + '; the radical stays the same.)',
      ['A square has four equal sides: ' + t('P=4s') + '.', 'Multiply only the number in front: ' + t('4\\times a\\sqrt{b}=4a\\sqrt{b}') + '.'], 'perimeter 4 x ' + s + 'sqrt' + m, { bad: [s + sq(m), sq(4 * s * s * m * 4)] });
  }
})(window);
