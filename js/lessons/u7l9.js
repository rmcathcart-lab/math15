/* Math 15 · Unit 7 · Lesson 9 — Slope in Context: Interpreting Rates of Change (RF3 RF4)
 * Assignment 9 (u7_L09.tex, Questions 1–16) and the Lesson 9 Extra Practice (u7_EP09.tex, Questions 1–21).
 * Every part is a generator: same structure, idea and difficulty as the booklet item, new numbers (the booklet's numbers
 * are one of the versions wherever they are no-calculator friendly). Outcomes (Ryan's exit-slip tags): RF3 for the
 * rate of change — the slope's value, units and meaning, rates read from two points / a graph / a table, changing the
 * units of a rate; RF4 for describing and representing the relation — the starting value, writing the equation from
 * words, using it both ways, comparing two situations. "Explain" items are multiple choice whose options are reasons;
 * "which is cheaper" is a short typed letter next to the two costs. Equations are typed on the eq keypad with the
 * question's letters (js/lines.js): C = 4n + 10 and C = 10 + 4n are both accepted.
 * Model: Math 10C u7l6.js (slope in context). No calculator: rates and values are chosen so the arithmetic is friendly.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 13(d) (when one tank runs dry, the other's volume, and why
 * the gap only widens) and Extra 20 (convert two pay rates both ways and compare). */
(function (root) {
  'use strict';
  var HW = root.HW, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P;

  /* ---------------- numbers ---------------- */
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function nf(x) { return F(cl(x)); }
  function fx(x, d) { return cl(x).toFixed(d); }
  function same(a, b) { return Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function isI(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function cashT(x) { return '\\$' + (isI(x) ? nf(x) : fx(x, 2)); }
  function $(x) { return t(cashT(x)); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function steps(a, b, s) { var o = []; for (var v = a; v <= b + 1e-9; v += (s || 1)) o.push(cl(v)); return o; }
  function gen(r, f, fb) { for (var i = 0; i < 2000; i++) { var v = f(r); if (v) return v; } return fb; }
  function sgn(x) { return x < 0 ? '(' + nf(x) + ')' : nf(x); }

  /* ---------------- part makers (from Math 10C u7l6) ---------------- */
  function dg(list) { return function (v) { for (var i = 0; i < list.length; i++) if (same(v, list[i].v)) return { code: list[i].code, hint: list[i].hint }; return null; }; }
  function cleanList(list, ans) { return (list || []).filter(function (e) { return e && e.v != null && isFinite(e.v) && !same(e.v, ans); }); }
  /* one number. o: money (a $ before the box, answer shown as dollars), before, after, nr */
  function num(prompt, ans, list, sol, hints, text, o) {
    o = o || {}; ans = cl(ans); list = cleanList(list, ans);
    var p = { prompt: prompt, input: { type: 'number', before: o.money ? t('\\$') : o.before, after: o.after }, check: K.number(ans, dg(list)), key: String(ans),
      answer: o.money ? $(ans) : t(nf(ans)) + (o.after ? ' ' + o.after : ''), solution: sol, hints: hints || [], text: text };
    p.bad = list.slice(0, 5).map(function (e) { return String(cl(e.v)); });
    if (o.nr) { p.input.nr = true; delete p.input.after; p.check = K.number(ans, dg(list), { nr: true }); }
    return p;
  }
  /* several number boxes: items [{ label, ans, list, money, before, after }] */
  function nums(prompt, items, sol, hints, text) {
    var fl = items.map(function (it) { return { label: it.label, name: it.name || String(it.label).replace(/\\\(|\\\)/g, '').replace(/:\s*$/, ''), before: it.money ? t('\\$') : it.before, after: it.after }; });
    var ch = items.map(function (it) { return K.number(cl(it.ans), dg(cleanList(it.list, cl(it.ans)))); });
    var p = B.fields(prompt, fl, ch, items.map(function (it) { return String(cl(it.ans)); }),
      items.map(function (it) { return it.label + ' ' + (it.money ? $(it.ans) : t(nf(it.ans)) + (it.after ? ' ' + it.after : '')); }).join('<br>'), sol, hints, text);
    var b1 = items.map(function (it) { var l = cleanList(it.list, cl(it.ans)); return String(l.length ? cl(l[0].v) : cl(it.ans) + 1); });
    p.bad = [b1];
    return p;
  }
  /* multiple choice; drops a wrong option whose text repeats another one */
  function mc(r, prompt, opts, sol, hints, text, keep) {
    var seen = {}, out = [];
    opts.filter(function (o) { return o.right; }).concat(opts.filter(function (o) { return !o.right; })).forEach(function (o) { if (!seen[o.html]) { seen[o.html] = 1; out.push(o); } });
    var ordered = keep ? opts.filter(function (o) { return out.indexOf(o) >= 0; }) : out;
    return B.mc(r, prompt, ordered, sol, hints, text, keep);
  }
  /* y = mx + b with the question's letters */
  function eqTex(Y, X, m, b, plain) {
    var g = plain === 'money' ? function (v) { return isI(v) ? nf(v) : fx(v, 2); } : plain ? function (v) { return String(cl(v)); } : nf;
    var s = same(m, 0) ? '' : (same(m, 1) ? '' : same(m, -1) ? '-' : g(m)) + X;
    if (!same(b, 0)) s += (s ? (b > 0 ? '+' : '-') + g(Math.abs(b)) : g(b));
    return Y + '=' + (s || '0');
  }
  function prep(s) { return String(s == null ? '' : s).replace(/(\d)(?:\\,|\\ |\\;|~|\s)+(?=\d{3}(?!\d))/g, '$1'); }
  /* checker for "write the equation": o.X, o.Y, o.wrong [{ m, b, code, hint }] (swapped m and b and a lost sign are added) */
  function lineChk(m, b, o) {
    o = o || {};
    var X = o.X || 'x', Y = o.Y || 'y';
    var wl = (o.wrong || []).slice();
    if (!same(b, 0)) wl.push({ m: b, b: m, code: 'u7l9-swap', hint: 'The rate and the starting value are swapped. The rate (the “per” amount) multiplies ' + t(X) + '; the starting amount is added on by itself.' });
    if (!same(b, 0)) wl.push({ m: cl(m + b), b: 0, code: 'u7l9-add-mb', hint: 'The starting amount is charged (or counted) only once, so it isn’t multiplied by ' + t(X) + '. Write ' + t(Y + '=(\\text{rate})' + X + '+(\\text{start})') + '.' });
    wl = wl.filter(function (w) { return !(same(w.m, m) && same(w.b, b)); });
    var base = K.line({ m: m, b: b }, { vars: [X, Y], form: 'slope-intercept', wrong: wl.map(function (w) { return { is: { m: w.m, b: w.b }, code: w.code, hint: w.hint }; }) });
    return function (resp) {
      var r = base(prep(resp));
      if (r.v === 'form' && r.code === 'line-vars') return form('line-vars', 'Use the letters from the question: ' + t(Y) + ' and ' + t(X) + '.');
      if (r.v === 'form' && r.code === 'line-form-si') return form('line-form-si', 'Right equation — now write it with ' + t(Y) + ' by itself on the left: ' + t(Y + '=m' + X + '+b') + '.');
      if (r.v === 'wrong' && r.code === 'line-slope-sign') return wrong('ctx-rate-sign', m < 0 ? 'The amount is going <b>down</b>, so the rate (the slope) is negative.' : 'The amount is going <b>up</b>, so the rate (the slope) is positive.');
      if (r.v === 'wrong' && r.code === 'line-intercept' && o.bHint) return wrong('line-intercept', o.bHint);
      if (r.v === 'wrong' && r.code === 'line-slope' && o.mHint) return wrong('line-slope', o.mHint);
      return r;
    };
  }
  function line(prompt, m, b, o, sol, hints, text) {
    o = o || {}; var X = o.X || 'x', Y = o.Y || 'y';
    var p = B.math(prompt, lineChk(m, b, o), eqTex(Y, X, m, b, true), sol, hints, text, { keys: 'eq', vars: [X, Y], placeholder: 'e.g. ' + Y + ' = 2' + X + ' + 5' });
    p.answer = t(eqTex(Y, X, m, b));
    p.bad = [eqTex(Y, X, b, m, true), eqTex(Y, X, -m, b, true)].filter(function (s) { return s !== p.key; });
    if (!same(b, 0)) p.good = [Y + '=' + String(cl(b)) + (m < 0 ? '-' : '+') + String(cl(Math.abs(m))) + X];
    return p;
  }
  /* two equations, one per labelled box: L = [{ label, m, b, X, Y, wrong }] */
  function lines2(prompt, L, sol, hints, text) {
    var fl = L.map(function (l) { return { label: l.label, name: l.label.replace(/:\s*$/, ''), mode: 'math', keys: 'eq', vars: [l.X, l.Y], placeholder: 'e.g. ' + l.Y + ' = 2' + l.X + ' + 5' }; });
    var p = B.fields(prompt, fl, L.map(function (l) { return lineChk(l.m, l.b, l); }), L.map(function (l) { return eqTex(l.Y, l.X, l.m, l.b, true); }),
      L.map(function (l) { return l.label + ' ' + t(eqTex(l.Y, l.X, l.m, l.b)); }).join('<br>'), sol, hints, text);
    p.bad = [[eqTex(L[0].Y, L[0].X, L[1].m, L[1].b, true), eqTex(L[1].Y, L[1].X, L[0].m, L[0].b, true)]];
    return p;
  }
  /* a typed letter (A / B …): which option wins */
  function whichChk(right, all, why) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').trim().toLowerCase().replace(/^(plan|company|gym|tank|job|car)\s*/, '').replace(/[.\s]+$/, '');
      if (!s) return form('empty', 'Type the letter of your answer (' + all.join(' or ') + ').');
      if (s === right.toLowerCase()) return ok();
      if (all.some(function (a) { return a.toLowerCase() === s; })) return wrong('u7l9-cheaper', why || 'Compare the two values you found: the cheaper one is the <b>smaller</b> cost.');
      return form('u7l9-letter', 'Type just the letter: ' + all.join(' or ') + '.');
    };
  }
  function costsPick(prompt, items, right, all, sol, hints, text, why) {
    var fl = items.map(function (it) { return { label: it.label, name: it.label.replace(/:\s*$/, ''), before: it.money ? t('\\$') : it.before, after: it.after }; }).concat([{ label: 'Cheaper:', name: 'Cheaper', mode: 'text', placeholder: all.join(' or ') }]);
    var ch = items.map(function (it) { return K.number(cl(it.ans), dg(cleanList(it.list, cl(it.ans)))); }).concat([whichChk(right, all, why)]);
    var keys = items.map(function (it) { return String(cl(it.ans)); }).concat([right]);
    var p = B.fields(prompt, fl, ch, keys, items.map(function (it) { return it.label + ' ' + (it.money ? $(it.ans) : t(nf(it.ans))); }).join('<br>') + '<br>Cheaper: <b>' + right + '</b>', sol, hints, text);
    p.bad = [keys.slice(0, -1).concat([all.filter(function (a) { return a !== right; })[0]])];
    p.good = [keys.slice(0, -1).concat(['Plan ' + right.toLowerCase()])];
    return p;
  }

  /* ---------------- graphs ---------------- */
  function spec(o) {
    return { x: o.x, y: o.y, grid: o.gx, gridY: o.gy, labels: o.lx, labelsX: o.lx, labelsY: o.ly, unitX: (o.w || 290) / (o.x[1] - o.x[0]), unitY: (o.h || 220) / (o.y[1] - o.y[0]),
      firstQuadrant: true, xName: o.xn, yName: o.yn, xTitle: o.xt, yTitle: o.yt, max: o.max || 360, points: o.points, segs: o.segs, aria: o.aria };
  }
  function fig(o) { return '<div class="fig">' + HW.graph(spec(o)) + '</div>'; }
  function figs(list) { return '<div style="display:flex;flex-wrap:wrap;gap:6px 14px;align-items:flex-start">' + list.map(function (f) { return '<div style="flex:1 1 220px;max-width:330px">' + f + '</div>'; }).join('') + '</div>'; }

  /* ---------------- models: interpreting slope and intercept ----------------
   * Y, X letters; what = the quantity (noun phrase); yu = unit of Y (plural word), ya = its abbreviation; money: Y in
   * dollars; each = what one unit of X is ("hour", "kilometre driven"); xs = plural unit of X; xa = abbreviation;
   * up / down verbs; start(v) = what the intercept means (v = its value as text); def(Y, X) = the sentence defining the
   * letters; m: [values], b: [values] (sizes; the sign comes from neg) */
  var MODELS = {
    cyclist: { Y: 'd', X: 't', what: 'the cyclist’s distance', yu: 'km', ya: 'km', each: 'hour', xs: 'hours', xa: 'h', who: 'A cyclist’s distance', up: 'increases', down: 'decreases', m: steps(12, 30), b: [0] },
    hiker: { Y: 'd', X: 't', what: 'the hiker’s distance', yu: 'km', ya: 'km', each: 'hour', xs: 'hours', xa: 'h', who: 'A hiker’s distance', up: 'increases', down: 'decreases', m: [3, 4, 5, 6], b: [0] },
    train: { Y: 'd', X: 't', what: 'the train’s distance', yu: 'km', ya: 'km', each: 'hour', xs: 'hours', xa: 'h', who: 'A train’s distance', up: 'increases', down: 'decreases', m: steps(60, 120, 5), b: [0] },
    printer: { Y: 'P', X: 't', what: 'the number of pages printed', yu: 'pages', ya: 'pages', each: 'minute', xs: 'minutes', xa: 'min', who: 'The number of pages a printer has printed', up: 'increases', down: 'decreases', m: steps(12, 40, 2), b: [0] },
    pool: { Y: 'V', X: 't', what: 'the volume of water in the pool', yu: 'L', ya: 'L', each: 'minute', xs: 'minutes', xa: 'min', who: 'The water in a pool being filled is', up: 'increases', down: 'decreases', m: steps(15, 60, 5), b: steps(100, 500, 50), start: function (v) { return v + ' of water was already in the pool when the hose was turned on.'; } },
    bucket: { Y: 'W', X: 't', what: 'the water in the bucket', yu: 'mL', ya: 'mL', each: 'minute', xs: 'minutes', xa: 'min', who: 'A leaking bucket holds', up: 'increases', down: 'decreases', neg: true, m: [20, 25, 30, 40, 50, 60], b: [500, 600, 750, 800, 900, 1000], start: function (v) { return 'the bucket held ' + v + ' of water when the leak began.'; } },
    tank: { Y: 'V', X: 't', what: 'the water in the tank', yu: 'L', ya: 'L', each: 'minute', xs: 'minutes', xa: 'min', who: 'A tank holds', up: 'increases', down: 'decreases', neg: true, m: [12, 15, 20, 24, 25, 30, 40], b: [600, 720, 800, 900, 960, 1200], start: function (v) { return 'the tank held ' + v + ' of water when the valve was opened.'; } },
    candle: { Y: 'H', X: 't', what: 'the candle’s height', yu: 'cm', ya: 'cm', each: 'minute', xs: 'minutes', xa: 'min', who: 'A candle’s height is', up: 'increases', down: 'decreases', neg: true, m: [0.1, 0.2, 0.3, 0.4, 0.5], b: [12, 15, 18, 20, 24, 25], start: function (v) { return 'the candle was ' + v + ' tall before it was lit.'; } },
    coffee: { Y: 'B', X: 'c', what: 'the card’s balance', yu: 'dollars', ya: '$', money: true, each: 'coffee bought', xs: 'coffees', xa: 'coffee', who: 'A coffee card’s balance is', up: 'increases', down: 'decreases', neg: true, m: [3, 3.25, 3.5, 4, 4.25, 4.5, 5], b: [40, 50, 60, 75, 80, 91, 100], start: function (v) { return 'the card held ' + v + ' before any coffee was bought.'; } },
    temp: { Y: 'T', X: 'a', what: 'the air temperature', yu: '°C', ya: '°C', each: 'kilometre of altitude gained', xs: 'kilometres', xa: 'km', who: 'Air temperature is', up: 'rises', down: 'falls', neg: true, m: [5.5, 6, 6.2, 6.5, 7], b: [12, 15, 16, 18, 20, 22], start: function (v) { return 'the temperature is ' + v + ' at sea level (an altitude of 0 km).'; } },
    savings: { Y: 'S', X: 'w', what: 'the savings balance', yu: 'dollars', ya: '$', money: true, each: 'week', xs: 'weeks', xa: 'week', who: 'A savings balance is', up: 'increases', down: 'decreases', m: [15, 20, 25, 30, 40, 45, 50], b: [100, 150, 200, 250, 300, 380, 400], start: function (v) { return v + ' was already saved before any weeks of saving (the starting balance).'; } },
    phone: { Y: 'C', X: 'n', what: 'the monthly bill', yu: 'dollars', ya: '$', money: true, each: 'long-distance minute used', xs: 'minutes', xa: 'min', who: 'A phone plan costs', up: 'increases', down: 'decreases', m: [0.05, 0.08, 0.09, 0.1, 0.12, 0.15], b: [20, 25, 30, 35, 38, 40], start: function (v) { return 'the plan costs ' + v + ' a month even if no long-distance minutes are used.'; } },
    taxi: { Y: 'F', X: 'k', what: 'the fare', yu: 'dollars', ya: '$', money: true, each: 'kilometre travelled', xs: 'kilometres', xa: 'km', who: 'A taxi fare is', up: 'increases', down: 'decreases', m: [1.25, 1.5, 1.75, 1.85, 2, 2.25], b: [2.5, 3, 3.6, 4, 4.5], start: function (v) { return 'a base fare of ' + v + ' is charged before the taxi moves.'; } },
    courier: { Y: 'C', X: 'p', what: 'the charge', yu: 'dollars', ya: '$', money: true, each: 'parcel delivered', xs: 'parcels', xa: 'parcel', who: 'A courier charges', up: 'increases', down: 'decreases', m: [2.25, 2.5, 2.75, 3, 3.5], b: [6.5, 8, 9.5, 10, 12], start: function (v) { return 'a base charge of ' + v + ' is made before any parcels are delivered.'; } },
    snow: { Y: 'D', X: 'h', what: 'the snow depth', yu: 'cm', ya: 'cm', each: 'hour of the storm', xs: 'hours', xa: 'h', who: 'Snow depth is', up: 'increases', down: 'decreases', m: [1.2, 1.4, 1.5, 2, 2.5, 3], b: [8, 10, 12, 15, 20], start: function (v) { return v + ' of snow was already on the ground when the storm began.'; } },
    tree: { Y: 'H', X: 't', what: 'the tree’s height', yu: 'cm', ya: 'cm', each: 'year', xs: 'years', xa: 'year', who: 'A tree’s height is', up: 'increases', down: 'decreases', m: [15, 20, 25, 30, 40], b: [50, 80, 100, 120, 150, 180], start: function (v) { return 'the tree was ' + v + ' tall when it was planted.'; } },
    plumber: { Y: 'C', X: 'h', what: 'the cost', yu: 'dollars', ya: '$', money: true, each: 'hour of work', xs: 'hours', xa: 'h', who: 'A plumber charges', up: 'increases', down: 'decreases', m: [40, 45, 50, 55, 60, 65], b: [50, 60, 70, 75, 80, 90], start: function (v) { return 'a call-out fee of ' + v + ' is charged even for 0 hours of work.'; } }
  };
  /* the definition sentence: "where d is in km and t is in hours" */
  var DEF_X = { t: 'time', m: 'minutes burning', c: 'number of coffees bought', a: 'altitude', w: 'number of weeks', n: 'number of minutes', k: 'distance travelled', p: 'number of parcels delivered', h: 'number of hours' };
  function defS(M) {
    var yu = M.money ? 'dollars' : M.yu;
    var xPart = M.X === 'c' || M.X === 'p' || M.X === 'w' || (M.X === 'n' && M.money) ? t(M.X) + ' is the ' + DEF_X[M.X] : t(M.X) + ' is in ' + (M.X === 'a' ? 'kilometres above sea level' : M.xs);
    return ', where ' + t(M.Y) + ' is in ' + yu + ' and ' + xPart;
  }
  function vT(M, v) { return M.money ? $(v) : t(nf(v)) + ' ' + M.yu; }
  function modelT(M, m, b) { return t(eqTex(M.Y, M.X, m, b, M.money ? 'money' : false)); }
  function pickModel(r, keys) { var M = MODELS[r.pick(keys)], m = r.pick(M.m), b = r.pick(M.b); return { M: M, m: M.neg ? -m : m, b: b }; }
  /* slope sentences */
  function rateS(M, m, o) {
    o = o || {}; var a = Math.abs(m), up = o.flipSign ? m < 0 : m > 0;
    if (o.flipUnits) return cap(M.what) + ' ' + (up ? M.up : M.down) + ' by ' + t(nf(a)) + ' ' + M.xs + ' for every ' + (M.money ? 'dollar' : M.yu) + '.';
    return cap(M.what) + ' ' + (up ? M.up : M.down) + ' by ' + vT(M, a) + ' for every ' + M.each + '.';
  }
  function slopeMC(r, prompt, M, m, b, sol, text) {
    var opts = [{ html: rateS(M, m), right: true },
      { html: rateS(M, m, { flipUnits: true }), why: 'The units are upside down. A slope is (units of ' + t(M.Y) + ') <b>per</b> (unit of ' + t(M.X) + '): ' + (M.money ? 'dollars' : M.yu) + ' per ' + M.each.split(' ')[0] + '.' },
      { html: rateS(M, m, { flipSign: true }), why: 'Look at the sign of the slope: ' + t(nf(m)) + ' is ' + (m > 0 ? 'positive, so ' + M.what + ' goes <b>up</b>.' : 'negative, so ' + M.what + ' goes <b>down</b>.') }];
    if (!same(b, 0) && M.start) opts.push({ html: cap(M.start(vT(M, Math.abs(m)))), why: 'That describes a starting value. The slope is a <b>rate</b>: how much ' + M.what + ' changes for every ' + M.each + '.' });
    else opts.push({ html: cap(M.what) + ' is ' + vT(M, Math.abs(m)) + ' in total.', why: 'The slope isn’t a total — it is a rate: the change in ' + M.what + ' for <b>each</b> ' + M.each + '.' });
    return mc(r, prompt, opts, sol, ['The slope is the number multiplying ' + t(M.X) + '. Its units are (units of ' + t(M.Y) + ') per (unit of ' + t(M.X) + '), and its sign says rising or falling.'], text);
  }
  function slopeSol(M, m) { return 'The slope is the number multiplying ' + t(M.X) + ': ' + t('m=' + nf(m)) + ' ' + (M.money ? 'dollars' : M.yu) + ' per ' + M.each.split(' ')[0] + '.<br>' + rateS(M, m) + (m < 0 ? ' (Negative: decreasing.)' : ' (Positive: increasing.)'); }
  function interMC(r, prompt, M, m, b, sol, text) {
    var bt = vT(M, b);
    return mc(r, prompt, [
      { html: cap(M.start(bt)), right: true },
      { html: cap(M.what) + ' ' + (m > 0 ? M.up : M.down) + ' by ' + bt + ' for every ' + M.each + '.', why: 'That would make ' + t(nf(b)) + ' a rate. The rate is the number multiplying ' + t(M.X) + '; the constant ' + t(nf(b)) + ' is the value when ' + t(M.X + '=0') + '.' },
      { html: cap(M.what) + ' is ' + bt + ' after one ' + M.each.split(' ')[0] + '.', why: 'After one ' + M.each.split(' ')[0] + ' the value is ' + t(nf(m) + '(1)+' + nf(b) + '=' + nf(m + b)) + '. The intercept is the value at ' + t(M.X + '=0') + ', before anything has happened.' },
      { html: cap(M.what) + ' changes at ' + t(nf(b)) + ' ' + (M.money ? 'dollars' : M.yu) + ' per ' + M.each.split(' ')[0] + '.', why: 'An intercept never carries a “per” unit — it is an amount, the value of ' + t(M.Y) + ' when ' + t(M.X + '=0') + '.' }],
      sol, ['The ' + t(M.Y) + '-intercept is the value of ' + t(M.Y) + ' when ' + t(M.X + '=0') + ' — the amount before anything has happened.'], text);
  }
  function interSol(M, m, b) { return 'The ' + t(M.Y) + '-intercept is the constant term: ' + t('b=' + nf(b)) + (M.money ? ' dollars' : ' ' + M.yu) + '. It is the value when ' + t(M.X + '=0') + ': ' + M.start(vT(M, b)); }

  /* units of a slope from the axes */
  var VERT = { vol: [['volume', 'L', 'litres'], ['volume', 'mL', 'millilitres'], ['height', 'cm', 'centimetres'], ['depth', 'm', 'metres'], ['mass', 'kg', 'kilograms'], ['water level', 'mm', 'millimetres']],
    cost: [['cost', '$', 'dollars'], ['earnings', '$', 'dollars'], ['price', '$', 'dollars'], ['fuel cost', '$', 'dollars'], ['revenue', '$', 'dollars']],
    dist: [['distance', 'm', 'metres'], ['distance', 'km', 'kilometres'], ['height', 'm', 'metres'], ['altitude', 'm', 'metres'], ['height', 'cm', 'centimetres'], ['depth', 'm', 'metres']],
    time: [['time', 'min', 'minutes'], ['time', 's', 'seconds'], ['time', 'h', 'hours'], ['time', 'days', 'days']],
    temp: [['temperature', '°C', 'degrees Celsius']] };
  var HORZ = { time: [['time', 's', 'seconds'], ['time', 'min', 'minutes'], ['time', 'h', 'hours'], ['time', 'days', 'days']],
    amount: [['mass', 'kg', 'kilograms'], ['distance', 'km', 'kilometres'], ['volume', 'L', 'litres'], ['number of items', 'items', 'items'], ['length', 'm', 'metres']],
    dist: [['distance', 'km', 'kilometres'], ['distance', 'm', 'metres'], ['number of laps', 'laps', 'laps'], ['volume', 'L', 'litres'], ['number of pages', 'pages', 'pages'], ['mass', 'kg', 'kilograms']] };
  function sing(u) { return { items: 'item', laps: 'lap', days: 'day', pages: 'page', '$': '$' }[u] || u; }
  function per(a, b) { return a + ' per ' + sing(b); }
  function unitsMC(r, prompt, v, h, sol, text) {
    var V = v[1], H = h[1];
    return mc(r, prompt, [
      { html: per(V, H), right: true },
      { html: per(H, V), why: 'Upside down: the slope is rise over run — the <b>vertical</b> unit per the <b>horizontal</b> unit.' },
      { html: V, why: 'A slope is a rate, so it needs two units: (vertical unit) <b>per</b> (horizontal unit).' },
      { html: H, why: 'A slope is a rate, so it needs two units: (vertical unit) <b>per</b> (horizontal unit).' }],
      sol, ['Slope = rise ÷ run = (change in the vertical quantity) ÷ (change in the horizontal quantity).'], text);
  }
  function axesPick(r, vk, hk) { return gen(r, function (r) { var v = r.pick(VERT[vk]), h = r.pick(HORZ[hk]); return v[1] === h[1] ? null : { v: v, h: h }; }); }

  /* ================================================================================================= */
  HW.addCodes({
    'ctx-rate-sign': 'Rate sign doesn’t match the situation', 'ctx-flip': 'Rate units upside down', 'ctx-total': 'Gave the total change, not the rate', 'ctx-reading': 'Used a reading instead of the change',
    'ctx-b-point': 'Used a data point’s value as the intercept', 'ctx-b-sign': 'Sign slip finding the intercept', 'ctx-tint-b': 'Gave the starting value instead of the time', 'ctx-start-point': 'Gave a later value as the start',
    'ctx-no-b': 'Left out the intercept', 'ctx-add-b': 'Added the intercept instead of subtracting', 'ctx-no-sub': 'Didn’t subtract the starting amount before dividing', 'ctx-step': 'Didn’t divide by the step in x',
    'ctx-convert': 'Unit conversion the wrong way', 'ctx-noconv': 'Didn’t convert units', 'ctx-squares': 'Counted grid squares', 'ctx-swap-boxes': 'Two answers in each other’s boxes', 'ctx-change': 'Gave the change instead of the value', 'ctx-part': 'Stopped after one step',
    'u7l9-swap': 'Swapped the rate and the starting value', 'u7l9-add-mb': 'Added the fee to the rate', 'u7l9-eval': 'Substituted the total for the input', 'u7l9-cheaper': 'Picked the more expensive option',
    'u7l9-letter': 'Answer not given as a letter', 'u7l9-breakeven-cost': 'Gave the cost at break-even, not the input', 'u7l9-60': 'Used 100 minutes in an hour', 'u7l9-mm': 'cm/mm conversion slip', 'u7l9-from-now': 'Counted time from the second reading'
  });
  HW.addPartial({ 'u7l9-swap': 'n', 'u7l9-add-mb': 'n', 'u7l9-eval': 'n', 'u7l9-cheaper': 'n', 'u7l9-breakeven-cost': 'b', 'u7l9-60': 's', 'u7l9-mm': 's', 'u7l9-from-now': 'b' });

  /* ---------------- shared generators ---------------- */
  /* fee + rate per item, the cost of n items and the number of items for a total */
  function feeShared(opt) {
    return function (r) {
      var bk = r.chance(0.25);
      if (bk) return { fee: opt.bk[0], rate: opt.bk[1], n1: opt.bk[2], total: opt.bk[3], n2: (opt.bk[3] - opt.bk[0]) / opt.bk[1] };
      return gen(r, function (r) {
        var fee = r.pick(opt.fee), rate = r.pick(opt.rate), n1 = r.pick(opt.n1), n2 = r.pick(opt.n2);
        if (n1 === n2) return null;
        var total = cl(fee + rate * n2);
        return { fee: fee, rate: rate, n1: n1, total: total, n2: n2 };
      });
    };
  }
  /* ---------------- question builders shared by several questions ---------------- */
  function feeQuestion(qn, section, ctx, sh0, lv) {
    return { num: qn, section: section, shared: sh0, stem: function (sh) { return ctx.stem(sh); },
      parts: [
        { id: qn + 'a', level: lv[0], outcome: 'RF4', make: function (r, sh) {
          return line('(a) Write an equation for ' + ctx.ask + '.', sh.rate, sh.fee, { X: ctx.X, Y: ctx.Y },
            'The rate (' + $(sh.rate) + ' per ' + ctx.unit + ') multiplies ' + t(ctx.X) + '; the flat fee ' + $(sh.fee) + ' is added once:<br>' + t(eqTex(ctx.Y, ctx.X, sh.rate, sh.fee)),
            ['The “per” amount is the slope; the flat fee is the starting value: ' + t(ctx.Y + '=(\\text{rate})' + ctx.X + '+(\\text{fee})') + '.'], ctx.text + ' equation');
        } },
        { id: qn + 'b', level: lv[1], outcome: 'RF4', make: function (r, sh) {
          var v = cl(sh.rate * sh.n1 + sh.fee);
          return num(ctx.askB(sh), v, [
            { v: sh.rate * sh.n1, code: 'ctx-no-b', hint: 'Don’t forget the flat fee: add ' + $(sh.fee) + '.' },
            { v: sh.fee * sh.n1 + sh.rate, code: 'u7l9-swap', hint: 'The rate ' + $(sh.rate) + ' is the amount for <b>each</b> ' + ctx.unit + ', so it is the number multiplied by ' + t(nf(sh.n1)) + '.' },
            { v: (sh.rate + sh.fee) * sh.n1, code: 'u7l9-add-mb', hint: 'The flat fee is charged once, not once per ' + ctx.unit + '.' }],
            t(ctx.Y + '=' + nf(sh.rate) + '(' + nf(sh.n1) + ')+' + nf(sh.fee) + '=' + nf(sh.rate * sh.n1) + '+' + nf(sh.fee) + '=' + nf(v)) + ', so ' + $(v) + '.',
            ['Substitute ' + t(ctx.X + '=' + nf(sh.n1)) + ' into your equation.'], ctx.text + ' evaluate', { money: true });
        } },
        { id: qn + 'c', level: lv[2], outcome: 'RF4', make: function (r, sh) {
          return num(ctx.askC(sh), sh.n2, [
            { v: sh.total / sh.rate, code: 'ctx-no-sub', hint: 'First take off the flat fee: ' + t(nf(sh.total) + '-' + nf(sh.fee)) + '. Then divide by the rate.' },
            { v: (sh.total + sh.fee) / sh.rate, code: 'ctx-add-b', hint: 'Subtract the fee from both sides — don’t add it.' },
            { v: sh.rate * sh.total + sh.fee, code: 'u7l9-eval', hint: t(nf(sh.total)) + ' is the <b>total</b> (' + t(ctx.Y) + '), not ' + t(ctx.X) + '. Set ' + t(ctx.Y + '=' + nf(sh.total)) + ' and solve for ' + t(ctx.X) + '.' },
            { v: sh.total - sh.fee, code: 'ctx-part', hint: 'That’s the amount after the fee. Now divide by ' + $(sh.rate) + ' per ' + ctx.unit + '.' }],
            t(nf(sh.total) + '=' + nf(sh.rate) + ctx.X + '+' + nf(sh.fee) + '\\Rightarrow ' + nf(sh.rate) + ctx.X + '=' + nf(sh.total - sh.fee) + '\\Rightarrow ' + ctx.X + '=' + nf(sh.n2)),
            ['Set ' + t(ctx.Y + '=' + nf(sh.total)) + ', subtract the fee, then divide by the rate.'], ctx.text + ' solve', { after: ctx.unitsC });
        } }] };
  }

  /* ================================================================================================= */
  var LESSON = {
    id: 'u7l9', unit: 7, num: 9, title: 'Slope in Context: Interpreting Rates of Change', outcome: 'RF3',
    blurb: 'The slope as a rate with units, the y-intercept as a starting value, writing and using a real-world equation, and comparing two situations (break-even).',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A — Interpreting Slope and y-Intercept', shared: function (r) { return r.chance(0.25) ? { M: MODELS.cyclist, m: 18, b: 0 } : pickModel(r, ['cyclist', 'hiker', 'train', 'printer']); },
        stem: function (sh) { return sh.M.who + ' ' + (sh.M.who.slice(-3) === 'are' || /costs|holds|is$/.test(sh.M.who) ? '' : 'is ') + modelT(sh.M, sh.m, sh.b) + defS(sh.M) + '. State the slope and explain what it means, including units.'; },
        parts: [
          { id: '1a', sub: 'slope', level: 'BEG', outcome: 'RF3', make: function (r, sh) {
            return num('State the slope.', sh.m, [{ v: -sh.m, code: 'ctx-rate-sign', hint: 'The slope is positive here: ' + t(sh.M.Y) + ' increases as ' + t(sh.M.X) + ' increases.' }],
              slopeSol(sh.M, sh.m), ['In ' + t(sh.M.Y + '=m' + sh.M.X + '+b') + ', the slope is the number multiplying ' + t(sh.M.X) + '.'], 'slope of model', { before: t('m='), after: sh.M.ya + '/' + sh.M.xa });
          } },
          { id: '1b', sub: 'meaning', level: 'BEG', outcome: 'RF3', make: function (r, sh) { return slopeMC(r, 'What does the slope mean?', sh.M, sh.m, sh.b, slopeSol(sh.M, sh.m), 'meaning of slope'); } }] },
      { num: '2', shared: function (r) { return r.chance(0.25) ? { M: MODELS.bucket, m: -50, b: 800 } : pickModel(r, ['bucket', 'tank', 'coffee']); },
        stem: function (sh) { return sh.M.who + ' ' + modelT(sh.M, sh.m, sh.b) + defS(sh.M) + '. State the slope and explain what it means, including units. Is the amount increasing or decreasing?'; },
        parts: [
          { id: '2a', sub: 'slope', level: 'BEG', outcome: 'RF3', make: function (r, sh) {
            return num('State the slope.', sh.m, [{ v: -sh.m, code: 'ctx-rate-sign', hint: 'Keep the sign: the number multiplying ' + t(sh.M.X) + ' is ' + t(nf(sh.m)) + '.' }, { v: sh.b, code: 'u7l9-swap', hint: 'That is the constant term (the starting amount). The slope is the number multiplying ' + t(sh.M.X) + '.' }],
              slopeSol(sh.M, sh.m), ['The slope is the number multiplying ' + t(sh.M.X) + ', with its sign.'], 'negative slope of model', { before: t('m='), after: sh.M.ya + '/' + sh.M.xa });
          } },
          { id: '2b', sub: 'meaning', level: 'BEG', outcome: 'RF3', make: function (r, sh) { return slopeMC(r, 'What does the slope mean?', sh.M, sh.m, sh.b, slopeSol(sh.M, sh.m), 'meaning of negative slope'); } }] },
      { num: '3', shared: function (r) { return r.chance(0.25) ? { M: MODELS.candle, m: -0.3, b: 18 } : pickModel(r, ['candle', 'tank', 'temp', 'coffee']); },
        stem: function (sh) { return sh.M.who + ' ' + modelT(sh.M, sh.m, sh.b) + defS(sh.M) + '. What is the ' + t(sh.M.Y) + '-intercept, and what does it represent?'; },
        parts: [
          { id: '3a', sub: 'value', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
            return num('State the ' + t(sh.M.Y) + '-intercept.', sh.b, [{ v: sh.m, code: 'u7l9-swap', hint: 'That is the slope (the rate). The intercept is the constant term, the value when ' + t(sh.M.X + '=0') + '.' }, { v: -sh.b, code: 'value', hint: 'Check the sign: the constant term is ' + t('+' + nf(sh.b)) + '.' }],
              interSol(sh.M, sh.m, sh.b), ['The intercept is the value of ' + t(sh.M.Y) + ' when ' + t(sh.M.X + '=0') + ': the constant term.'], 'intercept of model', { before: t('b='), after: sh.M.money ? 'dollars' : sh.M.ya });
          } },
          { id: '3b', sub: 'meaning', level: 'BEG', outcome: 'RF4', make: function (r, sh) { return interMC(r, 'What does the ' + t(sh.M.Y) + '-intercept represent?', sh.M, sh.m, sh.b, interSol(sh.M, sh.m, sh.b), 'meaning of intercept'); } }] },
      { num: '4', shared: function (r) { return r.chance(0.25) ? { M: MODELS.savings, m: 25, b: 200 } : pickModel(r, ['savings', 'tree', 'pool', 'snow', 'plumber']); },
        stem: function (sh) { return sh.M.who + ' ' + modelT(sh.M, sh.m, sh.b) + defS(sh.M) + '. What is the ' + t(sh.M.Y) + '-intercept, and what does it represent?'; },
        parts: [
          { id: '4a', sub: 'value', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
            return num('State the ' + t(sh.M.Y) + '-intercept.', sh.b, [{ v: sh.m, code: 'u7l9-swap', hint: 'That is the slope (the rate). The intercept is the constant term, the value when ' + t(sh.M.X + '=0') + '.' }],
              interSol(sh.M, sh.m, sh.b), ['The intercept is the value of ' + t(sh.M.Y) + ' when ' + t(sh.M.X + '=0') + '.'], 'intercept of model', { before: t('b='), after: sh.M.money ? 'dollars' : sh.M.ya });
          } },
          { id: '4b', sub: 'meaning', level: 'BEG', outcome: 'RF4', make: function (r, sh) { return interMC(r, 'What does the ' + t(sh.M.Y) + '-intercept represent?', sh.M, sh.m, sh.b, interSol(sh.M, sh.m, sh.b), 'meaning of intercept'); } }] },
      /* ---------------- Part B ---------------- */
      feeQuestion('5', 'Part B — Writing and Using Equations', { X: 'n', Y: 'C', unit: 'dog', unitsC: 'dogs', text: 'dog walker', ask: 'the total charge ' + t('C') + ' in terms of the number of dogs walked, ' + t('n'),
        stem: function (sh) { return 'A dog walker charges a ' + $(sh.fee) + ' flat fee plus ' + $(sh.rate) + ' per dog walked.'; },
        askB: function (sh) { return '(b) Determine the charge for walking ' + t(sh.n1) + ' dogs.'; }, askC: function (sh) { return '(c) If a customer paid ' + $(sh.total) + ', how many dogs were walked?'; } },
        feeShared({ bk: [10, 4, 6, 42], fee: [5, 8, 10, 12, 15], rate: [3, 4, 5, 6, 7], n1: steps(3, 9), n2: steps(3, 10) }), ['BEG', 'BEG', 'PRG']),
      feeQuestion('6', null, { X: 'h', Y: 'C', unit: 'hour', unitsC: 'hours', text: 'moving company', ask: 'the total cost ' + t('C') + ' in terms of the number of hours, ' + t('h'),
        stem: function (sh) { return 'A moving company charges a ' + $(sh.fee) + ' flat fee plus ' + $(sh.rate) + ' per hour.'; },
        askB: function (sh) { return '(b) Find the cost of a ' + t(sh.n1) + '-hour move.'; }, askC: function (sh) { return '(c) If a move cost ' + $(sh.total) + ', how many hours did it take?'; } },
        feeShared({ bk: [75, 40, 3, 315], fee: [50, 60, 75, 80, 100], rate: [30, 40, 45, 50, 60], n1: [2, 3, 4, 5], n2: [3, 4, 5, 6, 7, 8] }), ['BEG', 'BEG', 'PRG']),
      { num: '7', shared: function (r) {
          if (r.chance(0.25)) return { V0: 900, rate: 30, t1: 12, T: 30 };
          return gen(r, function (r) { var rate = r.pick([10, 15, 20, 25, 30, 40, 50]), T = r.pick(steps(12, 40)), V0 = rate * T; if (V0 < 300 || V0 > 1500 || V0 % 50) return null; var t1 = r.pick(steps(2, T - 2)); return { V0: V0, rate: rate, t1: t1, T: T }; });
        },
        stem: function (sh) { return 'A water tank starts with ' + t(nf(sh.V0)) + ' L of water and drains at a constant rate of ' + t(sh.rate) + ' L per minute.'; },
        parts: [
          { id: '7a', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
            return line('(a) Write an equation for the volume ' + t('V') + ' remaining after ' + t('t') + ' minutes.', -sh.rate, sh.V0, { X: 't', Y: 'V' },
              'The tank <b>loses</b> ' + t(sh.rate) + ' L each minute, so the slope is ' + t(-sh.rate) + '; it starts with ' + t(nf(sh.V0)) + ' L:<br>' + t(eqTex('V', 't', -sh.rate, sh.V0)),
              ['Draining means the volume goes down, so the rate is negative.', 'Starting amount: ' + t(nf(sh.V0)) + ' L.'], 'draining tank equation');
          } },
          { id: '7b', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
            var v = sh.V0 - sh.rate * sh.t1;
            return num('(b) How much water remains after ' + t(sh.t1) + ' minutes?', v, [
              { v: sh.V0 + sh.rate * sh.t1, code: 'ctx-rate-sign', hint: 'The tank is draining, so the volume goes <b>down</b>: subtract ' + t(sh.rate + '\\times ' + sh.t1) + '.' },
              { v: sh.rate * sh.t1, code: 'ctx-change', hint: 'That’s the water that has drained out. How much is <b>left</b>?' }],
              t('V=-' + sh.rate + '(' + sh.t1 + ')+' + nf(sh.V0) + '=' + nf(-sh.rate * sh.t1) + '+' + nf(sh.V0) + '=' + nf(v)) + ' L', ['Substitute ' + t('t=' + sh.t1) + ' into your equation.'], 'tank volume after t', { after: 'L' });
          } },
          { id: '7c', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
            return num('(c) How long until the tank is empty?', sh.T, [
              { v: sh.V0, code: 'ctx-tint-b', hint: 'That’s the starting volume. Empty means ' + t('V=0') + ': solve ' + t('0=-' + sh.rate + 't+' + nf(sh.V0)) + '.' },
              { v: -sh.T, code: 'ctx-rate-sign', hint: 'Time can’t be negative — check the signs when you solve.' },
              { v: sh.V0 * sh.rate, code: 'ctx-convert', hint: 'Divide, don’t multiply: ' + t(sh.rate + 't=' + nf(sh.V0)) + '.' }],
              'Empty means ' + t('V=0') + ': ' + t('0=-' + sh.rate + 't+' + nf(sh.V0) + '\\Rightarrow ' + sh.rate + 't=' + nf(sh.V0) + '\\Rightarrow t=' + sh.T) + ' minutes.',
              ['The tank is empty when ' + t('V=0') + '.'], 'time to empty', { after: 'min' });
          } }] },
      { num: '8', shared: function (r) {
          if (r.chance(0.25)) return { fee: 20, rate: 0.05, n1: 150, total: 31.5, n2: 230 };
          return gen(r, function (r) {
            var rate = r.pick([0.05, 0.1, 0.02, 0.25]), fee = r.pick([15, 18, 20, 22, 25, 30]);
            var n1 = rate === 0.25 ? r.pick(steps(12, 40, 4)) : rate === 0.02 ? r.pick(steps(100, 400, 50)) : r.pick(steps(60, 300, 10)), n2 = rate === 0.25 ? r.pick(steps(10, 60, 2)) : rate === 0.02 ? r.pick(steps(150, 500, 50)) : r.pick(steps(70, 400, 10));
            if (n1 === n2) return null;
            return { fee: fee, rate: rate, n1: n1, total: cl(fee + rate * n2), n2: n2 };
          });
        },
        stem: function (sh) { return 'A phone plan costs ' + $(sh.fee) + ' per month plus ' + $(sh.rate) + ' per text message sent.'; },
        parts: [
          { id: '8a', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
            return line('(a) Write an equation for the monthly cost ' + t('C') + ' in terms of the number of texts, ' + t('n') + '.', sh.rate, sh.fee, { X: 'n', Y: 'C' },
              'Each text adds ' + $(sh.rate) + ' (the slope) and the monthly charge is ' + $(sh.fee) + ' no matter what (the intercept):<br>' + t(eqTex('C', 'n', sh.rate, sh.fee)),
              ['The cost per text is the rate; the monthly charge is the starting value.'], 'phone plan equation');
          } },
          { id: '8b', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
            var v = cl(sh.rate * sh.n1 + sh.fee);
            return num('(b) Find the cost in a month with ' + t(sh.n1) + ' texts sent.', v, [
              { v: sh.rate * sh.n1, code: 'ctx-no-b', hint: 'Add the monthly charge of ' + $(sh.fee) + ' too.' },
              { v: sh.fee * sh.n1 + sh.rate, code: 'u7l9-swap', hint: 'Multiply the number of texts by the cost per text, ' + $(sh.rate) + '.' },
              { v: sh.rate * 10 * sh.n1 + sh.fee, code: 'value', hint: 'Check the multiplication: ' + t(nf(sh.rate) + '\\times ' + sh.n1 + '=' + nf(sh.rate * sh.n1)) + '.' }],
              t('C=' + nf(sh.rate) + '(' + sh.n1 + ')+' + nf(sh.fee) + '=' + nf(sh.rate * sh.n1) + '+' + nf(sh.fee) + '=' + nf(v)) + ', so ' + $(v) + '.',
              ['Substitute ' + t('n=' + sh.n1) + '. Multiplying by ' + t(nf(sh.rate)) + ' is the same as ' + (sh.rate === 0.05 ? 'dividing by 20' : sh.rate === 0.1 ? 'dividing by 10' : sh.rate === 0.02 ? 'dividing by 50' : 'dividing by 4') + '.'], 'phone plan evaluate', { money: true });
          } },
          { id: '8c', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
            return num('(c) One month the bill was ' + $(sh.total) + '. How many texts were sent?', sh.n2, [
              { v: sh.total / sh.rate, code: 'ctx-no-sub', hint: 'First subtract the monthly charge: ' + t(nf(sh.total) + '-' + nf(sh.fee)) + '.' },
              { v: (sh.total - sh.fee) * sh.rate, code: 'ctx-convert', hint: 'Divide by the cost per text — don’t multiply.' },
              { v: sh.total - sh.fee, code: 'ctx-part', hint: 'That’s the amount spent on texts. Divide it by ' + $(sh.rate) + ' per text.' }],
              t(nf(sh.total) + '=' + nf(sh.rate) + 'n+' + nf(sh.fee) + '\\Rightarrow ' + nf(sh.rate) + 'n=' + nf(sh.total - sh.fee) + '\\Rightarrow n=\\dfrac{' + nf(sh.total - sh.fee) + '}{' + nf(sh.rate) + '}=' + sh.n2) + ' texts.',
              ['Subtract the monthly charge, then divide by the cost per text.', 'Dividing by ' + t(nf(sh.rate)) + ' is the same as ' + (sh.rate === 0.05 ? 'multiplying by 20' : sh.rate === 0.1 ? 'multiplying by 10' : sh.rate === 0.02 ? 'multiplying by 50' : 'multiplying by 4') + '.'], 'phone plan solve', { after: 'texts' });
          } }] },
      /* ---------------- Part C ---------------- */
      { num: '9', section: 'Part C — Comparing Two Situations', shared: function (r) {
          if (r.chance(0.25)) return { a0: 3, ra: 1.5, b0: 6, rb: 1, ds: 6, d1: 10 };
          return gen(r, function (r) {
            var ra = r.pick([1.25, 1.5, 1.75, 2, 2.5]), diff = r.pick([0.25, 0.5, 1]), rb = cl(ra - diff), a0 = r.pick([2, 2.5, 3, 3.5, 4]), ds = r.pick([4, 6, 8, 10, 12]), b0 = cl(a0 + diff * ds);
            if (rb < 0.75 || !isI(b0 * 2)) return null;
            var d1 = r.pick(steps(5, 15).filter(function (x) { return x !== ds && Math.abs(x - ds) >= 2; }));
            return { a0: a0, ra: ra, b0: b0, rb: rb, ds: ds, d1: d1 };
          });
        },
        stem: function (sh) { return 'Two ride-share companies charge as follows: Company A charges ' + $(sh.a0) + ' plus ' + $(sh.ra) + ' per km; Company B charges ' + $(sh.b0) + ' plus ' + $(sh.rb) + ' per km. Let ' + t('C') + ' be the cost in dollars for a trip of ' + t('d') + ' km.'; },
        parts: [
          { id: '9a', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
            return lines2('(a) Write an equation for each company’s cost.', [{ label: 'Company A:', m: sh.ra, b: sh.a0, X: 'd', Y: 'C' }, { label: 'Company B:', m: sh.rb, b: sh.b0, X: 'd', Y: 'C' }],
              'A: rate ' + $(sh.ra) + '/km, start ' + $(sh.a0) + ': ' + t(eqTex('C', 'd', sh.ra, sh.a0)) + '<br>B: rate ' + $(sh.rb) + '/km, start ' + $(sh.b0) + ': ' + t(eqTex('C', 'd', sh.rb, sh.b0)),
              ['Each equation is ' + t('C=(\\text{rate per km})d+(\\text{starting charge})') + '.'], 'two ride-share equations');
          } },
          { id: '9b', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
            var A = cl(sh.ra * sh.d1 + sh.a0), Bv = cl(sh.rb * sh.d1 + sh.b0);
            var p = nums('(b) Determine the cost of a ' + t(sh.d1) + ' km trip with each company.', [
              { label: 'Company A:', ans: A, money: true, list: [{ v: Bv, code: 'ctx-swap-boxes', hint: 'That’s Company B’s cost.' }, { v: sh.ra * sh.d1, code: 'ctx-no-b', hint: 'Add Company A’s starting charge too.' }] },
              { label: 'Company B:', ans: Bv, money: true, list: [{ v: A, code: 'ctx-swap-boxes', hint: 'That’s Company A’s cost.' }, { v: sh.rb * sh.d1, code: 'ctx-no-b', hint: 'Add Company B’s starting charge too.' }] }],
              'A: ' + t(nf(sh.ra) + '(' + sh.d1 + ')+' + nf(sh.a0) + '=' + nf(A)) + ' → ' + $(A) + '<br>B: ' + t(nf(sh.rb) + '(' + sh.d1 + ')+' + nf(sh.b0) + '=' + nf(Bv)) + ' → ' + $(Bv),
              ['Substitute ' + t('d=' + sh.d1) + ' into each equation.'], 'costs of a trip');
            return p;
          } },
          { id: '9c', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
            var C = cl(sh.ra * sh.ds + sh.a0);
            return num('(c) Find the distance at which both companies charge the same amount.', sh.ds, [
              { v: C, code: 'u7l9-breakeven-cost', hint: 'That’s the cost at the break-even point. The question asks for the <b>distance</b> ' + t('d') + '.' },
              { v: (sh.b0 + sh.a0) / (sh.ra - sh.rb), code: 'ctx-add-b', hint: 'Collect the constants on one side: subtract ' + t(nf(sh.a0)) + ' from ' + t(nf(sh.b0)) + '.' },
              { v: (sh.b0 - sh.a0) / (sh.ra + sh.rb), code: 'value', hint: 'Collect the ' + t('d') + '-terms: ' + t(nf(sh.ra) + 'd-' + nf(sh.rb) + 'd=' + nf(sh.ra - sh.rb) + 'd') + '.' }],
              'Set the costs equal: ' + t(nf(sh.ra) + 'd+' + nf(sh.a0) + '=' + nf(sh.rb) + 'd+' + nf(sh.b0)) + '<br>' + t(nf(sh.ra - sh.rb) + 'd=' + nf(sh.b0 - sh.a0) + '\\Rightarrow d=' + sh.ds) + ' km. (Both cost ' + $(C) + '.)',
              ['Set the two expressions for ' + t('C') + ' equal and solve for ' + t('d') + '.'], 'break-even distance', { after: 'km' });
          } },
          { id: '9d', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
            return mc(r, '(d) Which company is cheaper for a trip shorter than ' + t(sh.ds) + ' km?', [
              { html: 'Company A — it has the smaller starting charge, and its higher rate per km hasn’t caught up yet.', right: true },
              { html: 'Company B — it has the smaller rate per km.', why: 'B’s smaller rate only pays off on long trips. For short trips the starting charge matters most, and A’s is smaller.' },
              { html: 'Company A — it has the larger rate per km.', why: 'A larger rate makes a trip cost <b>more</b>, not less. A wins short trips because of its smaller starting charge.' },
              { html: 'They cost the same for every trip shorter than ' + t(sh.ds) + ' km.', why: 'They cost the same only at exactly ' + t(sh.ds) + ' km. Try a short trip, e.g. ' + t('d=1') + ', in both equations.' }],
              'At ' + t('d=0') + ' A costs ' + $(sh.a0) + ' and B costs ' + $(sh.b0) + ', so A starts cheaper. A’s cost grows faster (' + $(sh.ra) + ' vs ' + $(sh.rb) + ' per km) and only catches B at ' + t(sh.ds) + ' km. So for shorter trips <b>A</b> is cheaper.',
              ['Compare the costs at a very short trip, e.g. ' + t('d=1') + '.'], 'cheaper before break-even');
          } }] },
      { num: '10', shared: function (r) {
          if (r.chance(0.25)) return { F: 50, a: 25, b: 35, ms: 5, m1: 3, m2: 12 };
          return gen(r, function (r) { var a = r.pick([20, 25, 30, 35, 40]), diff = r.pick([5, 10, 15]), ms = r.pick([3, 4, 5, 6, 8]), F = diff * ms; if (F > 120) return null; return { F: F, a: a, b: a + diff, ms: ms, m1: r.pick(steps(1, ms - 1)), m2: 12 }; });
        },
        stem: function (sh) { return 'Gym A charges a ' + $(sh.F) + ' sign-up fee plus ' + $(sh.a) + ' per month. Gym B charges no sign-up fee, but ' + $(sh.b) + ' per month.'; },
        parts: [
          { id: '10a', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
            return lines2('(a) Write an equation for the total cost ' + t('C') + ' at each gym after ' + t('t') + ' months.', [{ label: 'Gym A:', m: sh.a, b: sh.F, X: 't', Y: 'C' }, { label: 'Gym B:', m: sh.b, b: 0, X: 't', Y: 'C', wrong: [{ m: sh.b, b: sh.F, code: 'ctx-b-point', hint: 'Gym B has <b>no</b> sign-up fee, so its starting value is 0.' }] }],
              'A: ' + t(eqTex('C', 't', sh.a, sh.F)) + '<br>B: no fee, so ' + t('b=0') + ': ' + t(eqTex('C', 't', sh.b, 0)), ['The monthly price is the rate; the sign-up fee is the starting value (Gym B has none).'], 'two gym equations');
          } },
          { id: '10b', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
            return num('(b) Find the break-even number of months.', sh.ms, [
              { v: sh.a * sh.ms + sh.F, code: 'u7l9-breakeven-cost', hint: 'That’s the cost at break-even. The question asks for the number of <b>months</b>.' },
              { v: sh.F / sh.a, code: 'value', hint: 'Set the costs equal: ' + t(sh.a + 't+' + sh.F + '=' + sh.b + 't') + ', then collect the ' + t('t') + '-terms.' },
              { v: sh.F / (sh.a + sh.b), code: 'value', hint: 'Subtract ' + t(sh.a + 't') + ' from both sides: ' + t(sh.F + '=' + sh.b + 't-' + sh.a + 't') + '.' }],
              t(sh.a + 't+' + sh.F + '=' + sh.b + 't\\Rightarrow ' + sh.F + '=' + (sh.b - sh.a) + 't\\Rightarrow t=' + sh.ms) + ' months. (Both cost ' + $(sh.b * sh.ms) + '.)',
              ['Set the two costs equal and solve for ' + t('t') + '.'], 'break-even months', { after: 'months' });
          } },
          { id: '10c', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
            var A1 = sh.a * sh.m1 + sh.F, B1 = sh.b * sh.m1, A2 = sh.a * sh.m2 + sh.F, B2 = sh.b * sh.m2;
            var rows = [{ id: 'r1', html: 'For ' + t(sh.m1) + (sh.m1 === 1 ? ' month' : ' months') }, { id: 'r2', html: 'For a full year (' + t(12) + ' months)' }], cols = [{ id: 'A', html: 'Gym A' }, { id: 'B', html: 'Gym B' }];
            return B.grid('(c) Which gym is cheaper?', rows, cols, { r1: 'B', r2: 'A' }, {},
              t(sh.m1) + ' months: A ' + t('=' + sh.a + '(' + sh.m1 + ')+' + sh.F + '=' + A1) + ', B ' + t('=' + sh.b + '(' + sh.m1 + ')=' + B1) + ' → <b>Gym B</b>.<br>' + t('12') + ' months: A ' + t('=' + sh.a + '(12)+' + sh.F + '=' + A2) + ', B ' + t('=' + sh.b + '(12)=' + B2) + ' → <b>Gym A</b>.<br>Before the break-even point (' + t(sh.ms) + ' months) the gym with no fee is cheaper; after it, the gym with the smaller monthly price is.',
              ['Work out both costs for each length of time and compare.', 'Before the break-even point the gym with no fee wins; after it, the smaller monthly price wins.'], 'which gym cheaper');
          } }] },
      /* ---------------- Part D ---------------- */
      { num: '11', section: 'Part D — Multiple Choice and Numerical Response', shared: function (r) {
          var job = r.pick([['A plumber', 'hour of work', 'h'], ['An electrician', 'hour of work', 'h'], ['A tutor', 'hour of tutoring', 'h'], ['A mechanic', 'hour of work', 'h']]);
          return r.chance(0.25) ? { job: ['A plumber', 'hour of work', 'h'], m: 45, b: 60 } : { job: job, m: r.pick([35, 40, 45, 50, 55, 60]), b: r.pick([40, 50, 60, 75, 80, 90]) };
        },
        parts: [
          { id: '11', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
            var X = sh.job[2];
            return mc(r, sh.job[0] + ' charges ' + t('C=' + sh.m + X + '+' + sh.b) + ' (' + t('C') + ' in dollars, ' + t(X) + ' in hours). What does the value ' + t(sh.b) + ' represent?', [
              { html: 'a flat fee charged even for ' + t(0) + ' hours of work', right: true },
              { html: 'the hourly rate', why: 'The hourly rate is the number multiplying ' + t(X) + ': ' + $(sh.m) + ' per hour.' },
              { html: 'the total cost for one hour of work', why: 'One hour costs ' + t(sh.m + '(1)+' + sh.b + '=' + (sh.m + sh.b)) + '. The constant ' + t(sh.b) + ' is the cost when ' + t(X + '=0') + '.' },
              { html: 'the number of hours worked', why: 'The number of hours is the variable ' + t(X) + '. The constant is a dollar amount.' }],
              t(sh.b) + ' is the constant term, the value of ' + t('C') + ' when ' + t(X + '=0') + ': a flat fee charged even before any work is done.', ['The constant term is the cost when ' + t(X + '=0') + '.'], 'meaning of constant');
          } }] },
      { num: '12', shared: function (r) {
          var c = r.pick([['a parking lot', 'just to enter', 'each hour parked', 'h'], ['a bowling alley', 'for shoe rental', 'each game played', 'g'], ['a bike rental', 'as a booking fee', 'each hour of riding', 'h'], ['a car wash', 'to start the machine', 'each minute of washing', 't']]);
          return r.chance(0.25) ? { c: ['a parking lot', 'just to enter', 'each hour parked', 'h'], fee: 5, rate: 3 } : gen(r, function (r) { var f = r.pick([2, 3, 4, 5, 6, 8]), q = r.pick([2, 3, 4, 5, 6, 7]); return f === q ? null : { c: c, fee: f, rate: q }; });
        },
        parts: [
          { id: '12', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
            var X = sh.c[3];
            return mc(r, 'Which equation best models ' + sh.c[0] + ' charging ' + $(sh.fee) + ' ' + sh.c[1] + ', plus ' + $(sh.rate) + ' for ' + sh.c[2] + '?', [
              { html: t('C=' + sh.rate + X + '+' + sh.fee), right: true },
              { html: t('C=' + sh.fee + X + '+' + sh.rate), why: 'Swapped: the amount charged for <b>each</b> unit multiplies ' + t(X) + '; the one-time charge is added on.' },
              { html: t('C=' + (sh.fee + sh.rate) + X), why: 'The one-time charge isn’t paid again for every unit, so it isn’t multiplied by ' + t(X) + '.' },
              { html: t('C=' + sh.rate + X + '-' + sh.fee), why: 'The one-time charge adds to the cost, so it is ' + t('+' + sh.fee) + '.' }],
              'Rate ' + $(sh.rate) + ' per unit (the slope) and a one-time charge of ' + $(sh.fee) + ' (the intercept): ' + t('C=' + sh.rate + X + '+' + sh.fee) + '.', ['The “per” amount multiplies the variable; the one-time charge is the constant.'], 'pick the model');
          } }] },
      { num: '13', shared: function (r) { return r.chance(0.25) ? { v: ['temperature', '°C', 'degrees Celsius'], h: ['time', 'hours', 'hours'] } : axesPick(r, r.pick(['temp', 'vol', 'dist', 'cost']), 'time'); },
        parts: [
          { id: '13', level: 'BEG', outcome: 'RF3', make: function (r, sh) {
            return unitsMC(r, 'A graph shows ' + sh.v[0] + ' (' + sh.v[1] + ') on the vertical axis and ' + sh.h[0] + ' (' + sh.h[1] + ') on the horizontal axis. The slope of the line represents a rate measured in', sh.v, sh.h,
              'Slope = (change in ' + sh.v[0] + ') ÷ (change in ' + sh.h[0] + '), so its units are <b>' + per(sh.v[1], sh.h[1]) + '</b>.', 'units of slope from axes');
          } }] },
      { num: '14', shared: function (r) { return r.chance(0.25) ? { m: 4, b: 8, x: 5 } : { m: r.int(2, 9), b: r.pick([5, 6, 8, 10, 12, 15]), x: r.int(2, 9) }; },
        parts: [
          { id: '14', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
            var v = sh.m * sh.x + sh.b;
            return num('<i>(Numerical response)</i> Renting a bike costs ' + t('C=' + sh.m + 't+' + sh.b) + ', with ' + t('C') + ' in dollars and ' + t('t') + ' in hours. The cost of renting for ' + t(sh.x) + ' hours, in dollars, is ____.', v,
              [{ v: sh.m * sh.x, code: 'ctx-no-b', hint: 'Add the ' + t(sh.b) + ' as well.' }, { v: sh.b * sh.x + sh.m, code: 'u7l9-swap', hint: 'Substitute for ' + t('t') + ': it is multiplied by ' + t(sh.m) + '.' }],
              t('C=' + sh.m + '(' + sh.x + ')+' + sh.b + '=' + v), ['Substitute ' + t('t=' + sh.x) + '.'], 'NR evaluate', { nr: true });
          } }] },
      { num: '15', shared: function (r) { return r.chance(0.25) ? { m: 2.5, b: 6, n: 8 } : gen(r, function (r) { var m = r.pick([1.5, 2.5, 3.5, 1.25, 2, 3]), b = r.pick([4, 5, 6, 8, 10]), n = r.int(4, 12); return isI(m * n * 4) ? { m: m, b: b, n: n } : null; }); },
        parts: [
          { id: '15', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
            var C = cl(sh.m * sh.n + sh.b);
            return num('<i>(Numerical response)</i> A grocery delivery costs ' + t('C=' + fx(sh.m, 2) + 'n+' + sh.b) + ', where ' + t('n') + ' is the number of items. If a delivery cost ' + $(C) + ', the number of items delivered was ____.', sh.n,
              [{ v: C / sh.m, code: 'ctx-no-sub', hint: 'Subtract the ' + t(sh.b) + ' first, then divide.' }, { v: C - sh.b, code: 'ctx-part', hint: 'Now divide by ' + t(fx(sh.m, 2)) + '.' }],
              t(nf(C) + '=' + nf(sh.m) + 'n+' + sh.b + '\\Rightarrow ' + nf(sh.m) + 'n=' + nf(C - sh.b) + '\\Rightarrow n=' + sh.n), ['Set ' + t('C=' + nf(C)) + ', subtract ' + t(sh.b) + ', then divide by ' + t(nf(sh.m)) + '.'], 'NR solve', { nr: true });
          } }] },
      { num: '16', shared: function (r) {
          if (r.chance(0.25)) return { m1: 0.5, b1: 20, m2: 0.2, b2: 11, T: 30 };
          return gen(r, function (r) { var m1 = r.pick([0.4, 0.5, 0.6, 0.8]), m2 = r.pick([0.1, 0.2, 0.3]), T = r.pick([10, 15, 20, 25, 30, 40]), b2 = r.pick([8, 9, 10, 11, 12, 15]), b1 = cl(b2 + (m1 - m2) * T); if (m2 >= m1 || !isI(b1) || b1 - m1 * T <= 0 || b2 - m2 * T <= 0) return null; return { m1: m1, b1: b1, m2: m2, b2: b2, T: T }; });
        },
        parts: [
          { id: '16', level: 'ADV', outcome: 'RF4', make: function (r, sh) {
            return num('<i>(Numerical response)</i> Two candles have heights ' + t('H_1=-' + nf(sh.m1) + 't+' + sh.b1) + ' and ' + t('H_2=-' + nf(sh.m2) + 't+' + sh.b2) + ', with ' + t('t') + ' in minutes. The time ' + t('t') + ', in minutes, at which both candles are the same height is ____.', sh.T,
              [{ v: (sh.b1 + sh.b2) / (sh.m1 - sh.m2), code: 'ctx-add-b', hint: 'Subtract the constants: ' + t(sh.b1 + '-' + sh.b2) + '.' }, { v: (sh.b1 - sh.b2) / (sh.m1 + sh.m2), code: 'ctx-rate-sign', hint: 'Careful with the signs when you collect the ' + t('t') + '-terms: ' + t('-' + nf(sh.m2) + 't+' + nf(sh.m1) + 't=' + nf(sh.m1 - sh.m2) + 't') + '.' }, { v: sh.b1 - sh.m1 * sh.T, code: 'u7l9-breakeven-cost', hint: 'That’s the height. The question asks for the time.' }],
              t('-' + nf(sh.m1) + 't+' + sh.b1 + '=-' + nf(sh.m2) + 't+' + sh.b2) + '<br>' + t(sh.b1 + '-' + sh.b2 + '=' + nf(sh.m1) + 't-' + nf(sh.m2) + 't\\Rightarrow ' + (sh.b1 - sh.b2) + '=' + nf(sh.m1 - sh.m2) + 't\\Rightarrow t=' + sh.T) + ' minutes.',
              ['Set the two heights equal and solve for ' + t('t') + '.', 'Move the ' + t('t') + '-terms to one side and the numbers to the other.'], 'NR candles equal', { nr: true });
          } }] }
    ],
    extra: []
  };

  /* ================================================================================================= */
  /* Extra practice (u7_EP09.tex) */
  /* slope with its units, as one statement */
  function unitsOf(M) { return (M.money ? '$' : M.ya) + '/' + M.xa; }
  function slopeUnitsMC(r, prompt, M, m, b, text) {
    var a = Math.abs(m), u = unitsOf(M), uf = M.xa + '/' + (M.money ? '$' : M.ya), lead = function (v, uu) { return '<b>' + t('m=' + nf(v)) + ' ' + uu + '</b> — '; };
    return mc(r, prompt, [
      { html: lead(m, u) + rateS(M, m) , right: true },
      { html: lead(m, uf) + rateS(M, m, { flipUnits: true }), why: 'The units are upside down: a slope is (units of ' + t(M.Y) + ') per (unit of ' + t(M.X) + '), here ' + u + '.' },
      { html: lead(-m, u) + rateS(M, m, { flipSign: true }), why: 'Keep the sign of the number multiplying ' + t(M.X) + ': ' + t(nf(m)) + (m > 0 ? ' is positive, so ' + M.what + ' is rising.' : ' is negative, so ' + M.what + ' is falling.') },
      { html: lead(b, u) + cap(M.what) + ' ' + (m > 0 ? M.up : M.down) + ' by ' + vT(M, b) + ' for every ' + M.each + '.', why: t(nf(b)) + ' is the constant term (the starting value). The slope is the number multiplying ' + t(M.X) + '.' }],
      slopeSol(M, m) + ' Units: ' + u + '.', ['The slope is the number multiplying ' + t(M.X) + '; its units are (units of ' + t(M.Y) + ') per (unit of ' + t(M.X) + ').'], text);
  }
  function interUnitsMC(r, prompt, M, m, b, text, withSlope) {
    var bt = vT(M, b), sU = withSlope ? '; the slope is in ' + (M.money ? 'dollars' : M.yu) + ' per ' + M.each.split(' ')[0] : '', sF = withSlope ? '; the slope is in ' + M.xs + ' per ' + (M.money ? 'dollar' : M.yu) : '';
    return mc(r, prompt, [
      { html: '<b>' + bt + '</b> — ' + M.start(bt).replace(/\.$/, '') + sU + '.', right: true },
      { html: '<b>' + bt + ' per ' + M.each.split(' ')[0] + '</b> — ' + M.start(bt).replace(/\.$/, '') + sU + '.', why: 'An intercept never carries a “per” unit: it is an amount (the value when ' + t(M.X + '=0') + '), not a rate.' },
      { html: '<b>' + vT(M, Math.abs(m)) + '</b> — ' + M.start(vT(M, Math.abs(m))).replace(/\.$/, '') + sU + '.', why: t(nf(m)) + ' is the slope (it multiplies ' + t(M.X) + '). The intercept is the constant term.' },
      { html: '<b>' + bt + '</b> — ' + M.start(bt).replace(/\.$/, '') + (withSlope ? sF : '; it is the value after one ' + M.each.split(' ')[0]) + '.', why: withSlope ? 'The slope’s units are upside down: (units of ' + t(M.Y) + ') per (unit of ' + t(M.X) + ').' : 'After one ' + M.each.split(' ')[0] + ' the value is ' + t(nf(m + b)) + '. The intercept is the value at ' + t(M.X + '=0') + '.' }],
      interSol(M, m, b) + (withSlope ? ' The slope ' + t(nf(m)) + ' is in ' + (M.money ? 'dollars' : M.yu) + ' per ' + M.each.split(' ')[0] + '.' : ''), ['The intercept is the value of ' + t(M.Y) + ' when ' + t(M.X + '=0') + '. It has the units of ' + t(M.Y) + ' only — no “per”.'], text);
  }
  /* slope and intercept together (10C interpMC) */
  function bothMC(r, prompt, M, m, b, text) {
    var up = m > 0, bt = vT(M, b), at = vT(M, Math.abs(m));
    return mc(r, prompt, [
      { html: '<b>Slope:</b> ' + rateS(M, m) + ' <b>Intercept:</b> ' + cap(M.start(bt)), right: true },
      { html: '<b>Slope:</b> ' + rateS(M, m, { flipUnits: true }) + ' <b>Intercept:</b> ' + cap(M.start(bt)), why: 'The slope’s units are upside down: (units of ' + t(M.Y) + ') per (unit of ' + t(M.X) + ').' },
      { html: '<b>Slope:</b> ' + rateS(M, m, { flipSign: true }) + ' <b>Intercept:</b> ' + cap(M.start(bt)), why: 'Check the sign of the slope: ' + t(nf(m)) + ' is ' + (up ? 'positive, so the amount goes up.' : 'negative, so the amount goes down.') },
      { html: '<b>Slope:</b> ' + rateS(M, b) + ' <b>Intercept:</b> ' + cap(M.start(at)), why: 'Slope and intercept are swapped: the number multiplying the variable is the rate; the constant is the starting value.' }],
      slopeSol(M, m) + '<br>' + interSol(M, m, b), ['The slope is the rate (a “per” amount); the intercept is the value when the variable is 0.'], text);
  }
  function tableHtml(xs, ys, xn, yn) { return HW.valueTable([[xn].concat(xs.map(function (x) { return t(nf(x)); })), [yn].concat(ys.map(function (y) { return t(nf(y)); }))]); }
  var TEXTS = { Y: 'C', X: 'n', what: 'the monthly bill', yu: 'dollars', ya: '$', money: true, each: 'text sent', xs: 'texts', xa: 'text', up: 'increases', down: 'decreases', start: function (v) { return 'the bill is ' + v + ' in a month with no texts sent.'; } };
  var BALLOON = { Y: 'A', X: 't', what: 'the balloon’s altitude', yu: 'm', ya: 'm', each: 'minute', xs: 'minutes', xa: 'min', up: 'increases', down: 'decreases', start: function (v) { return 'the balloon was at ' + v + ' when the descent began (' + t('t=0') + ').'; } };

  var EXTRA = [
    /* ---------------- Part A ---------------- */
    { num: '1', section: 'Extra practice A — Reading the Model: Slope, Intercept, and Units', stem: 'For each model, state the slope, give its <b>units</b>, and say what it means in the situation (rising or falling).',
      shared: function (r) {
        var bk = r.chance(0.25);
        return { a: bk ? { M: MODELS.phone, m: 0.09, b: 38 } : pickModel(r, ['phone', 'plumber', 'courier', 'savings']), b: bk ? { M: MODELS.tank, m: -24, b: 960 } : pickModel(r, ['tank', 'bucket']),
          c: bk ? { M: MODELS.taxi, m: 1.85, b: 3.6 } : pickModel(r, ['taxi']), d: bk ? { M: MODELS.temp, m: -6.2, b: 18 } : pickModel(r, ['temp']) };
      },
      parts: ['a', 'b', 'c', 'd'].map(function (L) {
        return { id: 'e1' + L, level: 'BEG', outcome: 'RF3', make: function (r, sh) {
          var o = sh[L], M = o.M;
          return slopeUnitsMC(r, '(' + L + ') ' + M.who + ' ' + (/(is|holds|costs|charges)$/.test(M.who) ? '' : 'is ') + modelT(M, o.m, o.b) + defS(M) + '. Which statement is correct?', M, o.m, o.b, 'slope with units');
        } };
      }) },
    { num: '2', stem: 'For each model, state the vertical intercept <b>with its units</b> and what it represents. Remember that an intercept never carries a “per” unit.',
      shared: function (r) {
        var bk = r.chance(0.25);
        return { a: bk ? { M: MODELS.savings, m: 45, b: 380 } : pickModel(r, ['savings', 'tree', 'pool']), b: bk ? { M: MODELS.coffee, m: -3.25, b: 91 } : pickModel(r, ['coffee']),
          c: bk ? { M: MODELS.snow, m: 1.4, b: 12 } : pickModel(r, ['snow', 'candle']), d: bk ? { M: MODELS.courier, m: 2.75, b: 9.5 } : pickModel(r, ['courier', 'taxi', 'phone']) };
      },
      parts: ['a', 'b', 'c', 'd'].map(function (L) {
        return { id: 'e2' + L, level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var o = sh[L], M = o.M;
          return interUnitsMC(r, '(' + L + ') ' + M.who + ' ' + (/(is|holds|costs|charges)$/.test(M.who) ? '' : 'is ') + modelT(M, o.m, o.b) + defS(M) + '.' + (L === 'b' ? ' State the ' + t(M.Y) + '-intercept with its units and what it represents, and also the units of the slope.' : ' State the ' + t(M.Y) + '-intercept with its units and what it represents.'), M, o.m, o.b, 'intercept with units', L === 'b');
        } };
      }) },
    { num: '3', shared: function (r) {
        return gen(r, function (r) {
          var rate = r.pick([0.05, 0.1, 0.02, 0.04]), F = r.pick([18, 20.5, 22.5, 24.5, 25]);
          var n1 = rate === 0.04 ? r.pick(steps(50, 400, 25)) : rate === 0.02 ? r.pick(steps(100, 500, 50)) : r.pick(steps(60, 400, 20)), n2 = rate === 0.04 ? r.pick(steps(100, 600, 25)) : rate === 0.02 ? r.pick(steps(150, 600, 50)) : r.pick(steps(100, 500, 20));
          if (n1 === n2) return null;
          return { rate: rate, F: F, n1: n1, n2: n2, bill: cl(F + rate * n2) };
        });
      },
      stem: function (sh) { return 'A text-message plan costs ' + t(eqTex('C', 'n', sh.rate, sh.F, 'money')) + ', where ' + t('C') + ' is the monthly bill in dollars and ' + t('n') + ' is the number of texts sent.'; },
      parts: [
        { id: 'e3a', level: 'EMG', outcome: 'RF3', make: function (r, sh) { return bothMC(r, '(a) Interpret the slope and the ' + t('C') + '-intercept.', TEXTS, sh.rate, sh.F, 'interpret slope and intercept'); } },
        { id: 'e3b', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var C1 = cl(sh.rate * sh.n1 + sh.F);
          return nums('(b) Find the bill in a month with ' + t(sh.n1) + ' texts. Then find the number of texts that would produce a bill of exactly ' + $(sh.bill) + '.', [
            { label: 'Bill for ' + sh.n1 + ' texts:', name: 'Bill', ans: C1, money: true, list: [{ v: sh.rate * sh.n1, code: 'ctx-no-b', hint: 'Add the ' + $(sh.F) + ' monthly charge.' }] },
            { label: 'Texts for ' + cashT(sh.bill).replace('\\$', '$') + ':', name: 'Texts', ans: sh.n2, after: 'texts', list: [{ v: sh.bill / sh.rate, code: 'ctx-no-sub', hint: 'Subtract the monthly charge first, then divide by the cost per text.' }, { v: sh.bill - sh.F, code: 'ctx-part', hint: 'That is the amount spent on texts — now divide by ' + $(sh.rate) + '.' }] }],
            t('C=' + nf(sh.rate) + '(' + sh.n1 + ')+' + nf(sh.F) + '=' + nf(sh.rate * sh.n1) + '+' + nf(sh.F) + '=' + nf(C1)) + ' → ' + $(C1) + '<br>' + t(nf(sh.bill) + '=' + nf(sh.rate) + 'n+' + nf(sh.F) + '\\Rightarrow ' + nf(sh.rate) + 'n=' + nf(sh.bill - sh.F) + '\\Rightarrow n=' + sh.n2) + ' texts',
            ['Substitute ' + t('n=' + sh.n1) + ' for the bill; for the texts, set ' + t('C=' + nf(sh.bill)) + ' and solve.'], 'use the model both ways');
        } }] },
    { num: '4', stem: 'A graph is drawn for each situation below. Without any equation, state the <b>units of the slope</b> of the line, in the form “units of the vertical axis per unit of the horizontal axis.”',
      shared: function (r) {
        if (r.chance(0.25)) return { a: { v: ['volume', 'L'], h: ['time', 's'] }, b: { v: ['cost', '$'], h: ['mass', 'kg'] }, c: { v: ['distance', 'm'], h: ['time', 's'] }, d: { v: ['time', 'min'], h: ['distance', 'km'] } };
        return { a: axesPick(r, 'vol', 'time'), b: axesPick(r, 'cost', 'amount'), c: axesPick(r, 'dist', 'time'), d: axesPick(r, 'time', 'dist') };
      },
      parts: ['a', 'b', 'c', 'd'].map(function (L) {
        return { id: 'e4' + L, level: L === 'd' ? 'EMG' : 'BEG', outcome: 'RF3', make: function (r, sh) {
          var o = sh[L];
          return unitsMC(r, '(' + L + ') Vertical: ' + o.v[0] + ' (' + o.v[1] + '); horizontal: ' + o.h[0] + ' (' + o.h[1] + '). The units of the slope are', o.v, o.h, 'Slope = rise ÷ run = (change in ' + o.v[0] + ') ÷ (change in ' + o.h[0] + '): <b>' + per(o.v[1], o.h[1]) + '</b>.' + (L === 'd' ? ' (Here time is on the vertical axis, so time comes first.)' : ''), 'units of slope');
        } };
      }) },
    /* ---------------- Part B ---------------- */
    { num: '5', section: 'Extra practice B — Building a Model and Using It Both Ways', shared: function (r) {
        if (r.chance(0.25)) return { A0: 2400, rate: 40, t1: 18, R: 600, tR: 45, T: 60 };
        return gen(r, function (r) { var rate = r.pick([20, 25, 30, 40, 50, 60]), T = r.pick(steps(40, 90, 5)), A0 = rate * T; if (A0 < 1500 || A0 > 4000 || A0 % 100) return null; var R = r.pick([300, 400, 500, 600]); if (R % rate) return null; var tR = (A0 - R) / rate, t1 = r.pick(steps(5, T - 10)); return { A0: A0, rate: rate, t1: t1, R: R, tR: tR, T: T }; });
      },
      stem: function (sh) { return 'A scuba tank holds ' + t(nf(sh.A0)) + ' L of compressed air. A diver breathes it at a steady ' + t(sh.rate) + ' L per minute.'; },
      parts: [
        { id: 'e5a', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          return line('(a) Write an equation for the air ' + t('A') + ' (litres) remaining after ' + t('t') + ' minutes.', -sh.rate, sh.A0, { X: 't', Y: 'A' }, 'The air goes <b>down</b> ' + t(sh.rate) + ' L each minute (slope ' + t(-sh.rate) + ') from ' + t(nf(sh.A0)) + ' L:<br>' + t(eqTex('A', 't', -sh.rate, sh.A0)), ['Breathing the air uses it up, so the rate is negative.'], 'scuba equation');
        } },
        { id: 'e5b', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var v = sh.A0 - sh.rate * sh.t1;
          return num('(b) How much air remains after ' + t(sh.t1) + ' minutes?', v, [{ v: sh.A0 + sh.rate * sh.t1, code: 'ctx-rate-sign', hint: 'The air is being used up — subtract.' }, { v: sh.rate * sh.t1, code: 'ctx-change', hint: 'That’s the air used. How much is <b>left</b>?' }],
            t('A=-' + sh.rate + '(' + sh.t1 + ')+' + nf(sh.A0) + '=' + nf(v)) + ' L', ['Substitute ' + t('t=' + sh.t1) + '.'], 'air after t', { after: 'L' });
        } },
        { id: 'e5c', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          return num('(c) Divers surface when ' + t(sh.R) + ' L are left. After how many minutes is that?', sh.tR, [{ v: sh.R / sh.rate, code: 'ctx-change', hint: 'That’s how long the last ' + t(sh.R) + ' L would last. Set ' + t('A=' + sh.R) + ' and solve.' }, { v: sh.T, code: 'ctx-tint-b', hint: 'That’s when the tank is empty. Divers surface earlier, at ' + t('A=' + sh.R) + '.' }, { v: (sh.A0 + sh.R) / sh.rate, code: 'ctx-add-b', hint: 'Subtract ' + t(nf(sh.A0)) + ' from both sides (or ' + t(sh.R) + ' from ' + t(nf(sh.A0)) + ').' }],
            t(sh.R + '=-' + sh.rate + 't+' + nf(sh.A0) + '\\Rightarrow ' + sh.rate + 't=' + nf(sh.A0 - sh.R) + '\\Rightarrow t=' + sh.tR) + ' min', ['Set ' + t('A=' + sh.R) + ' and solve for ' + t('t') + '.'], 'time to reserve', { after: 'min' });
        } },
        { id: 'e5d', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          return num('(d) When would the tank be completely empty?', sh.T, [{ v: sh.A0, code: 'ctx-tint-b', hint: 'Empty means ' + t('A=0') + '; solve for ' + t('t') + '.' }, { v: sh.tR, code: 'value', hint: 'That’s when ' + t(sh.R) + ' L are left. Empty means ' + t('A=0') + '.' }],
            t('0=-' + sh.rate + 't+' + nf(sh.A0) + '\\Rightarrow t=\\dfrac{' + nf(sh.A0) + '}{' + sh.rate + '}=' + sh.T) + ' min', ['Empty means ' + t('A=0') + '.'], 'time to empty', { after: 'min' });
        } }] },
    { num: '6', shared: function (r) {
        return gen(r, function (r) { var fee = r.pick([40, 45, 50, 54, 55, 60, 65]), rate = r.pick([0.2, 0.25, 0.4, 0.5]), d1 = r.pick(steps(100, 400, 50)), D = r.pick(steps(200, 600, 2)), budget = cl(fee + rate * D); if (!isI(budget) || budget % 5) return null; return { fee: fee, rate: rate, d1: d1, D: D, budget: budget }; });
      },
      stem: function (sh) { return 'A van rental costs a flat ' + $(sh.fee) + ', plus ' + $(sh.rate) + ' for every kilometre driven.'; },
      parts: [
        { id: 'e6a', level: 'PRG', outcome: 'RF4', make: function (r, sh) { return line('(a) Write an equation for the total cost ' + t('C') + ' (dollars) after ' + t('d') + ' kilometres.', sh.rate, sh.fee, { X: 'd', Y: 'C' }, t(eqTex('C', 'd', sh.rate, sh.fee)) + ': ' + $(sh.rate) + ' for each km (slope) plus the flat ' + $(sh.fee) + ' (intercept).', ['Rate per km times ' + t('d') + ', plus the flat fee.'], 'van equation'); } },
        { id: 'e6b', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var v = cl(sh.rate * sh.d1 + sh.fee);
          return num('(b) Find the cost of a ' + t(sh.d1) + ' km trip.', v, [{ v: sh.rate * sh.d1, code: 'ctx-no-b', hint: 'Add the flat ' + $(sh.fee) + '.' }],
            t('C=' + nf(sh.rate) + '(' + sh.d1 + ')+' + sh.fee + '=' + nf(sh.rate * sh.d1) + '+' + sh.fee + '=' + nf(v)) + ' → ' + $(v), ['Substitute ' + t('d=' + sh.d1) + '.'], 'van cost', { money: true });
        } },
        { id: 'e6c', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          return num('(c) Marisol can spend at most ' + $(sh.budget) + '. What is the greatest distance she can drive?', sh.D, [{ v: sh.budget / sh.rate, code: 'ctx-no-sub', hint: 'Take off the flat fee first: ' + t(sh.budget + '-' + sh.fee) + '.' }, { v: sh.budget - sh.fee, code: 'ctx-part', hint: 'That’s the money left for kilometres — divide by ' + $(sh.rate) + ' per km.' }],
            t(sh.budget + '=' + nf(sh.rate) + 'd+' + sh.fee + '\\Rightarrow ' + nf(sh.rate) + 'd=' + (sh.budget - sh.fee) + '\\Rightarrow d=' + sh.D) + ' km', ['Set ' + t('C=' + sh.budget) + ' and solve for ' + t('d') + '.'], 'van greatest distance', { after: 'km' });
        } }] },
    { num: '7', shared: function (r) {
        if (r.chance(0.25)) return { v: 70, t1: 4, t2: 10, A0: 1400, T: 20 };
        return gen(r, function (r) { var v = r.pick([40, 50, 60, 70, 80, 90]), T = r.pick(steps(12, 30)), t1 = r.pick([2, 3, 4, 5]), t2 = t1 + r.pick([4, 5, 6]); if (t2 >= T) return null; var A0 = v * T; return A0 <= 2400 ? { v: v, t1: t1, t2: t2, A0: A0, T: T } : null; });
      },
      stem: function (sh) { var A1 = sh.A0 - sh.v * sh.t1, A2 = sh.A0 - sh.v * sh.t2; return 'A hot-air balloon descends at a constant rate. ' + cap(['', 'one', 'two', 'three', 'four', 'five'][sh.t1]) + ' minutes after the pilot began the descent the balloon was at ' + t(nf(A1)) + ' m; at ' + t(sh.t2) + ' minutes it was at ' + t(nf(A2)) + ' m.'; },
      parts: [
        { id: 'e7a', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          var A1 = sh.A0 - sh.v * sh.t1, A2 = sh.A0 - sh.v * sh.t2, dA = A2 - A1, dt = sh.t2 - sh.t1;
          return num('(a) Determine the rate of change of the balloon’s altitude.', -sh.v, [{ v: sh.v, code: 'ctx-rate-sign', hint: 'The balloon is going <b>down</b>, so the rate of change is negative.' }, { v: dA, code: 'ctx-total', hint: 'That’s the total change. Divide by the ' + t(dt) + ' minutes it took.' }, { v: dt / dA, code: 'ctx-flip', hint: 'Upside down: metres (vertical) per minute (horizontal).' }],
            t('m=\\dfrac{' + nf(A2) + '-' + nf(A1) + '}{' + sh.t2 + '-' + sh.t1 + '}=\\dfrac{' + nf(dA) + '}{' + dt + '}=' + (-sh.v)) + ' m/min: the balloon falls ' + t(sh.v) + ' m each minute.', ['Rate = (change in altitude) ÷ (change in time).'], 'balloon rate', { before: t('m='), after: 'm/min' });
        } },
        { id: 'e7b', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var A1 = sh.A0 - sh.v * sh.t1;
          return line('(b) Write an equation for the altitude ' + t('A') + ' (metres) after ' + t('t') + ' minutes of descent.', -sh.v, sh.A0, { X: 't', Y: 'A', wrong: [{ m: -sh.v, b: A1, code: 'ctx-b-point', hint: t(nf(A1)) + ' m is the altitude at ' + t('t=' + sh.t1) + ', not at ' + t('t=0') + '. Substitute ' + t('(' + sh.t1 + ',\\ ' + nf(A1) + ')') + ' to find ' + t('b') + '.' }, { m: -sh.v, b: A1 - sh.v * sh.t1, code: 'ctx-b-sign', hint: 'Check the substitution: ' + t(nf(A1) + '=-' + sh.v + '(' + sh.t1 + ')+b') + ', so ' + t('b=' + nf(A1) + '+' + (sh.v * sh.t1)) + '.' }] },
            t('A=-' + sh.v + 't+b') + '; substitute ' + t('(' + sh.t1 + ',\\ ' + nf(A1) + ')') + ': ' + t(nf(A1) + '=-' + (sh.v * sh.t1) + '+b\\Rightarrow b=' + nf(sh.A0)) + '<br>' + t(eqTex('A', 't', -sh.v, sh.A0)), ['Use the rate from (a) as the slope, then substitute one reading to find ' + t('b') + '.'], 'balloon equation');
        } },
        { id: 'e7c', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          return interMC(r, '(c) What does the ' + t('A') + '-intercept, ' + t(nf(sh.A0)) + ' m, represent?', BALLOON, -sh.v, sh.A0, interSol(BALLOON, -sh.v, sh.A0), 'meaning of A-intercept');
        } },
        { id: 'e7d', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          return num('(d) At what time does the balloon touch down?', sh.T, [{ v: sh.A0, code: 'ctx-tint-b', hint: 'Touching down means ' + t('A=0') + '. Solve for ' + t('t') + '.' }, { v: sh.T - sh.t2, code: 'u7l9-from-now', hint: 'Give the time from the start of the descent (' + t('t=0') + '), not from the last reading.' }],
            t('0=-' + sh.v + 't+' + nf(sh.A0) + '\\Rightarrow t=\\dfrac{' + nf(sh.A0) + '}{' + sh.v + '}=' + sh.T) + ' min', ['Touchdown means the altitude is 0.'], 'touchdown time', { before: t('t='), after: 'min' });
        } }] },
    { num: '8', shared: function (r) {
        if (r.chance(0.25)) return { k: 6, h1: 500, h2: 2000, T0: 17.5, h3: 3200, Tt: -5, ht: 3750 };
        return gen(r, function (r) {
          var k = r.pick([5, 6, 8]), h1 = r.pick([500, 1000]), h2 = h1 + r.pick([1000, 1500, 2000]), T0 = r.pick([15, 16, 17.5, 18, 20]), h3 = r.pick(steps(2500, 4000, 100)), Tt = r.pick([-2, -4, -5, -6, -8, -10]);
          var ht = (T0 - Tt) * 1000 / k; if (!isI(ht) || ht % 50 || ht <= h2 || ht > 6000 || h3 === h2) return null;
          return { k: k, h1: h1, h2: h2, T0: T0, h3: h3, Tt: Tt, ht: ht };
        });
      },
      stem: function (sh) { return 'On a clear day the air cools steadily as you climb. At an altitude of ' + t(nf(sh.h1)) + ' m the temperature was ' + t(nf(sh.T0 - sh.k * sh.h1 / 1000) + '^\\circ') + 'C; at ' + t(nf(sh.h2)) + ' m it was ' + t(nf(sh.T0 - sh.k * sh.h2 / 1000) + '^\\circ') + 'C.'; },
      parts: [
        { id: 'e8a', sub: 'a i', level: 'ADV', outcome: 'RF3', make: function (r, sh) {
          var T1 = cl(sh.T0 - sh.k * sh.h1 / 1000), T2 = cl(sh.T0 - sh.k * sh.h2 / 1000), dT = cl(T2 - T1), dh = sh.h2 - sh.h1, pm = cl(-sh.k / 1000);
          return nums('(a) Determine the rate of change in °C per metre, then restate the same rate in °C per kilometre.', [
            { label: 'Per metre:', ans: pm, after: '°C/m', list: [{ v: -pm, code: 'ctx-rate-sign', hint: 'The air <b>cools</b> as you climb, so the rate is negative.' }, { v: dT, code: 'ctx-total', hint: 'That’s the total change. Divide by the ' + t(nf(dh)) + ' m climbed.' }, { v: -sh.k, code: 'ctx-noconv', hint: 'That’s the rate per <b>kilometre</b>. Per metre is ' + t(1000) + ' times smaller.' }] },
            { label: 'Per kilometre:', ans: -sh.k, after: '°C/km', list: [{ v: sh.k, code: 'ctx-rate-sign', hint: 'The temperature falls, so the rate is negative.' }, { v: pm, code: 'ctx-noconv', hint: 'That’s per metre. One kilometre is ' + t(1000) + ' m, so multiply by ' + t(1000) + '.' }, { v: pm / 1000, code: 'ctx-convert', hint: 'A kilometre is <b>more</b> than a metre, so the change per km is bigger: multiply by 1000.' }] }],
            t('m=\\dfrac{' + nf(T2) + '-' + nf(T1) + '}{' + nf(sh.h2) + '-' + nf(sh.h1) + '}=\\dfrac{' + nf(dT) + '}{' + nf(dh) + '}=' + nf(pm)) + ' °C/m<br>' + t('1\\text{ km}=1000\\text{ m}') + ', so ' + t(nf(pm) + '\\times 1000=' + (-sh.k)) + ' °C/km.',
            ['Rate = (change in temperature) ÷ (change in altitude, in metres).', 'A kilometre is 1000 m, so a change per km is 1000 times a change per metre.'], 'rate per m and per km');
        } },
        { id: 'e8a2', sub: 'a ii', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          var pm = cl(-sh.k / 1000);
          return mc(r, '(a) Why do ' + t(nf(pm)) + ' °C/m and ' + t(-sh.k) + ' °C/km look so different but mean the same thing?', [
            { html: 'A kilometre is ' + t(1000) + ' metres, so the change over one kilometre is ' + t(1000) + ' times the change over one metre — the same rate in bigger units.', right: true },
            { html: 'The air cools faster higher up, so the rate per kilometre is bigger.', why: 'The rate is constant (a straight line). The numbers differ only because the units differ.' },
            { html: 'They don’t mean the same thing — a rate can only have one value.', why: 'A rate keeps its meaning when its units change; only the number changes with the units.' },
            { html: 'Metres are bigger than kilometres, so the rate per metre is smaller.', why: 'A kilometre is the bigger unit: 1 km = 1000 m.' }],
            'Over one metre the temperature changes by ' + t(nf(pm)) + '°C; over ' + t(1000) + ' metres (1 km) it changes ' + t(1000) + ' times as much: ' + t(-sh.k) + '°C. Same rate, different units.', ['How many metres are in a kilometre?'], 'why the numbers differ');
        } },
        { id: 'e8b', sub: 'b', level: 'ADV', outcome: 'RF4', make: function (r, sh) {
          var pm = cl(-sh.k / 1000), T1 = cl(sh.T0 - sh.k * sh.h1 / 1000);
          return line('(b) Write an equation for the temperature ' + t('T') + ' (°C) at an altitude of ' + t('h') + ' metres.', pm, sh.T0, { X: 'h', Y: 'T', wrong: [{ m: -sh.k, b: sh.T0, code: 'ctx-noconv', hint: t('h') + ' is in <b>metres</b>, so use the rate per metre, ' + t(nf(pm)) + '.' }, { m: pm, b: T1, code: 'ctx-b-point', hint: t(nf(T1)) + '°C is the temperature at ' + t(nf(sh.h1)) + ' m, not at sea level. Substitute the point to find ' + t('b') + '.' }] },
            t('T=' + nf(pm) + 'h+b') + '; substitute ' + t('(' + nf(sh.h1) + ',\\ ' + nf(T1) + ')') + ': ' + t(nf(T1) + '=' + nf(pm) + '(' + nf(sh.h1) + ')+b=' + nf(pm * sh.h1) + '+b\\Rightarrow b=' + nf(sh.T0)) + '<br>' + t(eqTex('T', 'h', pm, sh.T0)),
            ['Use the rate per metre as the slope, then substitute one reading to find ' + t('b') + '.'], 'temperature equation');
        } },
        { id: 'e8b2', sub: 'b ii', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var M = { Y: 'T', X: 'h', what: 'the temperature', yu: '°C', ya: '°C', each: 'metre', xs: 'metres', up: 'rises', down: 'falls', start: function (v) { return 'the temperature at sea level (an altitude of 0 m) is ' + v + '.'; } };
          return interMC(r, '(b) What does the ' + t('T') + '-intercept, ' + t(nf(sh.T0) + '^\\circ') + 'C, represent?', M, -sh.k / 1000, sh.T0, interSol(M, -sh.k / 1000, sh.T0), 'meaning of T-intercept');
        } },
        { id: 'e8c', sub: 'c', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var pm = cl(-sh.k / 1000), v = cl(sh.T0 + pm * sh.h3);
          return num('(c) Predict the temperature at ' + t(nf(sh.h3)) + ' m.', v, [{ v: sh.T0 - pm * sh.h3, code: 'ctx-rate-sign', hint: 'The air cools as you climb: ' + t(nf(pm) + '\\times ' + nf(sh.h3)) + ' is negative.' }, { v: pm * sh.h3, code: 'ctx-no-b', hint: 'Add the sea-level temperature ' + t(nf(sh.T0)) + '.' }, { v: sh.T0 - sh.k * sh.h3, code: 'ctx-noconv', hint: 'Use the rate per <b>metre</b> with an altitude in metres.' }],
            t('T=' + nf(pm) + '(' + nf(sh.h3) + ')+' + nf(sh.T0) + '=' + nf(pm * sh.h3) + '+' + nf(sh.T0) + '=' + nf(v)) + '°C', ['Substitute ' + t('h=' + sh.h3) + '.'], 'predict temperature', { after: '°C' });
        } },
        { id: 'e8d', sub: 'd', level: 'ADV', outcome: 'RF4', make: function (r, sh) {
          var pm = cl(-sh.k / 1000);
          return num('(d) At what altitude does the temperature reach ' + t(sh.Tt + '^\\circ') + 'C?', sh.ht, [{ v: (sh.T0 + sh.Tt) * 1000 / sh.k, code: 'ctx-add-b', hint: 'Subtract ' + t(nf(sh.T0)) + ' from both sides: ' + t(sh.Tt + '-' + nf(sh.T0) + '=' + nf(sh.Tt - sh.T0)) + '.' }, { v: sh.ht / 1000, code: 'ctx-noconv', hint: 'That’s in kilometres. The question uses metres.' }, { v: -sh.ht, code: 'ctx-rate-sign', hint: 'Altitude is positive here — check the signs when you divide.' }],
            t(sh.Tt + '=' + nf(pm) + 'h+' + nf(sh.T0) + '\\Rightarrow ' + nf(pm) + 'h=' + nf(sh.Tt - sh.T0) + '\\Rightarrow h=\\dfrac{' + nf(sh.Tt - sh.T0) + '}{' + nf(pm) + '}=' + nf(sh.ht)) + ' m', ['Set ' + t('T=' + sh.Tt) + ' and solve for ' + t('h') + '.', 'Dividing by ' + t(nf(pm)) + ' is the same as dividing by ' + t(-sh.k) + ' and multiplying by ' + t(1000) + '.'], 'altitude for temperature', { after: 'm' });
        } }] },
    /* ---------------- Part C ---------------- */
    { num: '9', section: 'Extra practice C — Changing the Units Inside the Rate', shared: function (r) {
        if (r.chance(0.25)) return { R: 720, V0: 150, t1: 25, T: 60 };
        return { R: r.pick([360, 480, 600, 720, 900, 1200]), V0: r.pick([100, 150, 200, 250]), t1: r.pick([10, 15, 20, 25, 30]), T: r.pick([40, 45, 50, 60]) };
      },
      stem: function (sh) { return 'A pump fills a trough at a constant ' + t(sh.R) + ' litres per hour. The trough already holds ' + t(sh.V0) + ' L when the pump is switched on. <i>(Convert the rate before putting it into ' + t('y=mx+b') + ', so the slope and the variable use the same unit of time.)</i>'; },
      parts: [
        { id: 'e9a', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          var q = sh.R / 60;
          return num('(a) Express the pumping rate in litres per minute.', q, [{ v: sh.R * 60, code: 'ctx-convert', hint: 'A minute is <b>shorter</b> than an hour, so fewer litres flow in a minute: divide by 60.' }, { v: sh.R / 100, code: 'u7l9-60', hint: 'An hour has 60 minutes, not 100.' }],
            t('\\dfrac{' + sh.R + '\\text{ L}}{1\\text{ h}}=\\dfrac{' + sh.R + '\\text{ L}}{60\\text{ min}}=' + q) + ' L/min', ['One hour is 60 minutes.'], 'L/h to L/min', { after: 'L/min' });
        } },
        { id: 'e9b', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var q = sh.R / 60;
          return line('(b) Write an equation for the volume ' + t('V') + ' (litres) after ' + t('m') + ' <b>minutes</b>.', q, sh.V0, { X: 'm', Y: 'V', wrong: [{ m: sh.R, b: sh.V0, code: 'ctx-noconv', hint: t('m') + ' is in minutes, so use the rate in litres per <b>minute</b> from (a).' }] },
            'Slope ' + t(q) + ' L/min, start ' + t(sh.V0) + ' L: ' + t(eqTex('V', 'm', q, sh.V0)), ['Use the per-minute rate from (a).'], 'pump equation');
        } },
        { id: 'e9c', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var q = sh.R / 60, v = q * sh.t1 + sh.V0;
          return num('(c) How much water is in the trough after ' + t(sh.t1) + ' minutes?', v, [{ v: q * sh.t1, code: 'ctx-no-b', hint: 'Add the ' + t(sh.V0) + ' L already in the trough.' }, { v: sh.R * sh.t1 + sh.V0, code: 'ctx-noconv', hint: 'Use the rate per minute, not per hour.' }],
            t('V=' + q + '(' + sh.t1 + ')+' + sh.V0 + '=' + v) + ' L', ['Substitute ' + t('m=' + sh.t1) + '.'], 'trough volume', { after: 'L' });
        } },
        { id: 'e9d', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var q = sh.R / 60, V = q * sh.T + sh.V0;
          return num('(d) When does the trough hold ' + t(V) + ' L?', sh.T, [{ v: V / q, code: 'ctx-no-sub', hint: 'Subtract the ' + t(sh.V0) + ' L that was already there first.' }, { v: (V - sh.V0) / sh.R, code: 'ctx-noconv', hint: 'That’s in hours. Use the rate per minute to get minutes.' }],
            t(V + '=' + q + 'm+' + sh.V0 + '\\Rightarrow ' + q + 'm=' + (V - sh.V0) + '\\Rightarrow m=' + sh.T) + ' min', ['Set ' + t('V=' + V) + ' and solve for ' + t('m') + '.'], 'time for volume', { after: 'min' });
        } }] },
    { num: '10', shared: function (r) {
        if (r.chance(0.25)) return { c: 0.9, h0: 18, M: 150 };
        return gen(r, function (r) { var c = r.pick([0.6, 0.9, 1.2, 1.5, 1.8, 2.4]), h0 = r.pick([9, 12, 15, 18, 21, 24, 27, 30, 36]), M = r.pick([90, 120, 150, 180, 210]); return isI(h0 / c) && h0 - c * M / 60 > 0 ? { c: c, h0: h0, M: M } : null; });
      },
      stem: function (sh) { return 'A candle burns down at a steady ' + t(nf(sh.c)) + ' cm per hour. It is ' + t(sh.h0) + ' cm tall when lit.'; },
      parts: [
        { id: 'e10a', level: 'ADV', outcome: 'RF3', make: function (r, sh) {
          var pm = cl(sh.c / 60), mm = cl(sh.c * 10);
          return nums('(a) Express the burn rate in cm per minute and in mm per hour.', [
            { label: 'cm per minute:', ans: pm, after: 'cm/min', list: [{ v: sh.c * 60, code: 'ctx-convert', hint: 'In one minute the candle burns <b>less</b> than in an hour: divide by 60.' }, { v: sh.c / 100, code: 'u7l9-60', hint: 'An hour has 60 minutes.' }, { v: -pm, code: 'ctx-rate-sign', hint: 'Give the burn rate as a positive amount (how fast it burns).' }] },
            { label: 'mm per hour:', ans: mm, after: 'mm/h', list: [{ v: sh.c / 10, code: 'u7l9-mm', hint: 'A centimetre is <b>10</b> millimetres, so the number of mm is bigger: multiply by 10.' }, { v: sh.c * 100, code: 'u7l9-mm', hint: '1 cm = 10 mm (not 100).' }] }],
            t(nf(sh.c) + '\\div 60=' + nf(pm)) + ' cm/min<br>' + t(nf(sh.c) + '\\times 10=' + nf(mm)) + ' mm/h (1 cm = 10 mm)', ['One hour is 60 minutes; one centimetre is 10 millimetres.'], 'candle rate conversions');
        } },
        { id: 'e10b', level: 'PRG', outcome: 'RF4', make: function (r, sh) { return line('(b) Write an equation for the height ' + t('H') + ' (cm) after ' + t('t') + ' <b>hours</b>.', -sh.c, sh.h0, { X: 't', Y: 'H' }, t(eqTex('H', 't', -sh.c, sh.h0)) + ': it loses ' + t(nf(sh.c)) + ' cm each hour from ' + t(sh.h0) + ' cm.', ['Burning makes the height go down: negative slope.'], 'candle equation'); } },
        { id: 'e10c', level: 'ADV', outcome: 'RF4', make: function (r, sh) {
          var h = sh.M / 60, v = cl(sh.h0 - sh.c * h);
          return num('(c) How tall is the candle after ' + t(sh.M) + ' minutes?', v, [{ v: sh.h0 - sh.c * sh.M, code: 'ctx-noconv', hint: t('t') + ' is in <b>hours</b>: ' + t(sh.M) + ' minutes is ' + t(nf(h)) + ' h.' }, { v: sh.c * h, code: 'ctx-change', hint: 'That’s how much has burned. How tall is it now?' }, { v: sh.h0 + sh.c * h, code: 'ctx-rate-sign', hint: 'The candle gets shorter — subtract.' }],
            t(sh.M + '\\text{ min}=' + nf(h) + '\\text{ h}') + ', so ' + t('H=-' + nf(sh.c) + '(' + nf(h) + ')+' + sh.h0 + '=' + nf(-sh.c * h) + '+' + sh.h0 + '=' + nf(v)) + ' cm', ['Convert the minutes to hours first.'], 'candle height', { after: 'cm' });
        } },
        { id: 'e10d', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var T = cl(sh.h0 / sh.c);
          return num('(d) How long until the candle burns out?', T, [{ v: T * 60, code: 'ctx-convert', hint: 'That’s in minutes. Give the answer in hours.' }, { v: sh.h0 * sh.c, code: 'ctx-convert', hint: 'Divide the height by the rate: ' + t(sh.h0 + '\\div ' + nf(sh.c)) + '.' }],
            t('0=-' + nf(sh.c) + 't+' + sh.h0 + '\\Rightarrow t=\\dfrac{' + sh.h0 + '}{' + nf(sh.c) + '}=' + nf(T)) + ' h', ['Burned out means ' + t('H=0') + '.'], 'burn-out time', { after: 'h' });
        } }] },
    { num: '11', shared: function (r) {
        if (r.chance(0.25)) return { v: 90, d0: 12, t1: 40, t2: 92 };
        return gen(r, function (r) { var v = r.pick([72, 90, 108, 144]), d0 = r.pick(steps(5, 20)), t1 = r.pick([20, 30, 40, 50]), t2 = r.pick(steps(60, 120, 2)); var q = v / 60; return isI(q * t2 * 10) && isI(q * t1 * 10) ? { v: v, d0: d0, t1: t1, t2: t2 } : null; });
      },
      stem: function (sh) { return 'A train travels at a constant ' + t(sh.v) + ' km/h. It passes a marker that is ' + t(sh.d0) + ' km from the station, moving away from the station. Let ' + t('t=0') + ' be the moment it passes the marker.'; },
      parts: [
        { id: 'e11a', level: 'ADV', outcome: 'RF3', make: function (r, sh) {
          var q = cl(sh.v / 60), ms = cl(sh.v * 1000 / 3600);
          return nums('(a) Express the speed in km per minute and in metres per second.', [
            { label: 'km per minute:', ans: q, after: 'km/min', list: [{ v: sh.v * 60, code: 'ctx-convert', hint: 'A minute is shorter than an hour: divide by 60.' }] },
            { label: 'm per second:', ans: ms, after: 'm/s', list: [{ v: sh.v / 3600, code: 'ctx-noconv', hint: 'That’s km per second. Change km to metres too (×1000).' }, { v: sh.v * 1000 / 60, code: 'ctx-convert', hint: 'That’s metres per <b>minute</b>. Divide by 60 again for seconds.' }] }],
            t(sh.v + '\\div 60=' + nf(q)) + ' km/min<br>' + t(sh.v + '\\text{ km/h}=\\dfrac{' + nf(sh.v * 1000) + '\\text{ m}}{3600\\text{ s}}=' + nf(ms)) + ' m/s', ['One hour = 60 minutes = 3600 seconds; one km = 1000 m.'], 'speed conversions');
        } },
        { id: 'e11b', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var q = cl(sh.v / 60);
          return line('(b) Write an equation for the distance ' + t('D') + ' (km) from the station after ' + t('t') + ' <b>minutes</b>.', q, sh.d0, { X: 't', Y: 'D', wrong: [{ m: sh.v, b: sh.d0, code: 'ctx-noconv', hint: t('t') + ' is in minutes, so use the speed in km per <b>minute</b>.' }] },
            'Slope ' + t(nf(q)) + ' km/min, start ' + t(sh.d0) + ' km: ' + t(eqTex('D', 't', q, sh.d0)), ['Use km per minute; at ' + t('t=0') + ' the train is ' + t(sh.d0) + ' km from the station.'], 'train equation');
        } },
        { id: 'e11c', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var q = cl(sh.v / 60), v = cl(q * sh.t1 + sh.d0);
          return num('(c) How far from the station is the train after ' + t(sh.t1) + ' minutes?', v, [{ v: q * sh.t1, code: 'ctx-no-b', hint: 'Add the ' + t(sh.d0) + ' km it had already gone.' }, { v: sh.v * sh.t1 + sh.d0, code: 'ctx-noconv', hint: 'Use km per minute.' }],
            t('D=' + nf(q) + '(' + sh.t1 + ')+' + sh.d0 + '=' + nf(v)) + ' km', ['Substitute ' + t('t=' + sh.t1) + '.'], 'train distance', { after: 'km' });
        } },
        { id: 'e11d', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var q = cl(sh.v / 60), D = cl(q * sh.t2 + sh.d0);
          return num('(d) When is the train ' + t(nf(D)) + ' km from the station?', sh.t2, [{ v: D / q, code: 'ctx-no-sub', hint: 'Subtract the ' + t(sh.d0) + ' km first.' }, { v: (D - sh.d0) / sh.v, code: 'ctx-noconv', hint: 'That’s in hours. Use km per minute to get minutes.' }],
            t(nf(D) + '=' + nf(q) + 't+' + sh.d0 + '\\Rightarrow ' + nf(q) + 't=' + nf(D - sh.d0) + '\\Rightarrow t=' + sh.t2) + ' min', ['Set ' + t('D=' + nf(D)) + ' and solve.'], 'train time', { after: 'min' });
        } }] },
    /* ---------------- Part D ---------------- */
    { num: '12', section: 'Extra practice D — Comparing Two Rates', shared: function (r) {
        if (r.chance(0.25)) return { a1: 0.11, b1: 26, a2: 0.19, b2: 14, ns: 150, lo: 100, hi: 400 };
        return gen(r, function (r) { var a1 = r.pick([0.1, 0.11, 0.12, 0.15]), d = r.pick([0.05, 0.08, 0.1]), b2 = r.pick([10, 12, 14, 15, 20]), ns = r.pick([100, 150, 200, 250]), b1 = cl(b2 + d * ns); if (!isI(b1 * 2)) return null; return { a1: a1, b1: b1, a2: cl(a1 + d), b2: b2, ns: ns, lo: ns - 50, hi: ns + r.pick([150, 250]) }; });
      },
      stem: function (sh) { return 'Two phone plans charge for long-distance minutes as follows, with ' + t('C') + ' in dollars and ' + t('n') + ' the number of minutes:<br>Plan A: ' + t(eqTex('C', 'n', sh.a1, sh.b1, 'money')) + '<br>Plan B: ' + t(eqTex('C', 'n', sh.a2, sh.b2, 'money')); },
      parts: [
        { id: 'e12a', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          var A = 'Plan A: ' + $(sh.a1) + ' per minute and ' + $(sh.b1) + ' before any calls; Plan B: ' + $(sh.a2) + ' per minute and ' + $(sh.b2) + ' before any calls.';
          return mc(r, '(a) Which statement interprets the plans correctly?', [
            { html: A + ' <b>B</b> charges more per minute; <b>A</b> charges more before any calls are made.', right: true },
            { html: A + ' <b>A</b> charges more per minute; <b>B</b> charges more before any calls are made.', why: 'Compare the slopes for “per minute” (' + t(nf(sh.a1)) + ' vs ' + t(nf(sh.a2)) + ') and the intercepts for “before any calls”.' },
            { html: 'Plan A: ' + $(sh.b1) + ' per minute and ' + $(sh.a1) + ' before any calls; Plan B: ' + $(sh.b2) + ' per minute and ' + $(sh.a2) + ' before any calls.', why: 'Swapped: the number multiplying ' + t('n') + ' is the cost per minute; the constant is the charge before any calls.' },
            { html: A + ' <b>B</b> is cheaper for any number of minutes, because its fee is smaller.', why: 'B starts cheaper, but its higher rate per minute catches up — the plans cost the same at the break-even point.' }],
            'Slopes are the per-minute rates (' + $(sh.a1) + ' and ' + $(sh.a2) + '): B charges more per minute. Intercepts are the charges before any calls (' + $(sh.b1) + ' and ' + $(sh.b2) + '): A charges more up front.', ['Slope = per-minute rate; intercept = charge with 0 minutes.'], 'compare rates and fees');
        } },
        { id: 'e12b', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var C = cl(sh.a1 * sh.ns + sh.b1);
          return nums('(b) Determine the break-even number of minutes, and the bill at that point.', [
            { label: 'Minutes:', ans: sh.ns, after: 'min', list: [{ v: C, code: 'ctx-swap-boxes', hint: 'That’s the bill. The first box is the number of minutes.' }, { v: (sh.b1 + sh.b2) / (sh.a2 - sh.a1), code: 'ctx-add-b', hint: 'Subtract the constants: ' + t(nf(sh.b1) + '-' + nf(sh.b2)) + '.' }] },
            { label: 'Bill:', ans: C, money: true, list: [{ v: sh.ns, code: 'ctx-swap-boxes', hint: 'That’s the number of minutes. Substitute it into either plan for the bill.' }] }],
            t(nf(sh.a1) + 'n+' + nf(sh.b1) + '=' + nf(sh.a2) + 'n+' + nf(sh.b2) + '\\Rightarrow ' + nf(sh.b1 - sh.b2) + '=' + nf(sh.a2 - sh.a1) + 'n\\Rightarrow n=' + sh.ns) + ' min<br>Check: A ' + t('=' + nf(sh.a1) + '(' + sh.ns + ')+' + nf(sh.b1) + '=' + nf(C)) + ', B ' + t('=' + nf(sh.a2) + '(' + sh.ns + ')+' + nf(sh.b2) + '=' + nf(C)) + ' ✓',
            ['Set the two costs equal and solve for ' + t('n') + '; then substitute into either equation.'], 'break-even and bill');
        } },
        { id: 'e12c', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var A = cl(sh.a1 * sh.lo + sh.b1), Bv = cl(sh.a2 * sh.lo + sh.b2);
          return costsPick('(c) Which plan is cheaper for ' + t(sh.lo) + ' minutes? Find both bills.', [{ label: 'Plan A:', ans: A, money: true, list: [{ v: Bv, code: 'ctx-swap-boxes', hint: 'That’s Plan B’s bill.' }] }, { label: 'Plan B:', ans: Bv, money: true, list: [{ v: A, code: 'ctx-swap-boxes', hint: 'That’s Plan A’s bill.' }] }], 'B', ['A', 'B'],
            'A: ' + t(nf(sh.a1) + '(' + sh.lo + ')+' + nf(sh.b1) + '=' + nf(A)) + '; B: ' + t(nf(sh.a2) + '(' + sh.lo + ')+' + nf(sh.b2) + '=' + nf(Bv)) + '. <b>B</b> is cheaper.', ['Substitute ' + t('n=' + sh.lo) + ' into both equations.'], 'cheaper at low use');
        } },
        { id: 'e12d', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var A = cl(sh.a1 * sh.hi + sh.b1), Bv = cl(sh.a2 * sh.hi + sh.b2);
          return costsPick('(d) Which plan is cheaper for ' + t(sh.hi) + ' minutes? Find both bills.', [{ label: 'Plan A:', ans: A, money: true, list: [{ v: Bv, code: 'ctx-swap-boxes', hint: 'That’s Plan B’s bill.' }] }, { label: 'Plan B:', ans: Bv, money: true, list: [{ v: A, code: 'ctx-swap-boxes', hint: 'That’s Plan A’s bill.' }] }], 'A', ['A', 'B'],
            'A: ' + t(nf(sh.a1) + '(' + sh.hi + ')+' + nf(sh.b1) + '=' + nf(A)) + '; B: ' + t(nf(sh.a2) + '(' + sh.hi + ')+' + nf(sh.b2) + '=' + nf(Bv)) + '. <b>A</b> is cheaper.', ['Substitute ' + t('n=' + sh.hi) + ' into both equations.'], 'cheaper at high use');
        } },
        { id: 'e12e', sub: 'd ii', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          return mc(r, '(d) Why did the cheaper plan change between ' + t(sh.lo) + ' and ' + t(sh.hi) + ' minutes?', [
            { html: 'Plan B’s higher rate per minute eventually outweighs Plan A’s larger starting charge.', right: true },
            { html: 'Plan A’s starting charge gets smaller as more minutes are used.', why: 'The starting charge (the intercept) never changes. What changes is how much the per-minute rate has added.' },
            { html: 'Plan B’s rate per minute goes up after the break-even point.', why: 'Each plan has one constant rate (a straight line). B’s rate was higher all along.' },
            { html: 'Plan A becomes cheaper because its starting charge is larger.', why: 'A larger starting charge makes A <b>more</b> expensive at first. A wins later because its rate per minute is smaller.' }],
            'Each minute adds ' + $(sh.a2 - sh.a1) + ' more on Plan B than on Plan A. After ' + t(sh.ns) + ' minutes this extra has used up A’s ' + $(sh.b1 - sh.b2) + ' head start, so beyond that A is cheaper.', ['Which plan grows faster? Which starts higher?'], 'why the winner changed');
        } }] },
    { num: '13', shared: function (r) {
        if (r.chance(0.25)) return { x0: 480, p: 15, y0: 300, q: 9, ts: 7.5, ta: 5, tb: 20 };
        return gen(r, function (r) { var p = r.pick([10, 12, 15, 20]), q = r.pick([5, 6, 8, 9, 10]), T = r.pick(steps(20, 40)), x0 = p * T, ts = r.pick([4, 5, 6, 7.5, 8, 10]), y0 = x0 - (p + q) * ts; if (y0 < 100 || y0 % 10 || ts >= T - 6 || x0 > 800) return null; var ta = r.pick(steps(1, Math.floor(ts) - 1)), tb = r.pick(steps(Math.ceil(ts) + 2, T - 2)); return { x0: x0, p: p, y0: y0, q: q, ts: ts, ta: ta, tb: tb }; });
      },
      stem: function (sh) { return '<b>Stretch.</b> Tank X holds ' + t(sh.x0) + ' L and is draining at ' + t(sh.p) + ' L/min. At the same moment, Tank Y holds ' + t(sh.y0) + ' L and is being filled at ' + t(sh.q) + ' L/min.'; },
      parts: [
        { id: 'e13a', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          return lines2('(a) Write an equation for the volume ' + t('V') + ' in each tank after ' + t('t') + ' minutes.', [{ label: 'Tank X:', m: -sh.p, b: sh.x0, X: 't', Y: 'V' }, { label: 'Tank Y:', m: sh.q, b: sh.y0, X: 't', Y: 'V' }],
            'X loses ' + t(sh.p) + ' L/min: ' + t(eqTex('V', 't', -sh.p, sh.x0)) + '<br>Y gains ' + t(sh.q) + ' L/min: ' + t(eqTex('V', 't', sh.q, sh.y0)), ['Draining: negative slope. Filling: positive slope.'], 'two tank equations');
        } },
        { id: 'e13b', level: 'ADV', outcome: 'RF4', make: function (r, sh) {
          var V = cl(sh.x0 - sh.p * sh.ts);
          return nums('(b) At what time do the two tanks hold the same amount? How much is in each tank then?', [
            { label: 'Time:', ans: sh.ts, after: 'min', list: [{ v: (sh.x0 - sh.y0) / (sh.p - sh.q), code: 'ctx-rate-sign', hint: 'Collect the ' + t('t') + '-terms carefully: ' + t('-' + sh.p + 't-' + sh.q + 't=-' + (sh.p + sh.q) + 't') + '.' }, { v: V, code: 'ctx-swap-boxes', hint: 'That’s the volume — it goes in the second box.' }] },
            { label: 'Volume in each:', name: 'Volume', ans: V, after: 'L', list: [{ v: sh.ts, code: 'ctx-swap-boxes', hint: 'That’s the time. Substitute it into either equation.' }] }],
            t('-' + sh.p + 't+' + sh.x0 + '=' + sh.q + 't+' + sh.y0 + '\\Rightarrow ' + (sh.x0 - sh.y0) + '=' + (sh.p + sh.q) + 't\\Rightarrow t=' + nf(sh.ts)) + ' min<br>' + t('V=-' + sh.p + '(' + nf(sh.ts) + ')+' + sh.x0 + '=' + nf(V)) + ' L in each.',
            ['Set the two volumes equal and solve for ' + t('t') + '.'], 'tanks equal');
        } },
        { id: 'e13c', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var X1 = sh.x0 - sh.p * sh.ta, Y1 = sh.y0 + sh.q * sh.ta, X2 = sh.x0 - sh.p * sh.tb, Y2 = sh.y0 + sh.q * sh.tb;
          return nums('(c) Find both volumes after ' + t(sh.ta) + ' minutes and after ' + t(sh.tb) + ' minutes. (Which tank holds more each time?)', [
            { label: 'X at ' + sh.ta + ' min:', ans: X1, after: 'L', list: [{ v: Y1, code: 'ctx-swap-boxes', hint: 'That’s Tank Y.' }] }, { label: 'Y at ' + sh.ta + ' min:', ans: Y1, after: 'L', list: [{ v: X1, code: 'ctx-swap-boxes', hint: 'That’s Tank X.' }] },
            { label: 'X at ' + sh.tb + ' min:', ans: X2, after: 'L', list: [{ v: Y2, code: 'ctx-swap-boxes', hint: 'That’s Tank Y.' }] }, { label: 'Y at ' + sh.tb + ' min:', ans: Y2, after: 'L', list: [{ v: X2, code: 'ctx-swap-boxes', hint: 'That’s Tank X.' }] }],
            'At ' + t(sh.ta) + ' min: X ' + t('=' + X1) + ' L, Y ' + t('=' + Y1) + ' L — X holds more.<br>At ' + t(sh.tb) + ' min: X ' + t('=' + X2) + ' L, Y ' + t('=' + Y2) + ' L — Y holds more (they passed at ' + t(nf(sh.ts)) + ' min).',
            ['Substitute each time into both equations.'], 'tanks at two times');
        } },
        { id: 'e13d', level: 'MAS', outcome: 'RF4', make: function (r, sh) {
          var T = sh.x0 / sh.p, Y = sh.y0 + sh.q * T;
          return nums('(d) Tank X eventually runs dry. When? How much is in Tank Y at that instant?', [
            { label: 'X runs dry at:', ans: T, after: 'min', list: [{ v: sh.x0, code: 'ctx-tint-b', hint: 'Dry means ' + t('V=0') + ' for Tank X: solve ' + t('0=-' + sh.p + 't+' + sh.x0) + '.' }, { v: sh.ts, code: 'value', hint: 'That’s when the tanks are equal. X runs dry when its volume is 0.' }] },
            { label: 'Tank Y then:', ans: Y, after: 'L', list: [{ v: sh.q * T, code: 'ctx-no-b', hint: 'Add the ' + t(sh.y0) + ' L Tank Y started with.' }, { v: sh.y0, code: 'value', hint: 'Tank Y keeps filling. Substitute the time X runs dry into Y’s equation.' }] }],
            t('0=-' + sh.p + 't+' + sh.x0 + '\\Rightarrow t=' + T) + ' min<br>' + t('V_Y=' + sh.q + '(' + T + ')+' + sh.y0 + '=' + Y) + ' L',
            ['Solve ' + t('V=0') + ' for Tank X, then put that time into Tank Y’s equation.'], 'when X runs dry');
        } },
        { id: 'e13e', sub: 'd ii', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          return mc(r, '(d) Why can Tank X never catch up with Tank Y again?', [
            { html: 'Tank X is falling while Tank Y is rising, so once Y passes X the gap only widens.', right: true },
            { html: 'Tank X started with more water, so it is always ahead.', why: 'X <b>was</b> ahead at the start, but Y passed it at ' + t(nf(sh.ts)) + ' minutes.' },
            { html: 'Tank Y’s rate is bigger than Tank X’s.', why: 'Compare the sizes: X drains ' + t(sh.p) + ' L/min, Y fills ' + t(sh.q) + ' L/min. What matters is that one goes down while the other goes up.' },
            { html: 'It can catch up — the lines cross a second time later.', why: 'Two different straight lines cross at most once.' }],
            'X’s slope is negative (' + t(-sh.p) + ' L/min) and Y’s is positive (' + t('+' + sh.q) + ' L/min). After they meet, every minute the gap grows by ' + t(sh.p + sh.q) + ' L, so X can never catch up.', ['Compare the signs of the two slopes.'], 'why the gap widens');
        } }] },
    /* ---------------- Part E ---------------- */
    { num: '14', section: 'Extra practice E — Rates from Graphs and Tables', shared: function (r) {
        if (r.chance(0.25)) return { v: 60, D0: 40, t1: 3.5, T: 6 };
        return { v: r.pick([30, 40, 50, 60, 70, 80, 90]), D0: r.pick([20, 40, 60, 80]), t1: r.pick([1.5, 2.5, 3.5]), T: r.pick([5, 6, 7]) };
      },
      stem: function (sh) {
        var top = Math.ceil((sh.D0 + sh.v * 4.5) / 40) * 40;
        return 'The graph shows a truck’s distance ' + t('D') + ' from a depot ' + t('t') + ' hours into one delivery run. Read the axis labels carefully — the squares are not one unit each.' +
          fig({ x: [0, 4.8], y: [0, top + 10], gx: 0.5, gy: 20, lx: 1, ly: 40, xn: 't', yn: 'D', xt: 'Time, t (hours)', yt: 'Distance from depot, D (km)', h: 250, segs: [{ pts: [[0, sh.D0], [4.5, sh.D0 + sh.v * 4.5]] }], aria: 'truck distance graph' });
      },
      parts: [
        { id: 'e14a', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          return num('(a) Determine the rate of change from the graph.', sh.v, [{ v: sh.v / 40, code: 'ctx-squares', hint: 'Use the axis <b>labels</b>, not the number of squares: each square up is 20 km and each square across is half an hour.' }, { v: sh.v * 2 / 20, code: 'ctx-squares', hint: 'Use the axis labels, not the number of squares.' }, { v: sh.D0 + 2 * sh.v, code: 'ctx-reading', hint: 'That’s a reading. The rate is the <b>change</b> in distance ÷ the change in time.' }],
            'From ' + t('(0,\\ ' + sh.D0 + ')') + ' to ' + t('(2,\\ ' + (sh.D0 + 2 * sh.v) + ')') + ': ' + t('m=\\dfrac{' + (sh.D0 + 2 * sh.v) + '-' + sh.D0 + '}{2-0}=' + sh.v) + ' km/h', ['Pick two points where the line crosses grid lines exactly, read their values from the labels, then rise ÷ run.'], 'rate from graph', { before: t('m='), after: 'km/h' });
        } },
        { id: 'e14b', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var M = { Y: 'D', X: 't', what: 'the truck’s distance from the depot', yu: 'km', each: 'hour', xs: 'hours', up: 'increases', down: 'decreases', start: function (v) { return 'the truck was already ' + v + ' from the depot when timing started.'; } };
          return interUnitsMC(r, '(b) State the vertical intercept with units and what it means for this truck.', M, sh.v, sh.D0, 'intercept from graph');
        } },
        { id: 'e14c', level: 'PRG', outcome: 'RF4', make: function (r, sh) { return line('(c) Write the equation of the line using ' + t('D') + ' for distance and ' + t('t') + ' for time.', sh.v, sh.D0, { X: 't', Y: 'D', wrong: [{ m: sh.v / 40, b: sh.D0, code: 'ctx-squares', hint: 'Read the slope from the axis labels: km per hour.' }] }, t(eqTex('D', 't', sh.v, sh.D0)) + ' (slope from (a), intercept from (b)).', ['Slope from (a); intercept from (b).'], 'truck equation'); } },
        { id: 'e14d', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var v = sh.v * sh.t1 + sh.D0;
          return num('(d) How far from the depot is the truck after ' + t(nf(sh.t1)) + ' hours?', v, [{ v: sh.v * sh.t1, code: 'ctx-no-b', hint: 'Add the starting ' + t(sh.D0) + ' km.' }], t('D=' + sh.v + '(' + nf(sh.t1) + ')+' + sh.D0 + '=' + v) + ' km', ['Substitute ' + t('t=' + nf(sh.t1)) + '.'], 'truck distance', { after: 'km' });
        } },
        { id: 'e14e', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var E = sh.D0 + sh.v * sh.T;
          return num('(e) The run ends at ' + t(E) + ' km from the depot. Use the equation — not the graph — to find how long the run lasts.', sh.T, [{ v: E / sh.v, code: 'ctx-no-sub', hint: 'Subtract the starting ' + t(sh.D0) + ' km first.' }, { v: (E + sh.D0) / sh.v, code: 'ctx-add-b', hint: 'Subtract ' + t(sh.D0) + ' — don’t add it.' }],
            t(E + '=' + sh.v + 't+' + sh.D0 + '\\Rightarrow ' + sh.v + 't=' + (E - sh.D0) + '\\Rightarrow t=' + sh.T) + ' h', ['Set ' + t('D=' + E) + ' and solve.'], 'run length', { after: 'h' });
        } }] },
    { num: '15', shared: function (r) {
        if (r.chance(0.25)) return { V0: 600, T: 24, t1: 10 };
        return gen(r, function (r) { var V0 = r.pick([300, 400, 450, 500, 600, 700, 800, 900]), T = r.pick([12, 16, 20, 24, 30, 32, 36, 40]); if (V0 % T) return null; return { V0: V0, T: T, t1: r.pick(steps(2, T - 2, 2)) }; });
      },
      stem: function (sh) { return 'The graph shows the water remaining in a reservoir tank as it drains.' + fig({ x: [0, sh.T + 4], y: [0, sh.V0 + 50], gx: 2, gy: 50, lx: 4, ly: 100, xn: 't', yn: 'V', xt: 'Time, t (minutes)', yt: 'Volume of water, V (L)', h: 230, segs: [{ pts: [[0, sh.V0], [sh.T, 0]] }], aria: 'tank volume graph' }); },
      parts: [
        { id: 'e15a', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          var q = sh.V0 / sh.T;
          return num('(a) Determine the rate of change from the graph. (Its sign tells you whether the volume is increasing or decreasing.)', -q, [{ v: q, code: 'ctx-rate-sign', hint: 'The tank is draining — the line falls — so the rate is negative.' }, { v: -sh.T / sh.V0, code: 'ctx-flip', hint: 'Upside down: litres (vertical) per minute (horizontal).' }],
            t('m=\\dfrac{0-' + sh.V0 + '}{' + sh.T + '-0}=' + (-q)) + ' L/min. Negative: the volume is <b>decreasing</b> by ' + t(q) + ' L every minute.', ['Use the two intercepts: ' + t('(0,\\ ' + sh.V0 + ')') + ' and ' + t('(' + sh.T + ',\\ 0)') + '.'], 'rate from graph', { before: t('m='), after: 'L/min' });
        } },
        { id: 'e15b', level: 'PRG', outcome: 'RF4', make: function (r, sh) { var q = sh.V0 / sh.T; return line('(b) Write the equation of the line using ' + t('V') + ' for volume and ' + t('t') + ' for time.', -q, sh.V0, { X: 't', Y: 'V', wrong: [{ m: -q, b: sh.T, code: 'ctx-b-point', hint: t(sh.T) + ' is where the line meets the <b>time</b> axis. ' + t('b') + ' is where it meets the volume axis.' }] }, t(eqTex('V', 't', -q, sh.V0)), ['Slope from (a); the line starts at ' + t(sh.V0) + ' L.'], 'tank equation'); } },
        { id: 'e15c', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var q = sh.V0 / sh.T, v = sh.V0 - q * sh.t1;
          return num('(c) How much water is left after ' + t(sh.t1) + ' minutes?', v, [{ v: q * sh.t1, code: 'ctx-change', hint: 'That’s how much has drained out. How much is <b>left</b>?' }], t('V=-' + q + '(' + sh.t1 + ')+' + sh.V0 + '=' + v) + ' L (check on the graph: the line passes ' + t('(' + sh.t1 + ',\\ ' + v + ')') + ').', ['Substitute ' + t('t=' + sh.t1) + '.'], 'volume after t', { after: 'L' });
        } },
        { id: 'e15d', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          return num('(d) When is the tank empty?', sh.T, [{ v: sh.V0, code: 'ctx-tint-b', hint: 'That’s the starting volume. Empty means ' + t('V=0') + '.' }], 'Empty means ' + t('V=0') + ': the line meets the time axis at ' + t('t=' + sh.T) + ' min.', ['Where does the line meet the horizontal axis?'], 'empty time', { before: t('t='), after: 'min' });
        } },
        { id: 'e15e', sub: 'd ii', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          return mc(r, '(d) Which feature of the graph gives the time when the tank is empty directly?', [
            { html: 'the ' + t('t') + '-intercept (where the line meets the horizontal axis)', right: true },
            { html: 'the ' + t('V') + '-intercept (where the line meets the vertical axis)', why: 'That is the volume at the start (' + t('t=0') + ').' },
            { html: 'the slope of the line', why: 'The slope is the rate the water drains, not a time.' },
            { html: 'the highest point of the line', why: 'The highest point is the start. Empty is where the volume is 0.' }],
            'Empty means ' + t('V=0') + ', which is where the line meets the horizontal (' + t('t') + ') axis: the ' + t('t') + '-intercept.', ['On which axis is the volume 0?'], 'feature for empty');
        } }] },
    { num: '16', shared: function (r) {
        if (r.chance(0.25)) return { d0: 62, q: 0.9, t1: 35, tS: 60 };
        return gen(r, function (r) { var q = r.pick([0.6, 0.8, 0.9, 1.2]), d0 = r.pick(steps(48, 72, 0.5)), t1 = r.pick([25, 30, 35, 40]), tS = r.pick([40, 45, 50, 55, 60]); var S = cl(d0 - q * tS); if (S <= 2 || !isI(S * 2) || d0 - q * 20 <= S) return null; return { d0: d0, q: q, t1: t1, tS: tS }; });
      },
      stem: function (sh) { var ts = [0, 5, 10, 15, 20]; return 'A sensor recorded the depth of water in a cattle trough as it was siphoned out.' + tableHtml(ts, ts.map(function (x) { return cl(sh.d0 - sh.q * x); }), 'Time (min)', 'Depth (cm)'); },
      parts: [
        { id: 'e16a', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          var st = cl(sh.q * 5);
          return num('(a) The depth drops by the same amount every 5 minutes, so the rate of change is constant. State it.', -sh.q, [{ v: -st, code: 'ctx-step', hint: 'That’s the change every <b>5</b> minutes. Divide by 5 for the change per minute.' }, { v: sh.q, code: 'ctx-rate-sign', hint: 'The depth is going down, so the rate is negative.' }, { v: -5 / st, code: 'ctx-flip', hint: 'Upside down: cm (depth) per minute.' }],
            'Each 5-minute step lowers the depth by ' + t(nf(st)) + ' cm: ' + t('m=\\dfrac{-' + nf(st) + '}{5}=' + nf(-sh.q)) + ' cm/min.', ['Find the change in depth for each step, then divide by the 5 minutes.'], 'rate from table', { before: t('m='), after: 'cm/min' });
        } },
        { id: 'e16b', level: 'PRG', outcome: 'RF4', make: function (r, sh) { return line('(b) Write an equation for the depth ' + t('d') + ' (cm) after ' + t('t') + ' minutes.', -sh.q, sh.d0, { X: 't', Y: 'd', wrong: [{ m: cl(-sh.q * 5), b: sh.d0, code: 'ctx-step', hint: 'The slope is the change per <b>minute</b>, not per 5 minutes.' }] }, t(eqTex('d', 't', -sh.q, sh.d0)) + ' (rate from (a), starting depth from the table at ' + t('t=0') + ').', ['The starting depth is the value at ' + t('t=0') + ' in the table.'], 'table equation'); } },
        { id: 'e16b2', sub: 'b ii', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var M = { Y: 'd', X: 't', what: 'the depth', yu: 'cm', ya: 'cm', each: 'minute', xs: 'minutes', up: 'increases', down: 'decreases', start: function (v) { return 'the water was ' + v + ' deep when the siphon started.'; } };
          return interMC(r, '(b) What does the ' + t('d') + '-intercept, ' + t(nf(sh.d0)) + ' cm, represent?', M, -sh.q, sh.d0, interSol(M, -sh.q, sh.d0), 'meaning of d-intercept');
        } },
        { id: 'e16c', sub: 'c', level: 'BEG', outcome: 'RF4', make: function (r, sh) {
          var v = cl(sh.d0 - sh.q * sh.t1);
          return num('(c) Predict the depth after ' + t(sh.t1) + ' minutes.', v, [{ v: sh.q * sh.t1, code: 'ctx-change', hint: 'That’s how much the depth has dropped. What is the depth now?' }], t('d=-' + nf(sh.q) + '(' + sh.t1 + ')+' + nf(sh.d0) + '=' + nf(-sh.q * sh.t1) + '+' + nf(sh.d0) + '=' + nf(v)) + ' cm', ['Substitute ' + t('t=' + sh.t1) + '.'], 'predict depth', { after: 'cm' });
        } },
        { id: 'e16d', sub: 'd', level: 'PRG', outcome: 'RF4', make: function (r, sh) {
          var S = cl(sh.d0 - sh.q * sh.tS);
          return num('(d) The siphon must be stopped at a depth of ' + t(nf(S)) + ' cm. When is that?', sh.tS, [{ v: S / sh.q, code: 'ctx-no-sub', hint: 'Use the whole equation: ' + t(nf(S) + '=-' + nf(sh.q) + 't+' + nf(sh.d0)) + '.' }, { v: (sh.d0 + S) / sh.q, code: 'ctx-add-b', hint: 'Subtract ' + t(nf(sh.d0)) + ' from both sides.' }],
            t(nf(S) + '=-' + nf(sh.q) + 't+' + nf(sh.d0) + '\\Rightarrow -' + nf(sh.q) + 't=' + nf(S - sh.d0) + '\\Rightarrow t=' + sh.tS) + ' min', ['Set ' + t('d=' + nf(S)) + ' and solve.'], 'time for depth', { after: 'min' });
        } }] },
    /* ---------------- Part F ---------------- */
    { num: '17', section: 'Extra practice F — Error Analysis and Reasoning', shared: function (r) {
        if (r.chance(0.25)) return { p: 2.4, f: 15, item: 'kilogram', X: 'k' };
        var c = r.pick([['kilogram', 'k'], ['kilometre', 'k'], ['litre', 'L'], ['hour', 'h']]); return { p: r.pick([1.8, 2.4, 2.6, 3.2, 3.5, 4.5]), f: r.pick([5, 8, 10, 12, 15, 20]), item: c[0], X: c[1] };
      },
      stem: function (sh) { return 'Asked what the slope of ' + t('C=' + fx(sh.p, 2) + sh.X + '+' + sh.f) + ' means (with ' + t('C') + ' in dollars and ' + t(sh.X) + ' in ' + sh.item + 's), Devon wrote: “The slope is ' + t(fx(sh.p, 2)) + ', so the cost goes up by ' + t(fx(sh.p, 2)) + '.”'; },
      parts: [
        { id: 'e17a', level: 'EMG', outcome: 'RF3', make: function (r, sh) {
          return mc(r, '(a) What is missing from Devon’s answer?', [
            { html: 'The units and what the rate is “per”: it doesn’t say the cost goes up by ' + $(sh.p) + ' for each ' + sh.item + '.', right: true },
            { html: 'The sign: the slope should be negative.', why: 'The cost goes up, so the slope is positive. The sign isn’t the problem.' },
            { html: 'The intercept: he should have mentioned the ' + $(sh.f) + '.', why: 'The intercept is a separate fact. The slope’s meaning needs its units and the “per”.' },
            { html: 'Nothing — his answer is complete.', why: 'Goes up by ' + t(fx(sh.p, 2)) + ' <b>what</b>, and for each <b>what</b>? A rate needs both units.' }],
            '“Goes up by ' + fx(sh.p, 2) + '” could mean anything. A full interpretation names the quantity, the rate and both units: the cost increases by ' + $(sh.p) + ' for each additional ' + sh.item + '.', ['A rate always has two units: (units of ' + t('C') + ') per (unit of ' + t(sh.X) + ').'], 'what is missing');
        } },
        { id: 'e17b', level: 'BEG', outcome: 'RF3', make: function (r, sh) {
          return mc(r, '(b) Which is a complete interpretation of the slope?', [
            { html: 'The cost increases by ' + $(sh.p) + ' for each additional ' + sh.item + '.', right: true },
            { html: 'The cost is ' + $(sh.p) + '.', why: 'That is a single amount, not a rate. Per what?' },
            { html: 'The cost increases by ' + t(fx(sh.p, 2)) + ' ' + sh.item + 's for each dollar.', why: 'Upside down: dollars per ' + sh.item + '.' },
            { html: 'The cost starts at ' + $(sh.p) + '.', why: 'The starting cost is the intercept, ' + $(sh.f) + '.' }],
            t('m=' + fx(sh.p, 2)) + ' dollars per ' + sh.item + ': the cost increases by ' + $(sh.p) + ' for each additional ' + sh.item + '.', ['Name the quantity, the rate and both units.'], 'complete interpretation');
        } }] },
    { num: '18', shared: function (r) {
        if (r.chance(0.25)) return { t1: 2, t2: 6, V1: 320, V2: 240 };
        return gen(r, function (r) { var t1 = r.int(1, 4), t2 = t1 + r.pick([2, 4, 5]), q = r.pick([10, 15, 20, 25, 30]), V1 = r.pick(steps(200, 500, 20)), V2 = V1 - q * (t2 - t1); return V2 > 50 ? { t1: t1, t2: t2, V1: V1, V2: V2 } : null; });
      },
      stem: function (sh) { var her = cl((sh.t2 - sh.t1) / (sh.V2 - sh.V1)); return 'A tank drains steadily: it holds ' + t(sh.V1) + ' L after ' + t(sh.t1) + ' min and ' + t(sh.V2) + ' L after ' + t(sh.t2) + ' min. Brooke computed ' + t('\\dfrac{' + sh.t2 + '\\text{ min}-' + sh.t1 + '\\text{ min}}{' + sh.V2 + '\\text{ L}-' + sh.V1 + '\\text{ L}}=' + nf(her)) + ' and wrote “the tank drains at ' + t(nf(-her)) + ' L per minute.”'; },
      parts: [
        { id: 'e18a', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          return mc(r, '(a) Which two errors did Brooke make?', [
            { html: 'She divided the change in time by the change in volume (upside down), so her number is in minutes per litre — not the litres per minute she wrote.', right: true },
            { html: 'She subtracted in the wrong order, and she dropped the negative sign.', why: 'She subtracted in the same order on top and bottom (later minus earlier). The real problem is <b>which</b> change is on top.' },
            { html: 'She should have added the volumes, and she should have used hours.', why: 'A rate uses the <b>changes</b> (subtractions); minutes are fine here.' },
            { html: 'Her method is right; she only forgot the units.', why: 'Rate of change of volume = change in volume ÷ change in time. She has it upside down.' }],
            'Error 1: the slope formula has the change in volume on top: ' + t('\\dfrac{\\Delta V}{\\Delta t}') + ', not ' + t('\\dfrac{\\Delta t}{\\Delta V}') + '. Error 2: so her number is in min/L, which doesn’t match her label L/min.', ['Rate of change of the volume = (change in volume) ÷ (change in time).'], 'find the errors');
        } },
        { id: 'e18b', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          var q = (sh.V2 - sh.V1) / (sh.t2 - sh.t1), her = cl((sh.t2 - sh.t1) / (sh.V2 - sh.V1));
          return num('(b) State the correct rate of change of the volume.', q, [{ v: her, code: 'ctx-flip', hint: 'That’s Brooke’s upside-down answer. Put the change in volume on top.' }, { v: -q, code: 'ctx-rate-sign', hint: 'The volume is going down, so its rate of change is negative.' }, { v: sh.V2 - sh.V1, code: 'ctx-total', hint: 'Divide the change in volume by the change in time.' }],
            t('m=\\dfrac{' + sh.V2 + '-' + sh.V1 + '}{' + sh.t2 + '-' + sh.t1 + '}=\\dfrac{' + (sh.V2 - sh.V1) + '}{' + (sh.t2 - sh.t1) + '}=' + q) + ' L/min: the tank loses ' + t(-q) + ' L each minute.', ['Change in volume ÷ change in time.'], 'correct rate', { before: t('m='), after: 'L/min' });
        } }] },
    { num: '19', shared: function (r) {
        if (r.chance(0.25)) return { H: 5, sP: 20, kP: 4, sQ: 50, kQ: 2 };
        return gen(r, function (r) { var H = r.pick([4, 5]), sP = r.pick([10, 20]), sQ = r.pick([40, 50]), kP = r.pick([3, 4, 5]), kQ = r.pick([1, 2, 3]); if (kP <= kQ || kQ * sQ <= kP * sP || (kP * sP) % H || (kQ * sQ) % H) return null; return { H: H, sP: sP, kP: kP, sQ: sQ, kQ: kQ }; });
      },
      stem: function (sh) {
        var g = function (s, k, nm) { return '<div style="text-align:center;font-weight:600">Car ' + nm + '</div>' + fig({ x: [0, 5.4], y: [0, 5.4 * s], gx: 1, gy: s, lx: 1, ly: s, xn: 't', yn: 'd', xt: 'Time (h)', yt: 'Distance (km)', w: 200, h: 200, max: 260, segs: [{ pts: [[0, 0], [sh.H, k * s * (sh.H === 5 ? 1 : 1)]] }], aria: 'Car ' + nm + ' distance graph' }); };
        return '<b>Does a steeper-looking line always mean a faster rate?</b> The two graphs show two cars on a highway. Study both scales before you answer.' + figs([g(sh.sP, sh.kP, 'P'), g(sh.sQ, sh.kQ, 'Q')]);
      },
      parts: [
        { id: 'e19a', level: 'BEG', outcome: 'RF3', make: function (r, sh) {
          return mc(r, '(a) Which line <i>looks</i> steeper on the page?', [{ html: 'Car P’s line', right: true }, { html: 'Car Q’s line', why: 'Look at the pictures only: P’s line climbs ' + t(sh.kP) + ' squares in ' + t(sh.H) + ' squares across; Q’s climbs only ' + t(sh.kQ) + '.' }, { html: 'They look equally steep', why: 'Count the squares each line climbs.' }],
            'On the page, P’s line rises ' + t(sh.kP) + ' squares and Q’s rises ' + t(sh.kQ) + ' squares over the same ' + t(sh.H) + ' squares, so P’s <i>looks</i> steeper.', ['Ignore the numbers for now — just compare the pictures.'], 'looks steeper', true);
        } },
        { id: 'e19b', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          var P = sh.kP * sh.sP / sh.H, Q = sh.kQ * sh.sQ / sh.H;
          return nums('(b) Compute each car’s speed.', [
            { label: 'Car P:', ans: P, after: 'km/h', list: [{ v: sh.kP / sh.H, code: 'ctx-squares', hint: 'Use the axis labels: each square up on P’s graph is ' + t(sh.sP) + ' km.' }, { v: Q, code: 'ctx-swap-boxes', hint: 'That’s Car Q.' }] },
            { label: 'Car Q:', ans: Q, after: 'km/h', list: [{ v: sh.kQ / sh.H, code: 'ctx-squares', hint: 'Use the axis labels: each square up on Q’s graph is ' + t(sh.sQ) + ' km.' }, { v: P, code: 'ctx-swap-boxes', hint: 'That’s Car P.' }] }],
            'P: ' + t(nf(sh.kP * sh.sP) + '\\text{ km}\\div ' + sh.H + '\\text{ h}=' + P) + ' km/h<br>Q: ' + t(nf(sh.kQ * sh.sQ) + '\\text{ km}\\div ' + sh.H + '\\text{ h}=' + Q) + ' km/h', ['Read the distance at the end of each line from its own vertical scale, then divide by the time.'], 'speeds from graphs');
        } },
        { id: 'e19c', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          return mc(r, '(c) Which car is actually faster, and why is the picture misleading?', [
            { html: 'Car Q. The vertical scales differ (' + t(sh.sQ) + ' km per square vs ' + t(sh.sP) + '), so equal-looking rises are not equal distances. “Steeper means faster” is safe only when both graphs use the same scales.', right: true },
            { html: 'Car P, because its line is steeper.', why: 'Steepness on the page depends on the scales. Compare the speeds you computed.' },
            { html: 'Car Q, because a gentler line always means a faster car.', why: 'Q is faster here only because its scale is different — not because gentle lines are faster.' },
            { html: 'They have the same speed, because both drove for ' + t(sh.H) + ' hours.', why: 'Same time, but different distances: compare the speeds from (b).' }],
            'Q is faster (' + t(sh.kQ * sh.sQ / sh.H) + ' km/h vs ' + t(sh.kP * sh.sP / sh.H) + ' km/h). Q’s graph squeezes ' + t(sh.sQ) + ' km into each square, so its line looks flatter. Compare steepness only on graphs with the same scales.', ['Compare the speeds from (b), then look at the vertical scales.'], 'misleading graph');
        } }] },
    { num: '20', shared: function (r) {
        if (r.chance(0.25)) return { a: 0.42, b: 24.6 };
        return gen(r, function (r) { var a = r.pick([0.3, 0.35, 0.4, 0.42, 0.45, 0.38]), k = r.pick([-3, -2, -1, 1, 2, 3]), b = cl(a * 60 + 0.6 * k); return b > 10 ? { a: a, b: b } : null; });
      },
      stem: function (sh) { return '<b>Stretch.</b> One summer job pays ' + $(sh.a) + ' per minute worked; another pays ' + $(sh.b) + ' per hour.'; },
      parts: [
        { id: 'e20a', level: 'MAS', outcome: 'RF3', make: function (r, sh) {
          var h1 = cl(sh.a * 60), m2 = cl(sh.b / 60);
          return nums('(a) Convert both rates to the same units: the first job in dollars per hour, the second in dollars per minute.', [
            { label: 'First job:', ans: h1, money: true, after: 'per hour', list: [{ v: sh.a / 60, code: 'ctx-convert', hint: 'An hour is <b>longer</b> than a minute, so you earn more per hour: multiply by 60.' }, { v: sh.a * 100, code: 'u7l9-60', hint: 'An hour has 60 minutes.' }] },
            { label: 'Second job:', ans: m2, money: true, after: 'per minute', list: [{ v: sh.b * 60, code: 'ctx-convert', hint: 'A minute is shorter than an hour: divide by 60.' }, { v: sh.b / 100, code: 'u7l9-60', hint: 'An hour has 60 minutes.' }] }],
            t('\\$' + fx(sh.a, 2) + '/\\text{min}\\times 60=\\$' + fx(h1, 2)) + '/h<br>' + t('\\$' + fx(sh.b, 2) + '/\\text{h}\\div 60=\\$' + fx(m2, 2)) + '/min<br>The ' + (h1 > sh.b ? 'first' : 'second') + ' job pays more.',
            ['One hour = 60 minutes. Per hour → per minute: divide by 60. Per minute → per hour: multiply by 60.'], 'convert pay rates');
        } },
        { id: 'e20b', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          var firstMore = sh.a * 60 > sh.b, A = $(sh.a), Bb = $(sh.b);
          return mc(r, '(b) Which job pays more, and why does comparing ' + t(fx(sh.a, 2)) + ' with ' + t(fx(sh.b, 2)) + ' directly tell you nothing?', [
            { html: 'The ' + (firstMore ? 'first' : 'second') + ' job. ' + A + ' is dollars per <b>minute</b> and ' + Bb + ' is dollars per <b>hour</b>, so the numbers can’t be compared until the units match.', right: true },
            { html: 'The second job, because ' + t(fx(sh.b, 2)) + ' is bigger than ' + t(fx(sh.a, 2)) + '.', why: firstMore ? 'The numbers have different units. Convert first: the first job is ' + $(sh.a * 60) + ' per hour.' : 'Right job, wrong reason: the numbers have different units, so compare only after converting.' },
            { html: 'The ' + (firstMore ? 'second' : 'first') + ' job. ' + A + ' is dollars per minute and ' + Bb + ' is dollars per hour, so convert first.', why: 'Right idea — now compare the converted rates from (a): the first job pays ' + $(sh.a * 60) + ' per hour.' },
            { html: 'They pay the same, because both are rates of pay.', why: 'Convert to the same units and compare: ' + $(sh.a * 60) + ' per hour vs ' + Bb + ' per hour.' }],
            'In the same units: first job ' + $(sh.a * 60) + '/h vs second job ' + Bb + '/h. The ' + (firstMore ? 'first' : 'second') + ' job pays more. ' + t(fx(sh.a, 2)) + ' and ' + t(fx(sh.b, 2)) + ' are in different units, so comparing them directly means nothing.', ['Use your answers from (a).'], 'compare pay rates');
        } }] },
    { num: '21', shared: function (r) {
        if (r.chance(0.25)) return { q: 18, V0: 540, tm: 15 };
        return gen(r, function (r) { var q = r.pick([6, 8, 10, 12, 15, 18, 20]), tm = r.pick([6, 12, 15, 30]), V0 = r.pick(steps(300, 900, 60)); return V0 - q * tm > 0 && V0 / q > 20 ? { q: q, V0: V0, tm: tm } : null; });
      },
      stem: function (sh) { return 'Two students model the same draining tank. Ama writes ' + t('V=-' + sh.q + 't+' + sh.V0) + ' with ' + t('t') + ' in minutes; Ben writes ' + t('V=-' + nf(sh.q * 60) + 't+' + sh.V0) + ' with ' + t('t') + ' in hours.'; },
      parts: [
        { id: 'e21a', level: 'PRG', outcome: 'RF3', make: function (r, sh) {
          return mc(r, '(a) Can both be right?', [
            { html: 'Yes: ' + t(sh.q + '\\text{ L/min}\\times 60=' + nf(sh.q * 60)) + ' L/h, so the slopes are the same rate in different time units, and both start at ' + t(sh.V0) + ' L.', right: true },
            { html: 'No: the slopes are different numbers, so the models describe different tanks.', why: 'A rate’s number changes when its units change. Convert Ama’s rate to litres per hour.' },
            { html: 'No: Ben’s tank drains 60 times faster.', why: 'Ben’s number is 60 times bigger because an hour is 60 minutes — the tank drains at the same speed.' },
            { html: 'Yes, because any two models with the same intercept describe the same tank.', why: 'The intercepts match, but the slopes must also be the same rate (once the units are converted).' }],
            t(sh.q + '\\text{ L/min}\\times 60\\text{ min/h}=' + nf(sh.q * 60) + '\\text{ L/h}') + ': the same rate. Both start at ' + t(sh.V0) + ' L. So both models are right.', ['Convert Ama’s rate to litres per hour.'], 'same model, different units');
        } },
        { id: 'e21b', level: 'ADV', outcome: 'RF4', make: function (r, sh) {
          var v = sh.V0 - sh.q * sh.tm, h = cl(sh.tm / 60);
          return nums('(b) State the volume each model predicts at ' + t(sh.tm) + ' minutes.', [
            { label: 'Ama:', ans: v, after: 'L', list: [{ v: sh.q * sh.tm, code: 'ctx-change', hint: 'That’s how much has drained.' }] },
            { label: 'Ben:', ans: v, after: 'L', list: [{ v: sh.V0 - sh.q * 60 * sh.tm, code: 'ctx-noconv', hint: 'Ben’s ' + t('t') + ' is in <b>hours</b>: ' + t(sh.tm) + ' min ' + t('=' + nf(h)) + ' h.' }, { v: sh.V0 - sh.q * 60 * sh.tm / 100, code: 'u7l9-60', hint: 'An hour has 60 minutes: ' + t(sh.tm + '\\div 60=' + nf(h)) + '.' }] }],
            'Ama: ' + t('-' + sh.q + '(' + sh.tm + ')+' + sh.V0 + '=' + v) + ' L<br>Ben: ' + t(sh.tm) + ' min ' + t('=' + nf(h)) + ' h: ' + t('-' + nf(sh.q * 60) + '(' + nf(h) + ')+' + sh.V0 + '=' + v) + ' L — they agree.', ['For Ben, change the minutes to hours first.'], 'both models agree');
        } }] }
  ];

  LESSON.extra = EXTRA;
  HW.defineLesson(LESSON);
})(window);
