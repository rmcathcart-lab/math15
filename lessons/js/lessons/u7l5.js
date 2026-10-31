/* Math 15 · Unit 7 · Lesson 5 — Writing the Equation of a Line Given Slope and a Point.
 * Warm-up (The Piggy Bank: jars for weeks 0–7, only week 6 known; rewind and forward a week at a time), and the explainers:
 *   family (slope alone gives a whole family of parallel lines; the point picks one; its b comes from substituting),
 *   drop / drop1 … drop4 (STAR: the slope and the point fly into y = mx + b, multiply, solve for b, rewrite, check;
 *          chips: the walkthrough, the warm-up, and an "Example N check" for every booklet example part),
 *   rewind (walk back from the point to the y-axis one step at a time — left 1, change by the slope — and land on b),
 *   slips (stopping at b; swapping x and y — and how putting the point back in catches it),
 *   hop (b is the jump on a number line from mx to y: negative products and negative coordinates),
 *   half (a fraction of a number with counters: divide by the bottom, multiply by the top; why the points divide evenly),
 *   balloon (Example 5: the balloon rewinds to t = 0 to find b = 450, then flies on to t = 12).
 * Colours: slope blue, the given point red, b green, run amber, rise purple. Pieces adapted from the Math 10C u7l4 page
 * (fly-in, slope triangle, balloon). Math 15 uses only the substitute-and-solve method (no slope–point form). */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, pulse, shake,
  texNum, svgEl, liveCtx, place, drawIn, anim, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const MC = COLORS.blue, PC = COLORS.red, BC = COLORS.green, RUN = COLORS.amber, RISE = COLORS.purple, INK = COLORS.ink, GRAY = COLORS.gray;
const tc = (c) => (s) => `\\textcolor{${c}}{${s}}`;
const cM = tc(MC), cP = tc(PC), cB = tc(BC), cU = tc(RUN), cR = tc(RISE);
/* KaTeX allowing \htmlClass (pieces that fly in); data-tex keeps the source for the dump script */
const escA = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const K = (src) => {
  try { return window.katex.renderToString(String(src), { throwOnError: false, strict: 'ignore', trust: true, output: 'html' }).replace('<span class="katex"', '<span data-tex="' + escA(String(src)) + '" class="katex"'); }
  catch (e) { return tex(src); }
};
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/* ---- tiny rational arithmetic: { n, d } with d > 0, lowest terms ---- */
const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g + 0, d: d / g }; };
const qv = (q) => q.n / q.d;
const qMul = (a, b) => Q(a.n * b.n, a.d * b.d);
const qSub = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d);
const qAbs = (a) => Q(Math.abs(a.n), a.d);
/** TeX of a rational: whole numbers plain, else (−)\tfrac */
const qT = (q) => (q.d === 1 ? String(q.n) : (q.n < 0 ? '-' : '') + `\\tfrac{${Math.abs(q.n)}}{${q.d}}`);
/** coefficient in front of a variable: 1 → '', −1 → '-' */
const coef = (q) => (q.d === 1 && q.n === 1 ? '' : q.d === 1 && q.n === -1 ? '-' : qT(q));
const sgnT = (q) => (q.n < 0 ? '-' : '+') + qT(qAbs(q));
/** y = mx + b as TeX */
const eqT = (m, b, xv = 'x', yv = 'y') => `${yv}=${coef(m)}${xv}` + (b.n === 0 ? '' : sgnT(b));
/** plain-text number with a real minus */
const n = (v) => texNum(v).replace('-', '−');
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u7l5-panel ' + cls, title ? `<div class="u7l5-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u7l5-line ' + cls, html); p.appendChild(d); return d; };
const answerBox = async (c, P, html) => { const r = h('div', 'u7l5-ansbox', `<span class="u7l5-tick">✓</span> ${html}`); P.appendChild(r); await pop(c, r, 450); return r; };
const badStamp = (host, text, x, y) => stamp(host, text, { ok: false, x, y });

/** everything one slope-and-point problem needs, worked out up front (captions are computed before their step runs) */
function work(m, P, xv = 'x', yv = 'y') {
  const [x1, y1] = P, prod = qMul(m, Q(x1)), b = qSub(Q(y1), prod), pv = qv(prod);
  return {
    m, x1, y1, prod, b, xv, yv,
    tmpl: `${yv}=${coef(m)}${xv}+b`,                                     // y = 3x + b
    sub: `${y1}=${qT(m)}(${x1})+b`,                                      // 5 = 3(2) + b
    mult: `${y1}=${qT(prod)}+b`,                                         // 5 = 6 + b
    solve: `b=${y1}${pv > 0 ? '-' + qT(prod) : '+' + qT(qAbs(prod))}=${qT(b)}`, // b = 5 − 6 = −1
    undo: pv > 0 ? `${T(`-${qT(prod)}`)} on both sides` : `${T(`+${qT(qAbs(prod))}`)} on both sides`,
    undoWord: pv > 0 ? `subtract ${T(qT(prod))} from both sides` : `add ${T(qT(qAbs(prod)))} to both sides`,
    final: eqT(m, b, xv, yv),
    check: `${qT(m)}(${x1})${sgnT(b)}=${qT(prod)}${sgnT(b)}=${y1}`
  };
}

/** move an element (HTML) from one element's spot to another's inside a stage (from the 10C u7l4 page) */
async function fly(c, stage, fromEl, toEl, html, cls = '') {
  const S = stage.getBoundingClientRect(), k = S.width / (stage.offsetWidth || S.width) || 1;
  const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
  const ax = (a.left + a.width / 2 - S.left) / k, ay = (a.top + a.height / 2 - S.top) / k;
  const bx = (b.left + b.width / 2 - S.left) / k, by = (b.top + b.height / 2 - S.top) / k;
  const f = add(stage, h('div', 'u7l5-fly ' + cls, html), ax, ay);
  f.style.translate = '-50% -50%';
  try {
    await anim(c, f, [{ left: ax + 'px', top: ay + 'px', transform: 'scale(1)' }, { left: (ax + bx) / 2 + 'px', top: Math.min(ay, by) - 40 + 'px', transform: 'scale(1.25)', offset: 0.5 }, { left: bx + 'px', top: by + 'px', transform: 'scale(1)' }], 750);
  } finally { f.remove(); }
}

/** a graph with equal x and y scales that fits in maxW × maxH (from the u6l6 page). o: { x, y, center, g } */
function sqGraph(host, win, maxW, maxH, o = {}) {
  const g = o.g || {}, numbers = g.numbers !== false;
  const pd = o.pad || [18, 18, numbers && win.ymin >= 0 ? 34 : 18, numbers && win.xmin >= 0 ? 42 : 18];
  const xr = win.xmax - win.xmin, yr = win.ymax - win.ymin;
  const u = Math.min((maxW - pd[1] - pd[3]) / xr, (maxH - pd[0] - pd[2]) / yr);
  const W = u * xr + pd[1] + pd[3], H = u * yr + pd[0] + pd[2];
  const opts = Object.assign({ width: W, height: H, pad: pd }, win, g);
  if (o.x != null) { opts.x = o.x + (o.center ? (maxW - W) / 2 : 0); opts.y = (o.y || 0) + (o.center ? (maxH - H) / 2 : 0); }
  const G = new Graph(host, opts); G.W = W; G.H = H; return G;
}

/* =============================== warm-up: the piggy bank =============================== */
function mountJars() {
  const host = document.getElementById('u7l5-jars'); if (!host) return;
  const W = 640, H = 330, base = 262, top = 62, per = (base - top) / 60, X = (i) => 128 + i * 66, JW = 46;
  const amt = (i) => 17 + 5 * i, Y = (v) => base - v * per;
  const wrap = h('div', 'u7l5-jwrap'); box(wrap, W, H); host.appendChild(wrap);
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, wrap);
  const html = h('div', 'bk-html'); wrap.appendChild(html);
  const lab = (x, y, s, pos, cls) => { const d = h('div', 'bk-lab ' + cls, s); html.appendChild(d); return place(d, x, y, pos, 4); };
  // shelf and money scale
  svgEl('rect', { x: 70, y: base, width: W - 82, height: 10, fill: '#f1dca8' }, svg);
  svgEl('line', { x1: 70, x2: W - 12, y1: base, y2: base, stroke: '#a8771a', 'stroke-width': 2.5 }, svg);
  svgEl('rect', { x: 52, y: top - 4, width: 16, height: base - top + 4, fill: '#e8f0fc', stroke: INK, 'stroke-width': 1.2 }, svg);
  for (let v = 0; v <= 60; v += 5) svgEl('line', { x1: 68, x2: v % 10 ? 60 : 54, y1: Y(v), y2: Y(v), stroke: INK, 'stroke-width': v % 10 ? 1 : 2 }, svg);
  for (let v = 0; v <= 60; v += 10) lab(50, Y(v), String(v), 'w', 'u7l5-jnum');
  lab(30, top - 26, 'money ($)', 'c', 'u7l5-jax');
  lab(56, base + 26, 'week', 'w', 'u7l5-jax');
  for (let i = 0; i <= 7; i++) lab(X(i), base + 26, String(i), 'c', 'u7l5-jwk');
  lab(X(0), base + 50, 'start', 'c', 'u7l5-jtag u7l5-jstart');
  lab(X(6), base + 50, 'peek!', 'c', 'u7l5-jtag');
  const arrows = svgEl('g', {}, svg);
  const slots = [];
  for (let i = 0; i <= 7; i++) {
    const g = svgEl('g', {}, svg), x = X(i);
    const q = svgEl('g', {}, g);
    svgEl('rect', { x: x - JW / 2 - 2, y: top - 2, width: JW + 4, height: base - top - 2, rx: 6, fill: 'none', stroke: PC, 'stroke-width': 2, 'stroke-dasharray': '6 4' }, q);
    const qm = svgEl('text', { x, y: (top + base) / 2 + 14, 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 800, fill: PC }, q); qm.textContent = '?';
    const jar = svgEl('g', {}, g);
    const fill = svgEl('rect', { x: x - JW / 2 + 3, width: JW - 6, y: base, height: 0, fill: '#e4b343' }, jar);
    svgEl('path', { d: `M${x - JW / 2 + 4} ${top + 14} L${x - JW / 2} ${top + 22} L${x - JW / 2} ${base - 1} L${x + JW / 2} ${base - 1} L${x + JW / 2} ${top + 22} L${x + JW / 2 - 4} ${top + 14}`, fill: 'none', stroke: INK, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, jar);
    svgEl('rect', { x: x - JW / 2 + 2, y: top + 2, width: JW - 4, height: 12, rx: 3, fill: '#d9574f', stroke: INK, 'stroke-width': 1.5 }, jar);
    const tag = lab(x, (top + base) / 2 + 30, '', 'c', 'u7l5-jamt');
    slots.push({ q, jar, fill, tag, i });
  }
  const known = new Set();
  const setFill = (s, v) => { s.fill.setAttribute('y', Y(v)); s.fill.setAttribute('height', Math.max(0, base - Y(v))); };
  const showSlot = (s, on, v) => { s.q.style.display = on ? 'none' : ''; s.jar.style.display = on ? '' : 'none'; s.tag.style.display = on ? '' : 'none'; if (on) { setFill(s, v); s.tag.innerHTML = '$' + v; } };
  const reset = () => { known.clear(); known.add(6); arrows.innerHTML = ''; slots.forEach((s) => showSlot(s, s.i === 6, amt(s.i))); };
  reset();
  const arrow = (from, to) => {
    const x1 = X(from) + (to < from ? -10 : 10), x2 = X(to) + (to < from ? 10 : -10), yy = top - 10, back = to < from, col = back ? PC : BC;
    const p = svgEl('path', { d: `M${x1} ${yy} Q${(x1 + x2) / 2} ${yy - 30} ${x2} ${yy}`, fill: 'none', stroke: col, 'stroke-width': 2.4 }, arrows);
    svgEl('polygon', { points: back ? `${x2},${yy} ${x2 + 3},${yy - 11} ${x2 + 11},${yy - 4}` : `${x2},${yy} ${x2 - 3},${yy - 11} ${x2 - 11},${yy - 4}`, fill: col }, arrows);
    const t = svgEl('text', { x: (x1 + x2) / 2, y: yy - 20, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: col }, arrows); t.textContent = back ? '−$5' : '+$5';
    return p;
  };
  let gen = 0;
  const reveal = async (i, from, my) => {
    const s = slots[i], c = liveCtx(); known.add(i); arrow(from, i);
    showSlot(s, true, amt(from)); s.tag.innerHTML = '$' + amt(from);
    await tween(c, 650, (k) => { if (my !== gen) return false; setFill(s, amt(from) + (amt(i) - amt(from)) * k); });
    s.tag.innerHTML = '$' + amt(i); await c.pop(s.tag, 300);
  };
  const lo = () => Math.min(...known), hi = () => Math.max(...known);
  const btn = (id, f) => { const b = document.getElementById(id); if (b) b.addEventListener('click', f); };
  btn('u7l5-back', () => { if (lo() > 0) reveal(lo() - 1, lo(), gen); });
  btn('u7l5-fwd', () => { if (hi() < 7) reveal(hi() + 1, hi(), gen); });
  btn('u7l5-all', async () => { const my = gen; while (lo() > 0 && my === gen) await reveal(lo() - 1, lo(), my); });
  btn('u7l5-jreset', () => { gen++; reset(); });
}

/* =============================== explainer: one slope, a family of lines =============================== */
const FA = {
  walk: { label: 'Walkthrough: ' + T('m=3,\\ (2,5)'), m: 3, P: [2, 5], bs: [-10, -7, -4, 2, 5, 8], win: { xmin: -5, xmax: 5, ymin: -8, ymax: 10 } },
  e1b: { label: 'Example 1(b) check', m: 2, P: [5, 7], bs: [-9, -6, 0, 3, 6, 9], win: { xmin: -2, xmax: 7, ymin: -6, ymax: 10 } }
};
const family = {
  title: 'Slope alone isn’t enough: the point picks the line',
  height: 470,
  minW: 900,
  capH: 96,
  choices: Object.keys(FA).map((k) => ({ v: k, label: FA[k].label })),
  intro: 'Knowing the slope tells us how steep the line is, but not <b>where</b> it is. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = FA[k], H = ex.def.height, wk = work(Q(d.m), d.P), [x1, y1] = d.P, bv = qv(wk.b);
    const G = sqGraph(stage, d.win, 470, H - 20, { x: 10, y: 10, center: true, g: { xlabels: 2, ylabels: 2 } });
    const Pn = panel(stage, 500, 10, ex.W - 514, H - 20, 'The algebra');
    let fam = [], ql;
    return [
      { cap: `Slope ${T(cM(String(d.m)))}: up ${d.m} for every 1 across. But <b>lots</b> of lines have slope ${d.m}, one for every value of ${T('b')}. They are all parallel.`,
        run: async (c) => {
          fam = d.bs.map((b) => G.line({ m: d.m, b }, { color: MC, width: 3, dash: '7 6', arrows: false }));
          for (const f of fam) await G.drawIn(f, 220, c);
          await show(c, line(Pn, `${T(wk.tmpl)}<br><span class="u7l5-soft">${T('b')} could be anything…</span>`));
        } },
      { cap: `Now the point ${T(cP(`(${x1},${y1})`))}. Only <b>one</b> of these lines goes through it.`,
        run: async (c) => {
          await pop(c, G.point(x1, y1, { color: PC, r: 8, label: T(cP(`(${x1},${y1})`)), pos: 'se' }));
          const L = G.line({ m: d.m, b: bv }, { color: MC, width: 4.5 }); await G.drawIn(L, 500, c);
          await Promise.all(fam.map((f) => anim(c, f, [{ opacity: 1 }, { opacity: 0.18 }], 400)));
        } },
      { cap: `That line crosses the ${T('y')}-axis at ${T(cB('b'))}. We can’t read it exactly yet, so we <b>solve</b> for it.`,
        run: async (c) => { ql = G.label(0, bv, `<b>b = ?</b>`, { pos: d.m > 0 ? 'nw' : 'sw', cls: 'u7l5-qlab' }); await pop(c, ql); } },
      { cap: `Every point on the line makes the equation true, including ${T(cP(`(${x1},${y1})`))}: ${T(wk.sub)}, so ${T(wk.mult)}.`,
        run: async (c) => { await show(c, line(Pn, T(wk.sub))); await show(c, line(Pn, T(wk.mult))); } },
      { cap: `${wk.undoWord[0].toUpperCase() + wk.undoWord.slice(1)}: ${T(wk.solve)}. The line crosses at ${T(cB(`(0,${qT(wk.b)})`))} ✓`,
        run: async (c) => {
          await show(c, line(Pn, T(cB(wk.solve))));
          ql.style.opacity = 0;
          await pop(c, G.point(0, bv, { color: BC, r: 8, label: T(cB(`(0,${qT(wk.b)})`)), pos: d.m > 0 ? 'nw' : 'sw' }));
          await answerBox(c, Pn, T(wk.final));
        } }
    ];
  }
};

/* =============================== STAR explainer: drop the slope and the point into y = mx + b =============================== */
const DR = {
  walk: { label: 'Walkthrough: ' + T('m=3,\\ (2,5)'), m: Q(3), P: [2, 5] },
  piggy: { label: 'Warm-up: the piggy bank', m: Q(5), P: [6, 47], xv: 'w', yv: 'M', note: 'Week 6, $47; $5 a week.' },
  e1a: { label: 'Example 1(a) check', m: Q(4), P: [1, 9] },
  e1b: { label: 'Example 1(b) check', m: Q(2), P: [5, 7] },
  e2a: { label: 'Example 2(a) check', m: Q(-3), P: [2, 9] },
  e2b: { label: 'Example 2(b) check', m: Q(5), P: [1, -2] },
  e3a: { label: 'Example 3(a) check', m: Q(2), P: [-4, -5] },
  e3b: { label: 'Example 3(b) check', m: Q(-3), P: [-2, -1] },
  e4a: { label: 'Example 4(a) check', m: Q(1, 2), P: [8, 7] },
  e4b: { label: 'Example 4(b) check', m: Q(-3, 4), P: [4, -1] }
};
const METHOD = ['Slope in for <b>m</b>', 'Point in: <b>x</b> with <b>x</b>, <b>y</b> with <b>y</b>', 'Solve for <b>b</b>', '<b>Rewrite</b> the equation'];
const dropDef = (keys) => ({
  title: 'Substitute and solve for b',
  height: 470,
  minW: 900,
  capH: 96,
  choices: keys.map((k) => ({ v: k, label: DR[k].label })),
  intro: 'The slope goes in for <b>m</b>, the point goes in for <b>x</b> and <b>y</b>. Then only <b>b</b> is left. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = DR[k], xv = d.xv || 'x', yv = d.yv || 'y', wk = work(d.m, d.P, xv, yv), H = ex.def.height, neg = d.m.n < 0 || wk.x1 < 0 || wk.y1 < 0;
    const LW = 300, D = (src) => src.replace(/\\tfrac/g, '\\dfrac');   // full-size fractions in the work lines
    const given = add(stage, box(h('div', 'u7l5-given'), LW, 150), 14, 14);
    given.innerHTML = `<div class="u7l5-gk">Given</div><div class="u7l5-grow">slope <span class="u7l5-gm">${T(cM(D(qT(d.m))))}</span></div>`
      + `<div class="u7l5-grow">point ${T('(')}<span class="u7l5-gx">${T(cP(String(wk.x1)))}</span>${T(',\\ ')}<span class="u7l5-gy">${T(cP(String(wk.y1)))}</span>${T(')')}</div>`
      + (d.note ? `<div class="u7l5-gnote">${d.note}</div>` : '');
    const steps = add(stage, box(h('div', 'u7l5-dsteps'), LW, H - 190), 14, 176);
    steps.innerHTML = METHOD.map((s, i) => `<div class="u7l5-ds"><span class="u7l5-dsn">${i + 1}</span><span>${s}</span></div>`).join('');
    const rows = [...steps.querySelectorAll('.u7l5-ds')];
    const setStep = (i) => rows.forEach((r, j) => { r.classList.toggle('on', j === i); r.classList.toggle('done', j < i); });
    const Pn = panel(stage, LW + 34, 14, ex.W - LW - 48, H - 28, '', 'u7l5-dwork');
    const L = (src, cls = '') => line(Pn, K(D(src)), 'u7l5-dline ' + cls);
    let lSub;
    return [
      { cap: `Start with ${T(`${yv}=m${xv}+b`)}. We know ${T('m')} and one point; ${T('b')} is the unknown.`,
        run: async (c) => { setStep(-1); await show(c, L(`${yv}=${cM('m')}${xv}+${cB('b')}`, 'u7l5-soft')); } },
      { cap: `<b>Step 1.</b> The slope ${T(cM(qT(d.m)))} goes in for ${T('m')}: ${T(wk.tmpl)}.`,
        run: async (c) => {
          setStep(0);
          const r = L(`${yv}=\\htmlClass{u7l5-sm}{${cM(coef(d.m) || '\\phantom{1}')}}${xv}+b`); hide(r.querySelector('.u7l5-sm'));
          await fly(c, stage, given.querySelector('.u7l5-gm'), r.querySelector('.u7l5-sm'), T(cM(D(qT(d.m)))), 'u7l5-flym');
          r.innerHTML = K(D(`${yv}=${cM(coef(d.m))}${xv}+b`)); await pop(c, r, 300);
        } },
      { cap: `<b>Step 2.</b> Substitute the point: ${T(cP(String(wk.x1)))} for ${T(xv)}, ${T(cP(String(wk.y1)))} for ${T(yv)}${neg ? '. Keep each number’s sign, and put the <b>brackets</b> on' : ''}: ${T(wk.sub)}.`,
        run: async (c) => {
          setStep(1);
          lSub = L(`\\htmlClass{u7l5-sy}{${cP(String(wk.y1))}}=${cM(qT(d.m))}(\\htmlClass{u7l5-sx}{${cP(String(wk.x1))}})+b`);
          const sx = lSub.querySelector('.u7l5-sx'), sy = lSub.querySelector('.u7l5-sy'); hide(sx); hide(sy);
          await fly(c, stage, given.querySelector('.u7l5-gx'), sx, T(cP(String(wk.x1))), 'u7l5-flyp'); sx.style.opacity = 1; await pop(c, sx, 260);
          await fly(c, stage, given.querySelector('.u7l5-gy'), sy, T(cP(String(wk.y1))), 'u7l5-flyp'); sy.style.opacity = 1; await pop(c, sy, 260);
        } },
      { cap: `Multiply: ${T(`${qT(d.m)}(${wk.x1})=${qT(wk.prod)}`)}${d.m.d > 1 ? ` (divide by the bottom, times the top)` : ''}. Now ${T(wk.mult)}: only ${T('b')} is unknown.`,
        run: async (c) => { await show(c, L(wk.mult)); } },
      { cap: `<b>Step 3.</b> Solve for ${T('b')}: ${wk.undoWord}. ${T(wk.solve)}.`,
        run: async (c) => {
          setStep(2);
          const r = line(Pn, `${K(D(cB(wk.solve)))}<span class="u7l5-badge">${wk.undo}</span>`, 'u7l5-dline'); await show(c, r);
        } },
      { cap: `<b>Step 4.</b> Don’t stop at ${T('b')}! Rewrite the equation with ${T(`m=${qT(d.m)}`)} and ${T(`b=${qT(wk.b)}`)}: ${T('\\boldsymbol{' + wk.final + '}')}.`,
        run: async (c) => { setStep(3); const r = L(`${wk.final}`, 'u7l5-dfinal'); await pop(c, r, 420); } },
      { cap: `<b>Check.</b> Put the point back in: ${T(wk.check)} ✓ The point is on the line.`,
        run: async (c) => {
          setStep(4);
          await show(c, line(Pn, `Check: ${T(wk.check)} ✓`, 'u7l5-chk'));
          await stampIn(c, stamp(stage, '✓', { ok: true, x: ex.W - 84, y: H - 110, size: 'lg' }));
        } }
    ];
  }
});
const drop = dropDef(['walk', 'piggy']);
const drop1 = dropDef(['e1a', 'e1b']);
const drop2 = dropDef(['e2a', 'e2b']);
const drop3 = dropDef(['e3a', 'e3b']);
const drop4 = dropDef(['e4a', 'e4b']);

/* =============================== explainer: rewind to the y-axis =============================== */
const RW = {
  piggy: { label: 'Warm-up: the piggy bank', m: 5, P: [6, 47], xv: 'w', yv: 'M', win: { xmin: 0, xmax: 8, ymin: 0, ymax: 55, ystep: 5 }, xl: 1, yl: 10, sq: false },
  walk: { label: 'Walkthrough: ' + T('m=3,\\ (2,5)'), m: 3, P: [2, 5], win: { xmin: -3, xmax: 4, ymin: -4, ymax: 9 }, xl: 1, yl: 2, sq: true },
  e1a: { label: 'Example 1(a) check', m: 4, P: [1, 9], win: { xmin: -3, xmax: 3, ymin: -1, ymax: 11 }, xl: 1, yl: 2, sq: true },
  e1b: { label: 'Example 1(b) check', m: 2, P: [5, 7], win: { xmin: -1, xmax: 7, ymin: -5, ymax: 9 }, xl: 1, yl: 2, sq: true }
};
const rewind = {
  title: 'Walk back to the y-axis and land on b',
  height: 480,
  minW: 900,
  capH: 96,
  choices: Object.keys(RW).map((k) => ({ v: k, label: RW[k].label })),
  intro: 'From the point, take one step back at a time until <b>x = 0</b>. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = RW[k], H = ex.def.height, [x1, y1] = d.P, xv = d.xv || 'x', yv = d.yv || 'y', m = d.m, b = y1 - m * x1, nS = x1;
    const g = { xlabels: d.xl, ylabels: d.yl, xtitle: xv, ytitle: yv, origin: d.win.xmin === 0 };
    const G = d.sq ? sqGraph(stage, d.win, 470, H - 20, { x: 10, y: 10, center: true, g })
      : new Graph(stage, Object.assign({ x: 10, y: 10, width: 470, height: H - 20 }, d.win, g));
    if (!G.W) G.W = 470;
    const Pn = panel(stage, 500, 10, ex.W - 514, H - 20, 'Step back');
    const vals = []; for (let i = 0; i <= nS; i++) vals.push(y1 - m * i);
    const chainT = vals.map((v) => texNum(v)).join('\\to ');
    let seq;
    return [
      { cap: `The point ${T(cP(`(${x1},${y1})`))} is on the line. The ${T(yv)}-axis is where ${T(`${xv}=0`)}: that is <b>${nS} step${nS > 1 ? 's' : ''}</b> to the left.`,
        run: async (c) => {
          await pop(c, G.point(x1, y1, { color: PC, r: 8, label: T(cP(`(${x1},${y1})`)), pos: 'se' }));
          seq = line(Pn, T(cP(texNum(y1))), 'u7l5-big'); await show(c, seq);
        } },
      { cap: `Each step back: <b class="u7l5-c-run">left 1</b>, and ${T(yv)} goes <b class="u7l5-c-rise">down ${m}</b> (the slope is ${m}, so going backwards takes ${m} away).`,
        run: async (c) => {
          const s = G.segment([x1, y1], [x1 - 1, y1], { color: RUN, width: 5 }); await G.drawIn(s, 350, c);
          const r = G.segment([x1 - 1, y1], [x1 - 1, y1 - m], { color: RISE, width: 5 }); await G.drawIn(r, 350, c);
          await pop(c, G.label(x1 - 0.5, y1, '<b>−1</b>', { pos: 'n', cls: 'u7l5-tlab u7l5-trun', gap: 4 }));
          await pop(c, G.label(x1 - 1, y1 - m / 2, `<b>−${m}</b>`, { pos: 'w', cls: 'u7l5-tlab u7l5-trise', gap: 6 }));
          await pop(c, G.point(x1 - 1, y1 - m, { color: INK, r: 5.5 }));
          seq.innerHTML = T(`${cP(texNum(y1))}\\to ${texNum(y1 - m)}`);
        } },
      ...(nS > 1 ? [{ cap: `Keep going until ${T(`${xv}=0`)}: ${T(chainT)}.`,
        run: async (c) => {
          for (let i = 1; i < nS; i++) {
            const x = x1 - i, y = y1 - m * i;
            await G.drawIn(G.segment([x, y], [x - 1, y], { color: RUN, width: 5 }), 220, c);
            await G.drawIn(G.segment([x - 1, y], [x - 1, y - m], { color: RISE, width: 5 }), 220, c);
            if (i < nS - 1) await pop(c, G.point(x - 1, y - m, { color: INK, r: 5.5 }), 200);
          }
          seq.innerHTML = T(chainT);
        } }] : []),
      { cap: `We landed on the ${T(yv)}-axis at ${T(cB(`(0,${b})`))}, so ${T(cB(`b=${b}`))}. All at once: ${T(`${y1}-${nS}\\times${m}=${b}`)}.`,
        run: async (c) => {
          await pop(c, G.point(0, b, { color: BC, r: 8.5, label: T(cB(`(0,${b})`)), pos: 'se' }));
          seq.innerHTML = T(`${chainT.replace(/(-?\d+)$/, cB('$1'))}`);
          await show(c, line(Pn, T(cB(`b=${y1}-${nS}\\times${m}=${b}`))));
        } },
      { cap: `The same ${T('b')} as the algebra. Join the points: ${T(`\\boldsymbol{${eqT(Q(m), Q(b), xv, yv)}}`)}.`,
        run: async (c) => {
          const L = G.line({ m, b }, { color: MC, width: 3.5 }); L.style.opacity = 0.75; await G.drawIn(L, 600, c);
          await answerBox(c, Pn, T(eqT(Q(m), Q(b), xv, yv)));
        } }
    ];
  }
};

/* =============================== explainer: two classic slips =============================== */
const SL = {
  walk: { label: 'Walkthrough: ' + T('m=3,\\ (2,5)'), m: 3, P: [2, 5] },
  piggy: { label: 'Warm-up: the piggy bank', m: 5, P: [6, 47], xv: 'w', yv: 'M', joke: 'A jar that starts $' }
};
const slips = {
  title: 'Two classic slips',
  height: 470,
  minW: 900,
  capH: 96,
  choices: Object.keys(SL).map((k) => ({ v: k, label: SL[k].label })),
  intro: 'Two students, two different slips. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = SL[k], [x1, y1] = d.P, m = d.m, xv = d.xv || 'x', yv = d.yv || 'y', H = ex.def.height;
    const ok = work(Q(m), d.P, xv, yv), bad = work(Q(m), [y1, x1], xv, yv), w = (ex.W - 42) / 2;
    const A = panel(stage, 14, 14, w, 316, 'Slip 1: stopping at b'), B = panel(stage, 28 + w, 14, w, 316, 'Slip 2: x and y swapped');
    const rule = add(stage, box(h('div', 'u7l5-rule'), ex.W - 28, H - 352), 14, 340); hide(rule);
    const badCheck = `${m}(${x1})${sgnT(bad.b)}=${m * x1}${sgnT(bad.b)}=${m * x1 + qv(bad.b)}`;
    return [
      { cap: `Slip 1 does all the work… and stops at ${T(`b=${qT(ok.b)}`)}.`,
        run: async (c) => { for (const s of [ok.tmpl, ok.sub, ok.mult, `b=${qT(ok.b)}`]) await show(c, line(A, T(s), 'u7l5-sline')); } },
      { cap: `Not finished! The question asks for the <b>equation of the line</b>. ${T(`b=${qT(ok.b)}`)} is only one piece of it: write ${T(ok.final)}.`,
        run: async (c) => {
          const s = badStamp(A, 'not done', w - 140, 150); await stampIn(c, s);
          await show(c, line(A, `${T('\\boldsymbol{' + ok.final + '}')} ✓`, 'u7l5-sline u7l5-okc'));
        } },
      { cap: `Slip 2 puts ${T(cP(String(y1)))} in for ${T(xv)} and ${T(cP(String(x1)))} in for ${T(yv)}: ${T(bad.sub)}, so ${T(`b=${qT(bad.b)}`)} and ${T(bad.final)}.${d.joke ? ` ${d.joke}${-qv(bad.b)} in debt!` : ''}`,
        run: async (c) => { for (const s of [bad.sub, bad.mult, `b=${qT(bad.b)}`, bad.final]) await show(c, line(B, T(s), 'u7l5-sline')); } },
      { cap: `The check catches it. Put ${T(`(${x1},${y1})`)} into ${T(bad.final)}: ${T(badCheck)}, not ${T(String(y1))} ✗`,
        run: async (c) => {
          await show(c, line(B, `Check: ${T(badCheck + '\\neq ' + y1)}`, 'u7l5-sline u7l5-badc'));
          await stampIn(c, badStamp(B, '✗', w - 64, 262));
        } },
      { cap: `In ${T(`(${x1},${y1})`)} the <b>first</b> number is ${T(xv)} and the <b>second</b> is ${T(yv)}. Finish with the equation, then check: ${T(ok.check)} ✓`,
        run: async (c) => {
          rule.innerHTML = `<div>${T(`(\\textcolor{${PC}}{${x1}},\\ \\textcolor{${PC}}{${y1}})=(${xv},\\ ${yv})`)}: ${xv} first, ${yv} second.</div><div class="u7l5-rsub">Write the <b>equation</b>, then put the point back in: ${T(ok.check)} ✓</div>`;
          await show(c, rule);
        } }
    ];
  }
};

/* =============================== explainer: b is the jump on a number line =============================== */
const HP = {
  notes: { label: 'From the notes: ' + T('m=-3,\\ (2,9)'), m: -3, P: [2, 9] },
  d1: { label: 'Try: ' + T('m=4,\\ (-2,1)'), m: 4, P: [-2, 1] },
  d2: { label: 'Try: ' + T('m=-2,\\ (-4,3)'), m: -2, P: [-4, 3] }
};
const hop = {
  title: 'b is the jump from mx to y',
  height: 420,
  minW: 900,
  capH: 96,
  choices: Object.keys(HP).map((k) => ({ v: k, label: HP[k].label })),
  intro: 'Substitute with brackets, then find <b>b</b> as a jump on the number line. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = HP[k], wk = work(Q(d.m), d.P), [x1, y1] = d.P, pr = d.m * x1, b = y1 - pr;
    const lo = Math.min(pr, y1, 0) - 2, hi = Math.max(pr, y1, 0) + 2, span = hi - lo;
    const top = add(stage, box(h('div', 'u7l5-hoptop'), ex.W - 28, 120), 14, 10);
    const N = new NumberLine(stage, { x: 14, y: 150, width: ex.W - 28, height: 150, axisY: 96, min: lo, max: hi, step: 1, labelStep: span > 22 ? 2 : 1 });
    const res = add(stage, box(h('div', 'u7l5-hopres'), ex.W - 28, 96), 14, 310); hide(res);
    const same = Math.sign(d.m) === Math.sign(x1);
    return [
      { cap: `Substitute with brackets: ${T(wk.sub)}. ${same ? 'Same signs: positive' : 'Different signs: negative'}, ${T(`${d.m}(${x1})=${pr}`)}.`,
        run: async (c) => {
          const a = h('div', 'u7l5-hopeq', T(wk.sub)); top.appendChild(a); await show(c, a);
          const b2 = h('div', 'u7l5-hopeq u7l5-hopeq2', T(`${y1}=${cM(String(pr))}+${cB('b')}`)); top.appendChild(b2); await show(c, b2);
        } },
      { cap: `${T(`${y1}=${pr}+b`)} says: <b>start at ${T(cM(String(pr)))}</b>, and ${T(cB('b'))} is the jump that <b>lands on ${T(cP(String(y1)))}</b>.`,
        run: async (c) => {
          await pop(c, N.point(pr, { color: MC, label: `<b>start</b> ${T(cM(String(pr)))}` }));
          await pop(c, N.point(y1, { color: PC, label: `<b>land</b> ${T(cP(String(y1)))}` }));
        } },
      { cap: `From ${T(String(pr))} to ${T(String(y1))} is ${b > 0 ? 'right' : 'left'} ${Math.abs(b)}: so ${T(cB(`b=${b > 0 ? '+' : ''}${b}`))}.`,
        run: async (c) => { await N.hop(c, pr, y1, { label: `<b>${b > 0 ? '+' : '−'}${Math.abs(b)}</b>`, color: BC }); } },
      { cap: `The algebra agrees: ${wk.undoWord}, ${T(wk.solve)}. So ${T('\\boldsymbol{' + wk.final + '}')}.`,
        run: async (c) => {
          res.innerHTML = `<div>${T(cB(wk.solve))}<span class="u7l5-badge">${wk.undo}</span></div><div class="u7l5-hopfin">${T(wk.final)}</div>`;
          await show(c, res);
        } }
    ];
  }
};

/* =============================== explainer: a fraction of a number, with counters =============================== */
const HF = {
  half: { label: T('\\tfrac{1}{2}(8)'), top: 1, bot: 2, x: 8, sgn: 1 },
  tq: { label: T('-\\tfrac{3}{4}(4)'), top: 3, bot: 4, x: 4, sgn: -1 },
  messy: { label: T('\\tfrac{1}{2}(7)') + ': why not?', top: 1, bot: 2, x: 7, sgn: 1, messy: true }
};
const half = {
  title: 'A fraction of a number: share, then take',
  height: 420,
  minW: 900,
  capH: 96,
  choices: Object.keys(HF).map((k) => ({ v: k, label: HF[k].label })),
  intro: 'The bottom number says how many equal groups. The top number says how many groups to take. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = HF[k], H = ex.def.height, per = Math.floor(d.x / d.bot), left = d.x - per * d.bot, ans = d.sgn * d.top * d.x / d.bot;
    const frT = `${d.sgn < 0 ? '-' : ''}\\tfrac{${d.top}}{${d.bot}}`;
    const AW = 560, svg = svgEl('svg', { width: AW, height: H - 20, viewBox: `0 0 ${AW} ${H - 20}` }, add(stage, box(h('div', 'u7l5-cwrap'), AW, H - 20), 14, 10));
    const Pn = panel(stage, AW + 30, 10, ex.W - AW - 44, H - 20, 'The arithmetic');
    const R = 24, gap = 62, rowH = 84;
    const startPos = (i) => [AW / 2 - (d.x - 1) * gap / 2 + i * gap, 50];
    const rows = d.bot, rowY = (r) => 140 + r * rowH - (rows - 2) * rowH / 2 * 0.4;
    const target = (i) => {
      const g = Math.floor(i / per), j = i % per;
      if (g >= rows) return [AW / 2 + (per - 1) * gap / 2 + gap * 1.6, rowY(0) + rowH / 2];   // the leftover
      return [AW / 2 - (per - 1) * gap / 2 + j * gap, rowY(g)];
    };
    const dots = [];
    for (let i = 0; i < d.x; i++) {
      const g = svgEl('g', {}, svg), gi = svgEl('g', {}, g); g.inner = gi;   // the outer g moves (attribute), the inner one shakes (CSS)
      svgEl('circle', { r: R, cx: 0, cy: 0, fill: '#e4b343', stroke: '#a8771a', 'stroke-width': 2.5 }, gi);
      const [px, py] = startPos(i); g.setAttribute('transform', `translate(${px} ${py})`); g.p = [px, py]; g.style.opacity = 0;
      dots.push(g);
    }
    const boxes = [];
    for (let r = 0; r < rows; r++) {
      const x0 = AW / 2 - (per - 1) * gap / 2 - R - 12, wd = (per - 1) * gap + 2 * R + 24;
      const b = svgEl('rect', { x: x0, y: rowY(r) - R - 10, width: wd, height: 2 * R + 20, rx: 14, fill: 'none', stroke: MC, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, svg);
      b.style.opacity = 0; boxes.push(b);
      const t = svgEl('text', { x: x0 - 12, y: rowY(r) + 6, 'text-anchor': 'end', 'font-size': 18, 'font-weight': 800, fill: MC }, svg); t.textContent = `group ${r + 1}`; t.style.opacity = 0; b.t = t;
    }
    const moveAll = (c) => tween(c, 900, (t) => dots.forEach((g, i) => { const [ax, ay] = g.p, [bx, by] = target(i); g.setAttribute('transform', `translate(${ax + (bx - ax) * t} ${ay + (by - ay) * t})`); }));
    const steps = [
      { cap: `${T(`${frT}(${d.x})`)} means ${T(`${frT.replace('-', '')}`)} <b>of</b> ${d.x}. Start with ${d.x} counters.`,
        run: async (c) => { for (const g of dots) await appear(c, g, 120); await show(c, line(Pn, T(`${frT}(${d.x})`), 'u7l5-big')); } },
      { cap: `The bottom number is ${T(String(d.bot))}: share them into <b>${d.bot} equal groups</b>. ${d.messy ? `${T(`${d.x}\\div${d.bot}`)} doesn’t come out even…` : `${T(`${d.x}\\div${d.bot}=${per}`)} in each group.`}`,
        run: async (c) => {
          await moveAll(c);
          for (const b of boxes) { await appear(c, b, 200); await appear(c, b.t, 150); }
          await show(c, line(Pn, T(d.messy ? `${d.x}\\div${d.bot}=${per}\\text{ R }${left}` : `${d.x}\\div${d.bot}=${per}`)));
        } }
    ];
    if (d.messy) {
      steps.push({ cap: `One counter is left over. To share it we’d have to cut it in half: ${T(`\\tfrac{1}{2}(7)=3\\tfrac{1}{2}`)}, a messy number.`,
        run: async (c) => { const g = dots[d.x - 1]; g.querySelector('circle').setAttribute('fill', '#f3b9b4'); await shake(c, g.inner); await show(c, line(Pn, T('\\tfrac{1}{2}(7)=3.5'), 'u7l5-badc')); } });
      steps.push({ cap: `That’s why the booklet picks points like ${T('(8,7)')}: the ${T('x')}-coordinate is a <b>multiple of the bottom number</b>, so ${T('m\\cdot x')} comes out whole.`,
        run: async (c) => { await answerBox(c, Pn, `${T('\\tfrac{1}{2}(8)=4')}: whole`); } });
      return steps;
    }
    steps.push({ cap: `The top number is ${T(String(d.top))}: take <b>${d.top} group${d.top > 1 ? 's' : ''}</b>. That’s ${T(String(d.top * per))} counter${d.top * per > 1 ? 's' : ''}.`,
      run: async (c) => {
        dots.forEach((g, i) => { if (Math.floor(i / per) >= d.top) anim(c, g, [{ opacity: 1 }, { opacity: 0.25 }], 300); });
        for (let r = 0; r < d.top; r++) boxes[r].setAttribute('fill', 'rgba(31,91,214,.08)');
        await sleep(c, 320);
        await show(c, line(Pn, T(`${per}\\times${d.top}=${d.top * per}`)));
      } });
    if (d.sgn < 0) steps.push({ cap: `Now the sign: the slope is <b>negative</b> and ${T(String(d.x))} is positive. Different signs: ${T(`-\\tfrac{${d.top}}{${d.bot}}(${d.x})=${ans}`)}.`,
      run: async (c) => { await show(c, line(Pn, T(`\\text{sign: }(-)(+)=(-)`))); } });
    steps.push({ cap: `Shortcut: <b>divide by the bottom, multiply by the top</b>. ${T(`${d.x}\\div${d.bot}\\times${d.top}=${d.top * per}`)}, so ${T(`${frT}(${d.x})=${ans}`)}.`,
      run: async (c) => { await answerBox(c, Pn, T(`${frT}(${d.x})=${ans}`)); } });
    return steps;
  }
};

/* =============================== explainer: the hot air balloon (Example 5) =============================== */
const balloon = {
  title: 'Example 5: rewind the balloon to t = 0',
  height: 480,
  minW: 980,
  capH: 96,
  choices: [{ v: 'e5', label: 'Example 5 check' }],
  intro: 'The balloon drops <b>20 m every minute</b>. At <b>5 minutes</b> it is at <b>350 m</b>. Press <b>Next</b>.',
  make(stage, k, ex) {
    const H = ex.def.height, SW = 240, gy = H - 70, topY = 100, hy = (hh) => gy - (gy - topY) * hh / 500, BX = 120;
    const sky = add(stage, box(h('div', 'u7l5-sky'), SW, H - 20), 10, 10);
    const svg = svgEl('svg', { width: SW, height: H - 20, viewBox: `0 0 ${SW} ${H - 20}` }, sky);
    const html = h('div', 'bk-html'); sky.appendChild(html);
    svgEl('rect', { x: 0, y: 0, width: SW, height: H - 20, rx: 14, fill: '#d6e9f8' }, svg);
    svgEl('rect', { x: 0, y: gy, width: SW, height: H - 20 - gy, fill: '#8cbf6a' }, svg);
    [[150, 60], [40, 200]].forEach(([x, y]) => { [[0, 0, 13], [15, 4, 15], [30, 0, 12]].forEach(([dx, dy, r]) => svgEl('circle', { cx: x + dx, cy: y + dy, r, fill: '#fff', opacity: 0.9 }, svg)); });
    svgEl('line', { x1: 52, x2: 52, y1: hy(0), y2: hy(500), stroke: INK, 'stroke-width': 3 }, svg);
    const lab = (x, y, s, pos, cls) => { const d = h('div', 'bk-lab ' + cls, s); html.appendChild(d); return place(d, x, y, pos, 4); };
    for (let v = 0; v <= 500; v += 100) { svgEl('line', { x1: 45, x2: 59, y1: hy(v), y2: hy(v), stroke: INK, 'stroke-width': 2.5 }, svg); lab(42, hy(v), String(v), 'w', 'u7l5-sknum'); }
    lab(52, hy(500) - 6, 'm', 'n', 'u7l5-sknum');
    const guide = svgEl('line', { x1: 59, x2: BX - 26, stroke: PC, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
    const b = svgEl('g', {}, svg); b.style.transformBox = 'view-box'; b.style.transformOrigin = '0 0';
    svgEl('path', { d: 'M-10 -2 L-6 18 M10 -2 L6 18', stroke: INK, 'stroke-width': 1.8 }, b);
    svgEl('path', { d: 'M0 2 C-34 -18 -27 -54 0 -54 C27 -54 34 -18 0 2 Z', fill: PC, stroke: INK, 'stroke-width': 2.2 }, b);
    svgEl('path', { d: 'M0 2 C-12 -18 -9 -52 0 -54 C9 -52 12 -18 0 2 Z', fill: '#ffeab3' }, b);
    svgEl('rect', { x: -7, y: 18, width: 14, height: 10, rx: 2, fill: '#a86d1c', stroke: INK, 'stroke-width': 1.5 }, b);
    const clock = lab(SW / 2, gy + 25, '', 'c', 'u7l5-clock');
    const hl = lab(BX + 30, 0, '', 'e', 'u7l5-skh');
    const set = (t) => {
      const hh = 450 - 20 * t, py = hy(hh);
      b.setAttribute('transform', `translate(${BX} ${py - 28})`);
      guide.setAttribute('y1', py); guide.setAttribute('y2', py);
      clock.innerHTML = `t = ${n(Math.round(t * 10) / 10)} min`;
      hl.innerHTML = `${Math.round(hh)} m`; place(hl, BX + 34, py - 30, 'e', 4);
    };
    set(5);
    const flyTo = (c, t0, t1, ms) => tween(c, ms, (u) => set(t0 + (t1 - t0) * u));
    const GW = 380;
    const G = new Graph(stage, { x: SW + 24, y: 10, width: GW, height: H - 20, xmin: 0, xmax: 16, ymin: 0, ymax: 550, xstep: 1, ystep: 50, xlabels: 2, ylabels: 100, xtitle: 't', ytitle: 'h', origin: true });
    const Pn = panel(stage, SW + GW + 38, 10, ex.W - SW - GW - 52, H - 20, 'The algebra');
    return [
      { cap: `At ${T('t=5')} the balloon is at ${T('350')} m. That is our point: ${T(cP('(5,\\ 350)'))}. Time goes first.`,
        run: async (c) => { await pop(c, G.point(5, 350, { color: PC, r: 7.5, label: T(cP('(5,\\ 350)')), pos: 'ne' })); await show(c, line(Pn, `point ${T(cP('(5,\\ 350)'))}`)); } },
      { cap: `It goes <b>down</b> ${T('20')} m every minute, so the slope is <b>negative</b>: ${T(cM('m=-20'))}.`,
        run: async (c) => {
          await G.drawIn(G.segment([5, 350], [6, 350], { color: RUN, width: 4.5 }), 300, c);
          await G.drawIn(G.segment([6, 350], [6, 330], { color: RISE, width: 4.5 }), 300, c);
          await pop(c, G.label(6, 340, '<b>−20</b>', { pos: 'e', cls: 'u7l5-tlab u7l5-trise', gap: 4 }));
          await show(c, line(Pn, T(cM('m=-20'))));
        } },
      { cap: `Rewind 5 minutes: each minute back, the balloon was ${T('20')} m <b>higher</b>. ${T('350+5\\times20=450')}.`,
        run: async (c) => {
          const pts = []; for (let i = 0; i <= 5; i++) { pts.push([5 - i, 350 + 20 * i]); if (i < 5) pts.push([4 - i, 350 + 20 * i]); }
          const st = G.polyline(pts, { color: GRAY, width: 3 });
          await Promise.all([G.drawIn(st, 1400, c), flyTo(c, 5, 0, 1400)]);
          await pop(c, G.point(0, 450, { color: BC, r: 8, label: T(cB('(0,\\ 450)')), pos: 'ne' }));
        } },
      { cap: `The algebra says the same: ${T('350=-20(5)+b')}, so ${T('350=-100+b')} and ${T(cB('b=450'))}. The equation is ${T('\\boldsymbol{h=-20t+450}')}.`,
        run: async (c) => {
          for (const s of ['350=-20(5)+b', '350=-100+b', cB('b=350+100=450')]) await show(c, line(Pn, T(s)));
          await G.drawIn(G.line({ m: -20, b: 450 }, { color: MC, width: 3.5 }), 600, c);
          await show(c, line(Pn, T('\\boldsymbol{h=-20t+450}'), 'u7l5-big'));
        } },
      { cap: `(b) At ${T('t=0')}: ${T('h=-20(0)+450=450')}. The balloon <b>started</b> at 450 m. The starting value is ${T(cB('b'))}.`,
        run: async (c) => { await pulse(c, G.point(0, 450, { color: BC, r: 11 }), 1.3); await show(c, line(Pn, `(b) start: ${T(cB('450'))} m`)); } },
      { cap: `(c) Fly on to ${T('t=12')}: ${T('h=-20(12)+450=-240+450=210')}. After 12 minutes it is at <b>210 m</b>.`,
        run: async (c) => {
          await flyTo(c, 0, 12, 1600);
          await G.drawIn(G.guides(12, 210), 400, c);
          await pop(c, G.point(12, 210, { color: INK, r: 7.5, label: T('(12,\\ 210)'), pos: 'ne' }));
          await answerBox(c, Pn, `(c) ${T('210')} m`);
        } }
    ];
  }
};

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  // the assignment's own slope/point pairs: never ask these (homework would be given away)
  const HW = new Set(['2|1,8', '5|2,13', '3|4,17', '1|6,10', '7|3,25', '4|5,23', '-2|3,1', '-5|2,-3', '-3|4,-7', '-1|8,2', '2|-3,-4', '-4|-2,-9',
    '3|-5,-2', '-6|-1,-1', '1/2|6,7', '1/3|9,8', '-3/4|8,1', '-1/2|-4,9', '4|0,-6', '4|2,-6', '5|3,19', '-2|5,-3', '3|2,11', '-4|3,-1', '6|1,2', '7|2,19', '-3|-2,4', '2|6,15']);
  const key = (m, x, y) => `${m.d === 1 ? m.n : m.n + '/' + m.d}|${x},${y}`;
  const steps = (wk) => [wk.tmpl, wk.sub + '\\ \\Rightarrow\\ ' + wk.mult, wk.solve, wk.final];
  const ask = (m, P) => `\\text{slope } {${m.d === 1 ? qT(m) : (m.n < 0 ? '-' : '') + `\\dfrac{${Math.abs(m.n)}}{${m.d}}`}},\\quad \\text{point } (${P[0]},\\ ${P[1]})`;
  const TXT = 'Determine the equation of the line in the form <i>y</i> = <i>mx</i> + <i>b</i>.';
  // Example 1 style: positive slope, positive point
  function basic(r) {
    for (;;) {
      const m = Q(r.int(1, 7)), x = r.int(1, 6), b = r.int(-9, 12); if (!b) continue;
      const y = m.n * x + b; if (y <= 0 || HW.has(key(m, x, y))) continue;
      return { text: TXT, q: ask(m, [x, y]), a: steps(work(m, [x, y])) };
    }
  }
  // Examples 2 and 3: a negative slope and/or negative coordinates
  function negs(r) {
    for (;;) {
      const m = Q(r.int(1, 6) * r.sign()), x = r.int(1, 6) * r.sign(), b = r.int(-12, 12); if (!b) continue;
      const y = m.n * x + b; if (!y || (m.n > 0 && x > 0 && y > 0) || Math.abs(y) > 25 || HW.has(key(m, x, y))) continue;
      return { text: TXT + ' Use brackets for the negatives.', q: ask(m, [x, y]), a: steps(work(m, [x, y])) };
    }
  }
  // Example 4: a fraction slope with a point that divides evenly
  function frac(r) {
    for (;;) {
      const dd = r.pick([2, 3, 4, 5]), nn = r.int(1, dd - 1); if (gcd(nn, dd) !== 1) continue;
      const m = Q(nn * r.sign(), dd), x = dd * r.int(1, 3) * (r.chance(0.25) ? -1 : 1), b = r.int(-8, 10); if (!b) continue;
      const y = qv(m) * x + b; if (!y || HW.has(key(m, x, y))) continue;
      return { text: TXT + ' Leave the slope as a fraction.', q: ask(m, [x, y]), a: steps(work(m, [x, y])) };
    }
  }
  // Example 5: a rate and one data point in a story
  const STORIES = [
    (rate, t, v) => ({ text: `A pool is being filled at a constant rate. After <b>${t} minutes</b> it holds <b>${v} L</b>, and it gains <b>${rate} L per minute</b>. Let <i>V</i> be the volume after <i>t</i> minutes. Write an equation for <i>V</i>, and give the starting volume.`, xv: 't', yv: 'V', m: rate, unit: 'L' }),
    (rate, t, v) => ({ text: `A candle burns down at a constant rate. After <b>${t} hours</b> it is <b>${v} cm</b> tall, and it loses <b>${rate} cm per hour</b>. Let <i>h</i> be the height after <i>t</i> hours. Write an equation for <i>h</i>, and give the starting height.`, xv: 't', yv: 'h', m: -rate, unit: 'cm' }),
    (rate, t, v) => ({ text: `Sam saves the same amount each week. After <b>${t} weeks</b> he has <b>$${v}</b>, and he saves <b>$${rate} per week</b>. Let <i>S</i> be his savings after <i>w</i> weeks. Write an equation for <i>S</i>, and give his starting amount.`, xv: 'w', yv: 'S', m: rate, unit: '$' }),
    (rate, t, v) => ({ text: `A water tank drains at a constant rate. After <b>${t} minutes</b> it holds <b>${v} L</b>, and it loses <b>${rate} L per minute</b>. Let <i>V</i> be the volume after <i>t</i> minutes. Write an equation for <i>V</i>, and give the starting volume.`, xv: 't', yv: 'V', m: -rate, unit: 'L' })
  ];
  function story(r) {
    for (;;) {
      const i = r.int(0, STORIES.length - 1), down = i % 2 === 1, rate = down ? r.pick([2, 3, 4, 5, 10, 20]) : r.pick([3, 4, 5, 10, 15, 20, 25]), t = r.int(2, 8);
      const start = rate * r.int(t + 1, t + 10) + (rate >= 10 ? 0 : r.int(0, 9));
      const v = down ? start - rate * t : start + rate * t; if (v <= 0) continue;
      const s = STORIES[i](rate, t, v), wk = work(Q(s.m), [t, v], s.xv, s.yv);
      return { text: s.text, q: '', a: [`m=${s.m},\\ \\text{point }(${t},\\ ${v})`, wk.sub + '\\ \\Rightarrow\\ ' + wk.mult, wk.solve, wk.final],
        atext: `Starting value: <b>${s.unit === '$' ? '$' + qv(wk.b) : qv(wk.b) + ' ' + s.unit}</b> (that’s <i>b</i>).` };
    }
  }
  standup('u7l5', {
    intro: 'At your whiteboard station: slope in for m, the point in for x and y, solve for b, then write the equation. Check by putting the point back in!',
    levels: {
      BEG: basic,                                              // slope 4, point (1, 9) → y = 4x + 5
      PRG: negs,                                               // negative slope or coordinates, in brackets
      MAS: (r) => (r.chance(0.55) ? frac(r) : story(r))        // a fraction slope, or a rate and one data point
    }
  });
})();
/* ============ end Stand Up Break! ============ */

/* =============================== mount =============================== */
mountJars();
export const explainers = mountExplainers({ family, drop, drop1, drop2, drop3, drop4, rewind, slips, hop, half, balloon });
export const _test = { FA, DR, RW, SL, HP, HF, work, eqT };
