/* Math 15 · Unit 2 (Exponents: powers, the exponent laws, zero and negative exponents, scientific notation, rational
 * exponents and radicals) — exit slips for Lessons 1–10 (u2l1x … u2l10x), written in test mode. All questions are AN3
 * (Ryan's tags). No calculator (Ryan's Math 15 Unit 2 paper tests say "No calculator"), so every number stays friendly.
 * Each slip is Ryan's own Math 15 exit slip for that lesson (his older exit-slip app, Versions A and B), turned into
 * generators: the same questions, skills, outcomes and levels (his tags), with his Version A and B numbers among the
 * possible values. Every part has a key built from the generated values, a worked solution, hints, and `bad` answers
 * with u2x- codes (labels and partial-credit decisions below). Answers with letters are checked with K.expo (equivalent
 * value + the form asked for, typical wrong answers recognized by equivalence); typing the question's own expression
 * back earns nothing (u2x-given). His figures (rectangle, square) are drawn as SVG with his labels.
 * Changes from his slips:
 *  - One short Mastery question was added where his slip had none, at Math 15 difficulty, taken from the lesson's own
 *    hardest assignment / extra-practice items: L1 volume of a box with a square base (Q13, with coefficients); L2 a
 *    missing exponent with two laws, (a^x)^3 ÷ a^4 = a^11 (Q10–11 combined); L3 power of a quotient with a coefficient,
 *    (2a²/b)³ (Q8c, EP3 Q4); L5 a zero exponent inside a squared bracket with a quotient (Q9b–10); L6 a quotient with two
 *    variables and negative exponents (Q10); L8 rewrite 47 × 10³ or 0.8 × 10⁻² in proper scientific notation (Q9);
 *    L9 a fraction base with a rational (sometimes negative) exponent, (16/81)^(3/4), (9/4)^(−1/2) (Q3c, Q12).
 *    L4, L7 and L10 already had one (his tags).
 *  - Multiple choice kept where it tests recognition: L5 Q1 (6x⁰) and L8 the ordering list (each wrong list is one of
 *    his misconceptions). No MC above Progressing.
 *  - L5 Q2 and L10 Q2 accept a fraction (or a terminating decimal); L2 Q3 and Q4 accept "n = 12" as well as 12.
 * Answers: expressions on the exponent keypad; numbers as integers or fractions; scientific notation with the ×10ⁿ key;
 * standard notation as a decimal. */
(function (root) {
  'use strict';
  var HW = root.HW, F = HW.fmt, K = HW.kit, ex = HW.ex, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'u2x-mult-exp': 'Multiplied exponents instead of adding (product law)', 'u2x-add-exp': 'Added exponents instead of multiplying (power of a power)',
    'u2x-div-exp': 'Divided exponents instead of subtracting (quotient law)', 'u2x-add-for-sub': 'Added exponents instead of subtracting (quotient law)',
    'u2x-base-times-exp': 'Multiplied the base by the exponent', 'u2x-hidden-one': 'Forgot that a letter with no exponent has exponent 1',
    'u2x-coef-not-raised': 'Didn’t raise the number in front to the power', 'u2x-coef-times-exp': 'Multiplied the number in front by the exponent',
    'u2x-coef-added': 'Added the numbers in front instead of multiplying', 'u2x-sub-coef': 'Subtracted the numbers in front instead of dividing',
    'u2x-neg-base': 'Minus sign outside the power treated as part of the base (or the reverse)', 'u2x-even-neg': 'Kept a minus sign under an even power',
    'u2x-odd-neg': 'Dropped the minus sign under an odd power', 'u2x-dim-missing': 'Volume: left out one of the three dimensions',
    'u2x-var-not-raised': 'Didn’t raise the letter to the power', 'u2x-missed-factor': 'Didn’t apply the outside exponent to every factor',
    'u2x-perimeter': 'Found the perimeter (added the sides) instead of the area', 'u2x-not-divided': 'Missing exponent: forgot to divide by the outside power',
    'u2x-zero-pow': 'Took a zero exponent to give 0', 'u2x-zero-whole': 'Made the whole term 1 (the zero exponent belongs to one base)',
    'u2x-zero-inside': 'Applied the zero exponent to the letter only, not the whole bracket', 'u2x-zero-ignored': 'Ignored the zero exponent',
    'u2x-order-ops': 'Added before multiplying (order of operations)', 'u2x-opposite': 'Treated a negative exponent as a negative sign',
    'u2x-neg-value': 'Made the value negative for a negative exponent', 'u2x-no-flip': 'Didn’t take the reciprocal for a negative exponent',
    'u2x-dropped-neg': 'Dropped the minus sign of a negative exponent', 'u2x-coef-side': 'Moved the number in front across the fraction bar',
    'u2x-sub-neg': 'Sign slip adding or subtracting a negative exponent', 'u2x-coef-pos-power': 'Left the number in front on top (negative power)',
    'u2x-std-off': 'Moved the decimal point one place too many or too few', 'u2x-std-dir': 'Moved the decimal point the wrong way',
    'u2x-sci-sign': 'Wrong sign on the power of 10', 'u2x-sci-noadjust': 'Didn’t change the power of 10 after moving the decimal point',
    'u2x-sci-adjust': 'Changed the power of 10 the wrong way after moving the decimal point', 'u2x-sci-mult': 'Multiplied the powers of 10 instead of adding their exponents',
    'u2x-sci-coef-add': 'Added the numbers in front instead of multiplying', 'u2x-root-times': 'Multiplied the root by the numerator instead of raising it to that power',
    'u2x-power-only': 'Took the root but forgot the power (or the reverse)', 'u2x-no-root': 'Raised to the power but didn’t take the root',
    'u2x-index-power': 'Swapped the index and the power', 'u2x-num-coef': 'Wrote the exponent’s numerator as a number in front',
    'u2x-sqrt-default': 'Used a square root instead of the root the denominator gives', 'u2x-add-den': 'Added the tops and the bottoms of fractional exponents',
    'u2x-given': 'Gave back the expression from the question (no work)'
  });
  HW.addPartial({
    'u2x-mult-exp': 'b', 'u2x-add-exp': 'b', 'u2x-div-exp': 'b', 'u2x-add-for-sub': 'b', 'u2x-base-times-exp': 'n', 'u2x-hidden-one': 's',
    'u2x-coef-not-raised': 'b', 'u2x-coef-times-exp': 'b', 'u2x-coef-added': 'b', 'u2x-sub-coef': 'b', 'u2x-neg-base': 'b', 'u2x-even-neg': 's', 'u2x-odd-neg': 's',
    'u2x-dim-missing': 'b', 'u2x-var-not-raised': 'b', 'u2x-missed-factor': 'b', 'u2x-perimeter': 'n', 'u2x-not-divided': 'b',
    'u2x-zero-pow': 'n', 'u2x-zero-whole': 'n', 'u2x-zero-inside': 'b', 'u2x-zero-ignored': 'n', 'u2x-order-ops': 's',
    'u2x-opposite': 'n', 'u2x-neg-value': 'n', 'u2x-no-flip': 'b', 'u2x-dropped-neg': 'b', 'u2x-coef-side': 'b', 'u2x-sub-neg': 's', 'u2x-coef-pos-power': 'b',
    'u2x-std-off': 's', 'u2x-std-dir': 'b', 'u2x-sci-sign': 'b', 'u2x-sci-noadjust': 's', 'u2x-sci-adjust': 's', 'u2x-sci-mult': 'b', 'u2x-sci-coef-add': 'n',
    'u2x-root-times': 'b', 'u2x-power-only': 'b', 'u2x-no-root': 'b', 'u2x-index-power': 'b', 'u2x-num-coef': 'b', 'u2x-sqrt-default': 'b', 'u2x-add-den': 'b',
    'u2x-given': 'n'
  });

  /* ---------- rationals and LaTeX (from the 10C Unit 2 slips) ---------- */
  function R(x, q) { return typeof x === 'number' ? ex.norm(x, q == null ? 1 : q) : ex.norm(x[0], x[1]); }
  function add(a, b) { a = R(a); b = R(b); return ex.norm(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function mul(a, b) { a = R(a); b = R(b); return ex.norm(a[0] * b[0], a[1] * b[1]); }
  function neg(a) { a = R(a); return [-a[0], a[1]]; }
  function inv(a) { a = R(a); return ex.norm(a[1], a[0]); }
  function rpow(a, n) { a = R(a); if (n < 0) { a = inv(a); n = -n; } return ex.norm(Math.pow(a[0], n), Math.pow(a[1], n)); }
  function rv(a) { a = R(a); return a[0] / a[1]; }
  function gcd(a, b) { return ex.gcd(a, b); }
  function find(gen, test, fallback) { for (var i = 0; i < 3000; i++) { var v = gen(); if (v != null && test(v)) return v; } if (fallback === undefined) throw new Error('u2 exit: no values found'); return fallback; }
  function eT(e) { e = R(e); return e[1] === 1 ? String(e[0]) : (e[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(e[0]) + '}{' + e[1] + '}'; }
  function pw(v, e) { e = R(e); if (e[0] === 0) return ''; if (e[0] === 1 && e[1] === 1) return v; return v + '^{' + eT(e) + '}'; }
  function rootT(n, inner) { return n === 2 ? '\\sqrt{' + inner + '}' : '\\sqrt[' + n + ']{' + inner + '}'; }
  function frT(a) { a = R(a); return a[1] === 1 ? String(a[0]) : (a[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(a[0]) + '}{' + a[1] + '}'; }
  function rep(b, n) { var o = []; for (var i = 0; i < n; i++) o.push(b); return o.join('\\times '); }
  function paren(n) { return n < 0 ? '(' + n + ')' : String(n); }
  /* monomials: { c: [p, q], v: [[letter, [p, q]], …] } */
  function M(c, fs) { return { c: R(c), v: (fs || []).map(function (f) { return [f[0], R(f[1])]; }) }; }
  function mm(a, b) { var v = a.v.map(function (f) { return [f[0], f[1]]; }); b.v.forEach(function (f) { var g = v.filter(function (x) { return x[0] === f[0]; })[0]; if (g) g[1] = add(g[1], f[1]); else v.push([f[0], f[1]]); }); return { c: mul(a.c, b.c), v: v }; }
  function mpow(a, e) { e = R(e); return { c: rpow(a.c, e[0]), v: a.v.map(function (f) { return [f[0], mul(f[1], e)]; }) }; }
  function mdiv(a, b) { return mm(a, { c: inv(b.c), v: b.v.map(function (f) { return [f[0], neg(f[1])]; }) }); }
  /* positive-exponent form (the answer key) */
  function ptex(m) {
    var c = m.c, num = '', den = '';
    m.v.forEach(function (f) { if (f[1][0] > 0) num += pw(f[0], f[1]); else if (f[1][0] < 0) den += pw(f[0], neg(f[1])); });
    var N = (Math.abs(c[0]) === 1 && num ? '' : String(Math.abs(c[0]))) + num, D = (c[1] === 1 ? '' : String(c[1])) + den;
    return (c[0] < 0 ? '-' : '') + (D ? '\\frac{' + N + '}{' + D + '}' : N);
  }
  /* any-sign form (questions and working lines) */
  function rtex(m) { var vs = m.v.map(function (f) { return pw(f[0], f[1]); }).join(''); var c = m.c; var ct = c[1] === 1 ? (vs && Math.abs(c[0]) === 1 ? (c[0] < 0 ? '-' : '') : String(c[0])) : frT(c); return ct + vs; }
  function mono(c, v, e) { return rtex(M(c, [[v, e]])); }

  /* ---------- checking helpers (from the 10C Unit 2 slips) ---------- */
  function walk(x, fn) { if (!x || typeof x !== 'object') return; fn(x); ['a', 'b', 'n'].forEach(function (k) { if (x[k] && typeof x[k] === 'object') walk(x[k], fn); }); }
  function strip(x) { while (x && x.t === 'paren') x = x.a; return x; }
  function varsOf(ast) { return Object.keys(ex.shape(ast).vars); }
  function union(a, b) { return a.concat(b.filter(function (v) { return a.indexOf(v) < 0; })); }
  function same(a, b, vs) { return vs.length ? ex.equiv(a, b, vs, 6) : ex.eq(ex.value(a), ex.value(b)); }
  function expIssue(e) {
    e = strip(e); if (e.t === 'neg') e = strip(e.a);
    if (e.t === 'num') return e.dec ? form('exp-decimal', 'Right value — write the exponent as a fraction (for example ' + t('x^{\\frac{3}{2}}') + ' rather than ' + t('x^{1.5}') + ').') : null;
    if (e.t === 'var') return null;
    if (e.t === 'div') {
      var n = strip(e.a), d = strip(e.b); if (n.t === 'neg') n = strip(n.a); if (d.t === 'neg') d = strip(d.a);
      if (n.t === 'num' && d.t === 'num' && !n.dec && !d.dec) { if (d.v === 1 || gcd(n.v, d.v) > 1) return form('exp-lowest', 'Right value — now reduce the exponent ' + t('\\frac{' + n.v + '}{' + d.v + '}') + ' to lowest terms.'); return null; }
    }
    return form('exp-simplify', 'Right value — now work each exponent out to a single number or fraction.');
  }
  function fmtIssue(ast, opt) {
    opt = opt || {}; var res = null, rad = opt.form === 'radical';
    walk(ast, function (x) {
      if (res) return;
      if (x.t === 'pow') { res = expIssue(x.b); if (!res && rad) { var e = ex.rat(x.b); if (e && e[0] < 0) res = form('neg-exp', 'Right value — now write it with positive exponents only.'); } }
      else if (x.t === 'root' && rad) { var nested = false; walk(x.a, function (y) { if (y.t === 'root') nested = true; }); if (nested) res = form('nested-root', 'Right value — now write it with a <b>single</b> radical.'); }
    });
    return res;
  }
  function EX(target, opt) {
    opt = opt || {}; var c = K.expo(target, opt);
    return function (resp) { var r = c(resp); if (r.v !== 'correct') return r; var p = ex.parse(resp); return (p.ok && fmtIssue(p.ast, opt)) || r; };
  }
  /* typical wrong answers recognized by equivalence: list [[tex, code, hint]]; entries equal to the target are dropped */
  function known(list, target) {
    var tp = target ? ex.parse(target).ast : null, tv = tp ? varsOf(tp) : [], L = [];
    list.forEach(function (k) {
      if (!k) return; var p = ex.parse(k[0]); if (!p.ok) throw new Error('bad known tex ' + k[0]);
      var vs = union(varsOf(p.ast), tv); if (tp && same(p.ast, tp, vs)) return;
      if (L.some(function (y) { return same(p.ast, y.ast, union(vs, y.vars)); })) return;
      L.push({ tex: k[0], ast: p.ast, vars: vs, code: k[1], hint: k[2] });
    });
    var f = function (an, ast) { var sv = varsOf(ast); for (var i = 0; i < L.length; i++) if (same(ast, L[i].ast, union(L[i].vars, sv))) return { code: L[i].code, hint: L[i].hint }; return null; };
    f.texs = L.map(function (x) { return x.tex; });
    return f;
  }
  /* the question's own expression typed back is "right value, wrong form" to the checkers (2/3 in a test): no work was
     done, so mark it wrong (no credit). Compared by structure, ignoring brackets and \frac vs / */
  function nast(a) { if (!a || typeof a !== 'object') return a; if (a.t === 'paren') return nast(a.a); var o = {}; Object.keys(a).sort().forEach(function (k) { if (k !== 'frac' && k !== 'imp' && k !== 's' && k !== 'dec') o[k] = nast(a[k]); }); return o; }
  function sig(tex) { var p = ex.parse(String(tex == null ? '' : tex)); return p.ok ? JSON.stringify(nast(p.ast)) : null; }
  function maths(html) { var o = [], re = /\\\(([\s\S]*?)\\\)/g, m; while ((m = re.exec(String(html)))) o.push(m[1]); return o; }
  function guard(chk, givens, msg) {
    var gs = givens.map(sig).filter(Boolean);
    return function (resp) {
      var res = chk(resp);
      if (res && res.v === 'form' && typeof resp === 'string') { var s = sig(resp); if (s && gs.indexOf(s) >= 0) return wrong('u2x-given', msg || 'That is the expression you were given. Use the exponent laws to work it out.'); }
      return res;
    };
  }
  /* one exponent-law answer box; kn = known(…) */
  function XP(prompt, target, opt, sol, hints, text, kn, givens) {
    opt = opt || {}; if (kn) opt.diag = kn;
    var p = P.expo(prompt, target, opt, sol, hints, text); p.check = guard(EX(target, opt), givens || maths(prompt));
    p.bad = kn ? kn.texs.slice() : [];
    return p;
  }
  /* an exact number (integer or fraction in lowest terms; o.dec: a terminating decimal is fine too) */
  function exactChk(fr, kn, o) {
    o = o || {}; fr = R(fr); var T = rv(fr);
    var base = K.fraction(fr, { decimalOk: !!o.dec, diag: function (val, ast) { return kn ? kn(null, ast) : null; } });
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (ex.eq(a.val, T)) {
        var an = ex.analyze(a.ast);
        if (an.flags.negExp) return form('neg-exp', 'Right value — now evaluate it: rewrite the negative exponent as a reciprocal and work out the power.');
        if (ex.shape(a.ast).pow || ex.shape(a.ast).roots) return form('evaluate', 'Right value — now work out the power(s) and give a single number' + (fr[1] !== 1 ? ' or fraction' : '') + '.');
      }
      return base(resp);
    };
  }
  /* an exact-number box; bad = the known wrong answers */
  function NUM(prompt, val, kn, givens, sol, hints, text, o) {
    var p = P.math(prompt, guard(exactChk(val, kn, o), givens), frT(val), sol, hints, text, { keys: 'fraction' });
    p.bad = kn ? kn.texs.slice() : [];
    return p;
  }
  /* a whole-number answer for a missing exponent ("n = 12" is fine too); diag(value) -> {code, hint} */
  function UNK(prompt, letter, val, diag, sol, hints, text, bad) {
    var p = P.number(prompt, val, diag, sol, hints, text, { before: t(letter + '=') }), base = p.check;
    p.check = function (resp) { return base(String(resp == null ? '' : resp).replace(new RegExp('^\\s*' + letter + '\\s*=\\s*'), '')); };
    p.bad = (bad || []).map(String);
    return p;
  }
  /* scientific notation with specific wrong values: ws = [{ v, code, hint }] */
  function sciChk(x, ws, givens) {
    var base = K.sci(x);
    return guard(function (resp) {
      var r = base(resp); if (r.v === 'correct' || r.v === 'form') return r;
      var a = K.read(resp);
      if (!a.res && isFinite(a.val)) for (var i = 0; i < ws.length; i++) if (Math.abs(a.val - ws[i].v) <= 1e-9 * Math.abs(ws[i].v)) return wrong(ws[i].code, ws[i].hint);
      return r;
    }, givens || [], 'That is the number you were given. Write it in scientific notation, ' + t('a\\times 10^{n}') + ' with ' + t('1\\le a<10') + '.');
  }
  function SCI(prompt, x, ws, givens, sol, hints, text) {
    var p = P.math(prompt, sciChk(x, ws, givens), K.sciTex(x), sol, hints, text, { keys: 'sci' });
    var key = K.sciTex(x);
    p.bad = ws.map(function (w) { return K.sciTex(w.v); }).filter(function (b, i, all) { return b !== key && all.indexOf(b) === i; });
    return p;
  }
  function cl(x) { return Number(Number(x).toPrecision(12)); }
  /* a decimal written out in full: digits D (e.g. '47' for 4.7) times 10^n */
  function stdStr(D, n) {
    var s = String(D), pt = n + 1; // digits before the point
    if (pt <= 0) return '0.' + new Array(-pt + 1).join('0') + s.replace(/0+$/, '');
    if (pt >= s.length) return F(Number(s + new Array(pt - s.length + 1).join('0')));
    return s.slice(0, pt) + '.' + s.slice(pt).replace(/0+$/, '');
  }
  function coefOf(D) { var s = String(D); return Number(s.length > 1 ? s[0] + '.' + s.slice(1) : s); }

  /* ---------- figures (Ryan's rectangle and square; a box) ---------- */
  var FONT = 'font-family="KaTeX_Main,\'Times New Roman\',serif" font-size="19" fill="#1e2d46"', SUPS = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function svgMono(c, v, e) { return (c === 1 ? '' : String(c)) + '<tspan font-style="italic">' + v + '</tspan>' + (e === 1 ? '' : String(e).split('').map(function (ch) { return SUPS[ch]; }).join('')); }
  function fig(svg) { return '<div class="fig">' + svg + '</div>'; }
  function rectSvg(len, wid) {
    return fig('<svg class="fig-svg" viewBox="0 0 290 150" style="max-width:290px" role="img" aria-label="a rectangle with its length and width labelled">' +
      '<rect x="40" y="14" width="170" height="92" fill="#e3ecf8" stroke="#1e2d46" stroke-width="2"/><polyline points="40,94 52,94 52,106" fill="none" stroke="#1e2d46" stroke-width="1.2"/>' +
      '<text x="125" y="134" ' + FONT + ' text-anchor="middle">' + len + '</text><text x="220" y="66" ' + FONT + ' text-anchor="start">' + wid + '</text></svg>');
  }
  function squareSvg(side) {
    var tk = function (x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#1e2d46" stroke-width="1.5"/>'; };
    return fig('<svg class="fig-svg" viewBox="0 0 260 156" style="max-width:260px" role="img" aria-label="a square with equal sides labelled">' +
      '<rect x="80" y="12" width="104" height="104" fill="#e3ecf8" stroke="#1e2d46" stroke-width="2"/><polyline points="80,104 92,104 92,116" fill="none" stroke="#1e2d46" stroke-width="1.2"/>' +
      tk(132, 6, 132, 18) + tk(132, 110, 132, 122) + tk(74, 64, 86, 64) + tk(178, 64, 190, 64) +
      '<text x="132" y="144" ' + FONT + ' text-anchor="middle">' + side + '</text><text x="68" y="70" ' + FONT + ' text-anchor="end">' + side + '</text></svg>');
  }
  function boxSvg(s, h) {
    var E = 'stroke="#1e2d46" stroke-width="2"';
    return fig('<svg class="fig-svg" viewBox="0 0 300 172" style="max-width:300px" role="img" aria-label="a box with a square base; its side length and height are labelled">' +
      '<polygon points="60,52 100,22 210,22 170,52" fill="#d3e1f4" ' + E + '/><polygon points="170,52 210,22 210,112 170,142" fill="#c3d5ee" ' + E + '/>' +
      '<rect x="60" y="52" width="110" height="90" fill="#e3ecf8" ' + E + '/>' +
      '<polyline points="60,142 100,112 210,112" fill="none" stroke="#1e2d46" stroke-width="1.2" stroke-dasharray="5 4"/><line x1="100" y1="112" x2="100" y2="22" stroke="#1e2d46" stroke-width="1.2" stroke-dasharray="5 4"/>' +
      '<text x="115" y="164" ' + FONT + ' text-anchor="middle">' + s + '</text><text x="196" y="142" ' + FONT + ' text-anchor="start">' + s + '</text>' +
      '<text x="52" y="103" ' + FONT + ' text-anchor="end">' + h + '</text></svg>');
  }

  function Q(num, level, make, stem) { return { num: String(num), outcome: 'AN3', stem: stem || '', parts: [{ id: String(num), outcome: 'AN3', level: level, make: make }] }; }
  var LET = ['x', 'a', 'y', 'm', 'n', 'b', 'k', 'p', 't', 'w'], PAIRS = [['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['c', 'd']];

  /* ===== Lesson 1 — Powers, Exponent Vocabulary & the Product Law ===== */
  var EVEN = { 2: [4, 6], 3: [2, 4], 4: [2], 5: [2], 10: [2, 4] }, ODD = { 2: [3, 5], 3: [3], 4: [3], 5: [3], 10: [3] };
  function l1q1(r) { // Ryan: −2⁴ · −3⁴
    var kind = r.pick(['negEven', 'negEven', 'negEven', 'parEven', 'parOdd']), a = r.pick([2, 2, 3, 3, 4, 5, 10]), n = r.pick(kind === 'parOdd' ? ODD[a] : EVEN[a]);
    var P0 = Math.pow(a, n), tx = kind === 'negEven' ? '-' + a + '^{' + n + '}' : '(-' + a + ')^{' + n + '}', val = kind === 'parEven' ? P0 : -P0;
    var flip = kind === 'negEven' ? ['u2x-neg-base', 'With no brackets, the exponent belongs only to the ' + t(a) + ': ' + t(tx + '=-(' + a + '^{' + n + '})') + '. Only ' + t('(-' + a + ')^{' + n + '}') + ' equals ' + t(P0) + '.']
      : kind === 'parEven' ? ['u2x-even-neg', 'The brackets make ' + t('-' + a) + ' the base. An even number of negative factors multiplies to a <b>positive</b> answer.']
      : ['u2x-odd-neg', 'The brackets make ' + t('-' + a) + ' the base. An odd number of negative factors leaves the answer <b>negative</b>.'];
    var kn = known([[String(-val), flip[0], flip[1]], [String(val < 0 ? -a * n : a * n), 'u2x-base-times-exp', 'An exponent means repeated multiplication, not base × exponent: ' + t(a + '^{' + n + '}=' + rep(a, n) + '=' + F(P0)) + '.'],
      [String(val < 0 ? a * n : -a * n), 'u2x-base-times-exp', t(a + '^{' + n + '}') + ' means ' + t(rep(a, n)) + ', not ' + t(a + '\\times ' + n) + '.']], String(val));
    var sol = kind === 'negEven' ? 'No brackets, so only ' + t(a) + ' is the base and the minus sign waits outside: ' + t(tx + '=-(' + rep(a, n) + ')=' + val) + '.'
      : 'The brackets make ' + t('-' + a) + ' the base: ' + t(tx + '=' + rep('(-' + a + ')', n) + '=' + val) + ' (' + (kind === 'parEven' ? 'an even' : 'an odd') + ' number of negative factors).';
    return NUM('Evaluate ' + t(tx) + '.', val, kn, [tx], sol, ['Brackets decide the base: in ' + t('(-2)^{4}') + ' the base is ' + t('-2') + '; in ' + t('-2^{4}') + ' the base is ' + t('2') + ' and the minus sign waits outside.', 'Then multiply the base by itself as many times as the exponent says.'], 'evaluate ' + tx);
  }
  function l1q2(r) { // Ryan: rectangle 5a³ by 3a⁴ · 4b⁵ by 2b³
    var v = r.pick(['a', 'b', 'x', 'm', 'y']), s = find(function () { return { c1: r.int(2, 6), c2: r.int(2, 6), e1: r.int(2, 6), e2: r.int(2, 6) }; }, function (s) { return s.e1 !== s.e2 && s.c1 * s.c2 <= 30 && !(s.c1 === 2 && s.c2 === 2); });
    var L = mono(s.c1, v, s.e1), W = mono(s.c2, v, s.e2), C = s.c1 * s.c2, E = s.e1 + s.e2, tgt = mono(C, v, E);
    var kn = known([[mono(C, v, s.e1 * s.e2), 'u2x-mult-exp', 'Multiplying powers with the same base: <b>add</b> the exponents (product law), ' + t(s.e1 + '+' + s.e2 + '=' + E) + '.'],
      [mono(s.c1 + s.c2, v, E), 'u2x-coef-added', 'The numbers in front are <b>multiplied</b>: ' + t(s.c1 + '\\times ' + s.c2 + '=' + C) + '.'],
      [mono(s.c1 + s.c2, v, s.e1 * s.e2), 'u2x-coef-added', 'Multiply the numbers in front and <b>add</b> the exponents.']], tgt);
    return XP('Write a simplified expression for the area of this rectangle.' + rectSvg(svgMono(s.c1, v, s.e1), svgMono(s.c2, v, s.e2)), tgt, { vars: [v] },
      'Area = length × width: ' + t('\\left(' + L + '\\right)\\left(' + W + '\\right)=(' + s.c1 + '\\times ' + s.c2 + ')' + v + '^{' + s.e1 + '+' + s.e2 + '}=' + tgt) + '.',
      ['Area of a rectangle = length × width.', 'Multiply the numbers in front, then add the exponents (product law).'], 'rectangle area ' + L + ' by ' + W, kn, [L + '\\times ' + W, '(' + L + ')(' + W + ')', L + W]);
  }
  function l1q3(r) { // Ryan: n⁴ × n × n² · k³ × k⁵ × k
    var v = r.pick(['n', 'k', 'x', 'p', 'm', 'w']), a = r.int(2, 7), b = find(function () { return r.int(2, 7); }, function (b) { return b !== a; }), pos = r.int(0, 2);
    var fs = [pw(v, a), pw(v, b)]; fs.splice(pos, 0, v);
    var tx = fs.join('\\times '), E = a + b + 1, tgt = pw(v, E);
    var kn = known([[pw(v, a + b), 'u2x-hidden-one', 'The ' + t(v) + ' on its own counts too: ' + t(v + '=' + v + '^{1}') + ', so add ' + t('1') + ' to the exponents.'],
      [pw(v, a * b), 'u2x-mult-exp', 'Multiplying powers with the same base: <b>add</b> the exponents.']], tgt);
    return XP('Simplify ' + t(tx) + '.', tgt, { vars: [v] },
      'A letter with no exponent has exponent ' + t('1') + ': ' + t(tx + '=' + v + '^{' + fs.map(function (f) { return f === v ? '1' : f.slice(3, -1); }).join('+') + '}=' + tgt) + '.',
      ['Product law: same base, multiplying — add the exponents.', 'A letter written with no exponent has exponent ' + t('1') + '.'], 'product of three powers', kn);
  }
  function l1q4(r) { // added Mastery: Assignment 1 Q13 (box with a square base), with coefficients
    var v = r.pick(['x', 'x', 'a', 'y']), s = find(function () { return { c1: r.int(1, 5), c2: r.int(1, 6), a: r.int(1, 4), b: r.int(1, 5) }; }, function (s) { return s.c1 * s.c1 * s.c2 <= 100 && !(s.c1 === 1 && s.c2 === 1) && s.a !== s.b && !(s.a === 1 && s.c1 === 1); });
    var S = mono(s.c1, v, s.a), H = mono(s.c2, v, s.b), C = s.c1 * s.c1 * s.c2, E = 2 * s.a + s.b, tgt = mono(C, v, E);
    var kn = known([[mono(s.c1 * s.c2, v, s.a + s.b), 'u2x-dim-missing', 'That is side × height. A box has <b>three</b> dimensions: the base is a square, so length and width are both ' + t(S) + '.'],
      [mono(s.c1 * s.c1, v, 2 * s.a), 'u2x-dim-missing', 'That is the area of the base only. Multiply by the height too.'],
      [mono(C, v, s.a * s.a * s.b), 'u2x-mult-exp', 'Multiplying powers with the same base: <b>add</b> the exponents.'],
      [mono(2 * s.c1 + s.c2, v, E), 'u2x-coef-added', 'The numbers in front are <b>multiplied</b>: ' + t(s.c1 + '\\times ' + s.c1 + '\\times ' + s.c2) + '.']], tgt);
    return XP('A box has a square base with side length ' + t(S) + ' and a height of ' + t(H) + '. Write a simplified expression for its volume.' + boxSvg(svgMono(s.c1, v, s.a), svgMono(s.c2, v, s.b)), tgt, { vars: [v] },
      'Volume = length × width × height, and the base is a square:<br>' + t('V=\\left(' + S + '\\right)\\left(' + S + '\\right)\\left(' + H + '\\right)=(' + s.c1 + '\\times ' + s.c1 + '\\times ' + s.c2 + ')' + v + '^{' + s.a + '+' + s.a + '+' + s.b + '}=' + tgt) + '.',
      ['Volume of a box = length × width × height. A square base means the length and the width are equal.', 'Multiply the numbers in front, and add the exponents (product law).'], 'box volume', kn, [S, H]);
  }
  HW.defineExit({ lesson: 'u2l1', calc: false, outcome: 'AN3',
    blurb: 'Evaluating powers with a minus sign, and the product law: the area of a rectangle, a product of three powers, and the volume of a box.',
    questions: [Q(1, 'BEG', l1q1), Q(2, 'BEG', l1q2), Q(3, 'BEG', l1q3), Q(4, 'MAS', l1q4)] });

  /* ===== Lesson 2 — The Quotient Law & Power of a Power ===== */
  function l2q1(r) { // Ryan: 24y⁹ / 6y³ · 35m⁸ / 7m²
    var v = r.pick(['y', 'm', 'x', 'a', 'b', 'k']), s = find(function () { return { c2: r.int(2, 9), q: r.int(2, 9), e2: r.int(2, 5), d: r.int(2, 7) }; }, function (s) { return s.c2 * s.q <= 72; });
    var c1 = s.c2 * s.q, e1 = s.e2 + s.d, tgt = mono(s.q, v, s.d), tx = '\\dfrac{' + mono(c1, v, e1) + '}{' + mono(s.c2, v, s.e2) + '}';
    var kn = known([e1 % s.e2 === 0 ? [mono(s.q, v, e1 / s.e2), 'u2x-div-exp', 'Dividing powers with the same base: <b>subtract</b> the exponents, don’t divide them.'] : null,
      [mono(c1 - s.c2, v, s.d), 'u2x-sub-coef', 'The numbers in front are <b>divided</b>: ' + t(c1 + '\\div ' + s.c2 + '=' + s.q) + '.'],
      [mono(s.q, v, e1 + s.e2), 'u2x-add-for-sub', 'Dividing powers with the same base: <b>subtract</b> the exponents (quotient law).']], tgt);
    return XP('Simplify ' + t(tx) + '.', tgt, { vars: [v] },
      t(tx + '=\\frac{' + c1 + '}{' + s.c2 + '}\\,' + v + '^{' + e1 + '-' + s.e2 + '}=' + tgt) + '.',
      ['Divide the numbers in front.', 'Quotient law: same base, dividing — subtract the exponents (top minus bottom).'], 'quotient of monomials', kn);
  }
  function l2q2(r) { // Ryan: (x³)⁴ ÷ x⁵ · (y²)⁵ ÷ y³
    var v = r.pick(['x', 'y', 'a', 'm', 't']), s = find(function () { return { a: r.int(2, 5), b: r.int(2, 5), c: r.int(1, 9) }; }, function (s) { return s.a * s.b <= 20 && s.a * s.b - s.c >= 2 && !(s.a === 2 && s.b === 2); });
    var P0 = s.a * s.b, E = P0 - s.c, tgt = pw(v, E), tx = '\\left(' + pw(v, s.a) + '\\right)^{' + s.b + '}\\div ' + pw(v, s.c);
    var kn = known([s.a + s.b - s.c >= 1 ? [pw(v, s.a + s.b - s.c), 'u2x-add-exp', 'A power of a power: <b>multiply</b> the exponents, ' + t('(' + pw(v, s.a) + ')^{' + s.b + '}=' + pw(v, P0)) + '.'] : null,
      [pw(v, P0 + s.c), 'u2x-add-for-sub', 'Dividing powers with the same base: <b>subtract</b> the exponents.']], tgt);
    return XP('Simplify ' + t(tx) + '.', tgt, { vars: [v] },
      'Power of a power (multiply): ' + t('\\left(' + pw(v, s.a) + '\\right)^{' + s.b + '}=' + v + '^{' + s.a + '\\times ' + s.b + '}=' + pw(v, P0)) + '.<br>Quotient law (subtract): ' + t(pw(v, P0) + '\\div ' + pw(v, s.c) + '=' + v + '^{' + P0 + '-' + s.c + '}=' + tgt) + '.',
      ['First the bracket: a power of a power multiplies the exponents.', 'Then divide: subtract the exponents.'], 'power of a power then quotient', kn);
  }
  function l2q3(r) { // Ryan: p¹⁸ / pⁿ = p⁶ → 12 · q²⁰ / qⁿ = q⁵ → 15
    var v = r.pick(['p', 'q', 'a', 'd', 'g']), s = find(function () { var k = r.int(2, 8); return { k: k, m: r.chance(0.6) ? k * r.int(2, 4) : r.int(10, 24) }; }, function (s) { return s.m >= 10 && s.m <= 24 && s.m - s.k >= 2 && s.m - s.k !== s.k; });
    var n = s.m - s.k, eq = '\\dfrac{' + pw(v, s.m) + '}{' + v + '^{n}}=' + pw(v, s.k);
    var diag = function (x) { if (s.m % s.k === 0 && x === s.m / s.k) return { code: 'u2x-div-exp', hint: 'Dividing powers subtracts the exponents: ' + t(s.m + '-n=' + s.k) + '.' }; if (x === s.m + s.k) return { code: 'u2x-add-for-sub', hint: 'The quotient law <b>subtracts</b>: ' + t(s.m + '-n=' + s.k) + '. Adding is for multiplying powers.' }; return null; };
    return UNK('If ' + t(eq) + ', what is the value of ' + t('n') + '?', 'n', n, diag,
      'Quotient law: ' + t(s.m + '-n=' + s.k) + ', so ' + t('n=' + s.m + '-' + s.k + '=' + n) + '.<br>Check: ' + t(pw(v, s.m) + '\\div ' + pw(v, n) + '=' + v + '^{' + s.m + '-' + n + '}=' + pw(v, s.k)) + ' ✓',
      ['Dividing powers with the same base subtracts the exponents: ' + t(s.m + '-n') + ' must equal ' + t(s.k) + '.', 'What do you subtract from ' + t(s.m) + ' to get ' + t(s.k) + '?'], 'missing exponent (quotient law)', [s.m % s.k === 0 ? s.m / s.k : null, s.m + s.k].filter(function (x) { return x != null && x !== n; }));
  }
  function l2q4(r) { // added Mastery: Assignment 2 Q10–11 combined, (aˣ)³ ÷ a⁴ = a¹¹
    var v = r.pick(['a', 'b', 'c', 'h']), s = find(function () { return { p: r.pick([2, 3, 3, 4]), x: r.int(2, 6), q: r.int(1, 8) }; }, function (s) { return s.p * s.x <= 24 && s.p * s.x - s.q >= 2 && s.x !== s.q; });
    var Rr = s.p * s.x - s.q, eq = '\\left(' + v + '^{x}\\right)^{' + s.p + '}\\div ' + pw(v, s.q) + '=' + pw(v, Rr);
    var wa = Rr - s.p + s.q, wq = (Rr - s.q) / s.p, bad = [Rr + s.q];
    var diag = function (y) {
      if (y === Rr + s.q) return { code: 'u2x-not-divided', hint: t(Rr + s.q) + ' is the exponent ' + t(s.p + 'x') + '. Now divide by ' + t(s.p) + ' to find ' + t('x') + '.' };
      if (y === wa && wa > 0) return { code: 'u2x-add-exp', hint: 'A power of a power <b>multiplies</b> the exponents: ' + t('\\left(' + v + '^{x}\\right)^{' + s.p + '}=' + v + '^{' + s.p + 'x}') + '.' };
      if (y === wq) return { code: 'u2x-add-for-sub', hint: 'Dividing powers <b>subtracts</b> the exponents: ' + t(s.p + 'x-' + s.q + '=' + Rr) + '.' };
      return null;
    };
    if (wa > 0 && wa !== s.x) bad.push(wa); if (wq > 0 && wq % 1 === 0 && wq !== s.x) bad.push(wq);
    return UNK('If ' + t(eq) + ', what is the value of ' + t('x') + '?', 'x', s.x, diag,
      'Power of a power: ' + t('\\left(' + v + '^{x}\\right)^{' + s.p + '}=' + v + '^{' + s.p + 'x}') + '. Quotient law: ' + t(v + '^{' + s.p + 'x}\\div ' + pw(v, s.q) + '=' + v + '^{' + s.p + 'x-' + s.q + '}') + '.<br>' +
        'So ' + t(s.p + 'x-' + s.q + '=' + Rr) + ', ' + t(s.p + 'x=' + (Rr + s.q)) + ' and ' + t('x=' + s.x) + '.<br>Check: ' + t('\\left(' + pw(v, s.x) + '\\right)^{' + s.p + '}\\div ' + pw(v, s.q) + '=' + pw(v, s.p * s.x) + '\\div ' + pw(v, s.q) + '=' + pw(v, Rr)) + ' ✓',
      ['Write the left side as one power of ' + t(v) + ': power of a power multiplies, the quotient law subtracts.', 'Then the exponents on both sides must be equal: solve for ' + t('x') + '.'], 'missing exponent (power of a power and quotient)', bad);
  }
  HW.defineExit({ lesson: 'u2l2', calc: false, outcome: 'AN3',
    blurb: 'The quotient law and the power of a power law: dividing monomials, using both laws, and finding a missing exponent.',
    questions: [Q(1, 'BEG', l2q1), Q(2, 'PRG', l2q2), Q(3, 'PRG', l2q3), Q(4, 'MAS', l2q4)] });

  /* ===== Lesson 3 — Power of a Product and Power of a Quotient ===== */
  function l3q1(r) { // Ryan: square with side 3x · 5y
    var v = r.pick(['x', 'y', 'a', 'm', 'w']), k = r.int(2, 9), tgt = (k * k) + pw(v, 2), S = k + v;
    var kn = known([[k + pw(v, 2), 'u2x-coef-not-raised', 'The whole side ' + t(S) + ' is squared, including the ' + t(k) + ': ' + t('(' + S + ')^{2}=' + k + '^{2}' + v + '^{2}') + '.'],
      [(2 * k) + pw(v, 2), 'u2x-coef-times-exp', t(k + '^{2}') + ' means ' + t(k + '\\times ' + k) + ', not ' + t(k + '\\times 2') + '.'],
      [(4 * k) + v, 'u2x-perimeter', 'That is the perimeter (the four sides added). Area of a square = side × side.'],
      [(k * k) + v, 'u2x-var-not-raised', 'Square the ' + t(v) + ' as well: ' + t(v + '\\times ' + v + '=' + v + '^{2}') + '.']], tgt);
    return XP('The square has side length ' + t(S) + '. Write a simplified expression for its area.' + squareSvg(svgMono(k, v, 1)), tgt, { vars: [v] },
      'Area = side × side: ' + t('A=(' + S + ')^{2}=' + k + '^{2}' + v + '^{2}=' + tgt) + ' (power of a product).',
      ['Area of a square = side × side = ' + t('(\\text{side})^{2}') + '.', 'Power of a product: square <b>each</b> factor, the number and the letter.'], 'square area (' + S + ')^2', kn, [S, '(' + S + ')^{2}', S + '\\times ' + S]);
  }
  function l3q2(r) { // Ryan: (m/4)² · (k/3)²
    var v = r.pick(['m', 'k', 'x', 'a', 'p']), n = r.chance(0.25) ? 3 : 2, k = n === 3 ? r.int(2, 4) : r.int(2, 9), K0 = Math.pow(k, n), tgt = '\\frac{' + pw(v, n) + '}{' + K0 + '}', tx = '\\left(\\dfrac{' + v + '}{' + k + '}\\right)^{' + n + '}';
    var kn = known([['\\frac{' + pw(v, n) + '}{' + k + '}', 'u2x-missed-factor', 'The exponent applies to the top <b>and</b> the bottom: ' + t(k + '^{' + n + '}=' + K0) + '.'],
      ['\\frac{' + pw(v, n) + '}{' + k * n + '}', 'u2x-coef-times-exp', t(k + '^{' + n + '}') + ' means ' + t(rep(k, n)) + ', not ' + t(k + '\\times ' + n) + '.'],
      ['\\frac{' + v + '}{' + K0 + '}', 'u2x-var-not-raised', 'Raise the ' + t(v) + ' on top to the power ' + t(n) + ' as well.']], tgt);
    return XP('Simplify ' + t(tx) + '.', tgt, { vars: [v] },
      'Power of a quotient: raise the top and the bottom to the power ' + t(n) + ': ' + t(tx + '=\\frac{' + pw(v, n) + '}{' + k + '^{' + n + '}}=' + tgt) + '.',
      ['Power of a quotient: ' + t('\\left(\\frac{a}{b}\\right)^{n}=\\frac{a^{n}}{b^{n}}') + '.', 'Work out ' + t(k + '^{' + n + '}') + ' as a number.'], 'power of a quotient (' + v + '/' + k + ')^' + n, kn);
  }
  function l3q3(r) { // Ryan: (2x)³ × x² · (3x)² × x⁴
    var v = r.pick(['x', 'x', 'm', 'a', 'y']), s = find(function () { var n = r.pick([2, 3]); return { n: n, k: n === 3 ? r.int(2, 4) : r.int(2, 6), m: r.int(2, 6) }; }, function (s) { return s.m !== s.n && !(s.k === 2 && s.n === 2); });
    var K0 = Math.pow(s.k, s.n), E = s.n + s.m, tgt = mono(K0, v, E), tx = '(' + s.k + v + ')^{' + s.n + '}\\times ' + pw(v, s.m);
    var kn = known([[mono(s.k, v, E), 'u2x-coef-not-raised', 'The outer exponent goes on the ' + t(s.k) + ' as well: ' + t('(' + s.k + v + ')^{' + s.n + '}=' + s.k + '^{' + s.n + '}' + pw(v, s.n) + '=' + mono(K0, v, s.n)) + '.'],
      [mono(s.k * s.n, v, E), 'u2x-coef-times-exp', t(s.k + '^{' + s.n + '}') + ' means ' + t(rep(s.k, s.n) + '=' + K0) + ', not ' + t(s.k + '\\times ' + s.n) + '.'],
      [mono(K0, v, s.n * s.m), 'u2x-mult-exp', 'After clearing the bracket you multiply ' + t(pw(v, s.n) + '\\times ' + pw(v, s.m)) + ': <b>add</b> the exponents.']], tgt);
    return XP('Simplify ' + t(tx) + '.', tgt, { vars: [v] },
      'Power of a product: ' + t('(' + s.k + v + ')^{' + s.n + '}=' + s.k + '^{' + s.n + '}' + pw(v, s.n) + '=' + mono(K0, v, s.n)) + '.<br>Product law: ' + t(mono(K0, v, s.n) + '\\times ' + pw(v, s.m) + '=' + K0 + v + '^{' + s.n + '+' + s.m + '}=' + tgt) + '.',
      ['Clear the bracket first: raise <b>each</b> factor (the number too) to the power.', 'Then multiply: add the exponents.'], 'power of a product times a power', kn);
  }
  function l3q4(r) { // added Mastery: Assignment 3 Q8(c) (2a²/b)³, Extra Practice 3 Q4
    var L = r.pick(PAIRS), s = find(function () { var n = r.pick([2, 3]); return { n: n, c: n === 3 ? r.int(2, 4) : r.int(2, 6), a: r.int(1, 4), b: r.int(1, 3), top: r.chance(0.65) }; }, function (s) { return s.a * s.n <= 12 && !(s.c === 2 && s.n === 2) && (s.a > 1 || s.b > 1); });
    var x = L[0], y = L[1], C = Math.pow(s.c, s.n);
    var num = s.top ? s.c + pw(x, s.a) : pw(x, s.a), den = s.top ? pw(y, s.b) : s.c + pw(y, s.b), tx = '\\left(\\dfrac{' + num + '}{' + den + '}\\right)^{' + s.n + '}';
    var mk = function (cc, ex1, ex2) { return s.top ? '\\frac{' + cc + pw(x, ex1) + '}{' + pw(y, ex2) + '}' : '\\frac{' + pw(x, ex1) + '}{' + cc + pw(y, ex2) + '}'; };
    var tgt = mk(C, s.a * s.n, s.b * s.n);
    var kn = known([[mk(s.c, s.a * s.n, s.b * s.n), 'u2x-coef-not-raised', 'The outside exponent applies to the ' + t(s.c) + ' too: ' + t(s.c + '^{' + s.n + '}=' + C) + '.'],
      [mk(s.c * s.n, s.a * s.n, s.b * s.n), 'u2x-coef-times-exp', t(s.c + '^{' + s.n + '}') + ' means ' + t(rep(s.c, s.n)) + ', not ' + t(s.c + '\\times ' + s.n) + '.'],
      [mk(C, s.a + s.n, s.b + s.n), 'u2x-add-exp', 'A power of a power: <b>multiply</b> the exponents by ' + t(s.n) + '.'],
      [s.top ? mk(C, s.a * s.n, s.b) : mk(C, s.a, s.b * s.n), 'u2x-missed-factor', 'Raise <b>every</b> factor, top and bottom, to the power ' + t(s.n) + '.']], tgt);
    return XP('Simplify ' + t(tx) + '.', tgt, { vars: L },
      'Raise every factor on the top and on the bottom to the power ' + t(s.n) + ':<br>' + t(tx + '=' + (s.top ? '\\frac{' + s.c + '^{' + s.n + '}' + x + '^{' + s.a + '\\times ' + s.n + '}}{' + y + '^{' + s.b + '\\times ' + s.n + '}}' : '\\frac{' + x + '^{' + s.a + '\\times ' + s.n + '}}{' + s.c + '^{' + s.n + '}' + y + '^{' + s.b + '\\times ' + s.n + '}}') + '=' + tgt) + '.',
      ['Power of a quotient: the outside exponent goes on the top and the bottom.', 'Every factor gets it: the number (' + t(s.c + '^{' + s.n + '}') + ') and each letter (multiply the exponents).'], 'power of a quotient with a coefficient', kn);
  }
  HW.defineExit({ lesson: 'u2l3', calc: false, outcome: 'AN3',
    blurb: 'Power of a product and power of a quotient: the area of a square, a fraction to a power, and combining with the product law.',
    questions: [Q(1, 'BEG', l3q1), Q(2, 'BEG', l3q2), Q(3, 'PRG', l3q3), Q(4, 'MAS', l3q4)] });

  /* ===== Lesson 4 — Combining Exponent Laws ===== */
  function l4q1(r) { // Ryan: (3a³)² × 2a² · (2a⁴)³ × 3a
    var v = r.pick(['a', 'x', 'b', 'm']), s = find(function () { var n = r.pick([2, 3]); return { n: n, c: n === 3 ? 2 : r.int(2, 5), e: r.int(2, 5), d: r.int(2, 5), f: r.int(1, 4) }; }, function (s) { return Math.pow(s.c, s.n) * s.d <= 100 && s.e * s.n + s.f <= 16 && s.e !== s.f; });
    var C = Math.pow(s.c, s.n) * s.d, E = s.e * s.n + s.f, tgt = mono(C, v, E), A = mono(s.c, v, s.e), B = mono(s.d, v, s.f), tx = '\\left(' + A + '\\right)^{' + s.n + '}\\times ' + B;
    var kn = known([[mono(s.c * s.d, v, E), 'u2x-coef-not-raised', 'The outside exponent applies to the ' + t(s.c) + ' too: ' + t(s.c + '^{' + s.n + '}=' + Math.pow(s.c, s.n)) + '.'],
      [mono(s.c * s.n * s.d, v, E), 'u2x-coef-times-exp', t(s.c + '^{' + s.n + '}') + ' means ' + t(rep(s.c, s.n)) + ', not ' + t(s.c + '\\times ' + s.n) + '.'],
      [mono(C, v, s.e * s.n * s.f), 'u2x-mult-exp', 'When you multiply the two parts, <b>add</b> the exponents.'],
      [mono(C, v, s.e + s.n + s.f), 'u2x-add-exp', 'A power of a power: <b>multiply</b> the exponent inside the bracket by ' + t(s.n) + '.']], tgt);
    var sq = mono(Math.pow(s.c, s.n), v, s.e * s.n);
    return XP('Simplify ' + t(tx) + '.', tgt, { vars: [v] },
      'Power law first: ' + t('\\left(' + A + '\\right)^{' + s.n + '}=' + s.c + '^{' + s.n + '}' + v + '^{' + s.e + '\\times ' + s.n + '}=' + sq) + '.<br>Then the product law: ' + t(sq + '\\times ' + B + '=(' + Math.pow(s.c, s.n) + '\\times ' + s.d + ')' + v + '^{' + s.e * s.n + '+' + s.f + '}=' + tgt) + '.',
      ['Clear the bracket first: raise the number to the power and multiply the exponent.', 'Then multiply the numbers and add the exponents.'], 'power law then product law', kn);
  }
  function l4q2(r) { // Ryan (Mastery): (3x²y)² / (x³y) · (3xy³)² / (xy⁴)
    var L = r.pick(PAIRS), x = L[0], y = L[1], s = find(function () {
      var c = r.int(2, 5), dv = [1, 1, 1].concat([2, 3, 4, 5, 9, 25].filter(function (d) { return (c * c) % d === 0 && d < c * c; }));
      var a = r.int(1, 4), b = r.int(1, 4); return { c: c, d: r.pick(dv), a: a, b: b, p: r.int(1, 2 * a - 1), q: r.int(1, 2 * b - 1) };
    }, function (s) { return (s.a > 1 || s.b > 1) && (s.p > 1 || s.q > 1) && 2 * s.a - s.p <= 6 && 2 * s.b - s.q <= 6 && !(s.c === 2 && s.d === 4); });
    var A = M(s.c, [[x, s.a], [y, s.b]]), D = M(s.d, [[x, s.p], [y, s.q]]), sq = mpow(A, 2), T = mdiv(sq, D), tgt = ptex(T), tx = '\\dfrac{\\left(' + rtex(A) + '\\right)^{2}}{' + rtex(D) + '}';
    var kn = known([[ptex(mdiv(M(s.c, sq.v), D)), 'u2x-coef-not-raised', 'Square the ' + t(s.c) + ' too: ' + t(s.c + '^{2}=' + s.c * s.c) + '.'],
      [ptex(mdiv(M(2 * s.c, sq.v), D)), 'u2x-coef-times-exp', t(s.c + '^{2}') + ' means ' + t(s.c + '\\times ' + s.c) + ', not ' + t(s.c + '\\times 2') + '.'],
      [ptex(mdiv(M(s.c * s.c, [[x, 2 * s.a], [y, s.b]]), D)), 'u2x-missed-factor', 'The outside exponent applies to <b>every</b> factor: ' + t(pw(y, s.b)) + ' is squared too.'],
      [ptex(mdiv(M(s.c * s.c, [[x, s.a]].concat([[y, 2 * s.b]])), D)), 'u2x-missed-factor', 'The outside exponent applies to <b>every</b> factor: ' + t(pw(x, s.a)) + ' is squared too.'],
      [ptex(mm(sq, D)), 'u2x-add-for-sub', 'Dividing powers with the same base: <b>subtract</b> the exponents.'],
      [ptex(mdiv(M(s.c * s.c, [[x, s.a + 2], [y, s.b + 2]]), D)), 'u2x-add-exp', 'A power of a power: <b>multiply</b> each exponent inside the bracket by ' + t('2') + '.']], tgt);
    return XP('Simplify ' + t(tx) + '.', tgt, { vars: L },
      'Clear the bracket: ' + t('\\left(' + rtex(A) + '\\right)^{2}=' + s.c + '^{2}' + x + '^{' + s.a + '\\times 2}' + y + '^{' + s.b + '\\times 2}=' + rtex(sq)) + '.<br>' +
        'Quotient law, one base at a time: ' + t('\\frac{' + rtex(sq) + '}{' + rtex(D) + '}=' + (s.d === 1 ? String(s.c * s.c) : '\\frac{' + s.c * s.c + '}{' + s.d + '}') + x + '^{' + 2 * s.a + '-' + s.p + '}' + y + '^{' + 2 * s.b + '-' + s.q + '}=' + tgt) + '.',
      ['Clear the bracket first: square the number and double each exponent inside.', 'Then divide: numbers divide, and for each letter subtract the exponents (top minus bottom).'], 'power of a product over a monomial', kn);
  }
  function l4q3(r) { // Ryan: (8x⁵ / 2x²)² · (10x⁶ / 2x²)²
    var v = r.pick(['x', 'a', 'y', 'm']), s = find(function () { return { d: r.int(2, 5), k: r.int(2, 5), b: r.int(1, 3), g: r.int(1, 4) }; }, function (s) { return s.d * s.k <= 20 && s.g !== 2; });
    var c = s.d * s.k, a = s.b + s.g, tgt = mono(s.k * s.k, v, 2 * s.g), tx = '\\left(\\dfrac{' + mono(c, v, a) + '}{' + mono(s.d, v, s.b) + '}\\right)^{2}';
    var kn = known([[mono(s.k, v, 2 * s.g), 'u2x-coef-not-raised', 'Square the number too: ' + t(s.k + '^{2}=' + s.k * s.k) + '.'],
      [mono(2 * s.k, v, 2 * s.g), 'u2x-coef-times-exp', t(s.k + '^{2}') + ' means ' + t(s.k + '\\times ' + s.k) + ', not ' + t(s.k + '\\times 2') + '.'],
      [mono(s.k * s.k, v, s.g + 2), 'u2x-add-exp', 'Squaring a power <b>multiplies</b> its exponent by ' + t('2') + ': ' + t('(' + pw(v, s.g) + ')^{2}=' + pw(v, 2 * s.g)) + '.'],
      [mono(s.k * s.k, v, s.g), 'u2x-missed-factor', 'Square <b>every</b> factor inside the bracket, the letter too.']], tgt);
    return XP('Simplify ' + t(tx) + '.', tgt, { vars: [v] },
      'Simplify inside the bracket first: ' + t('\\frac{' + mono(c, v, a) + '}{' + mono(s.d, v, s.b) + '}=' + s.k + v + '^{' + a + '-' + s.b + '}=' + mono(s.k, v, s.g)) + '.<br>Then square: ' + t('\\left(' + mono(s.k, v, s.g) + '\\right)^{2}=' + s.k + '^{2}' + v + '^{' + s.g + '\\times 2}=' + tgt) + '.',
      ['Simplify inside the bracket first: divide the numbers, subtract the exponents.', 'Then square every factor: the number and the letter (double the exponent).'], 'simplify inside, then square', kn);
  }
  HW.defineExit({ lesson: 'u2l4', calc: false, outcome: 'AN3',
    blurb: 'Combining the exponent laws: the power law then the product or quotient law, with one or two letters.',
    questions: [Q(1, 'PRG', l4q1), Q(2, 'MAS', l4q2), Q(3, 'PRG', l4q3)] });

  /* ===== Lesson 5 — Zero Exponents ===== */
  function l5q1(r) { // Ryan (MC): 6x⁰ · 9y⁰
    var c = r.int(2, 12), v = r.pick(['x', 'y', 'a', 'n', 'p']), tx = c + v + '^{0}';
    return P.mc(r, 'Simplify ' + t(tx) + '. (Assume ' + t(v + '\\neq 0') + '.)', [
      { html: t(String(c)), right: true },
      { html: t('1'), code: 'u2x-zero-whole', why: 'The exponent ' + t('0') + ' is only on ' + t(v) + ', so ' + t(v + '^{0}=1') + ' and ' + t(c + '\\times 1=' + c) + '. Only ' + t('(' + c + v + ')^{0}') + ' would equal ' + t('1') + '.' },
      { html: t('0'), code: 'u2x-zero-pow', why: 'Any non-zero base to the power ' + t('0') + ' equals ' + t('1') + ', not ' + t('0') + '.' },
      { html: t(c + v), code: 'u2x-zero-ignored', why: 'The zero exponent can’t be skipped: ' + t(v + '^{0}=1') + ', so ' + t(tx + '=' + c + '\\times 1=' + c) + '.' }],
      'The exponent ' + t('0') + ' belongs only to ' + t(v) + ': ' + t(tx + '=' + c + '\\times ' + v + '^{0}=' + c + '\\times 1=' + c) + '.',
      ['An exponent belongs only to the base right below it — here just ' + t(v) + '.', 'Any non-zero base to the power ' + t('0') + ' is ' + t('1') + '.'], 'zero exponent on the letter only');
  }
  function l5q2(r) { // Ryan: (−3)⁰ + 2⁰ × 5 → 6 · (−5)⁰ + 4⁰ × 3 → 4
    var s = find(function () { return { a: r.int(2, 9), b: r.int(2, 9), c: r.int(2, 9) }; }, function (s) { var w = [0, -s.a + s.b * s.c, s.c - 1, 2 * s.c]; return w.indexOf(1 + s.c) < 0 && w[1] !== w[2] && w[1] !== w[3] && w[1] !== 0 && s.a !== s.b; });
    var tx = '(-' + s.a + ')^{0}+' + s.b + '^{0}\\times ' + s.c, val = 1 + s.c;
    var kn = known([['0', 'u2x-zero-pow', 'A non-zero base to the power ' + t('0') + ' is ' + t('1') + ', not ' + t('0') + '.'],
      [String(-s.a + s.b * s.c), 'u2x-zero-ignored', 'The zero exponents can’t be skipped: ' + t('(-' + s.a + ')^{0}=1') + ' and ' + t(s.b + '^{0}=1') + '.'],
      [String(s.c - 1), 'u2x-neg-base', 'The brackets make ' + t('-' + s.a) + ' the base, so ' + t('(-' + s.a + ')^{0}=1') + ', not ' + t('-1') + '.'],
      [String(2 * s.c), 'u2x-order-ops', 'Multiply before you add: ' + t('1+1\\times ' + s.c + '=1+' + s.c) + '.']], String(val));
    return NUM('Evaluate ' + t(tx) + '.', val, kn, [tx],
      'Each power with exponent ' + t('0') + ' is ' + t('1') + ': ' + t('(-' + s.a + ')^{0}=1') + ' and ' + t(s.b + '^{0}=1') + '.<br>' + t('1+1\\times ' + s.c + '=1+' + s.c + '=' + val) + ' (multiply before adding).',
      ['Any non-zero base to the power ' + t('0') + ' is ' + t('1') + ' — a negative base in brackets too.', 'Then use the order of operations: multiply before you add.'], 'zero exponents with order of operations');
  }
  function l5q3(r) { // Ryan: (2c³)⁰ × 5c⁴ · 4m⁵ × (3m²)⁰
    var v = r.pick(['c', 'm', 'x', 'a', 'd']), s = find(function () { return { c: r.int(2, 9), a: r.int(2, 6), d: r.int(2, 9), b: r.int(2, 7), first: r.chance(0.5) }; }, function (s) { return s.a !== s.b && s.c !== s.d; });
    var Z = '\\left(' + mono(s.c, v, s.a) + '\\right)^{0}', B = mono(s.d, v, s.b), tx = s.first ? Z + '\\times ' + B : B + '\\times ' + Z, tgt = B;
    var kn = known([[mono(s.c * s.d, v, s.b), 'u2x-zero-inside', 'The zero exponent is on the <b>whole bracket</b>, so ' + t(Z + '=1') + ' — the ' + t(s.c) + ' becomes ' + t('1') + ' too.'],
      [mono(s.c * s.d, v, s.a + s.b), 'u2x-zero-ignored', 'The zero exponent can’t be skipped: ' + t(Z + '=1') + '.'],
      ['0', 'u2x-zero-pow', 'A bracket to the power ' + t('0') + ' is ' + t('1') + ', not ' + t('0') + '.']], tgt);
    return XP('Simplify ' + t(tx) + '.', tgt, { vars: [v] },
      'The whole bracket has exponent ' + t('0') + ', so ' + t(Z + '=1') + '. Then ' + t(tx + '=' + (s.first ? '1\\times ' + B : B + '\\times 1') + '=' + tgt) + '.',
      ['A bracket raised to the power ' + t('0') + ' is ' + t('1') + ' — everything inside it.', 'Multiplying by ' + t('1') + ' changes nothing.'], 'zero exponent on a bracket', kn);
  }
  function l5q4(r) { // added Mastery: Assignment 5 Q9(b), Q10 — (3a²b⁰)² / a³
    var L = r.pick(PAIRS), x = L[0], y = L[1], s = find(function () {
      var c = r.int(2, 6), dv = [1, 1].concat([2, 3, 4, 6, 8, 9].filter(function (d) { return (c * c) % d === 0 && d < c * c; }));
      var a = r.int(2, 4); return { c: c, d: r.pick(dv), a: a, b: r.int(1, 2 * a - 1) };
    }, function (s) { return !(s.c === 2 && s.d === 4) && 2 * s.a - s.b <= 6; });
    var A = '\\left(' + s.c + pw(x, s.a) + y + '^{0}\\right)^{2}', D = mono(s.d, x, s.b), tx = '\\dfrac{' + A + '}{' + D + '}', T = M([s.c * s.c, s.d], [[x, 2 * s.a - s.b]]), tgt = ptex(T);
    var kn = known([['0', 'u2x-zero-pow', t(y + '^{0}=1') + ', not ' + t('0') + '.'],
      [ptex(M([s.c, s.d], [[x, 2 * s.a - s.b]])), 'u2x-coef-not-raised', 'Square the ' + t(s.c) + ' too: ' + t(s.c + '^{2}=' + s.c * s.c) + '.'],
      ['\\frac{1}{' + D + '}', 'u2x-zero-whole', 'The ' + t('0') + ' is on ' + t(y) + ' only, not on the whole bracket: ' + t(y + '^{0}=1') + ', so the bracket is ' + t(s.c + pw(x, s.a)) + '.'],
      [ptex(M([s.c * s.c, s.d], [[x, s.a + 2 - s.b]])), 'u2x-add-exp', 'Squaring a power <b>multiplies</b> its exponent by ' + t('2') + '.'],
      [ptex(M([s.c * s.c, s.d], [[x, 2 * s.a - s.b], [y, 2]])), 'u2x-zero-ignored', t(y + '^{0}=1') + ', so there is no ' + t(y) + ' left in the answer.']], tgt);
    return XP('Simplify ' + t(tx) + '. (Assume no letter is ' + t('0') + '.)', tgt, { vars: L },
      t(y + '^{0}=1') + ', so ' + t(A + '=\\left(' + s.c + pw(x, s.a) + '\\right)^{2}=' + mono(s.c * s.c, x, 2 * s.a)) + '.<br>Quotient law: ' + t('\\frac{' + mono(s.c * s.c, x, 2 * s.a) + '}{' + D + '}=' + (s.d === 1 ? String(s.c * s.c) : '\\frac{' + s.c * s.c + '}{' + s.d + '}') + x + '^{' + 2 * s.a + '-' + s.b + '}=' + tgt) + '.',
      ['The zero exponent is only on ' + t(y) + ': ' + t(y + '^{0}=1') + '.', 'Then square the bracket (number and exponent) and divide (subtract the exponents).'], 'zero exponent inside a squared bracket', kn);
  }
  HW.defineExit({ lesson: 'u2l5', calc: false, outcome: 'AN3',
    blurb: 'Zero exponents: what the exponent 0 is attached to, evaluating with zero exponents, and simplifying with a bracket to the power 0.',
    questions: [Q(1, 'BEG', l5q1), Q(2, 'PRG', l5q2), Q(3, 'PRG', l5q3), Q(4, 'MAS', l5q4)] });

  /* ===== Lesson 6 — Negative Exponents ===== */
  var NEGP = [[2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [10, 3], [2, 7], [11, 2], [12, 2]];
  function l6q1(r) { // Ryan: 3⁻² · 2⁻⁴ (as a fraction)
    var pr = r.pick(NEGP), a = pr[0], n = pr[1], P0 = Math.pow(a, n), tx = a + '^{-' + n + '}';
    var kn = known([['-' + P0, 'u2x-opposite', 'A negative exponent means <b>reciprocal</b>, not a negative number: ' + t(tx + '=\\frac{1}{' + a + '^{' + n + '}}') + '.'],
      ['-' + a * n, 'u2x-base-times-exp', 'An exponent is repeated multiplication, not base × exponent; and a negative exponent means reciprocal.'],
      [String(P0), 'u2x-no-flip', t(tx) + ' is the <b>reciprocal</b> of ' + t(a + '^{' + n + '}') + ': ' + t('\\frac{1}{' + P0 + '}') + '.'],
      ['-\\frac{1}{' + P0 + '}', 'u2x-neg-value', 'A negative exponent never makes the value negative: ' + t(tx + '=\\frac{1}{' + P0 + '}') + '.']], '\\frac{1}{' + P0 + '}');
    return NUM('Evaluate ' + t(tx) + '. Give your answer as a fraction.', R(1, P0), kn, [tx],
      'A negative exponent means reciprocal: ' + t(tx + '=\\frac{1}{' + a + '^{' + n + '}}=\\frac{1}{' + rep(a, n) + '}=\\frac{1}{' + P0 + '}') + '.',
      ['Negative exponent rule: ' + t('a^{-n}=\\frac{1}{a^{n}}') + '.', 'Then work out ' + t(a + '^{' + n + '}') + '.'], 'evaluate ' + tx);
  }
  function l6q2(r) { // Ryan: 6x⁻³ · 5y⁻²
    var v = r.pick(['x', 'y', 'a', 'm', 'k']), c = r.int(2, 12), n = r.int(2, 7), tx = c + v + '^{-' + n + '}', tgt = '\\frac{' + c + '}{' + pw(v, n) + '}';
    var kn = known([['\\frac{1}{' + c + pw(v, n) + '}', 'u2x-coef-side', 'Only ' + t(v) + ' has the negative exponent, so only ' + t(pw(v, n)) + ' moves below the fraction bar. The ' + t(c) + ' stays on top.'],
      ['-' + c + pw(v, n), 'u2x-opposite', 'A negative exponent means <b>reciprocal</b>, not a negative sign.'],
      [c + pw(v, n), 'u2x-dropped-neg', 'The exponent is negative: ' + t(v + '^{-' + n + '}=\\frac{1}{' + pw(v, n) + '}') + '.']], tgt);
    return XP('Write ' + t(tx) + ' with a positive exponent.', tgt, { vars: [v] },
      'The exponent ' + t('-' + n) + ' is only on ' + t(v) + ': ' + t(tx + '=' + c + '\\times\\frac{1}{' + pw(v, n) + '}=' + tgt) + '.',
      ['An exponent belongs only to the base right below it — here just ' + t(v) + '.', t('a^{-n}=\\frac{1}{a^{n}}') + ': that factor moves below the fraction bar with a positive exponent.'], 'positive exponent ' + tx, kn);
  }
  function l6q3(r) { // Ryan: 12x² ÷ 3x⁶ → 4/x⁴ · 20a³ ÷ 4a⁷ → 5/a⁴
    var v = r.pick(['x', 'a', 'y', 'b', 'm']), s = find(function () { return { c2: r.int(2, 9), q: r.int(2, 9), a: r.int(1, 5), g: r.int(2, 6) }; }, function (s) { return s.c2 * s.q <= 72; });
    var c1 = s.c2 * s.q, b = s.a + s.g, tx = mono(c1, v, s.a) + '\\div ' + mono(s.c2, v, b), tgt = '\\frac{' + s.q + '}{' + pw(v, s.g) + '}';
    var kn = known([[mono(s.q, v, s.g), 'u2x-dropped-neg', t(s.a + '-' + b + '=-' + s.g) + ': the exponent is negative, so ' + t(pw(v, s.g)) + ' goes below the fraction bar.'],
      ['\\frac{1}{' + mono(s.q, v, s.g) + '}', 'u2x-coef-side', 'Only the ' + t(v) + '-part has the negative exponent; the ' + t(s.q) + ' stays on top.'],
      [mono(s.q, v, s.a + b), 'u2x-add-for-sub', 'Dividing powers with the same base: <b>subtract</b> the exponents.']], tgt);
    return XP('Simplify, then write with a positive exponent: ' + t(tx) + '.', tgt, { vars: [v] },
      'Divide the numbers and subtract the exponents: ' + t(tx + '=' + s.q + v + '^{' + s.a + '-' + b + '}=' + s.q + v + '^{-' + s.g + '}') + '.<br>Positive exponent: ' + t(s.q + v + '^{-' + s.g + '}=' + tgt) + '.',
      ['Quotient law: subtract the exponents (first minus second), even if the answer is negative.', 'Then move only the power with the negative exponent below the fraction bar.'], 'quotient to a negative exponent', kn);
  }
  function l6q4(r) { // added Mastery: Assignment 6 Q10 — 15a²b⁴ ÷ 3a⁶b · 24x³y ÷ 6x⁵y⁴
    var L = r.pick(PAIRS), x = L[0], y = L[1], s = find(function () { return { c2: r.int(2, 8), q: r.int(2, 6), p: r.int(1, 4), g: r.int(1, 4), q1: r.int(1, 5), h: r.pick([-3, -2, -1, 1, 2, 3]) }; }, function (s) { return s.c2 * s.q <= 48 && s.q1 + Math.max(0, -s.h) >= 1 && s.q1 - s.h >= 1 && s.g + Math.abs(s.h) >= 3; });
    var c1 = s.c2 * s.q, A = M(c1, [[x, s.p], [y, s.q1]]), B = M(s.c2, [[x, s.p + s.g], [y, s.q1 - s.h]]), T = mdiv(A, B), tgt = ptex(T), tx = rtex(A) + '\\div ' + rtex(B);
    var kn = known([[ptex(M(s.q, [[x, s.g], [y, s.h]])), 'u2x-dropped-neg', t(s.p + '-' + (s.p + s.g) + '=-' + s.g) + ': a negative exponent means ' + t(pw(x, s.g)) + ' belongs below the fraction bar.'],
      [ptex(M([1, s.q], [[x, -s.g], [y, s.h]])), 'u2x-coef-side', 'Only the powers with negative exponents move; the ' + t(s.q) + ' stays on top.'],
      [ptex(M(s.q, [[x, 2 * s.p + s.g], [y, 2 * s.q1 - s.h]])), 'u2x-add-for-sub', 'Dividing powers with the same base: <b>subtract</b> the exponents.']], tgt);
    return XP('Simplify. Write the answer with positive exponents: ' + t(tx) + '.', tgt, { vars: L },
      'Divide the numbers, and subtract the exponents of each letter:<br>' + t(tx + '=' + s.q + x + '^{' + s.p + '-' + (s.p + s.g) + '}' + y + '^{' + s.q1 + '-' + paren(s.q1 - s.h) + '}=' + rtex(T)) + '.<br>Positive exponents: ' + t(rtex(T) + '=' + tgt) + '.',
      ['Work one letter at a time: subtract the exponents (first minus second).', 'Move only the powers with negative exponents below the fraction bar; the number stays on top.'], 'two-letter quotient with negative exponents', kn);
  }
  HW.defineExit({ lesson: 'u2l6', calc: false, outcome: 'AN3',
    blurb: 'Negative exponents: evaluating, writing with a positive exponent, and dividing powers when the exponent comes out negative.',
    questions: [Q(1, 'BEG', l6q1), Q(2, 'PRG', l6q2), Q(3, 'PRG', l6q3), Q(4, 'MAS', l6q4)] });

  /* ===== Lesson 7 — Combining Zero, Negative and Positive Exponents ===== */
  function l7q1(r) { // Ryan: 18a⁻² ÷ 6a³ → 3/a⁵ · 28b⁻³ ÷ 7b³ → 4/b⁶
    var v = r.pick(['a', 'b', 'x', 'y', 'm']), s = find(function () { return { c2: r.int(2, 9), q: r.int(2, 6), a: r.int(1, 5), b: r.int(1, 5) }; }, function (s) { return s.c2 * s.q <= 50 && s.a + s.b <= 9; });
    var c1 = s.c2 * s.q, tx = mono(c1, v, -s.a) + '\\div ' + mono(s.c2, v, s.b), T = M(s.q, [[v, -s.a - s.b]]), tgt = ptex(T);
    var kn = known([[ptex(M(s.q, [[v, s.b - s.a]])), 'u2x-sub-neg', 'Subtract the exponents carefully: ' + t('-' + s.a + '-' + s.b + '=-' + (s.a + s.b)) + '.'],
      [mono(s.q, v, s.a + s.b), 'u2x-dropped-neg', 'The exponent comes out ' + t('-' + (s.a + s.b)) + ': that power belongs below the fraction bar.'],
      ['\\frac{1}{' + mono(s.q, v, s.a + s.b) + '}', 'u2x-coef-side', 'Only the ' + t(v) + '-part has the negative exponent; the ' + t(s.q) + ' stays on top.']], tgt);
    return XP('Simplify. Use positive exponents only: ' + t(tx) + '.', tgt, { vars: [v] },
      'Divide the numbers and subtract the exponents: ' + t(tx + '=' + s.q + v + '^{-' + s.a + '-' + s.b + '}=' + rtex(T)) + '.<br>Positive exponent: ' + t(rtex(T) + '=' + tgt) + '.',
      ['Quotient law: subtract the exponents — ' + t('-' + s.a + '-' + s.b) + ' is more negative.', 'Then move the negative power below the fraction bar; the number stays on top.'], 'quotient with a negative exponent', kn);
  }
  function l7q2(r) { // Ryan: (2x²)³ × x⁻⁴ → 8x² · (3x³)² × x⁻⁵ → 9x
    var v = r.pick(['x', 'x', 'a', 'y', 't']), s = find(function () { var n = r.pick([2, 2, 3]); return { n: n, c: n === 3 ? r.int(2, 3) : r.int(2, 5), a: r.int(1, 4), m: r.int(2, 8) }; }, function (s) { var E = s.a * s.n - s.m; return E !== 0 && E >= -4 && E <= 6 && s.a * s.n <= 12 && s.a !== s.n && s.a + s.n - s.m !== E; });
    var C = Math.pow(s.c, s.n), E = s.a * s.n - s.m, A = mono(s.c, v, s.a), tx = '\\left(' + A + '\\right)^{' + s.n + '}\\times ' + pw(v, -s.m), T = M(C, [[v, E]]), tgt = ptex(T);
    var kn = known([[ptex(M(s.c, [[v, E]])), 'u2x-coef-not-raised', 'The outside exponent applies to the ' + t(s.c) + ' too: ' + t(s.c + '^{' + s.n + '}=' + C) + '.'],
      [ptex(M(s.c * s.n, [[v, E]])), 'u2x-coef-times-exp', t(s.c + '^{' + s.n + '}') + ' means ' + t(rep(s.c, s.n)) + ', not ' + t(s.c + '\\times ' + s.n) + '.'],
      [ptex(M(C, [[v, s.a * s.n + s.m]])), 'u2x-dropped-neg', 'The exponent of ' + t(pw(v, -s.m)) + ' is <b>negative</b>: add ' + t(s.a * s.n + '+(-' + s.m + ')') + '.'],
      [ptex(M(C, [[v, s.a + s.n - s.m]])), 'u2x-add-exp', 'A power of a power: <b>multiply</b> the exponent in the bracket by ' + t(s.n) + '.']], tgt);
    return XP('Simplify. Use positive exponents only: ' + t(tx) + '.', tgt, { vars: [v] },
      'Power law first: ' + t('\\left(' + A + '\\right)^{' + s.n + '}=' + s.c + '^{' + s.n + '}' + v + '^{' + s.a + '\\times ' + s.n + '}=' + mono(C, v, s.a * s.n)) + '.<br>Product law: ' + t(mono(C, v, s.a * s.n) + '\\times ' + pw(v, -s.m) + '=' + C + v + '^{' + s.a * s.n + '+(-' + s.m + ')}=' + (E < 0 ? rtex(T) + '=' : '') + tgt) + '.',
      ['Clear the bracket first: raise the number to the power and multiply the exponent.', 'Then add the exponents — one of them is negative.'], 'power law then product with a negative exponent', kn);
  }
  function l7q3(r) { // Ryan (Mastery): (2x²)⁻¹ / x³ → 1/(2x⁵) · (3x⁴)⁻¹ / x² → 1/(3x⁶)
    var v = r.pick(['x', 'x', 'a', 'y', 'm']), s = find(function () { var k = r.chance(0.25) ? 2 : 1; return { k: k, c: k === 2 ? r.int(2, 3) : r.int(2, 6), a: r.int(1, 4), b: r.int(1, 5) }; }, function (s) { return s.a * s.k + s.b <= 10 && s.a !== s.b && s.b !== s.a * s.k; });
    var C = Math.pow(s.c, s.k), E = s.a * s.k + s.b, A = mono(s.c, v, s.a), tx = '\\dfrac{\\left(' + A + '\\right)^{-' + s.k + '}}{' + pw(v, s.b) + '}', tgt = '\\frac{1}{' + mono(C, v, E) + '}';
    var kn = known([['\\frac{' + C + '}{' + pw(v, E) + '}', 'u2x-coef-pos-power', 'The ' + t('-' + s.k) + ' applies to the ' + t(s.c) + ' too: ' + t(s.c + '^{-' + s.k + '}=\\frac{1}{' + C + '}') + ', so the number goes below the fraction bar.'],
      ['-\\frac{1}{' + mono(C, v, E) + '}', 'u2x-neg-value', 'A negative exponent means reciprocal; it never makes the answer negative.'],
      [ptex(M([1, C], [[v, s.b - s.a * s.k]])), 'u2x-sub-neg', 'Dividing ' + t(pw(v, -s.a * s.k)) + ' by ' + t(pw(v, s.b)) + ': ' + t('-' + s.a * s.k + '-' + s.b + '=-' + E) + '.'],
      s.k === 2 ? ['\\frac{1}{' + mono(2 * s.c, v, E) + '}', 'u2x-coef-times-exp', t(s.c + '^{2}') + ' means ' + t(s.c + '\\times ' + s.c) + '.'] : null], tgt);
    return XP('Simplify. Use positive exponents only: ' + t(tx) + '.', tgt, { vars: [v] },
      'Apply ' + t('-' + s.k) + ' to every factor in the bracket: ' + t('\\left(' + A + '\\right)^{-' + s.k + '}=' + s.c + '^{-' + s.k + '}' + v + '^{' + s.a + '\\times(-' + s.k + ')}=\\frac{1}{' + mono(C, v, s.a * s.k) + '}') + '.<br>' +
        'Then divide by ' + t(pw(v, s.b)) + ' (add the exponents below the bar): ' + t('\\frac{1}{' + mono(C, v, s.a * s.k) + '\\times ' + pw(v, s.b) + '}=' + tgt) + '.',
      ['A negative power of a bracket: every factor inside gets the exponent, the number too (it becomes a reciprocal).', 'Then combine the powers of ' + t(v) + ' and write with positive exponents.'], 'negative power of a product over a power', kn);
  }
  HW.defineExit({ lesson: 'u2l7', calc: false, outcome: 'AN3',
    blurb: 'Combining zero, negative and positive exponents: quotients, a bracket to a power times a negative power, and a bracket to a negative power.',
    questions: [Q(1, 'PRG', l7q1), Q(2, 'PRG', l7q2), Q(3, 'MAS', l7q3)] });

  /* ===== Lesson 8 — Scientific Notation ===== */
  function digs(r) { var d1 = r.int(1, 9), d2 = r.chance(0.8) ? r.int(1, 9) : 0; return d2 ? String(d1) + d2 : String(d1); }
  function l8q1(r) { // Ryan: 0.00047 · 0.0063
    var D = digs(r), n = r.int(-6, -2), a = coefOf(D), x = cl(a * Math.pow(10, n)), S = stdStr(D, n);
    var ws = [{ v: cl(a * Math.pow(10, -n)), code: 'u2x-sci-sign', hint: 'The number is less than ' + t('1') + ', so the power of ' + t('10') + ' is <b>negative</b>.' }];
    var p = SCI('Write ' + t(S) + ' in scientific notation.', x, ws, [S],
      'Move the decimal point ' + t(-n) + ' places to the right to get ' + t(a) + ' (between ' + t('1') + ' and ' + t('10') + '). The number is less than ' + t('1') + ', so the exponent is negative: ' + t(S + '=' + K.sciTex(x)) + '.',
      ['Move the decimal point until exactly one non-zero digit is in front of it, and count the places.', 'A number less than ' + t('1') + ' has a negative power of ' + t('10') + '.'], 'standard to scientific (small)');
    return addBad(p, [cl(a * Math.pow(10, n + 1)), cl(a * Math.pow(10, n - 1))]);
  }
  function addBad(p, vals) { vals.forEach(function (v) { var b = K.sciTex(v); if (p.bad.indexOf(b) < 0 && b !== p.key) p.bad.push(b); }); return p; }
  function l8q2(r) { // Ryan: 2.6 × 10⁻⁵ · 7.1 × 10⁻⁴ → standard notation
    var D = digs(r), n = r.int(-6, -2), a = coefOf(D), x = cl(a * Math.pow(10, n)), S = stdStr(D, n), tx = a + '\\times 10^{' + n + '}';
    var lo = stdStr(D, n - 1), hi = stdStr(D, n + 1), far = stdStr(D, -n);
    var diag = function (y) {
      if (Math.abs(y - cl(a * Math.pow(10, n - 1))) < 1e-12 || Math.abs(y - cl(a * Math.pow(10, n + 1))) < 1e-12) return { code: 'u2x-std-off', hint: 'Count again: ' + t('10^{' + n + '}') + ' moves the decimal point exactly ' + t(-n) + ' places to the left.' };
      if (Math.abs(y - cl(a * Math.pow(10, -n))) < 1e-9 * Math.abs(a * Math.pow(10, -n))) return { code: 'u2x-std-dir', hint: 'A negative power of ' + t('10') + ' makes the number <b>small</b>: move the decimal point to the <b>left</b>.' };
      return null;
    };
    var base = K.number(x, diag);
    var p = P.number('Write ' + t(tx) + ' in standard notation.', x, diag,
      'The exponent is ' + t(n) + ', so move the decimal point ' + t(-n) + ' places to the <b>left</b>, filling in zeros: ' + t(tx + '=' + S) + '.',
      ['A negative exponent means a small number: move the decimal point to the left.', 'Move it as many places as the exponent says, and fill the gaps with zeros.'], 'scientific to standard (small)', { keys: 'decimal' });
    p.check = function (resp) {
      var s0 = String(resp == null ? '' : resp);
      if (/times|10\^|\\cdot|×/.test(s0)) { var a0 = K.read(s0); if (!a0.res && Math.abs(a0.val - x) < 1e-12) return wrong('u2x-given', 'That is still scientific notation. Write the number out in full as a decimal.'); }
      return base(s0);
    };
    p.key = S; p.answer = t(S); p.bad = [lo, hi, far.replace(/\\,/g, '')];
    return p;
  }
  function l8q3(r) { // Ryan (MC): order 2×10⁻⁴, 4×10⁻³, 7×10⁻⁶ from smallest to largest
    var s = find(function () {
      var es = r.shuffle([-2, -3, -4, -5, -6, -7]).slice(0, 3).sort(function (a, b) { return a - b; }), cs = r.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
      return { items: es.map(function (e, i) { return { c: cs[i], e: e }; }) };
    }, function (s) { var c = s.items.map(function (o) { return o.c; }); return !(c[0] < c[1] && c[1] < c[2]) && !(c[0] > c[1] && c[1] > c[2]); });
    var T = function (o) { return o.c + '\\times 10^{' + o.e + '}'; }, L = function (arr) { return t(arr.map(T).join(',\\ \\ ')); };
    var right = s.items, byCoef = right.slice().sort(function (a, b) { return a.c - b.c; }), rev = right.slice().reverse(), swap = [right[0], right[2], right[1]];
    if (L(swap) === L(byCoef)) swap = [right[1], right[0], right[2]];
    var es = right.map(function (o) { return o.e; });
    return P.mc(r, 'Which list is ordered from <b>smallest to largest</b>?', [
      { html: L(right), right: true },
      { html: L(byCoef), code: 'u2x-ord-coef', why: 'Compare the exponents first — the number in front only matters when the exponents are equal. The smallest exponent gives the smallest number: ' + t(es[0] + '<' + es[1] + '<' + es[2]) + '.' },
      { html: L(rev), code: 'u2x-ord-rev', why: t(es[0]) + ' is <b>less</b> than ' + t(es[2]) + ', so ' + t(T(right[0])) + ' is the smallest number, not the largest.' },
      { html: L(swap), code: 'u2x-ord-swap', why: 'With negative exponents, the more negative exponent is the smaller number. Check the order of ' + t('10^{' + es[1] + '}') + ' and ' + t('10^{' + es[2] + '}') + ' again.' }],
      'Compare the exponents: ' + t(es[0] + '<' + es[1] + '<' + es[2]) + ', so the order is ' + L(right) + '.<br>(As decimals: ' + right.map(function (o) { return t(stdStr(String(o.c), o.e)); }).join(', ') + '.)',
      ['In scientific notation, compare the powers of ' + t('10') + ' first.', 'A more negative exponent means a smaller number: ' + t('10^{-6}<10^{-4}') + '.'], 'order small numbers in scientific notation');
  }
  function l8q4(r) { // added Mastery: Assignment 8 Q9 — 47 × 10³ and 0.8 × 10⁻² are not in scientific notation
    var D = digs(r), big = r.chance(0.55), sh = r.pick([1, 1, 2]), n = r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), a = coefOf(D);
    var g = big ? cl(a * Math.pow(10, sh)) : cl(a * Math.pow(10, -sh)), gS = big ? stdStr(D, sh) : stdStr(D, -sh), tx = gS + '\\times 10^{' + n + '}', N = big ? n + sh : n - sh, x = cl(a * Math.pow(10, N));
    var ws = [{ v: cl(a * Math.pow(10, n)), code: 'u2x-sci-noadjust', hint: 'You moved the decimal point ' + t(sh) + (sh > 1 ? ' places' : ' place') + ', so the power of ' + t('10') + ' has to change by ' + t(sh) + ' too.' },
      { v: cl(a * Math.pow(10, big ? n - sh : n + sh)), code: 'u2x-sci-adjust', hint: big ? 'The number in front got <b>smaller</b> (' + t(gS + '\\to ' + a) + '), so the power of ' + t('10') + ' must get <b>bigger</b> to keep the value the same.' : 'The number in front got <b>bigger</b> (' + t(gS + '\\to ' + a) + '), so the power of ' + t('10') + ' must get <b>smaller</b> to keep the value the same.' }];
    return SCI('The number ' + t(tx) + ' is <b>not</b> written in scientific notation. Rewrite it correctly in scientific notation.', x, ws, [tx],
      t(gS) + (big ? ' is not less than ' + t('10') : ' is less than ' + t('1')) + '. Write it as ' + t(gS + '=' + a + '\\times 10^{' + (big ? sh : -sh) + '}') + '.<br>' +
        'Then ' + t(tx + '=' + a + '\\times 10^{' + (big ? sh : -sh) + '}\\times 10^{' + n + '}=' + a + '\\times 10^{' + (big ? sh : -sh) + '+' + paren(n) + '}=' + K.sciTex(x)) + '.',
      ['The number in front must be at least ' + t('1') + ' and less than ' + t('10') + ': move its decimal point.', 'Moving the point left makes the number in front smaller, so the exponent goes up by the same number of places (and the other way round).'], 'fix scientific notation ' + (big ? '(big front)' : '(small front)'));
  }
  HW.defineExit({ lesson: 'u2l8', calc: false, outcome: 'AN3',
    blurb: 'Scientific notation: small numbers to and from scientific notation, ordering, and fixing a number that isn’t in proper scientific notation.',
    questions: [Q(1, 'BEG', l8q1), Q(2, 'BEG', l8q2), Q(3, 'PRG', l8q3), Q(4, 'MAS', l8q4)] });

  /* ===== Lesson 9 — Rational Exponents and Radical Form ===== */
  var RATS = (function () { var o = []; [[2, [2, 3, 4, 5, 6], [3, 5]], [3, [2, 3, 4, 5], [2, 4, 5]], [4, [2, 3], [3, 5]], [5, [2], [2, 3, 4]]].forEach(function (g) { g[1].forEach(function (rt) { g[2].forEach(function (m) { var v = Math.pow(rt, m); if (v <= 256) o.push({ n: g[0], r: rt, m: m, N: Math.pow(rt, g[0]), v: v }); }); }); }); return o; })();
  function l9q1(r) { // Ryan: 16^(3/4) → 8 · 27^(2/3) → 9
    var s = r.pick(RATS), tx = s.N + '^{\\frac{' + s.m + '}{' + s.n + '}}';
    var kn = known([(s.N * s.m) % s.n === 0 ? [String(s.N * s.m / s.n), 'u2x-base-times-exp', 'An exponent is not a multiplier: ' + t(tx) + ' is not ' + t(s.N + '\\times\\frac{' + s.m + '}{' + s.n + '}') + '. Take the ' + K.rootName(s.n) + ' root, then the power.'] : null,
      [String(s.r), 'u2x-power-only', 'You took the ' + K.rootName(s.n) + ' root — now raise it to the power ' + t(s.m) + ': ' + t(s.r + '^{' + s.m + '}') + '.'],
      [String(s.r * s.m), 'u2x-root-times', t(s.r + '^{' + s.m + '}') + ' means ' + t(rep(s.r, s.m)) + ', not ' + t(s.r + '\\times ' + s.m) + '.'],
      Math.pow(s.N, s.m) <= 100000 ? [String(Math.pow(s.N, s.m)), 'u2x-no-root', 'You raised ' + t(s.N) + ' to the power ' + t(s.m) + ' — the denominator ' + t(s.n) + ' also says to take the ' + K.rootName(s.n) + ' root.'] : null], String(s.v));
    return NUM('Evaluate ' + t(tx) + '.', s.v, kn, [tx],
      'The denominator is the root, the numerator is the power: ' + t(tx + '=\\left(' + rootT(s.n, s.N) + '\\right)^{' + s.m + '}=' + s.r + '^{' + s.m + '}=' + s.v) + '.',
      [t('a^{\\frac{m}{n}}=\\left(\\sqrt[n]{a}\\right)^{m}') + ': the denominator is the root, the numerator is the power.', 'Take the root first so the numbers stay small.'], 'evaluate ' + s.N + '^(' + s.m + '/' + s.n + ')');
  }
  function l9q2(r) { // Ryan: y^(3/5) · m^(2/7) → radical form
    var v = r.pick(['y', 'm', 'x', 'p', 'r', 's']), e = find(function () { return [r.int(2, 6), r.int(3, 8)]; }, function (e) { return e[0] < e[1] && gcd(e[0], e[1]) === 1; }), tx = v + '^{\\frac{' + e[0] + '}{' + e[1] + '}}', tgt = rootT(e[1], pw(v, e[0]));
    var kn = known([[rootT(e[0], pw(v, e[1])), 'u2x-index-power', 'The <b>denominator</b> ' + t(e[1]) + ' is the index of the root and the numerator ' + t(e[0]) + ' is the power: ' + t(tx + '=' + tgt) + '.'],
      [e[0] + rootT(e[1], v), 'u2x-num-coef', 'The numerator ' + t(e[0]) + ' is a <b>power</b>, not a number in front: ' + t(tgt) + '.'],
      [rootT(2, pw(v, e[0])), 'u2x-sqrt-default', 'The denominator ' + t(e[1]) + ' gives the index: it is a ' + K.rootName(e[1]) + ' root, ' + t(rootT(e[1], '\\ ')) + '.']], tgt);
    return XP('Write ' + t(tx) + ' in radical form.', tgt, { form: 'radical', vars: [v] },
      'The denominator ' + t(e[1]) + ' is the index and the numerator ' + t(e[0]) + ' is the power: ' + t(tx + '=' + tgt) + ' (or ' + t('\\left(' + rootT(e[1], v) + '\\right)^{' + e[0] + '}') + ').',
      [t('x^{\\frac{m}{n}}=\\sqrt[n]{x^{m}}') + ': the denominator goes in the “crook” of the root sign.'], 'radical form ' + v + '^(' + e[0] + '/' + e[1] + ')', kn);
  }
  function l9q3(r) { // Ryan: b^(1/4) × b^(1/2) → b^(3/4) · c^(1/3) × c^(1/2) → c^(5/6)
    var v = r.pick(['b', 'c', 'a', 'x', 'm', 'n']), s = find(function () { var q1 = r.pick([2, 3, 4, 5, 6, 8]), q2 = r.pick([2, 3, 4, 5, 6, 8]), p1 = r.chance(0.75) ? 1 : r.int(2, q1 - 1), p2 = 1; return { p1: p1, q1: q1, p2: p2, q2: q2 }; },
      function (s) { var S = add([s.p1, s.q1], [s.p2, s.q2]); return s.q1 !== s.q2 && s.p1 < s.q1 && gcd(s.p1, s.q1) === 1 && S[1] > 1 && S[0] < S[1] * 2 && R(s.p1 + s.p2, s.q1 + s.q2)[1] > 1; });
    var e1 = R(s.p1, s.q1), e2 = R(s.p2, s.q2), S = add(e1, e2), tgt = pw(v, S), tx = pw(v, e1) + '\\times ' + pw(v, e2), cd = s.q1 * s.q2 / gcd(s.q1, s.q2);
    var kn = known([[pw(v, mul(e1, e2)), 'u2x-mult-exp', 'Multiplying powers with the same base: <b>add</b> the exponents.'],
      [v + '^{\\frac{' + (s.p1 + s.p2) + '}{' + (s.q1 + s.q2) + '}}', 'u2x-add-den', 'To add fractions, use a common denominator — don’t add the tops and the bottoms.']], tgt);
    return XP('Simplify. Leave your answer as a power: ' + t(tx) + '.', tgt, { form: 'power', vars: [v] },
      'Product law: add the exponents with a common denominator ' + t(cd) + ': ' + t(eT(e1) + '+' + eT(e2) + '=\\frac{' + e1[0] * cd / e1[1] + '}{' + cd + '}+\\frac{' + e2[0] * cd / e2[1] + '}{' + cd + '}=' + eT(S)) + '.<br>So ' + t(tx + '=' + tgt) + '.',
      ['Same base, multiplying: add the exponents.', 'Adding fractions needs a common denominator.'], 'product law with fractional exponents', kn);
  }
  function l9q4(r) { // added Mastery: Assignment 9 Q3(c) (16/81)^(3/4) and Q12 (9/4)^(−1/2)
    var s = find(function () { var n = r.pick([2, 2, 3, 4]), lim = n === 2 ? 6 : n === 3 ? 4 : 3; return { n: n, p: r.int(1, lim), q: r.int(2, lim), m: r.int(1, 3), negE: r.chance(0.45) }; },
      function (s) { return s.p !== s.q && gcd(s.p, s.q) === 1 && gcd(s.m, s.n) === 1 && (s.m > 1 || s.negE) && Math.pow(Math.max(s.p, s.q), s.m) <= 125 && !(s.m === 3 && s.n === 2 && Math.max(s.p, s.q) > 5); });
    var B = R(Math.pow(s.p, s.n), Math.pow(s.q, s.n)), root = R(s.p, s.q), e = R(s.negE ? -s.m : s.m, s.n), val = rpow(root, s.negE ? -s.m : s.m);
    var bT = '\\left(\\dfrac{' + B[0] + '}{' + B[1] + '}\\right)', tx = bT + '^{' + eT(e) + '}';
    var wr = [['-' + frT(val), 'u2x-neg-value', 'A negative exponent never makes the value negative.']];
    if (s.negE) wr.push([frT(rpow(root, s.m)), 'u2x-no-flip', 'The exponent is negative, so take the <b>reciprocal</b>: flip the fraction.']);
    if (s.m > 1) wr.push([frT(s.negE ? inv(root) : root), 'u2x-power-only', 'You took the ' + K.rootName(s.n) + ' root — now raise it to the power ' + t(s.m) + '.']);
    var kn = known(wr, frT(val));
    var steps = (s.negE ? t(tx + '=\\left(\\frac{' + B[1] + '}{' + B[0] + '}\\right)^{' + eT(neg(e)) + '}') + ' (negative exponent: flip the fraction).<br>' : '') +
      'Root first: ' + t(rootT(s.n, '\\frac{' + (s.negE ? B[1] : B[0]) + '}{' + (s.negE ? B[0] : B[1]) + '}') + '=' + frT(s.negE ? inv(root) : root)) + ' because ' + t(rpow(s.negE ? inv(root) : root, 1)[0] + '^{' + s.n + '}=' + (s.negE ? B[1] : B[0])) + ' and ' + t(rpow(s.negE ? inv(root) : root, 1)[1] + '^{' + s.n + '}=' + (s.negE ? B[0] : B[1])) + '.' +
      (s.m > 1 ? '<br>Then the power: ' + t('\\left(' + frT(s.negE ? inv(root) : root) + '\\right)^{' + s.m + '}=' + frT(val)) + '.' : '');
    return NUM('Evaluate ' + t(tx) + '. Give your answer as a fraction.', val, kn, [tx], steps,
      ['A negative exponent: flip the fraction. The denominator of the exponent: the root. The numerator: the power.', 'Take the root of the top and of the bottom separately.'], 'evaluate a fraction to a rational exponent');
  }
  HW.defineExit({ lesson: 'u2l9', calc: false, outcome: 'AN3',
    blurb: 'Rational exponents: evaluating, writing a power in radical form, the product law with fractional exponents, and a fraction to a rational exponent.',
    questions: [Q(1, 'PRG', l9q1), Q(2, 'BEG', l9q2), Q(3, 'PRG', l9q3), Q(4, 'MAS', l9q4)] });

  /* ===== Lesson 10 — Unit Review: Exponents ===== */
  function l10q1(r) { // Ryan (Mastery): (2t⁻²)³ × t⁴ → 8/t² · (3n⁻³)² × n⁴ → 9/n²
    var v = r.pick(['t', 'n', 'x', 'a', 'k']), s = find(function () { var n = r.pick([2, 2, 3]); return { n: n, c: n === 3 ? r.int(2, 3) : r.int(2, 5), a: r.int(1, 3), m: r.int(1, 6) }; }, function (s) { var E = s.m - s.a * s.n; return E !== 0 && E >= -5 && E <= 3 && s.m !== s.n && -s.a + s.n + s.m !== E && s.a !== s.n; });
    var C = Math.pow(s.c, s.n), E = s.m - s.a * s.n, A = mono(s.c, v, -s.a), tx = '\\left(' + A + '\\right)^{' + s.n + '}\\times ' + pw(v, s.m), T = M(C, [[v, E]]), tgt = ptex(T);
    var kn = known([[ptex(M(s.c, [[v, E]])), 'u2x-coef-not-raised', 'The outside exponent applies to the ' + t(s.c) + ' too: ' + t(s.c + '^{' + s.n + '}=' + C) + '.'],
      [ptex(M(s.c * s.n, [[v, E]])), 'u2x-coef-times-exp', t(s.c + '^{' + s.n + '}') + ' means ' + t(rep(s.c, s.n)) + ', not ' + t(s.c + '\\times ' + s.n) + '.'],
      [ptex(M(C, [[v, -s.a + s.n + s.m]])), 'u2x-add-exp', 'A power of a power: <b>multiply</b> the exponents, ' + t('(-' + s.a + ')\\times ' + s.n + '=-' + s.a * s.n) + '.'],
      [ptex(M([1, C], [[v, E]])), 'u2x-coef-side', 'Only the power of ' + t(v) + ' has a negative exponent; the ' + t(C) + ' stays on top.'],
      [ptex(M(C, [[v, s.a * s.n + s.m]])), 'u2x-dropped-neg', 'The exponent in the bracket is <b>negative</b>: ' + t('(-' + s.a + ')\\times ' + s.n + '=-' + s.a * s.n) + '.']], tgt);
    return XP('Simplify. Use positive exponents only: ' + t(tx) + '.', tgt, { vars: [v] },
      'Power law: ' + t('\\left(' + A + '\\right)^{' + s.n + '}=' + s.c + '^{' + s.n + '}' + v + '^{(-' + s.a + ')\\times ' + s.n + '}=' + mono(C, v, -s.a * s.n)) + '.<br>Product law: ' + t(mono(C, v, -s.a * s.n) + '\\times ' + pw(v, s.m) + '=' + C + v + '^{-' + s.a * s.n + '+' + s.m + '}=' + (E < 0 ? rtex(T) + '=' : '') + tgt) + '.',
      ['Clear the bracket: raise the number to the power and multiply the (negative) exponent.', 'Add the exponents, then move a negative power below the fraction bar.'], 'review: negative exponent in a bracket', kn);
  }
  var NEG10 = [[2, 2], [2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [10, 3]];
  function l10q2(r) { // Ryan: 2⁻³ + 2⁰ → 9/8 · 3⁻² + 3⁰ → 10/9
    var pr = r.pick(NEG10), a = pr[0], n = pr[1], P0 = Math.pow(a, n), op = r.pick(['ab', 'ab', 'ba', 'minus']);
    var comb = function (x0, z) { return op === 'minus' ? add(z, neg(x0)) : add(x0, z); };
    var tx = op === 'ab' ? a + '^{-' + n + '}+' + a + '^{0}' : op === 'ba' ? a + '^{0}+' + a + '^{-' + n + '}' : a + '^{0}-' + a + '^{-' + n + '}', val = comb(R(1, P0), 1);
    var kn = known([[frT(comb(R(-P0), 1)), 'u2x-opposite', 'A negative exponent means <b>reciprocal</b>: ' + t(a + '^{-' + n + '}=\\frac{1}{' + P0 + '}') + ', not ' + t('-' + P0) + '.'],
      [frT(comb(R(1, P0), 0)), 'u2x-zero-pow', t(a + '^{0}=1') + ', not ' + t('0') + '.'],
      [frT(comb(R(-a * n), 1)), 'u2x-base-times-exp', 'An exponent is not a multiplier, and a negative exponent means reciprocal: ' + t(a + '^{-' + n + '}=\\frac{1}{' + P0 + '}') + '.'],
      [frT(comb(R(P0), 1)), 'u2x-no-flip', t(a + '^{-' + n + '}') + ' is the <b>reciprocal</b> of ' + t(a + '^{' + n + '}') + ': ' + t('\\frac{1}{' + P0 + '}') + '.']], frT(val));
    return NUM('Evaluate ' + t(tx) + '. Give your answer as a fraction (or a decimal).', val, kn, [tx],
      t(a + '^{-' + n + '}=\\frac{1}{' + P0 + '}') + ' and ' + t(a + '^{0}=1') + ', so ' + t(tx + '=' + (op === 'ab' ? '\\frac{1}{' + P0 + '}+1' : op === 'ba' ? '1+\\frac{1}{' + P0 + '}' : '1-\\frac{1}{' + P0 + '}') + '=' + (op === 'minus' ? '\\frac{' + P0 + '}{' + P0 + '}-\\frac{1}{' + P0 + '}' : op === 'ba' ? '\\frac{' + P0 + '}{' + P0 + '}+\\frac{1}{' + P0 + '}' : '\\frac{1}{' + P0 + '}+\\frac{' + P0 + '}{' + P0 + '}') + '=' + frT(val)) + '.',
      ['Negative exponent: reciprocal. Zero exponent: ' + t('1') + '.', 'Write ' + t('1') + ' as ' + t('\\frac{' + P0 + '}{' + P0 + '}') + ' to add or subtract the fractions.'], 'zero and negative exponents, evaluate', { dec: true });
  }
  function l10q3(r) { // Ryan: (6.2 × 10³)(4 × 10⁻⁷) → 2.48 × 10⁻³ · (5.5 × 10⁴)(3 × 10⁻⁹) → 1.65 × 10⁻⁴
    var s = find(function () { return { A: r.int(11, 99) / 10, B: r.int(2, 9), m: r.int(2, 6), n: r.int(-9, -3) }; }, function (s) {
      var pr = cl(s.A * s.B); if (pr < 10 || String(s.A).length > 3 || String(cl(pr / 10)).replace('.', '').replace(/^0+/, '').length > 3) return false; return s.m + s.n !== 0 && Math.abs(s.m * s.n + 1) <= 60 && cl(s.A + s.B) !== cl(pr / 10);
    });
    var pr = cl(s.A * s.B), E = s.m + s.n, x = cl(pr * Math.pow(10, E)), tx = '\\left(' + s.A + '\\times 10^{' + s.m + '}\\right)\\times\\left(' + s.B + '\\times 10^{' + s.n + '}\\right)';
    var ws = [{ v: cl(pr / 10 * Math.pow(10, E)), code: 'u2x-sci-noadjust', hint: t(pr) + ' is not between ' + t('1') + ' and ' + t('10') + '. Moving the decimal point one place left makes it ' + t(cl(pr / 10)) + ', so the power of ' + t('10') + ' goes <b>up</b> by ' + t('1') + '.' },
      { v: cl(pr / 10 * Math.pow(10, E - 1)), code: 'u2x-sci-adjust', hint: 'The number in front got smaller (' + t(pr + '\\to ' + cl(pr / 10)) + '), so the power of ' + t('10') + ' must go <b>up</b> by ' + t('1') + ', not down.' },
      { v: cl(pr / 10 * Math.pow(10, s.m * s.n + 1)), code: 'u2x-sci-mult', hint: 'Multiplying powers of ' + t('10') + ': <b>add</b> the exponents, ' + t(s.m + '+(' + s.n + ')=' + E) + '.' },
      { v: cl((s.A + s.B) * Math.pow(10, E)), code: 'u2x-sci-coef-add', hint: 'Multiply the numbers in front: ' + t(s.A + '\\times ' + s.B) + ', don’t add them.' }];
    return SCI('Evaluate and write in scientific notation: ' + t(tx) + '.', x, ws, [tx],
      'Multiply the numbers and add the exponents: ' + t(s.A + '\\times ' + s.B + '=' + pr) + ' and ' + t('10^{' + s.m + '+(' + s.n + ')}=10^{' + E + '}') + '.<br>' +
        t(pr + '\\times 10^{' + E + '}') + ' isn’t in scientific notation yet: ' + t(pr + '=' + cl(pr / 10) + '\\times 10^{1}') + ', so the answer is ' + t(K.sciTex(x)) + '.',
      ['Multiply the numbers in front; multiply the powers of ' + t('10') + ' by adding their exponents.', 'The number in front must be between ' + t('1') + ' and ' + t('10') + ': move the decimal point and adjust the exponent.'], 'multiply in scientific notation');
  }
  HW.defineExit({ lesson: 'u2l10', calc: false, outcome: 'AN3',
    blurb: 'Review of the unit: the exponent laws with a negative exponent, evaluating zero and negative exponents, and multiplying in scientific notation.',
    questions: [Q(1, 'MAS', l10q1), Q(2, 'PRG', l10q2), Q(3, 'PRG', l10q3)] });
})(window);
