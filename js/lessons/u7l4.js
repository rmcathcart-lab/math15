/* Math 15 · Unit 7 · Lesson 4 — Writing the Equation of a Line Given Slope and y-Intercept (RF7)
 * Assignment 4 (u7_L04.tex, Questions 1–15) and the Lesson 4 Extra Practice (u7_EP04.tex, Questions 1–17), plus one
 * added Mastery challenge (Extra 18). Every part is a generator: same structure, idea and difficulty as the booklet
 * question, new numbers from the seed (the booklet's own numbers and graphs are among the possible versions).
 * Model: Math 10C u7l2.js (directPart, gridLinePart, tables, the fee-and-rate models, intercept boxes, LP with the
 * decimal nudge). Equations are typed with the eq keypad and graded by K.line (js/lines.js): any correct equation of
 * the line is accepted (y = −3 + 2x, general form, …) unless the question asks for y = mx + b (then a right line in
 * another form is a nudge that doesn't use a try); where the question says "keep every fraction exact", a right line
 * typed with decimals is a nudge too. Story letters (C, m, h, t, V, …) are the booklet's.
 * Conversions: "state slope, y-intercept, equation" -> three boxes; "what does the slope / y-intercept represent",
 * "explain", "describe the line in words", "find the mistake" -> multiple choice whose options are reasons or
 * descriptions; "list three points" -> any three correct points.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 18(b) (added: two plans, when do they cost the same). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, Lns = HW.lines, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ---------------- fractions as [p, q] ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function fr(p, q) { if (Array.isArray(p)) return fr(p[0], p[1]); if (q == null) q = 1; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function fv(f) { f = fr(f); return f[0] / f[1]; }
  function fAdd(a, b) { a = fr(a); b = fr(b); return fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function fSub(a, b) { b = fr(b); return fAdd(a, [-b[0], b[1]]); }
  function fMul(a, b) { a = fr(a); b = fr(b); return fr(a[0] * b[0], a[1] * b[1]); }
  function fNeg(a) { a = fr(a); return [-a[0], a[1]]; }
  function fEq(a, b) { a = fr(a); b = fr(b); return a[0] === b[0] && a[1] === b[1]; }
  function isInt(a) { return fr(a)[1] === 1; }
  function nT(a) { a = fr(a); return Lns.frT(a[0], a[1]); }   // LaTeX of a number or fraction
  function pT(a) { return fv(a) < 0 ? '\\left(' + nT(a) + '\\right)' : nT(a); }
  function ptT(x, y) { return '(' + nT(x) + ',\\ ' + nT(y) + ')'; }
  function ptK(x, y) { return '(' + nT(x) + ', ' + nT(y) + ')'; }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }
  function money(v) { return (Math.round(v * 100) / 100).toFixed(2); }
  function cash(v) { return Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : money(v); }

  /* ---------------- random helpers ---------------- */
  function niceFrac(r) { return until(function () { var q = r.pick([2, 2, 3]); return [r.int(1, 13) * r.pick([1, 1, -1]), q]; }, function (f) { return f[0] % f[1] !== 0; }); }
  function nz(r, lo, hi) { var v; do { v = r.int(lo, hi); } while (v === 0); return v; }
  function properFrac(r, qlo, qhi) { for (;;) { var q = r.int(qlo, qhi), p = r.int(1, q - 1); if (gcd(p, q) === 1) return [p, q]; } }
  function until(gen, okf) { for (var i = 0; i < 4000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('u7l4: no valid numbers'); }

  /* ---------------- equations of lines ---------------- */
  function L(m, b) { return { m: fr(m), b: fr(b) }; }
  function SI(m, b, vars) { return Lns.tex({ m: fr(m), b: fr(b) }, 'slope-intercept', null, vars); }
  function evalT(m, x, b) { return (fEq(m, 1) ? '' : fEq(m, -1) ? '-' : nT(m)) + '\\left(' + nT(x) + '\\right)' + (fv(b) < 0 ? '' : '+') + nT(b); }
  function closeL(S, T) {
    if (Math.abs(S[1]) < 1e-12 || Math.abs(T[1]) < 1e-12) return false;
    var ms = -S[0] / S[1], bs = -S[2] / S[1], mt = -T[0] / T[1], bt = -T[2] / T[1];
    return Math.abs(ms - mt) < 0.051 && Math.abs(bs - bt) < 0.051;
  }
  /* the equation part: K.P.line + a nudge for rounded decimals, the general form as an accepted alternative (form 'any'),
   * and the wrong lines (opt.wrong) as answers that must not be accepted */
  function LP(prompt, target, opt, sol, hints, text) {
    opt = opt || {};
    var vars = opt.vars || ['x', 'y'], TL = Lns.of(target);
    if (opt.vars && !opt.placeholder) opt.placeholder = 'e.g. ' + vars[1] + ' = 2' + vars[0] + ' + 3';
    var p = B.line(prompt, target, opt, sol, hints, text), c = p.check;
    p.check = function (resp) {
      var res = c(resp);
      if (res.v === 'wrong' && !opt.decimalOk && /\d\.\d/.test(String(resp))) {
        var rr = Lns.read(resp, vars);
        if (rr.ok && closeL([rr.a, rr.b, rr.c], TL)) return form('u72-decimal', 'Close — but give the <b>exact</b> equation: write the slope and the intercept as fractions, not rounded decimals.');
      }
      return res;
    };
    if (opt.keyTex) { p.key = opt.keyTex; p.answer = t(opt.keyTex); }
    var bad = [];
    (opt.wrong || []).forEach(function (w) { var is = w.is; if (typeof is === 'string') { var rw = Lns.read(is, vars); if (!(rw.ok && Lns.same([rw.a, rw.b, rw.c], TL))) bad.push(is); } else if (!Lns.same(Lns.of(is), TL)) bad.push(Lns.tex(is, 'slope-intercept', null, vars)); });
    p.bad = bad.concat(opt.bad || []).filter(function (x, i, arr) { return arr.indexOf(x) === i; });
    p.good = (!opt.form || opt.form === 'any' ? [Lns.tex(target, 'general', null, vars)] : []).concat(opt.good || []);
    return p;
  }
  /* the question asks for exact fractions: a right line typed with decimals gets a form nudge */
  function exactOnly(p) { var c = p.check; p.check = function (resp) { var res = c(resp); if (res.v === 'correct' && /\d\.\d/.test(String(resp))) return form('u72-decimal', 'Right line — but give it with exact <b>fractions</b>, not decimals, as the question asks.'); return res; }; return p; }

  /* ---------------- other checkers ---------------- */
  function isNone(s) { var z = String(s == null ? '' : s).replace(/\\text\{\s*([^}]*)\}/g, '$1').replace(/\\mathrm\{\s*([^}]*)\}/g, '$1').replace(/[\s-]+/g, '').toLowerCase(); return /^(none|no|dne)$/.test(z); }
  function readVal(s) { var z = String(s == null ? '' : s).replace(/\\left|\\right/g, '').replace(/^\s*[a-zA-Z]\s*=\s*/, '').trim(); var a = ex.parse(z); if (!a.ok) return null; var v = ex.value(a.ast); return isFinite(v) ? v : null; }
  function readPt(s) { var z = String(s == null ? '' : s).replace(/\\left|\\right/g, '').trim(); var m = /^\(([^()]*),([^()]*)\)$/.exec(z); if (!m) return null; var a = readVal(m[1]), b = readVal(m[2]); return a == null || b == null ? null : [a, b]; }
  /* one intercept box (the y-intercept as a number b or a point (0, b)); dl = [[value, code, hint]] */
  function intChk(want, dl) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Fill in the ' + t('y') + '-intercept.');
      if (isNone(s)) return wrong('u72-int-said-none', 'This line does cross the ' + t('y') + '-axis — read where.');
      var P = readPt(s), v;
      if (P) {
        if (!near(P[0], 0)) return wrong('u72-int-off', t('(' + P[0] + ',\\ ' + P[1] + ')') + ' isn’t on the ' + t('y') + '-axis: on the ' + t('y') + '-axis, ' + t('x=0') + '.');
        v = P[1];
      } else { v = readVal(s); if (v == null) return form('u72-int-unreadable', 'Give the ' + t('y') + '-intercept as a number.'); }
      if (near(v, fv(want))) return ok();
      for (var i = 0; i < (dl || []).length; i++) if (!near(fv(dl[i][0]), fv(want)) && near(v, fv(dl[i][0]))) return wrong(dl[i][1], dl[i][2]);
      if (near(v, -fv(want))) return wrong('sign', 'Check the sign: is the ' + t('y') + '-intercept above or below the origin?');
      return wrong('value', null);
    };
  }
  /* a slope box with diagnoses checked first: pre = [[value, code, hint]] */
  function slopeChk(sl, pre, opt) {
    var c = K.slope(sl, opt || {});
    pre = (pre || []).filter(function (d) { return !fEq(d[0], sl); });
    return function (resp) {
      var v = readVal(String(resp == null ? '' : resp).replace(/^\s*m\s*=\s*/, ''));
      if (v != null) for (var i = 0; i < pre.length; i++) if (near(v, fv(pre[i][0]))) return wrong(pre[i][1], pre[i][2]);
      return c(resp);
    };
  }
  function numPart(prompt, ans, dl, sol, hints, text, inp) {
    dl = (dl || []).filter(function (d) { return isFinite(d[0]) && !near(d[0], ans); });
    var p = B.number(prompt, ans, function (v) { for (var i = 0; i < dl.length; i++) if (Math.abs(v - dl[i][0]) < 1e-5) return { code: dl[i][1], hint: dl[i][2] }; return null; }, sol, hints, text, inp);
    p.key = String(Math.round(ans * 1e6) / 1e6); p.answer = (inp && inp.before ? t(inp.before) : '') + t(String(Math.round(ans * 1e6) / 1e6)) + (inp && inp.after ? ' ' + inp.after : '');
    p.bad = dl.map(function (d) { return String(Math.round(d[0] * 1e6) / 1e6); }).filter(function (x, i, arr) { return arr.indexOf(x) === i; });
    return p;
  }
  function nrPart(prompt, ans, dl, sol, hints, text) {
    dl = (dl || []).filter(function (d) { return isFinite(d[0]) && !near(d[0], ans); });
    var p = B.nr(prompt, ans, function (v) { for (var i = 0; i < dl.length; i++) if (near(v, dl[i][0])) return { code: dl[i][1], hint: dl[i][2] }; return null; }, sol, hints, text);
    p.bad = dl.map(function (d) { return String(Math.round(d[0] * 100) / 100); }).filter(function (s, i, arr) { return s.length <= 4 && arr.indexOf(s) === i; });
    return p;
  }
  /* a number or fraction box: dl = [[value, code, hint]] */
  function valPart(prompt, target, dl, sol, hints, text, inp) {
    var base = isInt(target) ? K.value(fv(target), { only: 'integer' }) : K.fraction(fr(target));
    dl = (dl || []).filter(function (d) { return !near(fv(d[0]), fv(target)); });
    var chk = function (resp) {
      var s = String(resp == null ? '' : resp).replace(/^\s*[a-zA-Z]\s*=\s*/, '');
      var res = base(s);
      if (res.v === 'wrong') { var v = readVal(s); if (v != null) for (var i = 0; i < dl.length; i++) if (near(v, fv(dl[i][0]))) return wrong(dl[i][1], dl[i][2]); }
      return res;
    };
    var p = B.math(prompt, chk, nT(target), sol, hints, text, Object.assign({ keys: 'fraction' }, inp || {}));
    p.bad = dl.map(function (d) { return nT(d[0]); });
    return p;
  }
  /* one point (x, y): dl = [[[x, y], code, hint]] */
  function ptPart(prompt, P, dl, sol, hints, text) {
    var p = B.pairs(prompt, [[fv(P[0]), fv(P[1])]], {}, sol, hints, text), c = p.check;
    dl = (dl || []).filter(function (d) { return !(near(fv(d[0][0]), fv(P[0])) && near(fv(d[0][1]), fv(P[1]))); });
    p.check = function (resp) {
      var s = String(resp == null ? '' : resp);
      if (s.trim() && !/[(]|\\left|\\lparen/.test(s) && readVal(s) != null) return form('u72-pt-value', 'Give the whole point as an ordered pair ' + t('(x,\\ y)') + ', not just one number.');
      var res = c(resp);
      if (res.v === 'wrong') for (var i = 0; i < dl.length; i++) if (K.pairs([[fv(dl[i][0][0]), fv(dl[i][0][1])]])(resp).v === 'correct') return wrong(dl[i][1], dl[i][2]);
      return res;
    };
    p.key = ptK(P[0], P[1]); p.answer = t(ptT(P[0], P[1]));
    p.bad = dl.map(function (d) { return ptK(d[0][0], d[0][1]); });
    return p;
  }
  /* several points typed by the student (any correct ones): o = { n, test(p) -> null | { code, hint } } */
  function readPts(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\\{|\\\}|\\lbrace|\\rbrace/g, ' ').replace(/\\[,;:! ]|\\quad/g, ' ').replace(/−/g, '-').trim();
    if (!s.trim()) return { empty: true };
    var re = /\(([^()]*)\)/g, m, out = [];
    while ((m = re.exec(s))) {
      var xy = m[1].split(','); if (xy.length !== 2) return { bad: true };
      var a = ex.parse(xy[0].trim()), b = ex.parse(xy[1].trim()); if (!a.ok || !b.ok) return { bad: true };
      var va = ex.value(a.ast), vb = ex.value(b.ast); if (!isFinite(va) || !isFinite(vb)) return { bad: true };
      out.push([va, vb]);
    }
    if (s.replace(re, '').replace(/[,;\s{}]|and/g, '').length || !out.length) return { bad: true };
    return { pts: out };
  }
  function ptsPart(prompt, o, key, sol, hints, text) {
    var n = o.n || 1;
    var chk = function (resp) {
      var Lr = readPts(resp);
      if (Lr.empty) return form('empty', 'Type your points first.');
      if (Lr.bad) return form('pts-format', 'Write each point in brackets, separated by commas, e.g. ' + t('(3,\\ 0),\\ (4,\\ 3)') + '.');
      var P = Lr.pts, i, j;
      for (i = 0; i < P.length; i++) for (j = 0; j < i; j++) if (near(P[i][0], P[j][0]) && near(P[i][1], P[j][1])) return form('pts-dup', 'You wrote ' + t(ptT(P[i][0], P[i][1])) + ' twice — give ' + n + ' different points.');
      for (i = 0; i < P.length; i++) { var h = o.test(P[i]); if (h) return wrong(h.code, h.hint); }
      if (P.length < n) return form('pts-few', (P.length === 1 ? 'That point works! ' : 'Those work! ') + 'You need ' + n + ' points in all.');
      return ok();
    };
    return B.math(prompt, chk, key.map(function (q) { return ptK(q[0], q[1]); }).join(', '), sol, hints, text, { keys: 'pairs', placeholder: 'e.g. (3, 0), (4, 3)' });
  }
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  function uniqOpts(opts) { var seen = {}; return opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; }); }
  /* fields: equation-keypad boxes */
  function fld(label, opt) { return Object.assign({ name: label, label: label, mode: 'math', keys: 'eq', placeholder: 'number' }, opt || {}); }

  /* ---------------- figures ---------------- */
  var BLUE = '#2456b8', RED = '#b23a3a';
  function clipLine(Ls, xr, yr) {
    var m = fv(Ls.m), b = fv(Ls.b), pts = [];
    if (m === 0) return [[xr[0], b], [xr[1], b]];
    [xr[0], xr[1]].forEach(function (x) { var y = m * x + b; if (y >= yr[0] - 1e-9 && y <= yr[1] + 1e-9) pts.push([x, y]); });
    [yr[0], yr[1]].forEach(function (y) { var x = (y - b) / m; if (x >= xr[0] - 1e-9 && x <= xr[1] + 1e-9) pts.push([x, y]); });
    pts.sort(function (a, c) { return a[0] - c[0]; });
    return [pts[0], pts[pts.length - 1]];
  }
  function r1(v) { return Math.round(v * 10) / 10; }
  /* a grid with lines (arrows at both ends) and an italic letter beside each: lines [{ m, b, color, label, f, side }] */
  function figure(spec, lines) {
    var xr = spec.x, yr = spec.y;
    var segs = lines.map(function (Ls) { return { pts: clipLine(Ls, xr, yr), color: Ls.color || BLUE }; });
    var svg = HW.graph(Object.assign({}, spec, { segs: (spec.segs || []).concat(segs) })), G = HW.graph.last, add = '';
    lines.forEach(function (Ls, i) {
      var pp = segs[i].pts, col = segs[i].color;
      [[pp[0], pp[1]], [pp[1], pp[0]]].forEach(function (e) {
        var px = G.X(e[0][0]), py = G.Y(e[0][1]), qx = G.X(e[1][0]), qy = G.Y(e[1][1]), d = Math.hypot(px - qx, py - qy) || 1, ux = (px - qx) / d, uy = (py - qy) / d, bx = px - ux * 10, by = py - uy * 10;
        add += '<path d="M' + r1(px) + ' ' + r1(py) + ' L' + r1(bx - uy * 5) + ' ' + r1(by + ux * 5) + ' L' + r1(bx + uy * 5) + ' ' + r1(by - ux * 5) + ' Z" fill="' + col + '"/>';
      });
      if (Ls.label) {
        var top = pp[0][1] > pp[1][1] ? pp[0] : pp[1], bot = top === pp[0] ? pp[1] : pp[0], f = Ls.f == null ? 0.84 : Ls.f;
        if (pp[0][1] === pp[1][1]) { top = pp[1]; bot = pp[0]; }
        var lx = G.X(bot[0] + (top[0] - bot[0]) * f), ly = G.Y(bot[1] + (top[1] - bot[1]) * f);
        var dx = G.X(top[0]) - G.X(bot[0]), dy = G.Y(top[1]) - G.Y(bot[1]), dd = Math.hypot(dx, dy) || 1, off = Ls.side || 1;
        lx += -dy / dd * 14 * off; ly += dx / dd * 14 * off;
        lx = Math.max(G.padL + 10, Math.min(G.W - 12, lx)); ly = Math.max(14, Math.min(G.H - 22, ly));
        add += '<text x="' + r1(lx) + '" y="' + r1(ly + 4) + '" font-size="15" font-style="italic" text-anchor="middle" fill="' + col + '" stroke="#fff" stroke-width="3" paint-order="stroke">' + Ls.label + '</text>';
      }
    });
    return svg.replace('</svg>', add + '</svg>');
  }
  /* one line on a [-6, 6] grid with two marked lattice points */
  function markedFig(m, b, P, Q, col) {
    return figure({ x: [-6, 6], y: [-6, 6], labels: 2, max: 320, points: [{ x: P[0], y: P[1], color: '#1c2230' }, { x: Q[0], y: Q[1], color: '#1c2230' }], aria: 'a line through two marked points' }, [{ m: m, b: [b, 1], color: col || BLUE }]);
  }

  /* ---------------- hints shared by many parts ---------------- */
  var H_SI = ['In ' + t('y=mx+b') + ', ' + t('m') + ' is the slope and ' + t('b') + ' is the ' + t('y') + '-intercept. Put both numbers in their places.', 'Check: when ' + t('x=0') + ', your equation should give the ' + t('y') + '-intercept.'];
  var H_GR = ['Read ' + t('b') + ' where the line crosses the ' + t('y') + '-axis. Then move along the line to the next lattice point and count the rise and the run.', 'A line that falls from left to right has a negative slope.'];
  var H_TAB = ['The ' + t('y') + '-intercept is the ' + t('y') + '-value paired with ' + t('x=0') + '.', 'The ' + t('x') + '-values go up by ' + t('1') + ', so the slope is the change in ' + t('y') + ' from one column to the next.'];
  var H_CTX = ['The <b>starting amount</b> (the value before any time passes) is ' + t('b') + '; the <b>rate per unit</b> is ' + t('m') + '.', 'Something that goes <b>down</b> over time has a negative rate.'];

  /* ---------------- part makers ---------------- */
  var SWAP = function () { return 'You swapped them: the slope ' + t('m') + ' multiplies ' + t('x') + ', and the ' + t('y') + '-intercept ' + t('b') + ' is the number added on its own.'; };
  /* Q1: slope and y-intercept given */
  function directPart(m, b, prompt, text, extra) {
    var w = (extra || []).slice();
    if (!fEq(m, b) && !(fv(b) === 0)) w.push({ is: L(b, m), code: 'u72-swap-mb', hint: SWAP() });
    return LP(prompt, L(m, b), { wrong: w },
      t('m=' + nT(m)) + ' and ' + t('b=' + nT(b)) + '. Put them into ' + t('y=mx+b') + ': ' + t(SI(m, b)) + '.<br><b>Check.</b> ' + t('x=0\\Rightarrow y=' + nT(b)) + ' ✓', H_SI, text);
  }
  /* the slope / y-intercept / equation boxes for a line read from a graph or a table */
  function threeBox(prompt, m, b, sol, hints, text, opt) {
    opt = opt || {};
    var target = L(m, b), xi = fv(b) === 0 ? null : fr(-fv(b) * fr(m)[1], fr(m)[0]);
    var lw = [{ is: L(fNeg(m), b), code: 'line-slope-sign', hint: 'Check the sign of the slope: the line ' + (fv(m) > 0 ? 'rises' : 'falls') + ' from left to right.' }];
    if (isInt(m) && !fEq(m, b) && fv(b) !== 0) lw.push({ is: L(b, m), code: 'u72-swap-mb', hint: SWAP() });
    if (xi && !fEq(xi, b) && fv(m) !== 0) lw.push({ is: L(m, xi), code: 'u72-b-xint', hint: 'In ' + t('y=mx+b') + ', ' + t('b') + ' is where the line crosses the <b>' + t('y') + '</b>-axis, not the ' + t('x') + '-axis.' });
    var fields = [fld('slope', { placeholder: 'm' }), fld(t('y') + '-intercept', { placeholder: 'b' }), fld('equation', { wide: true, placeholder: 'y = …' })];
    var checks = [slopeChk(fr(m), [], { graph: !opt.table }), intChk(b, xi && fv(m) !== 0 ? [[xi, 'u72-int-swap', 'That’s where the line crosses the ' + t('x') + '-axis. The ' + t('y') + '-intercept is where it crosses the ' + t('y') + '-axis.']] : []), K.line(target, { wrong: lw })];
    var p = B.fields(prompt, fields, checks, [nT(m), nT(b), SI(m, b)], 'slope ' + t(nT(m)) + ', ' + t('y') + '-intercept ' + t(nT(b)) + ', ' + t(SI(m, b)), sol, hints, text);
    p.good = [['m=' + nT(m), ptK(0, b), Lns.tex(target, 'general')]];
    p.bad = fv(m) === 0 ? [[nT(m), nT(fNeg(b)), SI(m, fNeg(b))], ['1', nT(b), SI(1, b)]] : [[nT(fNeg(m)), nT(b), SI(fNeg(m), b)], [nT(m), nT(b), SI(fNeg(m), b)]];
    if (xi && fv(m) !== 0 && !fEq(xi, b)) p.bad.push([nT(m), nT(xi), SI(m, xi)]);
    return p;
  }
  /* a line read off a grid through (0, b) and (q, b + p) */
  function graphSol(m, b) {
    m = fr(m); var q = m[1], p = m[0];
    return 'The line crosses the ' + t('y') + '-axis at ' + t(ptT(0, b)) + ', so ' + t('b=' + b) + '. From there it reaches the lattice point ' + t(ptT(q, b + p)) + ': ' + (p > 0 ? 'up ' : p < 0 ? 'down ' : 'no rise, ') + (p ? t(Math.abs(p)) + ', ' : '') + 'right ' + t(q) + ', so ' + t('m=\\frac{' + p + '}{' + q + '}' + (q === 1 ? '=' + p : '')) + '.<br>' +
      t(SI(m, b)) + '. <b>Check.</b> ' + t(evalT(m, q, [b, 1]) + '=' + (b + p)) + ' ✓';
  }

  HW.addCodes({
    'u72-decimal': 'Rounded decimals instead of exact fractions', 'u72-swap-mb': 'Swapped slope and y-intercept', 'u72-b-xint': 'Used the x-intercept as b', 'u72-coord': 'Used the other coordinate',
    'u72-origin': 'Through the origin: b not 0', 'u72-fee': 'Forgot the fixed fee', 'u72-rate-fee': 'Mixed up the rate and the fee', 'u72-int-said-none': 'Said “none” for an intercept that exists',
    'u72-int-off': 'Intercept point not on the axis', 'u72-int-swap': 'Swapped x- and y-intercepts', 'u72-int-unreadable': 'Intercept not a number', 'u72-pt-value': 'Gave one number instead of a point', 'u72-pt-solve': 'Error solving for the coordinate',
    'pts-format': 'Points not written as ordered pairs', 'pts-dup': 'Same point twice', 'pts-few': 'Not enough points', 'pts-off': 'Point not on the line',
    'u7l4-scale': 'Read grid squares instead of the axis scale', 'u7l4-fee-times': 'Multiplied the fee by the time too', 'u7l4-swap-eval': 'Evaluated with the rate and fee swapped', 'u7l4-start-only': 'Gave the starting value, not the value at the time asked',
    'u7l4-drop': 'Gave the total drop instead of the rate', 'u7l4-group': 'Used the price of a group of sessions as the rate', 'u7l4-empty-rate': 'Divided the wrong way to find when it empties',
    'u7l4-rate-unred': 'Rate not reduced', 'u7l4-gap': 'Vertical distance between the lines wrong', 'u7l4-steep-sign': 'Kept the slope’s sign instead of reversing it', 'u7l4-other-b': 'Took b from the other line',
    'u7l4-plan-eq': 'Plans equal: set up wrong', 'u7l4-xvalue': 'Gave a y-value at the wrong x'
  });
  HW.addPartial({ 'u72-origin': 'b', 'u72-fee': 'b', 'u72-int-off': 'b', 'u72-pt-solve': 'b', 'u72-swap-mb': 'n', 'u72-b-xint': 'n', 'u72-coord': 'n', 'u72-rate-fee': 'n', 'u72-int-swap': 'n', 'u72-int-said-none': 'n',
    'pts-off': 'n', 'u7l4-scale': 'b', 'u7l4-fee-times': 'n', 'u7l4-swap-eval': 'n', 'u7l4-start-only': 'n', 'u7l4-drop': 'b', 'u7l4-group': 'b', 'u7l4-empty-rate': 'n', 'u7l4-rate-unred': 's',
    'u7l4-gap': 'b', 'u7l4-steep-sign': 'b', 'u7l4-other-b': 'b', 'u7l4-plan-eq': 'n', 'u7l4-xvalue': 'b' });

  /* ---------------- contexts ---------------- */
  function feeCtx(r) {   // Q5: a fee plus a monthly rate
    return until(function () { return { F: r.pick([20, 25, 30, 35, 40, 50]), R: r.pick([10, 12, 15, 20, 25]), k: r.int(3, 12) }; }, function (o) { return o.F !== o.R; });
  }

  HW.defineLesson({
    id: 'u7l4', unit: 7, num: '4', title: 'Writing the Equation of a Line Given Slope and y-Intercept', outcome: 'RF7',
    blurb: 'Write y = mx + b straight from a slope and a y-intercept — given as numbers, read off a graph or a table, or described in a story.',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A — From a given slope and y-intercept', stem: 'Write the equation of each line.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { var m = r.int(2, 9), b = r.int(1, 12); return directPart([m, 1], [b, 1], 'slope ' + t(m) + ', ' + t('y') + '-intercept ' + t(b), 'slope ' + m + ', y-int ' + b); } },
        { id: '1b', level: 'BEG', make: function (r) { var m = -r.int(2, 9), b = -r.int(1, 12); return directPart([m, 1], [b, 1], 'slope ' + t(m) + ', ' + t('y') + '-intercept ' + t(b), 'slope ' + m + ', y-int ' + b); } },
        { id: '1c', level: 'BEG', make: function (r) { var m = properFrac(r, 2, 5), b = r.int(1, 12); return directPart(m, [b, 1], 'slope ' + t(nT(m)) + ', ' + t('y') + '-intercept ' + t(b), 'slope ' + nT(m) + ', y-int ' + b); } },
        { id: '1d', level: 'EMG', make: function (r) { var m = fNeg(properFrac(r, 3, 6)), b = -r.int(1, 12); return directPart(m, [b, 1], 'slope ' + t(nT(m)) + ', ' + t('y') + '-intercept ' + t(b), 'slope ' + nT(m) + ', y-int ' + b); } },
        { id: '1e', level: 'BEG', make: function (r) {
          var m = r.int(2, 12) * r.pick([1, 1, -1]);
          return LP('slope ' + t(m) + ', through ' + t('(0,\\ 0)'), L(m, 0), { wrong: [{ is: { y: m }, code: 'u72-swap-mb', hint: t('y=' + m) + ' is a horizontal line (slope ' + t('0') + '). The slope ' + t(m) + ' multiplies ' + t('x') + '.' }, { is: L(m, 1), code: 'u72-origin', hint: 'Through ' + t('(0,\\ 0)') + ' means the line crosses the ' + t('y') + '-axis at ' + t('0') + ', so ' + t('b=0') + '.' }] },
            t('(0,\\ 0)') + ' is on the ' + t('y') + '-axis, so it is the ' + t('y') + '-intercept: ' + t('b=0') + '. With ' + t('m=' + m) + ': ' + t('y=' + m + 'x+0') + ', which is just ' + t(SI(m, 0)) + '.<br><b>Check.</b> ' + t('x=0\\Rightarrow y=0') + ' ✓', ['A point ' + t('(0,\\ k)') + ' is on the ' + t('y') + '-axis, so ' + t('b=k') + '.', 'Adding ' + t('0') + ' changes nothing, so you can leave ' + t('+0') + ' off.'], 'slope ' + m + ' through origin');
        } },
        { id: '1f', level: 'EMG', make: function (r) {
          var s = r.pick([1, 1, -1]), b = nz(r, -12, 12); if (Math.abs(b) < 2) b = -10;
          return directPart([s, 1], [b, 1], t('y') + '-intercept ' + t(b) + ', slope ' + t(s), 'y-int ' + b + ', slope ' + s,
            [{ is: L(0, b), code: 'line-slope', hint: 'A slope of ' + t(s) + ' is not ' + t('0') + ': the equation needs an ' + t('x') + '-term, ' + t(s === 1 ? '1x=x' : '-1x=-x') + '.' }]);
        } },
        { id: '1g', level: 'BEG', make: function (r) {
          var m = r.int(2, 12) * r.pick([-1, -1, 1]);
          return LP('slope ' + t(m) + ', ' + t('y') + '-intercept ' + t(0), L(m, 0), { wrong: [{ is: { y: m }, code: 'u72-swap-mb', hint: t('y=' + m) + ' is a horizontal line (slope ' + t('0') + '). The slope ' + t(m) + ' multiplies ' + t('x') + '; ' + t('b=0') + ' adds nothing.' }] },
            t('m=' + m) + ' and ' + t('b=0') + ': ' + t('y=' + m + 'x+0') + ', which is just ' + t(SI(m, 0)) + '.<br><b>Check.</b> ' + t('x=0\\Rightarrow y=0') + ' ✓', H_SI, 'slope ' + m + ', y-int 0');
        } },
        { id: '1h', level: 'EMG', make: function (r) {
          var m = properFrac(r, 3, 7), b = r.int(2, 14);
          return directPart(m, [b, 1], 'slope ' + t(nT(m)) + ', through ' + t(ptT(0, b)), 'slope ' + nT(m) + ' through (0,' + b + ')',
            [{ is: L(m, 0), code: 'u72-coord', hint: t(ptT(0, b)) + ' is on the ' + t('y') + '-axis, so it is the ' + t('y') + '-intercept: its <b>' + t('y') + '</b>-coordinate, ' + t(b) + ', is ' + t('b') + '.' }]);
        } }] },

      /* ---------------- Part B ---------------- */
      { num: '2', section: 'Part B — From graphs and tables', stem: function (sh) {
          return 'Each line on the grid passes through points with integer coordinates.<br>' +
            figure({ x: [-9, 9], y: [-9, 9], labels: 5, max: 360, aria: 'two lines r and s on a grid' }, [{ m: sh.m1, b: [sh.b1, 1], color: BLUE, label: 'r', f: 0.92 }, { m: sh.m2, b: [sh.b2, 1], color: RED, label: 's', f: 0.9, side: -1 }]);
        },
        shared: function (r) {
          return until(function () {
            var m1 = r.pick([[1, 1], [1, 1], [2, 1], [1, 2], [3, 1], [1, 3]]), m2 = r.pick([[-2, 1], [-2, 1], [-3, 1], [-1, 1], [-1, 2]]);
            return { m1: m1, b1: nz(r, -6, 5), m2: m2, b2: r.int(2, 7) };
          }, function (o) { return Math.abs(o.b1 - o.b2) >= 3; });
        },
        parts: [
          { id: '2a', sub: 'r', level: 'EMG', make: function (r, sh) { return threeBox('Line ' + t('r') + ': state its slope and ' + t('y') + '-intercept, then write its equation.', sh.m1, sh.b1, graphSol(sh.m1, sh.b1), H_GR, 'line r from grid'); } },
          { id: '2b', sub: 's', level: 'EMG', make: function (r, sh) { return threeBox('Line ' + t('s') + ': state its slope and ' + t('y') + '-intercept, then write its equation.', sh.m2, sh.b2, graphSol(sh.m2, sh.b2), H_GR, 'line s from grid'); } }] },
      { num: '3', stem: 'Determine the equation of the line represented by each table.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var m = r.int(2, 6), b = r.int(1, 12); return tablePart(m, b); } },
        { id: '3b', level: 'EMG', make: function (r) { var m = -r.int(2, 6), b = r.int(3 * -m, 24); return tablePart(m, b); } }] },
      { num: '4', stem: function (sh) {
          return 'A candle shop tracks the height of a candle as it burns.' + HW.valueTable([['Time, ' + t('t') + ' (h)', 0, 1, 2, 3], ['Height, ' + t('h') + ' (cm)'].concat([0, 1, 2, 3].map(function (i) { return sh.h0 - sh.k * i; }))]);
        },
        shared: function (r) { return until(function () { return { h0: r.int(12, 30), k: r.int(2, 5) }; }, function (o) { return o.h0 - 3 * o.k >= 3; }); },
        parts: [
          { id: '4a', level: 'BEG', make: function (r, sh) {
            var fields = [fld('slope', { placeholder: 'm' }), fld(t('y') + '-intercept', { placeholder: 'b' })];
            var p = B.fields('State the slope and the ' + t('y') + '-intercept for this table.', fields,
              [slopeChk([-sh.k, 1], [[sh.k, 'slope-sign', 'The candle gets <b>shorter</b> every hour, so the slope is negative.'], [sh.h0 - sh.k, 'u72-swap-mb', 'That’s a height. The slope is the <b>change</b> in height each hour.']]),
                intChk([sh.h0, 1], [[-sh.k, 'u72-swap-mb', 'That’s the change per hour (the slope). The ' + t('y') + '-intercept is the height when ' + t('t=0') + '.'], [sh.h0 - sh.k, 'value', 'That’s the height after ' + t('1') + ' hour. The ' + t('y') + '-intercept goes with ' + t('t=0') + '.']])],
              [String(-sh.k), String(sh.h0)], 'slope ' + t(-sh.k) + ', ' + t('y') + '-intercept ' + t(sh.h0),
              'Each hour the height changes by ' + t((sh.h0 - sh.k) + '-' + sh.h0 + '=' + (-sh.k)) + ', so the slope is ' + t('m=' + (-sh.k)) + '. At ' + t('t=0') + ' the height is ' + t(sh.h0) + ', so the ' + t('y') + '-intercept is ' + t('b=' + sh.h0) + '.', H_TAB, 'candle table m and b');
            p.bad = [[String(sh.k), String(sh.h0)], [String(-sh.k), String(sh.h0 - sh.k)], [String(sh.h0), String(-sh.k)]];
            return p;
          } },
          { id: '4b', level: 'BEG', make: function (r, sh) {
            return LP('Write an equation for the height ' + t('h') + ' in terms of the time ' + t('t') + '.', L(-sh.k, sh.h0), { vars: ['t', 'h'], wrong: [{ is: L(sh.h0, -sh.k), code: 'u72-swap-mb', hint: 'You swapped them: the rate ' + t(-sh.k) + ' multiplies ' + t('t') + ', and the starting height ' + t(sh.h0) + ' is added on its own.' }] },
              t('m=' + (-sh.k)) + ' and ' + t('b=' + sh.h0) + ', with ' + t('t') + ' in place of ' + t('x') + ' and ' + t('h') + ' in place of ' + t('y') + ': ' + t(SI(-sh.k, sh.h0, ['t', 'h'])) + '.<br><b>Check.</b> ' + t('t=2:\\ ' + evalT([-sh.k, 1], 2, [sh.h0, 1]) + '=' + (sh.h0 - 2 * sh.k)) + ', as in the table ✓', ['Use the slope and the ' + t('y') + '-intercept from (a).', 'Write ' + t('h') + ' instead of ' + t('y') + ' and ' + t('t') + ' instead of ' + t('x') + '.'], 'candle equation');
          } },
          { id: '4c', level: 'EMG', make: function (r, sh) {
            var k = sh.k, h0 = sh.h0;
            return mc(r, 'In this situation, what does the slope represent? What does the ' + t('y') + '-intercept represent?', [
              { html: 'Slope ' + t(-k) + ': the candle’s height drops ' + t(k) + ' cm every hour. ' + t('y') + '-intercept ' + t(h0) + ': the candle was ' + t(h0) + ' cm tall before it started burning.', right: true },
              { html: 'Slope ' + t(-k) + ': the candle’s height drops ' + t(k) + ' cm every hour. ' + t('y') + '-intercept ' + t(h0) + ': the height after ' + t(1) + ' hour of burning.', why: 'The ' + t('y') + '-intercept goes with ' + t('t=0') + ', before any burning. After ' + t(1) + ' hour the candle is ' + t(h0 - k) + ' cm.' },
              { html: 'Slope ' + t(-k) + ': the candle burns for ' + t(k) + ' hours. ' + t('y') + '-intercept ' + t(h0) + ': the candle was ' + t(h0) + ' cm tall at the start.', why: 'The slope is a <b>rate</b>: the change in height (cm) for each hour, not a number of hours.' },
              { html: 'Slope ' + t(-k) + ': the candle grows ' + t(k) + ' cm every hour. ' + t('y') + '-intercept ' + t(h0) + ': the candle was ' + t(h0) + ' cm tall at the start.', why: 'A negative slope means the height goes <b>down</b> as time goes on.' }],
              'The slope is the change in height per hour: the height <b>drops</b> ' + t(k) + ' cm every hour (negative because it goes down). The ' + t('y') + '-intercept is the height when ' + t('t=0') + ': the candle was ' + t(h0) + ' cm tall before it started burning.',
              ['The slope is a rate: centimetres per hour. The ' + t('y') + '-intercept is the value when ' + t('t=0') + '.'], 'meaning of slope and intercept (candle)');
          } }] },

      /* ---------------- Part C ---------------- */
      { num: '5', section: 'Part C — Applications', stem: function (sh) { return 'A gym charges a ' + t('\\$' + sh.F) + ' sign-up fee plus ' + t('\\$' + sh.R) + ' per month for a membership.'; },
        shared: feeCtx,
        parts: [
          { id: '5a', level: 'BEG', make: function (r, sh) { return ctxEq('Write an equation for the total cost ' + t('C') + ' after ' + t('m') + ' months.', sh.R, sh.F, ['m', 'C'], 'monthly rate', 'sign-up fee', 'gym equation'); } },
          { id: '5b', level: 'BEG', make: function (r, sh) { return ctxVal('Find the cost of a ' + t(sh.k) + '-month membership.', sh.R, sh.F, sh.k, ['m', 'C'], { before: '\\$' }, 'gym cost'); } }] },
      { num: '6', stem: function (sh) { return 'A candle is ' + t(sh.H) + ' cm tall and burns down at a constant rate of ' + t(sh.k) + ' cm per hour.'; },
        shared: function (r) { return until(function () { return { H: r.int(18, 36), k: r.int(2, 4), n: r.int(3, 7) }; }, function (o) { return o.H - o.k * o.n >= 2; }); },
        parts: [
          { id: '6a', level: 'EMG', make: function (r, sh) { return ctxEq('Write an equation for the height ' + t('h') + ' of the candle after ' + t('t') + ' hours.', -sh.k, sh.H, ['t', 'h'], 'burning rate', 'starting height', 'candle equation'); } },
          { id: '6b', level: 'EMG', make: function (r, sh) { return ctxVal('Find the height of the candle after ' + t(sh.n) + ' hours.', -sh.k, sh.H, sh.n, ['t', 'h'], { after: 'cm' }, 'candle height'); } }] },
      { num: '7', stem: function (sh) { return 'A water tank already contains ' + t(sh.V) + ' L of water when a hose begins filling it at a constant rate of ' + t(sh.k) + ' L per minute.'; },
        shared: function (r) { return until(function () { return { V: r.int(5, 30), k: r.int(2, 8), n: r.int(5, 15) }; }, function (o) { return o.V !== o.k; }); },
        parts: [
          { id: '7a', level: 'BEG', make: function (r, sh) { return ctxEq('Write an equation for the volume ' + t('V') + ' after ' + t('t') + ' minutes.', sh.k, sh.V, ['t', 'V'], 'filling rate', 'starting volume', 'tank equation'); } },
          { id: '7b', level: 'BEG', make: function (r, sh) { return ctxVal('Find the volume after ' + t(sh.n) + ' minutes.', sh.k, sh.V, sh.n, ['t', 'V'], { after: 'L' }, 'tank volume'); } }] },
      { num: '8', stem: '', parts: [
        { id: '8', level: 'PRG', make: function (r) {
          var o = until(function () { var F = r.pick([5, 5, 10, 15, 20]), R = r.pick([2, 3, 3, 4, 5, 5, 6]), h2 = r.int(2, 7); return { F: F, R: R, h2: h2, C2: F + R * h2 }; }, function (o) { return (o.R * o.h2) % 5 === 0 && o.C2 <= 35 && o.C2 % 5 === 0 && o.h2 >= 2; });
          var top = 40, end = Math.min(8, (top - o.F) / o.R);
          var fig = HW.graph({ x: [0, 8], y: [0, top], unitX: 34, unitY: 34 / 5, gridY: 5, labelsX: 2, labelsY: 5, firstQuadrant: true, xName: 'h', yName: 'C', xTitle: 'Hours', yTitle: 'Cost ($)', max: 330,
            segs: [{ pts: [[0, o.F], [end, o.F + o.R * end]], color: BLUE }], points: [{ x: 0, y: o.F, color: '#1c2230' }, { x: o.h2, y: o.C2, color: '#1c2230' }], aria: 'cost of renting a bicycle' });
          return LP(fig + '<br>The graph shows the cost of renting a bicycle for a given number of hours. Each grid square on the vertical axis represents ' + t('\\$5') + '. Determine the equation for the cost ' + t('C') + ' in terms of the number of hours ' + t('h') + '.', L(o.R, o.F),
            { vars: ['h', 'C'], wrong: [{ is: L(fr(o.R, 5), fr(o.F, 5)), code: 'u7l4-scale', hint: 'You counted grid squares. Each square on the cost axis is ' + t('\\$5') + ': read the dollar values on the axis.' }, { is: L(fr(o.R, 5), o.F), code: 'u7l4-scale', hint: 'Right starting cost — but the rise is in dollars, and each square on the cost axis is ' + t('\\$5') + '. Read the costs of the two marked points.' }, { is: L(o.F, o.R), code: 'u72-swap-mb', hint: 'You swapped them: the cost per hour multiplies ' + t('h') + '; the starting cost (at ' + t('0') + ' hours) is added on its own.' }] },
            'The line starts at ' + t('(0,\\ ' + o.F + ')') + ': ' + t('b=' + o.F) + '. The second marked point is ' + t('(' + o.h2 + ',\\ ' + o.C2 + ')') + ' (read the dollars on the axis, not the squares). From one point to the other the cost rises ' + t(o.C2 - o.F) + ' dollars in ' + t(o.h2) + ' hours: ' + t('m=\\frac{' + (o.C2 - o.F) + '}{' + o.h2 + '}=' + o.R) + '.<br>' + t('C=' + o.R + 'h+' + o.F) + '.<br><b>Check.</b> ' + t(o.R + '(' + o.h2 + ')+' + o.F + '=' + o.C2) + ' ✓',
            ['The starting cost (at ' + t('0') + ' hours) is ' + t('b') + '. Read it from the dollar scale.', 'Read the second marked point in dollars, then slope = change in cost ÷ change in hours.'], 'bike rental graph');
        } }] },
      { num: '9', stem: '', parts: [
        { id: '9', level: 'EMG', make: function (r) {
          var c = r.pick([['plumber’s house call', 'cost per hour of labour', 'flat call-out fee'], ['electrician’s visit', 'cost per hour of work', 'flat call-out fee'], ['furnace repair visit', 'cost per hour of labour', 'flat service-call fee']]);
          var o = until(function () { return { R: r.pick([6, 40, 45, 55, 60, 75, 80]), F: r.pick([35, 40, 50, 60, 75, 90]) }; }, function (o) { return o.R !== o.F; });
          return mc(r, 'The equation ' + t('y=' + o.R + 'x+' + o.F) + ' models the total charge ' + t('y') + ' (in dollars) for a ' + c[0] + ' that takes ' + t('x') + ' hours. In this situation, what does the number ' + t(o.R) + ' represent? What does the number ' + t(o.F) + ' represent?', [
            { html: t(o.R) + ' is the ' + c[1] + '; ' + t(o.F) + ' is a ' + c[2] + ', charged even before any work is done.', right: true },
            { html: t(o.R) + ' is the ' + c[2] + '; ' + t(o.F) + ' is the ' + c[1] + '.', why: 'The number that multiplies ' + t('x') + ' (the hours) is the amount charged <b>per hour</b>. The number added on its own is charged once.' },
            { html: t(o.R) + ' is the number of hours the job takes; ' + t(o.F) + ' is the total charge.', why: 'The hours are ' + t('x') + ' and the total charge is ' + t('y') + '. ' + t(o.R) + ' is the slope: dollars per hour.' },
            { html: t(o.R) + ' is the charge for the first hour; ' + t(o.F) + ' is the charge for each hour after that.', why: 'Every hour costs the same, ' + t('\\$' + o.R) + '. ' + t(o.F) + ' is charged once, even for ' + t('0') + ' hours (' + t('x=0\\Rightarrow y=' + o.F) + ').' }],
            'In ' + t('y=mx+b') + ' form, ' + t('m=' + o.R) + ' is the rate: the charge goes up ' + t('\\$' + o.R) + ' for each hour, so it is the ' + c[1] + '. ' + t('b=' + o.F) + ' is the charge when ' + t('x=0') + ': the ' + c[2] + ', charged before any work is done.',
            ['Which number is multiplied by the hours? Which one is charged even for ' + t('0') + ' hours?'], 'meaning of ' + o.R + ' and ' + o.F);
        } }] },

      /* ---------------- Part D ---------------- */
      { num: '10', section: 'Part D — Multiple choice and numerical response', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'BEG', make: function (r) {
          var m = -r.int(2, 9), b = until(function () { return r.int(2, 12); }, function (v) { return v !== -m; });
          return mc(r, 'Which equation has slope ' + t(m) + ' and ' + t('y') + '-intercept ' + t(b) + '?', [
            { html: t(SI(b, m)), why: 'That equation has slope ' + t(b) + ' and ' + t('y') + '-intercept ' + t(m) + ': the two numbers are swapped.' },
            { html: t(SI(m, b)), right: true },
            { html: t(SI(-m, -b)), why: 'Both signs are wrong: that line has slope ' + t(-m) + ' and ' + t('y') + '-intercept ' + t(-b) + '.' },
            { html: t(SI(-b, -m)), why: 'The numbers are swapped and the signs are wrong. The slope multiplies ' + t('x') + '.' }],
            'Slope ' + t(m) + ' multiplies ' + t('x') + ', and the ' + t('y') + '-intercept ' + t(b) + ' is added on: ' + t(SI(m, b)) + '.', [H_SI[0]], 'MC slope ' + m + ' y-int ' + b, true);
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var m = r.int(2, 6), b = until(function () { return r.int(2, 9); }, function (v) { return v !== m; });
          var pts = [0, 1, 2, 3].map(function (x) { return t(ptT(x, m * x + b)); });
          return mc(r, 'A table shows the points ' + pts.slice(0, 3).join(', ') + ' and ' + pts[3] + '. Which equation matches this table?', [
            { html: t(SI(m, b)), right: true },
            { html: t(SI(b, m)), why: 'Check with ' + t('x=0') + ': this equation gives ' + t('y=' + m) + ', but the table has ' + t(ptT(0, b)) + '. The numbers are swapped.' },
            { html: t(SI(m, -b)), why: 'At ' + t('x=0') + ' the table has ' + t('y=' + b) + ', not ' + t(-b) + '.' },
            { html: t(SI(-m, b)), why: 'The ' + t('y') + '-values go <b>up</b> by ' + t(m) + ' each time, so the slope is positive.' }],
            'At ' + t('x=0') + ', ' + t('y=' + b) + ', so ' + t('b=' + b) + '. Each time ' + t('x') + ' goes up by ' + t(1) + ', ' + t('y') + ' goes up by ' + t(m) + ', so ' + t('m=' + m) + ': ' + t(SI(m, b)) + '.', H_TAB, 'MC table to equation', true);
        } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'BEG', make: function (r) {
          var o = until(function () { return { F: r.pick([30, 40, 50, 60, 75, 80]), R: r.pick([15, 20, 25, 30, 35]) }; }, function (o) { return o.F !== o.R; });
          return mc(r, 'A moving company charges a flat fee of ' + t('\\$' + o.F) + ' plus ' + t('\\$' + o.R) + ' per hour of labour. Which equation models the total cost ' + t('C') + ' after ' + t('h') + ' hours?', [
            { html: t('C=' + o.F + 'h+' + o.R), why: 'The rate per hour multiplies ' + t('h') + '; the flat fee is added once.' },
            { html: t('C=' + o.R + 'h+' + o.F), right: true },
            { html: t('C=' + (o.F + o.R) + 'h'), why: 'The flat fee is charged only once, not every hour.' },
            { html: t('C=' + o.R + 'h-' + o.F), why: 'The fee is added to the cost, not taken away.' }],
            'The rate ' + t('\\$' + o.R) + ' per hour is the slope; the flat fee ' + t('\\$' + o.F) + ' is the starting value: ' + t('C=' + o.R + 'h+' + o.F) + '.', [H_CTX[0]], 'MC moving company', true);
        } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '13', level: 'BEG', make: function (r) {
          var F = r.int(2, 8), R = until(function () { return r.int(2, 5); }, function (v) { return v !== F; }), k = r.int(4, 12), ans = R * k + F;
          return nrPart('A parking garage charges a ' + t('\\$' + F) + ' entry fee plus ' + t('\\$' + R) + ' per hour, so the cost equation is ' + t('y=' + R + 'x+' + F) + '. The total cost to park for ' + t(k) + ' hours is ________ dollars.', ans,
            [[R * k, 'u72-fee', 'Add the entry fee too: it is the ' + t('+' + F) + ' in the equation.'], [F * k + R, 'u7l4-swap-eval', 'Substitute ' + t('x=' + k) + ' into ' + t('y=' + R + 'x+' + F) + ': the ' + t(R) + ' is the one multiplied by the hours.'], [(R + F) * k, 'u7l4-fee-times', 'Only the hourly rate is multiplied by the hours; the entry fee is added once.']],
            t('y=' + R + '(' + k + ')+' + F + '=' + (R * k) + '+' + F + '=' + ans) + ', so it costs ' + t('\\$' + ans) + '.', ['Substitute ' + t('x=' + k) + ' into the equation.'], 'NR parking ' + k + ' h');
        } }] },
      { num: '14', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '14', level: 'EMG', make: function (r) {
          var o = until(function () { return { F: r.pick([40, 50, 60, 75, 80, 90, 100]), R: r.pick([15, 20, 25, 30, 35, 45]) }; }, function (o) { return o.F !== o.R; });
          return nrPart('A moving company charges a flat fee of ' + t('\\$' + o.F) + ' plus ' + t('\\$' + o.R) + ' per hour of labour. If the total cost equation is written in the form ' + t('C=mh+b') + ', the value of ' + t('m+b') + ' is ________.', o.F + o.R,
            [[o.R - o.F, 'u72-rate-fee', 'Add the two numbers: ' + t('m+b') + '.'], [o.F - o.R, 'u72-rate-fee', 'Add the two numbers: ' + t('m+b') + '.']],
            t('C=' + o.R + 'h+' + o.F) + ', so ' + t('m=' + o.R) + ' and ' + t('b=' + o.F) + ': ' + t('m+b=' + o.R + '+' + o.F + '=' + (o.R + o.F)) + '.', ['The rate per hour is ' + t('m') + '; the flat fee is ' + t('b') + '.'], 'NR m+b moving');
        } }] },
      { num: '15', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '15', level: 'PRG', make: function (r) {
          var o = until(function () { return { H: r.int(20, 36), k: r.int(2, 5), n: r.int(2, 4) }; }, function (o) { return o.H - o.k * o.n >= 6; });
          var H2 = o.H - o.k * o.n;
          return nrPart('A candle is ' + t(o.H) + ' cm tall and burns at a constant rate. After ' + t(o.n) + ' hours, it is ' + t(H2) + ' cm tall. If ' + t('h=mt+b') + ' models the height after ' + t('t') + ' hours, the value of ' + t('m') + ' is ________.', -o.k,
            [[o.k, 'slope-sign', 'The candle gets shorter, so its height <b>decreases</b>: the rate is negative.'], [-o.k * o.n, 'u7l4-drop', 'That’s the total drop in ' + t(o.n) + ' hours. The slope is the change <b>per hour</b>: divide by ' + t(o.n) + '.'], [o.k * o.n, 'u7l4-drop', 'That’s the total drop in ' + t(o.n) + ' hours. The slope is the change per hour, and it is negative.'], [o.H, 'u72-swap-mb', 'That’s ' + t('b') + ', the starting height. ' + t('m') + ' is the rate of change.']],
            'The height changes from ' + t(o.H) + ' cm to ' + t(H2) + ' cm in ' + t(o.n) + ' hours: ' + t('m=\\frac{' + H2 + '-' + o.H + '}{' + o.n + '-0}=\\frac{' + (H2 - o.H) + '}{' + o.n + '}=' + (-o.k)) + ' cm per hour.', ['Slope = change in height ÷ change in time.', 'The candle gets shorter, so the slope is negative.'], 'NR candle slope');
        } }] }
    ],

    /* =============================== EXTRA PRACTICE =============================== */
    extra: [
      { num: '1', section: 'Extra practice A — Slopes and intercepts that are not whole numbers', stem: 'Write the equation of each line in the form ' + t('y=mx+b') + '. Keep every fraction exact.', parts: [
        { id: 'e1a', level: 'EMG', make: function (r) { var m = fNeg(properFrac(r, 3, 5)), b = [2 * r.int(1, 5) + 1, 2]; return exactSI(m, b, 'slope ' + t(nT(m)) + ', ' + t('y') + '-intercept ' + t(nT(b))); } },
        { id: 'e1b', level: 'EMG', make: function (r) { var m = until(function () { var q = r.int(2, 5); return [r.int(q + 1, 2 * q + 1), q]; }, function (f) { return gcd(f[0], f[1]) === 1; }), b = [-1, r.pick([2, 3, 4])]; return exactSI(m, b, 'slope ' + t(nT(m)) + ', ' + t('y') + '-intercept ' + t(nT(b))); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var m = [-r.int(2, 9), 1], b = fNeg(properFrac(r, 3, 4)); return exactSI(m, b, 'slope ' + t(nT(m)) + ', ' + t('y') + '-intercept ' + t(nT(b))); } },
        { id: 'e1d', level: 'EMG', make: function (r) { var m = [1, r.int(5, 9)], b = [-r.int(2, 12), 1]; return exactSI(m, b, 'slope ' + t(nT(m)) + ', ' + t('y') + '-intercept ' + t(nT(b))); } },
        { id: 'e1e', level: 'EMG', make: function (r) { var m = fNeg(properFrac(r, 5, 6)), b = until(function () { return [r.int(4, 14), 3]; }, function (f) { return f[0] % 3 !== 0; }); return exactSI(m, b, 'slope ' + t(nT(m)) + ', through ' + t(ptT(0, b)), [{ is: L(m, 0), code: 'u72-coord', hint: t(ptT(0, b)) + ' is the ' + t('y') + '-intercept, so ' + t('b=' + nT(b)) + '.' }]); } },
        { id: 'e1f', level: 'EMG', make: function (r) { var b = until(function () { return [-r.int(3, 11), 4]; }, function (f) { return f[0] % 2 !== 0; }), m = until(function () { return [-r.int(3, 11), 2]; }, function (f) { return f[0] % 2 !== 0; }); return exactSI(m, b, t('y') + '-intercept ' + t(nT(b)) + ', slope ' + t(nT(m))); } }] },
      { num: '2', stem: 'Write the equation of each line. Each one has a slope of ' + t(0) + ', a ' + t('y') + '-intercept of ' + t(0) + ', or both.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { var k = nz(r, -12, 12); return horizPart(k, 'slope ' + t(0) + ', ' + t('y') + '-intercept ' + t(k)); } },
        { id: 'e2b', level: 'BEG', make: function (r) { var m = fNeg(properFrac(r, 5, 9)); return originPart(m, 'slope ' + t(nT(m)) + ', ' + t('y') + '-intercept ' + t(0)); } },
        { id: 'e2c', level: 'EMG', make: function (r) { var k = niceFrac(r); return horizPart(k, 'slope ' + t(0) + ', through ' + t(ptT(0, k))); } },
        { id: 'e2d', level: 'BEG', make: function (r) { var m = until(function () { var q = r.int(2, 6); return [r.int(1, 2 * q), q]; }, function (f) { return gcd(f[0], f[1]) === 1; }); return originPart(m, 'slope ' + t(nT(m)) + ', through the origin'); } }] },
      { num: '3', stem: function (sh) { return 'Two special lines: line A has slope ' + t(0) + ' and ' + t('y') + '-intercept ' + t(sh.k) + '; line B has ' + t('y') + '-intercept ' + t(0) + ' and slope ' + t(nT(sh.m)) + '.'; },
        shared: function (r) { var q = r.int(3, 9); return { k: nz(r, -9, 9), m: [-until(function () { return r.int(1, q - 1); }, function (p) { return gcd(p, q) === 1; }), q], j: r.int(1, 3) }; },
        parts: [
          { id: 'e3a', sub: 'a(i)', level: 'EMG', make: function (r, sh) {
            return mc(r, 'Why does the equation of line A contain no ' + t('x') + '-term?', [
              { html: 'Its slope is ' + t(0) + ', so the term ' + t('mx') + ' is ' + t('0\\cdot x=0') + ' and disappears: ' + t('y=' + sh.k) + '.', right: true },
              { html: 'Its ' + t('y') + '-intercept is ' + t(sh.k) + ', and a line with a ' + t('y') + '-intercept has no ' + t('x') + '-term.', why: 'Most lines with a ' + t('y') + '-intercept have an ' + t('x') + '-term, e.g. ' + t('y=2x+' + Math.abs(sh.k)) + '. Look at the slope.' },
              { html: 'The line is vertical, so ' + t('x') + ' never changes.', why: 'A slope of ' + t(0) + ' is a <b>horizontal</b> line. A vertical line has an undefined slope.' },
              { html: 'The ' + t('x') + '-term was left out to keep the equation short; ' + t('y=0x+' + pT(sh.k)) + ' is a different line.', why: t('y=0x+' + pT(sh.k)) + ' and ' + t('y=' + sh.k) + ' are the same line: ' + t('0x=0') + '.' }],
              t('m=0') + ', so ' + t('y=0x+' + pT(sh.k)) + '. Since ' + t('0\\cdot x=0') + ' for every ' + t('x') + ', the ' + t('x') + '-term disappears and the equation is ' + t('y=' + sh.k) + ': every point has ' + t('y=' + sh.k) + ', a horizontal line.', ['Write it out: ' + t('y=0x+b') + '. What is ' + t('0') + ' times any number?'], 'why no x-term');
          } },
          { id: 'e3b', sub: 'a(ii)', level: 'BEG', make: function (r, sh) {
            var k = sh.k;
            return ptsPart('List the coordinates of <b>three</b> different points that lie on line A.', { n: 3, test: function (p) { return near(p[1], k) ? null : { code: 'pts-off', hint: t(ptT(p[0], p[1])) + ' isn’t on line A: every point on ' + t('y=' + k) + ' has ' + t('y') + '-coordinate ' + t(k) + '.' + (near(p[0], k) ? ' (You put ' + t(k) + ' first — the ' + t('y') + '-coordinate is the second number.)' : '') }; } }, [[-2, k], [0, k], [3, k]],
              'Line A is ' + t('y=' + k) + ': every point on it has ' + t('y') + '-coordinate ' + t(k) + ', and ' + t('x') + ' can be anything. For example ' + t(ptT(-2, k)) + ', ' + t(ptT(0, k)) + ' and ' + t(ptT(3, k)) + '.', ['Line A is ' + t('y=' + k) + '. What must the ' + t('y') + '-coordinate of each point be?'], 'three points on y=' + k);
          } },
          { id: 'e3c', sub: 'b(i)', level: 'EMG', make: function (r, sh) {
            return mc(r, 'Why must ' + t('(0,\\ 0)') + ' be on line B?', [
              { html: 'Its ' + t('y') + '-intercept is ' + t(0) + ', so it meets the ' + t('y') + '-axis at height ' + t(0) + ' — that point is the origin.', right: true },
              { html: 'Its slope is negative, and every line with a negative slope passes through the origin.', why: 'Lines with negative slopes can cross the ' + t('y') + '-axis anywhere, e.g. ' + t('y=-x+4') + '. Look at the ' + t('y') + '-intercept.' },
              { html: 'Every line passes through ' + t('(0,\\ 0)') + '.', why: 'No: ' + t('y=2x+3') + ' crosses the ' + t('y') + '-axis at ' + t('(0,\\ 3)') + ' and misses the origin.' },
              { html: 'Its slope is a fraction, and fractions are smaller than ' + t(1) + '.', why: 'The size of the slope doesn’t decide where the line crosses the ' + t('y') + '-axis — the ' + t('y') + '-intercept does.' }],
              'The ' + t('y') + '-intercept is the point ' + t('(0,\\ b)') + '. With ' + t('b=0') + ' that point is ' + t('(0,\\ 0)') + ', the origin. (Check: ' + t('x=0\\Rightarrow y=' + nT(sh.m) + '(0)=0') + '.)', ['The ' + t('y') + '-intercept is the point ' + t('(0,\\ b)') + '.'], 'why origin');
          } },
          { id: 'e3d', sub: 'b(ii)', level: 'BEG', make: function (r, sh) {
            var x = sh.m[1] * 2 * sh.j, y = fv(fMul(sh.m, x));
            return valPart('Determine the ' + t('y') + '-value on line B when ' + t('x=' + x) + '.', [y, 1], [[-y, 'sign', 'Check the sign: the slope is negative and ' + t('x') + ' is positive.'], [fv(sh.m) + x, 'u7l4-xvalue', 'Multiply the slope by ' + t('x') + ' (don’t add).']],
              'Line B is ' + t(SI(sh.m, 0)) + '. ' + t('y=' + nT(sh.m) + '(' + x + ')=' + y) + '.', ['Line B is ' + t('y=' + nT(sh.m) + 'x') + '. Substitute ' + t('x=' + x) + '.'], 'y on line B at x=' + x, { keys: 'eq', before: t('y=') });
          } }] },

      { num: '4', section: 'Extra practice B — Reading a line from a graph or a description', stem: 'Each line passes through the two marked lattice points. Read the slope and the ' + t('y') + '-intercept from the graph, then write the equation.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) {
          var o = until(function () { var q = r.pick([2, 3, 3, 4, 5]), p = -r.int(1, q + 2); return { m: fr(p, q), b: r.int(1, 5) }; }, function (o) { return o.m[1] >= 2 && o.b + o.m[0] >= -5; });
          return threeBox(markedFig(o.m, o.b, [0, o.b], [o.m[1], o.b + o.m[0]], BLUE), o.m, o.b, graphSol(o.m, o.b), H_GR, 'graph, slope ' + nT(o.m));
        } },
        { id: 'e4b', level: 'EMG', make: function (r) {
          var o = until(function () { var q = r.pick([2, 3, 4, 4]), p = r.int(1, q + 1); return { m: fr(p, q), b: -r.int(2, 5) }; }, function (o) { return o.m[1] >= 2 && o.b + o.m[0] <= 5 && o.m[1] <= 5; });
          return threeBox(markedFig(o.m, o.b, [0, o.b], [o.m[1], o.b + o.m[0]], RED), o.m, o.b, graphSol(o.m, o.b), H_GR, 'graph, slope ' + nT(o.m));
        } }] },
      { num: '5', stem: 'Write the equation of each line. One of them is a special case — think about what its slope must be.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) {
          var k = nz(r, -5, 5), x2 = r.pick([2, 3, 4, 5]);
          return threeBox(markedFig([0, 1], k, [0, k], [x2, k], BLUE), [0, 1], k, 'The line is horizontal through ' + t(ptT(0, k)) + ': from ' + t(ptT(0, k)) + ' to ' + t(ptT(x2, k)) + ' the rise is ' + t(0) + ', so ' + t('m=\\frac{0}{' + x2 + '}=0') + ', and ' + t('b=' + k) + '.<br>' + t('y=0x+' + pT(k)) + ', which is ' + t('y=' + k) + '.', ['Count the rise between the two marked points.', 'With ' + t('m=0') + ', ' + t('y=mx+b') + ' becomes ' + t('y=b') + '.'], 'horizontal line graph');
        } },
        { id: 'e5b', level: 'PRG', make: function (r) {
          var o = until(function () { var q = r.pick([2, 2, 3]), p = r.pick(q === 2 ? [3, 5] : [4, 5]) * r.pick([-1, -1, 1]); return { m: [p, q], b: r.int(-3, 3) }; }, function (o) { return Math.abs(o.b + o.m[0]) <= 5; });
          return threeBox(markedFig(o.m, o.b, [0, o.b], [o.m[1], o.b + o.m[0]], RED), o.m, o.b, graphSol(o.m, o.b), H_GR, 'steep graph ' + nT(o.m));
        } }] },
      { num: '6', stem: 'Each description gives a ' + t('y') + '-intercept and a rate of change in words. Write the equation of the line.', parts: [
        { id: 'e6a', level: 'EMG', make: function (r) { var b = -r.int(1, 9), q = r.int(3, 7), p = until(function () { return r.int(1, q - 1); }, function (v) { return gcd(v, q) === 1; }); return wordsPart(fr(-p, q), b, 'The line crosses the ' + t('y') + '-axis at ' + t(b) + ' and falls ' + t(p) + ' units for every ' + t(q) + ' units across.', 'falls ' + p + '/' + q); } },
        { id: 'e6b', level: 'EMG', make: function (r) { var q = r.int(2, 6), p = until(function () { return r.int(q + 1, 3 * q); }, function (v) { return gcd(v, q) === 1; }); return wordsPart(fr(p, q), 0, 'The line passes through the origin and rises ' + t(p) + ' units for every ' + t(q) + ' units across.', 'origin rises ' + p + '/' + q); } },
        { id: 'e6c', level: 'EMG', make: function (r) { var k = niceFrac(r); return horizPart(k, 'The line is horizontal and crosses the ' + t('y') + '-axis at ' + t(nT(k)) + '.'); } },
        { id: 'e6d', level: 'PRG', make: function (r) { var k = r.int(2, 4), q = r.int(2, 3), b = r.int(2, 9); return wordsPart(fr(-k * q, q), b, 'The line crosses the ' + t('y') + '-axis at ' + t(b) + ' and falls ' + t(k * q) + ' units for every ' + t(q) + ' units across.', 'falls ' + (k * q) + '/' + q); } }] },
      { num: '7', stem: '<b>Work backwards.</b> Each equation is given. Choose the description of the line.', parts: [
        { id: 'e7a', level: 'EMG', make: function (r) { var q = r.int(3, 7), p = until(function () { return r.int(1, q - 1); }, function (v) { return gcd(v, q) === 1; }); return describeMC(r, fr(-p, q), r.int(2, 9)); } },
        { id: 'e7b', level: 'EMG', make: function (r) { var q = r.int(2, 6), p = until(function () { return r.int(q + 1, 3 * q); }, function (v) { return gcd(v, q) === 1; }); return describeMC(r, fr(p, q), 0); } }] },
      { num: '8', stem: '<b>Error analysis.</b>', shared: function (r) { var k = nz(r, -12, 12); return { m: -r.int(2, 6), b: [2 * r.int(0, 4) + 1, 2], k: Math.abs(k) < 2 ? -7 : k }; },
        parts: [
          { id: 'e8a', sub: 'a(i)', level: 'EMG', make: function (r, sh) {
            return mc(r, 'Asked for the line with slope ' + t(sh.m) + ' and ' + t('y') + '-intercept ' + t(nT(sh.b)) + ', Tomas wrote ' + t(SI(sh.b, sh.m)) + '. What is his error?', [
              { html: 'He swapped ' + t('m') + ' and ' + t('b') + ': the slope must multiply ' + t('x') + ', and the ' + t('y') + '-intercept is the number added on.', right: true },
              { html: 'He used the wrong sign on the slope.', why: 'His slope is ' + t(nT(sh.b)) + ', a different number altogether, not ' + t(-sh.m) + '. Compare where each number sits.' },
              { html: 'Nothing: ' + t(SI(sh.b, sh.m)) + ' and ' + t(SI(sh.m, sh.b)) + ' are the same line.', why: 'Try ' + t('x=0') + ': his equation gives ' + t(sh.m) + ', but the ' + t('y') + '-intercept should be ' + t(nT(sh.b)) + '.' },
              { html: 'He should have written the ' + t('y') + '-intercept first: ' + t('y=' + nT(sh.b) + sh.m + 'x') + ' is the only correct way.', why: 'The order of the terms doesn’t matter (' + t('y=' + nT(sh.b) + sh.m + 'x') + ' is fine) — what matters is which number multiplies ' + t('x') + '.' }],
              'In ' + t('y=mx+b') + ' the slope multiplies ' + t('x') + '. Tomas put the ' + t('y') + '-intercept ' + t(nT(sh.b)) + ' in front of ' + t('x') + ' and added the slope ' + t(sh.m) + ': he swapped ' + t('m') + ' and ' + t('b') + '.', ['Which number should multiply ' + t('x') + '?'], 'Tomas error');
          } },
          { id: 'e8b', sub: 'a(ii)', level: 'BEG', make: function (r, sh) { return directPart([sh.m, 1], sh.b, 'Write the correct equation for Tomas’s line (slope ' + t(sh.m) + ', ' + t('y') + '-intercept ' + t(nT(sh.b)) + ').', 'Tomas correct'); } },
          { id: 'e8c', sub: 'a(iii)', level: 'EMG', make: function (r, sh) {
            var his = fAdd(fMul(sh.b, 2), [sh.m, 1]), cor = fAdd([2 * sh.m, 1], sh.b);
            var fields = [fld('Tomas’s equation', { before: t('y='), keys: 'fraction' }), fld('correct equation', { before: t('y='), keys: 'fraction' })];
            var p = B.fields('Evaluate Tomas’s equation ' + t(SI(sh.b, sh.m)) + ' and the correct equation ' + t(SI(sh.m, sh.b)) + ' at ' + t('x=2') + ' to show they are different lines.', fields, [valChkF(his), valChkF(cor)], [nT(his), nT(cor)], 'Tomas: ' + t('y=' + nT(his)) + '; correct: ' + t('y=' + nT(cor)),
              'Tomas: ' + t(evalT(sh.b, 2, [sh.m, 1]) + '=' + nT(fMul(sh.b, 2)) + (sh.m < 0 ? '' : '+') + sh.m + '=' + nT(his)) + '.<br>Correct: ' + t(evalT([sh.m, 1], 2, sh.b) + '=' + (2 * sh.m) + '+' + nT(sh.b) + '=' + nT(cor)) + '.<br>Different ' + t('y') + '-values at the same ' + t('x') + ', so they are different lines.',
              ['Substitute ' + t('x=2') + ' into each equation.', 'Write a fraction answer as a fraction, e.g. ' + t('-\\frac{13}{2}') + '.'], 'evaluate both at x=2');
            p.bad = [[nT(cor), nT(his)]];
            return p;
          } },
          { id: 'e8d', sub: 'b(i)', level: 'EMG', make: function (r, sh) {
            var k = sh.k;
            return mc(r, 'Told that a line has slope ' + t(0) + ' and ' + t('y') + '-intercept ' + t(k) + ', Priya wrote ' + t('x=' + k) + '. What is wrong with her answer?', [
              { html: t('x=' + k) + ' is a <b>vertical</b> line (every point has ' + t('x=' + k) + ', and its slope is undefined), but a slope of ' + t(0) + ' means a <b>horizontal</b> line.', right: true },
              { html: 'Nothing is wrong: ' + t('x=' + k) + ' is a horizontal line through ' + t(ptT(0, k)) + '.', why: t('x=' + k) + ' contains points like ' + t(ptT(k, 0)) + ' and ' + t(ptT(k, 5)) + ': it goes straight up and down.' },
              { html: 'She should have written ' + t('x=' + (-k)) + ' — the sign is wrong.', why: 'Any equation ' + t('x=') + ' a number is a vertical line, whatever the sign.' },
              { html: t('x=' + k) + ' is a horizontal line, but it crosses the ' + t('x') + '-axis instead of the ' + t('y') + '-axis.', why: 'A horizontal line never crosses the ' + t('x') + '-axis (unless it is the axis). ' + t('x=' + k) + ' is vertical.' }],
              'Every point on ' + t('x=' + k) + ' has ' + t('x') + '-coordinate ' + t(k) + ', so it is a vertical line through ' + t(ptT(k, 0)) + ' with an undefined slope. A slope of ' + t(0) + ' means a horizontal line, so the equation is ' + t('y=' + k) + '.', ['Picture the points ' + t(ptT(k, 0)) + ', ' + t(ptT(k, 1)) + ', ' + t(ptT(k, 2)) + ' on ' + t('x=' + k) + '.'], 'Priya error');
          } },
          { id: 'e8e', sub: 'b(ii)', level: 'BEG', make: function (r, sh) { return horizPart(sh.k, 'Give the correct equation for Priya’s line (slope ' + t(0) + ', ' + t('y') + '-intercept ' + t(sh.k) + ').'); } }] },

      { num: '9', section: 'Extra practice C — Applications', stem: function (sh) { return 'A bicycle courier charges a flat dispatch fee of ' + t('\\$' + money(sh.F)) + ' plus ' + t('\\$' + money(sh.R)) + ' per kilometre. Let ' + t('C') + ' be the total charge in dollars for a delivery of ' + t('d') + ' kilometres.'; },
        shared: function (r) { return { F: r.pick([4.5, 5.5, 6.5, 7.5, 8.5, 9.5]), R: r.pick([1.25, 1.5, 1.75, 2.25, 2.5, 1.25]), d: 2 * r.int(4, 10) }; },
        parts: [
          { id: 'e9a', level: 'EMG', make: function (r, sh) {
            return LP('Write an equation for ' + t('C') + ' in terms of ' + t('d') + '.', L(fr(Math.round(sh.R * 4), 4), fr(Math.round(sh.F * 2), 2)),
              { vars: ['d', 'C'], decimalOk: true, keyTex: 'C=' + sh.R + 'd+' + sh.F, wrong: [{ is: 'C=' + sh.F + 'd+' + sh.R, code: 'u72-rate-fee', hint: 'You swapped them: the rate per kilometre multiplies ' + t('d') + '; the dispatch fee is the starting value.' }, { is: 'C=' + sh.R + 'd', code: 'u72-fee', hint: 'Don’t forget the dispatch fee — it is charged even for ' + t('0') + ' km, so it is ' + t('b') + '.' }], good: ['C=' + sh.F + '+' + sh.R + 'd', 'C=' + money(sh.R) + 'd+' + money(sh.F)] },
              'The rate is ' + t('m=' + sh.R) + ' dollars per km and the fee is ' + t('b=' + sh.F) + ': ' + t('C=' + sh.R + 'd+' + sh.F) + '.', H_CTX, 'courier equation');
          } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) {
            var c = sh.R * sh.d + sh.F;
            return numPart('Determine the charge for a ' + t(sh.d) + ' km delivery.', c, [[sh.R * sh.d, 'u72-fee', 'Add the dispatch fee of ' + t('\\$' + money(sh.F)) + ' too.'], [(sh.R + sh.F) * sh.d, 'u7l4-fee-times', 'Only the rate per kilometre is multiplied by the distance; the fee is added once.'], [sh.F * sh.d + sh.R, 'u7l4-swap-eval', 'The rate ' + t(money(sh.R)) + ' is the number multiplied by the kilometres.']],
              t('C=' + sh.R + '(' + sh.d + ')+' + sh.F + '=' + cash(sh.R * sh.d) + '+' + sh.F + '=' + cash(c)) + ', so the charge is ' + t('\\$' + money(c)) + '.', ['Substitute ' + t('d=' + sh.d) + ' into your equation.', t(money(sh.R) + '\\times ' + sh.d) + ': multiply ' + t(sh.R) + ' by ' + t(sh.d / 2) + ', then double.'], 'courier ' + sh.d + ' km', { before: '\\$' });
          } },
          { id: 'e9c', level: 'EMG', make: function (r, sh) {
            return mc(r, 'What does the ordered pair ' + t('(0,\\ ' + money(sh.F) + ')') + ' mean in this situation?', [
              { html: 'A delivery of ' + t('0') + ' km still costs ' + t('\\$' + money(sh.F)) + ': the flat dispatch fee.', right: true },
              { html: 'Each kilometre costs ' + t('\\$' + money(sh.F)) + '.', why: 'The cost per kilometre is the slope, ' + t('\\$' + money(sh.R)) + '. The pair ' + t('(0,\\ ' + money(sh.F) + ')') + ' is a point: distance ' + t(0) + ', charge ' + t(money(sh.F)) + '.' },
              { html: 'The courier can ride ' + t(money(sh.F)) + ' km for free.', why: 'In ' + t('(d,\\ C)') + ' the first number is the distance and the second is the charge. Here the distance is ' + t(0) + '.' },
              { html: 'The delivery is finished after ' + t(money(sh.F)) + ' hours.', why: 'Time isn’t one of the variables: ' + t('(d,\\ C)') + ' pairs a distance with a charge.' }],
              'The pair is ' + t('(d,\\ C)') + ': a distance of ' + t('0') + ' km has a charge of ' + t('\\$' + money(sh.F)) + '. That is the flat dispatch fee, charged before any distance is ridden — the ' + t('C') + '-intercept.', ['The first number is ' + t('d') + ' (km), the second is ' + t('C') + ' (dollars).'], 'meaning of (0, fee)');
          } }] },
      { num: '10', stem: function (sh) { return 'A tutoring service charges a one-time registration fee of ' + t('\\$' + sh.F) + ', then bills ' + t('\\$' + sh.G) + ' for every ' + t(sh.k) + ' sessions. Let ' + t('C') + ' be the total cost in dollars after ' + t('n') + ' sessions.'; },
        shared: function (r) { return until(function () { var k = r.pick([2, 4, 4]), s = r.pick([32.5, 35, 37.5, 40, 42.5, 45]); return { k: k, s: s, G: s * k, F: r.pick([24, 30, 36, 40, 45]), n: r.int(5, 12) }; }, function (o) { return o.F !== o.s && Math.abs(o.G - Math.round(o.G)) < 1e-9 && Math.abs(o.s * o.n - Math.round(o.s * o.n)) < 1e-9; }); },
        parts: [
          { id: 'e10a', level: 'PRG', make: function (r, sh) {
            return numPart('Determine the cost of a single session.', sh.s, [[sh.G, 'u7l4-group', 'That’s the price of ' + t(sh.k) + ' sessions. Divide by ' + t(sh.k) + ' for one session.'], [sh.G * sh.k, 'u7l4-group', 'Divide the price by the number of sessions — don’t multiply.'], [(sh.G + sh.F) / sh.k, 'u72-fee', 'The registration fee is paid once, so leave it out of the price per session.']],
              t('\\$' + sh.G + '\\div ' + sh.k + '=\\$' + money(sh.s)) + ' per session.', ['The ' + t('\\$' + sh.G) + ' covers ' + t(sh.k) + ' sessions.'], 'cost per session', { before: '\\$' });
          } },
          { id: 'e10b', level: 'PRG', make: function (r, sh) {
            return LP('Write an equation for ' + t('C') + ' in terms of ' + t('n') + '.', L(fr(Math.round(sh.s * 2), 2), sh.F),
              { vars: ['n', 'C'], decimalOk: true, keyTex: 'C=' + sh.s + 'n+' + sh.F, wrong: [{ is: 'C=' + sh.G + 'n+' + sh.F, code: 'u7l4-group', hint: t('\\$' + sh.G) + ' is the price of ' + t(sh.k) + ' sessions. The rate is the price of <b>one</b> session.' }, { is: 'C=' + sh.F + 'n+' + sh.s, code: 'u72-rate-fee', hint: 'The cost per session multiplies ' + t('n') + '; the registration fee is added once.' }, { is: 'C=' + sh.s + 'n', code: 'u72-fee', hint: 'Don’t forget the registration fee.' }], good: ['C=' + sh.F + '+' + sh.s + 'n', 'C=\\frac{' + sh.G + '}{' + sh.k + '}n+' + sh.F] },
              'The rate is ' + t('\\$' + money(sh.s)) + ' per session (from (a)) and the fee is ' + t('\\$' + sh.F) + ': ' + t('C=' + sh.s + 'n+' + sh.F) + '.', ['Use the cost of one session as ' + t('m') + ' and the registration fee as ' + t('b') + '.'], 'tutoring equation');
          } },
          { id: 'e10c', level: 'EMG', make: function (r, sh) {
            var c = sh.s * sh.n + sh.F;
            return numPart('Determine the total cost of ' + t(sh.n) + ' sessions.', c, [[sh.s * sh.n, 'u72-fee', 'Add the registration fee too.'], [sh.G * sh.n + sh.F, 'u7l4-group', 'Use the price of <b>one</b> session, ' + t('\\$' + money(sh.s)) + '.']],
              t('C=' + sh.s + '(' + sh.n + ')+' + sh.F + '=' + cash(sh.s * sh.n) + '+' + sh.F + '=' + cash(c)) + ', so ' + t(sh.n) + ' sessions cost ' + t('\\$' + cash(c)) + '.', ['Substitute ' + t('n=' + sh.n) + ' into your equation.'], 'tutoring ' + sh.n + ' sessions', { before: '\\$' });
          } }] },
      { num: '11', stem: function (sh) { return 'A swimming pool holds ' + t(sh.V) + ' L of water when the drain is opened. The water leaves at a constant rate of ' + t(sh.k) + ' L per hour. Let ' + t('V') + ' be the volume of water in litres after ' + t('t') + ' hours.'; },
        shared: function (r) { return until(function () { var k = r.pick([100, 125, 150, 175, 200, 250]), T = r.int(12, 30); return { k: k, T: T, V: k * T, n: r.int(2, 8) }; }, function (o) { return o.V <= 6000 && o.V >= 1500; }); },
        parts: [
          { id: 'e11a', level: 'EMG', make: function (r, sh) { return ctxEq('Write an equation for ' + t('V') + ' in terms of ' + t('t') + '.', -sh.k, sh.V, ['t', 'V'], 'draining rate', 'starting volume', 'pool equation'); } },
          { id: 'e11b', level: 'EMG', make: function (r, sh) { return ctxVal('Determine the volume remaining after ' + t(sh.n) + ' hours.', -sh.k, sh.V, sh.n, ['t', 'V'], { after: 'L' }, 'pool volume'); } },
          { id: 'e11c', level: 'PRG', make: function (r, sh) {
            return numPart('Determine how long the pool takes to empty completely.', sh.T, [[sh.k / sh.V, 'u7l4-empty-rate', 'Divide the full volume by the rate: ' + t(sh.V + '\\div ' + sh.k) + '.'], [sh.V - sh.k, 'u7l4-start-only', 'Empty means ' + t('V=0') + ': solve ' + t('0=-' + sh.k + 't+' + sh.V) + '.']],
              'Empty means ' + t('V=0') + ': ' + t('0=-' + sh.k + 't+' + sh.V) + ', so ' + t(sh.k + 't=' + sh.V) + ' and ' + t('t=' + sh.V + '\\div ' + sh.k + '=' + sh.T) + ' hours.', ['Set ' + t('V=0') + ' and solve for ' + t('t') + '.', 'How many lots of ' + t(sh.k) + ' L make ' + t(sh.V) + ' L?'], 'pool empty time', { after: 'hours' });
          } }] },
      { num: '12', stem: function (sh) { return 'A stamping machine starts empty and produces parts at a constant rate of ' + t(sh.P) + ' parts every ' + t(sh.k) + ' minutes. Let ' + t('N') + ' be the number of parts produced after ' + t('t') + ' minutes.'; },
        shared: function (r) { return until(function () { var k = r.pick([4, 6, 6, 8, 10]), P = r.int(3, 12) * r.pick([3, 5]); var f = fr(P, k); return { k: k, P: P, f: f, T: f[1] * r.int(4, 10) }; }, function (o) { return o.f[1] > 1 && gcd(o.P, o.k) > 1 && o.f[0] > o.f[1]; }); },
        parts: [
          { id: 'e12a', level: 'PRG', make: function (r, sh) {
            var p = B.fraction('Determine the number of parts produced per minute, as a fraction in lowest terms.', sh.f, {}, t('\\frac{' + sh.P + '}{' + sh.k + '}=' + nT(sh.f)) + ' parts per minute (divide the top and bottom by ' + t(gcd(sh.P, sh.k)) + ').', ['Rate = parts ÷ minutes.', 'Reduce: divide the top and the bottom by their greatest common factor.'], 'parts per minute');
            var c = p.check;
            p.check = function (resp) { var v = readVal(resp); if (v != null && near(v, sh.k / sh.P)) return wrong('flip', 'That’s minutes per part. The rate is <b>parts</b> per minute: ' + t('\\frac{' + sh.P + '}{' + sh.k + '}') + '.'); return c(resp); };
            p.bad = [nT([sh.k, sh.P])];
            return p;
          } },
          { id: 'e12b', sub: 'b', level: 'EMG', make: function (r, sh) {
            return exactOnly(LP('Write an equation for ' + t('N') + ' in terms of ' + t('t') + '.', L(sh.f, 0), { vars: ['t', 'N'], wrong: [{ is: L(sh.f, 1), code: 'u72-origin', hint: 'The machine starts empty: ' + t('0') + ' parts at ' + t('t=0') + ', so ' + t('b=0') + '.' }, { is: L([sh.k, sh.P], 0), code: 'flip', hint: 'The rate is parts per minute, ' + t(nT(sh.f)) + '.' }] },
              'The rate is ' + t('m=' + nT(sh.f)) + ' parts per minute and the machine starts with ' + t('0') + ' parts, so ' + t('b=0') + ': ' + t(SI(sh.f, 0, ['t', 'N'])) + '.', ['Use the rate from (a) as ' + t('m') + '. How many parts are there at ' + t('t=0') + '?'], 'machine equation'));
          } },
          { id: 'e12c', sub: 'b (why)', level: 'EMG', make: function (r, sh) {
            return mc(r, 'Why is ' + t('b=0') + ' in this equation?', [
              { html: 'The machine starts empty: at ' + t('t=0') + ' no parts have been made, so ' + t('N=0') + '.', right: true },
              { html: 'The rate is a fraction, so there is no ' + t('y') + '-intercept.', why: 'A fractional slope doesn’t affect ' + t('b') + '. ' + t('b') + ' is the number of parts at ' + t('t=0') + '.' },
              { html: 'The machine makes the same number of parts every minute.', why: 'A constant rate makes the graph a straight line, but it says nothing about the starting number.' },
              { html: t('b') + ' is always ' + t('0') + ' in a real-world equation.', why: 'Not at all — the tutoring and courier questions had starting fees. Here ' + t('b=0') + ' because the machine starts empty.' }],
              t('b') + ' is the value of ' + t('N') + ' when ' + t('t=0') + '. The machine starts empty, so ' + t('N=0') + ' at ' + t('t=0') + ' and ' + t('b=0') + ': the graph passes through the origin.', ['What is ' + t('N') + ' when ' + t('t=0') + '?'], 'why b=0');
          } },
          { id: 'e12d', sub: 'c', level: 'EMG', make: function (r, sh) {
            var N = fv(sh.f) * sh.T;
            return numPart('Determine the number of parts produced in ' + t(sh.T) + ' minutes.', N, [[sh.P * sh.T, 'u7l4-group', 'Use the rate per minute, ' + t(nT(sh.f)) + ', not ' + t(sh.P) + '.'], [sh.T / fv(sh.f), 'flip', 'Multiply the rate by the time: ' + t(nT(sh.f) + '\\times ' + sh.T) + '.']],
              t('N=' + nT(sh.f) + '(' + sh.T + ')=' + sh.f[0] + '\\times ' + (sh.T / sh.f[1]) + '=' + N) + ' parts.', ['Substitute ' + t('t=' + sh.T) + '. Divide ' + t(sh.T) + ' by the denominator first.'], 'parts in ' + sh.T + ' min', { after: 'parts' });
          } }] },

      { num: '13', section: 'Extra practice D — Reasoning and stretch', stem: function (sh) { return '<b>Stretch.</b> Consider the three lines ' + t(SI(sh.m1, sh.b)) + ', ' + t(SI(sh.m2, sh.b)) + ' and ' + t('y=' + sh.b) + '.'; },
        shared: function (r) { return { b: nz(r, -8, 8), m1: [r.int(2, 5), 1], m2: [-1, r.int(2, 4)], m4: until(function () { return [r.int(3, 9), 2]; }, function (f) { return f[0] % 2 === 1; }) }; },
        parts: [
          { id: 'e13a', level: 'BEG', make: function (r, sh) {
            return ptPart('What do all three graphs have in common? Name the exact point they share.', [0, sh.b], [[[sh.b, 0], 'pairs-flip', 'The shared point is on the ' + t('y') + '-axis, so its ' + t('x') + '-coordinate is ' + t(0) + ': ' + t('(0,\\ b)') + '.']],
              'All three have ' + t('b=' + sh.b) + ' (the third is ' + t('y=0x+' + pT(sh.b)) + '), so all three cross the ' + t('y') + '-axis at ' + t(ptT(0, sh.b)) + '.', ['Compare the ' + t('b') + '-values of the three equations.'], 'shared point');
          } },
          { id: 'e13b', level: 'EMG', make: function (r, sh) {
            return mc(r, 'How do the three graphs differ from one another?', [
              { html: 'They have different slopes: ' + t(SI(sh.m1, sh.b)) + ' rises steeply, ' + t(SI(sh.m2, sh.b)) + ' falls gently, and ' + t('y=' + sh.b) + ' is horizontal.', right: true },
              { html: 'They have different ' + t('y') + '-intercepts but the same slope.', why: 'All three have ' + t('b=' + sh.b) + '. Look at the numbers in front of ' + t('x') + '.' },
              { html: 'They are parallel lines.', why: 'Parallel lines have equal slopes and never meet; these three all meet at ' + t(ptT(0, sh.b)) + '.' },
              { html: 'They differ in slope: all three rise from left to right, at different steepnesses.', why: 'A negative slope falls from left to right, and a slope of ' + t(0) + ' is flat.' }],
              'All three share ' + t('b=' + sh.b) + '; they differ in slope: ' + t(nT(sh.m1)) + ' (rises steeply), ' + t(nT(sh.m2)) + ' (falls gently) and ' + t(0) + ' (horizontal).', ['Compare the slopes (the numbers multiplying ' + t('x') + ').'], 'how they differ');
          } },
          { id: 'e13c', level: 'EMG', make: function (r, sh) {
            return directPart(sh.m4, [sh.b, 1], 'A fourth line shares that same point and has slope ' + t(nT(sh.m4)) + '. Write its equation.', 'fourth line', [{ is: L(sh.m4, 0), code: 'u72-origin', hint: 'The fourth line passes through ' + t(ptT(0, sh.b)) + ', so ' + t('b=' + sh.b) + '.' }]);
          } }] },
      { num: '14', stem: function (sh) { return 'The lines ' + t(SI(sh.m, sh.b1)) + ' and ' + t(SI(sh.m, sh.b2)) + ' have the same slope but different ' + t('y') + '-intercepts.'; },
        shared: function (r) { var q = r.int(2, 5); return until(function () { return { m: [r.int(1, q - 1) * r.pick([1, -1]), q], b1: r.int(-4, 8), b2: r.int(-9, 3), x: q * r.int(1, 3) }; }, function (o) { return gcd(o.m[0], o.m[1]) === 1 && o.b1 - o.b2 >= 3; }); },
        parts: [
          { id: 'e14a', level: 'EMG', make: function (r, sh) {
            return mc(r, 'What is the relationship between the two graphs? How many points do they share?', [
              { html: 'They are parallel, so they share no points.', right: true },
              { html: 'They are parallel, so they share exactly one point.', why: 'Parallel lines never meet, so there is no shared point at all.' },
              { html: 'They are perpendicular, so they share exactly one point.', why: 'Perpendicular slopes are negative reciprocals. These slopes are equal.' },
              { html: 'They are the same line, so they share every point.', why: 'Their ' + t('y') + '-intercepts are different, so they are different lines.' }],
              'Equal slopes and different ' + t('y') + '-intercepts: the lines are parallel and never meet, so they share no points.', ['Equal slopes means parallel. Do parallel lines meet?'], 'parallel no points');
          } },
          { id: 'e14b', level: 'PRG', make: function (r, sh) {
            var y1 = fv(sh.m) * sh.x + sh.b1, y2 = fv(sh.m) * sh.x + sh.b2, gap = y1 - y2;
            var fields = [fld('on ' + t(SI(sh.m, sh.b1)), { before: t('y=') }), fld('on ' + t(SI(sh.m, sh.b2)), { before: t('y=') }), fld('vertical distance', { after: 'units' })];
            var p = B.fields('Determine the ' + t('y') + '-value on each line when ' + t('x=' + sh.x) + ', and state the vertical distance between the two lines at that ' + t('x') + '-value.', fields,
              [K.number(y1), K.number(y2), K.number(gap, function (v) { return near(v, -gap) ? { code: 'u7l4-gap', hint: 'A distance is positive: subtract the lower value from the higher one.' } : near(v, y1 + y2) ? { code: 'u7l4-gap', hint: 'The distance between the lines is the <b>difference</b> of the two ' + t('y') + '-values.' } : null; })],
              [String(y1), String(y2), String(gap)], t('y=' + y1) + ', ' + t('y=' + y2) + ', distance ' + t(gap),
              t(SI(sh.m, sh.b1).replace(/^y=/, '') + '\\text{ at }x=' + sh.x + ':\\ ' + evalT(sh.m, sh.x, [sh.b1, 1]) + '=' + y1) + '<br>' + t(evalT(sh.m, sh.x, [sh.b2, 1]) + '=' + y2) + '<br>Distance: ' + t(y1 + '-' + pT(y2) + '=' + gap) + ' units — the same as the gap between the ' + t('y') + '-intercepts, ' + t(sh.b1 + '-' + pT(sh.b2) + '=' + gap) + '.',
              ['Substitute ' + t('x=' + sh.x) + ' into each equation.', 'The vertical distance is the larger ' + t('y') + '-value minus the smaller one.'], 'parallel gap');
            p.bad = [[String(y1), String(y2), String(-gap)], [String(y2), String(y1), String(gap + 1)]];
            return p;
          } }] },
      { num: '15', stem: function (sh) { return '<b>Stretch.</b> A line crosses the ' + t('y') + '-axis at ' + t(sh.b) + '. It is exactly as steep as the line ' + t(SI(sh.g, sh.c)) + ', but it rises from left to right instead of falling.'; },
        shared: function (r) { var q = r.pick([2, 3, 4]); return until(function () { return { g: [-r.int(q + 1, 3 * q), q], c: nz(r, -5, 5), b: -r.int(2, 9), x: q * r.int(1, 3) }; }, function (o) { return gcd(o.g[0], o.g[1]) === 1 && o.c !== o.b; }); },
        parts: [
          { id: 'e15a', level: 'ADV', make: function (r, sh) {
            var m = fNeg(sh.g);
            return LP('Write its equation.', L(m, sh.b), { wrong: [{ is: L(sh.g, sh.b), code: 'u7l4-steep-sign', hint: 'That line falls from left to right, like the given one. Rising means a <b>positive</b> slope of the same size.' }, { is: L(m, sh.c), code: 'u7l4-other-b', hint: 'Right slope — but your line crosses the ' + t('y') + '-axis at ' + t(sh.b) + ', not at ' + t(sh.c) + '.' }, { is: L(fr(sh.g[1], -sh.g[0]), sh.b), code: 'line-perp', hint: '“As steep” means the same <b>size</b> of slope, ' + t(nT(m)) + ' — not the reciprocal.' }] },
              'Same steepness means the same size of slope, ' + t(nT(m)) + '. Rising means positive: ' + t('m=' + nT(m)) + '. Crossing the ' + t('y') + '-axis at ' + t(sh.b) + ' gives ' + t('b=' + sh.b) + ': ' + t(SI(m, sh.b)) + '.', ['Same steepness = same number, ignoring the sign. Rising = positive slope.', 'Take ' + t('b') + ' from where your line crosses the ' + t('y') + '-axis, not from the given line.'], 'as steep, rising');
          } },
          { id: 'e15b', level: 'PRG', make: function (r, sh) {
            var m = fNeg(sh.g), y = fv(m) * sh.x + sh.b;
            return numPart('Determine its ' + t('y') + '-value at ' + t('x=' + sh.x) + '.', y, [[fv(sh.g) * sh.x + sh.b, 'u7l4-steep-sign', 'Your line rises, so its slope is positive: ' + t(nT(m)) + '.'], [fv(m) * sh.x + sh.c, 'u7l4-other-b', 'Use your line’s ' + t('y') + '-intercept, ' + t(sh.b) + '.']],
              t('y=' + evalT(m, sh.x, [sh.b, 1]) + '=' + (fv(m) * sh.x) + (sh.b < 0 ? '' : '+') + sh.b + '=' + y) + '.', ['Substitute ' + t('x=' + sh.x) + ' into your equation from (a).'], 'value at x=' + sh.x, { before: 'y=' });
          } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e16', level: 'BEG', make: function (r) {
          var q = r.pick([3, 5, 7]), m = [-until(function () { return r.int(2, 2 * q); }, function (p) { return gcd(p, q) === 1 && p !== q; }), q], b = until(function () { return [r.int(1, 2 * q), q]; }, function (f) { return gcd(f[0], q) === 1 && f[0] !== -m[0]; });
          return mc(r, 'Which equation has slope ' + t(nT(m)) + ' and ' + t('y') + '-intercept ' + t(nT(b)) + '?', [
            { html: t(SI(b, m)), why: 'The numbers are swapped: the slope multiplies ' + t('x') + '.' },
            { html: t(SI(m, b)), right: true },
            { html: t(SI(fNeg(m), fNeg(b))), why: 'Both signs are wrong.' },
            { html: t(SI(fNeg(b), fNeg(m))), why: 'The numbers are swapped and the signs are wrong.' }],
            'The slope ' + t(nT(m)) + ' multiplies ' + t('x') + ' and the ' + t('y') + '-intercept ' + t(nT(b)) + ' is added on: ' + t(SI(m, b)) + '.', [H_SI[0]], 'MC fractions', true);
        } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e17', level: 'EMG', make: function (r) {
          var q = r.pick([3, 4, 5]), p = until(function () { return r.int(1, q - 1); }, function (v) { return gcd(v, q) === 1; }), b = r.int(2, 9), x = 2 * q, ans = -p * 2 + b;
          return nrPart('A line has slope ' + t(nT([-p, q])) + ' and ' + t('y') + '-intercept ' + t(b) + '. Its ' + t('y') + '-value when ' + t('x=' + x) + ' is ________.', ans,
            [[p * 2 + b, 'slope-sign', 'The slope is negative: ' + t(nT([-p, q]) + '\\times ' + x + '=' + (-2 * p)) + '.'], [-p * 2, 'u72-fee', 'Add the ' + t('y') + '-intercept ' + t(b) + ' too.'], [-p * 2 - b, 'sign', 'The ' + t('y') + '-intercept is ' + t('+' + b) + '.']],
            t('y=' + nT([-p, q]) + '(' + x + ')+' + b + '=' + (-2 * p) + '+' + b + '=' + ans) + '.', ['Write the equation, then substitute ' + t('x=' + x) + '.'], 'NR value at x');
        } }] },

      /* ---------------- added: Mastery challenge ---------------- */
      { num: '18', section: 'Mastery challenge', stem: function (sh) { return 'Two phone plans: <b>Plan A</b> charges a one-time ' + t('\\$' + sh.F) + ' activation fee plus ' + t('\\$' + sh.A) + ' per month. <b>Plan B</b> has no activation fee and charges ' + t('\\$' + sh.Bm) + ' per month. Let ' + t('C') + ' be the total cost in dollars after ' + t('n') + ' months.'; },
        shared: function (r) { return until(function () { var d = r.pick([5, 10, 15]), n = r.int(3, 9); var A = r.pick([20, 25, 30, 35, 40, 45]); return { A: A, Bm: A + d, F: d * n, n0: n, N: r.pick([2, 12, 12, 24]) }; }, function (o) { return o.N !== o.n0 && o.F <= 120 && o.F !== o.A; }); },
        parts: [
          { id: 'e18a', level: 'EMG', make: function (r, sh) {
            var fields = [fld('Plan A', { vars: ['n', 'C'], wide: true, placeholder: 'C = …' }), fld('Plan B', { vars: ['n', 'C'], wide: true, placeholder: 'C = …' })];
            var p = B.fields('Write an equation for the cost of each plan.', fields,
              [K.line(L(sh.A, sh.F), { vars: ['n', 'C'], wrong: [{ is: L(sh.F, sh.A), code: 'u72-rate-fee', hint: 'The monthly charge multiplies ' + t('n') + '; the activation fee is added once.' }, { is: L(sh.A, 0), code: 'u72-fee', hint: 'Don’t forget Plan A’s activation fee.' }] }),
                K.line(L(sh.Bm, 0), { vars: ['n', 'C'], wrong: [{ is: L(sh.Bm, sh.F), code: 'u7l4-other-b', hint: 'Plan B has <b>no</b> activation fee, so ' + t('b=0') + '.' }] })],
              ['C=' + sh.A + 'n+' + sh.F, 'C=' + sh.Bm + 'n'], 'Plan A: ' + t('C=' + sh.A + 'n+' + sh.F) + '; Plan B: ' + t('C=' + sh.Bm + 'n'),
              'Plan A: rate ' + t(sh.A) + ', fee ' + t(sh.F) + ': ' + t('C=' + sh.A + 'n+' + sh.F) + '.<br>Plan B: rate ' + t(sh.Bm) + ', no fee: ' + t('C=' + sh.Bm + 'n') + '.', H_CTX, 'two plans equations');
            p.bad = [['C=' + sh.F + 'n+' + sh.A, 'C=' + sh.Bm + 'n'], ['C=' + sh.A + 'n+' + sh.F, 'C=' + sh.Bm + 'n+' + sh.F]];
            return p;
          } },
          { id: 'e18b', level: 'MAS', make: function (r, sh) {
            return numPart('After how many months have the two plans cost exactly the same total?', sh.n0, [[sh.F / sh.A, 'u7l4-plan-eq', 'Set the two <b>costs</b> equal: ' + t(sh.A + 'n+' + sh.F + '=' + sh.Bm + 'n') + ', then solve for ' + t('n') + '.'], [sh.F / sh.Bm, 'u7l4-plan-eq', 'Set the two costs equal: ' + t(sh.A + 'n+' + sh.F + '=' + sh.Bm + 'n') + '. Collect the ' + t('n') + '-terms on one side.'], [sh.F / (sh.A + sh.Bm), 'u7l4-plan-eq', 'When you move ' + t(sh.A + 'n') + ' to the other side, it is subtracted: ' + t(sh.F + '=' + sh.Bm + 'n-' + sh.A + 'n') + '.']],
              'Equal cost: ' + t(sh.A + 'n+' + sh.F + '=' + sh.Bm + 'n') + '. Subtract ' + t(sh.A + 'n') + ' from both sides: ' + t(sh.F + '=' + (sh.Bm - sh.A) + 'n') + ', so ' + t('n=' + sh.F + '\\div ' + (sh.Bm - sh.A) + '=' + sh.n0) + ' months.<br><b>Check.</b> Plan A: ' + t(sh.A + '(' + sh.n0 + ')+' + sh.F + '=' + (sh.A * sh.n0 + sh.F)) + '; Plan B: ' + t(sh.Bm + '(' + sh.n0 + ')=' + (sh.Bm * sh.n0)) + ' ✓<br>(Another way: Plan B costs ' + t('\\$' + (sh.Bm - sh.A)) + ' more each month, so it takes ' + t(sh.F + '\\div ' + (sh.Bm - sh.A) + '=' + sh.n0) + ' months to make up Plan A’s ' + t('\\$' + sh.F) + ' fee.)',
              ['The plans cost the same when their equations give the same ' + t('C') + ': set them equal.', 'Plan B costs ' + t('\\$' + (sh.Bm - sh.A)) + ' more per month. How many months until that adds up to Plan A’s fee?'], 'equal cost month', { after: 'months' });
          } },
          { id: 'e18c', level: 'ADV', make: function (r, sh) {
            var N = sh.N, cA = sh.A * N + sh.F, cB = sh.Bm * N, cheaper = cA < cB ? 'A' : 'B';
            return mc(r, 'Which plan is cheaper for someone who keeps the phone for ' + t(N) + ' months, and why?', [
              { html: 'Plan A: it costs ' + t('\\$' + cA) + ' and Plan B costs ' + t('\\$' + cB) + '.', right: cheaper === 'A', why: cheaper === 'A' ? null : 'Check the totals: ' + t(sh.A + '(' + N + ')+' + sh.F + '=' + cA) + ' and ' + t(sh.Bm + '(' + N + ')=' + cB) + '.' },
              { html: 'Plan B: it costs ' + t('\\$' + cB) + ' and Plan A costs ' + t('\\$' + cA) + '.', right: cheaper === 'B', why: cheaper === 'B' ? null : 'Check the totals: ' + t(sh.A + '(' + N + ')+' + sh.F + '=' + cA) + ' and ' + t(sh.Bm + '(' + N + ')=' + cB) + '.' },
              { html: 'Plan B always, because it has no activation fee.', why: 'Plan B’s monthly charge is higher, so after ' + t(sh.n0) + ' months it costs more than Plan A.' },
              { html: 'Plan A always, because its monthly charge is lower.', why: 'Plan A starts ' + t('\\$' + sh.F) + ' behind, so for fewer than ' + t(sh.n0) + ' months Plan B is cheaper.' }],
              'Plan A: ' + t(sh.A + '(' + N + ')+' + sh.F + '=' + cA) + '; Plan B: ' + t(sh.Bm + '(' + N + ')=' + cB) + '. Plan ' + cheaper + ' is cheaper for ' + t(N) + ' months. (Before ' + t(sh.n0) + ' months Plan B is cheaper; after that Plan A is.)', ['Substitute ' + t('n=' + N) + ' into both equations and compare.'], 'cheaper plan', true);
          } }] }
    ]
  });

  /* ---------------- makers used above (function declarations are hoisted) ---------------- */
  function tablePart(m, b) {
    var xs = [0, 1, 2, 3], ys = xs.map(function (x) { return m * x + b; });
    return LP(HW.valueTable([[t('x')].concat(xs), [t('y')].concat(ys)]), L(m, b), { wrong: [{ is: L(b, m), code: 'u72-swap-mb', hint: SWAP() }, { is: L(m, ys[1]), code: 'line-intercept', hint: 'The ' + t('y') + '-intercept is the ' + t('y') + '-value with ' + t('x=0') + ': ' + t(b) + '.' }] },
      'At ' + t('x=0') + ', ' + t('y=' + b) + ', so ' + t('b=' + b) + '. Each time ' + t('x') + ' goes up by ' + t(1) + ', ' + t('y') + ' changes by ' + t((m > 0 ? '+' : '') + m) + ', so ' + t('m=' + m) + '.<br>' + t(SI(m, b)) + '. <b>Check.</b> ' + t('x=3:\\ ' + evalT([m, 1], 3, [b, 1]) + '=' + ys[3]) + ' ✓', H_TAB, 'table m=' + m + ' b=' + b);
  }
  /* an equation in a story: rate m, start b, letters vars = [input, output] */
  function ctxEq(prompt, m, b, vars, rateName, startName, text) {
    var X = vars[0], Y = vars[1];
    return LP(prompt, L(m, b), { vars: vars, wrong: [{ is: L(b, m), code: 'u72-rate-fee', hint: 'You swapped them: the ' + rateName + ' multiplies ' + t(X) + '; the ' + startName + ' is added on its own.' }, { is: L(m, 0), code: 'u72-fee', hint: 'Don’t forget the ' + startName + ' — it is the value at ' + t(X + '=0') + ', so it is ' + t('b') + '.' }] },
      'The ' + startName + ' is ' + t('b=' + b) + ' and the ' + rateName + ' is ' + t('m=' + m) + (m < 0 ? ' (negative, because the amount goes down)' : '') + ': ' + t(SI(m, b, vars)) + '.', H_CTX, text);
  }
  function ctxVal(prompt, m, b, x, vars, inp, text) {
    var v = m * x + b, X = vars[0], Y = vars[1];
    return numPart(prompt, v, [[m * x, 'u72-fee', 'Add the starting value ' + t(b) + ' too.'], [b * x + m, 'u7l4-swap-eval', 'The rate ' + t(m) + ' is the number multiplied by ' + t(X) + '.'], [(m + b) * x, 'u7l4-fee-times', 'Only the rate is multiplied by ' + t(X) + '; the starting value is added once.'], [b - m * x, 'sign', 'Check the sign of the rate.'], [b, 'u7l4-start-only', 'That’s the value at ' + t(X + '=0') + '. Substitute ' + t(X + '=' + x) + '.']],
      t(Y + '=' + evalT([m, 1], x, [b, 1]) + '=' + (m * x) + (b < 0 ? '' : '+') + b + '=' + v) + '.', ['Substitute ' + t(X + '=' + x) + ' into your equation.'], text, inp);
  }
  function exactSI(m, b, prompt, extra) {
    var w = (extra || []).slice();
    if (!fEq(m, b)) w.push({ is: L(b, m), code: 'u72-swap-mb', hint: SWAP() });
    if (fv(b) !== 0) w.push({ is: L(m, fNeg(b)), code: 'line-b-sign', hint: 'Check the sign of the ' + t('y') + '-intercept.' });
    return exactOnly(LP(prompt, L(m, b), { form: 'slope-intercept', wrong: w },
      t('m=' + nT(m)) + ' and ' + t('b=' + nT(b)) + ': ' + t(SI(m, b)) + '.<br><b>Check.</b> ' + t('x=0\\Rightarrow y=' + nT(b)) + ' ✓', H_SI, 'exact ' + nT(m) + ', ' + nT(b)));
  }
  function horizPart(k, prompt) {
    return LP(prompt, { y: fv(k) }, { keyTex: 'y=' + nT(k), wrong: [{ is: { x: fv(k) }, code: 'line-vh', hint: 'That’s a vertical line. A slope of ' + t(0) + ' means a <b>horizontal</b> line: ' + t('y=') + ' a number.' }, { is: L(k, 0), code: 'u72-swap-mb', hint: 'The slope is ' + t(0) + ', so there is no ' + t('x') + '-term: ' + t('y=0x+b') + ' is just ' + t('y=b') + '.' }] },
      t('m=0') + ' and ' + t('b=' + nT(k)) + ': ' + t('y=0x+' + pT(k)) + '. Since ' + t('0x=0') + ', this is ' + t('y=' + nT(k)) + ' — a horizontal line.<br><b>Check.</b> ' + t('x=0\\Rightarrow y=' + nT(k)) + ' ✓', ['With ' + t('m=0') + ', the ' + t('x') + '-term is ' + t('0x=0') + '.', 'A slope of ' + t(0) + ' means horizontal: ' + t('y=') + ' a number.'], 'horizontal y=' + nT(k));
  }
  function originPart(m, prompt) {
    return LP(prompt, L(m, 0), { wrong: [{ is: { y: fv(m) }, code: 'u72-swap-mb', hint: t('y=' + nT(m)) + ' is a horizontal line. The slope multiplies ' + t('x') + '; ' + t('b=0') + ' adds nothing.' }, { is: L(m, 1), code: 'u72-origin', hint: 'Through the origin means ' + t('b=0') + '.' }] },
      t('m=' + nT(m)) + ' and ' + t('b=0') + ': ' + t(SI(m, 0)) + '.<br><b>Check.</b> ' + t('x=0\\Rightarrow y=0') + ' ✓', ['The origin ' + t('(0,\\ 0)') + ' is on the ' + t('y') + '-axis, so ' + t('b=0') + '.', 'Adding ' + t('0') + ' changes nothing, so leave it off.'], 'origin slope ' + nT(m));
  }
  /* Extra 6: "crosses at b and rises/falls p for every q across" */
  function wordsPart(m, b, prompt, text) {
    m = fr(m);
    var w = [{ is: L(fNeg(m), b), code: 'line-slope-sign', hint: (fv(m) < 0 ? '“Falls”' : '“Rises”') + ' tells you the sign: a line that ' + (fv(m) < 0 ? 'falls has a <b>negative</b>' : 'rises has a <b>positive</b>') + ' slope.' }];
    if (fv(b) !== 0 && !fEq(m, b)) w.push({ is: L(b, m), code: 'u72-swap-mb', hint: SWAP() });
    return LP(prompt, L(m, b), { wrong: w },
      'Slope = rise ÷ run: ' + t('m=' + nT(m)) + (fv(m) < 0 ? ' (negative because it falls)' : '') + '. ' + (fv(b) === 0 ? 'Through the origin: ' + t('b=0') : 'Crossing the ' + t('y') + '-axis at ' + t(nT(b)) + ' gives ' + t('b=' + nT(b))) + '.<br>' + t(SI(m, b)) + '.', ['Rise over run gives the slope; “falls” makes it negative.', 'Where the line crosses the ' + t('y') + '-axis is ' + t('b') + '.'], text);
  }
  /* Extra 7: choose the description of y = mx + b */
  function describeMC(r, m, b) {
    m = fr(m); var p = Math.abs(m[0]), q = m[1], dir = m[0] < 0 ? 'falls' : 'rises', other = m[0] < 0 ? 'rises' : 'falls';
    var where = b === 0 ? 'passes through the origin ' + t('(0,\\ 0)') : 'crosses the ' + t('y') + '-axis at ' + t(ptT(0, b));
    var opts = [
      { html: 'It ' + where + ' and ' + dir + ' ' + t(p) + ' units for every ' + t(q) + ' units to the right.', right: true },
      { html: 'It ' + where + ' and ' + other + ' ' + t(p) + ' units for every ' + t(q) + ' units to the right.', why: 'The slope is ' + (m[0] < 0 ? 'negative, so the line falls' : 'positive, so the line rises') + ' from left to right.' },
      { html: 'It ' + where + ' and ' + dir + ' ' + t(q) + ' units for every ' + t(p) + ' units to the right.', why: 'Slope is rise over run: the top of ' + t(nT(m)) + ' is the rise, the bottom is the run.' }];
    if (b !== 0) opts.push({ html: 'It crosses the ' + t('x') + '-axis at ' + t(ptT(b, 0)) + ' and ' + dir + ' ' + t(p) + ' units for every ' + t(q) + ' units to the right.', why: t('b') + ' is where the line crosses the <b>' + t('y') + '</b>-axis: ' + t(ptT(0, b)) + '.' });
    else opts.push({ html: 'It crosses the ' + t('y') + '-axis at ' + t(ptT(0, p)) + ' and ' + dir + ' ' + t(p) + ' units for every ' + t(q) + ' units to the right.', why: 'There is no constant term, so ' + t('b=0') + ': the line passes through the origin.' });
    return mc(r, t(SI(m, b)), opts,
      t('b=' + b) + ', so the line ' + where + '. ' + t('m=' + nT(m)) + ': the rise is ' + t(m[0]) + ' for a run of ' + t(q) + ', so it ' + dir + ' ' + t(p) + ' units for every ' + t(q) + ' units to the right.', ['Read ' + t('b') + ' for the crossing point and split the slope into rise over run.'], 'describe ' + SI(m, b));
  }
  /* a number-or-fraction box inside fields */
  function valChkF(target) {
    var base = isInt(target) ? K.value(fv(target), { only: 'integer' }) : K.fraction(fr(target));
    return function (resp) { return base(String(resp == null ? '' : resp).replace(/^\s*[a-zA-Z]\s*=\s*/, '')); };
  }
})(window);
