/* Math 15 · Unit 2 · Lesson 10 — Unit Review: Exponents.
 * A review lesson: each explainer is a quick "remember how…" refresher, with chips that replay the warm-up's sticky
 * notes and the booklet's own examples (so Ryan can check the class's work after they do it by hand).
 * Warm-up: the Sticky-Note Wall (tap a note: ✓ or ✗, the law, and the fix). Then the explainers:
 *   count    (every law is counting factors: tiles in a row, cancelled in pairs, or in groups — notes A, J, G, D;
 *             Example 1(a), Example 2(a)(b)),
 *   dist     (power of a product / quotient: arrows send the outside exponent to every factor — notes H, I; Example 3),
 *   steps1   (one law at a time, the law named — Examples 1(b), 2(c), 4(a)(b)),
 *   anatomy  (what is the 0 attached to? base, exponent, coefficient — note B; Example 5),
 *   flip     (a negative exponent crosses the fraction bar — note F; Example 6),
 *   steps2   (zero, negative and positive together — Example 7, Challenges 1 and 2),
 *   sci      (scientific notation: numbers with numbers, powers of 10 with powers of 10, then the point hops —
 *             Example 8, Challenge 3),
 *   radical  (power ↔ radical, root first, negative exponent last — Example 9).
 * Adapted from the Math 10C twin (u2l6) where it fits. Colours: base teal, exponent amber, coefficient purple, red for
 * a wrong claim; denominator / index teal and numerator / power amber as in Lesson 9. */
import { h, fmt } from '../explain.js';
import { tex } from '../tex.js';
import { mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const moveTo = (c, el, x, y, ms = 600, o = {}) => c.anim(el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms, o);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const COL = { b: '#13807a', e: '#c27a0e', k: '#8a58c9', r: '#c93a33' };
const cB = (s) => `\\color{${COL.b}}{${s}}`, cE = (s) => `\\color{${COL.e}}{${s}}`, cK = (s) => `\\color{${COL.k}}{${s}}`;
const AM = '#c27a0e', TL = '#13807a';
const flash = (c, el) => c.anim(el, [{ opacity: 0.15 }, { opacity: 1 }], 320);
const draw = (c, path, ms = 600, o = {}) => { const len = path.getTotalLength ? path.getTotalLength() || 400 : 400; path.style.strokeDasharray = len; return c.anim(path, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], ms, o); };
const num = (x) => String(Math.round(x * 1e9) / 1e9); // 16.200000000000003 → "16.2"
const par = (e) => (e < 0 ? `(${e})` : String(e));
/* KaTeX allowing \htmlClass (tokens that fly); keeps the source for the dump script */
const K = (src) => {
  try {
    const esc = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const clean = String(src).replace(/\\htmlClass\{[^}]*\}/g, '');
    return window.katex.renderToString(String(src), { throwOnError: false, strict: 'ignore', trust: true, output: 'html' })
      .replace('<span class="katex"', '<span data-tex="' + esc(clean) + '" class="katex"');
  } catch (e) { return tex(src); }
};
function stagePos(stage, el) { // element box in stage coordinates (the stage may be scaled)
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k, t: (r.top - sr.top) / k, b: (r.bottom - sr.top) / k, l: (r.left - sr.left) / k, r: (r.right - sr.left) / k };
}
async function fly(c, stage, from, to, src, o = {}) { // a copy of `src` flies from one token to another
  if (!to) return;
  if (c.fast || !from) { to.style.opacity = 1; return; }
  c.check();
  const a = stagePos(stage, from), b = stagePos(stage, to);
  const g = add(stage, h('div', 'u2l10-fly c', K(src)), a.x, a.y); if (o.fs) g.style.fontSize = o.fs + 'px';
  g.style.opacity = 0;
  try {
    await c.anim(g, [{ opacity: 1, transform: 'translate(0,0) scale(1.1)' }, { opacity: 1, transform: `translate(${(b.x - a.x) / 2}px, ${(b.y - a.y) / 2 - 26}px) scale(1.3)`, offset: 0.5 }, { opacity: 1, transform: `translate(${b.x - a.x}px, ${b.y - a.y}px) scale(1)` }], o.ms || 800, { delay: o.delay || 0 });
  } finally { g.remove(); }
  to.style.opacity = 1;
}
const stampIn = (c, el) => c.anim(el, [{ opacity: 0, transform: 'scale(1.8) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' });

/* ============ 1–2. Every law is counting factors ============ */
const CNT = {
  A: { kind: 'P', b: '2', m: 3, n: 4, tag: 'A', end: `Check note A: ${T('2^3\\times2^4=8\\times16=128')}, and ${T('2^7=128')} ✓. <b>Note A is right.</b>`, ok: true },
  J: { kind: 'P', b: '2', m: 3, n: 4, tag: 'J', end: `Note J says ${T('4^7')}. But every factor is still a <b>2</b>: the base doesn’t change. ${T('2^7=128')}, while ${T('4^7=16\\,384')}. <b>Note J is wrong.</b>`, ok: false, claim: '4^{7}' },
  e1a: { kind: 'P', b: '6', m: 2, n: 3, end: `<b>Example 1(a):</b> now evaluate. ${T('6^5=6\\times6\\times6\\times6\\times6=7\\,776')}.`, evalT: '6^{5}=7\\,776' },
  G: { kind: 'Q', b: '10', m: 6, n: 2, tag: 'G', end: `Note G: ${T('10^6\\div10^2=10^4')} ✓. <b>Subtract</b> the exponents; dividing them (${T('6\\div2=3')}) would be wrong.`, ok: true },
  e2a: { kind: 'Q', b: 'k', m: 11, n: 5 },
  D: { kind: 'PP', b: 'x', m: 2, n: 3, tag: 'D', end: `Note D says ${T('x^5')}: it <b>added</b> ${T('2+3')}. But we counted <b>6</b> factors: ${T('(x^2)^3=x^6')}. <b>Note D is wrong.</b>`, ok: false, claim: 'x^{5}' },
  e2b: { kind: 'PP', b: 't', m: 3, n: 4 }
};
const cntExpr = (d) => (d.kind === 'P' ? `${d.b}^{${d.m}}\\times ${d.b}^{${d.n}}` : d.kind === 'Q' ? `${d.b}^{${d.m}}\\div ${d.b}^{${d.n}}` : `\\left(${d.b}^{${d.m}}\\right)^{${d.n}}`);
const count = {
  title: 'Every law is just counting factors',
  height: 430,
  choices: [{ sep: 'Warm-up notes:' }, { v: 'A', label: 'A' }, { v: 'J', label: 'J' }, { v: 'G', label: 'G' }, { v: 'D', label: 'D' },
    { sep: 'Example 1 check:' }, { v: 'e1a', label: '(a)' }, { sep: 'Example 2 check:' }, { v: 'e2a', label: '(a)' }, { v: 'e2b', label: '(b)' }],
  intro: (v) => `${T(cntExpr(CNT[v]))}: write every factor out and <b>count</b> them.`,
  make(stage, v, ex) {
    const W = ex.W, d = CNT[v], tw = d.b.length > 1 ? 62 : 58, g = 10;
    const head = add(stage, h('div', 'u2l10-line', K(cntExpr(d))), 30, 14); head.style.fontSize = '40px';
    const tile = (x, y, cls = '') => { const e = add(stage, h('div', 'u2l10-tile c ' + cls, K(d.b)), x, y); e.style.width = e.style.height = tw + 'px'; hide(e); return e; };
    const lab = (x, y, html, w) => { const e = add(stage, h('div', 'u2l10-tlab c', html), x, y); if (w) e.style.width = w + 'px'; hide(e); return e; };
    const res = add(stage, h('div', 'u2l10-line', ''), 30, 300); res.style.fontSize = '34px'; hide(res);
    const endEl = add(stage, h('div', 'u2l10-cend'), 30, 362); endEl.style.width = (W - 60) + 'px'; hide(endEl);
    const stamp = add(stage, h('div', 'u2l10-stamp ' + (d.ok ? 'yes' : 'no'), d.ok ? `NOTE ${d.tag} ✓` : `NOTE ${d.tag} ✗`), W - 40, 290); stamp.style.translate = '-100% 0'; hide(stamp);
    const nums = [];
    const steps = [];
    if (d.kind === 'P') {
      const tot = d.m + d.n, gap = 60, wAll = tot * tw + (tot - 1) * g + gap, x0 = (W - wAll) / 2 + tw / 2, y = 168;
      const xs = Array.from({ length: tot }, (_, i) => x0 + i * (tw + g) + (i >= d.m ? gap : 0));
      const tl = xs.map((x, i) => tile(x, y, i < d.m ? 'a' : 'b'));
      const times = add(stage, h('div', 'u2l10-times c', '×'), (xs[d.m - 1] + xs[d.m]) / 2, y); hide(times);
      const l1 = lab((xs[0] + xs[d.m - 1]) / 2, y - 58, `${T(`${d.b}^{${d.m}}`)}: ${d.m} factors`), l2 = lab((xs[d.m] + xs[tot - 1]) / 2, y - 58, `${T(`${d.b}^{${d.n}}`)}: ${d.n} factors`);
      const x1 = (W - (tot * tw + (tot - 1) * g)) / 2 + tw / 2, xs2 = Array.from({ length: tot }, (_, i) => x1 + i * (tw + g));
      xs2.forEach((x, i) => nums.push(lab(x, y + 48, String(i + 1))));
      res.innerHTML = K(`${cntExpr(d)}=${d.b}^{${d.m}+${d.n}}=${d.b}^{${tot}}`);
      steps.push({ cap: `${T(`${d.b}^{${d.m}}`)} means <b>${d.m} factors</b> of ${d.b} multiplied together.`, run: (c) => Promise.all([...tl.slice(0, d.m).map((e, i) => c.pop(e, 320, { delay: i * 90 })), c.fadeIn(l1, 300)]) });
      steps.push({ cap: `${T(`${d.b}^{${d.n}}`)} is <b>${d.n} more</b> factors.`, run: (c) => Promise.all([c.fadeIn(times, 250), ...tl.slice(d.m).map((e, i) => c.pop(e, 320, { delay: i * 90 })), c.fadeIn(l2, 300)]) });
      steps.push({
        cap: `Multiplying just puts them all in <b>one row</b>. Count: ${T(`${d.m}+${d.n}=${tot}`)} factors. Same base: keep it, and <b>add</b> the exponents.`,
        run: async (c) => {
          await Promise.all([c.anim(times, [{ opacity: 1 }, { opacity: 0 }], 250), c.anim(l1, [{ opacity: 1 }, { opacity: 0 }], 250), c.anim(l2, [{ opacity: 1 }, { opacity: 0 }], 250), ...tl.map((e, i) => moveTo(c, e, xs2[i], y, 550))]);
          await Promise.all(nums.map((e, i) => c.fadeIn(e, 200, { delay: i * 70 })));
          await c.fadeIn(res, 380);
        }
      });
    } else if (d.kind === 'Q') {
      const x0 = (W - (d.m * tw + (d.m - 1) * g)) / 2 + tw / 2, yT = 120, yB = 220;
      const top = Array.from({ length: d.m }, (_, i) => tile(x0 + i * (tw + g), yT, 'a'));
      const bot = Array.from({ length: d.n }, (_, i) => tile(x0 + i * (tw + g), yB, 'b'));
      const bar = add(stage, h('div', 'u2l10-qbar'), x0 - tw / 2 - 6, (yT + yB) / 2 - 2); bar.style.width = (d.m * tw + (d.m - 1) * g + 12) + 'px'; hide(bar);
      const lT = lab(x0 - tw / 2 - 60, yT, `${d.m}`), lB = lab(x0 - tw / 2 - 60, yB, `${d.n}`);
      const slashes = bot.map((_, i) => { const s = add(stage, h('div', 'u2l10-slash'), x0 + i * (tw + g) - 6, yT - tw / 2 - 4); s.style.height = (yB - yT + tw + 8) + 'px'; hide(s); return s; });
      const left = lab(x0 + (d.n + (d.m - d.n - 1) / 2) * (tw + g), yT - 50, `${d.m - d.n} left`);
      res.innerHTML = K(`${cntExpr(d)}=${d.b}^{${d.m}-${d.n}}=${d.b}^{${d.m - d.n}}`);
      steps.push({ cap: `Write the division as a fraction: <b>${d.m}</b> factors of ${d.b} on top, <b>${d.n}</b> on the bottom.`, run: (c) => Promise.all([c.fadeIn(bar, 250), c.fadeIn(lT, 250), c.fadeIn(lB, 250), ...top.map((e, i) => c.pop(e, 300, { delay: i * 50 })), ...bot.map((e, i) => c.pop(e, 300, { delay: 200 + i * 50 }))]) });
      steps.push({
        cap: `Each ${d.b} on the bottom <b>cancels</b> one ${d.b} on top, because ${T(`\\tfrac{${d.b}}{${d.b}}=1`)}.`,
        run: async (c) => {
          for (let i = 0; i < d.n; i++) { await c.fadeIn(slashes[i], 160); await Promise.all([c.anim(top[i], [{ opacity: 1 }, { opacity: 0.25 }], 220), c.anim(bot[i], [{ opacity: 1 }, { opacity: 0.25 }], 220)]); }
          top.slice(0, d.n).concat(bot).forEach((e) => (e.style.opacity = 0.25));
        }
      });
      steps.push({ cap: `${T(`${d.m}-${d.n}=${d.m - d.n}`)} factors are left on top. Same base, divided: <b>subtract</b> the exponents.`, run: async (c) => { top.slice(d.n).forEach((e) => e.classList.add('lit')); await c.fadeIn(left, 300); await c.fadeIn(res, 380); } });
    } else {
      const tot = d.m * d.n, gg = 26, wAll = tot * tw + (tot - d.n) * g + (d.n - 1) * gg, x0 = (W - wAll) / 2 + tw / 2, y = 168;
      const xs = Array.from({ length: tot }, (_, i) => x0 + i * (tw + g) - Math.floor(i / d.m) * (g - gg));
      const tl = xs.map((x, i) => tile(x, y, Math.floor(i / d.m) % 2 ? 'b' : 'a'));
      const boxes = Array.from({ length: d.n }, (_, k) => {
        const xa = xs[k * d.m] - tw / 2 - 6, xb = xs[k * d.m + d.m - 1] + tw / 2 + 6;
        const b = add(stage, h('div', 'u2l10-grp', `<div class="u2l10-grp-l">${K(`${d.b}^{${d.m}}`)}</div>`), xa, y - tw / 2 - 8); b.style.width = (xb - xa) + 'px'; b.style.height = (tw + 16) + 'px'; hide(b); return b;
      });
      xs.forEach((x, i) => nums.push(lab(x, y + 50, String(i + 1))));
      res.innerHTML = K(`${cntExpr(d)}=${d.b}^{${d.m}\\times${d.n}}=${d.b}^{${tot}}`);
      steps.push({ cap: `${T(cntExpr(d))} means <b>${d.n} copies</b> of ${T(`${d.b}^{${d.m}}`)} multiplied together: ${d.n} groups of ${d.m} factors.`, run: (c) => Promise.all([...boxes.map((b, k) => c.fadeIn(b, 300, { delay: k * 200 })), ...tl.map((e, i) => c.pop(e, 300, { delay: Math.floor(i / d.m) * 200 + (i % d.m) * 70 }))]) });
      steps.push({ cap: `Count every ${d.b}: ${d.n} groups of ${d.m} is ${T(`${d.m}\\times${d.n}=${tot}`)} factors. A power of a power: <b>multiply</b> the exponents.`, run: async (c) => { await Promise.all(nums.map((e, i) => c.fadeIn(e, 200, { delay: i * 60 }))); await c.fadeIn(res, 380); } });
    }
    if (d.end) steps.push({
      cap: d.end,
      run: async (c) => {
        const rT = d.kind === 'P' ? `${d.b}^{${d.m + d.n}}` : d.kind === 'Q' ? `${d.b}^{${d.m - d.n}}` : `${d.b}^{${d.m * d.n}}`;
        endEl.innerHTML = d.evalT ? K(d.evalT) : d.claim ? `Note ${d.tag} said ${K(`${cntExpr(d)}=${d.claim}`)} <span class="u2l10-x">✗</span>` : `Note ${d.tag} said ${K(`${cntExpr(d)}=${rT}`)} <span class="u2l10-ok">✓</span>`;
        await c.fadeIn(endEl, 380);
        if (d.tag) await stampIn(c, stamp);
      }
    });
    return steps;
  }
};

/* ============ 3. Power of a product / quotient: send the exponent to every factor ============ */
const DIST = {
  H: { f: ['2', 'x'], k: 3, nums: '2^{3}=8', res: '8x^{3}', tag: 'H', claim: '2x^{3}', ok: false },
  I: { q: ['3', '4'], k: 2, nums: '3^{2}=9,\\ 4^{2}=16', res: '\\dfrac{9}{16}', tag: 'I', ok: true },
  e3a: { f: ['4', 'h'], k: 2, nums: '4^{2}=16', res: '16h^{2}', tag3: 'Example 3(a)' },
  e3b: { q: ['r', '5'], k: 3, nums: '5^{3}=125', res: '\\dfrac{r^{3}}{125}', tag3: 'Example 3(b)' }
};
const distExpr = (d, cls) => {
  const C = (k, s) => (cls ? `\\htmlClass{u2l10-${k}}{${s}}` : s);
  return d.f ? `\\left(${C('f0', d.f[0])}${C('f1', d.f[1])}\\right)^{${C('k', d.k)}}` : `\\left(\\dfrac{${C('f0', d.q[0])}}{${C('f1', d.q[1])}}\\right)^{${C('k', d.k)}}`;
};
const dist = {
  title: 'Every factor gets the power',
  height: 420,
  choices: [{ sep: 'Warm-up notes:' }, { v: 'H', label: 'H' }, { v: 'I', label: 'I' }, { sep: 'Example 3 check:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' }],
  intro: (v) => `${T(distExpr(DIST[v]))}: the outside exponent belongs to the <b>whole bracket</b>.`,
  make(stage, v, ex) {
    const W = ex.W, d = DIST[v], prod = !!d.f, k = d.k, a = prod ? d.f : d.q;
    const svg = add(stage, svgEl('svg', { class: 'u2l10-dsvg', width: W, height: 420 }), 0, 0);
    const yM = prod ? 150 : 178;
    const big = add(stage, h('div', 'u2l10-dbig', K(distExpr(d, true))), 50, yM); big.style.translate = '0 -50%';
    const L2src = prod ? `=${a[0]}^{\\htmlClass{u2l10-p0}{${k}}}${a[1]}^{\\htmlClass{u2l10-p1}{${k}}}` : `=\\dfrac{${a[0]}^{\\htmlClass{u2l10-p0}{${k}}}}{${a[1]}^{\\htmlClass{u2l10-p1}{${k}}}}`;
    const bw = big.offsetWidth || 200;
    const L2 = add(stage, h('div', 'u2l10-dline', K(L2src)), 50 + bw + 50, yM); L2.style.translate = '0 -50%'; hide(L2);
    const L3 = add(stage, h('div', 'u2l10-dline', K('=' + d.res)), 50 + bw + 50 + (L2.offsetWidth || 200) + 40, yM); L3.style.translate = '0 -50%'; hide(L3);
    const note = add(stage, h('div', 'u2l10-dnote'), 60, 310); note.style.width = (W - 120) + 'px'; hide(note);
    const stamp = d.tag ? add(stage, h('div', 'u2l10-stamp ' + (d.ok ? 'yes' : 'no'), `NOTE ${d.tag} ${d.ok ? '✓' : '✗'}`), W - 40, 318) : null; if (stamp) { stamp.style.translate = '-100% 0'; hide(stamp); }
    const arrows = [];
    const tok = (cls) => big.querySelector('.u2l10-' + cls);
    const mkArrows = () => {
      if (arrows.length) return arrows;
      const K0 = stagePos(stage, tok('k'));
      ['f0', 'f1'].forEach((f, i) => {
        const F = stagePos(stage, tok(f));
        let x1, y1, x2, y2, cx, cy;
        if (prod || i === 0) { x1 = K0.x; y1 = K0.t - 2; x2 = F.x; y2 = F.t - 8; cx = (x1 + x2) / 2; cy = Math.min(K0.t, F.t) - 70 - 26 * (prod ? 1 - i : 0); }
        else { x1 = K0.x + 4; y1 = K0.b + 2; x2 = F.r + 10; y2 = F.y; cx = K0.x + 50; cy = F.y + 10; }
        const p = svg.appendChild(svgEl('path', { d: `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, class: 'u2l10-darr' }));
        const hd = svg.appendChild(svgEl('circle', { cx: x2, cy: y2, r: 6, class: 'u2l10-dhead' }));
        hide(p, hd); arrows.push([p, hd]);
      });
      return arrows;
    };
    const steps = [{
      cap: `The outside exponent <b>${k}</b> belongs to the <b>whole bracket</b>: ${prod ? `everything inside is multiplied together` : `the top and the bottom of the fraction`}.`,
      run: async (c) => { tok('f0').classList.add('u2l10-lit'); tok('f1').classList.add('u2l10-lit'); tok('k').classList.add('u2l10-litk'); await flash(c, big); }
    }, {
      cap: prod ? `<b>Power of a product:</b> send the ${k} to <b>every</b> factor, the number ${a[0]} included.` : `<b>Power of a quotient:</b> send the ${k} to the <b>numerator and the denominator</b>.`,
      run: async (c) => { const ar = mkArrows(); for (const [p, hd] of ar) { p.style.opacity = 1; await draw(c, p, 500); await c.pop(hd, 200); } }
    }, {
      cap: `Each factor gets its own exponent ${k}: ${T(L2src.slice(1).replace(/\\htmlClass\{[^}]*\}/g, ''))}.`,
      run: (c) => Promise.all([c.fadeIn(L2, 380), fly(c, stage, tok('k'), L2.querySelector('.u2l10-p0'), String(k), { fs: 26 }), fly(c, stage, tok('k'), L2.querySelector('.u2l10-p1'), String(k), { fs: 26, delay: 200 })])
    }, {
      cap: `Work out the numbers: ${T(d.nums)}. ${d.tag3 ? `<b>${d.tag3}:</b> ` : ''}${T(distExpr(d) + '=' + d.res)}.`,
      run: (c) => c.pop(L3, 420)
    }];
    if (d.tag) steps.push({
      cap: d.ok ? `Note ${d.tag} says ${T(d.res)} ✓: top and bottom both squared. <b>Note ${d.tag} is right.</b>` : `Note ${d.tag} says ${T(d.claim)}: it gave the power to the ${a[1]} but <b>forgot the ${a[0]}</b>. ${T(`(2x)^3=2x\\cdot2x\\cdot2x=8x^3`)}. <b>Note ${d.tag} is wrong.</b>`,
      run: async (c) => { note.innerHTML = d.ok ? `Note ${d.tag}: ${K(distExpr(d) + '=' + d.res)} <span class="u2l10-ok">✓</span>` : `Note ${d.tag}: ${K(distExpr(d) + '=' + d.claim)} <span class="u2l10-x">✗</span> &nbsp; the ${a[0]} needs the power too`; await c.fadeIn(note, 380); await stampIn(c, stamp); }
    });
    return steps;
  }
};

/* ============ 4 + 7. One law at a time (the stepper) ============ */
const LAW = {
  P: ['Product law', 'a^m\\times a^n=a^{m+n}'],
  Q: ['Quotient law', 'a^m\\div a^n=a^{m-n}'],
  PP: ['Power of a power', '(a^m)^n=a^{m\\times n}'],
  PR: ['Power of a product', '(ab)^n=a^nb^n'],
  N: ['Negative exponent', 'a^{-n}=\\tfrac{1}{a^n}'],
  SN: ['Scientific notation', 'a\\times10^{n},\\ 1\\le a<10']
};
const CASES = {
  e1b: { q: '5t^{4}\\times3t^{2}', s: [
    { cap: `Numbers with numbers, ${T('t')}’s with ${T('t')}’s. Multiply the coefficients; <b>add</b> the exponents.`, law: 'P', line: '=(5\\times3)\\,t^{4+2}' },
    { cap: `${T('5\\times3=15')} and ${T('4+2=6')}. <b>Example 1(b):</b> ${T('15t^6')}.`, fw: ['5\\times3=15', '4+2=6'], line: '=\\boldsymbol{15t^{6}}', final: true }] },
  e2c: { q: '\\dfrac{(g^{2})^{5}}{g^{4}}', s: [
    { cap: `Brackets first: a power of a power, so <b>multiply</b> the exponents. ${T('2\\times5=10')}.`, law: 'PP', fw: ['2\\times5=10'], line: '=\\dfrac{g^{10}}{g^{4}}' },
    { cap: `Same base, divided: <b>subtract</b> the exponents. ${T('10-4=6')}.`, law: 'Q', fw: ['10-4=6'], line: '=g^{10-4}' },
    { cap: `<b>Example 2(c):</b> ${T('g^6')}.`, line: '=\\boldsymbol{g^{6}}', final: true }] },
  e4a: { q: '(2t^{3})^{2}\\times5t^{4}', s: [
    { cap: `Brackets first. <b>Power of a product</b>: the 2 hits the coefficient <b>and</b> the ${T('t^3')}.`, law: 'PR', fw: ['2^{2}=4', '3\\times2=6'], line: '=4t^{6}\\times5t^{4}' },
    { cap: `Now matching bases: multiply the numbers, <b>add</b> the exponents.`, law: 'P', fw: ['4\\times5=20', '6+4=10'], line: '=(4\\times5)\\,t^{6+4}' },
    { cap: `<b>Example 4(a):</b> ${T('20t^{10}')}.`, line: '=\\boldsymbol{20t^{10}}', final: true }] },
  e4b: { q: '\\dfrac{(2w^{3})^{2}}{4w^{2}}', s: [
    { cap: `Brackets first: ${T('(2w^3)^2=2^2w^{3\\times2}=4w^6')}.`, law: 'PR', fw: ['2^{2}=4', '3\\times2=6'], line: '=\\dfrac{4w^{6}}{4w^{2}}' },
    { cap: `Numbers: ${T('4\\div4=1')}. Same base, divided: <b>subtract</b> the exponents.`, law: 'Q', fw: ['4\\div4=1', '6-2=4'], line: '=1\\times w^{6-2}' },
    { cap: `A coefficient of 1 isn’t written. <b>Example 4(b):</b> ${T('w^4')}.`, line: '=\\boldsymbol{w^{4}}', final: true }] },
  e7a: { q: '\\dfrac{15w^{-2}}{3w^{4}}', s: [
    { cap: `Divide the numbers and <b>subtract</b> the exponents (top minus bottom).`, law: 'Q', fw: ['15\\div3=5', '-2-4=-6'], line: '=\\dfrac{15}{3}\\,w^{-2-4}' },
    { cap: `${T('15\\div3=5')} and ${T('-2-4=-6')}. Not finished: there’s a negative exponent.`, line: '=5w^{-6}' },
    { cap: `<b>Negative exponent:</b> ${T('w^{-6}')} moves under the bar as ${T('w^6')}. The 5 stays on top. <b>Example 7(a):</b> ${T('\\tfrac{5}{w^6}')}.`, law: 'N', line: '=\\boldsymbol{\\dfrac{5}{w^{6}}}', final: true }] },
  e7b: { q: '(2t^{-3})^{2}\\times t^{5}', s: [
    { cap: `Brackets first: ${T('2^2=4')} and ${T('-3\\times2=-6')}.`, law: 'PR', fw: ['2^{2}=4', '-3\\times2=-6'], line: '=4t^{-6}\\times t^{5}' },
    { cap: `Same base, multiplied: <b>add</b> the exponents. ${T('-6+5=-1')}.`, law: 'P', fw: ['-6+5=-1'], line: '=4t^{-1}' },
    { cap: `${T('t^{-1}=\\tfrac1t')}, and the 4 stays on top. <b>Example 7(b):</b> ${T('\\tfrac4t')}.`, law: 'N', line: '=\\boldsymbol{\\dfrac{4}{t}}', final: true }] },
  ch1: { q: '\\dfrac{(2t^{3})^{-2}\\times8t^{5}}{4t^{-3}}', s: [
    { cap: `Brackets first: the ${T('-2')} hits the 2 <b>and</b> the ${T('t^3')}. ${T('2^{-2}=\\tfrac14')} and ${T('3\\times(-2)=-6')}.`, law: 'PR', fw: ['2^{-2}=\\tfrac{1}{4},\\quad 3\\times(-2)=-6'], line: '=\\dfrac{\\tfrac14t^{-6}\\times8t^{5}}{4t^{-3}}' },
    { cap: `The top: ${T('\\tfrac14\\times8=2')} and ${T('-6+5=-1')}.`, law: 'P', fw: ['\\tfrac14\\times8=2,\\quad -6+5=-1'], line: '=\\dfrac{2t^{-1}}{4t^{-3}}' },
    { cap: `Divide: ${T('2\\div4=\\tfrac12')}, and ${T('-1-(-3)=2')}. Subtracting a negative <b>adds</b>.`, law: 'Q', fw: ['2\\div4=\\tfrac12,\\quad -1-(-3)=2'], line: '=\\tfrac12\\,t^{2}' },
    { cap: `<b>Challenge 1:</b> positive exponent ✓. ${T('\\tfrac12t^2=\\tfrac{t^2}{2}')}.`, line: '=\\boldsymbol{\\dfrac{t^{2}}{2}}', final: true }] },
  ch2: { q: 's^{5/6}\\times s^{1/6}', s: [
    { cap: `Same base, multiplied: <b>add</b> the exponents. The denominators already match.`, law: 'P', fw: ['\\tfrac56+\\tfrac16=\\tfrac66=1'], line: '=s^{\\frac56+\\frac16}' },
    { cap: `${T('\\tfrac66=1')}, and ${T('s^1')} is just ${T('s')}.`, line: '=s^{1}=s' },
    { cap: `<b>Challenge 2:</b> so the value is just ${T('s=4\\,000\\,000')}. Hop the point 6 places: ${T('4\\times10^6')}.`, law: 'SN', fw: ['4\\,000\\,000=4\\times10^{6}'], line: '=\\boldsymbol{4\\times10^{6}}', final: true }] }
};
function stepperDef(title, keys, labels) {
  return {
    title,
    height: 450,
    choices: labels,
    intro: (v) => `Simplify ${T(CASES[v].q)}. Which law comes first? Name it, then do the numbers.`,
    make(stage, v, ex) {
      const W = ex.W, H = 450, C = CASES[v], lh = 80, fs = 30, x0 = 26, rx = Math.round(W * 0.56), rw = W - rx - 20;
      const line = (src, y, o = {}) => { const el = add(stage, h('div', 'u2l10-line', K(src)), x0, y); el.style.fontSize = (o.fs || fs) + 'px'; el.style.height = lh + 'px'; return el; };
      line(C.q, 12, { fs: 34 });
      let y = 12 + lh + (C.q.includes('dfrac') ? 6 : 0);
      const lawBox = add(stage, h('div', 'u2l10-st-law'), rx, 12); lawBox.style.width = rw + 'px';
      lawBox.innerHTML = '<div class="u2l10-st-law-h">Law</div><div class="u2l10-st-law-b muted">Which law?</div>';
      const fwBox = add(stage, h('div', 'u2l10-st-fw', '<div class="u2l10-st-fw-h">Numbers and exponents</div>'), rx, 130); fwBox.style.width = rw + 'px'; fwBox.style.height = (H - 146) + 'px';
      const fwList = h('div', 'u2l10-st-fw-l'); fwBox.appendChild(fwList);
      const shownFw = [];
      return C.s.map((st) => {
        let el = null, fws = [];
        if (st.line) { el = line(st.line, y); hide(el); y += lh; }
        if (st.fw) fws = st.fw.map((s) => { const r = h('div', 'u2l10-st-fw-r', K(s)); fwList.appendChild(r); hide(r); return r; });
        return {
          cap: st.cap,
          run: async (c) => {
            if (st.law) {
              const [nm, f] = LAW[st.law];
              lawBox.innerHTML = `<div class="u2l10-st-law-h">Law</div><div class="u2l10-st-law-b"><b>${nm}</b>${K(f)}</div>`;
              await c.pop(lawBox.lastChild, 420);
            }
            if (fws.length) {
              shownFw.forEach((r) => r.classList.add('old'));
              for (const r of fws) { await c.fadeIn(r, 360, { from: 'translateY(8px)' }); shownFw.push(r); await c.sleep(200); }
            }
            if (el) {
              if (st.final) { await c.pop(el, 480); el.classList.add('u2l10-st-final'); }
              else await c.fadeIn(el, 420, { from: 'translateX(-10px)' });
            }
          }
        };
      });
    }
  };
}
const steps1 = stepperDef('One law at a time: brackets, then matching bases', [], [{ sep: 'Example 1 check:' }, { v: 'e1b', label: '(b)' }, { sep: 'Example 2 check:' }, { v: 'e2c', label: '(c)' }, { sep: 'Example 4 check:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }]);
const steps2 = stepperDef('Zero, negative and positive exponents together', [], [{ sep: 'Example 7 check:' }, { v: 'e7a', label: '(a)' }, { v: 'e7b', label: '(b)' }, { sep: 'Challenges:' }, { v: 'ch1', label: 'Challenge 1' }, { v: 'ch2', label: 'Challenge 2' }]);

/* ============ 5. What is the 0 attached to? (from the 10C anatomy explainer) ============ */
const ANAT = {
  B: { start: '5^{0}', steps: [
    { cap: `The base is ${T('5')} and the exponent is <b>0</b>.`, main: cB('5') + '^{' + cE('0') + '}', chip: ['b', 'base', '5'] },
    { cap: `Follow the pattern: ${T('5^2=25')}, ${T('5^1=5')}, each step ÷ 5. One more step: ${T('5\\div5=1')}.`, chip: ['e', 'exponent', '0'], line: '5^{2}=25,\\quad5^{1}=5,\\quad5^{0}=5\\div5=1' },
    { cap: `So ${T('5^0=1')}, not 0. <b>Note B is wrong.</b>`, line: '5^{0}=\\mathbf{1}\\quad(\\text{not }0)' }] },
  n8k: { start: '8k^{0}', steps: [
    { cap: `No brackets: the exponent 0 touches <b>only</b> ${T('k')}. The base is ${T('k')}.`, main: '8' + cB('k') + '^{0}', chip: ['b', 'base', 'k'] },
    { cap: `Exponent <b>0</b>: ${T('k^0=1')} (for ${T('k\\neq0')}).`, main: '8' + cB('k') + '^{' + cE('0') + '}', chip: ['e', 'exponent', '0'] },
    { cap: `The 8 is the <b>coefficient</b>: it isn’t raised to anything. <b>Example 5(a):</b> ${T('8k^0=8\\times1=8')}.`, main: cK('8') + cB('k') + '^{' + cE('0') + '}', chip: ['k', 'coefficient', '8'], line: '8k^{0}=8\\times1=\\mathbf{8}' }] },
  p8k: { start: '(8k)^{0}', steps: [
    { cap: `The brackets fence in ${T('8k')}: the <b>whole</b> ${T('8k')} is the base.`, main: cB('(8k)') + '^{0}', chip: ['b', 'base', '8k'] },
    { cap: `Exponent 0 again.`, main: cB('(8k)') + '^{' + cE('0') + '}', chip: ['e', 'exponent', '0'] },
    { cap: `Anything nonzero to the exponent 0 is 1. <b>Example 5(a):</b> ${T('(8k)^0=1')}. The brackets changed the answer!`, line: '(8k)^{0}=\\mathbf{1}' }] },
  n9: { start: '-9^{0}', steps: [
    { cap: `<b>No brackets!</b> The exponent only reaches the 9, so the base is ${T('9')}. The minus sign is <b>outside</b> the power.`, main: '-' + cB('9') + '^{0}', chip: ['b', 'base', '9'] },
    { cap: `Exponent 0: ${T('9^0=1')}.`, main: '-' + cB('9') + '^{' + cE('0') + '}', chip: ['e', 'exponent', '0'] },
    { cap: `Power first, <b>then</b> the minus sign. <b>Example 5(b):</b> ${T('-9^0=-1')}.`, line: '-9^{0}=-(9^{0})=-(1)=\\mathbf{-1}' }] },
  p9: { start: '(-9)^{0}', steps: [
    { cap: `Now the brackets fence in ${T('-9')}: the whole ${T('-9')} is the base.`, main: cB('(-9)') + '^{0}', chip: ['b', 'base', '-9'] },
    { cap: `Exponent 0 again.`, main: cB('(-9)') + '^{' + cE('0') + '}', chip: ['e', 'exponent', '0'] },
    { cap: `<b>Example 5(b):</b> ${T('(-9)^0=1')}. Compare ${T('-9^0=-1')}: same digits, different base.`, line: '(-9)^{0}=\\mathbf{1}' }] }
};
const anatomy = {
  title: 'What is the 0 attached to?',
  height: 330,
  choices: [{ sep: 'Warm-up note:' }, { v: 'B', label: 'B' }, { sep: 'Example 5 check:' }, { v: 'n8k', label: T('8k^0') }, { v: 'p8k', label: T('(8k)^0') }, { v: 'n9', label: T('-9^0') }, { v: 'p9', label: T('(-9)^0') }],
  intro: () => `Find the <b>base</b> first: it’s whatever the exponent is touching. Brackets act like a <b>fence</b>.`,
  make(stage, v, ex) {
    const W = ex.W, d = ANAT[v];
    const main = add(stage, h('div', 'u2l10-an-main c', T(d.start)), W / 2, 74);
    const chips = add(stage, h('div', 'u2l10-an-chips c'), W / 2, 168);
    const line = add(stage, h('div', 'u2l10-an-line c'), W / 2, 262);
    return d.steps.map((s) => ({
      cap: s.cap,
      run: async (c) => {
        const jobs = [];
        if (s.main) { main.innerHTML = T(s.main); jobs.push(flash(c, main)); }
        if (s.chip) { const [k, lab, t] = s.chip, e = h('span', 'u2l10-an-chip ' + k, `<small>${lab}</small>${T(t)}`); chips.appendChild(e); jobs.push(c.pop(e, 380)); }
        if (s.line) { line.innerHTML = T(s.line); jobs.push(c.fadeIn(line, 450, { delay: s.main ? 250 : 0 })); }
        await Promise.all(jobs);
      }
    }));
  }
};

/* ============ 6. Negative exponents cross the fraction bar (from the 10C flip explainer) ============ */
const FLIP = {
  F: { start: '2^{-3}', num: [['2^{-3}', '2^{3}']], den: [], fin: '2^{-3}=\\dfrac{1}{2^{3}}=\\dfrac{1}{8}', end: `${T('\\tfrac18')}: a small <b>positive</b> number. Note F said ${T('-8')}: <b>wrong</b>. A negative exponent means <b>reciprocal</b>, never a negative value.` },
  e6a: { start: '4^{-2}', num: [['4^{-2}', '4^{2}']], den: [], fin: '4^{-2}=\\dfrac{1}{4^{2}}=\\dfrac{1}{16}', end: `<b>Example 6(a):</b> ${T('4^{-2}=\\dfrac{1}{4^{2}}=\\dfrac{1}{16}')}.` },
  e6b: { start: '9t^{-3}', num: [['9'], ['t^{-3}', 't^{3}']], den: [], fin: '9t^{-3}=\\dfrac{9}{t^{3}}', end: `<b>Example 6(b):</b> ${T('9t^{-3}=\\dfrac{9}{t^{3}}')}. The exponent ${T('-3')} belongs to ${T('t')} only, so the 9 stays on top.`, trap: '\\dfrac{1}{9t^{3}}' },
  e6c: { start: '\\dfrac{1}{5^{-2}}', num: [], den: [['5^{-2}', '5^{2}']], fin: '\\dfrac{1}{5^{-2}}=5^{2}=25', end: `<b>Example 6(c):</b> it works from the bottom up, too. ${T('5^{-2}')} below the bar moves <b>up</b> as ${T('5^2=25')}.` }
};
const flip = {
  title: 'A negative exponent crosses the fraction bar',
  height: 400,
  choices: [{ sep: 'Warm-up note:' }, { v: 'F', label: 'F' }, { sep: 'Example 6 check:' }, { v: 'e6a', label: '(a)' }, { v: 'e6b', label: '(b)' }, { v: 'e6c', label: '(c)' }],
  intro: (v) => `Rewrite ${T(FLIP[v].start)} with positive exponents. A negative exponent means “<b>reciprocal</b>”: that factor moves to the <b>other side</b> of the fraction bar and its exponent turns positive.`,
  make(stage, v, ex) {
    const W = ex.W, d = FLIP[v], cx = W * 0.36, yN = 104, yD = 222, yB = 163;
    const mk = (t) => { const e = add(stage, h('div', 'u2l10-fl-t c', T(t[0])), cx, yN); e._t = t; e._mv = t.length > 1; return e; };
    const top = d.num.map(mk), bot = d.den.map(mk);
    const bar = add(stage, h('div', 'u2l10-fl-bar'), cx, yB); bar.style.opacity = 0;
    const one = { N: add(stage, h('div', 'u2l10-fl-t one c', '1'), cx, yN), D: add(stage, h('div', 'u2l10-fl-t one c', '1'), cx, yD) };
    hide(one.N, one.D);
    const fin = add(stage, h('div', 'u2l10-fl-fin c'), W / 2, 340); fin.style.opacity = 0;
    const side = add(stage, h('div', 'u2l10-fl-side'), W * 0.6, 92); side.style.width = (W * 0.37) + 'px'; side.style.opacity = 0;
    const rowX = (els) => { const ws = els.map((e) => e.offsetWidth || 50), g = 6, tot = ws.reduce((a, b) => a + b, 0) + g * (els.length - 1); let x = cx - tot / 2; return ws.map((w) => { const m = x + w / 2; x += w + g; return m; }); };
    const place = (els, y) => { const xs = rowX(els); els.forEach((e, i) => at(e, xs[i], y)); };
    const barW = (a, b) => Math.max(90, ...[a, b].map((els) => els.reduce((s, e) => s + (e.offsetWidth || 50) + 6, 0))) + 40;
    const isFrac = d.den.length > 0;
    if (!isFrac) { const xs = rowX(top); top.forEach((e, i) => at(e, xs[i], yB)); }
    else { if (!top.length) one.N.style.opacity = 1; place(top, yN); place(bot, yD); bar.style.opacity = 1; bar.style.width = barW(top.length ? top : [one.N], bot) + 'px'; }
    let T0 = top.slice(), B0 = bot.slice();
    const steps = [];
    if (!isFrac) steps.push({
      cap: `Anything can be written over <b>1</b>, so make it a fraction: now there’s a top and a bottom.`,
      run: async (c) => {
        const xs = rowX(T0); bar.style.width = barW(T0, [one.D]) + 'px';
        await Promise.all([...T0.map((e, i) => moveTo(c, e, xs[i], yN, 450)), c.fadeIn(bar, 350), c.fadeIn(one.D, 350, { delay: 200 })]);
      }
    });
    const movers = [...top, ...bot].filter((e) => e._mv), stayers = [...top, ...bot].filter((e) => !e._mv);
    steps.push({
      cap: `Spot the <b>negative exponent</b>: ${movers.map((e) => T(e._t[0])).join(' and ')}. ${stayers.length ? `The ${stayers.map((e) => T(e._t[0])).join(', ')} has no negative exponent, so it stays put.` : ''}`,
      run: (c) => Promise.all([...movers.map((e) => { e.classList.add('neg'); return c.anim(e, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], 420); }), ...stayers.map((e) => { e.classList.add('stay'); return c.anim(e, [{ transform: 'scale(1)' }, { transform: 'scale(.92)' }, { transform: 'scale(1)' }], 420); })])
    });
    steps.push({
      cap: `<b>Cross the bar</b>: it moves to the other side and its exponent becomes <b>positive</b>.`,
      run: async (c) => {
        const nt = T0.filter((e) => !e._mv), nb = B0.filter((e) => !e._mv);
        T0.filter((e) => e._mv).forEach((e) => nb.push(e)); B0.filter((e) => e._mv).forEach((e) => nt.push(e));
        const rowT = nt.length ? nt : [one.N], rowB = nb.length ? nb : [one.D];
        const xt = rowX(rowT), xb = rowX(rowB), jobs = [];
        rowT.forEach((e, i) => jobs.push(moveTo(c, e, xt[i], nb.length ? yN : yB, 700)));
        if (nb.length) rowB.forEach((e, i) => jobs.push(moveTo(c, e, xb[i], yD, 700)));
        if (!nt.length) jobs.push(c.fadeIn(one.N, 400, { delay: 300 }));
        else if (Number(one.N.style.opacity) > 0) jobs.push(c.anim(one.N, [{ opacity: 1 }, { opacity: 0 }], 300));
        if (nb.length && one.D.style.opacity !== '0') jobs.push(c.anim(one.D, [{ opacity: 1 }, { opacity: 0 }], 300));
        if (nb.length) jobs.push(c.anim(bar, [{ width: bar.style.width }, { width: barW(rowT, rowB) + 'px' }], 600));
        else jobs.push(c.anim(bar, [{ opacity: 1 }, { opacity: 0 }], 400));
        await Promise.all(jobs);
        movers.forEach((e) => { e.innerHTML = T(e._t[1]); e.classList.remove('neg'); e.classList.add('pos'); });
        const xt2 = rowX(rowT), xb2 = rowX(rowB);
        await Promise.all([...movers.map((e) => c.pop(e, 380)), ...rowT.map((e, i) => moveTo(c, e, xt2[i], nb.length ? yN : yB, 250)), ...(nb.length ? rowB.map((e, i) => moveTo(c, e, xb2[i], yD, 250)) : [])]);
        T0 = nt; B0 = nb;
      }
    });
    steps.push({ cap: d.end, run: async (c) => { fin.innerHTML = T(d.fin); await c.fadeIn(fin, 450); } });
    if (d.trap) steps.push({
      cap: `<b>Watch out:</b> ${T(d.start)} is <b>not</b> ${T(d.trap)}. Only the base ${T('t')} has the negative exponent; the coefficient 9 never moves.`,
      run: async (c) => { side.innerHTML = `<div class="u2l10-fl-wrong">${T(d.start + '\\neq' + d.trap)}</div><div class="muted">That would be ${T('9^{-1}t^{-3}')}.</div>`; await c.fadeIn(side, 400); }
    });
    return steps;
  }
};

/* ============ 8. Scientific notation (from the 10C sci explainer) ============ */
const SCI = {
  a: { op: 'mul', A: ['2', 3], B: ['4', 5] },
  e8a: { op: 'mul', A: ['6.2', 3], B: ['4.0', -7], tag: 'Example 8(a)' },
  e8b: { op: 'div', A: ['5', -1], plain: '0.5', B: ['2.5', -5], tag: 'Example 8(b)', std: '20\\,000', unit: 'About <b>20 000 grains</b> of pollen.' },
  c3a: { op: 'pow', A: ['3', 2], k: 2, tag: 'Challenge 3(a)', unit: 'square centimetres.' },
  c3b: { op: 'div', A: ['9', 4], B: ['9', 2], tag: 'Challenge 3(b)', std: '100', unit: '<b>100 tiles</b> cover the bed.' }
};
const sciT = (a, n) => `${a}\\times10^{${n}}`;
const sciLine = (d) => (d.op === 'div' ? `${d.plain || sciT(...d.A)}\\div(${sciT(...d.B)})` : sciExpr(d));
const sciExpr = (d) => (d.op === 'mul' ? `(${sciT(...d.A)})\\times(${sciT(...d.B)})` : d.op === 'pow' ? `(${sciT(...d.A)})^{${d.k}}` : `\\dfrac{${d.plain || sciT(...d.A)}}{${sciT(...d.B)}}`);
const sci = {
  title: 'Scientific notation: numbers, then powers of 10, then fix it',
  height: 450,
  choices: [{ sep: 'Try:' }, { v: 'a', label: T('(2\\times10^3)(4\\times10^5)') }, { sep: 'Example 8 check:' }, { v: 'e8a', label: '(a)' }, { v: 'e8b', label: '(b)' }, { sep: 'Challenge 3:' }, { v: 'c3a', label: '(a)' }, { v: 'c3b', label: '(b)' }],
  intro: (v) => `${T(sciExpr(SCI[v]))}: group the <b>leading numbers</b> together and the <b>powers of 10</b> together. Then check the leading number is between 1 and 10.`,
  make(stage, v, ex) {
    const W = ex.W, d = SCI[v], op = d.op;
    add(stage, h('div', 'u2l10-sn-main c', T(sciExpr(d))), W / 2, 50);
    const cx = [W * 0.28, W * 0.72], heads = ['leading numbers', 'powers of 10'];
    const cols = heads.map((t, i) => { const e = add(stage, h('div', 'u2l10-sn-col', `<div class="u2l10-cl-h">${t}</div>`), cx[i] - W * 0.2, 104); e.style.width = W * 0.4 + 'px'; e.style.opacity = 0; return e; });
    const L = [0, 1].map((i) => [0, 1].map((j) => { const e = add(stage, h('div', 'u2l10-cl-l c'), cx[i], 168 + j * 64); e.style.opacity = 0; return e; }));
    const a = Number(d.A[0]), b = d.B ? Number(d.B[0]) : 0;
    const coefV = op === 'mul' ? a * b : op === 'div' ? a / b : Math.pow(a, d.k);
    const eV = op === 'mul' ? d.A[1] + d.B[1] : op === 'div' ? d.A[1] - d.B[1] : d.A[1] * d.k;
    const cs = num(coefV);
    // the "decimal hop" line: digits in fixed slots, a movable point, then × 10^e
    const bigEl = add(stage, h('div', 'u2l10-sn-big'), 0, 300);
    const digits = cs.replace('.', ''), p0 = cs.includes('.') ? cs.indexOf('.') : cs.length;
    const dw = 30, pw = 16, nd = digits.length, boxW = nd * dw + pw;
    const dBox = h('div', 'u2l10-sn-digits'); dBox.style.width = boxW + 'px'; bigEl.appendChild(dBox);
    const dX = (i, p) => (i * dw + (i >= p ? pw : 0)) + 'px';
    const dEls = digits.split('').map((ch, i) => { const e = h('span', 'u2l10-sn-d', ch); e.style.left = dX(i, p0); dBox.appendChild(e); return e; });
    const pt = h('span', 'u2l10-sn-pt', '.'); dBox.appendChild(pt);
    const ptX = (k) => (k * dw) + 'px'; pt.style.left = ptX(p0); if (p0 >= nd) pt.style.opacity = 0;
    const tail = h('span', 'u2l10-sn-tail', `${T('\\times10')}<sup class="u2l10-sn-e">${eV}</sup>`); bigEl.appendChild(tail);
    const bigW = boxW + 110; at(bigEl, W / 2 - bigW / 2, 318); bigEl.style.opacity = 0;
    const eEl = tail.querySelector('.u2l10-sn-e');
    const verdict = add(stage, h('div', 'u2l10-sn-check'), W / 2 + bigW / 2 + 26, 350); verdict.style.translate = '0 -50%'; verdict.style.opacity = 0;
    const fin = add(stage, h('div', 'u2l10-sn-fin c'), W / 2, 418); fin.style.opacity = 0;
    const lead = Math.floor(Math.log10(Math.abs(coefV)) + 1e-12);
    const a2 = num(coefV / Math.pow(10, lead)), e2 = eV + lead;
    const l0 = op === 'mul' ? `${d.A[0]}\\times${d.B[0]}` : op === 'div' ? `\\dfrac{${d.A[0]}}{${d.B[0]}}` : `${d.A[0]}^{${d.k}}`;
    const l1 = op === 'mul' ? `10^{${d.A[1]}}\\times10^{${d.B[1]}}` : op === 'div' ? `\\dfrac{10^{${d.A[1]}}}{10^{${d.B[1]}}}` : `\\left(10^{${d.A[1]}}\\right)^{${d.k}}`;
    const steps = [{
      cap: op === 'mul' ? `Multiplication can be regrouped: put the <b>leading numbers</b> in one column and the <b>powers of 10</b> in the other.`
        : op === 'pow' ? `<b>Power of a product:</b> the ${d.k} goes to <b>both</b> factors, ${T(d.A[0])} and ${T(`10^{${d.A[1]}}`)}.`
          : d.plain ? `Write ${T(d.plain)} as ${T(sciT(d.A[0], d.A[1]))} so both parts have a power of 10. Then split the fraction into two columns.`
            : `Split the fraction into two columns: numbers over numbers, powers of 10 over powers of 10.`,
      run: (c) => { L[0][0].innerHTML = T(l0); L[1][0].innerHTML = T(l1); return Promise.all([c.fadeIn(cols[0], 300), c.fadeIn(cols[1], 300, { delay: 120 }), c.fadeIn(L[0][0], 380, { delay: 200 }), c.fadeIn(L[1][0], 380, { delay: 320 })]); }
    }, {
      cap: `Leading numbers: ${T(op === 'mul' ? `${d.A[0]}\\times${d.B[0]}=${cs}` : op === 'div' ? `${d.A[0]}\\div${d.B[0]}=${cs}` : `${d.A[0]}^{${d.k}}=${cs}`)}.`,
      run: (c) => { L[0][1].innerHTML = T('=' + cs); return c.fadeIn(L[0][1], 380); }
    }, {
      cap: op === 'mul' ? `Powers of 10: <b>product law</b>, add the exponents. ${T(`${d.A[1]}+${par(d.B[1])}=${eV}`)}.` : op === 'div' ? `Powers of 10: <b>quotient law</b>, subtract the exponents. ${T(`${d.A[1]}-${par(d.B[1])}=${eV}`)}.` : `Powers of 10: <b>power of a power</b>, multiply the exponents. ${T(`${d.A[1]}\\times${d.k}=${eV}`)}.`,
      run: (c) => { L[1][1].innerHTML = T(op === 'mul' ? `=10^{${d.A[1]}+${par(d.B[1])}}=10^{${eV}}` : op === 'div' ? `=10^{${d.A[1]}-${par(d.B[1])}}=10^{${eV}}` : `=10^{${d.A[1]}\\times${d.k}}=10^{${eV}}`); return c.fadeIn(L[1][1], 380); }
    }, {
      cap: lead === 0 ? `Together: ${T(sciT(cs, eV))}. Is the leading number between 1 and 10? <b>Yes</b>: this is already proper scientific notation.`
        : `Together: ${T(sciT(cs, eV))}. But ${T(cs)} is ${lead > 0 ? '<b>10 or more</b>' : '<b>less than 1</b>'}, so this is <b>not</b> proper scientific notation yet.`,
      run: async (c) => {
        verdict.innerHTML = lead === 0 ? `${T('1\\le ' + cs + '<10')} ✓` : `${T(lead > 0 ? cs + '\\ge10' : cs + '<1')} ✗`;
        verdict.className = 'u2l10-sn-check ' + (lead === 0 ? 'ok' : 'red');
        await c.fadeIn(bigEl, 400); await c.fadeIn(verdict, 350);
      }
    }];
    if (lead > 0) steps.push({
      cap: `Hop the decimal point <b>left</b> ${lead === 1 ? 'one place' : lead + ' places'}: ${T(`${cs}=${a2}\\times10^{${lead}}`)}. That extra 10 goes into the exponent: ${T(`${eV}+${lead}=${e2}`)}.`,
      run: async (c) => {
        const p1 = p0 - lead;
        await Promise.all([c.anim(pt, [{ left: pt.style.left, opacity: Number(pt.style.opacity || 1) }, { left: ptX(p1), opacity: 1 }], 600), ...dEls.map((e, i) => c.anim(e, [{ left: e.style.left }, { left: dX(i, p1) }], 600))]);
        eEl.textContent = e2; await c.pop(eEl, 380);
        verdict.innerHTML = `${T('1\\le ' + a2 + '<10')} ✓`; verdict.className = 'u2l10-sn-check ok'; await flash(c, verdict);
      }
    });
    const ans = sciT(lead === 0 ? cs : a2, lead === 0 ? eV : e2);
    steps.push({
      cap: `${d.tag ? '<b>' + d.tag + ':</b> ' : ''}${T(sciExpr(d) + '=' + ans + (d.std ? '=' + d.std : ''))}.${d.unit ? ' ' + (d.op === 'pow' ? `The area is ${T(ans)} ` + d.unit : d.unit) : ''}`,
      run: async (c) => { fin.innerHTML = T(sciLine(d) + '=' + ans + (d.std ? '=' + d.std : '')); await c.fadeIn(fin, 450); }
    });
    return steps;
  }
};

/* ============ 9. Power ↔ radical, root first (from the 10C radical explainer) ============ */
const RAD = {
  d27: { base: '27', rad: '27', m: 2, n: 3, r: '3', p: '9' },
  e9a: { base: 't', rad: 't', m: 3, n: 8, sym: true, end: `<b>Example 9(a):</b> ${T('t^{3/8}=\\sqrt[8]{t^{3}}')}. The same value can be written ${T('\\left(\\sqrt[8]{t}\\right)^{3}')}: power inside or outside, either works.` },
  e16: { base: '16', rad: '16', m: 3, n: 2, r: '4', p: '64', end: `${T('p^{3/2}=16^{3/2}=64')} is the first piece of <b>Example 9(b)</b>. Try ${T('q=-8')} next.` },
  m8: { base: '(-8)', rad: '-8', m: 2, n: 3, neg: true, r: '-2', p: '4', recip: '\\dfrac{1}{4}', end: `<b>Example 9(b):</b> ${T('p^{3/2}-q^{-2/3}=64-\\tfrac14=63.75')}.`, badge: '64-\\tfrac14=63.75' }
};
const radical = {
  title: 'Power ↔ radical: the denominator is the root',
  height: 430,
  choices: [{ sep: 'Try:' }, { v: 'd27', label: T('27^{2/3}') }, { sep: 'Example 9 check:' }, { v: 'e9a', label: '(a)' }, { v: 'e16', label: T('16^{3/2}') }, { v: 'm8', label: T('(-8)^{-2/3}') }],
  intro: (v) => { const d = RAD[v]; return `${T(`${d.base}^{${d.neg ? '-' : ''}${d.m}/${d.n}}`)}: a rational exponent is a <b>root</b> and a <b>power</b> in one. “<b>Power over root</b>”: the numerator is the power, the denominator is the root.`; },
  make(stage, v, ex) {
    const W = ex.W, d = RAD[v], px = W * 0.2, py = 132;
    const svg = add(stage, svgEl('svg', { class: 'u2l10-rd-svg' }), 0, 0);
    const base = add(stage, h('div', 'u2l10-rd-base c', T(d.base)), px, py);
    const bw = base.offsetWidth || 60, ex0 = px + bw / 2 + 24;
    const mT = add(stage, h('div', 'u2l10-rd-ex c m', String(d.m)), ex0, py - 58);
    const nT = add(stage, h('div', 'u2l10-rd-ex c n', String(d.n)), ex0, py - 18);
    add(stage, h('div', 'u2l10-rd-sbar c'), ex0, py - 38);
    const minus = d.neg ? add(stage, h('div', 'u2l10-rd-ex c neg', '−'), ex0 - 24, py - 58) : null;
    const eqX = Math.max(W * 0.38, ex0 + 50); add(stage, h('div', 'u2l10-rd-eq c', '='), eqX, py);
    const rx = Math.max(W * 0.46, eqX + 52), top = py - (d.sym ? 64 : 42), bot = py + 36;
    const rad = add(stage, h('div', 'u2l10-rd-rad c', T(d.rad)), 0, py); const rw = rad.offsetWidth || 60;
    const lp = add(stage, h('div', 'u2l10-rd-par c', '('), rx, py + 2);
    const sx = rx + 22, rcx = sx + 42 + rw / 2;
    at(rad, rcx, py);
    const pIn = d.sym ? add(stage, h('div', 'u2l10-rd-ex c m', String(d.m)), rcx + rw / 2 + 14, py - 30) : null;
    const lineEnd = rcx + rw / 2 + (d.sym ? 36 : 10);
    const rp = add(stage, h('div', 'u2l10-rd-par c', ')'), lineEnd + 16, py + 2);
    const pOut = add(stage, h('div', 'u2l10-rd-ex c m', String(d.m)), lineEnd + 42, py - 52);
    const idx = add(stage, h('div', 'u2l10-rd-ex c n idx', String(d.n)), sx + 10, top - 6);
    const sign = svg.appendChild(svgEl('path', { class: 'u2l10-rd-sign', d: `M ${sx - 4} ${py + 4} L ${sx + 6} ${py - 2} L ${sx + 20} ${bot} L ${sx + 36} ${top} L ${lineEnd} ${top}` }));
    sign.style.opacity = 0;
    const parts = [rad, lp, rp, pOut, idx]; if (pIn) parts.push(pIn); hide(...parts);
    const lines = [0, 1, 2].map((j) => { const e = add(stage, h('div', 'u2l10-rd-line c'), W / 2, 248 + j * 58); e.style.opacity = 0; return e; });
    const badge = add(stage, h('div', 'u2l10-rd-badge'), W - 20, 24); badge.style.translate = '-100% 0'; badge.style.opacity = 0;
    const flyEl = (c, el, to, ms = 700) => { const g = add(stage, h('div', el.className, el.innerHTML), parseFloat(el.style.left), parseFloat(el.style.top)); return moveTo(c, g, parseFloat(to.style.left), parseFloat(to.style.top), ms).then(() => { g.remove(); to.style.opacity = 1; }); };
    const steps = [];
    if (d.neg) steps.push({
      cap: `The exponent is <b>negative</b>, and that just means <b>reciprocal</b>. Set the minus sign aside: find ${T(`${d.base}^{${d.m}/${d.n}}`)} first, then flip it at the end.`,
      run: async (c) => { badge.innerHTML = `${T('-')} → reciprocal at the end`; await Promise.all([c.anim(minus, [{ opacity: 1 }, { opacity: 0.18 }], 500), c.fadeIn(badge, 400, { delay: 200 })]); }
    });
    steps.push({
      cap: d.n === 2 ? `The <b>denominator 2</b> is the index of the root: a <b>square root</b>. (Index 2 isn’t written.)` : `The <b>denominator ${d.n}</b> becomes the <b>index</b> of the root: ${d.n === 3 ? 'a cube' : d.n === 8 ? 'an 8th' : 'a ' + d.n + 'th'} root of ${T(d.rad)}.`,
      run: async (c) => {
        nT.classList.add('lit');
        await Promise.all([flyEl(c, nT, idx), draw(c, sign, 700, { delay: 250 }), c.anim(sign, [{ opacity: 1 }, { opacity: 1 }], 10), c.fadeIn(rad, 400, { delay: 450 }), d.sym ? Promise.resolve() : Promise.all([c.fadeIn(lp, 300, { delay: 500 }), c.fadeIn(rp, 300, { delay: 500 })])]);
        if (d.n === 2) await c.anim(idx, [{ opacity: 1 }, { opacity: 0.3 }], 400);
      }
    });
    steps.push({
      cap: d.sym ? `The <b>numerator ${d.m}</b> is the <b>power</b>. With a variable base, write it inside: ${T(`\\sqrt[${d.n}]{${d.rad}^{${d.m}}}`)}.` : `The <b>numerator ${d.m}</b> is the <b>power</b>. Put it outside the root so we can take the root first.`,
      run: async (c) => { mT.classList.add('lit'); await flyEl(c, mT, d.sym ? pIn : pOut); }
    });
    if (d.sym) steps.push({ cap: d.end, run: async (c) => { lines[0].innerHTML = T(`${d.base}^{${d.m}/${d.n}}=\\sqrt[${d.n}]{${d.base}^{${d.m}}}=\\left(\\sqrt[${d.n}]{${d.base}}\\right)^{${d.m}}`); await c.fadeIn(lines[0], 450); } });
    else {
      const rootT = d.n === 2 ? `\\sqrt{${d.rad}}` : `\\sqrt[${d.n}]{${d.rad}}`, rP = d.r.startsWith('-') ? `(${d.r})` : d.r;
      steps.push({
        cap: `<b>Root first</b>: it keeps the numbers small. ${T(`${rootT}=${d.r}`)}${d.rad.startsWith('-') ? ` (an odd root of a negative is negative: ${T(`(${d.r})^{${d.n}}=${d.rad}`)})` : ` because ${T(`${d.r}^{${d.n}}=${d.rad}`)}`}.`,
        run: async (c) => { lines[0].innerHTML = T(`${d.base}^{${d.m}/${d.n}}=\\left(${rootT}\\right)^{${d.m}}=${rP}^{${d.m}}`); await c.fadeIn(lines[0], 450); }
      });
      steps.push({
        cap: `<b>Then the power</b>: ${T(`${rP}^{${d.m}}=${d.p}`)}.${d.neg ? ' Not done yet: remember the minus sign.' : d.end ? ' ' + d.end : ''}`,
        run: async (c) => { lines[1].innerHTML = T(`=${d.p}`); await c.fadeIn(lines[1], 400); }
      });
      if (d.neg) steps.push({
        cap: `Now the <b>reciprocal</b>: ${T(`${d.base}^{-${d.m}/${d.n}}=\\dfrac{1}{${d.p}}`)}. Positive: a negative exponent never makes a number negative.`,
        run: async (c) => { lines[2].innerHTML = T(`${d.base}^{-${d.m}/${d.n}}=\\dfrac{1}{${d.base}^{${d.m}/${d.n}}}=${d.recip}`); await Promise.all([c.fadeIn(lines[2], 400), c.anim(minus, [{ opacity: 0.18 }, { opacity: 1 }], 400)]); }
      });
      if (d.neg && d.end) steps.push({ cap: d.end, run: async (c) => { badge.innerHTML = T(d.badge); await flash(c, badge); } });
    }
    return steps;
  }
};

/* ============ warm-up: the Sticky-Note Wall ============ */
const NOTES = [
  ['A', '2^{3}\\cdot2^{4}', '=2^{7}', true, 'product law', '2^{3+4}=2^{7}=128'],
  ['B', '5^{0}', '=0', false, 'zero exponent', '5^{0}=1'],
  ['C', '8^{1/3}', '=2', true, 'rational exponent', '\\sqrt[3]{8}=2'],
  ['D', '(x^{2})^{3}', '=x^{5}', false, 'power of a power', '=x^{2\\times3}=x^{6}'],
  ['E', '3\\times10^{4}', '=30\\,000', true, 'scientific notation', '3\\times10\\,000'],
  ['F', '2^{-3}', '=-8', false, 'negative exponent', '=\\tfrac{1}{2^{3}}=\\tfrac18'],
  ['G', '10^{6}\\div10^{2}', '=10^{4}', true, 'quotient law', '10^{6-2}=10^{4}'],
  ['H', '(2x)^{3}', '=2x^{3}', false, 'power of a product', '=2^{3}x^{3}=8x^{3}'],
  ['I', '\\left(\\tfrac{3}{4}\\right)^{2}', '=\\tfrac{9}{16}', true, 'power of a quotient', '\\tfrac{3^{2}}{4^{2}}=\\tfrac{9}{16}'],
  ['J', '2^{3}\\cdot2^{4}', '=4^{7}', false, 'product law', 'keep the base: 2^{7}']
];
function mountWall() {
  const wall = document.getElementById('u2l10-wall'); if (!wall) return;
  const grid = h('div', 'u2l10-notes'); wall.insertBefore(grid, wall.firstChild);
  const tally = document.getElementById('u2l10-tally');
  const rot = [3, -2, 2, -3, 2, -2, 3, -3, 2, -2];
  const els = NOTES.map(([L, q, a, ok, law, fix], i) => {
    const b = h('button', 'u2l10-note', `<span class="u2l10-pin"></span><span class="u2l10-nl">${L}</span><span class="u2l10-nq">${T(q)}</span><span class="u2l10-na">${T(a)}</span><span class="u2l10-nfix">${ok ? '<b class="u2l10-ok">✓</b> ' : '<b class="u2l10-x">✗</b> '}<span class="u2l10-nlaw">${law}</span>${ok ? '' : `<br>${law === 'product law' ? 'keep the base: ' + T('2^{7}') : T(fix)}`}</span><span class="u2l10-nstamp">${ok ? '✓' : '✗'}</span>`);
    b.type = 'button'; b.style.setProperty('--r', rot[i] + 'deg'); b.classList.add(ok ? 'ok' : 'bad'); b.dataset.u2l10Note = L;
    b.addEventListener('click', () => { b.classList.toggle('on'); upd(); });
    grid.appendChild(b); return b;
  });
  function upd() { const on = els.filter((e) => e.classList.contains('on')), bad = on.filter((e) => e.classList.contains('bad')).length; tally.innerHTML = `${on.length} of 10 checked · <b class="u2l10-x">${bad} wrong</b> found`; }
  document.getElementById('u2l10-all').addEventListener('click', () => { els.forEach((e, i) => setTimeout(() => { e.classList.add('on'); upd(); }, i * 120)); });
  document.getElementById('u2l10-reset').addEventListener('click', () => { els.forEach((e) => e.classList.remove('on')); upd(); });
  upd();
}

mountWall();
export const explainers = mountExplainers({ count, dist, steps1, anatomy, flip, steps2, sci, radical });

/* ============ Stand Up Break! — the whole unit at the whiteboards ============ */
standup('u2l10', (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const LET = ['a', 'b', 'c', 'd', 'g', 'h', 'k', 'm', 'n', 'p', 'x', 'y', 'w'];
  const pw = (v, e) => (e === 1 ? v : v + '^{' + e + '}');
  const co = (c, body) => (c === 1 ? body : String(c) + body);
  const pos = (c, v, e) => (e === 0 ? String(c) : e > 0 ? co(c, pw(v, e)) : '\\dfrac{' + c + '}{' + pw(v, -e) + '}'); // c v^e with a positive exponent
  const big = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  // the assignment's own questions (signatures) are left out
  const AV = new Set(['P|5|2|5|2', 'P|2|3|2|4', 'PV|8|3|1|5', 'PV|4|2|5|3', 'PV|3|1|7|4', 'QN|9|6|4', 'QV|1|12|1|5', 'PPN|3|2|3', 'PPV|4|3', 'PRV|5|2', 'PRV|2|4', 'PRV|-3|2', 'PQ1|3|2', 'PQ2|3|3',
    'Z|7', 'ZN|4', 'ZC|9', 'ZB|9', 'NN|6|2', 'NR|4|3', 'NV|8|2', 'NRV|5|4', 'SC|58000', 'SC|0.00047', 'SS|6.3|4', 'SS|9|-5']);
  return {
    intro: 'At your whiteboard station, no calculator: name the law, then simplify. Final answers with positive exponents.',
    levels: {
      BEG: (r) => { // Sections 1–3: one law at a time (Examples 1–3)
        for (;;) {
          const v = r.pick(LET), t = r.pick(['PN', 'PV', 'PV', 'QN', 'QV', 'QV', 'PPV', 'PPN', 'PRV', 'PRV', 'PQ1', 'PQ2']);
          if (t === 'PN') { const b = r.pick([2, 3, 10]), m = r.int(1, 4), n = r.int(1, 4), e = m + n; if ((b === 2 && e > 8) || (b === 3 && e > 5) || (b === 10 && e > 6) || AV.has(`P|${b}|${m}|${b}|${n}`)) continue;
            return { text: 'Evaluate.', q: `${b}^{${m}}\\times${b}^{${n}}`, a: [`=${b}^{${m}+${n}}=${b}^{${e}}`, `=${big(b ** e)}`] }; }
          if (t === 'PV') { const c1 = r.int(2, 9), c2 = r.int(2, 9), m = r.int(1, 7), n = r.int(1, 7); if (AV.has(`PV|${c1}|${m}|${c2}|${n}`)) continue;
            return { q: `${co(c1, pw(v, m))}\\times${co(c2, pw(v, n))}`, a: [`=(${c1}\\times${c2})\\,${v}^{${m}+${n}}`, `=${co(c1 * c2, pw(v, m + n))}`] }; }
          if (t === 'QN') { const b = r.pick([2, 3, 5, 10]), n = r.int(1, 6), k = r.int(1, b === 2 ? 5 : 2), m = n + k; if (AV.has(`QN|${b}|${m}|${n}`)) continue;
            return { text: 'Evaluate.', q: `\\dfrac{${b}^{${m}}}{${b}^{${n}}}`, a: [`=${b}^{${m}-${n}}=${b}^{${k}}`, `=${big(b ** k)}`] }; }
          if (t === 'QV') { const d = r.int(2, 6), k = r.pick([1, 1, 2, 3, 4]), n = r.int(1, 6), m = n + r.int(1, 8); if (AV.has(`QV|${d * k}|${m}|${d}|${n}`)) continue;
            return { q: `\\dfrac{${co(d * k, pw(v, m))}}{${co(d, pw(v, n))}}`, a: [`=\\dfrac{${d * k}}{${d}}\\,${v}^{${m}-${n}}`, `=${co(k, pw(v, m - n))}`] }; }
          if (t === 'PPV' || t === 'PPN') { const m = r.int(2, 6), n = r.int(2, 4); if (t === 'PPN') { const b = r.pick([2, 10]); if ((b === 2 && m * n > 10) || (b === 10 && m * n > 8) || AV.has(`PPN|${b}|${m}|${n}`)) continue; return { text: 'Evaluate.', q: `\\left(${b}^{${m}}\\right)^{${n}}`, a: [`=${b}^{${m}\\times${n}}=${b}^{${m * n}}`, `=${big(b ** (m * n))}`] }; }
            if (AV.has(`PPV|${m}|${n}`)) continue; return { q: `\\left(${pw(v, m)}\\right)^{${n}}`, a: `=${v}^{${m}\\times${n}}=${v}^{${m * n}}` }; }
          if (t === 'PRV') { const c = r.pick([2, 3, 4, 5, 6, 10, -2, -3]), n = c === 2 || c === -2 ? r.int(2, 5) : r.int(2, 3), e = r.int(1, 3); if (Math.abs(c) ** n > 1000 || AV.has(`PRV|${c}|${n}`)) continue;
            const inner = (c < 0 ? '-' + -c : c) + pw(v, e); return { q: `\\left(${inner}\\right)^{${n}}`, a: [`=(${c})^{${n}}${v}^{${e}\\times${n}}`.replace(`=(${c})`, c < 0 ? `=(${c})` : `=${c}`), `=${co(c ** n, pw(v, e * n))}`] }; }
          if (t === 'PQ1') { const c = r.int(2, 6), n = r.int(2, 3); if (AV.has(`PQ1|${c}|${n}`)) continue; return { q: `\\left(\\dfrac{${v}}{${c}}\\right)^{${n}}`, a: [`=\\dfrac{${v}^{${n}}}{${c}^{${n}}}`, `=\\dfrac{${v}^{${n}}}{${c ** n}}`] }; }
          const c = r.int(2, 5), n = r.int(2, 3); if (AV.has(`PQ2|${c}|${n}`)) continue; return { q: `\\left(\\dfrac{${c}}{${v}}\\right)^{${n}}`, a: [`=\\dfrac{${c}^{${n}}}{${v}^{${n}}}`, `=\\dfrac{${c ** n}}{${v}^{${n}}}`] };
        }
      },
      PRG: (r) => { // Sections 5, 6, 8: zero and negative exponents, scientific notation (Examples 5, 6, 8)
        for (;;) {
          const v = r.pick(LET), t = r.pick(['Z', 'Z', 'N', 'N', 'N', 'S', 'S', 'SM']);
          if (t === 'Z') { const c = r.int(2, 12), k = r.pick(['ZC', 'ZB', 'ZN', 'ZP']); if (AV.has(`${k}|${c}`)) continue;
            if (k === 'ZC') return { text: 'Evaluate.', q: `${c}${v}^{0}`, a: `=${c}\\times1=${c}\\quad\\text{(the 0 is on }${v}\\text{ only)}` };
            if (k === 'ZB') return { text: 'Evaluate.', q: `(${c}${v})^{0}`, a: `=1\\quad\\text{(the whole }${c}${v}\\text{ is the base)}` };
            if (k === 'ZN') return { text: 'Evaluate.', q: `-${c}^{0}`, a: `=-(${c}^{0})=-1` };
            return { text: 'Evaluate.', q: `(-${c})^{0}`, a: '=1' }; }
          if (t === 'N') { const k = r.pick(['NN', 'NR', 'NV', 'NRV', 'NQ']);
            if (k === 'NN' || k === 'NR') { const b = r.int(2, 10), n = b <= 3 ? r.int(1, 4) : b <= 5 ? r.int(1, 3) : r.int(1, 2); if (b ** n > 250 || AV.has(`${k}|${b}|${n}`)) continue;
              return k === 'NN' ? { text: 'Evaluate.', q: `${b}^{-${n}}`, a: `=\\dfrac{1}{${b}^{${n}}}=\\dfrac{1}{${b ** n}}` } : { text: 'Evaluate.', q: `\\dfrac{1}{${b}^{-${n}}}`, a: `=${b}^{${n}}=${b ** n}` }; }
            const c = r.int(2, 12), n = r.int(1, 6); if (AV.has(`${k}|${c}|${n}`)) continue;
            if (k === 'NV') return { q: `${c}${v}^{-${n}}`, a: `=\\dfrac{${c}}{${pw(v, n)}}\\quad\\text{(the ${c} stays on top)}` };
            if (k === 'NRV') return { q: `\\dfrac{${c}}{${v}^{-${n}}}`, a: `=${c}${pw(v, n)}` };
            const d = r.int(2, 6), q = r.int(2, 5), m = r.int(-5, 6), p = r.int(1, 6); if (m - p >= 0 || m === 0) continue; // a quotient that ends negative
            return { q: `\\dfrac{${d * q}${pw(v, m)}}{${d}${pw(v, p)}}`, a: [`=${q}${v}^{${m}-${p}}=${q}${v}^{${m - p}}`, `=${pos(q, v, m - p)}`] }; }
          if (t === 'S') { // write in scientific notation, or back in standard form
            const a = r.pick(['2.5', '3.6', '4.2', '7.1', '8', '5.06', '1.9', '6.4']), e = r.pick([-6, -5, -4, -3, 3, 4, 5, 6, 7]), val = Number(a) * 10 ** e;
            const std = e > 0 ? big(Math.round(val)) : val.toFixed(-e + (a.length > 1 ? a.length - 2 : 0));
            if (AV.has(`SS|${a}|${e}`) || AV.has('SC|' + std)) continue;
            return r.chance(0.5) ? { text: 'Write in scientific notation.', q: std, a: `=${a}\\times10^{${e}}` } : { text: 'Write in standard form.', q: `${a}\\times10^{${e}}`, a: `=${std}` }; }
          const [x, y] = r.pick([[2, 3], [2, 4], [3, 3], [4, 2], [5, 4], [6, 5], [8, 3], [2.5, 4], [1.5, 6], [3, 7], [4, 5]]), m = r.int(-6, 6), n = r.int(-6, 6), P = Math.round(x * y * 100) / 100, lead = P >= 10 ? 1 : 0;
          if (m === 0 || n === 0) continue;
          return { q: `(${x}\\times10^{${m}})\\times(${y}\\times10^{${n}})`, a: [`=${x}\\times${y}\\times10^{${m}+${par(n)}}=${P}\\times10^{${m + n}}`, ...(lead ? [`=${Math.round(P * 10) / 100}\\times10^{${m + n + 1}}`] : [])] };
        }
      },
      MAS: (r) => { // Sections 4, 7, 9, 10: several laws in one, rational exponents (Examples 4, 7, 9, Challenges)
        for (;;) {
          const v = r.pick(LET), t = r.pick(['C', 'C', 'C', 'R', 'R', 'D']);
          if (t === 'C') { // (c v^a)^k × d v^b   or   (c v^a)^k ÷ d v^b, with a negative exponent somewhere
            const c = r.pick([2, 3, 2, 5]), k = r.pick([2, 2, 3]), a = r.pick([-3, -2, -1, 1, 2, 3, 4]), b = r.pick([-5, -4, -3, -2, 1, 2, 3, 4, 5, 6]), over = r.chance(0.5);
            if (c ** k > 30 || (a > 0 && b > 0)) continue;
            const C = c ** k, A = a * k;
            if (over) { const d = r.pick([C, 2, 4, C * 2].filter((x) => C % x === 0 || x % C === 0)); const E = A - b; if (E === 0) continue;
              const num = C / gcd(C, d), den = d / gcd(C, d), coefT = den === 1 ? null : `\\dfrac{${num}}{${den}}`;
              if (AV.has(`CQ|${c}|${a}|${k}|${b}`)) continue;
              const fin = den === 1 ? pos(num, v, E) : E > 0 ? `\\dfrac{${co(num, pw(v, E))}}{${den}}` : `\\dfrac{${num}}{${den}${pw(v, -E)}}`;
              return { q: `\\dfrac{(${c}${pw(v, a)})^{${k}}}{${d}${pw(v, b)}}`, a: [`(${c}${pw(v, a)})^{${k}}=${C}${pw(v, A)}`, `=\\dfrac{${C}}{${d}}\\,${v}^{${A}-${par(b)}}`, `=${fin}`] }; }
            const d = r.int(2, 6), E = A + b; if (E === 0) continue;
            return { q: `(${c}${pw(v, a)})^{${k}}\\times${d}${pw(v, b)}`, a: [`(${c}${pw(v, a)})^{${k}}=${C}${pw(v, A)}`, `=(${C}\\times${d})\\,${v}^{${A}+${par(b)}}=${C * d}${pw(v, E)}`, ...(E < 0 ? [`=${pos(C * d, v, E)}`] : [])] }; }
          if (t === 'R') { // p^{m/n} − q^{−m/n}, root first (Example 9(b)); not the assignment's 36 and −125
            const [p, pn, pm] = r.pick([[4, 2, 3], [9, 2, 3], [25, 2, 3], [100, 2, 3], [8, 3, 2], [27, 3, 2], [16, 4, 3], [16, 2, 3]]), [q, qn, qm] = r.pick([[-8, 3, 2], [8, 3, 2], [-27, 3, 2], [27, 3, 2], [-8, 3, 1], [4, 2, 1], [9, 2, 1], [16, 2, 1], [-64, 3, 1]]);
            const pr = Math.round(Math.abs(p) ** (1 / pn)), P = pr ** pm, qr = Math.sign(q) * Math.round(Math.abs(q) ** (1 / qn)), Qd = qr ** qm; // q^{-qm/qn} = 1/Qd
            const val = P - 1 / Qd, frac = (() => { const N = P * Qd - 1, D = Qd, g = gcd(N, D); let n0 = N / g, d0 = D / g; if (d0 < 0) { n0 = -n0; d0 = -d0; } return d0 === 1 ? String(n0) : `${n0 < 0 ? '-' : ''}\\dfrac{${Math.abs(n0)}}{${d0}}`; })();
            const rq = qn === 2 ? `\\sqrt{${q}}` : `\\sqrt[${qn}]{${q}}`, rp = pn === 2 ? `\\sqrt{${p}}` : `\\sqrt[${pn}]{${p}}`;
            return { text: `If ${tex('p=' + p)} and ${tex('q=' + q)}, evaluate.`, q: `p^{${pm}/${pn}}-q^{-${qm}/${qn}}`,
              a: [`${p}^{${pm}/${pn}}=\\left(${rp}\\right)^{${pm}}=${pr}^{${pm}}=${P}`,
                `${q < 0 ? `(${q})` : q}^{-${qm}/${qn}}=\\dfrac{1}{${qm === 1 ? rq : `\\left(${rq}\\right)^{${qm}}`}}` + (qm === 1 ? '' : `=\\dfrac{1}{${qr < 0 ? `(${qr})` : qr}^{${qm}}}`) + `=${Qd < 0 ? `-\\dfrac{1}{${-Qd}}` : `\\dfrac{1}{${Qd}}`}`,
                `${P}-${Qd < 0 ? `\\left(-\\dfrac{1}{${-Qd}}\\right)` : `\\dfrac{1}{${Qd}}`}=${frac}` + (Number.isInteger(Math.round(val * 1e6) / 1e4) ? `=${num(val)}` : '')] };
          }
          // (a × 10^m)^2, then a division in scientific notation (Challenge 3 style)
          const [a, k] = r.pick([[2, 2], [4, 2], [5, 2], [6, 2], [2, 3], [3, 3], [1.2, 2], [1.5, 2]]), m = r.int(2, 5), A = Math.round(a ** k * 1000) / 1000, E = m * k, lead = A >= 10 ? 1 : 0;
          if (a === 5 && m === 2 && k === 2) continue; // the assignment's chip
          return { text: 'Write in proper scientific notation.', q: `(${a}\\times10^{${m}})^{${k}}`, a: [`=${a}^{${k}}\\times10^{${m}\\times${k}}=${A}\\times10^{${E}}`, ...(lead ? [`=${Math.round(A * 100) / 1000}\\times10^{${E + 1}}`] : [])] };
        }
      }
    }
  };
})());
