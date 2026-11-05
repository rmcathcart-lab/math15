/* Math 15 · Unit 2 · Lesson 9 — Rational Exponents and Radical Form.
 * Warm-up (How Big Is the Side?: patios and cube blocks you can tap, the "undo squaring" strip), the power-over-root
 * converter (Section 3), a Math History box (Newton's 1676 letter), and the explainers:
 *   whyRoot (the product law forces a^(1/n) to be the n-th root: the square / cube picture; notes, warm-up),
 *   hunt    (which number, used n times as a factor, gives a? try, too small / too big, ✓ — Example 1 check),
 *   routes  (root first or power first: both lanes, and a bar of the biggest number on the way — notes, Example 2),
 *   conv1   (power → radical: the denominator flies to the index, the numerator to the power — Example 3),
 *   toPow   (radical → power, and one over a radical → a negative exponent — Example 4),
 *   laws    (the same law with whole-number exponents, then with fractions, and a number check),
 *   stepper (one law at a time, the law named, the fraction work on the side — Example 5).
 * Adapted from the Math 10C twin (u2l4, u2l5). Colours: denominator / index teal, numerator / power amber,
 * negative sign red. */
import { h, fmt } from '../explain.js';
import { tex } from '../tex.js';
import { mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

/* KaTeX allowing \htmlClass (tokens that fly from one line to the next); keeps the source for the dump script */
const K = (src, display) => {
  try {
    const esc = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const clean = String(src).replace(/\\htmlClass\{[^}]*\}/g, '');
    return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' })
      .replace('<span class="katex"', '<span data-tex="' + esc(clean) + '" class="katex"');
  } catch (e) { return tex(src, display); }
};

const AM = '#c27a0e', TL = '#13807a', RD = '#c93a33';
const cA = (s) => `\\textcolor{${AM}}{${s}}`, cT = (s) => `\\textcolor{${TL}}{${s}}`, cR = (s) => `\\textcolor{${RD}}{${s}}`;
const cA0 = cA, cT0 = cT, cR0 = cR;

/* ---------- number helpers ---------- */
const tn = (n) => (n < 0 ? '-' : '') + fmt(Math.abs(n)).replace(/\u202f/g, '\\,'); // 1 000 → 1\,000 in LaTeX
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
function iroot(x, n) { // exact integer n-th root of x ≥ 0, or null
  const r = Math.round(Math.pow(x, 1 / n)); return r ** n === x ? r : null;
}
const rootT = (n, x) => (n === 2 ? `\\sqrt{${x}}` : `\\sqrt[${n}]{${x}}`);
const ord = (n) => (n === 2 ? 'square' : n === 3 ? 'cube' : n + 'th');
const timesT = (k, n) => Array(n).fill(k).join('\\times');

/* ---------- drawing helpers (from the 10C twin) ---------- */
function stagePos(stage, el) { // element centre and box in stage coordinates (the lesson may be scaled)
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k };
}
async function fly(c, stage, from, to, src, o = {}) { // a copy of `src` flies from one token to another
  if (!to) return;
  if (c.fast || !from) { to.style.opacity = 1; return; }
  c.check();
  const a = stagePos(stage, from), b = stagePos(stage, to);
  const g = add(stage, h('div', 'u2l9-fly c', K(src)), a.x, a.y); if (o.fs) g.style.fontSize = o.fs + 'px';
  if (o.color) g.style.color = o.color;
  g.style.opacity = 0;
  try {
    await c.anim(g, [{ opacity: 1, transform: 'translate(0,0) scale(1.1)' }, { opacity: 1, transform: `translate(${(b.x - a.x) / 2}px, ${(b.y - a.y) / 2 - 26}px) scale(1.3)`, offset: 0.5 }, { opacity: 1, transform: `translate(${b.x - a.x}px, ${b.y - a.y}px) scale(1)` }], o.ms || 850, { delay: o.delay || 0 });
  } finally { g.remove(); }
  to.style.opacity = 1;
}
function board(stage, o) { // written work: one LaTeX line per row
  const rows = [];
  return {
    rows,
    line(src, p = {}) {
      const y = p.y != null ? p.y : o.y + rows.length * o.lh;
      const el = add(stage, h('div', 'u2l9-line' + (p.cls ? ' ' + p.cls : ''), K(src)), p.x != null ? p.x : o.x, y); el.style.fontSize = (p.fs || o.fs) + 'px';
      hide(el); const r = { el, q: (s) => el.querySelector(s), qa: (s) => [...el.querySelectorAll(s)] }; rows.push(r); return r;
    }
  };
}
async function showRow(c, stage, row, flights = [], fs) {
  flights.forEach((f) => { if (f && f[1]) f[1].style.opacity = 0; });
  const jobs = [c.anim(row.el, [{ opacity: 0 }, { opacity: 1 }], 380)];
  flights.forEach((f, i) => { if (f) jobs.push(fly(c, stage, f[0], f[1], f[2], { fs, color: f[3], delay: 150 + i * 160 })); });
  await Promise.all(jobs);
}
const stampIn = (c, el) => c.anim(el, [{ opacity: 0, transform: 'scale(1.6) rotate(-10deg)' }, { opacity: 1, transform: 'scale(1) rotate(-4deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' });

/* ============ 1. Why a^(1/n) must be the n-th root ============ */
const whyRoot = {
  title: `Why must ${tex('a^{1/n}')} be a root?`,
  height: 410,
  choices: [{ sep: 'Notes:' }, ['5', 2], ['3', 3], { sep: 'Warm-up:' }, ['16', 2], ['8', 3], ['2', 2]].map((c) => (c.sep ? c : { v: c.join('|'), label: tex(`${c[0]}^{1/${c[1]}}`) })),
  intro: (v) => { const [a, n] = v.split('|'); return `Suppose the exponent laws still work for fractions. Then what number is ${tex(`${a}^{1/${n}}`)}? <b>Multiply it by itself</b> and see.`; },
  make(stage, v, ex) {
    const W = ex.W, [as, ns] = v.split('|'), a = Number(as), n = Number(ns);
    const pw = `${a}^{1/${n}}`, rt = rootT(n, a), exact = iroot(a, n), val = Math.pow(a, 1 / n);
    const B = board(stage, { x: 34, y: 22, lh: 76, fs: 31 });
    const eTok = (i) => `${a}^{\\htmlClass{u2l9-e${i}}{${cA(`1/${n}`)}}}`, sTok = (i) => `\\htmlClass{u2l9-s${i}}{${cA(`\\frac{1}{${n}}`)}}`;
    const r1 = B.line(Array.from({ length: n }, (_, i) => eTok(i)).join('\\times'));
    const r2 = B.line(`=${a}^{${Array.from({ length: n }, (_, i) => sTok(i)).join('+')}}`);
    const r3 = B.line(`=${a}^{${n}/${n}}=${a}^{1}=\\mathbf{${a}}`);
    const r4 = B.line(`${Array.from({ length: n }, () => rt).join('\\times')}=\\mathbf{${a}}`, { cls: 'u2l9-teal-l' });
    const res = add(stage, h('div', 'u2l9-res', K(`${pw}=${rt}${exact != null ? '=' + exact : '\\approx' + val.toFixed(3)}`)), 34, 332); hide(res);
    // the picture: a square of area a (n = 2) or a cube of volume a (n = 3)
    let side, side2;
    const px = W - 330, L = n === 2 ? 220 : 170;
    if (n === 2) {
      const sq = add(stage, h('div', 'u2l9-wr-sq'), px + 40, 40); sq.style.width = sq.style.height = L + 'px';
      add(stage, h('div', 'u2l9-wr-in c', `Area = <b>${a}</b>`), px + 40 + L / 2, 40 + L / 2);
      side = add(stage, h('div', 'u2l9-wr-side c', K(pw)), px + 40 + L / 2, 40 + L + 30);
      side2 = add(stage, h('div', 'u2l9-wr-side c', K(`${rt}=${pw}`)), px + 40 + L / 2, 40 + L + 30);
    } else {
      const svg = add(stage, svgEl('svg', { class: 'u2l9-wr-cube', width: 300, height: 290 }), px, 20);
      const s = L, dx = 0.55 * s, dy = 0.42 * s, x0 = 40, y0 = 30 + dy;
      const P = (pts) => pts.map((p) => p.join(',')).join(' ');
      svg.appendChild(svgEl('polygon', { points: P([[x0, y0], [x0 + dx, y0 - dy], [x0 + s + dx, y0 - dy], [x0 + s, y0]]), class: 'f-top' }));
      svg.appendChild(svgEl('polygon', { points: P([[x0 + s, y0], [x0 + s + dx, y0 - dy], [x0 + s + dx, y0 - dy + s], [x0 + s, y0 + s]]), class: 'f-side' }));
      svg.appendChild(svgEl('rect', { x: x0, y: y0, width: s, height: s, class: 'f-front' }));
      svg.appendChild(svgEl('line', { x1: x0, y1: y0 + s, x2: x0 + s, y2: y0 + s, class: 'edge' }));
      add(stage, h('div', 'u2l9-wr-in c', `Volume<br>= <b>${a}</b>`), px + x0 + s / 2, 20 + y0 + s / 2);
      side = add(stage, h('div', 'u2l9-wr-side c', K(pw)), px + x0 + s / 2, 20 + y0 + s + 30);
      side2 = add(stage, h('div', 'u2l9-wr-side c', K(`${rt}=${pw}`)), px + x0 + s / 2, 20 + y0 + s + 30);
    }
    side.classList.add('q'); side.innerHTML = '?'; hide(side2);
    const sumWord = n === 2 ? tex('\\tfrac12+\\tfrac12') : tex('\\tfrac13+\\tfrac13+\\tfrac13');
    return [{
      cap: `Multiply <b>${n}</b> equal factors of ${tex(pw)}.` + (n === 2 ? ` That’s the side of a square with area ${a}: side × side = area.` : ` That’s the edge of a cube with volume ${a}: edge × edge × edge = volume.`),
      run: async (c) => {
        side.innerHTML = K(pw); side.classList.remove('q');
        await Promise.all([showRow(c, stage, r1), c.pop(side, 420, { delay: 200 })]);
      }
    }, {
      cap: `<b>Product law:</b> same base, so <b>add the exponents</b>: ${sumWord}.`,
      run: (c) => showRow(c, stage, r2, Array.from({ length: n }, (_, i) => [r1.q('.u2l9-e' + i), r2.q('.u2l9-s' + i), `\\frac{1}{${n}}`, AM]), 31)
    }, {
      cap: `${sumWord} ${tex(`=\\tfrac{${n}}{${n}}=1`)}. So the product is ${tex(`${a}^1`)}, which is just <b>${a}</b>.`,
      run: (c) => showRow(c, stage, r3)
    }, {
      cap: `Now look at ${tex(rt)}. It’s the number that gives <b>${a}</b> when ${n} copies of it are multiplied.`,
      run: (c) => showRow(c, stage, r4)
    }, {
      cap: `Both numbers do the <b>same job</b>, so they are the <b>same number</b>: ${tex(`${pw}=${rt}`)}` + (exact != null ? ` = ${exact}. Check: ${Array(n).fill(exact).join(' × ')} = ${a} ✓` : ` ≈ ${val.toFixed(3)}. (Not a whole number, and that’s fine.)`),
      run: (c) => Promise.all([c.pop(res, 480), c.anim(side, [{ opacity: 1 }, { opacity: 0 }], 250), c.pop(side2, 420, { delay: 200 })])
    }];
  }
};

/* ============ 1. Hunt for the root: which number, used n times, gives a? ============ */
const HUNT = { // a | n | the tries, in order (the last one fits)
  e1a: [25, 2, [3, 6, 5]], e1b: [64, 3, [2, 3, 4]], e1c: [16, 4, [3, 2]], e1d: [100, 2, [5, 10]],
  d81: [81, 2, [8, 10, 9]], d125: [125, 3, [4, 5]]
};
const hunt = {
  title: 'Hunt for the root: try a number, check, adjust',
  height: 420,
  choices: [{ v: 'd81', label: tex('81^{1/2}') }, { v: 'd125', label: tex('125^{1/3}') }, { sep: 'Example 1 check:' },
    { v: 'e1a', label: '(a)' }, { v: 'e1b', label: '(b)' }, { v: 'e1c', label: '(c)' }, { v: 'e1d', label: '(d)' }],
  intro: (v) => { const [a, n] = HUNT[v]; return `Evaluate ${tex(`${a}^{1/${n}}`)} without a calculator.`; },
  make(stage, v, ex) {
    const W = ex.W, [a, n, tries] = HUNT[v], r = tries[tries.length - 1];
    const row0 = add(stage, h('div', 'u2l9-chain'), 34, 20); row0.style.fontSize = '42px';
    row0.appendChild(h('span', 'u2l9-piece', K(`${a}^{1/${cT(n)}}`)));
    const L1 = row0.appendChild(h('span', 'u2l9-piece', K(`=${n === 2 ? `\\sqrt{${a}}` : `\\sqrt[${cT(n)}]{${a}}`}`))); hide(L1);
    const q = add(stage, h('div', 'u2l9-hq', `Which number, used <b class="u2l9-tl">${n} times</b> as a factor, gives <b>${a}</b>?`), 34, 98); hide(q);
    // the scale: 0 … max, with the target flagged
    const vals = tries.map((k) => k ** n), max = Math.max(a, ...vals) * 1.08, sx0 = 60, sx1 = W - 60, sy = 352;
    const X = (val) => sx0 + (sx1 - sx0) * val / max;
    const svg = add(stage, svgEl('svg', { class: 'u2l9-hs', width: W, height: 420 }), 0, 0);
    const scale = svgEl('g', { class: 'u2l9-hs-g' }); svg.appendChild(scale);
    scale.appendChild(svgEl('line', { x1: sx0, y1: sy, x2: sx1, y2: sy, class: 'u2l9-hs-ax' }));
    scale.appendChild(svgEl('line', { x1: sx0, y1: sy - 8, x2: sx0, y2: sy + 8, class: 'u2l9-hs-ax' }));
    const z = svgEl('text', { x: sx0, y: sy + 30, class: 'u2l9-hs-n' }); z.textContent = '0'; scale.appendChild(z);
    scale.appendChild(svgEl('line', { x1: X(a), y1: sy - 34, x2: X(a), y2: sy + 10, class: 'u2l9-hs-tg' }));
    scale.appendChild(svgEl('path', { d: `M${X(a)} ${sy - 34} l26 9 l-26 9 z`, class: 'u2l9-hs-fl' }));
    const tl = svgEl('text', { x: X(a), y: sy + 30, class: 'u2l9-hs-n tg' }); tl.textContent = fmt(a); scale.appendChild(tl);
    scale.style.opacity = 0;
    // one card per try
    const cw = Math.min(290, (W - 68 - (tries.length - 1) * 24) / tries.length);
    const cards = tries.map((k, i) => {
      const val = k ** n, verdict = val === a ? 'hit' : val < a ? 'lo' : 'hi';
      const e = add(stage, h('div', 'u2l9-hc ' + verdict, `<div class="u2l9-hc-h">Try ${k}</div><div class="u2l9-hc-m">${K(`${timesT(k, n)}=${fmt(val)}`)}</div><div class="u2l9-hc-v">${verdict === 'hit' ? '✓ that’s it!' : verdict === 'lo' ? 'too small ↑' : 'too big ↓'}</div>`), 34 + i * (cw + 24), 146);
      e.style.width = cw + 'px'; hide(e);
      const pin = svgEl('g', { class: 'u2l9-hs-pin ' + verdict });
      pin.appendChild(svgEl('circle', { cx: X(val), cy: sy, r: 9 }));
      if (verdict !== 'hit') { const t = svgEl('text', { x: X(val), y: sy - 18 }); t.textContent = fmt(val); pin.appendChild(t); }
      svg.appendChild(pin); pin.style.opacity = 0;
      return { k, val, verdict, e, pin };
    });
    const res = add(stage, h('div', 'u2l9-res', K(`${a}^{1/${n}}=${rootT(n, a)}=\\mathbf{${r}}`)), W - 34, 20); res.style.translate = '-100% 0'; hide(res);
    const capTry = (t) => `Try <b>${t.k}</b>: ${tex(`${timesT(t.k, n)}=${t.val}`)}. ` + (t.verdict === 'hit' ? `That’s exactly <b>${a}</b> ✓` : t.verdict === 'lo' ? `Too <b>small</b>: try a bigger number.` : `Too <b>big</b>: try a smaller number.`);
    return [{
      cap: `The <b class="u2l9-tl">denominator ${n}</b> names the root: ${tex(`${a}^{1/${n}}=${rootT(n, a)}`)}, a <b>${ord(n)} root</b>. So ask: which number, used ${n} times as a factor, gives ${a}?`,
      run: (c) => Promise.all([c.fadeIn(L1, 400), c.fadeIn(q, 400, { delay: 200 }), c.fadeIn(scale, 400, { delay: 300 })])
    }, ...cards.map((t) => ({
      cap: capTry(t),
      run: (c) => Promise.all([c.pop(t.e, 400), c.pop(t.pin, 380, { delay: 200 })])
    })), {
      cap: `So <b>${tex(`${a}^{1/${n}}=${r}`)}</b>. Check: ${Array(n).fill(r).join(' × ')} = ${a}. Knowing your squares and cubes makes this quick.`,
      run: (c) => c.pop(res, 450)
    }];
  }
};

/* ============ 2. Root first or power first ============ */
const routes = {
  title: 'Root first or power first?',
  height: 456,
  choices: [{ sep: 'Notes:' }, [8, 2, 3], { sep: 'Try:' }, [100, 3, 2], { sep: 'Example 2 check:' }, [9, 3, 2], [27, 2, 3], [16, 3, 4], [4, 5, 2]].map((c) => (c.sep ? c : { v: c.join('|'), label: tex(`${tn(c[0])}^{${c[1]}/${c[2]}}`) })),
  intro: (v) => { const [a, m, n] = v.split('|').map(Number); return `${tex(`${tn(a)}^{${cA(m)}/${cT(n)}}`)}: the <b>denominator ${n}</b> means a ${ord(n)} root, the <b>numerator ${m}</b> means a power of ${m}. Which should we do first?`; },
  make(stage, v, ex) {
    const W = ex.W, [a, m, n] = v.split('|').map(Number), r = iroot(a, n), res = r ** m, big = a ** m;
    const lw = (W - 90) / 2, xA = 30, xB = 60 + lw, top = 76;
    const head = add(stage, h('div', 'u2l9-rt-head', K(`${tn(a)}^{${cA(m)}/${cT(n)}}`)), W / 2, 8); head.style.translate = '-50% 0';
    const lane = (x, cls, title) => { const l = add(stage, h('div', 'u2l9-rt-lane ' + cls, `<div class="u2l9-rt-lt">${title}</div>`), x, top); l.style.width = lw + 'px'; return l; };
    lane(xA, 'a', 'Root first, then power'); lane(xB, 'b', 'Power first, then root');
    const fs = 30, ln = (x, y, src) => { const e = add(stage, h('div', 'u2l9-line', K(src)), x + 22, y); e.style.fontSize = fs + 'px'; hide(e); return e; };
    const nt = (x, y, html) => { const e = add(stage, h('div', 'u2l9-rt-note', html), x + 22, y); e.style.width = (lw - 40) + 'px'; hide(e); return e; };
    const A1 = ln(xA, top + 46, `=\\left(${rootT(n, tn(a))}\\right)^{${m}}`), B1 = ln(xB, top + 46, `=${rootT(n, `${tn(a)}^{${m}}`)}`);
    const A2 = ln(xA, top + 106, `=${r}^{${m}}`), A2n = nt(xA, top + 150, `${tex(`${rootT(n, tn(a))}=${r}`)} because ${tex(`${r}^{${n}}=${tn(a)}`)}`);
    const A3 = ln(xA, top + 184, `=\\mathbf{${tn(res)}}`), A3n = nt(xA, top + 228, `${tex(`${r}^{${m}}=${tn(res)}`)} <b class="u2l9-ok">✓ easy</b>`);
    const B2 = ln(xB, top + 106, `=${rootT(n, tn(big))}`), B2n = nt(xB, top + 150, `${tex(`${tn(a)}^{${m}}=${tn(big)}`)}`);
    const B3 = ln(xB, top + 184, `=\\mathbf{${tn(res)}}`), B3n = nt(xB, top + 228, `${tex(`${tn(res)}^{${n}}=${tn(big)}`)} <b class="u2l9-rd">hard to spot!</b>`);
    const maxA = Math.max(a, res), by = top + 274, bx = 196, maxW = W - bx - 150;
    const bh = add(stage, h('div', 'u2l9-rt-bh', 'Biggest number on the way'), 30, by); hide(bh);
    const bar = (y, cls, lab, val) => {
      const l = add(stage, h('div', 'u2l9-rt-bl ' + cls, lab), 30, y); const b = add(stage, h('div', 'u2l9-rt-bar ' + cls), bx, y + 4);
      const w = Math.max(6, (maxW * val) / big); b.style.width = w + 'px';
      const t = add(stage, h('div', 'u2l9-rt-bv ' + cls, fmt(val)), bx + w + 10, y); hide(l, b, t); return [l, b, t];
    };
    const bA = bar(by + 30, 'a', 'Root first', maxA), bB = bar(by + 70, 'b', 'Power first', big);
    return [{
      cap: `Both orders are allowed: ${tex(`\\left(${rootT(n, tn(a))}\\right)^{${m}}`)} takes the <b>root first</b>, ${tex(rootT(n, `${tn(a)}^{${m}}`))} takes the <b>power first</b>.`,
      run: (c) => Promise.all([c.fadeIn(A1, 400), c.fadeIn(B1, 400, { delay: 250 })])
    }, {
      cap: `<b>Root first:</b> ${tex(`${rootT(n, tn(a))}=${r}`)}, because ${tex(`${timesT(r, n)}=${tn(a)}`)}. A small, friendly number.`,
      run: (c) => Promise.all([c.fadeIn(A2, 400), c.fadeIn(A2n, 350, { delay: 200 })])
    }, {
      cap: `Then the power: ${tex(`${r}^{${m}}=${tn(res)}`)}. Done!`,
      run: (c) => Promise.all([c.fadeIn(A3, 400), c.fadeIn(A3n, 350, { delay: 200 })])
    }, {
      cap: `<b>Power first:</b> ${tex(`${tn(a)}^{${m}}=${tn(big)}`)}. That number is already big.`,
      run: (c) => Promise.all([c.fadeIn(B2, 400), c.fadeIn(B2n, 350, { delay: 200 })])
    }, {
      cap: `Now we need ${tex(rootT(n, tn(big)))}: which number, used ${n} times as a factor, gives ${fmt(big)}? It’s ${fmt(res)}, but that’s hard to see without a calculator.`,
      run: (c) => Promise.all([c.fadeIn(B3, 400), c.fadeIn(B3n, 350, { delay: 200 })])
    }, {
      cap: `Same answer both ways: <b>${tex(`${tn(a)}^{${m}/${n}}=${tn(res)}`)}</b>. Root first, the biggest number was ${fmt(maxA)}; power first, ${fmt(big)}. <b>Take the root first.</b>`,
      run: async (c) => {
        await c.fadeIn(bh, 300);
        await Promise.all([...bA, ...bB].map((e, i) => (e.classList.contains('u2l9-rt-bar') ? c.anim(e, [{ opacity: 1, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }], 700, { delay: i > 2 ? 250 : 0 }) : c.fadeIn(e, 300, { delay: i > 2 ? 400 : 150 }))));
      }
    }];
  }
};

/* ============ 3. Converting between powers and radicals ============ */
/* power spec 'coef|base|m|n' (m < 0 for a negative exponent); radical spec 'R|recip|base|m|n' */
function powT(sp, cls, plain) {
  const [co, b, ms, n] = sp.split('|'), mm = Number(ms), m = Math.abs(mm);
  const cA = plain ? (x) => x : cA0, cT = plain ? (x) => x : cT0, cR = plain ? (x) => x : cR0;
  const C = (x) => (cls ? `\\htmlClass{u2l9-${x[0]}}{${x[1]}}` : x[1]);
  const coef = co ? C(['tk-c', co]) : '';
  return `${coef}${C(['tk-b', b])}^{${mm < 0 ? C(['tk-s', cR('-')]) : ''}${C(['tk-m', cA(m)])}/${C(['tk-n', cT(n)])}}`;
}
function radT(sp, cls, plain) {
  const [, rc, b, ms, n] = sp.split('|'), m = Number(ms);
  const cA = plain ? (x) => x : cA0, cT = plain ? (x) => x : cT0;
  const C = (x, y) => (cls ? `\\htmlClass{u2l9-${x}}{${y}}` : y);
  const inner = `${b}${m === 1 ? '' : `^{${C('tk-m', cA(m))}}`}`, rad = Number(n) === 2 ? `\\sqrt{${inner}}` : `\\sqrt[${C('tk-n', cT(n))}]{${inner}}`;
  return rc ? `\\dfrac{1}{${rad}}` : rad;
}
const convLabel = (sp) => tex(sp[0] === 'R' ? radT(sp, false, true) : powT(sp, false, true));
function convDef(title, list) {
  return {
    title,
    height: 400,
    choices: list.map((v) => (v.sep ? v : { v, label: convLabel(v) })),
    intro: (sp) => (sp[0] === 'R' ? `Write ${convLabel(sp)} as a <b>power</b>: the <b class="u2l9-tl">index</b> becomes the denominator, the <b class="u2l9-am">power inside</b> becomes the numerator.`
      : `Write ${convLabel(sp)} as a <b>radical</b>: the <b class="u2l9-tl">denominator</b> becomes the index, the <b class="u2l9-am">numerator</b> stays a power.`),
    make(stage, sp, ex) { return sp[0] === 'R' ? toPowSteps(stage, sp, ex.W) : toRadSteps(stage, sp, ex.W); }
  };
}
const lgX = (W) => (W < 900 ? 0.5 : 0.56);
function legend(stage, W, rows) {
  const lg = add(stage, h('div', 'u2l9-cx-lg', rows.map(([cls, k, val]) => `<div class="u2l9-cx-r ${cls}"><span class="u2l9-cx-k">${k}</span><span class="u2l9-cx-v">${val}</span></div>`).join('')), W * lgX(W), 16);
  lg.style.width = (W * (1 - lgX(W)) - 30) + 'px';
  return lg;
}
function toRadSteps(stage, sp, W) {
  const [co, b, ms, ns] = sp.split('|'), mm = Number(ms), m = Math.abs(mm), n = Number(ns), neg = mm < 0;
  const B = board(stage, { x: 36, y: 18, lh: 100, fs: 36 });
  const L0 = B.line(powT(sp, true), { fs: 54 }); L0.el.style.opacity = 1;
  const rows = [['b', 'base', tex(b)]];
  if (neg) rows.push(['s', 'negative sign', '<b>flip</b>: one over…']);
  rows.push(['m', 'numerator', `${tex(cA(m))}: the <b>power</b>`], ['n', 'denominator', `${tex(cT(n))}: the <b>index</b> (root)`]);
  const lg = legend(stage, W, rows); const lrows = [...lg.children]; hide(...lrows);
  const pre = co || '';
  const idx = n === 2 ? '' : `[\\htmlClass{u2l9-tk-i}{${cT(n)}}]`;
  const radi = `\\sqrt${idx}{${b}${m === 1 ? '' : `^{\\htmlClass{u2l9-tk-p}{${cA(m)}}}`}}`;
  const wrap = (rad) => (neg ? `\\dfrac{${co || 1}}{${rad}}` : `${pre}${rad}`);
  const L1 = neg ? B.line(`=\\dfrac{${co || 1}}{${b}^{${m}/${n}}}`) : null;
  const L2 = B.line(`=${wrap(radi)}`);
  const finalT = wrap(`\\sqrt${n === 2 ? '' : `[${n}]`}{${b}${m === 1 ? '' : `^{${m}}`}}`);
  const altT = m > 1 ? wrap(`\\left(\\sqrt${n === 2 ? '' : `[${n}]`}{${b}}\\right)^{${m}}`) : null;
  const res = add(stage, h('div', 'u2l9-cx-res', `${K(`${powT(sp)}=${finalT}`)}${altT ? `<div class="u2l9-cx-alt">also correct: ${K(altT)}</div>` : ''}`), W * lgX(W), 236); hide(res);
  res.style.width = (W * (1 - lgX(W)) - 30) + 'px';
  const steps = [{
    cap: `<b class="u2l9-am">Numerator ${m}</b> is the power; <b class="u2l9-tl">denominator ${n}</b> is the index of the root.` + (neg ? ` The <b class="u2l9-rd">negative sign</b> means reciprocal.` : ''),
    run: async (c) => {
      ['b', 's', 'm', 'n'].forEach((k) => L0.qa('.u2l9-tk-' + k).forEach((e) => e.classList.add('u2l9-lit-' + k)));
      await Promise.all(lrows.map((r, i) => c.fadeIn(r, 300, { delay: i * 150, from: 'translateX(10px)' })));
    }
  }];
  if (neg) steps.push({
    cap: `The exponent is <b>negative</b>: take the reciprocal. ${tex(`${b}^{-${m}/${n}}=\\dfrac{1}{${b}^{${m}/${n}}}`)}. Now the exponent is positive.`,
    run: (c) => showRow(c, stage, L1)
  });
  steps.push({
    cap: `<b class="u2l9-tl">Denominator ${n}</b> → the index of the root${n === 2 ? ' (index 2 is the plain square root, so it isn’t written)' : ''}. <b class="u2l9-am">Numerator ${m}</b> → the power inside${m === 1 ? ' (a power of 1 isn’t written)' : ''}.`,
    run: (c) => showRow(c, stage, L2, [n === 2 ? null : [L0.q('.u2l9-tk-n'), L2.q('.u2l9-tk-i'), cT(n), TL], m === 1 ? null : [L0.q('.u2l9-tk-m'), L2.q('.u2l9-tk-p'), cA(m), AM]], 36)
  });
  steps.push({
    cap: `So <b>${tex(`${powT(sp, false, true)}=${finalT}`)}</b>.` + (altT ? ` Taking the root first, ${tex(altT)}, is the same thing.` : ''),
    run: (c) => c.pop(res, 450)
  });
  return steps;
}
function toPowSteps(stage, sp, W) {
  const [, rc, b, ms, ns] = sp.split('|'), m = Number(ms), n = Number(ns);
  const B = board(stage, { x: 36, y: rc ? 8 : 18, lh: 110, fs: 40 });
  const L0 = B.line(radT(sp, true), { fs: rc ? 40 : 54 }); L0.el.style.opacity = 1;
  const rows = [['n', 'index', n === 2 ? `${tex('\\sqrt{\\ }')} means index ${tex(cT(2))}` : `${tex(cT(n))} → the <b>denominator</b>`],
    ['m', 'power inside', m === 1 ? `none written: it’s ${tex(cA(1))}` : `${tex(cA(m))} → the <b>numerator</b>`]];
  if (rc) rows.push(['s', 'one over', 'a <b>negative</b> exponent']);
  const lg = legend(stage, W, rows); const lrows = [...lg.children]; hide(...lrows);
  const pT = `${b}^{\\htmlClass{u2l9-tk-p}{${cA(m)}}/\\htmlClass{u2l9-tk-d}{${cT(n)}}}`;
  const L1 = B.line(`=${rc ? `\\dfrac{1}{${pT}}` : pT}`, { y: rc ? 150 : 128 });
  const L2 = rc ? B.line(`=\\boldsymbol{${b}^{${cR('-')}${m}/${n}}}`, { y: 266 }) : null;
  const fin = `${b}^{${rc ? '-' : ''}${m}/${n}}`;
  const res = add(stage, h('div', 'u2l9-cx-res', K(`${radT(sp, false, true)}=${fin}`)), W * lgX(W), 236); hide(res); res.style.width = (W * (1 - lgX(W)) - 30) + 'px';
  const steps = [{
    cap: (n === 2 ? `A plain square root has index <b class="u2l9-tl">2</b>, even though it isn’t written. ` : `The <b class="u2l9-tl">index ${n}</b> becomes the denominator. `) + (m === 1 ? `There’s no power written inside, so the numerator is <b class="u2l9-am">1</b>.` : `The <b class="u2l9-am">power ${m}</b> inside becomes the numerator.`),
    run: async (c) => { L0.qa('.u2l9-tk-n').forEach((e) => e.classList.add('u2l9-lit-n')); L0.qa('.u2l9-tk-m').forEach((e) => e.classList.add('u2l9-lit-m')); await Promise.all(lrows.map((r, i) => c.fadeIn(r, 300, { delay: i * 150, from: 'translateX(10px)' }))); }
  }, {
    cap: `Power over root: ${tex(`${rootT(n, `${b}${m === 1 ? '' : `^{${m}}`}`)}=${b}^{${m}/${n}}`)}.`,
    run: (c) => showRow(c, stage, L1, [[L0.q('.u2l9-tk-n') || L0.el, L1.q('.u2l9-tk-d'), cT(n), TL], [L0.q('.u2l9-tk-m') || L0.el, L1.q('.u2l9-tk-p'), cA(m), AM]], 40)
  }];
  if (rc) steps.push({
    cap: `A power under the fraction bar moves <b>up</b> with a <b>negative</b> exponent: ${tex(`\\dfrac{1}{${b}^{${m}/${n}}}=${b}^{-${m}/${n}}`)}.`,
    run: (c) => showRow(c, stage, L2)
  });
  steps.push({ cap: `So <b>${tex(`${radT(sp, false, true)}=${fin}`)}</b>.`, run: (c) => c.pop(res, 450) });
  return steps;
}
const conv1 = convDef('Power → radical', [{ sep: 'Try:' }, '|a|4|5', '|b|-2|3', { sep: 'Example 3 check:' }, '|x|1|5', '|y|2|3', '|w|3|4', '|z|-1|2']);
const toPow = convDef('Radical → power', [{ sep: 'Try:' }, 'R||a|4|3', 'R|1|b|1|2', { sep: 'Example 4 check:' }, 'R||x|2|3', 'R||y|3|4', 'R||z|5|2', 'R|1|w|2|3']);

/* ============ 4. Same law, now with fractions ============ */
const LAWS = {
  product: {
    name: 'Product law', law: 'x^m\\times x^n=x^{m+n}',
    L: [['x^2\\times x^3=(x\\cdot x)(x\\cdot x\\cdot x)'], ['=x^{2+3}=x^5']],
    R: [['x^{2/3}\\times x^{1/6}=x^{\\frac23+\\frac16}'], ['=x^{\\frac46+\\frac16}', '\\tfrac23=\\tfrac46'], ['=x^{5/6}']],
    chk: 'x=64:\\quad 64^{2/3}\\times64^{1/6}=16\\times2=32\\qquad 64^{5/6}=\\left(\\sqrt[6]{64}\\right)^{5}=2^5=32\\ \\checkmark',
    caps: [
      `With whole-number exponents we can <b>count the factors</b>: two x’s and three more make <b>five</b>. Same base, multiplied: <b>add</b> the exponents.`,
      `With fractions we can’t count “two-thirds of an x”, but the <b>law still works</b>: add the exponents, ${tex('\\tfrac23+\\tfrac16')}.`,
      `To add fractions, get a <b>common denominator</b>. 6 works: ${tex('\\tfrac23=\\tfrac46')}.`,
      `Add the tops: ${tex('\\tfrac46+\\tfrac16=\\tfrac56')}. So the answer is ${tex('x^{5/6}')}.`,
      `<b>Check</b> with ${tex('x=64')}: both sides give <b>32</b>. The product law holds with fractions.`
    ]
  },
  quotient: {
    name: 'Quotient law', law: 'x^m\\div x^n=x^{m-n}',
    L: [['x^5\\div x^2=\\dfrac{x\\cdot x\\cdot x\\cdot x\\cdot x}{x\\cdot x}'], ['=x^{5-2}=x^3']],
    R: [['x^{3/4}\\div x^{1/2}=x^{\\frac34-\\frac12}'], ['=x^{\\frac34-\\frac24}', '\\tfrac12=\\tfrac24'], ['=x^{1/4}']],
    chk: 'x=16:\\quad 16^{3/4}\\div16^{1/2}=8\\div4=2\\qquad 16^{1/4}=2\\ \\checkmark',
    caps: [
      `Two of the five x’s <b>cancel</b>, leaving <b>three</b>. Same base, divided: <b>subtract</b> the exponents.`,
      `With fractions: still <b>subtract</b>, ${tex('\\tfrac34-\\tfrac12')}.`,
      `Common denominator <b>4</b>: ${tex('\\tfrac12=\\tfrac24')}.`,
      `${tex('\\tfrac34-\\tfrac24=\\tfrac14')}, so the answer is ${tex('x^{1/4}')}.`,
      `<b>Check</b> with ${tex('x=16')}: both sides give <b>2</b>.`
    ]
  },
  power: {
    name: 'Power of a power', law: '(x^m)^n=x^{m\\times n}',
    L: [['(x^2)^3=x^2\\cdot x^2\\cdot x^2'], ['=x^{2\\times3}=x^6']],
    R: [['\\left(x^{2/3}\\right)^{3}=x^{\\frac23\\times3}'], ['=x^{\\frac23\\times\\frac31}=x^{\\frac63}', '3=\\tfrac31'], ['=x^{2}']],
    chk: 'x=8:\\quad \\left(8^{2/3}\\right)^{3}=4^{3}=64\\qquad 8^{2}=64\\ \\checkmark',
    caps: [
      `Three copies of ${tex('x^2')} is ${tex('2+2+2=2\\times3')} x’s. A power of a power: <b>multiply</b> the exponents.`,
      `With fractions: still <b>multiply</b>, ${tex('\\tfrac23\\times3')}.`,
      `A whole number is a fraction over 1. Top × top, bottom × bottom: ${tex('\\tfrac23\\times\\tfrac31=\\tfrac63')}.`,
      `<b>Simplify</b>: ${tex('\\tfrac63=2')}. The answer is just ${tex('x^{2}')}.`,
      `<b>Check</b> with ${tex('x=8')}: both sides give <b>64</b>.`
    ]
  },
  prod: {
    name: 'Power of a product', law: '(ab)^n=a^nb^n',
    L: [['(2x)^3=2x\\cdot2x\\cdot2x'], ['=2^3x^3=8x^3']],
    R: [['\\left(2x^{1/3}\\right)^{3}=2^{3}\\,x^{\\frac13\\times3}'], ['=8x^{\\frac33}', '\\tfrac13\\times\\tfrac31=\\tfrac33'], ['=8x']],
    chk: 'x=8:\\quad \\left(2\\times8^{1/3}\\right)^{3}=(2\\times2)^3=64\\qquad 8\\times8=64\\ \\checkmark',
    caps: [
      `The power goes to <b>every factor</b> inside the bracket, the 2 included: ${tex('2^3=8')}.`,
      `With fractions: <b>both</b> factors get the power 3. The 2 becomes ${tex('2^3')}, and ${tex('x^{1/3}')} gets ${tex('\\tfrac13\\times3')}.`,
      `${tex('2^3=8')}, and ${tex('\\tfrac13\\times3=\\tfrac33')}.`,
      `${tex('\\tfrac33=1')}, and ${tex('x^1')} is just ${tex('x')}. The answer is ${tex('8x')}.`,
      `<b>Check</b> with ${tex('x=8')}: both sides give <b>64</b>.`
    ]
  }
};
const laws = {
  title: 'Same law, now with fractions',
  height: 440,
  minW: 860, // drawn this wide and scaled to fit
  choices: [{ v: 'product', label: 'Product' }, { v: 'quotient', label: 'Quotient' }, { v: 'power', label: 'Power of a power' }, { v: 'prod', label: 'Power of a product' }],
  intro: (v) => `<b>${LAWS[v].name}.</b> First with whole-number exponents, then the <b>same law</b> with fractions.`,
  make(stage, v, ex) {
    const W = ex.W, L = LAWS[v];
    add(stage, h('div', 'u2l9-lw-ban c', `<span class="u2l9-lw-name">${L.name}</span>${K(L.law)}`), W / 2, 36);
    const pw2 = (W - 48) / 2, py = 84, ph = 262;
    const mk = (x, cls, head, rows) => {
      const p = add(stage, h('div', 'u2l9-lw-panel ' + cls, `<div class="u2l9-lw-h">${head}</div>`), x, py); p.style.width = pw2 + 'px'; p.style.height = ph + 'px';
      return rows.map(([src, help]) => {
        const r = h('div', 'u2l9-lw-row', `<span class="u2l9-lw-t">${K(src)}</span>${help ? `<span class="u2l9-lw-help">${K(help)}</span>` : ''}`); p.appendChild(r); hide(r); return r;
      });
    };
    const lr = mk(16, 'int', 'Whole-number exponents', L.L), rr = mk(32 + pw2, 'frac', 'Fraction exponents', L.R);
    const chk = add(stage, h('div', 'u2l9-lw-chk', `<span class="u2l9-lw-chk-h">Check</span>${K(L.chk)}`), 16, py + ph + 14); chk.style.width = (W - 32) + 'px'; hide(chk);
    const show = (c, el, ms = 380, o = {}) => c.fadeIn(el, ms, Object.assign({ from: 'translateX(-10px)' }, o));
    return [
      { cap: L.caps[0], run: async (c) => { await show(c, lr[0]); await show(c, lr[1], 380, { delay: 250 }); } },
      { cap: L.caps[1], run: (c) => show(c, rr[0]) },
      { cap: L.caps[2], run: (c) => show(c, rr[1], 450) },
      { cap: L.caps[3], run: async (c) => { await c.pop(rr[2], 450); rr[2].classList.add('u2l9-lw-win'); } },
      { cap: L.caps[4], run: (c) => c.fadeIn(chk, 400) }
    ];
  }
};

/* ============ 4. The stepper: one law at a time (Example 5) ============ */
const LAW = {
  P: ['Product law', 'x^m\\times x^n=x^{m+n}'],
  Q: ['Quotient law', 'x^m\\div x^n=x^{m-n}'],
  PP: ['Power of a power', '(x^m)^n=x^{m\\times n}'],
  PR: ['Power of a product', '(ab)^n=a^nb^n']
};
const CASES = {
  d1: { q: 'y^{2/3}\\times y^{2/3}', s: [
    { cap: `Same base <b>y</b>, multiplied: <b>product law</b>. Add the exponents.`, law: 'P', line: '=y^{\\frac23+\\frac23}' },
    { cap: `The denominators already match: add the tops, keep the bottom. ${tex('\\tfrac23+\\tfrac23=\\tfrac43')}. An improper fraction is fine as an exponent ✓`, fw: ['\\tfrac23+\\tfrac23', '=\\tfrac43'], line: '=\\boldsymbol{y^{4/3}}', final: true }] },
  d2: { q: '\\left(x^{3/4}\\right)^{2}', s: [
    { cap: `A power of a power: <b>multiply</b> the exponents.`, law: 'PP', line: '=x^{\\frac34\\times2}' },
    { cap: `A whole number is over 1: ${tex('\\tfrac34\\times\\tfrac21=\\tfrac64')}.`, fw: ['\\tfrac34\\times2', '=\\tfrac34\\times\\tfrac21', '=\\tfrac64'], line: '=x^{6/4}' },
    { cap: `<b>Simplify</b> the fraction: ${tex('\\tfrac64=\\tfrac32')} (divide top and bottom by 2).`, fw: ['\\tfrac64=\\tfrac32'], line: '=\\boldsymbol{x^{3/2}}', final: true }] },
  a: { q: 'b^{1/4}\\times b^{1/2}', s: [
    { cap: `Same base <b>b</b>, multiplied: <b>product law</b>. Add the exponents.`, law: 'P', line: '=b^{\\frac14+\\frac12}' },
    { cap: `Common denominator <b>4</b>: ${tex('\\tfrac12=\\tfrac24')}, so ${tex('\\tfrac14+\\tfrac24=\\tfrac34')}.`, fw: ['\\tfrac14+\\tfrac12', '=\\tfrac14+\\tfrac24', '=\\tfrac34'], line: '=b^{\\frac14+\\frac24}' },
    { cap: `<b>Example 5(a):</b> ${tex('b^{3/4}')}. Positive exponent, lowest terms ✓`, line: '=\\boldsymbol{b^{3/4}}', final: true }] },
  b: { q: 'c^{5/6}\\div c^{1/6}', s: [
    { cap: `Same base <b>c</b>, divided: <b>quotient law</b>. Subtract the exponents.`, law: 'Q', line: '=c^{\\frac56-\\frac16}' },
    { cap: `Same denominators: ${tex('\\tfrac56-\\tfrac16=\\tfrac46')}.`, fw: ['\\tfrac56-\\tfrac16', '=\\tfrac46'], line: '=c^{4/6}' },
    { cap: `<b>Simplify</b>: ${tex('\\tfrac46=\\tfrac23')}. <b>Example 5(b):</b> ${tex('c^{2/3}')}.`, fw: ['\\tfrac46=\\tfrac23'], line: '=\\boldsymbol{c^{2/3}}', final: true }] },
  c: { q: '\\left(d^{1/3}\\right)^{6}', s: [
    { cap: `A power of a power: <b>multiply</b> the exponents.`, law: 'PP', line: '=d^{\\frac13\\times6}' },
    { cap: `${tex('\\tfrac13\\times\\tfrac61=\\tfrac63')}, and ${tex('\\tfrac63=2')}.`, fw: ['\\tfrac13\\times6', '=\\tfrac13\\times\\tfrac61', '=\\tfrac63=2'], line: '=d^{6/3}' },
    { cap: `<b>Example 5(c):</b> a whole-number exponent: ${tex('d^{2}')}.`, line: '=\\boldsymbol{d^{2}}', final: true }] },
  d: { q: '\\left(4g^{1/2}\\right)^{2}', s: [
    { cap: `<b>Power of a product</b>: the 2 goes to <b>both</b> factors, the 4 included.`, law: 'PR', line: '=4^{2}\\,g^{\\frac12\\times2}' },
    { cap: `The number: ${tex('4^2=16')}. The variable: ${tex('\\tfrac12\\times2=\\tfrac22=1')}.`, fw: ['4^{2}=16', '\\tfrac12\\times2=\\tfrac22=1'], line: '=16g^{1}' },
    { cap: `${tex('g^1')} is just ${tex('g')}. <b>Example 5(d):</b> ${tex('16g')}.`, line: '=\\boldsymbol{16g}', final: true }] }
};
const stepper = {
  title: 'One law at a time',
  height: 430,
  choices: [{ sep: 'Try:' }, { v: 'd1', label: tex(CASES.d1.q) }, { v: 'd2', label: tex(CASES.d2.q) },
    { sep: 'Example 5 check:' }, ...'abcd'.split('').map((k) => ({ v: k, label: `(${k})` }))],
  intro: (v) => `Simplify ${tex(CASES[v].q)}. Which law? Then do the <b>fraction work</b> on the exponents.`,
  make(stage, v, ex) {
    const W = ex.W, H = 430, C = CASES[v], lh = 80, fs = 32, x0 = 26, rx = Math.round(W * 0.56), rw = W - rx - 20;
    const line = (src, y, o = {}) => { const el = add(stage, h('div', 'u2l9-line', K(src)), x0, y); el.style.fontSize = (o.fs || fs) + 'px'; el.style.height = lh + 'px'; return el; };
    line(C.q, 16, { fs: 36 });
    let y = 16 + lh;
    const lawBox = add(stage, h('div', 'u2l9-st-law'), rx, 16); lawBox.style.width = rw + 'px';
    lawBox.innerHTML = '<div class="u2l9-st-law-h">Law</div><div class="u2l9-st-law-b muted">Which law?</div>';
    const fwBox = add(stage, h('div', 'u2l9-st-fw', '<div class="u2l9-st-fw-h">Exponent work</div>'), rx, 134); fwBox.style.width = rw + 'px'; fwBox.style.height = (H - 150) + 'px';
    const fwList = h('div', 'u2l9-st-fw-l'); fwBox.appendChild(fwList);
    const shownFw = [];
    return C.s.map((st) => {
      let el = null, fws = [];
      if (st.line) { el = line(st.line, y); hide(el); y += lh; }
      if (st.fw) fws = st.fw.map((s) => { const r = h('div', 'u2l9-st-fw-r', K(s)); fwList.appendChild(r); hide(r); return r; });
      return {
        cap: st.cap,
        run: async (c) => {
          if (st.law) {
            const [nm, f] = LAW[st.law];
            lawBox.innerHTML = `<div class="u2l9-st-law-h">Law</div><div class="u2l9-st-law-b"><b>${nm}</b>${K(f)}</div>`;
            await c.pop(lawBox.lastChild, 420);
          }
          if (fws.length) {
            shownFw.forEach((r) => r.classList.add('old'));
            for (const r of fws) { await c.fadeIn(r, 380, { from: 'translateY(8px)' }); shownFw.push(r); await c.sleep(220); }
          }
          if (el) {
            if (st.final) { await c.pop(el, 480); el.classList.add('u2l9-st-final'); }
            else await c.fadeIn(el, 420, { from: 'translateX(-10px)' });
          }
        }
      };
    });
  }
};

/* ============ warm-up: patios and cube blocks ============ */
function patioSvg(n, S) {
  const t = S / n, svg = svgEl('svg', { class: 'u2l9-pat', viewBox: `-4 -4 ${S + 8} ${S + 8}`, width: S + 8, height: S + 8 });
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) svg.appendChild(svgEl('rect', { x: i * t, y: j * t, width: t, height: t, class: 'u2l9-tile' + (j === n - 1 ? ' bot' : '') }));
  svg.appendChild(svgEl('rect', { x: 0, y: 0, width: S, height: S, class: 'u2l9-pat-out' }));
  return svg;
}
function blockSvg(n, S) {
  const u = S / (n * 1.5), dx = 0.5 * u, dy = 0.4 * u, w = n * u + n * dx, hgt = n * u + n * dy;
  const svg = svgEl('svg', { class: 'u2l9-blk', viewBox: `-4 -4 ${w + 8} ${hgt + 8}`, width: w + 8, height: hgt + 8 });
  const X = (x, y) => x, Y = (y) => hgt - y; // y up
  const P = (pts) => pts.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ');
  const N = n * u;
  svg.appendChild(svgEl('polygon', { points: P([[0, 0], [N, 0], [N, N], [0, N]]), class: 'f-front' }));
  svg.appendChild(svgEl('polygon', { points: P([[0, N], [N, N], [N + n * dx, N + n * dy], [n * dx, N + n * dy]]), class: 'f-top' }));
  svg.appendChild(svgEl('polygon', { points: P([[N, 0], [N + n * dx, n * dy], [N + n * dx, N + n * dy], [N, N]]), class: 'f-side' }));
  for (let i = 1; i < n; i++) {
    svg.appendChild(svgEl('line', { x1: i * u, y1: Y(0), x2: i * u, y2: Y(N), class: 'gl' }));
    svg.appendChild(svgEl('line', { x1: 0, y1: Y(i * u), x2: N, y2: Y(i * u), class: 'gl' }));
    svg.appendChild(svgEl('line', { x1: i * u, y1: Y(N), x2: i * u + n * dx, y2: Y(N + n * dy), class: 'gl' }));
    svg.appendChild(svgEl('line', { x1: i * dx, y1: Y(N + i * dy), x2: N + i * dx, y2: Y(N + i * dy), class: 'gl' }));
    svg.appendChild(svgEl('line', { x1: N + i * dx, y1: Y(i * dy), x2: N + i * dx, y2: Y(N + i * dy), class: 'gl' }));
    svg.appendChild(svgEl('line', { x1: N, y1: Y(i * u), x2: N + n * dx, y2: Y(i * u + n * dy), class: 'gl' }));
  }
  svg.appendChild(svgEl('polygon', { points: P([[0, 0], [N, 0], [N + n * dx, n * dy], [N + n * dx, N + n * dy], [n * dx, N + n * dy], [0, N]]), class: 'out' }));
  svg.appendChild(svgEl('line', { x1: 0, y1: Y(0), x2: N, y2: Y(0), class: 'edge' }));
  return svg;
}
function mountWarm() {
  document.querySelectorAll('[data-u2l9-fig]').forEach((fig) => {
    const [kind, ns] = fig.dataset.u2l9Fig.split('|'), n = Number(ns), host = fig.querySelector('.u2l9-fsvg');
    host.appendChild(kind === 'sq' ? patioSvg(n, 118) : blockSvg(n, 134));
    fig.setAttribute('data-tap', ''); fig.setAttribute('role', 'button'); fig.tabIndex = 0;
    fig.addEventListener('click', (e) => {
      if (e.target.closest('[data-reveal]')) { fig.classList.add('on'); return; } // the "?" itself was tapped
      const on = fig.classList.toggle('on');
      const rv = fig.querySelector('[data-reveal]'); if (on && rv && !rv.classList.contains('bk-on')) rv.click();
    });
  });
}

/* ============ 3. The power-over-root converter ============ */
function mountConverter() {
  const host = document.getElementById('u2l9-conv'); if (!host) return;
  const st = { base: 'x', m: 2, n: 3, sign: 1 };
  const out = { pow: host.querySelector('.u2l9-cv-pow'), rad: host.querySelector('.u2l9-cv-rad'), note: host.querySelector('.u2l9-cv-note') };
  const btns = (k) => [...host.querySelectorAll(`[data-cv="${k}"] button`)];
  function draw() {
    const { base: b, m, n, sign } = st, neg = sign < 0, g = gcd(m, n);
    host.querySelector('[data-cv="m"]').textContent = m; host.querySelector('[data-cv="n"]').textContent = n;
    btns('base').forEach((e) => e.classList.toggle('on', e.dataset.v === b));
    btns('sign').forEach((e) => e.classList.toggle('on', Number(e.dataset.v) === sign));
    const powS = `${b}^{${neg ? cR('-') : ''}${cA(m)}/${cT(n)}}`;
    const inner = `${b}${m === 1 ? '' : `^{${cA(m)}}`}`, rad = n === 2 ? `\\sqrt{${inner}}` : `\\sqrt[${cT(n)}]{${inner}}`;
    const rootFirst = m === 1 ? null : `\\left(${n === 2 ? `\\sqrt{${b}}` : `\\sqrt[${cT(n)}]{${b}}`}\\right)^{${cA(m)}}`;
    const wrap = (s) => (neg ? `\\dfrac{1}{${s}}` : s);
    out.pow.innerHTML = K(powS);
    out.rad.innerHTML = K(wrap(rad) + (rootFirst ? '=' + wrap(rootFirst) : ''));
    let note = `<b class="u2l9-tl">${n === 2 ? 'square' : n === 3 ? 'cube' : n + 'th'} root</b> (index ${n}${n === 2 ? ', not written' : ''}), <b class="u2l9-am">power ${m}</b>${m === 1 ? ' (not written)' : ''}${neg ? ', <b class="u2l9-rd">negative: one over</b>' : ''}.`;
    if (g > 1) note += ` <span class="u2l9-rd">Simplify the exponent first: ${tex(`\\tfrac{${m}}{${n}}=\\tfrac{${m / g}}{${n / g}}`)}.</span>`;
    if (b !== 'x' && b !== 'y') {
      const r = iroot(Number(b), n);
      if (r != null) { const v = r ** m; note += ` Value: root first, ${tex(`${rootT(n, b)}=${r}`)}, then ${tex(`${r}^{${m}}=${tn(v)}`)}${neg ? `, so ${tex(`${b}^{-${m}/${n}}=\\tfrac{1}{${tn(v)}}`)}` : ''}.`; }
      else note += ` ${tex(rootT(n, b))} isn’t a whole number: no nice value.`;
    }
    out.note.innerHTML = note;
  }
  host.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const k = b.dataset.cv || b.parentElement.dataset.cv;
    if (k === 'base') st.base = b.dataset.v; else if (k === 'sign') st.sign = Number(b.dataset.v);
    else if (k === 'm+') st.m = Math.min(9, st.m + 1); else if (k === 'm-') st.m = Math.max(1, st.m - 1);
    else if (k === 'n+') st.n = Math.min(8, st.n + 1); else if (k === 'n-') st.n = Math.max(2, st.n - 1);
    draw();
  });
  draw();
}

/* ============ Math History: Newton's 1676 letter ============ */
function newtonLetter() {
  const svg = document.getElementById('u2l9-hist'); if (!svg) return;
  const mk = (tag, attrs, parent) => { const e = svgEl(tag, attrs); (parent || svg).appendChild(e); return e; };
  const steps = [], when = (el, ms) => { steps.push({ el, t: ms }); return el; };
  mk('path', { d: 'M28 22 Q24 14 34 13 L330 10 Q342 10 342 22 L346 270 Q346 282 334 282 L36 286 Q24 286 24 274 Z', class: 'u2l9h-paper' });
  for (let i = 0; i < 9; i++) mk('line', { x1: 50, x2: 318, y1: 52 + i * 26, y2: 52 + i * 26, class: 'u2l9h-rule' });
  const ft = mk('foreignObject', { x: 40, y: 24, width: 290, height: 40 }); ft.innerHTML = '<div xmlns="http://www.w3.org/1999/xhtml" class="u2l9h-head">June 1676</div>';
  const ROWS = [['\\sqrt{a}', 'a^{1/2}'], ['\\sqrt{a^{3}}', 'a^{3/2}'], ['\\sqrt[3]{a^{5}}', 'a^{5/3}']];
  ROWS.forEach(([r, p], i) => {
    const y = 74 + i * 66;
    const fo = when(mk('foreignObject', { x: 46, y, width: 120, height: 60, class: 'u2l9h-g' }), 400 + i * 1500);
    fo.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" class="u2l9h-old">${K(r)}</div>`;
    const ar = when(mk('g', { class: 'u2l9h-g' }), 1000 + i * 1500);
    mk('line', { x1: 168, x2: 222, y1: y + 30, y2: y + 30, class: 'u2l9h-arr' }, ar);
    mk('path', { d: `M222 ${y + 23} L234 ${y + 30} L222 ${y + 37} Z`, class: 'u2l9h-ah' }, ar);
    const fn = when(mk('foreignObject', { x: 238, y, width: 110, height: 60, class: 'u2l9h-g' }), 1300 + i * 1500);
    fn.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" class="u2l9h-new">${K(p)}</div>`;
  });
  // the key on the right
  const key = when(mk('g', { class: 'u2l9h-g' }), 5400);
  const fk = mk('foreignObject', { x: 362, y: 70, width: 230, height: 170 }, key);
  fk.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" class="u2l9h-key"><div class="u2l9h-kh">power over root</div>${K(`a^{${cA('m')}/${cT('n')}}=\\sqrt[${cT('n')}]{a^{${cA('m')}}}`)}<div class="u2l9h-ks">the same rule we use today</div></div>`;
  const END = 6200;
  let t0 = 0, raf = 0;
  const draw = (ms) => steps.forEach((s) => s.el.classList.toggle('on', s.t <= ms));
  function frame(now) { if (!t0) t0 = now; const ms = now - t0; draw(ms); if (ms < END) raf = requestAnimationFrame(frame); }
  function play() {
    cancelAnimationFrame(raf); t0 = 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(END); return; }
    draw(-1); raf = requestAnimationFrame(frame);
  }
  draw(-1);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
    io.observe(svg);
  } else play();
}

mountWarm();
mountConverter();
newtonLetter();
export const explainers = mountExplainers({ whyRoot, hunt, routes, conv1, toPow, laws, stepper });

/* ============ Stand Up Break! — rational exponents at the whiteboards ============ */
standup('u2l9', (() => {
  const rt = (n, a) => (n === 2 ? '\\sqrt{' + a + '}' : '\\sqrt[' + n + ']{' + a + '}');
  const t = (a) => (a >= 1000 ? String(a).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : String(a));
  /* every perfect power a = r^n (Math 15 sizes) */
  const PP = [];
  [[2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]], [3, [2, 3, 4, 5, 10]], [4, [2, 3, 4, 5]], [5, [2, 3]]].forEach(([n, rs]) => rs.forEach((r) => PP.push({ r, n, a: r ** n })));
  // the assignment's own questions are left out: Q1 49, 121 (½), 27, 1000 (⅓), 81 (¼), 32 (⅕); Q2 8^{4/3} 9^{5/2} 25^{3/2} 16^{5/4} 64^{2/3} 4^{7/2}
  const A1 = new Set(['49|2', '121|2', '27|3', '1000|3', '81|4', '32|5']);
  const A2 = new Set(['8|4|3', '9|5|2', '25|3|2', '16|5|4', '64|2|3', '4|7|2']);
  const LET = ['a', 'b', 'c', 'd', 'g', 'h', 'k', 'x', 'y', 'z', 'w', 'v'];
  // Q4/Q5 (exponent signatures, any letter) and Q6–Q8, Q15, Q16 (law questions) are left out too
  const A4 = new Set(['1/6', '1/7', '2/5', '3/8', '-1/3', '-3/4']), A5 = new Set(['3/4', '2/5', '9/2', '1/3', '-5/6', '-3/2']);
  const fr = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return [n, d]; };
  const ft = ([n, d], small = true) => (d === 1 ? String(n) : (n < 0 ? '-' : '') + (small ? '\\tfrac{' : '\\frac{') + Math.abs(n) + '}{' + d + '}');
  const ex = ([n, d]) => (d === 1 ? String(n) : n + '/' + d);
  const pwr = (v, e) => (e[1] === 1 ? (e[0] === 1 ? v : v + '^{' + e[0] + '}') : v + '^{' + ex(e) + '}');
  const posAns = (v, e) => (e[0] === 0 ? '1' : e[0] < 0 ? '\\dfrac{1}{' + pwr(v, [-e[0], e[1]]) + '}' : pwr(v, e));
  const pick = (r, list) => r.pick(list);
  return {
    intro: 'At your whiteboard station, no calculator. The denominator is the root, the numerator is the power: take the root first.',
    levels: {
      BEG: (r) => { // Example 1: a unit fraction exponent is a root
        const p = pick(r, PP.filter((x) => !A1.has(x.a + '|' + x.n) && x.a <= 1000));
        return { q: t(p.a) + '^{1/' + p.n + '}', a: '=' + rt(p.n, t(p.a)) + '=' + p.r + '\\quad\\text{(since }' + timesT(p.r, p.n) + '=' + t(p.a) + ')' };
      },
      PRG: (r) => {
        if (r.chance(0.5)) { // Example 2: root first, then the power
          for (;;) {
            const p = pick(r, PP), m = r.int(2, 5);
            if (gcd(m, p.n) !== 1 || p.r ** m > 400 || A2.has(p.a + '|' + m + '|' + p.n)) continue;
            return { q: t(p.a) + '^{' + m + '/' + p.n + '}', a: ['=\\left(' + rt(p.n, t(p.a)) + '\\right)^{' + m + '}=' + p.r + '^{' + m + '}', '=' + t(p.r ** m)] };
          }
        }
        for (;;) { // Examples 3 and 4: convert, one way or the other
          const v = r.pick(LET), n = r.int(2, 6), m = r.int(1, 5), neg = r.chance(0.3);
          if (gcd(m, n) !== 1 || (m === 1 && n === 2 && !neg)) continue;
          const sig = (neg ? '-' : '') + m + '/' + n, rad = rt(n, m === 1 ? v : v + '^{' + m + '}');
          if (r.chance(0.5)) { // power → radical
            if (A4.has(sig)) continue;
            return { text: 'Write as a radical.', q: v + '^{' + sig + '}', a: '=' + (neg ? '\\dfrac{1}{' + rad + '}' : rad) + (m > 1 ? '\\quad\\text{or }' + (neg ? '\\dfrac{1}{\\left(' + rt(n, v) + '\\right)^{' + m + '}}' : '\\left(' + rt(n, v) + '\\right)^{' + m + '}') : '') };
          }
          if (A5.has(sig)) continue; // radical → power
          return { text: 'Write as a power with a rational exponent.', q: neg ? '\\dfrac{1}{' + rad + '}' : rad, a: neg ? '=\\dfrac{1}{' + v + '^{' + m + '/' + n + '}}=' + v + '^{-' + m + '/' + n + '}' : '=' + v + '^{' + m + '/' + n + '}' };
        }
      },
      MAS: (r) => { // Example 5: the laws with fraction exponents, answer with a positive exponent
        const v = r.pick(LET), kind = r.pick(['P', 'P', 'Q', 'Q', 'PP', 'PR']);
        const D = [2, 3, 4, 5, 6, 8];
        for (;;) {
          if (kind === 'P' || kind === 'Q') {
            const d1 = r.pick(D), d2 = r.pick(D), n1 = r.int(1, d1 + 2), n2 = r.int(1, d2 + 2), e1 = fr(n1, d1), e2 = fr(n2, d2);
            if (e1[1] === 1 || e2[1] === 1) continue;
            const L = e1[1] * e2[1] / gcd(e1[1], e2[1]), a1 = e1[0] * L / e1[1], a2 = e2[0] * L / e2[1], tot = kind === 'P' ? a1 + a2 : a1 - a2, res = fr(tot, L);
            if (tot === 0 || L > 12) continue;
            const key = kind + ex(e1) + ',' + ex(e2);
            if (['P1/3,1/6', 'P2/5,1/5', 'P1/4,3/4', 'P1/2,1/2', 'Q5/6,1/6', 'Q3/4,1/4', 'Q7/8,3/8', 'Q1/2,3/2', 'P1/2,1/3', 'P1/2,1/4'].includes(key)) continue;
            const op = kind === 'P' ? '\\times ' : '\\div ', sg = kind === 'P' ? '+' : '-';
            const same = e1[1] === e2[1];
            const lines = ['=' + v + '^{' + ft(e1) + sg + ft(e2) + '}'];
            if (!same) lines.push('=' + v + '^{\\tfrac{' + a1 + '}{' + L + '}' + sg + '\\tfrac{' + a2 + '}{' + L + '}}');
            if (gcd(Math.abs(tot), L) > 1) lines.push('=' + v + '^{' + tot + '/' + L + '}');
            lines.push('=' + posAns(v, res));
            return { q: v + '^{' + ex(e1) + '}' + op + v + '^{' + ex(e2) + '}', a: lines };
          }
          if (kind === 'PP') {
            const d = r.pick(D), n0 = r.int(1, d - 1), e = fr(n0, d), k = r.int(2, 9);
            if (e[1] === 1 || ['1/2|4', '1/3|9'].includes(ex(e) + '|' + k)) continue;
            const res = fr(e[0] * k, e[1]);
            const l1 = '=' + v + '^{' + ft(e) + '\\times' + k + '}';
            return { q: '\\left(' + v + '^{' + ex(e) + '}\\right)^{' + k + '}', a: res[1] === e[1] ? [l1 + '=' + posAns(v, res)] : [l1 + '=' + v + '^{' + (e[0] * k) + '/' + e[1] + '}', '=' + posAns(v, res)] };
          }
          // PR: a number and a fraction power in a bracket, raised to a whole number
          const [c, k] = r.pick([[2, 2], [3, 2], [5, 2], [6, 2], [9, 2], [10, 2], [2, 3], [3, 3], [2, 4], [4, 3]]), d = r.pick([2, 3, 4, 6]), n0 = r.int(1, d - 1), e = fr(n0, d);
          if (e[1] === 1 || (c === 4 && k === 2 && ex(e) === '1/2')) continue;
          const res = fr(e[0] * k, e[1]);
          return { q: '\\left(' + c + v + '^{' + ex(e) + '}\\right)^{' + k + '}', a: ['=' + c + '^{' + k + '}\\,' + v + '^{' + ft(e) + '\\times' + k + '}', '=' + (c ** k) + posAns(v, res)] };
        }
      }
    }
  };
})());
