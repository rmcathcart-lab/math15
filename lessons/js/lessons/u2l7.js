/* Math 15 · Unit 2 · Lesson 7 — Combining Zero, Negative and Positive Exponents.
 * Warm-up (Crack the Code: eight locked boxes, a key, the MATH HERO message) and the explainers:
 *   laws    (the seven laws, one at a time: each chip lights the law it uses, then flips to positive exponents),
 *   hops    (exponents on a number line: add, subtract, hop past zero; flip only the base the exponent touches —
 *            Example 1 and 2 checks),
 *   steps   (the three-step checklist, line by line, lighting the step and naming the law — Examples 2, 3),
 *   outer   (a negative outer power multiplies into EVERY exponent inside, the coefficient's hidden 1 too —
 *            the notes, Example 3, the tops of Examples 3(b)/4(b), the bracket of Example 5),
 *   sorter  (numbers together, each letter on its own: tokens fly into bins — Examples 2, 3(b), 4(b); reused from 10C 2.3),
 *   flip    (a fraction to a negative power: the long way, then flip it — reused from 10C 2.3),
 *   steps5  (the checklist again for Examples 4 and 5),
 *   check   (check a simplification by substituting x = 2: ours matches, a classmate's doesn't — Examples 1, 3(a), 5).
 * Colours: Step 1 amber, Step 2 blue, Step 3 purple; numbers amber, letters blue / orange / purple. */
import { h, tex, add, svgEl, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const T = (s) => tex(s);
/* KaTeX allowing \htmlClass (tokens that fly, exponents that arrows point at) */
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
function Q(p, q = 1) { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; return [p / g, q / g]; }
const qMul = (a, b) => Q(a[0] * b[0], a[1] * b[1]);
const tn = (n) => (Math.abs(n) >= 1000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : String(n));
const qT = ([p, q], d = '\\dfrac') => (q === 1 ? tn(p) : (p < 0 ? '-' : '') + `${d}{${tn(Math.abs(p))}}{${tn(q)}}`);
const par = (e) => (e < 0 ? `(${e})` : String(e));
const mn = (e) => String(e).replace('-', '−'); // a real minus sign in caption text
const pulse = (c, el, ms = 420) => c.anim(el, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], ms);

/* a copy of `src` flies from one element to another (both inside the stage, which may be scaled) */
function stageXY(stage, el) {
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k, w: r.width / k, h: r.height / k, top: (r.top - sr.top) / k, bottom: (r.bottom - sr.top) / k };
}
async function fly(c, stage, from, to, src, o = {}) {
  if (c.fast || !from || !to) { if (to) to.style.opacity = 1; return; }
  c.check();
  const a = stageXY(stage, from), b = stageXY(stage, to);
  const g = add(stage, h('div', 'u2l7-fly c ' + (o.cls || ''), K(src)), a.x, a.y); if (o.fs) g.style.fontSize = o.fs + 'px';
  g.style.opacity = 0;
  try {
    await c.anim(g, [{ opacity: 1, transform: 'translate(0,0) scale(1.1)' }, { opacity: 1, transform: `translate(${(b.x - a.x) / 2}px, ${(b.y - a.y) / 2 - 30}px) scale(1.25)`, offset: 0.5 }, { opacity: 1, transform: `translate(${b.x - a.x}px, ${b.y - a.y}px) scale(1)` }], o.ms || 750, { delay: o.delay || 0 });
  } finally { g.remove(); }
  to.style.opacity = 1;
}

/* =====================================================================
 * Warm-up: Crack the Code
 * ===================================================================== */
const BOXES = [
  { e: '2^{-1}\\cdot 2^{3}', v: '4', L: 'M' }, { e: '5^{0}', v: '1', L: 'A' }, { e: '2^{5}\\div 2^{2}', v: '8', L: 'T' },
  { e: '2^{4}\\cdot 2^{-7}', v: '\\dfrac18', L: 'H' }, { e: '2^{-3}', v: '\\dfrac18', L: 'H', trap: true },
  { e: '3^{-2}\\cdot 3^{4}', v: '9', L: 'E' }, { e: '(3^{2})^{0}+2', v: '3', L: 'R' }, { e: '4^{0}+4^{0}', v: '2', L: 'O' }
];
const KEY = [['-8', 'Z'], ['-6', 'W'], ['0', 'B'], ['\\dfrac18', 'H'], ['\\dfrac12', 'S'], ['1', 'A'], ['2', 'O'], ['3', 'R'], ['4', 'M'], ['5', 'L'], ['8', 'T'], ['9', 'E']];
function mountCode() {
  const host = document.getElementById('u2l7-boxes'), keyEl = document.getElementById('u2l7-key'), msg = document.getElementById('u2l7-msg');
  if (!host) return;
  const keyCells = KEY.map(([v, L]) => { const d = h('div', 'u2l7-kc', `<div class="u2l7-kv">${K(v)}</div><div class="u2l7-kl">${L}</div>`); keyEl.appendChild(d); return d; });
  const slots = BOXES.map((b, i) => { const s = h('div', 'u2l7-ms' + (i === 4 ? ' gap' : ''), '<span class="u2l7-msl"></span>'); msg.appendChild(s); return s; });
  const btns = BOXES.map((b, i) => {
    const el = h('button', 'u2l7-box' + (b.trap ? ' trap' : ''), `<span class="u2l7-bn">Box ${i + 1}</span><span class="u2l7-be">${K(b.e)}</span>` +
      `<span class="u2l7-bv"><span class="u2l7-bq">?</span><span class="u2l7-bans">${K('=' + b.v)}<b>${b.L}</b></span></span>`);
    el.type = 'button'; el.setAttribute('aria-label', 'Unlock box ' + (i + 1));
    el.addEventListener('click', () => { el.classList.toggle('open'); sync(); });
    host.appendChild(el); return el;
  });
  function sync() {
    const open = btns.map((b) => b.classList.contains('open'));
    slots.forEach((s, i) => { s.querySelector('.u2l7-msl').textContent = open[i] ? BOXES[i].L : ''; s.classList.toggle('on', open[i]); });
    keyCells.forEach((kc, j) => kc.classList.toggle('hit', BOXES.some((b, i) => open[i] && b.L === KEY[j][1])));
    msg.classList.toggle('done', open.every(Boolean));
  }
  document.getElementById('u2l7-all').addEventListener('click', () => { btns.forEach((b) => b.classList.add('open')); sync(); });
  document.getElementById('u2l7-reset').addEventListener('click', () => { btns.forEach((b) => b.classList.remove('open')); sync(); });
}

/* =====================================================================
 * Line-by-line chains with badges that light up (laws, steps, steps5)
 * ===================================================================== */
const LAWB = [
  ['prod', 'Product', 'a^m\\cdot a^n=a^{m+n}'], ['quot', 'Quotient', 'a^m\\div a^n=a^{m-n}'],
  ['ppow', 'Power of a Power', '(a^m)^n=a^{mn}'], ['pprod', 'Power of a Product', '(ab)^n=a^nb^n'],
  ['pquot', 'Power of a Quotient', '\\left(\\tfrac{a}{b}\\right)^n=\\tfrac{a^n}{b^n}'], ['zero', 'Zero Exponent', 'a^0=1'],
  ['neg', 'Negative Exponent', 'a^{-n}=\\tfrac{1}{a^n}']
];
const STEPB = [['1', 'Step 1', 'brackets first'], ['2', 'Step 2', 'combine matching bases'], ['3', 'Step 3', 'zero and negatives last']];

/* each line: [tex, badges to light, short note, caption] */
const LAWC = {
  p: { t: 'x^{2}\\cdot x^{-6}', lines: [
    ['=x^{2+(-6)}', ['prod'], 'multiplying: <b>add</b> the exponents', `<b>Product law:</b> same base, multiplying, so <b>add</b> the exponents: ${T('2+(-6)')}.`],
    ['=x^{-4}', [], `${T('2+(-6)=-4')}`, `Adding a negative: ${T('2+(-6)=-4')}. Not finished yet: a <b>negative</b> exponent is left.`],
    ['=\\dfrac{1}{x^{4}}', ['neg'], 'negative exponent: <b>flip</b>', `<b>Negative exponent law:</b> ${T('x^{-4}=\\dfrac{1}{x^4}')}. Positive exponents only, so we’re done.`]] },
  q: { t: '\\dfrac{a^{3}}{a^{8}}', lines: [
    ['=a^{3-8}', ['quot'], 'dividing: <b>subtract</b>', `<b>Quotient law:</b> same base, dividing, so <b>subtract</b>: top exponent minus bottom exponent, ${T('3-8')}.`],
    ['=a^{-5}', [], `${T('3-8=-5')}`, `${T('3-8=-5')}. Check by cancelling: three ${T('a')}’s cancel, and <b>five</b> are left on the bottom.`],
    ['=\\dfrac{1}{a^{5}}', ['neg'], 'negative exponent: <b>flip</b>', `<b>Negative exponent law:</b> ${T('a^{-5}=\\dfrac{1}{a^5}')}, the five ${T('a')}’s left on the bottom.`]] },
  pp: { t: '(y^{-2})^{4}', lines: [
    ['=y^{(-2)(4)}', ['ppow'], 'bracket: <b>multiply</b>', `<b>Power of a power:</b> a power inside a bracket, raised to a power, so <b>multiply</b> the exponents.`],
    ['=y^{-8}', [], `${T('(-2)(4)=-8')}`, `Negative times positive is negative: ${T('(-2)(4)=-8')}.`],
    ['=\\dfrac{1}{y^{8}}', ['neg'], 'negative exponent: <b>flip</b>', `<b>Negative exponent law:</b> ${T('y^{-8}=\\dfrac{1}{y^8}')}.`]] },
  pr: { t: '(2x)^{-2}', lines: [
    ['=2^{-2}x^{-2}', ['pprod'], 'to <b>every</b> factor', `<b>Power of a product:</b> the ${T('-2')} goes to <b>every</b> factor in the bracket, the 2 <b>and</b> the ${T('x')}.`],
    ['=\\dfrac{1}{2^{2}x^{2}}', ['neg'], 'both flip to the bottom', `<b>Negative exponent law:</b> both pieces have the negative exponent, so <b>both</b> flip to the bottom.`],
    ['=\\dfrac{1}{4x^{2}}', [], `${T('2^2=4')}`, `${T('2^2=4')}, so ${T('(2x)^{-2}=\\dfrac{1}{4x^2}')}. Compare: in ${T('2x^{-2}')} only the ${T('x')} would flip.`]] },
  pq: { t: '\\left(\\dfrac{x}{3}\\right)^{2}', lines: [
    ['=\\dfrac{x^{2}}{3^{2}}', ['pquot'], 'top <b>and</b> bottom', `<b>Power of a quotient:</b> the top <b>and</b> the bottom both get the exponent 2.`],
    ['=\\dfrac{x^{2}}{9}', [], `${T('3^2=9')}`, `${T('3^2=9')}. All exponents are positive: ${T('\\dfrac{x^2}{9}')}.`]] },
  z: { t: '(4ab)^{0}', lines: [
    ['=1', ['zero'], 'the <b>whole</b> bracket is the base', `<b>Zero exponent law:</b> the exponent 0 sits on the <b>whole bracket</b>, so the whole thing is 1. No work inside needed!`]] }
};
const STEPC = {
  e2: { t: '12a^{-2}\\div 4a^{5}', lines: [
    ['=\\dfrac{12a^{-2}}{4a^{5}}', [], 'no brackets: write it as a fraction', `No brackets, so <b>Step 1</b> has nothing to do. Write the division as a fraction.`],
    ['=3a^{-2-5}', ['2'], `${T('12\\div4=3')}; quotient law: <b>subtract</b>`, `<b>Step 2:</b> coefficients separately, ${T('12\\div4=3')}. Same base ${T('a')}, dividing, so <b>subtract</b>: ${T('-2-5')} (quotient law).`],
    ['=3a^{-7}', ['2'], `${T('-2-5=-7')}`, `${T('-2-5=-7')}. Not finished: there’s a <b>negative</b> exponent.`],
    ['=\\dfrac{3}{a^{7}}', ['3'], 'flip <b>only</b> the ' + T('a'), `<b>Step 3:</b> ${T('a^{-7}')} flips to the bottom as ${T('a^7')}. The 3 has no negative exponent, so it <b>stays on top</b>: ${T('\\dfrac{3}{a^7}')}.`]] },
  e3a: { t: '(3x^{2})^{-2}\\times x^{5}', lines: [
    ['=3^{-2}x^{-4}\\times x^{5}', ['1'], 'power of a product: <b>every</b> factor', `<b>Step 1:</b> the outer ${T('-2')} goes to the 3 <b>and</b> to ${T('x^2')}: ${T('3^{1\\times(-2)}')} and ${T('x^{2\\times(-2)}')} (power of a product, power of a power).`],
    ['=3^{-2}x^{-4+5}', ['2'], 'product law: <b>add</b>', `<b>Step 2:</b> the ${T('x')}’s are multiplying, so <b>add</b> their exponents (product law).`],
    ['=3^{-2}x^{1}', ['2'], `${T('-4+5=1')}`, `${T('-4+5=1')}, and ${T('x^1')} is just ${T('x')}.`],
    ['=\\dfrac{x}{9}', ['3'], `${T('3^{-2}=\\tfrac19')} flips`, `<b>Step 3:</b> ${T('3^{-2}=\\dfrac{1}{3^2}=\\dfrac19')}, so the 9 goes on the bottom. The ${T('x')} stays on top: ${T('\\dfrac{x}{9}')}.`]] },
  e3b: { t: '\\dfrac{(2a^{3}b)^{2}}{4a^{7}b^{-1}}', lines: [
    ['=\\dfrac{4a^{6}b^{2}}{4a^{7}b^{-1}}', ['1'], 'square <b>every</b> factor on top', `<b>Step 1:</b> square every factor in the bracket: ${T('2^2=4')}, ${T('a^{3\\times2}=a^6')}, ${T('b^{1\\times2}=b^2')}.`],
    ['=a^{6-7}\\,b^{2-(-1)}', ['2'], `${T('4\\div4=1')}; <b>subtract</b>, one letter at a time`, `<b>Step 2:</b> ${T('4\\div4=1')}. Quotient law, one letter at a time: ${T('a^{6-7}')} and ${T('b^{2-(-1)}')}.`],
    ['=a^{-1}b^{3}', ['2'], `${T('2-(-1)=3')}`, `${T('6-7=-1')}, and ${T('2-(-1)=2+1=3')}: subtracting a negative <b>adds</b>.`],
    ['=\\dfrac{b^{3}}{a}', ['3'], 'flip <b>only</b> the ' + T('a'), `<b>Step 3:</b> ${T('a^{-1}=\\dfrac{1}{a}')} goes to the bottom. ${T('b^3')} is positive and stays on top: ${T('\\dfrac{b^3}{a}')}.`]] },
  e3c: { t: '(x^{-2}y^{3})^{-3}', lines: [
    ['=x^{(-2)(-3)}\\,y^{(3)(-3)}', ['1'], 'multiply <b>each</b> exponent by ' + T('-3'), `<b>Step 1:</b> multiply <b>each</b> exponent inside by the outer ${T('-3')}, signs included.`],
    ['=x^{6}y^{-9}', ['1'], `${T('(-)(-)=+')}, ${T('(+)(-)=-')}`, `Watch the signs: ${T('(-2)(-3)=6')} and ${T('(3)(-3)=-9')}. <b>Step 2:</b> no matching bases to combine.`],
    ['=\\dfrac{x^{6}}{y^{9}}', ['3'], 'flip <b>only</b> the ' + T('y'), `<b>Step 3:</b> ${T('y^{-9}')} flips to the bottom. ${T('x^6')} stays on top: ${T('\\dfrac{x^6}{y^9}')}.`]] },
  e4a: { t: '\\left(\\dfrac{2a^{4}}{a^{-2}}\\right)^{-2}', lines: [
    ['=\\left(2a^{4-(-2)}\\right)^{-2}', ['1'], '<b>inside</b> the bracket first: subtract', `<b>Step 1, inside the bracket first.</b> Quotient law: ${T('a^{4-(-2)}')}. Simplifying inside keeps the numbers small.`],
    ['=(2a^{6})^{-2}', ['1'], `${T('4-(-2)=6')}`, `${T('4-(-2)=4+2=6')}. Now the bracket is just ${T('2a^6')}.`],
    ['=2^{-2}a^{-12}', ['1'], 'outer power to <b>every</b> factor', `Now the outer ${T('-2')}, to <b>every</b> factor: ${T('2^{-2}')} and ${T('a^{6\\times(-2)}=a^{-12}')}.`],
    ['=\\dfrac{1}{2^{2}a^{12}}', ['3'], 'both flip to the bottom', `<b>Step 3:</b> both pieces have negative exponents, so <b>both</b> flip to the bottom.`],
    ['=\\dfrac{1}{4a^{12}}', ['3'], `${T('2^2=4')}`, `${T('2^2=4')}, so the answer is ${T('\\dfrac{1}{4a^{12}}')}.`]] },
  e4b: { t: '\\dfrac{(3x^{-1}y^{2})^{2}}{9x^{-4}y^{5}}', lines: [
    ['=\\dfrac{9x^{-2}y^{4}}{9x^{-4}y^{5}}', ['1'], 'square <b>every</b> factor on top', `<b>Step 1:</b> square every factor on top: ${T('3^2=9')}, ${T('x^{-1\\times2}=x^{-2}')}, ${T('y^{2\\times2}=y^4')}.`],
    ['=x^{-2-(-4)}\\,y^{4-5}', ['2'], `${T('9\\div9=1')}; <b>subtract</b>, one letter at a time`, `<b>Step 2:</b> ${T('9\\div9=1')}. Quotient law, one letter at a time.`],
    ['=x^{2}y^{-1}', ['2'], `${T('-2+4=2')}, ${T('4-5=-1')}`, `${T('-2-(-4)=-2+4=2')} and ${T('4-5=-1')}.`],
    ['=\\dfrac{x^{2}}{y}', ['3'], 'flip <b>only</b> the ' + T('y'), `<b>Step 3:</b> ${T('y^{-1}=\\dfrac{1}{y}')} goes to the bottom: ${T('\\dfrac{x^2}{y}')}.`]] },
  e5: { t: '\\dfrac{(2x^{3}y^{0})^{-2}\\times 6x^{5}}{3x^{-4}}', lines: [
    ['=\\dfrac{(2x^{3})^{-2}\\times 6x^{5}}{3x^{-4}}', ['1'], `${T('y^0=1')}: it disappears`, `<b>Step 1:</b> a zero exponent hides in the bracket. ${T('y^0=1')}, so it simply disappears (zero exponent law).`],
    ['=\\dfrac{2^{-2}x^{-6}\\times 6x^{5}}{3x^{-4}}', ['1'], 'outer ' + T('-2') + ' to <b>every</b> factor', `Still <b>Step 1:</b> the outer ${T('-2')} goes to the 2 and to ${T('x^3')}: ${T('2^{-2}')} and ${T('x^{3\\times(-2)}=x^{-6}')}.`],
    ['=\\dfrac{\\tfrac{3}{2}\\,x^{-1}}{3x^{-4}}', ['2'], `top: ${T('\\tfrac14\\times6=\\tfrac32')}, ${T('x^{-6+5}')}`, `<b>Step 2, the top:</b> ${T('2^{-2}\\times6=\\tfrac14\\times6=\\tfrac64=\\tfrac32')}, and ${T('x^{-6+5}=x^{-1}')} (product law).`],
    ['=\\tfrac{1}{2}\\,x^{-1-(-4)}', ['2'], `${T('\\tfrac32\\div3=\\tfrac12')}; <b>subtract</b>`, `<b>Step 2, divide:</b> ${T('\\tfrac32\\div3=\\tfrac12')}, and the quotient law gives ${T('x^{-1-(-4)}')}.`],
    ['=\\tfrac{1}{2}\\,x^{3}=\\dfrac{x^{3}}{2}', ['3'], `${T('-1+4=3')}: already positive`, `${T('-1-(-4)=-1+4=3')}. <b>Step 3:</b> no negative exponent is left. ${T('\\tfrac12x^3')} is written ${T('\\dfrac{x^3}{2}')}.`]] }
};

function chainDef({ title, badges, data, choices, value, cls, height, cols, lh, ly, intro }) {
  return {
    title, height, choices, value,
    intro: intro || ((k) => `Simplify ${T(data[k].t)}, one line at a time. Press <b>Next</b> for each line.`),
    make(stage, key, ex) {
      const W = ex.W, d = data[key], per = cols, bw = (W - 24 - (per - 1) * 8) / per, bh = cls === 'law' ? 60 : 54;
      const lit = {};
      badges.forEach(([k, name, f], i) => {
        const b = add(stage, h('div', `u2l7-cb u2l7-cb-${cls} u2l7-k-${k}`, `<b>${name}</b><span>${f.includes('\\') || f.includes('^') ? K(f) : f}</span>`), 12 + (i % per) * (bw + 8), 10 + Math.floor(i / per) * (bh + 8));
        b.style.width = bw + 'px'; b.style.height = bh + 'px'; lit[k] = b;
      });
      const lx = 22, nx = Math.round(W * 0.53), nw = W - nx - 14;
      const all = [[d.t, [], 'the question', '']].concat(d.lines);
      const rows = all.map(([t, , note], i) => {
        const el = add(stage, h('div', 'u2l7-cl', K(t)), lx, ly + i * lh); el.style.height = (lh - 6) + 'px';
        const n = add(stage, h('div', 'u2l7-cn', `<div>${note}</div>`), nx, ly + i * lh + 4); n.style.width = nw + 'px'; n.style.height = (lh - 14) + 'px';
        if (i) hide(el, n); else n.classList.add('start');
        return { el, n };
      });
      const light = (c, ks) => Promise.all(badges.map(([k]) => { const on = ks.includes(k), b = lit[k], was = b.classList.contains('on'); b.classList.toggle('on', on); return on && !was ? c.anim(b, [{ transform: 'scale(1)' }, { transform: 'scale(1.07)' }, { transform: 'scale(1)' }], 380) : null; }));
      return d.lines.map(([, ks, , cap], j) => ({
        cap,
        run: async (c) => {
          const r = rows[j + 1], last = j === d.lines.length - 1;
          rows.forEach((x) => x.el.classList.remove('now'));
          r.el.classList.add('now'); if (last) r.el.classList.add('final');
          await Promise.all([light(c, ks), c.fadeIn(r.el, 420, { from: 'translateY(-10px)' }), c.fadeIn(r.n, 380, { delay: 200, from: 'translateX(10px)' })]);
        }
      }));
    }
  };
}
const laws = chainDef({
  title: 'Seven laws, one at a time', badges: LAWB, data: LAWC, cls: 'law', cols: 4, height: 412, lh: 68, ly: 136,
  choices: ['p', 'q', 'pp', 'pr', 'pq', 'z'].map((k) => ({ v: k, label: T(LAWC[k].t.replace(/dfrac/g, 'tfrac')) })),
  intro: (k) => `Simplify ${T(LAWC[k].t)}. Which law does the work? Watch the badges.`
});
const steps = chainDef({
  title: 'The checklist, one line at a time', badges: STEPB, data: STEPC, cls: 'step', cols: 3, height: 494, lh: 68, ly: 82,
  choices: [{ sep: 'Example 2 check:' }, { v: 'e2', label: 'Ex. 2' }, { sep: 'Example 3 check:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' }, { v: 'e3c', label: '(c)' }]
});
const steps5 = chainDef({
  title: 'The whole checklist, run once', badges: STEPB, data: STEPC, cls: 'step', cols: 3, height: 494, lh: 68, ly: 82, value: 'e5',
  choices: [{ sep: 'Example 4 check:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }, { sep: 'Example 5 check:' }, { v: 'e5', label: 'Ex. 5' }]
});

/* =====================================================================
 * Exponent hops on a number line (Examples 1, 2)
 * ===================================================================== */
const HOPS = {
  h1: { c: '2', v: 'y', ops: [[1, 4], [1, -6]], lbl: '2y^{4}\\cdot y^{-6}' },
  h2: { c: '', v: 'a', ops: [[1, -3], [1, -2], [1, 7]], lbl: 'a^{-3}\\cdot a^{-2}\\cdot a^{7}' },
  e1: { c: '4', v: 'x', ops: [[1, 3], [1, -7], [1, 0]], lbl: '4x^{3}\\cdot x^{-7}\\cdot x^{0}' },
  e2: { c: '3', coef: '12\\div4=3', v: 'a', ops: [[1, -2], [-1, 5]], lbl: '12a^{-2}\\div 4a^{5}' }
};
const hops = {
  title: 'Exponent hops: add, subtract, land past zero',
  height: 420,
  choices: [{ v: 'h1', label: T(HOPS.h1.lbl) }, { v: 'h2', label: T(HOPS.h2.lbl) }, { sep: 'Example 1 check:' }, { v: 'e1', label: 'Ex. 1' }, { sep: 'Example 2 check:' }, { v: 'e2', label: 'Ex. 2' }],
  intro: (k) => `Simplify ${T(HOPS[k].lbl)}. Same base, so the exponents do the work. Watch them on a <b>number line</b>.`,
  make(stage, k, ex) {
    const it = HOPS[k], W = ex.W, H = 420, LY = 206, sp = (W - 110) / 18, X = (e) => W / 2 + e * sp, v = it.v, cf = it.c;
    const div = it.ops.some(([s]) => s < 0);
    const lawT = add(stage, h('div', 'u2l7-hp-law', div ? 'Quotient law: <b>subtract</b> the exponents' : 'Product law: <b>add</b> the exponents'), W - 22, 16); lawT.style.translate = '-100% 0'; hide(lawT);
    add(stage, h('div', 'u2l7-hp-head', K(it.lbl)), 22, 10);
    const coefEl = add(stage, h('div', 'u2l7-hp-coef', `Numbers: ${K(it.coef || '')}`), W - 22, 64); coefEl.style.translate = '-100% 0'; hide(coefEl);
    const svg = add(stage, svgEl('svg', { class: 'u2l7-hp-svg', width: W, height: H }), 0, 0);
    const defs = svgEl('defs'), mk = svgEl('marker', { id: 'u2l7Arr', viewBox: '0 0 10 10', refX: 7, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto' });
    mk.appendChild(svgEl('path', { d: 'M0 0 L10 5 L0 10 z', class: 'u2l7-hp-ah' })); defs.appendChild(mk); svg.appendChild(defs);
    svg.appendChild(svgEl('line', { x1: X(-9) - 22, y1: LY, x2: X(9) + 22, y2: LY, class: 'u2l7-hp-axis' }));
    for (let e = -9; e <= 9; e++) {
      svg.appendChild(svgEl('line', { x1: X(e), y1: LY - (e ? 7 : 11), x2: X(e), y2: LY + (e ? 7 : 11), class: 'u2l7-hp-tick' + (e ? '' : ' z') }));
      const t = svgEl('text', { x: X(e), y: LY + 32, class: 'u2l7-hp-tl' + (e ? '' : ' z'), 'text-anchor': 'middle' }); t.textContent = mn(e); svg.appendChild(t);
    }
    const tl = svgEl('text', { x: X(-9) - 22, y: LY - 18, class: 'u2l7-hp-axl' }); tl.textContent = 'exponent of ' + v; svg.appendChild(tl);
    const e0 = it.ops[0][1];
    const dot = add(stage, h('div', 'u2l7-hp-dot c'), X(e0), LY), bub = add(stage, h('div', 'u2l7-hp-bub c', K(`${v}^{${e0}}`)), X(e0), LY + 66);
    hide(dot, bub);
    const hopL = add(stage, h('div', 'u2l7-hp-hop c'), 0, 0); hide(hopL);
    const ghost = add(stage, h('div', 'u2l7-hp-dot ghost c'), 0, LY), gbub = add(stage, h('div', 'u2l7-hp-bub ghost c'), 0, LY + 66), hopL2 = add(stage, h('div', 'u2l7-hp-hop two c'), 0, 0); hide(ghost, gbub, hopL2);
    const arc = (a, z, cls, fixed) => {
      const hgt = fixed || Math.min(34 + Math.abs(z - a) * 8, 92), xa = X(a), xz = X(z), cy = LY - 10 - 2 * hgt;
      const p = svgEl('path', { d: `M ${xa} ${LY - 10} Q ${(xa + xz) / 2} ${cy} ${xz} ${LY - 10}`, class: 'u2l7-hp-arc ' + (cls || ''), 'marker-end': 'url(#u2l7Arr)' });
      svg.appendChild(p); return { p, peak: [(xa + xz) / 2, LY - 10 - hgt], xa, xz, cy };
    };
    const drawArc = async (c, A, ms = 650) => { const len = A.p.getTotalLength ? A.p.getTotalLength() || 400 : 400; if (A.p.classList.contains('dash')) { A.p.style.strokeDasharray = '7 6'; await c.anim(A.p, [{ opacity: 0 }, { opacity: 1 }], ms); } else { A.p.style.strokeDasharray = len; A.p.style.strokeDashoffset = len; await c.anim(A.p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], ms); } };
    const travel = (c, el, A, dy = 0) => {
      const kf = []; for (let i = 0; i <= 12; i++) { const t = i / 12, x = (1 - t) * (1 - t) * A.xa + 2 * t * (1 - t) * (A.xa + A.xz) / 2 + t * t * A.xz, y = (1 - t) * (1 - t) * (LY - 10) + 2 * t * (1 - t) * A.cy + t * t * (LY - 10); kf.push({ left: x + 'px', top: (i === 0 || i === 12 ? LY + dy : y + dy + 10) + 'px' }); }
      return c.anim(el, kf, 750, { easing: 'ease-in-out' });
    };
    // the written chain underneath
    const chainEl = add(stage, h('div', 'u2l7-hp-chain'), 22, 318);
    const piece = (src) => { const e = h('span', 'u2l7-hp-piece', K(src)); chainEl.appendChild(e); hide(e); return e; };
    const sumS = it.ops.map(([s, e], i) => (i === 0 ? String(e) : (s < 0 ? '-' : '+') + par(e))).join('');
    let run = e0; const partial = it.ops.map(([s, e], i) => (i === 0 ? e : (run += s * e)));
    const r = partial[partial.length - 1];
    const steps = [];
    if (it.coef) steps.push({ cap: `<b>Numbers first:</b> ${T(it.coef)}. The coefficients are just numbers, so divide them.`, run: (c) => c.pop(coefEl, 380) });
    const p1 = piece(`${cf}${v}^{${sumS}}`);
    steps.push({
      cap: div ? `Same base ${T(v)}: ${T(`${v}^{${e0}}`)} on top, ${T(`${v}^{${it.ops[1][1]}}`)} on the bottom. Dividing, so <b>subtract</b>: ${T(sumS)}. Start at <b>${mn(e0)}</b>.`
        : `Same base ${T(v)}, multiplying, so <b>add</b> all the exponents: ${T(sumS)}. Start at <b>${mn(e0)}</b>.`,
      run: (c) => Promise.all([c.fadeIn(lawT, 350), c.pop(dot, 380, { delay: 150 }), c.fadeIn(bub, 380, { delay: 250 }), c.fadeIn(p1, 380, { delay: 250 })])
    });
    it.ops.slice(1).forEach(([s, e], j) => {
      const from = partial[j], to = partial[j + 1], tag = (s < 0 ? '− ' : '+ ') + (e < 0 ? '(' + mn(e) + ')' : e);
      if (e === 0) {
        steps.push({
          cap: `${T(`${v}^0=1`)}, and multiplying by 1 changes nothing. On the line, <b>+ 0</b> means <b>stay put</b> at ${mn(from)}.`,
          run: async (c) => { at(hopL, X(from), LY - 52); hopL.innerHTML = '+ 0: stay'; await Promise.all([c.fadeIn(hopL, 300), pulse(c, dot), pulse(c, bub)]); }
        });
        return;
      }
      const step = to - from, dir = step < 0 ? 'left' : 'right';
      const why = s < 0 ? (e < 0 ? `Subtracting a negative <b>adds</b>: hop ${-e} to the right` : `Subtracting ${e} means hop <b>${e} to the left</b>`) : (e < 0 ? `Adding ${T(String(e))} means hop <b>${-e} to the left</b>` : `Adding ${e}: hop <b>${e} to the right</b>`);
      steps.push({
        cap: `${why}${from < 0 !== to < 0 && from !== 0 && to !== 0 ? ', right past zero' : ''}. We land on <b>${mn(to)}</b>.`,
        run: async (c) => {
          const A = arc(from, to); at(hopL, A.peak[0], A.peak[1] - 22); hopL.innerHTML = tag;
          await Promise.all([drawArc(c, A), travel(c, dot, A), travel(c, bub, A, 66), c.fadeIn(hopL, 300, { delay: 250 })]);
          bub.innerHTML = K(`${v}^{${to}}`); dot.classList.toggle('neg', to < 0); dot.classList.toggle('pos', to > 0);
          await c.pop(bub, 350);
        }
      });
      void dir;
    });
    const p2 = piece(`=${cf}${v}^{${r}}`);
    steps.push({
      cap: `So the exponent is ${T(`${sumS}=${r}`)}: ${T(`${cf}${v}^{${r}}`)}.` + (r < 0 ? ' Not finished: a <b>negative</b> exponent is left.' : ' It’s <b>positive</b>, so we’re done!'),
      run: (c) => Promise.all([c.fadeIn(p2, 380), pulse(c, bub)])
    });
    if (r < 0) {
      const fin = cf ? `\\dfrac{${cf}}{${v}^{${-r}}}` : `\\dfrac{1}{${v}^{${-r}}}`, p3 = piece('=' + fin);
      steps.push({
        cap: `Flip <b>only</b> what the exponent touches: ${T(`${v}^{${r}}`)} goes to the bottom as ${T(`${v}^{${-r}}`)}` + (cf ? `. The ${cf} has no negative exponent, so it <b>stays on top</b>: <b>${T(fin)}</b>.` : `: <b>${T(fin)}</b>.`),
        run: async (c) => {
          const A = arc(r, -r, 'dash ghost', 30); at(hopL2, A.peak[0], A.peak[1] - 16); hopL2.innerHTML = 'flip';
          at(ghost, X(-r), LY); at(gbub, X(-r), LY + 80); gbub.innerHTML = K(`\\dfrac{1}{${v}^{${-r}}}`);
          await Promise.all([drawArc(c, A, 450), c.fadeIn(hopL2, 300), c.pop(ghost, 380, { delay: 250 }), c.fadeIn(gbub, 380, { delay: 300 }), c.pop(p3, 420, { delay: 350 })]);
          p3.classList.add('fin');
        }
      });
    } else p2.classList.add('fin');
    return steps;
  }
};

/* =====================================================================
 * A (negative) outer power multiplies into every exponent inside
 * ===================================================================== */
const OUT = {
  n: { c: 5, f: [['x', 3]], n: -2 },
  t: { c: 2, f: [['y', -4]], n: -3 },
  b: { c: 2, f: [['a', 3], ['b', 1]], n: 2 },
  c: { c: 1, f: [['x', -2], ['y', 3]], n: -3 },
  e4: { c: 3, f: [['x', -1], ['y', 2]], n: 2 },
  e5: { c: 2, f: [['x', 3], ['y', 0]], n: -2 }
};
const outTex = (d) => `(${d.c === 1 ? '' : d.c}${d.f.map(([v, e]) => (e === 1 ? v : `${v}^{${e}}`)).join('')})^{${d.n}}`;
const outer = {
  title: 'The outer power goes to every exponent inside',
  height: 476,
  choices: [{ v: 'n', label: T(outTex(OUT.n)) }, { v: 't', label: T(outTex(OUT.t)) }, { sep: 'Example 3 check:' }, { v: 'b', label: '(b) top' }, { v: 'c', label: '(c)' },
    { sep: 'Example 4 check:' }, { v: 'e4', label: '(b) top' }, { sep: 'Example 5 check:' }, { v: 'e5', label: 'bracket' }],
  intro: (k) => `Simplify ${T(outTex(OUT[k]))}. The outer exponent ${T(String(OUT[k].n))} multiplies <b>every</b> exponent inside.`,
  make(stage, k, ex) {
    const d = OUT[k], W = ex.W, n = d.n;
    const items = [...(d.c === 1 ? [] : [[String(d.c), 1, true]]), ...d.f.map(([v, e]) => [v, e, false])];
    const hidden1 = items.some(([, e]) => e === 1);
    const VC = ['u2l7-c1', 'u2l7-c2', 'u2l7-c3'];
    let vi = 0; const colr = items.map(([, , num]) => (num ? 'u2l7-cn0' : VC[vi++ % 3]));
    const inner = items.map(([b, e], i) => `\\htmlClass{${colr[i]}}{${b}}^{\\htmlClass{u2l7-oe u2l7-oe${i}${e === 1 ? ' u2l7-hid' : ''}}{${e}}}`).join('');
    const big = add(stage, h('div', 'u2l7-ou-big', K(`\\left(${inner}\\right)^{\\htmlClass{u2l7-on}{${n}}}`)), W / 2, 112); big.style.translate = '-50% -50%';
    stage.querySelectorAll('.u2l7-hid').forEach((e) => (e.style.opacity = 0));
    const svg = add(stage, svgEl('svg', { class: 'u2l7-ou-svg', width: W, height: 200 }), 0, 0);
    const prodT = items.map(([b, e], i) => `\\htmlClass{${colr[i]}}{${b}}^{(${e})(${n})}`).join('\\,');
    const res = items.map(([b, e]) => [b, e * n]);
    const rawT = res.map(([b, e], i) => `\\htmlClass{${colr[i]}}{${b}}^{${e}}`).join('');
    const yR = [190, 276, 362];
    const lab = (t, y) => add(stage, h('div', 'u2l7-ou-lab', t), 22, y + 16);
    const r1 = add(stage, h('div', 'u2l7-ou-row', K('=' + prodT)), 210, yR[0]), r2 = add(stage, h('div', 'u2l7-ou-row', K('=' + rawT)), 210, yR[1]);
    const l1 = lab('Multiply', yR[0]), l2 = lab('Signs', yR[1]), l3 = lab('Positive only', yR[2]);
    // the finished answer: numbers evaluated, x^0 gone, negatives flipped
    let coef = [1, 1]; const topV = [], botV = [];
    res.forEach(([b, e], i) => {
      if (items[i][2]) coef = qMul(coef, e >= 0 ? [Number(b) ** e, 1] : [1, Number(b) ** -e]);
      else if (e > 0) topV.push(`${b}^{${e}}`.replace(/\^\{1\}$/, ''));
      else if (e < 0) botV.push(`${b}^{${-e}}`.replace(/\^\{1\}$/, ''));
    });
    const numS = (coef[0] !== 1 || !topV.length ? String(coef[0]) : '') + topV.join(''), denS = (coef[1] !== 1 ? String(coef[1]) : '') + botV.join('');
    const fin = denS ? `\\dfrac{${numS}}{${denS}}` : numS;
    const zeros = res.filter(([b, e], i) => e === 0 && !items[i][2]).map(([b]) => b);
    const cRes = items[0][2] ? res[0][1] : null;
    const r3 = add(stage, h('div', 'u2l7-ou-row fin', K('=' + fin)), 210, yR[2]);
    hide(r1, r2, r3, l1, l2, l3);
    const steps = [];
    const names = items.map(([b, e]) => (e === 1 ? b : `${b}^{${e}}`));
    steps.push({
      cap: `The outer exponent <b>${mn(n)}</b> goes to <b>every</b> factor inside: ${names.map((s) => T(s)).join(', ').replace(/, ([^,]*)$/, ' and $1')}.` + (hidden1 ? ` A factor with no exponent showing has exponent <b>1</b>.` : ''),
      run: async (c) => {
        stage.querySelectorAll('.u2l7-hid').forEach((e) => { e.style.opacity = 1; });
        if (c.fast) { drawArrows(); return; }
        await Promise.all([...stage.querySelectorAll('.u2l7-hid')].map((e) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 350)));
        const ps = drawArrows();
        await Promise.all(ps.map((p, i) => { const len = p.getTotalLength ? p.getTotalLength() || 300 : 300; p.style.strokeDasharray = len; p.style.strokeDashoffset = len; return c.anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], 520, { delay: i * 220 }); }));
      }
    });
    function drawArrows() {
      svg.innerHTML = '';
      const on = stage.querySelector('.u2l7-on'); if (!on) return [];
      const o = stageXY(stage, on), out = [];
      items.forEach((_, i) => {
        const t = stage.querySelector('.u2l7-oe' + i); if (!t) return;
        const p = stageXY(stage, t), x1 = o.x, y1 = o.top - 2, x2 = p.x, y2 = p.top - 2, top = Math.min(y1, y2) - 30 - Math.abs(x1 - x2) * 0.32;
        const path = svgEl('path', { d: `M ${x1} ${y1} C ${x1} ${top}, ${x2} ${top}, ${x2} ${y2}`, class: 'u2l7-ou-arr' }); svg.appendChild(path);
        svg.appendChild(svgEl('path', { d: `M ${x2 - 5} ${y2 - 9} L ${x2} ${y2} L ${x2 + 5} ${y2 - 9}`, class: 'u2l7-ou-arr head' }));
        out.push(path);
      });
      return out;
    }
    steps.push({
      cap: `<b>Multiply</b> each inside exponent by ${mn(n)} (power of a power). Keep the signs in brackets.`,
      run: (c) => Promise.all([c.fadeIn(l1, 300), c.fadeIn(r1, 400)])
    });
    const signNote = res.map(([b, e], i) => `${T(`(${items[i][1]})(${n})=${e}`)}`).join(', ');
    steps.push({
      cap: `Work out each product, signs included: ${signNote}.` + (n < 0 && items.some(([, e]) => e < 0) ? ' Negative times negative is <b>positive</b>.' : ''),
      run: (c) => Promise.all([c.fadeIn(l2, 300), c.fadeIn(r2, 400)])
    });
    const parts = [];
    if (cRes != null) parts.push(cRes < 0 ? `${T(`${items[0][0]}^{${cRes}}=\\tfrac{1}{${Number(items[0][0]) ** -cRes}}`)}, so ${Number(items[0][0]) ** -cRes} goes on the bottom` : `${T(`${items[0][0]}^{${cRes}}=${Number(items[0][0]) ** cRes}`)}`);
    if (zeros.length) parts.push(`${T(zeros[0] + '^0=1')} disappears`);
    if (botV.length) parts.push(`${botV.map((s) => T(s)).join(' and ')} ${botV.length > 1 ? 'flip' : 'flips'} to the bottom`);
    steps.push({
      cap: (botV.length || (cRes != null && cRes < 0) ? '<b>Last step, positive exponents:</b> ' : '<b>Last step:</b> evaluate. ') + parts.join('; ') + `. Answer: <b>${T(fin)}</b>.`,
      run: (c) => Promise.all([c.fadeIn(l3, 300), c.pop(r3, 450)])
    });
    return steps;
  }
};

/* =====================================================================
 * After the brackets: numbers together, each letter on its own (from 10C 2.3)
 * ===================================================================== */
const SO = {
  t1: { orig: '\\dfrac{10m^{-3}n^{2}}{5m^{2}n^{-4}}', chip: '\\tfrac{10m^{-3}n^{2}}{5m^{2}n^{-4}}', same: true, top: ['10', 'm-3', 'n2'], bot: ['5', 'm2', 'n-4'] },
  e2: { orig: '12a^{-2}\\div 4a^{5}', pre: [{ cap: 'Write the division as a fraction.' }], top: ['12', 'a-2'], bot: ['4', 'a5'] },
  e3b: { orig: '\\dfrac{(2a^{3}b)^{2}}{4a^{7}b^{-1}}', pre: [{ cap: `<b>Step 1, brackets first:</b> ${T('(2a^3b)^2=4a^6b^2')}. Now sort the pieces.` }], top: ['4', 'a6', 'b2'], bot: ['4', 'a7', 'b-1'] },
  e4b: { orig: '\\dfrac{(3x^{-1}y^{2})^{2}}{9x^{-4}y^{5}}', pre: [{ cap: `<b>Step 1, brackets first:</b> ${T('(3x^{-1}y^2)^2=9x^{-2}y^4')}. Now sort the pieces.` }], top: ['9', 'x-2', 'y4'], bot: ['9', 'x-4', 'y5'] }
};
const VCOL = ['u2l7-v1', 'u2l7-v2', 'u2l7-v3'];
const sorter = {
  title: 'Sort it out: numbers together, each letter on its own',
  height: 430,
  choices: [{ v: 't1', label: T(SO.t1.chip) }, { sep: 'Example 2 check:' }, { v: 'e2', label: 'Ex. 2' }, { sep: 'Example 3 check:' }, { v: 'e3b', label: '(b)' }, { sep: 'Example 4 check:' }, { v: 'e4b', label: '(b)' }],
  intro: (k) => `Simplify ${T(SO[k].orig)} and write it with positive exponents. <b>Numbers</b> together, then <b>each letter</b> on its own.`,
  make(stage, k, ex) {
    const it = SO[k], W = ex.W;
    let id = 0;
    const parse = (t, row) => {
      const m = /^([a-z])(-?\d+)?$/.exec(t);
      if (m) return { id: id++, x: m[1], e: m[2] == null ? 1 : Number(m[2]), row };
      return { id: id++, num: true, n: t, v: [Number(t), 1], row };
    };
    const top = it.top.map((t) => parse(t, 't')), bot = it.bot.map((t) => parse(t, 'b')), all = [...top, ...bot];
    const vars = []; all.forEach((t) => { if (t.x && !vars.includes(t.x)) vars.push(t.x); });
    const col = (x) => VCOL[vars.indexOf(x)] || VCOL[0];
    const tokT = (t) => `\\htmlClass{u2l7-tk u2l7-tk${t.id} ${t.x ? col(t.x) : 'u2l7-nm'}}{${t.x ? (t.e === 1 ? t.x : `${t.x}^{${t.e}}`) : t.n}}`;
    const rowT = (ts) => ts.map((t, i) => (i && t.num ? '\\cdot ' : '') + tokT(t)).join('');
    const work = bot.length ? `\\dfrac{${rowT(top) || '1'}}{${rowT(bot)}}` : rowT(top);
    const lines = it.same ? [] : [...(it.pre || [])];
    const hist = add(stage, h('div', 'u2l7-so-hist'), 24, 8), cur = add(stage, h('div', 'u2l7-so-cur', K(it.same ? work : it.orig)), 24, 50);
    const nums = all.filter((t) => t.num), bins = [];
    const tops = nums.filter((t) => t.row === 't'), bots = nums.filter((t) => t.row === 'b');
    let coefV = [1, 1]; tops.forEach((t) => (coefV = qMul(coefV, t.v))); bots.forEach((t) => (coefV = qMul(coefV, [t.v[1], t.v[0]])));
    if (nums.length) {
      const left = bots.length ? `\\dfrac{${tops.map((t) => t.n).join('\\times') || 1}}{${bots.map((t) => t.n).join('\\times')}}` : tops.map((t) => t.n).join('\\times');
      bins.push({ kind: 'num', toks: nums, src: left === qT(coefV) ? left : `${left}=${qT(coefV)}` });
    }
    vars.forEach((x) => {
      const ts = all.filter((t) => t.x === x).sort((a, b) => (a.row === b.row ? 0 : a.row === 't' ? -1 : 1));
      const s = ts.reduce((a, t) => a + (t.row === 't' ? t.e : -t.e), 0);
      const terms = ts.map((t, i) => (t.row === 't' ? (i === 0 ? String(t.e) : t.e < 0 ? `+(${t.e})` : `+${t.e}`) : (i === 0 ? (t.e < 0 ? `-(${t.e})` : `-${t.e}`) : (t.e < 0 ? `-(${t.e})` : `-${t.e}`))));
      bins.push({ kind: 'var', x, toks: ts, terms, s });
    });
    const nb = bins.length, gap = 14, bw = Math.min(290, (W - 48 - gap * (nb - 1)) / nb), bx0 = (W - nb * bw - gap * (nb - 1)) / 2, BYp = 148, BH = 150;
    bins.forEach((bn, i) => {
      const el = add(stage, h('div', 'u2l7-so-bin ' + (bn.kind === 'num' ? 'u2l7-nm' : col(bn.x))), bx0 + i * (bw + gap), BYp); el.style.width = bw + 'px'; el.style.height = BH + 'px';
      el.innerHTML = `<div class="u2l7-so-bh">${bn.kind === 'num' ? 'Numbers' : K(bn.x)}</div>`;
      const body = h('div', 'u2l7-so-bb'); el.appendChild(body);
      if (bn.kind === 'num') { bn.slot = h('div', 'u2l7-so-coef', K(bn.src)); body.appendChild(bn.slot); hide(bn.slot); }
      else {
        const line = h('div', 'u2l7-so-terms'); body.appendChild(line);
        bn.slots = bn.terms.map((t, j) => { const s = h('span', 'u2l7-so-term', K((j ? '{}' : '') + t)); line.appendChild(s); hide(s); return s; });
        bn.eq = h('span', 'u2l7-so-term eq', K(`{}=${bn.s}`)); line.appendChild(bn.eq); hide(bn.eq);
        bn.pow = h('div', 'u2l7-so-pow', K(bn.s === 0 ? `${bn.x}^{0}=1` : `${bn.x}^{${bn.s}}`)); body.appendChild(bn.pow); hide(bn.pow);
      }
      bn.el = el; hide(el);
    });
    const cT = coefV[0] === 1 && coefV[1] === 1 ? '' : qT(coefV, '\\tfrac');
    const vT = (x, s) => `\\htmlClass{${col(x)}}{${Math.abs(s) === 1 ? (s === 1 ? x : `${x}^{-1}`) : `${x}^{${s}}`}}`;
    const mid = cT + bins.filter((bn) => bn.kind === 'var' && bn.s !== 0).map((bn) => vT(bn.x, bn.s)).join('') || '1';
    const pos = bins.filter((bn) => bn.kind === 'var' && bn.s > 0), negs = bins.filter((bn) => bn.kind === 'var' && bn.s < 0);
    const nP = Math.abs(coefV[0]), dP = coefV[1];
    const numS = ((nP !== 1 || !pos.length) ? tn(nP) : '') + pos.map((bn) => vT(bn.x, bn.s)).join('');
    const denS = (dP !== 1 ? tn(dP) : '') + negs.map((bn) => vT(bn.x, -bn.s)).join('');
    const fin = (coefV[0] < 0 ? '-' : '') + (denS ? `\\dfrac{${numS}}{${denS}}` : numS);
    const resEl = add(stage, h('div', 'u2l7-so-res'), 24, 330);
    const r1 = h('span', 'u2l7-so-rp', K('=' + mid)), r2 = h('span', 'u2l7-so-rp fin', K('=' + fin)); resEl.append(r1, r2); hide(r1, r2);
    const steps = [];
    lines.forEach((ln) => steps.push({
      cap: ln.cap, run: async (c) => {
        hist.innerHTML = cur.innerHTML; cur.innerHTML = K('=' + work);
        await Promise.all([c.fadeIn(hist, 350, { from: 'translateY(30px) scale(1.2)' }), c.fadeIn(cur, 450, { delay: 150 })]);
      }
    }));
    bins.forEach((bn) => {
      let cap;
      if (bn.kind === 'num') cap = `<b>Numbers:</b> ${tops.map((t) => t.n).join(' × ')} on top, ${bots.map((t) => t.n).join(' × ')} on the bottom: ${T(bn.src)}.` + (coefV[0] === 1 && coefV[1] === 1 ? ' They cancel completely.' : '');
      else {
        const anyB = bn.toks.some((t) => t.row === 'b'), anyT = bn.toks.some((t) => t.row === 't');
        cap = `${K(`\\htmlClass{${col(bn.x)}}{${bn.x}}`)}: ` + (anyB && anyT ? 'top exponent <b>minus</b> bottom exponent: ' : 'same base, multiplying, so <b>add</b>: ') + `${T(`${bn.terms.join('')}=${bn.s}`)}.` + (bn.terms.some((t) => t.startsWith('-(')) ? ' Subtracting a negative <b>adds</b>.' : '');
      }
      steps.push({
        cap, run: async (c) => {
          const jobs = [c.fadeIn(bn.el, 300)];
          if (bn.kind === 'num') {
            bn.toks.forEach((t, i) => { const tk = cur.querySelector('.u2l7-tk' + t.id); if (tk) tk.classList.add('used'); jobs.push(fly(c, stage, tk, bn.slot, t.n, { fs: 26, delay: i * 160, cls: 'u2l7-nm' })); });
            await Promise.all(jobs); bn.slot.style.opacity = 0; await c.fadeIn(bn.slot, 350);
          } else {
            bn.toks.forEach((t, i) => { const tk = cur.querySelector('.u2l7-tk' + t.id); if (tk) tk.classList.add('used'); jobs.push(fly(c, stage, tk, bn.slots[i], t.e === 1 ? t.x : `${t.x}^{${t.e}}`, { fs: 26, delay: i * 170, cls: col(t.x) })); });
            await Promise.all(jobs);
            await Promise.all([c.fadeIn(bn.eq, 300), c.pop(bn.pow, 380, { delay: 150 })]);
          }
        }
      });
    });
    steps.push({
      cap: `Put the pieces together: ${K(mid)}.` + (negs.length ? ' Not finished: there are <b>negative exponents</b> left.' : ' All the exponents are positive.'),
      run: (c) => Promise.all([c.fadeIn(r1, 400), ...bins.map((bn) => pulse(c, bn.kind === 'num' ? bn.slot : bn.pow))])
    });
    if (fin !== mid) steps.push({
      cap: `<b>Last step, positive exponents:</b> ${negs.map((bn) => K(vT(bn.x, bn.s))).join(', ')} ${negs.length === 1 ? 'moves' : 'move'} to the bottom with a positive exponent. Everything else stays on top: <b>${K(fin)}</b>.`,
      run: (c) => c.pop(r2, 450)
    });
    return steps;
  }
};

/* =====================================================================
 * A fraction to a negative power: flip it (from 10C 2.3)
 * ===================================================================== */
const FL = {
  n2x: { a: '2', b: 'x', n: 2, alg: true, B: 'x^{2}', A: '2^{2}', fin: '\\dfrac{x^{2}}{4}', ev: '2^2=4' },
  n13: { a: 1, b: 3, n: 2 }, n35: { a: 3, b: 5, n: 2 }, n45: { a: 4, b: 5, n: 1 },
  y2: { a: 'y', b: '2', n: 3, alg: true, B: '2^{3}', A: 'y^{3}', fin: '\\dfrac{8}{y^{3}}', ev: '2^3=8' }
};
const flip = {
  title: 'A fraction to a negative power: flip it',
  height: 380,
  choices: ['n2x', 'n13', 'n35', 'n45', 'y2'].map((k) => ({ v: k, label: T(`\\left(\\tfrac{${FL[k].a}}{${FL[k].b}}\\right)^{-${FL[k].n}}`) })),
  intro: (k) => { const f = FL[k]; return f.alg ? `Simplify ${T(`\\left(\\dfrac{${f.a}}{${f.b}}\\right)^{-${f.n}}`)}. Flip, then the power goes to the top <b>and</b> the bottom.` : `Evaluate ${T(`\\left(\\dfrac{${f.a}}{${f.b}}\\right)^{-${f.n}}`)}. First the long way, then the shortcut.`; },
  make(stage, k, ex) {
    const f = FL[k], W = ex.W, H = 380, n = f.n;
    const orig = `\\left(\\dfrac{${f.a}}{${f.b}}\\right)^{-${n}}`;
    const row1 = add(stage, h('div', 'u2l7-fl-row'), 24, 30), row2 = add(stage, h('div', 'u2l7-fl-row'), 24, 192);
    row1.appendChild(h('span', 'u2l7-fl-pc', K(orig)));
    const lines = [row1, row2, row2].map((r) => { const e = h('span', 'u2l7-fl-pc'); r.appendChild(e); hide(e); return e; });
    const PX = W * 0.56, PW = W - PX - 18;
    add(stage, h('div', 'u2l7-fl-panel', '<div class="u2l7-fl-ph">The shortcut</div>'), PX, 12).style.cssText += `width:${PW}px;height:${H - 24}px;`;
    const cx = PX + PW / 2, cy = 168, FS = 46;
    const num = add(stage, h('div', 'u2l7-fl-n c', K(String(f.a))), cx, cy - 42), den = add(stage, h('div', 'u2l7-fl-n c', K(String(f.b))), cx, cy + 42);
    num.style.fontSize = den.style.fontSize = FS + 'px';
    const bw = 64;
    const bar = add(stage, h('div', 'u2l7-fl-bar c'), cx, cy); bar.style.width = bw + 'px';
    const parens = add(stage, svgEl('svg', { class: 'u2l7-fl-par', width: bw + 80, height: 172 }), cx - bw / 2 - 40, cy - 86);
    parens.append(svgEl('path', { d: 'M24 6 Q4 86 24 166' }), svgEl('path', { d: `M${bw + 56} 6 Q${bw + 76} 86 ${bw + 56} 166` }));
    const expo = add(stage, h('div', 'u2l7-fl-exp', K(`-${n}`)), cx + bw / 2 + 40, cy - 98);
    const tag = add(stage, h('div', 'u2l7-fl-tag c', 'flip!'), Math.min(cx + bw / 2 + 92, W - 46), cy + 4); hide(tag);
    const valEl = add(stage, h('div', 'u2l7-fl-val c'), cx, cy + 148); hide(valEl);
    const frac = (p, q) => (q === 1 ? String(p) : `\\dfrac{${p}}{${q}}`);
    const flipRun = async (c) => {
      const kfN = [{ left: cx + 'px', top: cy - 42 + 'px' }, { left: cx + 96 + 'px', top: cy + 'px' }, { left: cx + 'px', top: cy + 42 + 'px' }];
      const kfD = [{ left: cx + 'px', top: cy + 42 + 'px' }, { left: cx - 96 + 'px', top: cy + 'px' }, { left: cx + 'px', top: cy - 42 + 'px' }];
      await Promise.all([c.anim(num, kfN, 900, { easing: 'ease-in-out' }), c.anim(den, kfD, 900, { easing: 'ease-in-out' }), c.fadeIn(tag, 300, { delay: 300 }),
        c.anim(expo, [{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], 300, { delay: 450 })]);
      expo.innerHTML = K(String(n)); expo.classList.add('pos');
      await c.anim(expo, [{ transform: 'scale(1.5)', color: '#c93a33' }, { transform: 'scale(1)', color: '#12805a' }], 420);
    };
    const show = (i, src) => { lines[i].innerHTML = K(src); };
    const steps = [];
    if (f.alg) {
      steps.push({ cap: `A negative power on a fraction <b>flips</b> it, and the exponent becomes positive: ${T(`${orig}=\\left(\\dfrac{${f.b}}{${f.a}}\\right)^{${n}}`)}.`, run: async (c) => { show(0, `=\\left(\\dfrac{${f.b}}{${f.a}}\\right)^{${n}}`); await Promise.all([flipRun(c), c.fadeIn(lines[0], 400, { delay: 500 })]); } });
      steps.push({ cap: `Power of a quotient: the ${n} goes to the top <b>and</b> the bottom: ${T(`\\dfrac{${f.B}}{${f.A}}`)}.`, run: (c) => { show(1, `=\\dfrac{${f.B}}{${f.A}}`); return c.fadeIn(lines[1], 400); } });
      steps.push({ cap: `Evaluate: ${T(f.ev)}. Every exponent is positive, so we’re done: <b>${T(f.fin)}</b>.`, run: (c) => { show(2, '=' + f.fin); valEl.innerHTML = K('=' + f.fin); return Promise.all([c.fadeIn(lines[2], 400), c.pop(valEl, 450, { delay: 200 })]); } });
      return steps;
    }
    const A = f.a ** n, B = f.b ** n;
    const pq = `\\left(\\frac{${f.a}}{${f.b}}\\right)`;
    steps.push({ cap: `<b>The long way first.</b> Negative exponent law: a negative power is <b>one over</b> the positive power.`, run: (c) => { show(0, `=\\dfrac{1}{${pq}${n > 1 ? `^{${n}}` : ''}}`); return c.fadeIn(lines[0], 400); } });
    if (n > 1) steps.push({ cap: `Raise the top <b>and</b> the bottom to the power ${n}: ${T(`\\left(\\tfrac{${f.a}}{${f.b}}\\right)^{${n}}=\\tfrac{${A}}{${B}}`)}.`, run: (c) => { show(1, `=\\dfrac{1}{\\frac{${A}}{${B}}}`); return c.fadeIn(lines[1], 400); } });
    steps.push({ cap: `1 divided by a fraction is that fraction <b>flipped</b>: ${T(`1\\div\\tfrac{${A}}{${B}}=${frac(B, A).replace('dfrac', 'tfrac')}`)}.`, run: (c) => { show(n > 1 ? 2 : 1, `=${frac(B, A)}`); return c.fadeIn(lines[n > 1 ? 2 : 1], 400); } });
    steps.push({
      cap: n > 1 ? `Look: ${T(frac(B, A))} is ${T(`\\left(\\tfrac{${f.b}}{${f.a}}\\right)^{${n}}`)}. The negative exponent just <b>flipped the fraction</b>, and the exponent became positive!` : `${T(frac(B, A))} is just ${T(`\\tfrac{${f.a}}{${f.b}}`)} <b>flipped</b>. A power of ${T('-1')} gives the reciprocal.`,
      run: flipRun
    });
    const valSrc = n > 1 ? `=\\left(\\dfrac{${f.b}}{${f.a}}\\right)^{${n}}=${frac(B, A)}` : `=${frac(f.b, f.a)}`;
    steps.push({ cap: `<b>Shortcut:</b> flip the fraction, make the exponent positive, then evaluate: ${T(valSrc.slice(1).replace(/dfrac/g, 'tfrac'))}. Same answer, one step.`, run: (c) => { valEl.innerHTML = K(valSrc); return c.pop(valEl, 450); } });
    return steps;
  }
};

/* =====================================================================
 * Check it with a number (from 10C 2.2): substitute x = 2
 * ===================================================================== */
const CHECKS = {
  ex1: { o: '4x^{3}\\cdot x^{-7}\\cdot x^{0}', oS: ['4(2)^{3}\\cdot(2)^{-7}\\cdot(2)^{0}', '=4\\times8\\times\\dfrac{1}{128}\\times1'], oV: '\\tfrac{1}{4}',
    a: '\\dfrac{4}{x^{4}}', aS: ['\\dfrac{4}{(2)^{4}}', '=\\dfrac{4}{16}'], aV: '\\tfrac{1}{4}',
    who: 'Sam', w: '\\dfrac{1}{4x^{4}}', wS: ['\\dfrac{1}{4(2)^{4}}', '=\\dfrac{1}{4\\times16}'], wV: '\\tfrac{1}{64}', why: 'he flipped the 4 too, but the exponent only touches the ' + T('x') },
  e3a: { o: '(3x^{2})^{-2}\\times x^{5}', oS: ['(3(2)^{2})^{-2}\\times(2)^{5}', '=\\dfrac{1}{144}\\times32=\\dfrac{32}{144}'], oV: '\\tfrac{2}{9}',
    a: '\\dfrac{x}{9}', aS: ['\\dfrac{2}{9}'], aV: '\\tfrac{2}{9}',
    who: 'Mia', w: '9x', wS: ['9(2)'], wV: '18', why: `she wrote ${T('3^{-2}')} as 9 instead of ${T('\\tfrac19')}` },
  e5: { o: '\\dfrac{(2x^{3}y^{0})^{-2}\\times 6x^{5}}{3x^{-4}}', oS: ['\\dfrac{(2(2)^{3})^{-2}\\times6(2)^{5}}{3(2)^{-4}}', '=\\dfrac{16^{-2}\\times192}{3\\times\\frac{1}{16}}', '=\\dfrac{3}{4}\\div\\dfrac{3}{16}'], oV: '4',
    a: '\\dfrac{x^{3}}{2}', aS: ['\\dfrac{(2)^{3}}{2}', '=\\dfrac{8}{2}'], aV: '4',
    who: 'Leo', w: '-8x^{3}', wS: ['-8(2)^{3}', '=-8\\times8'], wV: '-64', why: `he made ${T('2^{-2}=-4')}: a negative exponent means <b>flip</b>, not negative` }
};
const check = {
  title: 'Check it with a number',
  height: 452,
  choices: [{ sep: 'Example 1:' }, { v: 'ex1', label: 'Ex. 1' }, { sep: 'Example 3:' }, { v: 'e3a', label: '(a)' }, { sep: 'Example 5:' }, { v: 'e5', label: 'Ex. 5' }],
  intro: (k) => { const d = CHECKS[k]; return `We simplified ${T(d.o)} to ${T(d.a)}. ${d.who} got ${T(d.w)}. Substitute ${T('x=2')}: which one is really <b>equal</b>?`; },
  make(stage, key, ex) {
    const W = ex.W, d = CHECKS[key], cw = (W - 60) / 3, cy = 66;
    const pick = add(stage, h('div', 'u2l7-ck-pick', `Test value: ${K('x=2')}`), 20, 12); hide(pick);
    const card = (i, head, e, S, V) => {
      const el = add(stage, h('div', 'u2l7-ck-card', `<div class="u2l7-ck-h">${head}</div><div class="u2l7-ck-e">${K(e)}</div><div class="u2l7-ck-s">${S.map((s, j) => `<div>${K((j ? '' : '=') + s)}</div>`).join('')}</div><div class="u2l7-ck-v">${K(`=\\boldsymbol{${V}}`)}</div>`), 20 + i * (cw + 10), cy);
      el.style.width = cw + 'px'; const s = el.querySelector('.u2l7-ck-s'), v = el.querySelector('.u2l7-ck-v'); hide(s, v); return { el, s, v };
    };
    const C0 = card(0, 'The question', d.o, d.oS, d.oV), C1 = card(1, 'Our answer', d.a, d.aS, d.aV), C2 = card(2, d.who + '’s answer', d.w, d.wS, d.wV);
    const st1 = add(stage, h('div', 'u2l7-stamp ok', '✓'), 20 + 2 * cw + 10 - 58, cy + 8), st2 = add(stage, h('div', 'u2l7-stamp no', '✗'), 20 + 3 * cw + 20 - 58, cy + 8); hide(st1, st2);
    const stampIn = (c, el) => c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' });
    return [{
      cap: `Pick a test value: ${T('x=2')}. <b>Not 0 or 1</b>: 1 to any power is 1, so ${T('x=1')} can hide a wrong exponent.`,
      run: (c) => c.pop(pick, 380)
    }, {
      cap: `Substitute into the <b>question</b>, using the order of operations. It works out to <b>${T(d.oV)}</b>.`,
      run: (c) => Promise.all([c.fadeIn(C0.s, 380), c.pop(C0.v, 400, { delay: 300 })])
    }, {
      cap: `Now our answer: ${T(d.a)} also gives <b>${T(d.aV)}</b>. The values <b>match</b> ✓, so the simplification checks out.`,
      run: async (c) => { await Promise.all([c.fadeIn(C1.s, 380), c.pop(C1.v, 400, { delay: 300 })]); C0.el.classList.add('good'); C1.el.classList.add('good'); await stampIn(c, st1); }
    }, {
      cap: `${d.who}’s answer gives <b>${T(d.wV)}</b>, not ${T(d.oV)}. Equal expressions are equal for <b>every</b> value, so ${T(d.w)} is <b>wrong</b>: ${d.why}.`,
      run: async (c) => { await Promise.all([c.fadeIn(C2.s, 380), c.pop(C2.v, 400, { delay: 300 })]); C2.el.classList.add('bad'); await stampIn(c, st2); }
    }];
  }
};

/* =============================== mount =============================== */
mountCode();
export const explainers = mountExplainers({ laws, hops, steps, outer, sorter, flip, steps5, check });
export const _test = { LAWC, STEPC, HOPS, OUT, SO, FL, CHECKS };

/* ============ Stand Up Break! — zero, negative and positive exponents together, at the whiteboards ============ */
standup('u2l7', (() => {
  const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const mono = (c, e = {}) => ({ c: Array.isArray(c) ? fr(c[0], c[1]) : [c, 1], e: { ...e } });
  const mul = (a, b) => { const e = { ...a.e }; for (const k in b.e) e[k] = (e[k] || 0) + b.e[k]; return { c: fr(a.c[0] * b.c[0], a.c[1] * b.c[1]), e }; };
  const powr = (a, k) => { const e = {}; for (const v in a.e) e[v] = a.e[v] * k; const n = Math.pow(a.c[0], Math.abs(k)), d = Math.pow(a.c[1], Math.abs(k)); return { c: k >= 0 ? fr(n, d) : fr(d, n), e }; };
  const div = (a, b) => mul(a, powr(b, -1));
  const vt = (v, e) => (e === 0 ? '' : e === 1 ? v : v + '^{' + e + '}');
  const vars = (e, f = (x) => x) => Object.keys(e).map((v) => vt(v, f(e[v]))).join('');
  const fT = (c) => (c[1] === 1 ? String(c[0]) : (c[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(c[0]) + '}{' + c[1] + '}');
  const coefT = (c, has) => (has && c[1] === 1 && Math.abs(c[0]) === 1 ? (c[0] < 0 ? '-' : '') : fT(c));
  const inT = (m) => { const vs = Object.keys(m.e).map((v) => (m.e[v] === 1 ? v : v + '^{' + m.e[v] + '}')).join(''); return coefT(m.c, !!vs) + vs; };
  const rawT = (m) => { const e = Object.fromEntries(Object.entries(m.e).filter(([, x]) => x !== 0)); return coefT(m.c, !!Object.keys(e).length) + vars(e); };
  const posT = (m) => {
    const top = Object.fromEntries(Object.entries(m.e).filter(([, x]) => x > 0)), bot = Object.fromEntries(Object.entries(m.e).filter(([, x]) => x < 0));
    const Tt = vars(top), B = vars(bot, (x) => -x), n = Math.abs(m.c[0]), d = m.c[1], s = m.c[0] < 0 ? '-' : '';
    if (!B && d === 1) return s + (n === 1 && Tt ? '' : n) + Tt;
    return s + '\\dfrac{' + ((n === 1 && Tt ? '' : n) + Tt) + '}{' + ((d === 1 && B ? '' : d) + B) + '}';
  };
  const pn = (x) => (x < 0 ? '(' + x + ')' : String(x));
  const M = (c, list) => mono(c, Object.fromEntries(list));
  const nz = (r, lo, hi) => { let v; do { v = r.int(lo, hi); } while (v === 0); return v; };
  const LET = [['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['s', 't'], ['x', 'y']];
  const allPos = (m) => Object.values(m.e).every((x) => x >= 0) && m.c[1] === 1;
  /* exponent line for each letter: x^{a+b-(c)}=x^{s} */
  const expLines = (F, G = []) => {
    const letters = [...new Set([...F, ...G].flatMap((m) => Object.keys(m.e)))];
    return letters.map((v) => {
      const ops = [...F.filter((m) => v in m.e).map((m) => [1, m.e[v]]), ...G.filter((m) => v in m.e).map((m) => [-1, m.e[v]])];
      let tot = 0; const s = ops.map(([sg, x], i) => { tot += sg * x; return i === 0 ? (sg < 0 ? '-' + pn(x) : String(x)) : (sg < 0 ? '-' : '+') + pn(x); }).join('');
      return ops.length > 1 || ops[0][0] < 0 ? v + '^{' + s + '}=' + (tot === 0 ? v + '^{0}=1' : vt(v, tot)) : null;
    }).filter(Boolean).join(',\\quad ');
  };
  const bracketLine = (A, n) => '(' + inT(A) + ')^{' + n + '}=' + (A.c[0] !== 1 ? A.c[0] + '^{' + n + '}' : '') + Object.keys(A.e).map((v) => v + '^{' + pn(A.e[v]) + '\\times' + pn(n) + '}').join('') + '=' + rawT(powr(A, n));
  return {
    intro: 'Simplify at your whiteboard station: brackets first, then combine matching bases, then zero and negative exponents last. Final answers with positive exponents only.',
    levels: {
      BEG: (r) => { // Examples 1–2: one or two laws, then flip
        const [v] = r.pick(LET), t = r.pick(['p', 'p0', 'q', 'q', 'pp', 'p0']);
        for (;;) {
          if (t === 'p' || t === 'p0') {
            const c = r.pick([1, 2, 3, 4, 5, 6, 7]), a = nz(r, -8, 8), b = nz(r, -8, 8); if (a > 0 && b > 0) continue;
            const s = a + b; if (s === 0 || s > 9) continue;
            const q = (c === 1 ? '' : c) + vt(v, a) + '\\cdot ' + vt(v, b) + (t === 'p0' ? '\\cdot ' + v + '^{0}' : '');
            const sum = String(a) + '+' + pn(b) + (t === 'p0' ? '+0' : '');
            return { q, a: [(c === 1 ? '' : c) + v + '^{' + sum + '}=' + (c === 1 ? '' : c) + v + '^{' + s + '}', '=' + posT(M(c, [[v, s]]))] };
          }
          if (t === 'q') {
            const d = r.int(1, 6), k = r.int(2, 6), a = nz(r, -7, 7), b = nz(r, -7, 7); if (a > 0 && b > 0) continue;
            const s = a - b; if (s === 0 || Math.abs(s) > 12) continue;
            return { q: d * k + vt(v, a) + '\\div ' + (d === 1 ? '' : d) + vt(v, b), a: [(d === 1 ? '' : d * k + '\\div' + d + '=' + k + ',\\quad ') + v + '^{' + a + '-' + pn(b) + '}=' + v + '^{' + s + '}', '=' + posT(M(k, [[v, s]]))] };
          }
          const a = nz(r, -5, 5), b = nz(r, -3, 4); if (a > 0 && b > 0) continue; if (a === 1 || b === 1) continue;
          return { q: '(' + vt(v, a) + ')^{' + b + '}', a: [v + '^{' + pn(a) + '\\times' + pn(b) + '}=' + v + '^{' + a * b + '}', '=' + posT(M(1, [[v, a * b]]))] };
        }
      },
      PRG: (r) => { // Example 3: a bracket (often to a negative power), then combine
        const [v, w] = r.pick(LET), t = r.pick(['a', 'a', 'b', 'b', 'c']);
        for (;;) {
          if (t === 'a') { // (c v^a)^{-n} × v^b
            const [c, n] = r.pick([[2, 2], [2, 3], [3, 2], [4, 2], [5, 2], [2, 1], [3, 1], [3, 3]]), a = nz(r, -3, 4), b = nz(r, -6, 8);
            const A = M(c, [[v, a]]), P = powr(A, -n), res = mul(P, M(1, [[v, b]]));
            if (res.e[v] === 0 || Math.abs(res.e[v]) > 14) continue;
            return { q: '(' + inT(A) + ')^{-' + n + '}\\times ' + vt(v, b), a: [bracketLine(A, -n), '\\times ' + vt(v, b) + ':\\quad ' + expLines([P, M(1, [[v, b]])]), '=' + posT(res)] };
          }
          if (t === 'b') { // (c v^a w^b)^n over d v^p w^q
            const [c, n] = r.pick([[2, 2], [3, 2], [2, 3], [1, 2], [1, 3]]), A = M(c, [[v, nz(r, -3, 4)], [w, nz(r, -2, 3)]]), P = powr(A, n);
            const d = r.pick([1, c ** n, c ** n, c]), D = M(d, [[v, nz(r, -5, 7)], [w, nz(r, -4, 5)]]);
            if ([A, D].every((m) => Object.values(m.e).every((x) => x > 0))) continue;
            const res = div(P, D); if (Object.values(res.e).some((x) => x === 0 || Math.abs(x) > 14) || allPos(res)) continue;
            return { q: '\\dfrac{(' + inT(A) + ')^{' + n + '}}{' + inT(D) + '}', a: [bracketLine(A, n), (c ** n !== d ? '\\tfrac{' + c ** n + '}{' + d + '}=' + fT(res.c) + ',\\quad ' : '') + expLines([P], [D]), '=' + posT(res)] };
          }
          const A = M(1, [[v, nz(r, -5, 5)], [w, nz(r, -5, 5)]]), n = r.pick([2, 3, 4]);
          if (Object.values(A.e).every((x) => x > 0)) continue;
          const P = powr(A, -n); if (allPos(P)) continue;
          return { q: '(' + inT(A) + ')^{-' + n + '}', a: [bracketLine(A, -n), '=' + posT(P)] };
        }
      },
      MAS: (r) => { // Examples 4–5: inside first, fractions to negative powers, the whole checklist
        const [v, w] = r.pick(LET), t = r.pick(['in', 'in', 'ex5', 'ex5', 'fr']);
        for (;;) {
          if (t === 'in') { // (c v^a / v^b)^{-n}
            const [c, n] = r.pick([[2, 2], [3, 2], [2, 3], [2, 1], [3, 1], [4, 2], [5, 1]]), a = nz(r, -4, 6), b = nz(r, -4, 6); if (a === b || (a > 0 && b > 0 && r.chance(0.6))) continue;
            const inner = M(c, [[v, a - b]]), res = powr(inner, -n); if (Math.abs(res.e[v]) > 15) continue;
            return { q: '\\left(\\dfrac{' + c + vt(v, a) + '}{' + vt(v, b) + '}\\right)^{-' + n + '}', a: ['\\text{inside: }' + v + '^{' + a + '-' + pn(b) + '}=' + vt(v, a - b) + ',\\ \\text{so }(' + inT(inner) + ')^{-' + n + '}', '=' + rawT(res), '=' + posT(res)] };
          }
          if (t === 'ex5') { // (c v^a w^0)^{-n} × d v^b ÷ (e v^f)
            const [c, n] = r.pick([[2, 1], [3, 1], [2, 2], [3, 2], [4, 1]]), a = r.int(1, 4), b = nz(r, -3, 7), f = nz(r, -5, 5);
            const d = r.pick([2, 3, 4, 6, 8, 9, 12]), e = r.pick([2, 3, 4, 6]);
            const P = powr(M(c, [[v, a]]), -n), top = mul(P, M(d, [[v, b]])), res = div(top, M(e, [[v, f]]));
            if (res.e[v] === 0 || Math.abs(res.e[v]) > 14 || res.c[1] > 12 || res.c[0] > 12) continue;
            return { q: '\\dfrac{(' + c + vt(v, a) + w + '^{0})^{-' + n + '}\\times ' + d + vt(v, b) + '}{' + e + vt(v, f) + '}',
              a: [w + '^{0}=1:\\quad (' + c + vt(v, a) + ')^{-' + n + '}=' + rawT(P), '\\text{top: }' + rawT(top), '\\text{divide: }' + rawT(res), '=' + posT(res)] };
          }
          const p = r.int(2, 5), a = r.pick([1, 1, 2, 3]), n = r.pick([1, 2, 3]), num = r.chance(0.5); // (p / v^a)^{-n} or (v^a / p)^{-n}
          if (p ** n > 125) continue;
          const frT = num ? '\\dfrac{' + p + '}{' + vt(v, a) + '}' : '\\dfrac{' + vt(v, a) + '}{' + p + '}', flT = num ? '\\dfrac{' + vt(v, a) + '}{' + p + '}' : '\\dfrac{' + p + '}{' + vt(v, a) + '}';
          const ans = num ? '\\dfrac{' + vt(v, a * n) + '}{' + p ** n + '}' : '\\dfrac{' + p ** n + '}{' + vt(v, a * n) + '}';
          return { q: '\\left(' + frT + '\\right)^{-' + n + '}', a: n === 1 ? ['\\text{flip: }' + flT] : ['\\text{flip: }\\left(' + flT + '\\right)^{' + n + '}', '=' + ans] };
        }
      }
    }
  };
})());
