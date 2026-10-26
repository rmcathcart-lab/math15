/* Math 15 · Unit 4 · Lesson 8 — Choosing a Factoring Strategy.
 * The "Pick the Right Tool" warm-up (five tool cards, six jobs), the clue-by-clue tool match, the factoring flowchart
 * that lights up the path for a chosen expression (adapted from Math 10C u4l7), the perfect-square test, the hidden
 * difference of squares, "finished or not?", check by expanding, and the lightning round. */
import { h, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const box = (el, w, hh) => { el.style.width = w + 'px'; if (hh != null) el.style.height = hh + 'px'; return el; };
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const pulse = (c, el, s = 1.08) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], 460);
const stampIn = (c, el) => c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-16deg)' }, { opacity: 1, transform: 'scale(1) rotate(-7deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' });
/* shrink a line of math until it fits its box */
function fit(el, base, maxW) {
  el.style.fontSize = base + 'px';
  const lim = () => (maxW != null ? maxW : el.clientWidth + 1);
  let f = base;
  while (el.scrollWidth > lim() && f > 14) { f -= 1; el.style.fontSize = f + 'px'; }
}

/* the five tools (= the five methods) and their colour families */
const TOOLS = {
  A: { k: 'k1', name: 'GCF', tool: 'hammer', clue: 'every term shares a factor', terms: 'any terms' },
  B: { k: 'k2', name: 'Difference of Squares', tool: 'pliers', clue: 'square − square', terms: '2 terms' },
  C: { k: 'k5', name: 'Perfect Square', tool: 'wrench', clue: `square, ${'2×'}, square`, terms: '3 terms' },
  D: { k: 'k3', name: 'x²+bx+c', tool: 'screwdriver', clue: `just ${'x²'} in front`, terms: '3 terms' },
  E: { k: 'k4', name: 'Decomposition', tool: 'saw', clue: `number before ${'x²'}`, terms: '3 terms' }
};
const ICON = {
  A: '<svg viewBox="0 0 64 64"><rect x="28" y="22" width="9" height="38" rx="3" fill="#b07a45" stroke="#7a4f26" stroke-width="2"/><rect x="10" y="8" width="44" height="16" rx="4" fill="#7b8494" stroke="#4b5260" stroke-width="2"/></svg>',
  B: '<svg viewBox="0 0 64 64"><path d="M22 60 L33 31 M42 60 L31 31" stroke="#3f8f55" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M33 31 L26 5 M31 31 L38 5" stroke="#7b8494" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="32" cy="31" r="4.5" fill="#4b5260"/></svg>',
  C: '<svg viewBox="0 0 64 64"><path d="M14 56 L38 26" stroke="#7b8494" stroke-width="10" stroke-linecap="round"/><circle cx="44" cy="18" r="13" fill="#7b8494"/><path d="M44 18 L50 2 L62 10 Z" fill="#fff"/><circle cx="44" cy="18" r="4" fill="#fff"/><circle cx="14" cy="56" r="4" fill="#b0477a"/></svg>',
  D: '<svg viewBox="0 0 64 64"><rect x="26" y="34" width="12" height="27" rx="5" fill="#6f5bb5" stroke="#4d3a92" stroke-width="2"/><rect x="30" y="8" width="4" height="28" fill="#7b8494"/><path d="M29 8 L35 8 L32 2 Z" fill="#4b5260"/></svg>',
  E: '<svg viewBox="0 0 64 64"><path d="M4 22 H46 V42 H4 Z" fill="#aab1bd" stroke="#6b7280" stroke-width="2"/><path d="M4 42 l3 6 l3 -6 l3 6 l3 -6 l3 6 l3 -6 l3 6 l3 -6 l3 6 l3 -6 l3 6 l3 -6 l3 6 l3 -6" fill="none" stroke="#6b7280" stroke-width="2"/><rect x="44" y="16" width="16" height="30" rx="6" fill="#c0663e" stroke="#8f4422" stroke-width="2"/><rect x="49" y="24" width="6" height="14" rx="3" fill="#fff"/></svg>'
};
/* the checklist step kinds → colour family */
const KIND = { 1: 'k1', 2: 'k2', 3: 'k5', 4: 'k3', 5: 'k4', 6: 'k6' };

/* an arrow along a polyline: a grey base, a coloured overlay that draws itself when lit, and a head (from 10C u4l7) */
function polyArrow(svg, pts, o = {}) {
  const g = svgEl('g', { class: 'u4l8-ar' + (o.cls ? ' ' + o.cls : '') });
  const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
  const base = svgEl('path', { d, class: 'u4l8-arb' + (o.dash ? ' dash' : '') });
  const hot = svgEl('path', { d, class: 'u4l8-arh' });
  const [x1, y1] = pts[pts.length - 2], [x2, y2] = pts[pts.length - 1];
  const ang = Math.atan2(y2 - y1, x2 - x1), L = o.head || 14, wd = 0.42;
  const head = svgEl('polygon', { class: 'u4l8-arhd', points: [[x2, y2], [x2 - L * Math.cos(ang - wd), y2 - L * Math.sin(ang - wd)], [x2 - L * Math.cos(ang + wd), y2 - L * Math.sin(ang + wd)]].map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ') });
  g.append(base, hot, head); svg.appendChild(g);
  let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  hot.style.strokeDasharray = len; hot.style.strokeDashoffset = len;
  return {
    g, len,
    async light(c, ms = 520) { g.classList.remove('old'); g.classList.add('lit'); await c.anim(hot, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], ms); }
  };
}

/* =====================================================================================
 * 1. Match the clues: which tool does this expression need?
 * ===================================================================================== */
const noGCF = (q, why) => ({ cap: `<b>Step 1: GCF?</b> ${why || 'The terms share no common factor (other than 1).'}`, log: '\\text{No GCF}', no: ['A'] });
const three = { cap: `<b>Step 2: count the terms:</b> three. The difference of squares (2 terms) is out.`, log: '\\text{3 terms}', no: ['B'] };
const two = { cap: `<b>Step 2: count the terms:</b> two. Only the difference of squares has 2 terms.`, log: '\\text{2 terms}', no: ['C', 'D', 'E'] };
const TMD = {
  j2: { q: 'x^2+6x+9', v: 'Perfect square trinomial', s: [noGCF(), three,
    { cap: `Perfect square? ${T('x^2=(x)^2')}, ${T('9=3^2')}, and the middle is ${T('2(x)(3)=6x')} ✓ The wrench!`, log: '9=3^2,\\ 2(x)(3)=6x', yes: ['C'], no: ['D', 'E'] }] },
  j3: { q: '2x^2+7x+3', v: 'Decomposition', s: [noGCF(), three,
    { cap: `Perfect square? ${T('2x^2')} is not a perfect square ✗`, log: '2x^2\\text{ is not a square}', no: ['C'] },
    { cap: `The leading coefficient is ${T('a=2\\neq1')}: <b>decomposition</b>. The saw!`, log: 'a=2\\neq1', yes: ['E'], no: ['D'] }] },
  j4: { q: 'x^2-49', v: 'Difference of squares', s: [noGCF(), two,
    { cap: `${T('x^2=(x)^2')} and ${T('49=7^2')}, with a <b>minus</b> between them ✓ The pliers!`, log: '49=7^2,\\ \\text{minus}', yes: ['B'] }] },
  j5: { q: 'x^2+7x+10', v: 'Trinomial by inspection', s: [noGCF(), three,
    { cap: `Perfect square? ${T('10')} is not a perfect square ✗`, log: '10\\text{ is not a square}', no: ['C'] },
    { cap: `${T('a=1')}: two numbers with product 10 and sum 7. The screwdriver!`, log: 'a=1', yes: ['D'], no: ['E'] }] },
  e1a: { q: 'x^2-4', v: 'Difference of squares', s: [noGCF(), two,
    { cap: `${T('x^2=(x)^2')} and ${T('4=2^2')}, with a <b>minus</b> between them ✓`, log: '4=2^2,\\ \\text{minus}', yes: ['B'] }] },
  e1b: { q: 'x^2+7x+12', v: 'Trinomial by inspection', s: [noGCF(), three,
    { cap: `Perfect square? ${T('12')} is not a perfect square ✗`, log: '12\\text{ is not a square}', no: ['C'] },
    { cap: `${T('a=1')}: <b>trinomial by inspection</b> (product 12, sum 7).`, log: 'a=1', yes: ['D'], no: ['E'] }] },
  e1c: { q: '4x^2-8x', v: 'GCF only', s: [
    { cap: `<b>Step 1: GCF?</b> Yes! Both terms share ${T('4x')}: ${T('4x^2-8x=4x(x-2)')}.`, log: '4x^2-8x=4x(x-2)', yes: ['A'] },
    { cap: `<b>Step 2:</b> what’s left, ${T('x-2')}, has no ${T('x^2')} and can’t be factored. Nothing else is needed.`, log: 'x-2\\text{: done}', no: ['B', 'C', 'D', 'E'] }] },
  e1d: { q: '3x^2+13x+4', v: 'Decomposition', s: [noGCF('3, 13 and 4 share no common factor.'), three,
    { cap: `Perfect square? ${T('3x^2')} is not a perfect square ✗`, log: '3x^2\\text{ is not a square}', no: ['C'] },
    { cap: `${T('a=3\\neq1')}: <b>decomposition</b> (product ${T('ac')}, sum ${T('b')}).`, log: 'a=3\\neq1', yes: ['E'], no: ['D'] }] },
  e1e: { q: 'x^2+10x+25', v: 'Perfect square trinomial', s: [noGCF(), three,
    { cap: `Perfect square? ${T('x^2=(x)^2')}, ${T('25=5^2')}, and ${T('2(x)(5)=10x')} ✓`, log: '25=5^2,\\ 2(x)(5)=10x', yes: ['C'], no: ['D', 'E'] }] },
  e1f: { q: '2x^2-50', v: 'GCF, then difference of squares', s: [
    { cap: `<b>Step 1: GCF?</b> Yes! Both terms are divisible by 2: ${T('2x^2-50=2(x^2-25)')}.`, log: '2x^2-50=2(x^2-25)', yes: ['A'] },
    { cap: `<b>Step 2:</b> count the terms <b>left in the bracket</b>: ${T('x^2-25')} has two.`, log: '2\\text{ terms left}', no: ['C', 'D', 'E'] },
    { cap: `${T('x^2=(x)^2')} and ${T('25=5^2')}, with a minus ✓ So: <b>GCF first, then difference of squares</b>.`, log: '25=5^2,\\ \\text{minus}', yes: ['B'] }] }
};
const toolMatch = {
  title: 'Match the clues to a tool',
  height: 400,
  choices: [{ sep: 'Warm-up jobs:' }, { v: 'j2', label: T('x^2+6x+9') }, { v: 'j3', label: T('2x^2+7x+3') }, { v: 'j4', label: T('x^2-49') }, { v: 'j5', label: T('x^2+7x+10') },
    { sep: 'Example 1 check:' }, ...'abcdef'.split('').map((k) => ({ v: 'e1' + k, label: '(' + k + ')' }))],
  intro: (k) => `Which method does ${T(TMD[k].q)} need? Run down the checklist and cross off tools.`,
  make(stage, key, ex) {
    const W = ex.W, d = TMD[key];
    const qc = add(stage, box(h('div', 'u4l8-qcard', `<div class="u4l8-qh">Expression</div><div class="u4l8-qm">${T(d.q)}</div>`), 300), 20, 14);
    fit(qc.querySelector('.u4l8-qm'), 34, 270);
    const logs = d.s.map((st, i) => { const e = add(stage, h('div', 'u4l8-log', `<span class="u4l8-ln">${i + 1}</span>${T(st.log)}`), 26, 128 + i * 46); hide(e); fit(e, 20, 300); return e; });
    const verdict = add(stage, box(h('div', 'u4l8-mverdict', `<div class="u4l8-qh">Method</div><b>${d.v}</b>`), 300), 20, 128 + d.s.length * 46 + 8); hide(verdict);
    const rx = 352, rw = W - rx - 16;
    const rows = {};
    'ABCDE'.split('').forEach((L, i) => {
      const t = TOOLS[L];
      const r = add(stage, box(h('div', 'u4l8-mrow ' + t.k, `<div class="u4l8-mic">${ICON[L]}</div><span class="u4l8-tl">${L}</span><div class="u4l8-mtx"><b>${t.name.replace('x²+bx+c', T('x^2+bx+c'))}</b><small>${t.clue.replace('x²', T('x^2'))} · ${t.terms}</small></div><span class="u4l8-mk"></span>`), rw, 64), rx, 12 + i * 74);
      rows[L] = r;
    });
    const steps = d.s.map((st) => ({
      cap: st.cap,
      run: async (c) => {
        (st.no || []).forEach((L) => { rows[L].classList.add('off'); rows[L].querySelector('.u4l8-mk').textContent = '✗'; });
        (st.yes || []).forEach((L) => { rows[L].classList.add('yes'); rows[L].querySelector('.u4l8-mk').textContent = '✓'; });
        await Promise.all([c.fadeIn(logs[d.s.indexOf(st)], 350, { from: 'translateX(-10px)' }), ...(st.yes || []).map((L) => pulse(c, rows[L], 1.03))]);
      }
    }));
    steps.push({
      cap: `<b>Method:</b> ${d.v}${d.v.includes(',') ? ', in that order' : ''}. (We’re only naming the tools here, not factoring yet.)`,
      run: (c) => c.pop(verdict, 380)
    });
    return steps;
  }
};

/* =====================================================================================
 * 2. The flowchart: light up the path for one expression (adapted from Math 10C u4l7)
 * ===================================================================================== */
const FW = 640; // width of the flowchart; the written work sits to its right
const NODES = {
  top: { x: 324, y: 40, w: 380, h: 60, k: 'k1', n: 1, html: '<b>Step 1: Is there a GCF?</b>Factor it out first.' },
  bin: { x: 100, y: 172, w: 170, h: 104, k: 'k2', html: `<b>2 terms left</b>Difference of squares?<br>${T('a^2-b^2')}` },
  tri: { x: 324, y: 150, w: 190, h: 56, k: 'k6', n: 2, html: '<b>3 terms left</b>Trinomial' },
  four: { x: 556, y: 172, w: 150, h: 92, k: 'k0', html: '<b>4+ terms left</b>Grouping<small>(future lesson)</small>' },
  psq: { x: 324, y: 252, w: 230, h: 64, k: 'k5', html: `<b>Perfect square?</b>${T('(a\\pm b)^2')}` },
  insp: { x: 182, y: 362, w: 150, h: 64, k: 'k3', html: `<b>${T('a=1')}:</b>inspection` },
  dec: { x: 466, y: 362, w: 170, h: 64, k: 'k4', html: `<b>${T('a\\neq1')}:</b>decomposition` },
  chk: { x: 324, y: 470, w: 400, h: 58, k: 'k6 dash', n: 3, html: '<b>Step 3: always check</b>Can any factor be factored again?' }
};
const EDGES = {
  'top-bin': { p: [[230, 70], [128, 118]], lab: [168, 92] },
  'top-tri': { p: [[324, 70], [324, 120]] },
  'top-four': { p: [[418, 70], [530, 124]], lab: [486, 92] },
  'tri-psq': { p: [[324, 178], [324, 218]] },
  'psq-insp': { p: [[262, 284], [210, 328]], lab: [214, 298] },
  'psq-dec': { p: [[386, 284], [438, 328]], lab: [436, 298] },
  'psq-chk': { p: [[324, 284], [324, 439]], lab: [324, 384] },
  'bin-chk': { p: [[40, 224], [40, 470], [122, 470]] },
  'four-chk': { p: [[604, 218], [604, 470], [526, 470]] },
  'insp-chk': { p: [[200, 394], [236, 439]] },
  'dec-chk': { p: [[446, 394], [410, 439]] },
  loop: { p: [[324, 499], [324, 516], [627, 516], [627, 40], [516, 40]], dash: true }
};
const FL = {
  m: { q: '2x^2+20x+42', s: [
    { n: 'top', cap: `<b>Step 1:</b> every term is divisible by 2: ${T('2x^2+20x+42=2(x^2+10x+21)')}.`, w: [1, '2(x^2+10x+21)'] },
    { e: 'top-tri', n: 'tri', cap: `<b>Step 2:</b> count the terms <b>left in the bracket</b>: three. A trinomial.` },
    { e: 'tri-psq', n: 'psq', cap: `Perfect square first? ${T('21')} is not a perfect square, so <b>no</b>.` },
    { e: 'psq-insp', lab: 'no, a = 1', n: 'insp', cap: `${T('a=1')}, so <b>inspection</b>: product 21, sum 10: ${T('7')} and ${T('3')}.`, w: [4, '2(x+7)(x+3)'] },
    { e: 'insp-chk', n: 'chk', cap: `<b>Step 3:</b> can ${T('2')}, ${T('x+7')} or ${T('x+3')} be factored again? No. <b>Finished.</b>`, done: '2(x+7)(x+3)' }
  ] },
  y: { q: '3x^2+6x+3', s: [
    { n: 'top', cap: `<b>Step 1:</b> every term is divisible by 3: ${T('3x^2+6x+3=3(x^2+2x+1)')}.`, w: [1, '3(x^2+2x+1)'] },
    { e: 'top-tri', n: 'tri', cap: `<b>Step 2:</b> three terms left in the bracket: a trinomial.` },
    { e: 'tri-psq', n: 'psq', cap: `Perfect square? ${T('x^2=(x)^2')}, ${T('1=1^2')}, and ${T('2(x)(1)=2x')} ✓ <b>Yes!</b>`, w: [3, '3(x+1)^2'] },
    { e: 'psq-chk', lab: 'yes', n: 'chk', cap: `<b>Step 3:</b> ${T('x+1')} can’t be factored again. <b>Finished:</b> hammer, then wrench.`, done: '3(x+1)^2' }
  ] },
  e2a: { q: '2x^2+14x+20', s: [
    { n: 'top', cap: `<b>Step 1:</b> GCF 2: ${T('2x^2+14x+20=2(x^2+7x+10)')}.`, w: [1, '2(x^2+7x+10)'] },
    { e: 'top-tri', n: 'tri', cap: `<b>Step 2:</b> three terms left: a trinomial.` },
    { e: 'tri-psq', n: 'psq', cap: `Perfect square? ${T('10')} is not a perfect square: <b>no</b>.` },
    { e: 'psq-insp', lab: 'no, a = 1', n: 'insp', cap: `${T('a=1')}: product 10, sum 7: ${T('2')} and ${T('5')}.`, w: [4, '2(x+2)(x+5)'] },
    { e: 'insp-chk', n: 'chk', cap: `<b>Step 3:</b> neither binomial factors further. <b>Finished.</b>`, done: '2(x+2)(x+5)' }
  ] },
  e2b: { q: '4x^2-8x-60', s: [
    { n: 'top', cap: `<b>Step 1:</b> GCF 4: ${T('4x^2-8x-60=4(x^2-2x-15)')}.`, w: [1, '4(x^2-2x-15)'] },
    { e: 'top-tri', n: 'tri', cap: `<b>Step 2:</b> three terms left: a trinomial.` },
    { e: 'tri-psq', n: 'psq', cap: `Perfect square? The last term ${T('-15')} is <b>negative</b>, so <b>no</b>.` },
    { e: 'psq-insp', lab: 'no, a = 1', n: 'insp', cap: `${T('a=1')}: product ${T('-15')}, sum ${T('-2')}: ${T('-5')} and ${T('3')}.`, w: [4, '4(x-5)(x+3)'] },
    { e: 'insp-chk', n: 'chk', cap: `<b>Step 3:</b> neither binomial factors further. <b>Finished.</b>`, done: '4(x-5)(x+3)' }
  ] },
  e4a: { q: 'x^2-64', s: [
    { n: 'top', cap: `<b>Step 1:</b> ${T('x^2')} and ${T('64')} share no common factor. Nothing to take out.` },
    { e: 'top-bin', lab: '2 terms', n: 'bin', cap: `<b>Step 2:</b> two terms. ${T('x^2=(x)^2')} and ${T('64=8^2')} with a minus: a <b>difference of squares</b>.`, w: [2, '(x-8)(x+8)'] },
    { e: 'bin-chk', n: 'chk', cap: `<b>Step 3:</b> neither binomial factors again. <b>Finished.</b>`, done: '(x-8)(x+8)' }
  ] },
  e4b: { q: 'x^2-3x-40', s: [
    { n: 'top', cap: `<b>Step 1:</b> no common factor. Nothing to take out.` },
    { e: 'top-tri', n: 'tri', cap: `<b>Step 2:</b> three terms: a trinomial.` },
    { e: 'tri-psq', n: 'psq', cap: `Perfect square? The last term ${T('-40')} is negative: <b>no</b>.` },
    { e: 'psq-insp', lab: 'no, a = 1', n: 'insp', cap: `${T('a=1')}: product ${T('-40')}, sum ${T('-3')}: ${T('-8')} and ${T('5')}.`, w: [4, '(x-8)(x+5)'] },
    { e: 'insp-chk', n: 'chk', cap: `<b>Step 3:</b> neither binomial factors again. <b>Finished.</b>`, done: '(x-8)(x+5)' }
  ] },
  e5a: { q: '3x^2+11x+6', s: [
    { n: 'top', cap: `<b>Step 1:</b> 3, 11 and 6 share no common factor. Nothing to take out.` },
    { e: 'top-tri', n: 'tri', cap: `<b>Step 2:</b> three terms: a trinomial.` },
    { e: 'tri-psq', n: 'psq', cap: `Perfect square? ${T('3x^2')} is not a perfect square: <b>no</b>.` },
    { e: 'psq-dec', lab: 'no, a ≠ 1', n: 'dec', cap: `${T('a=3\\neq1')}: <b>decomposition</b>. ${T('ac=18')}, sum 11: ${T('9')} and ${T('2')}. Split the middle term.`, w: [5, '3x^2+9x+2x+6'] },
    { n: 'dec', cap: `Group: ${T('3x(x+3)+2(x+3)=(x+3)(3x+2)')}.`, w: [5, '(x+3)(3x+2)'] },
    { e: 'dec-chk', n: 'chk', cap: `<b>Step 3:</b> neither binomial factors again. <b>Finished.</b>`, done: '(x+3)(3x+2)' }
  ] },
  e5b: { q: 'x^2-12x+36', s: [
    { n: 'top', cap: `<b>Step 1:</b> ${T('x^2')}, ${T('-12x')} and ${T('36')} share no common factor.` },
    { e: 'top-tri', n: 'tri', cap: `<b>Step 2:</b> three terms: a trinomial.` },
    { e: 'tri-psq', n: 'psq', cap: `Perfect square? ${T('x^2=(x)^2')}, ${T('36=6^2')}, and ${T('2(x)(6)=12x')}. The middle is <b>minus</b> ${T('12x')}: <b>yes</b>, ${T('(x-6)^2')}.`, w: [3, '(x-6)^2'] },
    { e: 'psq-chk', lab: 'yes', n: 'chk', cap: `<b>Step 3:</b> ${T('x-6')} can’t be factored again. <b>Finished.</b>`, done: '(x-6)^2' }
  ] }
};
const flow = {
  title: 'Trace it through the flowchart',
  height: 534,
  minW: 966,
  choices: [{ v: 'm', label: T('2x^2+20x+42') }, { v: 'y', label: T('3x^2+6x+3') },
    { sep: 'Example check:' }, ...['2a', '2b', '4a', '4b', '5a', '5b'].map((k) => ({ v: 'e' + k, label: k[0] + '(' + k[1] + ')' }))],
  intro: (k) => `Factor ${T(FL[k].q)} completely. Every expression starts at the <b>top</b> of the chart. Press <b>Next</b>.`,
  make(stage, key, ex) {
    const W = ex.W, d = FL[key];
    const svg = svgEl('svg', { class: 'u4l8-svg' }); stage.appendChild(svg);
    const arrows = {};
    for (const id in EDGES) arrows[id] = polyArrow(svg, EDGES[id].p, { dash: EDGES[id].dash, cls: id === 'loop' ? 'loop' : '' });
    add(stage, h('div', 'u4l8-elab loop', 'yes: back to the top'), 476, 516);
    const nodes = {};
    for (const id in NODES) {
      const n = NODES[id], el = add(stage, box(h('div', 'u4l8-node ' + n.k, '<div class="u4l8-in">' + n.html + '</div>'), n.w, n.h), n.x - n.w / 2, n.y - n.h / 2);
      if (n.n) el.appendChild(h('span', 'u4l8-nb', n.n));
      nodes[id] = el;
    }
    const labs = {};
    const px = FW + 8, pw = W - px - 10;
    const wp = add(stage, box(h('div', 'u4l8-wp'), pw, 510), px, 12);
    wp.innerHTML = `<div class="u4l8-wph">Factor completely</div><div class="u4l8-wpq">${T(d.q)}</div>`;
    const wl = h('div', 'u4l8-wpl'); wp.appendChild(wl);
    const fin = h('div', 'u4l8-wpf'); wp.appendChild(fin); hide(fin);
    const verdict = add(stage, h('div', 'u4l8-verdict'), 196, 516); hide(verdict);
    fit(wp.querySelector('.u4l8-wpq'), 30);
    let cur = null;
    const setOn = (id) => {
      if (cur && cur !== id) { nodes[cur].classList.remove('on'); nodes[cur].classList.add('path'); }
      nodes[id].classList.remove('path', 'old'); nodes[id].classList.add('on'); cur = id;
    };
    return d.s.map((st) => ({
      cap: st.cap,
      run: async (c) => {
        const jobs = [];
        if (st.e) {
          await arrows[st.e].light(c, 480);
          if (st.lab && EDGES[st.e].lab) {
            const old = labs[st.e]; if (old) old.remove();
            const l = add(stage, h('div', 'u4l8-elab', st.lab), EDGES[st.e].lab[0], EDGES[st.e].lab[1]); labs[st.e] = l; jobs.push(c.pop(l, 320));
          }
        }
        setOn(st.n);
        jobs.push(pulse(c, nodes[st.n], 1.05));
        if (st.w) {
          const [k, src] = st.w;
          const row = h('div', 'u4l8-wline', `<span class="u4l8-wt ${KIND[k]}">${'ABCDE'[k - 1]}</span><span class="u4l8-wm">${T('=' + src)}</span>`);
          wl.appendChild(row); fit(row.querySelector('.u4l8-wm'), 25);
          jobs.push(c.fadeIn(row, 350, { from: 'translateX(-12px)' }));
        }
        if (st.done) {
          verdict.className = 'u4l8-verdict ok'; verdict.innerHTML = '✓ fully factored';
          fin.innerHTML = `<div class="u4l8-wpfh">Answer</div><div class="u4l8-wpfm">${T(d.q + '=' + st.done)}</div><div class="u4l8-stampff">FULLY FACTORED</div>`;
          fin.querySelectorAll('.u4l8-wpfm').forEach((e) => fit(e, 25));
          jobs.push(c.pop(verdict, 360), c.fadeIn(fin, 400, { delay: 150 }), stampIn(c, fin.querySelector('.u4l8-stampff')));
        }
        await Promise.all(jobs);
      }
    }));
  }
};

/* =====================================================================================
 * 2. Perfect square? The three-question test
 * ===================================================================================== */
const PS = {
  e1e: { t: ['x^2', '+10x', '+25'], r1: 'x', r3: '5', two: '2(x)(5)=10x', ok: true, res: '(x+5)^2' },
  n1: { t: ['x^2', '+13x', '+36'], r1: 'x', r3: '6', two: '2(x)(6)=12x', ok: false, why: `the middle is ${T('13x')}, not ${T('12x')}`, alt: `inspection: product 36, sum 13: ${T('4')} and ${T('9')}`, res: '(x+4)(x+9)' },
  n2: { t: ['x^2', '+10x', '+21'], r1: 'x', r3: null, last: '21', alt: `inspection: product 21, sum 10: ${T('7')} and ${T('3')}`, res: '(x+7)(x+3)' },
  sq: { t: ['4x^2', '+20x', '+25'], r1: '2x', r3: '5', two: '2(2x)(5)=20x', ok: true, res: '(2x+5)^2' },
  e5b: { t: ['x^2', '-12x', '+36'], r1: 'x', r3: '6', two: '2(x)(6)=12x', ok: true, neg: true, res: '(x-6)^2' }
};
const psqTest = {
  title: 'Is it a perfect square trinomial?',
  height: 380,
  choices: [{ v: 'e1e', label: T('x^2+10x+25') }, { v: 'sq', label: T('4x^2+20x+25') }, { v: 'n1', label: T('x^2+13x+36') }, { v: 'n2', label: T('x^2+10x+21') }, { sep: 'Example 5 check:' }, { v: 'e5b', label: '(b)' }],
  intro: (k) => `Test ${T(PS[k].t.join(''))}: three quick questions.`,
  make(stage, key, ex) {
    const W = ex.W, d = PS[key], tw = 200, gap = 60, x0 = Math.round((W - 3 * tw - 2 * gap) / 2), y0 = 24;
    const cx = [0, 1, 2].map((i) => x0 + i * (tw + gap) + tw / 2);
    const boxes = d.t.map((t, i) => { const e = add(stage, box(h('div', 'u4l8-term ' + (i === 1 ? 'mid' : ''), T(t)), tw, 70), cx[i] - tw / 2, y0); return e; });
    const root1 = add(stage, h('div', 'u4l8-root', `${T(d.t[0] + '=(' + d.r1 + ')^2')} ✓`), cx[0], y0 + 112); hide(root1);
    const root3 = add(stage, h('div', 'u4l8-root' + (d.r3 ? '' : ' bad'), d.r3 ? `${T(d.t[2].replace('+', '') + '=' + d.r3 + '^2')} ✓` : `${T(d.last)} is not a square ✗`), cx[2], y0 + 112); hide(root3);
    const midL = d.two ? add(stage, h('div', 'u4l8-root' + (d.ok ? '' : ' bad'), `${T('2\\times(' + d.r1 + ')\\times(' + d.r3 + ')')} ${T('=' + d.two.split('=')[1])} ${d.ok ? '✓' : '✗'}`), cx[1], y0 + 186) : null; if (midL) hide(midL);
    const vY = 296;
    const verdict = add(stage, h('div', 'u4l8-psv ' + (d.ok ? 'ok' : 'no'), d.ok ? `<b>Yes, a perfect square:</b> ${T(d.t.join('') + '=' + d.res)}` : `<b>Not a perfect square.</b> Use ${d.alt}.<br>${T(d.t.join('') + '=' + d.res)}`), W / 2, vY - (d.ok ? 0 : 16)); hide(verdict);
    const svg = svgEl('svg', { class: 'u4l8-svg' }); stage.appendChild(svg);
    const arrow = (x, y1, y2) => { const p = svgEl('path', { d: `M${x} ${y1} L${x} ${y2}`, class: 'u4l8-dar' }); svg.appendChild(p); hide(p); return p; };
    const a1 = arrow(cx[0], y0 + 74, y0 + 94), a3 = arrow(cx[2], y0 + 74, y0 + 94), a2 = arrow(cx[1], y0 + 74, y0 + 166);
    const steps = [{
      cap: `<b>1.</b> Is the first term a perfect square? ${T(d.t[0] + '=(' + d.r1 + ')^2')} ✓`,
      run: (c) => Promise.all([c.fadeIn(a1, 200), c.fadeIn(root1, 380)])
    }, {
      cap: d.r3 ? `<b>2.</b> Is the last term a perfect square? ${T(d.t[2].replace('+', '') + '=' + d.r3 + '^2')} ✓` : `<b>2.</b> Is the last term a perfect square? ${T(d.last)} is <b>not</b> ✗ So it can’t be a perfect square trinomial.`,
      run: async (c) => { await Promise.all([c.fadeIn(a3, 200), c.fadeIn(root3, 380)]); if (!d.r3) { boxes[2].classList.add('bad'); await c.shake(boxes[2]); } }
    }];
    if (d.two) {
      steps.push({
        cap: `<b>3.</b> Is the middle term ${T('2\\times')}(the roots)? ${T('2\\times(' + d.r1 + ')\\times(' + d.r3 + ')=' + d.two.split('=')[1])}` + (d.ok ? (d.neg ? `, and the middle is <b>minus</b> ${T(d.two.split('=')[1])} ✓` : ' ✓') : `, but ${d.why} ✗`),
        run: async (c) => { await Promise.all([c.fadeIn(a2, 200), c.fadeIn(midL, 380)]); boxes[1].classList.add(d.ok ? 'good' : 'bad'); if (!d.ok) await c.shake(boxes[1]); else await pulse(c, boxes[1], 1.06); }
      });
    }
    steps.push({
      cap: d.ok ? `All three ✓ It is a perfect square: ${T(d.t.join('') + '=' + d.res)}.` + (d.neg ? ' The minus in the middle goes inside the bracket.' : '') : `Not a perfect square, so use the next tool: ${d.alt}. ${T(d.t.join('') + '=' + d.res)}.`,
      run: (c) => c.pop(verdict, 400)
    });
    return steps;
  }
};

/* =====================================================================================
 * 4. GCF first, then look again: the hidden difference of squares
 * ===================================================================================== */
const HD = {
  w: { a: 2, c: 50, r: 5 },
  m: { a: 4, c: 64, r: 4, written: [2, 8] },
  t: { a: 3, c: 75, r: 5 },
  e3b: { a: 6, c: 24, r: 2 }
};
const hiddenDos = {
  title: 'GCF first, then look again',
  height: 370,
  choices: [{ v: 'w', label: T('2x^2-50') }, { v: 't', label: T('3x^2-75') }, { v: 'm', label: T('4x^2-64') }, { sep: 'Example 3 check:' }, { v: 'e3b', label: '(b)' }],
  intro: (k) => { const d = HD[k]; return `Factor ${T(`${d.a}x^2-${d.c}`)} completely.`; },
  make(stage, key, ex) {
    const W = ex.W, d = HD[key], src = `${d.a}x^2-${d.c}`, n = d.r * d.r, g = d.a / 1, inner = `x^2-${n}`;
    const x0 = 40, lh = 62;
    const L0 = add(stage, h('div', 'u4l8-hl', T(src)), x0, 20);
    const L1 = add(stage, h('div', 'u4l8-hl', T(`=${g}(${inner})`)), x0, 20 + lh); hide(L1);
    const L2 = add(stage, h('div', 'u4l8-hl ok', T(`=${g}(x-${d.r})(x+${d.r})`)), x0, 20 + 2 * lh); hide(L2);
    const tag0 = add(stage, h('div', 'u4l8-htag ' + (d.written ? 'mid' : 'no'), d.written ? `${T(`${d.a}x^2=(${d.written[0]}x)^2`)}, ${T(`${d.c}=${d.written[1]}^2`)}… but GCF first!` : `${T(`${d.a}x^2`)} and ${T(d.c)} are not perfect squares ✗`), 420, 26); hide(tag0);
    const tag1 = add(stage, h('div', 'u4l8-htag', `look again: ${T('x^2=(x)^2')}, ${T(`${n}=${d.r}^2`)} ✓`), 420, 20 + lh + 6); hide(tag1);
    const early = add(stage, h('div', 'u4l8-early', 'one step too early ✗'), 420, 20 + lh + 6); hide(early);
    const done = add(stage, h('div', 'u4l8-htag ok', 'fully factored ✓'), 420, 20 + 2 * lh + 6); hide(done);
    const chk = add(stage, h('div', 'u4l8-hl sm', `Check: ${T(`${g}(x-${d.r})(x+${d.r})=${g}(x^2+${d.r}x-${d.r}x-${n})=${g}(${inner})=${src}`)} ✓`), x0, 20 + 3 * lh + 14); hide(chk);
    const skip = d.written ? add(stage, box(h('div', 'u4l8-card', `<b>Skip the GCF?</b> ${T(`${src}=(${d.written[0]}x-${d.written[1]})(${d.written[0]}x+${d.written[1]})`)} is true, but each bracket still has a common factor 2: ${T(`2(x-${d.r})\\cdot2(x+${d.r})=${g}(x-${d.r})(x+${d.r})`)}. GCF first is easier.`), W - 80), x0, 20 + 4 * lh + 24) : null;
    if (skip) hide(skip);
    const steps = [{
      cap: d.written ? `As written, ${T(src)} already looks like square − square. But the checklist says <b>GCF first</b>.` : `Is ${T(src)} a difference of squares? ${T(`${d.a}x^2`)} and ${T(d.c)} are <b>not</b> perfect squares ✗ Don’t give up!`,
      run: (c) => c.fadeIn(tag0, 380)
    }, {
      cap: `<b>Step 1: GCF.</b> Both terms are divisible by ${g}: ${T(`${src}=${g}(${inner})`)}.`,
      run: (c) => c.fadeIn(L1, 380)
    }, {
      cap: `<b>Look again</b> inside the bracket: ${T('x^2=(x)^2')} and ${T(`${n}=${d.r}^2`)}, with a minus. A difference of squares!`,
      run: (c) => Promise.all([c.fadeIn(tag1, 380), pulse(c, L1, 1.04)])
    }, {
      cap: `Factor it: ${T(`${inner}=(x-${d.r})(x+${d.r})`)}, so ${T(`${src}=${g}(x-${d.r})(x+${d.r})`)}.`,
      run: (c) => Promise.all([c.fadeIn(L2, 380), c.fadeIn(done, 380, { delay: 200 })])
    }, {
      cap: `Stopping at ${T(`${g}(${inner})`)} is <b>one step too early</b> ✗ Step 3 catches it: ${T(inner)} can be factored again.`,
      run: async (c) => { await c.anim(tag1, [{ opacity: 1 }, { opacity: 0 }], 200); await stampIn(c, early); }
    }, {
      cap: `<b>Check by expanding:</b> ${T(`${g}(x-${d.r})(x+${d.r})=${g}(${inner})=${src}`)} ✓`,
      run: (c) => c.fadeIn(chk, 380)
    }];
    if (skip) steps.push({ cap: `What if you skip the GCF? ${T(`(${d.written[0]}x-${d.written[1]})(${d.written[0]}x+${d.written[1]})`)} is true, but <b>not finished</b>: both brackets still have a 2 in common.`, run: (c) => c.fadeIn(skip, 400) });
    return steps;
  }
};

/* =====================================================================================
 * 5. Finished or not? Three answers that are all equal to the question
 * ===================================================================================== */
const FN = {
  m: { q: '4x^2-64', c: [['4(x^2-16)', 0, `${T('x^2-16')} is a difference of squares. Factor again!`], ['(2x-8)(2x+8)', 0, `Each bracket still has a common factor 2.`], ['4(x-4)(x+4)', 1, `No factor can be factored again.`]] },
  g: { q: '2x^2+20x+42', c: [['(2x+14)(x+3)', 0, `${T('2x+14=2(x+7)')}: a GCF is hiding inside.`], ['2(x+7)(x+3)', 1, `No factor can be factored again.`], ['2(x^2+10x+21)', 0, `The trinomial still factors: ${T('(x+7)(x+3)')}.`]] },
  p: { q: '3x^2+6x+3', c: [['3(x^2+2x+1)', 0, `${T('x^2+2x+1')} is a perfect square: ${T('(x+1)^2')}.`], ['(3x+3)(x+1)', 0, `${T('3x+3=3(x+1)')}: a GCF is hiding inside.`], ['3(x+1)^2', 1, `No factor can be factored again.`]] },
  e2b: { q: '4x^2-8x-60', c: [['(4x+12)(x-5)', 0, `${T('4x+12=4(x+3)')}: a GCF is hiding inside.`], ['(2x-10)(2x+6)', 0, `Both brackets have a common factor 2.`], ['4(x-5)(x+3)', 1, `No factor can be factored again.`]] }
};
const finished = {
  title: 'Finished, or one step too early?',
  height: 380,
  choices: [{ v: 'm', label: T('4x^2-64') }, { v: 'g', label: T('2x^2+20x+42') }, { v: 'p', label: T('3x^2+6x+3') }, { sep: 'Example 2 check:' }, { v: 'e2b', label: '(b)' }],
  intro: (k) => `Three students factored ${T(FN[k].q)}. All three answers expand back to the question. Which ones are <b>finished</b>?`,
  make(stage, key, ex) {
    const W = ex.W, d = FN[key], cw = Math.floor((W - 80) / 3);
    add(stage, h('div', 'u4l8-fq', `Factor completely: ${T(d.q)}`), W / 2, 34);
    const cards = d.c.map(([f, ok, why], i) => {
      const el = add(stage, box(h('div', 'u4l8-fc', `<div class="u4l8-fch">Answer ${'ABC'[i]}</div><div class="u4l8-fcm">${T(f)}</div><div class="u4l8-fcw">${why}</div><div class="u4l8-fcs ${ok ? 'ok' : 'no'}">${ok ? 'FINISHED ✓' : 'NOT FINISHED ✗'}</div>`), cw, 250), 20 + i * (cw + 20), 84);
      fit(el.querySelector('.u4l8-fcm'), 32, cw - 24);
      const w = el.querySelector('.u4l8-fcw'), s = el.querySelector('.u4l8-fcs'); hide(w, s);
      return { el, w, s, ok, f, why };
    });
    const steps = [{
      cap: `All three are <b>true</b>: each one expands to ${T(d.q)}. Step 3 asks: can any factor be factored <b>again</b>?`,
      run: (c) => Promise.all(cards.map((k, i) => pulse(c, k.el, 1.03).then(() => c.sleep(i * 60))))
    }];
    cards.forEach((k, i) => steps.push({
      cap: `<b>Answer ${'ABC'[i]}:</b> ${T(k.f)}. ${k.ok ? `${k.why} <b>Finished</b> ✓` : `${k.why} <b>Not finished</b> ✗`}`,
      run: async (c) => { k.el.classList.add(k.ok ? 'ok' : 'no'); await c.fadeIn(k.w, 350); await stampIn(c, k.s); }
    }));
    void W;
    return steps;
  }
};

/* =====================================================================================
 * 5. Check by expanding (and a quick x = 1 check)
 * ===================================================================================== */
const EXP = {
  '2a': { f: '2(x+2)(x+5)', q: '2x^2+14x+20', L: [['FOIL the two brackets first.', '(x+2)(x+5)=x^2+5x+2x+10=x^2+7x+10'], ['Then multiply by the GCF 2.', '2(x^2+7x+10)=2x^2+14x+20']], fs: '2(3)(6)', fv: 36, qs: '2+14+20', qv: 36 },
  '2b': { f: '4(x-5)(x+3)', q: '4x^2-8x-60', L: [['FOIL the two brackets first.', '(x-5)(x+3)=x^2+3x-5x-15=x^2-2x-15'], ['Then multiply by the GCF 4.', '4(x^2-2x-15)=4x^2-8x-60']], fs: '4(-4)(4)', fv: -64, qs: '4-8-60', qv: -64 },
  '3a': { f: '4(x-4)(x+4)', q: '4x^2-64', L: [['FOIL the brackets: the middle terms cancel.', '(x-4)(x+4)=x^2+4x-4x-16=x^2-16'], ['Then multiply by the GCF 4.', '4(x^2-16)=4x^2-64']], fs: '4(-3)(5)', fv: -60, qs: '4-64', qv: -60 },
  '3b': { f: '6(x-2)(x+2)', q: '6x^2-24', L: [['FOIL the brackets: the middle terms cancel.', '(x-2)(x+2)=x^2+2x-2x-4=x^2-4'], ['Then multiply by the GCF 6.', '6(x^2-4)=6x^2-24']], fs: '6(-1)(3)', fv: -18, qs: '6-24', qv: -18 },
  '4a': { f: '(x-8)(x+8)', q: 'x^2-64', L: [['FOIL the two brackets.', '(x-8)(x+8)=x^2+8x-8x-64'], ['The middle terms cancel.', '=x^2-64']], fs: '(-7)(9)', fv: -63, qs: '1-64', qv: -63 },
  '4b': { f: '(x-8)(x+5)', q: 'x^2-3x-40', L: [['FOIL the two brackets.', '(x-8)(x+5)=x^2+5x-8x-40'], ['Collect the middle terms.', '=x^2-3x-40']], fs: '(-7)(6)', fv: -42, qs: '1-3-40', qv: -42 },
  '5a': { f: '(x+3)(3x+2)', q: '3x^2+11x+6', L: [['FOIL the two brackets.', '(x+3)(3x+2)=3x^2+2x+9x+6'], ['Collect the middle terms.', '=3x^2+11x+6']], fs: '(4)(5)', fv: 20, qs: '3+11+6', qv: 20 },
  '5b': { f: '(x-6)^2', q: 'x^2-12x+36', L: [['A square is two copies of the bracket.', '(x-6)^2=(x-6)(x-6)'], ['FOIL: the two middle terms are the same.', '=x^2-6x-6x+36=x^2-12x+36']], fs: '(-5)^2', fv: 25, qs: '1-12+36', qv: 25 }
};
const expand = {
  title: 'Run it backwards: expand the answer',
  height: 400,
  minW: 780,
  choices: Object.keys(EXP).map((k) => ({ v: k, label: 'Example ' + k[0] + '(' + k[1] + ')' })),
  intro: (k) => `Check the answer to Example ${k[0]}(${k[1]}): ${T(EXP[k].f)}. If it is right, expanding it must give back ${T(EXP[k].q)}.`,
  make(stage, key, ex) {
    const W = ex.W, d = EXP[key], cxL = Math.round(W * 0.26), cxR = Math.round(W * 0.74), bw = Math.min(340, W * 0.38);
    const bL = add(stage, box(h('div', 'u4l8-xb', `<div class="u4l8-xbh">Our answer (factored)</div><div class="u4l8-xbm">${T(d.f)}</div>`), bw), cxL - bw / 2, 22);
    const bR = add(stage, box(h('div', 'u4l8-xb q', `<div class="u4l8-xbh">The question (expanded)</div><div class="u4l8-xbm">${T(d.q)}</div>`), bw), cxR - bw / 2, 22);
    [bL, bR].forEach((b) => fit(b.querySelector('.u4l8-xbm'), 28));
    const svg = svgEl('svg', { class: 'u4l8-svg' }); stage.appendChild(svg);
    const x1 = cxL + bw / 2 + 8, x2 = cxR - bw / 2 - 8;
    const aE = polyArrow(svg, [[x1, 52], [x2, 52]], { cls: 'exp', head: 13 });
    const aF = polyArrow(svg, [[x2, 84], [x1, 84]], { cls: 'fac', head: 13 });
    aF.g.classList.add('lit'); aF.g.querySelector('.u4l8-arh').style.strokeDashoffset = 0;
    add(stage, h('div', 'u4l8-xal exp', 'expand'), (x1 + x2) / 2, 36);
    add(stage, h('div', 'u4l8-xal fac', 'factor'), (x1 + x2) / 2, 100);
    const lines = d.L.map((l, i) => { const e = add(stage, h('div', 'u4l8-xl', T(l[1])), 40, 140 + i * 56); hide(e); fit(e, 28, W - 80); return e; });
    const sub = add(stage, box(h('div', 'u4l8-xsub', `<div class="u4l8-xsh">Quick check: put ${T('x=1')} into both</div><div>Answer: ${T(d.fs + '=' + d.fv)} &nbsp;&nbsp; Question: ${T(d.qs + '=' + d.qv)} <b class="ok">${d.fv === d.qv ? '✓ same' : '✗'}</b></div>`), W - 60), 30, 290); hide(sub);
    const steps = [{ cap: `Factoring went from the question to the answer. To <b>check</b>, go the other way: <b>expand</b> ${T(d.f)}.`, run: (c) => Promise.all([aE.light(c, 600), pulse(c, bL, 1.04)]) }];
    d.L.forEach((l, i) => steps.push({ cap: l[0], run: (c) => c.fadeIn(lines[i], 380, { from: 'translateX(-14px)' }) }));
    steps.push({
      cap: `That is the question, ${T(d.q)}. <b>The factoring is right</b> ✓`,
      run: async (c) => { lines[lines.length - 1].classList.add('ok'); bR.classList.add('match'); await Promise.all([pulse(c, bR, 1.06), pulse(c, lines[lines.length - 1], 1.04)]); }
    });
    steps.push({ cap: `A fast extra check: put ${T('x=1')} into both forms. Both give ${T(d.fv)} ✓`, run: (c) => c.fadeIn(sub, 400) });
    void W;
    return steps;
  }
};

/* =====================================================================================
 * Warm-up: Pick the Right Tool
 * ===================================================================================== */
const JOBS = [
  { q: '5x+20', t: 'A', a: '5(x+4)' },
  { q: 'x^2+6x+9', t: 'C', a: '(x+3)^2' },
  { q: '2x^2+7x+3', t: 'E', a: '(2x+1)(x+3)' },
  { q: 'x^2-49', t: 'B', a: '(x-7)(x+7)' },
  { q: 'x^2+7x+10', t: 'D', a: '(x+2)(x+5)' },
  { q: '2x^2-50', t: 'A→B', a: '2(x-5)(x+5)', big: true }
];
function mountWarm() {
  const tb = document.getElementById('u4l8-tools');
  if (tb) tb.innerHTML = 'ABCDE'.split('').map((L) => { const t = TOOLS[L]; return `<div class="u4l8-tool ${t.k}"><div class="u4l8-tic">${ICON[L]}</div><span class="u4l8-tl">${L}</span><b>${t.name.replace('x²+bx+c', T('x^2+bx+c'))}</b><small>${t.clue.replace('x²', T('x^2')).replace('2×', T('2\\times'))}</small><em>${t.terms}</em></div>`; }).join('');
  const jb = document.getElementById('u4l8-jobs');
  if (jb) {
    jb.innerHTML = JOBS.map((j, i) => `<button type="button" class="u4l8-job${j.big ? ' big' : ''}" data-j="${i + 1}"><span class="u4l8-jn">Job ${i + 1}</span><span class="u4l8-jq">${T(j.q)}</span><span class="u4l8-ja">${j.t.split('→').map((L) => `<i class="${TOOLS[L].k}">${L}</i>`).join('→')}</span></button>`).join('');
    jb.addEventListener('click', (e) => { const b = e.target.closest('.u4l8-job'); if (b) b.classList.toggle('open'); });
  }
  const openJobs = (list, on) => list.forEach((n) => { const b = document.querySelector(`.u4l8-job[data-j="${n}"]`); if (b) b.classList.toggle('open', on); });
  document.querySelectorAll('[data-ink=warm] [data-jobs]').forEach((q) => {
    const btn = q.querySelector('[data-bk-toggle], [data-poll-reveal]'); if (!btn) return;
    const list = q.dataset.jobs.split(',');
    btn.addEventListener('click', () => setTimeout(() => openJobs(list, q.classList.contains('shown') || q.classList.contains('revealed')), 0));
  });
}

/* ---------- the lightning round: tap a row to reveal the route and the answer ---------- */
const LR = [
  { q: '7x+21', r: ['A'], a: '7(x+3)' },
  { q: 'x^2-100', r: ['B'], a: '(x-10)(x+10)' },
  { q: 'x^2+18x+81', r: ['C'], a: '(x+9)^2' },
  { q: 'x^2+x-12', r: ['D'], a: '(x+4)(x-3)' },
  { q: '2x^2+5x-3', r: ['E'], a: '(x+3)(2x-1)' },
  { q: '5x^2-20', r: ['A', 'B'], a: '5(x-2)(x+2)' },
  { q: '3x^2+21x+30', r: ['A', 'D'], a: '3(x+2)(x+5)' },
  { q: '2x^2+8x+8', r: ['A', 'C'], a: '2(x+2)^2' }
];
function mountLightning() {
  const host = document.getElementById('u4l8-lr'); if (!host) return;
  host.innerHTML = `<div class="u4l8-lrh no-ink"><span></span><span>Expression</span><span>Tools, in order</span><span>Fully factored <button class="pill small" type="button" data-lr-all>Reveal all</button></span></div>`;
  LR.forEach((r, i) => {
    const pills = r.r.map((L, k) => (k ? '<i class="u4l8-to">→</i>' : '') + `<span class="u4l8-rp ${TOOLS[L].k}"><b>${L}</b>${TOOLS[L].name.replace('x²+bx+c', T('x^2+bx+c'))}</span>`).join('');
    const row = h('button', 'u4l8-lrr', `<span class="u4l8-lrn">${i + 1}</span><span class="u4l8-lrq">${T(r.q)}</span><span class="u4l8-lrs"><span class="u4l8-wait">· · · tap · · ·</span><span class="u4l8-show">${pills}</span></span><span class="u4l8-lra"><span class="u4l8-show">${T(r.a)}</span></span>`);
    row.type = 'button';
    row.addEventListener('click', () => row.classList.toggle('shown'));
    host.appendChild(row);
  });
  host.querySelector('[data-lr-all]').addEventListener('click', () => host.querySelectorAll('.u4l8-lrr').forEach((r) => r.classList.add('shown')));
}

/* ================= wiring ================= */
function mountExplainers() {
  const defs = { toolMatch, flow, psqTest, hiddenDos, finished, expand };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}
mountWarm(); mountLightning(); mountExplainers();

/* ============ Stand Up Break! — name the tools, then factor completely, at the whiteboards ============ */
{
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const sg = (n) => (n < 0 ? '-' + Math.abs(n) : '+' + n);
  const mo = (c, v, first) => { const a = Math.abs(c), s = c < 0 ? '-' : first ? '' : '+'; return s + (v ? (a === 1 ? '' : a) + v : a); };
  const tri = (a, b, c, v) => mo(a, v + '^2', true) + mo(b, v) + mo(c, '');
  const br = (p, q, v) => '(' + mo(p, v, true) + sg(q) + ')';
  const K = (k, v) => (k === 1 ? '' : k === 'v' ? v : String(k));
  /* x² + bx + c = (x + p)(x + q), not a perfect square */
  function insp(r, v, hi) {
    let p, q; do { p = r.int(1, hi) * r.sign(); q = r.int(1, hi) * r.sign(); } while (p + q === 0 || p === q || Math.abs(p + q) < 1);
    [p, q] = [p, q].sort((x, y) => y - x);
    return { t: [1, p + q, p * q], tool: 'trinomial by inspection', work: ['\\text{product } ' + p * q + ',\\ \\text{sum } ' + (p + q) + ':\\ ' + p + ',\\ ' + q], F: br(1, p, v) + br(1, q, v) };
  }
  function dos(r, v, ahi, bhi, alo = 1) { let a, b; do { a = r.int(alo, ahi); b = r.int(1, bhi); } while (gcd(a, b) !== 1); return { t: [a * a, 0, -b * b], tool: 'difference of squares', work: [(a === 1 ? v : '(' + a + v + ')') + '^2-' + b + '^2'], F: br(a, -b, v) + br(a, b, v) }; }
  function psq(r, v, hi) { const k = r.int(1, hi) * r.sign(); return { t: [1, 2 * k, k * k], tool: 'perfect square trinomial', work: [Math.abs(k) * Math.abs(k) + '=' + Math.abs(k) + '^2,\\ 2(' + v + ')(' + Math.abs(k) + ')=' + 2 * Math.abs(k) + v], F: br(1, k, v) + '^2' }; }
  function dec(r, v) {
    for (;;) {
      const p = 1, R = r.int(2, 4), q = r.int(1, 6) * r.sign(), S = r.int(1, 5) * r.sign(), a = p * R, b = p * S + q * R, c = q * S;
      if (b === 0 || gcd(R, S) !== 1 || Math.abs(a * c) > 40) continue;
      const m = p * S, n = q * R;
      return { t: [a, b, c], tool: 'decomposition', work: ['ac=' + a * c + ',\\ \\text{pair } ' + n + ',\\ ' + m, tri(a, b, c, v) + '=' + mo(a, v + '^2', true) + mo(n, v) + mo(m, v) + mo(c, '') + '=' + R + v + br(1, q, v) + sg(S) + br(1, q, v)], F: br(1, q, v) + br(R, S, v) };
    }
  }
  /* the question and its worked answer; G = a common factor taken out first (a number, or 'v' for the variable) */
  function fac(core, v, G) {
    const [a, b, c] = core.t, inner = b === 0 ? mo(a, v + '^2', true) + mo(c, '') : tri(a, b, c, v);
    if (!G) return { q: inner, a: ['\\text{' + core.tool + '}', ...core.work, inner + '=' + core.F] };
    const g = G === 'v' ? v : String(G), mul = (k) => (G === 'v' ? k : k * G), pw = (e) => (G === 'v' ? (e + 1 === 1 ? v : v + '^' + (e + 1)) : (e === 0 ? '' : e === 1 ? v : v + '^2'));
    const terms = [[mul(a), pw(2)], [mul(b), pw(1)], [mul(c), pw(0)]].filter(([k]) => k !== 0);
    const Q = terms.map(([k, s], i) => mo(k, s, i === 0)).join('');
    return { q: Q, a: ['\\text{GCF first, then ' + core.tool + '}', '\\text{GCF } ' + g + ':\\ ' + Q + '=' + g + '(' + inner + ')', ...core.work, Q + '=' + g + core.F] };
  }
  void K;
  const LET = ['x', 'x', 'x', 'x', 'n', 'y', 'm'];
  standup('u4l8', {
    intro: 'Name the tools first (GCF? 2 or 3 terms? perfect square?), then factor completely. Can any factor be factored again?',
    levels: {
      BEG: (r) => { // one tool: x² − 49, x² + 7x + 10, x² + 6x + 9
        const v = r.pick(LET);
        return r.pick([() => fac(dos(r, v, 1, 12), v), () => fac(insp(r, v, 8), v), () => fac(psq(r, v, 9), v)])();
      },
      PRG: (r) => { // GCF, then one tool: 2x² − 50, 2x² + 14x + 20, 3x² + 6x + 3
        const v = r.pick(LET), G = r.int(2, 6);
        return r.pick([() => fac(dos(r, v, 1, 8), v, G), () => fac(insp(r, v, 6), v, G), () => fac(psq(r, v, 5), v, r.int(2, 4))])();
      },
      MAS: (r) => { // decomposition (with or without a GCF), (2x)² − 5², or a GCF that is the variable: x³ − 9x, x³ + 2x² − 8x
        const v = r.pick(LET);
        return r.pick([() => fac(dec(r, v), v), () => fac(dos(r, v, 4, 9, 2), v), () => fac(r.chance(0.5) ? dos(r, v, 1, 6) : insp(r, v, 5), v, 'v'), () => fac(dec(r, v), v, r.int(2, 3))])();
      }
    }
  });
}
