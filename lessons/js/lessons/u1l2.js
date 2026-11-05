/* Math 15 · Unit 1 · Lesson 2 — Review: Operations with Fractions and Decimals (Grade 9 review; no 10C twin).
 * Warm-up (The Cookie Recipe: tap the measuring cups to pour scoops into a bowl that shows the total), and the explainers:
 *   equiv    (fraction bars: cut every piece into k → an equivalent fraction; Example 1(a) checks),
 *   lowest   (factor lists → the GCF; group the pieces → lowest terms; Example 1(b) checks),
 *   addfr    (two bars re-cut to the LCD, then the numerators combine; notes, warm-up, Example 2(a)(b)),
 *   mixed    (pies: wholes with wholes, fractions with fractions, recombine; Example 2(c)),
 *   times    (the area model: a/b of the square, then c/d of that; the overlap; cancel first; Examples 3(a), 5(b)),
 *   divide   (how many scoops fit? the warm-up's ¼ and ⅓ cups, Example 3(b); then the reciprocal shortcut),
 *   improper (mixed → improper: cut every whole into pieces and count; Example 3(c)),
 *   longdiv  (long division one digit at a time: terminating or repeating; adapted from Math 10C 1.4),
 *   place    (decimal → fraction: the place-value chart, a hundred grid, then the GCF; Example 4(b)),
 *   fbedmas  (the order of operations with fractions and decimals, the next operation lit up; Example 5(a)),
 *   decimals (line up the decimal points; count the decimal places; divide by a decimal: both points hop right).
 * Colours: first fraction amber, second blue, overlap / answer purple and red, cancelled factors gray. */
import { h, tex, add, box, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, svgEl, pulse, shake, anim, liveCtx, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const K = (src, display) => {
  try { return window.katex.renderToString('\\displaystyle ' + String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const AMB = COLORS.amber, BLUE = COLORS.blue, RED = COLORS.red, INK = COLORS.ink, PUR = COLORS.purple, GRN = COLORS.green;
const FA = '#f2b84b', FB = '#7fa6e8', FP = '#b79be6';   // fills: first fraction, second fraction, overlap
const hide = (el) => { el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
const lab = (host, x, y, html, cls = '') => { const d = h('div', cls, html); d.style.position = 'absolute'; d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.translate = '-50% -50%'; host.appendChild(d); return d; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const F = (n, d) => `\\frac{${n}}{${d}}`;
const mixT = (n, d) => { const g = gcd(n, d); n /= g; d /= g; const w = Math.floor(n / d), r = n % d; return r === 0 ? String(w) : w ? `${w}\\frac{${r}}{${d}}` : F(r, d); };
const simpT = (n, d) => { const g = gcd(n, d); return g > 1 ? `=${F(n / g, d / g)}` : ''; };       // "=\frac{1}{6}" when it simplifies
const factorsOf = (n) => { const out = []; for (let k = 1; k <= n; k++) if (n % k === 0) out.push(k); return out; };
const ord = (d) => ({ 2: 'halves', 3: 'thirds', 4: 'fourths', 5: 'fifths', 6: 'sixths', 8: 'eighths', 9: 'ninths', 10: 'tenths', 12: 'twelfths', 15: 'fifteenths', 18: 'eighteenths', 20: 'twentieths', 24: 'twenty-fourths' }[d] || d + 'ths');

/* =============================== fraction bars (SVG) =============================== */
class FBar {
  constructor(host, o) {
    this.o = Object.assign({ h: 64 }, o);
    const { x, y, w } = this.o, hh = this.o.h;
    this.svg = svgEl('svg', { class: 'u1l2-bar', width: w + 8, height: hh + 8 }); add(host, this.svg, x - 4, y - 4);
    this.fill = svgEl('g', {}, this.svg); this.lines = svgEl('g', {}, this.svg); this.top = svgEl('g', {}, this.svg);
    svgEl('rect', { x: 4, y: 4, width: w, height: hh, fill: 'none', stroke: INK, 'stroke-width': 2.5, rx: 3 }, this.top);
  }
  px(v, d) { return 4 + this.o.w * v / d; }
  shade(from, to, d, color, cls = '') { return svgEl('rect', { x: this.px(from, d), y: 4, width: this.px(to, d) - this.px(from, d), height: this.o.h, fill: color, class: cls }, this.fill); }
  cuts(d, o = {}) {
    const g = svgEl('g', { class: o.cls || '' }, this.lines);
    for (let i = 1; i < d; i++) { if (o.skip && i % o.skip === 0) continue; svgEl('line', { x1: this.px(i, d), x2: this.px(i, d), y1: 4, y2: 4 + this.o.h, stroke: o.color || INK, 'stroke-width': o.width || 2, 'stroke-dasharray': o.dash || '' }, g); }
    return g;
  }
  num(i, d, txt, cls = 'u1l2-pn') { const t = svgEl('text', { x: (this.px(i, d) + this.px(i + 1, d)) / 2, y: 4 + this.o.h / 2 + 6, 'text-anchor': 'middle', class: cls }, this.top); t.textContent = txt; return t; }
}

/* =============================== warm-up: the cup drawer =============================== */
function mountCups() {
  const host = document.getElementById('u1l2-cups'), bowl = document.getElementById('u1l2-bowl'); if (!host || !bowl) return;
  const CUPS = [[1, 1], [1, 2], [1, 3], [1, 4]], L = 12, MAX = 2;   // twelfths; the bowl shows up to 2 cups
  const scoops = [];
  CUPS.forEach(([n, d], i) => {
    const b = h('button', 'u1l2-cup', `<svg viewBox="0 0 80 60" aria-hidden="true"><path d="M8 8 H58 L52 52 H14 Z" fill="#dfe7f2" stroke="#1c2230" stroke-width="2.5" stroke-linejoin="round"/><path d="M57 18 H72 V30 H55" fill="none" stroke="#1c2230" stroke-width="5" stroke-linecap="round"/></svg><span>${d === 1 ? '1 cup' : T(`\\tfrac{${n}}{${d}}`) + ' cup'}</span>`);
    b.type = 'button'; b.style.setProperty('--s', String(0.7 + 0.3 / d + (d === 1 ? 0.1 : 0)));
    b.onclick = () => { const tot = scoops.reduce((s, q) => s + L * q[0] / q[1], 0); if (tot + L * n / d > MAX * L) { b.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'none' }], 300); return; } scoops.push([n, d]); draw(true); };
    host.appendChild(b); void i;
  });
  const clr = h('button', 'pill u1l2-clr', 'Empty the bowl'); clr.type = 'button'; clr.onclick = () => { scoops.length = 0; draw(); };
  bowl.innerHTML = '<div class="u1l2-bh">The bowl</div>';
  const W = 520, Hh = 50, bar = h('div', 'u1l2-bbar'); bar.style.width = W + 'px'; bar.style.height = Hh + 'px'; bowl.appendChild(bar);
  const ticks = h('div', 'u1l2-bticks'); ticks.style.width = W + 'px'; bowl.appendChild(ticks);
  for (let q = 0; q <= MAX * 4; q++) { const t = h('span', 'u1l2-btick' + (q % 4 === 0 ? ' big' : ''), q % 4 === 0 ? String(q / 4) : q % 2 === 0 ? T((q > 4 ? '1' : '') + '\\tfrac12') : ''); t.style.left = (W * q / (MAX * 4)) + 'px'; ticks.appendChild(t); }
  const out = h('div', 'u1l2-btot'); bowl.append(out, clr);
  const COL = { 1: '#c27a0e', 2: '#e8a01e', 3: '#7b4fc4', 4: '#1f5bd6' };
  function draw(anim) {
    bar.innerHTML = ''; let at = 0;
    scoops.forEach(([n, d], i) => { const w = W * (n / d) / MAX, s = h('div', 'u1l2-bseg', d === 1 ? '1' : T(`\\tfrac{${n}}{${d}}`)); s.style.left = at + 'px'; s.style.width = w + 'px'; s.style.background = COL[d]; bar.appendChild(s); at += w; if (anim && i === scoops.length - 1) s.animate([{ transform: 'scaleX(0)', transformOrigin: 'left' }, { transform: 'none', transformOrigin: 'left' }], 300); });
    const tw = scoops.reduce((s, q) => s + L * q[0] / q[1], 0);
    out.innerHTML = scoops.length ? `${scoops.length} scoop${scoops.length > 1 ? 's' : ''}: ${K(scoops.map(([n, d]) => (d === 1 ? '1' : F(n, d))).join('+') + '=' + mixT(tw, L))} cup${tw <= L ? '' : 's'}` : '<span class="muted">Tap a cup to pour a scoop.</span>';
  }
  draw();
}

/* =============================== explainer: equivalent fractions =============================== */
const EQ = {
  n: { label: 'Notes: 2/3 = 8/12', a: 2, b: 3, k: 4 },
  e1a1: { label: 'Example 1(a) check: (i)', a: 3, b: 4, k: 3, target: 12 },
  e1a2: { label: '(ii)', a: 5, b: 6, k: 3, target: 18 }
};
const equiv = {
  title: 'Same amount, smaller pieces',
  height: 330,
  minW: 900,
  capH: 96,
  choices: Object.keys(EQ).map((k) => ({ v: k, label: EQ[k].label })),
  intro: (k) => { const d = EQ[k]; return d.target ? `Fill in ${T(`${F(d.a, d.b)}=${F('\\square', d.target)}`)} with a fraction bar. Press <b>Next</b>.` : `Why is ${T(`${F(d.a, d.b)}=${F(d.a * d.k, d.b * d.k)}`)}? Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = EQ[k], W = ex.W, N = d.b * d.k, A = d.a * d.k, bw = W - 200;
    const B = new FBar(stage, { x: 100, y: 90, w: W - 200, h: 80 });
    const left = lab(stage, W / 2, 44, K(F(d.a, d.b)), 'u1l2-flab');
    const fills = B.shade(0, d.a, d.b, FA); hide(fills); const c1 = B.cuts(d.b, { width: 3 }); hide(c1);
    const c2 = B.cuts(N, { skip: d.k, dash: '6 4', width: 2, color: '#555' }); hide(c2);
    const eqn = hide(lab(stage, W / 2, 260, K(`${F(d.a, d.b)}=${F(`${d.a}\\times${d.k}`, `${d.b}\\times${d.k}`)}=${F(A, N)}`), 'u1l2-eqn'));
    const nums = [];
    return [
      { cap: `${T(F(d.a, d.b))}: cut the bar into <b>${d.b} equal pieces</b> and shade <b>${d.a}</b>.`,
        run: async (c) => { await appear(c, c1, 300); await appear(c, fills, 400); } },
      { cap: d.target ? `We need <b>${ord(d.target)}</b>. ${T(`${d.target}\\div${d.b}=${d.k}`)}, so cut <b>every</b> piece into ${d.k}.` : `Cut <b>every</b> piece into ${d.k} smaller pieces.`,
        run: async (c) => { await appear(c, c2, 500); } },
      { cap: `Now there are ${T(`${d.b}\\times${d.k}=${N}`)} pieces, and ${T(`${d.a}\\times${d.k}=${A}`)} of them are shaded.`,
        run: async (c) => { for (let i = 0; i < A; i++) { const t = B.num(i, N, String(i + 1)); nums.push(t); hide(t); } for (const t of nums) await appear(c, t, 60); } },
      { cap: `The same amount is shaded, so ${T(`${F(d.a, d.b)}=${F(A, N)}`)}. We multiplied <b>both</b> parts by ${d.k}.`,
        run: async (c) => { left.innerHTML = K(`${F(d.a, d.b)}=${F(A, N)}`); await pulse(c, left, 1.1); await show(c, eqn); } }
    ];
  }
};

/* =============================== explainer: lowest terms =============================== */
const LOW = { e1b1: { label: 'Example 1(b) check: (i)', n: 8, d: 12 }, e1b2: { label: '(ii)', n: 10, d: 15 }, e1b3: { label: '(iii)', n: 18, d: 24 } };
const lowest = {
  title: 'Group the pieces: lowest terms',
  height: 380,
  minW: 900,
  capH: 96,
  choices: Object.keys(LOW).map((k) => ({ v: k, label: LOW[k].label })),
  intro: (k) => `Simplify ${T(F(LOW[k].n, LOW[k].d))}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const { n, d } = LOW[k], g = gcd(n, d), W = ex.W, bw = W - 200;
    const B = new FBar(stage, { x: 150, y: 30, w: bw, h: 72 });
    const left = lab(stage, 75, 66, K(F(n, d)), 'u1l2-flab');
    B.shade(0, n, d, FA); const thin = B.cuts(d, { width: 2 }); const thick = B.cuts(d / g, { width: 4.5 }); hide(thick);
    const fl = (m, y) => {
      const row = add(stage, h('div', 'u1l2-frow'), 40, y);
      row.innerHTML = `<b>Factors of ${m}:</b> ` + factorsOf(m).map((f) => `<span class="u1l2-fac${n % f === 0 && d % f === 0 ? ' u1l2-common' : ''}${f === g ? ' u1l2-gcf' : ''}">${f}</span>`).join('');
      return hide(row);
    };
    const r1 = fl(n, 140), r2 = fl(d, 196);
    const eqn = hide(lab(stage, W / 2, 310, K(`${F(n, d)}=${F(`${n}\\div${g}`, `${d}\\div${g}`)}=${F(n / g, d / g)}`), 'u1l2-eqn'));
    return [
      { cap: `List the factors of ${n} and of ${d}.`,
        run: async (c) => { await show(c, r1); await show(c, r2); } },
      { cap: `The common factors are ${factorsOf(g).filter((f) => n % f === 0 && d % f === 0).join(', ')}. The <b>greatest</b> is <b>${g}</b>: GCF${T(`(${n},\\ ${d})=${g}`)}.`,
        run: async (c) => { [r1, r2].forEach((r) => r.classList.add('u1l2-lit')); await Promise.all([...stage.querySelectorAll('.u1l2-gcf')].map((e) => pulse(c, e, 1.25))); } },
      { cap: `Group the pieces in ${g}s: ${d} pieces become ${T(`${d}\\div${g}=${d / g}`)}, and ${n} shaded become ${T(`${n}\\div${g}=${n / g}`)}.`,
        run: async (c) => { await appear(c, thick, 300); await anim(c, thin, [{ opacity: 1 }, { opacity: 0.12 }], 500); } },
      { cap: `${T(`${F(n, d)}=${F(n / g, d / g)}`)}. Lowest terms: ${n / g} and ${d / g} share no factor except 1.`,
        run: async (c) => { left.innerHTML = K(F(n / g, d / g)); await pulse(c, left, 1.15); await show(c, eqn); } }
    ];
  }
};

/* =============================== explainer: adding / subtracting with bars =============================== */
const ADD = {
  n: { label: 'Notes: 1/4 + 1/3', a: [1, 4], b: [1, 3], op: '+' },
  w: { label: 'Warm-up: 1/2 + 1/4', a: [1, 2], b: [1, 4], op: '+' },
  e2a: { label: 'Example 2 check: (a)', a: [1, 4], b: [1, 6], op: '+' },
  e2b: { label: '(b)', a: [3, 5], b: [1, 4], op: '-' }
};
const multiples = (m, upto) => { const out = []; for (let v = m; v <= upto; v += m) out.push(v); return out; };
const addfr = {
  title: 'Same-size pieces first',
  height: 440,
  minW: 920,
  capH: 96,
  choices: Object.keys(ADD).map((k) => ({ v: k, label: ADD[k].label })),
  intro: (k) => { const d = ADD[k]; return `${T(`${F(...d.a)}${d.op}${F(...d.b)}`)}: the pieces are different sizes. Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = ADD[k], [an, ad] = d.a, [bn, bd] = d.b, L = lcm(ad, bd), A = an * L / ad, Bn = bn * L / bd, sub = d.op === '-';
    const R = sub ? A - Bn : A + Bn, W = ex.W, bx = 130, bw = W - 340;
    const B1 = new FBar(stage, { x: bx, y: 14, w: bw, h: 58 }), B2 = new FBar(stage, { x: bx, y: 96, w: bw, h: 58 });
    B1.shade(0, an, ad, FA); B1.cuts(ad, { width: 3 }); B2.shade(0, bn, bd, FB); B2.cuts(bd, { width: 3 });
    const l1 = lab(stage, 64, 43, K(F(an, ad)), 'u1l2-flab'), l2 = lab(stage, 64, 125, K((sub ? '-' : '+') + F(bn, bd)), 'u1l2-flab');
    const r1 = hide(lab(stage, W - 100, 43, K('=' + F(A, L)), 'u1l2-flab u1l2-ca')), r2 = hide(lab(stage, W - 100, 125, K('=' + F(Bn, L)), 'u1l2-flab u1l2-cb'));
    const cut1 = B1.cuts(L, { dash: '5 4', color: '#555' }), cut2 = B2.cuts(L, { dash: '5 4', color: '#555' }); hide(cut1); hide(cut2);
    const top = Math.max(L * 2, 12), m1 = multiples(ad, top).slice(0, 8), m2 = multiples(bd, top).slice(0, 8);
    const mrow = (m, list, y) => { const e = add(stage, h('div', 'u1l2-frow u1l2-mrow'), 40, y); e.innerHTML = `<b>Multiples of ${m}:</b> ` + list.map((v) => `<span class="u1l2-fac${v === L ? ' u1l2-gcf' : ''}">${v}</span>`).join(''); return hide(e); };
    const mr1 = mrow(ad, m1, 172), mr2 = mrow(bd, m2, 212);
    const B3 = new FBar(stage, { x: bx, y: 272, w: bw, h: 58 }); B3.svg.style.opacity = 0;
    const l3 = hide(lab(stage, 64, 301, K('='), 'u1l2-flab'));
    const res = hide(lab(stage, W - 100, 301, K('=' + F(R, L)), 'u1l2-flab u1l2-cp'));
    const fin = hide(lab(stage, W / 2, 392, K(`${F(an, ad)}${d.op}${F(bn, bd)}=${F(A, L)}${d.op}${F(Bn, L)}=${F(R, L)}${simpT(R, L)}`), 'u1l2-eqn'));
    const g = gcd(R, L);
    return [
      { cap: `${ord(ad)[0].toUpperCase() + ord(ad).slice(1)} and ${ord(bd)} are <b>different sizes</b>, so we can’t count them together yet. Find the <b>LCD</b>: the first number in both lists is <b>${L}</b>.`,
        run: async (c) => { await show(c, mr1); await show(c, mr2); await Promise.all([...stage.querySelectorAll('.u1l2-gcf')].map((e) => pulse(c, e, 1.25))); } },
      { cap: `Cut both bars into <b>${L}</b> pieces: ${T(`${F(an, ad)}=${F(A, L)}`)} and ${T(`${F(bn, bd)}=${F(Bn, L)}`)}.`,
        run: async (c) => { await Promise.all([appear(c, cut1, 400), appear(c, cut2, 400)]); await show(c, r1); await show(c, r2); } },
      sub ? { cap: `Subtract the <b>numerators only</b>: take ${Bn} pieces away from ${A}. The denominator stays ${L}: ${T(`${A}-${Bn}=${R}`)}, so ${T(F(R, L))}.`,
        run: async (c) => {
          B3.shade(0, A, L, FA); B3.cuts(L, { width: 2 }); const x = B3.shade(R, A, L, 'url(#u1l2-hatch)', 'u1l2-gone');
          const defs = svgEl('defs', {}, B3.svg), pat = svgEl('pattern', { id: 'u1l2-hatch', width: 10, height: 10, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
          svgEl('rect', { width: 10, height: 10, fill: '#fde3e1' }, pat); svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 10, stroke: RED, 'stroke-width': 4 }, pat);
          void x; await appear(c, B3.svg, 300); await appear(c, l3, 200); await show(c, res);
        } }
        : { cap: `Add the <b>numerators only</b>: ${A} pieces and ${Bn} more. The denominator stays ${L}: ${T(`${A}+${Bn}=${R}`)}, so ${T(F(R, L))}.`,
          run: async (c) => { B3.shade(0, A, L, FA); B3.shade(A, R, L, FB); B3.cuts(L, { width: 2 }); await appear(c, B3.svg, 300); await appear(c, l3, 200); await show(c, res); } },
      { cap: g > 1 ? `Simplify: ${T(`${F(R, L)}=${F(R / g, L / g)}`)}.` : `${T(F(R, L))} is already in lowest terms: ${R} and ${L} share no factor except 1.`,
        run: async (c) => { await show(c, fin); } }
    ];
  }
};

/* =============================== explainer: mixed numbers with pies =============================== */
const MIX = {
  e2c: { label: 'Example 2(c) check', a: [2, 1, 3], b: [1, 1, 2] },
  demo: { label: 'Demo: 1¼ + 2⅓', a: [1, 1, 4], b: [2, 1, 3] }
};
function pie(host, cx, cy, r, d, k, color, o = {}) {
  const g = svgEl('g', { class: 'u1l2-pie' }, host);
  const wedge = (i) => { const a0 = -Math.PI / 2 + 2 * Math.PI * i / d, a1 = a0 + 2 * Math.PI / d; return `M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 ${d === 1 ? 1 : 0} 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`; };
  svgEl('circle', { cx, cy, r, fill: '#fff', stroke: INK, 'stroke-width': 2.5 }, g);
  if (d === 1) { if (k) svgEl('circle', { cx, cy, r, fill: color, stroke: INK, 'stroke-width': 2.5 }, g); }
  else for (let i = 0; i < d; i++) svgEl('path', { d: wedge(i), fill: i < k ? (o.colors ? o.colors[i] : color) : '#fff', stroke: INK, 'stroke-width': o.thin ? 1.5 : 2.2 }, g);
  return g;
}
const mixed = {
  title: 'Wholes with wholes, parts with parts',
  height: 440,
  minW: 920,
  capH: 96,
  choices: Object.keys(MIX).map((k) => ({ v: k, label: MIX[k].label })),
  intro: (k) => { const d = MIX[k]; return `Add ${T(`${d.a[0]}\\frac{${d.a[1]}}{${d.a[2]}}+${d.b[0]}\\frac{${d.b[1]}}{${d.b[2]}}`)}. Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = MIX[k], [w1, n1, d1] = d.a, [w2, n2, d2] = d.b, L = lcm(d1, d2), A = n1 * L / d1, B = n2 * L / d2, Wt = w1 + w2, R = A + B, W = ex.W;
    const svg = svgEl('svg', { class: 'u1l2-pies', width: W, height: 440 }); add(stage, svg, 0, 0);
    const r = 46, gap = 108, x0 = 190;
    const row = (w, n, dd, y, col) => { const els = []; for (let i = 0; i < w; i++) els.push(pie(svg, x0 + i * gap, y, r, 1, 1, col)); const p = pie(svg, x0 + w * gap, y, r, dd, n, col); return { wh: els, part: p, px: x0 + w * gap }; };
    const R1 = row(w1, n1, d1, 60, FA), R2 = row(w2, n2, d2, 170, FB);
    lab(stage, 70, 60, K(`${w1}\\frac{${n1}}{${d1}}`), 'u1l2-flab'); lab(stage, 70, 170, K(`+${w2}\\frac{${n2}}{${d2}}`), 'u1l2-flab');
    const P = add(stage, box(h('div', 'u1l2-panel'), 300, 250), W - 316, 14); P.innerHTML = '<div class="u1l2-ph">Working</div>';
    const pl = (html, cls = '') => { const e = hide(h('div', 'u1l2-line ' + cls, html)); P.appendChild(e); return e; };
    const lw = pl(`Wholes: ${K(`${w1}+${w2}=${Wt}`)}`), lf = pl(`Fractions: ${K(`${F(n1, d1)}+${F(n2, d2)}`)}`), lf2 = pl(K(`=${F(A, L)}+${F(B, L)}=${F(R, L)}`)), lr = pl(`Recombine: ${K(`\\boldsymbol{${Wt}${F(R, L)}}`)}`, 'u1l2-big');
    const ry = 330;
    const resRow = svgEl('g', {}, svg); hide(resRow);
    for (let i = 0; i < Wt; i++) pie(resRow, x0 + i * gap, ry, r, 1, 1, i < w1 ? FA : FB);
    const cols = Array.from({ length: L }, (_, i) => (i < A ? FA : FB));
    pie(resRow, x0 + Wt * gap, ry, r, L, R, null, { colors: cols, thin: true });
    lab(stage, 70, ry, K('='), 'u1l2-flab');
    const ring = (els) => els.map((e) => { const b = e.getBBox(); const q = svgEl('rect', { x: b.x - 6, y: b.y - 6, width: b.width + 12, height: b.height + 12, rx: 14, class: 'u1l2-ring' }, svg); hide(q); return q; });
    return [
      { cap: `Wholes first: ${w1} whole${w1 > 1 ? 's' : ''} and ${w2} whole${w2 > 1 ? 's' : ''} make <b>${Wt}</b>.`,
        run: async (c) => { const rs = ring([...R1.wh, ...R2.wh]); await Promise.all(rs.map((q) => appear(c, q, 300))); await show(c, lw); } },
      { cap: `Now the fraction parts: ${T(`${F(n1, d1)}+${F(n2, d2)}`)}. Different pieces, so use the LCD, <b>${L}</b>: cut both into ${ord(L)}.`,
        run: async (c) => {
          await show(c, lf);
          const p1 = pie(svg, R1.px, 60, r, L, A, FA, { thin: true }), p2 = pie(svg, R2.px, 170, r, L, B, FB, { thin: true }); hide(p1); hide(p2);
          await Promise.all([appear(c, p1, 500), appear(c, p2, 500)]);
        } },
      { cap: `${T(`${F(A, L)}+${F(B, L)}=${F(R, L)}`)}${R < L ? ': less than one whole, so nothing carries over.' : '.'}`,
        run: async (c) => { await show(c, lf2); } },
      { cap: `Recombine the wholes and the fraction: ${T(`${w1}\\frac{${n1}}{${d1}}+${w2}\\frac{${n2}}{${d2}}=${Wt}${F(R, L)}`)}.`,
        run: async (c) => { await appear(c, resRow, 400); await show(c, lr); } }
    ];
  }
};

/* =============================== explainer: multiplying with an area model =============================== */
const TIM = {
  e3a: { label: 'Example 3(a) check', a: [2, 3], b: [3, 8] },
  e5b: { label: 'Example 5(b): half of ⅔', a: [2, 3], b: [1, 2], of: true },
  demo: { label: 'Demo: 2/3 × 3/5', a: [2, 3], b: [3, 5] }
};
function cancelTex(an, ad, bn, bd) {
  const g1 = gcd(an, bd), g2 = gcd(bn, ad);
  const c = (v, g, up) => (g > 1 ? `\\cancel{${v}}${up ? '^{\\,' : '_{\\,'}${v / g}}` : String(v));
  return { g1, g2, tex: `${F(c(an, g1, true), c(ad, g2, false))}\\times${F(c(bn, g2, true), c(bd, g1, false))}=${F(an / g1, ad / g2)}\\times${F(bn / g2, bd / g1)}=${F(an / g1 * bn / g2, ad / g2 * bd / g1)}` };
}
const times = {
  title: 'Multiplying: the area model',
  height: 440,
  minW: 920,
  capH: 96,
  choices: Object.keys(TIM).map((k) => ({ v: k, label: TIM[k].label })),
  intro: (k) => { const d = TIM[k]; return d.of ? `“Half of ${T('\\frac{2}{3}')} cup” means ${T('\\frac{1}{2}\\times\\frac{2}{3}')}. Press <b>Next</b>.` : `Multiply ${T(`${F(...d.a)}\\times${F(...d.b)}`)}. Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = TIM[k], [an, ad] = d.a, [bn, bd] = d.b, W = ex.W, S = 360, X = 40, Y = 30;
    const N = an * bn, D = ad * bd, g = gcd(N, D);
    const svg = svgEl('svg', { class: 'u1l2-area', width: S + 80, height: S + 70 }); add(stage, svg, X - 20, Y - 20);
    const ox = 20, oy = 20, cw = S / ad, rh = S / bd;
    const colsG = svgEl('g', {}, svg), rowsG = svgEl('g', {}, svg), ovG = svgEl('g', {}, svg), linesV = svgEl('g', {}, svg), linesH = svgEl('g', {}, svg);
    svgEl('rect', { x: ox, y: oy, width: S, height: S, fill: '#fff', stroke: INK, 'stroke-width': 3 }, svg).parentNode.insertBefore(svg.lastChild, svg.firstChild);
    for (let i = 0; i < an; i++) svgEl('rect', { x: ox + i * cw, y: oy, width: cw, height: S, fill: FA, 'fill-opacity': 0.75 }, colsG);
    for (let j = 0; j < bn; j++) svgEl('rect', { x: ox, y: oy + S - (j + 1) * rh, width: S, height: rh, fill: FB, 'fill-opacity': 0.55 }, rowsG);
    for (let i = 0; i < an; i++) for (let j = 0; j < bn; j++) svgEl('rect', { x: ox + i * cw, y: oy + S - (j + 1) * rh, width: cw, height: rh, fill: PUR, 'fill-opacity': 0.8 }, ovG);
    for (let i = 1; i < ad; i++) svgEl('line', { x1: ox + i * cw, x2: ox + i * cw, y1: oy, y2: oy + S, stroke: INK, 'stroke-width': 2 }, linesV);
    for (let j = 1; j < bd; j++) svgEl('line', { x1: ox, x2: ox + S, y1: oy + j * rh, y2: oy + j * rh, stroke: INK, 'stroke-width': 2 }, linesH);
    const outline = svgEl('rect', { x: ox, y: oy, width: S, height: S, fill: 'none', stroke: INK, 'stroke-width': 3 }, svg); void outline;
    [colsG, rowsG, ovG, linesV, linesH].forEach(hide);
    const P = add(stage, box(h('div', 'u1l2-panel'), W - S - 110, 400), S + 90, 14); P.innerHTML = '<div class="u1l2-ph">Working</div>';
    const pl = (html, cls = '') => { const e = hide(h('div', 'u1l2-line ' + cls, html)); P.appendChild(e); return e; };
    const lA = pl(`<span class="u1l2-ca">■</span> ${K(F(an, ad))} of the square`), lB = pl(`<span class="u1l2-cb">■</span> ${K(F(bn, bd))} of that`);
    const prodT = d.of ? `${F(bn, bd)}\\times${F(an, ad)}` : `${F(an, ad)}\\times${F(bn, bd)}`;
    const lP = pl(K(`${prodT}=${d.of ? F(`${bn}\\times${an}`, `${bd}\\times${ad}`) : F(`${an}\\times${bn}`, `${ad}\\times${bd}`)}=${F(N, D)}${simpT(N, D)}`), 'u1l2-big');
    const ct = d.of ? cancelTex(bn, bd, an, ad) : cancelTex(an, ad, bn, bd), lC = pl(`<span class="u1l2-mut">Cancel first:</span><br>${K(ct.tex)}`);
    if (d.of) { lA.innerHTML = `<span class="u1l2-ca">■</span> ${K(F(an, ad))} cup (a full batch)`; lB.innerHTML = `<span class="u1l2-cb">■</span> ${K(F(bn, bd))} of it (half)`; }
    return [
      { cap: `Start with one whole square. Cut it into <b>${ad} columns</b> and shade <b>${an}</b>: that’s ${T(F(an, ad))}.`,
        run: async (c) => { await appear(c, linesV, 300); await appear(c, colsG, 400); await show(c, lA); } },
      { cap: `“${T('\\times')}${T(F(bn, bd))}” means <b>${T(F(bn, bd))} of it</b>. Cut into <b>${bd} rows</b> and shade <b>${bn}</b> of them.`,
        run: async (c) => { await appear(c, linesH, 300); await appear(c, rowsG, 400); await show(c, lB); } },
      { cap: `The overlap (purple) is ${T(F(bn, bd))} of ${T(F(an, ad))}: <b>${N}</b> of the <b>${D}</b> little boxes. Straight across: ${T(`${prodT}=${F(N, D)}`)}.`,
        run: async (c) => { await anim(c, colsG, [{ opacity: 1 }, { opacity: 0.35 }], 300); await anim(c, rowsG, [{ opacity: 1 }, { opacity: 0.35 }], 300); await appear(c, ovG, 400); await show(c, lP); } },
      { cap: g > 1 ? `Simplify: ${T(`${F(N, D)}=${F(N / g, D / g)}`)}. ${ct.g1 > 1 || ct.g2 > 1 ? 'Or <b>cancel first</b> and the numbers stay small.' : ''}` : `${T(F(N, D))} is already in lowest terms.`,
        run: async (c) => { if (ct.g1 > 1 || ct.g2 > 1) await show(c, lC); else await pulse(c, lP, 1.05); } }
    ];
  }
};

/* =============================== explainer: dividing = counting scoops =============================== */
const DIV = {
  w3: { label: 'Warm-up: 1 ÷ ¼', a: [1, 1], b: [1, 4], cup: true },
  big: { label: 'Warm-up: 1½ ÷ ⅓', a: [3, 2], b: [1, 3], cup: true, mix: '1\\frac{1}{2}' },
  e3b: { label: 'Example 3(b) check', a: [5, 8], b: [3, 4] }
};
const divide = {
  title: 'Dividing: how many scoops fit?',
  height: 420,
  minW: 920,
  capH: 96,
  choices: Object.keys(DIV).map((k) => ({ v: k, label: DIV[k].label })),
  intro: (k) => { const d = DIV[k]; return `${T(`${d.mix || (d.a[1] === 1 ? d.a[0] : F(...d.a))}\\div${F(...d.b)}`)}: how many ${T(F(...d.b))} scoops fit? Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = DIV[k], [an, ad] = d.a, [bn, bd] = d.b, L = lcm(ad, bd), A = an * L / ad, S = bn * L / bd, q = Math.floor(A / S), rem = A % S;
    const W = ex.W, top = Math.max(1, Math.ceil(an / ad)), U = (W - 120) / top, X0 = 60, Y = 64, BH = 56, SY = Y + BH + 12, LY = SY + BH + 22;
    const aT = d.mix || (ad === 1 ? String(an) : F(an, ad)), bT = F(bn, bd), rN = an * bd, rD = ad * bn, g = gcd(rN, rD);
    const svg = svgEl('svg', { class: 'u1l2-scoop', width: W, height: 300 }); add(stage, svg, 0, 0);
    const px = (v) => X0 + U * v;
    // the scale: whole numbers and 1/L ticks
    svgEl('line', { x1: px(0), x2: px(top), y1: LY, y2: LY, stroke: INK, 'stroke-width': 2 }, svg);
    for (let i = 0; i <= top * L; i++) { const big = i % L === 0, x = px(i / L); svgEl('line', { x1: x, x2: x, y1: LY - (big ? 9 : 5), y2: LY + (big ? 9 : 5), stroke: INK, 'stroke-width': big ? 2.4 : 1.3 }, svg); if (big) { const t = svgEl('text', { x, y: LY + 28, 'text-anchor': 'middle', class: 'u1l2-snum' }, svg); t.textContent = String(i / L) + (d.cup ? (i / L === 1 ? ' cup' : i ? ' cups' : '') : ''); } }
    const amt = svgEl('rect', { x: px(0), y: Y, width: U * A / L, height: BH, fill: FA, stroke: INK, 'stroke-width': 2.5, rx: 4 }, svg); hide(amt);
    const amtL = lab(stage, px(A / L / 2), Y - 26, K(aT) + (d.cup ? ' cup' + (A > L ? 's' : '') : ''), 'u1l2-slab'); hide(amtL);
    const scoops = [], sl = [];
    const nS = q + (rem ? 1 : 0);
    for (let i = 0; i < nS; i++) {
      const full = i < q, w = U * S / L, x = px(i * S / L);
      const g2 = svgEl('g', {}, svg);
      svgEl('rect', { x: x + 2, y: SY, width: (full ? w : U * rem / L) - 4, height: BH, fill: FB, stroke: BLUE, 'stroke-width': 2.5, rx: 8 }, g2);
      if (!full) svgEl('rect', { x: x + 2, y: SY, width: w - 4, height: BH, fill: 'none', stroke: BLUE, 'stroke-width': 2.5, 'stroke-dasharray': '7 5', rx: 8 }, g2);
      const t = svgEl('text', { x: x + (full ? w : U * rem / L) / 2, y: SY + BH / 2 + 8, 'text-anchor': 'middle', class: 'u1l2-scn' }, g2); t.textContent = full ? String(i + 1) : '';
      hide(g2); scoops.push(g2);
    }
    const remT = rem ? F(rem / gcd(rem, S), S / gcd(rem, S)) : '';
    if (rem) { const e = lab(stage, Math.min(W - 120, px(q * S / L + S / L / 2)), LY + 64, K(remT) + ' of a scoop', 'u1l2-slab u1l2-cb'); hide(e); sl.push(e); }
    const ans = q && rem ? `${q}${remT}` : rem ? remT : String(q);
    const P = add(stage, box(h('div', 'u1l2-panel u1l2-row'), W - 40, 96), 20, 310);
    const aI = ad === 1 ? String(an) : F(an, ad), recT = `${aI}\\times${F(bd, bn)}=${F(rN, rD)}${g > 1 && rD / g > 1 ? '=' + F(rN / g, rD / g) : ''}${mixT(rN, rD) !== F(rN / g, rD / g) ? '=' + mixT(rN, rD) : ''}`;
    const l1 = hide(h('div', 'u1l2-line u1l2-big', K(`${aT}\\div${bT}=${ans}`))), l2 = hide(h('div', 'u1l2-line', `Shortcut: ${d.mix ? K(`${d.mix}=${aI}`) + ', then ' : ''}${K(recT)}`));
    P.append(l1, l2);
    const steps = [
      { cap: `Here is ${T(aT)}${d.cup ? ' cup' + (A > L ? 's' : '') : ''}. Each scoop holds ${T(bT)}${d.cup ? ' cup' : ''}.`,
        run: async (c) => { await appear(c, amt, 300); await show(c, amtL); } }
    ];
    if (q) steps.push({ cap: `Lay scoops along it: ${q === 1 ? 'one full scoop fits' : `${q} full scoops fit`}.`,
      run: async (c) => { for (let i = 0; i < q; i++) await pop(c, scoops[i], 320); } });
    if (rem) steps.push({ cap: q ? `The last bit only fills <b>part</b> of a scoop: ${T(remT)} of a scoop.` : `The scoop is <b>bigger</b> than the amount! In ${ord(L)}: the amount is ${A}, a full scoop is ${S}. So only ${T(remT)} of a scoop fits.`,
      run: async (c) => { await pop(c, scoops[q], 320); for (const e of sl) await show(c, e); } });
    steps.push({ cap: `So ${T(`${aT}\\div${bT}=${ans}`)}.${an * bd > ad * bn ? ' Dividing by a fraction less than 1 gave a <b>bigger</b> answer.' : ''}`,
      run: async (c) => { await show(c, l1); } });
    steps.push({ cap: `The shortcut: <b>multiply by the reciprocal</b>. Flip ${T(bT)} to ${T(F(bd, bn))}: ${T(recT)}. Same answer!`,
      run: async (c) => { await show(c, l2); } });
    return steps;
  }
};

/* =============================== explainer: mixed → improper =============================== */
const IMP = {
  e3c: { label: 'Example 3(c) check', w: 2, n: 1, d: 4, times: [2, 3] },
  w: { label: 'Warm-up: 1½ cups of flour', w: 1, n: 1, d: 2 },
  demo: { label: 'Demo: 3⅔', w: 3, n: 2, d: 3 }
};
const improper = {
  title: 'Mixed number → improper fraction',
  height: 400,
  minW: 920,
  capH: 96,
  choices: Object.keys(IMP).map((k) => ({ v: k, label: IMP[k].label })),
  intro: (k) => { const d = IMP[k]; return `Write ${T(`${d.w}\\frac{${d.n}}{${d.d}}`)} as an improper fraction${d.times ? `, then multiply by ${T(F(...d.times))}` : ''}. Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = IMP[k], W = ex.W, nb = d.w + 1, gap = 18, bw = Math.min(260, (W - 60 - gap * (nb - 1)) / nb), N = d.w * d.d + d.n;
    const bars = [];
    for (let i = 0; i < nb; i++) { const B = new FBar(stage, { x: 30 + i * (bw + gap), y: 80, w: bw, h: 72 }); B.shade(0, i < d.w ? 1 : d.n, i < d.w ? 1 : d.d, FA); bars.push(B); }
    lab(stage, W / 2, 38, K(`${d.w}\\frac{${d.n}}{${d.d}}`), 'u1l2-flab');
    bars[d.w].cuts(d.d, { width: 2.5 });
    const cuts = bars.slice(0, d.w).map((B) => hide(B.cuts(d.d, { dash: '6 4', width: 2, color: '#555' })));
    const nums = [];
    for (let i = 0; i < nb; i++) for (let j = 0; j < (i < d.w ? d.d : d.n); j++) { const t = bars[i].num(j, d.d, String(i * d.d + j + 1)); hide(t); nums.push(t); }
    const wl = bars.slice(0, d.w).map((B, i) => { const e = lab(stage, 30 + i * (bw + gap) + bw / 2, 170, '1 whole', 'u1l2-wlab'); return e; });
    void wl;
    const P = add(stage, box(h('div', 'u1l2-panel'), W - 40, d.times ? 200 : 100), 20, 192);
    const pl = (html, cls = '') => { const e = hide(h('div', 'u1l2-line ' + cls, html)); P.appendChild(e); return e; };
    const l1 = pl(K(`${d.w}\\frac{${d.n}}{${d.d}}=${F(`${d.w}\\times${d.d}+${d.n}`, d.d)}=\\boldsymbol{${F(N, d.d)}}`), 'u1l2-big');
    const steps = [
      { cap: `${T(`${d.w}\\frac{${d.n}}{${d.d}}`)} is ${d.w} whole${d.w > 1 ? 's' : ''} and ${T(F(d.n, d.d))} more.`, run: async (c) => { await pulse(c, bars[d.w].svg, 1.04); } },
      { cap: `Cut every whole into <b>${ord(d.d)}</b>: each whole is ${T(F(d.d, d.d))}, so ${d.w} whole${d.w > 1 ? 's are' : ' is'} ${T(`${d.w}\\times${d.d}=${d.w * d.d}`)} pieces.`,
        run: async (c) => { await Promise.all(cuts.map((g) => appear(c, g, 400))); } },
      { cap: `Count all the pieces: ${T(`${d.w}\\times${d.d}+${d.n}=${N}`)} ${ord(d.d)}. So ${T(`${d.w}\\frac{${d.n}}{${d.d}}=${F(N, d.d)}`)}.`,
        run: async (c) => { for (const t of nums) await appear(c, t, 70); await show(c, l1); } }
    ];
    if (d.times) {
      const [tn, td] = d.times, PN = N * tn, PD = d.d * td, ct = cancelTex(N, d.d, tn, td);
      const l2 = pl(K(`${F(N, d.d)}\\times${F(tn, td)}=${F(PN, PD)}=${mixT(PN, PD) === F(PN / gcd(PN, PD), PD / gcd(PN, PD)) ? '' : F(PN / gcd(PN, PD), PD / gcd(PN, PD)) + '='}\\boldsymbol{${mixT(PN, PD)}}`), 'u1l2-big');
      const l3 = pl(`<span class="u1l2-mut">Or cancel first:</span> ${K(ct.tex)}`);
      steps.push({ cap: `Now multiply straight across: ${T(`${F(N, d.d)}\\times${F(tn, td)}=${F(PN, PD)}`)}, which simplifies to ${T(mixT(PN, PD))}.`, run: async (c) => { await show(c, l2); } });
      steps.push({ cap: `Cancelling first gives the same answer with smaller numbers: ${T(ct.tex.split('=').pop())}${T('=' + mixT(PN, PD))}.`, run: async (c) => { await show(c, l3); } });
    }
    return steps;
  }
};

/* =============================== explainer: long division (from Math 10C 1.4) =============================== */
function expand(a, d, max = 12) {
  const q0 = Math.floor(a / d); let r = a % d;
  const rems = [r], digits = [], seen = new Map([[r, 0]]); let loopStart = -1;
  while (r !== 0 && digits.length < max) {
    const n = r * 10; digits.push(Math.floor(n / d)); r = n % d; rems.push(r);
    if (r !== 0 && seen.has(r)) { loopStart = seen.get(r); break; }
    seen.set(r, digits.length);
  }
  return { a, d, q0, digits, rems, loopStart, terminates: r === 0 };
}
function decTeX(e) {
  if (!e.digits.length) return String(e.q0);
  if (e.terminates) return e.q0 + '.' + e.digits.join('');
  return e.q0 + '.' + e.digits.slice(0, e.loopStart).join('') + '\\overline{' + e.digits.slice(e.loopStart).join('') + '}';
}
const LD = [['3/4', 'Notes: 3/4'], ['3/8', 'Example 4 check: (a)(i)'], ['4/5', '(a)(ii)'], ['2/3', '(c)'], ['5/6', 'Demo: 5/6']];
const longdiv = {
  title: 'Long division, one digit at a time',
  height: 390,
  capH: 104,
  minW: 920,
  choices: LD.map(([v, label]) => ({ v, label })),
  intro: (v) => { const [a, d] = v.split('/'); return `Divide <b>${a} ÷ ${d}</b> one digit at a time. Keep an eye on the <b>remainders</b>.`; },
  make(stage, v, ex) {
    const [a, d] = v.split('/').map(Number), e = expand(a, d, 10), W = ex.W, H = ex.def.height;
    const nd = e.digits.length, aS = String(a), k = aS.length, dS = String(d);
    const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
    const leftW = Math.round(W * 0.45), cw = 30, dotW = 8, divW = dS.length * cw;
    const total = divW + 24 + (k + nd) * cw + (nd ? dotW : 0);
    const x0 = Math.max(14, (leftW - total) / 2) + divW + 24;
    const colX = (j) => x0 + j * cw + (j >= k ? dotW : 0);
    const quotY = 24, divY = 78, rh = 36, rowY = (r) => divY + r * rh;
    const win = add(stage, h('div', 'u1l2-ldwin'), 0, 0); win.style.width = leftW + 'px'; win.style.height = H + 'px';
    const work = h('div', 'u1l2-ldwork'); win.appendChild(work);
    const put = (el, x, y) => { work.appendChild(at(el, x, y)); return el; };
    const cell = (ch, j, y, cls) => { const el = put(h('div', 'u1l2-ld' + (cls ? ' ' + cls : ''), ch), colX(j), y); el.style.width = cw + 'px'; return el; };
    const num = (n, j, y, cls) => String(n).split('').map((ch, i, s) => cell(ch, j - (s.length - 1 - i), y, cls));
    const under = (n, j, y) => {
      const len = String(n).length, xl = colX(j - len + 1);
      const mn = put(h('div', 'u1l2-ldminus', '−'), xl - 22, y);
      const ln = put(h('div', 'u1l2-ldline'), xl - 6, y + rh - 2); ln.style.width = (colX(j) + cw - xl + 12) + 'px';
      return [mn, ln];
    };
    const dv = put(h('div', 'u1l2-lddv', dS), x0 - 24 - divW, divY); dv.style.width = divW + 'px';
    const svg = svgEl('svg', { class: 'u1l2-ldsvg' }); work.appendChild(svg);
    const endX = Math.max(colX(k + nd - 1) + cw + 8, x0 + 40);
    svg.appendChild(svgEl('path', { d: `M ${x0 - 18} ${divY + rh + 4} Q ${x0 - 4} ${divY + rh / 2} ${x0 - 18} ${divY - 4} L ${endX} ${divY - 4}`, class: 'u1l2-ldbr' }));
    const dvd = []; aS.split('').forEach((ch, j) => { dvd[j] = cell(ch, j, divY, 'dvd'); });
    if (nd) { const pt = put(h('div', 'u1l2-ldpt', '.'), x0 + k * cw - 4, divY); pt.style.width = dotW + 8 + 'px'; for (let i = 0; i < nd; i++) dvd[k + i] = cell('0', k + i, divY, 'dvd z'); }
    const qcells = [];
    const rx = leftW + 24, rw = W - rx - 18;
    const res = add(stage, h('div', 'u1l2-ldres'), rx, 14);
    add(stage, h('div', 'u1l2-ldth', 'Each step: divide, write the digit, keep the remainder'), rx, 74).style.width = rw + 'px';
    const rowTop = 104, trh = 35, rows = [];
    const trow = (i, html, r, cls) => {
      const el = add(stage, h('div', 'u1l2-ldtr' + (cls ? ' ' + cls : ''), `<span class="u1l2-ldeq">${html}</span><span class="u1l2-ldrc">${r}</span>`), rx, rowTop + i * trh);
      el.style.width = (rw - 70) + 'px'; rows[i] = el; return el;
    };
    const loopSvg = svgEl('svg', { class: 'u1l2-ldloop' }); stage.appendChild(loopSvg);
    const resText = (n) => `${a} ÷ ${d} = <b>${e.q0}${n ? '.' : ''}${e.digits.slice(0, n).map((g, i) => (i === n - 1 ? `<span class="new">${g}</span>` : g)).join('')}</b>${n ? '<span class="muted">…</span>' : ''}`;
    let scrolled = 0;
    const scrollTo = (c, bottom) => {
      const s = Math.max(0, bottom - (H - 16)); if (s === scrolled) return Promise.resolve();
      const from = scrolled; scrolled = s;
      return c.anim(work, [{ transform: `translateY(${-from}px)` }, { transform: `translateY(${-s}px)` }], 500);
    };
    const steps = [], base = e.q0 > 0 ? 2 : 0;
    steps.push({
      cap: `${d} doesn’t go into ${a}, so the answer starts with <b>0.</b> and the remainder is <b>${a}</b>. Write zeros after the decimal point: ${a} = ${a}.000…`,
      run: async (c) => {
        const jobs = [];
        num(e.q0, k - 1, quotY, 'q').forEach((el) => jobs.push(c.pop(el, 380)));
        if (nd) { const qp = put(h('div', 'u1l2-ldpt q', '.'), x0 + k * cw - 4, quotY); qp.style.width = dotW + 8 + 'px'; jobs.push(c.pop(qp, 300, { delay: 150 })); }
        dvd.slice(0, k).forEach((el) => el.classList.add('use'));
        res.innerHTML = resText(0);
        jobs.push(c.fadeIn(trow(0, `<span class="muted">start:</span> ${a} ÷ ${d} = <b>${e.q0}</b> R`, e.rems[0]), 300, { delay: 300 }));
        await Promise.all(jobs);
      }
    });
    e.digits.forEach((dig, i) => {
      const r = e.rems[i], n = r * 10, nr = e.rems[i + 1], col = k + i, R = base + 2 * i;
      const stop = nr === 0, again = i === nd - 1 && e.loopStart >= 0, first = i === 0 && e.q0 === 0;
      steps.push({
        cap: (first ? `Use the first 0 after the point: <b>${n} ÷ ${d} = ${dig} R ${nr}</b>. ` : `Bring down a 0 to make ${n}: <b>${n} ÷ ${d} = ${dig} R ${nr}</b>. `)
          + (stop ? 'The remainder is <b>0</b>: nothing is left to divide.' : again ? `Remainder <b class="u1l2-cr">${nr}</b>: we’ve had that remainder before!` : `Write <b>${dig}</b> on top; the new remainder is <b>${nr}</b>.`),
        run: async (c) => {
          dvd[col].classList.remove('z');
          if (first) { dvd[col].classList.add('use'); await c.pop(dvd[col], 300); }
          else {
            const z = cell('0', col, rowY(R), 'r bd');
            await Promise.all([scrollTo(c, rowY(R + 2) + rh), c.anim(z, [{ transform: `translateY(${divY - rowY(R)}px)`, opacity: 0.2 }, { transform: 'none', opacity: 1 }], 560)]);
          }
          const jobs = [];
          const q = cell(String(dig), col, quotY, 'q'); qcells[i] = q; jobs.push(c.pop(q, 380));
          num(dig * d, col, rowY(R + 1), 'p').forEach((el) => jobs.push(c.fadeIn(el, 300, { delay: 250 })));
          const [mn, ln] = under(dig * d, col, rowY(R + 1));
          jobs.push(c.fadeIn(mn, 300, { delay: 250 }), c.anim(ln, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 300, { delay: 450 }));
          num(nr, col, rowY(R + 2), 'r' + (stop ? ' zero' : again ? ' again' : '')).forEach((el) => jobs.push(c.pop(el, 380, { delay: 650 })));
          res.innerHTML = resText(i + 1);
          jobs.push(c.fadeIn(trow(i + 1, `${n} ÷ ${d} = <b>${dig}</b> R`, nr, stop ? 'zero' : again ? 'again' : ''), 300, { delay: 600 }), scrollTo(c, rowY(R + 2) + rh));
          await Promise.all(jobs);
        }
      });
    });
    const Tr = tex(`\\dfrac{${a}}{${d}}=${decTeX(e)}`), Tres = tex(`\\tfrac{${a}}{${d}}=${decTeX(e)}`);
    if (e.terminates) {
      steps.push({
        cap: `Remainder 0, so the division <b>stops</b>: ${Tr}. It <b>terminates</b>.`,
        run: async (c) => { res.innerHTML = `${Tres} <span class="u1l2-ldtag ok">terminates</span>`; await Promise.all([c.fadeIn(res, 350), ...(rows[nd] ? [c.pop(rows[nd].querySelector('.u1l2-ldrc'), 400)] : [])]); }
      });
    } else {
      const j = e.loopStart, blk = e.digits.slice(j).join('');
      steps.push({
        cap: `A remainder came back, so the same digits come back too: the <b>${blk}</b> goes on forever. ${Tr}: it <b>repeats</b>. The bar shows the repeating digit${blk.length > 1 ? 's' : ''}.`,
        run: async (c) => {
          const jobs = [];
          const chip = (i) => rows[i].querySelector('.u1l2-ldrc'), cxR = (i) => rows[i].offsetLeft + chip(i).offsetLeft + chip(i).offsetWidth + 4, cy = (i) => rows[i].offsetTop + rows[i].offsetHeight / 2;
          const x1 = cxR(nd), y1 = cy(nd), y2 = cy(j), bulge = Math.min(54, 26 + (nd - j) * 5);
          const p = svgEl('path', { d: `M ${x1} ${y1} C ${x1 + bulge} ${y1}, ${x1 + bulge} ${y2}, ${x1 + 2} ${y2}`, class: 'u1l2-ldarc' });
          const head = svgEl('path', { d: `M ${x1 + 2} ${y2} l 10 -6 l -1 12 z`, class: 'u1l2-ldhead' });
          loopSvg.append(p, head);
          const len = p.getTotalLength ? p.getTotalLength() || 300 : 300; p.style.strokeDasharray = len; p.style.strokeDashoffset = len; head.style.opacity = 0;
          jobs.push(c.anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], 700), c.anim(head, [{ opacity: 0 }, { opacity: 1 }], 200, { delay: 650 }));
          rows[j].classList.add('again');
          for (let i = j; i <= nd; i++) rows[i].classList.add('cyc');
          for (let i = j; i < nd; i++) qcells[i].classList.add('blk');
          const bar = put(h('div', 'u1l2-ldbar'), colX(k + j) + 3, quotY - 3); bar.style.width = (colX(k + nd - 1) + cw - colX(k + j) - 6) + 'px';
          jobs.push(c.anim(bar, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 450, { delay: 500 }));
          res.innerHTML = `${Tres} <span class="u1l2-ldtag rep">repeats</span>`;
          jobs.push(c.fadeIn(res, 350, { delay: 700 }));
          await Promise.all(jobs);
        }
      });
    }
    return steps;
  }
};

/* =============================== explainer: decimal → fraction by place value =============================== */
const PLC = { e4b1: { label: 'Example 4 check: (b)(i)', s: '0.45' }, e4b2: { label: '(b)(ii)', s: '0.85' }, demo: { label: 'Demo: 0.375', s: '0.375' } };
const PLACES = ['tenths', 'hundredths', 'thousandths'];
const place = {
  title: 'Read the place value',
  height: 420,
  minW: 920,
  capH: 96,
  choices: Object.keys(PLC).map((k) => ({ v: k, label: PLC[k].label })),
  intro: (k) => `Write ${T(PLC[k].s)} as a fraction in lowest terms. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const s = PLC[k].s, dg = s.split('.')[1], dp = dg.length, n = +dg, D = 10 ** dp, g = gcd(n, D), W = ex.W;
    const tb = add(stage, h('div', 'u1l2-pv'), 20, 20);
    const heads = ['ones', '', ...PLACES], cells = [];
    tb.innerHTML = heads.map((t, i) => `<div class="u1l2-pvh${i === 1 ? ' u1l2-pvdot' : ''}">${t}</div>`).join('');
    const vals = ['0', '.', ...PLACES.map((_, i) => dg[i] || '')];
    vals.forEach((v, i) => { const c = h('div', 'u1l2-pvc' + (i === 1 ? ' u1l2-pvdot' : ''), v); tb.appendChild(c); cells.push(c); if (v && i > 1) hide(c); });
    const P = add(stage, box(h('div', 'u1l2-panel'), 530, 210), 20, 160); P.innerHTML = '<div class="u1l2-ph">Working</div>';
    const pl = (html, cls = '') => { const e = hide(h('div', 'u1l2-line ' + cls, html)); P.appendChild(e); return e; };
    const l1 = pl(`Last digit: <b>${PLACES[dp - 1]}</b>, so the denominator is ${fmtN(D)}.`), l2 = pl(K(`${s}=${F(n, D)}`), 'u1l2-big');
    const l3 = pl(K(g > 1 ? `=${F(`${n}\\div${g}`, `${D}\\div${g}`)}=\\boldsymbol{${F(n / g, D / g)}}` : `\\text{already in lowest terms}`), 'u1l2-big');
    // the picture: a hundred grid (tenths: strips) or a note for thousandths
    const GX = 580, GY = 20, GS = 320;
    const gsvg = svgEl('svg', { class: 'u1l2-grid', width: GS + 8, height: GS + 8 }); add(stage, gsvg, GX, GY);
    const sh = svgEl('g', {}, gsvg); hide(sh);
    if (dp <= 2) {
      const cols = dp === 1 ? 10 : 10, rowsN = dp === 1 ? 1 : 10, cw = GS / cols, rh = GS / rowsN;
      for (let i = 0; i < n; i++) { const cx = dp === 1 ? i : Math.floor(i / 10), cy = dp === 1 ? 0 : i % 10; svgEl('rect', { x: 4 + cx * cw, y: 4 + cy * rh, width: cw, height: rh, fill: FA }, sh); }
      for (let i = 0; i <= cols; i++) svgEl('line', { x1: 4 + i * cw, x2: 4 + i * cw, y1: 4, y2: 4 + GS, stroke: INK, 'stroke-width': i % 10 === 0 ? 3 : 1.2 }, gsvg);
      for (let j = 0; j <= rowsN; j++) svgEl('line', { x1: 4, x2: 4 + GS, y1: 4 + j * rh, y2: 4 + j * rh, stroke: INK, 'stroke-width': j % 10 === 0 ? 3 : 1.2 }, gsvg);
    } else {
      // thousandths: a thousand is too many squares, so show the 1000-strip idea with one 10 × 10 grid = 100 thousandths? keep it simple: a bar of 1000
      svgEl('rect', { x: 4, y: GS / 2 - 40, width: GS * n / D, height: 80, fill: FA }, sh);
      svgEl('rect', { x: 4, y: GS / 2 - 40, width: GS, height: 80, fill: 'none', stroke: INK, 'stroke-width': 3 }, gsvg);
      const e8 = svgEl('g', { class: 'u1l2-e8' }, gsvg); hide(e8);
      for (let i = 1; i < 8; i++) svgEl('line', { x1: 4 + GS * i / 8, x2: 4 + GS * i / 8, y1: GS / 2 - 40, y2: GS / 2 + 40, stroke: INK, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, e8);
      const t = svgEl('text', { x: 4 + GS / 2, y: GS / 2 + 74, 'text-anchor': 'middle', class: 'u1l2-gtext' }, gsvg); t.textContent = `${n} of 1000 tiny pieces`;
    }
    const glab = hide(lab(stage, GX + GS / 2 + 4, GY + GS + 30, '', 'u1l2-slab'));
    const steps = [
      { cap: `Put ${T(s)} in a place-value chart.`,
        run: async (c) => { for (let i = 2; i < 2 + dp; i++) await pop(c, cells[i], 300); } },
      { cap: `The last digit, <b>${dg[dp - 1]}</b>, is in the <b>${PLACES[dp - 1]}</b> place. So the denominator is <b>${fmtN(D)}</b>.`,
        run: async (c) => { cells[1 + dp].classList.add('u1l2-pvlast'); tb.children[1 + dp].classList.add('u1l2-pvlast'); await pulse(c, cells[1 + dp], 1.2); await show(c, l1); } },
      { cap: `${T(s)} is “${n} ${PLACES[dp - 1]}”: ${T(`${s}=${F(n, D)}`)}.`,
        run: async (c) => { glab.innerHTML = dp === 1 ? `${n} of 10 strips` : dp === 2 ? `${n} of 100 squares` : ''; await appear(c, sh, 500); if (glab.innerHTML) await show(c, glab); await show(c, l2); } },
      { cap: g > 1 ? `Simplify with the GCF: GCF${T(`(${n},\\ ${fmtN(D)})=${g}`)}, so ${T(`${F(n, D)}=${F(n / g, D / g)}`)}.${dp === 3 ? ' (That’s 3 of the 8 dashed pieces!)' : ''}` : `${T(F(n, D))} is already in lowest terms.`,
        run: async (c) => { await show(c, l3); const e8 = gsvg.querySelector('.u1l2-e8'); if (e8) await appear(c, e8, 400); } }
    ];
    return steps;
  }
};
function fmtN(n) { return n >= 1000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n); }

/* =============================== explainer: order of operations with fractions and decimals =============================== */
const FB_ = {
  e5a: { label: 'Example 5(a) check', items: [[3, 4], '-', [1, 2], '*', [1, 3]] },
  demo: { label: 'Demo: 1/2 + 1/4 × 2/3', items: [[1, 2], '+', [1, 4], '*', [2, 3]] },
  dec: { label: 'Demo: 4.5 − 1.5 × 2', items: [4.5, '-', 1.5, '*', 2] }
};
const OPT = { '+': '+', '-': '-', '*': '\\times', '/': '\\div' };
const itT = (v) => (Array.isArray(v) ? F(v[0], v[1]) : String(v));
function fop(a, op, b) { // → { v, d (TeX working) }
  if (!Array.isArray(a)) {
    const v = Math.round((op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b) * 1e9) / 1e9;
    return { v, d: `${a}${OPT[op]}${b}=${v}` };
  }
  const [an, ad] = a, [bn, bd] = b;
  if (op === '*' || op === '/') {
    const [cn, cd] = op === '*' ? [bn, bd] : [bd, bn], N = an * cn, D = ad * cd, g = gcd(N, D);
    return { v: [N / g, D / g], d: `${F(an, ad)}${OPT[op]}${F(bn, bd)}=${op === '/' ? F(an, ad) + '\\times' + F(cn, cd) + '=' : ''}${F(N, D)}${g > 1 ? '=' + F(N / g, D / g) : ''}` };
  }
  const L = lcm(ad, bd), A = an * L / ad, B = bn * L / bd, R = op === '+' ? A + B : A - B, g = gcd(R, L);
  return { v: [R / g, L / g], d: `${F(an, ad)}${OPT[op]}${F(bn, bd)}=${ad === bd ? '' : F(A, L) + OPT[op] + F(B, L) + '='}${F(R, L)}${g > 1 ? '=' + F(R / g, L / g) : ''}` };
}
const fbedmas = {
  title: 'Order of operations: the next step lights up',
  height: 400,
  minW: 920,
  capH: 96,
  choices: Object.keys(FB_).map((k) => ({ v: k, label: FB_[k].label })),
  intro: (k) => `Evaluate ${T(FB_[k].items.map((x) => (typeof x === 'string' ? OPT[x] : itT(x))).join(''))}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    let cur = FB_[k].items.slice(); const W = ex.W, X = 40, lh = 96;
    const toT = (L, hi, fresh) => L.map((x, i) => {
      let t = typeof x === 'string' ? OPT[x] : itT(x);
      if (fresh === i) t = `\\htmlClass{u1l2-new}{${t}}`;
      return t;
    }).reduce((acc, t, i) => { acc.push(t); return acc; }, []).map((t, i, arr) => (hi && i === hi[0] ? `\\htmlClass{u1l2-op}{${arr.slice(hi[0], hi[1] + 1).join('')}}` : hi && i > hi[0] && i <= hi[1] ? '' : t)).join('');
    const lines = []; const mk = (i, html) => { const e = add(stage, h('div', 'u1l2-bline', html), X, 14 + i * lh); e.style.height = lh + 'px'; lines.push(e); return e; };
    mk(0, K(toT(cur)));
    const work = add(stage, box(h('div', 'u1l2-panel'), 380, 370), W - 400, 10); work.innerHTML = '<div class="u1l2-ph">On the side</div>';
    const steps = [];
    let i = 0;
    for (;;) {
      let at = cur.findIndex((x) => x === '*' || x === '/'); const md = at >= 0; if (!md) at = cur.findIndex((x) => x === '+' || x === '-');
      if (at < 0) break;
      const r = fop(cur[at - 1], cur[at], cur[at + 1]), before = toT(cur, [at - 1, at + 1]);
      const nxt = cur.slice(0, at - 1).concat([r.v], cur.slice(at + 2)), after = toT(nxt, null, at - 1), idx = i;
      const opW = { '*': 'Multiply', '/': 'Divide', '+': 'Add', '-': 'Subtract' }[cur[at]];
      steps.push({
        cap: md ? `<b>${opW} first</b>, even though the ${cur.slice(0, at).some((x) => x === '+' || x === '-') ? T(cur.slice(0, at).find((x) => x === '+' || x === '-') === '+' ? '+' : '-') + ' is read first' : 'order matters'}: ${T(r.d)}.` : `<b>${opW}</b> last${Array.isArray(r.v) && cur[at - 1][1] !== cur[at + 1][1] ? ' (common denominator first)' : ''}: ${T(r.d)}.`,
        run: async (c) => {
          lines[idx].innerHTML = K((idx ? '=' : '') + before);
          const op = lines[idx].querySelector('.u1l2-op'); if (op) await pulse(c, op, 1.06);
          const wl = hide(h('div', 'u1l2-line', K(r.d))); work.appendChild(wl); await show(c, wl);
          const ln = hide(mk(idx + 1, K('=' + after))); await show(c, ln);
        }
      });
      cur = nxt; i++;
    }
    const fin = itT(cur[0]);
    steps.push({ cap: `Done: the answer is ${T(fin)}.`, run: async (c) => { const last = lines[lines.length - 1]; last.classList.add('u1l2-final'); await pulse(c, last, 1.06); } });
    return steps;
  }
};

/* =============================== explainer: decimal rules =============================== */
const DEC = {
  add: { label: 'Line up: 2.75 + 1.4', a: '2.75', b: '1.4', op: '+' },
  sub: { label: 'Line up: 6.2 − 3.75', a: '6.2', b: '3.75', op: '-' },
  m1: { label: 'Count places: 0.3 × 0.25', a: '0.3', b: '0.25', op: '*' },
  m2: { label: 'Count places: 1.2 × 0.4', a: '1.2', b: '0.4', op: '*' },
  d1: { label: 'Notes: 1.2 ÷ 0.3', a: '1.2', b: '0.3', op: '/' },
  d2: { label: 'Demo: 3.6 ÷ 0.04', a: '3.6', b: '0.04', op: '/' }
};
const decimals = {
  title: 'Decimal points: line them up, count them, or hop them',
  height: 400,
  minW: 900,
  capH: 96,
  choices: Object.keys(DEC).map((k) => ({ v: k, label: DEC[k].label })),
  intro: (k) => { const d = DEC[k]; return `${T(`${d.a}${OPT[d.op]}${d.b}`)}. Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = DEC[k], W = ex.W, CW = 54, RH = 70;
    const dpA = d.a.split('.')[1].length, dpB = d.b.split('.')[1].length;
    if (d.op === '/') {
      // dividing by a decimal: multiply both numbers by 10 until the divisor is whole (the points hop right together)
      const sh = dpB, k10 = 10 ** sh;
      const cellsOf = (s) => { const [ip, fp] = s.split('.'); return { ip, ds: (ip + fp.padEnd(sh, '0')).split(''), orig: ip.length + fp.length }; };
      const moved = (s) => { const [ip, fp] = s.split('.'), f = fp.padEnd(sh, '0'), n = (ip + f.slice(0, sh)).replace(/^0+(?=\d)/, ''), r = f.slice(sh); return r ? n + '.' + r : n; };
      const A2 = moved(d.a), B2 = moved(d.b), q = Math.round((+A2 / +B2) * 1e6) / 1e6;
      lab(stage, W / 2, 40, K(`${d.a}\\div${d.b}`), 'u1l2-dhead');
      const hops = svgEl('svg', { class: 'u1l2-dhops', width: W, height: 400 }); add(stage, hops, 0, 0);
      const rows = [d.a, d.b].map((s, ri) => {
        const { ip, ds, orig } = cellsOf(s), n = ds.length, y = 96 + ri * 104, x0 = W / 2 - 60 - n * CW;
        const cells = ds.map((ch, i) => { const e = add(stage, h('div', 'u1l2-dg' + (i >= orig ? ' u1l2-dzero' : ''), ch), x0 + i * CW, y); e.style.width = CW + 'px'; if (i >= orig) hide(e); return e; });
        const dot = add(stage, h('div', 'u1l2-ddot'), x0 + ip.length * CW - 7, y + 44);
        const tag = hide(lab(stage, W / 2 + 150, y + 30, `${T(`${s}\\times${k10}=${ri ? B2 : A2}`)}`, 'u1l2-dsub'));
        return { cells, dot, tag, x0, y, ip: ip.length, orig };
      });
      const res = hide(lab(stage, W / 2, 352, K(`${A2}\\div${B2}=\\boldsymbol{${q}}`), 'u1l2-dsub'));
      return [
        { cap: `The divisor ${T(d.b)} is not a whole number. Multiply <b>both</b> numbers by ${k10 === 10 ? '10' : `10 ${sh === 2 ? 'twice' : sh + ' times'} (${T(`\\times${k10}`)})`}: each decimal point hops <b>${sh} place${sh > 1 ? 's' : ''} right</b>.`,
          run: async (c) => {
            for (const r of rows) {
              for (let i = 0; i < sh; i++) {
                const xa = r.x0 + (r.ip + i) * CW, xb = xa + CW;
                const p = svgEl('path', { d: `M${xa} ${r.y + 50} Q${(xa + xb) / 2} ${r.y + 82} ${xb} ${r.y + 50}`, fill: 'none', stroke: AMB, 'stroke-width': 3 }, hops); hide(p);
                await appear(c, p, 150);
                await anim(c, r.dot, [{ left: xa - 7 + 'px' }, { left: xb - 7 + 'px' }], 300);
                const z = r.cells[r.ip + i]; if (z && z.classList.contains('u1l2-dzero')) await pop(c, z, 250);
              }
              await show(c, r.tag);
            }
          } },
        { cap: `Now the divisor is whole: ${T(`${A2}\\div${B2}=${q}`)}.`, run: async (c) => { await show(c, res); } },
        { cap: `Same answer as ${T(`${d.a}\\div${d.b}`)}: scaling <b>both</b> numbers keeps the quotient the same. Check: ${T(`${d.b}\\times${q}=${d.a}`)}.`, run: async (c) => { await pulse(c, res, 1.08); } }
      ];
    }
    if (d.op !== '*') {
      const P = Math.max(dpA, dpB), pad = (s) => s + '0'.repeat(P - s.split('.')[1].length);
      const A = pad(d.a), B = pad(d.b), sc = 10 ** P, rv = (d.op === '+' ? Math.round(+A * sc) + Math.round(+B * sc) : Math.round(+A * sc) - Math.round(+B * sc)) / sc, Rs = rv.toFixed(P);
      const wI = Math.max(A.split('.')[0].length, B.split('.')[0].length, Rs.split('.')[0].length), cols = wI + 1 + P, x0 = (W - cols * CW) / 2, y0 = 70;
      const colOf = (s, i) => { const [ip] = s.split('.'); return wI - ip.length + i; };   // character i of s → column
      const put = (ch, col, row, cls = '') => { const e = add(stage, h('div', 'u1l2-dg ' + cls, ch), x0 + col * CW, y0 + row * RH); e.style.width = CW + 'px'; return e; };
      const band = add(stage, h('div', 'u1l2-dband'), x0 + wI * CW, y0 - 10); band.style.width = CW + 'px'; band.style.height = (3 * RH + 30) + 'px'; hide(band);
      const rowEls = (s, orig, row) => s.split('').map((ch, i) => put(ch, colOf(s, i), row, (ch === '.' ? 'pt' : '') + (i >= orig.length ? ' u1l2-dzero' : '')));
      const ra = rowEls(A, d.a, 0), rb = rowEls(B, d.b, 1);
      add(stage, h('div', 'u1l2-dg u1l2-dop', d.op === '+' ? '+' : '−'), x0 - CW, y0 + RH);
      const ln = add(stage, h('div', 'u1l2-dline'), x0 - CW, y0 + 2 * RH - 4); ln.style.width = (cols + 1) * CW + 'px';
      const zeros = [...ra, ...rb].filter((e) => e.classList.contains('u1l2-dzero')); zeros.forEach(hide);
      const rr = Rs.split('').map((ch, i) => hide(put(ch, colOf(Rs, i), 2, ch === '.' ? 'pt u1l2-dres' : 'u1l2-dres')));
      return [
        { cap: `Write them in columns with the <b>decimal points lined up</b>: ones under ones, tenths under tenths.`, run: async (c) => { await appear(c, band, 300); } },
        { cap: zeros.length ? `Fill the empty place with 0: ${T(d.a.length < A.length ? `${d.a}=${A}` : `${d.b}=${B}`)}. (Same value.)` : 'Every place is filled.', run: async (c) => { for (const z of zeros) await pop(c, z, 300); } },
        { cap: `${d.op === '+' ? 'Add' : 'Subtract'} column by column, right to left, just like whole numbers.`, run: async (c) => { for (let i = rr.length - 1; i >= 0; i--) if (Rs[i] !== '.') await pop(c, rr[i], 260); } },
        { cap: `Bring the decimal point straight down: ${T(`${d.a}${OPT[d.op]}${d.b}=${Rs}`)}.`, run: async (c) => { const p = rr[Rs.indexOf('.')]; await pop(c, p, 400); } }
      ];
    }
    const ia = +d.a.replace('.', ''), ib = +d.b.replace('.', ''), pr = ia * ib, dp = dpA + dpB, ans = (pr / 10 ** dp).toFixed(dp).replace(/0+$/, '').replace(/\.$/, '');
    lab(stage, W / 2, 40, K(`${d.a}\\times${d.b}`), 'u1l2-dhead');
    const l1 = hide(lab(stage, W / 2, 110, K(`${ia}\\times${ib}=${pr}`), 'u1l2-dsub'));
    const bA = hide(lab(stage, W / 2 - 160, 170, `${T(d.a)}: <b>${dpA}</b> place${dpA > 1 ? 's' : ''}`, 'u1l2-dbadge')), bB = hide(lab(stage, W / 2 + 160, 170, `${T(d.b)}: <b>${dpB}</b> place${dpB > 1 ? 's' : ''}`, 'u1l2-dbadge'));
    // the answer: digits with the point hopping left
    const digits = String(pr).padStart(dp + 1, '0'), n = digits.length, x0 = (W - n * CW) / 2, y = 250;
    const cellsD = digits.split('').map((ch, i) => { const e = add(stage, h('div', 'u1l2-dg' + (i < n - String(pr).length ? ' u1l2-dzero' : ''), ch), x0 + i * CW, y); e.style.width = CW + 'px'; return e; });
    cellsD.filter((e) => e.classList.contains('u1l2-dzero')).forEach(hide);
    cellsD.forEach((e) => { if (!e.classList.contains('u1l2-dzero')) hide(e); });
    const dot = hide(add(stage, h('div', 'u1l2-ddot'), x0 + n * CW - 6, y + 40));
    const hops = svgEl('svg', { class: 'u1l2-dhops', width: W, height: 400 }); add(stage, hops, 0, 0);
    const res = hide(lab(stage, W / 2, 360, K(`${d.a}\\times${d.b}=\\boldsymbol{${ans}}`), 'u1l2-dsub'));
    return [
      { cap: `Ignore the decimal points and multiply whole numbers: ${T(`${ia}\\times${ib}=${pr}`)}.`, run: async (c) => { await show(c, l1); for (const e of cellsD) if (!e.classList.contains('u1l2-dzero')) await appear(c, e, 150); } },
      { cap: `Count the decimal places in the factors: ${dpA} + ${dpB} = <b>${dp}</b>.`, run: async (c) => { await pop(c, bA); await pop(c, bB); } },
      { cap: `Start at the end of ${pr} and hop the decimal point <b>${dp} places left</b>${n > String(pr).length ? ', filling empty places with 0' : ''}.`,
        run: async (c) => {
          await appear(c, dot, 200);
          for (let i = 0; i < dp; i++) {
            const xa = x0 + (n - i) * CW, xb = x0 + (n - i - 1) * CW;
            const p = svgEl('path', { d: `M${xa} ${y + 46} Q${(xa + xb) / 2} ${y + 80} ${xb} ${y + 46}`, fill: 'none', stroke: AMB, 'stroke-width': 3 }, hops); hide(p);
            await appear(c, p, 150);
            await anim(c, dot, [{ left: xa - 6 + 'px' }, { left: xb - 6 + 'px' }], 300);
            const z = cellsD[n - i - 2]; if (z && z.classList.contains('u1l2-dzero')) await pop(c, z, 250);
          }
        } },
      { cap: `${T(`${d.a}\\times${d.b}=${ans}`)}. Check it’s sensible: ${d.a.startsWith('0') && d.b.startsWith('0') ? 'two numbers less than 1 multiply to something <b>smaller</b> than both.' : `about ${T(`${Math.round(+d.a)}\\times${d.b}`)}.`}`,
        run: async (c) => { await show(c, res); } }
    ];
  }
};

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  const ASG = new Set(['1/2=?/8', '2/3=?/12', '3/5=?/20', '6/8', '9/12', '14/21', '20/25', '1/3+1/6', '3/4-1/8', '2/5+1/2', '5/6-1/3',
    '1/2*2/5', '3/4*4/9', '5/6*3/10', '1/3/2/5', '3/4/1/2', '2/5/4/5']);
  const red = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };
  // Beginning: equivalent fractions (missing numerator) or simplify
  function beg(r) {
    for (;;) {
      if (r.chance(0.5)) {
        const d = r.pick([2, 3, 4, 5, 6, 8]), n = r.int(1, d - 1); if (gcd(n, d) > 1) continue;
        const k = r.int(2, 6), key = `${n}/${d}=?/${d * k}`; if (ASG.has(key)) continue;
        return { text: 'Fill in the missing numerator.', q: `${F(n, d)}=${F('\\square', d * k)}`, a: [`${d * k}\\div${d}=${k}`, `${F(`${n}\\times${k}`, `${d}\\times${k}`)}=${F(n * k, d * k)}`] };
      }
      const d0 = r.pick([3, 4, 5, 6, 7, 8, 9]), n0 = r.int(1, d0 - 1); if (gcd(n0, d0) > 1) continue;
      const g = r.int(2, 6), n = n0 * g, d = d0 * g; if (ASG.has(`${n}/${d}`) || d > 60) continue;
      return { text: 'Simplify to lowest terms.', q: F(n, d), a: [`\\text{GCF}(${n},\\ ${d})=${g}`, `${F(`${n}\\div${g}`, `${d}\\div${g}`)}=${F(n0, d0)}`] };
    }
  }
  // Progressing: add or subtract with unlike denominators; sometimes mixed numbers (no regrouping)
  function prg(r) {
    for (;;) {
      const b = r.pick([2, 3, 4, 5, 6, 8, 10]), d = r.pick([2, 3, 4, 5, 6, 8, 10]); if (b === d) continue;
      const a = r.int(1, b - 1), c = r.int(1, d - 1); if (gcd(a, b) > 1 || gcd(c, d) > 1) continue;
      const op = r.pick(['+', '-']), L = lcm(b, d), A = a * L / b, C = c * L / d, R = op === '+' ? A + C : A - C;
      if (R <= 0 || ASG.has(`${a}/${b}${op}${c}/${d}`)) continue;
      if (r.chance(0.3)) {
        if (op === '+' ? R >= L : false) continue;
        const w1 = r.int(1, 4), w2 = r.int(1, op === '+' ? 3 : w1 - 1 || 1); if (op === '-' && w2 >= w1) continue;
        const W = op === '+' ? w1 + w2 : w1 - w2, [rn, rd] = red(R, L);
        return { text: `${op === '+' ? 'Add' : 'Subtract'}. Give the answer in lowest terms.`, q: `${w1}${F(a, b)}${op}${w2}${F(c, d)}`,
          a: [`\\text{wholes: }${w1}${op}${w2}=${W}`, `\\text{fractions: }${F(a, b)}${op}${F(c, d)}=${F(A, L)}${op}${F(C, L)}=${F(R, L)}${simpT(R, L)}`, `=${W ? W : ''}${F(rn, rd)}`] };
      }
      const [rn, rd] = red(R, L);
      return { text: `${op === '+' ? 'Add' : 'Subtract'}. Give the answer in lowest terms.`, q: `${F(a, b)}${op}${F(c, d)}`,
        a: [`\\text{LCD}=${L}`, `${F(A, L)}${op}${F(C, L)}=${F(R, L)}${simpT(R, L)}`].concat(rn > rd ? [`=${mixT(rn, rd)}`] : []) };
    }
  }
  // Mastery: multiply or divide, sometimes with a mixed number
  function mas(r) {
    for (;;) {
      const op = r.pick(['\\times', '\\div']), b = r.int(2, 9), d = r.int(2, 9), a = r.int(1, b - 1), c = r.int(1, d - 1);
      if (gcd(a, b) > 1 || gcd(c, d) > 1) continue;
      const mixQ = r.chance(0.35) && b <= 6 && d <= 6, w = mixQ ? r.int(1, 3) : 0, an = w * b + a;
      const key = `${a}/${b}${op === '\\times' ? '*' : '/'}${c}/${d}`; if (!mixQ && ASG.has(key)) continue;
      const [cn, cd] = op === '\\times' ? [c, d] : [d, c], N = an * cn, D = b * cd, [rn, rd] = red(N, D);
      if (rd === 1 && rn > 12) continue;
      const first = mixQ ? `${w}${F(a, b)}` : F(an, b), lines = [];
      if (mixQ) lines.push(`${w}${F(a, b)}=${F(an, b)}`);
      lines.push(`${mixQ || op === '\\div' ? '=' : ''}${F(an, b)}\\times${F(cn, cd)}`);
      lines.push(`=${F(N, D)}${simpT(N, D)}`);
      if (rn > rd && rd > 1) lines.push(`=${mixT(rn, rd)}`);
      return { text: mixQ ? 'Evaluate. (Mixed number: improper first.) Simplify your answer.' : 'Evaluate. Simplify your answer.', q: `${first}${op}${F(c, d)}`, a: lines };
    }
  }
  standup('u1l2', {
    intro: 'At your whiteboard station: equivalent fractions, common denominators, then multiply and divide.',
    levels: { BEG: beg, PRG: prg, MAS: mas }
  });
})();
/* ============ end Stand Up Break! ============ */

mountCups();
export const explainers = mountExplainers({ equiv, lowest, addfr, mixed, times, divide, improper, longdiv, place, fbedmas, decimals });
export const _test = { expand, decTeX, fop, cancelTex };
void sleep; void tween; void shake; void stampIn; void stamp; void liveCtx; void GRN; void RED;
