/* Math 15 · Unit 2 · Lesson 6 — Negative Exponents.
 * Warm-up (The Fridge Mould: a slice of bread with mould spots that triple every hour, tap the earlier hours to reveal
 * 1/3 and 1/9 cm², and the midnight poll) and the explainers:
 *   nstairs (walk down the stairs past zero: each step divides by the base — from the 10C u2l3 "stairs"),
 *   nline   (small, not negative: 2⁻³ is not −8; zoom in and halve towards 0 on a number line),
 *   nrecip  (take the reciprocal, make the exponent positive, evaluate; then "start at 1 and divide n times": Example 1),
 *   nvar    (the same with a variable base: stop at 1/xⁿ — Example 2),
 *   ndiv    (a negative exponent downstairs: 1 ÷ 1/8 = how many eighths fit in 1? — Example 3),
 *   nmove   (move only what the exponent touches across the fraction bar — from the 10C u2l3 "move": Example 4),
 *   ncancel (xᵐ ÷ xⁿ written out and cancelled, with coefficients; the quotient law gives a negative exponent: Example 5).
 * Colours: a negative exponent red, the positive one it becomes green, the pattern amber. */
import { h } from '../explain.js';
import { tex, mountExplainers, tween } from '../blocks.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
function Q(p, q = 1) { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; return [p / g, q / g]; }
const qPow = (b, e) => (e >= 0 ? Q(b[0] ** e, b[1] ** e) : Q(b[1] ** -e, b[0] ** -e));
const tn = (n) => (Math.abs(n) >= 1000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : String(n)); // 1000 → 1\,000
const qT = ([p, q], d = '\\dfrac') => (q === 1 ? tn(p) : (p < 0 ? '-' : '') + `${d}{${tn(Math.abs(p))}}{${tn(q)}}`);
const NEG = (e) => `\\htmlClass{u2l6-neg}{${e}}`, POS = (e) => `\\htmlClass{u2l6-pos}{${e}}`;
/* width/height of some HTML at a font size, measured off-screen inside the stage */
function measure(stage, html, fs) {
  const e = h('div', 'u2l6-meas', html); e.style.fontSize = fs + 'px'; stage.appendChild(e);
  const r = [e.offsetWidth, e.offsetHeight]; e.remove(); return r;
}
const pulse = (c, el, s = 1.15, ms = 420) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], ms);

/* =====================================================================
 * Warm-up: the fridge mould
 * ===================================================================== */
function mountBread() {
  const host = document.getElementById('u2l6-bread'); if (!host) return;
  const T = [['10 am', [1, 9]], ['11 am', [1, 3]], ['NOON', [1, 1]], ['1 pm', [3, 1]], ['2 pm', [9, 1]], ['3 pm', [27, 1]]];
  const U = 17; // px for the side of a 1 cm² spot
  const slice = h('div', 'u2l6-slice'); host.appendChild(slice);
  T.forEach(([t, [p, q]], i) => {
    const col = h('div', 'u2l6-bc' + (i === 2 ? ' noon' : ''));
    const side = U * Math.sqrt(p / q);
    const spot = h('div', 'u2l6-spot'); spot.style.width = spot.style.height = Math.max(side, 2.5) + 'px';
    const pic = h('div', 'u2l6-bpic'); pic.appendChild(spot);
    const lab = h('div', 'u2l6-bsz', q === 1 ? `${p} cm²` : `${K(`\\tfrac{1}{${q}}`)} cm²`);
    col.append(h('div', 'u2l6-bt', t), pic);
    slice.appendChild(col);
    const sz = h('div', 'u2l6-bsc'); sz.appendChild(lab);
    if (i < 2) {
      spot.classList.add('u2l6-hid'); lab.classList.add('u2l6-hid');
      const b = h('button', 'u2l6-bq', '?'); b.type = 'button'; pic.appendChild(b);
      const qq = h('span', 'u2l6-cr u2l6-qlab', '? cm²'); sz.appendChild(qq);
      b.addEventListener('click', () => { spot.classList.remove('u2l6-hid'); lab.classList.remove('u2l6-hid'); b.remove(); qq.remove(); });
    }
    col.appendChild(sz);
  });
  const arr = h('div', 'u2l6-barr');
  ['÷ 3', '÷ 3', '× 3', '× 3', '× 3'].forEach((s, i) => arr.appendChild(h('span', i < 2 ? 'back' : 'fwd', i < 2 ? `<b>←</b> ${s}` : `${s} <b>→</b>`)));
  host.appendChild(arr);
}

/* =====================================================================
 * 1. Walk down the stairs, right past zero (the 10C stairs)
 * ===================================================================== */
const BASES = { 2: { b: [2, 1], t: '2' }, 3: { b: [3, 1], t: '3' }, 5: { b: [5, 1], t: '5' }, 10: { b: [10, 1], t: '10' } };
const nstairs = {
  title: 'Walk down the stairs, right past zero',
  height: 440,
  choices: [2, 3, 5, 10].map((v) => ({ v, label: tex(`${v}^n`) })),
  intro: (v) => { const B = BASES[v]; return `Start at the top step: ${tex(`${B.t}^{3}=${qT(qPow(B.b, 3), '\\tfrac')}`)}. Each step <b>down</b>, the exponent drops by <b>1</b>. What happens to the value?`; },
  make(stage, v, ex) {
    const W = ex.W, H = 440, B = BASES[v], E = [3, 2, 1, 0, -1, -2, -3], N = 7, colW = (W - 36) / N, x0 = 18;
    const sy = (i) => 206 + i * 28, bT = B.t;
    const pw = (e) => `${bT}^{${e}}`, val = (e, d) => qT(qPow(B.b, e), d);
    const svg = add(stage, svgEl('svg', { class: 'u2l6-st-svg', width: W, height: H }), 0, 0);
    E.forEach((e, i) => {
      svg.appendChild(svgEl('rect', { x: x0 + i * colW, y: sy(i), width: colW + 0.5, height: H - sy(i), class: 'u2l6-st-step ' + (e < 0 ? 'neg' : e === 0 ? 'zero' : 'pos') }));
      const t = svgEl('text', { x: x0 + (i + 0.5) * colW, y: sy(i) + 40, class: 'u2l6-st-exp' + (e < 0 ? ' neg' : ''), 'text-anchor': 'middle' }); t.textContent = String(e).replace('-', '−'); svg.appendChild(t);
    });
    const lt = svgEl('text', { x: x0 + 8, y: H - 14, class: 'u2l6-st-explab' }); lt.textContent = 'exponent'; svg.appendChild(lt);
    const cards = E.map((e, i) => {
      const cd = add(stage, h('div', 'u2l6-st-card ' + (e < 0 ? 'neg' : e === 0 ? 'zero' : 'pos'), `<div class="u2l6-st-pow">${K(pw(e))}</div><div class="u2l6-st-val">${K('=' + val(e))}</div><div class="u2l6-st-x"></div>`), x0 + i * colW + 6, sy(i) - 192);
      cd.style.width = (colW - 12) + 'px'; if (i) hide(cd); return cd;
    });
    const divs = E.slice(1).map((e, i) => { const d = add(stage, h('div', 'u2l6-st-div', `÷ ${bT}`), x0 + (i + 1) * colW, sy(i + 1) + 24); hide(d); return d; });
    const prevT = (i) => val(E[i - 1], '\\tfrac');
    const steps = [];
    for (let i = 1; i < N; i++) {
      const e = E[i], now = `${pw(e)}=${val(e, '\\tfrac')}`, calc = tex(`${prevT(i)}\\div ${bT}=${val(e, '\\tfrac')}`);
      let cap;
      if (e > 0) cap = i === 1 ? `${calc}: one fewer factor of ${bT}, so the value is <b>divided by ${bT}</b>. ${tex(now)}.` : `Down another step: divide by ${bT} again. ${calc}, so ${tex(now)}.`;
      else if (e === 0) cap = `${calc}, so <b>${tex(`${pw(0)}=1`)}</b>, just like Lesson 5.`;
      else if (e === -1) cap = `Keep going <b>past zero</b>! ${calc}, so ${tex(now)}. Small, but <b>not negative</b>.` + (v === 3 ? ' (The mould at 11 am!)' : '');
      else cap = `${calc}, so ${tex(now)}.` + (e === -2 && v === 3 ? ' (The mould at 10 am.)' : e === -3 && v === 10 ? ' As a decimal that’s <b>0.001</b>.' : e === -2 ? ' The value keeps shrinking, but it never reaches 0 and never goes negative.' : '');
      steps.push({ cap, run: (c) => Promise.all([c.pop(divs[i - 1], 360), c.fadeIn(cards[i], 450, { delay: 200, from: 'translateY(-14px)' })]) });
    }
    steps.push({
      cap: `Compare the pairs: ${tex(`${pw(-3)}=\\dfrac{1}{${bT}^{3}}`)}, one over ${tex(`${bT}^{3}`)}. A negative exponent means <b>one over</b> the positive power: ${tex('a^{-n}=\\dfrac{1}{a^n}')}.`,
      run: async (c) => {
        const jobs = [];
        [4, 5, 6].forEach((i) => { const x = cards[i].querySelector('.u2l6-st-x'); x.innerHTML = K(`=\\dfrac{1}{${bT}^{${-E[i]}}}`); jobs.push(c.fadeIn(x, 400, { delay: (i - 4) * 150 })); });
        [[2, 4, 'p1'], [1, 5, 'p2'], [0, 6, 'p3']].forEach(([a, b, cl], k) => { cards[a].classList.add(cl); cards[b].classList.add(cl); jobs.push(pulse(c, cards[a], 1.1), c.anim(cards[b], [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }], 420, { delay: 300 + k * 150 })); });
        await Promise.all(jobs);
      }
    });
    return steps;
  }
};

/* =====================================================================
 * 2. Small, not negative: a number line that zooms in
 * ===================================================================== */
const NL = { 2: { n: 3, wide: [-9.5, 3], zoom: [-0.12, 2.25] }, 3: { n: 2, wide: [-10.5, 4], zoom: [-0.18, 3.35] }, 4: { n: 2, wide: [-17.5, 5], zoom: [-0.25, 4.5] } };
const nline = {
  title: 'Where does it land on the number line?',
  height: 340,
  choices: [{ v: 2, label: tex('2^{-3}') }, { v: 3, label: tex('3^{-2}') }, { v: 4, label: tex('4^{-2}') }],
  intro: (b) => `Some people think ${tex(`${b}^{-${NL[b].n}}=-${b ** NL[b].n}`)}. Let’s see where ${tex(`${b}^{-${NL[b].n}}`)} really lands.`,
  make(stage, b, ex) {
    const W = ex.W, cfg = NL[b], n = cfg.n, LY = 200, L = 40, R = W - 40;
    let win = cfg.wide.slice();
    const X = (v) => L + (v - win[0]) / (win[1] - win[0]) * (R - L);
    const svg = add(stage, svgEl('svg', { class: 'u2l6-nl-svg', width: W, height: 340 }), 0, 0);
    add(stage, h('div', 'u2l6-qhead', `Where is ${K(`${b}^{-${n}}`)} on the number line?`), 24, 12);
    const axis = svgEl('line', { x1: L - 14, y1: LY, x2: R + 14, y2: LY, class: 'u2l6-nl-axis' }); svg.appendChild(axis);
    const tg = svgEl('g'); svg.appendChild(tg);
    const draw = () => {
      tg.innerHTML = '';
      const span = win[1] - win[0], step = span > 8 ? 1 : 1, lab = span > 12 ? 2 : 1;
      for (let k = Math.ceil(win[0]); k <= Math.floor(win[1]); k += step) {
        const x = X(k); tg.appendChild(svgEl('line', { x1: x, y1: LY - (k ? 8 : 13), x2: x, y2: LY + (k ? 8 : 13), class: 'u2l6-nl-tick' + (k ? '' : ' z') }));
        if (k % lab === 0 || k === 0) { const t = svgEl('text', { x, y: LY + 36, class: 'u2l6-nl-tl' + (k ? '' : ' z'), 'text-anchor': 'middle' }); t.textContent = String(k).replace('-', '−'); tg.appendChild(t); }
      }
      if (span < 8) { // fractions between 0 and 1 get small ticks
        for (let j = 1; j <= n + 1; j++) { const v = 1 / b ** j, x = X(v); tg.appendChild(svgEl('line', { x1: x, y1: LY - 5, x2: x, y2: LY + 5, class: 'u2l6-nl-tick s' })); }
      }
      pts.forEach((p) => place(p));
    };
    // points: the wrong guess, then b^1, b^0, b^-1, …
    const pts = [];
    const mkPt = (v, src, cls, up) => {
      const d = add(stage, h('div', 'u2l6-nl-dot ' + cls), 0, LY), lb = add(stage, h('div', 'u2l6-nl-lab ' + cls, K(src)), 0, up ? LY - 64 : LY - 64);
      const p = { v, d, lb, up }; hide(d, lb); pts.push(p); return p;
    };
    const place = (p) => { const x = X(p.v), vis = p.v >= win[0] - 0.01 && p.v <= win[1] + 0.01, zoomed = win[1] - win[0] < 8; at(p.d, x, LY); at(p.lb, x, (zoomed ? p.liftZ : p.liftW) || LY - 64); p.d.style.visibility = p.lb.style.visibility = vis ? '' : 'hidden'; };
    const wrong = mkPt(-(b ** n), `-${b ** n}\\,?`, 'bad');
    const seq = [];
    for (let e = 1; e >= -n; e--) { const p = mkPt(b ** e, `${b}^{${e}}${e < 0 ? `=\\tfrac{1}{${b ** -e}}` : `=${b ** e}`}`, e < 0 ? 'neg' : 'pos'); p.liftZ = e === -2 ? LY + 78 : LY - 64; p.liftW = e === 0 ? LY + 78 : LY - 64; seq.push(p); }
    draw();
    const cross = add(stage, h('div', 'u2l6-nl-x', '✗'), 0, 0); hide(cross);
    const note = add(stage, h('div', 'u2l6-nl-note'), W * 0.62, 286); note.style.translate = '-50% 0'; hide(note);
    const zoomTo = (c, to, ms = 900) => { const from = win.slice(); return tween(c, ms, (t) => { win = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]; draw(); }); };
    const showPt = (c, p) => Promise.all([c.pop(p.d, 360), c.fadeIn(p.lb, 380, { delay: 120 })]);
    const steps = [
      { cap: `Is ${tex(`${b}^{-${n}}`)} the same as ${tex(`-${b ** n}`)}? Here is ${tex(`-${b ** n}`)}, far to the <b>left</b> of 0.`, run: (c) => showPt(c, wrong) },
      { cap: `Now the real pattern: ${tex(`${b}^{1}=${b}`)} and ${tex(`${b}^{0}=1`)}. Both are to the <b>right</b> of 0.`, run: (c) => Promise.all([showPt(c, seq[0]), c.sleep(150).then(() => showPt(c, seq[1]))]) },
      { cap: `Zoom in on the part between 0 and ${b}: the pattern lives there.`, run: (c) => { c.anim(wrong.d, [{ opacity: 1 }, { opacity: 0 }], 250); c.anim(wrong.lb, [{ opacity: 1 }, { opacity: 0 }], 250); return zoomTo(c, cfg.zoom); } }
    ];
    for (let e = -1; e >= -n; e--) {
      const p = seq[1 - e];
      steps.push({ cap: e === -1 ? `Divide by ${b} once more: ${tex(`${b}^{-1}=\\tfrac{1}{${b}}`)}. It lands between 0 and 1.` : `Divide by ${b} again: ${tex(`${b}^{${e}}=\\tfrac{1}{${b ** -e}}`)}. Closer to 0, but still on the <b>right</b> side.`, run: (c) => showPt(c, p) });
    }
    steps.push({
      cap: `${tex(`${b}^{-${n}}=\\dfrac{1}{${b ** n}}`)} is a small <b>positive</b> number. It is <b>not</b> ${tex(`-${b ** n}`)}: dividing by ${b} never reaches 0 and never goes negative.`,
      run: (c) => { note.innerHTML = `${K(`${b}^{-${n}}=\\dfrac{1}{${b ** n}}`)}<span>small and positive</span>${K(`\\neq -${b ** n}`)}`; return Promise.all([c.pop(note, 450), pulse(c, seq[seq.length - 1].lb, 1.2)]); }
    });
    return steps;
  }
};

/* =====================================================================
 * 2–3. Take the reciprocal, make the exponent positive (then evaluate)
 * ===================================================================== */
const NR = {
  d: { b: '2', n: 3 }, a: { b: '3', n: 2 }, b: { b: '4', n: 1 }, c: { b: '5', n: 3 }, e: { b: '10', n: 2, dec: '0.01' },
  va: { b: 'x', n: 3 }, vb: { b: 'y', n: 5 }, vc: { b: 'm', n: 1 }, vd: { b: 'a', n: 'n' }
};
function recipDef(title, keys, groups) {
  const choices = [];
  let inEx = false;
  keys.forEach((k) => { if (groups[k]) { choices.push({ sep: groups[k] }); inEx = true; } choices.push({ v: k, label: inEx ? `(${k.slice(-1)})` : tex(`${NR[k].b}^{-${NR[k].n}}`) }); });
  return {
    title, height: 300,
    choices,
    intro: (k) => `Write ${tex(`${NR[k].b}^{-${NR[k].n}}`)} with a positive exponent${/[0-9]/.test(NR[k].b) ? ', then evaluate' : ''}.`,
    make(stage, k, ex) {
      const it = NR[k], b = it.b, n = it.n, num = /[0-9]/.test(b), W = ex.W, Y = 40;
      const nn = typeof n === 'number' ? n : null, val = num ? Number(b) ** n : null, p1 = nn === 1 ? b : `${b}^{${n}}`;
      const bx = (src, x, cls) => { const e = add(stage, h('div', 'u2l6-rc-box ' + (cls || ''), K(src)), x, Y); hide(e); return e; };
      const B1 = bx(`${b}^{${NEG('-' + n)}}`, 30, 'start'); B1.style.opacity = 1;
      const xs = [30, W * 0.36, W * 0.69];
      const B2 = bx(`\\dfrac{1}{${b}^{${POS(n)}}}`, xs[1]);
      const B3 = num ? bx(`\\dfrac{1}{${tn(val)}}`, xs[2], 'fin') : null;
      const D3 = it.dec ? add(stage, h('div', 'u2l6-rc-dec', K(`=${it.dec}`)), xs[2] + 10, Y + 118) : null; if (D3) hide(D3);
      const arrow = (x, lab) => { const a = add(stage, h('div', 'u2l6-rc-arr', `<span>${lab}</span><b>→</b>`), x, Y + 34); hide(a); return a; };
      const w1 = B1.offsetWidth;
      const A1 = arrow((30 + w1 + xs[1]) / 2 - 50, 'reciprocal'), A2 = num ? arrow(xs[1] + 150, 'evaluate') : null;
      // the pattern check underneath: start at 1 and divide by the base n times
      const PY = 196, chain = add(stage, h('div', 'u2l6-rc-chain'), 30, PY); hide(chain);
      const pieces = [];
      if (nn) {
        const lab = h('span', 'u2l6-rc-cl', `Check with the pattern: start at ${K(`1=${b}^{0}`)}, then`); chain.appendChild(lab);
        let cur = '1';
        for (let j = 1; j <= nn; j++) {
          const d = h('span', 'u2l6-rc-hop', `÷${K(b)}`), r = h('span', 'u2l6-rc-v', K(num ? `\\dfrac{1}{${tn(Number(b) ** j)}}` : `\\dfrac{1}{${j === 1 ? b : `${b}^{${j}}`}}`));
          chain.append(d, r); pieces.push(d, r); cur = r;
        }
        pieces.forEach((p) => { p.style.opacity = 0; });
      }
      const steps = [
        { cap: `The exponent ${tex(`-${n}`)} is <b>negative</b>. That doesn’t make the answer negative: it means <b>take the reciprocal</b>.`, run: (c) => pulse(c, B1.querySelector('.u2l6-neg') || B1, 1.3, 500) },
        { cap: `One over the <b>positive</b> power: ${tex(`${b}^{-${n}}=\\dfrac{1}{${p1}}`)}. The ${tex(`-${n}`)} became ${tex(String(n))}.`, run: (c) => Promise.all([c.fadeIn(A1, 300, { from: 'translateX(-10px)' }), c.pop(B2, 450, { delay: 200 })]) }
      ];
      if (num) {
        steps.push({ cap: nn === 1 ? `${tex(`${b}^{1}=${b}`)}, so the answer is ${tex(`\\dfrac{1}{${b}}`)}.` : `Evaluate the bottom: ${tex(`${b}^{${n}}=${Array(nn).fill(b).join('\\times')}=${tn(val)}`)}. So ${tex(`${b}^{-${n}}=\\dfrac{1}{${tn(val)}}`)}${it.dec ? `, or <b>${it.dec}</b> as a decimal` : ''}.`, run: (c) => Promise.all([c.fadeIn(A2, 300, { from: 'translateX(-10px)' }), c.pop(B3, 450, { delay: 200 }), D3 ? c.fadeIn(D3, 400, { delay: 500 }) : null]) });
      } else {
        steps.push({ cap: `The base is a letter, so there is no number to work out. <b>Stop here:</b> ${tex(`${b}^{-${n}}=\\dfrac{1}{${p1}}`)}.`, run: (c) => { B2.classList.add('fin'); return pulse(c, B2, 1.08); } });
      }
      if (nn) {
        steps.push({
          cap: `Why does it work? Start at ${tex(`${b}^{0}=1`)} and keep dividing by ${tex(b)}: ${WORD[nn]} step${nn > 1 ? 's' : ''} down the pattern gives ${tex(`\\dfrac{1}{${num ? tn(val) : p1}}`)}. The same answer.`,
          run: async (c) => { await c.fadeIn(chain, 300); for (const p of pieces) await c.fadeIn(p, 260, { from: 'translateX(-8px)' }); }
        });
      }
      return steps;
    }
  };
}
const nrecip = recipDef('Take the reciprocal, make the exponent positive', ['d', 'a', 'b', 'c', 'e'], { a: 'Example 1 check:' });
const nvar = recipDef('Variable bases: apply the rule and stop', ['va', 'vb', 'vc', 'vd'], { va: 'Example 2 check:' });

/* =====================================================================
 * 4. A negative exponent downstairs: how many pieces fit in 1?
 * ===================================================================== */
const DV = { d1: { b: 2, n: 1 }, d2: { b: 5, n: 1 }, a: { b: 2, n: 3 }, b: { b: 3, n: 2 }, c: { b: 'x', n: 4 }, d: { b: 'y', n: 6 } };
const ndiv = {
  title: 'Flip it up: how many pieces fit in 1?',
  height: 400,
  choices: [{ v: 'd1', label: tex('\\tfrac{1}{2^{-1}}') }, { v: 'd2', label: tex('\\tfrac{1}{5^{-1}}') }, { sep: 'Example 3 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `(${k})` }))],
  intro: (k) => `Simplify ${tex(`\\dfrac{1}{${DV[k].b}^{-${DV[k].n}}}`)}. The negative exponent is <b>downstairs</b>.`,
  make(stage, k, ex) {
    const { b, n } = DV[k], W = ex.W, num = typeof b === 'number', d = num ? b ** n : null;
    const pn = n === 1 ? String(b) : `${b}^{${n}}`;
    const e0 = add(stage, h('div', 'u2l6-dv-expr', K(`\\dfrac{1}{${b}^{${NEG('-' + n)}}}`)), 30, 14);
    const L1 = add(stage, h('div', 'u2l6-dv-line', K(`=1\\div\\dfrac{1}{${pn}}`)), 200, 30); hide(L1);
    const steps = [{
      cap: `First the bottom. By the rule, ${tex(`${b}^{-${n}}=\\dfrac{1}{${pn}}`)}${num && n > 1 ? `${tex(`=\\dfrac{1}{${d}}`)}` : ''}. So we are working out ${tex(`1\\div\\dfrac{1}{${pn}}`)}.`,
      run: (c) => Promise.all([pulse(c, e0.querySelector('.u2l6-neg'), 1.3), c.fadeIn(L1, 400, { delay: 200, from: 'translateX(-10px)' })])
    }];
    if (num) {
      const BX = 60, BW = Math.min(W - 120, 760), BY = 170, BH = 66;
      const whole = add(stage, h('div', 'u2l6-dv-whole', '<span>1 whole</span>'), BX, BY); whole.style.width = BW + 'px'; whole.style.height = BH + 'px'; hide(whole);
      const pcs = [];
      for (let i = 0; i < d; i++) {
        const p = add(stage, h('div', 'u2l6-dv-pc', d <= 12 ? K(`\\tfrac{1}{${d}}`) : ''), BX + i * BW / d, BY); p.style.width = (BW / d) + 'px'; p.style.height = BH + 'px'; hide(p);
        const cnt = add(stage, h('div', 'u2l6-dv-cnt', String(i + 1)), BX + (i + 0.5) * BW / d, BY + BH + 10); cnt.style.translate = '-50% 0'; hide(cnt);
        pcs.push([p, cnt]);
      }
      const res = add(stage, h('div', 'u2l6-dv-res', K(`\\dfrac{1}{${b}^{-${n}}}=${b}^{${n}}=${d}`)), W / 2, 300); res.style.translate = '-50% 0'; hide(res);
      steps.push({ cap: `Dividing by ${tex(`\\tfrac{1}{${d}}`)} asks: how many pieces of size ${tex(`\\tfrac{1}{${d}}`)} fit into <b>1 whole</b>?`, run: (c) => c.fadeIn(whole, 400) });
      steps.push({
        cap: `Cut the whole into ${d === 2 ? 'halves' : `pieces of ${tex(`\\tfrac{1}{${d}}`)}`} and count them: <b>${d}</b> pieces. So ${tex(`1\\div\\dfrac{1}{${d}}=${d}`)}.`,
        run: async (c) => { for (const [p, cnt] of pcs) await Promise.all([c.pop(p, d > 6 ? 220 : 320), c.fadeIn(cnt, 200)]); }
      });
      steps.push({ cap: `${n === 1 ? `${tex(`${d}=${b}^{1}`)}` : `${tex(`${d}=${b}^{${n}}`)}`}. The negative exponent downstairs flipped <b>up</b> and turned <b>positive</b>: ${tex(`\\dfrac{1}{${b}^{-${n}}}=${b}^{${n}}=${d}`)}.`, run: (c) => c.pop(res, 450) });
    } else {
      const lines = [`=1\\times\\dfrac{${b}^{${n}}}{1}`, `=${b}^{${POS(n)}}`].map((s, i) => { const e = add(stage, h('div', 'u2l6-dv-line', K(s)), 200, 130 + i * 92); hide(e); return e; });
      steps.push({ cap: `Dividing by a fraction is the same as multiplying by its <b>reciprocal</b> (flip it).`, run: (c) => c.fadeIn(lines[0], 400, { from: 'translateX(-10px)' }) });
      steps.push({ cap: `So ${tex(`\\dfrac{1}{${b}^{-${n}}}=${b}^{${n}}`)}. The negative exponent downstairs flipped <b>up</b> and turned <b>positive</b>.`, run: async (c) => { await c.fadeIn(lines[1], 400, { from: 'translateX(-10px)' }); lines[1].classList.add('fin'); await pulse(c, lines[1], 1.08); } });
    }
    return steps;
  }
};

/* =====================================================================
 * 5. Move only what the exponent touches across the fraction bar (the 10C "move")
 * ===================================================================== */
const MV = {
  m1: { label: '5m^{-2}', t: [['c', '5'], ['x', 'm^{-2}']], b: [], steps: [
    { cap: `The exponent ${tex('-2')} is attached to ${tex('m')} <b>only</b>. The 5 has no exponent of its own, so it isn’t affected.`, hl: { neg: ['x'], keep: ['c'] } },
    { cap: `Move ${tex('m^{-2}')} across the fraction bar. Its exponent <b>flips sign</b>: ${tex('m^{-2}')} on top becomes ${tex('m^{2}')} on the bottom.`, st: { t: [['c', '5']], b: [['x', 'm^{2}']] } },
    { cap: `${tex('5m^{-2}=\\dfrac{5}{m^2}')}. The 5 stays on top, so it is <b>not</b> ${tex('\\dfrac{1}{5m^2}')}.`, res: '5m^{-2}=\\dfrac{5}{m^2}', bad: '\\dfrac{1}{5m^2}' }] },
  m2: { label: '\\dfrac{3}{k^{-5}}', chip: '\\tfrac{3}{k^{-5}}', t: [['c', '3']], b: [['x', 'k^{-5}']], steps: [
    { cap: `This time the negative exponent is on the <b>bottom</b>. Only ${tex('k^{-5}')} moves; the 3 stays on top.`, hl: { neg: ['x'], keep: ['c'] } },
    { cap: `Move ${tex('k^{-5}')} up to the top. It becomes ${tex('k^{5}')}.`, st: { t: [['c', '3'], ['x', 'k^{5}']], b: [] } },
    { cap: `${tex('\\dfrac{3}{k^{-5}}=3k^{5}')}. A negative exponent on the bottom moves <b>up</b>.`, res: '\\dfrac{3}{k^{-5}}=3k^{5}' }] },
  a: { label: '6x^{-3}', t: [['c', '6'], ['x', 'x^{-3}']], b: [], steps: [
    { cap: `The ${tex('-3')} belongs to ${tex('x')} alone. The 6 stays upstairs.`, hl: { neg: ['x'], keep: ['c'] } },
    { cap: `Move ${tex('x^{-3}')} down: it becomes ${tex('x^{3}')}.`, st: { t: [['c', '6']], b: [['x', 'x^{3}']] } },
    { cap: `${tex('6x^{-3}=\\dfrac{6}{x^3}')}. The 6 did not move.`, res: '6x^{-3}=\\dfrac{6}{x^{3}}', bad: '\\dfrac{1}{6x^3}' }] },
  b: { label: '2a^{-1}', t: [['c', '2'], ['x', 'a^{-1}']], b: [], steps: [
    { cap: `The ${tex('-1')} belongs to ${tex('a')} only. The 2 stays on top.`, hl: { neg: ['x'], keep: ['c'] } },
    { cap: `Move ${tex('a^{-1}')} down: it becomes ${tex('a^{1}')}, which is just ${tex('a')}.`, st: { t: [['c', '2']], b: [['x', 'a']] } },
    { cap: `${tex('2a^{-1}=\\dfrac{2}{a}')}.`, res: '2a^{-1}=\\dfrac{2}{a}' }] },
  c: { label: '\\dfrac{9}{y^{-2}}', chip: '(c)', t: [['c', '9']], b: [['x', 'y^{-2}']], steps: [
    { cap: `The negative exponent is on the <b>bottom</b>, on ${tex('y')} only. The 9 stays on top.`, hl: { neg: ['x'], keep: ['c'] } },
    { cap: `Move ${tex('y^{-2}')} up to the top: it becomes ${tex('y^{2}')}. Only 1 is left on the bottom.`, st: { t: [['c', '9'], ['x', 'y^{2}']], b: [] } },
    { cap: `${tex('\\dfrac{9}{y^{-2}}=9y^{2}')}. (That’s ${tex('9\\times y^{2}')}.)`, res: '\\dfrac{9}{y^{-2}}=9y^{2}' }] },
  d: { label: '\\dfrac{8}{b^{-4}}', chip: '(d)', t: [['c', '8']], b: [['x', 'b^{-4}']], steps: [
    { cap: `Only ${tex('b^{-4}')} has a negative exponent, and it’s on the bottom.`, hl: { neg: ['x'], keep: ['c'] } },
    { cap: `Move it up: ${tex('b^{-4}')} becomes ${tex('b^{4}')}.`, st: { t: [['c', '8'], ['x', 'b^{4}']], b: [] } },
    { cap: `${tex('\\dfrac{8}{b^{-4}}=8b^{4}')}.`, res: '\\dfrac{8}{b^{-4}}=8b^{4}' }] }
};
const nmove = {
  title: 'Move only what the exponent touches',
  height: 320,
  choices: [{ v: 'm1', label: tex('5m^{-2}') }, { v: 'm2', label: tex('\\tfrac{3}{k^{-5}}') }, { sep: 'Example 4 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `(${k})` }))],
  intro: (k) => `Rewrite ${tex(MV[k].label)} with positive exponents. Picture a fraction bar. Which factor has the negative exponent?`,
  make(stage, k, ex) {
    const it = MV[k], W = ex.W, cx = W * 0.3, TY = 118, BY = 258, BAR = 188, FS = 56;
    const els = {}, wOf = (src) => measure(stage, K(src), FS)[0];
    add(stage, h('div', 'u2l6-qhead', `Rewrite ${K(it.label)}`), 24, 12);
    const bar = add(stage, h('div', 'u2l6-mv-bar'), cx, BAR);
    const mk = (key, src) => { const e = add(stage, h('div', 'u2l6-mv-f', K(src)), 0, 0); e.style.fontSize = FS + 'px'; els[key] = { el: e, src }; return els[key]; };
    function plan(st) {
      const rows = { t: st.t.length ? st.t : [['_1t', '1']], b: st.b.length ? st.b : [['_1b', '1']] }, pos = {};
      let maxW = 0;
      for (const r of ['t', 'b']) {
        const items = rows[r].map(([key, s]) => ({ key, s, w: wOf(s) })), gap = 4, tot = items.reduce((a, i) => a + i.w, 0) + gap * (items.length - 1);
        maxW = Math.max(maxW, tot); let x = cx - tot / 2;
        items.forEach((i) => { pos[i.key] = { x, y: r === 't' ? TY : BY, s: i.s, row: r }; x += i.w + gap; });
      }
      return { pos, barW: maxW + 40 };
    }
    { const { pos, barW } = plan(it); for (const key in pos) { const f = mk(key, pos[key].s); at(f.el, pos[key].x, pos[key].y); f.row = pos[key].row; } bar.style.width = barW + 'px'; }
    async function swap(c, f, src, delay) {
      f.src = src;
      if (!c.fast) await c.sleep(delay);
      f.el.innerHTML = K(src);
      if (!c.fast) await c.anim(f.el, [{ color: '#c93a33', transform: 'scale(1.2)' }, { color: '#12805a', transform: 'scale(1)' }], 380);
    }
    async function apply(c, st) {
      const { pos, barW } = plan(st), jobs = [];
      for (const key in els) if (!pos[key]) { const e = els[key].el; delete els[key]; jobs.push(c.anim(e, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.6)' }], 350).then(() => e.remove())); }
      for (const key in pos) {
        const p = pos[key];
        if (!els[key]) { const f = mk(key, p.s); at(f.el, p.x, p.y); f.row = p.row; jobs.push(c.fadeIn(f.el, 400, { delay: 350 })); continue; }
        const f = els[key], cross = f.row !== p.row, changed = f.src !== p.s;
        const fx = parseFloat(f.el.style.left), fy = parseFloat(f.el.style.top);
        const kf = cross ? [{ left: fx + 'px', top: fy + 'px' }, { left: Math.max(fx, p.x) + 90 + 'px', top: BAR + 'px' }, { left: p.x + 'px', top: p.y + 'px' }] : [{ left: fx + 'px', top: fy + 'px' }, { left: p.x + 'px', top: p.y + 'px' }];
        jobs.push(c.anim(f.el, kf, cross ? 950 : 550));
        if (changed) jobs.push(swap(c, f, p.s, cross ? 480 : 200));
        if (cross) { f.el.classList.remove('neg'); f.el.classList.add('moved'); }
        f.row = p.row;
      }
      jobs.push(c.anim(bar, [{ width: bar.style.width }, { width: barW + 'px' }], 500));
      await Promise.all(jobs);
    }
    const RX = W * 0.6, RW = W - RX - 24;
    const res = add(stage, h('div', 'u2l6-mv-res'), RX, 96); res.style.width = RW + 'px'; hide(res);
    return it.steps.map((s) => ({
      cap: s.cap,
      run: async (c) => {
        if (s.hl) {
          const jobs = [];
          (s.hl.neg || []).forEach((key) => { els[key].el.classList.add('neg'); jobs.push(pulse(c, els[key].el)); });
          (s.hl.keep || []).forEach((key) => els[key].el.classList.add('keep'));
          await Promise.all(jobs);
        }
        if (s.st) { Object.values(els).forEach((f) => f.el.classList.remove('keep')); await apply(c, s.st); }
        if (s.res) {
          res.innerHTML = `<div class="u2l6-mv-cl">Positive exponents</div>${K(s.res)}` + (s.bad ? `<div class="u2l6-mv-bad">${K(`\\neq${s.bad}`)}</div>` : '');
          await c.pop(res, 450);
        }
      }
    }));
  }
};

/* =====================================================================
 * 6. The quotient law gives a negative exponent: expand, cancel, compare
 * ===================================================================== */
// each entry: { bs: [[base, top exponent, bottom exponent], …], co: [top coefficient, bottom coefficient], frac: write it stacked }
const CANCEL = {
  d1: { bs: [['2', 3, 5]] }, d2: { bs: [['10', 1, 3]] }, a: { bs: [['x', 2, 5]] }, b: { bs: [['m', 3, 8]] },
  c: { bs: [['x', 2, 6]], co: [12, 3], frac: true },
  d: { bs: [['x', 5, 2], ['y', 2, 6]], co: [20, 4], frac: true }
};
const vt = (b, e) => (e === 1 ? b : `${b}^{${e}}`);
const cLab = (k) => {
  const { bs, co, frac } = CANCEL[k], [p, q] = co || ['', ''];
  const T = `${p}${bs.map(([b, m]) => `${b}^{${m}}`).join('')}`, B = `${q}${bs.map(([b, , n]) => `${b}^{${n}}`).join('')}`;
  return frac ? `\\dfrac{${T}}{${B}}` : `${T}\\div ${B}`;
};
const cChip = (k) => cLab(k).replace('\\dfrac', '\\tfrac');
const ncancel = {
  title: 'Expand, cancel, and compare with the quotient law',
  height: 400,
  minW: 860,
  choices: [{ v: 'd1', label: tex(cChip('d1')) }, { v: 'd2', label: tex(cChip('d2')) }, { sep: 'Example 5 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `(${k})` }))],
  intro: (k) => `Two ways to work out ${tex(cLab(k))}: write out every factor and cancel, or use the quotient law. They must give the <b>same answer</b>.`,
  make(stage, k, ex) {
    const W = ex.W, { bs, co: cf } = CANCEL[k], [p, q] = cf || [], multi = bs.length > 1, frac = CANCEL[k].frac;
    const cx = W * 0.29, TY = frac ? 166 : 132, BAR = TY + 40, BY = TY + 80, co = p ? p / q : null;
    const say = (b, n) => { const letter = /[a-z]/.test(b); return n === 1 ? `one ${letter ? `<i>${b}</i>` : b}` : `${WORD[n]} ${letter ? `<i>${b}</i>’s` : `${b}’s`}`; };
    const head = add(stage, h('div', 'u2l6-cn-head', K(cLab(k))), 24, 14); if (frac) head.style.fontSize = '30px';
    const row = (side, y, coef) => { // side 1 = top exponent, 2 = bottom exponent
      const els = [], facs = bs.map(() => []);
      if (coef) { const c0 = h('div', 'u2l6-cn-f co', K(String(coef))); c0._c = true; els.push(c0); }
      bs.forEach((bb, j) => { for (let i = 0; i < bb[side]; i++) { if (els.length) els.push(h('div', 'u2l6-cn-x', '×')); const f = h('div', 'u2l6-cn-f', K(bb[0])); facs[j].push(f); els.push(f); } });
      els.forEach((e) => stage.appendChild(e));
      const ws = els.map((e) => e.offsetWidth), gap = 6, tot = ws.reduce((a, w) => a + w, 0) + gap * (els.length - 1);
      let x = cx - tot / 2; els.forEach((e, i) => { at(e, x, y - e.offsetHeight / 2); x += ws[i] + gap; });
      return { els, facs, co: els.find((e) => e._c), tot };
    };
    const top = row(1, TY, p), bot = row(2, BY, q);
    const bar = add(stage, h('div', 'u2l6-cn-bar'), cx, BAR); bar.style.width = (Math.max(top.tot, bot.tot) + 30) + 'px';
    const left = [...top.els, ...bot.els, bar]; hide(...left);
    const slash = (f) => { const s = add(stage, h('div', 'u2l6-cn-slash'), parseFloat(f.style.left) + f.offsetWidth / 2, parseFloat(f.style.top) + f.offsetHeight / 2); s._f = f; hide(s); return s; };
    const pairs = bs.map(([, m, n], j) => { const out = []; for (let i = 0; i < Math.min(m, n); i++) out.push(slash(top.facs[j][i]), slash(bot.facs[j][i])); return out; });
    const coSl = p ? [slash(top.co), slash(bot.co)] : [];
    const coNew = p ? add(stage, h('div', 'u2l6-cn-co', K(String(co))), parseFloat(top.co.style.left) + top.co.offsetWidth / 2, TY - 52) : null; if (coNew) hide(coNew);
    const oneEl = add(stage, h('div', 'u2l6-cn-one', '1'), cx + (p ? 30 : 0), TY - 50); hide(oneEl);
    // what is left after cancelling: top leftovers (m > n) and bottom leftovers (n > m), base by base
    const upL = bs.map(([b, m, n], j) => (m > n ? { b, e: m - n, f: top.facs[j].slice(n) } : null)).filter(Boolean);
    const dnL = bs.map(([b, m, n], j) => (n > m ? { b, e: n - m, f: bot.facs[j].slice(m) } : null)).filter(Boolean);
    const braces = dnL.map(() => { const br = add(stage, svgEl('svg', { class: 'u2l6-cn-brace', width: 10, height: 30 }), 0, 0), bl = add(stage, h('div', 'u2l6-cn-bl'), cx, BY + 72); hide(br, bl); return { br, bl }; });
    const RX = W * 0.6, RW = W - RX - 20, cT = co ? String(co) : '', tall = multi || !!p;
    const box = (y, lab, srcs, cls) => { const e = add(stage, h('div', 'u2l6-cn-r ' + (cls || '') + (tall ? ' tall' : ''), `<div class="u2l6-cn-rl">${lab}</div><div>${srcs.map((x) => K(x)).join('<br>')}</div>`), RX, y); e.style.width = RW + 'px'; hide(e); return e; };
    const num = `${cT}${upL.map((l) => vt(l.b, l.e)).join('')}` || '1', den = dnL.map((l) => vt(l.b, l.e)).join('');
    const fracT = den ? `\\dfrac{${num}}{${den}}` : num;
    const negT = `${cT}${bs.map(([b, m, n]) => (m - n === 1 ? b : `${b}^{${m - n}}`)).join('')}`;
    const subT = `${p ? `(${p}\\div${q})` : ''}${bs.map(([b, m, n]) => `${b}^{${m}-${n}}`).join('')}`;
    const lA = box(16, 'Cancelling gives', [fracT]);
    const lB = box(tall ? 122 : 110, 'The quotient law gives', multi ? [subT, `=${negT}`] : [`${subT}=${negT}`]);
    const lC = box(multi ? 240 : tall ? 214 : 204, 'Same expression, so', [`${negT}=${fracT}`], 'big');
    const desc = (side) => bs.map((bb) => say(bb[0], bb[side])).join(' and ');
    const steps = [{
      cap: multi ? `Write out every factor, numbers first. On top: ${desc(1)}. On the bottom: ${desc(2)}.`
        : `Write out every factor${p ? ', numbers first' : ''}. ${tex(`${bs[0][0]}^{${bs[0][1]}}`)} is ${bs[0][1] === 1 ? `just ${say(bs[0][0], 1)}` : say(bs[0][0], bs[0][1])} on top; ${tex(`${bs[0][0]}^{${bs[0][2]}}`)} is ${say(bs[0][0], bs[0][2])} on the bottom.`,
      run: (c) => Promise.all(left.map((e, i) => c.fadeIn(e, 350, { delay: Math.min(i * 35, 500) })))
    }];
    if (p) steps.push({ cap: `Numbers with numbers: ${tex(`${p}\\div${q}=${co}`)}.`, run: async (c) => { coSl.forEach((s) => { s._f.classList.add('gone'); }); await Promise.all([...coSl.map((s) => c.anim(s, [{ opacity: 0, transform: 'rotate(-58deg) scaleX(0)' }, { opacity: 1, transform: 'rotate(-58deg) scaleX(1)' }], 320)), c.pop(coNew, 380, { delay: 250 })]); } });
    bs.forEach(([b, m, n], j) => {
      const np = Math.min(m, n), one = /[a-z]/.test(b) ? `<i>${b}</i>` : b, an = /^[aefhilmnorsx]$/.test(b) ? 'an' : 'a';
      steps.push({
        cap: multi ? `Now the ${say(b, 2).replace(/^two /, '')}: each ${one} on top <b>cancels</b> with ${an} ${one} on the bottom. ${np === 1 ? 'One pair cancels' : `${WORD[np][0].toUpperCase() + WORD[np].slice(1)} pairs cancel`}, and ${m > n ? `${say(b, m - n)} stay on <b>top</b>` : `${say(b, n - m)} stay on the <b>bottom</b>`}.`
          : `Each ${one} on top <b>cancels</b> with ${an} ${one} on the bottom. ${np === 1 ? 'One pair cancels.' : `${WORD[np][0].toUpperCase() + WORD[np].slice(1)} pairs cancel.`}`,
        run: async (c) => { await Promise.all(pairs[j].map((s, i) => { s._f.classList.add('gone'); return c.anim(s, [{ opacity: 0, transform: 'rotate(-58deg) scaleX(0)' }, { opacity: 1, transform: 'rotate(-58deg) scaleX(1)' }], 320, { delay: Math.floor(i / 2) * 220 }); })); }
      });
    });
    const leftWords = [p ? `<b>${co}</b>` : '', ...upL.map((l) => `<b>${say(l.b, l.e)}</b>`)].filter(Boolean).join(' and ') || '<b>1</b>';
    steps.push({
      cap: `What’s left: ${leftWords} on top and ${dnL.map((l) => `<b>${say(l.b, l.e)}</b>`).join(' and ')} on the bottom, so the answer is ${tex(fracT)}.`,
      run: async (c) => {
        const jobs = [p ? pulse(c, coNew, 1.2) : c.pop(oneEl, 380), c.fadeIn(lA, 400, { delay: 250 })];
        upL.forEach((l) => l.f.forEach((f) => f.classList.add('left')));
        dnL.forEach((l, i) => {
          const { br, bl } = braces[i], f0 = l.f[0], f1 = l.f[l.f.length - 1], x1 = parseFloat(f0.style.left), x2 = parseFloat(f1.style.left) + f1.offsetWidth, w = x2 - x1;
          br.setAttribute('width', w + 4); br.innerHTML = ''; br.appendChild(svgEl('path', { d: `M2 2 Q2 12 ${w / 4} 12 L${w / 2 - 6} 12 Q${w / 2} 12 ${w / 2} 22 Q${w / 2} 12 ${w / 2 + 6} 12 L${w * 3 / 4} 12 Q${w} 12 ${w} 2`, class: 'u2l6-cn-bpath' }));
          at(br, x1 - 2, BY + 30); at(bl, x1 + w / 2, BY + 74);
          bl.innerHTML = `${say(l.b, l.e)} left = ${K(vt(l.b, l.e))}`;
          l.f.forEach((f) => f.classList.add('left'));
          jobs.push(c.fadeIn(br, 350, { delay: 150 }), c.fadeIn(bl, 350, { delay: 300 }));
        });
        await Promise.all(jobs);
      }
    });
    const negs = bs.filter(([, m, n]) => n > m);
    steps.push({
      cap: multi ? `Now the <b>quotient law</b>, one base at a time: ${bs.map(([b, m, n]) => tex(`${b}^{${m}-${n}}=${b}^{${m - n}}`)).join(' and ')}. ${tex(negs[0][0])} had the bigger exponent on the bottom, so its exponent is <b>negative</b>: ${tex(negT)}.`
        : `Now the <b>quotient law</b>: subtract the exponents, ${tex(`${bs[0][1]}-${bs[0][2]}=${bs[0][1] - bs[0][2]}`)}. The bigger exponent was on the bottom, so the answer has a <b>negative</b> exponent: ${tex(negT)}.`,
      run: (c) => c.fadeIn(lB, 400)
    }, {
      cap: `Same expression, so <b>${tex(`${negT}=${fracT}`)}</b>. Finish every quotient-law answer by making the exponent <b>positive</b>.`,
      run: (c) => c.pop(lC, 480)
    });
    return steps;
  }
};

/* =============================== mount =============================== */
mountBread();
export const explainers = mountExplainers({ nstairs, nline, nrecip, nvar, ndiv, nmove, ncancel });

/* ============ Stand Up Break! — negative exponents at the whiteboards ============ */
standup('u2l6', (() => {
  const LET = ['x', 'y', 'a', 'b', 'm', 'n', 'p', 'k', 'r', 't', 'w'];
  const vt = (v, e) => (e === 1 ? v : `${v}^{${e}}`);
  // Assignment 6 #8 (x²÷x⁶, a³÷a⁷, m÷m⁵, y⁴÷y⁹) and #9 (10x²/5x⁷, 18a³/6a⁸, 8y/2y⁶, 20b²/4b⁹) by their numbers, any letter;
  // Example 5 too, so the whiteboards don't repeat it
  const ASG = new Set(['2,6', '3,7', '1,5', '4,9', '2,5', '3,8', '10,2,5,7', '18,3,6,8', '8,1,2,6', '20,2,4,9', '12,2,3,6']);
  return {
    intro: 'Simplify at your whiteboard station. Take the reciprocal, make every exponent positive, and evaluate where you can.',
    levels: {
      BEG: (r) => { // Examples 1 and 3: numbers
        for (;;) {
          const b = r.int(2, 10), n = r.int(1, 3), v = b ** n; if (v > 1000 || (b === 10 && n > 3)) continue;
          const t = r.pick(['neg', 'neg', 'neg', 'den']);
          const pw = n === 1 ? String(b) : `${b}^{${n}}`;
          if (t === 'neg') return { q: `${b}^{-${n}}`, a: [`=\\dfrac{1}{${pw}}`, ...(n > 1 ? [`=\\dfrac{1}{${tn(v)}}`] : []), ...(b === 10 ? [`=${(1 / v).toFixed(n)}`] : [])] };
          return { q: `\\dfrac{1}{${b}^{-${n}}}`, a: [`=${n === 1 ? `${b}^{1}` : pw}`, `=${tn(v)}`] };
        }
      },
      PRG: (r) => { // Examples 2 and 4: variables and coefficients
        const v = r.pick(LET), k = r.int(2, 12), n = r.int(1, 9), t = r.pick(['var', 'coef', 'coef', 'den', 'cden']);
        if (t === 'var') return { q: `${v}^{-${n}}`, a: [`=\\dfrac{1}{${vt(v, n)}}`] };
        if (t === 'coef') return { q: `${k}${v}^{-${n}}`, a: [`=${k}\\times\\dfrac{1}{${vt(v, n)}}`, `=\\dfrac{${k}}{${vt(v, n)}}\\quad\\text{(the ${k} stays on top)}`] };
        if (t === 'den') return { q: `\\dfrac{1}{${v}^{-${n}}}`, a: [`=${vt(v, n)}`] };
        return { q: `\\dfrac{${k}}{${v}^{-${n}}}`, a: [`=${k}\\times ${vt(v, n)}`, `=${k}${vt(v, n)}`] };
      },
      MAS: (r) => { for (;;) { // Example 5: the quotient law gives a negative exponent
        const [x, y] = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['r', 's']]);
        const t = r.pick(['one', 'coef', 'coef', 'two']);
        if (t === 'one') { const m = r.int(1, 6), n = m + r.int(1, 6), d = n - m; if (ASG.has(`${m},${n}`)) continue; return { q: `${vt(x, m)}\\div ${vt(x, n)}`, a: [`=${x}^{${m}-${n}}=${x}^{-${d}}`, `=\\dfrac{1}{${vt(x, d)}}`] }; }
        if (t === 'coef') {
          const q = r.int(2, 6), c = r.int(2, 6), p = q * c, m = r.int(1, 5), n = m + r.int(1, 6), d = n - m;
          if (ASG.has(`${p},${m},${q},${n}`)) continue; // Assignment 6 #9, written stacked like the booklet
          return { q: `\\dfrac{${p}${vt(x, m)}}{${q}${vt(x, n)}}`, a: [`=(${p}\\div${q})${x}^{${m}-${n}}=${c}${x}^{-${d}}`, `=\\dfrac{${c}}{${vt(x, d)}}`] };
        }
        // two letters: one exponent ends up positive, the other negative
        const q = r.int(2, 5), c = r.int(2, 5), p = q * c;
        const m = r.int(1, 4), n = m + r.int(1, 4), s = r.int(2, 6), u = r.int(1, s - 1), d = n - m, e = s - u;
        if ((p === 15 && m === 2 && s === 4 && q === 3 && n === 6 && u === 1) || (p === 24 && m === 3 && s === 1 && q === 6 && n === 5 && u === 4)) continue; // Assignment 6 #10
        return { q: `\\dfrac{${p}${vt(x, m)}${vt(y, s)}}{${q}${vt(x, n)}${vt(y, u)}}`,
          a: [`${p}\\div${q}=${c},\\quad ${x}^{${m}-${n}}=${x}^{-${d}},\\quad ${y}^{${s}-${u}}=${vt(y, e)}`, `=${c}${x}^{-${d}}${vt(y, e)}`, `=\\dfrac{${c}${vt(y, e)}}{${vt(x, d)}}`] };
      } }
    }
  };
})());
/* ============ end Stand Up Break! ============ */
