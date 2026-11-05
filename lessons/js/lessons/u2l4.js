/* Math 15 · Unit 2 · Lesson 4 — Combining Exponent Laws.
 * Warm-up (The Power Maze: tap right or down through a 3 × 3 maze, or play a named route; the running value shows) and
 * the explainers:
 *   which      (spot the clue, light up the law card; the last chip needs two laws),
 *   checklist  (the three-step checklist and the five law badges light up line by line; notes, Examples 1 and 2),
 *   maze       (the warm-up maze rewritten in powers of 2: each tile is an exponent law, the square tile a bracket),
 *   slips      (six classic mistakes: ring the wrong line, fix it, check both with x = 2),
 *   columns    (clear the bracket, then sort into colour-coded columns: numbers, then one base at a time; Example 3),
 *   race       (inside first vs outside first for a bracket holding a division: same answer, smaller numbers; the trap),
 *   checklist2 (the same step-by-step picture for Examples 4 and 5).
 * Pieces adapted from the Math 10C twin (u2l1 which-law cards, u2l2 chain and one-base-at-a-time columns). */
import { h, tex, add, mountExplainers, fmt } from '../blocks.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const T = (s) => tex(s);
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const tn = (n) => fmt(n).replace(/ /g, '\\,');
function rel(stage, el) {
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left - sr.left) / k - stage.clientLeft, y: (r.top - sr.top) / k - stage.clientTop, w: r.width / k, h: r.height / k };
}
/* a copy of `src` flies from one element to another inside the stage */
async function fly(c, stage, from, to, src, o = {}) {
  if (c.fast || !from || !to) return;
  c.check();
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1;
  const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
  const ax = (a.left + a.width / 2 - sr.left) / k, ay = (a.top + a.height / 2 - sr.top) / k;
  const bx = (b.left + b.width / 2 - sr.left) / k, by = (b.top + b.height / 2 - sr.top) / k;
  const g = add(stage, h('div', 'u2l4-fly', K(src)), ax, ay); if (o.fs) g.style.fontSize = o.fs + 'px';
  g.style.opacity = 0;
  try {
    await c.anim(g, [{ opacity: 1, transform: 'translate(-50%,-50%) scale(1.1)' }, { opacity: 1, transform: `translate(calc(-50% + ${(bx - ax) / 2}px), calc(-50% + ${(by - ay) / 2 - 24}px)) scale(1.2)`, offset: 0.5 }, { opacity: 0.9, transform: `translate(calc(-50% + ${bx - ax}px), calc(-50% + ${by - ay}px)) scale(1)` }], o.ms || 750, { delay: o.delay || 0 });
  } finally { g.remove(); }
}
function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }

/* ======================= 1. Which law? Spot the clue ======================= */
const LAWCARDS = [['Product', 'a^{m}\\times a^{n}=a^{m+n}'], ['Quotient', 'a^{m}\\div a^{n}=a^{m-n}'], ['Power of a Product', '(ab)^{n}=a^{n}b^{n}'], ['Power of a Quotient', '\\left(\\frac{a}{b}\\right)^{n}=\\frac{a^{n}}{b^{n}}'], ['Power of a Power', '\\left(a^{m}\\right)^{n}=a^{mn}']];
const WHICH = [
  { v: 'w1', ex: 'x^{5}\\times x^{2}', law: [0], clue: 'same base · multiplied', cap: `Same base, ${T('x')}, <b>multiplied</b>: the <b>Product Law</b>. Add the exponents.`, lines: [['=x^{5+2}', `Keep the base ${T('x')} and add the exponents.`], ['=x^{7}', '5 + 2 = 7.']] },
  { v: 'w2', ex: '\\dfrac{k^{8}}{k^{3}}', law: [1], clue: 'same base · divided', cap: `Same base, ${T('k')}, <b>divided</b>: the <b>Quotient Law</b>. Subtract the exponents.`, lines: [['=k^{8-3}', 'Top exponent minus bottom exponent.'], ['=k^{5}', '8 − 3 = 5.']] },
  { v: 'w3', ex: '\\left(a^{3}\\right)^{4}', law: [4], clue: 'a power, raised to a power', cap: 'A power in brackets, raised to another power: the <b>Power of a Power Law</b>. Multiply.', lines: [['=a^{3\\times4}', `Keep the base ${T('a')} and multiply the exponents.`], ['=a^{12}', `Four groups of three ${T('a')}’s make twelve.`]] },
  { v: 'w4', ex: '(3y)^{2}', law: [2], clue: 'a product in brackets', cap: `A <b>product</b> (3 times ${T('y')}) in brackets: the <b>Power of a Product Law</b>.`, lines: [['=3^{2}y^{2}', `Both the 3 and the ${T('y')} are inside, so each gets the 2.`], ['=9y^{2}', `${T('3^{2}=9')}.`]] },
  { v: 'w5', ex: '\\left(\\dfrac{m}{5}\\right)^{2}', law: [3], clue: 'a fraction in brackets', cap: 'A <b>fraction</b> in brackets: the <b>Power of a Quotient Law</b>.', lines: [['=\\dfrac{m^{2}}{5^{2}}', 'The top and the bottom each get the 2.'], ['=\\dfrac{m^{2}}{25}', `${T('5^{2}=25')}.`]] },
  { v: 'w6', ex: '(2x^{3})^{2}', law: [2, 4], clue: 'a product in brackets · a power inside', cap: 'Two clues! A product in brackets (<b>Power of a Product</b>), and one factor is already a power (<b>Power of a Power</b>). Two laws.', lines: [['=2^{2}\\left(x^{3}\\right)^{2}', `Power of a Product: the 2 and the ${T('x^{3}')} each get squared.`], ['=4x^{6}', `${T('2^{2}=4')}, and Power of a Power: ${T('3\\times2=6')}.`]] }
];
const which = {
  title: 'Spot the clue, then use the law',
  height: 420,
  minW: 880,
  choices: WHICH.map((s) => ({ v: s.v, label: T(s.ex.replace(/\\dfrac/g, '\\tfrac')) })),
  intro: (v) => `Which exponent law fits ${T(WHICH.find((s) => s.v === v).ex.replace(/\\dfrac/g, '\\tfrac'))}? Look at how the powers are put together.`,
  make(stage, v, ex) {
    const W = ex.W, s = WHICH.find((x) => x.v === v), CW = 320, cx0 = W - CW - 18, tall = /dfrac/.test(s.ex);
    const cards = LAWCARDS.map(([n, f], i) => { const e = add(stage, h('div', 'u2l4-wl', `<div class="u2l4-wln">${n}</div><div class="u2l4-wlf">${K(f)}</div>`), cx0, 14 + i * 79); e.style.width = CW + 'px'; return e; });
    const e0 = add(stage, h('div', 'u2l4-wexpr', K(s.ex)), 36, tall ? 14 : 26);
    const clue = add(stage, h('div', 'u2l4-tag amber', s.clue), 36, tall ? 140 : 104); hide(clue);
    const fl = s.lines.some((l) => /dfrac/.test(l[0])), lh = fl ? 96 : 76, ly = tall ? 196 : 166;
    const rows = s.lines.map(([src], i) => { const e = add(stage, h('div', 'u2l4-wline', K(src)), 36, ly + i * lh); hide(e); return e; });
    return [{
      cap: s.cap,
      run: (c) => { cards.forEach((e, i) => e.classList.toggle(s.law.includes(i) ? 'on' : 'off', true)); return Promise.all([c.fadeIn(clue, 350), ...s.law.map((i) => c.anim(cards[i], [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], 450))]); }
    }].concat(s.lines.map(([, cap], i) => ({ cap, run: (c) => c.fadeIn(rows[i], 400, { from: 'translateX(-12px)' }) })));
  }
};

/* ======================= the checklist, step by step (sections 1 and 3) ======================= */
const LAWS = [
  ['prod', 'Product', 'a^{m}\\times a^{n}=a^{m+n}'],
  ['quot', 'Quotient', 'a^{m}\\div a^{n}=a^{m-n}'],
  ['ppow', 'Power of a Power', '(a^{m})^{n}=a^{mn}'],
  ['pprod', 'Power of a Product', '(ab)^{n}=a^{n}b^{n}'],
  ['pquot', 'Power of a Quotient', '\\left(\\tfrac{a}{b}\\right)^{n}=\\tfrac{a^{n}}{b^{n}}']
];
const STEPS = ['Clear the brackets', 'Combine matching bases', 'Coefficients last'];
/* each line: [tex, laws lit, checklist step (1–3, 0 = none), note, caption] */
const CK = {
  nt: { t: '(2x^{3})^{2}\\times3x^{5}', lines: [
    ['=2^{2}x^{3\\times2}\\times3x^{5}', ['pprod', 'ppow'], 1, 'the 2 <b>and</b> the ' + T('x^{3}') + ' get squared', `<b>Step 1, clear the bracket.</b> The 2 and the ${T('x^{3}')} are both inside, so both get squared (Power of a Product). ${T('(x^{3})^{2}')}: multiply the exponents (Power of a Power).`],
    ['=4x^{6}\\times3x^{5}', [], 1, `${T('2^{2}=4')}, ${T('3\\times2=6')}`, `${T('2^{2}=4')} and ${T('3\\times2=6')}. The bracket is gone.`],
    ['=(4\\times3)\\,x^{6+5}', ['prod'], 2, 'same base ×: add', `<b>Step 2, combine matching bases.</b> ${T('x^{6}\\times x^{5}')}: same base multiplied, so add the exponents (Product Law).`],
    ['=12x^{11}', [], 3, `${T('4\\times3=12')}`, `<b>Step 3, coefficients last.</b> ${T('4\\times3=12')}. Answer: ${T('12x^{11}')}.`]] },
  e1: { t: '(3x^{2})^{3}\\times2x^{4}', lines: [
    ['=3^{3}x^{2\\times3}\\times2x^{4}', ['pprod', 'ppow'], 1, 'the 3 <b>and</b> the ' + T('x^{2}') + ' get cubed', `<b>Step 1, clear the bracket.</b> Every factor inside gets the 3: the 3 itself (Power of a Product) and ${T('x^{2}')}, where the exponents multiply (Power of a Power).`],
    ['=27x^{6}\\times2x^{4}', [], 1, `${T('3^{3}=27')}, ${T('2\\times3=6')}`, `${T('3^{3}=3\\times3\\times3=27')} and ${T('2\\times3=6')}. The 2 in ${T('2x^{4}')} is outside the bracket, so it is <b>not</b> cubed.`],
    ['=(27\\times2)\\,x^{6+4}', ['prod'], 2, 'same base ×: add', `<b>Step 2, combine matching bases.</b> ${T('x^{6}\\times x^{4}=x^{6+4}=x^{10}')} (Product Law).`],
    ['=54x^{10}', [], 3, `${T('27\\times2=54')}`, `<b>Step 3, coefficients last.</b> ${T('27\\times2=54')}. Answer: ${T('54x^{10}')}. (Example 1.)`]] },
  e2: { t: '\\dfrac{(3x^{4})^{2}}{x^{3}}', lines: [
    ['=\\dfrac{3^{2}x^{4\\times2}}{x^{3}}', ['pprod', 'ppow'], 1, 'the 3 <b>and</b> the ' + T('x^{4}') + ' get squared', `<b>Step 1, clear the bracket:</b> the 3 and the ${T('x^{4}')} both get squared.`],
    ['=\\dfrac{9x^{8}}{x^{3}}', [], 1, `${T('3^{2}=9')}, ${T('4\\times2=8')}`, `${T('3^{2}=9')} and ${T('4\\times2=8')}.`],
    ['=9x^{8-3}', ['quot'], 2, 'same base ÷: subtract', `<b>Step 2, combine matching bases.</b> Same base divided: subtract the exponents (Quotient Law).`],
    ['=9x^{5}', [], 3, 'no number to divide by', `<b>Step 3:</b> there is no number on the bottom, so the 9 stays. Answer: ${T('9x^{5}')}. (Example 2.)`]] },
  e4a: { t: '\\dfrac{(3x^{2})^{3}\\times x^{4}}{9x^{7}}', lines: [
    ['=\\dfrac{27x^{6}\\times x^{4}}{9x^{7}}', ['pprod', 'ppow'], 1, `${T('3^{3}=27')}, ${T('2\\times3=6')}`, `<b>Step 1, clear the bracket:</b> ${T('(3x^{2})^{3}=3^{3}x^{2\\times3}=27x^{6}')}. The 3 gets cubed too.`],
    ['=\\dfrac{27x^{10}}{9x^{7}}', ['prod'], 2, 'top: same base ×, add', `<b>Step 2, combine matching bases.</b> On top, ${T('x^{6}\\times x^{4}=x^{10}')} (Product Law).`],
    ['=(27\\div9)\\,x^{10-7}', ['quot'], 2, 'top ÷ bottom: subtract', `Still step 2: top over bottom, same base, so subtract the exponents (Quotient Law).`],
    ['=3x^{3}', [], 3, `${T('27\\div9=3')}`, `<b>Step 3, coefficients last:</b> ${T('27\\div9=3')}. Answer: ${T('3x^{3}')}.`]] },
  e4b: { t: '\\left(\\dfrac{6a^{4}b^{2}}{2a^{2}b}\\right)^{2}\\times a^{3}', lines: [
    ['=\\left(3a^{4-2}b^{2-1}\\right)^{2}\\times a^{3}', ['quot'], 1, 'a division inside: do it first', `<b>Step 1, the bracket.</b> It holds a division, so simplify <b>inside first</b>: ${T('6\\div2=3')}, and subtract the exponents (Quotient Law).`],
    ['=(3a^{2}b)^{2}\\times a^{3}', [], 1, `${T('4-2=2')}, ${T('2-1=1')}`, `${T('a^{4-2}=a^{2}')} and ${T('b^{2-1}=b^{1}=b')}. Much smaller inside.`],
    ['=9a^{4}b^{2}\\times a^{3}', ['pprod', 'ppow'], 1, 'now the outer power', `Now the outer power: <b>every</b> factor gets squared. ${T('3^{2}=9')}, ${T('(a^{2})^{2}=a^{4}')}, ${T('b^{2}')}.`],
    ['=9a^{4+3}b^{2}', ['prod'], 2, 'same base ×: add', `<b>Step 2:</b> ${T('a^{4}\\times a^{3}')}, so add the exponents. The ${T('b^{2}')} has no partner and stays.`],
    ['=9a^{7}b^{2}', [], 3, 'simplest form', `<b>Step 3:</b> the only number is 9. Answer: ${T('9a^{7}b^{2}')}.`]] },
  e5: { t: '\\left(\\dfrac{18x^{6}y^{3}}{6x^{2}y}\\right)^{2}\\times x^{3}', lines: [
    ['=\\left(3x^{6-2}y^{3-1}\\right)^{2}\\times x^{3}', ['quot'], 1, '<b>Quotient Law</b> handles the inside', `The <b>Quotient Law</b> handles the division inside the bracket: ${T('18\\div6=3')}, ${T('x^{6-2}')}, ${T('y^{3-1}')}.`],
    ['=(3x^{4}y^{2})^{2}\\times x^{3}', [], 1, `${T('6-2=4')}, ${T('3-1=2')}`, `Inside is now ${T('3x^{4}y^{2}')}.`],
    ['=9x^{8}y^{4}\\times x^{3}', ['pprod', 'ppow'], 1, '<b>Power of a Product</b> handles the outside', `The <b>Power of a Product Law</b> handles the power outside: the 3, the ${T('x^{4}')} and the ${T('y^{2}')} each get squared (multiply the exponents).`],
    ['=9x^{8+3}y^{4}', ['prod'], 2, 'same base ×: add', `<b>Step 2:</b> ${T('x^{8}\\times x^{3}')}: add the exponents.`],
    ['=9x^{11}y^{4}', [], 3, 'simplest form', `Answer: ${T('9x^{11}y^{4}')}. (Example 5.)`]] }
};
function mkChecklist(choices) {
  return {
    title: 'The checklist, one line at a time',
    height: 580,
    minW: 920,
    choices,
    intro: (k) => `Simplify ${T(CK[k].t)}. Watch which checklist step and which law each line uses.`,
    make(stage, key, ex) {
      const W = ex.W, d = CK[key], bw = (W - 24 - 4 * 8) / 5, bdg = {};
      LAWS.forEach(([k, name, f], i) => { const b = add(stage, h('div', 'u2l4-law u2l4-l' + k, `<b>${name}</b><span>${K(f)}</span>`), 12 + i * (bw + 8), 8); b.style.width = bw + 'px'; bdg[k] = b; });
      const steps = STEPS.map((s, i) => add(stage, h('div', 'u2l4-cstep', `<span class="u2l4-cnum">${i + 1}</span><span>${s}</span>`), 12, 92 + i * 74));
      const frac = /dfrac/.test(d.t) || d.lines.some((l) => /dfrac/.test(l[0]));
      const lx = 226, ly = 88, lh = frac ? 80 : 74, nx = Math.round(W * 0.62), nw = W - nx - 14;
      const all = [[d.t, [], 0, 'the question', '']].concat(d.lines);
      const rows = all.map(([t, , , note], i) => {
        const el = add(stage, h('div', 'u2l4-cl', K(t)), lx, ly + i * lh); el.style.height = (lh - 8) + 'px';
        const nn = add(stage, h('div', 'u2l4-cnote', `<div>${note}</div>`), nx, ly + i * lh); nn.style.width = nw + 'px'; nn.style.height = (lh - 14) + 'px';
        if (i) hide(el, nn); else nn.classList.add('start');
        return { el, nn };
      });
      const light = (c, ks, st) => {
        steps.forEach((e, i) => { e.classList.toggle('on', i + 1 === st); e.classList.toggle('done', i + 1 < st); });
        return Promise.all(LAWS.map(([k]) => { const on = ks.includes(k), b = bdg[k], was = b.classList.contains('on'); b.classList.toggle('on', on); return on && !was ? c.anim(b, [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], 380) : null; }));
      };
      return d.lines.map(([, laws, st, , cap], j) => ({
        cap,
        run: async (c) => {
          const r = rows[j + 1], last = j === d.lines.length - 1;
          rows.forEach((x) => x.el.classList.remove('now'));
          r.el.classList.add('now'); if (last) r.el.classList.add('final');
          await Promise.all([light(c, laws, st), c.fadeIn(r.el, 420, { from: 'translateY(-10px)' }), c.fadeIn(r.nn, 380, { delay: 200, from: 'translateX(10px)' })]);
        }
      }));
    }
  };
}
const checklist = mkChecklist([{ v: 'nt', label: T(CK.nt.t) }, { sep: 'Example check:' }, { v: 'e1', label: 'Example 1' }, { v: 'e2', label: 'Example 2' }]);
const checklist2 = mkChecklist([{ sep: 'Example 4 check:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }, { sep: 'Example 5 check:' }, { v: 'e5', label: 'Example 5' }]);

/* ======================= 1. Why brackets first? The maze in powers of 2 ======================= */
const TILE = { R4: ['\\times4', '\\times2^{2}', 'prod', 2], D2: ['\\div2', '\\div2^{1}', 'quot', 1], R2: ['\\times2', '\\times2^{1}', 'prod', 1], SQ: ['(\\ )^{2}', '(\\ )^{2}', 'ppow', 2] };
const MZ = {
  A: { name: 'Zig-zag A', arrows: '→ ↓ → ↓', tiles: ['R4', 'SQ', 'D2'], expr: '\\left(2^{2}\\times2^{2}\\right)^{2}\\div2^{1}' },
  B: { name: 'Zig-zag B', arrows: '↓ → ↓ →', tiles: ['D2', 'SQ', 'R4'], expr: '\\left(2^{2}\\div2^{1}\\right)^{2}\\times2^{2}' },
  big: { name: '→ ↓ ↓ →', arrows: '→ ↓ ↓ →', tiles: ['R4', 'SQ', 'R4'], expr: '\\left(2^{2}\\times2^{2}\\right)^{2}\\times2^{2}' },
  top: { name: 'Top road', arrows: '→ → ↓ ↓', tiles: ['R4', 'R2', 'D2'], expr: '2^{2}\\times2^{2}\\times2^{1}\\div2^{1}' }
};
function mzRun(d) { // the exponent after each tile, and how it got there
  let e = 2; const out = [];
  d.tiles.forEach((k) => {
    const [, , law, n] = TILE[k], e0 = e;
    if (law === 'prod') e += n; else if (law === 'quot') e -= n; else e *= n;
    out.push({ e0, e, law, n, how: law === 'prod' ? `${e0}+${n}` : law === 'quot' ? `${e0}-${n}` : `${e0}\\times${n}` });
  });
  return out;
}
const LAWNAME = { prod: 'Product: add', quot: 'Quotient: subtract', ppow: 'Power of a Power: multiply' };
const maze = {
  title: 'The maze in powers of 2',
  height: 440,
  minW: 900,
  choices: [{ v: 'A', label: 'Zig-zag A' }, { v: 'B', label: 'Zig-zag B' }, { v: 'big', label: '→ ↓ ↓ →' }, { v: 'top', label: 'Top road' }],
  intro: (v) => `${MZ[v].name} (${MZ[v].arrows}) in powers of 2. Watch the exponent.`,
  make(stage, v, ex) {
    const W = ex.W, d = MZ[v], R = mzRun(d), tw = 150, gap = (W - 40 - 4 * tw) / 3, tx = (i) => 20 + i * (tw + gap);
    const tiles = [['START', '4', '2^{2}']].concat(d.tiles.map((k) => [k === 'SQ' ? 'square it' : '', TILE[k][0], TILE[k][1]]));
    const els = tiles.map(([top, a, b], i) => {
      const e = add(stage, h('div', 'u2l4-mt' + (i ? '' : ' start') + (d.tiles[i - 1] === 'SQ' ? ' sq' : ''), `<div class="u2l4-mtt">${top}</div><div class="u2l4-mta">${K(a)}</div><div class="u2l4-mtb">${K(b)}</div>`), tx(i), 18);
      e.style.width = tw + 'px';
      if (i) { const ar = add(stage, h('div', 'u2l4-marr', '→'), tx(i) - gap / 2, 66); ar.style.translate = '-50% -50%'; }
      return e;
    });
    els.forEach((e) => e.querySelector('.u2l4-mtb').style.opacity = 0);
    const vals = [{ e: 2 }].concat(R).map((r, i) => {
      const e = add(stage, h('div', 'u2l4-mv', `${K(i ? `2^{${r.how}}=2^{${r.e}}` : '2^{2}')}<div class="u2l4-mvn">${K('=' + tn(Math.pow(2, r.e)))}</div>`), tx(i) + tw / 2, 146); e.style.translate = '-50% 0'; hide(e); return e;
    });
    const laws = R.map((r, i) => { const e = add(stage, h('div', 'u2l4-tag ' + r.law, LAWNAME[r.law]), tx(i + 1) + tw / 2, 236); e.style.translate = '-50% 0'; hide(e); return e; });
    const fin = R[R.length - 1].e, sqAt = d.tiles.indexOf('SQ');
    const exprEl = add(stage, h('div', 'u2l4-mexpr', K(`${d.expr}=2^{${fin}}=${tn(Math.pow(2, fin))}`)), W / 2, 296); exprEl.style.translate = '-50% 0'; hide(exprEl);
    const brk = sqAt >= 0 ? add(stage, h('div', 'u2l4-mbrk'), 0, 0) : null; if (brk) hide(brk);
    const note = add(stage, h('div', 'u2l4-mnote'), W / 2, 372); note.style.translate = '-50% 0'; hide(note);
    const other = v === 'A' ? ['Zig-zag B', 4, 16] : v === 'B' ? ['Zig-zag A', 7, 128] : null;
    note.innerHTML = sqAt >= 0 ? (other ? `${d.name} finishes on ${K(`2^{${fin}}`)}; ${other[0]} on ${K(`2^{${other[1]}}`)}. &nbsp;${K(`2^{${Math.max(fin, other[1])}}\\div2^{${Math.min(fin, other[1])}}=2^{3}=8`)} times as big.` : `The square tile squared <b>both</b> 2s before it: ${K('(2^{2}\\times2^{2})^{2}=2^{8}')}.`) : 'No square tile: only × and ÷, so the order of the tiles doesn’t matter.';
    const steps = [{ cap: `Write every number as a power of 2: ${T('4=2^{2}')}, ${T('\\times4=\\times2^{2}')}, ${T('\\times2=\\times2^{1}')}, ${T('\\div2=\\div2^{1}')}. Start at ${T('2^{2}')}.`,
      run: (c) => Promise.all([...els.map((e, i) => c.fadeIn(e.querySelector('.u2l4-mtb'), 350, { delay: i * 120 })), c.pop(vals[0], 380, { delay: 300 })]) }];
    R.forEach((r, i) => steps.push({
      cap: r.law === 'prod' ? `${T(TILE[d.tiles[i]][1])}: same base multiplied, so <b>add</b> the exponents: ${T(`${r.e0}+${r.n}=${r.e}`)}.`
        : r.law === 'quot' ? `${T('\\div2^{1}')}: same base divided, so <b>subtract</b>: ${T(`${r.e0}-1=${r.e}`)}.`
          : `Square it: ${T(`\\left(2^{${r.e0}}\\right)^{2}`)} is a power of a power, so <b>multiply</b>: ${T(`${r.e0}\\times2=${r.e}`)}. The square hits <b>everything</b> so far.`,
      run: (c) => { els.forEach((e, k) => e.classList.toggle('now', k === i + 1)); return Promise.all([c.pop(vals[i + 1], 400), c.fadeIn(laws[i], 350, { delay: 200 })]); }
    }));
    steps.push({ cap: sqAt >= 0 ? `As one expression, the square tile is a <b>bracket</b> with an outer exponent around everything before it: ${T(`${d.expr}=2^{${fin}}`)}.` : `As one expression: ${T(`${d.expr}=2^{${fin}}=16`)}. No brackets needed.`,
      run: async (c) => {
        els.forEach((e) => e.classList.remove('now'));
        await c.fadeIn(exprEl, 400);
        if (brk) { const r = rel(stage, exprEl.querySelector('.mopen') || exprEl), r2 = [...exprEl.querySelectorAll('.mclose')].map((x) => rel(stage, x))[0]; if (r2) { at(brk, r.x - 6, r.y - 12); brk.style.width = (r2.x + r2.w - r.x + 32) + 'px'; brk.style.height = (r.h + 18) + 'px'; await c.pop(brk, 400); } }
      } });
    steps.push({ cap: sqAt >= 0 ? (other ? `Same tiles, different order, different finish: ${fmt(Math.pow(2, fin))} vs ${other[2]}. Once a square (a bracket) is involved, <b>order matters</b>. That’s why the checklist clears brackets <b>first</b>.` : `${fmt(Math.pow(2, fin))} is the biggest finish: both ×4 tiles help, and the square doubles the exponent in the middle. Order matters once a square is involved.`)
      : 'Multiplying and dividing can go in any order (Top road = Bottom road = 16). Only a <b>square</b> tile makes the order matter.', run: (c) => c.fadeIn(note, 400) });
    return steps;
  }
};

/* ======================= 1. Common slips ======================= */
const SLIPS = [
  { v: 'coef', who: 'Ava', q: '(4x^{3})^{2}', bad: '4x^{6}', good: ['4^{2}x^{6}', '16x^{6}'], f: (x) => (4 * x ** 3) ** 2, fb: (x) => 4 * x ** 6, sub: '(4\\times8)^{2}=32^{2}', badS: '4\\times64', law: 'Power of a Product', why: 'The 4 is <b>inside</b> the brackets, so it gets squared too: ' + T('4^{2}=16') + '.' },
  { v: 'pp', who: 'Ben', q: '(x^{4})^{3}', bad: 'x^{7}', good: ['x^{4\\times3}', 'x^{12}'], f: (x) => (x ** 4) ** 3, fb: (x) => x ** 7, sub: '16^{3}', badS: '2^{7}', law: 'Power of a Power', why: 'A power of a power <b>multiplies</b> the exponents. Adding is for the Product Law.' },
  { v: 'prod', who: 'Cy', q: 'x^{4}\\times x^{3}', bad: 'x^{12}', good: ['x^{4+3}', 'x^{7}'], f: (x) => x ** 7, fb: (x) => x ** 12, sub: '16\\times8', badS: '2^{12}', law: 'Product', why: 'Multiplying powers with the same base <b>adds</b> the exponents. Multiplying them is for a power of a power.' },
  { v: 'quot', who: 'Dee', q: '\\dfrac{x^{8}}{x^{2}}', bad: 'x^{4}', good: ['x^{8-2}', 'x^{6}'], f: (x) => x ** 6, fb: (x) => x ** 4, sub: '256\\div4', badS: '2^{4}', law: 'Quotient', why: 'Dividing powers <b>subtracts</b> the exponents. It does not divide them.' },
  { v: 'out', who: 'Eli', q: '3(2x)^{2}', bad: '36x^{2}', good: ['3\\times2^{2}x^{2}', '12x^{2}'], f: (x) => 3 * (2 * x) ** 2, fb: (x) => 36 * x * x, sub: '3\\times4^{2}=3\\times16', badS: '36\\times4', law: 'Power of a Product', why: `The 3 is <b>outside</b> the brackets, so it is <b>not</b> squared. Only the 2 and the ${T('x')} are.` },
  { v: 'base', who: 'Fay', q: '2^{3}\\times2^{4}', bad: '4^{7}', good: ['2^{3+4}', '2^{7}'], f: () => 128, fb: () => 16384, sub: '8\\times16', badS: '', law: 'Product', why: 'Keep the <b>base</b>. Only the exponents change: the answer is still a power of 2.' }
];
const slips = {
  title: 'Spot the mistake',
  height: 420,
  minW: 880,
  choices: SLIPS.map((s) => ({ v: s.v, label: T(s.q.replace(/\\dfrac/g, '\\tfrac')) })),
  intro: (v) => { const s = SLIPS.find((x) => x.v === v); return `${s.who} simplified ${T(s.q.replace(/\\dfrac/g, '\\tfrac'))}. Is it right?`; },
  make(stage, v, ex) {
    const W = ex.W, s = SLIPS.find((x) => x.v === v), num = v === 'base', x = 2;
    const card = add(stage, h('div', 'u2l4-board', `<div class="u2l4-bh">${s.who}’s work</div>`), 24, 20); card.style.width = '440px'; card.style.height = '360px';
    const q = add(stage, h('div', 'u2l4-bq', K(s.q)), 50, 80);
    const dy = /dfrac/.test(s.q) ? 26 : 0;
    const bad = add(stage, h('div', 'u2l4-bq bad', K('=' + s.bad)), 50, 170 + dy); hide(bad);
    const ring = add(stage, h('div', 'u2l4-ring'), 40, 160 + dy); ring.style.width = '230px'; ring.style.height = '76px'; hide(ring);
    const xs = add(stage, h('div', 'u2l4-stamp no', '✗'), 280, 176 + dy); hide(xs);
    const fix = add(stage, h('div', 'u2l4-bq good', K('=' + s.good.join('='))), 50, 270 + dy); hide(fix);
    const ok = add(stage, h('div', 'u2l4-stamp ok', '✓'), 400, 278 + dy); hide(ok);
    const lawT = add(stage, h('div', 'u2l4-tag blue', s.law + (/Law$/.test(s.law) ? '' : ' Law')), 50, 336 + dy / 2); hide(lawT);
    // check with a number
    const CX = 500, cw = W - CX - 20;
    const chk = add(stage, h('div', 'u2l4-chk', `<div class="u2l4-chh">${num ? 'Check: work it out' : 'Check with ' + K('x=2')}</div>
      <div class="u2l4-chr">${K(s.q)} ${K('=' + s.sub + '=\\boldsymbol{' + tn(s.f(x)) + '}')}</div>
      <div class="u2l4-chr bad">${K(s.bad)} ${K((s.badS ? '=' + s.badS : '') + '=\\boldsymbol{' + tn(s.fb(x)) + '}')} <b>✗</b></div>
      <div class="u2l4-chr good">${K(s.good[s.good.length - 1])} ${K('=\\boldsymbol{' + tn(s.f(x)) + '}')} <b>✓</b></div>`), CX, 20);
    chk.style.width = cw + 'px'; hide(chk);
    const rowsC = [...chk.querySelectorAll('.u2l4-chr')]; hide(...rowsC);
    return [
      { cap: `${s.who} wrote ${T(s.q + '=' + s.bad)}. Look closely. <b>What went wrong?</b>`, run: (c) => c.fadeIn(bad, 400) },
      { cap: `${s.why}`, run: (c) => Promise.all([c.pop(ring, 400), stampIn(c, xs)]) },
      { cap: `The fix: ${T(s.q + '=' + s.good.join('='))}. (${s.law}${/Law$/.test(s.law) ? '' : ' Law'}.)`, run: async (c) => { await c.fadeIn(fix, 400); await Promise.all([stampIn(c, ok), c.fadeIn(lawT, 300)]); } },
      { cap: num ? `Work out each one: the question is ${fmt(s.f(x))}, ${s.who}’s answer is ${fmt(s.fb(x))}. Not equal, so it can’t be right.` : `Not sure? Put in ${T('x=2')}. The question gives ${fmt(s.f(x))}; ${s.who}’s answer gives ${fmt(s.fb(x))}. Only the fixed answer matches.`,
        run: (c) => Promise.all([c.fadeIn(chk, 300), ...rowsC.map((e, i) => c.fadeIn(e, 350, { delay: 200 + i * 300 }))]) }
    ];
  }
};

/* ======================= 2. Clear the bracket, then one base at a time ======================= */
const NUMC = '#c27a0e', VC = ['#2b55a0', '#7b4fc4'];
const colOf = (k) => (k === 0 ? NUMC : VC[(k - 1) % VC.length]);
const tc = (col, s) => `\\textcolor{${col}}{${s}}`;
const powT = (v, e) => (e === 1 ? v : `${v}^{${e}}`);
const COLS = {
  nt: { q: '(3m^{2}n)^{2}\\times2mn^{4}', e: (P) => `${P(0, '9')}${P(1, 'm^{4}')}${P(2, 'n^{2}')}\\times${P(0, '2')}${P(1, 'm')}${P(2, 'n^{4}')}`, how: `${T('3^{2}=9')}, ${T('(m^{2})^{2}=m^{4}')}, ${T('n^{2}')}`, vars: ['m', 'n'], top: [{ c: 9, v: { m: 4, n: 2 } }, { c: 2, v: { m: 1, n: 4 } }], bot: [] },
  a: { q: '(2a^{3}b)^{2}\\times3a^{2}b^{4}', e: (P) => `${P(0, '4')}${P(1, 'a^{6}')}${P(2, 'b^{2}')}\\times${P(0, '3')}${P(1, 'a^{2}')}${P(2, 'b^{4}')}`, how: `${T('2^{2}=4')}, ${T('(a^{3})^{2}=a^{6}')}, ${T('b^{2}')}`, vars: ['a', 'b'], top: [{ c: 4, v: { a: 6, b: 2 } }, { c: 3, v: { a: 2, b: 4 } }], bot: [] },
  b: { q: '\\dfrac{(4x^{2}y^{3})^{2}}{2xy^{2}}', e: (P) => `\\dfrac{${P(0, '16')}${P(1, 'x^{4}')}${P(2, 'y^{6}')}}{${P(0, '2')}${P(1, 'x')}${P(2, 'y^{2}')}}`, how: `${T('4^{2}=16')}, ${T('(x^{2})^{2}=x^{4}')}, ${T('(y^{3})^{2}=y^{6}')}`, vars: ['x', 'y'], top: [{ c: 16, v: { x: 4, y: 6 } }], bot: [{ c: 2, v: { x: 1, y: 2 } }] },
  c: { q: '(x^{2}y^{3})^{3}\\times(xy^{2})^{2}', e: (P) => `${P(1, 'x^{6}')}${P(2, 'y^{9}')}\\times ${P(1, 'x^{2}')}${P(2, 'y^{4}')}`, how: `${T('(x^{2}y^{3})^{3}=x^{6}y^{9}')} and ${T('(xy^{2})^{2}=x^{2}y^{4}')}`, two: true, vars: ['x', 'y'], top: [{ c: null, v: { x: 6, y: 9 } }, { c: null, v: { x: 2, y: 4 } }], bot: [] }
};
function colModel(d) {
  const hasNum = [...d.top, ...d.bot].some((t) => t.c != null), cv = (t) => (t.c == null ? 1 : t.c);
  const pTop = d.top.reduce((p, t) => p * cv(t), 1), pBot = d.bot.reduce((p, t) => p * cv(t), 1), r = pTop / pBot;
  const cols = [];
  if (hasNum) {
    const A = d.bot.length ? `\\dfrac{${d.top.map(cv).join('\\times')}}{${d.bot.map(cv).join('\\times')}}` : d.top.map(cv).join('\\times');
    cols.push({ k: 0, head: 'Numbers', A, B: `=${r}`, C: String(r), law: d.bot.length ? 'divide' : 'multiply', cap: `<b>Numbers:</b> ${T(d.bot.length ? `${pTop}\\div${pBot}=${r}` : `${d.top.map(cv).join('\\times')}=${r}`)}.` });
  }
  d.vars.forEach((v, i) => {
    const ups = d.top.map((t) => t.v[v]).filter((x) => x != null), dns = d.bot.map((t) => t.v[v]).filter((x) => x != null);
    const e = ups.reduce((s, x) => s + x, 0) - dns.reduce((s, x) => s + x, 0);
    const prodT = (l) => l.map((x) => powT(v, x)).join('\\cdot ');
    const A = dns.length ? `\\dfrac{${prodT(ups)}}{${prodT(dns)}}` : prodT(ups), expr = ups.join('+') + dns.map((x) => '-' + x).join('');
    const one = [...ups, ...dns].includes(1) ? ` (${T(v)} by itself means ${T(v + '^{1}')}.)` : '';
    const law = dns.length ? 'Quotient: subtract' : 'Product: add';
    const cap = dns.length ? `<b>${T(v)}:</b> Quotient Law, <b>subtract</b> the exponents: ${T(`${expr}=${e}`)}.${one}` : `<b>${T(v)}:</b> Product Law, <b>add</b> the exponents: ${T(`${expr}=${e}`)}.${one}`;
    cols.push({ k: i + 1, head: v, A, B: `=${v}^{${expr}}`, C: powT(v, e), cap, law, e, v });
  });
  const ansT = (hasNum && r !== 1 ? String(r) : '') + cols.filter((c) => c.k > 0).map((c) => powT(c.v, c.e)).join('');
  return { cols, ansT, hasNum };
}
const columns = {
  title: 'Clear the bracket, then one base at a time',
  height: 504,
  minW: 900,
  choices: [{ v: 'nt', label: T(COLS.nt.q) }, { sep: 'Example 3 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  intro: (k) => `Simplify ${T(COLS[k].q)}: clear the bracket, then sort the pieces into <b>columns</b>.`,
  make(stage, key, ex) {
    const W = ex.W, d = COLS[key], M = colModel(d), frac = /dfrac/.test(d.q);
    const P = (k, s) => `\\htmlClass{u2l4-p u2l4-pk${M.hasNum ? k : k - 1}}{${tc(colOf(k), s)}}`;
    const q = add(stage, h('div', 'u2l4-oq', K(d.q)), W / 2, frac ? 2 : 8); q.style.translate = '-50% 0';
    const cl = add(stage, h('div', 'u2l4-oh', K('=' + d.e(P))), W / 2, frac ? 82 : 62); cl.style.translate = '-50% 0'; hide(cl);
    const N = M.cols.length, gap = 16, cw = Math.min(280, (W - 40 - gap * (N - 1)) / N), x0 = (W - (cw * N + gap * (N - 1))) / 2, cy = frac ? 182 : 140, chh = frac ? 240 : 256;
    const ry = frac ? [60, 120, 178] : [54, 122, 190];
    const cols = M.cols.map((col, i) => {
      const box = add(stage, h('div', 'u2l4-col'), x0 + i * (cw + gap), cy); box.style.width = cw + 'px'; box.style.height = chh + 'px'; box.style.setProperty('--cc', colOf(col.k));
      box.innerHTML = `<div class="u2l4-colh">${col.k ? K(col.head) : col.head}</div><div class="u2l4-coll">${col.law}</div>`;
      const mkR = (src, cls, y) => { const e = h('div', 'u2l4-colr ' + cls, K(src)); e.style.top = y + 'px'; box.appendChild(e); hide(e); return e; };
      const rA = mkR(tc(colOf(col.k), col.A), 'ra', ry[0]), rB = mkR(col.B, 'rb', ry[1]), rC = mkR(col.C, 'rc', ry[2]);
      hide(box);
      return { col, box, rA, rB, rC, law: box.querySelector('.u2l4-coll') };
    });
    cols.forEach((x) => hide(x.law));
    const ans = add(stage, h('div', 'u2l4-oans', K(`=${M.ansT}`)), W / 2, cy + chh + 8); ans.style.translate = '-50% 0'; hide(ans);
    const steps = [{
      cap: `<b>Step 1, clear the ${d.two ? 'brackets' : 'bracket'}.</b> Every factor inside gets the outer power: ${d.how}.`,
      run: (c) => c.fadeIn(cl, 450, { from: 'translateY(-14px)' })
    }, {
      cap: `<b>Step 2:</b> sort every piece into its column: ${M.hasNum ? 'the <b>numbers</b> in one, ' : 'no numbers are written, so just '}${d.vars.map((v) => T(v)).join(' and ')} each in their own. The colours match.`,
      run: async (c) => {
        await Promise.all(cols.map((x, i) => c.fadeIn(x.box, 300, { delay: i * 100 })));
        const jobs = [];
        cols.forEach((x, i) => [...cl.querySelectorAll('.u2l4-pk' + i)].forEach((p, j) => jobs.push(fly(c, stage, p, x.rA, tc(colOf(x.col.k), p.textContent.replace(/−/g, '-')), { fs: 28, delay: j * 140 + i * 90 }))));
        await Promise.all(jobs);
        await Promise.all(cols.map((x) => c.fadeIn(x.rA, 300)));
      }
    }];
    cols.forEach((x) => steps.push({
      cap: x.col.cap,
      run: async (c) => { cols.forEach((y) => y.box.classList.toggle('on', y === x)); await Promise.all([c.fadeIn(x.law, 250), c.fadeIn(x.rB, 350, { delay: 100 }), c.pop(x.rC, 420, { delay: 450 })]); }
    }));
    steps.push({
      cap: `Put the columns back together: ${T(d.q + '=' + M.ansT)}.${key !== 'nt' ? ` (Example 3(${key}).)` : ''}`,
      run: async (c) => { cols.forEach((y) => y.box.classList.remove('on')); await Promise.all([...cols.map((x, i) => fly(c, stage, x.rC, ans, x.col.C, { fs: 30, delay: i * 120 })), c.pop(ans, 450, { delay: 500 })]); }
    });
    return steps;
  }
};

/* ======================= 3. Inside first, or outside first? ======================= */
const RACE = {
  nt: { q: '\\left(\\dfrac{10x^{6}}{5x^{2}}\\right)^{2}', L: ['=\\left(2x^{4}\\right)^{2}', '=4x^{8}'], Lc: [`${T('10\\div5=2')}, ${T('x^{6-2}=x^{4}')}`, `${T('2^{2}=4')}, ${T('4\\times2=8')}`],
    R: ['=\\dfrac{10^{2}x^{12}}{5^{2}x^{4}}', '=\\dfrac{100x^{12}}{25x^{4}}', '=4x^{8}'], ans: '4x^{8}', big: '100\\div25', trap: '\\dfrac{10x^{12}}{5x^{4}}=2x^{8}', trapAns: '2x^{8}' },
  e4b: { q: '\\left(\\dfrac{6a^{4}b^{2}}{2a^{2}b}\\right)^{2}', L: ['=\\left(3a^{2}b\\right)^{2}', '=9a^{4}b^{2}'], Lc: [`${T('6\\div2=3')}, ${T('a^{4-2}')}, ${T('b^{2-1}')}`, `${T('3^{2}=9')}, ${T('a^{4}')}, ${T('b^{2}')}`],
    R: ['=\\dfrac{6^{2}a^{8}b^{4}}{2^{2}a^{4}b^{2}}', '=\\dfrac{36a^{8}b^{4}}{4a^{4}b^{2}}', '=9a^{4}b^{2}'], ans: '9a^{4}b^{2}', big: '36\\div4', trap: '\\dfrac{6a^{8}b^{4}}{2a^{4}b^{2}}=3a^{4}b^{2}', trapAns: '3a^{4}b^{2}' },
  e5: { q: '\\left(\\dfrac{18x^{6}y^{3}}{6x^{2}y}\\right)^{2}', L: ['=\\left(3x^{4}y^{2}\\right)^{2}', '=9x^{8}y^{4}'], Lc: [`${T('18\\div6=3')}, ${T('x^{6-2}')}, ${T('y^{3-1}')}`, `${T('3^{2}=9')}, ${T('x^{8}')}, ${T('y^{4}')}`],
    R: ['=\\dfrac{18^{2}x^{12}y^{6}}{6^{2}x^{4}y^{2}}', '=\\dfrac{324x^{12}y^{6}}{36x^{4}y^{2}}', '=9x^{8}y^{4}'], ans: '9x^{8}y^{4}', big: '324\\div36', trap: '\\dfrac{18x^{12}y^{6}}{6x^{4}y^{2}}=3x^{8}y^{4}', trapAns: '3x^{8}y^{4}' }
};
const race = {
  title: 'Inside first, or outside first?',
  height: 504,
  minW: 900,
  choices: [{ v: 'nt', label: T('\\left(\\tfrac{10x^{6}}{5x^{2}}\\right)^{2}') }, { sep: 'Example 4(b), the bracket:' }, { v: 'e4b', label: T('\\left(\\tfrac{6a^{4}b^{2}}{2a^{2}b}\\right)^{2}') }, { sep: 'Example 5, the bracket:' }, { v: 'e5', label: T('\\left(\\tfrac{18x^{6}y^{3}}{6x^{2}y}\\right)^{2}') }],
  intro: (k) => `Two ways to start ${T(RACE[k].q)}. Do they agree? Which is easier?`,
  make(stage, key, ex) {
    const W = ex.W, d = RACE[key], cw = (W - 56) / 2, X1 = 20, X2 = 36 + cw;
    const q = add(stage, h('div', 'u2l4-rq', K(d.q)), W / 2, 4); q.style.translate = '-50% 0';
    const col = (x, head, cls) => { const e = add(stage, h('div', 'u2l4-rcol ' + cls, `<div class="u2l4-rh">${head}</div>`), x, 108); e.style.width = cw + 'px'; e.style.height = '318px'; hide(e); return e; };
    const cL = col(X1, 'Inside first <span>(Quotient Law, then the power)</span>', 'in'), cR = col(X2, 'Outside first <span>(the power, then the Quotient Law)</span>', 'out');
    const lines = (x, arr) => arr.map((src, i) => { const e = add(stage, h('div', 'u2l4-rl', K(src)), x + 22, 162 + i * 76); hide(e); return e; });
    const L = lines(X1, d.L), R = lines(X2, d.R);
    const s1 = add(stage, h('div', 'u2l4-stamp ok', '✓'), X1 + cw - 64, 162 + 76 + 10), s2 = add(stage, h('div', 'u2l4-stamp ok', '✓'), X2 + cw - 64, 162 + 2 * 76 + 10); hide(s1, s2);
    const small = add(stage, h('div', 'u2l4-tag green', 'small numbers'), X1 + 22, 386), big = add(stage, h('div', 'u2l4-tag red', 'big numbers: ' + K(d.big)), X2 + 22, 386); hide(small, big);
    const trap = add(stage, h('div', 'u2l4-trap', `<b>The trap:</b> outside first, but forgetting to square the numbers: ${K(d.trap)} <b class="u2l4-red">✗</b>`), 20, 440); trap.style.width = (W - 40) + 'px'; hide(trap);
    return [
      { cap: `<b>Inside first</b> (left): divide inside the bracket, then apply the power. <b>Outside first</b> (right): apply the power to everything, then divide.`, run: (c) => Promise.all([c.fadeIn(cL, 350), c.fadeIn(cR, 350, { delay: 150 })]) },
      { cap: `Inside first: the Quotient Law inside the bracket. ${d.Lc[0]}.`, run: (c) => c.fadeIn(L[0], 400, { from: 'translateX(-10px)' }) },
      { cap: `Then the outer power, every factor: ${d.Lc[1]}. Done: ${T(d.ans)}.`, run: (c) => Promise.all([c.fadeIn(L[1], 400, { from: 'translateX(-10px)' }), stampIn(c, s1)]) },
      { cap: `Outside first: the power goes to <b>every</b> factor, top and bottom. The numbers get squared too.`, run: (c) => c.fadeIn(R[0], 400, { from: 'translateX(-10px)' }) },
      { cap: `Work out the squares, then divide: ${T(d.big)}, and subtract the exponents. Same answer, ${T(d.ans)}, but with bigger numbers.`, run: (c) => Promise.all([c.fadeIn(R[1], 400), c.fadeIn(R[2], 400, { delay: 450 }), stampIn(c, s2), c.fadeIn(big, 300, { delay: 600 })]) },
      { cap: `Both are right. Inside first keeps the numbers <b>small</b>, so it is the easier way.`, run: (c) => c.fadeIn(small, 350) },
      { cap: `The most common slip: going outside first and forgetting to square the numbers gives ${T(d.trapAns)}. Wrong! Inside first avoids it.`, run: (c) => c.fadeIn(trap, 400) }
    ];
  }
};

/* ======================= warm-up: The Power Maze ======================= */
const GRID = [['START', '\\times4', '\\times2'], ['\\div2', 'SQ', '\\div2'], ['\\times2', '\\times4', 'FINISH']];
const OPS = { '\\times4': (v) => v * 4, '\\times2': (v) => v * 2, '\\div2': (v) => v / 2, SQ: (v) => v * v };
const OPTXT = { '\\times4': '× 4', '\\times2': '× 2', '\\div2': '÷ 2', SQ: 'square' };
function mountMaze() {
  const host = document.getElementById('u2l4-maze'), run = document.getElementById('u2l4-run'); if (!host) return;
  const cells = [];
  GRID.forEach((row, r) => row.forEach((op, c) => {
    const b = h('button', 'u2l4-mc' + (op === 'START' ? ' start' : op === 'FINISH' ? ' finish' : op === 'SQ' ? ' sq' : ''));
    b.type = 'button';
    b.innerHTML = op === 'START' ? '<small>START</small><span>4</span>' : op === 'FINISH' ? '<small>FINISH</small><span class="u2l4-fv">?</span>' : op === 'SQ' ? `<span>${K('(\\ )^{2}')}</span><small>square it</small>` : `<span>${K(op)}</span>`;
    b.style.gridRow = r * 2 + 1; b.style.gridColumn = c * 2 + 1;
    b.addEventListener('click', () => tap(r, c));
    host.appendChild(b); cells.push({ r, c, op, b });
    if (c < 2) { const a = h('div', 'u2l4-ma r', '→'); a.style.gridRow = r * 2 + 1; a.style.gridColumn = c * 2 + 2; host.appendChild(a); }
    if (r < 2) { const a = h('div', 'u2l4-ma d', '↓'); a.style.gridRow = r * 2 + 2; a.style.gridColumn = c * 2 + 1; host.appendChild(a); }
  }));
  const cell = (r, c) => cells.find((x) => x.r === r && x.c === c);
  let pos, val, trail, timer = 0;
  const render = () => {
    cells.forEach((x) => { x.b.classList.toggle('on', trail.some((t) => t[0] === x.r && t[1] === x.c)); x.b.classList.toggle('here', x.r === pos[0] && x.c === pos[1]); x.b.classList.toggle('next', (x.r === pos[0] && x.c === pos[1] + 1) || (x.c === pos[1] && x.r === pos[0] + 1)); });
    const fin = pos[0] === 2 && pos[1] === 2;
    cell(2, 2).b.querySelector('.u2l4-fv').textContent = fin ? fmt(val) : '?';
    run.innerHTML = '<div class="u2l4-runh">Running value</div><div class="u2l4-runb">' + trail.map((t, i) => {
      if (!i) return '<span class="u2l4-rv">4</span>';
      const op = GRID[t[0]][t[1]]; if (op === 'FINISH') return '';
      return `<span class="u2l4-ro">${OPTXT[op]}</span><span class="u2l4-rv">${fmt(t[2])}</span>`;
    }).join('<i>→</i>').replace(/<i>→<\/i>$/, '') + (fin ? `<span class="u2l4-rf">finish: <b>${fmt(val)}</b></span>` : '') + '</div>';
  };
  const reset = () => { clearTimeout(timer); pos = [0, 0]; val = 4; trail = [[0, 0, 4]]; render(); };
  function tap(r, c) {
    const ok = (r === pos[0] && c === pos[1] + 1) || (c === pos[1] && r === pos[0] + 1);
    if (!ok) { if (r === 0 && c === 0) reset(); return; }
    const op = GRID[r][c]; if (op !== 'FINISH') val = OPS[op](val);
    pos = [r, c]; trail.push([r, c, val]); render();
  }
  document.getElementById('u2l4-reset').addEventListener('click', reset);
  document.querySelectorAll('[data-u2l4-route]').forEach((b) => b.addEventListener('click', () => {
    reset(); const moves = b.dataset.u2l4Route.split('');
    const step = (i) => { if (i >= moves.length) return; const [r, c] = pos; if (moves[i] === 'R') tap(r, c + 1); else tap(r + 1, c); timer = setTimeout(() => step(i + 1), 650); };
    timer = setTimeout(() => step(0), 300);
  }));
  reset();
}

/* ======================= Stand Up Break! ======================= */
standup('u2l4', (() => {
  const L = ['x', 'y', 'a', 'm', 'n', 'p', 'k', 'w'];
  const P = (b, e) => (e === 1 ? b : `${b}^{${e}}`);
  const pair = (r) => r.shuffle(['a', 'b', 'x', 'y', 'm', 'n']).slice(0, 2);
  return {
    intro: 'Simplify at your whiteboard station. Use the checklist: (1) clear the brackets, (2) combine matching bases, (3) coefficients last.',
    levels: {
      BEG: (r) => { // two laws, one letter
        const v = r.pick(L), kind = r.pick(['mul', 'mulc', 'div', 'divc']);
        const n = r.pick([2, 2, 3]), k = r.pick(n === 2 ? [2, 3, 4, 5] : [2, 3]), m = r.int(2, 4), K2 = Math.pow(k, n);
        if (kind === 'mul') { const p = r.int(1, 5); return { q: `(${k}${v}^{${m}})^{${n}}\\times ${P(v, p)}`, a: [`=${K2}${v}^{${m * n}}\\times ${P(v, p)}`, `=${K2}${v}^{${m * n}+${p}}`, `=${K2}${v}^{${m * n + p}}`] }; }
        if (kind === 'mulc') { const p = r.int(1, 5), c = r.int(2, 5); return { q: `(${k}${v}^{${m}})^{${n}}\\times ${c}${P(v, p)}`, a: [`=${K2}${v}^{${m * n}}\\times ${c}${P(v, p)}`, `=(${K2}\\times${c})\\,${v}^{${m * n}+${p}}`, `=${K2 * c}${v}^{${m * n + p}}`] }; }
        if (kind === 'div') { const p = r.int(1, m * n - 1); return { q: `\\dfrac{(${k}${v}^{${m}})^{${n}}}{${P(v, p)}}`, a: [`=\\dfrac{${K2}${v}^{${m * n}}}{${P(v, p)}}`, `=${K2}${v}^{${m * n}-${p}}`, `=${K2}${P(v, m * n - p)}`] }; }
        const kk = n === 2 ? r.pick([2, 3, 4, 6]) : k, KK = Math.pow(kk, n), cc = r.pick([2, 3, 4, 6, 8, 9, 12].filter((x) => KK % x === 0 && x < KK)), p = r.int(1, m * n - 1);
        return { q: `\\dfrac{(${kk}${v}^{${m}})^{${n}}}{${cc}${P(v, p)}}`, a: [`=\\dfrac{${KK}${v}^{${m * n}}}{${cc}${P(v, p)}}`, `=(${KK}\\div${cc})\\,${v}^{${m * n}-${p}}`, `=${KK / cc}${P(v, m * n - p)}`] };
      },
      PRG: (r) => { // two variable bases
        const [a, b] = pair(r), kind = r.pick(['mul', 'div', 'two']);
        if (kind === 'mul') {
          const k = r.pick([2, 3, 4, 5]), m = r.int(2, 4), c = r.int(2, 5), p = r.int(1, 4), q = r.int(1, 4);
          return { q: `(${k}${a}^{${m}}${b})^{2}\\times ${c}${P(a, p)}${P(b, q)}`, a: [`=${k * k}${a}^{${2 * m}}${b}^{2}\\times ${c}${P(a, p)}${P(b, q)}`, `=(${k * k}\\times${c})\\,${a}^{${2 * m}+${p}}${b}^{2+${q}}`, `=${k * k * c}${a}^{${2 * m + p}}${b}^{${2 + q}}`] };
        }
        if (kind === 'div') {
          const k = r.pick([2, 3, 4, 6]), K2 = k * k, c = r.pick([2, 3, 4, 6, 9, 12].filter((x) => K2 % x === 0 && x < K2)), m = r.int(2, 4), n = r.int(1, 3), p = r.int(1, 2 * m - 1), q = r.int(1, 2 * n - 1);
          return { q: `\\dfrac{(${k}${a}^{${m}}${P(b, n)})^{2}}{${c}${P(a, p)}${P(b, q)}}`, a: [`=\\dfrac{${K2}${a}^{${2 * m}}${b}^{${2 * n}}}{${c}${P(a, p)}${P(b, q)}}`, `=(${K2}\\div${c})\\,${a}^{${2 * m}-${p}}${b}^{${2 * n}-${q}}`, `=${K2 / c}${P(a, 2 * m - p)}${P(b, 2 * n - q)}`] };
        }
        const m = r.int(1, 3), n = r.int(1, 3), p = r.int(2, 3), s = r.int(1, 3), t = r.int(1, 3), u = r.int(2, 3);
        return { q: `\\left(${P(a, m)}${P(b, n)}\\right)^{${p}}\\times\\left(${P(a, s)}${P(b, t)}\\right)^{${u}}`, a: [`=${P(a, m * p)}${P(b, n * p)}\\times ${P(a, s * u)}${P(b, t * u)}`, `=${a}^{${m * p}+${s * u}}${b}^{${n * p}+${t * u}}`, `=${a}^{${m * p + s * u}}${b}^{${n * p + t * u}}`] };
      },
      MAS: (r) => { // a division inside the bracket, or three steps
        const kind = r.pick(['in2', 'in3', 'three']);
        if (kind === 'in2') {
          const [a, b] = pair(r), t = r.pick([2, 3, 4]), B = r.pick([2, 3, 4, 5, 6]), m = r.int(3, 6), p = r.int(1, m - 1), n = r.int(2, 4), q = r.int(1, n - 1), s = r.int(1, 4);
          const ea = m - p, eb = n - q;
          return { q: `\\left(\\dfrac{${t * B}${a}^{${m}}${b}^{${n}}}{${B}${P(a, p)}${P(b, q)}}\\right)^{2}\\times ${P(a, s)}`, a: [`=\\left(${t}${P(a, ea)}${P(b, eb)}\\right)^{2}\\times ${P(a, s)}`, `=${t * t}${a}^{${2 * ea}}${b}^{${2 * eb}}\\times ${P(a, s)}`, `=${t * t}${a}^{${2 * ea + s}}${b}^{${2 * eb}}`] };
        }
        if (kind === 'in3') {
          const v = r.pick(L), t = r.pick([2, 3]), B = r.pick([2, 3, 4, 5]), m = r.int(3, 6), p = r.int(1, m - 1), e = m - p;
          return { q: `\\left(\\dfrac{${t * B}${v}^{${m}}}{${B}${P(v, p)}}\\right)^{3}`, a: [`=\\left(${t}${P(v, e)}\\right)^{3}`, `=${t}^{3}${v}^{${e}\\times3}`, `=${t ** 3}${v}^{${3 * e}}`] };
        }
        const v = r.pick(L), k = r.pick([2, 3]), K3 = k ** 3, c = r.pick(k === 2 ? [2, 4] : [3, 9]), m = r.int(2, 3), p = r.int(1, 4), q = r.int(1, 3 * m + p - 1);
        return { q: `\\dfrac{(${k}${v}^{${m}})^{3}\\times ${P(v, p)}}{${c}${P(v, q)}}`, a: [`=\\dfrac{${K3}${v}^{${3 * m}}\\times ${P(v, p)}}{${c}${P(v, q)}}`, `=\\dfrac{${K3}${v}^{${3 * m + p}}}{${c}${P(v, q)}}`, `=${K3 / c}${P(v, 3 * m + p - q)}`] };
      }
    }
  };
})());

mountMaze();
export const explainers = mountExplainers({ which, checklist, checklist2, maze, slips, columns, race });
